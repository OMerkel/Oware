//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//
// Reactive state container and reducer for the main-thread UI.
//

export const VIEWS = Object.freeze({
  GAME: 'game',
  RULES: 'rules',
  OPTIONS: 'options',
  ABOUT: 'about',
});

export const PHASES = Object.freeze({
  IDLE: 'idle',
  HUMAN_TURN: 'human_turn',
  AI_THINKING: 'ai_thinking',
});

export const ACTIONS = Object.freeze({
  NAVIGATE: 'NAVIGATE',
  SET_PANEL_OPEN: 'SET_PANEL_OPEN',
  ENGINE_BOARD_UPDATE: 'ENGINE_BOARD_UPDATE',
  HUMAN_TURN_READY: 'HUMAN_TURN_READY',
  AI_THINKING: 'AI_THINKING',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  NEW_GAME: 'NEW_GAME',
});

export function createInitialState() {
  return {
    view: VIEWS.GAME,
    panelOpen: false,
    board: null,
    phase: PHASES.IDLE,
    settings: {
      playerSouth: 'Human',
      playerNorth: 'Human',
      sowingSpeed: 600,
      rules: 'Oware',
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.NAVIGATE:
      return { ...state, view: action.view, panelOpen: false };
    case ACTIONS.SET_PANEL_OPEN:
      return { ...state, panelOpen: action.open };
    case ACTIONS.ENGINE_BOARD_UPDATE:
      return { ...state, board: action.board };
    case ACTIONS.HUMAN_TURN_READY:
      return { ...state, board: action.board, phase: PHASES.HUMAN_TURN };
    case ACTIONS.AI_THINKING:
      return { ...state, board: action.board, phase: PHASES.AI_THINKING };
    case ACTIONS.SETTINGS_CHANGE:
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case ACTIONS.NEW_GAME:
      return { ...state, phase: PHASES.IDLE, panelOpen: false };
    default:
      return state;
  }
}

/** Minimal pub/sub store built around the pure `reducer` above. */
export function createStore(initialState = createInitialState()) {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    for (const listener of listeners) {
      listener(state);
    }
    return state;
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, dispatch, subscribe };
}
