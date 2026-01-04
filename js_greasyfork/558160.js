// ==UserScript==
// @name         10FastFingers correcter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Each key types the correct letter.
// @author       Kakoncheater
// @match        https://10ff.net/*
// @match        https://10fastfingers.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558160/10FastFingers%20correcter.user.js
// @updateURL https://update.greasyfork.org/scripts/558160/10FastFingers%20correcter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findInput() {
        return document.querySelector('#word-input') ||
               document.querySelector('input[type="text"]') ||
               document.querySelector('input');
    }

    document.addEventListener('keydown', function(e) {
        const inputField = findInput();

        if (!inputField || document.activeElement !== inputField) return;

        if (e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt' ||
            e.key === 'Shift' || e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        const highlight = document.querySelector('.highlight');

        if (highlight) {
            e.preventDefault();

            const targetWord = highlight.textContent;
            const currentVal = inputField.value;

            if (currentVal === targetWord) {
                inputField.value += " ";
                const eventInput = new Event('input', { bubbles: true });
                inputField.dispatchEvent(eventInput);

                const eventDown = new KeyboardEvent('keydown', {'key':' ', 'code':'Space', 'keyCode':32, 'which':32, 'bubbles':true});
                inputField.dispatchEvent(eventDown);

                const eventUp = new KeyboardEvent('keyup', {'key':' ', 'code':'Space', 'keyCode':32, 'which':32, 'bubbles':true});
                inputField.dispatchEvent(eventUp);
            }
            else if (currentVal.length < targetWord.length) {
                inputField.value += targetWord[currentVal.length];
                const event = new Event('input', { bubbles: true });
                inputField.dispatchEvent(event);
            }
        }
    });

})();