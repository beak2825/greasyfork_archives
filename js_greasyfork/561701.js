// ==UserScript==
// @name         GitHub RSS & Inoreader Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 GitHub 项目页显示可选的 RSS 地址，并一键订阅
// @author       GeBron
// @match        https://github.com/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561701/GitHub%20RSS%20%20Inoreader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561701/GitHub%20RSS%20%20Inoreader%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义所有的 RSS 类型
    const FEED_TYPES = [
        { id: 'show_tags', label: 'Tags', suffix: 'tags.atom' },
        { id: 'show_releases', label: 'Releases', suffix: 'releases.atom' },
        { id: 'show_issues', label: 'Issues', suffix: 'issues.atom' },
        { id: 'show_commits', label: 'Commits', suffix: 'commits.atom' }
    ];

    // 初始化/注册设置菜单
    FEED_TYPES.forEach(type => {
        // 默认开启除了 Commits 以外的所有项
        const defaultValue = type.id !== 'show_commits';
        if (GM_getValue(type.id) === undefined) {
            GM_setValue(type.id, defaultValue);
        }

        // 注册菜单命令
        const currentState = GM_getValue(type.id) ? '✅' : '❌';
        GM_registerMenuCommand(`${currentState} 显示 ${type.label}`, () => {
            GM_setValue(type.id, !GM_getValue(type.id));
            location.reload(); // 刷新页面应用设置
        });
    });

    function injectRSSSection() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length !== 2) return;

        const [owner, repo] = pathParts;
        const baseUrl = `https://github.com/${owner}/${repo}`;
        const sidebar = document.querySelector('.Layout-sidebar .BorderGrid');

        if (!sidebar || document.getElementById('github-rss-helper')) return;

        // 过滤出用户开启的 Feeds
        const activeFeeds = FEED_TYPES.filter(t => GM_getValue(t.id));
        if (activeFeeds.length === 0) return;

        const row = document.createElement('div');
        row.className = 'BorderGrid-row';
        row.id = 'github-rss-helper';

        const cell = document.createElement('div');
        cell.className = 'BorderGrid-cell';

        const title = document.createElement('h2');
        title.className = 'h4 mb-3';
        title.innerText = 'RSS Feeds';
        cell.appendChild(title);

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';

        activeFeeds.forEach(feed => {
            const fullUrl = `${baseUrl}/${feed.suffix}`;
            const li = document.createElement('li');
            li.className = 'd-flex flex-items-center mb-2';
            li.style.justifyContent = 'space-between';

            const label = document.createElement('span');
            label.className = 'text-small text-bold color-fg-default';
            label.innerText = feed.label;

            const actions = document.createElement('div');

            const inoBtn = document.createElement('a');
            inoBtn.innerText = 'Inoreader';
            inoBtn.className = 'btn btn-sm py-0 px-2 mr-1';
            inoBtn.style.fontSize = '10px';
            inoBtn.href = `https://www.inoreader.com/?add_feed=${encodeURIComponent(fullUrl)}`;
            inoBtn.target = '_blank';

            const copyBtn = document.createElement('button');
            copyBtn.innerText = 'Copy';
            copyBtn.className = 'btn btn-sm py-0 px-2';
            copyBtn.style.fontSize = '10px';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(fullUrl);
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'OK!';
                setTimeout(() => copyBtn.innerText = originalText, 1000);
            };

            actions.appendChild(inoBtn);
            actions.appendChild(copyBtn);
            li.appendChild(label);
            li.appendChild(actions);
            ul.appendChild(li);
        });

        cell.appendChild(ul);
        row.appendChild(cell);
        sidebar.appendChild(row);
    }

    // 初始化运行
    injectRSSSection();
    // 监听 GitHub 的页面导航事件
    document.addEventListener('turbo:render', injectRSSSection);
})();