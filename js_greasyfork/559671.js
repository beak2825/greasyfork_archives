// ==UserScript==
// @name         GC Buy Item Haggle Focus
// @namespace    https://www.grundos.cafe/userlookup/?user=hazr
// @version      1.0
// @description  When buying an item at a shop with haggling, automatically focuses the input field.
// @author       hazr
// @license      MIT
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559671/GC%20Buy%20Item%20Haggle%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/559671/GC%20Buy%20Item%20Haggle%20Focus.meta.js
// ==/UserScript==

new MutationObserver(function(mutations)
{
    let offer = document.querySelector('form > div > div[style="display: block !important;"] > div > input');
    if (offer)
    {
        offer.focus();

        this.disconnect();
    }

    let back = document.querySelector("main button");
    if (back || (back = document.querySelector('input.error-back')))
    {
        back.focus();

        this.disconnect();
    }
}).observe(document, {childList: true, subtree: true});
