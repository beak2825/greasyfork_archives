// ==UserScript==
// @name         Spankbang Age Verification Skip
// @namespace    TN1
// @version      1.0
// @description  Set Indian cookies for Spankbang
// @match        *://spankbang.com/*
// @grant        none
// @license MIT
// its free real estate, you can repost it rewrite it do anything with this code
// @downloadURL https://update.greasyfork.org/scripts/561982/Spankbang%20Age%20Verification%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/561982/Spankbang%20Age%20Verification%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set Indian cookies
    document.cookie = "country=IN; path=/; max-age=31536000; domain=.spankbang.com";
    document.cookie = "coc=IN; path=/; max-age=31536000; domain=.spankbang.com";
    document.cookie = "cor=DL; path=/; max-age=31536000; domain=.spankbang.com";
    document.cookie = "coe=in; path=/; max-age=31536000; domain=.spankbang.com";
    document.cookie = "age_verified=1; path=/; max-age=31536000; domain=.spankbang.com";

    // Also set for current domain
    document.cookie = "country=IN; path=/; max-age=31536000";
    document.cookie = "coc=IN; path=/; max-age=31536000";
    document.cookie = "age_verified=1; path=/; max-age=31536000";

    console.log('Indian cookies set for Spankbang');
})();