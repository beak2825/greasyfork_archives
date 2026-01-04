// ==UserScript==
// @name         claude css
// @description  a
// @match        https://claude.ai/*
// @version 0.0.1.20251221151021
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/556172/claude%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/556172/claude%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.id = 'claudeCssStyleId';

    style.textContent = `
div:has(> div > div > div[data-testid=user-message]) {
    background-color: red !important;
    color: black !important;
}

header > div {
    background: none !important;
}

div[data-testid="user-message"] {
    max-height: revert !important;
}

div[data-testid="user-message"] > div:last-of-type {
    background: none !important;
}

div[data-testid="user-message"] + button, div[data-testid="chat-input-grid-area"] > fieldset > div:has(> div > div > div > span > button > svg > path[d*="M205.66,194.34a8"]), button[aria-label="Scroll to bottom"]:has(> div > svg > path[d*="M10 3C10.2761 3.00006"]) {
    display: none !important;
}
        `;
    document.head.appendChild(style);
})();