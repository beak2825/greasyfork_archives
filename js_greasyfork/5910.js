// ==UserScript==
// @name        InstaSynchP Emote Names
// @namespace   InstaSynchP
// @description Show emote names when hovering over the image

// @version     1.0.5
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Emote-Names
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/5910/InstaSynchP%20Emote%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/5910/InstaSynchP%20Emote%20Names.meta.js
// ==/UserScript==

function EmoteNames(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Emote Names';
}

EmoteNames.prototype.executeOnce = function () {
  "use strict";
  events.on(this, 'AddMessage', function () {
    //check all <img> in case there can be more in the future
    $('#chat_messages > :last-child > span.message > img').each(function () {
      var emote;
      for (emote in window.$codes) {
        if (window.$codes.hasOwnProperty(emote) &&
          window.$codes[emote].contains($(this).attr('src'))) {
          $(this).attr('title', emote);
          break;
        }
      }
    });
  });
};

window.plugins = window.plugins || {};
window.plugins.emoteNames = new EmoteNames('1.0.5');
