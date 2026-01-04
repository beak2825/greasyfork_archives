// ==UserScript==
// @name AnkiWeb_css
// @namespace https://greasyfork.org/users/1534273
// @version 1.0.1
// @description AnkiWebの表示を修正
// @author zom.u
// @grant GM_addStyle
// @run-at document-start
// @match https://ankiweb.net/decks*
// @downloadURL https://update.greasyfork.org/scripts/555045/AnkiWeb_css.user.js
// @updateURL https://update.greasyfork.org/scripts/555045/AnkiWeb_css.meta.js
// ==/UserScript==

(function() {
let css = `
.row > div:nth-child(1) {
  width: 75%;
}
.row > div:nth-child(2) {
  width: 15%;
  align-items: flex-end;
}
.row > div:nth-child(3) {
  width: 10%;
}

.row > div:nth-child(2) > div:nth-child(1)::before {
  content: "新規：";
}
.row > div:nth-child(2) > div:nth-child(2)::before {
  content: "習得中+復習：";
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
