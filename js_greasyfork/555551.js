// ==UserScript==
// @name         OpenFrontIO Auto-Join Lobby
// @namespace    http://tampermonkey.net/
// @version      1.4.7
// @description  Auto-join lobbies based on game mode preferences (FFA, Team with all team configurations, player filters). Tested and 100% functional against OpenFront v0.26.16
// @author       DeLoVaN
// @homepageURL  https://github.com/DeLoWaN/openfront-autojoin-lobby
// @match        https://openfront.io/*
// @match        https://*.openfront.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555551/OpenFrontIO%20Auto-Join%20Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/555551/OpenFrontIO%20Auto-Join%20Lobby.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tested and 100% functional against OpenFront v0.26.16

    // Configuration
    const CONFIG = {
        pollInterval: 1000, // ms - how often to check for matching lobbies
        rootURL: 'https://openfront.io/' // Root URL for lobby detection
    };

    // State
    let autoJoinEnabled = true; // Always start with ON (search active by default)
    let criteriaList = []; // List of criteria (can contain multiple modes)
    let monitoringInterval = null;
    let timerInterval = null;
    let gameInfoInterval = null; // Interval for updating current game info display
    let joinedLobbies = new Set(); // To avoid double joins
    let searchStartTime = null; // Timestamp when auto-join search started
    let gameFoundTime = null; // Timestamp when game was found (for fixed timer display)
    let isJoining = false; // Prevent concurrent join attempts
    let soundEnabled = true; // Sound notification enabled by default
    let recentlyLeftLobbyID = null; // Track lobby ID that was just left to prevent auto-rejoin
    let joinMode = 'notify'; // 'autojoin' or 'notify' - default to 'notify'
    let notifiedLobbies = new Set(); // Track lobbies we've notified about
    let lastNotifiedGameID = null; // Track the last game we notified about (for timer reset)
    let notificationTimeout = null; // Timeout for auto-dismissing notification
    let gameFoundAudio = null; // Preloaded audio for game found notification
    let gameStartAudio = null; // Preloaded audio for game start bell

    // Load settings from storage
    function loadSettings() {
        const saved = GM_getValue('autoJoinSettings', null);
        if (saved) {
            // Always keep search enabled
            autoJoinEnabled = true;
            criteriaList = saved.criteria || [];
            soundEnabled = saved.soundEnabled !== undefined ? saved.soundEnabled : true;
            joinMode = saved.joinMode || 'notify'; // Default to 'notify'
        }
    }

    // Save settings to storage
    function saveSettings() {
        GM_setValue('autoJoinSettings', {
            enabled: autoJoinEnabled,
            criteria: criteriaList,
            soundEnabled: soundEnabled,
            joinMode: joinMode
        });
    }

    // Update search timer display
    function updateSearchTimer() {
        const timerElement = document.getElementById('search-timer');
        if (!timerElement) return;

        if (!autoJoinEnabled || searchStartTime === null) {
            timerElement.style.display = 'none';
            gameFoundTime = null;
            return;
        }

        // If game was found, show fixed time
        if (gameFoundTime !== null) {
            const elapsed = Math.floor((gameFoundTime - searchStartTime) / 1000); // seconds
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `Game found! (${minutes}m ${seconds}s)`;
            timerElement.style.display = 'inline';
            return;
        }

        // Otherwise show live timer
        const elapsed = Math.floor((Date.now() - searchStartTime) / 1000); // seconds
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        timerElement.textContent = `Searching: ${minutes}m ${seconds}s`;
        timerElement.style.display = 'inline';
    }

    // Update current game info display (players per team for team games)
    function updateCurrentGameInfo() {
        const gameInfoElement = document.getElementById('current-game-info');
        if (!gameInfoElement) return;

        // Only show on lobby page
        if (!isOnLobbyPage()) {
            gameInfoElement.style.display = 'none';
            return;
        }

        // Always show the element to avoid resizing, but update content based on game type
        gameInfoElement.style.display = 'block';

        // Get current displayed lobby
        const publicLobby = document.querySelector('public-lobby');
        if (!publicLobby || !publicLobby.lobbies || !Array.isArray(publicLobby.lobbies) || publicLobby.lobbies.length === 0) {
            gameInfoElement.textContent = 'Current game: No game';
            gameInfoElement.classList.add('not-applicable');
            return;
        }

        const currentLobby = publicLobby.lobbies[0];
        if (!currentLobby || !currentLobby.gameConfig) {
            gameInfoElement.textContent = 'Current game: No game';
            gameInfoElement.classList.add('not-applicable');
            return;
        }

        const config = currentLobby.gameConfig;
        
        // Check if it's a team game
        if (config.gameMode !== 'Team') {
            gameInfoElement.textContent = 'Current game: Not a team game';
            gameInfoElement.classList.add('not-applicable');
            return;
        }

        // Get game capacity
        const gameCapacity = currentLobby.maxClients || config.maxClients || config.maxPlayers || null;
        if (gameCapacity === null) {
            gameInfoElement.textContent = 'Current game: Capacity unknown';
            gameInfoElement.classList.add('not-applicable');
            return;
        }

        // Get team configuration
        const playerTeams = config.playerTeams;
        
        // Display the info for team games
        // For Duos/Trios/Quads, show the mode name directly
        if (playerTeams === 'Duos') {
            gameInfoElement.textContent = 'Current game: Duos';
            gameInfoElement.classList.remove('not-applicable');
        } else if (playerTeams === 'Trios') {
            gameInfoElement.textContent = 'Current game: Trios';
            gameInfoElement.classList.remove('not-applicable');
        } else if (playerTeams === 'Quads') {
            gameInfoElement.textContent = 'Current game: Quads';
            gameInfoElement.classList.remove('not-applicable');
        } else if (typeof playerTeams === 'number') {
            // For modes with number of teams, show players per team
            const playersPerTeam = getPlayersPerTeam(playerTeams, gameCapacity);
            if (playersPerTeam === null) {
                gameInfoElement.textContent = 'Current game: Team configuration unknown';
                gameInfoElement.classList.add('not-applicable');
                return;
            }
            gameInfoElement.textContent = `Current game: ${playersPerTeam} players per team (${playerTeams} teams)`;
            gameInfoElement.classList.remove('not-applicable');
        } else {
            gameInfoElement.textContent = 'Current game: Team configuration unknown';
            gameInfoElement.classList.add('not-applicable');
        }
    }

    // Helper function to get players per team from playerTeams
    // When playerTeams is a string like 'Quads', 'Trios', 'Duos', it represents players per team directly
    // When playerTeams is a number, it represents the number of teams, so we calculate players per team
    function getPlayersPerTeam(playerTeams, gameCapacity) {
        // String values represent players per team directly
        if (playerTeams === 'Duos') return 2;
        if (playerTeams === 'Trios') return 3;
        if (playerTeams === 'Quads') return 4;
        // Number values represent the number of teams
        if (typeof playerTeams === 'number' && playerTeams > 0) {
            return Math.floor(gameCapacity / playerTeams);
        }
        return null;
    }

    // Check if lobby matches criteria
    function matchesCriteria(lobby, criteriaList) {
        if (!lobby || !lobby.gameConfig || !criteriaList || criteriaList.length === 0) {
            return false;
        }

        const config = lobby.gameConfig;
        // Get game capacity (max players the game can hold)
        // Try common property names for capacity
        const gameCapacity = lobby.maxClients || config.maxClients || config.maxPlayers || null;

        // Check if lobby matches at least one criterion
        for (const criteria of criteriaList) {
            let matches = false;

            if (criteria.gameMode === 'FFA') {
                if (config.gameMode !== 'Free For All') {
                    continue; // Move to next criterion
                }
                matches = true;
            } else if (criteria.gameMode === 'Team') {
                if (config.gameMode !== 'Team') {
                    continue;
                }

                // If a team count is specified, check it
                if (criteria.teamCount !== null && criteria.teamCount !== undefined) {
                    const playerTeams = config.playerTeams;

                    // Handle special modes
                    // Note: Duos/Trios/Quads are game modes (players per team), NOT team counts
                    // They should only match their exact string values, not numeric team counts
                    if (criteria.teamCount === 'Duos') {
                        if (playerTeams !== 'Duos') {
                            continue;
                        }
                    } else if (criteria.teamCount === 'Trios') {
                        if (playerTeams !== 'Trios') {
                            continue;
                        }
                    } else if (criteria.teamCount === 'Quads') {
                        if (playerTeams !== 'Quads') {
                            continue;
                        }
                    } else if (typeof criteria.teamCount === 'number') {
                        if (playerTeams !== criteria.teamCount) {
                            continue;
                        }
                    }
                }

                matches = true;
            }

            // If mode matches, check player filters
            if (matches) {
                if (criteria.gameMode === 'FFA') {
                    // For FFA, check based on game capacity (total players)
                    if (gameCapacity === null) {
                        // No capacity info available, skip capacity filtering
                        return true;
                    }

                    // Check minPlayers (minimum game capacity)
                    if (criteria.minPlayers !== null && criteria.minPlayers !== undefined) {
                        if (gameCapacity < criteria.minPlayers) {
                            continue; // Game capacity is less than minimum required
                        }
                    }

                    // Check maxPlayers (maximum game capacity)
                    if (criteria.maxPlayers !== null && criteria.maxPlayers !== undefined) {
                        if (gameCapacity > criteria.maxPlayers) {
                            continue; // Game capacity exceeds maximum allowed
                        }
                    }
                } else if (criteria.gameMode === 'Team') {
                    // For Team games, check based on players per team
                    // BUT: Duos/Trios/Quads always have 2/3/4 players per team by definition,
                    // so we skip the players per team filter for these modes
                    const playerTeams = config.playerTeams;
                    const isFixedPlayersPerTeam = playerTeams === 'Duos' || playerTeams === 'Trios' || playerTeams === 'Quads';
                    
                    // Only apply players per team filter for modes with number of teams (2/3/4/5/6/7 teams)
                    if (!isFixedPlayersPerTeam) {
                        if (gameCapacity === null) {
                            // No capacity info available, skip capacity filtering
                            return true;
                        }

                        // Get players per team
                        const playersPerTeam = getPlayersPerTeam(playerTeams, gameCapacity);
                        
                        if (playersPerTeam === null) {
                            // Cannot determine players per team, skip capacity filtering
                            return true;
                        }

                        // Check minPlayers (minimum players per team)
                        if (criteria.minPlayers !== null && criteria.minPlayers !== undefined) {
                            if (playersPerTeam < criteria.minPlayers) {
                                continue; // Players per team is less than minimum required
                            }
                        }

                        // Check maxPlayers (maximum players per team)
                        if (criteria.maxPlayers !== null && criteria.maxPlayers !== undefined) {
                            if (playersPerTeam > criteria.maxPlayers) {
                                continue; // Players per team exceeds maximum allowed
                            }
                        }
                    }
                    // For Duos/Trios/Quads, skip players per team filtering (always 2/3/4 by definition)
                }

                // All criteria satisfied
                return true;
            }
        }

        // No criterion matches
        return false;
    }

    // Helper function to check if we're on the lobby page (allowing hash/path variations)
    function isOnLobbyPage() {
        try {
            // Parse the configured root URL
            const configUrl = new URL(CONFIG.rootURL);
            const configOrigin = configUrl.origin;
            const configHostname = configUrl.hostname;

            // Get current location base
            const currentOrigin = window.location.origin;
            const currentHostname = window.location.hostname;

            // Check if origins/hostnames match
            if (currentOrigin !== configOrigin && currentHostname !== configHostname) {
                return false;
            }

            // Get current pathname and hash (normalize)
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;

            // Normalize path: remove trailing slashes and check if it's root or lobby-related
            const normalizedPath = currentPath.replace(/\/+$/, '') || '/';
            const isRootPath = normalizedPath === '/';

            // Check if path is a lobby-related path suffix (e.g., /public-lobby)
            const isLobbyPath = normalizedPath === '/public-lobby' || normalizedPath.startsWith('/public-lobby/');

            // Allow hash fragments like #/public-lobby or empty hash
            const isLobbyHash = !currentHash || currentHash === '#' || currentHash === '#/public-lobby' || currentHash.startsWith('#/public-lobby/');

            // Consider it the lobby page if:
            // 1. Origin/hostname matches AND
            // 2. Either:
            //    - Path is root/empty AND hash is empty or lobby-related, OR
            //    - Path is a lobby path (path-based routing, hash doesn't matter)
            return (isRootPath && isLobbyHash) || isLobbyPath;
        } catch (error) {
            // Fallback to strict comparison if URL parsing fails
            console.warn('[Auto-Join] Error checking lobby page, using fallback:', error);
            return location.href === CONFIG.rootURL;
        }
    }

    // Check lobbies and auto-join if match found
    async function checkLobbies() {
        try {
            // Always update current game info display
            updateCurrentGameInfo();

            // Prevent concurrent join attempts
            if (isJoining) {
                return;
            }

            // Check if we have criteria
            if (!criteriaList || criteriaList.length === 0) {
                console.warn('[Auto-Join] No criteria configured. Please select at least one game mode.');
                return;
            }

            // Check we're not already in a game
            if (!isOnLobbyPage()) {
                return;
            }

            // Get lobbies from the public-lobby component
            const publicLobby = document.querySelector('public-lobby');
            if (!publicLobby || !publicLobby.lobbies || !Array.isArray(publicLobby.lobbies)) {
                return; // Component not ready yet
            }
            const lobbies = publicLobby.lobbies;

            // In notify mode, check if we need to reset the timer when a new game appears
            if (joinMode === 'notify' && gameFoundTime !== null && lastNotifiedGameID !== null) {
                // Check if the currently displayed lobby is different from the one we notified about
                const currentLobby = lobbies.length > 0 ? lobbies[0] : null;
                const currentLobbyID = currentLobby ? currentLobby.gameID : null;
                
                // If current lobby is different from the one we notified about, reset timer and continue searching
                if (currentLobbyID !== lastNotifiedGameID) {
                    gameFoundTime = null;
                    lastNotifiedGameID = null;
                    // Restart timer if it was stopped
                    if (!timerInterval) {
                        timerInterval = setInterval(() => {
                            updateSearchTimer();
                        }, 1000);
                    }
                    updateSearchTimer();
                    updateUI({ status: null });
                }
            }

            // Search for a lobby matching criteria
            for (const lobby of lobbies) {

                if (matchesCriteria(lobby, criteriaList)) {
                    // Skip if this is the lobby we just left (permanently block auto-rejoin)
                    if (recentlyLeftLobbyID === lobby.gameID) {
                        continue;
                    }
                    
                    if (joinMode === 'notify') {
                        // Notify mode: show notification instead of joining
                        if (!notifiedLobbies.has(lobby.gameID)) {
                            showGameFoundNotification(lobby);
                            playGameFoundSound(); // Chime when match is found
                            notifiedLobbies.add(lobby.gameID);
                            // Mark that game was found and stop timer updates
                            gameFoundTime = Date.now();
                            lastNotifiedGameID = lobby.gameID;
                            stopTimer();
                            updateSearchTimer();
                            // Update UI status
                            updateUI({ status: 'found', gameID: lobby.gameID });
                            return; // Only notify about one lobby at a time
                        }
                    } else {
                        // Auto-join mode: existing behavior
                        // Check we haven't already joined this lobby
                        if (!joinedLobbies.has(lobby.gameID)) {
                            joinLobby(lobby);
                            joinedLobbies.add(lobby.gameID);
                            // Clear recently left lobby ID since we're joining a different one
                            recentlyLeftLobbyID = null;
                            return; // Only join one lobby at a time
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[Auto-Join] Error checking lobbies:', error);
        }
    }


    // Preload audio files for better performance
    function preloadSounds() {
        try {
            gameFoundAudio = new Audio('https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/new-notification-014-363678.mp3');
            gameFoundAudio.volume = 0.5;
            gameFoundAudio.preload = 'auto';
            
            gameStartAudio = new Audio('https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/opening-bell-421471.mp3');
            gameStartAudio.volume = 0.5;
            gameStartAudio.preload = 'auto';
            
        } catch (error) {
            console.warn('[Auto-Join] Could not preload audio files:', error);
        }
    }

    // Play sound notification (chime) when a game is found
    function playGameFoundSound() {
        if (!soundEnabled || !gameFoundAudio) return;

        try {
            gameFoundAudio.currentTime = 0; // Reset to start
            gameFoundAudio.play().catch(error => {
                console.warn('[Auto-Join] Could not play game found sound:', error);
            });
        } catch (error) {
            console.warn('[Auto-Join] Could not play game found sound:', error);
        }
    }

    // Play boxing ring bell sound when game starts/joins
    function playGameStartSound() {
        if (!soundEnabled || !gameStartAudio) return;

        try {
            gameStartAudio.currentTime = 0; // Reset to start
            gameStartAudio.play().catch(error => {
                console.warn('[Auto-Join] Could not play game start sound:', error);
            });
        } catch (error) {
            console.warn('[Auto-Join] Could not play game start sound:', error);
        }
    }

    // Get formatted game details text for notification
    function getGameDetailsText(lobby) {
        if (!lobby || !lobby.gameConfig) {
            return 'Game Found!';
        }

        const config = lobby.gameConfig;
        const gameCapacity = lobby.maxClients || config.maxClients || config.maxPlayers || null;

        if (config.gameMode === 'Free For All') {
            if (gameCapacity !== null) {
                return `Game Found! FFA - ${gameCapacity} players`;
            }
            return 'Game Found! FFA';
        } else if (config.gameMode === 'Team') {
            const playerTeams = config.playerTeams;
            
            let teamCountText = '';
            if (playerTeams === 'Duos') {
                teamCountText = 'Duos';
            } else if (playerTeams === 'Trios') {
                teamCountText = 'Trios';
            } else if (playerTeams === 'Quads') {
                teamCountText = 'Quads';
            } else if (typeof playerTeams === 'number') {
                teamCountText = `${playerTeams} teams`;
            } else {
                teamCountText = 'Team';
            }

            // For Duos/Trios/Quads, just show the mode name (always 2/3/4 players per team)
            if (playerTeams === 'Duos' || playerTeams === 'Trios' || playerTeams === 'Quads') {
                return `Game Found! Team (${teamCountText})`;
            }
            
            // For modes with number of teams, show players per team
            if (typeof playerTeams === 'number' && gameCapacity !== null) {
                const playersPerTeam = getPlayersPerTeam(playerTeams, gameCapacity);
                if (playersPerTeam !== null) {
                    return `Game Found! Team (${teamCountText}) - ${playersPerTeam} players per team`;
                }
            }
            
            return `Game Found! Team (${teamCountText})`;
        }

        return 'Game Found!';
    }

    // Dismiss notification
    function dismissNotification(targetElement = null) {
        const elements = targetElement
            ? [targetElement]
            : Array.from(document.querySelectorAll('.game-found-notification'));

        if (elements.length === 0) {
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
                notificationTimeout = null;
            }
            return;
        }

        elements.forEach(element => {
            if (!element.classList.contains('notification-dismissing')) {
                element.classList.add('notification-dismissing');
            }
            setTimeout(() => element.remove(), 300);
        });

        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
            notificationTimeout = null;
        }
    }

    // Show game found notification
    function showGameFoundNotification(lobby) {
        // If notification already exists, dismiss it first (show only latest)
        const existingNotification = document.getElementById('game-found-notification');
        if (existingNotification) {
            dismissNotification(existingNotification);
            // Wait a bit for the dismiss animation
            setTimeout(() => {
                createNewNotification(lobby);
            }, 50);
        } else {
            createNewNotification(lobby);
        }
    }

    // Create new notification element
    function createNewNotification(lobby) {
        const notification = document.createElement('div');
        notification.id = 'game-found-notification';
        notification.className = 'game-found-notification';
        
        const message = getGameDetailsText(lobby);
        notification.textContent = message;
        
        // Click to dismiss
        notification.addEventListener('click', () => dismissNotification(notification));
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('notification-visible');
        }, 10);
        
        // Auto-dismiss after 10 seconds
        notificationTimeout = setTimeout(() => {
            dismissNotification(notification);
        }, 10000);
    }

    // Join a lobby - only join if we can click the button (for visual feedback)
    function joinLobby(lobby) {
        // Prevent concurrent joins
        if (isJoining) {
            return;
        }

        // Try to get the public lobby component and check if the lobby matches
        const publicLobby = document.querySelector('public-lobby');
        const lobbyButton = publicLobby?.querySelector('button');

        // Only join if we can click the button (lobby must be displayed and button enabled)
        if (!publicLobby || !lobbyButton || lobbyButton.disabled) {
            // Remove from joinedLobbies so we can retry later
            joinedLobbies.delete(lobby.gameID);
            return;
        }

        // Get current displayed lobby (public-lobby shows lobbies[0])
        const currentLobby = publicLobby.lobbies?.[0];
        if (!currentLobby || currentLobby.gameID !== lobby.gameID) {
            // Remove from joinedLobbies so we can retry when it becomes visible
            joinedLobbies.delete(lobby.gameID);
            return;
        }

        // All conditions met - proceed with join
        isJoining = true;

        // Mark that game was found and stop timer updates
        gameFoundTime = Date.now();
        stopTimer();
        updateSearchTimer();

        // Play sound notification (chime when match is found)
        playGameFoundSound();

        // Click the button - component will handle join with visual feedback (green highlight)
        lobbyButton.click();

        // Update UI to indicate we joined
        updateUI({ status: 'joined', gameID: lobby.gameID });

        // Reset joining flag after a delay (allows time for join to process)
        setTimeout(() => {
            isJoining = false;
        }, 2000);
    }

    // Try to auto-start search if conditions are met
    function tryAutoStartSearch() {
        // Only auto-start if:
        // 1. We're in lobby
        // 2. Search is enabled
        // 3. We have valid criteria
        // 4. We're not already monitoring
        if (!isOnLobbyPage()) {
            return;
        }

        if (!autoJoinEnabled) {
            return;
        }

        // Build criteria from UI
        criteriaList = buildCriteriaFromUI();

        if (!criteriaList || criteriaList.length === 0) {
            return;
        }

        // Start monitoring if not already running
        if (!monitoringInterval) {
            startMonitoring();
            saveSettings();
            updateUI();
        }
    }

    // Start monitoring lobbies
    function startMonitoring() {
        if (monitoringInterval) return; // Already monitoring

        searchStartTime = Date.now();
        gameFoundTime = null; // Reset game found time
        lastNotifiedGameID = null; // Reset last notified game ID
        // Clear notified lobbies when starting new search
        notifiedLobbies.clear();
        updateSearchTimer();

        // Update timer display every second
        timerInterval = setInterval(() => {
            updateSearchTimer();
        }, 1000);

        // Start checking lobbies
        monitoringInterval = setInterval(checkLobbies, CONFIG.pollInterval);
    }

    // Stop monitoring lobbies
    function stopMonitoring() {
        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            monitoringInterval = null;
        }
        stopTimer();
        searchStartTime = null;
        gameFoundTime = null;
        lastNotifiedGameID = null;
        updateSearchTimer();
        // Dismiss any active notification
        dismissNotification();
        // Clear notified lobbies
        notifiedLobbies.clear();
        // Reset status to inactive when stopping
        updateUI({ status: null });
    }

    // Stop timer interval
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Start game info update interval
    function startGameInfoUpdates() {
        if (gameInfoInterval) return; // Already running
        
        // Update immediately
        updateCurrentGameInfo();
        
        // Update every second
        gameInfoInterval = setInterval(() => {
            updateCurrentGameInfo();
        }, 1000);
    }

    // Stop game info update interval
    function stopGameInfoUpdates() {
        if (gameInfoInterval) {
            clearInterval(gameInfoInterval);
            gameInfoInterval = null;
        }
        // Hide the display
        const gameInfoElement = document.getElementById('current-game-info');
        if (gameInfoElement) {
            gameInfoElement.style.display = 'none';
        }
    }

    // Update slider visual fill and sync with hidden inputs
    function updateSliderRange(minSliderId, maxSliderId, minInputId, maxInputId, fillId, minValueId, maxValueId) {
        const minSlider = document.getElementById(minSliderId);
        const maxSlider = document.getElementById(maxSliderId);
        const minInput = document.getElementById(minInputId);
        const maxInput = document.getElementById(maxInputId);
        const fill = document.getElementById(fillId);
        const minValueDisplay = document.getElementById(minValueId);
        const maxValueDisplay = document.getElementById(maxValueId);

        if (!minSlider || !maxSlider || !fill) return;

        const minVal = parseInt(minSlider.value, 10);
        const maxVal = parseInt(maxSlider.value, 10);
        const min = parseInt(minSlider.min, 10);
        const max = parseInt(minSlider.max, 10);

        // Ensure min <= max
        if (minVal > maxVal) {
            if (document.activeElement === minSlider) {
                maxSlider.value = minVal;
                if (maxInput) maxInput.value = minVal === max ? '' : minVal;
            } else {
                minSlider.value = maxVal;
                if (minInput) minInput.value = maxVal === min ? '' : maxVal;
            }
            return updateSliderRange(minSliderId, maxSliderId, minInputId, maxInputId, fillId, minValueId, maxValueId);
        }

        // Calculate fill position and width
        const minPercent = ((minVal - min) / (max - min)) * 100;
        const maxPercent = ((maxVal - min) / (max - min)) * 100;

        fill.style.left = minPercent + '%';
        fill.style.width = (maxPercent - minPercent) + '%';

        // Update hidden inputs
        if (minInput) {
            minInput.value = minVal === min ? '' : minVal;
        }
        if (maxInput) {
            maxInput.value = maxVal === max ? '' : maxVal;
        }

        // Update displayed values
        if (minValueDisplay) {
            minValueDisplay.textContent = minVal === min ? 'Any' : minVal;
        }
        if (maxValueDisplay) {
            maxValueDisplay.textContent = maxVal === max ? 'Any' : maxVal;
        }
    }

    // Initialize slider from hidden input values
    function initializeSlider(minSliderId, maxSliderId, minInputId, maxInputId, fillId, minValueId, maxValueId) {
        const minSlider = document.getElementById(minSliderId);
        const maxSlider = document.getElementById(maxSliderId);
        const minInput = document.getElementById(minInputId);
        const maxInput = document.getElementById(maxInputId);

        if (!minSlider || !maxSlider) return;

        const min = parseInt(minSlider.min, 10);
        const max = parseInt(minSlider.max, 10);

        // Get values from hidden inputs or use defaults
        let minVal = min;
        let maxVal = max;

        if (minInput && minInput.value) {
            minVal = Math.max(min, Math.min(max, parseInt(minInput.value, 10)));
        }
        if (maxInput && maxInput.value) {
            maxVal = Math.max(min, Math.min(max, parseInt(maxInput.value, 10)));
        }

        // Ensure min <= max
        if (minVal > maxVal) {
            minVal = maxVal;
        }

        minSlider.value = minVal;
        maxSlider.value = maxVal;

        updateSliderRange(minSliderId, maxSliderId, minInputId, maxInputId, fillId, minValueId, maxValueId);
    }

    // Get number value from input
    function getNumberValue(id) {
        const input = document.getElementById(id);
        if (!input || !input.value) return null;
        const value = parseInt(input.value, 10);
        return isNaN(value) ? null : value;
    }

    // Helper function to update mode label styles
    function updateModeLabels(isAutoJoin) {
        const labelLeft = document.querySelector('.mode-label-left');
        const labelRight = document.querySelector('.mode-label-right');
        if (labelLeft && labelRight) {
            if (isAutoJoin) {
                labelLeft.style.opacity = '0.6';
                labelLeft.style.color = 'rgba(255, 255, 255, 0.7)';
                labelRight.style.opacity = '1';
                labelRight.style.color = 'rgba(255, 255, 255, 0.95)';
            } else {
                labelLeft.style.opacity = '1';
                labelLeft.style.color = 'rgba(255, 255, 255, 0.95)';
                labelRight.style.opacity = '0.6';
                labelRight.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        }
    }

    // Get all selected team counts from UI (returns array)
    function getAllTeamCountValues() {
        const selectedCounts = [];
        const teamCountIds = [
            { id: 'autojoin-team-duos', value: 'Duos' },
            { id: 'autojoin-team-trios', value: 'Trios' },
            { id: 'autojoin-team-quads', value: 'Quads' },
            { id: 'autojoin-team-2', value: 2 },
            { id: 'autojoin-team-3', value: 3 },
            { id: 'autojoin-team-4', value: 4 },
            { id: 'autojoin-team-5', value: 5 },
            { id: 'autojoin-team-6', value: 6 },
            { id: 'autojoin-team-7', value: 7 }
        ];

        teamCountIds.forEach(({ id, value }) => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                selectedCounts.push(value);
            }
        });

        return selectedCounts.length > 0 ? selectedCounts : null;
    }

    // Helper function for select/deselect all team counts
    function setAllTeamCounts(checked) {
        const checkboxes = [
            'autojoin-team-2', 'autojoin-team-3', 'autojoin-team-4', 'autojoin-team-5',
            'autojoin-team-6', 'autojoin-team-7', 'autojoin-team-duos', 'autojoin-team-trios',
            'autojoin-team-quads'
        ];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = checked;
        });
    }

    // Build criteria list from UI
    function buildCriteriaFromUI() {
        const criteriaList = [];

        // Check FFA
        const ffaChecked = document.getElementById('autojoin-ffa').checked;
        if (ffaChecked) {
            const ffaCriteria = {
                gameMode: 'FFA',
                minPlayers: getNumberValue('autojoin-ffa-min') || null,
                maxPlayers: getNumberValue('autojoin-ffa-max') || null
            };
            criteriaList.push(ffaCriteria);
        }

        // Check Team
        const teamChecked = document.getElementById('autojoin-team').checked;
        if (teamChecked) {
            const selectedTeamCounts = getAllTeamCountValues();
            const minPlayers = getNumberValue('autojoin-team-min') || null;
            const maxPlayers = getNumberValue('autojoin-team-max') || null;

            if (selectedTeamCounts === null) {
                // No specific team counts selected, create one criteria that accepts all Team modes
                const teamCriteria = {
                    gameMode: 'Team',
                    teamCount: null,
                    minPlayers: minPlayers,
                    maxPlayers: maxPlayers
                };
                criteriaList.push(teamCriteria);
            } else {
                // Create a separate criteria for each selected team count
                for (const teamCount of selectedTeamCounts) {
                    // Duos/Trios/Quads are game modes with fixed players per team (2/3/4)
                    // Player per team filters do NOT apply to these modes
                    const isFixedPlayersPerTeam = teamCount === 'Duos' || teamCount === 'Trios' || teamCount === 'Quads';
                    
                    const teamCriteria = {
                        gameMode: 'Team',
                        teamCount: teamCount,
                        // Only include player filters for modes with variable team counts (2/3/4/5/6/7 teams)
                        minPlayers: isFixedPlayersPerTeam ? null : minPlayers,
                        maxPlayers: isFixedPlayersPerTeam ? null : maxPlayers
                    };
                    criteriaList.push(teamCriteria);
                }
            }
        }

        return criteriaList;
    }

    // Update UI based on state
    function updateUI(options = {}) {
        const statusIndicator = document.querySelector('#autojoin-status .status-indicator');
        const statusText = document.querySelector('#autojoin-status .status-text');

        if (statusIndicator) {
            // Always show as active (search is always on)
            statusIndicator.classList.add('active');
        }

        if (statusText) {
            // Show "Joined" if explicitly set
            if (options.status === 'joined') {
                statusText.textContent = 'Joined';
            } else {
                // In notify mode, always show "Searching" (timer will show "Game found!" when applicable)
                statusText.textContent = joinMode === 'notify' ? 'Searching' : 'Active';
            }
        }

        updateSearchTimer();
    }

    // Create UI
    function createUI() {
        // Check if UI already exists
        if (document.getElementById('openfront-autojoin-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'openfront-autojoin-panel';
        panel.className = 'autojoin-panel';
        panel.innerHTML = `
            <div class="autojoin-header" id="autojoin-header-drag">
                <h3>Auto-Join Lobby</h3>
            </div>

            <div class="autojoin-content">
                <!-- Mode Selector -->
                <div class="join-mode-selector">
                    <span class="mode-label-left">Notify Only</span>
                    <label class="mode-toggle-switch">
                        <input type="checkbox" id="join-mode-toggle">
                        <span class="mode-toggle-slider"></span>
                    </label>
                    <span class="mode-label-right">Auto-Join</span>
                </div>

                <!-- FFA Section -->
                <div class="autojoin-mode-section">
                    <label class="mode-checkbox-label">
                        <input type="checkbox" id="autojoin-ffa" name="gameMode" value="FFA">
                        <span>FFA</span>
                    </label>

                    <div class="autojoin-mode-config" id="ffa-config" style="display: none;">
                        <div class="player-filter-info">
                            <small>Filter by max players:</small>
                        </div>
                        <div class="capacity-range-wrapper">
                            <div class="capacity-range-visual">
                                <div class="capacity-track">
                                    <div class="capacity-range-fill" id="ffa-range-fill"></div>
                                    <input type="range" id="autojoin-ffa-min-slider" min="1" max="100" value="1" class="capacity-slider capacity-slider-min">
                                    <input type="range" id="autojoin-ffa-max-slider" min="1" max="100" value="100" class="capacity-slider capacity-slider-max">
                                </div>
                                <div class="capacity-labels">
                                    <div class="capacity-label-group">
                                        <label for="autojoin-ffa-min-slider">Min:</label>
                                        <span class="capacity-value" id="ffa-min-value">Any</span>
                                    </div>
                                    <div class="capacity-label-group">
                                        <label for="autojoin-ffa-max-slider">Max:</label>
                                        <span class="capacity-value" id="ffa-max-value">Any</span>
                                    </div>
                                </div>
                            </div>
                            <div class="capacity-inputs-hidden">
                                <input type="number" id="autojoin-ffa-min" min="1" max="100" style="display: none;">
                                <input type="number" id="autojoin-ffa-max" min="1" max="100" style="display: none;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Team Section -->
                <div class="autojoin-mode-section">
                    <label class="mode-checkbox-label">
                        <input type="checkbox" id="autojoin-team" name="gameMode" value="Team">
                        <span>Team</span>
                    </label>

                    <div class="autojoin-mode-config" id="team-config" style="display: none;">
                        <!-- Fixed Team Modes (Duos/Trios/Quads) - No player filters -->
                        <div class="team-mode-panel fixed-modes-panel">
                            <div class="panel-header">
                                <label style="display: block; margin-bottom: 6px; font-size: 0.9em; font-weight: 600;">Fixed Team Modes (Duos/Trios/Quads):</label>
                                <div style="display: flex; gap: 4px; margin-bottom: 6px;">
                                    <button type="button" id="autojoin-fixed-select-all" class="select-all-btn">Select All</button>
                                    <button type="button" id="autojoin-fixed-deselect-all" class="select-all-btn">Deselect All</button>
                                </div>
                            </div>
                            <div class="team-count-options">
                                <label><input type="checkbox" id="autojoin-team-duos" value="Duos"> Duos</label>
                                <label><input type="checkbox" id="autojoin-team-trios" value="Trios"> Trios</label>
                                <label><input type="checkbox" id="autojoin-team-quads" value="Quads"> Quads</label>
                            </div>
                        </div>

                        <!-- Variable Team Counts (2-7 teams) - With player filters -->
                        <div class="team-mode-panel variable-modes-panel">
                            <div class="panel-header">
                                <label style="display: block; margin-bottom: 6px; font-size: 0.9em; font-weight: 600;">Variable Team Counts (2-7 teams):</label>
                                <div style="display: flex; gap: 4px; margin-bottom: 6px;">
                                    <button type="button" id="autojoin-variable-select-all" class="select-all-btn">Select All</button>
                                    <button type="button" id="autojoin-variable-deselect-all" class="select-all-btn">Deselect All</button>
                                </div>
                            </div>
                            <div class="team-count-options">
                                <label><input type="checkbox" id="autojoin-team-2" value="2"> 2 teams</label>
                                <label><input type="checkbox" id="autojoin-team-3" value="3"> 3 teams</label>
                                <label><input type="checkbox" id="autojoin-team-4" value="4"> 4 teams</label>
                                <label><input type="checkbox" id="autojoin-team-5" value="5"> 5 teams</label>
                                <label><input type="checkbox" id="autojoin-team-6" value="6"> 6 teams</label>
                                <label><input type="checkbox" id="autojoin-team-7" value="7"> 7 teams</label>
                            </div>
                            <div class="player-filter-info">
                                <small>Filter by players per team:</small>
                            </div>
                            <div class="capacity-range-wrapper">
                                <div class="capacity-range-visual">
                                    <div class="capacity-track">
                                        <div class="capacity-range-fill" id="team-range-fill"></div>
                                        <input type="range" id="autojoin-team-min-slider" min="0" max="50" value="0" class="capacity-slider capacity-slider-min">
                                        <input type="range" id="autojoin-team-max-slider" min="0" max="50" value="50" class="capacity-slider capacity-slider-max">
                                    </div>
                                    <div class="capacity-labels">
                                        <div class="capacity-label-group">
                                            <label for="autojoin-team-min-slider">Min:</label>
                                            <span class="capacity-value" id="team-min-value">Any</span>
                                        </div>
                                        <div class="capacity-label-group">
                                            <label for="autojoin-team-max-slider">Max:</label>
                                            <span class="capacity-value" id="team-max-value">Any</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="capacity-inputs-hidden">
                                    <input type="number" id="autojoin-team-min" min="0" max="50" style="display: none;">
                                    <input type="number" id="autojoin-team-max" min="0" max="50" style="display: none;">
                                </div>
                            </div>
                        </div>
                        <div class="current-game-info" id="current-game-info" style="display: none;"></div>
                    </div>
                </div>

                <div class="autojoin-status" id="autojoin-status">
                    <span class="status-label">Status:</span>
                    <span class="status-indicator"></span>
                    <span class="status-text">Searching</span>
                    <span class="search-timer" id="search-timer" style="display: none;"></span>
                </div>

                <div class="autojoin-settings">
                    <label class="sound-toggle-label">
                        <input type="checkbox" id="autojoin-sound-toggle">
                        <span>🔔 Sound</span>
                    </label>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Make panel draggable
        makePanelDraggable(panel);

        // Setup event listeners
        setupEventListeners();

        // Load saved settings into UI
        loadUIFromSettings();

        // Initialize sliders (in case no saved settings)
        initializeSlider('autojoin-ffa-min-slider', 'autojoin-ffa-max-slider', 'autojoin-ffa-min', 'autojoin-ffa-max', 'ffa-range-fill', 'ffa-min-value', 'ffa-max-value');
        initializeSlider('autojoin-team-min-slider', 'autojoin-team-max-slider', 'autojoin-team-min', 'autojoin-team-max', 'team-range-fill', 'team-min-value', 'team-max-value');

        // Update UI
        updateUI();

        // Auto-start search if criteria exist and we're in lobby
        setTimeout(() => {
            tryAutoStartSearch();
        }, 500); // Small delay to ensure page is ready
    }

    // Make panel draggable
    function makePanelDraggable(panel) {
        const header = document.getElementById('autojoin-header-drag');
        if (!header) return;

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Load saved position
        const savedPos = GM_getValue('autoJoinPanelPosition', null);
        if (savedPos) {
            panel.style.left = savedPos.x + 'px';
            panel.style.top = savedPos.y + 'px';
            xOffset = savedPos.x;
            yOffset = savedPos.y;
        }

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                header.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                panel.style.right = 'auto';
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            header.style.cursor = 'grab';

            // Save position
            GM_setValue('autoJoinPanelPosition', { x: xOffset, y: yOffset });
        }
    }

    // Setup event listeners
    function setupEventListeners() {

        // FFA checkbox - show/hide config
        const ffaCheckbox = document.getElementById('autojoin-ffa');
        const ffaConfig = document.getElementById('ffa-config');
        if (ffaCheckbox && ffaConfig) {
            ffaCheckbox.addEventListener('change', () => {
                ffaConfig.style.display = ffaCheckbox.checked ? 'block' : 'none';
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                // Auto-start search if criteria are valid and we're in lobby
                tryAutoStartSearch();
            });
        }

        // Team checkbox - show/hide config
        const teamCheckbox = document.getElementById('autojoin-team');
        const teamConfig = document.getElementById('team-config');
        if (teamCheckbox && teamConfig) {
            teamCheckbox.addEventListener('change', () => {
                teamConfig.style.display = teamCheckbox.checked ? 'block' : 'none';
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                // Auto-start search if criteria are valid and we're in lobby
                tryAutoStartSearch();
            });
        }

        // Select All / Deselect All buttons for fixed modes (Duos/Trios/Quads)
        const fixedSelectAllBtn = document.getElementById('autojoin-fixed-select-all');
        const fixedDeselectAllBtn = document.getElementById('autojoin-fixed-deselect-all');
        if (fixedSelectAllBtn) {
            fixedSelectAllBtn.addEventListener('click', () => {
                const checkboxes = ['autojoin-team-duos', 'autojoin-team-trios', 'autojoin-team-quads'];
                checkboxes.forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                tryAutoStartSearch();
            });
        }
        if (fixedDeselectAllBtn) {
            fixedDeselectAllBtn.addEventListener('click', () => {
                const checkboxes = ['autojoin-team-duos', 'autojoin-team-trios', 'autojoin-team-quads'];
                checkboxes.forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = false;
                });
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                tryAutoStartSearch();
            });
        }

        // Select All / Deselect All buttons for variable modes (2-7 teams)
        const variableSelectAllBtn = document.getElementById('autojoin-variable-select-all');
        const variableDeselectAllBtn = document.getElementById('autojoin-variable-deselect-all');
        if (variableSelectAllBtn) {
            variableSelectAllBtn.addEventListener('click', () => {
                const checkboxes = ['autojoin-team-2', 'autojoin-team-3', 'autojoin-team-4', 'autojoin-team-5', 'autojoin-team-6', 'autojoin-team-7'];
                checkboxes.forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                tryAutoStartSearch();
            });
        }
        if (variableDeselectAllBtn) {
            variableDeselectAllBtn.addEventListener('click', () => {
                const checkboxes = ['autojoin-team-2', 'autojoin-team-3', 'autojoin-team-4', 'autojoin-team-5', 'autojoin-team-6', 'autojoin-team-7'];
                checkboxes.forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = false;
                });
                criteriaList = buildCriteriaFromUI();
                saveSettings();
                tryAutoStartSearch();
            });
        }

        // Listen to all team count checkbox changes
        const teamCountCheckboxes = [
            'autojoin-team-2', 'autojoin-team-3', 'autojoin-team-4', 'autojoin-team-5',
            'autojoin-team-6', 'autojoin-team-7', 'autojoin-team-duos', 'autojoin-team-trios',
            'autojoin-team-quads'
        ];
        teamCountCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    criteriaList = buildCriteriaFromUI();
                    saveSettings();
                    tryAutoStartSearch();
                });
            }
        });

        // Setup slider event listeners
        const sliderPairs = [
            {
                minSlider: 'autojoin-ffa-min-slider',
                maxSlider: 'autojoin-ffa-max-slider',
                minInput: 'autojoin-ffa-min',
                maxInput: 'autojoin-ffa-max',
                fill: 'ffa-range-fill',
                minValue: 'ffa-min-value',
                maxValue: 'ffa-max-value'
            },
            {
                minSlider: 'autojoin-team-min-slider',
                maxSlider: 'autojoin-team-max-slider',
                minInput: 'autojoin-team-min',
                maxInput: 'autojoin-team-max',
                fill: 'team-range-fill',
                minValue: 'team-min-value',
                maxValue: 'team-max-value'
            }
        ];

        sliderPairs.forEach(pair => {
            const minSlider = document.getElementById(pair.minSlider);
            const maxSlider = document.getElementById(pair.maxSlider);

            if (minSlider) {
                minSlider.addEventListener('input', () => {
                    updateSliderRange(pair.minSlider, pair.maxSlider, pair.minInput, pair.maxInput, pair.fill, pair.minValue, pair.maxValue);
                    criteriaList = buildCriteriaFromUI();
                    saveSettings();
                    tryAutoStartSearch();
                });
            }

            if (maxSlider) {
                maxSlider.addEventListener('input', () => {
                    updateSliderRange(pair.minSlider, pair.maxSlider, pair.minInput, pair.maxInput, pair.fill, pair.minValue, pair.maxValue);
                    criteriaList = buildCriteriaFromUI();
                    saveSettings();
                    tryAutoStartSearch();
                });
            }
        });

        // Sound toggle
        const soundToggle = document.getElementById('autojoin-sound-toggle');
        if (soundToggle) {
            soundToggle.checked = soundEnabled;
            soundToggle.addEventListener('change', () => {
                soundEnabled = soundToggle.checked;
                saveSettings();
            });
        }

        // Mode selector toggle
        const modeToggle = document.getElementById('join-mode-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('change', (e) => {
                joinMode = e.target.checked ? 'autojoin' : 'notify';
                updateModeLabels(e.target.checked);
                saveSettings();
                // Restart search if already running to apply mode change
                if (autoJoinEnabled && monitoringInterval) {
                    stopMonitoring();
                    startMonitoring();
                }
                // Update UI to reflect mode change
                updateUI();
            });
        }
        

        // Listen for leave-lobby event - restart search when user manually leaves
        document.addEventListener('leave-lobby', () => {
            if (autoJoinEnabled) {
                // Get the lobby ID that was just left
                // Try to get it from the current lobby display first
                let leftLobbyID = null;
                const publicLobby = document.querySelector('public-lobby');
                if (publicLobby && publicLobby.lobbies && publicLobby.lobbies.length > 0) {
                    const currentLobby = publicLobby.lobbies[0];
                    if (currentLobby && currentLobby.gameID) {
                        leftLobbyID = currentLobby.gameID;
                    }
                }
                // If not found in display, check joinedLobbies before clearing
                if (!leftLobbyID && joinedLobbies.size > 0) {
                    // Get the first (and likely only) lobby ID from the set
                    leftLobbyID = Array.from(joinedLobbies)[0];
                }
                if (leftLobbyID) {
                    recentlyLeftLobbyID = leftLobbyID;
                }
                // Clear joined lobbies to allow rejoining other lobbies
                joinedLobbies.clear();
                // Clear notified lobbies
                notifiedLobbies.clear();
                // Reset game found time
                gameFoundTime = null;
                lastNotifiedGameID = null;
                // Restart monitoring (this will reset the search timer)
                stopMonitoring();
                startMonitoring();
                saveSettings();
                updateUI();
            }
        });
    }

    // Load settings into UI
    function loadUIFromSettings() {
        // Load join mode
        const modeToggle = document.getElementById('join-mode-toggle');
        if (modeToggle) {
            modeToggle.checked = joinMode === 'autojoin';
            updateModeLabels(joinMode === 'autojoin');
        }

        // Load criteria into UI
        let teamCheckboxChecked = false;
        let teamMinPlayers = null;
        let teamMaxPlayers = null;

        for (const criteria of criteriaList) {
            if (criteria.gameMode === 'FFA') {
                const ffaCheckbox = document.getElementById('autojoin-ffa');
                if (ffaCheckbox) {
                    ffaCheckbox.checked = true;
                    const ffaConfig = document.getElementById('ffa-config');
                    if (ffaConfig) ffaConfig.style.display = 'block';

                    if (criteria.minPlayers) {
                        const minInput = document.getElementById('autojoin-ffa-min');
                        if (minInput) minInput.value = criteria.minPlayers;
                    }
                    if (criteria.maxPlayers) {
                        const maxInput = document.getElementById('autojoin-ffa-max');
                        if (maxInput) maxInput.value = criteria.maxPlayers;
                    }
                    // Initialize FFA slider from loaded values
                    initializeSlider('autojoin-ffa-min-slider', 'autojoin-ffa-max-slider', 'autojoin-ffa-min', 'autojoin-ffa-max', 'ffa-range-fill', 'ffa-min-value', 'ffa-max-value');
                }
            } else if (criteria.gameMode === 'Team') {
                // Mark team checkbox as checked (only once)
                if (!teamCheckboxChecked) {
                    const teamCheckbox = document.getElementById('autojoin-team');
                    if (teamCheckbox) {
                        teamCheckbox.checked = true;
                        teamCheckboxChecked = true;
                        const teamConfig = document.getElementById('team-config');
                        if (teamConfig) teamConfig.style.display = 'block';
                    }
                }

                // Store min/max players (they should be the same for all Team criteria)
                if (criteria.minPlayers !== null && criteria.minPlayers !== undefined) {
                    teamMinPlayers = criteria.minPlayers;
                }
                if (criteria.maxPlayers !== null && criteria.maxPlayers !== undefined) {
                    teamMaxPlayers = criteria.maxPlayers;
                }

                // Set team count checkbox (can have multiple)
                if (criteria.teamCount !== null && criteria.teamCount !== undefined) {
                    if (criteria.teamCount === 'Duos') {
                        const checkbox = document.getElementById('autojoin-team-duos');
                        if (checkbox) checkbox.checked = true;
                    } else if (criteria.teamCount === 'Trios') {
                        const checkbox = document.getElementById('autojoin-team-trios');
                        if (checkbox) checkbox.checked = true;
                    } else if (criteria.teamCount === 'Quads') {
                        const checkbox = document.getElementById('autojoin-team-quads');
                        if (checkbox) checkbox.checked = true;
                    } else if (typeof criteria.teamCount === 'number') {
                        const checkbox = document.getElementById(`autojoin-team-${criteria.teamCount}`);
                        if (checkbox) checkbox.checked = true;
                    }
                }
            }
        }

        // Set min/max players for Team (use the last values found, they should be consistent)
        if (teamCheckboxChecked) {
            if (teamMinPlayers !== null) {
                const minInput = document.getElementById('autojoin-team-min');
                if (minInput) minInput.value = teamMinPlayers;
            }
            if (teamMaxPlayers !== null) {
                const maxInput = document.getElementById('autojoin-team-max');
                if (maxInput) maxInput.value = teamMaxPlayers;
            }
            // Initialize Team slider from loaded values
            initializeSlider('autojoin-team-min-slider', 'autojoin-team-max-slider', 'autojoin-team-min', 'autojoin-team-max', 'team-range-fill', 'team-min-value', 'team-max-value');
        }
    }

    // Add CSS styles
    GM_addStyle(`
        .autojoin-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 460px;
            max-height: 90vh;
            overflow-y: auto;
            background: rgba(25, 25, 30, 0.85);
            border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 8px;
            padding: 0;
            z-index: 10000;
            color: rgba(255, 255, 255, 0.9);
            font-family: sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .autojoin-panel.hidden {
            display: none;
        }

        .autojoin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.3);
            padding: 8px 12px 6px 12px;
            cursor: grab;
            user-select: none;
        }

        .autojoin-header:active {
            cursor: grabbing;
        }

        .autojoin-content {
            padding: 0 12px 10px 12px;
        }

        .autojoin-header h3 {
            margin: 0;
            font-size: 1.05em;
            color: rgba(255, 255, 255, 0.95);
        }


        .autojoin-mode-section {
            margin-bottom: 8px;
            padding: 6px;
            background: rgba(59, 130, 246, 0.08);
            border-radius: 4px;
        }

        .mode-checkbox-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 6px;
            font-size: 0.95em;
            color: rgba(255, 255, 255, 0.95);
        }

        .mode-checkbox-label input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .autojoin-mode-config {
            margin-left: 26px;
            margin-top: 6px;
            padding: 6px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }


        .player-filter-info {
            margin-bottom: 6px;
            padding: 3px 0;
        }

        .player-filter-info small {
            color: rgba(255, 255, 255, 0.75);
            font-size: 0.9em;
        }

        .capacity-range-wrapper {
            margin-top: 6px;
        }

        .capacity-range-visual {
            position: relative;
            padding: 12px 0 6px 0;
        }

        .capacity-track {
            position: relative;
            height: 6px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 3px;
            margin-bottom: 8px;
        }

        .capacity-range-fill {
            position: absolute;
            height: 100%;
            background: rgba(59, 130, 246, 0.5);
            border-radius: 3px;
            pointer-events: none;
            opacity: 0.7;
            transition: left 0.1s ease, width 0.1s ease;
        }

        .capacity-slider {
            position: absolute;
            width: 100%;
            height: 6px;
            top: 0;
            left: 0;
            background: transparent;
            outline: none;
            -webkit-appearance: none;
            pointer-events: none;
            margin: 0;
        }

        .capacity-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.8);
            cursor: pointer;
            pointer-events: all;
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: transform 0.1s ease;
        }

        .capacity-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: rgba(96, 165, 250, 0.9);
        }

        .capacity-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.8);
            cursor: pointer;
            pointer-events: all;
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: transform 0.1s ease;
        }

        .capacity-slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            background: rgba(96, 165, 250, 0.9);
        }

        .capacity-slider-min {
            z-index: 2;
        }

        .capacity-slider-max {
            z-index: 1;
        }

        .capacity-labels {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
        }

        .capacity-label-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
        }

        .capacity-label-group label {
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.8);
            font-weight: normal;
            margin: 0;
        }

        .capacity-value {
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 500;
            min-width: 40px;
            text-align: center;
        }

        .capacity-inputs-hidden {
            display: none;
        }


        .team-mode-panel {
            margin-bottom: 12px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .team-mode-panel:last-child {
            margin-bottom: 0;
        }

        .fixed-modes-panel {
            border-color: rgba(147, 197, 253, 0.3);
        }

        .variable-modes-panel {
            border-color: rgba(16, 185, 129, 0.3);
        }

        .panel-header {
            margin-bottom: 6px;
        }

        .team-count-options {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin-top: 3px;
        }

        .team-count-options label {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.9);
        }

        .autojoin-status {
            margin: 8px 0;
            padding: 6px;
            background: rgba(59, 130, 246, 0.15);
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .status-label {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9em;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.8);
        }

        .status-indicator.active {
            background: rgba(16, 185, 129, 0.8);
            animation: pulse 1s infinite;
        }


        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .search-timer {
            margin-left: auto;
            font-size: 0.9em;
            color: rgba(147, 197, 253, 0.9);
            font-weight: 500;
        }

        .select-all-btn {
            background: rgba(59, 130, 246, 0.2);
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            padding: 3px 8px;
            flex: 1;
        }

        .select-all-btn:hover {
            background: rgba(59, 130, 246, 0.35);
        }

        .autojoin-settings {
            margin: 8px 0 0 0;
            padding: 6px;
            background: rgba(59, 130, 246, 0.08);
            border-radius: 4px;
        }

        .sound-toggle-label {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.9);
        }

        .sound-toggle-label input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        /* Remove any extra spacing/margins that might cause gray bar */
        .autojoin-status {
            margin-bottom: 8px;
        }

        .current-game-info {
            margin: 6px 0;
            padding: 5px 8px;
            background: rgba(59, 130, 246, 0.12);
            border-radius: 4px;
            font-size: 0.9em;
            color: rgba(147, 197, 253, 0.9);
            text-align: center;
            border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .current-game-info.not-applicable {
            background: rgba(100, 100, 100, 0.1);
            color: rgba(255, 255, 255, 0.5);
            border-color: rgba(100, 100, 100, 0.2);
            font-style: italic;
        }

        .join-mode-selector {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            padding: 6px;
            background: rgba(59, 130, 246, 0.08);
            border-radius: 4px;
            justify-content: center;
        }

        .mode-label-left,
        .mode-label-right {
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            user-select: none;
            transition: opacity 0.3s, color 0.3s;
        }

        .mode-label-left {
            opacity: 1;
            color: rgba(255, 255, 255, 0.95);
        }

        .mode-label-right {
            opacity: 0.6;
            color: rgba(255, 255, 255, 0.7);
        }

        .mode-toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
            cursor: pointer;
        }

        .mode-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .mode-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(59, 130, 246, 0.3);
            transition: 0.3s;
            border-radius: 26px;
        }

        .mode-toggle-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }

        .mode-toggle-switch input:checked + .mode-toggle-slider {
            background-color: rgba(16, 185, 129, 0.6);
        }

        .mode-toggle-switch input:checked + .mode-toggle-slider:before {
            transform: translateX(24px);
        }

        .mode-toggle-switch:hover .mode-toggle-slider {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        }

        .game-found-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: 3px solid #60a5fa;
            border-radius: 8px;
            padding: 20px 30px;
            z-index: 20000;
            color: white;
            font-family: sans-serif;
            font-size: 1.1em;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.5);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            min-width: 300px;
            max-width: 500px;
            animation: notificationPulse 2s infinite;
        }

        .game-found-notification.notification-visible {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }

        .game-found-notification.notification-dismissing {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }

        @keyframes notificationPulse {
            0%, 100% {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            50% {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 8px rgba(59, 130, 246, 0);
            }
        }

        .game-found-notification:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-color: #93c5fd;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 25px rgba(59, 130, 246, 0.7);
        }
    `);

    // Update panel visibility based on game state (URL-based detection)
    function updatePanelVisibility() {
        const panel = document.getElementById('openfront-autojoin-panel');
        if (!panel) return;

        const isLobby = isOnLobbyPage();
        const wasInGame = panel.dataset.wasInGame === 'true';

        if (!isLobby) {
            // In game → hide panel
            panel.classList.add('hidden');
            stopGameInfoUpdates(); // Stop updating game info when not in lobby
            // Dismiss notification when game starts
            dismissNotification();
            // If we just entered a game, disable auto-join only if we joined via auto-join mode
            if (!wasInGame) {
                // Play boxing ring bell sound when game starts
                playGameStartSound();
                // Only disable search if we joined via auto-join mode
                if (autoJoinEnabled && joinMode === 'autojoin') {
                    autoJoinEnabled = false;
                    stopMonitoring();
                    saveSettings();
                    updateUI();
                } else if (autoJoinEnabled && joinMode === 'notify') {
                    // In notify mode, keep search active (user manually joined)
                }
            }
            panel.dataset.wasInGame = 'true';
        } else {
            // In lobby → show panel and clear joined lobbies
            panel.classList.remove('hidden');
            startGameInfoUpdates(); // Start updating game info when in lobby
            joinedLobbies.clear(); // Clear to allow rejoining same lobby if needed

            // If we just returned to lobby, auto-start search in notify mode
            if (wasInGame) {
                // Always enable search when returning to lobby
                autoJoinEnabled = true;
                // Set to notify mode by default when returning to lobby
                joinMode = 'notify';
                // Update toggle and labels
                const modeToggle = document.getElementById('join-mode-toggle');
                if (modeToggle) {
                    modeToggle.checked = false;
                    updateModeLabels(false);
                }
                // Save settings and auto-start search if criteria exist
                saveSettings();
                updateUI();
                tryAutoStartSearch();
            }
            // Clear notified lobbies when returning to lobby
            notifiedLobbies.clear();
            lastNotifiedGameID = null;
            gameFoundTime = null;
            panel.dataset.wasInGame = 'false';
        }
    }

    // Observe URL changes to update panel visibility (event-based approach)
    function observeURL() {
        // Use popstate for browser navigation (back/forward buttons)
        window.addEventListener('popstate', updatePanelVisibility);

        // Use hashchange for hash changes
        window.addEventListener('hashchange', updatePanelVisibility);

        // Use pushstate/replacestate interception for programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(updatePanelVisibility, 0);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(updatePanelVisibility, 0);
        };

        // Initial check
        updatePanelVisibility();
    }

    // Initialize
    function init() {
        loadSettings();
        createUI();

        // Preload audio files
        preloadSounds();

        // Monitor URL changes to show/hide panel (event-based, more efficient)
        observeURL();
    }

    // Start when DOM is ready (immediate check like lobby_player_list.js)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Initialize immediately (no delay needed with URL-based detection)
        init();
    }

})();
