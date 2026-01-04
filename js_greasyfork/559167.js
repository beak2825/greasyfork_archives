// ==UserScript==
// @name         强制新标签页打开链接 (带开关)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使网站论坛博客链接新标签页打开，在浏览器右上角添加一个开关按钮。
// @author       Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559167/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559167/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const KEY_IS_ACTIVE = 'newTabOpenActive';
    let isActive = GM_getValue(KEY_IS_ACTIVE, true); // 默认为开启状态

    // --- 样式注入 ---
    GM_addStyle(`
        #new-tab-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            padding: 8px 12px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-family: sans-serif;
        }
        #new-tab-toggle-btn:hover {
            background-color: rgba(0, 0, 0, 0.9);
        }
        #new-tab-toggle-btn.status-off {
            background-color: rgba(150, 150, 150, 0.5);
            color: #ddd;
        }
    `);

    // --- 创建UI按钮 ---
    const btn = document.createElement('div');
    btn.id = 'new-tab-toggle-btn';
    updateButtonVisual();
    document.body.appendChild(btn);

    // --- 按钮点击事件 ---
    btn.addEventListener('click', function() {
        isActive = !isActive;
        GM_setValue(KEY_IS_ACTIVE, isActive);
        updateButtonVisual();
        
        // 可选：切换时给个提示
        // alert('新标签页打开功能已: ' + (isActive ? '开启' : '关闭'));
    });

    function updateButtonVisual() {
        if (isActive) {
            btn.innerText = '🔗 新标签: ON';
            btn.classList.remove('status-off');
        } else {
            btn.innerText = '🔗 新标签: OFF';
            btn.classList.add('status-off');
        }
    }

    // --- 核心逻辑 (事件委托) ---
    // 使用事件委托比直接修改DOM更高效，且对动态加载的内容（AJAX/瀑布流）也有效
    document.addEventListener('click', function(e) {
        // 1. 如果功能关闭，直接忽略
        if (!isActive) return;

        // 2. 查找被点击元素最近的 <a> 标签
        const link = e.target.closest('a');

        // 3. 校验链接有效性
        if (link && link.href) {
            const href = link.getAttribute('href');

            // 排除 javascript: 调用
            if (href.startsWith('javascript:')) return;
            
            // 排除页内锚点 (例如 #top)
            if (href.startsWith('#')) return;
            
            // 排除空链接
            if (href === '' || href === 'javascript:void(0)') return;

            // 4. 强制新标签页打开
            // 阻止默认行为（当前页打开）
            e.preventDefault();
            e.stopPropagation();
            
            //在新窗口打开
            window.open(link.href, '_blank');
        }
    }, true); // 使用捕获阶段(true)以确保优先处理

})();