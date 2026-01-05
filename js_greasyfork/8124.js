// ==UserScript==
// @name         WinhaWilleFix
// @description  Korjaa winhawille.
// @include 	 https://winha.saimia.fi/willenet/*
// @include 	 https://winha.saimia.fi/wille/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/3167
// @version 0.0.1.20151121233206
// @downloadURL https://update.greasyfork.org/scripts/8124/WinhaWilleFix.user.js
// @updateURL https://update.greasyfork.org/scripts/8124/WinhaWilleFix.meta.js
// ==/UserScript==

console.log("Fixed page: " + document.URL);

GM_addStyle ( "                                     \
    #DataGrid1 {                                   \
        top: 0px !important;          \
    }                                               \
    #DataGrid2 {                                   \
        top: 0px !important;          \
    } \
    #Form1 {                                   \
        margin-top: 30px !important;          \
    } \
    #L_Otsikko {                                   \
        top: 10px !important;          \
		left: 0px !important;          \
    } \
" );