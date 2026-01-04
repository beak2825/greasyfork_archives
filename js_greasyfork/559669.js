// ==UserScript==
// @name         GC Keyboard Shop Browser
// @namespace    https://www.grundos.cafe/userlookup/?user=hazr
// @version      1.0
// @description  Allows ArrowKey, WASD, and NumPad shop browsing. The first shop item will automatically be focused, then the arrow keys, WASD, or 8426 (for NumPads) will navigate between items.
// @author       hazr
// @license      MIT
// @match        https://www.grundos.cafe/viewshop/*
// @match        https://www.grundos.cafe/market/browseshop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559669/GC%20Keyboard%20Shop%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/559669/GC%20Keyboard%20Shop%20Browser.meta.js
// ==/UserScript==

var items = [];
var selectedItem = 0;
var maxIndex = 0;
var loaded = false;

new MutationObserver(function(mutations)
                     {
    items = document.querySelectorAll('#searchedItem form > input[type="image"], #shopInventory form > input[type="image"]');
    if (items)
    {
        items[0].focus();
        selectedItem = 0;
        maxIndex = items.length - 1;
        loaded = true;

        this.disconnect();
    }
}).observe(document, {childList: true, subtree: true});

(function() {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        if (!loaded || maxIndex < 0 || document.activeElement.attributes.getNamedItem("type")?.value == "text") return;
        switch(event.key) {
            case "ArrowLeft":
            case "a":
            case "4":
                if ((selectedItem -= 1) < 0) selectedItem = 0;
                items[selectedItem].focus();
                break;
            case "ArrowRight":
            case "d":
            case "6":
                if ((selectedItem += 1) > maxIndex) selectedItem = maxIndex;
                items[selectedItem].focus();
                break;
            case "ArrowUp":
            case "w":
            case "8":
                if ((selectedItem -= 4) < 0) selectedItem = 0;
                items[selectedItem].focus();
                break;
            case "ArrowDown":
            case "s":
            case "2":
                if ((selectedItem += 4) > maxIndex) selectedItem = maxIndex;
                items[selectedItem].focus();
                break;
        }
    });
})();
