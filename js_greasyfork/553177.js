// ==UserScript==
// @name         YouTube Fullscreen Title Display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Show video title in top left corner during fullscreen when controls appear
// @author       You
// @match        https://www.youtube.com/*
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553177/YouTube%20Fullscreen%20Title%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/553177/YouTube%20Fullscreen%20Title%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let titleOverlay = null;
    let isTitleVisible = false;
    let isFullscreen = false;
    let currentVideoId = null;
    
    function createTitleOverlay() {
        if (titleOverlay) return;
        
        titleOverlay = document.createElement('div');
        titleOverlay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: transparent;
            color: rgba(255, 255, 255, 0.9);
            padding: 0px;
            border-radius: 0px;
            font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif;
            font-size: 16px;
            font-weight: 500;
            max-width: 90%;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            word-wrap: normal;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            backdrop-filter: none;
            border: none;
            box-shadow: none;
            line-height: 1.2;
            letter-spacing: 0.2px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        `;
        document.body.appendChild(titleOverlay);
    }
    
    function getVideoTitle() {
        // Updated selectors for YouTube's new UI
        const selectors = [
            'h1.ytd-watch-metadata yt-formatted-string',
            'h1 yt-formatted-string',
            '.title.style-scope.ytd-video-primary-info-renderer',
            'h1.title.style-scope.ytd-video-primary-info-renderer',
            'ytd-watch-metadata h1',
            '#title h1 yt-formatted-string',
            '#above-the-fold h1',
            'ytd-watch-metadata #title h1',
            // New UI fallbacks
            'ytd-watch-metadata yt-formatted-string[class*="title"]',
            '#container h1 yt-formatted-string',
            '#info-container h1'
        ];
        
        for (const selector of selectors) {
            const titleElement = document.querySelector(selector);
            if (titleElement && titleElement.textContent.trim()) {
                return titleElement.textContent.trim();
            }
        }
        
        return 'YouTube Video';
    }
    
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }
    
    function showTitle() {
        if (!titleOverlay || !isFullscreen) return;
        
        const title = getVideoTitle();
        titleOverlay.textContent = title;
        titleOverlay.style.opacity = '1';
        isTitleVisible = true;
    }
    
    function hideTitle() {
        if (!titleOverlay) return;
        
        titleOverlay.style.opacity = '0';
        isTitleVisible = false;
    }
    
    function isFullscreenMode() {
        return document.fullscreenElement || 
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement;
    }
    
    function areControlsVisible() {
        if (!isFullscreenMode()) return false;
        
        // Check for YouTube's fullscreen controls visibility
        const selectors = [
            '.ytp-chrome-controls',
            '.ytp-chrome-bottom',
            '.ytp-chrome-top',
            'ytd-watch-flexy[theater] .ytp-chrome-bottom', // Theater mode
            '#movie_player:not(.ytp-autohide)', // Controls always visible
            '#movie_player.ytp-hover' // Mouse hover state
        ];
        
        // Check if controls are explicitly hidden
        const hiddenControls = document.querySelector('.ytp-chrome-bottom[aria-hidden="true"]');
        if (hiddenControls) return false;
        
        // Check for hover state or non-autohide mode
        const moviePlayer = document.querySelector('#movie_player');
        if (moviePlayer) {
            const isHovering = moviePlayer.classList.contains('ytp-hover');
            const isAutohide = moviePlayer.classList.contains('ytp-autohide');
            
            if (isAutohide && !isHovering) return false;
        }
        
        // Check for visible control elements
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.getBoundingClientRect().height > 0) {
                return true;
            }
        }
        
        return false;
    }
    
    function checkFullscreenState() {
        const wasFullscreen = isFullscreen;
        isFullscreen = isFullscreenMode();
        
        if (isFullscreen) {
            if (!wasFullscreen) {
                // Just entered fullscreen
                createTitleOverlay();
                checkControlsState();
            }
        } else {
            // Exited fullscreen - always hide title
            if (isTitleVisible) {
                hideTitle();
            }
        }
    }
    
    function checkControlsState() {
        if (!isFullscreen) {
            hideTitle();
            return;
        }
        
        if (areControlsVisible()) {
            if (!isTitleVisible) {
                showTitle();
            }
            // Reset hide timeout when controls are visible
            clearHideTimeout();
        } else {
            // Hide title when controls disappear
            if (isTitleVisible) {
                hideTitle();
            }
        }
    }
    
    let hideTimeout;
    function clearHideTimeout() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
    }
    
    function setupEventListeners() {
        // Fullscreen change events
        document.addEventListener('fullscreenchange', checkFullscreenState);
        document.addEventListener('webkitfullscreenchange', checkFullscreenState);
        document.addEventListener('mozfullscreenchange', checkFullscreenState);
        document.addEventListener('MSFullscreenChange', checkFullscreenState);
        
        // Mouse movement in fullscreen
        document.addEventListener('mousemove', function() {
            if (!isFullscreen) return;
            
            clearHideTimeout();
            checkControlsState();
            
            // Set timeout to hide title when controls auto-hide
            hideTimeout = setTimeout(() => {
                if (isFullscreen && isTitleVisible) {
                    hideTitle();
                }
            }, 2000);
        });
        
        // Video events
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('play', checkControlsState);
            video.addEventListener('pause', checkControlsState);
            video.addEventListener('click', checkControlsState);
        }
        
        // YouTube player events
        const moviePlayer = document.querySelector('#movie_player');
        if (moviePlayer) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class') {
                        setTimeout(checkControlsState, 100);
                    }
                });
            });
            
            observer.observe(moviePlayer, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    function checkForVideoChange() {
        const newVideoId = getVideoId();
        if (newVideoId && newVideoId !== currentVideoId) {
            currentVideoId = newVideoId;
            // Video changed, update title if visible
            if (isTitleVisible) {
                showTitle();
            }
        }
    }
    
    function initialize() {
        // Wait for YouTube to load
        if (!document.querySelector('#movie_player') && !document.querySelector('video')) {
            setTimeout(initialize, 1000);
            return;
        }
        
        createTitleOverlay();
        setupEventListeners();
        checkFullscreenState();
        
        // Check for video changes (navigation)
        setInterval(() => {
            checkForVideoChange();
            checkFullscreenState();
        }, 1000);
    }
    
    // Start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Re-initialize on YouTube navigation (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initialize, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();