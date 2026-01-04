// ==UserScript==
// @name         SJS Job Enhancer (new tab + visited grey + hide job)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Improve job cards: open in new tab, mark visited, hide unwanted jobs
// @match        https://www.sjs.co.nz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557470/SJS%20Job%20Enhancer%20%28new%20tab%20%2B%20visited%20grey%20%2B%20hide%20job%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557470/SJS%20Job%20Enhancer%20%28new%20tab%20%2B%20visited%20grey%20%2B%20hide%20job%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VISITED_KEY = 'sjs_visited_jobs';
    const HIDDEN_KEY  = 'sjs_hidden_jobs';

    function loadData(key) {
        try { return JSON.parse(localStorage.getItem(key) || '{}'); }
        catch { return {}; }
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    const visited = loadData(VISITED_KEY);
    const hidden  = loadData(HIDDEN_KEY);

    function markVisited(card) {
        card.style.backgroundColor = '#e6e6e6';
    }

    function hideCard(card, url) {
        hidden[url] = true;
        saveData(HIDDEN_KEY, hidden);
        card.style.display = 'none';
    }

    function createHideButton(card, url) {
        const btn = document.createElement('button');
        btn.textContent = 'Hide Job';
        btn.style.marginLeft = '8px';
        btn.style.padding = '4px 8px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            hideCard(card, url);
        });

        return btn;
    }

    function bindCards() {
        const cards = document.querySelectorAll('div[class^="JobCard_jobCard"]');

        cards.forEach(card => {
            if (card.dataset.bound === "1") return;
            card.dataset.bound = "1";

            const link = card.querySelector('a[href]');
            if (!link) return;

            const url = new URL(link.getAttribute('href'), location.origin).href;
            card.dataset.url = url;

            // 如果已隐藏 → 一进页面就消失
            if (hidden[url]) {
                card.style.display = 'none';
                return;
            }

            // 已访问 → 灰色
            if (visited[url]) {
                markVisited(card);
            }

            // 阻止原生跳转
            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
            });

            // 整个卡片可点击
            card.style.cursor = "pointer";

            card.addEventListener('click', e => {
                if (e.target.closest('button')) return;

                e.stopPropagation();
                e.preventDefault();

                window.open(url, '_blank');
                visited[url] = true;
                saveData(VISITED_KEY, visited);
                markVisited(card);
            }, true);

            // 插入 Hide 按钮
            const actionArea = card.querySelector('.JobCard_actions__6evij');
            if (actionArea) {
                const saveBtn = actionArea.querySelector('button');
                if (saveBtn && !actionArea.querySelector('.sjs-hide-btn')) {
                    const hideBtn = createHideButton(card, url);
                    hideBtn.classList.add('sjs-hide-btn');
                    actionArea.appendChild(hideBtn);
                }
            }
        });
    }

    bindCards();

    const observer = new MutationObserver(bindCards);
    observer.observe(document.body, { childList: true, subtree: true });
})();
