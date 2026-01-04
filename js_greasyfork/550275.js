// ==UserScript==
// @name            Google show original search result translated
// @namespace       https://greasyfork.org/users/821661
// @version         1.0
// @description     show original search result translated in google
// @author          hdyzen
// @match           https://www.google.*/search*
// @icon            https://www.google.com/s2/favicons?domain=https://www.google.com/&sz=64
// @grant           GM_addStyle
// @run-at          document-start
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/550275/Google%20show%20original%20search%20result%20translated.user.js
// @updateURL https://update.greasyfork.org/scripts/550275/Google%20show%20original%20search%20result%20translated.meta.js
// ==/UserScript==

if (typeof GM_addStyle === "undefined") {
    window.GM_addStyle = (css) => {
        const node = document.head || document.documentElement;
        node.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    };
}

GM_addStyle(`
a[data-tli][href] {
    &[lang] {
        display: inline !important;
    }

    &:not([lang]) {
        display: none !important;
    }
}

div[lang] div[lang]:has([d^="M12.87 15."]) {
    display: none !important;
}
`);
