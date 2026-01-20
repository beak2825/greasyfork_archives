// ==UserScript==
// @name         JavDB Batch Opener (Universal & Dynamic)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a batch open button before EVERY movie list found on the page.
// @author       Gemini
// @match        https://javdb.com/*
// @match        https://*.javdb.com/*
// @grant        GM_openInTab
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563235/JavDB%20Batch%20Opener%20%28Universal%20%20Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563235/JavDB%20Batch%20Opener%20%28Universal%20%20Dynamic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isWantWatchPage = window.location.href.includes('/users/want_watch_videos');

    // Main function to process a specific movie list
    function addBatchButton(movieList) {
        // 1. Check if this list already has a button
        if (movieList.getAttribute('data-batch-btn-added')) return;

        // 2. Find links within this specific list
        // We look for standard .box > a links or direct video links to be safe
        const movieElements = Array.from(movieList.querySelectorAll('.item .box > a, .item > a[href^="/v/"]'));
        if (movieElements.length === 0) return;

        const links = movieElements.map(a => a.href);

        // 3. Mark list as processed so we don't duplicate
        movieList.setAttribute('data-batch-btn-added', 'true');

        // 4. Create the button wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'batch-opener-wrapper';
        wrapper.style.marginBottom = '10px';
        wrapper.style.marginTop = '10px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';

        const batchBtn = document.createElement('a');
        const btnClass = isWantWatchPage ? 'is-info' : 'is-primary';
        batchBtn.className = `button ${btnClass} is-small is-rounded`;
        batchBtn.innerHTML = isWantWatchPage
            ? `<span>🚀 Open 5 at a time (All ${links.length})</span>`
            : `<span>🚀 Open 10 items (Found ${links.length})</span>`;

        let currentIndex = 0;

        batchBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (currentIndex >= links.length) return;

            batchBtn.classList.add('is-loading');
            batchBtn.style.pointerEvents = 'none';

            const openSmallBatch = (start) => {
                const end = Math.min(start + 5, links.length);
                for (let i = start; i < end; i++) {
                    GM_openInTab(links[i], { active: false, insert: true, setParent: true });
                }
                return end;
            };

            if (isWantWatchPage) {
                // "Want to Watch" Mode: Open all in batches of 5
                for (let i = currentIndex; i < links.length; i += 5) {
                    currentIndex = openSmallBatch(i);
                    if (currentIndex < links.length) {
                        batchBtn.innerText = `Waiting... (${links.length - currentIndex} left)`;
                        await new Promise(r => setTimeout(r, 3000));
                    }
                }
            } else {
                // Standard Mode: Open 10 items per click
                currentIndex = openSmallBatch(currentIndex); // First 5
                if (currentIndex < links.length) {
                    batchBtn.innerHTML = '<span>Waiting 3s...</span>';
                    await new Promise(r => setTimeout(r, 3000));
                    currentIndex = openSmallBatch(currentIndex); // Next 5
                }
            }

            // Reset UI
            batchBtn.classList.remove('is-loading');
            batchBtn.style.pointerEvents = 'auto';

            if (currentIndex >= links.length) {
                batchBtn.innerHTML = '<span>✅ All opened</span>';
                batchBtn.classList.replace(btnClass, 'is-static');
            } else {
                batchBtn.innerHTML = `<span>📂 Open 10 more (${links.length - currentIndex} left)</span>`;
            }
        });

        wrapper.appendChild(batchBtn);

        // 5. Insert BEFORE the movie list
        movieList.parentNode.insertBefore(wrapper, movieList);
    }

    // Function to scan the page for existing lists
    function scanForLists() {
        const lists = document.querySelectorAll('.movie-list');
        lists.forEach(addBatchButton);
    }

    // 1. Run immediately on load
    scanForLists();

    // 2. Set up an observer to catch lists that load later (infinite scroll, dynamic tabs)
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                shouldScan = true;
            }
        });
        if (shouldScan) scanForLists();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();