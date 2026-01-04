// ==UserScript==
// @name         JavBus 多标签筛选
// @namespace    https://javbus.com/
// @version      0.2
// @description  支持 genre 与 uncensored/genre 的多标签勾选筛选
// @match        https://www.javbus.com/genre
// @match        https://www.javbus.com/uncensored/genre
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559576/JavBus%20%E5%A4%9A%E6%A0%87%E7%AD%BE%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559576/JavBus%20%E5%A4%9A%E6%A0%87%E7%AD%BE%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***********************
     * 样式注入（一次）
     ***********************/
    const style = document.createElement('style');
    style.textContent = `
        .genre-item {
            border-radius: 6px;
            transition: background 0.2s;
            cursor: pointer;
        }
        .genre-item:has(.genre-checkbox:checked) {
            background: #ff5a5f;
            color: #fff;
        }
        .genre-item:has(.genre-checkbox:checked) .genre-text {
            color: #fff;
        }
        .genre-checkbox {
            pointer-events: none;
        }

        #genre-search-btn {
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 9999;
            padding: 8px 12px;
            background: #ff5a5f;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        #genre-selected-panel {
            position: fixed;
            top: 170px;
            right: 20px;
            width: 220px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px;
            font-size: 12px;
            z-index: 9999;
        }

        #genre-selected-panel .selected-title {
            font-weight: bold;
            margin-bottom: 6px;
        }

        #genre-selected-panel .selected-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        #genre-selected-panel .selected-item {
            background: #ff5a5f;
            color: #fff;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);

    /***********************
     * URL 解析：是否为合法标签
     ***********************/
    function getGenreFromLink(link) {
        const url = new URL(link.href, location.origin);
        const parts = url.pathname.split('/').filter(Boolean);

        /**
         * 支持：
         * /genre/{tag}
         * /uncensored/genre/{tag}
         */
        let genreIndex = -1;

        if (parts[0] === 'genre') {
            genreIndex = 0;
        } else if (parts[0] === 'uncensored' && parts[1] === 'genre') {
            genreIndex = 1;
        }

        if (genreIndex === -1) return null;

        // 排除分页（多一段）
        if (parts.length !== genreIndex + 2) return null;

        return parts[genreIndex + 1];
    }

    /***********************
     * 搜索按钮
     ***********************/
    function addSearchButton() {
        if (document.getElementById('genre-search-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'genre-search-btn';
        btn.textContent = '多标签搜索';

        btn.addEventListener('click', () => {
            const checked = document.querySelectorAll('.genre-checkbox:checked');
            if (!checked.length) {
                alert('请至少选择一个标签');
                return;
            }

            const genres = [...checked].map(cb =>
                cb.closest('.genre-item').dataset.genre
            );

            const isUncensored = location.pathname.startsWith('/uncensored/');
            const basePath = isUncensored ? '/uncensored/genre/' : '/genre/';

            location.href = basePath + genres.join('-');
        });

        document.body.appendChild(btn);
    }

    /***********************
     * 已选标签面板
     ***********************/
    function addSelectedPanel() {
        if (document.getElementById('genre-selected-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'genre-selected-panel';
        panel.innerHTML = `
            <div class="selected-title">已选择标签：</div>
            <div class="selected-list"></div>
        `;
        document.body.appendChild(panel);
    }

    function updateSelectedPanel() {
        const list = document.querySelector('#genre-selected-panel .selected-list');
        if (!list) return;

        list.innerHTML = '';

        const checked = document.querySelectorAll('.genre-checkbox:checked');
        checked.forEach(cb => {
            const item = cb.closest('.genre-item');
            const text = item.querySelector('.genre-text').textContent;

            const chip = document.createElement('span');
            chip.className = 'selected-item';
            chip.textContent = text;

            chip.addEventListener('click', () => {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cb.checked = false;
                updateSelectedPanel();
            });

            list.appendChild(chip);
        });
    }

    /***********************
     * 主逻辑：处理标签
     ***********************/
    const timer = setInterval(() => {
        const links = Array.from(document.querySelectorAll('a[href]'))
            .filter(link => getGenreFromLink(link));

        if (!links.length) return;

        clearInterval(timer);

        links.forEach(link => {
            if (link.classList.contains('genre-item')) return;

            const genreId = getGenreFromLink(link);
            const text = link.textContent.trim();

            link.classList.add('genre-item');
            link.dataset.genre = genreId;

            link.textContent = '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'genre-checkbox';

            const span = document.createElement('span');
            span.className = 'genre-text';
            span.textContent = text;

            link.appendChild(checkbox);
            link.appendChild(span);

            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.justifyContent = 'center';
            link.style.gap = '6px';

            link.addEventListener('click', e => {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                updateSelectedPanel();
            });
        });

        addSearchButton();
        addSelectedPanel();
    }, 500);

})();
