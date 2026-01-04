// ==UserScript==
// @name         GC Shop Stock Price Field as Number Input
// @namespace    https://www.grundos.cafe/userlookup/?user=hazr
// @version      1.0
// @description  Styles the Price column in the Shop Stock as a number field with up and down arrows.
// @author       hazr
// @license      MIT
// @match        https://www.grundos.cafe/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559665/GC%20Shop%20Stock%20Price%20Field%20as%20Number%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/559665/GC%20Shop%20Stock%20Price%20Field%20as%20Number%20Input.meta.js
// ==/UserScript==

GM_addStyle(`
.stock > .data > .price
{
    width: 5.5em;
    appearance: auto;
}
`);