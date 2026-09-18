//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//
// Main-thread composition: wires navigation, options, renderer and worker.
//

import { SOUTH } from './common.js';
import { createRenderer } from './renderer.js';
import { ACTIONS, createStore, PHASES, VIEWS } from './store.js';

const PLAYER_BADGE_ICON = Object.freeze({ Human: '\u{1F9D1}', AI: '\u{1F916}' });
const PLAYER_BADGE_ARROW = Object.freeze({ south: '\u25BC', north: '\u25B2' });

function readSettingsFromForm(doc) {
  return {
    sowingspeed: doc.getElementById('sowingspeed').checked ? 600 : 10,
    rules: doc.getElementById('rulesoware').checked ? 'Oware' : 'Ouril',
    playersouth: doc.getElementById('firstplayerai').checked ? 'AI' : 'Human',
    playernorth: doc.getElementById('secondplayerai').checked ? 'AI' : 'Human',
  };
}

function applyView(doc, view) {
  for (const page of doc.querySelectorAll('[data-view]')) {
    page.hidden = page.dataset.view !== view;
  }
}

function applyPanelOpen(doc, open) {
  const panel = doc.getElementById('side-panel');
  const backdrop = doc.getElementById('panel-backdrop');
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  backdrop.hidden = !open;
}

function applyHeaderTitle(doc) {
  const header = doc.getElementById('game-header-title');
  if (header) {
    header.textContent = doc.getElementById('rulesoware').checked ? 'Oware' : 'Ouril';
  }
}

/** Shows the active player's kind (Human/AI) and side (south ▼ / north ▲). */
function applyPlayerBadge(doc, board) {
  const badge = doc.getElementById('player-badge');
  const symbol = doc.getElementById('player-badge-symbol');
  if (!badge || !symbol) {
    return;
  }
  if (!board) {
    badge.hidden = true;
    return;
  }
  const settings = readSettingsFromForm(doc);
  const isSouth = board.active === SOUTH;
  const kind = isSouth ? settings.playersouth : settings.playernorth;
  badge.hidden = false;
  symbol.textContent = `${PLAYER_BADGE_ICON[kind]}${PLAYER_BADGE_ARROW[isSouth ? 'south' : 'north']}`;
  badge.setAttribute('aria-label', `${isSouth ? 'South' : 'North'} player: ${kind}`);
}

function render(doc, state) {
  applyView(doc, state.view);
  applyPanelOpen(doc, state.panelOpen);
  applyHeaderTitle(doc);
  applyPlayerBadge(doc, state.board);
}

/**
 * Creates the main-thread application. Accepts injectable `document` and
 * `createWorker` for testability; defaults to the real browser globals.
 */
export function createApp({
  document: doc = document,
  createWorker = () => new Worker(new URL('./controller.js', import.meta.url), { type: 'module' }),
} = {}) {
  const store = createStore();
  const boardContainer = doc.getElementById('board');
  const engine = createWorker();

  function postToEngine(request, extra = {}) {
    engine.postMessage({
      class: 'request',
      request,
      settings: readSettingsFromForm(doc),
      ...extra,
    });
  }

  const renderer = createRenderer(boardContainer, (bowl) => {
    if (store.getState().phase === PHASES.HUMAN_TURN) {
      postToEngine('move', { bowl });
    }
  });

  function handleEngineRequest(data) {
    switch (data.request) {
      case 'ai_to_move':
        store.dispatch({ type: ACTIONS.AI_THINKING, board: data.board });
        postToEngine('action_by_ai');
        break;
      case 'human_to_move':
        store.dispatch({ type: ACTIONS.HUMAN_TURN_READY, board: data.board });
        break;
      case 'redraw':
      case 'redraw_sowing':
        store.dispatch({ type: ACTIONS.ENGINE_BOARD_UPDATE, board: data.board });
        break;
      default:
        break;
    }
  }

  engine.addEventListener('message', (event) => {
    if (event.data.eventClass === 'request') {
      handleEngineRequest(event.data);
    }
  });

  store.subscribe((state) => {
    render(doc, state);
    if (state.board) {
      renderer.render(state.board);
    }
  });

  function navigateTo(view) {
    store.dispatch({ type: ACTIONS.NAVIGATE, view });
  }

  function openPanel(open) {
    store.dispatch({ type: ACTIONS.SET_PANEL_OPEN, open });
  }

  function newGame() {
    store.dispatch({ type: ACTIONS.NEW_GAME });
    postToEngine('restart');
  }

  function wireNavigation() {
    doc.getElementById('menu-button').addEventListener('click', () => openPanel(true));
    doc.getElementById('panel-backdrop').addEventListener('click', () => openPanel(false));
    doc.getElementById('panel-close').addEventListener('click', () => openPanel(false));
    doc.getElementById('new').addEventListener('click', () => newGame());

    for (const link of doc.querySelectorAll('[data-navigate]')) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo(link.dataset.navigate);
        if (link.dataset.navigate !== VIEWS.GAME) {
          openPanel(false);
        }
      });
    }

    for (const link of doc.querySelectorAll('[data-navigate-back]')) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo(VIEWS.GAME);
      });
    }
  }

  function wireOptions() {
    doc.getElementById('rulesoware').addEventListener('change', () => applyHeaderTitle(doc));
    doc.getElementById('rulesouril').addEventListener('change', () => applyHeaderTitle(doc));
  }

  function init() {
    wireNavigation();
    wireOptions();
    applyHeaderTitle(doc);
    render(doc, store.getState());
    postToEngine('start');
  }

  return { init, store, engine };
}

/* c8 ignore start -- browser bootstrap, exercised via e2e tests */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => createApp().init());
}
/* c8 ignore stop */
