// ==UserScript==
// @name         ChatGPT - True Dark Theme
// @namespace    https://example.com/userscripts
// @license      MIT
// @version      1.0
// @description  Makes ChatGPT dark mode truly black by changing the styles
// @author       @krispy-snacc (https://github.com/krispy-snacc)
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/557996/ChatGPT%20-%20True%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/557996/ChatGPT%20-%20True%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function applyBlackTheme() {
        const style = document.createElement("style");
        style.id = "chatgpt-true-black-theme";
        style.textContent = `
            .dark {
                --bg-primary: #000000 !important;
                --bg-elevated-secondary: #000000 !important;
                --sidebar-surface-primary: #000000 !important;
                --main-surface-primary: #000000 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Apply immediately
    applyBlackTheme();

    console.log("[ChatGPT Dark] True black theme applied");
})();
