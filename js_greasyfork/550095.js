// ==UserScript==
// @name Dark mode for polycul.es
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Since using Dark Reader fucks up the SVG element
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @include https://polycul.es*/*
// @downloadURL https://update.greasyfork.org/scripts/550095/Dark%20mode%20for%20polycules.user.js
// @updateURL https://update.greasyfork.org/scripts/550095/Dark%20mode%20for%20polycules.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    background: #111;
    color: #eee;
}

svg#panel {
    background: #eee;
    color: #111;
}

input, button {
    background: #333;
    color: #ddd;
}

div#graph {
    box-shadow: 5px 5px 10px #999;
}

div#shortcuts {
    box-shadow: 5px 10px 10px -1px #999 !important;
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
