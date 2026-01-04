// ==UserScript==
// @name         Get FB reels URLs (auto scroll)
// @namespace    http://tampermonkey.net/
// @version      2025-11-13
// @description  This loads (autoscrolls) of reels in a facebook user's reels page etc. facebook.com/{user}/reels/ and export it as a txt file. Which can be used with yt-dlp.
// @author       PartyPoison
// @match        https://www.facebook.com/*/reels*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/555693/Get%20FB%20reels%20URLs%20%28auto%20scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555693/Get%20FB%20reels%20URLs%20%28auto%20scroll%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastHeight = 0;
    let scrollAttempts = 0;
    const maxScrolls = 20; // limit how long it scrolls

    function autoScroll() {
        window.scrollTo(0, document.body.scrollHeight);

        setTimeout(() => {
            const newHeight = document.body.scrollHeight;
            if (newHeight !== lastHeight) {
                lastHeight = newHeight;
                scrollAttempts = 0; // reset if new content loaded
            } else {
                scrollAttempts++;
            }

            if (scrollAttempts < 3 && maxScrolls > 0) {
                autoScroll();
            } else {
                collectReels();
            }
        }, 2000); // adjust delay based on your internet speed
    }

    function collectReels() {
        const links = Array.from(document.querySelectorAll('a[href^="/reel/"]'))
            .map(a => a.href)
            .filter((v, i, arr) => arr.indexOf(v) === i); // remove duplicates

        console.log('✅ Found reels:', links.length);

        // Create and download a txt file
        links.shift(); //remove the first url which is '/reel/?s=tab'
        const blob = new Blob([links.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'facebook_reels.txt';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // Add a button to start
    const btn = document.createElement('button');
    btn.textContent = 'Load All Reels';
    btn.style.position = 'fixed';
    btn.style.top = '70px';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    btn.style.padding = '8px 12px';
    btn.style.background = '#1877f2';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = autoScroll;
    document.body.appendChild(btn);
})();