// ==UserScript==
// @name         Torn: The Thing Button (does nothing)
// @namespace    torn-the-thing
// @version      1.0.1
// @description  Adds a giant button called "the thing" that does absolutely nothing
// @author       Xif [3347861]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564172/Torn%3A%20The%20Thing%20Button%20%28does%20nothing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564172/Torn%3A%20The%20Thing%20Button%20%28does%20nothing%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the ridiculous button
    const btn = document.createElement('button');
    btn.textContent = "the thing";
    btn.style.cssText = `
        position: fixed;
        top: 60px;
        right: 40px;
        z-index: 999999;
        width: 260px;
        height: 140px;
        font-size: 48px;
        font-weight: bold;
        color: white;
        background: linear-gradient(145deg, #ff3366, #cc00ff);
        border: 8px solid #ffff00;
        border-radius: 30px;
        box-shadow: 0 0 40px #ff00aa,
                    inset 0 0 25px #ffffff44;
        cursor: pointer;
        transition: all 0.15s;
        text-shadow: 3px 3px 6px #000000aa;
    `;

    // Make it look even dumber when hovered
    btn.onmouseover = () => {
        btn.style.transform = 'scale(1.12)';
        btn.style.boxShadow = '0 0 70px #ff44cc';
    };

    btn.onmouseout = () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 0 40px #ff00aa';
    };

    // The most important part: does absolutely nothing
    btn.onclick = () => {
        // ✨ nothing happens here ✨
        // (you can scream internally though)
    };

    // Put it on the page
    document.body.appendChild(btn);

    // Optional: make it pulse slowly like it's very important
    setInterval(() => {
        btn.style.opacity = '0.85';
        setTimeout(() => { btn.style.opacity = '1'; }, 1200);
    }, 3000);

})();