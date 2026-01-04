// ==UserScript==
// @name        Kittens Game AutoPlay Loader
// @namespace   E4gle
// @description Add-on for the wonderful incremental browser game: https://kittensgame.com/web/
// @icon        https://kitten-science.com/assets/images/organization-logo64.png
// @match       https://kittensgame.com/web/
// @match       https://kittensgame.com/beta/
// @match       https://kittensgame.com/alpha/
// @version      1.0
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559127/Kittens%20Game%20AutoPlay%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/559127/Kittens%20Game%20AutoPlay%20Loader.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const SCRIPT_URL = 'https://dandcvs.github.io/KGAutoPlay/kitg.js';
  const FLAG = '__KG_AUTOPLAY_LOADED__';

  if (window[FLAG]) {
    console.log('[KG AutoPlay] already loaded');
    return;
  }

  let tries = 0;
  const maxTries = 60; // ~30 Sekunden

  const waitForGame = setInterval(() => {
    tries++;

    if (window.gamePage && document.readyState === 'complete') {
      clearInterval(waitForGame);

      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.onload = () => {
        window[FLAG] = true;
        console.log('[KG AutoPlay] successfully loaded');
      };

      document.body.appendChild(script);
    }

    if (tries >= maxTries) {
      clearInterval(waitForGame);
      console.warn('[KG AutoPlay] Kittens Game not detected');
    }
  }, 500);
})();
