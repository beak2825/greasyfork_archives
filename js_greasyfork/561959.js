// ==UserScript==
// @name         Classic Youtube Layout (Fixed somewhat)
// @version      1.02
// @description  Revert to old Youtube UI Layout. Comments below the video and recommendations in the sidebar. Fixed resizing issues.
// @author       Claude 
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @namespace    2psy
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561959/Classic%20Youtube%20Layout%20%28Fixed%20somewhat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561959/Classic%20Youtube%20Layout%20%28Fixed%20somewhat%29.meta.js
// ==/UserScript==

GM_addStyle(`
ytd-watch-flexy ytd-rich-grid-row #dismissible.ytd-rich-grid-media {
  flex-direction: row;
  max-width: 100%;
  width: 100%;
  gap: 1rem;
}
ytd-watch-flexy ytd-rich-grid-row #thumbnail {
  width: 100%;
  flex: 1 0 50%;
}
ytd-watch-flexy ytd-rich-grid-row #details.ytd-rich-grid-media {
  flex: 1 0 50%;
  -moz-box-flex: unset;
  width: auto;
  max-width: 100%;
  flex-direction: column;
}
ytd-watch-flexy #avatar-link.ytd-rich-grid-media { display: none; }
ytd-watch-flexy #video-title.ytd-rich-grid-media {
  font-size: 1.4rem;
  line-height: 1.2;
}
ytd-watch-flexy h3.ytd-rich-grid-media { margin-top: 0; }
ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block,
ytd-watch-flexy ytd-video-meta-block[rich-meta] #byline-container.ytd-video-meta-block {
  font-size: 1.2rem;
  line-height: 1.2;
}
ytd-watch-flexy ytd-rich-item-renderer { margin-bottom: 7px; }
ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer { padding-top: 0; }
ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row { margin: 0; }
`);

(function () {
  'use strict';
    setInterval(function() {
        // Revert the new YouTube 2024 redesign experiment flags
        if (typeof ytcfg === "object") {
            ytcfg.set('EXPERIMENT_FLAGS', {
                ...ytcfg.get('EXPERIMENT_FLAGS'),
                web_player_enable_featured_product_banner_exclusives_on_desktop:false,
                kevlar_watch_comments_ep_disable_theater:true,
                kevlar_watch_comments_panel_button:true,
                fill_view_models_on_web_vod:true,
                kevlar_watch_flexy_metadata_height:136,
                kevlar_watch_grid:false,
                kevlar_watch_max_player_width:1280,
                live_chat_over_engagement_panels:false,
                live_chat_scaled_height:false,
                live_chat_smaller_min_height:false,
                main_app_controller_extraction_batch_18:false,
                main_app_controller_extraction_batch_19:false,
                no_iframe_for_web_stickiness:false,
                optimal_reading_width_comments_ep:false,
                remove_masthead_channel_banner_on_refresh:false,
                small_avatars_for_comments:false,
                small_avatars_for_comments_ep:false,
                web_watch_compact_comments:false,
                web_watch_compact_comments_header:false,
                web_watch_log_theater_mode:false,
                web_watch_theater_chat:false,
                web_watch_theater_fixed_chat:false,
                wn_grid_max_item_width:0,
                wn_grid_min_item_width:0,
            });
        }
    }, 100);
})();

// Debounce function to prevent excessive updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to get proper player width
function getPlayerWidth() {
    const video = document.querySelector('video.html5-main-video');
    const player = document.querySelector('#movie_player');
    const controls = document.querySelector(".ytp-chrome-bottom");
    const secondary = document.querySelector("#secondary.ytd-watch-flexy");
    
    // Calculate maximum allowed width based on viewport and sidebar
    const viewportWidth = window.innerWidth;
    const sidebarWidth = secondary ? secondary.offsetWidth : 402; // Default sidebar width
    const margins = 48; // Account for margins and padding
    const maxAllowedWidth = viewportWidth - sidebarWidth - margins;
    
    let calculatedWidth;
    
    // Try to get width from video element first
    if (video && video.videoWidth > 0) {
        calculatedWidth = video.clientWidth;
    }
    // Try to get from player container
    else if (player && player.clientWidth > 200) {
        calculatedWidth = player.clientWidth;
    }
    // Fall back to controls with validation
    else if (controls) {
        const baseWidth = parseInt(controls.style.width) || 0;
        const padding = 2 * (parseInt(controls.style.left) || 0);
        const controlsWidth = baseWidth + padding;
        
        // Only use controls width if it's reasonable (not the tiny initial size)
        if (controlsWidth > 500) {
            calculatedWidth = controlsWidth;
        }
    }
    
    // If we still don't have a width, calculate based on viewport
    if (!calculatedWidth || calculatedWidth < 500) {
        calculatedWidth = Math.max(640, maxAllowedWidth);
    }
    
    // Ensure width doesn't exceed available space
    return Math.min(calculatedWidth, maxAllowedWidth, 1280);
}

