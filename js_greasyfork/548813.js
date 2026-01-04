// ==UserScript==
// @name         Ed Start 4Rec vb.larinschitterle@gmx.de
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548813/Ed%20Start%204Rec%20vblarinschitterle%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/548813/Ed%20Start%204Rec%20vblarinschitterle%40gmxde.meta.js
// ==/UserScript==




//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  1},  // 72000
        { index: 1, adjustmentAmount:  1},  // 72000
        { index: 2, adjustmentAmount:  1},  // 72000
        { index: 3, adjustmentAmount: 0},
        { index: 4, adjustmentAmount: 0},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];

