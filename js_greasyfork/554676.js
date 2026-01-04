// ==UserScript==
// @name Pekora Reborn (Logo)
// @namespace pekora-reborn
// @version 1.1
// @description Part 1 of Pekora Reborn
// @author 1547
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pekora.zip/*
// @match *://*.www.pekora.zip/*
// @downloadURL https://update.greasyfork.org/scripts/554676/Pekora%20Reborn%20%28Logo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554676/Pekora%20Reborn%20%28Logo%29.meta.js
// ==/UserScript==

(function() {
let css = `

.imgDesktop-0-2-9 {
  width: 122px;
  height: 40px;
  display: none;
  max-width: 122px;
  min-width: 122px;
  background-size: 100% auto;
  background-image: url("https://web.archive.org/web/20250826011145if_/https://www.pekora.zip/img/logo.png");
  background-repeat: no-repeat;
  background-position: center;
}

@media(min-width: 1325px) {
  .imgDesktop-0-2-9 {
    display: block;
  }
}

.imgMobile-0-2-10 {
  width: 30px;
  height: 30px;
  display: block;
  margin-left: 6px;
  background-size: 30px;
  background-image: url("https://web.archive.org/web/20250826011158if_/https://www.pekora.zip/favicon.ico");
  background-repeat: no-repeat;
  background-position: center;
}

@media(min-width: 1325px) {
  .imgMobile-0-2-10 {
    display: none;
  }
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
