// ==UserScript==
// @name Poor Mans Connections Dark-ish Mode
// @namespace https://www.nytimes.com/games/connections
// @version 1.0.0
// @description Just adds some grey.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.https://www.nytimes.com/games/connections/*
// @downloadURL https://update.greasyfork.org/scripts/556883/Poor%20Mans%20Connections%20Dark-ish%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556883/Poor%20Mans%20Connections%20Dark-ish%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `

.pz-desktop .GamesCarouselStack-module_frictionMitigationContent__sfyQO {
  display: none;
}

.pz-page, .pz-game-field, .pz-game-toolbar, .pz-nav, .pz-desktop, #connections-container:nth-child(1) {
   background: grey !important;
}

:root {
   --bg-moment: grey;
}

[data-mode] {
   --bg-moment: grey;
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
