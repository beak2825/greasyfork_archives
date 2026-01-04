// ==UserScript==
// @name         91Porny – 8列 + 宽度90% + 隐藏footer + 匿名文本高亮
// @namespace    -
// @version      1.3
// @description  视频列表8列（平板）、全站宽度90%、不显示网页底部footer、自动高亮页面内的"匿名"文本
// @author       you
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560484/91Porny%20%E2%80%93%208%E5%88%97%20%2B%20%E5%AE%BD%E5%BA%A690%25%20%2B%20%E9%9A%90%E8%97%8Ffooter%20%2B%20%E5%8C%BF%E5%90%8D%E6%96%87%E6%9C%AC%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/560484/91Porny%20%E2%80%93%208%E5%88%97%20%2B%20%E5%AE%BD%E5%BA%A690%25%20%2B%20%E9%9A%90%E8%97%8Ffooter%20%2B%20%E5%8C%BF%E5%90%8D%E6%96%87%E6%9C%AC%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 0. 屏蔽 $m('rd3',...)  先备份原函数，再过滤调用 */
    const orig$m = window.$m;
    Object.defineProperty(window, '$m', {
        value: function(id, ...args){
            if(id === 'rd3') return;   // 直接忽略 rd3
            if(orig$m) return orig$m.apply(this, [id, ...args]);
        },
        writable: false,
        configurable: false
    });

    /* 1. 8列：补充 Bulma 缺失的 1/8 类 */
    GM_addStyle(`
        .is-one-eighth-tablet {
            flex: none !important;
            width: 12.5% !important;
        }
    `);

    /* 2. 全站宽度 90% */
    GM_addStyle(`
        .container,
        section.container,
        main.container,
        footer .container {
            width: 90vw !important;
            max-width: 90vw !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
    `);

    /* 3. 隐藏 footer（整个底部） */
    GM_addStyle(`
        footer.footer,
        footer {
            display: none !important;
        }
    `);

    /* 4. 添加匿名文本高亮样式 */
    GM_addStyle(`
        .highlight-anonymous {
            background-color: #ffeb3b !important;
            color: #000 !important;
            font-weight: bold !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
        }
    `);

    /* 5. 查找并高亮页面中的"匿名"文本 */
    function highlightAnonymousText() {
        // 创建一个临时的范围对象来查找文本
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.nodeValue && node.nodeValue.includes('匿名')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodesToProcess = [];
        let node;
        while (node = walker.nextNode()) {
            nodesToProcess.push(node);
        }

        nodesToProcess.forEach(textNode => {
            const parentElement = textNode.parentElement;
            if (!parentElement.classList.contains('highlight-anonymous')) {
                const content = textNode.nodeValue;
                const highlightedContent = content.replace(/匿名/g, '<span class="highlight-anonymous">匿名</span>');

                const wrapper = document.createElement('div');
                wrapper.innerHTML = highlightedContent;

                // 将包装元素的内容插入到原文本节点的位置
                const fragment = document.createDocumentFragment();
                while (wrapper.firstChild) {
                    fragment.appendChild(wrapper.firstChild);
                }

                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    /* 6. 动态把 4 列改 8 列 */
    function fixColumns() {
        document.querySelectorAll('.column.is-one-quarter-tablet')
            .forEach(col => {
            col.classList.remove('is-one-quarter-tablet');
            col.classList.add('is-one-eighth-tablet');
        });

        // 同时重新高亮匿名文本
        highlightAnonymousText();
    }

    // 初始执行
    fixColumns();

    // 监听DOM变化
    new MutationObserver(fixColumns)
        .observe(document.body, { childList: true, subtree: true });
})();