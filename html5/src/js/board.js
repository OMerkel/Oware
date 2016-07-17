//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('common.js');

function Board() {}

Board.prototype.setup = function () {
  this.activePlayer = Common.INITIALPLAYER;
  this.bowls = [];
  for(var i=0; i<Common.BOWLSTOTAL; ++i) {
    this.bowls[i] = Common.BONDUCPERBOWL;
  }
  this.pickedUp = 0;
  this.initialBowl = Common.NOBOWL;
  this.latestSown = Common.NOBOWL;
  this.nextSowing = Common.NOBOWL;
  this.score = {};
  this.score[Common.PLAYERSOUTH] = 0;
  this.score[Common.PLAYERNORTH] = 0;
  this.rules = Common.OWARE;
};

Board.prototype.copy = function () {
  var board = new Board();
  board.activePlayer = this.activePlayer;
  board.bowls = [];
  for(var i=0; i<Common.BOWLSTOTAL; ++i) {
    board.bowls[i] = this.bowls[i];
  }
  board.pickedUp = this.pickedUp;
  board.initialBowl = this.initialBowl;
  board.latestSown = this.latestSown;
  board.nextSowing = this.nextSowing;
  board.score = {};
  board.score[Common.PLAYERSOUTH] = this.score[Common.PLAYERSOUTH];
  board.score[Common.PLAYERNORTH] = this.score[Common.PLAYERNORTH];
  board.rules = this.rules;
  return board;
};

Board.prototype.setRules = function ( rules ) {
  this.rules = rules;
};

Board.prototype.getState = function () {
  var result = {};
  result[Common.ACTIVE] = this.activePlayer;
  result[Common.BOWLS] = this.bowls;
  result[Common.PICKEDUP] = this.pickedUp;
  result[Common.INITIALBOWL] = this.initialBowl;
  result[Common.LATESTSOWN] = this.latestSown;
  result[Common.NEXTSOWING] = this.nextSowing;
  result[Common.SCORE] = {};
  result[Common.SCORE][Common.PLAYERSOUTH] = this.score[Common.PLAYERSOUTH];
  result[Common.SCORE][Common.PLAYERNORTH] = this.score[Common.PLAYERNORTH];
  return result;
};

Board.prototype.nextPlayer = function() {
  if( 'Oware' == this.rules || 0 != this.getActions().length ) {
    this.activePlayer = Common.PLAYERSOUTH == this.activePlayer ?
      Common.PLAYERNORTH : Common.PLAYERSOUTH;
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
  if ( (Common.PLAYERSOUTH == this.activePlayer &&
        scoreLimitIndex != 0) ||
       (Common.PLAYERNORTH == this.activePlayer &&
        scoreLimitIndex == 0) ) {
    while ( bowlIndex >= scoreLimitIndex &&
      ( this.bowls[bowlIndex] == 2 || this.bowls[bowlIndex] == 3 ) ) {
      this.score[this.activePlayer] += this.bowls[bowlIndex];
      this.bowls[bowlIndex] = 0;
      --bowlIndex;
    }
  }
};

Board.prototype.getWinner = function () {
  return Common.NONE;
};

Board.prototype.getActions = function () {
  var result = [];
  var singles = [];
  var tmp = Common.PLAYERSOUTH == this.activePlayer ?
    [ 0, 1, 2, 3, 4, 5 ] : [ 6, 7, 8, 9, 10, 11 ];
  if('Oware' == this.rules) {
    result = tmp;
  } else {
    for(var index=0; index<tmp.length; ++index) {
      if ( 1 < this.bowls[tmp[index]] ) {
        result[result.length] = tmp[index];
      } else if ( 1 == this.bowls[tmp[index]] ) {
        singles[singles.length] = tmp[index];
      }
    }
    result = 0 == result.length ? singles : result;
  }
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

Board.prototype.doActions = function ( bowl ) {
  this.pickUp(bowl);
  this.distribute();
};
