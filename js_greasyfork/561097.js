// ==UserScript==
// @name         TGFC论坛WAP助手
// @namespace    http://tampermonkey.net/
// @version      0.5.8
// @description  TGFC论坛WAP版增强：热门话题、关注话题、用户屏蔽、Tag标签、楼主高亮、快速链接、卡片式美化、Markdown渲染、URL参数自定义、静默引用、自动链接识别
// @author       Heiren + AI
// @match        https://wap.tgfcer.com/*
// @match        https://club.tgfcer.com/wap/*
// @match        https://s.tgfcer.com/wap/*
// @connect      club.tgfcer.com
// @connect      club.tgfcer.net
// @connect      tgfcer.com
// @connect      tgfcer.net
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.localStorage
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561097/TGFC%E8%AE%BA%E5%9D%9BWAP%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561097/TGFC%E8%AE%BA%E5%9D%9BWAP%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // === 自动切换到旧版模板 & 应用默认参数 (在 document-start 时立即执行) ===
    const url = new URL(location.href);
    const params = url.searchParams;

    // 读取配置以获取自定义参数 (确保每个参数都有默认值)
    // 优先使用 GM_getValue（支持跨域同步），降级到 localStorage
    const STORAGE_KEY_EARLY = 'tgfc_wap_config';
    let cfg = null;
    try {
        // 尝试 GM_getValue（Tampermonkey/Violentmonkey 在 document-start 阶段可用）
        if (typeof GM_getValue === 'function') {
            const gmRaw = GM_getValue(STORAGE_KEY_EARLY, null);
            if (gmRaw) {
                cfg = typeof gmRaw === 'string' ? JSON.parse(gmRaw) : gmRaw;
            }
        }
    } catch (e) {
        // GM_getValue 不可用或解析失败
    }
    // 回退到 localStorage
    if (!cfg) {
        try {
            cfg = JSON.parse(localStorage.getItem(STORAGE_KEY_EARLY));
        } catch (e) { }
    }
    const userParams = cfg?.urlParams || {};
    const def = {
        vt: userParams.vt || '1',
        tp: userParams.tp || '100',
        pp: userParams.pp || '100',
        sc: userParams.sc || '0',
        vf: userParams.vf || '0',
        sm: userParams.sm || '0',
        css: userParams.css || '',
        iam: Array.isArray(userParams.iam) ? userParams.iam : []
    };
    // iam 数组转为 URL 参数值 (逗号分隔)
    const defIamStr = def.iam.join('-');

    // === 立即注入关键样式（防止页面闪烁/抽动） ===
    // 参考主脚本 2.2.4 的实现：先隐藏页面，准备就绪后再显示
    (function injectCriticalStyles() {
        const pageWidth = cfg?.pageWidth || '900';
        const bgColor = cfg?.bgColor || '#bdbebd';

        const criticalCSS = `
            :root {
                --tgfc-wap-width: ${pageWidth}px;
                --tgfc-wap-bg: ${bgColor};
            }
            body {
                background: var(--tgfc-wap-bg) !important;
            }
            .wrap {
                max-width: var(--tgfc-wap-width) !important;
                margin: 0 auto !important;
                opacity: 0;
                transition: opacity 0.15s ease-out;
            }
            body.tgfc-wap-ready .wrap { opacity: 1; }
            /* 后备机制：2秒后无论如何都显示 */
            @keyframes tgfc-fallback-show { to { opacity: 1; } }
            body:not(.tgfc-wap-ready) .wrap {
                animation: tgfc-fallback-show 0.3s ease-out 2s forwards;
            }
        `;

        const style = document.createElement('style');
        style.id = 'tgfc-wap-critical-css';
        style.textContent = criticalCSS;
        if (document.head) {
            document.head.insertBefore(style, document.head.firstChild);
        } else if (document.documentElement) {
            document.documentElement.insertBefore(style, document.documentElement.firstChild);
        } else {
            document.write('<style id="tgfc-wap-critical-css">' + criticalCSS + '</style>');
        }
    })();

    // 只对内容页和列表页进行重定向检查
    const isTargetPage = params.get('action') === 'thread' || params.get('action') === 'forum';

    if (isTargetPage) {
        let shouldRedirect = false;

        // 检查所有参数是否与配置一致
        if (params.get('vt') !== def.vt) shouldRedirect = true;
        if (params.get('tp') !== def.tp) shouldRedirect = true;
        if (params.get('pp') !== def.pp) shouldRedirect = true;
        if (params.get('sc') !== def.sc) shouldRedirect = true;
        if (params.get('vf') !== def.vf) shouldRedirect = true;
        if (params.get('sm') !== def.sm) shouldRedirect = true;
        if ((params.get('css') || '') !== def.css) shouldRedirect = true;
        if ((params.get('iam') || '') !== defIamStr) shouldRedirect = true;

        if (shouldRedirect) {
            // 重构 URL，按正确顺序排列参数
            // 顺序: action, tid/fid, authorid, sid, vt, tp, pp, sc, vf, sm, iam, css, verify
            const newUrl = new URL(url.origin + url.pathname);
            const newParams = newUrl.searchParams;

            // 功能性参数列表（需要保留，用于引用回复等功能）
            const functionalParams = ['action', 'tid', 'fid', 'pid', 'authorid', 'sid', 'do', 'page',
                'repquote', 'reppost', 'notice', 'mod', 'verify', 'from', 'referer', 'goto'];

            // 先保留所有功能性参数（原始值）
            functionalParams.forEach(paramName => {
                if (params.has(paramName)) {
                    newParams.set(paramName, params.get(paramName) || '');
                }
            });

            // 使用用户配置的参数值（覆盖显示相关参数）
            newParams.set('vt', def.vt);
            newParams.set('tp', def.tp);
            newParams.set('pp', def.pp);
            newParams.set('sc', def.sc);
            newParams.set('vf', def.vf);
            newParams.set('sm', def.sm);
            newParams.set('iam', defIamStr);
            newParams.set('css', def.css);

            // 重定向
            location.replace(newUrl.toString());
            return;
        }
    }

    // === 等待 DOM 加载后执行主要功能 ===
    function initScript() {

        // === Safari Userscripts 兼容层 ===
        // 检测并创建 GM_* API polyfill（如果不存在）

        // GM_addStyle polyfill
        if (typeof GM_addStyle === 'undefined') {
            window.GM_addStyle = function (css) {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = css;
                (document.head || document.documentElement).appendChild(style);
                return style;
            };
        }

        // GM_setValue polyfill
        if (typeof GM_setValue === 'undefined') {
            window.GM_setValue = function (key, value) {
                try {
                    localStorage.setItem('GM_' + key, JSON.stringify(value));
                } catch (e) {
                    console.warn('[TGFC WAP] localStorage 写入失败:', e);
                }
            };
        }

        // GM_getValue polyfill
        if (typeof GM_getValue === 'undefined') {
            window.GM_getValue = function (key, defaultValue) {
                try {
                    const val = localStorage.getItem('GM_' + key);
                    return val !== null ? JSON.parse(val) : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            };
        }

        // GM_deleteValue polyfill
        if (typeof GM_deleteValue === 'undefined') {
            window.GM_deleteValue = function (key) {
                try {
                    localStorage.removeItem('GM_' + key);
                } catch (e) {
                    console.warn('[TGFC WAP] localStorage 删除失败:', e);
                }
            };
        }

        // GM_info polyfill
        if (typeof GM_info === 'undefined') {
            window.GM_info = {
                script: {
                    name: 'TGFC论坛WAP助手',
                    version: '0.5.8'
                }
            };
        }

        // GM_xmlhttpRequest polyfill (使用 fetch，仅支持同源请求)
        if (typeof GM_xmlhttpRequest === 'undefined') {
            window.GM_xmlhttpRequest = function (details) {
                fetch(details.url, {
                    method: details.method || 'GET',
                    headers: details.headers || {},
                    body: details.data || null
                })
                    .then(response => response.text())
                    .then(text => {
                        if (details.onload) {
                            details.onload({ responseText: text, status: 200 });
                        }
                    })
                    .catch(error => {
                        if (details.onerror) {
                            details.onerror(error);
                        }
                    });
            };
        }

        const STORAGE_KEY = 'tgfc_wap_config';

        // --- 工具函数 (完全回归 0.0.12) ---
        function cleanStr(s) { return s ? s.replace(/[\r\n\t\u200b-\u200d\uFEFF\xA0]+/g, " ").trim() : ""; }

        // 关键词检查辅助函数
        function checkKeywords(text, keywords) {
            if (!text || !keywords || keywords.length === 0) return null;
            for (const kw of keywords) {
                if (text.includes(kw)) return kw;
            }
            return null;
        }

        function getThreadId() {
            const url = location.href;
            let match = url.match(/[?&]tid=(\d+)/);
            return match ? match[1] : null;
        }

        // --- 配置管理 (完全回归 0.0.12 单Key模式) ---
        // 字体预设
        const fontPresets = [
            { name: '默认', val: '' },
            { name: '微软雅黑', val: 'Microsoft YaHei, sans-serif' },
            { name: '苹果苹方', val: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif' },
            { name: '思源黑体', val: '"Source Han Sans SC", "Noto Sans SC", sans-serif' },
            { name: '黑体', val: 'SimHei, "Heiti SC", sans-serif' },
            { name: '宋体', val: 'SimSun, serif' }
        ];
        const fontSizePresets = ['默认', '12px', '13px', '14px', '15px', '16px', '18px', '20px'];

        function getConfig() {
            const defaultCfg = {
                blocked: [], blockedKeywords: [], highlighted: {}, customPresets: [],
                hideList: true, hideContent: true, showBlockTip: true,
                pageWidth: '900', bgColor: '#bdbebd', font: '', fontSize: '',
                urlParams: { vt: '1', tp: '100', pp: '100', sc: '0', vf: '0', sm: '0', css: '', iam: [] }
            };

            let cfg = null;

            // 优先尝试 GM_getValue（支持跨域同步）
            try {
                const gmRaw = GM_getValue(STORAGE_KEY, null);
                if (gmRaw) {
                    cfg = typeof gmRaw === 'string' ? JSON.parse(gmRaw) : gmRaw;
                }
            } catch (e) {
                // GM_getValue 不可用或解析失败，继续尝试 localStorage
            }

            // 回退到 localStorage
            if (!cfg) {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    cfg = raw ? JSON.parse(raw) : {};
                } catch (e) {
                    return defaultCfg;
                }
            }

            // 合并配置与默认值
            return {
                blocked: Array.isArray(cfg.blocked) ? cfg.blocked : defaultCfg.blocked,
                blockedKeywords: Array.isArray(cfg.blockedKeywords) ? cfg.blockedKeywords : defaultCfg.blockedKeywords,
                highlighted: cfg.highlighted || defaultCfg.highlighted,
                customPresets: Array.isArray(cfg.customPresets) ? cfg.customPresets : defaultCfg.customPresets,
                hideList: cfg.hideList !== false,
                hideContent: cfg.hideContent !== false,
                showBlockTip: cfg.showBlockTip !== false,
                silentQuote: cfg.silentQuote === true,
                autoLinkify: cfg.autoLinkify !== false,
                pageWidth: cfg.pageWidth || defaultCfg.pageWidth,
                bgColor: cfg.bgColor || defaultCfg.bgColor,
                font: cfg.font || defaultCfg.font,
                fontSize: cfg.fontSize || defaultCfg.fontSize,
                urlParams: cfg.urlParams || defaultCfg.urlParams
            };
        }

        function saveConfig(cfg) {
            const data = JSON.stringify(cfg);
            // 优先使用 GM_setValue（跨域同步）
            try {
                GM_setValue(STORAGE_KEY, data);
            } catch (e) {
                // GM_setValue 不可用
            }
            // 始终同步到 localStorage 作为回退
            try {
                localStorage.setItem(STORAGE_KEY, data);
            } catch (e) {
                // localStorage 不可用
            }
        }

        // 快速链接模块 - 使用 GM_setValue 跨域同步
        const QUICK_LINKS_KEY = 'tgfc_quick_links';
        const defaultQuickLinks = [
            { id: 'threads', name: '我的主题', url: 'https://s.tgfcer.com/wap/index.php?action=my&do=mythreads&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=', enabled: true },
            { id: 'posts', name: '我的回复', url: 'https://s.tgfcer.com/wap/index.php?action=my&do=myreplies&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=', enabled: true },
            { id: 'water', name: '水区直达', url: 'https://s.tgfcer.com/wap/index.php?action=forum&fid=25', enabled: true }
        ];

        function loadQuickLinks() {
            try {
                // 优先尝试 GM_getValue
                let raw = null;
                try {
                    raw = GM_getValue(QUICK_LINKS_KEY, null);
                } catch (e) {
                    // GM API 不可用，降级到 localStorage
                }
                // 如果 GM 没有数据，尝试 localStorage
                if (!raw) {
                    raw = localStorage.getItem(QUICK_LINKS_KEY);
                }
                if (!raw) return defaultQuickLinks.slice();
                const arr = JSON.parse(raw);
                return Array.isArray(arr) ? arr : defaultQuickLinks.slice();
            } catch (e) {
                console.warn('[TGFC WAP] loadQuickLinks error:', e);
                return defaultQuickLinks.slice();
            }
        }

        function saveQuickLinks(items) {
            const data = JSON.stringify(items);
            // 同时保存到 GM 和 localStorage，确保移动端兼容
            try {
                GM_setValue(QUICK_LINKS_KEY, data);
            } catch (e) {
                console.warn('[TGFC WAP] GM_setValue failed:', e);
            }
            // 始终同步到 localStorage 作为备份
            try {
                localStorage.setItem(QUICK_LINKS_KEY, data);
            } catch (e) {
                console.warn('[TGFC WAP] localStorage.setItem failed:', e);
            }
        }

        // 应用显示设置
        function applyDisplaySettings() {
            const cfg = getConfig();
            let styleEl = document.getElementById('tgfc-wap-display-style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'tgfc-wap-display-style';
                document.head.appendChild(styleEl);
            }
            let css = '';
            if (cfg.bgColor) css += `body { background: ${cfg.bgColor} !important; }`;
            if (cfg.pageWidth) css += `.wrap, .container, #main { max-width: ${cfg.pageWidth}px !important; margin: 0 auto !important; }`;
            // WAP 版使用 .message, .infobar, .dTitle 等选择器
            if (cfg.font) css += `body, .message, .infobar, .dTitle, .dTitle a, .title a, .quote, p { font-family: ${cfg.font} !important; }`;
            if (cfg.fontSize) css += `.message, .infobar, .dTitle, .dTitle a, .title a, .quote, p { font-size: ${cfg.fontSize} !important; }`;
            // 强制时间区使用固定小字号，不受用户设置影响
            css += `.tgfc-infobar-time { font-size: 9px !important; }`;
            styleEl.textContent = css;
        }

        // URL 参数自动注入
        let urlParamsObserver = null;

        function applyUrlParams() {
            const cfg = getConfig();
            const params = cfg.urlParams || {};
            if (!params || Object.keys(params).length === 0) return;

            // 构建 URL 参数字符串
            const paramStr = Object.entries(params)
                .filter(([k, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0))
                .map(([k, v]) => {
                    if (Array.isArray(v)) {
                        return v.length > 0 ? `${k}=${v.join(',')}` : '';
                    }
                    return `${k}=${v}`;
                })
                .join('&');
            if (!paramStr) return;

            // 处理单个链接的函数
            const injectLink = (link) => {
                if (link.dataset.tgfcUrlParamsInjected) return;
                try {
                    const url = new URL(link.href, location.href);
                    // 只对同域链接注入参数
                    if (url.hostname === location.hostname) {
                        // 注入参数
                        params.vt !== undefined && url.searchParams.set('vt', params.vt);
                        params.tp !== undefined && url.searchParams.set('tp', params.tp);
                        params.pp !== undefined && url.searchParams.set('pp', params.pp);
                        params.sc !== undefined && url.searchParams.set('sc', params.sc);
                        params.vf !== undefined && url.searchParams.set('vf', params.vf);
                        params.sm !== undefined && url.searchParams.set('sm', params.sm);
                        if (params.css !== undefined && params.css !== '') {
                            url.searchParams.set('css', params.css);
                        }
                        if (params.iam && params.iam.length > 0) {
                            url.searchParams.set('iam', params.iam.join(','));
                        }
                        link.href = url.toString();
                        link.dataset.tgfcUrlParamsInjected = '1';
                    }
                } catch (e) {
                    // URL 解析失败，跳过
                }
            };

            // 处理所有现有链接
            document.querySelectorAll('a[href]').forEach(injectLink);

            // 启动 MutationObserver 监听新链接
            if (!urlParamsObserver) {
                urlParamsObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName === 'A' && node.href) {
                                    injectLink(node);
                                } else {
                                    const links = node.querySelectorAll && node.querySelectorAll('a[href]');
                                    if (links) {
                                        links.forEach(injectLink);
                                    }
                                }
                            }
                        });
                    });
                });
                urlParamsObserver.observe(document.body, { childList: true, subtree: true });
            }
        }

        // --- 楼主识别系统 ---
        function getThreadOP() {
            const tid = getThreadId();
            return tid ? sessionStorage.getItem('tgfc_op_' + tid) : null;
        }

        function setThreadOP(name) {
            const tid = getThreadId();
            if (tid && name && name !== "屏蔽" && name !== "楼主") {
                sessionStorage.setItem('tgfc_op_' + tid, name);
            }
        }

        function fetchThreadOP() {
            const tid = getThreadId();
            if (!tid) return Promise.resolve(null);
            const cached = getThreadOP();
            if (cached) return Promise.resolve(cached);

            return new Promise((resolve) => {
                const host = location.hostname.includes('.net') ? 'club.tgfcer.net' : 'club.tgfcer.com';
                const url = `https://${host}/thread-${tid}-1-1.html`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    overrideMimeType: 'text/html; charset=gbk',
                    onload: function (res) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(res.responseText, 'text/html');
                            const firstTd = doc.querySelector('td.postauthor');
                            if (firstTd) {
                                const a = firstTd.querySelector('cite a') || firstTd.querySelector('.postinfo a');
                                if (a) {
                                    const opName = cleanStr(a.innerText);
                                    setThreadOP(opName);
                                    resolve(opName);
                                    return;
                                }
                            }
                        } catch (e) { }
                        resolve(null);
                    }
                });
            });
        }

        // ========================================
        // Markdown 增强处理类 (适配 WAP 页面)
        // ========================================
        class TGMarkdownEnhancer {
            constructor() {
                // WAP 页面使用 .message 作为内容选择器
                this.selectors = ['.message'];
                this.originalHtmlMap = new Map();
                this.processedNodes = new WeakSet();
            }

            init() {
                document.body.addEventListener('click', (e) => {
                    const btn = e.target.closest('.tgfc-md-copy');
                    if (btn) this.handleCopy(btn);
                });
            }

            // 检测 Markdown 特征
            shouldEnhance(text) {
                const hasCodeBlock = /```[\s\S]*?```/.test(text);
                const hasHeader = /^#{1,6}\s+/m.test(text);
                const hasInlineCode = /`[^`]+`/.test(text);
                const hasUnorderedList = /^[\s]*[-*+]\s+.+/m.test(text);
                const hasOrderedList = /^\s*\d+\.\s+.+\n\s*\d+\.\s+.+/m.test(text);
                const hasBoldOrItalic = /\*\*[^*]+\*\*/.test(text) || /(?<!\*)\*[^*]+\*(?!\*)/.test(text);
                const hasBlockquote = /^>\s*.+/m.test(text);
                const hasLink = /\[[^\]]+\]\([^)]+\)/.test(text);

                if (hasCodeBlock || hasHeader || hasInlineCode) return true;
                const weakFeatureCount = [hasUnorderedList, hasOrderedList, hasBoldOrItalic, hasBlockquote, hasLink].filter(Boolean).length;
                return weakFeatureCount >= 2;
            }

            cleanRawText(text) {
                if (!text) return '';
                text = text.replace(/\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);/g, '');
                return text.trim();
            }

            // 从 HTML 中提取文本，同时保留链接转换为 Markdown 格式
            extractTextWithLinks(element) {
                if (!element) return '';

                const result = [];
                const walk = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        result.push(node.textContent);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tag = node.tagName.toLowerCase();

                        if (tag === 'a' && node.href) {
                            const text = node.innerText.trim() || node.href;
                            const href = node.href;
                            result.push(`[${text}](${href})`);
                        } else if (tag === 'br') {
                            result.push('\n');
                        } else if (tag === 'img') {
                            const alt = node.alt || '';
                            const src = node.src || '';
                            if (src) result.push(`![${alt}](${src})`);
                        } else if (tag === 'script' || tag === 'style') {
                            // 跳过
                        } else {
                            for (const child of node.childNodes) {
                                walk(child);
                            }
                            if (['div', 'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                                result.push('\n');
                            }
                        }
                    }
                };

                walk(element);
                return result.join('');
            }

            markdownToHtml(md) {
                if (!md) return '';
                md = this.cleanRawText(md);
                md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                    let langAttr = lang ? `data-lang="${lang}"` : '';
                    return `<pre class="tgfc-md-code" ${langAttr}><code>${this.escapeHtml(code.trim())}</code><button class="tgfc-md-copy">复制</button></pre>`;
                });
                md = md.replace(/`([^`]+)`/g, '<code class="tgfc-inline">$1</code>');
                const headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                headers.forEach((tag, i) => {
                    const level = i + 1;
                    const regex = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
                    md = md.replace(regex, `<${tag}>$1</${tag}>`);
                });
                md = md.replace(/^---$/gm, '<hr class="tgfc-md-hr">');
                md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="tgfc-md-img">');
                md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
                md = md.replace(/\*\*([^*]+)\*\*/g, '<span class="tgfc-md-bold">$1</span>');
                md = md.replace(/\*([^*]+)\*/g, '<span class="tgfc-md-italic">$1</span>');
                md = md.replace(/^> ?(.+)$/gm, '<blockquote>$1</blockquote>');
                md = md.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="tgfc-md-li" style="list-style:decimal;" value="$1">$2</li>');
                md = md.replace(/^\s*[-*+] +(.+)$/gm, '<li class="tgfc-md-li">$1</li>');
                // 先将连续的换行符合并成一个，避免空行变成大间距
                md = md.replace(/\n{2,}/g, '\n');
                md = md.replace(/(?<!>)\n/g, '<br>');
                md = md.replace(/(<li class="tgfc-md-li" style="list-style:decimal;">[\s\S]*?<\/li>)+/gm, '<ol class="tgfc-md-ol">$&</ol>');
                md = md.replace(/(<li class="tgfc-md-li">[\s\S]*?<\/li>)+/gm, '<ul class="tgfc-md-ul">$&</ul>');
                return `<div class="tgfc-md-content">${md}</div>`;
            }

            escapeHtml(str) {
                return str.replace(/[&<>"]/g, (tag) => {
                    const charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
                    return charsToReplace[tag] || tag;
                });
            }

            handleCopy(btn) {
                let codeEl = btn.previousElementSibling;
                if (codeEl) {
                    let txt = codeEl.textContent;
                    const copyToClipboard = str => {
                        if (navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(str);
                        return Promise.reject('The Clipboard API is not available.');
                    };
                    const originalText = btn.innerText;
                    copyToClipboard(txt).then(() => {
                        btn.innerText = '已复制!';
                        setTimeout(() => btn.innerText = originalText, 1200);
                    }).catch(() => {
                        const el = document.createElement('textarea'); el.value = txt; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
                        btn.innerText = '已复制!';
                        setTimeout(() => btn.innerText = originalText, 1200);
                    });
                }
            }

            // 强制美化指定楼层内容（供手动按钮调用）
            forceEnhancePost(postNode) {
                if (!postNode) return false;

                if (!postNode.dataset.mdOriginalHtml) {
                    postNode.dataset.mdOriginalHtml = postNode.innerHTML;
                }
                postNode.dataset.mdEnhanced = 'true';

                let workNode = postNode.cloneNode(true);

                // 提取并保留所有引用块
                const quoteBlocks = [];
                const quoteElements = workNode.querySelectorAll('blockquote, .quote, [class*="quote"]');
                quoteElements.forEach((q, i) => {
                    const placeholder = `___QUOTE_PLACEHOLDER_${i}___`;
                    quoteBlocks.push({ placeholder, html: q.outerHTML });
                    q.outerHTML = placeholder;
                });

                let raw = this.cleanRawText(this.extractTextWithLinks(workNode));
                let newContentHtml = this.markdownToHtml(raw);

                quoteBlocks.forEach(({ placeholder, html }) => {
                    newContentHtml = newContentHtml.replace(placeholder, html);
                });

                postNode.innerHTML = newContentHtml;
                this.processedNodes.add(postNode);
                return true;
            }

            // 恢复原始内容
            restorePost(postNode) {
                if (!postNode) return false;
                const originalHtml = postNode.dataset.mdOriginalHtml;
                if (originalHtml) {
                    postNode.innerHTML = originalHtml;
                    delete postNode.dataset.mdEnhanced;
                    return true;
                }
                return false;
            }

            // 自动增强单个节点（检测并转换 markdown）
            enhanceNode(node) {
                if (this.processedNodes.has(node)) return;

                const contentHtml = node.innerHTML;
                const contentText = node.innerText || node.textContent || '';

                if (this.shouldEnhance(contentText)) {
                    // 存储原始 HTML 到节点，供 MD 按钮读取
                    node.dataset.mdOriginalHtml = node.innerHTML;
                    node.dataset.mdEnhanced = 'true';

                    // 创建工作副本
                    let workNode = node.cloneNode(true);

                    // 提取并保留所有引用块
                    const quoteBlocks = [];
                    const quoteElements = workNode.querySelectorAll('blockquote, .quote, [class*="quote"]');
                    quoteElements.forEach((q, i) => {
                        const placeholder = `___QUOTE_PLACEHOLDER_${i}___`;
                        quoteBlocks.push({ placeholder, html: q.outerHTML });
                        q.outerHTML = placeholder;
                    });

                    // 美化非引用部分
                    let raw = this.cleanRawText(this.extractTextWithLinks(workNode));
                    let newContentHtml = this.markdownToHtml(raw);

                    // 还原引用块
                    quoteBlocks.forEach(({ placeholder, html }) => {
                        newContentHtml = newContentHtml.replace(placeholder, html);
                    });

                    node.innerHTML = newContentHtml;
                    this.processedNodes.add(node);

                    // 同步更新对应的 MD 按钮状态
                    const mdBtn = document.querySelector(`.tgfc-md-btn[data-md-state="off"]`);
                    if (mdBtn) {
                        const contentNode = (() => {
                            // 对于顶楼主楼
                            if (node.classList.contains('message')) {
                                return node;
                            }
                            return null;
                        })();
                        if (contentNode === node) {
                            mdBtn.dataset.mdState = 'on';
                            mdBtn.classList.add('tgfc-md-btn-on');
                        }
                    }
                }
            }

            // 自动增强所有 .message 节点
            autoEnhanceAll() {
                const targets = document.querySelectorAll('.message');
                targets.forEach(node => {
                    if (!this.processedNodes.has(node) && !node.dataset.mdEnhanced) {
                        this.enhanceNode(node);
                    }
                });

                // 更新所有 MD 按钮状态
                document.querySelectorAll('.tgfc-md-btn').forEach(mdBtn => {
                    const container = mdBtn.closest('.infobar, .tgfc-op-infobar');
                    if (container) {
                        // 获取对应的内容区
                        const getContentNode = () => {
                            // 对于顶楼主楼
                            if (container.classList.contains('tgfc-op-infobar') || container.closest('p:has(> a[href*="viewpro"])')) {
                                return document.querySelector('.message');
                            }
                            // 对于回复楼层，找到下一个 .message
                            if (container.classList.contains('infobar')) {
                                let n = container.nextElementSibling;
                                while (n && !n.classList.contains('message')) {
                                    n = n.nextElementSibling;
                                }
                                return n;
                            }
                            return null;
                        };

                        const contentNode = getContentNode();
                        if (contentNode && contentNode.dataset.mdEnhanced === 'true') {
                            mdBtn.dataset.mdState = 'on';
                            mdBtn.classList.add('tgfc-md-btn-on');
                        }
                    }
                });
            }
        }

        // 创建全局 Markdown 增强器实例
        window.mdEnhancer = new TGMarkdownEnhancer();

        // --- 样式注入 (回归 0.0.12 纯真版布局) ---
        const css = `
        /* 信息栏：禁止换行，时间固定右侧 */
        .infobar {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
            line-height: normal !important;
            padding: 4px 6px !important;
            gap: 2px !important; /* 减小间距 */
        }
        /* 隐藏 "骚(0)" 评分链接 */
        a[href*="shiropika.rate"] {
            display: none !important;
        }

        /* 列表页标题：允许换行 */
        .dTitle {
            display: flex !important;
            align-items: center !important;
            flex-wrap: wrap;
            line-height: normal !important;
            padding: 4px 0 !important;
        }

        .infobar > *, .dTitle > * {
            margin-right: 0 !important;
            margin-left: 0 !important;
            vertical-align: middle !important;
            margin-bottom: 0 !important;
            line-height: 1 !important;
        }

        .infobar > * {
            flex-shrink: 0 !important;
        }

        /* 信息栏左侧内容区 - 可收缩 */
        .tgfc-infobar-left {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
            flex: 1 1 auto !important;
            min-width: 0 !important;
            overflow: hidden !important;
        }
        .tgfc-infobar-left > * {
            margin-right: 5px !important;
            flex-shrink: 0 !important;
        }
        /* 用户名链接可收缩省略 */
        .tgfc-infobar-left > a[href*="viewpro"],
        .tgfc-infobar-left > a[href*="uid="] {
            flex-shrink: 1 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            max-width: 120px !important;
        }

        /* 时间区 - 内容区右上角 */
        .tgfc-infobar-time {
            position: absolute !important;
            top: 5px !important;
            right: 8px !important;
            white-space: nowrap !important;
            color: #999 !important;
            font-size: 9px !important;
        }

        .tgfc-wap-tags, .tgfc-wap-tag-item, .tgfc-wap-ban-btn, .tgfc-wap-set-btn, .tgfc-wap-only-btn, .tgfc-op-badge, .tgfc-md-btn, .tgfc-report-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 1.3em !important;
            box-sizing: border-box !important;
            vertical-align: middle !important;
        }
        /* 隐藏空的标签容器 */
        .tgfc-wap-tags:empty {
            display: none !important;
        }

        .tgfc-wap-tag-item {
            padding: 0 4px !important; border-radius: 3px !important; font-size: 11px !important; font-weight: bold !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
        }

        .tgfc-wap-ban-btn {
            padding: 0 4px !important; font-size: 10px !important;
            color: #fff !important; background: #ff7675 !important; border-radius: 3px !important; cursor: pointer !important; text-decoration: none !important;
        }
        .tgfc-wap-set-btn {
            padding: 0 4px !important; font-size: 10px !important;
            color: #fff !important; background: #3498db !important; border-radius: 3px !important; cursor: pointer !important; text-decoration: none !important;
        }
        .tgfc-wap-only-btn {
            padding: 0 4px !important; font-size: 10px !important;
            color: #fff !important; background: #9b59b6 !important; border-radius: 3px !important; cursor: pointer !important; text-decoration: none !important;
        }

        .tgfc-op-badge {
            padding: 0 4px !important; background-color: #ff9800 !important; color: #fff !important;
            border-radius: 3px !important; font-size: 10px !important; font-weight: bold !important;
        }

        /* 自定义标签容器 */
        .tgfc-wap-tags {
            display: inline-flex !important;
            gap: 2px !important;
        }

        /* MD 按钮 */
        .tgfc-md-btn {
            padding: 0 3px !important; font-size: 10px !important;
            color: #fff !important; background: #888 !important; border-radius: 3px !important; cursor: pointer !important; text-decoration: none !important;
        }
        .tgfc-md-btn:hover {
            background: #666 !important;
        }
        .tgfc-md-btn.tgfc-md-btn-on {
            background: #3897ff !important;
        }
        .tgfc-md-btn.tgfc-md-btn-on:hover {
            background: #2a7fd9 !important;
        }

        /* 报告按钮 - 右对齐 */
        .tgfc-report-btn {
            padding: 0 3px !important; font-size: 10px !important;
            color: #fff !important; background: #e74c3c !important; border-radius: 3px !important; cursor: pointer !important; text-decoration: none !important;
            margin-left: auto !important; /* 推到信息条最右端 */
        }
        .tgfc-report-btn:hover {
            background: #c0392b !important;
        }

        /* 报告弹窗 */
        .tgfc-report-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .tgfc-report-modal {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 360px;
            overflow: hidden;
        }
        .tgfc-report-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        .tgfc-report-header h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
        .tgfc-report-close {
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .tgfc-report-close:hover {
            color: #333;
        }
        .tgfc-report-body {
            padding: 15px;
        }
        .tgfc-report-label {
            display: block;
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .tgfc-report-textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        }
        .tgfc-report-textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        .tgfc-report-footer {
            padding: 10px 15px 15px;
            text-align: center;
        }
        .tgfc-report-submit {
            background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
            color: #333;
            border: none;
            padding: 8px 30px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .tgfc-report-submit:hover {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        }
        .tgfc-report-submit:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .tgfc-report-msg {
            font-size: 12px;
            margin-top: 10px;
            text-align: center;
        }
        .tgfc-report-msg.success { color: #27ae60; }
        .tgfc-report-msg.error { color: #e74c3c; }

        .tgfc-wap-blocked-tip { 
            background:#f9f9f9 !important; color:#999 !important; text-align:center !important; 
            padding:5px 12px !important; font-size:12px !important; border-bottom:1px solid #CDCDCD !important;
            margin: 6px auto !important; width: fit-content !important; min-width: 220px !important;
            box-sizing: border-box !important; display: block !important; border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .tgfc-wap-blocked-tip b { color: #555; }
        .tgfc-wap-blocked-tip span { cursor:pointer; color:#3897ff; margin-left:10px; font-weight: bold; }

        #tgfc-wap-nav-settings {
            display: inline-block; background: #3498db; color: #fff !important;
            padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 6px; 
            text-decoration: none; font-weight: 400;
        }

        #tgfc-wap-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 320px; max-height: 85vh; z-index: 10002;
            background: #fff; border-radius: 10px; padding: 15px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.4); display: none; overflow: auto;
        }

        #tgfc-wap-panel textarea {
            width: 100%; height: 60px; margin: 10px 0 15px 0; padding: 12px;
            border: 1px solid #eee; border-radius: 10px; font-size: 13px; box-sizing: border-box;
            background: #fafafa;
        }

        .btn-group { display: flex; justify-content: space-between; gap: 10px; margin-top: 20px; }
        .btn-group button { flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
        .btn-save { background: #3498db; color: #fff; }
        .btn-close { background: #f1f3f5; color: #666; }

        /* 新设置面板样式 */
        .tg-tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 15px; }
        .tg-tab { flex: 1; padding: 10px; text-align: center; color: #666; cursor: pointer; border-bottom: 2px solid transparent; font-size:14px; }
        .tg-tab.active { color: #3498db; border-bottom-color: #3498db; font-weight: bold; }
        
        .tg-pane { display: none; }
        .tg-pane.active { display: block; }
        
        .tg-input-group { margin-bottom: 12px; }
        .tg-label { display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 13px; }
        .tg-input { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; background: #fafafa; }
        
        /* 用户列表项 */
        .tg-user-item { background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
        .tg-user-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .tg-user-name { font-weight: bold; color: #333; font-size: 14px; }
        .tg-btn-del { color: #ff6b6b; cursor: pointer; font-size: 12px; }
        
        .tg-row { display: flex; gap: 8px; align-items: center; margin-bottom: 5px; }
        .tg-col { flex: 1; }
        .tg-color-picker { width: 40px; height: 30px; border: none; padding: 0; background: none; cursor: pointer; }
        
        /* Tag 面板预设与恢复 */
        .tg-preset-row { display: flex; gap: 10px; margin: 10px 0; justify-content: space-around; background: #f1f2f6; padding: 8px; border-radius: 8px; }
        .tg-preset-btn { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); position: relative; }
        .tg-preset-btn:active { transform: scale(0.9); }
        .tg-btn-reset { font-size: 12px; color: #3498db; text-decoration: none; cursor: pointer; background: none; border: none; padding: 0; margin-top: 5px; display: inline-block; }
        
        .tg-btn-copy { background: #f1f3f5; border: 1px solid #ddd; padding: 3px 8px; border-radius: 4px; color: #666; font-size: 11px; cursor: pointer; }
        .tg-btn-copy:hover { background: #e9ecef; }

        /* === 快速链接下拉菜单 === */
        .tgfc-quick-dropdown {
            position: relative;
            display: inline-block;
            margin-left: 6px;
        }
        .tgfc-quick-btn {
            display: inline-block;
            background: #27ae60;
            color: #fff !important;
            padding: 0px 6px;
            border-radius: 3px;
            font-size: 11px;
            text-decoration: none !important;
            cursor: pointer;
            line-height: 16px;
            vertical-align: 1px;
        }
        .tgfc-quick-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            min-width: 100px;
            z-index: 9999;
            margin-top: 2px;
            padding: 4px 0;
        }
        .tgfc-quick-dropdown.open .tgfc-quick-menu {
            display: block;
        }
        .tgfc-quick-item {
            display: flex;
            align-items: center;
            padding: 4px 8px;
            border-bottom: 1px solid #f0f0f0;
        }
        .tgfc-quick-item:last-child {
            border-bottom: none;
        }
        .tgfc-quick-item a.link-name {
            flex: 1;
            color: #333 !important;
            text-decoration: none !important;
            font-size: 12px;
            white-space: nowrap;
        }
        .tgfc-quick-item:hover {
            background: #f8f8f8;
        }
        .tgfc-quick-item .item-btns {
            display: flex;
            gap: 4px;
            margin-left: 8px;
        }
        .tgfc-quick-item .item-btn {
            font-size: 10px;
            color: #999;
            cursor: pointer;
            padding: 2px;
        }
        .tgfc-quick-item .item-btn:hover {
            color: #333;
        }
        .tgfc-quick-item .item-btn.del:hover {
            color: #e74c3c;
        }
        .tgfc-quick-add {
            display: block;
            text-align: center;
            padding: 4px 8px;
            color: #27ae60 !important;
            font-size: 11px;
            cursor: pointer;
            text-decoration: none !important;
            border-top: 1px solid #eee;
            margin-top: 2px;
        }
        .tgfc-quick-add:hover {
            background: #f0fff0;
        }

        /* === WAP样式美化 === */
        
        /* 引用块美化 */
        .quote, blockquote {
            background: #f8f9fa !important;
            border-left: 3px solid #3498db !important;
            border-radius: 0 6px 6px 0 !important;
            padding: 10px 12px !important;
            margin: 8px 0 !important;
            color: #555 !important;
        }

        /* === 列表页美化 === */
        /* 帖子列表 - 控制不同标题之间的间距 */
        .dTitle, .fList {
            padding: 2px 5px !important;
            margin: 0 !important;
        }
        /* 标题链接 - 控制同标题换行时的行距 */
        .dTitle .title a, .dTitle > a {
            line-height: 1.1 !important;
        }
        /* 标题和分页链接保持在同一行流动 */
        .dTitle .title, .dTitle .paging {
            display: inline !important;
        }
        /* 分页链接不换行，紧跟标题，无下划线 */
        .dTitle .paging, .dTitle .title a.s2 {
            white-space: nowrap !important;
            text-decoration: none !important;
        }
        /* 分页链接样式 */
        .dTitle .title a.s2 {
            color: #666 !important;
            margin-left: 4px !important;
        }
        /* 作者信息区块另起一行 */
        .dTitle br {
            display: block !important;
        }
        
        /* 置顶区与主题区分隔 - 只用下边距 */
        .tgfc-sticky-end {
            margin-bottom: 10px !important;
        }
        
        /* === 内容页美化 === */
        
        /* 作者信息栏（红框位置）- 和楼层信息栏一样 */
        body > p:nth-of-type(2),
        p:has(> a[href*="viewpro"]):has(> .tgfc-op-badge) {
            border: 1px solid #ddd !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
            margin: 8px 5px 0 5px !important;
            padding: 6px 8px !important;
            background: #fafafa !important;
        }
        
        /* 楼层信息栏 */
        .infobar {
            border: 1px solid #ddd !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
            margin: 4px 5px 0 5px !important;
            padding: 6px 8px !important;
            background: #fafafa !important;
        }
        
        /* 内容区卡片 - 不覆盖背景色以保留Tag配色 */
        .message {
            border: 1px solid #ddd !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            margin: 0 5px 4px 5px !important;
            padding: 10px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
        }
        
        /* 底部回复表单区域 - 卡片式样式 */
        #postform {
            background: #fff !important;
            border: 1px solid #ddd !important;
            border-radius: 6px !important;
            margin: 8px 5px !important;
            padding: 10px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
        }
        #postform .textarea {
            width: 100% !important;
            box-sizing: border-box !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            padding: 6px !important;
            margin: 0 0 6px 0 !important;
        }
        /* 编辑/发帖页面标题输入框 - 与内容框宽度一致 */
        input[name="subject"],
        #postform input[name="subject"] {
            width: 100% !important;
            box-sizing: border-box !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            padding: 6px !important;
            margin: 5px 0 !important;
        }
        #postform .button {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
        }
        /* 版块跳转表单 */
        #gotofourmform {
            background: #fff !important;
            border: 1px solid #ddd !important;
            border-radius: 6px !important;
            margin: 8px 5px !important;
            padding: 4px 8px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
        }
        #gotofourmform div {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }
        #gotofourmform select, #gotofourmform .button {
            border-radius: 4px !important;
            padding: 3px 6px !important;
            margin: 0 !important;
        }
        
        /* 隐藏楼层间的 === 分隔线 */
        hr, .hr {
            display: none !important;
        }
        /* 隐藏纯分隔符文本和多余空白 */
        body > p:empty,
        p:only-child:not(:has(*)) {
            display: none !important;
        }
        /* 压缩内容页多余的 br 间距 */
        .message + br,
        .message + br + br,
        p + br + br + br {
            display: none !important;
        }

        /* === 弹窗面板蓝色主题 === */
        #tgfc-wap-panel, #tgfc-wap-user-panel, #tgfc-quick-editor {
            border: 2px solid #3498db !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.25) !important;
        }
        
        /* 面板标题栏 */
        #tgfc-wap-panel > div:first-child,
        #tgfc-wap-user-panel h3 {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
            color: #fff !important;
            margin: -15px -15px 10px -15px !important;
            padding: 10px 15px !important;
            border-radius: 8px 8px 0 0 !important;
        }
        #tgfc-wap-user-panel h3 {
            margin: -15px -15px 15px -15px !important;
        }

        /* === Markdown 样式 === */
        .tgfc-md-content { font-size: 15px !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #24292e; background: #ffffff !important; border-radius: 8px; padding: 15px 20px; margin: 12px auto; max-width: 96%; line-height: 1.45; border: 1px solid #e1e4e8; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .tgfc-md-content h1, .tgfc-md-content h2, .tgfc-md-content h3, .tgfc-md-content h4, .tgfc-md-content h5, .tgfc-md-content h6 { font-family: inherit; font-weight: 700; margin-top: 10px; margin-bottom: 6px; line-height: 1.3; padding: 5px 10px; border-radius: 4px; border-left-style: solid; color: #24292e; }
        .tgfc-md-content h1 { background: #2b6cb0; color: #ffffff; border-left-width: 6px; border-left-color: #1a365d; font-size: 1.3em; border-bottom: none; }
        .tgfc-md-content h2 { background: #4299e1; color: #ffffff; border-left-width: 5px; border-left-color: #2b6cb0; font-size: 1.2em; border-bottom: none; }
        .tgfc-md-content h3 { background: #ebf8ff; color: #2b6cb0; border-left-width: 4px; border-left-color: #4299e1; font-size: 1.15em; }
        .tgfc-md-content h4 { background: #f0fff4; color: #2f855a; border-left-width: 4px; border-left-color: #48bb78; font-size: 1.1em; }
        .tgfc-md-content h5 { background: #f7fafc; color: #4a5568; border-left-width: 3px; border-left-color: #cbd5e0; font-size: 1.05em; }
        .tgfc-md-content h6 { background: #fff; border: 1px solid #eee; border-left-width: 3px; border-left-color: #e2e8f0; font-size: 1.0em; color: #718096; }
        .tgfc-md-content p { margin-bottom: 4px; }
        .tgfc-md-content blockquote { border-left: 4px solid #dfe2e5; margin: 0 0 6px 0; padding: 0 1em; color: #6a737d; }
        .tgfc-md-content ul, .tgfc-md-content ol { padding-left: 2em; margin-bottom: 6px; }
        .tgfc-md-content li { margin-bottom: 4px; }
        .tgfc-md-content hr.tgfc-md-hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; }
        .tgfc-md-content img.tgfc-md-img { max-width: 100%; box-sizing: content-box; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .tgfc-md-code { position: relative; background: #f6f8fa; border-radius: 6px; font-size: 85%; line-height: 1.45; padding: 16px; margin-bottom: 16px; overflow: auto; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
        .tgfc-md-code .tgfc-md-copy { position: absolute; top: 8px; right: 8px; font-size: 12px; background: rgba(255,255,255,0.8); color: #24292e; border: 1px solid rgba(27,31,35,0.15); border-radius: 4px; padding: 3px 8px; cursor: pointer; transition: all 0.2s; opacity: 0; }
        .tgfc-md-code:hover .tgfc-md-copy { opacity: 1; }
        .tgfc-md-code .tgfc-md-copy:hover { background: #fff; }

        .tgfc-md-content a { color: #0366d6; text-decoration: none; }
        .tgfc-md-content a:hover { text-decoration: underline; }
        .tgfc-md-bold { font-weight: 600; }
        .tgfc-md-italic { font-style: italic; }

        /* === 十大话题面板 === */
        .tgfc-wap-top10-panel { margin: 8px 5px; border: 1px solid #ddd; border-radius: 6px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
        .tgfc-wap-top10-header { display: flex; align-items: center; justify-content: center; padding: 2px 8px; background: linear-gradient(135deg, #3498db, #2980b9); color: #fff !important; cursor: pointer; user-select: none; position: relative; }
        .tgfc-wap-top10-header:hover { background: linear-gradient(135deg, #2980b9, #1f6dad); }
        .tgfc-wap-top10-title { font-size: 12px; font-weight: 600; color: #fff !important; }
        .tgfc-wap-top10-right { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 4px; }
        .tgfc-wap-top10-tabs { display: flex; align-items: center; gap: 2px; }
        .tgfc-wap-top10-tab { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fff !important; padding: 1px 4px; border-radius: 3px; cursor: pointer; font-size: 10px; font-weight: 500; }
        .tgfc-wap-top10-tab:hover { background: rgba(255,255,255,0.25); }
        .tgfc-wap-top10-tab.active { background: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.8); font-weight: 600; }
        .tgfc-wap-top10-status { font-size: 9px; color: #fff !important; }
        .tgfc-wap-top10-refresh { background: transparent; border: none; color: #fff !important; width: 20px; height: 20px; cursor: pointer; font-size: 12px; padding: 0; }
        .tgfc-wap-top10-refresh:hover { opacity: 0.8; }
        .tgfc-wap-top10-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .tgfc-wap-top10-body.expanded { max-height: 400px; overflow-y: auto; }
        .tgfc-wap-top10-list { list-style: none; margin: 0; padding: 0; }
        .tgfc-wap-top10-list li { display: flex; align-items: center; padding: 6px 10px; border-bottom: 1px solid #f0f0f0; }
        .tgfc-wap-top10-list li:last-child { border-bottom: none; }
        .tgfc-wap-top10-list li:hover { background: #fffbf0; }
        .tgfc-wap-top10-rank { min-width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; font-size: 10px; font-weight: 600; margin-right: 6px; }
        .tgfc-wap-top10-rank.gold { background: linear-gradient(135deg, #ffd700, #ffb300); color: #7a5c00; }
        .tgfc-wap-top10-rank.silver { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #444; }
        .tgfc-wap-top10-rank.bronze { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }
        .tgfc-wap-top10-rank.normal { background: #f0f0f0; color: #666; }
        .tgfc-wap-top10-link { flex: 1; color: #333; text-decoration: none; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tgfc-wap-top10-link:visited { color: #888; }
        .tgfc-wap-top10-link:hover { color: #e74c3c; }
        .tgfc-wap-top10-replies { font-size: 10px; color: #e74c3c; font-weight: 600; margin-left: 6px; white-space: nowrap; }
        .tgfc-wap-top10-author { font-size: 10px; color: #888; margin-left: 6px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tgfc-wap-top10-empty { padding: 12px; text-align: center; color: #999; font-size: 11px; }
        .tgfc-wap-top10-loading { padding: 10px; text-align: center; font-size: 11px; color: #666; }

        /* === 关注话题面板 === */
        .tgfc-wap-followed-panel { margin: 8px 5px; border: 1px solid #ddd; border-radius: 6px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
        .tgfc-wap-followed-header { display: flex; align-items: center; justify-content: center; padding: 2px 8px; background: linear-gradient(135deg, #2ecc71, #27ae60); color: #fff !important; cursor: pointer; user-select: none; }
        .tgfc-wap-followed-header:hover { background: linear-gradient(135deg, #27ae60, #1e8449); }
        .tgfc-wap-followed-title { font-size: 12px; font-weight: 600; color: #fff !important; }
        .tgfc-wap-followed-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .tgfc-wap-followed-body.expanded { max-height: 300px; overflow-y: auto; }
        .tgfc-wap-followed-list { list-style: none; margin: 0; padding: 0; }
        .tgfc-wap-followed-list li { display: flex; align-items: center; padding: 5px 10px; border-bottom: 1px solid #f0f0f0; }
        .tgfc-wap-followed-list li:last-child { border-bottom: none; }
        .tgfc-wap-followed-list li:hover { background: #fffbf0; }
        .tgfc-wap-followed-rank { min-width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; font-size: 10px; font-weight: 600; margin-right: 6px; background: #f0f0f0; color: #666; }
        .tgfc-wap-followed-link { flex: 1; color: #0077cc; font-weight: bold; text-decoration: none; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tgfc-wap-followed-link:visited { color: #888; }
        .tgfc-wap-followed-link:hover { color: #e74c3c; }
        .tgfc-wap-followed-author { font-size: 10px; color: #666; margin-left: 6px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tgfc-wap-followed-unfollow { font-size: 12px; color: #ccc; margin-left: 6px; cursor: pointer; padding: 2px 4px; }
        .tgfc-wap-followed-unfollow:hover { color: #e74c3c; }
        .tgfc-wap-followed-date { font-size: 10px; color: #999; margin-left: 4px; white-space: nowrap; }

        /* === 关注按钮（内容页） === */
        .tgfc-wap-follow-btn { display: inline-block; font-size: 11px; font-weight: bold; padding: 1px 6px; cursor: pointer; margin-left: 6px; border-radius: 3px; border: 1px solid #2196F3; background: #2196F3; color: #fff; vertical-align: middle; position: relative; top: -1px; }
        .tgfc-wap-follow-btn:hover { background: #1976D2; border-color: #1976D2; }
        .tgfc-wap-follow-btn.followed { background: #999; border-color: #999; color: #fff; }
        .tgfc-wap-follow-btn.followed:hover { background: #777; border-color: #777; }
    `;

        // --- 核心逻辑 ---

        // 单独用户配置弹窗 (预设 & 恢复默认)
        function showUserConfig(uid) {
            // 点击外部关闭 - 创建遮罩层
            let overlay = document.getElementById('tgfc-wap-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'tgfc-wap-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:10001;display:none;';
                overlay.onclick = () => {
                    overlay.style.display = 'none';
                    document.getElementById('tgfc-wap-user-panel').style.display = 'none';
                };
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'block';

            let p = document.getElementById('tgfc-wap-user-panel');
            if (!p) {
                p = document.createElement('div');
                p.id = 'tgfc-wap-user-panel';
                p.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:340px;z-index:10002;background:#fff;border-radius:10px;padding:15px;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:none;';
                document.body.appendChild(p);
            }

            // 修复变量丢失 (cfg, u)
            const cfg = getConfig();
            const u = (cfg.highlighted && cfg.highlighted[uid]) ? cfg.highlighted[uid] : { tags: [], bg: '', color: '' };

            // 移植 Diff 面板全套预设 (按分类分组)
            const presets = [
                // 艺术系
                { title: '深蓝金', bg: '#1a237e', color: '#ffeb3b', cat: '艺术' },
                { title: '胭脂红', bg: '#b71c1c', color: '#fff8e1', cat: '艺术' },
                { title: '丹霞金', bg: '#db4d43', color: '#ddd736', cat: '艺术' },
                // 自然系
                { title: '信笺麻', bg: '#d5d5aa', color: '#2b1e43', cat: '自然' },
                { title: '薄荷绿', bg: '#e8f5e9', color: '#2e7d32', cat: '自然' },
                { title: '烟紫灰', bg: '#e0d6d1', color: '#5f4e57', cat: '自然' },
                // 活力系
                { title: '炽焰橙', bg: '#ff6f00', color: '#1a1a1a', cat: '活力' },
                { title: '暖阳米', bg: '#fdf6e3', color: '#586e75', cat: '活力' },
                { title: '极客蓝', bg: '#f0f5ff', color: '#2f54eb', cat: '活力' },
                // 标记系
                { title: '警示红', bg: '#fff1f0', color: '#cf1322', cat: '标记' },
                { title: '荧光黄', bg: '#ffff00', color: '#000000', cat: '标记' },
                { title: '焦点黄', bg: '#fffde7', color: '#f57f17', cat: '标记' },
                // 暗色系
                { title: '复古暗', bg: '#303030', color: '#e0e0e0', cat: '暗色' },
                { title: '深海蓝', bg: '#1a3a4a', color: '#7dd3e8', cat: '暗色' },
                { title: '酒红暗', bg: '#4a2030', color: '#e8b4c4', cat: '暗色' }
            ];

            const cats = ['艺术', '自然', '活力', '标记', '暗色'];
            // 读取自定义预设 
            const customPresets = cfg.customPresets || [];

            p.innerHTML = `
            <h3 style="text-align:center;margin:0 0 15px 0">Tag: ${uid}</h3>
            <div class="tg-input-group">
                <label class="tg-label">标签 (逗号分隔)</label>
                <input id="tg-u-tags" class="tg-input" value="${(u.tags || []).join(', ')}">
            </div>
            
            <div style="display:flex; gap:5px; align-items:flex-start; margin-top:10px">
                <!-- 左列：官方预设 -->
                <div style="width:145px">
                    <label class="tg-label" style="display:block;margin-bottom:5px">官方预设</label>
                    <div style="border:1px solid #eee;padding:5px;border-radius:4px;height:185px;overflow-y:auto;box-sizing:border-box">
                        ${cats.map(cat => `
                            <div style="display:flex; gap:4px; margin-bottom:5px; align-items:center">
                                <span style="font-size:10px;color:#999;width:22px;text-align:right">${cat}</span>
                                ${presets.filter(p => p.cat === cat).map(ps =>
                `<div class="tg-preset-btn" style="background:${ps.bg}" data-bg="${ps.bg}" data-color="${ps.color}" title="${ps.title}"></div>`
            ).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 中列：我的配色 -->
                <div style="flex:1">
                    <label class="tg-label" style="display:block;margin-bottom:5px;text-align:center">我的配色</label>
                    <div style="border:1px solid #eee; border-radius:4px; padding:5px; height:185px; overflow-y:auto; box-sizing:border-box; display:flex; flex-direction:column; align-items:center">
                        <div style="flex:1; width:100%; display:flex; flex-wrap:wrap; gap:5px; justify-content:center; align-content:flex-start" id="tg-custom-preset-container">
                            ${customPresets.map((ps, idx) =>
                `<div class="tg-preset-btn tg-custom-btn" data-idx="${idx}" data-bg="${ps.bg}" data-color="${ps.color}" title="${ps.name || '自定义' + (idx + 1)} (长按删除)" style="background:${ps.bg}"></div>`
            ).join('')}
                        </div>
                        ${customPresets.length > 0 ? '<button id="tg-clear-presets" style="font-size:10px; color:red; background:none; border:none; margin-top:2px; width:100%">清空</button>' : ''}
                    </div>
                </div>

                <!-- 右列：控制 -->
                <div style="width:85px; display:flex; flex-direction:column; gap:8px">
                <div>
                        <label style="font-size:11px;display:block;margin-bottom:2px">背景色</label>
                        <input type="color" id="tg-u-bg" class="tg-color-picker" style="width:100%;height:35px;padding:0;border:1px solid #ddd;cursor:pointer" value="${u.bg || '#f0f0f0'}">
                    </div>
                    <div>
                        <label style="font-size:11px;display:block;margin-bottom:2px">文字色</label>
                        <input type="color" id="tg-u-fg" class="tg-color-picker" style="width:100%;height:35px;padding:0;border:1px solid #ddd;cursor:pointer" value="${u.color || '#000000'}">
                    </div>
                    <div style="margin-top:2px; border-top:1px solid #eee; padding-top:5px; display:flex; flex-direction:column; gap:6px">
                        <button id="tg-add-preset" style="text-align:left; color:#27ae60; background:none; border:none; cursor:pointer; font-size:12px; padding:0; font-weight:bold">+ 保存配色</button>
                        <button id="tg-u-reset" class="tg-btn-reset" style="text-align:left; color:#3498db; margin:0">↺ 恢复默认</button>
                        <button id="tg-u-delete" style="text-align:left; color:#ff6b6b; background:none; border:none; cursor:pointer; font-size:12px; padding:0">🗑️ 删除配置</button>
                    </div>
                </div>
            </div>
            
            <button id="tg-u-save" class="tg-btn-save" style="width:100%;margin-top:15px;background:#3498db;color:white;border:none;padding:10px;border-radius:5px;font-size:14px;">保存设置</button>
`;

            // 绑定预设点击 (官方 & 自定义)
            p.querySelectorAll('.tg-preset-btn').forEach(btn => btn.onclick = () => {
                document.getElementById('tg-u-bg').value = btn.dataset.bg;
                document.getElementById('tg-u-fg').value = btn.dataset.color;
            });

            // 长按删除自定义配色 
            p.querySelectorAll('.tg-custom-btn').forEach(btn => {
                let timer = null;
                const startLongPress = () => {
                    timer = setTimeout(() => {
                        const idx = parseInt(btn.dataset.idx, 10);
                        const c = getConfig();
                        const presetName = c.customPresets[idx]?.name || '自定义' + (idx + 1);
                        if (confirm('删除配色【' + presetName + '】？')) {
                            c.customPresets.splice(idx, 1);
                            saveConfig(c);
                            showUserConfig(uid);
                        }
                    }, 500); // 500ms 长按
                };
                const cancelLongPress = () => { if (timer) clearTimeout(timer); };
                btn.onmousedown = btn.ontouchstart = startLongPress;
                btn.onmouseup = btn.onmouseleave = btn.ontouchend = btn.ontouchcancel = cancelLongPress;
            });

            // 保存配色 (带自定义名称)
            document.getElementById('tg-add-preset').onclick = () => {
                const bg = document.getElementById('tg-u-bg').value;
                const fg = document.getElementById('tg-u-fg').value;

                // 弹出输入框获取名称
                const name = prompt('请为这个配色命名（可留空）：', '');
                if (name === null) return; // 用户取消

                const currentCfg = getConfig();
                if (!currentCfg.customPresets) currentCfg.customPresets = [];

                // 查重
                if (!currentCfg.customPresets.some(p => p.bg === bg && p.color === fg)) {
                    currentCfg.customPresets.push({ bg: bg, color: fg, name: name.trim() || ('自定义' + (currentCfg.customPresets.length + 1)) });
                    saveConfig(currentCfg);
                    alert('配色已保存！');
                    showUserConfig(uid);
                } else {
                    alert('该配色已存在！');
                }
            };

            // 清空自定义
            const clearBtn = document.getElementById('tg-clear-presets');
            if (clearBtn) {
                clearBtn.onclick = () => {
                    if (confirm('清空所有自定义配色？')) {
                        const c = getConfig();
                        c.customPresets = [];
                        saveConfig(c);
                        showUserConfig(uid);
                    }
                };
            }

            // 绑定恢复默认 (参考 Diff 面板: #f0f0f0)
            document.getElementById('tg-u-reset').onclick = () => {
                document.getElementById('tg-u-bg').value = '#f0f0f0';
                document.getElementById('tg-u-fg').value = '#000000';
            };

            // 绑定删除
            document.getElementById('tg-u-delete').onclick = () => {
                if (confirm('确定要删除该用户的所有配置（标签和配色）吗？')) {
                    let c = getConfig();
                    if (c.highlighted && c.highlighted[uid]) {
                        delete c.highlighted[uid];
                        saveConfig(c);
                        location.reload();
                    } else {
                        document.getElementById('tgfc-wap-user-panel').style.display = 'none';
                    }
                }
            };

            document.getElementById('tg-u-save').onclick = () => {
                const newTags = document.getElementById('tg-u-tags').value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
                const newBg = document.getElementById('tg-u-bg').value;
                const newFg = document.getElementById('tg-u-fg').value;

                let c = getConfig();
                if (!c.highlighted) c.highlighted = {};

                // 只有当显式点击删除时才删除，这里只要保存就视为有效配置
                // 除非全空且颜色是默认白黑(可能是误操作?)，但现在有了删除按钮，我们可以更激进地保存
                // 为了防止垃圾数据，如果 tag 为空 且 颜色为 #ffffff/#000000 (浏览器默认初始值)，则不保存?
                // 但如果用户手动选了 #ffffff 呢？
                // 既然提供了删除按钮，这里就只负责 update/insert

                c.highlighted[uid] = { tags: newTags, bg: newBg, color: newFg };
                saveConfig(c);
                location.reload();
            };

            p.style.display = 'block';
        }

        function applyBadges(container, authorLink, authorName, opName, cfg) {
            if (!authorLink || !authorName || authorLink.dataset.tgfcProcessed) return;

            // 1. 屏蔽按钮 (最左侧)
            if (!container.querySelector('.tgfc-wap-ban-btn')) {
                const b = document.createElement('a');
                b.className = 'tgfc-wap-ban-btn';
                b.textContent = '屏蔽';
                b.onclick = (e) => {
                    e.preventDefault();
                    if (confirm(`屏蔽 ${authorName}？`)) {
                        const c = getConfig();
                        if (!c.blocked.includes(authorName)) c.blocked.push(authorName);
                        saveConfig(c);
                        location.reload();
                    }
                };
                authorLink.parentNode.insertBefore(b, authorLink);
            }

            // 顺序控制铆点
            let anchor = authorLink.nextSibling;

            // 1.5. "只看" 按钮 (ID 右侧, Tag 左侧)
            // 解析 UID
            let uid = null;
            if (authorLink.href) {
                const uidMatch = authorLink.href.match(/uid=(\d+)/);
                if (uidMatch) uid = uidMatch[1];
                else if (authorLink.href.includes('viewpro')) {
                    // 尝试从 viewpro 链接提取 (HTML结构通常是 index.php?action=viewpro&uid=xxx)
                    const u = new URL(authorLink.href, location.href);
                    uid = u.searchParams.get('uid');
                }
            }

            if (uid && !container.querySelector('.tgfc-wap-only-btn')) {
                const onlyBtn = document.createElement('a');
                onlyBtn.className = 'tgfc-wap-only-btn';
                onlyBtn.textContent = '只看';

                // 构建 URL
                // 基础: same action (thread), same tid
                // 附加: authorid=uid
                // 继承/合并: 用户设置的 urlParams (vt, tp, pp 等)
                const currentUrl = new URL(location.href);
                const currentTid = currentUrl.searchParams.get('tid') || getThreadId();

                if (currentTid) {
                    const targetUrl = new URL(currentUrl.origin + currentUrl.pathname);
                    targetUrl.searchParams.set('action', 'thread');
                    targetUrl.searchParams.set('tid', currentTid);
                    targetUrl.searchParams.set('authorid', uid);

                    // 合并用户配置参数
                    const userParams = cfg.urlParams || {};
                    Object.keys(userParams).forEach(k => {
                        if (userParams[k]) targetUrl.searchParams.set(k, userParams[k]);
                    });
                    // 特殊处理 iam 数组
                    if (Array.isArray(userParams.iam) && userParams.iam.length > 0) {
                        targetUrl.searchParams.set('iam', userParams.iam.join(','));
                    }

                    onlyBtn.href = targetUrl.toString();

                    authorLink.parentNode.insertBefore(onlyBtn, anchor);
                    anchor = onlyBtn.nextElementSibling || onlyBtn.nextSibling;
                }
            }

            // 设置按钮 (ID 右侧)
            if (!container.querySelector('.tgfc-wap-set-btn')) {
                const s = document.createElement('a');
                s.className = 'tgfc-wap-set-btn';
                s.textContent = 'Tag';
                s.onclick = (e) => { e.preventDefault(); showUserConfig(authorName); };
                authorLink.parentNode.insertBefore(s, anchor);
                // 使用 nextElementSibling 跳过空白文本节点
                anchor = s.nextElementSibling || s.nextSibling; // 更新锚点，确保后续 badge 在此之后
            }

            // 2. 楼主标识 (ID 右侧)
            if (opName && authorName === opName && !container.querySelector('.tgfc-op-badge')) {
                const badge = document.createElement('span');
                badge.className = 'tgfc-op-badge';
                badge.textContent = '楼主';
                authorLink.parentNode.insertBefore(badge, anchor);
                // 使用 nextElementSibling 跳过空白文本节点
                anchor = badge.nextElementSibling || badge.nextSibling;
            }

            // 3. 用户标签
            const h = cfg.highlighted[authorName];
            if (h && (h.tag || h.tags) && !container.querySelector('.tgfc-wap-tags')) {
                const ts = h.tags || [h.tag];
                const wrap = document.createElement('span');
                wrap.className = 'tgfc-wap-tags';
                ts.forEach(t => {
                    const s = document.createElement('span');
                    s.className = 'tgfc-wap-tag-item';
                    s.textContent = t;
                    // 解耦 Tag 颜色，不再跟随楼层配色 (h.bg/h.color)
                    // 默认使用浅灰背景，黑字
                    s.style.background = h.userBg || '#f0f0f0';
                    s.style.color = h.userColor || '#333';
                    s.style.border = '1px solid #ddd'; // 增加边框以区分
                    wrap.appendChild(s);
                });
                authorLink.parentNode.insertBefore(wrap, anchor);
                // 使用 nextElementSibling 跳过空白文本节点
                anchor = wrap.nextElementSibling || wrap.nextSibling;
            }

            // 4. MD 按钮 (仅内容页添加)
            if (location.href.includes('action=thread') && !container.querySelector('.tgfc-md-btn')) {
                const mdBtn = document.createElement('a');
                mdBtn.href = 'javascript:;';
                mdBtn.className = 'tgfc-md-btn';
                mdBtn.textContent = 'MD';
                mdBtn.dataset.mdState = 'off';

                // 获取对应的内容区
                const getContentNode = () => {
                    // 对于顶楼主楼
                    if (container.classList.contains('tgfc-op-infobar') || container.closest('p:has(> a[href*="viewpro"])')) {
                        return document.querySelector('.message');
                    }
                    // 对于回复楼层，找到下一个 .message
                    if (container.classList.contains('infobar')) {
                        let n = container.nextElementSibling;
                        while (n && !n.classList.contains('message')) {
                            n = n.nextElementSibling;
                        }
                        return n;
                    }
                    return null;
                };

                // 检查当前状态并设置按钮样式
                const updateMdBtnState = () => {
                    const contentNode = getContentNode();
                    if (contentNode && contentNode.dataset.mdEnhanced === 'true') {
                        mdBtn.dataset.mdState = 'on';
                        mdBtn.classList.add('tgfc-md-btn-on');
                    } else {
                        mdBtn.dataset.mdState = 'off';
                        mdBtn.classList.remove('tgfc-md-btn-on');
                    }
                };

                // 初始化按钮状态
                updateMdBtnState();

                // 点击事件
                mdBtn.onclick = (e) => {
                    e.preventDefault();
                    const contentNode = getContentNode();
                    if (!contentNode || !window.mdEnhancer) return;

                    if (mdBtn.dataset.mdState === 'off') {
                        // 执行美化
                        const success = window.mdEnhancer.forceEnhancePost(contentNode);
                        if (success) {
                            mdBtn.dataset.mdState = 'on';
                            mdBtn.classList.add('tgfc-md-btn-on');
                        }
                    } else {
                        // 恢复原始内容
                        const success = window.mdEnhancer.restorePost(contentNode);
                        if (success) {
                            mdBtn.dataset.mdState = 'off';
                            mdBtn.classList.remove('tgfc-md-btn-on');
                        }
                    }
                };

                // 找到正确的插入位置：在最后一个已创建的按钮/标签之后
                let insertAfter = null;
                const opBadge = container.querySelector('.tgfc-op-badge');
                const tagsWrap = container.querySelector('.tgfc-wap-tags');
                const setBtn = container.querySelector('.tgfc-wap-set-btn');

                if (tagsWrap && tagsWrap.parentNode === authorLink.parentNode) {
                    insertAfter = tagsWrap;
                } else if (opBadge && opBadge.parentNode === authorLink.parentNode) {
                    insertAfter = opBadge;
                } else if (setBtn && setBtn.parentNode === authorLink.parentNode) {
                    insertAfter = setBtn;
                }

                if (insertAfter && insertAfter.nextSibling) {
                    authorLink.parentNode.insertBefore(mdBtn, insertAfter.nextSibling);
                } else {
                    authorLink.parentNode.appendChild(mdBtn);
                }
            }

            // 5. 报告按钮 (仅内容页添加，放在MD按钮之后)
            if (location.href.includes('action=thread') && !container.querySelector('.tgfc-report-btn')) {
                // 获取当前楼层的 pid（从楼层号链接中提取）
                const floorLink = container.querySelector('a[href*="pid="]');
                if (floorLink) {
                    const pidMatch = floorLink.href.match(/pid=(\d+)/);
                    if (pidMatch) {
                        const pid = pidMatch[1];
                        const tid = getThreadId();
                        const currentUrl = new URL(location.href);
                        const page = currentUrl.searchParams.get('page') || '1';

                        // 获取 fid（从面包屑导航中提取）
                        let fid = null;
                        const breadcrumbLinks = document.querySelectorAll('a[href*="action=forum"][href*="fid="]');
                        breadcrumbLinks.forEach(link => {
                            const fidMatch = link.href.match(/fid=(\d+)/);
                            if (fidMatch) fid = fidMatch[1];
                        });

                        if (tid && fid) {
                            const reportBtn = document.createElement('a');
                            reportBtn.className = 'tgfc-report-btn';
                            reportBtn.textContent = '报';
                            reportBtn.href = 'javascript:;';
                            reportBtn.title = '举报此楼';

                            // 缓存参数
                            const reportParams = { fid, tid, pid, page };

                            reportBtn.onclick = (e) => {
                                e.preventDefault();

                                // 创建模态弹窗
                                const overlay = document.createElement('div');
                                overlay.className = 'tgfc-report-overlay';
                                overlay.innerHTML = `
                                    <div class="tgfc-report-modal">
                                        <div class="tgfc-report-header">
                                            <h4>报告</h4>
                                            <button class="tgfc-report-close">×</button>
                                        </div>
                                        <div class="tgfc-report-body">
                                            <label class="tgfc-report-label">我的意见</label>
                                            <textarea class="tgfc-report-textarea" placeholder="请输入举报理由..."></textarea>
                                        </div>
                                        <div class="tgfc-report-footer">
                                            <button class="tgfc-report-submit">报告</button>
                                            <div class="tgfc-report-msg"></div>
                                        </div>
                                    </div>
                                `;
                                document.body.appendChild(overlay);

                                const textarea = overlay.querySelector('.tgfc-report-textarea');
                                const submitBtn = overlay.querySelector('.tgfc-report-submit');
                                const msgDiv = overlay.querySelector('.tgfc-report-msg');

                                // 关闭弹窗事件
                                const closeModal = () => overlay.remove();
                                overlay.querySelector('.tgfc-report-close').onclick = closeModal;
                                overlay.onclick = (evt) => {
                                    if (evt.target === overlay) closeModal();
                                };

                                // 提交报告
                                submitBtn.onclick = () => {
                                    const reason = textarea.value.trim() || '我对这个帖子有异议，特向您报告';
                                    submitBtn.disabled = true;
                                    submitBtn.textContent = '提交中...';
                                    msgDiv.textContent = '';

                                    // 先获取formhash
                                    const reportPageUrl = `https://s.tgfcer.com/misc.php?action=report&fid=${reportParams.fid}&tid=${reportParams.tid}&pid=${reportParams.pid}&page=${reportParams.page}`;

                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: reportPageUrl,
                                        onload: function (res) {
                                            // 提取formhash
                                            const formhashMatch = res.responseText.match(/name="formhash"\s+value="([^"]+)"/);
                                            if (!formhashMatch) {
                                                msgDiv.className = 'tgfc-report-msg error';
                                                msgDiv.textContent = '获取表单失败，请重试';
                                                submitBtn.disabled = false;
                                                submitBtn.textContent = '报告';
                                                return;
                                            }
                                            const formhash = formhashMatch[1];

                                            // 提交报告
                                            const postData = `formhash=${formhash}&to%5B3%5D=yes&reason=${encodeURIComponent(reason)}&tid=${reportParams.tid}&fid=${reportParams.fid}&pid=${reportParams.pid}&page=${reportParams.page}&reportsubmit=true`;

                                            GM_xmlhttpRequest({
                                                method: 'POST',
                                                url: 'https://s.tgfcer.com/misc.php?action=report&inajax=1&reportsubmit=yes',
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded'
                                                },
                                                data: postData,
                                                onload: function (postRes) {
                                                    if (postRes.responseText.includes('报告已经提交') || postRes.responseText.includes('succeed') || postRes.status === 200) {
                                                        msgDiv.className = 'tgfc-report-msg success';
                                                        msgDiv.textContent = '报告已提交！';
                                                        submitBtn.textContent = '完成';
                                                        setTimeout(closeModal, 1500);
                                                    } else {
                                                        msgDiv.className = 'tgfc-report-msg error';
                                                        msgDiv.textContent = '提交失败，请重试';
                                                        submitBtn.disabled = false;
                                                        submitBtn.textContent = '报告';
                                                    }
                                                },
                                                onerror: function () {
                                                    msgDiv.className = 'tgfc-report-msg error';
                                                    msgDiv.textContent = '网络错误，请重试';
                                                    submitBtn.disabled = false;
                                                    submitBtn.textContent = '报告';
                                                }
                                            });
                                        },
                                        onerror: function () {
                                            msgDiv.className = 'tgfc-report-msg error';
                                            msgDiv.textContent = '网络错误，请重试';
                                            submitBtn.disabled = false;
                                            submitBtn.textContent = '报告';
                                        }
                                    });
                                };
                            };

                            // 插入到MD按钮之后（信息条末尾）
                            const mdBtn = container.querySelector('.tgfc-md-btn');
                            if (mdBtn && mdBtn.nextSibling) {
                                authorLink.parentNode.insertBefore(reportBtn, mdBtn.nextSibling);
                            } else if (mdBtn) {
                                authorLink.parentNode.appendChild(reportBtn);
                            } else {
                                // 如果没有MD按钮，直接追加到末尾
                                authorLink.parentNode.appendChild(reportBtn);
                            }
                        }
                    }
                }
            }

            authorLink.dataset.tgfcProcessed = '1';
        }

        function process() {
            const cfg = getConfig();
            let op = getThreadOP();

            // 统一创建带 [展开] 和 [解禁] 的提示条 
            function createBlockedTip(anchorNode, author, elements, floor = '', reason = null) {
                // 如果关闭提示，则完全隐藏不创建提示条
                if (!cfg.showBlockTip) return;

                // 严防重复创建
                let check = anchorNode.previousElementSibling;
                for (let i = 0; i < 3 && check; i++) {
                    if (check.classList.contains('tgfc-wap-blocked-tip')) return;
                    check = check.previousElementSibling;
                }

                const tip = document.createElement('div');
                tip.className = 'tgfc-wap-blocked-tip';
                const floorLabel = floor ? `<b style="color:#666">${floor}</b> ` : '';

                if (reason) {
                    // 关键词屏蔽模式
                    tip.innerHTML = `${floorLabel} 已屏蔽内容: <b>${reason}</b> <span class="tg-toggle">[展开]</span>`;
                } else {
                    // 用户屏蔽模式
                    tip.innerHTML = `${floorLabel} 已屏蔽用户: <b>${author}</b> <span class="tg-toggle">[展开]</span><span class="tg-unban">[解禁]</span>`;
                }

                const toggle = tip.querySelector('.tg-toggle');
                toggle.onclick = (e) => {
                    e.preventDefault();
                    const isHidden = elements[0].style.display === 'none';
                    elements.forEach(el => {
                        if (isHidden) el.style.setProperty('display', '', 'important');
                        else el.style.setProperty('display', 'none', 'important');
                    });
                    toggle.textContent = isHidden ? '[收起]' : '[展开]';
                };

                const unban = tip.querySelector('.tg-unban');
                if (unban) {
                    unban.onclick = (e) => {
                        e.preventDefault();
                        if (confirm(`确定要从黑名单移除 ${author} 吗？`)) {
                            const c = getConfig();
                            c.blocked = c.blocked.filter(u => u !== author);
                            saveConfig(c);
                            location.reload();
                        }
                    };
                }
                anchorNode.parentNode.insertBefore(tip, anchorNode);
            }

            // --- 1. 识别楼主 (主楼专用嗅探) ---
            // 旧版模板：楼主通过 "作者:" 文本识别
            const allLinks = Array.from(document.querySelectorAll('a[href*="uid="], a[href*="viewpro"]'));
            const mainAuthorLink = allLinks.find(lk => {
                const parentTxt = lk.parentElement ? lk.parentElement.textContent : "";
                return parentTxt.includes('作者:') && !lk.closest('.infobar');
            });

            if (mainAuthorLink) {
                const authorRow = mainAuthorLink.parentNode;
                if (!authorRow.dataset.tgfcDone) {
                    const authorName = cleanStr(mainAuthorLink.textContent);
                    if (authorName && authorName !== "屏蔽") {
                        if (!op) { op = authorName; setThreadOP(op); }
                        applyBadges(authorRow, mainAuthorLink, authorName, op, cfg);

                        const parentP = mainAuthorLink.parentNode;

                        if (cfg.blocked.includes(authorName)) {
                            // 精确隐藏"作者:"部分，保留导航/标题/时间
                            let foundAuthor = false;
                            const nodesToWrap = [];

                            parentP.childNodes.forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('作者:')) {
                                    foundAuthor = true;
                                    const text = node.textContent;
                                    const idx = text.indexOf('作者:');
                                    node.textContent = idx > 0 ? text.substring(0, idx) : '';
                                } else if (foundAuthor) {
                                    nodesToWrap.push(node);
                                }
                            });

                            nodesToWrap.forEach(n => {
                                if (n.style) n.style.setProperty('display', 'none', 'important');
                                else if (n.nodeType === Node.TEXT_NODE) {
                                    const wrapper = document.createElement('span');
                                    wrapper.style.setProperty('display', 'none', 'important');
                                    n.parentNode.insertBefore(wrapper, n);
                                    wrapper.appendChild(n);
                                }
                            });

                            const toHide = [];
                            let n = parentP.nextElementSibling;
                            while (n && !n.classList.contains('infobar') && !n.innerText.includes('回复列表')) {
                                if (n.classList.contains('tgfc-wap-blocked-tip')) { n = n.nextElementSibling; continue; }
                                if (n.classList && n.classList.contains('message')) {
                                    n.style.setProperty('display', 'none', 'important');
                                    toHide.push(n);
                                }
                                n = n.nextElementSibling;
                            }
                            if (toHide.length > 0) createBlockedTip(toHide[0], authorName, toHide, '#主楼', null);

                        } else if (cfg.highlighted && cfg.highlighted[authorName]) {
                            const style = cfg.highlighted[authorName];
                            if (style.bg || style.color) {
                                let n = parentP.nextElementSibling;
                                while (n && !n.classList.contains('infobar')) {
                                    if (n.classList && n.classList.contains('message')) {
                                        if (style.bg) n.style.backgroundColor = style.bg;
                                        if (style.color) n.style.color = style.color;
                                        if (style.color) {
                                            n.querySelectorAll('*').forEach(el => {
                                                if (!el.classList.contains('tgfc-badge') &&
                                                    !el.classList.contains('tgfc-wap-tag-item') &&
                                                    !el.classList.contains('tgfc-op-badge') &&
                                                    !el.classList.contains('tgfc-wap-ban-btn') &&
                                                    !el.classList.contains('tgfc-wap-set-btn') &&
                                                    !el.classList.contains('tgfc-md-btn')) {
                                                    el.style.color = style.color;
                                                }
                                            });
                                        }
                                    }
                                    n = n.nextElementSibling;
                                }
                            }
                        }
                    }
                    authorRow.dataset.tgfcDone = '1';
                }
            }

            // --- 2. 处理回复楼层 ---
            document.querySelectorAll('.infobar').forEach(bar => {
                if (bar.dataset.tgfcDone) return;
                const aLink = Array.from(bar.querySelectorAll('a')).find(a => a.href.includes('viewpro') || a.href.includes('uid='));
                if (!aLink) return;
                const author = cleanStr(aLink.textContent);

                // 提取楼层号 (WAP 页面格式通常是 #n 或 n楼)
                const barText = bar.textContent;
                const floorMatch = barText.match(/#(\d+)|^(\d+)\s/);
                const floor = floorMatch ? `#${floorMatch[1] || floorMatch[2]} ` : '';

                applyBadges(bar, aLink, author, op, cfg);

                if (cfg.blocked.includes(author)) {
                    // 只隐藏 .message 内容，保留分隔线
                    let n = bar.nextElementSibling;
                    const toHide = [bar];
                    bar.style.setProperty('display', 'none', 'important');

                    while (n && !n.classList.contains('infobar')) {
                        if (n.classList.contains('tgfc-wap-blocked-tip')) { n = n.nextElementSibling; continue; }
                        if (n.classList && n.classList.contains('message')) {
                            n.style.setProperty('display', 'none', 'important');
                            toHide.push(n);
                        }
                        n = n.nextElementSibling;
                    }
                    createBlockedTip(bar, author, toHide, floor);
                } else if (cfg.highlighted && cfg.highlighted[author]) {
                    const style = cfg.highlighted[author];
                    if (style.bg || style.color) {
                        let n = bar.nextElementSibling;
                        while (n && !n.classList.contains('infobar')) {
                            if (n.classList && n.classList.contains('message')) {
                                if (style.bg) n.style.backgroundColor = style.bg;
                                if (style.color) n.style.color = style.color;
                                if (style.color) {
                                    n.querySelectorAll('*').forEach(el => {
                                        if (!el.classList.contains('tgfc-badge') &&
                                            !el.classList.contains('tgfc-wap-tag-item') &&
                                            !el.classList.contains('tgfc-op-badge') &&
                                            !el.classList.contains('tgfc-wap-ban-btn') &&
                                            !el.classList.contains('tgfc-wap-set-btn') &&
                                            !el.classList.contains('tgfc-md-btn')) {
                                            el.style.color = style.color;
                                        }
                                    });
                                }
                            }
                            n = n.nextElementSibling;
                        }
                    }
                }
                bar.dataset.tgfcDone = '1';
            });

            // --- 2.5 时间处理：将时间移到内容区右下角 ---
            // 处理回复楼层 (.infobar)
            document.querySelectorAll('.infobar').forEach(bar => {
                if (bar.dataset.tgfcTimeFixed) return;
                const timeSpan = bar.querySelector('.nf');
                if (timeSpan && /\d{1,2}:\d{2}/.test(timeSpan.textContent)) {
                    // 找到对应的 .message 内容区
                    let msgEl = bar.nextElementSibling;
                    while (msgEl && !msgEl.classList.contains('message')) {
                        msgEl = msgEl.nextElementSibling;
                    }
                    if (msgEl) {
                        msgEl.style.position = 'relative';
                        timeSpan.classList.add('tgfc-infobar-time');
                        msgEl.appendChild(timeSpan);
                    }
                    bar.dataset.tgfcTimeFixed = '1';
                }
            });

            // 处理顶楼时间 - 从包含"时间:"的 <p> 中提取
            if (!document.body.dataset.tgfcOpTimeFixed) {
                const wrap = document.querySelector('.wrap');
                if (wrap) {
                    const firstP = wrap.querySelector('p');
                    if (firstP && firstP.textContent.includes('时间:')) {
                        // 匹配格式: 时间:26-01-02 10:10 或 时间:2026-1-2 10:10
                        const timeMatch = firstP.textContent.match(/时间[:：]\s*(\d{2,4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2})/);
                        if (timeMatch) {
                            const timeText = timeMatch[1];

                            // 从原始 <p> 中移除时间行及相邻的 <br>
                            const childNodes = Array.from(firstP.childNodes);
                            for (let i = 0; i < childNodes.length; i++) {
                                const node = childNodes[i];
                                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('时间:')) {
                                    // 移除 "时间:XX-XX-XX XX:XX"
                                    node.textContent = node.textContent.replace(/时间[:：]\s*\d{2,4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/, '').trim();
                                    // 移除紧跟的 <br> 标签
                                    const nextNode = childNodes[i + 1];
                                    if (nextNode && nextNode.nodeName === 'BR') {
                                        nextNode.remove();
                                    }
                                    break;
                                }
                            }

                            // 找到顶楼的第一个 .message
                            const firstMsg = document.querySelector('.message');
                            if (firstMsg && !firstMsg.querySelector('.tgfc-infobar-time')) {
                                firstMsg.style.position = 'relative';
                                const timeSpan = document.createElement('span');
                                timeSpan.className = 'tgfc-infobar-time';
                                timeSpan.textContent = timeText;
                                firstMsg.appendChild(timeSpan);
                            }

                            document.body.dataset.tgfcOpTimeFixed = '1';
                        }
                    }
                }
            }

            // --- 3. 详细页/列表页清理 ---
            // 只移除 dTitle 类的“回复列表”栏目，绝对不碰任何功能按钮 
            document.querySelectorAll('.dTitle, .list_item_top, .list_item').forEach(row => {
                if (row.dataset.tgfcDone) return;

                const txt = row.textContent.trim();

                // 只有 dTitle 类且包含“回复列表”的才移除
                if (row.classList.contains('dTitle') && txt.includes('回复列表') && txt.length < 40) {
                    row.style.setProperty('display', 'none', 'important');
                }

                // 列表页整行屏蔽 
                if (location.href.includes('action=forum')) {
                    // WAP 列表页格式: [作者名/回复数/浏览数/最后回复者]
                    const authorSpan = row.querySelector('.author');
                    // 检查标题关键词
                    const titleText = row.textContent;
                    const keywordBlocked = checkKeywords(titleText, cfg.blockedKeywords);

                    if (authorSpan) {
                        const authorText = authorSpan.textContent;
                        const match = authorText.match(/^\[([^\/\]]+)/);
                        if (match) {
                            const authorName = cleanStr(match[1]);
                            if (authorName && (cfg.blocked.includes(authorName) || keywordBlocked)) {
                                row.style.setProperty('display', 'none', 'important');
                                if (!row.previousElementSibling || !row.previousElementSibling.classList.contains('tgfc-wap-blocked-tip')) {
                                    // 使用统一的 createBlockedTip 函数（带展开/解禁按钮）
                                    createBlockedTip(row, authorName, [row], '', keywordBlocked ? `关键词[${keywordBlocked}]` : null);
                                }
                            }
                        }
                    }
                }

                row.dataset.tgfcDone = '1';
            });

            // 4. 引用拦截
            document.querySelectorAll('.quote, .quote-bd').forEach(q => {
                if (q.dataset.tgfcQuoteDone) return;
                const m = (q.textContent || "").match(/原帖由\s*(?:@|在此发表)?\s*([^\s@:]+)/);
                if (m) {
                    const u = cleanStr(m[1]);
                    if (cfg.blocked.includes(u)) {
                        const c = q.closest('.quote') || q;
                        // 防止重复处理：检查是否已有提示
                        if (c.dataset.tgfcQuoteBlocked) return;
                        c.dataset.tgfcQuoteBlocked = '1';
                        c.style.display = 'none';
                        const tip = document.createElement('div');
                        tip.className = 'tgfc-wap-blocked-tip';
                        tip.style.fontSize = '10px';
                        tip.textContent = `🚫 已屏蔽对 ${u} 的引用`;
                        c.parentNode.insertBefore(tip, c);
                    }
                }
                q.dataset.tgfcQuoteDone = '1';
            });

            autoInjectNav();
            injectQuickAccessBar();
            addStickySeparator();
            beautifyContentPage();

            // 列表页分页链接修复
            fixListPaging();

            // 自动检测和增强 Markdown 内容（在按钮创建后）
            if (window.mdEnhancer && location.href.includes('action=thread')) {
                window.mdEnhancer.autoEnhanceAll();
            }

            // 自动链接识别（在内容页将纯文本 URL 转为可点击链接）
            if (cfg.autoLinkify && location.href.includes('action=thread')) {
                autoLinkify();
            }

            // 处理懒加载图片（wap.tgfcer.com 使用 jQuery Lazyload）
            // 将 data-original 的值设置到 src，使图片正常显示
            // 注意：如果图片是 http:// 而页面是 https://，需要在浏览器设置中允许"不安全内容"
            document.querySelectorAll('img.lazy[data-original], img[data-original]').forEach(img => {
                if (img.dataset.tgfcLazyFixed) return;
                const originalSrc = img.getAttribute('data-original');
                if (originalSrc && (!img.src || img.src.includes('grey.gif') || img.src.includes('loading'))) {
                    img.src = originalSrc;
                    img.classList.remove('lazy');
                    img.style.maxWidth = '100%';
                    img.dataset.tgfcLazyFixed = '1';

                    // 图片加载失败时隐藏难看的占位图
                    img.onerror = function () {
                        this.style.display = 'none';
                    };
                }
            });

            // 隐藏显示 "loading..." 的占位图
            document.querySelectorAll('img').forEach(img => {
                if (img.dataset.tgfcImgFixed) return;
                if (img.src && (img.src.includes('grey.gif') || img.src.endsWith('loading'))) {
                    img.style.display = 'none';
                    img.dataset.tgfcImgFixed = '1';
                }
            });
        }

        // 自动链接识别：将帖子内容中的纯文本 URL 转换为可点击链接
        function autoLinkify() {
            // URL 匹配正则：匹配 http:// 或 https:// 开头的链接
            const urlRegex = /(https?:\/\/[^\s<>"'\]\)）】」》]+)/gi;

            document.querySelectorAll('.message').forEach(msg => {
                if (msg.dataset.tgfcLinkified) return;
                msg.dataset.tgfcLinkified = '1';

                // 使用 TreeWalker 遍历文本节点
                const walker = document.createTreeWalker(
                    msg,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: function (node) {
                            // 跳过已经在链接内的文本
                            if (node.parentElement.closest('a')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            // 跳过脚本和样式标签内的文本
                            if (node.parentElement.closest('script, style')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    },
                    false
                );

                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    if (urlRegex.test(node.textContent)) {
                        textNodes.push(node);
                    }
                    urlRegex.lastIndex = 0; // 重置正则
                }

                // 替换文本节点中的 URL
                textNodes.forEach(textNode => {
                    const text = textNode.textContent;
                    const parts = [];
                    let lastIndex = 0;
                    let match;

                    urlRegex.lastIndex = 0;
                    while ((match = urlRegex.exec(text)) !== null) {
                        // 添加匹配前的文本
                        if (match.index > lastIndex) {
                            parts.push(document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        // 创建链接
                        const link = document.createElement('a');
                        link.href = match[1];
                        link.textContent = match[1];
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.style.wordBreak = 'break-all'; // 防止长链接撑开布局
                        parts.push(link);
                        lastIndex = urlRegex.lastIndex;
                    }

                    // 添加剩余文本
                    if (lastIndex < text.length) {
                        parts.push(document.createTextNode(text.substring(lastIndex)));
                    }

                    // 用新节点替换原文本节点
                    if (parts.length > 0) {
                        const fragment = document.createDocumentFragment();
                        parts.forEach(p => fragment.appendChild(p));
                        textNode.parentNode.replaceChild(fragment, textNode);
                    }
                });
            });
        }

        // 内容页美化 (基于实际WAP HTML结构)
        function beautifyContentPage() {
            if (document.body.dataset.tgfcBeautified) return;
            if (!location.href.includes('action=thread')) return; // 仅内容页

            document.body.dataset.tgfcBeautified = '1';

            // 1. 只给标题行添加蓝色背景，导航和时间保持系统背景
            const wrap = document.querySelector('.wrap');
            if (wrap) {
                const firstP = wrap.querySelector('p');
                if (firstP && firstP.textContent.includes('>>') && firstP.innerHTML.includes('标题:')) {
                    let html = firstP.innerHTML;

                    // 标题保持原版样式，不添加蓝色背景

                    // 找到作者行，单独创建信息条
                    const authorMatch = html.match(/(作者[:：])/);
                    if (authorMatch && !document.querySelector('.tgfc-op-infobar')) {
                        const authorIdx = firstP.innerHTML.indexOf(authorMatch[0]);
                        const beforeAuthor = firstP.innerHTML.substring(0, authorIdx);
                        const authorAndAfter = firstP.innerHTML.substring(authorIdx);

                        // 找到作者行的结束位置
                        const endMatch = authorAndAfter.match(/<br\s*\/?>\s*<br\s*\/?>/i);
                        let authorLine;
                        if (endMatch) {
                            const endIdx = authorAndAfter.indexOf(endMatch[0]);
                            authorLine = authorAndAfter.substring(0, endIdx);
                        } else {
                            authorLine = authorAndAfter.split('<')[0];
                        }

                        // 更新 firstP，移除作者行
                        firstP.innerHTML = beforeAuthor;

                        // 从 authorLine 中提取楼主用户名并缓存
                        // authorLine 包含类似 "作者:<a href='...'>用户名</a>" 的 HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = authorLine;
                        const opLink = tempDiv.querySelector('a[href*="uid="]') || tempDiv.querySelector('a[href*="action=my"]');
                        if (opLink) {
                            const opName = opLink.textContent.trim();
                            if (opName && opName !== '屏蔽') {
                                setThreadOP(opName);
                            }
                        }

                        // 创建顶楼信息条 - 格式与其他楼一致：#主楼 用户名
                        const authorBar = document.createElement('div');
                        authorBar.className = 'tgfc-op-infobar infobar';
                        // 将 "作者:" 替换为 "#主楼" 楼层号格式，与其他楼层统一
                        authorBar.innerHTML = authorLine.replace(/作者[:：]/, '<b style="margin-right:3px;font-size:12px">#主楼</b>');
                        authorBar.style.cssText = 'border:1px solid #ddd;border-bottom:none;border-radius:6px 6px 0 0;margin:8px 5px 0 5px;padding:6px 8px;background:#fafafa;display:flex;align-items:center;gap:2px;font-size:14px;';
                        firstP.parentNode.insertBefore(authorBar, firstP.nextSibling);
                    }
                }
            }

            // 2. 隐藏楼层分隔线 - 使用 DOM 遍历代替 innerHTML (避免破坏事件绑定)
            const container = document.querySelector('.wrap') || document.querySelector('#scroller') || document.body;
            if (container) {
                // 使用 TreeWalker 遍历文本节点，找到并隐藏分隔线及相邻的 <br>
                const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
                const nodesToHide = [];
                let node;
                while (node = walker.nextNode()) {
                    // 检查文本内容是否是分隔线 (5个或更多 = 符号)
                    if (/^\s*={5,}\s*$/.test(node.textContent)) {
                        nodesToHide.push(node);
                    }
                }
                // 隐藏分隔线节点及相邻的 <br> 标签
                nodesToHide.forEach(n => {
                    // 隐藏前面的 <br>
                    let prev = n.previousSibling;
                    while (prev && (prev.nodeName === 'BR' || (prev.nodeType === Node.TEXT_NODE && /^\s*$/.test(prev.textContent)))) {
                        if (prev.nodeName === 'BR') prev.style.display = 'none';
                        prev = prev.previousSibling;
                    }
                    // 隐藏后面的 <br>
                    let next = n.nextSibling;
                    while (next && (next.nodeName === 'BR' || (next.nodeType === Node.TEXT_NODE && /^\s*$/.test(next.textContent)))) {
                        if (next.nodeName === 'BR') next.style.display = 'none';
                        next = next.nextSibling;
                    }
                    // 隐藏分隔线文本本身
                    const wrapper = document.createElement('span');
                    wrapper.style.display = 'none';
                    n.parentNode.insertBefore(wrapper, n);
                    wrapper.appendChild(n);
                });
                if (nodesToHide.length > 0) {
                    console.log('[TGFC WAP] 分隔线已移除 (' + nodesToHide.length + '处)');
                }
            }

            // 3. 楼层信息栏美化 (.infobar)
            document.querySelectorAll('.infobar').forEach(bar => {
                bar.style.cssText = 'border:1px solid #ddd;border-bottom:none;border-radius:6px 6px 0 0;margin:4px 5px 0 5px;padding:3px 6px;background:#fafafa;';
            });

            // 4. 帖子内容区美化 (.message) - 不覆盖背景色以保留Tag配色
            document.querySelectorAll('.message').forEach((msg, idx) => {
                msg.style.border = '1px solid #ddd';
                msg.style.borderTop = 'none';
                msg.style.borderRadius = '0 0 6px 6px';
                msg.style.margin = '0 5px 4px 5px';
                msg.style.padding = '10px';
                msg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';

                // 清理 .message 后面的多余空白 (br 标签和空白文本)
                let next = msg.nextSibling;
                let brCount = 0;
                while (next) {
                    if (next.nodeName === 'BR') {
                        brCount++;
                        if (brCount > 1) next.style.display = 'none'; // 只保留1个 br
                    } else if (next.nodeType === Node.TEXT_NODE && /^\s*$/.test(next.textContent)) {
                        // 空白文本节点，跳过继续检查
                    } else {
                        break; // 遇到其他元素停止
                    }
                    next = next.nextSibling;
                }
            });

            // 5. 清理主楼内容后、回复列表前的多余空白
            // 查找包含"回复列表"的元素，向上清理空白
            const allBolds = document.querySelectorAll('b');
            allBolds.forEach(b => {
                if (b.textContent.includes('回复列表')) {
                    // 向前遍历清理多余的 br、空白 p、脚本等
                    let prev = b.previousSibling;
                    let brCount = 0;
                    while (prev) {
                        const saved = prev.previousSibling;
                        if (prev.nodeName === 'BR') {
                            brCount++;
                            if (brCount > 1) prev.style.display = 'none';
                        } else if (prev.nodeType === Node.TEXT_NODE && /^\s*$/.test(prev.textContent)) {
                            // 空白文本，跳过继续
                        } else if (prev.nodeType === Node.COMMENT_NODE) {
                            // 注释节点，跳过继续
                        } else if (prev.nodeName === 'SCRIPT') {
                            // 脚本元素，跳过继续
                        } else if (prev.nodeName === 'P') {
                            // p 标签，检查是否是广告，是则隐藏
                            if (prev.querySelector('.adsbygoogle, script, ins') || prev.innerHTML.includes('adsbygoogle')) {
                                prev.style.display = 'none';
                            }
                            // 继续向前遍历
                        } else {
                            // 遇到其他实际内容元素（如包含"引用|收藏"的文本），停止
                            break;
                        }
                        prev = saved;
                    }
                }
            });
        }

        // 置顶区高亮+分隔线
        function addStickySeparator() {
            if (document.querySelector('.tgfc-sticky-end')) return; // 已处理
            if (!location.href.includes('action=forum')) return; // 仅列表页

            // WAP 版置顶帖特征：.dTitle 内链接文本含 [顶]
            const allItems = document.querySelectorAll('.dTitle');
            let lastSticky = null;

            allItems.forEach(item => {
                const titleLink = item.querySelector('.title a');
                if (!titleLink) return;

                const text = titleLink.textContent;

                // 检测置顶标记：[顶]、[锁][顶] 等
                if (text.includes('[顶]') || text.includes('[置顶]')) {
                    lastSticky = item;
                    // 给置顶帖添加深灰背景，统一颜色
                    item.style.backgroundColor = '#ddd';
                    item.style.borderBottom = 'none';
                }
            });

            // 最后一个置顶帖只加下边距区分
            if (lastSticky) {
                lastSticky.style.marginBottom = '10px';
                lastSticky.classList.add('tgfc-sticky-end');
            }
        }

        // ==========================================
        // 模块: 今日十大话题 (WAP 版)
        // ==========================================
        const TOP10_CACHE_KEY = 'tgfc_wap_top10_cache';
        const TOP10_CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
        const TOP10_COLLAPSED_KEY = 'tgfc_wap_top10_collapsed';

        const TOP10_MODES = {
            today: { label: '今日', pages: 6, days: 0 },
            yesterday: { label: '昨日', pages: 10, days: 1 },
            week: { label: '本周', pages: 25, days: 7 },
            month: { label: '本月', pages: 85, days: 30 }
        };

        function isWapForumListPage() {
            return location.href.includes('action=forum');
        }

        function getWapForumId() {
            const url = new URL(location.href);
            return url.searchParams.get('fid');
        }

        function getDateStr(daysAgo = 0) {
            const now = new Date();
            now.setDate(now.getDate() - daysAgo);
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            return [
                `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                `${year}-${month}-${day}`,
                `${String(year).slice(2)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                `${String(year).slice(2)}-${month}-${day}`
            ];
        }

        function getDateRange(days) {
            const dates = [];
            for (let i = 0; i <= days; i++) {
                dates.push(...getDateStr(i));
            }
            return dates;
        }

        function getTop10Cache(fid, mode) {
            const key = `${fid}_${mode}`;
            const todayStr = getDateStr(0)[0];

            // 尝试 GM_getValue
            try {
                if (typeof GM_getValue === 'function') {
                    const raw = GM_getValue(TOP10_CACHE_KEY, '{}');
                    // 如果返回了 undefined，说明 GM 函数不可用，降级
                    if (raw !== undefined) {
                        const cache = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        const data = cache[key];
                        if (data && data.date === todayStr && Date.now() - data.timestamp < TOP10_CACHE_DURATION) {
                            return data.threads;
                        }
                    }
                }
            } catch (e) { }

            // localStorage 降级
            try {
                const raw = localStorage.getItem(TOP10_CACHE_KEY);
                if (raw) {
                    const cache = JSON.parse(raw);
                    const data = cache[key];
                    if (data && data.date === todayStr && Date.now() - data.timestamp < TOP10_CACHE_DURATION) {
                        return data.threads;
                    }
                }
            } catch (e) { }
            return null;
        }

        function setTop10Cache(fid, mode, threads) {
            const key = `${fid}_${mode}`;
            const cacheData = {
                date: getDateStr(0)[0],
                timestamp: Date.now(),
                threads: threads
            };

            // 尝试 GM
            try {
                if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
                    const raw = GM_getValue(TOP10_CACHE_KEY, '{}');
                    const cache = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    cache[key] = cacheData;
                    GM_setValue(TOP10_CACHE_KEY, JSON.stringify(cache));
                }
            } catch (e) { }

            // localStorage 降级
            try {
                let cache = {};
                const raw = localStorage.getItem(TOP10_CACHE_KEY);
                if (raw) cache = JSON.parse(raw);
                cache[key] = cacheData;
                localStorage.setItem(TOP10_CACHE_KEY, JSON.stringify(cache));
            } catch (e) { }
        }

        function buildWapForumPageUrl(fid, page) {
            const cfg = getConfig();
            const params = cfg.urlParams || {};
            let url = `https://${location.hostname}/wap/index.php?action=forum&fid=${fid}&page=${page}`;
            if (params.vt) url += `&vt=${params.vt}`;
            if (params.tp) url += `&tp=${params.tp}`;
            return url;
        }

        function parseWapForumPageThreads(doc) {
            const threads = [];
            doc.querySelectorAll('.dTitle').forEach(item => {
                // 跳过置顶帖
                if (item.textContent.includes('[顶]') || item.textContent.includes('[锁][顶]')) return;

                const authorSpan = item.querySelector('.author');
                if (!authorSpan) return;

                // WAP 格式: [作者/回复数/浏览数/最后回复者]
                const authorText = authorSpan.textContent.trim();
                // 解析 [xxx/123/456/yyy] 格式
                const match = authorText.match(/^\[([^\/]+)\/(\d+)\/(\d+)\/([^\]]+)\]$/);
                if (!match) return;

                const author = match[1].trim();
                const replies = parseInt(match[2]) || 0;
                const views = parseInt(match[3]) || 0;

                const titleLink = item.querySelector('.title a');
                if (!titleLink) return;

                const href = titleLink.href;
                const tidMatch = href.match(/tid=(\d+)/);
                if (!tidMatch) return;

                threads.push({
                    tid: tidMatch[1],
                    title: titleLink.textContent.trim().replace(/^\[[^\]]+\]\s*/, ''),
                    url: href,
                    replies: replies,
                    views: views,
                    author: author
                });
            });
            return threads;
        }

        async function fetchWapThreads(fid, forceRefresh = false) {
            // WAP 版没有日期信息，固定抓取前3页，按回复数排序
            const maxPages = 5;

            const allThreads = [];
            const seenTids = new Set();

            for (let page = 1; page <= maxPages; page++) {
                try {
                    let doc;
                    // 刷新时强制从网络获取，不使用当前 document
                    if (!forceRefresh && page === 1 && location.href.includes(`fid=${fid}`) && !location.href.includes('page=')) {
                        doc = document;
                    } else {
                        const pageUrl = buildWapForumPageUrl(fid, page);
                        const html = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: pageUrl,
                                overrideMimeType: 'text/html; charset=gbk',
                                onload: (resp) => resolve(resp.responseText),
                                onerror: reject
                            });
                        });
                        const parser = new DOMParser();
                        doc = parser.parseFromString(html, 'text/html');
                    }

                    const pageThreads = parseWapForumPageThreads(doc);

                    pageThreads.forEach(t => {
                        if (!seenTids.has(t.tid)) {
                            seenTids.add(t.tid);
                            allThreads.push(t);
                        }
                    });

                    if (page > 1) await new Promise(r => setTimeout(r, 100));
                } catch (e) {
                    console.error('[TGFC WAP] 抓取版面页面失败:', page, e);
                }
            }

            allThreads.sort((a, b) => b.replies - a.replies);
            return allThreads.slice(0, 30);
        }

        function renderTop10List(container, threads) {
            if (!threads || threads.length === 0) {
                container.innerHTML = '<div class="tgfc-wap-top10-empty">暂无热门话题</div>';
                return;
            }

            const ol = document.createElement('ol');
            ol.className = 'tgfc-wap-top10-list';

            threads.forEach((t, i) => {
                const li = document.createElement('li');

                const rankSpan = document.createElement('span');
                rankSpan.className = 'tgfc-wap-top10-rank';
                if (i === 0) rankSpan.classList.add('gold');
                else if (i === 1) rankSpan.classList.add('silver');
                else if (i === 2) rankSpan.classList.add('bronze');
                else rankSpan.classList.add('normal');
                rankSpan.textContent = i + 1;

                const link = document.createElement('a');
                link.className = 'tgfc-wap-top10-link';
                link.href = t.url;
                link.textContent = t.title;
                link.title = t.title;

                const repliesSpan = document.createElement('span');
                repliesSpan.className = 'tgfc-wap-top10-replies';
                repliesSpan.textContent = `${t.replies}回`;

                const authorSpan = document.createElement('span');
                authorSpan.className = 'tgfc-wap-top10-author';
                authorSpan.textContent = t.author;

                li.appendChild(rankSpan);
                li.appendChild(link);
                li.appendChild(repliesSpan);
                li.appendChild(authorSpan);
                ol.appendChild(li);
            });

            container.innerHTML = '';
            container.appendChild(ol);
        }

        function initWapTop10Panel() {
            if (!isWapForumListPage()) return;
            const fid = getWapForumId();
            if (!fid) return;

            const wrap = document.querySelector('.wrap');
            if (!wrap) return;
            if (document.getElementById('tgfc-wap-top10-panel')) return;

            let isCollapsed = true;
            try {
                // 优先尝试读取 GM 数据
                let gmVal;
                if (typeof GM_getValue === 'function') {
                    gmVal = GM_getValue(TOP10_COLLAPSED_KEY, 'true');
                }

                // 如果 GM 返回了有效值 (string)，使用它
                if (gmVal !== undefined && gmVal !== null) {
                    isCollapsed = gmVal === 'true';
                } else {
                    // 否则 (GM 不存在或返回 undefined)，降级到 localStorage
                    // 注意：localStorage 默认认为 collapsed=true (除非明确 stored='false')
                    isCollapsed = localStorage.getItem(TOP10_COLLAPSED_KEY) !== 'false';
                }
            } catch (e) {
                try { isCollapsed = localStorage.getItem(TOP10_COLLAPSED_KEY) !== 'false'; } catch (e2) { }
            }

            const panel = document.createElement('div');
            panel.id = 'tgfc-wap-top10-panel';
            panel.className = 'tgfc-wap-top10-panel';
            panel.innerHTML = `
                <div class="tgfc-wap-top10-header">
                    <span class="tgfc-wap-top10-title">🔥 热门话题</span>
                    <div class="tgfc-wap-top10-right">
                        <span class="tgfc-wap-top10-status"></span>
                        <button class="tgfc-wap-top10-refresh" title="刷新">🔄</button>
                    </div>
                </div>
                <div class="tgfc-wap-top10-body ${isCollapsed ? '' : 'expanded'}">
                    <div class="tgfc-wap-top10-loading">加载中...</div>
                </div>
            `;

            const firstDTitle = wrap.querySelector('.dTitle');
            if (firstDTitle) {
                firstDTitle.parentNode.insertBefore(panel, firstDTitle);
            } else {
                wrap.appendChild(panel);
            }

            const header = panel.querySelector('.tgfc-wap-top10-header');
            const body = panel.querySelector('.tgfc-wap-top10-body');
            const status = panel.querySelector('.tgfc-wap-top10-status');
            const refreshBtn = panel.querySelector('.tgfc-wap-top10-refresh');

            header.onclick = (e) => {
                if (e.target === refreshBtn) return;
                body.classList.toggle('expanded');
                const newState = body.classList.contains('expanded') ? 'false' : 'true';
                try {
                    if (typeof GM_setValue === 'function') GM_setValue(TOP10_COLLAPSED_KEY, newState);
                } catch (e) { }
                try { localStorage.setItem(TOP10_COLLAPSED_KEY, newState); } catch (e) { }
            };

            refreshBtn.onclick = (e) => {
                e.stopPropagation();
                body.innerHTML = '<div class="tgfc-wap-top10-loading">刷新中...</div>';
                fetchWapThreads(fid, true).then(threads => {
                    setTop10Cache(fid, 'hot', threads);
                    renderTop10List(body, threads);
                    status.textContent = '';
                });
            };

            displayTop10Data(fid, body, status);
        }

        function displayTop10Data(fid, container, statusEl) {
            const cached = getTop10Cache(fid, 'hot');
            if (cached) {
                statusEl.textContent = '';
                renderTop10List(container, cached);
            } else {
                statusEl.textContent = '加载中...';
                container.innerHTML = '<div class="tgfc-wap-top10-loading">加载中...</div>';
                fetchWapThreads(fid).then(threads => {
                    setTop10Cache(fid, 'hot', threads);
                    statusEl.textContent = '';
                    renderTop10List(container, threads);
                });
            }
        }

        // ==========================================
        // 模块: 关注话题 (WAP 版)
        // ==========================================
        const FOLLOWED_THREADS_KEY = 'tgfc_followed_threads';
        const FOLLOWED_COLLAPSED_KEY = 'tgfc_wap_followed_collapsed';

        function getFollowedThreads() {
            let threads = [];
            // 1. 尝试 GM_getValue
            try {
                if (typeof GM_getValue === 'function') {
                    const raw = GM_getValue(FOLLOWED_THREADS_KEY, '[]');
                    // 只有当 raw 有效且不是 undefined/null 时才解析
                    if (raw !== undefined && raw !== null) {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed)) {
                            return parsed; // 成功拿到数组，直接返回
                        }
                    }
                }
            } catch (e) {
                console.log('[TGFC WAP] GM_getValue failed:', e);
            }

            // 2. localStorage 降级
            try {
                const raw = localStorage.getItem(FOLLOWED_THREADS_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) threads = parsed;
                }
            } catch (e) {
                console.log('[TGFC WAP] localStorage failed:', e);
            }

            // 3. 最后的保底：返回空数组（如果前面都失败了）
            if (!Array.isArray(threads)) return [];
            return threads;
        }

        function saveFollowedThreads(threads) {
            const data = JSON.stringify(threads);
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(FOLLOWED_THREADS_KEY, data);
                }
            } catch (e) { }
            // localStorage 降级
            try {
                localStorage.setItem(FOLLOWED_THREADS_KEY, data);
            } catch (e) { }
        }

        function addFollowedThread(thread) {
            const threads = getFollowedThreads();
            if (threads.some(t => t.tid === thread.tid)) return false;
            threads.push({
                ...thread,
                addedAt: Date.now()
            });
            saveFollowedThreads(threads);
            return true;
        }

        function removeFollowedThread(tid) {
            let threads = getFollowedThreads();
            threads = threads.filter(t => t.tid !== tid);
            saveFollowedThreads(threads);
        }

        function isThreadFollowed(tid) {
            return getFollowedThreads().some(t => t.tid === tid);
        }

        function getFollowedThreadsByFid(fid) {
            return getFollowedThreads()
                .filter(t => {
                    if (!t.fid) return true;
                    return String(t.fid) === String(fid);
                })
                .sort((a, b) => b.addedAt - a.addedAt);
        }

        function initWapFollowButton() {
            if (!location.href.includes('action=thread')) return;

            const wrap = document.querySelector('.wrap');
            if (!wrap) {
                console.log('[TGFC WAP] Follow: wrap not found');
                return;
            }

            const existingBtn = wrap.querySelector('.tgfc-wap-follow-btn');
            if (existingBtn) return;

            const tid = getThreadId();
            if (!tid) return;

            const fid = new URL(location.href).searchParams.get('fid') || '';

            // 尝试多种方式提取标题
            let title = '';
            // 方法1: 从页面 title 获取（格式通常是 "标题-TGFC俱乐部"）
            if (document.title) {
                title = document.title.replace(/-TGFC.*$/, '').replace(/-TGbus.*$/, '').trim();
            }
            // 方法2: 从页面内容中提取
            if (!title) {
                const titleMatch = wrap.textContent.match(/标题[:：]\s*([^\n]+)/);
                if (titleMatch) title = titleMatch[1].trim();
            }

            // 提取发帖日期（格式: 时间:26-01-07 16:31）
            let postDate = '';
            const dateMatch = wrap.textContent.match(/时间[:：]\s*(\d{2,4}-\d{1,2}-\d{1,2})/);
            if (dateMatch) postDate = dateMatch[1];

            let author = getThreadOP() || '';

            // 找到标题行，使用多种方式尝试
            const firstP = wrap.querySelector('p');
            if (!firstP) {
                console.log('[TGFC WAP] Follow button: firstP not found');
                return;
            }

            // 尝试找到标题的 <b> 标签
            let insertTarget = firstP.querySelector('b');

            // 备选方案：找到包含"标题:"的文本后的元素
            if (!insertTarget) {
                // 遍历 firstP 的子节点找到标题位置
                const walker = document.createTreeWalker(firstP, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent.includes('标题:') || node.textContent.includes('标题：')) {
                        // 在标题文本后插入
                        insertTarget = node;
                        break;
                    }
                }
            }

            if (!insertTarget) {
                console.log('[TGFC WAP] Follow button: insertTarget not found');
                return;
            }

            const btn = document.createElement('span');
            btn.className = 'tgfc-wap-follow-btn';

            const updateBtn = () => {
                if (isThreadFollowed(tid)) {
                    btn.textContent = '已关注';
                    btn.classList.add('followed');
                } else {
                    btn.textContent = '关注';
                    btn.classList.remove('followed');
                }
            };
            updateBtn();

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isThreadFollowed(tid)) {
                    if (confirm('确定取消关注此话题？')) {
                        removeFollowedThread(tid);
                        updateBtn();
                    }
                } else {
                    addFollowedThread({
                        tid: tid,
                        title: title,
                        url: location.href.split('#')[0],
                        fid: fid,
                        author: author,
                        postDate: postDate
                    });
                    updateBtn();
                }
            };

            // 插入到目标元素之后
            if (insertTarget.nodeType === Node.TEXT_NODE) {
                // 文本节点，在其后面插入
                insertTarget.parentNode.insertBefore(btn, insertTarget.nextSibling);
            } else {
                // 元素节点，在其后面插入
                insertTarget.parentNode.insertBefore(btn, insertTarget.nextSibling);
            }
        }

        function renderFollowedSection(fid) {
            const threads = getFollowedThreadsByFid(fid);

            const oldPanel = document.getElementById('tgfc-wap-followed-panel');
            if (oldPanel) oldPanel.remove();

            if (threads.length === 0) return;

            const wrap = document.querySelector('.wrap');
            if (!wrap) return;

            let isCollapsed = false;
            try {
                let gmVal;
                if (typeof GM_getValue === 'function') {
                    gmVal = GM_getValue(FOLLOWED_COLLAPSED_KEY, 'false');
                }

                if (gmVal !== undefined && gmVal !== null) {
                    isCollapsed = gmVal === 'true';
                } else {
                    isCollapsed = localStorage.getItem(FOLLOWED_COLLAPSED_KEY) === 'true';
                }
            } catch (e) {
                try { isCollapsed = localStorage.getItem(FOLLOWED_COLLAPSED_KEY) === 'true'; } catch (e2) { }
            }

            const panel = document.createElement('div');
            panel.id = 'tgfc-wap-followed-panel';
            panel.className = 'tgfc-wap-followed-panel';

            let listHtml = threads.map((t, i) => {
                const authorHtml = t.author ? `<span class="tgfc-wap-followed-author">${t.author}</span>` : '';
                const dateHtml = t.postDate ? `<span class="tgfc-wap-followed-date">${t.postDate}</span>` : '';
                return `
                <li>
                    <span class="tgfc-wap-followed-rank">${i + 1}</span>
                    <a href="${t.url}" class="tgfc-wap-followed-link" title="${t.title}">${t.title}</a>
                    ${authorHtml}${dateHtml}
                    <span class="tgfc-wap-followed-unfollow" data-tid="${t.tid}" title="取消关注">×</span>
                </li>`;
            }).join('');

            panel.innerHTML = `
                <div class="tgfc-wap-followed-header">
                    <span class="tgfc-wap-followed-title">⭐ 我的关注 (${threads.length})</span>
                </div>
                <div class="tgfc-wap-followed-body ${isCollapsed ? '' : 'expanded'}">
                    <ul class="tgfc-wap-followed-list">${listHtml}</ul>
                </div>
            `;

            const header = panel.querySelector('.tgfc-wap-followed-header');
            const body = panel.querySelector('.tgfc-wap-followed-body');
            header.onclick = () => {
                body.classList.toggle('expanded');
                const newState = body.classList.contains('expanded') ? 'false' : 'true';
                try {
                    if (typeof GM_setValue === 'function') GM_setValue(FOLLOWED_COLLAPSED_KEY, newState);
                } catch (e) { }
                try { localStorage.setItem(FOLLOWED_COLLAPSED_KEY, newState); } catch (e) { }
            };

            panel.querySelectorAll('.tgfc-wap-followed-unfollow').forEach(btn => {
                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const tid = this.dataset.tid;
                    if (confirm('确定取消关注此话题？')) {
                        removeFollowedThread(tid);
                        renderFollowedSection(fid);
                    }
                };
            });

            const top10Panel = document.getElementById('tgfc-wap-top10-panel');
            if (top10Panel && top10Panel.nextSibling) {
                top10Panel.parentNode.insertBefore(panel, top10Panel.nextSibling);
            } else {
                const firstDTitle = wrap.querySelector('.dTitle');
                if (firstDTitle) {
                    firstDTitle.parentNode.insertBefore(panel, firstDTitle);
                } else {
                    wrap.appendChild(panel);
                }
            }
        }

        function initWapFollowedPanel() {
            if (!isWapForumListPage()) return;
            const fid = getWapForumId();
            if (!fid) return;
            renderFollowedSection(fid);
        }


        // 快速链接下拉菜单
        function injectQuickAccessBar() {
            if (document.getElementById('tgfc-quick-dropdown')) return;

            const navbar = document.querySelector('.navbar, .navigation');
            if (!navbar) return;

            // 找到 WAP助手 按钮，在它前面插入
            const wapBtn = navbar.querySelector('#tgfc-wap-nav-settings');

            const dropdown = document.createElement('span');
            dropdown.id = 'tgfc-quick-dropdown';
            dropdown.className = 'tgfc-quick-dropdown';

            function render() {
                const allLinks = loadQuickLinks();
                // 生成带原始索引的列表
                const enabledWithIdx = allLinks.map((l, i) => ({ ...l, origIdx: i })).filter(l => l.enabled);

                dropdown.innerHTML = `
                <span class="tgfc-quick-btn" id="tgfc-quick-toggle">链接▼</span>
                <div class="tgfc-quick-menu" id="tgfc-quick-menu">
                    ${enabledWithIdx.map(l => `
                        <div class="tgfc-quick-item" data-idx="${l.origIdx}">
                            <a href="${l.url}" class="link-name">${l.name}</a>
                            <span class="item-btns">
                                <span class="item-btn edit" title="编辑">✏️</span>
                                <span class="item-btn del" title="删除">🗑️</span>
                            </span>
                        </div>
                    `).join('')}
                    <a href="#" class="tgfc-quick-add" id="tgfc-quick-add-btn">+ 新增</a>
                </div>
            `;

                // 绑定点击切换
                const toggleBtn = dropdown.querySelector('#tgfc-quick-toggle');
                if (toggleBtn) {
                    toggleBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdown.classList.toggle('open');
                    };
                }

                // 绑定编辑按钮
                dropdown.querySelectorAll('.item-btn.edit').forEach(btn => {
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = parseInt(btn.closest('.tgfc-quick-item').dataset.idx);
                        const allLinks = loadQuickLinks();
                        const link = allLinks[idx];
                        if (link) {
                            const newName = prompt('链接名称:', link.name);
                            if (newName === null) return;
                            const newUrl = prompt('链接地址:', link.url);
                            if (newUrl === null) return;
                            allLinks[idx].name = newName.trim() || link.name;
                            allLinks[idx].url = newUrl.trim() || link.url;
                            saveQuickLinks(allLinks);
                            render();
                        }
                    };
                });

                // 绑定删除按钮
                dropdown.querySelectorAll('.item-btn.del').forEach(btn => {
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = parseInt(btn.closest('.tgfc-quick-item').dataset.idx);
                        const allLinks = loadQuickLinks();
                        if (confirm(`删除链接"${allLinks[idx]?.name}"？`)) {
                            allLinks.splice(idx, 1);
                            saveQuickLinks(allLinks);
                            render();
                        }
                    };
                });

                // 绑定新增按钮
                const addBtn = dropdown.querySelector('#tgfc-quick-add-btn');
                if (addBtn) {
                    addBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const name = prompt('链接名称:');
                        if (!name) return;
                        const url = prompt('链接地址:');
                        if (!url) return;
                        const allLinks = loadQuickLinks();
                        allLinks.push({ id: 'custom_' + Date.now(), name: name.trim(), url: url.trim(), enabled: true });
                        saveQuickLinks(allLinks);
                        render();
                    };
                }
            }

            // 插入到 WAP助手 按钮前面
            if (wapBtn) {
                navbar.insertBefore(dropdown, wapBtn);
            } else {
                navbar.appendChild(dropdown);
            }
            render();

            // 点击其他地方关闭菜单
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        }

        // 快速链接编辑面板
        function openQuickLinksEditor() {
            let overlay = document.getElementById('tgfc-wap-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'tgfc-wap-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:10001;display:none;';
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'block';
            overlay.onclick = () => { overlay.style.display = 'none'; editor.style.display = 'none'; };

            let editor = document.getElementById('tgfc-quick-editor');
            if (!editor) {
                editor = document.createElement('div');
                editor.id = 'tgfc-quick-editor';
                editor.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:320px;background:#fff;border-radius:12px;padding:15px;z-index:10002;box-shadow:0 10px 40px rgba(0,0,0,0.3);';
                document.body.appendChild(editor);
            }
            editor.style.display = 'block';
            editor.onclick = (e) => e.stopPropagation();

            const links = loadQuickLinks();

            function renderEditor() {
                editor.innerHTML = `
                <div style="font-weight:bold;font-size:14px;margin-bottom:10px;text-align:center">⚡ 快速链接管理</div>
                <div id="tgfc-links-list" style="max-height:250px;overflow-y:auto;margin-bottom:10px">
                    ${links.map((l, i) => `
                        <div style="display:flex;align-items:center;gap:6px;padding:6px;background:#f8f9fa;border-radius:6px;margin-bottom:6px">
                            <input type="checkbox" ${l.enabled ? 'checked' : ''} data-idx="${i}" class="tg-link-toggle" style="margin:0">
                            <input type="text" value="${l.name}" data-idx="${i}" data-field="name" class="tg-link-input" style="flex:0 0 60px;padding:4px;font-size:11px;border:1px solid #ddd;border-radius:4px">
                            <input type="text" value="${l.url}" data-idx="${i}" data-field="url" class="tg-link-input" style="flex:1;padding:4px;font-size:10px;border:1px solid #ddd;border-radius:4px">
                            <span data-idx="${i}" class="tg-link-del" style="color:#e74c3c;cursor:pointer;font-size:16px">×</span>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex;gap:8px">
                    <button id="tgfc-add-link" style="flex:1;padding:8px;background:#667eea;color:#fff;border:none;border-radius:6px;font-size:12px">+ 添加链接</button>
                    <button id="tgfc-save-links" style="flex:1;padding:8px;background:#27ae60;color:#fff;border:none;border-radius:6px;font-size:12px">保存</button>
                </div>
`;

                // 绑定事件
                editor.querySelectorAll('.tg-link-toggle').forEach(cb => {
                    cb.onchange = () => { links[+cb.dataset.idx].enabled = cb.checked; };
                });
                editor.querySelectorAll('.tg-link-input').forEach(inp => {
                    inp.oninput = () => { links[+inp.dataset.idx][inp.dataset.field] = inp.value; };
                });
                editor.querySelectorAll('.tg-link-del').forEach(btn => {
                    btn.onclick = () => { links.splice(+btn.dataset.idx, 1); renderEditor(); };
                });
                document.getElementById('tgfc-add-link').onclick = () => {
                    links.push({ id: 'custom_' + Date.now(), name: '新链接', url: 'https://', enabled: true });
                    renderEditor();
                };
                document.getElementById('tgfc-save-links').onclick = () => {
                    saveQuickLinks(links);
                    overlay.style.display = 'none';
                    editor.style.display = 'none';
                    // 刷新快速链接栏
                    const bar = document.getElementById('tgfc-quick-bar');
                    if (bar) bar.remove();
                    injectQuickAccessBar();
                    alert('快速链接已保存');
                };
            }

            renderEditor();
        }

        function autoInjectNav() {
            const navbar = document.querySelector('.navbar, .navigation');
            if (navbar && !document.getElementById('tgfc-wap-nav-settings')) {
                const lk = document.createElement('a');
                lk.id = 'tgfc-wap-nav-settings';
                lk.href = '#';
                lk.textContent = 'WAP助手';
                lk.style.cssText = 'margin-left:8px; color:#fff; font-weight:bold; background:#3498db; padding:0 4px; border-radius:3px; font-size:11px; line-height:16px; display:inline-block; text-decoration:none; vertical-align: 1px;';
                lk.onclick = (e) => { e.preventDefault(); createSettingsPanel(); };
                navbar.appendChild(lk);
            }
        }

        // 设置面板 (数据导入导出模式)
        function createSettingsPanel() {
            // 创建遮罩层
            let overlay = document.getElementById('tgfc-settings-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'tgfc-settings-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:10001;display:none;';
                overlay.onclick = () => {
                    overlay.style.display = 'none';
                    document.getElementById('tgfc-wap-panel').style.display = 'none';
                };
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'block';

            let p = document.getElementById('tgfc-wap-panel');
            if (!p) {
                p = document.createElement('div');
                p.id = 'tgfc-wap-panel';
                document.body.appendChild(p);
            }

            const cfg = getConfig();
            const blockedCount = cfg.blocked.length;
            const kwCount = (cfg.blockedKeywords || []).length;
            const tagCount = Object.keys(cfg.highlighted || {}).length;

            p.innerHTML = `
            <div style="text-align:center;font-size:14px;font-weight:bold;margin-bottom:6px">WAP助手设置 <span style="font-size:10px;color:#fff;font-weight:normal;background:rgba(0,0,0,0.3);padding:1px 5px;border-radius:3px;margin-left:4px">v0.5.8</span></div>
            
            <div style="font-size:11px;line-height:1.4">
                <!-- 屏蔽 ID -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
                        <span style="font-weight:bold;color:#333">📛 屏蔽 ID</span>
                        <span style="font-size:10px;color:#999">${blockedCount} 个</span>
                    </div>
                    <textarea id="tg-data-block" class="tg-input" style="height:40px;font-size:10px;padding:4px;margin-bottom:4px">${cfg.blocked.join(', ')}</textarea>
                    <div style="display:flex;gap:6px">
                        <button id="tg-block-export" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📤 导出</button>
                        <button id="tg-block-import" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📥 导入</button>
                    </div>
                </div>
                
                <!-- 屏蔽关键词 -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
                        <span style="font-weight:bold;color:#333">🔑 屏蔽关键词</span>
                        <span style="font-size:10px;color:#999">${kwCount} 个</span>
                    </div>
                    <textarea id="tg-data-kw" class="tg-input" style="height:40px;font-size:10px;padding:4px;margin-bottom:4px">${(cfg.blockedKeywords || []).join(', ')}</textarea>
                    <div style="display:flex;gap:6px">
                        <button id="tg-kw-export" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📤 导出</button>
                        <button id="tg-kw-import" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📥 导入</button>
                    </div>
                </div>
                
                <!-- Tag 数据 (仅导入导出) -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                        <span style="font-weight:bold;color:#333">🏷️ Tag 数据</span>
                        <span style="font-size:10px;color:#999">${tagCount} 个</span>
                    </div>
                    <div style="display:flex;gap:6px">
                        <button id="tg-tag-export" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📤 导出</button>
                        <button id="tg-tag-import" style="flex:1;font-size:10px;padding:3px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer">📥 导入</button>
                    </div>
                </div>
                
                <!-- 屏蔽提示开关 -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;align-items:center;gap:6px">
                        <input type="checkbox" id="tg-show-tip" ${cfg.showBlockTip ? 'checked' : ''} style="margin:0">
                        <label for="tg-show-tip" style="font-size:10px;color:#666">显示屏蔽提示 (关闭后被屏蔽内容完全消失)</label>
                    </div>
                </div>
                
                <!-- 静默引用开关 -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;align-items:center;gap:6px">
                        <input type="checkbox" id="tg-silent-quote" ${cfg.silentQuote ? 'checked' : ''} style="margin:0">
                        <label for="tg-silent-quote" style="font-size:10px;color:#666">静默引用 (引用回复时默认不通知对方)</label>
                    </div>
                </div>
                
                <!-- 自动链接开关 -->
                <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">
                    <div style="display:flex;align-items:center;gap:6px">
                        <input type="checkbox" id="tg-auto-linkify" ${cfg.autoLinkify !== false ? 'checked' : ''} style="margin:0">
                        <label for="tg-auto-linkify" style="font-size:10px;color:#666">自动链接 (自动识别帖子中的网址并转为可点击链接)</label>
                    </div>
                </div>
                
                <!-- 显示设置 -->
                <div>
                    <div style="font-weight:bold;color:#333;margin-bottom:4px">🖥️ 显示设置</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
                        <div>
                            <label style="font-size:10px;color:#666">宽度(px)</label>
                            <input id="tg-page-width" class="tg-input" type="number" placeholder="900" value="${cfg.pageWidth || ''}" style="font-size:10px;padding:3px">
                        </div>
                        <div>
                            <label style="font-size:10px;color:#666">背景色</label>
                            <div style="display:flex;gap:3px;align-items:center">
                                <input id="tg-bg-color" type="color" style="width:30px;height:20px;border:1px solid #ddd" value="${cfg.bgColor || '#bdbebd'}">
                                <button id="tg-bg-reset" style="font-size:8px;padding:1px 3px;background:#f0f0f0;border:1px solid #ccc;border-radius:2px">重置</button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:10px;color:#666">字体</label>
                            <select id="tg-font" class="tg-input" style="font-size:10px;padding:2px">
                                ${fontPresets.map(f => `<option value="${f.val}" ${cfg.font === f.val ? 'selected' : ''}>${f.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="font-size:10px;color:#666">字号</label>
                            <select id="tg-font-size" class="tg-input" style="font-size:10px;padding:2px">
                                ${fontSizePresets.map(s => `<option value="${s === '默认' ? '' : s}" ${cfg.fontSize === (s === '默认' ? '' : s) ? 'selected' : ''}>${s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <!-- URL 参数设置 -->
                    <div style="margin-top:8px;border-top:1px dashed #eee;padding-top:4px">
                        <label style="font-size:10px;color:#333;font-weight:bold;margin-bottom:2px;display:block">WAP论坛参数设置</label>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px">
                            <div>
                                <label style="font-size:9px;color:#666">vt(界面)</label>
                                <select id="tg-url-vt" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="1" ${(cfg.urlParams?.vt || '1') === '1' ? 'selected' : ''}>默认(推荐)</option>
                                    <option value="2" ${cfg.urlParams?.vt === '2' ? 'selected' : ''}>HD版</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:9px;color:#666">tp(每页主题)</label>
                                <select id="tg-url-tp" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="100" ${(cfg.urlParams?.tp || '100') === '100' ? 'selected' : ''}>100(推荐)</option>
                                    <option value="50" ${cfg.urlParams?.tp === '50' ? 'selected' : ''}>50</option>
                                    <option value="30" ${cfg.urlParams?.tp === '30' ? 'selected' : ''}>30</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:9px;color:#666">pp(每页回复)</label>
                                <select id="tg-url-pp" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="100" ${(cfg.urlParams?.pp || '100') === '100' ? 'selected' : ''}>100</option>
                                    <option value="50" ${cfg.urlParams?.pp === '50' ? 'selected' : ''}>50(加速)</option>
                                    <option value="30" ${cfg.urlParams?.pp === '30' ? 'selected' : ''}>30</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:9px;color:#666">sc(图片)</label>
                                <select id="tg-url-sc" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="0" ${(cfg.urlParams?.sc || '0') === '0' ? 'selected' : ''}>无图(推荐)</option>
                                    <option value="1" ${cfg.urlParams?.sc === '1' ? 'selected' : ''}>原图</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:9px;color:#666">sm(表情)</label>
                                <select id="tg-url-sm" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="0" ${(cfg.urlParams?.sm || '0') === '0' ? 'selected' : ''}>文字(推荐)</option>
                                    <option value="1" ${cfg.urlParams?.sm === '1' ? 'selected' : ''}>表情图</option>
                                    <option value="2" ${cfg.urlParams?.sm === '2' ? 'selected' : ''}>代码</option>
                                    <option value="3" ${cfg.urlParams?.sm === '3' ? 'selected' : ''}>不显示</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:9px;color:#666">css(风格)</label>
                                <select id="tg-url-css" class="tg-input" style="font-size:10px;padding:2px">
                                    <option value="" ${!cfg.urlParams?.css ? 'selected' : ''}>默认</option>
                                    <option value="default" ${cfg.urlParams?.css === 'default' ? 'selected' : ''}>默认风格</option>
                                    <option value="black" ${cfg.urlParams?.css === 'black' ? 'selected' : ''}>黑色诱惑</option>
                                </select>
                            </div>
                        </div>
                        <!-- 个性设置 iam -->
                        <div style="margin-top:6px;padding-top:4px;border-top:1px dotted #eee">
                            <label style="font-size:9px;color:#333;font-weight:bold">个性设置 (iam)</label>
                            <div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:2px">
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-web" ${cfg.urlParams?.iam?.includes('web') ? 'checked' : ''}>富媒体</label>
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-notop" ${cfg.urlParams?.iam?.includes('notop') ? 'checked' : ''}>不看置顶</label>
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-nolight" ${cfg.urlParams?.iam?.includes('nolight') ? 'checked' : ''}>不看点亮</label>
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-noattach" ${cfg.urlParams?.iam?.includes('noattach') ? 'checked' : ''}>不传附件</label>
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-noline" ${cfg.urlParams?.iam?.includes('noline') ? 'checked' : ''}>无下划线</label>
                                <label style="font-size:9px;color:#666"><input type="checkbox" id="tg-iam-row" ${cfg.urlParams?.iam?.includes('row') ? 'checked' : ''}>整行点击</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="btn-group" style="margin-top:10px;gap:6px">
                <button class="btn-close" id="tg-close-btn" style="padding:6px;font-size:12px">关闭</button>
                <button class="btn-save" id="tgfc-wap-save-now" style="padding:6px;font-size:12px">保存</button>
            </div>
            
            <!-- 隐藏的文件输入 -->
            <input type="file" id="tg-file-input" accept=".txt,.json" style="display:none">
`;

            // 导出功能
            const exportData = (data, filename) => {
                const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            };

            // 导入功能
            const importData = (callback) => {
                const input = document.getElementById('tg-file-input');
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        callback(ev.target.result);
                        input.value = ''; // 重置
                    };
                    reader.readAsText(file);
                };
                input.click();
            };

            // 绑定屏蔽ID导入导出
            document.getElementById('tg-block-export').onclick = () => {
                exportData(cfg.blocked.join('\n'), 'tgfc_blocked_ids.txt');
            };
            document.getElementById('tg-block-import').onclick = () => {
                importData((text) => {
                    const ids = text.split(/[\n,，]/).map(s => s.trim()).filter(Boolean);
                    if (ids.length === 0) { alert('文件内容为空'); return; }
                    const c = getConfig();
                    const merged = [...new Set([...c.blocked, ...ids])];
                    c.blocked = merged;
                    saveConfig(c);
                    alert(`已导入 ${ids.length} 个ID，合并后共 ${merged.length} 个`);
                    location.reload();
                });
            };

            // 绑定关键词导入导出
            document.getElementById('tg-kw-export').onclick = () => {
                exportData((cfg.blockedKeywords || []).join('\n'), 'tgfc_blocked_keywords.txt');
            };
            document.getElementById('tg-kw-import').onclick = () => {
                importData((text) => {
                    const kws = text.split(/[\n,，]/).map(s => s.trim()).filter(Boolean);
                    if (kws.length === 0) { alert('文件内容为空'); return; }
                    const c = getConfig();
                    const merged = [...new Set([...(c.blockedKeywords || []), ...kws])];
                    c.blockedKeywords = merged;
                    saveConfig(c);
                    alert(`已导入 ${kws.length} 个关键词，合并后共 ${merged.length} 个`);
                    location.reload();
                });
            };

            // 绑定Tag导入导出
            document.getElementById('tg-tag-export').onclick = () => {
                exportData(cfg.highlighted || {}, 'tgfc_tags.json');
            };
            document.getElementById('tg-tag-import').onclick = () => {
                importData((text) => {
                    try {
                        const tags = JSON.parse(text);
                        if (typeof tags !== 'object') throw new Error('格式错误');
                        const c = getConfig();
                        c.highlighted = { ...(c.highlighted || {}), ...tags };
                        saveConfig(c);
                        alert(`已导入 Tag 数据，合并后共 ${Object.keys(c.highlighted).length} 个`);
                        location.reload();
                    } catch (e) {
                        alert('导入失败：JSON 格式错误');
                    }
                });
            };

            // 绑定关闭
            document.getElementById('tg-close-btn').onclick = () => {
                p.style.display = 'none';
                const overlay = document.getElementById('tgfc-settings-overlay');
                if (overlay) overlay.style.display = 'none';
            };

            // 绑定背景色清除
            document.getElementById('tg-bg-reset').onclick = () => {
                document.getElementById('tg-bg-color').value = '#bdbebd';
            };

            // 绑定保存
            document.getElementById('tgfc-wap-save-now').onclick = () => {
                // 读取编辑区域
                const blocked = document.getElementById('tg-data-block').value.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);
                const kws = document.getElementById('tg-data-kw').value.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);

                const showBlockTip = document.getElementById('tg-show-tip').checked;
                const pageWidth = document.getElementById('tg-page-width').value.trim();
                const bgColorVal = document.getElementById('tg-bg-color').value;
                const bgColor = bgColorVal === '#ffffff' ? '' : bgColorVal;
                const font = document.getElementById('tg-font').value;
                const fontSize = document.getElementById('tg-font-size').value;

                // 读取 URL 参数
                const urlVt = document.getElementById('tg-url-vt').value;
                const urlTp = document.getElementById('tg-url-tp').value;
                const urlPp = document.getElementById('tg-url-pp').value;
                const urlSc = document.getElementById('tg-url-sc').value;
                const urlVf = '0'; // 固定为列表模式
                const urlSm = document.getElementById('tg-url-sm').value;
                const urlCss = document.getElementById('tg-url-css').value;
                // 读取 iam 复选框
                const urlIam = [];
                if (document.getElementById('tg-iam-web')?.checked) urlIam.push('web');
                if (document.getElementById('tg-iam-notop')?.checked) urlIam.push('notop');
                if (document.getElementById('tg-iam-nolight')?.checked) urlIam.push('nolight');
                if (document.getElementById('tg-iam-noattach')?.checked) urlIam.push('noattach');
                if (document.getElementById('tg-iam-noline')?.checked) urlIam.push('noline');
                // avatar 选项已禁用 - 会导致脚本失效
                if (document.getElementById('tg-iam-row')?.checked) urlIam.push('row');

                const newCfg = getConfig();
                newCfg.blocked = blocked;
                newCfg.blockedKeywords = kws;
                newCfg.showBlockTip = showBlockTip;
                newCfg.silentQuote = document.getElementById('tg-silent-quote').checked;
                newCfg.autoLinkify = document.getElementById('tg-auto-linkify').checked;
                newCfg.pageWidth = pageWidth;
                newCfg.bgColor = bgColor;
                newCfg.font = font;
                newCfg.fontSize = fontSize;
                newCfg.urlParams = { vt: urlVt, tp: urlTp, pp: urlPp, sc: urlSc, vf: urlVf, sm: urlSm, css: urlCss, iam: urlIam };

                saveConfig(newCfg);
                applyDisplaySettings();
                alert('设置已保存！');
                location.reload();
            };

            p.style.display = 'block';
        }

        // 静默引用：在引用回复页面自动取消"通知对方"的勾选
        function applySilentQuote() {
            const cfg = getConfig();
            if (!cfg.silentQuote) return;

            // 查找引用回复表单中的"通知对方"复选框
            // 根据 HTML: <input type="checkbox" name="sendreasonpm" value="1" checked="checked"/>
            const notifyCheckbox = document.querySelector('input[name="sendreasonpm"]');
            if (notifyCheckbox && notifyCheckbox.checked) {
                notifyCheckbox.checked = false;
                console.log('[TGFC WAP] 静默引用：已取消通知对方');
            }
        }

        function start() {
            console.log('[TGFC WAP] v0.5.8 启动');
            GM_addStyle(css);
            applyDisplaySettings();
            applyUrlParams();

            // 先执行美化操作
            try { addStickySeparator(); } catch (e) { console.error('[TGFC WAP] addStickySeparator 错误:', e); }
            try { beautifyContentPage(); } catch (e) { console.error('[TGFC WAP] beautifyContentPage 错误:', e); }
            try { fixListPaging(); } catch (e) { console.error('[TGFC WAP] fixListPaging 错误:', e); }
            try { injectQuickAccessBar(); } catch (e) { console.error('[TGFC WAP] injectQuickAccessBar 错误:', e); }

            // 十大话题和关注话题面板 (列表页)
            try { initWapTop10Panel(); } catch (e) { console.error('[TGFC WAP] initWapTop10Panel 错误:', e); }
            try { initWapFollowedPanel(); } catch (e) { console.error('[TGFC WAP] initWapFollowedPanel 错误:', e); }
            // 关注按钮 (内容页)
            try { initWapFollowButton(); } catch (e) { console.error('[TGFC WAP] initWapFollowButton 错误:', e); }
            // 静默引用 (引用回复页面)
            try { applySilentQuote(); } catch (e) { console.error('[TGFC WAP] applySilentQuote 错误:', e); }

            // 美化完成后再创建按钮和绑定事件
            fetchThreadOP().then(() => process());
            process();
            setInterval(process, 2000);

            // 标记脚本就绪，显示页面（配合关键样式的 opacity 过渡）
            requestAnimationFrame(() => {
                document.body.classList.add('tgfc-wap-ready');
            });
        }

        // 列表页：将分页链接移动到标题 span 内部，使其紧跟标题流动
        function fixListPaging() {
            document.querySelectorAll('.dTitle').forEach(item => {
                if (item.dataset.tgfcPagingFixed) return;
                const titleSpan = item.querySelector('.title');
                const paging = item.querySelector('.paging');
                if (titleSpan && paging) {
                    // 将 paging 的内容（分页链接）移动到 titleSpan 内部末尾
                    while (paging.firstChild) {
                        titleSpan.appendChild(paging.firstChild);
                    }
                    paging.remove();
                    item.dataset.tgfcPagingFixed = '1';
                }
            });
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
        else start();

    } // 结束 initScript 函数

    // 等待 DOM 加载后调用 initScript
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

})();
