// ==UserScript==
// @name         The workaround for YouTube loading/buffering problem in ungoogled-chromium
// @namespace    http://tampermonkey.net/
// @version      2025-02-27
// @description Fix the workaround for YouTube loading/buffering problem in ungoogled-chromium
// @author       Zeke Dou
// @match       https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554853/The%20workaround%20for%20YouTube%20loadingbuffering%20problem%20in%20ungoogled-chromium.user.js
// @updateURL https://update.greasyfork.org/scripts/554853/The%20workaround%20for%20YouTube%20loadingbuffering%20problem%20in%20ungoogled-chromium.meta.js
// ==/UserScript==
//
// What is this userscript trying to address?
// When playing a video, only a small part of the video loads, and the subsequent
// parts do not load afterward.

(function () {
  "use strict";

  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextType) {
    if (contextType === "webgl" || contextType === "webgl2") {
      console.log("WebGL is disabled by Tampermonkey");
      return null;
    }
    return originalGetContext.apply(this, arguments);
  };
})();