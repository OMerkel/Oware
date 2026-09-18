import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../js/hmi.js';

class FakeWorker {
  constructor() {
    this.posted = [];
    this.listeners = [];
  }

  postMessage(message) {
    this.posted.push(message);
  }

  addEventListener(_type, callback) {
    this.listeners.push(callback);
  }

  emit(data) {
    for (const listener of this.listeners) {
      listener({ data });
    }
  }
}

function buildFixture() {
  document.body.innerHTML = `
    <header class="app-header">
      <button id="menu-button" type="button"></button>
      <h1 id="game-header-title">Oware</h1>
      <div id="player-badge" hidden>
        <span id="player-badge-symbol"></span>
      </div>
    </header>
    <div id="panel-backdrop" hidden></div>
    <nav id="side-panel" aria-hidden="true">
      <button id="panel-close" type="button"></button>
      <ul>
        <li><a id="new" href="#">New</a></li>
        <li><a href="#" data-navigate="rules">Rules</a></li>
        <li><a href="#" data-navigate="options">Options</a></li>
        <li><a href="#" data-navigate="about">About</a></li>
      </ul>
    </nav>
    <main id="game-page" data-view="game"><div id="board"></div></main>
    <section id="rules-page" data-view="rules" hidden>
      <a href="#" data-navigate-back>Close</a>
    </section>
    <section id="options-menu" data-view="options" hidden>
      <form>
        <input id="firstplayerhuman" name="firstplayer" type="radio" checked />
        <input id="firstplayerai" name="firstplayer" type="radio" />
        <input id="secondplayerhuman" name="secondplayer" type="radio" checked />
        <input id="secondplayerai" name="secondplayer" type="radio" />
        <input id="sowingspeed" type="checkbox" checked />
        <input id="rulesoware" name="rules" type="radio" checked />
        <input id="rulesouril" name="rules" type="radio" />
      </form>
      <a href="#" data-navigate-back>Close</a>
    </section>
    <section id="about-page" data-view="about" hidden>
      <a href="#" data-navigate-back>Close</a>
    </section>
  `;
}

function createTestApp() {
  buildFixture();
  const worker = new FakeWorker();
  const app = createApp({ document, createWorker: () => worker });
  app.init();
  return { app, worker };
}

