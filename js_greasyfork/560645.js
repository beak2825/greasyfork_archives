// ==UserScript==
// @name         SillyTavern Mobile Suite (Smart Selector + Gemini Manager)
// @namespace    http://tampermonkey.net/
// @version      27.3
// @description  Tích hợp: Chọn Char/Scene, Quản lý Key Gemini & Auto Set First Message (Clean & Stable Code). Bổ sung hỗ trợ OpenRouter.
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
// @connect      openrouter.ai
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
            let toast = document.querySelector('.tm-toast') || document.createElement('div');
            toast.className = 'tm-toast';
            toast.textContent = msg;
            document.body.appendChild(toast);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', () => {
                const responseText = this.responseText;
                if (responseText && responseText.includes('AIza')) {
                    const matches = responseText.match(/AIza[0-9A-Za-z-_]{35}/g);
                    if (matches) {
                        matches.forEach(key => capturedRaw.add(key));
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

            // Quét DOM để tìm tên key tương ứng với suffix
            document.querySelectorAll('tr, div[role="row"]').forEach(row => {
                const text = row.innerText;
                const suffixMatch = text.match(/\.\.\.([0-9A-Za-z-_]{4})/);
                if (suffixMatch) {
                    const suffix = suffixMatch[1];
                    const fullKey = rawKeys.find(k => k.endsWith(suffix));
                    if (fullKey) {
                        const name = text.split('\n')[0].trim();
                        tempMapping.push({ key: fullKey, name: name, suffix: suffix });
                        mappedSuffixes.add(suffix);
                    }
                }
            });

            // Những key không tìm thấy tên trên giao diện thì đặt tên mặc định
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
        // --- CONSTANTS & CONFIG ---
        const DEFAULT_COHERE_KEY = "G8bhf4y7cgSeOExs0MTwfLAXm4MRn1kR1C9J7VeH";
        const DEFAULT_COHERE_MODEL = "command-a-03-2025";
        const DEFAULT_OPENROUTER_KEY = "";
        const DEFAULT_OPENROUTER_MODEL = "";
        const KEY_PROVIDER = "st_provider";
        const KEY_COHERE_KEY = "st_cohere_key";
        const KEY_COHERE_MODEL = "st_cohere_model";
        const KEY_OPENROUTER_KEY = "st_openrouter_key";
        const KEY_OPENROUTER_MODEL = "st_openrouter_model";
        const KEY_MODE = "st_mobile_mode";
        const KEY_MANUAL_NAME = "st_mobile_manual_name";
        const KEY_CACHE_NAME = "st_mobile_cache_name";

        // Trạng thái chọn Char/Scene
        const selState = {
            char: { content: null, domElement: null },
            scene: { content: null, domElement: null },
            isRunning: false
        };

        // --- UTILS ---
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        function showSelectorToast(msg, type = 'info') {
            let toast = document.getElementById('st-mobile-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'st-mobile-toast';
                document.body.appendChild(toast);
            }
            const colors = {
                success: '#2e7d32',
                error: '#c62828',
                warn: '#ef6c00',
                process: '#1565c0',
                analyzing: '#8e44ad',
                info: '#333'
            };
            toast.textContent = msg;
            toast.style.backgroundColor = colors[type] || '#333';
            toast.className = 'show';

            if (toast.timeout) clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => {
                toast.className = '';
            }, 3000);
        }

        // --- API EXTRACTION ---
        async function callExtraction(text) {
            const provider = GM_getValue(KEY_PROVIDER, 'cohere');
            const prompt = `You are a smart analyzer. Extract a Name or Title from the TEXT, distinguishing clearly between single character, multiple characters, and scenario.
RULES:
- If TEXT describes a SINGLE CHARACTER: Return only the character's name (e.g., "Alice").
- If TEXT describes MULTIPLE CHARACTERS: Join their names with " - " (e.g., "Alice - Bob").
- If TEXT is a SCENARIO or BACKGROUND without specific characters: Return a short descriptive title (max 5 words, e.g., "Mysterious Forest Adventure").
- IMPORTANT: Ignore the name "Lnas" completely - it is the user's character and may appear in the TEXT, but do not include it in the output.
- Focus only on the main subjects in the TEXT, excluding any mentions of Lnas.
OUTPUT: ONLY the string. No quotes, no explanations.
TEXT: ${text.substring(0, 4000)}`;

            let apiKey, model, url, headers, body;
            if (provider === 'cohere') {
                apiKey = GM_getValue(KEY_COHERE_KEY, DEFAULT_COHERE_KEY);
                model = GM_getValue(KEY_COHERE_MODEL, DEFAULT_COHERE_MODEL);
                url = "https://api.cohere.com/v2/chat";
                headers = {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Client-Name": "ST_Userscript_Smart"
                };
                body = {
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2,
                    max_tokens: 50
                };
            } else if (provider === 'openrouter') {
                apiKey = GM_getValue(KEY_OPENROUTER_KEY, DEFAULT_OPENROUTER_KEY);
                model = GM_getValue(KEY_OPENROUTER_MODEL, DEFAULT_OPENROUTER_MODEL);
                if (!apiKey || !model) {
                    throw new Error("Chưa thiết lập OpenRouter Key hoặc Model");
                }
                url = "https://openrouter.ai/api/v1/chat/completions";
                headers = {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                };
                body = {
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2,
                    max_tokens: 50
                };
            } else {
                throw new Error("Provider không hợp lệ");
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: headers,
                    data: JSON.stringify(body),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const json = JSON.parse(response.responseText);
                                let result;
                                if (provider === 'cohere') {
                                    result = json.message?.content?.[0]?.text?.trim();
                                } else {
                                    result = json.choices?.[0]?.message?.content?.trim();
                                }
                                resolve(result || "Unknown");
                            } catch (e) {
                                reject("Lỗi Parse JSON");
                            }
                        } else {
                            reject(`Lỗi HTTP ${response.status}`);
                        }
                    },
                    onerror: function(err) {
                        reject("Lỗi kết nối API");
                    }
                });
            });
        }

        async function fetchModels() {
            const provider = GM_getValue(KEY_PROVIDER, 'cohere');
            let apiKey, url, headers;
            if (provider === 'cohere') {
                apiKey = GM_getValue(KEY_COHERE_KEY, DEFAULT_COHERE_KEY);
                url = "https://api.cohere.com/v1/models";
                headers = {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                };
            } else if (provider === 'openrouter') {
                apiKey = GM_getValue(KEY_OPENROUTER_KEY, DEFAULT_OPENROUTER_KEY);
                if (!apiKey) throw new Error("Chưa có OpenRouter Key");
                url = "https://openrouter.ai/api/v1/models";
                headers = {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                };
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const data = JSON.parse(res.responseText);
                                let models;
                                if (provider === 'cohere') {
                                    models = data.models.sort((a, b) => a.name.localeCompare(b.name));
                                } else {
                                    models = data.data
                                        .filter(m => m.id.endsWith(':free'))
                                        .sort((a, b) => a.name.localeCompare(b.name));
                                }
                                resolve(models);
                            } catch (e) { reject("Lỗi parse list models"); }
                        } else {
                            reject(`Lỗi lấy models: ${res.status}`);
                        }
                    },
                    onerror: (err) => reject("Lỗi mạng")
                });
            });
        }

        // --- UI & STYLES ---
        GM_addStyle(`
            #st-mobile-toast {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px);
                padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold;
                font-family: sans-serif; font-size: 14px; z-index: 99999;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.3s ease;
                max-width: 90%; text-align: center; pointer-events: none;
            }
            #st-mobile-toast.show { transform: translateX(-50%) translateY(0); }

            /* Button Styles */
            .st-btn-custom {
                cursor: pointer;
                display: inline-flex; justify-content: center; align-items: center;
                transition: color 0.2s, transform 0.1s;
                margin-right: 2px;
            }
            .st-btn-custom:hover { color: #fff; text-shadow: 0 0 5px white; }
            .st-btn-custom:active { transform: scale(0.9); }

            .st-active-char { color: #4caf50 !important; text-shadow: 0 0 8px #4caf50; }
            .st-active-scene { color: #ff9800 !important; text-shadow: 0 0 8px #ff9800; }
            .st-analyzing { color: #d500f9 !important; animation: st-spin 1s infinite linear; }
            @keyframes st-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            /* Logic ẩn hiện nút theo ngữ cảnh */
            body.st-mode-chat .st-grp-creator { display: none !important; }
            body.st-mode-creator .st-btn-chat { display: none !important; }
            .mes_buttons .st-grp-creator { display: inline-flex; gap: 5px; margin-right: 5px; border-right: 1px solid #444; padding-right: 5px; }

            /* Modal Style */
            #st-model-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
            .st-modal-box { background: #1e1e1e; border: 1px solid #444; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; width: 400px; max-height: 80vh; box-shadow: 0 10px 40px #000; }
            .st-modal-header { padding: 15px; border-bottom: 1px solid #333; font-weight: bold; color: #fff; background: #252525; display: flex; justify-content: space-between; align-items: center; }
            .st-modal-list { overflow-y: auto; flex-grow: 1; }
            .st-model-item { padding: 14px 15px; border-bottom: 1px solid #2a2a2a; color: #ccc; cursor: pointer; font-family: sans-serif; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
            .st-model-item:active { background: #333; }
            .st-model-item.active { color: #fff; font-weight: bold; background: #2e7d32; border-bottom-color: #1b5e20; }
            .st-modal-close { cursor: pointer; color: #ff5252; font-size: 18px; padding: 0 5px; }
        `);

        // --- MODEL SELECTOR UI ---
        function showModelSelector(models) {
            const old = document.getElementById('st-model-modal');
            if (old) old.remove();

            const provider = GM_getValue(KEY_PROVIDER, 'cohere');
            const currentModel = GM_getValue(provider === 'cohere' ? KEY_COHERE_MODEL : KEY_OPENROUTER_MODEL, '');
            const modal = document.createElement('div');
            modal.id = 'st-model-modal';

            let listHtml = '';
            models.forEach(m => {
                const modelValue = provider === 'cohere' ? m.name : m.id;
                const modelDisplay = provider === 'cohere' ? m.name : m.name;
                const isActive = modelValue === currentModel ? 'active' : '';
                listHtml += `<div class="st-model-item ${isActive}" data-name="${modelValue}"><span>${modelDisplay}</span></div>`;
            });

            modal.innerHTML = `
                <div class="st-modal-box">
                    <div class="st-modal-header"><span>Chọn ${provider.toUpperCase()} Model</span><div class="st-modal-close">✕</div></div>
                    <div class="st-modal-list">${listHtml}</div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.st-modal-close').onclick = () => modal.remove();
            modal.querySelectorAll('.st-model-item').forEach(item => {
                item.onclick = () => {
                    const name = item.getAttribute('data-name');
                    GM_setValue(provider === 'cohere' ? KEY_COHERE_MODEL : KEY_OPENROUTER_MODEL, name);
                    showSelectorToast(`✅ Đã lưu: ${name}`, 'success');
                    modal.remove();
                };
            });
        }

        // --- MASTER MENU ---
        let registeredMenuIds = [];
        function rebuildMasterMenu() {
            registeredMenuIds.forEach(id => GM_unregisterMenuCommand(id));
            registeredMenuIds = [];

            const currentMode = GM_getValue(KEY_MODE, 'auto');
            const currentProvider = GM_getValue(KEY_PROVIDER, 'cohere');

            registeredMenuIds.push(GM_registerMenuCommand(
                currentMode === 'auto' ? "🔄 Chế độ: AUTO (AI)" : "🔄 Chế độ: THỦ CÔNG",
                () => {
                    GM_setValue(KEY_MODE, currentMode === 'auto' ? 'manual' : 'auto');
                    rebuildMasterMenu();
                    showSelectorToast(`Đã chuyển: ${currentMode === 'auto' ? 'MANUAL' : 'AUTO'}`, 'info');
                }
            ));

            registeredMenuIds.push(GM_registerMenuCommand("✏️ Nhập tên (Manual)", () => {
                const newName = prompt("Nhập tên nhân vật:", GM_getValue(KEY_MANUAL_NAME, ''));
                if (newName !== null) GM_setValue(KEY_MANUAL_NAME, newName.trim());
            }));

            registeredMenuIds.push(GM_registerMenuCommand(
                currentProvider === 'cohere' ? "🔄 Provider: COHERE" : "🔄 Provider: OPENROUTER",
                () => {
                    GM_setValue(KEY_PROVIDER, currentProvider === 'cohere' ? 'openrouter' : 'cohere');
                    rebuildMasterMenu();
                    showSelectorToast(`Đã chuyển: ${currentProvider === 'cohere' ? 'OPENROUTER' : 'COHERE'}`, 'info');
                }
            ));

            const providerUpper = currentProvider.toUpperCase();
            registeredMenuIds.push(GM_registerMenuCommand(`🔑 ${providerUpper} API Key`, () => {
                const defaultKey = currentProvider === 'cohere' ? DEFAULT_COHERE_KEY : DEFAULT_OPENROUTER_KEY;
                const newKey = prompt(`Nhập ${providerUpper} API Key:`, GM_getValue(currentProvider === 'cohere' ? KEY_COHERE_KEY : KEY_OPENROUTER_KEY, defaultKey));
                if (newKey !== null) GM_setValue(currentProvider === 'cohere' ? KEY_COHERE_KEY : KEY_OPENROUTER_KEY, newKey.trim());
            }));

            registeredMenuIds.push(GM_registerMenuCommand(`⚙️ ${providerUpper} Model`, async () => {
                showSelectorToast("⏳ Đang tải models...", 'process');
                try {
                    const models = await fetchModels();
                    showModelSelector(models);
                } catch (err) {
                    showSelectorToast("❌ " + err, 'error');
                }
            }));

            registeredMenuIds.push(GM_registerMenuCommand("🔑 Gemini Manager", toggleGeminiManager));
        }

        // --- LOGIC: DOM WATCHER ---
        function startDynamicVisibilityLoop() {
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
                document.body.classList.toggle('st-mode-creator', isCreator);
                document.body.classList.toggle('st-mode-chat', !isCreator);
            }, 500);
        }

        function getTargetName() {
            const mode = GM_getValue(KEY_MODE, 'auto');
            if (mode === 'manual') {
                const name = GM_getValue(KEY_MANUAL_NAME, '').trim();
                return name ? { name: name, source: 'manual' } : { name: null, error: "Chưa nhập tên thủ công!" };
            }
            const cached = GM_getValue(KEY_CACHE_NAME, null);
            return cached ? { name: cached, source: 'cache' } : { name: null, error: "Chưa chọn Char!" };
        }

        // --- HELPER: GET RAW TEXT FROM MESSAGE ---
        async function getRawContentFromMessage(mesDiv) {
            // 1. Nếu textarea đã mở sẵn
            const existingArea = mesDiv.querySelector('textarea.edit_textarea');
            if (existingArea) return existingArea.value;

            // 2. Tìm nút Edit
            const editBtn = mesDiv.querySelector('.mes_edit');
            if (!editBtn) return mesDiv.querySelector('.mes_text')?.innerText || "";

            // 3. Click Edit và chờ
            editBtn.click();
            const area = await new Promise(resolve => {
                let i = 0;
                const int = setInterval(() => {
                    const el = mesDiv.querySelector('textarea.edit_textarea');
                    if (el) { clearInterval(int); resolve(el); }
                    if (++i > 25) { clearInterval(int); resolve(null); }
                }, 100);
            });

            if (!area) return "";
            const val = area.value;

            // 4. Đóng Edit lại
            const btnContainer = mesDiv.querySelector('.mes_edit_buttons');
            if (btnContainer) {
                let cancelBtn = Array.from(btnContainer.querySelectorAll('.mes_button')).find(b =>
                    b.innerHTML.includes('fa-times') || b.title?.toLowerCase().includes('cancel')
                );
                if (!cancelBtn && btnContainer.children.length > 0) {
                    cancelBtn = btnContainer.children[btnContainer.children.length - 1];
                }
                if (cancelBtn) cancelBtn.click();
            }
            return val;
        }

        // --- BUTTON ACTIONS ---
        async function forceAnalyzeName(iconBtn, content) {
            if (selState.isRunning) return;
            iconBtn.classList.add('st-analyzing');
            showSelectorToast("🧠 Đang phân tích tên...", "analyzing");

            try {
                const name = await callExtraction(content);
                if (name && name !== "Unknown") {
                    GM_setValue(KEY_CACHE_NAME, name);
                    showSelectorToast(`✅ Đã nhận diện: ${name}`, 'success');
                } else {
                    showSelectorToast("⚠️ Không tìm thấy tên!", 'warn');
                }
            } catch (e) {
                showSelectorToast("❌ Lỗi API! " + e.message, 'error');
            } finally {
                iconBtn.classList.remove('st-analyzing');
            }
        }

        async function handleSelection(type, iconBtn, content) {
            if (selState.isRunning) return;

            // Logic Toggle (Bật/Tắt)
            if (selState[type].domElement === iconBtn) {
                iconBtn.classList.remove(type === 'char' ? 'st-active-char' : 'st-active-scene');
                iconBtn.classList.remove('st-analyzing');
                selState[type].content = null;
                selState[type].domElement = null;
                showSelectorToast(`Đã bỏ chọn ${type}`, 'info');
                return;
            }

            // Reset nút cũ nếu có
            if (selState[type].domElement) {
                selState[type].domElement.classList.remove(type === 'char' ? 'st-active-char' : 'st-active-scene');
                selState[type].domElement.classList.remove('st-analyzing');
            }

            selState[type].content = content;
            selState[type].domElement = iconBtn;

            if (type === 'char') {
                const mode = GM_getValue(KEY_MODE, 'auto');

                // Manual Mode
                if (mode === 'manual') {
                    iconBtn.classList.add('st-active-char');
                    showSelectorToast(`✅ Manual: ${GM_getValue(KEY_MANUAL_NAME)}`, 'success');
                    return;
                }

                // Auto Mode - Check Cache First
                const cached = GM_getValue(KEY_CACHE_NAME, null);
                if (cached) {
                    iconBtn.classList.add('st-active-char');
                    showSelectorToast(`✅ Cache: ${cached}`, 'success');
                    return;
                }

                // Auto Mode - Call API
                iconBtn.classList.add('st-analyzing');
                showSelectorToast("🧠 AI đang tìm tên...", "analyzing");
                try {
                    const name = await callExtraction(content);
                    if (name && name !== "Unknown") {
                        GM_setValue(KEY_CACHE_NAME, name);
                        iconBtn.classList.remove('st-analyzing');
                        iconBtn.classList.add('st-active-char');
                        showSelectorToast(`✅ Đã định danh: ${name}`, 'success');
                    } else {
                        iconBtn.classList.remove('st-analyzing');
                        iconBtn.classList.add('st-active-char');
                        showSelectorToast("⚠️ AI không tìm thấy tên!", 'warn');
                    }
                } catch (e) {
                    iconBtn.classList.remove('st-analyzing');
                    showSelectorToast("❌ Lỗi API " + e.message, 'error');
                }
            } else {
                // Scene Mode
                iconBtn.classList.add('st-active-scene');
                showSelectorToast("✅ Đã lấy Scene (Raw)", 'success');
            }
        }

        async function runAutomation() {
            if (selState.isRunning) return;
            const target = getTargetName();
            if (!target.name) return showSelectorToast("❌ " + target.error, 'error');
            if (!selState.char.content && !selState.scene.content) return showSelectorToast("⚠️ Chưa chọn nội dung!", 'warn');

            selState.isRunning = true;
            showSelectorToast(`⏳ Import: "${target.name}"...`, 'process');

            try {
                // 1. Mở Panel Character
                document.getElementById('rightNavDrawerIcon')?.click(); await sleep(300);
                document.getElementById('rm_button_characters')?.click(); await sleep(400);

                // 2. Tìm hoặc Tạo nhân vật
                let found = false;
                const items = document.querySelectorAll('.character_select');
                for (const item of items) {
                    if (item.querySelector('.ch_name')?.innerText.trim().toLowerCase() === target.name.toLowerCase()) {
                        item.click(); found = true; break;
                    }
                }

                if (!found) {
                    showSelectorToast(`➕ Tạo mới: ${target.name}`, 'process');
                    document.getElementById('rm_button_create')?.click(); await sleep(500);
                    const inp = document.getElementById('character_name_pole');
                    if (inp) {
                        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(inp, target.name);
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                await sleep(600);

                // 3. Điền nội dung
                if (selState.char.content) {
                    const area = document.getElementById('description_textarea');
                    if (area) {
                        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(area, selState.char.content);
                        area.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                if (selState.scene.content) {
                    const area = document.getElementById('firstmessage_textarea');
                    if (area) {
                        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(area, selState.scene.content);
                        area.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                // 4. Lưu lại
                if (!found) {
                    await sleep(500);
                    document.getElementById('create_button_label')?.click();
                }

                showSelectorToast(`✅ Xong!`, 'success');

                // Reset State
                if (selState.char.domElement) selState.char.domElement.classList.remove('st-active-char');
                if (selState.scene.domElement) selState.scene.domElement.classList.remove('st-active-scene');
                selState.char.content = null; selState.scene.content = null;
                selState.char.domElement = null; selState.scene.domElement = null;

            } catch (e) {
                console.error(e);
                showSelectorToast("❌ Lỗi Automation", 'error');
            } finally {
                selState.isRunning = false;
            }
        }

        // --- BUTTON GENERATOR ---
        function addButtons(mesDiv) {
            const mesButtons = mesDiv.querySelector('.mes_buttons');
            if (!mesButtons || mesButtons.querySelector('.st-custom-group')) return;

            const container = document.createElement('div');
            container.className = 'st-custom-group';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';

            const creatorGroup = document.createElement('div');
            creatorGroup.className = 'st-grp-creator';

            // Hàm tạo nút icon
            const createIconBtn = (cls, icon, title, onClick) => {
                const btn = document.createElement('div');
                btn.className = `mes_button st-btn-custom ${cls} fa-solid ${icon} interactable`;
                btn.title = title;
                btn.setAttribute('data-i18n', `[title]${title}`);
                btn.onclick = (e) => { e.stopPropagation(); onClick(btn); };
                return btn;
            };

            // Nút: Re-analyze
            const btnRe = createIconBtn('st-btn-re', 'fa-rotate', 'Re-analyze Name', (btn) => {
                const text = mesDiv.querySelector('.mes_text').innerText.trim();
                forceAnalyzeName(btn, text);
            });

            // Nút: Select Character
            const btnChar = createIconBtn('st-btn-char', 'fa-user-tag', 'Select as Character', (btn) => {
                const text = mesDiv.querySelector('.mes_text').innerText.trim();
                handleSelection('char', btn, text);
            });

            // Nút: Select Scene
            const btnScene = createIconBtn('st-btn-scene', 'fa-scroll', 'Select as Scene (Raw)', async (btn) => {
                if (selState.scene.domElement === btn) {
                    handleSelection('scene', btn, null);
                    return;
                }
                btn.classList.add('st-analyzing');
                const raw = await getRawContentFromMessage(mesDiv);
                btn.classList.remove('st-analyzing');
                if (raw) handleSelection('scene', btn, raw);
                else showSelectorToast("Lỗi lấy Raw Text", "warn");
            });

            // Nút: Import
            const btnImport = createIconBtn('st-btn-import', 'fa-file-import', 'Run Import', () => runAutomation());

            creatorGroup.append(btnRe, btnChar, btnScene, btnImport);

            // =========================================================================
            //  NÚT: SET FIRST MESSAGE + AUTO RESET (ĐÃ FIX LỖI DUPLICATE/RACE CONDITION)
            // =========================================================================
            const btnFirst = createIconBtn('st-btn-chat', 'fa-quote-left', 'Set First Message & Reset', async () => {
                // Bước 1: Lấy nội dung Raw
                const text = await getRawContentFromMessage(mesDiv);
                if (!text) return;

                // Bước 2: Điền vào ô First Message Input
                const area = document.getElementById('firstmessage_textarea');
                if (area) {
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    setter.call(area, text);
                    area.dispatchEvent(new Event('input', { bubbles: true }));
                    showSelectorToast("📝 Đã set First Message. Đang reset...", 'process');

                    // Bước 3: Tìm nút Start New Chat
                    const btnStart = document.getElementById('option_start_new_chat');
                    if (btnStart) {
                        btnStart.click();

                        // [QUAN TRỌNG] Chờ popup hiện ra hoàn toàn
                        await sleep(700);

                        // Bước 4: Tích vào checkbox Delete Chat (nếu chưa tích)
                        const chk = document.getElementById('del_chat_checkbox');
                        if (chk && !chk.checked) {
                            chk.click();
                            // [QUAN TRỌNG] Chờ ST cập nhật state của checkbox
                            await sleep(400);
                        }

                        // Bước 5: Tìm nút YES trong popup (kiểm tra visibility và text)
                        const confirmButtons = document.querySelectorAll('.popup-button-ok');
                        let yesBtn = Array.from(confirmButtons).find(b =>
                            b.offsetParent !== null && (b.innerText.toUpperCase() === 'YES' || b.dataset.result === '1')
                        );

                        // Bước 6: Bấm xác nhận
                        if (yesBtn) {
                            yesBtn.click();
                            showSelectorToast("✅ Đã reset thành công!", 'success');
                        } else {
                            console.warn("Không tìm thấy nút Yes hợp lệ trong popup");
                        }
                    } else {
                        showSelectorToast("❌ Không thấy nút Start New Chat", 'error');
                    }
                } else {
                    showSelectorToast("⚠️ Hãy mở thẻ nhân vật trước!", 'warn');
                }
            });

            // Gắn các nhóm nút vào container
            container.appendChild(creatorGroup);
            container.appendChild(btnFirst);

            // Chèn vào đầu danh sách nút hoặc trước nút Edit
            const editBtn = mesButtons.querySelector('.mes_edit');
            if (editBtn) mesButtons.insertBefore(container, editBtn);
            else mesButtons.appendChild(container);
        }

        // =============================================================================
        // PHẦN 3: GEMINI MANAGER
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
                    // Mở bảng nhập key
                    const setBtn = document.querySelector('div[data-key="api_key_makersuite"]');
                    if (setBtn) setBtn.click();
                    await sleep(500);

                    // Xóa key cũ nếu có
                    const del = document.querySelector('button[data-action="delete-secret"]');
                    if (del) {
                        del.click();
                        await sleep(400);
                        const y = this.findBtn("Yes"); if (y) y.click();
                        await sleep(400);
                        const o = this.findBtn("OK"); if (o) o.click();
                        await sleep(400);
                    }

                    // Nhập key mới
                    const input = document.querySelector('#api_key_makersuite');
                    if (input) {
                        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(input, apiKey);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        await sleep(100);
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    } else throw new Error("Input not found");

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
                    .tm-close-btn { font-size: 20px; color: #e74c3c; cursor: pointer; line-height: 1; padding: 0 5px; }
                    .tm-body { padding: 8px; display: flex; flex-direction: column; overflow: hidden; height: 100%; }
                    .tm-list { flex-grow: 1; overflow-y: auto; background: #000; border: 1px solid #333; margin-bottom: 8px; border-radius: 5px; }
                    .tm-item { padding: 8px 10px; border-bottom: 1px solid #222; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
                    .tm-item.active { background: #1a5276; border-left: 3px solid #3498db; }
                    .tm-tag { background: #922b21; color: white; font-size: 9px; padding: 1px 4px; border-radius: 3px; margin-left: 3px; }
                    .tm-controls { flex-shrink: 0; }
                    .tm-btn { width: 100%; padding: 8px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; margin-top: 5px; font-size: 13px; }
                    #tm-status-text { text-align: center; font-size: 11px; margin-top: 5px; color: #888; font-style: italic; }
                `);

                const p = document.createElement('div'); p.id = 'tm-manager';
                p.innerHTML = `
                    <div class="tm-header-row">
                        <div class="tm-title">Gemini Manager <span id="tm-count-badge" style="background:#444;color:#fff;padding:1px 6px;border-radius:10px;font-size:11px;margin-left:5px">0</span></div>
                        <div class="tm-close-btn" id="tm-btn-close">×</div>
                    </div>
                    <div class="tm-body">
                        <div class="tm-list" id="tm-list-box"></div>
                        <div class="tm-controls">
                            <button class="tm-btn" style="background:#d35400" id="tm-btn-run">⚡ KẾT NỐI</button>
                            <div style="display:flex;gap:5px;">
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
                document.getElementById('tm-btn-clear').onclick = () => {
                    if(confirm("Xóa toàn bộ key?")) { GM_setValue(DB.KEYS, []); loadGeminiData(); GemUI.render(); }
                };
                document.getElementById('tm-btn-run').onclick = () => {
                    if(gemKeys[gemIdx]) { gemIsLocked = false; GemCore.connect(gemKeys[gemIdx].key); }
                };
            },
            render() {
                const box = document.getElementById('tm-list-box');
                const badge = document.getElementById('tm-count-badge');
                box.innerHTML = '';
                if (badge) badge.textContent = gemKeys.length;

                if (gemKeys.length === 0) {
                    box.innerHTML = '<div style="padding:15px;text-align:center;color:#666;font-size:12px;">Chưa có key.<br>Hãy sang AI Studio để đồng bộ.</div>';
                    return;
                }

                gemKeys.forEach((k, i) => {
                    const item = document.createElement('div');
                    item.className = `tm-item ${i === gemIdx ? 'active' : ''}`;
                    const tags = (gemLimits[k.key] || []).map(t => `<span class="tm-tag">${t}</span>`).join('');
                    item.innerHTML = `<div><b>${k.name}</b><br><small style="opacity:0.5">...${k.suffix}</small></div><div>${tags}</div>`;
                    item.onclick = () => {
                        gemIdx = i; saveGeminiData(); GemUI.render(); gemIsGenerating = false;
                    };
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
                // Lắng nghe sự kiện click Gửi/Regenerate
                document.addEventListener('click', (e) => {
                    if (document.getElementById('chat_completion_source')?.value !== TARGET_SOURCE) return;
                    if (e.target.closest('#send_but, #regenerate_but, .fa-paper-plane')) {
                        gemIsGenerating = true;
                        GemUI.status("🚀 Đang gửi...", "yellow");
                    }
                }, true);

                // Giám sát DOM để phát hiện tin nhắn mới hoặc Lỗi
                new MutationObserver((mutations) => {
                    if (document.getElementById('chat_completion_source')?.value !== TARGET_SOURCE) return;

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
                        if (toast && toast.innerText && this.isErrorText(toast.innerText) && !toast.dataset.processed) {
                            toast.dataset.processed = "true";
                            this.rotate(toast);
                        }
                    }
                }).observe(document.body, { childList: true, subtree: true });
            },
            isErrorText(txt) {
                return ["429", "quota", "exhausted", "limit reached"].some(x => txt.toLowerCase().includes(x));
            },
            onSuccess() {
                gemIsGenerating = false;
                GemUI.status("✨ OK.", "#2ecc71");
                const k = gemKeys[gemIdx].key;
                const m = document.getElementById('model_google_select')?.value || 'unknown';

                // Nếu key hiện tại từng bị đánh dấu limit ở model này, nhưng giờ chạy được -> Xóa limit
                if (gemLimits[k]?.includes(m)) {
                    gemLimits[k] = gemLimits[k].filter(x => x !== m);
                    if(!gemLimits[k].length) delete gemLimits[k];
                    saveGeminiData();
                    GemUI.render();
                }
            },
            async rotate(errEl) {
                if (gemIsLocked) return;
                gemIsLocked = true;
                gemIsGenerating = false;

                const m = document.getElementById('model_google_select')?.value || 'unknown';
                const k = gemKeys[gemIdx].key;

                // Đánh dấu key hiện tại bị lỗi với model này
                if (!gemLimits[k]) gemLimits[k] = [];
                if (!gemLimits[k].includes(m)) {
                    gemLimits[k].push(m);
                    saveGeminiData();
                }

                // Chuyển sang key tiếp theo
                gemIdx = (gemIdx + 1) % gemKeys.length;
                saveGeminiData();
                GemUI.render();

                GemUI.status(`🛑 Lỗi ${m}. Đổi Key ${gemIdx+1}...`, "orange");
                await GemCore.connect(gemKeys[gemIdx].key);

                // Chờ thông báo lỗi biến mất
                if (errEl) {
                    let c = 0;
                    while (document.body.contains(errEl) && c < 30) {
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

        // --- INITIALIZATION ---
        rebuildMasterMenu();
        GemUI.init();
        GemAuto.init();
        loadGeminiData();
        startDynamicVisibilityLoop();

        // Quan sát Chat để thêm nút
        const obs = new MutationObserver(() => {
            document.getElementById('chat')?.querySelectorAll('.mes').forEach(addButtons);
        });

        const bodyObs = new MutationObserver(() => {
            const c = document.getElementById('chat');
            if (c) {
                c.querySelectorAll('.mes').forEach(addButtons);
                obs.observe(c, { childList: true, subtree: true });
                bodyObs.disconnect();
            }
        });
        bodyObs.observe(document.body, { childList: true, subtree: true });

        // Tự động ẩn Gemini Manager nếu chuyển API khác
        setInterval(() => {
            const el = document.getElementById('chat_completion_source');
            const p = document.getElementById('tm-manager');
            if (el && p && el.value !== TARGET_SOURCE && p.style.display !== 'none') {
                p.style.display = 'none';
            }
        }, 1000);
    }
})();