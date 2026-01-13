// ==UserScript==
// @name         Linux.do 帖子源码一键查看复制 (兼容IDCFlare)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在 Linux.do 或 IDCFlare.com的每个帖子旁添加一个按钮,点击即可查看该帖子的 Markdown 源码,支持一键复制和转化图片url为外链以及保留标题作者信息等功能,提升内容获取效率。
// @author       guiguisocute
// @homepage     https://github.com/guiguisocute/linuxdo-markdown-viewer#readme
// @homepageURL  https://github.com/guiguisocute/linuxdo-markdown-viewer
// @supportURL   https://github.com/guiguisocute/linuxdo-markdown-viewer/issues
// @match        https://linux.do/t/*
// @match        https://idcflare.com/t/*
// @match        https://www.idcflare.com/t/*
// @icon         https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562340/Linuxdo%20%E5%B8%96%E5%AD%90%E6%BA%90%E7%A0%81%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E5%A4%8D%E5%88%B6%20%28%E5%85%BC%E5%AE%B9IDCFlare%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562340/Linuxdo%20%E5%B8%96%E5%AD%90%E6%BA%90%E7%A0%81%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E5%A4%8D%E5%88%B6%20%28%E5%85%BC%E5%AE%B9IDCFlare%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局缓存主贴元数据
    const opMetadataCache = {};

    // ==========================================
    // 🎛️ 【个性化配置区】
    // 修改下面的数值来自定义脚本的外观和行为
    // ==========================================
    const CONFIG = {
        // --- 1. 侧边按钮样式 ---
        btnOffsetTop: "10px",       // 按钮距离头像底部的间距 (加大往下移)
        btnOffsetLeft: "3px",       // 按钮左右偏移 (正数往右，负数往左)
        btnSize: "40px",            // 按钮大小 (宽高相等)
        btnBorderRadius: "50%",     // 按钮圆角 (50% = 圆形, 8px = 圆角矩形)

        // --- 2. 源码容器布局 ---
        containerMarginTop: "15px",    // 容器距离上方内容的间距
        containerMarginLeft: "20px",   // 容器整体向右偏移 (防止遮挡头像)
        containerBorderRadius: "8px",  // 容器圆角大小
        containerPadding: "20px",      // 文本框内边距

        // --- 3. 吸顶工具栏 ---
        stickyTop: "65px",          // 吸顶时距离浏览器顶部的距离
        headerPadding: "10px 15px", // 工具栏内边距

        // --- 4. 文本框样式 ---
        textareaMinHeight: "150px", // 文本框最小高度
        textareaFontSize: "14px",   // 字体大小
        textareaLineHeight: "1.6",  // 行高
        textareaFontFamily: '"JetBrains Mono", "Fira Code", Consolas, Menlo, monospace', // 字体

        // --- 5. 复选框默认状态 ---
        defaultFixImg: true,        // 默认勾选"图片改为外链URL" (true=勾选, false=不勾选)
        defaultKeepMeta: false,     // 默认勾选"保留标题与用户信息" (true=勾选, false=不勾选)

        // --- 6. 动画效果 ---
        transitionSpeed: "0.2s",    // 按钮悬停等动画速度
        copySuccessDuration: 2000,  // "已复制"提示持续时间(毫秒)

        // --- 7. 高级选项 ---
        enableStickyHeader: true,   // 是否启用吸顶工具栏 (true=启用, false=禁用)
        autoResizeTextarea: true    // 是否自动调整文本框高度 (true=启用, false=禁用)
    };
    // ==========================================


    // --- 样式定义 ---
    GM_addStyle(`
        /* 1. 左侧头像下的触发按钮 */
        .linuxdo-side-btn {
            margin-top: ${CONFIG.btnOffsetTop};
            margin-left: ${CONFIG.btnOffsetLeft};
            
            width: ${CONFIG.btnSize};
            height: ${CONFIG.btnSize};
            border-radius: ${CONFIG.btnBorderRadius};
            background-color: transparent;
            border: 1px solid transparent;
            color: var(--primary-medium, #919191);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all ${CONFIG.transitionSpeed} ease;
            position: relative;
            z-index: 5;
        }
        .linuxdo-side-btn:hover {
            background-color: var(--d-button-hover-background, #e9e9e9);
            color: var(--primary, #222);
        }
        .linuxdo-side-btn.active {
            color: var(--tertiary, #0088cc);
            background-color: var(--tertiary-low, #e6f5ff);
            border-color: var(--tertiary-low, #e6f5ff);
        }
        .linuxdo-side-btn svg { width: 20px; height: 20px; fill: currentColor; pointer-events: none; }
        .linuxdo-side-btn.loading { cursor: wait; opacity: 0.6; }

        /* 2. 源码容器包裹层 */
        .linuxdo-raw-wrapper {
            position: relative;
            
            margin-top: ${CONFIG.containerMarginTop};
            margin-left: ${CONFIG.containerMarginLeft};
            margin-bottom: 20px;
            
            border-radius: ${CONFIG.containerBorderRadius};
            z-index: 100;
            overflow: visible;
        }
        
        .linuxdo-raw-wrapper[data-theme="light"] {
            background-color: rgb(248, 248, 248) !important;
            border: 1px solid #e1e4e8 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] {
            background-color: #191919 !important;
            border: 1px solid #30363d !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }

        /* 3. 吸顶工具栏 */
        .linuxdo-raw-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: ${CONFIG.headerPadding};
            
            border-top-left-radius: ${CONFIG.containerBorderRadius};
            border-top-right-radius: ${CONFIG.containerBorderRadius};
            z-index: 999;
            
            position: ${CONFIG.enableStickyHeader ? '-webkit-sticky' : 'relative'};
            position: ${CONFIG.enableStickyHeader ? 'sticky' : 'relative'};
            top: ${CONFIG.enableStickyHeader ? CONFIG.stickyTop : 'auto'};
        }
        
        .linuxdo-raw-wrapper[data-theme="light"] .linuxdo-raw-header {
            background-color: #f6f8fa !important;
            border-bottom: 1px solid #e1e4e8 !important;
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .linuxdo-raw-header {
            background-color: #1e1e1e !important;
            border-bottom: 1px solid #30363d !important;
        }

        /* 4. 选项区域 */
        .ld-options-group {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .ld-checkbox-label {
            display: inline-flex;
            align-items: center;
            font-size: 13px;
            color: #57606a !important;
            cursor: pointer;
            user-select: none;
            line-height: 1;  /* 减小行高 */
            gap: 2px;  /* 复选框与文本间距 */
        }
        .ld-checkbox-label input { 
            margin: 0;
            cursor: pointer;
            accent-color: var(--tertiary, #0088cc); 
            width: 15px;
            height: 15px;
            flex-shrink: 0;
            vertical-align: middle;  /* 垂直居中对齐 */
            position: relative;
            top: -1px;  /* 复选框向上偏移 1px */
        }

        /* 5. 源码编辑框 - 强制覆盖只读样式 */
        .linuxdo-raw-textarea {
            width: 100% !important;
            min-height: ${CONFIG.textareaMinHeight} !important;
            box-sizing: border-box !important;
            display: block !important;
            padding: ${CONFIG.containerPadding} !important;
            
            font-family: ${CONFIG.textareaFontFamily} !important;
            font-size: ${CONFIG.textareaFontSize} !important;
            line-height: ${CONFIG.textareaLineHeight} !important;
            
            border: none !important;
            resize: vertical !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            outline: none !important;
            cursor: text !important;
            
            border-bottom-left-radius: ${CONFIG.containerBorderRadius};
            border-bottom-right-radius: ${CONFIG.containerBorderRadius};
        }
        
        .linuxdo-raw-wrapper[data-theme="light"] .linuxdo-raw-textarea {
            background-color: rgb(248, 248, 248) !important;
            color: #24292f !important;
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .linuxdo-raw-textarea {
            background-color: #191919 !important;
            color: #c7c7c7 !important;
        }
        
        /* 移除聚焦时的所有特效 */
        .linuxdo-raw-textarea:focus,
        .linuxdo-raw-textarea:focus-visible {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
        }
        
        .linuxdo-raw-wrapper:focus-within {
            border-color: #e1e4e8 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }

        /* 6. 复制按钮 */
        .ld-copy-btn {
            display: flex;
            align-items: center;
            padding: 5px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: all ${CONFIG.transitionSpeed};
            border: 1px solid #d0d7de;
            background: #ffffff;
            color: #57606a;
            white-space: nowrap;
            gap: 6px;
        }
        .ld-copy-btn:hover { color: #2da44e; border-color: #2da44e; background: #fff; }
        .ld-copy-btn.copied { background: #2da44e; color: white; border-color: #2da44e; }
        .ld-copy-btn svg { width: 14px; height: 14px; fill: currentColor; }

        /* --- 滚动条 --- */
        .linuxdo-raw-textarea::-webkit-scrollbar { width: 8px; height: 8px; }
        .linuxdo-raw-textarea::-webkit-scrollbar-track { background: transparent; }
        .linuxdo-raw-textarea::-webkit-scrollbar-thumb { background-color: #d0d7de; border-radius: 4px; }
        .linuxdo-raw-textarea::-webkit-scrollbar-thumb:hover { background-color: #afb8c1; }

        /* --- 暗色模式适配 --- */
        .linuxdo-raw-wrapper[data-theme="dark"] .ld-copy-btn { 
            background: #1e1e1e !important; 
            border-color: #30363d !important; 
            color: #c9d1d9 !important; 
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .ld-copy-btn:hover { 
            background: #2a2a2a !important; 
            border-color: #2da44e !important; 
            color: #2da44e !important; 
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .ld-copy-btn.copied {
            background: #2da44e !important;
            color: white !important;
            border-color: #2da44e !important;
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .ld-checkbox-label { 
            color: #c7c7c7 !important; 
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .linuxdo-raw-textarea::-webkit-scrollbar-thumb { 
            background-color: #484f58; 
        }
        
        .linuxdo-raw-wrapper[data-theme="dark"] .linuxdo-raw-textarea::-webkit-scrollbar-thumb:hover { 
            background-color: #5a5a5a; 
        }
    `);

    // --- 图标 ---
    const ICONS = {
        CURLY: `<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/><line x1="10" y1="18" x2="14" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        LOADING: `<svg viewBox="0 0 24 24" style="animation:spin 1s linear infinite"><style>@keyframes spin{100%{transform:rotate(360deg)}}</style><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>`,
        COPY: `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
        CHECK: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
    };

    // --- 辅助函数 ---

    function getTopicId() {
        const match = window.location.pathname.match(/\/t\/[^/]+\/(\d+)/);
        if (match && match[1]) return match[1];
        const topicEl = document.querySelector('#topic-title');
        return topicEl ? topicEl.dataset.topicId : null;
    }

    function getTopicTitle() {
        // 直接从标签页标题获取，格式：标题 - 站点名
        const pageTitle = document.title;
        // 移除后缀 " - Linux Do" 或 " - IDCFlare" 等后缀
        return pageTitle.split(' - ')[0].trim() || document.querySelector('.fancy-title')?.innerText.trim() || "Topic";
    }
    
    function getTopicUrl() {
        return window.location.href.split('#')[0].split('?')[0];
    }

    // 获取主贴元数据（带缓存，支持从 API 获取）
    async function getOPMetadata() {
        const topicId = getTopicId();
        if (!topicId) return { username: "Unknown", time: "Unknown Time" };

        // 检查缓存
        if (opMetadataCache[topicId]) {
            return opMetadataCache[topicId];
        }

        // 尝试从 DOM 获取（如果主贴已加载）
        const opPost = document.querySelector('#post_1');
        if (opPost && opPost.innerHTML.length > 200) {
            const metaData = opPost.querySelector('.topic-meta-data');
            if (metaData) {
                const userLink = metaData.querySelector('a[data-user-card]');
                const username = userLink?.innerText.trim();
                const postDate = opPost.querySelector('.post-date');
                const relativeDate = postDate?.querySelector('.relative-date[data-time]');
                let time = "Unknown Time";
                if (relativeDate) {
                    const timestamp = relativeDate.getAttribute('data-time');
                    if (timestamp) {
                        time = new Date(parseInt(timestamp)).toISOString();
                    }
                }
                
                if (username) {
                    const metadata = { username, time };
                    opMetadataCache[topicId] = metadata;
                    return metadata;
                }
            }
        }

        // 从 /raw API 获取
        try {
            const response = await fetch(`/raw/${topicId}/1`);
            if (!response.ok) throw new Error("API Error");
            const rawText = await response.text();
            
            // 从 raw 文本推断作者（LinuxDo 的 raw 不包含元数据，需要从 JSON API）
            const jsonResponse = await fetch(`/t/${topicId}.json`);
            const topicData = await jsonResponse.json();
            const firstPost = topicData.post_stream?.posts?.[0];
            
            if (firstPost) {
                const metadata = {
                    username: firstPost.username || firstPost.name || "Unknown",
                    time: firstPost.created_at || "Unknown Time"
                };
                opMetadataCache[topicId] = metadata;
                return metadata;
            }
        } catch (err) {
            console.error('获取主贴元数据失败:', err);
        }

        return { username: "Unknown", time: "Unknown Time" };
    }

    function getPostMetadata(postContainer) {
        let username = "Unknown";
        let time = "Unknown Time";
        
        // 判断是否为主贴（#post_1）
        if (postContainer.id === 'post_1') {
            // 主贴：从 .topic-meta-data 获取用户名
            const metaData = postContainer.querySelector('.topic-meta-data');
            const userLink = metaData?.querySelector('a[data-user-card]');
            username = userLink?.innerText.trim() || "Unknown";
            
            // 主贴时间从 .post-date 内的 .relative-date 获取
            const postDate = postContainer.querySelector('.post-date');
            const relativeDate = postDate?.querySelector('.relative-date[data-time]');
            if (relativeDate) {
                const timestamp = relativeDate.getAttribute('data-time');
                if (timestamp) {
                    time = new Date(parseInt(timestamp)).toISOString();
                }
            }
        } else {
            // 回复楼：使用原有逻辑
            username = postContainer.querySelector('.username')?.innerText.trim() || "Unknown";
            
            const relativeDate = postContainer.querySelector('.relative-date[data-time]');
            if (relativeDate) {
                const timestamp = relativeDate.getAttribute('data-time');
                if (timestamp) {
                    time = new Date(parseInt(timestamp)).toISOString();
                } else {
                    time = relativeDate.getAttribute('title') || "Unknown Time";
                }
            }
        }
        
        return { username, time };
    }

    function fixImageUrlsInText(rawText, cookedElement) {
        if (!cookedElement) return rawText;
        return rawText.replace(/upload:\/\/([a-zA-Z0-9]+)(?:\.[a-zA-Z0-9]+)?/g, (match, hash) => {
            const imgEl = cookedElement.querySelector(`img[data-base62-sha1="${hash}"]`);
            if (imgEl) {
                const lightbox = imgEl.closest('a.lightbox');
                let realUrl = lightbox ? lightbox.href : imgEl.src;
                if (realUrl.startsWith('/')) {
                    realUrl = window.location.origin + realUrl;
                }
                return realUrl;
            }
            return match;
        });
    }
    
    function formatTime(timeStr) {
        // 尝试解析时间字符串并格式化为 YYYY-MM-DD HH:mm
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
        } catch (_) {
            // 忽略解析错误
        }
        // 如果解析失败，返回原始字符串
        return timeStr;
    }

    // --- 主逻辑 ---

    function toggleSourceView(btn, postContainer, postNumber) {
        const topicId = getTopicId();
        if (!topicId) return;

        const cookedContent = postContainer.querySelector('.cooked') || postContainer.querySelector('.topic-body .regular');
        let wrapper = postContainer.querySelector('.linuxdo-raw-wrapper');

        // 关闭
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            btn.title = "切换为源码模式";
            if (wrapper) wrapper.style.display = 'none';
            if (cookedContent) cookedContent.style.display = 'block';
            return;
        }

        // 重新开启
        if (wrapper) {
            btn.classList.add('active');
            btn.title = "切换为渲染模式";
            if (cookedContent) cookedContent.style.display = 'none';
            wrapper.style.display = 'block';
            
            // 重新检测主题
            const isDark = getComputedStyle(document.documentElement).colorScheme === 'dark';
            wrapper.setAttribute('data-theme', isDark ? 'dark' : 'light');
            return;
        }

        // 首次加载
        btn.innerHTML = ICONS.LOADING;
        btn.classList.add('loading');

        fetch(`/raw/${topicId}/${postNumber}`)
            .then(res => {
                if (!res.ok) throw new Error("API Err");
                return res.text();
            })
            .then(text => {
                // Wrapper
                wrapper = document.createElement('div');
                wrapper.className = 'linuxdo-raw-wrapper';
                
                // 检测并设置主题（延迟执行确保 DOM 已更新）
                const updateTheme = () => {
                    const isDark = getComputedStyle(document.documentElement).colorScheme === 'dark';
                    wrapper.setAttribute('data-theme', isDark ? 'dark' : 'light');
                };
                
                // 立即检测一次
                setTimeout(updateTheme, 0);
                
                // 使用 matchMedia 监听系统暗色模式变化
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeQuery.addEventListener('change', updateTheme);
                
                // 同时监听 DOM 变化（兼容方案）
                const themeObserver = new MutationObserver(updateTheme);
                themeObserver.observe(document.documentElement, { 
                    attributes: true, 
                    attributeFilter: ['style', 'class', 'data-theme'] 
                });

                // Header
                const header = document.createElement('div');
                header.className = 'linuxdo-raw-header';

                // Options
                const optionsGroup = document.createElement('div');
                optionsGroup.className = 'ld-options-group';

                const checkImg = createCheckbox("图片转为外链URL", 
                    localStorage.getItem('linuxdo-raw-fix-img') === null ? CONFIG.defaultFixImg : localStorage.getItem('linuxdo-raw-fix-img') !== 'false'
                );
                const checkMeta = createCheckbox("保留标题与用户信息", 
                    localStorage.getItem('linuxdo-raw-keep-meta') === null ? CONFIG.defaultKeepMeta : localStorage.getItem('linuxdo-raw-keep-meta') === 'true'
                );
                
                // 保存原始文本用于切换
                const originalRawText = text;
                let textarea;
                
                // 更新文本框内容的函数
                const updateTextareaContent = () => {
                    if (!textarea) return;
                    if (checkImg.input.checked) {
                        textarea.value = fixImageUrlsInText(originalRawText, cookedContent);
                    } else {
                        textarea.value = originalRawText;
                    }
                    // 自动调整高度
                    if (CONFIG.autoResizeTextarea) {
                        textarea.style.height = 'auto';
                        textarea.style.height = (textarea.scrollHeight + 10) + 'px';
                    }
                };
                
                // 监听复选框变化，保存用户偏好并实时更新内容
                checkImg.input.addEventListener('change', () => {
                    localStorage.setItem('linuxdo-raw-fix-img', checkImg.input.checked);
                    updateTextareaContent();
                });
                checkMeta.input.addEventListener('change', () => {
                    localStorage.setItem('linuxdo-raw-keep-meta', checkMeta.input.checked);
                });

                optionsGroup.append(checkImg.label, checkMeta.label);

                // Copy Button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'ld-copy-btn';
                copyBtn.innerHTML = `${ICONS.COPY} 复制`;
                copyBtn.title = "复制源码到剪贴板";

                copyBtn.onclick = async () => {
                    let textToCopy = textarea.value;
                    
                    if (checkMeta.input.checked) {
                        const title = getTopicTitle();
                        const topicUrl = getTopicUrl();
                        
                        // 获取主贴作者和时间（优先从缓存/API）
                        const opMeta = await getOPMetadata();
                        const opTimeFormatted = formatTime(opMeta.time);
                        
                        if (postNumber === "1") {
                            // 主楼：显示标题+作者+时间
                            textToCopy = `# ${title}\n链接：${topicUrl}\n\n> 作者：@${opMeta.username} | ${opTimeFormatted}\n\n${textToCopy}`;
                        } else {
                            // 回复楼：显示标题+主贴作者+主贴时间+楼层+回复者+回复时间
                            const meta = getPostMetadata(postContainer);
                            const timeFormatted = formatTime(meta.time);
                            textToCopy = `# ${title}\n链接：${topicUrl}\n\n> 话题作者：@${opMeta.username} | ${opTimeFormatted}\n\n> #${postNumber} 楼 | 回复者：@${meta.username} | ${timeFormatted}\n\n${textToCopy}`;
                        }
                    }

                    GM_setClipboard(textToCopy);
                    copyBtn.innerHTML = `${ICONS.CHECK} 已复制`;
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = `${ICONS.COPY} 复制`;
                        copyBtn.classList.remove('copied');
                    }, CONFIG.copySuccessDuration);
                };

                header.appendChild(optionsGroup);
                header.appendChild(copyBtn);

                // Textarea
                textarea = document.createElement('textarea');
                textarea.className = 'linuxdo-raw-textarea';
                textarea.spellcheck = false;
                textarea.readOnly = true;

                wrapper.appendChild(header);
                wrapper.appendChild(textarea);
                
                // 根据复选框状态设置初始内容（不调整高度，高度在添加到DOM后调整）
                if (checkImg.input.checked) {
                    textarea.value = fixImageUrlsInText(originalRawText, cookedContent);
                } else {
                    textarea.value = originalRawText;
                }

                if (cookedContent) {
                    cookedContent.parentNode.insertBefore(wrapper, cookedContent.nextSibling);
                    cookedContent.style.display = 'none';
                } else {
                    postContainer.appendChild(wrapper);
                }
                
                // 在添加到 DOM 后调整高度
                if (CONFIG.autoResizeTextarea) {
                    textarea.style.height = 'auto';
                    textarea.style.height = (textarea.scrollHeight + 10) + 'px';
                }

                btn.classList.remove('loading');
                btn.classList.add('active');
                btn.title = "切换为渲染模式";
                btn.innerHTML = ICONS.CURLY;
            })
            .catch(err => {
                console.error(err);
                btn.innerHTML = ICONS.CURLY;
                btn.classList.remove('loading');
                alert("获取源码失败，请检查网络");
            });
    }

    function createCheckbox(labelText, isChecked) {
        const label = document.createElement('label');
        label.className = 'ld-checkbox-label';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = isChecked;
        label.appendChild(input);
        label.append(labelText);
        return { label, input };
    }

    function processPost(element) {
        if (element.dataset.sideBtnAdded) return;

        const elementId = element.id;
        if (!elementId || !elementId.startsWith('post_')) return;

        const postNumber = elementId.split('_')[1];
        if (!postNumber) return;

        const avatarContainer = element.querySelector('.topic-avatar');
        if (!avatarContainer) return;

        const btn = document.createElement('button');
        btn.className = 'linuxdo-side-btn';
        btn.innerHTML = ICONS.CURLY;
        btn.title = "切换为源码模式";

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.classList.contains('loading')) return;
            toggleSourceView(btn, element, postNumber);
        });

        avatarContainer.appendChild(btn);
        element.dataset.sideBtnAdded = "true";
    }

    function scanPosts() {
        const posts = document.querySelectorAll('[id^="post_"]');
        posts.forEach(processPost);
    }

    // --- 启动逻辑 ---
    scanPosts();
    setTimeout(scanPosts, 1000);
    setTimeout(scanPosts, 3000);

    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) {
            scanPosts();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();