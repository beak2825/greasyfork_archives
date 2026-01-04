// ==UserScript==
// @name HeroesProfile.com – Dark Compact [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for Heroes Profile (HeroesProfile.com) with clean compact design and ad block.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.heroesprofile.com/*
// @downloadURL https://update.greasyfork.org/scripts/553585/HeroesProfilecom%20%E2%80%93%20Dark%20Compact%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/553585/HeroesProfilecom%20%E2%80%93%20Dark%20Compact%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  html,
  body {
    font: 15px Segoe UI;
    letter-spacing: normal;
    background: #111;
  }

  #horizontal-banner-ad-container,
  div:has(> #mobile-toggle),
  div:has(> [id^="dynamic-banner-ad"]) {
    display: none;
  }
  [alt="Patreon"] {
    &::after {
      content: "Patreon";
    }
    span {
      font-size: 0;
    }
  }

  #app {
    > .bg-red.text-center {
      display: none;
    }
    :is(td, th):has(img[src^="/images/heroes/"], img[src^="/images/talents/"]) {
      padding: 0 .5em 0 0;
    }
    img:is([src^="/images/heroes/"], [src^="/images/talents/"]) {
      border-radius: 0;
    }
    :is(td, th):has([alt="View Talent Builds"]) {
      padding: 0 .5em;
    }
    .search-component {
      position: absolute;
      inset: 4px auto auto 300px;
      z-index: 100;
    }
  }

  .gap-5 {
    gap: 0;
  }
  .mb-\\[2em\\] {
    margin: 0 0 .5em 0;
  }
  .md\\:px-20 {
    padding: 0 1em;
  }
  .p-10,
  .md\\:p-20 {
    padding: 1em;
  }
  :is(.w-\\[200px\\], .min-w-\\[200px\\]).h-\\[40px\\] {
    --tw-border-opacity: .2;
    box-sizing: content-box;
    min-width: 20ex;
    width: auto;
    height: 1.5em;
  }

  table, thead, tbody, tfoot, tr, th, td {
    --tw-bg-opacity: 0.1 !important;
    color: #eee;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
