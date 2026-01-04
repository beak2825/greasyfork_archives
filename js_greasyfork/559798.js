// ==UserScript==
// @name         Gemini Code Block Scroller (v1.2)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  强制 Gemini 代码块内部滚动。双击代码区域切换“折叠/展开”。
// @author       Gemini User
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559798/Gemini%20Code%20Block%20Scroller%20%28v12%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559798/Gemini%20Code%20Block%20Scroller%20%28v12%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    // 建议：调试时设为 '300px'，确认生效后可改为 '70vh' 或 '80vh'
    const CONFIG = {
        maxHeight: '300px',      // 限制高度（设小一点以便立刻看到效果）
        transitionTime: '0.2s'   // 动画速度
    };
    // ===========================================

    GM_addStyle(`
        /* === 核心功能：限制高度 + 内部滚动 === */
        /* 使用更具体的选择器，防止被覆盖 */
        .code-block .formatted-code-block-internal-container pre {
            max-height: ${CONFIG.maxHeight} !important;
            overflow-y: auto !important;
            overflow-x: auto !important; /* 水平方向也允许滚动 */
            display: block !important;
            
            /* 交互提示：默认显示“放大镜”，暗示可点击 */
            cursor: zoom-in !important;
            
            /* 动画效果 */
            transition: max-height ${CONFIG.transitionTime} ease-out;
            
            /* 底部留白，防止最后一行代码太贴底 */
            padding-bottom: 20px !important;
            border-bottom: 2px solid rgba(138, 180, 248, 0.1); /* 底部加一条隐约的线 */
        }

        /* === 展开状态 (Expanded) === */
        /* JS 切换此类名来实现展开 */
        .code-block .formatted-code-block-internal-container pre.gm-expanded {
            max-height: none !important; /* 取消限制，由内容撑开 */
            cursor: zoom-out !important; /* 展开后显示“缩小镜” */
        }

        /* === 标题栏悬浮优化 === */
        /* 确保标题栏不随代码滚动，始终吸附在顶部（如果父级允许）或保持在上方 */
        .code-block-decoration {
            z-index: 10 !important;
            position: relative;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15); /* 加深阴影，增加层次感 */
        }

        /* === 滚动条美化 (Windows下不仅好用而且要好看) === */
        /* 垂直滚动条 */
        .formatted-code-block-internal-container pre::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        /* 轨道 */
        .formatted-code-block-internal-container pre::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
        }
        /* 滑块 */
        .formatted-code-block-internal-container pre::-webkit-scrollbar-thumb {
            background-color: rgba(95, 99, 104, 0.5);
            border: 3px solid transparent;
            background-clip: content-box;
            border-radius: 99px;
        }
        /* 滑块悬停 */
        .formatted-code-block-internal-container pre::-webkit-scrollbar-thumb:hover {
            background-color: rgba(144, 148, 154, 0.8);
        }
    `);

    // === JS 交互逻辑 ===
    // 监听全局双击事件，使用“事件委托”处理动态加载的代码块
    document.addEventListener('dblclick', function(e) {
        // 寻找点击目标是否在 pre 标签内部
        // 使用 closest 向上查找，哪怕你点的是代码里的某个高亮关键词 span 也能识别到
        const preBlock = e.target.closest('.formatted-code-block-internal-container pre');
        
        if (preBlock) {
            // 阻止默认行为（防止双击选中一大片代码文字，干扰体验）
            e.preventDefault();
            // 清除可能已经产生的选区
            window.getSelection()?.removeAllRanges();
            
            // 切换类名，触发 CSS 变化
            preBlock.classList.toggle('gm-expanded');
            
            console.log('Gemini Scroller: 切换代码块展开状态');
        }
    });

    console.log('Gemini Scroller v1.2: 已加载，高度限制 ' + CONFIG.maxHeight);
})();