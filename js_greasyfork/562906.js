// ==UserScript==
// @name         Gemini Model Selector
// @namespace    http://tampermonkey.net/
// @version      9.0
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

    // ==========================================
    // 2. 言語別キーワード設定
    // ==========================================
    const CONFIG = {
        ja: {
            dialogTitle: "送信モードを選択",
            models: [
                { name: "Gemini 2.0 Flash (高速)", keyword: "高速" },
                { name: "Gemini Pro",             keyword: "Pro" },
                { name: "Gemini Thinking (思考)", keyword: "思考" }
            ]
        },
        en: {
            dialogTitle: "Select Model & Send",
            models: [
                { name: "Gemini 2.0 Flash (Fast)", keyword: "Fast" },
                { name: "Gemini Pro",              keyword: "Pro" },
                { name: "Gemini Thinking",         keyword: "Thinking" }
            ]
        }
    };

    const CURRENT_UI = isJapanese ? CONFIG.ja : CONFIG.en;
    const MODELS = CURRENT_UI.models;

    // ==========================================
    // 3. 設定の記憶と同期
    // ==========================================
    const STORAGE_KEY = 'gemini_selector_last_index';
    let selectedIndex = 0;

    // セレクタ定義
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
                syncWithNativeUI(); // ★表示前に純正UIの状態を読み取る
                showDialog();
            }
        }
    }, true);

    // ★純正UIのボタンテキストを読み取って選択位置を同期する関数
    function syncWithNativeUI() {
        const triggerBtn = document.querySelector(MODE_MENU_TRIGGER);
        if (!triggerBtn) return;

        const currentText = triggerBtn.innerText;
        console.log(`[GeminiScript] Syncing... Native UI says: "${currentText}"`);

        // 現在のボタンのテキストに含まれるキーワードを MODELS から探す
        const foundIndex = MODELS.findIndex(m => currentText.includes(m.keyword));

        if (foundIndex !== -1) {
            selectedIndex = foundIndex;
        } else {
            // 見つからない場合は前回の保存値をロード（保険）
            let saved = parseInt(localStorage.getItem(STORAGE_KEY));
            selectedIndex = (isNaN(saved) || saved >= MODELS.length) ? 0 : saved;
        }
    }

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

    async function executeModelSwitchAndSend() {
        localStorage.setItem(STORAGE_KEY, selectedIndex);
        const targetModel = MODELS[selectedIndex];
        closeDialog();

        const triggerBtn = document.querySelector(MODE_MENU_TRIGGER);
        if (triggerBtn) {
            // ★重要：現在のボタンのテキストが既にターゲットと同じなら、メニューを開く必要はない
            if (!triggerBtn.innerText.includes(targetModel.keyword)) {
                triggerBtn.click();
                let foundElement = null;
                for (let i = 0; i < 20; i++) {
                    await sleep(100);
                    const xpath = `//*[contains(text(), '${targetModel.keyword}')]`;
                    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    for (let j = 0; j < result.snapshotLength; j++) {
                        const el = result.snapshotItem(j);
                        if (el.offsetParent === null || el.tagName === 'P') continue;
                        if (el.closest('.markdown') || el.closest('.conversation-container')) continue;
                        if (el.closest('#gemini-model-selector-dialog')) continue;
                        const clickableParent = el.closest('button, [role="menuitem"], [role="option"]');
                        foundElement = clickableParent || el;
                        break;
                    }
                    if (foundElement) break;
                }
                if (foundElement) {
                    foundElement.click();
                    await sleep(500);
                }
            } else {
                console.log(`[GeminiScript] Model already set to ${targetModel.keyword}. Skipping click.`);
            }
        }

        const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
        if (sendBtn) sendBtn.click();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();