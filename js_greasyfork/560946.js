// ==UserScript==
// @name         Twitter/X 账号备注别名 (Vtag)
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  为 Twitter/X 账号添加备注和标签系统。支持搜索、导入导出、UID 永久追踪、曾用名历史记录，适配 Web3 KOL 场景。
// @author       Vaghr
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560946/TwitterX%20%E8%B4%A6%E5%8F%B7%E5%A4%87%E6%B3%A8%E5%88%AB%E5%90%8D%20%28Vtag%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560946/TwitterX%20%E8%B4%A6%E5%8F%B7%E5%A4%87%E6%B3%A8%E5%88%AB%E5%90%8D%20%28Vtag%29.meta.js
// ==/UserScript=====

/**
 * 功能简介：本项目是一个本地优先的 Twitter 账号管理增强脚本，允许用户为任何账号添加私有的备注和标签。
 */

(function () {
    'use strict';

    // ========================
    // 0) 常量与默认配置
    // ========================
    const VTAG_LOGO = "data:image/jpeg;base64,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";
    const DEBUG = false;
    const STORE_KEY = 'markx_store_v1';
    const DEFAULT_TAGS = ["Project", "Airdrop", "Meme", "Celebrity", "KOL", "VC", "Founder", "Scam", "Dev", "Bot"];

    const DEFAULT_STORE = {
        version: 1,
        updatedAt: Date.now(),
        settings: {
            enableInTimeline: true,
            maxTagsToShow: 3,
            maxNotePreviewLen: 40,
            defaultTags: DEFAULT_TAGS,
            caseRule: "lower"
        },
        users: {},
        index: {
            byHandle: {},
            byTag: {},
            updatedAt: Date.now()
        }
    };

    // ========================
    // 1) 数据持久化 (Store & Index)
    // ========================
    let store = null;

    function loadStore() {
        try {
            const data = GM_getValue(STORE_KEY, null);
            if (!data) {
                store = JSON.parse(JSON.stringify(DEFAULT_STORE));
                return store;
            }
            store = typeof data === 'string' ? JSON.parse(data) : data;
            // 合并默认设置以保证兼容性
            store.settings = { ...DEFAULT_STORE.settings, ...store.settings };
            if (!store.index || !store.index.byTag) {
                rebuildIndex();
            }
            return store;
        } catch (e) {
            console.error('[Vtag] Load store failed:', e);
            store = JSON.parse(JSON.stringify(DEFAULT_STORE));
            return store;
        }
    }

    function saveStore() {
        store.updatedAt = Date.now();
        GM_setValue(STORE_KEY, JSON.stringify(store));
    }

    function rebuildIndex() {
        const index = {
            byHandle: {},
            byTag: {},
            updatedAt: Date.now()
        };

        Object.values(store.users).forEach(user => {
            if (user.handle) index.byHandle[user.handle] = user.key;
            if (user.tags) {
                user.tags.forEach(tag => {
                    const t = (typeof tag === 'string' ? tag : tag.text).trim().toLowerCase();
                    if (!index.byTag[t]) index.byTag[t] = [];
                    index.byTag[t].push(user.key);
                });
            }
        });

        // 排序索引中的 key（按 updatedAt 倒序）
        Object.keys(index.byTag).forEach(tag => {
            index.byTag[tag].sort((a, b) => {
                const ua = store.users[a]?.updatedAt || 0;
                const ub = store.users[b]?.updatedAt || 0;
                return ub - ua;
            });
        });

        store.index = index;
    }

    function updateIndexOnUpsert(user) {
        if (!store.index) rebuildIndex();
        // 更新 handle 映射
        if (user.handle) store.index.byHandle[user.handle] = user.key;

        // 更新标签索引（这里简单处理：全量刷新该用户的标签索引，或直接触发局部重建）
        // 为了稳定，我们直接清理涉及的旧标签并添加新标签
        rebuildIndex(); // 简单起见，且数据量万级以下性能可接受
    }

    function upsertUser(identity, { alias, color, tagColor, note, tags }) {
        const { uid, handle, displayName } = identity;
        const now = Date.now();

        // V3.0 主键逻辑：优先使用 UID，兜底使用 lowercased handle (针对未捕获 UID 的旧节点)
        const key = uid || identity.key;
        const existing = store.users[key] || {};

        // 数据迁移补全逻辑：如果当前是用 UID 访问，但数据库里没钱，尝试从旧 handle 数据库里捞
        if (uid && !store.users[uid]) {
            const oldKey = identity.key; // handle.toLowerCase()
            if (store.users[oldKey]) {
                Object.assign(existing, store.users[oldKey]);
                delete store.users[oldKey]; // 迁移后删除旧 key 记录
                if (DEBUG) console.log(`[Vtag] Data migrated from ${oldKey} to UID ${uid}`);
            }
        }

        // 兼容性处理：如果传入的是字符串数组，转换为对象数组
        const formattedTags = tags.map(t => {
            if (typeof t === 'string') {
                return { text: t.trim().toLowerCase(), color: tagColor || "#ffd400" };
            }
            return { text: t.text.trim().toLowerCase(), color: t.color || "#ffd400" };
        }).filter(t => t.text).slice(0, 20);

        // V3.1 Handle 历史追踪逻辑
        let handleHistory = existing.handleHistory || [];
        if (existing.handle && existing.handle !== handle) {
            // 归档旧 Handle，去重并限制数量 (Max 5)
            if (!handleHistory.includes(existing.handle)) {
                handleHistory.unshift(existing.handle);
                handleHistory = handleHistory.slice(0, 5);
                if (DEBUG) console.log(`[Vtag] Archive old handle: ${existing.handle}`);
            }
        }

        const userRecord = {
            ...existing,
            uid: uid || existing.uid,
            key,
            handle: handle || existing.handle,
            handleHistory, // 存储历史轨迹
            displayName: displayName || existing.displayName,
            alias: alias?.substring(0, 50) || "",
            color: color || "#1d9bf0",
            tagColor: tagColor || "#ffd400",
            note: note?.substring(0, 1000) || "",
            tags: formattedTags,
            updatedAt: now
        };

        // 自动自愈更名逻辑：如果记录的 handle 与当前 handle 不同，且当前是 UID 追踪
        if (uid && userRecord.handle !== handle) {
            if (DEBUG) console.log(`[Vtag] User renamed: ${userRecord.handle} -> ${handle}`);
            userRecord.handle = handle;
        }

        store.users[key] = userRecord;
        updateIndexOnUpsert(userRecord);
        saveStore();
        notifyUpdate(key);
    }

    function removeUser(key) {
        if (store.users[key]) {
            delete store.users[key];
            rebuildIndex();
            saveStore();
            notifyUpdate(key);
        }
    }

    // ========================
    // 2) DOM 探测与实体识别
    // ========================
    const processedNodes = new WeakSet();

    function getUserIdFromReact(node) {
        try {
            const key = Object.keys(node).find(k => k.startsWith('__reactFiber$'));
            if (!key) return null;

            let fiber = node[key];
            while (fiber) {
                // 探测各种可能的路径：Twitter 的 Fiber 结构比较深
                const props = fiber.memoizedProps;
                if (props?.user?.id_str) return props.user.id_str;
                if (props?.userId) return props.userId;
                if (props?.userData?.id_str) return props.userData.id_str;
                fiber = fiber.return;
            }
        } catch (e) { }
        return null;
    }

    function getUserIdentityFromContext(node) {
        try {
            let handle = null;
            let displayName = "";
            let uid = getUserIdFromReact(node);

            // S1: 查找链接模式
            const link = node.querySelector('a[href^="/"]');
            if (link) {
                const href = link.getAttribute('href');
                const match = href.match(/^\/([A-Za-z0-9_]{1,15})$/);
                const blackList = ['/home', '/explore', '/notifications', '/messages', '/i', '/settings', '/about', '/tos', '/privacy'];
                if (match && !blackList.includes(match[0])) {
                    handle = '@' + match[1];
                    const displayNameNode = node.querySelector('[data-testid="User-Name"]') || node;
                    displayName = displayNameNode.innerText?.split('\n')[0] || "";

                    // 尝试在链接元素上再次探测 UID
                    if (!uid) uid = getUserIdFromReact(link);
                }
            }

            // S2: data-testid 辅助
            if (!handle) {
                const userInfo = node.closest('[data-testid="User-Name"]');
                if (userInfo) {
                    const handleMatch = userInfo.innerText.match(/@([A-Za-z0-9_]{1,15})/);
                    if (handleMatch) {
                        handle = handleMatch[0];
                        displayName = userInfo.innerText.split('\n')[0];
                        if (!uid) uid = getUserIdFromReact(userInfo);
                    }
                }
            }

            // S3: 兜底正则
            if (!handle) {
                const fullText = node.innerText || "";
                const lastResort = fullText.match(/@([A-Za-z0-9_]{1,15})/);
                if (lastResort) handle = lastResort[0];
            }

            if (handle) {
                // V3.0 Key 逻辑：主键优先采用 UID，确保改名不丢失
                return {
                    key: uid || handle.toLowerCase(),
                    uid,
                    handle,
                    displayName
                };
            }
        } catch (e) {
            if (DEBUG) console.error('[Vtag] Identity extraction failed', e);
        }
        return null;
    }

    // ========================
    // 3) SPA 路由与增量渲染
    // ========================
    function observeDOM() {
        const target = document.body;
        const observer = new MutationObserver((mutations) => {
            let needsScan = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    needsScan = true;
                    break;
                }
            }
            if (needsScan) {
                debounceReScan();
            }
        });

        observer.observe(target, { childList: true, subtree: true });
    }

    let scanTimer = null;
    function debounceReScan() {
        if (scanTimer) return;
        scanTimer = requestAnimationFrame(() => {
            reScan();
            scanTimer = null;
        });
    }

    function reScan() {
        const isTimeline = !window.location.pathname.includes('/status/') &&
            (window.location.pathname === '/home' ||
                window.location.pathname.includes('/search') ||
                document.querySelector('[data-testid="primaryColumn"]')?.innerText.includes('What’s happening'));

        if (!store.settings.enableInTimeline && isTimeline) return;

        // 注入推文列表
        const articles = document.querySelectorAll('article[role="article"]:not([data-markx-injected])');
        articles.forEach(article => {
            article.setAttribute('data-markx-injected', '1');
            const userNameAnchor = article.querySelector('[data-testid="User-Name"]');
            if (userNameAnchor) {
                injectToNode(userNameAnchor);
            }
        });

        // 注入个人主页
        const userHeader = document.querySelector('[data-testid="UserName"]:not([data-markx-injected])');
        if (userHeader) {
            userHeader.setAttribute('data-markx-injected', '1');
            injectToNode(userHeader);
        }
    }

    function injectToNode(anchor) {
        const identity = getUserIdentityFromContext(anchor);
        if (!identity) return;

        const badgeContainer = document.createElement('span');
        badgeContainer.className = 'twk-note-badge-wrap';
        badgeContainer.dataset.userKey = identity.key;

        renderBadge(badgeContainer, identity);

        // 寻找合适的插入位置：在名字区块内部
        const nameRow = anchor.querySelector('div[dir="ltr"]');
        if (nameRow) {
            nameRow.style.display = 'flex';
            nameRow.style.alignItems = 'center';
            nameRow.style.flexWrap = 'wrap';
            nameRow.appendChild(badgeContainer);
        } else {
            anchor.appendChild(badgeContainer);
        }
    }

    function renderBadge(container, identity) {
        const user = store.users[identity.key];
        container.innerHTML = '';

        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.className = 'twk-note-badge-link';

        if (!user || (!user.alias && !user.note && user.tags.length === 0)) {
            link.innerHTML = `<span class="twk-note-icon">✎</span><span class="twk-note-empty-text">添加备注</span>`;
        } else {
            let html = '';
            // Alias (Primary Display)
            const displayText = user.alias || user.note;
            if (displayText) {
                const maxLen = store.settings.maxNotePreviewLen;
                const preview = displayText.length > maxLen ? displayText.substring(0, maxLen) + '...' : displayText;
                const style = user.color ? `style="color: ${user.color};"` : '';
                html += `<span class="twk-note-text-preview" ${style} title="${(user.alias ? '[' + user.alias + '] ' : '') + user.note.replace(/"/g, '&quot;')}">${preview}</span>`;
            }

            // Tags (Secondary Display)
            if (user.tags && user.tags.length > 0) {
                const max = store.settings.maxTagsToShow;
                const visibleTags = user.tags.slice(0, max);
                visibleTags.forEach(tag => {
                    const text = typeof tag === 'string' ? tag : tag.text;
                    const color = typeof tag === 'string' ? (user.tagColor || '#ffd400') : (tag.color || '#ffd400');
                    const tagStyle = `style="color: ${color}; border-color: ${color}44; background: ${color}11;"`;
                    html += `<span class="twk-note-tag-pill" ${tagStyle}>${text}</span>`;
                });
                if (user.tags.length > max) {
                    html += `<span class="twk-note-tag-more" style="font-size:9px; opacity:0.6;">+${user.tags.length - max}</span>`;
                }
            }
            link.innerHTML = html;
        }

        link.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditor(identity);
        };
        container.appendChild(link);
    }

    function notifyUpdate(key) {
        const containers = document.querySelectorAll(`.twk-note-badge-wrap[data-user-key="${key}"]`);
        containers.forEach(container => {
            const handle = key.startsWith('@') ? key : '@' + key; // 这里的 key 是 lowercased handle
            renderBadge(container, { key, handle, displayName: "" });
        });
    }

    // ========================
    // 4) UI 组件 (Styles & Shell)
    // ========================
    function injectStyles() {
        GM_addStyle(`
            :root {
                --mx-primary: #1d9bf0;
                --mx-glass-bg: rgba(255, 255, 255, 0.7);
                --mx-glass-border: rgba(0, 0, 0, 0.1);
                --mx-text: #0f1419;
                --mx-text-dim: #536471;
                --mx-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                --mx-blur: blur(12px);
            }

            /* 自动适配暗色模式（基于 Twitter 根元素颜色） */
            [style*="background-color: rgb(21, 32, 43)"], /* Dim */
            [style*="background-color: rgb(0, 0, 0)"],    /* Lights out */
            body.dark-mode {
                --mx-glass-bg: rgba(21, 32, 43, 0.75);
                --mx-glass-border: rgba(255, 255, 255, 0.1);
                --mx-text: #f7f9f9;
                --mx-text-dim: #8b98a5;
            }
            [style*="background-color: rgb(0, 0, 0)"] {
                --mx-glass-bg: rgba(0, 0, 0, 0.75);
            }

            @keyframes mx-fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }

            .twk-note-badge-wrap { display: inline-flex; margin-left: 6px; vertical-align: middle; }
            .twk-note-badge-link {
                text-decoration: none !important;
                color: var(--mx-primary) !important;
                font-size: 13px; /* 增大整体字号辨识度 */
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                background: rgba(29, 155, 240, 0.08);
                padding: 2px 10px;
                border-radius: 999px;
                border: 1px solid rgba(29, 155, 240, 0.15);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                line-height: normal;
            }
            .twk-note-tag-pill {
                padding: 0 6px;
                border-radius: 4px;
                font-size: 10px; /* 标签稍小以区分 */
                font-weight: 700;
                border: 1px solid rgba(128, 128, 128, 0.2);
                background: rgba(128, 128, 128, 0.08);
                display: inline-flex;
                align-items: center;
                height: 16px;
            }
            .twk-note-text-preview {
                font-weight: 800; /* 加粗别名 */
                font-size: 13px;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                height: 20px;
            }
            .twk-note-empty-text { font-weight: 600; }
            .twk-note-icon { font-size: 13px; opacity: 0.6; transition: transform 0.2s; }
            .twk-note-badge-link:hover .twk-note-icon { transform: rotate(15deg) scale(1.1); opacity: 1; color: var(--mx-primary); }

            /* Modal & Overlay */
            .twk-note-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.3); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(4px);
                animation: mx-fade-in 0.2s ease-out;
            }
            .twk-note-modal {
                background: var(--mx-glass-bg);
                backdrop-filter: var(--mx-blur);
                -webkit-backdrop-filter: var(--mx-blur);
                border: 1px solid var(--mx-glass-border);
                border-radius: 20px;
                width: 460px; max-width: 90vw;
                padding: 24px; box-shadow: var(--mx-shadow);
                position: relative;
                color: var(--mx-text);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            .twk-note-modal h3 {
                margin: 0 0 20px 0;
                font-size: 18px;
                font-weight: 800;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--mx-glass-border);
            }
            .twk-note-modal-nav { display: flex; align-items: center; gap: 12px; margin-right: 8px; }
            .twk-note-nav-btn {
                font-size: 12px; font-weight: 600; opacity: 0.6; cursor: pointer;
                display: flex; align-items: center; gap: 4px; padding: 4px 8px;
                border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;
            }
            .twk-note-nav-btn:hover { opacity: 1; background: rgba(128, 128, 128, 0.1); border-color: var(--mx-glass-border); }

            .twk-note-field { margin-bottom: 20px; }
            .twk-note-label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 8px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }

            .twk-note-input {
                width: 100%; padding: 12px; border-radius: 12px;
                border: 1px solid var(--mx-glass-border);
                background: rgba(128, 128, 128, 0.05);
                color: inherit; font-size: 14px; box-sizing: border-box;
                transition: all 0.2s;
            }
            .twk-note-input:focus { border-color: var(--mx-primary); outline: none; background: rgba(128, 128, 128, 0.1); }

            .twk-note-textarea { min-height: 80px; resize: vertical; }
            .twk-note-tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }

            .twk-note-tag-editor {
                display: inline-flex; align-items: center;
                background: var(--mx-primary); color: white;
                padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold;
                box-shadow: 0 2px 8px rgba(29, 155, 240, 0.3);
            }
            .twk-note-tag-del { margin-left: 6px; cursor: pointer; font-size: 16px; line-height: 1; margin-top: -2px; }

            /* Default Tags */
            .twk-note-default-tags { margin-top: 12px; font-size: 12px; }
            .twk-note-default-tag-btn {
                display: inline-block; margin: 0 6px 6px 0; padding: 3px 8px; border-radius: 6px;
                background: rgba(128, 128, 128, 0.1); cursor: pointer; border: 1px solid var(--mx-glass-border);
                transition: all 0.2s; font-weight: 500;
            }
            .twk-note-default-tag-btn:hover { background: rgba(29, 155, 240, 0.1); border-color: var(--mx-primary); }

            /* Color Picker Compact */
            .mx-color-grid { display: flex; flex-wrap: wrap; gap: 6px; }
            .mx-color-swatch {
                width: 18px; height: 18px; border-radius: 50%; cursor: pointer;
                border: 2px solid transparent; transition: all 0.2s;
                position: relative;
            }
            .mx-color-swatch:hover { transform: scale(1.2); }
            .mx-color-swatch.active { border-color: var(--mx-text); }
            .mx-color-swatch.active::after {
                content: ''; width: 6px; height: 6px; background: white; border-radius: 50%;
                position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            }

            .twk-note-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--mx-glass-border); }
            .twk-note-btn {
                padding: 10px 24px; border-radius: 999px; font-weight: 800; cursor: pointer;
                border: none; font-size: 14px; transition: all 0.2s;
            }
            .twk-note-btn-primary { background: var(--mx-primary); color: white; }
            .twk-note-btn-secondary { background: rgba(128, 128, 128, 0.2); color: var(--mx-text); }
            .twk-note-btn-danger { background: rgba(244, 33, 46, 0.1); color: #f4212e; border: 1px solid rgba(244, 33, 46, 0.2); }
            .twk-note-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
            .twk-note-btn:active { transform: translateY(0); }

            /* Search Panel */
            /* Search Panel Correction */
            .twk-note-search-panel {
                position: fixed; top: 15%; left: 50%; transform: translateX(-50%);
                width: 600px; max-width: 95vw;
                background: var(--mx-glass-bg);
                backdrop-filter: var(--mx-blur);
                -webkit-backdrop-filter: var(--mx-blur);
                border: 1px solid var(--mx-glass-border);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5); z-index: 10001;
                overflow: hidden;
                animation: mx-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex; flex-direction: column;
            }
            .twk-note-search-input {
                width: 100%; border: none; padding: 20px; font-size: 18px;
                background: transparent; color: inherit; outline: none; border-bottom: 1px solid var(--mx-glass-border);
            }
            .twk-note-search-results { max-height: 450px; overflow-y: auto; }
            .twk-note-search-item {
                padding: 16px 20px; cursor: pointer; border-bottom: 1px solid var(--mx-glass-border);
                transition: background 0.2s;
            }
            .twk-note-search-item:hover, .twk-note-search-item.active { background: rgba(29, 155, 240, 0.08); }
            .twk-note-search-item-header { display: flex; align-items: center; justify-content: space-between; }
            .twk-note-search-item-title { font-weight: 800; font-size: 15px; display: flex; align-items: center; gap: 8px; }
            .twk-note-search-item-handle { opacity: 0.5; font-size: 13px; font-weight: 500; }
            .twk-note-search-jump {
                width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
                border-radius: 50%; opacity: 0.4; transition: all 0.2s; cursor: pointer;
            }
            .twk-note-search-jump:hover { opacity: 1; background: rgba(29, 155, 240, 0.15); color: var(--mx-primary); }
            .twk-note-search-item-note { font-size: 13px; opacity: 0.7; margin-top: 4px; }
            .twk-note-search-empty { padding: 40px; text-align: center; opacity: 0.5; font-size: 14px; }

            .mx-footer {
                margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--mx-glass-border);
                display: flex; align-items: center; justify-content: center; gap: 6px;
                font-size: 11px; color: var(--mx-text-dim, #536471); opacity: 0.8;
            }
            .mx-footer a {
                color: inherit; text-decoration: none; display: flex; align-items: center; gap: 4px;
                transition: all 0.2s;
            }
            .mx-footer a:hover { color: var(--mx-primary); opacity: 1; }
            .mx-footer-logo {
                width: 14px; height: 14px; border-radius: 3px;
                object-fit: cover; background: rgba(128,128,128,0.2);
                display: inline-block; vertical-align: middle;
            }

            /* Utils */
            .twk-note-settings-btn { opacity: 0.6; }
            .twk-note-settings-btn:hover { opacity: 1; }
        `);
    }

    // ========================
    // 5) 编辑面板 (Editor Modal)
    // ========================
    function openEditor(identity) {
        const user = store.users[identity.key] || { alias: '', color: '#1d9bf0', tagColor: '#ffd400', note: '', tags: [] };
        let currentTags = [...user.tags];
        let currentColor = user.color || '#1d9bf0';
        let currentTagColor = user.tagColor || '#ffd400';
        let currentAlias = user.alias || '';

        const colors = [
            { name: 'Sky', value: '#1d9bf0' },
            { name: 'Red', value: '#f4212e' },
            { name: 'Orange', value: '#ffad1f' },
            { name: 'Yellow', value: '#ffd400' },
            { name: 'Green', value: '#00ba7c' },
            { name: 'Purple', value: '#7856ff' },
            { name: 'Pink', value: '#f91880' },
            { name: 'Gray', value: '#536471' }
        ];

        const overlay = document.createElement('div');
        overlay.className = 'twk-note-overlay';

        const modal = document.createElement('div');
        modal.className = 'twk-note-modal';

        const render = () => {
            modal.innerHTML = `
                <h3>
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-size:16px;">${identity.handle}</span>
                        ${user.handleHistory && user.handleHistory.length > 0 ?
                    `<span style="font-size:10px; opacity:0.5; font-weight:normal;">历史轨迹: ${user.handleHistory.join(' ← ')}</span>` : ''}
                    </div>
                    <div class="twk-note-modal-nav">
                        <span class="twk-note-nav-btn" id="mx-nav-search">🔍 搜索</span>
                        <span class="twk-note-nav-btn" id="mx-nav-settings">⚙️ 设置</span>
                        <button class="twk-note-btn-close-x" style="background:none; border:none; color:inherit; font-size:20px; cursor:pointer; margin-left:8px;">×</button>
                    </div>
                </h3>

                <div style="display: flex; gap: 24px;">
                    <div class="twk-note-field" style="flex: 1;">
                        <label class="twk-note-label">备注别名</label>
                        <input type="text" class="twk-note-input twk-note-alias-input" value="${currentAlias}" placeholder="如：首席科学家" maxlength="50">
                    </div>
                    <div class="twk-note-field" style="width: 160px; flex-shrink: 0;">
                        <label class="twk-note-label">个性化色彩</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div class="mx-color-grid">
                                <span style="font-size: 10px; width: 24px; opacity: 0.5;">别名</span>
                                ${colors.map(c => `
                                    <div class="mx-color-swatch ${currentColor === c.value ? 'active' : ''}"
                                         style="background: ${c.value};"
                                         data-type="alias" data-color="${c.value}"></div>
                                `).join('')}
                            </div>
                            <div class="mx-color-grid">
                                <span style="font-size: 10px; width: 24px; opacity: 0.5;">标签</span>
                                ${colors.map(c => `
                                    <div class="mx-color-swatch ${currentTagColor === c.value ? 'active' : ''}"
                                         style="background: ${c.value};"
                                         data-type="tag" data-color="${c.value}"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="twk-note-field">
                    <label class="twk-note-label">标签系统</label>
                    <div class="twk-note-tags-container" style="margin-bottom: 8px;">
                        ${currentTags.map((tag, i) => {
                        const text = typeof tag === 'string' ? tag : tag.text;
                        const color = typeof tag === 'string' ? currentTagColor : tag.color;
                        return `<span class="twk-note-tag-editor" style="background:${color}">${text}<span class="twk-note-tag-del" data-idx="${i}">×</span></span>`;
                    }).join('')}
                    </div>
                    <input type="text" class="twk-note-input twk-note-tag-input" style="padding: 8px 12px; font-size: 13px;" placeholder="输入标签按回车 (使用上方预选色)...">
                    <div class="twk-note-default-tags" style="opacity: 0.8;">
                        常用: ${store.settings.defaultTags.filter(t => !currentTags.some(ct => (typeof ct === 'string' ? ct : ct.text) === t)).slice(0, 10).map(t => `<span class="twk-note-default-tag-btn" data-tag="${t}">${t}</span>`).join('')}
                    </div>
                </div>

                <div class="twk-note-actions">
                    ${user.key ? `<button class="twk-note-btn twk-note-btn-danger" id="mx-btn-clear" style="padding: 6px 16px; font-size: 12px; opacity:0.6;">清空数据</button>` : ''}
                    <div style="flex:1"></div>
                    <button class="twk-note-btn twk-note-btn-primary" id="mx-btn-save" style="padding: 8px 32px;">保存更改</button>
                </div>

                <div class="mx-footer">
                    <a href="https://x.com/vaghr_btc" target="_blank">
                        <img src="${VTAG_LOGO}" class="mx-footer-logo">
                        <span>Vtag 3.1.0 by Vaghr</span>
                    </a>
                </div>
            `;

            const aliasInput = modal.querySelector('.twk-note-alias-input');
            const tagInput = modal.querySelector('.twk-note-tag-input');

            // 实时保持别名，防止编辑标签时重置
            aliasInput.oninput = () => { currentAlias = aliasInput.value; };

            // 颜色选择 (支持别名和标签独立选择)
            modal.querySelectorAll('.mx-color-swatch').forEach(el => {
                el.onclick = () => {
                    const type = el.dataset.type;
                    const color = el.dataset.color;
                    if (type === 'alias') currentColor = color;
                    else currentTagColor = color;
                    render();
                };
            });

            tagInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    const tagText = tagInput.value.trim().toLowerCase();
                    if (tagText && !currentTags.some(t => (typeof t === 'string' ? t : t.text) === tagText) && currentTags.length < 20) {
                        currentTags.push({ text: tagText, color: currentTagColor });
                        tagInput.value = '';
                        render();
                        modal.querySelector('.twk-note-tag-input').focus();
                    }
                }
            };

            modal.querySelectorAll('.twk-note-tag-del').forEach(el => {
                el.onclick = () => {
                    currentTags.splice(parseInt(el.dataset.idx), 1);
                    render();
                };
            });

            modal.querySelectorAll('.twk-note-default-tag-btn').forEach(el => {
                el.onclick = () => {
                    const tagText = el.dataset.tag;
                    if (tagText && !currentTags.some(t => (typeof t === 'string' ? t : t.text) === tagText) && currentTags.length < 20) {
                        currentTags.push({ text: tagText, color: currentTagColor });
                        render();
                    }
                };
            });

            modal.querySelector('#mx-btn-save').onclick = () => {
                upsertUser(identity, {
                    alias: currentAlias.trim(),
                    color: currentColor,
                    tagColor: currentTagColor,
                    note: "",
                    tags: currentTags
                });
                close();
            };

            modal.querySelector('#mx-nav-search').onclick = (e) => {
                e.stopPropagation();
                close();
                setTimeout(openSearchPanel, 50); // 确保第一个模态框彻底关闭
            };

            modal.querySelector('#mx-nav-settings').onclick = (e) => {
                e.stopPropagation();
                openSettings();
            };

            modal.querySelector('.twk-note-btn-close-x').onclick = close;

            const clearBtn = modal.querySelector('#mx-btn-clear');
            if (clearBtn) {
                clearBtn.onclick = () => {
                    if (confirm('确定要清空该账号的所有备注和标签吗？')) {
                        removeUser(identity.key);
                        close();
                    }
                };
            }
        };

        const close = () => { document.body.removeChild(overlay); };
        overlay.onclick = (e) => { if (e.target === overlay) close(); };
        window.onkeydown = (e) => { if (e.key === 'Escape') close(); };

        render();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        modal.querySelector('.twk-note-alias-input').focus();
    }

    // ========================
    // 6) 搜索面板 (Command Palette)
    // ========================
    function openSearchPanel() {
        if (document.querySelector('.twk-note-search-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'twk-note-search-wrapper';

        const overlay = document.createElement('div');
        overlay.className = 'twk-note-overlay';

        const panel = document.createElement('div');
        panel.className = 'twk-note-search-panel';

        panel.innerHTML = `
            <input type="text" class="twk-note-search-input" placeholder="搜索 handle, 备注或 tag:Project... (Vtag)" spellcheck="false" autofocus>
            <div class="twk-note-search-results"></div>
            <div class="twk-note-search-footer">
                <div class="mx-footer" style="margin-top:0; padding-top:0; border-top:none;">
                    <a href="https://x.com/vaghr_btc" target="_blank" style="opacity:0.6;">
                        <img src="${VTAG_LOGO}" class="mx-footer-logo" style="width:12px; height:12px;">
                        Vtag 3.1.0 by Vaghr
                    </a>
                </div>
                <span><b>↑↓</b> 移动  <b>Enter</b> 编辑  <b>↗</b> 跳转主页  <b>Esc</b> 关闭</span>
            </div>
        `;

        const input = panel.querySelector('.twk-note-search-input');
        const resultsContainer = panel.querySelector('.twk-note-search-results');
        let activeIdx = 0;
        let filteredUsers = [];

        const updateResults = () => {
            const query = input.value.trim().toLowerCase();
            if (!query) {
                // 显示最近更新的 20 条
                filteredUsers = Object.values(store.users).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20);
            } else {
                // 基于语法的搜索
                const parts = query.split(/\s+/);
                const tagParts = parts.filter(p => p.startsWith('tag:'));
                const keywordParts = parts.filter(p => !p.startsWith('tag:'));

                let candidates = [];
                if (tagParts.length > 0) {
                    const tagName = tagParts[0].replace('tag:', '');
                    const keys = store.index.byTag[tagName] || [];
                    candidates = keys.map(k => store.users[k]).filter(Boolean);
                } else {
                    candidates = Object.values(store.users);
                }

                filteredUsers = candidates.filter(user => {
                    return keywordParts.every(kw => {
                        const kwClean = kw.toLowerCase();
                        return (user.handle && user.handle.toLowerCase().includes(kwClean)) ||
                            (user.displayName && user.displayName.toLowerCase().includes(kwClean)) ||
                            (user.note && user.note.toLowerCase().includes(kwClean)) ||
                            (user.handleHistory && user.handleHistory.some(h => h.toLowerCase().includes(kwClean))) ||
                            (user.alias && user.alias.toLowerCase().includes(kwClean));
                    });
                }).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20);
            }

            renderResults();
        };

        const renderResults = () => {
            if (filteredUsers.length === 0) {
                resultsContainer.innerHTML = `<div class="twk-note-search-empty">没有匹配的账号</div>`;
                return;
            }
            resultsContainer.innerHTML = filteredUsers.map((user, i) => `
                <div class="twk-note-search-item ${i === activeIdx ? 'active' : ''}" data-idx="${i}">
                    <div class="twk-note-search-item-header">
                        <span class="twk-note-search-item-title">
                            ${user.alias ? `<span style="color:${user.color || 'var(--mx-primary)'}">${user.alias}</span>` : (user.displayName || '未命名')}
                            <span class="twk-note-search-item-handle">${user.handle}</span>
                        </span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${(user.tags || []).slice(0, 3).map(t => {
                const text = typeof t === 'string' ? t : t.text;
                const color = typeof t === 'string' ? (user.tagColor || '#ffd400') : (t.color || '#ffd400');
                return `<span class="twk-note-tag-pill" style="border-color:${color}44; color:${color}; background:${color}11;">${text}</span>`;
            }).join('')}
                            <div class="twk-note-search-jump" data-handle="${user.handle.replace('@', '')}" title="跳转到个人主页">↗</div>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <div class="twk-note-search-item-note">${user.note || '通过 Vtag 管理此账号'}</div>
                        ${user.handleHistory && user.handleHistory.length > 0 ?
                    `<div style="font-size:10px; opacity:0.4; font-style:italic;">曾用: ${user.handleHistory[0]}</div>` : ''}
                    </div>
                </div>
            `).join('');

            resultsContainer.querySelectorAll('.twk-note-search-item').forEach(el => {
                el.onclick = (e) => {
                    const jumpBtn = e.target.closest('.twk-note-search-jump');
                    if (jumpBtn) {
                        e.stopPropagation();
                        window.location.href = `https://x.com/${jumpBtn.dataset.handle}`;
                    } else {
                        selectItem(parseInt(el.dataset.idx));
                    }
                };
            });
        };

        const selectItem = (idx) => {
            const user = filteredUsers[idx];
            if (user) {
                close();
                openEditor(user);
            }
        };

        input.oninput = () => {
            activeIdx = 0;
            updateResults();
        };

        input.onkeydown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIdx = (activeIdx + 1) % filteredUsers.length;
                renderResults();
                resultsContainer.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIdx = (activeIdx - 1 + filteredUsers.length) % filteredUsers.length;
                renderResults();
                resultsContainer.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                selectItem(activeIdx);
            }
        };

        const close = () => { document.body.removeChild(wrapper); };
        overlay.onclick = close;
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });

        updateResults();
        wrapper.appendChild(overlay);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);
        input.focus();
    }

    // ========================
    // 7) 设置面板 (Settings)
    // ========================
    function openSettings() {
        const overlay = document.createElement('div');
        overlay.className = 'twk-note-overlay';
        overlay.style.zIndex = '10002';

        const modal = document.createElement('div');
        modal.className = 'twk-note-modal';
        modal.style.width = '550px';

        const render = () => {
            modal.innerHTML = `
                <h3>插件设置</h3>
                <div class="twk-note-field">
                    <label class="twk-note-label">功能开关</label>
                    <label style="font-size:13px"><input type="checkbox" id="markx-toggle-timeline" ${store.settings.enableInTimeline ? 'checked' : ''}> 在时间线中显示备注</label>
                </div>
                <div class="twk-note-field">
                    <label class="twk-note-label">显示限制</label>
                    展示标签数: <input type="number" id="markx-max-tags" value="${store.settings.maxTagsToShow}" min="1" max="10" style="width:50px">
                    备注预览长: <input type="number" id="markx-max-note" value="${store.settings.maxNotePreviewLen}" min="10" max="200" style="width:60px">
                </div>
                <div class="twk-note-field">
                    <label class="twk-note-label">常用标签 (一行一个)</label>
                    <textarea id="markx-default-tags" class="twk-note-input twk-note-textarea" style="min-height:80px">${store.settings.defaultTags.join('\n')}</textarea>
                </div>
                <div class="twk-note-field">
                    <label class="twk-note-label">数据管理 (账号总数: ${Object.keys(store.users).length})</label>
                    <div style="display:flex; gap:8px;">
                        <input type="file" id="markx-import-file" accept=".json" style="display:none">
                        <button class="twk-note-btn twk-note-btn-secondary" id="markx-export">导出 JSON</button>
                        <button class="twk-note-btn twk-note-btn-secondary" id="markx-import-trigger">导入 JSON</button>
                        <button class="twk-note-btn twk-note-btn-danger" id="markx-clear-all">清空所有数据</button>
                    </div>
                </div>
                <div class="twk-note-actions">
                    <button class="twk-note-btn twk-note-btn-secondary twk-note-btn-close">关闭</button>
                    <button class="twk-note-btn twk-note-btn-primary twk-note-btn-save">保存配置</button>
                </div>

                <div class="mx-footer">
                    <a href="https://x.com/vaghr_btc" target="_blank">
                        <img src="${VTAG_LOGO}" class="mx-footer-logo">
                        <span>Vtag 3.1.0 by Vaghr</span>
                    </a>
                </div>
            `;

            modal.querySelector('.twk-note-btn-save').onclick = () => {
                store.settings.enableInTimeline = modal.querySelector('#markx-toggle-timeline').checked;
                store.settings.maxTagsToShow = parseInt(modal.querySelector('#markx-max-tags').value);
                store.settings.maxNotePreviewLen = parseInt(modal.querySelector('#markx-max-note').value);
                store.settings.defaultTags = modal.querySelector('#markx-default-tags').value.split('\n').map(t => t.trim().toLowerCase()).filter(t => t);
                saveStore();
                alert('配置已保存 (部分 UI 可能需要刷新生效)');
                close();
            };

            modal.querySelector('.twk-note-btn-close').onclick = close;

            modal.querySelector('#markx-export').onclick = () => {
                const data = JSON.stringify(store, null, 2);
                GM_setClipboard(data);

                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Vtag_backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                alert('导出成功！JSON 文件已下载，数据也已复制到剪贴板。');
            };

            const fileInput = modal.querySelector('#markx-import-file');
            modal.querySelector('#markx-import-trigger').onclick = () => fileInput.click();

            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (!imported.users || !imported.version) throw new Error('无效的格式');
                        if (confirm(`准备导入 ${Object.keys(imported.users).length} 个账号，确定覆盖同名数据吗？`)) {
                            // 简单的迁移逻辑：如果旧标签是字符串数组，转换之
                            Object.values(imported.users).forEach(u => {
                                if (u.tags && u.tags.length > 0 && typeof u.tags[0] === 'string') {
                                    u.tags = u.tags.map(t => ({ text: t, color: u.tagColor || "#ffd400" }));
                                }
                            });
                            Object.assign(store.users, imported.users);
                            rebuildIndex();
                            saveStore();
                            alert('导入完成！');
                            location.reload();
                        }
                    } catch (err) {
                        alert('导入失败: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };

            modal.querySelector('#markx-clear-all').onclick = () => {
                if (confirm('!!! 警告 !!!\n确定要清空所有数据吗？此操作不可恢复。')) {
                    if (confirm('请再次确认：删除所有已保存的账号备注吗？')) {
                        GM_deleteValue(STORE_KEY);
                        alert('已清空，页面即将刷新');
                        location.reload();
                    }
                }
            };
        };

        const close = () => { document.body.removeChild(overlay); };
        render();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // ========================
    // 7.1) 导航与快捷键监听
    // ========================
    function observeNavigation() {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(reScan, 500); // 路由变化后延迟扫描
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    function setupShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ctrl+Shift+K 或 Cmd+Shift+K
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === 'K') {
                e.preventDefault();
                openSearchPanel();
            }
            // Esc 关闭弹窗 (如果需要)
        });
    }

    // ========================
    // 8) 初始化
    // ========================
    function init() {
        loadStore();
        injectStyles();
        observeDOM();
        reScan();
        observeNavigation();
        setupShortcuts();
        console.log(`%c [Vtag] %c Initialized - Data version: ${store.version} `, 'background: #ffd400; color: #000; font-weight: bold; border-radius: 4px;', 'background: transparent; color: inherit;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
