// ==UserScript==
// @name                YouTube Disable AutoPause
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_disable_autopause
// @version             0.0.1
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @run-at              document-idle
// @inject-into         page
// @license             MIT
// @description         Disables the YouTube "Are You There?" prompt. Does so by tricking YouTube into thinking that you never left.
// @downloadURL https://update.greasyfork.org/scripts/562548/YouTube%20Disable%20AutoPause.user.js
// @updateURL https://update.greasyfork.org/scripts/562548/YouTube%20Disable%20AutoPause.meta.js
// ==/UserScript==

/* jshint esversion:11 */

(function () {
    'use strict';

    const getLact = () => { return Date.now(); };

    Object.defineProperty(Object.prototype, 'lact', {
        get: getLact,
        set: () => {},
        configurable: true,
    });
})();
