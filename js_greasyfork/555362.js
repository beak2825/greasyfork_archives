// ==UserScript==
// @name         NotebookLM Auto Save
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Auto-save NotebookLM chat content, triggers save on mouse movement (at most once every 10 seconds)
// @author       You
// @match        https://notebooklm.google.com/notebook/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/555362/NotebookLM%20Auto%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/555362/NotebookLM%20Auto%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generate time key
    const timeKey = new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString();
    // Get current URL as key
    const currentUrl = window.location.href;

    // Throttle function: execute at most once every 10 seconds
    let lastSaveTime = 0;
    const SAVE_INTERVAL = 10000; // 10 seconds
    
    // Flag to indicate if event listener has been added
    let listenerAdded = false;
    
    // Flag to indicate if download button has been added
    let downloadButtonAdded = false;

    // Save function
    function saveChatContent() {
        const currentTime = Date.now();
        
        // Check if within throttle interval
        if (currentTime - lastSaveTime < SAVE_INTERVAL) {
            console.log('Save operation throttled, skipping this save');
            return;
        }

        // Get chat container element
        const chatContainer = document.querySelector('div.chat-thread-container');
        
        if (!chatContainer) {
            console.log('chat-thread-container element not found');
            return;
        }

        
        // Get HTML content inside the container
        const htmlContent = chatContainer.innerHTML;
        
        // Save data
        try {
            // Read previously saved data
            let savedData = GM_getValue(currentUrl, null); // currentUrl undefined will not throw error
            
            // If there is previously saved data, parse it as an object; otherwise create a new object
            let dataObject = {};
            if (savedData) {
                try {
                    // If saved data is a string, try to parse it as an object
                    if (typeof savedData === 'string') {
                        dataObject = JSON.parse(savedData);
                    } else {
                        // If it's already an object, use it directly
                        dataObject = savedData;
                    }
                } catch (e) {
                    // If parsing fails, create a new object
                    console.log('Failed to parse old data, creating new object');
                    dataObject = {};
                }
            }
            
            // Add new time key and HTML content
            dataObject[timeKey] = htmlContent;
            
            // Save object
            GM_setValue(currentUrl, dataObject);
            lastSaveTime = currentTime;
            console.log('Chat content saved:', currentUrl);
            console.log('Time key:', timeKey);
            console.log('Saved data object:', dataObject);
        } catch (error) {
            console.error('Save failed:', error);
        }
    }

    // Mouse move event handler (with throttling)
    let mouseMoveTimer = null;
    function handleMouseMove() {
        console.log('handleMouseMove')
        // Clear previous timer
        if (mouseMoveTimer) {
            clearTimeout(mouseMoveTimer);
        }
        
        // Set new timer, delay 100ms before executing save (debounce)
        mouseMoveTimer = setTimeout(() => {
            saveChatContent();
        }, 100);
    }

    // Add mouse move listener (only add once)
    function addMouseMoveListener() {
        if (!listenerAdded) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            listenerAdded = true;
            console.log('Mouse move listener added');

            // Select div.chat-panel-content, insert a div at the beginning with id chat-thread-container-history, containing previously saved data.
            const chatPanelContent = document.querySelector('div.chat-panel-content');
            const chatThreadContainerHistory = document.createElement('div');
            chatThreadContainerHistory.id = 'chat-thread-container-history';
            chatThreadContainerHistory.style.backgroundColor = 'aliceblue';
            chatPanelContent.insertBefore(chatThreadContainerHistory, chatPanelContent.firstChild);
            chatThreadContainerHistory.innerHTML = '';
            
            const savedData = GM_getValue(currentUrl, null);
            console.log('savedData:', savedData);
            
            if (savedData) {
                // If saved data is a string, try to parse it as an object
                let dataObject = savedData;
                if (typeof savedData === 'string') {
                    try {
                        dataObject = JSON.parse(savedData);
                    } catch (e) {
                        console.error('Failed to parse saved data:', e);
                        return;
                    }
                }
                
                // Iterate through each time key in the object
                for (const timeKey in dataObject) {
                    if (dataObject.hasOwnProperty(timeKey)) {
                        chatThreadContainerHistory.innerHTML += dataObject[timeKey];
                        console.log('Inserted time key:', timeKey);
                    }
                }
            } else {
                console.log('No saved data found');
            }
        }
    }

    // Download all saved data
    function downloadAllData() {
        try {
            // Get all keys
            const keys = GM_listValues();
            const allData = {};
            
            // Get value for each key
            keys.forEach(key => {
                const value = GM_getValue(key);
                allData[key] = value;
            });
            
            // Convert data to JSON string (formatted with 2-space indent)
            const jsonData = JSON.stringify(allData, null, 2);
            
            // Create Blob object
            const blob = new Blob([jsonData], {
                type: 'application/json;charset=utf-8'
            });
            
            // Create download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Generate filename (include current time)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            const currentDate = `${year}${month}${day}_${hour}${minute}${second}`;
            link.download = `notebooklm_saved_data_${currentDate}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Release URL object
            URL.revokeObjectURL(link.href);
            
            console.log('Data download completed, file:', link.download);
            console.log('Downloaded', keys.length, 'items');
        } catch (error) {
            console.error('Error during download:', error);
            alert('Download failed: ' + error.message);
        }
    }
    
    // Create download button
    function createDownloadButton() {
        if (downloadButtonAdded) {
            return;
        }
        
        // Create button element
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.id = 'notebooklm-download-btn';
        
        // Set button styles
        downloadBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 20px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;
        
        // Mouse hover effect
        downloadBtn.addEventListener('mouseenter', () => {
            downloadBtn.style.backgroundColor = '#357ae8';
        });
        downloadBtn.addEventListener('mouseleave', () => {
            downloadBtn.style.backgroundColor = '#4285f4';
        });
        
        // Click event
        downloadBtn.addEventListener('click', () => {
            downloadAllData();
        });
        
        // Add button to page
        document.body.appendChild(downloadBtn);
        downloadButtonAdded = true;
        console.log('Download button added');
    }

    // Wait for page load to complete before adding mouse move listener
    function init() {
        // Check if element exists
        const chatContainer = document.querySelector('div.chat-thread-container');
        
        if (chatContainer) {
            // Element exists, add mouse move listener (listen to entire document)
            addMouseMoveListener();
            
            // Save immediately on page load
            saveChatContent();
        } else {
            // Element doesn't exist, use MutationObserver to wait for element to appear
            const observer = new MutationObserver((mutations, obs) => {
                const container = document.querySelector('div.chat-thread-container');
                if (container) {
                    addMouseMoveListener();
                    
                    // Save immediately on page load
                    saveChatContent();
                    
                    // Stop observing
                    obs.disconnect();
                }
            });
            
            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('Waiting for chat-thread-container element to appear...');
        }
    }

    // Initialize after page load completes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Create download button immediately (does not depend on chat container)
            createDownloadButton();
            init();
        });
    } else {
        // If DOM is already loaded, initialize directly
        // Create download button immediately (does not depend on chat container)
        createDownloadButton();
        init();
    }
    console.log('Script loaded');

})();
