// ==UserScript==
// @name         YouTube Music: Like All Songs in a Playlist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates liking songs in the current open playlist via a sidebar button.
// @author       KRYX0N
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556191/YouTube%20Music%3A%20Like%20All%20Songs%20in%20a%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/556191/YouTube%20Music%3A%20Like%20All%20Songs%20in%20a%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        scrollDelay: 2000,
        clickDelay: 500,
        maxScrollAttempts: 3,
        anchorLabel: "Library",
        btnId: 'ytm-like-all-sidebar-btn',
        selectors: {
            sidebarSection: 'ytmusic-guide-section-renderer',
            sidebarItems: '#items',
            playlistShelf: 'ytmusic-playlist-shelf-renderer',
            albumShelf: 'ytmusic-section-list-renderer > #contents > ytmusic-shelf-renderer',
            likeButton: 'ytmusic-like-button-renderer button[aria-label="Like"][aria-pressed="false"]'
        }
    };

    let isRunning = false;
    let stopSignal = false;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const log = (msg) => console.log(`[YTM-AutoLike] ${msg}`);

    function getSidebarItems() {
        const sections = document.querySelectorAll(CONFIG.selectors.sidebarSection);
        for (const section of sections) {
            const items = section.querySelector(CONFIG.selectors.sidebarItems);
            if (items && items.innerText.includes(CONFIG.anchorLabel)) return items;
        }
        return null;
    }

    function getActiveContainer() {
        // Priority: Specific playlist container > Album container > Body fallback
        return document.querySelector(CONFIG.selectors.playlistShelf) ||
               document.querySelector(CONFIG.selectors.albumShelf) ||
               document.body;
    }

    function updateUI(icon, text, status, active) {
        text.innerText = status;
        icon.innerText = status.includes('Liking') ? '⏳' : (status.includes('Done') ? '✅' : '👍');
        text.parentElement.style.opacity = active ? '0.7' : '1';
    }

    async function executeLikeProcess(icon, text) {
        isRunning = true;
        stopSignal = false;
        let totalLiked = 0;
        let noNewItems = 0;
        let lastHeight = 0;

        const container = getActiveContainer();
        log(`Target scope: ${container.tagName}`);

        while (!stopSignal) {
            const buttons = Array.from(container.querySelectorAll(CONFIG.selectors.likeButton));

            if (buttons.length > 0) {
                updateUI(icon, text, `Liking (${buttons.length})...`, true);
                for (const btn of buttons) {
                    if (stopSignal) break;
                    btn.click();
                    totalLiked++;
                    await wait(CONFIG.clickDelay);
                }
                noNewItems = 0;
            }

            if (stopSignal) break;

            updateUI(icon, text, 'Scrolling...', true);
            lastHeight = document.documentElement.scrollHeight;
            window.scrollTo(0, document.documentElement.scrollHeight);
            await wait(CONFIG.scrollDelay);

            if (document.documentElement.scrollHeight <= lastHeight) {
                noNewItems++;
            } else {
                noNewItems = 0;
            }

            if (noNewItems >= CONFIG.maxScrollAttempts) break;
        }

        isRunning = false;
        updateUI(icon, text, `Done (${totalLiked})`, false);
        setTimeout(() => updateUI(icon, text, 'Like All Songs', false), 4000);
        if (!stopSignal) alert(`Operation complete. Liked ${totalLiked} songs.`);
    }

    function injectButton() {
        if (document.getElementById(CONFIG.btnId)) return;

        const container = getSidebarItems();
        if (!container) return;

        const btn = document.createElement('div');
        btn.id = CONFIG.btnId;

        Object.assign(btn.style, {
            display: 'flex', alignItems: 'center', height: '48px', padding: '0 20px',
            cursor: 'pointer', color: '#ffffff', fontFamily: 'Roboto, sans-serif',
            fontSize: '14px', fontWeight: '500', borderRadius: '10px',
            transition: 'background-color 0.2s', marginBottom: '8px',
            marginLeft: '4px', marginRight: '4px'
        });

        btn.onmouseenter = () => btn.style.backgroundColor = 'rgba(255,255,255,0.1)';
        btn.onmouseleave = () => btn.style.backgroundColor = 'transparent';

        const icon = document.createElement('span');
        icon.innerText = '👍';
        Object.assign(icon.style, { marginRight: '24px', width: '24px', textAlign: 'center', fontSize: '20px' });

        const label = document.createElement('span');
        label.innerText = 'Like All Songs';
        Object.assign(label.style, { flex: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

        btn.append(icon, label);

        btn.onclick = () => {
            if (isRunning) {
                stopSignal = true;
                updateUI(icon, label, 'Stopping...', true);
            } else if (confirm('Like all visible songs in this playlist?')) {
                executeLikeProcess(icon, label);
            }
        };

        const anchor = Array.from(container.children).find(c => c.innerText.includes(CONFIG.anchorLabel));
        anchor && anchor.nextSibling ? container.insertBefore(btn, anchor.nextSibling) : container.appendChild(btn);
    }

    // Observers & Initialization
    setInterval(() => {
        const btn = document.getElementById(CONFIG.btnId);
        if (!btn || !document.body.contains(btn)) injectButton();
    }, 2000);

    new MutationObserver(() => {
        if (!document.getElementById(CONFIG.btnId)) injectButton();
    }).observe(document.body, { childList: true, subtree: true });

})();