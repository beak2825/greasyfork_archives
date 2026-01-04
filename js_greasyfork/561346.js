// ==UserScript==
// @name         BR | Optimized Auto-Reply
// @namespace    https://forum.blackrussia.online
// @version      5.4.0
// @description  Оптимизация загрузки страниц и исправление зависаний
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/categories/*
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561346/BR%20%7C%20Optimized%20Auto-Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/561346/BR%20%7C%20Optimized%20Auto-Reply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOME: 'https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/',
        WAIT: 35,
        PHRASES: ["Up", "Не поддерживаю"]
    };

    function showUI(txt) {
        let p = document.getElementById('br-ultra-ui');
        if (!p) {
            p = document.createElement('div');
            p.id = 'br-ultra-ui';
            p.style = 'position:fixed;top:0;left:0;right:0;background:rgba(255,0,0,0.9);color:white;padding:10px;z-index:1000000;text-align:center;font-family:sans-serif;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.5);';
            document.body.appendChild(p);
        }
        p.innerText = txt;
    }

    async function start() {
        // Ждем, пока прогрузится структура страницы, чтобы не мешать браузеру
        if (document.readyState === 'loading') {
            await new Promise(r => document.addEventListener('DOMContentLoaded', r));
        }

        const url = window.location.href;

        // 1. ЛОГИКА В РАЗДЕЛАХ
        if (url.includes('/categories/') || url.includes('/forums/')) {
            showUI("СКАНИРОВАНИЕ...");

            const threads = document.querySelectorAll('.structItem-title a');
            
            if (threads.length === 0) {
                const nodes = document.querySelectorAll('.node-title a');
                if (nodes.length > 0) {
                    showUI("ВХОД В ПОДРАЗДЕЛ...");
                    location.replace(nodes[0].href);
                    return;
                }
            }

            for (let t of threads) {
                if (t.href.includes('/threads/')) {
                    if (!sessionStorage.getItem('done_' + t.href)) {
                        showUI("ПЕРЕХОД...");
                        location.replace(t.href); // replace быстрее href
                        return;
                    }
                }
            }
            
            showUI("ОЖИДАНИЕ ОБНОВЛЕНИЯ...");
            setTimeout(() => { location.replace(CONFIG.HOME); }, 10000);
        }

        // 2. ЛОГИКА В ТЕМЕ
        if (url.includes('/threads/')) {
            let timer = CONFIG.WAIT;
            
            const countdown = setInterval(() => {
                showUI(`ОТПРАВКА: ${timer} сек`);
                if (timer <= 0) {
                    clearInterval(countdown);
                    send();
                }
                timer--;
            }, 1000);

            async function send() {
                const editor = document.querySelector('.fr-element.fr-view');
                const btn = document.querySelector('.button--primary.button--icon--reply') || 
                            document.querySelector('button[type="submit"].button--icon--reply');

                if (editor && btn) {
                    const msg = CONFIG.PHRASES[Math.floor(Math.random() * CONFIG.PHRASES.length)];
                    editor.innerHTML = `<p>${msg}</p>`;
                    showUI("КЛИК...");
                    
                    setTimeout(() => {
                        btn.click();
                        sessionStorage.setItem('done_' + url, '1');
                        // После ответа ждем чуть дольше, чтобы форум успел сохранить пост
                        setTimeout(() => { location.replace(CONFIG.HOME); }, 5000);
                    }, 1000);
                } else {
                    showUI("ЗАКРЫТО ИЛИ ОШИБКА");
                    sessionStorage.setItem('done_' + url, '1');
                    setTimeout(() => { location.replace(CONFIG.HOME); }, 2000);
                }
            }
        }
    }

    // Запускаем через небольшую паузу, чтобы дать браузеру "вдохнуть"
    setTimeout(start, 500);
})();
