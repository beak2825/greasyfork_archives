// ==UserScript==
// @name        CPTDB Hide Ads
// @namespace   Violentmonkey Scripts
// @match       *://cptdb.ca/*
// @grant       GM_addStyle
// @version     1.0
// @author      CyrilSLi
// @description Hide ads on cptdb.ca
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/550288/CPTDB%20Hide%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/550288/CPTDB%20Hide%20Ads.meta.js
// ==/UserScript==

GM_addStyle(`
    body {
        padding: 0 !important;
    }
    div.focus-mega-footer, ins.adsbygoogle {
        display: none !important;
    }
`);