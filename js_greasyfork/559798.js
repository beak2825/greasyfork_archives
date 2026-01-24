// ==UserScript==
// @name         Gemini Code Block Scroller (v2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Gemini 代码块滚动增强：标题居中、状态跟随、自动历史补全、双击展开。
// @author       Gemini User
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559798/Gemini%20Code%20Block%20Scroller%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559798/Gemini%20Code%20Block%20Scroller%20%28v20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        maxHeight: '300px',       // 限制高度
        transitionTime: '0.2s',   // 动画速度
        statusText: {
            generating: '⏳ 生成中...',
            done: '✅ 代码生成完毕'
        }
    };

    // 1. 注入样式
    GM_addStyle(`
        /* 核心滚动样式 */
        .code-block .formatted-code-block-internal-container pre {
            max-height: ${CONFIG.maxHeight} !important;
            overflow-y: auto !important;
            display: block !important;
            cursor: zoom-in !important;
            transition: max-height ${CONFIG.transitionTime} ease-out;
            padding-bottom: 20px !important;
            border-bottom: 2px solid rgba(138, 180, 248, 0.1);
        }
        
        .code-block .formatted-code-block-internal-container pre.gm-expanded {
            max-height: none !important;
            cursor: zoom-out !important;
        }

        /* === 布局核心样式 === */
        
        /* 1. 状态标签样式 */
        .gm-status-badge {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            
            /* 关键布局：把右边的按钮组狠狠推到最右边 */
            margin-right: auto !important; 
            
            /* 和左边的语言标签保持距离 */
            margin-left: 10px !important; 
            
            font-family: "Google Sans", Roboto, sans-serif;
            font-weight: 500;
            z-index: 999;
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            height: 24px;
        }
        
        /* 2. 语言标签样式 (JS动态添加此类名) */
        /* 作用：把左边的红绿灯/空白狠狠推到最左边 */
        .gm-lang-label-centered {
            margin-left: auto !important;
        }

        .gm-status-badge.generating {
            background-color: rgba(253, 214, 99, 0.15);
            color: #fdd663;
            border: 1px solid rgba(253, 214, 99, 0.3);
            animation: pulse 1.5s infinite;
        }
        
        .gm-status-badge.done {
            background-color: rgba(129, 201, 149, 0.15);
            color: #81c995;
            border: 1px solid rgba(129, 201, 149, 0.3);
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `);

    // 2. 双击交互
    document.addEventListener('dblclick', function(e) {
        const preBlock = e.target.closest('.formatted-code-block-internal-container pre');
        if (preBlock) {
            e.preventDefault();
            window.getSelection()?.removeAllRanges();
            preBlock.classList.toggle('gm-expanded');
        }
    });

    // 3. 智能检测与布局修正
    setInterval(() => {
        fixAllBlocks();
    }, 500);

    function checkIsGenerating() {
        const buttons = Array.from(document.querySelectorAll('button[aria-label]'));
        const stopBtn = buttons.find(btn => {
            const label = btn.getAttribute('aria-label');
            const hasStop = label.includes('Stop') || label.includes('停止');
            const isMedia = label.includes('朗读') || label.includes('收听') || label.includes('播放') || label.includes('Read') || label.includes('Listen');
            return hasStop && !isMedia;
        });
        return !!stopBtn;
    }

    function fixAllBlocks() {
        const allBlocks = document.querySelectorAll('.code-block');
        if (allBlocks.length === 0) return;

        const isGenerating = checkIsGenerating();

        allBlocks.forEach((block, index) => {
            const isLast = index === allBlocks.length - 1;
            const status = (isGenerating && isLast) ? 'generating' : 'done';
            
            ensureBadgeAndLayout(block, status);
        });
    }

    function ensureBadgeAndLayout(block, statusType) {
        let header = block.querySelector('.code-block-decoration');
        if (!header) header = block.querySelector('div:first-child');
        if (!header) return;

        // === 步骤1：处理语言标签居中 ===
        // 查找语言标签 (通常是 span)
        const langSpan = header.querySelector('span');
        if (langSpan && !langSpan.classList.contains('gm-lang-label-centered')) {
            langSpan.classList.add('gm-lang-label-centered');
        }

        // === 步骤2：处理状态徽章 ===
        let badge = header.querySelector('.gm-status-badge');
        const targetText = statusType === 'generating' ? CONFIG.statusText.generating : CONFIG.statusText.done;

        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'gm-status-badge ' + statusType;
            badge.textContent = targetText;
            
            // 插入逻辑：紧跟在语言标签后面
            if (langSpan) {
                // 插在 span 后面，这样它们就形成了一个中间的组
                // header.insertBefore(badge, langSpan.nextSibling);
                // 为了保险，如果 span 后面有东西，插在它前面；如果没东西，appendChild
                if (langSpan.nextSibling) {
                    header.insertBefore(badge, langSpan.nextSibling);
                } else {
                    header.appendChild(badge);
                }
            } else {
                // 找不到 span？那只能插在最前面凑合一下
                header.appendChild(badge);
            }
        } 
        else if (badge.textContent !== targetText || !badge.classList.contains(statusType)) {
            badge.className = 'gm-status-badge ' + statusType;
            badge.textContent = targetText;
        }
    }

    console.log('Gemini Scroller v2.4: 居中布局版已启动');
})();