// ==UserScript==
// @name         ASStars — Ручная пометка колод (S/без S) v3
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ручная пометка колод с учётом количества S (x2, x3...). Сохраняет в localStorage и отображает при повторном визите.
// @author       ChatGPT
// @match        https://asstars.tv/user/*/cards_progress*
// @match        https://animestars.org/user/*/cards_progress*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560807/ASStars%20%E2%80%94%20%D0%A0%D1%83%D1%87%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%20%28S%D0%B1%D0%B5%D0%B7%20S%29%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/560807/ASStars%20%E2%80%94%20%D0%A0%D1%83%D1%87%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%20%28S%D0%B1%D0%B5%D0%B7%20S%29%20v3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'asstars_s_rank_flags_v3';

    function loadFlags() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }

    function saveFlags(flags) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    }

    function createTag(text, color) {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.marginLeft = '8px';
        span.style.padding = '2px 6px';
        span.style.borderRadius = '5px';
        span.style.fontSize = '12px';
        span.style.color = 'white';
        span.style.backgroundColor = color;
        return span;
    }

    function createButton(label, color, callback) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.marginLeft = '5px';
        btn.style.fontSize = '10px';
        btn.style.padding = '2px 4px';
        btn.style.borderRadius = '4px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = color;
        btn.style.color = 'white';
        return btn.addEventListener('click', callback), btn;
    }

    function init() {
        const flags = loadFlags();

        const animeLinks = [...document.querySelectorAll('a.user-anime__title')];

        animeLinks.forEach(link => {
            const href = link.getAttribute('href');
            const id = href;

            const wrapper = document.createElement('span');

            const yesBtn = createButton('❌ Есть S', '#e74c3c', () => {
                if (!flags[id] || flags[id].status !== 'has_s') {
                    flags[id] = { status: 'has_s', count: 1 };
                } else {
                    flags[id].count++;
                }
                saveFlags(flags);
                updateTag();
            });

            const noBtn = createButton('✅ Нет S', '#2ecc71', () => {
                flags[id] = { status: 'no_s', count: 1 };
                saveFlags(flags);
                updateTag();
            });

            const tag = document.createElement('span');

            function updateTag() {
                tag.textContent = '';
                const entry = flags[id];
                if (!entry) return;

                if (entry.status === 'has_s') {
                    const countText = entry.count > 1 ? ` ❌ Есть S x${entry.count}` : '❌ Есть S';
                    tag.replaceChildren(createTag(countText, '#e74c3c'));
                } else if (entry.status === 'no_s') {
                    tag.replaceChildren(createTag('✅ Нет S', '#2ecc71'));
                }
            }

            wrapper.appendChild(yesBtn);
            wrapper.appendChild(noBtn);
            wrapper.appendChild(tag);

            link.parentNode.appendChild(wrapper);
            updateTag();
        });
    }

    window.addEventListener('load', init);
})();
