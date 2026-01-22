// ==UserScript==
// @name         ItsLearning TUAS Full Login
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A scipt for auto login into ItsLearning platform for Turku University of Applied Sciences.
// @author       DanyloSh
// @match        https://idp.feide.no/*
// @match        https://idp1.turkuamk.fi/*
// @match        https://*.itslearning.com/*
// @match        https://itslearning.com/*
// @match        https://*.turkuamk.fi/*
// @match        https://turkuamk.fi/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563489/ItsLearning%20TUAS%20Full%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/563489/ItsLearning%20TUAS%20Full%20Login.meta.js
// ==/UserScript==
(() => {
    'use strict';

     //GM_setValue('turkuamk_username', 'YOUR_USERNAME');
     //GM_setValue('turkuamk_password', 'YOUR_PASSWORD');

    const LoginState = {
        FEDERATED: 0,
        FEIDE: 1,
        CREDENTIALS: 2,
        DONE: 3
    };

    function getInitialState() {
        const url = window.location.href;
        if (url.includes('idp1.turkuamk.fi')) {
            return LoginState.FEIDE;
        } else if (url.includes('itslearning.com')) {
            return LoginState.FEDERATED;
        }
        return LoginState.FEDERATED;
    }
    let state = getInitialState();
    let observer;
    let formSubmitted = false;
    function tryAdvance() {
        try {
            if (state === LoginState.FEDERATED) {
                const federated = document.querySelector(
                    ".itsl-native-login-button.itsl-button-color-federated"
                );
                if (federated) {
                    federated.click();
                    state = LoginState.FEIDE;
                }
            }
            else if (state === LoginState.FEIDE && !formSubmitted) {
                const button = document.querySelector('button[name="_eventId_proceed"]');
                const usernameField = document.getElementById('username');
                const passwordField = document.getElementById('password');
                if (button && usernameField && passwordField) {
                    const storedUsername = GM_getValue('turkuamk_username', '');
                    const storedPassword = GM_getValue('turkuamk_password', '');
                    if (storedUsername && storedPassword) {
                        formSubmitted = true;
                        usernameField.value = storedUsername;
                        passwordField.value = storedPassword;
                        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                        usernameField.dispatchEvent(new Event('change', { bubbles: true }));
                        passwordField.dispatchEvent(new Event('change', { bubbles: true }));
                        setTimeout(() => {
                            button.click();
                            state = LoginState.CREDENTIALS;
                        }, 100);
                    } else {
                        formSubmitted = true;
                    }
                }
            }
            else if (state === LoginState.CREDENTIALS) {
                const submit = document.querySelector("button[type='submit']");
                if (submit) {
                    submit.click();
                    state = LoginState.DONE;
                }
            }
            else if (state === LoginState.DONE) {
                if (document.querySelector(".l-menu-icons")) {
                    observer.disconnect();
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    observer = new MutationObserver(() => {
        tryAdvance();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Initial attempt
    tryAdvance();
})();