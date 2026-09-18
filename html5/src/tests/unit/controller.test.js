import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Controller } from '../../js/controller.js';

function baseSettings(overrides = {}) {
  return {
    playersouth: 'Human',
    playernorth: 'Human',
    sowingspeed: 0,
    rules: 'Oware',
    ...overrides,
  };
}

function requestEvent(request, extra = {}) {
  return { data: { class: 'request', request, ...extra, settings: baseSettings(extra.settings) } };
}

describe('Controller', () => {
  let posted;
  let controller;

  beforeEach(() => {
    vi.useFakeTimers();
    posted = [];
    controller = new Controller((message) => posted.push(message));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ignores events that are not requests', () => {
    controller.handleHmiEvent({ data: { class: 'response' } });
    expect(posted).toEqual([]);
  });

  it('ignores unknown requests without throwing', () => {
    controller.handleHmiEvent(requestEvent('unknown'));
    expect(posted).toEqual([]);
  });

  it('start sets up the board and hands control to the human south player', () => {
    controller.handleHmiEvent(requestEvent('start'));
    expect(posted[0]).toMatchObject({ request: 'redraw' });
    expect(posted[1]).toMatchObject({ request: 'human_to_move' });
    expect(posted[1].board.active).toBe(0);
  });

  it('start immediately triggers the AI when south is configured as AI', () => {
    const fakeUct = { getActionInfo: () => ({ action: 0, info: 'stub' }) };
    controller = new Controller(
      (message) => posted.push(message),
      () => fakeUct
    );
    controller.handleHmiEvent(requestEvent('start', { settings: { playersouth: 'AI' } }));
    vi.runAllTimers();
    expect(posted.some((message) => message.request === 'redraw_sowing')).toBe(true);
    expect(posted.at(-1).request).toBe('human_to_move');
  });

  it('restart behaves like start', () => {
    controller.handleHmiEvent(requestEvent('restart'));
    expect(posted[0]).toMatchObject({ request: 'redraw' });
  });

  it('sync re-applies settings and redraws without changing the board', () => {
    controller.handleHmiEvent(requestEvent('start'));
    posted.length = 0;
    controller.handleHmiEvent(requestEvent('sync'));
    expect(posted).toEqual([
      { eventClass: 'request', request: 'redraw', board: controller.board.state },
    ]);
  });

  it('rejects illegal moves by simply redrawing the current board', () => {
    controller.handleHmiEvent(requestEvent('start'));
    posted.length = 0;
    controller.handleHmiEvent(requestEvent('move', { bowl: 11 }));
    expect(posted).toEqual([
      { eventClass: 'request', request: 'redraw', board: controller.board.state },
    ]);
  });

  it('applies a legal move, animates sowing and hands off to the next player', () => {
    controller.handleHmiEvent(requestEvent('start'));
    posted.length = 0;
    controller.handleHmiEvent(requestEvent('move', { bowl: 0 }));
    vi.runAllTimers();
    const sowingMessages = posted.filter((message) => message.request === 'redraw_sowing');
    expect(sowingMessages).toHaveLength(4);
    expect(posted.at(-1)).toMatchObject({ request: 'human_to_move' });
    expect(posted.at(-1).board.bowls).toEqual([0, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4]);
  });

  it('requests an AI move and applies the returned action', () => {
    const fakeUct = { getActionInfo: vi.fn(() => ({ action: 1, info: 'stub info' })) };
    controller = new Controller(
      (message) => posted.push(message),
      () => fakeUct
    );
    controller.handleHmiEvent(requestEvent('start'));
    posted.length = 0;
    controller.handleHmiEvent(requestEvent('action_by_ai'));
    vi.runAllTimers();
    expect(fakeUct.getActionInfo).toHaveBeenCalledWith(controller.board, 300000, 5000, 50, 70);
    expect(posted.at(-1).board.bowls[1]).toBe(0);
  });

  it('hands off to the AI player when it becomes their turn', () => {
    const fakeUct = { getActionInfo: () => ({ action: 6, info: 'stub' }) };
    controller = new Controller(
      (message) => posted.push(message),
      () => fakeUct
    );
    controller.handleHmiEvent(requestEvent('start', { settings: { playernorth: 'AI' } }));
    posted.length = 0;
    controller.handleHmiEvent(requestEvent('move', { bowl: 0, settings: { playernorth: 'AI' } }));
    vi.runAllTimers();
    expect(posted.at(-1)).toMatchObject({ request: 'ai_to_move' });
  });

  it('logs verbose AI info when verbose is enabled', () => {
    const fakeUct = { getActionInfo: () => ({ action: 0, info: 'verbose info' }) };
    controller = new Controller(
      (message) => posted.push(message),
      () => fakeUct
    );
    controller.verbose = true;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    controller.handleHmiEvent(requestEvent('start', { settings: { playersouth: 'AI' } }));
    vi.runAllTimers();
    expect(logSpy).toHaveBeenCalledWith('verbose info');
    logSpy.mockRestore();
  });

  it('logs a message for unknown requests when verbose is enabled', () => {
    controller.verbose = true;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    controller.handleHmiEvent(requestEvent('unknown'));
    expect(logSpy).toHaveBeenCalledWith('Hmi used unknown request');
    logSpy.mockRestore();
  });

  it('logs a message for unknown event classes when verbose is enabled', () => {
    controller.verbose = true;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    controller.handleHmiEvent({ data: { class: 'response' } });
    expect(logSpy).toHaveBeenCalledWith('Hmi used unknown event class');
    logSpy.mockRestore();
  });

  it('init registers a message listener', () => {
    const addEventListenerSpy = vi
      .spyOn(globalThis, 'addEventListener')
      .mockImplementation(() => {});
    controller.init();
    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function), false);
    addEventListenerSpy.mockRestore();
  });
});
