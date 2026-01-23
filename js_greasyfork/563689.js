// ==UserScript==
// @name         Wiki Game Cheat
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Right-click any link on the page and win!
// @match        https://www.thewikigame.com/*
// @license      MIT
// @icon         https://www.thewikigame.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563689/Wiki%20Game%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/563689/Wiki%20Game%20Cheat.meta.js
// ==/UserScript==

(function () {

    function hookIframe() {
        const iframe = document.querySelector("iframe");
        if (!iframe) return;

        iframe.addEventListener("load", () => {
            const doc = iframe.contentDocument;
            if (!doc) return;

            doc.addEventListener("contextmenu", function(e) {
                const link = e.target.closest("a[rel='mw:WikiLink']");
                if (!link) return;

                e.preventDefault();
                e.stopPropagation();

                const titleDiv = document.querySelector("div.text-2xl.text-center.font-bold.font-noto-serif");
                if (!titleDiv) return;

                const text = titleDiv.textContent.trim().replace(/ +/g, "_");

                link.href = "./" + text;

                const events = ["pointerdown", "mousedown", "mouseup", "click"];
                for (const type of events) {
                    const evt = new MouseEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0,
                    });
                    link.dispatchEvent(evt);
                }
            });
        });
    }

    const observer = new MutationObserver(hookIframe);
    observer.observe(document.body, { childList: true, subtree: true });

    hookIframe();

})();