// ==UserScript==
// @name         It's easier to explain
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Replace TORN with PORN
// @author       Manuel [3747263]
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548852/It%27s%20easier%20to%20explain.user.js
// @updateURL https://update.greasyfork.org/scripts/548852/It%27s%20easier%20to%20explain.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const normalLogoUrl = 'https://i.imgur.com/TJLF4OK.jpeg';

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .header .logo,
      #tcLogo.logo,
      .logo {
        background-image: url('${normalLogoUrl}') !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: contain !important;

        display: block !important;

        /* Fluid sizing: min 80px, preferred ~14vw, max 172px */
        width: clamp(80px, 14vw, 172px) !important;
        aspect-ratio: 172 / 77 !important;
        height: auto !important;

        transform-origin: center center !important;
        transition: transform 160ms ease !important;
      }

      .header .logo:hover,
      #tcLogo.logo:hover,
      .logo:hover {
        transform: scale(1.1) !important;
      }

      /* Anchor should fill the logo box */
      .header .logo > a,
      #tcLogo.logo > a,
      .logo > a {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        text-indent: -9999px; /* hide fallback text */
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
})();
