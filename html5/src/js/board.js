//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//
// Pure Oware/Ouril board state transitions, plus a thin mutable adapter
// class (`Board`) used by the UCT engine and the worker controller.
//

import {
  BOWLS_TOTAL,
  NO_BOWL,
  NORTH,
  NORTH_ROW,
  RULES,
  SEEDS_PER_BOWL,
  SOUTH,
  SOUTH_ROW,
} from './common.js';

/** Creates the initial immutable board state. */
export function createBoard(rules = RULES.OWARE) {
  return {
    active: SOUTH,
    bowls: Array(BOWLS_TOTAL).fill(SEEDS_PER_BOWL),
    pickedUp: 0,
    initialBowl: NO_BOWL,
    latestSown: NO_BOWL,
    nextSowing: NO_BOWL,
    score: [0, 0],
    rules,
  };
}

/** Returns a board with a different rule set applied. */
export function setRules(board, rules) {
  return { ...board, rules };
}

function nextBowlIndex(initialBowl, bowl) {
  const index = (bowl + 1) % BOWLS_TOTAL;
  return index === initialBowl ? (index + 1) % BOWLS_TOTAL : index;
}

/** Picks up all seeds from `bowl`, leaving it empty. */
export function pickUp(board, bowl) {
  return {
    ...board,
    pickedUp: board.bowls[bowl],
    bowls: board.bowls.map((seeds, index) => (index === bowl ? 0 : seeds)),
    initialBowl: bowl,
    latestSown: NO_BOWL,
    nextSowing: nextBowlIndex(bowl, bowl),
  };
}

/** True while seeds picked up on this turn still need to be sown. */
export function hasPickedUp(board) {
  return board.pickedUp > 0;
}

/** Sows exactly one seed into the next bowl along the sowing path. */
export function sowOnce(board) {
  const bowlIndex = board.nextSowing;
  return {
    ...board,
    pickedUp: board.pickedUp - 1,
    bowls: board.bowls.map((seeds, index) => (index === bowlIndex ? seeds + 1 : seeds)),
    latestSown: bowlIndex,
    nextSowing: nextBowlIndex(board.initialBowl, bowlIndex),
  };
}

/** Harvests 2- or 3-seed bowls backwards from the latest sown bowl. */
export function harvest(board) {
  const scoreLimitIndex = board.latestSown >= BOWLS_TOTAL / 2 ? BOWLS_TOTAL / 2 : 0;
  const landedInOpponentRow =
    (board.active === SOUTH && scoreLimitIndex !== 0) ||
    (board.active === NORTH && scoreLimitIndex === 0);
  if (!landedInOpponentRow) {
    return board;
  }
  const bowls = board.bowls.slice();
  const score = [...board.score];
  let bowlIndex = board.latestSown;
  while (bowlIndex >= scoreLimitIndex && (bowls[bowlIndex] === 2 || bowls[bowlIndex] === 3)) {
    score[board.active] += bowls[bowlIndex];
    bowls[bowlIndex] = 0;
    bowlIndex -= 1;
  }
  return { ...board, bowls, score };
}

/** Legal bowls the active player may pick up from. */
export function getActions(board) {
  const own = board.active === SOUTH ? SOUTH_ROW : NORTH_ROW;
  const threshold = board.rules === RULES.OWARE ? 0 : 1;
  const result = own.filter((bowl) => board.bowls[bowl] > threshold);
  return result.length > 0 ? result : own.filter((bowl) => board.bowls[bowl] === 1);
}

/** Advances to the next player, honoring the Ouril extra-turn exception. */
export function advanceTurn(board) {
  const mustRepeatTurn = board.rules !== RULES.OWARE && getActions(board).length === 0;
  return mustRepeatTurn ? board : { ...board, active: 1 - board.active };
}

/** Applies harvesting followed by turn advancement. */
export function examineResult(board) {
  return advanceTurn(harvest(board));
}

/** Picks up, fully sows, harvests and advances the turn in one step. */
export function doAction(board, bowl) {
  let next = pickUp(board, bowl);
  while (hasPickedUp(next)) {
    next = sowOnce(next);
  }
  return examineResult(next);
}

/** UCT reward vector: a decisive win/loss once a player passes 24 seeds. */
export function getResult(board) {
  if (board.score[SOUTH] > 24) return [0, 1];
  if (board.score[NORTH] > 24) return [1, 0];
  return [0.01, 0.01];
}

/**
 * Thin mutable adapter around the pure board functions above, used by the
 * UCT search tree and the worker controller which expect stateful,
 * step-by-step access (for animated sowing) as well as instant moves.
 */
export class Board {
  #state;

  constructor(state = createBoard()) {
    this.#state = state;
  }

  copy() {
    return new Board(this.#state);
  }

  setup(rules = RULES.OWARE) {
    this.#state = createBoard(rules);
  }

  setRules(rules) {
    this.#state = setRules(this.#state, rules);
  }

  pickUp(bowl) {
    this.#state = pickUp(this.#state, bowl);
  }

  hasPickedUp() {
    return hasPickedUp(this.#state);
  }

  sow() {
    this.#state = sowOnce(this.#state);
  }

  examineResult() {
    this.#state = examineResult(this.#state);
  }

  doAction(bowl) {
    this.#state = doAction(this.#state, bowl);
  }

  getActions() {
    return getActions(this.#state);
  }

  getResult() {
    return getResult(this.#state);
  }

  get active() {
    return this.#state.active;
  }

  get bowls() {
    return this.#state.bowls;
  }

  get score() {
    return this.#state.score;
  }

  get pickedUp() {
    return this.#state.pickedUp;
  }

  get rules() {
    return this.#state.rules;
  }

  /** Plain, structured-clone-friendly snapshot of the current state. */
  get state() {
    return this.#state;
  }
}
