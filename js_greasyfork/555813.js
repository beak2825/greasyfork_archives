// ==UserScript==
// @name         豆瓣电影列表过滤器
// @namespace    https://www.qs5.org/?douban-old-movie-filters
// @version      1.0
// @description  隐藏一年前上映的电影
// @author       ImDong
// @match        https://movie.douban.com/cinema/nowplaying/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555813/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555813/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getEndPlayDate(id) {
        return new Promise((resolve, reject) => {
            fetch(`https://movie.douban.com/subject/${id}`).then(response => response.text()).then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const dates = Array.from(
                    doc.querySelectorAll('#info span[property="v:initialReleaseDate"]')
                ).map(e => new Date(e.innerText.match(/^([0-9\-]+)/)[1]));

                const latest = new Date(Math.max(...dates));
                resolve(latest);
            }).catch(error => reject(error));
        })
    }

    async function filterOldMovies() {
        const list = document.querySelectorAll('ul.lists > li.list-item');
        const button = document.getElementById('filter-movies-btn');

        if (button) {
            button.disabled = true;
            button.textContent = '处理中...';
        }

        for (const item of list) {
            const id = item.dataset.subject;
            try {
                const endPlayDate = await getEndPlayDate(id);
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (endPlayDate < oneYearAgo) {
                    item.style.display = 'none';
                }
            } catch (error) {
                console.error(`Error fetching end play date for id ${id}:`, error);
            }
        }

        console.log('Finished processing all list items.');

        if (button) {
            button.textContent = '已完成';
            setTimeout(() => {
                button.textContent = '过滤旧电影';
                button.disabled = false;
            }, 2000);
        }
    }

    // 创建触发按钮
    function createButton() {
        const button = document.createElement('button');
        button.id = 'filter-movies-btn';
        button.textContent = '过滤旧电影';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #00b51d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#009c1a';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#00b51d';
        });

        button.addEventListener('click', filterOldMovies);

        document.body.appendChild(button);
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
})();