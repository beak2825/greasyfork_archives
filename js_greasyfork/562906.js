// ==UserScript==
// @name         Gemini Model Selector
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  After entering the prompt and pressing Enter, you select the model.
// @author       81standard
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562906/Gemini%20Model%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/562906/Gemini%20Model%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 言語環境の自動判定
    // ==========================================
    const pageLang = document.documentElement.lang || navigator.language;
    const isJapanese = pageLang.toLowerCase().startsWith('ja');

    console.log(`[GeminiScript] Detected Language: ${pageLang} (Japanese Mode: ${isJapanese})`);

    // ==========================================
    // 2. 言語別キーワード設定
    // ==========================================
    const CONFIG = {
        ja: { // 日本語環境
            dialogTitle: "モデルを選択して送信",
            models: [
                { name: "Gemini 2.0 Flash (高速)", keyword: "高速" },
                { name: "Gemini Pro",             keyword: "Pro" },
                { name: "Gemini Thinking (思考)", keyword: "思考" }
            ]
        },
        en: { // 英語環境 (あなたの環境に合わせて修正)
            dialogTitle: "Select Model & Send",
            models: [
                // Flash ではなく "Fast" と表示されている場合に対応
                { name: "Gemini 2.0 Flash (Fast)", keyword: "Fast" },

                // Advanced ではなく "Pro" と表示されている場合に対応
                { name: "Gemini Pro",              keyword: "Pro" },

                { name: "Gemini Thinking",         keyword: "Thinking" }
            ]
        }
    };

    // 設定ロード
    const CURRENT_UI = isJapanese ? CONFIG.ja : CONFIG.en;
    const MODELS = CURRENT_UI.models;

    // ==========================================
    // セレクタ定義 (共通)
    // ==========================================
    const MODE_MENU_TRIGGER = '[data-test-id="bard-mode-menu-button"]';
    const SEND_BUTTON_SELECTOR = 'button[aria-label*="送信"], button[aria-label*="Send"], button[aria-label*="Submit"]';

    GM_addStyle(`
        #gemini-model-selector-dialog {
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: #202124;
            border: 1px solid #5f6368;
            border-radius: 8px;
            padding: 0;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            color: #e8eaed;
            font-family: 'Google Sans', sans-serif;
            min-width: 250px;
            display: flex;
            flex-direction: column;
        }
        .gms-title {
            font-size: 12px;
            color: #9aa0a6;
            padding: 8px 16px;
            background: #303134;
            border-bottom: 1px solid #5f6368;
        }
        .gms-option {
            padding: 12px 16px;
            cursor: pointer;
            font-size: 14px;
            border-left: 4px solid transparent;
        }
        .gms-option.selected {
            background-color: #3c4043;
            border-left: 4px solid #8ab4f8;
            font-weight: 500;
        }
    `);

    let isDialogVisible = false;
    let selectedIndex = 0;

    // キーボード操作
    document.addEventListener('keydown', function(e) {
        if (isDialogVisible) {
            if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (e.key === 'ArrowUp') {
                    selectedIndex = (selectedIndex - 1 + MODELS.length) % MODELS.length;
                    renderDialog();
                } else if (e.key === 'ArrowDown') {
                    selectedIndex = (selectedIndex + 1) % MODELS.length;
                    renderDialog();
                } else if (e.key === 'Enter') {
                    executeModelSwitchAndSend();
                } else if (e.key === 'Escape') {
                    closeDialog();
                }
            }
            return;
        }

        const target = e.target;
        const isInput = target.getAttribute('contenteditable') === 'true' || target.tagName === 'TEXTAREA';

        if (isInput && e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
            if (sendBtn && !sendBtn.disabled) {
                e.preventDefault();
                e.stopPropagation();
                showDialog();
            }
        }
    }, true);

    function showDialog() {
        if (document.getElementById('gemini-model-selector-dialog')) return;
        const dialog = document.createElement('div');
        dialog.id = 'gemini-model-selector-dialog';

        const title = document.createElement('div');
        title.className = 'gms-title';
        title.innerText = CURRENT_UI.dialogTitle;
        dialog.appendChild(title);
        document.body.appendChild(dialog);

        isDialogVisible = true;
        selectedIndex = 0;
        renderDialog();
    }

    function closeDialog() {
        const dialog = document.getElementById('gemini-model-selector-dialog');
        if (dialog) dialog.remove();
        isDialogVisible = false;
    }

    function renderDialog() {
        const dialog = document.getElementById('gemini-model-selector-dialog');
        if (!dialog) return;
        const oldOptions = dialog.querySelectorAll('.gms-option');
        oldOptions.forEach(el => el.remove());
        MODELS.forEach((model, index) => {
            const div = document.createElement('div');
            div.className = `gms-option ${index === selectedIndex ? 'selected' : ''}`;
            div.textContent = model.name;
            div.onclick = () => { selectedIndex = index; executeModelSwitchAndSend(); };
            dialog.appendChild(div);
        });
    }

    // ==========================================
    // 探索ロジック
    // ==========================================
    async function executeModelSwitchAndSend() {
        const targetModel = MODELS[selectedIndex];
        closeDialog();

        console.log(`[GeminiScript] Language: ${pageLang}, Searching for: "${targetModel.keyword}"`);

        const triggerBtn = document.querySelector(MODE_MENU_TRIGGER);
        if (triggerBtn) {
            triggerBtn.click();

            let foundElement = null;

            for (let i = 0; i < 20; i++) {
                await sleep(100);

                // XPathでキーワードを含む要素を探す
                const xpath = `//*[contains(text(), '${targetModel.keyword}')]`;
                const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                for (let j = 0; j < result.snapshotLength; j++) {
                    const el = result.snapshotItem(j);

                    if (el.offsetParent === null) continue;
                    if (el.tagName === 'P') continue;
                    if (el.closest('.markdown') || el.closest('.conversation-container')) continue;
                    if (el.closest('#gemini-model-selector-dialog')) continue;

                    const clickableParent = el.closest('button, [role="menuitem"], [role="option"]');
                    foundElement = clickableParent || el;

                    console.log(`[GeminiScript] Candidate found:`, foundElement);
                    break;
                }

                if (foundElement) break;
            }

            if (foundElement) {
                foundElement.click();
                await sleep(500);
            } else {
                console.error(`[GeminiScript] FAILED: Button with text "${targetModel.keyword}" not found.`);
            }
        }

        const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
        if (sendBtn) {
            sendBtn.click();
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();
