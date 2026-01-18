// ==UserScript==
// @name         Gemini 增强助手 V1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  对话跳转目录 + 提示词管理仓库 + 图片去水印保存
// @author       Mrchen
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @homepageURL  https://github.com/Mrchen-1600/Gemini-Enhancer
// @supportURL   https://github.com/Mrchen-1600/Gemini-Enhancer/issues
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/563034/Gemini%20%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/563034/Gemini%20%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%20V10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Gemini 增强助手 v1.0: 初始化中...');

    // ================= 0 基础配置 =================
    const CONFIG = {
        watermarkRegion: { width: 160, height: 65 },
        pollInterval: 1000,
        btnOpacityIdle: '0.5',
        btnOpacityHover: '1.0'
    };

    // ================= 1 样式定义 =================
    const STYLES = `
        /* --- 悬浮按钮 --- */
        .gemini-float-btn {
            position: fixed; z-index: 9990; cursor: grab;
            transition: transform 0.2s, opacity 0.3s; opacity: ${CONFIG.btnOpacityIdle};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); user-select: none;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; color: #fff; background: #2d2e30;
            border-radius: 50%; border: 1px solid #555;
            width: 45px; height: 45px;
        }
        .gemini-float-btn:hover { opacity: ${CONFIG.btnOpacityHover}; transform: scale(1.1); }
        .gemini-float-btn:active { cursor: grabbing; }
        .gemini-float-btn::before { content: ''; position: absolute; top: -20px; bottom: -20px; left: -20px; right: -20px; z-index: -1; }
        .docked-right { right: -20px !important; } .docked-right:hover { right: 10px !important; }
        .docked-left { left: -20px !important; } .docked-left:hover { left: 10px !important; }

        /* --- 窗口样式 --- */
        .gemini-window {
            position: fixed; background: #1e1f20; border: 1px solid #444; border-radius: 12px;
            z-index: 9999; color: #e3e3e3; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            display: none; flex-direction: column; overflow: hidden; resize: both; min-width: 250px; min-height: 200px;
        }
        .window-header {
            padding: 10px 15px; background: #2d2e30; border-bottom: 1px solid #444;
            cursor: grab; display: flex; justify-content: space-between; align-items: center; user-select: none; flex-shrink: 0;
        }
        .window-header:active { cursor: grabbing; background: #3c4043; }
        .window-title { font-weight: bold; font-size: 14px; pointer-events: none; }
        .window-close { background: none; border: none; color: #999; cursor: pointer; font-size: 16px; padding: 0 5px; }
        .window-close:hover { color: #fff; }
        .window-content { flex: 1; overflow-y: auto; padding: 10px; position: relative; }

        /* --- 目录样式 --- */
        .toc-item { padding: 6px 10px; margin-bottom: 2px; border-radius: 4px; font-size: 13px; color: #c4c7c5; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-left: 2px solid transparent; }
        .toc-item:hover { background: #3c4043; border-left-color: #8ab4f8; color: #fff; }

        /* --- 提示词样式 --- */
        .pm-layout { display: flex; height: 100%; flex-direction: column; }
        .pm-body { flex: 1; display: flex; overflow: hidden; min-height: 0; }
        .pm-sidebar { width: 150px; background: #252628; border-right: 1px solid #333; display: flex; flex-direction: column; padding: 10px; gap: 5px; overflow-y: auto; }
        .pm-main { flex: 1; padding: 10px; overflow-y: auto; background: #1e1f20; display: flex; flex-direction: column; gap: 8px; }
        .pm-footer { padding: 10px; background: #252628; border-top: 1px solid #333; display: flex; gap: 8px; flex-shrink: 0; align-items: center; }

        .pm-input { background: #1e1f20; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; outline: none; font-size: 13px; }

        /* Tag Items */
        .tag-item {
            padding: 5px 8px; cursor: pointer; border-radius: 4px; font-size: 12px; color: #aaa;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
        }
        .tag-item:hover { background: #333; }
        .tag-item.active { background: #3c4043; color: #fff; font-weight: bold; }

        /* 拖拽时的样式 */
        .tag-item.dragging { opacity: 0.5; background: #444; border: 1px dashed #666; }
        .tag-item.drag-over { border-top: 2px solid #8ab4f8; }

        /* Prompt Cards */
        .prompt-card {
            background: #2a2b2d; padding: 10px; border-radius: 6px; border: 1px solid #3c4043;
            display: flex; flex-direction: column; gap: 5px; user-select: none;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .prompt-card:hover { border-color: #555; }
        .prompt-card.pinned { border-color: #fbbc04; background: #2d2e25; }
        .prompt-card.dragging { opacity: 0.4; border: 2px dashed #8ab4f8; transform: scale(0.98); }
        .prompt-card.drag-over-top { border-top: 2px solid #8ab4f8; }
        .prompt-card.drag-over-bottom { border-bottom: 2px solid #8ab4f8; }

        .card-tag { font-size: 11px; background: #333; padding: 2px 5px; border-radius: 3px; width: fit-content; }
        .card-text { font-size: 12px; color: #ddd; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; cursor: pointer; white-space: pre-wrap; }
        .card-text:hover { color: #fff; }
        .card-actions { display: flex; justify-content: flex-end; gap: 5px; }

        .pm-btn { padding: 3px 8px; border-radius: 3px; border: none; cursor: pointer; font-size: 11px; }
        .btn-green { background: #264c2d; color: #a8dab5; }
        .btn-blue { background: #1a73e8; color: #fff; }
        .btn-red { background: transparent; color: #ffadad; }
        .btn-pin { background: transparent; border: 1px solid #555; color: #888; }
        .btn-pin.active { color: #fbbc04; border-color: #fbbc04; }
        .btn-icon { background: transparent; border: none; color: #888; cursor: pointer; font-size: 12px; padding: 2px; }
        .btn-icon:hover { color: #fff; }

        .edit-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10; display: flex; flex-direction: column; padding: 10px; gap: 10px; }
        .edit-overlay textarea { flex: 1; background: #111; color: #fff; border: 1px solid #555; resize: none; padding: 5px; }

        /* 去水印按钮 */
        .dl-btn {
            position: absolute; top: 8px; right: 8px;
            background: rgba(0,0,0,0.85); color: #fff;
            padding: 5px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2);
            cursor: pointer; font-size: 11px; z-index: 50;
            backdrop-filter: blur(4px); transition: all 0.2s;
        }
        .dl-btn:hover { background: #1a73e8; border-color: #1a73e8; }
    `;

    GM_addStyle(STYLES);

    // ================= 2 状态与存储 =================
    const DEFAULT_LAYOUT = {
        toc: { x: window.innerWidth - 260, y: 150, w: 220, h: 400 },
        prompt: { x: window.innerWidth / 2 - 350, y: window.innerHeight / 2 - 250, w: 700, h: 500 }
    };

    function saveState(key, element) {
        const rect = element.getBoundingClientRect();
        GM_setValue(key, JSON.stringify({ x: rect.left, y: rect.top, w: rect.width, h: rect.height }));
    }

    function loadState(key, element, defaultVal) {
        try {
            const val = JSON.parse(GM_getValue(key, 'null')) || defaultVal;
            const x = Math.min(Math.max(0, val.x), window.innerWidth - 50);
            const y = Math.min(Math.max(0, val.y), window.innerHeight - 50);
            element.style.left = `${x}px`; element.style.top = `${y}px`;
            element.style.width = `${val.w}px`; element.style.height = `${val.h}px`;
        } catch(e) {}
    }

    // 数据操作封装
    function getPrompts() { try { return JSON.parse(GM_getValue('prompts_v3', '[]')); } catch{ return []; } }
    function setPrompts(list) { GM_setValue('prompts_v3', JSON.stringify(list)); }
    function getTagOrder() { try { return JSON.parse(GM_getValue('tag_sort_order', '[]')); } catch { return []; } }
    function setTagOrder(list) { GM_setValue('tag_sort_order', JSON.stringify(list)); }

    // ================= 3 DOM 工具 =================
    function el(tag, className, children, clickHandler) {
        const elem = document.createElement(tag);
        if (className) elem.className = className;
        if (typeof children === 'string') elem.textContent = children;
        else if (Array.isArray(children)) children.forEach(c => c && elem.appendChild(c));
        else if (children) elem.appendChild(children);
        if (clickHandler) elem.addEventListener('click', e => { e.stopPropagation(); clickHandler(e); });
        return elem;
    }

    // 窗口拖拽
    function makeWindowDraggable(headerEl, windowEl, storageKey) {
        headerEl.addEventListener('mousedown', (e) => {
            const startX = e.clientX, startY = e.clientY;
            const rect = windowEl.getBoundingClientRect();
            const startLeft = rect.left, startTop = rect.top;
            const onMove = (me) => {
                windowEl.style.left = `${startLeft + (me.clientX - startX)}px`;
                windowEl.style.top = `${startTop + (me.clientY - startY)}px`;
                windowEl.style.right = 'auto'; windowEl.style.bottom = 'auto';
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                saveState(storageKey, windowEl);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
        windowEl.addEventListener('mouseup', () => saveState(storageKey, windowEl));
    }

    // 按钮吸附拖拽
    function makeButtonDraggable(btn, onDragEnd) {
        let isDragging = false, startX, startY, initLeft, initTop;
        btn.addEventListener('mousedown', e => {
            isDragging = false; startX = e.clientX; startY = e.clientY;
            const rect = btn.getBoundingClientRect(); initLeft = rect.left; initTop = rect.top;
            btn.classList.remove('docked-right', 'docked-left');
            btn.style.right = 'auto'; btn.style.left = `${initLeft}px`; btn.style.top = `${initTop}px`;
            const onMove = me => {
                if (Math.abs(me.clientX - startX) > 3) isDragging = true;
                btn.style.left = `${initLeft + (me.clientX - startX)}px`;
                btn.style.top = `${initTop + (me.clientY - startY)}px`;
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                if (isDragging) {
                    const r = btn.getBoundingClientRect();
                    if (r.left + r.width/2 > window.innerWidth/2) {
                        btn.style.left = 'auto'; btn.style.right = '10px';
                        setTimeout(() => btn.classList.add('docked-right'), 500);
                    } else {
                        btn.style.left = '10px';
                        setTimeout(() => btn.classList.add('docked-left'), 500);
                    }
                } else if (onDragEnd) onDragEnd();
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    // ================= 4 配置面板 =================
    function initAboutPanel() {
        GM_registerMenuCommand("⭐ 支持作者 / Star", showAboutModal);
    }

    function showAboutModal() {
        if (document.getElementById('enhancer-about-modal')) return;
        
        const starLink = el('a', 'star-btn', '⭐ Star on GitHub');
        starLink.href = 'https://github.com/Mrchen-1600/Gemini-Enhancer';
        starLink.target = '_blank';

        const overlay = el('div', 'about-overlay', [
            el('div', 'about-modal', [
                el('div', 'about-title', '🚀 Gemini 增强助手'),
                el('div', 'about-desc', '如果觉得这个脚本对你有帮助，请到 GitHub 点亮一颗 Star 支持作者！你的支持是我最大的动力。'),
                starLink,
                el('button', 'close-btn', '关闭窗口', () => overlay.remove())
            ])
        ]);
        
        overlay.id = 'enhancer-about-modal';
        document.body.appendChild(overlay);
    }

    // ================= 5 目录模块 =================
    let tocPanel, tocList, lastTOCData = "";
    // 提取唯一的对话列表数据，保证渲染时和点击时使用相同逻辑查找元素
    function getUniqueQueries() {
        const containers = document.querySelectorAll('.user-query-container, [data-test-id="user-query"]');
        const unique = [];
        const seen = new Set();
        containers.forEach(c => {
            const t = c.innerText.replace(/\s+/g, ' ').trim();
            if (t.length > 1 && !seen.has(t)) {
                seen.add(t);
                unique.push({el: c, text: t});
            }
        });
        return unique;
    }
    
    function initTOC() {
        if (document.getElementById('gemini-toc-btn')) return;
        const btn = el('div', 'gemini-float-btn docked-right', '📂');
        btn.id = 'gemini-toc-btn'; btn.style.top = '150px'; btn.style.right = '-20px';
        document.body.appendChild(btn);

        tocPanel = el('div', 'gemini-window', [
            el('div', 'window-header', [el('span', 'window-title', '对话目录'), el('button', 'window-close', '✕', () => tocPanel.style.display = 'none')]),
            tocList = el('div', 'window-content', '')
        ]);
        tocPanel.id = 'gemini-toc-panel'; document.body.appendChild(tocPanel);
        loadState('toc_state', tocPanel, DEFAULT_LAYOUT.toc);
        makeWindowDraggable(tocPanel.querySelector('.window-header'), tocPanel, 'toc_state');

        makeButtonDraggable(btn, () => {
            if (tocPanel.style.display === 'flex') tocPanel.style.display = 'none';
            else { updateTOCList(true); tocPanel.style.display = 'flex'; saveState('toc_state', tocPanel); }
        });
    }

    function updateTOCList(force = false) {
        if (!tocPanel || tocPanel.style.display === 'none') return;
        const unique = getUniqueQueries();
        const currentData = unique.map(u => u.text).join('|');
        if (!force && currentData === lastTOCData) return;
        lastTOCData = currentData;
        while(tocList.firstChild) tocList.removeChild(tocList.firstChild);
        if (unique.length === 0) { tocList.appendChild(el('div', '', '暂无记录')); return; }
        unique.forEach((item, idx) => {
            tocList.appendChild(el('div', 'toc-item', `${idx+1}. ${item.text}`, () => {
                const liveUnique = getUniqueQueries(); 
                const target = liveUnique[idx]; 
                if (target && target.el && target.el.isConnected) {
                    target.el.scrollIntoView({behavior:'smooth', block:'center'});
                } else if (item.el) {
                    item.el.scrollIntoView({behavior:'smooth', block:'center'});
                }
            }));
        });
    }

    // ================= 6 提示词模块  =================
    let promptPanel, promptMain, sidebar, currentTag = '全部', currentSearch = '';
    let isTagEditMode = false;
    let dragSrcEl = null; // 拖拽源引用

    function initPromptManager() {
        if (document.getElementById('gemini-prompt-btn')) return;
        const btn = el('div', 'gemini-float-btn docked-right', '💡');
        btn.id = 'gemini-prompt-btn'; btn.style.top = '220px'; btn.style.right = '-20px';
        document.body.appendChild(btn);

        promptPanel = el('div', 'gemini-window', [
            el('div', 'window-header', [el('span', 'window-title', '提示词库'), el('button', 'window-close', '✕', () => promptPanel.style.display = 'none')]),
            el('div', 'window-content pm-layout', [
                el('div', 'pm-body', [
                    el('div', 'pm-sidebar', [
                        el('div', '', [
                             (() => { const i = el('input', 'pm-input'); i.placeholder = '🔍 搜索'; i.style.width='100%'; i.style.marginBottom='5px'; i.addEventListener('input', e => { currentSearch = e.target.value.toLowerCase(); renderPromptList(); }); return i; })(),
                             el('button', 'pm-btn btn-blue', '⚙️ 管理标签', () => toggleTagEditMode())
                        ]),
                        sidebar = el('div', 'tag-list-container', '')
                    ]),
                    promptMain = el('div', 'pm-main')
                ]),
                el('div', 'pm-footer', [
                    (() => { const i = el('input', 'pm-input'); i.id='new-tag'; i.placeholder='新标签'; i.style.width='70px'; return i; })(),
                    (() => { const i = el('input', 'pm-input'); i.id='new-text'; i.placeholder='新增提示词...'; i.style.flex='1'; return i; })(),
                    el('button', 'pm-btn btn-green', '＋新增', handleSave)
                ])
            ])
        ]);
        promptPanel.id = 'gemini-prompt-panel'; document.body.appendChild(promptPanel);
        loadState('prompt_state', promptPanel, DEFAULT_LAYOUT.prompt);
        makeWindowDraggable(promptPanel.querySelector('.window-header'), promptPanel, 'prompt_state');

        makeButtonDraggable(btn, () => {
            if (promptPanel.style.display === 'flex') promptPanel.style.display = 'none';
            else { refreshPromptUI(); promptPanel.style.display = 'flex'; }
        });
    }

    function handleSave() {
        const tag = document.getElementById('new-tag').value.trim() || '通用';
        const text = document.getElementById('new-text').value.trim();
        if(!text) return;
        const list = getPrompts();
        list.push({ id:Date.now(), tag, text, pinned:false });
        setPrompts(list);
        document.getElementById('new-text').value = '';
        refreshPromptUI();
    }

    function toggleTagEditMode() {
        isTagEditMode = !isTagEditMode;
        promptPanel.querySelector('.pm-sidebar button').textContent = isTagEditMode ? '✅ 完成' : '⚙️ 管理标签';
        refreshTags();
    }

    // --- 标签排序 ---
    function refreshTags() {
        while(sidebar.firstChild) sidebar.removeChild(sidebar.firstChild);

        // 获取所有标签
        const prompts = getPrompts();
        const systemTags = ['全部', '已置顶'];
        const userTags = new Set();
        prompts.forEach(p => userTags.add(p.tag));

        let savedOrder = getTagOrder();
        savedOrder = savedOrder.filter(t => userTags.has(t));
        userTags.forEach(t => { if(!savedOrder.includes(t)) savedOrder.push(t); });

        // 渲染列表
        [...systemTags, ...savedOrder].forEach(t => {
            const isSystem = systemTags.includes(t);
            const row = el('div', `tag-item ${currentTag===t && !isTagEditMode ?'active':''}`, '');

            // 拖拽属性 (仅限非系统标签)
            if (!isSystem) {
                row.draggable = true;
                row.dataset.tag = t;

                row.addEventListener('dragstart', (e) => {
                    dragSrcEl = row;
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', t);
                    row.classList.add('dragging');
                });
                row.addEventListener('dragend', () => {
                    row.classList.remove('dragging');
                    document.querySelectorAll('.tag-item').forEach(el => el.classList.remove('drag-over'));
                });
                row.addEventListener('dragover', (e) => {
                    if (e.preventDefault) e.preventDefault();
                    return false;
                });
                row.addEventListener('dragenter', (e) => {
                    if (row !== dragSrcEl) row.classList.add('drag-over');
                });
                row.addEventListener('dragleave', () => {
                    row.classList.remove('drag-over');
                });
                row.addEventListener('drop', (e) => {
                    e.stopPropagation();
                    if (dragSrcEl !== row) {
                        const srcTag = dragSrcEl.dataset.tag;
                        const targetTag = t;

                        // 调整数组顺序
                        const currentOrder = [...savedOrder];
                        const srcIdx = currentOrder.indexOf(srcTag);
                        const tgtIdx = currentOrder.indexOf(targetTag);

                        if (srcIdx > -1 && tgtIdx > -1) {
                            currentOrder.splice(srcIdx, 1);
                            currentOrder.splice(tgtIdx, 0, srcTag);
                            setTagOrder(currentOrder);
                            refreshTags();
                        }
                    }
                    return false;
                });
            }

            if (isTagEditMode && !isSystem) {
                const input = el('input', 'pm-input', ''); input.value = t; input.style.width='70px'; input.style.padding='2px';
                input.onchange = (e) => { const n = e.target.value.trim(); if(n && n!==t) renameTag(t, n); };
                const delBtn = el('button', 'btn-icon', '🗑️', () => deleteTagGroup(t));
                row.appendChild(input); row.appendChild(delBtn);
            } else {
                row.textContent = t;
                row.onclick = () => { if(!isTagEditMode) { currentTag=t; refreshPromptUI(); }};
            }
            sidebar.appendChild(row);
        });
    }

    function renameTag(oldName, newName) {
        if(!confirm(`重命名 "${oldName}" -> "${newName}"?`)) return refreshTags();
        const list = getPrompts();
        list.forEach(p => { if(p.tag === oldName) p.tag = newName; });
        setPrompts(list); refreshPromptUI();
    }
    function deleteTagGroup(tagName) {
        if(!confirm(`删除标签 "${tagName}" 及所有内容?`)) return;
        let list = getPrompts();
        list = list.filter(p => p.tag !== tagName);
        setPrompts(list); refreshPromptUI();
    }

    // --- 提示词排序 ---
    function renderPromptList() {
        while(promptMain.firstChild) promptMain.removeChild(promptMain.firstChild);

        const fullList = getPrompts();
        let displayList = fullList.filter(p => {
            const mTag = currentTag==='全部' || (currentTag==='已置顶' && p.pinned) || p.tag===currentTag;
            const mSearch = p.text.toLowerCase().includes(currentSearch) || p.tag.includes(currentSearch);
            return mTag && mSearch;
        });

        // 分组
        const pinnedGroup = displayList.filter(p => p.pinned);
        const normalGroup = displayList.filter(p => !p.pinned);

        if(displayList.length===0) { promptMain.appendChild(el('div','','无内容')); return; }

        const renderCard = (item, isPinned) => {
            const card = el('div', `prompt-card ${item.pinned?'pinned':''}`, [
                el('div', 'card-text', item.text, () => fillInput(item.text)),
                el('div', 'card-actions', [
                    el('span', 'card-tag', item.tag),
                    el('button', `pm-btn btn-pin ${item.pinned?'active':''}`, '📌', ()=>togglePin(item.id)),
                    el('button', 'pm-btn btn-blue', '✏️', ()=>editPrompt(item)),
                    el('button', 'pm-btn btn-green', '填入', ()=>fillInput(item.text)),
                    el('button', 'pm-btn btn-red', '🗑️', ()=>deleteItem(item.id))
                ])
            ]);

            // 拖拽逻辑
            card.draggable = true;
            card.dataset.id = item.id;
            card.dataset.group = isPinned ? 'pinned' : 'normal';

            card.addEventListener('dragstart', (e) => {
                dragSrcEl = card;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.id);
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                document.querySelectorAll('.prompt-card').forEach(c => {
                    c.classList.remove('drag-over-top', 'drag-over-bottom');
                });
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                // 仅允许同组拖拽
                if (dragSrcEl.dataset.group !== card.dataset.group) return;

                const rect = card.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                if (e.clientY < mid) {
                    card.classList.add('drag-over-top');
                    card.classList.remove('drag-over-bottom');
                } else {
                    card.classList.add('drag-over-bottom');
                    card.classList.remove('drag-over-top');
                }
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over-top', 'drag-over-bottom');
            });

            card.addEventListener('drop', (e) => {
                e.stopPropagation();
                if (dragSrcEl !== card && dragSrcEl.dataset.group === card.dataset.group) {
                    const srcId = parseInt(dragSrcEl.dataset.id);
                    const targetId = parseInt(card.dataset.id);

                    const list = getPrompts();
                    const srcIndex = list.findIndex(p => p.id === srcId);
                    const targetIndex = list.findIndex(p => p.id === targetId);

                    if (srcIndex > -1 && targetIndex > -1) {
                        // 移动元素
                        const [movedItem] = list.splice(srcIndex, 1);
                        let newTargetIndex = list.findIndex(p => p.id === targetId);

                        if (card.classList.contains('drag-over-bottom')) {
                            newTargetIndex++;
                        }

                        list.splice(newTargetIndex, 0, movedItem);
                        setPrompts(list);
                        renderPromptList();
                    }
                }
                return false;
            });

            return card;
        };

        // 渲染顺序：置顶组 -> 普通组
        pinnedGroup.forEach(item => promptMain.appendChild(renderCard(item, true)));
        normalGroup.forEach(item => promptMain.appendChild(renderCard(item, false)));
    }

    // 辅助功能
    function refreshPromptUI() { refreshTags(); renderPromptList(); }
    function togglePin(id) { const list=getPrompts(); const i=list.find(p=>p.id===id); if(i){ i.pinned=!i.pinned; setPrompts(list); refreshPromptUI(); } }
    function deleteItem(id) { if(confirm('删除?')) { setPrompts(getPrompts().filter(p=>p.id!==id)); refreshPromptUI(); } }
    function editPrompt(item) {
        const overlay = el('div', 'edit-overlay', [
            el('div', '', '编辑提示词'),
            (() => { const t = el('input', 'pm-input'); t.value = item.tag; t.id='edit-tag'; return t; })(),
            (() => { const t = el('textarea', ''); t.value = item.text; t.id='edit-text'; return t; })(),
            el('div', 'card-actions', [
                el('button', 'pm-btn btn-green', '保存', () => {
                    const list = getPrompts(), target = list.find(p=>p.id===item.id);
                    if(target) { target.tag = document.getElementById('edit-tag').value.trim(); target.text = document.getElementById('edit-text').value.trim(); }
                    setPrompts(list); overlay.remove(); refreshPromptUI();
                }),
                el('button', 'pm-btn btn-red', '取消', () => overlay.remove())
            ])
        ]);
        promptPanel.querySelector('.pm-body').appendChild(overlay);
    }
    function fillInput(text) { const area=document.querySelector('.ql-editor, [contenteditable="true"], textarea'); if(area){ area.focus(); document.execCommand('insertText', false, text); } }

    // ================= 7 图片去水印 (拉伸模糊算法) =================
    function initImageHandler() {
        document.querySelectorAll('img').forEach(img => {
            if (img.naturalWidth > 500 && img.naturalHeight > 500 && img.width > 250 && !img.dataset.enhanced) {
                if (!img.closest('button') && !img.closest('[role="button"]') && !img.closest('.mat-icon')) {
                    addDownloadBtn(img);
                }
            }
        });
    }
    function addDownloadBtn(img) {
        img.dataset.enhanced = 'true';
        const p = img.parentElement;
        if(p) {
            if(getComputedStyle(p).position==='static') p.style.position='relative';
            const btn = el('button', 'dl-btn', '✂️ 去水印保存', () => {
                btn.textContent = '处理中...'; processImageStretchBlur(img.src, btn);
            });
            p.appendChild(btn);
        }
    }
    function processImageStretchBlur(url, btn) {
        GM_xmlhttpRequest({
            method: "GET", url, responseType: "blob",
            onload: (res) => {
                if(res.status!==200) return fail();
                const tempImg = new Image();
                tempImg.onload = () => {
                    const cvs = document.createElement('canvas');
                    const w = tempImg.naturalWidth, h = tempImg.naturalHeight;
                    cvs.width = w; cvs.height = h;
                    const ctx = cvs.getContext('2d');
                    ctx.drawImage(tempImg, 0, 0);
                    const wmW = CONFIG.watermarkRegion.width, wmH = CONFIG.watermarkRegion.height, wmX = w - wmW, wmY = h - wmH;
                    const sampleHeight = 20, sampleY = wmY - sampleHeight;
                    if (sampleY > 0) {
                        ctx.drawImage(cvs, wmX, sampleY, wmW, sampleHeight, wmX, wmY, wmW, wmH);
                        ctx.drawImage(cvs, wmX, wmY - 2, wmW, 2, wmX, wmY - 2, wmW, 4);
                    }
                    cvs.toBlob(b => {
                        const l = document.createElement('a'); l.href = URL.createObjectURL(b);
                        l.download = `gemini_clean_${Date.now()}.png`; document.body.appendChild(l); l.click(); document.body.removeChild(l);
                        btn.textContent = '✅'; setTimeout(()=>btn.textContent='✂️ 去水印保存', 2000);
                    }, 'image/png');
                };
                tempImg.src = URL.createObjectURL(res.response);
            },
            onerror: fail
        });
        function fail() { btn.textContent = '❌'; setTimeout(()=>btn.textContent='✂️ 去水印保存', 2000); }
    }

    // ================= 8 启动 =================
    function start() {
        initTOC(); initPromptManager(); initAboutPanel();
        setInterval(() => { updateTOCList(); initImageHandler(); }, CONFIG.pollInterval);
    }
    window.addEventListener('load', start);
    start();

})();