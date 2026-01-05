// ==UserScript==
// @name        Lichess Blitzin Pack
// @namespace   http://example.com
// @description Sound of Blitzin
// @include     http://*.lichess.org/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8502/Lichess%20Blitzin%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/8502/Lichess%20Blitzin%20Pack.meta.js
// ==/UserScript==
 
 
 
 
 
 
 
 
 
 $.sound = (function() {
     
  
     var Move = new Audio();
     Move.src='https://web.chessclub.com/sounds/mp3/MOVE.mp3';
   
    
     
      
       var Take = new Audio();
       Take.src = 'https://web.chessclub.com/sounds/mp3/CAPTURE.mp3';
     
      var Dong = new Audio();
      
      Dong.src = 'https://web.chessclub.com/sounds/mp3/FITEBELL.mp3';
      
      
      
        
     
      
 
      
     var baseUrl = $('body').data('sound-dir') + '/';
    Howler.volume(lichess.storage.get('sound-volume') || 0.1);
    var audio = {
      dong: 'dong',
      moveW: 'move',
      moveB: 'move',
      take: 'take',
      lowtime: 'lowtime'
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
          if (white) Move.play();
          else Move.play();
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