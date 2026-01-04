// ==UserScript==
// @name ●→■ Basic Unround Everything Everywhere
// @namespace myfonj
// @version 1.0.0
// @description For test
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/552542/%E2%97%8F%E2%86%92%E2%96%A0%20Basic%20Unround%20Everything%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/552542/%E2%97%8F%E2%86%92%E2%96%A0%20Basic%20Unround%20Everything%20Everywhere.meta.js
// ==/UserScript==

(function() {
let css = `/*
For test https://greasyfork.org/en/scripts/408378-unround-everything-everywhere/discussions/312217
Changelog
1.0.0 init, just the core rule from https://greasyfork.org/en/scripts/408378
*/

*:not(#u#n#r#o#u#n#d):not(
 input[type="radio" i]
):not(
 input[type="radio" i] + label
):not(
 /* Outlook */
 input[type="radio" i] + [aria-hidden="true" i]:empty:has(+ label)
):not(
 /* Gmail */
 input[type="radio" i] + *:not(:has(:not(:empty))) *
)
{
 &,
 &::before,
 &::after {
  border-radius: 0 !important;
 }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
