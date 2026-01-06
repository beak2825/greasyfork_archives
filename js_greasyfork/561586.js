// ==UserScript==
// @name         Google AI Studio - 分頁標題同步工具
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  將 Google AI Studio 的對話名稱同步到分頁標題。修復 H1 標題抓取問題。
// @author       wei9133 & AI
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561586/Google%20AI%20Studio%20-%20%E5%88%86%E9%A0%81%E6%A8%99%E9%A1%8C%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561586/Google%20AI%20Studio%20-%20%E5%88%86%E9%A0%81%E6%A8%99%E9%A1%8C%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(msg) { console.log(`%c[GAS-v6] ${msg}`, 'color: #00ff00; font-weight: bold;'); }
    function errorLog(msg) { console.log(`%c[GAS-v6 Error] ${msg}`, 'color: #ff0000; font-weight: bold;'); }

    // --- 設定 ---
    const DEFAULT_CONFIG = {
        position: 'left-mid',
        mode: 'manual',
        manualOptions: { listenInput: true, listenUrl: true },
        autoInterval: 600000,
        hh: 0, mm: 10, ss: 0
    };
    let config = GM_getValue('gas_config_v6', DEFAULT_CONFIG);
    if (!config.manualOptions) config.manualOptions = { listenInput: true, listenUrl: true };

    let autoTimer = null;
    let lastUrl = location.href;

    // --- CSS ---
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        #gas-container { display: flex; align-items: center; justify-content: center; z-index: 9000; }
        #gas-container.pos-top { margin-left: 10px; }
        #gas-container.pos-left-mid { flex-direction: column; padding: 10px 0; width: 100%; }
        #gas-container.pos-left-bot { flex-direction: column; padding-bottom: 10px; width: 100%; }
        .gas-btn {
            background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ddd; border-radius: 4px; cursor: pointer; padding: 0;
            font-family: monospace; min-width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .gas-btn:hover { background: rgba(255, 255, 255, 0.2); color: #fff; border-color: #fff; }
        .gas-btn.active { color: #8ab4f8; border-color: #8ab4f8; background: rgba(138, 180, 248, 0.1); }
        /* 設定面板 */
        #gas-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 999999; display: flex; justify-content: center; align-items: center; }
        #gas-panel { background: #202124; color: #e8eaed; padding: 24px; border-radius: 8px; border: 1px solid #5f6368; width: 380px; font-family: sans-serif; box-shadow: 0 12px 24px rgba(0,0,0,0.5); }
        .gas-row { margin-bottom: 20px; }
        .gas-label { display: block; margin-bottom: 8px; color: #8ab4f8; font-weight: 500; font-size: 14px; }
        .gas-radio-group { display: flex; gap: 16px; }
        .gas-radio-item { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .gas-sub-box { margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 4px; }
        .gas-checkbox-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer; font-size: 13px; }
        .gas-time-input { background: #3c4043; border: 1px solid #5f6368; color: #fff; width: 40px; padding: 4px; text-align: center; border-radius: 4px; margin: 0 4px; }
        .gas-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .gas-btn-save { background: #8ab4f8; color: #202124; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }
        .gas-btn-close { background: transparent; color: #9aa0a6; border: 1px solid #5f6368; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    `;
    document.head.appendChild(styleEl);

    // --- 核心：抓取標題 (修正版) ---
    function getPromptTitle() {
        // 1. 優先檢查是否正在編輯 (這時會有 Input)
        const editingInput = document.querySelector('ms-toolbar input') || document.querySelector('input[placeholder="Untitled prompt"]');
        if (editingInput && editingInput.value && editingInput.value.trim() !== "") {
            return editingInput.value.trim();
        }

        // 2. 檢查顯示狀態的 H1 (根據你的偵探結果)
        // 選擇器：找 class 包含 mode-title 的 h1，或者是 ms-toolbar 下的 h1
        const h1 = document.querySelector('h1.mode-title') || document.querySelector('ms-toolbar h1');
        if (h1 && h1.textContent && h1.textContent.trim() !== "") {
            return h1.textContent.trim();
        }

        return null;
    }

    function syncTitle(source = 'Unknown') {
        const titleName = getPromptTitle();
        if (titleName) {
            const newTitle = `${titleName} - AI Studio`;
            if (document.title !== newTitle) {
                document.title = newTitle;
                log(`[${source}] 更新成功: ${newTitle}`);
                return true;
            }
        } else {
            // log(`[${source}] 找不到標題內容`);
        }
        return false;
    }

    // --- 監聽器 ---
    function startListeners() {
        if (autoTimer) clearInterval(autoTimer);

        if (config.mode === 'auto') {
            syncTitle('Auto-Init');
            autoTimer = setInterval(() => syncTitle('Auto-Timer'), config.autoInterval);
        } else {
            // 智慧手動模式
            setTimeout(() => syncTitle('Manual-Init'), 2000);

            // 1. 監聽輸入 (針對編輯時的 Input)
            if (config.manualOptions.listenInput) {
                document.body.addEventListener('input', (e) => {
                    // 只要在工具列區域打字，就嘗試同步
                    if (e.target.closest('ms-toolbar')) {
                        syncTitle('Input-Event');
                    }
                }, true); // 使用 Capture 模式確保抓到
            }

            // 2. 監聽 H1 變化 (針對非編輯狀態的動態載入)
            // 因為 H1 不是 input，不會觸發 input 事件，所以用 MutationObserver 監測它
            if (config.manualOptions.listenInput) {
                const observer = new MutationObserver(() => {
                    syncTitle('Mutation-H1');
                });
                // 定期嘗試綁定 observer，因為 SPA 換頁會重繪 H1
                const bindObserver = setInterval(() => {
                    const h1 = document.querySelector('h1.mode-title');
                    if (h1 && !h1.dataset.gasObserved) {
                        observer.observe(h1, { characterData: true, childList: true, subtree: true });
                        h1.dataset.gasObserved = "true";
                        log("已掛載 H1 監聽器");
                    }
                }, 2000);
            }

            // 3. 監聽網址
            if (config.manualOptions.listenUrl) {
                setInterval(() => {
                    if (location.href !== lastUrl) {
                        lastUrl = location.href;
                        log("偵測到換頁");
                        setTimeout(() => syncTitle('Url-Change'), 1000);
                        setTimeout(() => syncTitle('Url-Change'), 3000);
                    }
                }, 1000);
            }
        }
    }

    // --- UI ---
    function injectUI() {
        if (document.getElementById('gas-container')) return;

        let target = null;
        let posClass = '';
        if (config.position === 'top') { target = document.querySelector('ms-toolbar'); posClass = 'pos-top'; }
        else if (config.position === 'left-mid') { target = document.querySelector('ms-navbar div[class*="empty-space"]'); posClass = 'pos-left-mid'; }
        else if (config.position === 'left-bot') { target = document.querySelector('ms-navbar div[class*="bottom-actions"]'); posClass = 'pos-left-bot'; }

        if (!target) return;

        const container = document.createElement('div');
        container.id = 'gas-container';
        container.className = posClass;
        
        const btn = document.createElement('button');
        btn.className = 'gas-btn' + (config.mode === 'auto' ? ' active' : '');
        btn.title = config.mode === 'auto' ? '自動模式' : '手動刷新';
        btn.textContent = config.mode === 'auto' ? 'A' : '⟳';
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            const success = syncTitle('Manual-Click');
            const originalColor = btn.style.color;
            btn.style.color = success ? '#00ff00' : '#ff5555';
            setTimeout(() => { btn.style.color = originalColor; }, 500);
        });

        container.appendChild(btn);
        target.appendChild(container);
    }

    // --- 設定面板 ---
    function createSettingsPanel() {
        if (document.getElementById('gas-overlay')) return;
        const overlay = document.createElement('div'); overlay.id = 'gas-overlay';
        const panel = document.createElement('div'); panel.id = 'gas-panel';
        
        // 構建 HTML (為求簡潔，這裡用字串拼接，但內容是靜態安全的)
        // 注意：這裡只拼接標籤結構，不插入變數，避免 TrustedHTML 問題
        
        const content = document.createElement('div');
        
        // 標題
        const title = document.createElement('h3'); title.className = 'gas-title'; title.textContent = '⚙️ 同步工具設定';
        panel.appendChild(title);

        // 位置
        const rowPos = document.createElement('div'); rowPos.className = 'gas-row';
        rowPos.appendChild(createLabel('按鈕位置'));
        const groupPos = document.createElement('div'); groupPos.className = 'gas-radio-group';
        groupPos.appendChild(createRadio('gas-pos', 'top', '上方', config.position === 'top'));
        groupPos.appendChild(createRadio('gas-pos', 'left-mid', '左中', config.position === 'left-mid'));
        groupPos.appendChild(createRadio('gas-pos', 'left-bot', '左下', config.position === 'left-bot'));
        rowPos.appendChild(groupPos);
        content.appendChild(rowPos);

        // 模式
        const rowMode = document.createElement('div'); rowMode.className = 'gas-row';
        rowMode.appendChild(createLabel('運作模式'));
        const groupMode = document.createElement('div'); groupMode.className = 'gas-radio-group';
        const radioMan = createRadio('gas-mode', 'manual', '智慧手動', config.mode === 'manual');
        const radioAuto = createRadio('gas-mode', 'auto', '自動循環', config.mode === 'auto');
        groupMode.appendChild(radioMan); groupMode.appendChild(radioAuto);
        rowMode.appendChild(groupMode);

        // 子選項區塊
        const subBox = document.createElement('div'); subBox.className = 'gas-sub-box';
        
        // 手動選項
        const subMan = document.createElement('div'); 
        subMan.style.display = config.mode === 'manual' ? 'block' : 'none';
        const chkInput = createCheckbox('監聽標題變化 (打字/切換)', config.manualOptions.listenInput);
        const chkUrl = createCheckbox('監聽換頁切換', config.manualOptions.listenUrl);
        subMan.appendChild(chkInput.wrapper); subMan.appendChild(chkUrl.wrapper);
        
        // 自動選項
        const subAuto = document.createElement('div');
        subAuto.style.display = config.mode === 'auto' ? 'block' : 'none';
        const inpHH = createTimeInput(config.hh); const inpMM = createTimeInput(config.mm); const inpSS = createTimeInput(config.ss);
        subAuto.append('每隔 ', inpHH, ' 時 ', inpMM, ' 分 ', inpSS, ' 秒');

        subBox.appendChild(subMan); subBox.appendChild(subAuto);
        rowMode.appendChild(subBox);
        content.appendChild(rowMode);

        // 事件切換
        radioMan.querySelector('input').addEventListener('change', () => { subMan.style.display = 'block'; subAuto.style.display = 'none'; });
        radioAuto.querySelector('input').addEventListener('change', () => { subMan.style.display = 'none'; subAuto.style.display = 'block'; });

        // 按鈕
        const actions = document.createElement('div'); actions.className = 'gas-actions';
        const btnClose = document.createElement('button'); btnClose.className = 'gas-btn-close'; btnClose.textContent = '關閉';
        btnClose.onclick = () => overlay.remove();
        const btnSave = document.createElement('button'); btnSave.className = 'gas-btn-save'; btnSave.textContent = '儲存設定';
        
        btnSave.onclick = () => {
            try {
                const pos = groupPos.querySelector('input:checked').value;
                const mode = groupMode.querySelector('input:checked').value;
                const h = parseInt(inpHH.value)||0, m = parseInt(inpMM.value)||0, s = parseInt(inpSS.value)||0;
                const totalMs = (h*3600 + m*60 + s)*1000;
                
                if (mode === 'auto' && totalMs < 1000) { alert('間隔太短'); return; }

                config = {
                    position: pos, mode: mode,
                    manualOptions: { listenInput: chkInput.input.checked, listenUrl: chkUrl.input.checked },
                    autoInterval: totalMs, hh: h, mm: m, ss: s
                };
                GM_setValue('gas_config_v6', config);
                startListeners();
                const oldBtn = document.getElementById('gas-container');
                if (oldBtn) oldBtn.remove();
                overlay.remove();
                log("設定已儲存");
            } catch(e) { alert('儲存錯誤'); }
        };

        actions.appendChild(btnClose); actions.appendChild(btnSave);
        panel.appendChild(content); panel.appendChild(actions);
        overlay.appendChild(panel); document.body.appendChild(overlay);
    }

    // Helper functions for DOM creation
    function createLabel(text) { const el = document.createElement('span'); el.className = 'gas-label'; el.textContent = text; return el; }
    function createRadio(name, val, text, checked) {
        const label = document.createElement('label'); label.className = 'gas-radio-item';
        const input = document.createElement('input'); input.type = 'radio'; input.name = name; input.value = val; if(checked) input.checked = true;
        label.appendChild(input); label.appendChild(document.createTextNode(text));
        return label;
    }
    function createCheckbox(text, checked) {
        const wrapper = document.createElement('label'); wrapper.className = 'gas-checkbox-item';
        const input = document.createElement('input'); input.type = 'checkbox'; if(checked) input.checked = true;
        wrapper.appendChild(input); wrapper.appendChild(document.createTextNode(text));
        return { wrapper, input };
    }
    function createTimeInput(val) { const input = document.createElement('input'); input.type = 'number'; input.className = 'gas-time-input'; input.value = val; return input; }

    // --- 啟動 ---
    GM_registerMenuCommand("⚙️ 設定面板", createSettingsPanel);
    startListeners();
    setInterval(injectUI, 2000);
})();