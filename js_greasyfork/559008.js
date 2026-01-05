// ==UserScript==
// @name         DeepSeek 网页通用禅定模式 (v9.0 动态雷达版)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  支持 SPA 动态网页，刷新后自动检测并隐藏记忆元素。引入 MutationObserver 确保元素一加载即被隐藏。
// @author       Gemini & You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559008/DeepSeek%20%E7%BD%91%E9%A1%B5%E9%80%9A%E7%94%A8%E7%A6%85%E5%AE%9A%E6%A8%A1%E5%BC%8F%20%28v90%20%E5%8A%A8%E6%80%81%E9%9B%B7%E8%BE%BE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559008/DeepSeek%20%E7%BD%91%E9%A1%B5%E9%80%9A%E7%94%A8%E7%A6%85%E5%AE%9A%E6%A8%A1%E5%BC%8F%20%28v90%20%E5%8A%A8%E6%80%81%E9%9B%B7%E8%BE%BE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    // --- 1. 智能选择器生成 (用于记忆) ---
    function getUniqueSelector(el) {
        if (!el || el.nodeType !== 1) return null;
        // 优先用 ID
        if (el.id && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) {
            return '#' + CSS.escape(el.id);
        }
        // 其次用 Class (过滤掉过短的通用类名)
        if (el.className && typeof el.className === 'string') {
            const classes = el.className.split(/\s+/).filter(c => c.trim().length > 2);
            if (classes.length > 0) {
                // 尝试组合类名
                const classSelector = '.' + classes.map(c => CSS.escape(c)).join('.');
                if (document.querySelectorAll(classSelector).length === 1) {
                    return classSelector;
                }
            }
        }
        // 最后用路径 (Path)
        let path = [];
        let current = el;
        while (current && current.nodeType === 1 && path.length < 5) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                selector += '#' + CSS.escape(current.id);
                path.unshift(selector);
                break;
            } else {
                let sibling = current;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.tagName.toLowerCase() === selector) nth++;
                }
                if (nth !== 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            current = current.parentElement;
        }
        return path.join(' > ');
    }

    // --- 2. 存储管理 ---
    const STORAGE_KEY = 'zm_hidden_selectors_' + location.hostname;

    function loadSavedSelectors() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
    }
    function saveSelector(selector) {
        const saved = loadSavedSelectors();
        if (!saved.includes(selector)) {
            saved.push(selector);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        }
    }
    function clearSavedSelectors() { localStorage.removeItem(STORAGE_KEY); }

    // --- 3. 核心：应用规则与恢复 ---
    let isHidden = true; // 当前的总开关状态

    function applyActionToElement(el, hide) {
        if (hide) {
            // 只有当它是显示的时候，我们才去记录原始状态并隐藏
            if (el.style.display !== 'none') {
                el.setAttribute('data-zm-original', el.style.display);
                el.style.display = 'none';
            }
        } else {
            // 恢复显示
            // 如果有记录原始值，就用原始值；如果没有(可能是因为刷新后刚加载)，就设为 '' 让 CSS 决定
            const original = el.getAttribute('data-zm-original');
            if (original !== null) {
                el.style.display = original;
            } else {
                el.style.display = '';
            }
        }
    }

    // 扫描页面并执行操作
    function scanAndApply() {
        const savedSelectors = loadSavedSelectors();
        updateUI(savedSelectors.length); // 更新按钮状态

        savedSelectors.forEach(selector => {
            try {
                const els = document.querySelectorAll(selector);
                els.forEach(el => applyActionToElement(el, isHidden));
            } catch (e) { /* 忽略无效选择器 */ }
        });
    }

    // --- 4. 雷达监测 (MutationObserver) ---
    // 这是解决“刷新无效”的关键：页面只要有变动，就重新扫描一次
    let observerTimeout;
    const observer = new MutationObserver(() => {
        if (!isHidden) return; // 如果用户设定为“显示”，雷达就不工作，节省性能

        // 防抖：短时间内大量变动只执行一次
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            scanAndApply();
        }, 200); // 200ms 延迟，保证性能
    });

    // 启动雷达
    observer.observe(document.body, { childList: true, subtree: true });


    // --- 5. 界面构建 (保持原有设计) ---
    const style = document.createElement('style');
    style.textContent = `
        .zm-target-hover { outline: 3px solid #ff0000 !important; background: rgba(255, 0, 0, 0.1) !important; cursor: crosshair !important; z-index: 2147483647 !important; }
        #zm-panel { position: fixed; bottom: 30px; right: 20px; z-index: 2147483647; padding: 12px; background: rgba(20, 20, 20, 0.95); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); border: 1px solid #444; display: none; font-family: sans-serif; user-select: none; }
        #zm-dock-icon { position: fixed; bottom: 30px; right: 0; z-index: 2147483647; padding: 8px 12px 8px 8px; background: rgba(20, 20, 20, 0.8); color: #fff; border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; display: block; }
        #zm-dock-icon:hover { background: #2196F3; padding-right: 15px; }
    `;
    document.head.appendChild(style);

    const dockIcon = document.createElement('div');
    dockIcon.id = 'zm-dock-icon'; dockIcon.innerHTML = '🛠️'; document.body.appendChild(dockIcon);

    const panel = document.createElement('div');
    panel.id = 'zm-panel';
    panel.innerHTML = `
        <div style="display:flex; gap:8px; align-items:center;">
            <button id="zm-picker-btn">🎯 选择</button>
            <button id="zm-toggle-btn" style="display:none;">🔴 已隐</button>
            <button id="zm-reset-btn" title="清除记忆">🗑️ 重置</button>
            <div style="width:1px; height:20px; background:#555; margin:0 4px;"></div>
            <button id="zm-close-btn" style="background:transparent; border:1px solid #555; padding:4px 8px;">⏩</button>
        </div>
        <div id="zm-status" style="margin-top:8px; font-size:11px; color:#aaa; display:none;">
            记忆规则: <span id="zm-count" style="color:#fff; font-weight:bold;">0</span>
        </div>
    `;

    const setBtn = (id, bg) => { const b = panel.querySelector(id); b.style.cssText = `padding:6px 12px; border:none; border-radius:4px; cursor:pointer; color:white; background:${bg}; font-weight:bold; font-size:12px; min-width:60px;`; return b; };
    const pickerBtn = setBtn('#zm-picker-btn', '#2196F3');
    const toggleBtn = setBtn('#zm-toggle-btn', '#FF5722');
    const resetBtn = setBtn('#zm-reset-btn', '#444'); resetBtn.style.minWidth='50px';
    const closeBtn = panel.querySelector('#zm-close-btn');

    document.body.appendChild(panel);

    // --- 6. 交互逻辑 ---
    let isPicking = false;

    function updateUI(count) {
        panel.querySelector('#zm-count').innerText = count;
        panel.querySelector('#zm-status').style.display = count > 0 ? 'block' : 'none';

        if (count > 0) {
            toggleBtn.style.display = 'block';
            pickerBtn.style.display = 'none';
            if (isHidden) {
                toggleBtn.innerText = "🟢 显示"; // 意思是：当前是隐藏的，点我可以显示
                toggleBtn.style.background = "#4CAF50";
            } else {
                toggleBtn.innerText = "🔴 隐藏"; // 意思是：当前是显示的，点我可以隐藏
                toggleBtn.style.background = "#FF5722";
            }
        } else {
            toggleBtn.style.display = 'none';
            pickerBtn.style.display = 'block';
        }
    }

    // 选择器事件
    const handleOver = (e) => { if (isPicking && !panel.contains(e.target) && !dockIcon.contains(e.target)) { e.stopPropagation(); e.target.classList.add('zm-target-hover'); } };
    const handleOut = (e) => { if (isPicking) { e.stopPropagation(); e.target.classList.remove('zm-target-hover'); } };
    const handleClick = (e) => {
        if (!isPicking || panel.contains(e.target) || dockIcon.contains(e.target)) return;
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

        const target = e.target;
        target.classList.remove('zm-target-hover');

        const selector = getUniqueSelector(target);
        if (selector) {
            saveSelector(selector);
            applyActionToElement(target, true); // 立即隐藏
            scanAndApply(); // 刷新状态
        } else {
            alert('无法定位该元素');
        }
    };

    // 按钮绑定
    dockIcon.onclick = () => { dockIcon.style.display = 'none'; panel.style.display = 'block'; };
    closeBtn.onclick = () => { isPicking=false; document.body.style.cursor=''; panel.style.display = 'none'; dockIcon.style.display = 'block'; document.removeEventListener('mouseover', handleOver, true); document.removeEventListener('mouseout', handleOut, true); document.removeEventListener('click', handleClick, true); };

    pickerBtn.onclick = () => {
        isPicking = !isPicking;
        if (isPicking) {
            pickerBtn.innerText = "🛑 停止"; pickerBtn.style.background = "#E91E63";
            document.addEventListener('mouseover', handleOver, true);
            document.addEventListener('mouseout', handleOut, true);
            document.addEventListener('click', handleClick, true);
        } else {
            pickerBtn.innerText = "🎯 选择"; pickerBtn.style.background = "#2196F3";
            closeBtn.click(); // 借用关闭逻辑清理监听器
            dockIcon.onclick(); // 再重新打开面板
        }
    };

    toggleBtn.onclick = () => {
        isHidden = !isHidden;
        scanAndApply(); // 重新扫描并执行显隐
    };

    resetBtn.onclick = () => {
        if(confirm('清除本站记忆？')) {
            clearSavedSelectors();
            location.reload();
        }
    };

    // 初始化：启动时立即执行一次扫描
    setTimeout(scanAndApply, 500);
    scanAndApply();

})();