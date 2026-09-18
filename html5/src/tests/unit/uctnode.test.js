import { describe, expect, it, vi } from 'vitest';
import { UctNode } from '../../js/uct/uctnode.js';

function fakeBoard(actions, active = 0) {
  return {
    active,
    getActions: () => [...actions],
  };
}

describe('UctNode', () => {
  it('captures the unexamined actions and active player from the board', () => {
    const node = new UctNode(null, fakeBoard([1, 2, 3], 1), null);
    expect(node.unexamined).toEqual([1, 2, 3]);
    expect(node.activePlayer).toBe(1);
    expect(node.children).toEqual([]);
    expect(node.wins).toBe(0);
    expect(node.visits).toBe(0);
  });

  it('addChild removes the action from unexamined and appends a child', () => {
    const node = new UctNode(null, fakeBoard([1, 2, 3]), null);
    const child = node.addChild(fakeBoard([4, 5]), 1);
    expect(node.unexamined).toEqual([1, 3]);
    expect(node.children).toEqual([child]);
    expect(child.action).toBe(2);
    expect(child.parentNode).toBe(node);
  });

  it('update accumulates visits and the active player reward', () => {
    const node = new UctNode(null, fakeBoard([1]), null);
    node.activePlayer = 0;
    node.update([0.75, 0.25]);
    node.update([1, 0]);
    expect(node.visits).toBe(2);
    expect(node.wins).toBeCloseTo(1.75);
  });

  it('selectChild picks the child with the highest UCT value', () => {
    const node = new UctNode(null, fakeBoard([]), null);
    node.visits = 10;
    const worse = node.addChild(fakeBoard([]), undefined);
    worse.wins = 1;
    worse.visits = 5;
    const better = node.addChild(fakeBoard([]), undefined);
    better.wins = 4;
    better.visits = 5;
    expect(node.selectChild()).toBe(better);
  });

  it('selectChild returns null when there are no children', () => {
    const node = new UctNode(null, fakeBoard([]), null);
    expect(node.selectChild()).toBeNull();
  });

  it('mostVisitedChild returns the child visited most often', () => {
    const node = new UctNode(null, fakeBoard([]), null);
    const a = node.addChild(fakeBoard([]), undefined);
    a.visits = 3;
    const b = node.addChild(fakeBoard([]), undefined);
    b.visits = 9;
    expect(node.mostVisitedChild()).toBe(b);
  });

  it('mostVisitedChild returns null when there are no children', () => {
    const node = new UctNode(null, fakeBoard([]), null);
    expect(node.mostVisitedChild()).toBeNull();
  });

  it('logs child stats when verbose is enabled', () => {
    const node = new UctNode(null, fakeBoard([]), null);
    const a = node.addChild(fakeBoard([]), undefined);
    a.visits = 2;
    a.wins = 1;
    node.verbose = true;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    node.mostVisitedChild();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
