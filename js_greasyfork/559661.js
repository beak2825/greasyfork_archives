// ==UserScript==
// @name         文本链接转可点击链接
// @version      1.5
// @description  自动识别页面中的文本链接和磁力链接并转换为可点击的链接
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
    
    // 跳过处理的元素标签 - 移除了 CODE 和 PRE
    const SKIP_TAGS = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'IFRAME'];
    
    // 磁力链接匹配正则表达式
    const MAGNET_PATTERN = /magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+/gi;
    
    // 完整的URL匹配正则表达式（支持更多格式）- 保持原正则
    const URL_PATTERN = /\b(?:(?:https?:\/\/)?(?:www\.)?(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|localhost)(?::\d{1,5})?(?:\/[-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)(?![a-zA-Z0-9@:%_\+.~#?&//=])/gi;
    
    // 合并的正则表达式：匹配URL或磁力链接
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
        'xyz', 'top', 'site', 'online', 'club', 'shop', 'store', 'tech', 'fun', 'online', 'app', 'dev', 'ai', 'io', 'me', 'tv', 'co', 'biz', 'info', 'name', 'mobi', 'pro', 'asia',
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
        
        // 如果包含协议，直接认为是有效URL（不验证域名）
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return true;
        }
        
        // 对于不包含协议的纯文本域名，检查顶级域名
        // 提取域名部分（去除端口和路径）
        let domain = url.split('/')[0].split(':')[0];
        
        // 检查是否为IP地址
        const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        if (ipPattern.test(domain) || domain === 'localhost') {
            return true;
        }
        
        // 检查顶级域名是否在已知列表中
        const parts = domain.split('.');
        if (parts.length < 2) return false;
        
        // 获取最后的部分（可能是顶级域名或二级域名）
        const lastPart = parts[parts.length - 1];
        const lastTwoParts = parts.slice(-2).join('.');
        
        // 检查是否为常见顶级域名
        if (COMMON_TLDS.includes(lastPart.toLowerCase())) {
            return true;
        }
        
        // 检查是否为常见二级域名（如 co.uk, com.cn 等）
        if (COMMON_TLDS.includes(lastTwoParts.toLowerCase())) {
            return true;
        }
        
        // 如果都不在列表中，则认为无效
        return false;
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
    
    // 清理URL末尾的标点符号
    const sanitizeURL = urlStr => {
        if (!urlStr) return '';
        
        let cleaned = urlStr;
        
        // 磁力链接特殊处理：确保完整磁力链接
        if (cleaned.toLowerCase().startsWith('magnet:')) {
            // 磁力链接通常包含特殊字符，保持原样
            // 但移除末尾可能的多余标点
            const magnetMatch = cleaned.match(/^(magnet:\?xt=urn:(?:btih|sha1|tree:tiger):[a-zA-Z0-9&=._\-%]+)/i);
            if (magnetMatch) {
                cleaned = magnetMatch[1];
            }
            return cleaned;
        }
        
        // 处理括号：找到平衡的括号
        if (cleaned.endsWith(')')) {
            let openCount = 0;
            let closeCount = 0;
            let validEnd = cleaned.length;
            
            for (let i = 0; i < cleaned.length; i++) {
                if (cleaned[i] === '(') openCount++;
                if (cleaned[i] === ')') closeCount++;
                
                if (closeCount > openCount) {
                    validEnd = i;
                    break;
                }
            }
            
            if (closeCount > openCount) {
                cleaned = cleaned.substring(0, validEnd);
            }
        }
        
        // 移除其他常见的末尾标点
        const trailingChars = /([.,;:!?'"`\]\}>]+)$/;
        const match = cleaned.match(trailingChars);
        if (match) {
            cleaned = cleaned.substring(0, cleaned.length - match[1].length);
        }
        
        return cleaned;
    };
    
    // 提取文本中的链接
    const extractLinks = content => {
        const results = [];
        let match;
        
        // 使用合并的正则表达式进行匹配
        COMBINED_PATTERN.lastIndex = 0;
        while ((match = COMBINED_PATTERN.exec(content)) !== null) {
            const original = match[0];
            const cleaned = sanitizeURL(original);
            
            if (isValidURL(cleaned)) {
                results.push({
                    url: cleaned,
                    start: match.index,
                    end: match.index + original.length,
                    originalLength: original.length,
                    originalMatch: match[0]
                });
            }
        }
        
        // 去重（相同的链接在相同位置）
        return results.filter((item, index, self) => 
            index === self.findIndex(t => 
                t.start === item.start && t.url === item.url
            )
        ).sort((a, b) => a.start - b.start);
    };
    
    // 构建链接元素 - 已移除颜色和下划线
    const buildLinkElement = url => {
        const link = document.createElement('a');
        
        // 磁力链接直接使用magnet:协议
        if (url.toLowerCase().startsWith('magnet:')) {
            link.href = url;
        } else {
            // 如果URL包含协议或已经是完整URL，直接使用
            const href = url.startsWith('http') || url.startsWith('//') ? url : `http://${url}`;
            link.href = href;
        }
        
        link.textContent = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer nofollow';
        link.setAttribute('data-text-link', 'true');
        // 移除所有自定义样式，保持页面原有样式
        link.style.cssText = 'cursor: pointer;';
        
        return link;
    };
    
    // 处理单个文本节点
    const processTextNode = textNode => {
        const parent = textNode.parentNode;
        if (!parent || SKIP_TAGS.includes(parent.nodeName)) return false;
        
        // 排除已经在A标签内的文本节点
        if (isInsideAnchor(textNode)) return false;
        
        const content = textNode.textContent;
        const links = extractLinks(content);
        
        if (links.length === 0) return false;
        
        const segments = [];
        let currentPos = 0;
        
        links.forEach((link, index) => {
            // 添加链接前的文本
            if (link.start > currentPos) {
                segments.push({
                    type: 'text',
                    content: content.substring(currentPos, link.start)
                });
            }
            
            // 添加链接
            segments.push({
                type: 'link',
                content: link.url
            });
            
            currentPos = link.start + link.originalLength;
            
            // 如果是最后一个链接，添加剩余文本
            if (index === links.length - 1 && currentPos < content.length) {
                segments.push({
                    type: 'text',
                    content: content.substring(currentPos)
                });
            }
        });
        
        // 创建文档片段
        const fragment = document.createDocumentFragment();
        segments.forEach(segment => {
            if (segment.type === 'link') {
                fragment.appendChild(buildLinkElement(segment.content));
            } else {
                fragment.appendChild(document.createTextNode(segment.content));
            }
        });
        
        // 替换原节点
        try {
            parent.replaceChild(fragment, textNode);
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
                    // 排除SKIP_TAGS中的元素
                    if (!node.parentNode || SKIP_TAGS.includes(node.parentNode.nodeName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // 排除已经在A标签内的节点
                    if (isInsideAnchor(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // 只处理包含URL的文本节点
                    return COMBINED_PATTERN.test(node.textContent) ? 
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
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
                results.push(...traverseShadowRoots(child));
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
            for (let i = uniqueNodes.length - 1; i >= 0; i--) {
                const node = uniqueNodes[i];
                // 检查节点是否仍然在DOM中
                if (node.parentNode && document.contains(node)) {
                    processTextNode(node);
                }
            }
            
            console.log(`已处理 ${uniqueNodes.length} 个文本节点中的链接`);
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
    
    // 公开函数以便调试
    window.convertTextLinks = {
        process: processDocument,
        extractLinks: extractLinks,
        isValidURL: isValidURL,
        testPattern: (text) => {
            COMBINED_PATTERN.lastIndex = 0;
            return COMBINED_PATTERN.test(text);
        },
        isInsideAnchor: isInsideAnchor,
        COMMON_TLDS: COMMON_TLDS
    };
})();