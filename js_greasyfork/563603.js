// ==UserScript==
// @name         Gemini Suite
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Add features to Gemini
// @author       81standard
// @match        https://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563603/Gemini%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/563603/Gemini%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // ■ 設定とメニュー登録
    // ==========================================

    const SCRIPTS = [
        { id: 'enable_selector', name: 'Model Selector',             def: true },
        { id: 'enable_history',  name: 'History & Navigation Booster', def: true },
        { id: 'enable_saver',    name: 'Input Auto-Saver',             def: true },
        { id: 'enable_paste',    name: 'Plain Text Paste',             def: false }, // 初期値をfalse(オフ)に変更
    ];

    GM_registerMenuCommand("Setting(スクリプト設定を開く)", openSettingsDialog);

    runEnabledScripts();

    function runEnabledScripts() {
        if (GM_getValue('enable_selector', true)) Module_ModelSelector();
        if (GM_getValue('enable_history', true))  Module_HistoryBooster();
        if (GM_getValue('enable_saver', true))    Module_AutoSaver();
        if (GM_getValue('enable_paste', false))   Module_PlainTextPaste(); // ここも同期
    }


    // ==========================================
    // ■ モジュール 1: Model Selector
    // ==========================================
    function Module_ModelSelector() {
        const pageLang = document.documentElement.lang || navigator.language;
        const isJapanese = pageLang.toLowerCase().startsWith('ja');

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
        const STORAGE_KEY = 'gemini_selector_last_index';
        let selectedIndex = 0;

        const MODE_MENU_TRIGGER = '[data-test-id="bard-mode-menu-button"]';
        const SEND_BUTTON_SELECTOR = 'button[aria-label*="送信"], button[aria-label*="Send"], button[aria-label*="Submit"]';

        const style = document.createElement('style');
        style.textContent = `
            #gemini-model-selector-dialog {
                position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%);
                background: #202124; border: 1px solid #5f6368; border-radius: 8px;
                padding: 0; z-index: 99999; box-shadow: 0 4px 20px rgba(0,0,0,0.7);
                color: #e8eaed; font-family: 'Google Sans', sans-serif;
                min-width: 250px; display: flex; flex-direction: column;
            }
            .gms-title {
                font-size: 12px; color: #9aa0a6; padding: 8px 16px;
                background: #303134; border-bottom: 1px solid #5f6368;
            }
            .gms-option {
                padding: 12px 16px; cursor: pointer; font-size: 14px;
                border-left: 4px solid transparent;
            }
            .gms-option:hover { background-color: #3c4043; }
            .gms-option.selected {
                background-color: #3c4043; border-left: 4px solid #8ab4f8; font-weight: 500;
            }
        `;
        document.head.appendChild(style);

        let isDialogVisible = false;

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
                        confirmAndAction(true);
                    } else if (e.key === 'Escape') {
                        confirmAndAction(false);
                    }
                }
                return;
            }

            const target = e.target;
            const editableElement = target.closest('[contenteditable="true"]');
            const isInput = (editableElement !== null) || target.tagName === 'TEXTAREA';

            if (isInput && e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
                if (sendBtn && !sendBtn.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    syncWithNativeUI();
                    showDialog();
                }
            }
        }, true);

        document.addEventListener('mousedown', function(e) {
            if (isDialogVisible) {
                const dialog = document.getElementById('gemini-model-selector-dialog');
                if (dialog && !dialog.contains(e.target)) {
                    confirmAndAction(false);
                }
            }
        }, true);

        function syncWithNativeUI() {
            const triggerBtn = document.querySelector(MODE_MENU_TRIGGER);
            if (!triggerBtn) return;
            const currentText = triggerBtn.innerText;
            const foundIndex = MODELS.findIndex(m => currentText.includes(m.keyword));
            if (foundIndex !== -1) {
                selectedIndex = foundIndex;
            } else {
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
                div.onclick = (e) => {
                    e.stopPropagation();
                    selectedIndex = index;
                    confirmAndAction(true);
                };
                dialog.appendChild(div);
            });
        }

        async function confirmAndAction(isSending) {
            localStorage.setItem(STORAGE_KEY, selectedIndex);
            const targetModel = MODELS[selectedIndex];
            closeDialog();
            await performModelSwitch(targetModel);
            if (isSending) {
                const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
                if (sendBtn) sendBtn.click();
            }
        }

        async function performModelSwitch(targetModel) {
            const triggerBtn = document.querySelector(MODE_MENU_TRIGGER);
            if (triggerBtn) {
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
                        await sleep(300);
                    }
                }
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }


    // ==========================================
    // ■ モジュール 2: History & Navigation Booster
    // ==========================================
    function Module_HistoryBooster() {
        // 前半：サイドバーのリンク修正（ここは変更なし）
        const fixSidebarLinks = () => {
            const baseUrl = window.location.origin + window.location.pathname.split('/app')[0] + '/app/';
            const items = document.querySelectorAll('div[data-test-id="conversation"]:not([data-link-ready])');

            items.forEach(item => {
                const jslog = item.getAttribute('jslog');
                if (!jslog) return;
                const idWithPrefix = jslog.match(/c_[a-z0-9]{16}/);

                if (idWithPrefix) {
                    const pureId = idWithPrefix[0].replace('c_', '');
                    const targetUrl = baseUrl + pureId;

                    item.setAttribute('data-link-ready', 'true');

                    const ghostLink = document.createElement('a');
                    ghostLink.href = targetUrl;
                    ghostLink.style.position = 'absolute';
                    ghostLink.style.inset = '0';
                    ghostLink.style.zIndex = '10';
                    ghostLink.setAttribute('aria-hidden', 'true');
                    ghostLink.classList.add('gemini-history-link');

                    if (getComputedStyle(item).position === 'static') {
                        item.style.position = 'relative';
                    }

                    ghostLink.addEventListener('click', (e) => {
                        if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                            e.preventDefault();
                            item.click();
                        }
                    });

                    item.appendChild(ghostLink);
                }
            });
        };

        const observer = new MutationObserver(fixSidebarLinks);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setInterval(fixSidebarLinks, 2000);

        // 後半：あいまい検索ロジック（★ここを変更）
        const normalize = (str) => {
            return str.replace(/\s+/g, '').replace(/[…\.]{2,}$/, '').toLowerCase();
        };

