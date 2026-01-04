// ==UserScript==
// @name         X.com Profile Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Delete all your tweets and undo reposts from your X.com profile
// @author       d_g_t_l (https://x.com/d_g_t_l)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553223/Xcom%20Profile%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/553223/Xcom%20Profile%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let deletedCount = 0;
    let unrepostedCount = 0;
    let targetUsername = GM_getValue('targetUsername', '');

    // Draggable functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = GM_getValue('panelX', 0);
    let yOffset = GM_getValue('panelY', 0);

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    function waitForElementGone(element, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (!document.contains(element)) {
                return resolve();
            }

            const observer = new MutationObserver(() => {
                if (!document.contains(element)) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for element removal'));
            }, timeout);
        });
    }

    function isMyTweet(article) {
        if (article.hasAttribute('data-not-mine')) {
            return false;
        }

        if (!targetUsername) {
            return false;
        }

        const usernameElement = article.querySelector('[data-testid="User-Name"]');
        if (!usernameElement) {
            return false;
        }

        const usernameText = usernameElement.textContent;
        const hasUsername = usernameText.includes('@' + targetUsername);
        
        return hasUsername;
    }

    function isMyRepost(article) {
        const repostIndicator = article.querySelector('[data-testid="socialContext"]');
        if (repostIndicator && repostIndicator.textContent.includes('You reposted')) {
            return true;
        }
        return false;
    }

    function markAsNotMine(article) {
        article.setAttribute('data-not-mine', 'true');
        article.style.opacity = '0.3';
        console.log('Marked tweet as not mine');
    }

    function findDeleteButton() {
        const buttons = document.querySelectorAll('[role="button"], button');
        for (const button of buttons) {
            const text = button.textContent.toLowerCase().trim();
            if (text === 'delete') {
                return button;
            }
        }
        
        const confirmButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
        if (confirmButton) {
            return confirmButton;
        }
        
        return null;
    }

    async function clickDeleteConfirmation() {
        return new Promise((resolve) => {
            let clicked = false;
            
            const checkAndClick = () => {
                if (clicked) return;
                
                const deleteBtn = findDeleteButton();
                if (deleteBtn) {
                    clicked = true;
                    console.log('Clicking Delete confirmation');
                    deleteBtn.click();
                    observer.disconnect();
                    clearTimeout(timeoutId);
                    resolve(true);
                }
            };

            checkAndClick();
            
            if (clicked) return;

            const observer = new MutationObserver(() => {
                checkAndClick();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                if (!clicked) {
                    console.log('No confirmation dialog found');
                    resolve(false);
                }
            }, 3000);
        });
    }

    async function undoRepost(article) {
        try {
            console.log('Undoing repost');
            
            const repostButton = article.querySelector('[data-testid="unretweet"]');
            if (!repostButton) {
                console.log('Repost button not found');
                return false;
            }

            repostButton.click();

            await waitForElement('[role="menuitem"]', 3000);

            const menuItems = document.querySelectorAll('[role="menuitem"]');
            let undoItem = null;

            for (const item of menuItems) {
                const text = item.textContent.toLowerCase();
                if (text.includes('undo')) {
                    undoItem = item;
                    break;
                }
            }

            if (undoItem) {
                console.log('Clicking Undo repost');
                undoItem.click();
                
                await waitForElementGone(article, 5000);
                
                console.log('Repost undone');
                unrepostedCount++;
                updateCounter();
                return true;
            } else {
                console.log('Undo option not found');
                document.body.click();
                return false;
            }
        } catch (error) {
            console.error('Error undoing repost:', error);
            document.body.click();
            return false;
        }
    }

    async function deleteSingleTweet(moreButton) {
        try {
            const article = moreButton.closest('article[data-testid="tweet"]');
            if (!article) {
                console.log('Could not find article element');
                return false;
            }

            console.log('Clicking More button');
            moreButton.click();

            await waitForElement('[role="menuitem"]', 3000);

            const menuItems = document.querySelectorAll('[role="menuitem"]');
            let deleteMenuItem = null;

            for (const item of menuItems) {
                const text = item.textContent.toLowerCase();
                if (text.includes('delete')) {
                    deleteMenuItem = item;
                    break;
                }
            }

            if (deleteMenuItem) {
                console.log('Clicking Delete menu item');
                deleteMenuItem.click();

                await clickDeleteConfirmation();
                
                await waitForElementGone(article, 5000);
                
                console.log('Tweet deleted');
                deletedCount++;
                updateCounter();
                return true;
            } else {
                console.log('No Delete option, this is not my tweet');
                document.body.click();
                markAsNotMine(article);
                return false;
            }
        } catch (error) {
            console.error('Error deleting tweet:', error);
            document.body.click();
            return false;
        }
    }

    function findActionableItems() {
        const items = [];
        const articles = document.querySelectorAll('article[data-testid="tweet"]');
        
        for (const article of articles) {
            if (article.hasAttribute('data-not-mine')) {
                continue;
            }

            if (isMyRepost(article)) {
                const repostButton = article.querySelector('[data-testid="unretweet"]');
                if (repostButton) {
                    items.push({ type: 'repost', article, button: repostButton });
                }
            } else if (isMyTweet(article)) {
                const moreButton = article.querySelector('[data-testid="caret"]');
                if (moreButton) {
                    items.push({ type: 'tweet', article, button: moreButton });
                }
            }
        }
        
        return items;
    }

    async function processAllVisibleItems() {
        while (isRunning) {
            const items = findActionableItems();
            
            if (items.length === 0) {
                console.log('No items to process');
                return false;
            }

            console.log(`Found ${items.length} items to process`);
            
            const firstItem = items[0];
            
            if (firstItem.type === 'repost') {
                await undoRepost(firstItem.article);
            } else {
                await deleteSingleTweet(firstItem.button);
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    function waitForNewContent(currentCount, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const checkInterval = setInterval(() => {
                const newCount = findActionableItems().length;
                const elapsed = Date.now() - startTime;
                
                if (newCount > currentCount) {
                    console.log(`New items appeared: ${newCount - currentCount}`);
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (elapsed > timeout) {
                    console.log('Timeout waiting for new items');
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 200);
        });
    }

    async function scrollAndWait() {
        const currentCount = findActionableItems().length;
        console.log(`Scrolling down... Current items: ${currentCount}`);
        
        window.scrollTo(0, document.documentElement.scrollHeight);
        
        const loaded = await waitForNewContent(currentCount, 3000);
        return loaded;
    }

    function updateCounter() {
        countDisplay.textContent = `Deleted: ${deletedCount} | Unreposted: ${unrepostedCount}`;
    }

    function saveUsername() {
        const username = usernameInput.value.trim().replace('@', '');
        if (username) {
            targetUsername = username;
            GM_setValue('targetUsername', username);
            statusText.textContent = `Active for @${username}`;
            statusText.style.color = '#0f0';
            console.log('Username saved:', username);
        } else {
            statusText.textContent = 'Enter username first!';
            statusText.style.color = '#f00';
        }
    }

    async function toggleDeleting() {
        if (!targetUsername) {
            statusText.textContent = 'Enter username first!';
            statusText.style.color = '#f00';
            return;
        }

        if (isRunning) {
            isRunning = false;
            toggleBtn.textContent = 'Start Cleaning';
            toggleBtn.style.background = '#fff';
            toggleBtn.style.color = '#1d9bf0';
            console.log('Stopped');
            return;
        }

        isRunning = true;
        toggleBtn.textContent = 'Stop';
        toggleBtn.style.background = '#fff';
        toggleBtn.style.color = '#f00';
        console.log('Starting deletion...');

        let noNewContentCount = 0;

        while (isRunning) {
            await processAllVisibleItems();
            
            if (!isRunning) break;

            const hasMore = findActionableItems().length > 0;
            
            if (!hasMore) {
                const loaded = await scrollAndWait();
                
                if (!loaded) {
                    noNewContentCount++;
                    if (noNewContentCount >= 3) {
                        console.log('No more items to load');
                        statusText.textContent = 'Finished cleaning!';
                        statusText.style.color = '#0f0';
                        break;
                    }
                } else {
                    noNewContentCount = 0;
                }
            }
        }

        isRunning = false;
        toggleBtn.textContent = 'Start Cleaning';
        toggleBtn.style.background = '#fff';
        toggleBtn.style.color = '#1d9bf0';
        console.log('Finished');
    }

    // Draggable functions
    function dragStart(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        isDragging = true;
        controlPanel.style.cursor = 'grabbing';
        document.body.style.overflow = 'hidden';
        document.body.style.userSelect = 'none';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, controlPanel);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            controlPanel.style.cursor = 'grab';
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
            
            // Save position
            GM_setValue('panelX', xOffset);
            GM_setValue('panelY', yOffset);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: #1d9bf0;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
        min-width: 250px;
        cursor: grab;
        user-select: none;
        touch-action: none;
    `;

    // Set initial position
    setTranslate(xOffset, yOffset, controlPanel);

    // Add drag event listeners
    controlPanel.addEventListener('mousedown', dragStart, { passive: false });
    controlPanel.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('mousemove', drag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd, { passive: false });
    document.addEventListener('touchend', dragEnd, { passive: false });

    // Drag handle indicator
    const dragHandle = document.createElement('div');
    dragHandle.textContent = '⋮⋮';
    dragHandle.style.cssText = `
        color: rgba(255,255,255,0.5);
        font-size: 16px;
        text-align: center;
        letter-spacing: 2px;
        margin: -5px 0 5px 0;
        cursor: grab;
        touch-action: none;
    `;

    // Username input
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Enter your username';
    usernameInput.value = targetUsername;
    usernameInput.style.cssText = `
        padding: 8px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: text;
    `;

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Username';
    saveBtn.style.cssText = `
        padding: 8px 15px;
        background: #fff;
        color: #1d9bf0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
    `;
    saveBtn.onclick = saveUsername;

    // Status text
    const statusText = document.createElement('div');
    statusText.textContent = targetUsername ? `Active for @${targetUsername}` : 'No username set';
    statusText.style.cssText = `
        color: ${targetUsername ? '#0f0' : '#fff'};
        font-weight: bold;
        font-size: 12px;
        text-align: center;
    `;

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Start Cleaning';
    toggleBtn.style.cssText = `
        padding: 10px 20px;
        background: #fff;
        color: #1d9bf0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
    `;
    toggleBtn.onclick = toggleDeleting;

    // Counter display
    const countDisplay = document.createElement('div');
    countDisplay.textContent = `Deleted: ${deletedCount} | Unreposted: ${unrepostedCount}`;
    countDisplay.style.cssText = `
        color: #fff;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
    `;

    // Divider
    const divider = document.createElement('hr');
    divider.style.cssText = `
        border: none;
        border-top: 1px solid rgba(255,255,255,0.3);
        margin: 5px 0;
    `;

    controlPanel.appendChild(dragHandle);
    controlPanel.appendChild(usernameInput);
    controlPanel.appendChild(saveBtn);
    controlPanel.appendChild(statusText);
    controlPanel.appendChild(divider);
    controlPanel.appendChild(toggleBtn);
    controlPanel.appendChild(countDisplay);
    document.body.appendChild(controlPanel);

    console.log('X.com Profile Cleaner loaded. Enter your username to start.');
})();

