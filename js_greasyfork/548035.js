// ==UserScript==
// @name         scihub助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  点击doi号码可以复制并自动跳转到scihub
// @author       LinXingJun
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548035/scihub%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548035/scihub%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DOI正则表达式
    // 匹配格式：10.xxxx/任意字符（至少1个）
    const doiRegex = /\b10\.\d{4,9}\/[-._;()\/:A-Z0-9a-z]+\b/g;

    // 匹配包含doi:前缀的格式
    const doiWithPrefixRegex = /\bdoi:\s*(10\.\d{4,9}\/[-._;()\/:A-Z0-9a-z]+)\b/gi;

    // 高亮样式
    const highlightStyle = 'background-color: #ffeb3b; color: #000; font-weight: bold; padding: 2px 4px; border-radius: 3px;';

    // 创建样式元素
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .doi-highlight {
                background-color: #ffeb3b !important;
                color: #000 !important;
                font-weight: bold !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
            }
            .doi-highlight:hover {
                background-color: #ffc107 !important;
                transform: scale(1.05) !important;
            }
            .doi-highlight.clicked {
                background-color: #4caf50 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    }
function isEditableOrInput(element) {
    // 检查元素本身是否可编辑
    if (element.isContentEditable) {
        return true;
    }
    // 检查元素是否为常见的表单输入控件
    const tagName = element.tagName?.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return true;
    }
    // 检查是否有特殊的只读属性 (虽然对于 input/textarea 更常见)
    if (element.hasAttribute && element.hasAttribute('contenteditable') && element.getAttribute('contenteditable').toLowerCase() === 'true') {
         // 注意：上面的 isContentEditable 通常已经覆盖了这个
    }
    // 向上遍历祖先元素，检查是否有可编辑的祖先 (对于 contenteditable 容器内的情况)
    let parent = element.parentElement;
    while (parent) {
        if (parent.isContentEditable) {
            return true;
        }
        // 检查祖先是否是表单控件容器（虽然不太常见，但保险起见）
        const parentTagName = parent.tagName?.toLowerCase();
        if (parentTagName === 'input' || parentTagName === 'textarea' || parentTagName === 'select') {
             // 理论上 input/textarea 不应该包含其他元素，但为了健壮性检查
             return true;
        }
        parent = parent.parentElement;
    }
    return false;
}
    // 高亮DOI函数
    function highlightDOIs() {
        // 获取所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        // 收集所有文本节点
        while (node = walker.nextNode()) {
            if (node.nodeValue && (doiRegex.test(node.nodeValue) || doiWithPrefixRegex.test(node.nodeValue)) && !(isEditableOrInput(node))) {
                textNodes.push(node);
            }
        }

        // 处理每个包含DOI的文本节点
        textNodes.forEach(node => {
            const parent = node.parentNode;
            if (parent && !parent.classList.contains('doi-highlight')) {
                const text = node.nodeValue;

                // 检查是否已经处理过
                if (text.includes('doi-highlight')) return;

                // 替换DOI为高亮元素
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                let match;

                // 重置正则表达式的lastIndex
                doiRegex.lastIndex = 0;
                doiWithPrefixRegex.lastIndex = 0;

                // 先处理带doi:前缀的
                const withPrefixMatches = [];
                while ((match = doiWithPrefixRegex.exec(text)) !== null) {
                    withPrefixMatches.push({
                        index: match.index,
                        match: match[0],
                        doi: match[1]
                    });
                }

                // 处理不带前缀的
                const withoutPrefixMatches = [];
                while ((match = doiRegex.exec(text)) !== null) {
                    // 检查这个DOI是否已经被带前缀的匹配包含了
                    let isContained = false;
                    for (let prefixMatch of withPrefixMatches) {
                        if (match.index >= prefixMatch.index &&
                            match.index < prefixMatch.index + prefixMatch.match.length) {
                            isContained = true;
                            break;
                        }
                    }
                    if (!isContained) {
                        withoutPrefixMatches.push({
                            index: match.index,
                            match: match[0],
                            doi: match[1]
                        });
                    }
                }

                // 合并所有匹配并按位置排序
                const allMatches = [...withPrefixMatches, ...withoutPrefixMatches]
                    .sort((a, b) => a.index - b.index);

                // 处理匹配项
                allMatches.forEach((matchObj, i) => {
                    const { index, match, doi } = matchObj;

                    // 添加匹配前的文本
                    if (index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                    }

                    // 创建高亮元素
                    const span = document.createElement('span');
                    span.className = 'doi-highlight';
                    span.textContent = match;
                    span.dataset.doi = doi;

                    // 添加点击事件
                    span.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(e.target.textContent);
                        window.open(`https://www.sci-hub.se/${e.target.textContent}`, '_blank', 'noopener,noreferrer');
                    });

                    fragment.appendChild(span);
                    lastIndex = index + match.length;
                });

                // 添加剩余文本
                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                // 替换原文本节点
                if (fragment.hasChildNodes()) {
                    parent.replaceChild(fragment, node);
                }
            }
        });
    }



    // 初始化
    function init() {
        addStyles();
        highlightDOIs();
        var observer = new MutationObserver(highlightDOIs);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();