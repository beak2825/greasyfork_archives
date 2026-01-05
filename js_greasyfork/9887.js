// ==UserScript==
// @name         HyvisMuokkaaja
// @description  Muokkaa Hyvis.fi sivuston ulkoasua CSS avulla
// @include 	 http://*.hyvis.fi*
// @include 	 https://*.hyvis.fi*
// @grant        GM_addStyle
// @version 2
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/9887/HyvisMuokkaaja.user.js
// @updateURL https://update.greasyfork.org/scripts/9887/HyvisMuokkaaja.meta.js
// ==/UserScript==

console.log("Changed page: " + document.URL);

GM_addStyle ( "                                     \
    #content {                                   \
        margin: 15px !important;          \
    }            \
    #layout {                                   \
        width: 100% !important;          \
        margin: auto !important;          \
    }                                               \
    .KeksiWPZone2 {                                   \
        display: none !important;          \
    } \
    .KeksiPageContent2 {                                   \
        width: 100% !important;          \
		border: none !important;          \
    } \
    #MSO_ContentTable {                                   \
        width: auto !important;          \
    } \
" );