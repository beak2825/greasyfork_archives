// ==UserScript==
// @name         Abceed Web 翻译助手
// @name:en      Abceed Web Translator
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动翻译 abceed 网页中的英文例句。定制：只有在日文解释出现时才翻译，并插入到日文解释上方。
// @description:en Automatically translates English sentence examples on abceed.com. Custom logic: Translation appears above the Japanese commentary.
// @author       MAI XIANG & Gemini
// @match        https://app.abceed.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      openrouter.ai
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556976/Abceed%20Web%20%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556976/Abceed%20Web%20%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 选择器定义 (关键修改) =================

    // --- 场景 A: 普通填空题 (旧逻辑保持不变) ---
    const TARGET_REMOTE = '.commentary-area__paragraph'; // 日文解释区
    const SOURCE_REMOTE = '.word-test-header_paragraph'; // 顶部英文

    // --- 场景 B: 原始词汇 (Original Vocab) ---
    // 触发器 & 插入目标：日文解释例句
    const TARGET_VOCAB_COMMENTARY = '.commentary_paragraph.example';
    // 翻译源：顶部英文例句
    const SOURCE_VOCAB_HEADER = '.original-vocab-header_paragraph.example';

    // --- 场景 C: 直接翻译自身 (问题 / 选项) ---
    const TARGET_DIRECT_QUESTION = '.marksheet-answer__question';
    const TARGET_ANSWER_BODY = '.marksheet-answer-body';

    // 汇总监听列表
    const ALL_TARGETS_SELECTOR = `${TARGET_REMOTE}, ${TARGET_VOCAB_COMMENTARY}, ${TARGET_DIRECT_QUESTION}, ${TARGET_ANSWER_BODY}`;

    const PRESET_FONTS = {
        "system": { name: "系统默认 (推荐)", value: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
        "macos": { name: "MacOS 苹方 (PingFang SC)", value: '"PingFang SC", "Hiragino Sans GB", sans-serif' },
        "windows": { name: "Windows 微软雅黑", value: '"Microsoft YaHei", "SimHei", sans-serif' },
        "serif": { name: "宋体/衬线 (Serif)", value: '"Songti SC", "SimSun", "Times New Roman", serif' }
    };

    const DEFAULT_CONFIG = {
        enabled: true,
        showFloatingBtn: true,
        apiKey: "",
        model: "google/gemini-2.0-flash-001",
        systemPrompt: "你是一个专业的翻译助手。请将用户提供的英语句子翻译成地道的简体中文。要求：1. 仅输出译文。2. 语气自然流畅。3. 不要包含任何原文或拼音。",
        displayMode: "always",
        style: {
            fontSize: "14px",
            color: "#6B7280",
            fontWeight: "400",
            fontFamilyType: "system",
            customFontFamily: ""
        }
    };

    let config = { ...DEFAULT_CONFIG, ...GM_getValue('user_config', {}) };
    if(!config.style.fontFamilyType) config.style.fontFamilyType = "system";

    const translationCache = new Map();
    let observer = null;
    let debounceTimer = null;

    // ================= CSS 样式系统 =================
    function injectGlobalStyles() {
        let targetFont = PRESET_FONTS[config.style.fontFamilyType] ? PRESET_FONTS[config.style.fontFamilyType].value : PRESET_FONTS["system"].value;
        if (config.style.fontFamilyType === 'custom' && config.style.customFontFamily) {
            targetFont = config.style.customFontFamily;
        }

        const css = `
            :root {
                --ab-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                --trans-font-size: ${config.style.fontSize};
                --trans-color: ${config.style.color};
                --trans-weight: ${config.style.fontWeight};
                --trans-font-family: ${targetFont};
            }
            .abceed-cn-trans {
                display: block;
                margin-top: 4px; margin-bottom: 8px; /* 调整间距，使其在日文上方更自然 */
                padding-top: 4px;
                border-top: 1px dashed rgba(0,0,0,0.08);
                font-size: var(--trans-font-size); color: var(--trans-color); font-weight: var(--trans-weight); font-family: var(--trans-font-family);
                line-height: 1.5; text-align: left; transition: all 0.3s ease; font-variant-east-asian: normal; width: 100%;
            }
            .marksheet-answer-body .abceed-cn-trans { margin-top: 4px; padding-left: 20px; font-size: calc(var(--trans-font-size) * 0.95); }
            .abceed-cn-trans.blur-mode { filter: blur(6px); opacity: 0.5; cursor: help; user-select: none; }
            .abceed-cn-trans.blur-mode:hover { filter: none; opacity: 1; user-select: text; }

            /* 悬浮按钮 */
            #ab-floating-gear {
                position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px;
                background: rgba(255, 255, 255, 0.9); border: 1px solid #E5E7EB; border-radius: 50%;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;
                cursor: pointer; z-index: 9999; font-size: 20px; color: #4B5563; opacity: 0.6; transition: transform 0.2s, opacity 0.2s;
            }
            #ab-floating-gear:hover { opacity: 1; transform: scale(1.1); }
            @media (max-width: 480px) { #ab-floating-gear { bottom: 80px; right: 15px; width: 36px; height: 36px; } }

            /* 设置面板 */
            #ab-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2147483647; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; }
            #ab-settings-panel { background: #fff; width: 500px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; border-radius: 16px; box-shadow: var(--ab-shadow); font-family: -apple-system, sans-serif; color: #374151; animation: abZoomIn 0.2s; }
            .ab-panel-header { flex: 0 0 auto; padding: 16px 20px; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 16px; border-top-right-radius: 16px; }
            .ab-panel-title { margin:0; font-size:16px; font-weight:600; color:#111; }
            .ab-panel-close { cursor: pointer; color: #9CA3AF; padding: 8px; font-size: 18px; line-height: 1; }
            .ab-panel-body { flex: 1 1 auto; padding: 20px; overflow-y: auto; -webkit-overflow-scrolling: touch; min-height: 0; }
            .ab-panel-footer { flex: 0 0 auto; padding: 16px 20px; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 12px; background: #fff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; padding-bottom: env(safe-area-inset-bottom, 16px); }
            .ab-form-group { margin-bottom: 20px; text-align: left; }
            .ab-label { display: block; font-size: 13px; font-weight: 600; color: #4B5563; margin-bottom: 8px; }
            .ab-input, .ab-select, .ab-textarea { width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: #fff; color: #1F2937; font-family: inherit; -webkit-appearance: none; }
            .ab-textarea { resize: vertical; min-height: 80px; }
            .ab-row { display: flex; gap: 12px; } .ab-col { flex: 1; }
            .ab-btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; }
            .ab-btn-save { background: #111; color: white; }
            .ab-btn-cancel { background: #F3F4F6; color: #374151; }
            @media (max-width: 480px) {
                #ab-settings-overlay { padding: 0; align-items: flex-end; }
                #ab-settings-panel { width: 100%; max-height: 85vh; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
                .ab-row { flex-direction: column; gap: 16px; }
                .ab-col { width: 100%; flex: none; }
                #ab-color { height: 44px; }
            }
            @keyframes abZoomIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `;
        const oldStyle = document.getElementById('abceed-pro-style');
        if (oldStyle) oldStyle.remove();
        const styleEl = document.createElement('style');
        styleEl.id = 'abceed-pro-style';
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    // ================= 悬浮按钮 & 设置面板 =================
    function createFloatingButton() {
        if (!config.showFloatingBtn) return;
        if (document.getElementById('ab-floating-gear')) return;
        const btn = document.createElement('div');
        btn.id = 'ab-floating-gear'; btn.innerHTML = '⚙️'; btn.onclick = showSettingsPanel;
        document.body.appendChild(btn);
    }

    function showSettingsPanel() {
        if (document.getElementById('ab-settings-overlay')) return;
        let fontOptions = '';
        for (const [key, val] of Object.entries(PRESET_FONTS)) fontOptions += `<option value="${key}" ${config.style.fontFamilyType === key ? 'selected' : ''}>${val.name}</option>`;
        fontOptions += `<option value="custom" ${config.style.fontFamilyType === 'custom' ? 'selected' : ''}>自定义字体...</option>`;

        const html = `
            <div id="ab-settings-panel">
                <div class="ab-panel-header">
                    <h3 class="ab-panel-title">翻译插件配置 (v4.6)</h3>
                    <div class="ab-panel-close" id="ab-close">✕</div>
                </div>
                <div class="ab-panel-body">
                    <div class="ab-form-group" style="display:flex; align-items:center; gap:10px; padding: 4px 0;">
                        <input type="checkbox" id="ab-enabled" style="width:20px; height:20px;" ${config.enabled ? 'checked' : ''}>
                        <label for="ab-enabled" style="font-weight:600; font-size:15px; color:#111;">启用自动翻译</label>
                    </div>
                    <div class="ab-form-group" style="display:flex; align-items:center; gap:10px; padding: 4px 0;">
                        <input type="checkbox" id="ab-show-float" style="width:20px; height:20px;" ${config.showFloatingBtn ? 'checked' : ''}>
                        <label for="ab-show-float" style="font-weight:600; font-size:15px; color:#111;">显示悬浮设置按钮</label>
                    </div>
                    <div class="ab-form-group"><label class="ab-label">OpenRouter API Key</label><input type="password" id="ab-key" class="ab-input" value="${config.apiKey}" placeholder="sk-or-..." autocomplete="off"></div>
                    <div class="ab-row">
                        <div class="ab-col"><div class="ab-form-group"><label class="ab-label">模型 (Model ID)</label><input type="text" id="ab-model" class="ab-input" value="${config.model}"></div></div>
                        <div class="ab-col"><div class="ab-form-group"><label class="ab-label">显示模式</label><select id="ab-mode" class="ab-select"><option value="always" ${config.displayMode === 'always' ? 'selected' : ''}>始终显示</option><option value="hover" ${config.displayMode === 'hover' ? 'selected' : ''}>模糊防剧透</option></select></div></div>
                    </div>
                    <div class="ab-form-group"><label class="ab-label">系统提示词 (Prompt)</label><textarea id="ab-prompt" class="ab-textarea">${config.systemPrompt || ''}</textarea></div>
                    <hr style="border:0; border-top:1px solid #E5E7EB; margin:10px 0 20px;">
                    <label class="ab-label" style="color:#111; margin-bottom:12px;">排版样式</label>
                    <div class="ab-form-group"><select id="ab-font-type" class="ab-select">${fontOptions}</select><input id="ab-font-custom" class="ab-input" style="margin-top:8px; display:${config.style.fontFamilyType === 'custom'?'block':'none'}" value="${config.style.customFontFamily}" placeholder="例如: 'PingFang SC'"></div>
                    <div class="ab-row">
                        <div class="ab-col"><label class="ab-label">字号</label><input type="text" id="ab-size" class="ab-input" value="${config.style.fontSize}" placeholder="14px"></div>
                        <div class="ab-col"><label class="ab-label">字重</label><select id="ab-weight" class="ab-select"><option value="300" ${config.style.fontWeight === '300' ? 'selected' : ''}>细</option><option value="400" ${config.style.fontWeight === '400' ? 'selected' : ''}>常规</option><option value="500" ${config.style.fontWeight === '500' ? 'selected' : ''}>中</option><option value="600" ${config.style.fontWeight === '600' ? 'selected' : ''}>粗</option></select></div>
                        <div class="ab-col ab-col-color"><label class="ab-label">颜色</label><input type="color" id="ab-color" style="width:100%; height:42px; padding:2px; border:1px solid #ddd; border-radius:8px; background:#fff;" value="${config.style.color}"></div>
                    </div>
                </div>
                <div class="ab-panel-footer"><button class="ab-btn ab-btn-cancel" id="ab-btn-cancel">取消</button><button class="ab-btn ab-btn-save" id="ab-btn-save">保存</button></div>
            </div>
        `;
        const overlay = document.createElement('div'); overlay.id = 'ab-settings-overlay'; overlay.innerHTML = html; document.body.appendChild(overlay);
        const close = () => overlay.remove();
        document.getElementById('ab-close').onclick = close; document.getElementById('ab-btn-cancel').onclick = close;
        document.getElementById('ab-font-type').onchange = (e) => { document.getElementById('ab-font-custom').style.display = e.target.value === 'custom' ? 'block' : 'none'; };
        document.getElementById('ab-btn-save').onclick = () => {
            config.enabled = document.getElementById('ab-enabled').checked;
            config.showFloatingBtn = document.getElementById('ab-show-float').checked;
            config.apiKey = document.getElementById('ab-key').value.trim();
            config.model = document.getElementById('ab-model').value.trim();
            config.systemPrompt = document.getElementById('ab-prompt').value.trim();
            config.displayMode = document.getElementById('ab-mode').value;
            config.style.fontFamilyType = document.getElementById('ab-font-type').value;
            config.style.customFontFamily = document.getElementById('ab-font-custom').value.trim();
            config.style.fontSize = document.getElementById('ab-size').value.trim();
            config.style.fontWeight = document.getElementById('ab-weight').value;
            config.style.color = document.getElementById('ab-color').value;
            GM_setValue('user_config', config); injectGlobalStyles(); applyDisplayModeClass();
            config.showFloatingBtn ? createFloatingButton() : (document.getElementById('ab-floating-gear') && document.getElementById('ab-floating-gear').remove());
            if(!config.enabled) { document.querySelectorAll('.abceed-cn-trans').forEach(el => el.style.display = 'none'); }
            else { document.querySelectorAll('.abceed-cn-trans').forEach(el => el.style.display = 'block'); scanPage(); }
            close();
        };
    }
    if (typeof GM_registerMenuCommand !== 'undefined') GM_registerMenuCommand("⚙️ 翻译插件设置", showSettingsPanel);

    // ================= 核心业务逻辑 =================

    function getCleanText(node) {
        if (!node) return "";
        const clone = node.cloneNode(true);
        const transDiv = clone.querySelector('.abceed-cn-trans');
        if (transDiv) transDiv.remove();
        return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    function translateText(text, callback) {
        if (!config.apiKey) return;
        if (translationCache.has(text)) {
            callback(translationCache.get(text));
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://openrouter.ai/api/v1/chat/completions",
            headers: { "Authorization": `Bearer ${config.apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://app.abceed.com/", "X-Title": "Abceed Translator" },
            data: JSON.stringify({ "model": config.model, "messages": [ {"role": "system", "content": config.systemPrompt}, {"role": "user", "content": text} ] }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.choices && data.choices.length > 0) {
                        const result = data.choices[0].message.content.trim();
                        translationCache.set(text, result);
                        callback(result);
                    }
                } catch (e) { console.error(e); }
            }
        });
    }

    function applyDisplayModeClass() {
        document.querySelectorAll('.abceed-cn-trans').forEach(el => {
            config.displayMode === 'hover' ? el.classList.add('blur-mode') : el.classList.remove('blur-mode');
        });
    }

    // 通用处理：manageType: 'append' (插入到底部) | 'prepend' (插入到顶部/前面)
    function updateTranslation(targetNode, cleanText, manageType = 'append') {
        if (!cleanText) return;

        // 查找是否已存在翻译框（查找范围：目标节点内部，或者目标节点的前一个兄弟）
        let transDiv;
        if (manageType === 'prepend') {
            // 如果是 prepend 模式，翻译框应该是 targetNode 的前一个兄弟节点
            const prev = targetNode.previousElementSibling;
            if (prev && prev.classList.contains('abceed-cn-trans')) {
                transDiv = prev;
            }
        } else {
            transDiv = targetNode.querySelector('.abceed-cn-trans');
        }

        // 检查更新
        if (transDiv) {
            const lastText = transDiv.getAttribute('data-source-hash');
            if (lastText === cleanText) return;
            transDiv.innerText = 'Updating...';
            transDiv.setAttribute('data-source-hash', cleanText);
        } else {
            // 创建新翻译框
            transDiv = document.createElement('div');
            transDiv.className = 'abceed-cn-trans';
            transDiv.setAttribute('lang', 'zh-CN');
            transDiv.setAttribute('data-source-hash', cleanText);
            if (config.displayMode === 'hover') transDiv.classList.add('blur-mode');
            transDiv.innerText = 'Trans...';

            // 插入逻辑
            if (manageType === 'prepend') {
                // 插入到 targetNode 之前
                targetNode.parentNode.insertBefore(transDiv, targetNode);
            } else {
                // 插入到 targetNode 内部最末尾
                targetNode.appendChild(transDiv);
            }
        }

        translateText(cleanText, (res) => {
            transDiv.innerText = res;
        });
    }

    function processNode(node) {
        if (!config.enabled) return;

        // --- 场景 A: 普通填空题 (Append) ---
        if (node.matches(TARGET_REMOTE)) {
            const sourceNode = document.querySelector(SOURCE_REMOTE);
            if (sourceNode) {
                const cleanText = getCleanText(sourceNode);
                updateTranslation(node, cleanText, 'append');
            }
        }

        // --- 场景 B: Original Vocab 模式 (Prepend) ---
        // 只有当日文解释 (TARGET_VOCAB_COMMENTARY) 出现时，才触发
        else if (node.matches(TARGET_VOCAB_COMMENTARY)) {
            const sourceNode = document.querySelector(SOURCE_VOCAB_HEADER);
            if (sourceNode) {
                const cleanText = getCleanText(sourceNode);
                // 关键：插入到日文解释的上方 (Prepend)
                updateTranslation(node, cleanText, 'prepend');
            }
        }

        // --- 场景 C: 直接翻译 (Append) ---
        else if (node.matches(TARGET_DIRECT_QUESTION)) {
            const cleanText = getCleanText(node);
            updateTranslation(node, cleanText, 'append');
        }
        else if (node.matches(TARGET_ANSWER_BODY)) {
            const bodyNode = node.querySelector('.marksheet-answer-body__body');
            if (bodyNode) {
                const cleanText = getCleanText(bodyNode);
                updateTranslation(node, cleanText, 'append');
            }
        }
    }

    function scanPage() {
        const targets = document.querySelectorAll(ALL_TARGETS_SELECTOR);
        targets.forEach(processNode);
    }

    const observerCallback = (mutationsList) => {
        if (config.showFloatingBtn && !document.getElementById('ab-floating-gear')) createFloatingButton();
        if (!config.enabled) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            scanPage();
        }, 100);
    };

    function init() {
        injectGlobalStyles();
        if (!config.apiKey) showSettingsPanel();
        else if (config.showFloatingBtn) createFloatingButton();

        const body = document.querySelector('body');
        if (body) {
            observer = new MutationObserver(observerCallback);
            observer.observe(body, { childList: true, subtree: true, characterData: true });
            scanPage();
        } else {
            setTimeout(init, 500);
        }
    }

    init();
})();