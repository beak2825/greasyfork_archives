// ==UserScript==
// @name         Basic chat filter bypass
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Useless script to bypass some chat filters.
// @author       ;-;
// @match        https://arras.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558899/Basic%20chat%20filter%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/558899/Basic%20chat%20filter%20bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const zeroWidthSpace = '\u200B';
    let lastKeyTyped = '';
    let lastKeyLower = '';

    const bypassPairs = [
        ['e', 'z'],
        ['i', 'g'],
        ['u', 'c'],
        ['h', 'i'],
        ['s', 's'],
        ['i', 'c'],
        ['u', 's'],
        ['u', 'n'],
        ['a', 'p'],
        ['o', 'c'],
        ['b', 'i'],
        ['u', 't'],
        ['a', 'g'],
        ['t', 'f'],
        ['y', 's'],
        ['e', 'g']
    ];

    document.addEventListener('keydown', function (e) {
        const input = e.target;
        if (!input || (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA')) return;

        const currentKey = e.key;
        const currentKeyLower = currentKey.toLowerCase();
        const pos = input.selectionStart;
        const val = input.value;

        if (lastKeyTyped === ' ' && currentKey === '$') {
            e.preventDefault();
            const before = val.slice(0, pos - 1);
            const after = val.slice(pos);
            input.value = before + ' ' + zeroWidthSpace + '$' + after;
        input.setSelectionRange(pos + 2, pos + 2);
        }

        for (const [first, second] of bypassPairs) {
            if (lastKeyLower === first && currentKeyLower === second) {
                e.preventDefault();
                const before = val.slice(0, pos - 1);
                const after = val.slice(pos);
                input.value = before + lastKeyTyped + zeroWidthSpace + currentKey + after;
                input.setSelectionRange(pos + 2, pos + 2);
                break;
            }
        }

        if (!['Shift', 'Control', 'Alt', 'Meta'].includes(currentKey)) {
            lastKeyTyped = currentKey;
            lastKeyLower = currentKeyLower;
        }
    });
})();
