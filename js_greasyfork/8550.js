// ==UserScript==
// @name        Lichess Fritz Sound Pack
// @namespace   http://example.com
// @description Sound replacement(only)
// @include     http://*.lichess.org/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8550/Lichess%20Fritz%20Sound%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/8550/Lichess%20Fritz%20Sound%20Pack.meta.js
// ==/UserScript==
 
 
 
 
 
 
 
 
 
 $.sound = (function() {
     
  
     var MoveW = new Audio();
   MoveW.src = 'http://play.chessbase.com/Common/Media/Sounds/Board/move1.mp3';
   
   
     var MoveB = new Audio();
   MoveB.src = 'http://play.chessbase.com/Common/Media/Sounds/Board/move4.mp3';
    
    
    
     
      
        var Take = new Audio();
   Take.src = 'http://play.chessbase.com/Common/Media/Sounds/Board/capture1.mp3';
    
    
     
      
        var Dong = new Audio();
    Dong.src = 'http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3';
   
   
   var Lowtime = new Audio();
   Lowtime.src = 'http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3';
   
       
   
      
      
      
      
        
     
      
 
      
     var baseUrl = $('body').data('sound-dir') + '/';
    Howler.volume(lichess.storage.get('sound-volume') || 0.1);
    var audio = {
      dong: 'dong',
      moveW: 'move',
      moveB: 'move',
      take: 'take',
      lowtime: 'lowtime',
    };
    var volumes = {
      lowtime: 0.5
    };
    var get = new $.lazy(function(k) {
      return new Howl({
        src: ['ogg', 'mp3'].map(function(ext) {
          return baseUrl + audio[k] + '.' + ext;
        }),
        volume: volumes[k] || 0.1
      });
    });
    var $control = $('#sound_control');
    var $toggle = $('#sound_state');
    var enabled = function() {
      return !!lichess.storage.get('sound');
    };
    $control.add($toggle).toggleClass('sound_state_on', enabled());
    var play = {
      move: function(white) {
        if (enabled()) {
          if (white) MoveW.play();
          else MoveB.play();
        }
      },
      take: function() {
        if (enabled()) Take.play();
      },
      dong: function() {
        if (enabled()) Dong.play();
      },
      lowtime: function() {
        if (enabled()) Lowtime.play();
      }
     
    };
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
      if (enab) lichess.storage.set('sound', 1);
      else lichess.storage.remove('sound');
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