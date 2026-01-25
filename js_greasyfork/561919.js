// ==UserScript==
// @name         ChatGPT Code Block Scroller (v2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  ChatGPT 代码块滚动增强：保留原生头部按钮、语言标签居中、状态跟随（生成中/完成）、自动历史补全、双击展开/收起。
// @author       User
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561919/ChatGPT%20Code%20Block%20Scroller%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561919/ChatGPT%20Code%20Block%20Scroller%20%28v20%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        maxHeight: '33vh',       // 默认限制高度（约屏幕 1/3）
        expandedHeight: '85vh',  // 展开时高度（也可改为 'none' 彻底不限制）
        transitionTime: '0.22s',
        statusText: {
            generating: '⏳ 生成中...',
            done: '✅ 代码生成完毕'
        },
        scanIntervalMs: 500
    };

    // ================= 样式注入 =================
    GM_addStyle(`
        /* 仅作用于 ChatGPT 代码块：pre 内含 code 的场景 */
        pre.cgpt-cbs-pre {
            border-radius: 12px !important;
            overflow: hidden !important;
        }

        /* 代码内容容器：强制内部滚动 */
        .cgpt-cbs-scroll {
            max-height: ${CONFIG.maxHeight} !important;
            overflow-y: auto !important;
            display: block !important;
            cursor: zoom-in !important;
            transition: max-height ${CONFIG.transitionTime} ease-out;
        }

        .cgpt-cbs-scroll.cgpt-cbs-expanded {
            max-height: ${CONFIG.expandedHeight} !important;
            cursor: zoom-out !important;
        }

        /* 滚动条美化（仅 WebKit 系） */
        .cgpt-cbs-scroll::-webkit-scrollbar { width: 12px; }
        .cgpt-cbs-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(95, 99, 104, 0.35);
            border-radius: 999px;
        }

        /* ===== 头部布局增强（语言居中 + 状态徽章 + 按钮组靠右） ===== */

        /* 语言标签：推到中间组的左侧（靠中） */
        .cgpt-cbs-lang-centered {
            margin-left: auto !important;
        }

        /* 状态徽章：紧跟语言标签，且用 margin-right:auto 把按钮组推到最右侧 */
        .cgpt-cbs-status-badge {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 999px;
            margin-left: 10px !important;
            margin-right: auto !important;
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            height: 24px;
            user-select: none;
        }

        .cgpt-cbs-status-badge.generating {
            background-color: rgba(253, 214, 99, 0.16);
            color: #b58100;
            border: 1px solid rgba(253, 214, 99, 0.35);
            animation: cgpt-cbs-pulse 1.5s infinite;
        }

        .cgpt-cbs-status-badge.done {
            background-color: rgba(129, 201, 149, 0.16);
            color: #1f7a3d;
            border: 1px solid rgba(129, 201, 149, 0.35);
        }

        @keyframes cgpt-cbs-pulse {
            0% { opacity: 0.65; }
            50% { opacity: 1; }
            100% { opacity: 0.65; }
        }
    `);

    // ================= 交互：双击展开/收起 =================
    document.addEventListener('dblclick', (e) => {
        const code = e.target && (e.target.closest ? e.target.closest('pre') : null);
        if (!code) return;

        // 仅处理包含 code 的 pre
        if (!code.querySelector('code')) return;

        const scroll = findScrollContainer(code);
        if (!scroll) return;

        e.preventDefault();
        e.stopPropagation();
        window.getSelection()?.removeAllRanges();
        scroll.classList.toggle('cgpt-cbs-expanded');
    }, true);

    // ================= 核心：周期扫描（自动历史补全 + 动态更新状态） =================
    const timer = setInterval(() => {
        try { fixAllBlocks(); } catch (_) { /* ignore */ }
    }, CONFIG.scanIntervalMs);

    // 页面卸载时清理（可选）
    window.addEventListener('beforeunload', () => clearInterval(timer));

    // ================= 工具函数 =================

    function checkIsGenerating() {
        // ChatGPT 正在生成时通常会出现 “Stop generating / 停止生成” 类按钮
        const buttons = Array.from(document.querySelectorAll('button[aria-label], button[data-testid], button'));
        const stopBtn = buttons.find(btn => {
            const label = (btn.getAttribute('aria-label') || '').trim();
            const testid = (btn.getAttribute('data-testid') || '').trim();

            // 典型 stop：aria-label 或 data-testid
            const hasStop = /stop/i.test(label) || /停止/.test(label) || /stop/i.test(testid) || /停止/.test(testid);

            // 排除朗读/收听/播放等媒体按钮（避免误判）
            const isMedia = /朗读|收听|播放|read|listen|audio|voice/i.test(label) || /朗读|收听|播放|read|listen|audio|voice/i.test(testid);

            return hasStop && !isMedia;
        });
        return !!stopBtn;
    }

    function getAllCodePres() {
        // 兼容：有些代码块不一定在 article 内，但通常都在主内容区
        const pres = Array.from(document.querySelectorAll('pre'));
        return pres.filter(pre => pre.querySelector('code'));
    }

    function findScrollContainer(pre) {
        // ChatGPT 常见结构：pre > div(头部) + div(代码内容)；代码内容 div 内含 code
        // 为稳健，优先选 “直接子元素中含 code 的 div”，找不到就退化为 pre 本身
        const directDivs = Array.from(pre.children).filter(el => el && el.tagName === 'DIV');
        const codeDiv = directDivs.find(div => div.querySelector('code'));
        return codeDiv || pre;
    }

    function findHeader(pre) {
        // 头部一般是 pre 的第一个 div（不含 code）且包含 button 或文本标签
        const directDivs = Array.from(pre.children).filter(el => el && el.tagName === 'DIV');
        const header = directDivs.find(div => !div.querySelector('code') && (div.querySelector('button') || div.textContent?.trim()));
        return header || null;
    }

    function findLangLabel(header) {
        if (!header) return null;

        // ChatGPT 语言标签可能是 <span> 或 <div>，通常靠左，且内容短（如 “python”）
        const candidates = Array.from(header.querySelectorAll('span, div')).filter(el => {
            const t = (el.textContent || '').trim();
            if (!t) return false;
            // 排除明显是按钮或图标容器
            if (el.querySelector('button')) return false;
            // 语言通常较短；不做强假设，仅作为启发式
            return t.length <= 20;
        });

        // 更偏向第一个候选
        return candidates[0] || null;
    }

    function ensureBadgeAndLayout(pre, statusType) {
        const header = findHeader(pre);
        if (!header) return;

        // 语言标签居中：给语言节点加 class
        const lang = findLangLabel(header);
        if (lang && !lang.classList.contains('cgpt-cbs-lang-centered')) {
            lang.classList.add('cgpt-cbs-lang-centered');
        }

        // 确保 pre 本身标记（便于样式收敛）
        if (!pre.classList.contains('cgpt-cbs-pre')) {
            pre.classList.add('cgpt-cbs-pre');
        }

        // 状态徽章：插在语言标签后
        let badge = header.querySelector('.cgpt-cbs-status-badge');
        const targetText = statusType === 'generating' ? CONFIG.statusText.generating : CONFIG.statusText.done;

        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cgpt-cbs-status-badge ' + statusType;
            badge.textContent = targetText;

            if (lang) {
                // 插在语言标签后面
                if (lang.nextSibling) {
                    header.insertBefore(badge, lang.nextSibling);
                } else {
                    header.appendChild(badge);
                }
            } else {
                header.appendChild(badge);
            }
        } else {
            // 更新文本与状态 class
            if (badge.textContent !== targetText || !badge.classList.contains(statusType)) {
                badge.className = 'cgpt-cbs-status-badge ' + statusType;
                badge.textContent = targetText;
            }
        }
    }

    function ensureScrollStyle(pre) {
        const scroll = findScrollContainer(pre);
        if (!scroll) return;

        // 如果 scroll 实际是 pre，本身就能滚动；但为了不破坏原布局，尽量只给 codeDiv 加样式
        if (!scroll.classList.contains('cgpt-cbs-scroll')) {
            scroll.classList.add('cgpt-cbs-scroll');
        }
    }

    function fixAllBlocks() {
        const pres = getAllCodePres();
        if (pres.length === 0) return;

        const isGenerating = checkIsGenerating();

        pres.forEach((pre, idx) => {
            ensureScrollStyle(pre);

            const isLast = idx === pres.length - 1;
            const status = (isGenerating && isLast) ? 'generating' : 'done';

            ensureBadgeAndLayout(pre, status);
        });
    }

    console.log('ChatGPT Code Block Scroller (v2.0) - Loaded');
})();
