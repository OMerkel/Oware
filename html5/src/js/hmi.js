//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

Hmi.FILEBOARD = 'img/board01.jpg';
Hmi.FILEBONDUC = 'img/bonduc01-256.png';

function Hmi() {
  this.verbose = false;
  Hmi.FILEBONDUCS = [];
  for(var n=0; n<16; ++n) {
    Hmi.FILEBONDUCS[n] = 'img/trou-bonduc' + (('0' + n).slice(-2)) + '.png';
  }
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
};

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
};

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
};

Hmi.prototype.initBoard = function() {
  var attrScoreText = {
    'font-size': '64px',
    'font-style': 'normal',
    'font-weight': 'bold',
    'line-height': '125%',
    'text-anchor': 'start',
    fill: '#ffcc00',
    'font-family': 'Arial, Helvetica, sans-serif'
  };
  var attrBowlText = {
    'font-size': '48px',
    'font-style': 'normal',
    'font-weight': 'bold',
    'line-height': '125%',
    'text-anchor': 'start',
    fill: '#ffcc00',
    'font-family': 'Arial, Helvetica, sans-serif'
  };
  this.paper = Raphael( 'board', 2*600, 2*338 );
  this.paper.setViewBox( 0, 0, 1200, 676, false );
  this.imgBoard = this.paper.image( Hmi.FILEBOARD, 0, 0, 1200, 676);
  this.score = {
    north: {
      img: this.paper.image( Hmi.FILEBONDUC, 910, 575, 34, 30).rotate(180, 600, 338),
      text: this.paper.text( 956, 595, '' ).attr( attrScoreText ).rotate(180, 600, 338)
    },
    south: {
      img: this.paper.image( Hmi.FILEBONDUC, 910, 575, 34, 30),
      text: this.paper.text( 956, 595, '' ).attr( attrScoreText )
    }
  };
  
  this.bowlDimension = { width: 168, height: 164 };
  this.bowl = [
    { x:  79, y: 334 }, { x: 258, y: 334 }, { x: 438, y: 336 },
    { x: 616, y: 336 }, { x: 798, y: 338 }, { x: 980, y: 340 },
    { x: 984, y: 160 }, { x: 802, y: 157 }, { x: 620, y: 155 },
    { x: 438, y: 153 }, { x: 262, y: 151 }, { x:  82, y: 149 }
  ];
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    this.bowl[n].image = this.paper.image( Hmi.FILEBONDUCS[0],
      this.bowl[n].x, this.bowl[n].y, this.bowlDimension.width, this.bowlDimension.height );
    this.bowl[n].textNorth = this.paper.text( 0, 0, '16' ).attr( attrBowlText )
      .translate( this.bowl[n].x + 168, this.bowl[n].y + 21 ).rotate( 180, 0, 0 );
    this.bowl[n].textSouth = this.paper.text( 0, 0, '16' ).attr( attrBowlText )
      .translate( this.bowl[n].x, this.bowl[n].y + 142 );
  }
};

Hmi.prototype.init = function() {
  this.initBoard();
  var $window = $(window);
  $window.resize( this.update.bind( this ) );
  $window.resize();
  $('#new').click( this.newGame.bind( this ) );
  $('#rulesoware').click( this.setHeader.bind( this ) );
  $('#rulesouril').click( this.setHeader.bind( this ) );
  this.setHeader();
  this.engine = new Worker('js/controller.js');
  this.engine.addEventListener('message',
    this.engineEventListener.bind( this ), false);
  this.engine.postMessage({ class: 'request', request: 'start',
    settings: this.getSettings() });
};

