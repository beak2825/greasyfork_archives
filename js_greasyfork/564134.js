// ==UserScript==
// @name         ChatGPT 多人共用分组管理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为 ChatGPT 添加左侧分组按钮，支持 [姓名]、姓名:、姓名- 三种格式，方便多人共用账号。
// @author       wangxiaoyi
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564134/ChatGPT%20%E5%A4%9A%E4%BA%BA%E5%85%B1%E7%94%A8%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/564134/ChatGPT%20%E5%A4%9A%E4%BA%BA%E5%85%B1%E7%94%A8%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 核心配置 (已为你修改) ===
    // 现在支持：
    // 1. [张三] 标题
    // 2. 张三: 标题
    // 3. zxy- 标题 (适配你现在的习惯)
    const PREFIX_REGEX = /^([\[【](.+?)[\]】]|(.+?)[:：-]\s?)/;
    // ===========================

    GM_addStyle(`
        #custom-folder-dock {
            position: fixed;
            top: 0;
            left: 0;
            width: 260px; /* 侧边栏宽度 */
            height: auto;
            max-height: 120px;
            z-index: 10000;
            background: #171717; /* 纯黑背景融入 */
            border-bottom: 1px solid #444;
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-content: flex-start;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .folder-btn {
            background: #333;
            color: #ccc;
            border: 1px solid #555;
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .folder-btn:hover { background: #555; color: #fff; }
        .folder-btn.active {
            background: #10a37f; /* 激活变成绿色 */
            border-color: #10a37f;
            color: white;
            font-weight: bold;
        }
        .force-hide-chat { display: none !important; }

        /* 避免挡住后面的内容，给原本的导航栏加个顶部空白 */
        nav { padding-top: 60px !important; }
    `);

    let activeFilter = 'ALL';
    let cachedPrefixes = new Set();

    setInterval(() => {
        ensurePanelExists();
        scanAndFilter();
    }, 800);

    function ensurePanelExists() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let dock = document.getElementById('custom-folder-dock');
        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'custom-folder-dock';
            // 插入到 body 确保不被覆盖
            document.body.appendChild(dock);
            renderButtons();
        }
    }

    function scanAndFilter() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        const items = nav.querySelectorAll('a[href^="/c/"], li.relative a');

        let foundNew = false;

        items.forEach(item => {
            const text = item.textContent || "";
            // 这里的 match[2] 是 [] 里的内容，match[3] 是分隔符前的内容
            const match = text.match(PREFIX_REGEX);
            let prefix = null;

            if (match) {
                // 如果匹配到 zxy-，prefix 就会是 zxy
                prefix = match[2] || match[3];
                if (prefix) {
                    prefix = prefix.trim();
                    // 排除太长的错误匹配（比如把整句话当名字了）
                    if (prefix.length < 10 && !cachedPrefixes.has(prefix)) {
                        cachedPrefixes.add(prefix);
                        foundNew = true;
                    }
                }
            }

            let container = item.closest('li');
            if (!container) container = item;

            // 如果当前是“全部”，显示所有
            if (activeFilter === 'ALL') {
                container.classList.remove('force-hide-chat');
            } else {
                // 如果当前选了某个名字，只显示匹配的
                if (prefix === activeFilter) {
                    container.classList.remove('force-hide-chat');
                } else {
                    container.classList.add('force-hide-chat');
                }
            }
        });

        if (foundNew) {
            renderButtons();
        }
    }

    function renderButtons() {
        const dock = document.getElementById('custom-folder-dock');
        if (!dock) return;
        dock.innerHTML = '';

        // 全部按钮
        const allBtn = document.createElement('button');
        allBtn.className = `folder-btn ${activeFilter === 'ALL' ? 'active' : ''}`;
        allBtn.innerText = '全部';
        allBtn.onclick = () => { activeFilter = 'ALL'; renderButtons(); scanAndFilter(); };
        dock.appendChild(allBtn);

        // 名字按钮
        Array.from(cachedPrefixes).sort().forEach(p => {
            const btn = document.createElement('button');
            btn.className = `folder-btn ${activeFilter === p ? 'active' : ''}`;
            btn.innerText = p;
            btn.onclick = () => { activeFilter = p; renderButtons(); scanAndFilter(); };
            dock.appendChild(btn);
        });
    }
})();