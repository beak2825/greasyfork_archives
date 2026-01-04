// ==UserScript==
// @name         考试助手——在指定的网页上面显示一个可粘贴图片的AI助手
// @namespace    https://testhelper.natsume
// @version      0.1.3
// @description  在匹配的网页上方显示置顶的AI聊天助手，可最小化与拖拽，支持图片粘贴、上下文与流式输出，可自定义。
// @author       Natsume
// @match        https://*.chaoxing.com/*
// @match        http://*.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/553522/%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E5%9C%A8%E6%8C%87%E5%AE%9A%E7%9A%84%E7%BD%91%E9%A1%B5%E4%B8%8A%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%B8%80%E4%B8%AA%E5%8F%AF%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E7%9A%84AI%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553522/%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E5%9C%A8%E6%8C%87%E5%AE%9A%E7%9A%84%E7%BD%91%E9%A1%B5%E4%B8%8A%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%B8%80%E4%B8%AA%E5%8F%AF%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E7%9A%84AI%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Z_INDEX = 999; // index999 置顶
    const STORAGE_KEY_PREFIX = 'TestHelper_Config_';
    const CHAT_MAX_TOKENS_DEFAULT = 300;

    const hostKey = location.host;

    const defaultConfig = {
        apiBase: '',
        token: '',
        modelsCsv: 'gpt-4o',
        useStream: false,
        maxTokens: CHAT_MAX_TOKENS_DEFAULT
    };

    function getStorageKey() {
        return STORAGE_KEY_PREFIX + hostKey;
    }

    function loadConfig() {
        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) return { ...defaultConfig };
            const parsed = JSON.parse(raw);
            return { ...defaultConfig, ...parsed };
        } catch (e) {
            console.error('[TestHelper] loadConfig error:', e);
            return { ...defaultConfig };
        }
    }

    function saveConfig(cfg) {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(cfg));
        } catch (e) {
            console.error('[TestHelper] saveConfig error:', e);
        }
    }

    function encodeConfigToBase64(cfg) {
        try {
            const json = JSON.stringify(cfg);
            return btoa(unescape(encodeURIComponent(json)));
        } catch (e) {
            console.error('[TestHelper] encode base64 error:', e);
            return '';
        }
    }

    function decodeConfigFromBase64(b64) {
        try {
            const json = decodeURIComponent(escape(atob(b64)));
            const parsed = JSON.parse(json);
            return { ...defaultConfig, ...parsed };
        } catch (e) {
            console.error('[TestHelper] decode base64 error:', e);
            return null;
        }
    }

    function ensureEndsWith(path, suffix) {
        if (!path) return '';
        return path.endsWith(suffix) ? path : (path + suffix);
    }

    // UI Elements
    let root, header, body, chatHistory, inputWrap, inputBox, sendBtn, modelSelect, minimizedBubble, settingsBtn;
    let settingsModal;
    let cfg = loadConfig();
    let messages = [];
    let pendingImageDataUrls = [];
    let isSending = false;
    let currentController = null;

    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .th-root { position: fixed; top: 12px; left: 12px; width: 380px; height: 520px; background: #111827; color: #e5e7eb; border: 1px solid #374151; box-shadow: 0 10px 30px rgba(0,0,0,0.35); border-radius: 10px; display: flex; flex-direction: column; z-index: ${Z_INDEX}; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
            .th-header { cursor: move; user-select: none; background: #0b1220; border-bottom: 1px solid #1f2937; border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 8px 10px; display: flex; align-items: center; justify-content: space-between; }
            .th-title { font-weight: 600; font-size: 13px; letter-spacing: 0.3px; color: #f9fafb; }
            .th-actions { display: flex; align-items: center; gap: 8px; }
            .th-btn { cursor: pointer; border: 1px solid #374151; background: #111827; color: #e5e7eb; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
            .th-btn:hover { background: #0f172a; }
            .th-body { flex: 1; display: flex; flex-direction: column; }
            .th-chat { overflow: scroll; padding: 10px; height:300px; }
            .th-msg { margin-bottom: 12px; }
            .th-role { font-size: 11px; opacity: 0.7; margin-bottom: 4px; }
            .th-bubble { background: #0b1220; border: 1px solid #1f2937; padding: 8px; border-radius: 8px; white-space: pre-wrap; word-break: break-word; }
            .th-bubble.user { background: #1f2937; }
            .th-inputwrap { border-top: 1px solid #1f2937; padding: 8px; display: grid; grid-template-columns: 1fr auto; gap: 8px; }
            .th-row { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
            .th-select { flex: 1; padding: 6px 8px; background: #0b1220; color: #e5e7eb; border: 1px solid #374151; border-radius: 6px; font-size: 12px; }
            .th-textarea { grid-column: 1 / span 2; resize: vertical; min-height: 60px; max-height: 160px; width: 100%; padding: 8px; box-sizing: border-box; background: #0b1220; color: #e5e7eb; border: 1px solid #374151; border-radius: 6px; font-size: 13px; }
            .th-sendbtn { padding: 6px 10px; border-radius: 6px; border: 1px solid #374151; background: #10b981; color: #062a22; font-weight: 600; cursor: pointer; }
            .th-sendbtn[disabled] { opacity: 0.6; cursor: not-allowed; }
            .th-preview-row { display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0 0 0; }
            .th-preview { width: 36px; height: 36px; border-radius: 6px; border: 1px solid #374151; background-size: cover; background-position: center; position: relative; }
            .th-preview .th-x { position: absolute; top: -7px; right: -7px; width: 16px; height: 16px; border-radius: 50%; background: #ef4444; color: white; font-size: 10px; line-height: 16px; text-align: center; cursor: pointer; border: 1px solid #991b1b; }
            .th-min-bubble { position: fixed; top: 12px; left: 12px; width: 30px; height: 30px; border-radius: 6px; background: #ffffff; box-shadow: 0 6px 18px rgba(0,0,0,0.35); z-index: ${Z_INDEX}; cursor: move; display: none; align-items: center; justify-content: center; color: #e5e7eb; font-size: 11px; user-select: none; }
            .th-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: ${Z_INDEX}; display: none; align-items: center; justify-content: center; }
            .th-modal { width: 520px; max-width: 92vw; background: #111827; border: 1px solid #374151; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.45); padding: 12px; color: #e5e7eb; }
            .th-modal h3 { margin: 4px 0 10px; font-size: 14px; }
            .th-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
            .th-field label { font-size: 12px; opacity: 0.8; }
            .th-input { padding: 8px; background: #0b1220; color: #e5e7eb; border: 1px solid #374151; border-radius: 6px; font-size: 13px; }
            .th-switch-row { display: flex; align-items: center; gap: 8px; }
            .th-modal-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 10px; }
            .th-small { font-size: 12px; opacity: 0.8; }
        `;
        document.head.appendChild(style);
    }

    function createRoot() {
        root = document.createElement('div');
        root.className = 'th-root';

        header = document.createElement('div');
        header.className = 'th-header';
        const title = document.createElement('div');
        title.className = 'th-title';
        title.textContent = 'TestHelper';

        const actions = document.createElement('div');
        actions.className = 'th-actions';
        settingsBtn = document.createElement('button');
        settingsBtn.className = 'th-btn';
        settingsBtn.textContent = '设置';
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'th-btn';
        minimizeBtn.textContent = '最小化';
        actions.appendChild(settingsBtn);
        actions.appendChild(minimizeBtn);

        header.appendChild(title);
        header.appendChild(actions);

        body = document.createElement('div');
        body.className = 'th-body';
        chatHistory = document.createElement('div');
        chatHistory.className = 'th-chat';

        inputWrap = document.createElement('div');
        inputWrap.className = 'th-inputwrap';

        const topRow = document.createElement('div');
        topRow.className = 'th-row';
        modelSelect = document.createElement('select');
        modelSelect.className = 'th-select';
        populateModelSelect();
        topRow.appendChild(modelSelect);
        inputWrap.appendChild(topRow);

        inputBox = document.createElement('textarea');
        inputBox.className = 'th-textarea';
        inputBox.placeholder = '输入消息，支持直接粘贴图片（Enter发送，Shift+Enter换行）';
        inputWrap.appendChild(inputBox);

        const bottomRow = document.createElement('div');
        bottomRow.className = 'th-row';
        sendBtn = document.createElement('button');
        sendBtn.className = 'th-sendbtn';
        sendBtn.textContent = '发送';
        bottomRow.appendChild(sendBtn);
        inputWrap.appendChild(bottomRow);

        const previewRow = document.createElement('div');
        previewRow.className = 'th-preview-row';
        inputWrap.appendChild(previewRow);

        body.appendChild(chatHistory);
        body.appendChild(inputWrap);

        root.appendChild(header);
        root.appendChild(body);

        document.body.appendChild(root);

        minimizedBubble = document.createElement('div');
        minimizedBubble.className = 'th-min-bubble';
        minimizedBubble.textContent = '';
        document.body.appendChild(minimizedBubble);

        // Dragging for main root via header
        makeDraggable(root, header);
        // Dragging for minimized bubble
        makeDraggable(minimizedBubble, minimizedBubble);

        // 默认最小化
        root.style.display = 'none';
        minimizedBubble.style.display = 'flex';

        // Events
        minimizeBtn.addEventListener('click', () => {
            root.style.display = 'none';
            minimizedBubble.style.display = 'flex';
        });
        minimizedBubble.addEventListener('dblclick', () => {
            minimizedBubble.style.display = 'none';
            root.style.display = 'flex';
        });
        minimizedBubble.addEventListener('click', (e) => {
            // Single click just toggles if not dragging
            if (minimizedBubble.__dragging) return;
            minimizedBubble.style.display = 'none';
            root.style.display = 'flex';
        });

        settingsBtn.addEventListener('click', openSettingsModal);

        inputBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                trySend();
            }
        });

        sendBtn.addEventListener('click', trySend);

        inputBox.addEventListener('paste', async (e) => {
            if (!e.clipboardData) return;
            const items = Array.from(e.clipboardData.items || []);
            const imageItems = items.filter(it => it.kind === 'file' && it.type && it.type.startsWith('image/'));
            if (imageItems.length === 0) return; // let default paste for text
            e.preventDefault();
            for (const it of imageItems) {
                const file = it.getAsFile();
                if (!file) continue;
                const dataUrl = await fileToDataUrl(file);
                pendingImageDataUrls.push(dataUrl);
                addPreview(previewRow, dataUrl);
            }
        });
    }

    function addPreview(container, dataUrl) {
        const thumb = document.createElement('div');
        thumb.className = 'th-preview';
        thumb.style.backgroundImage = `url("${dataUrl}")`;
        const x = document.createElement('div');
        x.className = 'th-x';
        x.textContent = '×';
        x.title = '移除图片';
        x.addEventListener('click', () => {
            const idx = pendingImageDataUrls.indexOf(dataUrl);
            if (idx >= 0) pendingImageDataUrls.splice(idx, 1);
            container.removeChild(thumb);
        });
        thumb.appendChild(x);
        container.appendChild(thumb);
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function populateModelSelect() {
        modelSelect.innerHTML = '';
        const models = (cfg.modelsCsv || '').split(',').map(s => s.trim()).filter(Boolean);
        if (models.length === 0) models.push('gpt-4o');
        for (const m of models) {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            modelSelect.appendChild(opt);
        }
    }

    function appendMessageToUI(role, text) {
        const wrap = document.createElement('div');
        wrap.className = 'th-msg';
        const roleEl = document.createElement('div');
        roleEl.className = 'th-role';
        roleEl.textContent = role === 'user' ? '用户' : '助手';
        const bubble = document.createElement('div');
        bubble.className = 'th-bubble' + (role === 'user' ? ' user' : '');
        bubble.textContent = text || '';
        wrap.appendChild(roleEl);
        wrap.appendChild(bubble);
        chatHistory.appendChild(wrap);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return bubble; // return bubble for streaming updates
    }

    function buildUserContentParts(text) {
        const parts = [];
        const trimmed = (text || '').trim();
        if (trimmed.length > 0) {
            parts.push({ type: 'text', text: trimmed });
        }
        for (const dataUrl of pendingImageDataUrls) {
            parts.push({ type: 'image_url', image_url: { url: dataUrl } });
        }
        return parts;
    }

    async function trySend() {
        if (isSending) return;
        const text = inputBox.value;
        const contentParts = buildUserContentParts(text);
        if (contentParts.length === 0) return; // nothing to send

        // push user message
        const userMsg = { role: 'user', content: contentParts };
        messages.push(userMsg);
        appendMessageToUI('user', text || (pendingImageDataUrls.length > 0 ? '[图片]' : ''));

        // reset input and previews
        inputBox.value = '';
        pendingImageDataUrls = [];
        const previews = inputWrap.querySelectorAll('.th-preview');
        previews.forEach(p => p.remove());

        // assistant placeholder
        const assistantBubble = appendMessageToUI('assistant', '');
        isSending = true;
        sendBtn.disabled = true;

        try {
            await sendToApi(messages, assistantBubble);
        } catch (e) {
            console.error('[TestHelper] send error:', e);
            assistantBubble.textContent = '请求失败：' + (e && e.message ? e.message : '未知错误');
        } finally {
            isSending = false;
            sendBtn.disabled = false;
        }
    }

    function normalizeApiBase(apiBase) {
        if (!apiBase) return '';
        // remove trailing slashes
        let base = apiBase.replace(/\/$/, '');
        return base;
    }

    function getEndpoint() {
        const base = normalizeApiBase(cfg.apiBase);
        return ensureEndsWith(base, '/v1/chat/completions');
    }

    async function sendToApi(allMessages, assistantBubble) {
        const endpoint = getEndpoint();
        if (!endpoint) {
            throw new Error('请先在设置中配置模型 API 地址');
        }

        const reqBody = {
            model: modelSelect.value || 'gpt-4o',
            messages: allMessages,
            max_tokens: cfg.maxTokens || CHAT_MAX_TOKENS_DEFAULT,
            stream: !!cfg.useStream
        };

        const headers = { 'Content-Type': 'application/json' };
        if (cfg.token) headers['Authorization'] = 'Bearer ' + cfg.token;

        if (currentController) {
            try { currentController.abort(); } catch (_) {}
        }
        currentController = new AbortController();

        const resp = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(reqBody),
            signal: currentController.signal
        });

        if (!resp.ok) {
            const txt = await safeReadText(resp);
            throw new Error(`HTTP ${resp.status}: ${txt || '请求失败'}`);
        }

        if (cfg.useStream) {
            await handleStreamResponse(resp, assistantBubble);
        } else {
            const data = await resp.json();
            const content = extractNonStreamContent(data);
            assistantBubble.textContent = content;
            messages.push({ role: 'assistant', content: [{ type: 'text', text: content }] });
        }
    }

    async function safeReadText(resp) {
        try { return await resp.text(); } catch (_) { return ''; }
    }

    function extractNonStreamContent(data) {
        try {
            const choice = data && data.choices && data.choices[0];
            if (!choice) return '';
            // OpenAI style: message.content or delta in streaming
            const content = choice.message && (choice.message.content || '');
            if (typeof content === 'string') return content;
            if (Array.isArray(content)) {
                // content array (multimodal) -> join text parts for display
                return content.map(p => p && p.text ? p.text : '').join('');
            }
            return '';
        } catch (_) { return ''; }
    }

    async function handleStreamResponse(resp, assistantBubble) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let buffer = '';
        let accText = '';
        while (!done) {
            const { value, done: doneNow } = await reader.read();
            done = doneNow;
            if (value) {
                buffer += decoder.decode(value, { stream: true });
                // SSE is separated by \n\n; process line by line
                const parts = buffer.split(/\n\n/);
                // keep last partial
                buffer = parts.pop() || '';
                for (const part of parts) {
                    const lines = part.split(/\n/).map(l => l.trim());
                    for (const line of lines) {
                        if (!line.startsWith('data:')) continue;
                        const dataStr = line.slice(5).trim();
                        if (dataStr === '[DONE]') {
                            done = true;
                            break;
                        }
                        try {
                            const obj = JSON.parse(dataStr);
                            const delta = obj.choices && obj.choices[0] && obj.choices[0].delta;
                            const piece = delta && delta.content ? delta.content : '';
                            if (piece) {
                                accText += piece;
                                assistantBubble.textContent = accText;
                                chatHistory.scrollTop = chatHistory.scrollHeight;
                            }
                        } catch (e) {
                            // ignore parse errors for non-data lines
                        }
                    }
                }
            }
        }
        messages.push({ role: 'assistant', content: [{ type: 'text', text: accText }] });
    }

    function makeDraggable(dragTarget, handleEl) {
        let offsetX = 0; let offsetY = 0; let dragging = false;
        let startMouseX = 0; let startMouseY = 0;
        let startLeft = 0; let startTop = 0;

        function onMouseDown(e) {
            dragging = true;
            dragTarget.__dragging = true;
            startMouseX = e.clientX; startMouseY = e.clientY;
            const rect = dragTarget.getBoundingClientRect();
            startLeft = rect.left; startTop = rect.top;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        function onMouseMove(e) {
            if (!dragging) return;
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            dragTarget.style.left = Math.max(0, Math.min(window.innerWidth - dragTarget.offsetWidth, newLeft)) + 'px';
            dragTarget.style.top = Math.max(0, Math.min(window.innerHeight - dragTarget.offsetHeight, newTop)) + 'px';
        }

        function onMouseUp() {
            dragging = false;
            setTimeout(() => { dragTarget.__dragging = false; }, 0);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        handleEl.addEventListener('mousedown', onMouseDown);
        // Touch support (basic)
        handleEl.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            onMouseDown({ clientX: t.clientX, clientY: t.clientY });
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const t = e.touches[0];
            onMouseMove({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    }

    function openSettingsModal() {
        if (!settingsModal) settingsModal = buildSettingsModal();
        settingsModal.mask.style.display = 'flex';
    }

    function buildSettingsModal() {
        const mask = document.createElement('div');
        mask.className = 'th-modal-mask';
        const modal = document.createElement('div');
        modal.className = 'th-modal';
        modal.innerHTML = `
            <h3>设置</h3>
            <div class="th-field">
                <label>模型 API 地址（例如：https://api.example.com）</label>
                <input class="th-input" data-k="apiBase" placeholder="必填" />
            </div>
            <div class="th-field">
                <label>验证 Token（Authorization: Bearer <token>）</label>
                <input class="th-input" data-k="token" placeholder="可留空" />
            </div>
            <div class="th-field">
                <label>模型列表（英文逗号分隔）</label>
                <input class="th-input" data-k="modelsCsv" placeholder="如：gpt-4o,gpt-4o-mini" />
            </div>
            <div class="th-field">
                <div class="th-switch-row">
                    <input type="checkbox" data-k="useStream" id="th-use-stream" />
                    <label for="th-use-stream">使用流式输出（所有请求均使用）</label>
                </div>
            </div>
            <div class="th-field">
                <label>最大回复 tokens（max_tokens）</label>
                <input class="th-input" data-k="maxTokens" type="number" min="1" step="1" />
            </div>
            <div class="th-field">
                <label>配置导出/导入（Base64）</label>
                <textarea class="th-input" rows="3" data-k="b64Area" placeholder="点击“导出”后可复制；粘贴后点“导入”"></textarea>
                <div class="th-modal-actions">
                    <div>
                        <button class="th-btn" data-act="export">导出</button>
                        <button class="th-btn" data-act="import">导入</button>
                        <span class="th-small">配置仅保存在当前站点：${hostKey}</span>
                    </div>
                    <div>
                        <button class="th-btn" data-act="cancel">取消</button>
                        <button class="th-sendbtn" data-act="save">保存</button>
                    </div>
                </div>
            </div>
        `;
        mask.appendChild(modal);
        document.body.appendChild(mask);

        const bindVals = () => {
            modal.querySelector('input[data-k="apiBase"]').value = cfg.apiBase || '';
            modal.querySelector('input[data-k="token"]').value = cfg.token || '';
            modal.querySelector('input[data-k="modelsCsv"]').value = cfg.modelsCsv || '';
            modal.querySelector('input[data-k="maxTokens"]').value = cfg.maxTokens || CHAT_MAX_TOKENS_DEFAULT;
            modal.querySelector('input[data-k="useStream"]').checked = !!cfg.useStream;
            modal.querySelector('textarea[data-k="b64Area"]').value = '';
        };
        bindVals();

        mask.addEventListener('click', (e) => {
            if (e.target === mask) mask.style.display = 'none';
        });

        modal.querySelector('[data-act="cancel"]').addEventListener('click', () => {
            mask.style.display = 'none';
        });
        modal.querySelector('[data-act="save"]').addEventListener('click', () => {
            const newCfg = {
                apiBase: modal.querySelector('input[data-k="apiBase"]').value.trim(),
                token: modal.querySelector('input[data-k="token"]').value.trim(),
                modelsCsv: modal.querySelector('input[data-k="modelsCsv"]').value.trim(),
                useStream: modal.querySelector('input[data-k="useStream"]').checked,
                maxTokens: Math.max(1, parseInt(modal.querySelector('input[data-k="maxTokens"]').value, 10) || CHAT_MAX_TOKENS_DEFAULT)
            };
            cfg = { ...cfg, ...newCfg };
            saveConfig(cfg);
            populateModelSelect();
            mask.style.display = 'none';
        });
        modal.querySelector('[data-act="export"]').addEventListener('click', () => {
            const area = modal.querySelector('textarea[data-k="b64Area"]');
            area.value = encodeConfigToBase64(cfg);
            area.select();
            try { document.execCommand('copy'); } catch (_) {}
        });
        modal.querySelector('[data-act="import"]').addEventListener('click', () => {
            const area = modal.querySelector('textarea[data-k="b64Area"]');
            const text = area.value.trim();
            if (!text) return;
            const imported = decodeConfigFromBase64(text);
            if (!imported) return alert('导入失败：Base64 无效');
            cfg = { ...cfg, ...imported };
            saveConfig(cfg);
            bindVals();
            populateModelSelect();
            alert('导入成功');
        });

        return { mask, modal };
    }

    // init
    createStyle();
    createRoot();
})();