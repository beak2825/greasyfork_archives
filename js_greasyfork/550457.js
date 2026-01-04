// ==UserScript==
// @name         Пук
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  пук
// @author       Sky
// @license      MIT
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(pvp_guild).php*/
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(pvp_guild).php*/
// @include      https://my.lordswm.com/*
// @include      https://www.heroeswm.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550457/%D0%9F%D1%83%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550457/%D0%9F%D1%83%D0%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';

    window.addEventListener('load', () => {
        const target = document.querySelector('.gt_main');

        if (!target) {
            console.log('gt_main не найден.');
            return;
        }

        target.style.position = 'relative';

        const btn = document.createElement('button');
        btn.textContent = 'Обновить';
        btn.style.position = 'absolute';
        btn.style.top = '5px';
        btn.style.right = '5px';
        btn.style.padding = '6px 12px';
        btn.style.backgroundColor = '#ddd9cd';
        btn.style.color = 'black';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.title = 'Обновить страницу';

        btn.addEventListener('click', () => {
            location.reload();
        });

        target.appendChild(btn);
        console.log('Кнопка "Обновить" добавлена в gt_main');
    });
})();