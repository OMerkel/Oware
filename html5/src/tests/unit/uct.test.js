import { describe, expect, it } from 'vitest';
import { Board } from '../../js/board.js';
import { Uct } from '../../js/uct/uct.js';

function stubBoard(actions) {
  return {
    active: 0,
    getActions: () => [...actions],
    copy() {
      return this;
    },
    doAction() {},
    getResult: () => [0.01, 0.01],
  };
}

describe('Uct.getActionInfo', () => {
  it('returns immediately when no action is available', () => {
    const uct = new Uct();
    const result = uct.getActionInfo(stubBoard([]), 100, 100, 5, 5);
    expect(result).toEqual({ action: null, info: 'No action available.' });
  });

  it('returns immediately when exactly one action is available', () => {
    const uct = new Uct();
    const result = uct.getActionInfo(stubBoard([4]), 100, 100, 5, 5);
    expect(result).toEqual({ action: 4, info: 'Just 1 action available.' });
  });

  it('runs Monte Carlo search and returns a legal action among several', () => {
    const uct = new Uct();
    const board = new Board();
    const result = uct.getActionInfo(board, 300, 150, 5, 10);
    expect(board.getActions()).toContain(result.action);
    expect(result.info).toMatch(/nodes\/sec examined\.$/);
  });

  it('honors the iteration budget over the time budget when time is generous', () => {
    const uct = new Uct();
    const board = new Board();
    const result = uct.getActionInfo(board, 60, 60000, 5, 10);
    expect(board.getActions()).toContain(result.action);
  });
});
