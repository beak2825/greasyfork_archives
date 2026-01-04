// ==UserScript==
// @name         SillyTavern Mobile Suite (Smart Selector + Gemini Manager)
// @namespace    http://tampermonkey.net/
// @version      26.1
// @description  Tích hợp: Chọn Char/Scene (Get Raw Markdown) & Quản lý Key Gemini.
// @author       You
// @match        http://127.0.0.1:8000/*
// @match        https://aistudio.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.cohere.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Smart%20Selector%20%2B%20Gemini%20Manager%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Smart%20Selector%20%2B%20Gemini%20Manager%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- KIỂM TRA MÔI TRƯỜNG ---
    const isST = location.href.includes('127.0.0.1:8000');
    const isGoogle = location.href.includes('aistudio.google.com');

    // =================================================================================
    // PHẦN 1: GEMINI KEY SNIFFER (CHỈ CHẠY TRÊN GOOGLE AI STUDIO)
    // =================================================================================
    if (isGoogle) {
        console.log('💎 [Gemini Suite] Sniffer Active...');
        const DB_KEYS = 'tm_st_keys_v18';
        let capturedRaw = new Set();
        let syncTimeout = null;

        GM_addStyle(`
            .tm-toast {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                background: #2ecc71; color: white; padding: 12px 25px;
                border-radius: 50px; font-family: sans-serif; font-weight: bold;
                z-index: 9999999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                opacity: 0; transition: all 0.5s; pointer-events: none;
            }
            .tm-toast.show { opacity: 1; bottom: 50px; }
        `);

        function showGoogleToast(msg) {
            let t = document.querySelector('.tm-toast') || document.createElement('div');
            t.className = 'tm-toast';
            document.body.appendChild(t);
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', () => {
                const txt = this.responseText;
                if (txt && txt.includes('AIza')) {
                    const matches = txt.match(/AIza[0-9A-Za-z-_]{35}/g);
                    if (matches) {
                        matches.forEach(k => capturedRaw.add(k));
                        clearTimeout(syncTimeout);
                        syncTimeout = setTimeout(smartSync, 2000);
                    }
                }
            });
            originalOpen.apply(this, arguments);
        };

        function smartSync() {
            const currentStoredKeys = GM_getValue(DB_KEYS, []);
            const rawKeys = Array.from(capturedRaw);
            let newKeysAdded = 0;
            const tempMapping = [];
            const mappedSuffixes = new Set();

            document.querySelectorAll('tr, div[role="row"]').forEach(row => {
                const text = row.innerText;
                const sMatch = text.match(/\.\.\.([0-9A-Za-z-_]{4})/);
                if (sMatch) {
                    const suffix = sMatch[1];
                    const fullKey = rawKeys.find(k => k.endsWith(suffix));
                    if (fullKey) {
                        const name = text.split('\n')[0].trim();
                        tempMapping.push({ key: fullKey, name: name, suffix: suffix });
                        mappedSuffixes.add(suffix);
                    }
                }
            });

            rawKeys.forEach(k => {
                const suffix = k.slice(-4);
                if (!mappedSuffixes.has(suffix)) {
                    tempMapping.push({ key: k, name: 'System/Hidden', suffix: suffix });
                }
            });

            const updatedKeys = [...currentStoredKeys];
            tempMapping.forEach(newItem => {
                const exists = updatedKeys.some(oldItem => oldItem.key === newItem.key);
                if (!exists) {
                    updatedKeys.push(newItem);
                    newKeysAdded++;
                }
            });

            if (newKeysAdded > 0) {
                GM_setValue(DB_KEYS, updatedKeys);
                showGoogleToast(`✅ Đã thêm ${newKeysAdded} Key mới (Tổng: ${updatedKeys.length})`);
            }
        }
        return;
    }

    // =================================================================================
    // PHẦN 2: SILLY TAVERN INTEGRATION (CHẠY TRÊN ST)
    // =================================================================================
    if (isST) {
        // --- CẤU HÌNH & CONFIG ---
        const DEFAULT_COHERE_KEY = "G8bhf4y7cgSeOExs0MTwfLAXm4MRn1kR1C9J7VeH";
        const DEFAULT_COHERE_MODEL = "command-a-03-2025";

        // --- HÀM GỌI API COHERE THÔNG MINH ---
        function callCohereExtraction(text) {
            return new Promise((resolve, reject) => {
                const apiKey = GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY);
                const model = GM_getValue("st_cohere_model", DEFAULT_COHERE_MODEL);

                const prompt = `You are a smart analyzer for RPG character cards. Your task is to extract a Name or a Title from the text provided.

RULES:
1. **Multiple Characters**: If the text describes multiple distinct characters (e.g., "Name: Alex... ___ Name: Lina..."), extract all names and join them with " - ".
   - Example Output: Alex - Lina
2. **Single Character**: If it describes one character, return just the name.
   - Example Output: Seraphina
3. **Scenario/World**: If the text describes a setting, event, or world WITHOUT a main character sheet (e.g., "Zombie apocalypse in 2024...", "A magical academy setting..."), create a short, descriptive title (Max 5 words).
   - Example Output: Zombie Pandemic 2024
   - Example Output: Magic Academy World

OUTPUT FORMAT:
- Return ONLY the final string.
- Do NOT use quotes.
- Do NOT write "Title:" or "Name:".

TEXT TO ANALYZE:
${text.substring(0, 4000)}`;

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.cohere.com/v2/chat",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "Client-Name": "ST_Userscript_Smart"
                    },
                    data: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.2,
                        max_tokens: 50
                    }),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const json = JSON.parse(response.responseText);
                                const extractedName = json.message?.content?.[0]?.text?.trim();
                                resolve(extractedName || "Unknown");
                            } catch (e) {
                                reject("Lỗi Parse JSON Cohere");
                            }
                        } else {
                            reject(`Lỗi HTTP ${response.status}: ${response.responseText}`);
                        }
                    },
                    onerror: function(err) {
                        reject("Lỗi kết nối Cohere");
                    }
                });
            });
        }

        // --- HÀM FETCH LIST MODEL COHERE ---
        function fetchCohereModels() {
            return new Promise((resolve, reject) => {
                const apiKey = GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.cohere.com/v1/models",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const data = JSON.parse(res.responseText);
                                const sorted = data.models.sort((a, b) => {
                                    const aCmd = a.name.includes('command');
                                    const bCmd = b.name.includes('command');
                                    if (aCmd && !bCmd) return -1;
                                    if (!aCmd && bCmd) return 1;
                                    return a.name.localeCompare(b.name);
                                });
                                resolve(sorted);
                            } catch (e) { reject("Lỗi parse list models"); }
                        } else {
                            reject(`Lỗi lấy models: ${res.status}`);
                        }
                    },
                    onerror: (err) => reject("Lỗi mạng khi lấy models")
                });
            });
        }

        // --- UI CHỌN MODEL ---
        function showModelSelector(models) {
            const old = document.getElementById('st-model-modal');
            if (old) old.remove();

            const currentModel = GM_getValue("st_cohere_model", DEFAULT_COHERE_MODEL);

            GM_addStyle(`
                #st-model-modal {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.8); z-index: 999999;
                    display: flex; justify-content: center; align-items: center;
                    backdrop-filter: blur(2px);
                }
                .st-modal-box {
                    background: #1e1e1e; border: 1px solid #444;
                    display: flex; flex-direction: column;
                    border-radius: 12px; overflow: hidden;
                    box-shadow: 0 10px 40px #000;
                    width: 400px; max-height: 80vh;
                }
                @media screen and (max-width: 768px) {
                    .st-modal-box { width: 90%; max-height: 50vh; margin: auto; }
                }
                .st-modal-header {
                    padding: 15px; border-bottom: 1px solid #333; font-weight: bold;
                    color: #fff; background: #252525;
                    display: flex; justify-content: space-between; align-items: center;
                    flex-shrink: 0;
                }
                .st-modal-list {
                    overflow-y: auto; flex-grow: 1;
                }
                .st-model-item {
                    padding: 14px 15px; border-bottom: 1px solid #2a2a2a;
                    color: #ccc; cursor: pointer; font-family: sans-serif;
                    font-size: 13px; display: flex; justify-content: space-between; align-items: center;
                }
                .st-model-item:active { background: #333; }
                .st-model-item.active {
                    color: #fff; font-weight: bold; background: #2e7d32;
                    border-bottom-color: #1b5e20;
                }
                .st-tag {
                    font-size: 9px; background: #444; color: #bbb;
                    padding: 2px 6px; border-radius: 4px; margin-left: 8px;
                }
                .st-model-item.active .st-tag { background: #1b5e20; color: #fff; }
                .st-modal-close {
                    cursor: pointer; color: #ff5252; font-size: 18px; padding: 0 5px;
                }
            `);

            const modal = document.createElement('div');
            modal.id = 'st-model-modal';
            modal.onclick = (e) => { if(e.target === modal) modal.remove(); };

            let listHtml = '';
            models.forEach(m => {
                const isActive = m.name === currentModel ? 'active' : '';
                const tag = m.name.includes('command') ? '<span class="st-tag">CHAT</span>' : '';
                listHtml += `<div class="st-model-item ${isActive}" data-name="${m.name}">
                    <span>${m.name}</span>${tag}
                </div>`;
            });

            modal.innerHTML = `
                <div class="st-modal-box">
                    <div class="st-modal-header">
                        <span>Chọn Cohere Model</span>
                        <div class="st-modal-close">✕</div>
                    </div>
                    <div class="st-modal-list">${listHtml}</div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.st-modal-close').onclick = () => modal.remove();
            modal.querySelectorAll('.st-model-item').forEach(item => {
                item.onclick = () => {
                    const name = item.getAttribute('data-name');
                    GM_setValue("st_cohere_model", name);
                    showSelectorToast(`✅ Đã lưu: ${name}`, 'success');
                    modal.remove();
                };
            });
        }

        // --- HÀM MENU CHUNG ---
        let registeredMenuIds = [];

        function rebuildMasterMenu() {
            for (const id of registeredMenuIds) {
                GM_unregisterMenuCommand(id);
            }
            registeredMenuIds = [];

            const currentMode = GM_getValue("st_mobile_mode", 'auto');
            const modeLabel = currentMode === 'auto'
                ? "🔄 [Selector] Chế độ: AUTO (AI)"
                : "🔄 [Selector] Chế độ: THỦ CÔNG";

            registeredMenuIds.push(GM_registerMenuCommand(modeLabel, () => {
                const newMode = currentMode === 'auto' ? 'manual' : 'auto';
                GM_setValue("st_mobile_mode", newMode);
                showSelectorToast(`Đã chuyển: ${newMode.toUpperCase()}`, 'info');
                rebuildMasterMenu();
            }));

            registeredMenuIds.push(GM_registerMenuCommand("✏️ [Selector] Nhập tên (Manual)", () => {
                const oldName = GM_getValue("st_mobile_manual_name", '');
                const newName = prompt("Nhập tên nhân vật:", oldName);
                if (newName !== null) {
                    GM_setValue("st_mobile_manual_name", newName.trim());
                    showSelectorToast("Đã lưu tên: " + newName, 'success');
                }
            }));

            registeredMenuIds.push(GM_registerMenuCommand("🔑 [Cohere] Thay đổi API Key", () => {
                const curKey = GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY);
                const newKey = prompt("Nhập Cohere API Key mới:", curKey);
                if (newKey !== null) {
                    GM_setValue("st_cohere_key", newKey.trim());
                    showSelectorToast("✅ Đã lưu Key Cohere!", 'success');
                }
            }));

            registeredMenuIds.push(GM_registerMenuCommand("⚙️ [Cohere] Chọn Model từ List", () => {
                showSelectorToast("⏳ Đang tải danh sách models...", 'process');
                fetchCohereModels()
                    .then(models => showModelSelector(models))
                    .catch(err => showSelectorToast("❌ " + err, 'error'));
            }));

            registeredMenuIds.push(GM_registerMenuCommand("___________________", () => {}));

            registeredMenuIds.push(GM_registerMenuCommand("🔑 [Gemini] Quản Lý Key", () => {
                toggleGeminiManager();
            }));
        }

        // =============================================================================
        // LOGIC A: MOBILE SELECTOR (Refactored Cache Logic)
        // =============================================================================
        const KEY_MODE = "st_mobile_mode";
        const KEY_MANUAL_NAME = "st_mobile_manual_name";
        const KEY_CACHE_NAME = "st_mobile_cache_name";

        const selState = {
            char: { content: null, domElement: null },
            scene: { content: null, domElement: null },
            isRunning: false
        };

        function showSelectorToast(msg, type = 'info') {
            let toast = document.getElementById('st-mobile-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'st-mobile-toast';
                document.body.appendChild(toast);
            }
            let bg = '#333';
            if (type === 'success') bg = '#2e7d32';
            if (type === 'error') bg = '#c62828';
            if (type === 'warn') bg = '#ef6c00';
            if (type === 'process') bg = '#1565c0';
            if (type === 'analyzing') bg = '#8e44ad';

            toast.textContent = msg;
            toast.style.backgroundColor = bg;
            toast.className = 'show';
            if (toast.timeout) clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => { toast.className = ''; }, 3000);
        }

        // --- CSS SỬ DỤNG BIẾN & STYLE MỚI CHO RE-ANALYZE ---
        GM_addStyle(`
            :root {
                --st-btn-display: none;
            }
            #st-mobile-toast {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px);
                padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold;
                font-family: sans-serif; font-size: 14px; z-index: 99999;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.3s ease;
                max-width: 90%; text-align: center; pointer-events: none;
            }
            #st-mobile-toast.show { transform: translateX(-50%) translateY(0); }

            .st-btn-group {
                display: var(--st-btn-display) !important;
                gap: 4px; margin-left: 8px; vertical-align: middle;
                background: rgba(0,0,0,0.2); padding: 2px; border-radius: 6px;
            }

            .st-btn {
                border: 1px solid #444; background: #202124; color: #ccc;
                cursor: pointer; font-size: 12px; font-weight: bold; border-radius: 4px;
                padding: 4px 10px; min-width: 40px; touch-action: manipulation;
            }
            .st-btn:active { transform: translateY(1px); }

            .st-btn.active-char { background-color: #2e7d32 !important; color: #fff !important; border-color: #4caf50 !important; }
            .st-btn.analyzing { background-color: #9b59b6 !important; color: #fff !important; border-color: #8e44ad !important; cursor: wait; animation: pulse 1.5s infinite; }
            .st-btn.active-scene { background-color: #ef6c00 !important; color: #fff !important; border-color: #ff9800 !important; }
            .st-btn.import-btn { background-color: #37474f; color: #fff; border-color: #546e7a; }
            .st-disabled { opacity: 0.5; pointer-events: none; }

            /* Nút Re-analyze riêng */
            .st-btn.re-btn {
                background-color: #34495e; color: #ecf0f1; border-color: #5d6d7e;
                padding: 4px 8px; font-size: 13px;
            }

            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
        `);

        // --- HÀM GIÁM SÁT & CẬP NHẬT BIẾN (OPTIMIZED) ---
        function startDynamicVisibilityLoop() {
            let lastDisplayValue = 'none';
            setInterval(() => {
                const nameH2 = document.querySelector('h2.interactable');
                let currentName = '';
                if (nameH2) {
                    currentName = nameH2.innerText.trim().toLowerCase();
                } else {
                    const navName = document.querySelector('#right-nav-panel .ch_name');
                    if (navName) currentName = navName.innerText.trim().toLowerCase();
                }

                const isCreator = currentName === 'char creator';
                const newDisplayValue = isCreator ? 'inline-flex' : 'none';

                if (newDisplayValue !== lastDisplayValue) {
                    document.documentElement.style.setProperty('--st-btn-display', newDisplayValue);
                    lastDisplayValue = newDisplayValue;
                }
            }, 500);
        }

        // Selector Helpers
        function getTargetName() {
            const mode = GM_getValue(KEY_MODE, 'auto');
            if (mode === 'manual') {
                const name = GM_getValue(KEY_MANUAL_NAME, '').trim();
                if (!name) return { name: null, error: "Chưa nhập tên thủ công!" };
                return { name: name, source: 'manual' };
            }
            const cached = GM_getValue(KEY_CACHE_NAME, null);
            if (cached) return { name: cached, source: 'cache' };

            return { name: null, error: "Chưa chọn Char hoặc AI chưa tìm thấy tên." };
        }

        // --- HELPERS TRÍCH XUẤT RAW TEXT (SCENE) ---
        async function getRawContentFromMessage(mesDiv) {
            // 1. Kiểm tra xem có đang Edit sẵn không (đã có textarea chưa)
            const existingArea = mesDiv.querySelector('textarea.edit_textarea');
            if (existingArea) return existingArea.value;

            // 2. Tìm nút Edit
            const editBtn = mesDiv.querySelector('.mes_edit'); // title="Edit"
            if (!editBtn) {
                // Nếu không có nút edit (mes hệ thống?), lấy innerText đỡ
                return mesDiv.querySelector('.mes_text')?.innerText || "";
            }

            // 3. Click Edit
            editBtn.click();

            // 4. Chờ textarea xuất hiện
            const area = await new Promise(resolve => {
                let i = 0;
                const int = setInterval(() => {
                    const el = mesDiv.querySelector('textarea.edit_textarea'); // hoặc #curEditTextarea
                    if (el) {
                        clearInterval(int);
                        resolve(el);
                    }
                    if (++i > 25) { // Chờ tối đa 2.5s
                        clearInterval(int);
                        resolve(null);
                    }
                }, 100);
            });

            if (!area) return ""; // Timeout hoặc lỗi

            const val = area.value;

            // 5. Đóng Edit lại cho sạch (Tìm nút Cancel/X)
            const btnContainer = mesDiv.querySelector('.mes_edit_buttons');
            if (btnContainer) {
                // Ưu tiên tìm nút có icon X hoặc title Cancel/Close
                let cancelBtn = Array.from(btnContainer.querySelectorAll('.mes_button')).find(b => {
                    const h = b.innerHTML + (b.title || "");
                    return h.includes('fa-times') || h.includes('fa-xmark') || h.toLowerCase().includes('cancel') || h.toLowerCase().includes('close');
                });
                // Nếu không tìm thấy, thường nút X nằm cuối cùng
                if (!cancelBtn && btnContainer.children.length > 0) {
                    cancelBtn = btnContainer.children[btnContainer.children.length - 1];
                }

                if (cancelBtn) cancelBtn.click();
            }

            return val;
        }

        // --- HÀM CHẠY KHI BẤM NÚT RE-ANALYZE ---
        async function forceAnalyzeName(btnRe, content) {
            if (selState.isRunning) return;
            const originalText = btnRe.textContent;
            btnRe.textContent = "⏳";
            btnRe.classList.add('analyzing');
            showSelectorToast("🧠 Đang phân tích lại tên...", "analyzing");

            try {
                const name = await callCohereExtraction(content);
                if (name && name !== "Unknown") {
                    GM_setValue(KEY_CACHE_NAME, name); // Ghi đè Cache
                    showSelectorToast(`✅ Đã cập nhật tên: ${name}`, 'success');
                } else {
                    showSelectorToast("⚠️ AI không tìm thấy tên!", 'warn');
                }
            } catch (e) {
                console.error(e);
                showSelectorToast("❌ Lỗi API Cohere!", 'error');
            } finally {
                btnRe.textContent = originalText;
                btnRe.classList.remove('analyzing');
            }
        }

        // --- HÀM CHỌN CHAR (Logic mới) ---
        async function handleSelection(type, btn, content) {
            if (selState.isRunning) return;

            // Bỏ chọn
            if (selState[type].domElement === btn) {
                btn.classList.remove(type === 'char' ? 'active-char' : 'active-scene');
                btn.classList.remove('analyzing');
                selState[type].content = null;
                selState[type].domElement = null;
                showSelectorToast(`Đã bỏ chọn ${type === 'char' ? 'Character' : 'Scene'}`, 'info');
                return;
            }

            // Xóa active cũ
            if (selState[type].domElement) {
                selState[type].domElement.classList.remove(type === 'char' ? 'active-char' : 'active-scene');
                selState[type].domElement.classList.remove('analyzing');
            }

            selState[type].content = content;
            selState[type].domElement = btn;

            if (type === 'char') {
                const mode = GM_getValue(KEY_MODE, 'auto');

                // 1. Manual Mode
                if (mode === 'manual') {
                    btn.classList.add('active-char');
                    btn.textContent = "Char (M)";
                    const curName = GM_getValue(KEY_MANUAL_NAME, '');
                    showSelectorToast(curName ? `✅ Đã chọn (Tên Manual: ${curName})` : `⚠️ Chưa đặt tên Manual!`, curName ? 'success' : 'warn');
                    return;
                }

                // 2. Auto Mode: ƯU TIÊN CACHE TUYỆT ĐỐI
                const cachedName = GM_getValue(KEY_CACHE_NAME, null);
                if (cachedName) {
                    btn.classList.add('active-char');
                    btn.innerHTML = `Char <small>(${cachedName.substring(0,6)}..)</small>`;
                    showSelectorToast(`✅ Đã chọn (Cache): ${cachedName}`, 'success');
                    return;
                }

                // 3. Nếu Cache Rỗng (Lần đầu tiên): Mới gọi API
                btn.classList.add('analyzing');
                btn.innerHTML = "⏳ AI...";
                showSelectorToast("🧠 Chưa có Cache. Đang phân tích...", "analyzing");

                try {
                    const name = await callCohereExtraction(content);
                    if (name && name !== "Unknown") {
                        GM_setValue(KEY_CACHE_NAME, name);
                        showSelectorToast(`✅ Đã định danh: ${name}`, 'success');
                        btn.classList.remove('analyzing');
                        btn.classList.add('active-char');
                        btn.innerHTML = `Char <small>(${name.substring(0,6)}..)</small>`;
                    } else {
                        showSelectorToast("⚠️ AI không thể đặt tên!", 'warn');
                        btn.classList.remove('analyzing');
                        btn.classList.add('active-char');
                        btn.textContent = "Char (?)";
                    }
                } catch (e) {
                    console.error(e);
                    showSelectorToast("❌ Lỗi API Cohere!", 'error');
                    btn.classList.remove('analyzing');
                    btn.classList.add('active-char');
                    btn.textContent = "Char (Err)";
                }

            } else {
                // Với Scene, ta chỉ đổi màu, nội dung đã được xử lý trước khi gọi hàm này
                btn.classList.add('active-scene');
                showSelectorToast("✅ Đã lấy nội dung Scene (Raw Markdown)", 'success');
            }
        }

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        async function runAutomation() {
            if (selState.isRunning) return;
            const target = getTargetName();
            if (!target.name) { showSelectorToast("❌ " + target.error, 'error'); return; }
            if (!selState.char.content && !selState.scene.content) { showSelectorToast("⚠️ Chưa chọn nội dung!", 'warn'); return; }

            selState.isRunning = true;
            showSelectorToast(`⏳ Import vào: "${target.name}"...`, 'process');
            document.querySelectorAll('.st-btn').forEach(b => b.classList.add('st-disabled'));

            try {
                const drawer = document.getElementById('rightNavDrawerIcon');
                if (drawer) drawer.click();
                await sleep(300);

                const charListBtn = document.getElementById('rm_button_characters');
                if (charListBtn) charListBtn.click();
                await sleep(400);

                let found = false;
                const listBlock = document.getElementById('rm_print_characters_block');
                if (listBlock) {
                    const items = listBlock.querySelectorAll('.character_select');
                    for (const item of items) {
                        const n = item.querySelector('.character_name_block .ch_name');
                        if (n && n.innerText.trim().toLowerCase() === target.name.toLowerCase()) {
                            item.click(); found = true; break;
                        }
                    }
                }

                if (!found) {
                    showSelectorToast(`➕ Tạo thẻ mới: ${target.name}`, 'process');
                    const createBtn = document.getElementById('rm_button_create');
                    if (createBtn) createBtn.click();
                    await sleep(500);
                    const nameInput = document.getElementById('character_name_pole');
                    if (nameInput) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(nameInput, target.name);
                        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                await sleep(600);

                if (selState.char.content) {
                    const descArea = document.getElementById('description_textarea');
                    if (descArea) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        setter.call(descArea, selState.char.content);
                        descArea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                if (selState.scene.content) {
                    const firstMesArea = document.getElementById('firstmessage_textarea');
                    if (firstMesArea) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        setter.call(firstMesArea, selState.scene.content);
                        firstMesArea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                if (!found) {
                    await sleep(500);
                    const confirmBtn = document.getElementById('create_button_label');
                    if (confirmBtn) confirmBtn.click();
                }

                showSelectorToast(`✅ Xong!`, 'success');

                if (selState.char.domElement) {
                    selState.char.domElement.classList.remove('active-char');
                    selState.char.domElement.textContent = "Char";
                }
                if (selState.scene.domElement) selState.scene.domElement.classList.remove('active-scene');
                selState.char.content = null; selState.char.domElement = null;
                selState.scene.content = null; selState.scene.domElement = null;

            } catch (e) {
                console.error(e);
                showSelectorToast("❌ Lỗi: " + e.message, 'error');
            } finally {
                selState.isRunning = false;
                document.querySelectorAll('.st-btn').forEach(b => b.classList.remove('st-disabled'));
            }
        }

        function addButtons(mesDiv) {
            if (mesDiv.querySelector('.st-btn-group')) return;
            const header = mesDiv.querySelector('.ch_name');
            if (!header) return;
            const group = document.createElement('div');
            group.className = 'st-btn-group';
            const mkBtn = (label, cls, cb) => {
                const btn = document.createElement('button');
                btn.className = `st-btn ${cls}`;
                btn.innerHTML = label;
                btn.onclick = (e) => { e.stopPropagation(); cb(); };
                return btn;
            };

            // NÚT RE-ANALYZE (Mới)
            const btnRe = mkBtn('↻', 're-btn', () => {
                const text = mesDiv.querySelector('.mes_text').innerText.trim();
                forceAnalyzeName(btnRe, text);
            });

            const btnChar = mkBtn('Char', '', () => {
                const text = mesDiv.querySelector('.mes_text').innerText.trim();
                handleSelection('char', btnChar, text);
            });

            // NÚT SCENE (Đã cập nhật logic lấy Raw Text)
            const btnScene = mkBtn('Scene', '', async () => {
                // Nếu đang chọn chính nó thì bỏ chọn (không cần fetch lại)
                if (selState.scene.domElement === btnScene) {
                    handleSelection('scene', btnScene, null);
                    return;
                }

                const oldText = btnScene.textContent;
                btnScene.textContent = "⏳"; // Báo hiệu đang xử lý

                const rawText = await getRawContentFromMessage(mesDiv);

                btnScene.textContent = oldText; // Trả lại tên cũ

                if (rawText) {
                     handleSelection('scene', btnScene, rawText);
                } else {
                     showSelectorToast("⚠️ Không lấy được nội dung gốc!", 'warn');
                }
            });

            const btnImport = mkBtn('⚡', 'import-btn', () => runAutomation());

            group.append(btnRe, btnChar, btnScene, btnImport);
            header.appendChild(group);
        }

        // =============================================================================
        // PHẦN 3: GEMINI MANAGER (GIỮ NGUYÊN)
        // =============================================================================
        const DB = { KEYS: 'tm_st_keys_v18', IDX: 'tm_st_idx_v18', LIMITS: 'tm_st_limits_v18' };
        let gemKeys = [], gemIdx = 0, gemLimits = {}, gemIsLocked = false, gemIsGenerating = false;
        const TARGET_SOURCE = 'makersuite';

        const loadGeminiData = () => {
            gemKeys = GM_getValue(DB.KEYS, []);
            gemIdx = GM_getValue(DB.IDX, 0);
            gemLimits = GM_getValue(DB.LIMITS, {});
        };
        const saveGeminiData = () => {
            GM_setValue(DB.KEYS, gemKeys);
            GM_setValue(DB.IDX, gemIdx);
            GM_setValue(DB.LIMITS, gemLimits);
        };

        const GemCore = {
            findBtn(txt) {
                return Array.from(document.querySelectorAll('button, .popup-button-ok, .menu_button'))
                    .find(el => el.textContent.trim().toLowerCase() === txt.toLowerCase());
            },
            async connect(apiKey) {
                const elSource = document.getElementById('chat_completion_source');
                if (!elSource || elSource.value !== TARGET_SOURCE) return;
                GemUI.status("🎬 Đang nạp key...", "yellow");
                try {
                    const setBtn = document.querySelector('div[data-key="api_key_makersuite"]');
                    if (setBtn) setBtn.click();
                    await sleep(500);
                    const del = document.querySelector('button[data-action="delete-secret"]');
                    if (del) {
                        del.click(); await sleep(400);
                        const y = this.findBtn("Yes"); if (y) y.click(); await sleep(400);
                        const o = this.findBtn("OK"); if (o) o.click(); await sleep(400);
                    }
                    const input = document.querySelector('#api_key_makersuite');
                    if (input) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(input, apiKey);
                        input.value = apiKey;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        await sleep(100);
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        throw new Error("Input #api_key_makersuite not found");
                    }
                    await sleep(500);
                    document.getElementById('api_button_openai')?.click();
                    GemUI.status("✅ Key Ready!", "#2ecc71");
                    GemUI.render();
                } catch (e) {
                    console.error(e);
                    GemUI.status("❌ Lỗi nạp key", "red");
                }
            }
        };

        const GemUI = {
            init() {
                GM_addStyle(`
                    #tm-manager {
                        position: fixed; top: 15vh; left: 50%; transform: translateX(-50%);
                        width: 85%; max-width: 380px; max-height: 60vh;
                        background: #111; color: #eee; border: 1px solid #444;
                        border-radius: 12px; z-index: 20001; padding: 0;
                        font-family: sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.9);
                        display: none; flex-direction: column;
                    }
                    .tm-header-row {
                        flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;
                        padding: 8px 15px; border-bottom: 1px solid #333; background: #1a1a1a;
                        border-top-left-radius: 12px; border-top-right-radius: 12px;
                    }
                    .tm-title { font-weight: bold; color: #3498db; font-size: 14px; }
                    .tm-close-btn { font-size: 20px; color: #e74c3c; cursor: pointer; line-height: 1; padding: 0 5px; font-weight: bold; }
                    .tm-body { padding: 8px; display: flex; flex-direction: column; overflow: hidden; height: 100%; }
                    .tm-list { flex-grow: 1; overflow-y: auto; background: #000; border: 1px solid #333; margin-bottom: 8px; border-radius: 5px; }
                    .tm-item { padding: 8px 10px; border-bottom: 1px solid #222; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
                    .tm-item.active { background: #1a5276; border-left: 3px solid #3498db; }
                    .tm-tag { background: #922b21; color: white; font-size: 9px; padding: 1px 4px; border-radius: 3px; margin-left: 3px; }
                    .tm-controls { flex-shrink: 0; }
                    .tm-btn { width: 100%; padding: 8px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; margin-top: 5px; font-size: 13px;}
                    #tm-status-text { text-align: center; font-size: 11px; margin-top: 5px; color: #888; font-style: italic; }
                `);

                const p = document.createElement('div'); p.id = 'tm-manager';
                p.innerHTML = `
                    <div class="tm-header-row">
                        <div class="tm-title">Gemini Manager <span id="tm-count-badge" style="background:#444; color:#fff; padding:1px 6px; border-radius:10px; font-size:11px; margin-left:5px">0</span></div>
                        <div class="tm-close-btn" id="tm-btn-close">×</div>
                    </div>
                    <div class="tm-body">
                        <div class="tm-list" id="tm-list-box"></div>
                        <div class="tm-controls">
                            <button class="tm-btn" style="background:#d35400" id="tm-btn-run">⚡ KẾT NỐI</button>
                            <div style="display:flex; gap:5px;">
                                <button class="tm-btn" style="background:#7d3c98" id="tm-btn-refresh">🔄 Refresh</button>
                                <button class="tm-btn" style="background:#922b21" id="tm-btn-clear">🗑️ Clear</button>
                            </div>
                            <div id="tm-status-text">Ready</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(p);

                document.getElementById('tm-btn-close').onclick = () => { document.getElementById('tm-manager').style.display = 'none'; };
                document.getElementById('tm-btn-refresh').onclick = () => { loadGeminiData(); GemUI.render(); GemUI.status("Đã cập nhật!"); };
                document.getElementById('tm-btn-clear').onclick = () => { if(confirm("Xóa toàn bộ danh sách key?")) { GM_setValue(DB.KEYS, []); loadGeminiData(); GemUI.render(); } };
                document.getElementById('tm-btn-run').onclick = () => { if(gemKeys[gemIdx]) { gemIsLocked = false; GemCore.connect(gemKeys[gemIdx].key); } };
            },
            render() {
                const box = document.getElementById('tm-list-box');
                const badge = document.getElementById('tm-count-badge');
                box.innerHTML = '';
                if (badge) badge.textContent = gemKeys.length;
                if (gemKeys.length === 0) {
                    box.innerHTML = '<div style="padding:15px; text-align:center; color:#666; font-size:12px;">Chưa có key.<br>Hãy sang AI Studio để đồng bộ.</div>';
                    return;
                }
                gemKeys.forEach((k, i) => {
                    const item = document.createElement('div');
                    item.className = `tm-item ${i === gemIdx ? 'active' : ''}`;
                    const tags = (gemLimits[k.key] || []).map(t => `<span class="tm-tag">${t}</span>`).join('');
                    item.innerHTML = `<div><b>${k.name}</b><br><small style="opacity:0.5">...${k.suffix}</small></div><div>${tags}</div>`;
                    item.onclick = () => { gemIdx = i; saveGeminiData(); GemUI.render(); gemIsGenerating = false; };
                    box.appendChild(item);
                });
            },
            status(msg, color="#888") {
                const s = document.getElementById('tm-status-text');
                if (s) { s.textContent = msg; s.style.color = color; }
            }
        };

        const GemAuto = {
            init() {
                document.addEventListener('click', (e) => {
                    const elSource = document.getElementById('chat_completion_source');
                    if (!elSource || elSource.value !== TARGET_SOURCE) return;
                    const t = e.target.closest('#send_but, #regenerate_but, .fa-paper-plane');
                    if (t) { gemIsGenerating = true; GemUI.status("🚀 Đang gửi...", "yellow"); }
                }, true);

                const obs = new MutationObserver((mutations) => {
                    const elSource = document.getElementById('chat_completion_source');
                    if (!elSource || elSource.value !== TARGET_SOURCE) return;

                    if (gemIsGenerating && !gemIsLocked) {
                        for (const m of mutations) {
                            for (const n of m.addedNodes) {
                                if (n.nodeType === 1 && n.classList.contains('mes') && !n.classList.contains('last_mes_user')) {
                                    this.onSuccess(); return;
                                }
                            }
                        }
                    }
                    if (!gemIsLocked) {
                        const toast = document.querySelector('.toast-body, .toast-message');
                        if (toast && toast.innerText && this.isErrorText(toast.innerText)) {
                            if (!toast.dataset.processed) {
                                toast.dataset.processed = "true";
                                this.rotate(toast);
                                return;
                            }
                        }
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true });
            },
            isErrorText(txt) {
                txt = txt.toLowerCase();
                return txt.includes("429") || txt.includes("quota") || txt.includes("exhausted") || txt.includes("limit reached");
            },
            onSuccess() {
                gemIsGenerating = false;
                GemUI.status("✨ OK.", "#2ecc71");
                const curKey = gemKeys[gemIdx].key;
                const curModel = document.getElementById('model_google_select')?.value || 'unknown';
                if (gemLimits[curKey] && gemLimits[curKey].includes(curModel)) {
                    gemLimits[curKey] = gemLimits[curKey].filter(m => m !== curModel);
                    if (gemLimits[curKey].length === 0) delete gemLimits[curKey];
                    saveGeminiData();
                    GemUI.render();
                }
            },
            async rotate(errorElement) {
                if (gemIsLocked) return;
                gemIsLocked = true; gemIsGenerating = false;
                const model = document.getElementById('model_google_select')?.value || 'unknown';
                const cur = gemKeys[gemIdx].key;
                if (!gemLimits[cur]) gemLimits[cur] = [];
                if (!gemLimits[cur].includes(model)) { gemLimits[cur].push(model); saveGeminiData(); }

                gemIdx = (gemIdx + 1) % gemKeys.length;
                saveGeminiData();
                GemUI.render();

                GemUI.status(`🛑 Lỗi ${model}. Đổi Key ${gemIdx+1}...`, "orange");
                await GemCore.connect(gemKeys[gemIdx].key);

                if (errorElement) {
                    GemUI.status("⏳ Chờ bảng lỗi tắt...", "gray");
                    let c = 0;
                    while (document.body.contains(errorElement) && errorElement.offsetParent !== null && c < 30) {
                        await sleep(500); c++;
                    }
                }
                GemUI.status("✅ Ready.", "#2ecc71");
                gemIsLocked = false;
            }
        };

        function toggleGeminiManager() {
            const p = document.getElementById('tm-manager');
            if (p) {
                p.style.display = p.style.display === 'none' ? 'flex' : 'none';
                if (p.style.display === 'flex') {
                    loadGeminiData();
                    GemUI.render();
                }
            }
        }

        // =============================================================================
        // KHỞI CHẠY (INITIALIZATION)
        // =============================================================================
        rebuildMasterMenu();
        GemUI.init();
        GemAuto.init();
        loadGeminiData();
        startDynamicVisibilityLoop();

        const observer = new MutationObserver(() => {
            const chat = document.getElementById('chat');
            if (chat) chat.querySelectorAll('.mes').forEach(addButtons);
        });
        const bodyObserver = new MutationObserver(() => {
            const chat = document.getElementById('chat');
            if (chat) {
                chat.querySelectorAll('.mes').forEach(addButtons);
                observer.observe(chat, { childList: true, subtree: true });
                bodyObserver.disconnect();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            const el = document.getElementById('chat_completion_source');
            const managerPanel = document.getElementById('tm-manager');
            if (el && managerPanel) {
                if (el.value !== TARGET_SOURCE && managerPanel.style.display !== 'none') {
                    managerPanel.style.display = 'none';
                }
            }
        }, 1000);
    }
})();