// ==UserScript==
// @name         SillyTavern Mobile Suite (Manual Only + Gemini Manager)
// @namespace    http://tampermonkey.net/
// @version      31
// @description  Tích hợp: Chọn Char (Manual Name) / Scene (Raw), Quản lý Key Gemini & Auto Set First Message. (No AI Analysis - Fast & Lightweight)
// @author       You
// @match        http://127.0.0.1:8000/*
// @match        https://aistudio.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Manual%20Only%20%2B%20Gemini%20Manager%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Manual%20Only%20%2B%20Gemini%20Manager%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isST = location.href.includes('127.0.0.1:8000');
    const isGoogle = location.href.includes('aistudio.google.com');

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

    if (isST) {
        const KEY_MANUAL_NAME = "st_mobile_manual_name";
        const KEY_IGNORE_LIST = "st_ignore_list";

        const selState = {
            char: { content: null, domElement: null },
            scene: { content: null, domElement: null },
            isRunning: false
        };

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        function showSelectorToast(msg, type = 'info') {
            let toast = document.getElementById('st-mobile-toast') || document.createElement('div');
            toast.id = 'st-mobile-toast';
            document.body.appendChild(toast);
            const colors = { success: '#2e7d32', error: '#c62828', warn: '#ef6c00', process: '#1565c0', info: '#333' };
            toast.textContent = msg;
            toast.style.backgroundColor = colors[type] || '#333';
            toast.className = 'show';
            clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => toast.className = '', 3000);
        }

        GM_addStyle(`
            #st-mobile-toast {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px);
                padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold;
                font-family: sans-serif; font-size: 14px; z-index: 99999;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.3s ease;
                max-width: 90%; text-align: center; pointer-events: none; word-break: break-word;
            }
            #st-mobile-toast.show { transform: translateX(-50%) translateY(0); }

            .st-btn-custom {
                cursor: pointer; display: inline-flex; justify-content: center; align-items: center;
                transition: color 0.2s, transform 0.1s; margin-right: 2px;
            }
            .st-btn-custom:hover { color: #fff; text-shadow: 0 0 5px white; }
            .st-btn-custom:active { transform: scale(0.9); }

            .st-active-char { color: #4caf50 !important; text-shadow: 0 0 8px #4caf50; }
            .st-active-scene { color: #ff9800 !important; text-shadow: 0 0 8px #ff9800; }

            body.st-mode-chat .st-grp-creator { display: none !important; }
            body.st-mode-creator .st-btn-chat { display: none !important; }
            .mes_buttons .st-grp-creator { display: inline-flex; gap: 5px; margin-right: 5px; border-right: 1px solid #444; padding-right: 5px; }
        `);

        let registeredMenuIds = [];
        function rebuildMasterMenu() {
            registeredMenuIds.forEach(GM_unregisterMenuCommand);
            registeredMenuIds = [];
            registeredMenuIds.push(GM_registerMenuCommand("✏️ Đặt tên Nhân vật (Manual)", () => {
                const current = GM_getValue(KEY_MANUAL_NAME, '');
                const newName = prompt("Nhập tên nhân vật mặc định:", current);
                if (newName !== null) {
                    GM_setValue(KEY_MANUAL_NAME, newName.trim());
                    showSelectorToast(`✅ Đã lưu: ${newName.trim()}`, 'success');
                }
            }));
            registeredMenuIds.push(GM_registerMenuCommand("🛑 Set Ignore List (cách nhau ;)", () => {
                const current = GM_getValue(KEY_IGNORE_LIST, '');
                const newList = prompt("Nhập các từ/câu cần bỏ qua (cách nhau bằng ;):", current);
                if (newList !== null) {
                    GM_setValue(KEY_IGNORE_LIST, newList.trim());
                    showSelectorToast(`✅ Đã lưu Ignore List: ${newList.trim()}`, 'success');
                }
            }));
            registeredMenuIds.push(GM_registerMenuCommand("🔑 Gemini Manager", toggleGeminiManager));
        }

        function startDynamicVisibilityLoop() {
            setInterval(() => {
                const nameH2 = document.querySelector('h2.interactable');
                let currentName = nameH2 ? nameH2.innerText.trim().toLowerCase() : '';
                if (!currentName) {
                    const navName = document.querySelector('#right-nav-panel .ch_name');
                    currentName = navName ? navName.innerText.trim().toLowerCase() : '';
                }
                const isCreator = currentName === 'char creator';
                document.body.classList.toggle('st-mode-creator', isCreator);
                document.body.classList.toggle('st-mode-chat', !isCreator);
            }, 500);
        }

        function getManualName() {
            let name = GM_getValue(KEY_MANUAL_NAME, '').trim();
            if (!name) {
                const input = prompt("Chưa thiết lập tên Nhân vật.\nHãy nhập tên ngay:");
                if (input) {
                    name = input.trim();
                    GM_setValue(KEY_MANUAL_NAME, name);
                }
            }
            return name;
        }

        async function getRawContentFromMessage(mesDiv) {
            const existingArea = mesDiv.querySelector('textarea.edit_textarea');
            if (existingArea) return existingArea.value;

            const editBtn = mesDiv.querySelector('.mes_edit');
            if (!editBtn) return mesDiv.querySelector('.mes_text')?.innerText || "";

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

        function escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function filterContent(content) {
            const ignoreStr = GM_getValue(KEY_IGNORE_LIST, '').trim();
            if (!ignoreStr) return content;
            const ignoreList = ignoreStr.split(';').map(s => s.trim()).filter(Boolean);
            ignoreList.forEach(ignore => {
                const regex = new RegExp(escapeRegex(ignore), 'gi');
                content = content.replace(regex, '');
            });
            return content;
        }

        async function handleSelection(type, iconBtn, content) {
            if (selState.isRunning) return;

            if (selState[type].domElement === iconBtn) {
                iconBtn.classList.remove(type === 'char' ? 'st-active-char' : 'st-active-scene');
                selState[type].content = null;
                selState[type].domElement = null;
                showSelectorToast(`Đã bỏ chọn ${type}`, 'info');
                return;
            }

            if (selState[type].domElement) {
                selState[type].domElement.classList.remove(type === 'char' ? 'st-active-char' : 'st-active-scene');
            }

            content = filterContent(content);

            if (type === 'char') {
                const name = getManualName();
                if (!name) return showSelectorToast("⚠️ Bạn chưa nhập tên!", 'warn');
                selState[type].content = content;
                selState[type].domElement = iconBtn;
                iconBtn.classList.add('st-active-char');
                showSelectorToast(`✅ Đã chọn cho: ${name}`, 'success');
            } else {
                selState[type].content = content;
                selState[type].domElement = iconBtn;
                iconBtn.classList.add('st-active-scene');
                showSelectorToast("✅ Đã lấy Scene (Raw)", 'success');
            }
        }

        async function runAutomation() {
            if (selState.isRunning) return;
            const targetName = GM_getValue(KEY_MANUAL_NAME, '').trim();

            if (!targetName) return showSelectorToast("❌ Chưa có tên (Manual Name)!", 'error');
            if (!selState.char.content && !selState.scene.content) return showSelectorToast("⚠️ Chưa chọn nội dung!", 'warn');

            selState.isRunning = true;
            showSelectorToast(`⏳ Import: "${targetName}"...`, 'process');

            try {
                document.getElementById('rightNavDrawerIcon')?.click(); await sleep(300);
                document.getElementById('rm_button_characters')?.click(); await sleep(400);

                let found = false;
                document.querySelectorAll('.character_select').forEach(item => {
                    if (item.querySelector('.ch_name')?.innerText.trim().toLowerCase() === targetName.toLowerCase()) {
                        item.click(); found = true;
                    }
                });

                if (!found) {
                    showSelectorToast(`➕ Tạo mới: ${targetName}`, 'process');
                    document.getElementById('rm_button_create')?.click(); await sleep(500);
                    const inp = document.getElementById('character_name_pole');
                    if (inp) {
                        inp.value = targetName;
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                await sleep(600);

                if (selState.char.content) {
                    const area = document.getElementById('description_textarea');
                    if (area) {
                        area.value = selState.char.content;
                        area.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                if (selState.scene.content) {
                    const area = document.getElementById('firstmessage_textarea');
                    if (area) {
                        area.value = selState.scene.content;
                        area.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                if (!found) {
                    await sleep(500);
                    document.getElementById('create_button_label')?.click();
                }

                showSelectorToast(`✅ Xong!`, 'success');

                if (selState.char.domElement) selState.char.domElement.classList.remove('st-active-char');
                if (selState.scene.domElement) selState.scene.domElement.classList.remove('st-active-scene');
                selState.char = { content: null, domElement: null };
                selState.scene = { content: null, domElement: null };

            } catch (e) {
                console.error(e);
                showSelectorToast("❌ Lỗi Automation", 'error');
            } finally {
                selState.isRunning = false;
            }
        }

        function addButtons(mesDiv) {
            const mesButtons = mesDiv.querySelector('.mes_buttons');
            if (!mesButtons || mesButtons.querySelector('.st-custom-group')) return;

            const container = document.createElement('div');
            container.className = 'st-custom-group';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';

            const creatorGroup = document.createElement('div');
            creatorGroup.className = 'st-grp-creator';

            const createIconBtn = (cls, icon, title, onClick) => {
                const btn = document.createElement('div');
                btn.className = `mes_button st-btn-custom ${cls} fa-solid ${icon} interactable`;
                btn.title = title;
                btn.setAttribute('data-i18n', `[title]${title}`);
                btn.onclick = e => { e.stopPropagation(); onClick(btn); };
                return btn;
            };

            const btnChar = createIconBtn('st-btn-char', 'fa-user-tag', 'Select as Character (Manual)', btn => {
                let text = mesDiv.querySelector('.mes_text').innerText.trim();
                handleSelection('char', btn, text);
            });

            const btnScene = createIconBtn('st-btn-scene', 'fa-scroll', 'Select as Scene (Raw)', async btn => {
                if (selState.scene.domElement === btn) return handleSelection('scene', btn, null);
                const raw = await getRawContentFromMessage(mesDiv);
                if (raw) handleSelection('scene', btn, raw);
                else showSelectorToast("Lỗi lấy Raw Text", "warn");
            });

            const btnImport = createIconBtn('st-btn-import', 'fa-file-import', 'Run Import', () => runAutomation());

            creatorGroup.append(btnChar, btnScene, btnImport);

            const btnFirst = createIconBtn('st-btn-chat', 'fa-quote-left', 'Set First Message', async () => {
                let text = await getRawContentFromMessage(mesDiv);
                if (!text) return;
                text = filterContent(text);
                const area = document.getElementById('firstmessage_textarea');
                if (area) {
                    area.value = text;
                    area.dispatchEvent(new Event('input', { bubbles: true }));
                    showSelectorToast("✅ Đã set First Message thành công!", 'success');
                } else {
                    showSelectorToast("⚠️ Hãy mở thẻ nhân vật trước!", 'warn');
                }
            });

            container.append(creatorGroup, btnFirst);

            const editBtn = mesButtons.querySelector('.mes_edit');
            if (editBtn) mesButtons.insertBefore(container, editBtn);
            else mesButtons.appendChild(container);
        }

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
                    document.querySelector('div[data-key="api_key_makersuite"]')?.click();
                    await sleep(500);

                    const del = document.querySelector('button[data-action="delete-secret"]');
                    if (del) {
                        del.click();
                        await sleep(400);
                        this.findBtn("Yes")?.click();
                        await sleep(400);
                        this.findBtn("OK")?.click();
                        await sleep(400);
                    }

                    const input = document.getElementById('api_key_makersuite');
                    if (input) {
                        input.value = apiKey;
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

                document.getElementById('tm-btn-close').onclick = () => p.style.display = 'none';
                document.getElementById('tm-btn-refresh').onclick = () => { loadGeminiData(); this.render(); this.status("Đã cập nhật!"); };
                document.getElementById('tm-btn-clear').onclick = () => {
                    if (confirm("Xóa toàn bộ key?")) { GM_setValue(DB.KEYS, []); loadGeminiData(); this.render(); }
                };
                document.getElementById('tm-btn-run').onclick = () => {
                    if (gemKeys[gemIdx]) { gemIsLocked = false; GemCore.connect(gemKeys[gemIdx].key); }
                };
            },
            render() {
                const box = document.getElementById('tm-list-box');
                const badge = document.getElementById('tm-count-badge');
                box.innerHTML = '';
                if (badge) badge.textContent = gemKeys.length;

                if (!gemKeys.length) {
                    box.innerHTML = '<div style="padding:15px;text-align:center;color:#666;font-size:12px;">Chưa có key.<br>Hãy sang AI Studio để đồng bộ.</div>';
                    return;
                }

                gemKeys.forEach((k, i) => {
                    const item = document.createElement('div');
                    item.className = `tm-item ${i === gemIdx ? 'active' : ''}`;
                    const tags = (gemLimits[k.key] || []).map(t => `<span class="tm-tag">${t}</span>`).join('');
                    item.innerHTML = `<div><b>${k.name}</b><br><small style="opacity:0.5">...${k.suffix}</small></div><div>${tags}</div>`;
                    item.onclick = () => { gemIdx = i; saveGeminiData(); this.render(); gemIsGenerating = false; };
                    box.appendChild(item);
                });
            },
            status(msg, color = "#888") {
                const s = document.getElementById('tm-status-text');
                if (s) { s.textContent = msg; s.style.color = color; }
            }
        };

        const GemAuto = {
            init() {
                document.addEventListener('click', e => {
                    if (document.getElementById('chat_completion_source')?.value !== TARGET_SOURCE) return;
                    if (e.target.closest('#send_but, #regenerate_but, .fa-paper-plane')) {
                        gemIsGenerating = true;
                        GemUI.status("🚀 Đang gửi...", "yellow");
                    }
                }, true);

                new MutationObserver(mutations => {
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

                if (gemLimits[k]?.includes(m)) {
                    gemLimits[k] = gemLimits[k].filter(x => x !== m);
                    if (!gemLimits[k].length) delete gemLimits[k];
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

                if (!gemLimits[k]) gemLimits[k] = [];
                if (!gemLimits[k].includes(m)) gemLimits[k].push(m);
                saveGeminiData();

                gemIdx = (gemIdx + 1) % gemKeys.length;
                saveGeminiData();
                GemUI.render();

                GemUI.status(`🛑 Lỗi ${m}. Đổi Key ${gemIdx+1}...`, "orange");
                await GemCore.connect(gemKeys[gemIdx].key);

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

        rebuildMasterMenu();
        GemUI.init();
        GemAuto.init();
        loadGeminiData();
        startDynamicVisibilityLoop();

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

        setInterval(() => {
            const el = document.getElementById('chat_completion_source');
            const p = document.getElementById('tm-manager');
            if (el && p && el.value !== TARGET_SOURCE && p.style.display !== 'none') {
                p.style.display = 'none';
            }
        }, 1000);
    }
})();
