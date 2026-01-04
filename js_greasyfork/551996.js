// ==UserScript==
// @name         YouTube Mobile - Auto Max Quality
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select the highest video quality on mobile YouTube
// @author       You
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551996/YouTube%20Mobile%20-%20Auto%20Max%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/551996/YouTube%20Mobile%20-%20Auto%20Max%20Quality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setMaxQuality() {
        // Find the video player
        const video = document.querySelector('video');
        if (!video) return false;

        // Try to access the quality settings through YouTube's player
        const player = document.querySelector('.player-container');
        if (!player) return false;

        // YouTube mobile stores quality levels in the video element
        // We need to find the settings menu button and click it
        const settingsButton = document.querySelector('button.player-settings-icon');
        if (settingsButton) {
            // Click settings
            settingsButton.click();
            
            setTimeout(() => {
                // Find quality option
                const qualityOption = document.querySelector('[aria-label*="Quality" i]');
                if (qualityOption) {
                    qualityOption.click();
                    
                    setTimeout(() => {
                        // Get all quality options and click the highest one
                        const qualityButtons = document.querySelectorAll('.quality-menu-item, [role="menuitemradio"]');
                        if (qualityButtons.length > 0) {
                            // First button is usually the highest quality
                            qualityButtons[0].click();
                            
                            // Close the menu
                            setTimeout(() => {
                                const closeButton = document.querySelector('.close-button, [aria-label*="Close" i]');
                                if (closeButton) closeButton.click();
                            }, 100);
                        }
                    }, 100);
                }
            }, 100);
            
            return true;
        }

        return false;
    }

    // Alternative approach: Set quality preference in localStorage
    function setQualityPreference() {
        try {
            // YouTube stores quality preferences
            localStorage.setItem('yt-player-quality', '{"data":"highres","creation":' + Date.now() + '}');
            localStorage.setItem('yt-player-prefer-hd', 'true');
        } catch(e) {
            console.log('[Quality Script] Could not set localStorage');
        }
    }

    // Set preference immediately
    setQualityPreference();

    // Wait for video to load and try to set quality
    let attempts = 0;
    const maxAttempts = 20;
    
    function trySetQuality() {
        if (attempts >= maxAttempts) return;
        attempts++;
        
        const video = document.querySelector('video');
        if (video && video.readyState >= 1) {
            setMaxQuality();
        } else {
            setTimeout(trySetQuality, 500);
        }
    }

    // Listen for video load
    window.addEventListener('load', () => {
        setTimeout(trySetQuality, 1000);
    });

    // Listen for YouTube navigation
    window.addEventListener('yt-navigate-finish', () => {
        attempts = 0;
        setTimeout(trySetQuality, 1000);
    });

    // Also try when page becomes visible (switching tabs)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(trySetQuality, 500);
        }
    });

})();