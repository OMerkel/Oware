import { describe, expect, it } from 'vitest';
import {
  BOWLS_TOTAL,
  NO_BOWL,
  NORTH,
  NORTH_ROW,
  PLAYERS,
  RULES,
  SEEDS_PER_BOWL,
  SOUTH,
  SOUTH_ROW,
} from '../../js/common.js';

describe('common constants', () => {
  it('defines the board size and initial seed count', () => {
    expect(BOWLS_TOTAL).toBe(12);
    expect(SEEDS_PER_BOWL).toBe(4);
  });

  it('defines the two players as indices 0 and 1', () => {
    expect(SOUTH).toBe(0);
    expect(NORTH).toBe(1);
  });

  it('defines the row bowl indices', () => {
    expect(SOUTH_ROW).toEqual([0, 1, 2, 3, 4, 5]);
    expect(NORTH_ROW).toEqual([6, 7, 8, 9, 10, 11]);
  });

  it('defines rules and player-kind enums', () => {
    expect(RULES).toEqual({ OWARE: 'Oware', OURIL: 'Ouril' });
    expect(PLAYERS).toEqual({ HUMAN: 'Human', AI: 'AI' });
  });

  it('defines the sentinel NO_BOWL value', () => {
    expect(NO_BOWL).toBe(-1);
  });

  it('freezes exported enum objects', () => {
    expect(Object.isFrozen(RULES)).toBe(true);
    expect(Object.isFrozen(PLAYERS)).toBe(true);
    expect(Object.isFrozen(SOUTH_ROW)).toBe(true);
    expect(Object.isFrozen(NORTH_ROW)).toBe(true);
  });
});
