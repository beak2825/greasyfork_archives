// ==UserScript==
// @name         IT之家评论区增强 (自动加载+表情优化)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  IT之家评论区优化
// @author       Allenlin
// @match        https://www.ithome.com/0/*/*.htm
// @icon         https://www.ithome.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/557757/IT%E4%B9%8B%E5%AE%B6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%A2%9E%E5%BC%BA%20%28%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%2B%E8%A1%A8%E6%83%85%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557757/IT%E4%B9%8B%E5%AE%B6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%A2%9E%E5%BC%BA%20%28%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%2B%E8%A1%A8%E6%83%85%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const RECENT_KEY = 'ithome_recent_emojis_v1';
    const CACHE_HTML_KEY = 'ithome_emoji_panel_html_cache_v1';
    const MAX_RECENT_COUNT = 14;

    // ==========================================
    // 模块一：注入 CSS 样式
    // ==========================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emoji_box {
                height: auto !important;
                flex-wrap: wrap !important;
                align-content: flex-start !important;
                will-change: transform, opacity;
            }

            /* 关键样式：用于静默预热时的隐藏 */
            .emoji_box.ithome-silent-loading {
                display: block !important;
                opacity: 0 !important;
                position: absolute !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                transform: scale(0.01) !important;
            }

            /* 面板展开动画 */
            .emoji_box:not(.ithome-silent-loading)[style*="display: flex"],
            .emoji_box:not(.ithome-silent-loading)[style*="display: block"] {
                animation: ithome_slide_in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
                border: 1px solid #e0e0e0 !important;
            }

            @keyframes ithome_slide_in {
                from { opacity: 0; transform: translateY(10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* 最近使用区域 */
            .ithome-recent-emoji-row {
                flex: 0 0 100%;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                padding: 6px 8px 8px 8px;
                margin-bottom: 8px;
                background-color: #fcfcfc;
                border-radius: 4px;
                border-bottom: 1px dashed #e0e0e0;
                box-sizing: border-box;
            }

            .ithome-recent-title {
                width: 100%;
                font-size: 11px;
                color: #999;
                margin-bottom: 6px;
                font-weight: bold;
                line-height: 1;
                user-select: none;
            }

            /* 全局表情特效 */
            .ithome-recent-emoji-row a,
            .emoji_box > a {
                transition: transform 0.1s;
                border-radius: 4px;
                position: relative;
                z-index: 1;
                display: flex !important;
                align-items: center;
                justify-content: center;
            }

            .ithome-recent-emoji-row a { margin: 2px !important; padding: 4px !important; }

            .ithome-recent-emoji-row a:hover,
            .emoji_box > a:hover {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transform: scale(1.2);
                z-index: 10;
            }

            /* 暗黑模式 */
            body.night .ithome-recent-emoji-row { background-color: #252525; border-bottom-color: #444; }
            body.night .ithome-recent-title { color: #666; }
            body.night .ithome-recent-emoji-row a:hover,
            body.night .emoji_box > a:hover { background-color: #333; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 模块二：评论区自动加载 (v1.1 修复版)
    // ==========================================
    function initAutoLoadComment() {
        var commentDiv = document.getElementById("post_comm");
        // 检查基本变量是否存在，这部分通常是内联脚本定义的，所以一般都在
        if (commentDiv && !window._commLoaded && window.commentCssFile && window.commentJsFile) {

            // 立即标记为已接管，防止原网页滚动监听触发
            window._commLoaded = true;
            commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:#666;">评论区正在自动加载...</span>';

            // 定义实际加载函数
            const doLoad = () => {
                try {
                    window.loadFile(window.commentCssFile, null, true);
                    window.loadFile(window.commentJsFile);
                    console.log('IT之家增强脚本：评论区加载函数调用成功。');
                } catch (e) {
                    console.error('IT之家增强脚本：评论区加载失败', e);
                    commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:red;">加载失败，请刷新页面重试</span>';
                }
            };

            // [核心修复] 检查 loadFile 是否就绪，如果未就绪则轮询等待
            if (typeof window.loadFile === 'function') {
                doLoad();
            } else {
                console.log('IT之家增强脚本：common.js 未就绪，开始轮询等待...');
                let retryCount = 0;
                const maxRetries = 100; // 最多等待 10 秒
                const timer = setInterval(() => {
                    retryCount++;
                    if (typeof window.loadFile === 'function') {
                        clearInterval(timer);
                        doLoad();
                    } else if (retryCount >= maxRetries) {
                        clearInterval(timer);
                        console.error('IT之家增强脚本：等待 loadFile 超时。');
                        commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:red;">加载超时，可能网络不畅</span>';
                    }
                }, 100); // 每 100ms 检查一次
            }
        }
    }

    // ==========================================
    // 模块三：数据管理 (Cache & Recent)
    // ==========================================
    function getRecentEmojis() {
        try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
    }

    function saveRecentEmoji(emojiData) {
        let list = getRecentEmojis();
        list = list.filter(item => item.title !== emojiData.title);
        list.unshift(emojiData);
        if (list.length > MAX_RECENT_COUNT) list = list.slice(0, MAX_RECENT_COUNT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));

        document.querySelectorAll('.emoji_box').forEach(box => renderRecentRow(box));
    }

    function saveHtmlCache(emojiBox) {
        if (emojiBox.innerHTML.length > 500 && !emojiBox.dataset.hasCached) {
            const cloneBox = emojiBox.cloneNode(true);
            const recentRow = cloneBox.querySelector('.ithome-recent-emoji-row');
            if (recentRow) recentRow.remove();

            const cleanHTML = cloneBox.innerHTML;
            if (cleanHTML.includes('img.ithome.com')) {
                localStorage.setItem(CACHE_HTML_KEY, cleanHTML);
                emojiBox.dataset.hasCached = 'true';
                console.log('IT之家增强脚本：表情面板已缓存到本地。');
            }
        }
    }

    // ==========================================
    // 模块四：DOM 操作与渲染
    // ==========================================

    function renderRecentRow(emojiBox) {
        let recentRow = emojiBox.querySelector('.ithome-recent-emoji-row');
        if (!recentRow) {
            recentRow = document.createElement('div');
            recentRow.className = 'ithome-recent-emoji-row';
            emojiBox.insertBefore(recentRow, emojiBox.firstChild);
        }

        const list = getRecentEmojis();
        recentRow.innerHTML = '';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'ithome-recent-title';
        titleDiv.innerText = '最近使用';
        recentRow.appendChild(titleDiv);

        if (list.length === 0) {
            const emptyTip = document.createElement('span');
            emptyTip.style.cssText = 'color:#bbb;font-size:12px;padding:5px 0;width:100%;';
            emptyTip.innerText = '暂无记录，点击下方表情即可添加...';
            recentRow.appendChild(emptyTip);
            return;
        }

        list.forEach(emoji => {
            const a = document.createElement('a');
            a.style.cursor = 'pointer';
            a.title = emoji.title;
            a.onclick = (e) => {
                e.stopPropagation();
                triggerOriginalEmojiClick(emojiBox, emoji.title);
            };

            const img = document.createElement('img');
            img.src = emoji.src;
            img.className = 'emoji';
            img.width = 20;
            img.style.pointerEvents = 'none';

            a.appendChild(img);
            recentRow.appendChild(a);
        });
    }

    function triggerOriginalEmojiClick(emojiBox, title) {
        const allImgs = emojiBox.querySelectorAll('img.emoji');

        for(let img of allImgs) {
            if (img.closest('.ithome-recent-emoji-row')) continue;

            if (img.title === title || img.getAttribute('data') === title) {
                img.parentNode.click();
                return;
            }
        }
        console.warn('IT之家增强脚本：未在当前面板找到表情', title);
    }

    function enhanceBox(emojiBox) {
        if (emojiBox.dataset.ithomeEnhanced) return;
        emojiBox.dataset.ithomeEnhanced = 'true';

        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        let hasContent = false;

        if (emojiBox.querySelectorAll('a').length > 5) {
            hasContent = true;
        }
        else if (cachedHTML && cachedHTML.length > 100) {
            emojiBox.innerHTML = cachedHTML;
            hasContent = true;
            console.log('IT之家增强脚本：已利用缓存秒开一个新表情面板。');
        }

        if (hasContent) {
            renderRecentRow(emojiBox);
            saveHtmlCache(emojiBox);
        } else {
            const boxObserver = new MutationObserver(() => {
                if (emojiBox.querySelectorAll('a').length > 5) {
                    renderRecentRow(emojiBox);
                    saveHtmlCache(emojiBox);
                    boxObserver.disconnect();
                }
            });
            boxObserver.observe(emojiBox, { childList: true });
        }
    }

    function processAllBoxes() {
        const boxes = document.querySelectorAll('.emoji_box');
        boxes.forEach(enhanceBox);
    }

    // 主动预热（仅针对主评论区，作为缓存的种子来源）
    function activePreloadMain() {
        if (window._preloadAttempted) return;
        window._preloadAttempted = true;

        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        if (cachedHTML && cachedHTML.length > 100) return;

        const mainBox = document.querySelector('#post_comm .emoji_box');
        const triggerBtn = document.querySelector('#post_comm .emojia');

        if (mainBox && triggerBtn && !mainBox.dataset.preloaded) {
            console.log('IT之家增强脚本：主评论区无缓存，执行主动预热...');
            mainBox.dataset.preloaded = 'true';
            mainBox.classList.add('ithome-silent-loading');

            if (triggerBtn.style.display === 'none') triggerBtn.style.display = 'block';

            triggerBtn.click();

            setTimeout(() => {
                mainBox.style.display = 'none';
                mainBox.classList.remove('ithome-silent-loading');
                // 注意：这里不再调用 enhanceBox，避免和 Observer 冲突
            }, 800);
        }
    }

    // ==========================================
    // 模块五：全局事件监听
    // ==========================================
    function initGlobalEvents() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a') || e.target;
            const img = target.querySelector ? target.querySelector('img') : (target.tagName === 'IMG' ? target : null);

            if (img && img.classList.contains('emoji') && !target.closest('.ithome-recent-emoji-row')) {
                const box = target.closest('.emoji_box');
                if (box) {
                    const title = img.getAttribute('title') || img.getAttribute('data');
                    const src = img.getAttribute('src');
                    if (title && src) saveRecentEmoji({ title, src });
                }
            }
        });

        document.addEventListener('click', function(e) {
            const allBoxes = document.querySelectorAll('.emoji_box');
            const allTriggers = document.querySelectorAll('.emojia, .ywz');

            let isClickTrigger = false;
            allTriggers.forEach(btn => { if (btn.contains(e.target)) isClickTrigger = true; });

            if (isClickTrigger) return;

            let isClickInsideAnyBox = false;
            allBoxes.forEach(box => { if (box.contains(e.target)) isClickInsideAnyBox = true; });

            if (!isClickInsideAnyBox) {
                allBoxes.forEach(box => {
                    if (box.style.display !== 'none' && !box.classList.contains('ithome-silent-loading')) {
                        box.style.display = 'none';
                    }
                });
            }
        });
    }

    // ==========================================
    // 入口
    // ==========================================
    injectStyles();

    window.addEventListener('load', function() {
        initAutoLoadComment();
        initGlobalEvents();
        setTimeout(activePreloadMain, 2000);
    });

    const globalObserver = new MutationObserver(function(mutations) {
        processAllBoxes();

        if (document.querySelector('.emojia') && !window._preloadAttempted) {
            window._preloadAttempted = true;
            setTimeout(activePreloadMain, 1000);
        }
    });

    globalObserver.observe(document.body, { childList: true, subtree: true });

})();
(function() {
    'use strict';

    const RECENT_KEY = 'ithome_recent_emojis_v1';
    const CACHE_HTML_KEY = 'ithome_emoji_panel_html_cache_v1';
    const MAX_RECENT_COUNT = 14;

    // ==========================================
    // 模块一：注入 CSS 样式
    // ==========================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emoji_box {
                height: auto !important;
                flex-wrap: wrap !important;
                align-content: flex-start !important;
                will-change: transform, opacity;
            }

            /* 关键样式：用于静默预热时的隐藏 */
            .emoji_box.ithome-silent-loading {
                display: block !important;
                opacity: 0 !important;
                position: absolute !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                transform: scale(0.01) !important;
            }

            /* 面板展开动画 */
            .emoji_box:not(.ithome-silent-loading)[style*="display: flex"],
            .emoji_box:not(.ithome-silent-loading)[style*="display: block"] {
                animation: ithome_slide_in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
                border: 1px solid #e0e0e0 !important;
            }

            @keyframes ithome_slide_in {
                from { opacity: 0; transform: translateY(10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* 最近使用区域 */
            .ithome-recent-emoji-row {
                flex: 0 0 100%;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                padding: 6px 8px 8px 8px;
                margin-bottom: 8px;
                background-color: #fcfcfc;
                border-radius: 4px;
                border-bottom: 1px dashed #e0e0e0;
                box-sizing: border-box;
            }

            .ithome-recent-title {
                width: 100%;
                font-size: 11px;
                color: #999;
                margin-bottom: 6px;
                font-weight: bold;
                line-height: 1;
                user-select: none;
            }

            /* 全局表情特效 */
            .ithome-recent-emoji-row a,
            .emoji_box > a {
                transition: transform 0.1s;
                border-radius: 4px;
                position: relative;
                z-index: 1;
                display: flex !important;
                align-items: center;
                justify-content: center;
            }

            .ithome-recent-emoji-row a { margin: 2px !important; padding: 4px !important; }

            .ithome-recent-emoji-row a:hover,
            .emoji_box > a:hover {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transform: scale(1.2);
                z-index: 10;
            }

            /* 暗黑模式 */
            body.night .ithome-recent-emoji-row { background-color: #252525; border-bottom-color: #444; }
            body.night .ithome-recent-title { color: #666; }
            body.night .ithome-recent-emoji-row a:hover,
            body.night .emoji_box > a:hover { background-color: #333; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 模块二：评论区自动加载 (v1.1 修复版)
    // ==========================================
    function initAutoLoadComment() {
        var commentDiv = document.getElementById("post_comm");
        // 检查基本变量是否存在，这部分通常是内联脚本定义的，所以一般都在
        if (commentDiv && !window._commLoaded && window.commentCssFile && window.commentJsFile) {

            // 立即标记为已接管，防止原网页滚动监听触发
            window._commLoaded = true;
            commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:#666;">评论区正在自动加载...</span>';

            // 定义实际加载函数
            const doLoad = () => {
                try {
                    window.loadFile(window.commentCssFile, null, true);
                    window.loadFile(window.commentJsFile);
                    console.log('IT之家增强脚本：评论区加载函数调用成功。');
                } catch (e) {
                    console.error('IT之家增强脚本：评论区加载失败', e);
                    commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:red;">加载失败，请刷新页面重试</span>';
                }
            };

            // [核心修复] 检查 loadFile 是否就绪，如果未就绪则轮询等待
            if (typeof window.loadFile === 'function') {
                doLoad();
            } else {
                console.log('IT之家增强脚本：common.js 未就绪，开始轮询等待...');
                let retryCount = 0;
                const maxRetries = 100; // 最多等待 10 秒
                const timer = setInterval(() => {
                    retryCount++;
                    if (typeof window.loadFile === 'function') {
                        clearInterval(timer);
                        doLoad();
                    } else if (retryCount >= maxRetries) {
                        clearInterval(timer);
                        console.error('IT之家增强脚本：等待 loadFile 超时。');
                        commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:red;">加载超时，可能网络不畅</span>';
                    }
                }, 100); // 每 100ms 检查一次
            }
        }
    }

    // ==========================================
    // 模块三：数据管理 (Cache & Recent)
    // ==========================================
    function getRecentEmojis() {
        try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
    }

    function saveRecentEmoji(emojiData) {
        let list = getRecentEmojis();
        list = list.filter(item => item.title !== emojiData.title);
        list.unshift(emojiData);
        if (list.length > MAX_RECENT_COUNT) list = list.slice(0, MAX_RECENT_COUNT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));

        document.querySelectorAll('.emoji_box').forEach(box => renderRecentRow(box));
    }

    function saveHtmlCache(emojiBox) {
        if (emojiBox.innerHTML.length > 500 && !emojiBox.dataset.hasCached) {
            const cloneBox = emojiBox.cloneNode(true);
            const recentRow = cloneBox.querySelector('.ithome-recent-emoji-row');
            if (recentRow) recentRow.remove();

            const cleanHTML = cloneBox.innerHTML;
            if (cleanHTML.includes('img.ithome.com')) {
                localStorage.setItem(CACHE_HTML_KEY, cleanHTML);
                emojiBox.dataset.hasCached = 'true';
                console.log('IT之家增强脚本：表情面板已缓存到本地。');
            }
        }
    }

    // ==========================================
    // 模块四：DOM 操作与渲染
    // ==========================================

    function renderRecentRow(emojiBox) {
        let recentRow = emojiBox.querySelector('.ithome-recent-emoji-row');
        if (!recentRow) {
            recentRow = document.createElement('div');
            recentRow.className = 'ithome-recent-emoji-row';
            emojiBox.insertBefore(recentRow, emojiBox.firstChild);
        }

        const list = getRecentEmojis();
        recentRow.innerHTML = '';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'ithome-recent-title';
        titleDiv.innerText = '最近使用';
        recentRow.appendChild(titleDiv);

        if (list.length === 0) {
            const emptyTip = document.createElement('span');
            emptyTip.style.cssText = 'color:#bbb;font-size:12px;padding:5px 0;width:100%;';
            emptyTip.innerText = '暂无记录，点击下方表情即可添加...';
            recentRow.appendChild(emptyTip);
            return;
        }

        list.forEach(emoji => {
            const a = document.createElement('a');
            a.style.cursor = 'pointer';
            a.title = emoji.title;
            a.onclick = (e) => {
                e.stopPropagation();
                triggerOriginalEmojiClick(emojiBox, emoji.title);
            };

            const img = document.createElement('img');
            img.src = emoji.src;
            img.className = 'emoji';
            img.width = 20;
            img.style.pointerEvents = 'none';

            a.appendChild(img);
            recentRow.appendChild(a);
        });
    }

    function triggerOriginalEmojiClick(emojiBox, title) {
        const allImgs = emojiBox.querySelectorAll('img.emoji');

        for(let img of allImgs) {
            if (img.closest('.ithome-recent-emoji-row')) continue;

            if (img.title === title || img.getAttribute('data') === title) {
                img.parentNode.click();
                return;
            }
        }
        console.warn('IT之家增强脚本：未在当前面板找到表情', title);
    }

    function enhanceBox(emojiBox) {
        if (emojiBox.dataset.ithomeEnhanced) return;
        emojiBox.dataset.ithomeEnhanced = 'true';

        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        let hasContent = false;

        if (emojiBox.querySelectorAll('a').length > 5) {
            hasContent = true;
        }
        else if (cachedHTML && cachedHTML.length > 100) {
            emojiBox.innerHTML = cachedHTML;
            hasContent = true;
            console.log('IT之家增强脚本：已利用缓存秒开一个新表情面板。');
        }

        if (hasContent) {
            renderRecentRow(emojiBox);
            saveHtmlCache(emojiBox);
        } else {
            const boxObserver = new MutationObserver(() => {
                if (emojiBox.querySelectorAll('a').length > 5) {
                    renderRecentRow(emojiBox);
                    saveHtmlCache(emojiBox);
                    boxObserver.disconnect();
                }
            });
            boxObserver.observe(emojiBox, { childList: true });
        }
    }

    function processAllBoxes() {
        const boxes = document.querySelectorAll('.emoji_box');
        boxes.forEach(enhanceBox);
    }

    // 主动预热（仅针对主评论区，作为缓存的种子来源）
    function activePreloadMain() {
        if (window._preloadAttempted) return;
        window._preloadAttempted = true;

        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        if (cachedHTML && cachedHTML.length > 100) return;

        const mainBox = document.querySelector('#post_comm .emoji_box');
        const triggerBtn = document.querySelector('#post_comm .emojia');

        if (mainBox && triggerBtn && !mainBox.dataset.preloaded) {
            console.log('IT之家增强脚本：主评论区无缓存，执行主动预热...');
            mainBox.dataset.preloaded = 'true';
            mainBox.classList.add('ithome-silent-loading');

            if (triggerBtn.style.display === 'none') triggerBtn.style.display = 'block';

            triggerBtn.click();

            setTimeout(() => {
                mainBox.style.display = 'none';
                mainBox.classList.remove('ithome-silent-loading');
                // 注意：这里不再调用 enhanceBox，避免和 Observer 冲突
            }, 800);
        }
    }

    // ==========================================
    // 模块五：全局事件监听
    // ==========================================
    function initGlobalEvents() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a') || e.target;
            const img = target.querySelector ? target.querySelector('img') : (target.tagName === 'IMG' ? target : null);

            if (img && img.classList.contains('emoji') && !target.closest('.ithome-recent-emoji-row')) {
                const box = target.closest('.emoji_box');
                if (box) {
                    const title = img.getAttribute('title') || img.getAttribute('data');
                    const src = img.getAttribute('src');
                    if (title && src) saveRecentEmoji({ title, src });
                }
            }
        });

        document.addEventListener('click', function(e) {
            const allBoxes = document.querySelectorAll('.emoji_box');
            const allTriggers = document.querySelectorAll('.emojia, .ywz');

            let isClickTrigger = false;
            allTriggers.forEach(btn => { if (btn.contains(e.target)) isClickTrigger = true; });

            if (isClickTrigger) return;

            let isClickInsideAnyBox = false;
            allBoxes.forEach(box => { if (box.contains(e.target)) isClickInsideAnyBox = true; });

            if (!isClickInsideAnyBox) {
                allBoxes.forEach(box => {
                    if (box.style.display !== 'none' && !box.classList.contains('ithome-silent-loading')) {
                        box.style.display = 'none';
                    }
                });
            }
        });
    }

    // ==========================================
    // 入口
    // ==========================================
    injectStyles();

    window.addEventListener('load', function() {
        initAutoLoadComment();
        initGlobalEvents();
        setTimeout(activePreloadMain, 2000);
    });

    const globalObserver = new MutationObserver(function(mutations) {
        processAllBoxes();

        if (document.querySelector('.emojia') && !window._preloadAttempted) {
            window._preloadAttempted = true;
            setTimeout(activePreloadMain, 1000);
        }
    });

    globalObserver.observe(document.body, { childList: true, subtree: true });

})();
(function() {
    'use strict';

    const RECENT_KEY = 'ithome_recent_emojis_v1';
    const CACHE_HTML_KEY = 'ithome_emoji_panel_html_cache_v1';
    const MAX_RECENT_COUNT = 14;

    // ==========================================
    // 模块一：注入 CSS 样式
    // ==========================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emoji_box {
                height: auto !important;
                flex-wrap: wrap !important;
                align-content: flex-start !important;
                will-change: transform, opacity;
            }

            /* 关键样式：用于静默预热时的隐藏 */
            .emoji_box.ithome-silent-loading {
                display: block !important;
                opacity: 0 !important;
                position: absolute !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                transform: scale(0.01) !important;
            }

            /* 面板展开动画 */
            .emoji_box:not(.ithome-silent-loading)[style*="display: flex"],
            .emoji_box:not(.ithome-silent-loading)[style*="display: block"] {
                animation: ithome_slide_in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
                border: 1px solid #e0e0e0 !important;
            }

            @keyframes ithome_slide_in {
                from { opacity: 0; transform: translateY(10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* 最近使用区域 */
            .ithome-recent-emoji-row {
                flex: 0 0 100%;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                padding: 6px 8px 8px 8px;
                margin-bottom: 8px;
                background-color: #fcfcfc;
                border-radius: 4px;
                border-bottom: 1px dashed #e0e0e0;
                box-sizing: border-box;
            }

            .ithome-recent-title {
                width: 100%;
                font-size: 11px;
                color: #999;
                margin-bottom: 6px;
                font-weight: bold;
                line-height: 1;
                user-select: none;
            }

            /* 全局表情特效 */
            .ithome-recent-emoji-row a,
            .emoji_box > a {
                transition: transform 0.1s;
                border-radius: 4px;
                position: relative;
                z-index: 1;
                display: flex !important;
                align-items: center;
                justify-content: center;
            }

            .ithome-recent-emoji-row a { margin: 2px !important; padding: 4px !important; }

            .ithome-recent-emoji-row a:hover,
            .emoji_box > a:hover {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transform: scale(1.2);
                z-index: 10;
            }

            /* 暗黑模式 */
            body.night .ithome-recent-emoji-row { background-color: #252525; border-bottom-color: #444; }
            body.night .ithome-recent-title { color: #666; }
            body.night .ithome-recent-emoji-row a:hover,
            body.night .emoji_box > a:hover { background-color: #333; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 模块二：评论区自动加载
    // ==========================================
    function initAutoLoadComment() {
        var commentDiv = document.getElementById("post_comm");
        if (commentDiv && !window._commLoaded && window.commentCssFile && window.commentJsFile) {
            window._commLoaded = true;
            commentDiv.innerHTML = '<span class="comm_status" style="width:100%;text-align:center;display:block;margin-top:20px;font-size:13px;color:#666;">评论区正在自动加载...</span>';
            if (typeof window.loadFile === 'function') {
                window.loadFile(window.commentCssFile, null, true);
                window.loadFile(window.commentJsFile);
            }
        }
    }

    // ==========================================
    // 模块三：数据管理 (Cache & Recent)
    // ==========================================
    function getRecentEmojis() {
        try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
    }

    function saveRecentEmoji(emojiData) {
        let list = getRecentEmojis();
        list = list.filter(item => item.title !== emojiData.title);
        list.unshift(emojiData);
        if (list.length > MAX_RECENT_COUNT) list = list.slice(0, MAX_RECENT_COUNT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));

        // 更新页面上所有的最近使用栏
        document.querySelectorAll('.emoji_box').forEach(box => renderRecentRow(box));
    }

    function saveHtmlCache(emojiBox) {
        // 只有当含有大量表情链接时才保存
        if (emojiBox.innerHTML.length > 500 && !emojiBox.dataset.hasCached) {
            const cloneBox = emojiBox.cloneNode(true);
            const recentRow = cloneBox.querySelector('.ithome-recent-emoji-row');
            if (recentRow) recentRow.remove();

            const cleanHTML = cloneBox.innerHTML;
            if (cleanHTML.includes('img.ithome.com')) {
                localStorage.setItem(CACHE_HTML_KEY, cleanHTML);
                emojiBox.dataset.hasCached = 'true';
                console.log('IT之家增强脚本：表情面板已缓存到本地。');
            }
        }
    }

    // ==========================================
    // 模块四：DOM 操作与渲染
    // ==========================================

    // 为指定的 box 渲染最近使用栏
    function renderRecentRow(emojiBox) {
        let recentRow = emojiBox.querySelector('.ithome-recent-emoji-row');
        if (!recentRow) {
            recentRow = document.createElement('div');
            recentRow.className = 'ithome-recent-emoji-row'; // 改用 class 以支持多实例
            emojiBox.insertBefore(recentRow, emojiBox.firstChild);
        }

        const list = getRecentEmojis();
        recentRow.innerHTML = '';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'ithome-recent-title';
        titleDiv.innerText = '最近使用';
        recentRow.appendChild(titleDiv);

        if (list.length === 0) {
            const emptyTip = document.createElement('span');
            emptyTip.style.cssText = 'color:#bbb;font-size:12px;padding:5px 0;width:100%;';
            emptyTip.innerText = '暂无记录，点击下方表情即可添加...';
            recentRow.appendChild(emptyTip);
            return;
        }

        list.forEach(emoji => {
            const a = document.createElement('a');
            a.style.cursor = 'pointer';
            a.title = emoji.title;
            // 点击事件
            a.onclick = (e) => {
                e.stopPropagation();
                triggerOriginalEmojiClick(emojiBox, emoji.title);
            };

            const img = document.createElement('img');
            img.src = emoji.src;
            img.className = 'emoji';
            img.width = 20;
            img.style.pointerEvents = 'none';

            a.appendChild(img);
            recentRow.appendChild(a);
        });
    }

    // 在指定的 box 内触发原始点击
    function triggerOriginalEmojiClick(emojiBox, title) {
        // 查找当前 box 内的原始表情
        // 选择器：在当前 emojiBox 下，直接子元素是 a，且不是我们的 recent-row 里的 a
        // 我们可以通过排除法：找 data 属性或 title 属性匹配，且父级不是 recent-row
        const allImgs = emojiBox.querySelectorAll('img.emoji');

        for(let img of allImgs) {
            // 确保 img 不在最近使用栏里
            if (img.closest('.ithome-recent-emoji-row')) continue;

            if (img.title === title || img.getAttribute('data') === title) {
                img.parentNode.click();
                return;
            }
        }
        console.warn('IT之家增强脚本：未在当前面板找到表情', title);
    }

    // 核心：处理单个表情盒子
    function enhanceBox(emojiBox) {
        // 如果已经处理过，跳过
        if (emojiBox.dataset.ithomeEnhanced) return;
        emojiBox.dataset.ithomeEnhanced = 'true';

        // 1. 尝试从缓存注入
        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        let hasContent = false;

        // 检查盒子是否已经有内容（原网页可能已经加载了）
        if (emojiBox.querySelectorAll('a').length > 5) {
            hasContent = true;
        }
        // 如果没内容，且有缓存，直接注入
        else if (cachedHTML && cachedHTML.length > 100) {
            emojiBox.innerHTML = cachedHTML;
            hasContent = true;
            console.log('IT之家增强脚本：已利用缓存秒开一个新表情面板。');
        }

        // 2. 如果有内容（无论是原生的还是我们缓存注入的），渲染最近使用栏
        if (hasContent) {
            renderRecentRow(emojiBox);
            // 顺便保存一下缓存（如果是新的话）
            saveHtmlCache(emojiBox);
        } else {
            // 3. 如果没内容也没缓存（极少情况），添加一个观察者监听它的变化
            // 等原网页加载完表情后，我们再插入最近使用栏并保存缓存
            const boxObserver = new MutationObserver(() => {
                if (emojiBox.querySelectorAll('a').length > 5) {
                    renderRecentRow(emojiBox);
                    saveHtmlCache(emojiBox);
                    boxObserver.disconnect(); // 任务完成，停止监听这个盒子
                }
            });
            boxObserver.observe(emojiBox, { childList: true });
        }
    }

    // 批量处理页面上所有的盒子
    function processAllBoxes() {
        const boxes = document.querySelectorAll('.emoji_box');
        boxes.forEach(enhanceBox);
    }

    // 主动预热（仅针对主评论区，作为缓存的种子来源）
    function activePreloadMain() {
        const cachedHTML = localStorage.getItem(CACHE_HTML_KEY);
        if (cachedHTML && cachedHTML.length > 100) return; // 有缓存就不预热了

        const mainBox = document.querySelector('#post_comm .emoji_box');
        const triggerBtn = document.querySelector('#post_comm .emojia');

        if (mainBox && triggerBtn && !mainBox.dataset.preloaded) {
            console.log('IT之家增强脚本：主评论区无缓存，执行主动预热...');
            mainBox.dataset.preloaded = 'true';
            mainBox.classList.add('ithome-silent-loading');
            triggerBtn.click();
            setTimeout(() => {
                mainBox.style.display = 'none';
                mainBox.classList.remove('ithome-silent-loading');
                enhanceBox(mainBox); // 预热完立即增强
            }, 800);
        }
    }

    // ==========================================
    // 模块五：全局事件监听 (Delegation)
    // ==========================================
    function initGlobalEvents() {
        // 1. 全局点击监听：记录表情使用
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a') || e.target;
            const img = target.querySelector ? target.querySelector('img') : (target.tagName === 'IMG' ? target : null);

            // 确保点击的是表情，且不在最近使用栏内
            if (img && img.classList.contains('emoji') && !target.closest('.ithome-recent-emoji-row')) {
                // 找到它所属的表情盒子，确保是我们增强过的
                const box = target.closest('.emoji_box');
                if (box) {
                    const title = img.getAttribute('title') || img.getAttribute('data');
                    const src = img.getAttribute('src');
                    if (title && src) saveRecentEmoji({ title, src });
                }
            }
        });

        // 2. 全局点击监听：点击空白处关闭所有表情面板
        document.addEventListener('click', function(e) {
            const allBoxes = document.querySelectorAll('.emoji_box');
            const allTriggers = document.querySelectorAll('.emojia, .ywz');

            // 检查点击目标是否在任何一个触发按钮内
            let isClickTrigger = false;
            allTriggers.forEach(btn => { if (btn.contains(e.target)) isClickTrigger = true; });

            if (isClickTrigger) return; // 如果点的是按钮，原网页有逻辑处理 toggle，我们不管

            // 检查点击目标是否在任何一个面板内
            let isClickInsideAnyBox = false;
            allBoxes.forEach(box => { if (box.contains(e.target)) isClickInsideAnyBox = true; });

            if (!isClickInsideAnyBox) {
                // 点击了空白处，隐藏所有显示的面板
                allBoxes.forEach(box => {
                    if (box.style.display !== 'none' && !box.classList.contains('ithome-silent-loading')) {
                        box.style.display = 'none';
                    }
                });
            }
        });
    }

    // ==========================================
    // 入口
    // ==========================================
    injectStyles();

    window.addEventListener('load', function() {
        initAutoLoadComment();
        initGlobalEvents();
        setTimeout(activePreloadMain, 2000); // 延迟预热
    });

    // 全局观察者：监听 DOM 树变化（针对动态插入的回复框）
    const globalObserver = new MutationObserver(function(mutations) {
        // 只要 DOM 变了，就尝试去处理一下页面上所有的盒子
        // 虽然有点暴力，但对于这种动态网页最稳妥，且 enhanceBox 内有防重判断，开销很小
        processAllBoxes();

        // 专门针对 v0.9 的逻辑修复：监听 .emojia 按钮出现
        if (document.querySelector('.emojia') && !window._preloadAttempted) {
            window._preloadAttempted = true;
            setTimeout(activePreloadMain, 1000);
        }
    });

    // 监听整个 body，确保捕获任何位置插入的回复框
    globalObserver.observe(document.body, { childList: true, subtree: true });

})();