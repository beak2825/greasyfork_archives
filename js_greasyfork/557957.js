// ==UserScript==
// @name qntm ROT13 dark mode
// @namespace https://greasyfork.org/en/users/3759-locrian
// @version 1.0
// @description Makes qntm's ROT13 page match the rest of the site
// @author locrian
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match https://qntm.org/files/rot13/rot13.html*
// @downloadURL https://update.greasyfork.org/scripts/557957/qntm%20ROT13%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/557957/qntm%20ROT13%20dark%20mode.meta.js
// ==/UserScript==

(function() {
let css = `
    body {
        background-color: #080808;
        color: #f4f4f4;
        line-height: 1.5;
    }

    textarea {
        background-color: #262626;
        color: #f4f4f4;
    }

    a {
        color: #ff832b;
    }

    a:hover {
        color: #eb6200;
    }

    code,
    pre,
    kbd {
        font-family: consolas, courier new, monospace;
        background-color: #262626;
        padding: .2rem .4rem;
        border-radius: 6px;
        color: #f4f4f4;
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
