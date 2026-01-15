// ==UserScript==
// @name         ChatGPT 对话导出助手（每日自动备份 / JSON+Markdown）
// @version      1.0.0
// @description  支持团队/个人空间，一键导出所有对话为单个 JSON 与 Markdown，并支持每日自动备份的用户脚本。
// @author       vip@ggbond.edu.kg
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1377790
// @downloadURL https://update.greasyfork.org/scripts/562608/ChatGPT%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%EF%BC%88%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E5%A4%87%E4%BB%BD%20%20JSON%2BMarkdown%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562608/ChatGPT%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%EF%BC%88%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E5%A4%87%E4%BB%BD%20%20JSON%2BMarkdown%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // --- 配置与全局变量 ---
    const BASE_DELAY = 600;
    const JITTER = 400;
    const PAGE_LIMIT = 100;
    let accessToken = null;

    // --- 核心：网络拦截捕获 Token ---
    (function interceptNetwork() {
        const rawFetch = window.fetch;
        window.fetch = async function (resource, options) {
            tryCaptureToken(options?.headers);
            return rawFetch.apply(this, arguments);
        };

        const rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        tryCaptureToken(this.getRequestHeader('Authorization'));
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
        showToast('无法获取 Access Token，请刷新页面或打开任意一个对话后再试。', 'error', 4500);
        return null;
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const jitter = () => BASE_DELAY + Math.random() * JITTER;

    /**
     * [新增] 通用消息提示函数
     * @param {string} message - 提示消息
     * @param {string} type - 类型: 'info', 'success', 'warning', 'error'
     * @param {number} duration - 显示时长(毫秒)，默认3000
     */
    function showToast(message, type = 'info', duration = 3000) {
        const colors = {
            info: '#10a37f',
            success: '#10a37f',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        const icons = {
            info: 'ℹ️',
            success: '✓',
            warning: '⚠️',
            error: '✕'
        };

        // 同时输出到控制台
        console.log(`[ChatGPT Exporter] ${icons[type]} ${message}`);

        const toast = document.createElement('div');
        toast.className = 'chatgpt-exporter-toast';
        Object.assign(toast.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: '99999',
            padding: '12px 16px', borderRadius: '6px', background: colors[type], color: '#fff',
            fontFamily: '"Inter", "-apple-system", "Segoe UI", sans-serif', fontSize: '14px', fontWeight: '400',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: 'none',
            opacity: '0', transform: 'translateY(-10px)', transition: 'all 0.25s ease',
            maxWidth: '340px', wordBreak: 'break-word'
        });
        toast.innerHTML = `${icons[type]} ${message}`;

        // 处理多个 toast 堆叠
        const existingToasts = document.querySelectorAll('.chatgpt-exporter-toast');
        const offset = existingToasts.length * 60;
        toast.style.top = `${20 + offset}px`;

        document.body.appendChild(toast);

        // 动画显示
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // 自动移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 250);
        }, duration);
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

    function cleanMessageContent(text) {
        if (!text) return '';
        return text
            .replace(/\uE200cite(?:\uE202turn\d+(?:search|view)\d+)+\uE201/gi, '')
            .replace(/cite(?:turn\d+(?:search|view)\d+)+/gi, '')
            .trim();
    }

    function extractConversationMessages(convData) {
        const mapping = convData?.mapping;
        if (!mapping) return [];

        const messages = [];
        const mappingKeys = Object.keys(mapping);
        const rootId = mapping['client-created-root']
            ? 'client-created-root'
            : mappingKeys.find(id => !mapping[id]?.parent) || mappingKeys[0];
        const visited = new Set();

        const traverse = (nodeId) => {
            if (!nodeId || visited.has(nodeId)) return;
            visited.add(nodeId);
            const node = mapping[nodeId];
            if (!node) return;

            const msg = node.message;
            if (msg) {
                const author = msg.author?.role;
                const isHidden = msg.metadata?.is_visually_hidden_from_conversation ||
                    msg.metadata?.is_contextual_answers_system_message;
                if (author && author !== 'system' && !isHidden) {
                    const content = msg.content;
                    if (content?.content_type === 'text' && Array.isArray(content.parts)) {
                        const rawText = content.parts
                            .map(part => typeof part === 'string' ? part : (part?.text ?? ''))
                            .filter(Boolean)
                            .join('\n');
                        const cleaned = cleanMessageContent(rawText);
                        if (cleaned) {
                            messages.push({
                                role: author,
                                content: cleaned,
                                create_time: msg.create_time || null
                            });
                        }
                    }
                }
            }

            if (Array.isArray(node.children)) {
                node.children.forEach(childId => traverse(childId));
            }
        };

        if (rootId) {
            traverse(rootId);
        } else {
            mappingKeys.forEach(traverse);
        }

        return messages;
    }

    /**
     * 将对话转换为 Markdown 格式（带标题和文件夹信息）
     * 用于合并到单个 Markdown 文件时使用
     */
    function convertConversationToMarkdownWithTitle(convData, folderName) {
        const title = convData.title || '未命名对话';
        const convId = convData.conversation_id || '';
        const createTime = convData.create_time ? new Date(convData.create_time * 1000).toISOString() : '未知';

        const messages = extractConversationMessages(convData);

        let header = `# ${title}\n\n`;
        header += `- **对话 ID**: ${convId}\n`;
        if (folderName) {
            header += `- **所属项目**: ${folderName}\n`;
        }
        header += `- **创建时间**: ${createTime}\n\n`;

        if (messages.length === 0) {
            return header + '*未导出可见的用户或助手消息。*\n';
        }

        const mdLines = [header];
        messages.forEach(msg => {
            const roleLabel = msg.role === 'user' ? '## User' : '## Assistant';
            mdLines.push(roleLabel);
            mdLines.push(msg.content);
            mdLines.push('');
        });

        return mdLines.join('\n').trim() + '\n';
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
    function getExportButton() {
        let btn = document.getElementById('gpt-rescue-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'gpt-rescue-btn';
            btn.style.display = 'none';
            btn.textContent = '导出对话';
            document.body.appendChild(btn);
        }
        return btn;
    }

    async function startExportProcess(mode, workspaceId) {
        const btn = getExportButton();
        btn.disabled = true;

        if (!await ensureAccessToken()) {
            btn.disabled = false;
            btn.textContent = '导出对话';
            return;
        }

        try {
            // 收集所有对话数据
            const allConversations = [];  // 用于 JSON
            const allMarkdownParts = [];  // 用于 Markdown

            // 提醒用户速度与对话数量/网络相关
            showToast('正在准备导出，对话越多或网络越慢，耗时越长，请耐心等待…', 'info', 3800);

            btn.textContent = '📂 获取项目外对话…';
            const orphanIds = await collectIds(btn, workspaceId, null);
            for (let i = 0; i < orphanIds.length; i++) {
                btn.textContent = `📥 根目录 (${i + 1}/${orphanIds.length})`;
                const convData = await getConversation(orphanIds[i], workspaceId);
                allConversations.push({
                    _folder: null,
                    ...convData
                });
                allMarkdownParts.push(convertConversationToMarkdownWithTitle(convData, null));
                await sleep(jitter());
            }

            btn.textContent = '🔍 获取项目列表…';
            const projects = await getProjects(workspaceId);
            for (const project of projects) {
                btn.textContent = `📂 项目: ${project.title}`;
                const projectConvIds = await collectIds(btn, workspaceId, project.id);
                if (projectConvIds.length === 0) continue;

                for (let i = 0; i < projectConvIds.length; i++) {
                    btn.textContent = `📥 ${project.title.substring(0, 10)}... (${i + 1}/${projectConvIds.length})`;
                    const convData = await getConversation(projectConvIds[i], workspaceId);
                    allConversations.push({
                        _folder: project.title,
                        ...convData
                    });
                    allMarkdownParts.push(convertConversationToMarkdownWithTitle(convData, project.title));
                    await sleep(jitter());
                }
            }

            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
            const prefix = mode === 'team' ? 'chatgpt_team' : 'chatgpt_personal';

            // 生成单个 JSON 文件
            btn.textContent = `📄 生成 JSON 文件 (${allConversations.length} 对话)…`;
            showToast(`开始生成 JSON（${allConversations.length} 个对话）`, 'info', 2500);
            const jsonContent = JSON.stringify({
                exported_at: now.toISOString(),
                mode: mode,
                workspace_id: workspaceId,
                total_conversations: allConversations.length,
                conversations: allConversations
            }, null, 2);
            const blobJson = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
            downloadFile(blobJson, `${prefix}_${dateStr}_${timeStr}.json`);

            // 生成单个 Markdown 文件
            btn.textContent = `📄 生成 Markdown 文件…`;
            showToast(`开始生成 Markdown（${allMarkdownParts.length} 个对话）`, 'info', 2500);
            const mdHeader = `# ChatGPT 对话导出\n\n- 导出时间: ${now.toISOString()}\n- 模式: ${mode}\n- 对话数量: ${allConversations.length}\n\n---\n\n`;
            const mdContent = mdHeader + allMarkdownParts.join('\n\n---\n\n');
            const blobMd = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
            downloadFile(blobMd, `${prefix}_${dateStr}_${timeStr}.md`);

            showToast(`✅ 导出完成，生成 2 个文件（${allConversations.length} 个对话）`, 'success', 4000);
            btn.textContent = '✅ 完成';

        } catch (e) {
            console.error("导出过程中发生严重错误:", e);
            showToast(`导出失败: ${e.message}`, 'error', 5000);
            btn.textContent = '⚠️ Error';
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = '导出对话';
            }, 3000);
        }
    }

    function startScheduledExport(options = {}) {
        const { mode = 'personal', workspaceId = null, autoConfirm = false, source = 'schedule' } = options;
        const proceed = async () => {
            try {
                await startExportProcess(mode, workspaceId);
            } catch (err) {
                console.error('[ChatGPT Exporter] 自动导出失败:', err);
            }
        };

        if (autoConfirm) {
            proceed();
            return;
        }

        const modeLabel = mode === 'team' ? '团队空间' : '个人空间';
        if (confirm(`Chrome 扩展请求导出 ${modeLabel} 对话（来源: ${source}）。是否开始？`)) {
            proceed();
        }
    }

    // --- API 调用函数 ---
    async function getProjects(workspaceId) {
        if (!workspaceId) return [];
        const deviceId = getOaiDeviceId();
        if (!deviceId) {
            throw new Error('无法获取 oai-device-id，请确保已登录并刷新页面。');
        }
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'ChatGPT-Account-Id': workspaceId,
            'oai-device-id': deviceId
        };
        const r = await fetch(`/backend-api/gizmos/snorlax/sidebar`, { headers });
        if (!r.ok) {
            showToast(`获取项目列表失败 (${r.status})`, 'warning', 4000);
            return [];
        }
        const data = await r.json();
        const projects = [];
        data.items?.forEach(item => {
            if (item?.gizmo?.id && item?.gizmo?.display?.name) {
                projects.push({ id: item.gizmo.id, title: item.gizmo.display.name });
            }
        });
        return projects;
    }

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
                    btn.textContent = `📂 项目外对话 (${is_archived ? 'Archived' : 'Active'} p${++page})`;
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
        return JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(j))));
    }

    // --- UI 相关函数 ---
    /**
     * 获取当前工作空间ID（从 localStorage._account 获取）
     * @returns {string|null} - 返回工作空间ID，如果是个人空间则返回null
     */
    function getCurrentWorkspaceId() {
        const accountValue = localStorage.getItem('_account');
        if (!accountValue || accountValue === 'personal' || accountValue === '"personal"') {
            return null;
        }
        // 去掉可能的引号
        return accountValue.replace(/^"|"$/g, '');
    }

    /**
     * 简化版导出对话框 - 一次性显示所有选项
     */
    function showExportDialog() {
        if (document.getElementById('export-dialog-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'export-dialog-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)', zIndex: '99998',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });

        const dialog = document.createElement('div');
        dialog.id = 'export-dialog';
        Object.assign(dialog.style, {
            background: '#ffffff', padding: '28px', borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.16)', width: '440px',
            fontFamily: '"Inter", "-apple-system", "Segoe UI", sans-serif', color: '#353b44', boxSizing: 'border-box',
            border: '1px solid #d1d5db', lineHeight: '1.5'
        });

        const closeDialog = () => document.body.removeChild(overlay);
        const currentWorkspaceId = getCurrentWorkspaceId();
        const hasWorkspace = !!currentWorkspaceId;

        let html = `<h2 style="margin-top:0; margin-bottom: 20px; font-size: 20px; font-weight: 600; color: #353b44;">导出对话</h2>`;

        html += `<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    <button id="export-personal-btn" style="padding: 14px 16px; text-align: left; border: 1px solid #d1d5db; border-radius: 6px; background: #f7f7f7; cursor: pointer; width: 100%; box-shadow: none; color: #353b44; transition: all 0.15s; font-family: inherit;">
                        <strong style="font-size: 14px; display: block; margin-bottom: 2px; color: #353b44;">导出个人</strong>
                        <span style="margin: 0; color: #6b7280; font-size: 12px;">导出您个人账户下的所有对话</span>
                    </button>`;

        if (hasWorkspace) {
            html += `<button id="export-team-btn" style="padding: 14px 16px; text-align: left; border: 1px solid #d1d5db; border-radius: 6px; background: #f7f7f7; cursor: pointer; width: 100%; box-shadow: none; color: #353b44; transition: all 0.15s; font-family: inherit;">
                        <strong style="font-size: 14px; display: block; margin-bottom: 2px; color: #353b44;">导出工作空间</strong>
                        <span style="margin: 0; color: #6b7280; font-size: 12px;">${currentWorkspaceId}</span>
                    </button>`;
        } else {
            html += `<button id="export-team-btn" disabled style="padding: 14px 16px; text-align: left; border: 1px solid #e5e7eb; border-radius: 6px; background: #f3f4f6; cursor: not-allowed; width: 100%; box-shadow: none; color: #9ca3af; opacity: 0.6; font-family: inherit;">
                        <strong style="font-size: 14px; display: block; margin-bottom: 2px; color: #9ca3af;">导出工作空间</strong>
                        <span style="margin: 0; color: #d1d5db; font-size: 12px;">请先进入工作空间</span>
                    </button>`;
        }

        html += `</div>
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button id="close-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: #ffffff; cursor: pointer; color: #353b44; font-weight: 500; transition: all 0.15s; font-size: 13px; font-family: inherit;">关闭</button>
                </div>`;

        dialog.innerHTML = html;
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 事件监听 - 必须在元素插入DOM后才能获取
        const personalBtn = document.getElementById('export-personal-btn');
        const teamBtn = document.getElementById('export-team-btn');
        const closeBtn = document.getElementById('close-btn');

        if (personalBtn) {
            personalBtn.onclick = () => {
                closeDialog();
                startExportProcess('personal', null);
            };
        }

        if (hasWorkspace && teamBtn) {
            teamBtn.onclick = () => {
                closeDialog();
                startExportProcess('team', currentWorkspaceId);
            };
        }

        if (closeBtn) {
            closeBtn.onclick = closeDialog;
        }

        overlay.onclick = (e) => { if (e.target === overlay) closeDialog(); };
    }

    function addBtn() {
        if (document.getElementById('gpt-exporter-container')) return;

        // 创建容器
        const container = document.createElement('div');
        container.id = 'gpt-exporter-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: '99997',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: '"Inter", "-apple-system", "Segoe UI", sans-serif'
        });

        // 文字按钮（默认隐藏）
        const textBtn = document.createElement('button');
        textBtn.id = 'gpt-exporter-text-btn';
        textBtn.textContent = '导出对话';
        Object.assign(textBtn.style, {
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            background: '#10a37f',
            color: '#fff',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(16, 163, 127, 0.3)',
            userSelect: 'none',
            letterSpacing: '0',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            opacity: '0',
            visibility: 'hidden',
            transform: 'translateX(10px)',
            pointerEvents: 'none'
        });

        // 图标按钮
        const iconBtn = document.createElement('button');
        iconBtn.id = 'gpt-exporter-icon-btn';
        Object.assign(iconBtn.style, {
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#10a37f',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 163, 127, 0.3)',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px'
        });
        iconBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" class="icon-lg" style="fill: currentColor;"><use href="/cdn/assets/sprites-core-jtokmzgv.svg#55180d"></use></svg>';

        // 鼠标进入容器时显示文字
        container.addEventListener('mouseenter', () => {
            textBtn.style.opacity = '1';
            textBtn.style.visibility = 'visible';
            textBtn.style.transform = 'translateX(0)';
            textBtn.style.pointerEvents = 'auto';
            iconBtn.style.opacity = '0.8';
        });

        // 鼠标离开容器时隐藏文字
        container.addEventListener('mouseleave', () => {
            textBtn.style.opacity = '0';
            textBtn.style.visibility = 'hidden';
            textBtn.style.transform = 'translateX(10px)';
            textBtn.style.pointerEvents = 'none';
            iconBtn.style.opacity = '1';
        });

        // 按钮点击事件
        const handleClick = () => showExportDialog();
        textBtn.onclick = handleClick;
        iconBtn.onclick = handleClick;

        container.appendChild(textBtn);
        container.appendChild(iconBtn);
        document.body.appendChild(container);
    }

    // --- 自动导出功能 ---
    const AUTO_EXPORT_KEY = 'chatgpt_exporter_last_auto_export';
    let autoExportTriggered = false; // 防止重复触发

    function getTodayDateString() {
        return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    }

    function shouldAutoExportToday() {
        const lastExportDate = GM_getValue(AUTO_EXPORT_KEY, '');
        const today = getTodayDateString();
        return lastExportDate !== today;
    }

    function markAutoExportDone() {
        GM_setValue(AUTO_EXPORT_KEY, getTodayDateString());
    }

    async function triggerAutoExport(workspaceId) {
        // 防止重复触发
        if (autoExportTriggered) return;
        autoExportTriggered = true;

        // 检查是否今天已经导出过
        if (!shouldAutoExportToday()) {
            showToast('今天已自动导出过，跳过', 'info', 3000);
            return;
        }

        // 确保有 accessToken
        if (!await ensureAccessToken()) {
            showToast('无法获取 accessToken，跳过自动导出', 'warning', 3000);
            autoExportTriggered = false; // 允许重试
            return;
        }

        showToast('检测到今日还没备份，开始自动导出备份', 'info', 3000);

        try {
            await startExportProcess('team', workspaceId);

            // 标记今天已导出
            markAutoExportDone();

            showToast('自动导出完成！', 'success', 5000);
        } catch (e) {
            console.error('[ChatGPT Exporter] 自动导出失败:', e);
            showToast(`自动导出失败: ${e.message}`, 'error', 5000);
        }
    }

    // 页面加载后主动检查工作空间（使用 localStorage._account）
    async function checkAutoExportOnLoad() {
        // 等待页面完全加载
        await sleep(3000);

        // 如果已经触发过，跳过
        if (autoExportTriggered || !shouldAutoExportToday()) {
            if (!shouldAutoExportToday()) {
                showToast('今天已自动导出过，跳过', 'info', 3000);
            }
            return;
        }

        // 获取当前工作空间ID
        const workspaceId = getCurrentWorkspaceId();

        if (!workspaceId) {
            showToast('当前在个人空间，跳过自动导出', 'info', 3000);
            return;
        }

        showToast(`检测到工作空间: ${workspaceId.slice(0, 8)}...`, 'info', 2000);
        triggerAutoExport(workspaceId);
    }

    // --- 脚本启动 ---
    if (document.readyState === 'complete') {
        addBtn();
        checkAutoExportOnLoad();
    } else {
        window.addEventListener('load', () => {
            addBtn();
            checkAutoExportOnLoad();
        });
    }

    window.ChatGPTExporter = window.ChatGPTExporter || {};
    Object.assign(window.ChatGPTExporter, {
        showDialog: showExportDialog,
        startManualExport: (mode = 'personal', workspaceId = null) => startExportProcess(mode, workspaceId),
        startScheduledExport
    });

    document.documentElement.setAttribute('data-chatgpt-exporter-ready', '1');
    window.dispatchEvent(new CustomEvent('CHATGPT_EXPORTER_READY'));

    window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        const data = event.data || {};
        if (data?.type !== 'CHATGPT_EXPORTER_COMMAND') return;
        const api = window.ChatGPTExporter;
        if (!api) return;
        try {
            switch (data.action) {
                case 'START_SCHEDULED_EXPORT':
                    api.startScheduledExport(data.payload || {});
                    break;
                case 'OPEN_DIALOG':
                    api.showDialog();
                    break;
                case 'START_MANUAL_EXPORT':
                    api.startManualExport(data.payload?.mode, data.payload?.workspaceId);
                    break;
                default:
                    console.warn('[ChatGPT Exporter] 未知命令:', data.action);
            }
        } catch (err) {
            console.error('[ChatGPT Exporter] 处理命令失败:', err);
        }
    });

})();