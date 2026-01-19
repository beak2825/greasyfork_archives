// ==UserScript==
// @name         JavDB Batch Opener (Want to Watch)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens items in /users/want_watch_videos in batches of 5 with a 3s delay
// @author       Gemini
// @match        https://javdb.com/users/want_watch_videos*
// @match        https://*.javdb.com/users/want_watch_videos*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563235/JavDB%20Batch%20Opener%20%28Want%20to%20Watch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563235/JavDB%20Batch%20Opener%20%28Want%20to%20Watch%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Locate the toolbar
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    // 2. Create the button
    const batchBtn = document.createElement('a');
    batchBtn.className = 'button is-info is-small is-rounded';
    batchBtn.style.marginLeft = '10px';
    batchBtn.innerHTML = '<span>🚀 Open 5 at a time</span>';

    // 3. Main Logic
    batchBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Get all links inside the movie-list
        const links = Array.from(document.querySelectorAll('.movie-list .item .box > a'))
                           .map(a => a.href);

        if (links.length === 0) {
            alert('No videos found on this page.');
            return;
        }

        batchBtn.classList.add('is-loading');
        batchBtn.disabled = true;

        const batchSize = 5;
        const delay = 3000; // 3 seconds

        for (let i = 0; i < links.length; i += batchSize) {
            const batch = links.slice(i, i + batchSize);

            // Open the current batch
            batch.forEach(url => {
                // Using GM_openInTab to bypass standard browser popup blockers
                GM_openInTab(url, { active: false, insert: true, setParent: true });
            });

            // If there are more items, wait for the delay
            if (i + batchSize < links.length) {
                batchBtn.innerText = `Waiting... (${links.length - (i + batchSize)} left)`;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        batchBtn.classList.remove('is-loading');
        batchBtn.disabled = false;
        batchBtn.innerHTML = '<span>✅ Done!</span>';
        setTimeout(() => { batchBtn.innerHTML = '<span>🚀 Open 5 at a time</span>'; }, 3000);
    });

    // 4. Append to toolbar
    toolbar.appendChild(batchBtn);

})();