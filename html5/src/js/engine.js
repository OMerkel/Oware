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
      session.move(data);
      break;
    case 'start':
    case 'restart':
      session.setup();
      session.draw();
      break;
    default:
      console.log('Hmi used unknown request');
  }
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

Session.prototype.drawSowing = function () {
  self.postMessage({ eventClass: 'request',
    request: 'redraw_sowing',
    board: this.board.getState(),
  });
};

Session.prototype.examineResult = function () {
  this.board.renderScore(this.board.latestSown);
  this.board.nextPlayer();
  this.draw();
};

Session.prototype.distribute = function () {
  if(this.board.hasPickedUp()) {
    this.drawSowing();
    this.board.sow();
    setTimeout( this.distribute.bind(this), this.sowingSpeed );
  }
  else {
    this.examineResult();
  }
};

Session.prototype.move = function ( data ) {
  this.board.pickUp(data.bowl);
  this.sowingSpeed = data.sowingspeed;
  this.distribute();
};

Session.prototype.setup = function () {
  this.board.copy( Board.INITIALSETUP );
};
