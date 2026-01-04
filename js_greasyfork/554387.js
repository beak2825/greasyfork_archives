// ==UserScript==
// @name         RAE → SpanishDict Button
// @author       Minjae Kim
// @version      1.06
// @description  Adds a button to open the same word on SpanishDict
// @match        https://dle.rae.es/*
// @icon         https://play-lh.googleusercontent.com/pUNpkevAQ_eBWYy0nZjjhZFJr-gKkBmvw5Wjg9aDbo9eLTdKxI7gryY9icyy5Uul
// @run-at       document-end
// @license      MIT
// @namespace clearjade
// @downloadURL https://update.greasyfork.org/scripts/554387/RAE%20%E2%86%92%20SpanishDict%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/554387/RAE%20%E2%86%92%20SpanishDict%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const word = window.location.pathname.replace('/', '');
    if (!word) return;

    const newUrl = `https://www.spanishdict.com/translate/${word}`;

    // Create button
    const button = document.createElement('button');
    button.textContent = '🔎 View on SpanishDict';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 14px';
    button.style.fontSize = '14px';
    button.style.backgroundColor = '#0077cc';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#005fa3';
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#0077cc';
    });
    button.addEventListener('click', () => {
        window.open(newUrl, '_self');
    });

    document.body.appendChild(button);
})();
