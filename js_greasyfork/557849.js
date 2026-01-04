// ==UserScript==
// @name         Linux.do 用户主题按钮 (个人自用)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 linux.do 论坛的每个帖子中，在用户名称右侧添加一个“TA的话题”按钮。通过监听 SPA 导航，确保在任何帖子页面都能稳定生效。
// @author       AI & You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557849/Linuxdo%20%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A2%98%E6%8C%89%E9%92%AE%20%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557849/Linuxdo%20%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A2%98%E6%8C%89%E9%92%AE%20%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义核心函数，用于查找帖子并添加按钮
    const addButtons = () => {
        // 1. 选择页面中所有独立的帖子容器。
        const posts = document.querySelectorAll('div.topic-post');

        posts.forEach(post => {
            // 2. 查找帖子中显示用户名的链接
            // 更通用的选择器：直接查找带有 data-user-card 属性的链接
            const usernameLink = post.querySelector('a[data-user-card]');

            // 3. 确保找到用户名链接，且该帖子尚未添加按钮
            if (usernameLink && !post.querySelector('.user-topics-button')) {
                // 4. 获取用户名
                const username = usernameLink.dataset.userCard;
                if (!username) return; // 如果没有用户名，则跳过

                // 构建 URL
                const topicsUrl = `https://linux.do/u/${username}/activity/topics`;

                // 创建按钮
                const button = document.createElement('a');
                button.href = topicsUrl;
                button.textContent = 'TA的话题';
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
                button.className = 'user-topics-button'; // 用于检查是否已添加

                // 设置样式
                Object.assign(button.style, {
                    display: 'inline-block', // 关键：使按钮与文本同行显示
                    verticalAlign: 'middle', // 垂直居中对齐，与用户名文本保持一致
                    marginLeft: '8px',       // 在用户名和按钮之间留出一些间距
                    padding: '2px 6px',      // 调整内边距，使按钮更紧凑
                    backgroundColor: '#4088da',
                    color: 'white',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'normal',    // 字体不要太粗，与周围文本协调
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap',    // 防止按钮内的文本换行
                });

                // 悬停效果
                button.onmouseover = () => button.style.backgroundColor = '#2a6cbb';
                button.onmouseout = () => button.style.backgroundColor = '#4088da';

                // 5. 将按钮插入到用户名链接的后面
                // 插入到用户名链接的父元素中，并位于用户名链接之后
                usernameLink.parentNode.insertBefore(button, usernameLink.nextSibling);
            }
        });
    };

    // 页面首次加载或动态切换后，尝试执行
    // 使用 setTimeout 是为了给页面一些初始渲染的时间
    setTimeout(addButtons, 500);

    // 找到Discourse的核心内容容器
    const mainOutlet = document.getElementById('main-outlet');

    if (mainOutlet) {
        // 创建一个观察器实例，当 main-outlet 的子节点发生变化时，重新运行我们的函数
        const observer = new MutationObserver((mutations) => {
            // 检查是否有节点被添加，这是页面切换的强烈信号
            const nodesAdded = mutations.some(m => m.addedNodes && m.addedNodes.length > 0);
            if (nodesAdded) {
                // 延迟一小段时间执行，确保新内容的JS也运行完毕
                setTimeout(addButtons, 500);
            }
        });

        // 配置观察器：观察目标节点（main-outlet）的子列表变化
        observer.observe(mainOutlet, {
            childList: true,
            subtree: true,
        });
    } else {
        // 如果找不到 main-outlet，回退到监视整个 body (健壮性考虑)
        const observer = new MutationObserver(() => setTimeout(addButtons, 500));
        observer.observe(document.body, { childList: true, subtree: true });
        console.warn('Linux.do Button Script: Could not find #main-outlet, falling back to observing document.body.');
    }
})();