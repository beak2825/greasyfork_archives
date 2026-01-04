// ==UserScript==
// @name         BrocoFlix: Remember Watched Episodes
// @namespace    https://brocoflix.xyz/
// @version      1.2
// @description  Remember and highlight visited episode cards in purple on brocoflix.xyz
// @match        https://brocoflix.xyz/*
// @match        http://brocoflix.xyz/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      Pirates Only (nobody allows you anything, just believe in yourself)
// @downloadURL https://update.greasyfork.org/scripts/557885/BrocoFlix%3A%20Remember%20Watched%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/557885/BrocoFlix%3A%20Remember%20Watched%20Episodes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // New key so we don't reuse the broken "all episodes" state
    const STORAGE_KEY   = 'bf_visited_episodes_v2';
    const VISITED_CLASS = 'bf-episode-visited';

    // --- Style injection (purple with !important) ---
    const css = `
        .episode-card.${VISITED_CLASS} {
            background-color: #800080 !important; /* purple */
            border-color: #d8b4fe !important;
            outline: 2px solid #c4b5fd !important;
        }

        .episode-card.${VISITED_CLASS} .episode-info h3,
        .episode-card.${VISITED_CLASS} .episode-info p,
        .episode-card.${VISITED_CLASS} .episode-runtime {
            color: #f9fafb !important;
        }

        .episode-card.${VISITED_CLASS} .episode-number {
            background-color: #a855f7 !important;
            color: #f9fafb !important;
        }
    `;

    function addGlobalStyle(styleText) {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(styleText);
        } else {
            const style = document.createElement('style');
            style.textContent = styleText;
            document.head.appendChild(style);
        }
    }

    addGlobalStyle(css);

    // --- Storage helpers ---
    function loadVisited() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        } catch (e) {
            console.error('Error reading visited episodes from storage', e);
        }
        return {};
    }

    function saveVisited(visited) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
        } catch (e) {
            console.error('Error saving visited episodes to storage', e);
        }
    }

    const visitedEpisodes = loadVisited();

    // --- Episode key: seriesId + season + episode ---
    function getEpisodeKey(card) {
        if (!card) return null;

        const seriesId = card.getAttribute('data-id')        || '';
        const season   = card.getAttribute('data-season')    || '';
        const episode  = card.getAttribute('data-episode')   || '';

        // Need at least *something* to key on
        if (!seriesId && !season && !episode) return null;

        // Example: series:66732:s5:e1
        return `series:${seriesId || 'unknown'}:s${season || '0'}:e${episode || '0'}`;
    }

    function markEpisodeVisited(card) {
        const key = getEpisodeKey(card);
        if (!key) return;

        visitedEpisodes[key] = true;
        saveVisited(visitedEpisodes);
        card.classList.add(VISITED_CLASS);
    }

    function applyVisitedClassIfNeeded(card) {
        const key = getEpisodeKey(card);
        if (!key) return;
        if (visitedEpisodes[key]) {
            card.classList.add(VISITED_CLASS);
        }
    }

    // --- Initial scan for already present episode cards ---
    function scanExistingEpisodeCards() {
        const cards = document.querySelectorAll('.episode-card');
        cards.forEach(applyVisitedClassIfNeeded);
    }

    scanExistingEpisodeCards();

    // --- Click handler (delegated) ---
    document.addEventListener('click', function (event) {
        const card = event.target.closest('.episode-card');
        if (!card) return;
        markEpisodeVisited(card);
    }, true);

    // --- Observe DOM changes to handle dynamically loaded episodes ---
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (!mutation.addedNodes || mutation.addedNodes.length === 0) continue;

            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                if (node.classList && node.classList.contains('episode-card')) {
                    applyVisitedClassIfNeeded(node);
                }

                const innerCards = node.querySelectorAll?.('.episode-card');
                if (innerCards && innerCards.length) {
                    innerCards.forEach(applyVisitedClassIfNeeded);
                }
            });
        }
    });

    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.body) {
        startObserver();
    } else {
        window.addEventListener('DOMContentLoaded', startObserver);
    }

})();
