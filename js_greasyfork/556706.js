// ==UserScript==
// @name         Infinite Craft - Auto Dragger PRO - Admin Plugin
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  Enhanced Queue UI + Real-time Path Display + Progress Tracking
// @author       Silverfox0338
// @license      CC-BY-NC-ND-4.0
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556706/Infinite%20Craft%20-%20Auto%20Dragger%20PRO%20-%20Admin%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/556706/Infinite%20Craft%20-%20Auto%20Dragger%20PRO%20-%20Admin%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ADMIN_VERSION = 'v5.6';
    const API_ENDPOINT = 'https://neal.fun/api/infinite-craft/pair';

    // ============================================================================
    // SPEED PRESETS
    // ============================================================================
    const SPEED_PRESETS = {
        'ultra-fast': {
            name: '⚡ ULTRA FAST',
            delay: 100,
            craftDelay: 300,
            combineWait: 600,
            clearWait: 200,
            dragSteps: 8,
            dragStepDelay: 10,
            retryDelay: 500,
            description: 'Maximum speed - may miss some crafts'
        },
        'fast': {
            name: '🚀 FAST',
            delay: 200,
            craftDelay: 500,
            combineWait: 800,
            clearWait: 300,
            dragSteps: 10,
            dragStepDelay: 15,
            retryDelay: 800,
            description: 'Fast & reliable (recommended)'
        },
        'balanced': {
            name: '⚖️ BALANCED',
            delay: 400,
            craftDelay: 800,
            combineWait: 1200,
            clearWait: 400,
            dragSteps: 12,
            dragStepDelay: 20,
            retryDelay: 1000,
            description: 'Balanced speed & safety'
        },
        'safe': {
            name: '🛡️ SAFE',
            delay: 800,
            craftDelay: 1500,
            combineWait: 2000,
            clearWait: 500,
            dragSteps: 15,
            dragStepDelay: 25,
            retryDelay: 1500,
            description: 'Slower but very reliable'
        },
        'super-safe': {
            name: '🔒 SUPER SAFE',
            delay: 1500,
            craftDelay: 2500,
            combineWait: 3000,
            clearWait: 800,
            dragSteps: 20,
            dragStepDelay: 30,
            retryDelay: 2000,
            description: 'Maximum reliability, slow speed'
        }
    };

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const state = {
        initialized: false,
        discovering: false,
        crafting: false,
        clearing: false,
        processingQueue: false,
        currentPreset: 'fast',
        failSafeActive: false,
        consecutiveErrors: 0,
        lastSuccessfulCraft: Date.now(),
        currentQueueItem: null,
        currentQueueProgress: {
            currentStep: 0,
            totalSteps: 0,
            path: [],
            status: '',
            subStatus: ''
        }
    };

    // ============================================================================
    // DATA STORAGE
    // ============================================================================
    const data = {
        recipes: new Map(),
        relationships: {},
        successRates: {},
        apiLog: [],
        targetElements: [],
        testedCombinations: new Set(),
        discoveryQueue: [],
        newDiscoveries: [],
        craftedElements: [],
        nothingCombos: [],
        errorLog: [],
        craftingQueue: [],
        craftingHistory: []
    };

    // ============================================================================
    // PERFORMANCE METRICS
    // ============================================================================
    const metrics = {
        apiCalls: 0,
        apiLatency: [],
        networkErrors: 0,
        cacheHits: 0,
        cacheMisses: 0,
        nothingResults: 0,
        successfulCrafts: 0,
        failedCrafts: 0,
        recoveryAttempts: 0,
        autoRecoveries: 0,
        queueProcessed: 0,
        queueSuccess: 0,
        queueFailed: 0
    };

    // ============================================================================
    // SETTINGS
    // ============================================================================
    let settings = {
        delay: 200,
        maxAttempts: 999999,
        craftDelay: 500,
        combineWait: 800,
        clearWait: 300,
        dragSteps: 10,
        dragStepDelay: 15,
        retryDelay: 800,
        maxRecipes: 5000,
        maxApiLogs: 500,
        maxCrafted: 1000,
        maxDiscoveries: 500,
        maxErrors: 100,
        smartMode: true,
        randomMode: false,
        autoRecovery: true,
        maxConsecutiveErrors: 5,
        recoveryDelay: 3000,
        verifyRetries: 3,
        maxQueueSize: 50,
        queueAutoProcess: true,
        focusedDiscoveryAttempts: 500
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function trimArray(arr, maxLength) {
        while (arr.length > maxLength) {
            arr.shift();
        }
    }

    function generateComboKey(elem1, elem2) {
        return [elem1, elem2].sort().join('::');
    }

    function generateRecipeKey(elem1, elem2, result) {
        return `${elem1}::${elem2}::${result}`;
    }

    function isNothing(result) {
        if (!result) return true;
        const normalized = result.toString().toLowerCase().trim();
        return normalized === 'nothing' || normalized === '';
    }

    function logError(context, error, details = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            context,
            error: error.message || error.toString(),
            details,
            preset: state.currentPreset
        };
        data.errorLog.unshift(errorEntry);
        trimArray(data.errorLog, settings.maxErrors);
        console.error(`[ADMIN ERROR] ${context}:`, error, details);
    }

    function updateQueueProgress(status, subStatus = '', step = 0, total = 0, path = []) {
        state.currentQueueProgress = {
            currentStep: step,
            totalSteps: total,
            path: path,
            status: status,
            subStatus: subStatus
        };
        updateQueueUI();
    }

    // ============================================================================
    // SPEED PRESET MANAGEMENT
    // ============================================================================

    function applyPreset(presetKey) {
        const preset = SPEED_PRESETS[presetKey];
        if (!preset) {
            console.warn('[ADMIN] Invalid preset:', presetKey);
            return false;
        }

        settings.delay = preset.delay;
        settings.craftDelay = preset.craftDelay;
        settings.combineWait = preset.combineWait;
        settings.clearWait = preset.clearWait;
        settings.dragSteps = preset.dragSteps;
        settings.dragStepDelay = preset.dragStepDelay;
        settings.retryDelay = preset.retryDelay;

        state.currentPreset = presetKey;
        saveSettings();
        updatePresetUI();

        console.log(`[ADMIN] Applied preset: ${preset.name}`, settings);
        showToast(`Preset: ${preset.name}`, 'success');
        return true;
    }

    function updatePresetUI() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            const presetKey = btn.getAttribute('data-preset');
            if (presetKey === state.currentPreset) {
                btn.classList.add('active');
                btn.style.background = 'var(--theme-accent)';
                btn.style.color = 'var(--theme-bg)';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.color = 'var(--theme-accent)';
            }
        });

        const preset = SPEED_PRESETS[state.currentPreset];
        const infoEl = document.getElementById('admin-preset-info');
        if (infoEl && preset) {
            infoEl.innerHTML = `
                <div style="font-weight:700;margin-bottom:4px;">${preset.name}</div>
                <div style="font-size:10px;opacity:0.8;">${preset.description}</div>
                <div style="font-size:9px;opacity:0.6;margin-top:4px;">
                    Delay: ${preset.delay}ms | Craft: ${preset.craftDelay}ms
                </div>
            `;
        }
    }

    // ============================================================================
    // FAIL-SAFE & AUTO-RECOVERY
    // ============================================================================

    async function activateFailSafe(reason) {
        if (state.failSafeActive) return;

        state.failSafeActive = true;
        metrics.recoveryAttempts++;

        console.warn(`[ADMIN FAIL-SAFE] Activated: ${reason}`);
        showToast(`🛡️ Fail-safe: ${reason}`, 'warning');

        try {
            const wasDiscovering = state.discovering;
            state.discovering = false;
            state.crafting = false;
            state.clearing = false;

            await wait(settings.recoveryDelay);
            await clearBoard();
            await wait(500);

            state.consecutiveErrors = 0;

            if (wasDiscovering && settings.autoRecovery) {
                showToast('🔄 Auto-resuming...', 'info');
                await wait(1000);
                state.discovering = true;
                metrics.autoRecoveries++;
            }

            console.log('[ADMIN FAIL-SAFE] Recovery complete');
        } catch (error) {
            logError('Fail-safe recovery', error);
        } finally {
            state.failSafeActive = false;
        }
    }

    async function handleError(context, error, critical = false) {
        logError(context, error);
        state.consecutiveErrors++;
        metrics.networkErrors++;

        if (critical || state.consecutiveErrors >= settings.maxConsecutiveErrors) {
            await activateFailSafe(`${state.consecutiveErrors} consecutive errors`);
        } else {
            await wait(settings.retryDelay);
        }
    }

    function resetErrorCounter() {
        if (state.consecutiveErrors > 0) {
            console.log(`[ADMIN] Error counter reset (was ${state.consecutiveErrors})`);
            state.consecutiveErrors = 0;
        }
        state.lastSuccessfulCraft = Date.now();
    }

    // ============================================================================
    // THEME & UI HELPERS
    // ============================================================================

    function getCurrentTheme() {
        try {
            const badge = document.querySelector('.theme-badge');
            if (badge) return badge.textContent.toLowerCase().trim();
        } catch (e) {}
        return localStorage.getItem('infinecraft_theme_preset') || 'hacker';
    }

    function getThemeColors() {
        const theme = getCurrentTheme();
        const themes = {
            hacker: {
                bg: '#000', bgOverlay: 'rgba(0, 20, 0, 0.98)', border: '#0f0',
                text: '#0f0', textSecondary: '#0a0', accent: '#0f0',
                accentDim: 'rgba(0, 255, 0, 0.2)', success: '#10b981',
                error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
                btnBg: '#001a00', surface: 'rgba(0, 255, 0, 0.05)',
                surfaceHover: 'rgba(0, 255, 0, 0.1)', borderColor: 'rgba(0, 255, 0, 0.2)',
                font: "'Courier New', monospace"
            },
            furry: {
                bg: '#fff0f5', bgOverlay: 'rgba(255, 240, 245, 0.98)', border: '#ff69b4',
                text: '#880044', textSecondary: '#ff8da1', accent: '#ff1493',
                accentDim: 'rgba(255, 105, 180, 0.1)', success: '#ff1493',
                error: '#ff0000', warning: '#ffca00', info: '#00bfff',
                btnBg: '#ffe4f0', surface: 'rgba(255, 255, 255, 0.6)',
                surfaceHover: 'rgba(255, 192, 203, 0.3)', borderColor: 'rgba(255, 105, 180, 0.3)',
                font: "'Comic Sans MS', 'Chalkboard SE', sans-serif"
            },
            synthwave: {
                bg: '#140028', bgOverlay: 'rgba(20, 0, 40, 0.98)', border: '#00f3ff',
                text: '#ff00ff', textSecondary: '#bd00ff', accent: '#00f3ff',
                accentDim: 'rgba(0, 243, 255, 0.15)', success: '#00ff9d',
                error: '#ff2a2a', warning: '#ffdd00', info: '#00f3ff',
                btnBg: '#2a0050', surface: 'rgba(255, 0, 255, 0.05)',
                surfaceHover: 'rgba(0, 243, 255, 0.1)', borderColor: 'rgba(0, 243, 255, 0.3)',
                font: "'Courier New', monospace"
            }
        };
        return themes[theme] || themes.hacker;
    }

    function showToast(message, type = 'info') {
        const colors = getThemeColors();
        const typeColors = {
            success: colors.success,
            error: colors.error,
            info: colors.info,
            warning: colors.warning
        };
        const bgColor = typeColors[type] || typeColors.info;
        const textColor = getCurrentTheme() === 'furry' ? '#fff' : '#000';

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 140px; left: 20px; background: ${bgColor};
            padding: 16px 24px; border-radius: 8px; color: ${textColor};
            font-family: ${colors.font}; font-size: 13px;
            box-shadow: 0 0 20px ${bgColor}; z-index: 10005;
            max-width: 300px; word-wrap: break-word;
            font-weight: 700; border: 2px solid ${colors.border};
            animation: adminSlideIn 0.3s ease-out;
        `;

        const theme = getCurrentTheme();
        const prefix = theme === 'hacker' ? '⚡ ' : theme === 'furry' ? '★ ' : '◆ ';
        const suffix = theme === 'furry' ? ' UwU' : '';
        toast.textContent = prefix + '[ADMIN] ' + message + suffix;

        if (!document.getElementById('admin-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'admin-toast-styles';
            style.textContent = `
                @keyframes adminSlideIn {
                    from { transform: translateX(-400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes adminSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-400px); opacity: 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes progressBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'adminSlideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    async function showModal(title, message, type = 'info', buttons = [{ text: 'OK', action: null }]) {
        return new Promise((resolve) => {
            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: ${colors.bg}ee; backdrop-filter: blur(10px); z-index: 100000;
                display: flex; align-items: center; justify-content: center;
                font-family: ${colors.font}; animation: modalFadeIn 0.3s ease;
            `;

            const typeIcons = { info: 'ℹ️', success: '✓', error: '✗', warning: '⚠️', question: '?' };
            const typeColors = {
                info: colors.accent,
                success: colors.success,
                error: colors.error,
                warning: colors.warning,
                question: colors.accent
            };
            const icon = typeIcons[type] || typeIcons.info;
            const iconColor = typeColors[type] || typeColors.info;

            modal.innerHTML = `
                <style>
                    @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes modalSlideIn {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .modal-box {
                        background: ${colors.bgOverlay}; border: 2px solid ${colors.border};
                        border-radius: 8px; padding: 30px 40px;
                        box-shadow: 0 0 40px ${colors.border}80;
                        min-width: 400px; max-width: 600px; animation: modalSlideIn 0.3s ease;
                        max-height: 80vh; overflow-y: auto;
                    }
                    .modal-icon {
                        font-size: 48px; text-align: center; margin-bottom: 20px;
                        color: ${iconColor}; text-shadow: 0 0 20px ${iconColor}; font-weight: 700;
                    }
                    .modal-title {
                        font-size: 20px; font-weight: 700; text-align: center;
                        margin-bottom: 20px; color: ${colors.text};
                        text-transform: uppercase; letter-spacing: 2px;
                    }
                    .modal-message {
                        font-size: 14px; line-height: 1.8; text-align: center;
                        margin-bottom: 25px; color: ${colors.textSecondary}; white-space: pre-line;
                    }
                    .modal-buttons { display: flex; gap: 12px; justify-content: center; }
                    .modal-btn {
                        padding: 12px 30px; border: 2px solid ${colors.border};
                        border-radius: 4px; background: ${colors.btnBg};
                        color: ${colors.text}; font-family: ${colors.font};
                        font-size: 12px; font-weight: 700;
                        cursor: pointer; transition: all 0.2s ease;
                        text-transform: uppercase; letter-spacing: 1px;
                    }
                    .modal-btn:hover {
                        background: ${colors.accent}; color: ${colors.bg};
                        box-shadow: 0 0 15px ${colors.accent}; transform: scale(1.05);
                    }
                    .modal-btn.primary {
                        background: ${colors.accent}; color: ${colors.bg};
                        border-color: ${colors.accent};
                    }
                    .modal-btn.primary:hover { box-shadow: 0 0 20px ${colors.accent}; }
                </style>
                <div class="modal-box">
                    <div class="modal-icon">${icon}</div>
                    <div class="modal-title">${title}</div>
                    <div class="modal-message">${message}</div>
                    <div class="modal-buttons" id="modal-buttons"></div>
                </div>
            `;

            document.body.appendChild(modal);
            const buttonsContainer = modal.querySelector('#modal-buttons');
            buttons.forEach((btn, index) => {
                const button = document.createElement('button');
                button.className = index === 0 ? 'modal-btn primary' : 'modal-btn';
                button.textContent = btn.text;
                button.addEventListener('click', () => {
                    modal.style.opacity = '0';
                    modal.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        modal.remove();
                        resolve(btn.value !== undefined ? btn.value : true);
                        if (btn.action) btn.action();
                    }, 300);
                });
                buttonsContainer.appendChild(button);
            });
        });
    }

    // ============================================================================
    // ELEMENT DETECTION & MANIPULATION
    // ============================================================================

    function findSidebarElement(elementName) {
        const sidebarItems = document.querySelectorAll('.sidebar-inner .item');
        for (const item of sidebarItems) {
            const text = item.getAttribute('data-item-text');
            if (text && text.toLowerCase() === elementName.toLowerCase()) {
                return item;
            }
        }
        return null;
    }

    function hasElement(elementName) {
        return !!findSidebarElement(elementName);
    }

    function getAllAvailableElements() {
        const elements = new Set(['Fire', 'Water', 'Earth', 'Wind']);

        data.recipes.forEach((recipe) => {
            if (!isNothing(recipe.result)) {
                elements.add(recipe.ingredient1);
                elements.add(recipe.ingredient2);
                elements.add(recipe.result);
            }
        });

        Object.keys(data.relationships).forEach(elem => elements.add(elem));

        const sidebarItems = document.querySelectorAll('.sidebar-inner .item');
        sidebarItems.forEach(item => {
            const text = item.getAttribute('data-item-text');
            if (text) elements.add(text);
        });

        return Array.from(elements);
    }

    // ============================================================================
    // BOARD CLEARING
    // ============================================================================

    async function clearBoard() {
        if (state.clearing) {
            console.log('[ADMIN] Already clearing...');
            return;
        }

        state.clearing = true;
        try {
            console.log('[ADMIN] Clearing board...');

            const clearBtn = document.querySelector(".clear");
            if (clearBtn) {
                clearBtn.click();
                await wait(150);

                const yesBtn = Array.from(document.querySelectorAll("button"))
                    .find(b => b.textContent.trim().toLowerCase() === "yes");

                if (yesBtn) {
                    yesBtn.click();
                    await wait(settings.clearWait);

                    const remaining = document.querySelectorAll('.instance').length;
                    if (remaining === 0) {
                        console.log('[ADMIN] Board cleared via button');
                        state.clearing = false;
                        return;
                    }
                }
            }

            const instances = document.querySelectorAll('.instance');
            if (instances.length > 0) {
                console.log(`[ADMIN] Removing ${instances.length} instances directly`);
                instances.forEach(instance => {
                    try {
                        instance.remove();
                    } catch (e) {
                        console.error('[ADMIN] Error removing instance:', e);
                    }
                });
                await wait(settings.clearWait);
                console.log('[ADMIN] Board cleared via direct removal');
            }

            const finalInstances = document.querySelectorAll('.instance').length;
            if (finalInstances > 0) {
                console.warn(`[ADMIN] ${finalInstances} instances still remain after clearing`);
            }
        } catch (error) {
            logError('Board clearing', error);
        } finally {
            state.clearing = false;
        }
    }

    // ============================================================================
    // MOUSE EVENT SIMULATION
    // ============================================================================

    function fireMouseEvent(type, coords, targetEl) {
        const evt = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: coords.x,
            clientY: coords.y,
            view: window,
            buttons: type === 'mousemove' ? 1 : 0
        });
        targetEl.dispatchEvent(evt);
    }

    async function dragElement(element, targetPos) {
        const rect = element.getBoundingClientRect();
        const start = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        fireMouseEvent("mousedown", start, element);
        await wait(30);

        const steps = settings.dragSteps;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const x = start.x + (targetPos.x - start.x) * t;
            const y = start.y + (targetPos.y - start.y) * t;
            const currentElement = document.elementFromPoint(x, y) || document.body;
            fireMouseEvent("mousemove", { x, y }, currentElement);
            await wait(settings.dragStepDelay);
        }

        const finalTarget = document.elementFromPoint(targetPos.x, targetPos.y) || document.body;
        fireMouseEvent("mouseup", targetPos, finalTarget);
        await wait(50);
    }

    // ============================================================================
    // ELEMENT CRAFTING
    // ============================================================================

    async function craftElement(element1Name, element2Name, resultName) {
        if (state.crafting) {
            console.log('[ADMIN] Already crafting...');
            return false;
        }

        if (isNothing(resultName)) {
            console.log('[ADMIN] Skipping craft for Nothing');
            return false;
        }

        state.crafting = true;
        let retryCount = 0;

        try {
            while (retryCount < settings.verifyRetries) {
                try {
                    if (!hasElement(element1Name) || !hasElement(element2Name)) {
                        console.log(`[ADMIN] Missing elements: ${element1Name}, ${element2Name}`);
                        return false;
                    }

                    const item1 = findSidebarElement(element1Name);
                    const item2 = findSidebarElement(element2Name);
                    const canvas = document.querySelector('.container.infinite-craft');

                    if (!item1 || !item2 || !canvas) {
                        console.log('[ADMIN] Missing items or canvas');
                        return false;
                    }

                    const canvasRect = canvas.getBoundingClientRect();
                    const centerX = canvasRect.left + canvasRect.width / 2;
                    const centerY = canvasRect.top + canvasRect.height / 2;
                    const targetPos = { x: centerX, y: centerY };

                    console.log(`[ADMIN] Crafting (attempt ${retryCount + 1}): ${element1Name} + ${element2Name} = ${resultName}`);

                    await dragElement(item1, targetPos);
                    await wait(150);

                    await dragElement(item2, targetPos);

                    await wait(settings.combineWait);

                    const instanceOnCanvas = Array.from(document.querySelectorAll('.instance')).find(inst => {
                        const textEl = inst.querySelector('.instance-text');
                        return textEl && textEl.textContent.trim().toLowerCase() === resultName.toLowerCase();
                    });

                    if (instanceOnCanvas) {
                        console.log(`[ADMIN] Found result on canvas: ${resultName}`);

                        const instRect = instanceOnCanvas.getBoundingClientRect();
                        const instCenter = {
                            x: instRect.left + instRect.width / 2,
                            y: instRect.top + instRect.height / 2
                        };

                        const sidebar = document.querySelector('.sidebar');
                        if (sidebar) {
                            const sidebarRect = sidebar.getBoundingClientRect();
                            const sidebarTarget = {
                                x: sidebarRect.left + sidebarRect.width / 2,
                                y: sidebarRect.top + 100
                            };

                            await dragElement(instanceOnCanvas, sidebarTarget);
                            await wait(200);
                        }
                    }

                    await wait(settings.craftDelay);

                    const crafted = hasElement(resultName);

                    if (crafted) {
                        console.log(`[ADMIN] ✓ Successfully crafted: ${resultName}`);
                        metrics.successfulCrafts++;
                        resetErrorCounter();
                        return true;
                    } else {
                        console.log(`[ADMIN] ✗ Craft verification failed (attempt ${retryCount + 1}): ${resultName}`);
                        retryCount++;

                        if (retryCount < settings.verifyRetries) {
                            console.log(`[ADMIN] Retrying craft after delay...`);
                            await wait(settings.retryDelay);
                        }
                    }
                } catch (craftError) {
                    logError(`Craft attempt ${retryCount + 1}`, craftError, { element1Name, element2Name, resultName });
                    retryCount++;

                    if (retryCount < settings.verifyRetries) {
                        await wait(settings.retryDelay);
                    }
                }
            }

            console.log(`[ADMIN] ✗ Failed to craft after ${retryCount} attempts: ${resultName}`);
            metrics.failedCrafts++;
            return false;

        } finally {
            state.crafting = false;
        }
    }

    // ============================================================================
    // API & COMBINATION TESTING
    // ============================================================================

    async function testCombination(element1, element2) {
        if (!element1 || !element2) {
            console.log('[ADMIN] Invalid elements provided');
            return null;
        }

        const comboKey = generateComboKey(element1, element2);
        if (data.testedCombinations.has(comboKey)) {
            metrics.cacheHits++;
            console.log(`[ADMIN] Combo already tested: ${comboKey}`);
            return null;
        }

        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const url = `${API_ENDPOINT}?first=${encodeURIComponent(element1)}&second=${encodeURIComponent(element2)}`;
                const startTime = performance.now();

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const apiData = await response.json();
                const latency = performance.now() - startTime;

                data.testedCombinations.add(comboKey);
                metrics.cacheMisses++;

                metrics.apiCalls++;
                metrics.apiLatency.push(latency);
                if (metrics.apiLatency.length > 100) metrics.apiLatency.shift();

                const result = {
                    element1,
                    element2,
                    result: apiData.result || 'Nothing',
                    emoji: apiData.emoji || '❌',
                    isNew: apiData.isNew || false,
                    timestamp: Date.now(),
                    latency: latency.toFixed(2) + 'ms'
                };

                recordRecipe(element1, element2, result.result, apiData.isNew);
                logAPICall(url, latency, response.status);

                if (isNothing(apiData.result)) {
                    console.log(`[ADMIN] Combo resulted in Nothing: ${element1} + ${element2}`);
                    metrics.nothingResults++;
                    data.nothingCombos.push({
                        combo: `${element1} + ${element2}`,
                        timestamp: Date.now()
                    });
                    trimArray(data.nothingCombos, 100);

                    updateDiscoveryUI();
                    updateAdminUI();
                    saveAdminData();
                    resetErrorCounter();
                    return result;
                }

                const alreadyHave = hasElement(apiData.result);

                if (!alreadyHave) {
                    if (apiData.isNew) {
                        data.newDiscoveries.push(result);
                        trimArray(data.newDiscoveries, settings.maxDiscoveries);
                        showToast(`NEW! ${apiData.emoji} ${apiData.result}`, 'success');
                    }

                    const crafted = await craftElement(element1, element2, apiData.result);

                    if (crafted) {
                        await wait(200);
                        const verified = hasElement(apiData.result);

                        if (verified) {
                            console.log(`[ADMIN] ✓ Craft verified: ${apiData.result}`);

                            data.craftedElements.push({
                                name: apiData.result,
                                emoji: apiData.emoji,
                                recipe: `${element1} + ${element2}`,
                                timestamp: Date.now()
                            });
                            trimArray(data.craftedElements, settings.maxCrafted);

                            if (!data.relationships[apiData.result]) {
                                data.discoveryQueue.push(apiData.result);
                            }

                            updateCraftedUI();

                            console.log('[ADMIN] Clearing board after successful craft...');
                            await clearBoard();
                        }
                    }
                } else {
                    console.log(`[ADMIN] Already have: ${apiData.result} (not crafting)`);
                }

                updateDiscoveryUI();
                updateAdminUI();
                saveAdminData();
                resetErrorCounter();

                return result;

            } catch (error) {
                retryCount++;
                console.error(`[ADMIN] API error (attempt ${retryCount}/${maxRetries}):`, error);

                if (retryCount < maxRetries) {
                    await wait(settings.retryDelay * retryCount);
                } else {
                    await handleError('Test combination', error);
                    return null;
                }
            }
        }

        return null;
    }

    // ============================================================================
    // DATA MANAGEMENT
    // ============================================================================

    function recordRecipe(first, second, result, isNew = false) {
        try {
            if (!first || !second || !result) return;

            const recipeKey = generateRecipeKey(first, second, result);

            if (data.recipes.has(recipeKey)) {
                return;
            }

            const recipe = {
                ingredient1: first,
                ingredient2: second,
                result: result,
                timestamp: Date.now(),
                discovered: isNew,
                isNothing: isNothing(result)
            };

            data.recipes.set(recipeKey, recipe);

            if (data.recipes.size > settings.maxRecipes) {
                const firstKey = data.recipes.keys().next().value;
                data.recipes.delete(firstKey);
            }

            if (!isNothing(result)) {
                if (!data.relationships[first]) data.relationships[first] = [];
                if (!data.relationships[second]) data.relationships[second] = [];

                data.relationships[first].push({ with: second, creates: result });
                data.relationships[second].push({ with: first, creates: result });
            }

            const key = `${first}+${second}`;
            if (!data.successRates[key]) data.successRates[key] = { attempts: 0, successes: 0 };
            data.successRates[key].attempts++;
            if (isNew && !isNothing(result)) data.successRates[key].successes++;

            updateRecipeDisplay();
            updateAdminUI();
        } catch (e) {
            logError('Record recipe', e);
        }
    }

    function logAPICall(url, latency, status) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            url: url.toString(),
            latency: latency.toFixed(2) + 'ms',
            status: status
        };
        data.apiLog.unshift(logEntry);
        trimArray(data.apiLog, settings.maxApiLogs);
        updateAPILog();
    }

    function saveSettings() {
        try {
            localStorage.setItem('infinecraft_admin_settings', JSON.stringify(settings));
            localStorage.setItem('infinecraft_admin_preset', state.currentPreset);
        } catch (e) {
            logError('Save settings', e);
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('infinecraft_admin_settings');
            if (saved) {
                const loaded = JSON.parse(saved);
                Object.assign(settings, loaded);
            }

            const savedPreset = localStorage.getItem('infinecraft_admin_preset');
            if (savedPreset && SPEED_PRESETS[savedPreset]) {
                state.currentPreset = savedPreset;
                applyPreset(savedPreset);
            }
        } catch (e) {
            logError('Load settings', e);
        }
    }

    function saveAdminData() {
        try {
            const recipesArray = Array.from(data.recipes.values());
            const maxToSave = Math.min(settings.maxRecipes, recipesArray.length);
            const recipesToSave = recipesArray.slice(-maxToSave);

            localStorage.setItem('infinecraft_admin_recipes', JSON.stringify(recipesToSave));
            localStorage.setItem('infinecraft_admin_relationships', JSON.stringify(data.relationships));
            localStorage.setItem('infinecraft_admin_success', JSON.stringify(data.successRates));
            localStorage.setItem('infinecraft_admin_targets', JSON.stringify(data.targetElements));
            localStorage.setItem('infinecraft_admin_tested', JSON.stringify(Array.from(data.testedCombinations).slice(-10000)));
            localStorage.setItem('infinecraft_admin_discoveries', JSON.stringify(data.newDiscoveries.slice(-settings.maxDiscoveries)));
            localStorage.setItem('infinecraft_admin_crafted', JSON.stringify(data.craftedElements.slice(-settings.maxCrafted)));
            localStorage.setItem('infinecraft_admin_nothing', JSON.stringify(data.nothingCombos.slice(-100)));
            localStorage.setItem('infinecraft_admin_errors', JSON.stringify(data.errorLog.slice(-settings.maxErrors)));
            localStorage.setItem('infinecraft_admin_queue', JSON.stringify(data.craftingQueue.slice(-settings.maxQueueSize)));
            localStorage.setItem('infinecraft_admin_history', JSON.stringify(data.craftingHistory.slice(-100)));
            saveSettings();
        } catch (e) {
            logError('Save data', e);
        }
    }

    function loadAdminData() {
        try {
            const recipes = localStorage.getItem('infinecraft_admin_recipes');
            const relationships = localStorage.getItem('infinecraft_admin_relationships');
            const success = localStorage.getItem('infinecraft_admin_success');
            const targets = localStorage.getItem('infinecraft_admin_targets');
            const tested = localStorage.getItem('infinecraft_admin_tested');
            const discoveries = localStorage.getItem('infinecraft_admin_discoveries');
            const crafted = localStorage.getItem('infinecraft_admin_crafted');
            const nothing = localStorage.getItem('infinecraft_admin_nothing');
            const errors = localStorage.getItem('infinecraft_admin_errors');
            const queue = localStorage.getItem('infinecraft_admin_queue');
            const history = localStorage.getItem('infinecraft_admin_history');

            loadSettings();

            if (recipes) {
                const recipesArray = JSON.parse(recipes);
                data.recipes = new Map();
                recipesArray.forEach(recipe => {
                    const key = generateRecipeKey(recipe.ingredient1, recipe.ingredient2, recipe.result);
                    data.recipes.set(key, recipe);
                });
            }
            if (relationships) data.relationships = JSON.parse(relationships);
            if (success) data.successRates = JSON.parse(success);
            if (targets) data.targetElements = JSON.parse(targets);
            if (tested) data.testedCombinations = new Set(JSON.parse(tested));
            if (discoveries) data.newDiscoveries = JSON.parse(discoveries);
            if (crafted) data.craftedElements = JSON.parse(crafted);
            if (nothing) data.nothingCombos = JSON.parse(nothing);
            if (errors) data.errorLog = JSON.parse(errors);
            if (queue) data.craftingQueue = JSON.parse(queue);
            if (history) data.craftingHistory = JSON.parse(history);
        } catch (e) {
            logError('Load data', e);
        }
    }

    async function clearRecipeDatabase() {
        if (data.recipes.size === 0) {
            showToast('No data!', 'info');
            return;
        }

        const confirmed = await showModal(
            'CLEAR RECIPES',
            `Delete all ${data.recipes.size} recipes?\n\nCannot be undone!`,
            'warning',
            [{ text: 'DELETE', value: true }, { text: 'CANCEL', value: false }]
        );

        if (confirmed) {
            data.recipes = new Map();
            data.relationships = {};
            data.successRates = {};
            data.testedCombinations.clear();
            data.newDiscoveries = [];
            data.craftedElements = [];
            data.discoveryQueue = [];
            data.nothingCombos = [];
            data.errorLog = [];
            data.craftingQueue = [];
            data.craftingHistory = [];
            saveAdminData();
            updateAdminUI();
            updateRecipeDisplay();
            updateDiscoveryUI();
            updateCraftedUI();
            updateQueueUI();
            showToast('All data cleared!', 'info');
        }
    }

    function exportRecipeDatabase() {
        if (data.recipes.size === 0) {
            showToast('No recipes yet!', 'warning');
            return;
        }

        const exportData = {
            version: ADMIN_VERSION,
            exportDate: new Date().toISOString(),
            preset: state.currentPreset,
            settings: settings,
            totalRecipes: data.recipes.size,
            newDiscoveries: data.newDiscoveries.length,
            craftedElements: data.craftedElements.length,
            testedCombinations: data.testedCombinations.size,
            nothingResults: metrics.nothingResults,
            metrics: metrics,
            recipes: Array.from(data.recipes.values()),
            relationships: data.relationships,
            successRates: data.successRates,
            discoveries: data.newDiscoveries,
            crafted: data.craftedElements,
            nothingCombos: data.nothingCombos,
            errorLog: data.errorLog,
            craftingQueue: data.craftingQueue,
            craftingHistory: data.craftingHistory
        };

        try {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `infinite-craft-ADMIN-RECIPES-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`Exported ${data.recipes.size} recipes!`, 'success');
        } catch (e) {
            logError('Export', e);
            showToast('Export failed!', 'error');
        }
    }

    // ============================================================================
    // AUTO-DISCOVERY ENGINE
    // ============================================================================

    function getUntestedCombinations(maxResults = 100) {
        const elements = getAllAvailableElements();
        const untested = [];
        const totalElements = elements.length;

        for (let i = 0; i < totalElements && untested.length < maxResults; i++) {
            for (let j = i; j < totalElements && untested.length < maxResults; j++) {
                const elem1 = elements[i];
                const elem2 = elements[j];
                const comboKey = generateComboKey(elem1, elem2);

                if (!data.testedCombinations.has(comboKey)) {
                    untested.push({ elem1, elem2 });
                }
            }
        }

        return untested;
    }

    function getSmartCombinations(maxResults = 50) {
        const elements = getAllAvailableElements();
        const smart = [];
        const newElements = data.discoveryQueue.slice(0, 10);

        for (const newElem of newElements) {
            for (const elem of elements) {
                if (smart.length >= maxResults) break;
                const comboKey = generateComboKey(newElem, elem);
                if (!data.testedCombinations.has(comboKey)) {
                    smart.push({ elem1: newElem, elem2: elem, priority: 'high' });
                }
            }
        }

        if (smart.length === 0) {
            return getUntestedCombinations(maxResults);
        }

        return smart;
    }

    async function startAutoDiscovery() {
        if (state.discovering) {
            console.log('[ADMIN] Already discovering...');
            return;
        }

        state.discovering = true;
        showToast('Auto-discovery started!', 'success');
        updateDiscoveryButton();

        let attempts = 0;
        const maxAttempts = settings.maxAttempts;

        while (state.discovering && attempts < maxAttempts) {
            attempts++;

            if (state.failSafeActive) {
                console.log('[ADMIN] Waiting for fail-safe recovery...');
                await wait(1000);
                continue;
            }

            let combo;
            if (settings.smartMode && data.discoveryQueue.length > 0) {
                const smartCombos = getSmartCombinations(1);
                combo = smartCombos[0];
            } else if (settings.randomMode) {
                const elements = getAllAvailableElements();
                const elem1 = elements[Math.floor(Math.random() * elements.length)];
                const elem2 = elements[Math.floor(Math.random() * elements.length)];
                combo = { elem1, elem2 };
            } else {
                const untestedCombos = getUntestedCombinations(1);
                combo = untestedCombos[0];
            }

            if (!combo) {
                showToast('No more untested combinations!', 'warning');
                break;
            }

            await testCombination(combo.elem1, combo.elem2);

            updateDiscoveryStatus(attempts, maxAttempts);

            await wait(settings.delay);
        }

        state.discovering = false;
        updateDiscoveryButton();

        const message = `Complete! ${attempts} attempts\n${data.craftedElements.length} crafted\n${metrics.nothingResults} nothing\n${metrics.autoRecoveries} auto-recoveries`;
        showToast(message, 'success');
    }

    function stopAutoDiscovery() {
        if (!state.discovering) return;
        state.discovering = false;
        updateDiscoveryButton();
        showToast('Auto-discovery stopped', 'info');
    }

    // ============================================================================
    // AUTO FIND & CRAFT TARGET ELEMENT (ENHANCED WITH PROGRESS TRACKING)
    // ============================================================================

    function findRecipeForElement(targetElement) {
        for (const recipe of data.recipes.values()) {
            if (recipe.result.toLowerCase() === targetElement.toLowerCase() && !recipe.isNothing) {
                return recipe;
            }
        }
        return null;
    }

    function findAllRecipesForElement(targetElement) {
        const recipes = [];
        for (const recipe of data.recipes.values()) {
            if (recipe.result.toLowerCase() === targetElement.toLowerCase() && !recipe.isNothing) {
                recipes.push(recipe);
            }
        }
        return recipes;
    }

    async function showCraftingPath(targetElement) {
        if (!targetElement || targetElement.trim() === '') {
            showToast('Enter a target element!', 'warning');
            return;
        }

        targetElement = targetElement.trim();

        if (hasElement(targetElement)) {
            await showModal(
                '✓ ALREADY HAVE',
                `You already have ${targetElement}!`,
                'success',
                [{ text: 'OK' }]
            );
            return;
        }

        const recipes = findAllRecipesForElement(targetElement);

        if (recipes.length === 0) {
            const path = findPathToElement(targetElement);

            if (path && path.length > 0) {
                const pathSteps = [];
                for (let i = 0; i < path.length - 1; i += 2) {
                    if (i + 2 < path.length) {
                        pathSteps.push(`${path[i]} + ${path[i + 1]} = ${path[i + 2]}`);
                    }
                }

                await showModal(
                    '🗺️ CRAFTING PATH FOUND',
                    `Path to ${targetElement}:\n\n${pathSteps.join('\n↓\n')}`,
                    'info',
                    [{ text: 'OK' }]
                );
            } else {
                await showModal(
                    '❌ NO PATH FOUND',
                    `No known recipe or path for ${targetElement}.\n\nTry:\n• Running auto-discovery first\n• Using focused search`,
                    'warning',
                    [{ text: 'OK' }]
                );
            }
        } else {
            const recipesList = recipes.map(r =>
                `• ${r.ingredient1} + ${r.ingredient2}\n  ${hasElement(r.ingredient1) ? '✓' : '✗'} Have ${r.ingredient1}\n  ${hasElement(r.ingredient2) ? '✓' : '✗'} Have ${r.ingredient2}`
            ).join('\n\n');

            await showModal(
                '📋 RECIPES FOUND',
                `Recipes for ${targetElement}:\n\n${recipesList}`,
                'info',
                [{ text: 'OK' }]
            );
        }
    }

    async function autoFindAndCraft(targetElement, addToHistory = true) {
        if (!targetElement || targetElement.trim() === '') {
            showToast('Enter a target element!', 'warning');
            return false;
        }

        targetElement = targetElement.trim();

        if (hasElement(targetElement)) {
            showToast(`✓ Already have ${targetElement}!`, 'success');
            updateQueueProgress('Completed', `Already have ${targetElement}`, 0, 0, []);
            return true;
        }

        updateQueueProgress('Searching', `Looking for ${targetElement}...`, 0, 0, []);
        showToast(`🔍 Searching for ${targetElement}...`, 'info');

        const knownRecipe = findRecipeForElement(targetElement);
        if (knownRecipe) {
            updateQueueProgress('Recipe Found', `${knownRecipe.ingredient1} + ${knownRecipe.ingredient2} = ${targetElement}`, 0, 1, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
            showToast(`Found recipe: ${knownRecipe.ingredient1} + ${knownRecipe.ingredient2}`, 'success');

            if (hasElement(knownRecipe.ingredient1) && hasElement(knownRecipe.ingredient2)) {
                updateQueueProgress('Crafting', `Combining ingredients...`, 1, 1, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
                showToast(`Crafting ${targetElement}...`, 'info');
                const success = await craftElement(knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement);

                if (success) {
                    updateQueueProgress('Completed', `✓ Crafted ${targetElement}!`, 1, 1, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
                    showToast(`✓ Successfully crafted ${targetElement}!`, 'success');
                    if (addToHistory) {
                        data.craftingHistory.unshift({
                            element: targetElement,
                            recipe: `${knownRecipe.ingredient1} + ${knownRecipe.ingredient2}`,
                            timestamp: Date.now(),
                            success: true
                        });
                        trimArray(data.craftingHistory, 100);
                        saveAdminData();
                    }
                    return true;
                } else {
                    updateQueueProgress('Failed', `✗ Could not craft ${targetElement}`, 1, 1, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
                }
            } else {
                updateQueueProgress('Crafting Prerequisites', `Need to craft ingredients first...`, 0, 2, []);
                showToast('Need to craft ingredients first...', 'info');

                if (!hasElement(knownRecipe.ingredient1)) {
                    updateQueueProgress('Crafting Prerequisites', `Crafting ${knownRecipe.ingredient1}...`, 1, 2, [knownRecipe.ingredient1]);
                    const result1 = await autoFindAndCraft(knownRecipe.ingredient1, false);
                    if (!result1) {
                        updateQueueProgress('Failed', `✗ Failed to craft ${knownRecipe.ingredient1}`, 1, 2, [knownRecipe.ingredient1]);
                        showToast(`Failed to craft ${knownRecipe.ingredient1}`, 'error');
                        return false;
                    }
                }

                if (!hasElement(knownRecipe.ingredient2)) {
                    updateQueueProgress('Crafting Prerequisites', `Crafting ${knownRecipe.ingredient2}...`, 2, 2, [knownRecipe.ingredient2]);
                    const result2 = await autoFindAndCraft(knownRecipe.ingredient2, false);
                    if (!result2) {
                        updateQueueProgress('Failed', `✗ Failed to craft ${knownRecipe.ingredient2}`, 2, 2, [knownRecipe.ingredient2]);
                        showToast(`Failed to craft ${knownRecipe.ingredient2}`, 'error');
                        return false;
                    }
                }

                if (hasElement(knownRecipe.ingredient1) && hasElement(knownRecipe.ingredient2)) {
                    updateQueueProgress('Crafting Final', `Combining for ${targetElement}...`, 2, 2, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
                    const success = await craftElement(knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement);
                    if (success && addToHistory) {
                        updateQueueProgress('Completed', `✓ Crafted ${targetElement}!`, 2, 2, [knownRecipe.ingredient1, knownRecipe.ingredient2, targetElement]);
                        data.craftingHistory.unshift({
                            element: targetElement,
                            recipe: `${knownRecipe.ingredient1} + ${knownRecipe.ingredient2}`,
                            timestamp: Date.now(),
                            success: true
                        });
                        trimArray(data.craftingHistory, 100);
                        saveAdminData();
                    }
                    return success;
                }
            }
        }

        const path = findPathToElement(targetElement);
        if (path && path.length > 0) {
            const totalSteps = Math.floor((path.length - 1) / 2);
            updateQueueProgress('Path Found', `${totalSteps} step crafting path found`, 0, totalSteps, path);
            showToast(`Found path (${totalSteps} steps)`, 'success');
            const success = await craftFromPath(path, targetElement);
            if (success && addToHistory) {
                data.craftingHistory.unshift({
                    element: targetElement,
                    path: path.join(' → '),
                    timestamp: Date.now(),
                    success: true
                });
                trimArray(data.craftingHistory, 100);
                saveAdminData();
            }
            return success;
        }

        updateQueueProgress('Focused Search', `No recipe found. Starting search...`, 0, 0, []);
        showToast('No known recipe. Starting focused search...', 'warning');
        const success = await focusedDiscovery(targetElement);

        if (addToHistory) {
            data.craftingHistory.unshift({
                element: targetElement,
                method: 'focused search',
                timestamp: Date.now(),
                success: success
            });
            trimArray(data.craftingHistory, 100);
            saveAdminData();
        }

        if (success) {
            updateQueueProgress('Completed', `✓ Found ${targetElement}!`, 1, 1, [targetElement]);
        } else {
            updateQueueProgress('Failed', `✗ Could not find ${targetElement}`, 1, 1, [targetElement]);
        }

        return success;
    }

    async function craftFromPath(path, target) {
        const totalSteps = Math.floor((path.length - 1) / 2);
        updateQueueProgress('Crafting Path', `Following ${totalSteps} step path...`, 0, totalSteps, path);
        showToast(`Crafting path: ${path.join(' → ')}`, 'info');

        let currentStep = 0;
        for (let i = 0; i < path.length - 1; i += 2) {
            if (i + 2 >= path.length) break;

            const elem1 = path[i];
            const elem2 = path[i + 1];
            const result = path[i + 2];

            currentStep++;

            if (!hasElement(result)) {
                updateQueueProgress('Crafting Path', `Step ${currentStep}/${totalSteps}: ${elem1} + ${elem2} = ${result}`, currentStep, totalSteps, path);
                showToast(`Step ${currentStep}/${totalSteps}: ${result}`, 'info');
                const success = await craftElement(elem1, elem2, result);
                if (!success) {
                    updateQueueProgress('Failed', `✗ Failed at step ${currentStep}: ${result}`, currentStep, totalSteps, path);
                    showToast(`Failed to craft ${result}`, 'error');
                    return false;
                }
                await wait(settings.craftDelay);
            }
        }

        const success = hasElement(target);
        if (success) {
            updateQueueProgress('Completed', `✓ Path complete! Got ${target}`, totalSteps, totalSteps, path);
            showToast(`✓ Path complete! Got ${target}`, 'success');
        }
        return success;
    }

    async function focusedDiscovery(targetElement, maxAttempts = null) {
        const attempts = maxAttempts || settings.focusedDiscoveryAttempts;
        const elements = getAllAvailableElements();
        let attemptCount = 0;

        updateQueueProgress('Focused Search', `Trying random combinations...`, 0, attempts, []);
        showToast(`Trying random combinations for ${targetElement}...`, 'info');

        while (attemptCount < attempts && !hasElement(targetElement)) {
            attemptCount++;

            const elem1 = elements[Math.floor(Math.random() * elements.length)];
            const elem2 = elements[Math.floor(Math.random() * elements.length)];

            updateQueueProgress('Focused Search', `Attempt ${attemptCount}/${attempts}: ${elem1} + ${elem2}`, attemptCount, attempts, [elem1, elem2]);

            const result = await testCombination(elem1, elem2);

            if (result && result.result.toLowerCase() === targetElement.toLowerCase()) {
                updateQueueProgress('Completed', `🎉 FOUND ${targetElement}!`, attempts, attempts, [elem1, elem2, targetElement]);
                showToast(`🎉 FOUND ${targetElement}!`, 'success');
                return true;
            }

            await wait(settings.delay);

            if (attemptCount % 50 === 0) {
                showToast(`Search progress: ${attemptCount}/${attempts}`, 'info');
            }
        }

        if (!hasElement(targetElement)) {
            updateQueueProgress('Failed', `Could not find ${targetElement}`, attempts, attempts, []);
            showToast(`Could not find ${targetElement} after ${attemptCount} attempts`, 'error');
            return false;
        }

        return true;
    }

    // ============================================================================
    // CRAFTING QUEUE SYSTEM (ENHANCED)
    // ============================================================================

    function addToQueue(elementName) {
        if (!elementName || elementName.trim() === '') {
            showToast('Enter an element name!', 'warning');
            return;
        }

        elementName = elementName.trim();

        if (data.craftingQueue.some(item => item.element.toLowerCase() === elementName.toLowerCase())) {
            showToast(`${elementName} already in queue!`, 'warning');
            return;
        }

        if (data.craftingQueue.length >= settings.maxQueueSize) {
            showToast(`Queue full! (max ${settings.maxQueueSize})`, 'error');
            return;
        }

        data.craftingQueue.push({
            element: elementName,
            status: 'pending',
            progress: '',
            path: [],
            addedAt: Date.now()
        });

        saveAdminData();
        updateQueueUI();
        showToast(`Added ${elementName} to queue`, 'success');

        if (settings.queueAutoProcess && !state.processingQueue) {
            processQueue();
        }
    }

    function removeFromQueue(index) {
        if (index >= 0 && index < data.craftingQueue.length) {
            const removed = data.craftingQueue.splice(index, 1)[0];
            saveAdminData();
            updateQueueUI();
            showToast(`Removed ${removed.element} from queue`, 'info');
        }
    }

    function clearQueue() {
        if (data.craftingQueue.length === 0) {
            showToast('Queue is empty!', 'info');
            return;
        }

        data.craftingQueue = [];
        saveAdminData();
        updateQueueUI();
        showToast('Queue cleared', 'info');
    }

    async function processQueue() {
        if (state.processingQueue) {
            showToast('Already processing queue!', 'warning');
            return;
        }

        if (data.craftingQueue.length === 0) {
            showToast('Queue is empty!', 'info');
            return;
        }

        state.processingQueue = true;
        updateQueueButton();
        showToast('Starting queue processing...', 'success');

        let processed = 0;
        let successful = 0;
        let failed = 0;

        while (data.craftingQueue.length > 0 && state.processingQueue) {
            const item = data.craftingQueue[0];
            item.status = 'processing';
            state.currentQueueItem = item;
            updateQueueUI();

            showToast(`Processing: ${item.element} (${processed + 1})`, 'info');

            const success = await autoFindAndCraft(item.element, true);

            processed++;
            if (success) {
                successful++;
                metrics.queueSuccess++;
                item.status = 'completed';
                item.progress = '✓ Success';
            } else {
                failed++;
                metrics.queueFailed++;
                item.status = 'failed';
                item.progress = '✗ Failed';
            }

            metrics.queueProcessed++;
            data.craftingQueue.shift();
            state.currentQueueItem = null;
            updateQueueProgress('', '', 0, 0, []);
            updateQueueUI();
            saveAdminData();

            await wait(settings.delay * 2);
        }

        state.processingQueue = false;
        state.currentQueueItem = null;
        updateQueueButton();

        const summary = `Queue complete!\n${processed} processed\n${successful} successful\n${failed} failed`;
        showToast(summary, successful > 0 ? 'success' : 'warning');
    }

    function stopQueue() {
        if (!state.processingQueue) return;
        state.processingQueue = false;
        state.currentQueueItem = null;
        updateQueueProgress('', '', 0, 0, []);
        updateQueueButton();
        showToast('Queue processing stopped', 'info');
    }

    // ============================================================================
    // ANALYSIS FUNCTIONS
    // ============================================================================

    function analyzeCombo(element) {
        if (!data.relationships[element]) return [];

        const combos = data.relationships[element].map(rel => {
            const key = `${element}+${rel.with}`;
            const stats = data.successRates[key] || { attempts: 0, successes: 0 };
            const successRate = stats.attempts > 0 ? (stats.successes / stats.attempts * 100).toFixed(1) : 0;

            return {
                element: rel.with,
                result: rel.creates,
                successRate: successRate + '%',
                attempts: stats.attempts
            };
        });

        return combos.sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate));
    }

    function findPathToElement(targetElement) {
        const startElements = ['Fire', 'Water', 'Earth', 'Wind'];
        const queue = startElements.map(e => ({ element: e, path: [e] }));
        const visited = new Set(startElements);
        const maxDepth = 10;

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.path.length > maxDepth) continue;

            const combos = data.relationships[current.element] || [];
            for (const combo of combos) {
                if (combo.creates.toLowerCase() === targetElement.toLowerCase()) {
                    return [...current.path, combo.with, targetElement];
                }

                if (!visited.has(combo.creates)) {
                    visited.add(combo.creates);
                    queue.push({
                        element: combo.creates,
                        path: [...current.path, combo.with, combo.creates]
                    });
                }
            }
        }

        return null;
    }

    function addTargetElement(elementName) {
        if (!elementName) return;
        if (!data.targetElements.includes(elementName)) {
            data.targetElements.push(elementName);
            saveAdminData();
            updateTargetList();
            showToast(`Target added: ${elementName}`, 'success');
        }
    }

    function removeTargetElement(elementName) {
        data.targetElements = data.targetElements.filter(e => e !== elementName);
        saveAdminData();
        updateTargetList();
    }

    // ============================================================================
    // UI CREATION FUNCTIONS
    // ============================================================================

    function createAdminContent() {
        return `
            <div style="background:var(--theme-surface);border:2px solid var(--theme-warning);box-shadow:0 0 10px var(--theme-warning);border-radius:4px;padding:12px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ ADMIN TOOLS</span>
                    <span style="font-size:9px;opacity:0.8;font-weight:700;background:var(--theme-error);color:#000;padding:2px 6px;border-radius:3px;">ADMIN ${ADMIN_VERSION}</span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
                    <div style="background:var(--theme-surface);border-radius:4px;padding:10px;border:1px solid var(--theme-borderColor);">
                        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--theme-textSecondary);margin-bottom:6px;">Recipes</div>
                        <div id="admin-total-recipes" style="font-size:18px;font-weight:700;color:var(--theme-text);">0</div>
                    </div>
                    <div style="background:var(--theme-surface);border-radius:4px;padding:10px;border:1px solid var(--theme-borderColor);">
                        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--theme-textSecondary);margin-bottom:6px;">Success Rate</div>
                        <div id="admin-success-rate" style="font-size:18px;font-weight:700;color:var(--theme-text);">0%</div>
                    </div>
                    <div style="background:var(--theme-surface);border-radius:4px;padding:10px;border:1px solid var(--theme-borderColor);">
                        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--theme-textSecondary);margin-bottom:6px;">Errors</div>
                        <div id="admin-error-count" style="font-size:18px;font-weight:700;color:var(--theme-text);">0</div>
                    </div>
                </div>

                <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:1px solid var(--theme-borderColor);">
                    <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">Recipe Search</div>
                    <input type="text" id="admin-recipe-search" placeholder="Search recipes..." style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;margin-bottom:8px;font-family:inherit;">
                    <div id="admin-recipe-list" style="max-height:200px;overflow-y:auto;background:var(--theme-accentDim);border-radius:4px;padding:8px;">
                        <div style="font-size:11px;opacity:0.7;text-align:center;padding:20px;">No recipes logged yet...</div>
                    </div>
                </div>

                <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:1px solid var(--theme-borderColor);">
                    <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">Combo Analyzer</div>
                    <input type="text" id="admin-combo-element" placeholder="Enter element name..." style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;margin-bottom:8px;font-family:inherit;">
                    <button id="admin-analyze-btn" style="width:100%;padding:10px;background:transparent;color:var(--theme-accent);border:2px solid var(--theme-accent);border-radius:4px;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;text-transform:uppercase;margin-bottom:8px;">
                        [ANALYZE COMBOS]
                    </button>
                    <div id="admin-combo-results"></div>
                </div>

                <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:1px solid var(--theme-borderColor);">
                    <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">Top Elements</div>
                    <div id="admin-top-elements" style="font-size:11px;"></div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">
                    <button id="admin-export-recipes-btn" style="padding:10px;background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);border-radius:4px;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [EXPORT]
                    </button>
                    <button id="admin-clear-board-btn" style="padding:10px;background:transparent;color:var(--theme-warning);border:2px solid var(--theme-warning);border-radius:4px;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [CLEAR BOARD]
                    </button>
                    <button id="admin-clear-recipes-btn" style="padding:10px;background:transparent;color:var(--theme-error);border:2px solid var(--theme-error);border-radius:4px;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [CLEAR DATA]
                    </button>
                </div>

                <div style="font-size:9px;color:var(--theme-textSecondary);padding:10px;background:var(--theme-surface);border-radius:4px;border:1px solid var(--theme-border);line-height:1.7;">
                    <div style="font-weight:700;margin-bottom:8px;color:var(--theme-text);font-size:10px;">⚡ CONSOLE API:</div>
                    <div>Type <span style="color:var(--theme-accent);font-weight:700;">adminPlugin.help()</span> for full API</div>
                    <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--theme-border);font-weight:600;">
                        Alt+R = Export | Alt+A = Analyze | Alt+C = Clear Board
                    </div>
                </div>
            </div>
        `;
    }

    function createDiscoveryContent() {
        const presetButtons = Object.entries(SPEED_PRESETS).map(([key, preset]) => `
            <button class="preset-btn" data-preset="${key}" style="padding:8px;background:transparent;color:var(--theme-accent);border:2px solid var(--theme-accent);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;transition:all 0.2s;">
                ${preset.name}
            </button>
        `).join('');

        return `
            <div style="background:linear-gradient(135deg, var(--theme-success) 0%, var(--theme-accent) 100%);border-radius:4px;padding:12px;margin-bottom:12px;text-align:center;color:#000;">
                <div style="font-size:12px;font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">🚀 AUTO-DISCOVERY ENGINE 🚀</div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">
                    <div>
                        <div style="font-size:9px;opacity:0.8;">New Finds</div>
                        <div id="admin-new-discoveries-count" style="font-size:24px;font-weight:700;">0</div>
                    </div>
                    <div>
                        <div style="font-size:9px;opacity:0.8;">Crafted</div>
                        <div id="admin-crafted-count" style="font-size:24px;font-weight:700;">0</div>
                    </div>
                    <div>
                        <div style="font-size:9px;opacity:0.8;">Nothing</div>
                        <div id="admin-nothing-count" style="font-size:24px;font-weight:700;">0</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:8px;">
                    <div>
                        <div style="font-size:9px;opacity:0.8;">Tested Combos</div>
                        <div id="admin-tested-combos" style="font-size:20px;font-weight:700;">0</div>
                    </div>
                </div>
                <div id="admin-discovery-status" style="font-size:10px;opacity:0.9;margin-bottom:10px;font-weight:600;">Ready to start</div>
                <button id="admin-auto-discover-btn" style="width:100%;padding:14px;background:#000;color:var(--theme-success);border:2px solid var(--theme-success);border-radius:4px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                    [START AUTO-DISCOVERY]
                </button>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-accent);box-shadow:0 0 10px var(--theme-accent);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">⚡ SPEED PRESETS</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
                    ${presetButtons}
                </div>
                <div id="admin-preset-info" style="font-size:10px;padding:8px;background:var(--theme-accentDim);border-radius:4px;text-align:center;">
                    Select a preset above
                </div>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-warning);box-shadow:0 0 10px var(--theme-warning);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">🎯 AUTO FIND & CRAFT</div>
                <input type="text" id="admin-target-element" placeholder="Enter target (e.g. Dragon, Human)" style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;margin-bottom:8px;font-family:inherit;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
                    <button id="admin-show-path-btn" style="padding:10px;background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [SHOW PATH]
                    </button>
                    <button id="admin-find-craft-btn" style="padding:10px;background:transparent;color:var(--theme-warning);border:2px solid var(--theme-warning);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [FIND & CRAFT]
                    </button>
                </div>
                <button id="admin-add-queue-btn" style="width:100%;padding:10px;background:transparent;color:var(--theme-success);border:2px solid var(--theme-success);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                    [ADD TO QUEUE]
                </button>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-success);box-shadow:0 0 10px var(--theme-success);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);display:flex;justify-content:space-between;align-items:center;">
                    <span>📋 CRAFTING QUEUE</span>
                    <span style="font-size:10px;background:var(--theme-success);color:#000;padding:2px 8px;border-radius:10px;" id="admin-queue-badge">0</span>
                </div>

                <!-- ENHANCED PROGRESS DISPLAY -->
                <div id="admin-queue-progress" style="display:none;background:var(--theme-accentDim);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-info);">
                    <div style="font-size:10px;font-weight:700;color:var(--theme-info);margin-bottom:8px;text-transform:uppercase;">
                        🔄 CURRENTLY PROCESSING
                    </div>
                    <div id="admin-queue-current-item" style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--theme-text);">
                        Searching...
                    </div>
                    <div id="admin-queue-current-status" style="font-size:10px;margin-bottom:8px;color:var(--theme-textSecondary);">
                        Status: Initializing...
                    </div>
                    <div id="admin-queue-current-path" style="font-size:9px;margin-bottom:8px;color:var(--theme-accent);font-family:monospace;line-height:1.6;">
                    </div>
                    <div style="background:var(--theme-surface);border-radius:3px;height:6px;overflow:hidden;margin-bottom:6px;">
                        <div id="admin-queue-progress-bar" style="height:100%;background:var(--theme-success);width:0%;transition:width 0.3s ease;"></div>
                    </div>
                    <div id="admin-queue-progress-text" style="font-size:9px;text-align:center;color:var(--theme-textSecondary);">
                        Step 0 / 0
                    </div>
                </div>

                <div id="admin-queue-list" style="max-height:300px;overflow-y:auto;background:var(--theme-accentDim);border-radius:4px;padding:8px;margin-bottom:8px;">
                    <div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">Queue is empty</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <button id="admin-process-queue-btn" style="padding:10px;background:transparent;color:var(--theme-success);border:2px solid var(--theme-success);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [PROCESS QUEUE]
                    </button>
                    <button id="admin-clear-queue-btn" style="padding:10px;background:transparent;color:var(--theme-error);border:2px solid var(--theme-error);border-radius:4px;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                        [CLEAR QUEUE]
                    </button>
                </div>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-info);box-shadow:0 0 10px var(--theme-info);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);display:flex;justify-content:space-between;align-items:center;">
                    <span>🔧 Items Crafted</span>
                    <span style="font-size:10px;background:var(--theme-info);color:#000;padding:2px 8px;border-radius:10px;" id="admin-crafted-badge">0</span>
                </div>
                <div id="admin-crafted-list" style="max-height:250px;overflow-y:auto;background:var(--theme-accentDim);border-radius:4px;padding:8px;">
                    <div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">No elements crafted yet...</div>
                </div>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-success);box-shadow:0 0 10px var(--theme-success);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);display:flex;justify-content:space-between;align-items:center;">
                    <span>🌟 New Discoveries</span>
                    <span style="font-size:10px;background:var(--theme-success);color:#000;padding:2px 8px;border-radius:10px;" id="admin-discovery-badge">0</span>
                </div>
                <div id="admin-new-discoveries-list" style="max-height:200px;overflow-y:auto;background:var(--theme-accentDim);border-radius:4px;padding:8px;">
                    <div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">No new discoveries yet...</div>
                </div>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:1px solid var(--theme-borderColor);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">🧪 Manual Test</div>
                <input type="text" id="admin-test-elem1" placeholder="Element 1 (e.g. Fire)" style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;margin-bottom:6px;font-family:inherit;">
                <input type="text" id="admin-test-elem2" placeholder="Element 2 (e.g. Water)" style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;margin-bottom:8px;font-family:inherit;">
                <button id="admin-test-btn" style="width:100%;padding:12px;background:transparent;color:var(--theme-info);border:2px solid var(--theme-info);border-radius:4px;font-weight:700;font-size:12px;cursor:pointer;font-family:inherit;text-transform:uppercase;">
                    [TEST COMBINATION]
                </button>
            </div>

            <div style="background:var(--theme-surface);border-radius:4px;padding:12px;margin-bottom:12px;border:2px solid var(--theme-warning);box-shadow:0 0 10px var(--theme-warning);">
                <div style="font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--theme-borderColor);">🛡️ FAIL-SAFE SETTINGS</div>
                <div style="margin-bottom:8px;">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                        <input type="checkbox" id="admin-auto-recovery" checked style="cursor:pointer;">
                        <span style="font-size:11px;font-weight:600;">Auto-Recovery (recommended)</span>
                    </label>
                </div>
                <div style="margin-bottom:8px;">
                    <div style="font-size:10px;margin-bottom:4px;color:var(--theme-textSecondary);font-weight:700;">Max Consecutive Errors:</div>
                    <input type="number" id="admin-max-errors" value="${settings.maxConsecutiveErrors}" min="3" max="20" step="1" style="width:100%;padding:8px;border:1px solid var(--theme-borderColor);background:var(--theme-surface);border-radius:4px;color:var(--theme-text);font-size:11px;font-family:inherit;">
                </div>
                <div style="font-size:9px;color:var(--theme-warning);margin-top:8px;padding:8px;background:var(--theme-accentDim);border-radius:4px;">
                    ⚠️ Fail-safe activates after consecutive errors and auto-recovers
                </div>
            </div>

            <div style="font-size:9px;color:var(--theme-textSecondary);padding:10px;background:var(--theme-surface);border-radius:4px;border:1px solid var(--theme-border);line-height:1.7;">
                <div style="font-weight:700;margin-bottom:8px;color:var(--theme-text);font-size:10px;">💡 v5.6 ULTIMATE FEATURES:</div>
                <div>• <span style="color:var(--theme-success);font-weight:700;">Enhanced Queue UI</span> - real-time progress</div>
                <div>• <span style="color:var(--theme-success);font-weight:700;">Path Display</span> - see crafting steps live</div>
                <div>• <span style="color:var(--theme-success);font-weight:700;">Progress Bar</span> - visual feedback</div>
                <div>• <span style="color:var(--theme-success);font-weight:700;">Auto Find & Craft</span> - find any item</div>
                <div>• <span style="color:var(--theme-success);font-weight:700;">Batch Processing</span> - crafting queue</div>
                <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--theme-border);font-weight:600;">
                    Console: <span style="color:var(--theme-accent);">adminPlugin.help()</span>
                </div>
            </div>
        `;
    }

    // ============================================================================
    // UI UPDATE FUNCTIONS (ENHANCED)
    // ============================================================================

    function updateDiscoveryButton() {
        const btn = document.getElementById('admin-auto-discover-btn');
        if (btn) {
            if (state.discovering) {
                btn.textContent = '[STOP DISCOVERY]';
                btn.style.color = 'var(--theme-error)';
                btn.style.borderColor = 'var(--theme-error)';
            } else {
                btn.textContent = '[START AUTO-DISCOVERY]';
                btn.style.color = 'var(--theme-success)';
                btn.style.borderColor = 'var(--theme-success)';
            }
        }
    }

    function updateQueueButton() {
        const btn = document.getElementById('admin-process-queue-btn');
        if (btn) {
            if (state.processingQueue) {
                btn.textContent = '[STOP QUEUE]';
                btn.style.color = 'var(--theme-error)';
                btn.style.borderColor = 'var(--theme-error)';
            } else {
                btn.textContent = '[PROCESS QUEUE]';
                btn.style.color = 'var(--theme-success)';
                btn.style.borderColor = 'var(--theme-success)';
            }
        }
    }

    function updateDiscoveryStatus(current, max) {
        const statusEl = document.getElementById('admin-discovery-status');
        if (statusEl) {
            const elements = getAllAvailableElements();
            const preset = SPEED_PRESETS[state.currentPreset];
            statusEl.textContent = `${preset.name} | ${current.toLocaleString()} tests | ${elements.length} elements | ${data.craftedElements.length} crafted`;
        }
    }

    function updateDiscoveryUI() {
        const countEl = document.getElementById('admin-new-discoveries-count');
        const listEl = document.getElementById('admin-new-discoveries-list');
        const testedEl = document.getElementById('admin-tested-combos');
        const nothingEl = document.getElementById('admin-nothing-count');

        if (countEl) countEl.textContent = data.newDiscoveries.length.toLocaleString();
        if (testedEl) testedEl.textContent = data.testedCombinations.size.toLocaleString();
        if (nothingEl) nothingEl.textContent = metrics.nothingResults.toLocaleString();

        if (listEl) {
            if (data.newDiscoveries.length === 0) {
                listEl.innerHTML = '<div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">No new discoveries yet...</div>';
            } else {
                listEl.innerHTML = data.newDiscoveries.slice(-20).reverse().map(disc => `
                    <div style="padding:8px;background:var(--theme-surface);border-radius:3px;border-left:3px solid var(--theme-success);margin-bottom:4px;font-size:11px;font-weight:600;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>🌟 ${disc.emoji} ${disc.result}</span>
                            <span style="font-size:9px;opacity:0.7;">${disc.latency}</span>
                        </div>
                        <div style="font-size:10px;opacity:0.7;margin-top:4px;">${disc.element1} + ${disc.element2}</div>
                    </div>
                `).join('');
            }
        }

        const discoveryBadgeEl = document.getElementById('admin-discovery-badge');
        if (discoveryBadgeEl) discoveryBadgeEl.textContent = data.newDiscoveries.length;
    }

    function updateCraftedUI() {
        const craftedCountEl = document.getElementById('admin-crafted-count');
        const craftedListEl = document.getElementById('admin-crafted-list');

        if (craftedCountEl) craftedCountEl.textContent = data.craftedElements.length.toLocaleString();

        if (craftedListEl) {
            if (data.craftedElements.length === 0) {
                craftedListEl.innerHTML = '<div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">No elements crafted yet...</div>';
            } else {
                craftedListEl.innerHTML = data.craftedElements.slice(-20).reverse().map(elem => `
                    <div style="padding:6px 8px;background:var(--theme-surface);border-radius:3px;border-left:3px solid var(--theme-info);margin-bottom:4px;font-size:11px;">
                        <div style="font-weight:700;">${elem.emoji} ${elem.name}</div>
                        <div style="font-size:10px;opacity:0.7;margin-top:2px;">${elem.recipe}</div>
                    </div>
                `).join('');
            }
        }

        const craftedBadgeEl = document.getElementById('admin-crafted-badge');
        if (craftedBadgeEl) craftedBadgeEl.textContent = data.craftedElements.length;
    }

    function updateQueueUI() {
        const queueListEl = document.getElementById('admin-queue-list');
        const queueBadgeEl = document.getElementById('admin-queue-badge');
        const queueProgressEl = document.getElementById('admin-queue-progress');
        const currentItemEl = document.getElementById('admin-queue-current-item');
        const currentStatusEl = document.getElementById('admin-queue-current-status');
        const currentPathEl = document.getElementById('admin-queue-current-path');
        const progressBarEl = document.getElementById('admin-queue-progress-bar');
        const progressTextEl = document.getElementById('admin-queue-progress-text');

        if (queueBadgeEl) queueBadgeEl.textContent = data.craftingQueue.length;

        // Update progress display
        if (queueProgressEl && state.processingQueue && state.currentQueueItem) {
            queueProgressEl.style.display = 'block';

            if (currentItemEl) {
                currentItemEl.innerHTML = `🎯 ${state.currentQueueItem.element}`;
            }

            if (currentStatusEl) {
                currentStatusEl.innerHTML = `Status: <span style="color:var(--theme-warning);font-weight:700;animation:pulse 1.5s infinite;">${state.currentQueueProgress.status}</span>`;
                if (state.currentQueueProgress.subStatus) {
                    currentStatusEl.innerHTML += `<br><span style="font-size:9px;opacity:0.8;">${state.currentQueueProgress.subStatus}</span>`;
                }
            }

            if (currentPathEl && state.currentQueueProgress.path.length > 0) {
                const pathDisplay = state.currentQueueProgress.path.map((elem, idx) => {
                    const isCompleted = idx < state.currentQueueProgress.currentStep * 2;
                    const isCurrent = idx === state.currentQueueProgress.currentStep * 2 || idx === state.currentQueueProgress.currentStep * 2 + 1;
                    const color = isCompleted ? 'var(--theme-success)' : isCurrent ? 'var(--theme-warning)' : 'var(--theme-textSecondary)';
                    const symbol = isCompleted ? '✓ ' : isCurrent ? '▶ ' : '○ ';
                    return `<span style="color:${color};">${symbol}${elem}</span>`;
                }).join(' → ');
                currentPathEl.innerHTML = `Path: ${pathDisplay}`;
            } else {
                currentPathEl.innerHTML = '';
            }

            if (progressBarEl && progressTextEl) {
                const progress = state.currentQueueProgress.totalSteps > 0
                    ? (state.currentQueueProgress.currentStep / state.currentQueueProgress.totalSteps * 100)
                    : 0;
                progressBarEl.style.width = `${progress}%`;
                progressTextEl.textContent = `Step ${state.currentQueueProgress.currentStep} / ${state.currentQueueProgress.totalSteps}`;
            }
        } else if (queueProgressEl) {
            queueProgressEl.style.display = 'none';
        }

        // Update queue list
        if (queueListEl) {
            if (data.craftingQueue.length === 0) {
                queueListEl.innerHTML = '<div style="opacity:0.7;text-align:center;padding:20px;font-size:11px;">Queue is empty</div>';
            } else {
                queueListEl.innerHTML = data.craftingQueue.map((item, index) => {
                    const statusConfig = {
                        pending: {
                            color: 'var(--theme-textSecondary)',
                            icon: '⏳',
                            bg: 'var(--theme-surface)',
                            text: 'Pending'
                        },
                        processing: {
                            color: 'var(--theme-warning)',
                            icon: '⚙️',
                            bg: 'var(--theme-accentDim)',
                            text: 'Processing...',
                            pulse: true
                        },
                        completed: {
                            color: 'var(--theme-success)',
                            icon: '✓',
                            bg: 'var(--theme-surface)',
                            text: 'Completed'
                        },
                        failed: {
                            color: 'var(--theme-error)',
                            icon: '✗',
                            bg: 'var(--theme-surface)',
                            text: 'Failed'
                        }
                    };

                    const config = statusConfig[item.status] || statusConfig.pending;
                    const pulseStyle = config.pulse ? 'animation: pulse 1.5s infinite;' : '';

                    return `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:${config.bg};border-radius:3px;border-left:3px solid ${config.color};margin-bottom:4px;font-size:11px;">
                            <div style="flex:1;">
                                <div style="font-weight:700;margin-bottom:4px;">
                                    <span style="color:${config.color};${pulseStyle}">${config.icon}</span>
                                    ${item.element}
                                </div>
                                <div style="font-size:9px;opacity:0.8;color:${config.color};">
                                    ${config.text}
                                    ${item.progress ? ` - ${item.progress}` : ''}
                                </div>
                                ${item.path && item.path.length > 0 ? `
                                    <div style="font-size:8px;opacity:0.6;margin-top:4px;font-family:monospace;">
                                        ${item.path.slice(0, 3).join(' → ')}${item.path.length > 3 ? '...' : ''}
                                    </div>
                                ` : ''}
                            </div>
                            ${item.status === 'pending' ? `
                                <button onclick="window.adminPlugin.removeFromQueue(${index})" style="background:var(--theme-error);color:#000;border:none;padding:4px 8px;border-radius:2px;font-size:9px;cursor:pointer;font-weight:700;margin-left:8px;">✕</button>
                            ` : ''}
                        </div>
                    `;
                }).join('');
            }
        }
    }

    function updateAdminUI() {
        const totalRecipesEl = document.getElementById('admin-total-recipes');
        const totalElementsEl = document.getElementById('admin-total-elements');
        const apiCallsEl = document.getElementById('admin-api-calls');
        const avgLatencyEl = document.getElementById('admin-avg-latency');
        const successRateEl = document.getElementById('admin-success-rate');
        const errorCountEl = document.getElementById('admin-error-count');

        if (totalRecipesEl) totalRecipesEl.textContent = data.recipes.size.toLocaleString();
        if (totalElementsEl) totalElementsEl.textContent = Object.keys(data.relationships).length.toLocaleString();
        if (apiCallsEl) apiCallsEl.textContent = metrics.apiCalls.toLocaleString();

        if (avgLatencyEl) {
            const avg = metrics.apiLatency.length > 0
                ? metrics.apiLatency.reduce((a, b) => a + b, 0) / metrics.apiLatency.length
                : 0;
            avgLatencyEl.textContent = avg.toFixed(0) + 'ms';
        }

        if (successRateEl) {
            const total = metrics.successfulCrafts + metrics.failedCrafts;
            const rate = total > 0 ? (metrics.successfulCrafts / total * 100).toFixed(1) : 0;
            successRateEl.textContent = `${rate}%`;
        }

        if (errorCountEl) {
            errorCountEl.textContent = state.consecutiveErrors;
            if (state.consecutiveErrors >= settings.maxConsecutiveErrors / 2) {
                errorCountEl.style.color = 'var(--theme-warning)';
            } else if (state.consecutiveErrors >= settings.maxConsecutiveErrors) {
                errorCountEl.style.color = 'var(--theme-error)';
            } else {
                errorCountEl.style.color = 'var(--theme-text)';
            }
        }

        updateTopElements();
    }

    function updateRecipeDisplay(searchTerm = '') {
        const listEl = document.getElementById('admin-recipe-list');
        if (!listEl) return;

        let recipes = Array.from(data.recipes.values());
        if (searchTerm) {
            recipes = recipes.filter(r =>
                r.ingredient1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.ingredient2.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.result.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (recipes.length === 0) {
            listEl.innerHTML = '<div style="font-size:11px;opacity:0.7;text-align:center;padding:20px;">No recipes found</div>';
        } else {
            const displayRecipes = recipes.slice(-20).reverse();
            listEl.innerHTML = displayRecipes.map(recipe => `
                <div style="padding:6px 8px;background:var(--theme-surface);border-radius:3px;border-left:3px solid ${recipe.isNothing ? 'var(--theme-error)' : 'var(--theme-success)'};margin-bottom:4px;font-size:11px;">
                    ${recipe.ingredient1} + ${recipe.ingredient2} = <span style="color:${recipe.isNothing ? 'var(--theme-error)' : 'var(--theme-success)'};font-weight:700;">${recipe.result}</span>
                    ${recipe.discovered ? ' 🌟' : ''}
                </div>
            `).join('');
        }
    }

    function updateAPILog() {
        const logEl = document.getElementById('admin-api-log');
        if (!logEl) return;

        if (data.apiLog.length === 0) {
            logEl.innerHTML = '<div style="opacity: 0.7; text-align: center; padding: 20px; font-size:11px;">No API calls logged</div>';
        } else {
            logEl.innerHTML = data.apiLog.slice(0, 20).map(entry => `
                <div style="padding: 6px; border-bottom: 1px solid var(--theme-borderColor); font-size: 9px; font-family: monospace;">
                    <div style="color: var(--theme-accent);">${entry.timestamp.split('T')[1].split('.')[0]}</div>
                    <div style="margin-top: 2px;">Latency: ${entry.latency} | Status: ${entry.status}</div>
                </div>
            `).join('');
        }
    }

    function updateTopElements() {
        const topEl = document.getElementById('admin-top-elements');
        if (!topEl) return;

        const topElements = Object.entries(data.relationships)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 5);

        if (topElements.length === 0) {
            topEl.innerHTML = '<div style="opacity:0.7;text-align:center;padding:10px;font-size:11px;">No data yet</div>';
        } else {
            topEl.innerHTML = topElements.map(([element, relationships]) => `
                <div style="padding: 4px 0; font-size:11px;">${element} (${relationships.length} combos)</div>
            `).join('');
        }
    }

    function updateTargetList() {
        const listEl = document.getElementById('admin-target-list');
        if (!listEl) return;

        if (data.targetElements.length === 0) {
            listEl.innerHTML = '<div style="opacity: 0.7; text-align: center; padding: 10px; font-size:11px;">No targets set</div>';
        } else {
            listEl.innerHTML = data.targetElements.map(element => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--theme-surface);border-radius:3px;margin-bottom:4px;font-size:11px;">
                    <div>${element}</div>
                    <button onclick="window.adminPlugin.removeTarget('${element}')" style="background:var(--theme-error);color:#000;border:none;padding:4px 8px;border-radius:2px;font-size:9px;cursor:pointer;font-weight:700;">✕</button>
                </div>
            `).join('');
        }
    }

    function displayComboResults(combos, element) {
        const resultsEl = document.getElementById('admin-combo-results');
        if (!resultsEl) return;

        if (combos.length === 0) {
            resultsEl.innerHTML = `<div style="opacity: 0.7; text-align: center; padding: 10px; font-size:11px;">No combos found for "${element}"</div>`;
        } else {
            resultsEl.innerHTML = `
                <div style="margin-bottom: 8px; font-weight: 700; font-size: 11px;">
                    Found ${combos.length} combos for "${element}":
                </div>
                ${combos.slice(0, 10).map(combo => `
                    <div style="background:var(--theme-surface);border:1px solid var(--theme-borderColor);border-radius:4px;padding:10px;margin-bottom:6px;">
                        <div style="font-size:12px;font-weight:700;margin-bottom:4px;">${element} + ${combo.element} = ${combo.result}</div>
                        <div style="font-size:10px;color:var(--theme-textSecondary);">
                            Success: <span style="color:var(--theme-success);font-weight:700;">${combo.successRate}</span> |
                            Attempts: ${combo.attempts}
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    // ============================================================================
    // UI INJECTION
    // ============================================================================

    function addAdminTab() {
        const tabsContainer = document.querySelector('.tabs');
        if (!tabsContainer || document.querySelector('[data-tab="admin"]')) return;

        const adminTab = document.createElement('div');
        adminTab.className = 'tab';
        adminTab.setAttribute('data-tab', 'admin');
        adminTab.textContent = '[ADM]';
        tabsContainer.appendChild(adminTab);

        const settingsContent = document.querySelector('[data-tab-content="settings"]');
        if (!settingsContent) return;

        const adminTabContent = document.createElement('div');
        adminTabContent.className = 'tab-content';
        adminTabContent.setAttribute('data-tab-content', 'admin');
        adminTabContent.innerHTML = createAdminContent();
        settingsContent.parentNode.insertBefore(adminTabContent, settingsContent.nextSibling);

        adminTab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            adminTab.classList.add('active');
            adminTabContent.classList.add('active');
        });
    }

    function addDiscoveryTab() {
        const tabsContainer = document.querySelector('.tabs');
        if (!tabsContainer || document.querySelector('[data-tab="discovery"]')) return;

        const discoveryTab = document.createElement('div');
        discoveryTab.className = 'tab';
        discoveryTab.setAttribute('data-tab', 'discovery');
        discoveryTab.textContent = '[DSC]';
        tabsContainer.appendChild(discoveryTab);

        const adminContent = document.querySelector('[data-tab-content="admin"]');
        if (!adminContent) return;

        const discoveryTabContent = document.createElement('div');
        discoveryTabContent.className = 'tab-content';
        discoveryTabContent.setAttribute('data-tab-content', 'discovery');
        discoveryTabContent.innerHTML = createDiscoveryContent();
        adminContent.parentNode.insertBefore(discoveryTabContent, adminContent.nextSibling);

        discoveryTab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            discoveryTab.classList.add('active');
            discoveryTabContent.classList.add('active');
        });
    }

    function injectAdminUI() {
        if (document.getElementById('admin-plugin-injected')) return true;

        const mainPanel = document.getElementById('auto-dragger-panel');
        if (!mainPanel) return false;

        addAdminTab();
        addDiscoveryTab();

        const marker = document.createElement('div');
        marker.id = 'admin-plugin-injected';
        marker.style.display = 'none';
        document.body.appendChild(marker);

        setupEventListeners();
        updateAdminUI();
        updateDiscoveryUI();
        updateCraftedUI();
        updateQueueUI();
        updatePresetUI();
        return true;
    }

    // ============================================================================
    // EVENT LISTENERS
    // ============================================================================

    function setupEventListeners() {
        const recipeSearch = document.getElementById('admin-recipe-search');
        const analyzeBtn = document.getElementById('admin-analyze-btn');
        const exportRecipesBtn = document.getElementById('admin-export-recipes-btn');
        const clearRecipesBtn = document.getElementById('admin-clear-recipes-btn');
        const clearBoardBtn = document.getElementById('admin-clear-board-btn');
        const testBtn = document.getElementById('admin-test-btn');
        const autoDiscoverBtn = document.getElementById('admin-auto-discover-btn');
        const autoRecoveryCheckbox = document.getElementById('admin-auto-recovery');
        const maxErrorsInput = document.getElementById('admin-max-errors');
        const showPathBtn = document.getElementById('admin-show-path-btn');
        const findCraftBtn = document.getElementById('admin-find-craft-btn');
        const addQueueBtn = document.getElementById('admin-add-queue-btn');
        const processQueueBtn = document.getElementById('admin-process-queue-btn');
        const clearQueueBtn = document.getElementById('admin-clear-queue-btn');

        if (recipeSearch) recipeSearch.addEventListener('input', (e) => updateRecipeDisplay(e.target.value));

        if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
            const element = document.getElementById('admin-combo-element')?.value.trim();
            if (element) {
                const combos = analyzeCombo(element);
                displayComboResults(combos, element);
            }
        });

        if (exportRecipesBtn) exportRecipesBtn.addEventListener('click', exportRecipeDatabase);
        if (clearRecipesBtn) clearRecipesBtn.addEventListener('click', clearRecipeDatabase);
        if (clearBoardBtn) clearBoardBtn.addEventListener('click', clearBoard);

        if (testBtn) testBtn.addEventListener('click', async () => {
            const elem1 = document.getElementById('admin-test-elem1')?.value.trim();
            const elem2 = document.getElementById('admin-test-elem2')?.value.trim();
            if (elem1 && elem2) {
                await testCombination(elem1, elem2);
            } else {
                showToast('Enter both elements!', 'warning');
            }
        });

        if (autoDiscoverBtn) autoDiscoverBtn.addEventListener('click', () => {
            if (state.discovering) {
                stopAutoDiscovery();
            } else {
                startAutoDiscovery();
            }
        });

        if (showPathBtn) showPathBtn.addEventListener('click', async () => {
            const target = document.getElementById('admin-target-element')?.value.trim();
            if (target) {
                await showCraftingPath(target);
            } else {
                showToast('Enter a target element!', 'warning');
            }
        });

        if (findCraftBtn) findCraftBtn.addEventListener('click', async () => {
            const target = document.getElementById('admin-target-element')?.value.trim();
            if (target) {
                await autoFindAndCraft(target);
            } else {
                showToast('Enter a target element!', 'warning');
            }
        });

        if (addQueueBtn) addQueueBtn.addEventListener('click', () => {
            const target = document.getElementById('admin-target-element')?.value.trim();
            if (target) {
                addToQueue(target);
                document.getElementById('admin-target-element').value = '';
            } else {
                showToast('Enter a target element!', 'warning');
            }
        });

        if (processQueueBtn) processQueueBtn.addEventListener('click', () => {
            if (state.processingQueue) {
                stopQueue();
            } else {
                processQueue();
            }
        });

        if (clearQueueBtn) clearQueueBtn.addEventListener('click', clearQueue);

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-preset');
                applyPreset(preset);
            });
        });

        if (autoRecoveryCheckbox) {
            autoRecoveryCheckbox.checked = settings.autoRecovery;
            autoRecoveryCheckbox.addEventListener('change', (e) => {
                settings.autoRecovery = e.target.checked;
                saveSettings();
                showToast(`Auto-recovery ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
            });
        }

        if (maxErrorsInput) {
            maxErrorsInput.addEventListener('change', (e) => {
                const val = parseInt(e.target.value) || 5;
                settings.maxConsecutiveErrors = Math.max(3, Math.min(val, 20));
                e.target.value = settings.maxConsecutiveErrors;
                saveSettings();
                showToast(`Max errors: ${settings.maxConsecutiveErrors}`, 'info');
            });
        }
    }

    // ============================================================================
    // KEYBOARD SHORTCUTS
    // ============================================================================

    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea')) return;
        if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            if(state.initialized) exportRecipeDatabase();
        }
        if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            if(state.initialized) {
                const element = document.getElementById('admin-combo-element')?.value.trim();
                if (element) {
                    const combos = analyzeCombo(element);
                    displayComboResults(combos, element);
                }
            }
        }
        if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            if(state.initialized) clearBoard();
        }
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            if(state.initialized) applyPreset('ultra-fast');
        }
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            if(state.initialized) applyPreset('fast');
        }
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            if(state.initialized) applyPreset('balanced');
        }
        if (e.altKey && e.key === '4') {
            e.preventDefault();
            if(state.initialized) applyPreset('safe');
        }
        if (e.altKey && e.key === '5') {
            e.preventDefault();
            if(state.initialized) applyPreset('super-safe');
        }
    });

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    window.adminPlugin = {
        version: ADMIN_VERSION,
        ready: false,
        removeTarget: (name) => removeTargetElement(name),
        addTarget: (name) => addTargetElement(name),
        analyze: (element) => analyzeCombo(element),
        findPath: (element) => findPathToElement(element),
        showPath: (element) => showCraftingPath(element),
        findAndCraft: (element) => autoFindAndCraft(element),
        addToQueue: (element) => addToQueue(element),
        removeFromQueue: (index) => removeFromQueue(index),
        processQueue: () => processQueue(),
        stopQueue: () => stopQueue(),
        clearQueue: () => clearQueue(),
        getQueue: () => data.craftingQueue,
        getHistory: () => data.craftingHistory,
        export: () => exportRecipeDatabase(),
        clear: () => clearRecipeDatabase(),
        clearBoard: () => clearBoard(),
        getRecipes: () => Array.from(data.recipes.values()),
        getRelationships: () => data.relationships,
        getTargets: () => data.targetElements,
        getAPILog: () => data.apiLog,
        getStats: () => metrics,
        getNothingCombos: () => data.nothingCombos,
        getErrors: () => data.errorLog,
        testCombo: (elem1, elem2) => testCombination(elem1, elem2),
        startAutoDiscover: () => startAutoDiscovery(),
        stopAutoDiscover: () => stopAutoDiscovery(),
        getNewDiscoveries: () => data.newDiscoveries,
        getCraftedElements: () => data.craftedElements,
        getSettings: () => settings,
        getState: () => state,
        setPreset: (preset) => applyPreset(preset),
        getPresets: () => SPEED_PRESETS,
        activateFailSafe: (reason) => activateFailSafe(reason),
        help: () => {
            const helpText = `
⚡ ADMIN PLUGIN API ${ADMIN_VERSION} ⚡
Status: ${state.initialized ? '✓ Ready' : '✗ Not Ready'}
Preset: ${SPEED_PRESETS[state.currentPreset].name}
Queue: ${data.craftingQueue.length} items

📊 DATA RETRIEVAL:
  adminPlugin.getRecipes()         - All recipes
  adminPlugin.getQueue()           - Current queue
  adminPlugin.getHistory()         - Crafting history
  adminPlugin.getStats()           - Performance metrics

🎯 AUTO FIND & CRAFT:
  adminPlugin.findAndCraft('Dragon')  - Auto-find and craft
  adminPlugin.showPath('Dragon')      - Preview crafting path

📋 QUEUE SYSTEM:
  adminPlugin.addToQueue('Dragon')    - Add to queue
  adminPlugin.processQueue()          - Process all items
  adminPlugin.stopQueue()             - Stop processing
  adminPlugin.clearQueue()            - Clear queue

⚡ SPEED PRESETS:
  adminPlugin.setPreset('fast')       - Change speed

⌨️ SHORTCUTS:
  Alt+1-5 = Select Preset

NEW IN v5.6:
  ✅ Enhanced Queue UI with real-time progress
  ✅ Live path display during crafting
  ✅ Visual progress bar
  ✅ Step-by-step status updates
  ✅ Color-coded queue items
            `;
            console.log(helpText);
            alert(helpText);
        }
    };

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    async function waitForMainScript() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 40;

            const checkInterval = setInterval(() => {
                attempts++;
                const mainPanel = document.getElementById('auto-dragger-panel');

                if (mainPanel) {
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 500);
        });
    }

    async function initAdminPlugin() {
        if (state.initialized) return;

        console.log('[ADMIN] Initializing Admin Plugin ' + ADMIN_VERSION);

        await waitForMainScript();
        loadAdminData();

        setTimeout(() => {
            const injected = injectAdminUI();
            if (injected) {
                state.initialized = true;
                window.adminPlugin.ready = true;

                const preset = SPEED_PRESETS[state.currentPreset];
                showToast(`Admin ready! Preset: ${preset.name}`, 'success');
                console.log('[ADMIN] Plugin initialized successfully');
                console.log('[ADMIN] v5.6 - Enhanced Queue UI Active');
                console.log('[ADMIN] Type adminPlugin.help() for commands');

                setInterval(() => {
                    if (state.initialized) {
                        updateAdminUI();
                        updateDiscoveryUI();
                        updateCraftedUI();
                        updateQueueUI();
                    }
                }, 500); // Update every 500ms for smooth progress tracking
            } else {
                console.warn('[ADMIN] Failed to inject UI');
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminPlugin);
    } else {
        setTimeout(initAdminPlugin, 1000);
    }

})();