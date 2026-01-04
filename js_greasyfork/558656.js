// ==UserScript==
// @name         Team 导出对话
// @version      8.2.0
// @description  ChatGPT 团队空间对话导出工具。支持选择性导出对话，支持 JSON、Markdown、HTML 三种格式，渐进式加载显示。
// @author       Credit X
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1479633
// @downloadURL https://update.greasyfork.org/scripts/558656/Team%20%E5%AF%BC%E5%87%BA%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/558656/Team%20%E5%AF%BC%E5%87%BA%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置与全局变量 ---
    const BASE_DELAY = 600;
    const JITTER = 400;
    const PAGE_LIMIT = 100;
    let accessToken = null;
    let capturedWorkspaceIds = new Set(); // 使用Set存储网络拦截到的ID，确保唯一性

    // --- 核心：网络拦截与信息捕获 ---
    (function interceptNetwork() {
        const rawFetch = window.fetch;
        window.fetch = async function (resource, options) {
            tryCaptureToken(options?.headers);
            if (options?.headers?.['ChatGPT-Account-Id']) {
                const id = options.headers['ChatGPT-Account-Id'];
                if (id && !capturedWorkspaceIds.has(id)) {
                    console.log('🎯 [Fetch] 捕获到 Workspace ID:', id);
                    capturedWorkspaceIds.add(id);
                }
            }
            return rawFetch.apply(this, arguments);
        };

        const rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        tryCaptureToken(this.getRequestHeader('Authorization'));
                        const id = this.getRequestHeader('ChatGPT-Account-Id');
                        if (id && !capturedWorkspaceIds.has(id)) {
                            console.log('🎯 [XHR] 捕获到 Workspace ID:', id);
                            capturedWorkspaceIds.add(id);
                        }
                    } catch (_) { }
                }
            });
            return rawOpen.apply(this, arguments);
        };
    })();

    function tryCaptureToken(header) {
        if (!header) return;
        const h = typeof header === 'string' ? header : header instanceof Headers ? header.get('Authorization') : header.Authorization || header.authorization;
        if (h?.startsWith('Bearer ')) {
            const token = h.slice(7);
            // [v8.2.0 修复] 在捕获源头增加验证，拒绝已知的无效占位符Token
            if (token && token.toLowerCase() !== 'dummy') {
                accessToken = token;
            }
        }
    }

    async function ensureAccessToken() {
        if (accessToken) return accessToken;
        try {
            const session = await (await fetch('/api/auth/session?unstable_client=true')).json();
            if (session.accessToken) {
                accessToken = session.accessToken;
                return accessToken;
            }
        } catch (_) { }
        alert('无法获取 Access Token。请刷新页面或打开任意一个对话后再试。');
        return null;
    }

    // --- 辅助函数 ---
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const jitter = () => BASE_DELAY + Math.random() * JITTER;
    const sanitizeFilename = (name) => name.replace(/[\/\\?%*:|"<>]/g, '-').trim();

    /**
     * [新增] 显示通知提示框
     * @param {string} message - 提示消息
     * @param {string} type - 类型: 'success' 或 'error'
     */
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10a37f' : '#ef4444'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 100000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    /**
     * [新增] 将对话 JSON 数据转换为 Markdown 格式
     * @param {Object} convData - 对话的 JSON 数据
     * @returns {string} - Markdown 格式的文本
     */
    function convertToMarkdown(convData) {
        let markdown = '';

        // 标题和元数据
        markdown += `# ${convData.title || 'Untitled Conversation'}\n\n`;
        markdown += `**Conversation ID:** \`${convData.conversation_id}\`\n\n`;
        markdown += `**Created:** ${new Date(convData.create_time * 1000).toLocaleString()}\n\n`;
        markdown += `**Updated:** ${new Date(convData.update_time * 1000).toLocaleString()}\n\n`;

        if (convData.__fetched_at) {
            markdown += `**Exported:** ${new Date(convData.__fetched_at).toLocaleString()}\n\n`;
        }

        markdown += '---\n\n';

        // 遍历消息
        const mapping = convData.mapping || {};
        const messageNodes = Object.values(mapping).filter(node =>
            node.message && node.message.content && node.message.content.parts
        );

        // 按创建时间排序
        messageNodes.sort((a, b) =>
            (a.message.create_time || 0) - (b.message.create_time || 0)
        );

        messageNodes.forEach((node, index) => {
            const msg = node.message;
            const role = msg.author?.role || 'unknown';
            const parts = msg.content.parts || [];

            // 跳过空消息（特别是空的 system 消息）
            const hasContent = parts.some(part => typeof part === 'string' && part.trim());
            if (!hasContent) return;

            // 角色标题（使用中文，不使用 emoji）
            if (role === 'user') {
                markdown += `## 用户\n\n`;
            } else if (role === 'assistant') {
                markdown += `## ChatGPT\n\n`;
            } else if (role === 'system') {
                markdown += `## 系统\n\n`;
            } else {
                markdown += `## ${role}\n\n`;
            }

            // 消息内容
            parts.forEach(part => {
                if (typeof part === 'string') {
                    markdown += part + '\n\n';
                }
            });

            // 时间戳
            if (msg.create_time) {
                markdown += `*${new Date(msg.create_time * 1000).toLocaleString()}*\n\n`;
            }

            markdown += '---\n\n';
        });

        return markdown;
    }

    /**
     * [新增] 简单的 Markdown 转 HTML
     * @param {string} text - Markdown 文本
     * @returns {string} - HTML 文本
     */
    function simpleMarkdownToHTML(text) {
        // HTML 转义
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        // 代码块 ```
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // 行内代码 `
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 粗体 **text** 或 __text__
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // 斜体 *text* 或 _text_
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // 标题 ## 
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // 分隔线 ---
        html = html.replace(/^---$/gm, '<hr>');

        // 无序列表 - 或 *
        html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // 链接 [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // 换行
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    /**
     * [新增] 将对话数据转换为 HTML 格式（气泡样式）
     * @param {Object} convData - 对话数据对象
     * @returns {string} - HTML 格式的对话内容
     */
    function convertToHTML(convData) {
        const title = convData.title || '无标题对话';
        const createTime = convData.create_time
            ? new Date(convData.create_time * 1000).toLocaleString('zh-CN')
            : '未知时间';

        let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #fff;
            color: #0d0d0d;
            line-height: 1.6;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            padding: 24px 0;
            margin-bottom: 24px;
        }
        h1 {
            font-size: 24px;
            font-weight: 600;
            color: #0d0d0d;
            margin-bottom: 8px;
        }
        .metadata {
            color: #6b7280;
            font-size: 14px;
        }
        .conversation {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .message-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .message-group.user {
            align-items: flex-end;
        }
        .message-group.assistant {
            align-items: flex-start;
        }
        .role-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 4px;
            padding: 0 12px;
        }
        .bubble {
            max-width: 90%;
            padding: 12px 16px;
            word-wrap: break-word;
            line-height: 1.6;
        }
        .bubble.user {
            background: #f4f4f4;
            color: #0d0d0d;
            border-radius: 18px;
            border-bottom-right-radius: 4px;
        }
        .bubble.assistant {
            color: #0d0d0d;
        }
        .bubble h1, .bubble h2, .bubble h3 {
            margin: 12px 0 8px 0;
            font-weight: 600;
        }
        .bubble h1 { font-size: 20px; }
        .bubble h2 { font-size: 18px; }
        .bubble h3 { font-size: 16px; }
        .bubble p {
            margin: 8px 0;
        }
        .bubble ul, .bubble ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        .bubble li {
            margin: 4px 0;
        }
        .bubble hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 12px 0;
        }
        .bubble a {
            color: #10a37f;
            text-decoration: none;
        }
        .bubble a:hover {
            text-decoration: underline;
        }
        .bubble strong {
            font-weight: 600;
        }
        .bubble em {
            font-style: italic;
        }
        .timestamp {
            font-size: 11px;
            color: #9ca3af;
            padding: 0 12px;
            margin-top: 4px;
        }
        .bubble code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #d63384;
        }
        .bubble pre {
            background: #1f2937;
            color: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
        }
        .bubble pre code {
            background: transparent;
            color: inherit;
            padding: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <div class="metadata">创建时间: ${createTime}</div>
        </div>
        <div class="conversation">
`;

        // 提取所有消息节点
        const mapping = convData.mapping || {};
        const messageNodes = [];

        for (const nodeId in mapping) {
            const node = mapping[nodeId];
            if (node.message && node.message.content && node.message.content.parts) {
                messageNodes.push(node);
            }
        }

        // 按创建时间排序
        messageNodes.sort((a, b) =>
            (a.message.create_time || 0) - (b.message.create_time || 0)
        );

        messageNodes.forEach((node) => {
            const msg = node.message;
            const role = msg.author?.role || 'unknown';
            const parts = msg.content.parts || [];

            // 跳过空消息
            const hasContent = parts.some(part => typeof part === 'string' && part.trim());
            if (!hasContent) return;

            // 角色标签和样式
            let roleLabel = '';
            let roleClass = '';
            if (role === 'user') {
                roleLabel = '用户';
                roleClass = 'user';
            } else if (role === 'assistant') {
                roleLabel = 'ChatGPT';
                roleClass = 'assistant';
            } else if (role === 'system') {
                roleLabel = '系统';
                roleClass = 'assistant';
            } else {
                roleLabel = role;
                roleClass = 'assistant';
            }

            html += `            <div class="message-group ${roleClass}">
                <div class="role-label">${roleLabel}</div>
                <div class="bubble ${roleClass}">`;

            // 消息内容 - 使用 Markdown 转换
            parts.forEach(part => {
                if (typeof part === 'string') {
                    html += simpleMarkdownToHTML(part);
                }
            });

            html += `</div>`;

            // 时间戳
            if (msg.create_time) {
                const timestamp = new Date(msg.create_time * 1000).toLocaleString('zh-CN');
                html += `
                <div class="timestamp">${timestamp}</div>`;
            }

            html += `
            </div>
`;
        });

        html += `        </div>
    </div>
</body>
</html>`;

        return html;
    }

    /**
     * [新增] 从Cookie中获取 oai-device-id
     * @returns {string|null} - 返回设备ID或null
     */
    function getOaiDeviceId() {
        const cookieString = document.cookie;
        const match = cookieString.match(/oai-did=([^;]+)/);
        return match ? match[1] : null;
    }

    function generateUniqueFilename(convData) {
        const shortId = convData.conversation_id.split('-').pop();
        let baseName = convData.title;
        if (!baseName || baseName.trim().toLowerCase() === 'new chat') {
            baseName = 'Untitled Conversation';
        }
        return `${sanitizeFilename(baseName)}_${shortId}.json`;
    }

    function downloadFile(blob, filename) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    // --- 导出流程核心逻辑 ---
    async function startExportProcess(mode, workspaceId, format = 'json', exportScope = 'all', selectedConversationIds = []) {
        const btn = document.getElementById('gpt-rescue-btn');
        btn.disabled = true;

        if (!await ensureAccessToken()) {
            btn.disabled = false;
            btn.textContent = '导出对话';
            return;
        }

        try {
            const zip = new JSZip();

            // 根据导出范围决定要导出的对话
            let conversationIdsToExport = [];

            if (exportScope === 'selected-conversations') {
                // 只导出选中的对话
                console.log(`📋 [导出] 选择性导出 ${selectedConversationIds.length} 个对话`);
                conversationIdsToExport = selectedConversationIds;
            } else {
                // 导出所有对话（包括项目外对话）
                btn.textContent = '获取项目外对话…';
                const orphanIds = await collectIds(btn, workspaceId, null);
                conversationIdsToExport = orphanIds;
            }

            // 导出对话
            for (let i = 0; i < conversationIdsToExport.length; i++) {
                btn.textContent = `导出对话 (${i + 1}/${conversationIdsToExport.length})`;
                const convData = await getConversation(conversationIdsToExport[i], workspaceId);

                // 根据格式选择保存文件
                if (format === 'json' || format === 'both') {
                    zip.file(generateUniqueFilename(convData), JSON.stringify(convData, null, 2));
                }
                if (format === 'markdown' || format === 'both') {
                    const mdFilename = generateUniqueFilename(convData).replace('.json', '.md');
                    zip.file(mdFilename, convertToMarkdown(convData));
                }
                if (format === 'html' || format === 'both') {
                    const htmlFilename = generateUniqueFilename(convData).replace('.json', '.html');
                    zip.file(htmlFilename, convertToHTML(convData));
                }

                await sleep(jitter());
            }

            btn.textContent = '生成 ZIP 文件…';
            const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
            const date = new Date().toISOString().slice(0, 10);
            const filename = mode === 'team'
                ? `chatgpt_team_backup_${workspaceId}_${date}.zip`
                : `chatgpt_personal_backup_${date}.zip`;
            downloadFile(blob, filename);

            // 显示成功提示
            showNotification('导出完成！', 'success');
            btn.textContent = '完成';

        } catch (e) {
            console.error("导出过程中发生严重错误:", e);
            showNotification(`导出失败: ${e.message}`, 'error');
            btn.textContent = '导出对话';
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = '导出对话';
            }, 3000);
        }
    }

    // --- API 调用函数 ---
    async function getProjects(workspaceId) {
        console.log('🔍 [getProjects] 开始获取项目列表');
        console.log('📋 [getProjects] Workspace ID:', workspaceId);

        if (!workspaceId) {
            console.warn('⚠️ [getProjects] Workspace ID 为空，返回空数组');
            return [];
        }

        const deviceId = getOaiDeviceId();
        console.log('🔑 [getProjects] Device ID:', deviceId);

        if (!deviceId) {
            console.error('❌ [getProjects] 无法获取 oai-device-id');
            throw new Error('无法获取 oai-device-id，请确保已登录并刷新页面。');
        }

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'ChatGPT-Account-Id': workspaceId,
            'oai-device-id': deviceId
        };

        console.log('📡 [getProjects] 发送请求到 /backend-api/gizmos/snorlax/sidebar');
        console.log('📋 [getProjects] Headers:', headers);

        const r = await fetch(`/backend-api/gizmos/snorlax/sidebar`, { headers });

        console.log('📥 [getProjects] 响应状态:', r.status, r.statusText);

        if (!r.ok) {
            console.error(`❌ [getProjects] 获取项目列表失败 (${r.status})`);
            const errorText = await r.text();
            console.error('❌ [getProjects] 错误详情:', errorText);
            return [];
        }

        const data = await r.json();
        console.log('📦 [getProjects] 原始响应数据:', data);
        console.log('📊 [getProjects] data.items 数量:', data.items?.length || 0);

        const projects = [];
        data.items?.forEach((item, index) => {
            console.log(`📌 [getProjects] 处理 item[${index}]:`, item);
            if (item?.gizmo?.id && item?.gizmo?.display?.name) {
                const project = { id: item.gizmo.id, title: item.gizmo.display.name };
                console.log(`✅ [getProjects] 添加项目:`, project);
                projects.push(project);
            } else {
                console.warn(`⚠️ [getProjects] 跳过 item[${index}]，缺少必要字段`);
            }
        });

        console.log(`✅ [getProjects] 完成！找到 ${projects.length} 个项目`);
        console.log('📋 [getProjects] 项目列表:', projects);

        return projects;
    }

    /**
     * [新增] 获取对话列表（用于选择性导出）
     * @param {string} workspaceId - Workspace ID
     * @param {number} limit - 最多获取多少个对话
     * @returns {Array} - 对话列表 [{id, title, create_time, update_time}]
     */
    async function collectIds(btn, workspaceId, gizmoId) {
        const all = new Set();
        const deviceId = getOaiDeviceId();
        if (!deviceId) {
            throw new Error('无法获取 oai-device-id，请确保已登录并刷新页面。');
        }
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'oai-device-id': deviceId
        };
        if (workspaceId) { headers['ChatGPT-Account-Id'] = workspaceId; }

        if (gizmoId) {
            let cursor = '0';
            do {
                const r = await fetch(`/backend-api/gizmos/${gizmoId}/conversations?cursor=${cursor}`, { headers });
                if (!r.ok) throw new Error(`列举项目对话列表失败 (${r.status})`);
                const j = await r.json();
                j.items?.forEach(it => all.add(it.id));
                cursor = j.cursor;
                await sleep(jitter());
            } while (cursor);
        } else {
            for (const is_archived of [false, true]) {
                let offset = 0, has_more = true, page = 0;
                do {
                    if (btn) btn.textContent = `项目外对话 (${is_archived ? 'Archived' : 'Active'} p${++page})`;
                    const r = await fetch(`/backend-api/conversations?offset=${offset}&limit=${PAGE_LIMIT}&order=updated${is_archived ? '&is_archived=true' : ''}`, { headers });
                    if (!r.ok) throw new Error(`列举项目外对话列表失败 (${r.status})`);
                    const j = await r.json();
                    if (j.items && j.items.length > 0) {
                        j.items.forEach(it => all.add(it.id));
                        has_more = j.items.length === PAGE_LIMIT;
                        offset += j.items.length;
                    } else {
                        has_more = false;
                    }
                    await sleep(jitter());
                } while (has_more);
            }
        }
        return Array.from(all);
    }

    async function getConversation(id, workspaceId) {
        const deviceId = getOaiDeviceId();
        if (!deviceId) {
            throw new Error('无法获取 oai-device-id，请确保已登录并刷新页面。');
        }
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'oai-device-id': deviceId
        };
        if (workspaceId) { headers['ChatGPT-Account-Id'] = workspaceId; }
        const r = await fetch(`/backend-api/conversation/${id}`, { headers });
        if (!r.ok) throw new Error(`获取对话详情失败 conv ${id} (${r.status})`);
        const j = await r.json();
        j.__fetched_at = new Date().toISOString();
        return j;
    }

    // --- UI 相关函数 ---
    // (UI部分无变动，此处省略以保持简洁)
    /**
     * [新增] 全面检测函数，返回所有找到的ID
     * @returns {string[]} - 返回包含所有唯一Workspace ID的数组
     */
    function detectAllWorkspaceIds() {
        const foundIds = new Set(capturedWorkspaceIds); // 从网络拦截的结果开始

        // 扫描 __NEXT_DATA__
        try {
            const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
            // 遍历所有账户信息
            const accounts = data?.props?.pageProps?.user?.accounts;
            if (accounts) {
                Object.values(accounts).forEach(acc => {
                    if (acc?.account?.id) {
                        foundIds.add(acc.account.id);
                    }
                });
            }
        } catch (e) { }

        // 扫描 localStorage
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('account') || key.includes('workspace'))) {
                    const value = localStorage.getItem(key);
                    if (value && /^[a-z0-9]{2,}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value.replace(/"/g, ''))) {
                        const extractedId = value.match(/ws-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
                        if (extractedId) foundIds.add(extractedId[0]);
                    } else if (value && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value.replace(/"/g, ''))) {
                        foundIds.add(value.replace(/"/g, ''));
                    }
                }
            }
        } catch (e) { }

        console.log('🔍 检测到以下 Workspace IDs:', Array.from(foundIds));
        return Array.from(foundIds);
    }

    /**
     * [重构] 多步骤、用户主导的导出对话框
     */
    function showExportDialog() {
        if (document.getElementById('export-dialog-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'export-dialog-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '99998',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });

        const dialog = document.createElement('div');
        dialog.id = 'export-dialog';
        Object.assign(dialog.style, {
            background: '#fff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)', width: '480px', maxWidth: '90vw',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#2d333a', boxSizing: 'border-box'
        });

        // 添加全局样式以修复 select 下拉选项样式
        if (!document.getElementById('export-dialog-styles')) {
            const style = document.createElement('style');
            style.id = 'export-dialog-styles';
            style.textContent = `
                #export-dialog select option {
                    background: #fff !important;
                    color: #0d0d0d !important;
                    padding: 8px !important;
                }
                #export-dialog select option:checked {
                    background: #f0f0f0 !important;
                }
                /* 自定义复选框样式 - 黑色 */
                .conversation-checkbox,
                input[type="checkbox"].conversation-checkbox {
                    accent-color: #0d0d0d !important;
                    -webkit-appearance: checkbox !important;
                    appearance: checkbox !important;
                }
                /* 针对 Chrome 的额外样式 */
                input[type="checkbox"].conversation-checkbox:checked {
                    background-color: #0d0d0d !important;
                    border-color: #0d0d0d !important;
                }
            `;
            document.head.appendChild(style);
        }

        const closeDialog = () => document.body.removeChild(overlay);

        const renderStep = (step) => {
            let html = '';
            switch (step) {
                case 'team':
                    const detectedIds = detectAllWorkspaceIds();
                    html = `<h2 style="margin-top:0; margin-bottom: 20px; font-size: 18px; color: #0d0d0d; font-weight: 600; line-height: 1.3;">导出团队空间</h2>`;

                    if (detectedIds.length > 1) {
                        html += `<div style="background: #f7f7f8; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                                     <p style="margin: 0 0 12px 0; font-weight: 500; color: #0d0d0d; font-size: 14px;">检测到多个 Workspace，请选择一个:</p>
                                     <div id="workspace-id-list">`;
                        detectedIds.forEach((id, index) => {
                            html += `<label style="display: flex; align-items: center; margin-bottom: 8px; padding: 10px; border-radius: 6px; cursor: pointer; border: 1px solid #d1d5db; background: #fff; transition: all 0.15s;">
                                         <input type="radio" name="workspace_id" value="${id}" ${index === 0 ? 'checked' : ''} style="margin-right: 10px;">
                                         <code style="font-family: 'SF Mono', Monaco, monospace; color: #565869; font-size: 13px;">${id}</code>
                                      </label>`;
                        });
                        html += `</div></div>`;
                    } else if (detectedIds.length === 1) {
                        html += `<div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                                     <p style="margin: 0 0 8px 0; font-weight: 500; color: #166534; font-size: 14px;">已自动检测到 Workspace ID</p>
                                     <code id="workspace-id-code" style="background: #fff; padding: 8px 10px; border-radius: 6px; font-family: 'SF Mono', Monaco, monospace; color: #565869; word-break: break-all; display: block; font-size: 13px; border: 1px solid #d1f4dd;">${detectedIds[0]}</code>
                                   </div>`;
                    } else {
                        html += `<div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                                     <p style="margin: 0; color: #92400e; font-weight: 500; font-size: 14px;">未能自动检测到 Workspace ID</p>
                                     <p style="margin: 6px 0 0 0; font-size: 13px; color: #78350f;">请尝试刷新页面或打开一个团队对话，或在下方手动输入。</p>
                                   </div>
                                   <label for="team-id-input" style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">手动输入 Team Workspace ID</label>
                                   <input type="text" id="team-id-input" placeholder="粘贴您的 Workspace ID (ws-...)" style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; color: #0d0d0d; box-sizing: border-box; font-size: 14px; outline: none; transition: border-color 0.15s;" onfocus="this.style.borderColor='#10a37f'" onblur="this.style.borderColor='#d1d5db'">`;
                    }

                    html += `<div style="margin-bottom: 20px;">
                                 <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">导出范围</label>
                                 <select id="export-scope" style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; color: #0d0d0d; box-sizing: border-box; font-size: 14px; cursor: pointer; outline: none;">
                                     <option value="all" selected>导出所有对话</option>
                                     <option value="selected-conversations">选择对话导出</option>
                                 </select>
                             </div>`;

                    // 对话选择器容器（初始隐藏）
                    html += `<div id="conversation-selector-container"></div>`;

                    html += `<div style="margin-bottom: 20px;">
                                 <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">导出格式</label>
                                 <select id="export-format" style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; color: #0d0d0d; box-sizing: border-box; font-size: 14px; cursor: pointer; outline: none;">
                                     <option value="json">仅 JSON（方便导入 GPT）</option>
                                     <option value="markdown" selected>仅 Markdown（方便存档笔记工具）</option>
                                     <option value="html">仅 HTML（可视化对话）</option>
                                     <option value="both">JSON + Markdown + HTML（全部格式）</option>
                                 </select>
                             </div>`;

                    html += `<div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 24px; gap: 8px;">
                                 <button id="back-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">返回</button>
                                 <button id="start-team-export-btn" style="padding: 8px 16px; border: none; border-radius: 6px; background: #10a37f; color: #fff; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.15s;" onmouseover="this.style.background='#0e9070'" onmouseout="this.style.background='#10a37f'">开始导出</button>
                               </div>`;
                    break;

                case 'initial':
                default:
                    html = `<h2 style="margin-top:0; margin-bottom: 20px; font-size: 18px; color: #0d0d0d; font-weight: 600; line-height: 1.3;">选择要导出的空间</h2>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <button id="select-personal-btn" style="padding: 16px; text-align: left; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; width: 100%; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'; this.style.borderColor='#9ca3af'" onmouseout="this.style.background='#fff'; this.style.borderColor='#d1d5db'">
                                        <strong style="font-size: 15px; color: #0d0d0d; display: block; margin-bottom: 4px; font-weight: 500;">个人空间</strong>
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">导出您个人账户下的所有对话</p>
                                    </button>
                                    <button id="select-team-btn" style="padding: 16px; text-align: left; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; width: 100%; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'; this.style.borderColor='#9ca3af'" onmouseout="this.style.background='#fff'; this.style.borderColor='#d1d5db'">
                                        <strong style="font-size: 15px; color: #0d0d0d; display: block; margin-bottom: 4px; font-weight: 500;">团队空间</strong>
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">导出团队空间下的对话，将自动检测ID</p>
                                    </button>
                                </div>
                                <div style="margin-top: 20px;">
                                    <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">导出格式</label>
                                    <select id="export-format-personal" style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; color: #0d0d0d; box-sizing: border-box; font-size: 14px; cursor: pointer; outline: none;">
                                        <option value="json">仅 JSON（方便导入 GPT）</option>
                                        <option value="markdown" selected>仅 Markdown（方便存档笔记工具）</option>
                                        <option value="html">仅 HTML（可视化对话）</option>
                                        <option value="both">JSON + Markdown + HTML（全部格式）</option>
                                    </select>
                                </div>
                                <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
                                    <button id="cancel-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">取消</button>
                                </div>`;
                    break;
            }
            dialog.innerHTML = html;
            attachListeners(step);
        };

        const attachListeners = (step) => {
            if (step === 'initial') {
                document.getElementById('select-personal-btn').onclick = () => {
                    const format = document.getElementById('export-format-personal')?.value || 'markdown';
                    closeDialog();
                    startExportProcess('personal', null, format);
                };
                document.getElementById('select-team-btn').onclick = () => renderStep('team');
                document.getElementById('cancel-btn').onclick = closeDialog;
            } else if (step === 'team') {
                document.getElementById('back-btn').onclick = () => renderStep('initial');

                // 监听导出范围变化
                const exportScopeSelect = document.getElementById('export-scope');
                if (exportScopeSelect) {
                    exportScopeSelect.addEventListener('change', async (e) => {
                        const container = document.getElementById('conversation-selector-container');
                        if (e.target.value === 'selected-conversations') {
                            // 显示加载状态
                            container.innerHTML = `<div style="text-align: center; padding: 20px; color: #6b7280;">加载对话列表...</div>`;

                            try {
                                // 获取 workspace ID
                                let workspaceId = '';
                                const radioChecked = document.querySelector('input[name="workspace_id"]:checked');
                                const codeEl = document.getElementById('workspace-id-code');
                                const inputEl = document.getElementById('team-id-input');

                                if (radioChecked) {
                                    workspaceId = radioChecked.value;
                                } else if (codeEl) {
                                    workspaceId = codeEl.textContent;
                                } else if (inputEl) {
                                    workspaceId = inputEl.value.trim();
                                }

                                if (!workspaceId) {
                                    container.innerHTML = `<div style="padding: 12px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; color: #92400e; font-size: 14px;">请先选择或输入 Workspace ID</div>`;
                                    return;
                                }

                                // 确保获取 access token
                                console.log('🔐 [对话选择器] 确保获取 access token...');
                                if (!await ensureAccessToken()) {
                                    container.innerHTML = `<div style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c00; font-size: 14px;">无法获取访问令牌，请刷新页面重试</div>`;
                                    return;
                                }
                                console.log('✅ [对话选择器] Access token 已获取');

                                // 获取所有对话 ID
                                const allIds = await collectIds(null, workspaceId, null);
                                console.log(`📊 [对话选择器] 找到 ${allIds.length} 个对话 ID`);

                                if (allIds.length === 0) {
                                    container.innerHTML = `<div style="padding: 12px; background: #f7f7f8; border: 1px solid #e5e5e5; border-radius: 8px; color: #6b7280; font-size: 14px;">未找到任何对话</div>`;
                                    return;
                                }

                                // 加载所有对话（不限制数量）
                                const idsToLoad = allIds;
                                const totalToLoad = idsToLoad.length;

                                // 创建容器框架（立即显示）
                                let html = `<div style="margin-bottom: 20px; max-height: 400px; overflow-y: auto; border: 1px solid #e5e5e5; border-radius: 8px; padding: 12px; background: #f7f7f8;">
                                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                                    <p id="conversation-count" style="margin: 0; font-weight: 500; color: #374151; font-size: 14px;">正在加载对话 (0/${totalToLoad})...</p>
                                                    <div>
                                                        <button id="select-all-conversations" style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; color: #374151; cursor: pointer; font-size: 12px; margin-right: 4px;">全选</button>
                                                        <button id="deselect-all-conversations" style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; color: #374151; cursor: pointer; font-size: 12px;">取消全选</button>
                                                    </div>
                                                </div>
                                                <div id="conversation-list-items"></div>
                                            </div>`;

                                container.innerHTML = html;

                                const listContainer = document.getElementById('conversation-list-items');
                                const countLabel = document.getElementById('conversation-count');

                                // 渐进式加载对话
                                let loadedCount = 0;
                                for (let i = 0; i < idsToLoad.length; i++) {
                                    try {
                                        console.log(`📥 [对话选择器] 加载对话 ${i + 1}/${totalToLoad}...`);
                                        const convData = await getConversation(idsToLoad[i], workspaceId);

                                        // 立即添加到列表
                                        const date = new Date(convData.update_time * 1000).toLocaleDateString('zh-CN');
                                        const itemHtml = `<label style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; border-radius: 8px; transition: all 0.15s; background: #fff; margin-bottom: 8px; border: 1px solid #e5e7eb;">
                                                             <div style="flex: 1; min-width: 0; margin-right: 12px;">
                                                                 <div style="color: #0d0d0d; font-size: 14px; font-weight: 500; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${convData.title || '无标题对话'}</div>
                                                                 <div style="color: #6b7280; font-size: 13px;">${date}</div>
                                                             </div>
                                                             <input type="checkbox" class="conversation-checkbox" name="selected-conversation" value="${idsToLoad[i]}" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                                                         </label>`;

                                        listContainer.insertAdjacentHTML('beforeend', itemHtml);
                                        loadedCount++;

                                        // 更新计数
                                        countLabel.textContent = `已加载 ${loadedCount}/${totalToLoad} 个对话`;

                                        // 添加悬停效果到新添加的元素
                                        const newLabel = listContainer.lastElementChild;
                                        newLabel.addEventListener('mouseenter', () => {
                                            newLabel.style.borderColor = '#10a37f';
                                            newLabel.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        });
                                        newLabel.addEventListener('mouseleave', () => {
                                            newLabel.style.borderColor = '#e5e7eb';
                                            newLabel.style.boxShadow = 'none';
                                        });

                                        // 每 10 个对话暂停一下
                                        if ((i + 1) % 10 === 0) {
                                            await sleep(500);
                                        }
                                    } catch (error) {
                                        console.warn(`⚠️ [对话选择器] 跳过对话 ${idsToLoad[i]}:`, error.message);
                                    }
                                }

                                // 加载完成
                                countLabel.textContent = `共 ${loadedCount} 个对话`;
                                console.log(`✅ [对话选择器] 完成！加载了 ${loadedCount} 个对话`);

                                // 添加全选/取消全选功能
                                document.getElementById('select-all-conversations').onclick = () => {
                                    document.querySelectorAll('.conversation-checkbox').forEach(cb => cb.checked = true);
                                };
                                document.getElementById('deselect-all-conversations').onclick = () => {
                                    document.querySelectorAll('.conversation-checkbox').forEach(cb => cb.checked = false);
                                };

                            } catch (error) {
                                console.error('❌ [对话选择器] 加载失败:', error);
                                container.innerHTML = `<div style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c00; font-size: 14px;">加载对话失败: ${error.message}</div>`;
                            }
                        } else {
                            // 隐藏对话选择器
                            container.innerHTML = '';
                        }
                    });
                }

                document.getElementById('start-team-export-btn').onclick = () => {
                    let workspaceId = '';
                    const radioChecked = document.querySelector('input[name="workspace_id"]:checked');
                    const codeEl = document.getElementById('workspace-id-code');
                    const inputEl = document.getElementById('team-id-input');

                    if (radioChecked) {
                        workspaceId = radioChecked.value;
                    } else if (codeEl) {
                        workspaceId = codeEl.textContent;
                    } else if (inputEl) {
                        workspaceId = inputEl.value.trim();
                    }

                    if (!workspaceId) {
                        alert('请选择或输入一个有效的 Team Workspace ID！');
                        return;
                    }

                    const format = document.getElementById('export-format')?.value || 'markdown';
                    const exportScope = document.getElementById('export-scope')?.value || 'all';

                    let selectedConversationIds = [];
                    if (exportScope === 'selected-conversations') {
                        const checkboxes = document.querySelectorAll('input[name="selected-conversation"]:checked');
                        selectedConversationIds = Array.from(checkboxes).map(cb => cb.value);

                        if (selectedConversationIds.length === 0) {
                            showNotification('请至少选择一个对话！', 'error');
                            return;
                        }
                    }

                    closeDialog();
                    startExportProcess('team', workspaceId, format, exportScope, selectedConversationIds);
                };
            }
        };

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) closeDialog(); };
        renderStep('initial');
    }

    function addBtn() {
        if (document.getElementById('gpt-rescue-btn')) return;
        const b = document.createElement('button');
        b.id = 'gpt-rescue-btn';
        b.textContent = '导出对话';
        Object.assign(b.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '99997',
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
            cursor: 'pointer', fontWeight: '500', background: '#fff', color: '#374151',
            fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.15s', userSelect: 'none'
        });
        b.onmouseover = () => {
            b.style.background = '#f9fafb';
            b.style.borderColor = '#9ca3af';
        };
        b.onmouseout = () => {
            b.style.background = '#fff';
            b.style.borderColor = '#d1d5db';
        };
        b.onclick = showExportDialog;
        document.body.appendChild(b);
    }

    // --- 脚本启动 ---
    setTimeout(addBtn, 2000);

})();