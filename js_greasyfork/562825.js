// ==UserScript==
// @name         ChatGPT Universal Exporter (Pro)
// @version      2.1.1
// @description  Fixed "No Reaction" issue. Adds immediate scanning UI feedback and robust error handling. Floating UI style.
// @author       huhu
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @license      MIT
// @source       https://greasyfork.org/scripts/538495-chatgpt-universal-exporter
// @namespace    https://github.com/huhusmang/ChatGPT-Exporter
// @downloadURL https://update.greasyfork.org/scripts/562825/ChatGPT%20Universal%20Exporter%20%28Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562825/ChatGPT%20Universal%20Exporter%20%28Pro%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置 ---
    const BASE_DELAY = 600;
    const JITTER = 400;
    const PAGE_LIMIT = 50; 
    let accessToken = null;
    let capturedWorkspaceIds = new Set(); 

    // --- 1. 网络拦截 (保持 v1.0.0 的强力检测逻辑) ---
    (function interceptNetwork() {
        const rawFetch = window.fetch;
        window.fetch = async function (resource, options) {
            tryCaptureToken(options?.headers);
            if (options?.headers?.['ChatGPT-Account-Id']) {
                const id = options.headers['ChatGPT-Account-Id'];
                if (id && !capturedWorkspaceIds.has(id)) {
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
                            capturedWorkspaceIds.add(id);
                        }
                    } catch (_) {}
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
            if (token && token.toLowerCase() !== 'dummy') accessToken = token;
        }
    }

    async function ensureAccessToken() {
        if (accessToken) return accessToken;
        try {
            const session = await (await fetch('/api/auth/session?unstable_client=true')).json();
            if (session.accessToken) { accessToken = session.accessToken; return accessToken; }
        } catch (e) { console.error('Token fetch error', e); }
        alert('无法获取 Access Token。请刷新页面或打开任意一个对话后再试。');
        return null;
    }

    // --- 2. 辅助函数 ---
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const jitter = () => BASE_DELAY + Math.random() * JITTER;
    const sanitizeFilename = (name) => name.replace(/[\/\\?%*:|"<>]/g, '-').trim();
    
    function getOaiDeviceId() { 
        const m = document.cookie.match(/oai-did=([^;]+)/); 
        return m ? m[1] : null; 
    }

    // --- 3. 核心 API 请求逻辑 ---

    // 获取项目列表 (GPTs)
    async function getProjects(workspaceId) {
        if (!workspaceId) return [];
        const deviceId = getOaiDeviceId();
        const headers = { 'Authorization': `Bearer ${accessToken}`, 'ChatGPT-Account-Id': workspaceId, 'oai-device-id': deviceId };
        try {
            const r = await fetch(`/backend-api/gizmos/snorlax/sidebar`, { headers });
            if (!r.ok) return [];
            const data = await r.json();
            const projects = [];
            data.items?.forEach(item => {
                if (item?.gizmo?.id && item?.gizmo?.display?.name) {
                    projects.push({ id: item.gizmo.id, title: item.gizmo.display.name });
                }
            });
            return projects;
        } catch (e) { console.error('Get Projects Failed', e); return []; }
    }

    // 通用获取列表函数
    async function fetchListFromEndpoint(endpoint, workspaceId, sourceLabel, statusCallback) {
        const list = [];
        const deviceId = getOaiDeviceId();
        const headers = { 'Authorization': `Bearer ${accessToken}`, 'oai-device-id': deviceId };
        if (workspaceId) headers['ChatGPT-Account-Id'] = workspaceId;

        const isGizmo = endpoint.includes('/gizmos/');
        let hasMore = true;
        let offset = 0;
        let cursor = null;
        let pageCount = 0;

        // 限制扫描页数，防止卡死
        while (hasMore && pageCount < 5) {
            let url = endpoint;
            if (isGizmo) {
                url += `?limit=${PAGE_LIMIT}${cursor ? '&cursor='+cursor : ''}`;
            } else {
                url += `?offset=${offset}&limit=${PAGE_LIMIT}&order=updated`;
            }

            try {
                if(statusCallback) statusCallback(`正在读取 ${sourceLabel} (页数 ${pageCount+1})...`);
                const r = await fetch(url, { headers });
                if (!r.ok) break;
                const j = await r.json();
                
                if (j.items && j.items.length > 0) {
                    j.items.forEach(it => {
                        list.push({
                            id: it.id,
                            title: it.title || 'Untitled',
                            source: sourceLabel 
                        });
                    });
                    
                    if (isGizmo) {
                        if (j.cursor) cursor = j.cursor; else hasMore = false;
                    } else {
                        offset += j.items.length;
                        if (j.items.length < PAGE_LIMIT) hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
                pageCount++;
                await sleep(150);
            } catch (e) { console.error(e); break; }
        }
        return list;
    }

    // [核心] 扫描总指挥
    async function fetchAllConversations(workspaceId, updateStatus) {
        let allConversations = [];

        // 1. 扫描主对话列表
        updateStatus('🔍 正在扫描主对话列表...');
        const mainList = await fetchListFromEndpoint(`/backend-api/conversations`, workspaceId, 'Main Chat', updateStatus);
        allConversations = allConversations.concat(mainList);

        // 2. 扫描项目
        if (workspaceId) {
            updateStatus('🔍 正在获取项目列表...');
            const projects = await getProjects(workspaceId);
            
            for (let i = 0; i < projects.length; i++) {
                const proj = projects[i];
                updateStatus(`🔍 扫描项目 (${i+1}/${projects.length}): ${proj.title.substring(0,10)}...`);
                
                const projList = await fetchListFromEndpoint(
                    `/backend-api/gizmos/${proj.id}/conversations`, 
                    workspaceId, 
                    `Project: ${proj.title}`,
                    null // 子循环不频繁更新UI以免闪烁
                );
                allConversations = allConversations.concat(projList);
                await sleep(jitter());
            }
        }

        return allConversations;
    }

    // --- 4. 数据导出与格式化 ---
    async function getConversation(id, workspaceId) {
        const headers = { 'Authorization': `Bearer ${accessToken}`, 'oai-device-id': getOaiDeviceId() };
        if (workspaceId) headers['ChatGPT-Account-Id'] = workspaceId;
        const r = await fetch(`/backend-api/conversation/${id}`, { headers });
        if(!r.ok) throw new Error('Fetch failed ' + r.status);
        return await r.json();
    }

    function generateUniqueFilename(d) { return `${sanitizeFilename(d.title)}_${d.conversation_id.slice(-6)}.json`; }
    function generateMarkdownFilename(d) { return generateUniqueFilename(d).replace('.json', '.md'); }
    function cleanMessageContent(t) { return t ? t.replace(/\uE200cite.*?\uE201/gi, '').trim() : ''; }
    
    function convertConversationToMarkdown(d) {
        const m = d?.mapping; if (!m) return '';
        const roots = Object.keys(m).filter(k => !m[k].parent);
        let out = [];
        const traverse = (nid) => {
            const node = m[nid];
            if (node?.message?.content?.parts) {
                const role = node.message.author.role;
                const text = node.message.content.parts.join('');
                if (text && role !== 'system') out.push(`### ${role}\n${text}\n`);
            }
            node?.children?.forEach(traverse);
        };
        roots.forEach(traverse);
        return out.join('\n');
    }

    function downloadFile(blob, filename) {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // --- 5. UI 逻辑 ---
    
    // [修复] 独立的扫描状态界面
    function renderScanningUI(msg) {
        const dialog = document.getElementById('export-dialog');
        if(!dialog) return;
        dialog.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px;">
                <div style="font-size:24px; margin-bottom:15px;">⏳</div>
                <h3 style="margin:0 0 10px 0;">正在扫描对话</h3>
                <p id="cge-scan-status" style="color:#666; font-size:14px; text-align:center;">${msg}</p>
            </div>
        `;
    }

    function updateScanningText(msg) {
        const el = document.getElementById('cge-scan-status');
        if(el) el.textContent = msg;
    }

    // 步骤 1: 开始流程
    async function startScanAndSelect(workspaceId) {
        console.log("Start scanning for workspace:", workspaceId);
        
        // 1. 立即切换界面，防止“无反应”
        renderScanningUI("准备开始...");

        // 2. 检查权限
        if (!await ensureAccessToken()) { 
            alert("获取 Token 失败，请刷新页面");
            showExportDialog(); // 回到主页
            return; 
        }

        try {
            // 3. 执行扫描
            const list = await fetchAllConversations(workspaceId, updateScanningText);
            
            // 4. 渲染结果
            renderSelectionScreen(list, workspaceId);
        } catch (e) {
            console.error(e);
            alert('扫描失败: ' + e.message);
            showExportDialog(); // 回到主页
        }
    }

    // 步骤 2: 渲染列表
    function renderSelectionScreen(list, workspaceId) {
        const dialog = document.getElementById('export-dialog');
        if (!dialog) return;
        
        let html = `
            <h2 style="margin-top:0; font-size:18px; display:flex; justify-content:space-between; align-items:center;">
                <span>选择对话</span>
                <span style="font-size:12px; color:#666; font-weight:normal;">共 ${list.length} 个</span>
            </h2>
            <div style="margin-bottom:10px; display:flex; gap:10px;">
                <input type="text" id="cge-search" placeholder="搜索..." style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;">
                <button id="cge-sel-all" style="padding:4px 8px; font-size:12px;">全选</button>
                <button id="cge-sel-none" style="padding:4px 8px; font-size:12px;">清空</button>
            </div>
            <div id="cge-list-container" style="height:300px; overflow-y:auto; border:1px solid #eee; border-radius:4px; padding:5px;">
                ${list.length === 0 ? '<p style="text-align:center; color:#999; margin-top:20px;">未找到任何对话<br>可能是权限不足或列表为空</p>' : ''}
                ${list.map(item => {
                    const isProject = item.source.startsWith('Project');
                    const badgeColor = isProject ? '#e0f2fe' : '#f3f4f6';
                    const badgeText = isProject ? '#0369a1' : '#374151';
                    
                    return `
                    <div class="cge-item" data-title="${item.title.toLowerCase()}" style="display:flex; align-items:center; padding:8px 6px; border-bottom:1px solid #f9f9f9;">
                        <input type="checkbox" class="cge-chk" value="${item.id}" style="margin-right:10px;">
                        <div style="overflow:hidden;">
                            <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:13px; font-weight:500;" title="${item.title}">${item.title}</div>
                            <div style="font-size:10px; background:${badgeColor}; color:${badgeText}; display:inline-block; padding:1px 4px; border-radius:4px; margin-top:2px;">${item.source}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center;">
                <button id="cge-back-step" style="padding:8px 12px; border:1px solid #ccc; background:#fff; border-radius:6px; cursor:pointer;">返回</button>
                <button id="cge-confirm-export" style="padding:8px 16px; border:none; background:#10a37f; color:#fff; border-radius:6px; font-weight:bold; cursor:pointer;">
                    导出选中 (0)
                </button>
            </div>
        `;
        dialog.innerHTML = html;

        // 绑定事件
        const updateCount = () => {
            const count = document.querySelectorAll('.cge-chk:checked').length;
            document.getElementById('cge-confirm-export').textContent = `导出选中 (${count})`;
        };
        
        document.querySelectorAll('.cge-chk').forEach(cb => cb.onchange = updateCount);
        
        document.getElementById('cge-sel-all').onclick = () => {
            document.querySelectorAll('.cge-item:not([style*="display: none"]) .cge-chk').forEach(c => c.checked = true);
            updateCount();
        };
        document.getElementById('cge-sel-none').onclick = () => {
            document.querySelectorAll('.cge-chk').forEach(c => c.checked = false);
            updateCount();
        };
        
        document.getElementById('cge-search').oninput = (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.cge-item').forEach(row => {
                row.style.display = row.getAttribute('data-title').includes(term) ? 'flex' : 'none';
            });
        };

        document.getElementById('cge-back-step').onclick = () => {
            showExportDialog(); 
        };

        document.getElementById('cge-confirm-export').onclick = async () => {
            const selectedIds = Array.from(document.querySelectorAll('.cge-chk:checked')).map(c => c.value);
            if(selectedIds.length === 0) return alert('请选择！');
            await executeExport(selectedIds, list, workspaceId, document.getElementById('cge-confirm-export'));
        };
    }

    // 步骤 3: 导出执行
    async function executeExport(ids, fullList, workspaceId, btn) {
        btn.disabled = true;
        const zip = new JSZip();
        try {
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const meta = fullList.find(x => x.id === id);
                btn.textContent = `处理中 ${i+1}/${ids.length}`;
                
                const data = await getConversation(id, workspaceId);
                if (meta && meta.title) data.title = meta.title;
                
                let folder = zip;
                if (meta.source.startsWith('Project: ')) {
                    const folderName = sanitizeFilename(meta.source.replace('Project: ', ''));
                    folder = zip.folder(folderName);
                }

                folder.file(generateUniqueFilename(data), JSON.stringify(data, null, 2));
                folder.file(generateMarkdownFilename(data), convertConversationToMarkdown(data));
                await sleep(jitter());
            }
            btn.textContent = '打包中...';
            const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
            downloadFile(blob, `chatgpt_export_${new Date().toISOString().slice(0,10)}.zip`);
            btn.textContent = '✅ 完成';
            setTimeout(() => { 
                // 导出完成后不直接关闭，给用户一个反馈，或者可以选择返回
                alert('导出完成！');
                showExportDialog();
            }, 500);
        } catch(e) { alert('Err: ' + e.message); btn.disabled = false; }
    }

    // --- UI 主入口 ---
    function detectAllWorkspaceIds() {
        const foundIds = new Set(capturedWorkspaceIds);
        try {
            const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
            Object.values(data?.props?.pageProps?.user?.accounts || {}).forEach(acc => {
                if (acc?.account?.id) foundIds.add(acc.account.id);
            });
        } catch (e) {}
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('account') || key.includes('workspace'))) {
                    const value = localStorage.getItem(key);
                    const match = value?.match(/ws-[a-f0-9-]{36}|[a-f0-9-]{36}/i);
                    if(match) foundIds.add(match[0]);
                }
            }
        } catch(e) {}
        return Array.from(foundIds);
    }

    function showExportDialog() {
        if (document.getElementById('export-dialog-overlay')) {
            // 如果已存在，先移除旧的，重新渲染，保证状态重置
            document.body.removeChild(document.getElementById('export-dialog-overlay'));
        }

        const overlay = document.createElement('div'); overlay.id = 'export-dialog-overlay';
        Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '99998', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        
        const dialog = document.createElement('div'); dialog.id = 'export-dialog';
        Object.assign(dialog.style, { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,.3)', width: '450px', fontFamily: 'sans-serif', color: '#333' });
        
        const renderStep = (step) => {
            let html = '';
            if (step === 'team') {
                const ids = detectAllWorkspaceIds();
                html = `<h2 style="margin-top:0;">导出团队空间</h2>`;
                if(ids.length > 0) {
                    html += `<div style="background:#eef2ff; border:1px solid #818cf8; border-radius:8px; padding:10px; margin-bottom:15px;"><p style="margin:0 0 5px 0; font-weight:bold; color:#4338ca;">🔎 检测到 ID (选择一个):</p>`;
                    ids.forEach((id, i) => html += `<label style="display:block; margin:5px 0;"><input type="radio" name="ws_id" value="${id}" ${i===0?'checked':''}> <code style="color:#555">${id}</code></label>`);
                    html += `</div>`;
                } else {
                    html += `<p style="color:#92400e; font-size:12px; background:#fffbeb; padding:10px; border-radius:6px;">⚠️ 未检测到 ID，请尝试刷新页面或打开团队对话。或手动输入：</p>
                    <input type="text" id="manual_id" placeholder="ws-..." style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;">`;
                }
                html += `<div style="display:flex; justify-content:space-between; margin-top:20px;"><button id="back-btn" style="padding:8px 12px; border:1px solid #ccc; background:#fff; border-radius:6px;">返回</button><button id="scan-btn" style="padding:8px 16px; border:none; background:#10a37f; color:#fff; border-radius:6px; font-weight:bold;">扫描并选择</button></div>`;
            } else {
                html = `<h2 style="margin-top:0;">选择空间</h2>
                <button id="sel-personal" style="width:100%; padding:15px; margin-bottom:10px; text-align:left; border:1px solid #ccc; border-radius:8px; background:#f9fafb; cursor:pointer;"><strong>个人空间</strong><p style="margin:5px 0 0; color:#666; font-size:12px;">个人账户的所有对话</p></button>
                <button id="sel-team" style="width:100%; padding:15px; text-align:left; border:1px solid #ccc; border-radius:8px; background:#f9fafb; cursor:pointer;"><strong>团队空间</strong><p style="margin:5px 0 0; color:#666; font-size:12px;">团队/企业版对话 (含项目)</p></button>
                <div style="text-align:right; margin-top:20px;"><button id="cancel-btn" style="padding:8px 12px; border:1px solid #ccc; background:#fff; border-radius:6px;">取消</button></div>`;
            }
            dialog.innerHTML = html;
            
            if(step === 'initial') {
                document.getElementById('sel-personal').onclick = () => { startScanAndSelect(null); }; 
                document.getElementById('sel-team').onclick = () => renderStep('team');
                document.getElementById('cancel-btn').onclick = () => document.body.removeChild(overlay);
            } else {
                document.getElementById('back-btn').onclick = () => renderStep('initial');
                document.getElementById('scan-btn').onclick = () => {
                    const radio = document.querySelector('input[name="ws_id"]:checked');
                    const manual = document.getElementById('manual_id');
                    const id = radio ? radio.value : (manual ? manual.value.trim() : null);
                    if(id) {
                        startScanAndSelect(id);
                    } else { alert('请输入或选择 ID'); }
                };
            }
        };
        
        overlay.appendChild(dialog); document.body.appendChild(overlay); renderStep('initial');
    }

    // [关键修改] 修改为悬浮球样式
    function addBtn() {
        if (document.getElementById('gpt-rescue-btn')) return;
        
        // 插入样式
        const style = document.createElement('style');
        style.innerHTML = `
            #gpt-rescue-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #10a37f;
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 99997;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                transition: transform 0.2s, background-color 0.2s;
            }
            #gpt-rescue-btn:hover {
                transform: scale(1.1);
                background-color: #0d8a6a;
            }
            #gpt-rescue-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);

        const b = document.createElement('button');
        b.id = 'gpt-rescue-btn';
        b.innerHTML = '📥'; // 使用图标
        b.title = '导出 ChatGPT 对话';
        b.onclick = showExportDialog;
        document.body.appendChild(b);
    }
    
    setTimeout(addBtn, 2000);
})();