// ==UserScript==
// @name         HotAndCold Cheat (You're Weird)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Try the first word and it automatically guess the word (hands free after first guess)
// @author       Entirely by Gemini and Mr. Weirdest
// @match        https://www.reddit.com/r/HotAndCold/comments/*
// @match        https://*.devvit.net/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564216/HotAndCold%20Cheat%20%28You%27re%20Weird%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564216/HotAndCold%20Cheat%20%28You%27re%20Weird%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HotAndCold Script] v2.1 Loading...');

    function simulateInputAndSubmit(text) {
        const input = document.querySelector('input[type="text"]') || document.querySelector('input');

        if (!input) {
            console.error('[auto Enter] cant find the textbox');
            return;
        }

        console.log('[auto Enter] Typing:', text);

        input.focus();

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, text);

        input.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
            console.log('[auto Enter] Pressing Enter...');
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(enterEvent);
        }, 300);
    }


    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        let response;
        try {
            response = await originalFetch.apply(this, args);
        } catch (e) {
            throw e;
        }

        if (response.url && response.url.includes('guess.submitBatch')) {
            let responseData;
            try {
                responseData = await response.text();
            } catch (err) {
                console.error('[Script Error] stream_read_fail:', err);
                return response;
            }

            const match = responseData.match(/"secretWord"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
                const secretWord = match[1];

                console.clear();
                console.log(
                    '%c 🎯 Found: ' + secretWord + ' ',
                    'background: #d32f2f; color: white; font-size: 24px; padding: 10px; border-radius: 8px; font-weight: bold; border: 2px solid white;'
                );

                setTimeout(() => {
                    simulateInputAndSubmit(secretWord);
                }, 500);
            }

            const newResponse = new Response(responseData, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
            Object.defineProperty(newResponse, 'url', { value: response.url });

            return newResponse;
        }

        return response;
    };
})();