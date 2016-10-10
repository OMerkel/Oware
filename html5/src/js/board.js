//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('common.js');

function Board() {}

Board.prototype.setup = function () {
  this.active = 0;
  this.bowls = [];
  for(var i=0; i<Common.BOWLSTOTAL; ++i) {
    this.bowls[i] = Common.BONDUCPERBOWL;
  }
  this.pickedUp = 0;
  this.initialBowl = Common.NOBOWL;
  this.latestSown = Common.NOBOWL;
  this.nextSowing = Common.NOBOWL;
  this.score = [ 0, 0 ];
  this.rules = Common.OWARE;
};

Board.prototype.copy = function () {
  var board = new Board();
  board.active = this.active;
  board.bowls = [];
  for(var i=0; i<Common.BOWLSTOTAL; ++i) {
    board.bowls[i] = this.bowls[i];
  }
  board.pickedUp = this.pickedUp;
  board.initialBowl = this.initialBowl;
  board.latestSown = this.latestSown;
  board.nextSowing = this.nextSowing;
  board.score = [ this.score[0], this.score[1] ];
  board.rules = this.rules;
  return board;
};

Board.prototype.setRules = function ( rules ) {
  this.rules = rules;
};

Board.prototype.nextPlayer = function() {
  if( 'Oware' == this.rules || 0 != this.getActions().length ) {
    this.active = 1 - this.active;
  }
};

Board.prototype.nextBowl = function ( bowl ) {
  var bowlIndex = (++bowl) % Common.BOWLSTOTAL;
  if(bowlIndex == this.initialBowl) {
    bowlIndex = (++bowlIndex) % Common.BOWLSTOTAL;
  }
  return bowlIndex;
};

Board.prototype.pickUp = function ( bowl ) {
  this.pickedUp = this.bowls[bowl];
  this.bowls[bowl] = 0;
  this.initialBowl = bowl;
  this.latestSown = Common.NOBOWL;
  this.nextSowing = this.nextBowl(bowl);
};

Board.prototype.hasPickedUp = function () {
  return this.pickedUp > 0;
};

Board.prototype.sow = function () {
  var bowlIndex = this.nextSowing;
  --this.pickedUp;
  ++this.bowls[bowlIndex];
  this.latestSown = bowlIndex;
  this.nextSowing = this.nextBowl(bowlIndex);
};

Board.prototype.renderScore = function () {
  var bowlIndex = this.latestSown;
  var scoreLimitIndex = bowlIndex >= (Common.BOWLSTOTAL>>1) ?
    (Common.BOWLSTOTAL>>1) : 0;
  if ( (0 == this.active && scoreLimitIndex != 0) ||
       (1 == this.active && scoreLimitIndex == 0) ) {
    while ( bowlIndex >= scoreLimitIndex &&
      ( this.bowls[bowlIndex] == 2 || this.bowls[bowlIndex] == 3 ) ) {
      this.score[this.active] += this.bowls[bowlIndex];
      this.bowls[bowlIndex] = 0;
      --bowlIndex;
    }
  }
};

Board.prototype.getActions = function () {
  var result = [];
  var singles = [];
  var tmp = [ [ 0, 1, 2, 3, 4, 5 ], [ 6, 7, 8, 9, 10, 11 ] ][this.active];
  for(var index=0; index<tmp.length; ++index) {
    if ( ('Oware' == this.rules ? 0 : 1) < this.bowls[tmp[index]] ) {
      result[result.length] = tmp[index];
    } else if ( 1 == this.bowls[tmp[index]] ) {
      singles[singles.length] = tmp[index];
    }
  }
  result = 0 == result.length ? singles : result;
  return result;
};

Board.prototype.examineResult = function () {
  this.renderScore();
  this.nextPlayer();
};

Board.prototype.distribute = function () {
  if(this.hasPickedUp()) {
    this.sow();
    this.distribute();
  } else {
    this.examineResult();
  }
};

Board.prototype.doAction = function ( bowl ) {
  this.pickUp(bowl);
  this.distribute();
};

Board.prototype.getResult = function () {
  return this.score[0] > 24 ? [ 0, 1 ] :
    this.score[1] > 24 ? [ 1, 0 ] : [ 0.01, 0.01 ];
};

Board.prototype.repr = function() {
  console.log('Active player: ' + ['south', 'north'][this.active]);
  var tmp=':';
  for(var n=11; n>5; --n) tmp += this.bowls[n] + ':';
  console.log('Bowls north: ' + tmp);
  tmp=':';
  for(var n=0; n<6; ++n) tmp += this.bowls[n] + ':';
  console.log('Bowls south: ' + tmp);
  console.log( this.score[0] + '/' + this.score[1] );
};
