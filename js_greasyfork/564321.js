// ==UserScript==
// @name         Ludus quick login
// @namespace    https://fs.gges.dk/adfs/ls/
// @description  Logger hurtigt ind
// @version      2026-01-28
// @match        https://fs.gges.dk/adfs/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564321/Ludus%20quick%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/564321/Ludus%20quick%20login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ERROR_SPAN_ID = "errorText"; // <-- replace later
    const ERROR_TEXT =
        "Incorrect user ID or password. Type the correct user ID and password, and try again.";

    let autoLoginEnabled = true;
    let loginAttempted = false;

    let user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
        user = {
            mal: prompt("Mail"),
            pas: prompt("Kode")
        };
        localStorage.setItem("user", JSON.stringify(user));
    }

    function hasLoginError() {
        const span = document.getElementById(ERROR_SPAN_ID);
        if (!span) return false;

        const text = span.textContent.trim();
        return text === ERROR_TEXT;
    }

    function tryLogin() {
        if (!autoLoginEnabled || loginAttempted) return;

        const usernameinput = document.getElementById("userNameInput");
        const passwordinput = document.getElementById("passwordInput");
        const loginbutton   = document.getElementById("submitButton");

        if (!usernameinput || !passwordinput || !loginbutton) return;

        loginAttempted = true;

        usernameinput.value = user.mal;
        passwordinput.value = user.pas;

        loginbutton.click();
    }
    function insertRetryButton() {
    if (document.getElementById("retryLoginBtn")) return;

    const loginbutton = document.getElementById("submitButton");
    if (!loginbutton) return;

    const btn = document.createElement("button");
    btn.id = "retryLoginBtn";
    btn.type = "button";
    btn.textContent = "Genindtast loginoplysninger";
    btn.style.marginLeft = "10px";

    btn.onclick = () => {
        loginAttempted = false;
        autoLoginEnabled = true;
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
        localStorage.removeItem("user");
        user = {
            mal: prompt("Mail"),
            pas: prompt("Kode")
        };
        localStorage.setItem("user", JSON.stringify(user));
        tryLogin();
    };

    loginbutton.after(btn);
}


    const observer = new MutationObserver(() => {
        // Error check first
        if (hasLoginError()) {
            autoLoginEnabled = false;
            observer.disconnect();
            insertRetryButton();
            console.warn("Auto-login stopped: invalid credentials");
            return;
        }

        tryLogin();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Initial pass in case DOM is already ready
    if (!hasLoginError()) {
        tryLogin();
    }

})();
