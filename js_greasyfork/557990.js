// ==UserScript==
// @name         Gemini Chat Navigator
// @version      1.0.0
// @description  Gemini 侧边栏目录
// @author       Russell
// @match        https://gemini.google.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/557990/Gemini%20Chat%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/557990/Gemini%20Chat%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 样式定义 (保持浅色风格) ---
    const css = `
        #gemini-nav-toggle {
            position: fixed; top: 50%; right: 0; transform: translateY(-50%);
            width: 30px; height: 50px; background: #f0f4f9; color: #444746;
            border: 1px solid #e0e0e0; border-right: none; border-radius: 8px 0 0 8px;
            cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center;
            font-size: 16px; box-shadow: -2px 1px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;
        }
        #gemini-nav-toggle:hover { background: #e3e3e3; width: 40px; }

        #gemini-nav-sidebar {
            position: fixed; top: 0; right: -260px; width: 260px; height: 100vh;
            background: #ffffff; border-left: 1px solid #e0e0e0; z-index: 9998;
            transition: right 0.3s ease; display: flex; flex-direction: column;
            color: #1f1f1f; font-family: 'Google Sans', sans-serif;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        }
        body.nav-open #gemini-nav-sidebar { right: 0; }
        body.nav-open #gemini-nav-toggle {
            right: 260px; border-radius: 50%; width: 40px; height: 40px;
            margin-right: -20px; color: #1f1f1f; background: #fff; border: 1px solid #e0e0e0;
        }

        .nav-header {
            padding: 15px; border-bottom: 1px solid #f0f0f0; font-size: 16px;
            font-weight: bold; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center;
        }
        .nav-quick-actions { display: flex; padding: 10px; gap: 10px; border-bottom: 1px solid #f0f0f0; }
        .nav-quick-btn {
            flex: 1; padding: 8px; background: #ffffff; border: 1px solid #c4c7c5;
            border-radius: 4px; color: #444746; cursor: pointer; text-align: center; font-size: 12px;
        }
        .nav-quick-btn:hover { background: #f0f4f9; color: #1f1f1f; border-color: #1f1f1f; }

        .nav-list { flex: 1; overflow-y: auto; padding: 10px; }
        .nav-item {
            padding: 10px; margin-bottom: 5px; border-radius: 6px; cursor: pointer;
            font-size: 13px; line-height: 1.4; color: #444746; transition: background 0.2s;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-left: 3px solid transparent;
        }
        .nav-item:hover { background: #f0f4f9; color: #0b57d0; border-left: 3px solid #0b57d0; }
        .nav-item span.index { color: #8e918f; margin-right: 8px; font-size: 11px; font-weight: bold; }

        .nav-list::-webkit-scrollbar { width: 6px; }
        .nav-list::-webkit-scrollbar-track { background: #fff; }
        .nav-list::-webkit-scrollbar-thumb { background: #dcdcdc; border-radius: 3px; }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // --- 2. 创建 UI ---
    const sidebar = document.createElement('div');
    sidebar.id = 'gemini-nav-sidebar';
    sidebar.innerHTML = `
        <div class="nav-header">
            <span>📑 导航目录</span>
            <span style="font-size:14px; color:#0b57d0; cursor:pointer;" id="refresh-toc" title="刷新目录">↻</span>
        </div>
        <div class="nav-quick-actions">
            <button class="nav-quick-btn" id="btn-top">⬆️ 顶部</button>
            <button class="nav-quick-btn" id="btn-bottom">⬇️ 底部</button>
        </div>
        <div class="nav-list" id="nav-list-content">
            <div style="padding:20px; text-align:center; color:#888;">正在扫描...</div>
        </div>
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'gemini-nav-toggle';
    toggleBtn.innerHTML = '☰';
    document.body.appendChild(sidebar);
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    document.getElementById('btn-top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('btn-bottom').onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    document.getElementById('refresh-toc').onclick = generateTableOfContents;

    // --- 3. 核心：扫描并生成目录 (修复重复问题) ---
    function generateTableOfContents() {
        const listContainer = document.getElementById('nav-list-content');

        // 获取所有可能的元素
        let userQueries = document.querySelectorAll('[data-test-id="user-query"], .user-query-container');

        if (userQueries.length === 0) {
            listContainer.innerHTML = '<div style="padding:10px; color:#888; text-align:center;">暂未检测到对话</div>';
            return;
        }

        listContainer.innerHTML = '';

        let lastText = ""; // 用于记录上一条的内容，防止重复
        let validIndex = 0; // 实际显示的序号

        userQueries.forEach((queryEl) => {
            // 获取文本并清理多余空格
            let text = queryEl.innerText || queryEl.textContent;
            text = text.replace(/\s+/g, ' ').trim();

            // === 修复核心逻辑：去重 ===
            // 1. 如果文本为空，跳过
            // 2. 如果文本和上一条记录的完全一样，跳过 (说明是嵌套的div)
            // 3. 如果文本太短(小于2个字)可能是图标或空行，跳过
            if (!text || text === lastText || text.length < 2) {
                return;
            }

            // 更新记录
            lastText = text;
            validIndex++;

            // 截取前 18 个字
            const shortText = text.length > 18 ? text.substring(0, 18) + "..." : text;

            const item = document.createElement('div');
            item.className = 'nav-item';
            item.innerHTML = `<span class="index">#${validIndex}</span>${shortText}`;

            item.onclick = () => {
                queryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // 高亮效果
                queryEl.style.transition = "background 0.5s";
                const originalBg = queryEl.style.backgroundColor;
                queryEl.style.backgroundColor = "#e8f0fe";
                setTimeout(() => { queryEl.style.backgroundColor = originalBg; }, 800);
            };

            listContainer.appendChild(item);
        });
    }

    // --- 4. 自动监听 ---
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(generateTableOfContents, 1000);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(generateTableOfContents, 2000);

})();