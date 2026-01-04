// ==UserScript==
// @name         Saved place note: Ctrl+Enter to submit
// @description  Ctrl+Enter to submit on the popup for adding a note to a saved place.
// @namespace    https://github.com/nate-kean/
// @version      20251020
// @author       Nate Kean
// @match        https://www.google.com/maps*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553207/Saved%20place%20note%3A%20Ctrl%2BEnter%20to%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/553207/Saved%20place%20note%3A%20Ctrl%2BEnter%20to%20submit.meta.js
// ==/UserScript==

(async function() {
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (el) return el;
            await delay(pollingRateMs);
        }
    }

    async function elementGone(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (!el) return;
            await delay(pollingRateMs);
        }
    }


    while (true) {
        const el = await waitForElement("textarea.sbPorb.gRsCne.azQIhc");
        el.addEventListener("keypress", (evt) => {
            if (evt.keyCode === 10 && evt.ctrlKey) {
                document.querySelector("button.okDpye.PpaGLb.mta2Ab").click();
            }
        });
        await elementGone("textarea.sbPorb.gRsCne.azQIhc");
    }
})();
