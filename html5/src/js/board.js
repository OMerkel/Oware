//
// Copyright (c) 2014 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('common.js');

function Board() {}

Board.INITIALSETUP = {};
Board.INITIALSETUP[Common.ACTIVE] = Common.INITIALPLAYER;
Board.INITIALSETUP[Common.BOWLS] = [
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL,
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL,
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL,
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL,
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL,
    Common.BONDUCPERBOWL, Common.BONDUCPERBOWL
  ];
Board.INITIALSETUP[Common.PICKEDUP] = 0;
Board.INITIALSETUP[Common.INITIALBOWL] = Common.NOBOWL;
Board.INITIALSETUP[Common.LATESTSOWN] = Common.NOBOWL;
Board.INITIALSETUP[Common.NEXTSOWING] = Common.NOBOWL;
Board.INITIALSETUP[Common.SCORE] = {};
Board.INITIALSETUP[Common.SCORE][Common.PLAYERSOUTH] = 0;
Board.INITIALSETUP[Common.SCORE][Common.PLAYERNORTH] = 0;

Board.prototype.copy = function ( setup ) {
  this.activePlayer = setup[Common.ACTIVE];
  this.bowls = new Array(Common.BOWLSTOTAL);
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    this.bowls[n] = setup[Common.BOWLS][n];
  }
  this.pickedUp = setup[Common.PICKEDUP];
  this.initialBowl = setup[Common.INITIALBOWL];
  this.latestSown = setup[Common.LATESTSOWN];
  this.nextSowing = setup[Common.NEXTSOWING];
  this.score = {};
  this.score[Common.PLAYERSOUTH] = setup[Common.SCORE][Common.PLAYERSOUTH];
  this.score[Common.PLAYERNORTH] = setup[Common.SCORE][Common.PLAYERNORTH];
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
  this.activePlayer = Common.PLAYERSOUTH == this.activePlayer ?
    Common.PLAYERNORTH : Common.PLAYERSOUTH;
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

Board.prototype.renderScore = function ( lastBowl ) {
  var bowlIndex = lastBowl;
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
