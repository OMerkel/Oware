import { beforeEach, describe, expect, it } from 'vitest';
import { createRenderer } from '../../js/renderer.js';

describe('createRenderer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('builds an SVG board with the board image, score display and 12 bowls', () => {
    createRenderer(container, () => {});
    const svg = container.querySelector('svg.oware-board');
    expect(svg).not.toBeNull();
    expect(svg.getAttribute('viewBox')).toBe('0 0 1200 676');
    expect(svg.querySelectorAll('image')).toHaveLength(1 + 2 + 12);
    expect(svg.querySelectorAll('text')).toHaveLength(2 + 12 * 2);
  });

  it('reports the clicked bowl index', () => {
    const onBowlSelected = [];
    createRenderer(container, (bowl) => onBowlSelected.push(bowl));
    const bowlImages = container.querySelectorAll('image[role="button"]');
    bowlImages[5].dispatchEvent(new Event('click', { bubbles: true }));
    expect(onBowlSelected).toEqual([5]);
  });

  it('renders scores with a trailing dot for 6 and 9, plain otherwise', () => {
    const { render } = createRenderer(container, () => {});
    render({ bowls: Array(12).fill(4), score: [6, 9] });
    const texts = container.querySelectorAll('svg > text');
    expect(texts[0].textContent).toBe('6.');
    expect(texts[1].textContent).toBe('9.');
    render({ bowls: Array(12).fill(4), score: [3, 10] });
    expect(texts[0].textContent).toBe('3');
    expect(texts[1].textContent).toBe('10');
  });

  it('shows bowl seed counts only from 12 seeds upward and clamps sprite selection at 15', () => {
    const { render } = createRenderer(container, () => {});
    const bowls = [0, 1, 11, 12, 15, 20, 4, 4, 4, 4, 4, 4];
    render({ bowls, score: [0, 0] });
    const bowlImages = container.querySelectorAll('image[role="button"]');
    expect(bowlImages[0].getAttribute('href')).toMatch(/trou-bonduc00\.png$/);
    expect(bowlImages[4].getAttribute('href')).toMatch(/trou-bonduc15\.png$/);
    expect(bowlImages[5].getAttribute('href')).toMatch(/trou-bonduc15\.png$/);

    const bowlTexts = container.querySelectorAll('svg > text');
    // index 0-1 are the score texts, bowl texts follow in north/south pairs.
    const bowl2NorthText = bowlTexts[2 + 2 * 2];
    const bowl3NorthText = bowlTexts[2 + 3 * 2];
    expect(bowl2NorthText.textContent).toBe('');
    expect(bowl3NorthText.textContent).toBe('12');
  });

  it('replaces any previous content in the container on repeated creation', () => {
    createRenderer(container, () => {});
    createRenderer(container, () => {});
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });
});
