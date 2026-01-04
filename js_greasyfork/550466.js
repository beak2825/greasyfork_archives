// ==UserScript==
// @name         X.com 私信列表模糊处理
// @name:en      X.com DM Blur
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  隐藏 X.com 私信列表。鼠标悬停在区域上时，所有对话会清晰显示。此版本极其稳定，并支持多语言。
// @description:en Reliably hides the DM list on X.com by blurring the entire conversations section. The section becomes clear on hover. This version is extremely stable and supports multiple languages.
// @author       BlingCc
// @match        https://x.com/*
// @match        https://x.com/messages/*
// @match        https://x.com/messages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550466/Xcom%20%E7%A7%81%E4%BF%A1%E5%88%97%E8%A1%A8%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/550466/Xcom%20%E7%A7%81%E4%BF%A1%E5%88%97%E8%A1%A8%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 注入CSS样式 (Inject CSS Styles) ---
    // 定义一个作用于整个容器的模糊类。这部分设计得很好，无需改动。
    const style = document.createElement('style');
    style.textContent = `
        /* 模糊容器的样式 */
        .dm-blur-section-container {
            /* 核心模糊效果 */
            filter: blur(5px);
            /* 平滑过渡动画 */
            transition: filter 0.2s ease-in-out;
            /* 解决边缘模糊不清晰的问题 */
            padding-top: 5px;
            margin-top: -5px;
        }

        /* 鼠标悬停在容器上时，移除模糊 */
        .dm-blur-section-container:hover {
            filter: blur(0);
        }
    `;
    document.head.appendChild(style);


    // --- 2. 核心处理函数 (Core Processing Function) ---
    // 这个函数负责找到目标元素并应用模糊效果。
    function processAndBlur() {
        // 【关键优化】使用 XPath 同时查找中文“所有对话”和英文“All conversations”。
        // This makes the script work regardless of the user's UI language.
        const headingXpath = "//h2[.//span[contains(text(), '所有对话') or contains(text(), 'All conversations')]]";
        const heading = document.evaluate(headingXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 如果没有找到标题，说明元素还未加载，直接返回。
        if (!heading) {
            return;
        }

        // 找到标题后，向上追溯找到它所属的 <section> 容器。
        const conversationSection = heading.closest('section');

        if (!conversationSection) {
            return;
        }

        // 检查这个 section 是否已经被处理过，避免重复添加类。
        if (!conversationSection.classList.contains('dm-blur-section-container')) {
            console.log('Tampermonkey: 找到了私信列表区域，正在应用模糊效果。');
            // 将我们定义好的CSS类添加到这个区域上。
            conversationSection.classList.add('dm-blur-section-container');
        }
    }


    // --- 3. 监听动态加载 (Listen for Dynamic Content) ---
    // 这就是实现“监听动态加载”的核心。
    // X.com 是一个单页应用(SPA)，内容是通过 JavaScript 动态添加到页面上的，而不是通过传统的页面刷新。
    // MutationObserver 是一个现代浏览器API，它能高效地监视DOM树的变化（例如，元素的添加或删除）。
    console.log('Tampermonkey: X.com DM 模糊脚本已启动，正在监听页面变化...');

    const observer = new MutationObserver((mutations) => {
        // 当页面有任何变动时，这个回调函数就会被触发。
        // 我们不需要关心具体的变动内容(mutations)，只需要再次运行我们的检查函数即可。
        processAndBlur();
    });

    // --- 4. 启动监控 (Start Observing) ---
    // 我们告诉 observer 去监控整个 `document.body`。
    // `childList: true` 表示我们关心子节点的增加或删除。
    // `subtree: true` 表示我们关心所有后代节点的变化，而不仅仅是直接子节点。
    // 这个配置确保了无论私信列表在哪里、在什么时候被加载进来，我们都能捕捉到这个变化。
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // --- 5. 初始执行 (Initial Execution) ---
    // 为了应对脚本加载时目标元素可能已经存在的情况，我们先立即执行一次。
    // 然后再设置一个短暂的延时再次执行，作为双重保险，应对那些在初始渲染中稍晚出现的元素。
    // 之后的所有动态加载，都将由上面的 MutationObserver 来处理。
    processAndBlur();
    setTimeout(processAndBlur, 500);

})();