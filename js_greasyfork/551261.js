// ==UserScript==
// @license MIT
// @name         替换百度的 jQuery 为新版 jQuery
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  立即替换已存在的脚本，并监视后续动态添加的脚本。将 http://libs.baidu.com/jquery/2.0.0/jquery.js 替换为 https://code.jquery.com/jquery-2.2.4.js。
// @author       flynaj@gmail.com
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551261/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E7%9A%84%20jQuery%20%E4%B8%BA%E6%96%B0%E7%89%88%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/551261/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E7%9A%84%20jQuery%20%E4%B8%BA%E6%96%B0%E7%89%88%20jQuery.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldSrc = "http://libs.baidu.com/jquery/2.0.0/jquery.js";
    const newSrc = "https://code.jquery.com/jquery-2.2.4.js";

    /**
     * 核心替换函数
     * @param {HTMLScriptElement} node - 要被替换的 script 节点
     */
    const replaceScriptNode = (node) => {
        // 检查以避免重复处理
        if (node.src !== oldSrc) {
            return;
        }

        console.log('Tampermonkey: 发现目标脚本，准备替换:', node.src);

        // 创建一个新节点用于替换，这样可以完全中断旧节点的任何潜在加载行为
        const newScript = document.createElement('script');
        newScript.src = newSrc;
        // 如果原始脚本有其他属性（如 id, class, data-*），你可以在这里复制它们
        // newScript.id = node.id;

        // 在 DOM 中用新节点替换旧节点
        node.parentElement.replaceChild(newScript, node);

        console.log('Tampermonkey: 脚本替换成功！新脚本:', newScript.src);
    };

    // --- 步骤 1: 立即进行同步检查 ---
    // 这是解决 <head> 内脚本问题的关键。
    // 在 document-start 时，DOM 可能不完整，但 <head> 通常已经存在。
    // 我们直接查找这个脚本。
    const existingScript = document.querySelector(`script[src="${oldSrc}"]`);
    if (existingScript) {
        replaceScriptNode(existingScript);
    }


    // --- 步骤 2: 设置 MutationObserver 以捕获动态添加的脚本 ---
    // 这确保了即使脚本是之后由JS代码添加进来的，也能被我们捕获。
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'SCRIPT' && node.src === oldSrc) {
                        replaceScriptNode(node);
                        // 如果你确定页面中只会有一个此脚本，可以取消下面的注释以停止观察
                        // observer.disconnect();
                    }
                });
            }
        }
    });

    // 开始观察整个文档的结构变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();