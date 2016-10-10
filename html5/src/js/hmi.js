//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

function Hmi() {
  this.verbose = false;
}

Hmi.prototype.engineEventListener = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.eventClass) {
    case 'response':
      this.processEngineResponse( eventReceived );
      break;
    case 'request':
      this.processEngineRequest( eventReceived );
      break;
    default:
      if(this.verbose) console.log('Engine used unknown event class');
  }
}

Hmi.prototype.processEngineResponse = function( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    case 'running':
      if(this.verbose) console.log('Engine reported: ' + data.state);
      break;
    case 'ack_move':
      if(this.verbose) console.log('Engine reported ack move from bowl ' + data.bowl);
      break;
    case 'message':
      if(this.verbose) console.log('Engine reported message: ' + data.message);
      break;
    default:
      if(this.verbose) console.log('Engine reported unknown state');
  }
}

Hmi.prototype.processEngineRequest = function( eventReceived ) {
  var data = eventReceived.data;
  if(this.verbose) console.log('Engine request: ' + data.request);
  switch (data.request) {
    case 'ai_to_move':
      this.engine.postMessage({ class: 'request', request: 'action_by_ai',
        settings: this.getSettings() });
      break;
    case 'human_to_move':
      this.setupBowlSelection(data.board);
      break;
    case 'redraw':
    case 'redraw_sowing':
      this.redraw(data.board);
      break;
    default:
      if(this.verbose) console.log('Engine used unknown request');
  }
}

Hmi.prototype.init = function() {
  if (typeof window.screen.mozLockOrientation != 'undefined') {
    window.screen.mozLockOrientation("landscape-primary");
  }
  var $window = $(window);
  $window.resize( this.update.bind( this ) );
  $window.resize();
  $('#new').click( this.newGame.bind( this ) );
  $('#rulesoware').click( this.setHeader.bind( this ) );
  $('#rulesouril').click( this.setHeader.bind( this ) );
  this.setHeader();
  $( document ).on( 'pagecontainershow', this.sync.bind( this ));
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
        this.score = { south: svgDocument.getElementById('scoresouthvalue'),
          north: svgDocument.getElementById('scorenorthvalue') };
      }
    }
  }
  this.engine = new Worker('js/controller.js');
  this.engine.addEventListener('message',
    this.engineEventListener.bind( this ), false);
  this.engine.postMessage({ class: 'request', request: 'start',
    settings: this.getSettings() });
};

Hmi.prototype.update = function() {
  var innerWidth = window.innerWidth,
    minSize = 32;
  var size = 0.06 * innerWidth < minSize ? minSize : 0.06 * innerWidth;
  $('#customMenu').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  size = 0.05 * innerWidth < minSize ? minSize : 0.05 * innerWidth;
  $('#customBackRules').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  $('#customBackOptions').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  $('#customBackAbout').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
};

Hmi.prototype.redraw = function(board) {
  if (0 == board.pickedUp && this.verbose) {
    console.log('Active player: ' + ['south', 'north'][board.active]);
    var tmp=':';
    for(var n=11; n>5; --n) tmp += board.bowls[n] + ':';
    console.log('Bowls north: ' + tmp);
    tmp=':';
    for(var n=0; n<6; ++n) tmp += board.bowls[n] + ':';
    console.log('Bowls south: ' + tmp);
  }

  tmp=board.score[0];
  this.score.south.textContent = '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '');
  tmp=board.score[1];
  this.score.north.textContent = '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '');

  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    var bowl = this.bowl[n];
    var bonduc = board.bowls[n];
    var bonducShown = bonduc>15 ? 15 : bonduc;
    for(var b=1; b<16; ++b) {
      bowl.bonduc[b].setAttribute('visibility',
        bonducShown!=b ? 'hidden' : 'visible');
    }
    var text = bonduc >= Common.BOWLSTOTAL ? '' + bonduc : '';
    this.bowl[n].text[0].textContent = text;
    this.bowl[n].text[1].textContent = text;
  }
};

Hmi.prototype.setupBowlSelection = function(board) {
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    var bowl = this.bowl[n];
    bowl.element.onclick = ( n < (Common.BOWLSTOTAL>>1) &&
      0 == board.active ) ||
      ( n >= (Common.BOWLSTOTAL>>1) &&
      1 == board.active ) ?
      this.myChoice.bind(this) : null;
  }
};

Hmi.prototype.disableBowlSelection = function() {
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    this.bowl[n].element.onclick = null;
  }
};

Hmi.prototype.getSettings = function() {
  return {
    sowingspeed: $('#sowingspeed').is(':checked') ? 600 : 10,
    rules: $('#rulesoware').is(':checked') ? 'Oware' : 'Ouril',
    playersouth: $('#firstplayerai').is(':checked') ? 'AI' : 'Human',
    playernorth: $('#secondplayerai').is(':checked') ? 'AI' : 'Human'
  };
}

Hmi.prototype.myChoice = function( e ) {
  if (typeof e.currentTarget == 'object') {
    var idBowl = e.currentTarget.id;
    var idBonduc = e.target.id;
    // ECMA-262
    // Desktop Browsers might follow ECMA-262
    // still some Mobile Browsers or Mobile OSes do not implement ECMA-262
    // Mind that depending on ECMA-262: parseInt('08') == 0 might be true
    var bonducInSelectedBowl = Number(idBonduc.slice(-2));
    if(bonducInSelectedBowl>0) {
      this.disableBowlSelection();
      var selectedBowl = Number(idBowl.slice(-2));
      if(this.verbose) console.log('Selected bowl: ' + selectedBowl);
      this.engine.postMessage({ class: 'request', request: 'move',
        bowl: selectedBowl, settings: this.getSettings() });
    }
  }
};

Hmi.prototype.restart = function() {
  this.engine.postMessage({ class: 'request', request: 'restart',
    settings: this.getSettings() });
};

Hmi.prototype.newGame = function() {
  this.restart();
  $( '#left-panel' ).panel( 'close' );
}

Hmi.prototype.setHeader = function() {
  $('#myheader').html( $('#rulesoware').is(':checked') ?
    'Oware' : 'Ouril' );
}

Hmi.prototype.sync = function(event, ui) {
  if( 'game-page' == ui.toPage[0].id ) {
    this.engine.postMessage({ class: 'request', request: 'sync',
      settings: this.getSettings() });
  }
}

function svgWait() {
  var svgEmbed = document.embeds['board'];
  if (typeof svgEmbed != 'undefined') {
    if (typeof svgEmbed.getSVGDocument != 'undefined') {
      var svgDocument = svgEmbed.getSVGDocument();
      if (null != svgDocument) {
        (new Hmi()).init();
      } else {
        setTimeout( svgWait,5 );
      }
    }
  }
}

$( svgWait );
