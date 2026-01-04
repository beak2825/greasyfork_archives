// ==UserScript==
// @name         Background Color Picker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a color picker to the page and saves the selection in cookies
// @author       George Kattenbelt
// @match        http://www.eveandersson.com/pi/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555241/Background%20Color%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/555241/Background%20Color%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper functions for cookies
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cname) === 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    // Find the form
    const form = document.querySelector('body');
    if (!form) return; // Exit if form not found

    // Create label
    const label = document.createElement('label');
    label.textContent = "Background Color: ";
    label.style.marginLeft = "10px";

    // Create color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.name = 'bgColor';

    // Load color from cookie if exists
    const savedColor = getCookie('bgColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        colorInput.value = savedColor;
    }

    // Update background and cookie when color changes
    colorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        document.body.style.backgroundColor = color;
        setCookie('bgColor', color, 365);
    });

    // Append label and input at the end of the form
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = "10px";
    wrapper.appendChild(label);
    wrapper.appendChild(colorInput);
    form.appendChild(wrapper);

})();
