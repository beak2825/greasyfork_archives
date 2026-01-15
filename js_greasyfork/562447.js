// ==UserScript==
// @name         Recruit Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display player attack wins next to player names
// @author       You
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562447/Recruit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562447/Recruit%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        apiKey: '', // Set your API key here or use localStorage
        cacheMinutes: 30, // Cache duration in minutes
        displayColor: '#949494', // Default color for display
        messageTemplate: `Hey {playerName}! I found you via a search for faction-less players. Are you looking to join a semi-casual ranked war faction at this time? If so, I can share more information about mine just let me know, thanks!` // Message template
    };

    // Storage functions
    function setCache(key, data) {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(`player_info_${key}`, JSON.stringify(cacheData));
    }

    function getCache(key) {
        const cached = localStorage.getItem(`player_info_${key}`);
        if (!cached) return null;
        
        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;
        const maxAge = CONFIG.cacheMinutes * 60 * 1000;
        
        if (age > maxAge) {
            localStorage.removeItem(`player_info_${key}`);
            return null;
        }
        
        return cacheData.data;
    }

    // Batch cache check to avoid duplicate API calls
    function checkCacheForMultiplePlayers(playerIds) {
        const cachedResults = {};
        const uncachedPlayers = [];
        
        playerIds.forEach(playerId => {
            const cached = getCache(playerId);
            if (cached) {
                cachedResults[playerId] = cached;
            } else {
                uncachedPlayers.push(playerId);
            }
        });
        
        return { cachedResults, uncachedPlayers };
    }

    // API functions
    function fetchPlayerInfo(playerId, callback) {
        // Check cache first
        const cached = getCache(playerId);
        if (cached) {
            callback(playerId, cached);
            return;
        }

        const apiKey = CONFIG.apiKey || localStorage.getItem('torn_api_key');
        if (!apiKey) {
            callback(playerId, { error: 'No API key' });
            return;
        }

        const url = `https://api.torn.com/v2/user/${playerId}/personalstats?stat=attackswon&key=${apiKey}`;
        
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    const result = JSON.parse(response.responseText);
                    
                    if (result.error) {
                        // Silently fail for temporary API issues (rate limiting, etc.)
                        if (result.error.error.includes('rate') || result.error.error.includes('limit') || result.error.error.includes('too many')) {
                            return; // Don't callback, just skip
                        }
                        callback(playerId, { error: result.error.error });
                        return;
                    }
                    
                    // Cache the result
                    setCache(playerId, result);
                    callback(playerId, result);
                    
                } catch (err) {
                    // Silently fail for parse errors (likely incomplete responses)
                    return;
                }
            },
            onerror: (err) => {
                // Silently fail for network errors
                return;
            }
        });
    }

    // API Key Management
    function ensureApiKey() {
        const apiKey = CONFIG.apiKey || localStorage.getItem('torn_api_key');
        
        if (apiKey) {
            return true;
        }
        
        // Show API key input dialog
        showApiKeyDialog();
        return false;
    }

    function showApiKeyDialog() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        // Create dialog box
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin: 0 0 15px 0; color: #333;">Player Info Display - API Key Required</h2>
            <p style="margin: 0 0 20px 0; color: #666; line-height: 1.5;">
                This script needs a Torn API key to fetch player attack statistics.<br><br>
                <strong>How to get your API key:</strong><br>
                1. Go to <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" style="color: #47A6FF;">Torn Preferences → API</a><br>
                2. Create a new API key<br>
                3. Copy the key and paste it below
            </p>
            <input type="password" id="api-key-input" placeholder="Enter your Torn API key" style="
                width: 100%;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                margin-bottom: 15px;
                box-sizing: border-box;
            ">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="save-api-key" style="
                    background: #47A6FF;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">Save API Key</button>
                <button id="cancel-api-key" style="
                    background: #999;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancel</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Handle save button
        document.getElementById('save-api-key').addEventListener('click', () => {
            const apiKeyInput = document.getElementById('api-key-input');
            const apiKey = apiKeyInput.value.trim();
            
            if (apiKey) {
                localStorage.setItem('torn_api_key', apiKey);
                document.body.removeChild(overlay);
                
                // Restart the script with the new API key
                init();
            } else {
                apiKeyInput.style.borderColor = 'red';
                apiKeyInput.placeholder = 'Please enter an API key';
            }
        });
        
        // Handle cancel button
        document.getElementById('cancel-api-key').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        // Handle Enter key in input
        document.getElementById('api-key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('save-api-key').click();
            }
        });
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('api-key-input').focus();
        }, 100);
    }

    // Display functions
    function formatDisplayText(data) {
        if (data.error) return 'Error';
        
        // Extract attacks won from personalstats array
        let attacksWon = 0;
        
        if (data.personalstats && Array.isArray(data.personalstats)) {
            const attackStat = data.personalstats.find(stat => stat.name === 'attackswon');
            if (attackStat) {
                attacksWon = attackStat.value;
            }
        }
        
        return formatNumber(attacksWon);
    }

    function formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'm';
        return (num / 1000000000).toFixed(1) + 'b';
    }

    function getColorForValue(attacksWon) {
        // Color based on attacks won
        if (attacksWon >= 25000) return '#FF0000'; // Red
        if (attacksWon >= 10000) return '#FFB30F'; // Orange
        if (attacksWon >= 5000) return '#47A6FF'; // Blue
        if (attacksWon >= 1000) return '#73DF5D'; // Green
        return '#949494'; // Gray
    }

    function injectPlayerInfo(targetId, playerData) {
        const elements = dictDivPerPlayer[targetId] || [];
        
        elements.forEach(element => {
            // Skip if already injected
            if (element.querySelector('.player-info-injection')) return;
            
            const displayText = formatDisplayText(playerData);
            let color = CONFIG.displayColor;
            let attacksWon = 0;
            
            // Set color based on attacks won if not an error
            if (!playerData.error) {
                // Extract attacks won from personalstats array
                if (playerData.personalstats && Array.isArray(playerData.personalstats)) {
                    const attackStat = playerData.personalstats.find(stat => stat.name === 'attackswon');
                    if (attackStat) {
                        attacksWon = attackStat.value;
                    }
                }
                
                color = getColorForValue(attacksWon);
            }
            
            // Create injection using exact BSP method but positioned to the right
            const injectionDiv = document.createElement('div');
            injectionDiv.className = 'player-info-injection TDup_ColoredStatsInjectionDiv';
            injectionDiv.style.cssText = `
                position: absolute;
                z-index: 100;
                right: 0;
                top: 0;
            `;
            
            // Create the clickable link to messages compose with preset message
            // Extract clean player name - handle BSP widget interference
            let playerName = `Player ${targetId}`;
            
            // Check for BSP widget and extract its value
            let bspValue = '';
            const bspWidget = element.querySelector('.iconStats[title*="BSP"]');
            if (bspWidget) {
                bspValue = bspWidget.textContent.trim();
            }
            
            // Method 1: Try alt attributes (mobile honor badges)
            const allImages = element.querySelectorAll('img[alt]');
            for (const img of allImages) {
                if (img.alt) {
                    const altText = img.alt.trim();
                    // Extract name from alt like "Kale-En [2174130]"
                    const nameMatch = altText.match(/^(.+?)\s*\[\d+\]$/);
                    if (nameMatch && nameMatch[1] && nameMatch[1].length > 2) {
                        playerName = nameMatch[1].trim();
                        break;
                    }
                }
            }
            
            // Method 2: Try specific selectors if alt didn't work
            if (playerName === `Player ${targetId}`) {
                const nameSelectors = [
                    '.user.name',
                    'a[href*="/profiles.php?"]',
                    '[data-player]',
                    '.player-name',
                    '.name',
                    'span[class*="name"]',
                    'div[class*="name"]',
                    '[class*="user"]'
                ];
                
                for (const selector of nameSelectors) {
                    const nameElement = element.querySelector(selector);
                    if (nameElement && nameElement !== element) {
                        // Try alt first
                        const imgElement = nameElement.querySelector('img[alt]');
                        if (imgElement && imgElement.alt) {
                            const altText = imgElement.alt.trim();
                            const nameMatch = altText.match(/^(.+?)\s*\[\d+\]$/);
                            if (nameMatch && nameMatch[1]) {
                                playerName = nameMatch[1].trim();
                                break;
                            }
                        }
                        
                        // Fallback to text content
                        let nameText = nameElement.textContent?.trim() || '';
                        
                        // Remove BSP value if it's at the start
                        if (bspValue && nameText.startsWith(bspValue)) {
                            nameText = nameText.substring(bspValue.length).trim();
                        }
                        
                        if (nameText.length > 2 && !/^\d+(\.\d+)?[kmb]?\s*$/.test(nameText)) {
                            if (!(/^\d/ && nameText.length < 8)) {
                                playerName = nameText
                                    .split('\n')[0]
                                    .replace(/^\d+[a-z]\s+/, '')
                                    .split(' [')[0]
                                    .trim() || `Player ${targetId}`;
                                break;
                            }
                        }
                    }
                }
            }
            
            // Method 3: Brute force - search entire element for alt patterns
            if (playerName === `Player ${targetId}`) {
                const allAltImages = element.querySelectorAll('img[alt]');
                for (const img of allAltImages) {
                    if (img.alt) {
                        const altText = img.alt.trim();
                        // Look for any pattern that looks like "Name [ID]"
                        const nameMatch = altText.match(/^(.+?)\s*\[\d+\]$/);
                        if (nameMatch && nameMatch[1] && nameMatch[1].length > 2) {
                            playerName = nameMatch[1].trim();
                            break;
                        }
                    }
                }
            }
            
            // Final fallback: try element text with BSP removal
            if (playerName === `Player ${targetId}`) {
                let elementText = element.textContent?.trim() || '';
                
                // Remove BSP value if it's at the start
                if (bspValue && elementText.startsWith(bspValue)) {
                    elementText = elementText.substring(bspValue.length).trim();
                }
                
                // More comprehensive BSP pattern exclusion for mobile
                if (!/^\d+(\.\d+)?[kmb]?\s*$/.test(elementText) && elementText.length > 2) {
                    // Skip if starts with number and is short (likely mobile BSP)
                    if (!(/^\d/ && elementText.length < 8)) {
                        playerName = elementText
                            .split('\n')[0]
                            .replace(/^\d+[a-z]\s+/, '')
                            .split(' [')[0]
                            .trim() || `Player ${targetId}`;
                    }
                }
            }
            
            // If still not found, try element itself but exclude BSP patterns
            if (playerName === `Player ${targetId}`) {
                const elementText = element.textContent?.trim() || '';
                // More comprehensive BSP pattern exclusion for mobile
                if (!/^\d+(\.\d+)?[kmb]?\s*$/.test(elementText) && elementText.length > 2) {
                    // Skip if starts with number and is short (likely mobile BSP)
                    if (!(/^\d/ && elementText.length < 8)) {
                        playerName = elementText
                            .split('\n')[0]
                            .replace(/^\d+[a-z]\s+/, '')
                            .split(' [')[0]
                            .trim() || `Player ${targetId}`;
                    }
                }
            }
            
            // Final fallback: try to extract from any text that contains letters
            if (playerName === `Player ${targetId}`) {
                const allText = element.textContent || '';
                const words = allText.split(/\s+/);
                for (const word of words) {
                    // Find first word that contains letters and is longer than 2 chars
                    if (/[a-zA-Z]/.test(word) && word.length > 2 && !/^\d+(\.\d+)?[kmb]?$/.test(word)) {
                        playerName = word.replace(/[^a-zA-Z_-]/g, '').trim() || `Player ${targetId}`;
                        break;
                    }
                }
            }
            
            const presetMessage = CONFIG.messageTemplate
                .replace('{playerName}', playerName)
                .replace('{attacksWon}', attacksWon.toLocaleString())
                .replace('{playerId}', targetId);
            const encodedMessage = encodeURIComponent(presetMessage);
            
            // Try different URL formats that Torn might support
            const messageUrl = `https://www.torn.com/messages.php#/p=compose&XID=${targetId}&message=${encodedMessage}`;
            const linkElement = document.createElement('a');
            linkElement.href = messageUrl;
            linkElement.target = '_blank';
            linkElement.style.cssText = `
                text-decoration: none;
                display: inline-block;
            `;
            
            // Store message data in localStorage for backup auto-fill
            linkElement.addEventListener('click', () => {
                localStorage.setItem('pendingMessage', JSON.stringify({
                    playerId: targetId,
                    playerName: playerName,
                    attacksWon: attacksWon,
                    message: presetMessage
                }));
            });
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'iconStats';
            infoDiv.style.cssText = `
                height: 20px;
                width: 32px;
                position: relative;
                text-align: center;
                font-size: 12px;
                font-weight: bold;
                color: black;
                box-sizing: border-box;
                border: 1px solid black;
                line-height: 18px;
                font-family: initial;
                background: ${color};
                cursor: pointer;
                margin-left: 5px;
            `;
            infoDiv.textContent = displayText;
            
            // Set tooltip based on data
            if (!playerData.error) {
                infoDiv.title = `Attacks Won: ${attacksWon}`;
            } else {
                infoDiv.title = `Error: ${playerData.error}`;
            }
            
            linkElement.appendChild(infoDiv);
            injectionDiv.appendChild(linkElement);
            
            // Insert at the end of the element to position on the right
            element.appendChild(injectionDiv);
        });
    }

    // Player detection and injection
    const dictDivPerPlayer = {};
    const apiQueue = [];
    let isProcessingQueue = false;
    const API_DELAY = 50; // Very fast: 50ms between API calls (20 calls per second)

    function processApiQueue() {
        if (isProcessingQueue || apiQueue.length === 0) return;
        
        isProcessingQueue = true;
        const { playerId, callback } = apiQueue.shift();
        
        fetchPlayerInfo(playerId, (id, data) => {
            callback(id, data);
            
            // Process next item after very short delay
            setTimeout(() => {
                isProcessingQueue = false;
                processApiQueue();
            }, API_DELAY);
        });
    }

    function queueApiCall(playerId, callback) {
        apiQueue.push({ playerId, callback });
        processApiQueue();
    }

    function extractPlayerId(element) {
        // Try different methods to extract player ID
        const link = element.querySelector('a[href*="/profiles.php?"]') || element;
        if (!link || !link.href) return null;
        
        const match = link.href.match(/XID=(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    function findAndInjectPlayers(container) {
        // Use more specific selectors like BSP to avoid sidebar and chat
        const playerElements = container.querySelectorAll('.user.name, a[href*="/profiles.php?"]');
        
        playerElements.forEach(element => {
            const playerId = extractPlayerId(element);
            if (!playerId || playerId <= 0) return;
            
            // Skip if element is in sidebar or chat (like BSP does)
            const parent = element.closest('#sidebar, #chatRoot, .chat-box, .sidebar');
            if (parent) {
                return;
            }
            
            // Skip if element is already processed
            if (element.querySelector('.player-info-injection')) {
                return;
            }
            
            // Store element reference
            if (!dictDivPerPlayer[playerId]) {
                dictDivPerPlayer[playerId] = [];
            }
            dictDivPerPlayer[playerId].push(element);
            
            // Queue API call with faster delay
            queueApiCall(playerId, injectPlayerInfo);
        });
    }

    // Initialize
    function init() {
        // Check for API key first
        if (!ensureApiKey()) {
            return; // Stop initialization if no API key
        }
        
        // Check for pending message auto-fill on messages page
        if (window.location.href.includes('messages.php')) {
            checkAndFillPendingMessage();
        }
        
        // Add CSS styles - same as BSP
        const style = document.createElement('style');
        style.textContent = `
            .iconStats {
                height: 20px;
                width: 32px;
                position: relative;
                text-align: center;
                font-size: 12px;
                font-weight: bold;
                color: black;
                box-sizing: border-box;
                border: 1px solid black;
                line-height: 18px;
                font-family: initial;
            }
            .iconStats:hover {
                opacity: 0.8;
                transform: scale(1.1);
                transition: all 0.2s ease;
            }
            .TDup_ColoredStatsInjectionDiv {
                position: absolute;
                z-index: 100;
            }
        `;
        document.head.appendChild(style);
        
        // Initial scan
        findAndInjectPlayers(document.body);
        
        // Watch for changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        findAndInjectPlayers(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Check for pending message and auto-fill
    function checkAndFillPendingMessage() {
        const pendingMessage = localStorage.getItem('pendingMessage');
        if (!pendingMessage) return;
        
        try {
            const messageData = JSON.parse(pendingMessage);
            
            // Wait for message form to load
            const checkInterval = setInterval(() => {
                const messageTextarea = document.querySelector('#mce_0 > p, #mce_0, textarea[placeholder*="message"], textarea[name="message"], .message-textarea, #message-compose textarea');
                const subjectInput = document.querySelector('#editor-form > div:nth-child(2) > input');
                
                if (messageTextarea || subjectInput) {
                    clearInterval(checkInterval);
                    
                    // Fill the subject
                    if (subjectInput) {
                        subjectInput.value = 'Faction recruitment';
                        subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
                        subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // Fill the message
                    if (messageTextarea) {
                        messageTextarea.textContent = messageData.message;
                        messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        messageTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                        
                        // Focus on message
                        messageTextarea.focus();
                    }
                    
                    // Clear the pending message
                    localStorage.removeItem('pendingMessage');
                }
            }, 500);
            
            // Stop checking after 5 seconds
            setTimeout(() => clearInterval(checkInterval), 5000);
            
        } catch (error) {
            localStorage.removeItem('pendingMessage');
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
