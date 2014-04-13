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
Board.INITIALSETUP[Common.SCORE] = {};
Board.INITIALSETUP[Common.SCORE][Common.PLAYERSOUTH] = 0;
Board.INITIALSETUP[Common.SCORE][Common.PLAYERNORTH] = 0;

Board.prototype.copy = function ( setup ) {
  this.activePlayer = setup[Common.ACTIVE];
  this.bowls = new Array(Common.BOWLSTOTAL);
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    this.bowls[n] = setup[Common.BOWLS][n];
  }
  this.score = {};
  this.score[Common.PLAYERSOUTH] = setup[Common.SCORE][Common.PLAYERSOUTH];
  this.score[Common.PLAYERNORTH] = setup[Common.SCORE][Common.PLAYERNORTH];
};

Board.prototype.getState = function () {
  var result = {};
  result[Common.ACTIVE] = this.activePlayer;
  result[Common.BOWLS] = this.bowls;
  result[Common.SCORE] = {};
  result[Common.SCORE][Common.PLAYERSOUTH] = this.score[Common.PLAYERSOUTH];
  result[Common.SCORE][Common.PLAYERNORTH] = this.score[Common.PLAYERNORTH];
  return result;
};

Board.prototype.nextPlayer = function() {
  this.activePlayer = Common.PLAYERSOUTH == this.activePlayer ?
    Common.PLAYERNORTH : Common.PLAYERSOUTH;
};

Board.prototype.distribute = function ( move ) {
  var pickedUp = this.bowls[move];
  this.bowls[move] = 0;
  var bowlIndex = move;
  while(pickedUp > 0) {
    bowlIndex = (++bowlIndex) % Common.BOWLSTOTAL;
    if(bowlIndex == move) {
      bowlIndex = (++bowlIndex) % Common.BOWLSTOTAL;
    }
    --pickedUp;
    ++this.bowls[bowlIndex];
  }
  return bowlIndex;
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

Board.prototype.move = function ( move ) {
  var lastBowl = this.distribute(move);
  this.renderScore(lastBowl);
  this.nextPlayer();
  return false;
};

Board.prototype.getWinner = function () {
  return Common.NONE;
};