describe('createApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('requests a game start with the default form settings', () => {
    const { worker } = createTestApp();
    expect(worker.posted).toEqual([
      {
        class: 'request',
        request: 'start',
        settings: { sowingspeed: 600, rules: 'Oware', playersouth: 'Human', playernorth: 'Human' },
      },
    ]);
  });

  it('opens the side panel from the menu button and closes it from the backdrop', () => {
    createTestApp();
    const panel = document.getElementById('side-panel');
    document.getElementById('menu-button').click();
    expect(panel.classList.contains('open')).toBe(true);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    document.getElementById('panel-backdrop').click();
    expect(panel.classList.contains('open')).toBe(false);
  });

  it('closes the panel from the close button', () => {
    createTestApp();
    document.getElementById('menu-button').click();
    document.getElementById('panel-close').click();
    expect(document.getElementById('side-panel').classList.contains('open')).toBe(false);
  });

  it('navigates to a subpage and hides the game board, closing the panel', () => {
    createTestApp();
    document.getElementById('menu-button').click();
    document.querySelector('[data-navigate="rules"]').click();
    expect(document.getElementById('game-page').hidden).toBe(true);
    expect(document.getElementById('rules-page').hidden).toBe(false);
    expect(document.getElementById('options-menu').hidden).toBe(true);
    expect(document.getElementById('side-panel').classList.contains('open')).toBe(false);
  });

  it('navigates back to the game board from a subpage', () => {
    createTestApp();
    document.querySelector('[data-navigate="options"]').click();
    document.querySelector('#options-menu [data-navigate-back]').click();
    expect(document.getElementById('game-page').hidden).toBe(false);
    expect(document.getElementById('options-menu').hidden).toBe(true);
  });

  it('sends a restart request and closes the panel when starting a new game', () => {
    const { worker } = createTestApp();
    worker.posted.length = 0;
    document.getElementById('menu-button').click();
    document.getElementById('new').click();
    expect(worker.posted).toHaveLength(1);
    expect(worker.posted[0]).toMatchObject({ request: 'restart' });
    expect(document.getElementById('side-panel').classList.contains('open')).toBe(false);
  });

  it('renders the board and enters human-turn phase on human_to_move', () => {
    const { app, worker } = createTestApp();
    const board = { bowls: Array(12).fill(4), score: [0, 0] };
    worker.emit({ eventClass: 'request', request: 'human_to_move', board });
    expect(app.store.getState().phase).toBe('human_turn');
    expect(document.querySelectorAll('#board svg')).toHaveLength(1);
  });

  it('forwards a bowl click as a move request only during the human turn', () => {
    const { worker } = createTestApp();
    const board = { bowls: Array(12).fill(4), score: [0, 0] };
    const bowlImage = document.querySelectorAll('#board image[role="button"]')[2];

    worker.posted.length = 0;
    bowlImage.dispatchEvent(new Event('click', { bubbles: true }));
    expect(worker.posted).toEqual([]);

    worker.emit({ eventClass: 'request', request: 'human_to_move', board });
    worker.posted.length = 0;
    bowlImage.dispatchEvent(new Event('click', { bubbles: true }));
    expect(worker.posted).toEqual([
      {
        class: 'request',
        request: 'move',
        bowl: 2,
        settings: { sowingspeed: 600, rules: 'Oware', playersouth: 'Human', playernorth: 'Human' },
      },
    ]);
  });

  it('requests an AI action when the engine reports ai_to_move', () => {
    const { app, worker } = createTestApp();
    worker.posted.length = 0;
    worker.emit({
      eventClass: 'request',
      request: 'ai_to_move',
      board: { bowls: Array(12).fill(4), score: [0, 0] },
    });
    expect(app.store.getState().phase).toBe('ai_thinking');
    expect(worker.posted.at(-1)).toMatchObject({ request: 'action_by_ai' });
  });

  it('re-renders the board on redraw and redraw_sowing without changing phase', () => {
    const { app, worker } = createTestApp();
    worker.emit({
      eventClass: 'request',
      request: 'redraw_sowing',
      board: { bowls: Array(12).fill(4), score: [1, 0] },
    });
    expect(app.store.getState().phase).toBe('idle');
  });

  it('ignores unknown engine requests and non-request messages', () => {
    const { app, worker } = createTestApp();
    worker.emit({ eventClass: 'request', request: 'unknown' });
    worker.emit({ eventClass: 'response', request: 'human_to_move' });
    expect(app.store.getState().phase).toBe('idle');
  });

  it('updates the header title when switching between Oware and Ouril', () => {
    createTestApp();
    document.getElementById('rulesouril').checked = true;
    document.getElementById('rulesouril').dispatchEvent(new Event('change'));
    expect(document.getElementById('game-header-title').textContent).toBe('Ouril');
    document.getElementById('rulesoware').checked = true;
    document.getElementById('rulesoware').dispatchEvent(new Event('change'));
    expect(document.getElementById('game-header-title').textContent).toBe('Oware');
  });

  it('hides the player badge until a board snapshot is known', () => {
    createTestApp();
    expect(document.getElementById('player-badge').hidden).toBe(true);
  });

  it('shows a human/south badge for the active human south player', () => {
    const { worker } = createTestApp();
    worker.emit({
      eventClass: 'request',
      request: 'human_to_move',
      board: { active: 0, bowls: Array(12).fill(4), score: [0, 0] },
    });
    const badge = document.getElementById('player-badge');
    expect(badge.hidden).toBe(false);
    expect(document.getElementById('player-badge-symbol').textContent).toBe('\u{1F9D1}\u25BC');
    expect(badge.getAttribute('aria-label')).toBe('South player: Human');
  });

  it('shows an AI/north badge when the active AI north player is thinking', () => {
    const { worker } = createTestApp();
    document.getElementById('secondplayerai').checked = true;
    worker.emit({
      eventClass: 'request',
      request: 'ai_to_move',
      board: { active: 1, bowls: Array(12).fill(4), score: [0, 0] },
    });
    expect(document.getElementById('player-badge-symbol').textContent).toBe('\u{1F916}\u25B2');
    expect(document.getElementById('player-badge').getAttribute('aria-label')).toBe(
      'North player: AI'
    );
  });

  it('tolerates a missing player badge markup without throwing', () => {
    buildFixture();
    document.getElementById('player-badge').remove();
    const worker = new FakeWorker();
    const app = createApp({ document, createWorker: () => worker });
    expect(() => app.init()).not.toThrow();
  });
});
