import { describe, expect, it } from 'vitest';
import {
  advanceTurn,
  Board,
  createBoard,
  doAction,
  examineResult,
  getActions,
  getResult,
  harvest,
  hasPickedUp,
  pickUp,
  setRules,
  sowOnce,
} from '../../js/board.js';
import { NO_BOWL, NORTH, RULES, SOUTH } from '../../js/common.js';

function boardWith(overrides) {
  return { ...createBoard(), ...overrides };
}

describe('createBoard', () => {
  it('creates the standard initial Oware position', () => {
    const board = createBoard();
    expect(board.active).toBe(SOUTH);
    expect(board.bowls).toEqual([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    expect(board.pickedUp).toBe(0);
    expect(board.initialBowl).toBe(NO_BOWL);
    expect(board.latestSown).toBe(NO_BOWL);
    expect(board.nextSowing).toBe(NO_BOWL);
    expect(board.score).toEqual([0, 0]);
    expect(board.rules).toBe(RULES.OWARE);
  });

  it('accepts an explicit rules argument', () => {
    expect(createBoard(RULES.OURIL).rules).toBe(RULES.OURIL);
  });
});

describe('setRules', () => {
  it('returns a new board with the rules replaced, without mutating the input', () => {
    const board = createBoard();
    const next = setRules(board, RULES.OURIL);
    expect(next.rules).toBe(RULES.OURIL);
    expect(board.rules).toBe(RULES.OWARE);
    expect(next).not.toBe(board);
  });
});

describe('pickUp', () => {
  it('empties the chosen bowl and remembers pick-up bookkeeping', () => {
    const board = createBoard();
    const next = pickUp(board, 2);
    expect(next.bowls[2]).toBe(0);
    expect(next.pickedUp).toBe(4);
    expect(next.initialBowl).toBe(2);
    expect(next.latestSown).toBe(NO_BOWL);
    expect(next.nextSowing).toBe(3);
    expect(board.bowls[2]).toBe(4);
  });

  it('does not mutate the bowls array of the input board', () => {
    const board = createBoard();
    const originalBowls = board.bowls;
    pickUp(board, 0);
    expect(board.bowls).toBe(originalBowls);
  });
});

describe('hasPickedUp', () => {
  it('is true while seeds remain to be sown', () => {
    expect(hasPickedUp(pickUp(createBoard(), 0))).toBe(true);
  });

  it('is false once all seeds have been sown', () => {
    expect(hasPickedUp(createBoard())).toBe(false);
  });
});

describe('sowOnce', () => {
  it('sows exactly one seed into the next bowl on the path', () => {
    let board = pickUp(createBoard(), 0);
    board = sowOnce(board);
    expect(board.bowls[1]).toBe(5);
    expect(board.pickedUp).toBe(3);
    expect(board.latestSown).toBe(1);
    expect(board.nextSowing).toBe(2);
  });

  it('skips the initial bowl on wrap-around (Kroo rule)', () => {
    const board = boardWith({ bowls: [13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
    const finalBoard = doAction(board, 0);
    expect(finalBoard.bowls).toEqual([0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe('harvest', () => {
  it('harvests consecutive 2- or 3-seed bowls backwards in the opponent row', () => {
    const board = boardWith({
      active: SOUTH,
      latestSown: 8,
      bowls: [4, 4, 4, 4, 4, 4, 1, 3, 2, 4, 4, 4],
    });
    const harvested = harvest(board);
    expect(harvested.bowls[8]).toBe(0);
    expect(harvested.bowls[7]).toBe(0);
    expect(harvested.bowls[6]).toBe(1);
    expect(harvested.score).toEqual([5, 0]);
  });

  it('does not harvest when landing in the own row', () => {
    const board = boardWith({
      active: SOUTH,
      latestSown: 2,
      bowls: [4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    });
    const harvested = harvest(board);
    expect(harvested).toBe(board);
  });

  it('does not harvest bowls outside 2 or 3 seeds', () => {
    const board = boardWith({
      active: NORTH,
      latestSown: 3,
      bowls: [4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4],
    });
    const harvested = harvest(board);
    expect(harvested.score).toEqual([0, 0]);
  });

  it('harvests for the north player landing in the south row', () => {
    const board = boardWith({
      active: NORTH,
      latestSown: 1,
      bowls: [4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    });
    const harvested = harvest(board);
    expect(harvested.bowls[1]).toBe(0);
    expect(harvested.score).toEqual([0, 2]);
  });
});

describe('getActions', () => {
  it('returns all non-empty own bowls under Oware rules', () => {
    const board = boardWith({ active: SOUTH, bowls: [0, 1, 2, 0, 4, 0, 4, 4, 4, 4, 4, 4] });
    expect(getActions(board)).toEqual([1, 2, 4]);
  });

  it('returns north row bowls when north is active', () => {
    const board = boardWith({ active: NORTH });
    expect(getActions(board)).toEqual([6, 7, 8, 9, 10, 11]);
  });

  it('under Ouril rules, prefers bowls with more than 1 seed', () => {
    const board = boardWith({
      active: SOUTH,
      rules: RULES.OURIL,
      bowls: [1, 2, 1, 3, 0, 1, 4, 4, 4, 4, 4, 4],
    });
    expect(getActions(board)).toEqual([1, 3]);
  });

  it('under Ouril rules, falls back to single-seed bowls when none has more than 1', () => {
    const board = boardWith({
      active: SOUTH,
      rules: RULES.OURIL,
      bowls: [1, 0, 1, 0, 1, 0, 4, 4, 4, 4, 4, 4],
    });
    expect(getActions(board)).toEqual([0, 2, 4]);
  });

  it('returns an empty array when the active row is entirely empty', () => {
    const board = boardWith({ active: SOUTH, bowls: [0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4] });
    expect(getActions(board)).toEqual([]);
  });
});

describe('advanceTurn', () => {
  it('always toggles the active player under Oware rules', () => {
    const board = boardWith({ active: SOUTH, bowls: [0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4] });
    expect(advanceTurn(board).active).toBe(NORTH);
  });

  it('grants an extra turn under Ouril rules when the active player has no actions', () => {
    const board = boardWith({
      active: SOUTH,
      rules: RULES.OURIL,
      bowls: [0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4],
    });
    expect(advanceTurn(board).active).toBe(SOUTH);
  });

  it('toggles under Ouril rules when the active player still has actions', () => {
    const board = boardWith({ active: SOUTH, rules: RULES.OURIL });
    expect(advanceTurn(board).active).toBe(NORTH);
  });
});

describe('examineResult', () => {
  it('composes harvest and advanceTurn', () => {
    const board = boardWith({
      active: SOUTH,
      latestSown: 6,
      bowls: [4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4],
    });
    const result = examineResult(board);
    expect(result.score).toEqual([3, 0]);
    expect(result.active).toBe(NORTH);
  });
});

describe('doAction', () => {
  it('performs a full pick-up/sow/harvest/advance cycle', () => {
    const board = createBoard();
    const next = doAction(board, 2);
    expect(next.bowls).toEqual([4, 4, 0, 5, 5, 5, 5, 4, 4, 4, 4, 4]);
    expect(next.active).toBe(NORTH);
    expect(next.score).toEqual([0, 0]);
  });

  it('never mutates the board passed in', () => {
    const board = createBoard();
    const snapshot = JSON.stringify(board);
    doAction(board, 0);
    expect(JSON.stringify(board)).toBe(snapshot);
  });
});

describe('getResult', () => {
  it('rewards the north player once south exceeds 24 points', () => {
    expect(getResult(boardWith({ score: [25, 0] }))).toEqual([0, 1]);
  });

  it('rewards the south player once north exceeds 24 points', () => {
    expect(getResult(boardWith({ score: [0, 25] }))).toEqual([1, 0]);
  });

  it('returns a near-neutral result while the game is undecided', () => {
    expect(getResult(boardWith({ score: [10, 12] }))).toEqual([0.01, 0.01]);
  });
});

describe('Board adapter', () => {
  it('exposes the initial state through its getters', () => {
    const board = new Board();
    expect(board.active).toBe(SOUTH);
    expect(board.bowls).toEqual(createBoard().bowls);
    expect(board.score).toEqual([0, 0]);
    expect(board.pickedUp).toBe(0);
    expect(board.rules).toBe(RULES.OWARE);
    expect(board.state).toEqual(createBoard());
  });

  it('supports step-by-step pick up, sow and examine (animated sowing)', () => {
    const board = new Board();
    board.pickUp(0);
    expect(board.hasPickedUp()).toBe(true);
    while (board.hasPickedUp()) {
      board.sow();
    }
    board.examineResult();
    expect(board.bowls[0]).toBe(0);
    expect(board.active).toBe(NORTH);
  });

  it('supports one-shot doAction', () => {
    const board = new Board();
    board.doAction(3);
    expect(board.bowls[3]).toBe(0);
  });

  it('copy() detaches the copy from further mutation of the original', () => {
    const board = new Board();
    const copy = board.copy();
    board.doAction(0);
    expect(copy.bowls[0]).toBe(4);
    expect(board.bowls[0]).toBe(0);
  });

  it('setup() resets to a fresh Oware board regardless of prior rules', () => {
    const board = new Board();
    board.setRules(RULES.OURIL);
    board.doAction(0);
    board.setup();
    expect(board.rules).toBe(RULES.OWARE);
    expect(board.bowls).toEqual(createBoard().bowls);
  });

  it('getActions() and getResult() delegate to the pure functions', () => {
    const board = new Board();
    expect(board.getActions()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(board.getResult()).toEqual([0.01, 0.01]);
  });
});
