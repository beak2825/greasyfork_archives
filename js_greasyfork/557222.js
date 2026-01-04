// ==UserScript==
// @name         Huawei Router Autofill Account
// @namespace    Huawei HG6145D2 WKE2.094.443A01
// @version      1.0
// @description  Automatically fills in the Huawei router login form with stored credentials, equipped with a secure username and password configuration menu.
// @author       MochAdiMR
// @match        *://192.168.1.1/html/login_inter.html
// @icon         https://i.imgur.com/OsLkmXp.png
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557222/Huawei%20Router%20Autofill%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/557222/Huawei%20Router%20Autofill%20Account.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION FUNCTIONS ---

    // Function to set Username via Menu
    function setUsername() {
        const currentVal = GM_getValue("router_username", "admin");
        const newVal = prompt("Enter Router Username:", currentVal);
        if (newVal !== null) {
        GM_setValue("router_username", newVal);
        alert("Username saved! Refresh the page to apply.");
    }
}

    // Function to set Password via Menu
    function setPassword() {
        // We do not display the old password in the prompt for simple visual security
        const newVal = prompt("Enter Router Password:", "");
        if (newVal !== null) {
            GM_setValue("router_password", newVal);
            alert("Password saved! Refresh the page to apply.");
        }
    }

    // Register the menu in Tampermonkey
    GM_registerMenuCommand("⚙ Set Username", setUsername);
    GM_registerMenuCommand("🔑 Set Password", setPassword);


    // --- AUTOFILL FUNCTION ---

    // Retrieve saved data
    const savedUser = GM_getValue("router_username", "");
    const savedPass = GM_getValue("router_password", "");

    // Check if data exists
    if (!savedUser || !savedPass) {
        return;
    }

    // Wait a moment to ensure the HTML elements are ready
    window.addEventListener('load', function() {
        const userField = document.getElementById('user_name');
        const passField = document.getElementById('loginpp');

        // Fill in Username
        if (userField) {
            userField.value = savedUser;
            // Trigger the 'input' or 'change' event so that the router system detects typing
            userField.dispatchEvent(new Event('input', { bubbles: true }));
            userField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Fill in Password
        if (passField) {
            passField.value = savedPass;
            // Trigger an event so the system detects input
            passField.dispatchEvent(new Event('input', { bubbles: true }));
            passField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // OPTIONAL: Click the login button automatically (if you want, provide the login button ID later)
        // document.getElementById('id_tombol_login').click();
    });

})();