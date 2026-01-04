// ==UserScript==
// @name         Steam Workshop Downloader (GGNetwork)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Download Steam Workshop items using GGNetwork API
// @author       Cerulean
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @grant        GM_xmlhttpRequest
// @connect      api.ggntw.com
// @connect      cdn.ggntw.com
// @connect      ggntw.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553672/Steam%20Workshop%20Downloader%20%28GGNetwork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553672/Steam%20Workshop%20Downloader%20%28GGNetwork%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract Workshop ID from URL
    function getWorkshopId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Get current page URL
    function getCurrentUrl() {
        return window.location.href;
    }

    // Create download button
    function createDownloadButton() {
        const workshopId = getWorkshopId();
        if (!workshopId) return;

        // Create button container
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #1b2838; border-radius: 4px;';

        // Create button row container
        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '📥 Download via GGNetwork';
        downloadBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        `;

        downloadBtn.onmouseover = () => {
            downloadBtn.style.transform = 'translateY(-2px)';
            downloadBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        };

        downloadBtn.onmouseout = () => {
            downloadBtn.style.transform = 'translateY(0)';
            downloadBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        };

        // Create copy link button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copy Download Link';
        copyBtn.style.cssText = `
            background: #2a475e;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        copyBtn.onmouseover = () => {
            copyBtn.style.background = '#3a5768';
        };

        copyBtn.onmouseout = () => {
            copyBtn.style.background = '#2a475e';
        };

        // Status message element
        const statusMsg = document.createElement('div');
        statusMsg.style.cssText = 'margin-top: 10px; font-size: 13px; color: #c7d5e0;';

        // Store download URL globally for copy button
        let currentDownloadUrl = null;

        // Download button click handler
        downloadBtn.onclick = () => {
            downloadWorkshopItem(workshopId, statusMsg, downloadBtn, copyBtn, (url) => {
                currentDownloadUrl = url;
            });
        };

        // Copy button click handler - gets link without downloading
        copyBtn.onclick = () => {
            getDownloadLink(workshopId, statusMsg, copyBtn, (url) => {
                currentDownloadUrl = url;
                navigator.clipboard.writeText(url).then(() => {
                    statusMsg.textContent = '✅ Download link copied! Paste in IDM quickly - it will expire soon!';
                    statusMsg.style.color = '#90ee90';
                }).catch(() => {
                    statusMsg.textContent = '❌ Failed to copy. Link: ' + url;
                    statusMsg.style.color = '#ff6b6b';
                });
            });
        };

        buttonRow.appendChild(downloadBtn);
        buttonRow.appendChild(copyBtn);
        btnContainer.appendChild(buttonRow);
        btnContainer.appendChild(statusMsg);

        // Find a good place to insert the button
        const detailsBlock = document.querySelector('.workshopItemDetailsHeader') ||
                           document.querySelector('.workshopItemDetails') ||
                           document.querySelector('.rightDetailsBlock');

        if (detailsBlock) {
            detailsBlock.parentNode.insertBefore(btnContainer, detailsBlock.nextSibling);
        }
    }

    // Get download link without starting download
    function getDownloadLink(workshopId, statusElement, button, onUrlReceived) {
        statusElement.textContent = '⏳ Getting download link...';
        statusElement.style.color = '#ffa500';
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';

        const workshopUrl = getCurrentUrl();
        const apiUrl = 'https://api.ggntw.com/steam.request';

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://ggntw.com',
                'Referer': 'https://ggntw.com/'
            },
            data: JSON.stringify({
                url: workshopUrl
            }),
            timeout: 60000,
            onload: function(response) {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        let downloadUrl = data.download_url || data.url || data.link || data.file || data.download;

                        if (!downloadUrl && data.data) {
                            downloadUrl = data.data.download_url || data.data.url || data.data.link || data.data.file;
                        }

                        if (downloadUrl) {
                            onUrlReceived(downloadUrl);
                        } else {
                            statusElement.textContent = '❌ No download URL found';
                            statusElement.style.color = '#ff6b6b';
                        }
                    } catch (e) {
                        statusElement.textContent = '❌ Failed to get link';
                        statusElement.style.color = '#ff6b6b';
                    }
                } else {
                    statusElement.textContent = `❌ API error: ${response.status}`;
                    statusElement.style.color = '#ff6b6b';
                }
            },
            onerror: function() {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                statusElement.textContent = '❌ Network error';
                statusElement.style.color = '#ff6b6b';
            }
        });
    }

    // Download workshop item using GGNetwork API
    function downloadWorkshopItem(workshopId, statusElement, button, copyButton, onUrlReceived) {
        statusElement.textContent = '⏳ Requesting download from GGNetwork...';
        statusElement.style.color = '#ffa500';
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';

        const workshopUrl = getCurrentUrl();
        const apiUrl = 'https://api.ggntw.com/steam.request';

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://ggntw.com',
                'Referer': 'https://ggntw.com/'
            },
            data: JSON.stringify({
                url: workshopUrl
            }),
            timeout: 60000,
            onload: function(response) {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';

                console.log('API Response:', response.responseText);

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('Parsed data:', data);

                        // Extract download URL from various possible response formats
                        let downloadUrl = data.download_url || data.url || data.link || data.file || data.download;

                        // Check if it's nested in a data object
                        if (!downloadUrl && data.data) {
                            downloadUrl = data.data.download_url || data.data.url || data.data.link || data.data.file;
                        }

                        if (downloadUrl) {
                            // Store URL for copy button
                            onUrlReceived(downloadUrl);

                            statusElement.textContent = '✅ Starting download...';
                            statusElement.style.color = '#90ee90';

                            // Create a hidden anchor element and trigger download
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = '';
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            setTimeout(() => {
                                statusElement.textContent = '✅ Download started! Use "Copy Link" button for IDM.';
                            }, 1000);
                        } else {
                            statusElement.textContent = '❌ No download URL in response. Check console for details.';
                            statusElement.style.color = '#ff6b6b';
                        }
                    } catch (e) {
                        statusElement.textContent = '❌ Failed to parse API response. Check console.';
                        statusElement.style.color = '#ff6b6b';
                        console.error('Parse error:', e);
                    }
                } else {
                    statusElement.textContent = `❌ API error: ${response.status}. Check console.`;
                    statusElement.style.color = '#ff6b6b';
                }
            },
            onerror: function(error) {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                statusElement.textContent = '❌ Network error. Check console for details.';
                statusElement.style.color = '#ff6b6b';
                console.error('Network error:', error);
            },
            ontimeout: function() {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                statusElement.textContent = '❌ Request timed out. Please try again.';
                statusElement.style.color = '#ff6b6b';
            }
        });
    }

    // Wait for page to load and add button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDownloadButton);
    } else {
        createDownloadButton();
    }
})();