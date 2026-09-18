import { describe, expect, it } from 'vitest';
import {
  ACTIONS,
  createInitialState,
  createStore,
  PHASES,
  reducer,
  VIEWS,
} from '../../js/store.js';

describe('createInitialState', () => {
  it('starts on the game view with default settings', () => {
    const state = createInitialState();
    expect(state.view).toBe(VIEWS.GAME);
    expect(state.panelOpen).toBe(false);
    expect(state.board).toBeNull();
    expect(state.phase).toBe(PHASES.IDLE);
    expect(state.settings).toEqual({
      playerSouth: 'Human',
      playerNorth: 'Human',
      sowingSpeed: 600,
      rules: 'Oware',
    });
  });
});

describe('reducer', () => {
  const state = createInitialState();

  it('handles NAVIGATE by changing the view and closing the panel', () => {
    const next = reducer(
      { ...state, panelOpen: true },
      { type: ACTIONS.NAVIGATE, view: VIEWS.RULES }
    );
    expect(next.view).toBe(VIEWS.RULES);
    expect(next.panelOpen).toBe(false);
  });

  it('handles SET_PANEL_OPEN', () => {
    expect(reducer(state, { type: ACTIONS.SET_PANEL_OPEN, open: true }).panelOpen).toBe(true);
  });

  it('handles ENGINE_BOARD_UPDATE by replacing the board snapshot', () => {
    const board = { bowls: [] };
    expect(reducer(state, { type: ACTIONS.ENGINE_BOARD_UPDATE, board }).board).toBe(board);
  });

  it('handles HUMAN_TURN_READY by updating board and phase', () => {
    const board = { bowls: [] };
    const next = reducer(state, { type: ACTIONS.HUMAN_TURN_READY, board });
    expect(next.board).toBe(board);
    expect(next.phase).toBe(PHASES.HUMAN_TURN);
  });

  it('handles AI_THINKING by updating board and phase', () => {
    const board = { bowls: [] };
    const next = reducer(state, { type: ACTIONS.AI_THINKING, board });
    expect(next.board).toBe(board);
    expect(next.phase).toBe(PHASES.AI_THINKING);
  });

  it('handles SETTINGS_CHANGE by merging settings', () => {
    const next = reducer(state, { type: ACTIONS.SETTINGS_CHANGE, settings: { rules: 'Ouril' } });
    expect(next.settings.rules).toBe('Ouril');
    expect(next.settings.playerSouth).toBe('Human');
  });

  it('handles NEW_GAME by resetting phase and closing the panel', () => {
    const next = reducer(
      { ...state, panelOpen: true, phase: PHASES.AI_THINKING },
      { type: ACTIONS.NEW_GAME }
    );
    expect(next.phase).toBe(PHASES.IDLE);
    expect(next.panelOpen).toBe(false);
  });

  it('returns the same state for unknown actions', () => {
    expect(reducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});

describe('createStore', () => {
  it('exposes getState reflecting the current state', () => {
    const store = createStore();
    expect(store.getState()).toEqual(createInitialState());
  });

  it('dispatch updates state and notifies subscribers', () => {
    const store = createStore();
    const seen = [];
    const unsubscribe = store.subscribe((state) => seen.push(state));
    store.dispatch({ type: ACTIONS.SET_PANEL_OPEN, open: true });
    expect(seen).toHaveLength(1);
    expect(seen[0].panelOpen).toBe(true);
    expect(store.getState().panelOpen).toBe(true);
    unsubscribe();
    store.dispatch({ type: ACTIONS.SET_PANEL_OPEN, open: false });
    expect(seen).toHaveLength(1);
  });

  it('accepts a custom initial state', () => {
    const customState = { ...createInitialState(), view: VIEWS.ABOUT };
    expect(createStore(customState).getState().view).toBe(VIEWS.ABOUT);
  });
});
