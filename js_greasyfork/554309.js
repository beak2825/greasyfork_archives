// ==UserScript==
// @name         Force Links in Current Tab
// @name:zh-CN   强制链接在当前标签页打开
// @namespace    http://tampermonkey.net/
// @version      2025.12.20
// @description  Forces all links (a tags) and window.open() to open in the current tab (_self).
// @description:zh-CN  强制所有链接 (a 标签) 和 JavaScript 的 window.open() 都在当前标签页中打开，并处理鼠标中键点击。
// @author      庄引X@https://x.com/zhuangyin8
// @match        *://*/*
// @grant        none
// @license MIT 
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554309/Force%20Links%20in%20Current%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/554309/Force%20Links%20in%20Current%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 修补 (Patch) window.open ---
    // 必须在 @run-at document-start 模式下运行，以确保在页面上任何脚本之前执行
    const originalWindowOpen = window.open;

    window.open = function(url, target, features, replace) {
        // 打印日志以便调试 (可选)
        // console.log(`[Force Current Tab] window.open called: url=${url}, target=${target}`);

        // 强制 target 为 _self
        // 将参数转换为数组，以便安全修改
        const args = [...arguments];

        if (args.length < 2) {
            // 如果只有 url，默认是新窗口，我们添加 _self
            args[1] = '_self';
        } else {
            // 如果有 target，我们强制覆盖为 _self
            args[1] = '_self';
        }

        // 使用 .apply 来调用原始函数，保持正确的 'this' 上下文和修改后的参数
        return originalWindowOpen.apply(this, args);
    };

    // --- 2. 处理页面上现有的和动态添加的 <a> 标签 ---

    /**
     * 辅助函数：处理单个节点或节点树中的所有 <a> 标签
     * @param {Node} node - 要处理的根节点 (例如 document.body 或新添加的元素)
     */
    const processLinks = (node) => {
        // 确保我们有 querySelectorAll 方法 (即它是一个元素)
        if (!node || typeof node.querySelectorAll !== 'function') {
            return;
        }

        // 查找所有 <a> 标签
        const links = node.querySelectorAll('a');
        links.forEach(link => {
            if (link.target && link.target !== '_self') {
                // console.log(`[Force Current Tab] Fixing link: ${link.href}`);
                link.target = '_self';

                // 移除 rel=noopener 和 rel=noreferrer，因为它们主要用于新标签页
                // link.removeAttribute('rel');
                // 注意：移除 'rel' 可能会破坏某些网站样式或功能，所以保持修改 target 即可
            }
        });
    };

    // --- 3. 页面加载时执行一次 ---
    document.addEventListener('DOMContentLoaded', () => {
        processLinks(document.body);
    });

    // --- 4. 使用 MutationObserver 监视动态添加的 <a> 标签 ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(newNode => {
                    // 检查新添加的节点本身是否是 <a>
                    if (newNode.tagName === 'A' && newNode.target && newNode.target !== '_self') {
                        newNode.target = '_self';
                    }
                    // 检查新添加的节点是否 *包含* <a> 标签
                    if (newNode.nodeType === Node.ELEMENT_NODE) {
                        processLinks(newNode);
                    }
                });
            }
        }
    });

    // 等待 body 出现后再开始观察
    // 因为脚本在 document-start 运行，body 可能还不存在
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- 5. 拦截鼠标中键点击 (auxclick) ---
    // 这将阻止中键在新标签页中打开链接
    document.addEventListener('auxclick', (e) => {
        if (e.button === 1) { // 1 = 鼠标中键
            const link = e.target.closest('a[href]');
            if (link) {
                // 阻止默认的中键点击行为（在新标签页打开）
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 在当前标签页导航
                window.location.href = link.href;
            }
        }
    }, true); // 使用捕获阶段 (true) 来确保在任何其他脚本之前运行

    // --- 6. 拦截普通点击 (作为最后的保险) ---
    // 尽管 MutationObserver 应该已经处理了，
    // 但这个捕获阶段的点击监听器可以捕获到任何“漏网之鱼”。
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (link && link.target && link.target !== '_self') {
            // 确保 target 在点击时也被设置为 _self
            link.target = '_self';
        }
    }, true); // 同样使用捕获阶段

})();