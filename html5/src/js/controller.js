//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('board.js');
importScripts('uct/uctnode.js');
importScripts('uct/uct.js');

function Controller() {
  this.board = new Board();
  this.board.setup();
  this.uct = new Uct();
  this.verbose = false;
  this.settings = {
    playerSouth : 'Human',
    playerNorth : 'Human',
    sowingSpeed : 600
  };
}

Controller.prototype.hmiEventListener = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.class) {
    case 'response':
      this.processHmiResponse( eventReceived );
      break;
    case 'request':
      this.processHmiRequest( eventReceived );
      break;
    default:
      if(this.verbose) console.log('Hmi used unknown event class');
  }
}

Controller.prototype.processHmiResponse = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    default:
      if(this.verbose) console.log('Hmi reported unknown state');
  }
}

Controller.prototype.processHmiRequest = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'action_by_ai':
      this.updateSettings( data.settings );
      var actionInfo = this.uct.getActionInfo( this.board, 300000, 5000, 50, 70 );
      this.move(actionInfo.action);
      if(this.verbose) {
        console.log(actionInfo.info);
      }
      break;
    case 'move':
      this.updateSettings( data.settings );
      this.move(data.bowl);
      break;
    case 'start':
    case 'restart':
      this.board.setup();
      this.updateSettings( data.settings );
      this.draw();
      if ( 'AI' == this.settings.playerSouth ) {
        var actionInfo = this.uct.getActionInfo( this.board, 60000, 3000, 50, 70 );
        this.move(actionInfo.action);
        if(this.verbose) {
          console.log(actionInfo.info);
        }
      } else {
        self.postMessage({ eventClass: 'request', request: 'human_to_move',
          board: this.board.copy(),
        });
      }
      /* if(this.verbose) {
        var moves = this.board.getActions(), out = '';
        for(var index=0; index<moves.length; ++index) {
          out += moves[index] + (index<moves.length-1 ? ', ' : '');
        }
        console.log(out);
        console.log('Which bowl to move?');
        var actionInfo = this.uct.getActionInfo( this.board, 60000, 3000, 50, 70 );
        console.log(actionInfo.action);
        console.log(actionInfo.info);
      } */
      break;
    case 'sync':
      this.updateSettings( data.settings );
      this.draw();
      break;
    default:
      if(this.verbose) console.log('Hmi used unknown request');
  }
}

Controller.prototype.updateSettings = function ( settings ) {
  this.settings = {
    playerSouth : settings.playersouth,
    playerNorth : settings.playernorth,
    sowingSpeed : settings.sowingspeed
  };
  this.board.setRules( settings.rules );
};

Controller.prototype.draw = function () {
  self.postMessage({ eventClass: 'request', request: 'redraw',
    board: this.board.copy(),
  });
};

Controller.prototype.drawSowing = function () {
  self.postMessage({ eventClass: 'request', request: 'redraw_sowing',
    board: this.board.copy(),
  });
};

Controller.prototype.examineResult = function () {
  this.board.renderScore();
  this.board.nextPlayer();
};

Controller.prototype.distribute = function () {
  if(this.board.hasPickedUp()) {
    this.drawSowing();
    this.board.sow();
    setTimeout( this.distribute.bind(this), this.settings.sowingSpeed );
  } else {
    this.examineResult();
    this.draw();
    /* if(this.verbose) {
      var moves = this.board.getActions(), out = '';
      for(var index=0; index<moves.length; ++index) {
        out += moves[index] + (index<moves.length-1 ? ', ' : '');
      }
      console.log(out);
      console.log('Which bowl to move?');
      var actionInfo = this.uct.getActionInfo( this.board, 60000, 5000, 50, 70 );
      console.log(actionInfo.action);
      console.log(actionInfo.info);
    }
     */
    if( ( 0 == this.board.active && 'AI' == this.settings.playerSouth ) ||
        ( 1 == this.board.active && 'AI' == this.settings.playerNorth ) ) {
      self.postMessage({ eventClass: 'request', request: 'ai_to_move',
        board: this.board.copy(),
      });
    } else {
      self.postMessage({ eventClass: 'request', request: 'human_to_move',
        board: this.board.copy(),
      });
    }
  }
};

Controller.prototype.move = function ( bowl ) {
  var validMove = false;
  var moves = this.board.getActions();
  for(var index=0; index<moves.length; ++index) {
    validMove |= bowl == moves[index];
  }
  if (validMove) {
    this.board.pickUp(bowl);
    this.distribute();
  } else {
    this.draw();
  }
};

Controller.prototype.init = function() {
  addEventListener('message', this.hmiEventListener.bind( this ), false);
};

(new Controller()).init();
