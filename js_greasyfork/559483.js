// ==UserScript==
// @name        Hide AI Prints
// @namespace   Violentmonkey Scripts
// @match       https://www.thingiverse.com/*
// @grant       none
// @version     1.0
// @author      QuentinWidlocher
// @description 19/12/2025, 09:50:29
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559483/Hide%20AI%20Prints.user.js
// @updateURL https://update.greasyfork.org/scripts/559483/Hide%20AI%20Prints.meta.js
// ==/UserScript==

var styles = `
    .item-card-container:has(.item-card-header__meta) {
        display: none;
    }
`

var styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)