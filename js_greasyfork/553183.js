// ==UserScript==
// @name         YouTube Bulk Playlist Adder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bulk add videos to YouTube playlist from URL list
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/553183/YouTube%20Bulk%20Playlist%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/553183/YouTube%20Bulk%20Playlist%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let videoUrls = [];
    let currentIndex = 0;
    let isAdding = false;
    
    // Create UI
    function createUI() {
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #333; color: white; padding: 15px; border-radius: 8px; z-index: 10000; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 10px 0;">Bulk Playlist Adder</h3>
                <textarea id="bulkUrls" placeholder="Paste YouTube URLs here (one per line)" style="width: 100%; height: 150px; margin-bottom: 10px; background: #555; color: white; border: 1px solid #666;"></textarea>
                <input type="text" id="playlistName" placeholder="Target Playlist Name" style="width: 100%; margin-bottom: 10px; padding: 5px; background: #555; color: white; border: 1px solid #666;">
                <div style="display: flex; gap: 5px;">
                    <button id="startBulk" style="flex: 1; padding: 8px; background: #cc0000; color: white; border: none; border-radius: 4px; cursor: pointer;">Start Adding</button>
                    <button id="stopBulk" style="flex: 1; padding: 8px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Stop</button>
                    <button id="closeBulk" style="padding: 8px; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer;">X</button>
                </div>
                <div id="progress" style="margin-top: 10px; font-size: 12px;"></div>
            </div>
        `;
        document.body.appendChild(div);
        
        // Load saved data
        const savedUrls = GM_getValue('savedUrls', '');
        const savedPlaylist = GM_getValue('savedPlaylist', '');
        document.getElementById('bulkUrls').value = savedUrls;
        document.getElementById('playlistName').value = savedPlaylist;
        
        // Event listeners
        document.getElementById('startBulk').addEventListener('click', startBulkAdd);
        document.getElementById('stopBulk').addEventListener('click', stopBulkAdd);
        document.getElementById('closeBulk').addEventListener('click', () => div.remove());
        
        // Auto-save
        document.getElementById('bulkUrls').addEventListener('input', (e) => GM_setValue('savedUrls', e.target.value));
        document.getElementById('playlistName').addEventListener('input', (e) => GM_setValue('savedPlaylist', e.target.value));
    }
    
    function startBulkAdd() {
        const urlsText = document.getElementById('bulkUrls').value;
        const playlistName = document.getElementById('playlistName').value.trim();
        
        if (!urlsText) {
            alert('Please paste some YouTube URLs!');
            return;
        }
        
        if (!playlistName) {
            alert('Please enter the target playlist name!');
            return;
        }
        
        videoUrls = urlsText.split('\n').filter(url => url.trim()).map(url => url.trim());
        currentIndex = 0;
        isAdding = true;
        
        updateProgress(`Starting... 0/${videoUrls.length}`);
        processNextVideo(playlistName);
    }
    
    function stopBulkAdd() {
        isAdding = false;
        updateProgress(`Stopped at ${currentIndex}/${videoUrls.length}`);
    }
    
    async function processNextVideo(playlistName) {
        if (!isAdding || currentIndex >= videoUrls.length) {
            if (currentIndex >= videoUrls.length) {
                updateProgress(`Completed! ${videoUrls.length}/${videoUrls.length}`);
                GM_notification({
                    text: `Successfully added ${videoUrls.length} videos to "${playlistName}"`,
                    title: "Bulk Add Complete",
                    timeout: 5000
                });
            }
            return;
        }
        
        const url = videoUrls[currentIndex];
        updateProgress(`Processing ${currentIndex + 1}/${videoUrls.length}: ${url.substring(0, 50)}...`);
        
        try {
            // Navigate to video
            window.location.href = url;
            
            // Wait for page load
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Click save button
            const saveButton = document.querySelector('button[aria-label="Save"], yt-button-shape[aria-label="Save"]');
            if (saveButton) {
                saveButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Find and click playlist
                const playlistElement = findPlaylistElement(playlistName);
                if (playlistElement) {
                    playlistElement.click();
                    updateProgress(`✓ Added ${currentIndex + 1}/${videoUrls.length}`);
                } else {
                    updateProgress(`✗ Playlist "${playlistName}" not found for video ${currentIndex + 1}`);
                }
            } else {
                updateProgress(`✗ Save button not found for video ${currentIndex + 1}`);
            }
        } catch (error) {
            updateProgress(`✗ Error with video ${currentIndex + 1}: ${error.message}`);
        }
        
        currentIndex++;
        
        // Continue with next video after delay
        if (isAdding && currentIndex < videoUrls.length) {
            setTimeout(() => processNextVideo(playlistName), 2000); // 2-second delay between videos
        }
    }
    
    function findPlaylistElement(playlistName) {
        // Try multiple selectors for playlist items
        const selectors = [
            `span[dir="auto"]:contains("${playlistName}")`,
            `yt-formatted-string:contains("${playlistName}")`,
            `div[role="menuitem"]:contains("${playlistName}")`
        ];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll('*');
            for (const element of elements) {
                if (element.textContent.trim() === playlistName) {
                    return element.closest('button') || element.closest('div[role="button"]') || element;
                }
            }
        }
        return null;
    }
    
    function updateProgress(message) {
        const progressEl = document.getElementById('progress');
        if (progressEl) {
            progressEl.textContent = message;
        }
    }
    
    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();