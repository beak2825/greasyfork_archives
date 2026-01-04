// ==UserScript==
// @name         OTTOhub Linker
// @namespace    https://www.ottohub.cn/space/11481
// @version      1.3.2
// @description  为OTTOhub的某些纯文本代号添加超链接,支持移动端和桌面端
// @author       Gemini&OctoberSama
// @license      WTFPL 2.0
// @match        https://www.ottohub.cn/*
// @match        https://m.ottohub.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556975/OTTOhub%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/556975/OTTOhub%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 1. 正则表达式配置
     * (ov|ob|av|sm)(\d+) : 前缀+纯数字
     * (bv)([a-zA-Z0-9]+) : bv+字母数字
     * (uid)([:： ]?)(\d+) : uid+分隔符+数字
     */
    const regex = /(ov|ob|av|sm)(\d+)|(bv)([a-zA-Z0-9]+)|(uid)([:： ]?)(\d+)/gi;

    /**
     * 2. 禁止替换的标签选择器列表 (黑名单)
     */
    const forbiddenSelector = [
        'a', 'script', 'style', 'textarea', 'input', 'button', 'select', 'option', 'optgroup', 'label',
        'code', 'pre', '[contenteditable="true"]',
        'video', 'audio', 'img', 'svg', 'canvas', 'map', 'area', 'track',
        'embed', 'object', 'iframe', 'param', 'source'
    ].join(', ');

    /**
     * 生成对应的 URL
     */
    function generateUrl(prefix, content) {
        const p = prefix.toLowerCase();
        const hostname = window.location.hostname;
        const isMobile = hostname === 'm.ottohub.cn';

        if (p === 'sm') return `https://www.nicovideo.jp/watch/${prefix}${content}`;
        if (p === 'av' || p === 'bv') return `https://www.bilibili.com/video/${prefix}${content}`;
        if (p === 'ov') return `/v/${content}`;
        if (p === 'ob') return isMobile ? `/b/${content}` : `/blog/detail/${content}`;
        if (p === 'uid') return isMobile ? `/u/${content}` : `/space/${content}`;
        return '#';
    }

    /**
     * 【核心逻辑】处理单个文本节点
     * 将原来嵌套在 TreeWalker 里的逻辑提取出来
     */
    function handleTextNode(node) {
        // 1. 基本检查
        if (!node.nodeValue) return;

        // 2. 黑名单检查 (检查父级)
        if (node.parentElement && node.parentElement.closest(forbiddenSelector)) {
            return;
        }

        // 3. 正则预检测 (避免不必要的计算)
        regex.lastIndex = 0;
        if (!regex.test(node.nodeValue)) {
            return;
        }

        // 4. 执行替换
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        regex.lastIndex = 0; // 确保从头开始

        while ((match = regex.exec(text)) !== null) {
            // 添加匹配前的文本
            const plainText = text.substring(lastIndex, match.index);
            if (plainText) {
                fragment.appendChild(document.createTextNode(plainText));
            }

            // 解析匹配项
            let prefix, content;
            if (match[1]) {
                prefix = match[1]; content = match[2];
            } else if (match[3]) {
                prefix = match[3]; content = match[4];
            } else {
                prefix = match[5]; content = match[7];
            }

            // 创建链接
            const link = document.createElement('a');
            link.href = generateUrl(prefix, content);
            link.textContent = match[0];
            link.target = "_blank";
            link.className = "ottohub-auto-link";
            // 移动端可能需要强制一点样式来显示链接感，或者继承默认
            // link.style.color = "#039be5";

            fragment.appendChild(link);

            lastIndex = regex.lastIndex;
        }

        // 添加剩余文本
        const remainingText = text.substring(lastIndex);
        if (remainingText) {
            fragment.appendChild(document.createTextNode(remainingText));
        }

        // 只有当真正发生了替换时才修改 DOM
        if (lastIndex > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    }

    /**
     * 遍历节点逻辑
     */
    function processNode(root) {
        // 【关键修复】如果传入的直接是文本节点，直接处理，不再走 TreeWalker
        if (root.nodeType === Node.TEXT_NODE) {
            handleTextNode(root);
            return;
        }

        // 如果是元素节点，才使用 TreeWalker 遍历其内部
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null, // 过滤逻辑已移至 handleTextNode 内部
            false
        );

        const nodesToProcess = [];
        while (walker.nextNode()) {
            nodesToProcess.push(walker.currentNode);
        }

        nodesToProcess.forEach(handleTextNode);
    }

    // 1. 初始执行
    processNode(document.body);

    // 2. 监听动态加载
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 情况A：新增了节点 (包含 TextNode 或 Element)
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 忽略脚本自身添加的链接
                    if (node.nodeType === 1 && node.classList.contains("ottohub-auto-link")) return;
                    processNode(node);
                });
            }
            // 情况B：文本节点的内容直接改变了 (Vue等框架常见操作)
            else if (mutation.type === 'characterData') {
                // 直接处理变动的文本节点
                handleTextNode(mutation.target);
            }
        });
    });

    // 配置监听：增加 characterData 以捕捉纯文本变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

})();