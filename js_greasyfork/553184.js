// ==UserScript==
// @name         智能链接工具
// @namespace    http://tampermonkey.net/
// @version      6.2.3
// @description  多功能浮动按钮工具：打开App + 复制链接 + 可视化搜索 + 阅读列表 + 链接净化，支持拖动和全局位置记忆
// @author       YourName
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/553184/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553184/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 本地预览环境下的 GM_* API 兼容桩
    (function ensureGMStubs() {
        const mem = (window.__GM_STORE__ = window.__GM_STORE__ || {});
        const prefix = 'smart-link-tool:';

        if (typeof window.GM_getValue === 'undefined') {
            window.GM_getValue = function(key, defVal = undefined) {
                try {
                    const raw = localStorage.getItem(prefix + key);
                    return raw ? JSON.parse(raw) : defVal;
                } catch (_) {
                    return key in mem ? mem[key] : defVal;
                }
            };
        }
        if (typeof window.GM_setValue === 'undefined') {
            window.GM_setValue = function(key, val) {
                try {
                    localStorage.setItem(prefix + key, JSON.stringify(val));
                } catch (_) {
                    mem[key] = val;
                }
            };
        }
        if (typeof window.GM_addStyle === 'undefined') {
            window.GM_addStyle = function(css) {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                return style;
            };
        }
        if (typeof window.GM_openInTab === 'undefined') {
            window.GM_openInTab = function(url, opts) {
                const w = window.open(url, (opts && opts.active === false) ? '_blank' : '_blank');
                return w;
            };
        }
        if (typeof window.GM_registerMenuCommand === 'undefined') {
            window.GM_registerMenuCommand = function(caption, onClick) {
                // 简易降级：仅记录日志
                console.log('[GM_menu]', caption);
                // 可选：在本地预览时通过键盘触发
                return caption;
            };
        }
        if (typeof window.GM_notification === 'undefined') {
            window.GM_notification = function(text) {
                try {
                    if (window.Notification && Notification.permission === 'granted') {
                        new Notification(String(text));
                    } else {
                        console.log('[GM_notification]', text);
                    }
                } catch (_) {
                    console.log('[GM_notification]', text);
                }
            };
        }
        if (typeof window.GM_download === 'undefined') {
            window.GM_download = function(details) {
                try {
                    const url = typeof details === 'string' ? details : details.url;
                    const name = (details && details.name) || 'download';
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } catch (e) {
                    console.warn('GM_download fallback failed', e);
                }
            };
        }
        if (typeof window.GM_xmlhttpRequest === 'undefined') {
            window.GM_xmlhttpRequest = function(details) {
                try {
                    const method = details.method || 'GET';
                    const url = details.url;
                    const headers = details.headers || {};
                    const body = details.data;
                    fetch(url, { method, headers, body, mode: 'cors', credentials: 'omit' })
                        .then(async (res) => {
                        const text = await res.text().catch(()=> '');
                        details.onload && details.onload({
                            status: res.status,
                            responseText: text,
                            finalUrl: res.url
                        });
                    })
                        .catch((err) => {
                        details.onerror && details.onerror(err);
                    });
                } catch (e) {
                    details.onerror && details.onerror(e);
                }
            };
        }
    })();

    // 检查是否已经存在按钮，防止重复注入
    if (document.getElementById('app-open-button') || document.getElementById('copy-link-button') ||
        document.getElementById('visual-search-button') || document.getElementById('combined-button') ||
        document.getElementById('reading-list-button') || document.getElementById('clean-url-button')) {
        return;
    }

    function openTabBackground(url) {
        try {
            if (typeof GM !== 'undefined' && GM && typeof GM.openInTab === 'function') {
                return GM.openInTab(url, { active: false, insert: true, setParent: true });
            }
            if (typeof GM_openInTab === 'function') {
                try { return GM_openInTab(url, { active: false, insert: true, setParent: true }); } catch (_) {}
                try { return GM_openInTab(url, false); } catch (_) {}
            }
            if (typeof window !== 'undefined' && typeof window.GM_openInTab === 'function') {
                try { return window.GM_openInTab(url, { active: false, insert: true, setParent: true }); } catch (_) {}
                try { return window.GM_openInTab(url, false); } catch (_) {}
            }
        } catch (_) {}
        try {
            return window.open(url, '_blank');
        } catch (_) {
            try {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (_) {}
        }
        return null;
    }

    // ================================
    // 配置部分
    // ================================

    const defaultConfig = {
        // 智能重定向剥离与链接规范
        smartRedirect: {
            enabled: true,
            rewriteOnLoad: true,
            // 常见外链跳转域与路径匹配
            // 在 defaultConfig.smartRedirect.patterns 中添加/替换以下规则
            patterns: [
                { host: /(^|\.)google\./i, path: /^\/url$/i, params: ['url', 'q'] },
                { host: /^link\.zhihu\.com$/i, path: /^\/?$/i, params: ['target'] },
                { host: /(^|\.)weibo\.(com|cn)$/i, path: /sinaurl/i, params: ['u', 'url'] },
                { host: /^weixin110\.qq\.com$/i, path: /redirect/i, params: ['u', 'url'] },
                { host: /^mp\.weixin\.qq\.com$/i, path: /\/mp\/wapredirect/i, params: ['url'] },
                // 🆕 新增常见技术社区与平台
                { host: /^link\.csdn\.net$/i, path: /^\/?$/i, params: ['target'] },
                { host: /^www\.jianshu\.com$/i, path: /^\/go-wild$/i, params: ['url'] },
                { host: /^steamcommunity\.com$/i, path: /^\/linkfilter\/?$/i, params: ['url', 'u'] },
                { host: /^www\.youtube\.com$/i, path: /^\/redirect$/i, params: ['q'] },
                { host: /^mail\.qq\.com$/i, path: /^\/cgi-bin\/readtemplate$/i, params: ['gourl'] },
                { host: /^c\.pc\.qq\.com$/i, path: /^\/(middle|ios)\.html$/i, params: ['pfurl'] },
                { host: /gitee\.com$/i, path: /^\/link$/i, params: ['target'] }
            ],
            // 泛用参数名
            genericParamKeys: ['url','u','target','dest','destination','redirect','to','q','r']
        },
        urlScheme: 'teak-http://',
        domainUrlSchemes: {
            // 示例：'example.com': 'myapp://'
        },
        useGlobalScheme: false,
        buttonSize: 28,
        domainPatterns: {},
        searchEngines: {
            'google': {
                name: 'Google',
                webUrl: 'https://www.google.com/search?q={key}',
                appUrl: 'google://search?q={key}',
                icon: '🔍'
            },
            'baidu': {
                name: '百度',
                webUrl: 'https://www.baidu.com/s?wd={key}',
                appUrl: 'baidu://search?wd={key}',
                icon: '🔎'
            },
            'bing': {
                name: 'Bing',
                webUrl: 'https://www.bing.com/search?q={key}',
                appUrl: 'bing://search?q={key}',
                icon: '🌐'
            }
        },
        buttonVisibility: {
            'app-open-button': true,
            'copy-link-button': true,
            'visual-search-button': true,
            'reading-list-button': true,
            'clean-url-button': true,
            'config-button': true,
            'batch-links-button': false,
            'batch-paste-button': false,
            'batch-tools-button': false,
            'html2md-button': false,
            'combined-button': true,
            'reading-list-panel-button': false,
            'input-search-button': false,
            'element-hider-button': false,
            'auto-scroll-button': false,
            'scroll-top-button': false,
            'scroll-bottom-button': false,
            'element-selector-button': false,
            'github-upload-button': false
        },

        // 🆕 组合菜单项显示控制（仅影响组合模式的展开菜单）
        combinedMenuVisibility: {
            'scroll-top-item': true,
            'scroll-bottom-item': true,
            'auto-scroll-item': true
        },

        //链接分类功能
        searchConfigs: {
            'default': {
                name: '默认配置',
                engines: ['google'],
                description: '单搜索引擎搜索',
                category: 'search', //配置类型 - search: 搜索, link: 链接
                quickLinks: [] //快捷链接列表
            }
        },

        displayMode: 'combined', // 默认改为组合模式
        defaultSearchEngine: 'google',
        searchMode: 'web', // 'web' 或 'app'
        // 新功能配置
        visualSearchMode: 'single',
        enableDirectSearch: false, // 可视化选择后是否直接搜索
        readingList: [], // 稍后阅读列表
        urlTrackingParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'source', 'schemacallback', 'schemecallback'], // 需要移除的跟踪参数
        // URL净化配置
        autoCleanUrl: false, // 是否自动净化URL
        autoCleanDomains: ['all'], // 默认对所有域名启用自动净化，可以设置为特定域名列表
        // 快捷键配置
        hotkeys: {
            'app-open': '', // 用App打开快捷键
            'copy-link': '', // 复制链接快捷键
            'visual-search': '', // 可视化搜索快捷键
            'reading-list': '', // 添加到阅读列表快捷键
            'clean-url': '', // 链接净化快捷键
            'config-panel': '', // 打开配置面板快捷键
            'search-panel': '', // 打开搜索面板快捷键
            'reading-list-panel': '', // 打开阅读列表面板快捷键
            'direct-search-panel': '', // 直接打开搜索面板快捷键
            'clipboard-search': '', // 搜索剪贴板内容快捷键
            'batch-open-links': '', //  批量打开链接（框选）
            'batch-paste-links': '', //批量粘贴链接
            'batch-tools-panel': '', // 批量工具面板
            'toggle-all-buttons': '',// 隐藏/显示所有按钮
            'toggle-display-mode': '', // 切换显示模式
            'element-hider': '', // 元素隐藏面板
            'html2md': '', // 区域转Markdown快捷键
            'scroll-top': '', // 回到顶部
            'scroll-bottom': '', // 滚动到底部
            'auto-scroll-toggle': '', // 切换自动滚动
            'input-search': 'Ctrl+Shift+I', // 输入搜索快捷键
            'element-selector': '' // 元素选择器
        },
        // 自定义样式配置
        customStyle: {
            enabled: false,
            primaryColor: '#ff6b9d',
            secondaryColor: '#ff8fab',
            backgroundColor: 'white',
            textColor: '#2d3748',
            shadowColor: '#ff6b9d',
            shadowIntensity: 0.01,
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            buttonSize: 28
        },
        githubUploader: {
            token: '',
            username: '',
            repo: '',
            branch: 'main',
            folder: 'images',
            customDomain: '',
            theme: 'crystal' // 默认皮肤
        },

        // 在最后添加这三行：
        lastExportTime: null,
        exportVersion: '1.0',
        importExportEnabled: true,

        // 阅读列表分类
        readingListCategories: ['未分类'],
        requireCategoryOnAdd: false,
        defaultReadingCategory: '未分类',

        // UI增强开关
        hoverPreviewEnabled: true,
        selectionSearchEnabled: true,

        // 预览与二维码面板的“后台打开”按钮显隐
        previewShowBgOpenButton: true,
        qrPanelShowBgOpenButton: true,

        // 批量打开默认速率（每秒）
        batchOpenRate: 5,

        autoScroll: {
            enabled: false,
            speed: 300,
            direction: 'down',
            stopAtBoundary: true,
            pauseOnInteraction: true,
            iosScrollMode: 'infinite',  // 'infinite' | 'times'
            iosScrollTimes: 5,           // iOS 滚动次数（仅当 iosScrollMode 为 'times' 时生效）
            iosSpeed: 300,
            iosChunkSize: 200
        }
    };


    // 工具函数：HTML转义，防止XSS
    function escapeHTML(str) {
        if (!str && str !== 0) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    let config = { ...defaultConfig };
    try {
        const savedConfig = GM_getValue('comicButtonConfig');
        if (savedConfig) {
            config = { ...defaultConfig, ...savedConfig };
            if (!config.domainPatterns) config.domainPatterns = {};
            if (!config.searchEngines) config.searchEngines = defaultConfig.searchEngines;
            if (!config.buttonVisibility) config.buttonVisibility = { ...defaultConfig.buttonVisibility };
            if (!config.combinedMenuVisibility) config.combinedMenuVisibility = { ...defaultConfig.combinedMenuVisibility };
            if (!config.displayMode) config.displayMode = 'combined';
            if (!config.defaultSearchEngine) config.defaultSearchEngine = 'google';
            if (!config.searchMode) config.searchMode = 'web';
            // 新配置项初始化
            if (typeof config.enableDirectSearch === 'undefined') config.enableDirectSearch = false;
            if (!config.readingList) config.readingList = [];
            if (!config.urlTrackingParams) config.urlTrackingParams = defaultConfig.urlTrackingParams;
            if (typeof config.autoCleanUrl === 'undefined') config.autoCleanUrl = false;
            if (!config.autoCleanDomains) config.autoCleanDomains = ['all'];
            if (!config.hotkeys) config.hotkeys = defaultConfig.hotkeys;
            if (!config.customStyle) config.customStyle = defaultConfig.customStyle;
            if (typeof config.visualSearchMode === 'undefined') {config.visualSearchMode = 'single'}
            // 新增：界面显隐相关默认值
            if (typeof config.previewShowBgOpenButton === 'undefined') config.previewShowBgOpenButton = true;
            if (typeof config.qrPanelShowBgOpenButton === 'undefined') config.qrPanelShowBgOpenButton = true;
            if (!config.autoScroll) config.autoScroll = { ...defaultConfig.autoScroll };
            if (typeof config.buttonVisibility['auto-scroll-button'] === 'undefined') config.buttonVisibility['auto-scroll-button'] = true;
            if (typeof config.combinedMenuVisibility['auto-scroll-item'] === 'undefined') config.combinedMenuVisibility['auto-scroll-item'] = true;
            if (typeof config.hotkeys['auto-scroll-toggle'] === 'undefined') config.hotkeys['auto-scroll-toggle'] = '';
        }
        if (config.customStyle && config.customStyle.enabled && config.customStyle.buttonSize) {
            config.buttonSize = config.customStyle.buttonSize;
        }
    } catch (err) {
        console.warn('加载配置失败:', err);
    }

    const currentDomain = window.location.hostname;

    // ================================
    // 智能重定向剥离
    // ================================
    function isOurElement(el) {
        if (!el) return false;
        if (el.id && (el.id.endsWith('-button') || el.id === 'combined-button')) return true;
        return !!(el.closest && (el.closest('.floating-panel') || el.closest('.button-group-expanded')));
    }

    function tryParseURL(href) {
        try { return new URL(href, location.href); } catch (_) { return null; }
    }

    function decodeMaybe(str) {
        try { return decodeURIComponent(str); } catch (_) { return str; }
    }

    function stripTrackingParams(u) {
        try {
            const url = new URL(u, location.href);
            const keys = Array.isArray(config.urlTrackingParams) ? config.urlTrackingParams : [];
            keys.forEach(k => url.searchParams.delete(k));
            return url.toString();
        } catch (_) { return u; }
    }

    function unwrapRedirectUrl(raw) {
        if (!raw) return raw;
        const url = tryParseURL(raw);
        if (!url) return raw;

        const host = url.hostname;
        const path = url.pathname;

        // 针对已知模式
        for (const rule of (config.smartRedirect?.patterns || [])) {
            if (rule.host.test(host) && rule.path.test(path)) {
                for (const p of (rule.params || [])) {
                    const val = url.searchParams.get(p);
                    if (val && /^https?:/i.test(val)) {
                        return stripTrackingParams(decodeMaybe(val));
                    }
                }
                // 特例：t.cn 等短链无法展开，维持原样
            }
        }

        // 泛用参数名兜底
        for (const key of (config.smartRedirect?.genericParamKeys || [])) {
            const val = url.searchParams.get(key);
            if (val && /^https?:/i.test(val)) {
                return stripTrackingParams(decodeMaybe(val));
            }
        }

        // 一些站点把跳转目标放在 hash 中
        if (url.hash) {
            try {
                const h = new URLSearchParams(url.hash.replace(/^#/, ''));
                for (const key of (config.smartRedirect?.genericParamKeys || [])) {
                    const val = h.get(key);
                    if (val && /^https?:/i.test(val)) {
                        return stripTrackingParams(decodeMaybe(val));
                    }
                }
            } catch (_) {}
        }

        return stripTrackingParams(raw);
    }

    function rewriteAnchorHref(a) {
        try {
            if (!a || !a.href) return;
            if (isOurElement(a)) return;
            const before = a.href;
            const after = unwrapRedirectUrl(before);
            if (after && after !== before) {
                a.href = after;
                if (!a.rel || !/noopener|noreferrer/i.test(a.rel)) {
                    a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener noreferrer';
                }
            }
        } catch (_) {}
    }

    function rewriteLinksIn(root) {
        if (!config.smartRedirect?.enabled) return;
        const scope = root || document;
        scope.querySelectorAll('a[href]')?.forEach(rewriteAnchorHref);
    }

    function onAnchorClickIntercept(e) {
        if (!config.smartRedirect?.enabled) return;
        const a = e.target?.closest && e.target.closest('a[href]');
        if (!a || isOurElement(a)) return;
        const before = a.href;
        const after = unwrapRedirectUrl(before);
        if (after && after !== before) {
            // 直接替换让默认点击流程继续，减少干扰
            a.href = after;
            if (!a.rel || !/noopener|noreferrer/i.test(a.rel)) {
                a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener noreferrer';
            }
        }
    }

    // 初始改写与事件绑定
    if (config.smartRedirect?.enabled) {
        if (config.smartRedirect?.rewriteOnLoad) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => rewriteLinksIn(document));
            } else {
                rewriteLinksIn(document);
            }
        }
        document.addEventListener('click', onAnchorClickIntercept, true);
        // 处理动态内容
        const mo = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === 'childList') {
                    m.addedNodes?.forEach(node => {
                        if (node && node.nodeType === 1) rewriteLinksIn(node);
                    });
                } else if (m.type === 'attributes' && m.target?.nodeName === 'A' && m.attributeName === 'href') {
                    rewriteAnchorHref(m.target);
                }
            }
        });
        try { mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] }); } catch (_) {}
    }

    // ================================
    // 悬浮预览卡片 + 二维码
    // ================================
    // 追加所需样式（独立于 globalStyles，避免冲突）
    GM_addStyle(`
      .link-preview-card{position:fixed;z-index:100002;background:#fff;border:1px solid rgba(0,0,0,.08);box-shadow:0 8px 30px rgba(0,0,0,.12);border-radius:10px;min-width:400px;max-width:420px;padding:10px 12px;user-select:none}
      .link-preview-head{display:flex;align-items:center;gap:8px;margin-bottom:6px}
      .link-preview-fav{width:16px;height:16px;border-radius:2px;flex:0 0 auto}
      .link-preview-domain{font-size:12px;color:#4a5568;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .link-preview-secure{font-size:12px;margin-left:auto}
      .link-preview-title{font-weight:600;color:#1a202c;font-size:14px;line-height:1.35;max-height:2.7em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
      .link-preview-desc{font-size:12px;color:#718096;margin-top:4px;line-height:1.4;max-height:2.8em;overflow:hidden}
      .link-preview-actions{display:flex;gap:8px;margin-top:10px}
      .link-preview-actions .btn{flex:1 1 0; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
    `);

    let __linkPreviewEl = null;
    let __linkPreviewAnchor = null;
    let __linkPreviewTimer = null;
    let __linkPreviewHideTimer = null;

    function ensureLinkPreviewEl() {
        if (__linkPreviewEl) return __linkPreviewEl;
        const el = document.createElement('div');
        el.className = 'link-preview-card';
        el.style.display = 'none';
        const bgBtnHtml = config.previewShowBgOpenButton ? `<button class="btn" data-act="open-bg">后台打开</button>` : '';
        el.innerHTML = `
          <div class="link-preview-head">
            <img class="link-preview-fav" alt=""/>
            <div class="link-preview-domain"></div>
            <div class="link-preview-secure" title="连接安全性"> </div>
          </div>
          <div class="link-preview-title"></div>
          <div class="link-preview-desc"></div>
          <div class="link-preview-actions btn-group equal">
            <button class="btn btn-primary" data-act="open">打开</button>
            ${bgBtnHtml}
            <button class="btn" data-act="copy">复制</button>
            <button class="btn" data-act="qr">二维码</button>
          </div>
        `;
        document.body.appendChild(el);

        el.addEventListener('mouseenter', () => { if (__linkPreviewHideTimer) { clearTimeout(__linkPreviewHideTimer); __linkPreviewHideTimer = null; } });
        el.addEventListener('mouseleave', () => scheduleHideLinkPreview());
        el.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-act]');
            if (!btn) return;
            const act = btn.getAttribute('data-act');
            const url = __linkPreviewAnchor?.href;
            if (!url) return;
            if (act === 'open') {
                try { window.open(url, '_blank'); } catch (_) {}
            } else if (act === 'open-bg') {
                try {
                    if (typeof GM_openInTab === 'function') {
                        GM_openInTab(url, { active: false, insert: true, setParent: true });
                    } else {
                        window.open(url, '_blank');
                    }
                    showNotification('🧭 已后台打开链接');
                } catch (e) {
                    console.error('后台打开失败:', e);
                    showNotification('❌ 后台打开失败');
                }
            } else if (act === 'copy') {
                copyText(url); showNotification('已复制链接');
            } else if (act === 'qr') {
                showQRCodePanel(url);
            }
        });
        __linkPreviewEl = el;
        return el;
    }

    function setLinkPreviewContent(a) {
        const el = ensureLinkPreviewEl();
        const url = tryParseURL(a.href);
        const domain = url ? url.hostname : '';
        const fav = el.querySelector('.link-preview-fav');
        const dom = el.querySelector('.link-preview-domain');
        const sec = el.querySelector('.link-preview-secure');
        const title = el.querySelector('.link-preview-title');
        const desc = el.querySelector('.link-preview-desc');

        if (fav) fav.src = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : '';
        if (dom) dom.textContent = domain || a.getAttribute('href') || '';
        if (sec) sec.textContent = url?.protocol === 'https:' ? '🔒' : '⚠️';

        const aTitle = (a.getAttribute('title') || '').trim();
        const aText = (a.textContent || '').trim().replace(/\s+/g,' ');
        title.textContent = aTitle || aText || (url ? (url.pathname + url.search) : '链接');

        const aria = (a.getAttribute('aria-label') || '').trim();
        const dataDesc = (a.getAttribute('data-desc') || '').trim();
        const path = url ? (url.pathname || '') : '';
        const shortPath = path.length > 1 ? decodeURIComponent(path).slice(1, 120) : '';
        desc.textContent = dataDesc || aria || shortPath || '';
    }

    function placeLinkPreviewNearAnchor(a) {
        const el = ensureLinkPreviewEl();
        const rect = a.getBoundingClientRect();
        const pad = 8;
        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + pad;
        // 右侧溢出处理
        const maxLeft = window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 10;
        if (left > maxLeft) left = Math.max(10 + window.scrollX, maxLeft);
        // 底部溢出则放到上方
        const maxTop = window.scrollY + document.documentElement.clientHeight - el.offsetHeight - 10;
        if (top > maxTop) top = rect.top + window.scrollY - el.offsetHeight - pad;
        el.style.left = Math.max(10 + window.scrollX, left) + 'px';
        el.style.top = Math.max(10 + window.scrollY, top) + 'px';
    }

    function showLinkPreviewForAnchor(a) {
        if (!config.hoverPreviewEnabled) return;
        if (!a || isOurElement(a)) return;
        __linkPreviewAnchor = a;
        const el = ensureLinkPreviewEl();
        setLinkPreviewContent(a);
        el.style.display = 'block';
        // 先显示后定位一次（需要尺寸）
        placeLinkPreviewNearAnchor(a);
    }

    function hideLinkPreview() {
        const el = ensureLinkPreviewEl();
        el.style.display = 'none';
        __linkPreviewAnchor = null;
    }

    function scheduleHideLinkPreview() {
        if (__linkPreviewHideTimer) clearTimeout(__linkPreviewHideTimer);
        __linkPreviewHideTimer = setTimeout(() => hideLinkPreview(), 180);
    }

    function bindHoverPreview() {
        let lastAnchor = null;
        document.addEventListener('mouseover', (e) => {
            if (!config.hoverPreviewEnabled) return;
            const a = e.target?.closest && e.target.closest('a[href]');
            if (!a || isOurElement(a)) return;
            if (lastAnchor === a) return;
            lastAnchor = a;
            if (__linkPreviewTimer) clearTimeout(__linkPreviewTimer);
            __linkPreviewTimer = setTimeout(() => showLinkPreviewForAnchor(a), 180);
        }, true);

        document.addEventListener('mouseout', (e) => {
            const to = e.relatedTarget;
            const el = ensureLinkPreviewEl();
            if (el.contains(to)) return; // 移到卡片上
            const fromA = e.target?.closest && e.target.closest('a[href]');
            if (fromA && !isOurElement(fromA)) {
                scheduleHideLinkPreview();
            }
        }, true);

        window.addEventListener('scroll', () => hideLinkPreview(), { passive: true });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideLinkPreview(); });
    }

    bindHoverPreview();

    // 二维码面板（支持当前页或传入链接）
    function showQRCodePanel(url) {
        const safeUrl = (url || location.href).trim();
        const api = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(safeUrl)}`;
        const panel = createPanel('二维码', `
          <div class="panel-content">
            <div class="section-title">目标链接</div>
            <div class="input-group">
              <input id="qr-input-url" class="form-input" value="${safeUrl.replace(/"/g,'&quot;')}" />
            </div>
            <div class="section-title">预览</div>
            <div style="display:flex;justify-content:center;align-items:center;padding:10px;">
              <img id="qr-image" src="${api}" alt="QR" style="width:240px;height:240px;border-radius:8px;border:1px solid #eee;background:#fff"/>
            </div>
            <div class="btn-group equal">
              <button class="btn btn-primary" id="qr-refresh">更新二维码</button>
              ${config.qrPanelShowBgOpenButton ? '<button class="btn" id="qr-open-bg">后台打开</button>' : ''}
              <button class="btn" id="qr-download">下载 PNG</button>
              <button class="btn" id="qr-close">关闭</button>
            </div>
          </div>
        `);
        document.body.appendChild(panel);
        const input = panel.querySelector('#qr-input-url');
        const img = panel.querySelector('#qr-image');
        panel.querySelector('#qr-refresh').addEventListener('click', () => {
            const u = (input.value || '').trim();
            if (!u) return;
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(u)}`;
        });
        panel.querySelector('#qr-download').addEventListener('click', () => {
            const u = (input.value || '').trim() || safeUrl;
            const a = document.createElement('a');
            a.href = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(u)}`;
            a.download = 'qr.png';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
        const openBgBtn = panel.querySelector('#qr-open-bg');
        if (openBgBtn) {
            openBgBtn.addEventListener('click', () => {
                const u = (input.value || '').trim() || safeUrl;
                try {
                    if (typeof GM_openInTab === 'function') {
                        GM_openInTab(u, { active: false, insert: true, setParent: true });
                    } else {
                        window.open(u, '_blank');
                    }
                    showNotification('🧭 已后台打开链接');
                } catch (e) {
                    console.error('二维码-后台打开失败:', e);
                    showNotification('❌ 后台打开失败');
                }
            });
        }
        panel.querySelector('#qr-close').addEventListener('click', () => panel.remove());
    }


    // 🆕 新增：切换显示模式
    function toggleDisplayMode() {
        const newMode = config.displayMode === 'combined' ? 'separate' : 'combined';

        // 切换模式
        config.displayMode = newMode;

        // 重新初始化按钮
        removeAllButtons();
        
        // 延迟初始化以确保DOM已清理
        setTimeout(() => {
            initializeButtons();
            
            // 额外验证：确保不可见的按钮确实被隐藏
            if (config.displayMode === 'separate') {
                Object.entries(config.buttonVisibility).forEach(([buttonId, isVisible]) => {
                    const btn = document.getElementById(buttonId);
                    if (btn && isVisible === false) {
                        btn.style.display = 'none !important';
                    }
                });
            }
        }, 50);

        // 显示通知
        const modeName = newMode === 'combined' ? '组合模式' : '分离模式';
        showNotification(`🔄 已切换到${modeName}`);

        // 保存配置
        saveConfig();
    }
    // 🆕 修改：增强版链接预览内容设置（包含直链透视）
    function setLinkPreviewContent(a) {
        const el = ensureLinkPreviewEl();
        const rawUrl = a.getAttribute('href');

        // 1. 获取原始 URL 对象
        let url = tryParseURL(a.href);

        // 2. 尝试计算直链（透视）
        const cleanUrl = unwrapRedirectUrl(a.href);
        const isRedirected = cleanUrl !== a.href;

        // 如果透视后的链接不同，使用透视后的链接作为显示对象
        if (isRedirected) {
            url = tryParseURL(cleanUrl);
        }

        const domain = url ? url.hostname : '';
        const fav = el.querySelector('.link-preview-fav');
        const dom = el.querySelector('.link-preview-domain');
        const sec = el.querySelector('.link-preview-secure');
        const title = el.querySelector('.link-preview-title');
        const desc = el.querySelector('.link-preview-desc');

        if (fav) fav.src = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : '';

        // 🆕 直链透视 UI 反馈
        if (dom) {
            if (isRedirected) {
                dom.innerHTML = `<span style="color:#e67e22;font-weight:bold;">⚡ 直链:</span> ${domain}`;
            } else {
                dom.textContent = domain || rawUrl || '';
            }
        }

        if (sec) sec.textContent = url?.protocol === 'https:' ? '🔒' : '⚠️';

        const aTitle = (a.getAttribute('title') || '').trim();
        const aText = (a.textContent || '').trim().replace(/\s+/g,' ');

        // 优先显示链接文本，如果没有则显示 URL 路径
        title.textContent = aTitle || aText || (url ? (url.pathname + url.search) : '链接');

        // 描述区域显示完整 URL
        const displayUrl = isRedirected ? cleanUrl : (url ? url.href : rawUrl);
        desc.textContent = displayUrl;

        // 如果是重定向链接，给预览卡片加个特殊边框提示
        el.style.borderColor = isRedirected ? '#e67e22' : 'rgba(0,0,0,.08)';
    }

    // 🆕 新增：创建输入搜索按钮
    function createInputSearchButton() {
        const button = document.createElement('div');
        button.id = 'input-search-button';
        button.innerHTML = '⌨️';
        button.title = '输入搜索';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['input-search-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        // 添加到按钮位置配置
        if (!buttonPositions['input-search-button']) {
            buttonPositions['input-search-button'] = { defaultRight: 20, defaultBottom: 340 };
        }

        initButtonPosition(button, 'input-search-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            showInputSearchPrompt();
        };

        return button;
    }

    // 🆕 新增：创建“区域转Markdown”按钮
    function createHtmlToMarkdownButton() {
        const button = document.createElement('div');
        button.id = 'html2md-button';
        button.innerHTML = '🧾';
        button.title = '可视化选择区域，复制为 Markdown';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99994',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['html2md-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['html2md-button']) {
            buttonPositions['html2md-button'] = { defaultRight: 20, defaultBottom: 360 };
        }

        initButtonPosition(button, 'html2md-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            startHtmlToMarkdownPicker();
        };

        return button;
    }

    // 🆕 可视化拾取并复制Markdown
    function startHtmlToMarkdownPicker() {
        let active = true;
        let hoverEl = null;

        const tip = document.createElement('div');
        tip.id = 'html2md-tip';
        Object.assign(tip.style, {
            position: 'fixed',
            left: '50%',
            top: '12px',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            zIndex: '100001',
            fontSize: '12px',
            pointerEvents: 'none'
        });
        tip.textContent = '移动鼠标高亮元素，点击复制Markdown，按 Esc 取消';

        const highlight = document.createElement('div');
        highlight.id = 'html2md-highlight';
        Object.assign(highlight.style, {
            position: 'fixed',
            border: '2px solid #ff6b9d',
            background: 'rgba(255,107,157,0.08)',
            boxShadow: '0 0 0 2px rgba(255,107,157,0.25)',
            borderRadius: '6px',
            zIndex: '100000',
            pointerEvents: 'none'
        });

        document.body.appendChild(tip);
        document.body.appendChild(highlight);

        function isOurUIElement(el) {
            if (!el) return false;
            if (el.id && (el.id.endsWith('-button') || el.id === 'combined-button' || el.id === 'html2md-tip' || el.id === 'html2md-highlight')) return true;
            if (el.closest && (el.closest('.floating-panel') || el.closest('.button-group-expanded'))) return true;
            return false;
        }

        function updateHighlight(el) {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            highlight.style.left = rect.left + 'px';
            highlight.style.top = rect.top + 'px';
            highlight.style.width = rect.width + 'px';
            highlight.style.height = rect.height + 'px';
        }

        const moveHandler = (e) => {
            if (!active) return;
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el || isOurUIElement(el)) return;
            if (hoverEl !== el) {
                hoverEl = el;
                updateHighlight(hoverEl);
            }
        };

        const clickHandler = (e) => {
            if (!active) return;
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el || isOurUIElement(el)) return;
            e.preventDefault();
            e.stopPropagation();
            active = false;
            cleanup();
            try {
                const target = el;
                const markdown = generateMarkdownFromElement(target);
                copyText(markdown);
                showMarkdownResultPanel(markdown);
                showNotification('✅ 已复制所选区域为 Markdown');
            } catch (err) {
                console.error('HTML 转 Markdown 失败:', err);
                showNotification('❌ 转换失败');
            }
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                active = false;
                cleanup();
                showNotification('已取消选择');
            }
        };

        function cleanup() {
            document.removeEventListener('mousemove', moveHandler, true);
            document.removeEventListener('click', clickHandler, true);
            document.removeEventListener('keydown', escHandler, true);
            if (tip && tip.parentNode) tip.parentNode.removeChild(tip);
            if (highlight && highlight.parentNode) highlight.parentNode.removeChild(highlight);
        }

        document.addEventListener('mousemove', moveHandler, true);
        document.addEventListener('click', clickHandler, true);
        document.addEventListener('keydown', escHandler, true);
    }

    function showMarkdownResultPanel(markdown) {
        const panel = createPanel('Markdown 结果', `
            <div class="panel-content">
                <div class="input-group">
                    <textarea id="md-result-area" class="form-textarea" placeholder="已生成的 Markdown 内容"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" id="btn-copy-md">复制</button>
                    <button class="btn" id="btn-download-md">下载 .md</button>
                    <button class="btn" id="btn-close-md">关闭</button>
                </div>
            </div>
        `);
        document.body.appendChild(panel);
        const ta = panel.querySelector('#md-result-area');
        if (ta) ta.value = markdown;
        panel.querySelector('#btn-copy-md').addEventListener('click', () => {
            const val = panel.querySelector('#md-result-area').value;
            copyText(val);
            showNotification('已复制到剪贴板');
        });
        panel.querySelector('#btn-download-md').addEventListener('click', () => {
            const val = panel.querySelector('#md-result-area').value || '';
            const blob = new Blob([val], { type: 'text/markdown;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
            a.download = `selection-${ts}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        });
        panel.querySelector('#btn-close-md').addEventListener('click', () => panel.remove());
    }

    // 基础 HTML -> Markdown 转换（无外部依赖）
    function generateMarkdownFromElement(element) {
        const clone = element.cloneNode(true);
        clone.querySelectorAll('script,style,noscript').forEach(n => n.remove());

        function escapeMd(text) {
            return text.replace(/\\/g, '\\\\')
                .replace(/\*/g, '\\*')
                .replace(/_/g, '\\_')
                .replace(/#/g, '\\#')
                .replace(/\|/g, '\\|');
        }

        function normalizeWhitespace(str) {
            return str.replace(/\u00A0/g, ' ');
        }

        function textContent(node) {
            return normalizeWhitespace(node.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function langHintFrom(node) {
            const cls = (node.getAttribute && (node.getAttribute('class') || '')) || '';
            const m = cls.match(/(?:language|lang|hljs)[-_: ]([a-z0-9#+]+)/i);
            return m ? m[1].toLowerCase() : '';
        }

        function nodeToMd(node, ctx = { indent: '', list: null, index: 0, inCode: false }) {
            if (node.nodeType === Node.TEXT_NODE) {
                const t = ctx.inCode ? node.nodeValue : textContent(node);
                return t;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return '';

            const tag = node.tagName.toUpperCase();
            const children = Array.from(node.childNodes).map(n => nodeToMd(n, ctx));
            const inner = children.join('');

            switch (tag) {
                case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6': {
                    const level = parseInt(tag.substring(1), 10);
                    return `${'#'.repeat(level)} ${inner.trim()}\n\n`;
                }
                case 'P':
                case 'DIV':
                case 'SECTION': case 'ARTICLE': case 'HEADER': case 'FOOTER': case 'MAIN': case 'ASIDE': case 'NAV': {
                    const content = inner.trim();
                    return content ? content + "\n\n" : '';
                }
                case 'BR':
                    return "\n";
                case 'STRONG': case 'B':
                    return `**${inner.trim()}**`;
                case 'EM': case 'I':
                    return `*${inner.trim()}*`;
                case 'S': case 'DEL':
                    return `~~${inner.trim()}~~`;
                case 'INS':
                    return `++${inner.trim()}++`;
                case 'MARK':
                    return `==${inner.trim()}==`;
                case 'SUB':
                    return `~${inner.trim()}~`;
                case 'SUP':
                    return `^${inner.trim()}^`;
                case 'KBD':
                    return '`' + (node.textContent || '').trim().replace(/`/g, '\\`') + '`';
                case 'SPAN':
                    return inner; // 纯内联容器
                case 'A': {
                    const href = node.getAttribute('href') || '';
                    const title = escapeMd(inner.trim() || href);
                    return `[${title}](${href})`;
                }
                case 'IMG': {
                    const src = node.getAttribute('src') || '';
                    const alt = node.getAttribute('alt') || '';
                    return `![${escapeMd(alt)}](${src})`;
                }
                case 'UL': {
                    let out = '';
                    Array.from(node.children).forEach(li => {
                        if (li.tagName && li.tagName.toUpperCase() === 'LI') {
                            out += `- ${nodeToMd(li, { ...ctx, indent: ctx.indent + '  ' }).trim()}\n`;
                        }
                    });
                    return out + "\n";
                }
                case 'OL': {
                    let out = '';
                    let i = 1;
                    Array.from(node.children).forEach(li => {
                        if (li.tagName && li.tagName.toUpperCase() === 'LI') {
                            const line = nodeToMd(li, { ...ctx, indent: ctx.indent + '  ' }).trim();
                            out += `${i}. ${line}\n`;
                            i++;
                        }
                    });
                    return out + "\n";
                }
                case 'LI': {
                    const content = inner.trim();
                    return content;
                }
                case 'PRE': {
                    // 支持从 class 中提取语言标记
                    let codeEl = node.querySelector('code');
                    const lang = codeEl ? langHintFrom(codeEl) : langHintFrom(node);
                    const raw = (codeEl ? codeEl.textContent : node.textContent) || '';
                    const code = raw.replace(/```/g, "```\n");
                    return '```' + (lang || '') + '\n' + code.trim() + '\n```\n\n';
                }
                case 'CODE': {
                    const txt = node.textContent.trim();
                    return ctx.inCode ? txt : '`' + txt.replace(/`/g, '\\`') + '`';
                }
                case 'BLOCKQUOTE': {
                    const lines = inner.split(/\n+/).map(l => l.trim()).filter(Boolean);
                    return lines.map(l => `> ${l}`).join('\n') + '\n\n';
                }
                case 'HR':
                    return '---\n\n';
                case 'FIGCAPTION': {
                    const content = inner.trim();
                    return content ? `*${content}*\n\n` : '';
                }
                case 'FIGURE': {
                    return inner.trim() ? inner.trim() + '\n\n' : '';
                }
                case 'DL': {
                    let out = '';
                    Array.from(node.children).forEach(child => {
                        const t = (child.tagName || '').toUpperCase();
                        if (t === 'DT') out += `\n${textContent(child)}\n`;
                        if (t === 'DD') out += `: ${textContent(child)}\n`;
                    });
                    return out ? out + '\n' : '';
                }
                case 'TABLE': {
                    const rows = Array.from(node.querySelectorAll('tr'));
                    if (!rows.length) return '';
                    const cells = rows.map(r => Array.from(r.children).map(c => textContent(c)));
                    let out = '';
                    if (cells.length) {
                        out += '| ' + cells[0].join(' | ') + ' |\n';
                        out += '| ' + cells[0].map(() => '---').join(' | ') + ' |\n';
                        for (let i = 1; i < cells.length; i++) {
                            out += '| ' + cells[i].join(' | ') + ' |\n';
                        }
                        out += '\n';
                    }
                    return out;
                }
                default:
                    return inner;
            }
        }

        const result = nodeToMd(clone);
        // 清理多余空行
        return result
            .replace(/[\t ]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim() + '\n';
    }

    function copyText(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        } catch (_) {
            fallbackCopy(text);
        }
    }
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
    }

    // 🆕 新增：显示输入搜索提示框
    function showInputSearchPrompt() {
        const searchText = prompt('🔍 请输入要搜索的内容：', '');

        if (searchText !== null && searchText.trim() !== '') {
            const trimmedText = searchText.trim();

            if (config.enableDirectSearch) {
                if (config.visualSearchMode === 'multi') {
                    const currentConfig = config.searchConfigs[config.currentSearchConfig] || config.searchConfigs['default'];
                    performMultiSearch(trimmedText, currentConfig);
                } else {
                    performSearch(trimmedText, config.defaultSearchEngine, config.searchMode);
                }
            } else {
                if (config.visualSearchMode === 'multi') {
                    showMultiSearchPanel(trimmedText);
                } else {
                    showSearchPanel(trimmedText, true);
                }
            }
        } else if (searchText !== null) {
            // 用户点了确定但输入为空，还是打开搜索面板
            if (config.visualSearchMode === 'multi') {
                showMultiSearchPanel('');
            } else {
                showSearchPanel('', true);
            }
        }
    }

    // 切换所有按钮显示/隐藏
    // 通用隐藏/显示所有按钮（组合模式和分离模式都适用）
    // 🆕 修改：增强切换所有按钮函数，确保实时刷新
    function toggleAllButtons() {
        let buttonsToToggle = [];

        if (config.displayMode === 'combined') {
            buttonsToToggle = ['combined-button'];
        } else {
            // 🆕 修复：使用与 removeAllButtons 相同的完整列表，确保包含所有按钮
            buttonsToToggle = [
                'app-open-button', 'copy-link-button', 'visual-search-button',
                'reading-list-button', 'clean-url-button', 'config-button',
                'batch-links-button', 'batch-paste-button', 'batch-tools-button', 'reading-list-panel-button',
                'input-search-button', 'html2md-button', 'auto-scroll-button', 'scroll-top-button', 
                'scroll-bottom-button', 'element-hider-button', 'element-selector-button', 'github-upload-button'
            ];
            
            // 🆕 额外修复：动态查找所有以 -button 结尾的元素（通常是我们的按钮）
            // 这样可以确保不会遗漏任何按钮
            const allButtonElements = Array.from(document.querySelectorAll('[id$="-button"]'));
            allButtonElements.forEach(el => {
                const id = el.id;
                // 排除 combined-button（组合模式按钮）和 cancel-button 等临时按钮
                if (id && id !== 'combined-button' && 
                    !id.includes('cancel') && !id.includes('batch-link-cancel') &&
                    !id.includes('rectangle-selection-cancel') && !id.includes('visual-selection-cancel') &&
                    !buttonsToToggle.includes(id)) {
                    // 检查是否是固定定位的按钮（我们的按钮都是固定定位的）
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.position === 'fixed') {
                        buttonsToToggle.push(id);
                    }
                }
            });
        }

        let hasVisibleButton = false;
        buttonsToToggle.forEach(buttonId => {
            const el = document.getElementById(buttonId);
            if (el) {
                // 🆕 修复：使用 getComputedStyle 获取实际显示状态，考虑所有样式来源
                const computedStyle = window.getComputedStyle(el);
                const display = computedStyle.display;
                const visibility = computedStyle.visibility;
                const opacity = computedStyle.opacity;
                // 如果 display 不是 none 且 visibility 不是 hidden 且 opacity 不是 0，则认为按钮可见
                if (display !== 'none' && visibility !== 'hidden' && opacity !== '0') {
                    hasVisibleButton = true;
                }
            }
        });

        const hide = hasVisibleButton;
        
        // 🆕 修复：强制设置所有按钮的显示状态，使用 important 优先级
        const buttonCreators = {
            'app-open-button': createAppOpenButton,
            'copy-link-button': createCopyButton,
            'visual-search-button': createVisualSearchButton,
            'reading-list-button': createReadingListButton,
            'clean-url-button': createCleanUrlButton,
            'config-button': createConfigButton,
            'batch-links-button': createBatchLinksButton,
            'batch-paste-button': createBatchPasteButton,
            'batch-tools-button': createBatchToolsButton,
            'reading-list-panel-button': createReadingListPanelButton,
            'input-search-button': createInputSearchButton,
            'html2md-button': createHtmlToMarkdownButton,
            'auto-scroll-button': createAutoScrollButton,
            'scroll-top-button': createScrollTopButton,
            'scroll-bottom-button': createScrollBottomButton,
            'element-hider-button': createElementHiderButton,
            'element-selector-button': createElementSelectorButton,
            'github-upload-button': createGitHubUploadButton,
            'combined-button': createCombinedButton
        };

        buttonsToToggle.forEach(buttonId => {
            let el = document.getElementById(buttonId);
            
            if (!el && !hide) {
                // 🆕 关键修复：如果按钮不存在且要显示，则重新创建它
                const creator = buttonCreators[buttonId];
                if (creator) {
                    try {
                        el = creator();
                        if (el) document.body.appendChild(el);
                    } catch (err) {
                        console.warn(`重新创建按钮 ${buttonId} 失败:`, err);
                    }
                }
            }
            
            if (el) {
                // 直接设置样式，确保覆盖所有其他样式
                if (hide) {
                    // 隐藏按钮
                    el.style.setProperty('display', 'none', 'important');
                    el.style.setProperty('visibility', 'hidden', 'important');
                    el.style.setProperty('opacity', '0', 'important');
                } else {
                    // 显示按钮 - 必须同时恢复位置信息
                    el.style.setProperty('display', 'flex', 'important');
                    el.style.setProperty('visibility', 'visible', 'important');
                    el.style.setProperty('opacity', '1', 'important');
                    
                    // 🆕 关键修复：显示时重新初始化位置（从保存的位置或默认位置）
                    setButtonPosition(el, buttonId);
                }
                // 同时更新配置
                if (config.buttonVisibility) {
                    config.buttonVisibility[buttonId] = !hide;
                }
            } else {
                // 如果按钮不存在也无法创建，至少更新配置
                if (config.buttonVisibility) {
                    config.buttonVisibility[buttonId] = !hide;
                }
            }
        });

        saveConfig();

        if (config.displayMode === 'combined') {
            showNotification(hide ? '🎭 已隐藏组合按钮' : '👁️ 已显示组合按钮');
        } else {
            showNotification(hide ? '🎭 已隐藏所有按钮' : '👁️ 已显示所有按钮');
        }
    }

    // 🆕 新增：链接分类管理面板
    function showLinkCategoryPanel(configKey, parentPanel = null) {
        const configItem = config.searchConfigs[configKey];
        if (!configItem) return;

        // 确保有 quickLinks 数组
        if (!configItem.quickLinks) {
            configItem.quickLinks = [];
        }

        const linksHTML = configItem.quickLinks.map((link, index) => `
        <div class="pattern-item" data-index="${index}">
            <div class="pattern-info">
                <div class="pattern-domain">${link.name || '未命名链接'}</div>
                <div class="pattern-regex">${link.url}</div>
            </div>
            <div class="pattern-actions">
                <button class="btn-small btn-test" data-index="${index}" title="测试打开链接">🔗</button>
                <button class="btn-small btn-edit" data-index="${index}">编辑</button>
                <button class="btn-small btn-delete" data-index="${index}">删除</button>
            </div>
        </div>
    `).join('');

        const panel = createPanel(`链接管理 - ${configItem.name}`, `
        <div class="panel-content">
            <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                <div style="font-weight: 600; color: #1976d2; margin-bottom: 8px;">💡 链接分类功能</div>
                <div style="font-size: 13px; color: #1565c0; line-height: 1.4;">
                    • 为此配置添加常用网页链接<br>
                    • 点击链接名称直接打开网页<br>
                    • 适合保存常用工具网站、文档等
                </div>
            </div>

            <div class="pattern-list">
                ${configItem.quickLinks.length === 0 ?
                                  '<div class="empty-state">暂无链接，请添加常用网页链接</div>' :
                                  `<div class="pattern-items">${linksHTML}</div>`
                                  }
            </div>

            <div class="add-section">
                <div class="section-title">添加新链接</div>
                <div class="input-group">
                    <input type="text" id="new-link-name" placeholder="链接名称 (例如: GitHub、文档中心)" class="form-input">
                </div>
                <div class="input-group">
                    <input type="text" id="new-link-url" placeholder="链接地址 (例如: https://github.com)" class="form-input">
                </div>
                <button class="btn btn-primary" id="btn-add-link" style="width: 100%">添加链接</button>
            </div>
        </div>
    `);

        // 🆕 更新显示
        function updateDisplay() {
            const patternList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');
            const newLinksHTML = configItem.quickLinks.map((link, index) => `
            <div class="pattern-item" data-index="${index}">
                <div class="pattern-info">
                    <div class="pattern-domain">${link.name || '未命名链接'}</div>
                    <div class="pattern-regex">${link.url}</div>
                </div>
                <div class="pattern-actions">
                    <button class="btn-small btn-test" data-index="${index}" title="测试打开链接">🔗</button>
                    <button class="btn-small btn-edit" data-index="${index}">编辑</button>
                    <button class="btn-small btn-delete" data-index="${index}">删除</button>
                </div>
            </div>
        `).join('');

            if (configItem.quickLinks.length === 0) {
                patternList.innerHTML = '<div class="empty-state">暂无链接，请添加常用网页链接</div>';
            } else {
                patternList.innerHTML = newLinksHTML;
            }

            bindLinkEvents();
        }

        // 🆕 绑定链接事件
        function bindLinkEvents() {
            // 测试打开链接
            panel.querySelectorAll('.btn-test').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const index = parseInt(this.getAttribute('data-index'));
                    const link = configItem.quickLinks[index];
                    if (link && link.url) {
                        GM_openInTab(link.url, { active: false, insert: true, setParent: true });
                        showNotification(`已打开: ${link.name}`);
                    }
                });
            });

            // 编辑链接
            panel.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const index = parseInt(this.getAttribute('data-index'));
                    const link = configItem.quickLinks[index];
                    showEditLinkPanel(configKey, index, link, panel);
                });
            });

            // 删除链接
            panel.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const index = parseInt(this.getAttribute('data-index'));
                    const link = configItem.quickLinks[index];

                    if (confirm(`确定要删除链接 "${link.name}" 吗？`)) {
                        configItem.quickLinks.splice(index, 1);
                        if (saveConfig()) {
                            showNotification('链接已删除');
                            updateDisplay();
                        }
                    }
                });
            });

            // 点击链接项直接打开
            panel.querySelectorAll('.pattern-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.pattern-actions')) {
                        const index = parseInt(this.getAttribute('data-index'));
                        const link = configItem.quickLinks[index];
                        if (link && link.url) {
                            GM_openInTab(link.url, { active: false, insert: true, setParent: true });
                            showNotification(`已打开: ${link.name}`);
                        }
                    }
                });
            });
        }

        // 添加链接
        panel.querySelector('#btn-add-link').addEventListener('click', function() {
            const name = panel.querySelector('#new-link-name').value.trim();
            const url = panel.querySelector('#new-link-url').value.trim();

            if (!name) {
                showNotification('请输入链接名称');
                return;
            }
            if (!url) {
                showNotification('请输入链接地址');
                return;
            }

            // 简单的URL验证
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                showNotification('链接地址必须以 http:// 或 https:// 开头');
                return;
            }

            configItem.quickLinks.push({
                name: name,
                url: url
            });

            if (saveConfig()) {
                showNotification(`已添加链接: ${name}`);
                // 清空输入框
                panel.querySelector('#new-link-name').value = '';
                panel.querySelector('#new-link-url').value = '';
                updateDisplay();
            }
        });

        // 初始绑定
        bindLinkEvents();

        addPanelButtons(panel, () => {
            if (parentPanel) {
                parentPanel.remove();
            }
            panel.remove();
        });

        document.body.appendChild(panel);
    }

    // 🆕 新增：编辑链接面板
    function showEditLinkPanel(configKey, linkIndex, linkData, parentPanel = null) {
        const panel = createPanel('编辑链接', `
        <div class="panel-content">
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">链接名称</label>
                <input type="text" id="edit-link-name" class="form-input" value="${linkData.name || ''}">
            </div>
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">链接地址</label>
                <input type="text" id="edit-link-url" class="form-input" value="${linkData.url || ''}">
            </div>
        </div>
    `);

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            const name = panel.querySelector('#edit-link-name').value.trim();
            const url = panel.querySelector('#edit-link-url').value.trim();

            if (!name) {
                showNotification('请输入链接名称');
                return;
            }
            if (!url) {
                showNotification('请输入链接地址');
                return;
            }

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                showNotification('链接地址必须以 http:// 或 https:// 开头');
                return;
            }

            const configItem = config.searchConfigs[configKey];
            if (configItem && configItem.quickLinks) {
                configItem.quickLinks[linkIndex] = {
                    name: name,
                    url: url
                };

                if (saveConfig()) {
                    showNotification('链接已更新');
                    panel.remove();
                    if (parentPanel) {
                        parentPanel.remove();
                        showLinkCategoryPanel(configKey);
                    }
                }
            }
        },
                        '保存'
                       );

        document.body.appendChild(panel);
    }

    //获取适用的URL Scheme
    function getUrlSchemeForDomain() {
        // 如果启用全局通用Scheme，直接返回通用Scheme
        if (config.useGlobalScheme) {
            return config.urlScheme;
        }

        const currentDomain = window.location.hostname;

        // 检查是否有该域名的专用Scheme
        if (config.domainUrlSchemes && config.domainUrlSchemes[currentDomain]) {
            return config.domainUrlSchemes[currentDomain];
        }

        // 检查是否有父域名的专用Scheme（例如：子域名.example.com 使用 example.com 的Scheme）
        const domainParts = currentDomain.split('.');
        if (domainParts.length > 2) {
            const parentDomain = domainParts.slice(1).join('.');
            if (config.domainUrlSchemes && config.domainUrlSchemes[parentDomain]) {
                return config.domainUrlSchemes[parentDomain];
            }
        }

        // 默认使用通用Scheme
        return config.urlScheme;
    }

    // 🆕 新增：获取当前使用的Scheme类型描述
    function getCurrentSchemeInfo() {
        if (config.useGlobalScheme) {
            return '所有网站使用通用Scheme';
        }

        const currentDomain = window.location.hostname;
        const currentScheme = getUrlSchemeForDomain();

        if (currentScheme === config.urlScheme) {
            return '当前网站使用通用Scheme';
        } else {
            return '当前网站使用域名专用Scheme';
        }
    }

    // ================================
    // 自动URL净化功能
    // ================================

    function shouldAutoCleanUrl() {
        if (!config.autoCleanUrl) return false;

        const domains = config.autoCleanDomains;
        if (domains.includes('all')) return true;

        return domains.includes(currentDomain);
    }

    function autoCleanCurrentUrl() {
        if (!shouldAutoCleanUrl()) return;

        const currentUrl = new URL(window.location.href);
        const originalUrl = currentUrl.toString();

        // 检查是否有需要净化的参数
        let hasTrackingParams = false;
        config.urlTrackingParams.forEach(param => {
            if (currentUrl.searchParams.has(param)) {
                hasTrackingParams = true;
                currentUrl.searchParams.delete(param);
            }
        });

        if (hasTrackingParams) {
            const cleanedUrl = currentUrl.toString();
            if (cleanedUrl !== originalUrl) {
                // 直接在当前页面加载净化后的URL，不显示提示
                window.history.replaceState(null, document.title, cleanedUrl);
            }
        }
    }

    // 页面加载时执行自动净化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoCleanCurrentUrl);
    } else {
        autoCleanCurrentUrl();
    }
    // 多选搜索面板
    function showMultiSearchPanel(selectedText = '') {
        const currentConfig = config.searchConfigs[config.currentSearchConfig] || config.searchConfigs['default'];
        const availableEngines = Object.keys(config.searchEngines);

        const panel = createPanel('多引擎搜索', `
    <div class="panel-content">
        <!-- 搜索配置选择 - 蓝色主题 -->
        <div class="config-selection-section">
            <div class="section-header">
                <span class="section-icon">⚙️</span>
                <span class="section-title">搜索配置</span>
                <span class="config-badge">${currentConfig.engines.length}个引擎</span>
            </div>

            <div class="config-select-row">
                <select id="search-config-select" class="elegant-select">
                    ${Object.keys(config.searchConfigs).map(key => `
                        <option value="${key}" ${key === config.currentSearchConfig ? 'selected' : ''}>
                            ${escapeHTML(config.searchConfigs[key].name)}
                        </option>
                    `).join('')}
                </select>
                <div class="config-actions">
                    <button class="elegant-btn secondary" id="btn-manage-configs" title="管理配置">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">管理</span>
                    </button>
                    <button class="elegant-btn primary" id="btn-new-config" title="新建配置">
                        <span class="btn-icon">+</span>
                        <span class="btn-text">新建</span>
                    </button>
                </div>
            </div>

            <div class="config-description">
                ${escapeHTML(currentConfig.description || '暂无描述')}
            </div>
        </div>

        <!-- 🆕 新增：快捷链接区域 -->
        ${currentConfig.quickLinks && currentConfig.quickLinks.length > 0 ? `
        <div class="quick-links-section">
            <div class="section-header">
                <span class="section-icon">🔗</span>
                <span class="section-title">快捷链接</span>
                <span class="config-badge">${currentConfig.quickLinks.length}个</span>
            </div>
            <div class="quick-links-grid">
                ${currentConfig.quickLinks.map(link => `
                    <div class="quick-link-item" data-url="${escapeHTML(link.url)}">
                        <div class="quick-link-icon">🌐</div>
                        <div class="quick-link-name">${escapeHTML(link.name)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

                <!-- 搜索文本输入 -->
                <div class="input-group">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">搜索文本</label>
            <textarea id="search-text" class="form-textarea" placeholder="输入要搜索的文本">${escapeHTML(selectedText)}</textarea>
        </div>
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <button class="btn btn-primary" id="btn-visual-select" style="flex: 1;">🔍 可视化选择</button>
                    <button class="btn" id="btn-paste-clipboard" style="flex: 1; background: #4A7BFF; color: white;">📋 粘贴剪贴板</button>
                    <button class="btn" id="btn-clear-text" style="flex: 1; background: #f8f9fa;">清空</button>
                </div>

                <!-- 搜索引擎多选区域 -->
                <div class="section-title">选择搜索引擎</div>
                <div id="engines-multi-select" style="max-height: 300px; overflow-y: auto;">
                    ${availableEngines.map(key => {
            const engine = config.searchEngines[key];
            const isSelected = currentConfig.engines.includes(key);
            let iconDisplay = escapeHTML(engine.icon);
            if (isImageUrl(engine.icon)) {
                iconDisplay = `<img src="${escapeHTML(engine.icon)}" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; border-radius: 2px;" onerror="handleImageError(this)">`;
            }

            return `
                            <div class="checkbox-item engine-checkbox-item" data-engine="${key}">
                                <input type="checkbox" id="engine-${key}" ${isSelected ? 'checked' : ''}>
                                <div class="checkbox-info">
                                    <div class="checkbox-title">${iconDisplay} ${escapeHTML(engine.name)}</div>
                                    <div class="checkbox-desc">${escapeHTML(engine.webUrl || engine.appUrl)}</div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>

                <!-- 搜索预览 -->
                <div class="search-preview">
                    <div class="search-preview-title">搜索预览</div>
                    <div class="search-preview-url" id="search-preview">
                        ${generateSearchPreview(currentConfig, selectedText)}
                    </div>
                </div>

                <!-- 搜索模式 -->
                <div class="section-title">搜索模式</div>
                <div class="option-item ${config.searchMode === 'web' ? 'selected' : ''}" id="web-mode-item">
                    <input type="radio" name="searchMode" value="web" ${config.searchMode === 'web' ? 'checked' : ''} class="option-radio">
                    <div>
                        <div class="option-title">网页搜索</div>
                        <div class="option-desc">在当前浏览器中打开搜索结果</div>
                    </div>
                </div>
                <div class="option-item ${config.searchMode === 'app' ? 'selected' : ''}" id="app-mode-item">
                    <input type="radio" name="searchMode" value="app" ${config.searchMode === 'app' ? 'checked' : ''} class="option-radio">
                    <div>
                        <div class="option-title">App搜索</div>
                        <div class="option-desc">使用URL Scheme在App中搜索</div>
                    </div>
                </div>
            </div>
        `);


        // 🆕 更新显示的函数
        function updateDisplay() {
            const currentConfig = config.searchConfigs[config.currentSearchConfig] || config.searchConfigs['default'];

            // 更新配置选择框
            const configSelect = panel.querySelector('#search-config-select');
            configSelect.innerHTML = Object.keys(config.searchConfigs).map(key => `
                <option value="${key}" ${key === config.currentSearchConfig ? 'selected' : ''}>
                    ${config.searchConfigs[key].name}
                </option>
            `).join('');

            // 更新搜索引擎选择状态
            availableEngines.forEach(key => {
                const checkbox = panel.querySelector(`#engine-${key}`);
                if (checkbox) {
                    checkbox.checked = currentConfig.engines.includes(key);
                }
            });

            // 更新搜索预览
            const searchText = panel.querySelector('#search-text').value.trim();
            panel.querySelector('#search-preview').innerHTML = generateSearchPreview(currentConfig, searchText);

            // 更新引擎数量徽标
            const enginesBadge = panel.querySelector('.config-selection-section .config-badge');
            if (enginesBadge) {
                enginesBadge.textContent = `${currentConfig.engines.length}个引擎`;
            }

            // 更新底部保存按钮文字
            const saveBtn = panel.querySelector('.panel-footer .btn-success');
            if (saveBtn) {
                saveBtn.textContent = `搜索 (${currentConfig.engines.length}个引擎)`;
            }
        }

        // 🆕 生成搜索预览
        function generateSearchPreview(searchConfig, text) {
            if (!text) return '请选择搜索引擎并输入文本';

            const selectedEngines = searchConfig.engines.map(key => config.searchEngines[key]).filter(engine => engine);

            if (selectedEngines.length === 0) {
                return '请至少选择一个搜索引擎';
            }

            return selectedEngines.map(engine => {
                const baseUrl = config.searchMode === 'web' ? engine.webUrl : engine.appUrl;
                let url;
                if (baseUrl && baseUrl.includes('{key}')) {
                    url = baseUrl.replace('{key}', encodeURIComponent(text));
                } else if (baseUrl) {
                    url = baseUrl + encodeURIComponent(text);
                } else {
                    url = 'URL未配置';
                }
                return `<div style="margin-bottom: 8px; font-size: 12px;"><strong>${engine.name}:</strong> ${url}</div>`;
            }).join('');
        }

        // 事件绑定
        function bindEvents() {
            // 配置选择变化
            panel.querySelector('#search-config-select').addEventListener('change', function() {
                config.currentSearchConfig = this.value;
                saveConfig();
                updateDisplay();
            });

            // 搜索引擎选择变化
            panel.querySelectorAll('.engine-checkbox-item input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const engineKey = this.closest('.engine-checkbox-item').dataset.engine;
                    const currentConfig = config.searchConfigs[config.currentSearchConfig];

                    if (this.checked) {
                        if (!currentConfig.engines.includes(engineKey)) {
                            currentConfig.engines.push(engineKey);
                        }
                    } else {
                        currentConfig.engines = currentConfig.engines.filter(key => key !== engineKey);
                    }

                    saveConfig();
                    updateDisplay();
                });
            });

            // 搜索文本变化
            panel.querySelector('#search-text').addEventListener('input', function() {
                updateDisplay();
            });

            // 搜索模式变化
            panel.querySelectorAll('input[name="searchMode"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    config.searchMode = this.value;
                    saveConfig();
                    updateDisplay();
                });
            });

            // 按钮事件
            // 在 showMultiSearchPanel 的 bindEvents 函数中，修改管理配置按钮事件
            panel.querySelector('#btn-manage-configs').addEventListener('click', function() {
                showSearchConfigManagementPanel(panel);
            });

            // 修改新建配置按钮事件
            panel.querySelector('#btn-new-config').addEventListener('click', function() {
                showEditConfigPanel(null, panel);
            });

            // 其他按钮（可视化选择、粘贴剪贴板、清空）
            panel.querySelector('#btn-visual-select').addEventListener('click', function() {
                panel.remove();
                startVisualSelection();
            });

            panel.querySelector('#btn-paste-clipboard').addEventListener('click', async function() {
                try {
                    const text = await navigator.clipboard.readText();
                    if (text && text.trim()) {
                        panel.querySelector('#search-text').value = text.trim();
                        updateDisplay();
                        showNotification('已粘贴剪贴板内容');
                    }
                } catch (err) {
                    showNotification('无法读取剪贴板内容');
                }
            });

            panel.querySelector('#btn-clear-text').addEventListener('click', function() {
                panel.querySelector('#search-text').value = '';
                updateDisplay();
            });
        }

        // 初始绑定
        bindEvents();

        // 添加搜索按钮
        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            const searchText = panel.querySelector('#search-text').value.trim();
            const currentConfig = config.searchConfigs[config.currentSearchConfig];

            if (!searchText) {
                showNotification('请输入搜索文本');
                return;
            }

            if (currentConfig.engines.length === 0) {
                showNotification('请至少选择一个搜索引擎');
                return;
            }

            // 🆕 修改：调用新的多引擎搜索函数
            performMultiSearch(searchText, currentConfig);
            panel.remove();
        },
                        `搜索 (${currentConfig.engines.length}个引擎)`
                       );

        document.body.appendChild(panel);
    }

    //执行多引擎搜索
    // 🆕 修改：使用 GM_openInTab 进行多引擎搜索
    function performMultiSearch(text, searchConfig) {
        const selectedEngines = searchConfig.engines.map(key => ({
            key: key,
            engine: config.searchEngines[key]
        })).filter(item => item.engine);

        if (selectedEngines.length === 0) {
            showNotification('没有可用的搜索引擎');
            return;
        }

        showNotification(`正在使用 ${selectedEngines.length} 个搜索引擎搜索: ${text}`);

        // 使用 GM_openInTab 同时打开多个标签页
        selectedEngines.forEach(item => {
            performSearchWithGMTab(text, item.key, config.searchMode);
        });
    }

    // 🆕 新增：使用 GM_openInTab 的搜索函数
    function performSearchWithGMTab(text, engineKey, mode) {
        const engine = config.searchEngines[engineKey];
        if (!engine) {
            console.warn(`搜索引擎不存在: ${engineKey}`);
            return;
        }

        // 智能模式切换
        let actualMode = mode;
        if (mode === 'web' && !engine.webUrl) {
            actualMode = 'app';
        } else if (mode === 'app' && !engine.appUrl) {
            actualMode = 'web';
        }

        const baseUrl = actualMode === 'web' ? engine.webUrl : engine.appUrl;

        if (!baseUrl) {
            console.warn(`${engine.name} 没有可用的搜索URL`);
            return;
        }

        // 构建搜索URL
        let searchUrl;
        if (baseUrl.includes('{key}')) {
            searchUrl = baseUrl.replace('{key}', encodeURIComponent(text));
        } else {
            searchUrl = baseUrl + encodeURIComponent(text);
        }

        if (actualMode === 'web') {
            try {
                openTabBackground(searchUrl);
                console.log(`已打开: ${engine.name}`);
            } catch (err) {
                console.error(`打开 ${engine.name} 失败:`, err);
                window.open(searchUrl, '_blank');
            }
        } else {
            // App搜索模式保持不变（使用原来的方法）
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = searchUrl;
                document.body.appendChild(iframe);

                setTimeout(() => {
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                        if (engine.webUrl) {
                            const webSearchUrl = engine.webUrl.includes('{key}') ?
                                  engine.webUrl.replace('{key}', encodeURIComponent(text)) :
                            engine.webUrl + encodeURIComponent(text);
                            openTabBackground(webSearchUrl);
                        }
                    }
                }, 1000);

            } catch (err) {
                console.error('打开App失败:', err);
                if (engine.webUrl) {
                    const webSearchUrl = engine.webUrl.includes('{key}') ?
                          engine.webUrl.replace('{key}', encodeURIComponent(text)) :
                    engine.webUrl + encodeURIComponent(text);
                    openTabBackground(webSearchUrl);
                }
            }
        }
    }

    // 搜索配置管理面板
    function showSearchConfigManagementPanel(parentPanel = null) {
        const configs = config.searchConfigs || {};

        // 在配置项的HTML模板中，确保有链接按钮
        const configListHTML = Object.keys(configs).map(key => {
            const configItem = configs[key];
            const engineNames = configItem.engines.map(engineKey => {
                const engine = config.searchEngines[engineKey];
                return escapeHTML(engine ? engine.name : engineKey);
            }).join(', ');

            const linkCount = configItem.quickLinks ? configItem.quickLinks.length : 0;

            return `
        <div class="config-management-item ${key === config.currentSearchConfig ? 'active-config' : ''}">
            <div class="config-item-header">
                <div class="config-name">${escapeHTML(configItem.name)}</div>
                <div class="config-stats">
                    ${configItem.engines.length > 0 ? `<span class="stat-badge engine-count">${configItem.engines.length}引擎</span>` : ''}
                    ${linkCount > 0 ? `<span class="stat-badge link-count">${linkCount}链接</span>` : ''}
                </div>
            </div>
            <div class="config-engines">${engineNames || '无搜索引擎'}</div>
            <div class="config-description">${escapeHTML(configItem.description || '暂无描述')}</div>
            <div class="config-actions">
                <!-- 🆕 链接管理按钮 -->
                <button class="btn btn-primary" data-config="${key}" data-action="links" title="管理链接">
                    <span class="btn-icon">🔗</span>
                    <span class="btn-text">链接</span>
                </button>
                <!-- 编辑按钮 -->
                <button class="elegant-btn secondary small" data-config="${key}" data-action="edit">
                    <span class="btn-icon">✏️</span>
                    <span class="btn-text">编辑</span>
                </button>
                ${key !== 'default' ? `
                    <!-- 删除按钮 -->
                    <button class="elegant-btn danger small" data-config="${key}" data-action="delete">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">删除</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
        }).join('');

        const panel = createPanel('搜索配置管理', `
            <div class="panel-content">
                <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                    <div style="font-weight: 600; color: #1976d2; margin-bottom: 8px;">💡 功能说明</div>
                    <div style="font-size: 13px; color: #1565c0; line-height: 1.4;">
                        • 创建不同的搜索配置组合，快速切换常用搜索引擎组合<br>
                        • 默认配置无法删除，但可以编辑<br>
                        • 当前使用: <strong>${escapeHTML(configs[config.currentSearchConfig]?.name || '默认配置')}</strong>
                    </div>
                </div>

                <div class="pattern-list">
                    ${Object.keys(configs).length === 0 ?
                                  '<div class="empty-state">暂无搜索配置</div>' :
                                  `<div class="pattern-items">${configListHTML}</div>`
                                  }
                </div>

                <div class="add-section">
                    <div class="section-title">创建新配置</div>
                    <button class="btn btn-primary" id="btn-create-config" style="width: 100%">创建新搜索配置</button>
                </div>
            </div>
        `);

        // 🆕 更新显示的函数
        function updateDisplay() {
            const configs = config.searchConfigs || {};
            const configList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');

            const newConfigListHTML = Object.keys(configs).map(key => {
                const configItem = configs[key];
                const engineNames = configItem.engines.map(engineKey => {
                    const engine = config.searchEngines[engineKey];
                    return engine ? engine.name : engineKey;
                }).join(', ');

                return `
                    <div class="pattern-item ${key === config.currentSearchConfig ? 'active-config' : ''}">
                        <div class="pattern-info">
                            <div class="pattern-domain">${configItem.name}</div>
                            <div class="pattern-regex">${engineNames || '无搜索引擎'}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">${configItem.description || '无描述'}</div>
                        </div>
                        <div class="pattern-actions">
                            <button class="btn-small btn-edit" data-config="${key}">编辑</button>
                            ${key !== 'default' ? `<button class="btn-small btn-delete" data-config="${key}">删除</button>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            if (Object.keys(configs).length === 0) {
                configList.innerHTML = '<div class="empty-state">暂无搜索配置</div>';
            } else {
                configList.innerHTML = newConfigListHTML;
            }

            bindConfigEvents();
        }

        // 🆕 绑定配置项事件
        function bindConfigEvents() {
            // 设置为当前配置（点击配置项）
            panel.querySelectorAll('.pattern-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.pattern-actions')) {
                        const configKey = this.querySelector('[data-config]')?.getAttribute('data-config');
                        if (configKey && config.searchConfigs[configKey]) {
                            config.currentSearchConfig = configKey;
                            if (saveConfig()) {
                                showNotification(`已切换到配置: ${config.searchConfigs[configKey].name}`);
                                updateDisplay();
                                // 如果是从父面板打开的，也更新父面板
                                if (parentPanel) {
                                    parentPanel.remove();
                                    showMultiSearchPanel();
                                }
                            }
                        }
                    }
                });
            });

            // 链接管理按钮事件
            panel.querySelectorAll('[data-action="links"]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const configKey = this.getAttribute('data-config');
                    if (config.searchConfigs[configKey]) {
                        showLinkCategoryPanel(configKey, panel);
                    }
                });
            });

            // 编辑配置（原有的）
            panel.querySelectorAll('[data-action="edit"]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const configKey = this.getAttribute('data-config');
                    showEditConfigPanel(configKey, panel);
                });
            });

            // 删除配置（原有的）
            panel.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const configKey = this.getAttribute('data-config');
                    if (configKey === 'default') {
                        showNotification('默认配置无法删除');
                        return;
                    }

                    if (confirm(`确定要删除配置 "${config.searchConfigs[configKey]?.name}" 吗？`)) {
                        delete config.searchConfigs[configKey];
                        // 如果删除的是当前配置，切换到默认配置
                        if (config.currentSearchConfig === configKey) {
                            config.currentSearchConfig = 'default';
                        }
                        if (saveConfig()) {
                            showNotification('配置已删除');
                            updateDisplay();
                        }
                    }
                });
            });
        }

        // 创建新配置
        panel.querySelector('#btn-create-config').addEventListener('click', function() {
            showEditConfigPanel(null, panel);
        });

        // 初始绑定
        bindConfigEvents();


        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
    }

    // 🆕 新增：配置编辑面板
    function showEditConfigPanel(configKey = null, parentPanel = null) {
        const isEdit = configKey !== null;
        const configItem = isEdit ? config.searchConfigs[configKey] : null;
        const availableEngines = Object.keys(config.searchEngines);

        const panel = createPanel(isEdit ? '编辑搜索配置' : '创建搜索配置', `
        <div class="panel-content">
            <div class="panel-content">
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">配置名称</label>
                    <input type="text" id="config-name" class="form-input" value="${isEdit ? configItem.name : ''}" placeholder="例如: 工作搜索、学习搜索等">
                </div>

                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">配置描述</label>
                    <input type="text" id="config-desc" class="form-input" value="${isEdit ? (configItem.description || '') : ''}" placeholder="简要描述这个配置的用途">
                </div>

                <div class="section-title">选择搜索引擎</div>
                <div style="max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
                    ${availableEngines.map(key => {
            const engine = config.searchEngines[key];
            const isSelected = isEdit ? configItem.engines.includes(key) : key === 'google';
            let iconDisplay = engine.icon;
            if (isImageUrl(engine.icon)) {
                iconDisplay = `<img src="${engine.icon}" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; border-radius: 2px;" onerror="handleImageError(this)">`;
            }

            return `
                            <div class="checkbox-item engine-checkbox-item" data-engine="${key}">
                                <input type="checkbox" id="config-engine-${key}" ${isSelected ? 'checked' : ''}>
                                <div class="checkbox-info">
                                    <div class="checkbox-title">${iconDisplay} ${engine.name}</div>
                                    <div class="checkbox-desc">${engine.webUrl || engine.appUrl}</div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>

                ${isEdit ? `
                <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #ffc107;">
                    <div style="font-weight: 600; color: #856404; margin-bottom: 4px;">⚠️ 注意</div>
                    <div style="font-size: 13px; color: #856404;">
                        默认配置无法删除，但可以修改名称、描述和搜索引擎选择。
                    </div>
                </div>
                ` : ''}
            </div>
        `);

        // 保存配置
        function saveConfigItem() {
            const name = panel.querySelector('#config-name').value.trim();
            const description = panel.querySelector('#config-desc').value.trim();

            if (!name) {
                showNotification('请输入配置名称');
                return false;
            }

            // 获取选中的搜索引擎
            const selectedEngines = [];
            panel.querySelectorAll('.engine-checkbox-item input[type="checkbox"]:checked').forEach(checkbox => {
                const engineKey = checkbox.closest('.engine-checkbox-item').dataset.engine;
                if (config.searchEngines[engineKey]) {
                    selectedEngines.push(engineKey);
                }
            });

            if (selectedEngines.length === 0) {
                showNotification('请至少选择一个搜索引擎');
                return false;
            }

            const finalConfigKey = isEdit ? configKey : 'config_' + Date.now();

            if (!config.searchConfigs) {
                config.searchConfigs = {};
            }

            config.searchConfigs[finalConfigKey] = {
                name: name,
                description: description,
                engines: selectedEngines
            };

            // 如果是新建配置，设置为当前配置
            if (!isEdit) {
                config.currentSearchConfig = finalConfigKey;
            }

            return saveConfig();
        }

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            if (saveConfigItem()) {
                showNotification(isEdit ? '配置已更新' : '配置已创建');
                panel.remove();
                if (parentPanel) {
                    parentPanel.remove();
                    showSearchConfigManagementPanel();
                }
            }
        },
                        isEdit ? '保存配置' : '创建配置'
                       );

        document.body.appendChild(panel);
    }


    // ================================
    // 全局样式
    // ================================

    const globalStyles = `
                    .floating-panel {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.5);
                        backdrop-filter: blur(8px);
                        z-index: 100000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        box-sizing: border-box;
                        animation: fadeIn 0.3s ease;
                    }

                    .panel-container {
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        max-width: 600px;
                        width: 100%;
                        max-height: 90vh;
                        overflow: hidden;
                        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .panel-header {
                        padding: 24px 28px;
                        border-bottom: 1px solid rgba(0,0,0,0.06);
                        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .panel-title {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 700;
                        color: #1e293b;
                        letter-spacing: -0.025em;
                    }

                    .close-btn {
                        background: rgba(148, 163, 184, 0.1);
                        border: none;
                        font-size: 18px;
                        color: #64748b;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 12px;
                        transition: all 0.2s ease;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .close-btn:hover {
                        background: rgba(239, 68, 68, 0.1);
                        color: #ef4444;
                        transform: scale(1.05);
                    }

                    .panel-content {
                        padding: 28px;
                        max-height: 60vh;
                        overflow-y: auto;
                        background: #ffffff;
                    }

                    /* 所有面板中的多行输入框允许拖动高度 */
                    .floating-panel textarea {
                        resize: vertical;
                    }

                    .panel-footer {
                        padding: 20px 24px;
                        border-top: 1px solid #f0f0f0;
                        display: flex;
                        gap: 12px;
                        justify-content: flex-end;
                    }

                    .btn {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                    }

                    .btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                        transition: left 0.5s;
                    }

                    .btn:hover::before {
                        left: 100%;
                    }

                    .btn-cancel {
                        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                        color: #64748b;
                        border: 1px solid rgba(148, 163, 184, 0.2);
                    }

                    .btn-cancel:hover {
                        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(148, 163, 184, 0.3);
                    }

                    .btn-primary {
                        background: linear-gradient(135deg, #65aaff 0%, #6173f4 100%);
                        color: white;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.05);
                    }

                    .btn-primary:hover {
                        background: linear-gradient(135deg, #65aaff 0%, #6173f4 50%);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1)
                    }

                    .btn-success {
                        background: linear-gradient(135deg, #65aaff 0%, #6173f4 100%);
                        color: white;
                        box-shadow: 0 4px 15px rgb(163 153 226 / 30%);
                    }

                    .btn-success:hover {
                        background: linear-gradient(135deg, #0990ff 0%, #513bde 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgb(16 37 185 / 21%);
                    }

                    .option-item {
                        padding: 20px;
                        border: 1px solid rgba(148, 163, 184, 0.2);
                        border-radius: 16px;
                        margin-bottom: 16px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        position: relative;
                        overflow: hidden;
                    }

                    .option-item::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: none;
                    }

                            .option-item:hover,.engine-checkbox-item:hover,
        .checkbox-item:hover{
          border-color: var(--smart-link-primary-color, #3b82f6);
          background: linear-gradient(
            135deg,
            rgb(from var(--smart-link-primary-color, #3b82f6) r g b / 0.15),
            rgb(from var(--smart-link-secondary-color, #60a5fa) r g b / 0.1)
          ) !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgb(from var(--smart-link-secondary-color, #3b82f6) r g b / 0.2) !important;
        }

        .option-item.selected {
          border-color: var(--smart-link-primary-color, #3b82f6);
          background: linear-gradient(
            135deg,
            rgb(from var(--smart-link-primary-color, #3b82f6) r g b / 0.3),
            rgb(from var(--smart-link-secondary-color, #60a5fa) r g b / 0.2)
          ) !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgb(from var(--smart-link-secondary-color, #3b82f6) r g b / 0.2) !important;
        }


                    .option-radio {
                        margin-right: 12px;
                    }

                    .option-icon {
                        font-size: 20px;
                        margin-right: 12px;
                        width: 24px;
                        text-align: center;
                    }

                    .option-info {
                        flex: 1;
                    }

                    .option-title {
                        font-weight: 600;
                        color: #1a1a1a;
                        margin-bottom: 4px;
                    }

                    .option-desc {
                        color: #666;
                        font-size: 13px;
                        line-height: 1.4;
                    }

                    .checkbox-item {
                        display: flex;
                        align-items: center;
                        padding: 16px;
                        border: 1px solid #e9ecef;
                        border-radius: 8px;
                        margin-bottom: 12px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }


                    .checkbox-item input {
                        margin-right: 12px;
                        width: 18px;
                        height: 18px;
                    }

                    .checkbox-info {
                        flex: 1;
                    }

                    .checkbox-title {
                        font-weight: 600;
                        color: #1a1a1a;
                        margin-bottom: 2px;
                    }

                    .checkbox-desc {
                        color: #666;
                        font-size: 13px;
                    }

                    .pattern-list {
                        margin-bottom: 24px;
                    }

                    .pattern-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        border: 1px solid #e9ecef;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        background: #f8f9fa;
                    }

                    .pattern-info {
                        flex: 1;
                        min-width: 0;
                    }

                    .pattern-domain {
                        font-weight: 600;
                        color: #1a1a1a;
                        margin-bottom: 4px;
                        word-break: break-all;
                    }

                    .pattern-regex {
                        color: #666;
                        font-size: 12px;
                        word-break: break-all;
                        font-family: monospace;
                    }

                    .pattern-actions {
                        display: flex;
                        gap: 8px;
                        margin-left: 12px;
                    }

                    .btn-small {
                        padding: 6px 12px;
                        border: 1px solid;
                        border-radius: 12px;
                        font-size: 12px;
                        cursor: pointer;
                        background: white;
                        transition: all 0.2s;
                    }

                    .btn-edit {
                        border-color: #4A7BFF;
                        color: #4A7BFF;
                    }

                    .btn-edit:hover {
                        background:#4A7BFF;
                        color: white;
                    }

                    .btn-delete {
                        border-color: #dc3545;
                        color: #dc3545;
                    }

                    .btn-delete:hover {
                        background: #dc3545;
                        color: white;
                    }

                    .add-section {
                        background: #f8f9fa;
                        padding: 16px;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                    }

                    .section-title {
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: #1a1a1a;
                        font-size: 16px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #f0f0f0;
                    }

                    .input-group {
                        margin-bottom: 12px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 14px 16px;
                        border: 2px solid rgba(148, 163, 184, 0.2);
                        border-radius: 12px;
                        font-size: 14px;
                        box-sizing: border-box;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        color: #1e293b;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #3b82f6;
                        background: #ffffff;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                        transform: translateY(-1px);
                    }

                    .form-textarea {
                        width: 100%;
                        padding: 14px 16px;
                        border: 2px solid rgba(148, 163, 184, 0.2);
                        border-radius: 12px;
                        font-size: 14px;
                        box-sizing: border-box;
                        min-height: 100px;
                        resize: vertical;
                        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        color: #1e293b;
                    }

                    .form-textarea:focus {
                        outline: none;
                        border-color: #3b82f6;
                        background: #ffffff;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                        transform: translateY(-1px);
                    }

                    .empty-state {
                        text-align: center;
                        color: #666;
                        padding: 40px 20px;
                        font-style: italic;
                    }

                    .search-engine-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        border: 1px solid #e9ecef;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        background: #f8f9fa;
                    }

                    .search-engine-info {
                        flex: 1;
                        min-width: 0;
                    }

                    .search-engine-name {
                        font-weight: 600;
                        color: #1a1a1a;
                        margin-bottom: 4px;
                    }

                    .search-engine-urls {
                        color: #666;
                        font-size: 12px;
                        word-break: break-all;
                        font-family: monospace;
                    }

                    .search-engine-actions {
                        display: flex;
                        gap: 8px;
                        margin-left: 12px;
                    }

                    .search-engine-edit-form {
                        padding: 16px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                    }

                    .edit-form-group {
                        margin-bottom: 12px;
                    }

                    .edit-form-group label {
                        display: block;
                        margin-bottom: 4px;
                        font-weight: 600;
                        color: #1a1a1a;
                        font-size: 14px;
                    }

                    .edit-form-group .form-input {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        transition: border-color 0.2s ease;
                    }

                    .edit-form-group .form-input:focus {
                        outline: none;
                        border-color: #4CAF50;
                        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
                    }

                    .edit-form-actions {
                        display: flex;
                        gap: 8px;
                        justify-content: flex-end;
                        margin-top: 16px;
                    }

                    .btn-cancel {
                        background: #6c757d;
                        color: white;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.2s ease;
                    }

                    .btn-cancel:hover {
                        background: #5a6268;
                    }

                    .visual-selector-highlight {
                        position: relative;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        cursor: pointer;
                        border-radius: 8px;
                    }

                    .visual-selector-active {
                        position: relative;
                        border-radius: 12px;
                    }

                    .visual-selector-active::before {
                        content: '';
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        right: -3px;
                        bottom: -3px;
                        border: 1px solid var(--smart-link-primary-color, #3b82f6);
                        border-radius: 12px;
                        background: linear-gradient(135deg, rgb(from var(--smart-link-primary-color, #3b82f6) r g b / 0.13), rgb(from var(--smart-link-secondary-color, #60a5fa) r g b / 0.1)) !important;
                        z-index: 9999;
                        pointer-events: none;
                        opacity: 1;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        animation: pulse 2s infinite;
                    }



                    .search-preview {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        padding: 16px;
                        border-radius: 12px;
                        margin: 16px 0;
                        border: 1px solid rgba(148, 163, 184, 0.2);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    }

                    .search-preview-title {
                        font-weight: 700;
                        margin-bottom: 12px;
                        color: #1e293b;
                        font-size: 14px;
                    }

                    .search-preview-url {
                        font-size: 13px;
                        color: #64748b;
                        word-break: break-all;
                        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                        background: rgba(255,255,255,0.7);
                        padding: 8px 12px;
                        border-radius: 8px;
                        border: 1px solid rgba(148, 163, 184, 0.1);
                    }

                    .button-group-expanded {
                        position: fixed;
                        z-index: 99998;
                        display: flex;
                        gap: 12px;
                        align-items: center;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
                        padding: 16px 20px;
                        border-radius: 24px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        animation: popIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            backdrop-filter: blur(0px);
                        }
                        to {
                            opacity: 1;
                            backdrop-filter: blur(8px);
                        }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes popIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* 移动端适配 */
                    @media (max-width: 768px) {
                        .floating-panel {
                            padding: 10px;
                        }

                        .panel-container {
                            max-width: 100%;
                            margin: 0;
                        }

                        .panel-header,
                        .panel-content,
                        .panel-footer {
                            padding: 16px;
                        }

                        .pattern-item {
                            flex-direction: column;
                            align-items: stretch;
                            gap: 12px;
                        }

                        .pattern-actions {
                            margin-left: 0;
                            justify-content: flex-end;
                        }
                        .reading-list-header button,
                        .panel-content button,
                        .panel-content button.btn{
                            font-size:var(--smart-link-font-size,12px) !important
                        }
                     }

                    @media (max-width: 480px) {
                        .panel-footer {
                            flex-direction: column;
                        }

                        .btn {
                            width: 100%;
                        }
                    }


                /* ================================
                   全新马卡龙糖果色样式设置界面
                ================================ */

                .style-preview-container {
                    background: linear-gradient(135deg, #faf7ff 0%, #f5f3ff 100%);
                    padding: 28px;
                    border-radius: 20px;
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    margin-bottom: 28px;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                    position: relative;
                    overflow: hidden;
                }

                .style-preview-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #ff6b9d, #74b9ff, #ff8fab, #a29bfe);
                    background-size: 200% 100%;
                    animation: gradientShift 3s ease infinite;
                }

                .style-preview-demo {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 16px 28px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--preview-primary, #ff6b9d), var(--preview-secondary, #ff8fab));
                    color: white;
                    font-weight: 800;
                    font-size: 16px;
                    margin-bottom: 20px;
                    box-shadow: var(--preview-shadow, 0 12px 40px rgba(255, 159, 243, 0.4));
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    cursor: pointer;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                }

                .style-preview-demo::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.6s;
                }

                .style-preview-demo:hover::before {
                    left: 100%;
                }

                .style-preview-demo:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: var(--preview-shadow-hover, 0 20px 50px rgba(255, 159, 243, 0.6));
                }

                .style-preview-text {
                    color: #6c757d;
                    font-size: 14px;
                    line-height: 1.6;
                    font-weight: 500;
                }

                .style-section {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
                    padding: 24px;
                    border-radius: 20px;
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    margin-bottom: 24px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
                    position: relative;
                }

                .style-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #ff6b9d, #74b9ff, #ff8fab);
                    border-radius: 20px 20px 0 0;
                }

                .style-section-title {
                    font-weight: 800;
                    color: #2d3748;
                    margin-bottom: 20px;
                    font-size: 17px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    letter-spacing: -0.3px;
                }

                .style-section-title .icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
                    color: white;
                    font-size: 16px;
                }

                .color-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .color-picker-group {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 16px;
                    border: 1.5px solid rgba(255, 255, 255, 0.5);
                    transition: all 0.3s ease;
                }

                .color-picker-group:hover {
                    background: rgba(255, 255, 255, 0.9);
                    border-color: rgba(255, 159, 243, 0.3);
                    transform: translateY(-2px);
                }

                .color-picker-wrapper {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                }

                .color-picker-wrapper:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }

                .color-picker {
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .color-input-group {
                    flex: 1;
                }

                .color-label {
                    display: block;
                    font-weight: 700;
                    color: #4a5568;
                    margin-bottom: 6px;
                    font-size: 13px;
                    letter-spacing: 0.5px;
                }

                .color-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    border-radius: 12px;
                    font-size: 13px;
                    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                    background: rgba(255, 255, 255, 0.8);
                    transition: all 0.3s ease;
                    font-weight: 600;
                    color: #2d3748;
                }

                .color-input:focus {
                    outline: none;
                    border-color: #ff6b9d;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(255, 159, 243, 0.1);
                }

                .slider-container {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 16px;
                    border: 1.5px solid rgba(255, 255, 255, 0.5);
                }

                .slider-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .slider-label {
                    font-weight: 700;
                    color: #4a5568;
                    font-size: 14px;
                }

                .slider-value {
                    color: #ff6b9d;
                    font-size: 14px;
                    font-weight: 800;
                    background: rgba(255, 159, 243, 0.1);
                    padding: 4px 12px;
                    border-radius: 20px;
                }

                .slider {
                    width: 100%;
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #e9d8fd, var(--slider-color, #ff6b9d));
                    outline: none;
                    -webkit-appearance: none;
                    transition: all 0.3s ease;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: var(--slider-color, #ff6b9d);
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(255, 159, 243, 0.4);
                    border: 3px solid white;
                    transition: all 0.3s ease;
                }

                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 6px 20px rgba(255, 159, 243, 0.6);
                }

                .toggle-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
                    border-radius: 20px;
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    margin-bottom: 24px;
                    backdrop-filter: blur(10px);
                }

                .toggle-info h3 {
                    font-weight: 800;
                    color: #2d3748;
                    margin-bottom: 6px;
                    font-size: 16px;
                }

                .toggle-info p {
                    color: #718096;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 32px;
                }

                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #cbd5e1, #94a3b8);
                    border-radius: 34px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }

                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 24px;
                    width: 24px;
                    left: 4px;
                    bottom: 4px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .toggle-switch input:checked + .toggle-slider {
                    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
                }

                .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(28px);
                }

                .preset-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-top: 20px;
                }

                .preset-card {
                    padding: 20px 12px;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .preset-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--preset-color);
                }

                .preset-card:hover {
                    transform: translateY(-4px) scale(1.02);
                    border-color: var(--preset-color);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
                }

                .preset-card.active {
                    border-color: var(--preset-color);
                    background: white;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }

                .preset-color {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    margin: 0 auto 12px;
                    background: var(--preset-gradient);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .preset-name {
                    font-weight: 800;
                    color: #2d3748;
                    font-size: 12px;
                    margin-bottom: 4px;
                }

                .preset-desc {
                    color: #718096;
                    font-size: 10px;
                    font-weight: 500;
                }

                .style-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 28px;
                        height: 20px;
                }

                .style-action-btn {
                    padding: 18px 24px;
                    border: none;
                    border-radius: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 15px;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                }

                .style-action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.6s;
                }

                .style-action-btn:hover::before {
                    left: 100%;
                }

                .style-reset-btn {
                    background: linear-gradient(135deg, #f7fafc, #edf2f7);
                    color: #718096;
                }

                .style-reset-btn:hover {
                    background: linear-gradient(135deg, #edf2f7, #e2e8f0);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
                    color: #4a5568;
                }


                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }

                .floating {
                    animation: float 3s ease-in-out infinite;
                }
                .active-config {
        border-left: 4px solid #4CAF50 !important;
        background: #f8fff8 !important;
    }

    .engine-checkbox-item {
        padding: 12px 16px;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        margin-bottom: 8px;
        background: #fafbfc;
        transition: all 0.2s ease;
        cursor: pointer;
    }


    .engine-checkbox-item input[type="checkbox"] {
        margin-right: 12px;
        transform: scale(1.2);
    }

    /* 🆕 修改：蓝色主题的配置选择区域样式 */
.config-selection-section {
    background: linear-gradient(135deg, var(--smart-link-background-color, #f8fafc), rgba(255, 255, 255, 0.9));
    border: 1.5px solid rgba(59, 130, 246, 0.15);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
    position: relative;
    overflow: hidden;
}

.config-selection-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--smart-link-primary-color, #3b82f6), var(--smart-link-secondary-color, #60a5fa));
    border-radius: 16px 16px 0 0;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.section-icon {
    font-size: 20px;
    background: linear-gradient(135deg, var(--smart-link-primary-color, #3b82f6), var(--smart-link-secondary-color, #60a5fa));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-title {
    font-weight: 700;
    color: var(--smart-link-text-color, #1e293b);
    font-size: 16px;
    letter-spacing: -0.3px;
}

.config-badge {
    background: linear-gradient(135deg, var(--smart-link-primary-color, #3b82f6), var(--smart-link-secondary-color, #60a5fa));
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-left: auto;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.config-select-row {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
}

.elegant-select {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
    color: var(--smart-link-text-color, #1e293b);
    transition: all 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
}

.elegant-select:focus {
    outline: none;
    border-color: var(--smart-link-primary-color, #3b82f6);
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.config-actions {
    display: flex;
    gap: 8px;
}

.elegant-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.elegant-btn.primary {
    background: linear-gradient(135deg, var(--smart-link-primary-color, #3b82f6), var(--smart-link-secondary-color, #60a5fa));
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.elegant-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.elegant-btn.secondary {
    background: rgba(59, 130, 246, 0.1);
    color: var(--smart-link-primary-color, #3b82f6);
    border: 1.5px solid rgba(59, 130, 246, 0.2);
}

.elegant-btn.secondary:hover {
    background: rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.btn-icon {
    font-size: 14px;
}

.btn-text {
    white-space: nowrap;
}

.config-description {
    color: var(--smart-link-text-color, #64748b);
    font-size: 13px;
    line-height: 1.4;
    padding: 8px 12px;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 8px;
    border-left: 3px solid var(--smart-link-primary-color, #3b82f6);
}

/* 🆕 蓝色主题的配置管理面板样式 */
.active-config {
    border-left: 4px solid var(--smart-link-primary-color, #3b82f6) !important;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05)) !important;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1) !important;
}

.pattern-item {
    transition: all 0.3s ease;
    border: 1.5px solid rgba(59, 130, 246, 0.1) !important;
}

.pattern-item:hover {
    border-color: var(--smart-link-primary-color, #3b82f6) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.15) !important;
}

/* 🆕 蓝色主题的搜索引擎选择区域 */
.engine-checkbox-item {
    padding: 14px 16px;
    border: 1.5px solid rgba(59, 130, 246, 0.1);
    border-radius: 12px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
    transition: all 0.3s ease;
    cursor: pointer;
    backdrop-filter: blur(5px);
}

.engine-checkbox-item:hover {
    border-color: var(--smart-link-primary-color, #3b82f6);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.engine-checkbox-item input[type="checkbox"] {
    margin-right: 12px;
    transform: scale(1.2);
    accent-color: white;
}


/* 🆕 蓝色主题的配置管理项样式 */
.config-management-item {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
    border: 1.5px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.config-management-item:hover {
    border-color: var(--smart-link-primary-color, #3b82f6);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.config-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.config-name {
    font-weight: 700;
    color: var(--smart-link-text-color, #1e293b);
    font-size: 16px;
}

.config-engine-count {
    background: linear-gradient(135deg, var(--smart-link-primary-color, #3b82f6), var(--smart-link-secondary-color, #60a5fa));
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
}

.config-engines {
    color: var(--smart-link-text-color, #475569);
    font-size: 13px;
    margin-bottom: 8px;
    line-height: 1.4;
}

.config-management-item .config-description {
    background: rgba(59, 130, 246, 0.08);
    border-left: 3px solid var(--smart-link-primary-color, #3b82f6);
    margin-bottom: 12px;
}

.config-management-item .config-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.elegant-btn.small {
    padding: 6px 10px;
    font-size: 12px;
}

.elegant-btn.danger {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.elegant-btn.danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

/* 🆕 新增：统计徽章样式 */
.config-stats {
    display: flex;
    gap: 6px;
}

.stat-badge {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
}

.engine-count {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
}

.link-count {
    background: linear-gradient(135deg, #10b981, #34d399);
    color: white;
}

/* 🆕 链接测试按钮样式 */
.btn-test {
    background: #10b981 !important;
    color: white !important;
    border: none !important;
}

.btn-test:hover {
    background: #059669 !important;
    transform: scale(1.05);
}

#btn-paste-clipboard,
#btn-paste-links,
#btn-show-all,
#save-style-btn,
button.btn-primary.btn-small,
#open-all-links,
#btn-clear-links,
#copy-all-links
{
background:linear-gradient(135deg, var(--smart-link-primary-color,#65aaff 0%), var(--smart-link-secondary-color,#6173f4 100%)) !important;
border-radius:var(--smart-link-border-radius,12px) !important;
border: none !important;
color:white  !important;
}
#btn-validate-links,
#btn-clear-text,
#clear-all,
#btn-reading-category-manage,
button.btn-delete,
button.btn-cancel,
#btn-reset-buttons,
#reset-style-btn
{
background:#6c757d !important;
border-radius:var(--smart-link-border-radius,12px) !important;
color:white  !important;
border: none !important;
}


#btn-hide-all,
.btn-edit-cat
{
background: linear-gradient(135deg,
  var(--smart-link-primary-color,#65aaff),
  color-mix(in srgb, var(--smart-link-primary-color,#6173f4) 50%, transparent)) !important;
border-radius:var(--smart-link-border-radius,12px) !important;
border: none !important;
color:white  !important;
}
/* 🆕 修改：加强输入框样式隔离，确保等宽 */
    .floating-panel .form-input,
    .floating-panel .form-textarea,
    .floating-panel .elegant-select,
    .floating-panel .color-input {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
    }

    /* 🆕 修改：确保输入框容器也正确设置宽度 */
    .floating-panel .input-group {
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* 🆕 修改：面板内容区域确保正确宽度 */
    .floating-panel .panel-content {
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* 🆕 修改：面板容器确保正确宽度 */
    .floating-panel .panel-container {
        width: 100% !important;
        max-width: 600px !important;
        box-sizing: border-box !important;
    }

    /* 🆕 修改：修复可能的外部样式影响 */
    .floating-panel input[type="text"],
    .floating-panel input[type="color"],
    .floating-panel select {
        all: unset !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
    }

    /* 复位后恢复 textarea 的滚动与拖动能力 */
    .floating-panel textarea {
        overflow: auto !important;
        resize: vertical !important;
    }

    /* 加强：针对带有类名的多行输入框，确保可拖动与可滚动 */
    .floating-panel .form-textarea {
        overflow: auto !important;
        resize: vertical !important;
        height: auto !important; /* 防止固定高度阻止拖动 */
        min-height: 100px !important; /* 维持基础可视高度 */
    }

    /* 🆕 修改：重新应用我们的样式 */
    .floating-panel .form-input,
    .floating-panel .form-textarea,
    .floating-panel .elegant-select,
    .floating-panel .color-input {
        width: 100% !important;
        padding: 14px 16px !important;
        border: 2px solid rgba(148, 163, 184, 0.2) !important;
        border-radius: 12px !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        color: #1e293b !important;
        font-family: inherit !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .floating-panel .form-input:focus,
    .floating-panel .form-textarea:focus {
        outline: none !important;
        border-color: #3b82f6 !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        transform: translateY(-1px) !important;
    }

    /* 🆕 修改：修复自定义样式中的输入框宽度 */
    .floating-panel .form-input:not(.smart-link-dragging),
    .floating-panel .form-textarea:not(.smart-link-dragging) {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 7px 20px !important;
        border-radius: 20px !important;
        border: 2px solid #e0dede !important;
    }

    /* 🆕 修改：修复颜色选择器显示 */
    .floating-panel input[type="color"] {
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        width: 48px !important;
        height: 48px !important;
        border: none !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }

    /* 🆕 修改：颜色选择器悬停效果 */
    .floating-panel input[type="color"]:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
    }

    /* 🆕 修改：颜色选择器激活状态 */
    .floating-panel input[type="color"]:active {
        transform: scale(1.05) !important;
    }

    /* 🆕 修改：颜色选择器聚焦状态 */
    .floating-panel input[type="color"]:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
    }

    /* 🆕 修改：颜色选择器包装器 */
    .floating-panel .color-picker-wrapper {
        position: relative !important;
        width: 48px !important;
        height: 48px !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
    }

    /* 🆕 修改：修复颜色选择器在自定义样式中的显示 */
    .floating-panel .color-picker {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        display: block !important;
    }

    /* 🆕 修改：颜色选择器在Webkit浏览器中的样式 */
    .floating-panel input[type="color"]::-webkit-color-swatch {
        border: none !important;
        border-radius: 10px !important;
        padding: 0 !important;
    }

    .floating-panel input[type="color"]::-webkit-color-swatch-wrapper {
        border: none !important;
        border-radius: 10px !important;
        padding: 0 !important;
    }

    /* 🆕 修改：颜色选择器在Firefox中的样式 */
    .floating-panel input[type="color"]::-moz-color-swatch {
        border: none !important;
        border-radius: 10px !important;
    }

    .floating-panel input[type="color"]::-moz-focus-inner {
        border: none !important;
        padding: 0 !important;
    }

    /* 🆕 修改：颜色输入组的布局 */
    .floating-panel .color-picker-group {
        display: flex !important;
        align-items: center !important;
        gap: 16px !important;
        padding: 16px !important;
        background: rgba(255, 255, 255, 0.7) !important;
        border-radius: 16px !important;
        border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
        transition: all 0.3s ease !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* 🆕 修改：确保颜色选择器在网格布局中正确显示 */
    .floating-panel .color-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 20px !important;
        margin-bottom: 20px !important;
        width: 100% !important;
    }

    .btn-edit,div#hotkey-input-search{
    border-color: var(--smart-link-primary-color,#4A7BFF) !important;
    color: var(--smart-link-primary-color,#4A7BFF) !important;
    background: white!important

}
.btn-edit:hover {
    border-color: var(--smart-link-primary-color,#4A7BFF) !important;
    color: white !important;
    background: var(--smart-link-primary-color,#4A7BFF) !important;

}

    /* 🆕 统一按钮组与工具条样式 */
    .btn-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 8px;
    }
    .btn-group.equal > .btn {
        flex: 1 1 0;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
    }

    /* 🆕 面板内通用栅格布局（左右两列自适应换行）*/
    .panel-grid {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    .panel-col {
        flex: 1 1 360px;
        min-width: 320px;
    }

    /* 🆕 链接预览区域 */
    .links-preview {
        display: none;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        padding: 12px;
        border-radius: 8px;
        max-height: 160px;
        overflow: auto;
        font-size: 12px;
        line-height: 1.5;
    }

    /* 🆕 常用辅助类 */
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .muted { color: #666; }
    .hint { font-size: 12px; color: #777; }
    .input-small { width: 120px; }
    .tall { min-height: 140px; }

    .btn-secondary {background: linear-gradient(135deg, var(--smart-link-primary-color, #65aaff),
 color-mix(in srgb, var(--smart-link-primary-color, #6173f4) 50%, transparent)) !important;
    border-radius: var(--smart-link-border-radius, 12px) !important;
    border: none !important;
    color: white !important;}

.reading-list-header div:nth-of-type(2) button
{font-size:var(--smart-link-font-size,12px)!important}
input.eh-input,.eh-textarea{width: -webkit-fill-available !important;}

/* 🆕 元素选择器高亮框样式 */
    .element-picker-highlight {
        position: absolute;
        background: rgba(255, 105, 180, 0.1);
        border: 2px solid #ff69b4;
        border-radius: 4px;
        box-shadow: 0 0 0 1px white, 0 0 10px rgba(255, 105, 180, 0.7);
        pointer-events: none;
        z-index: 2147483640; /* 略低于面板 */
        display: none;
        transition: all 0.1s ease;
    }
    /* 🆕 GitHub 上传器样式 (已根据原脚本优化) */
    .gh-press-ring {
        position: fixed; pointer-events: none; z-index: 10001;
        transform: translate(-50%, -50%) rotate(-90deg);
        opacity: 0; transition: opacity 0.1s;
    }
    .gh-ring-circle {
        fill: none; stroke-width: 4; stroke-linecap: round;
        stroke: var(--smart-link-primary-color, #a29bfe);
        stroke-dasharray: 100; stroke-dashoffset: 100;
    }

    /* SweetAlert2 磨砂质感覆盖 */
    div:where(.swal2-container) div:where(.swal2-popup) {
        background: rgba(255, 255, 255, 0.85) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        border-radius: 24px !important;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        padding: 0 !important;
        font-family: inherit !important;
    }

    /* 悬浮上传菜单 */
    .gh-float-menu {
        position: fixed; z-index: 10000; padding: 10px 24px; cursor: pointer;
        display: flex; align-items: center; gap: 8px;
        font-size: 14px; font-weight: 800;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        color: var(--smart-link-primary-color, #6c5ce7);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation: gh-pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0; animation-fill-mode: forwards;
        user-select: none;
    }
    .gh-float-menu:hover {
        transform: scale(1.08) translateY(-4px);
        background: linear-gradient(135deg, var(--smart-link-primary-color), var(--smart-link-secondary-color));
        color: #fff;
    }
    .gh-float-menu svg { width: 18px; height: 18px; fill: currentColor; }

    @keyframes gh-pop-in { from{opacity:0; transform:scale(0.5)} to{opacity:1; transform:scale(1)} }

    /* 设置面板样式 */
    .gh-config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; text-align: left; }
    .gh-form-group.full-width { grid-column: 1 / -1; }
    .gh-label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 700; margin-left: 4px; }
            `;

    // 注入全局样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(globalStyles);
    } else {
        const style = document.createElement('style');
        style.textContent = globalStyles;
        document.head.appendChild(style);
        console.log('全局样式已注入'); // 添加调试信息
    }

    // 批量打开链接面板专用轻量样式
    try {
        GM_addStyle(`
          .bl-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:12px}
          @media (max-width: 1200px){.bl-grid{grid-template-columns:1fr}}
          .panel-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
          .panel-card .btn-group{margin-top:8px}
          .panel-card-title{font-weight:600;color:#111827;display:flex;align-items:center;gap:6px;margin-bottom:6px}
          .panel-card-title .badge{margin-left:auto;font-size:12px;color:#6b7280}
          .form-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
          .form-row .form-input{flex:1 1 0}
          .toolbar{display:flex;gap:8px;margin-top:8px}
          .toolbar .btn{flex:1 1 0}
          .links-preview{margin-top:10px}
          .badge{display:inline-flex;align-items:center;gap:4px;background:#f3f4f6;border:1px solid #e5e7eb;color:#4b5563;border-radius:999px;padding:2px 8px}
        `);
    } catch(_) {}

    // ================================
    // 快捷键系统
    // ================================

    let hotkeyListeners = [];

    function formatHotkey(hotkey) {
        if (!hotkey) return '';
        return hotkey.toLowerCase().replace(/\s+/g, '');
    }

    function parseHotkey(hotkey) {
        if (!hotkey) return null;

        const parts = hotkey.toLowerCase().split('+').map(p => p.trim());
        const modifiers = {
            ctrl: false,
            alt: false,
            shift: false,
            meta: false
        };
        let key = '';

        for (const part of parts) {
            switch (part) {
                case 'ctrl':
                case 'control':
                    modifiers.ctrl = true;
                    break;
                case 'alt':
                    modifiers.alt = true;
                    break;
                case 'shift':
                    modifiers.shift = true;
                    break;
                case 'meta':
                case 'cmd':
                case 'command':
                    modifiers.meta = true;
                    break;
                default:
                    key = part;
            }
        }

        return { modifiers, key };
    }

    function isHotkeyMatch(event, hotkeyConfig) {
        if (!hotkeyConfig) return false;

        const { modifiers, key } = hotkeyConfig;

        return event.ctrlKey === modifiers.ctrl &&
            event.altKey === modifiers.alt &&
            event.shiftKey === modifiers.shift &&
            event.metaKey === modifiers.meta &&
            event.key.toLowerCase() === key;
    }

    function registerHotkey(hotkey, callback) {
        if (!hotkey) return null;

        const hotkeyConfig = parseHotkey(hotkey);
        if (!hotkeyConfig) return null;

        const listener = function(event) {
            if (isHotkeyMatch(event, hotkeyConfig)) {
                event.preventDefault();
                event.stopPropagation();
                callback();
            }
        };

        document.addEventListener('keydown', listener);
        hotkeyListeners.push({ hotkey, listener });

        return listener;
    }

    function unregisterAllHotkeys() {
        hotkeyListeners.forEach(({ listener }) => {
            document.removeEventListener('keydown', listener);
        });
        hotkeyListeners = [];
    }

    function registerAllHotkeys() {
        unregisterAllHotkeys();

        // 注册所有快捷键
        if (config.hotkeys['app-open']) {
            registerHotkey(config.hotkeys['app-open'], handleAppButtonClick);
        }
        if (config.hotkeys['copy-link']) {
            registerHotkey(config.hotkeys['copy-link'], handleCopyButtonClick);
        }
        if (config.hotkeys['visual-search']) {
            registerHotkey(config.hotkeys['visual-search'], startVisualSelection);
        }
        if (config.hotkeys['input-search']) {
            registerHotkey(config.hotkeys['input-search'], showInputSearchPrompt);
        }
        if (config.hotkeys['reading-list']) {
            registerHotkey(config.hotkeys['reading-list'], addToReadingList);
        }
        if (config.hotkeys['clean-url']) {
            registerHotkey(config.hotkeys['clean-url'], handleCleanUrl);
        }
        if (config.hotkeys['config-panel']) {
            registerHotkey(config.hotkeys['config-panel'], showConfigPanel);
        }
        if (config.hotkeys['search-panel']) {
            registerHotkey(config.hotkeys['search-panel'], () => showMultiSearchPanel());
        }
        if (config.hotkeys['reading-list-panel']) {
            registerHotkey(config.hotkeys['reading-list-panel'], showReadingListPanel);
        }
        if (config.hotkeys['direct-search-panel']) {
            registerHotkey(config.hotkeys['direct-search-panel'], showDirectSearchPanel);
        }
        if (config.hotkeys['clipboard-search']) {
            registerHotkey(config.hotkeys['clipboard-search'], searchClipboardContent);
        }
        if (config.hotkeys['batch-open-links']) {
            registerHotkey(config.hotkeys['batch-open-links'], startRectangleSelection);
        }
        if (config.hotkeys['batch-paste-links']) {
            registerHotkey(config.hotkeys['batch-paste-links'], showBatchLinksPanel);
        }
        if (config.hotkeys['batch-tools-panel']) {
            registerHotkey(config.hotkeys['batch-tools-panel'], showBatchToolsPanel);
        }
        if (config.hotkeys['toggle-all-buttons']) {
            registerHotkey(config.hotkeys['toggle-all-buttons'], toggleAllButtons);
        }
        if (config.hotkeys['toggle-display-mode']) {
            registerHotkey(config.hotkeys['toggle-display-mode'], toggleDisplayMode);
        }
        if (config.hotkeys['html2md']) {
            registerHotkey(config.hotkeys['html2md'], startHtmlToMarkdownPicker);
        }
        if (config.hotkeys['element-hider']) {
            registerHotkey(config.hotkeys['element-hider'], toggleElementHiderPanel);
        }
        if (config.hotkeys['scroll-top']) {
            registerHotkey(config.hotkeys['scroll-top'], scrollPageTop);
        }
        if (config.hotkeys['scroll-bottom']) {
            registerHotkey(config.hotkeys['scroll-bottom'], scrollPageBottom);
        }
        if (config.hotkeys['auto-scroll-toggle']) {
            registerHotkey(config.hotkeys['auto-scroll-toggle'], toggleAutoScroll);
        }
        if (config.hotkeys['element-selector']) {
            registerHotkey(config.hotkeys['element-selector'], toggleElementPicker);
        }
        if (config.hotkeys['github-upload']) {
            registerHotkey(config.hotkeys['github-upload'], toggleGhUploader);
        }
    }
    // 🆕 新增：统一的URL Scheme配置面板
    function showUrlSchemeConfigPanel() {
        const domainSchemes = config.domainUrlSchemes || {};
        const currentDomain = window.location.hostname;

        const schemeListHTML = Object.keys(domainSchemes).map(domain => `
                <div class="pattern-item">
                    <div class="pattern-info">
                        <div class="pattern-domain">${escapeHTML(domain)} ${domain === currentDomain ? '<span style="color: #4CAF50; font-size: 12px;">(当前网站)</span>' : ''}</div>
                        <div class="pattern-regex">${escapeHTML(domainSchemes[domain])}</div>
                    </div>
                    <div class="pattern-actions">
                        <button class="btn-small btn-edit" data-domain="${escapeHTML(domain)}">编辑</button>
                        <button class="btn-small btn-delete" data-domain="${escapeHTML(domain)}">删除</button>
                    </div>
                </div>
            `).join('');

        const panel = createPanel('URL Scheme配置', `
                <div class="panel-content">
                    <!-- 全局设置区域 -->
                    <div class="section-title">全局设置</div>

                    <div class="checkbox-item">
                        <input type="checkbox" id="toggle-global-scheme" ${config.useGlobalScheme ? 'checked' : ''}>
                        <div class="checkbox-info">
                            <div class="checkbox-title">全局使用通用Scheme</div>
                            <div class="checkbox-desc">开启后忽略域名专用Scheme，所有网站都使用通用Scheme</div>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1a1a1a;">通用URL Scheme</label>
                        <input type="text" id="global-scheme-input" value="${escapeHTML(config.urlScheme)}" class="form-input" placeholder="例如: teak-http:// 或 myapp://">
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">
                            所有网站默认使用的URL Scheme格式
                        </div>
                    </div>

                    <!-- 当前状态显示 -->
        <div style="background: #e8f5e8; padding: 12px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #4CAF50;">
            <div style="font-weight: 600; color: #2e7d32; margin-bottom: 4px;">📊 功能状态</div>
            <div style="font-size: 13px; color: #2e7d32;">
                • 工作模式: <strong>${config.useGlobalScheme ? '全局通用模式' : '域名专用模式'}</strong><br>
                • 当前域名: <strong>${escapeHTML(currentDomain)}</strong><br>
                • 功能说明: <strong>${getCurrentSchemeInfo()}</strong>
            </div>
        </div>

                    ${config.useGlobalScheme ? `
                    <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                        <div style="font-weight: 600; color: #856404; margin-bottom: 4px;">⚠️ 全局模式已开启</div>
                        <div style="font-size: 13px; color: #856404;">
                            域名专用Scheme配置将被忽略。如需使用，请关闭上方的全局模式开关。
                        </div>
                    </div>
                    ` : ''}

                    <!-- 域名专用Scheme管理区域 -->
                    <div class="section-title">域名专用Scheme管理</div>

                    <div class="pattern-list">
                        ${Object.keys(domainSchemes).length === 0 ?
                                  '<div class="empty-state">暂无域名专用Scheme配置</div>' :
                                  `<div class="pattern-items">${schemeListHTML}</div>`
                                  }
                    </div>

                    <div class="add-section">
                        <div class="section-title">添加域名专用Scheme</div>
                        <div class="input-group">
                            <input type="text" id="new-scheme-domain" placeholder="域名 (例如: example.com)" class="form-input" value="${currentDomain}">
                        </div>
                        <div class="input-group">
                            <input type="text" id="new-scheme-url" placeholder="URL Scheme (例如: myapp://)" class="form-input">
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                                支持任意格式: myapp://、myapp:、teak-http:// 等
                            </div>
                        </div>
                        <button class="btn btn-primary" id="btn-add-scheme" style="width: 100%" ${config.useGlobalScheme ? 'disabled' : ''}>
                            ${config.useGlobalScheme ? '全局模式已开启' : '添加域名Scheme'}
                        </button>
                    </div>
                    <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
            <div style="font-weight: 600; color: #1976d2; margin-bottom: 8px;">💡 功能说明</div>
            <div style="font-size: 13px; color: #1565c0; line-height: 1.4;">
                • <strong>全局通用模式</strong>: 所有网站使用相同的URL Scheme<br>
                • <strong>域名专用模式</strong>: 不同网站可以使用不同的URL Scheme<br>
                • Scheme格式支持: myapp://、myapp:、teak-http:// 等任意格式
            </div>
        </div>
                </div>
            `);

        // 事件处理
        const globalSchemeInput = panel.querySelector('#global-scheme-input');
        const globalSchemeToggle = panel.querySelector('#toggle-global-scheme');
        const addSchemeBtn = panel.querySelector('#btn-add-scheme');
        const newSchemeDomain = panel.querySelector('#new-scheme-domain');
        const newSchemeUrl = panel.querySelector('#new-scheme-url');

        // 全局Scheme开关 - 修复闪烁
        globalSchemeToggle.addEventListener('change', function() {
            config.useGlobalScheme = this.checked;
            if (saveConfig()) {
                showNotification(this.checked ?
                                 '已启用全局通用Scheme' :
                                 '已启用域名专用Scheme'
                                );
                // 🆕 修改：直接更新界面元素，不重新打开面板
                addSchemeBtn.disabled = this.checked;
                addSchemeBtn.textContent = this.checked ? '全局模式已开启' : '添加域名Scheme';
                updateStatusDisplay(panel); // 🆕 新增：更新状态显示
            }
        });

        // 通用Scheme输入框 - 修复闪烁
        globalSchemeInput.addEventListener('change', function() {
            const newScheme = this.value.trim();
            if (newScheme) {
                config.urlScheme = newScheme;
                if (saveConfig()) {
                    showNotification('通用URL Scheme已更新');
                    updateStatusDisplay(panel); // 🆕 新增：更新状态显示
                }
            }
        });

        // 添加域名Scheme - 修复闪烁
        addSchemeBtn.addEventListener('click', function() {
            if (config.useGlobalScheme) {
                showNotification('全局模式已开启，无法添加域名专用Scheme');
                return;
            }

            const domain = newSchemeDomain.value.trim();
            const scheme = newSchemeUrl.value.trim();

            if (!domain) {
                showNotification('请输入域名');
                return;
            }
            if (!scheme) {
                showNotification('请输入URL Scheme');
                return;
            }

            if (!config.domainUrlSchemes) {
                config.domainUrlSchemes = {};
            }

            config.domainUrlSchemes[domain] = scheme;
            if (saveConfig()) {
                showNotification(`已为 ${domain} 设置专用Scheme: ${scheme}`);
                // 🆕 修改：直接更新列表，不重新打开面板
                updateSchemeList(panel);
                // 清空输入框
                newSchemeDomain.value = currentDomain;
                newSchemeUrl.value = '';
            }
        });

        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
        bindSchemeItemEvents(panel);
    }
    // 🆕 新增：更新状态显示
    function updateStatusDisplay(panel) {
        const statusElement = panel.querySelector('.panel-content').querySelector('div[style*="background: #e8f5e8"]');
        if (statusElement) {
            statusElement.innerHTML = `
                    <div style="font-weight: 600; color: #2e7d32; margin-bottom: 4px;">📊 功能状态</div>
                    <div style="font-size: 13px; color: #2e7d32;">
                        • 工作模式: <strong>${config.useGlobalScheme ? '全局通用模式' : '域名专用模式'}</strong><br>
                        • 当前域名: <strong>${window.location.hostname}</strong><br>
                        • 功能说明: <strong>${getCurrentSchemeInfo()}</strong>
                    </div>
                `;
        }

        // 更新全局模式提示
        const globalNotice = panel.querySelector('.panel-content').querySelector('div[style*="background: #fff3cd"]');
        if (globalNotice) {
            if (config.useGlobalScheme) {
                globalNotice.style.display = 'block';
                globalNotice.innerHTML = `
                        <div style="font-weight: 600; color: #856404; margin-bottom: 4px;">⚠️ 全局模式已开启</div>
                        <div style="font-size: 13px; color: #856404;">
                            域名专用Scheme配置将被忽略。如需使用，请关闭上方的全局模式开关。
                        </div>
                    `;
            } else {
                globalNotice.style.display = 'none';
            }
        }
    }

    // 🆕 新增：更新域名Scheme列表
    function updateSchemeList(panel) {
        const domainSchemes = config.domainUrlSchemes || {};
        const currentDomain = window.location.hostname;

        const schemeListHTML = Object.keys(domainSchemes).map(domain => `
                <div class="pattern-item">
                    <div class="pattern-info">
                        <div class="pattern-domain">${domain} ${domain === currentDomain ? '<span style="color: #4CAF50; font-size: 12px;">(当前网站)</span>' : ''}</div>
                        <div class="pattern-regex">${domainSchemes[domain]}</div>
                    </div>
                    <div class="pattern-actions">
                        <button class="btn-small btn-edit" data-domain="${domain}">编辑</button>
                        <button class="btn-small btn-delete" data-domain="${domain}">删除</button>
                    </div>
                </div>
            `).join('');

        const patternList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');
        if (patternList) {
            if (Object.keys(domainSchemes).length === 0) {
                patternList.innerHTML = '<div class="empty-state">暂无域名专用Scheme配置</div>';
            } else {
                patternList.innerHTML = schemeListHTML;
            }
        }

        // 🆕 重新绑定事件
        bindSchemeItemEvents(panel);
    }

    // 🆕 新增：绑定列表项事件
    function bindSchemeItemEvents(panel) {
        // 编辑域名Scheme
        panel.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                if (config.useGlobalScheme) {
                    showNotification('全局模式已开启，无法编辑域名专用Scheme');
                    return;
                }

                const domain = this.getAttribute('data-domain');
                const currentScheme = config.domainUrlSchemes[domain];
                const newScheme = prompt(`编辑 ${domain} 的URL Scheme:`, currentScheme);

                if (newScheme !== null && newScheme.trim() !== '') {
                    config.domainUrlSchemes[domain] = newScheme.trim();
                    if (saveConfig()) {
                        showNotification(`已更新 ${domain} 的URL Scheme`);
                        updateSchemeList(panel);
                    }
                }
            });
        });

        // 删除域名Scheme
        panel.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                if (config.useGlobalScheme) {
                    showNotification('全局模式已开启，无法删除域名专用Scheme');
                    return;
                }

                const domain = this.getAttribute('data-domain');
                if (confirm(`确定要删除 ${domain} 的专用URL Scheme吗？`)) {
                    delete config.domainUrlSchemes[domain];
                    if (saveConfig()) {
                        showNotification(`已删除 ${domain} 的专用URL Scheme`);
                        updateSchemeList(panel);
                    }
                }
            });
        });
    }


    // ================================
    // 工具函数
    // ================================
    function showDirectSearchPanel() {
        if (config.visualSearchMode === 'multi') {
            showMultiSearchPanel('');
        } else {
            showSearchPanel('', false);
        }
    }

    function showNotification(message, type = 'info') {
        // 页面内 Toast 样式注入（一次性）
        if (!document.getElementById('smart-link-toast-style')) {
            const style = document.createElement('style');
            style.id = 'smart-link-toast-style';
            style.textContent = `
                            .smart-link-toast {
                                position: fixed;
                                right: 20px;
                                bottom: 20px;
                                z-index: 100001;
                                background: rgba(30, 41, 59, 0.9);
                                color: #fff;
                                padding: 10px 14px;
                                border-radius: 12px;
                                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                                font-size: 13px;
                                max-width: 60vw;
                                backdrop-filter: saturate(140%) blur(6px);
                                transition: transform 0.25s ease, opacity 0.25s ease;
                                transform: translateY(8px);
                                opacity: 0;
                            }
                            .smart-link-toast.show { transform: translateY(0); opacity: 1; }
                            .smart-link-toast.hide { transform: translateY(8px); opacity: 0; }
                        `;
            document.head.appendChild(style);
        }
        // 创建 Toast
        try {
            const toast = document.createElement('div');
            toast.className = 'smart-link-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => toast.classList.add('hide'), 2500);
            setTimeout(() => toast.remove(), 3500);
        } catch (e) {}
        // 同时调用 GM_notification（如可用）
        if (typeof GM_notification === 'function') {
            GM_notification({ text: message, title: '智能链接工具', timeout: 3000 });
        } else {
            // Fallback 提示（确保总能看到提示）
            // alert(message);
        }
    }

    function saveConfig() {
        try {
            // 存储深拷贝，避免意外引用或不可序列化内容导致存储失败
            const plain = JSON.parse(JSON.stringify(config));
            GM_setValue('comicButtonConfig', plain);
            return true;
        } catch (err) {
            console.error('保存配置失败:', err);
            return false;
        }
    }

    // ================================
    // === 从这里开始添加导入/导出功能 ===
    // ================================

    function exportConfig() {
        const exportData = {
            config: config,
            exportTime: new Date().toISOString(),
            version: '1.0',
            toolName: '智能链接工具'
        };

        const configJson = JSON.stringify(exportData, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `smart-link-config-${timestamp}.json`;
        a.href = url;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        // 更新最后导出时间
        config.lastExportTime = Date.now();
        saveConfig();

        showNotification('✅ 配置导出成功');
    }

    function importConfig() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importData = JSON.parse(e.target.result);

                    // 验证导入文件格式
                    if (!importData.config || importData.toolName !== '智能链接工具') {
                        showNotification('❌ 配置文件格式错误');
                        return;
                    }

                    // 显示确认对话框
                    showImportConfirmDialog(importData);
                } catch (error) {
                    console.error('导入配置解析错误:', error);
                    showNotification('❌ 配置文件解析失败');
                }
            };

            reader.readAsText(file);
            document.body.removeChild(fileInput);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
    }

    function showImportConfirmDialog(importData) {
        const importConfig = importData.config;
        const exportTime = importData.exportTime ? new Date(importData.exportTime).toLocaleString() : '未知时间';

        const panel = createPanel('确认导入配置', `
                    <div class="panel-content">
                        <div style="
                            background: #e3f2fd;
                            padding: 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            border-left: 4px solid #2196f3;
                        ">
                            <div style="font-weight: 600; color: #1976d2; margin-bottom: 8px;">📋 导入信息</div>
                            <div style="font-size: 13px; color: #1565c0; line-height: 1.4;">
                                <div>导出时间: ${exportTime}</div>
                                <div>版本: ${importData.version || '未知'}</div>
                            </div>
                        </div>

                        <div class="section-title">配置预览</div>

                        <div class="config-preview-item">
                            <div class="config-preview-label">搜索引擎</div>
                            <div class="config-preview-value">${Object.keys(importConfig.searchEngines || {}).length} 个</div>
                        </div>

                        <div class="config-preview-item">
                            <div class="config-preview-label">匹配模式</div>
                            <div class="config-preview-value">${Object.keys(importConfig.domainPatterns || {}).length} 个</div>
                        </div>

                        <div class="config-preview-item">
                            <div class="config-preview-label">阅读列表</div>
                            <div class="config-preview-value">${(importConfig.readingList || []).length} 项</div>
                        </div>

                        <div class="config-preview-item">
                            <div class="config-preview-label">显示模式</div>
                            <div class="config-preview-value">${importConfig.displayMode === 'separate' ? '分离模式' : '组合模式'}</div>
                        </div>

                        <div style="
                            background: #fff3cd;
                            padding: 16px;
                            border-radius: 12px;
                            margin-top: 20px;
                            border-left: 4px solid #ffc107;
                        ">
                            <div style="font-weight: 600; color: #856404; margin-bottom: 8px;">⚠️ 重要提示</div>
                            <div style="font-size: 13px; color: #856404; line-height: 1.4;">
                                • 导入配置将覆盖当前所有设置<br>
                                • 此操作不可撤销，请谨慎操作<br>
                                • 建议先导出当前配置作为备份
                            </div>
                        </div>
                    </div>
                `);

        // 添加预览样式
        const style = document.createElement('style');
        style.textContent = `
                    .config-preview-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-bottom: 1px solid #f0f0f0;
                    }
                    .config-preview-item:last-child {
                        border-bottom: none;
                    }
                    .config-preview-label {
                        font-weight: 600;
                        color: #2c3e50;
                    }
                    .config-preview-value {
                        color: #7f8c8d;
                        font-size: 14px;
                    }
                `;
        panel.querySelector('.panel-content').appendChild(style);

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            // 执行导入
            performImport(importConfig);
            panel.remove();
        },
                        '确认导入'
                       );

        document.body.appendChild(panel);
    }

    function performImport(importConfig) {
        try {
            // 使用导入的配置完全替换当前配置
            const newConfig = { ...defaultConfig, ...importConfig };

            // 保存到存储
            GM_setValue('comicButtonConfig', newConfig);

            // 更新内存中的配置
            Object.assign(config, newConfig);

            // 重新初始化界面
            removeAllButtons();
            initializeButtons();
            registerAllHotkeys();
            applyCustomStyles();

            showNotification('✅ 配置导入成功，界面已更新');

            // 建议刷新页面
            setTimeout(() => {
                if (confirm('配置导入成功！建议刷新页面以完全应用所有设置。是否立即刷新？')) {
                    window.location.reload();
                }
            }, 1000);

        } catch (error) {
            console.error('导入配置失败:', error);
            showNotification('❌ 配置导入失败');
        }
    }

    function resetToDefaultConfig() {
        if (confirm('确定要重置所有设置为默认值吗？此操作不可撤销！')) {
            if (confirm('⚠️ 最后确认：这将清除所有自定义设置，包括搜索引擎、匹配模式、阅读列表等。是否继续？')) {
                // 清除存储的配置
                GM_setValue('comicButtonConfig', null);

                // 重置内存配置
                Object.assign(config, defaultConfig);

                // 重新初始化
                removeAllButtons();
                initializeButtons();
                registerAllHotkeys();
                applyCustomStyles();

                showNotification('✅ 已重置为默认配置');

                // 刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    // === 导入/导出功能添加结束 ===

    // ================================
    // 位置记忆系统
    // ================================

    const buttonPositions = {
        'config-button': { defaultRight: 20, defaultBottom: 20 },
        'batch-paste-button': { defaultRight: 20, defaultBottom: 60 },
        'copy-link-button': { defaultRight: 20, defaultBottom: 100 },
        'visual-search-button': { defaultRight: 20, defaultBottom: 140 },
        'reading-list-button': { defaultRight: 20, defaultBottom: 180 },
        'clean-url-button': { defaultRight: 20, defaultBottom: 220 },
        'batch-links-button': { defaultRight: 20, defaultBottom: 260 },
        'reading-list-panel-button': { defaultRight: 20, defaultBottom: 300 },
        'batch-tools-button': { defaultRight: 20, defaultBottom: 340 },
        'input-search-button': { defaultRight: 20, defaultBottom: 380 },
        'html2md-button': { defaultRight: 20, defaultBottom: 420 },
        'element-hider-button': { defaultRight: 20, defaultBottom: 460 },
        'scroll-bottom-button': { defaultRight: 20, defaultBottom: 500 },
        'scroll-top-button': { defaultRight: 20, defaultBottom: 540 },
        'app-open-button': { defaultRight: 20, defaultBottom: 700 },
        'auto-scroll-button': { defaultRight: 20, defaultBottom: 580 },
        'github-upload-button':{ defaultRight: 20, defaultBottom: 660 },
        'element-selector-button':{ defaultRight: 20, defaultBottom: 620 },

        'combined-button': { defaultRight: 20, defaultBottom: 20 }
    };

    function initButtonPosition(button, buttonId) {
        if (!config.buttonVisibility[buttonId]) {
            button.style.display = 'none';
            return;
        }

        // 🆕 优化：立即设置初始位置，避免按钮叠在一起
        // 先尝试从保存的位置恢复，否则使用默认位置
        const savedKey = `${buttonId}_global_pos`;
        const saved = GM_getValue(savedKey);

        if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const x = Math.max(10, Math.min(saved.x, viewportWidth - config.buttonSize - 10));
            const y = Math.max(10, Math.min(saved.y, viewportHeight - config.buttonSize - 10));
            button.style.left = x + 'px';
            button.style.top = y + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        } else {
            // 🆕 使用默认位置立即设置（不等待事件）
            const positionConfig = buttonPositions[buttonId];
            if (positionConfig) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const defaultX = viewportWidth - config.buttonSize - positionConfig.defaultRight;
                const defaultY = viewportHeight - config.buttonSize - positionConfig.defaultBottom;
                button.style.left = defaultX + 'px';
                button.style.top = defaultY + 'px';
                button.style.right = 'auto';
                button.style.bottom = 'auto';
            }
        }

        // 🆕 DOM 完全加载后，再做一次精确位置设置（但这次按钮已经在正确位置了）
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setButtonPosition(button, buttonId);
            });
        } else {
            // 若 DOM 已加载，使用更短的延迟（或不延迟）
            setTimeout(() => {
                setButtonPosition(button, buttonId);
            }, 0);
        }
    }

    function setButtonPosition(button, buttonId) {
        // 如果按钮是隐藏的，不设置位置
        if (!config.buttonVisibility[buttonId] && button.style.display === 'none') {
            return;
        }

        try {
            // 🆕 确保使用正确的键名格式
            const savedKey = `${buttonId}_global_pos`;
            const saved = GM_getValue(savedKey);

            // 调试信息（可选）
            // console.log(`🔧 设置按钮位置: ${buttonId}, 键名: ${savedKey}, 保存数据:`, saved);

            if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                const x = Math.max(10, Math.min(saved.x, viewportWidth - config.buttonSize - 10));
                const y = Math.max(10, Math.min(saved.y, viewportHeight - config.buttonSize - 10));

                // 🆕 仅在位置发生变化时更新，减少重排
                if (button.style.left !== x + 'px' || button.style.top !== y + 'px') {
                    button.style.left = x + 'px';
                    button.style.top = y + 'px';
                    button.style.right = 'auto';
                    button.style.bottom = 'auto';
                }

                // console.log(`✅ 恢复按钮位置: ${buttonId} -> (${x}, ${y})`);
            } else {
                const positionConfig = buttonPositions[buttonId];
                if (!positionConfig) {
                    console.warn(`❌ 未找到按钮位置配置: ${buttonId}`);
                    return;
                }

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                const defaultX = viewportWidth - config.buttonSize - positionConfig.defaultRight;
                const defaultY = viewportHeight - config.buttonSize - positionConfig.defaultBottom;

                // 🆕 仅在位置发生变化时更新
                if (button.style.left !== defaultX + 'px' || button.style.top !== defaultY + 'px') {
                    button.style.left = defaultX + 'px';
                    button.style.top = defaultY + 'px';
                    button.style.right = 'auto';
                    button.style.bottom = 'auto';
                }

                saveButtonPosition(buttonId, defaultX, defaultY);
                // console.log(`📌 设置默认位置: ${buttonId} -> (${defaultX}, ${defaultY})`);
            }
        } catch (e) {
            console.warn(`❌ 设置按钮位置失败: ${buttonId}`, e);
            setDefaultPosition(button, buttonId);
        }
    }
    function setDefaultPosition(button, buttonId) {
        const positionConfig = buttonPositions[buttonId];
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const defaultX = viewportWidth - config.buttonSize - positionConfig.defaultRight;
        const defaultY = viewportHeight - config.buttonSize - positionConfig.defaultBottom;

        button.style.left = defaultX + 'px';
        button.style.top = defaultY + 'px';
        button.style.right = 'auto';
        button.style.bottom = 'auto';

        saveButtonPosition(buttonId, defaultX, defaultY);
    }

    function saveButtonPosition(buttonId, x, y) {
        try {
            if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
                return;
            }

            const positionData = {
                x: Math.round(x),
                y: Math.round(y),
                timestamp: Date.now(),
                domain: 'global'
            };

            GM_setValue(`${buttonId}_global_pos`, positionData);
        } catch (e) {
            console.warn('保存位置失败:', e);
        }
    }

    // ================================
    // 组合模式功能
    // ================================

    let currentExpandedGroup = null;

    function showExpandedButtonGroup(x, y) {
        // 如果已经有展开的组，先移除
        if (currentExpandedGroup) {
            currentExpandedGroup.remove();
            currentExpandedGroup = null;
        }

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group-expanded';

        // 计算位置，确保在可视区域内
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonCount = Object.values(config.buttonVisibility).filter(v => v).length + 3; // 估算：可见按钮 + 设置 + 顶/底
        const groupWidth = (config.buttonSize * buttonCount) + (8 * (buttonCount - 1)) + 20;
        const groupHeight = config.buttonSize + 20;

        let groupLeft = x - groupWidth / 2;
        let groupTop = y + 20;

        // 边界检查
        if (groupLeft < 10) groupLeft = 10;
        if (groupLeft + groupWidth > viewportWidth - 10) groupLeft = viewportWidth - groupWidth - 10;
        if (groupTop + groupHeight > viewportHeight - 10) groupTop = y - groupHeight - 20;
        if (groupTop < 10) groupTop = 10;

        buttonGroup.style.left = groupLeft + 'px';
        buttonGroup.style.top = groupTop + 'px';

        const createSubButton = (content, title, onClick) => {
            const subButton = document.createElement('div');
            subButton.innerHTML = content;
            subButton.title = title;
            Object.assign(subButton.style, {
                width: config.buttonSize + 'px',
                height: config.buttonSize + 'px',
                borderRadius: '50%',
                background: 'white',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: (config.buttonSize * 0.6) + 'px'
            });

            subButton.addEventListener('click', function(e) {
                e.stopPropagation();

                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.background = 'white';
                    this.style.transform = 'scale(1)';
                }, 100);

                onClick();
                buttonGroup.remove();
                currentExpandedGroup = null;
            });

            return subButton;
        };

        // 创建所有启用的按钮
        if (config.buttonVisibility['app-open-button']) {
            buttonGroup.appendChild(createSubButton('', '用App打开', handleAppButtonClick));
        }
        if (config.buttonVisibility['copy-link-button']) {
            buttonGroup.appendChild(createSubButton('🔗', '复制链接', handleCopyButtonClick));
        }
        if (config.buttonVisibility['visual-search-button']) {
            const modeText = config.visualSearchMode === 'multi' ? '多引擎' : '单引擎';
            buttonGroup.appendChild(createSubButton('🔍', `可视化搜索 (${modeText})`, startVisualSelection));
        }
        if (config.buttonVisibility['input-search-button']) {
            buttonGroup.appendChild(createSubButton('⌨️', '输入搜索', showInputSearchPrompt));
        }
        if (config.buttonVisibility['batch-links-button']) {
            buttonGroup.appendChild(createSubButton('🖇️', '批量打开链接', startRectangleSelection));
        }
        if (config.buttonVisibility['batch-paste-button']) {
            buttonGroup.appendChild(createSubButton('📝', '批量粘贴链接', showBatchLinksPanel));
        }
        if (config.buttonVisibility['html2md-button']) {
            buttonGroup.appendChild(createSubButton('🧾', '区域转Markdown', startHtmlToMarkdownPicker));
        }
        if (config.buttonVisibility['element-selector-button']) {
            buttonGroup.appendChild(createSubButton('🎯', '元素选择器 (获取CSS/文本)', toggleElementPicker));
        }
        if (config.buttonVisibility['batch-tools-button']) {
            buttonGroup.appendChild(createSubButton('🧰', '批量工具（域名替换/关键词搜索）', showBatchToolsPanel));
        }
        if (config.buttonVisibility['reading-list-button']) {
            buttonGroup.appendChild(createSubButton('📖', '添加到阅读列表', addToReadingList));
        }
        if (config.buttonVisibility['reading-list-panel-button']) {
            buttonGroup.appendChild(createSubButton('📚', '打开阅读列表', showReadingListPanel));
        }
        if (config.buttonVisibility['clean-url-button']) {
            buttonGroup.appendChild(createSubButton('🧹', '净化链接', handleCleanUrl));
        }
        // 🆕 新增：GitHub 上传入口
        if (config.buttonVisibility['github-upload-button']) {
            buttonGroup.appendChild(createSubButton('☁️', '图片上传模式', toggleGhUploader));
        }
        // 元素隐藏
        if (config.buttonVisibility['element-hider-button']) {
            buttonGroup.appendChild(createSubButton('🚫', '元素隐藏', toggleElementHiderPanel));
        }

        
        // 页面滚动项
        if (config.buttonVisibility['scroll-top-button']) {
            buttonGroup.appendChild(createSubButton('⬆︎', '回到顶部', scrollPageTop));
        }
        if (config.buttonVisibility['scroll-bottom-button']) {
            buttonGroup.appendChild(createSubButton('⬇︎', '滚动到底部', scrollPageBottom));
        }
        if (config.buttonVisibility['auto-scroll-button']) {
            buttonGroup.appendChild(createSubButton('⇵', '自动滚动', toggleAutoScroll));
        }
        // 添加设置按钮
        buttonGroup.appendChild(createSubButton('⚙️', '配置菜单', showConfigPanel));
        // 在组合模式的按钮列表中添加隐藏/显示功能
        buttonGroup.appendChild(createSubButton('👁️', '隐藏组合按钮', toggleAllButtons));


        if (buttonGroup.children.length === 0) {
            return;
        }

        document.body.appendChild(buttonGroup);
        currentExpandedGroup = buttonGroup;

        // 点击外部关闭
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!buttonGroup.contains(e.target)) {
                    buttonGroup.remove();
                    currentExpandedGroup = null;
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    // ================================
    // 页面滚动辅助
    // ================================

    function hasScrollableSpace(el) {
        if (!el) return false;
        const scrollHeight = el.scrollHeight || 0;
        const clientHeight = el.clientHeight || 0;
        return scrollHeight - clientHeight > 5;
    }

    function isScrollableElement(el) {
        if (!el || el === document) return false;
        if (el === document.body || el === document.documentElement) {
            return hasScrollableSpace(el);
        }
        const style = window.getComputedStyle(el);
        if (!style) return false;
        if (!/(auto|scroll|overlay)/i.test(style.overflowY || '')) return false;
        return hasScrollableSpace(el);
    }

    function findScrollableAncestor(el) {
        let current = el;
        let steps = 0;
        while (current && steps < 30) {
            if (isScrollableElement(current)) {
                return current;
            }
            current = current.parentElement;
            steps += 1;
        }
        return null;
    }

    function resolveScrollContainer() {
        const docEl = document.scrollingElement || document.documentElement;
        if (isScrollableElement(docEl)) return docEl;
        if (isScrollableElement(document.body)) return document.body;
        let centerEl = null;
        try {
            centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        } catch (_) {}
        const scrollable = findScrollableAncestor(centerEl);
        return scrollable || window;
    }

    function createScrollContext() {
        const target = resolveScrollContainer();
        const isWindow = target === window;
        return {
            target,
            isWindow,
            scrollTo(top, behavior = 'smooth') {
                if (isWindow) {
                    try {
                        window.scrollTo({ top, behavior });
                    } catch (_) {
                        window.scrollTo(0, top);
                    }
                    return;
                }
                if (typeof target.scrollTo === 'function') {
                    try {
                        target.scrollTo({ top, behavior });
                    } catch (_) {
                        target.scrollTop = top;
                    }
                } else {
                    target.scrollTop = top;
                }
            },
            scrollBy(dy) {
                if (isWindow) {
                    window.scrollBy(0, dy);
                    return;
                }
                if (typeof target.scrollBy === 'function') {
                    target.scrollBy(0, dy);
                } else {
                    target.scrollTop += dy;
                }
            },
            getTop() {
                if (isWindow) {
                    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
                }
                return target.scrollTop || 0;
            },
            getHeight() {
                if (isWindow) {
                    const doc = document.documentElement;
                    const body = document.body || { scrollHeight: 0, offsetHeight: 0, clientHeight: 0 };
                    return Math.max(
                        doc.scrollHeight, body.scrollHeight || 0,
                        doc.offsetHeight, body.offsetHeight || 0,
                        doc.clientHeight, body.clientHeight || 0
                    );
                }
                return target.scrollHeight || target.clientHeight || 0;
            },
            getClient() {
                return isWindow ? window.innerHeight : (target.clientHeight || 0);
            }
        };
    }

    function scrollPageTop() {
        const ctx = createScrollContext();
        ctx.scrollTo(0, 'smooth');
    }

    function scrollPageBottom() {
        const ctx = createScrollContext();
        const maxOffset = Math.max(0, ctx.getHeight() - ctx.getClient());
        ctx.scrollTo(maxOffset, 'smooth');
    }

    // ================================
    // 改进的可视化搜索功能
    // ================================

    let isSelecting = false;
    let currentHighlightedElement = null;
    let visualSelectionHandlers = [];

    // 🆕 新增：创建批量打开链接按钮
    function createBatchLinksButton() {
        const button = document.createElement('div');
        button.id = 'batch-links-button';
        button.innerHTML = '🖇️';
        button.title = '批量打开链接（框选）';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['batch-links-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['batch-links-button']) {
            buttonPositions['batch-links-button'] = { defaultRight: 20, defaultBottom: 220 };
        }

        initButtonPosition(button, 'batch-links-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            startRectangleSelection();
        };

        return button;
    }

    // 🆕 新增：创建批量粘贴链接按钮
    function createBatchPasteButton() {
        const button = document.createElement('div');
        button.id = 'batch-paste-button';
        button.innerHTML = '📝';
        button.title = '批量粘贴链接';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99992',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['batch-paste-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['batch-paste-button']) {
            buttonPositions['batch-paste-button'] = { defaultRight: 20, defaultBottom: 260 };
        }
        initButtonPosition(button, 'batch-paste-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            showBatchLinksPanel();
        };

        return button;
    }

    function createVisualSearchButton() {
        const button = document.createElement('div');
        button.id = 'visual-search-button';
        button.innerHTML = '🔍';
        const modeText = config.visualSearchMode === 'multi' ? '多引擎' : '单引擎';
        button.title = `可视化搜索 (${modeText}模式)`;

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99996',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['visual-search-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'visual-search-button');
        setupDragHandlers(button);

        // 🆕 修改：优化点击事件处理，避免与拖拽冲突
        let clickStartTime = 0;
        let clickStartX = 0;
        let clickStartY = 0;
        const CLICK_MAX_MOVE = 5; // 像素移动阈值
        const CLICK_MAX_TIME = 300; // 毫秒时间阈值

        button.addEventListener('mousedown', function(e) {
            clickStartTime = Date.now();
            clickStartX = e.clientX;
            clickStartY = e.clientY;
        });

        button.addEventListener('click', function(e) {
            const currentTime = Date.now();
            const timeDiff = currentTime - clickStartTime;

            // 🆕 检查是否是真正的点击（不是拖拽）
            if (timeDiff < CLICK_MAX_TIME) {
                e.stopPropagation();

                // 添加点击反馈效果

                this.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    this.style.background = 'white';
                    this.style.transform = 'scale(1)';
                }, 100);

                // 启动可视化选择模式
                startVisualSelection();
            }
        });

        return button;
    }

    // 批量打开链接功能
    // 🆕 修改：支持 Command 键（Mac）和 Ctrl 键（Windows）
    function startBatchLinkOpening() {
        showNotification('请按住 ⌘ Command 键并点击要打开的链接（Mac）或 Ctrl 键（Windows）');

        if (isSelecting) return;

        isSelecting = true;

        // 创建取消按钮
        const cancelButton = document.createElement('div');
        cancelButton.id = 'batch-link-cancel-button';
        cancelButton.innerHTML = '❌ 取消';
        cancelButton.title = '取消选择';

        Object.assign(cancelButton.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
        });

        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopBatchLinkSelection();
        });

        document.body.appendChild(cancelButton);

        // 为所有链接添加点击事件（支持 Command/Ctrl 键）
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            if (link.href && link.href.startsWith('http') && isElementVisible(link)) {
                link.classList.add('visual-selector-highlight');

                const clickHandler = function(e) {
                    // 检查是否按下了 Command 键（Mac）或 Ctrl 键（Windows）
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();

                        const selectedLinks = getLinksInSelectionArea(this);
                        if (selectedLinks.length > 0) {
                            stopBatchLinkSelection();
                            openMultipleLinks(selectedLinks);
                        }
                    }
                };

                const mouseEnterHandler = function() {
                    if (isSelecting) {
                        this.classList.add('visual-selector-active');
                        // 显示提示：按住 Command 键点击
                        this.title = '按住 ⌘ Command 键点击选择附近链接';
                    }
                };

                const mouseLeaveHandler = function() {
                    this.classList.remove('visual-selector-active');
                    this.title = '';
                };

                link.addEventListener('click', clickHandler);
                link.addEventListener('mouseenter', mouseEnterHandler);
                link.addEventListener('mouseleave', mouseLeaveHandler);

                visualSelectionHandlers.push({
                    element: link,
                    handlers: {
                        click: clickHandler,
                        mouseenter: mouseEnterHandler,
                        mouseleave: mouseLeaveHandler
                    }
                });
            }
        });

        // ESC键取消
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                stopBatchLinkSelection();
            }
        };
        document.addEventListener('keydown', escHandler);
        visualSelectionHandlers.push({
            element: document,
            handlers: { keydown: escHandler }
        });

        // 🆕 新增：全局 Command 键提示
        const keyHandler = function(e) {
            if (e.key === 'Meta' || e.key === 'Control') {
                showNotification('现在点击链接可以批量选择附近链接', 2000);
            }
        };
        document.addEventListener('keydown', keyHandler);
        visualSelectionHandlers.push({
            element: document,
            handlers: { keydown: keyHandler }
        });
    }

    // 🆕 新增：停止批量链接选择
    // 🆕 修改：完善停止选择逻辑
    function stopBatchLinkSelection() {
        if (!isSelecting) return;

        isSelecting = false;

        // 移除所有事件监听器
        visualSelectionHandlers.forEach(handlerInfo => {
            const { element, handlers } = handlerInfo;

            Object.keys(handlers).forEach(eventType => {
                element.removeEventListener(eventType, handlers[eventType]);
            });

            if (element.classList) {
                element.classList.remove('visual-selector-highlight', 'visual-selector-active');
                element.title = ''; // 清除提示
            }
        });

        visualSelectionHandlers = [];

        // 移除取消按钮
        const cancelButton = document.getElementById('batch-link-cancel-button');
        if (cancelButton) {
            cancelButton.remove();
        }

        showNotification('已退出批量选择模式');
    }

    // 🆕 新增：获取选择区域内的链接（参考您发的脚本）
    // 🆕 改进：更智能的链接选择
    function getLinksInSelectionArea(clickedElement) {
        const links = document.querySelectorAll('a[href]');
        const selectedLinks = new Set();

        // 添加点击的链接本身
        if (clickedElement.href) {
            selectedLinks.add(clickedElement.href);
        }

        const clickedRect = clickedElement.getBoundingClientRect();

        // 方法1：选择同一容器内的链接
        const parentContainer = clickedElement.closest('div, section, article, nav, header, footer, main, aside, ul, ol');
        if (parentContainer) {
            const containerLinks = parentContainer.querySelectorAll('a[href]');
            containerLinks.forEach(link => {
                if (link.href && link.href.startsWith('http') && isElementVisible(link)) {
                    selectedLinks.add(link.href);
                }
            });
        }

        // 方法2：选择附近的链接（基于位置）
        links.forEach(link => {
            if (link.href && link.href.startsWith('http') && isElementVisible(link)) {
                const linkRect = link.getBoundingClientRect();

                // 检查链接是否在点击元素附近（可视区域内）
                const isNearby =
                      Math.abs(linkRect.top - clickedRect.top) < window.innerHeight * 0.3 &&
                      Math.abs(linkRect.left - clickedRect.left) < window.innerWidth * 0.4;

                if (isNearby) {
                    selectedLinks.add(link.href);
                }
            }
        });

        return Array.from(selectedLinks);
    }

    // 🆕 新增：打开多个链接
    // 🆕 修改：优化批量打开链接的提示
    function openMultipleLinks(links) {
        if (links.length === 0) {
            showNotification('没有找到可打开的链接');
            return;
        }

        // 去重和过滤
        const uniqueLinks = [...new Set(links)].filter(link =>
                                                       link && link.startsWith('http') && link.length > 10
                                                      );

        if (uniqueLinks.length === 0) {
            showNotification('没有有效的链接可以打开');
            return;
        }

        // 显示链接详情
        const linkDetails = uniqueLinks.map(link => {
            try {
                const url = new URL(link);
                return {
                    hostname: url.hostname,
                    pathname: url.pathname,
                    fullUrl: link
                };
            } catch {
                return {
                    hostname: '未知',
                    pathname: link.substring(0, 40),
                    fullUrl: link
                };
            }
        });

        // 按域名分组统计
        const domainCount = {};
        linkDetails.forEach(link => {
            domainCount[link.hostname] = (domainCount[link.hostname] || 0) + 1;
        });

        const domainSummary = Object.entries(domainCount)
        .map(([domain, count]) => `${domain} (${count})`)
        .join(', ');

        const preview = linkDetails.slice(0, 5).map(link =>
                                                    `• ${link.hostname}${link.pathname.substring(0, 25)}${link.pathname.length > 25 ? '...' : ''}`
                                                   ).join('\n');

        const moreText = uniqueLinks.length > 5 ? `\n... 还有 ${uniqueLinks.length - 5} 个链接` : '';

        const shouldOpen = confirm(
            `框选了 ${uniqueLinks.length} 个链接\n域名: ${domainSummary}\n\n预览:\n${preview}${moreText}\n\n点击"确定"在后台打开这些链接`
        );

        if (shouldOpen) {
            let openedCount = 0;

            showNotification(`开始打开 ${uniqueLinks.length} 个链接...`);

            uniqueLinks.forEach((link, index) => {
                setTimeout(() => {
                    try {
                        GM_openInTab(link, {
                            active: false,
                            insert: true,
                            setParent: true
                        });
                        openedCount++;

                        // 进度更新
                        if (openedCount % 5 === 0 || openedCount === uniqueLinks.length) {
                            showNotification(`已打开 ${openedCount}/${uniqueLinks.length} 个链接`);
                        }
                    } catch (err) {
                        console.error(`打开链接失败: ${link}`, err);
                    }
                }, index * 200);
            });
        } else {
            showNotification('已取消打开链接');
        }
    }
    // 🆕 新增：鼠标框选批量打开链接功能
    function startRectangleSelection() {
        if (isSelecting) return;

        isSelecting = true;
        showNotification('请按住鼠标左键并拖动框选要打开的链接');

        let startX, startY, currentX, currentY;
        let selectionDiv;

        // 鼠标按下事件
        const mouseDownHandler = (event) => {
            if (event.button === 0) { // 左键
                startX = event.pageX;
                startY = event.pageY;
                currentX = startX;
                currentY = startY;

                // 创建选择框
                selectionDiv = createSelectionDiv(startX, startY);
                document.body.appendChild(selectionDiv);

                event.preventDefault();
                event.stopPropagation();
            }
        };

        // 鼠标移动事件
        const mouseMoveHandler = (event) => {
            if (selectionDiv) {
                currentX = event.pageX;
                currentY = event.pageY;
                updateSelectionDiv(selectionDiv, startX, startY, currentX, currentY);

                // 高亮选中的链接
                const selectedLinks = getLinksInRectangle(selectionDiv);
                highlightSelectedLinks(selectedLinks);

                event.preventDefault();
            }
        };

        // 鼠标释放事件
        const mouseUpHandler = (event) => {
            if (selectionDiv && event.button === 0) {
                const selectedLinks = getLinksInRectangle(selectionDiv);

                // 移除选择框和高亮
                document.body.removeChild(selectionDiv);
                selectionDiv = null;

                // 清除所有高亮
                clearAllHighlights();

                // 打开选中的链接
                if (selectedLinks.length > 0) {
                    openMultipleLinks(selectedLinks);
                } else {
                    showNotification('没有选中任何链接');
                }

                // 停止选择模式
                stopRectangleSelection();

                event.preventDefault();
                event.stopPropagation();
            }
        };

        // ESC键取消
        const keyDownHandler = (event) => {
            if (event.key === 'Escape') {
                if (selectionDiv) {
                    document.body.removeChild(selectionDiv);
                    selectionDiv = null;
                }
                clearAllHighlights();
                stopRectangleSelection();
            }
        };

        // 注册事件
        document.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        document.addEventListener('keydown', keyDownHandler);

        // 保存处理器以便清理
        visualSelectionHandlers.push(
            { element: document, handlers: { mousedown: mouseDownHandler } },
            { element: document, handlers: { mousemove: mouseMoveHandler } },
            { element: document, handlers: { mouseup: mouseUpHandler } },
            { element: document, handlers: { keydown: keyDownHandler } }
        );

        // 创建取消按钮
        const cancelButton = document.createElement('div');
        cancelButton.id = 'rectangle-selection-cancel-button';
        cancelButton.innerHTML = '✕ 取消框选';
        cancelButton.title = '取消框选模式';

        Object.assign(cancelButton.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--smart-link-primary-color,#3b82f6), var(--smart-link-secondary-color,#60a5fa))',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgb(from var(--smart-link-secondary-color, #3b82f6) r g b / 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
        });

        cancelButton.addEventListener('click', () => {
            if (selectionDiv) {
                document.body.removeChild(selectionDiv);
            }
            clearAllHighlights();
            stopRectangleSelection();
        });

        document.body.appendChild(cancelButton);
    }

    // 🆕 新增：创建选择框
    function createSelectionDiv(startX, startY) {
        const div = document.createElement('div');
        div.id = 'rectangle-selection-div';
        div.style.position = 'absolute';
        div.style.border = '2px dashed var(--smart-link-secondary-color)';
        div.style.background = 'rgb(from var(--smart-link-secondary-color, #3b82f6) r g b / 0.1)';
        div.style.left = startX + 'px';
        div.style.top = startY + 'px';
        div.style.width = '0px';
        div.style.height = '0px';
        div.style.zIndex = '99998';
        div.style.pointerEvents = 'none';
        return div;
    }

    // 🆕 新增：更新选择框大小和位置
    function updateSelectionDiv(selectionDiv, startX, startY, currentX, currentY) {
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selectionDiv.style.left = left + 'px';
        selectionDiv.style.top = top + 'px';
        selectionDiv.style.width = width + 'px';
        selectionDiv.style.height = height + 'px';
    }

    // 🆕 新增：获取矩形区域内的链接（参考您发的脚本）
    function getLinksInRectangle(selectionDiv) {
        const links = document.querySelectorAll('a[href]');
        const selectedLinks = [];
        const selectionRect = selectionDiv.getBoundingClientRect();

        for (let link of links) {
            if (link.href && link.href.startsWith('http') && isElementVisible(link)) {
                const linkClientRects = link.getClientRects();

                for (let rect of linkClientRects) {
                    if (isRectOverlap(rect, selectionRect)) {
                        selectedLinks.push(link.href);
                        break;
                    }
                }
            }
        }

        return [...new Set(selectedLinks)]; // 去重
    }

    // 🆕 新增：判断矩形是否重叠
    function isRectOverlap(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    // 🆕 新增：高亮选中的链接
    function highlightSelectedLinks(selectedLinks) {
        // 先清除所有高亮
        clearAllHighlights();

        // 高亮当前选中的链接
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            if (selectedLinks.includes(link.href)) {
                link.style.outline = '2px solid var(--smart-link-primary-color, #3b82f6)';
                link.style.backgroundColor = 'rgb(from var(--smart-link-primary-color, #3b82f6) r g b / 0.1)';
            }
        });
    }

    // 🆕 新增：清除所有高亮
    function clearAllHighlights() {
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            link.style.outline = '';
            link.style.backgroundColor = '';
        });
    }

    // 🆕 新增：停止矩形选择模式
    function stopRectangleSelection() {
        if (!isSelecting) return;

        isSelecting = false;

        // 移除所有事件监听器
        visualSelectionHandlers.forEach(handlerInfo => {
            const { element, handlers } = handlerInfo;
            Object.keys(handlers).forEach(eventType => {
                element.removeEventListener(eventType, handlers[eventType]);
            });
        });

        visualSelectionHandlers = [];

        // 移除取消按钮
        const cancelButton = document.getElementById('rectangle-selection-cancel-button');
        if (cancelButton) {
            cancelButton.remove();
        }

        // 清除高亮
        clearAllHighlights();

        showNotification('已退出框选模式');
    }

    function startVisualSelection() {
        if (isSelecting) return;

        // 清除之前可能存在的选择状态（不影响后续逻辑）
        stopVisualSelection();

        isSelecting = true;
        showNotification('请将鼠标悬停在要搜索的文本上，点击选择');

        // 创建取消按钮（主要为移动端设计）
        const cancelButton = document.createElement('div');
        cancelButton.id = 'visual-selection-cancel-button';
        cancelButton.innerHTML = '✕';
        cancelButton.title = '取消选择';

        Object.assign(cancelButton.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--smart-link-primary-color)',
            color:'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.2s ease'
        });

        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopVisualSelection();
        });

        // 触摸时的视觉反馈
        cancelButton.addEventListener('touchstart', () => {
            cancelButton.style.transform = 'scale(0.95)';
            cancelButton.style.opacity = '0.9';
        });
        cancelButton.addEventListener('touchend', () => {
            cancelButton.style.transform = 'scale(1)';
            cancelButton.style.opacity = '1';
        });

        document.body.appendChild(cancelButton);

        // 为所有文本元素添加悬停效果
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td, a, button');

        textElements.forEach(el => {
            if (el.textContent && el.textContent.trim().length > 0 && isElementVisible(el)) {
                el.classList.add('visual-selector-highlight');

                const mouseEnterHandler = function() {
                    // 移除之前高亮元素的active类
                    if (currentHighlightedElement && currentHighlightedElement !== this) {
                        currentHighlightedElement.classList.remove('visual-selector-active');
                    }
                    // 为当前元素添加active类
                    this.classList.add('visual-selector-active');
                    currentHighlightedElement = this;
                };

                const mouseLeaveHandler = function() {
                    // 移除当前元素的active类
                    this.classList.remove('visual-selector-active');
                    if (currentHighlightedElement === this) {
                        currentHighlightedElement = null;
                    }
                };

                // 在 startVisualSelection 函数的点击处理部分修改
                const clickHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const selectedText = this.textContent.trim();
                    if (selectedText) {
                        stopVisualSelection(); // 选择后立即停止可视化选择状态

                        // 🆕 修改：根据可视化搜索模式决定使用哪种搜索
                        if (config.enableDirectSearch) {
                            // 直接搜索模式
                            if (config.visualSearchMode === 'multi') {
                                // 🆕 多引擎直接搜索
                                const currentConfig = config.searchConfigs[config.currentSearchConfig] || config.searchConfigs['default'];
                                performMultiSearch(selectedText, currentConfig);
                            } else {
                                // 单引擎直接搜索
                                performSearch(selectedText, config.defaultSearchEngine, config.searchMode);
                            }
                        } else {
                            // 显示搜索选择界面
                            if (config.visualSearchMode === 'multi') {
                                // 🆕 显示多引擎搜索面板
                                showMultiSearchPanel(selectedText);
                            } else {
                                // 显示单引擎搜索面板
                                showSearchPanel(selectedText, true);
                            }
                        }
                    }
                };

                // 移动端触摸事件处理
                const touchHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const selectedText = this.textContent.trim();
                    if (selectedText) {
                        stopVisualSelection(); // 选择后立即停止可视化选择状态

                        if (config.enableDirectSearch) {
                            // 直接搜索模式
                            performSearch(selectedText, config.defaultSearchEngine, config.searchMode);
                        } else {
                            // 显示搜索引擎选择界面，带模式选择
                            showSearchPanel(selectedText, true);
                        }
                    }
                };

                el.addEventListener('mouseenter', mouseEnterHandler);
                el.addEventListener('mouseleave', mouseLeaveHandler);
                el.addEventListener('click', clickHandler);
                // 移动端添加触摸事件
                el.addEventListener('touchstart', touchHandler);

                // 保存处理器引用以便移除
                visualSelectionHandlers.push({
                    element: el,
                    handlers: {
                        mouseenter: mouseEnterHandler,
                        mouseleave: mouseLeaveHandler,
                        click: clickHandler,
                        touchstart: touchHandler
                    }
                });
            }
        });

        // ESC键取消选择
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                stopVisualSelection();
            }
        };
        document.addEventListener('keydown', escHandler);
        visualSelectionHandlers.push({
            element: document,
            handlers: { keydown: escHandler }
        });

        // 点击空白区域取消
        const clickHandler = function(e) {
            if (!e.target.classList || !e.target.classList.contains('visual-selector-highlight')) {
                stopVisualSelection();
            }
        };
        document.addEventListener('click', clickHandler, true);
        visualSelectionHandlers.push({
            element: document,
            handlers: { click: clickHandler }
        });
    }

    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        return rect.width > 0 &&
            rect.height > 0 &&
            style.opacity !== '0' &&
            style.visibility !== 'hidden' &&
            style.display !== 'none';
    }

    function stopVisualSelection() {
        if (!isSelecting) return;

        isSelecting = false;

        // 移除所有高亮效果和事件监听器
        visualSelectionHandlers.forEach(handlerInfo => {
            const { element, handlers } = handlerInfo;

            if (handlers.mouseenter) {
                element.removeEventListener('mouseenter', handlers.mouseenter);
            }
            if (handlers.mouseleave) {
                element.removeEventListener('mouseleave', handlers.mouseleave);
            }
            if (handlers.click) {
                element.removeEventListener('click', handlers.click);
            }
            if (handlers.touchstart) {
                element.removeEventListener('touchstart', handlers.touchstart);
            }
            if (handlers.keydown) {
                element.removeEventListener('keydown', handlers.keydown);
            }

            // 移除高亮样式
            if (element.classList) {
                element.classList.remove('visual-selector-highlight', 'visual-selector-active');
            }
        });

        // 清空处理器数组
        visualSelectionHandlers = [];
        currentHighlightedElement = null;

        // 额外清理：确保所有可能的高亮元素都被清理
        document.querySelectorAll('.visual-selector-highlight, .visual-selector-active').forEach(el => {
            el.classList.remove('visual-selector-highlight', 'visual-selector-active');
        });

        // 移除取消按钮（如果存在）
        const cancelButton = document.getElementById('visual-selection-cancel-button');
        if (cancelButton) {
            cancelButton.remove();
        }
    }

    // ================================
    // 改进的搜索面板
    // ================================

    function showSearchPanel(selectedText = '', showModeSelection = true) {
        const engines = Object.keys(config.searchEngines).map(key => {
            const engine = config.searchEngines[key];

            // 🆕 修改：支持图片链接和emoji
            let iconDisplay = escapeHTML(engine.icon);
            if (isImageUrl(engine.icon)) {
                // 如果是图片链接，显示图片
                iconDisplay = `<img src="${escapeHTML(engine.icon)}" style="width: 20px; height: 20px; object-fit: contain; vertical-align: middle; border-radius: 3px;" onerror="handleImageError(this)">`;
            }

            const hasWebUrl = engine.webUrl && engine.webUrl.trim() !== '';
            const hasAppUrl = engine.appUrl && engine.appUrl.trim() !== '';
            const displayUrl = config.searchMode === 'web' ?
                  (hasWebUrl ? engine.webUrl : '网页搜索未配置') :
            (hasAppUrl ? engine.appUrl : 'App搜索未配置');

            return `
                    <div class="option-item ${key === config.defaultSearchEngine ? 'selected' : ''}" data-engine="${key}">
                        <input type="radio" name="searchEngine" value="${key}" ${key === config.defaultSearchEngine ? 'checked' : ''} class="option-radio">
                        <div class="option-icon">${iconDisplay}</div>
                        <div class="option-info">
                            <div class="option-title">${escapeHTML(engine.name)}</div>
                            <div class="option-desc" style="color: ${(config.searchMode === 'web' && !hasWebUrl) || (config.searchMode === 'app' && !hasAppUrl) ? '#dc3545' : '#666'}">${escapeHTML(displayUrl)}</div>
                        </div>
                    </div>
                `;
        }).join('');

        const panel = createPanel('搜索工具', `
                        <div class="panel-content">
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">搜索文本</label>
                                <textarea id="search-text" class="form-textarea" placeholder="输入要搜索的文本，或使用可视化选择">${escapeHTML(selectedText)}</textarea>
                            </div>

                            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <button class="btn btn-primary" id="btn-visual-select" style="flex: 1;">🔍 可视化选择</button>
                <button class="btn" id="btn-paste-clipboard" style="flex: 1; background: #4A7BFF; color: white;">📋 粘贴剪贴板</button>
                <button class="btn" id="btn-clear-text" style="flex: 1; background: #f8f9fa;">清空</button>
            </div>

                            <div class="search-preview">
                                <div class="search-preview-title">搜索预览</div>
                                <div class="search-preview-url" id="search-preview">请选择搜索引擎并输入文本</div>
                            </div>

                            <div class="section-title">选择搜索引擎</div>
                            ${engines}

                            ${showModeSelection ? `
                            <div class="section-title">搜索模式</div>
                            <div class="option-item ${config.searchMode === 'web' ? 'selected' : ''}" id="web-mode-item">
                                <input type="radio" name="searchMode" value="web" ${config.searchMode === 'web' ? 'checked' : ''} class="option-radio">
                                <div>
                                    <div class="option-title">网页搜索</div>
                                    <div class="option-desc">在当前浏览器中打开搜索结果</div>
                                </div>
                            </div>
                            <div class="option-item ${config.searchMode === 'app' ? 'selected' : ''}" id="app-mode-item">
                                <input type="radio" name="searchMode" value="app" ${config.searchMode === 'app' ? 'checked' : ''} class="option-radio">
                                <div>
                                    <div class="option-title">App搜索</div>
                                    <div class="option-desc">使用URL Scheme在App中搜索</div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    `);

        // 更新搜索预览
        function updatePreview() {
            const text = panel.querySelector('#search-text').value.trim();
            const engineKey = panel.querySelector('input[name="searchEngine"]:checked').value;
            let mode = config.searchMode; // 默认使用当前配置的模式

            // 只有在显示模式选择时才从界面获取模式
            if (showModeSelection) {
                const modeRadio = panel.querySelector('input[name="searchMode"]:checked');
                if (modeRadio) {
                    mode = modeRadio.value;
                }
            }

            const engine = config.searchEngines[engineKey];

            if (text && engine) {
                const baseUrl = mode === 'web' ? engine.webUrl : engine.appUrl;
                let url;
                if (baseUrl && baseUrl.includes('{key}')) {
                    url = baseUrl.replace('{key}', encodeURIComponent(text));
                } else {
                    url = baseUrl + encodeURIComponent(text);
                }
                panel.querySelector('#search-preview').textContent = url;
            } else {
                panel.querySelector('#search-preview').textContent = '请选择搜索引擎并输入文本';
            }

            // 更新搜索模式可用性
            updateSearchModeAvailability(engineKey);
        }

        // 更新搜索模式可用性
        function updateSearchModeAvailability(engineKey) {
            // 只有在显示模式选择时才更新搜索模式可用性
            if (!showModeSelection) return;

            const engine = config.searchEngines[engineKey];
            if (!engine) return;

            const hasWebUrl = engine.webUrl && engine.webUrl.trim() !== '';
            const hasAppUrl = engine.appUrl && engine.appUrl.trim() !== '';

            const webModeItem = panel.querySelector('#web-mode-item');
            const appModeItem = panel.querySelector('#app-mode-item');
            const webRadio = webModeItem.querySelector('input');
            const appRadio = appModeItem.querySelector('input');

            // 更新网页搜索模式
            if (hasWebUrl) {
                webModeItem.style.opacity = '1';
                webModeItem.style.pointerEvents = 'auto';
                webRadio.disabled = false;
            } else {
                webModeItem.style.opacity = '0.5';
                webModeItem.style.pointerEvents = 'none';
                webRadio.disabled = true;
                if (webRadio.checked) {
                    appRadio.checked = true;
                    appModeItem.classList.add('selected');
                    webModeItem.classList.remove('selected');
                    updatePreview();
                }
            }

            // 更新App搜索模式
            if (hasAppUrl) {
                appModeItem.style.opacity = '1';
                appModeItem.style.pointerEvents = 'auto';
                appRadio.disabled = false;
            } else {
                appModeItem.style.opacity = '0.5';
                appModeItem.style.pointerEvents = 'none';
                appRadio.disabled = true;
                if (appRadio.checked) {
                    webRadio.checked = true;
                    webModeItem.classList.add('selected');
                    appModeItem.classList.remove('selected');
                    updatePreview();
                }
            }
        }

        // 事件监听
        panel.querySelector('#search-text').addEventListener('input', updatePreview);
        panel.querySelectorAll('input[name="searchEngine"]').forEach(radio => {
            radio.addEventListener('change', updatePreview);
        });

        // 只有在显示模式选择时才添加搜索模式事件监听
        if (showModeSelection) {
            panel.querySelectorAll('input[name="searchMode"]').forEach(radio => {
                radio.addEventListener('change', updatePreview);
            });
        }

        // 可视化选择按钮
        panel.querySelector('#btn-visual-select').addEventListener('click', function() {
            panel.remove();
            startVisualSelection();
        });

        // 剪贴板粘贴按钮事件
        panel.querySelector('#btn-paste-clipboard').addEventListener('click', async function() {
            // 给按钮添加点击反馈效果
            this.style.background = '#3a6be8'; // 点击时颜色变深
            setTimeout(() => {
                this.style.background = '#4A7BFF'; // 恢复原颜色
            }, 200);

            try {
                // 尝试读取剪贴板内容
                const text = await navigator.clipboard.readText();

                if (text && text.trim()) {
                    const trimmedText = text.trim();
                    // 将剪贴板内容填入搜索框
                    panel.querySelector('#search-text').value = trimmedText;
                    // 更新搜索预览
                    updatePreview();
                    // 显示成功提示
                    showNotification(`已粘贴剪贴板内容: ${trimmedText.substring(0, 30)}${trimmedText.length > 30 ? '...' : ''}`);
                } else {
                    showNotification('剪贴板为空或不是文本内容');
                }
            } catch (err) {
                console.error('读取剪贴板失败:', err);
                showNotification('无法读取剪贴板内容，请确保已授予权限');

                // 降级方案：如果剪贴板API不可用，使用prompt让用户手动粘贴
                setTimeout(() => {
                    const manualText = prompt('请粘贴要搜索的内容:');
                    if (manualText) {
                        panel.querySelector('#search-text').value = manualText;
                        updatePreview();
                    }
                }, 300);
            }
        });

        // 清空按钮
        panel.querySelector('#btn-clear-text').addEventListener('click', function() {
            panel.querySelector('#search-text').value = '';
            updatePreview();
        });

        // 选项点击事件
        panel.querySelectorAll('.option-item[data-engine]').forEach(item => {
            item.addEventListener('click', function() {
                const radio = this.querySelector('input');
                radio.checked = true;
                panel.querySelectorAll('.option-item[data-engine]').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                updatePreview();
            });
        });

        // 只有在显示模式选择时才添加搜索模式选项点击事件
        if (showModeSelection) {
            panel.querySelectorAll('.option-item').forEach(item => {
                if (item.querySelector('input[name="searchMode"]')) {
                    item.addEventListener('click', function() {
                        const radio = this.querySelector('input');
                        radio.checked = true;
                        panel.querySelectorAll('.option-item').forEach(i => {
                            if (i.querySelector('input[name="searchMode"]')) {
                                i.classList.remove('selected');
                            }
                        });
                        this.classList.add('selected');
                        updatePreview();
                    });
                }
            });
        }

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            const text = panel.querySelector('#search-text').value.trim();
            const engineKey = panel.querySelector('input[name="searchEngine"]:checked').value;
            let mode = config.searchMode; // 默认使用当前配置的模式

            // 只有在显示模式选择时才从界面获取模式
            if (showModeSelection) {
                const modeRadio = panel.querySelector('input[name="searchMode"]:checked');
                if (modeRadio) {
                    mode = modeRadio.value;
                }
            }

            if (!text) {
                showNotification('请输入搜索文本');
                return;
            }

            // 更新配置
            config.defaultSearchEngine = engineKey;
            if (showModeSelection) {
                config.searchMode = mode; // 只有在显示模式选择时才更新搜索模式
            }
            saveConfig();

            // 执行搜索
            performSearch(text, engineKey, mode);
            panel.remove();
        },
                        '搜索'
                       );

        document.body.appendChild(panel);
        updatePreview();
    }

    // 🆕 修改：优化单个搜索函数，避免弹出窗口被阻止
    function performSearch(text, engineKey, mode) {
        const engine = config.searchEngines[engineKey];
        if (!engine) {
            console.warn(`搜索引擎不存在: ${engineKey}`);
            return;
        }

        // 智能模式切换
        let actualMode = mode;
        if (mode === 'web' && !engine.webUrl) {
            actualMode = 'app';
        } else if (mode === 'app' && !engine.appUrl) {
            actualMode = 'web';
        }

        const baseUrl = actualMode === 'web' ? engine.webUrl : engine.appUrl;

        if (!baseUrl) {
            console.warn(`${engine.name} 没有可用的搜索URL`);
            return;
        }

        // 构建搜索URL
        let searchUrl;
        if (baseUrl.includes('{key}')) {
            searchUrl = baseUrl.replace('{key}', encodeURIComponent(text));
        } else {
            searchUrl = baseUrl + encodeURIComponent(text);
        }

        if (actualMode === 'web') {
            // 🆕 修改：使用更好的窗口打开方式
            openSearchWindow(searchUrl, engine.name);
        } else {
            // App搜索模式保持不变
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = searchUrl;
                document.body.appendChild(iframe);

                setTimeout(() => {
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                        if (engine.webUrl) {
                            openSearchWindow(engine.webUrl + encodeURIComponent(text), engine.name);
                        }
                    }
                }, 1000);

            } catch (err) {
                console.error('打开App失败:', err);
                if (engine.webUrl) {
                    openSearchWindow(engine.webUrl + encodeURIComponent(text), engine.name);
                }
            }
        }
    }

    // 🆕 新增：专门的窗口打开函数
    function openSearchWindow(url, engineName) {
        try {
            // 方法1：直接打开（可能在用户交互后允许）
            const newWindow = window.open(url, '_blank');

            // 方法2：如果被阻止，使用备用方法
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                // 创建临时链接点击
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.target = '_blank';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);

                console.log(`通过备用方法打开: ${engineName}`);
            } else {
                console.log(`直接打开: ${engineName}`);
            }

        } catch (err) {
            console.error(`打开 ${engineName} 失败:`, err);
            // 最终备用方案：在当前窗口打开
            window.location.href = url;
        }
    }

    // ================================
    // 新功能：阅读列表（稍后阅读）
    // ================================

    function createReadingListButton() {
        const button = document.createElement('div');
        button.id = 'reading-list-button';
        button.innerHTML = '📖';
        button.title = '添加到阅读列表';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99995',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['reading-list-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'reading-list-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            addToReadingList();
        };

        return button;
    }

    // 创建打开阅读列表按钮
    function createReadingListPanelButton() {
        const button = document.createElement('div');
        button.id = 'reading-list-panel-button';
        button.innerHTML = '📚';
        button.title = '打开阅读列表';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['reading-list-panel-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        // 添加到按钮位置配置
        if (!buttonPositions['reading-list-panel-button']) {
            buttonPositions['reading-list-panel-button'] = { defaultRight: 20, defaultBottom: 300 };
        }

        initButtonPosition(button, 'reading-list-panel-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            showReadingListPanel();
        };

        return button;
    }

    function addToReadingList() {
        // 确保分类配置存在
        if (!Array.isArray(config.readingListCategories) || config.readingListCategories.length === 0) {
            config.readingListCategories = ['未分类'];
        }
        if (!config.defaultReadingCategory) {
            config.defaultReadingCategory = '未分类';
        }

        const currentPage = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            favicon: getFavicon()
        };

        // 若开启“添加时选择分类”，弹出选择对话框
        if (config.requireCategoryOnAdd) {
            const categories = config.readingListCategories;

            const dialog = createPanel('选择分类', `
                <div class="panel-content">
                    <div class="input-group">
                        <label style="display:block; font-weight:600; margin-bottom:6px;">选择分类</label>
                        <select id="rl-add-category-select" class="form-input">
                            ${categories.map(c => `<option value="${c}" ${c === config.defaultReadingCategory ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group" style="margin-top:12px;">
                        <label style="display:block; font-weight:600; margin-bottom:6px;">新增分类</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="rl-new-category-input" class="form-input" placeholder="输入新分类名称">
                            <button class="btn" id="rl-btn-add-category">添加</button>
                        </div>
                        <div class="hint" style="margin-top:6px;color:#6b7280;">可直接添加新分类后再选择</div>
                    </div>
                </div>
            `);

            // 绑定新增分类
            dialog.querySelector('#rl-btn-add-category').addEventListener('click', function() {
                const val = dialog.querySelector('#rl-new-category-input').value.trim();
                if (!val) {
                    showNotification('请输入分类名称');
                    return;
                }
                if (config.readingListCategories.includes(val)) {
                    showNotification('分类已存在');
                    return;
                }
                config.readingListCategories.push(val);
                saveConfig();
                const sel = dialog.querySelector('#rl-add-category-select');
                const opt = document.createElement('option');
                opt.value = val; opt.textContent = val; sel.appendChild(opt);
                sel.value = val;
                dialog.querySelector('#rl-new-category-input').value = '';
                showNotification(`已添加分类：${val}`);
            });

            // 确认/取消
            addPanelButtons(
                dialog,
                () => dialog.remove(),
                () => {
                    const cat = dialog.querySelector('#rl-add-category-select').value || config.defaultReadingCategory;
                    const item = { ...currentPage, category: cat };
                    config.readingList.unshift(item);
                    saveConfig();
                    showNotification(`📖 已添加到阅读列表（分类：${cat}）`);
                    dialog.remove();
                },
                '添加'
            );

            document.body.appendChild(dialog);
            return;
        }

        // 未开启时，直接使用默认分类
        const category = config.defaultReadingCategory || '未分类';
        const item = { ...currentPage, category };
        config.readingList.unshift(item);
        saveConfig();
        showNotification(`📖 已添加到阅读列表（分类：${category}）`);
    }

    function getFavicon() {
        const favicon = document.querySelector('link[rel*="icon"]');
        return favicon ? favicon.href : '/favicon.ico';
    }

    function showReadingListPanel() {
        const readingList = config.readingList || [];
        // 兜底分类
        if (!Array.isArray(config.readingListCategories) || config.readingListCategories.length === 0) {
            config.readingListCategories = ['未分类'];
        }
        if (!config.defaultReadingCategory) {
            config.defaultReadingCategory = '未分类';
        }

        if (readingList.length === 0) {
            const panel = createPanel('阅读列表', `
                            <div class="panel-content">
                                <div class="empty-state">阅读列表为空</div>
                                <div style="text-align: center; margin-top: 20px;">
                                    <button class="btn btn-primary" id="add-current-page">添加当前页面</button>
                                </div>
                            </div>
                        `);

            panel.querySelector('#add-current-page').addEventListener('click', function() {
                addToReadingList();
                panel.remove();
            });

            addPanelButtons(panel, () => panel.remove());
            document.body.appendChild(panel);
            return;
        }

        const buildItemHTML = (item, index) => `
                        <div class="reading-list-item" style="
                            display: flex;
                            align-items: center;
                            padding: 16px;
                            border: 1px solid #e1e5e9;
                            border-radius: 8px;
                            margin-bottom: 12px;
                            background: #fafbfc;
                            transition: all 0.2s ease;
                        ">
                            <div class="reading-list-info" style="flex: 1; min-width: 0;">
                                <div class="reading-list-title" style="
                                    font-weight: 600;
                                    font-size: 14px;
                                    color: #2c3e50;
                                    margin-bottom: 4px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                ">${escapeHTML(item.title)} <span class="badge" style="margin-left:8px; font-size:11px; color:#4b5563; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; padding:2px 8px;">${escapeHTML(item.category || config.defaultReadingCategory || '未分类')}</span></div>
                                <div class="reading-list-url" style="
                                    color: #7f8c8d;
                                    font-size: 12px;
                                    margin-bottom: 4px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                ">${escapeHTML(item.url)}</div>
                                <div class="reading-list-date" style="
                                    color: #95a5a6;
                                    font-size: 11px;
                                ">${new Date(item.timestamp).toLocaleString()}</div>
                            </div>
                            <div class="reading-list-actions" style="
                                display: flex;
                                gap: 8px;
                                margin-left: 12px;
                            ">

                                <button class="btn-small btn-primary" data-index="${index}" style="
                                    padding: 6px 12px;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    border: none;
                                    background: #4A7BFF;
                                    color: white;
                                    cursor: pointer;
                                    transition: background 0.2s ease;
                                ">打开</button>
                                 <button class="btn-small btn-edit-cat" data-index="${index}" style="
                                    padding: 6px 12px;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    border: none;
                                    background: #6b7280;
                                    color: white;
                                    cursor: pointer;
                                    transition: background 0.2s ease;
                                ">分类</button>
                                <button class="btn-small btn-delete" data-index="${index}" style="
                                    padding: 6px 12px;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    border: none;
                                    background: #e74c3c;
                                    color: white;
                                    cursor: pointer;
                                    transition: background 0.2s ease;
                                ">删除</button>
                            </div>
                        </div>
                    `;

        const panel = createPanel('阅读列表', `
                        <div class="panel-content">
                            <div class="reading-list-header" style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 20px;
                                padding-bottom: 16px;
                                border-bottom: 1px solid #e1e5e9;
                                flex-direction: column;
                            ">
                                <div style="display:flex; gap:8px; align-items:center; margin: 4px 0 12px 0;">
                                    <select id="reading-category-filter" class="form-input" style="max-width: 220px;">
                                        <option value="">全部分类</option>
                                        ${config.readingListCategories.map(c => `<option value="${c}">${c}</option>`).join('')}
                                    </select>
                                    <button class="btn" id="btn-reading-category-manage" style="padding: 8px 12px; background: #6b7280; color: white; border: none; border-radius: 12px; cursor: pointer;width:30%;">📁 分类设置</button>
                                </div>
                                <div style="display: grid; gap: 12px;grid-template-columns: repeat(4, 1fr) !important;">
                                    <button class="btn btn-primary" id="add-current-page" style="
                                        padding: 8px 16px;
                                        color: white;
                                        border: none;
                                        border-radius: 12px;
                                        cursor: pointer;
                                        font-size: 14px;
                                        transition: background 0.2s ease;

                                    ">📖 添加当前页面</button>
                                    <button class="btn" id="copy-all-links" style="
                                        padding: 8px 16px;
                                        background: #ff528d;
                                        color: white;
                                        border: none;
                                        border-radius: 12px;
                                        cursor: pointer;
                                        font-size: 14px;
                                        transition: background 0.2s ease;
                                    ">📋 复制所有链接</button>
                                    <button class="btn" id="open-all-links" style="
                                        padding: 8px 16px;
                                        background: #36cfc9;
                                        color: white;
                                        border: none;
                                        border-radius: 12px;
                                        cursor: pointer;
                                        font-size: 14px;
                                        transition: background 0.2s ease;
                                    ">🗂️ 批量打开所有</button>
                                    <button class="btn btn-cancel" id="clear-all" style="
                                        padding: 8px 16px;
                                        background: #ff3520;
                                        color: white;
                                        border: none;
                                        border-radius: 12px;
                                        cursor: pointer;
                                        font-size: 14px;
                                        transition: background 0.2s ease;
                                    ">🗑️ 清空列表</button>
                                </div>
                                <div id="reading-list-count" style="color: #7f8c8d; font-size: 12px;margin: 8px;text-align:center;">共 ${readingList.length} 项</div>
                            </div>
                            <div class="reading-list" style="max-height: 400px; overflow-y: auto;">
                                <!-- 列表在脚本中渲染 -->
                            </div>
                        </div>
                    `);
        const listContainer = panel.querySelector('.reading-list');
        const countEl = panel.querySelector('#reading-list-count');
        const filterSelect = panel.querySelector('#reading-category-filter');

        function getItemCategory(item) {
            return item.category || config.defaultReadingCategory || '未分类';
        }

        function getFilteredReadingList() {
            const filterCategory = filterSelect ? filterSelect.value : '';
            return readingList.filter(it => {
                const cat = getItemCategory(it);
                return !filterCategory || cat === filterCategory;
            });
        }

        function renderList() {
            const filtered = getFilteredReadingList();
            listContainer.innerHTML = filtered.length ? filtered.map((item, i) => buildItemHTML(item, i)).join('') : '<div class="empty-state">当前筛选无内容</div>';

            // 绑定打开/删除事件
            listContainer.querySelectorAll('.btn-small.btn-primary').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const item = readingList[index];
                    try { GM_openInTab(item.url, { active: false, insert: true, setParent: true }); } catch (e) { window.open(item.url, '_blank'); }
                    panel.remove();
                });
            });
            listContainer.querySelectorAll('.btn-small.btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    readingList.splice(index, 1);
                    config.readingList = readingList;
                    saveConfig();
                    showNotification('已从阅读列表中删除');
                    renderList();
                });
            });

            // 绑定编辑分类事件
            listContainer.querySelectorAll('.btn-small.btn-edit-cat').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    showEditCategoryDialog(index);
                });
            });

            // 更新计数
            countEl.textContent = `共 ${filtered.length} 项`;
        }

        // 编辑分类对话框
        function showEditCategoryDialog(index) {
            // 兜底分类与当前值
            if (!Array.isArray(config.readingListCategories) || config.readingListCategories.length === 0) {
                config.readingListCategories = ['未分类'];
            }
            if (!config.defaultReadingCategory) {
                config.defaultReadingCategory = '未分类';
            }
            const item = readingList[index];
            const currentCat = item.category || config.defaultReadingCategory;

            const dialog = createPanel('编辑分类', `
                <div class="panel-content">
                    <div class="input-group">
                        <label style="display:block; font-weight:600; margin-bottom:6px;">选择分类</label>
                        <select id="rl-edit-category-select" class="form-input">
                            ${config.readingListCategories.map(c => `<option value="${c}" ${c === currentCat ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group" style="margin-top:12px;">
                        <label style="display:block; font-weight:600; margin-bottom:6px;">新增分类</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="rl-edit-new-category-input" class="form-input" placeholder="输入新分类名称">
                            <button class="btn" id="rl-edit-btn-add-category">添加</button>
                        </div>
                        <div class="hint" style="margin-top:6px;color:#6b7280;">可直接添加新分类后再选择</div>
                    </div>
                </div>
            `);

            // 新增分类（按钮与回车）
            function addNewCategory() {
                const val = dialog.querySelector('#rl-edit-new-category-input').value.trim();
                if (!val) { showNotification('请输入分类名称'); return; }
                if (config.readingListCategories.some(v => v.toLowerCase() === val.toLowerCase())) {
                    showNotification('分类已存在');
                    return;
                }
                config.readingListCategories.push(val);
                saveConfig();
                const sel = dialog.querySelector('#rl-edit-category-select');
                const opt = document.createElement('option');
                opt.value = val; opt.textContent = val; sel.appendChild(opt);
                sel.value = val;
                dialog.querySelector('#rl-edit-new-category-input').value = '';
                showNotification(`已添加分类：${val}`);
            }
            dialog.querySelector('#rl-edit-btn-add-category').addEventListener('click', addNewCategory);
            dialog.querySelector('#rl-edit-new-category-input').addEventListener('keydown', function(e) {
                if (e.key === 'Enter') addNewCategory();
            });

            // 保存/取消
            addPanelButtons(
                dialog,
                () => dialog.remove(),
                () => {
                    const cat = dialog.querySelector('#rl-edit-category-select').value || config.defaultReadingCategory;
                    readingList[index].category = cat;
                    config.readingList = readingList;
                    saveConfig();
                    showNotification(`已更新分类为：${cat}`);
                    dialog.remove();
                    // 按当前筛选重新渲染
                    renderList();
                },
                '保存'
            );

            document.body.appendChild(dialog);
        }

        // 初始渲染
        renderList();

        // 分类筛选
        filterSelect.addEventListener('change', renderList);

        // 分类设置
        panel.querySelector('#btn-reading-category-manage').addEventListener('click', function() {
            showReadingListSettingsPanel();
        });

        // 添加当前页面
        panel.querySelector('#add-current-page').addEventListener('click', function() {
            addToReadingList();
            panel.remove();
        });

        // 复制所有链接
        panel.querySelector('#copy-all-links').addEventListener('click', function() {
            const currentList = getFilteredReadingList();
            if (!currentList.length) {
                showNotification('当前筛选下没有可复制的链接');
                return;
            }
            const allUrls = currentList.map(item => item.url).join('\n');
            navigator.clipboard.writeText(allUrls).then(() => {
                const filterLabel = filterSelect && filterSelect.value ? `（分类：${filterSelect.value}）` : '';
                showNotification(`📋 已复制 ${currentList.length} 个链接到剪贴板${filterLabel}`);
            }).catch(() => {
                showNotification('复制失败，请手动复制');
            });
        });

        // 批量打开所有链接
        panel.querySelector('#open-all-links').addEventListener('click', function() {
            if (!readingList.length) {
                showNotification('阅读列表为空');
                return;
            }
            const all = readingList.map(item => item.url);
            openMultipleLinksFromList(all);
        });

        // 清空列表
        panel.querySelector('#clear-all').addEventListener('click', function() {
            if (confirm('确定要清空阅读列表吗？')) {
                config.readingList = [];
                saveConfig();
                showNotification('阅读列表已清空');
                panel.remove();
            }
        });

        // 打开链接逻辑已在 renderList 中绑定

        // 注：置顶/置底已迁移到组合按钮菜单中的“回到顶部/滚动到底部”操作

        // 删除项目逻辑已在 renderList 中绑定

        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
    }

    // ================================
    // 阅读列表设置面板（分类管理 + 添加时选择分类）
    // ================================

    function showReadingListSettingsPanel() {
        // 兜底分类
        if (!Array.isArray(config.readingListCategories) || config.readingListCategories.length === 0) {
            config.readingListCategories = ['未分类'];
        }
        if (!config.defaultReadingCategory) {
            config.defaultReadingCategory = '未分类';
        }

        function categoriesListHTML() {
            const def = config.defaultReadingCategory || '未分类';
            const list = config.readingList || [];
            return config.readingListCategories.map(c => {
                const count = list.filter(it => (it.category || def) === c).length;
                const isDefault = c === def;
                return `
                <div class="pattern-item rls-cat-item">
                    <div class="pattern-info rls-cat-info">
                        <div class="pattern-domain rls-cat-name">
                            ${c}
                            ${isDefault ? '<span class="rls-badge rls-badge-default">默认</span>' : ''}
                            ${count ? `<span class="rls-badge rls-badge-count">${count}</span>` : ''}
                        </div>
                    </div>
                    <div class="pattern-actions rls-cat-actions">
                        <button class="btn-small btn-delete" data-cat="${c}" ${isDefault ? 'disabled' : ''}>删除</button>
                    </div>
                </div>`;
            }).join('');
        }

        const panel = createPanel('阅读列表设置', `
            <div class="panel-content rls-root">
                <style>
                .rls-root { --rls-accent:#4a7bff; --rls-bg:#f6f8ff; --rls-soft:#e7edff; }
                .rls-root .section-title { margin-top: 14px; color: #2b3a67; }
                .rls-toggle { display:flex; align-items:center; gap:12px; padding:10px; border:1px solid var(--rls-soft); border-radius:10px; background:#fff; }
                .rls-switch { position:relative; display:inline-block; width:46px; height:26px; }
                .rls-switch input { opacity:0; width:0; height:0; }
                .rls-switch .slider { position:absolute; cursor:pointer; inset:0; background:var(--rls-soft); transition:0.2s; border-radius:13px; border:1px solid rgba(74,123,255,0.25); }
                .rls-switch .slider:before { content:""; position:absolute; height:20px; width:20px; left:3px; top:3px; background:#fff; border-radius:50%; box-shadow:0 1px 3px rgba(0,0,0,.2); transition:0.2s; }
                .rls-switch input:checked + .slider { background:var(--rls-accent); }
                .rls-switch input:checked + .slider:before { transform: translateX(20px); }
                .rls-toggle .checkbox-info .checkbox-title { font-weight:600; color:#1f2d5c; }
                .rls-toggle .checkbox-info .checkbox-desc { color:#5d6a8a; font-size:12px; }

                .rls-group { padding:10px; border:1px solid var(--rls-soft); border-radius:10px; background:#fff; }
                .rls-row { display:flex; gap:8px; align-items:center; }
                .rls-root .form-input { flex:1; padding:8px 10px; border:1px solid var(--rls-soft); border-radius:8px; outline:none; }
                .rls-root .form-input:focus { border-color: var(--rls-accent); box-shadow: 0 0 0 2px rgba(74,123,255,0.15); }
                .rls-root .btn { background:var(--rls-accent); color:#fff; border:none; border-radius:8px; padding:8px 14px; cursor:pointer; }
                .rls-root .btn:hover { filter: brightness(1.05); }
                .rls-root .btn[disabled] { opacity:0.6; cursor:not-allowed; }

                .rls-badge { display:inline-block; margin-left:8px; padding:2px 8px; border-radius:999px; font-size:12px; }
                .rls-badge-default { background:linear-gradient(135deg, #65aaff 0%, #6173f4 100%); color:white }
                .rls-badge-count { background:rgba(74,123,255,0.1); color:var(--rls-accent); border:1px solid rgba(74,123,255,0.25); }

                .rls-cat-item { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px; border-radius:8px; border:1px solid var(--rls-soft); background:#fff;flex-direction: row }
                .rls-cat-actions .btn-small { background:#ffe8ea; color:#c62828; border:1px solid #ffcdd2; border-radius:6px; padding:4px 8px; }
                .rls-cat-actions .btn-small[disabled] { background:#f1f1f1; color:#9aa3b2; border-color:#e0e0e0; }
                .rls-help { margin-top:10px; color:#5d6a8a; font-size:12px; }
                #rls-add-cat {width: 20%;border-radius:20px}
                </style>

                <div class="section-title">添加设置</div>
                <div class="rls-toggle">
                    <label class="rls-switch">
                        <input type="checkbox" id="rls-toggle-require" ${config.requireCategoryOnAdd ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <div class="checkbox-info">
                        <div class="checkbox-title">添加时选择分类</div>
                        <div class="checkbox-desc">开启后，每次添加会弹出分类选择弹窗；关闭时直接添加到默认分类。</div>
                    </div>
                </div>

                <div class="section-title">分类管理</div>
                <div class="rls-group">
                    <label style="display:block; margin-bottom:6px; font-weight:600; color:#1f2d5c;">新增分类</label>
                    <div class="rls-row">
                        <input id="rls-new-cat" type="text" class="form-input" placeholder="输入新分类名称，例如：技术、阅读、收藏">
                        <button id="rls-add-cat" class="btn btn-primary">添加</button>
                    </div>
                    <div class="rls-help">提示：分类名不区分大小写且需唯一。</div>
                </div>

                <div class="section-title">默认分类</div>
                <div class="rls-group">
                    <div class="rls-row">
                        <select id="rls-default-select" class="form-input">${config.readingListCategories.map(c => `<option value="${c}" ${c === config.defaultReadingCategory ? 'selected' : ''}>${c}</option>`).join('')}</select>
                    </div>
                    <div class="rls-help">默认分类用于在未要求选择分类时直接归类新条目。</div>
                </div>

                <div class="section-title">已创建的分类</div>
                <div id="rls-categories" class="pattern-items">${categoriesListHTML()}</div>
            </div>
        `);

        function refreshUI() {
            // 刷新默认选择
            const defSel = panel.querySelector('#rls-default-select');
            defSel.innerHTML = config.readingListCategories.map(c => `<option value="${c}" ${c === config.defaultReadingCategory ? 'selected' : ''}>${c}</option>`).join('');
            // 刷新类别列表
            panel.querySelector('#rls-categories').innerHTML = categoriesListHTML();
            bindDeleteButtons();
        }

        function bindDeleteButtons() {
            panel.querySelectorAll('#rls-categories .btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const cat = this.getAttribute('data-cat');
                    if (cat === config.defaultReadingCategory) {
                        showNotification('不能删除默认分类');
                        return;
                    }

                    const list = config.readingList || [];
                    const def = config.defaultReadingCategory || '未分类';
                    const count = list.filter(it => (it.category || def) === cat).length;
                    if (count > 0) {
                        showNotification('该分类下有项目，暂不支持删除。请先移动或删除项目');
                        return;
                    }
                    const idx = config.readingListCategories.indexOf(cat);
                    if (idx >= 0) config.readingListCategories.splice(idx, 1);
                    saveConfig();
                    refreshUI();
                    showNotification(`已删除分类：${cat}`);
                });
            });
        }

        // 切换开关
        panel.querySelector('#rls-toggle-require').addEventListener('change', function() {
            config.requireCategoryOnAdd = this.checked;
            saveConfig();
            showNotification(this.checked ? '已开启添加时选择分类' : '已关闭添加时选择分类');
        });

        // 添加分类（按钮和回车）
        function addCategoryFromInput() {
            const input = panel.querySelector('#rls-new-cat');
            const val = (input.value || '').trim();
            if (!val) {
                showNotification('请输入分类名称');
                return;
            }
            // 去重（不区分大小写）
            if (config.readingListCategories.some(v => v.toLowerCase() === val.toLowerCase())) {
                showNotification('分类已存在');
                return;
            }
            config.readingListCategories.push(val);
            saveConfig();
            input.value = '';
            refreshUI();
            showNotification(`已添加分类：${val}`);
        }
        panel.querySelector('#rls-add-cat').addEventListener('click', addCategoryFromInput);
        panel.querySelector('#rls-new-cat').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') addCategoryFromInput();
        });

        // 设置默认分类
        panel.querySelector('#rls-default-select').addEventListener('change', function() {
            config.defaultReadingCategory = this.value;
            saveConfig();
            refreshUI();
            showNotification(`默认分类已设置为：${this.value}`);
        });

        addPanelButtons(panel, () => panel.remove());
        bindDeleteButtons();
        document.body.appendChild(panel);
    }

    // ================================
    // 🆕 新增：搜索剪贴板内容功能
    // ================================

    function searchClipboardContent() {
        // 先显示提示，让用户知道正在读取剪贴板
        showNotification('正在读取剪贴板内容...');

        // 异步读取剪贴板内容
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText()
                .then(text => {
                if (text && text.trim()) {
                    const searchText = text.trim();
                    showNotification(`已读取剪贴板内容: ${searchText.substring(0, 30)}${searchText.length > 30 ? '...' : ''}`);

                    // 根据设置决定是直接搜索还是打开搜索面板
                    if (config.enableDirectSearch) {
                        // 直接搜索模式
                        performSearch(searchText, config.defaultSearchEngine, config.searchMode);
                    } else {
                        // 显示搜索面板，并自动填入剪贴板内容
                        showSearchPanel(searchText, true);
                    }
                } else {
                    showNotification('剪贴板为空或不是文本内容');
                    // 如果剪贴板为空，直接打开搜索面板让用户手动输入
                    showSearchPanel('', true);
                }
            })
                .catch(err => {
                console.error('读取剪贴板失败:', err);
                handleClipboardError();
            });
        } else {
            // 浏览器不支持剪贴板API，使用降级方案
            handleClipboardError();
        }
    }

    // 处理剪贴板读取错误的辅助函数
    function handleClipboardError() {
        showNotification('无法读取剪贴板，请手动输入搜索内容');

        // 降级方案：使用prompt让用户手动粘贴
        setTimeout(() => {
            const manualText = prompt('请粘贴要搜索的内容:');
            if (manualText && manualText.trim()) {
                if (config.enableDirectSearch) {
                    performSearch(manualText.trim(), config.defaultSearchEngine, config.searchMode);
                } else {
                    showSearchPanel(manualText.trim(), true);
                }
            } else if (manualText !== null) {
                // 用户点了确定但内容为空，还是打开搜索面板
                showSearchPanel('', true);
            }
        }, 500);
    }

    // ================================
    // 新功能：链接净化（移除跟踪参数）
    // ================================

    function createCleanUrlButton() {
        const button = document.createElement('div');
        button.id = 'clean-url-button';
        button.innerHTML = '🧹';
        button.title = '净化链接';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99994',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['clean-url-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'clean-url-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            handleCleanUrl();
        };

        return button;
    }

    function handleCleanUrl() {
        const currentUrl = new URL(window.location.href);
        const originalUrl = currentUrl.toString();

        // 移除跟踪参数
        config.urlTrackingParams.forEach(param => {
            currentUrl.searchParams.delete(param);
        });

        const cleanedUrl = currentUrl.toString();

        if (cleanedUrl !== originalUrl) {
            // 直接在当前页面加载净化后的URL，不显示提示
            window.history.replaceState(null, document.title, cleanedUrl);
        }
    }

    function cleanUrl(url) {
        try {
            const urlObj = new URL(url);

            // 移除跟踪参数
            config.urlTrackingParams.forEach(param => {
                urlObj.searchParams.delete(param);
            });

            return urlObj.toString();
        } catch (err) {
            console.error('URL净化失败:', err);
            return url;
        }
    }

    // 🆕 新增：更新图标预览的辅助函数
    function updateIconPreview(iconValue, previewElement) {
        if (isImageUrl(iconValue)) {
            // 如果是图片链接，显示图片
            previewElement.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain; border-radius: 2px;" onerror="handleImageError(this)">`;
        } else if (iconValue) {
            // 如果是emoji或文本
            previewElement.innerHTML = iconValue;
        } else {
            // 如果为空，显示默认图标
            previewElement.innerHTML = '🔍';
        }
    }

    // 🆕 新增：判断是否为图片链接的函数
    function isImageUrl(url) {
        if (!url) return false;

        // 常见的图片格式
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff'];
        const imageDomains = ['favicon', 'icon', 'logo']; // 常见包含图片的域名关键词

        // 检查URL是否包含图片扩展名
        const hasImageExtension = imageExtensions.some(ext =>
                                                       url.toLowerCase().includes(ext)
                                                      );

        // 检查URL是否包含图片相关的域名
        const hasImageDomain = imageDomains.some(domain =>
                                                 url.toLowerCase().includes(domain)
                                                );

        // 如果是http/https链接，且包含图片特征，就认为是图片
        return (url.startsWith('http') || url.startsWith('//')) &&
            (hasImageExtension || hasImageDomain);
    }

    // 🆕 新增：图片加载错误的处理函数
    function handleImageError(imgElement) {
        imgElement.style.display = 'none';
        // 在图片后面显示错误提示
        const errorSpan = document.createElement('span');
        errorSpan.textContent = '❌';
        errorSpan.title = '图片加载失败';
        errorSpan.style.marginLeft = '5px';
        errorSpan.style.fontSize = '12px';
        errorSpan.style.color = '#ff6b6b';
        imgElement.parentNode.appendChild(errorSpan);
    }


    // ================================
    // URL净化配置面板
    // ================================

    function showUrlCleanConfigPanel() {
        const domains = config.autoCleanDomains || ['all'];
        const domainListHTML = domains.map(domain => `
                        <div class="pattern-item">
                            <div class="pattern-info">
                                <div class="pattern-domain">${domain === 'all' ? '所有网站' : domain}</div>
                            </div>
                            <div class="pattern-actions">
                                <button class="btn-small btn-delete" data-domain="${domain}">删除</button>
                            </div>
                        </div>
                    `).join('');

        const panel = createPanel('URL净化设置', `
                        <div class="panel-content">
                            <div class="checkbox-item">
                                <input type="checkbox" id="toggle-auto-clean" ${config.autoCleanUrl ? 'checked' : ''}>
                                <div class="checkbox-info">
                                    <div class="checkbox-title">自动净化URL</div>
                                    <div class="checkbox-desc">开启后访问网页时自动移除跟踪参数</div>
                                </div>
                            </div>

                            <div class="section-title">净化域名列表</div>
                            <div class="pattern-list">
                                ${domains.length === 0 ?
                                  '<div class="empty-state">暂无域名配置</div>' :
                                  `<div class="pattern-items">${domainListHTML}</div>`
                                  }
                            </div>

                            <div class="add-section">
                                <div class="section-title">添加净化域名</div>
                                <div class="input-group">
                                    <input type="text" id="new-clean-domain" placeholder="输入域名 (例如: example.com)，或输入 'all' 表示所有网站" class="form-input">
                                </div>
                                <button class="btn btn-primary" id="btn-add-clean-domain" style="width: 100%">添加域名</button>
                            </div>

                            <div class="section-title">跟踪参数列表</div>
                            <div class="input-group">
                                <textarea id="tracking-params" class="form-textarea" placeholder="每行一个跟踪参数">${config.urlTrackingParams.join('\n')}</textarea>
                            </div>
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">每行一个参数，保存后生效</div>
                        </div>
                    `);

        // 自动净化开关
        panel.querySelector('#toggle-auto-clean').addEventListener('change', function() {
            config.autoCleanUrl = this.checked;
            saveConfig();
            showNotification(`自动净化已${this.checked ? '开启' : '关闭'}`);
        });

        // 添加净化域名
        panel.querySelector('#btn-add-clean-domain').addEventListener('click', function() {
            const domain = panel.querySelector('#new-clean-domain').value.trim();

            if (!domain) {
                showNotification('请输入域名');
                return;
            }

            if (config.autoCleanDomains.includes(domain)) {
                showNotification('该域名已存在');
                return;
            }

            config.autoCleanDomains.push(domain);
            if (saveConfig()) {
                showNotification(`已添加净化域名: ${domain}`);

                // 修复：直接添加到列表，不重新打开面板
                const patternList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');
                const newItem = document.createElement('div');
                newItem.className = 'pattern-item';
                newItem.innerHTML = `
                                <div class="pattern-info">
                                    <div class="pattern-domain">${domain === 'all' ? '所有网站' : domain}</div>
                                </div>
                                <div class="pattern-actions">
                                    <button class="btn-small btn-delete" data-domain="${domain}">删除</button>
                                </div>
                            `;
                patternList.appendChild(newItem);

                // 绑定删除事件
                newItem.querySelector('.btn-delete').addEventListener('click', function() {
                    const domain = this.getAttribute('data-domain');
                    if (config.autoCleanDomains.length <= 1) {
                        showNotification('至少需要保留一个域名配置');
                        return;
                    }
                    if (confirm(`确定要从净化列表中删除 "${domain === 'all' ? '所有网站' : domain}" 吗？`)) {
                        config.autoCleanDomains = config.autoCleanDomains.filter(d => d !== domain);
                        if (saveConfig()) {
                            showNotification(`已删除净化域名: ${domain}`);
                            this.closest('.pattern-item').remove();
                        }
                    }
                });

                // 清空输入框
                panel.querySelector('#new-clean-domain').value = '';
            }
        });

        // 删除净化域名
        panel.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const domain = this.getAttribute('data-domain');

                if (config.autoCleanDomains.length <= 1) {
                    showNotification('至少需要保留一个域名配置');
                    return;
                }

                if (confirm(`确定要从净化列表中删除 "${domain === 'all' ? '所有网站' : domain}" 吗？`)) {
                    config.autoCleanDomains = config.autoCleanDomains.filter(d => d !== domain);
                    if (saveConfig()) {
                        showNotification(`已删除净化域名: ${domain}`);
                        // 修复：直接移除UI元素
                        this.closest('.pattern-item').remove();
                    }
                }
            });
        });

        // 跟踪参数保存
        const saveTrackingParams = function() {
            const paramsText = panel.querySelector('#tracking-params').value;
            const params = paramsText.split('\n')
            .map(param => param.trim())
            .filter(param => param.length > 0);

            config.urlTrackingParams = params;
            if (saveConfig()) {
                showNotification('跟踪参数列表已更新');
                panel.remove(); // 保存成功后关闭面板
            }
        };

        // 添加保存按钮
        addPanelButtons(panel,
                        () => panel.remove(),
                        saveTrackingParams,
                        '保存设置'
                       );

        document.body.appendChild(panel);
    }

    // 辅助函数：复制到剪贴板
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('复制失败:', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }

    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('复制失败:', err);
        }

        document.body.removeChild(textArea);
    }

    // ================================
    // 显示模式管理
    // ================================

    function switchDisplayMode(mode) {
        config.displayMode = mode;
        if (saveConfig()) {
            removeAllButtons();
            initializeButtons();
            showNotification('显示模式已切换');
        }
    }

    function showDisplayModePanel() {
        const panel = createPanel('显示模式设置', `
                        <div class="panel-content">
                            <div class="option-item ${config.displayMode === 'separate' ? 'selected' : ''}">
                                <input type="radio" name="displayMode" value="separate" ${config.displayMode === 'separate' ? 'checked' : ''} class="option-radio">
                                <div>
                                    <div class="option-title">分离模式</div>
                                    <div class="option-desc">所有按钮独立显示，可分别拖动</div>
                                </div>
                            </div>

                            <div class="option-item ${config.displayMode === 'combined' ? 'selected' : ''}">
                                <input type="radio" name="displayMode" value="combined" ${config.displayMode === 'combined' ? 'checked' : ''} class="option-radio">
                                <div>
                                    <div class="option-title">组合模式</div>
                                    <div class="option-desc">点击菜单按钮展开功能选项</div>
                                </div>
                            </div>
                        </div>
                    `);

        panel.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', function() {
                const radio = this.querySelector('input');
                radio.checked = true;
                panel.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            const selectedMode = panel.querySelector('input[name="displayMode"]:checked').value;
            panel.remove();
            switchDisplayMode(selectedMode);
        }
                       );

        document.body.appendChild(panel);
    }

    // ================================
    // 按钮显示控制
    // ================================

    function toggleButtonVisibility(buttonId, show) {
        // 🆕 先更新配置，确保后续操作使用最新状态
        config.buttonVisibility[buttonId] = show;
        
        let button = document.getElementById(buttonId);
        if (button) {
            // 🆕 iOS 优化：直接设置 display 属性，不使用 cssText
            button.style.setProperty('display', show ? 'flex' : 'none', 'important');
            
            // 🆕 如果显示按钮，确保位置正确
            if (show) {
                setButtonPosition(button, buttonId);
                // 🆕 确保按钮有点击事件处理
                if (button.clickHandler) {
                    button.onclick = button.clickHandler;
                }
            }
        }
        
        // 🆕 如果按钮不存在但需要显示，创建它
        if (show && !button) {
            let created = null;
            if (buttonId === 'auto-scroll-button') { created = createAutoScrollButton(); }
            if (created) { document.body.appendChild(created); button = created; }
        }

        // 🆕 iOS 优化：立即刷新组合菜单（如果展开的话）
        if (typeof currentExpandedGroup !== 'undefined' && currentExpandedGroup) {
            const rect = currentExpandedGroup.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top;
            currentExpandedGroup.remove();
            currentExpandedGroup = null;
            // 🆕 使用 setTimeout 0 确保 DOM 更新后立即重建
            setTimeout(() => {
                showExpandedButtonGroup(centerX, centerY);
            }, 0);
        }
        
        // 🆕 立即保存配置
        saveConfig();
    }

    function showButtonControlPanel() {
        const panel = createPanel('按钮显示控制', `
        <div class="panel-content">
            <!-- 主要功能按钮 -->
            <div class="section-title">主要功能按钮</div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-app-button" ${config.buttonVisibility['app-open-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">打开App按钮</div>
                    <div class="checkbox-desc">使用URL Scheme打开当前页面</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-copy-button" ${config.buttonVisibility['copy-link-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">复制链接按钮</div>
                    <div class="checkbox-desc">复制当前页面链接到剪贴板</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-search-button" ${config.buttonVisibility['visual-search-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">可视化搜索按钮</div>
                    <div class="checkbox-desc">选择文本进行搜索的按钮</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-input-search-button" ${config.buttonVisibility['input-search-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">输入搜索按钮</div>
                    <div class="checkbox-desc">弹出输入框进行搜索</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-html2md-button" ${config.buttonVisibility['html2md-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">区域→Markdown 按钮</div>
                    <div class="checkbox-desc">可视化选择页面区域并复制为 Markdown</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-github-upload-button" ${config.buttonVisibility['github-upload-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">GitHub 上传按钮</div>
                    <div class="checkbox-desc">开启长按图片上传到 GitHub 图床的功能</div>
                </div>
            </div>


            <div class="checkbox-item">
                <input type="checkbox" id="toggle-reading-list-button" ${config.buttonVisibility['reading-list-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">阅读列表按钮</div>
                    <div class="checkbox-desc">添加当前页面到阅读列表</div>
                </div>
            </div>

            <div class="checkbox-item">
    <input type="checkbox" id="toggle-reading-list-panel-button" ${config.buttonVisibility['reading-list-panel-button'] ? 'checked' : ''}>
    <div class="checkbox-info">
        <div class="checkbox-title">打开阅读列表按钮</div>
        <div class="checkbox-desc">显示打开阅读列表界面的专用按钮</div>
    </div>
            </div>

                        <div class="checkbox-item">
                <input type="checkbox" id="toggle-clean-url-button" ${config.buttonVisibility['clean-url-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">链接净化按钮</div>
                    <div class="checkbox-desc">去除URL中的跟踪参数</div>
                </div>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="toggle-element-hider-button" ${config.buttonVisibility['element-hider-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">元素隐藏按钮</div>
                    <div class="checkbox-desc">打开/关闭可视化元素隐藏工具</div>
                </div>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="toggle-element-selector-button" ${config.buttonVisibility['element-selector-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">元素选择器按钮</div>
                    <div class="checkbox-desc">可视化选择元素并获取 CSS 选择器</div>
                </div>
            </div>

            <!-- 🆕 页面滚动按钮 -->
            <div class="section-title">页面滚动按钮</div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-scroll-top-button" ${config.buttonVisibility['scroll-top-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">回到顶部按钮</div>
                    <div class="checkbox-desc">点击快速滚动到页面顶部</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-scroll-bottom-button" ${config.buttonVisibility['scroll-bottom-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">滚动到底部按钮</div>
                    <div class="checkbox-desc">点击快速滚动到页面底部</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-auto-scroll-button" ${config.buttonVisibility['auto-scroll-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">自动滚动按钮</div>
                    <div class="checkbox-desc">开始/停止平滑自动滚动</div>
                </div>
            </div>



            <!-- 🆕 新增：批量操作按钮 -->
            <div class="section-title">批量操作按钮</div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-batch-links-button" ${config.buttonVisibility['batch-links-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">批量打开链接按钮</div>
                    <div class="checkbox-desc">鼠标框选批量打开页面链接</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-batch-paste-button" ${config.buttonVisibility['batch-paste-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">批量粘贴链接按钮</div>
                    <div class="checkbox-desc">粘贴多个链接列表并批量打开</div>
                </div>
            </div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-batch-tools-button" ${config.buttonVisibility['batch-tools-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">批量工具按钮</div>
                    <div class="checkbox-desc">打开包含域名替换与关键词搜索的工具面板</div>
                </div>
            </div>

            <!-- 系统按钮 -->
            <div class="section-title">系统按钮</div>

            <div class="checkbox-item">
                <input type="checkbox" id="toggle-config-button" ${config.buttonVisibility['config-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">配置按钮</div>
                    <div class="checkbox-desc">打开配置菜单</div>
                </div>
            </div>


            <div class="checkbox-item">
                <input type="checkbox" id="toggle-combined-button" ${config.buttonVisibility['combined-button'] ? 'checked' : ''}>
                <div class="checkbox-info">
                    <div class="checkbox-title">组合按钮</div>
                    <div class="checkbox-desc">显示/隐藏组合模式的主菜单按钮</div>
                </div>
            </div>


            <!-- 🆕 新增：快速操作 -->
            <div class="section-title">快速操作</div>

            <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn" id="btn-show-all" style="flex: 1; background: #28a745; color: white;">显示所有按钮</button>
                <button class="btn" id="btn-hide-all" style="flex: 1; background: #dc3545; color: white;">隐藏所有按钮</button>
                <button class="btn" id="btn-reset-buttons" style="flex: 1; background: #6c757d; color: white;">重置默认</button>
            </div>
        </div>
    `);

        // 保存按钮设置
        function saveButtonSettings() {
            // 主要功能按钮
            toggleButtonVisibility('app-open-button', panel.querySelector('#toggle-app-button').checked);
            toggleButtonVisibility('copy-link-button', panel.querySelector('#toggle-copy-button').checked);
            toggleButtonVisibility('visual-search-button', panel.querySelector('#toggle-search-button').checked);
            toggleButtonVisibility('reading-list-button', panel.querySelector('#toggle-reading-list-button').checked);
            toggleButtonVisibility('clean-url-button', panel.querySelector('#toggle-clean-url-button').checked);
            toggleButtonVisibility('input-search-button', panel.querySelector('#toggle-input-search-button').checked);
            toggleButtonVisibility('html2md-button', panel.querySelector('#toggle-html2md-button').checked);
            toggleButtonVisibility('element-hider-button', panel.querySelector('#toggle-element-hider-button').checked);
            toggleButtonVisibility('element-selector-button', panel.querySelector('#toggle-element-selector-button').checked);
            toggleButtonVisibility('github-upload-button', panel.querySelector('#toggle-github-upload-button').checked);


            // 页面滚动按钮
            toggleButtonVisibility('scroll-top-button', panel.querySelector('#toggle-scroll-top-button').checked);
            toggleButtonVisibility('scroll-bottom-button', panel.querySelector('#toggle-scroll-bottom-button').checked);
            toggleButtonVisibility('auto-scroll-button', panel.querySelector('#toggle-auto-scroll-button').checked);

            //批量操作按钮
            toggleButtonVisibility('batch-links-button', panel.querySelector('#toggle-batch-links-button').checked);
            toggleButtonVisibility('batch-paste-button', panel.querySelector('#toggle-batch-paste-button').checked);
            toggleButtonVisibility('batch-tools-button', panel.querySelector('#toggle-batch-tools-button').checked);

            //打开阅读列表面板按钮
            toggleButtonVisibility('reading-list-panel-button', panel.querySelector('#toggle-reading-list-panel-button').checked);

            // 系统按钮
            toggleButtonVisibility('config-button', panel.querySelector('#toggle-config-button').checked);
            // 组合按钮显隐
            const combinedToggle = panel.querySelector('#toggle-combined-button');
            if (combinedToggle) toggleButtonVisibility('combined-button', combinedToggle.checked);

            return saveConfig();
        }

        // 🆕 实时更新：checkbox 改变时立即生效
        const checkboxMapping = {
            'toggle-app-button': 'app-open-button',
            'toggle-copy-button': 'copy-link-button',
            'toggle-search-button': 'visual-search-button',
            'toggle-reading-list-button': 'reading-list-button',
            'toggle-clean-url-button': 'clean-url-button',
            'toggle-input-search-button': 'input-search-button',
            'toggle-html2md-button': 'html2md-button',
            'toggle-element-hider-button': 'element-hider-button',
            'toggle-element-selector-button': 'element-selector-button',
            'toggle-github-upload-button': 'github-upload-button',
            'toggle-scroll-top-button': 'scroll-top-button',
            'toggle-scroll-bottom-button': 'scroll-bottom-button',
            'toggle-auto-scroll-button': 'auto-scroll-button',
            'toggle-batch-links-button': 'batch-links-button',
            'toggle-batch-paste-button': 'batch-paste-button',
            'toggle-batch-tools-button': 'batch-tools-button',
            'toggle-reading-list-panel-button': 'reading-list-panel-button',
            'toggle-config-button': 'config-button',
            'toggle-combined-button': 'combined-button'
        };
        
        Object.keys(checkboxMapping).forEach(checkboxId => {
            const checkbox = panel.querySelector('#' + checkboxId);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    toggleButtonVisibility(checkboxMapping[checkboxId], this.checked);
                });
            }
        });

        // 🆕 新增：显示所有按钮
        panel.querySelector('#btn-show-all').addEventListener('click', function() {
            panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            });
            showNotification('已选择显示所有按钮');
        });

        // 🆕 新增：隐藏所有按钮（立即应用）
        panel.querySelector('#btn-hide-all').addEventListener('click', function() {
            panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
            showNotification('已隐藏所有按钮');
        });

        // 🆕 新增：重置按钮设置
        panel.querySelector('#btn-reset-buttons').addEventListener('click', function() {
            if (confirm('确定要重置所有按钮显示设置为默认值吗？')) {
                // 重置为默认显示状态
                const defaults = {
                    'toggle-app-button': true,
                    'toggle-copy-button': true,
                    'toggle-search-button': true,
                    'toggle-reading-list-button': true,
                    'toggle-clean-url-button': true,
                    'toggle-batch-links-button': true,
                    'toggle-batch-paste-button': true,
                    'toggle-batch-tools-button': true,
                    'toggle-config-button': true,
                    'toggle-combined-button': true,
                    'toggle-input-search-button': true,
                    'toggle-reading-list-panel-button': true,
                    'toggle-html2md-button': true,
                    'toggle-element-hider-button': true,
                    'toggle-element-selector-button': true,
                    'toggle-github-upload-button': true,
                    'toggle-scroll-top-button': false,
                    'toggle-scroll-bottom-button': false,
                    'toggle-auto-scroll-button': false
                };
                
                Object.keys(defaults).forEach(id => {
                    const cb = panel.querySelector('#' + id);
                    if (cb) {
                        cb.checked = defaults[id];
                        cb.dispatchEvent(new Event('change'));
                    }
                });

                showNotification('已重置按钮设置为默认值');
            }
        });

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            if (saveButtonSettings()) {
                panel.remove();
                removeAllButtons();
                initializeButtons();
                showNotification('按钮显示设置已保存');
            }
        }
                       );

        document.body.appendChild(panel);
    }


    // ================================
    // 界面显示开关（预览卡片、二维码、选中文本）
    // ================================
    function showInterfaceVisibilityPanel() {
        const panel = createPanel('界面显示开关', `
            <div class="panel-content">
                <div class="section-title">文本选择</div>

                <div class="checkbox-item">
                    <input type="checkbox" id="toggle-selection-overlay" ${config.selectionSearchEnabled ? 'checked' : ''}>
                    <div class="checkbox-info">
                        <div class="checkbox-title">启用选中文本悬浮菜单</div>
                        <div class="checkbox-desc">选中文本后显示搜索/复制/隐藏/打开快捷栏</div>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 20px;">链接预览与二维码</div>

                <div class="checkbox-item">
                    <input type="checkbox" id="toggle-hover-preview-enabled" ${config.hoverPreviewEnabled ? 'checked' : ''}>
                    <div class="checkbox-info">
                        <div class="checkbox-title">启用悬浮预览卡片</div>
                        <div class="checkbox-desc">鼠标悬停链接显示预览卡片</div>
                    </div>
                </div>

                <div class="checkbox-item">
                    <input type="checkbox" id="toggle-preview-bgopen-button" ${config.previewShowBgOpenButton ? 'checked' : ''}>
                    <div class="checkbox-info">
                        <div class="checkbox-title">预览卡片显示“后台打开”按钮</div>
                        <div class="checkbox-desc">在预览卡片中显示后台打开操作按钮</div>
                    </div>
                </div>

                <div class="checkbox-item">
                    <input type="checkbox" id="toggle-qrpanel-bgopen-button" ${config.qrPanelShowBgOpenButton ? 'checked' : ''}>
                    <div class="checkbox-info">
                        <div class="checkbox-title">二维码面板显示“后台打开”按钮</div>
                        <div class="checkbox-desc">在二维码面板中显示后台打开操作按钮</div>
                    </div>
                </div>

                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button class="btn btn-primary" id="btn-preview-hide" style="width:50%">隐藏预览卡片</button>
                    <button class="btn btn-primary" id="btn-preview-show" style="width:50%">显示预览卡片</button>
                </div>
            </div>
        `);

        // 快捷隐藏/显示预览卡片（立即更改不保存）
        panel.querySelector('#btn-preview-hide').addEventListener('click', () => {
            config.hoverPreviewEnabled = false;
            hideLinkPreview();
            showNotification('已临时关闭悬浮预览卡片');
        });
        panel.querySelector('#btn-preview-show').addEventListener('click', () => {
            config.hoverPreviewEnabled = true;
            showNotification('已临时开启悬浮预览卡片');
        });

        function saveInterfaceVisibility() {
            // 保存各个开关的状态
            config.selectionSearchEnabled = panel.querySelector('#toggle-selection-overlay').checked;
            config.hoverPreviewEnabled = panel.querySelector('#toggle-hover-preview-enabled').checked;
            config.previewShowBgOpenButton = panel.querySelector('#toggle-preview-bgopen-button').checked;
            config.qrPanelShowBgOpenButton = panel.querySelector('#toggle-qrpanel-bgopen-button').checked;

            // 立即生效：如果关闭了文本悬浮，立即隐藏它
            if (!config.selectionSearchEnabled) {
                hideSelectionOverlay();
            }

            // 立即生效：如果关闭了链接预览，立即隐藏它
            if (!config.hoverPreviewEnabled) {
                hideLinkPreview();
            }

            return saveConfig();
        }

        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            if (saveInterfaceVisibility()) {
                panel.remove();
                showNotification('界面显示设置已保存');
            }
        }
                       );
        document.body.appendChild(panel);
    }
    // ================================
    // 匹配模式管理
    // ================================

    function showPatternManagementPanel() {
        const domainListHTML = Object.keys(config.domainPatterns).map(domain => `
                        <div class="pattern-item">
                            <div class="pattern-info">
                                <div class="pattern-domain">${escapeHTML(domain)}</div>
                                <div class="pattern-regex">${escapeHTML(config.domainPatterns[domain])}</div>
                            </div>
                            <div class="pattern-actions">
                                <button class="btn-small btn-edit" data-domain="${escapeHTML(domain)}">编辑</button>
                                <button class="btn-small btn-delete" data-domain="${escapeHTML(domain)}">删除</button>
                            </div>
                        </div>
                    `).join('');

        const panel = createPanel('匹配模式管理', `
                        <div class="panel-content">
                            <div class="pattern-list">
                                ${Object.keys(config.domainPatterns).length === 0 ?
                                  '<div class="empty-state">暂无匹配模式</div>' :
                                  `<div class="pattern-items">${domainListHTML}</div>`
                                  }
                            </div>

                            <div class="add-section">
                                <div class="section-title">添加新模式</div>
                                <div class="input-group">
                                    <input type="text" id="new-domain" placeholder="输入域名 (例如: example.com)" class="form-input">
                                </div>
                                <div class="input-group">
                                    <input type="text" id="new-pattern" placeholder="输入正则表达式 (例如: /book/\\d+)" class="form-input">
                                </div>
                                <button class="btn btn-primary" id="btn-add-pattern" style="width: 100%">添加模式</button>
                            </div>
                        </div>
                    `);

        // 添加模式
        panel.querySelector('#btn-add-pattern').addEventListener('click', function() {
            const domain = panel.querySelector('#new-domain').value.trim();
            const pattern = panel.querySelector('#new-pattern').value.trim();

            if (!domain) {
                showNotification('请输入域名');
                return;
            }
            if (!pattern) {
                showNotification('请输入正则表达式');
                return;
            }

            try {
                new RegExp(pattern);
            } catch (e) {
                showNotification('正则表达式格式错误');
                return;
            }

            config.domainPatterns[domain] = pattern;
            if (saveConfig()) {
                showNotification(`已为 ${domain} 添加模式`);

                // 修复：直接添加到列表，不重新打开面板
                const patternList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');
                const newItem = document.createElement('div');
                newItem.className = 'pattern-item';
                newItem.innerHTML = `
                                <div class="pattern-info">
                                    <div class="pattern-domain">${domain}</div>
                                    <div class="pattern-regex">${pattern}</div>
                                </div>
                                <div class="pattern-actions">
                                    <button class="btn-small btn-edit" data-domain="${domain}">编辑</button>
                                    <button class="btn-small btn-delete" data-domain="${domain}">删除</button>
                                </div>
                            `;
                patternList.appendChild(newItem);

                // 绑定事件
                bindPatternEvents(newItem, domain);

                // 清空输入框
                panel.querySelector('#new-domain').value = '';
                panel.querySelector('#new-pattern').value = '';
            }
        });

        // 绑定模式事件
        function bindPatternEvents(element, domain) {
            // 编辑按钮
            element.querySelector('.btn-edit').addEventListener('click', function() {
                const currentPattern = config.domainPatterns[domain];
                const newPattern = prompt(`编辑 ${domain} 的匹配模式：`, currentPattern);

                if (newPattern !== null) {
                    if (newPattern.trim() === '') {
                        delete config.domainPatterns[domain];
                        showNotification(`已删除 ${domain} 的匹配模式`);
                        element.remove();
                    } else {
                        try {
                            new RegExp(newPattern);
                            config.domainPatterns[domain] = newPattern.trim();
                            saveConfig();
                            showNotification(`已更新 ${domain} 的匹配模式`);
                            element.querySelector('.pattern-regex').textContent = newPattern.trim();
                        } catch (e) {
                            showNotification('正则表达式格式错误');
                        }
                    }
                }
            });

            // 删除按钮
            element.querySelector('.btn-delete').addEventListener('click', function() {
                if (confirm(`确定要删除 ${domain} 的匹配模式吗？`)) {
                    delete config.domainPatterns[domain];
                    if (saveConfig()) {
                        showNotification(`已删除 ${domain} 的匹配模式`);
                        element.remove();
                    }
                }
            });
        }

        // 绑定现有项目的事件
        panel.querySelectorAll('.pattern-item').forEach(item => {
            const domain = item.querySelector('.btn-edit').getAttribute('data-domain');
            bindPatternEvents(item, domain);
        });

        addPanelButtons(panel, () => panel.remove());

        document.body.appendChild(panel);
    }

    // ================================
    // 搜索引擎管理
    // ================================

    function showSearchEngineManagementPanel() {
        const engineListHTML = Object.keys(config.searchEngines).map(key => {
            const engine = config.searchEngines[key];

            // 🆕 修改：支持图片链接和emoji
            let iconDisplay = engine.icon;
            if (isImageUrl(engine.icon)) {
                // 如果是图片链接，显示图片
                iconDisplay = `<img src="${engine.icon}" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; border-radius: 2px; margin-right: 8px;" onerror="handleImageError(this)">`;
            } else {
                // 如果是emoji，添加右边距
                iconDisplay = `<span style="margin-right: 8px;">${engine.icon}</span>`;
            }

            return `
                    <div class="search-engine-item">
                        <div class="search-engine-info">
                            <div class="search-engine-name">${iconDisplay} ${engine.name} (${key})</div>
                            <div class="search-engine-urls">
                                <div>网页: ${engine.webUrl}</div>
                                <div>App: ${engine.appUrl}</div>
                            </div>
                        </div>
                        <div class="search-engine-actions">
                            <button class="btn-small btn-edit" data-engine="${key}">编辑</button>
                            <button class="btn-small btn-delete" data-engine="${key}">删除</button>
                        </div>
                    </div>
                `;
        }).join('');

        const panel = createPanel('搜索引擎管理', `
                        <div class="panel-content">
                            <div class="section-title">默认设置</div>
                            <div class="option-item" id="default-engine-setting">
                                <div class="option-icon">⭐</div>
                                <div class="option-info">
                                    <div class="option-title">默认搜索引擎</div>
                                    <div class="option-desc">当前: ${config.searchEngines[config.defaultSearchEngine]?.name || '未设置'}</div>
                                </div>
                            </div>

                            <div class="option-item" id="direct-search-setting">
                                <div class="option-icon">⚙️</div>
                                <div class="option-info">
                                    <div class="option-title">搜索界面模式</div>
                                    <div class="option-desc">可视化选择后${config.enableDirectSearch ? '直接搜索' : '显示选择界面'}</div>
                                </div>
                            </div>

                            <div class="option-item" id="search-mode-setting">
                                <div class="option-icon">🔍</div>
                                <div class="option-info">
                                    <div class="option-title">默认搜索模式</div>
                                    <div class="option-desc">当前: ${config.searchMode === 'web' ? '网页搜索' : 'App搜索'}</div>
                                </div>
                            </div>

                            <div class="option-item" id="visual-search-mode-setting">
                <div class="option-icon">🎯</div>
                <div class="option-info">
                    <div class="option-title">可视化搜索模式</div>
                    <div class="option-desc">当前: ${config.visualSearchMode === 'multi' ? '多引擎搜索' : '单引擎搜索'}</div>
                </div>
            </div>

            <div class="pattern-list">
                ${Object.keys(config.searchEngines).length === 0 ?
                                  '<div class="empty-state">暂无搜索引擎</div>' :
                                  `<div class="pattern-items">${engineListHTML}</div>`
                                  }
            </div>

                            <div class="add-section">
                                <div class="section-title">添加新搜索引擎</div>
                                <div class="input-group">
                                    <input type="text" id="new-engine-key" placeholder="唯一标识 (例如: google)" class="form-input">
                                </div>
                                <div class="input-group">
                                    <input type="text" id="new-engine-name" placeholder="显示名称 (例如: Google)" class="form-input">
                                </div>
                                <div class="input-group">
                    <input type="text" id="new-engine-icon" placeholder="图标 (例如: 🔍 或 https://example.com/icon.png)" class="form-input">
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">
                        支持emoji或图片链接
                    </div>
                    <!-- 🆕 新增：图标预览 -->
                    <div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e9ecef;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">图标预览:</div>
                        <div id="new-engine-icon-preview" style="font-size: 20px; min-height: 24px; text-align: center;">
                            🔍
                        </div>
                    </div>
                </div>
                                <div class="input-group">
                                    <input type="text" id="new-engine-web" placeholder="网页搜索URL (例如: https://www.google.com/search?q={key})" class="form-input">
                                    <div style="font-size: 12px; color: #666; margin-top: 4px;">使用 {key} 表示搜索关键词位置，如不使用则自动添加到末尾</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" id="new-engine-app" placeholder="App搜索URL (例如: google://search?q={key})" class="form-input">
                                    <div style="font-size: 12px; color: #666; margin-top: 4px;">使用 {key} 表示搜索关键词位置，如不使用则自动添加到末尾</div>
                                </div>
                                <button class="btn btn-primary" id="btn-add-engine" style="width: 100%">添加搜索引擎</button>
                            </div>
                        </div>
                    `);

        // 🆕 新增：图标输入实时预览功能
        const iconInput = panel.querySelector('#new-engine-icon');
        const iconPreview = panel.querySelector('#new-engine-icon-preview');

        // 监听图标输入框的变化
        iconInput.addEventListener('input', function() {
            const iconValue = this.value.trim();
            updateIconPreview(iconValue, iconPreview);
        });

        // 默认搜索引擎设置
        panel.querySelector('#default-engine-setting').addEventListener('click', function() {
            const engineOptions = Object.keys(config.searchEngines).map(key =>
                                                                        `<option value="${key}" ${config.defaultSearchEngine === key ? 'selected' : ''}>${config.searchEngines[key].name}</option>`
                                                                       ).join('');

            const selectPanel = createPanel('选择默认搜索引擎', `
                            <div class="panel-content">
                                <div class="input-group">
                                    <select id="default-engine-select" class="form-input">
                                        ${engineOptions}
                                    </select>
                                </div>
                            </div>
                        `);

            addPanelButtons(selectPanel, () => selectPanel.remove(), () => {
                const newDefault = selectPanel.querySelector('#default-engine-select').value;
                config.defaultSearchEngine = newDefault;
                if (saveConfig()) {
                    showNotification(`默认搜索引擎已设置为: ${config.searchEngines[newDefault].name}`);
                    selectPanel.remove();
                    // 更新显示文本
                    panel.querySelector('#default-engine-setting .option-desc').textContent = `当前: ${config.searchEngines[newDefault].name}`;
                }
            });

            document.body.appendChild(selectPanel);
        });

        // 搜索界面模式切换
        panel.querySelector('#direct-search-setting').addEventListener('click', function() {
            config.enableDirectSearch = !config.enableDirectSearch;
            if (saveConfig()) {
                showNotification(`搜索界面模式已${config.enableDirectSearch ? '开启' : '关闭'}`);
                // 更新显示文本
                this.querySelector('.option-desc').textContent = `可视化选择后${config.enableDirectSearch ? '直接搜索' : '显示选择界面'}`;
            }
        });

        // 默认搜索模式切换
        panel.querySelector('#search-mode-setting').addEventListener('click', function() {
            config.searchMode = config.searchMode === 'web' ? 'app' : 'web';
            if (saveConfig()) {
                showNotification(`默认搜索模式已切换到: ${config.searchMode === 'web' ? '网页搜索' : 'App搜索'}`);
                // 更新显示文本
                this.querySelector('.option-desc').textContent = `当前: ${config.searchMode === 'web' ? '网页搜索' : 'App搜索'}`;
            }
        });

        panel.querySelector('#visual-search-mode-setting').addEventListener('click', function() {
            config.visualSearchMode = config.visualSearchMode === 'multi' ? 'single' : 'multi';
            if (saveConfig()) {
                showNotification(`可视化搜索模式已切换到: ${config.visualSearchMode === 'multi' ? '多引擎搜索' : '单引擎搜索'}`);
                // 更新显示文本
                this.querySelector('.option-desc').textContent = `当前: ${config.visualSearchMode === 'multi' ? '多引擎搜索' : '单引擎搜索'}`;
            }
        });


        // 添加搜索引擎
        panel.querySelector('#btn-add-engine').addEventListener('click', function() {
            const key = panel.querySelector('#new-engine-key').value.trim();
            const name = panel.querySelector('#new-engine-name').value.trim();
            const icon = panel.querySelector('#new-engine-icon').value.trim();
            const webUrl = panel.querySelector('#new-engine-web').value.trim();
            const appUrl = panel.querySelector('#new-engine-app').value.trim();

            if (!key) {
                showNotification('请输入唯一标识');
                return;
            }
            if (!name) {
                showNotification('请输入显示名称');
                return;
            }
            if (config.searchEngines[key]) {
                showNotification('该标识已存在，请使用其他标识');
                return;
            }
            if (!webUrl && !appUrl) {
                showNotification('请至少填写网页搜索URL或App搜索URL其中一项');
                return;
            }

            config.searchEngines[key] = {
                name: name,
                webUrl: webUrl,
                appUrl: appUrl,
                icon: icon || '🔍'
            };

            if (saveConfig()) {
                showNotification(`已添加搜索引擎: ${name}`);

                // 修复：直接添加到列表，不重新打开面板
                const patternList = panel.querySelector('.pattern-items') || panel.querySelector('.pattern-list');
                const newItem = document.createElement('div');
                newItem.className = 'search-engine-item';
                newItem.innerHTML = `
                                <div class="search-engine-info">
                                    <div class="search-engine-name">${icon || '🔍'} ${name} (${key})</div>
                                    <div class="search-engine-urls">
                                        <div>网页: ${webUrl}</div>
                                        <div>App: ${appUrl}</div>
                                    </div>
                                </div>
                                <div class="search-engine-actions">
                                    <button class="btn-small btn-edit" data-engine="${key}">编辑</button>
                                    <button class="btn-small btn-delete" data-engine="${key}">删除</button>
                                </div>
                            `;
                patternList.appendChild(newItem);

                // 绑定事件
                bindSearchEngineEvents(newItem, key);

                // 清空输入框
                panel.querySelector('#new-engine-key').value = '';
                panel.querySelector('#new-engine-name').value = '';
                panel.querySelector('#new-engine-icon').value = '';
                panel.querySelector('#new-engine-web').value = '';
                panel.querySelector('#new-engine-app').value = '';
            }
        });

        // 绑定搜索引擎事件
        function bindSearchEngineEvents(element, key) {
            // 编辑按钮
            element.querySelector('.btn-edit').addEventListener('click', function() {
                const engine = config.searchEngines[key];
                const searchEngineItem = this.closest('.search-engine-item');

                // 替换为编辑模式
                searchEngineItem.innerHTML = `
                                <div class="search-engine-edit-form" style="width: 100%; padding: 16px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                    <div class="edit-form-group" style="margin-bottom: 12px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #1a1a1a; font-size: 14px;">显示名称:</label>
                                        <input type="text" id="edit-name-${key}" value="${engine.name}" class="form-input" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.2s ease;">
                                    </div>
                                     <!-- 🆕 新增：图标设置部分 -->
                    <div class="edit-form-group" style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #1a1a1a; font-size: 14px;">图标:</label>
                <input type="text" id="edit-icon-${key}" value="${engine.icon}" class="form-input" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.2s ease;">
                <div style="font-size: 12px; color: #666; margin-top: 4px;">
                    支持：emoji（如 🔍）或 图片链接（如 https://example.com/icon.jpg）
                </div>
                        <!-- 🆕 新增：图标预览 -->
                        <div style="margin-top: 8px; padding: 8px;  ">
                            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">图标预览:</div>
                            <div id="icon-preview-${key}" style="font-size: 20px; min-height: 24px;">
                                ${engine.icon.startsWith('http') ?
                    `<img src="${engine.icon}" style="width: 20px; height: 20px; object-fit: contain;">` :
                engine.icon}
                            </div>
                        </div>
                    </div>
                                              <div class="edit-form-group" style="margin-bottom: 12px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #1a1a1a; font-size: 14px;">网页搜索URL:</label>
                                        <input type="text" id="edit-web-${key}" value="${engine.webUrl}" class="form-input" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.2s ease;">
                                        <div style="font-size: 12px; color: #666; margin-top: 4px;">使用 {key} 表示搜索关键词位置，如不使用则自动添加到末尾</div>
                                    </div>
                                    <div class="edit-form-group" style="margin-bottom: 12px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #1a1a1a; font-size: 14px;">App搜索URL:</label>
                                        <input type="text" id="edit-app-${key}" value="${engine.appUrl}" class="form-input" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.2s ease;">
                                        <div style="font-size: 12px; color: #666; margin-top: 4px;">使用 {key} 表示搜索关键词位置，如不使用则自动添加到末尾</div>
                                    </div>
                                    <div class="edit-form-actions" style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
                                        <button class="btn btn-primary" id="save-${key}" style="padding: 8px 16px; background: #4a7bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease;">保存</button>
                                        <button class="btn btn-cancel" id="cancel-${key}" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease;">取消</button>
                                    </div>
                                </div>
                            `;

                // 🆕 新增：图标输入实时预览功能
                const iconInput = searchEngineItem.querySelector(`#edit-icon-${key}`);
                const iconPreview = searchEngineItem.querySelector(`#icon-preview-${key}`);

                // 监听图标输入框的变化
                iconInput.addEventListener('input', function() {
                    const iconValue = this.value.trim();
                    updateIconPreview(iconValue, iconPreview);
                });

                // 初始预览
                updateIconPreview(engine.icon, iconPreview);

                // 保存按钮事件
                searchEngineItem.querySelector(`#save-${key}`).addEventListener('click', function() {
                    const newName = searchEngineItem.querySelector(`#edit-name-${key}`).value.trim();
                    const newIcon = searchEngineItem.querySelector(`#edit-icon-${key}`).value.trim();
                    const newWebUrl = searchEngineItem.querySelector(`#edit-web-${key}`).value.trim();
                    const newAppUrl = searchEngineItem.querySelector(`#edit-app-${key}`).value.trim();

                    if (!newName) {
                        showNotification('请输入显示名称');
                        return;
                    }

                    config.searchEngines[key] = {
                        name: newName,
                        webUrl: newWebUrl,
                        appUrl: newAppUrl,
                        icon: newIcon || '🔍'
                    };

                    if (saveConfig()) {
                        showNotification(`已更新搜索引擎: ${newName}`);
                        // 更新显示
                        searchEngineItem.innerHTML = `
                                        <div class="search-engine-info">
                                            <div class="search-engine-name">${newIcon || '🔍'} ${newName} (${key})</div>
                                            <div class="search-engine-urls">
                                                <div>网页: ${newWebUrl}</div>
                                                <div>App: ${newAppUrl}</div>
                                            </div>
                                        </div>
                                        <div class="search-engine-actions">
                                            <button class="btn-small btn-edit" data-engine="${key}">编辑</button>
                                            <button class="btn-small btn-delete" data-engine="${key}">删除</button>
                                        </div>
                                    `;
                        // 重新绑定事件
                        bindSearchEngineEvents(searchEngineItem, key);
                    }
                });

                // 取消按钮事件
                searchEngineItem.querySelector(`#cancel-${key}`).addEventListener('click', function() {
                    // 恢复原始显示
                    searchEngineItem.innerHTML = `
                                    <div class="search-engine-info">
                                        <div class="search-engine-name">${engine.icon} ${engine.name} (${key})</div>
                                        <div class="search-engine-urls">
                                            <div>网页: ${engine.webUrl}</div>
                                            <div>App: ${engine.appUrl}</div>
                                        </div>
                                    </div>
                                    <div class="search-engine-actions">
                                        <button class="btn-small btn-edit" data-engine="${key}">编辑</button>
                                        <button class="btn-small btn-delete" data-engine="${key}">删除</button>
                                    </div>
                                `;
                    // 重新绑定事件
                    bindSearchEngineEvents(searchEngineItem, key);
                });
            });

            // 删除按钮
            element.querySelector('.btn-delete').addEventListener('click', function() {
                const key = this.getAttribute('data-engine');
                const engine = config.searchEngines[key];

                if (Object.keys(config.searchEngines).length <= 1) {
                    showNotification('至少需要保留一个搜索引擎');
                    return;
                }

                if (confirm(`确定要删除搜索引擎 "${engine.name}" 吗？`)) {
                    delete config.searchEngines[key];

                    // 如果删除的是默认搜索引擎，切换到第一个
                    if (config.defaultSearchEngine === key) {
                        config.defaultSearchEngine = Object.keys(config.searchEngines)[0];
                        // 更新默认搜索引擎显示
                        const defaultEngineItem = panel.querySelector('#default-engine-setting .option-desc');
                        if (defaultEngineItem) {
                            defaultEngineItem.textContent = `当前: ${config.searchEngines[config.defaultSearchEngine]?.name || '未设置'}`;
                        }
                    }

                    if (saveConfig()) {
                        showNotification(`已删除搜索引擎: ${engine.name}`);
                        // 修复：直接移除UI元素
                        this.closest('.search-engine-item').remove();
                    }
                }
            });
        }

        // 绑定现有搜索引擎事件
        panel.querySelectorAll('.search-engine-item').forEach(item => {
            const key = item.querySelector('.btn-edit').getAttribute('data-engine');
            bindSearchEngineEvents(item, key);
        });

        addPanelButtons(panel, () => panel.remove());

        document.body.appendChild(panel);
    }

    // ================================
    // 快捷键配置面板
    // ================================

    function showHotkeyConfigPanel() {
        const hotkeyList = [
            { key: 'app-open', name: '用App打开', desc: '使用URL Scheme打开当前页面' },
            { key: 'copy-link', name: '复制链接', desc: '复制当前页面链接到剪贴板' },
            { key: 'visual-search', name: '可视化搜索', desc: '启动可视化文本选择搜索' },
            { key: 'reading-list', name: '添加到阅读列表', desc: '将当前页面添加到阅读列表' },
            { key: 'clean-url', name: '链接净化', desc: '去除URL中的跟踪参数' },
            { key: 'config-panel', name: '打开配置面板', desc: '显示主配置菜单' },
            { key: 'search-panel', name: '打开搜索面板', desc: '显示搜索工具面板' },
            { key: 'reading-list-panel', name: '打开阅读列表', desc: '显示阅读列表管理界面' },
            { key: 'direct-search-panel', name: '直接搜索面板', desc: '直接打开搜索面板（不进行可视化选择）' },
            { key: 'clipboard-search', name: '搜索剪贴板', desc: '直接搜索剪贴板中的内容' },
            { key: 'batch-open-links', name: '批量打开链接', desc: '启动鼠标框选批量打开链接' },
            { key: 'batch-paste-links', name: '批量粘贴链接', desc: '打开批量粘贴链接面板' },
            { key: 'batch-tools-panel', name: '批量工具面板', desc: '打开批量工具面板' },
            { key: 'toggle-all-buttons', name: '隐藏/显示按钮', desc: '组合模式：隐藏/显示组合按钮 | 分离模式：隐藏/显示所有按钮' },
            { key: 'toggle-display-mode', name: '切换显示模式', desc: '在组合模式和分离模式之间切换' },
            { key: 'element-hider', name: '元素隐藏工具', desc: '打开元素隐藏面板' },
            { key: 'html2md', name: '区域→Markdown', desc: '可视化选择区域并复制为 Markdown' },
            { key: 'scroll-top', name: '滚动到顶部', desc: '平滑滚动到页面顶部' },
            { key: 'scroll-bottom', name: '滚动到底部', desc: '平滑滚动到页面底部' },
            { key: 'auto-scroll-toggle', name: '切换自动滚动', desc: '开始/停止平滑自动滚动' },
            { key: 'input-search', name: '输入搜索', desc: '弹出输入框进行搜索' },
            { key: 'element-selector', name: '元素选择器', desc: '启动可视化元素选择模式' },
            { key: 'github-upload', name: 'GitHub图床', desc: '图片上传到GitHub' },

        ];

        const hotkeyListHTML = hotkeyList.map(item => `
                        <div class="hotkey-item" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 16px;
                            border: 1px solid #e1e5e9;
                            border-radius: 8px;
                            margin-bottom: 12px;
                            background: #fafbfc;
                            transition: all 0.2s ease;
                        ">
                            <div class="hotkey-info" style="flex: 1;">
                                <div class="hotkey-name" style="
                                    font-weight: 600;
                                    color: #2c3e50;
                                    margin-bottom: 4px;
                                ">${item.name}</div>
                                <div class="hotkey-desc" style="
                                    color: #7f8c8d;
                                    font-size: 12px;
                                ">${item.desc}</div>
                            </div>
                            <div class="hotkey-actions" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                            ">
                                <div class="hotkey-display" id="hotkey-${item.key}" style="
                                    padding: 6px 12px;
                                    background: ${config.hotkeys[item.key] ? '#e7edff' : '#f8f9fa'};
                                    border: 1px solid ${config.hotkeys[item.key] ? '#4a7bff' : '#dee2e6'};
                                    border-radius: 6px;
                                    font-family: monospace;
                                    font-size: 12px;
                                    color: ${config.hotkeys[item.key] ? '#4a7bff' : '#6c757d'};
                                    min-width: 80px;
                                    text-align: center;
                                ">${config.hotkeys[item.key] || '未设置'}</div>
                                <button class="btn-small btn-primary" data-hotkey="${item.key}" style="
                                    padding: 6px 12px;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    border: none;
                                    background: #4A7BFF;
                                    color: white;
                                    cursor: pointer;
                                    transition: background 0.2s ease;
                                ">设置</button>
                                <button class="btn-small btn-delete" data-hotkey="${item.key}" style="
                                    padding: 6px 12px;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    border: none;
                                    background: #e74c3c;
                                    color: white;
                                    cursor: pointer;
                                    transition: background 0.2s ease;
                                ">清除</button>
                            </div>
                        </div>
                    `).join('');

        const panel = createPanel('快捷键配置', `
                        <div class="panel-content">
                            <div style="
                                background: #e3f2fd;
                                padding: 12px;
                                border-radius: 8px;
                                margin-bottom: 20px;
                                border-left: 4px solid #2196f3;
                            ">
                                <div style="font-weight: 600; color: #1976d2; margin-bottom: 4px;">💡 使用说明</div>
                                <div style="font-size: 13px; color: #1565c0;">
                                    点击"设置"按钮后，按下您想要的快捷键组合即可设置。支持 Ctrl、Alt、Shift、Meta(Command) 修饰键。
                                </div>
                            </div>

                            <div class="section-title">快捷键列表</div>
                            ${hotkeyListHTML}

                            <div style="
                                background: #fff3cd;
                                padding: 12px;
                                border-radius: 8px;
                                margin-top: 20px;
                                border-left: 4px solid #ffc107;
                            ">
                                <div style="font-weight: 600; color: #856404; margin-bottom: 4px;">⚠️ 注意事项</div>
                                <div style="font-size: 13px; color: #856404;">
                                    • 避免与浏览器默认快捷键冲突<br>
                                    • 建议使用 Ctrl+Alt+ 开头的组合键<br>
                                    • 设置后立即生效，无需重启
                                </div>
                            </div>
                        </div>
                    `);

        // 设置快捷键
        panel.querySelectorAll('[data-hotkey]').forEach(btn => {
            if (btn.classList.contains('btn-primary')) {
                btn.addEventListener('click', function() {
                    const hotkeyKey = this.getAttribute('data-hotkey');
                    showHotkeyInputDialog(hotkeyKey, panel);
                });
            } else if (btn.classList.contains('btn-delete')) {
                btn.addEventListener('click', function() {
                    const hotkeyKey = this.getAttribute('data-hotkey');
                    config.hotkeys[hotkeyKey] = '';
                    saveConfig();
                    registerAllHotkeys();
                    showNotification('快捷键已清除');

                    // 修复：直接更新显示，不重新打开面板
                    const hotkeyDisplay = document.getElementById(`hotkey-${hotkeyKey}`);
                    if (hotkeyDisplay) {
                        hotkeyDisplay.textContent = '未设置';
                        hotkeyDisplay.style.background = '#f8f9fa';
                        hotkeyDisplay.style.borderColor = '#dee2e6';
                        hotkeyDisplay.style.color = '#6c757d';
                    }
                });
            }
        });

        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
    }

    function showHotkeyInputDialog(hotkeyKey, parentPanel) {
        const dialog = createPanel('设置快捷键', `
                        <div class="panel-content">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <div style="font-size: 48px; margin-bottom: 16px;">⌨️</div>
                                <div style="font-weight: 600; color: #2c3e50; margin-bottom: 8px;">按下您想要的快捷键</div>
                                <div style="color: #7f8c8d; font-size: 14px;">支持 Ctrl、Alt、Shift、Meta(Command) 修饰键</div>
                            </div>

                            <div style="
                                background: #f8f9fa;
                                padding: 20px;
                                border-radius: 8px;
                                text-align: center;
                                margin-bottom: 20px;
                            ">
                                <div id="hotkey-preview" style="
                                    font-family: monospace;
                                    font-size: 18px;
                                    color: #495057;
                                    font-weight: 600;
                                ">等待按键...</div>
                            </div>

                            <div style="
                                background: #e3f2fd;
                                padding: 12px;
                                border-radius: 8px;
                                border-left: 4px solid #2196f3;
                            ">
                                <div style="font-weight: 600; color: #1976d2; margin-bottom: 4px;">💡 提示</div>
                                <div style="font-size: 13px; color: #1565c0;">
                                    建议使用 Ctrl+Alt+ 开头的组合键，避免与浏览器快捷键冲突
                                </div>
                            </div>
                        </div>
                    `);

        let isRecording = true;
        let recordedKeys = [];

        const keydownHandler = function(event) {
            if (!isRecording) return;

            event.preventDefault();
            event.stopPropagation();

            const modifiers = [];
            if (event.ctrlKey) modifiers.push('Ctrl');
            if (event.altKey) modifiers.push('Alt');
            if (event.shiftKey) modifiers.push('Shift');
            if (event.metaKey) modifiers.push('Meta');

            const key = event.key;

            // 忽略修饰键单独按下
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
                return;
            }

            // 构建快捷键字符串
            const hotkeyString = [...modifiers, key].join('+');

            // 检查是否与现有快捷键冲突
            const conflictKey = Object.keys(config.hotkeys).find(k =>
                                                                 k !== hotkeyKey && config.hotkeys[k] === hotkeyString
                                                                );

            if (conflictKey) {
                dialog.querySelector('#hotkey-preview').textContent = `冲突: ${hotkeyString}`;
                dialog.querySelector('#hotkey-preview').style.color = '#dc3545';
                return;
            }

            // 设置快捷键
            config.hotkeys[hotkeyKey] = hotkeyString;
            saveConfig();
            registerAllHotkeys();

            showNotification(`快捷键已设置为: ${hotkeyString}`);

            // 清理
            document.removeEventListener('keydown', keydownHandler);
            dialog.remove();

            // 修复：直接更新父面板中的显示，不重新打开面板
            const hotkeyDisplay = parentPanel.querySelector(`#hotkey-${hotkeyKey}`);
            if (hotkeyDisplay) {
                hotkeyDisplay.textContent = hotkeyString;
                hotkeyDisplay.style.background = '#e7edff';
                hotkeyDisplay.style.borderColor = '#4a7bff';
                hotkeyDisplay.style.color = '#4a7bff';
            }
        };

        document.addEventListener('keydown', keydownHandler);

        // 取消按钮
        addPanelButtons(dialog, () => {
            document.removeEventListener('keydown', keydownHandler);
            dialog.remove();
        });

        document.body.appendChild(dialog);
    }

    // ================================
    // 自定义样式配置面板
    // ================================
    function showCustomStylePanel() {
        const panel = createPanel('自定义样式', `
                    <div class="panel-content" style="background: linear-gradient(135deg, #faf7ff 0%, #f5f3ff 100%);">
                        <!-- 启用开关 -->
                        <div class="toggle-container">
                            <div class="toggle-info">
                                <h3>✨ 启用魔法样式</h3>
                                <p>开启后解锁所有自定义样式效果，让界面焕然一新</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="toggle-custom-style" ${config.customStyle.enabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <!-- 实时预览 -->
                        <div class="style-preview-container floating">
                            <button class="style-preview-demo" id="style-preview-demo">
                                ✨ 魔法按钮
                            </button>
                            <div class="style-preview-text" id="style-preview-text">
                                🎯 实时预览 · 所见即所得 · 即时生效
                            </div>
                        </div>

                        <!-- 颜色设置 -->
                        <div class="style-section">
                            <div class="style-section-title">
                                <span class="icon">🎨</span>
                                梦幻色彩
                            </div>

                            <div class="color-grid">
                                <!-- 主色调 -->
                                <div class="color-picker-group">
                                    <div class="color-picker-wrapper">
                                        <input type="color" id="custom-primary-color" value="${config.customStyle.primaryColor}" class="color-picker" title="主色调">
                                    </div>
                                    <div class="color-input-group">
                                        <label class="color-label">主色调</label>
                                        <input type="text" id="custom-primary-color-text" value="${config.customStyle.primaryColor}" class="color-input" placeholder="#ff6b9d">
                                    </div>
                                </div>

                                <!-- 次色调 -->
                                <div class="color-picker-group">
                                    <div class="color-picker-wrapper">
                                        <input type="color" id="custom-secondary-color" value="${config.customStyle.secondaryColor}" class="color-picker" title="次色调">
                                    </div>
                                    <div class="color-input-group">
                                        <label class="color-label">次色调</label>
                                        <input type="text" id="custom-secondary-color-text" value="${config.customStyle.secondaryColor}" class="color-input" placeholder="#ff8fab">
                                    </div>
                                </div>

                                <!-- 背景色 -->
                                <div class="color-picker-group">
                                    <div class="color-picker-wrapper">
                                        <input type="color" id="custom-background-color" value="${config.customStyle.backgroundColor}" class="color-picker" title="背景色">
                                    </div>
                                    <div class="color-input-group">
                                        <label class="color-label">背景色</label>
                                        <input type="text" id="custom-background-color-text" value="${config.customStyle.backgroundColor}" class="color-input" placeholder="#faf7ff">
                                    </div>
                                </div>

                                <!-- 文字色 -->
                                <div class="color-picker-group">
                                    <div class="color-picker-wrapper">
                                        <input type="color" id="custom-text-color" value="${config.customStyle.textColor}" class="color-picker" title="文字色">
                                    </div>
                                    <div class="color-input-group">
                                        <label class="color-label">文字色</label>
                                        <input type="text" id="custom-text-color-text" value="${config.customStyle.textColor}" class="color-input" placeholder="#2d3748">
                                    </div>
                                </div>

                                <!-- 阴影色 -->
                                <div class="color-picker-group">
                                    <div class="color-picker-wrapper">
                                        <input type="color" id="custom-shadow-color" value="${config.customStyle.shadowColor || '#ff6b9d'}" class="color-picker" title="阴影色">
                                    </div>
                                    <div class="color-input-group">
                                        <label class="color-label">阴影色</label>
                                        <input type="text" id="custom-shadow-color-text" value="${config.customStyle.shadowColor || '#ff6b9d'}" class="color-input" placeholder="#ff6b9d">
                                    </div>
                                </div>

                                <!-- 阴影强度 -->
                                <div class="slider-container">
                                    <div class="slider-header">
                                        <div class="slider-label">✨ 阴影强度</div>
                                        <div class="slider-value" id="shadow-intensity-value">${config.customStyle.shadowIntensity || 0.1}</div>
                                    </div>
                                    <input type="range" min="0" max="1" step="0.01" value="${config.customStyle.shadowIntensity || 0.1}" class="slider" id="custom-shadow-intensity">
                                </div>
                            </div>
                        </div>

                        <!-- 样式设置 -->
                        <div class="style-section">
                            <div class="style-section-title">
                                <span class="icon">⚙️</span>
                                精细调整
                            </div>

                            <div class="slider-container">
                <div class="slider-container">
                <div class="slider-header">
                    <div class="slider-label">🎀 圆角大小</div>
                    <div class="slider-value" id="border-radius-value">${config.customStyle.borderRadius}</div>
                </div>
                <input type="range" min="0" max="50" value="${parseInt(config.customStyle.borderRadius) || 12}" class="slider" id="custom-border-radius">
            </div>

                            <div class="slider-container">
                                <div class="slider-header">
                                    <div class="slider-label">🔤 字体大小</div>
                                    <div class="slider-value" id="font-size-value">${config.customStyle.fontSize}</div>
                                </div>
                                <input type="range" min="1" max="25" value="${parseInt(config.customStyle.fontSize) || 12}" class="slider" id="custom-font-size">
                            </div>

                            <div style="margin-bottom: 16px; padding: 16px; background: rgba(255, 255, 255, 0.7); border-radius: 16px; border: 1.5px solid rgba(255, 255, 255, 0.5);">
                                <div style="font-weight: 700; color: #4a5568; margin-bottom: 8px; font-size: 14px;">🎨 字体家族</div>
                                <input type="text" id="custom-font-family" class="color-input" style="width: 100%;"
                                       value="${config.customStyle.fontFamily}"
                                       placeholder="输入字体名称，如：Arial, sans-serif">
                                <div style="font-size: 12px; color: #718096; margin-top: 6px; line-height: 1.4;">
                                    💡 常用字体示例：<br>
                                    • system-ui, -apple-system, sans-serif (系统默认)<br>
                                    • 'SF Pro Display', -apple-system, sans-serif (苹果风格)<br>
                                    • 'Segoe UI', system-ui, sans-serif (微软风格)<br>
                                    • 'Inter', system-ui, sans-serif (现代风格)
                                </div>
                            </div>

                            <div class="slider-container">
                                <div class="slider-header">
                                    <div class="slider-label">🔘 按钮大小</div>
                                    <div class="slider-value" id="button-size-value">${config.customStyle.buttonSize}px</div>
                                </div>
                                <input type="range" min="24" max="48" value="${config.customStyle.buttonSize}" class="slider" id="custom-button-size">
                            </div>
                        </div>

                        <!-- 预设主题 -->
                        <div class="style-section">
                            <div class="style-section-title">
                                <span class="icon">🌈</span>
                                糖果主题
                            </div>
                            <div class="preset-grid">
                                <div class="preset-card" data-theme="strawberry" style="--preset-color: #ff6b9d; --preset-gradient: linear-gradient(135deg, #ff6b9d, #ff8fab);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">草莓奶霜</div>
                                    <div class="preset-desc">粉嫩甜美</div>
                                </div>
                                <div class="preset-card" data-theme="blueberry" style="--preset-color: #74b9ff; --preset-gradient: linear-gradient(135deg, #74b9ff, #0984e3);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">蓝莓冰沙</div>
                                    <div class="preset-desc">清爽活力</div>
                                </div>
                                <div class="preset-card" data-theme="lavender" style="--preset-color: #a29bfe; --preset-gradient: linear-gradient(135deg, #a29bfe, #6c5ce7);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">薰衣草梦</div>
                                    <div class="preset-desc">浪漫优雅</div>
                                </div>
                                <div class="preset-card" data-theme="peach" style="--preset-color: #ffeaa7; --preset-gradient: linear-gradient(135deg, #ffeaa7, #fdcb6e);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">蜜桃苏打</div>
                                    <div class="preset-desc">温暖明亮</div>
                                </div>
                                <div class="preset-card" data-theme="mint" style="--preset-color: #81ecec; --preset-gradient: linear-gradient(135deg, #81ecec, #00cec9);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">薄荷糖</div>
                                    <div class="preset-desc">清新自然</div>
                                </div>
                                <div class="preset-card" data-theme="bubblegum" style="--preset-color: #ff8fab; --preset-gradient: linear-gradient(135deg, #ff8fab, #e84393);">
                                    <div class="preset-color"></div>
                                    <div class="preset-name">泡泡糖</div>
                                    <div class="preset-desc">活泼可爱</div>
                                </div>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="style-actions">
                            <button class="style-action-btn style-reset-btn" id="reset-style-btn">
                                🔄 重置样式
                            </button>
                            <button class="style-action-btn style-save-btn" id="save-style-btn">
                                💾 保存魔法
                            </button>
                        </div>
                    </div>
                `);

        // 更新预览函数
        function updatePreview() {
            const primaryColor = panel.querySelector('#custom-primary-color').value;
            const secondaryColor = panel.querySelector('#custom-secondary-color').value;
            const backgroundColor = panel.querySelector('#custom-background-color').value;
            const textColor = panel.querySelector('#custom-text-color').value;
            const shadowColor = panel.querySelector('#custom-shadow-color').value;
            const shadowIntensity = panel.querySelector('#custom-shadow-intensity').value;
            const borderRadius = panel.querySelector('#custom-border-radius').value + 'px';
            const fontSize = panel.querySelector('#custom-font-size').value + 'px';
            const fontFamily = panel.querySelector('#custom-font-family').value;

            // 计算阴影
            const shadowOpacity = shadowIntensity;
            const shadowBlur = Math.round(shadowIntensity * 40);
            const shadowSpread = Math.round(shadowIntensity * 5);

            const shadowValue = `0 12px ${shadowBlur}px ${shadowSpread}px ${hexToRgba(shadowColor, shadowOpacity)}`;
            const shadowHoverValue = `0 20px ${shadowBlur + 10}px ${shadowSpread + 2}px ${hexToRgba(shadowColor, shadowOpacity + 0.2)}`;

            // 更新滑块颜色
            panel.querySelectorAll('.slider').forEach(slider => {
                slider.style.setProperty('--slider-color', primaryColor);
            });

            // 更新预览容器
            const previewContainer = panel.querySelector('.style-preview-container');
            const previewDemo = panel.querySelector('#style-preview-demo');
            const previewText = panel.querySelector('#style-preview-text');

            if (previewContainer) {
                previewContainer.style.background = backgroundColor;
                previewContainer.style.color = textColor;
                previewContainer.style.fontFamily = fontFamily;
                previewContainer.style.fontSize = fontSize;
                previewContainer.style.borderRadius = borderRadius;
            }

            if (previewDemo) {
                previewDemo.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
                previewDemo.style.borderRadius = borderRadius;
                previewDemo.style.fontSize = fontSize;
                previewDemo.style.fontFamily = fontFamily;
                previewDemo.style.color = 'white';
                previewDemo.style.setProperty('--preview-shadow', shadowValue);
                previewDemo.style.setProperty('--preview-shadow-hover', shadowHoverValue);
            }

            if (previewText) {
                previewText.style.fontSize = fontSize;
                previewText.style.fontFamily = fontFamily;
                previewText.style.color = textColor;
            }

            // 更新CSS变量用于实时预览
            document.documentElement.style.setProperty('--preview-primary', primaryColor);
            document.documentElement.style.setProperty('--preview-secondary', secondaryColor);
        }

        // 辅助函数：十六进制颜色转RGBA
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // 颜色输入框联动
        function setupColorInputs(colorId, textId) {
            const colorInput = panel.querySelector(`#${colorId}`);
            const textInput = panel.querySelector(`#${textId}`);

            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
                updatePreview();
            });

            textInput.addEventListener('input', function() {
                if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
                    colorInput.value = this.value;
                    updatePreview();
                }
            });
        }

        // 设置滑块
        function setupSlider(sliderId, valueId, suffix = '', formatter = null) {
            const slider = panel.querySelector(`#${sliderId}`);
            const valueDisplay = panel.querySelector(`#${valueId}`);

            slider.addEventListener('input', function() {
                const value = formatter ? formatter(this.value) : this.value;
                valueDisplay.textContent = value + suffix;
                updatePreview();
            });
        }

        // 初始化颜色输入
        setupColorInputs('custom-primary-color', 'custom-primary-color-text');
        setupColorInputs('custom-secondary-color', 'custom-secondary-color-text');
        setupColorInputs('custom-background-color', 'custom-background-color-text');
        setupColorInputs('custom-text-color', 'custom-text-color-text');
        setupColorInputs('custom-shadow-color', 'custom-shadow-color-text');

        // 初始化滑块
        setupSlider('custom-border-radius', 'border-radius-value', 'px');
        setupSlider('custom-font-size', 'font-size-value', 'px');
        setupSlider('custom-button-size', 'button-size-value', 'px');
        setupSlider('custom-shadow-intensity', 'shadow-intensity-value', '', (value) => parseFloat(value).toFixed(2));

        // 字体输入
        panel.querySelector('#custom-font-family').addEventListener('input', updatePreview);

        // 启用开关
        panel.querySelector('#toggle-custom-style').addEventListener('change', function() {
            config.customStyle.enabled = this.checked;
            saveConfig();
            showNotification(this.checked ? '✨ 魔法样式已开启' : '⚪ 魔法样式已关闭');
            if (this.checked) {
                applyCustomStyles();
            } else {
                removeCustomStyles();
            }
        });

        // 预设主题
        const presetThemes = {
            strawberry: {
                primary: '#ff6b9d', secondary: '#ff8fab', background: '#faf7ff', text: '#2d3748',
                shadow: '#ff6b9d', shadowIntensity: 0.4
            },
            blueberry: {
                primary: '#74b9ff', secondary: '#0984e3', background: '#f0f8ff', text: '#2d3748',
                shadow: '#74b9ff', shadowIntensity: 0.35
            },
            lavender: {
                primary: '#a29bfe', secondary: '#6c5ce7', background: '#f5f3ff', text: '#2d3748',
                shadow: '#a29bfe', shadowIntensity: 0.4
            },
            peach: {
                primary: '#ffeaa7', secondary: '#fdcb6e', background: '#fffaf0', text: '#2d3748',
                shadow: '#fdcb6e', shadowIntensity: 0.3
            },
            mint: {
                primary: '#81ecec', secondary: '#00cec9', background: '#f0fffe', text: '#2d3748',
                shadow: '#81ecec', shadowIntensity: 0.35
            },
            bubblegum: {
                primary: '#ff8fab', secondary: '#e84393', background: '#fff0f5', text: '#2d3748',
                shadow: '#ff8fab', shadowIntensity: 0.45
            }
        };

        panel.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                const themeConfig = presetThemes[theme];

                if (themeConfig) {
                    // 更新颜色输入
                    panel.querySelector('#custom-primary-color').value = themeConfig.primary;
                    panel.querySelector('#custom-primary-color-text').value = themeConfig.primary;
                    panel.querySelector('#custom-secondary-color').value = themeConfig.secondary;
                    panel.querySelector('#custom-secondary-color-text').value = themeConfig.secondary;
                    panel.querySelector('#custom-background-color').value = themeConfig.background;
                    panel.querySelector('#custom-background-color-text').value = themeConfig.background;
                    panel.querySelector('#custom-text-color').value = themeConfig.text;
                    panel.querySelector('#custom-text-color-text').value = themeConfig.text;
                    panel.querySelector('#custom-shadow-color').value = themeConfig.shadow;
                    panel.querySelector('#custom-shadow-color-text').value = themeConfig.shadow;
                    panel.querySelector('#custom-shadow-intensity').value = themeConfig.shadowIntensity;
                    panel.querySelector('#shadow-intensity-value').textContent = themeConfig.shadowIntensity;

                    // 更新预览
                    updatePreview();

                    showNotification(`🌈 已应用 ${this.querySelector('.preset-name').textContent} 主题`);
                }
            });
        });

        // 重置样式
        panel.querySelector('#reset-style-btn').addEventListener('click', function() {
            if (confirm('确定要重置所有样式设置为默认值吗？')) {
                // 重置颜色
                panel.querySelector('#custom-primary-color').value = '#ff6b9d';
                panel.querySelector('#custom-primary-color-text').value = '#ff6b9d';
                panel.querySelector('#custom-secondary-color').value = '#ff8fab';
                panel.querySelector('#custom-secondary-color-text').value = '#ff8fab';
                panel.querySelector('#custom-background-color').value = '#faf7ff';
                panel.querySelector('#custom-background-color-text').value = '#faf7ff';
                panel.querySelector('#custom-text-color').value = '#2d3748';
                panel.querySelector('#custom-text-color-text').value = '#2d3748';
                panel.querySelector('#custom-shadow-color').value = '#ff6b9d';
                panel.querySelector('#custom-shadow-color-text').value = '#ff6b9d';
                panel.querySelector('#custom-shadow-intensity').value = '0.4';
                panel.querySelector('#shadow-intensity-value').textContent = '0.4';

                // 重置滑块
                panel.querySelector('#custom-border-radius').value = '12';
                panel.querySelector('#border-radius-value').textContent = '12px';
                panel.querySelector('#custom-font-size').value = '14';
                panel.querySelector('#font-size-value').textContent = '14px';
                panel.querySelector('#custom-button-size').value = '28';
                panel.querySelector('#button-size-value').textContent = '28px';

                // 重置字体
                panel.querySelector('#custom-font-family').value = 'system-ui, -apple-system, sans-serif';

                updatePreview();
                showNotification('🔄 样式已重置为默认值');
            }
        });

        // 保存样式
        panel.querySelector('#save-style-btn').addEventListener('click', function() {
            // 保存样式配置
            config.customStyle.primaryColor = panel.querySelector('#custom-primary-color').value;
            config.customStyle.secondaryColor = panel.querySelector('#custom-secondary-color').value;
            config.customStyle.backgroundColor = panel.querySelector('#custom-background-color').value;
            config.customStyle.textColor = panel.querySelector('#custom-text-color').value;
            config.customStyle.shadowColor = panel.querySelector('#custom-shadow-color').value;
            config.customStyle.shadowIntensity = parseFloat(panel.querySelector('#custom-shadow-intensity').value);
            config.customStyle.borderRadius = panel.querySelector('#custom-border-radius').value + 'px';
            config.customStyle.fontSize = panel.querySelector('#custom-font-size').value + 'px';
            config.customStyle.fontFamily = panel.querySelector('#custom-font-family').value;
            config.customStyle.buttonSize = parseInt(panel.querySelector('#custom-button-size').value);
            config.buttonSize = config.customStyle.buttonSize || config.buttonSize;

            if (saveConfig()) {
                showNotification('💾 魔法样式已保存');
                applyCustomStyles();

                // 重新初始化按钮以确保样式生效
                setTimeout(() => {
                    removeAllButtons();
                    initializeButtons();
                }, 100);

                panel.remove();
            }
        });

        // 初始预览
        updatePreview();

        document.body.appendChild(panel);
    }
    // 应用自定义样式
    function applyCustomStyles() {
        if (!config.customStyle.enabled) {
            removeCustomStyles();
            return;
        }

        const styleId = 'smart-link-custom-styles';
        let styleElement = document.getElementById(styleId);

        if (styleElement) {
            styleElement.remove();
        }

        styleElement = document.createElement('style');
        styleElement.id = styleId;

        const customCSS = `
    :root {
        --smart-link-primary-color: ${config.customStyle.primaryColor};
        --smart-link-secondary-color: ${config.customStyle.secondaryColor};
        --smart-link-background-color: ${config.customStyle.backgroundColor};
        --smart-link-text-color: ${config.customStyle.textColor};
        --smart-link-shadow-color: ${config.customStyle.shadowColor};
        --smart-link-shadow-intensity: ${config.customStyle.shadowIntensity};
        --smart-link-border-radius: ${config.customStyle.borderRadius};
        --smart-link-font-size: ${config.customStyle.fontSize};
        --smart-link-font-family: ${config.customStyle.fontFamily};
    }

    /* 🆕 修改：配置界面中的所有按钮字体 */
    .floating-panel .btn,
    .floating-panel .btn-primary,
    .floating-panel .btn-success,
    .floating-panel .btn-cancel,
    .floating-panel .btn-small,
    .floating-panel .elegant-btn,
    .floating-panel .style-action-btn,
    .floating-panel .style-reset-btn,
    .floating-panel .style-save-btn,
    .floating-panel #btn-show-all,
    .floating-panel #btn-hide-all,
    .floating-panel #btn-reset-buttons,
    .floating-panel #btn-add-pattern,
    .floating-panel #btn-add-engine,
    .floating-panel #btn-add-scheme,
    .floating-panel #btn-add-clean-domain,
    .floating-panel #btn-visual-select,
    .floating-panel #btn-paste-clipboard,
    .floating-panel #btn-clear-text,
    .floating-panel #btn-manage-configs,
    .floating-panel #btn-new-config,
    .floating-panel #btn-create-config,
    .floating-panel #btn-add-link,
    .floating-panel #save-style-btn,
    .floating-panel #reset-style-btn,
    .floating-panel .btn-test,
    .floating-panel .btn-edit,
    .floating-panel .btn-delete {
        font-family: var(--smart-link-font-family) !important;
        font-size: calc(var(--smart-link-font-size) - 1px) !important;
        border-radius:var(--smart-link-border-radius) !important
    }

    /* 🆕 修改：配置界面中的输入框和选择框字体 */
    .floating-panel .form-input,
    .floating-panel .form-textarea,
    .floating-panel .elegant-select,
    .floating-panel .color-input,
    .floating-panel select {
        font-family: var(--smart-link-font-family) !important;
        font-size: var(--smart-link-font-size) !important;
    }

    /* 🆕 修改：配置界面中的标签和文本字体 */
    .floating-panel .section-title,
    .floating-panel .checkbox-title,
    .floating-panel .checkbox-desc,
    .floating-panel .option-title,
    .floating-panel .option-desc,
    .floating-panel .pattern-domain,
    .floating-panel .pattern-regex,
    .floating-panel .config-description,
    .floating-panel .slider-label,
    .floating-panel .slider-value,
    .floating-panel .color-label,
    .floating-panel .toggle-info h3,
    .floating-panel .toggle-info p {
        font-family: var(--smart-link-font-family) !important;
    }


    .floating-panel .checkbox-desc,
    .floating-panel .option-desc,
    .floating-panel .pattern-domain,
    .floating-panel .pattern-regex,
    .floating-panel .config-description,
    .floating-panel .slider-label,
    .floating-panel .slider-value,
    .floating-panel .color-label,
    .floating-panel .toggle-info h3,
    .floating-panel .toggle-info p {
        font-size: var(--smart-link-font-size) !important;
    }

        .floating-panel .section-title{
        font-size: calc(var(--smart-link-font-size) + 2px) !important;
    }
        .floating-panel .checkbox-title,
        .floating-panel .option-title{
        font-size: calc(var(--smart-link-font-size) + 1px) !important;
    }


    /* 🆕 修改：特殊按钮的字体大小调整 */
    .floating-panel .btn-small {
        font-size: calc(var(--smart-link-font-size) - 2px) !important;
    }

    /* 🆕 修改：配置界面中的预览文本字体 */
    .floating-panel .style-preview-text,
    .floating-panel .search-preview-title,
    .floating-panel .search-preview-url {
        font-family: var(--smart-link-font-family) !important;
        font-size: var(--smart-link-font-size) !important;
    }

    /* 🆕 修改：预设卡片字体 */
    .floating-panel .preset-name,
    .floating-panel .preset-desc {
        font-family: var(--smart-link-font-family) !important;
    }


    /* 🆕 修改：移除影响拖拽性能的样式 */
    #app-open-button,
    #copy-link-button,
    #visual-search-button,
    #reading-list-button,
    #clean-url-button,
    #config-button,
    #combined-button,
    #batch-links-button,
    #batch-paste-button,
    #reading-list-panel-button,
    #input-search-button {
        /* 🗑️ 移除：复杂的渐变背景 */
        background: white !important;

        /* 🗑️ 移除：复杂的阴影效果 */
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;

        /* 🆕 保留：圆角、字体等不影响性能的样式 */
        border-radius: var(--smart-link-border-radius) !important;
        font-family: var(--smart-link-font-family) !important;
        font-size: var(--smart-link-font-size) !important;
        color: var(--smart-link-primary-color) !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        /* 🗑️ 移除：所有过渡效果 */
        /* transition: all 0.3s ease !important; */
    }

    /* 🆕 修改：面板样式保留，不影响拖拽 */
    .floating-panel .panel-container {
        background: var(--smart-link-background-color) !important;
        color: var(--smart-link-text-color) !important;
        border-radius: min(20px, var(--smart-link-border-radius)) !important;
        font-family: var(--smart-link-font-family) !important;
        font-size: var(--smart-link-font-size) !important;
    }

    .floating-panel .btn-primary,
    .floating-panel .btn-success {
        background: linear-gradient(135deg, var(--smart-link-primary-color), var(--smart-link-secondary-color)) !important;
        border-radius: var(--smart-link-border-radius) !important;
        font-family: var(--smart-link-font-family) !important;
        border: none !important;
        color: white !important;
    }

    /* 🆕 通知样式保留 */
    .smart-link-toast {
        background: var(--smart-link-background-color) !important;
        color: var(--smart-link-text-color) !important;
        border-radius: var(--smart-link-border-radius) !important;
        font-family: var(--smart-link-font-family) !important;
        font-size: var(--smart-link-font-size) !important;
        border: 1px solid rgba(0,0,0,0.1) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }

    /* 🗑️ 移除：所有复杂的阴影计算和颜色混合 */

    `;

        styleElement.textContent = customCSS;
        document.head.appendChild(styleElement);
    }


    // 移除自定义样式
    function removeCustomStyles() {
        const styleElement = document.getElementById('smart-link-custom-styles');
        if (styleElement) {
            styleElement.remove();
            console.log('已移除自定义样式'); // 调试信息
        }

        // 恢复默认按钮大小
        config.buttonSize = 28;
        updateButtonSizes();
    }

    // 更新按钮大小
    function updateButtonSizes() {
        const buttons = [
            'app-open-button',
            'copy-link-button',
            'visual-search-button',
            'reading-list-button',
            'clean-url-button',
            'config-button',
            'batch-links-button',
            'batch-paste-button',
            'batch-tools-button',
            'reading-list-panel-button',
            'input-search-button',
            'html2md-button',
            'auto-scroll-button',
            'scroll-top-button',
            'scroll-bottom-button',
            'element-hider-button',
            'element-selector-button',
            'github-upload-button',
            'combined-button'
        ];

        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                const size = config.customStyle.enabled ? config.customStyle.buttonSize : config.buttonSize;
                button.style.width = size + 'px';
                button.style.height = size + 'px';
                button.style.fontSize = (size * 0.6) + 'px';
            }
        });
    }

    // 🆕 新增：域名专用URL Scheme管理面板
    function showDomainSchemePanel() {
        const domainSchemes = config.domainUrlSchemes || {};
        const currentDomain = window.location.hostname;

        const schemeListHTML = Object.keys(domainSchemes).map(domain => `
                    <div class="pattern-item">
                        <div class="pattern-info">
                            <div class="pattern-domain">${domain} ${domain === currentDomain ? '<span style="color: #4CAF50; font-size: 12px;">(当前网站)</span>' : ''}</div>
                            <div class="pattern-regex">${domainSchemes[domain]}</div>
                        </div>
                        <div class="pattern-actions">
                            <button class="btn-small btn-edit" data-domain="${domain}">编辑</button>
                            <button class="btn-small btn-delete" data-domain="${domain}">删除</button>
                        </div>
                    </div>
                `).join('');

        const panel = createPanel('域名专用URL Scheme管理', `
                    <div class="panel-content">
                        <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                            <div style="font-weight: 600; color: #1976d2; margin-bottom: 8px;">💡 使用说明</div>
                            <div style="font-size: 13px; color: #1565c0; line-height: 1.4;">
                                • 可以为特定域名设置专用URL Scheme<br>
                                • 当前域名: <strong>${currentDomain}</strong><br>
                                • 当前Scheme模式: <strong>${config.useGlobalScheme ? '全局通用Scheme' : '域名专用Scheme'}</strong><br>
                                • ${config.useGlobalScheme ? '⚠️ 全局模式已开启，域名专用Scheme将被忽略' : '✅ 域名专用模式，优先使用专用Scheme'}
                            </div>
                        </div>

                        ${config.useGlobalScheme ? `
                        <div style="background: #fff3cd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                            <div style="font-weight: 600; color: #856404; margin-bottom: 8px;">⚠️ 全局模式已开启</div>
                            <div style="font-size: 13px; color: #856404; line-height: 1.4;">
                                当前已启用"全局使用通用Scheme"，域名专用Scheme配置将被忽略。<br>
                                如需使用域名专用Scheme，请在URL Scheme设置中关闭全局模式。
                            </div>
                        </div>
                        ` : ''}

                        <div class="pattern-list">
                            ${Object.keys(domainSchemes).length === 0 ?
                                  '<div class="empty-state">暂无域名专用Scheme配置</div>' :
                                  `<div class="pattern-items">${schemeListHTML}</div>`
                                  }
                        </div>

                        <div class="add-section">
                            <div class="section-title">添加域名专用Scheme</div>
                            <div class="input-group">
                                <input type="text" id="new-scheme-domain" placeholder="域名 (例如: example.com)" class="form-input" value="${currentDomain}">
                            </div>
                            <div class="input-group">
                                <input type="text" id="new-scheme-url" placeholder="URL Scheme (例如: myapp://)" class="form-input">
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                                请输入完整的URL Scheme，如: myapp:// 或 myapp: 或 teak-http://
                            </div>
                        </div>
                            <button class="btn btn-primary" id="btn-add-scheme" style="width: 100%" ${config.useGlobalScheme ? 'disabled' : ''}>添加域名Scheme</button>
                            ${config.useGlobalScheme ? '<div style="color: #dc3545; font-size: 12px; margin-top: 8px;">全局模式已开启，无法添加域名专用Scheme</div>' : ''}
                        </div>
                    </div>
                `);

        // 添加域名Scheme（仅在非全局模式下可用）
        panel.querySelector('#btn-add-scheme').addEventListener('click', function() {
            if (config.useGlobalScheme) {
                showNotification('全局模式已开启，无法添加域名专用Scheme');
                return;
            }

            const domain = panel.querySelector('#new-scheme-domain').value.trim();
            const scheme = panel.querySelector('#new-scheme-url').value.trim();

            if (!domain) {
                showNotification('请输入域名');
                return;
            }
            if (!scheme) {
                showNotification('请输入URL Scheme');
                return;
            }

            if (!config.domainUrlSchemes) {
                config.domainUrlSchemes = {};
            }

            config.domainUrlSchemes[domain] = scheme;
            if (saveConfig()) {
                showNotification(`已为 ${domain} 设置专用Scheme: ${scheme}`);
                panel.remove();
                showDomainSchemePanel();
            }
        });

        // 编辑域名Scheme
        panel.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                if (config.useGlobalScheme) {
                    showNotification('全局模式已开启，无法编辑域名专用Scheme');
                    return;
                }

                const domain = this.getAttribute('data-domain');
                const currentScheme = domainSchemes[domain];
                const newScheme = prompt(`编辑 ${domain} 的URL Scheme:`, currentScheme);

                if (newScheme !== null && newScheme.trim() !== '') {
                    config.domainUrlSchemes[domain] = newScheme.trim();
                    if (saveConfig()) {
                        showNotification(`已更新 ${domain} 的URL Scheme`);
                        panel.remove();
                        showDomainSchemePanel();
                    }
                }
            });
        });
        // 删除域名Scheme
        panel.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                if (config.useGlobalScheme) {
                    showNotification('全局模式已开启，无法删除域名专用Scheme');
                    return;
                }

                const domain = this.getAttribute('data-domain');
                if (confirm(`确定要删除 ${domain} 的专用URL Scheme吗？`)) {
                    delete config.domainUrlSchemes[domain];
                    if (saveConfig()) {
                        showNotification(`已删除 ${domain} 的专用URL Scheme`);
                        panel.remove();
                        showDomainSchemePanel();
                    }
                }
            });
        });

        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
    }

    // ================================
    // 统一配置菜单
    // ================================

    function showConfigPanel() {
        const panel = createPanel('智能链接工具 - 配置', `
                        <div class="panel-content">
                            <div class="section-title">工具</div>
                            <div class="option-item" id="visual-search-setting">
                                <div class="option-icon">🔍</div>
                                <div class="option-info">
                                    <div class="option-title">可视化搜索</div>
                                    <div class="option-desc">选择页面文本进行搜索</div>
                                </div>
                            </div>


                            <div class="option-item" id="reading-list-setting">
                                <div class="option-icon">📖</div>
                                <div class="option-info">
                                    <div class="option-title">阅读列表</div>
                                    <div class="option-desc">管理稍后阅读的文章</div>
                                </div>
                            </div>

                            <div class="option-item" id="reading-list-settings">
                                <div class="option-icon">🗂️</div>
                                <div class="option-info">
                                    <div class="option-title">阅读列表设置</div>
                                    <div class="option-desc">分类管理、默认分类与添加行为</div>
                                </div>
                            </div>
                            <div class="option-item" id="element-hider-setting">
                            <div class="option-icon">🚫</div>
                            <div class="option-info">
                                <div class="option-title">元素隐藏工具</div>
                                <div class="option-desc">打开详细配置与操作菜单</div>
                            </div>
                        </div>

                            <div class="option-item" id="auto-scroll-setting">
                                <div class="option-icon">🌀</div>
                                <div class="option-info">
                                    <div class="option-title">自动滚动</div>
                                    <div class="option-desc">平滑滚动，支持速度和方向设置</div>
                                </div>
                            </div>

                            <div class="section-title">链接工具</div>

             <div class="option-item" id="batch-links-setting">
                <div class="option-icon">🖇️</div>
                <div class="option-info">
                    <div class="option-title">批量打开链接</div>
                    <div class="option-desc">鼠标框选页面上的多个链接并批量打开</div>
                </div>
            </div>

            <!-- 🆕 新增：批量粘贴链接选项 -->
            <div class="option-item" id="batch-paste-links-setting">
                <div class="option-icon">📝</div>
                <div class="option-info">
                    <div class="option-title">批量粘贴链接</div>
                    <div class="option-desc">粘贴多个链接列表并批量打开</div>
                </div>
            </div>

            <!-- 🆕 新增：批量工具入口（域名替换 / 关键词搜索） -->
            <div class="option-item" id="batch-tools-setting">
                <div class="option-icon">🧰</div>
                <div class="option-info">
                    <div class="option-title">批量工具</div>
                    <div class="option-desc">域名替换与关键词搜索</div>
                </div>
            </div>

                            <div class="option-item" id="clean-url-setting">
                                <div class="option-icon">🧹</div>
                                <div class="option-info">
                                    <div class="option-title">链接净化</div>
                                    <div class="option-desc">去除URL中的跟踪参数</div>
                                </div>
                            </div>

        <div class="section-title">显示设置</div>

                            <div class="option-item" id="display-mode-setting">
                                <div class="option-icon">🎨</div>
                                <div class="option-info">
                                    <div class="option-title">显示模式</div>
                                    <div class="option-desc">当前: ${config.displayMode === 'separate' ? '分离模式' : '组合模式'}</div>
                                </div>
                            </div>

                            <div class="option-item" id="button-control-setting">
                                <div class="option-icon">👁️</div>
                                <div class="option-info">
                                    <div class="option-title">按钮显示控制</div>
                                    <div class="option-desc">管理各个按钮的显示/隐藏</div>
                                </div>
                            </div>

                            <div class="option-item" id="interface-visibility-setting">
                                <div class="option-icon">🪟</div>
                                <div class="option-info">
                                    <div class="option-title">界面显示开关</div>
                                    <div class="option-desc">预览卡片与二维码面板的按钮显隐</div>
                                </div>
                            </div>

                            <div class="section-title">功能设置</div>
                    <div class="option-item" id="url-scheme-config">
            <div class="option-icon">🔗</div>
            <div class="option-info">
                <div class="option-title">URL Scheme配置</div>
                <div class="option-desc">${getCurrentSchemeInfo()}</div>
            </div>
        </div>

                            <div class="option-item" id="pattern-management-setting">
                                <div class="option-icon">🎯</div>
                                <div class="option-info">
                                    <div class="option-title">匹配模式管理</div>
                                    <div class="option-desc">管理各网站的链接匹配规则</div>
                                </div>
                            </div>
                            <div class="option-item" id="link-management-setting">
                <div class="option-icon">🔗</div>
                <div class="option-info">
                    <div class="option-title">管理配置链接</div>
                    <div class="option-desc">为搜索配置添加快捷网站链接</div>
                </div>
            </div>



                            <div class="option-item" id="search-engine-setting">
                                <div class="option-icon">🔍</div>
                                <div class="option-info">
                                    <div class="option-title">搜索引擎管理</div>
                                    <div class="option-desc">添加、编辑或删除搜索引擎</div>
                                </div>
                            </div>

                            <div class="option-item" id="url-clean-setting">
                                <div class="option-icon">🧹</div>
                                <div class="option-info">
                                    <div class="option-title">URL净化设置</div>
                                    <div class="option-desc">配置自动净化URL功能</div>
                                </div>
                            </div>

                            <div class="option-item" id="current-pattern-setting">
                                <div class="option-icon">⚙️</div>
                                <div class="option-info">
                                    <div class="option-title">设置当前网站模式</div>
                                    <div class="option-desc">为 ${currentDomain} 设置链接匹配规则</div>
                                </div>
                            </div>

                            <div class="option-item" id="hotkey-config-setting">
                                <div class="option-icon">⌨️</div>
                                <div class="option-info">
                                    <div class="option-title">快捷键配置</div>
                                    <div class="option-desc">为所有功能设置自定义快捷键</div>
                                </div>
                            </div>

                            <div class="option-item" id="custom-style-setting">
                                <div class="option-icon">🎨</div>
                                <div class="option-info">
                                    <div class="option-title">自定义样式</div>
                                    <div class="option-desc">自定义按钮和面板的外观样式</div>
                                </div>
                            </div>

                            <div class="option-item" id="reset-position-setting">
                                <div class="option-icon">🔄</div>
                                <div class="option-info">
                                    <div class="option-title">重置按钮位置</div>
                                    <div class="option-desc">将所有按钮重置到默认位置</div>
                                </div>
                            </div>
                            <!-- === 在这里添加数据管理部分 === -->
                        <div class="section-title">数据管理</div>
                        <div class="option-item" id="export-config-setting">
                            <div class="option-icon">📤</div>
                            <div class="option-info">
                                <div class="option-title">导出配置</div>
                                <div class="option-desc">备份所有设置到本地文件</div>
                            </div>
                        </div>

                        <div class="option-item" id="import-config-setting">
                            <div class="option-icon">📥</div>
                            <div class="option-info">
                                <div class="option-title">导入配置</div>
                                <div class="option-desc">从文件恢复设置</div>
                            </div>
                        </div>

                        <div class="option-item" id="reset-config-setting">
                            <div class="option-icon">🔄</div>
                            <div class="option-info">
                                <div class="option-title">重置为默认配置</div>
                                <div class="option-desc">清除所有自定义设置</div>
                        </div>
                        </div>

                    `);



        // 显示模式设置
        panel.querySelector('#display-mode-setting').addEventListener('click', function() {
            showDisplayModePanel();
        });

        // 按钮显示控制
        panel.querySelector('#button-control-setting').addEventListener('click', function() {
            showButtonControlPanel();
        });

        // 界面显示开关
        panel.querySelector('#interface-visibility-setting').addEventListener('click', function() {
            showInterfaceVisibilityPanel();
        });

        // 🆕 修改：合并为一个事件处理
        panel.querySelector('#url-scheme-config').addEventListener('click', function() {
            showUrlSchemeConfigPanel();
        });

        // 匹配模式管理
        panel.querySelector('#pattern-management-setting').addEventListener('click', function() {
            showPatternManagementPanel();
        });

        // 搜索引擎管理
        panel.querySelector('#search-engine-setting').addEventListener('click', function() {
            showSearchEngineManagementPanel();
        });

        // URL净化设置
        panel.querySelector('#url-clean-setting').addEventListener('click', function() {
            showUrlCleanConfigPanel();
        });

        //批量打开链接事件
        panel.querySelector('#batch-links-setting').addEventListener('click', function() {
            // 显示提示信息
            showNotification('配置面板将关闭，请使用鼠标框选要打开的链接');

            // 短暂延迟后关闭面板并启动框选
            setTimeout(() => {
                panel.remove();
                setTimeout(() => {
                    startRectangleSelection();
                }, 200);
            }, 800);
        });

        // 批量粘贴链接
        panel.querySelector('#batch-paste-links-setting').addEventListener('click', function() {
            showBatchLinksPanel();
        });

        // 🧰 批量工具
        panel.querySelector('#batch-tools-setting').addEventListener('click', function() {
            showBatchToolsPanel();
        });

        //链接管理入口
        panel.querySelector('#link-management-setting').addEventListener('click', function() {
            showSearchConfigManagementPanel(panel);
        });

        // 当前网站模式设置
        panel.querySelector('#current-pattern-setting').addEventListener('click', function() {
            const currentPattern = config.domainPatterns[currentDomain] || '';
            const newPattern = prompt(
                `为 ${currentDomain} 设置链接匹配模式:\n\n例如：/book/\\d+ 匹配 /book/123\n\n留空则使用当前页面URL：`,
                currentPattern
            );

            if (newPattern !== null) {
                if (newPattern.trim() === '') {
                    delete config.domainPatterns[currentDomain];
                    showNotification('已删除当前网站的链接模式');
                } else {
                    try {
                        new RegExp(newPattern);
                        config.domainPatterns[currentDomain] = newPattern.trim();
                        showNotification('链接模式已更新');
                    } catch (e) {
                        showNotification('正则表达式格式错误');
                        return;
                    }
                }
                saveConfig();
            }
        });

        // 可视化搜索
        panel.querySelector('#visual-search-setting').addEventListener('click', function() {
            showMultiSearchPanel();
        });

        // 阅读列表
        panel.querySelector('#reading-list-setting').addEventListener('click', function() {
            showReadingListPanel();
        });

        // 阅读列表设置
        panel.querySelector('#reading-list-settings').addEventListener('click', function() {
            showReadingListSettingsPanel();
        });

        // 链接净化
        panel.querySelector('#clean-url-setting').addEventListener('click', function() {
            handleCleanUrl();
        });

        // 快捷键配置
        panel.querySelector('#hotkey-config-setting').addEventListener('click', function() {
            showHotkeyConfigPanel();
        });
        panel.querySelector('#element-hider-setting').addEventListener('click', function() {
            panel.remove();
            showElementHiderConfigPanel();
        });
        panel.querySelector('#auto-scroll-setting').addEventListener('click', function() {
            showAutoScrollConfigPanel();
        });

        // 自定义样式配置
        panel.querySelector('#custom-style-setting').addEventListener('click', function() {
            showCustomStylePanel();
        });

        // 重置位置
        panel.querySelector('#reset-position-setting').addEventListener('click', function() {
            if (confirm('确定要重置所有按钮位置吗？')) {
                ['app-open-button',
                 'copy-link-button',
                 'visual-search-button',
                 'reading-list-button',
                 'clean-url-button',
                 'config-button',
                 'combined-button',
                 'input-search-button',
                 'batch-links-button',
                 'reading-list-panel-button',
                 'batch-paste-button',
                 'batch-tools-button',
                 'html2md-button',
                 'scroll-bottom-button',
                 'scroll-top-button',
                 'element-hider-button',
                 'auto-scroll-button',
                 'element-selector-button',
                 'github-upload-button'
                ].forEach(id => {
                    GM_setValue(`${id}_global_pos`, null);
                });
                removeAllButtons();
                initializeButtons();
                showNotification('按钮位置已重置');
            }
        });

        // 导出配置
        panel.querySelector('#export-config-setting').addEventListener('click', function() {
            exportConfig();
            panel.remove();
        });

        // 导入配置
        panel.querySelector('#import-config-setting').addEventListener('click', function() {
            importConfig();
            panel.remove();
        });

        // 重置配置
        panel.querySelector('#reset-config-setting').addEventListener('click', function() {
            resetToDefaultConfig();
            panel.remove();
        });


        addPanelButtons(panel, () => panel.remove());

        document.body.appendChild(panel);
    }

    function showElementHiderConfigPanel() {
        const panel = createPanel('元素隐藏工具', `
            <div class="panel-content">
                <div class="section-title">操作</div>
                <div class="option-item" id="eh-open-panel">
                    <div class="option-icon">🚫</div>
                    <div class="option-info">
                        <div class="option-title">打开面板</div>
                        <div class="option-desc">在右上角显示隐藏面板</div>
                    </div>
                </div>
                <div class="option-item" id="eh-pick">
                    <div class="option-icon">🖱️</div>
                    <div class="option-info">
                        <div class="option-title">选择元素隐藏</div>
                        <div class="option-desc">点击页面元素进行隐藏</div>
                    </div>
                </div>
                <div class="option-item" id="eh-manual">
                    <div class="option-icon">⌨️</div>
                    <div class="option-info">
                        <div class="option-title">手动输入选择器</div>
                        <div class="option-desc">直接输入 CSS 选择器</div>
                    </div>
                </div>
                <div class="section-title">规则管理</div>
                <div class="option-item" id="eh-manage">
                    <div class="option-icon">📋</div>
                    <div class="option-info">
                        <div class="option-title">管理当前域名规则</div>
                        <div class="option-desc">查看与编辑已保存的选择器</div>
                    </div>
                </div>
                <div class="option-item" id="eh-export">
                    <div class="option-icon">📤</div>
                    <div class="option-info">
                        <div class="option-title">导出配置</div>
                        <div class="option-desc">下载所有域名的规则配置</div>
                    </div>
                </div>
                <div class="option-item" id="eh-import">
                    <div class="option-icon">📥</div>
                    <div class="option-info">
                        <div class="option-title">导入配置</div>
                        <div class="option-desc">从 JSON 文本导入</div>
                    </div>
                </div>
            </div>
        `);
        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);

        panel.querySelector('#eh-open-panel').addEventListener('click', () => { panel.remove();ehTogglePanel(); });
        panel.querySelector('#eh-pick').addEventListener('click', () => { panel.remove(); ehStartPickMode(); });
        panel.querySelector('#eh-manual').addEventListener('click', () => { panel.remove();ehToggleModal('manual-input-modal', true);ehTogglePanel(); });
        panel.querySelector('#eh-export').addEventListener('click', () => { panel.remove();ehExportConfig(); });
        panel.querySelector('#eh-import').addEventListener('click', () => { panel.remove();ehToggleModal('import-modal', true); });
        panel.querySelector('#eh-manage').addEventListener('click', () => {
            panel.remove();
            ehShowConfigManager();
        });
    }

    function showAutoScrollConfigPanel() {
        const current = config.autoScroll || { enabled: false, speed: 300, direction: 'down', stopAtBoundary: true, pauseOnInteraction: true, iosSpeed: 300, iosChunkSize: 200, iosScrollMode: 'infinite', iosScrollTimes: 5 };
        const panel = createPanel('自动滚动设置', `
            <div class="panel-content">
                <div class="section-title">通用参数</div>
                <div class="option-item">
                    <div class="option-icon">⚡</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">速度</div>
                        <div class="option-desc">像素/秒（桌面端）</div>
                        <input type="number" id="as-speed" class="form-input" min="50" max="2000" step="10" value="${current.speed}">
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-icon">🧭</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">方向</div>
                        <select id="as-direction" class="form-select">
                            <option value="down" ${current.direction === 'down' ? 'selected' : ''}>向下</option>
                            <option value="up" ${current.direction === 'up' ? 'selected' : ''}>向上</option>
                        </select>
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-icon">🛑</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">边界停止</div>
                        <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="as-stop" ${current.stopAtBoundary ? 'checked' : ''}> 到顶/底时自动停止</label>
                    </div>
                </div>
                
                <div class="section-title">📱 iOS/移动端参数</div>
                <div class="option-item">
                    <div class="option-icon">🚀</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">iOS 滚动速度</div>
                        <div class="option-desc">像素/秒，建议 100-500</div>
                        <input type="number" id="as-ios-speed" class="form-input" min="50" max="1000" step="10" value="${current.iosSpeed || 300}">
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-icon">📏</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">每次滚动距离</div>
                        <div class="option-desc">像素，越大越流畅但可能跳跃，建议 100-400</div>
                        <input type="number" id="as-ios-chunk" class="form-input" min="50" max="800" step="10" value="${current.iosChunkSize || 200}">
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-icon">🔄</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">iOS 滚动模式</div>
                        <div class="option-desc">选择是否限制滚动次数</div>
                        <div style="display:flex;gap:8px;margin-top:8px;">
                            <button class="btn as-mode-btn" data-mode="infinite" style="${(current.iosScrollMode === 'infinite' || !current.iosScrollMode) ? 'background:linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4));color:white;box-shadow:0 4px 15px rgba(59, 130, 246, 0.05)' : 'background:#f0f0f0;color:#666;border:1px solid #e5e7eb'}">
                                ∞ 无限滚动
                            </button>
                            <button class="btn as-mode-btn" data-mode="times" style="${current.iosScrollMode === 'times' ? 'background:linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4));color:white;box-shadow:0 4px 15px rgba(59, 130, 246, 0.05)' : 'background:#f0f0f0;color:#666;border:1px solid #e5e7eb'}">
                                📊 限制次数
                            </button>
                        </div>
                        <input type="hidden" id="as-ios-mode" value="${current.iosScrollMode || 'infinite'}">
                    </div>
                </div>
                <div class="option-item" id="as-ios-times-container" style="display:${(current.iosScrollMode === 'times') ? 'flex' : 'none'}">
                    <div class="option-icon">📊</div>
                    <div class="option-info" style="width:100%">
                        <div class="option-title">滚动次数</div>
                        <div class="option-desc">达到指定次数后自动停止</div>
                        <input type="number" id="as-ios-times" class="form-input" min="1" max="1000" step="1" value="${current.iosScrollTimes || 5}">
                    </div>
                </div>
                
                <div class="btn-group" style="margin:12px 0;justify-content:center;">
                    <button class="btn btn-secondary" id="as-test-start">开始测试</button>
                </div>
            </div>
        `);

        addPanelButtons(panel, () => panel.remove(), () => {
            const speed = parseInt(panel.querySelector('#as-speed').value, 10) || 300;
            const direction = panel.querySelector('#as-direction').value === 'up' ? 'up' : 'down';
            const stopAtBoundary = !!panel.querySelector('#as-stop').checked;
            const iosSpeed = parseInt(panel.querySelector('#as-ios-speed').value, 10) || 300;
            const iosChunkSize = parseInt(panel.querySelector('#as-ios-chunk').value, 10) || 200;
            const iosScrollMode = panel.querySelector('#as-ios-mode').value || 'infinite';
            const iosScrollTimes = parseInt(panel.querySelector('#as-ios-times').value, 10) || 5;
            config.autoScroll = { enabled: true, speed, direction, stopAtBoundary, pauseOnInteraction: true, iosSpeed, iosChunkSize, iosScrollMode, iosScrollTimes };
            saveConfig();
            panel.remove();
        }, '保存');

        // 添加事件监听：按钮模式选择
        const modeButtons = panel.querySelectorAll('.as-mode-btn');
        const modeInput = panel.querySelector('#as-ios-mode');
        const timesContainer = panel.querySelector('#as-ios-times-container');
        
        modeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                modeInput.value = mode;
                
                // 更新按钮样式
                modeButtons.forEach(b => {
                    if (b.getAttribute('data-mode') === mode) {
                        b.style.background = 'linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4))';
                        b.style.color = 'white';
                        b.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.05)';
                        b.style.border = 'none';
                    } else {
                        b.style.background = '#f0f0f0';
                        b.style.color = '#666';
                        b.style.boxShadow = 'none';
                        b.style.border = '1px solid #e5e7eb';
                    }
                });
                
                // 显示/隐藏次数输入框
                timesContainer.style.display = mode === 'times' ? 'flex' : 'none';
            });
        });



        panel.querySelector('#as-test-start').addEventListener('click', function() {
            const speed = parseInt(panel.querySelector('#as-speed').value, 10) || 300;
            const direction = panel.querySelector('#as-direction').value === 'up' ? 'up' : 'down';
            const iosSpeed = parseInt(panel.querySelector('#as-ios-speed').value, 10) || 300;
            const iosChunkSize = parseInt(panel.querySelector('#as-ios-chunk').value, 10) || 200;
            config.autoScroll.speed = speed;
            config.autoScroll.direction = direction;
            config.autoScroll.iosSpeed = iosSpeed;
            config.autoScroll.iosChunkSize = iosChunkSize;
            panel.remove();
            document.querySelectorAll('.floating-panel .panel-title').forEach(t => {
                if (t.textContent && t.textContent.indexOf('智能链接工具 - 配置') !== -1) {
                    const p = t.closest('.floating-panel');
                    if (p) p.remove();
                }
            });
            startAutoScroll(true);
        });

        document.body.appendChild(panel);
    }
    // 🆕 新增：批量粘贴链接打开功能
    function showBatchLinksPanel() {
        const panel = createPanel('批量打开链接', `

        <div class="panel-content">
            <div style="background:#e3f2fd;padding:16px;border-radius:12px;margin-bottom:16px;border-left:4px solid #2196f3;">
                <div style="font-weight:600;color:#1976d2;margin-bottom:6px;">💡 使用说明</div>
                <div style="font-size:13px;color:#1565c0;line-height:1.5;">
                    • 每行一个链接，支持 http:// 和 https:// 开头的链接<br>
                    • 空行和无效链接会自动过滤<br>
                    • 链接将在后台标签页中打开
                </div>
            </div>

            <!-- 单列：链接列表整行放置 -->
            <div class="panel-card" style="margin-bottom:12px;">
                <div class="panel-card-title">🧾 链接列表 <span class="badge" id="bl-count-badge">0 条</span></div>
                <textarea id="batch-links-input" class="form-textarea" placeholder="请输入链接，每行一个" style="min-height:220px;font-family:monospace;font-size:13px;"></textarea>
                <div class="toolbar btn-group equal">
                  <button class="btn btn-primary icon" id="btn-paste-links">📋 粘贴剪贴板</button>
                  <button class="btn icon" id="btn-clear-links">🗑️ 清空列表</button>
                  <button class="btn icon" id="btn-validate-links">🔍 验证链接</button>
                </div>
                <div class="links-preview" id="links-preview" style="max-height:240px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <span style="font-weight:600;">链接预览</span>
                      <span class="badge" id="bl-valid-badge">有效 0</span>
                      <span class="badge" id="bl-invalid-badge">无效 0</span>
                    </div>
                    <div id="preview-content"></div>
                </div>
            </div>

            <!-- 单列：功能卡片逐块排列 -->
            <div class="panel-card" style="margin-bottom:12px;">
              <div class="panel-card-title">🧹 去重与过滤</div>
              <div class="form-row">
                <input id="bl-include" class="form-input" placeholder="包含关键词或 /正则/">
                <input id="bl-exclude" class="form-input" placeholder="排除关键词或 /正则/">
              </div>
              <div class="btn-group equal">
                <button class="btn btn-secondary" id="bl-apply-filter">应用过滤</button>
                <button class="btn btn-secondary" id="bl-normalize-dedup">规范化+去重</button>
              </div>
            </div>

            <div class="panel-card" style="margin-bottom:12px;">
              <div class="panel-card-title">📦 域名分桶</div>
              <div class="btn-group equal" style="margin-bottom:8px;">
                <button class="btn btn-secondary" id="bl-bucket">统计域名分布</button>
                <button class="btn btn-secondary" id="bl-copy-bucket">复制分桶结果</button>
              </div>
              <div id="bl-bucket-content" class="mono" style="font-size:12px;max-height:140px;overflow:auto;white-space:pre;"></div>
            </div>

            <div class="panel-card" style="margin-bottom:12px;">
              <div class="panel-card-title">🐢 速率控制打开</div>
              <div class="form-row">
                <label class="muted" style="display:flex;align-items:center;gap:6px;width:-webkit-fill-available"><input id="bl-rate" class="form-input input-small" placeholder="请输入链接，每行一个" type="number" min="1" value="${config.batchOpenRate}"> <button class="btn btn-primary" id="bl-open-rate" style="width:40%">按速率打开</button></label>
              </div>
            </div>

            <div class="panel-card" style="margin-bottom:12px;">
              <div class="panel-card-title">📝 标题抓取与导出 <span class="badge">CSV</span></div>
              <div class="btn-group equal" style="margin-bottom:8px;">
                <button class="btn btn-primary" id="bl-export-csv">抓取标题导出 CSV</button>
              </div>
              <div id="bl-progress" class="muted" style="font-size:12px;min-height:18px;"></div>
            </div>

            <div style="background:#fff3cd;padding:12px;border-radius:8px;margin-top:4px;border-left:4px solid #ffc107;">
                <div style="font-weight:600;color:#856404;margin-bottom:4px;">⚠️ 注意</div>
                <div style="font-size:13px;color:#856404;">大量链接可能会影响浏览器性能，建议一次不要超过20个链接</div>
            </div>
        </div>
    `);

        const linksInput = panel.querySelector('#batch-links-input');
        const previewContainer = panel.querySelector('#links-preview');
        const previewContent = panel.querySelector('#preview-content');

        // 🆕 更新预览显示
        function updatePreview() {
            const linksText = linksInput.value.trim();
            if (!linksText) {
                previewContainer.style.display = 'none';
                return;
            }

            const links = parseLinksFromText(linksText);
            const validLinks = links.valid;
            const invalidLinks = links.invalid;

            if (validLinks.length === 0 && invalidLinks.length === 0) {
                previewContainer.style.display = 'none';
                return;
            }

            // 统计徽章
            const countBadge = panel.querySelector('#bl-count-badge');
            const validBadge = panel.querySelector('#bl-valid-badge');
            const invalidBadge = panel.querySelector('#bl-invalid-badge');
            if (countBadge) countBadge.textContent = `${validLinks.length} 条`;
            if (validBadge) validBadge.textContent = `有效 ${validLinks.length}`;
            if (invalidBadge) invalidBadge.textContent = `无效 ${invalidLinks.length}`;

            // 单行列表展示
            let previewHTML = '';
            if (validLinks.length > 0) {
                previewHTML += `<div class="mono" style="color:#28a745;margin-bottom:6px;">✅ 有效链接（${validLinks.length}）</div>`;
                previewHTML += `<div style="border:1px dashed #e5e7eb;border-radius:6px;padding:8px;max-height:180px;overflow:auto;">
                    ${validLinks.map(link => {
                    const display = link.length > 120 ? (link.slice(0, 117) + '...') : link;
                    return `<div class=\"link-row\" style=\"font-size:12px;line-height:1.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\">${display}</div>`;
                }).join('')}
                </div>`;
            }
            if (invalidLinks.length > 0) {
                previewHTML += `<div class="mono" style="color:#dc3545;margin:10px 0 6px;">❌ 无效链接（${invalidLinks.length}）</div>`;
                previewHTML += `<div style="border:1px dashed #f1b0b7;border-radius:6px;padding:8px;max-height:120px;overflow:auto;">
                    ${invalidLinks.map(link => `<div class=\"link-row\" style=\"font-size:12px;color:#6b7280;line-height:1.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\">${link}</div>`).join('')}
                </div>`;
            }

            previewContent.innerHTML = previewHTML;
            previewContainer.style.display = 'block';
        }

        // 🆕 解析链接文本
        function parseLinksFromText(text) {
            const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

            const validLinks = [];
            const invalidLinks = [];

            lines.forEach(line => {
                // 简单的URL验证
                if (line.startsWith('http://') || line.startsWith('https://')) {
                    // 移除可能的多余字符
                    const cleanLink = line.replace(/[<>"']/g, '');
                    if (cleanLink.length > 10) { // 基本长度检查
                        validLinks.push(cleanLink);
                        return;
                    }
                }

                // 如果没有协议头，尝试添加https://
                if (line.includes('.') && line.length > 4) {
                    const withHttps = 'https://' + line.replace(/^https?:\/\//, '');
                    validLinks.push(withHttps);
                } else {
                    invalidLinks.push(line);
                }
            });

            return { valid: [...new Set(validLinks)], invalid: invalidLinks };
        }

        // 🆕 粘贴剪贴板内容
        panel.querySelector('#btn-paste-links').addEventListener('click', async function() {
            try {
                const text = await navigator.clipboard.readText();
                if (text && text.trim()) {
                    linksInput.value = text.trim();
                    updatePreview();
                    showNotification('已粘贴剪贴板内容');
                } else {
                    showNotification('剪贴板为空或不是文本内容');
                }
            } catch (err) {
                console.error('读取剪贴板失败:', err);
                showNotification('无法读取剪贴板，请手动粘贴');
            }
        });

        // 🆕 清空列表
        panel.querySelector('#btn-clear-links').addEventListener('click', function() {
            linksInput.value = '';
            updatePreview();
            showNotification('已清空链接列表');
        });

        // 🆕 验证链接
        panel.querySelector('#btn-validate-links').addEventListener('click', function() {
            const linksText = linksInput.value.trim();
            if (!linksText) {
                showNotification('请输入链接列表');
                return;
            }

            const links = parseLinksFromText(linksText);
            const message = `验证结果:\n有效链接: ${links.valid.length} 个\n无效链接: ${links.invalid.length} 个`;

            if (links.invalid.length > 0) {
                showNotification(message + '\n请检查无效链接');
            } else {
                showNotification(message);
            }

            updatePreview();
        });

        // 输入时实时更新预览
        linksInput.addEventListener('input', updatePreview);

        // 添加打开按钮
        addPanelButtons(panel,
                        () => panel.remove(),
                        () => {
            const linksText = linksInput.value.trim();
            if (!linksText) {
                showNotification('请输入链接列表');
                return;
            }

            const links = parseLinksFromText(linksText);
            if (links.valid.length === 0) {
                showNotification('没有找到有效的链接');
                return;
            }

            if (links.valid.length > 50) {
                const shouldContinue = confirm(`找到 ${links.valid.length} 个有效链接，数量较多可能会影响浏览器性能。确定要继续打开吗？`);
                if (!shouldContinue) return;
            }

            openMultipleLinksFromList(links.valid);
            panel.remove();
        },
                        `打开链接`
                       );

        document.body.appendChild(panel);
        // ====== 扩展能力：去重、过滤、分桶、速率、导出CSV ======
        const incInput = panel.querySelector('#bl-include');
        const excInput = panel.querySelector('#bl-exclude');
        const bucketBox = panel.querySelector('#bl-bucket-content');
        const rateInput = panel.querySelector('#bl-rate');
        const progress = panel.querySelector('#bl-progress');

        function toRegexOrSubstr(s) {
            const t = (s||'').trim(); if (!t) return null;
            if (t.startsWith('/') && t.endsWith('/')) {
                try { return new RegExp(t.slice(1,-1), 'i'); } catch(_) { return null; }
            }
            return t.toLowerCase();
        }

        function matchBy(matcher, text) {
            if (!matcher) return true;
            const s = (text||'').toLowerCase();
            return matcher instanceof RegExp ? matcher.test(text||'') : s.includes(matcher);
        }

        function canonicalizeUrl(u) {
            try {
                const unwrapped = unwrapRedirectUrl(u);
                const url = new URL(unwrapped);
                // 追踪参数清理
                (config.urlTrackingParams||[]).forEach(k => url.searchParams.delete(k));
                url.hostname = url.hostname.toLowerCase();
                if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) {
                    url.port = '';
                }
                // 去掉路径末尾斜杠（非根）
                if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
                    url.pathname = url.pathname.replace(/\/+$/,'');
                }
                return url.toString();
            } catch(_) { return u; }
        }

        function getWorkingListNormalized() {
            const linksText = linksInput.value.trim();
            const parsed = parseLinksFromText(linksText);
            return parsed.valid.map(canonicalizeUrl);
        }

        panel.querySelector('#bl-apply-filter').addEventListener('click', () => {
            const includeM = toRegexOrSubstr(incInput.value);
            const excludeM = toRegexOrSubstr(excInput.value);
            const list = getWorkingListNormalized().filter(u => matchBy(includeM, u) && !matchBy(excludeM, u));
            linksInput.value = list.join('\n');
            updatePreview();
            showNotification(`已应用过滤，剩余 ${list.length} 条`);
        });

        panel.querySelector('#bl-normalize-dedup').addEventListener('click', () => {
            const list = Array.from(new Set(getWorkingListNormalized()));
            linksInput.value = list.join('\n');
            updatePreview();
            showNotification(`已规范化并去重，共 ${list.length} 条`);
        });

        panel.querySelector('#bl-bucket').addEventListener('click', () => {
            const list = getWorkingListNormalized();
            const map = new Map();
            list.forEach(u => { try { const h = new URL(u).hostname; map.set(h, (map.get(h)||0)+1); } catch(_){} });
            const arr = Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
            const text = arr.map(([h,c])=> `${h}\t${c}`).join('\n');
            bucketBox.textContent = text || '（无数据）';
        });

        panel.querySelector('#bl-copy-bucket').addEventListener('click', () => {
            const text = bucketBox.textContent || '';
            if (!text.trim()) { showNotification('没有可复制的分桶结果'); return; }
            copyText(text); showNotification('已复制分桶结果');
        });

        panel.querySelector('#bl-open-rate').addEventListener('click', () => {
            const list = getWorkingListNormalized();
            if (list.length === 0) { showNotification('没有可打开的链接'); return; }
            const rate = Math.max(1, parseInt(rateInput.value||`${config.batchOpenRate||5}`,10)||5);
            // 保存速率到配置
            config.batchOpenRate = rate; saveConfig();
            openLinksRateLimited(list, rate);
            showNotification(`按速率打开中，每秒 ${rate} 个，共 ${list.length} 条`);
        });

        panel.querySelector('#bl-export-csv').addEventListener('click', async () => {
            const list = getWorkingListNormalized();
            if (list.length === 0) { showNotification('没有可导出的链接'); return; }
            progress.textContent = '开始抓取标题...';
            const rows = [['title','url','domain','status']];
            let done = 0; const total = list.length; const maxConcurrent = 4; let idx = 0; let active = 0;

            function escapeCsv(s){
                const t = (s||'').replace(/"/g,'""');
                return '"'+t+'"';
            }
            function extractTitle(html){
                const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
                return m ? m[1].replace(/\s+/g,' ').trim() : '';
            }
            function gmFetchText(u){
                return new Promise((resolve) => {
                    try { GM_xmlhttpRequest({ url: u, method:'GET', timeout: 15000,
                                             onload: (r) => resolve({ status: r.status||0, text: r.responseText||'', finalUrl: r.finalUrl||u }),
                                             onerror: () => resolve({ status: 0, text:'', finalUrl: u })
                                            }); } catch(_) { resolve({ status: 0, text:'', finalUrl: u }); }
                });
            }

            async function worker(){
                while(true){
                    let myIndex; if (idx >= total) break; myIndex = idx++;
                    const u = list[myIndex];
                    const r = await gmFetchText(u);
                    const title = extractTitle(r.text);
                    let host = ''; try{ host = new URL(r.finalUrl||u).hostname; }catch(_){ }
                    rows.push([title||'', u, host||'', String(r.status||'')]);
                    done++; progress.textContent = `抓取中 ${done}/${total}`;
                }
            }
            active = maxConcurrent; const workers = []; for (let i=0;i<maxConcurrent;i++){ workers.push(worker()); }
            await Promise.all(workers);
            progress.textContent = '准备导出...';
            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'links.csv';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
            progress.textContent = `已导出 ${total} 条`;
        });
    }

    // 🆕 新增：从列表打开多个链接
    function openMultipleLinksFromList(links) {
        if (links.length === 0) return;

        let openedCount = 0;
        const totalLinks = links.length;

        showNotification(`开始打开 ${totalLinks} 个链接（同时打开）...`);

        // 同步快速打开所有链接，避免逐个延迟
        for (const link of links) {
            try {
                GM_openInTab(link, {
                    active: false,
                    insert: true,
                    setParent: true
                });
                openedCount++;
            } catch (err) {
                console.error(`打开链接失败: ${link}`, err);
            }
        }

        // 汇总提示
        setTimeout(() => {
            showNotification(`✅ 已完成！成功打开 ${openedCount}/${totalLinks} 个链接`);
        }, 300);
    }

    // 🆕 新增：按速率打开链接（每秒 N 个）
    function openLinksRateLimited(links, perSecond) {
        if (!Array.isArray(links) || links.length === 0) return;
        const queue = links.slice();
        const total = queue.length;
        let opened = 0;
        const intervalMs = Math.max(50, Math.round(1000 / Math.max(1, perSecond || 5)));

        showNotification(`开始按速率打开 ${total} 个链接（约每 ${intervalMs}ms 1 个）`);

        const timer = setInterval(() => {
            const next = queue.shift();
            if (!next) {
                clearInterval(timer);
                showNotification(`✅ 已完成！成功打开 ${opened}/${total} 个链接`);
                return;
            }
            try {
                GM_openInTab(next, { active: false, insert: true, setParent: true });
                opened++;
            } catch (err) {
                console.error('按速率打开失败:', next, err);
            }
        }, intervalMs);
    }

    // ================================
    // 新功能：批量工具（域名替换 + 关键词搜索）
    // ================================

    function createBatchToolsButton() {
        const button = document.createElement('div');
        button.id = 'batch-tools-button';
        button.innerHTML = '🧰';
        button.title = '批量工具（域名替换/关键词搜索）';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['batch-tools-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['batch-tools-button']) {
            buttonPositions['batch-tools-button'] = { defaultRight: 20, defaultBottom: 280 };
        }

        initButtonPosition(button, 'batch-tools-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            showBatchToolsPanel();
        };

        return button;
    }

    function showBatchToolsPanel() {
        const engines = Object.keys(config.searchEngines).map(key => ({ key, ...config.searchEngines[key] }));
        const engineOptions = engines.map(e => `<option value="${e.key}" ${config.defaultSearchEngine === e.key ? 'selected' : ''}>${e.name}</option>`).join('');

        const panel = createPanel('批量工具（域名替换 / 关键词搜索）', `
            <div class="panel-content">
                <div class="panel-grid">
                    <div class="panel-col">
                        <div class="section-title">🔄 域名替换</div>
                        <div class="input-group">
                            <textarea id="bt-links" class="form-textarea mono tall" placeholder="输入多行链接，每行一个"></textarea>
                        </div>
                        <div class="btn-group">
                            <input id="bt-from" class="form-input" placeholder="源域名（可留空表示全部，例如 old.com）">
                            <span class="muted">→</span>
                            <input id="bt-to" class="form-input" placeholder="目标域名（例如 new.com）">
                        </div>
                        <div class="btn-group">
                            <label><input type="checkbox" id="bt-keep-protocol" checked> 保留原协议(http/https)</label>
                            <label><input type="checkbox" id="bt-keep-path" checked> 仅替换域名，保留路径/参数</label>
                        </div>
                        <div class="btn-group equal">
                            <button class="btn btn-primary" id="bt-preview">预览</button>
                            <button class="btn btn-secondary" id="bt-replace-copy">替换并复制</button>
                            <button class="btn btn-cancel" id="bt-clear">清空</button>
                        </div>
                        <div id="bt-result" class="links-preview"></div>
                    </div>
                    <div class="panel-col">
                        <div class="section-title">🔍 关键词搜索</div>
                        <div class="input-group">
                            <textarea id="bt-kw" class="form-textarea mono tall" placeholder="输入多行关键词，每行一个"></textarea>
                        </div>
                        <div class="btn-group">
                            <select id="bt-engine" class="form-input">${engineOptions}</select>
                            <input id="bt-delay" class="form-input input-small" type="number" min="0" value="120" placeholder="间隔(ms)">
                        </div>
                        <div class="btn-group equal">
                            <button class="btn btn-primary" id="bt-open">打开搜索</button>
                            <button class="btn btn-cancel" id="bt-copy-queries">复制查询URL</button>
                        </div>
                        <div class="hint" style="margin-top:8px;">提示：一次打开过多窗口可能被浏览器拦截，建议控制数量或增大间隔。</div>
                    </div>
                </div>
            </div>
        `);

        document.body.appendChild(panel);

        const $ = (sel) => panel.querySelector(sel);
        const linksInput = $('#bt-links');
        const fromInput = $('#bt-from');
        const toInput = $('#bt-to');
        const keepProtocol = $('#bt-keep-protocol');
        const keepPath = $('#bt-keep-path');
        const resultBox = $('#bt-result');
        const kwInput = $('#bt-kw');
        const engineSel = $('#bt-engine');
        const delayInput = $('#bt-delay');

        function parseLines(text) {
            return text.split('\n').map(s => s.trim()).filter(Boolean);
        }

        function normalizeUrlMaybe(url) {
            if (/^https?:\/\//i.test(url)) return url;
            if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(url)) {
                return 'https://' + url.replace(/^https?:\/\//i, '');
            }
            return url;
        }

        function replaceDomainInList(lines, from, to, opts) {
            const out = [];
            const errors = [];
            lines.forEach(line => {
                let u = normalizeUrlMaybe(line);
                try {
                    const urlObj = new URL(u);
                    const host = urlObj.hostname;
                    let shouldReplace = true;
                    if (from && from.trim()) {
                        const f = from.trim().toLowerCase();
                        shouldReplace = host.toLowerCase() === f || host.toLowerCase().endsWith('.' + f);
                    }
                    if (shouldReplace) {
                        urlObj.hostname = to.trim();
                    }
                    if (!opts.keepProtocol) {
                        urlObj.protocol = 'https:';
                    }
                    const finalUrl = opts.keepPath ? urlObj.toString() : `${urlObj.protocol}//${urlObj.hostname}`;
                    out.push(finalUrl);
                } catch (e) {
                    errors.push(line);
                }
            });
            return { out, errors };
        }

        function updatePreview() {
            const lines = parseLines(linksInput.value);
            if (lines.length === 0) { resultBox.style.display = 'none'; return; }
            const { out } = replaceDomainInList(lines, fromInput.value, toInput.value, { keepProtocol: keepProtocol.checked, keepPath: keepPath.checked });
            resultBox.innerHTML = out
                .slice(0, 20)
                .map(x => `<div class="mono">${x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>`)
                .join('')
                + (out.length>20?`<div class="muted">... 还有 ${out.length-20} 条</div>`:'');
            resultBox.style.display = 'block';
        }

        $('#bt-preview').addEventListener('click', updatePreview);
        $('#bt-clear').addEventListener('click', () => { linksInput.value=''; resultBox.style.display='none'; });
        $('#bt-replace-copy').addEventListener('click', () => {
            const lines = parseLines(linksInput.value);
            if (!toInput.value.trim()) { showNotification('请输入目标域名'); return; }
            if (lines.length === 0) { showNotification('请输入链接列表'); return; }
            const { out } = replaceDomainInList(lines, fromInput.value, toInput.value, { keepProtocol: keepProtocol.checked, keepPath: keepPath.checked });
            const text = out.join('\n');
            copyText(text);
            showNotification(`已复制 ${out.length} 条替换结果`);
        });

        function buildSearchUrl(engineKey, text) {
            const engine = config.searchEngines[engineKey];
            if (!engine) return '';
            const url = (engine.webUrl || engine.appUrl || '').replace('{key}', encodeURIComponent(text));
            return url;
        }

        $('#bt-open').addEventListener('click', () => {
            const kws = parseLines(kwInput.value);
            if (kws.length === 0) { showNotification('请输入关键词'); return; }
            const engineKey = engineSel.value;

            // 批量同时打开所有搜索链接，在当前标签页后台打开
            kws.forEach(keyword => {
                const url = buildSearchUrl(engineKey, keyword);
                if (url) {
                    GM_openInTab(url, {
                        active: false,
                        insert: true,
                        inBackground: true
                    });
                }
            });

            showNotification(`已触发 ${kws.length} 个搜索`);
        });

        $('#bt-copy-queries').addEventListener('click', () => {
            const kws = parseLines(kwInput.value);
            if (kws.length === 0) { showNotification('请输入关键词'); return; }
            const engineKey = engineSel.value;
            const urls = kws.map(k => buildSearchUrl(engineKey, k)).filter(Boolean);
            copyText(urls.join('\n'));
            showNotification(`已复制 ${urls.length} 条查询链接`);
        });

        // 页脚按钮：关闭
        addPanelButtons(panel, () => panel.remove());
    }

    // ================================
    // 面板工具函数
    // ================================

    function createPanel(title, content) {
        const panel = document.createElement('div');
        panel.className = 'floating-panel';
        panel.innerHTML = `
                        <div class="panel-container">
                            <div class="panel-header">
                                <h3 class="panel-title">${title}</h3>
                                <button class="close-btn">&times;</button>
                            </div>
                            ${content}
                        </div>
                    `;

        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.remove();
        });

        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });

        return panel;
    }

    function addPanelButtons(panel, onCancel, onSave = null, saveText = '保存') {
        const footer = document.createElement('div');
        footer.className = 'panel-footer';

        if (onSave) {
            footer.innerHTML = `
                            <button class="btn btn-cancel">取消</button>
                            <button class="btn btn-success">${saveText}</button>
                        `;
            footer.querySelector('.btn-cancel').addEventListener('click', onCancel);
            footer.querySelector('.btn-success').addEventListener('click', onSave);
        } else {
            footer.innerHTML = `<button class="btn btn-primary" style="width: 100%">关闭</button>`;
            footer.querySelector('.btn').addEventListener('click', onCancel);
        }

        panel.querySelector('.panel-container').appendChild(footer);
    }

    // ================================
    // 拖动功能
    // ================================

    function setupDragHandlers(button) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let hasMoved = false; // 🆕 修复：追踪是否真正发生过移动

        function startDrag(e) {
            isDragging = true;
            hasMoved = false; // 重置移动标记
            // 🆕 修复：标记正在拖动状态，防止点击事件误触发
            button.dataset.dragging = 'true';
            const rect = button.getBoundingClientRect();
            startLeft = parseInt(button.style.left) || rect.left;
            startTop = parseInt(button.style.top) || rect.top;
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;

            button.style.transform = 'scale(1.1)';
            button.style.transition = 'none';
            e.preventDefault();
        }

        function handleDrag(e) {
            if (!isDragging) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            // 🆕 修复：只要移动距离超过阈值，就标记为已移动
            const moveDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            if (moveDistance > 2) {
                hasMoved = true;
            }

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            newLeft = Math.max(5, Math.min(newLeft, viewportWidth - config.buttonSize - 5));
            newTop = Math.max(5, Math.min(newTop, viewportHeight - config.buttonSize - 5));

            button.style.left = newLeft + 'px';
            button.style.top = newTop + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';

            e.preventDefault();
        }

        function endDrag(e) {
            if (!isDragging) return;
            isDragging = false;
            // 🆕 修复：根据实际移动情况设置标记
            button.dataset.dragging = hasMoved ? 'true' : 'false';
            // 延迟清除标记，确保点击事件能读到
            setTimeout(() => {
                button.dataset.dragging = 'false';
            }, 0);

            button.style.transform = 'scale(1)';
            button.style.transition = 'all 0.15s ease';

            const finalLeft = parseInt(button.style.left);
            const finalTop = parseInt(button.style.top);

            if (!isNaN(finalLeft) && !isNaN(finalTop)) {
                saveButtonPosition(button.id, finalLeft, finalTop);
            }

            const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
            const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
            const moveDistance = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2));

            // 🆕 修复：只有距离足够小时才认为是点击（避免拖动时误触发）
            if (moveDistance < 5 && typeof button.clickHandler === 'function') {
                button.clickHandler();
            }

            e.preventDefault();
        }

        button.addEventListener('mousedown', startDrag);
        button.addEventListener('touchstart', startDrag);
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('touchmove', handleDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        // 🆕 修复：阻止点击事件在拖动时触发
        button.addEventListener('click', (e) => {
            if (button.dataset.dragging === 'true') {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true); // 使用捕获阶段，确保在其他监听器之前执行
    }

    // ================================
    // 组合模式按钮
    // ================================

    function createCombinedButton() {
        const button = document.createElement('div');
        button.id = 'combined-button';
        button.innerHTML = '⋯';
        button.title = '工具菜单';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99999',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.7) + 'px',
            fontWeight: 'bold',
            color: '#666'
        });

        initButtonPosition(button, 'combined-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            showExpandedButtonGroup(x, y);
        };

        return button;
    }

    // ================================
    // 分离模式按钮
    // ================================

    function createAppOpenButton() {
        const button = document.createElement('div');
        const schemeInfo = getCurrentSchemeInfo();
        const currentScheme = getUrlSchemeForDomain();
        button.title = `用App打开链接 - ${schemeInfo}${currentScheme ? `（${currentScheme}）` : ''}`;

        button.id = 'app-open-button';
        button.innerHTML = '';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99999',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['app-open-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'app-open-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            const targetUrl = extractTargetUrl();
            if (targetUrl) {
                const scheme = getUrlSchemeForDomain();
                if (!scheme) {
                    showNotification('未配置可用的URL Scheme');
                    return;
                }
                const teakUrl = `${scheme}${targetUrl}`;


                button.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    button.style.background = 'white';
                    button.style.transform = 'scale(1)';
                }, 100);

                try {
                    window.location.href = teakUrl;
                } catch (err) {
                    console.error('打开App失败:', err);
                }
            }
        };

        return button;
    }

    function createCopyButton() {
        const button = document.createElement('div');
        button.id = 'copy-link-button';
        button.innerHTML = '🔗';
        button.title = '复制当前链接';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99998',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['copy-link-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'copy-link-button');
        setupDragHandlers(button);

        button.clickHandler = async function() {
            const url = window.location.href;


            button.style.transform = 'scale(1.1)';

            const success = await copyToClipboard(url);

            setTimeout(() => {
                button.style.background = 'white';
                button.style.transform = 'scale(1)';
            }, 100);
        };

        return button;
    }

    function createConfigButton() {
        const button = document.createElement('div');
        button.id = 'config-button';
        button.innerHTML = '⚙️';
        button.title = '配置菜单';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99997',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['config-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'config-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            showConfigPanel();
        };

        return button;
    }

    // 🆕 页面滚动独立按钮（分离模式可用）
    function createScrollTopButton() {
        const button = document.createElement('div');
        button.id = 'scroll-top-button';
        button.innerHTML = '⬆︎';
        button.title = '回到顶部';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99992',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4))',
            color:'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['scroll-top-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'scroll-top-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            try { scrollPageTop(); } catch (_) { window.scrollTo(0, 0); }
        };

        return button;
    }

    function createScrollBottomButton() {
        const button = document.createElement('div');
        button.id = 'scroll-bottom-button';
        button.innerHTML = '⬇︎';
        button.title = '滚动到底部';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99991',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4))',
            color:'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['scroll-bottom-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'scroll-bottom-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            try { scrollPageBottom(); } catch (_) { window.scrollTo(0, 1e9); }
        };

        return button;
    }

    // 🚀 优化版：自动滚动核心逻辑
    let autoScrollRAF = null;
    let autoScrollLastTs = 0;
    let autoScrollContext = null;
    let autoScrollAccumulator = 0;
    let autoScrollMaxScroll = 0;

    // 🆕 iOS 超级优化：使用 CSS smooth scroll + 模拟触摸惯性滚动
    let autoScrollCSSMode = false;
    let autoScrollCheckInterval = null;
    let autoScrollLastPosition = 0; // 记录上一次滚动位置，用于检测是否真的到底
    let autoScrollStuckCount = 0; // 记录连续无法滚动到底的次数
    let autoScrollIOSScrollCount = 0; // iOS 滚动次数计数器
    let autoScrollIOSScrollMode = 'infinite'; // iOS 滚动模式：'infinite' 或 'times'
    let autoScrollIOSScrollTimes = 5; // iOS 滚动次数限制

    let autoScrollReturnToConfigAfterStop = false;

    function startAutoScroll(returnToConfig = false) {
        if (autoScrollRAF) return;

        autoScrollReturnToConfigAfterStop = !!returnToConfig;

        autoScrollContext = createScrollContext();
        if (!autoScrollContext || !autoScrollContext.target) {
            showNotification('无法找到可滚动的区域');
            return;
        }

        const dir = (config.autoScroll && config.autoScroll.direction) === 'up' ? -1 : 1;
        const speed = Number(config.autoScroll && config.autoScroll.speed) || 300;
        const stopAtBoundary = !config.autoScroll || config.autoScroll.stopAtBoundary !== false;
        autoScrollMaxScroll = Math.max(0, autoScrollContext.getHeight() - autoScrollContext.getClient());
        autoScrollLastPosition = autoScrollContext.getTop(); // 初始化位置记录
        autoScrollStuckCount = 0; // 初始化计数器

        // 检测是否为移动设备（仅 iOS 和 Android 移动端）
        const isMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                         (/Android/i.test(navigator.userAgent) && /Mobile/i.test(navigator.userAgent));
        
        if (isMobile) {
            // 🆕 iOS 优化：使用用户配置的速度和滚动距离
            autoScrollCSSMode = true;
            
            // 读取 iOS 专用配置
            const iosSpeed = Number(config.autoScroll && config.autoScroll.iosSpeed) || 300;
            const iosChunkSize = Number(config.autoScroll && config.autoScroll.iosChunkSize) || 200;
            autoScrollIOSScrollMode = (config.autoScroll && config.autoScroll.iosScrollMode) || 'infinite';
            autoScrollIOSScrollTimes = Number(config.autoScroll && config.autoScroll.iosScrollTimes) || 5;
            autoScrollIOSScrollCount = 0; // 初始化滚动次数计数
            
            // 计算每次滚动的间隔时间
            const chunkDuration = (iosChunkSize / iosSpeed) * 1000;
            
            function smoothChunk() {
                if (!autoScrollCSSMode || !autoScrollContext) return;
                
                const current = autoScrollContext.getTop();
                
                if (stopAtBoundary) {
                    // 🆕 修复：动态计算最大滚动值，支持滚动加载的网站
                    const currentMaxScroll = Math.max(0, autoScrollContext.getHeight() - autoScrollContext.getClient());
                    // 如果页面高度增加了，更新最大滚动值并重置计数器
                    if (currentMaxScroll > autoScrollMaxScroll) {
                        autoScrollMaxScroll = currentMaxScroll;
                        autoScrollStuckCount = 0; // 页面高度增加，重置计数器
                    }
                    
                    if (dir > 0) {
                        // 检测是否真的到底部
                        const distanceToBottom = currentMaxScroll - current;
                        
                        // 如果滚动位置几乎没有变化（说明可能卡住了），增加计数器
                        if (Math.abs(current - autoScrollLastPosition) < 5) {
                            autoScrollStuckCount++;
                        } else {
                            autoScrollStuckCount = 0; // 位置有变化，重置计数器
                        }
                        
                        // 如果距离底部很近（小于一个滚动块大小），且连续几次位置都没变化，说明真的到底了
                        // 或者距离底部非常近（小于10px）
                        if (distanceToBottom <= 10 || (distanceToBottom <= iosChunkSize && autoScrollStuckCount >= 3)) {
                            stopAutoScroll(autoScrollReturnToConfigAfterStop);
                            showNotification('已滚动到底部');
                            autoScrollStuckCount = 0;
                            return;
                        }
                    } else {
                        // 向上滚动
                        if (current <= 5) {
                            stopAutoScroll(autoScrollReturnToConfigAfterStop);
                            showNotification('已滚动到顶部');
                            autoScrollStuckCount = 0;
                            return;
                        }
                    }
                }
                
                // 🆕 新增：检查滚动次数限制
                if (autoScrollIOSScrollMode === 'times' && autoScrollIOSScrollCount >= autoScrollIOSScrollTimes) {
                    stopAutoScroll(autoScrollReturnToConfigAfterStop);
                    return;
                }
                
                // 记录当前滚动位置
                autoScrollLastPosition = current;
                
                const target = current + iosChunkSize * dir;
                if (autoScrollContext.isWindow) {
                    window.scrollTo({ top: target, behavior: 'smooth' });
                } else {
                    autoScrollContext.target.scrollTo({ top: target, behavior: 'smooth' });
                }
                
                // 🆕 新增：增加滚动次数计数
                autoScrollIOSScrollCount++;
            }
            
            smoothChunk();
            autoScrollRAF = setInterval(smoothChunk, chunkDuration * 0.9); // 稍微重叠确保连贯
            
        } else {
            // 桌面端：继续使用 requestAnimationFrame
            autoScrollCSSMode = false;
            autoScrollLastTs = performance.now();
            autoScrollAccumulator = 0;
            
            function step(ts) {
                if (!autoScrollContext) return;

                let dt = (ts - autoScrollLastTs) / 1000;
                if (!Number.isFinite(dt) || dt <= 0) {
                    autoScrollLastTs = ts;
                    autoScrollRAF = requestAnimationFrame(step);
                    return;
                }
                if (dt > 0.05) dt = 0.05;
                autoScrollLastTs = ts;

                const distance = dir * speed * dt;
                autoScrollAccumulator += distance;

                if (Math.abs(autoScrollAccumulator) >= 0.5) {
                    const movePixels = autoScrollAccumulator;
                    autoScrollAccumulator = 0;

                    if (autoScrollContext.isWindow) {
                        window.scrollBy(0, movePixels);
                    } else {
                        autoScrollContext.target.scrollTop += movePixels;
                    }

                    if (stopAtBoundary) {
                        const currentScroll = autoScrollContext.getTop();
                        if (dir > 0 && currentScroll >= autoScrollMaxScroll - 1) {
                            stopAutoScroll(autoScrollReturnToConfigAfterStop);
                            showNotification('已滚动到底部');
                            return;
                        }
                        if (dir < 0 && currentScroll <= 1) {
                            stopAutoScroll(autoScrollReturnToConfigAfterStop);
                            showNotification('已滚动到顶部');
                            return;
                        }
                    }
                }

                autoScrollRAF = requestAnimationFrame(step);
            }

            autoScrollRAF = requestAnimationFrame(step);
        }
        
        updateAutoScrollButtonUI(true);
        ensureAutoScrollStopOverlay(true);
    }
    
    function stopAutoScroll(shouldReturnConfig = false) {
        // 清理样式元素
        const styleEl = document.getElementById('auto-scroll-keyframes');
        if (styleEl) styleEl.remove();
        
        // 停止时立即停在当前位置
        if (autoScrollCSSMode && autoScrollContext) {
            const current = autoScrollContext.getTop();
            if (autoScrollContext.isWindow) {
                window.scrollTo({ top: current, behavior: 'instant' });
            } else if (autoScrollContext.target) {
                autoScrollContext.target.scrollTo({ top: current, behavior: 'instant' });
            }
        }
        
        if (autoScrollRAF) {
            if (autoScrollCSSMode) {
                clearInterval(autoScrollRAF);
            } else {
                cancelAnimationFrame(autoScrollRAF);
            }
            autoScrollRAF = null;
        }
        autoScrollCSSMode = false;
        autoScrollContext = null;
        autoScrollLastPosition = 0; // 重置位置记录
        autoScrollStuckCount = 0; // 重置计数器
        autoScrollIOSScrollCount = 0; // 重置 iOS 滚动次数计数
        autoScrollIOSScrollMode = 'infinite'; // 重置滚动模式
        autoScrollIOSScrollTimes = 5; // 重置滚动次数限制
        updateAutoScrollButtonUI(false);
        ensureAutoScrollStopOverlay(false);
        const needReturn = shouldReturnConfig && autoScrollReturnToConfigAfterStop;
        autoScrollReturnToConfigAfterStop = false;
        if (needReturn) {
            showAutoScrollConfigPanel();
        }
    }

    function toggleAutoScroll() {
        if (autoScrollRAF) { stopAutoScroll(false); } else { startAutoScroll(false); }
    }

    function updateAutoScrollButtonUI(active) {
        const btn = document.getElementById('auto-scroll-button');
        if (btn) {
            btn.style.background = active ? 'linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4))' : 'white';
            btn.style.color = active ? 'white' : '';
            btn.innerHTML = active ? '⏸' : '⇵';
        }
    }

    function createAutoScrollButton() {
        const button = document.createElement('div');
        button.id = 'auto-scroll-button';
        button.innerHTML = '⇵';
        button.title = '自动滚动';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99994',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['auto-scroll-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'auto-scroll-button');
        setupDragHandlers(button);

        button.clickHandler = function() { toggleAutoScroll(); };

        return button;
    }

    function ensureAutoScrollStopOverlay(show) {
        let overlay = document.getElementById('auto-scroll-stop-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'auto-scroll-stop-overlay';
                Object.assign(overlay.style, {
                    position: 'fixed', top: '20px', right: '20px', zIndex: '100000',
                    background: 'linear-gradient(135deg, var(--smart-link-primary-color,#65aaff), var(--smart-link-secondary-color,#6173f4))', color: 'white', padding: '8px 12px', borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', userSelect: 'none',
                    fontSize: '14px'
                });
                overlay.addEventListener('click', function() {
                    stopAutoScroll(true);
                });
                document.body.appendChild(overlay);
            }
            overlay.textContent = '停止自动滚动';
        } else {
            if (overlay) overlay.remove();
        }
    }

    // 元素隐藏按钮（通过触发另一个脚本的快捷键来打开其面板）
    function createElementHiderButton() {
        const button = document.createElement('div');
        button.id = 'element-hider-button';
        button.innerHTML = '🚫';
        button.title = '元素隐藏工具';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99990',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['element-hider-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        initButtonPosition(button, 'element-hider-button');
        setupDragHandlers(button);

        button.clickHandler = function() {

            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.background = 'white';
                button.style.transform = 'scale(1)';
            }, 100);
            toggleElementHiderPanel();
        };

        return button;
    }

    // 触发“极简元素隐藏工具”的面板：优先调用全局 window.togglePanel，退化到模拟快捷键
    function toggleElementHiderPanel() {
        ehTogglePanel();
    }
    // ================================
    // 修复：URL格式化函数（用于App跳转）
    // ================================

    function formatUrlForApp(url) {
        if (url.startsWith('http')) {
            return url.replace(/^https?:\/\//, '');
        } else if (url.startsWith('/')) {
            return currentDomain + url;
        }
        return url;
    }

    // ================================
    // 选中文本迷你悬浮层
    // ================================
    let selectionOverlayEl = null;
    let selectionOverlayTimer = null;

    function getSelectedText() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return '';
        const text = (sel.toString() || '').trim();
        return text;
    }

    function getSelectionRectSafe() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        const range = sel.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        if (rect && (rect.width || rect.height)) return rect;
        // 如果不可见，插入临时span测量
        const span = document.createElement('span');
        span.appendChild(document.createTextNode('\u200b'));
        range.insertNode(span);
        rect = span.getBoundingClientRect();
        span.parentNode && span.parentNode.removeChild(span);
        return rect;
    }

    function ensureSelectionOverlay() {
        if (selectionOverlayEl) return selectionOverlayEl;
        const el = document.createElement('div');
        el.id = 'selection-mini-overlay';
        Object.assign(el.style, {
            position: 'fixed',
            zIndex: '100000',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            padding: '6px',
            display: 'none',
            gap: '6px',
            alignItems: 'center'
        });

        const mkBtn = (label, title) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.title = title;
            Object.assign(b.style, {
                width: '28px', height: '28px', borderRadius: '8px',
                border: '1px solid #e1e5e9', background: '#fafbfc', cursor: 'pointer'
            });
            b.addEventListener('mousedown', e => e.stopPropagation());
            b.addEventListener('click', e => e.stopPropagation());
            return b;
        };

        const btnSearch = mkBtn('🔍', '搜索所选文本');
        const btnCopy = mkBtn('📋', '复制所选文本');
        const btnOpen = mkBtn('🌐', '尝试作为链接打开');
        const btnHide = mkBtn('🚫', '打开元素隐藏面板');

        btnSearch.addEventListener('click', () => {
            const text = getSelectedText();
            if (text) showMultiSearchPanel(text);
            hideSelectionOverlay();
        });
        btnCopy.addEventListener('click', async () => {
            const text = getSelectedText();
            if (text) {
                await copyToClipboard(text);
                showNotification('已复制所选文本');
            }
            hideSelectionOverlay();
        });
        btnOpen.addEventListener('click', () => {
            const text = getSelectedText();
            if (!text) return;
            const url = normalizeToUrl(text);
            if (url) openSearchWindow(url, 'DirectOpen');
            else showNotification('所选内容不是链接');
            hideSelectionOverlay();
        });
        btnHide.addEventListener('click', () => {
            toggleElementHiderPanel();
            hideSelectionOverlay();
        });

        el.appendChild(btnSearch);
        el.appendChild(btnCopy);
        el.appendChild(btnOpen);
        el.appendChild(btnHide);

        document.body.appendChild(el);
        selectionOverlayEl = el;
        return el;
    }

    function normalizeToUrl(text) {
        const t = text.trim();
        if (/^https?:\/\//i.test(t)) return t;
        if (/^[a-z]+:\/\//i.test(t)) return t;
        if (/^www\./i.test(t)) return 'http://' + t;
        try {
            // 可能是相对路径
            if (t.startsWith('/')) return location.origin + t;
            // 尝试构建URL（域名缺失会抛错）
            new URL(t);
            return t;
        } catch (_) {
            return '';
        }
    }

    function showSelectionOverlay() {
        if (!config.selectionSearchEnabled) return;
        const text = getSelectedText();
        if (!text) { hideSelectionOverlay(); return; }

        const rect = getSelectionRectSafe();
        if (!rect) { hideSelectionOverlay(); return; }

        const el = ensureSelectionOverlay();
        const padding = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let left = rect.left + rect.width / 2;
        let top = rect.top - 10; // 默认显示在上方

        // 初始显示以便测量尺寸
        el.style.display = 'flex';
        el.style.opacity = '0';
        el.style.left = '-9999px';
        el.style.top = '-9999px';

        // 下一帧再定位
        requestAnimationFrame(() => {
            const bw = el.offsetWidth;
            const bh = el.offsetHeight;
            left = Math.min(Math.max(padding + bw / 2, left), vw - padding - bw / 2);
            // 如果上方空间不足，放到下方
            if (rect.top < bh + 20) top = rect.bottom + 10;

            el.style.left = (left - bw / 2) + 'px';
            el.style.top = top + 'px';
            el.style.opacity = '1';
        });
    }

    function hideSelectionOverlay() {
        if (selectionOverlayEl) {
            selectionOverlayEl.style.display = 'none';
        }
    }

    function scheduleUpdateSelectionOverlay(e) {
        if (isOurElement(e && e.target)) return; // 避免在面板内触发
        clearTimeout(selectionOverlayTimer);
        selectionOverlayTimer = setTimeout(showSelectionOverlay, 120);
    }

    function initSelectionMiniOverlay() {
        if (!config.selectionSearchEnabled) return;
        document.addEventListener('mouseup', scheduleUpdateSelectionOverlay);
        document.addEventListener('keyup', (e) => {
            // 大多数选择结束后会有 keyup（比如 Shift+箭头），统一处理
            scheduleUpdateSelectionOverlay(e);
        });
        document.addEventListener('selectionchange', () => {
            // 折叠时立即隐藏
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) hideSelectionOverlay();
        });
        window.addEventListener('scroll', hideSelectionOverlay, { passive: true });
    }
    // ================================
    // 🆕 功能：可视化元素选择器
    // ================================

    let isElementPicking = false;
    let pickerHighlightDiv = null;
    let currentPickedElement = null;

    // 创建按钮
    function createElementSelectorButton() {
        const button = document.createElement('div');
        button.id = 'element-selector-button';
        button.innerHTML = '🎯'; // 使用靶心图标
        button.title = '可视化元素选择器';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['element-selector-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['element-selector-button']) {
            buttonPositions['element-selector-button'] = { defaultRight: 20, defaultBottom: 420 };
        }

        initButtonPosition(button, 'element-selector-button');
        setupDragHandlers(button);

        button.clickHandler = function() {
            toggleElementPicker();
        };

        return button;
    }

    function toggleElementPicker() {
        if (isElementPicking) {
            stopElementPicking();
        } else {
            startElementPicking();
        }
    }

    function startElementPicking() {
        if (isElementPicking) return;
        isElementPicking = true;

        // 创建或显示高亮框
        if (!pickerHighlightDiv) {
            pickerHighlightDiv = document.createElement('div');
            pickerHighlightDiv.className = 'element-picker-highlight';
            document.body.appendChild(pickerHighlightDiv);
        }
        pickerHighlightDiv.style.display = 'block';

        showNotification('🌸 进入元素选择模式，点击元素获取选择器 (ESC 退出)');

        document.addEventListener('mousemove', handlePickerMove, true);
        document.addEventListener('click', handlePickerClick, true);
        document.addEventListener('keydown', handlePickerKeydown, true);
    }

    function stopElementPicking() {
        if (!isElementPicking) return;
        isElementPicking = false;

        if (pickerHighlightDiv) pickerHighlightDiv.style.display = 'none';

        document.removeEventListener('mousemove', handlePickerMove, true);
        document.removeEventListener('click', handlePickerClick, true);
        document.removeEventListener('keydown', handlePickerKeydown, true);

        showNotification('已退出选择模式');
    }

    function handlePickerMove(e) {
        if (!isElementPicking) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);

        // 忽略UI自身
        if (!el || isOurElement(el) || el === pickerHighlightDiv) return;

        if (el !== currentPickedElement) {
            currentPickedElement = el;
            const rect = el.getBoundingClientRect();
            pickerHighlightDiv.style.width = rect.width + 'px';
            pickerHighlightDiv.style.height = rect.height + 'px';
            pickerHighlightDiv.style.left = (rect.left + window.scrollX) + 'px';
            pickerHighlightDiv.style.top = (rect.top + window.scrollY) + 'px';
        }
    }

    function handlePickerClick(e) {
        if (!isElementPicking) return;

        // 忽略UI点击
        if (isOurElement(e.target) || e.target === pickerHighlightDiv) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const el = currentPickedElement;
        if (el) {
            stopElementPicking();
            const selector = getUniqueSelector(el); // 使用你提供的逻辑函数
            const text = getElementText(el);       // 使用你提供的逻辑函数
            showElementResultPanel(el, selector, text);
        }
        return false;
    }

    function handlePickerKeydown(e) {
        if (e.key === 'Escape') {
            stopElementPicking();
        }
    }

    // 显示结果面板 (适配 createPanel 风格)
    function showElementResultPanel(element, selector, text) {
        const charCount = text.length;

        const panel = createPanel('元素详情', `
            <div class="panel-content">
                <div class="input-group">
                    <label class="section-title" style="font-size:13px;">标签类型</label>
                    <input type="text" class="form-input" value="${element.tagName.toLowerCase()}" readonly>
                </div>

                <div class="input-group">
                    <label class="section-title" style="font-size:13px;">CSS 选择器</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="res-selector" class="form-input" value="${selector}" readonly>
                        <button class="btn btn-primary" id="btn-copy-sel">复制</button>
                    </div>
                </div>

                <div class="input-group">
                    <label class="section-title" style="font-size:13px;">文本内容 <span style="font-weight:normal;color:#666;font-size:11px">(${charCount} 字符)</span></label>
                    <textarea id="res-text" class="form-textarea" style="height:100px" readonly>${text}</textarea>
                </div>

                <div class="btn-group equal">
                    <button class="btn" id="btn-copy-text">复制文本</button>
                    <button class="btn btn-secondary" id="btn-repick">重新选择</button>
                </div>
            </div>
        `);

        // 绑定事件
        panel.querySelector('#btn-copy-sel').addEventListener('click', () => {
            copyText(selector);
            showNotification('✅ 选择器已复制');
        });

        panel.querySelector('#btn-copy-text').addEventListener('click', () => {
            copyText(text);
            showNotification('✅ 文本内容已复制');
        });

        panel.querySelector('#btn-repick').addEventListener('click', () => {
            panel.remove();
            setTimeout(startElementPicking, 100);
        });

        addPanelButtons(panel, () => panel.remove());
        document.body.appendChild(panel);
    }

    // === 复用你提供的核心算法函数 (直接粘贴) ===

    // 获取元素的唯一选择器 (来自 css.txt)
    function getUniqueSelector(element) {
        if (!element || !element.tagName) return '';
        if (element.id) return `#${CSS.escape(element.id)}`;

        const path = [];
        let current = element;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                selector = `#${CSS.escape(current.id)}`;
                path.unshift(selector);
                break;
            }
            const parent = current.parentNode;
            if (parent) {
                const siblings = Array.from(parent.children);
                const sameTagSiblings = siblings.filter(s => s.tagName === current.tagName);
                if (sameTagSiblings.length > 1) {
                    const index = siblings.indexOf(current) + 1;
                    selector += `:nth-child(${index})`;
                }
            }
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\s+/).filter(c => c);
                if (classes.length > 0) {
                    // 简单优化：取第一个类名即可，通常够用，避免选择器过长
                    selector += `.${CSS.escape(classes[0])}`;
                }
            }
            path.unshift(selector);
            // 简单验证唯一性
            if (document.querySelectorAll(path.join(' > ')).length === 1) break;
            current = parent;
        }
        return path.join(' > ');
    }

    // 获取元素的文本内容 (来自 css.txt)
    function getElementText(element) {
        if (!element) return '';
        if (['INPUT', 'TEXTAREA'].includes(element.tagName)) return element.value || element.placeholder || '';
        if (element.tagName === 'IMG') return element.alt || element.title || '';
        return (element.textContent || '').trim().replace(/\s+/g, ' ');
    }
    // ================================
    // 🆕 功能：GitHub 图片上传器 (集成版)
    // ================================

    let isGhUploaderActive = false;
    let ghInteractionHandlers = []; // 存储事件处理器以便移除

    // 创建按钮
    function createGitHubUploadButton() {
        const button = document.createElement('div');
        button.id = 'github-upload-button';
        button.innerHTML = '☁️';
        button.title = '图片上传模式 (点击开启/关闭，右键设置)';

        Object.assign(button.style, {
            position: 'fixed',
            zIndex: '99993',
            width: config.buttonSize + 'px',
            height: config.buttonSize + 'px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
            display: config.buttonVisibility['github-upload-button'] ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: (config.buttonSize * 0.6) + 'px'
        });

        if (!buttonPositions['github-upload-button']) {
            buttonPositions['github-upload-button'] = { defaultRight: 20, defaultBottom: 460 };
        }

        initButtonPosition(button, 'github-upload-button');
        setupDragHandlers(button);

        // 左键点击：切换模式
        button.addEventListener('click', (e) => {
            // 🆕 修复：改进拖动检测，只有当真正点击（非拖动）时才切换模式
            // 检查标记或事件的 clientX/Y 是否变化（拖动会导致坐标变化）
            if (button.dataset.dragging === 'true') {
                return;
            }

            button.style.transform = 'scale(1.1)';
            setTimeout(() => button.style.transform = 'scale(1)', 100);
            toggleGhUploader();
        });

        // 右键点击：打开设置
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showGhSettings();
        });

        return button;
    }

    function toggleGhUploader() {
        if (isGhUploaderActive) {
            stopGhUploader();
        } else {
            // 检查配置
            if (!config.githubUploader || !config.githubUploader.token) {
                showNotification('❌ 请先右键按钮配置 GitHub Token');
                showGhSettings();
                return;
            }
            startGhUploader();
        }
    }

    function startGhUploader() {
        if (isGhUploaderActive) return;
        isGhUploaderActive = true;

        // 视觉反馈
        const btn = document.getElementById('github-upload-button');
        if (btn) {
            btn.style.background = 'var(--smart-link-primary-color)';
            btn.style.color = 'white';
        }

        setupGhInteraction();
        showNotification('☁️ 图片上传模式已开启 (长按图片上传)');
    }

    function stopGhUploader() {
        if (!isGhUploaderActive) return;
        isGhUploaderActive = false;

        // 移除事件监听
        ghInteractionHandlers.forEach(h => {
            document.removeEventListener(h.type, h.listener, h.options);
        });
        ghInteractionHandlers = [];

        // 视觉反馈
        const btn = document.getElementById('github-upload-button');
        if (btn) {
            btn.style.background = 'white';
            btn.style.color = '';
        }

        showNotification('已退出上传模式');
    }

    // 💫 长按交互逻辑
    function setupGhInteraction() {
        let timer = null;
        let startX, startY;
        const DURATION = 800;
        let ringEl = null;

        const createRing = () => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "gh-press-ring");
            svg.setAttribute("width", "60"); svg.setAttribute("height", "60"); svg.setAttribute("viewBox", "0 0 40 40");
            svg.innerHTML = `<circle class="gh-ring-circle" cx="20" cy="20" r="16"></circle>`;
            return svg;
        };

        const showMenu = (x, y, img) => {
            const menu = document.createElement('div');
            menu.className = 'gh-float-menu';
            const menuX = Math.min(x + 15, window.innerWidth - 130);
            const menuY = Math.min(y - 40, window.innerHeight - 50);
            menu.style.left = menuX + 'px'; menu.style.top = menuY + 'px';
            menu.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg> 上传此图片`;

            const old = document.querySelector('.gh-float-menu'); if(old) old.remove();
            document.body.appendChild(menu);

            // 点击菜单上传
            menu.onclick = (e) => {
                e.stopPropagation();
                menu.remove();
                handleGhUpload(img.src);
            };

            // 3.5秒后自动消失
            setTimeout(() => menu?.remove(), 3500);
        };

        const start = (e) => {
            if (e.target.tagName !== 'IMG') return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;

            if(ringEl) ringEl.remove();
            ringEl = createRing();
            ringEl.style.left = clientX + 'px'; ringEl.style.top = clientY + 'px';
            document.body.appendChild(ringEl);

            requestAnimationFrame(() => {
                ringEl.style.opacity = '1';
                ringEl.querySelector('circle').style.transition = `stroke-dashoffset ${DURATION}ms linear`;
                ringEl.querySelector('circle').style.strokeDashoffset = '0';
            });

            timer = setTimeout(() => {
                if(ringEl) ringEl.remove();
                if(navigator.vibrate) navigator.vibrate(50);
                showMenu(clientX, clientY, e.target);
                // 阻止默认右键菜单
                const preventDefault = (ev) => { ev.preventDefault(); document.removeEventListener('contextmenu', preventDefault); };
                document.addEventListener('contextmenu', preventDefault);
            }, DURATION);
        };

        const cancel = (e) => {
            if (e.type === 'touchmove' || e.type === 'mousemove') {
                const cx = e.touches ? e.touches[0].clientX : e.clientX;
                const cy = e.touches ? e.touches[0].clientY : e.clientY;
                if (Math.abs(cx - startX) < 10 && Math.abs(cy - startY) < 10) return;
            }
            if (timer) { clearTimeout(timer); timer = null; }
            if (ringEl) { ringEl.style.opacity = '0'; setTimeout(()=>ringEl?.remove(), 100); }
        };

        // 注册并保存引用以便移除
        const addL = (t, l, o) => {
            document.addEventListener(t, l, o);
            ghInteractionHandlers.push({ type: t, listener: l, options: o });
        };

        ['mousedown', 'touchstart'].forEach(evt => addL(evt, start, { passive: false }));
        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => addL(evt, cancel));
        ['mousemove', 'touchmove'].forEach(evt => addL(evt, cancel, { passive: true }));

        // 点击空白关闭菜单
        const closeMenu = (e) => {
            if(!e.target.closest('.gh-float-menu')) document.querySelector('.gh-float-menu')?.remove();
        };
        addL('click', closeMenu);
    }

    // 上传核心逻辑
    async function handleGhUpload(url) {
        if (typeof Swal === 'undefined') {
            showNotification('❌ SweetAlert2 未加载，请检查网络');
            return;
        }
        Swal.fire({ title: '🚀 上传中...', didOpen: () => Swal.showLoading() });

        try {
            // 获取图片 Blob
            const blob = await new Promise((res, rej) => GM_xmlhttpRequest({
                method:'GET', url, responseType:'blob',
                onload:r=>res(r.response), onerror:rej
            }));

            // 转 Base64
            const reader = new FileReader(); reader.readAsDataURL(blob);
            const base64 = await new Promise(res => reader.onloadend = () => res(reader.result.split(',')[1]));

            const c = config.githubUploader;
            // 检查配置
            if(!c.token || !c.username || !c.repo) throw new Error("配置不完整");

            const ext = blob.type.split('/')[1] || 'png';
            const fname = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
            const path = c.folder ? `${c.folder}/${fname}` : fname;

            // GitHub API 上传
            const apiUrl = `https://api.github.com/repos/${c.username}/${c.repo}/contents/${path}`;
            const auth = c.token.startsWith('ghp_') ? `token ${c.token}` : `Bearer ${c.token}`;

            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: apiUrl,
                    headers: {
                        'Authorization': auth,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        message: 'Upload via Smart Link Tool',
                        content: base64,
                        branch: c.branch
                    }),
                    onload: r => r.status >= 200 && r.status < 300 ? resolve(JSON.parse(r.responseText)) : reject(new Error(`GitHub API Error: ${r.status}`)),
                    onerror: () => reject(new Error('Network Error'))
                });
            });

            const finalUrl = c.customDomain
            ? `${c.customDomain.replace(/\/$/,'')}/${path}`
            : `https://raw.githubusercontent.com/${c.username}/${c.repo}/${c.branch}/${path}`;

            Swal.fire({
                title: '🎉 上传成功',
                html: `
                    <div style="margin-bottom:10px;padding:8px;background:#f8f9fa;border-radius:8px;word-break:break-all;font-family:monospace;font-size:12px;">${finalUrl}</div>
                    <button id="gh-cp-btn" class="gh-btn" style="background:var(--smart-link-primary-color);color:white;border:none;padding:8px 20px;border-radius:20px;cursor:pointer;">复制链接</button>
                `,
                showConfirmButton: false,
                didOpen: () => document.getElementById('gh-cp-btn').onclick = () => {
                    copyText(finalUrl);
                    Swal.close();
                    showNotification('链接已复制');
                }
            });
        } catch(e) {
            Swal.fire({ icon:'error', title:'上传失败', text:e.message });
        }
    }

    // 设置面板 (使用 SweetAlert2 以保持原汁原味)
    function showGhSettings() {
        if (typeof Swal === 'undefined') return;

        // 确保对象存在
        if (!config.githubUploader) config.githubUploader = {};
        const c = config.githubUploader;

        Swal.fire({
            title: '🛠️ 图床配置',
            html: `
                <div class="gh-config-grid">
                    <div class="gh-form-group full-width">
                        <label class="gh-label">Token (repo权限)</label>
                        <input type="password" id="ghToken" class="form-input" value="${c.token||''}" placeholder="ghp_...">
                    </div>
                    <div class="gh-form-group">
                        <label class="gh-label">用户名</label>
                        <input type="text" id="ghUser" class="form-input" value="${c.username||''}">
                    </div>
                    <div class="gh-form-group">
                        <label class="gh-label">仓库名</label>
                        <input type="text" id="ghRepo" class="form-input" value="${c.repo||''}">
                    </div>
                    <div class="gh-form-group">
                        <label class="gh-label">分支</label>
                        <input type="text" id="ghBranch" class="form-input" value="${c.branch||'main'}">
                    </div>
                    <div class="gh-form-group">
                        <label class="gh-label">存储目录</label>
                        <input type="text" id="ghFolder" class="form-input" value="${c.folder||'images'}">
                    </div>
                    <div class="gh-form-group full-width">
                        <label class="gh-label">自定义域名 (CDN)</label>
                        <input type="text" id="ghDomain" class="form-input" value="${c.customDomain||''}" placeholder="https://cdn.jsdelivr.net/...">
                    </div>
                </div>
                <div style="margin-top:20px;display:flex;justify-content:center;gap:10px;">
                    <button id="ghBtnSave" class="btn btn-primary" style="padding:10px 30px;">保存配置</button>
                </div>
            `,
            showConfirmButton: false,
            width: '500px',
            didOpen: () => {
                document.getElementById('ghBtnSave').onclick = () => {
                    config.githubUploader = {
                        token: document.getElementById('ghToken').value.trim(),
                        username: document.getElementById('ghUser').value.trim(),
                        repo: document.getElementById('ghRepo').value.trim(),
                        branch: document.getElementById('ghBranch').value.trim(),
                        folder: document.getElementById('ghFolder').value.trim(),
                        customDomain: document.getElementById('ghDomain').value.trim()
                    };
                    saveConfig();
                    Swal.fire({ icon:'success', title:'配置已保存', timer:1000, showConfirmButton:false });
                };
            }
        });
    }

    // ================================
    // 核心功能
    // ================================

    function handleAppButtonClick() {
        const targetUrl = extractTargetUrl();
        if (targetUrl) {
            // 🆕 修改：使用新的Scheme获取函数
            const scheme = getUrlSchemeForDomain();
            const teakUrl = `${scheme}${targetUrl}`;
            try {
                window.location.href = teakUrl;
            } catch (err) {
                console.error('打开App失败:', err);
            }
        }
    }

    async function handleCopyButtonClick() {
        const url = window.location.href;
        await copyToClipboard(url);
    }

    function extractTargetUrl() {
        const currentPattern = config.domainPatterns[currentDomain];
        const currentUrl = window.location.href;

        if (currentPattern) {
            try {
                const regex = new RegExp(currentPattern);
                if (regex.test(currentUrl)) {
                    return formatUrlForApp(currentUrl);
                }

                const links = document.querySelectorAll('a[href]');
                for (let link of links) {
                    const href = link.getAttribute('href');
                    if (href && regex.test(href)) {
                        return formatUrlForApp(href);
                    }
                }
            } catch (err) {
                console.warn('正则表达式错误:', err);
            }
        }

        return getCurrentPageUrl();
    }

    function getCurrentPageUrl() {
        return window.location.href.replace(/^https?:\/\//, '');
    }

    // ================================
    // 初始化
    // ================================

    function removeAllButtons() {
        ['app-open-button', 'copy-link-button', 'visual-search-button',
         'reading-list-button', 'clean-url-button', 'config-button',
         'batch-links-button', 'batch-paste-button', 'batch-tools-button', 'reading-list-panel-button',
         'input-search-button', 'html2md-button', 'auto-scroll-button', 'scroll-top-button', 'element-hider-button','scroll-bottom-button','element-selector-button','github-upload-button', 'combined-button'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });
        if (currentExpandedGroup) {
            currentExpandedGroup.remove();
            currentExpandedGroup = null;
        }
    }

    function initializeButtons() {
        console.log('初始化按钮，显示模式:', config.displayMode);

        if (config.customStyle && config.customStyle.enabled && config.customStyle.buttonSize) {
            config.buttonSize = config.customStyle.buttonSize;
        }

        if (config.displayMode === 'separate') {
            // 分离模式：根据buttonVisibility配置创建按钮
            const buttonCreators = {
                'app-open-button': createAppOpenButton,
                'copy-link-button': createCopyButton,
                'visual-search-button': createVisualSearchButton,
                'reading-list-button': createReadingListButton,
                'clean-url-button': createCleanUrlButton,
                'config-button': createConfigButton,
                'batch-links-button': createBatchLinksButton,
                'batch-paste-button': createBatchPasteButton,
                'batch-tools-button': createBatchToolsButton,
                'reading-list-panel-button': createReadingListPanelButton,
                'input-search-button': createInputSearchButton,
                'html2md-button': createHtmlToMarkdownButton,
                'auto-scroll-button': createAutoScrollButton,
                'scroll-top-button': createScrollTopButton,
                'scroll-bottom-button': createScrollBottomButton,
                'element-hider-button': createElementHiderButton,
                'element-selector-button': createElementSelectorButton,
                'github-upload-button': createGitHubUploadButton
            };

            // 仅创建和添加可见的按钮
            Object.entries(buttonCreators).forEach(([buttonId, creator]) => {
                if (config.buttonVisibility[buttonId] !== false) {
                    try {
                        const button = creator();
                        if (button) document.body.appendChild(button);
                    } catch (err) {
                        console.warn(`创建按钮 ${buttonId} 失败:`, err);
                    }
                }
            });

            console.log('分离模式按钮已创建，尊重buttonVisibility配置');
        } else {
            // 组合模式：只创建组合按钮
            if (config.buttonVisibility['combined-button'] !== false) {
                const combinedButton = createCombinedButton();
                document.body.appendChild(combinedButton);
            }
            console.log('组合模式按钮已创建');
        }
    }

    const EH_CONFIG_KEY = 'element_hider_config';
    const EH_SETTINGS_KEY = 'element_hider_settings';
    const ehDefaultConfig = { domains: {}, globalSelectors: [] };
    const ehDefaultSettings = { showTrigger: true, hotkey: 'Ctrl+Shift+H' };
    const ehOriginalStates = new Map();

    function ehGetConfig() {
        const raw = GM_getValue(EH_CONFIG_KEY, JSON.stringify(ehDefaultConfig));
        try { return JSON.parse(raw); } catch (_) { return { domains: {}, globalSelectors: [] }; }
    }
    function ehSaveConfig(cfg) {
        GM_setValue(EH_CONFIG_KEY, JSON.stringify(cfg));
    }
    function ehGetSettings() {
        const raw = GM_getValue(EH_SETTINGS_KEY, JSON.stringify(ehDefaultSettings));
        try { return JSON.parse(raw); } catch (_) { return { showTrigger: true, hotkey: 'Ctrl+Shift+H' }; }
    }
    function ehSaveSettings(st) {
        GM_setValue(EH_SETTINGS_KEY, JSON.stringify(st));
        ehApplySettings();
    }
    function ehGetSelectorsForDomain(domain) {
        const cfg = ehGetConfig();
        return cfg.domains[domain] || [];
    }
    function ehSaveSelectorsForDomain(domain, selectors) {
        const cfg = ehGetConfig();
        cfg.domains[domain] = selectors;
        ehSaveConfig(cfg);
        ehRefreshConfigModalIfOpen();
    }
    function ehHideElements() {
        const domain = window.location.hostname;
        const selectors = ehGetSelectorsForDomain(domain);
        ehRestoreAllElements();
        selectors.forEach(sel => {
            try {
                const nodes = document.querySelectorAll(sel);
                nodes.forEach(node => {
                    if (!ehOriginalStates.has(node)) {
                        ehOriginalStates.set(node, { display: node.style.display, visibility: node.style.visibility });
                    }
                    node.style.display = 'none';
                });
            } catch (_) {}
        });
    }
    function ehRestoreAllElements() {
        ehOriginalStates.forEach((st, el) => {
            el.style.display = st.display;
            el.style.visibility = st.visibility;
        });
        ehOriginalStates.clear();
    }
    function ehRemoveSelector(index) {
        const domain = window.location.hostname;
        const selectors = ehGetSelectorsForDomain(domain);
        ehRestoreAllElements();
        selectors.splice(index, 1);
        ehSaveSelectorsForDomain(domain, selectors);
        ehHideElements();
        ehUpdateSelectorList();
    }
    function ehApplySettings() {
        const st = ehGetSettings();
        const trigger = document.getElementById('eh-trigger');
        if (trigger) trigger.style.display = st.showTrigger ? 'flex' : 'none';
    }
    function ehSetupHotkey() {
        const st = ehGetSettings();
        document.addEventListener('keydown', function(e) {
            let k = '';
            if (e.ctrlKey) k += 'Ctrl+';
            if (e.shiftKey) k += 'Shift+';
            if (e.altKey) k += 'Alt+';
            k += e.key.toUpperCase();
            if (k === st.hotkey) { e.preventDefault(); ehTogglePanel(); }
        });
    }
    function ehTogglePanel() {
        const panel = document.getElementById('element-hider-panel');
        if (panel) panel.classList.toggle('active');
    }
    function ehAddStyles() {
        GM_addStyle(
            `#element-hider-panel{position:fixed;width:300px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(139,92,246,.2);z-index:10000;overflow:hidden;transition:.3s cubic-bezier(.4,0,.2,1);transform:translateX(100%) scale(.95);opacity:0;top:20px;right:20px;border:1px solid #f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}#element-hider-panel.active{transform:translateX(0) scale(1);opacity:1}.eh-header{padding:16px 20px;background:linear-gradient(135deg,#8b5cf6 0%,#a78bfa 100%);position:relative}.eh-header h3{margin:0;font-size:14px;font-weight:600;color:#fff;letter-spacing:.5px}.eh-close{position:absolute;top:12px;right:16px;background:rgba(255,255,255,.2);border:none;font-size:16px;color:#fff;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:.15s ease}.eh-close:hover{background:rgba(255,255,255,.3);transform:rotate(90deg)}.eh-body{padding:0}.eh-section{padding:16px 20px;border-bottom:1px solid #f0f0f0}.eh-section:last-child{border-bottom:none}.eh-domain{display:inline-block;background:#f3f0ff;color:#8b5cf6;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:500;margin-bottom:12px;border:1px solid rgba(139,92,246,.1)}.eh-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}.eh-btn{background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:12px;transition:.15s ease;color:#2d3748;font-weight:500;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px;height:32px}.eh-btn:hover{background:#fafafa;border-color:#8b5cf6;transform:translateY(-1px);box-shadow:0 1px 3px rgba(139,92,246,.1)}.eh-btn.primary{background:linear-gradient(135deg,#8b5cf6 0%,#a78bfa 100%);border:none;color:#fff}.eh-btn.primary:hover{background:#7c3aed;transform:translateY(-1px);box-shadow:0 2px 8px rgba(139,92,246,.3)}.eh-selector-list{max-height:120px;overflow-y:auto;margin:0;padding:0;list-style:none}.eh-selector-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:12px;transition:.15s ease}.eh-selector-text{color:#718096;flex:1;overflow:hidden;text-overflow:ellipsis;font-family:'SF Mono',Monaco,monospace;font-size:11px}.eh-selector-remove{background:none;border:1px solid #e8e8e8;color:#a0aec0;border-radius:6px;width:20px;height:20px;cursor:pointer;font-size:10px;transition:.15s ease;display:flex;align-items:center;justify-content:center}.eh-selector-remove:hover{background:#fee2e2;border-color:#fecaca;color:#dc2626;transform:scale(1.1)}.eh-footer-buttons{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%}.eh-footer-buttons .eh-btn{height:28px;padding:6px 10px;font-size:11px}#eh-trigger{position:fixed;bottom:20px;right:20px;width:40px;height:40px;background:linear-gradient(135deg,#8b5cf6 0%,#a78bfa 100%);border:none;border-radius:50%;color:#fff;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(139,92,246,.15);z-index:9999;transition:.3s cubic-bezier(.4,0,.2,1);display:flex;align-items:center;justify-content:center;font-weight:600}#eh-trigger:hover{transform:scale(1.1) rotate(90deg);box-shadow:0 6px 20px rgba(139,92,246,.4)}.eh-highlight{outline:2px solid #8b5cf6 !important;position:relative;cursor:pointer;border-radius:6px}.eh-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10002;opacity:0;visibility:hidden;transition:.25s ease;backdrop-filter:blur(4px)}.eh-modal.active{opacity:1;visibility:visible}.eh-modal-content{background:#fff;border-radius:12px;padding:20px;width:90%;max-width:360px;transform:scale(.9);transition:.3s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 24px rgba(139,92,246,.2);border:1px solid #f0f0f0}.eh-modal.active .eh-modal-content{transform:scale(1)}.eh-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.eh-modal-title{margin:0;font-size:14px;font-weight:600;color:#2d3748}.eh-modal-close{background:none;border:none;font-size:16px;color:#a0aec0;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:.15s ease}.eh-modal-close:hover{background:#fafafa;color:#2d3748}.eh-input{width:100%;padding:10px 12px;border:1px solid #e8e8e8;border-radius:8px;margin-bottom:12px;font-size:12px;transition:.15s ease;background:#fff}.eh-input:focus{outline:none;border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.1)}.eh-textarea{width:100%;height:100px;padding:12px;border:1px solid #e8e8e8;border-radius:8px;margin-bottom:12px;resize:vertical;font-family:'SF Mono',Monaco,monospace;font-size:11px;background:#fff}.eh-textarea:focus{outline:none;border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.1)}.eh-setting-item{margin-bottom:16px}.eh-setting-label{display:block;margin-bottom:6px;font-size:12px;color:#2d3748;font-weight:500}.eh-setting-description{font-size:10px;color:#a0aec0;margin-top:4px;line-height:1.4}.eh-select{width:100%;padding:10px 12px;border:1px solid #e8e8e8;border-radius:8px;margin-bottom:12px;font-size:12px;background:#fff;cursor:pointer}.eh-select:focus{outline:none;border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.1)}`
        );
    }
    function ehCreateControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'element-hider-panel';
        panel.innerHTML = `
            <div class="eh-header"><h3>元素隐藏工具</h3><button class="eh-close">×</button></div>
            <div class="eh-body">
                <div class="eh-section">
                    <div class="eh-domain">${window.location.hostname}</div>
                    <div class="eh-btn-group">
                        <button class="eh-btn primary eh-pick-mode">选择元素</button>
                        <button class="eh-btn eh-manual-input">手动输入</button>
                    </div>
                </div>
                <div class="eh-section">
                    <h4 style="margin:0 0 8px 0;font-size:12px;color:#2d3748;font-weight:600;">隐藏规则</h4>
                    <ul class="eh-selector-list"></ul>
                </div>
                <div class="eh-section">
                    <div class="eh-footer-buttons">
                        <button class="eh-btn eh-manage-config">管理</button>
                        <button class="eh-btn eh-export">导出</button>
                        <button class="eh-btn eh-import">导入</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(panel);
        return panel;
    }
    function ehCreateModals() {
        const defs = [
            { id: 'manual-input-modal', title: '输入选择器', content: `<input type="text" class="eh-input" placeholder="例如: .ad-banner, #sidebar-ad"><div style="display:flex;gap:8px;justify-content:flex-end;"><button class="eh-btn" id="cancel-input">取消</button><button class="eh-btn primary" id="add-selector">添加</button></div>` },
            { id: 'config-modal', title: '配置管理', content: `<div><h4 style="margin-bottom:12px;font-size:12px;color:#2d3748;font-weight:600;">域名配置</h4><div id="domain-configs" style="max-height:160px;overflow-y:auto;"></div></div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;"><button class="eh-btn primary" id="reset-config">重置配置</button><button class="eh-btn" id="close-config">关闭</button></div>` },
            { id: 'import-modal', title: '导入配置', content: `<input type="file" id="eh-import-file" accept="application/json" style="display: none;">
<div onclick="document.getElementById('eh-import-file').click()"
     style="display: inline-block; padding: 10px 20px; border: 2px solid #976ff7; color: #976ff7; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;"
     onmouseover="this.style.backgroundColor='#f5f0ff'; this.style.transform='translateY(-1px)'"
     onmouseout="this.style.backgroundColor=''; this.style.transform=''">
    📄 选择配置文件
</div><div style="display:flex;gap:8px;justify-content:flex-end;"><button class="eh-btn" id="cancel-import">取消</button><button class="eh-btn primary" id="confirm-import">导入</button></div>` }
        ];
        defs.forEach(d => {
            const m = document.createElement('div');
            m.className = 'eh-modal';
            m.id = d.id;
            m.innerHTML = `<div class="eh-modal-content"><div class="eh-modal-header"><h3 class="eh-modal-title">${d.title}</h3><button class="eh-modal-close">×</button></div>${d.content}</div>`;
            document.body.appendChild(m);
        });
    }
    function ehUpdateSelectorList() {
        const domain = window.location.hostname;
        const selectors = ehGetSelectorsForDomain(domain);
        const list = document.querySelector('.eh-selector-list');
        if (!list) return;
        list.innerHTML = '';
        if (selectors.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'eh-empty-state';
            empty.innerHTML = '暂无隐藏规则';
            list.appendChild(empty);
        } else {
            selectors.forEach((sel, idx) => {
                const item = document.createElement('li');
                item.className = 'eh-selector-item';
                item.innerHTML = `<span class="eh-selector-text" title="${sel}">${sel}</span><button class="eh-selector-remove" data-index="${idx}">×</button>`;
                list.appendChild(item);
            });
        }
        document.querySelectorAll('.eh-selector-remove').forEach(b => {
            b.addEventListener('click', function() { const i = parseInt(this.getAttribute('data-index')); ehRemoveSelector(i); });
        });
    }
    function ehStartPickMode() {
        const panel = document.getElementById('element-hider-panel');
        if (panel) panel.classList.remove('active');
        let hi = null;
        function highlight(e) {
            if (hi) hi.classList.remove('eh-highlight');
            hi = e.target;
            hi.classList.add('eh-highlight');
            e.stopPropagation();
            e.preventDefault();
        }
        function select(e) {
            if (hi) {
                hi.classList.remove('eh-highlight');
                const sel = ehGenerateSelector(hi);
                if (sel) ehAddSelector(sel);
                cancel(e);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        function cancel(e) {
            if (e && e.key && e.key !== 'Escape') return;
            document.removeEventListener('mousemove', highlight);
            document.removeEventListener('click', select, true);
            document.removeEventListener('keydown', cancel);
            if (hi) hi.classList.remove('eh-highlight');
            if (panel) panel.classList.add('active');
        }
        document.addEventListener('mousemove', highlight);
        document.addEventListener('click', select, true);
        document.addEventListener('keydown', cancel);
    }
    function ehGenerateSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.className && typeof el.className === 'string') {
            const cs = el.className.split(/\s+/).filter(Boolean);
            if (cs.length > 0) return `.${cs[0]}`;
        }
        return el.tagName.toLowerCase();
    }
    function ehAddSelector(selector) {
        const domain = window.location.hostname;
        const selectors = ehGetSelectorsForDomain(domain);
        if (!selectors.includes(selector)) {
            selectors.push(selector);
            ehSaveSelectorsForDomain(domain, selectors);
            ehUpdateSelectorList();
            ehHideElements();
        }
    }
    function ehToggleModal(id, show) {
        const m = document.getElementById(id);
        if (!m) return;
        if (show) m.classList.add('active'); else m.classList.remove('active');
    }

    function ehRenderDomainConfigs() {
        const container = document.getElementById('domain-configs');
        if (!container) return;
        const cfg = ehGetConfig();
        const domainConfigs = cfg.domains || {};
        const domains = Object.keys(domainConfigs);
        if (domains.length === 0) {
            container.innerHTML = '<div class="eh-empty-state">暂无域名配置</div>';
            return;
        }
        container.innerHTML = '';
        domains.forEach(domain => {
            const selectors = domainConfigs[domain] || [];
            const sec = document.createElement('div');
            sec.style.marginBottom = '12px';
            sec.style.padding = '12px';
            sec.style.background = '#fafafa';
            sec.style.borderRadius = '8px';
            sec.style.border = '1px solid #f0f0f0';
            const selectorsHTML = selectors.length
            ? selectors.map(s => `<div style="margin:4px 0;">• ${s}</div>`).join('')
            : '<div style="margin:4px 0;color:#a0aec0;">暂无规则</div>';
            sec.innerHTML = `
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;margin-bottom:8px;color:#2d3748;font-size:12px;word-break:break-all;">${domain}</div>
                        <div style="font-size:11px;color:#718096;">${selectorsHTML}</div>
                    </div>
                    <button class="eh-btn eh-domain-delete" data-domain="${domain}" style="background:#ffe8ea;color:#c62828;border:1px solid #ffcdd2;border-radius:8px;height:28px;min-width:56px;">删除</button>
                </div>`;
            container.appendChild(sec);
        });
        container.querySelectorAll('.eh-domain-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const domain = this.getAttribute('data-domain');
                if (!domain) return;
                if (!confirm(`确定要删除 ${domain} 的隐藏规则吗？`)) return;
                const cfg = ehGetConfig();
                cfg.domains = cfg.domains || {};
                if (cfg.domains[domain]) {
                    delete cfg.domains[domain];
                    ehSaveConfig(cfg);
                    ehRestoreAllElements();
                    ehHideElements();
                    ehUpdateSelectorList();
                    ehRenderDomainConfigs();
                    showNotification(`已删除 ${domain} 的隐藏规则`);
                }
            });
        });
    }

    function ehShowConfigManager() {
        ehRenderDomainConfigs();
        ehToggleModal('config-modal', true);
    }

    function ehRefreshConfigModalIfOpen() {
        const modal = document.getElementById('config-modal');
        if (modal && modal.classList.contains('active')) {
            ehRenderDomainConfigs();
        }
    }
    function ehExportConfig() {
        const cfg = ehGetConfig();
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cfg, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'element-hider-config.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    function ehEnablePanelDrag() {
        const panel = document.getElementById('element-hider-panel');
        if (!panel) return;
        const header = panel.querySelector('.eh-header');
        let dragging = false;
        let offset = { x: 0, y: 0 };
        function start(e) {
            if (e.target.classList.contains('eh-close')) return;
            dragging = true;
            const r = panel.getBoundingClientRect();
            offset.x = e.clientX - r.left;
            offset.y = e.clientY - r.top;
            panel.style.transition = 'none';
        }
        function drag(e) {
            if (!dragging) return;
            const x = e.clientX - offset.x;
            const y = e.clientY - offset.y;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            panel.style.right = 'auto';
        }
        function stop() {
            dragging = false;
            panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        header.addEventListener('mousedown', start);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stop);
    }
    function ehInitEventListeners() {
        const panel = document.getElementById('element-hider-panel');
        // 不创建触发按钮，入口在配置面板
        panel.querySelector('.eh-close').addEventListener('click', () => { panel.classList.remove('active'); });
        panel.querySelector('.eh-pick-mode').addEventListener('click', ehStartPickMode);
        panel.querySelector('.eh-manual-input').addEventListener('click', () => { ehToggleModal('manual-input-modal', true); });
        panel.querySelector('.eh-manage-config').addEventListener('click', ehShowConfigManager);
        panel.querySelector('.eh-export').addEventListener('click', ehExportConfig);
        panel.querySelector('.eh-import').addEventListener('click', () => { ehToggleModal('import-modal', true); });
        document.getElementById('add-selector').addEventListener('click', () => {
            const val = document.querySelector('#manual-input-modal .eh-input').value.trim();
            if (val) { ehAddSelector(val); document.querySelector('#manual-input-modal .eh-input').value = ''; ehToggleModal('manual-input-modal', false); }
        });
        document.getElementById('cancel-input').addEventListener('click', () => { ehToggleModal('manual-input-modal', false); });
        document.getElementById('reset-config').addEventListener('click', () => {
            if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
                ehRestoreAllElements();
                ehSaveConfig(ehDefaultConfig);
                ehUpdateSelectorList();
                ehRenderDomainConfigs();
                ehToggleModal('config-modal', false);
            }
        });
        document.getElementById('close-config').addEventListener('click', () => { ehToggleModal('config-modal', false); });
        document.getElementById('confirm-import').addEventListener('click', () => {
            const fi = document.getElementById('eh-import-file');
            const f = fi && fi.files && fi.files[0];
            if (!f) { alert('请选择配置文件'); return; }
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    ehRestoreAllElements();
                    const nc = JSON.parse(reader.result);
                    ehSaveConfig(nc);
                    ehUpdateSelectorList();
                    ehHideElements();
                    ehRefreshConfigModalIfOpen();
                    ehToggleModal('import-modal', false);
                    fi.value = '';
                } catch (_) { alert('配置格式错误，请检查JSON格式'); }
            };
            reader.readAsText(f);
        });
        document.getElementById('cancel-import').addEventListener('click', () => { ehToggleModal('import-modal', false); });
        document.querySelectorAll('.eh-modal-close').forEach(btn => { btn.addEventListener('click', function() { const m = this.closest('.eh-modal'); m.classList.remove('active'); }); });
        document.querySelectorAll('.eh-modal').forEach(m => { m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); }); });
        ehEnablePanelDrag();
    }
    function ehRegisterMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('元素隐藏工具：打开面板', ehTogglePanel);
            GM_registerMenuCommand('元素隐藏工具：选择元素', ehStartPickMode);
            GM_registerMenuCommand('元素隐藏工具：手动输入选择器', () => { ehToggleModal('manual-input-modal', true); });
            GM_registerMenuCommand('元素隐藏工具：管理配置', ehShowConfigManager);
            GM_registerMenuCommand('元素隐藏工具：导出配置', ehExportConfig);
            GM_registerMenuCommand('元素隐藏工具：导入配置', () => { ehToggleModal('import-modal', true); });
        }
    }
    function ehInit() {
        ehAddStyles();
        ehCreateControlPanel();
        ehCreateModals();
        ehInitEventListeners();
        ehUpdateSelectorList();
        ehHideElements();
        ehApplySettings();
        ehSetupHotkey();
        // 菜单选项不再注册，入口在配置界面
        const obs = new MutationObserver(ehHideElements);
        obs.observe(document.body, { childList: true, subtree: true });
        window.togglePanel = ehTogglePanel;
    }

    // ================================
    // 菜单命令
    // ================================
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ 打开配置菜单', showConfigPanel);
        GM_registerMenuCommand('🎭 显示/隐藏所有按钮', toggleAllButtons);
        GM_registerMenuCommand('📚 打开阅读列表', showReadingListPanel);
    }

    // ================================
    // 启动
    // ================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeButtons();
            registerAllHotkeys();
            applyCustomStyles();
            initSelectionMiniOverlay();
            ehInit();
            console.log('脚本初始化完成，自定义样式已应用');
        });
    } else {
        setTimeout(() => {
            initializeButtons();
            registerAllHotkeys();
            applyCustomStyles();
            initSelectionMiniOverlay();
            ehInit();
            console.log('脚本初始化完成，自定义样式已应用');
        }, 100);
    }
})();
