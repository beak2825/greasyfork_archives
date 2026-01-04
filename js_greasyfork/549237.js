// ==UserScript==
// @name         YouTube Auto-Subtitle Enforcer
// @namespace    http://tampermonkey.net/
// @version      11.3
// @description  Automatically finds and enables auto-generated subtitles for any YouTube video. Guarantees auto-generated track is selected.
// @author       Andraz
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549237/YouTube%20Auto-Subtitle%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/549237/YouTube%20Auto-Subtitle%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentVideoId = null;
    let runTimeout = null;

    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000;
    const MAX_RETRY_DELAY = 5000;

    /**
     * Waits for an element matching the selector and condition to become visible and interactable.
     * Uses exponential backoff to reduce unnecessary polling.
     * @param {string} selector - CSS selector to match elements.
     * @param {Function} condition - Filter function for elements.
     * @param {number} timeout - Maximum time to wait in milliseconds.
     * @returns {Promise<HTMLElement>} Resolves with the matching element.
     */
    function waitForElement(selector, condition = () => true, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let checkInterval = 50;

            const check = () => {
                const elements = document.querySelectorAll(selector);
                const targetElement = Array.from(elements).find(el => {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    const style = window.getComputedStyle(el);
                    const isNotHidden = style.display !== 'none' && style.visibility !== 'hidden';
                    return isVisible && isNotHidden && condition(el);
                });

                if (targetElement) {
                    resolve(targetElement);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`waitForElement timed out: ${selector}`));
                    return;
                }

                checkInterval = Math.min(checkInterval * 1.1, 200);
                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    /**
     * Checks if the video player is minimally ready for interaction.
     * @returns {boolean} True if the video element is ready.
     */
    function isPlayerReady() {
        const video = document.querySelector('video');
        if (!video) return false;
        return video.readyState >= 1 && !isNaN(video.duration) && video.duration > 0;
    }

    /**
     * Dispatches a 'c' keydown event to toggle captions (YouTube's native shortcut).
     */
    function triggerCCKeyToggle() {
        try {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Navigates the YouTube player UI to explicitly select the auto-generated subtitle track.
     * @param {HTMLElement} settingsButton - The settings button element.
     */
    async function enableAutoSubtitles(settingsButton) {
        let subtitlesWereEnabled = false;

        try {
            settingsButton.click();
            await waitForElement('.ytp-settings-menu');

            const subtitlesOption = await waitForElement('.ytp-menuitem', el => el.textContent.includes('Subtitles/CC'));
            subtitlesOption.click();

            const subtitlePanel = await waitForElement('.ytp-panel', el => {
                const title = el.querySelector('.ytp-panel-title');
                return title && title.textContent.includes('Subtitles/CC');
            });

            const subtitleTracks = subtitlePanel.querySelectorAll('.ytp-menuitem');
            const autoGenTrack = Array.from(subtitleTracks).find(el => el.textContent.includes('(auto-generated)'));

            if (autoGenTrack) {
                autoGenTrack.click();
                subtitlesWereEnabled = true;
            } else {
                const offButton = Array.from(subtitleTracks).find(el => el.textContent.toLowerCase().includes('off'));
                if (offButton) offButton.click();
                throw new Error("No auto-generated track available.");
            }

            await new Promise(r => setTimeout(r, 250));
            settingsButton.click();

            if (subtitlesWereEnabled) {
                const ccButton = await waitForElement('.ytp-subtitles-button[aria-pressed="true"]');
                ccButton.click();
                await waitForElement('.ytp-subtitles-button[aria-pressed="false"]');

                await new Promise(r => setTimeout(r, 300));
                ccButton.click();
                await waitForElement('.ytp-subtitles-button[aria-pressed="true"]');
            }

        } catch (error) {
            const openMenu = document.querySelector('.ytp-settings-menu');
            if (openMenu && window.getComputedStyle(openMenu).display !== 'none') {
                settingsButton.click();
            }
            throw error;
        }
    }

    /**
     * Attempts to enable auto-generated subtitles with retry logic.
     * Falls back to toggling CC if all menu attempts fail.
     * @param {number} attempt - Current retry attempt (1-indexed).
     */
    async function enableAutoSubtitlesWithRetry(attempt = 1) {
        try {
            const settingsButton = await waitForElement('.ytp-settings-button');
            await enableAutoSubtitles(settingsButton);
            return true;

        } catch (error) {
            if (attempt >= MAX_RETRIES) {
                try {
                    const ccButton = document.querySelector('.ytp-subtitles-button');
                    if (ccButton && ccButton.getAttribute('aria-pressed') === 'false') {
                        ccButton.click();
                    } else {
                        triggerCCKeyToggle();
                    }
                } catch (e) {
                    // Fallback failed silently.
                }
                return false;
            }

            const delay = Math.min(INITIAL_RETRY_DELAY * attempt, MAX_RETRY_DELAY);
            await new Promise(r => setTimeout(r, delay));

            return enableAutoSubtitlesWithRetry(attempt + 1);
        }
    }

    /**
     * Initializes the subtitle enabling process once the player is ready.
     */
    function run() {
        const checkInterval = setInterval(() => {
            if (!isPlayerReady()) return;

            clearInterval(checkInterval);
            enableAutoSubtitlesWithRetry(1).catch(() => {});
        }, 250);
    }

    /**
     * Handles video ID changes with debounce to avoid redundant triggers.
     * @param {string|null} newVideoId - The new video ID from URL.
     */
    function handleNewVideo(newVideoId) {
        if (newVideoId && newVideoId !== currentVideoId) {
            currentVideoId = newVideoId;
            if (runTimeout) clearTimeout(runTimeout);
            runTimeout = setTimeout(run, 1000);
        }
    }

    // Observe DOM mutations to detect SPA navigation.
    const observer = new MutationObserver(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const newVideoId = urlParams.get('v');
        handleNewVideo(newVideoId);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for YouTube's navigation event if available.
    document.addEventListener('yt-navigate-finish', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newVideoId = urlParams.get('v');
        handleNewVideo(newVideoId);
    });

    // Initial run on page load.
    const initialVideoId = new URLSearchParams(window.location.search).get('v');
    if (initialVideoId) {
        currentVideoId = initialVideoId;
        setTimeout(run, 1500);
    }
})();