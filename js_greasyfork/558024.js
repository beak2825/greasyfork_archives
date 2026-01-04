// ==UserScript==
// @name         网页文本高亮 (自动保存) - 极速版
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在网页上划词高亮，支持“划词即高亮”的全局自动模式。双击高亮区域可删除。
// @description:en Highlight text on web pages, supports global "Instant Highlight" mode. Double-click to remove.
// @author       luoluoluo
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558024/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%AB%98%E4%BA%AE%20%28%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%29%20-%20%E6%9E%81%E9%80%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558024/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%AB%98%E4%BA%AE%20%28%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%29%20-%20%E6%9E%81%E9%80%9F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置项 ===
    const CONFIG = {
        storageKey: 'tampermonkey_page_highlights', // 高亮数据存储键名 (本地)
        settingKey: 'tampermonkey_highlight_auto_mode', // 设置存储键名 (全局)
        highlightTag: 'tm-mark',
        highlightClass: 'tm-highlight-span',
        color: '#B9B962',      // 橄榄黄
        textColor: '#000000'   // 黑色文字
    };

    // 读取全局设置
    let isAutoMode = GM_getValue(CONFIG.settingKey, false);

    // === 样式注入 ===
    const style = document.createElement('style');
    style.innerHTML = `
        /* 高亮区域样式 */
        .${CONFIG.highlightClass} {
            background-color: ${CONFIG.color} !important;
            color: ${CONFIG.textColor} !important;
            cursor: pointer;
            border-bottom: 2px solid rgba(0,0,0,0.2);
            border-radius: 3px;
            padding: 0 2px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            text-decoration: none !important;
            transition: background-color 0.2s;
        }
        .${CONFIG.highlightClass}:hover {
            opacity: 0.9;
        }
        
        /* 悬浮工具条容器 */
        #tm-action-bar {
            position: absolute;
            display: none;
            background: #333;
            border-radius: 4px;
            z-index: 2147483647;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-family: sans-serif;
            font-size: 13px;
            overflow: hidden;
            white-space: nowrap;
        }

        /* 工具条按钮通用样式 */
        .tm-bar-btn {
            display: inline-block;
            padding: 6px 12px;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
            user-select: none;
        }
        .tm-bar-btn:hover { background: #555; }
        
        /* 高亮按钮 */
        #tm-btn-highlight { border-right: 1px solid #555; }
        #tm-btn-highlight::after { content: "🖊️ 标记"; }
        
        /* 自动模式开关 (在工具条上) */
        #tm-btn-toggle-auto { color: #aaa; }
        #tm-btn-toggle-auto:hover { color: #ffeb3b; }
        #tm-btn-toggle-auto::after { content: "⚡ 自动"; }

        /* 右下角全局状态指示器 (仅在自动模式开启时显示) */
        #tm-auto-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: ${CONFIG.color};
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 2147483647;
            opacity: 0.5;
            transition: all 0.3s;
            border: 2px solid #fff;
        }
        #tm-auto-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        #tm-auto-indicator::after { content: "⚡"; }
        #tm-auto-indicator:hover::after { content: "🛑"; font-size: 16px; } /* hover时变成停止图标 */
        
    `;
    document.head.appendChild(style);

    // 创建悬浮工具条
    const actionBar = document.createElement('div');
    actionBar.id = 'tm-action-bar';
    actionBar.innerHTML = `
        <div id="tm-btn-highlight" class="tm-bar-btn" title="手动高亮"></div>
        <div id="tm-btn-toggle-auto" class="tm-bar-btn" title="点击开启：划词直接高亮 (全局生效)"></div>
    `;
    document.body.appendChild(actionBar);

    // 创建右下角指示器
    const indicator = document.createElement('div');
    indicator.id = 'tm-auto-indicator';
    indicator.title = "自动高亮模式已开启。点击关闭。";
    document.body.appendChild(indicator);
    
    // 初始化显示状态
    updateUIState();

    // ============================
    // 逻辑控制层
    // ============================

    function updateUIState() {
        if (isAutoMode) {
            indicator.style.display = 'flex';
            actionBar.style.display = 'none'; // 自动模式下不显示工具条
        } else {
            indicator.style.display = 'none';
        }
    }

    function toggleAutoMode() {
        isAutoMode = !isAutoMode;
        GM_setValue(CONFIG.settingKey, isAutoMode);
        updateUIState();
        
        // 简单的提示
        showToast(isAutoMode ? "⚡ 自动高亮已开启 (全局)" : "🖊️ 已切换回手动模式");
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 8px 16px;
            border-radius: 4px; font-size: 14px; z-index: 999999; pointer-events: none;
            transition: opacity 0.5s;
        `;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 500); }, 2000);
    }

    // ============================
    // 数据持久化层 (保持不变)
    // ============================
    const Store = {
        get: () => { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; } catch(e) { return {}; } },
        save: (data) => { try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)); } catch(e) {} },
        getPageKey: () => window.location.pathname + window.location.search,
        add: (info) => {
            const store = Store.get();
            const key = Store.getPageKey();
            if (!store[key]) store[key] = [];
            store[key].push(info);
            Store.save(store);
        },
        remove: (id) => {
            const store = Store.get();
            const key = Store.getPageKey();
            if (store[key]) {
                store[key] = store[key].filter(item => item.id !== id);
                if (store[key].length === 0) delete store[key];
                Store.save(store);
            }
        },
        clearPage: () => {
            const store = Store.get();
            delete store[Store.getPageKey()];
            Store.save(store);
            location.reload();
        }
    };

    // ============================
    // DOM 操作层
    // ============================
    function getPathTo(element) {
        if (element.id !== '') return 'id("' + element.id + '")';
        if (element === document.body) return element.tagName;
        let ix = 0;
        const siblings = element.parentNode.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === element) return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
        }
    }

    function highlightRange(range, id = null) {
        try {
            const mark = document.createElement(CONFIG.highlightTag);
            mark.className = CONFIG.highlightClass;
            mark.dataset.id = id || Date.now().toString(36) + Math.random().toString(36).substr(2);
            mark.title = "双击删除";
            mark.appendChild(range.extractContents());
            range.insertNode(mark);
            return { id: mark.dataset.id, text: mark.innerText, path: getPathTo(mark.parentNode) };
        } catch (e) { return null; }
    }

    function restoreHighlights() {
        const store = Store.get();
        const items = store[Store.getPageKey()] || [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            items.forEach(item => {
                 if (node.nodeValue.includes(item.text) && node.parentNode.tagName !== CONFIG.highlightTag.toUpperCase()) {
                     try {
                         const range = document.createRange();
                         const start = node.nodeValue.indexOf(item.text);
                         range.setStart(node, start);
                         range.setEnd(node, start + item.text.length);
                         const mark = document.createElement(CONFIG.highlightTag);
                         mark.className = CONFIG.highlightClass;
                         mark.dataset.id = item.id;
                         mark.title = "双击删除";
                         range.surroundContents(mark);
                     } catch (e) {}
                 }
            });
        }
    }

    // ============================
    // 事件交互层
    // ============================

    // 1. 划词处理
    document.addEventListener('mouseup', (e) => {
        if (actionBar.contains(e.target) || indicator.contains(e.target)) return;
        
        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            
            if (text.length > 1) {
                const range = selection.getRangeAt(0);
                
                // === 分支逻辑 ===
                if (isAutoMode) {
                    // A. 自动模式：直接高亮
                    const info = highlightRange(range);
                    if (info) {
                        Store.add(info);
                        selection.removeAllRanges();
                    }
                } else {
                    // B. 手动模式：显示工具条
                    const rect = range.getBoundingClientRect();
                    let top = window.scrollY + rect.top - 40;
                    let left = window.scrollX + rect.left + (rect.width / 2) - 50; // 稍微修正居中
                    
                    if (top < 0) top = window.scrollY + rect.bottom + 10;
                    if (left < 0) left = 10;

                    actionBar.style.display = 'block';
                    actionBar.style.top = top + 'px';
                    actionBar.style.left = left + 'px';
                    
                    // 绑定按钮事件
                    const btnHighlight = document.getElementById('tm-btn-highlight');
                    const btnAuto = document.getElementById('tm-btn-toggle-auto');
                    
                    btnHighlight.onclick = (evt) => {
                        evt.stopPropagation();
                        const info = highlightRange(range);
                        if (info) {
                            Store.add(info);
                            selection.removeAllRanges();
                            actionBar.style.display = 'none';
                        }
                    };
                    
                    btnAuto.onclick = (evt) => {
                        evt.stopPropagation();
                        toggleAutoMode(); // 开启自动模式
                        actionBar.style.display = 'none'; // 隐藏工具条
                    };
                }
            } else {
                actionBar.style.display = 'none';
            }
        }, 10);
    });

    // 2. 隐藏工具条
    document.addEventListener('mousedown', (e) => {
        if (!actionBar.contains(e.target)) {
            actionBar.style.display = 'none';
        }
    });

    // 3. 点击指示器关闭自动模式
    indicator.onclick = () => {
        toggleAutoMode();
    };

    // 4. 双击删除
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains(CONFIG.highlightClass)) {
            const id = e.target.dataset.id;
            const text = e.target.innerText;
            const parent = e.target.parentNode;
            parent.replaceChild(document.createTextNode(text), e.target);
            parent.normalize();
            Store.remove(id);
        }
    });

    // 5. 加载还原
    window.addEventListener('load', () => {
        setTimeout(restoreHighlights, 500);
        setTimeout(restoreHighlights, 2000);
    });
    
    // 6. 注册油猴菜单
    GM_registerMenuCommand("⚡ 切换自动高亮模式", toggleAutoMode);
    GM_registerMenuCommand("🗑️ 清空当前页面所有高亮", () => {
        if(confirm('清空当前页面所有记录？')) Store.clearPage();
    });

})();