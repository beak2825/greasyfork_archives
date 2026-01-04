// ==UserScript==
// @name          YouTube — Auto Switch Live Chat
// @name:zh-CN    YouTube — 自动切换直播聊天室
// @name:zh-TW    YouTube — 自動切換即時聊天室
// @version       1.4
// @description    Automatically open chat panel and switch YouTube live chat to "All Messages". Supports Replay Chat. Includes "Success Lock" to respect user manual changes.
// @description:zh-CN 自动开启聊天面板并将 YouTube 直播聊天切换到「所有消息」。新增「成功锁定」机制以尊重用户手动更改。
// @description:zh-TW 自動開啟聊天面板並將 YouTube 即時聊天切換到「所有訊息」。新增「成功鎖定」機制以尊重使用者手動更改。
// @license        MIT
// @author         凝流
// @match          https://www.youtube.com/*
// @match          https://m.youtube.com/* 
// @icon           https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant          GM_getResourceText
// @grant          GM_getValue
// @grant          GM_setValue
// @run-at         document-idle
// @namespace greasyfork-Auto Switch Live Chat
// @downloadURL https://update.greasyfork.org/scripts/554873/YouTube%20%E2%80%94%20Auto%20Switch%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/554873/YouTube%20%E2%80%94%20Auto%20Switch%20Live%20Chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 環境相容性檢查 / Environment Compatibility Check ====================

    function checkCompatibility() {
        const requiredAPIs = {
            'MutationObserver': typeof MutationObserver !== 'undefined',
            'AbortController': typeof AbortController !== 'undefined',
            'Promise': typeof Promise !== 'undefined',
            'WeakMap': typeof WeakMap !== 'undefined'
        };

        const missing = Object.entries(requiredAPIs)
            .filter(([_, supported]) => !supported)
            .map(([api, _]) => api);

        if (missing.length > 0) {
            console.error(
                `[YT Chat] 瀏覽器不支援以下 API: ${missing.join(', ')}\n` +
                `建議使用: Chrome 90+ / Firefox 88+ / Safari 15+`
            );
            return false;
        }

        return true;
    }

    if (!checkCompatibility()) {
        return;
    }

    // ==================== 配置 / Configuration ====================
    const CONFIG = {
        MAX_RETRIES: 25,
        RETRY_INTERVAL: 1000,
        OBSERVER_TIMEOUT: 6000,
        SPA_DELAY: 300,
        PANEL_CHECK_INTERVAL: 1000,
        PANEL_CHECK_DURATION: 5000,
        DEBUG: true,

        SELECTORS: {
            CHAT_HEADER: 'yt-live-chat-header-renderer, yt-live-chat-app-header',
            MENU_CONTAINER: '[role="menu"], [role="listbox"], yt-live-chat-menu-renderer',
            MENU_ITEM: 'tp-yt-paper-item, yt-live-chat-menu-item-renderer, [role="menuitem"]',
            BUTTON: 'button, tp-yt-paper-button, [role="button"]',
            CHAT_CONTAINER: '#chat, #chat-container, #chatframe',
            WATCH_PAGE: 'ytd-watch-flexy, ytd-watch-grid',
            CHAT_IFRAME: 'iframe[src*="live_chat"], iframe[srcdoc*="live_chat"]',
            PANEL_BUTTONS: [
                'ytd-live-chat-entry-point-renderer button',
                '#show-hide-button button',
                'ytd-toggle-button-renderer button',
                '#chat button',
                '#chat-container button',
                '#chat-button',
                '.c-box button'
            ]
        }
    };

    // ==================== 多語言關鍵字 / Multi-language Keywords ====================
    // Default keywords as fallback
    const DEFAULT_KEYWORDS_RAW = {
        button: [
            'top chat', 'top-chat',
            '重點', '直播聊天',
            '重点', '直播聊天室', '重要消息',
            'トップチャット', 'チャット',
            '주요 채팅',
            'chat destacado', 'principal',
            'Principais mensagens',
            'Интересные сообщения',
            'Top Chat',
            'Messaggi principali',
            'Top-Chat', 'Top-Chat-Meldungen',
            'top replay chat', 'top messages replay',
            '重播熱門聊天室訊息',
            '重播热门聊天室消息', '重播重要消息',
            '上位のチャットのリプレイ',
            '주요 다시보기 채팅', '다시보기 주요 메시지',
            'chat destacado de repetición', 'mensajes destacados de repetición',
            "revoir l'essentiel du chat",
            'top-chat-wiedergabe', 'top-chat-nachrichten-wiedergabe',
            'chat di replay', 'messaggi principali di replay',
            'только интересные сообщения',
            'principais mensagens de reprise', 'chat de reprise',
        ],
        menu: [
            'all messages', 'live chat',
            '所有訊息', '即時聊天', '聊天室',
            '所有消息', '实时聊天',
            'すべてのチャット', 'チャット',
            '실시간 채팅',
            'Chat en directo', 'todos los mensajes',
            'Chat em direto',
            'все сообщения', 'Чат',
            'Chat en direct',
            'alle chats',
            'Chat live',
            'Alle Nachrichten',
            'tutti i messaggi',
            'live chat replay', 'all messages replay',
            '聊天重播', '你可以查看所有訊息',
            '你可以查看所有消息',
            'チャットのリプレイ',
            '실시간 채팅 다시보기', '모든 메시지 다시보기',
            'chat en directo de repetición', 'todos los mensajes de repetición',
            'replay du chat en direct',
            'alle nachrichten wiedergabe', 'live-chat-wiedergabe',
            'tutti i messaggi di replay',
            'запись чата',
            'todas as mensagens de reprise', 'chat ao vivo de reprise',
        ],
        exclude: [
            'top chat',
            '重點', '重要消息',
            'chat destacado',
            'лучший чат', 'Интересные сообщения',
            'トップチャット',
            'Top Chat',
            'Principais mensagens',
            'Messaggi principali',
            '주요 채팅',
            'Top-Chat', 'Top-Chat-Meldungen',
            'top replay chat', 'top messages replay',
            '重播熱門聊天室訊息',
            '重播重要消息',
            '上位のチャットのリプレイ',
            '주요 다시보기 채팅',
            'chat destacado de repetición',
            "revoir l'essentiel du chat",
            'top-chat-wiedergabe',
            'messaggi principali di replay',
            'только интересные сообщения',
            'principais mensagens de reprise',
        ],
        openPanel: [
            'show chat', 'open chat', 'show live chat',
            '顯示即時聊天', '開啟即時聊天', '顯示聊天室',
            '显示即时聊天', '开启即时聊天', '显示聊天室',
            'チャットを表示',
            '채팅 표시',
            'mostrar chat',
            'afficher le chat',
            'chat anzeigen',
            'mostra chat',
            'показать чат',
        ]
    };

    let _KEYWORDS_RAW = { ...DEFAULT_KEYWORDS_RAW };

    try {
        const customJson = GM_getResourceText('keywords');
        if (customJson) {
            const custom = JSON.parse(customJson);
            _KEYWORDS_RAW.button.push(...(custom.button || []));
            _KEYWORDS_RAW.menu.push(...(custom.menu || []));
            _KEYWORDS_RAW.exclude.push(...(custom.exclude || []));
            _KEYWORDS_RAW.openPanel.push(...(custom.openPanel || []));
            log('init', 'Custom keywords loaded successfully');
        }
    } catch (e) {
        log('warn', () => `Failed to load custom keywords: ${e.message}. Using defaults.`);
    }

    // Merge user custom keywords if any
    const customKeywords = GM_getValue('customKeywords', {});
    _KEYWORDS_RAW.button.push(...(customKeywords.button || []));
    _KEYWORDS_RAW.menu.push(...(customKeywords.menu || []));
    _KEYWORDS_RAW.exclude.push(...(customKeywords.exclude || []));
    _KEYWORDS_RAW.openPanel.push(...(customKeywords.openPanel || []));

    const normalize = (str) => {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[\s\u00A0\u200B\u2009\u202F\uFEFF]+/g, '')
            .replace(/[''`"""«»\-—–']+/g, '');
    };

    const KEYWORDS = {
        button_norm: _KEYWORDS_RAW.button.map(normalize),
        menu_norm: _KEYWORDS_RAW.menu.map(normalize),
        exclude_norm: _KEYWORDS_RAW.exclude.map(normalize),
        openPanel_norm: _KEYWORDS_RAW.openPanel.map(normalize)
    };

    const SCRIPT_BOUND_SYMBOL = Symbol.for('ytAutoChatBound_v1.4');

    /**
     * 流程：
     * 1. 檢測是否在影片/直播頁 → 若否則退出
     * 2. 嘗試開啟聊天面板（若未開啟）
     * 3. 監聽聊天 iframe 出現
     * 4. 在 iframe 內等待聊天標題 → 點擊切換按鈕 → 選擇「所有訊息」
     * 5. 驗證切換是否成功，並鎖定狀態
     */

    // ==================== 狀態管理 / State Management ====================

    class StateManager {
        constructor() {
            this.currentNavId = Date.now();
            this.processedFrames = new WeakMap();
            this.processedDocs = new WeakMap();
            this.successFlags = new WeakMap();
            this.processing = new WeakMap();
            this.activeObservers = new Set();
            this.activeTimers = new Set();
            this.activeIntervals = new Set();
            this.abortController = new AbortController();
        }

        reset() {
            this.abortController.abort();
            this.abortController = new AbortController();

            this.activeObservers.forEach(obs => {
                try { obs.disconnect(); } catch (e) {
                    console.error('[YT Chat] Observer disconnect error:', e);
                }
            });
            this.activeObservers.clear();

            this.activeTimers.forEach(timer => {
                try { clearTimeout(timer); } catch (e) {}
            });
            this.activeTimers.clear();

            this.activeIntervals.forEach(interval => {
                try { clearInterval(interval); } catch (e) {}
            });
            this.activeIntervals.clear();

            this.currentNavId = Date.now();
            this.successFlags = new WeakMap();
            this.processing = new WeakMap();
        }

        addObserver(observer) {
            this.activeObservers.add(observer);
            return observer;
        }

        addTimer(callback, delay) {
            const timer = setTimeout(() => {
                this.activeTimers.delete(timer);
                try { callback(); } catch (e) {
                    console.error('[YT Chat] Timer callback error:', e);
                }
            }, delay);
            this.activeTimers.add(timer);
            return timer;
        }

        addInterval(callback, delay) {
            const interval = setInterval(() => {
                try { callback(); } catch (e) {
                    console.error('[YT Chat] Interval callback error:', e);
                }
            }, delay);
            this.activeIntervals.add(interval);
            return interval;
        }

        clearTimer(timer) {
            if (this.activeTimers.has(timer)) {
                this.activeTimers.delete(timer);
                clearTimeout(timer);
            }
        }

        clearInterval(interval) {
            if (this.activeIntervals.has(interval)) {
                this.activeIntervals.delete(interval);
                clearInterval(interval);
            }
        }

        isProcessed(element, isFrame = false) {
            if (!element) return true;
            const map = isFrame ? this.processedFrames : this.processedDocs;
            return map.get(element) === this.currentNavId;
        }

        markProcessed(element, isFrame = false) {
            if (!element) return;
            const map = isFrame ? this.processedFrames : this.processedDocs;
            map.set(element, this.currentNavId);
        }

        markSuccess(context) {
            if (!context) return;
            this.successFlags.set(context, { navId: this.currentNavId, ts: Date.now() });
        }

        hasSucceeded(context) {
            if (!context) return false;
            const flag = this.successFlags.get(context);
            return flag && flag.navId === this.currentNavId && (Date.now() - flag.ts > 3000);
        }

        isValidNavId(navId) {
            return navId === this.currentNavId;
        }

        getSignal() {
            return this.abortController.signal;
        }

        // Added for concurrency
        isProcessing(element) {
            return this.processing.get(element) === true;
        }

        markProcessing(element, isProcessing) {
            this.processing.set(element, isProcessing);
        }
    }

    const state = new StateManager();

    // ==================== 日誌系統 / Logging System ====================
    const LOG_PREFIX = '[YT Chat]';
    const LOG_STYLE = {
        init: 'color: #4CAF50; font-weight: bold',
        success: 'color: #1E88E5',
        warn: 'color: #FF9800',
        error: 'color: #F44336',
        perf: 'color: #9C27B0'
    };

    function log(type, msgFn, context = null) {
        if (!CONFIG.DEBUG && type !== 'error') return;
        const style = LOG_STYLE[type] || '';
        const message = typeof msgFn === 'function' ? msgFn() : msgFn;
        if (context) {
            console.log(`%c${LOG_PREFIX}`, style, message, context);
        } else {
            console.log(`%c${LOG_PREFIX}`, style, message);
        }
        // Added stats logging
        if (type === 'success' && message.includes('Chat switched')) {
            const successCount = GM_getValue('successCount', 0) + 1;
            GM_setValue('successCount', successCount);
            console.log(`%c[統計] 已成功切換 ${successCount} 次`, 'color: #1E88E5');
        }
    }

    // ==================== 核心函數 / Core Functions ====================

    /**
     * 模擬點擊事件 (增強版)
     * 支援原生 click 與 PointerEvent，提高在 Shadow DOM 或現代框架下的成功率
     * @param {Element} element - 要點擊的元素
     * @returns {boolean} 是否成功觸發
     */
    window.__simulateClickMock__ = null; // For testing

    function simulateClick(element) {
        if (window.__simulateClickMock__) return window.__simulateClickMock__(element);
        if (!element) return false;
        const view = element.ownerDocument?.defaultView || window;

        let success = false;

        // 1. 嘗試原生 click
        try {
            if (typeof element.click === 'function') {
                element.click();
                success = true;
            }
        } catch (e) {
            log('warn', () => `Native click failed: ${e.message}`);
        }

        // 2. 如果原生 click 無效，嘗試 PointerEvent
        try {
            const pointerOpts = {
                bubbles: true,
                cancelable: true,
                view: view,
                pointerId: 1,
                width: 1,
                height: 1,
                pressure: 0.5,
                isPrimary: true
            };
            const pDown = new PointerEvent('pointerdown', pointerOpts);
            const pUp = new PointerEvent('pointerup', pointerOpts);

            element.dispatchEvent(pDown);
            element.dispatchEvent(pUp);
            if (!success) success = true;
        } catch (e) {
            log('warn', () => `PointerEvent simulation failed: ${e.message}`);
        }

        // 3. Fallback to MouseEvent sequence if needed
        if (!success) {
            try {
                ['mousedown', 'mouseup', 'click'].forEach(type => {
                    const event = new MouseEvent(type, { bubbles: true, cancelable: true, view });
                    element.dispatchEvent(event);
                });
                success = true;
            } catch (e) {
                log('warn', () => `MouseEvent simulation failed: ${e.message}`);
            }
        }

        return success;
    }

    function waitForElement(doc, selector, timeout, navId, signal) {
        const startTime = performance.now();
        return new Promise(resolve => {
            if (signal?.aborted) { resolve(null); return; }
            if (!state.isValidNavId(navId)) { resolve(null); return; }

            const existing = doc.querySelector(selector);
            if (existing) {
                resolve(existing);
                return;
            }

            let resolved = false;
            const cleanup = () => {
                resolved = true;
                observer.disconnect();
                state.clearTimer(timerId);
            };

            const abortHandler = () => {
                if (!resolved) {
                    cleanup();
                    resolve(null);
                }
            };
            signal?.addEventListener('abort', abortHandler, { once: true });

            const observer = new MutationObserver(() => {
                if (resolved) return;
                if (!state.isValidNavId(navId)) {
                    cleanup();
                    resolve(null);
                    return;
                }
                const el = doc.querySelector(selector);
                if (el) {
                    cleanup();
                    resolve(el);
                }
            });

            const timerId = state.addTimer(() => {
                if (!resolved) {
                    cleanup();
                    resolve(null);
                }
            }, timeout);

            function attemptObserve() {
                if (!state.isValidNavId(navId) || resolved || signal?.aborted) return;
                if (doc.body) {
                    state.addObserver(observer);
                    observer.observe(doc.body, { childList: true, subtree: true });
                } else {
                    state.addTimer(attemptObserve, 100);
                }
            }
            attemptObserve();
        });
    }

    function clickByKeywords(container, normalizedKeywords, type) {
        if (!container) return false;
        const elements = container.querySelectorAll(CONFIG.SELECTORS.BUTTON);

        for (const el of elements) {
            const textSources = [
                el.innerText, el.textContent, el.getAttribute('aria-label'),
                el.title, el.dataset.tooltip, el.getAttribute('data-tooltip-text')
            ];
            const text = textSources.find(t => t && String(t).trim())?.toString() || '';
            const normalizedText = normalize(text);

            if (normalizedText && normalizedKeywords.some(k => normalizedText.includes(k))) {
                log('init', () => `✓ Clicking ${type} button: "${text.trim()}"`);
                return simulateClick(el);
            }
        }
        return false;
    }

    // Debounce utility for performance
    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    async function pollMenuItems(options) {
        const { container, keywords = KEYWORDS.menu_norm, exclude = KEYWORDS.exclude_norm, timeout, navId, signal } = options;
        return new Promise(resolve => {
            if (signal?.aborted) { resolve(false); return; }
            if (!container) { resolve(false); return; }
            if (state.isProcessing(container)) { resolve(false); return; }

            state.markProcessing(container, true);

            let resolved = false;
            let observer;
            let timerId;

            const cleanup = () => {
                resolved = true;
                if (observer) observer.disconnect();
                state.clearTimer(timerId);
                state.markProcessing(container, false);
            };

            const abortHandler = () => { if (!resolved) { cleanup(); resolve(false); } };
            signal?.addEventListener('abort', abortHandler, { once: true });

            const checkAndClick = (mutations = []) => {
                if (resolved || signal?.aborted) return;
                if (!state.isValidNavId(navId)) { cleanup(); resolve(false); return; }

                let items = container.querySelectorAll(CONFIG.SELECTORS.MENU_ITEM);
                if (mutations.length > 0) {
                    items = [];
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.querySelectorAll) {
                                items.push(...node.querySelectorAll(CONFIG.SELECTORS.MENU_ITEM));
                            }
                        });
                    });
                }

                for (const item of items) {
                    const textSources = [
                        item.innerText, item.textContent, item.getAttribute('aria-label'),
                        item.title, item.getAttribute('data-tooltip-text')
                    ];
                    const text = textSources.find(t => t && String(t).trim())?.toString() || '';
                    const normalizedText = normalize(text);

                    if (!normalizedText) continue;
                    if (exclude.some(k => normalizedText.includes(k))) continue;

                    if (keywords.some(k => normalizedText.includes(k))) {
                        const isSelected =
                            item.hasAttribute('selected') ||
                            item.getAttribute('aria-selected') === 'true' ||
                            item.getAttribute('aria-checked') === 'true' ||
                            item.classList.contains('iron-selected') ||
                            item.classList.contains('selected');

                        if (isSelected) {
                            log('success', () => `✓ Already selected: "${text.trim()}"`);
                        } else {
                            log('success', () => `✓ Switched to: "${text.trim()}"`);
                            simulateClick(item);
                        }
                        // Immediate disconnect on success
                        cleanup();
                        observer?.disconnect();
                        resolve(true);
                        return;
                    }
                }
            };

            timerId = state.addTimer(() => {
                if (!resolved) { cleanup(); resolve(false); }
            }, timeout);

            const debouncedCheck = debounce(checkAndClick, 100);
            observer = state.addObserver(new MutationObserver(debouncedCheck));
            observer.observe(container, { childList: true, subtree: true });
            checkAndClick();
        });
    }

    async function switchChat(doc, navId, signal) {
        const startTime = performance.now();

        if (signal?.aborted || !state.isValidNavId(navId)) return;

        if (state.isProcessed(doc, false)) return;
        state.markProcessed(doc, false);

        if (state.hasSucceeded(doc)) {
            log('init', () => `↪ Already successfully switched for this navigation. Skipping.`);
            return;
        }

        if (state.isProcessing(doc)) {
            log('warn', '⚠ 已在處理中，跳過');
            return;
        }
        state.markProcessing(doc, true);
        try {
            const isIframe = (doc !== document);
            log('init', () => isIframe ? `▶ Starting chat switch in iframe.` : `▶ Starting chat switch in main page.`);

            const header = await waitForElement(doc, CONFIG.SELECTORS.CHAT_HEADER, CONFIG.OBSERVER_TIMEOUT, navId, signal);
            if (!header) return;

            if (!clickByKeywords(header, KEYWORDS.button_norm, 'switch')) {
                return;
            }

            const menu = await waitForElement(doc, CONFIG.SELECTORS.MENU_CONTAINER, CONFIG.OBSERVER_TIMEOUT, navId, signal);
            if (!menu) return;

            const success = await pollMenuItems({ container: menu, timeout: CONFIG.OBSERVER_TIMEOUT, navId, signal });

            // Added validation
            if (success) {
                state.addTimer(() => {
                    const current = doc.querySelector(CONFIG.SELECTORS.MENU_ITEM + '[selected], [aria-selected="true"]');
                    const normalizedCurrent = normalize(current?.textContent || '');
                    if (current && !KEYWORDS.exclude_norm.some(k => normalizedCurrent.includes(k))) {
                        state.markSuccess(doc);
                        log('success', '✓ Switch validated successfully');
                    } else {
                        log('error', '✗ Switch validation failed, retrying');
                        pollMenuItems({ container: menu, timeout: CONFIG.OBSERVER_TIMEOUT, navId, signal });
                    }
                }, 800); // Increased delay for UI render
            }

            const elapsed = performance.now() - startTime;
            if (success) {
                log('perf', () => `✓ Chat switched successfully in ${elapsed.toFixed(1)}ms`);
            } else {
                log('warn', () => `⚠ Chat switch incomplete after ${elapsed.toFixed(1)}ms`);
            }
        } finally {
            state.markProcessing(doc, false);
        }
    }

    function initIframe(iframe, navId, signal) {
        if (signal?.aborted || !state.isValidNavId(navId)) return;
        if (state.isProcessed(iframe, true)) return;

        state.markProcessed(iframe, true);
        log('init', () => `↪ Initializing iframe.`);

        let retries = 0;
        function tryAccess() {
            if (signal?.aborted || !state.isValidNavId(navId)) return;
            if (retries++ >= CONFIG.MAX_RETRIES) return;

            let doc;
            try {
                doc = iframe.contentDocument || iframe.contentWindow?.document;
            } catch (e) {
                if (e.name === 'SecurityError') {
                    log('warn', () => '⚠ 同源政策限制，永久跳過此 iframe');
                    state.markProcessed(iframe, true); // Permanent skip
                    return;
                }
                state.addTimer(tryAccess, CONFIG.RETRY_INTERVAL);
                return;
            }

            if (!doc || doc.readyState === 'loading') {
                state.addTimer(tryAccess, CONFIG.RETRY_INTERVAL);
                return;
            }

            switchChat(doc, navId, signal);
        }
        tryAccess();
    }

    function tryOpenChatPanel(navId) {
        if (!state.isValidNavId(navId)) return false;
        for (const selector of CONFIG.SELECTORS.PANEL_BUTTONS) {
            const buttons = document.querySelectorAll(selector);
            for (const btn of buttons) {
                const text = (btn.innerText || btn.textContent || btn.getAttribute('aria-label') || '').trim();
                const normalizedText = normalize(text);
                const matchKeywords = KEYWORDS.openPanel_norm.some(k => normalizedText.includes(k));
                const matchRaw = text && (text.includes('顯示聊天') || text.includes('show chat') || text.includes('Show chat'));

                if (matchKeywords || matchRaw) {
                    log('init', () => `✓ Opening chat panel: "${text}"`);
                    if (simulateClick(btn)) return true;
                }
            }
        }
        return false;
    }

    function setupChatPanelMonitor(navId, signal) {
        let attempts = 0;
        const maxAttempts = CONFIG.PANEL_CHECK_DURATION / CONFIG.PANEL_CHECK_INTERVAL;
        let panelOpened = false;

        const checkPanel = () => {
            if (signal?.aborted || !state.isValidNavId(navId) || panelOpened) {
                state.clearInterval(intervalId);
                return;
            }
            attempts++;
            if (tryOpenChatPanel(navId)) {
                panelOpened = true;
                state.clearInterval(intervalId);
            } else if (attempts >= maxAttempts) {
                log('warn', () => `⚠ 面板開啟失敗！嘗試的選擇器: ${CONFIG.SELECTORS.PANEL_BUTTONS.join(', ')}`);
                state.clearInterval(intervalId);
            }
        };
        checkPanel();
        const intervalId = state.addInterval(checkPanel, CONFIG.PANEL_CHECK_INTERVAL);
    }

    function startProcessing() {
        const navId = state.currentNavId;
        const signal = state.getSignal();

        log('init', '╔═══════════════════════════════════════╗');
        log('init', 'YouTube Auto Switch Live Chat v1.4');
        log('init', '╚═══════════════════════════════════════╝');

        const isLiveChatPage = location.pathname.startsWith('/live_chat');
        const isVideoPage = document.querySelector(CONFIG.SELECTORS.WATCH_PAGE);

        if (!isLiveChatPage && !isVideoPage) return;

        if (isLiveChatPage) {
            switchChat(document, navId, signal);
            return;
        }

        setupChatPanelMonitor(navId, signal);

        const observer = state.addObserver(new MutationObserver(mutations => {
            if (signal?.aborted || !state.isValidNavId(navId)) {
                observer.disconnect();
                return;
            }
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IFRAME') {
                        const src = node.src || '';
                        const srcdoc = node.srcdoc || '';
                        if (src.includes('live_chat') || srcdoc.includes('live_chat')) {
                            initIframe(node, navId, signal);
                        }
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll(CONFIG.SELECTORS.CHAT_IFRAME)
                            .forEach(iframe => initIframe(iframe, navId, signal));
                    }
                });
            });
        }));

        const chatContainer = document.querySelector(CONFIG.SELECTORS.CHAT_CONTAINER);
        const observeTarget = chatContainer || document.body;

        if (observeTarget && state.isValidNavId(navId)) {
            observer.observe(observeTarget, { childList: true, subtree: true });
        }

        state.addTimer(() => {
            if (signal?.aborted || !state.isValidNavId(navId)) return;
            document.querySelectorAll(CONFIG.SELECTORS.CHAT_IFRAME)
                .forEach(iframe => initIframe(iframe, navId, signal));
        }, CONFIG.SPA_DELAY);
    }

    function init() {
        startProcessing();
        if (!window[SCRIPT_BOUND_SYMBOL]) {
            window[SCRIPT_BOUND_SYMBOL] = true;
            window.addEventListener('yt-navigate-finish', () => {
                log('init', () => '↪ SPA navigation detected.');
                state.reset();
                startProcessing();
            });
            // Added for browser back/forward handling
            window.addEventListener('popstate', () => {
                log('init', () => '↪ Browser history navigation detected (back/forward).');
                state.reset();
                startProcessing();
            });
        }
    }

    init();
})();