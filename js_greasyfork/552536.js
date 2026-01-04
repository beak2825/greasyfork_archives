// ==UserScript==
// @name        Character.ai Force Italics in Firefox
// @match       https://character.ai/*
// @match       https://*.character.ai/*
// @version     1.0
// @description Ensure <em> actually renders as italic/slanted in Firefox
// @grant       none
// @license     CC0
// @namespace https://greasyfork.org/users/1526391
// @downloadURL https://update.greasyfork.org/scripts/552536/Characterai%20Force%20Italics%20in%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/552536/Characterai%20Force%20Italics%20in%20Firefox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    /* Make italics hard to ignore */
    em, i {
      font-style: italic !important;
      font-synthesis: style !important;  /* allow synthesized italics */
      color: #C4C4C4 !important;
      letter-spacing: 0.3px !important;
    }

    /* If the font lacks italics, use an oblique fallback */
    em:not(:where(:has(*))), i:not(:where(:has(*))) {
      font-style: oblique 10deg !important;     /* slanted fallback */
    }

    /* If the site uses variable fonts, try slant axis */
    /* Many variable fonts support 'slnt'; if absent, this does nothing */
    em, i {
      font-variation-settings: 'slnt' -10 !important;
    }

    /* As a last resort, swap to a font that has italics */
    /* Comment out if you prefer the site’s font */
    /* em, i { font-family: 'Georgia', 'Times New Roman', serif !important; } */
  `;
  document.head.appendChild(style);
})();