// Function to update player size
function updatePlayerSize() {
    const isFull = document.fullscreenElement !== null;
    const isCin = document.querySelector('#player-container-inner')?.children.length === 0;
    if (isFull || isCin) return;
    
    const column = document.querySelector("#primary.ytd-watch-flexy");
    if (!column) return;
    
    const basis = getPlayerWidth();
    
    // Don't update if we got an invalid size
    if (basis < 500) return;
    
    column.setAttribute("style",
        `--ytd-watch-flexy-max-player-width: min(calc((100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-watch-flexy-space-below-player))*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))), ${basis}px);
        flex: 1 0 calc(48px + ${basis}px);`);
    
    const container = column.querySelector("#player-container-outer");
    if (container) {
        container.setAttribute("style", `min-width: ${basis}px;`);
    }
}

// Debounced version of updatePlayerSize
const debouncedUpdate = debounce(updatePlayerSize, 150);

// Track last window width to detect significant changes
let lastWindowWidth = window.innerWidth;

// Wait for player to be ready before first update
function waitForPlayer(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkPlayer = setInterval(() => {
        attempts++;
        const video = document.querySelector('video.html5-main-video');
        const player = document.querySelector('#movie_player');
        
        if ((video && video.readyState >= 2) || (player && player.clientWidth > 500) || attempts >= maxAttempts) {
            clearInterval(checkPlayer);
            callback();
        }
    }, 200);
}

// Set up event listeners
window.addEventListener('load', function () {
    // Wait for player to initialize before first update
    waitForPlayer(() => {
        updatePlayerSize();
        
        // Update again after a short delay to catch late initializations
        setTimeout(updatePlayerSize, 500);
        setTimeout(updatePlayerSize, 1000);
    });
    
    // Update on window resize with improved detection
    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        const widthDiff = Math.abs(currentWidth - lastWindowWidth);
        
        // If significant resize (more than 50px), update immediately
        if (widthDiff > 50) {
            updatePlayerSize();
            lastWindowWidth = currentWidth;
        }
        
        // Always call debounced update as well
        debouncedUpdate();
    });
    
    // Force update when window resize ends
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            lastWindowWidth = window.innerWidth;
            updatePlayerSize();
        }, 300);
    });
    
    // Update on fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        setTimeout(() => {
            updatePlayerSize();
            lastWindowWidth = window.innerWidth;
        }, 100);
    });
    document.addEventListener('webkitfullscreenchange', () => {
        setTimeout(() => {
            updatePlayerSize();
            lastWindowWidth = window.innerWidth;
        }, 100);
    });
    
    // Watch for video element changes
    const videoObserver = new MutationObserver(() => {
        const video = document.querySelector('video.html5-main-video');
        if (video && video.readyState >= 2) {
            debouncedUpdate();
        }
    });
    
    // Watch for navigation changes (YouTube is a SPA)
    let currentUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            if (location.pathname === '/watch') {
                waitForPlayer(() => {
                    updatePlayerSize();
                    lastWindowWidth = window.innerWidth;
                });
            }
        }
    });
    
    const target = document.querySelector('ytd-app');
    if (target) {
        videoObserver.observe(target, { childList: true, subtree: true });
        urlObserver.observe(target, { childList: true, subtree: true });
    }
});

// Handle chip visibility on fullscreen
function handleChipsVisibility() {
    const chipsWrapper = document.getElementById("chips-wrapper");
    if (chipsWrapper) {
        chipsWrapper.style.visibility = document.fullscreenElement ? "hidden" : "visible";
    }
}

document.addEventListener('fullscreenchange', handleChipsVisibility);
document.addEventListener('webkitfullscreenchange', handleChipsVisibility);