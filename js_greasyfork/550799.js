// ==UserScript==
// @name         Paramount Plus Auto Next Episode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically plays the next episode on Paramount Plus
// @author       woky
// @match        https://www.paramountplus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550799/Paramount%20Plus%20Auto%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/550799/Paramount%20Plus%20Auto%20Next%20Episode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CHECK_INTERVAL = 3000; // Check every 3 seconds
    const COUNTDOWN_THRESHOLD = 15; // Seconds remaining to trigger next episode
    const NEXT_EPISODE_SELECTOR = '.next-episode-button, [data-testid="next-episode-button"], .up-next-button';

    let isChecking = false;
    let countdownTimer = null;

    function findNextEpisodeButton() {
        // Try multiple selectors since Paramount Plus might change their class names
        const selectors = [
            '.next-episode-button',
            '[data-testid="next-episode-button"]',
            '.up-next-button',
            'button:contains("Next Episode")',
            'button:contains("Play Next")',
            'button:contains("Continue Watching")'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button && isVisible(button)) {
                return button;
            }
        }

        // Fallback: look for buttons with specific text content
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent && 
                (button.textContent.includes('Next Episode') || 
                 button.textContent.includes('Play Next') ||
                 button.textContent.includes('Continue Watching')) &&
                isVisible(button)) {
                return button;
            }
        }

        return null;
    }

    function isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0 && 
               window.getComputedStyle(element).visibility !== 'hidden';
    }

    function checkForCountdown() {
        // Look for countdown elements that indicate when next episode will play
        const countdownElements = document.querySelectorAll('[class*="countdown"], [class*="timer"]');
        
        for (const element of countdownElements) {
            const text = element.textContent || '';
            const match = text.match(/(\d+)/);
            if (match) {
                const seconds = parseInt(match[1]);
                if (seconds <= COUNTDOWN_THRESHOLD) {
                    return true;
                }
            }
        }

        // Also check for progress bars that might indicate end of episode
        const progressBars = document.querySelectorAll('progress, [role="progressbar"]');
        for (const bar of progressBars) {
            if (bar.value !== undefined && bar.max !== undefined) {
                const progress = (bar.value / bar.max) * 100;
                if (progress > 95) {
                    return true;
                }
            }
        }

        return false;
    }

    function tryPlayNextEpisode() {
        if (isChecking) return;
        isChecking = true;

        const nextButton = findNextEpisodeButton();
        const shouldTrigger = checkForCountdown();

        if (nextButton && shouldTrigger) {
            console.log('Auto-playing next episode on Paramount Plus');
            nextButton.click();
            
            // Also try to click any "play" button that might appear
            setTimeout(() => {
                const playButton = document.querySelector('.play-button, [data-testid="play-button"]');
                if (playButton && isVisible(playButton)) {
                    playButton.click();
                }
            }, 1000);
        }

        isChecking = false;
    }

    function monitorVideoProgress() {
        // Check video element directly for near-end state
        const video = document.querySelector('video');
        if (video && !video.paused) {
            const remaining = video.duration - video.currentTime;
            if (remaining <= COUNTDOWN_THRESHOLD && remaining > 0) {
                const nextButton = findNextEpisodeButton();
                if (nextButton) {
                    console.log('Video near end, preparing to play next episode');
                    // Don't click immediately, wait for the UI to show the next episode prompt
                }
            }
        }
    }

    function startMonitoring() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
        }

        countdownTimer = setInterval(() => {
            tryPlayNextEpisode();
            monitorVideoProgress();
        }, CHECK_INTERVAL);
    }

    // Start monitoring when page loads
    window.addEventListener('load', startMonitoring);
    
    // Also start when DOM is ready if page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(startMonitoring, 1000);
    }

    // Restart monitoring when navigating within the site (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(startMonitoring, 2000); // Wait a bit for new content to load
        }
    }).observe(document, {subtree: true, childList: true});

    console.log('Paramount Plus Auto Next Episode script loaded');
})();
