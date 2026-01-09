// ==UserScript==
// @name         MangaDex - Grey Latest Read
// @namespace    https://greasyfork.org/users/1476331-jon78
// @version      1.0
// @description  Titles that have the latest chapter read are set to 50% opacity.
// @author       jon78
// @license      CC0
// @match        https://mangadex.org/*
// @icon         https://mangadex.org/img/brand/mangadex-logo.svg
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561835/MangaDex%20-%20Grey%20Latest%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/561835/MangaDex%20-%20Grey%20Latest%20Read.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;
    const STORAGE_KEY = 'glr_latest_read';
    const CACHE = {};
    const CARD_CACHE = new Map();

    /* ---------- Storage ---------- */
    const loadStorage = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (err) { console.error('Failed to parse storage:', err); return {}; }
    };

    const saveStorage = storageMap => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(storageMap)); }
        catch (err) { console.error('Failed to save storage:', err); }
    };

    /* ---------- Utilities ---------- */
    const getCurrentMangaId = () => {
        const match = window.location.pathname.match(/^\/title\/([a-f0-9-]+)/);
        return match?.[1] || null;
    };

    const applyCachedStyles = (mangaId, card) => {
        try {
            const storageMap = loadStorage();
            if (storageMap[mangaId]) card?.classList.add('glr-greyed');
            else card?.classList.remove('glr-greyed');
        } catch (err) {
            console.error('applyCachedStyles error:', err);
        }
    };

    const addNewCardsToCache = (nodes) => {
        try {
            nodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                const potentialCards = node.matches?.('.manga-card') ? [node] : [];
                node.querySelectorAll?.('.manga-card').forEach(c => potentialCards.push(c));
                potentialCards.forEach(card => {
                    const href = card.querySelector('a[href^="/title/"]')?.getAttribute('href');
                    const mangaId = href?.match(/\/title\/([a-f0-9-]+)/)?.[1];
                    if (!mangaId || CARD_CACHE.has(mangaId)) return;
                    CARD_CACHE.set(mangaId, card);
                    applyCachedStyles(mangaId, card);
                });
            });
        } catch (err) {
            console.error('addNewCardsToCache error:', err);
        }
    };

    /* ---------- Debug Panel ---------- */
    let lastDebugState = '';
    function createDebugPanel() {
        if (!DEBUG || document.querySelector('#glr-debug-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'glr-debug-panel';
        Object.assign(panel.style, {
            position: 'fixed', bottom: '10px', right: '10px',
            background: 'rgba(0,0,0,0.75)', color: '#fff',
            padding: '5px', zIndex: 9999, fontSize: '12px',
            maxWidth: '380px', borderRadius: '0.25rem',
            overflowY: 'auto', maxHeight: '420px', boxSizing: 'border-box'
        });

        const header = document.createElement('div');
        Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });

        const titleSpan = document.createElement('span');
        titleSpan.textContent = '[Grey Latest Read] Debug';
        titleSpan.style.marginRight = '12px';
        titleSpan.style.fontWeight = 'bold';
        header.appendChild(titleSpan);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '∨';
        toggleBtn.style.marginRight = '3px';
        toggleBtn.onclick = () => {
            const panelContent = document.getElementById('mdt-panel-content');
            if (!panelContent) return;
            if (panelContent.style.display === 'none') {
                panelContent.style.display = 'block';
                toggleBtn.textContent = '∨';
            } else {
                panelContent.style.display = 'none';
                toggleBtn.textContent = '∧';
            }
        };
        header.appendChild(toggleBtn);

        panel.appendChild(header);

        const panelContent = document.createElement('div');
        panelContent.id = 'mdt-panel-content';
        panel.appendChild(panelContent);
        document.body.appendChild(panel);

        function updatePanel() {
            const storageData = loadStorage();
            const currentState = JSON.stringify({ cache: CACHE, storage: storageData });
            if (currentState === lastDebugState) return; // only update on change
            lastDebugState = currentState;

            panelContent.innerHTML = `
                <div style="margin-bottom:6px;">
                  <button id="mdt-clear-cache">Delete Data</button>
                </div>
                <div><strong>Cache:</strong><pre id="mdp-cache">${JSON.stringify(CACHE, null, 2)}</pre></div>
                <div><strong>LocalStorage:</strong><pre id="mdp-storage">${JSON.stringify(storageData, null, 2)}</pre></div>
            `;
            panelContent.querySelector('#mdt-clear-cache')?.addEventListener('click', () => {
                Object.keys(CACHE).forEach(k => delete CACHE[k]);
                localStorage.removeItem(STORAGE_KEY);
                CARD_CACHE.clear();
                processListingPage();
                updatePanel();
            });
        }

        setInterval(updatePanel, 1000);
        updatePanel();
    }

    /* ---------- Core Functions ---------- */
    const collectChapterRows = () => {
        const rows = [];
        document.querySelectorAll('.chapter').forEach(ch => {
            const link = ch.querySelector('a[href^="/chapter/"]');
            if (!link) return;
            const href = link.getAttribute('href');
            const chapterId = href?.match(/\/chapter\/([a-f0-9-]+)/)?.[1];
            const titleText = link.querySelector('.chapter-link')?.textContent?.trim() || link.textContent?.trim() || '';
            rows.push({
                rowEl: ch, linkEl: link, id: chapterId, title: titleText, isRead: ch.classList.contains('read')
            });
        });
        return rows;
    };

    const isChapterOrderDescending = () => {
        const candidateSpans = Array.from(document.querySelectorAll('button.md-btn span, button span, .md-btn span'));
        for (const s of candidateSpans) {
            const txt = (s.textContent || '').trim().toLowerCase();
            if (!txt) continue;
            if (txt.includes('descending')) return true;
            if (txt.includes('ascending')) return false;
        }
        return true;
    };

    const getLatestChapterInfo = () => {
        const rows = collectChapterRows();
        if (!rows.length) return null;
        const descending = isChapterOrderDescending();
        const chosen = descending ? rows[0] : rows[rows.length - 1];
        if (!chosen?.id) return null;
        return { id: chosen.id, isRead: !!chosen.isRead, linkEl: chosen.linkEl, title: chosen.title };
    };

    const storeLatestReadFromTitlePage = () => {
        const mangaId = getCurrentMangaId();
        if (!mangaId) return;
        const storageMap = loadStorage();
        const latest = getLatestChapterInfo();

        if (latest?.id && latest.isRead) {
            storageMap[mangaId] = latest.id;
            CACHE[mangaId] = true;
        } else {
            delete storageMap[mangaId];
            delete CACHE[mangaId];
        }

        saveStorage(storageMap);
        CARD_CACHE.get(mangaId) && applyCachedStyles(mangaId, CARD_CACHE.get(mangaId));
    };

    const isListingPage = () => /^\/titles\/(recent|follows)/.test(window.location.pathname) ||
                                /^\/list\/\d+\/.+/.test(window.location.pathname) ||
                                /^\/(search|)/.test(window.location.pathname);

    const processListingPage = () => {
        if (!isListingPage()) return;
        document.querySelectorAll('.manga-card a[href^="/title/"]').forEach(a => {
            const href = a.getAttribute('href');
            const mangaId = href?.match(/\/title\/([a-f0-9-]+)/)?.[1];
            const card = a.closest('.manga-card');
            if (!mangaId || !card) return;
            CARD_CACHE.set(mangaId, card);
            applyCachedStyles(mangaId, card);
        });
    };

    const updateChapterReadStatus = (chapterLinkEl, mangaId, markRead = true) => {
        try {
            const chapterId = chapterLinkEl?.getAttribute('href')?.match(/\/chapter\/([a-f0-9-]+)/)?.[1];
            if (!chapterId || !mangaId) return;

            const storage = loadStorage();
            const latest = getLatestChapterInfo();

            if (markRead && latest?.id === chapterId) {
                storage[mangaId] = chapterId;
                CACHE[mangaId] = true;
            } else {
                delete storage[mangaId];
                delete CACHE[mangaId];
            }

            saveStorage(storage);
            CARD_CACHE.get(mangaId) && applyCachedStyles(mangaId, CARD_CACHE.get(mangaId));
        } catch (err) {
            console.error('updateChapterReadStatus error:', err);
        }
    };

    /* ---------- Event Delegation ---------- */
    document.body.addEventListener('click', e => {
        try {
            const target = e.target;

            // Toggle chapter read
            const readBtn = target.closest('.readMarker');
            if (readBtn) {
                const chapterLink = readBtn.closest('a[href*="/chapter/"]');
                const mangaId = getCurrentMangaId();
                if (!chapterLink || !mangaId) return;
                const row = chapterLink.closest('.chapter');
                const currentlyRead = row?.classList.contains('read') || false;
                updateChapterReadStatus(chapterLink, mangaId, !currentlyRead);
                return;
            }

            // "Mark all on page" or sorting buttons
            const btn = target.closest('button.md-btn');
            if (!btn) return;
            const text = btn.querySelector('span')?.textContent?.trim().toLowerCase() || '';
            const mangaId = getCurrentMangaId();
            if (!mangaId) return;

            if (text.includes('mark all on page')) {
                const latest = getLatestChapterInfo();
                if (!latest?.id) {
                    const storage = loadStorage();
                    delete storage[mangaId];
                    saveStorage(storage);
                    delete CACHE[mangaId];
                    CARD_CACHE.get(mangaId) && applyCachedStyles(mangaId, CARD_CACHE.get(mangaId));
                    return;
                }
                updateChapterReadStatus(latest.linkEl, mangaId, text.includes('read'));
                return;
            }

            if (text.includes('ascending') || text.includes('descending')) {
                setTimeout(storeLatestReadFromTitlePage, 120);
            }
        } catch (err) {
            console.error('Event delegation error:', err);
        }
    });

    /* ---------- SPA Support ---------- */
    const handleSPANavigation = () => {
        try {
            const cards = document.querySelectorAll('.manga-card');
            addNewCardsToCache(cards);

            const path = window.location.pathname;
            if (/^\/title\//.test(path)) {
                storeLatestReadFromTitlePage();
            } else if (isListingPage()) {
                processListingPage();
            }
        } catch (err) {
            console.error('handleSPANavigation error:', err);
        }
    };

    const observePageChanges = () => {
        try {
            const observer = new MutationObserver(mutations => {
                try {
                    const addedNodes = [];
                    mutations.forEach(m => m.addedNodes.forEach(node => addedNodes.push(node)));
                    addNewCardsToCache(addedNodes);
                    handleSPANavigation();
                } catch (err) {
                    console.error('MutationObserver callback error:', err);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const originalPushState = history.pushState;
            history.pushState = function (...args) {
                try {
                    originalPushState.apply(this, args);
                    setTimeout(handleSPANavigation, 50);
                } catch (err) {
                    console.error('history.pushState error:', err);
                }
            };

            window.addEventListener('popstate', handleSPANavigation);

        } catch (err) {
            console.error('observePageChanges error:', err);
        }
    };

    /* ---------- CSS ---------- */
    const style = document.createElement('style');
    style.textContent = `
        .glr-greyed { opacity: 0.5 !important; transition: opacity 0.15s; }
        #glr-debug-panel button { cursor: pointer; }
    `;
    document.head.appendChild(style);

    /* ---------- Start ---------- */
    const start = () => {
        if (DEBUG) createDebugPanel();
        if (/^\/title\//.test(window.location.pathname)) storeLatestReadFromTitlePage();
        else if (isListingPage()) processListingPage();
        observePageChanges();
    };

    start();
})();
