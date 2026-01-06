// ==UserScript==
// @name         文本链接转可点击链接
// @version      2.2
// @description  自动识别页面中的文本链接和磁力链接并转换为可点击的链接
// @author       DeepSeek
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/559661/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%8F%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/559661/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%8F%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const SETTINGS = {
        AUTO_START: true,
        WATCH_DOM: true,
        EXECUTION_TIMEOUT: 0,
        IGNORE_SELECTORS: 'a, pre, code, script, style, textarea, input, .no-linkify, head, meta, noscript, object, embed, iframe, canvas, svg',
        OPEN_NEW_TAB: true,
        THROTTLE_MS: 1500,
        // 新增：跳过特定标题的网页（完全匹配）
        SKIP_TITLES: ['网页无法打开']
    };

    // 检查网页标题是否应该跳过（完全匹配）
    const shouldSkipPageByTitle = () => {
        const pageTitle = document.title.trim();
        if (!pageTitle) return false;
        
        // 完全匹配检查
        return SETTINGS.SKIP_TITLES.some(skipTitle => {
            return pageTitle === skipTitle;
        });
    };

    // 如果标题完全匹配跳过条件，直接退出脚本
    if (shouldSkipPageByTitle()) {
        console.log('链接转换：检测到需要跳过的页面标题，脚本已停止');
        return;
    }

    // 修复域名匹配问题：将较长的顶级域名放在前面
    const LINK_PATTERN = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/=]|(\w[\w._-]+\.(network|online|website|world|guru|work|space|ltd|vip|cyou|ink|link|click|asia|shop|info|com|cn|org|net|tv|cc|gov|edu|la|re|pw|icu|live|xin|st|fit|ms|xyz|io|fun|top))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=|magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,40}(&[a-z0-9]+=[\x21-\x7e]*)*)/gi;

    const processedElements = new WeakSet();
    let mutationWatcher = null;
    let throttleId = null;
    const queuedChanges = [];

    // HTML编码防止XSS
    const htmlEncoder = (text) => {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return text.replace(/[&<>"']/g, ch => escapeMap[ch]);
    };

    // 检查是否跳过该元素
    const shouldSkipElement = (elem) => {
        if (!elem || elem.nodeType !== 1) return true;
        if (elem.getAttribute?.('data-link-converted')) return true;
        if (elem.matches?.(SETTINGS.IGNORE_SELECTORS)) return true;
        if (elem.closest?.(SETTINGS.IGNORE_SELECTORS)) return true;
        return elem.isContentEditable;
    };

    // 规范化URL
    const normalizeUrl = (rawUrl) => {
        if (rawUrl.startsWith('magnet:')) return rawUrl;
        if (/^(https?|ed2k|thunder|magnet):\/\//i.test(rawUrl)) return rawUrl;
        return 'http://' + rawUrl;
    };

    // 创建可点击链接HTML
    const createClickableLink = (originalText) => {
        const url = normalizeUrl(originalText);
        const newTabAttr = SETTINGS.OPEN_NEW_TAB ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${htmlEncoder(url)}" class="auto-converted-link" data-link-converted="true"${newTabAttr}>${htmlEncoder(originalText)}</a>`;
    };

    // 转换文本节点中的链接
    const convertTextContent = (textNode) => {
        if (!textNode || textNode.nodeType !== 3) return false;
        const container = textNode.parentNode;
        if (!container || shouldSkipElement(container)) return false;

        const original = textNode.textContent;
        if (!original) return false;

        const testPattern = new RegExp(LINK_PATTERN.source, LINK_PATTERN.flags);
        if (!testPattern.test(original)) return false;

        const transformed = original.replace(LINK_PATTERN, createClickableLink);
        if (transformed === original) return false;

        const wrapper = document.createElement('span');
        wrapper.className = 'link-conversion-wrapper';
        wrapper.innerHTML = transformed;

        wrapper.childNodes.forEach(child => {
            if (child.nodeType === 3) processedElements.add(child);
        });

        container.replaceChild(wrapper, textNode);
        return true;
    };

    // 扫描元素中的文本链接
    const scanElement = (rootElem) => {
        if (!rootElem) return;
        if (processedElements.has(rootElem)) return;
        processedElements.add(rootElem);

        const textNodes = [];
        const nodeFilter = {
            acceptNode: (node) => {
                if (processedElements.has(node)) return NodeFilter.FILTER_REJECT;
                if (shouldSkipElement(node.parentNode)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        };

        const walker = document.createTreeWalker(
            rootElem,
            NodeFilter.SHOW_TEXT,
            nodeFilter
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
            textNodes.push(currentNode);
        }

        const timeLimit = SETTINGS.EXECUTION_TIMEOUT || Number.MAX_SAFE_INTEGER;
        const startTimestamp = Date.now();

        for (let i = 0; i < textNodes.length; i++) {
            convertTextContent(textNodes[i]);

            if (i < textNodes.length - 1 && 
                Date.now() - startTimestamp > timeLimit && 
                timeLimit !== Number.MAX_SAFE_INTEGER) {
                
                console.log(`链接转换：已处理 ${i + 1} 个节点，剩余 ${textNodes.length - i - 1} 个延迟执行`);
                const pending = textNodes.slice(i + 1);
                setTimeout(() => executeBatch(pending), 50);
                break;
            }
        }
    };

    // 批量处理节点
    const executeBatch = (nodeList) => {
        const limit = SETTINGS.EXECUTION_TIMEOUT || Number.MAX_SAFE_INTEGER;
        const beginTime = Date.now();

        for (let i = 0; i < nodeList.length; i++) {
            convertTextContent(nodeList[i]);

            if (i < nodeList.length - 1 && 
                Date.now() - beginTime > limit && 
                limit !== Number.MAX_SAFE_INTEGER) {
                
                const remaining = nodeList.slice(i + 1);
                setTimeout(() => executeBatch(remaining), 50);
                break;
            }
        }
    };

    // DOM变化节流处理
    const throttleHandler = () => {
        if (throttleId) clearTimeout(throttleId);
        
        throttleId = setTimeout(() => {
            if (queuedChanges.length === 0) return;

            const uniqueElements = new Set();
            queuedChanges.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        uniqueElements.add(node);
                    } else if (node.nodeType === 3 && node.parentNode?.nodeType === 1) {
                        uniqueElements.add(node.parentNode);
                    }
                });
            });

            uniqueElements.forEach(elem => {
                if (!processedElements.has(elem)) {
                    scanElement(elem);
                }
            });

            queuedChanges.length = 0;
        }, SETTINGS.THROTTLE_MS);
    };

    // MutationObserver回调
    const mutationCallback = (mutations) => {
        if (!SETTINGS.WATCH_DOM) return;
        queuedChanges.push(...mutations);
        throttleHandler();
    };

    // 初始化脚本
    const setup = () => {
        // 再次检查标题，以防动态加载的内容
        if (shouldSkipPageByTitle()) {
            console.log('链接转换：检测到需要跳过的页面标题，脚本已停止');
            return;
        }

        if (SETTINGS.AUTO_START) {
            scanElement(document.body);
        }

        if (SETTINGS.WATCH_DOM) {
            mutationWatcher = new MutationObserver(mutationCallback);
            mutationWatcher.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // 修改点：等待网页完全加载完成后执行
    if (document.readyState === 'complete') {
        setup();
    } else {
        // 使用load事件确保所有资源加载完成
        window.addEventListener('load', function() {
            // 延迟一小段时间以确保动态内容加载完成
            setTimeout(setup, 100);
        }, { once: true });
    }
})();