// ==UserScript==
// @name         TikTok Sidebar Toggle
// @version      1
// @description  One-click toggle for TikTok sidebar.
// @match        https://www.tiktok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @namespace https://greasyfork.org/users/1439319
// @downloadURL https://update.greasyfork.org/scripts/559355/TikTok%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559355/TikTok%20Sidebar%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CURRENT_STORAGE_KEY = 'hide_sidebar_complete';

    // Selectors: Sidebar, Input Bar, Content Wrapper
    const TARGET_SELECTOR = `
        [data-e2e="search-comment-container"],
        [class*="-DivBottomCommentContainer"],
        div[class*="--DivContentContainer"]
    `;


    // UI
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mo-sidebar-toggle';

    Object.assign(toggleBtn.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: '99999',
        backgroundColor: '#121212',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '10px 15px',
        fontFamily: 'ProximaNova, Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        opacity: '0.9',
        transition: 'background-color 0.2s, color 0.2s'
    });

    toggleBtn.onmouseenter = () => toggleBtn.style.backgroundColor = '#222';
    toggleBtn.onmouseleave = () => toggleBtn.style.backgroundColor = '#121212';

    function updateState() {
        const isHidden = GM_getValue(CURRENT_STORAGE_KEY, true);
        const elements = document.querySelectorAll(TARGET_SELECTOR);

        // Update Button
        toggleBtn.textContent = isHidden ? 'Show Sidebar' : 'Hide Sidebar';
        toggleBtn.style.color = isHidden ? '#fff' : '#FE2C55';

        // Apply Styles
        elements.forEach(el => {
            if (isHidden) {
                el.style.setProperty('display', 'none', 'important');
            } else {
                el.style.display = '';
            }
        });
    }

    toggleBtn.onclick = () => {
        const currentState = GM_getValue(CURRENT_STORAGE_KEY, true);
        GM_setValue(CURRENT_STORAGE_KEY, !currentState);
        updateState();
    };

    document.body.appendChild(toggleBtn);

    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            updateState();
            debounceTimer = null;
        }, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateState, 500);
    setTimeout(updateState, 2000);

})();