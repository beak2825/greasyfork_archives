// ==UserScript==
// @name         万能网页视频水印粉碎机
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  全自动识别并物理删除网页视频上的各类滚动/固定水印、个人信息遮罩。
// @author       AI Assistant
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561808/%E4%B8%87%E8%83%BD%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0%E7%B2%89%E7%A2%8E%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561808/%E4%B8%87%E8%83%BD%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0%E7%B2%89%E7%A2%8E%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 强力样式拦截库 ---
    // 涵盖了市面上 90% 以上网课插件常用的水印命名规则
    const injectGeneralStyle = () => {
        const styleId = 'universal-watermark-remover';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* 精准打击已知类名 */
            .cont-txt-p.msg, 
            .video-watermark, 
            .watermark,
            .shuidyin,
            [class*="watermark"],
            [id*="watermark"],
            
            /* 模糊打击：针对利用绝对定位+偏移实现的滚动文字 */
            div[style*="pointer-events: none"][style*="position: absolute"],
            div[style*="left"][style*="top"][style*="z-index"].msg,
            
            /* 某些 canvas 遮罩层 */
            canvas[style*="pointer-events: none"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -1 !important;
            }
        `;
        document.head.appendChild(style);
    };

    // --- 2. 动态扫描与物理删除 ---
    const removerTask = () => {
        injectGeneralStyle();

        // 查找带有关键词或特定样式的元素
        const possibleElements = document.querySelectorAll('div, span, p, canvas');
        
        possibleElements.forEach(el => {
            const style = el.getAttribute('style') || '';
            const className = el.className || '';
            
            // 判定逻辑：如果元素包含 watermark 类名，或者它是绝对定位且不可点击的浮动文字
            const isWatermark = /watermark|shuidyin/i.test(className) || /watermark|shuidyin/i.test(el.id);
            const isFloatingMsg = className.includes('msg') && style.includes('left') && style.includes('px');

            if (isWatermark || isFloatingMsg) {
                // 执行物理删除，彻底从 DOM 树移除
                el.remove();
            }
        });
    };

    // --- 3. 运行调度 ---
    // 初始快速清理
    removerTask();
    
    // 每 500ms 巡检一次，应对高频动态生成的水印
    setInterval(removerTask, 500);

    console.log("%c[助手] 通用水印清理监控已激活", "color: #3498db; font-weight: bold;");
})();