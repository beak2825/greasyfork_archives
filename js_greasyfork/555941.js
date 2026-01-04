// ==UserScript==
// @name         链接新页面打开助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使页面上的所有链接在新标签页中打开
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
 
// @downloadURL https://update.greasyfork.org/scripts/555941/%E9%93%BE%E6%8E%A5%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555941/%E9%93%BE%E6%8E%A5%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    /**
     * 主函数：设置所有链接在新页面打开
     */
    function setLinksToOpenInNewTab() {
        // 获取页面中的所有链接元素
        const links = document.querySelectorAll('a');
 
        // 遍历所有链接并设置target属性为_blank
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            // 可选：添加视觉提示，表示链接会在新页面打开
            link.style.borderBottom = '1px dashed #ff0000';
        });
 
        console.log(`已修改 ${links.length} 个链接，将在新标签页打开`);
    }
 
    /**
     * 处理动态加载的内容
     * 使用MutationObserver监听DOM变化，确保新添加的链接也会被处理
     */
    function observeDynamicContent() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 检查是否为元素节点
                        const newLinks = node.querySelectorAll ? node.querySelectorAll('a') : [];
                        if (node.tagName === 'A') {
                            // 如果添加的节点本身就是链接
                            node.setAttribute('target', '_blank');
                            node.style.borderBottom = '1px dashed #ff0000';
                        }
                        newLinks.forEach(link => {
                            link.setAttribute('target', '_blank');
                            link.style.borderBottom = '1px dashed #ff0000';
                        });
                    }
                });
            });
        });
 
        // 开始观察文档主体及其子节点的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    // 页面加载完成后执行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setLinksToOpenInNewTab();
            observeDynamicContent();
        });
    } else {
        // DOM已经加载完成，直接执行
        setLinksToOpenInNewTab();
        observeDynamicContent();
    }
 
    // 可选：添加键盘快捷键支持（Ctrl+点击在新页面打开）
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A' && event.ctrlKey) {
            event.preventDefault();
            window.open(target.href, '_blank');
        }
    }, true);
})();
