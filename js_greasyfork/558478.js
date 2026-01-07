// ==UserScript==
// @name         Instagram Reels Auto Open Comment Section
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opens the comment section when you scroll on Instagram Reels
// @match        https://www.instagram.com/reels/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558478/Instagram%20Reels%20Auto%20Open%20Comment%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/558478/Instagram%20Reels%20Auto%20Open%20Comment%20Section.meta.js
// ==/UserScript==

(function () {
    const reelTimers = new WeakMap();
    const DELAY_MS = 4000;

    const openComments = (reel) => {
        const button = reel.querySelector('svg[aria-label="Comment"]')?.closest('[role="button"]');
        if (button) button.click();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const reel = entry.target;
            if (entry.isIntersecting && !reelTimers.has(reel)) {
                const timer = setTimeout(() => {
                    openComments(reel);
                    reelTimers.delete(reel);
                }, DELAY_MS);
                reelTimers.set(reel, timer);
            } else if (!entry.isIntersecting && reelTimers.has(reel)) {
                clearTimeout(reelTimers.get(reel));
                reelTimers.delete(reel);
            }
        });
    }, { threshold: 0.6 });

    const observeReels = () => {
        const reels = Array.from(document.querySelectorAll('div')).filter(div => div.querySelector('video'));
        reels.forEach(reel => observer.observe(reel));
    };

    observeReels();

    const mutationObserver = new MutationObserver(observeReels);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
})();