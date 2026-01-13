// ==UserScript==
// @name         LeetCode|力扣 题单多功能目录插件
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2026-01-12
// @description  自动生成题单目录+一键跳转+自动标记已做题目+自动跳转到上一次浏览位置
// @author       0xff
// @match        *://*leetcode.cn/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562330/LeetCode%7C%E5%8A%9B%E6%89%A3%20%E9%A2%98%E5%8D%95%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562330/LeetCode%7C%E5%8A%9B%E6%89%A3%20%E9%A2%98%E5%8D%95%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 全局状态变量 ===
    let tocContainer = null;      // 目录容器DOM
    let currentPath = location.pathname; // 当前路径
    let checkContentTimer = null; // 内容检测定时器
    let refreshTimer = null;      // 自动刷新定时器

    // === 配置参数 (动态获取) ===
    const getConfig = () => ({
        title: "大纲目录",
        width: 240,
        indent: 20,
        bgColor: "#ffffff",
        textColor: "#37352f",
        hoverColor: "#f0f0f0",
        // 关键：keyPrefix 必须是个函数或动态获取，确保SPA跳转后key能变
        keyPrefix: "tm_toc_save_" + location.pathname,
        refreshInterval: 5 * 60 * 1000 // 5分钟
    });

    // === 辅助函数：存取本地数据 ===
    const Storage = {
        get: (key, def) => {
            const config = getConfig();
            const val = localStorage.getItem(config.keyPrefix + key);
            return val ? JSON.parse(val) : def;
        },
        set: (key, val) => {
            const config = getConfig();
            localStorage.setItem(config.keyPrefix + key, JSON.stringify(val));
        }
    };

    // ==========================================
    // Core 1: 目录渲染逻辑 (封装成函数以便重用)
    // ==========================================

    function removeTOC() {
        if (tocContainer && tocContainer.parentNode) {
            tocContainer.parentNode.removeChild(tocContainer);
        }
        tocContainer = null;
    }

    function renderTOC() {
        // 1. 先清理旧的
        removeTOC();

        // 2. 扫描标题
        const headings = document.querySelectorAll('h2, h3');
        if (headings.length === 0) return false; // 没找到标题，返回false

        const config = getConfig();
        const savedPos = Storage.get('pos', { top: 100, left: 20 });
        const savedState = Storage.get('expanded', true);

        // 3. 注入样式 (避免重复注入，简单判断一下)
        if (!document.getElementById('tm-toc-style')) {
            const css = `
                #tm-toc-container {
                    position: fixed; top: ${savedPos.top}px; left: ${savedPos.left}px;
                    width: ${config.width}px; max-height: 80vh; background: ${config.bgColor};
                    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
                    border-radius: 8px; z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                    color: ${config.textColor}; overflow: hidden; display: flex; flex-direction: column;
                    font-size: 14px; transition: opacity 0.2s;
                }
                #tm-toc-header {
                    padding: 12px 16px; font-weight: 600; border-bottom: 1px solid rgba(55, 53, 47, 0.09);
                    cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center;
                    background: #fbfbfa;
                }
                #tm-toc-toggle { cursor: pointer; color: #999; font-size: 12px; padding: 4px; }
                #tm-toc-toggle:hover { color: #333; }
                #tm-toc-content {
                    overflow-y: auto; padding: 8px 0; flex: 1;
                    display: ${savedState ? 'block' : 'none'};
                }
                #tm-toc-content::-webkit-scrollbar { width: 6px; }
                #tm-toc-content::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 3px; }
                .tm-toc-item {
                    padding: 6px 16px; cursor: pointer; white-space: nowrap; overflow: hidden;
                    text-overflow: ellipsis; line-height: 1.5; text-decoration: none; display: block; color: inherit;
                }
                .tm-toc-item:hover { background-color: ${config.hoverColor}; }
                .tm-toc-h2 { font-weight: 500; }
                .tm-toc-h3 { font-weight: 400; padding-left: ${16 + config.indent}px; color: #666; font-size: 0.95em; }
            `;
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(css);
            } else {
                const style = document.createElement('style');
                style.id = 'tm-toc-style';
                style.innerHTML = css;
                document.head.appendChild(style);
            }
        }

        // 4. 构建DOM
        const container = document.createElement('div');
        container.id = 'tm-toc-container';
        tocContainer = container; // 更新全局引用

        const header = document.createElement('div');
        header.id = 'tm-toc-header';
        header.innerHTML = `<span>${config.title}</span><span id="tm-toc-toggle">${savedState ? '▼' : '◀'}</span>`;
        container.appendChild(header);

        const contentBox = document.createElement('div');
        contentBox.id = 'tm-toc-content';

        headings.forEach((node, index) => {
            if (!node.id) node.id = 'tm-toc-heading-' + index;
            const link = document.createElement('div');
            link.className = `tm-toc-item tm-toc-${node.tagName.toLowerCase()}`;
            link.innerText = node.innerText.replace(/^§/, '');
            link.title = node.innerText;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Storage.set('scrollY', window.scrollY);
                node.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            contentBox.appendChild(link);
        });

        container.appendChild(contentBox);
        document.body.appendChild(container);

        // 5. 绑定事件 (拖拽 & 折叠)
        bindEvents(container, header, contentBox);

        // 6. 恢复上次阅读位置
        // 延时一点点，确保页面布局稳定
        setTimeout(() => {
            const lastScrollY = Storage.get('scrollY', 0);
            if (lastScrollY > 0) window.scrollTo(0, lastScrollY);
        }, 300);

        return true; // 成功渲染
    }

    function bindEvents(container, header, contentBox) {
        // 拖拽
        let isDragging = false, startX, startY, initialLeft, initialTop;
        header.addEventListener('mousedown', (e) => {
            if(e.target.id === 'tm-toc-toggle') return;
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            if (!isDragging) return;
            container.style.left = `${initialLeft + (e.clientX - startX)}px`;
            container.style.top = `${initialTop + (e.clientY - startY)}px`;
        }
        function onMouseUp() {
            isDragging = false;
            const rect = container.getBoundingClientRect();
            Storage.set('pos', { top: rect.top, left: rect.left });
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // 折叠
        const toggleBtn = header.querySelector('#tm-toc-toggle');
        let isExpanded = contentBox.style.display !== 'none';
        toggleBtn.addEventListener('click', () => {
            if (isExpanded) {
                contentBox.style.display = 'none'; toggleBtn.innerText = '◀'; container.style.height = 'auto';
            } else {
                contentBox.style.display = 'block'; toggleBtn.innerText = '▼';
            }
            isExpanded = !isExpanded;
            Storage.set('expanded', isExpanded);
        });
    }

    // ==========================================
    // Core 2: SPA 监听与生命周期管理
    // ==========================================

    function init() {
        console.log('[目录脚本] 正在初始化...');
        // 尝试渲染，如果失败（比如内容还没加载出来），启动轮询检测
        if (!renderTOC()) {
            console.log('[目录脚本] 未找到标题，开始轮询等待内容加载...');
            let attempts = 0;
            if (checkContentTimer) clearInterval(checkContentTimer);
            checkContentTimer = setInterval(() => {
                attempts++;
                if (renderTOC() || attempts > 20) { // 成功渲染或尝试超过10秒(20*500ms)
                    clearInterval(checkContentTimer);
                }
            }, 500);
        }
    }

    // 监听 URL 变化 (SPA 核心逻辑)
    setInterval(() => {
        if (location.pathname !== currentPath) {
            console.log(`[目录脚本] 检测到页面跳转: ${currentPath} -> ${location.pathname}`);
            currentPath = location.pathname;
            // 页面变了，清理旧目录，重新初始化
            removeTOC();
            init();
        }
    }, 1000); // 每秒检查一次URL是否变化

    // 启动
    init();

    // ==========================================
    // Core 3: 自动刷新 & 位置保存
    // ==========================================

    window.addEventListener('beforeunload', () => {
        Storage.set('scrollY', window.scrollY);
    });

    function handleVisibilityChange() {
        const config = getConfig();
        if (document.hidden) {
            console.log(`[目录脚本] 页面进入后台，${config.refreshInterval/1000}秒后刷新...`);
            refreshTimer = setTimeout(() => {
                location.reload();
            }, config.refreshInterval);
        } else {
            if (refreshTimer) {
                console.log('[目录脚本] 页面回到前台，取消刷新');
                clearTimeout(refreshTimer);
                refreshTimer = null;
            }
        }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (document.hidden) handleVisibilityChange();

})();