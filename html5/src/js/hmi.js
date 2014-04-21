//
// Copyright (c) 2014 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

var hmi, engine;

function engineEventListener( eventReceived ) {
  var data = eventReceived.data;
  switch (data.eventClass) {
    case 'response':
      processEngineResponse( eventReceived );
      break;
    case 'request':
      processEngineRequest( eventReceived );
      break;
    default:
      console.log('Engine used unknown event class');
  }
}

function processEngineResponse( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    case 'running':
      console.log('Engine reported: ' + data.state);
      break;
    case 'ack_move':
      console.log('Engine reported ack move from bowl ' + data.bowl);
      break;
    case 'message':
      console.log('Engine reported message: ' + data.message);
      break;
    default:
      console.log('Engine reported unknown state');
  }
}

function processEngineRequest( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'redraw':
      console.log('Engine request: ' + data.request);
      hmi.redraw(data.board);
      break;
    case 'oware':
      console.log('Game won by player ' + data.winner);
      hmi.winner = data.winner;
      break;
    default:
      console.log('Engine used unknown request');
  }
}

function myChoice( e ) {
  if (typeof e.currentTarget == 'object') {
    var idBowl = e.currentTarget.id;
    var idBonduc = e.explicitOriginalTarget.id;
    // ECMA-262
    // Desktop Browsers might follow ECMA-262
    // still some Mobile Browsers or Mobile OSes do not implement ECMA-262
    // Mind that depending on ECMA-262: parseInt('08') == 0 might be true
    var bonducInSelectedBowl = Number(idBonduc.slice(-2));
    if(bonducInSelectedBowl>0) {
      var selectedBowl = Number(idBowl.slice(-2));
      console.log('Selected bowl: ' + selectedBowl);
      engine.postMessage({ class: 'request',
        request: 'move', bowl: selectedBowl });
    }
  }
}

function Hmi() {
  this.winner = Common.NONE;
}

Hmi.prototype.init = function() {
  var svgEmbed = document.embeds['board'];
  if (typeof svgEmbed != 'undefined') {
    if (typeof svgEmbed.getSVGDocument != 'undefined') {
      var svgDocument = svgEmbed.getSVGDocument();
      this.bowl = new Array();
      for(var n=0; n<Common.BOWLSTOTAL; ++n) {
        var idBowl = 'bowl' + (('0' + n).slice(-2));
        this.bowl[n] = { element: svgDocument.getElementById(idBowl),
          bonduc: new Array(), text: new Array() };
        for(var b=0; b<16; ++b) {
          var idBonduc = 'bonduc' + (('0' + b).slice(-2));
          this.bowl[n].bonduc[b] = svgDocument.getElementById(idBowl + idBonduc);
        }
        this.bowl[n].text[0] = svgDocument.getElementById(idBowl + 'bonduc15plus1text');
        this.bowl[n].text[1] = svgDocument.getElementById(idBowl + 'bonduc15plus2text');
        this.score = {};
        this.score[Common.PLAYERSOUTH] = svgDocument.getElementById('scoresouthvalue');
        this.score[Common.PLAYERNORTH] = svgDocument.getElementById('scorenorthvalue');
      }
    }
  }
};

Hmi.prototype.update = function() {
  console.log('resize / update');
};

Hmi.prototype.redraw = function(board) {
  console.log('Active player: ' + board[Common.ACTIVE]);
  var tmp=':';
  for(var n=11; n>5; --n) tmp += board[Common.BOWLS][n] + ':';
  console.log('Bowls north: ' + tmp);
  tmp=':';
  for(var n=0; n<6; ++n) tmp += board[Common.BOWLS][n] + ':';
  console.log('Bowls south: ' + tmp);

  tmp=board[Common.SCORE][Common.PLAYERSOUTH];
  this.score[Common.PLAYERSOUTH].textContent = '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '');
  tmp=board[Common.SCORE][Common.PLAYERNORTH];
  this.score[Common.PLAYERNORTH].textContent = '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '');

  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    var bowl = this.bowl[n];
    var bonduc = board[Common.BOWLS][n];
    var bonducShown = bonduc>15 ? 15 : bonduc;
    for(var b=1; b<16; ++b) {
      bowl.bonduc[b].setAttribute('visibility',
        bonducShown!=b ? 'hidden' : 'visible');
    }
    var text = bonduc >= Common.BOWLSTOTAL ? '' + bonduc : '';
    this.bowl[n].text[0].textContent = text;
    this.bowl[n].text[1].textContent = text;

    bowl.element.onclick = (n < (Common.BOWLSTOTAL>>1) &&
      board[Common.ACTIVE] == Common.PLAYERSOUTH) ||
      (n >= (Common.BOWLSTOTAL>>1) &&
      board[Common.ACTIVE] == Common.PLAYERNORTH) ?
      myChoice : null;
  }

};

Hmi.prototype.restart = function() {
  engine.postMessage({ 'class': 'request', 'request': 'restart' });
};

function newGame() {
  hmi.restart();
}

function init() {
  if (typeof window.screen.mozLockOrientation != 'undefined') {
    window.screen.mozLockOrientation("landscape-primary");
  }
  hmi = new Hmi();
  hmi.init();
  var $window = $(window);
  $window.resize( hmi.update );
  engine = new Worker('js/engine.js');
  engine.addEventListener('message', function( ev ) {
    engineEventListener( ev );
  }, false);
  engine.postMessage({ class: 'request', request: 'start' });
  $window.resize();
  $('#new').click( newGame );
}

function svgWait() {
  var svgEmbed = document.embeds['board'];
  if (typeof svgEmbed != 'undefined') {
    if (typeof svgEmbed.getSVGDocument != 'undefined') {
      var svgDocument = svgEmbed.getSVGDocument();
      if (null != svgDocument) {
        init();
      }
      else {
        setTimeout( svgWait,5 );
      }
    }
  }
}

$( svgWait );
