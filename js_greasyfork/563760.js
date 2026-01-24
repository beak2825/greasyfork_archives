// ==UserScript==
// @name         AI 增强面板 (全平台同步版 - 修复 LMSYS)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  为 Gemini、ChatGPT、Claude、LMSYS 添加历史对话索引、Prompt 收藏、智能隐藏，支持跨平台收藏互通，修复 LMSYS 目录生成问题。
// @author       Chantec
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://lmarena.ai/*
// @match        https://aistudio.google.com/*
// @match        https://chat.lmsys.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563760/AI%20%E5%A2%9E%E5%BC%BA%E9%9D%A2%E6%9D%BF%20%28%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%90%8C%E6%AD%A5%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%20LMSYS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563760/AI%20%E5%A2%9E%E5%BC%BA%E9%9D%A2%E6%9D%BF%20%28%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%90%8C%E6%AD%A5%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%20LMSYS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 全平台适配配置 ---
    const SITE_CONFIG = {
        gemini: {
            check: () => location.host.includes('gemini.google.com'),
            querySelector: '.query-text',
            inputSelector: 'div[role="textbox"], div[contenteditable="true"]',
            fillInput: (el, text) => {
                el.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, text);
            }
        },
        aistudio: {
            check: () => location.host.includes('aistudio.google.com'),
            querySelector: '.chat-turn-container.render.user, .chat-turn-container.user, .virtual-scroll-container.user-prompt-container, .cmark-node.user-chunk',
            inputSelector: 'textarea[aria-label="Enter a prompt"], textarea.textarea',
            fillInput: (el, text) => {
                el.focus();
                el.value = text;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        chatgpt: {
            check: () => location.host.includes('chatgpt.com'),
            querySelector: '[data-message-author-role="user"]',
            inputSelector: '#prompt-textarea',
            fillInput: (el, text) => {
                el.focus();
                el.innerHTML = `<p>${text}</p>`;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },
        claude: {
            check: () => location.host.includes('claude.ai'),
            querySelector: '.font-user-message',
            inputSelector: 'div[contenteditable="true"]',
            fillInput: (el, text) => {
                el.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, text);
            }
        },
        lmarena: {
            check: () => location.host.includes('lmarena.ai') || location.host.includes('lmsys.org'),
            // [修复] 扩充了选择器，覆盖 Gradio 不同版本的用户消息结构
            querySelector: '[data-testid="user"], .user, .message-user, [data-testid="user-message"], .chat-message-user',
            inputSelector: 'textarea[data-testid="textbox"], textarea',
            fillInput: (el, text) => {
                el.focus();
                el.value = text;
                // Gradio 需要触发 input 和 change 事件才能更新状态
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    // 自动判断当前站点
    const getCurrentSite = () => {
        if (SITE_CONFIG.aistudio.check()) return SITE_CONFIG.aistudio;
        if (SITE_CONFIG.gemini.check()) return SITE_CONFIG.gemini;
        if (SITE_CONFIG.chatgpt.check()) return SITE_CONFIG.chatgpt;
        if (SITE_CONFIG.claude.check()) return SITE_CONFIG.claude;
        if (SITE_CONFIG.lmarena.check()) return SITE_CONFIG.lmarena;
        return null;
    };

    const currentSite = getCurrentSite();
    if (!currentSite) return; // 如果不在支持的网站列表，停止运行

    // --- 1. 样式表 (保持高颜值设计) ---
    const styles = `
        #gemini-nav-sidebar {
            position: fixed; box-sizing: border-box;
            background: #ffffff !important;
            border: 1px solid #e3e3e3;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.15);
            border-radius: 24px;
            z-index: 99999; display: flex; flex-direction: column;
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            max-width: 98vw; max-height: 98vh;
            color: #333;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        border-radius 0.3s, opacity 0.3s, box-shadow 0.3s;
        }

        #gemini-nav-sidebar.no-transition { transition: none !important; }

        .highlight-pulse { animation: highlightPulse 1s ease-out; }
        @keyframes highlightPulse {
            0% { background-color: rgba(26, 115, 232, 0.3); }
            100% { background-color: transparent; }
        }

        /* --- 隐藏状态 --- */
        #gemini-nav-sidebar.collapsed { cursor: pointer; border: 1px solid #ddd; opacity: 0.95; }
        #gemini-nav-sidebar.collapsed > *:not(#gemini-collapsed-icon) { display: none !important; }

        #gemini-nav-sidebar.collapsed:not([class*="snapped-"]) {
            width: 48px !important; height: 48px !important;
            border-radius: 50% !important; background: #ffffff !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        #gemini-collapsed-icon {
            display: none; flex-direction: column; align-items: center; justify-content: center;
            width: 100%; height: 100%; gap: 3px;
        }
        #gemini-nav-sidebar.collapsed:not([class*="snapped-"]) #gemini-collapsed-icon { display: flex; }
        .menu-line { width: 16px; height: 2px; background: #5f6368; border-radius: 1px; }

        /* 边缘吸附 */
        #gemini-nav-sidebar.collapsed.snapped-left {
            width: 8px !important; border-radius: 0 8px 8px 0 !important;
            left: 0 !important; border-left: none; background: #ffffff !important;
            box-shadow: 2px 0 5px rgba(0,0,0,0.08);
        }
        #gemini-nav-sidebar.collapsed.snapped-right {
            width: 8px !important; border-radius: 8px 0 0 8px !important;
            left: calc(100vw - 8px) !important; border-right: none; background: #ffffff !important;
            box-shadow: -2px 0 5px rgba(0,0,0,0.08);
        }

        /* --- 列表项 --- */
        .gemini-nav-item {
            position: relative; display: block;
            padding: 8px 12px; margin: 2px 4px;
            font-size: 13px; color: #1e1e1e; cursor: pointer;
            border-radius: 12px; transition: background 0.2s; overflow: hidden;
        }
        .gemini-nav-item:hover { background: #f0f4f9; }

        .item-text {
            display: block; width: 100%;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            pointer-events: none; transition: color 0.2s;
        }
        .gemini-nav-item:hover .item-text { color: #1a73e8; }

        .action-btn {
            position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
            opacity: 0; cursor: pointer; font-size: 12px;
            width: 24px; height: 24px; line-height: 24px; text-align: center;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(2px);
            border-radius: 50%; box-shadow: -2px 0 8px rgba(0,0,0,0.1);
            transition: opacity 0.2s, transform 0.2s; z-index: 10;
        }
        .gemini-nav-item:hover .action-btn { opacity: 1; }
        .action-btn:hover { background: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transform: translateY(-50%) scale(1.1); }

        /* --- 头部与布局 --- */
        #gemini-nav-header { padding: 16px 16px 10px 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; cursor: move; }

        #gemini-nav-lock { width: 10px; height: 10px; border-radius: 50%; background: #d1d1d1; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 0 1px #e3e3e3; transition: 0.2s; }
        #gemini-nav-lock:hover { transform: scale(1.2); }
        #gemini-nav-lock.active { background: #1a73e8; box-shadow: 0 0 0 1px #1a73e8; }

        #gemini-nav-tabs { display: flex; background: #f0f4f9; padding: 2px; border-radius: 20px; }
        .nav-tab { padding: 3px 12px; font-size: 12px; cursor: pointer; color: #444746; border-radius: 18px; transition: 0.2s; }
        .nav-tab.active { color: #1a73e8; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 500; }

        #gemini-nav-content-wrapper { flex-grow: 1; overflow-y: auto; padding: 4px 6px; }
        .content-panel { display: none; }
        .content-panel.active { display: block; }

        /* --- 搜索框 --- */
        #gemini-nav-search-container { padding: 4px 16px 8px 16px; }
        #gemini-nav-search-input {
            width: 100%; box-sizing: border-box;
            padding: 9px 14px; background: #f0f4f9; border: 1px solid transparent;
            border-radius: 20px; font-size: 13px; outline: none; transition: all 0.2s;
            color: #333;
        }
        #gemini-nav-search-input:focus {
            background: #ffffff; border-color: #1a73e8;
            box-shadow: 0 1px 4px rgba(26,115,232,0.2);
        }

        .resizer { position: absolute; width: 14px; height: 14px; z-index: 10001; }
        .resizer-tl { top: 0; left: 0; cursor: nw-resize; }
        .resizer-tr { top: 0; right: 0; cursor: ne-resize; }
        .resizer-bl { bottom: 0; left: 0; cursor: sw-resize; }
        .resizer-br { bottom: 0; right: 0; cursor: se-resize; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // --- 2. 构造 DOM (保持完整结构) ---
    const sidebar = document.createElement('div');
    sidebar.id = 'gemini-nav-sidebar';

    const collapsedIcon = document.createElement('div');
    collapsedIcon.id = 'gemini-collapsed-icon';
    [1, 2, 3].forEach(() => {
        const line = document.createElement('span');
        line.className = 'menu-line';
        collapsedIcon.appendChild(line);
    });

    const header = document.createElement('div');
    header.id = 'gemini-nav-header';
    const lockBtn = document.createElement('div');
    lockBtn.id = 'gemini-nav-lock';
    lockBtn.title = '点击切换：绿色为固定，灰色为自动隐藏';

    const tabsContainer = document.createElement('div');
    tabsContainer.id = 'gemini-nav-tabs';
    const tabNav = document.createElement('div');
    tabNav.className = 'nav-tab active';
    tabNav.textContent = '目录';
    tabNav.dataset.target = 'panel-nav';
    const tabFav = document.createElement('div');
    tabFav.className = 'nav-tab';
    tabFav.textContent = '收藏';
    tabFav.dataset.target = 'panel-fav';
    tabsContainer.append(tabNav, tabFav);
    header.append(lockBtn, tabsContainer);

    const searchContainer = document.createElement('div');
    searchContainer.id = 'gemini-nav-search-container';
    const searchInput = document.createElement('input');
    searchInput.id = 'gemini-nav-search-input';
    searchInput.placeholder = '搜索...';
    searchContainer.append(searchInput);

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'gemini-nav-content-wrapper';
    const panelNav = document.createElement('div');
    panelNav.id = 'panel-nav';
    panelNav.className = 'content-panel active';
    const panelFav = document.createElement('div');
    panelFav.id = 'panel-fav';
    panelFav.className = 'content-panel';
    contentWrapper.append(panelNav, panelFav);

    const resizers = ['tl', 'tr', 'bl', 'br'].map(pos => {
        const el = document.createElement('div');
        el.className = `resizer resizer-${pos}`;
        el.dataset.pos = pos;
        return el;
    });

    sidebar.append(collapsedIcon, header, searchContainer, contentWrapper, ...resizers);
    document.body.appendChild(sidebar);

    // --- 3. 业务逻辑 (跨平台同步核心) ---

    // 【数据迁移】将本地旧数据迁移到油猴全局存储，确保第一次使用不丢失数据
    const localLegacyData = JSON.parse(localStorage.getItem('gemini-favorites') || '[]');
    if (GM_getValue('ai_global_favorites', null) === null && localLegacyData.length > 0) {
        GM_setValue('ai_global_favorites', localLegacyData);
    }

    // 初始化读取
    let favorites = GM_getValue('ai_global_favorites', []);
    const saveFavorites = () => GM_setValue('ai_global_favorites', favorites);

    // 自动隐藏逻辑 (保留本地存储，因为每个网站的布局偏好不同)
    let isAutoHideEnabled = JSON.parse(localStorage.getItem('gemini-auto-hide')) ?? true;
    let autoHideTimer = null;

    function updateLockUI() { lockBtn.classList.toggle('active', !isAutoHideEnabled); }
    updateLockUI();

    lockBtn.onclick = (e) => {
        e.stopPropagation();
        isAutoHideEnabled = !isAutoHideEnabled;
        localStorage.setItem('gemini-auto-hide', isAutoHideEnabled);
        updateLockUI();
        if (!isAutoHideEnabled) { clearTimeout(autoHideTimer); sidebar.classList.remove('collapsed'); }
    };

    // 搜索功能
    searchInput.oninput = () => {
        const q = searchInput.value.toLowerCase();
        const activePanelId = document.querySelector('.nav-tab.active').dataset.target;
        const activePanel = document.getElementById(activePanelId);
        if (activePanel) {
            activePanel.querySelectorAll('.gemini-nav-item').forEach(item => {
                const text = item.querySelector('.item-text').textContent.toLowerCase();
                item.style.display = text.includes(q) ? 'block' : 'none';
            });
        }
    };

    // 填充输入框 (根据不同网站调用不同逻辑)
    function fillInput(text) {
        const inputEl = document.querySelector(currentSite.inputSelector);
        if (inputEl) {
            currentSite.fillInput(inputEl, text);
        } else {
            console.log("AI Panel: 找不到输入框，尝试使用通用选择器");
        }
    }

    // 渲染收藏 (每次渲染都拉取最新数据)
    function renderFavorites() {
        favorites = GM_getValue('ai_global_favorites', []); // 强行同步

        if (!panelFav.classList.contains('active')) return;
        panelFav.replaceChildren();
        if (favorites.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'color:#747775;text-align:center;margin-top:20px;font-size:12px;';
            empty.textContent = '暂无收藏 Prompt';
            panelFav.append(empty);
            return;
        }
        favorites.forEach((fav, i) => {
            const item = document.createElement('div');
            item.className = 'gemini-nav-item';
            const txt = document.createElement('span');
            txt.className = 'item-text';
            txt.textContent = fav;
            item.onclick = () => fillInput(fav);
            const delBtn = document.createElement('span');
            delBtn.className = 'action-btn';
            delBtn.textContent = '🗑️';
            delBtn.onclick = (e) => { e.stopPropagation(); favorites.splice(i, 1); saveFavorites(); renderFavorites(); };
            item.append(txt, delBtn);
            panelFav.append(item);
        });
        if (searchInput.value) searchInput.dispatchEvent(new Event('input'));
    }

    const lmarenaSelectors = [
        currentSite.querySelector,
        '[data-message-author-role="user"]',
        '[data-role="user"]',
        '[data-author="user"]',
        '[data-testid*="user"]',
        '.message.user',
        '.message-row.user',
        '.message-row .user',
        '.chat-message.user',
        '.chat-message-user',
        '.message-user',
        '.user-message'
    ].join(', ');

    function queryAll(selector) {
        const results = Array.from(document.querySelectorAll(selector));
        const frames = Array.from(document.querySelectorAll('iframe'));
        frames.forEach(frame => {
            try {
                const doc = frame.contentDocument;
                if (doc) results.push(...doc.querySelectorAll(selector));
            } catch (e) {}
        });
        return results;
    }

    function queryAllDeep(selector) {
        const results = [];
        const seen = new Set();
        const add = (items) => {
            items.forEach(item => {
                if (!seen.has(item)) {
                    seen.add(item);
                    results.push(item);
                }
            });
        };
        const visit = (root) => {
            if (!root || !root.querySelectorAll) return;
            add(Array.from(root.querySelectorAll(selector)));
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
            let node = walker.currentNode;
            while (node) {
                if (node.shadowRoot) visit(node.shadowRoot);
                node = walker.nextNode();
            }
        };
        visit(document);
        const frames = Array.from(document.querySelectorAll('iframe'));
        frames.forEach(frame => {
            try {
                const doc = frame.contentDocument;
                if (doc) visit(doc);
            } catch (e) {}
        });
        return results;
    }

    function normalizeText(value) {
        return (value || '').replace(/\s+/g, ' ').trim();
    }

    let aiStudioOutlineCache = [];
    let aiStudioOutlineCollecting = false;

    function getAiStudioChatBlocks() {
        // 1. Target chat turns
        const turns = Array.from(document.querySelectorAll('ms-chat-turn'));
        const blocks = [];
        const seen = new Set();

        turns.forEach(turn => {
            // Check if it's a user turn
            const userContainer = turn.querySelector('.chat-turn-container.user, .user-prompt-container');
            if (!userContainer) return;

            // Try to find text content
            // Strategy 1: Look for ms-cmark-node (markdown content)
            let textEl = turn.querySelector('ms-cmark-node');
            
            // Strategy 2: Look for turn-content
            if (!textEl) {
                textEl = turn.querySelector('.turn-content');
            }

            // Strategy 3: Look for textarea (if editing)
            if (!textEl) {
                textEl = turn.querySelector('textarea');
            }
            
            // Strategy 4: Fallback to container text (might be "edit" etc, so be careful)
            let text = '';
            if (textEl) {
                text = textEl.innerText || textEl.textContent;
            } else {
                 // Try deep search for text nodes
                 text = userContainer.innerText;
            }

            // Cleanup text
            text = normalizeText(text);
            
            // Filter out system UI text like "edit", "more_vert" if that's all there is
            if (text === 'edit more_vert' || text === 'edit' || text === 'more_vert') {
                // Try to find the actual content sibling or child that is NOT the toolbar
                // This is hard without specific selector. 
                // Let's assume ms-cmark-node is the key.
                return; 
            }

            if (!text || text.length < 1) return;
            if (seen.has(text)) return;

            const proxy = document.createElement('div');
            proxy.innerText = text;
            proxy.__aiPanelTarget = userContainer; // Scroll to container
            proxy.__aiPanelLabel = text;
            blocks.push(proxy);
            seen.add(text);
        });

        return blocks;
    }

    function getAiStudioPromptLinkBlocks() {
        // 1. Direct check for known native structure (Stable & Fast)
        // Structure: ms-prompt-history-v3 ... li.prompt-link-wrapper > a.prompt-link
        // We use a broad selector first to catch them all
        const directLinks = Array.from(document.querySelectorAll('ms-prompt-history-v3 a.prompt-link, .prompt-link, a[href^="/prompts/"]'));
        
        let elements = directLinks;
        
        // 2. If nothing found, try queryAllDeep as fallback
        if (elements.length === 0) {
             elements = queryAllDeep('.prompt-link, .prompt-link-wrapper, [class*="prompt-link"]');
        }
        
        const blocks = [];
        const seen = new Set();
        elements.forEach(el => {
            // Priority: aria-label -> title -> textContent
            // Note: Sometimes the text is inside a child span or div
            const label = normalizeText(el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent);
            
            if (!label || label.length < 1 || label.length > 200) return;
            if (!/[a-zA-Z0-9\u4e00-\u9fa5]/.test(label)) return;
            if (seen.has(label)) return;
            
            const proxy = document.createElement('div');
            proxy.innerText = label;
            proxy.__aiPanelTarget = el; // Store reference to original element
            proxy.__aiPanelLabel = label;
            
            // Ensure click works by finding the clickable ancestor if needed
            // For AI Studio, the <a> tag itself is clickable
            
            blocks.push(proxy);
            seen.add(label);
        });
        return blocks;
    }

    function extractAiStudioOutlineLabels(container) {
        const excluded = new Set([
            'menu', 'settings', 'share', 'copy', 'edit', 'delete', 'rename', 'pin', 'unpin',
            'close', 'open', 'help', 'feedback', 'history', 'model', 'models', 'new', 'save',
            'cancel', 'ok', 'yes', 'no', 'next', 'previous', 'back', 'forward'
        ]);
        const items = Array.from(container.querySelectorAll('[aria-label],[title]'));
        const labels = [];
        items.forEach(el => {
            const label = normalizeText(el.getAttribute('aria-label') || el.getAttribute('title'));
            if (!label || label.length < 3 || label.length > 200) return;
            if (!/[a-zA-Z0-9\u4e00-\u9fa5]/.test(label)) return;
            if (excluded.has(label.toLowerCase())) return;
            const role = (el.getAttribute('role') || '').toLowerCase();
            if (role && !['button', 'listitem', 'menuitem', 'option', 'tab'].includes(role)) return;
            labels.push({ label, el });
        });
        return labels;
    }

    function getAiStudioOutlineContainer() {
        const containerSelectors = '[role="list"], [role="menu"], [role="listbox"], [role="tablist"], [role="navigation"]';
        const containers = queryAllDeep(containerSelectors);
        let best = null;
        containers.forEach(container => {
            const labels = extractAiStudioOutlineLabels(container);
            if (labels.length < 2) return;
            const avgLen = labels.reduce((sum, item) => sum + item.label.length, 0) / labels.length;
            const score = labels.length * 10 + avgLen;
            if (!best || score > best.score) best = { container, labels, score };
        });
        return best;
    }

    function mergeAiStudioOutlineCache(labels) {
        const existing = new Set(aiStudioOutlineCache);
        labels.forEach(({ label }) => {
            if (!existing.has(label)) {
                existing.add(label);
                aiStudioOutlineCache.push(label);
            }
        });
    }

    function buildAiStudioOutlineProxies(labels) {
        const blocks = [];
        const seen = new Set();
        labels.forEach(({ label, el }) => {
            if (seen.has(label)) return;
            const proxy = document.createElement('div');
            proxy.innerText = label;
            proxy.__aiPanelTarget = el;
            proxy.__aiPanelLabel = label;
            blocks.push(proxy);
            seen.add(label);
        });
        return blocks;
    }

    function getAiStudioOutlineBlocks() {
        const best = getAiStudioOutlineContainer();
        if (!best) return [];
        mergeAiStudioOutlineCache(best.labels);
        return buildAiStudioOutlineProxies(best.labels);
    }

    function startAiStudioOutlineCollector() {
        if (aiStudioOutlineCollecting) return;
        const best = getAiStudioOutlineContainer();
        if (!best || !best.container) return;
        const container = best.container;
        aiStudioOutlineCollecting = true;
        let idleCount = 0;
        const step = Math.max(80, Math.floor(container.clientHeight * 0.8));
        const run = () => {
            const labels = extractAiStudioOutlineLabels(container);
            const before = aiStudioOutlineCache.length;
            mergeAiStudioOutlineCache(labels);
            if (aiStudioOutlineCache.length === before) idleCount += 1;
            else idleCount = 0;
            const nearEnd = container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
            if (nearEnd || idleCount >= 3) {
                container.scrollTop = 0;
                aiStudioOutlineCollecting = false;
                return;
            }
            container.scrollTop = Math.min(container.scrollTop + step, container.scrollHeight);
            setTimeout(run, 200);
        };
        run();
    }

    function getLmarenaBlocks() {
        const list = Array.from(document.querySelectorAll('ol')).find(el => {
            const cls = (el.className || '').toString();
            return cls.includes('flex-col-reverse') && cls.includes('max-w-screen-xl');
        });
        const scope = list || document;
        const blocks = Array.from(scope.querySelectorAll('div')).filter(el => {
            const cls = (el.className || '').toString();
            return cls.includes('self-end') && cls.includes('group') && cls.includes('flex-col');
        });
        if (blocks.length > 0) {
            if (list) return blocks.slice().reverse();
            return blocks;
        }
        return queryAll(lmarenaSelectors);
    }

    function getNavBlocks() {
        if (currentSite === SITE_CONFIG.lmarena) {
            return getLmarenaBlocks();
        }
        if (currentSite === SITE_CONFIG.aistudio) {
            // 1. Priority: Chat questions (Current Session)
            // If we are in a chat session, we want to show the questions of THIS session,
            // NOT the global history list.
            const isChatSession = !!document.querySelector('ms-chat-session');
            
            if (isChatSession) {
                const chatBlocks = getAiStudioChatBlocks();
                if (chatBlocks.length > 0) return chatBlocks;
                
                // If chat blocks are empty but we are in a session, try the deep query fallback
                // specifically for chat turns.
                // (The previous fallback logic was okay but getAiStudioChatBlocks should be better)
            } else {
                // 2. If NOT in a chat session (e.g. Home), show history.
                const promptLinkBlocks = getAiStudioPromptLinkBlocks();
                if (promptLinkBlocks.length > 0) return promptLinkBlocks;
            }

            // 3. Fallback: If we are in a session but getAiStudioChatBlocks failed, 
            // try the old queryAllDeep method as a last resort for turns.
             let turns = queryAllDeep('.chat-turn-container.render.user, .chat-turn-container.user');
            if (turns.length === 0) {
                turns = queryAllDeep('[class*="chat-turn-container"][class*="user"]');
            }
            if (turns.length === 0) {
                turns = queryAllDeep('.virtual-scroll-container.user-prompt-container, [class*="user-prompt-container"]');
            }
            if (turns.length === 0) {
                turns = queryAllDeep('[data-turn-role="user"], [data-turnrole="user"], [turnrole="user"], [data-message-author-role="user"], [data-role="user"], [data-author="user"]');
            }

            const blocks = [];
            const seenBlocks = new Set();
            turns.forEach(t => {
                const chunk = t.querySelector('.cmark-node.user-chunk') ||
                              t.querySelector('ms-prompt-chunk') ||
                              t.querySelector('.turn-content') ||
                              t.querySelector('[class*="user-chunk"]') ||
                              t.querySelector('[data-message-author-role="user"]') ||
                              t.querySelector('p') ||
                              t;
                // If t is the container and we found a chunk, use the chunk's text?
                // Actually the loop below in refreshNav uses innerText.
                if (chunk && !seenBlocks.has(chunk)) {
                    seenBlocks.add(chunk);
                    blocks.push(chunk);
                }
            });
            
            if (blocks.length > 0) return blocks;
            
            // 4. If all else fails, AND we are NOT in a chat session (or desperate), show history
            // But if isChatSession is true, we already skipped history.
            // If we are here, it means we found NOTHING in the chat.
            // Maybe it's better to show history than nothing?
            // The user said "Directory is empty" is a problem.
            // But they also said "Shows history" is a problem.
            // Let's stick to: In chat -> Questions only. Home -> History.
            
            if (!isChatSession) {
                 return Array.from(document.querySelectorAll(SITE_CONFIG.aistudio.querySelector));
            }
            return [];
        }
        return Array.from(document.querySelectorAll(currentSite.querySelector));
    }

    // 刷新目录 (目录是当前页面特有的，不需要跨域同步)
    let lastCount = -1;
    function refreshNav() {
        if (!panelNav.classList.contains('active')) return;

        const blocks = getNavBlocks();

        if (blocks.length === lastCount && blocks.length > 0) return;
        lastCount = blocks.length;

        panelNav.replaceChildren();

        blocks.forEach((block, index) => {
            let content = normalizeText(block.__aiPanelLabel || block.innerText || block.textContent);
            if (currentSite === SITE_CONFIG.aistudio) {
                content = content.replace(/^User\s*/i, '').replace(/^edit\s*more_vert\s*/i, '').trim();
            }
            if (!content) return;

            const item = document.createElement('div');
            item.className = 'gemini-nav-item';
            const txt = document.createElement('span');
            txt.className = 'item-text';
            txt.textContent = `${index + 1}. ${content}`;

            item.onclick = (e) => {
                e.stopPropagation();
                const currentBlocks = getNavBlocks();
                let targetBlock = currentBlocks[index];
                if (currentSite === SITE_CONFIG.aistudio && targetBlock && targetBlock.__aiPanelTarget) {
                    try { targetBlock.__aiPanelTarget.click(); } catch (e) {}
                    targetBlock = targetBlock.__aiPanelTarget;
                }
                if (currentSite === SITE_CONFIG.aistudio && targetBlock) {
                    const parentTurn = targetBlock.closest('.chat-turn-container');
                    if (parentTurn) targetBlock = parentTurn;
                }

                if (targetBlock) {
                    targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetBlock.classList.remove('highlight-pulse');
                    void targetBlock.offsetWidth;
                    targetBlock.classList.add('highlight-pulse');
                }
            };

            const favBtn = document.createElement('span');
            favBtn.className = 'action-btn';
            favBtn.textContent = '⭐';
            favBtn.onclick = (e) => {
                e.stopPropagation();
                favorites = GM_getValue('ai_global_favorites', []); // 保存前先同步
                if (!favorites.includes(content)) {
                    favorites.unshift(content); saveFavorites(); favBtn.textContent = '✅';
                    setTimeout(() => favBtn.textContent = '⭐', 1000);
                }
            };
            item.append(txt, favBtn);
            panelNav.append(item);
        });
        if (searchInput.value) searchInput.dispatchEvent(new Event('input'));
    }

    // --- 4. 交互逻辑 (拖拽与吸附) ---
    function applyMagneticSnapping() {
        const threshold = 60;
        const rect = sidebar.getBoundingClientRect();
        const winW = window.innerWidth;
        sidebar.classList.remove('snapped-left', 'snapped-right');
        if (rect.left < threshold) {
            sidebar.style.left = '0px'; sidebar.classList.add('snapped-left');
        } else if (winW - rect.right < threshold) {
            sidebar.style.left = (winW - sidebar.offsetWidth) + 'px'; sidebar.classList.add('snapped-right');
        }
        if (!sidebar.classList.contains('collapsed')) {
            // 位置信息保存在本地，保证不同网站互不干扰
            localStorage.setItem('gemini-nav-config', JSON.stringify({
                left: sidebar.style.left, top: sidebar.style.top,
                width: sidebar.style.width, height: sidebar.style.height
            }));
        }
    }

    sidebar.addEventListener('mouseenter', () => { if (isAutoHideEnabled) { clearTimeout(autoHideTimer); sidebar.classList.remove('collapsed'); } });
    sidebar.addEventListener('mouseleave', () => {
        if (isAutoHideEnabled && !isDragging && !activeResizer) {
            autoHideTimer = setTimeout(() => { sidebar.classList.add('collapsed'); applyMagneticSnapping(); }, 600);
        }
    });

    let isDragging = false, activeResizer = null, rafId = null;
    let startX, startY, initialLeft, initialTop, initialWidth, initialHeight;

    sidebar.addEventListener('mousedown', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.classList.contains('action-btn') || target.id === 'gemini-nav-lock') return;
        startX = e.clientX; startY = e.clientY;
        initialLeft = sidebar.offsetLeft; initialTop = sidebar.offsetTop;
        initialWidth = sidebar.offsetWidth; initialHeight = sidebar.offsetHeight;
        if (target.classList.contains('resizer')) {
            activeResizer = target.dataset.pos; sidebar.classList.add('no-transition'); e.preventDefault();
        } else if (target.closest('#gemini-nav-header') || sidebar.classList.contains('collapsed')) {
            isDragging = true; sidebar.classList.add('no-transition'); e.preventDefault();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging && !activeResizer) return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if (isDragging) { sidebar.style.left = (initialLeft + dx) + 'px'; sidebar.style.top = (initialTop + dy) + 'px'; }
            else if (activeResizer) {
                let newW = initialWidth, newH = initialHeight, newL = initialLeft, newT = initialTop;
                const minSize = 150;
                if (activeResizer.includes('r')) newW = Math.max(minSize, initialWidth + dx);
                if (activeResizer.includes('b')) newH = Math.max(minSize, initialHeight + dy);
                if (activeResizer.includes('l')) { newW = Math.max(minSize, initialWidth - dx); if (newW > minSize) newL = initialLeft + dx; }
                if (activeResizer.includes('t')) { newH = Math.max(minSize, initialHeight - dy); if (newH > minSize) newT = initialTop + dy; }
                sidebar.style.width = newW + 'px'; sidebar.style.height = newH + 'px';
                sidebar.style.left = newL + 'px'; sidebar.style.top = newT + 'px';
            }
        });
    });

    window.addEventListener('mouseup', () => {
        if (isDragging || activeResizer) { sidebar.classList.remove('no-transition'); if (isDragging) applyMagneticSnapping(); isDragging = false; activeResizer = null; }
    });

    // --- 5. 初始化 ---
    [tabNav, tabFav].forEach(tab => {
        tab.onclick = (e) => {
            e.stopPropagation();
            searchInput.value = '';
            [tabNav, tabFav].forEach(t => t.classList.remove('active')); tab.classList.add('active');
            [panelNav, panelFav].forEach(p => p.classList.remove('active'));
            document.getElementById(tab.dataset.target).classList.add('active');
            tab.dataset.target === 'panel-fav' ? renderFavorites() : refreshNav();
        };
    });

    const saved = JSON.parse(localStorage.getItem('gemini-nav-config')) || {};
    sidebar.style.left = saved.left || 'auto'; if (!saved.left) sidebar.style.right = '24px';
    sidebar.style.top = saved.top || '20%'; sidebar.style.width = saved.width || '240px'; sidebar.style.height = saved.height || '400px';

    const observer = new MutationObserver(() => {
        clearTimeout(window.geminiRefreshTimer);
        window.geminiRefreshTimer = setTimeout(() => { refreshNav(); }, 800);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(applyMagneticSnapping, 500); setTimeout(refreshNav, 1500);
})();
