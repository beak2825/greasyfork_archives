// ==UserScript==
// @name         BR | Fast Auto-Reply FIXED
// @namespace    https://forum.blackrussia.online
// @version      5.2.1
// @description  Исправлены ошибки в 29-30 строках, убрано ожидание на главной
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/categories/*
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561341/BR%20%7C%20Fast%20Auto-Reply%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/561341/BR%20%7C%20Fast%20Auto-Reply%20FIXED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOME_URL: 'https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/',
        WAIT_TIME: 35,
        PHRASES: ["Up", "Не поддерживаю"]
    };

    // Исправленный блок базы данных (строки 27-33)
    const DB = {
        save: (id) => {
            let data = JSON.parse(localStorage.getItem('br_fast_db') || '[]');
            if (!data.includes(id)) { 
                data.push(id); 
                localStorage.setItem('br_fast_db', JSON.stringify(data)); 
            }
        },
        has: (id) => {
            let data = JSON.parse(localStorage.getItem('br_fast_db') || '[]');
            return data.includes(id);
        }
    };

    function setUI(text, color = "#fff") {
        let p = document.getElementById('br-fast-panel');
        if (!p) {
            p = document.createElement('div');
            p.id = 'br-fast-panel';
            p.style = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.95);color:white;padding:15px;z-index:1000000;text-align:center;font-weight:bold;border-bottom:3px solid red;font-family:sans-serif;';
            document.body.appendChild(p);
        }
        p.innerText = text;
        p.style.color = color;
    }

    async function run() {
        const url = window.location.href;

        // 1. ЛОГИКА В СПИСКЕ (РАЗДЕЛЫ И ТЕМЫ)
        if (url.includes('/categories/') || url.includes('/forums/')) {
            setUI("ПОИСК...");

            // Если мы на странице со списком ПОДРАЗДЕЛОВ (как на вашем фото)
            const subCategories = document.querySelectorAll('.node-title a');
            if (subCategories.length > 0 && (url.endsWith('.656/') || url.includes('656'))) {
                setUI("Вхожу в первый подраздел...", "#00eaff");
                subCategories[0].click(); // Заходим в "Предложения по улучшению игры"
                return;
            }

            // Если мы уже внутри подраздела, ищем темы
            const threads = document.querySelectorAll('.structItem--thread');
            let found = false;
            for (let t of threads) {
                const link = t.querySelector('.structItem-title a');
                const id = link ? link.href.match(/\.(\d+)\//)?.[1] : null;
                const label = t.querySelector('.label')?.innerText || "";

                if (id && !DB.has(id) && !label.includes('Закрыто') && !label.includes('Рассмотрено')) {
                    setUI("ТЕМА НАЙДЕНА! ПЕРЕХОД...", "#00ff00");
                    found = true;
                    window.location.href = link.href;
                    return;
                }
            }

            // Если на странице нет подходящих тем — идем на следующую страницу
            if (!found) {
                const next = document.querySelector('.pageNav-jump--next');
                if (next) {
                    setUI("Иду на следующую страницу...");
                    next.click();
                } else {
                    setUI("ВСЁ ОБРАБОТАНО. ОБНОВЛЯЮ...", "orange");
                    setTimeout(() => { window.location.href = CONFIG.HOME_URL; }, 10000);
                }
            }
        }

        // 2. ЛОГИКА В ТЕМЕ
        if (url.includes('/threads/')) {
            const threadId = url.match(/\.(\d+)\//)?.[1];
            if (DB.has(threadId)) {
                window.location.href = CONFIG.HOME_URL;
                return;
            }

            let timer = CONFIG.WAIT_TIME;
            const interval = setInterval(() => {
                if (timer > 0) {
                    setUI(`ОТПРАВКА ЧЕРЕЗ: ${timer} СЕК.`, "#ff4d4d");
                    timer--;
                } else {
                    clearInterval(interval);
                    send();
                }
            }, 1000);

            async function send() {
                const edit = document.querySelector('.fr-element.fr-view');
                const btn = document.querySelector('.button--primary.button--icon--reply') || document.querySelector('.button.button--icon--reply');
                
                if (edit && btn) {
                    const msg = CONFIG.PHRASES[Math.floor(Math.random() * CONFIG.PHRASES.length)];
                    edit.innerHTML = `<p>${msg}</p>`;
                    setUI("ОТПРАВКА: " + msg, "#00ff00");
                    
                    setTimeout(() => {
                        btn.click();
                        DB.save(threadId);
                        setTimeout(() => { window.location.href = CONFIG.HOME_URL; }, 3000);
                    }, 1000);
                } else {
                    DB.save(threadId);
                    window.location.href = CONFIG.HOME_URL;
                }
            }
        }
    }

    // Запуск скрипта
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run);
})();
