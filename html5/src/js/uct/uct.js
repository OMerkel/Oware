//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//

import { UctNode } from './uctnode.js';

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function selectAndExpand(root, board, maxLookAhead) {
  let node = root;
  const variantBoard = board.copy();
  let lookAhead = maxLookAhead;

  while (node.unexamined.length === 0 && node.children.length > 0 && lookAhead > 0) {
    node = node.selectChild();
    variantBoard.doAction(node.action);
    lookAhead -= 1;
  }

  if (node.unexamined.length > 0) {
    const index = randomIndex(node.unexamined.length);
    variantBoard.doAction(node.unexamined[index]);
    node = node.addChild(variantBoard, index);
  }

  return { node, variantBoard, lookAhead };
}

function simulate(variantBoard, depth, lookAhead) {
  let actions = variantBoard.getActions();
  let remainingDepth = depth;
  let remainingLookAhead = lookAhead;
  let nodesVisited = 0;
  while (actions.length > 0 && remainingDepth > 0 && remainingLookAhead > 0) {
    variantBoard.doAction(actions[randomIndex(actions.length)]);
    nodesVisited += 1;
    actions = variantBoard.getActions();
    remainingDepth -= 1;
    remainingLookAhead -= 1;
  }
  return nodesVisited;
}

function backpropagate(node, result) {
  let current = node;
  while (current) {
    current.update(result);
    current = current.parentNode;
  }
}

export class Uct {
  getActionInfo(board, maxIterations, maxTime, maxDepthSimulation, maxLookAhead) {
    const root = new UctNode(null, board, null);

    if (root.unexamined.length > 1) {
      const startTime = Date.now();
      const timeLimit = startTime + maxTime;
      const blockSize = 50;
      let nodesVisited = 0;

      for (
        let iterations = 0;
        iterations < maxIterations && Date.now() < timeLimit;
        iterations += blockSize
      ) {
        for (let i = 0; i < blockSize; i += 1) {
          const { node, variantBoard, lookAhead } = selectAndExpand(root, board, maxLookAhead);
          nodesVisited += simulate(variantBoard, maxDepthSimulation, lookAhead);
          backpropagate(node, variantBoard.getResult());
        }
      }

      const duration = Date.now() - startTime;
      return {
        action: root.mostVisitedChild().action,
        info: `${Math.floor((nodesVisited * 1000.0) / duration)} nodes/sec examined.`,
      };
    }

    if (root.unexamined.length === 1) {
      return { action: root.unexamined[0], info: 'Just 1 action available.' };
    }

    return { action: null, info: 'No action available.' };
  }
}
