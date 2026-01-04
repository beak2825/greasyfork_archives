// ==UserScript==
// @name         Fantasy BasketNews Player Stats Modal (Draggable)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a draggable stats modal when player link appears on Fantasy BasketNews
// @match        https://fantasy.basketnews.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552198/Fantasy%20BasketNews%20Player%20Stats%20Modal%20%28Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552198/Fantasy%20BasketNews%20Player%20Stats%20Modal%20%28Draggable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playerLinkSelector = 'a[href*="basketnews.lt/zaidejai/"]';

    const observer = new MutationObserver(() => {
        const links = document.querySelectorAll(playerLinkSelector);
        links.forEach(link => {
            if (!link.dataset.statsButtonAdded) {
                addStatsButton(link);
                link.dataset.statsButtonAdded = 'true';
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also add for existing links on page load
    document.querySelectorAll(playerLinkSelector).forEach(link => {
        if (!link.dataset.statsButtonAdded) {
            addStatsButton(link);
            link.dataset.statsButtonAdded = 'true';
        }
    });

    function addStatsButton(link) {
        const btn = document.createElement('button');
        btn.textContent = 'Show Stats';
        btn.style.marginLeft = '10px';
        btn.style.padding = '4px 8px';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.background = '#222';
        btn.style.color = '#fff';
        btn.style.fontSize = '12px';
        btn.style.transition = '0.2s';

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#444';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#222';
        });

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const url = link.href;
            showModal('Loading stats...');
            try {
                const resp = await fetch(url);
                const html = await resp.text();

                // Parse full HTML safely
                const template = document.createElement('template');
                template.innerHTML = html;

                // Get the stats table
                const stats = template.content.querySelector('div.stats-table.stats-table-games');
                if (!stats) {
                    showModal('<p>⚠️ Stats not found on player page.</p>');
                    return;
                }

                // Fix all relative links
                stats.querySelectorAll('a[href]').forEach(a => {
                    if (a.href.startsWith('/')) { // relative link
                        a.href = 'https://www.basketnews.lt' + a.getAttribute('href');
                    }
                });

                // Insert HTML of stats table into modal
                showModal(stats.outerHTML); // pass as HTML string
            } catch (err) {
                showModal(`<p>❌ Error loading stats: ${err.message}</p>`);
            }
        });


        link.parentElement?.insertBefore(btn, link.parentElement.firstChild);
    }

    function showModal(content) {
        let modal = document.getElementById('statsModal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'statsModal';
        modal.style.position = 'fixed';
        modal.style.top = '100px';
        modal.style.left = '100px';
        modal.style.width = '1200px';
        modal.style.maxHeight = '70vh';
        modal.style.overflowY = 'auto';
        modal.style.background = '#111';
        modal.style.color = '#fff';
        modal.style.border = '2px solid #666';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        modal.style.zIndex = '9999';

        const title = document.createElement('div');
        title.textContent = 'Player Stats';
        title.style.cursor = 'move';
        title.style.padding = '10px';
        title.style.background = '#222';
        title.style.borderBottom = '1px solid #444';
        title.style.fontWeight = 'bold';
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.alignItems = 'center';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#fff';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.marginLeft = '10px';

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.remove();
        });

        title.appendChild(closeBtn);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        contentDiv.style.padding = '10px';

        modal.appendChild(title);
        modal.appendChild(contentDiv);
        document.body.appendChild(modal);

        makeDraggable(modal, title);
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return; // prevent close button drag
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            handle.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
            }
        });
    }
})();
