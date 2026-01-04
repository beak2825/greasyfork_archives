// ==UserScript==
// @name Ellipsus Font Fix
// @namespace https://greasyfork.org/en/users/3759-locrian
// @version 1.0.0
// @description Sorry, I just can't read that default serif font.
// @author November
// @grant GM_addStyle
// @run-at document-start
// @match https://write.ellipsus.com/*
// @downloadURL https://update.greasyfork.org/scripts/559557/Ellipsus%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559557/Ellipsus%20Font%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
    h1,
    h2,
    h3,
    h4,
    .styles_subfolderName__ccLfw,
    .styles_label__awCdx,
    span.styles_headerLabel__gr55L,
    styles_label__d6_8L,
    ul.styles_actionsList__usxzm {
        font-family: "Atkinson Hyperlegible" !important;
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
