// ==UserScript==
// @name         ULR GPU texture rejector
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Force GPU to reject oversized WebGL textures to prevent Safari crashes
// @author       Me
// @match        https://www.playunlight.online/?*
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559605/ULR%20GPU%20texture%20rejector.user.js
// @updateURL https://update.greasyfork.org/scripts/559605/ULR%20GPU%20texture%20rejector.meta.js
// ==/UserScript==

//////// Settings Start ////////
const HARD_LIMIT = 2048;
//////// Settings End ////////

(function () {
  "use strict";

  function patch(glProto) {
    const _texImage2D = glProto.texImage2D;
    const _getError = glProto.getError;

    let forceError = false;

    glProto.texImage2D = function (...args) {
      const src = args[5];

      if (
        src &&
        (src instanceof HTMLImageElement ||
         src instanceof HTMLCanvasElement ||
         src instanceof ImageBitmap)
      ) {
        const w = src.width;
        const h = src.height;

        if (w > HARD_LIMIT || h > HARD_LIMIT) {
          console.warn(
            `[WebGL] GPU reject texture ${w}x${h} > ${HARD_LIMIT}`
          );

          forceError = true;
          return;
        }
      }

      return _texImage2D.apply(this, args);
    };

    glProto.getError = function () {
      if (forceError) {
        forceError = false;
        return this.INVALID_VALUE;
      }
      return _getError.call(this);
    };
  }

  if (window.WebGLRenderingContext) {
    patch(WebGLRenderingContext.prototype);
  }

  if (window.WebGL2RenderingContext) {
    patch(WebGL2RenderingContext.prototype);
  }
})();
