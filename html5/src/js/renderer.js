//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//
// Vanilla SVG board renderer (replaces the former Raphael-based renderer).
// Draws the 12-bowl Oware board, per-bowl seed sprites/counts and both
// players' scores, and reports bowl clicks via `onBowlSelected`.
//

import { BOWLS_TOTAL } from './common.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const BOARD_IMAGE = 'img/board01.jpg';
const BONDUC_ICON = 'img/bonduc01-256.png';
const MAX_BONDUC_SPRITE = 15;
const BONDUC_FILES = Array.from(
  { length: MAX_BONDUC_SPRITE + 1 },
  (_, n) => `img/trou-bonduc${String(n).padStart(2, '0')}.png`
);

const BOWL_SIZE = Object.freeze({ width: 168, height: 164 });
const BOWL_LAYOUT = Object.freeze([
  { x: 79, y: 334 },
  { x: 258, y: 334 },
  { x: 438, y: 336 },
  { x: 616, y: 336 },
  { x: 798, y: 338 },
  { x: 980, y: 340 },
  { x: 984, y: 160 },
  { x: 802, y: 157 },
  { x: 620, y: 155 },
  { x: 438, y: 153 },
  { x: 262, y: 151 },
  { x: 82, y: 149 },
]);

const TEXT_ATTRS = Object.freeze({
  'font-style': 'normal',
  'font-weight': 'bold',
  'text-anchor': 'start',
  fill: '#ffcc00',
  'font-family': 'Arial, Helvetica, sans-serif',
});
const SCORE_TEXT_ATTRS = Object.freeze({ ...TEXT_ATTRS, 'font-size': '64' });
const BOWL_TEXT_ATTRS = Object.freeze({ ...TEXT_ATTRS, 'font-size': '48' });

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

function setHref(image, href) {
  image.setAttribute('href', href);
  image.setAttributeNS(XLINK_NS, 'href', href);
}

function createImage(x, y, width, height, href) {
  const image = createSvgElement('image', { x, y, width, height });
  setHref(image, href);
  return image;
}

function createText(x, y, attrs) {
  return createSvgElement('text', { x, y, ...attrs });
}

function formatScore(score) {
  return `${score}${score === 6 || score === 9 ? '.' : ''}`;
}

function bonducSprite(seedCount) {
  return BONDUC_FILES[Math.min(seedCount, MAX_BONDUC_SPRITE)];
}

function bowlLabel(seedCount) {
  return seedCount >= 12 ? String(seedCount) : '';
}

function createBowl(svg, position, index, onBowlSelected) {
  const image = createImage(
    position.x,
    position.y,
    BOWL_SIZE.width,
    BOWL_SIZE.height,
    BONDUC_FILES[0]
  );
  image.style.cursor = 'pointer';
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Bowl ${index + 1}`);
  image.addEventListener('click', () => onBowlSelected(index));

  const textNorth = createText(0, 0, BOWL_TEXT_ATTRS);
  textNorth.setAttribute(
    'transform',
    `translate(${position.x + BOWL_SIZE.width}, ${position.y + 21}) rotate(180, 0, 0)`
  );

  const textSouth = createText(0, 0, BOWL_TEXT_ATTRS);
  textSouth.setAttribute('transform', `translate(${position.x}, ${position.y + 142})`);

  svg.append(image, textNorth, textSouth);
  return { image, textNorth, textSouth };
}

function createScoreDisplay(svg) {
  const southImage = createImage(910, 575, 34, 30, BONDUC_ICON);
  const southText = createText(956, 595, SCORE_TEXT_ATTRS);

  const northImage = createImage(910, 575, 34, 30, BONDUC_ICON);
  northImage.setAttribute('transform', 'rotate(180, 600, 338)');
  const northText = createText(956, 595, SCORE_TEXT_ATTRS);
  northText.setAttribute('transform', 'rotate(180, 600, 338)');

  svg.append(southImage, southText, northImage, northText);
  return { south: southText, north: northText };
}

/**
 * Builds the SVG board inside `container` and wires bowl click handling.
 * Returns `{ render(boardState) }`.
 */
export function createRenderer(container, onBowlSelected) {
  const svg = createSvgElement('svg', {
    viewBox: '0 0 1200 676',
    class: 'oware-board',
  });
  container.replaceChildren(svg);
  svg.append(createImage(0, 0, 1200, 676, BOARD_IMAGE));

  const score = createScoreDisplay(svg);
  const bowls = BOWL_LAYOUT.map((position, index) =>
    createBowl(svg, position, index, onBowlSelected)
  );

  function render(board) {
    score.south.textContent = formatScore(board.score[0]);
    score.north.textContent = formatScore(board.score[1]);
    for (let index = 0; index < BOWLS_TOTAL; index += 1) {
      const seeds = board.bowls[index];
      setHref(bowls[index].image, bonducSprite(seeds));
      const label = bowlLabel(seeds);
      bowls[index].textNorth.textContent = label;
      bowls[index].textSouth.textContent = label;
    }
  }

  return { render };
}
