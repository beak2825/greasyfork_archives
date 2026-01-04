// ==UserScript==
// @name         Torn Poker - Networth All Players Enhanced
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Enhanced networth viewer with timeframes, refresh, player count, and more
// @author       You
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548005/Torn%20Poker%20-%20Networth%20All%20Players%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/548005/Torn%20Poker%20-%20Networth%20All%20Players%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Cache and state management
        let cachedPlayerIds = [];
        let selectedPlayerIds = [];
        let playerNames = {};
        let isMinimized = false;
        let selectedTimeframe = '1 month';
        let debounceTimer = null;
        let showPlayerList = false;
        
        // Timeframe options
        const timeframes = {
            '1 week': '1%20week',
            '1 month': '1%20month',
            '3 months': '3%20months',
            'all time': 'all'
        };
        
        // Add styles
        GM_addStyle(`
            .networth-container {
                position: fixed !important;
                top: 120px !important;
                right: 20px !important;
                z-index: 99999 !important;
                font-family: Arial, sans-serif !important;
                font-size: 12px !important;
            }
            
            .networth-main-btn {
                background: linear-gradient(to bottom, #4a4a4a, #2d2d2d) !important;
                color: #fff !important;
                padding: 8px 12px !important;
                border-radius: 4px !important;
                text-decoration: none !important;
                font-weight: bold !important;
                cursor: pointer !important;
                border: 1px solid #555 !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                transition: all 0.2s ease !important;
                width: auto !important;
                height: auto !important;
            }
            
            .networth-main-btn:hover {
                background: linear-gradient(to bottom, #5a5a5a, #3d3d3d) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 3px 6px rgba(0,0,0,0.4) !important;
            }
            
            .networth-controls {
                background: #2d2d2d !important;
                border: 1px solid #555 !important;
                border-radius: 4px !important;
                margin-top: 5px !important;
                padding: 8px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
                min-width: 220px !important;
                max-width: 300px !important;
            }
            
            .networth-controls.minimized {
                display: none !important;
            }
            
            .networth-row {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin-bottom: 6px !important;
            }
            
            .networth-row:last-child {
                margin-bottom: 0 !important;
            }
            
            .networth-select {
                background: #1a1a1a !important;
                color: #fff !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                padding: 4px 6px !important;
                font-size: 11px !important;
                flex: 1 !important;
            }
            
            .networth-btn {
                background: linear-gradient(to bottom, #3a6ea5, #2d5a8a) !important;
                color: #fff !important;
                padding: 4px 8px !important;
                border-radius: 3px !important;
                text-decoration: none !important;
                font-size: 11px !important;
                cursor: pointer !important;
                border: 1px solid #4a7cb5 !important;
                transition: all 0.2s ease !important;
                margin-right: 4px !important;
            }
            
            .networth-btn:hover {
                background: linear-gradient(to bottom, #4a7eb5, #3d6a9a) !important;
            }
            
            .networth-refresh-btn {
                background: linear-gradient(to bottom, #5a8a3a, #4a7a2d) !important;
                border: 1px solid #6a9a4a !important;
            }
            
            .networth-refresh-btn:hover {
                background: linear-gradient(to bottom, #6a9a4a, #5a8a3d) !important;
            }
            
            .player-count {
                color: #ccc !important;
                font-size: 10px !important;
                font-weight: normal !important;
            }
            
            .minimize-btn {
                background: none !important;
                border: none !important;
                color: #ccc !important;
                cursor: pointer !important;
                font-size: 14px !important;
                padding: 0 !important;
                margin-left: auto !important;
            }
            
            .minimize-btn:hover {
                color: #fff !important;
            }
            
            .networth-tooltip {
                position: absolute !important;
                background: #1a1a1a !important;
                color: #fff !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
                font-size: 11px !important;
                white-space: nowrap !important;
                z-index: 100000 !important;
                border: 1px solid #555 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.4) !important;
                pointer-events: none !important;
            }
            
            .player-list {
                max-height: 150px !important;
                overflow-y: auto !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                background: #1a1a1a !important;
                margin: 4px 0 !important;
            }
            
            .player-item {
                display: flex !important;
                align-items: center !important;
                padding: 4px 6px !important;
                border-bottom: 1px solid #333 !important;
                cursor: pointer !important;
                transition: background 0.2s ease !important;
            }
            
            .player-item:last-child {
                border-bottom: none !important;
            }
            
            .player-item:hover {
                background: #333 !important;
            }
            
            .player-checkbox {
                margin-right: 6px !important;
                cursor: pointer !important;
            }
            
            .player-name {
                color: #ccc !important;
                font-size: 11px !important;
                flex: 1 !important;
            }
            
            .player-id {
                color: #999 !important;
                font-size: 10px !important;
            }
            
            .selection-controls {
                display: flex !important;
                gap: 4px !important;
                margin: 4px 0 !important;
            }
            
            .selection-btn {
                background: #444 !important;
                color: #ccc !important;
                border: 1px solid #666 !important;
                padding: 2px 6px !important;
                border-radius: 3px !important;
                font-size: 10px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .selection-btn:hover {
                background: #555 !important;
                color: #fff !important;
            }
            
            .toggle-players-btn {
                background: #3a3a3a !important;
                color: #ccc !important;
                border: 1px solid #555 !important;
                padding: 3px 6px !important;
                border-radius: 3px !important;
                font-size: 10px !important;
                cursor: pointer !important;
                width: 100% !important;
                text-align: center !important;
                margin: 2px 0 !important;
            }
            
            .toggle-players-btn:hover {
                background: #4a4a4a !important;
                color: #fff !important;
            }
            
            .warning-text {
                color: #ff6b6b !important;
                font-size: 10px !important;
                text-align: center !important;
                margin: 2px 0 !important;
            }
        `);
        
        // Create main container
        const container = document.createElement("div");
        container.className = "networth-container";
        
        // Create main button
        const mainBtn = document.createElement("div");
        mainBtn.className = "networth-main-btn";
        mainBtn.style.cursor = "pointer";
        
        // Create controls panel
        const controls = document.createElement("div");
        controls.className = "networth-controls";
        
        // Timeframe selection row
        const timeframeRow = document.createElement("div");
        timeframeRow.className = "networth-row";
        
        const timeframeLabel = document.createElement("span");
        timeframeLabel.textContent = "Time:";
        timeframeLabel.style.color = "#ccc";
        timeframeLabel.style.fontSize = "11px";
        timeframeLabel.style.minWidth = "35px";
        
        const timeframeSelect = document.createElement("select");
        timeframeSelect.className = "networth-select";
        Object.keys(timeframes).forEach(timeframe => {
            const option = document.createElement("option");
            option.value = timeframe;
            option.textContent = timeframe;
            option.selected = timeframe === selectedTimeframe;
            timeframeSelect.appendChild(option);
        });
        
        timeframeSelect.addEventListener("change", () => {
            selectedTimeframe = timeframeSelect.value;
        });
        
        timeframeRow.appendChild(timeframeLabel);
        timeframeRow.appendChild(timeframeSelect);
        
        // Buttons row
        const buttonsRow = document.createElement("div");
        buttonsRow.className = "networth-row";
        
        const viewBtn = document.createElement("div");
        viewBtn.className = "networth-btn";
        viewBtn.textContent = "View Stats";
        viewBtn.style.cursor = "pointer";
        viewBtn.addEventListener("click", openNetworthPage);
        
        const refreshBtn = document.createElement("div");
        refreshBtn.className = "networth-btn networth-refresh-btn";
        refreshBtn.textContent = "↻ Refresh";
        refreshBtn.style.cursor = "pointer";
        refreshBtn.addEventListener("click", (e) => {
            e.preventDefault();
            refreshPlayerList();
        });
        
        buttonsRow.appendChild(viewBtn);
        buttonsRow.appendChild(refreshBtn);
        
        // Player selection toggle
        const togglePlayersBtn = document.createElement("div");
        togglePlayersBtn.className = "toggle-players-btn";
        togglePlayersBtn.textContent = "Select Players ▼";
        togglePlayersBtn.addEventListener("click", togglePlayerList);
        
        // Player list container
        const playerListContainer = document.createElement("div");
        playerListContainer.style.display = "none";
        
        // Selection controls
        const selectionControls = document.createElement("div");
        selectionControls.className = "selection-controls";
        
        const selectAllBtn = document.createElement("div");
        selectAllBtn.className = "selection-btn";
        selectAllBtn.textContent = "All";
        selectAllBtn.addEventListener("click", selectAllPlayers);
        
        const selectNoneBtn = document.createElement("div");
        selectNoneBtn.className = "selection-btn";
        selectNoneBtn.textContent = "None";
        selectNoneBtn.addEventListener("click", selectNoPlayers);
        
        const selectTop5Btn = document.createElement("div");
        selectTop5Btn.className = "selection-btn";
        selectTop5Btn.textContent = "Top 5";
        selectTop5Btn.addEventListener("click", selectTopFivePlayers);
        
        selectionControls.appendChild(selectAllBtn);
        selectionControls.appendChild(selectNoneBtn);
        selectionControls.appendChild(selectTop5Btn);
        
        // Player list
        const playerList = document.createElement("div");
        playerList.className = "player-list";
        
        // Warning text
        const warningText = document.createElement("div");
        warningText.className = "warning-text";
        warningText.textContent = "";
        
        playerListContainer.appendChild(selectionControls);
        playerListContainer.appendChild(playerList);
        playerListContainer.appendChild(warningText);
        
        controls.appendChild(timeframeRow);
        controls.appendChild(togglePlayersBtn);
        controls.appendChild(playerListContainer);
        controls.appendChild(buttonsRow);
        
        // Minimize button
        const minimizeBtn = document.createElement("button");
        minimizeBtn.className = "minimize-btn";
        minimizeBtn.textContent = "▼";
        minimizeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMinimize();
        });
        
        // Assemble container
        container.appendChild(mainBtn);
        container.appendChild(controls);
        
        // Add to page
        document.body.appendChild(container);
        
        // Tooltip functionality
        let tooltip = null;
        
        function showTooltip(element, text) {
            hideTooltip();
            tooltip = document.createElement("div");
            tooltip.className = "networth-tooltip";
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = (rect.left - tooltip.offsetWidth - 10) + "px";
            tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + "px";
        }
        
        function hideTooltip() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        }
        
        // Main functions
        function updateMainButton() {
            const totalCount = cachedPlayerIds.length;
            const selectedCount = selectedPlayerIds.length;
            const countText = totalCount > 0 ? ` (${selectedCount}/${totalCount})` : '';
            mainBtn.innerHTML = `💰 Networth<span class="player-count">${countText}</span>`;
            mainBtn.appendChild(minimizeBtn);
        }
        
        function togglePlayerList() {
            showPlayerList = !showPlayerList;
            togglePlayersBtn.textContent = showPlayerList ? "Select Players ▲" : "Select Players ▼";
            playerListContainer.style.display = showPlayerList ? "block" : "none";
        }
        
        function updatePlayerList() {
            playerList.innerHTML = "";
            
            cachedPlayerIds.forEach(playerId => {
                const playerItem = document.createElement("div");
                playerItem.className = "player-item";
                
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "player-checkbox";
                checkbox.checked = selectedPlayerIds.includes(playerId);
                checkbox.addEventListener("change", () => togglePlayerSelection(playerId));
                
                const nameSpan = document.createElement("span");
                nameSpan.className = "player-name";
                nameSpan.textContent = playerNames[playerId] || `Player ${playerId}`;
                
                const idSpan = document.createElement("span");
                idSpan.className = "player-id";
                idSpan.textContent = `#${playerId}`;
                
                playerItem.appendChild(checkbox);
                playerItem.appendChild(nameSpan);
                playerItem.appendChild(idSpan);
                
                playerItem.addEventListener("click", (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        togglePlayerSelection(playerId);
                    }
                });
                
                playerList.appendChild(playerItem);
            });
            
            updateWarningText();
        }
        
        function updateWarningText() {
            const selectedCount = selectedPlayerIds.length;
            if (selectedCount > 5) {
                warningText.textContent = `⚠️ Only first 5 players will be shown (${selectedCount} selected)`;
                warningText.style.display = "block";
            } else {
                warningText.style.display = "none";
            }
        }
        
        function togglePlayerSelection(playerId) {
            const index = selectedPlayerIds.indexOf(playerId);
            if (index === -1) {
                selectedPlayerIds.push(playerId);
            } else {
                selectedPlayerIds.splice(index, 1);
            }
            updateMainButton();
            updateWarningText();
        }
        
        function selectAllPlayers() {
            selectedPlayerIds = [...cachedPlayerIds];
            updateMainButton();
            updatePlayerList();
        }
        
        function selectNoPlayers() {
            selectedPlayerIds = [];
            updateMainButton();
            updatePlayerList();
        }
        
        function selectTopFivePlayers() {
            selectedPlayerIds = cachedPlayerIds.slice(0, 5);
            updateMainButton();
            updatePlayerList();
        }
        
        function toggleMinimize() {
            isMinimized = !isMinimized;
            minimizeBtn.textContent = isMinimized ? "▲" : "▼";
            controls.classList.toggle("minimized", isMinimized);
        }
        
        function getPlayerIds() {
            const ids = [];
            const names = {};
            
            document.querySelectorAll("[id^='player-']").forEach(el => {
                const match = el.id.match(/^player-(\d+)/);
                if (match) {
                    const playerId = match[1];
                    ids.push(playerId);
                    
                    // Try to get player name from various possible elements
                    const nameElement = el.querySelector('.name, .player-name, [class*="name"]') || 
                                      el.closest('[class*="player"]')?.querySelector('.name, .player-name, [class*="name"]');
                    
                    if (nameElement) {
                        names[playerId] = nameElement.textContent.trim();
                    } else {
                        // Fallback: look for any text content that might be a name
                        const textContent = el.textContent.trim();
                        if (textContent && textContent.length > 0 && textContent.length < 50) {
                            names[playerId] = textContent;
                        }
                    }
                }
            });
            
            playerNames = { ...playerNames, ...names };
            return ids;
        }
        
        function refreshPlayerList() {
            const newIds = getPlayerIds();
            cachedPlayerIds = newIds;
            
            // Update selected players - remove any that are no longer at the table
            selectedPlayerIds = selectedPlayerIds.filter(id => newIds.includes(id));
            
            updateMainButton();
            updatePlayerList();
            
            // Visual feedback
            refreshBtn.textContent = "✓ Updated";
            setTimeout(() => {
                refreshBtn.textContent = "↻ Refresh";
            }, 1000);
        }
        
        function openNetworthPage(e) {
            if (e) e.preventDefault();
            
            if (selectedPlayerIds.length === 0) {
                alert("⚠️ No players selected. Please select players to view their stats.");
                return;
            }
            
            // Use only the first 5 selected players due to Torn's limit
            const playersToView = selectedPlayerIds.slice(0, 5);
            
            const timeframeParam = timeframes[selectedTimeframe];
            const url = `https://www.torn.com/personalstats.php?ID=${playersToView.join(",")}&stats=networth&from=${timeframeParam}`;
            window.open(url, "_blank");
            
            // Show info if more than 5 were selected
            if (selectedPlayerIds.length > 5) {
                const skipped = selectedPlayerIds.length - 5;
                setTimeout(() => {
                    alert(`📊 Showing stats for first 5 players. ${skipped} additional player${skipped > 1 ? 's' : ''} skipped due to Torn's limit.`);
                }, 100);
            }
        }
        
        // Add tooltips
        mainBtn.addEventListener("mouseenter", () => {
            const totalCount = cachedPlayerIds.length;
            const selectedCount = selectedPlayerIds.length;
            let text;
            if (totalCount === 0) {
                text = "No players found";
            } else if (selectedCount === 0) {
                text = `${totalCount} player${totalCount !== 1 ? 's' : ''} found - none selected`;
            } else {
                text = `View networth for ${selectedCount} of ${totalCount} player${totalCount !== 1 ? 's' : ''}`;
                if (selectedCount > 5) {
                    text += ` (first 5 only)`;
                }
            }
            showTooltip(mainBtn, text);
        });
        mainBtn.addEventListener("mouseleave", hideTooltip);
        
        // Main button click
        mainBtn.addEventListener("click", openNetworthPage);
        
        // Debounced page change detection
        function debounceRefresh() {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
                refreshPlayerList();
            }, 500);
        }
        
        // Watch for DOM changes
        const observer = new MutationObserver((mutations) => {
            let shouldRefresh = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (
                            node.id && node.id.startsWith('player-') ||
                            node.querySelector && node.querySelector("[id^='player-']")
                        )) {
                            shouldRefresh = true;
                        }
                    });
                }
            });
            
            if (shouldRefresh) {
                debounceRefresh();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Keyboard shortcut (Ctrl+N)
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                if (!isMinimized) {
                    openNetworthPage(e);
                } else {
                    toggleMinimize();
                }
            }
        });
        
        // Initial setup
        updateMainButton();
        refreshPlayerList();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            hideTooltip();
        });
    }
})();