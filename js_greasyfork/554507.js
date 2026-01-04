// ==UserScript==
// @name         Papanad Stat Box (Mobile Enhanced)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Mobile-friendly draggable stats box with collapsible sections for Torn.com PDA
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554507/Papanad%20Stat%20Box%20%28Mobile%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554507/Papanad%20Stat%20Box%20%28Mobile%20Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - replace YOUR_API_KEY with your actual Torn API key
    const API_KEY = ' ';
    
    // Detect mobile device or PDA version
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPDA = window.location.href.includes('pda.php') || document.querySelector('.pda-version');
    const isMobileOrPDA = isMobile || isPDA;

    // Get stored position or use default (mobile-friendly defaults)
    const savedPosition = JSON.parse(localStorage.getItem('papanadStatsBoxPosition') || 'null');
    const defaultPosition = isMobileOrPDA ? {
        x: window.innerWidth - 180,
        y: 20
    } : {
        x: 10,
        y: 10
    };
    
    const position = savedPosition || defaultPosition;
    const isBoxOpen = localStorage.getItem('papanadStatsBoxOpen') !== 'false';
    const battleSectionOpen = localStorage.getItem('papanadBattleSectionOpen') !== 'false';
    const workingSectionOpen = localStorage.getItem('papanadWorkingSectionOpen') !== 'false';

    // Create the neon stats box with mobile-friendly sizing
    const statsBox = document.createElement('div');
    statsBox.id = 'torn-stats-box';
    statsBox.style.position = 'fixed';
    statsBox.style.left = `${position.x}px`;
    statsBox.style.top = `${position.y}px`;
    statsBox.style.backgroundColor = 'rgba(120, 0, 0, 0.85)';
    statsBox.style.color = '#39FF14';
    statsBox.style.padding = isMobileOrPDA ? '14px' : '12px';
    statsBox.style.borderRadius = '5px';
    statsBox.style.zIndex = '9999';
    statsBox.style.fontFamily = 'monospace, Arial, sans-serif';
    statsBox.style.fontSize = isMobileOrPDA ? '14px' : '13px';
    statsBox.style.boxShadow = '0 0 15px #ff0000, inset 0 0 10px #ff0000';
    statsBox.style.border = '1px solid #ff3333';
    statsBox.style.minWidth = isMobileOrPDA ? '180px' : '160px';
    statsBox.style.textShadow = '0 0 5px #39ff14';
    statsBox.style.cursor = 'move';
    statsBox.style.userSelect = 'none';
    statsBox.style.touchAction = 'none';
    statsBox.style.transition = 'all 0.3s ease';
    
    // Mobile-specific styling adjustments
    if (isMobileOrPDA) {
        statsBox.style.transform = 'scale(1.05)';
        statsBox.style.transformOrigin = 'top right';
    }

    // Create initial loading content
    statsBox.innerHTML = `
        <div id="stats-header" style="text-align: center; font-weight: bold; margin-bottom: ${isMobileOrPDA ? '8px' : '6px'}; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px; cursor: move; padding: ${isMobileOrPDA ? '5px' : '3px'}; border-radius: 3px;">
            STATS ${isBoxOpen ? '▼' : '►'}
        </div>
        <div id="stats-content" style="${isBoxOpen ? 'display: block;' : 'display: none;'}">
            <div style="text-align: center; margin-bottom: ${isMobileOrPDA ? '10px' : '6px'}; color: #ff6666; text-shadow: 0 0 8px #ff0000;">LOADING...</div>
        </div>
    `;
    
    document.body.appendChild(statsBox);

    // Add hover/touch effects
    const style = document.createElement('style');
    style.textContent = `
        #torn-stats-box a:hover, #torn-stats-box a:active {
            background: rgba(255, 0, 51, 0.3) !important;
        }
        #stats-header {
            touch-action: manipulation;
        }
        #stats-header:hover {
            background: rgba(255, 0, 51, 0.2);
            text-shadow: 0 0 10px #39ff14;
        }
        .section-header {
            cursor: pointer;
            background: rgba(255, 0, 51, 0.15);
            padding: ${isMobileOrPDA ? '5px' : '3px'};
            border-radius: 3px;
            margin: ${isMobileOrPDA ? '6px' : '4px'} 0;
        }
        .section-header:hover {
            background: rgba(255, 0, 51, 0.25);
        }
        @media (hover: none) {
            #torn-stats-box a:hover {
                background: rgba(255, 0, 51, 0.2) !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Function to handle API errors
    function handleApiError(error, section) {
        console.error(`API error in ${section}:`, error);
        return `<div style="color: #ff6666; text-shadow: 0 0 8px #ff0000; text-align: center; margin-top: 5px;">${section.toUpperCase()} ERROR</div>`;
    }

    // Fetch battle stats using v1 API
    fetch(`https://api.torn.com/user/?selections=personalstats&key=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error(`Battle stats API request failed with status ${response.status}`);
            return response.json();
        })
        .then(battleData => {
            if (battleData.error) {
                updateStatsBox({
                    battleStats: null,
                    battleError: battleData.error.error,
                    workingStats: null,
                    workingError: null
                });
                return;
            }

            // Extract battle stats
            const strength = battleData.personalstats.strength || 0;
            const defense = battleData.personalstats.defense || 0;
            const speed = battleData.personalstats.speed || 0;
            const dexterity = battleData.personalstats.dexterity || 0;
            const battleTotal = strength + defense + speed + dexterity;

            // Now fetch working stats using v2 API
            return fetch(`https://api.torn.com/v2/user/workstats?key=${API_KEY}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Working stats API request failed with status ${response.status}`);
                    return response.json();
                })
                .then(workingData => {
                    if (workingData.error) {
                        return {
                            battleStats: { strength, defense, speed, dexterity, battleTotal },
                            battleError: null,
                            workingStats: null,
                            workingError: workingData.error.error
                        };
                    }

                    // Extract working stats from v2 API response
                    const manualLabor = workingData.workstats.manual_labor || 0;
                    const intelligence = workingData.workstats.intelligence || 0;
                    const endurance = workingData.workstats.endurance || 0;
                    const workingTotal = manualLabor + intelligence + endurance;

                    return {
                        battleStats: { strength, defense, speed, dexterity, battleTotal },
                        battleError: null,
                        workingStats: { manualLabor, intelligence, endurance, workingTotal },
                        workingError: null
                    };
                });
        })
        .then(data => {
            if (!data) return;
            updateStatsBox(data);
        })
        .catch(error => {
            updateStatsBox({
                battleStats: null,
                battleError: `API Error: ${error.message}`,
                workingStats: null,
                workingError: null
            });
        });

    // Function to update the stats box content
    function updateStatsBox(data) {
        // Build the display with both stat sets
        let contentHTML = '';
        
        // Battle stats section
        contentHTML += `
            <div class="section-header" id="battle-section-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span>BATTLE STATS ${battleSectionOpen ? '▲' : '▼'}</span>
                <span style="font-weight: bold; font-family: monospace;">${data.battleStats ? data.battleStats.battleTotal.toLocaleString() : 'N/A'}</span>
            </div>
            <div id="battle-section-content" style="${battleSectionOpen ? 'display: block;' : 'display: none;'} margin-left: 5px; margin-bottom: ${isMobileOrPDA ? '12px' : '8px'};">
        `;
        
        if (data.battleStats) {
            contentHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>STR:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.battleStats.strength.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>DEF:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.battleStats.defense.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>SPD:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.battleStats.speed.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>DEX:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.battleStats.dexterity.toLocaleString()}</span>
                </div>
            `;
        } else if (data.battleError) {
            contentHTML += `<div style="color: #ff6666; text-shadow: 0 0 8px #ff0000; text-align: center; font-size: ${isMobileOrPDA ? '13px' : '12px'};">ERROR</div>`;
        }
        
        contentHTML += `</div>`;
        
        // Working stats section
        contentHTML += `
            <div class="section-header" id="working-section-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span>WORKING STATS ${workingSectionOpen ? '▲' : '▼'}</span>
                <span style="font-weight: bold; font-family: monospace;">${data.workingStats ? data.workingStats.workingTotal.toLocaleString() : 'N/A'}</span>
            </div>
            <div id="working-section-content" style="${workingSectionOpen ? 'display: block;' : 'display: none;'} margin-left: 5px;">
        `;
        
        if (data.workingStats) {
            contentHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>MAN:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.workingStats.manualLabor.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>INT:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.workingStats.intelligence.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: ${isMobileOrPDA ? '5px' : '4px'}; text-shadow: 0 0 4px #39ff14;">
                    <span>END:</span>
                    <span style="font-weight: bold; font-family: monospace;">${data.workingStats.endurance.toLocaleString()}</span>
                </div>
            `;
        } else if (data.workingError) {
            contentHTML += `<div style="color: #ff6666; text-shadow: 0 0 8px #ff0000; text-align: center; font-size: ${isMobileOrPDA ? '13px' : '12px'};">ERROR</div>`;
        }
        
        contentHTML += `</div>`;

        // Update the content
        const contentDiv = statsBox.querySelector('#stats-content');
        contentDiv.innerHTML = contentHTML;
        
        // Add section toggle functionality
        const battleSectionHeader = statsBox.querySelector('#battle-section-header');
        const workingSectionHeader = statsBox.querySelector('#working-section-header');
        
        if (battleSectionHeader) {
            battleSectionHeader.addEventListener('click', function(e) {
                e.stopPropagation();
                const content = statsBox.querySelector('#battle-section-content');
                const isOpen = content.style.display !== 'none';
                content.style.display = isOpen ? 'none' : 'block';
                battleSectionHeader.querySelector('span:first-child').textContent = 
                    `BATTLE STATS ${isOpen ? '▼' : '▲'}`;
                localStorage.setItem('papanadBattleSectionOpen', isOpen ? 'false' : 'true');
            });
        }
        
        if (workingSectionHeader) {
            workingSectionHeader.addEventListener('click', function(e) {
                e.stopPropagation();
                const content = statsBox.querySelector('#working-section-content');
                const isOpen = content.style.display !== 'none';
                content.style.display = isOpen ? 'none' : 'block';
                workingSectionHeader.querySelector('span:first-child').textContent = 
                    `WORKING STATS ${isOpen ? '▼' : '▲'}`;
                localStorage.setItem('papanadWorkingSectionOpen', isOpen ? 'false' : 'true');
            });
        }
    }

    // Drag functionality variables
    let isDragging = false;
    let offsetX, offsetY;
    let lastTapTime = 0;
    const doubleTapDelay = 300; // ms

    // Add drag functionality for both mouse and touch
    const header = statsBox.querySelector('#stats-header');
    header.style.cursor = 'move';

    // Common function to handle start of drag
    function startDrag(clientX, clientY) {
        isDragging = true;
        offsetX = clientX - statsBox.getBoundingClientRect().left;
        offsetY = clientY - statsBox.getBoundingClientRect().top;
        statsBox.style.cursor = 'grabbing';
        statsBox.style.opacity = '0.9';
    }

    // Mouse events
    header.addEventListener('mousedown', function(e) {
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    // Touch events for mobile
    header.addEventListener('touchstart', function(e) {
        // Handle double tap for toggle on mobile
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected - toggle entire box
            const content = statsBox.querySelector('#stats-content');
            const isOpen = content.style.display !== 'none';
            content.style.display = isOpen ? 'none' : 'block';
            header.textContent = `STATS ${isOpen ? '►' : '▼'}`;
            localStorage.setItem('papanadStatsBoxOpen', isOpen ? 'false' : 'true');
            e.preventDefault();
            return;
        }
        lastTapTime = currentTime;

        // Single tap and hold - start drag
        if (e.touches.length === 1) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        }
    }, { passive: false });

    // Common function to handle drag movement
    function moveDrag(clientX, clientY) {
        if (!isDragging) return;
        
        // Calculate new position
        let newX = clientX - offsetX;
        let newY = clientY - offsetY;
        
        // Keep within viewport boundaries with padding
        const padding = isMobileOrPDA ? 15 : 10;
        newX = Math.max(padding, Math.min(newX, window.innerWidth - statsBox.offsetWidth - padding));
        newY = Math.max(padding, Math.min(newY, window.innerHeight - statsBox.offsetHeight - padding));
        
        // Update position
        statsBox.style.left = `${newX}px`;
        statsBox.style.top = `${newY}px`;
        statsBox.style.right = 'auto';
        statsBox.style.bottom = 'auto';
    }

    // Mouse move
    document.addEventListener('mousemove', function(e) {
        moveDrag(e.clientX, e.clientY);
    });

    // Touch move
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling while dragging
        if (e.touches.length === 1) {
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    // Common function to handle end of drag
    function endDrag() {
        if (isDragging) {
            // Save position to localStorage
            const rect = statsBox.getBoundingClientRect();
            localStorage.setItem('papanadStatsBoxPosition', JSON.stringify({
                x: rect.left,
                y: rect.top
            }));
            
            isDragging = false;
            statsBox.style.cursor = 'move';
            statsBox.style.opacity = '1';
        }
    }

    // Mouse up
    document.addEventListener('mouseup', endDrag);

    // Touch end
    document.addEventListener('touchend', endDrag);

    // Add header click for desktop toggle
    header.addEventListener('click', function(e) {
        if (isDragging) return;
        
        const content = statsBox.querySelector('#stats-content');
        const isOpen = content.style.display !== 'none';
        content.style.display = isOpen ? 'none' : 'block';
        header.textContent = `STATS ${isOpen ? '►' : '▼'}`;
        localStorage.setItem('papanadStatsBoxOpen', isOpen ? 'false' : 'true');
    });
})();