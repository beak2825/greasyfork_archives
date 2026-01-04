// ==UserScript==

// @name         Spotify Infinite Scroller
// @namespace    http://tampermonkey.net/
// @version      1.9.7
// @description  Infinite podcast scrolling! Never click that pesky load more episodes button again!
// @author       TheCodingChihuahua
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @license      Apache-2.0 license
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/557810/Spotify%20Infinite%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/557810/Spotify%20Infinite%20Scroller.meta.js
// ==/UserScript==

var version = '1.9.7';

// Changelog
/*
1.9.7 (hotfix)
added logging in debug for when you toggle autoload

1.9.5 (hotfix)
I cant remember what I added in this update :P

1.9.0 (hotfix)
Moved the toggle button from top right to bottom right, and added a more dynamic debug system, now when you hover over the button the pointer changes

1.8.0 (hotfix)
Fixed the button not being clicked sometimes

1.7.0 (update)
Added a button to toggle!

1.0.5 (hotfix)
Slightly smoother (changed rootMargin to 1000 instead of 600)

1.0.0
Super simple, just clicks the button
*/

(function () {
    'use strict';
    let clicking = false;
    let enabled = true;
    let toggleButton = null;
    const clickIt = (btn) => {
        if (clicking || !enabled) return;
        clicking = true;
        const old = btn.style.outline;
        btn.style.outline = '5px solid #1ed760';
        btn.click();
        console.log('Spotify Infinite Scroll v'+version+': Clicked Load more episodes');
        setTimeout(() => btn.style.outline = old, 600);
        setTimeout(() => clicking = false, 1400);
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) clickIt(entry.target);
        });
    }, { rootMargin: '1000px', threshold: 0.0 });
    const findButton = () => {
        let btn = document.querySelector('button[data-testid="show-more-button-inline"]');
        if (!btn) {
            for (const b of document.querySelectorAll('button')) {
                const txt = (b.innerText || b.textContent || '').toLowerCase();
                if (txt.includes('load more episodes') || txt.includes('show more episodes')) {
                    btn = b; break;
                }
            }
        }
        if (btn && !btn._watched) {
            btn._watched = true;
            observer.observe(btn);
            console.log('Spotify Infinite Scroll v'+version+': Watching Load more button');
            // Manual check if already in expanded view (fixes no-trigger on short pages)
            setTimeout(() => {
                if (!btn) return; // Safety
                const rect = btn.getBoundingClientRect();
                const margin = 1000; // Matches rootMargin
                const expandedTop = -margin;
                const expandedBottom = window.innerHeight + margin;
                const expandedLeft = -margin;
                const expandedRight = window.innerWidth + margin;
                const isIntersecting = !(rect.bottom < expandedTop || rect.top > expandedBottom || rect.right < expandedLeft || rect.left > expandedRight);
                if (isIntersecting) {
                    console.log('Spotify Infinite Scroll v'+version+': Button already in view – manual trigger');
                    clickIt(btn);
                }
            }, 0);
        }
    };
    // Create the toggle button
    const createToggleButton = () => {
        if (toggleButton) return;
        toggleButton = document.createElement('button');
        toggleButton.innerHTML = 'Auto-Load: <strong>ON</strong>';
        toggleButton.style.cssText = `
            position: fixed !important;
            top: 810px !important;
            right: 15px !important;
            z-index: 99999 !important;
            padding: 12px 18px !important;
            border-radius: 25px !important;
            border: 2px solid #1ed760 !important;
            background: #1ed760 !important;
            color: #000 !important;
            font-weight: bold !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            transition: all 0.3s ease !important;
            min-width: 140px !important;
            text-align: center !important;
            cursor: pointer !important;
        `;
        toggleButton.onclick = () => {
            enabled = !enabled;
            const status = enabled ? 'ON' : 'OFF';
            toggleButton.innerHTML = `Auto-Load: <strong>${status}</strong>`;
            toggleButton.style.background = enabled ? '#1ed760' : '#ff4d4d';
            toggleButton.style.borderColor = enabled ? '#1ed760' : '#ff4d4d';
            toggleButton.style.color = enabled ? '#000' : '#fff';
            console.log('Spotify Infinite Scroll v'+version+': Autoload toggled '+enabled);
        };
        document.body.appendChild(toggleButton);
    };
    // Detect when Now Playing bar is open and move button to the left
    const updateButtonPosition = () => {
        if (!toggleButton) return;
        // Spotify's Now Playing bar has this attribute when expanded
        const nowPlayingBar = document.querySelector('[data-testid="now-playing-bar"]');
        const isExpanded = nowPlayingBar && window.getComputedStyle(nowPlayingBar).transform.includes('translateX(0');
        if (isExpanded) {
            // Move to left side
            toggleButton.style.right = 'auto';
            toggleButton.style.left = '15px';
        } else {
            // Back to right side
            toggleButton.style.left = 'auto';
            toggleButton.style.right = '15px';
        }
    };
    // Watch for Now Playing bar changes
    const npObserver = new MutationObserver(updateButtonPosition);
    const startObservers = () => {
        const npBar = document.querySelector('[data-testid="now-playing-bar"]');
        if (npBar) npObserver.observe(npBar.parentElement, { attributes: true, subtree: true });
        updateButtonPosition();
    };
    // Page navigation handling
    let lastPath = location.pathname;
    const checkPage = () => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            if (lastPath.startsWith('/show/')) {
                setTimeout(() => {
                    createToggleButton();
                    findButton();
                    startObservers();
                }, 1000);
            } else {
                if (toggleButton) toggleButton.remove();
                toggleButton = null;
            }
        }
    };
    // Start everything
    new MutationObserver(findButton).observe(document.body, { childList: true, subtree: true });
    setInterval(findButton, 3000);
    setInterval(checkPage, 300);
    setInterval(updateButtonPosition, 100); // Fallback safety
    checkPage();
    setTimeout(findButton, 100);
    console.log('Spotify Infinite Scroll v'+version+': Loaded');
})();