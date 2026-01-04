// ==UserScript==
// @name         Folo 网站增强工具 (v10.0 自动重置版)
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Folo 增强：自动检测文章切换并重置 AI 总结 + 精准提取正文 + 多配置管理
// @author       Your Name & Gemini
// @match        https://app.folo.is/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556732/Folo%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%20%28v100%20%E8%87%AA%E5%8A%A8%E9%87%8D%E7%BD%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556732/Folo%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%20%28v100%20%E8%87%AA%E5%8A%A8%E9%87%8D%E7%BD%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 Folo 增强脚本 v10.0 (自动重置版) 已启动");

    // ==================== 1. 核心工具函数 ====================

    function normalizeApiUrl(url) {
        if (!url) return "";
        let cleanUrl = url.trim();
        if (cleanUrl.endsWith('#')) return cleanUrl.slice(0, -1);
        if (cleanUrl.includes('/chat/completions')) return cleanUrl;
        if (cleanUrl.endsWith('/')) return cleanUrl + 'chat/completions';
        return cleanUrl + '/v1/chat/completions';
    }

    function getModelsUrl(chatUrl) {
        return chatUrl.replace(/\/chat\/completions$/, '/models');
    }

    // ★ 精准提取并清洗正文 ★
    function getCleanArticleText(articleNode) {
        if (!articleNode) return "";
        const clone = articleNode.cloneNode(true);

        // 移除脚本注入的元素
        clone.querySelectorAll('.custom-copy-btn, #my-custom-ai-wrapper').forEach(el => el.remove());
        // 移除 Folo 广告按钮
        clone.querySelectorAll('button').forEach(el => el.remove());

        // 清洗“阅读完整话题”
        clone.querySelectorAll('a').forEach(a => {
            if (a.innerText.includes("阅读完整话题")) {
                if (a.parentElement && a.parentElement.tagName === 'P') a.parentElement.remove();
                else a.remove();
            }
        });

        // 清洗“X 个帖子”元数据
        const metaRegex = /^\s*\d+\s*个帖子\s*[\-—]\s*\d+\s*位参与者/i;
        clone.querySelectorAll('p').forEach(p => {
            if (metaRegex.test(p.innerText)) p.remove();
        });

        return clone.innerText.trim();
    }

    // ==================== 2. 配置管理系统 ====================
    const DEFAULT_PROFILE = {
        id: "default",
        name: "默认配置",
        apiUrl: "https://api.openai.com",
        apiKey: "",
        model: "gpt-3.5-turbo",
        prompt: "请简要总结以下文章内容，提取 3-5 个核心观点，使用中文回答："
    };

    function getProfiles() {
        let profiles = GM_getValue("ai_profiles", []);
        if (!profiles || profiles.length === 0) {
            profiles = [DEFAULT_PROFILE];
            GM_setValue("ai_profiles", profiles);
        }
        return profiles;
    }
    function getCurrentProfileId() { return GM_getValue("ai_current_profile_id", "default"); }
    function getActiveConfig() {
        const profiles = getProfiles();
        const currentId = getCurrentProfileId();
        return profiles.find(p => p.id === currentId) || profiles[0];
    }
    function saveProfiles(profiles, activeId) {
        GM_setValue("ai_profiles", profiles);
        if (activeId) GM_setValue("ai_current_profile_id", activeId);
    }
    GM_registerMenuCommand("⚙️ 设置 AI API", showSettingsModal);

    // ==================== 3. 样式注入 ====================
    GM_addStyle(`
        article[data-testid="entry-render"], #follow-entry-render { user-select: text !important; -webkit-user-select: text !important; }
        .folo-native-ai-hidden { display: none !important; }

        /* 复制按钮 */
        .custom-copy-btn {
            position: absolute !important; top: 0px; right: 0px; z-index: 50;
            padding: 4px 10px !important; background: rgba(59, 130, 246, 0.9); color: white;
            border: none; border-radius: 0 0 0 8px; cursor: pointer; font-size: 12px; opacity: 0.6;
        }
        .custom-copy-btn:hover { opacity: 1; }

        /* AI 总结框 */
        #my-custom-ai-wrapper { margin: 1.5rem 0; width: 100%; position: relative; z-index: 10; animation: fadeIn 0.4s ease; transition: all 0.3s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        .my-ai-box {
            padding: 1rem; border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3);
            background: linear-gradient(135deg, rgba(239, 246, 255, 0.8) 0%, rgba(250, 245, 255, 0.8) 100%);
            backdrop-filter: blur(8px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); color: #1f2937;
        }
        .dark .my-ai-box {
            background: linear-gradient(135deg, rgba(30, 20, 60, 0.7) 0%, rgba(20, 30, 60, 0.7) 100%);
            border-color: rgba(139, 92, 246, 0.4); color: #e5e7eb;
        }
        .my-ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .my-ai-title { font-weight: 700; font-size: 0.95rem; background: linear-gradient(to right, #7c3aed, #2563eb); -webkit-background-clip: text; color: transparent; }
        .my-ai-btn { background: linear-gradient(to right, #7c3aed, #2563eb); color: white; border: none; padding: 5px 14px; border-radius: 99px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }
        .my-ai-btn:disabled { background: #999; cursor: not-allowed; }
        .my-ai-setting-icon { cursor: pointer; color: #7c3aed; font-size: 1.1rem; opacity: 0.7; margin-left: 10px; }
        .my-ai-content { font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap; padding-top: 0.8rem; border-top: 1px dashed rgba(139, 92, 246, 0.3); margin-top: 8px; }

        /* 弹窗样式 */
        #my-config-modal { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; }
        .my-modal-content { background: white; width: 90%; max-width: 500px; border-radius: 12px; padding: 20px; max-height: 90vh; overflow-y: auto; }
        .dark .my-modal-content { background: #1e1e2e; color: #eee; border: 1px solid #444; }
        .my-modal-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: bold; }
        .profile-row { display: flex; gap: 8px; margin-bottom: 15px; }
        .profile-select { flex: 1; padding: 6px; border-radius: 4px; }
        .profile-btn { padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #f3f4f6; }
        .dark .profile-select, .dark .profile-btn { background: #2a2a3c; border-color: #555; color: white; }
        .my-input-group { margin-bottom: 12px; }
        .my-input-label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; font-weight: bold; }
        .dark .my-input-label { color: #aaa; }
        .my-input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .dark .my-input { background: #2a2a3c; border-color: #555; color: #fff; }
        .password-wrapper { position: relative; display: flex; align-items: center; }
        .password-wrapper input { padding-right: 60px; }
        .pw-actions { position: absolute; right: 5px; display: flex; gap: 4px; cursor: pointer; }
        .btn-tool { padding: 8px; background: #e9ecef; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; }
        .dark .btn-tool { background: #3a3a4c; border-color: #555; color: #eee; }
        .my-modal-actions { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
        .btn-test { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .btn-save { background: #7c3aed; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .btn-cancel { background: transparent; border: 1px solid #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; color: #666; }
        datalist { display: none; }
    `);

    // ==================== 4. 界面逻辑 (设置弹窗) ====================
    function showSettingsModal() {
        let modal = document.getElementById('my-config-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'my-config-modal';
            modal.innerHTML = `
                <div class="my-modal-content">
                    <div class="my-modal-header"><span>⚙️ AI API 配置</span><button id="modal-close-x" style="background:none;border:none;cursor:pointer;">✕</button></div>
                    <div class="profile-row"><select id="profile-select" class="profile-select"></select><button id="btn-add-profile" class="profile-btn">➕</button><button id="btn-del-profile" class="profile-btn">🗑️</button></div>
                    <div class="my-input-group"><label class="my-input-label">配置名称</label><input id="cfg-name" class="my-input"></div>
                    <div class="my-input-group"><label class="my-input-label">API 地址</label><input id="cfg-url" class="my-input" placeholder="https://api.openai.com"></div>
                    <div class="my-input-group"><label class="my-input-label">API Key</label><div class="password-wrapper"><input id="cfg-key" class="my-input" type="password"><div class="pw-actions"><span id="btn-toggle-pw">👁️</span><span id="btn-copy-pw">📋</span></div></div></div>
                    <div class="my-input-group"><label class="my-input-label">Model</label><div style="display:flex;gap:8px"><input id="cfg-model" class="my-input" list="model-list"><button id="btn-fetch-models" class="btn-tool">🔄 获取模型</button></div><datalist id="model-list"></datalist></div>
                    <div class="my-input-group"><label class="my-input-label">System Prompt</label><textarea id="cfg-prompt" class="my-input" rows="3"></textarea></div>
                    <div class="my-modal-actions"><button id="btn-test-conn" class="btn-test">⚡ 测试连接</button><div style="display:flex;gap:10px"><button id="my-btn-cancel" class="btn-cancel">取消</button><button id="my-btn-save" class="btn-save">保存</button></div></div>
                </div>`;
            document.body.appendChild(modal);
            bindModalEvents(modal);
        }
        renderProfiles(document.getElementById('profile-select'));
        loadFormData(getActiveConfig());
        modal.style.display = 'flex';
    }

    function renderProfiles(selectEl) {
        const profiles = getProfiles();
        const currentId = getCurrentProfileId();
        selectEl.innerHTML = "";
        profiles.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.text = p.name;
            if (p.id === currentId) opt.selected = true;
            selectEl.appendChild(opt);
        });
    }

    function loadFormData(config) {
        document.getElementById('cfg-name').value = config.name;
        document.getElementById('cfg-url').value = config.apiUrl;
        document.getElementById('cfg-key').value = config.apiKey;
        document.getElementById('cfg-model').value = config.model;
        document.getElementById('cfg-prompt').value = config.prompt;
    }

    function getFormDataFromUI(id) {
        return {
            id: id,
            name: document.getElementById('cfg-name').value,
            apiUrl: document.getElementById('cfg-url').value.trim(),
            apiKey: document.getElementById('cfg-key').value.trim(),
            model: document.getElementById('cfg-model').value.trim(),
            prompt: document.getElementById('cfg-prompt').value.trim()
        };
    }

    function bindModalEvents(modal) {
        const select = document.getElementById('profile-select');
        select.onchange = () => { saveCurrentToMemory(); GM_setValue("ai_current_profile_id", select.value); loadFormData(getActiveConfig()); };
        document.getElementById('btn-add-profile').onclick = () => {
            const name = prompt("新配置名称:", "DeepSeek");
            if (name) {
                const profiles = getProfiles();
                const newId = Date.now().toString();
                profiles.push({ ...DEFAULT_PROFILE, id: newId, name: name });
                saveProfiles(profiles, newId);
                renderProfiles(select);
                loadFormData(getActiveConfig());
            }
        };
        document.getElementById('btn-del-profile').onclick = () => {
            let profiles = getProfiles();
            if (profiles.length <= 1) return alert("至少保留一个");
            if (confirm("删除当前配置？")) {
                profiles = profiles.filter(p => p.id !== select.value);
                saveProfiles(profiles, profiles[0].id);
                renderProfiles(select);
                loadFormData(getActiveConfig());
            }
        };
        const keyInput = document.getElementById('cfg-key');
        document.getElementById('btn-toggle-pw').onclick = () => keyInput.type = keyInput.type === "password" ? "text" : "password";
        document.getElementById('btn-copy-pw').onclick = () => { GM_setClipboard(keyInput.value); alert("Key 已复制"); };

        document.getElementById('btn-fetch-models').onclick = () => {
            const rawUrl = document.getElementById('cfg-url').value.trim();
            const apiKey = document.getElementById('cfg-key').value.trim();
            if (!rawUrl || !apiKey) return alert("请先填写 URL 和 Key");
            const btn = document.getElementById('btn-fetch-models');
            btn.innerText = "..."; btn.disabled = true;
            GM_xmlhttpRequest({
                method: "GET", url: getModelsUrl(normalizeApiUrl(rawUrl)), headers: { "Authorization": "Bearer " + apiKey },
                onload: (res) => {
                    btn.innerText = "🔄 获取模型"; btn.disabled = false;
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.data && Array.isArray(data.data)) {
                            const list = document.getElementById('model-list');
                            list.innerHTML = "";
                            data.data.forEach(m => { const opt = document.createElement('option'); opt.value = m.id; list.appendChild(opt); });
                            alert(`获取成功: ${data.data.length} 个模型`);
                        } else alert("获取成功但格式不符");
                    } catch (e) { alert("返回非 JSON 数据"); }
                },
                onerror: () => { btn.innerText = "重试"; btn.disabled = false; alert("请求失败"); }
            });
        };

        document.getElementById('btn-test-conn').onclick = () => {
            const rawUrl = document.getElementById('cfg-url').value.trim();
            const apiKey = document.getElementById('cfg-key').value.trim();
            const model = document.getElementById('cfg-model').value.trim();
            const btn = document.getElementById('btn-test-conn');
            if (!rawUrl || !apiKey) return alert("请完善配置");
            const finalUrl = normalizeApiUrl(rawUrl);
            btn.innerText = "连接中...";
            GM_xmlhttpRequest({
                method: "POST", url: finalUrl, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                data: JSON.stringify({ model: model, messages: [{ role: "user", content: "Hi" }], max_tokens: 5 }),
                onload: (res) => {
                    btn.innerText = "⚡ 测试连接";
                    if (res.status === 200) alert("✅ 连接成功！"); else alert(`❌ 连接失败 (${res.status})\n${res.responseText.substring(0,100)}`);
                },
                onerror: () => { btn.innerText = "⚡ 测试连接"; alert("❌ 网络错误"); }
            });
        };

        document.getElementById('my-btn-save').onclick = () => { saveCurrentToMemory(); modal.style.display = 'none'; alert("已保存"); };
        document.getElementById('my-btn-cancel').onclick = () => modal.style.display = 'none';
        document.getElementById('modal-close-x').onclick = () => modal.style.display = 'none';
        function saveCurrentToMemory() {
            const currentId = select.value;
            let profiles = getProfiles();
            const idx = profiles.findIndex(p => p.id === currentId);
            if (idx !== -1) profiles[idx] = getFormDataFromUI(currentId);
            saveProfiles(profiles, currentId);
        }
    }

    // ==================== 5. AI 调用逻辑 ====================
    function callAI(title, text, btn, resultDiv) {
        const config = getActiveConfig();
        if (!config.apiKey) {
            resultDiv.style.display = 'block'; resultDiv.innerHTML = "⚠️ 请先配置 API Key";
            showSettingsModal(); return;
        }

        if (!text || text.length < 10) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `<span style="color:red">⚠️ 正文提取内容过少，可能未加载完成。</span>`;
            return;
        }

        const finalUrl = normalizeApiUrl(config.apiUrl);
        btn.disabled = true; btn.innerText = "生成中...";
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `正在读取文章... <span style="font-size:0.8em;color:#888">(${config.model})</span>`;

        const fullContent = `标题: ${title}\n\n正文内容:\n${text}`;

        GM_xmlhttpRequest({
            method: "POST", url: finalUrl, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + config.apiKey },
            data: JSON.stringify({
                model: config.model,
                messages: [
                    { role: "system", content: "You are a helpful assistant summarizing articles." },
                    { role: "user", content: config.prompt + "\n\n" + fullContent }
                ]
            }),
            onload: (res) => {
                btn.disabled = false; btn.innerText = "重新生成";
                if (res.responseText.trim().startsWith("<")) { resultDiv.innerHTML = `<span style="color:red">❌ URL 错误 (返回了 HTML)</span>`; return; }
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.error) resultDiv.innerHTML = `<span style="color:red">API Error: ${data.error.message}</span>`;
                    else resultDiv.innerText = data.choices?.[0]?.message?.content || "无内容";
                } catch(e) { resultDiv.innerText = "解析失败"; }
            },
            onerror: () => { btn.disabled = false; btn.innerText = "重试"; resultDiv.innerText = "网络错误"; }
        });
    }

    // ==================== 6. 页面注入逻辑 (核心自动重置) ====================

    // ★ 关键变更：监听 URL 变化并重置 ★
    function checkAndReset(wrapper) {
        const currentUrl = window.location.href;
        // 读取 wrapper 记录的上次 URL
        const savedUrl = wrapper.dataset.url;

        // 如果 URL 变了
        if (savedUrl && savedUrl !== currentUrl) {
            // console.log("检测到文章切换，重置 AI 框...");
            const contentDiv = wrapper.querySelector('.my-ai-content');
            const btn = wrapper.querySelector('.my-ai-btn');

            // 1. 清空内容
            contentDiv.style.display = 'none';
            contentDiv.innerText = '';
            // 2. 恢复按钮
            btn.disabled = false;
            btn.innerText = "点击生成摘要";
            // 3. 更新 URL 记录
            wrapper.dataset.url = currentUrl;
        } else if (!savedUrl) {
            // 初始化记录
            wrapper.dataset.url = currentUrl;
        }
    }

    function checkAndInject() {
        // 屏蔽原生
        document.querySelectorAll('button[title="Open AI Chat"]').forEach(b => b.style.display = 'none');

        // 查找文章
        let article = document.getElementById('follow-entry-render') || document.querySelector('article[data-testid="entry-render"]');
        if (!article) return;

        // 屏蔽原生 AI 框
        article.querySelectorAll('div').forEach(div => {
            if (div.innerText.includes("AI 总结") && !div.closest('#my-custom-ai-wrapper')) {
                const container = div.closest('.group.relative.overflow-hidden');
                if (container) container.classList.add('folo-native-ai-hidden');
            }
        });

        // 注入复制按钮
        if (!article.dataset.unlocked) {
            ['onselectstart', 'oncopy', 'oncut', 'onpaste'].forEach(e => article.removeAttribute(e));
            article.classList.remove('select-none', 'no-select');
            if (!article.querySelector('.custom-copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'custom-copy-btn';
                btn.innerText = 'Copy';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const cleanText = getCleanArticleText(article);
                    GM_setClipboard(cleanText);
                    btn.innerText = "OK"; setTimeout(()=>btn.innerText="Copy", 1000);
                };
                if (getComputedStyle(article).position === 'static') article.style.position = 'relative';
                article.appendChild(btn);
            }
            article.dataset.unlocked = "true";
        }

        // 检查 AI 框
        const existingWrapper = document.getElementById('my-custom-ai-wrapper');
        if (existingWrapper) {
            // ★ 如果框存在，检查是否需要重置 ★
            checkAndReset(existingWrapper);
            return;
        }

        // 注入 AI 框
        let injectionTarget = article.querySelector('.group.relative.block.mt-12') || article;
        if (injectionTarget) {
            const wrapper = document.createElement('div');
            wrapper.id = 'my-custom-ai-wrapper';
            // 初始化 URL 标记
            wrapper.dataset.url = window.location.href;

            const activeConfigName = getActiveConfig().name;
            wrapper.innerHTML = `
                <div class="my-ai-box">
                    <div class="my-ai-header">
                        <div class="my-ai-title">✨ AI 智能总结 <span style="font-weight:400;font-size:0.8em;opacity:0.6;margin-left:5px;">(${activeConfigName})</span></div>
                        <div style="display:flex;align-items:center"><button class="my-ai-btn">点击生成摘要</button><div class="my-ai-setting-icon" title="设置">⚙️</div></div>
                    </div>
                    <div class="my-ai-content" style="display:none;"></div>
                </div>`;

            if (injectionTarget === article) article.insertBefore(wrapper, article.firstChild);
            else injectionTarget.insertAdjacentElement('afterend', wrapper);

            wrapper.querySelector('.my-ai-setting-icon').onclick = showSettingsModal;
            const btn = wrapper.querySelector('.my-ai-btn');
            const content = wrapper.querySelector('.my-ai-content');

            btn.onclick = () => {
                // 点击时才获取当前 DOM 的文本，确保是新的
                // 再次查找 article，防止闭包引用过期 DOM
                const currentArticle = document.getElementById('follow-entry-render') || document.querySelector('article[data-testid="entry-render"]');
                let title = "文章";
                const titleEl = currentArticle.querySelector('a[class*="text-[1.7rem]"]') || document.querySelector('title');
                if (titleEl) title = titleEl.innerText;
                const cleanText = getCleanArticleText(currentArticle);
                callAI(title, cleanText, btn, content);
            };
        }
    }

    const observer = new MutationObserver(checkAndInject);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkAndInject, 500); // 提高检查频率以快速响应切换

})();