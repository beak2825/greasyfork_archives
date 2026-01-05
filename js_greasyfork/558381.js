// ==UserScript==
// @name         知乎 - 自用优化
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license MIT
// @description  在知乎网站中：
//               - 将 .css-15kzvwj 的 flex-basis 设为 100%
//               - 将 .css-9u014e 的 flex-basis 设为 0
//               - 将 .css-qwj8x9 的 display 设为 none（隐藏）
//               - 在 <div class="css-1qe0v6x">（且包含子元素 <div class="css-1ssbn0c">）的开头插入文本 ">>"
// @author       mexingchi
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558381/%E7%9F%A5%E4%B9%8E%20-%20%E8%87%AA%E7%94%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558381/%E7%9F%A5%E4%B9%8E%20-%20%E8%87%AA%E7%94%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 修改多个 class 的样式（flex-basis、display）
     */
    function modifyStyles() {
        // 1. .css-15kzvwj → flex-basis: 100%
        document.querySelectorAll('.css-15kzvwj').forEach(el => {
            el.style.flexBasis = '100%';
            console.log('✅ 已设置 .css-15kzvwj flex-basis: 100%', el);
        });

        // 2. .css-9u014e → flex-basis: 0
        document.querySelectorAll('.css-9u014e').forEach(el => {
            el.style.flexBasis = '0';
            console.log('✅ 已设置 .css-9u014e flex-basis: 0', el);
        });

        // 3. .css-qwj8x9 → display: none（隐藏）
        document.querySelectorAll('.css-qwj8x9').forEach(el => {
            el.style.display = 'none';
            console.log('✅ 已设置 .css-qwj8x9 display: none（已隐藏）', el);
        });
    }

function insertDoubleArrow() {
    const containers = document.querySelectorAll('.css-1qe0v6x');

    containers.forEach(container => {

        // 1. 是否包含子元素 <div class="css-1ssbn0c">
        const hasTargetChild = container.querySelector(':scope > .css-1ssbn0c');
        if (!hasTargetChild) return;

        // 2. 找父级 .css-1tww9qq
        const parentBlock = container.closest('.css-1tww9qq');
        if (!parentBlock) return;

        // 3. 判断兄弟节点：后面是否还有另一个 .css-1tww9qq
        let hasNextSiblingBlock = false;
        let next = parentBlock.nextElementSibling;
        while (next) {
            if (next.classList.contains('css-1tww9qq')) {
                hasNextSiblingBlock = true;
                break;
            }
            next = next.nextElementSibling;
        }

        // 如果后面没有其他 css-1tww9qq，就没必要添加 ▶
        if (!hasNextSiblingBlock) return;

        // 4. 判断是否已经插入过 ▶
        let alreadyHasDoubleArrow = false;
        if (container.firstChild && container.firstChild.nodeType === Node.TEXT_NODE) {
            if (container.firstChild.textContent.trim() === '▶') {
                alreadyHasDoubleArrow = true;
            }
        }

        if (!alreadyHasDoubleArrow) {
            const arrowText = document.createTextNode('▶');
            container.insertBefore(arrowText, container.firstChild);
            console.log('▶ 已插入（多用户情境成立）', container);
        }
    });
}


    /**
     * 主函数：执行所有 DOM 与样式修改
     */
    function applyAllChanges() {
        modifyStyles();
        insertDoubleArrow();
    }

    // 页面加载后先执行一次
    applyAllChanges();

    // 监听后续动态加载的内容（比如无限滚动、懒加载等）
    const observer = new MutationObserver(() => {
        applyAllChanges(); // 再次调用，确保新元素也被处理
    });

    // 开始监听 body 的 DOM 变化（子节点增删、嵌套变化）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();