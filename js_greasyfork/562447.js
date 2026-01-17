// ==UserScript==
// @name         Recruit Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
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

    // Get current user's username from /user/basic
    function getCurrentUsername(callback) {
        // Check cache first
        const cached = getCache('current_user');
        if (cached) {
            callback(cached.name);
            return;
        }

        const apiKey = CONFIG.apiKey || localStorage.getItem('torn_api_key');
        if (!apiKey) {
            callback(null);
            return;
        }

        const url = `https://api.torn.com/v2/user/basic?key=${apiKey}`;

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
                        callback(null);
                        return;
                    }

                    const username = result.profile?.name;
                    if (username) {
                        // Cache the result
                        setCache('current_user', { name: username });
                        callback(username);
                    } else {
                        callback(null);
                    }

                } catch (err) {
                    callback(null);
                }
            },
            onerror: (err) => {
                callback(null);
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
            linkElement.addEventListener('click', (e) => {
                e.preventDefault();

                // Store message data
                localStorage.setItem('pendingMessage', JSON.stringify({
                    playerId: targetId,
                    playerName: playerName,
                    attacksWon: attacksWon,
                    message: presetMessage
                }));

                // Open messaging page in new tab
                const messageUrl = `https://www.torn.com/messages.php#/p=compose&XID=${targetId}`;
                window.open(messageUrl, '_blank');
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

            // Add player ID to element for tracking
            injectionDiv.setAttribute('data-player-id', targetId);

            // Check if user was already messaged
            const messagedStatus = wasUserMessaged(targetId);
            if (messagedStatus) {
                if (messagedStatus.status === 'sent') {
                    infoDiv.style.background = '#73DF5D';
                    infoDiv.textContent = '✓';
                    infoDiv.title = 'Successfully messaged';
                }
            }

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

    // Mark user as messaged
    function markUserAsMessaged(playerId) {
        const messagedUsers = JSON.parse(localStorage.getItem('messagedUsers') || '{}');
        messagedUsers[playerId] = {
            timestamp: Date.now(),
            status: 'attempted'
        };
        localStorage.setItem('messagedUsers', JSON.stringify(messagedUsers));
    }

    // Mark user as successfully messaged
    function markUserAsSuccessfullyMessaged(playerId) {
        const messagedUsers = JSON.parse(localStorage.getItem('messagedUsers') || '{}');
        messagedUsers[playerId] = {
            timestamp: Date.now(),
            status: 'sent'
        };
        localStorage.setItem('messagedUsers', JSON.stringify(messagedUsers));
    }

    // Check if user was messaged
    function wasUserMessaged(playerId) {
        const messagedUsers = JSON.parse(localStorage.getItem('messagedUsers') || '{}');
        return messagedUsers[playerId] || false;
    }

    // Check conversation status in messaging page
    function checkConversationStatus() {
        // This function is now handled directly in checkAndFillPendingMessage
        // since we navigate in the same tab
    }

    // Listen for messages from popup windows
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'updateUserStatus') {
            const { playerId, status } = event.data;

            console.log('Received updateUserStatus message:', { playerId, status });

            // Update the display for this user
            const userElements = document.querySelectorAll(`[data-player-id="${playerId}"]`);
            console.log('Found user elements:', userElements.length);

            userElements.forEach(element => {
                const infoDiv = element.querySelector('.iconStats');
                if (infoDiv) {
                    if (status === 'sent' || status === 'already_messaged') {
                        // Add tick mark
                        console.log('Updating tick for player:', playerId);
                        infoDiv.style.background = '#73DF5D';
                        infoDiv.textContent = '✓';
                        infoDiv.title = 'Already messaged';
                    }
                }
            });
        }
    });

    // Check for pending message and auto-fill
    function checkAndFillPendingMessage() {
        const pendingMessage = localStorage.getItem('pendingMessage');
        if (!pendingMessage) return;

        try {
            const messageData = JSON.parse(pendingMessage);

            // Get current user's username first
            getCurrentUsername((currentUsername) => {
                if (!currentUsername) {
                    console.log('Could not get current username, proceeding with auto-fill');
                    proceedWithAutoFill(messageData);
                    return;
                }

                console.log('Current username:', currentUsername);
                checkForConversation(messageData, currentUsername);
            });

        } catch (error) {
            localStorage.removeItem('pendingMessage');
        }
    }

    // Check for conversation using current user's username
    function checkForConversation(messageData, currentUsername) {
        // Check for conversation status - support both desktop and mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        let retryCount = 0;
        const maxRetries = 10;
        const retryDelay = 500; // 500ms between retries

        function performCheck() {
            console.log(`Checking for any messages (attempt ${retryCount + 1}/${maxRetries})`);

            // Check if conversation content has loaded
            const conversationElements = document.querySelectorAll('[class*="conversation"], [class*="reply-mail"]');
            const ulElements = document.querySelectorAll('#mailbox-main ul');

            console.log('Conversation elements found:', conversationElements.length);
            console.log('UL elements in mailbox-main:', ulElements.length);

            if (conversationElements.length > 0 || ulElements.length > 0 || retryCount >= maxRetries - 1) {
                // Content loaded or max retries reached, proceed with check
                performConversationCheck(messageData, currentUsername, isMobile);
            } else {
                // Content not loaded yet, retry
                retryCount++;
                setTimeout(performCheck, retryDelay);
            }
        }

        // Start checking
        performCheck();
    }

    function performConversationCheck(messageData, currentUsername, isMobile) {
        let hasConversation = false;

        if (isMobile) {
            // Mobile detection - check for "No conversation recorded" element
            console.log('Mobile detected - checking for "No conversation recorded"');

            // Check for the specific "No conversation recorded" element (mobile)
            const noConversationSelector = '#mailbox-main > div.reply-mail-history-list.m-top10 > div > div > div > div';
            const noConversationElement = document.querySelector(noConversationSelector);

            console.log('Mobile - No conversation element found:', !!noConversationElement);

            if (noConversationElement) {
                const elementText = noConversationElement.textContent?.trim() || '';
                console.log('Mobile - No conversation element text:', elementText);

                if (elementText === 'No conversation recorded') {
                    console.log('Mobile - Found "No conversation recorded" - no previous messages');
                    hasConversation = false;
                } else {
                    console.log('Mobile - Element found but text is different:', elementText);
                    hasConversation = true;
                }
            } else {
                // Element not found - assume there are messages
                console.log('Mobile - No conversation element not found - assuming messages exist');
                hasConversation = true;
            }

        } else {
            // Desktop detection - check for "No conversation recorded" element first
            console.log('Desktop detected - checking for "No conversation recorded"');

            // Check for the specific "No conversation recorded" element
            const noConversationSelector = '#mailbox-main > div.reply-mail-history-list.m-top10 > div > div > div > div';
            const noConversationElement = document.querySelector(noConversationSelector);

            console.log('Desktop - No conversation element found:', !!noConversationElement);

            if (noConversationElement) {
                const elementText = noConversationElement.textContent?.trim() || '';
                console.log('Desktop - No conversation element text:', elementText);

                if (elementText === 'No conversation recorded') {
                    console.log('Desktop - Found "No conversation recorded" - no previous messages');
                    hasConversation = false;
                } else {
                    console.log('Desktop - Element found but text is different:', elementText);
                    hasConversation = true;
                }
            } else {
                // Element not found - assume there are messages
                console.log('Desktop - No conversation element not found - assuming messages exist');
                hasConversation = true;
            }
        }

        console.log('Final hasConversation result:', hasConversation);

        if (hasConversation) {
            // Conversation exists - show red warning and disable send
            console.log('Conversation exists - showing warning');

            // Mark as already messaged
            const messagedUsers = JSON.parse(localStorage.getItem('messagedUsers') || '{}');
            messagedUsers[messageData.playerId] = {
                timestamp: Date.now(),
                status: 'sent'
            };
            localStorage.setItem('messagedUsers', JSON.stringify(messagedUsers));

            // Clear pending message
            localStorage.removeItem('pendingMessage');

            // Update original page (if opened from new tab)
            try {
                window.opener.postMessage({
                    type: 'updateUserStatus',
                    playerId: messageData.playerId,
                    status: 'sent'
                }, '*');
            } catch (e) {
                // Might not have opener, that's fine
            }

            // Show red warning and disable send
            showRedWarning(isMobile);

        } else {
            // No conversation found - proceed with auto-fill
            proceedWithAutoFill(messageData);
        }
    }

    // Show red warning and disable send button
    function showRedWarning(isMobile) {
        const checkInterval = setInterval(() => {
            let messageTextarea = null;
            let sendButton = null;

            if (isMobile) {
                // Mobile message form detection - use same selectors as proceedWithAutoFill
                console.log('Mobile red warning - looking for form elements');

                // Target the specific subject input we found
                messageTextarea = document.querySelector('textarea[placeholder*="message"], textarea[name="message"], textarea[placeholder*="Type"], textarea, [contenteditable="true"]');

                // For mobile, look for TinyMCE editor or contenteditable div (same as auto-fill)
                const tinyMCE = document.querySelector('#mce_0_ifr, [contenteditable="true"], .mce-content-body, .tox-edit-area__iframe');

                // If iframe found, try to get its content body
                if (tinyMCE && tinyMCE.tagName === 'IFRAME') {
                    try {
                        const iframeDoc = tinyMCE.contentDocument || tinyMCE.contentWindow.document;
                        messageTextarea = iframeDoc.body;
                        console.log('Mobile red warning - found iframe, targeting body');
                    } catch (e) {
                        console.log('Mobile red warning - could not access iframe content');
                        // Fallback to regular textarea search
                        messageTextarea = document.querySelector('textarea[placeholder*="message"], textarea[name="message"], textarea[placeholder*="Type"], textarea');
                    }
                } else if (tinyMCE) {
                    messageTextarea = tinyMCE;
                    console.log('Mobile red warning - found contenteditable element');
                }

                sendButton = document.querySelector('#mailbox-wrapper > div > div.toolbarWrapper___PYWqv > div.actionButtonsWrapper___DwpJR > button');

                console.log('Mobile red warning - messageTextarea found:', !!messageTextarea);
                console.log('Mobile red warning - sendButton found:', !!sendButton);

            } else {
                // Desktop message form detection
                messageTextarea = document.querySelector('#mce_0 > p, #mce_0, textarea[placeholder*="message"], textarea[name="message"], .message-textarea, #message-compose textarea');
                sendButton = document.querySelector('#mailbox-wrapper > div > div.toolbarWrapper___PYWqv > div.actionButtonsWrapper___DwpJR > button');
            }

            if (messageTextarea || sendButton) {
                clearInterval(checkInterval);

                // Make message box red
                if (messageTextarea) {
                    messageTextarea.style.backgroundColor = '#ffcccc';
                    messageTextarea.style.borderColor = '#ff0000';
                    messageTextarea.style.color = '#cc0000';

                    if (messageTextarea.isContentEditable || messageTextarea.getAttribute('contenteditable') === 'true') {
                        messageTextarea.textContent = '⚠️ You have already messaged this person before';
                    } else {
                        messageTextarea.value = '⚠️ You have already messaged this person before';
                        messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                // Disable send button
                if (sendButton) {
                    // Additional validation to make sure this is the messaging send button
                    const buttonText = (sendButton.textContent || '').trim().toLowerCase();
                    const isInMailboxWrapper = sendButton.closest('#mailbox-wrapper');

                    if ((buttonText === 'send' || buttonText.includes('send')) && isInMailboxWrapper) {
                        sendButton.disabled = true;
                        sendButton.style.backgroundColor = '#ff6666';
                        sendButton.style.borderColor = '#ff0000';
                        sendButton.style.color = '#cc0000';
                        sendButton.textContent = 'Already Messaged';
                        sendButton.title = 'You have already messaged this person';
                    }
                }
            }
        }, 500);

        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
    }

    // Proceed with auto-fill
    function proceedWithAutoFill(messageData) {
        // Check for conversation status - support both desktop and mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        console.log('Auto-fill started - isMobile:', isMobile);
        console.log('Message data:', messageData);

        // No conversation found - proceed with auto-fill
        // Wait for message form to load - support both desktop and mobile
        const checkInterval = setInterval(() => {
            let messageTextarea = null;
            let subjectInput = null;

            if (isMobile) {
                // Mobile message form detection
                console.log('Mobile auto-fill - looking for form elements');

                // Target the specific subject input we found
                subjectInput = document.querySelector('input[name="subject"]');

                // For mobile, look for TinyMCE editor or contenteditable div
                messageTextarea = document.querySelector('#mce_0_ifr, [contenteditable="true"], .mce-content-body, .tox-edit-area__iframe');

                // If iframe found, try to get its content body
                if (messageTextarea && messageTextarea.tagName === 'IFRAME') {
                    try {
                        const iframeDoc = messageTextarea.contentDocument || messageTextarea.contentWindow.document;
                        messageTextarea = iframeDoc.body;
                        console.log('Mobile - found iframe, targeting body');
                    } catch (e) {
                        console.log('Mobile - could not access iframe content');
                        messageTextarea = null;
                    }
                }

                // Fallback: look for any contenteditable element
                if (!messageTextarea) {
                    messageTextarea = document.querySelector('[contenteditable="true"]');
                }

                console.log('Mobile - messageTextarea found:', !!messageTextarea);
                console.log('Mobile - subjectInput found:', !!subjectInput);

                // Debug: show all textareas and inputs on mobile
                const allTextareas = document.querySelectorAll('textarea');
                const allInputs = document.querySelectorAll('input');
                console.log('Mobile - total textareas found:', allTextareas.length);
                console.log('Mobile - total inputs found:', allInputs.length);

                allTextareas.forEach((ta, index) => {
                    console.log(`Mobile textarea ${index}:`, ta.placeholder, ta.name, ta.className);
                });

                allInputs.forEach((inp, index) => {
                    console.log(`Mobile input ${index}:`, inp.placeholder, inp.name, inp.type, inp.className);
                });

            } else {
                // Desktop message form detection
                messageTextarea = document.querySelector('#mce_0 > p, #mce_0, textarea[placeholder*="message"], textarea[name="message"], .message-textarea, #message-compose textarea');
                subjectInput = document.querySelector('#editor-form > div:nth-child(2) > input');

                console.log('Desktop - messageTextarea found:', !!messageTextarea);
                console.log('Desktop - subjectInput found:', !!subjectInput);
            }

            if (messageTextarea || subjectInput) {
                clearInterval(checkInterval);
                console.log('Form elements found, proceeding with auto-fill');

                // Fill the subject
                if (subjectInput) {
                    console.log('Filling subject field');
                    subjectInput.value = 'Faction recruitment';
                    subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
                    subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.log('Subject input not found');
                }

                // Fill the message
                if (messageTextarea) {
                    console.log('Filling message field');
                    console.log('Message textarea type:', messageTextarea.tagName, messageTextarea.type);
                    console.log('Is contentEditable:', messageTextarea.isContentEditable, messageTextarea.getAttribute('contenteditable'));

                    if (messageTextarea.isContentEditable || messageTextarea.getAttribute('contenteditable') === 'true') {
                        // For contentEditable elements (common on mobile)
                        messageTextarea.textContent = messageData.message;
                        messageTextarea.focus();
                    } else {
                        // For textarea elements
                        messageTextarea.value = messageData.message;
                        messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        messageTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                        messageTextarea.focus();
                    }
                } else {
                    console.log('Message textarea not found');
                }

                // Mark as successfully sent
                markUserAsSuccessfullyMessaged(messageData.playerId);

                // Update original page (if opened from new tab)
                try {
                    window.opener.postMessage({
                        type: 'updateUserStatus',
                        playerId: messageData.playerId,
                        status: 'sent'
                    }, '*');
                } catch (e) {
                    // Might not have opener, that's fine
                }

                // Clear the pending message
                localStorage.removeItem('pendingMessage');
            } else {
                console.log('Form elements not found yet, retrying...');
            }
        }, 500);

        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
