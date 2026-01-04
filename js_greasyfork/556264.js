// ==UserScript==
// @name         Ed Start 4Rec dkb.werner@wstahr.de
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
// @downloadURL https://update.greasyfork.org/scripts/556264/Ed%20Start%204Rec%20dkbwerner%40wstahrde.user.js
// @updateURL https://update.greasyfork.org/scripts/556264/Ed%20Start%204Rec%20dkbwerner%40wstahrde.meta.js
// ==/UserScript==





// FINSTATUS

  // Index → adjustment mapping (1-based indices)
  const FINSTATBALANCE_CONFIGS = [   /// STARTS WITH 1, NOT 0
    { index: 1, adjustmentAmount: 1 },
    { index: 2, adjustmentAmount: 1 },
    { index: 3, adjustmentAmount: 0 },
    { index: 4, adjustmentAmount: 0 },
    { index: 8, adjustmentAmount: 0 },
    { index: 9, adjustmentAmount: 0 },
    { index: 11, adjustmentAmount: 0 },
    // add more as needed...
  ];

