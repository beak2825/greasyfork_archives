// ==UserScript==
// @name         知乎悬停卡片快速屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将知乎悬停卡片中的「关注用户」按钮替换为「屏蔽用户」按钮
// @author       sx349
// @match        https://*.zhihu.com/*
// @match        https://zhihu.com/*
// @grant        GM_xmlhttpRequest
// @connect      zhihu.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557811/%E7%9F%A5%E4%B9%8E%E6%82%AC%E5%81%9C%E5%8D%A1%E7%89%87%E5%BF%AB%E9%80%9F%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557811/%E7%9F%A5%E4%B9%8E%E6%82%AC%E5%81%9C%E5%8D%A1%E7%89%87%E5%BF%AB%E9%80%9F%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get CSRF token from cookies
    function getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === '_xsrf') {
                return value;
            }
        }
        return '';
    }

    // Function to block user
    function blockUser(userUrl, button) {
        // Extract username from URL like "zhihu.com/people/xxx"
        const match = userUrl.match(/zhihu\.com\/people\/([^\/\?]+)/);
        if (!match) {
            console.error('Could not extract username from URL:', userUrl);
            return;
        }

        const username = match[1];
        const blockUrl = `https://www.zhihu.com/api/v4/members/${username}/actions/block`;
        const csrfToken = getCsrfToken();

        // Update button to show loading state
        const originalText = button.textContent;
        button.textContent = '屏蔽中...';
        button.style.pointerEvents = 'none';

        GM_xmlhttpRequest({
            method: 'POST',
            url: blockUrl,
            headers: {
                'accept': '*/*',
                'content-length': '0',
                'content-type': 'application/json',
                'x-xsrftoken': csrfToken,
                'x-requested-with': 'fetch',
                'origin': 'https://www.zhihu.com',
                'referer': userUrl
            },
            onload: function(response) {
                // 200 and 204 are both success responses
                if (response.status === 200 || response.status === 204) {
                    button.textContent = '已屏蔽';
                    console.log('[Zhihu Block] User blocked successfully:', username);
                } else {
                    button.textContent = '屏蔽失败';
                    console.error('[Zhihu Block] Failed to block user:', response.status, response.responseText);
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.pointerEvents = 'auto';
                    }, 2000);
                }
            },
            onerror: function(error) {
                button.textContent = '屏蔽失败';
                console.error('[Zhihu Block] Error blocking user:', error);
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    }

    // Function to modify hover card
    function modifyHoverCard(hoverCardItem) {

        // Get the parent container (which contains the HoverCard-items)
        const container = hoverCardItem.parentElement;
        if (!container) {
            console.log('[Zhihu Block] No parent container found');
            return;
        }

        // Prevent modifying the same container multiple times
        if (container.dataset.blockModified) {
            return;
        }
        container.dataset.blockModified = 'true';

        // Find the UserLink to get user URL
        const userLink = container.querySelector('.UserLink a[href*="/people/"]');
        if (!userLink) {
            console.log('[Zhihu Block] UserLink not found');
            return;
        }

        const userUrl = userLink.href;

        // Find all HoverCard-item divs
        const hoverCardItems = container.querySelectorAll('.HoverCard-item');

        // Determine which HoverCard-item to use:
        // - If there's only 1, use it
        // - If there are 2, use the second one
        let targetHoverCardItem;
        if (hoverCardItems.length === 1) {
            targetHoverCardItem = hoverCardItems[0];
        } else if (hoverCardItems.length >= 2) {
            targetHoverCardItem = hoverCardItems[1];
        } else {
            console.log('[Zhihu Block] No HoverCard-item found');
            return;
        }

        // Find the child with class containing "ButtonGroup" or "HoverCard-buttons"
        const buttonGroup = Array.from(targetHoverCardItem.children).find(child =>
            child.className.includes('ButtonGroup') || child.className.includes('HoverCard-buttons')
        );

        if (!buttonGroup) {
            console.log('[Zhihu Block] ButtonGroup not found');
            return;
        }

        // Find the first button in the ButtonGroup
        const firstButton = buttonGroup.querySelector('button');
        if (!firstButton) {
            console.log('[Zhihu Block] No button found in ButtonGroup');
            return;
        }

        // Replace its behavior
        firstButton.style.cursor = 'pointer';
        firstButton.textContent = '屏蔽用户';

        // Remove any existing click handlers by cloning
        const newButton = firstButton.cloneNode(true);
        firstButton.parentNode.replaceChild(newButton, firstButton);

        // Add new click handler
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            blockUser(userUrl, newButton);
        });

        console.log('[Zhihu Block] ✓ Hover card successfully modified for user:', userUrl);
    }

    // Observer to watch for hover cards appearing
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if this is a HoverCard-item
                    if (node.classList && node.classList.contains('HoverCard-item')) {
                        modifyHoverCard(node);
                    }
                    // Also check descendants
                    const hoverCardItems = node.querySelectorAll && node.querySelectorAll('.HoverCard-item');
                    if (hoverCardItems && hoverCardItems.length > 0) {
                        hoverCardItems.forEach(modifyHoverCard);
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also check for hover cards periodically (in case they're shown/hidden, not added/removed)
    setInterval(() => {
        const hoverCardItems = document.querySelectorAll('.HoverCard-item');
        if (hoverCardItems.length > 0) {
            hoverCardItems.forEach(modifyHoverCard);
        }
    }, 500);

    console.log('==================================================');
    console.log('[Zhihu Block] Script loaded and active!');
    console.log('[Zhihu Block] Watching for hover cards...');
    console.log('==================================================');
})();