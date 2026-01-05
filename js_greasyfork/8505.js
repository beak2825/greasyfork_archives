// ==UserScript==
// @name        Lichess Chess.com Full Pack
// @namespace   http://example.com
// @description gg
// @include     http://*.lichess.org/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8505/Lichess%20Chesscom%20Full%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/8505/Lichess%20Chesscom%20Full%20Pack.meta.js
// ==/UserScript==
 
 

  var Move = new Audio();
   Move.src = 'http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3';
    Move.volume = 0.5;
     
      
        var Take = new Audio();
    Take.src = 'http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3';
    Take.volume = 0.5;
     
      
        var Dong = new Audio();
    Dong.src = 'http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3';
    Dong.volume = 0.5;
     
      
        var Lowtime = new Audio();
    Lowtime.src = 'http://ralphschuler.ch/ChessCubeSoundPack/Chesscube_gamestart.wav';
    Lowtime.volume = 0.5;


 
 $.sound = (function() {
    var baseUrl = $('body').data('sound-dir') + '/';
    Howler.volume(lichess.storage.get('sound-volume') || 0.7);
    var names = {
      dong: 'dong',
      move: 'move',
      take: 'take',
      explode: 'explosion',
      lowtime: 'lowtime'
    };
    var volumes = {
      lowtime: 0.5,
      explode: 0.35
    };
    var get = new $.lazy(function(k) {
      return new Howl({
        src: ['ogg', 'mp3'].map(function(ext) {
          return baseUrl + names[k] + '.' + ext;
        }),
        volume: volumes[k] || 1
      });
    });
    var $control = $('#sound_control');
    var $toggle = $('#sound_state');
    var enabled = function() {
      return lichess.storage.get('sound') !== 'no';
    };
    $control.add($toggle).toggleClass('sound_state_on', enabled());
    var player = function(s) {
      return function() {
        if (enabled()) get(s).play();
      };
    }
    var play = {};
    Object.keys(names).forEach(function(name) {
      play[name] = function() {
        if (enabled()) Move.play();
      }
    });
    var setVolume = function(v) {
      lichess.storage.set('sound-volume', v);
      Howler.volume(v);
    };
    var manuallySetVolume = $.fp.debounce(function(v) {
      setVolume(v);
      play.move(true);
    }, 50);
    $toggle.click(function() {
      var enab = !enabled();
      lichess.storage.set('sound', enab ? 'yes' : 'no');
      $control.add($toggle).toggleClass('sound_state_on', enab);
      play.dong();
      return false;
    });
    $toggle.one('mouseover', function() {
      $toggle.parent().find('.slider').slider({
        orientation: "vertical",
        min: 0,
        max: 1,
        range: 'min',
        step: 0.01,
        value: Howler.volume(),
        slide: function(e, ui) {
          manuallySetVolume(ui.value);
        }
      });
    });

    return play;
  })();

 
 
 
 
 



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};







addGlobalStyle('.cg-piece.knight.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bn.png")!important;} ');
addGlobalStyle('.cg-piece.bishop.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bb.png")!important;} ');
addGlobalStyle('.cg-piece.queen.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bq.png")!important;} ');
addGlobalStyle('.cg-piece.rook.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/br.png")!important;} ');
addGlobalStyle('.cg-piece.pawn.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bp.png")!important;} ');
addGlobalStyle('.cg-piece.king.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bk.png")!important;} ');
addGlobalStyle('.cg-piece.knight.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wn.png")!important;} ');
addGlobalStyle('.cg-piece.bishop.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wb.png")!important;} ');
addGlobalStyle('.cg-piece.queen.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wq.png")!important;} ');
addGlobalStyle('.cg-piece.rook.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wr.png")!important;} ');
addGlobalStyle('.cg-piece.pawn.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wp.png")!important;} ');
addGlobalStyle('.cg-piece.king.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wk.png")!important;} ');


//addGlobalStyle('.cg-board { background-image: url("http://images.chesscomfiles.com/chess-themes/boards/translucent/80.png")!important;} ');

addGlobalStyle('.cg-square.last-move { background-color:rgba(255, 0, 0, 0.41) !important;box-sizing:border-box;border:2px solid red;} ');

addGlobalStyle('.cg-square.check {background-color:red !important;}');






$('.cg-board').css({"border-color": "#ccc", 
             "border-width":"3px", 
               "border-style":"solid"});



               
               
      