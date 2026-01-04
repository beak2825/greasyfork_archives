// ==UserScript==
// @name         Universal Text Replacer for Google AI Studio
// @namespace    https://rentry.co/o9ckxybp
// @version      2.3
// @description  AI Studioの回答を指定したルールで置換する（デフォルト設定強化版）
// @author       ForeverPWA
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/* リクエストあれば
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557289/Universal%20Text%20Replacer%20for%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/557289/Universal%20Text%20Replacer%20for%20Google%20AI%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 設定キー =====
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

    let config = Object.assign({}, defaultConfig, GM_getValue(CONFIG_KEY, {}));

    // ===== ユーティリティ関数 =====
    function getModelResponseText() {
        const turns = document.querySelectorAll('ms-chat-turn');
        const lastTurn = turns[turns.length - 1];
        if (!lastTurn) return null;
        const container = lastTurn.querySelector('[data-turn-role="Model"]');
        return container;
    }

    // テキスト置換関数
    function applyReplacementRules(text) {
        if (!text) return '';
        let processedText = text;
        config.rules.forEach(rule => {
            if (rule.from) {
                // 特殊文字のエスケープ処理
                const escapedFrom = rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedFrom, 'g');
                // 変換先が空の場合は削除、それ以外は置換
                const replacement = rule.to || '';
                processedText = processedText.replace(regex, replacement);
            }
        });
        return processedText;
    }

    // ===== メインロジック =====
    let debounceTimer = null;
    function handleUpdate() {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            try {
                const container = getModelResponseText();
                if (!container) return;

                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let node;
                while (node = walker.nextNode()) {
                    let newText = node.nodeValue;
                    let hasChange = false;

                    config.rules.forEach(rule => {
                        if (rule.from && newText.includes(rule.from)) {
                            hasChange = true;
                        }
                    });

                    if (hasChange) {
                        const replaced = applyReplacementRules(node.nodeValue);
                        if (node.nodeValue !== replaced) {
                            node.nodeValue = replaced;
                        }
                    }
                }
            } catch (e) {
                console.warn("Replacer Script: error:", e);
            }
        }, 300);
    }

    // ===== 設定画面 UI (拡大版) =====
    function openSettings() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;`;

        const panel = document.createElement('div');
        panel.style.cssText = `background:#202124;color:#e8eaed;padding:30px;border-radius:12px;width:800px;max-height:85vh;overflow-y:auto;box-shadow: 0 4px 20px rgba(0,0,0,0.5);`;

        const title = document.createElement('h2');
        title.textContent = '置換設定';
        title.style.cssText = 'margin:0 0 25px;font-size:1.8em;color:#f28b82;text-align:center;border-bottom: 2px solid #3c4043;padding-bottom: 10px;';
        panel.appendChild(title);

        const rulesContainer = document.createElement('div');
        rulesContainer.style.marginBottom = '25px';

        function createRuleRow(fromVal, toVal) {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;gap:15px;margin-bottom:12px;align-items:center;';

            const fromInput = document.createElement('input');
            fromInput.placeholder = '変換元';
            fromInput.value = fromVal;
            fromInput.style.cssText = 'flex:1;padding:12px;background:#3c4043;color:#e8eaed;border:1px solid #5f6368;border-radius:6px;font-size:16px;';

            const arrow = document.createElement('span');
            arrow.textContent = '→';
            arrow.style.cssText = 'font-size:1.2em;color:#9aa0a6;font-weight:bold;';

            const toInput = document.createElement('input');
            toInput.placeholder = '変換先 (空で削除)';
            toInput.value = toVal;
            toInput.style.cssText = 'flex:1;padding:12px;background:#3c4043;color:#e8eaed;border:1px solid #5f6368;border-radius:6px;font-size:16px;';

            const delBtn = document.createElement('button');
            delBtn.textContent = '×';
            delBtn.style.cssText = 'background:transparent;color:#f28b82;border:none;cursor:pointer;font-size:1.5em;padding:0 10px;';
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
        addBtn.textContent = '+ ルールを追加';
        addBtn.style.cssText = 'width:100%;padding:12px;background:#3c4043;color:#8ab4f8;border:2px dashed #5f6368;border-radius:6px;cursor:pointer;margin-bottom:25px;font-size:16px;';
        addBtn.onclick = () => rulesContainer.appendChild(createRuleRow('', ''));
        panel.appendChild(addBtn);

        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex;justify-content:flex-end;gap:15px;border-top:1px solid #3c4043;padding-top:20px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.style.cssText = 'padding:10px 20px;background:transparent;color:#8ab4f8;border:1px solid #5f6368;border-radius:6px;cursor:pointer;';
        cancelBtn.onclick = () => overlay.remove();

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存して適用';
        saveBtn.style.cssText = 'padding:10px 25px;background:#8ab4f8;color:#202124;border:none;border-radius:6px;cursor:pointer;font-weight:bold;';
        saveBtn.onclick = () => {
            const newRules = [];
            Array.from(rulesContainer.children).forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs[0].value) {
                    newRules.push({ from: inputs[0].value, to: inputs[1].value });
                }
            });
            config.rules = newRules;
            GM_setValue(CONFIG_KEY, config);
            handleUpdate();
            overlay.remove();
        };

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        panel.appendChild(actions);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // ===== 初期化 =====
    GM_registerMenuCommand('置換設定', openSettings);

    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(handleUpdate, 2000);

})();