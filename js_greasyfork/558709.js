// ==UserScript==
// @name         EnLight
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  英语阅读三合一：1. 双指触屏快速开启翻译 2. 智能单词高亮 3. 点击查词 (精准触控版) 4. 沉浸式双语翻译 (智能缓存+多引擎点选切换+单指左滑操作) 5. 配置导出修复。
// @author       HAL & Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      translate.googleapis.com
// @connect      translate.google.com
// @connect      edge.microsoft.com
// @connect      api-edge.cognitive.microsofttranslator.com
// @connect      dict.youdao.com
// @connect      *
// @run-at       document-idle
// @require      https://unpkg.com/compromise@13.11.4/builds/compromise.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @resource     SwalCSS https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css
// @downloadURL https://update.greasyfork.org/scripts/558709/EnLight.user.js
// @updateURL https://update.greasyfork.org/scripts/558709/EnLight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 0. 初始化 SweetAlert2 样式 & 配置管理
    // ==========================================
    
    const swalCssText = GM_getResourceText("SwalCSS");
    if (swalCssText) {
        GM_addStyle(swalCssText);
        GM_addStyle(`.swal2-container { z-index: 2147483647 !important; }`);
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    function showToast(msg, icon = 'info') {
        Toast.fire({ icon: icon, title: msg });
    }

    // 默认 API 地址
    const DEFAULT_GOOGLE_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=";
    const DEFAULT_MS_API = "https://api-edge.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans&textType=plain";

    const DEFAULT_CONFIG = {
        urls: { red: '', yellow: '', blue: '', green: '', purple: '', exclude: '' },
        listState: { red: true, yellow: true, blue: true, green: true, purple: true, exclude: true },
        style: {
            fontSizeRatio: '100',
            lineHeight: '1.6',
            color: '#333333',
            marginTop: '6px',
            theme: 'card',
            learningMode: false
        },
        behavior: {
            mode: 'blacklist',
            blacklist: [],
            whitelist: []
        },
        translation: {
            engine: 'google', // 'google' | 'microsoft'
            googleApi: DEFAULT_GOOGLE_API,
            microsoftApi: DEFAULT_MS_API
        }
    };

    function getConfig() {
        let conf = GM_getValue('highlightConfig', DEFAULT_CONFIG);
        // 深度合并防止新字段丢失
        if (!conf.style) conf.style = DEFAULT_CONFIG.style;
        if (!conf.behavior) conf.behavior = DEFAULT_CONFIG.behavior;
        if (!conf.listState) conf.listState = DEFAULT_CONFIG.listState;
        if (!conf.translation) conf.translation = DEFAULT_CONFIG.translation;
        // 补全 Microsoft API 字段 (如果是旧版本升级上来)
        if (!conf.translation.microsoftApi) conf.translation.microsoftApi = DEFAULT_MS_API;
        return conf;
    }

    function shouldRun() {
        const c = getConfig();
        const currentUrl = window.location.href;

        const matchRule = (rule, url) => {
            const r = rule.trim();
            if (!r) return false;
            if (r.includes('*')) {
                const escapeRegex = (str) => str.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
                const pattern = "^" + r.split('*').map(escapeRegex).join('.*') + "$";
                return new RegExp(pattern).test(url);
            } else {
                return url.includes(r);
            }
        };

        const checkList = (list) => {
            if (!Array.isArray(list)) return false;
            return list.some(rule => matchRule(rule, currentUrl));
        };

        if (c.behavior.mode === 'whitelist') {
            return checkList(c.behavior.whitelist);
        } else {
            if (checkList(c.behavior.blacklist)) return false;
            return true;
        }
    }

    if (!shouldRun()) {
        GM_registerMenuCommand("⚙️ EnLight 设置 (当前已禁用)", openSettings);
        return;
    }

    // ==========================================
    // 1. 核心基础库 (IndexedDB & LazyLoad)
    // ==========================================
    let nlpReady = typeof window.nlp !== 'undefined';
    let isNlpLoading = false;

    function ensureNlp() {
        if (typeof window.nlp !== 'undefined') { nlpReady = true; return Promise.resolve(); }
        if (isNlpLoading) return new Promise(resolve => {
            const check = setInterval(() => { if(nlpReady){ clearInterval(check); resolve(); } }, 100);
        });
        isNlpLoading = true;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/compromise@13.11.4/builds/compromise.min.js';
            script.onload = () => { nlpReady = true; isNlpLoading = false; resolve(); };
            script.onerror = () => { isNlpLoading = false; reject(); };
            document.head.appendChild(script);
        });
    }

    const DB_NAME = 'EnLightDB';
    const STORE_NAME = 'trans_cache';
    const dbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) { reject('IDB not supported'); return; }
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => { e.target.result.createObjectStore(STORE_NAME); };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e);
    });

    const IDB = {
        async get(key) {
            try {
                const db = await dbPromise;
                return new Promise(resolve => {
                    const tx = db.transaction(STORE_NAME, 'readonly');
                    const req = tx.objectStore(STORE_NAME).get(key);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve(null);
                });
            } catch(e) { return null; }
        },
        async set(key, val) {
            try {
                const db = await dbPromise;
                return new Promise(resolve => {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    tx.objectStore(STORE_NAME).put(val, key);
                    tx.oncomplete = () => resolve();
                });
            } catch(e) {}
        },
        async clear() {
            try {
                const db = await dbPromise;
                return new Promise(resolve => {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    tx.objectStore(STORE_NAME).clear();
                    tx.oncomplete = () => resolve();
                });
            } catch(e) {}
        }
    };

    // ==========================================
    // 2. 样式系统
    // ==========================================
    const config = getConfig();

    const THEMES = {
        card: `background-color: #f7f9fa; border-left: 3px solid #007AFF; padding: 6px 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);`,
        minimal: `background-color: transparent; border-left: none; padding: 2px 0; font-style: italic; color: #555;`,
        dashed: `background-color: #fff; border: 1px dashed #999; padding: 6px 10px; border-radius: 6px;`,
        underline: `background-color: transparent; border-bottom: 1px solid #ddd; padding: 2px 0 6px 0; margin-bottom: 8px;`,
        dark: `background-color: #2c2c2e; color: #e5e5e5 !important; border-left: 3px solid #FF9500; padding: 6px 10px; border-radius: 4px;`
    };

    const PAGE_CSS = `
        .wh-highlighted { font-weight: bold; border-radius: 3px; }
        .it-trans-block {
            all: initial;
            display: block;
            margin-top: ${config.style.marginTop};
            margin-bottom: 8px;
            line-height: ${config.style.lineHeight};
            color: ${config.style.color};
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
            width: auto; 
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: break-word;
            transition: filter 0.3s ease;
            ${THEMES[config.style.theme] || THEMES.card}
        }
        .it-trans-blur { filter: blur(6px); user-select: none; cursor: pointer; }
        .it-trans-blur:hover { filter: blur(4px); }
        .it-from-cache { border-left-color: #34C759 !important; }
        @media (prefers-color-scheme: dark) {
            .it-trans-block { color: #ccc; }
        }
        body[data-bbc-live="true"] .it-trans-block {
            clear: both; margin-top: 6px; font-size: 0.95em; width: 100% !important; flex-basis: 100% !important; box-sizing: border-box !important;
        }
        body[data-bbc-live="true"] li { flex-wrap: wrap !important; }
    `;
    GM_addStyle(PAGE_CSS);

    const POPUP_CSS = `
        :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; z-index: 2147483640; }
        #custom-dict-popup {
            position: fixed; background: #fff; border: 1px solid #eee;
            border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); padding: 15px;
            width: 290px; max-width: 85vw;
            max-height: 50vh; overflow-y: auto;
            font-size: 14px; line-height: 1.5; color: #333;
            opacity: 0; pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            transform: translateY(5px); text-align: left;
            box-sizing: border-box; touch-action: manipulation;
        }
        #custom-dict-popup.active { opacity: 1; pointer-events: auto; transform: translateY(0); }
        #custom-dict-popup::-webkit-scrollbar { width: 4px; }
        #custom-dict-popup::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

        .g-header { 
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f5f5f5;
        }
        .g-word-row { display: flex; align-items: center; gap: 8px; flex: 1; }
        .g-word { font-size: 20px; font-weight: bold; color: #111; line-height: 1.2; word-break: break-all; }
        .g-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; align-items: center; }
        .g-phonetic { color: #666; font-size: 13px; font-family: "Lucida Sans Unicode", sans-serif; background: #f0f2f5; padding: 2px 6px; border-radius: 4px; }
        
        .g-tag {
            background: #e8f0fe; color: #1967d2; padding: 1px 6px; border-radius: 4px;
            font-size: 11px; font-weight: bold; display: inline-block; line-height: 1.4;
        }
        .g-collins-stars {
            display: inline-flex; color: #f1c40f; font-size: 14px; margin-left: 2px;
            align-items: center; letter-spacing: 1px;
        }
        .g-collins-stars .inactive { color: #eee; }
        
        .g-list { margin: 0; padding: 0; list-style: none; color: #444; font-size: 14px; line-height: 1.6; }
        .g-list li { margin-bottom: 6px; display: flex; align-items: baseline; }
        .g-bullet { color: #007AFF; margin-right: 8px; font-size: 16px; line-height: 1; font-weight: bold; }
        .g-msg { color: #999; font-size: 12px; font-style: italic; }
        .cdp-play-btn { 
            cursor: pointer; color: #007AFF; background: #f0f8ff; 
            border: none; padding: 6px; border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            flex-shrink: 0; transition: background 0.2s;
        }
        .cdp-play-btn:active { background-color: #dbeafe; }
        .cdp-play-btn svg { width: 20px; height: 20px; }
        .cdp-play-btn.playing { color: #E91E63; animation: cdp-pulse 1s infinite; }
        @keyframes cdp-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    `;

    let popupRoot, popupEl;
    function createShadowPopup() {
        if (document.getElementById('wh-shadow-host')) return;
        const host = document.createElement('div');
        host.id = 'wh-shadow-host';
        host.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; pointer-events: none; z-index: 2147483640;';
        document.body.appendChild(host);
        const shadow = host.attachShadow({mode: 'open'});
        const style = document.createElement('style');
        style.textContent = POPUP_CSS;
        shadow.appendChild(style);
        popupEl = document.createElement('div');
        popupEl.id = 'custom-dict-popup';
        shadow.appendChild(popupEl);
        popupRoot = shadow;
    }

    // ==========================================
    // 3. 高亮系统
    // ==========================================
    const wordSets = { red: new Set(), yellow: new Set(), blue: new Set(), green: new Set(), purple: new Set(), exclude: new Set() };
    const COLORS = {
        red: { color: '#FF3B30', label: '红色' },
        yellow: { color: '#F5A623', label: '黄色' },
        blue: { color: '#007AFF', label: '蓝色' },
        green: { color: '#34C759', label: '绿色' },
        purple: { color: '#AF52DE', label: '紫色' },
        exclude: { color: '#666666', label: '排除列表' }
    };

    function hashText(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return 'h' + hash;
    }

    async function loadWordLists() {
        const c = getConfig();
        const promises = Object.keys(c.urls).map(key => {
            if (!c.urls[key]) return Promise.resolve();
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET", url: c.urls[key] + '?t=' + new Date().getTime(),
                    onload: (res) => {
                        if (res.status === 200) {
                            wordSets[key] = new Set(res.responseText.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(Boolean));
                        }
                        resolve();
                    }, onerror: resolve
                });
            });
        });
        await Promise.all(promises);
        startHighlighterObserver();
        setTimeout(autoCheckCacheOrHome, 1000);
    }

    function checkSet(word, lemma, colorKey) {
        const set = wordSets[colorKey];
        return set && set.size > 0 && (set.has(word.toLowerCase()) || set.has(lemma));
    }

    function getLemma(word) {
        if (!nlpReady || !window.nlp) return word.toLowerCase();
        const lower = word.toLowerCase();
        if (!window._lemmaCache) window._lemmaCache = new Map();
        if (window._lemmaCache.has(lower)) return window._lemmaCache.get(lower);

        try {
            const doc = window.nlp(lower);
            let root = null;
            root = doc.verbs().toInfinitive().text();
            if (!root) root = doc.nouns().toSingular().text();
            if (!root) { doc.compute('root'); root = doc.text('root'); }
            const result = root ? root.toLowerCase() : lower;
            window._lemmaCache.set(lower, result);
            return result;
        } catch(e) { return lower; }
    }

    function processHighlightChunk(textNodes) {
        if (textNodes.length === 0) return;
        const c = getConfig();
        const CHUNK_SIZE = 50;
        const chunk = textNodes.splice(0, CHUNK_SIZE);

        chunk.forEach(textNode => {
            const text = textNode.nodeValue;
            if (!text || !text.trim()) return;
            const parts = text.split(/([a-zA-Z]+(?:'[a-z]+)?)/g);
            if (parts.length < 2) return;
            const fragment = document.createDocumentFragment();
            let hasReplacement = false;

            parts.forEach(part => {
                if (/^[a-zA-Z]/.test(part)) {
                    const lower = part.toLowerCase();
                    const lemma = getLemma(part);
                    let color = null;
                    const isExcluded = c.listState.exclude && (wordSets.exclude.has(lower) || wordSets.exclude.has(lemma));

                    if (!isExcluded) {
                        for (let k of ['red','yellow','blue','green','purple']) {
                            if (c.listState[k] && checkSet(part, lemma, k)) {
                                color = COLORS[k].color;
                                break;
                            }
                        }
                    }
                    if (color) {
                        const span = document.createElement('span');
                        span.className = 'wh-highlighted'; span.style.color = color; span.textContent = part;
                        fragment.appendChild(span); hasReplacement = true;
                    } else fragment.appendChild(document.createTextNode(part));
                } else fragment.appendChild(document.createTextNode(part));
            });

            if (hasReplacement && textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });

        if (textNodes.length > 0) {
            if (window.requestIdleCallback) window.requestIdleCallback(() => processHighlightChunk(textNodes));
            else setTimeout(() => processHighlightChunk(textNodes), 10);
        }
    }

    function scanNode(element) {
        if (element.dataset.whProcessed || element.closest('.it-trans-block')) return;
        element.dataset.whProcessed = "true";
        const ignoreTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'CODE', 'PRE', 'SVG', 'NOSCRIPT', 'BUTTON', 'A'];
        if (ignoreTags.includes(element.tagName) || element.isContentEditable) return;
        if (element.classList.contains('bbc-live-fix')) return;

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.parentElement && !ignoreTags.includes(node.parentElement.tagName) && !node.parentElement.classList.contains('wh-highlighted')) {
                nodes.push(node);
            }
        }
        if (nodes.length > 0) {
            ensureNlp().then(() => processHighlightChunk(nodes));
        }
    }

    function startHighlighterObserver() {
        const isBBCLive = window.location.href.includes('/live/');
        if (isBBCLive) { document.body.setAttribute('data-bbc-live', 'true'); }

        const selector = 'p, li, h1, h2, h3, h4, h5, h6, td, dd, dt, blockquote, div, span, em, strong';
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => { if (e.isIntersecting) { scanNode(e.target); obs.unobserve(e.target); } });
        }, { rootMargin: '200px' });

        document.querySelectorAll(selector).forEach(el => observer.observe(el));
        new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && n.matches && n.matches(selector)) {
                observer.observe(n);
                if(isTranslationActive) scanAndTranslateSingle(n);
            }
        }))).observe(document.body, { childList: true, subtree: true });
    }

    // ==========================================
    // 4. 沉浸式翻译 (多引擎支持)
    // ==========================================
    const translationQueue = [];
    let isTranslating = false;
    let isTranslationActive = false;
    let isOnlineFetchAllowed = false; 
    let msToken = null;
    let msTokenTime = 0;

    const IGNORE_SELECTORS = [
        'nav', 'header', 'footer', '[role="contentinfo"]', 'time', 'figcaption',
        '[class*="menu"]', '[class*="nav"]', '[class*="header"]', '.navigation', '.breadcrumb', '.button', 'button',
        '.lx-c-session-header', '.lx-c-sticky-share', '[data-testid*="card-metadata"]', '[data-testid*="card-footer"]',
        '[class*="Metadata"]', '[class*="Byline"]', '[class*="Contributor"]', '[class*="Copyright"]', '[class*="ImageMessage"]'
    ];

    function togglePageTranslation() {
        if (isTranslationActive && isOnlineFetchAllowed) {
            document.querySelectorAll('.it-trans-block').forEach(el => el.remove());
            document.querySelectorAll('[data-it-translated]').forEach(el => el.removeAttribute('data-it-translated'));
            isTranslationActive = false;
            isOnlineFetchAllowed = false;
            showToast('已关闭翻译', 'info');
        } else {
            enableTranslation(true);
            showToast('全页双语翻译已开启', 'success');
        }
    }

    function enableTranslation(allowNetwork) {
        isTranslationActive = true;
        isOnlineFetchAllowed = allowNetwork;
        scanAndTranslate();
    }

    function autoCheckCacheOrHome() {
        if(isTranslationActive) return;

        if (/^https?:\/\/(www\.)?bbc\.com\/?(\?.*)?$/.test(window.location.href)) {
             console.log("EnLight: BBC Homepage detected, enabling FULL online translation.");
             enableTranslation(true);
             return;
        }

        const sampleEl = document.querySelector('h1, article p, p');
        if (sampleEl) {
            const text = sampleEl.innerText.trim();
            if(text.length > 10) {
                const hash = hashText(text);
                IDB.get(hash).then(val => {
                    if(val) {
                        console.log("EnLight: Page translation found in cache, enabling CACHE-ONLY mode.");
                        enableTranslation(false); 
                    }
                });
            }
        }
    }

    function scanAndTranslate() {
        if (!isTranslationActive) return;
        const blocks = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, div');
        blocks.forEach(block => scanAndTranslateSingle(block));
        processTranslationQueue();
    }
    
    function scanAndTranslateSingle(block, force = false) {
        if (!isTranslationActive && !force) return;
        if (block.matches(IGNORE_SELECTORS.join(',')) || block.closest(IGNORE_SELECTORS.join(','))) return;

        const isBBCLive = document.body.getAttribute('data-bbc-live') === 'true';
        if (isBBCLive) {
            if (block.tagName === 'DIV' || block.tagName === 'SPAN') return; 
            if (block.tagName === 'LI') { if (block.querySelector('p, h1, h2, h3, h4, h5, h6, div, ul, ol')) return; }
        } else {
            if (block.tagName === 'DIV') { if (block.querySelector('div, p, li, h1, h2, h3, h4, h5, h6')) return; }
            if (block.tagName === 'LI' && block.querySelector('p')) return;
        }

        if (block.hasAttribute('data-it-translated') || block.closest('.it-trans-block') || block.offsetHeight === 0) return;
        const text = block.innerText.trim();
        
        if (block.tagName === 'DIV' && text.length < 50) return;
        if (text.length < 5) return;
        if (/^\d+\s*(hrs?|hours?|mins?|minutes?|secs?|seconds?|days?|weeks?)\s+ago/i.test(text)) return;
        if (text.includes('|') && text.length < 40) return;
        if (/^(Getty Images|Reuters|AFP|EPA|AP|Anadolu|BBC|Copyright)/i.test(text)) return;
        if (text.toLowerCase().includes(' via ') && text.length < 60) return;
        if (/^(By|Reporting by|Written by)\s+/i.test(text)) return;
        if (/(correspondent|Editor|Reporter)$/i.test(text) && text.length < 40) return;
        if (/^(Share|More|Menu|Home|Search)$/i.test(text)) return;
        if ((text.match(/[a-zA-Z]/g) || []).length / text.length < 0.3) return;

        block.setAttribute('data-it-translated', 'true');
        translationQueue.push({ element: block, text: text, force: force });
        
        if(force) processTranslationQueue();
    }

    async function processTranslationQueue() {
        if (isTranslating || translationQueue.length === 0) return;
        const item = translationQueue.shift();
        if (!document.body.contains(item.element)) { processTranslationQueue(); return; }

        const textHash = hashText(item.text);
        const cached = await IDB.get(textHash);
        
        if (cached) {
            renderTranslation(item.element, cached, true);
            processTranslationQueue();
            return;
        }

        if (!isOnlineFetchAllowed && !item.force) {
            item.element.removeAttribute('data-it-translated');
            processTranslationQueue(); 
            return;
        }

        isTranslating = true;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'it-trans-block';
        loadingDiv.style.opacity = '0.6';
        loadingDiv.innerText = 'Translating...';
        try { 
            const computed = window.getComputedStyle(item.element);
            loadingDiv.style.fontSize = computed.fontSize; 
            loadingDiv.style.marginLeft = computed.paddingLeft || computed.marginLeft;
        } catch(e){}
        item.element.after(loadingDiv);

        try {
            // 根据配置选择翻译引擎
            const transResult = await dispatchTranslation(item.text);
            
            if (transResult) {
                loadingDiv.remove();
                await IDB.set(textHash, transResult);
                renderTranslation(item.element, transResult, false);
            } else { loadingDiv.remove(); item.element.removeAttribute('data-it-translated'); }
        } catch (e) { 
            console.error("Translation Error:", e);
            loadingDiv.innerText = 'Error'; 
            item.element.removeAttribute('data-it-translated'); 
        }

        setTimeout(() => { isTranslating = false; processTranslationQueue(); }, 800 + Math.random() * 500);
    }

    function renderTranslation(targetElement, translatedText, isCached) {
        if (!document.body.contains(targetElement)) return;
        if (targetElement.nextElementSibling && targetElement.nextElementSibling.classList.contains('it-trans-block')) return;
        
        const div = document.createElement('div');
        div.className = 'it-trans-block';
        if (isCached) div.classList.add('it-from-cache');
        div.innerText = translatedText;

        try {
            let styleEl = targetElement;
            if (targetElement.children.length > 0) {
                 const textChild = targetElement.querySelector('span, b, strong, em, i, font');
                 if (textChild && textChild.innerText.length > targetElement.innerText.length * 0.5) styleEl = textChild;
                 else if (targetElement.firstElementChild) styleEl = targetElement.firstElementChild;
            }

            const computed = window.getComputedStyle(styleEl);
            const originalFontSize = parseFloat(computed.fontSize);
            const ratio = parseInt(config.style.fontSizeRatio) || 100;
            const rect = targetElement.getBoundingClientRect();
            if (rect.width > 0 && rect.width < window.innerWidth * 0.95) div.style.maxWidth = `${rect.width}px`; 
            div.style.marginLeft = window.getComputedStyle(targetElement).marginLeft;
            
            if (originalFontSize) div.style.fontSize = `${originalFontSize * (ratio / 100)}px`;
            if (computed.fontWeight) div.style.fontWeight = computed.fontWeight;
            if (computed.lineHeight) div.style.lineHeight = computed.lineHeight;
            if (computed.textAlign && computed.textAlign !== 'start') div.style.textAlign = computed.textAlign;
        } catch(e) {}

        if (config.style.learningMode) {
            div.classList.add('it-trans-blur');
            div.onclick = (e) => { e.stopPropagation(); div.classList.toggle('it-trans-blur'); };
        }
        targetElement.after(div);
    }

    // --- 翻译接口分发 ---
    async function dispatchTranslation(text) {
        const c = getConfig();
        if (c.translation.engine === 'microsoft') {
            return await fetchMicrosoftTranslation(text);
        } else {
            return await fetchGoogleTranslation(text);
        }
    }

    async function fetchGoogleTranslation(text) {
        const c = getConfig();
        const apiUrl = c.translation.googleApi || DEFAULT_GOOGLE_API;
        const cleanText = text.replace(/\n/g, ' ');
        // 简单处理：如果 URL 结尾没有 =，补上
        const finalUrl = apiUrl.endsWith('=') ? `${apiUrl}${encodeURIComponent(cleanText)}` : `${apiUrl}&q=${encodeURIComponent(cleanText)}`;

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: finalUrl,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        let result = ''; if (data && data[0]) data[0].forEach(s => { if (s[0]) result += s[0]; });
                        resolve(result);
                    } catch (e) { resolve(null); }
                }, onerror: () => resolve(null)
            });
        });
    }

    async function fetchMicrosoftTranslation(text) {
        const c = getConfig();
        // 1. 获取 Token (如果过期)
        if (!msToken || Date.now() - msTokenTime > 10 * 60 * 1000) {
            try {
                msToken = await getEdgeToken();
                msTokenTime = Date.now();
            } catch (e) {
                console.error("Failed to get Edge Token", e);
                // 降级回 Google
                return fetchGoogleTranslation(text);
            }
        }

        // 2. 发送翻译请求 (使用配置的 URL)
        const msApiUrl = c.translation.microsoftApi || DEFAULT_MS_API;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: msApiUrl,
                headers: {
                    "Authorization": "Bearer " + msToken,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify([{ "Text": text }]),
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data[0] && data[0].translations && data[0].translations[0]) {
                            resolve(data[0].translations[0].text);
                        } else {
                            resolve(null);
                        }
                    } catch (e) { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    function getEdgeToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://edge.microsoft.com/translate/auth",
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0" },
                onload: (res) => {
                    if (res.status === 200) resolve(res.responseText.trim());
                    else reject(res.statusText);
                },
                onerror: (err) => reject(err)
            });
        });
    }


    // ==========================================
    // 5. 音频控制工具
    // ==========================================
    
    function stopAllTTS() {
        const dictAudio = document.getElementById('enlight-youdao-audio');
        if (dictAudio) { dictAudio.pause(); dictAudio.remove(); }
        if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
        if (popupRoot) { popupRoot.querySelectorAll('.cdp-play-btn').forEach(b => b.classList.remove('playing')); }
    }

    // ==========================================
    // 6. 查词弹窗 (精准触控修复版)
    // ==========================================
    let touchStartX = 0;
    let touchStartY = 0;
    let isScrollAction = false;

    function initPopup() {
        createShadowPopup();
        document.addEventListener('click', handleGlobalClick);
        window.addEventListener('scroll', () => { if (popupEl && popupEl.classList.contains('active')) closePopup(); }, { passive: true });
    }

    function handleGlobalClick(e) {
        if (isScrollAction) return;
        // 忽略阴影宿主、设置弹窗等
        if (e.target.id === 'wh-shadow-host' || e.composedPath().some(el => el.id === 'wh-shadow-host')) return;
        if (document.getElementById('wh-settings-modal') && document.getElementById('wh-settings-modal').contains(e.target)) return;
        if (e.target.closest('.it-trans-block')) { closePopup(); return; }
        if (e.target.closest('.swal2-container')) return;
        
        const clickResult = getWordAtPoint(e.clientX, e.clientY);
        
        if (clickResult) {
            e.stopPropagation(); e.preventDefault();
            ensureNlp();
            showPopup(clickResult.word, clickResult.rect);
        } else { 
            if (popupEl && popupEl.classList.contains('active')) {
                closePopup();
            }
        }
    }

    // 精准获取单词逻辑
    function getWordAtPoint(x, y) {
        let range, textNode;
        if (document.caretRangeFromPoint) { 
            range = document.caretRangeFromPoint(x, y); 
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(x, y);
            range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); range.collapse(true);
        }
        
        if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return null;
        
        textNode = range.startContainer;
        if (['SCRIPT','STYLE','TEXTAREA'].includes(textNode.parentNode.tagName)) return null;
        if (textNode.parentNode.closest('a, button, input')) return null;

        const text = textNode.nodeValue;
        let start = range.startOffset;
        let end = range.startOffset;

        while (start > 0 && /[a-zA-Z']/.test(text[start - 1])) start--;
        while (end < text.length && /[a-zA-Z']/.test(text[end])) end++;

        const word = text.substring(start, end).trim();
        if (!word || !/[a-zA-Z]/.test(word) || word.length > 45) return null;

        const wordRange = document.createRange();
        wordRange.setStart(textNode, start);
        wordRange.setEnd(textNode, end);
        
        const rects = wordRange.getClientRects();
        let isClickInside = false;
        const HIT_TOLERANCE = 5;

        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (x >= r.left - HIT_TOLERANCE && x <= r.right + HIT_TOLERANCE && 
                y >= r.top - HIT_TOLERANCE && y <= r.bottom + HIT_TOLERANCE) {
                isClickInside = true;
                break;
            }
        }

        if (!isClickInside) return null; 

        return { word: word, rect: wordRange.getBoundingClientRect() };
    }

    async function showPopup(word, rect) {
        if (!popupEl) return;
        
        popupEl.innerHTML = `
            <div class="g-header">
                <div class="g-word-row"><span class="g-word">${word}</span></div>
                <button class="cdp-play-btn" id="cdp-play-btn-init">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
            </div>
            <div class="g-msg">Loading...</div>
        `;

        const initBtn = popupRoot.getElementById('cdp-play-btn-init');
        if(initBtn) initBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, initBtn); };
        playAudioText(word, initBtn);
        positionPopup(rect);
        popupEl.classList.add('active');

        const dictCacheKey = 'dict_' + word.toLowerCase();
        const cachedHtml = await IDB.get(dictCacheKey);

        if (cachedHtml) {
            popupEl.innerHTML = cachedHtml;
            const newBtn = popupRoot.getElementById('cdp-play-btn-final');
            if(newBtn) newBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, newBtn); };
            positionPopup(rect);
        } else {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://dict.youdao.com/w/eng/${encodeURIComponent(word)}/`,
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
                onload: function(res) {
                    if (res.status === 200) {
                        const html = parseYoudaoHtml(res.responseText, word);
                        popupEl.innerHTML = html;
                        IDB.set(dictCacheKey, html);
                        const newBtn = popupRoot.getElementById('cdp-play-btn-final');
                        if(newBtn) newBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, newBtn); };
                        positionPopup(rect); 
                    } else { popupEl.innerHTML += `<div style="color:red;margin-top:5px;">Connection failed.</div>`; }
                },
                onerror: function() { popupEl.innerHTML += `<div style="color:red;margin-top:5px;">Network error.</div>`; }
            });
        }
    }

    function parseYoudaoHtml(html, originalWord) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        
        let phone = "";
        const phoneEl = doc.querySelector('.baav .phonetic');
        if (phoneEl) {
            const raw = phoneEl.textContent.replace(/[\[\]]/g, "");
            phone = `[${raw}]`;
        }

        let tagsHtml = "";
        const examEl = doc.querySelector('.baav .exam_type');
        if (examEl) {
            const exams = examEl.textContent.trim().split(/\s+/);
            exams.forEach(t => { if(t) tagsHtml += `<span class="g-tag">${t}</span>`; });
        }

        let starLevel = 0;
        let starEls = doc.querySelectorAll('[class*="star star"]');
        starEls.forEach(el => {
            let match = el.className.match(/star(\d)/);
            if (match) {
                let lvl = parseInt(match[1]);
                if (lvl > starLevel) starLevel = lvl;
            }
        });

        let starDisplay = "";
        if (starLevel > 0) {
            let active = '★'.repeat(starLevel);
            let inactive = '★'.repeat(5 - starLevel);
            starDisplay = `<span class="g-collins-stars" title="Collins ${starLevel} Stars">${active}<span class="inactive">${inactive}</span></span>`;
        }

        let defs = [];
        const lis = doc.querySelectorAll('#phrsListTab .trans-container ul li');
        lis.forEach(li => defs.push(li.textContent.trim()));
        if (defs.length === 0) {
            const web = doc.querySelectorAll('#tWebTrans .wt-container .title span');
            if (web.length > 0) web.forEach(s => defs.push(s.textContent.trim()));
        }
        if (defs.length === 0) {
            const wordGroups = doc.querySelectorAll('.wordGroup .contentTitle');
            wordGroups.forEach(el => defs.push(el.textContent.trim()));
        }

        const defsHtml = defs.length > 0 
            ? `<ul class="g-list">${defs.slice(0, 4).map(d => `<li><span class="g-bullet">•</span>${d}</li>`).join('')}</ul>` 
            : `<div class="g-msg">No definitions found.</div>`;

        return `
            <div class="g-header">
                <div class="g-word-row"><span class="g-word">${originalWord}</span></div>
                <button class="cdp-play-btn" id="cdp-play-btn-final">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
            </div>
            ${ (phone || tagsHtml || starDisplay) ? `<div class="g-meta">${phone ? `<span class="g-phonetic">${phone}</span>` : ''}${starDisplay}${tagsHtml}</div>` : '' }
            ${defsHtml}
        `;
    }

    function positionPopup(rect) {
        if (!popupEl) return;
        const popupWidth = 290;
        const gap = 12;
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        let left = rect.left + (rect.width / 2) - (popupWidth / 2);
        if (left < 10) left = 10;
        else if (left + popupWidth > winW - 10) left = winW - popupWidth - 10;

        let top = rect.bottom + gap;
        const popupH = popupEl.offsetHeight || 150; 
        
        if (top + popupH > winH - 10 && rect.top > popupH + 20) {
            top = rect.top - popupH - gap;
        } else {
             if (top + popupH > winH) top = winH - popupH - 10;
        }

        popupEl.style.top = `${top}px`;
        popupEl.style.left = `${left}px`;
    }

    function closePopup() {
        if (popupEl && popupEl.classList.contains('active')) {
            popupEl.classList.remove('active');
            stopAllTTS();
        }
    }

    // ==========================================
    // 7. SPA 兼容性 & 其他工具
    // ==========================================
    const _historyWrap = function(type) {
        const orig = history[type];
        return function() {
            const rv = orig.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');
    function reinit() {
        if (!shouldRun()) return;
        setTimeout(() => {
            if (isTranslationActive) scanAndTranslate();
            startHighlighterObserver();
            autoCheckCacheOrHome();
        }, 1000);
    }
    window.addEventListener('popstate', reinit);
    window.addEventListener('pushState', reinit);
    window.addEventListener('replaceState', reinit);

    function playAudioText(text, btn) {
        if(!text) return;
        stopAllTTS(); // 停止其他
        if(btn) btn.classList.add('playing');

        const ttsUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
        const audio = document.createElement('audio');
        audio.id = 'enlight-youdao-audio';
        audio.style.display = 'none';
        audio.src = ttsUrl;
        audio.onended = () => { if(btn) btn.classList.remove('playing'); };
        audio.onerror = (e) => { 
            console.warn('Youdao Audio failed, switching to local.');
            if(btn) btn.classList.remove('playing');
            if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'en-US';
                window.speechSynthesis.speak(u);
            }
        };
        document.body.appendChild(audio);
        audio.play().catch(error => { 
            if(btn) btn.classList.remove('playing');
            if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'en-US';
                window.speechSynthesis.speak(u);
            }
        });
    }

    // ==========================================
    // 8. 设置界面 (UI 更新版：点选式翻译引擎)
    // ==========================================
    function openSettings() {
        if(document.getElementById('wh-settings-modal')) { document.getElementById('wh-settings-modal').style.display='flex'; return; }
        const c = getConfig();
        const m = document.createElement('div'); m.id='wh-settings-modal';
        m.style.cssText=`display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2147483600;align-items:center;justify-content:center;font-family:sans-serif;`;

        let urlInputs = '';
        ['red','yellow','blue','green','purple','exclude'].forEach(k => {
            const isEnabled = c.listState[k];
            const color = COLORS[k].color;
            const dotStyle = `display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:8px;cursor:pointer;border:2px solid ${color};background-color:${isEnabled?color:'transparent'};vertical-align:middle;transition:background 0.2s;`;
            urlInputs += `<div style="margin-bottom:12px">
                <div style="margin-bottom:4px;display:flex;align-items:center;">
                    <span id="wh-dot-${k}" style="${dotStyle}" title="点击开启/关闭"></span>
                    <label style="font-size:12px;font-weight:bold;color:${k==='exclude'?'#666':color}">${COLORS[k].label}</label>
                </div>
                <input type="text" id="wh-input-${k}" value="${c.urls[k]||''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
            </div>`;
        });

        // 翻译引擎部分 HTML 生成
        let activeEngine = c.translation.engine; // 'google' or 'microsoft'
        const engines = [
            { id: 'google', label: 'Google Translate', color: '#4285F4', inputValue: c.translation.googleApi || DEFAULT_GOOGLE_API, desc: 'API 地址 (支持反代)' },
            { id: 'microsoft', label: 'Microsoft Translate (Edge)', color: '#00A4EF', inputValue: c.translation.microsoftApi || DEFAULT_MS_API, desc: 'API 地址 (通常无需修改)' }
        ];

        let engineInputs = '';
        engines.forEach(eng => {
            const isActive = activeEngine === eng.id;
            const dotStyle = `display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:8px;cursor:pointer;border:2px solid ${eng.color};background-color:${isActive ? eng.color : 'transparent'};vertical-align:middle;transition:background 0.2s;`;
            
            engineInputs += `<div style="margin-bottom:12px">
                <div style="margin-bottom:4px;display:flex;align-items:center;" class="wh-engine-selector" data-engine="${eng.id}">
                    <span id="wh-dot-engine-${eng.id}" style="${dotStyle}" title="点击选择"></span>
                    <label style="font-size:12px;font-weight:bold;color:#333;cursor:pointer;">${eng.label}</label>
                </div>
                <input type="text" id="wh-input-engine-${eng.id}" value="${eng.inputValue}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:12px;color:#555;" placeholder="${eng.desc}">
            </div>`;
        });


        const blacklistStr = c.behavior.blacklist.join('\n');
        const whitelistStr = c.behavior.whitelist.join('\n');

        m.innerHTML = `
        <div style="background:white;width:90%;max-width:400px;max-height:80vh;border-radius:10px;padding:20px;display:flex;flex-direction:column;position:relative;box-sizing:border-box;">
            <h3 style="margin-top:0;border-bottom:1px solid #eee;padding-bottom:10px;flex-shrink:0;">EnLight 设置</h3>
            
            <div style="overflow-y:auto;flex:1;padding-right:5px;margin-bottom:10px;overscroll-behavior:contain;">
                
                <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">🌐 翻译服务</div>
                ${engineInputs}

                <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">🛡️ 运行模式</div>
                <div style="margin-bottom:15px;">
                    <select id="wh-behavior-mode" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                        <option value="blacklist" ${c.behavior.mode==='blacklist'?'selected':''}>⚫ 黑名单模式</option>
                        <option value="whitelist" ${c.behavior.mode==='whitelist'?'selected':''}>⚪ 白名单模式</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">黑名单 (一行一个)</label>
                    <textarea id="wh-behavior-blacklist" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;resize:vertical;box-sizing:border-box;" placeholder="*.example.com/*">${blacklistStr}</textarea>
                </div>
                 <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">白名单 (一行一个)</label>
                    <textarea id="wh-behavior-whitelist" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;resize:vertical;box-sizing:border-box;" placeholder="https://www.bbc.com/*">${whitelistStr}</textarea>
                </div>
                <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">🎨 外观</div>
                <div style="margin-bottom:10px;display:flex;align-items:center;gap:10px;font-size:13px;">
                    <input type="checkbox" id="wh-style-learning" ${c.style.learningMode ? 'checked' : ''}>
                    <label for="wh-style-learning">🎓 学习模式 (译文默认模糊)</label>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">字体大小比例 (%)</label>
                    <input type="number" id="wh-style-fontSizeRatio" value="${c.style.fontSizeRatio}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                </div>
                <div style="margin-bottom:15px;">
                    <select id="wh-style-theme" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                        <option value="card" ${c.style.theme==='card'?'selected':''}>卡片 (默认)</option>
                        <option value="minimal" ${c.style.theme==='minimal'?'selected':''}>极简</option>
                        <option value="dashed" ${c.style.theme==='dashed'?'selected':''}>虚线笔记</option>
                        <option value="underline" ${c.style.theme==='underline'?'selected':''}>下划线</option>
                        <option value="dark" ${c.style.theme==='dark'?'selected':''}>暗黑高亮</option>
                    </select>
                </div>
                <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">📚 词库订阅</div>
                ${urlInputs}
                <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">⚙️ 数据管理</div>
                <div style="display:flex;gap:10px;">
                    <button id="wh-btn-export" style="flex:1;padding:8px;background:#eee;border:none;border-radius:4px;cursor:pointer;">📤 导出配置</button>
                    <button id="wh-btn-import" style="flex:1;padding:8px;background:#eee;border:none;border-radius:4px;cursor:pointer;">📥 导入配置</button>
                    <input type="file" id="wh-file-input" accept=".json" style="display:none">
                </div>
            </div>

            <div style="flex-shrink:0;padding-top:15px;border-top:1px solid #eee;display:flex;gap:10px;background:white;padding-bottom: env(safe-area-inset-bottom);">
                <button id="wh-btn-save" style="flex:2;padding:10px;background:#007AFF;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">保存</button>
                <button id="wh-btn-close" style="flex:1;padding:10px;background:#ccc;color:white;border:none;border-radius:4px;cursor:pointer;">关闭</button>
            </div>
        </div>`;

        document.body.appendChild(m);
        document.getElementById('wh-btn-close').onclick=()=>m.style.display='none';

        // 绑定翻译引擎点选逻辑 (互斥选择)
        const engineSelectors = m.querySelectorAll('.wh-engine-selector');
        engineSelectors.forEach(sel => {
            sel.onclick = () => {
                const selectedId = sel.getAttribute('data-engine');
                activeEngine = selectedId; // 更新当前选中的引擎变量

                // 重绘 UI
                engines.forEach(eng => {
                    const dot = document.getElementById(`wh-dot-engine-${eng.id}`);
                    if (eng.id === selectedId) {
                        dot.style.backgroundColor = eng.color;
                    } else {
                        dot.style.backgroundColor = 'transparent';
                    }
                });
            };
        });

        // 绑定词库订阅点选逻辑
        const tempListState = {...c.listState};
        ['red','yellow','blue','green','purple','exclude'].forEach(k => {
            const dot = document.getElementById(`wh-dot-${k}`);
            dot.onclick = () => {
                tempListState[k] = !tempListState[k];
                const color = COLORS[k].color;
                dot.style.backgroundColor = tempListState[k] ? color : 'transparent';
            };
        });

        document.getElementById('wh-btn-save').onclick=()=>{
            const n = getConfig();
            ['red','yellow','blue','green','purple','exclude'].forEach(k=>n.urls[k]=document.getElementById(`wh-input-${k}`).value.trim());
            n.style.fontSizeRatio = document.getElementById('wh-style-fontSizeRatio').value.trim() || '100';
            n.style.theme = document.getElementById('wh-style-theme').value;
            n.style.learningMode = document.getElementById('wh-style-learning').checked;
            n.behavior.mode = document.getElementById('wh-behavior-mode').value;
            n.behavior.blacklist = document.getElementById('wh-behavior-blacklist').value.split('\n').filter(s=>s.trim());
            n.behavior.whitelist = document.getElementById('wh-behavior-whitelist').value.split('\n').filter(s=>s.trim());
            
            // 保存翻译设置
            n.translation.engine = activeEngine; // 使用当前点选的 activeEngine
            n.translation.googleApi = document.getElementById('wh-input-engine-google').value.trim() || DEFAULT_GOOGLE_API;
            n.translation.microsoftApi = document.getElementById('wh-input-engine-microsoft').value.trim() || DEFAULT_MS_API;

            n.listState = tempListState;
            GM_setValue('highlightConfig',n);
            m.style.display='none';
            Swal.fire({
                title: '设置已保存',
                text: '页面即将刷新以应用更改',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => location.reload());
        };

        // 导出功能
        document.getElementById('wh-btn-export').onclick = () => {
            try {
                const curConf = getConfig();
                // 同步当前UI的值到导出对象
                curConf.translation.engine = activeEngine;
                curConf.translation.googleApi = document.getElementById('wh-input-engine-google').value.trim();
                curConf.translation.microsoftApi = document.getElementById('wh-input-engine-microsoft').value.trim();
                
                ['red','yellow','blue','green','purple','exclude'].forEach(k => {
                     curConf.urls[k] = document.getElementById(`wh-input-${k}`).value.trim();
                });

                const jsonStr = JSON.stringify(curConf, null, 2);
                const fileName = `enlight_config_${new Date().toISOString().slice(0,10)}.json`;

                if (typeof GM_download === 'function') {
                    const blob = new Blob([jsonStr], {type: "application/json"});
                    const url = URL.createObjectURL(blob);
                    GM_download({
                        url: url,
                        name: fileName,
                        saveAs: true,
                        onload: () => { 
                            showToast('配置已导出', 'success'); 
                            setTimeout(() => URL.revokeObjectURL(url), 1000); 
                        },
                        onerror: (err) => {
                            if(typeof GM_setClipboard === 'function') {
                                GM_setClipboard(jsonStr);
                                Swal.fire('下载被拦截', '配置已复制到剪贴板！', 'warning');
                            }
                        }
                    });
                } else {
                    const blob = new Blob([jsonStr], {type: "application/json"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
                    showToast('配置已导出', 'success');
                }

            } catch (e) {
                console.error(e);
                showToast('导出错误: ' + e.message, 'error');
            }
        };

        const fileInput = document.getElementById('wh-file-input');
        document.getElementById('wh-btn-import').onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if(parsed.urls && parsed.style) {
                        GM_setValue('highlightConfig', parsed);
                        Swal.fire({
                            title: '导入成功',
                            text: '页面即将刷新',
                            icon: 'success',
                            timer: 1000,
                            showConfirmButton: false
                        }).then(() => location.reload());
                    } else showToast('JSON 格式错误', 'error');
                } catch(ex) { showToast('JSON 解析失败', 'error'); }
            };
            reader.readAsText(file);
        };
    }

    // 优化的手势系统
    function initGesture() {
        let touchStartData = null;
        let singleTouchStart = null;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                touchStartData = { time: Date.now(), x1: e.touches[0].clientX, y1: e.touches[0].clientY, x2: e.touches[1].clientX, y2: e.touches[1].clientY };
            } else { 
                touchStartData = null; 
            }
            
            if (e.touches.length === 1) {
                isScrollAction = false;
                touchStartX = e.touches[0].clientX; 
                touchStartY = e.touches[0].clientY;
                singleTouchStart = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY, 
                    target: e.target, 
                    time: Date.now() 
                };
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (touchStartData) {
                const t1 = e.touches[0], t2 = e.touches[1];
                if (t1 && (Math.abs(t1.clientX - touchStartData.x1) > 20 || Math.abs(t1.clientY - touchStartData.y1) > 20)) touchStartData = null;
                if (t2 && (Math.abs(t2.clientX - touchStartData.x2) > 20 || Math.abs(t2.clientY - touchStartData.y2) > 20)) touchStartData = null;
            }

            if (e.touches.length > 0) {
                const dx = Math.abs(e.touches[0].clientX - touchStartX);
                const dy = Math.abs(e.touches[0].clientY - touchStartY);
                if (dx > 10 || dy > 10) isScrollAction = true;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (touchStartData && Date.now() - touchStartData.time < 500) {
                togglePageTranslation();
                touchStartData = null;
                return;
            }

            if (singleTouchStart && e.changedTouches.length === 1) {
                const touchEnd = e.changedTouches[0];
                const dx = touchEnd.clientX - singleTouchStart.x;
                const dy = touchEnd.clientY - singleTouchStart.y;
                const dt = Date.now() - singleTouchStart.time;

                if (dx < -80 && Math.abs(dy) < 40 && dt < 500) {
                    const targetBlock = singleTouchStart.target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote');
                    if (targetBlock) {
                        const nextEl = targetBlock.nextElementSibling;
                        if (nextEl && nextEl.classList.contains('it-trans-block')) {
                            nextEl.remove();
                            targetBlock.removeAttribute('data-it-translated');
                            showToast('已隐藏该段翻译', 'info');
                        } else {
                            scanAndTranslateSingle(targetBlock, true); 
                            showToast('正在翻译该段落...', 'info');
                        }
                    }
                }
                singleTouchStart = null;
            }
        });
    }

    GM_registerMenuCommand("🎓 开启/关闭 学习模式", () => {
        const c = getConfig();
        c.style.learningMode = !c.style.learningMode;
        GM_setValue('highlightConfig', c);
        showToast(`学习模式已${c.style.learningMode ? '开启' : '关闭'} (即将刷新)`, 'success');
        setTimeout(() => location.reload(), 1000);
    });

    GM_registerMenuCommand("⚙️ EnLight 设置", openSettings);
    
    GM_registerMenuCommand("🗑️ 清空翻译/词典缓存", () => {
        Swal.fire({
            title: '确定清空缓存?',
            text: "这将删除所有已保存的翻译和查词记录。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '是的，清空!',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                IDB.clear().then(() => {
                    Swal.fire('已清空!', '缓存数据已成功删除。', 'success');
                });
            }
        });
    });

    initPopup();
    initGesture();
    loadWordLists();
})();
