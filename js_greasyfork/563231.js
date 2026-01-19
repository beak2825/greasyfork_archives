// ==UserScript==
// @name         Auto Login SALES
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Auto login, redirect, and focus DataTables search input
// @author       muftypro
// @match        https://salsabeelcars.site/index.php/login
// @match        https://salsabeelcars.site/index.php/sales_manager/car_list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563231/Auto%20Login%20SALES.user.js
// @updateURL https://update.greasyfork.org/scripts/563231/Auto%20Login%20SALES.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOGIN_URL = "https://salsabeelcars.site/index.php/login";
    const CAR_LIST_URL = "https://salsabeelcars.site/index.php/sales_manager/car_list";

    /* =========================
       LOGIN PAGE
    ========================= */
    if (window.location.href === LOGIN_URL) {

        const waitForLoginForm = setInterval(() => {
            const username = document.querySelector("#username");
            const password = document.querySelector("#password");
            const loginBtn = document.querySelector("#login_form > div:nth-child(4) > div > span");

            if (username && password && loginBtn) {
                clearInterval(waitForLoginForm);

                username.value = "sales1@salsabeel.com";
                password.value = "02345@hhgy68tybn";

                loginBtn.click();

                // Redirect after login
                setTimeout(() => {
                    window.location.href = CAR_LIST_URL;
                }, 2000);
            }
        }, 300);
    }

    /* =========================
       CAR LIST PAGE – FOCUS SEARCH
    ========================= */
    if (window.location.href === CAR_LIST_URL) {

        const focusSearchInput = setInterval(() => {
            const searchInput = document.querySelector(
                'input[type="search"][aria-controls="DataTables_Table_0"]'
            );

            if (searchInput) {
                clearInterval(focusSearchInput);
                searchInput.focus();
                searchInput.select(); // optional: highlights existing text
            }
        }, 300);
    }

})();
