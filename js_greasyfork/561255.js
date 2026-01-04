// ==UserScript==
// @name         TMDB 详情页一键复制标签
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 TMDB 详情页标题旁增加“标题 (年份) {tmdbid=id}”标签，点击一键复制
// @author       YourName
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @icon         https://www.themoviedb.org/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561255/TMDB%20%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/561255/TMDB%20%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addCopyTag = () => {
        // 避免重复添加
        if (document.querySelector('.custom-tmdb-copy-tag')) return;

        // 1. 提取数据
        // 标题通常在 h2 a 中
        const titleElement = document.querySelector('.title h2 a') || document.querySelector('.title h2');
        // 年份通常在 .tagline 之前的 span.release_date 中
        const yearElement = document.querySelector('.title .release_date');
        // 从 URL 提取 ID
        const match = window.location.pathname.match(/\/(movie|tv)\/(\d+)/);

        if (titleElement && match) {
            const title = titleElement.innerText.trim();
            const id = match[2];
            const yearMatch = yearElement ? yearElement.innerText.match(/\d{4}/) : null;
            const year = yearMatch ? yearMatch[0] : '未知年份';

            // 构造目标文本
            const copyText = `${title} (${year}) {tmdbid=${id}}`;

            // 2. 创建标签元素
            const tag = document.createElement('span');
            tag.className = 'custom-tmdb-copy-tag';
            tag.innerText = copyText;
            tag.title = '点击复制到剪贴板';

            // 3. 样式设置 (侧重于详情页的高亮感)
            Object.assign(tag.style, {
                display: 'inline-block',
                marginLeft: '15px',
                padding: '4px 12px',
                backgroundColor: 'rgba(1, 180, 228, 0.1)',
                border: '1px solid #01b4e4',
                color: '#01b4e4',
                borderRadius: '20px',
                fontSize: '0.6em',
                verticalAlign: 'middle',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
            });

            // 4. 点击复制逻辑
            tag.addEventListener('click', () => {
                navigator.clipboard.writeText(copyText).then(() => {
                    const originalText = tag.innerText;
                    tag.innerText = '已成功复制！';
                    tag.style.backgroundColor = '#21d07a';
                    tag.style.color = 'white';
                    tag.style.borderColor = '#21d07a';

                    setTimeout(() => {
                        tag.innerText = originalText;
                        tag.style.backgroundColor = 'rgba(1, 180, 228, 0.1)';
                        tag.style.color = '#01b4e4';
                        tag.style.borderColor = '#01b4e4';
                    }, 1200);
                });
            });

            // 5. 插入到标题容器中
            const header = document.querySelector('.title h2');
            if (header) {
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.flexWrap = 'wrap';
                header.appendChild(tag);
            }
        }
    };

    // 详情页通常是静态加载，但也可能由于单页应用逻辑需要延迟或观察
    // 先直接运行一次
    setTimeout(addCopyTag, 500);

    // 监听可能发生的动态内容变化（如切换季度等）
    const observer = new MutationObserver(() => addCopyTag());
    const target = document.querySelector('body');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    }
})();