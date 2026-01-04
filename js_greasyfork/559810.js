// ==UserScript==
// @name         AI 提示词大师 Pro
// @namespace    http://tampermonkey.net/
// @version      10.0.4
// @license      MIT
// @description  全能整合版：已内置专属配置。支持云端/本地切换、面板折叠、UI自适应、模板删除、智能ID修复。
// @author       WaterHuo
// @match        *://gemini.google.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://chat.deepseek.com/*
// @match        *://www.doubao.com/*
// @match        *://www.kimi.ai/*
// @match        *://www.kimi.com/*
// @match        *://kimi.moonshot.cn/*
// @match        *://grok.com/*
// @match        *://x.com/i/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      tfntmhg1.api.lncldglobal.com
// @connect      v24uxbjt.lc-cn-n1-shared.com
// @connect      lc-cn-n1-shared.com
// @connect      api.lncldglobal.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559810/AI%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A4%A7%E5%B8%88%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/559810/AI%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A4%A7%E5%B8%88%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= 0. 配置与工具函数 (已替换为你提供的专属配置) =======
    const CONFIG = {
        LC_ID: 'V24uxBjtrCUXygv7KjFtlJV0-gzGzoHsz',
        LC_KEY: 'n5nEW5FUV3YtKghWpGxwd4JK',
        API_URL: 'https://v24uxbjt.lc-cn-n1-shared.com/1.1/classes/PromptData'
    };

    // 获取/生成用户唯一标识
    const getUserId = () => {
        let uid = GM_getValue('pm_uid');
        if (!uid) {
            uid = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            GM_setValue('pm_uid', uid);
        }
        return uid;
    };
    const USER_ID = getUserId();

    // TrustedHTML 安全策略
    let ttPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            const policyName = 'pm-policy-' + Math.random().toString(36).substring(7);
            ttPolicy = window.trustedTypes.createPolicy(policyName, {
                createHTML: (string) => string,
                createScript: (string) => string
            });
        } catch (e) {
            console.warn("PromptMaster: TrustedTypes policy already exists");
        }
    }
    const setHTML = (el, html) => {
        if (!el) return;
        el.innerHTML = ttPolicy ? ttPolicy.createHTML(html) : html;
    };

    // ======= 1. 数据管理核心 =======
    const STORAGE_KEY = 'pm_data_v16';
    const MODE_KEY = 'pm_storage_mode';
    const APPEND_KEY = 'pm_append_mode';
    const CLOUD_OBJ_ID_KEY = 'pm_cloud_oid';
    const FOLD_KEY = 'pm_folded_cats';
    const MINIMIZED_KEY = 'pm_is_minimized';

    let currentMode = GM_getValue(MODE_KEY, 'local');
    let promptData = {};
    let foldedCats = GM_getValue(FOLD_KEY, []);
    let isEditMode = false;
    let appendMode = GM_getValue(APPEND_KEY, true);
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);
    let isLoading = false;

    // 默认初始数据
    const defaultData = {
        "写作类": [{ name: "📝 深度润色", content: "请优化以下文本，梳理逻辑脉络，提升语言表达的简洁性和流畅性，保留核心信息。" }],
        "代码类": [{ name: "💻 逻辑审查", content: "请检查这段代码的语法错误、逻辑漏洞，给出优化建议和修复方案。" }]
    };

    // 云端API封装
    const CloudAPI = {
        headers: {
            "X-LC-Id": CONFIG.LC_ID,
            "X-LC-Key": CONFIG.LC_KEY,
            "Content-Type": "application/json"
        },
        request(method, endpoint, data = null) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: endpoint.startsWith('http') ? endpoint : CONFIG.API_URL + endpoint,
                    headers: this.headers,
                    data: data ? JSON.stringify(data) : null,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(JSON.parse(res.responseText));
                        } else {
                            try {
                                reject(JSON.parse(res.responseText));
                            } catch (e) {
                                reject({ error: res.statusText, code: res.status });
                            }
                        }
                    },
                    onerror: (err) => reject({ error: 'Network Error', code: 0 })
                });
            });
        },
        async fetchData() {
            try {
                const res = await this.request('GET', `?where={"uid":"${USER_ID}"}`);
                if (res.results && res.results.length > 0) {
                    GM_setValue(CLOUD_OBJ_ID_KEY, res.results[0].objectId);
                    let remoteData = res.results[0].data;
                    // 兼容旧格式字符串解析
                    if (typeof remoteData === 'string') {
                        try { remoteData = JSON.parse(remoteData); } catch(e) {}
                    }
                    return remoteData;
                }
            } catch (e) {
                console.warn("Fetch failed:", e);
            }
            return null;
        },
        // 智能保存逻辑：自动处理对象不存在的情况
        async saveData(data) {
            let oid = GM_getValue(CLOUD_OBJ_ID_KEY);
            const payload = { uid: USER_ID, data: data };

            const createNew = async () => {
                const res = await this.request('POST', '', payload);
                GM_setValue(CLOUD_OBJ_ID_KEY, res.objectId);
                console.log("已自动创建新云端对象:", res.objectId);
            };

            if (oid) {
                try {
                    await this.request('PUT', `/${oid}`, payload);
                } catch (e) {
                    // 错误码 1 或 101 代表 Object not found (可能你在后台删了数据)
                    if (e.code === 1 || e.code === 101) {
                        console.warn("云端对象不存在，正在重新创建...");
                        await createNew();
                    } else {
                        throw e;
                    }
                }
            } else {
                await createNew();
            }
        }
    };

    // 统一数据管理器
    const DataManager = {
        async load() {
            isLoading = true;
            renderUI();
            try {
                if (currentMode === 'local') {
                    promptData = GM_getValue(STORAGE_KEY) || defaultData;
                } else {
                    const cloudData = await CloudAPI.fetchData();
                    promptData = cloudData || defaultData;
                }
            } catch (e) {
                toast(`加载失败: ${e.error || '网络错误'}`);
                promptData = defaultData;
            } finally {
                isLoading = false;
                renderUI();
            }
        },
        async save() {
            renderUI();
            try {
                if (currentMode === 'local') {
                    GM_setValue(STORAGE_KEY, promptData);
                    toast("✅ 本地已保存");
                } else {
                    toast("☁️ 正在同步云端...", 5000);
                    await CloudAPI.saveData(promptData);
                    toast("✅ 云端同步完成");
                }
            } catch (e) {
                toast("❌ 保存失败，请检查网络");
                console.error(e);
            }
        }
    };

    // ======= 2. 导入导出工具 =======
    const IOTools = {
        exportJSON() {
            const fileName = `prompt_master_${currentMode}_${new Date().toISOString().slice(0,10)}.json`;
            const blob = new Blob([JSON.stringify(promptData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast("✅ 已导出备份");
        },
        importJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const newData = JSON.parse(event.target.result);
                        if (typeof newData === 'object' && newData !== null) {
                            let addedCount = 0;
                            Object.keys(newData).forEach(cat => {
                                if (!promptData[cat]) {
                                    promptData[cat] = newData[cat];
                                    addedCount += newData[cat].length;
                                } else {
                                    const existingNames = new Set(promptData[cat].map(item => item.name));
                                    newData[cat].forEach(newItem => {
                                        if (!existingNames.has(newItem.name)) {
                                            promptData[cat].push(newItem);
                                            addedCount++;
                                        }
                                    });
                                }
                            });
                            if (addedCount > 0) {
                                DataManager.save();
                                alert(`✅ 导入成功！新增 ${addedCount} 条。`);
                            } else {
                                alert("⚠️ 导入完成，没有新增内容。");
                            }
                        } else { toast("❌ 格式错误"); }
                    } catch (err) { toast("❌ 解析失败"); }
                    document.body.removeChild(input);
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };

    // ======= 3. 样式表 =======
    GM_addStyle(`
        #pm-root { font-family: -apple-system, system-ui, sans-serif; }
        .pm-panel {
            position: fixed; top: 80px; right: 20px;
            width: auto; min-width: 260px; max-width: 350px;
            background: #fff; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            z-index: 2147483647; border: 1px solid #eee;
            display: flex; flex-direction: column;
            transition: width 0.2s ease;
        }
        .pm-float-ball {
            position: fixed; top: 80px; right: 20px;
            width: 40px; height: 40px; background: #1a73e8;
            border-radius: 50%; box-shadow: 0 4px 12px rgba(26,115,232,0.3);
            z-index: 2147483647; cursor: pointer;
            display: flex; justify-content: center; align-items: center;
            color: #fff; font-weight: bold; font-size: 14px;
            border: 2px solid #fff; transition: transform 0.2s; user-select: none;
        }
        .pm-float-ball:hover { transform: scale(1.1); background: #1557b0; }
        .pm-header {
            padding: 10px 12px; background: #fcfcfc; border-bottom: 1px solid #f0f0f0;
            display: flex; justify-content: space-between; align-items: center;
            border-radius: 12px 12px 0 0; flex-wrap: wrap; gap: 8px;
        }
        .pm-title-area { display: flex; align-items: center; gap: 6px; flex: 1 1 auto; }
        .pm-title { font-size: 14px; font-weight: 700; color: #1a73e8; white-space: nowrap; }
        .pm-badge {
            font-size: 11px; padding: 3px 6px; border-radius: 4px; cursor: pointer;
            display: flex; align-items: center; border: 1px solid transparent; user-select: none; white-space: nowrap;
        }
        .pm-badge:hover { filter: brightness(0.95); transform: translateY(-1px); }
        .mode-local { background: #e6f4ea; color: #137333; border-color: #ceead6; }
        .mode-cloud { background: #e8f0fe; color: #1967d2; border-color: #d2e3fc; }
        .fill-append { background: #f5f9ff; color: #406599; border-color: #e1eafc; }
        .fill-replace { background: #f8f0f5; color: #8b5cf6; border-color: #f3e8ff; }
        .pm-header-right { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
        .pm-icon-btn {
            padding: 5px; border-radius: 4px; cursor: pointer; font-size: 14px;
            display: flex; align-items: center; justify-content: center; color: #5f6368;
        }
        .pm-icon-btn:hover { background: #f1f3f4; color: #1a73e8; }
        .pm-icon-active { color: #1a73e8; font-weight:bold; background: #e8f0fe; }
        .pm-body { padding: 8px; max-height: 60vh; overflow-y: auto; scrollbar-width: thin; min-height: 100px; position: relative;}
        .pm-footer {
            padding: 8px; border-top: 1px solid #eee; display: flex; gap: 6px;
            background: #fff; border-radius: 0 0 12px 12px;
        }
        .pm-tool-btn {
            flex: 1; padding: 6px; border: 1px solid #f1f3f4; background: #f8f9fa;
            border-radius: 6px; font-size: 11px; cursor: pointer; color: #5f6368; white-space: nowrap;
        }
        .pm-tool-btn:hover { background: #e8f0fe; color: #1967d2; border-color: #d2e3fc; }
        .pm-cat-wrap { margin-bottom: 8px; border-radius: 8px; overflow: hidden; }
        .pm-cat-header {
            display: flex; align-items: center; padding: 6px 4px; background: #f8f9fa; cursor: pointer;
        }
        .pm-cat-name { font-size: 12px; color: #5f6368; font-weight: 700; flex: 1; text-transform: uppercase; }
        .pm-cat-tools { display: none; gap: 6px; margin-right: 4px; }
        .pm-cat-header:hover .pm-cat-tools { display: flex; }
        .pm-tpl-list { padding: 4px 0; }
        .pm-tpl-list.folded { display: none; }
        .pm-item-wrap { position: relative; margin-bottom: 2px; }
        .pm-btn {
            width: 100%; border: none; background: transparent; padding: 8px 10px;
            text-align: left; font-size: 13px; border-radius: 6px; cursor: pointer;
            color: #3c4043; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pm-btn:hover { background: #f1f3f4; color: #1a73e8; }
        #pm-preview-float {
            position: fixed; display: none; width: auto; max-width: 280px;
            background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px);
            border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            border-radius: 8px; padding: 10px; font-size: 12px; line-height: 1.5;
            color: #444; z-index: 2147483647; opacity: 0; transition: opacity 0.2s;
        }
        #pm-preview-float.show { opacity: 1; }
        .pm-inline-editor {
            background: #fff; border: 1px solid #1a73e8; border-radius: 8px;
            padding: 8px; margin: 4px 0; box-shadow: 0 4px 12px rgba(26,115,232,0.15);
        }
        .pm-inline-editor textarea {
            width: 100%; height: 100px; border: 1px solid #dadce0;
            border-radius: 4px; padding: 6px; font-size: 12px; box-sizing: border-box; margin: 5px 0;
        }
        .pm-inline-editor input, .pm-inline-editor select {
            width: 100%; border: 1px solid #dadce0; border-radius: 4px;
            padding: 4px 6px; font-size: 12px; box-sizing: border-box; margin-bottom: 4px;
        }
        .pm-ed-btns { display: flex; justify-content: flex-end; gap: 6px; align-items: center; }
        .pm-ebtn { padding: 3px 8px; font-size: 11px; border-radius: 4px; cursor: pointer; border: none; }
        .pm-save { background: #1a73e8; color: #fff; }
        .pm-del { background: #fce8e6; color: #d93025; margin-right: auto; }
        .pm-del:hover { background: #f6c5c0; }
        .pm-cancel { background: #f1f3f4; color: #5f6368; }
        .pm-loading {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background:rgba(255,255,255,0.8); display:flex; justify-content:center;
            align-items:center; font-size:12px; color:#666; z-index:10;
        }
        .pm-toast {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: #323232; color: #fff; padding: 6px 16px; border-radius: 16px;
            font-size: 12px; z-index: 2147483647; display: none;
        }
    `);

    // ======= 4. 稳定填充核心 =======
    async function stableInject(text) {
        const inputField = document.querySelector(
            'div[role="textbox"], #prompt-textarea, textarea[placeholder*="输入"], #chat-input, [contenteditable="true"], textarea'
        );
        if (!inputField) return toast("❌ 未找到输入框");

        inputField.focus();
        const isRich = inputField.isContentEditable;
        const oldVal = isRich ? inputField.innerText : inputField.value;
        const newVal = (appendMode && oldVal.trim()) ? (oldVal + "\n" + text) : text;

        try {
            if (isRich) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(inputField);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('delete', false);
                document.execCommand('insertText', false, newVal);
            } else {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                setter.call(inputField, newVal);
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
            }
            toast("✅ 填充成功");
            inputField.focus();
            setTimeout(() => { inputField.scrollTop = inputField.scrollHeight; }, 10);
        } catch (e) { toast("❌ 填充失败"); }
    }

    // ======= 5. UI 渲染引擎 =======
    function toast(msg, time=2000) {
        const t = document.getElementById('pm-toast') || (() => {
            const d = document.createElement('div');
            d.id = 'pm-toast'; d.className = 'pm-toast';
            document.body.appendChild(d); return d;
        })();
        setHTML(t, msg);
        t.style.display = 'block'; setTimeout(() => t.style.display = 'none', time);
    }

    function renderUI() {
        if (!document.body) return;
        let root = document.getElementById('pm-root');
        if (!root) {
            root = document.createElement('div'); root.id = 'pm-root'; document.body.appendChild(root);
            const pf = document.createElement('div'); pf.id = 'pm-preview-float'; document.body.appendChild(pf);
        }
        const previewFloat = document.getElementById('pm-preview-float');

        if (isMinimized) {
            setHTML(root, `<div class="pm-float-ball" id="pm-restore-btn" title="点击展开">AI</div>`);
            document.getElementById('pm-restore-btn').onclick = () => {
                isMinimized = false; GM_setValue(MINIMIZED_KEY, false); renderUI();
            };
            return;
        }

        const modeClass = currentMode === 'local' ? 'mode-local' : 'mode-cloud';
        const modeText = currentMode === 'local' ? '🏠 本地' : '☁️ 云端';
        const fillClass = appendMode ? 'fill-append' : 'fill-replace';
        const fillText = appendMode ? '➕ 追加' : '🔄 替换';
        const configIcon = isEditMode ? '✅' : '⚙️';

        setHTML(root, `
            <div class="pm-panel">
                <div class="pm-header">
                    <div class="pm-title-area">
                        <span class="pm-title">提示词大师</span>
                        <span id="pm-switch-storage" class="pm-badge ${modeClass}" title="切换存储模式">${modeText}</span>
                    </div>
                    <div class="pm-header-right">
                        <span id="pm-switch-fill" class="pm-badge ${fillClass}" title="切换填充模式">${fillText}</span>
                        <span id="pm-config-btn" class="pm-icon-btn ${isEditMode?'pm-icon-active':''}" title="编辑管理">${configIcon}</span>
                        <span id="pm-fold-btn" class="pm-icon-btn" title="折叠面板" style="font-weight:bold; margin-left:2px;">−</span>
                    </div>
                </div>
                <div class="pm-body" id="pm-list-container">
                    ${isLoading ? '<div class="pm-loading">同步中...</div>' : ''}
                </div>
                <div class="pm-footer">
                    <button class="pm-tool-btn" id="pm-export-btn">📤 导出</button>
                    <button class="pm-tool-btn" id="pm-import-btn">📥 导入</button>
                    ${isEditMode ? `<button class="pm-tool-btn" id="pm-new-cat" style="background:#e8f0fe; color:#1a73e8;">+ 分类</button>` : ''}
                </div>
            </div>
        `);

        document.getElementById('pm-fold-btn').onclick = () => { isMinimized = true; GM_setValue(MINIMIZED_KEY, true); renderUI(); };
        if (isLoading) return;

        const container = document.getElementById('pm-list-container');
        Object.keys(promptData).forEach(cat => {
            const isFolded = foldedCats.includes(cat);
            const catWrap = document.createElement('div');
            catWrap.className = 'pm-cat-wrap';

            const header = document.createElement('div');
            header.className = 'pm-cat-header';
            setHTML(header, `
                <span class="pm-cat-fold-icon" style="transform: ${isFolded ? 'rotate(-90deg)' : 'rotate(0deg)'}">▼</span>
                <span class="pm-cat-name">${cat}</span>
                ${isEditMode ? `<div class="pm-cat-tools"><span class="pm-ed-cat" data-cat="${cat}">✏️</span><span class="pm-del-cat" data-cat="${cat}">×</span></div>` : ''}
            `);
            header.onclick = (e) => {
                if (e.target.closest('.pm-cat-tools')) return;
                foldedCats = isFolded ? foldedCats.filter(c => c !== cat) : [...foldedCats, cat];
                GM_setValue(FOLD_KEY, foldedCats); renderUI();
            };
            if (isEditMode) {
                header.querySelector('.pm-ed-cat').onclick = () => editCatName(catWrap, cat);
                header.querySelector('.pm-del-cat').onclick = () => deleteCat(cat);
            }
            catWrap.appendChild(header);

            const tplList = document.createElement('div');
            tplList.className = `pm-tpl-list ${isFolded ? 'folded' : ''}`;

            promptData[cat].forEach((item, idx) => {
                const itemWrap = document.createElement('div');
                itemWrap.className = 'pm-item-wrap';
                const btn = document.createElement('button');
                btn.className = 'pm-btn';
                btn.innerText = item.name;

                btn.onmouseenter = (e) => {
                    if (isEditMode) return;
                    const rect = btn.getBoundingClientRect();
                    setHTML(previewFloat, `<div style="font-weight: 600; color: #1a73e8; margin-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 4px;">${item.name}</div>${(item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content).replace(/\n/g, '<br>')}`);
                    previewFloat.style.display = 'block'; previewFloat.classList.add('show');
                    let topPos = rect.top + window.scrollY, leftPos = rect.right + 15;
                    if (leftPos + previewFloat.offsetWidth > window.innerWidth) leftPos = rect.left - previewFloat.offsetWidth - 15;
                    if (topPos + previewFloat.offsetHeight > window.innerHeight + window.scrollY) topPos = rect.bottom - previewFloat.offsetHeight + window.scrollY;
                    previewFloat.style.top = `${topPos}px`; previewFloat.style.left = `${leftPos}px`;
                };
                btn.onmouseleave = () => { previewFloat.classList.remove('show'); setTimeout(() => { previewFloat.style.display = 'none'; }, 150); };

                btn.onclick = () => {
                    if (isEditMode) editTpl(itemWrap, cat, idx);
                    else { stableInject(item.content); previewFloat.style.display = 'none'; }
                };
                itemWrap.appendChild(btn); tplList.appendChild(itemWrap);
            });

            if (isEditMode) {
                const addTplBtn = document.createElement('button');
                addTplBtn.className = 'pm-btn'; addTplBtn.style.border = "1px dashed #ccc"; addTplBtn.innerText = "+ 新模板";
                addTplBtn.onclick = () => editTpl(tplList, cat, -1, addTplBtn);
                tplList.appendChild(addTplBtn);
            }
            catWrap.appendChild(tplList); container.appendChild(catWrap);
        });

        document.getElementById('pm-config-btn').onclick = () => { isEditMode = !isEditMode; renderUI(); };
        document.getElementById('pm-switch-fill').onclick = () => { appendMode = !appendMode; GM_setValue('pm_append_mode', appendMode); renderUI(); };
        document.getElementById('pm-switch-storage').onclick = async () => {
            if (isLoading) return;
            const targetMode = currentMode === 'local' ? '☁️ 云端' : '🏠 本地';
            if (confirm(`确认切换至 [${targetMode}] 模式？`)) {
                currentMode = currentMode === 'local' ? 'cloud' : 'local';
                GM_setValue(MODE_KEY, currentMode);
                await DataManager.load();
            }
        };
        document.getElementById('pm-export-btn').onclick = IOTools.exportJSON;
        document.getElementById('pm-import-btn').onclick = IOTools.importJSON;
        if (isEditMode) {
            document.getElementById('pm-new-cat').onclick = () => {
                const n = prompt("请输入新分类名称:");
                if (n) { promptData[n] = []; DataManager.save(); }
            };
        }
    }

    // ======= 6. 辅助编辑逻辑 =======
    function editCatName(wrap, oldName) {
        const header = wrap.querySelector('.pm-cat-header'); header.style.display = 'none';
        const editor = document.createElement('div'); editor.className = 'pm-inline-editor';
        setHTML(editor, `<input type="text" id="new-cat-inp" value="${oldName}"><div class="pm-ed-btns"><button class="pm-ebtn pm-cancel">取消</button><button class="pm-ebtn pm-save">保存</button></div>`);
        wrap.prepend(editor);
        editor.querySelector('.pm-cancel').onclick = () => renderUI();
        editor.querySelector('.pm-save').onclick = () => {
            const n = editor.querySelector('#new-cat-inp').value.trim();
            if (n && n !== oldName) { promptData[n] = promptData[oldName]; delete promptData[oldName]; DataManager.save(); } else renderUI();
        };
    }

    function deleteCat(catName) {
        if (!confirm(`确定删除分类 [${catName}] 吗？`)) return;
        delete promptData[catName]; DataManager.save();
    }

    function editTpl(container, cat, idx, addBtn = null) {
        const isNew = idx === -1;
        const item = isNew ? { name: "", content: "" } : promptData[cat][idx];
        const editor = document.createElement('div'); editor.className = 'pm-inline-editor';
        let cats = Object.keys(promptData).map(c => `<option value="${c}" ${c === cat ? 'selected' : ''}>${c}</option>`).join('');

        setHTML(editor, `
            <input type="text" id="ed-name" placeholder="模板名称" value="${item.name}">
            <select id="ed-cat">${cats}</select>
            <textarea id="ed-cont" placeholder="提示词内容...">${item.content}</textarea>
            <div class="pm-ed-btns">
                ${!isNew ? '<button class="pm-ebtn pm-del">🗑️ 删除</button>' : ''}
                <button class="pm-ebtn pm-cancel">取消</button>
                <button class="pm-ebtn pm-save">保存</button>
            </div>
        `);

        if (!isNew) container.querySelector('.pm-btn').style.display = 'none';
        if (addBtn) addBtn.style.display = 'none';
        container.appendChild(editor);

        editor.querySelector('.pm-cancel').onclick = () => renderUI();
        if (!isNew) {
            editor.querySelector('.pm-del').onclick = () => {
                if (confirm('确定要删除这个模板吗？')) {
                    promptData[cat].splice(idx, 1);
                    DataManager.save();
                }
            };
        }
        editor.querySelector('.pm-save').onclick = () => {
            const n = editor.querySelector('#ed-name').value.trim();
            const c = editor.querySelector('#ed-cont').value;
            const tCat = editor.querySelector('#ed-cat').value;
            if (!n || !c) return toast("❌ 名称和内容不能为空");
            if (!isNew) promptData[cat].splice(idx, 1);
            promptData[tCat].push({ name: n, content: c });
            DataManager.save();
        };
    }

    // ======= 7. 启动初始化 =======
    const init = async () => {
        if (!document.getElementById('pm-root')) { renderUI(); await DataManager.load(); }
    };
    const observer = new MutationObserver(() => { if (!document.getElementById('pm-root')) renderUI(); });
    const startObserver = () => {
        if (document.body) { observer.observe(document.body, { childList: true, subtree: false }); init(); }
        else setTimeout(startObserver, 100);
    };
    startObserver();
    setInterval(() => { if (document.body && !document.getElementById('pm-root')) renderUI(); }, 2000);
})();