// ==UserScript==
// @name         Roblox Outfit Randomizer By emree.el (No ROBLOSECURITY token needed!)
// @namespace    http://tampermonkey.net/
// @description   The script automatically changes your roblox avatar every second!
// @version      2.0
// @match        https://www.roblox.com/my/avatar*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/563818/Roblox%20Outfit%20Randomizer%20By%20emreeel%20%28No%20ROBLOSECURITY%20token%20needed%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563818/Roblox%20Outfit%20Randomizer%20By%20emreeel%20%28No%20ROBLOSECURITY%20token%20needed%21%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastClicked = null;

    function getOutfitAnchors() {
        return Array.from(
            document.querySelectorAll(
                '.item-card-container.outfit-card a.item-card-thumb-container'
            )
        );
    }

    function humanClick(el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        ['pointerdown', 'mousedown', 'mouseup', 'click', 'pointerup'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                view: window
            }));
        });
    }

    function clickRandomOutfit() {
        const outfits = getOutfitAnchors();
        if (outfits.length < 2) return;

        let pick;
        do {
            pick = outfits[Math.floor(Math.random() * outfits.length)];
        } while (pick === lastClicked);

        lastClicked = pick;
        humanClick(pick);

        console.log(
            '[Outfit Clicked]',
            pick.getAttribute('data-item-name') || 'unknown'
        );
    }

    // Run continuously with human delay
    function loop() {
        clickRandomOutfit();
        const delay = 1200 + Math.random() * 2500; // 1.2–3.7 sec
        setTimeout(loop, delay);
    }

    // React-safe observer
    const observer = new MutationObserver(() => {
        if (getOutfitAnchors().length > 0 && !window.__outfitLoopStarted) {
            window.__outfitLoopStarted = true;
            console.log('✅ Roblox outfits detected, starting loop');
            loop();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
