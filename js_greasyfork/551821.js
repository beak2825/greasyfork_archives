// ==UserScript==
// @name         Disable WebGL on all pages (modified)
// @version      2025.10.08
// @description  This script will disable WebGL on all sites (but with few site exceptions included to make online games work properly)
// @author       Joey_JTS
// @license MIT
// @include      http://*
// @include      https://*
// @exclude      *://agar.io
// @exclude      *://classic.minecraft.net
// @exclude      *://crazygames.com
// @exclude      *://diep.io
// @exclude      *://newgrounds.com
// @exclude      *://ruffle.rs
// @exclude      *://scratch.mit.edu
// @exclude      *://slither.io
// @exclude      *://turbowarp.org
// @namespace    https://greasyfork.org/en/users/761382
// @unwrap
// @run-at       document-idle
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551821/Disable%20WebGL%20on%20all%20pages%20%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551821/Disable%20WebGL%20on%20all%20pages%20%28modified%29.meta.js
// ==/UserScript==

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