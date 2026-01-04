// ==UserScript==
// @name         Baidu & Google 双引擎同屏
// @namespace    476321082
// @version      1.2
// @description  在百度搜索结果页右侧显示谷歌搜索结果。
// @author       476321082
// @match        https://www.baidu.com/s*
// @license      MIT
// @connect      www.google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/550835/Baidu%20%20Google%20%E5%8F%8C%E5%BC%95%E6%93%8E%E5%90%8C%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550835/Baidu%20%20Google%20%E5%8F%8C%E5%BC%95%E6%93%8E%E5%90%8C%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- NEW: 配置中心 ---
    const CONFIG = {
        PERFORMANCE: {
            DEBOUNCE_DELAY: 400,
            FETCH_TIMEOUT: 15000,
            RETRY_ATTEMPTS: 2,
            RETRY_DELAY_MS: 1000,
        },
        UI: {
            MIN_PANEL_WIDTH: 300,
            WIDE_SCREEN_BREAKPOINT: 1921,
        },
        GOOGLE: {
            RESULTS_PER_PAGE: 10,
        },
        CACHE: {
            SESSION_STORAGE_KEY_PREFIX: 'BaiduGoogleDualSearchCache_'
        }
    };

    // --- 常量定义 ---
    const C = {
        GM_SETTINGS_KEY: 'BaiduGoogleDualSearchSettings',
        IDS: {
            container: 'google-results-container',
            baiduPageContainer: 'container',
            settingsModal: 'google-settings-modal',
            settingEnabled: 'setting-enabled',
            settingCount: 'setting-count',
            settingNewTab: 'setting-newtab',
            settingAutofit: 'setting-autofit',
            settingWideLeft: 'setting-wide-left',
            settingReset: 'google-settings-reset',
            settingSave: 'google-settings-save',
            baiduContent: 'content_left',
            fetchStatus: 'google-fetch-status',
        },
        CLASSES: {
            header: 'google-results-header',
            settingsIcon: 'google-settings-icon',
            content: 'google-results-content',
            resizeHandle: 'resize-handle-right',
            settingsModalContent: 'google-settings-modal-content',
            formItem: 'google-settings-form-item',
            buttons: 'google-settings-buttons',
            resultItem: 'google-result-item',
            url: 'url',
            description: 'description',
            status: 'status',
        },
        SELECTORS: {
            googleResult: 'div#rso > div > div > div',
            link: 'a[href]',
            keyword: 'em',
            title: 'h3',
        }
    };

    // --- 默认设置 ---
    const defaultSettings = {
        scriptEnabled: true,
        resultCount: 15,
        openInNewTab: true,
        autoFitHeight: false,
        panelPosition: { top: '140px', left: '58%' },
        panelPositionWide: { left: '65%' },
        panelSize: { width: '40%', height: '500px' }
    };

    let currentSettings = {};

    // --- 架构类和管理器 ---
    const state = { lastQuery: "", isLoading: false };
    class DOMCache {
        constructor() { this.cache = new Map(); }
        get(selector, parent = document) {
            const key = `${parent.id || parent.tagName}-${selector}`;
            if (!this.cache.has(key)) { this.cache.set(key, parent.querySelector(selector)); }
            return this.cache.get(key);
        }
        clear() { this.cache.clear(); console.log('[DOMCache] Cache cleared.'); }
    }
    const domCache = new DOMCache();

    class ObserverManager {
        constructor() { this.observers = []; this.eventListeners = []; }
        addObserver(observer) { this.observers.push(observer); return observer; }
        addEventListener(element, event, handler, options) {
            element.addEventListener(event, handler, options);
            this.eventListeners.push({ element, event, handler, options });
        }
        cleanup() {
            this.observers.forEach(observer => observer.disconnect());
            this.eventListeners.forEach(({ element, event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
            console.log('[ObserverManager] Cleaned up all observers and listeners.');
        }
    }
    const observerManager = new ObserverManager();

    class ErrorHandler {
        static handle(error, context) {
            console.error(`[Gemini Script Error] ${context}:`, error);
            if (error.name === 'NetworkError' || error.message.includes('NetworkError')) { return '网络连接失败，请检查网络设置或代理。'; }
            if (error.status === 429) { return 'Google 请求过于频繁，请稍后再试。'; }
            return `发生未知错误: ${error.message || '详情请查看控制台'}`;
        }
    }

    // --- NEW: 搜索结果会话缓存 ---
    const SessionCache = {
        getKey: (query) => `${CONFIG.CACHE.SESSION_STORAGE_KEY_PREFIX}${query}`,
        get: (query) => {
            try {
                const cached = sessionStorage.getItem(SessionCache.getKey(query));
                return cached ? JSON.parse(cached) : null;
            } catch (e) {
                console.error("Failed to read from session cache:", e);
                return null;
            }
        },
        set: (query, data) => {
            try {
                sessionStorage.setItem(SessionCache.getKey(query), JSON.stringify(data));
            } catch (e) {
                console.error("Failed to write to session cache:", e);
            }
        }
    };

    const regexCache = new Map();

    // --- 设置管理 ---
    function loadSettings() {
        const savedSettings = GM_getValue(C.GM_SETTINGS_KEY, {});
        currentSettings = { ...defaultSettings, ...savedSettings };
        currentSettings.panelPosition = { ...defaultSettings.panelPosition, ...(savedSettings.panelPosition || {}) };
        currentSettings.panelPositionWide = { ...defaultSettings.panelPositionWide, ...(savedSettings.panelPositionWide || {}) };
        currentSettings.panelSize = { ...defaultSettings.panelSize, ...(savedSettings.panelSize || {}) };
    }

    function saveSettings() { GM_setValue(C.GM_SETTINGS_KEY, currentSettings); }
    function debounce(func, delay) {
        let timeout;
        return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay); };
    }

    // --- 样式定义 ---
    function applyStyles() {
        GM_addStyle(`...`); // Styles are unchanged, omitting for brevity.
        GM_addStyle(`
            #${C.IDS.container} { position: absolute; top: ${currentSettings.panelPosition.top}; left: ${currentSettings.panelPosition.left}; width: ${currentSettings.panelSize.width}; min-width: ${CONFIG.UI.MIN_PANEL_WIDTH}px; min-height: 200px; background-color: #fff; border: 1px solid #e4e7ed; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); z-index: 9999; display: flex; flex-direction: column; overflow: hidden; }
            .${C.CLASSES.header} { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #ebeef5; cursor: move; background-color: #f7f7f7; user-select: none; }
            .${C.CLASSES.header} h2 { font-size: 16px; font-weight: 600; color: #303133; margin: 0; }
            .${C.CLASSES.settingsIcon} { cursor: pointer; font-size: 18px; }
            .${C.CLASSES.content} { padding: 15px; flex-grow: 1; overflow-y: auto; }
            .${C.CLASSES.resultItem} { margin-bottom: 18px; border-bottom: 1px solid #f0f2f5; padding-bottom: 15px; }
            .${C.CLASSES.resultItem}:last-child { border-bottom: none; }
            .${C.CLASSES.resultItem} a { font-size: 16px; font-weight: 500; color: #1a0dab; text-decoration: none; }
            .${C.CLASSES.resultItem} a:hover { text-decoration: underline; }
            .${C.CLASSES.resultItem} .${C.CLASSES.url} { font-size: 13px; color: #006621; padding-top: 2px; word-break: break-all; }
            .${C.CLASSES.resultItem} .${C.CLASSES.description} { font-size: 14px; color: #545454; line-height: 1.5; padding-top: 4px; }
            .${C.CLASSES.content} .${C.CLASSES.status} { color: #909399; padding: 10px; text-align: center; }
            .${C.CLASSES.resultItem} em, #${C.IDS.container} em { color: rgb(247, 49, 49) !important; font-style: normal !important; font-weight: 500 !important; background: none !important; }
            #${C.IDS.settingsModal} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 10001; display: flex; align-items: center; justify-content: center; }
            .${C.CLASSES.settingsModalContent} { background: white; padding: 20px; border-radius: 8px; width: 400px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
            .${C.CLASSES.settingsModalContent} h3 { margin-top: 0; }
            .${C.CLASSES.formItem} { margin-bottom: 15px; display: flex; align-items: center; }
            .${C.CLASSES.formItem} label { display: block; margin-bottom: 0; }
            .${C.CLASSES.formItem} input[type="number"] { width: 80px; }
            .${C.CLASSES.formItem} input[type="checkbox"] { margin-right: 10px; height: 16px; width: 16px; }
            .${C.CLASSES.buttons} { text-align: right; margin-top: 20px; }
            .${C.CLASSES.buttons} button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; }
            #${C.IDS.settingSave} { background: #409eff; color: white; }
            #${C.IDS.settingReset} { background: #f56c6c; color: white; }
            .${C.CLASSES.resizeHandle} { position: absolute; right: 0; top: 0; width: 10px; height: 100%; cursor: col-resize; z-index: 1; }
        `);
    }

    // --- UI & 交互 (No changes from V4.5) ---
    function setupUI() {
        const parentElement = document.getElementById(C.IDS.baiduPageContainer) || document.body;
        const container = document.createElement('div');
        container.id = C.IDS.container;
        parentElement.appendChild(container);

        if (parentElement.id !== C.IDS.baiduPageContainer) container.style.position = 'fixed';
        container.style.top = currentSettings.panelPosition.top;
        container.style.left = currentSettings.panelPosition.left;
        container.style.width = currentSettings.panelSize.width;
        container.style.height = currentSettings.panelSize.height;
        updatePositionByWidth();
        container.innerHTML = `...`; // Unchanged
        container.innerHTML = `
            <div class="${C.CLASSES.header}">
                <h2>Google 搜索结果</h2>
                <span class="${C.CLASSES.settingsIcon}">⚙️</span>
            </div>
            <div class="${C.CLASSES.content}"></div>
            <div class="${C.CLASSES.resizeHandle}"></div>`;

        const header = container.querySelector('.' + C.CLASSES.header);
        const settingsIcon = container.querySelector('.' + C.CLASSES.settingsIcon);
        const resizeHandle = container.querySelector('.' + C.CLASSES.resizeHandle);

        observerManager.addEventListener(settingsIcon, 'mousedown', (e) => { e.stopPropagation(); showSettingsModal(); });
        makeDraggable(container, header);
        makeResizable(container, resizeHandle);

        const debouncedSaveSettings = debounce(saveSettings, 500);
        observerManager.addObserver(new ResizeObserver(() => {
            if (document.getElementById(C.IDS.container)) {
                currentSettings.panelSize.width = container.style.width;
                if (!currentSettings.autoFitHeight) { currentSettings.panelSize.height = container.style.height; }
                debouncedSaveSettings();
            }
        })).observe(container);
        updatePanelStyle(container);
        return container;
    }

    function updatePanelStyle(container) {
        if (!container) return;
        const contentDiv = container.querySelector('.' + C.CLASSES.content);
        container.style.resize = 'none';
        if (currentSettings.autoFitHeight) {
            container.style.height = 'auto';
            if(contentDiv) contentDiv.style.overflowY = 'visible';
        } else {
            container.style.height = currentSettings.panelSize.height;
            if(contentDiv) contentDiv.style.overflowY = 'auto';
        }
    }

    function makeResizable(element, handle) {
        handle.onmousedown = function(e) {
            e.preventDefault(); e.stopPropagation();
            const initialWidth = element.offsetWidth;
            const initialX = e.clientX;
            const resizeElement = (e) => {
                const newWidth = initialWidth + (e.clientX - initialX);
                if (newWidth > CONFIG.UI.MIN_PANEL_WIDTH) { element.style.width = newWidth + 'px'; }
            };
            const stopResize = () => {
                document.removeEventListener('mousemove', resizeElement);
                document.removeEventListener('mouseup', stopResize);
            };
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', stopResize);
        };
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = function(e) {
            if (e.target.classList.contains(C.CLASSES.settingsIcon)) return;
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            requestAnimationFrame(() => {
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            });
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            currentSettings.panelPosition.top = element.style.top;
            if (window.innerWidth > CONFIG.UI.WIDE_SCREEN_BREAKPOINT) {
                currentSettings.panelPositionWide.left = element.style.left;
            } else {
                currentSettings.panelPosition.left = element.style.left;
            }
            saveSettings();
        }
    }

    function showSettingsModal() {
        let modal = document.getElementById(C.IDS.settingsModal);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = C.IDS.settingsModal;
            modal.innerHTML = `...`; // Unchanged
            modal.innerHTML = `
            <div class="${C.CLASSES.settingsModalContent}" onclick="event.stopPropagation();">
                <h3>脚本设置</h3>
                <div class="${C.CLASSES.formItem}"><label><input type="checkbox" id="${C.IDS.settingEnabled}"> 启用脚本</label></div>
                <div class="${C.CLASSES.formItem}"><label for="${C.IDS.settingCount}">搜索结果数量</label><input type="number" id="${C.IDS.settingCount}" min="1" max="50" step="1"></div>
                <div class="${C.CLASSES.formItem}"><label><input type="checkbox" id="${C.IDS.settingNewTab}"> 在新标签页中打开链接</label></div>
                <div class="${C.CLASSES.formItem}"><label><input type="checkbox" id="${C.IDS.settingAutofit}"> 自适应内容高度</label></div>
                <div class="${C.CLASSES.formItem}"><label>大屏幕横向位置 (>${CONFIG.UI.WIDE_SCREEN_BREAKPOINT}px)</label><input type="text" id="${C.IDS.settingWideLeft}" placeholder="65%"></div>
                <div class="${C.CLASSES.buttons}"><button id="${C.IDS.settingReset}">恢复默认</button><button id="${C.IDS.settingSave}">保存并关闭</button></div>
            </div>`;
            document.body.appendChild(modal);

            const hideModal = () => { modal.style.display = 'none'; };
            observerManager.addEventListener(modal, 'click', hideModal);

            observerManager.addEventListener(document.getElementById(C.IDS.settingSave), 'click', () => {
                currentSettings.scriptEnabled = document.getElementById(C.IDS.settingEnabled).checked;
                currentSettings.resultCount = parseInt(document.getElementById(C.IDS.settingCount).value, 10);
                currentSettings.openInNewTab = document.getElementById(C.IDS.settingNewTab).checked;
                currentSettings.autoFitHeight = document.getElementById(C.IDS.settingAutofit).checked;
                currentSettings.panelPositionWide.left = document.getElementById(C.IDS.settingWideLeft).value;
                saveSettings(); hideModal(); runCheck({ forceUpdate: true }); updatePositionByWidth();
            });
            observerManager.addEventListener(document.getElementById(C.IDS.settingReset), 'click', () => {
                if (confirm('确定要恢复所有默认设置吗？')) {
                    GM_setValue(C.GM_SETTINGS_KEY, defaultSettings);
                    loadSettings(); hideModal(); runCheck({ forceUpdate: true });
                }
            });
        }
        document.getElementById(C.IDS.settingEnabled).checked = currentSettings.scriptEnabled;
        document.getElementById(C.IDS.settingCount).value = currentSettings.resultCount;
        document.getElementById(C.IDS.settingNewTab).checked = currentSettings.openInNewTab;
        document.getElementById(C.IDS.settingAutofit).checked = currentSettings.autoFitHeight;
        document.getElementById(C.IDS.settingWideLeft).value = currentSettings.panelPositionWide.left;
        modal.style.display = 'flex';
    }


    // --- 关键词标红功能 (No changes from V4.5) ---
    function getBaiduKeywords() {
        const baiduResultContainer = document.getElementById(C.IDS.baiduContent);
        if (!baiduResultContainer) return [];
        const keywordElements = baiduResultContainer.querySelectorAll(C.SELECTORS.keyword);
        return Array.from(new Set(Array.from(keywordElements).map(em => em.textContent.trim()).filter(Boolean)));
    }

    function highlightKeywords(text, keywordArray) {
        if (!text || !keywordArray || keywordArray.length === 0) return text;
        const cacheKey = keywordArray.join('|');
        let regex = regexCache.get(cacheKey);
        if (!regex) {
            const regexPattern = keywordArray.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            if (!regexPattern) return text;
            regex = new RegExp(`(${regexPattern})`, 'gi');
            regexCache.set(cacheKey, regex);
        }
        return text.replace(regex, `<em>$1</em>`);
    }

    // --- 数据获取与渲染 ---
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, timeout: CONFIG.PERFORMANCE.FETCH_TIMEOUT,
                onload: resolve,
                onerror: (err) => reject(new Error('NetworkError', { cause: err })),
                ontimeout: () => reject(new Error('RequestTimeout')),
            });
        });
    }

    async function gmFetchWithRetry(url, maxRetries = CONFIG.PERFORMANCE.RETRY_ATTEMPTS) {
        for (let i = 0; i < maxRetries; i++) {
            try { return await gmFetch(url); } catch (error) {
                console.warn(`Fetch attempt ${i + 1} failed for ${url}. Retrying...`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, CONFIG.PERFORMANCE.RETRY_DELAY_MS * (i + 1)));
            }
        }
    }

    async function fetchAndDisplayGoogleResults(query) {
        if (state.isLoading) return;

        const container = document.getElementById(C.IDS.container);
        if(!container) return;
        updatePanelStyle(container);

        const contentDiv = container.querySelector('.' + C.CLASSES.content);
        if (!contentDiv) return;

        // --- NEW: Check cache first ---
        const cachedData = SessionCache.get(query);
        if (cachedData) {
            console.log(`[Cache] Hit for query: ${query}`);
            contentDiv.innerHTML = cachedData.html;
            return;
        }

        console.log(`[Cache] Miss for query: ${query}. Fetching from network.`);
        state.isLoading = true;

        contentDiv.innerHTML = '';
        const statusDiv = document.createElement('div');
        statusDiv.id = C.IDS.fetchStatus;
        statusDiv.className = C.CLASSES.status;
        statusDiv.textContent = '正在加载...';
        contentDiv.appendChild(statusDiv);

        let renderedCount = 0;
        let startIndex = 0;
        const baiduKeywords = getBaiduKeywords();
        const highlightKeywordsList = baiduKeywords.length > 0 ? baiduKeywords : query.split(' ');
        let collectedHTML = ''; // To store the generated HTML for caching

        try {
            while (renderedCount < currentSettings.resultCount) {
                statusDiv.textContent = `已获取 ${renderedCount} 条，正在加载第 ${startIndex + 1}-${startIndex + CONFIG.GOOGLE.RESULTS_PER_PAGE} 条...`;
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${CONFIG.GOOGLE.RESULTS_PER_PAGE}&start=${startIndex}`;
                const response = await gmFetchWithRetry(searchUrl);
                const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                const results = Array.from(doc.querySelectorAll(C.SELECTORS.googleResult));

                if (results.length === 0) {
                    if (renderedCount === 0) statusDiv.textContent = `未找到 Google 结果。`;
                    break;
                }

                let newResultsFoundInPage = 0;
                results.forEach(result => {
                    if (renderedCount >= currentSettings.resultCount) return;
                    const link = result.querySelector(C.SELECTORS.link);
                    const title = result.querySelector(C.SELECTORS.title);
                    if (link?.href && title) {
                        newResultsFoundInPage++;
                        if (link.getAttribute('href').startsWith('/')) { link.href = 'https://www.google.com' + link.getAttribute('href'); }

                        const descriptionContainer = Array.from(result.querySelectorAll('div')).find(d => d.innerText && d.innerText.length > 40 && !d.querySelector('div'));
                        const item = document.createElement('div');
                        item.className = C.CLASSES.resultItem;
                        const target = currentSettings.openInNewTab ? 'target="_blank"' : '';

                        const highlightedTitle = highlightKeywords(title.innerText, highlightKeywordsList);
                        const highlightedDescription = highlightKeywords(descriptionContainer?.innerText || '', highlightKeywordsList);

                        // Build item's innerHTML
                        item.innerHTML = `<a href="${link.href}" ${target} rel="noopener noreferrer">${highlightedTitle}</a><div class="${C.CLASSES.url}">${new URL(link.href).hostname}</div><div class="${C.CLASSES.description}">${highlightedDescription}</div>`;

                        // Insert into DOM
                        contentDiv.insertBefore(item, statusDiv);

                        // Append its outerHTML to our collection for caching
                        collectedHTML += item.outerHTML;

                        renderedCount++;
                    }
                });
                if (newResultsFoundInPage === 0) break;
                startIndex += CONFIG.GOOGLE.RESULTS_PER_PAGE;
            }
            statusDiv.textContent = `已加载全部 ${renderedCount} 条结果。`;
            collectedHTML += statusDiv.outerHTML; // Also cache the final status message

            // --- NEW: Set data in cache after successful fetch ---
            SessionCache.set(query, { html: collectedHTML, timestamp: Date.now() });

        } catch (error) {
            statusDiv.textContent = ErrorHandler.handle(error, 'Google Fetch');
        } finally {
            state.isLoading = false;
        }
    }

    // --- 主逻辑与监听 ---
    function getQuery() { return new URLSearchParams(window.location.search).get('wd'); }

    function runCheck(options = {}) {
        loadSettings();
        const query = getQuery();

        let mainContainer = document.getElementById(C.IDS.container);
        if (!mainContainer) {
            domCache.clear();
            mainContainer = setupUI();
        }

        if (!query || !currentSettings.scriptEnabled) {
            mainContainer.style.display = 'none';
            return;
        }
        mainContainer.style.display = 'flex';
        applyStyles();

        if (query !== state.lastQuery || options.forceUpdate) {
            state.lastQuery = query;
            fetchAndDisplayGoogleResults(query);
        }
    }

    function updatePositionByWidth() {
        const container = document.getElementById(C.IDS.container);
        if (!container) return;
        container.style.left = window.innerWidth > CONFIG.UI.WIDE_SCREEN_BREAKPOINT ? currentSettings.panelPositionWide.left : currentSettings.panelPosition.left;
    }

    // --- Entry Point ---
    runCheck();
    const debouncedRunCheck = debounce(runCheck, CONFIG.PERFORMANCE.DEBOUNCE_DELAY);

    const observer = observerManager.addObserver(new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.id === C.IDS.baiduContent || node.querySelector('#' + C.IDS.baiduContent))) {
                        debouncedRunCheck();
                        return;
                    }
                }
            }
        }
    }));
    observer.observe(document.body, { childList: true, subtree: true });

    const debouncedUpdatePosition = debounce(updatePositionByWidth, 200);
    setTimeout(updatePositionByWidth, 500);
    observerManager.addEventListener(window, 'resize', debouncedUpdatePosition);
    observerManager.addEventListener(window, 'beforeunload', () => observerManager.cleanup());

})();