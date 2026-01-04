// ==UserScript==
// @name         Suno Radio Auto-Follow
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Auto-follow artists on Suno radio, then skip to next song
// @author       Cursor
// @match        https://suno.com/radio*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554618/Suno%20Radio%20Auto-Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/554618/Suno%20Radio%20Auto-Follow.meta.js
// ==/UserScript==
// In web player, select a song and goto the menu -> Create -> Song Radio -> Play a song
// and click on the title -> This opens the right side panel -> Click back (this is important we need
// the right side panel to show the follow button - not songs) -> Sit back and enjoy
// Note: Radio songs are limited, just pick a new random song to start a new radio
// Ensures if following it does not unfollow


(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        followWaitDelay: 10000,   // Wait 10 seconds after following before skipping (ms)
        checkInterval: 2000,      // How often to check for new song (ms)
        enabled: true             // Toggle to enable/disable
    };

    let lastSongId = null;
    let isProcessing = false;
    let followActionTime = null;
    let statusOverlay = null;

    // Helper function to wait
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Create status overlay
    function createStatusOverlay() {
        if (statusOverlay) return statusOverlay;

        statusOverlay = document.createElement('div');
        statusOverlay.id = 'suno-auto-status';
        statusOverlay.style.position = 'fixed';
        statusOverlay.style.top = '20px';
        statusOverlay.style.right = '20px';
        statusOverlay.style.background = 'rgba(0, 0, 0, 0.8)';
        statusOverlay.style.color = '#fff';
        statusOverlay.style.padding = '10px 15px';
        statusOverlay.style.borderRadius = '8px';
        statusOverlay.style.zIndex = '10000';
        statusOverlay.style.fontFamily = 'system-ui, sans-serif';
        statusOverlay.style.fontSize = '12px';
        statusOverlay.style.pointerEvents = 'auto';
        statusOverlay.style.cursor = 'pointer';
        statusOverlay.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        statusOverlay.innerHTML = '<div>Suno Auto: <span id="suno-status-text">Waiting...</span></div><div style="font-size:10px;opacity:0.7;margin-top:4px;">Click to toggle</div>';

        // Toggle on click
        statusOverlay.addEventListener('click', () => {
            CONFIG.enabled = !CONFIG.enabled;
            updateStatus(CONFIG.enabled ? 'Enabled' : 'Disabled');
            console.log('[Suno Auto] ' + (CONFIG.enabled ? 'Enabled' : 'Disabled'));
        });

        document.body.appendChild(statusOverlay);
        return statusOverlay;
    }

    // Update status text
    function updateStatus(text) {
        if (!statusOverlay) createStatusOverlay();
        const statusText = document.getElementById('suno-status-text');
        if (statusText) {
            statusText.textContent = text;
        }
    }

    // Check if element is visible and interactable
    function isElementReady(element) {
        if (!element) return false;
        if (!document.body.contains(element)) return false;

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }

        if (element.disabled || element.getAttribute('disabled') !== null) {
            return false;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
            return false;
        }

        return true;
    }

    // Simple click function
    async function simulateClick(element) {
        if (!element || !document.body.contains(element)) {
            return false;
        }

        if (element.disabled || element.getAttribute('disabled') !== null) {
            return false;
        }

        try {
            element.scrollIntoView({ behavior: 'instant', block: 'center' });
            await wait(100);

            // Dispatch mouse events
            const mouseDown = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1,
                button: 0
            });

            const mouseUp = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 0,
                button: 0
            });

            const click = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 0,
                button: 0
            });

            element.dispatchEvent(mouseDown);
            await wait(20);
            element.dispatchEvent(mouseUp);
            await wait(20);
            element.dispatchEvent(click);
            await wait(20);

            // Also try native click
            element.click();

            return true;
        } catch (error) {
            console.error('[Suno Auto] Error clicking element:', error);
            return false;
        }
    }

    // Find follow button - look for button with follow/checkmark SVG near artist
    function findFollowButton() {
        // Find artist links first
        const artistLinks = Array.from(document.querySelectorAll('a[href*="/@"]'));

        for (const artistLink of artistLinks) {
            // Look for button in the same container
            let container = artistLink.closest('.flex.items-center');
            if (!container) {
                container = artistLink.parentElement;
            }

            if (container) {
                const buttons = Array.from(container.querySelectorAll('button'));
                for (const btn of buttons) {
                    const svg = btn.querySelector('svg');
                    if (svg) {
                        const path = svg.querySelector('path');
                        if (path) {
                            const pathData = path.getAttribute('d') || '';
                            // Check for add-user icon (M7.783) or checkmark (M8.63)
                            if (pathData.includes('M7.783 10.418') || pathData.includes('M8.63 11.485')) {
                                if (isElementReady(btn)) {
                                    return btn;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Fallback: search all buttons
        const buttons = Array.from(document.querySelectorAll('button'));
        for (const btn of buttons) {
            const svg = btn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    const pathData = path.getAttribute('d') || '';
                    if (pathData.includes('M7.783 10.418') || pathData.includes('M8.63 11.485')) {
                        if (isElementReady(btn)) {
                            return btn;
                        }
                    }
                }
            }
        }

        return null;
    }

    // Check if artist is already being followed - ONLY check SVG path (most reliable)
    function isArtistFollowed() {
        const followBtn = findFollowButton();
        if (!followBtn) return false;

        const svg = followBtn.querySelector('svg');
        if (!svg) return false;

        const path = svg.querySelector('path');
        if (!path) return false;

        const pathData = path.getAttribute('d') || '';

        // Checkmark icon (M8.63 11.485) = following
        if (pathData.includes('M8.63 11.485')) {
            return true;
        }

        // Add-user icon (M7.783 10.418) = not following
        if (pathData.includes('M7.783 10.418')) {
            return false;
        }

        // If we can't determine, assume not following (safer)
        return false;
    }

    // Find next song button
    function findNextButton() {
        const playbarNextBtn = document.querySelector('button[aria-label="Playbar: Next Song button"]');
        if (playbarNextBtn && isElementReady(playbarNextBtn)) {
            return playbarNextBtn;
        }

        const nextBtns = Array.from(document.querySelectorAll('button[aria-label*="Next Song"], button[aria-label*="next song"]'));
        for (const btn of nextBtns) {
            if (isElementReady(btn)) {
                return btn;
            }
        }

        return null;
    }

    // Get current song identifier from playbar
    function getCurrentSongId() {
        const playbarTitleLink = document.querySelector('a[aria-label*="Playbar: Title"]');
        if (playbarTitleLink) {
            const href = playbarTitleLink.getAttribute('href');
            if (href) {
                const match = href.match(/\/song\/([^\/\?]+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }

        const songLink = document.querySelector('a[href*="/song/"]');
        if (songLink) {
            const href = songLink.getAttribute('href');
            if (href) {
                const match = href.match(/\/song\/([^\/\?]+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }

        return null;
    }

    // Get current artist from playbar
    function getCurrentArtist() {
        const playbarArtistLink = document.querySelector('a[aria-label*="Playbar: Artist"]');
        if (playbarArtistLink) {
            const href = playbarArtistLink.getAttribute('href');
            if (href) {
                const match = href.match(/\/@([^\/]+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        return null;
    }

    // Check if song is playing
    function isSongPlaying() {
        const playButtons = Array.from(document.querySelectorAll('button[aria-label*="Play"], button[aria-label*="Pause"]'));
        for (const btn of playButtons) {
            const ariaLabel = btn.getAttribute('aria-label') || '';
            if (ariaLabel.toLowerCase().includes('pause')) {
                return true;
            }
        }

        return window.location.href.includes('suno.com/radio');
    }

    // Process current song: follow if needed, then skip after waiting
    async function processCurrentSong() {
        if (!CONFIG.enabled || isProcessing) {
            return;
        }

        if (!isSongPlaying()) {
            updateStatus('Song not playing');
            return;
        }

        const currentSongId = getCurrentSongId();
        if (!currentSongId) {
            updateStatus('No song detected');
            return;
        }

        // If song changed, reset tracking
        if (currentSongId !== lastSongId) {
            console.log('[Suno Auto] New song detected:', currentSongId);
            lastSongId = currentSongId;
            followActionTime = null; // Reset follow action time
            updateStatus('New song detected');
            // Don't process immediately, wait for next check
            return;
        }

        // Same song - check if we need to do anything
        isProcessing = true;

        try {
            const artist = getCurrentArtist();
            const followed = isArtistFollowed();
            const followBtn = findFollowButton();

            console.log('[Suno Auto] Song:', currentSongId, 'Artist:', artist, 'Followed:', followed);

            // Check if we need to follow
            if (!followed) {
                if (followBtn && isElementReady(followBtn)) {
                    // Double-check we're not following (SVG check)
                    const svg = followBtn.querySelector('svg path');
                    if (svg) {
                        const pathData = svg.getAttribute('d') || '';
                        // Only follow if we see the add-user icon (not checkmark)
                        if (pathData.includes('M7.783 10.418') && !pathData.includes('M8.63 11.485')) {
                            updateStatus('Following artist...');
                            console.log('[Suno Auto] Clicking follow button...');
                            const clicked = await simulateClick(followBtn);
                            if (clicked) {
                                followActionTime = Date.now();
                                updateStatus('Followed! Waiting 10s...');
                                await wait(1000); // Wait for state to update
                            } else {
                                console.log('[Suno Auto] Failed to click follow button');
                                updateStatus('Follow click failed');
                            }
                        } else {
                            console.log('[Suno Auto] Already following (checkmark detected)');
                            followActionTime = Date.now(); // Set time so we can skip
                        }
                    }
                } else {
                    console.log('[Suno Auto] Follow button not found');
                    updateStatus('Follow button not found');
                }
                isProcessing = false;
                return; // Check again next interval
            }

            // We're following - check if we've waited long enough
            if (followed && followActionTime) {
                const timeSinceFollow = Date.now() - followActionTime;
                if (timeSinceFollow >= CONFIG.followWaitDelay) {
                    // Time to skip!
                    updateStatus('Skipping to next...');
                    const nextBtn = findNextButton();
                    if (nextBtn && isElementReady(nextBtn)) {
                        console.log('[Suno Auto] Skipping to next song...');
                        const clicked = await simulateClick(nextBtn);
                        if (clicked) {
                            await wait(500);
                            // Reset tracking for new song
                            lastSongId = null;
                            followActionTime = null;
                            updateStatus('Skipped! Waiting for next song...');
                        } else {
                            console.log('[Suno Auto] Failed to click next button');
                            updateStatus('Failed to skip');
                        }
                    } else {
                        console.log('[Suno Auto] Next button not found');
                        updateStatus('Next button not found');
                    }
                } else {
                    const remaining = Math.ceil((CONFIG.followWaitDelay - timeSinceFollow) / 1000);
                    updateStatus(`Waiting ${remaining}s before skip...`);
                }
            } else if (followed && !followActionTime) {
                // We're following but don't have a timestamp - set it now
                followActionTime = Date.now();
                updateStatus('Already following, waiting 10s...');
            }

        } catch (error) {
            console.error('[Suno Auto] Error processing song:', error);
            updateStatus('Error: ' + error.message);
        } finally {
            isProcessing = false;
        }
    }

    // Main loop
    function startMainLoop() {
        console.log('[Suno Auto] Script started. Monitoring for songs...');
        createStatusOverlay();
        updateStatus('Monitoring...');

        setInterval(async () => {
            if (!isProcessing) {
                await processCurrentSong();
            }
        }, CONFIG.checkInterval);
    }

    // Wait for page to load, then start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMainLoop);
    } else {
        startMainLoop();
    }

    // Also listen for navigation changes (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            lastSongId = null;
            followActionTime = null;
            console.log('[Suno Auto] Page navigated, resetting...');
        }
    }).observe(document, { subtree: true, childList: true });

})();