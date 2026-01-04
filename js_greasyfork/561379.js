// ==UserScript==
// @name         YouTube - Shorts Blocker
// @description  Removes ALL YouTube Shorts from every page: homepage, sidebar, search results, channels, subscriptions, everywhere!
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @version      0.0.1
// @author       rxm
// @match        *://*.youtube.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561379/YouTube%20-%20Shorts%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/561379/YouTube%20-%20Shorts%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function isSearchPage() {
        const path = window.location.pathname;
        const search = window.location.search;
        
        // Only TRUE for actual search results pages
        return path.includes('/results') || 
               (search.includes('search_query') && path === '/');
    }
    
    function hideElement(el) {
        if (el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.height = '0';
            el.style.width = '0';
            el.style.overflow = 'hidden';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
        }
    }
    
    // NEW FUNCTION: Just for search pages - TARGETED FIX
    function removeShortsFromSearch() {
        console.log('Removing Shorts from search...');
        
        // TARGETED FIX 1: Remove the specific grid-shelf-view-model container
        // This is the exact container from your HTML
        document.querySelectorAll('grid-shelf-view-model.ytGridShelfViewModelHost').forEach(container => {
            // Check if it contains "Shorts" text
            const text = container.textContent || '';
            if (text.includes('Shorts')) {
                hideElement(container);
            }
        });
        
        // TARGETED FIX 2: Remove ytd-item-section-renderer with ytGridShelfViewModelHost class
        document.querySelectorAll('ytd-item-section-renderer.ytGridShelfViewModelHost').forEach(section => {
            hideElement(section);
        });
        
        // TARGETED FIX 3: Remove any element with class shortsLockupViewModelHost
        document.querySelectorAll('.shortsLockupViewModelHost').forEach(el => {
            hideElement(el);
        });
        
        // TARGETED FIX 4: Remove reel-item-endpoint links
        document.querySelectorAll('a.reel-item-endpoint, a[href*="/shorts/"]').forEach(link => {
            hideElement(link);
            // Hide the parent container if it exists
            const parentContainer = link.closest('ytd-item-section-renderer, grid-shelf-view-model, .shortsLockupViewModelHost');
            if (parentContainer) hideElement(parentContainer);
        });
        
        // TARGETED FIX 5: Remove the "Shorts" header specifically
        document.querySelectorAll('h2.yt-shelf-header-layout__title').forEach(header => {
            const text = header.textContent || '';
            if (text.trim() === 'Shorts') {
                // Find and hide the entire container
                let container = header.closest('grid-shelf-view-model, ytd-item-section-renderer, .ytGridShelfViewModelHost');
                if (!container) {
                    // Go up the DOM to find the container
                    let parent = header;
                    for (let i = 0; i < 5; i++) {
                        parent = parent.parentElement;
                        if (!parent) break;
                        
                        const tagName = parent.tagName.toLowerCase();
                        const className = parent.className || '';
                        if (tagName.includes('shelf') || 
                            tagName.includes('grid') || 
                            className.includes('ytGridShelfViewModelHost')) {
                            container = parent;
                            break;
                        }
                    }
                }
                if (container) hideElement(container);
            }
        });
        
        // Keep the existing simpler checks (they should still work)
        document.querySelectorAll('ytd-reel-shelf-renderer').forEach(section => {
            hideElement(section);
        });
        
        document.querySelectorAll('ytd-reel-item-renderer').forEach(el => {
            hideElement(el);
        });
        
        document.querySelectorAll('[overlay-style="SHORTS"]').forEach(badge => {
            hideElement(badge);
            const container = badge.closest('ytd-video-renderer, ytd-rich-item-renderer');
            if (container) hideElement(container);
        });
    }
    
    function removeShorts() {
        // DO NOTHING on search pages only
        if (isSearchPage()) {
            // NEW: Run search-specific removal instead of returning
            removeShortsFromSearch();
            return; // Still exit main blocking code
        }
        
        console.log('Removing Shorts...');
        
        // Method 1: Find ALL Shorts tabs - FIXED FOR CHANNELS
        const tabSelectors = [
            'tp-yt-paper-tab',
            'ytd-tab',
            '[role="tab"]',
            '.tab',
            'ytd-c4-tabbed-header-renderer *',
            'ytd-channel-tabbed-header-renderer *'
        ];
        
        tabSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Check multiple text sources
                const text = el.textContent || el.innerText || el.getAttribute('tab-title') || '';
                const ariaLabel = el.getAttribute('aria-label') || '';
                const title = el.getAttribute('title') || '';
                
                // Check if any text indicates Shorts
                const allText = (text + ' ' + ariaLabel + ' ' + title).toLowerCase();
                if (allText.includes('shorts') && !allText.includes('shortcut')) {
                    hideElement(el);
                }
            });
        });
        
        // Method 2: Find ALL links with /shorts/ in URL
        document.querySelectorAll('a[href*="/shorts/"]').forEach(link => {
            // Hide the link
            hideElement(link);
            
            // Find and hide the video container
            let parent = link;
            for (let i = 0; i < 6; i++) {
                parent = parent.parentElement;
                if (!parent) break;
                
                // Check if this looks like a video container
                const tagName = parent.tagName.toLowerCase();
                if (tagName.includes('renderer') || 
                    tagName.includes('video') || 
                    tagName.includes('grid') ||
                    tagName.includes('item') ||
                    parent.classList.contains('style-scope') ||
                    parent.id.includes('video') ||
                    parent.getAttribute('is-shorts')) {
                    
                    hideElement(parent);
                    
                    // Try to remove the entire shelf if found
                    const shelf = parent.closest('ytd-reel-shelf-renderer, ytd-rich-section-renderer, ytd-item-section-renderer');
                    if (shelf) hideElement(shelf);
                }
            }
        });
        
        // Method 3: Look for Shorts badges - FIXED to avoid player
        document.querySelectorAll('[overlay-style="SHORTS"], [aria-label="Shorts"], [title="Shorts"]').forEach(el => {
            // Skip player elements
            if (el.closest('ytd-player, .ytp-chrome-controls, .ytp-button')) {
                return;
            }
            
            const value = el.getAttribute('overlay-style') || el.getAttribute('aria-label') || el.getAttribute('title') || '';
            if (value.trim().toLowerCase() === 'shorts') {
                hideElement(el);
                const container = el.closest('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer');
                if (container) hideElement(container);
            }
        });
        
        // Method 4: Check for sidebar Shorts
        document.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer').forEach(el => {
            const text = el.textContent || el.innerText || '';
            const title = el.querySelector('a')?.getAttribute('title') || '';
            
            if (text.toLowerCase().includes('shorts') || title.toLowerCase().includes('shorts')) {
                hideElement(el);
            }
        });
        
        // Redirect from Shorts pages
        if (window.location.pathname.includes('/shorts/')) {
            const videoId = window.location.pathname.split('/shorts/')[1];
            if (videoId) {
                window.location.href = `https://www.youtube.com/watch?v=${videoId.split('?')[0]}`;
            }
        }
    }
    
    // Run continuously
    removeShorts();
    setInterval(removeShorts, 1000);
    
    // Watch for new content
    const observer = new MutationObserver(() => {
        setTimeout(removeShorts, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
})();