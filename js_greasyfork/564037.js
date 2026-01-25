// ==UserScript==
// @author      daniel.z.tg
// @description Force MediaWiki dark mode even in new logged-out Incognito windows
// @grant       GM_addStyle
// @license     Unlicense
// @match       https://*.mediawiki.org/*
// @match       https://*.wikibooks.org/*
// @match       https://*.wikidata.org/*
// @match       https://*.wikifunctions.org/*
// @match       https://*.wikimedia.org/*
// @match       https://*.wikinews.org/*
// @match       https://*.wikipedia.org/*
// @match       https://*.wikiquote.org/*
// @match       https://*.wikisource.org/*
// @match       https://*.wikiversity.org/*
// @match       https://*.wikivoyage.org/*
// @match       https://*.wiktionary.org/*
// @name        Force Wikimedia dark mode
// @namespace   https://github.com/danielzgtg
// @run-at      document-body
// @version     202601251056240001
// @downloadURL https://update.greasyfork.org/scripts/564037/Force%20Wikimedia%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/564037/Force%20Wikimedia%20dark%20mode.meta.js
// ==/UserScript==

/*
 * Features:
 * - Defaults all Wikimedia pages to dark mode when opened
 * - Clicking back to light mode still works
 * - Uses their built-in dark mode, and avoids messing with them by not introducing our own background colors
 * - NO sudden flash of white when loading
 * - Removes white background from figures, not waiting on Wikipedians to determine legibility
 * - In early 2025, this could skip the wait and unofficially enable dark mode for all Wikimedia sites, supported or not
 */

GM_addStyle(`
  /* Disable the blinding fade-to-black on every refresh */
  html.notransitions {
    &, * {
      transition: none !important;
    }
  }

  /* Invert other diagrams. Might cause some unreadable text, oh well; just click-to-open/select-to-copy */
  img[src$='.svg.png']{
    background-color: transparent !important;
    &:not(span.skin-invert > a > img) {
      filter: invert() !important;
    }
  }

  /* Disable infobox/other images' white backgrounds */
  figure /*:has(img[src$='.svg.png'])*/ {
    background: none !important;
  }
`);
document.documentElement.classList.add("notransitions");
setTimeout(() => document.documentElement.classList.remove("notransitions"), 100);
document.documentElement.classList.remove("skin-theme-clientpref-day");
document.documentElement.classList.add("skin-theme-clientpref-night");
