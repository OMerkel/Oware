//
// Copyright (c) 2014 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('board.js');

var session;

function init() {
  session = new Session();
}

init();

function hmiEventListener( eventReceived ) {
  var data = eventReceived.data;
  switch (data.class) {
    case 'response':
      processHmiResponse( eventReceived );
      break;
    case 'request':
      processHmiRequest( eventReceived );
      break;
    default:
      console.log('Hmi used unknown event class');
  }
}

function processHmiResponse( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    default:
      console.log('Hmi reported unknown state');
  }
}

function processHmiRequest( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'move':
      session.move(data.bowl);
      break;
    case 'start':
    case 'restart':
      session.setup();
      break;
    default:
      console.log('Hmi used unknown request');
  }
  session.draw();
}

self.addEventListener('message', function( ev ) {
  hmiEventListener( ev );
}, false);

function Session() {
  this.board = new Board();
}

Session.prototype.draw = function () {
  self.postMessage({ eventClass: 'request',
    request: 'redraw',
    board: this.board.getState(),
  });
};

Session.prototype.move = function ( bowl ) {
  this.board.pickUp(bowl);
  while(this.board.hasPickedUp()) {
    this.board.sow();
  }
  this.board.renderScore(this.board.latestSown);
  this.board.nextPlayer();
};

Session.prototype.setup = function () {
  this.board.copy( Board.INITIALSETUP );
};
