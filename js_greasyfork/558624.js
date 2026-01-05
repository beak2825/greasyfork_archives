// ==UserScript==
// @name         Universal Text Replacer (Mobile Optimized v4)　Android Firefox + Tampermonkey向け
// @namespace    https://rentry.co/o9ckxybp/
// @version      3.3
// @description  AI Studio/Geminiの回答を指定したルールで置換する（スマホ/Safari対応・最適化版）
// @author       ForeverPWA & Antigravity
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/* 未対応
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558624/Universal%20Text%20Replacer%20%28Mobile%20Optimized%20v4%29%E3%80%80Android%20Firefox%20%2B%20Tampermonkey%E5%90%91%E3%81%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558624/Universal%20Text%20Replacer%20%28Mobile%20Optimized%20v4%29%E3%80%80Android%20Firefox%20%2B%20Tampermonkey%E5%90%91%E3%81%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 設定 =====
    const CONFIG_KEY = 'universal_replacer_config';
    const DEBUG = false; // デバッグ時はtrue
    const PROCESSED_ATTR = 'data-replacer-processed';
    const POLLING_INTERVAL = 3000; // 3秒（バッテリー節約）

    const defaultConfig = {
        rules: [
            { from: '〇', to: '' },
            { from: '△', to: '未' },
            { from: '□', to: '幼' },
            { from: '・', to: '' },
            { from: '()', to: '' },
            { from: '**', to: '' }
        ]
    };

    function log(msg) {
        if (DEBUG) console.log(`[Replacer] ${msg}`);
    }

    // ===== ストレージ Polyfill =====
    const Storage = {
        get: function (key, def) {
            try {
                if (typeof GM_getValue === 'function') {
                    return GM_getValue(key, def);
                }
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : def;
            } catch (e) {
                console.error('[Replacer] Storage get error:', e);
                return def;
            }
        },
        set: function (key, val) {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, val);
                    return;
                }
                localStorage.setItem(key, JSON.stringify(val));
            } catch (e) {
                console.error('[Replacer] Storage set error:', e);
            }
        }
    };

    let config = Object.assign({}, defaultConfig, Storage.get(CONFIG_KEY, {}));

    // ===== 正規表現キャッシュ =====
    let compiledRules = [];

    function compileRules() {
        compiledRules = config.rules
            .filter(rule => rule.from)
            .map(rule => {
                try {
                    return {
                        regex: new RegExp(
                            rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                            'g'
                        ),
                        to: rule.to || '',
                        from: rule.from // 簡易チェック用
                    };
                } catch (e) {
                    console.error('[Replacer] Regex compile error:', e);
                    return null;
                }
            })
            .filter(r => r !== null);

        log(`Compiled ${compiledRules.length} rules`);
    }

    function applyReplacementRules(text) {
        if (!text) return text;
        let processedText = text;

        for (const rule of compiledRules) {
            if (processedText.includes(rule.from)) { // 簡易チェック
                processedText = processedText.replace(rule.regex, rule.to);
            }
        }

        return processedText;
    }

    // ===== DOM走査 (最適化版) =====

    function processNodes(root) {
        try {
            if (!root) return;

            // 1. Shadow Root探索
            if (root.shadowRoot) {
                processNodes(root.shadowRoot);
            }

            // 2. 既知のShadow Host探索
            const shadowHostSelectors = [
                'ms-chat-turn',
                'app-chat-item',
                'md-chat-message',
                'message-content',
                '[data-turn-role]'
            ];

            if (root.querySelectorAll) {
                const hosts = root.querySelectorAll(shadowHostSelectors.join(','));
                for (const host of hosts) {
                    if (host.shadowRoot) {
                        processNodes(host.shadowRoot);
                    }
                }
            }

            // 3. テキストノード走査
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {
                        if (node.parentElement) {
                            const tag = node.parentElement.tagName;
                            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            if (node.parentElement.isContentEditable) {
                                return NodeFilter.FILTER_REJECT;
                            }
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const originalText = node.nodeValue;

                // ルール適合チェック（キャッシュ済み正規表現使用）
                let needsReplacement = false;
                for (const rule of compiledRules) {
                    if (originalText.includes(rule.from)) {
                        needsReplacement = true;
                        break;
                    }
                }

                if (needsReplacement) {
                    const replaced = applyReplacementRules(originalText);
                    if (originalText !== replaced) {
                        node.nodeValue = replaced;
                        log('Replaced text');
                    }
                }
            }
        } catch (e) {
            console.error('[Replacer] processNodes error:', e);
        }
    }

    // ===== 更新監視 =====

    let isProcessing = false;
    let observer = null;
    let pollIntervalId = null;
    let intersectionObserver = null;

    function getTargetContainer() {
        const selectors = [
            'main',
            'ms-chat-history',
            'app-chat-history',
            '.chat-catch-history',
            '[role="main"]',
            '#chat-history',
            '.chat-container'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        return document.body;
    }

    function handleUpdate() {
        if (isProcessing) return;
        isProcessing = true;

        requestAnimationFrame(() => {
            try {
                const target = getTargetContainer();
                if (target) {
                    processNodes(target);
                }
            } catch (e) {
                console.warn("[Replacer] Error:", e);
            } finally {
                isProcessing = false;
            }
        });
    }

    // Idle時に処理（バッテリー節約）
    function scheduleIdleUpdate() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => handleUpdate(), { timeout: 2000 });
        } else {
            setTimeout(handleUpdate, 100);
        }
    }

    // ===== 初期化・クリーンアップ =====

    function startService() {
        log('Starting service...');

        // ルールコンパイル
        compileRules();

        // 初回実行
        handleUpdate();

        // MutationObserver
        observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (const m of mutations) {
                if (m.type === 'childList' || m.type === 'characterData') {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) scheduleIdleUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Intersection Observer（可視領域のみ処理）
        const chatContainer = getTargetContainer();
        if (chatContainer && chatContainer !== document.body) {
            intersectionObserver = new IntersectionObserver((entries) => {
                if (entries.some(e => e.isIntersecting)) {
                    scheduleIdleUpdate();
                }
            }, { threshold: 0.1 });

            intersectionObserver.observe(chatContainer);
        }

        // ポーリング（低頻度）
        pollIntervalId = setInterval(handleUpdate, POLLING_INTERVAL);

        // UI
        createFloatingButton();

        log('Service started');
    }

    function cleanup() {
        log('Cleaning up...');

        if (observer) {
            observer.disconnect();
            observer = null;
        }

        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
        }

        if (pollIntervalId) {
            clearInterval(pollIntervalId);
            pollIntervalId = null;
        }
    }

    // ページ離脱時のクリーンアップ
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    // ===== UI =====

    function createFloatingButton() {
        if (document.getElementById('mobile-replacer-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'mobile-replacer-btn';
        btn.textContent = '⚙️';
        btn.style.cssText = `
            position: fixed;
            bottom: max(20px, env(safe-area-inset-bottom));
            right: max(20px, env(safe-area-inset-right));
            width: 48px;
            height: 48px;
            background: #202124;
            color: #e8eaed;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 2147483647; 
            cursor: pointer;
            user-select: none;
            border: 1px solid #5f6368;
            -webkit-tap-highlight-color: transparent;
            transition: transform 0.2s, opacity 0.2s;
        `;

        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSettings();
        };

        document.body.appendChild(btn);
    }

    function openSettings() {
        if (document.getElementById('mobile-replacer-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'mobile-replacer-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; 
            width: 100vw; 
            height: 100dvh;
            background: rgba(0,0,0,0.6);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #2b2c30;
            color: #e8eaed;
            padding: 24px;
            border-radius: 16px;
            width: 90%;
            max-width: 400px;
            max-height: 85dvh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            font-family: sans-serif;
            font-size: 14px;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid #3c4043; padding-bottom: 10px;';

        const title = document.createElement('h2');
        title.textContent = '置換設定';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.color = '#f28b82';

        const closeX = document.createElement('span');
        closeX.textContent = '✕';
        closeX.style.cssText = 'font-size: 20px; cursor: pointer; padding: 5px;';
        closeX.onclick = () => overlay.remove();

        header.appendChild(title);
        header.appendChild(closeX);
        panel.appendChild(header);

        const rulesContainer = document.createElement('div');
        rulesContainer.style.flex = '1';
        rulesContainer.style.overflowY = 'auto';
        rulesContainer.style.marginBottom = '20px';

        function createRuleRow(fromVal, toVal) {
            const row = document.createElement('div');
            row.style.cssText = 'display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 8px; margin-bottom: 12px; align-items: center;';

            const fromInput = document.createElement('input');
            fromInput.placeholder = '検索';
            fromInput.value = fromVal;
            fromInput.style.cssText = 'padding: 10px; background: #1e1f20; color: #fff; border: 1px solid #5f6368; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box;';

            // 入力検証
            fromInput.addEventListener('input', (e) => {
                if (e.target.value.trim() === '') {
                    e.target.style.borderColor = '#f28b82';
                } else {
                    e.target.style.borderColor = '#5f6368';
                }
            });

            const arrow = document.createElement('span');
            arrow.textContent = '→';
            arrow.style.color = '#9aa0a6';

            const toInput = document.createElement('input');
            toInput.placeholder = '置換';
            toInput.value = toVal;
            toInput.style.cssText = 'padding: 10px; background: #1e1f20; color: #fff; border: 1px solid #5f6368; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box;';

            const delBtn = document.createElement('button');
            delBtn.innerHTML = '🗑️';
            delBtn.style.cssText = 'background: none; border: none; font-size: 16px; cursor: pointer; padding: 5px;';
            delBtn.onclick = () => row.remove();

            row.appendChild(fromInput);
            row.appendChild(arrow);
            row.appendChild(toInput);
            row.appendChild(delBtn);
            return row;
        }

        config.rules.forEach(rule => {
            rulesContainer.appendChild(createRuleRow(rule.from, rule.to));
        });
        panel.appendChild(rulesContainer);

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ ルール追加';
        addBtn.style.cssText = 'width: 100%; padding: 10px; background: transparent; color: #8ab4f8; border: 1px dashed #5f6368; border-radius: 8px; margin-bottom: 20px; font-size: 14px;';
        addBtn.onclick = () => rulesContainer.appendChild(createRuleRow('', ''));
        panel.appendChild(addBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存して適用';
        saveBtn.style.cssText = 'width: 100%; padding: 14px; background: #8ab4f8; color: #202124; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
        saveBtn.onclick = () => {
            const newRules = [];
            Array.from(rulesContainer.children).forEach(row => {
                const inputs = row.querySelectorAll('input');
                const fromVal = inputs[0].value.trim();
                if (fromVal) {
                    newRules.push({ from: fromVal, to: inputs[1].value });
                }
            });
            config.rules = newRules;
            Storage.set(CONFIG_KEY, config);
            compileRules(); // 再コンパイル
            handleUpdate();
            overlay.remove();
        };
        panel.appendChild(saveBtn);

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // 起動
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startService);
    } else {
        startService();
    }

})();
