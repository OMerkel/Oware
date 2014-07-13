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
  if( 'Ouril' == this.rules && 0 == this.getMoves().length ) {
    this.board.nextPlayer();
  }
};

Session.prototype.distribute = function () {
  if(this.board.hasPickedUp()) {
    this.drawSowing();
    this.board.sow();
    setTimeout( this.distribute.bind(this), this.sowingSpeed );
  } else {
    this.examineResult();
    this.draw();
  }
};

Session.prototype.getMoves = function () {
  var result = [];
  var singles = [];
  var tmp = Common.PLAYERSOUTH == this.board.activePlayer ?
    [ 0, 1, 2, 3, 4, 5 ] : [ 6, 7, 8, 9, 10, 11 ];
  if('Oware' == this.rules) {
    result = tmp;
  } else {
    for(var index=0; index<tmp.length; ++index) {
      if ( 1 < this.board.bowls[tmp[index]] ) {
        result[result.length] = tmp[index];
      } else if ( 1 == this.board.bowls[tmp[index]] ) {
        singles[singles.length] = tmp[index];
      }
    }
    result = 0 == result.length ? singles : result;
  }
  return result;
};

Session.prototype.move = function ( data ) {
  this.sowingSpeed = data.sowingspeed;
  this.rules = data.rules;
  var validMove = false;
  var moves = this.getMoves();
  for(var index=0; index<moves.length; ++index) {
    validMove |= data.bowl == moves[index];
  }
  if (validMove) {
    this.board.pickUp(data.bowl);
    this.distribute();
  }
  else {
    this.draw();
  }
};

Session.prototype.setup = function () {
  this.board.copy( Board.INITIALSETUP );
};
