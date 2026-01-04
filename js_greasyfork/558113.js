// ==UserScript==
// @name         【页面导出】全页内容自动加载并准备打印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动滚动到页面底部，加载所有懒加载内容，然后调用浏览器打印准备生成PDF。
// @author       ChatGPT-4o (基于已验证的JavaScript滚动加载逻辑)
// @match        *://*/*
// @grant        window.setTimeout
// @grant        window.scroll
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558113/%E3%80%90%E9%A1%B5%E9%9D%A2%E5%AF%BC%E5%87%BA%E3%80%91%E5%85%A8%E9%A1%B5%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%B9%B6%E5%87%86%E5%A4%87%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558113/%E3%80%90%E9%A1%B5%E9%9D%A2%E5%AF%BC%E5%87%BA%E3%80%91%E5%85%A8%E9%A1%B5%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%B9%B6%E5%87%86%E5%A4%87%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置参数 ===
    // 每次滚动的等待时间（毫秒）。
    // 增加此值可以提高加载成功率，但会延长总时间。
    const SCROLL_INTERVAL = 1000;
    // 每次滚动的像素距离。
    const SCROLL_STEP = 500;
    // 最大滚动次数（防止无限循环）。
    const MAX_SCROLL_ATTEMPTS = 500;
    // 滚动完成后，等待内容稳定加载的时间（毫秒）。
    const POST_SCROLL_WAIT = 3000;

    // === 主要函数 ===
    function autoScrollAndPrint() {
        console.log('【全页导出脚本】开始执行自动滚动加载...');

        let previousHeight = 0;
        let attempts = 0;

        /**
         * 检查当前页面高度是否增加，如果没有增加，则认为加载完成。
         */
        function checkAndScroll() {
            // 获取当前文档的实际高度
            const currentHeight = document.documentElement.scrollHeight;

            // 滚动到当前页面最底部
            window.scrollBy(0, SCROLL_STEP);

            attempts++;

            console.log(`尝试 ${attempts}: 页面高度 ${currentHeight}px`);

            // 如果当前高度和上次的高度相同，并且已经滚动到了底部，说明加载完毕
            // 或者达到了最大尝试次数，停止滚动
            if (currentHeight === previousHeight && (window.innerHeight + window.scrollY) >= currentHeight || attempts >= MAX_SCROLL_ATTEMPTS) {
                console.log('【全页导出脚本】内容加载完毕或达到最大尝试次数，停止滚动。');

                // 确保滚动到最底部
                window.scrollTo(0, document.body.scrollHeight);

                // 等待 POST_SCROLL_WAIT，让图片等资源有时间稳定加载
                console.log(`【全页导出脚本】等待 ${POST_SCROLL_WAIT / 1000} 秒，准备调用打印...`);
                setTimeout(() => {
                    console.log('【全页导出脚本】调用浏览器打印功能...');
                    // 调用浏览器的打印对话框
                    window.print();

                    // 提示用户下一步操作
                    alert('自动加载完成，请在弹出的打印对话框中选择“另存为 PDF”并保存文件。');
                }, POST_SCROLL_WAIT);

                return;
            }

            // 更新上一次的高度，并继续下一次滚动
            previousHeight = currentHeight;
            setTimeout(checkAndScroll, SCROLL_INTERVAL);
        }

        // 第一次调用
        // 为了确保初始内容加载完毕，可以先等待一小段时间
        setTimeout(checkAndScroll, 500);
    }

    // 可以在页面加载完成后，设置一个快捷键或按钮来触发，
    // 这里为了实现“最简单方案”，我们直接在页面加载完成后延迟执行。
    window.addEventListener('load', function() {
         console.log('【全页导出脚本】页面加载完成。');

         // 为了避免脚本自动在所有页面运行，导致用户体验不佳，建议手动触发。
         // 我们添加一个按钮作为最简单的手动触发方式。
         const btn = document.createElement('button');
         btn.textContent = '一键加载并转PDF';
         btn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px;';
         btn.onclick = autoScrollAndPrint;
         document.body.appendChild(btn);

         // 如果您坚持要自动运行，可以将 autoScrollAndPrint() 放在这里，
         // 但这可能会影响某些网页的正常加载。
         // 示例：
         // setTimeout(autoScrollAndPrint, 5000);

         console.log('【全页导出脚本】已添加“一键加载并转PDF”按钮。');
    });

})();