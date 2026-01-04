// ==UserScript==
// @name         划词工具条 (磨砂玻璃版-防误触修复)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  支持划词复制+搜索，磨砂玻璃 UI，修复“点击也弹出”的 Bug。
// @author       Gemini Assistant
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559580/%E5%88%92%E8%AF%8D%E5%B7%A5%E5%85%B7%E6%9D%A1%20%28%E7%A3%A8%E7%A0%82%E7%8E%BB%E7%92%83%E7%89%88-%E9%98%B2%E8%AF%AF%E8%A7%A6%E4%BF%AE%E5%A4%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559580/%E5%88%92%E8%AF%8D%E5%B7%A5%E5%85%B7%E6%9D%A1%20%28%E7%A3%A8%E7%A0%82%E7%8E%BB%E7%92%83%E7%89%88-%E9%98%B2%E8%AF%AF%E8%A7%A6%E4%BF%AE%E5%A4%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // ⚙️ 搜索引擎配置
    // =========================================================
    const SEARCH_URL = 'https://www.google.com/search?q=%s';

    // =========================================================
    // 🎨 图标定义 (SVG)
    // =========================================================
    const ICONS = {
        copy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        success: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };

    // =========================================================
    // 🏗️ UI 构建
    // =========================================================
    const toolbar = document.createElement('div');
    toolbar.id = 'glass-toolbar';
    
    // 🔥 防翻译标记
    toolbar.className = 'notranslate'; 
    toolbar.setAttribute('translate', 'no'); 

    toolbar.innerHTML = `
        <div class="glass-btn" id="btn-copy">${ICONS.copy}<span>复制</span></div>
        <div class="glass-divider"></div>
        <div class="glass-btn" id="btn-search">${ICONS.search}<span>搜索</span></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #glass-toolbar {
            position: absolute;
            display: none;
            z-index: 2147483647;
            background-color: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            padding: 4px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            flex-direction: row;
            align-items: center;
            transform-origin: center bottom;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .glass-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 10px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            gap: 6px;
            transition: background-color 0.15s ease;
            user-select: none; /* 防止按钮文字被选中 */
        }
        .glass-btn:hover { background-color: rgba(0, 0, 0, 0.06); }
        .glass-btn svg { color: #007aff; }
        .glass-btn.copied { color: #34C759; }
        .glass-btn.copied svg { stroke: #34C759; }
        .glass-divider {
            width: 1px;
            height: 16px;
            background-color: rgba(0, 0, 0, 0.1);
            margin: 0 2px;
        }
        @keyframes glassPop {
            0% { opacity: 0; transform: scale(0.95) translateY(5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toolbar);

    // =========================================================
    // 🧠 逻辑处理 (已修复误触 Bug)
    // =========================================================
    let selectedText = '';
    let isCopied = false;
    
    // 鼠标坐标记录变量
    let startX = 0;
    let startY = 0;
    let isMouseDown = false;

    // 1. 监听鼠标按下 (记录起点 + 隐藏旧工具条)
    document.addEventListener('mousedown', e => {
        // 如果点击的是工具条本身，不要隐藏，也不要记录为新划词的起点
        if (toolbar.contains(e.target)) return;

        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // 只要鼠标按下，且不是点在工具条上，就立刻隐藏旧的
        hideToolbar(); 
    });

    // 2. 监听鼠标抬起 (核心逻辑)
    document.addEventListener('mouseup', e => {
        if (!isMouseDown) return; // 异常情况过滤
        isMouseDown = false;

        // 给一点点延时，让浏览器完成选区计算
        setTimeout(() => {
            // 如果点击的是工具条内部，直接返回
            if (toolbar.contains(e.target)) return;

            const selection = window.getSelection();
            const text = selection.toString().trim();

            // 🔥【核心修复逻辑 1】: 检查选区是否闭合 (isCollapsed)
            // 如果 isCollapsed 为 true，说明只是光标在闪烁，没有选中任何范围
            if (selection.isCollapsed) return;

            // 🔥【核心修复逻辑 2】: 检查物理位移 (防手抖)
            // 计算鼠标按下和抬起的距离
            const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
            
            // 如果移动距离小于 3px，且不是双击选词(双击时距离为0但选区不为空)，通常视为误触
            // 但为了兼容双击选词，只要选区有内容且长度>0，我们通常允许弹出
            // 可是用户特别提到了"没有滑动"，所以我们这里加一个双重保险：
            // 如果内容为空，绝对不弹。
            if (!text) return;

            // 如果你想严格限制“必须滑动”才弹出（禁止双击选词），可以解开下面这行的注释：
            // if (dist < 3) return; 

            selectedText = text;
            showToolbar(e.clientX, e.clientY);
        }, 10);
    });

    // 按钮动作绑定
    const btnCopy = document.getElementById('btn-copy');
    const btnSearch = document.getElementById('btn-search');

    btnCopy.addEventListener('click', e => {
        e.stopPropagation();
        if (selectedText) {
            GM_setClipboard(selectedText);
            isCopied = true;
            btnCopy.innerHTML = `${ICONS.success}<span>已复制</span>`;
            btnCopy.classList.add('copied');
            setTimeout(hideToolbar, 1000);
        }
    });

    btnSearch.addEventListener('click', e => {
        e.stopPropagation();
        if (selectedText) {
            window.open(SEARCH_URL.replace('%s', encodeURIComponent(selectedText)), '_blank');
            hideToolbar();
        }
    });

    // =========================================================
    // 🔧 工具函数
    // =========================================================
    function showToolbar(clientX, clientY) {
        const x = clientX + window.scrollX;
        const y = clientY + window.scrollY - 45;

        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y}px`;
        toolbar.style.display = 'flex';
        toolbar.style.animation = 'glassPop 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
        
        resetState();
    }

    function hideToolbar() {
        toolbar.style.display = 'none';
        toolbar.style.animation = '';
        resetState();
    }

    function resetState() {
        if (isCopied) {
            isCopied = false;
            btnCopy.classList.remove('copied');
            btnCopy.innerHTML = `${ICONS.copy}<span>复制</span>`;
        }
    }
})();