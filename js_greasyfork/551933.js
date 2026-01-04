// ==UserScript==
// @name         Torn.com Recruit Button
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add a Recruit button to player menus with green R icons
// @author       Glitchey
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551933/Torncom%20Recruit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551933/Torncom%20Recruit%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables to track recruited players
    let recruitedPlayers = new Set();

    // Load recruited players from localStorage
    function loadRecruitedPlayers() {
        try {
            const stored = localStorage.getItem('tornRecruitedPlayers');
            if (stored) {
                const recruitedArray = JSON.parse(stored);
                recruitedPlayers = new Set(recruitedArray.map(player => player.id));
                console.log('Loaded recruited players:', recruitedArray.length);
            }
        } catch (error) {
            console.error('Error loading recruited players:', error);
        }
    }

    // Add a player to the recruited list with full details
    function addRecruitedPlayer(playerId, username) {
        try {
            const stored = localStorage.getItem('tornRecruitedPlayers');
            let recruitedArray = [];

            if (stored) {
                recruitedArray = JSON.parse(stored);
            }

            // Check if player already exists
            const existingIndex = recruitedArray.findIndex(player => player.id === playerId);

            if (existingIndex >= 0) {
                // Update existing player info
                recruitedArray[existingIndex].username = username;
                recruitedArray[existingIndex].lastRecruited = new Date().toISOString();
            } else {
                // Add new player
                recruitedArray.push({
                    id: playerId,
                    username: username,
                    dateRecruited: new Date().toISOString()
                });
            }

            localStorage.setItem('tornRecruitedPlayers', JSON.stringify(recruitedArray));
            recruitedPlayers.add(playerId);

            console.log('Added recruited player:', username, playerId);
            console.log('Total recruited players in storage:', recruitedArray.length);
        } catch (error) {
            console.error('Error adding recruited player:', error);
        }
    }

    // Recruitment message
    const recruitmentMessage = `Join BETA JUVI BATTLE CLAN faction. For newer players who want to learn and we're here to help. Answer questions and friendly group of people. We usually train for 1 week and war the next week. Want to make money warring is what you want to be doing and we'll help you along. We've also got a Xanax loaning system for newer players to level and train quicker to be paid back after you get war payouts. This is our entry faction for newer players to grown and learn before being promoted to our higher factions based on what your goals are in the game.

Hope to see your application.

https://www.torn.com/factions.php?step=profile&ID=53956`;

    function addRecruitmentIcons() {
        // Find all player list items
        const playerListItems = document.querySelectorAll('li[class^="user"]');

        playerListItems.forEach(playerItem => {
            const className = playerItem.className;
            const userIdMatch = className.match(/user(\d+)/);

            if (userIdMatch) {
                const userId = userIdMatch[1];

                // Check if we've already added the recruitment icon
                if (!playerItem.querySelector('.recruitment-icon')) {
                    addRecruitmentIconToPlayer(playerItem, userId);
                }
            }
        });
    }

    function addRecruitmentIconToPlayer(playerItem, userId) {
        // Find the icons wrapper where we want to add our icon
        const iconsWrap = playerItem.querySelector('.icons-wrap.icons ul');

        if (iconsWrap) {
            // Check if this player has been recruited
            const isRecruited = recruitedPlayers.has(userId);

            // Get player name from the player item
            const playerNameLink = playerItem.querySelector('a[href*="/profiles.php?XID="]');
            const playerName = playerNameLink ? playerNameLink.textContent.trim() : 'Unknown Player';

            // Create a simple div element that bypasses Torn's icon CSS entirely
            const recruitmentIcon = document.createElement('div');
            recruitmentIcon.className = 'recruitment-icon';
            recruitmentIcon.title = isRecruited ? 'Recruited message sent' : 'Click to mark as recruited';
            recruitmentIcon.style.cssText = `
                background: ${isRecruited ? '#27ae60' : '#95a5a6'} !important;
                color: white !important;
                width: 16px !important;
                height: 16px !important;
                border-radius: 2px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                font-size: 12px !important;
                font-family: Arial, sans-serif !important;
                margin: 0 2px !important;
                vertical-align: middle !important;
                border: none !important;
                box-shadow: none !important;
                position: relative !important;
                top: 0 !important;
                cursor: ${isRecruited ? 'default' : 'pointer'} !important;
                opacity: ${isRecruited ? '1' : '0.8'} !important;
            `;
            recruitmentIcon.textContent = 'R';

            // Add click handler for non-recruited players
            if (!isRecruited) {
                recruitmentIcon.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Mark as recruited
                    addRecruitedPlayer(userId, playerName);

                    // Update icon appearance
                    this.style.background = '#27ae60';
                    this.style.cursor = 'default';
                    this.style.opacity = '1';
                    this.title = 'Recruited message sent';

                    // Remove click handler
                    this.replaceWith(this.cloneNode(true));

                    console.log('Manually marked as recruited:', playerName, userId);
                });

                // Add hover effect for clickable icons
                recruitmentIcon.addEventListener('mouseenter', function() {
                    if (!recruitedPlayers.has(userId)) {
                        this.style.background = '#7f8c8d';
                    }
                });

                recruitmentIcon.addEventListener('mouseleave', function() {
                    if (!recruitedPlayers.has(userId)) {
                        this.style.background = '#95a5a6';
                    }
                });
            }

            // Insert it right after the icons UL, but make it stay on the same line
            const iconsContainer = iconsWrap.parentNode;
            iconsContainer.style.display = 'inline-flex';
            iconsContainer.style.alignItems = 'center';
            iconsContainer.appendChild(recruitmentIcon);

            console.log('Added recruitment icon for user:', userId, isRecruited ? '(recruited)' : '(not recruited)');
        }
    }

    function addRecruitButton() {
        console.log('Looking for player name elements...');

        // Find the player name span and the action button container
        const playerNameSpan = document.querySelector('.title___Bmq5P');
        const actionButton = document.querySelector('.actionButton___x3Hlp.enabled___rxiMF');

        console.log('Player name span:', playerNameSpan);
        console.log('Action button container:', actionButton);

        if (playerNameSpan && actionButton && !document.getElementById('recruit-button')) {
            const playerName = playerNameSpan.textContent.trim();
            console.log('Found player name:', playerName);

            // Get player ID from the avatar link
            const avatarLink = actionButton.querySelector('a[data-label="avatar"]');
            let playerId = '';
            if (avatarLink && avatarLink.href) {
                const match = avatarLink.href.match(/XID=(\d+)/);
                playerId = match ? match[1] : '';
            }
            console.log('Player ID:', playerId);

            // Check if we've already recruited this player
            const alreadyRecruited = recruitedPlayers.has(playerId);

            // Create a small recruit button
            const recruitButton = document.createElement('button');
            recruitButton.id = 'recruit-button';
            recruitButton.type = 'button';
            recruitButton.textContent = alreadyRecruited ? '✓' : 'R';
            recruitButton.title = alreadyRecruited ? 'Already recruited ' + playerName : 'Recruit ' + playerName;

            // Style the button to be small and fit next to the name
            const buttonColor = alreadyRecruited ? '#95a5a6' : '#27ae60';
            const hoverColor = alreadyRecruited ? '#7f8c8d' : '#2ecc71';

            recruitButton.style.cssText = `
                background: ${buttonColor};
                color: white;
                border: none;
                border-radius: 3px;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: bold;
                cursor: ${alreadyRecruited ? 'default' : 'pointer'};
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
                opacity: ${alreadyRecruited ? '0.7' : '1'};
            `;

            if (!alreadyRecruited) {
                // Add hover effect only if not already recruited
                recruitButton.addEventListener('mouseenter', function() {
                    this.style.background = hoverColor;
                });

                recruitButton.addEventListener('mouseleave', function() {
                    this.style.background = buttonColor;
                });

                // Add click handler
                recruitButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the dropdown
                    console.log('Recruit button clicked for:', playerName, 'ID:', playerId);

                    // Find the textarea
                    const textarea = document.querySelector('.textarea___V8HsV');
                    if (textarea) {
                        // Paste the recruitment message
                        textarea.value = recruitmentMessage;
                        textarea.focus();

                        // Trigger input event to notify any listeners
                        const inputEvent = new Event('input', { bubbles: true });
                        textarea.dispatchEvent(inputEvent);

                        // Add this player to recruited list with full details
                        addRecruitedPlayer(playerId, playerName);

                        // Update button appearance
                        this.textContent = '✓';
                        this.title = 'Already recruited ' + playerName;
                        this.style.background = '#95a5a6';
                        this.style.cursor = 'default';
                        this.style.opacity = '0.7';

                        // Remove hover effects
                        this.replaceWith(this.cloneNode(true));

                        // Add recruitment icons to any visible player lists
                        setTimeout(() => {
                            addRecruitmentIcons();
                        }, 100);

                        console.log('Recruitment message pasted for:', playerName);
                        console.log('Total recruited players:', recruitedPlayers.size);

                    } else {
                        console.log('Could not find textarea to paste message');
                        alert('Could not find message input box. Make sure you\'re on a messaging page.');
                    }
                });
            }

            // Insert the button right after the player name span
            playerNameSpan.parentNode.insertBefore(recruitButton, playerNameSpan.nextSibling);

            console.log('Recruit button added next to player name');

        } else if (!playerNameSpan) {
            console.log('Could not find player name span');
        } else if (!actionButton) {
            console.log('Could not find action button container');
        } else {
            console.log('Recruit button already exists');
        }
    }

    // Initialize the script
    function init() {
        // Load recruited players from localStorage first
        loadRecruitedPlayers();

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addRecruitButton();
                addRecruitmentIcons();
            });
        } else {
            addRecruitButton();
            addRecruitmentIcons();
        }

        // Also watch for dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        addRecruitButton();
                        addRecruitmentIcons();
                    }, 500);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();
})();