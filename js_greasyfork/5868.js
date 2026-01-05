// ==UserScript==
// @name        InstaSynchP Poll Menu
// @namespace   InstaSynchP
// @description Improves the poll menu
// @version     1.0.6.1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Poll-Menu
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/5868/InstaSynchP%20Poll%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/5868/InstaSynchP%20Poll%20Menu.meta.js
// ==/UserScript==

function PollMenu(version, url) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Poll Menu';
}

window.plugins = window.plugins || {};
window.plugins.pollMenu = new PollMenu('1.0.6.1');