document.addEventListener('click', function(e) {
    // 左クリックのみ
    if (e.button !== 0) return;

    const isAlt = e.altKey && !e.ctrlKey && !e.metaKey;
    const isCtrl = e.ctrlKey && !e.altKey && !e.metaKey; // Ctrl+クリック（要望）

    if (!isAlt && !isCtrl) return;

    // 本物のリンクはブラウザ標準挙動に任せる（2重で開く事故防止）
    if (e.target.closest('a[href]')) return;

    const targetItem = e.target.closest('.conversation-container, [role="option"]');
    if (!targetItem || e.target.closest('nav')) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const normalize = (str) => str.replace(/\s+/g, '').replace(/[…\.]{2,}$/, '').toLowerCase();

    let searchRawTitle = targetItem.innerText.split('\n')[0].trim();
    const searchTitle = normalize(searchRawTitle);
    if (!searchTitle) return;

    const allLinks = document.querySelectorAll('a[href*="/app/"]');
    let foundUrl = null;
    let debugTitles = [];

    for (const link of allLinks) {
        const rawText = link.innerText || link.getAttribute('aria-label') || "";
        if (!rawText) continue;

        const linkTitle = normalize(rawText);
        if (debugTitles.length < 5 && linkTitle.length > 2) {
            debugTitles.push(rawText.substring(0, 20));
        }

        if (searchTitle.includes(linkTitle) || linkTitle.includes(searchTitle)) {
            foundUrl = link.href;
            break;
        }
    }

    if (!foundUrl) {
        // Altのときだけアラート（Ctrlで誤爆した時に邪魔になりやすいので）
        if (isAlt) {
            let msg = `「${searchRawTitle}」に対応するリンクが見つかりませんでした。\n\n`;
            msg += `【可能性】\n・サイドバーの読み込みがまだ（スクロールしてください）\n・タイトルが大きく省略されている\n\n`;
            msg += `【候補】\n${debugTitles.join('\n')}\n...`;
            alert(msg);
        }
        return;
    }

    if (isAlt) {
        // フォアグラウンド新規タブ（従来通り）
        window.open(foundUrl, '_blank');
        return;
    }

    // Ctrl+左クリック: バックグラウンド新規タブ
    if (typeof GM_openInTab === 'function') {
        GM_openInTab(foundUrl, { active: false, insert: true, setParent: true });
    } else {
        // 念のためフォールバック（環境によっては前面になることがあります）
        const w = window.open(foundUrl, '_blank');
        if (w) { w.blur(); window.focus(); }
    }
}, true);
    }

    // ==========================================
    // ■ モジュール 3: Input Auto-Saver
    // ==========================================
    function Module_AutoSaver() {
        const KEY_PREFIX = 'gemini_draft_v9_';
        let lastSavedHTML = '';
        let currentInputRef = null;
        let currentPath = window.location.pathname;

        function getNormalizedPath() {
            return window.location.pathname.replace(/\/app\/c_/, '/app/');
        }

        function getStorageKey() {
            return KEY_PREFIX + getNormalizedPath();
        }

        function fixAddressBarUrl() {
            const path = window.location.pathname;
            if (path.includes('/app/c_')) {
                const cleanPath = path.replace(/\/app\/c_/, '/app/');
                history.replaceState(null, '', cleanPath + window.location.search);
                currentPath = cleanPath;
            }
        }

        function clearSavedDraft() {
            const key = getStorageKey();
            localStorage.removeItem(key);
            lastSavedHTML = '';
        }

        function saveDraft(html) {
            const key = getStorageKey();
            localStorage.setItem(key, html);
            lastSavedHTML = html;
        }

        function restoreDraft(inputArea) {
            const key = getStorageKey();
            const savedHTML = localStorage.getItem(key);

            if (inputArea.innerText.trim() === '') {
                if (savedHTML) {
                    inputArea.innerHTML = savedHTML;
                    inputArea.dispatchEvent(new Event('input', { bubbles: true }));
                    try {
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(inputArea);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } catch(e) {}
                    lastSavedHTML = savedHTML;
                } else {
                    lastSavedHTML = '';
                }
            }
        }

        function setupInputListeners(inputArea) {
            const handleInput = () => {
                const currentHTML = inputArea.innerHTML;
                const currentText = inputArea.innerText;
                const isEmpty = currentText.replace(/\s|[\u3000]/g, '').length === 0;

                if (isEmpty) {
                    if (localStorage.getItem(getStorageKey()) !== null) {
                        clearSavedDraft();
                    }
                } else {
                    if (currentHTML !== lastSavedHTML) {
                        saveDraft(currentHTML);
                    }
                }
            };

            inputArea.addEventListener('input', handleInput);
            inputArea.addEventListener('keyup', handleInput);

            inputArea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                    setTimeout(clearSavedDraft, 100);
                }
            });
        }

        document.addEventListener('click', function(e) {
            const btn = e.target.closest('button');
            if (btn) {
                const label = btn.getAttribute('aria-label') || '';
                if (label.includes('送信') || label.includes('Send')) {
                    setTimeout(clearSavedDraft, 100);
                }
            }
        }, true);

        const observer = new MutationObserver((mutations) => {
            fixAddressBarUrl();
            const newPath = window.location.pathname;
            if (newPath !== currentPath) {
                currentPath = newPath;
                if (currentInputRef) {
                    currentInputRef.innerText = '';
                    restoreDraft(currentInputRef);
                }
            }
            const inputArea = document.querySelector('div[contenteditable="true"]');
            if (inputArea) {
                if (inputArea !== currentInputRef) {
                    currentInputRef = inputArea;
                    restoreDraft(inputArea);
                    setupInputListeners(inputArea);
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }


    // ==========================================
    // ■ モジュール 4: Plain Text Paste
    // ==========================================
    function Module_PlainTextPaste() {
        document.addEventListener('paste', function(e) {
            if (e.target.isContentEditable || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            }
        }, true);
    }


    // ==========================================
    // ■ 設定画面のUIロジック
    // ==========================================
    function openSettingsDialog() {
        if (document.getElementById('gemini-suite-overlay')) return;

        const style = document.createElement('style');
        style.id = 'gemini-suite-style';
        style.textContent = `
            #gemini-suite-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; }
            #gemini-suite-dialog {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: var(--md-sys-color-surface, #fff); color: var(--md-sys-color-on-surface, #000);
                padding: 24px; border-radius: 16px; width: 380px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                display: flex; flex-direction: column; gap: 12px; font-family: 'Google Sans', sans-serif;
            }
            .gs-title { font-size: 18px; font-weight: 500; margin-bottom: 8px; color: var(--md-sys-color-on-surface); }
            .gs-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer; border-bottom: 1px solid rgba(128,128,128,0.1); }
            .gs-row:last-of-type { border-bottom: none; }
            .gs-checkbox { width: 20px; height: 20px; cursor: pointer; accent-color: #0b57d0; }
            .gs-label { flex: 1; cursor: pointer; font-size: 14px; color: var(--md-sys-color-on-surface-variant); }
            .gs-btn-area { text-align: right; margin-top: 16px; }
            .gs-btn {
                padding: 8px 20px; background: #0b57d0; color: white; border: none;
                border-radius: 20px; cursor: pointer; font-weight: 500; font-size: 14px;
                transition: background 0.2s;
            }
            .gs-btn:hover { background: #0842a0; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'gemini-suite-overlay';

        const dialog = document.createElement('div');
        dialog.id = 'gemini-suite-dialog';
        dialog.innerHTML = `<div class="gs-title">Gemini Suite Settings</div>`;

        SCRIPTS.forEach(script => {
            const isChecked = GM_getValue(script.id, script.def) ? 'checked' : '';
            const row = document.createElement('label');
            row.className = 'gs-row';
            row.innerHTML = `
                <input type="checkbox" class="gs-checkbox" data-id="${script.id}" ${isChecked}>
                <span class="gs-label">${script.name}</span>
            `;
            dialog.appendChild(row);
        });

        const btnArea = document.createElement('div');
        btnArea.className = 'gs-btn-area';
        btnArea.innerHTML = `<button class="gs-btn">Save & Reload</button>`;
        dialog.appendChild(btnArea);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        btnArea.querySelector('button').addEventListener('click', () => {
            dialog.querySelectorAll('.gs-checkbox').forEach(box => {
                GM_setValue(box.dataset.id, box.checked);
            });
            overlay.remove();
            style.remove();
            location.reload();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                style.remove();
            }
        });
    }

})();