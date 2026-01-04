// ==UserScript==
// @name         Twitch Auto Skip Content Warning
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the "Start Watching" button on Twitch when the mature content warning appears
// @author       Khalil Rodriguez
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552848/Twitch%20Auto%20Skip%20Content%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/552848/Twitch%20Auto%20Skip%20Content%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Interval for scanning the DOM (milliseconds)
    const CHECK_INTERVAL = 500;

    function tryClickStartWatching() {
        // Search for possible button texts (in different languages and UI structures)
        const buttonTexts = [
		'Start Watching',         // English
		'Начать просмотр',        // Russian
		'Comenzar a ver',         // Spanish
		'Commencer à regarder',   // French
		'Anschauen beginnen',     // German
		'Jetzt ansehen',          // German alternative
		'Inizia a guardare',      // Italian
		'Começar a assistir',     // Portuguese
		'Assistir agora',         // Portuguese alternative
		'視聴を開始',              // Japanese
		'시청 시작',               // Korean
		'开始观看',                // Chinese Simplified
		'開始觀看',                // Chinese Traditional
		'Izlemeye başla',         // Turkish
		];

        const buttons = Array.from(document.querySelectorAll('button, div[role=button]'));
        for (const btn of buttons) {
            const text = (btn.innerText || btn.textContent || '').trim();
            if (buttonTexts.some(bt => text.includes(bt))) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    // Periodically run the check
    setInterval(tryClickStartWatching, CHECK_INTERVAL);
})();
