// ==UserScript==
// @name         S1检测关键词抽楼
// @version      1.3
// @description  隐藏包含特定关键词的论坛楼层，支持Alt+J唤起面板
// @author       Youmiya Hina
// @match        *://*.stage1st.com/*
// @match        *://stage1st.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1198455
// @downloadURL https://update.greasyfork.org/scripts/550650/S1%E6%A3%80%E6%B5%8B%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8A%BD%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/550650/S1%E6%A3%80%E6%B5%8B%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8A%BD%E6%A5%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        keywords: ["小雨", "yht", "ameki", "雨纪", "绵羊"], // 要过滤的关键词
        checkInterval: 1000,      // 检查新内容的时间间隔(ms)
        enableFilter: true,       // 默认启用过滤
        panelVisible: false      // 控制面板默认隐藏
    };

    // 加载保存的设置
    const savedKeywords = GM_getValue('filterKeywords', null);
    if (savedKeywords) {
        config.keywords = savedKeywords;
    }

    const savedEnableFilter = GM_getValue('enableFilter', null);
    if (savedEnableFilter !== null) {
        config.enableFilter = savedEnableFilter;
    }

    // 添加自定义样式
    GM_addStyle(`
        .s1-filter-control {
            position: fixed;
            top: 50px;
            right: 20px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 200px;
            display: none;
        }
        .s1-filter-control h3 {
            margin: 0 0 10px 0;
            padding: 0;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .s1-filter-control label {
            display: block;
            margin: 8px 0;
        }
        .s1-filter-control input[type="text"] {
            width: 100%;
            padding: 5px;
            box-sizing: border-box;
            margin-top: 5px;
        }
        .s1-filter-control button {
            background: #4a90e2;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
        }
        .s1-filter-control button:hover {
            background: #357abD;
        }
        .s1-filtered-post {
            display: none !important;
        }
        .s1-filter-notice {
            background-color: #f8f8f8;
            border-left: 4px solid #4a90e2;
            padding: 10px;
            margin: 10px 0;
            font-style: italic;
            color: #666;
        }
        .s1-shortcut-hint {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(52, 152, 219, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
    `);

    let controlPanel;

    // 创建控制面板
    function createControlPanel() {
        controlPanel = document.createElement('div');
        controlPanel.className = 's1-filter-control';

        controlPanel.innerHTML = `
            <h3>关键词抽楼</h3>
            <label>
                <input type="checkbox" id="s1-toggle-filter" ${config.enableFilter ? 'checked' : ''}>
                启用关键词过滤
            </label>
            <label>
                关键词 (用逗号分隔):
                <input type="text" id="s1-filter-keywords" value="${config.keywords.join(',')}">
            </label>
            <button id="s1-apply-filter">保存设置</button>
            <button id="s1-show-all">暂时显示所有内容</button>
        `;

        document.body.appendChild(controlPanel);

        // 添加事件监听
        document.getElementById('s1-apply-filter').addEventListener('click', applySettings);
        document.getElementById('s1-show-all').addEventListener('click', showAllPosts);
        document.getElementById('s1-toggle-filter').addEventListener('change', toggleFilter);

        // 添加Alt+J快捷键监听
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 'j') {
                togglePanel();
            }
        });

        // 添加快捷键提示
        addShortcutHint();
    }

    // 添加快捷键提示
    function addShortcutHint() {
        const hint = document.createElement('div');
        hint.className = 's1-shortcut-hint';
        hint.textContent = '按 Alt+J 显示/隐藏控制面板';
        document.body.appendChild(hint);

        // 5秒后隐藏提示
        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 1000);
        }, 5000);
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        if (controlPanel.style.display === 'block') {
            controlPanel.style.display = 'none';
        } else {
            controlPanel.style.display = 'block';
        }
    }

    // 应用设置
    function applySettings() {
        const keywordsInput = document.getElementById('s1-filter-keywords').value;
        const enableFilter = document.getElementById('s1-toggle-filter').checked;

        config.keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k);
        config.enableFilter = enableFilter;

        GM_setValue('filterKeywords', config.keywords);
        GM_setValue('enableFilter', config.enableFilter);

        // 重新过滤页面
        filterPosts();

        // 自动关闭面板
        controlPanel.style.display = 'none';
    }

    // 切换过滤功能
    function toggleFilter() {
        const enableFilter = document.getElementById('s1-toggle-filter').checked;
        config.enableFilter = enableFilter;
        GM_setValue('enableFilter', enableFilter);
        filterPosts();
    }

    // 暂时显示所有内容
    function showAllPosts() {
        const posts = document.querySelectorAll('.s1-filtered-post');
        posts.forEach(post => {
            post.classList.remove('s1-filtered-post');
        });

        // 3秒后重新应用过滤
        setTimeout(filterPosts, 3000);
    }

    // 过滤帖子内容
    function filterPosts() {
        if (!config.enableFilter) return;

        // 这里需要根据实际论坛结构调整选择器
        const posts = document.querySelectorAll('.post, .reply, .thread, [class*="plhin"]');

        posts.forEach(post => {
            const text = post.textContent;
            const shouldHide = config.keywords.some(keyword =>
                text.includes(keyword) || text.includes(`【${keyword}】`)
            );

            if (shouldHide) {
                post.classList.add('s1-filtered-post');
            } else {
                post.classList.remove('s1-filtered-post');
            }
        });

        // 添加过滤通知
        addFilterNotice();
    }

    // 添加过滤通知
    function addFilterNotice() {
        const filteredPosts = document.querySelectorAll('.s1-filtered-post');
        if (filteredPosts.length > 0) {
            const notice = document.createElement('div');
            notice.className = 's1-filter-notice';
            notice.textContent = `已隐藏 ${filteredPosts.length} 条包含过滤关键词的内容`;
            document.body.appendChild(notice);
        }
    }

    // 初始化
    function init() {
        createControlPanel();
        filterPosts();

        // 定期检查新内容
        setInterval(filterPosts, config.checkInterval);
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();