// ==UserScript==
// @name         YouMind Core Styles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化YouMind字体显示：Gemini排版风格，对 AI回复 和 笔记 可视化优化 (无代码折叠)
// @author       YouMind User
// @match        https://youmind.com/*
// @match        https://*.youmind.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564299/YouMind%20Core%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/564299/YouMind%20Core%20Styles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        /* 1. 引入 Inter 和 Roboto 字体 */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap');

        /* 2. 全局基础设定 (Webkit 字体平滑) */
        body, #app, .app-container {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            color: #1f1f1f;
        }

        /* ==========================================================================
           PART A: 基础设置 (对 AI回复 和 用户提问 都生效)
           仅统一字体和字号 (Gemini 风格: 16px)
           ========================================================================== */
        
        .ym-askai-content,          /* AI 回复区域 */
        .ym-ask-user-content,       /* 用户提问区域 */
        .prose                      /* 通用文章区域 */
        {
            font-family: "Google Sans", "Inter", "Roboto", sans-serif;
            font-size: 16px !important; /* Gemini 标准字号 */
        }

        /* ==========================================================================
           PART B: 排版与布局优化 (针对 AI 回复区 + 笔记编辑器区)
           ========================================================================== */

        /* 扩展选择器：包含笔记编辑器 (.tiptap, .ProseMirror) */
        /* 1. 段落 (p) 优化 */
        .ym-askai-content p,
        .prose p,
        .tiptap p,
        .ProseMirror p {
            line-height: 1.75 !important;
            letter-spacing: 0.01em;
            margin-bottom: 1.25em !important;
            font-weight: 400;
        }

        /* 2. 列表 (ul, ol) 优化 */
        /* Chat View (AI回复区) - 需要 1.5em 缩进 */
        .ym-askai-content ul, .ym-askai-content ol,
        .prose ul, .prose ol {
            padding-left: 1.5em !important;
            margin-bottom: 1.25em !important;
            list-style-position: outside;
        }
        
        /* Note View (编辑器区) - 编辑器自带 LI 缩进，所以容器不要缩进，否则会双倍缩进 */
        .tiptap ul, .tiptap ol,
        .ProseMirror ul, .ProseMirror ol {
            padding-left: 0 !important; /* Fix: 移除容器缩进，解决笔记视图缩进过大问题 */
            margin-bottom: 1.25em !important;
            list-style-position: outside;
        }

        /* 3. 列表项 (li) 优化 - 解决拥挤问题 */
        .ym-askai-content li,
        .prose li,
        .tiptap li,
        .ProseMirror li {
            line-height: 1.75 !important;
            margin-bottom: 0.75em !important;
            margin-top: 0.25em !important;
            font-weight: 400;
        }

        /* 4. 加粗 (Bold) 强化 - 解决 YouMind 默认太细的问题 */
        .ym-askai-content strong, .ym-askai-content b, 
        .ym-askai-content h1, .ym-askai-content h2, .ym-askai-content h3, .ym-askai-content h4,
        .prose strong, .prose b,
        .tiptap strong, .tiptap b,
        .ProseMirror strong, .ProseMirror b {
            font-weight: 700 !important;
            color: #0b0b0b !important; 
        }

        /* C. 标题美化：浅蓝下划线 (修复版 + 间距修复) */
        
        /* 包含笔记区域的 H1-H4 */
        .ym-askai-content h1, .ym-askai-content h2, .ym-askai-content h3, .ym-askai-content h4,
        .tiptap h1, .tiptap h2, .tiptap h3, .tiptap h4,
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4 {
             display: block !important;
             width: fit-content !important; /* 关键：让盒子宽度等于文字宽度 */
             margin-top: 1.5em !important;
             margin-bottom: 0.75em !important;
             /* 关键修复：统一行高为 1.5，让 Note 视图 (原本很挤) 
                参考 Chat 视图 (较宽松) 的风格，同时保持下划线位置协调 */
             line-height: 1.75 !important; 
             position: relative;
             max-width: 100%;
             color: #0b0b0b !important;
             font-weight: 700 !important;
        }

        /* 下划线 */
        .ym-askai-content h1::after, 
        .ym-askai-content h2::after, 
        .ym-askai-content h3::after,
        .ym-askai-content h4::after,
        .tiptap h1::after, .tiptap h2::after, .tiptap h3::after, .tiptap h4::after {
            content: "";
            display: block;
            width: 100%;       /* 填满 fit-content 后的宽度 */
            height: 4px;      
            background-color: #bfdbfe; /* 浅蓝色 */
            margin-top: 0px;   /* 行高变大后，下划线会自动下移，margin 可以适当减小或归零 */
            border-radius: 2px; 
        }
        
        /* 移除之前的 hack，不再需要了 */
        .ym-askai-content h1::before, 
        .ym-askai-content h2::before, 
        .ym-askai-content h3::before,
        .ym-askai-content h4::before {
             content: none;
        }

        /* 6. 防御性 CSS：防止误伤 Flex 布局列表 */
        .ym-askai-content li > div.flex {
            margin-bottom: 0;
        }

        /* 7. 脑图节点微调 (可选) */
        .react-flow__node {
             font-weight: 500 !important;
        }
    `;

    // 注入样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

})();