Hmi.prototype.update = function() {
  var offsetHeight = 64,
    availableWidth = window.innerWidth - 32,
    availableHeight = window.innerHeight - offsetHeight;
  var boardMarginTop = 0;
  if ( availableWidth * 676 / 1200 < availableHeight ) {
    this.paper.setSize( availableWidth, availableWidth * 676 / 1200 );
    boardMarginTop = (availableHeight - availableWidth * 676 / 1200 ) / 2;
  } else {
    this.paper.setSize( availableHeight * 1200 / 676, availableHeight );
  }
  $('#board').css({ 'margin-top': boardMarginTop + 'px' });

  var minSize = 32;
  var size = 0.06 * availableWidth < minSize ? minSize : 0.06 * availableWidth;
  $('#customMenu').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  size = 0.05 * availableWidth < minSize ? minSize : 0.05 * availableWidth;
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
  this.score.south.text.attr({ text: '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '') });
  tmp=board.score[1];
  this.score.north.text.attr({ text: '' + tmp +
    (6 == tmp || 9 == tmp ? '.' : '') });
  for(var n=0; n<Common.BOWLSTOTAL; ++n) {
    var bowl = this.bowl[n];
    var bonduc = board.bowls[n];
    var bonducShown = bonduc>15 ? 15 : bonduc;
    bowl.image.attr({ src: Hmi.FILEBONDUCS[bonducShown] });
    var text = bonduc >= 12 ? '' + bonduc : '';
    bowl.textNorth.attr({ text: text });
    bowl.textSouth.attr({ text: text });
  }
};

Hmi.prototype.setupBowlSelection = function(board) {
  this.bowl[0].image.click( this.myChoice0.bind(this) );
  this.bowl[1].image.click( this.myChoice1.bind(this) );
  this.bowl[2].image.click( this.myChoice2.bind(this) );
  this.bowl[3].image.click( this.myChoice3.bind(this) );
  this.bowl[4].image.click( this.myChoice4.bind(this) );
  this.bowl[5].image.click( this.myChoice5.bind(this) );
  this.bowl[6].image.click( this.myChoice6.bind(this) );
  this.bowl[7].image.click( this.myChoice7.bind(this) );
  this.bowl[8].image.click( this.myChoice8.bind(this) );
  this.bowl[9].image.click( this.myChoice9.bind(this) );
  this.bowl[10].image.click( this.myChoice10.bind(this) );
  this.bowl[11].image.click( this.myChoice11.bind(this) );
};

Hmi.prototype.disableBowlSelection = function() {
  this.bowl[0].image.unclick( this.myChoice0.bind(this) );
  this.bowl[1].image.unclick( this.myChoice1.bind(this) );
  this.bowl[2].image.unclick( this.myChoice2.bind(this) );
  this.bowl[3].image.unclick( this.myChoice3.bind(this) );
  this.bowl[4].image.unclick( this.myChoice4.bind(this) );
  this.bowl[5].image.unclick( this.myChoice5.bind(this) );
  this.bowl[6].image.unclick( this.myChoice6.bind(this) );
  this.bowl[7].image.unclick( this.myChoice7.bind(this) );
  this.bowl[8].image.unclick( this.myChoice8.bind(this) );
  this.bowl[9].image.unclick( this.myChoice9.bind(this) );
  this.bowl[10].image.unclick( this.myChoice10.bind(this) );
  this.bowl[11].image.unclick( this.myChoice11.bind(this) );
};

Hmi.prototype.getSettings = function() {
  return {
    sowingspeed: $('#sowingspeed').is(':checked') ? 600 : 10,
    rules: $('#rulesoware').is(':checked') ? 'Oware' : 'Ouril',
    playersouth: $('#firstplayerai').is(':checked') ? 'AI' : 'Human',
    playernorth: $('#secondplayerai').is(':checked') ? 'AI' : 'Human'
  };
}

Hmi.prototype.myChoice = function( selectedBowl ) {
  if(this.verbose) console.log('Selected bowl: ' + selectedBowl);
  this.engine.postMessage({ class: 'request', request: 'move',
    bowl: selectedBowl, settings: this.getSettings() });
};

Hmi.prototype.myChoice0 = function() { this.myChoice(0); };
Hmi.prototype.myChoice1 = function() { this.myChoice(1); };
Hmi.prototype.myChoice2 = function() { this.myChoice(2); };
Hmi.prototype.myChoice3 = function() { this.myChoice(3); };
Hmi.prototype.myChoice4 = function() { this.myChoice(4); };
Hmi.prototype.myChoice5 = function() { this.myChoice(5); };
Hmi.prototype.myChoice6 = function() { this.myChoice(6); };
Hmi.prototype.myChoice7 = function() { this.myChoice(7); };
Hmi.prototype.myChoice8 = function() { this.myChoice(8); };
Hmi.prototype.myChoice9 = function() { this.myChoice(9); };
Hmi.prototype.myChoice10 = function() { this.myChoice(10); };
Hmi.prototype.myChoice11 = function() { this.myChoice(11); };

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

$( (new Hmi()).init() );
