// ==UserScript==
// @name         Wiki Game Cheat
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Right-click any link on the page or press W to win!
// @license      MIT
// @match        https://www.thewikigame.com/*
// @icon         https://www.thewikigame.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563689/Wiki%20Game%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/563689/Wiki%20Game%20Cheat.meta.js
// ==/UserScript==

(function () {

    function triggerWinOnLink(link) {
        if (!link) return;
        const titleDiv = document.querySelector("div.text-2xl.text-center.font-bold.font-noto-serif");
        if (!titleDiv) return;
        const text = titleDiv.textContent.trim().replace(/ +/g, "_");
        link.href = "./" + text;
        const events = ["pointerdown", "mousedown", "mouseup", "click"];
        for (const type of events) {
            const evt = new MouseEvent(type, { bubbles: true, cancelable: true, view: window, button: 0 });
            link.dispatchEvent(evt);
        }
    }

    function simulateTitleClick() {
        const titleDiv = document.querySelector("div.text-2xl.text-center.font-bold.font-noto-serif");
        if (!titleDiv) return;
        const events = ["pointerdown", "mousedown", "mouseup", "click"];
        for (const type of events) {
            const evt = new MouseEvent(type, { bubbles: true, cancelable: true, view: window, button: 0 });
            titleDiv.dispatchEvent(evt);
        }
    }

    function doWin(doc) {
        simulateTitleClick();
        const link = doc.querySelector("a[rel='mw:WikiLink'][href^='./']");
        triggerWinOnLink(link);
    }

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
                triggerWinOnLink(link);
            });

            doc.addEventListener("keydown", function(e) {
                if (e.key.toLowerCase() !== "w") return;
                doWin(doc);
            });
        });
    }

    window.addEventListener("keydown", function(e) {
        if (e.key.toLowerCase() !== "w") return;
        const iframe = document.querySelector("iframe");
        if (!iframe || !iframe.contentDocument) return;
        doWin(iframe.contentDocument);
    });

    const observer = new MutationObserver(hookIframe);
    observer.observe(document.body, { childList: true, subtree: true });
    hookIframe();

})();