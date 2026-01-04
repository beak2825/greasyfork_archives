// ==UserScript==
// @name         MiSans 字体网页替换脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将网页字体替换为 MiSans，资源使用外部注入
// @author       Wolfe
// @match        *://*/*
// @exclude      *://h.bkzx.cn/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557389/MiSans%20%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557389/MiSans%20%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // 1. 核心配置
    // ======================
    const CONFIG = {
        BASE_URL: 'https://cdn.jsdelivr.net/npm/misans@4.1.0/lib',
        EMOJI_URL: 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap',
        NOTO_URL: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Sans+TC:wght@100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+KR:wght@100..900&display=swap',
        DEBUG: false
    };

    // ======================
    // 1.1 字体栈定义 (已优化：移除本地系统字体)
    // ======================

    // [优化] 仅使用通用 monospace，移除 Consolas/Menlo 等本地字体，避免系统字体查找开销
    const MONO_STACK = `monospace`;

    // [优化] 仅使用 Web Emoji
    const EMOJI_STACK = `"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"`;

    // 小语种优先栈
    const MINOR_LANG_STACK = `
        "MiSans Arabic", "MiSans Thai", "MiSans Tibetan", "MiSans Myanmar",
        "MiSans Lao", "MiSans Khmer", "MiSans Gurmukhi", "MiSans Devanagari"
    `.replace(/\s+/g, ' ').trim();

    // [关键] 思源 CJK 兜底栈：移除 "Source Han Sans" 本地调用，强制使用 Web 版 Noto
    const NOTO_FALLBACK_STACK = `
        "Noto Sans SC", "Noto Sans TC", "Noto Sans JP", "Noto Sans KR",
        "Noto Sans CJK SC"
    `.replace(/\s+/g, ' ').trim();

    // ======================
    // 2. 排除规则
    // ======================
    const EXCLUSIONS = {
        TAGS: new Set([
            'style', 'noscript', 'svg', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon',
            'img', 'canvas', 'video', 'audio', 'i', 'math', 'base', 'template', 'track', 'source', 'em',
            'code', 'pre', 'kbd', 'samp', 'tt', 'var', 'cds', 'xmp', 'script', 'meta', 'link', 'i', 'a'
        ]),
        // 保持原有的选择器列表
        SELECTORS: [
            '.material-symbols-outlined', '.material-icons', '.material-icons-outlined',
            '.fa', '.fas', '.far', '.fal', '.fab', '.fad',
            '.glyphicon', '.icon', '.icons', '.i',
            '[class*="ms-Icon"]', '[class*="Fabric"]', '[class*="fui-Icon"]',
            '[class*="icon-"]', '[class*="ico-"]', '[class*="ri-"]', '[class*="nf-"]',
            '.ms-Button-icon', '[role="img"]', '.octicon',
            '[class*="keyword"]', '[class*="hljs"]', '.token',
            '.katex', '.katex *', '.MathJax', '.MathJax *', '.mjx-container', '.mjx-math',
            '.math', '.latex', '.tex', '.notion-equation-inline', '.notion-equation-block',
            '.blob-code-inner', '.text-mono', '.SFMono-Regular',
            '.code-block', '.highlight', '.syntaxhighlighter', '[class*="monospace"]',
            '.monaco-editor', '.CodeMirror', '.cm-content', '[class*="ace"]', '[class*="symbols"]',
            '.docon', '[class*="icon"]', '[class*="video"]', '[class*="player"]', '[class*="svg"]',
            '[class*="Button"]'
        ]
    };

    const CSS_VARIABLES_TO_HIJACK = [
        '--font-family', '--font-sans', '--font-serif',
        '--font-body', '--font-heading', '--font-display', '--font-base',
        '--font-primary', '--font-secondary',
        '--bs-body-font-family', '--bs-font-sans-serif',
        '--chakra-fonts-body', '--chakra-fonts-heading',
        '--antd-font-family',
        '--mdc-typography-font-family', '--mat-typography-font-family',
        '--el-font-family',
        '--font-sans-serif',
        '--fontStack-system', '--fontStack-sansSerif',
        '--system-ui', '--ui-font'
    ];

    // ======================
    // 3. 字重映射策略
    // ======================
    const WEIGHT_MAP = {
        'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400,
        'Medium': 500, 'Demibold': 600, 'Bold': 700, 'Heavy': 900
    };

    const LATIN_BOOST_MAP = {
        'Thin': 'Regular', 'ExtraLight': 'Medium', 'Light': 'Medium',
        'Regular': 'Demibold', 'Medium': 'Bold', 'Demibold': 'Heavy', 'Bold': 'Heavy', 'Heavy': 'Heavy'
    };

    const STANDARD_MAP = {
        'Thin': 'Thin', 'ExtraLight': 'ExtraLight', 'Light': 'Light', 'Regular': 'Regular',
        'Medium': 'Medium', 'Demibold': 'Demibold', 'Bold': 'Bold', 'Heavy': 'Heavy'
    };

    // ======================
    // 4. 变体配置
    // ======================
    const VARIANTS = {
        'Latin':      { dir: 'Latin',      prefix: 'MiSansLatin',      type: 'woff2', map: LATIN_BOOST_MAP, name: 'MiSans Latin' },
        'Normal':     { dir: 'Normal',     prefix: 'MiSans',           type: 'css',   map: STANDARD_MAP,    name: 'MiSans' },
        'TC':         { dir: 'TC',         prefix: 'MisansTC',         type: 'css',   map: STANDARD_MAP,    name: 'MiSans TC' },
        'Arabic':     { dir: 'Arabic',     prefix: 'MiSansArabic',     type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Arabic' },
        'Thai':       { dir: 'Thai',       prefix: 'MiSansThai',       type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Thai' },
        'Tibetan':    { dir: 'Tibetan',    prefix: 'MiSansTibetan',    type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Tibetan' },
        'Myanmar':    { dir: 'Myanmar',    prefix: 'MiSansMyanmar',    type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Myanmar' },
        'Lao':        { dir: 'Lao',        prefix: 'MiSansLao',        type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Lao' },
        'Khmer':      { dir: 'Khmer',      prefix: 'MiSansKhmer',      type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Khmer' },
        'Gurmukhi':   { dir: 'Gurmukhi',   prefix: 'MiSansGurmukhi',   type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Gurmukhi' },
        'Devanagari': { dir: 'Devanagari', prefix: 'MiSansDevanagari', type: 'woff2', map: STANDARD_MAP,    name: 'MiSans Devanagari' }
    };

    // ======================
    // 5. 字体栈构建
    // ======================
    const BASE_LATIN = `"MiSans Latin"`;
    const TC_FALLBACKS = `"MiSans TC", "MiSansTC", "Misans TC"`;

    // 全局兜底 (无本地字体)
    const GLOBAL_FALLBACKS = `${MINOR_LANG_STACK}, "MiSans", "MiSans Normal", ${TC_FALLBACKS}, ${NOTO_FALLBACK_STACK}, ${EMOJI_STACK}`;

    // 专用栈 (移除本地 Source Han Sans)
    const KR_PRIORITY_STACK = `${BASE_LATIN}, "Noto Sans KR", "MiSans", ${GLOBAL_FALLBACKS}`;
    const JP_PRIORITY_STACK = `${BASE_LATIN}, "Noto Sans JP", "MiSans", ${GLOBAL_FALLBACKS}`;

    function buildStack(primaryFont) {
        if (primaryFont === "MiSans TC") return `${BASE_LATIN}, ${TC_FALLBACKS}, "MiSans", ${GLOBAL_FALLBACKS}`;
        if (primaryFont === "MiSans") return `${BASE_LATIN}, ${GLOBAL_FALLBACKS}`;
        return `${BASE_LATIN}, "${primaryFont}", ${GLOBAL_FALLBACKS}`;
    }

    const STACKS = {
        sc: buildStack("MiSans"),
        tc: buildStack("MiSans TC"),
        kr: KR_PRIORITY_STACK,
        ja: JP_PRIORITY_STACK,
        ar: buildStack("MiSans Arabic"),
        th: buildStack("MiSans Thai"),
        bo: buildStack("MiSans Tibetan"),
        my: buildStack("MiSans Myanmar"),
        lo: buildStack("MiSans Lao"),
        km: buildStack("MiSans Khmer"),
        pa: buildStack("MiSans Gurmukhi"),
        hi: buildStack("MiSans Devanagari")
    };

    // ======================
    // 6. 语言检测 (保留完整功能)
    // ======================
    const REGEX = {
        TC: /[\u4E26\u50B3\u5169\u5340\u53C3\u570B\u5BE6\u5BEB\u5C0D\u5F8C\u61C9\u6230\u6416\u64D4\u64F4\u65BC\u6703\u689D\u6A02\u6A23\u6B77\u6B78\u6EFE\u6FDF\u7063\u70BA\u723E\u73FE\u7522\u7BC4\u7D00\u7D44\u7D93\u7E7C\u7E8C\u806F\u807D\u81FA\u8207\u840A\u862D\u88FD\u8A71\u8A72\u8AAA\u8B5C\u8B8A\u8C9D\u8CB7\u8CD3\u8CE3\u9019\u904E\u9054\u9084\u908A\u968A\u985E\u99AC\u9AD4\u9EBC\u9EDE]/,
        TH: /[\u0E00-\u0E7F]/,
        AR: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
        BO: /[\u0F00-\u0FFF]/,
        MY: /[\u1000-\u109F]/,
        LO: /[\u0E80-\u0EFF]/,
        KM: /[\u1780-\u17FF]/,
        PA: /[\u0A00-\u0A7F]/,
        HI: /[\u0900-\u097F]/
    };

    function detectLanguage(element) {
        // 1. 属性检测
        const langAttr = element.closest('[lang]')?.lang?.toLowerCase();
        if (langAttr) {
            if (langAttr.includes('zh-tw') || langAttr.includes('zh-hk') || langAttr.includes('hant')) return 'tc';
            if (langAttr.includes('ja')) return 'ja';
            if (langAttr.includes('ko') || langAttr.includes('kr')) return 'kr';
            if (langAttr.includes('ar') || langAttr.includes('ur') || langAttr.includes('fa')) return 'ar';
            if (langAttr.includes('th')) return 'th';
            if (langAttr.includes('bo')) return 'bo';
            if (langAttr.includes('my')) return 'my';
            if (langAttr.includes('lo')) return 'lo';
            if (langAttr.includes('km')) return 'km';
            if (langAttr.includes('pa')) return 'pa';
            if (langAttr.includes('hi')) return 'hi';
        }

        // 2. 文本内容检测 (优化：仅检测有文本内容的元素)
        // 使用 textContent 可能会引起回流，但为了准确性必须保留，通过限制长度优化
        const text = element.textContent;
        if (text && text.length > 0) {
            const sample = text.substring(0, 50); // [优化] 减少采样长度，从300减至50，足够判断
            if (REGEX.TC.test(sample)) return 'tc';
            if (REGEX.AR.test(sample)) return 'ar';
            if (REGEX.TH.test(sample)) return 'th';
            if (REGEX.BO.test(sample)) return 'bo';
            if (REGEX.MY.test(sample)) return 'my';
            if (REGEX.LO.test(sample)) return 'lo';
            if (REGEX.KM.test(sample)) return 'km';
            if (REGEX.PA.test(sample)) return 'pa';
            if (REGEX.HI.test(sample)) return 'hi';
        }

        return 'sc';
    }

    // ======================
    // 7. FontLoader (优化：增加 preconnect)
    // ======================
    class FontLoader {
        constructor() {
            this.loaded = false;
        }

        loadFonts() {
            if (this.loaded) return;

            const head = document.head || document.documentElement;

            // [优化] 预连接加速
            ['https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preconnect'; link.href = href;
                if (href.includes('gstatic')) link.crossOrigin = 'anonymous';
                head.appendChild(link);
            });

            const cssLinksContainer = document.createDocumentFragment();
            const style = document.createElement('style');
            style.id = 'nuclear-font-loader';
            let cssContent = '/* --- MiSans Hybrid v55 (Optimized) --- */\n';

            const emojiLink = document.createElement('link');
            emojiLink.rel = 'stylesheet'; emojiLink.href = CONFIG.EMOJI_URL; emojiLink.crossOrigin = 'anonymous';
            cssLinksContainer.appendChild(emojiLink);

            const notoLink = document.createElement('link');
            notoLink.rel = 'stylesheet'; notoLink.href = CONFIG.NOTO_URL; notoLink.crossOrigin = 'anonymous';
            cssLinksContainer.appendChild(notoLink);

            Object.keys(VARIANTS).forEach(key => {
                const conf = VARIANTS[key];
                const mapping = conf.map;

                if (conf.type === 'woff2') {
                    Object.keys(WEIGHT_MAP).forEach(cssWeightName => {
                        const cssWeightValue = WEIGHT_MAP[cssWeightName];
                        const actualFileWeightName = mapping[cssWeightName];
                        if (actualFileWeightName) {
                            const url = `${CONFIG.BASE_URL}/${conf.dir}/${conf.prefix}-${actualFileWeightName}.woff2`;
                            cssContent += `@font-face { font-family: '${conf.name}'; src: url('${url}') format('woff2'); font-weight: ${cssWeightValue}; font-style: normal; font-display: swap; }\n`;
                        }
                    });
                }
                else if (conf.type === 'css') {
                    const weightsToLoad = new Set(Object.values(mapping));
                    weightsToLoad.forEach(weightName => {
                        const url = `${CONFIG.BASE_URL}/${conf.dir}/${conf.prefix}-${weightName}.min.css`;
                        const link = document.createElement('link');
                        link.rel = 'stylesheet'; link.href = url; link.crossOrigin = 'anonymous';
                        cssLinksContainer.appendChild(link);
                    });
                }
            });

            // [优化] 预编译选择器字符串
            const tagExclusionSelector = Array.from(EXCLUSIONS.TAGS).map(tag => `:not(${tag})`).join('');
            const customExclusionSelector = EXCLUSIONS.SELECTORS.map(sel => `:not(${sel})`).join('');

            cssContent += `
                :root, :host, body, html {
                    --font-full-sc: ${STACKS.sc};
                    --font-full-tc: ${STACKS.tc};
                    ${CSS_VARIABLES_TO_HIJACK.map(v => `${v}: ${STACKS.sc} !important;`).join('\n    ')}

                    --font-mono: ${MONO_STACK} !important;
                    --font-monospace: ${MONO_STACK} !important;

                    -webkit-font-smoothing: antialiased !important;
                    -moz-osx-font-smoothing: grayscale !important;
                    text-rendering: optimizeLegibility !important;
                }

                a, *${tagExclusionSelector}${customExclusionSelector} {
                    font-family: ${STACKS.sc} !important;
                }

                [lang^="ja"] { font-family: ${STACKS.ja} !important; }
                [lang^="ko"], [lang="kr"] { font-family: ${STACKS.kr} !important; }
                [lang^="zh-TW"], [lang^="zh-HK"], [lang="zh-Hant"] { font-family: ${STACKS.tc} !important; }
                [lang^="ar"], [lang^="fa"], [lang^="ur"] { font-family: ${STACKS.ar} !important; }
                [lang^="th"] { font-family: ${STACKS.th} !important; }
            `;

            style.textContent = cssContent;
            head.appendChild(cssLinksContainer);
            head.appendChild(style);
            this.loaded = true;
            if (CONFIG.DEBUG) console.log('[Font Engine] Loaded. Hybrid v55 Optimized.');
        }
    }

    // ======================
    // 8. 异步处理系统 (优化逻辑)
    // ======================
    const processed = new WeakSet();
    const updateQueue = new Map();
    let isBatchScheduled = false;

    const requestIdleCallback = window.requestIdleCallback || function(cb) {
        return setTimeout(() => { cb({ timeRemaining: () => 50, didTimeout: false }); }, 1);
    };

    function scheduleBatchUpdate() {
        if (isBatchScheduled) return;
        isBatchScheduled = true;
        requestIdleCallback(processBatchQueue, { timeout: 1000 });
    }

    function processBatchQueue(deadline) {
        isBatchScheduled = false;
        const iterator = updateQueue.entries();
        let entry = iterator.next();

        while (!entry.done) {
            if (deadline.timeRemaining() < 1 && updateQueue.size > 0) {
                scheduleBatchUpdate();
                break;
            }
            const [el, forceUpdate] = entry.value;
            updateQueue.delete(el);
            if (el.isConnected) {
                performProcess(el, forceUpdate);
            }
            entry = iterator.next();
        }
    }

    function addToQueue(node, force = false) {
        if (!node || node.nodeType !== 1) return;
        // [优化] 快速过滤：如果已经在队列中且非强制，跳过
        if (updateQueue.has(node) && !force) return;
        updateQueue.set(node, force);
        scheduleBatchUpdate();
    }

    function performProcess(el, forceUpdate = false) {
        if (processed.has(el) && !forceUpdate) return;

        // [优化] 快速标签检查
        const tag = el.tagName.toLowerCase();
        if (EXCLUSIONS.TAGS.has(tag)) {
            processed.add(el);
            return;
        }

        // [优化] 性能瓶颈优化：matches 检查较慢，先检查是否有 class 属性
        if (el.className && typeof el.className === 'string') {
             if (EXCLUSIONS.SELECTORS.some(selector => {
                // 简单的字符串包含检查比 matches 快，但只适用于类名包含的情况
                if (selector.startsWith('.') && el.className.includes(selector.substring(1))) return true;
                try { return el.matches(selector); } catch (e) { return false; }
            })) {
                processed.add(el);
                return;
            }
        }

        // [优化] 关键性能提升：如果元素没有文本内容且没有子元素，或者是纯容器，先不进行昂贵的正则检测
        // 只有当元素可能是“叶子节点”或者包含直接文本时才检测
        if (!el.firstChild) {
             processed.add(el);
             return;
        }

        const lang = detectLanguage(el);
        // 只有当检测出的语言不是默认 SC 时，才需要 JS 干预样式
        // 因为 CSS 全局样式已经覆盖了 SC 的情况
        if (lang !== 'sc') {
            const targetFontStack = STACKS[lang];
            if (targetFontStack) {
                const currentStyle = el.style.fontFamily; // 直接读取 style 属性而不是 getComputedStyle，性能更高
                if (forceUpdate || !currentStyle.includes('MiSans')) {
                     el.style.setProperty('font-family', targetFontStack, 'important');
                }
            }
        }
        processed.add(el);
    }

    // ======================
    // 9. 观察者与初始化 (保留)
    // ======================
    function processNode(node) {
        if (node.nodeType !== 1) return;

        // [优化] 只有当节点包含文本或可能是文本容器时才加入队列
        addToQueue(node);

        if (node.shadowRoot) {
            injectStylesIntoShadowRoot(node.shadowRoot);
            // ShadowRoot 内部通常节点较少，可以直接遍历
            node.shadowRoot.querySelectorAll('*').forEach(el => addToQueue(el));
        }

        // [优化] 避免 querySelectorAll('*') 的巨大开销
        // 仅在初始化或大块插入时使用，平时依赖 MutationObserver 的 childList
        if (node.childElementCount > 0) {
             const descendants = node.getElementsByTagName('*'); // getElementsByTagName 比 querySelectorAll 快
             for (let i = 0; i < descendants.length; i++) {
                 addToQueue(descendants[i]);
             }
        }
    }

    function injectStylesIntoShadowRoot(shadowRoot) {
        if (!shadowRoot.getElementById('nuclear-font-loader')) {
            const style = document.getElementById('nuclear-font-loader');
            if (style) {
                try { shadowRoot.appendChild(style.cloneNode(true)); } catch (e) {}
            }
        }
    }

    function processIframe(iframe) {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (doc && !doc.__fontPatched) {
                doc.__fontPatched = true;
                const style = document.getElementById('nuclear-font-loader');
                if (style && doc.head) doc.head.appendChild(style.cloneNode(true));

                // Iframe 内部也使用优化后的遍历
                const allNodes = doc.getElementsByTagName('*');
                for (let i = 0; i < allNodes.length; i++) {
                    addToQueue(allNodes[i]);
                }

                const iframeObserver = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => processNode(node));
                        } else if (mutation.type === 'attributes') {
                            addToQueue(mutation.target, true);
                        }
                    }
                });
                iframeObserver.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'lang'] });
            }
        } catch (e) {}
    }

    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.tagName === 'IFRAME') {
                            node.addEventListener('load', () => processIframe(node), { once: true });
                        } else {
                            processNode(node);
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    // [优化] 仅当 style 或 lang 改变时才触发，减少 class 变更带来的抖动
                    const el = mutation.target;
                    if (processed.has(el)) {
                         const fam = el.style.fontFamily;
                         // 只有当字体不再是 MiSans 时才重新处理，防止死循环
                         if (fam && !fam.includes('MiSans')) {
                             addToQueue(el, true);
                         }
                    }
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'lang'] }); // 移除 class 监听以提升性能
    }

    const fontLoader = new FontLoader();
    function init() {
        fontLoader.loadFonts();
        processNode(document.documentElement);
        document.querySelectorAll('iframe').forEach(processIframe);
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();