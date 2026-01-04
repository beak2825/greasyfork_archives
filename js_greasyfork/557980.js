// ==UserScript==
// @name         autoUnibaLogin
// @namespace    https://github.com/reloia/
// @version      2025-12-05.2
// @description  Script for auto login on Uniba's elearning platform
// @author       reloia
// @match        https://idpuniba.uniba.it/simplesaml/module.php/core/loginuserpassorg*
// @match        https://elearning.uniba.it/login/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uniba.it
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557980/autoUnibaLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/557980/autoUnibaLogin.meta.js
// ==/UserScript==

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const interval = 100;
        let elapsedTime = 0;

        const checkExist = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkExist);
                    resolve(element);
                } else if (elapsedTime >= timeout) {
                    clearInterval(checkExist);
                    reject(new Error('Element not found within timeout'));
                }
                elapsedTime += interval;
            }, interval
        );
    });
}

function randomKey(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

function xorEncrypt(text, key) {
    const t = Array.from(text, c => c.charCodeAt(0));
    const k = Array.from(key,  c => c.charCodeAt(0));
    const out = t.map((c, i) => c ^ k[i % k.length]);
    return btoa(String.fromCharCode(...out));
}

function xorDecrypt(base, key) {
    const data = atob(base);
    const t = Array.from(data, c => c.charCodeAt(0));
    const k = Array.from(key,  c => c.charCodeAt(0));
    const out = t.map((c, i) => c ^ k[i % k.length]);
    return String.fromCharCode(...out);
}

function getOrCreateKey() {
    let key = GM_getValue("key", null);
    if (!key) {
        key = randomKey();
        GM_setValue("key", key);  // stored in extension storage
    }
    return key;
}

function save(id, val) {
    const key = getOrCreateKey();
    const encrypted = xorEncrypt(val, key);
    GM_setValue(id, encrypted);
}

function retrieve(id) {
    const key = getOrCreateKey();
    const encrypted = GM_getValue(id, null);
    if (!encrypted) return null;
    return xorDecrypt(encrypted, key);
}



(async function() {
    'use strict';

    if (window.location.hostname === "elearning.uniba.it") {
        const loginButton = await waitForElement("button.loginbtn.login-identityprovider-btn");

        loginButton.click();
        return;
    }

    const user = await waitForElement('input#username');
    const pass = await waitForElement('input#password');

    const org = await waitForElement('select#organization');
    org.selectedIndex = 1;

    let username = retrieve("username");
    if (!username) {
        username = prompt("Enter your username for uniba:");
        if (username) {
            save("username", username);
        }
    }

    let pw = retrieve("password");
    if (!pw) {
        pw = prompt("Enter your password for uniba:\nIT WILL BE SHOWN IN PLAIN TEXT ONCE AND STORED ENCRYPTED LOCALLY");
        if (pw) {
            save("password", pw);
        }
    }

    user.value = username;
    pass.value = pw;

    const loginForm = await waitForElement('form#f');
    loginForm.submit();
})();