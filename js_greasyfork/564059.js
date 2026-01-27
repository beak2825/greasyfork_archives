// ==UserScript==
// @name         HiAnime - Search & Filter Hide Watched
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  Hides watched shows on /search and /filter pages. Adds a widget to your watch list page that allows you to copy the watch list tabs you select to a locally saved list that is then used to hide shows when viewing the search and filter pages. Additionally, in order to prevent cases where all or nearly all shows on a page of the search, this also implements infinite scrolling on the search and filter pages.
// @author       Zack Weiler via google AI
// @license      MIT
// @match        https://hianime.to/search*
// @match        https://hianime.to/filter*
// @match        https://hianime.to/user/watch-list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564059/HiAnime%20-%20Search%20%20Filter%20Hide%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/564059/HiAnime%20-%20Search%20%20Filter%20Hide%20Watched.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const extractID = (url) => {
        if (!url) return null;
        if (url.includes('/user/') || url.includes('/search') || url.includes('/filter') || url.includes('/home')) return null;
        const parts = url.split('/');
        const slug = parts[parts.length - 1].split('?')[0];
        return (slug.length > 3 && slug.includes('-')) ? slug : null;
    };

    // 1. SYNC MONITOR & DATA COLLECTION
    if (window.location.pathname.includes('/user/watch-list')) {
        const syncUI = document.createElement('div');
        syncUI.style = "position:fixed; top:100px; right:20px; background:#111; color:#fff; padding:15px; border-radius:12px; z-index:999999; border:2px solid #00ff88; font-family:sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.5); text-align:center; min-width:180px;";

        const savedCats = JSON.parse(localStorage.getItem('hianime_sync_selections') || '["4","5"]');

        syncUI.innerHTML = `
            <div style="font-size:14px; opacity:0.8; margin-bottom:5px;">Watchlist Hide on Search Database Count</div>
            <div id="sync-count" style="font-size:20px; font-weight:bold; color:#00ff88;">0</div>

            <div id="cat-toggles" style="margin: 2px 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; font-size: 10px; color: #aaa;">
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="" ${savedCats.includes("") ? "checked" : ""}> All</label>
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="1" ${savedCats.includes("1") ? "checked" : ""}> Watching</label>
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="2" ${savedCats.includes("2") ? "checked" : ""}> On-Hold</label>
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="3" ${savedCats.includes("3") ? "checked" : ""}> Plan to Watch</label>
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="4" ${savedCats.includes("4") ? "checked" : ""}> Dropped</label>
                <label style="display:flex; align-items:center; gap:3px;"><input type="checkbox" class="sync-cat" value="5" ${savedCats.includes("5") ? "checked" : ""}> Complete</label>
            </div>

            <div id="db-controls" style="margin: 2px 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                <button id="auto-sync-btn" style="margin-top:2px; background:#00ff88; border:none; color:#000; padding:5px; border-radius:4px; cursor:pointer; font-size:14px; font-weight:bold; width:45%;">Sync Selected</button>
                <button id="clear-db-btn" style="margin-top:2px; background:transparent; border:1px solid #ff4444; color:#ff4444; padding:4px; border-radius:4px; cursor:pointer; font-size:14px; width:45%;">Clear Database</button>
            </div>
            <div id="sync-status" style="font-size:9px; margin-top:3px; color:#aaa;">Ready</div>
        `;
        document.body.appendChild(syncUI);

        syncUI.querySelectorAll('.sync-cat').forEach(cb => {
            cb.addEventListener('change', () => {
                const currentSelections = Array.from(syncUI.querySelectorAll('.sync-cat:checked')).map(c => c.value);
                localStorage.setItem('hianime_sync_selections', JSON.stringify(currentSelections));
            });
        });

        const updateDisplay = () => {
            const watched = JSON.parse(localStorage.getItem('hianime_filtered')) || [];
            const countEl = document.getElementById('sync-count');
            if (countEl) countEl.innerText = watched.length;
        };

        const autoSync = async () => {
            const btn = document.getElementById('auto-sync-btn');
            const status = document.getElementById('sync-status');
            const selectedTypes = Array.from(document.querySelectorAll('.sync-cat:checked')).map(cb => cb.value);

            if (selectedTypes.length === 0) { status.innerText = "Select a folder!"; return; }

            btn.disabled = true;
            btn.style.opacity = "0.5";

            let watchedSet = new Set(JSON.parse(localStorage.getItem('hianime_filtered')) || []);
            const maxPages = 25;

            for (const t of selectedTypes) {
                for (let p = 1; p <= maxPages; p++) {
                    status.innerText = `Type ${t || 'All'} | Page ${p}...`;
                    try {
                        // FIXED: Added 'type=' parameter which is required for category selection
                        const response = await fetch(`https://hianime.to/user/watch-list?{t}&page=${p}`);
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");

                        const links = doc.querySelectorAll('.film-poster-ahref, .film-name a');
                        if (links.length === 0) break;

                        links.forEach(a => {
                            const id = extractID(a.getAttribute('href'));
                            if (id) watchedSet.add(id);
                        });

                        localStorage.setItem('hianime_filtered', JSON.stringify([...watchedSet]));
                        updateDisplay();
                        await new Promise(r => setTimeout(r, 200));
                    } catch (e) { break; }
                }
            }
            status.innerText = "Sync Complete!";
            btn.disabled = false;
            btn.style.opacity = "1";
        };

        document.getElementById('auto-sync-btn').onclick = autoSync;
        document.getElementById('clear-db-btn').onclick = () => { if (confirm("Clear DB?")) { localStorage.removeItem('hianime_filtered'); location.reload(); }};

        updateDisplay();
    }

    // 2. FILTERING LOGIC (Search & Filter)
    if (window.location.pathname.includes('/search') || window.location.pathname.includes('/filter')) {
        let isHidden = true;
        const filterUI = document.createElement('div');
        filterUI.style = "position:fixed; bottom:20px; right:20px; background:#111; color:#fff; padding:10px; border-radius:12px; z-index:999999; display:flex; align-items:center; gap:10px; border:1px solid #ffb800; font-family:sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.5);";
        const label = document.createElement('span');
        label.style = "color:#ffb800; font-weight:bold;";
        label.innerText = 'Hidden: 0';
        const btn = document.createElement('button');
        btn.innerText = 'Show All';
        btn.style = "background:#ffb800; border:none; color:#000; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;";
        filterUI.append(label, btn);
        document.body.appendChild(filterUI);

        const applyFilter = () => {
            const watched = new Set(JSON.parse(localStorage.getItem('hianime_filtered')) || []);
            const cards = document.querySelectorAll('.flw-item, .film-item');
            let count = 0;
            cards.forEach(card => {
                const link = card.querySelector('.film-poster-ahref, .film-name a');
                if (link) {
                    const id = extractID(link.getAttribute('href'));
                    if (id && watched.has(id)) {
                        count++;
                        if (isHidden) {
                            card.style.setProperty('display', 'none', 'important');
                        } else {
                            card.style.setProperty('display', 'block', 'important');
                            card.style.opacity = '0.3';
                            card.style.filter = 'grayscale(100%)';
                        }
                    } else {
                        card.style.setProperty('display', 'block', 'important');
                        card.style.opacity = '1';
                        card.style.filter = 'none';
                    }
                }
            });
            label.innerText = `${isHidden ? 'Hidden' : 'Watched'}: ${count}`;
        };

        btn.onclick = () => {
            isHidden = !isHidden;
            btn.innerText = isHidden ? 'Show All' : 'Hide Watched';
            applyFilter();
        };

        const observer = new MutationObserver(() => {
            clearTimeout(window.filterTimeout);
            window.filterTimeout = setTimeout(applyFilter, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        applyFilter();
    }

    // 3. INFINITE SCROLL (Search & Filter)
    if (window.location.pathname.includes('/search') || window.location.pathname.includes('/filter')) {
        let nextPage = 2;
        let isLoading = false;
        const mainContainer = document.querySelector('.film_list-wrap');

        const loadMoreCards = async () => {
            if (isLoading) return;
            isLoading = true;

            const url = new URL(window.location.href);
            url.searchParams.set('page', nextPage);

            try {
                const response = await fetch(url.href);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const newCards = doc.querySelectorAll('.flw-item');

                if (newCards.length > 0) {
                    newCards.forEach(card => {
                        mainContainer.appendChild(card);
                    });
                    nextPage++;
                }
            } catch (e) {
                console.error("Failed to load more cards:", e);
            } finally {
                isLoading = false;
            }
        };

        // Trigger load when user scrolls near the bottom
        window.onscroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                loadMoreCards();
            }
        };
    }
})();
