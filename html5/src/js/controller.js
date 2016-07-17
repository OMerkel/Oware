//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('board.js');

function Controller() {
  this.board = new Board();
  this.board.setup();
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
      console.log('Hmi used unknown event class');
  }
}

Controller.prototype.processHmiResponse = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    default:
      console.log('Hmi reported unknown state');
  }
}

Controller.prototype.processHmiRequest = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'move':
      this.move(data);
      break;
    case 'start':
    case 'restart':
      this.board.setup()
      this.board.setRules( data.rules );
      this.draw();
      break;
    case 'sync':
      this.board.setRules( data.rules );
      this.draw();
      break;
    default:
      console.log('Hmi used unknown request');
  }
}

Controller.prototype.draw = function () {
  self.postMessage({ eventClass: 'request', request: 'redraw',
    board: this.board.getState(),
  });
};

Controller.prototype.drawSowing = function () {
  self.postMessage({ eventClass: 'request', request: 'redraw_sowing',
    board: this.board.getState(),
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
    setTimeout( this.distribute.bind(this), this.sowingSpeed );
  } else {
    this.examineResult();
    this.draw();
  }
};

Controller.prototype.move = function ( data ) {
  this.sowingSpeed = data.sowingspeed;
  this.board.setRules( data.rules );
  var validMove = false;
  var moves = this.board.getActions();
  for(var index=0; index<moves.length; ++index) {
    validMove |= data.bowl == moves[index];
  }
  if (validMove) {
    this.board.pickUp(data.bowl);
    this.distribute();
  }
};

Controller.prototype.init = function() {
  addEventListener('message', this.hmiEventListener.bind( this ), false);
};

(new Controller()).init();
