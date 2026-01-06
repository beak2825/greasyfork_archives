// ==UserScript==
// @name         文本链接转可点击链接
// @version      1.9
// @description  自动识别页面中的文本链接和磁力链接并转换为可点击的链接，保留原始文本
// @author       DeepSeek
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/559661/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%8F%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/559661/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%8F%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(() => {
    'use strict';
    
    // 跳过处理的元素标签
    const SKIP_TAGS = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'IFRAME'];
    
    // 磁力链接匹配正则表达式
    const MAGNET_PATTERN = /(magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+)/gi;
    
    // 改进的URL正则，避免包含前面的斜杠
    const URL_PATTERN = /\b(?:https?:\/\/|www\.)[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*(?:\.[a-zA-Z]{2,})(?::\d{1,5})?(?:\/[^\s<>()\[\]{}|\\^~`'";:,!?]*)?/gi;
    
    // 合并的正则表达式
    const COMBINED_PATTERN = new RegExp(
        `(${MAGNET_PATTERN.source}|${URL_PATTERN.source})`,
        'gi'
    );
    
    // 常见顶级域名列表
    const COMMON_TLDS = [
        // 通用顶级域名
        'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
        // 国家顶级域名
        'cn', 'us', 'uk', 'jp', 'de', 'fr', 'ru', 'br', 'in', 'it', 'ca', 'au', 'mx', 'es', 'kr', 'id', 'nl', 'tr', 'sa', 'ch', 'tw', 'se', 'pl', 'be', 'th', 'ir', 'eg', 'gr', 'pt', 'cz', 'dk', 'fi', 'il', 'nz', 'ie', 'sg', 'my', 'za', 'ar', 'cl', 'co', 'pe', 've', 'ro', 'hu', 'sk', 'at', 'bg', 'hr', 'lt', 'si', 'ee', 'lv', 'cy', 'lu', 'mt', 'is', 'li',
        // 新通用顶级域名
        'xyz', 'top', 'site', 'online', 'club', 'shop', 'store', 'tech', 'fun', 'app', 'dev', 'ai', 'io', 'me', 'tv', 'co', 'biz', 'info', 'name', 'mobi', 'pro', 'asia',
        // 您要求增加的新后缀
        'la', 're', 'guru', 'pw', 'icu', 'live', 'work', 'space', 'ltd', 'xin', 'cc', 'vip', 'world', 'website', 'cyou', 'ink', 'link', 'st', 'fit', 'click', 'ms',
        // 二级域名（国家顶级域名的二级）
        'com.cn', 'org.cn', 'net.cn', 'edu.cn', 'gov.cn', 'ac.cn',
        'co.uk', 'org.uk', 'me.uk', 'gov.uk', 'ac.uk',
        'com.au', 'org.au', 'net.au', 'edu.au', 'gov.au',
        'co.jp', 'or.jp', 'go.jp', 'ac.jp', 'ed.jp',
        'com.de', 'org.de', 'net.de', 'edu.de',
        'com.fr', 'org.fr', 'net.fr', 'edu.fr',
        'com.br', 'org.br', 'net.br', 'edu.br', 'gov.br',
        'com.mx', 'org.mx', 'net.mx', 'edu.mx', 'gob.mx'
    ];
    
    // 验证URL
    const isValidURL = (url) => {
        // 如果是磁力链接，直接返回true
        if (url.toLowerCase().startsWith('magnet:')) {
            return true;
        }
        
        // 如果包含协议，直接认为是有效URL
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.')) {
            return true;
        }
        
        return false;
    };
    
    // 改进的链接提取函数，专门处理前面有斜杠的情况
    const extractLinks = content => {
        const results = [];
        
        // 先匹配磁力链接
        const magnetPattern = /(magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+)/gi;
        let magnetMatch;
        while ((magnetMatch = magnetPattern.exec(content)) !== null) {
            results.push({
                url: magnetMatch[1],
                start: magnetMatch.index,
                end: magnetMatch.index + magnetMatch[1].length,
                originalLength: magnetMatch[1].length,
                cleanedLength: magnetMatch[1].length,
                isMagnet: true
            });
        }
        
        // 改进的URL匹配，避免包含前面的斜杠
        // 我们使用更精确的正则，并手动检查前面的字符
        const urlPattern = /(https?:\/\/[^\s<>()\[\]{}|\\^~`'";:,!?]+|www\.[^\s<>()\[\]{}|\\^~`'";:,!?]+)/gi;
        let urlMatch;
        while ((urlMatch = urlPattern.exec(content)) !== null) {
            const url = urlMatch[1];
            const startIndex = urlMatch.index;
            
            // 检查前面是否有冒号或斜杠（避免匹配到前面的内容）
            const beforeMatch = startIndex > 0 ? content.substring(0, startIndex) : '';
            const lastCharBefore = beforeMatch.length > 0 ? beforeMatch.charAt(beforeMatch.length - 1) : '';
            
            // 如果前面有冒号但不是 http: 或 https:，跳过
            if (lastCharBefore === ':') {
                const beforeUrl = beforeMatch.toLowerCase();
                if (!beforeUrl.endsWith('http:') && !beforeUrl.endsWith('https:')) {
                    continue;
                }
            }
            
            // 如果前面有斜杠但不是协议部分，跳过
            if (lastCharBefore === '/' && !url.startsWith('//')) {
                // 检查前面是否有冒号（协议分隔符）
                const secondLastCharBefore = beforeMatch.length > 1 ? beforeMatch.charAt(beforeMatch.length - 2) : '';
                if (secondLastCharBefore !== ':') {
                    // 前面有斜杠但没有冒号，说明是路径的一部分，跳过
                    continue;
                }
            }
            
            // 检查是否是单词的一部分
            const afterIndex = startIndex + url.length;
            if (isPartOfWord(content, startIndex, afterIndex)) {
                continue;
            }
            
            // 清理URL（移除末尾标点）
            const cleaned = sanitizeURL(url, content, startIndex);
            
            if (isValidURL(cleaned)) {
                results.push({
                    url: cleaned,
                    start: startIndex,
                    end: startIndex + url.length,
                    originalLength: url.length,
                    cleanedLength: cleaned.length,
                    isMagnet: false
                });
            }
        }
        
        // 去重并排序
        return results.filter((item, index, self) => 
            index === self.findIndex(t => 
                t.start === item.start && t.url === item.url
            )
        ).sort((a, b) => a.start - b.start);
    };
    
    // 检查节点是否在A标签内
    const isInsideAnchor = (node) => {
        let parent = node.parentNode;
        while (parent && parent !== document.body) {
            if (parent.nodeName === 'A') {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    };
    
    // 检查URL是否是单词的一部分
    const isPartOfWord = (text, start, end) => {
        const beforeChar = start > 0 ? text[start - 1] : '';
        const afterChar = end < text.length ? text[end] : '';
        
        // 如果前面或后面是字母数字，说明可能是单词的一部分
        return /[a-zA-Z0-9]/.test(beforeChar) || /[a-zA-Z0-9]/.test(afterChar);
    };
    
    // 智能清理URL
    const sanitizeURL = (urlStr, originalText, matchStart) => {
        if (!urlStr) return urlStr;
        
        let cleaned = urlStr;
        
        // 磁力链接特殊处理
        if (cleaned.toLowerCase().startsWith('magnet:')) {
            const magnetMatch = cleaned.match(/^(magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+)/i);
            if (magnetMatch) {
                cleaned = magnetMatch[1];
            }
            return cleaned;
        }
        
        const originalLength = cleaned.length;
        
        // 移除常见的末尾标点
        const trailingChars = /([.,;:!?'"`\]\}>]+)$/;
        const match = cleaned.match(trailingChars);
        if (match) {
            const withoutPunctuation = cleaned.substring(0, cleaned.length - match[1].length);
            // 确保移除标点后仍然看起来像URL
            if (withoutPunctuation.length > 0 && 
                (withoutPunctuation.includes('://') || withoutPunctuation.startsWith('www.'))) {
                cleaned = withoutPunctuation;
            }
        }
        
        return cleaned;
    };
    
    // 构建链接元素
    const buildLinkElement = url => {
        const link = document.createElement('a');
        
        if (url.toLowerCase().startsWith('magnet:')) {
            link.href = url;
        } else {
            const href = url.startsWith('http') ? url : `http://${url}`;
            link.href = href;
        }
        
        link.textContent = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer nofollow';
        link.setAttribute('data-text-link', 'true');
        link.style.cssText = 'cursor: pointer;';
        
        return link;
    };
    
    // 创建带链接的文本节点
    const createTextWithLinks = (text) => {
        if (!text || text.trim().length === 0) {
            return document.createTextNode(text);
        }
        
        // 检查整个文本是否就是一个URL
        const trimmedText = text.trim();
        if (isValidURL(trimmedText)) {
            return buildLinkElement(trimmedText);
        }
        
        // 提取链接
        const links = extractLinks(text);
        
        if (links.length === 0) {
            return document.createTextNode(text);
        }
        
        // 创建文档片段
        const fragment = document.createDocumentFragment();
        let currentPos = 0;
        
        links.forEach((link, index) => {
            // 添加链接前的文本
            if (link.start > currentPos) {
                fragment.appendChild(
                    document.createTextNode(text.substring(currentPos, link.start))
                );
            }
            
            // 添加链接
            fragment.appendChild(buildLinkElement(link.url));
            
            // 更新当前位置到清理后的URL的结束位置
            currentPos = link.start + link.cleanedLength;
            
            // 如果清理后的URL比原始匹配短，添加被清理掉的字符
            if (link.cleanedLength < link.originalLength) {
                const removedChars = text.substring(
                    link.start + link.cleanedLength, 
                    link.start + link.originalLength
                );
                if (removedChars.length > 0) {
                    fragment.appendChild(
                        document.createTextNode(removedChars)
                    );
                }
                currentPos = link.start + link.originalLength;
            }
            
            // 添加最后一个链接后的文本
            if (index === links.length - 1 && currentPos < text.length) {
                fragment.appendChild(
                    document.createTextNode(text.substring(currentPos))
                );
            }
        });
        
        return fragment;
    };
    
    // 处理单个文本节点
    const processTextNode = textNode => {
        const parent = textNode.parentNode;
        if (!parent || SKIP_TAGS.includes(parent.nodeName)) return false;
        
        // 排除已经在A标签内的文本节点
        if (isInsideAnchor(textNode)) return false;
        
        const content = textNode.textContent;
        if (!content || content.trim().length === 0) return false;
        
        const replacement = createTextWithLinks(content);
        
        if (!replacement) return false;
        
        if (replacement.nodeType === Node.TEXT_NODE && 
            replacement.textContent === content) {
            return false;
        }
        
        try {
            parent.replaceChild(replacement, textNode);
            return true;
        } catch (error) {
            console.warn('替换文本节点失败:', error);
            return false;
        }
    };
    
    // 收集所有需要处理的文本节点
    const collectTextNodes = (root = document.body) => {
        const nodes = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    if (!node.parentNode || SKIP_TAGS.includes(node.parentNode.nodeName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    if (isInsideAnchor(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    const content = node.textContent;
                    if (!content || content.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // 使用改进的检查方法
                    const hasMagnet = /magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+/i.test(content);
                    const hasURL = /(?:https?:\/\/|www\.)[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*(?:\.[a-zA-Z]{2,})/i.test(content);
                    
                    return (hasMagnet || hasURL) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        let currentNode;
        while (currentNode = walker.nextNode()) {
            nodes.push(currentNode);
        }
        
        return nodes;
    };
    
    // 遍历Shadow DOM
    const traverseShadowRoots = (element) => {
        const results = [];
        
        if (element.shadowRoot) {
            results.push(...collectTextNodes(element.shadowRoot));
            element.shadowRoot.childNodes.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    results.push(...traverseShadowRoots(child));
                }
            });
        }
        
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                results.push(...traverseShadowRoots(child));
            }
        });
        
        return results;
    };
    
    // 主要处理函数
    const processDocument = () => {
        try {
            // 收集所有文本节点（包括Shadow DOM）
            let allTextNodes = collectTextNodes();
            
            // 查找并处理Shadow DOM中的节点
            document.querySelectorAll('*').forEach(element => {
                if (element.shadowRoot) {
                    allTextNodes.push(...traverseShadowRoots(element));
                }
            });
            
            // 去重并处理
            const uniqueNodes = [...new Set(allTextNodes)];
            
            // 从后往前处理，避免索引变化
            let processedCount = 0;
            for (let i = uniqueNodes.length - 1; i >= 0; i--) {
                const node = uniqueNodes[i];
                if (node.parentNode && document.contains(node)) {
                    if (processTextNode(node)) {
                        processedCount++;
                    }
                }
            }
            
            if (processedCount > 0) {
                console.log(`已处理 ${processedCount} 个文本节点中的链接`);
            }
        } catch (error) {
            console.error('处理文档时出错:', error);
        }
    };
    
    // 延迟执行
    const delayedProcess = (function() {
        let timer = null;
        return function() {
            if (timer) clearTimeout(timer);
            timer = setTimeout(processDocument, 500);
        };
    })();
    
    // 初始执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', delayedProcess);
    } else {
        delayedProcess();
    }
    
    // 监听DOM变化
    const observer = new MutationObserver(mutations => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'characterData' || 
                mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }
        
        if (shouldUpdate) {
            delayedProcess();
        }
    });
    
    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();