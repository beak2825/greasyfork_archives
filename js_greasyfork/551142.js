// ==UserScript==
// @name         SSH XL Auto Responder & Urgent Room Opener
// @namespace    GreenMan36
// @version      1.0
// @description  Automatically respond to SSH XL rooms and quickly open the 7 most urgent listings. Speeds up your student housing search!
// @author       GreenMan36
// @match        https://www.sshxl.nl/nl/aanbod*
// @grant        none
// @license      MIT
// @homepage     https://github.com/GreenMan36
// @icon         https://www.sshxl.nl/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/551142/SSH%20XL%20Auto%20Responder%20%20Urgent%20Room%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/551142/SSH%20XL%20Auto%20Responder%20%20Urgent%20Room%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('SSH XL: Script starting...');
    console.log('SSH XL: Current URL is:', window.location.href);
    console.log('SSH XL: Current pathname is:', window.location.pathname);

    // AUTO-RESPONSE FUNCTIONALITY FOR INDIVIDUAL ROOM PAGES
    function isRoomPage() {
        const pathname = window.location.pathname;
        const aanbodMatch = pathname.match(/\/aanbod\/(.+)/);
        const hasRoomId = aanbodMatch && aanbodMatch[1] && aanbodMatch[1].trim() !== '';

        return hasRoomId;
    }

    // Wait for rooms to load on main page
    function waitForCards() {
        const cards = document.querySelectorAll('.card--property');

        if (cards.length > 0) {
            addUrgentOpenerButton();
        } else {
            setTimeout(waitForCards, 1000);
        }
    }

    // Add a floating button to trigger the urgent room opener
    function addUrgentOpenerButton() {
        // Remove existing button if present
        const existingButton = document.getElementById('ssh-urgent-opener');
        if (existingButton) existingButton.remove();

        const button = document.createElement('button');
        button.id = 'ssh-urgent-opener';
        button.innerHTML = '🏠 Open 7 Most Urgent';
        button.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.onmouseover = () => {
            button.style.background = '#c82333';
            button.style.transform = 'scale(1.05)';
        };
        button.onmouseout = () => {
            button.style.background = '#dc3545';
            button.style.transform = 'scale(1)';
        };

        button.onclick = openUrgentRoomsInteractive;

        document.body.appendChild(button);
    }

    function openUrgentRooms() {
        const cards = document.querySelectorAll('.card--property');

        if (cards.length === 0) {
            console.log('No property cards found on this page');
            return [];
        }

        console.log(`Found ${cards.length} total rooms`);

        // Take the last 7 cards (most urgent according to page ordering)
        const urgentCards = Array.from(cards).slice(-7);

        console.log(`Taking the last ${urgentCards.length} rooms (most urgent):`);

        // Extract data and open tabs
        const urgentRooms = urgentCards.map((card, index) => {
            const link = card.querySelector('.card__link');
            const timeElement = card.querySelector('.card__footer p');
            const title = card.querySelector('.card__title')?.textContent.trim() || 'Unknown';
            const price = card.querySelector('.price-tag')?.textContent.trim() || 'Unknown';

            if (!link || !timeElement) {
                console.log(`Card ${index}: Missing link or time element`);
                return null;
            }

            const href = link.getAttribute('href');
            const timeText = timeElement.textContent.trim();
            const fullUrl = window.location.origin + href;

            console.log(`${index + 1}. ${title} - ${price} - ${timeText}`);

            // Open in new tab with small delay
            setTimeout(() => {
                window.open(fullUrl, '_blank');
            }, index * 300);

            return {
                href: href,
                timeText: timeText,
                title: title,
                price: price
            };
        }).filter(room => room !== null);

        return urgentRooms;
    }

    function createRoomOverlay(urgentRooms) {
        // Remove existing overlay if present
        const existingOverlay = document.getElementById('urgent-rooms-overlay');
        if (existingOverlay) existingOverlay.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'urgent-rooms-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <h2 style="margin-top: 0; color: #333;">🏠 7 Most Urgent Rooms</h2>
            <p style="color: #666; margin-bottom: 20px;">Click to open each room in a new tab:</p>
            <div id="room-buttons"></div>
            <button id="close-overlay" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                float: right;
            ">Close</button>
            <div style="clear: both;"></div>
        `;

        const buttonContainer = content.querySelector('#room-buttons');

        // Add button for each room
        urgentRooms.forEach((room, index) => {
            const button = document.createElement('button');
            button.style.cssText = `
                display: block;
                width: 100%;
                text-align: left;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s;
            `;

            button.innerHTML = `
                <strong>${index + 1}. ${room.title}</strong><br>
                <span style="color: #28a745; font-weight: bold;">${room.price}</span><br>
                <span style="color: #dc3545; font-size: 0.9em;">${room.timeText}</span>
            `;

            button.onmouseover = () => button.style.backgroundColor = '#e9ecef';
            button.onmouseout = () => button.style.backgroundColor = '#f8f9fa';

            button.onclick = () => {
                const fullUrl = window.location.origin + room.href;
                window.open(fullUrl, '_blank');
                button.style.backgroundColor = '#d4edda';
                button.innerHTML += '<br><span style="color: #155724; font-size: 0.8em;">✓ Opened</span>';
            };

            buttonContainer.appendChild(button);
        });

        content.querySelector('#close-overlay').onclick = () => overlay.remove();
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }

    function openUrgentRoomsInteractive() {
        const urgentRooms = openUrgentRooms();

        if (urgentRooms.length === 0) {
            alert('No rooms found! Make sure the page has loaded completely.');
            return;
        }

        console.log('\n🚨 If tabs didn\'t open automatically, use the overlay to click each room manually, this might be a bug.');

        createRoomOverlay(urgentRooms);

        const button = document.getElementById('ssh-urgent-opener');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Opened!';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '#dc3545';
            }, 3000);
        }
    }

    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const cards = document.querySelectorAll('.card--property');
                    if (cards.length > 0 && !document.getElementById('ssh-urgent-opener')) {
                        console.log('Changes detected, re-adding urgent room button.');
                        addUrgentOpenerButton();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // for the room page
    function waitForReactButton() {
        return new Promise((resolve, reject) => {
            const maxWaitTime = 30000; // 30 seconds max wait
            const startTime = Date.now();

            function checkForButton() {
                console.log('SSH XL: Checking for "Reageer op deze kamer/woning" button...');

                // Try multiple selectors, idk which one worked in the end and am too lazy
                const selectors = [
                    '.pageheader__actions button',
                    'button[class*="button"]',
                    'button'
                ];

                let reactButton = null;
                let allButtons = [];

                for (const selector of selectors) {
                    const buttons = document.querySelectorAll(selector);
                    console.log(`SSH XL: Found ${buttons.length} buttons with selector "${selector}"`);

                    buttons.forEach((btn, index) => {
                        const text = btn.textContent || btn.innerText || '';
                        console.log(`SSH XL: Button ${index}: "${text.trim()}"`);
                        allButtons.push({selector, index, text: text.trim()});

                        if (text.includes('Reageer op deze kamer') || text.includes('Reageer op deze woning')) {
                            console.log('SSH XL: Found "Reageer op deze kamer/woning" button!');
                            reactButton = btn;
                        }
                    });
                }

                if (reactButton) {
                    resolve(reactButton);
                    return;
                }

                console.log('SSH XL: All buttons found:', allButtons);

                if (Date.now() - startTime > maxWaitTime) {
                    console.log('Timeout waiting for "Reageer op deze kamer/woning" button');
                    reject(new Error('Timeout waiting for react button'));
                    return;
                }

                setTimeout(checkForButton, 2000);
            }

            checkForButton();

          // might be redundant but idc, gotta refactor whenever but it works so who cares
            const observer = new MutationObserver((mutations) => {
                console.log('DOM mutation detected, checking for button...');
                const reactButton = document.querySelector('.pageheader__actions button');
                if (reactButton && (reactButton.textContent.includes('Reageer op deze kamer') || reactButton.textContent.includes('Reageer op deze woning'))) {
                    console.log('Found "Reageer op deze kamer/woning" button via observer!');
                    observer.disconnect();
                    resolve(reactButton);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Clean up observer on timeout
            setTimeout(() => {
                observer.disconnect();
            }, maxWaitTime);
        });
    }

    function waitForConfirmButton() {
        return new Promise((resolve, reject) => {
            const maxWaitTime = 10000;
            const startTime = Date.now();

            function checkForConfirmButton() {
                const confirmButton = document.querySelector('.modal__footer .button--primary');

                if (confirmButton && confirmButton.textContent.includes('Bevestigen')) {
                    resolve(confirmButton);
                    return;
                }

                if (Date.now() - startTime > maxWaitTime) {
                    reject(new Error('Timeout waiting for confirm button'));
                    return;
                }

                setTimeout(checkForConfirmButton, 200);
            }

            checkForConfirmButton();

          // might be redundant but idc, gotta refactor whenever but it works so who cares
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const confirmButton = document.querySelector('.modal__footer .button--primary');
                        if (confirmButton && confirmButton.textContent.includes('Bevestigen')) {
                            console.log('SSH XL: Found "Bevestigen" button via observer!');
                            observer.disconnect();
                            resolve(confirmButton);
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
            }, maxWaitTime);
        });
    }

    async function clickReactButton(button) {
        addClickIndicator('Clicking "Reageer" button...', '#ff6b35');

        button.click();

        try {
            const confirmButton = await waitForConfirmButton();
            clickConfirmButton(confirmButton);
        } catch (error) {
            updateClickIndicator('❌ Error: Modal not found', '#dc3545');
        }
    }

    function clickConfirmButton(button) {
        // Update visual indicator
        updateClickIndicator('Clicking "Bevestigen"...', '#28a745');

        button.click();

        // Show success message
        setTimeout(() => {
            updateClickIndicator('✅ Response submitted!', '#28a745');
            setTimeout(() => {
                removeClickIndicator();
            }, 3000);
        }, 1000);
    }

    function addClickIndicator(message, color) {
        // Remove existing indicator
        removeClickIndicator();

        const indicator = document.createElement('div');
        indicator.id = 'ssh-click-indicator';
        indicator.innerHTML = message;
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(indicator);
    }

    function updateClickIndicator(message, color) {
        const indicator = document.getElementById('ssh-click-indicator');
        if (indicator) {
            indicator.innerHTML = message;
            indicator.style.background = color;
        }
    }

    function removeClickIndicator() {
        const indicator = document.getElementById('ssh-click-indicator');
        if (indicator) indicator.remove();
    }

    // Initialize based on page type
    const roomPageCheck = isRoomPage();
    console.log('=== PAGE DETECTION COMPLETE ===');
    if (roomPageCheck) {
        console.log('❌ DETECTED ROOM PAGE - waiting for react button...');
        async function startAutoResponse() {
            try {
                addClickIndicator('Waiting for react button to load...', '#6c757d');
                const reactButton = await waitForReactButton();
                console.log('✅ REACT BUTTOn LOADED - applying for room now...');
                clickReactButton(reactButton);
            } catch (error) {
                updateClickIndicator('❌ Page load timeout', '#dc3545');
                setTimeout(removeClickIndicator, 5000);
            }
        }

        startAutoResponse();

    } else {
        console.log('❌ DETECTED LISTING PAGE - adding urgent opener...');

        // Initialize when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ LISTING PAGE LOADED - waiting a bit before activating...');
                setTimeout(waitForCards, 2000); // Give extra time for content
                observePageChanges();
            });
        } else {
            console.log('✅ LISTING PAGE AlREADY LOADED - Activating...');
            setTimeout(waitForCards, 2000);
            observePageChanges();
        }
    }

})();