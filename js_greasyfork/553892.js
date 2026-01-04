// ==UserScript==
// @name         Infinite Coins for Zenfied.com
// @version      1.3
// @description  Gives you Infinite Coins for voting.
// @author       nelvismyname
// @match        *://*.zenfied.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zenfied.com
// @grant        none
// @namespace https://greasyfork.org/users/1531346
// @downloadURL https://update.greasyfork.org/scripts/553892/Infinite%20Coins%20for%20Zenfiedcom.user.js
// @updateURL https://update.greasyfork.org/scripts/553892/Infinite%20Coins%20for%20Zenfiedcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const K = 'userTotalCoins';
    const V = '9'.repeat(20);
    const FLAG = 'coinsReloaded';
    const S = localStorage.setItem.bind(localStorage);

    try {
        if (!sessionStorage.getItem(FLAG)) {
            S(K, V);
            localStorage.setItem = (k, v) => S(k === K ? V : v);
            sessionStorage.setItem(FLAG, '1');
            console.log('made by nelv — reloading once...');
            location.reload();
        } else {
            console.log('made by nelv — already reloaded.');
        }
    } catch (e) {
        console.error(e);
    }
})();