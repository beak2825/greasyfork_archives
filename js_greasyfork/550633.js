// ==UserScript==
// @name Example Style
// @namespace https://www.remedialhealthcare.in/
// @version 1.0.0
// @description A sample CSS style for GreasyFork
// @author Your Name
// @grant GM_addStyle
// @run-at document-start
// @match *://*.example.com/*
// @downloadURL https://update.greasyfork.org/scripts/550633/Example%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/550633/Example%20Style.meta.js
// ==/UserScript==

(function() {
let css = `
    body {
        background: #f4f4f4 !important;
        color: #333 !important;
        font-family: Arial, sans-serif !important;
    }

    a {
        color: #0077cc !important;
        text-decoration: none !important;
    }

    a:hover {
        text-decoration: underline !important;
    }

    .header {
        background: #222 !important;
        color: #fff !important;
        padding: 10px !important;
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
