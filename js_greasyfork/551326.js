// ==UserScript==
// @name         Windows 11 国旗 Emoji 修复器
// @name:zh      Windows 11 国旗 Emoji 修复器
// @name:en      Windows 11 Flag Emoji Fixer
// @namespace    https://wha4up.github.io/flag-emoji-test/
// @version      3.1
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @connect      cdn.jsdelivr.net
// @inject-into  content
// @icon         https://wha4up.github.io/flag-emoji-test/w11fef.webp
// @description  通过精确包裹旗帜 Emoji 的方式，修复 Windows 11 上的显示问题，不影响任何网站原有字体。
// @description:zh 通过精确包裹旗帜 Emoji 的方式，修复 Windows 11 上的显示问题，不影响任何网站原有字体。
// @description:en Fixes Windows 11 flag emoji display issues by precisely wrapping flag characters, without affecting website fonts.
// @author       DeepSeek 3.2 & Gemini 3.0 pro
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://greasyfork.org/scripts/551326/feedback
// @downloadURL https://update.greasyfork.org/scripts/551326/Windows%2011%20%E5%9B%BD%E6%97%97%20Emoji%20%E4%BF%AE%E5%A4%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551326/Windows%2011%20%E5%9B%BD%E6%97%97%20Emoji%20%E4%BF%AE%E5%A4%8D%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fontUrl = 'https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@latest/dist/TwemojiCountryFlags.woff2';
    const fontCacheKey = 'twemoji_flag_subset_v3.1';

    /* ------------------------------------
     * 自动维护：版本更新后静默清理旧数据
     * 机制：每个版本只在首次运行时执行一次清理，之后永不运行。
     * ------------------------------------ */
    setTimeout(() => {
        const CLEANED_MARK = 'flag_fixer_cleaned_' + fontCacheKey;

        if (GM_getValue(CLEANED_MARK, false)) return;

        const keys = GM_listValues();
        const prefix = 'twemoji_flag_subset_';
        let count = 0;

        keys.forEach(key => {
            if (key.startsWith(prefix) && key !== fontCacheKey) {
                GM_deleteValue(key);
                count++;
            }
        });

        GM_setValue(CLEANED_MARK, true);

        if (count > 0) {
            console.debug(`Flag Fixer: 升级维护完成，已静默清理 ${count} 份旧版数据。`);
        }
    }, 5000); // 延迟5秒，避开页面加载高峰

    /* ------------------------------------
     * 安全注入样式
     * ------------------------------------ */
    function injectStyles(fontSrc) {
        GM_addStyle(`
            @font-face {
                font-family: 'Windows11FlagFix';
                src: local('Twemoji Mozilla'),
                     local('TwemojiMozilla'),
                     url('${fontSrc}') format('woff2');
                unicode-range: U+1F1E6-1F1FF;
                font-display: swap;
            }

            .flag-emoji-fix-wrapper {
                font-family: 'Windows11FlagFix', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif !important;
                display: inline !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                font-style: inherit !important;
                line-height: inherit !important;
                letter-spacing: inherit !important;
                word-spacing: inherit !important;
            }
        `);
    }

    /* ------------------------------------
     * Unicode 区间匹配
     * ------------------------------------ */
    const flagTestRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
    const flagRegex = /([\u{1F1E6}-\u{1F1FF}]{2})/gu;

    /* ------------------------------------
     * 核心修复逻辑：扫描 textNode
     * ------------------------------------ */
    function fixFlagEmojisInNode(contextNode) {
        const walker = document.createTreeWalker(
            contextNode || document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (!node.textContent) return NodeFilter.FILTER_REJECT;

                    const p = node.parentElement;
                    if (!p) return NodeFilter.FILTER_REJECT;

                    if (['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'TITLE'].includes(p.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
                    if (p.closest('.flag-emoji-fix-wrapper')) return NodeFilter.FILTER_REJECT;

                    return flagTestRegex.test(node.textContent)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);

        nodes.forEach(node => {
            const parent = node.parentNode;
            if (!parent || parent.closest('.flag-emoji-fix-wrapper')) return;

            let lastIndex = 0;
            let match;
            flagRegex.lastIndex = 0;

            const frag = document.createDocumentFragment();

            while ((match = flagRegex.exec(node.textContent))) {
                if (match.index > lastIndex) {
                    frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex, match.index)));
                }

                const span = document.createElement('span');
                span.className = 'flag-emoji-fix-wrapper';
                span.textContent = match[0];
                frag.appendChild(span);

                lastIndex = flagRegex.lastIndex;
            }

            if (lastIndex > 0) {
                if (lastIndex < node.textContent.length) {
                    frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
                }
                parent.replaceChild(frag, node);
            }
        });
    }

    /* ------------------------------------
     * 安全修复：临时断开 Observer，避免雪崩
     * ------------------------------------ */
    function safeFix(node) {
        observer.disconnect();
        try {
            fixFlagEmojisInNode(node);
        } finally {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    /* ------------------------------------
     * Debounce DOM 变更
     * ------------------------------------ */
    let fixTimeout = null;

    function debouncedFix(mutations) {
        clearTimeout(fixTimeout);

        fixTimeout = setTimeout(() => {
            const scanSet = new Set();

            for (const m of mutations) {
                if (m.type === 'childList') {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                            scanSet.add(node.parentElement);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            scanSet.add(node);
                        }
                    }
                } else if (m.type === 'characterData') {
                    const p = m.target.parentElement;
                    if (p) scanSet.add(p);
                }
            }

            for (const node of scanSet) {
                if (document.body.contains(node)) {
                    safeFix(node);
                }
            }
        }, 80);
    }

    const observer = new MutationObserver(debouncedFix);

    /* ------------------------------------
     * 字体加载流程（避免闪烁）
     * ------------------------------------ */
    const cached = GM_getValue(fontCacheKey);

    if (cached) {
        injectStyles(cached);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => safeFix(document.body));
        } else {
            safeFix(document.body);
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

    } else {
        GM_xmlhttpRequest({
            method: 'GET',
            url: fontUrl,
            responseType: 'blob',
            anonymous: true,
            onload(response) {
                if (response.status !== 200) {
                    console.warn('Flag Fixer: 字体下载失败');
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = function () {
                    const base64 = reader.result;
                    GM_setValue(fontCacheKey, base64);
                    injectStyles(base64);

                    safeFix(document.body);

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                };

                reader.readAsDataURL(response.response);
            },
            onerror() {
                console.warn('Flag Fixer: 字体请求失败或被拦截');
            }
        });
    }

})();