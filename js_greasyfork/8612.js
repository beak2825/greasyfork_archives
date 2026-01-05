// ==UserScript==
// @name        InstaSynchP History
// @namespace   InstaSynchP
// @description Adds a tab for the previously played videos

// @version     1.0.1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-History
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=41059
// @downloadURL https://update.greasyfork.org/scripts/8612/InstaSynchP%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/8612/InstaSynchP%20History.meta.js
// ==/UserScript==

function History(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP History';
  this.styles = [{
    'name': 'playlist_history_css',
    'url': 'https://cdn.rawgit.com/Zod-/InstaSynchP-History/master/history.css',
    'autoload': true
  }];
}

History.prototype.executeOnce = function () {
  "use strict";
  var th = this;

  createNavTab({
    tooltip: 'History',
    tab: '#tabs_playlist_history',
    class: 'fa fa-clock-o'
  }).insertAfter('.video-controls > .nav-tabs > li:first-child');

  $('<div>', {
    class: 'tab-pane',
    id: 'tabs_playlist_history'
  }).append(
    $('<ol>', {
      class: 'playlist',
      id: 'playlist_history'
    })
  ).appendTo('.video-controls > .tab-content');

  events.on(th, 'PlayVideo', function () {
    var clone = $('#playlist > li.active').clone().toggleClass('active');
    $('.buttons > .remove-video', clone).remove();
    $('#playlist_history').prepend(clone);
  });
};

window.plugins = window.plugins || {};
window.plugins.history = new History('1.0.1');
