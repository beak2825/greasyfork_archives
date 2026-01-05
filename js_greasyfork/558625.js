// ==UserScript==
// @name         Universal Text Replacer (iOS Safari対応版)
// @namespace    https://rentry.co/o9ckxybp/
// @version      4.1
// @description  iOS Safari (Userscripts拡張機能)で動作する置換スクリプト
// @author       ForeverPWA & Antigravity
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558625/Universal%20Text%20Replacer%20%28iOS%20Safari%E5%AF%BE%E5%BF%9C%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558625/Universal%20Text%20Replacer%20%28iOS%20Safari%E5%AF%BE%E5%BF%9C%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== iOS Safari対応ストレージ =====
    const CONFIG_KEY = 'universal_replacer_config';
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

    // iOS Safariでは GM_* APIが使えないので localStorage のみ使用
    const Storage = {
        get: function (key, def) {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : def;
            } catch (e) {
                console.warn('[Replacer] Storage get failed:', e);
                return def;
            }
        },
        set: function (key, val) {
            try {
                localStorage.setItem(key, JSON.stringify(val));
                return true;
            } catch (e) {
                console.warn('[Replacer] Storage set failed:', e);
                return false;
            }
        }
    };

    let config = Object.assign({}, defaultConfig, Storage.get(CONFIG_KEY, {}));

    // ===== 正規表現の事前コンパイル =====
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
                        from: rule.from  // 高速チェック用
                    };
                } catch (e) {
                    console.error('[Replacer] Regex compile error:', e);
                    return null;
                }
            })
            .filter(Boolean);
    }

    compileRules();

    // ===== テキスト置換ロジック =====
    function applyReplacementRules(text) {
        if (!text || compiledRules.length === 0) return text;

        let processedText = text;
        for (const rule of compiledRules) {
            processedText = processedText.replace(rule.regex, rule.to);
        }
        return processedText;
    }

    // ===== DOM走査（iOS最適化版） =====
    const PROCESSED_ATTR = 'data-replacer-v4';

    function processNodes(root) {
        if (!root) return;

        try {
            // 既に処理済みならスキップ
            if (root.nodeType === Node.ELEMENT_NODE &&
                root.getAttribute(PROCESSED_ATTR) === 'true') {
                return;
            }

            // Shadow Root処理
            if (root.shadowRoot) {
                processNodes(root.shadowRoot);
            }

            // 既知のShadow Hostを探す
            if (root.querySelectorAll) {
                const shadowHosts = root.querySelectorAll(
                    'ms-chat-turn, app-chat-item, md-chat-message, message-content, [data-turn-role]'
                );
                for (const host of shadowHosts) {
                    if (host.shadowRoot) {
                        processNodes(host.shadowRoot);
                    }
                }
            }

            // テキストノード走査
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {
                        if (!node.parentElement) return NodeFilter.FILTER_REJECT;

                        const tag = node.parentElement.tagName;
                        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (node.parentElement.isContentEditable) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                const originalText = node.nodeValue;

                // ルールに該当するかチェック（includes()で高速化）
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
                    }
                }
            }

            // 処理済みマークを付ける
            if (root.nodeType === Node.ELEMENT_NODE) {
                root.setAttribute(PROCESSED_ATTR, 'true');
            }

        } catch (e) {
            console.error('[Replacer] processNodes error:', e);
        }
    }

    // ===== 更新監視（iOS最適化） =====
    let isProcessing = false;
    let updateTimeout = null;

    function getTargetContainer() {
        const selectors = [
            'main',
            'ms-chat-history',
            'app-chat-history',
            '.chat-history',
            '[role="main"]',
            '#chat-history'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        return document.body;
    }

    function handleUpdate() {
        if (isProcessing) return;

        // デバウンス処理（iOS向け）
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            isProcessing = true;

            requestAnimationFrame(() => {
                try {
                    const target = getTargetContainer();
                    if (target) {
                        processNodes(target);
                    }
                } catch (e) {
                    console.warn("[Replacer] Update error:", e);
                } finally {
                    isProcessing = false;
                }
            });
        }, 100);
    }

    // ===== 初期化 =====
    let observer = null;
    let pollingInterval = null;

    // visibilitychange ハンドラ（クリーンアップ用に分離）
    const handleVisibility = () => {
        if (!document.hidden) handleUpdate();
    };

    function startService() {
        console.log('[Replacer] Starting iOS Safari version...');

        // 初回実行
        setTimeout(handleUpdate, 500);

        // MutationObserver
        observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length > 0) {
                    handleUpdate();
                    break;
                }
            }
        });

        const container = getTargetContainer();
        observer.observe(container, {
            childList: true,
            subtree: true
        });

        // ポーリング（iOS向けに2秒間隔）
        pollingInterval = setInterval(() => {
            if (!document.hidden) {
                handleUpdate();
            }
        }, 2000);

        // イベントリスナー
        window.addEventListener('beforeunload', cleanup);
        document.addEventListener('visibilitychange', handleVisibility);

        // UI作成
        createFloatingButton();
    }

    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
        document.removeEventListener('visibilitychange', handleVisibility);
    }

    // ===== タッチ最適化UI =====
    function createFloatingButton() {
        if (document.getElementById('mobile-replacer-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'mobile-replacer-btn';
        btn.textContent = '⚙️';
        btn.style.cssText = `
            position: fixed;
            bottom: max(20px, env(safe-area-inset-bottom, 20px));
            right: max(20px, env(safe-area-inset-right, 20px));
            width: 56px;
            height: 56px;
            background: #202124;
            color: #e8eaed;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 2147483647;
            cursor: pointer;
            user-select: none;
            border: 2px solid #5f6368;
            -webkit-tap-highlight-color: transparent;
            touch-action: none;
            transition: transform 0.2s;
        `;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.style.transform = 'scale(0.9)';
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.style.transform = 'scale(1)';
            openSettings();
        }, { passive: false });

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
            height: 100vh;
            height: 100dvh;
            background: rgba(0,0,0,0.7);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #2b2c30;
            color: #e8eaed;
            padding: 24px;
            border-radius: 20px;
            width: 90%;
            max-width: 420px;
            max-height: 80vh;
            max-height: 80dvh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 16px;
            display: flex;
            flex-direction: column;
            -webkit-overflow-scrolling: touch;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid #3c4043; padding-bottom: 12px;';

        const title = document.createElement('h2');
        title.textContent = '置換設定';
        title.style.margin = '0';
        title.style.fontSize = '20px';
        title.style.color = '#f28b82';
        title.style.fontWeight = '600';

        const closeX = document.createElement('button');
        closeX.textContent = '✕';
        closeX.style.cssText = 'font-size: 24px; background: none; border: none; color: #9aa0a6; cursor: pointer; padding: 8px; min-width: 44px; min-height: 44px;';
        closeX.onclick = () => overlay.remove();

        header.appendChild(title);
        header.appendChild(closeX);
        panel.appendChild(header);

        const rulesContainer = document.createElement('div');
        rulesContainer.style.flex = '1';
        rulesContainer.style.overflowY = 'auto';
        rulesContainer.style.marginBottom = '20px';
        rulesContainer.style.WebkitOverflowScrolling = 'touch';

        function createRuleRow(fromVal, toVal) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; padding: 12px; background: #1e1f20; border-radius: 12px;';

            const inputRow = document.createElement('div');
            inputRow.style.cssText = 'display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center;';

            const fromInput = document.createElement('input');
            fromInput.placeholder = '検索';
            fromInput.value = fromVal;
            fromInput.style.cssText = 'padding: 12px; background: #333; color: #fff; border: 1px solid #5f6368; border-radius: 10px; font-size: 16px; width: 100%; box-sizing: border-box;';

            const arrow = document.createElement('span');
            arrow.textContent = '→';
            arrow.style.cssText = 'color: #9aa0a6; font-size: 20px; padding: 0 4px;';

            const toInput = document.createElement('input');
            toInput.placeholder = '置換';
            toInput.value = toVal;
            toInput.style.cssText = 'padding: 12px; background: #333; color: #fff; border: 1px solid #5f6368; border-radius: 10px; font-size: 16px; width: 100%; box-sizing: border-box;';

            inputRow.appendChild(fromInput);
            inputRow.appendChild(arrow);
            inputRow.appendChild(toInput);

            const delBtn = document.createElement('button');
            delBtn.innerHTML = '🗑️ 削除';
            delBtn.style.cssText = 'background: #3c1f1f; color: #f28b82; border: 1px solid #5f2828; padding: 10px; border-radius: 8px; font-size: 14px; cursor: pointer; min-height: 44px;';
            delBtn.onclick = () => row.remove();

            row.appendChild(inputRow);
            row.appendChild(delBtn);
            return row;
        }

        config.rules.forEach(rule => {
            rulesContainer.appendChild(createRuleRow(rule.from, rule.to));
        });
        panel.appendChild(rulesContainer);

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ ルール追加';
        addBtn.style.cssText = 'width: 100%; padding: 14px; background: transparent; color: #8ab4f8; border: 2px dashed #5f6368; border-radius: 12px; margin-bottom: 16px; font-size: 16px; cursor: pointer; min-height: 48px; font-weight: 500;';
        addBtn.onclick = () => {
            rulesContainer.appendChild(createRuleRow('', ''));
            rulesContainer.scrollTop = rulesContainer.scrollHeight;
        };
        panel.appendChild(addBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存して適用';
        saveBtn.style.cssText = 'width: 100%; padding: 16px; background: #8ab4f8; color: #202124; border: none; border-radius: 12px; font-weight: 600; font-size: 17px; box-shadow: 0 2px 8px rgba(138,180,248,0.3); cursor: pointer; min-height: 52px;';
        saveBtn.onclick = () => {
            const newRules = [];
            Array.from(rulesContainer.children).forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs[0] && inputs[0].value.trim()) {
                    newRules.push({
                        from: inputs[0].value,
                        to: inputs[1].value
                    });
                }
            });

            config.rules = newRules;
            if (Storage.set(CONFIG_KEY, config)) {
                compileRules();

                // 処理済みマークをすべて削除して再処理
                document.querySelectorAll(`[${PROCESSED_ATTR}]`).forEach(el => {
                    el.removeAttribute(PROCESSED_ATTR);
                });

                handleUpdate();

                // 保存成功フィードバック
                saveBtn.textContent = '✓ 保存完了';
                saveBtn.style.background = '#81c995';
                setTimeout(() => overlay.remove(), 800);
            } else {
                alert('保存に失敗しました');
            }
        };
        panel.appendChild(saveBtn);

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // ===== 起動 =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startService);
    } else {
        startService();
    }

})();