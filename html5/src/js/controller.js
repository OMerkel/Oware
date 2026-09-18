//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//
// Worker-owned game orchestration: the sole writer of board state.
//

import { Board } from './board.js';
import { PLAYERS, RULES } from './common.js';
import { Uct } from './uct/uct.js';

const AI_MOVE_BUDGET = {
  maxIterations: 300000,
  maxTime: 5000,
  maxDepthSimulation: 50,
  maxLookAhead: 70,
};
const AI_OPENING_BUDGET = {
  maxIterations: 60000,
  maxTime: 3000,
  maxDepthSimulation: 50,
  maxLookAhead: 70,
};

function toSettings(rawSettings) {
  return {
    playerSouth: rawSettings.playersouth,
    playerNorth: rawSettings.playernorth,
    sowingSpeed: rawSettings.sowingspeed,
    rules: rawSettings.rules,
  };
}

export class Controller {
  constructor(post = (message) => self.postMessage(message), createUct = () => new Uct()) {
    this.board = new Board();
    this.uct = createUct();
    this.verbose = false;
    this.post = post;
    this.settings = {
      playerSouth: PLAYERS.HUMAN,
      playerNorth: PLAYERS.HUMAN,
      sowingSpeed: 600,
      rules: RULES.OWARE,
    };
  }

  handleHmiEvent(eventReceived) {
    const data = eventReceived.data;
    if (data.class === 'request') {
      this.processHmiRequest(data);
    } else if (this.verbose) {
      console.log('Hmi used unknown event class');
    }
  }

  processHmiRequest(data) {
    switch (data.request) {
      case 'action_by_ai':
        this.updateSettings(data.settings);
        this.moveWithAi(AI_MOVE_BUDGET);
        break;
      case 'move':
        this.updateSettings(data.settings);
        this.move(data.bowl);
        break;
      case 'start':
      case 'restart':
        this.startGame(data.settings);
        break;
      case 'sync':
        this.updateSettings(data.settings);
        this.draw();
        break;
      default:
        if (this.verbose) console.log('Hmi used unknown request');
    }
  }

  startGame(rawSettings) {
    this.board.setup();
    this.updateSettings(rawSettings);
    this.draw();
    if (this.settings.playerSouth === PLAYERS.AI) {
      this.moveWithAi(AI_OPENING_BUDGET);
    } else {
      this.post({ eventClass: 'request', request: 'human_to_move', board: this.board.state });
    }
  }

  moveWithAi(budget) {
    const actionInfo = this.uct.getActionInfo(
      this.board,
      budget.maxIterations,
      budget.maxTime,
      budget.maxDepthSimulation,
      budget.maxLookAhead
    );
    if (this.verbose) console.log(actionInfo.info);
    this.move(actionInfo.action);
  }

  updateSettings(rawSettings) {
    this.settings = toSettings(rawSettings);
    this.board.setRules(this.settings.rules);
  }

  draw() {
    this.post({ eventClass: 'request', request: 'redraw', board: this.board.state });
  }

  drawSowing() {
    this.post({ eventClass: 'request', request: 'redraw_sowing', board: this.board.state });
  }

  distribute() {
    if (this.board.hasPickedUp()) {
      this.drawSowing();
      this.board.sow();
      setTimeout(() => this.distribute(), this.settings.sowingSpeed);
      return;
    }
    this.board.examineResult();
    this.draw();
    const activePlayer =
      this.board.active === 0 ? this.settings.playerSouth : this.settings.playerNorth;
    this.post({
      eventClass: 'request',
      request: activePlayer === PLAYERS.AI ? 'ai_to_move' : 'human_to_move',
      board: this.board.state,
    });
  }

  move(bowl) {
    const isValidMove = this.board.getActions().includes(bowl);
    if (isValidMove) {
      this.board.pickUp(bowl);
      this.distribute();
    } else {
      this.draw();
    }
  }

  init() {
    addEventListener('message', (event) => this.handleHmiEvent(event), false);
  }
}

/* c8 ignore start -- worker bootstrap only runs in a real Worker context */
if (
  typeof WorkerGlobalScope !== 'undefined' &&
  typeof self !== 'undefined' &&
  self instanceof WorkerGlobalScope
) {
  new Controller().init();
}
/* c8 ignore stop */
