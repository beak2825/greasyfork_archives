// ==UserScript==
// @name         Doro表情包面板 一键爆炸
// @namespace    https://deepflood.com/
// @version      25.0
// @description  可自定义添加/删除表情,支持多套表情包切换,支持收藏功能,点击表情包直接插入到光标位置,带磨砂质感浮动面板与开关 + 插入提示
// @author       Sparkle
// @license      MIT
// @match        *://www.deepflood.com/*
// @match        *://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.nodeimage.com
// @connect      cdn.jsdelivr.net
// @connect      api.github.com
// @connect      wsrv.nl
// @connect      *
// @icon         https://img.meituan.net/video/1f498ca05808be0e7a8a837d4e51e995233496.png
// @downloadURL https://update.greasyfork.org/scripts/551957/Doro%E8%A1%A8%E6%83%85%E5%8C%85%E9%9D%A2%E6%9D%BF%20%E4%B8%80%E9%94%AE%E7%88%86%E7%82%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/551957/Doro%E8%A1%A8%E6%83%85%E5%8C%85%E9%9D%A2%E6%9D%BF%20%E4%B8%80%E9%94%AE%E7%88%86%E7%82%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 表情包套装配置 - 可扩展添加更多套装
    const EMOJI_SETS = [
        {
            name: "Doro",
            baseUrl: "https://cdn.jsdelivr.net/gh/1143520/doro@main/loop/",
            apiUrl: "https://api.github.com/repos/1143520/doro/contents/loop"
        },
        {
            name: "猫猫刨爪爪",
            baseUrl: "https://cdn.jsdelivr.net/gh/1143520/paoshoushou@main/%E7%8C%AB%E7%8C%AB%E5%88%A8%E7%88%AA%E7%88%AA/",
            apiUrl: "https://api.github.com/repos/1143520/paoshoushou/contents/%E7%8C%AB%E7%8C%AB%E5%88%A8%E7%88%AA%E7%88%AA"
        }
    ];
    
    // 当前选中的表情包套装索引
    let currentEmojiSetIndex = parseInt(localStorage.getItem('hanabi_emoji_set_index')) || 0;
    if (currentEmojiSetIndex >= EMOJI_SETS.length) {
        currentEmojiSetIndex = 0;
    }
    
    // 图片处理配置
    const IMAGE_PROXY_URL = "https://wsrv.nl/?url="; // 图片处理服务（用于尺寸调整）
    const PROXY_STORAGE_KEY = 'hanabi_use_image_proxy';
    const SIZE_STORAGE_KEY = 'hanabi_image_size';
    const API_KEY_STORAGE_KEY = 'hanabi_image_api_key';
    
    // 从本地存储读取图片处理开关状态和尺寸设置
    let USE_IMAGE_PROXY = localStorage.getItem(PROXY_STORAGE_KEY) !== 'false'; // 默认开启
    let TARGET_SIZE = localStorage.getItem(SIZE_STORAGE_KEY) || "110"; // 默认110px
    let IMAGE_API_KEY = localStorage.getItem(API_KEY_STORAGE_KEY) || ""; // 图床 API Key
    
    // 图床 API 配置
    const IMAGE_API_URL = "https://api.nodeimage.com/api/upload";
    const IMAGE_API_BASE = "https://api.nodeimage.com/api/v1";
    
    // 默认表情列表 - 将在异步加载后填充
    let defaultEmojiList = [];
    let allGifFiles = []; // 存储所有GIF文件名
    let isLoading = false; // 默认不加载，切换到表情包时再加载
    let hasLoadedGifs = false; // 是否已经加载过 GIF 列表
    
    // 从GitHub API获取所有GIF文件列表
    async function fetchAllGifFiles() {
        try {
            const currentSet = EMOJI_SETS[currentEmojiSetIndex];
            console.log(`🔄 开始从GitHub获取表情包列表: ${currentSet.name}...`);
            isLoading = true;
            
            const response = await fetch(currentSet.apiUrl);
            const files = await response.json();
            
            // 筛选出所有.gif文件
            allGifFiles = files
                .filter(file => file.name.endsWith('.gif') && file.type === 'file')
                .map(file => file.name);
            
            console.log(`✅ 成功加载 ${currentSet.name} 套装: ${allGifFiles.length} 个表情包`);
            
            // 随机选择20个
            defaultEmojiList = getRandomEmojis(20);
            isLoading = false;
            hasLoadedGifs = true; // 标记已加载
            
            // 渲染表情
            renderEmojis();
        } catch (error) {
            console.error("❌ 获取表情包列表失败:", error);
            // 如果API失败，使用备用列表
            allGifFiles = [
                "1735348712826.gif", "1735348724291.gif", "1735348726658.gif", "1735348736520.gif",
                "1735348738391.gif", "1735348747247.gif", "1735348751230.gif", "1735348761071.gif",
                "1735348763774.gif", "1735348770585.gif", "2314666038.gif", "2314666040.gif",
                "2314666044.gif", "2422329068.gif", "2422329071.gif", "2422329072.gif",
                "2437195856.gif", "2437195898.gif", "2437195910.gif", "2437195912.gif"
            ];
            defaultEmojiList = getRandomEmojis(20);
            isLoading = false;
            hasLoadedGifs = true; // 即使失败也标记已加载（避免重复请求）
            renderEmojis();
        }
    }
    
    // 随机选择表情包
    function getRandomEmojis(count = 20) {
        if (allGifFiles.length === 0) return [];
        const shuffled = [...allGifFiles].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, allGifFiles.length));
        const currentSet = EMOJI_SETS[currentEmojiSetIndex];
        return selected.map(filename => currentSet.baseUrl + filename);
    }
    
    // 刷新表情包列表（重新随机选择）
    function refreshEmojis() {
        if (allGifFiles.length === 0) {
            showToast("❌ 表情包列表为空，无法刷新");
            console.error("allGifFiles is empty");
            return;
        }
        
        console.log(`🔄 刷新前: ${defaultEmojiList.length} 个表情`);
        console.log(`📦 表情池总数: ${allGifFiles.length} 个`);
        
        defaultEmojiList = getRandomEmojis(20);
        
        console.log(`✅ 刷新后: ${defaultEmojiList.length} 个表情`);
        console.log(`🎲 随机表情:`, defaultEmojiList.slice(0, 3).map(url => url.split('/').pop()));
        
        renderEmojis();
        showToast(`🔄 已刷新！(共${allGifFiles.length}个表情池)`);
    }
    
    // 切换表情包套装
    async function switchEmojiSet(index) {
        if (index === currentEmojiSetIndex && !isFavoriteView && !isSettingsView) return;
        
        isFavoriteView = false; // 退出收藏视图
        isSettingsView = false; // 退出设置视图
        
        // 如果是首次切换到表情包，先加载数据
        if (!hasLoadedGifs) {
            showToast(`🔄 首次加载表情包...`);
            currentEmojiSetIndex = index;
            localStorage.setItem('hanabi_emoji_set_index', index);
            await fetchAllGifFiles();
            renderEmojis();
            updateTabStyles();
            return;
        }
        
        // 如果切换的是同一个套装，直接返回
        if (index === currentEmojiSetIndex) {
            renderEmojis();
            updateTabStyles();
            return;
        }
        
        currentEmojiSetIndex = index;
        localStorage.setItem('hanabi_emoji_set_index', index);
        
        const currentSet = EMOJI_SETS[index];
        showToast(`🔄 正在切换到 ${currentSet.name}...`);
        
        // 重置状态
        allGifFiles = [];
        defaultEmojiList = [];
        isLoading = true;
        
        // 重新加载表情包
        await fetchAllGifFiles();
        renderEmojis();
        
        // 更新标签样式
        updateTabStyles();
        
        showToast(`✅ 已切换到 ${currentSet.name}！`);
    }
    
    // 切换到收藏视图
    function switchToFavoriteView() {
        if (isFavoriteView) return;
        
        isFavoriteView = true;
        isSettingsView = false;
        showToast("⭐ 正在显示收藏的表情...");
        renderEmojis();
        updateTabStyles();
        
        if (favoriteEmojiList.length === 0) {
            showToast("💡 还没有收藏任何表情哦");
        }
    }
    
    // 切换到设置视图
    function switchToSettingsView() {
        if (isSettingsView) return;
        
        isSettingsView = true;
        isFavoriteView = false;
        renderEmojis();
        updateTabStyles();
    }
    
    // 更新标签样式
    function updateTabStyles() {
        document.querySelectorAll('.emoji-set-tab').forEach(tab => {
            const isFavTab = tab.dataset.favorite === "true";
            const isSetTab = tab.dataset.settings === "true";
            const tabIndex = parseInt(tab.dataset.index);
            
            if (isFavTab) {
                // 收藏标签
                tab.style.background = isFavoriteView ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.15)";
                tab.style.color = isFavoriteView ? "#ffd700" : "rgba(255,255,255,0.7)";
            } else if (isSetTab) {
                // 设置标签
                tab.style.background = isSettingsView ? "rgba(52, 152, 219, 0.3)" : "rgba(255,255,255,0.15)";
                tab.style.color = isSettingsView ? "#3498db" : "rgba(255,255,255,0.7)";
            } else {
                // 套装标签
                const isActive = !isFavoriteView && !isSettingsView && tabIndex === currentEmojiSetIndex;
                tab.style.background = isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)";
                tab.style.color = isActive ? "#fff" : "rgba(255,255,255,0.7)";
            }
        });
    }

    // --- 新增功能：全局变量 ---
    const STORAGE_KEY = 'hanabi_custom_emojis';
    const FAVORITE_STORAGE_KEY = 'hanabi_favorite_emojis';
    let isDeleteMode = false;
    let customEmojiList = [];
    let favoriteEmojiList = [];
    let isFavoriteView = false; // 是否在收藏视图
    let isSettingsView = false; // 是否在设置视图

    // --- 新增功能：本地存储操作 ---
    function loadCustomEmojis() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("加载自定义表情失败", e);
            return [];
        }
    }

    function saveCustomEmojis(emojis) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(emojis));
        } catch (e) {
            console.error("保存自定义表情失败", e);
        }
    }

    // --- 收藏功能：本地存储操作 ---
    function loadFavoriteEmojis() {
        try {
            const stored = localStorage.getItem(FAVORITE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("加载收藏表情失败", e);
            return [];
        }
    }

    function saveFavoriteEmojis(emojis) {
        try {
            localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(emojis));
        } catch (e) {
            console.error("保存收藏表情失败", e);
        }
    }

    function toggleFavorite(url) {
        const index = favoriteEmojiList.indexOf(url);
        if (index > -1) {
            // 已收藏，取消收藏
            favoriteEmojiList.splice(index, 1);
            showToast("💔 已取消收藏");
        } else {
            // 未收藏，添加收藏
            favoriteEmojiList.push(url);
            showToast("⭐ 已添加到收藏");
        }
        saveFavoriteEmojis(favoriteEmojiList);
        updateFavoriteTabText();
        renderEmojis();
    }

    function isFavorite(url) {
        return favoriteEmojiList.includes(url);
    }


    function findInputElement() {
        // 1. 检查是否有 CodeMirror 编辑器获得焦点
        const codeMirrorElement = document.querySelector('.CodeMirror-focused');
        if (codeMirrorElement && codeMirrorElement.CodeMirror) {
            return { 
                type: 'codemirror', 
                instance: codeMirrorElement.CodeMirror 
            };
        }
        
        // 2. 检查所有可见的 CodeMirror 编辑器
        const codeMirrors = document.querySelectorAll('.CodeMirror');
        for (const cm of codeMirrors) {
            if (cm.CodeMirror && cm.offsetWidth > 0 && cm.offsetHeight > 0) {
                // 检查是否在视口内且不是标题输入框的 CodeMirror
                const rect = cm.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    return { 
                        type: 'codemirror', 
                        instance: cm.CodeMirror 
                    };
                }
            }
        }
        
        // 3. 优先使用当前焦点元素 (排除标题输入框)
        const focused = document.activeElement;
        if (focused && (focused.tagName === 'TEXTAREA' || (focused.tagName === 'INPUT' && focused.type === 'text'))) {
            if (!focused.disabled && !focused.readOnly && focused.id !== 'mde-title') {
                return { type: 'textarea', element: focused };
            }
        }
        
        // 4. 按选择器查找 (排除标题)
        const selectors = [
            'textarea[name="message"]', 'textarea[placeholder*="输入"]', 'textarea[placeholder*="回复"]', 'textarea[placeholder*="说点什么"]',
            'input[type="text"][name="message"]', 'input[type="text"][placeholder*="输入"]',
            '.editor-input textarea', '.message-input textarea', '.chat-input textarea', '.reply-box textarea', '.comment-box textarea',
            'textarea.form-control'
        ];
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && !el.disabled && !el.readOnly && el.offsetWidth > 0 && el.offsetHeight > 0 && el.id !== 'mde-title') {
                return { type: 'textarea', element: el };
            }
        }
        return null;
    }

    function insertTextAtCursor(target, text) {
        if (!target) return false;
        
        // 处理 CodeMirror 编辑器
        if (target.type === 'codemirror') {
            const cm = target.instance;
            const doc = cm.getDoc();
            
            // 先聚焦编辑器（这会保持光标位置）
            if (!cm.hasFocus()) {
                cm.focus();
            }
            
            // 获取当前光标位置
            let cursor = doc.getCursor();
            
            // 在光标位置插入文本
            doc.replaceRange(text, cursor);
            
            // 移动光标到插入文本后
            const lines = text.split('\n');
            const newPos = lines.length > 1 
                ? { line: cursor.line + lines.length - 1, ch: lines[lines.length - 1].length }
                : { line: cursor.line, ch: cursor.ch + text.length };
            doc.setCursor(newPos);
            
            return true;
        }
        
        // 处理普通 textarea/input
        const el = target.element;
        if (!el) return false;
        
        // 先保存当前光标位置
        let startPos = el.selectionStart;
        let endPos = el.selectionEnd;
        
        // 如果光标位置无效或为null,插入到末尾
        if (startPos === null || startPos === undefined || 
            (startPos === 0 && endPos === 0 && el.value.length > 0 && document.activeElement !== el)) {
            startPos = el.value.length;
            endPos = el.value.length;
        }
        
        // 如果元素没有焦点,先聚焦
        if (document.activeElement !== el) {
            el.focus();
            // 设置光标到插入位置
            el.setSelectionRange(startPos, endPos);
        }
        
        // 尝试使用 execCommand (最推荐,会触发输入事件)
        if (document.execCommand && document.execCommand('insertText', false, text)) {
            return true;
        }
        
        // 备用方案1: 使用 setRangeText
        if (el.setRangeText) {
            try {
                el.setRangeText(text, startPos, endPos, 'end');
                el.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            } catch (e) {
                console.warn('setRangeText failed:', e);
            }
        }
        
        // 备用方案2: 手动插入文本
        const before = el.value.substring(0, startPos);
        const after = el.value.substring(endPos);
        el.value = before + text + after;
        
        // 设置光标到插入文本之后
        const newPos = startPos + text.length;
        el.setSelectionRange(newPos, newPos);
        
        // 触发 input 事件
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        
        return true;
    }

    function showToast(msg) {
        // SVG 图标映射
        const svgIconMap = {
            '✅': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
            '❌': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
            '⭐': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
            '🔄': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
            '📤': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>',
            '🗑️': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
            '💔': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
            '🖼️': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
            '💡': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>',
            '⏳': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/></svg>',
            '⚠️': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
            '😅': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>',
            '✨': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 11H1v2h6v-2zm2.17-3.24L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41zM13 1h-2v6h2V1zm5.36 6.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM17 11v2h6v-2h-6zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zm-9.19.71l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12zM11 23h2v-6h-2v6z"/></svg>'
        };
        
        // 提取消息中的第一个 emoji
        const emojiMatch = msg.match(/^(✅|❌|⭐|🔄|📤|🗑️|💔|🖼️|💡|⏳|⚠️|😅|✨)/);
        const emoji = emojiMatch ? emojiMatch[1] : null;
        const svgIcon = emoji ? svgIconMap[emoji] : null;
        const textContent = emoji ? msg.substring(emoji.length).trim() : msg;
        
        const toast = document.createElement("div");
        
        if (svgIcon) {
            toast.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex-shrink:0;">${svgIcon}</div>
                    <div>${textContent}</div>
                </div>
            `;
        } else {
            toast.textContent = msg;
        }
        
        Object.assign(toast.style, {
            position: "fixed", 
            bottom: "20px",  // 改为底部 20px，不会遮挡面板
            right: "20px", 
            padding: "12px 18px", 
            borderRadius: "12px",
            background: "rgba(0, 0, 0, 0.75)", 
            backdropFilter: "blur(16px) saturate(180%)", 
            color: "#fff",
            fontWeight: "500", 
            fontSize: "14px", 
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)", 
            zIndex: "100001",  // 确保在面板之上
            opacity: "0", 
            transition: "opacity 0.3s ease, transform 0.3s ease", 
            transform: "translateY(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            maxWidth: "320px"
        });
        
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 2000);  // 延长显示时间到2秒
    }

    // === 悬浮按钮 ===
    const toggleBtn = document.createElement("img");
    toggleBtn.src = "https://img.meituan.net/video/1f498ca05808be0e7a8a837d4e51e995233496.png";
    Object.assign(toggleBtn.style, {
        position: "fixed", right: "15px", bottom: "15px", width: "60px", height: "60px", borderRadius: "50%",
        cursor: "pointer", zIndex: "99998", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(10px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 18px rgba(0,0,0,0.25)", transition: "transform 0.25s ease, box-shadow 0.25s ease"
    });
    toggleBtn.addEventListener("mouseenter", () => { toggleBtn.style.transform = "scale(1.1)"; toggleBtn.style.boxShadow = "0 6px 20px rgba(0,0,0,0.35)"; });
    toggleBtn.addEventListener("mouseleave", () => { toggleBtn.style.transform = "scale(1)"; toggleBtn.style.boxShadow = "0 4px 18px rgba(0,0,0,0.25)"; });
    document.body.appendChild(toggleBtn);

    // === 主面板 ===
    const panel = document.createElement("div");
    panel.id = "emoji-panel";
    Object.assign(panel.style, {
        position: "fixed", right: "80px", bottom: "80px", width: "400px", height: "auto", maxHeight: "60vh", display: "flex", flexDirection: "column",
        background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "16px",
        backdropFilter: "blur(13px) saturate(180%)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: "99999",
        padding: "10px", color: "#222", display: "none", transition: "opacity 0.3s ease, transform 0.3s ease", transform: "translateY(10px)",
    });

    const style = document.createElement("style");
    style.textContent = `
      #emoji-panel * { box-sizing: border-box; }
      #emoji-panel-grid::-webkit-scrollbar { width: 6px; }
      #emoji-panel-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 3px; }
      #emoji-panel-grid::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.6); }
      .emoji-item img:hover { transform: scale(1.08); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
      /* 删除模式样式 - 收藏视图和自定义表情可删除 */
      #emoji-panel.delete-mode.favorite-view .emoji-item > img { border: 2px dashed #ff4757; opacity: 0.8; cursor: pointer; }
      #emoji-panel.delete-mode.favorite-view .emoji-item:hover > img { opacity: 1; box-shadow: 0 0 10px #ff4757; }
      #emoji-panel.delete-mode:not(.favorite-view) .emoji-item[data-is-custom="true"] > img { border: 2px dashed #ff4757; opacity: 0.8; cursor: pointer; }
      #emoji-panel.delete-mode:not(.favorite-view) .emoji-item[data-is-custom="true"]:hover > img { opacity: 1; box-shadow: 0 0 10px #ff4757; }
      #emoji-panel.delete-mode:not(.favorite-view) .emoji-item:not([data-is-custom="true"]) { filter: grayscale(80%); opacity: 0.5; pointer-events: none; }
      .control-button { 
        background: rgba(255,255,255,0.3); 
        border: none; 
        padding: 6px 10px; 
        font-size: 12px; 
        border-radius: 8px; 
        color: white; 
        cursor: pointer; 
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
      }
      .control-button:hover { 
        background: rgba(255,255,255,0.5); 
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .control-button svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
      }
      /* 设置面板样式 */
      .settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 420px;
        max-height: 80vh;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        backdrop-filter: blur(20px) saturate(180%);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        z-index: 100000;
        padding: 20px;
        color: white;
        overflow-y: auto;
      }
      .settings-panel::-webkit-scrollbar { width: 6px; }
      .settings-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 3px; }
      .settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        z-index: 99999;
      }
      .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      .settings-title {
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .settings-close {
        cursor: pointer;
        font-size: 24px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      .settings-close:hover { opacity: 1; }
      .settings-section {
        margin-bottom: 20px;
      }
      .settings-section-title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .settings-item {
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
      }
      .settings-item-label {
        font-size: 13px;
        margin-bottom: 8px;
        color: rgba(255,255,255,0.8);
      }
      .settings-input {
        width: 100%;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(0,0,0,0.3);
        color: white;
        font-size: 13px;
      }
      .settings-input:focus {
        outline: none;
        border-color: rgba(52, 152, 219, 0.8);
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
      .settings-button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .settings-button svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
      .settings-button-primary {
        background: rgba(52, 152, 219, 0.8);
        color: white;
      }
      .settings-button-primary:hover {
        background: rgba(52, 152, 219, 1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
      }
      .settings-button-danger {
        background: rgba(255, 71, 87, 0.6);
        color: white;
      }
      .settings-button-danger:hover {
        background: rgba(255, 71, 87, 0.8);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
      }
      .settings-button-success {
        background: rgba(46, 213, 115, 0.6);
        color: white;
      }
      .settings-button-success:hover {
        background: rgba(46, 213, 115, 0.8);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(46, 213, 115, 0.4);
      }
      .settings-hint {
        font-size: 11px;
        color: rgba(255,255,255,0.5);
        margin-top: 6px;
      }
      .settings-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
      }
      .settings-stat-item {
        background: rgba(255,255,255,0.05);
        border-radius: 6px;
        padding: 10px;
        text-align: center;
      }
      .settings-stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #ffd700;
      }
      .settings-stat-label {
        font-size: 11px;
        color: rgba(255,255,255,0.6);
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style);

    const header = document.createElement("div");
    Object.assign(header.style, { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#fff", fontWeight: "600", textShadow: "0 1px 3px rgba(0,0,0,0.4)", cursor: "move", flexShrink: "0" });
    header.innerHTML = `<span>🌸 Doro表情包面板</span><span style="cursor:pointer;font-size:16px;">✖</span>`;
    header.querySelector("span:last-child").onclick = () => { panel.style.display = "none"; };
    panel.appendChild(header);

    // --- 表情包套装切换标签 ---
    const tabsContainer = document.createElement("div");
    Object.assign(tabsContainer.style, {
        display: "flex",
        gap: "6px",
        marginBottom: "8px",
        flexShrink: "0",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        paddingBottom: "6px"
    });
    
    EMOJI_SETS.forEach((emojiSet, index) => {
        const tab = document.createElement("button");
        tab.textContent = emojiSet.name;
        tab.className = "emoji-set-tab";
        tab.dataset.index = index;
        Object.assign(tab.style, {
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            background: index === currentEmojiSetIndex && !isFavoriteView && !isSettingsView ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
            color: index === currentEmojiSetIndex && !isFavoriteView && !isSettingsView ? "#fff" : "rgba(255,255,255,0.7)"
        });
        
        tab.onclick = () => switchEmojiSet(index);
        tabsContainer.appendChild(tab);
    });
    
    // 添加设置标签
    const settingsTab = document.createElement("button");
    settingsTab.innerHTML = '⚙️ 设置';
    settingsTab.className = "emoji-set-tab settings-tab";
    settingsTab.dataset.settings = "true";
    Object.assign(settingsTab.style, {
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        background: isSettingsView ? "rgba(52, 152, 219, 0.3)" : "rgba(255,255,255,0.15)",
        color: isSettingsView ? "#3498db" : "rgba(255,255,255,0.7)",
        marginLeft: "auto" // 推到右边
    });
    
    settingsTab.onclick = () => switchToSettingsView();
    tabsContainer.appendChild(settingsTab);
    
    // 添加收藏标签
    const favoriteTab = document.createElement("button");
    favoriteTab.textContent = "⭐ 收藏";
    favoriteTab.className = "emoji-set-tab favorite-tab";
    favoriteTab.dataset.favorite = "true";
    Object.assign(favoriteTab.style, {
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        background: isFavoriteView ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.15)",
        color: isFavoriteView ? "#ffd700" : "rgba(255,255,255,0.7)"
    });
    
    favoriteTab.onclick = () => switchToFavoriteView();
    tabsContainer.appendChild(favoriteTab);
    
    panel.appendChild(tabsContainer);

    const grid = document.createElement("div");
    grid.id = "emoji-panel-grid";
    Object.assign(grid.style, { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", overflowY: "auto", flexGrow: "1" });
    panel.appendChild(grid);

    // --- 新增功能：控制区 ---
    const controls = document.createElement("div");
    controls.style.marginTop = "8px";
    controls.style.flexShrink = "0";
    
    // 输入框容器（包含输入框和上传按钮）
    const inputContainer = document.createElement("div");
    Object.assign(inputContainer.style, { display: "flex", gap: "6px", marginBottom: "6px" });
    
    const urlInput = document.createElement("input");
    Object.assign(urlInput.style, { flex: "1", padding: "6px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0, 0, 0, 0.3)", color: "#fff" });
    urlInput.placeholder = "粘贴图片链接或选择上传...";
    
    // 上传/转换按钮
    const uploadButton = document.createElement("button");
    uploadButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg><span>上传</span>';
    uploadButton.className = "control-button";
    uploadButton.title = "上传图片到图床或转换链接";
    Object.assign(uploadButton.style, { flexShrink: "0" });
    
    // 隐藏的文件选择器
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    
    inputContainer.appendChild(urlInput);
    inputContainer.appendChild(uploadButton);
    inputContainer.appendChild(fileInput);
    
    const buttonContainer = document.createElement("div");
    Object.assign(buttonContainer.style, { display: "flex", justifyContent: "space-between", gap: "6px", flexWrap: "wrap" });
    
    // SVG 图标定义
    const svgIcons = {
        add: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
        delete: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
        refresh: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
        image: '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
        check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    };
    
    const addButton = document.createElement("button");
    addButton.innerHTML = svgIcons.add + '<span>添加</span>';
    addButton.className = "control-button";
    addButton.title = "添加图片链接到收藏";
    
    const deleteModeButton = document.createElement("button");
    deleteModeButton.innerHTML = svgIcons.delete + '<span>删除</span>';
    deleteModeButton.className = "control-button";
    deleteModeButton.title = "批量删除模式";
    
    const refreshButton = document.createElement("button");
    refreshButton.innerHTML = svgIcons.refresh + '<span>换一批</span>';
    refreshButton.className = "control-button";
    refreshButton.title = "随机更换20个表情包";
    
    const proxyToggleButton = document.createElement("button");
    proxyToggleButton.innerHTML = svgIcons.image + '<span>' + (USE_IMAGE_PROXY ? '处理' : '原图') + '</span>';
    proxyToggleButton.className = "control-button";
    proxyToggleButton.title = USE_IMAGE_PROXY ? "当前: 使用图片处理(110x110)\n点击切换为原图" : "当前: 使用原图\n点击切换为处理后图片";
    proxyToggleButton.style.background = USE_IMAGE_PROXY ? "rgba(52, 152, 219, 0.5)" : "rgba(255,255,255,0.3)";
    
    buttonContainer.append(addButton, deleteModeButton, refreshButton, proxyToggleButton);
    controls.append(inputContainer, buttonContainer);
    panel.appendChild(controls);

    document.body.appendChild(panel);

    // --- 核心功能重构：渲染所有表情 ---
    function renderEmojis() {
        grid.innerHTML = ''; // 清空
        
        // 根据当前视图添加/移除CSS类
        if (isFavoriteView) {
            panel.classList.add('favorite-view');
        } else {
            panel.classList.remove('favorite-view');
        }
        
        // 如果是设置视图，显示设置界面
        if (isSettingsView) {
            renderSettingsView();
            return;
        }
        
        // 创建表情项的通用函数
        const createEmojiItem = (url, isCustom, showInFavorite = false) => {
            const item = document.createElement("div");
            item.className = "emoji-item";
            Object.assign(item.style, { position: "relative", display: "inline-block" });
            if (isCustom) item.dataset.isCustom = "true";

            const img = document.createElement("img");
            img.src = url;
            img.loading = "lazy";
            Object.assign(img.style, { width: "110px", height: "110px", borderRadius: "10px", margin: "4px", objectFit: "cover", cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease" });

            // 添加收藏按钮
            const favoriteBtn = document.createElement("div");
            favoriteBtn.innerHTML = isFavorite(url) ? "⭐" : "☆";
            Object.assign(favoriteBtn.style, {
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                opacity: "0",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                zIndex: "10"
            });
            
            // 悬停显示收藏按钮
            item.addEventListener("mouseenter", () => {
                favoriteBtn.style.opacity = "1";
            });
            item.addEventListener("mouseleave", () => {
                favoriteBtn.style.opacity = "0";
            });
            
            // 收藏按钮点击事件
            favoriteBtn.onclick = (e) => {
                e.stopPropagation();
                toggleFavorite(url);
                favoriteBtn.innerHTML = isFavorite(url) ? "⭐" : "☆";
            };

            // 图片点击事件
            img.onclick = (e) => {
                // 阻止事件冒泡
                e.stopPropagation();
                
                // 删除模式逻辑 - 在收藏视图中可以删除收藏的表情（批量操作，无需确认）
                if (isDeleteMode) {
                    if (isFavoriteView) {
                        // 在收藏视图中，删除收藏的表情
                        favoriteEmojiList = favoriteEmojiList.filter(e => e !== url);
                        saveFavoriteEmojis(favoriteEmojiList);
                        updateFavoriteTabText();
                        renderEmojis();
                        showToast("🗑️ 已删除");
                    } else if (isCustom) {
                        // 在普通视图中，删除旧的自定义表情（兼容旧数据）
                        customEmojiList = customEmojiList.filter(e => e !== url);
                        saveCustomEmojis(customEmojiList);
                        renderEmojis();
                        showToast("🗑️ 已删除");
                    } else {
                        showToast("⚠️ 只能删除收藏的表情");
                    }
                    return;
                }
                
                // 发送模式逻辑 - 先找到输入框
                const input = findInputElement();
                if (!input) {
                    showToast("❌ 未找到输入框！请先点击输入框");
                    return;
                }
                
                // 构建最终URL
                let finalUrl = url;
                if (USE_IMAGE_PROXY) {
                    // wsrv.nl 参数: w=宽度, h=高度, fit=contain, n=-1(保持所有GIF帧)
                    finalUrl = `${IMAGE_PROXY_URL}${encodeURIComponent(url)}&w=${TARGET_SIZE}&h=${TARGET_SIZE}&fit=contain&n=-1`;
                }
                
                const markdown = ` ![emote](${finalUrl}) \n`;
                
                // 插入文本到光标位置
                if (insertTextAtCursor(input, markdown)) {
                    showToast("✨ 表情包已插入！");
                } else {
                    showToast("❌ 插入失败，请重试");
                }
            };
            
            item.appendChild(img);
            item.appendChild(favoriteBtn);
            grid.appendChild(item);
        };
        
        // 如果是收藏视图
        if (isFavoriteView) {
            if (favoriteEmojiList.length === 0) {
                grid.innerHTML = '<div style="width:100%;text-align:center;color:#fff;padding:40px 20px;"><div style="font-size:48px;margin-bottom:10px;">⭐</div><div style="font-size:14px;opacity:0.7;">还没有收藏任何表情</div><div style="font-size:12px;opacity:0.5;margin-top:8px;">在表情上悬停可以收藏哦</div></div>';
                return;
            }
            favoriteEmojiList.forEach(url => createEmojiItem(url, false, true));
            return;
        }

        // 普通视图：显示默认表情和自定义表情
        defaultEmojiList.forEach(url => createEmojiItem(url, false));
        customEmojiList.forEach(url => createEmojiItem(url, true));
    }


    // --- 图床上传功能 ---
    // 使用 GM_xmlhttpRequest 下载图片 (绕过CORS)
    function downloadImageAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`下载失败: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('下载图片失败'));
                },
                ontimeout: function() {
                    reject(new Error('下载超时'));
                }
            });
        });
    }
    
    // 上传图片到图床
    async function uploadImageToHost(imageSource) {
        if (!IMAGE_API_KEY) {
            showToast("❌ 请先在设置中配置图床 API Key");
            return null;
        }
        
        try {
            showToast("📤 正在上传图片...");
            
            let imageBlob;
            let fileName = 'image.jpg';
            
            if (typeof imageSource === 'string') {
                // URL转换模式：使用 GM_xmlhttpRequest 下载图片
                imageBlob = await downloadImageAsBlob(imageSource);
                // 尝试从URL提取文件名
                const urlParts = imageSource.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                if (lastPart && lastPart.includes('.')) {
                    fileName = lastPart.split('?')[0]; // 移除查询参数
                }
            } else {
                // 文件上传模式
                imageBlob = imageSource;
                fileName = imageSource.name;
            }
            
            // 使用 GM_xmlhttpRequest 上传图片 (绕过CORS)
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('image', imageBlob, fileName);
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: IMAGE_API_URL,
                    headers: {
                        'X-API-Key': IMAGE_API_KEY
                    },
                    data: formData,
                    onload: function(response) {
                        try {
                            console.log("📥 API响应状态:", response.status);
                            console.log("📥 API响应内容:", response.responseText);
                            
                            if (response.status === 200 || response.status === 201) {
                                const result = JSON.parse(response.responseText);
                                console.log("📥 解析后的结果:", result);
                                
                                // 尝试多种可能的URL字段 (NodeImage API 格式)
                                let imageUrl = result.links?.direct ||  // NodeImage API 格式
                                             result.links?.markdown?.match(/\((https?:\/\/[^)]+)\)/)?.[1] ||  // 从 markdown 提取
                                             result.url || 
                                             result.data?.url || 
                                             result.link || 
                                             result.image_url ||
                                             result.data?.link ||
                                             result.data?.image_url ||
                                             (result.data && typeof result.data === 'string' ? result.data : null);
                                
                                console.log("🔍 提取的图片URL:", imageUrl);
                                
                                if (imageUrl) {
                                    showToast("✅ 上传成功！");
                                    resolve(imageUrl);
                                } else {
                                    console.error("❌ 无法从以下结构中提取URL:", JSON.stringify(result, null, 2));
                                    throw new Error("无法获取图片URL，请检查控制台日志");
                                }
                            } else {
                                throw new Error(`上传失败: ${response.status} - ${response.responseText}`);
                            }
                        } catch (error) {
                            console.error("❌ 上传失败:", error);
                            console.error("❌ 原始响应:", response.responseText);
                            showToast("❌ 上传失败: " + error.message);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        console.error("❌ 上传失败:", error);
                        showToast("❌ 上传失败: 网络错误");
                        resolve(null);
                    },
                    ontimeout: function() {
                        showToast("❌ 上传超时");
                        resolve(null);
                    }
                });
            });
        } catch (error) {
            console.error("上传失败:", error);
            showToast("❌ 上传失败: " + error.message);
            return null;
        }
    }
    
    // 上传按钮点击事件
    uploadButton.onclick = async () => {
        const url = urlInput.value.trim();
        
        if (url && url.startsWith('http')) {
            // URL转换模式
            const uploadedUrl = await uploadImageToHost(url);
            if (uploadedUrl) {
                // 添加到收藏
                if (!favoriteEmojiList.includes(uploadedUrl)) {
                    favoriteEmojiList.push(uploadedUrl);
                    saveFavoriteEmojis(favoriteEmojiList);
                    updateFavoriteTabText();
                    
                    if (!isFavoriteView) {
                        isFavoriteView = true;
                        isSettingsView = false;
                        updateTabStyles();
                    }
                    
                    renderEmojis();
                    urlInput.value = '';
                    showToast("⭐ 已转换并添加到收藏！");
                    grid.scrollTop = grid.scrollHeight;
                } else {
                    showToast("😅 这个表情已经收藏过啦！");
                }
            }
        } else {
            // 文件上传模式
            fileInput.click();
        }
    };
    
    // 文件选择事件
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showToast("❌ 请选择图片文件！");
            return;
        }
        
        const uploadedUrl = await uploadImageToHost(file);
        if (uploadedUrl) {
            // 添加到收藏
            if (!favoriteEmojiList.includes(uploadedUrl)) {
                favoriteEmojiList.push(uploadedUrl);
                saveFavoriteEmojis(favoriteEmojiList);
                updateFavoriteTabText();
                
                if (!isFavoriteView) {
                    isFavoriteView = true;
                    isSettingsView = false;
                    updateTabStyles();
                }
                
                renderEmojis();
                showToast("⭐ 已上传并添加到收藏！");
                grid.scrollTop = grid.scrollHeight;
            } else {
                showToast("😅 这个表情已经收藏过啦！");
            }
        }
        
        // 清空文件选择
        fileInput.value = '';
    };
    
    // --- 新增功能：按钮事件监听 ---
    addButton.onclick = () => {
        const url = urlInput.value.trim();
        if (!url || !url.startsWith('http')) {
            showToast("❌ 请输入有效的图片链接！");
            return;
        }
        if (favoriteEmojiList.includes(url)) {
            showToast("😅 这个表情已经收藏过啦！");
            return;
        }
        
        // 直接添加到收藏列表
        favoriteEmojiList.push(url);
        saveFavoriteEmojis(favoriteEmojiList);
        updateFavoriteTabText();
        
        // 切换到收藏视图显示新添加的表情
        if (!isFavoriteView) {
            isFavoriteView = true;
            isSettingsView = false;
            updateTabStyles();
        }
        
        renderEmojis();
        urlInput.value = '';
        showToast("⭐ 已添加到收藏！");
        grid.scrollTop = grid.scrollHeight; // 滚动到底部
    };

    deleteModeButton.onclick = () => {
        isDeleteMode = !isDeleteMode;
        panel.classList.toggle('delete-mode', isDeleteMode);
        const svgIcons = {
            delete: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
            check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
        };
        deleteModeButton.innerHTML = isDeleteMode ? (svgIcons.check + '<span>完成</span>') : (svgIcons.delete + '<span>删除</span>');
        deleteModeButton.style.background = isDeleteMode ? "rgba(255, 71, 87, 0.5)" : "rgba(255,255,255,0.3)";
    };

    refreshButton.onclick = () => {
        console.log("🔄 点击刷新按钮");
        console.log(`📊 当前状态: allGifFiles.length = ${allGifFiles.length}, isLoading = ${isLoading}`);
        
        if (allGifFiles.length > 0) {
            refreshEmojis();
        } else {
            showToast("⏳ 表情包列表加载中...");
            console.warn("⚠️ allGifFiles 为空，可能API加载失败");
        }
    };

    proxyToggleButton.onclick = () => {
        USE_IMAGE_PROXY = !USE_IMAGE_PROXY;
        localStorage.setItem(PROXY_STORAGE_KEY, USE_IMAGE_PROXY.toString());
        
        const svgIcon = '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
        proxyToggleButton.innerHTML = svgIcon + '<span>' + (USE_IMAGE_PROXY ? '处理' : '原图') + '</span>';
        proxyToggleButton.title = USE_IMAGE_PROXY ? "当前: 使用图片处理(" + TARGET_SIZE + "x" + TARGET_SIZE + ")\n点击切换为原图" : "当前: 使用原图\n点击切换为处理后图片";
        proxyToggleButton.style.background = USE_IMAGE_PROXY ? "rgba(52, 152, 219, 0.5)" : "rgba(255,255,255,0.3)";
        
        showToast(USE_IMAGE_PROXY ? `🖼️ 已开启图片处理 (${TARGET_SIZE}x${TARGET_SIZE})` : "🖼️ 已切换为原图模式");
    };

    // 渲染设置视图
    function renderSettingsView() {
        grid.innerHTML = `
            <div style="width:100%;padding:20px;color:#fff;">
                <div style="margin-bottom:24px;">
                    <div style="font-size:16px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        收藏统计
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:16px;text-align:center;border:1px solid rgba(255,255,255,0.1);">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffd700" style="margin-bottom:8px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <div style="font-size:32px;font-weight:600;color:#ffd700;">${favoriteEmojiList.length}</div>
                            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">收藏表情</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:16px;text-align:center;border:1px solid rgba(255,255,255,0.1);">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffd700" style="margin-bottom:8px;"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
                            <div style="font-size:32px;font-weight:600;color:#ffd700;">${allGifFiles.length}</div>
                            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">表情池</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom:24px;">
                    <div style="font-size:16px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                        图片处理设置
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:13px;margin-bottom:10px;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                            图片尺寸 (像素)
                        </div>
                        <input type="number" id="settings-size-input" value="${TARGET_SIZE}" min="50" max="500" step="10"
                               style="width:100%;padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.3);background:rgba(0,0,0,0.3);color:white;font-size:14px;margin-bottom:8px;">
                        <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px;">调整插入图片的宽度和高度 (50-500px)</div>
                        <button id="settings-save-size" class="settings-button settings-button-primary" 
                                style="width:100%;padding:10px;border:none;border-radius:8px;background:rgba(52,152,219,0.8);color:white;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
                            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                            保存尺寸设置
                        </button>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:16px;border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:13px;margin-bottom:10px;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                            图床 API Key
                        </div>
                        <input type="password" id="settings-api-key-input" value="${IMAGE_API_KEY}" placeholder="输入 NodeImage API Key"
                               style="width:100%;padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.3);background:rgba(0,0,0,0.3);color:white;font-size:14px;margin-bottom:8px;">
                        <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px;">用于上传/转换图片到 NodeImage 图床</div>
                        <button id="settings-save-api-key" class="settings-button settings-button-primary" 
                                style="width:100%;padding:10px;border:none;border-radius:8px;background:rgba(52,152,219,0.8);color:white;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
                            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                            保存 API Key
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom:24px;">
                    <div style="font-size:16px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        收藏管理
                    </div>
                    <button id="settings-export" class="settings-button settings-button-success"
                            style="width:100%;padding:10px;border:none;border-radius:8px;background:rgba(46,213,115,0.6);color:white;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:10px;border:1px solid rgba(46,213,115,0.3);">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>
                        导出收藏 (JSON)
                    </button>
                    <button id="settings-clear" class="settings-button settings-button-danger"
                            style="width:100%;padding:10px;border:none;border-radius:8px;background:rgba(255,71,87,0.6);color:white;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,71,87,0.3);">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        清除所有收藏
                    </button>
                </div>
                
                <div>
                    <div style="font-size:16px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        关于
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:16px;border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:13px;line-height:1.8;color:rgba(255,255,255,0.8);">
                            <strong style="color:#fff;display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffd700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                Doro表情包面板 v14.1
                            </strong>
                            <div style="margin-left:22px;">
                                支持多套装切换、收藏管理、图片处理<br>
                                Made with 
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="#ff4757" style="display:inline-block;vertical-align:middle;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                by Sparkle
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 绑定事件
        const saveBtn = document.getElementById('settings-save-size');
        const saveApiKeyBtn = document.getElementById('settings-save-api-key');
        const exportBtn = document.getElementById('settings-export');
        const clearBtn = document.getElementById('settings-clear');
        const sizeInput = document.getElementById('settings-size-input');
        const apiKeyInput = document.getElementById('settings-api-key-input');
        
        saveBtn.onclick = () => {
            const size = parseInt(sizeInput.value);
            if (size >= 50 && size <= 500) {
                TARGET_SIZE = size.toString();
                localStorage.setItem(SIZE_STORAGE_KEY, TARGET_SIZE);
                showToast(`✅ 已保存尺寸设置: ${TARGET_SIZE}x${TARGET_SIZE}px`);
                proxyToggleButton.title = USE_IMAGE_PROXY ? 
                    `当前: 使用图片处理(${TARGET_SIZE}x${TARGET_SIZE})\n点击切换为原图` : 
                    "当前: 使用原图\n点击切换为处理后图片";
            } else {
                showToast("❌ 请输入50-500之间的数值");
            }
        };
        
        saveApiKeyBtn.onclick = () => {
            const apiKey = apiKeyInput.value.trim();
            IMAGE_API_KEY = apiKey;
            localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
            if (apiKey) {
                showToast("✅ 已保存 API Key");
            } else {
                showToast("✅ 已清空 API Key");
            }
        };
        
        exportBtn.onclick = () => {
            if (favoriteEmojiList.length === 0) {
                showToast("❌ 没有收藏可以导出");
                return;
            }
            const exportData = {
                version: "14.0",
                exportTime: new Date().toISOString(),
                count: favoriteEmojiList.length,
                favorites: favoriteEmojiList
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `emoji-favorites-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`✅ 已导出 ${favoriteEmojiList.length} 个收藏表情`);
        };
        
        clearBtn.onclick = () => {
            if (favoriteEmojiList.length === 0) {
                showToast("💡 收藏列表已经是空的了");
                return;
            }
            if (confirm(`确定要清除所有 ${favoriteEmojiList.length} 个收藏表情吗？\n此操作不可恢复！`)) {
                favoriteEmojiList = [];
                saveFavoriteEmojis(favoriteEmojiList);
                updateFavoriteTabText();
                renderEmojis();
                showToast("🗑️ 已清除所有收藏");
            }
        };
    }

    toggleBtn.onclick = () => {
        const show = panel.style.display === "none" || !panel.style.display;
        panel.style.display = show ? "flex" : "none";
        panel.style.opacity = show ? "1" : "0";
        panel.style.transform = show ? "translateY(0)" : "translateY(10px)";
        // 退出时，自动关闭删除模式
        if (!show && isDeleteMode) {
            isDeleteMode = false;
            panel.classList.remove('delete-mode');
            deleteModeButton.textContent = "🗑️ 删除";
            deleteModeButton.style.background = "rgba(255,255,255,0.3)";
        }
    };

    // 更新收藏标签显示
    function updateFavoriteTabText() {
        const favTab = document.querySelector('.favorite-tab');
        if (favTab) {
            const count = favoriteEmojiList.length;
            favTab.textContent = count > 0 ? `⭐ 收藏 (${count})` : "⭐ 收藏";
        }
    }

    // --- 初始化 ---
    customEmojiList = loadCustomEmojis();
    favoriteEmojiList = loadFavoriteEmojis();
    
    // 默认显示收藏视图
    isFavoriteView = true;
    
    // 渲染收藏视图（即使为空也显示友好提示）
    renderEmojis();
    updateTabStyles();
    updateFavoriteTabText();
    
    // 不再自动加载GitHub表情包，改为延迟加载（首次切换到表情面板时再加载）
    // fetchAllGifFiles(); // 已移除
    
    console.log("🌸 Doro表情包面板 已加载 - 默认显示收藏");
})();