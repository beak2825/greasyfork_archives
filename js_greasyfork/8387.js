// ==UserScript==
// @name        Lichess Old Sound
// @namespace   http://example.com
// @description Sound replace with old ones
// @include     http://*.lichess.org/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8387/Lichess%20Old%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/8387/Lichess%20Old%20Sound.meta.js
// ==/UserScript==



	

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
        if (enabled()) get(name).play();
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
