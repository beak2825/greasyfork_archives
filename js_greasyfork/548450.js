// ==UserScript==
// @name         YouTube Play All Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "Play All" button next to the "Subscribe" and "Join" button on the channel page.
// @author       Zeridiant
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548450/YouTube%20Play%20All%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548450/YouTube%20Play%20All%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const elNow = document.querySelector(selector);
                if (elNow) {
                    observer.disconnect();
                    resolve(elNow);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error("Element not found: " + selector));
            }, timeout);
        });
    }

    async function createPlayAllButton() {
        try {
            const actionRow = await waitForElement('yt-flexible-actions-view-model');
            if ([...actionRow.children].some(c => c.dataset.injectedByPABFYT === "true")) return;

            const playAllDiv = document.createElement('div');
            playAllDiv.dataset.injectedByPABFYT = "true";
            playAllDiv.className = "yt-flexible-actions-view-model-wiz__action";
            playAllDiv.style.opacity = "0";
            playAllDiv.style.animationFillMode = "forwards";

            const buttonViewModel = document.createElement('button-view-model');
            buttonViewModel.className = "yt-spec-button-view-model";

            const button = document.createElement('button');
            button.className = "yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m";

            const textDiv = document.createElement('div');
            textDiv.className = "yt-spec-button-shape-next__button-text-content";
            textDiv.textContent = "Play All";

            // Compute channel uploads playlist
            const canonical = document.querySelector('link[rel="canonical"]')?.href;
            if (!canonical) return;
            const channelID = canonical.slice(-22);
            const playlistURL = "https://www.youtube.com/playlist?list=UU" + channelID;
            const firstVideoURL = playlistURL + "&index=1&playnext=1";

            button.onclick = () => window.location.href = firstVideoURL;

            button.appendChild(textDiv);
            buttonViewModel.appendChild(button);
            playAllDiv.appendChild(buttonViewModel);
            actionRow.appendChild(playAllDiv);

            playAllDiv.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 150,
                fill: "forwards",
                easing: "ease-in"
            });
        } catch (e) {
            console.error("Play All Button error:", e);
        }
    }

    createPlayAllButton();

    const observer = new MutationObserver(() => createPlayAllButton());
    observer.observe(document.body, { childList: true, subtree: true });

})();
