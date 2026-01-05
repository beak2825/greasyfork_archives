// ==UserScript==
// @name        Lichess ChessCubePack
// @namespace   http://example.com
// @description Sound replace
// @include     http://*.lichess.org/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8466/Lichess%20ChessCubePack.user.js
// @updateURL https://update.greasyfork.org/scripts/8466/Lichess%20ChessCubePack.meta.js
// ==/UserScript==
 
 
 
 
 
 
 
 
 
 $.sound = (function() {
     
  
     var Move = new Audio();
   Move.src = 'http://ralphschuler.ch/lichess/ChessCubeSoundPack/move.wav';
    Move.volume = 0.5;
     
      
        var Take = new Audio();
    Take.src = 'http://ralphschuler.ch/lichess/ChessCubeSoundPack/capture.wav';
    Take.volume = 0.5;
     
      
        var Dong = new Audio();
    Dong.src = 'http://ralphschuler.ch/lichess/ChessCubeSoundPack/Chesscube_gameended.wav';
    Dong.volume = 0.5;
     
      
        var Lowtime = new Audio();
    Lowtime.src = 'http://ralphschuler.ch/ChessCubeSoundPack/Chesscube_gamestart.wav';
    Lowtime.volume = 0.5;
     
      
        
     
      
 
      
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
      lowtime: 0.05
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