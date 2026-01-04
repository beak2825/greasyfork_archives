// ==UserScript==
// @name         TTRS HACK 2025 (WORKING)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Types the answer to the first valid math equation in a highlighted block on play.ttrockstars.com, with 0.1s delay before typing.
// @author       AJM
// @match        https://play.ttrockstars.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/554542/TTRS%20HACK%202025%20%28WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554542/TTRS%20HACK%202025%20%28WORKING%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pressKey(key) {
        const keyDown = new KeyboardEvent('keydown', {
            key: key,
            code: key === 'Enter' ? 'Enter' : `Digit${key}`,
            keyCode: key === 'Enter' ? 13 : key.charCodeAt(0),
            which: key === 'Enter' ? 13 : key.charCodeAt(0),
            bubbles: true
        });
        const keyUp = new KeyboardEvent('keyup', {
            key: key,
            code: key === 'Enter' ? 'Enter' : `Digit${key}`,
            keyCode: key === 'Enter' ? 13 : key.charCodeAt(0),
            which: key === 'Enter' ? 13 : key.charCodeAt(0),
            bubbles: true
        });
        document.activeElement.dispatchEvent(keyDown);
        document.activeElement.dispatchEvent(keyUp);
    }

    function typeAnswer(answer) {
        const str = answer.toString();
        for (let i = 0; i < str.length; i++) {
            pressKey(str[i]);
        }
        pressKey('Enter');
    }

    document.addEventListener('mouseup', () => {
        const selectedText = window.getSelection().toString().trim();
        const lines = selectedText.split('\n').map(line => line.trim());

        const equationLine = lines.find(line =>
            /^[\d\s×÷\+\-\*\/=]+$/.test(line) && /[\d]+.*[×÷\*\/\+\-]/.test(line)
        );

        if (equationLine) {
            const cleaned = equationLine.replace(/=/g, '').replace(/×/g, '*').replace(/÷/g, '/').trim();
            try {
                const result = eval(cleaned);
                if (!isNaN(result)) {
                    setTimeout(() => typeAnswer(result), 100); // 0.1s delay
                }
            } catch (e) {
                console.warn('Invalid equation:', cleaned);
            }
        }
    });
})();