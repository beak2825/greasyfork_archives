// ==UserScript==
// @name         The Sexy Button Header
// @namespace    http://www.reddit.com/r/thebutton
// @version      0.2
// @description  Allow The Button header to change colour from the websocket
// @author       mrozbarry
// @match        http://www.reddit.com/r/thebutton
// @match        http://www.reddit.com/r/thebutton/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9121/The%20Sexy%20Button%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/9121/The%20Sexy%20Button%20Header.meta.js
// ==/UserScript==

//    Sorce from  mrozbarry:
//    https://gist.githubusercontent.com/mrozbarry/3305f204f58a18f0b94a/raw/0790c5f650feb293860272ad5c2772ba89210485/theButton_helper.js

(function(){
  // Written by Alex Barry April, 2015
  // http://mrbarry.com/
  // TODO: understanding the wss:// uri
  // what is the â€˜hâ€™ param?
  /*var params = {
    e: M.floor((new Date()).getTime() / 1000),
    h: â€˜???need a better hacker here - it appears to be constant through page reloadsâ€™
  };
  socketUri = â€˜wss://wss.redditmedia.com/thebutton?h=' + params.h.toString() + â€˜&e=â€˜ + params.e.toString();
  */
  // Looks like this is being stored in backbone(?)
  if (!window.r || !window.r.config || !window.r.config.thebutton_websocket) {
    console.warn('The button is not accessible on this page');
    return 'could not load thebutton script';
  }

  state = {
    uri: window.r.config.thebutton_websocket,
    connected: false,
    last_message_at: null,
    stylesheet: null,
    cache: {}, // Cache of last message
    setStyles: function(target, styles) {
      styles_as_string = target + ' {';
      if (typeof(styles) == 'string') {
        styles_as_string += styles + '}'
      } else {
        styles_as_string = target + ' {';
        for(key in styles) {
          directive = key.replace(/(ABCDEFGHIJKLMNOPQRSTUVWXYZ)/, function(r) { return '-' + r.toLowerCase(); });
          styles_as_string += directive + ': ' + styles[key] + ";\n"
        }
      }
      styles_as_string += '}';
      if (this.stylesheet.stylesheet) this.stylesheet.cssText = styles_as_string;
      else {
        // Remove old styles
        while (this.stylesheet.firstChild) this.stylesheet.removeChild(this.stylesheet.firstChild);
        this.stylesheet.appendChild(document.createTextNode(styles_as_string));
      }
      // Ensures that this is the last style sheet, plus forces the browser to re-render the styles
      document.head.removeChild(this.stylesheet);
      document.head.appendChild(this.stylesheet);
    }
  };
  
  // Connect to the websocket used on the page
  // Optionally, we might be able to hook into the backbone object?
  var sock = new WebSocket(state.uri);
  // When the socket is opened or closed, reset the state
  sock.onopen = function(evt) {
    state.connected = true;
    state.last_message_at = null;
    state.$pie = $('.thebutton-pie > div > div > div');
    state.stylesheet = document.createElement('style');
    state.stylesheet.type = 'text/css';
    state.stylesheet.media = 'screen';
    document.head.appendChild(state.stylesheet);
  };
  sock.onclose = function(evt) {
    state.connected = false;
    state.last_message_at = null;
    document.head.removeChild(state.stylesheet);
    state.stylesheet = null;
  };
  // When we get a message, collect stats on how quickly they are being sent
  sock.onmessage = function(evt) {
    // Seems to ping pretty close to every one second
    msg = JSON.parse(evt.data);
    if (!msg) {
      console.warn('Faulty data from socket;', evt.data)
    }
    state.cache = msg
    delta = 0;
    now = new Date();
    if (state.last_message_at) {
      delta = now.getTime() - state.last_message_at.getTime();
    }
    window.thebeard_button_script = {
      state: state,
      roundTripTime: delta.toString() + "milliseconds"
    }
    var colour_of_tier = function(tier) {
      class_names = '.flair.flair-press-' + tier.toString();
      $flair_span = $(class_names);
      if ($flair_span.length > 0) return $flair_span.first().css('background-color');
      // This is not a real tier colour at all, it's just to symbolize a null (a nice red, nabbed from vanilla bootstrap)
      return '#D9534F';
    };
    if (msg.type == 'ticking') {
      var seconds_left = msg.payload.seconds_left; // Should be a number/float
      var tier = Math.ceil(seconds_left / 10);
      state.last_colour = colour_of_tier(tier);
      state.setStyles('.thebutton-pie-container svg g:nth-of-type(2) path', {fill: state.last_colour})
    }
    state.last_message_at = now;
  }
  return 'loaded thebutton script'
})();