// ==UserScript==
// @name         Neopets Trading Post – Live Commas While Typing
// @namespace    cutiepie
// @version      1.0
// @description  Inserts commas into Trading Post price field while typing
// @match        https://www.neopets.com/island/tradingpost.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563843/Neopets%20Trading%20Post%20%E2%80%93%20Live%20Commas%20While%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/563843/Neopets%20Trading%20Post%20%E2%80%93%20Live%20Commas%20While%20Typing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function formatWithCommas(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function handleInput(e) {
        const input = e.target;

        if (input.tagName !== 'INPUT' || input.type !== 'text') return;

        // Only act on numeric-style inputs
        if (!/^\d|,/.test(input.value)) return;

        const cursorPos = input.selectionStart;
        const raw = input.value.replace(/,/g, '');

        if (!/^\d*$/.test(raw)) return;

        const formatted = formatWithCommas(raw);

        if (formatted === input.value) return;

        // Calculate cursor offset
        const commasBefore = (input.value.slice(0, cursorPos).match(/,/g) || []).length;
        const newCommasBefore = (formatted.slice(0, cursorPos).match(/,/g) || []).length;
        const newCursorPos = cursorPos + (newCommasBefore - commasBefore);

        input.value = formatted;

        // Notify Vue / Neopets
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Restore cursor position
        input.setSelectionRange(newCursorPos, newCursorPos);
    }

    // Capture phase so we run before Neopets handlers
    document.addEventListener('input', handleInput, true);
})();