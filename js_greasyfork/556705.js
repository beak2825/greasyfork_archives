// ==UserScript==
// @name         Infinite Craft - Auto Dragger Pro - Element Sync Plugin
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Sync ALL elements - MAXIMUM SPEED
// @author       Silverfox0338
// @license      CC-BY-NC-ND-4.0
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556705/Infinite%20Craft%20-%20Auto%20Dragger%20Pro%20-%20Element%20Sync%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/556705/Infinite%20Craft%20-%20Auto%20Dragger%20Pro%20-%20Element%20Sync%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        VERSION: 'v2.3',
        SCROLL_INTERVAL: 3,
        UI_UPDATE_THROTTLE: 100,
        OPTIMIZATION_DELAY: 100,
        RESTORE_DELAY: 80,
        MAX_INIT_ATTEMPTS: 120,
        INIT_CHECK_INTERVAL: 500,
        LOADING_SCREEN_CHECK_INTERVAL: 200,
        MAX_NO_CHANGE_COUNT: 20,
        RETRY_RAPID_SCROLL_THRESHOLD: 6,
        RETRY_SCROLL_RESET_THRESHOLD: 12,
        RETRY_DEEP_SCAN_THRESHOLD: 16,
        MAX_RETRY_ATTEMPTS: 3,
        MIN_ACCEPTABLE_PERCENT: 95,
        TOAST_DURATION: 2500,
        TOAST_ANIMATION_DURATION: 250,
        MODAL_ANIMATION_DURATION: 250,
        LIST_PREVIEW_LIMIT: 15,
        RECOVERY_SCROLL_POSITIONS: [0, 0.3, 0.6, 1.0],
        RECOVERY_POSITION_DELAY: 50,
        RAPID_SCROLL_COUNT: 3,
        RAPID_SCROLL_DELAY: 25,
        SPEED_HISTORY_WINDOW: 2000
    };

    const state = {
        allElements: [],
        isScanning: false,
        loadingOverlay: null,
        unloadedElements: null,
        rafId: null,
        lastUIUpdate: 0,
        api: null,
        initCheckInterval: null,
        keydownHandler: null,
        cleanupFunctions: [],
        mainScriptReady: false
    };

    let cachedTheme = null;
    let cachedColors = null;

    function addCleanup(fn) {
        if (typeof fn === 'function') {
            state.cleanupFunctions.push(fn);
        }
    }

    function cleanup() {
        state.cleanupFunctions.forEach(fn => {
            try {
                fn();
            } catch (e) {
                console.error('[SYNC] Cleanup error:', e);
            }
        });
        state.cleanupFunctions = [];
    }

    function getThemeColors() {
        if (!state.api) return getFallbackColors();

        const currentTheme = state.api.getState?.().theme || 'hacker';
        if (cachedTheme === currentTheme && cachedColors) return cachedColors;

        const themes = {
            hacker: {
                bg: '#000', bgOverlay: 'rgba(0, 20, 0, 0.98)', border: '#0f0', text: '#0f0',
                textSecondary: '#0a0', accent: '#0f0', accentDim: 'rgba(0, 255, 0, 0.2)',
                success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
                btnBg: '#001a00', surface: 'rgba(0, 255, 0, 0.05)', font: "'Courier New', monospace"
            },
            furry: {
                bg: '#fff0f5', bgOverlay: 'rgba(255, 240, 245, 0.98)', border: '#ff69b4', text: '#880044',
                textSecondary: '#ff8da1', accent: '#ff1493', accentDim: 'rgba(255, 105, 180, 0.1)',
                success: '#ff1493', error: '#ff0000', warning: '#ffca00', info: '#00bfff',
                btnBg: '#ffe4f0', surface: 'rgba(255, 255, 255, 0.6)', font: "'Comic Sans MS', 'Chalkboard SE', sans-serif"
            },
            synthwave: {
                bg: '#140028', bgOverlay: 'rgba(20, 0, 40, 0.98)', border: '#00f3ff', text: '#ff00ff',
                textSecondary: '#bd00ff', accent: '#00f3ff', accentDim: 'rgba(0, 243, 255, 0.15)',
                success: '#00ff9d', error: '#ff2a2a', warning: '#ffdd00', info: '#00f3ff',
                btnBg: '#2a0050', surface: 'rgba(255, 0, 255, 0.05)', font: "'Courier New', monospace"
            }
        };

        cachedTheme = currentTheme;
        cachedColors = themes[currentTheme] || themes.hacker;
        return cachedColors;
    }

    function getFallbackColors() {
        return {
            bg: '#000', bgOverlay: 'rgba(0, 20, 0, 0.98)', border: '#0f0', text: '#0f0',
            textSecondary: '#0a0', accent: '#0f0', accentDim: 'rgba(0, 255, 0, 0.2)',
            success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
            btnBg: '#001a00', surface: 'rgba(0, 255, 0, 0.05)', font: "'Courier New', monospace"
        };
    }

    function formatETA(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '--:--';
        if (seconds < 60) return `${Math.ceil(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }

    function showToast(message, type = 'info') {
        const colors = getThemeColors();
        const typeColors = { success: colors.success, error: colors.error, info: colors.accent, warning: colors.warning };
        const bgColor = typeColors[type] || typeColors.info;
        const textColor = state.api?.getState?.().theme === 'furry' ? '#fff' : '#000';

        const toast = document.createElement('div');
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.style.cssText = `position:fixed;top:140px;right:20px;background:${bgColor};padding:14px 20px;border-radius:6px;color:${textColor};font-family:${colors.font};font-size:12px;box-shadow:0 0 20px ${bgColor};z-index:10005;max-width:280px;word-wrap:break-word;font-weight:700;border:2px solid ${colors.border};animation:pluginSlideIn ${CONFIG.TOAST_ANIMATION_DURATION}ms ease-out;`;

        const theme = state.api?.getState?.().theme || 'hacker';
        const prefix = theme === 'hacker' ? '⚡ ' : theme === 'furry' ? '★ ' : '◆ ';
        const suffix = theme === 'furry' ? ' UwU' : '';
        toast.textContent = prefix + '[SYNC] ' + message + suffix;

        if (!document.getElementById('plugin-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'plugin-toast-styles';
            style.textContent = `@keyframes pluginSlideIn{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes pluginSlideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}`;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        const timeout = setTimeout(() => {
            toast.style.animation = `pluginSlideOut ${CONFIG.TOAST_ANIMATION_DURATION}ms ease-out`;
            const removeTimeout = setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, CONFIG.TOAST_ANIMATION_DURATION);
            addCleanup(() => clearTimeout(removeTimeout));
        }, CONFIG.TOAST_DURATION);
        addCleanup(() => {
            clearTimeout(timeout);
            if (toast.parentNode) toast.remove();
        });
    }

    function showModal(title, message, type = 'info', buttons = [{ text: 'OK', action: null }]) {
        return new Promise((resolve) => {
            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');

            modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:${colors.bg}ee;backdrop-filter:blur(10px);z-index:100000;display:flex;align-items:center;justify-content:center;font-family:${colors.font};animation:modalFadeIn ${CONFIG.MODAL_ANIMATION_DURATION}ms ease;`;

            const typeIcons = { info: 'ℹ️', success: '✓', error: '✗', warning: '⚠️', question: '?' };
            const typeColors = { info: colors.accent, success: colors.success, error: colors.error, warning: colors.warning, question: colors.accent };
            const icon = typeIcons[type] || typeIcons.info;
            const iconColor = typeColors[type] || typeColors.info;

            modal.innerHTML = `<style>@keyframes modalFadeIn{from{opacity:0;}to{opacity:1;}}@keyframes modalSlideIn{from{transform:scale(0.8);opacity:0;}to{transform:scale(1);opacity:1;}}.modal-box{background:${colors.bgOverlay};border:2px solid ${colors.border};border-radius:8px;padding:24px 32px;box-shadow:0 0 40px ${colors.border}80;min-width:380px;max-width:550px;animation:modalSlideIn ${CONFIG.MODAL_ANIMATION_DURATION}ms ease;}.modal-icon{font-size:40px;text-align:center;margin-bottom:16px;color:${iconColor};text-shadow:0 0 15px ${iconColor};font-weight:700;}.modal-title{font-size:18px;font-weight:700;text-align:center;margin-bottom:16px;color:${colors.text};text-transform:uppercase;letter-spacing:1.5px;}.modal-message{font-size:13px;line-height:1.6;text-align:center;margin-bottom:20px;color:${colors.textSecondary};white-space:pre-line;}.modal-buttons{display:flex;gap:10px;justify-content:center;}.modal-btn{padding:10px 24px;border:2px solid ${colors.border};border-radius:4px;background:${colors.btnBg};color:${colors.text};font-family:${colors.font};font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s ease;text-transform:uppercase;letter-spacing:1px;}.modal-btn:hover{background:${colors.accent};color:${colors.bg};box-shadow:0 0 12px ${colors.accent};transform:scale(1.04);}.modal-btn.primary{background:${colors.accent};color:${colors.bg};border-color:${colors.accent};}</style><div class="modal-box"><div class="modal-icon">${icon}</div><div class="modal-title">${title}</div><div class="modal-message">${message}</div><div class="modal-buttons" id="modal-buttons"></div></div>`;

            document.body.appendChild(modal);
            const buttonsContainer = modal.querySelector('#modal-buttons');

            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    const firstBtn = modal.querySelector('.modal-btn');
                    if (firstBtn) firstBtn.click();
                }
            };
            document.addEventListener('keydown', handleEsc);

            const closeModal = (result) => {
                document.removeEventListener('keydown', handleEsc);
                modal.style.opacity = '0';
                modal.style.transition = `opacity ${CONFIG.MODAL_ANIMATION_DURATION}ms ease`;
                setTimeout(() => {
                    if (modal.parentNode) modal.remove();
                    resolve(result);
                }, CONFIG.MODAL_ANIMATION_DURATION);
            };

            if (buttonsContainer) {
                buttons.forEach((btn, index) => {
                    const button = document.createElement('button');
                    button.className = index === 0 ? 'modal-btn primary' : 'modal-btn';
                    button.textContent = btn.text;
                    button.addEventListener('click', () => {
                        closeModal(btn.value !== undefined ? btn.value : true);
                        if (btn.action) {
                            try {
                                btn.action();
                            } catch (e) {
                                console.error('[SYNC] Button action error:', e);
                            }
                        }
                    });
                    buttonsContainer.appendChild(button);
                    if (index === 0) button.focus();
                });
            }

            addCleanup(() => {
                document.removeEventListener('keydown', handleEsc);
                if (modal.parentNode) modal.remove();
            });
        });
    }

    function aggressiveUnload() {
        const unloaded = {
            instances: null,
            instancesParent: null,
            canvases: [],
            mainPanel: null,
            gameContainer: null,
            styles: []
        };

        try {
            const instances = document.querySelector('.instances');
            if (instances && instances.parentNode) {
                unloaded.instancesParent = instances.parentNode;
                unloaded.instances = instances;
                instances.remove();
            }

            document.querySelectorAll('canvas').forEach(canvas => {
                if (!canvas.closest('#sidebar')) {
                    unloaded.canvases.push({
                        element: canvas,
                        parent: canvas.parentNode,
                        nextSibling: canvas.nextSibling
                    });
                    canvas.remove();
                }
            });

            const mainPanel = document.getElementById('auto-dragger-panel');
            if (mainPanel) {
                unloaded.mainPanel = {
                    element: mainPanel,
                    display: mainPanel.style.display
                };
                mainPanel.style.display = 'none';
            }

            const container = document.querySelector('.container.infinite-craft');
            if (container) {
                unloaded.gameContainer = {
                    element: container,
                    visibility: container.style.visibility
                };
                container.style.visibility = 'hidden';
            }

            const style1 = document.createElement('style');
            style1.id = 'ultra-aggressive-optimization';
            style1.textContent = `*{animation:none !important;transition:none !important;transform:none !important;will-change:auto !important;}body *:not(#sidebar):not(#sidebar *):not(#element-sync-loading):not(#element-sync-loading *){pointer-events:none !important;}`;
            document.head.appendChild(style1);
            unloaded.styles.push(style1);

            const style2 = document.createElement('style');
            style2.textContent = `.instance,.instances,canvas:not(#sidebar canvas){display:none !important;}`;
            document.head.appendChild(style2);
            unloaded.styles.push(style2);
        } catch (e) {
            console.error('[SYNC] Unload error:', e);
        }

        return unloaded;
    }

    function aggressiveRestore(unloaded) {
        if (!unloaded) return;

        try {
            if (unloaded.instances && unloaded.instancesParent) {
                try {
                    unloaded.instancesParent.appendChild(unloaded.instances);
                } catch (e) {
                    console.error('[SYNC] Restore instances error:', e);
                }
            }

            unloaded.canvases.forEach(({ element, parent, nextSibling }) => {
                try {
                    if (parent && element) {
                        if (nextSibling && nextSibling.parentNode === parent) {
                            parent.insertBefore(element, nextSibling);
                        } else {
                            parent.appendChild(element);
                        }
                    }
                } catch (e) {
                    console.error('[SYNC] Restore canvas error:', e);
                }
            });

            if (unloaded.mainPanel && unloaded.mainPanel.element) {
                try {
                    unloaded.mainPanel.element.style.display = unloaded.mainPanel.display || '';
                } catch (e) {
                    console.error('[SYNC] Restore panel error:', e);
                }
            }

            if (unloaded.gameContainer && unloaded.gameContainer.element) {
                try {
                    unloaded.gameContainer.element.style.visibility = unloaded.gameContainer.visibility || '';
                } catch (e) {
                    console.error('[SYNC] Restore container error:', e);
                }
            }

            unloaded.styles.forEach(style => {
                try {
                    if (style && style.parentNode) style.remove();
                } catch (e) {
                    console.error('[SYNC] Remove style error:', e);
                }
            });
        } catch (e) {
            console.error('[SYNC] Restore error:', e);
        }
    }

    function createLoadingOverlay() {
        const colors = getThemeColors();
        state.loadingOverlay = document.createElement('div');
        state.loadingOverlay.id = 'element-sync-loading';
        state.loadingOverlay.setAttribute('role', 'alert');
        state.loadingOverlay.setAttribute('aria-live', 'assertive');
        state.loadingOverlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:${colors.bg}ee;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:${colors.font};color:${colors.text};backdrop-filter:blur(10px);`;
        state.loadingOverlay.innerHTML = `<style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}.loading-spinner{width:40px;height:40px;border:3px solid ${colors.accentDim};border-top:3px solid ${colors.accent};border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:20px;}.loading-box{background:${colors.bgOverlay};border:1px solid ${colors.border};border-radius:4px;padding:24px 40px;box-shadow:0 0 30px ${colors.border}40;text-align:left;max-width:500px;min-width:450px;}.loading-title{font-size:14px;font-weight:700;margin-bottom:18px;letter-spacing:0.5px;border-bottom:1px solid ${colors.border};padding-bottom:10px;}.loading-status{font-size:12px;margin-bottom:10px;color:${colors.textSecondary};font-family:monospace;}.loading-progress{font-size:13px;font-weight:600;margin-bottom:6px;color:${colors.text};font-family:monospace;}.loading-stats{font-size:11px;margin-bottom:14px;color:${colors.textSecondary};font-family:monospace;display:grid;grid-template-columns:1fr 1fr;gap:6px;}.loading-stat{display:flex;justify-content:space-between;}.loading-bar-container{width:100%;height:4px;background:${colors.surface};border-radius:2px;overflow:hidden;margin-bottom:14px;border:1px solid ${colors.border};}.loading-bar{height:100%;background:${colors.accent};width:0%;transition:width 0.2s linear;}.loading-info{font-size:10px;color:${colors.textSecondary};font-family:monospace;line-height:1.6;border-top:1px solid ${colors.border};padding-top:10px;}</style><div class="loading-box"><div class="loading-title">ELEMENT SCANNER v2.3</div><div class="loading-status" id="loading-status">Initializing...</div><div class="loading-progress" id="loading-progress">0 / 0</div><div class="loading-stats"><div class="loading-stat"><span>ETA:</span><span id="loading-eta">--:--</span></div><div class="loading-stat"><span>Rate:</span><span id="loading-speed">0/s</span></div></div><div class="loading-bar-container"><div class="loading-bar" id="loading-bar"></div></div><div class="loading-info">scroll_interval=3ms | dom_optimize=true<br>dedup_algorithm=id+text | retry_limit=3</div></div>`;
        document.body.appendChild(state.loadingOverlay);
    }

    function updateLoadingOverlay(status, current, total, eta = null, speed = null) {
        if (!state.loadingOverlay) return;
        const now = performance.now();
        if (now - state.lastUIUpdate < CONFIG.UI_UPDATE_THROTTLE) return;
        if (state.rafId) cancelAnimationFrame(state.rafId);

        state.rafId = requestAnimationFrame(() => {
            const statusEl = document.getElementById('loading-status');
            const progressEl = document.getElementById('loading-progress');
            const etaEl = document.getElementById('loading-eta');
            const speedEl = document.getElementById('loading-speed');
            const barEl = document.getElementById('loading-bar');

            if (statusEl) statusEl.textContent = `> ${status}`;
            if (progressEl) progressEl.textContent = `${current.toLocaleString()} / ${total.toLocaleString()} elements`;
            if (etaEl) etaEl.textContent = eta !== null && eta > 0 && isFinite(eta) ? formatETA(eta) : '--:--';
            if (speedEl) speedEl.textContent = speed !== null && isFinite(speed) ? `${speed.toFixed(0)}/s` : '0/s';
            if (barEl && total > 0) barEl.style.width = Math.min(100, (current / total) * 100) + '%';

            state.lastUIUpdate = now;
            state.rafId = null;
        });
    }

    function removeLoadingOverlay() {
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = null;
        }
        if (state.loadingOverlay) {
            state.loadingOverlay.style.opacity = '0';
            state.loadingOverlay.style.transition = 'opacity 0.3s ease';
            const timeout = setTimeout(() => {
                if (state.loadingOverlay && state.loadingOverlay.parentNode) {
                    state.loadingOverlay.remove();
                    state.loadingOverlay = null;
                }
            }, 300);
            addCleanup(() => clearTimeout(timeout));
        }
    }

    function getTotalItemCount() {
        try {
            const searchInput = document.querySelector('.sidebar-input');
            if (!searchInput) return null;
            const placeholder = searchInput.getAttribute('placeholder') || '';
            const match = placeholder.match(/\(([0-9,]+)\)/);
            return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
        } catch (e) {
            console.error('[SYNC] Get count error:', e);
            return null;
        }
    }

    async function scrollAndLoadAllItems(sidebar, totalExpected) {
        updateLoadingOverlay('Scrolling sidebar', 0, totalExpected);
        const itemsInner = sidebar.querySelector('.items-inner');
        if (!itemsInner) throw new Error('Cannot find element list!\n\nThe game layout may have changed.\nTry refreshing the page.');

        const startTime = Date.now();
        let itemHistory = [];
        let updateCounter = 0;
        let noChangeCounter = 0;
        let lastCount = 0;
        let retryAttempts = 0;

        while (true) {
            const currentItemCount = itemsInner.querySelectorAll('[data-item]').length;
            updateCounter++;

            if (updateCounter % 6 === 0) {
                const now = Date.now();
                itemHistory.push({ count: currentItemCount, time: now });
                itemHistory = itemHistory.filter(h => now - h.time < CONFIG.SPEED_HISTORY_WINDOW);

                let loadingSpeed = 0;
                if (itemHistory.length >= 2) {
                    const oldest = itemHistory[0];
                    const newest = itemHistory[itemHistory.length - 1];
                    const timeDiff = (newest.time - oldest.time) / 1000;
                    const itemDiff = newest.count - oldest.count;
                    if (timeDiff > 0) loadingSpeed = itemDiff / timeDiff;
                }

                let eta = null;
                if (loadingSpeed > 0 && currentItemCount < totalExpected) {
                    eta = (totalExpected - currentItemCount) / loadingSpeed;
                }

                const percentLoaded = (currentItemCount / totalExpected) * 100;
                updateLoadingOverlay(`Loading ${percentLoaded.toFixed(1)}%`, currentItemCount, totalExpected, eta, loadingSpeed);
            }

            if (currentItemCount >= totalExpected) break;

            if (currentItemCount === lastCount) {
                noChangeCounter++;
                const percentLoaded = (currentItemCount / totalExpected) * 100;

                if (noChangeCounter === CONFIG.RETRY_RAPID_SCROLL_THRESHOLD) {
                    updateLoadingOverlay(`Recovery mode (${percentLoaded.toFixed(1)}%)`, currentItemCount, totalExpected);
                    for (let i = 0; i < CONFIG.RAPID_SCROLL_COUNT; i++) {
                        sidebar.scrollTop = sidebar.scrollHeight;
                        await new Promise(r => setTimeout(r, CONFIG.RAPID_SCROLL_DELAY));
                    }
                }

                if (noChangeCounter === CONFIG.RETRY_SCROLL_RESET_THRESHOLD) {
                    updateLoadingOverlay(`Scroll reset (${percentLoaded.toFixed(1)}%)`, currentItemCount, totalExpected);
                    sidebar.scrollTop = 0;
                    await new Promise(r => setTimeout(r, CONFIG.RECOVERY_POSITION_DELAY));
                    sidebar.scrollTop = sidebar.scrollHeight;
                    await new Promise(r => setTimeout(r, CONFIG.RECOVERY_POSITION_DELAY * 2));
                }

                if (noChangeCounter === CONFIG.RETRY_DEEP_SCAN_THRESHOLD) {
                    if (retryAttempts < CONFIG.MAX_RETRY_ATTEMPTS) {
                        retryAttempts++;
                        updateLoadingOverlay(`Retry ${retryAttempts}/${CONFIG.MAX_RETRY_ATTEMPTS}`, currentItemCount, totalExpected);
                        for (const ratio of CONFIG.RECOVERY_SCROLL_POSITIONS) {
                            sidebar.scrollTop = sidebar.scrollHeight * ratio;
                            await new Promise(r => setTimeout(r, CONFIG.RECOVERY_POSITION_DELAY));
                        }
                        sidebar.scrollTop = sidebar.scrollHeight;
                        await new Promise(r => setTimeout(r, 300));
                        const recheckCount = itemsInner.querySelectorAll('[data-item]').length;
                        if (recheckCount > currentItemCount) {
                            noChangeCounter = 0;
                            lastCount = recheckCount;
                            continue;
                        }
                        noChangeCounter = 0;
                        continue;
                    }
                }

                if (noChangeCounter >= CONFIG.MAX_NO_CHANGE_COUNT) {
                    const finalPercent = (currentItemCount / totalExpected) * 100;
                    if (finalPercent >= CONFIG.MIN_ACCEPTABLE_PERCENT) break;
                    throw new Error(`Could not load all items!\n\nLoaded: ${currentItemCount.toLocaleString()} / ${totalExpected.toLocaleString()} (${finalPercent.toFixed(1)}%)\n\nTry refreshing the page.`);
                }
            } else {
                noChangeCounter = 0;
                if (currentItemCount > lastCount + 30) retryAttempts = 0;
            }

            lastCount = currentItemCount;
            sidebar.scrollTop = sidebar.scrollHeight;
            await new Promise(r => setTimeout(r, CONFIG.SCROLL_INTERVAL));
        }

        const finalItemCount = itemsInner.querySelectorAll('[data-item]').length;
        const percentLoaded = (finalItemCount / totalExpected) * 100;
        return { totalItems: finalItemCount, itemsInner, percentLoaded, expectedTotal: totalExpected };
    }

    async function scanAllElements() {
        if (state.isScanning) {
            showToast('Already scanning...', 'warning');
            return;
        }

        if (state.api?.getState?.().isRunning) {
            await showModal('AUTO DRAGGER RUNNING', 'Please stop the Auto Dragger before scanning.\n\nClick [STOP] then try again.', 'error', [{ text: 'OK' }]);
            return;
        }

        state.isScanning = true;
        state.allElements = [];

        const scanBtn = document.getElementById('sync-scan-btn');
        if (scanBtn) {
            scanBtn.textContent = '[SCANNING...]';
            scanBtn.disabled = true;
        }

        createLoadingOverlay();

        try {
            updateLoadingOverlay('Removing DOM elements', 0, 0);
            state.unloadedElements = aggressiveUnload();
            await new Promise(r => setTimeout(r, CONFIG.OPTIMIZATION_DELAY));

            updateLoadingOverlay('Reading element count', 0, 0);
            const totalExpected = getTotalItemCount();
            if (!totalExpected) throw new Error('Cannot read item count!\n\nMake sure the sidebar is visible.');

            updateLoadingOverlay('Locating sidebar', 0, totalExpected);
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) throw new Error('Sidebar not found!\n\nPlease refresh and try again.');

            const { totalItems, itemsInner, percentLoaded, expectedTotal } = await scrollAndLoadAllItems(sidebar, totalExpected);

            updateLoadingOverlay('Extracting data', 0, totalItems);

            const allItems = itemsInner.querySelectorAll('[data-item]');
            const seenIds = new Set();
            const seenTexts = new Set();
            const elements = [];

            allItems.forEach((item) => {
                const emoji = item.getAttribute('data-item-emoji') || '';
                const text = item.getAttribute('data-item-text') || '';
                const id = item.getAttribute('data-item-id') || '';
                const isDiscovery = item.hasAttribute('data-item-discovery');

                if (text && !((id && seenIds.has(id)) || seenTexts.has(text))) {
                    if (id) seenIds.add(id);
                    seenTexts.add(text);
                    elements.push({ id, name: emoji ? `${emoji} ${text}` : text, emoji, text, isFirstDiscovery: isDiscovery, scanned: new Date().toISOString(), scannedDate: new Date().toLocaleString() });
                }
            });

            elements.sort((a, b) => {
                const idA = parseInt(a.id, 10);
                const idB = parseInt(b.id, 10);
                if (!isNaN(idA) && !isNaN(idB)) return idA - idB;
                return 0;
            });

            elements.forEach((e, idx) => e.index = idx + 1);
            state.allElements = elements;
            const foundCount = elements.length;

            updateLoadingOverlay('Restoring page', foundCount, foundCount);

            await new Promise(r => setTimeout(r, CONFIG.RESTORE_DELAY));
            aggressiveRestore(state.unloadedElements);
            state.unloadedElements = null;

            setTimeout(async () => {
                removeLoadingOverlay();
                showToast(`Synced ${foundCount} elements!`, 'success');
                updatePluginUI();

                const firstDiscoveryCount = state.allElements.filter(e => e.isFirstDiscovery).length;
                let message = `⚡ SYNC COMPLETE ⚡\n\nScanned: ${totalItems.toLocaleString()} / ${expectedTotal.toLocaleString()} items (${percentLoaded.toFixed(1)}%)\nTotal Elements: ${foundCount}\nFirst Discoveries: ${firstDiscoveryCount}\n`;
                if (percentLoaded < 100) message += `\n⚠️ WARNING: Only ${percentLoaded.toFixed(1)}% loaded!\nSome items may be missing.`;
                message += `\n\nReady to export!`;
                await showModal(percentLoaded >= 100 ? 'SYNC COMPLETE' : 'SYNC COMPLETE (PARTIAL)', message, percentLoaded >= 100 ? 'success' : 'warning', [{ text: 'AWESOME!' }]);
            }, 300);

        } catch (e) {
            console.error('[SYNC]', e);
            aggressiveRestore(state.unloadedElements);
            state.unloadedElements = null;
            removeLoadingOverlay();
            showToast(`Scan failed!`, 'error');
            await showModal('SYNC ERROR', `${e.message || e}`, 'error', [{ text: 'OK' }]);
        } finally {
            state.isScanning = false;
            if (scanBtn) {
                scanBtn.textContent = '⚡ [SYNC ALL] ⚡';
                scanBtn.disabled = false;
            }
        }
    }

    function exportAsJSON() {
        if (state.allElements.length === 0) {
            showToast('No elements! Sync first.', 'warning');
            return;
        }

        const firstDiscoveryCount = state.allElements.filter(e => e.isFirstDiscovery).length;
        const exportData = {
            pluginVersion: CONFIG.VERSION,
            exportDate: new Date().toISOString(),
            exportDateFormatted: new Date().toLocaleString(),
            totalElements: state.allElements.length,
            totalFirstDiscoveries: firstDiscoveryCount,
            elements: state.allElements.map((e) => ({ index: e.index, id: e.id, name: e.name, emoji: e.emoji, text: e.text, isFirstDiscovery: e.isFirstDiscovery, scannedAt: e.scannedDate, timestamp: e.scanned }))
        };

        try {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinite-craft-ALL-ELEMENTS-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`Exported ${state.allElements.length} elements!`, 'success');
        } catch (e) {
            console.error('[SYNC] Export JSON error:', e);
            showToast('Export failed!', 'error');
        }
    }

    function exportAsCSV() {
        if (state.allElements.length === 0) {
            showToast('No elements!', 'warning');
            return;
        }

        let csv = 'Index,ID,Emoji,Name,First Discovery,Scanned At\n';
        state.allElements.forEach(e => {
            const name = (e.text || '').replace(/"/g, '""');
            csv += `${e.index},${e.id},"${e.emoji}","${name}",${e.isFirstDiscovery ? 'YES' : 'NO'},"${e.scannedDate}"\n`;
        });

        try {
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinite-craft-ALL-ELEMENTS-${Date.now()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`Exported CSV!`, 'success');
        } catch (e) {
            console.error('[SYNC] Export CSV error:', e);
            showToast('CSV failed!', 'error');
        }
    }

    function exportAsTxt() {
        if (state.allElements.length === 0) {
            showToast('No elements!', 'warning');
            return;
        }

        const firstDiscoveryCount = state.allElements.filter(e => e.isFirstDiscovery).length;
        let txt = `INFINITE CRAFT - ALL ELEMENTS\nTotal Elements: ${state.allElements.length}\nFirst Discoveries: ${firstDiscoveryCount}\nExported: ${new Date().toLocaleString()}\n${'='.repeat(60)}\n\n`;
        state.allElements.forEach(e => {
            txt += `${e.index}. ${e.name}`;
            if (e.isFirstDiscovery) txt += ' 🌟';
            txt += '\n';
        });

        try {
            const blob = new Blob([txt], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinite-craft-ALL-ELEMENTS-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`Exported TXT!`, 'success');
        } catch (e) {
            console.error('[SYNC] Export TXT error:', e);
            showToast('TXT failed!', 'error');
        }
    }

    async function clearElements() {
        if (state.allElements.length === 0) {
            showToast('No data!', 'info');
            return;
        }

        const confirmed = await showModal('CLEAR DATA', `Clear all ${state.allElements.length} synced elements?\n\nYou'll need to sync again to export.`, 'warning', [{ text: 'CLEAR', value: true }, { text: 'CANCEL', value: false }]);
        if (confirmed) {
            state.allElements = [];
            updatePluginUI();
            showToast('Cleared!', 'info');
        }
    }

    function updatePluginUI() {
        requestAnimationFrame(() => {
            const counter = document.getElementById('sync-element-count');
            if (counter) counter.textContent = state.allElements.length.toLocaleString();

            const discoveryCounter = document.getElementById('sync-discovery-count');
            if (discoveryCounter) {
                const firstDiscoveries = state.allElements.filter(e => e.isFirstDiscovery).length;
                discoveryCounter.textContent = firstDiscoveries.toLocaleString();
            }

            const list = document.getElementById('sync-element-list');
            if (list) {
                if (state.allElements.length === 0) {
                    list.innerHTML = '<div style="font-size:11px;opacity:0.7;font-style:italic;text-align:center;padding:20px;">Click [SYNC ALL] to scan!<br><br>⚠️ Data is not saved - sync each session</div>';
                } else {
                    const displayItems = state.allElements.slice(0, CONFIG.LIST_PREVIEW_LIMIT);
                    const fragment = document.createDocumentFragment();
                    displayItems.forEach((e) => {
                        const div = document.createElement('div');
                        div.className = 'element-item';
                        div.style.cssText = `margin-bottom:4px;padding:6px 8px;background:var(--theme-surface);border-radius:3px;border-left:3px solid ${e.isFirstDiscovery ? 'var(--theme-success)' : 'var(--theme-info)'}`;
                        div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><span style="font-weight:700;font-size:11px;flex:1;">#${e.index} ${e.name} ${e.isFirstDiscovery ? '🌟' : ''}</span><span style="font-size:9px;opacity:0.6;font-weight:600;">ID:${e.id}</span></div>`;
                        fragment.appendChild(div);
                    });
                    list.innerHTML = '';
                    list.appendChild(fragment);
                    if (state.allElements.length > CONFIG.LIST_PREVIEW_LIMIT) {
                        const moreDiv = document.createElement('div');
                        moreDiv.style.cssText = 'font-size:10px;opacity:0.6;text-align:center;margin-top:8px;font-weight:700;padding:6px;background:var(--theme-accentDim);border-radius:3px;';
                        moreDiv.textContent = `...${state.allElements.length - CONFIG.LIST_PREVIEW_LIMIT} more (Total: ${state.allElements.length})`;
                        list.appendChild(moreDiv);
                    }
                }
            }
        });
    }

    function createPluginUI() {
        return `
            <div class="section-title" style="display:flex;justify-content:space-between;align-items:center;">
                <span>⚡ ELEMENT SYNC MAX</span>
                <span style="font-size:9px;opacity:0.8;font-weight:700;">${CONFIG.VERSION}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                <div class="data-box">
                    <div class="data-box-header">Total Elements</div>
                    <div class="data-box-value" id="sync-element-count" style="font-size:32px;text-shadow:0 0 10px var(--theme-info);">0</div>
                </div>
                <div class="data-box">
                    <div class="data-box-header">First Discoveries</div>
                    <div class="data-box-value" id="sync-discovery-count" style="font-size:32px;text-shadow:0 0 10px var(--theme-success);">0</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
                <button id="sync-scan-btn" class="small-btn" style="flex:1;background:var(--theme-info);color:#000;border:2px solid var(--theme-info);padding:14px !important;font-weight:700;font-size:13px !important;text-shadow:0 0 5px rgba(0,0,0,0.3);">⚡ [SYNC ALL] ⚡</button>
            </div>
            <div class="discoveries" id="sync-element-list" style="max-height:280px;margin-bottom:12px;overflow-y:auto;border:1px solid var(--theme-border);border-radius:4px;padding:8px;background:var(--theme-accentDim);">
                <div style="font-size:11px;opacity:0.7;font-style:italic;text-align:center;padding:20px;">Click [SYNC ALL] to scan!<br><br>⚠️ Data is not saved - sync each session</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">
                <button id="sync-export-json-btn" class="small-btn" style="background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);padding:10px !important;font-weight:700;font-size:11px;">[JSON]</button>
                <button id="sync-export-csv-btn" class="small-btn" style="background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);padding:10px !important;font-weight:700;font-size:11px;">[CSV]</button>
                <button id="sync-export-txt-btn" class="small-btn" style="background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);padding:10px !important;font-weight:700;font-size:11px;">[TXT]</button>
            </div>
            <div style="display:flex;gap:8px;margin-bottom:10px;">
                <button id="sync-clear-btn" class="small-btn" style="flex:1;background:transparent;color:var(--theme-error);border:2px solid var(--theme-error);padding:10px !important;font-weight:700;font-size:11px;">[CLEAR DATA]</button>
            </div>
            <div style="font-size:9px;color:var(--theme-textSecondary);padding:10px;background:var(--theme-surface);border-radius:4px;border:1px solid var(--theme-border);line-height:1.7;">
                <div style="font-weight:700;margin-bottom:8px;color:var(--theme-text);font-size:10px;">⚡ MAXIMUM SPEED:</div>
                <div>• 3ms scroll intervals (66% faster)</div>
                <div>• Aggressive DOM unloading</div>
                <div>• Removes instances & canvases</div>
                <div>• RAF-powered updates</div>
                <div>• Smart batching & caching</div>
                <div>• Auto-retry with recovery</div>
                <div>• Marks first discoveries 🌟</div>
                <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--theme-border);font-weight:600;color:var(--theme-warning);">⚠️ NOT SAVED - Sync each session</div>
                <div style="margin-top:4px;padding-top:4px;border-top:1px solid var(--theme-border);font-weight:600;">Alt+Y = Sync | Alt+E = Export JSON</div>
            </div>
        `;
    }

    function setupEventListeners() {
        const timeout = setTimeout(() => {
            const scanBtn = document.getElementById('sync-scan-btn');
            const exportJsonBtn = document.getElementById('sync-export-json-btn');
            const exportCsvBtn = document.getElementById('sync-export-csv-btn');
            const exportTxtBtn = document.getElementById('sync-export-txt-btn');
            const clearBtn = document.getElementById('sync-clear-btn');

            if (scanBtn) scanBtn.addEventListener('click', scanAllElements);
            if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportAsJSON);
            if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportAsCSV);
            if (exportTxtBtn) exportTxtBtn.addEventListener('click', exportAsTxt);
            if (clearBtn) clearBtn.addEventListener('click', clearElements);
        }, 100);
        addCleanup(() => clearTimeout(timeout));
    }

    function setupKeyboardShortcuts() {
        state.keydownHandler = (e) => {
            if (e.target.matches('input, textarea')) return;
            if (e.altKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                exportAsJSON();
            }
            if (e.altKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                if (!state.isScanning) scanAllElements();
            }
        };
        document.addEventListener('keydown', state.keydownHandler);
        addCleanup(() => {
            if (state.keydownHandler) {
                document.removeEventListener('keydown', state.keydownHandler);
            }
        });
    }

    function waitForMainScriptReady() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            console.log('[SYNC] Waiting for main script...');

            const checkReady = setInterval(() => {
                attempts++;

                const mainLoadingScreen = document.getElementById('auto-dragger-loading');
                const hasAPI = window.InfiniteCraftAutoDragger;
                const mainPanel = document.getElementById('auto-dragger-panel');

                if (hasAPI && !mainLoadingScreen && mainPanel) {
                    clearInterval(checkReady);
                    console.log('[SYNC] Main script ready, initializing plugin...');
                    state.mainScriptReady = true;
                    resolve();
                    return;
                }

                if (attempts >= CONFIG.MAX_INIT_ATTEMPTS) {
                    clearInterval(checkReady);
                    console.error('[SYNC] Timeout waiting for main script');
                    reject(new Error('Main script not found'));
                }
            }, CONFIG.LOADING_SCREEN_CHECK_INTERVAL);

            addCleanup(() => clearInterval(checkReady));
        });
    }

    function registerPlugin() {
        if (!window.InfiniteCraftAutoDragger) {
            console.error('[SYNC] Main API not available');
            return;
        }

        state.api = window.InfiniteCraftAutoDragger;

        const plugin = {
            name: 'Element Sync Max',
            version: CONFIG.VERSION,
            author: 'Silverfox0338',

            init: function(api) {
                state.api = api;

                const uiHTML = createPluginUI();
                api.addCustomUI(`<div id="element-sync-plugin-section" class="section" style="border:2px solid var(--theme-info);box-shadow:0 0 10px var(--theme-info);">${uiHTML}</div>`, 'settings');

                setupEventListeners();
                setupKeyboardShortcuts();
                updatePluginUI();

                api.on('onThemeChange', () => {
                    cachedTheme = null;
                    cachedColors = null;
                });

                console.log(`[SYNC] ${CONFIG.VERSION} initialized`);
                showToast('Element Sync MAX ready!', 'success');
            },

            onReady: function() {
                updatePluginUI();
            }
        };

        window.InfiniteCraftAutoDragger.registerPlugin(plugin);
    }

    async function initPlugin() {
        try {
            await waitForMainScriptReady();
            registerPlugin();
        } catch (e) {
            console.error('[SYNC] Initialization failed:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }

    window.elementSyncPlugin = {
        version: CONFIG.VERSION,
        scan: scanAllElements,
        exportJSON: exportAsJSON,
        exportCSV: exportAsCSV,
        exportTXT: exportAsTxt,
        clear: clearElements,
        getElements: () => state.allElements,
        getCount: () => state.allElements.length,
        getFirstDiscoveries: () => state.allElements.filter(e => e.isFirstDiscovery),
        cleanup: cleanup
    };

    window.addEventListener('beforeunload', cleanup);
    addCleanup(() => window.removeEventListener('beforeunload', cleanup));

})();