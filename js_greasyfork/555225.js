// ==UserScript==
// @name         YouTube Channel Blocker v5
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Block YouTube channels with optimized performance and fullscreen scroll prevention
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555225/YouTube%20Channel%20Blocker%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/555225/YouTube%20Channel%20Blocker%20v5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        PROCESS_INTERVAL: 1500,
        URL_CHECK_INTERVAL: 800,
        INIT_DELAY: 400,
        DEBOUNCE_DELAY: 150,
        SELECTORS: {
            VIDEO: [
                'ytd-video-renderer',
                'ytd-grid-video-renderer',
                'ytd-compact-video-renderer',
                'ytd-rich-item-renderer',
                'ytd-playlist-video-renderer',
                'ytd-reel-item-renderer',
                'ytd-movie-renderer'
            ]
        }
    };

    // State management with performance optimization
    const state = {
        blockedChannels: GM_getValue('blockedChannels', []),
        lastUrl: location.href,
        cache: new Map(),
        processingQueue: new Set(),
        isProcessing: false,
        isFullscreen: false,
        scrollPreventionActive: false
    };

    // Utility functions
    const utils = {
        saveBlocked() {
            GM_setValue('blockedChannels', state.blockedChannels);
            state.cache.clear();
        },

        isBlocked(channelName, channelId) {
            const cacheKey = `${channelName}:${channelId}`;
            if (state.cache.has(cacheKey)) {
                return state.cache.get(cacheKey);
            }

            const blocked = state.blockedChannels.some(b => {
                const lower = b.toLowerCase();
                return channelName.toLowerCase().includes(lower) ||
                       (channelId && channelId.toLowerCase() === lower);
            });

            state.cache.set(cacheKey, blocked);
            return blocked;
        },

        getChannelInfo(video, selector) {
            let channelLink;

            if (selector === 'ytd-rich-item-renderer') {
                const richMedia = video.querySelector('ytd-rich-grid-media');
                channelLink = richMedia?.querySelector('a[href*="/@"], a[href*="/channel/"], ytd-channel-name a');
            } else {
                channelLink = video.querySelector('ytd-channel-name a, #channel-name a, #text a[href*="/@"], a[href*="/channel/"]');
            }

            if (!channelLink) return null;

            const href = channelLink.getAttribute('href') || '';
            const channelId = href.split('/').pop().split('?')[0];

            return {
                name: channelLink.textContent.trim(),
                id: channelId,
                link: channelLink
            };
        },

        getInsertTarget(video, selector) {
            if (selector === 'ytd-rich-item-renderer') {
                const richMedia = video.querySelector('ytd-rich-grid-media');
                return richMedia?.querySelector('#details, #metadata, #meta');
            }
            return video.querySelector('#metadata-line, #meta, #metadata, #details, ytd-channel-name');
        },

        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
    };

    // Channel management
    const channelManager = {
        block(channelName, channelId) {
            const identifier = channelId || channelName;
            if (state.blockedChannels.includes(identifier)) {
                alert(`Channel "${channelName}" is already blocked.`);
                return false;
            }

            state.blockedChannels.push(identifier);
            utils.saveBlocked();
            alert(`✅ Blocked: ${channelName}\n\nRefresh the page to see changes.`);
            ui.updateToggleButton();
            return true;
        },

        unblock(identifier) {
            const index = state.blockedChannels.indexOf(identifier);
            if (index === -1) return false;

            state.blockedChannels.splice(index, 1);
            utils.saveBlocked();
            ui.updateToggleButton();
            return true;
        },

        exportBlocked() {
            const data = JSON.stringify(state.blockedChannels, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `youtube-blocked-channels-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        importBlocked(jsonData) {
            try {
                const imported = JSON.parse(jsonData);
                if (Array.isArray(imported)) {
                    const newChannels = imported.filter(ch => !state.blockedChannels.includes(ch));
                    state.blockedChannels.push(...newChannels);
                    utils.saveBlocked();
                    alert(`✅ Imported ${newChannels.length} new channels.\nTotal blocked: ${state.blockedChannels.length}`);
                    ui.updateToggleButton();
                    ui.updateBlockedList();
                    return true;
                }
            } catch (e) {
                alert('❌ Invalid JSON file');
            }
            return false;
        }
    };

    // Fullscreen handler - NEW ENHANCED VERSION IN v5
    const fullscreenHandler = {
        preventScroll(e) {
            if (state.isFullscreen) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },

        hideUIElements() {
            // Hide all YouTube UI overlays during fullscreen
            const elementsToHide = [
                '.ytp-chrome-top',
                '.ytp-chrome-bottom',
                '.ytp-gradient-top',
                '.ytp-gradient-bottom',
                '.ytp-pause-overlay',
                'ytd-engagement-panel-section-list-renderer',
                '.ytp-endscreen-content',
                '.ytp-ce-element',
                '.ytp-cards-teaser',
                '.ytp-suggestion-set'
            ];

            elementsToHide.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (state.isFullscreen) {
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                    } else {
                        el.style.removeProperty('display');
                        el.style.removeProperty('opacity');
                        el.style.removeProperty('pointer-events');
                    }
                });
            });
        },

        enableScrollPrevention() {
            if (state.scrollPreventionActive) return;

            // Prevent wheel scrolling
            document.addEventListener('wheel', this.preventScroll, { passive: false, capture: true });
            // Prevent touch scrolling
            document.addEventListener('touchmove', this.preventScroll, { passive: false, capture: true });
            // Prevent keyboard scrolling
            document.addEventListener('keydown', (e) => {
                if (state.isFullscreen && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { capture: true });

            state.scrollPreventionActive = true;
            console.log('🚫 Fullscreen scroll prevention enabled');
        },

        disableScrollPrevention() {
            if (!state.scrollPreventionActive) return;

            document.removeEventListener('wheel', this.preventScroll, { capture: true });
            document.removeEventListener('touchmove', this.preventScroll, { capture: true });

            state.scrollPreventionActive = false;
            console.log('✅ Fullscreen scroll prevention disabled');
        },

        handleFullscreenChange() {
            const isFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                document.querySelector('.html5-video-player.ytp-fullscreen')
            );

            // Update state
            state.isFullscreen = isFullscreen;

            // Hide/show toggle button
            const btn = document.getElementById('blocker-toggle');
            if (btn) {
                btn.style.display = isFullscreen ? 'none' : 'flex';
            }

            // Hide/show management panel
            const panel = document.getElementById('blocker-panel');
            if (panel && isFullscreen) {
                panel.style.display = 'none';
            }

            // Enable/disable scroll prevention
            if (isFullscreen) {
                this.enableScrollPrevention();
                this.hideUIElements();
            } else {
                this.disableScrollPrevention();
                this.hideUIElements(); // Reset UI elements
            }
        }
    };

    // Enhanced style injection with better visual indicators
    const styles = {
        inject() {
            const existingStyle = document.getElementById('channel-blocker-style');
            if (existingStyle) existingStyle.remove();

            const style = document.createElement('style');
            style.id = 'channel-blocker-style';
            style.textContent = `
                ${CONFIG.SELECTORS.VIDEO.map(s => `${s}[data-blocked="true"]`).join(',\n')} {
                    position: relative;
                    border: 3px solid #ffd700 !important;
                    border-radius: 8px !important;
                    padding: 4px !important;
                    background: rgba(255, 215, 0, 0.05) !important;
                }
                ${CONFIG.SELECTORS.VIDEO.map(s => `${s}[data-blocked="true"] ytd-thumbnail`).join(',\n')} {
                    border: 4px solid #ffd700 !important;
                    border-radius: 12px !important;
                    box-sizing: border-box !important;
                    pointer-events: none !important;
                    opacity: 0.6 !important;
                }
                ${CONFIG.SELECTORS.VIDEO.map(s => `${s}[data-blocked="true"] ytd-thumbnail *`).join(',\n')} {
                    pointer-events: none !important;
                }
                ${CONFIG.SELECTORS.VIDEO.map(s => `${s}[data-blocked="true"] ytd-thumbnail video`).join(',\n')} {
                    display: none !important;
                }
                ${CONFIG.SELECTORS.VIDEO.map(s => `${s}[data-blocked="true"] #mouseover-overlay, ${s}[data-blocked="true"] #hover-overlays`).join(',\n')} {
                    display: none !important;
                }
                .channel-block-btn {
                    transition: all 0.2s ease !important;
                }
                .channel-block-btn:hover {
                    transform: scale(1.05) !important;
                    filter: brightness(1.1) !important;
                }
                /* Hide toggle button in fullscreen mode */
                .html5-video-player.ytp-fullscreen ~ #blocker-toggle,
                body.fullscreen #blocker-toggle,
                html[data-fullscreen="true"] #blocker-toggle {
                    display: none !important;
                }
                /* NEW in v5: Prevent all overlays in fullscreen */
                body.ytp-fullscreen .ytp-pause-overlay,
                body.ytp-fullscreen .ytp-chrome-top,
                body.ytp-fullscreen .ytp-chrome-bottom {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Optimized video processing with batching
    const videoProcessor = {
        mark() {
            const batch = [];
            CONFIG.SELECTORS.VIDEO.forEach(selector => {
                document.querySelectorAll(`${selector}:not([data-checked])`).forEach(video => {
                    batch.push({ video, selector });
                });
            });

            // Process in batches to avoid blocking
            batch.forEach(({ video, selector }) => {
                video.dataset.checked = 'true';

                const info = utils.getChannelInfo(video, selector);
                if (!info) return;

                if (utils.isBlocked(info.name, info.id)) {
                    video.dataset.blocked = 'true';
                }
            });
        },

        addBlockButtons() {
            CONFIG.SELECTORS.VIDEO.forEach(selector => {
                document.querySelectorAll(`${selector}:not([data-has-button])`).forEach(video => {
                    if (video.dataset.blocked === 'true') return;

                    video.dataset.hasButton = 'true';

                    const info = utils.getChannelInfo(video, selector);
                    if (!info) return;

                    const insertTarget = utils.getInsertTarget(video, selector);
                    if (!insertTarget) return;

                    const alreadyBlocked = utils.isBlocked(info.name, info.id);
                    const button = this.createButton(info.name, info.id, alreadyBlocked);
                    insertTarget.appendChild(button);
                });
            });
        },

        addBadges() {
            CONFIG.SELECTORS.VIDEO.forEach(selector => {
                document.querySelectorAll(`${selector}[data-blocked="true"]:not([data-has-badge])`).forEach(video => {
                    video.dataset.hasBadge = 'true';

                    const info = utils.getChannelInfo(video, selector);
                    if (!info) return;

                    const insertTarget = utils.getInsertTarget(video, selector);
                    if (!insertTarget) return;

                    const badge = this.createBadge(info.name, info.id);
                    insertTarget.appendChild(badge);
                });
            });
        },

        createButton(channelName, channelId, alreadyBlocked) {
            const button = document.createElement('button');
            button.innerHTML = alreadyBlocked ? '✓ Blocked' : '🚫 Block';
            button.className = 'channel-block-btn';
            button.style.cssText = `
                background: ${alreadyBlocked ? '#666' : '#c00'};
                color: white; border: none; padding: 4px 10px;
                border-radius: 12px; cursor: pointer; font-size: 11px;
                font-weight: 500; margin: 4px 0 4px 8px;
                display: inline-block;
            `;

            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (alreadyBlocked) {
                    if (confirm(`Unblock "${channelName}"?`)) {
                        channelManager.unblock(channelId || channelName);
                        location.reload();
                    }
                } else {
                    channelManager.block(channelName, channelId);
                }
            };

            return button;
        },

        createBadge(channelName, channelId) {
            const badge = document.createElement('button');
            badge.innerHTML = '✓ Blocked';
            badge.className = 'blocked-channel-badge channel-block-btn';
            badge.style.cssText = `
                background: #ffd700; color: #000; border: none;
                padding: 4px 12px; border-radius: 12px; cursor: pointer;
                font-size: 11px; font-weight: bold; margin: 4px 0 4px 8px;
                display: inline-block;
            `;

            badge.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`Unblock channel "${channelName}"?\n\nVideos from this channel will no longer be marked.`)) {
                    if (channelManager.unblock(channelId || channelName)) {
                        alert(`✅ Unblocked: ${channelName}`);
                        location.reload();
                    }
                }
            };

            return badge;
        }
    };

    // Enhanced channel page handler
    const channelPage = {
        addButton() {
            if (!location.pathname.match(/\/@|\/channel\//)) return;
            if (document.getElementById('channel-block-btn')) return;

            const nameEl = document.querySelector('yt-dynamic-text-view-model h1 span[role="text"]');
            const handleEl = document.querySelector('yt-content-metadata-view-model span[role="text"]');

            const channelName = nameEl?.textContent.trim().split('\n')[0] || '';
            let channelId = handleEl?.textContent.trim() || '';
            if (!channelId.startsWith('@')) {
                channelId = '@' + (location.pathname.split('/@')[1] || location.pathname.split('/channel/')[1] || '').split('/')[0];
            }

            if (!channelName && !channelId) return;

            const flexActions = document.querySelector('yt-flexible-actions-view-model');
            if (!flexActions) return;

            const blocked = utils.isBlocked(channelName, channelId);
            const wrapper = document.createElement('div');
            wrapper.id = 'channel-block-btn';
            wrapper.className = 'ytFlexibleActionsViewModelAction';

            const button = document.createElement('button');
            button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m channel-block-btn';
            if (blocked) {
                button.style.cssText = `
                    background: #ffd700 !important; color: #000 !important;
                    border: 2px solid #000 !important; padding: 10px 24px !important;
                    font-weight: bold !important;
                `;
            }
            button.innerHTML = `<div class="yt-spec-button-shape-next__button-text-content">${blocked ? '✓ Blocked' : '🚫 Block'}</div>`;
            button.onclick = () => {
                if (blocked) {
                    if (confirm(`Unblock "${channelName}"?`)) {
                        channelManager.unblock(channelId || channelName);
                        location.reload();
                    }
                } else {
                    if (confirm(`Block "${channelName}"?`)) {
                        channelManager.block(channelName, channelId);
                    }
                }
            };

            wrapper.appendChild(button);
            flexActions.appendChild(wrapper);
        }
    };

    // Enhanced UI with import/export functionality
    const ui = {
        createToggleButton() {
            const btn = document.createElement('button');
            btn.id = 'blocker-toggle';
            btn.innerHTML = `🚫 (${state.blockedChannels.length})`;
            btn.title = 'Manage Blocked Channels';
            btn.style.cssText = `
                position: fixed; top: 70px; right: 20px; background: #c00;
                color: white; border: none; padding: 8px 12px; border-radius: 50%;
                cursor: grab; z-index: 9999; font-weight: 600; font-size: 16px;
                box-shadow: 0 2px 10px rgba(204,0,0,0.5); width: 44px; height: 44px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            `;

            btn.onmouseover = () => {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 4px 15px rgba(204,0,0,0.7)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 2px 10px rgba(204,0,0,0.5)';
            };

            btn.onclick = () => {
                const panel = document.getElementById('blocker-panel');
                if (panel.style.display === 'none') {
                    this.updateBlockedList();
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            };

            document.body.appendChild(btn);
            this.makeDraggable(btn);
        },

        updateToggleButton() {
            const btn = document.getElementById('blocker-toggle');
            if (btn) btn.innerHTML = `🚫 (${state.blockedChannels.length})`;
        },

        createManagementPanel() {
            const panel = document.createElement('div');
            panel.id = 'blocker-panel';
            panel.style.cssText = `
                position: fixed; top: 150px; right: 20px; background: #282828;
                border: 2px solid #c00; border-radius: 12px; padding: 20px;
                z-index: 10000; max-width: 380px; max-height: 550px;
                overflow-y: auto; display: none; color: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;

            panel.innerHTML = `
                <h3 style="margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #c00; padding-bottom: 8px;">
                    🚫 Blocked Channels
                </h3>
                <div id="blocked-count" style="margin-bottom: 12px; color: #aaa; font-size: 13px;">
                    Total: ${state.blockedChannels.length}
                </div>
                <div id="blocked-list" style="margin-bottom: 16px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px;">
                    <button id="close-panel" style="background: #065fd4; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Close</button>
                    <button id="clear-all" style="background: #c00; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Clear All</button>
                    <button id="export-blocked" style="background: #0a8a0a; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Export</button>
                    <button id="import-blocked" style="background: #f59e0b; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Import</button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            `;

            document.body.appendChild(panel);

            document.getElementById('close-panel').onclick = () => panel.style.display = 'none';
            document.getElementById('clear-all').onclick = () => {
                if (confirm('Unblock all channels?')) {
                    state.blockedChannels = [];
                    utils.saveBlocked();
                    this.updateBlockedList();
                    location.reload();
                }
            };
            document.getElementById('export-blocked').onclick = () => channelManager.exportBlocked();
            document.getElementById('import-blocked').onclick = () => document.getElementById('import-file').click();
            document.getElementById('import-file').onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => channelManager.importBlocked(ev.target.result);
                    reader.readAsText(file);
                }
            };
        },

        updateBlockedList() {
            const list = document.getElementById('blocked-list');
            const count = document.getElementById('blocked-count');
            if (!list) return;

            if (count) count.textContent = `Total: ${state.blockedChannels.length}`;
            list.innerHTML = state.blockedChannels.length === 0
                ? '<p style="color: #aaa; text-align: center; padding: 20px;">No blocked channels</p>'
                : state.blockedChannels.map(ch => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 6px; background: #3a3a3a; border-radius: 6px;">
                        <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ch}">${ch}</span>
                        <button onclick="window.unblockChannelFromPanel('${ch.replace(/'/g, "\\'")}'))" style="background: #065fd4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 8px;">Unblock</button>
                    </div>
                `).join('');
        },

        makeDraggable(el) {
            let pos1=0, pos2=0, pos3=0, pos4=0;
            el.onmousedown = (e) => {
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.cursor = 'grabbing';
                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    el.style.cursor = 'grab';
                };
                document.onmousemove = (e) => {
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    el.style.top = (el.offsetTop - pos2) + "px";
                    el.style.left = (el.offsetLeft - pos1) + "px";
                    el.style.right = 'auto';
                };
            };
        }
    };

    // Global function for panel
    window.unblockChannelFromPanel = (ch) => {
        if (channelManager.unblock(ch)) {
            alert(`✅ Unblocked: ${ch}`);
            ui.updateBlockedList();
            location.reload();
        }
    };

    // Optimized main processing with debouncing
    const debouncedProcess = utils.debounce(() => {
        if (state.isProcessing) return;
        state.isProcessing = true;

        try {
            videoProcessor.mark();
            videoProcessor.addBlockButtons();
            videoProcessor.addBadges();
            channelPage.addButton();
        } finally {
            state.isProcessing = false;
        }
    }, CONFIG.DEBOUNCE_DELAY);

    function processPage() {
        debouncedProcess();
    }

    // URL change detection with optimization
    function detectUrlChange() {
        if (location.href !== state.lastUrl) {
            state.lastUrl = location.href;
            setTimeout(() => {
                styles.inject();
                processPage();
            }, CONFIG.INIT_DELAY);
        }
    }

    // Initialize with performance monitoring
    setTimeout(() => {
        console.log('🚫 YouTube Channel Blocker v5 initialized');
        console.log(`📊 Blocking ${state.blockedChannels.length} channels`);
        console.log('✨ NEW: Enhanced fullscreen mode with scroll prevention');

        ui.createToggleButton();
        ui.createManagementPanel();
        styles.inject();
        processPage();

        // Initialize fullscreen detection
        fullscreenHandler.handleFullscreenChange();
    }, CONFIG.INIT_DELAY);

    // Optimized intervals
    setInterval(processPage, CONFIG.PROCESS_INTERVAL);
    setInterval(detectUrlChange, CONFIG.URL_CHECK_INTERVAL);

    // Listen for fullscreen changes - ENHANCED IN v5
    document.addEventListener('fullscreenchange', () => fullscreenHandler.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => fullscreenHandler.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => fullscreenHandler.handleFullscreenChange());
    document.addEventListener('MSFullscreenChange', () => fullscreenHandler.handleFullscreenChange());

    // Also check for YouTube's custom fullscreen class changes
    const fullscreenObserver = new MutationObserver(() => fullscreenHandler.handleFullscreenChange());
    setTimeout(() => {
        const videoPlayer = document.querySelector('.html5-video-player');
        if (videoPlayer) {
            fullscreenObserver.observe(videoPlayer, { attributes: true, attributeFilter: ['class'] });
        }
    }, 1000);

    // Performance monitoring
    if (state.blockedChannels.length > 0) {
        console.log('✅ YouTube Channel Blocker v5 active with enhanced fullscreen control');
    }
})();