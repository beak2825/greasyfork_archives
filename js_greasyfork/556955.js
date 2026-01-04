// ==UserScript==
// @name         Pixieset Bulk Image Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically download all images from Pixieset gallery with auto-scroll
// @author       sharmanhall
// @match        https://*.pixieset.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/556955/Pixieset%20Bulk%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556955/Pixieset%20Bulk%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DELAY_BETWEEN_DOWNLOADS = 2000; // 2 seconds between each download
    const SCROLL_DELAY = 1000; // 1 second between scrolls
    let currentIndex = 0;
    let downloadButtons = [];
    let isRunning = false;
    let isScrolling = false;

    // Create control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'pixieset-download-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 280px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">Pixieset Downloader</h3>
            <div style="margin-bottom: 10px;">
                <strong>Total Images:</strong> <span id="total-images">0</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Progress:</strong> <span id="current-image">0</span> / <span id="total-images-2">0</span>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="background: #e0e0e0; border-radius: 4px; height: 20px; overflow: hidden;">
                    <div id="progress-bar" style="background: #4CAF50; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
            <button id="auto-scroll-btn" style="
                width: 100%;
                padding: 10px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 5px;
            ">Auto-Scroll to Load All</button>
            <button id="refresh-btn" style="
                width: 100%;
                padding: 10px;
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 5px;
            ">Refresh Image List</button>
            <button id="start-download-btn" style="
                width: 100%;
                padding: 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 5px;
            ">Start Download</button>
            <button id="stop-download-btn" style="
                width: 100%;
                padding: 10px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                display: none;
            ">Stop</button>
            <div id="status-message" style="margin-top: 10px; font-size: 12px; color: #666; line-height: 1.4;"></div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // Refresh/scan for download buttons
    function refreshImageList() {
        const previousCount = downloadButtons.length;
        downloadButtons = Array.from(document.querySelectorAll('.image-download-btn'));
        
        document.getElementById('total-images').textContent = downloadButtons.length;
        document.getElementById('total-images-2').textContent = downloadButtons.length;
        
        const newImages = downloadButtons.length - previousCount;
        if (newImages > 0) {
            document.getElementById('status-message').textContent = 
                `Found ${newImages} new images! Total: ${downloadButtons.length}`;
        } else if (previousCount === 0) {
            document.getElementById('status-message').textContent = 
                `Found ${downloadButtons.length} images`;
        } else {
            document.getElementById('status-message').textContent = 
                `No new images found. Total: ${downloadButtons.length}`;
        }
        
        return downloadButtons.length;
    }

    // Auto-scroll to load all images
    function autoScrollToLoadAll() {
        if (isScrolling) {
            document.getElementById('status-message').textContent = 'Already scrolling...';
            return;
        }

        isScrolling = true;
        document.getElementById('auto-scroll-btn').disabled = true;
        document.getElementById('auto-scroll-btn').style.opacity = '0.5';
        document.getElementById('status-message').textContent = 'Auto-scrolling to load images...';

        let lastHeight = document.body.scrollHeight;
        let scrollAttempts = 0;
        const maxScrollAttempts = 100; // Prevent infinite loop

        function scrollStep() {
            // Scroll to bottom
            window.scrollTo(0, document.body.scrollHeight);
            
            setTimeout(() => {
                const newHeight = document.body.scrollHeight;
                const currentImages = document.querySelectorAll('.image-download-btn').length;
                
                document.getElementById('status-message').textContent = 
                    `Loading images... Found: ${currentImages}`;
                
                scrollAttempts++;
                
                // Check if we've reached the bottom (no new content loaded)
                if (newHeight === lastHeight || scrollAttempts >= maxScrollAttempts) {
                    // Scroll back to top
                    window.scrollTo(0, 0);
                    
                    // Refresh the image list
                    setTimeout(() => {
                        refreshImageList();
                        isScrolling = false;
                        document.getElementById('auto-scroll-btn').disabled = false;
                        document.getElementById('auto-scroll-btn').style.opacity = '1';
                        document.getElementById('status-message').textContent = 
                            `Loading complete! Found ${currentImages} images. Ready to download.`;
                    }, 500);
                } else {
                    lastHeight = newHeight;
                    scrollStep();
                }
            }, SCROLL_DELAY);
        }

        // Start scrolling
        scrollStep();
    }

    // Update progress display
    function updateProgress() {
        document.getElementById('current-image').textContent = currentIndex;
        document.getElementById('progress-bar').style.width = 
            ((currentIndex / downloadButtons.length) * 100) + '%';
    }

    // Download images sequentially
    function downloadImages() {
        if (currentIndex >= downloadButtons.length || !isRunning) {
            document.getElementById('status-message').textContent = 
                currentIndex >= downloadButtons.length ? 'All downloads complete!' : 'Download stopped';
            document.getElementById('start-download-btn').style.display = 'block';
            document.getElementById('stop-download-btn').style.display = 'none';
            document.getElementById('auto-scroll-btn').disabled = false;
            document.getElementById('refresh-btn').disabled = false;
            document.getElementById('auto-scroll-btn').style.opacity = '1';
            document.getElementById('refresh-btn').style.opacity = '1';
            isRunning = false;
            return;
        }

        const button = downloadButtons[currentIndex];
        document.getElementById('status-message').textContent = 
            `Downloading image ${currentIndex + 1} of ${downloadButtons.length}...`;
        
        // Scroll the button into view
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Click the download button
        button.click();
        
        currentIndex++;
        updateProgress();

        // Schedule next download
        setTimeout(downloadImages, DELAY_BETWEEN_DOWNLOADS);
    }

    // Initialize the script
    function init() {
        // Wait for page to load
        setTimeout(() => {
            // Create control panel
            const panel = createControlPanel();
            
            // Initial scan
            refreshImageList();

            // Auto-scroll button handler
            document.getElementById('auto-scroll-btn').addEventListener('click', () => {
                autoScrollToLoadAll();
            });

            // Refresh button handler
            document.getElementById('refresh-btn').addEventListener('click', () => {
                refreshImageList();
            });

            // Start button handler
            document.getElementById('start-download-btn').addEventListener('click', () => {
                if (downloadButtons.length === 0) {
                    alert('No images found! Try "Auto-Scroll to Load All" first.');
                    return;
                }
                
                isRunning = true;
                currentIndex = 0;
                updateProgress();
                document.getElementById('start-download-btn').style.display = 'none';
                document.getElementById('stop-download-btn').style.display = 'block';
                document.getElementById('auto-scroll-btn').disabled = true;
                document.getElementById('refresh-btn').disabled = true;
                document.getElementById('auto-scroll-btn').style.opacity = '0.5';
                document.getElementById('refresh-btn').style.opacity = '0.5';
                document.getElementById('status-message').textContent = 'Starting download...';
                downloadImages();
            });

            // Stop button handler
            document.getElementById('stop-download-btn').addEventListener('click', () => {
                isRunning = false;
                document.getElementById('start-download-btn').style.display = 'block';
                document.getElementById('stop-download-btn').style.display = 'none';
                document.getElementById('auto-scroll-btn').disabled = false;
                document.getElementById('refresh-btn').disabled = false;
                document.getElementById('auto-scroll-btn').style.opacity = '1';
                document.getElementById('refresh-btn').style.opacity = '1';
                document.getElementById('status-message').textContent = 'Download stopped';
            });

        }, 2000); // Wait 2 seconds for page to fully load
    }

    // Run when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();