// ==UserScript==
// @name         划词 搜索 & AI
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  划词后显示图标，展开窗口可切换搜索与AI连续对话。AI功能支持自定义服务端点和一键切换。
// @author       lxzyz
// @license      CC-BY-NC-4.0
// @match        http://*/*
// @match        https://*/*
// @connect      *
// @connect      api.deepseek.com
// @connect      www.baidu.com
// @connect      www.google.com
// @connect      www.bing.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552538/%E5%88%92%E8%AF%8D%20%E6%90%9C%E7%B4%A2%20%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/552538/%E5%88%92%E8%AF%8D%20%E6%90%9C%E7%B4%A2%20%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const searchEngines = {
        'Baidu': { name: '百度', favicon: 'https://www.baidu.com/favicon.ico', searchUrl: 'https://www.baidu.com/s?wd=', baseUrl: 'https://www.baidu.com', method: 'background' },
        'Google': { name: '谷歌', favicon: 'https://www.google.com/favicon.ico', searchUrl: 'https://www.google.com/search?igu=1&q=', baseUrl: 'https://www.google.com', method: 'iframe' },
        'Bing': { name: '必应', favicon: 'https://www.bing.com/favicon.ico', searchUrl: 'https://cn.bing.com/search?q=', baseUrl: 'https://cn.bing.com', method: 'background' },
    };

    // --- AI 配置管理 ---
    const DEFAULT_AI_ID = 'deepseek_official';
    const defaultAiConfigs = {
        [DEFAULT_AI_ID]: {
            name: 'DeepSeek',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat',
            apiKeyKey: 'deepseek_api_key' // The key for GM_setValue/GM_getValue
        }
    };

    function getCustomAiConfigs() {
        return JSON.parse(GM_getValue('customAiConfigs', '{}'));
    }

    function saveCustomAiConfigs(configs) {
        GM_setValue('customAiConfigs', JSON.stringify(configs));
    }

    function getAllAiConfigs() {
        const customConfigs = getCustomAiConfigs();
        return { ...defaultAiConfigs, ...customConfigs };
    }

    function getActiveAiConfigId() {
        return GM_getValue('activeAiConfigId', DEFAULT_AI_ID);
    }

    function getActiveAiConfig() {
        const allConfigs = getAllAiConfigs();
        const activeId = getActiveAiConfigId();
        // Fallback to default if active one was deleted or does not exist
        return allConfigs[activeId] || allConfigs[DEFAULT_AI_ID];
    }

    // --- 菜单与API Key设置 ---
    let defaultEngine = GM_getValue('defaultSearchEngine', 'Baidu');
    Object.keys(searchEngines).forEach(key => {
        GM_registerMenuCommand(`${defaultEngine === key ? '✅' : '  '} 设为默认引擎: ${searchEngines[key].name}`, () => {
            GM_setValue('defaultSearchEngine', key);
            alert(`默认搜索引擎已设置为: ${searchEngines[key].name}。刷新页面后生效。`);
        });
    });

    // --- AI 菜单 ---
    GM_registerMenuCommand('--- AI 配置 ---', () => {}); // 分割线
    const allAiConfigs = getAllAiConfigs();
    const activeAiId = getActiveAiConfigId();

    Object.entries(allAiConfigs).forEach(([id, config]) => {
        GM_registerMenuCommand(`${id === activeAiId ? '✅' : '  '} 切换 AI 为: ${config.name}`, () => {
            GM_setValue('activeAiConfigId', id);
            alert(`AI 已切换为: ${config.name}。`);
        });
    });

    GM_registerMenuCommand('设置 AI 的 API Key', () => {
        const configs = getAllAiConfigs();
        const configEntries = Object.entries(configs);
        const configChoices = configEntries.map(([id, config], index) => `${index + 1}. ${config.name}`).join('\n');
        const choice = prompt(`请选择要设置 API Key 的 AI 配置 (输入数字):\n${configChoices}`, '1');
        if (choice === null) return;

        const choiceIndex = parseInt(choice, 10) - 1;
        if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= configEntries.length) {
            alert('无效的选择。');
            return;
        }

        const [configId, selectedConfig] = configEntries[choiceIndex];
        const currentKey = GM_getValue(selectedConfig.apiKeyKey, '');
        const newKey = prompt(`请输入 [${selectedConfig.name}] 的 API Key:`, currentKey);
        if (newKey !== null) {
            GM_setValue(selectedConfig.apiKeyKey, newKey.trim());
            alert('API Key 已' + (newKey.trim() ? '保存。' : '清除。'));
        }
    });

    GM_registerMenuCommand('添加自定义 AI 配置', () => {
        const name = prompt("输入配置名称 (例如 'My Local LLM'):");
        if (!name) return;
        const apiUrl = prompt("输入 API URL (例如 'http://localhost:1234/v1/chat/completions'):");
        if (!apiUrl) return;
        const model = prompt("输入模型名称 (例如 'llama3-8b-instruct'):");
        if (!model) return;
        const id = `custom_${Date.now()}`;
        const apiKeyKey = `custom_apikey_${id}`;

        const newConfig = { name, apiUrl, model, apiKeyKey };
        const customConfigs = getCustomAiConfigs();
        customConfigs[id] = newConfig;
        saveCustomAiConfigs(customConfigs);
        alert(`配置 "${name}" 已添加。您现在可以刷新页面，在菜单中切换并为其设置 API Key。`);
    });

    GM_registerMenuCommand('删除自定义 AI 配置', () => {
        const customConfigs = getCustomAiConfigs();
        if (Object.keys(customConfigs).length === 0) {
            alert('没有可删除的自定义配置。');
            return;
        }
        const configChoices = Object.entries(customConfigs).map(([id, config]) => `- ${config.name}`).join('\n');
        const choice = prompt(`请输入要删除的配置的完整名称:\n${configChoices}`);
        if (!choice) return;

        const entryToDelete = Object.entries(customConfigs).find(([id, config]) => config.name.trim() === choice.trim());
        if (entryToDelete) {
            const [idToDelete, configToDelete] = entryToDelete;
            delete customConfigs[idToDelete];
            saveCustomAiConfigs(customConfigs);
            GM_setValue(configToDelete.apiKeyKey, ''); // Also remove the stored API key
            alert(`配置 "${configToDelete.name}" 已删除。`);
        } else {
            alert('未找到该名称的配置。');
        }
    });


    // --- 样式 ---
    GM_addStyle(`
        :root { --main-blue: #4285f4; --light-blue: #e8f0fe; --border-color: #ddd; --bg-hover: #f0f0f0; --text-color: #333; --text-light: #888; }
        #search-trigger-icon { position: absolute; z-index: 2147483646 !important; width: 32px; height: 32px; background-color: #fff; border: 1px solid var(--border-color); border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; animation: iconFadeIn 0.2s ease-out; }
        #search-trigger-icon:hover { transform: scale(1.15); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
        #search-trigger-icon img { width: 20px; height: 20px; pointer-events: none; }
        @keyframes iconFadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        #search-popup-container { position: absolute; z-index: 2147483647 !important; background-color: #fdfdfd; border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); padding: 0; width: 850px; height: 650px; overflow: hidden; resize: both; display: flex; flex-direction: column; animation: fadeIn 0.2s ease-out; user-select: none; }
        #search-popup-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; border-bottom: 1px solid #eee; background-color: #f7f7f7; flex-shrink: 0; cursor: move; }
        #search-engine-switcher { display: flex; align-items: center; gap: 6px; }
        .engine-switch-btn, #ai-switch-btn { cursor: pointer; border: 2px solid transparent; border-radius: 50%; padding: 2px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
        .engine-switch-btn:hover, #ai-switch-btn:hover { background-color: var(--bg-hover); }
        .engine-switch-btn.active, #ai-switch-btn.active { border-color: var(--main-blue); background-color: var(--light-blue); }
        .engine-switch-btn img { width: 16px; height: 16px; pointer-events: none; }
        #ai-switch-btn svg { width: 16px; height: 16px; stroke: #5f6368; } #ai-switch-btn.active svg { stroke: var(--main-blue); }
        .header-divider { border-left: 1px solid var(--border-color); height: 20px; margin: 0 4px; }
        #search-popup-controls { display: flex; align-items: center; gap: 4px; }
        .popup-control-btn { cursor: pointer; border: none; background: none; font-size: 22px; color: var(--text-light); width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, color 0.2s; }
        .popup-control-btn:hover { background-color: var(--bg-hover); color: var(--text-color); }
        #search-popup-pin-btn.pinned { background-color: var(--light-blue); } #search-popup-pin-btn.pinned svg { fill: var(--main-blue); stroke: var(--main-blue); }
        #search-popup-pin-btn svg { width: 16px; height: 16px; stroke: var(--text-light); stroke-width: 2; fill: none; }
        #search-popup-content { flex-grow: 1; height: 100%; position: relative; }
        #search-popup-iframe { width: 100%; height: 100%; border: none; }
        #ai-view-container { display: none; flex-direction: column; width: 100%; height: 100%; padding: 12px; box-sizing: border-box; background-color: #fff; }
        #ai-response-area { flex-grow: 1; overflow-y: auto; border: 1px solid #eee; border-radius: 8px; padding: 10px; font-size: 14px; line-height: 1.6; color: var(--text-color); }
        #ai-response-area .ai-message { padding: 8px 12px; border-radius: 10px; margin-bottom: 10px; max-width: 90%; word-wrap: break-word; }
        #ai-response-area .ai-message.user { background-color: var(--light-blue); margin-left: auto; }
        #ai-response-area .ai-message.assistant { background-color: #f1f1f1; margin-right: auto; }
        .ai-message h1, .ai-message h2, .ai-message h3 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; }
        .ai-message p { margin-top: 0; margin-bottom: 16px; }
        .ai-message ul, .ai-message ol { padding-left: 2em; }
        .ai-message code { font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; background-color: #e0e0e0; padding: .2em .4em; font-size: 85%; border-radius: 6px; }
        .ai-message pre { background-color: #2d2d2d; color: #f1f1f1; padding: 16px; border-radius: 8px; overflow-x: auto; }
        .ai-message pre code { background-color: transparent; padding: 0; }
        .typing-cursor { display: inline-block; width: 8px; height: 1em; background-color: var(--text-color); animation: blink 1s step-end infinite; }
        @keyframes blink { from, to { background-color: transparent } 50% { background-color: var(--text-color); } }
        #ai-input-area { display: flex; gap: 8px; margin-top: 10px; flex-shrink: 0; }
        #ai-input { flex-grow: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 18px; outline: none; transition: border-color 0.2s; } #ai-input:focus { border-color: var(--main-blue); }
        #ai-submit-btn { padding: 8px 16px; border: none; background-color: var(--main-blue); color: white; border-radius: 18px; cursor: pointer; transition: background-color 0.2s; } #ai-submit-btn:disabled { background-color: #ccc; cursor: not-allowed; }
    `);

    // --- 全局变量 ---
    let popup = null, searchIcon = null, currentSearchTerm = '', triggerTimer = null;
    let isDragging = false, isPinned = false;
    let offsetX, offsetY;
    let aiAbortController = null;
    let aiConversationHistory = []; // 用于存储对话历史

    // --- UI 创建与销毁 ---
    function closeEverything(immediate = true) {
        if (aiAbortController) {
            aiAbortController.abort();
            aiAbortController = null;
        }
        aiConversationHistory = []; // 清空对话历史
        isPinned = false;
        if (popup) { document.body.removeChild(popup); popup = null; }
        if (searchIcon) { document.body.removeChild(searchIcon); searchIcon = null; }
    }

    // --- 核心功能函数 ---
    async function handleAiSubmit(question, submitBtn, responseArea, inputElem) {
        const activeAiConfig = getActiveAiConfig();
        const apiKey = GM_getValue(activeAiConfig.apiKeyKey, '');

        if (!apiKey) {
            const errorMessage = `<div class="ai-message assistant"><strong>错误</strong>：尚未为 <strong>${activeAiConfig.name}</strong> 设置 API Key。请通过油猴插件菜单设置。</div>`;
            responseArea.innerHTML += errorMessage; // Directly append HTML
            responseArea.scrollTop = responseArea.scrollHeight;
            return;
        }
        if (!question.trim()) return;

        if (aiAbortController) { aiAbortController.abort(); }
        aiAbortController = new AbortController();

        // 1. 更新对话历史和UI (用户部分)
        aiConversationHistory.push({ role: "user", content: question });
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'ai-message user';
        userMessageDiv.innerHTML = window.marked.parse(question);
        responseArea.appendChild(userMessageDiv);
        responseArea.scrollTop = responseArea.scrollHeight;
        inputElem.value = ''; // 清空输入框

        submitBtn.disabled = true;
        inputElem.disabled = true;
        submitBtn.textContent = '停止';
        submitBtn.onclick = () => aiAbortController.abort();

        // 2. 创建AI消息的容器
        const assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.className = 'ai-message assistant';
        responseArea.appendChild(assistantMessageDiv);

        let fullResponse = "";
        try {
            const response = await fetch(activeAiConfig.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: activeAiConfig.model,
                    messages: aiConversationHistory, // 发送完整历史
                    stream: true
                }),
                signal: aiAbortController.signal
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? JSON.stringify(errorData.error) : `HTTP Error ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.substring(6);
                        if (dataStr.trim() === "[DONE]") break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.choices && data.choices[0].delta) {
                                fullResponse += data.choices[0].delta.content || "";
                                assistantMessageDiv.innerHTML = window.marked.parse(fullResponse + '<span class="typing-cursor"></span>');
                                responseArea.scrollTop = responseArea.scrollHeight;
                            }
                        } catch (e) { /* Ignore incomplete JSON */ }
                    }
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                fullResponse += `\n\n**请求出错**: ${error.message}`;
            }
        } finally {
            // 3. 更新对话历史 (AI部分)
            if (fullResponse) {
                aiConversationHistory.push({ role: "assistant", content: fullResponse });
            }
            assistantMessageDiv.innerHTML = window.marked.parse(fullResponse);
            responseArea.scrollTop = responseArea.scrollHeight;
            submitBtn.disabled = false;
            inputElem.disabled = false;
            submitBtn.textContent = '发送';
            submitBtn.onclick = () => handleAiSubmit(inputElem.value, submitBtn, responseArea, inputElem);
            aiAbortController = null;
        }
    }

    function createSearchIcon(x, y) {
        closeEverything(true);
        defaultEngine = GM_getValue('defaultSearchEngine', 'Baidu');
        searchIcon = document.createElement('div');
        searchIcon.id = 'search-trigger-icon';
        searchIcon.innerHTML = `<img src="${searchEngines[defaultEngine].favicon}" alt="${searchEngines[defaultEngine].name}">`;
        document.body.appendChild(searchIcon);
        searchIcon.style.left = `${x}px`; searchIcon.style.top = `${y}px`;
        const showPopup = () => { if (!popup) createPopup(x + 35, y); };
        searchIcon.addEventListener('mouseenter', showPopup);
        searchIcon.addEventListener('click', showPopup);
    }

    function createPopup(x, y) {
        if (popup) return;
        if (searchIcon) { searchIcon.style.display = 'none'; }
        popup = document.createElement('div');
        popup.id = 'search-popup-container';
        const activeAiConfig = getActiveAiConfig();
        const aiIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3z"/></svg>`;
        popup.innerHTML = `
            <div id="search-popup-header">
                <div id="search-engine-switcher">
                    <div id="ai-switch-btn" title="提问AI (${activeAiConfig.name})">${aiIconSvg}</div>
                    <div class="header-divider"></div>
                    ${Object.keys(searchEngines).map(key => `<div class="engine-switch-btn" data-engine-key="${key}" title="切换到 ${searchEngines[key].name}"><img src="${searchEngines[key].favicon}" alt="${searchEngines[key].name}"></div>`).join('')}
                </div>
                <div id="search-popup-controls">
                    <button id="search-popup-pin-btn" class="popup-control-btn" title="置顶窗口"><svg viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"></path></svg></button>
                    <button id="search-popup-close-btn" class="popup-control-btn" title="关闭">&times;</button>
                </div>
            </div>
            <div id="search-popup-content">
                <iframe id="search-popup-iframe"></iframe>
                <div id="ai-view-container">
                    <div id="ai-response-area"></div>
                    <div id="ai-input-area">
                        <input type="text" id="ai-input" placeholder="输入你的问题...">
                        <button id="ai-submit-btn">发送</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        repositionAndConstrain(x, y);

        const searchIframe = popup.querySelector('#search-popup-iframe');
        const aiView = popup.querySelector('#ai-view-container');
        const aiBtn = popup.querySelector('#ai-switch-btn');
        const searchBtns = popup.querySelectorAll('.engine-switch-btn');
        const aiResponseArea = popup.querySelector('#ai-response-area');
        const aiInput = popup.querySelector('#ai-input');

        const switchToAiView = () => {
            searchIframe.style.display = 'none';
            aiView.style.display = 'flex';
            aiBtn.classList.add('active');
            searchBtns.forEach(b => b.classList.remove('active'));
            aiInput.focus();

            // Display initial greeting if conversation is new, but don't add to history.
            if (aiConversationHistory.length === 0) {
                 aiInput.value = currentSearchTerm; // Pre-fill with selected text
                 const greeting = "你好！有什么可以帮你的吗？";
                 aiResponseArea.innerHTML = `<div class="ai-message assistant">${window.marked.parse(greeting)}</div>`;
            }
        };
        const switchToSearchView = (engineKey) => {
            if (aiAbortController) aiAbortController.abort();
            aiView.style.display = 'none';
            searchIframe.style.display = 'block';
            aiBtn.classList.remove('active');
            searchBtns.forEach(b => b.classList.toggle('active', b.dataset.engineKey === engineKey));
            loadSearch(engineKey, currentSearchTerm, searchIframe);
        };
        aiBtn.onclick = switchToAiView;
        searchBtns.forEach(btn => { btn.onclick = () => switchToSearchView(btn.dataset.engineKey); });

        const aiSubmitBtn = popup.querySelector('#ai-submit-btn');
        aiSubmitBtn.onclick = () => handleAiSubmit(aiInput.value, aiSubmitBtn, aiResponseArea, aiInput);
        aiInput.onkeydown = (e) => { if (e.key === 'Enter' && !e.isComposing) aiSubmitBtn.click(); };

        const header = popup.querySelector('#search-popup-header');
        popup.querySelector('#search-popup-pin-btn').onclick = (e) => { isPinned = !isPinned; e.currentTarget.classList.toggle('pinned', isPinned); };
        popup.querySelector('#search-popup-close-btn').onclick = () => closeEverything(true);
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.popup-control-btn, .engine-switch-btn, #ai-switch-btn')) return;
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
        });
        switchToSearchView(defaultEngine);
    }

    function loadSearch(engineKey, searchTerm, iframeElement) {
        const engine = searchEngines[engineKey];
        const fullSearchUrl = engine.searchUrl + encodeURIComponent(searchTerm);
        if (engine.method === 'iframe') { iframeElement.src = fullSearchUrl; }
        else {
            iframeElement.src = 'about:blank';
            iframeElement.srcdoc = '正在加载...';
            const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36", "Referer": engine.baseUrl };
            GM_xmlhttpRequest({
                method: "GET", url: fullSearchUrl, headers: headers,
                onload: (response) => { if (popup) iframeElement.srcdoc = `<base href="${engine.baseUrl}">${response.responseText}`; },
                onerror: () => { if (popup) iframeElement.srcdoc = '加载失败。'; }
            });
        }
    }

    function repositionAndConstrain(newX, newY) {
        const target = popup; if (!target) return;
        const scrollX = window.scrollX, scrollY = window.scrollY;
        let viewX = newX - scrollX, viewY = newY - scrollY;
        const rect = target.getBoundingClientRect();
        const winWidth = window.innerWidth, winHeight = window.innerHeight;
        if (viewX + rect.width > winWidth) viewX = winWidth - rect.width - 10;
        if (viewY + rect.height > winHeight) viewY = winHeight - rect.height - 10;
        if (viewX < 10) viewX = 10; if (viewY < 10) viewY = 10;
        target.style.left = `${viewX + scrollX}px`; target.style.top = `${viewY + scrollY}px`;
    }

    document.addEventListener('mouseup', (e) => {
        if (e.target.closest('#search-trigger-icon, #search-popup-container') || e.button !== 0) return;
        // 使用一个微小的延迟来确保选区已经最终确定
        setTimeout(() => {
            const selection = window.getSelection();
            if (!selection.isCollapsed) { // 确保有选区存在
                const selectedText = selection.toString().trim();
                if (selectedText.length > 0 && selectedText.length < 1000) {
                    currentSearchTerm = selectedText;
                    clearTimeout(triggerTimer);
                    const rect = selection.getRangeAt(0).getBoundingClientRect();
                    const iconX = e.pageX > rect.right + window.scrollX ? e.pageX : rect.right + window.scrollX;
                    const iconY = e.pageY > rect.bottom + window.scrollY ? e.pageY : rect.bottom + window.scrollY;
                    triggerTimer = setTimeout(() => { createSearchIcon(iconX + 5, iconY + 5); }, 150);
                }
            }
        }, 10);
    });

    document.addEventListener('mousedown', (e) => { if (!isPinned && !e.target.closest('#search-trigger-icon, #search-popup-container')) { closeEverything(true); } clearTimeout(triggerTimer); });
    document.addEventListener('scroll', () => { if (!isPinned) closeEverything(true); }, { capture: true, passive: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEverything(true); });
    document.addEventListener('mousemove', (e) => { if (!isDragging || !popup) return; e.preventDefault(); const newX = e.clientX - offsetX; const newY = e.clientY - offsetY; popup.style.left = `${newX}px`; popup.style.top = `${newY}px`; });
    document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; if (popup) popup.querySelector('#search-popup-header').style.cursor = 'move'; } });
})();