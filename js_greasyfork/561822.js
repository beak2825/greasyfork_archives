// ==UserScript==
// @name           AnnaRoblox's Auto Sign Up Filler
// @namespace      https://www.github.com/AnnaRoblox
// @version        1.1
// @description    Adds a UI to the Roblox create account page with persistent storage for birthday and password.
// @author         AnnaRoblox
// @match          https://www.roblox.com/CreateAccount*
// @grant          none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561822/AnnaRoblox%27s%20Auto%20Sign%20Up%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/561822/AnnaRoblox%27s%20Auto%20Sign%20Up%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Persistence Helpers ---
    const STORAGE_KEY = 'roblox_autofiller_settings';

    function saveSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        settings[key] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function getSetting(key, defaultValue) {
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    // Function to generate random username: 5-20 chars, letters and numbers
    function generateRandomUsername() {
        const length = Math.floor(Math.random() * 12) + 8; // 8 to 20 for better uniqueness
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let username = '';
        for (let i = 0; i < length; i++) {
            username += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return username;
    }

    // Helper function to force React to recognize input changes
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // Inject UI into the page
    function injectUI() {
        const uiDiv = document.createElement('div');
        uiDiv.style.position = 'fixed';
        uiDiv.style.top = '10px';
        uiDiv.style.right = '10px';
        uiDiv.style.backgroundColor = '#232527';
        uiDiv.style.color = 'white';
        uiDiv.style.border = '1px solid #4f545c';
        uiDiv.style.padding = '15px';
        uiDiv.style.borderRadius = '8px';
        uiDiv.style.zIndex = '9999';
        uiDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        uiDiv.style.fontFamily = 'Arial, sans-serif';

        // Load saved values or defaults
        const savedMonth = getSetting('month', '1');
        const savedDay = getSetting('day', '1');
        const savedYear = getSetting('year', '2000');
        const savedPw = getSetting('password', 'changethislol');
        const savedGender = getSetting('gender', 'female');

        uiDiv.innerHTML = `
            <h3 style="margin-top:0">AnnaRoblox's Auto-Filler</h3>
            <label>Month (1-12):</label><br>
            <input type="number" id="monthInput" min="1" max="12" value="${savedMonth}" style="width:100%"><br><br>
            <label>Day (1-31):</label><br>
            <input type="number" id="dayInput" min="1" max="31" value="${savedDay}" style="width:100%"><br><br>
            <label>Year:</label><br>
            <input type="text" id="yearInput" value="${savedYear}" style="width:100%"><br><br>
            <label>Password:</label><br>
            <input type="text" id="passwordInput" value="${savedPw}" style="width:100%"><br><br>
            <label>Gender:</label><br>
            <select id="genderSelect" style="width:100%">
                <option value="female" ${savedGender === 'female' ? 'selected' : ''}>Female</option>
                <option value="male" ${savedGender === 'male' ? 'selected' : ''}>Male</option>
            </select><br><br>
            <label>Username:</label><br>
            <input type="text" id="usernameInput" readonly style="width:100%; background:#ddd; color:black;"><br>
            <button id="generateBtn" style="width:100%; margin-top:5px; cursor:pointer;">New Username</button><br><br>
            <button id="fillBtn" style="width:100%; padding:10px; background:#00b06f; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">FILL FORM</button>
        `;
        document.body.appendChild(uiDiv);

        // Event Listeners for Persistence
        const inputs = {
            'monthInput': 'month',
            'dayInput': 'day',
            'yearInput': 'year',
            'passwordInput': 'password',
            'genderSelect': 'gender'
        };

        Object.keys(inputs).forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                saveSetting(inputs[id], e.target.value);
            });
        });

        document.getElementById('usernameInput').value = generateRandomUsername();

        document.getElementById('generateBtn').addEventListener('click', function() {
            document.getElementById('usernameInput').value = generateRandomUsername();
        });

        document.getElementById('fillBtn').addEventListener('click', fillForm);
    }

    function fillForm() {
        const month = parseInt(document.getElementById('monthInput').value);
        const day = parseInt(document.getElementById('dayInput').value);
        const year = document.getElementById('yearInput').value;
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const gender = document.getElementById('genderSelect').value;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthValue = months[month - 1];
        const dayValue = day.toString().padStart(2, '0');

        // Birthday Selects
        const monthSelect = document.querySelector('#MonthDropdown');
        if (monthSelect) {
            monthSelect.value = monthValue;
            monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const daySelect = document.querySelector('#DayDropdown');
        if (daySelect) {
            daySelect.value = dayValue;
            daySelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const yearSelect = document.querySelector('#YearDropdown');
        if (yearSelect) {
            yearSelect.value = year;
            yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Username
        const usernameInput = document.querySelector('#signup-username');
        if (usernameInput) {
            usernameInput.focus();
            setNativeValue(usernameInput, username);
        }

        // Password
        const passwordInput = document.querySelector('#signup-password');
        if (passwordInput) {
            passwordInput.focus();
            setNativeValue(passwordInput, password);
        }

        // Gender
        let genderButton;
        if (gender === 'female') {
            genderButton = document.querySelector('#FemaleButton');
        } else if (gender === 'male') {
            genderButton = document.querySelector('#MaleButton');
        }
        if (genderButton) {
            genderButton.click();
        }
    }

    window.addEventListener('load', function() {
        setTimeout(injectUI, 20); // faster load time
    });
})();