// ==UserScript==
// @name         YouTube - No Playlist
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Open a video without a playlist with the middle button or button.
// @license      MIT License
// @author       Hunterrock
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558919/YouTube%20-%20No%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/558919/YouTube%20-%20No%20Playlist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ITEM_ID = 'yt-no-playlist-menu-item';
    const CONTEXT_MENU_ID = 'yt-no-playlist-context-menu';
    const MENU_ITEM_TEXT = 'Leave Playlist';
    let lastMenuAnchor = null;

    const POPUP_SELECTORS = [
        'ytd-menu-popup-renderer tp-yt-paper-listbox',
        'tp-yt-paper-listbox.ytd-menu-popup-renderer',
        'ytd-menu-popup-renderer [role="menu"]',
        'ytd-popup-container tp-yt-paper-listbox',
        '#menu tp-yt-paper-listbox',
        'ytd-player-settings-menu tp-yt-paper-listbox'
    ];

    function getCleanWatchUrl(urlString) {
        try {
            const url = new URL(urlString, window.location.origin);
            if (!url.pathname.includes('/watch')) return null;
            url.searchParams.delete('list');
            url.searchParams.delete('index');
            url.searchParams.delete('start_radio');
            url.searchParams.delete('pp');
            return url.toString();
        } catch (e) { return urlString; }
    }

    function isPlaylistVideo() {
        const currentUrl = new URL(window.location.href);
        return currentUrl.searchParams.has('list') && currentUrl.searchParams.has('v');
    }

    function openWithoutPlaylist() {
        const cleanUrl = getCleanWatchUrl(window.location.href);
        if (cleanUrl && cleanUrl !== window.location.href) {
            window.location.href = cleanUrl;
        }
    }

    function addNoPlaylistButton() {
        if (!isPlaylistVideo()) {
            const existingBtn = document.getElementById('yt-no-playlist-btn');
            if (existingBtn) existingBtn.remove();
            return;
        }

        if (document.getElementById('yt-no-playlist-btn')) return;

        const targetElement = document.querySelector('ytd-watch-metadata #title h1') ||
            document.querySelector('ytd-video-primary-info-renderer .title') ||
            document.querySelector('#container > h1 > yt-formatted-string');

        if (targetElement) {
            const btn = document.createElement('button');
            btn.id = 'yt-no-playlist-btn';
            btn.innerText = '🚫 Leave Playlist';
            btn.title = 'Reload this video without the playlist';

            Object.assign(btn.style, {
                marginLeft: '15px',
                cursor: 'pointer',
                backgroundColor: '#cc0000',
                color: 'white',
                border: 'none',
                borderRadius: '18px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                display: 'inline-flex',
                alignItems: 'center',
                zIndex: '10'
            });

            btn.onclick = (e) => {
                e.preventDefault();
                openWithoutPlaylist();
            };

            targetElement.parentElement.appendChild(btn);
        }
    }

    document.addEventListener('mousedown', function (e) {
        const menuBtn = e.target.closest('ytd-menu-renderer, yt-icon-button, button[aria-label]');
        if (menuBtn) {
            lastMenuAnchor = e.target.closest('ytd-playlist-video-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');
        }

        if (e.button !== 1) return;

        const anchor = e.target.closest('a');
        if (!anchor || !anchor.href) return;

        if (anchor.href.includes('/watch') && anchor.href.includes('list=')) {
            const originalHref = anchor.href;
            const url = new URL(originalHref);

            url.searchParams.delete('list');
            url.searchParams.delete('index');
            url.searchParams.delete('start_radio');
            url.searchParams.delete('pp');

            anchor.href = url.toString();

            setTimeout(() => {
                anchor.href = originalHref;
            }, 500);
        }
    }, true);

    let rightClickTargetUrl = null;

    function ensureContextMenu() {
        let menu = document.getElementById(CONTEXT_MENU_ID);
        if (menu) return menu;

        menu = document.createElement('div');
        menu.id = CONTEXT_MENU_ID;
        Object.assign(menu.style, {
            position: 'fixed',
            zIndex: '99999',
            background: '#282828',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '12px',
            padding: '8px 0',
            minWidth: '220px',
            fontSize: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            display: 'none',
            fontFamily: '"Roboto", "Arial", sans-serif'
        });

        const leavePlaylistItem = document.createElement('div');
        leavePlaylistItem.id = 'ctx-leave-playlist';
        Object.assign(leavePlaylistItem.style, {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            cursor: 'pointer',
            color: '#fff'
        });

        leavePlaylistItem.innerHTML = `
            <div style="width: 24px; height: 24px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path>
                </svg>
            </div>
            <span>${MENU_ITEM_TEXT}</span>
        `;

        leavePlaylistItem.addEventListener('mouseenter', () => leavePlaylistItem.style.background = '#3e3e3e');
        leavePlaylistItem.addEventListener('mouseleave', () => leavePlaylistItem.style.background = 'transparent');
        leavePlaylistItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // URL'yi önce kaydet
            const urlToOpen = rightClickTargetUrl || window.location.href;
            const cleanUrl = getCleanWatchUrl(urlToOpen);

            hideContextMenu();

            if (cleanUrl) {
                window.location.href = cleanUrl;
            }
        });

        const openNewTabItem = document.createElement('div');
        openNewTabItem.id = 'ctx-open-new-tab';
        Object.assign(openNewTabItem.style, {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            cursor: 'pointer',
            color: '#fff'
        });

        openNewTabItem.innerHTML = `
            <div style="width: 24px; height: 24px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
            </div>
            <span>Open without playlist (new tab)</span>
        `;

        openNewTabItem.addEventListener('mouseenter', () => openNewTabItem.style.background = '#3e3e3e');
        openNewTabItem.addEventListener('mouseleave', () => openNewTabItem.style.background = 'transparent');
        openNewTabItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // URL'yi önce kaydet
            const urlToOpen = rightClickTargetUrl || window.location.href;
            const cleanUrl = getCleanWatchUrl(urlToOpen);

            hideContextMenu();

            if (cleanUrl) {
                window.open(cleanUrl, '_blank');
            }
        });

        menu.appendChild(leavePlaylistItem);
        menu.appendChild(openNewTabItem);
        document.body.appendChild(menu);
        return menu;
    }

    function hideContextMenu() {
        const menu = document.getElementById(CONTEXT_MENU_ID);
        if (menu) menu.style.display = 'none';
    }

    document.addEventListener('contextmenu', function (e) {
        const anchor = e.target.closest('a[href*="/watch"]');

        if (anchor && anchor.href.includes('list=')) {
            e.preventDefault();
            e.stopPropagation();

            rightClickTargetUrl = anchor.href;

            const menu = ensureContextMenu();
            const x = Math.min(e.clientX, window.innerWidth - 240);
            const y = Math.min(e.clientY, window.innerHeight - 100);
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.display = 'block';
            return;
        }

        if (isPlaylistVideo() && !e.target.closest('a, button, input, textarea')) {
            e.preventDefault();
            e.stopPropagation();

            rightClickTargetUrl = null;

            const menu = ensureContextMenu();
            const x = Math.min(e.clientX, window.innerWidth - 240);
            const y = Math.min(e.clientY, window.innerHeight - 100);
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.display = 'block';
        }
    }, true);

    document.addEventListener('click', function (e) {
        const menu = document.getElementById(CONTEXT_MENU_ID);
        if (menu && !menu.contains(e.target)) {
            hideContextMenu();
        }
    }, true);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideContextMenu();
        }
    }, true);

    function addMenuItemToOpenMenu() {
        const popups = document.querySelectorAll(POPUP_SELECTORS.join(','));
        popups.forEach(popup => {
            if (popup.querySelector('#' + MENU_ITEM_ID)) return;

            if (!isPlaylistVideo() && !window.location.href.includes('list=')) return;

            const getTargetUrl = () => {
                let targetUrl = window.location.href;
                if (lastMenuAnchor) {
                    const link = lastMenuAnchor.querySelector('a[href*="/watch"]');
                    if (link && link.href) {
                        targetUrl = link.href;
                    }
                }
                return targetUrl;
            };

            const createMenuItem = (id, iconSvg, text, onClick) => {
                const item = document.createElement('div');
                item.id = id;
                item.setAttribute('role', 'menuitem');
                item.setAttribute('tabindex', '0');

                Object.assign(item.style, {
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '36px',
                    padding: '0 12px',
                    cursor: 'pointer',
                    color: 'var(--yt-spec-text-primary, #fff)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    fontWeight: '400',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box',
                    width: '100%'
                });

                const iconContainer = document.createElement('div');
                Object.assign(iconContainer.style, {
                    width: '24px',
                    height: '24px',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0'
                });
                iconContainer.innerHTML = iconSvg;

                const label = document.createElement('span');
                label.textContent = text;
                Object.assign(label.style, {
                    color: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    fontWeight: 'inherit'
                });

                item.appendChild(iconContainer);
                item.appendChild(label);

                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--yt-spec-badge-chip-background, rgba(255,255,255,0.1))';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'transparent';
                });

                item.onclick = onClick;
                return item;
            };

            const leavePlaylistIcon = `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="display: block; width: 24px; height: 24px; fill: currentColor;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path></svg>`;

            const newTabIcon = `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="display: block; width: 24px; height: 24px; fill: currentColor;"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>`;

            const leavePlaylistItem = createMenuItem(
                MENU_ITEM_ID,
                leavePlaylistIcon,
                MENU_ITEM_TEXT,
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetUrl = getTargetUrl();
                    const cleanUrl = getCleanWatchUrl(targetUrl);
                    setTimeout(() => {
                        if (cleanUrl) {
                            window.location.href = cleanUrl;
                        } else if (targetUrl.includes('/watch')) {
                            window.location.href = targetUrl.split('&list=')[0].split('?list=')[0];
                        }
                    }, 10);
                }
            );

            const newTabItem = createMenuItem(
                MENU_ITEM_ID + '-newtab',
                newTabIcon,
                'Leave Playlist',
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetUrl = getTargetUrl();
                    const cleanUrl = getCleanWatchUrl(targetUrl);
                    setTimeout(() => {
                        if (cleanUrl) {
                            window.open(cleanUrl, '_blank');
                        } else if (targetUrl.includes('/watch')) {
                            window.open(targetUrl.split('&list=')[0].split('?list=')[0], '_blank');
                        }
                    }, 10);
                }
            );

            popup.appendChild(leavePlaylistItem);
            popup.appendChild(newTabItem);
        });
    }

    const observer = new MutationObserver((mutations) => {
        addNoPlaylistButton();
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                addMenuItemToOpenMenu();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(addNoPlaylistButton, 2000);
    document.addEventListener('yt-popup-opened', addMenuItemToOpenMenu, true);

})();