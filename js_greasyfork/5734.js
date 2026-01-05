// ==UserScript==
// @name        InstaSynchP Layouts
// @namespace   InstaSynchP
// @description Larger layouts and fullscreen mode

// @version     1.1.8
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Layouts
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js
// @require     https://greasyfork.org/scripts/2858-jquery-fullscreen/code/jqueryfullscreen.js?version=26079
// @downloadURL https://update.greasyfork.org/scripts/5734/InstaSynchP%20Layouts.user.js
// @updateURL https://update.greasyfork.org/scripts/5734/InstaSynchP%20Layouts.meta.js
// ==/UserScript==

function Layouts(version) {
    "use strict";
    this.version = version;
    this.name = 'InstaSynchP Layouts';
}

window.plugins = window.plugins || {};
window.plugins.layouts = new Layouts('1.1.8');
