// ==UserScript==
// @name         豆瓣 NeoDB 助手
// @namespace    https://cdjax.com/
// @version      0.5
// @license      MIT
// @description  在豆瓣页面显示 NeoDB 对应条目
// @author       GitHub@aooyoo
// @match        https://movie.douban.com/subject/*
// @match        https://music.douban.com/subject/*
// @match        https://book.douban.com/subject/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561870/%E8%B1%86%E7%93%A3%20NeoDB%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561870/%E8%B1%86%E7%93%A3%20NeoDB%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个标记，防止重复添加
    const NEODB_ADDED_FLAG = 'neodb-added';

    function addStyles() {
        const styles = `
            .neodb-section {
                margin-bottom: 30px;
            }
            .neodb-section h2 {
                color: #072;
                font-size: 15px;
                margin-bottom: 12px;
            }
            .neodb-section .neodb-link {
                display: block;
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
                color: #37a;
                text-decoration: none;
            }
            .neodb-section .neodb-link:hover {
                background: #e8f4f9;
            }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function insertAfterElement(newElement, targetElement) {
        if (targetElement.nextSibling) {
            targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
        } else {
            targetElement.parentNode.appendChild(newElement);
        }
    }

    function addNeoDBInfo() {
        // 检查是否已经添加过
        if (document.querySelector(`.${NEODB_ADDED_FLAG}`)) {
            return;
        }

        // 获取豆瓣条目标题
        const titleElement = document.querySelector('h1 span[property="v:itemreviewed"]');
        if (!titleElement) {
            console.log("未找到标题元素");
            return;
        }
        const title = titleElement.textContent.trim();

        // 获取年份
        const yearElement = document.querySelector('span.year');
        const year = yearElement ? yearElement.textContent.replace(/[()]/g, '').trim() : '';

        // 创建 NeoDB 区块
        const neodbSection = document.createElement('div');
        neodbSection.className = `neodb-section ${NEODB_ADDED_FLAG}`;

        // 添加标题
        const header = document.createElement('h2');
        header.textContent = 'NeoDB';
        neodbSection.appendChild(header);

        // 构建搜索链接
        const searchTerm = year ? `${title} ${year}` : title;
        const searchUrl = `https://neodb.social/search/?q=${encodeURIComponent(searchTerm)}`;
        
        // 添加链接
        const link = document.createElement('a');
        link.href = searchUrl;
        link.className = 'neodb-link';
        link.textContent = '在 NeoDB 上查看';
        link.target = '_blank';
        neodbSection.appendChild(link);

        // 插入到豆瓣右侧栏的适当位置
        const interestSection = document.querySelector('.related-info') || 
                              document.querySelector('.aside') ||
                              document.querySelector('#interest_sectl');
        
        if (interestSection) {
            insertAfterElement(neodbSection, interestSection);
            console.log("成功添加 NeoDB 区块");
        }
    }

    // 添加样式
    addStyles();

    // 当 DOM 加载完成后执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addNeoDBInfo);
    } else {
        addNeoDBInfo();
    }
})();
