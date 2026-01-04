// ==UserScript==
// @name         Amenitiz - Hide useless currencies and languages
// @namespace    http://amenitiz.io
// @version      1.1
// @description  Hides useless currencies and languages on Amenetiz booking edition
// @author       Laurent Chervet
// @license      MIT
// @match        https://*.amenitiz.io/fr/admin/calendar
// @match        https://*.amenitiz.io/fr/admin/clients/show*
// @match        https://*.amenitiz.io/fr/admin/invoice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556878/Amenitiz%20-%20Hide%20useless%20currencies%20and%20languages.user.js
// @updateURL https://update.greasyfork.org/scripts/556878/Amenitiz%20-%20Hide%20useless%20currencies%20and%20languages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ℹ️ Init Amenitiz - Hide useless currencies and languages')

    let scripty_langAndMoney_allowed_currencies = [
        'Swiss Franc'
    ]

    let scripty_langAndMoney_allowed_languages = [
        'allemand',
        'anglais',
        'français',
        'italien'
    ]

    // DANGER ZONE BELOW, CHANGE AT YOUR OWN RISK
    document.body.addEventListener('click', function() {
        let langCounter = 0
        let currenciesCounter = 0
        try {
            for (const option of document.querySelectorAll('#client_account_currency > option')) {
                if (!scripty_langAndMoney_allowed_currencies.includes(option.text) && !option.disabled) {
                    option.parentElement.removeChild(option)
                    currenciesCounter++
                }
            }
            for (const option of document.querySelectorAll('#client_account_language > option')) {
                if (!scripty_langAndMoney_allowed_languages.includes(option.text) && !option.disabled) {
                    option.parentElement.removeChild(option)
                    langCounter++
                }
            }
            if (langCounter > 0 || currenciesCounter > 0) {
                console.log(`✅ Removed ${langCounter} languages and ${currenciesCounter} useless currencies`)
            }
        } catch (e) {}
    })
})();