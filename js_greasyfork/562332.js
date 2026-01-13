// ==UserScript==
// @name         Pornhub Block User by Menu Click
// @namespace    https://github.com/danmaclann
// @version      1.1
// @license      MIT
// @description  Adds "Block user" to video menu via event interception, hides persistently
// @author       danmaclann
// @match        https://*.pornhub.com/*
// @grant        none
// @run-at       document-start
// @icon         https://ei.phncdn.com/www-static/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/562332/Pornhub%20Block%20User%20by%20Menu%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/562332/Pornhub%20Block%20User%20by%20Menu%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedUsers = JSON.parse(localStorage.getItem('phBlockedUsers') || '[]');

    function saveBlocked() {
        localStorage.setItem('phBlockedUsers', JSON.stringify(blockedUsers));
    }

    function hideBlockedVideos() {
        document.querySelectorAll('li[data-video-id], .videoBox, .pcVideoListItem').forEach(li => {
            const userLink = li.querySelector('a[href*="/model/"], a[href*="/channels/"], a[href*="/users/"], .usernameWrap a');
            if (userLink && blockedUsers.includes(userLink.textContent.trim())) {
                li.remove();
            }
        });
    }

    const observer = new MutationObserver(hideBlockedVideos);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideBlockedVideos);
    } else {
        hideBlockedVideos();
    }

    function initMenuHandler() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.moreActionMenuButton');
            if (!btn) return;

            const videoId = btn.dataset.videoId;
            if (!videoId) return;

            // Small delay to let menu render
            setTimeout(() => {
                const vMenu = document.querySelector(`v-more-action-menu[id="${videoId}"]`);
                if (!vMenu) return;

                const menuDiv = vMenu.querySelector('.moreActionMenu');
                if (!menuDiv || menuDiv.querySelector('.ph-block-user-link')) return;

                // Find uploader
                const uploaderName = vMenu.getAttribute('title')?.trim() || btn.closest('li')?.querySelector('.usernameWrap a')?.textContent?.trim();
                if (!uploaderName) return;

                const blockLink = document.createElement('a');
                blockLink.className = 'moreActionLink ph-block-user-link gtm-event-actionmenu';
                blockLink.dataset.name = 'Block user';
                blockLink.dataset.videoId = videoId;
                blockLink.dataset.label = 'block_user';
                blockLink.innerHTML = '<span class="ph-icon-cancel"></span> <span class="label">Block User</span>'.replace('User', uploaderName);
                blockLink.style.color = '#f55';

                blockLink.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (!blockedUsers.includes(uploaderName)) {
                        blockedUsers.push(uploaderName);
                        saveBlocked();
                    }
                    const li = document.querySelector(`li[data-video-id="${videoId}"], #v${videoId}`);
                    if (li) li.remove();
                    // Close menu
                    btn.click();
                });

                const notInt = menuDiv.querySelector('.notInterestedLink');
                if (notInt) {
                    notInt.insertAdjacentElement('afterend', blockLink);
                } else {
                    menuDiv.appendChild(blockLink);
                }
            }, 50);
        }, true); // Capture phase
    }

    initMenuHandler();

    // Also try adding to existing menus periodically
    setInterval(() => {
        document.querySelectorAll('v-more-action-menu[id]').forEach(el => {
            if (!el.querySelector('.ph-block-user-link')) {
                const menuDiv = el.querySelector('.moreActionMenu');
                if (menuDiv) {
                    // Reuse logic above if needed
                }
            }
        });
    }, 1000);

    // Debug: Log on menu clicks
    console.log('PH Block script loaded. Click kebab menus to use.');
})();
