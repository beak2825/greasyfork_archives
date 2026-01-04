// ==UserScript==
// @name         微博磁链补全助手
// @namespace    https://github.com/RiTian96/SurfHelper
// @version      1.1.1
// @description  [核心] 智能识别40位磁力哈希值，自动补全magnet前缀；[功能] 一键转换为可点击链接，提升分享体验；[安全] 过滤机制避免误匹配，保护链接代码等元素
// @author       RiTian96
// @match        *://weibo.com/*
// @match        *://s.weibo.com/*
// @match        *://d.weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557751/%E5%BE%AE%E5%8D%9A%E7%A3%81%E9%93%BE%E8%A1%A5%E5%85%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557751/%E5%BE%AE%E5%8D%9A%E7%A3%81%E9%93%BE%E8%A1%A5%E5%85%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 磁力链哈希的正则：40位，数字或A-F字母，忽略大小写
    // \b 确保是独立单词，避免匹配到长URL中间的一部分
    const MAGNET_REGEX = /\b([a-fA-F0-9]{40})\b/g;
    const MAGNET_PREFIX = 'magnet:?xt=urn:btih:';

    // 处理文本节点的函数
    function processTextNode(textNode) {
        // 如果父节点已经是链接、脚本、样式或输入框，则跳过
        const parentTag = textNode.parentNode.tagName;
        if (['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(parentTag)) {
            return;
        }
        
        // 避免处理已经生成过的磁力链接
        if (textNode.parentNode.dataset.generatedMagnet === "true") {
            return;
        }

        const text = textNode.nodeValue;

        // 如果没有匹配到 40 位哈希，直接返回
        if (!MAGNET_REGEX.test(text)) return;

        // 创建文档片段用于替换
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        // 重置正则索引
        MAGNET_REGEX.lastIndex = 0;

        while ((match = MAGNET_REGEX.exec(text)) !== null) {
            const hash = match[1];
            const matchIndex = match.index;

            // 添加匹配前的文本
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));

            // 创建链接元素
            const a = document.createElement('a');
            const fullLink = MAGNET_PREFIX + hash;

            a.href = fullLink;
            a.textContent = fullLink; // 按照你的要求，显示出来的文字也带上头子
            // a.textContent = hash;  // 如果只想显示哈希但点击是磁力链，用这一行

            // 设置样式，使其醒目（参考微博链接颜色）
            a.style.color = '#eb7350';
            a.style.textDecoration = 'none';
            a.style.fontWeight = 'bold';
            a.style.padding = '2px 4px';
            a.style.borderRadius = '3px';
            a.style.backgroundColor = 'rgba(235, 115, 80, 0.1)';
            a.style.transition = 'all 0.2s ease';
            a.target = '_blank'; // 新窗口打开（通常会唤起下载软件）
            
            // 添加悬停效果
            a.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(235, 115, 80, 0.2)';
                this.style.textDecoration = 'underline';
            });
            
            a.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'rgba(235, 115, 80, 0.1)';
                this.style.textDecoration = 'none';
            });

            // 加上一个标识，防止重复处理（虽然通过检测父节点是 A 已经规避了，但双重保险）
            a.dataset.generatedMagnet = "true";

            fragment.appendChild(a);

            lastIndex = matchIndex + hash.length;
        }

        // 添加剩余的文本
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

        // 用处理后的片段替换原文本节点
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    // 遍历 DOM 节点的函数
    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 忽略特定标签和已处理过的容器
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'IMG', 'NOSCRIPT'].includes(node.tagName)) return;
            
            // 避免重复处理已标记的容器
            if (node.dataset.magnetProcessed === "true") return;
            
            // 标记为已处理
            node.dataset.magnetProcessed = "true";

            // 遍历子节点
            // 使用 Array.from防止在遍历过程中修改DOM导致的死循环风险
            Array.from(node.childNodes).forEach(walk);
        }
    }

    // 1. 初次加载：等待页面完全加载后再处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => walk(document.body));
    } else {
        // 如果页面已经加载完成，延迟一下确保动态内容加载完毕
        setTimeout(() => walk(document.body), 500);
    }

    // 2. 监听器：处理动态加载的内容（瀑布流、评论展开等）
    const observer = new MutationObserver((mutations) => {
        // 使用 requestAnimationFrame 优化性能，避免频繁操作DOM
        requestAnimationFrame(() => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    // 只处理元素节点，忽略文本节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        walk(node);
                    }
                }
            }
        });
    });

    // 开始监听 document.body 的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        // 优化：忽略属性变化，只关心节点添加
        attributes: false,
        characterData: false
    });

})();