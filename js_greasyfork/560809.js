// ==UserScript==
// @name         Экспорт колод (+неполученные награды, только 1 S) v3.3
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Экспорт S/без S/без метки и БЕЗ НАГРАДЫ (но только с одной S). Перетаскиваемая кнопка.
// @author       ChatGPT
// @match        https://asstars.tv/user/*/cards_progress*
// @match        https://animestars.org/user/*/cards_progress*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560809/%D0%AD%D0%BA%D1%81%D0%BF%D0%BE%D1%80%D1%82%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%20%28%2B%D0%BD%D0%B5%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%D0%B3%D1%80%D0%B0%D0%B4%D1%8B%2C%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%201%20S%29%20v33.user.js
// @updateURL https://update.greasyfork.org/scripts/560809/%D0%AD%D0%BA%D1%81%D0%BF%D0%BE%D1%80%D1%82%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%20%28%2B%D0%BD%D0%B5%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%D0%B3%D1%80%D0%B0%D0%B4%D1%8B%2C%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%201%20S%29%20v33.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'asstars_s_rank_flags_v3';
    const POSITION_KEY = 'export_button_position_v1';
    const TOTAL_PAGES = 151;

    function loadFlags() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    async function fetchPage(url) {
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
    }

    async function exportAllPages(btn) {
        const flags = loadFlags();
        const hasS = [], noS = [], unmarked = [], unrewarded = [];

        const baseUrl = window.location.href.replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '');

        btn.disabled = true;

        for (let page = 1; page <= TOTAL_PAGES; page++) {
            btn.textContent = `⏳ Экспорт... (${page}/${TOTAL_PAGES})`;

            try {
                let doc;
                const url = page === 1 ? `${baseUrl}/` : `${baseUrl}/page/${page}/`;

                if (page === 1 && (window.location.href === url || window.location.href === url.replace(/\/$/, '')))
                    doc = document;
                else
                    doc = await fetchPage(url);

                const blocks = [...doc.querySelectorAll('.user-anime')];

                blocks.forEach(block => {
                    const link = block.querySelector('a.user-anime__title, div.user-anime__title > a, div.anime-card__title > a');
                    if (!link) return;

                    const href = link.getAttribute('href');
                    const match = href.match(/\/(\d+)-/);
                    const id = match ? match[1] : '???';

                    const entry = flags[href];
                    const count = entry?.count || 0;
                    const countText = count > 1 ? ` x${count}` : '';

                    const fullName = `${id} — ${link.textContent.trim()}${countText}`;

                    // ⭐ КЛЮЧЕВОЕ УСЛОВИЕ: нет награды + ровно 1 S
                    const reward = block.querySelector('.glav-s.completed'); // награда есть
                    const rewardNotReceived = !reward;

                    if (rewardNotReceived && entry?.status === 'has_s' && count === 1) {
                        unrewarded.push(fullName);
                    }

                    // СТАНДАРТНЫЙ ЭКСПОРТ
                    if (entry?.status === 'has_s') hasS.push(fullName);
                    else if (entry?.status === 'no_s') noS.push(fullName);
                    else unmarked.push(fullName);
                });

            } catch (e) {
                console.error(`Ошибка на странице ${page}:`, e);
            }
        }

        // сохраняем в файлы
        if (hasS.length) downloadFile('has_s.txt', hasS.join('\n'));
        if (noS.length) downloadFile('no_s.txt', noS.join('\n'));
        if (unmarked.length) downloadFile('unmarked.txt', unmarked.join('\n'));
        if (unrewarded.length) downloadFile('unrewarded_1S_no_reward.txt', unrewarded.join('\n'));

        btn.textContent =
            `📤 Готово (S:${hasS.length}, Без S:${noS.length}, Без метки:${unmarked.length}, 1S без награды:${unrewarded.length})`;

        btn.disabled = false;
    }

    // ===== перетаскиваемая кнопка =====

    function makeDraggable(el) {
        let pos = JSON.parse(localStorage.getItem(POSITION_KEY) || '{}');
        if (pos.top !== undefined && pos.left !== undefined) {
            el.style.top = pos.top + 'px';
            el.style.left = pos.left + 'px';
        }

        let drag = false, offX, offY;

        el.addEventListener('mousedown', e => {
            drag = true;
            offX = e.clientX - el.getBoundingClientRect().left;
            offY = e.clientY - el.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mouseup', () => {
            if (drag) {
                drag = false;
                localStorage.setItem(POSITION_KEY, JSON.stringify({
                    top: parseInt(el.style.top),
                    left: parseInt(el.style.left)
                }));
                document.body.style.userSelect = '';
            }
        });

        document.addEventListener('mousemove', e => {
            if (drag) {
                el.style.top = (e.clientY - offY) + 'px';
                el.style.left = (e.clientX - offX) + 'px';
            }
        });
    }

    function createButton(label) {
        const btn = document.createElement('button');
        btn.textContent = label;

        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '9999';

        btn.style.padding = '8px 14px';
        btn.style.fontSize = '13px';
        btn.style.background = '#3498db';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'move';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

        document.body.appendChild(btn);

        btn.addEventListener('dblclick', () => exportAllPages(btn));
        btn.title = 'Двойной клик — экспорт всех колод';

        makeDraggable(btn);
    }

    window.addEventListener('load', () => {
        createButton('📤 Экспорт Всех');
    });

})();
