// ==UserScript==
// @name         CS Wishlist Pets & Items Open As Defaults on Trades
// @namespace    https://www.chickensmoothie.com/
// @version      1.0
// @description  Automatically opens wishlist pets/items by default on trade pages.
// @match        https://www.chickensmoothie.com/trades/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @license        MIT

// @downloadURL https://update.greasyfork.org/scripts/559157/CS%20Wishlist%20Pets%20%20Items%20Open%20As%20Defaults%20on%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/559157/CS%20Wishlist%20Pets%20%20Items%20Open%20As%20Defaults%20on%20Trades.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- PETS ---------- */

    function setWishlistPetGroup() {
        const select = document.getElementById('sltGroup');
        if (!select) return false;

        const option = select.querySelector('option[value="-2"]');
        if (!option) return false;

        select.value = "-2";
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    function waitForPetSelect() {
        const interval = setInterval(() => {
            if (setWishlistPetGroup()) {
                clearInterval(interval);
            }
        }, 100);
    }

    /* ---------- ITEMS ---------- */

    function activateTab(selector) {
        const tab = document.querySelector(selector);
        if (!tab) return false;

        tab.click();
        return true;
    }

    function waitForItemTab(selector) {
        const interval = setInterval(() => {
            if (activateTab(selector)) {
                clearInterval(interval);
            }
        }, 100);
    }

    /* ---------- CLICK HANDLER ---------- */

    document.addEventListener(
        'click',
        function (e) {
            const id = e.target && e.target.id;

            // WANT PETS
            if (id === 'addWantPets') {
                waitForPetSelect();
            }

            // OFFER PETS
            if (id === 'addOfferPets') {
                waitForPetSelect();
            }

            // WANT ITEMS → your wishlist
            if (id === 'addWantItems') {
                waitForItemTab('a[href="#wcategory--2"]');
            }

            // OFFER ITEMS → partner wishlist
            if (id === 'addOfferItems') {
                waitForItemTab('a[href="#ocategory--2"]');
            }
        },
        true
    );
})();
