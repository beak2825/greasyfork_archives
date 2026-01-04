// ==UserScript==
// @name         开源阅读(Legado)预加载
// @namespace    https://github.com/caffetsong/legado-fast-page
// @version      2.0.1
// @description  通过预加载，加快开源阅读(Legado)Web服务的翻页速度。
// @author       caffetsong
// @license      GPL-3.0
// @match        http://*/vue/index.html*
// @match        https://*/vue/index.html*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556654/%E5%BC%80%E6%BA%90%E9%98%85%E8%AF%BB%28Legado%29%E9%A2%84%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/556654/%E5%BC%80%E6%BA%90%E9%98%85%E8%AF%BB%28Legado%29%E9%A2%84%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const CONFIG = {
        CONTENT_CONTAINER_SELECTOR: 'div[chapterindex]',
        CHAPTER_TITLE_SELECTOR: 'div.title',
    };

    const state = {
        bookBaseUrl: null,
        currentChapterIndex: -1,
        prefetchedChapter: { index: -1, content: null },
        isLoading: false,
    };

    function log(level, ...args) {
        const styles = {
            info: 'color: #0077c2; font-weight: bold;',
            success: 'color: #28a745; font-weight: bold;',
            warn: 'color: #ffc107; font-weight: bold;',
            error: 'color: #dc3545; font-weight: bold;',
            hijack: 'color: #9c27b0; font-weight: bold;'
        };
        console.log(`%c🚀 Legado-fast-page [${level.toUpperCase()}]`, styles[level] || '', ...args);
    }

    function renderContent(rawHtml) {
        const contentContainer = document.querySelector(CONFIG.CONTENT_CONTAINER_SELECTOR);
        if (!contentContainer) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');
        const newContent = doc.querySelector(CONFIG.CONTENT_CONTAINER_SELECTOR);

        if (newContent) {
            contentContainer.innerHTML = newContent.innerHTML;
            const newTitleEl = contentContainer.querySelector(CONFIG.CHAPTER_TITLE_SELECTOR);
            if (newTitleEl) document.title = newTitleEl.textContent.trim();
            log('success', `Render: 章节内容已瞬时渲染 (Index: ${state.currentChapterIndex})`);
        }
    }

    async function loadChapter(index) {
        if (index < 0 || state.isLoading) return;
        state.isLoading = true;
        log('info', `LoadChapter: 实时加载章节 (Index: ${index})...`);
        try {
            const apiUrl = `http://${window.location.host}/getBookContent?url=${state.bookBaseUrl}&index=${index}`;
            const response = await unsafeWindow.fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();

            state.currentChapterIndex = index;
            renderContent(content);
            prefetchNextChapter();
        } catch (error) {
            log('error', `LoadChapter: 加载章节 ${index} 失败:`, error);
        } finally {
            state.isLoading = false;
        }
    }

    async function prefetchNextChapter() {
        if (state.isLoading || !state.bookBaseUrl || state.currentChapterIndex < 0) return;
        state.isLoading = true;
        const nextIndex = state.currentChapterIndex + 1;
        log('info', `Prefetch: 开始预加载下一章 (Index: ${nextIndex})...`);

        try {
            const nextApiUrl = `http://${window.location.host}/getBookContent?url=${state.bookBaseUrl}&index=${nextIndex}`;
            const response = await unsafeWindow.fetch(nextApiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            state.prefetchedChapter = { index: nextIndex, content: content };
            log('success', `Prefetch: 预加载成功 (Index: ${nextIndex})`);
        } catch (error) {
            log('error', `Prefetch: 预加载章节 ${nextIndex} 失败:`, error);
            state.prefetchedChapter = { index: -1, content: null };
        } finally {
            state.isLoading = false;
        }
    }

    /**
     * 事件劫持
     */
    function setupKeyboardHijacker() {
        window.addEventListener('keydown', (event) => {
            // 只在阅读界面生效
            if (!window.location.hash.includes('chapter')) return;

            if (event.key === 'ArrowRight') {
                log('hijack', 'HIJACK: 已劫持 -> [向右翻页]');
                event.preventDefault();
                event.stopPropagation();

                const nextIndex = state.currentChapterIndex + 1;
                if (state.prefetchedChapter.index === nextIndex) {
                    log('hijack', 'CACHE HIT: 缓存命中，零延迟渲染！');
                    state.currentChapterIndex = nextIndex;
                    renderContent(state.prefetchedChapter.content);
                    state.prefetchedChapter = { index: -1, content: null }; // 清空缓存
                    prefetchNextChapter(); // 预加载下下章
                } else {
                    log('hijack', 'CACHE MISS: 缓存未命中，执行实时加载。');
                    loadChapter(nextIndex);
                }
            } else if (event.key === 'ArrowLeft') {
                log('hijack', 'HIJACK: 已劫持 -> [向左翻页]');
                event.preventDefault();
                event.stopPropagation();
                loadChapter(state.currentChapterIndex - 1);
            }
        }, true); // 使用捕获阶段确保最高优先级
        log('success', 'Hijacker: 键盘劫持器已部署。');
    }

    /**
     * 在只负责初始化
     */
    function processInitialRequest(url) {
        if (state.bookBaseUrl) return; // 已经初始化，直接返回

        if (typeof url === 'string' && url.includes('/getBookContent')) {
            try {
                const urlObj = new URL(url, window.location.origin);
                const bookUrl = urlObj.searchParams.get('url');
                const index = parseInt(urlObj.searchParams.get('index'), 10);

                if (bookUrl && !isNaN(index)) {
                    log('info', `Interceptor: 捕获到初始请求, Index: ${index}`);
                    state.bookBaseUrl = bookUrl;
                    state.currentChapterIndex = index;
                    log('success', 'State: 状态初始化成功!');
                    prefetchNextChapter();
                }
            } catch (e) { }
        }
    }

    function setupInterceptors() {
        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        unsafeWindow.XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };
        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;
        unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
            processInitialRequest(this._url);
            return originalSend.apply(this, args);
        };
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];
            processInitialRequest(url);
            return originalFetch.apply(this, args);
        };
    }

    // --- 脚本入口 ---
    log('info', '脚本已启动...');
    setupInterceptors();
    setupKeyboardHijacker(); // 无论DOM是否加载，都优先部署劫持器

    window.addEventListener('DOMContentLoaded', () => {
        let attempts = 0;
        const maxAttempts = 40;
        const checkInterval = 250;
        const initializer = setInterval(() => {
            if (document.querySelector(CONFIG.CONTENT_CONTAINER_SELECTOR)) {
                clearInterval(initializer);
                log('success', `Initializer: 正文容器已找到，就绪。`);
                return;
            }
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(initializer);
                log('error', `Initializer: 在10秒内未找到正文容器，脚本可能无法正常工作。`);
            }
        }, checkInterval);
    });
})();