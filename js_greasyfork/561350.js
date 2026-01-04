// ==UserScript==
// @name         BR | Ultra Auto-Reply (Balanced Phrases)
// @namespace    https://forum.blackrussia.online
// @version      5.5.1
// @description  Исправлен баланс фраз Up/Не поддерживаю и проверка ника
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/categories/*
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561350/BR%20%7C%20Ultra%20Auto-Reply%20%28Balanced%20Phrases%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561350/BR%20%7C%20Ultra%20Auto-Reply%20%28Balanced%20Phrases%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOME: 'https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/',
        WAIT: 35,
        MY_NICK: "Nuserik Detta", 
        // Добавлено больше вариантов "Up" для баланса выбора
        PHRASES: ["Up", "Не поддерживаю", "Up", "Up", "Не поддерживаю"] 
    };

    function showUI(txt, color = "red") {
        let p = document.getElementById('br-ultra-ui');
        if (!p) {
            p = document.createElement('div');
            p.id = 'br-ultra-ui';
            p.style = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.9);color:white;padding:12px;z-index:1000000;text-align:center;font-family:sans-serif;font-weight:bold;border-bottom:2px solid ' + color + ';';
            document.body.appendChild(p);
        }
        p.innerText = txt;
        p.style.borderBottomColor = color;
    }

    async function start() {
        if (document.readyState === 'loading') {
            await new Promise(r => document.addEventListener('DOMContentLoaded', r));
        }

        const url = window.location.href;

        // 1. ЛОГИКА В СПИСКЕ ТЕМ
        if (url.includes('/categories/') || url.includes('/forums/')) {
            showUI("СКАНИРОВАНИЕ ТЕМ...");

            const threads = document.querySelectorAll('.structItem-title a');
            
            if (threads.length === 0) {
                const nodes = document.querySelectorAll('.node-title a');
                if (nodes.length > 0) {
                    location.replace(nodes[0].href);
                    return;
                }
            }

            for (let t of threads) {
                if (t.href.includes('/threads/')) {
                    // Используем localStorage для надежности между сессиями
                    let doneList = JSON.parse(localStorage.getItem('done_threads') || '[]');
                    if (!doneList.includes(t.href)) {
                        showUI("ВХОД: " + t.innerText.substring(0, 20) + "...", "lime");
                        location.replace(t.href);
                        return;
                    }
                }
            }
            
            showUI("ВСЕ ТЕМЫ ПРОВЕРЕНЫ. ОБНОВЛЯЮ...");
            setTimeout(() => { location.replace(CONFIG.HOME); }, 10000);
        }

        // 2. ЛОГИКА ВНУТРИ ТЕМЫ
        if (url.includes('/threads/')) {
            // ПРОВЕРКА: Если ваш ник уже есть в сообщениях, пропускаем тему
            const posts = document.querySelectorAll('.message-inner');
            let alreadyReplied = false;
            posts.forEach(post => {
                if (post.innerText.includes(CONFIG.MY_NICK)) alreadyReplied = true;
            });

            if (alreadyReplied) {
                showUI("ВЫ УЖЕ ОТВЕТИЛИ. УХОЖУ...", "orange");
                saveToDone(url);
                setTimeout(() => { location.replace(CONFIG.HOME); }, 1500);
                return;
            }

            let timer = CONFIG.WAIT;
            const countdown = setInterval(() => {
                showUI(`ОТПРАВКА: ${timer} СЕК`, "cyan");
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
                    // Математически исправленный выбор фразы
                    const msg = CONFIG.PHRASES[Math.floor(Math.random() * CONFIG.PHRASES.length)];
                    editor.innerHTML = `<p>${msg}</p>`;
                    showUI("ОТПРАВКА: " + msg, "lime");
                    
                    setTimeout(() => {
                        btn.click();
                        saveToDone(url);
                        setTimeout(() => { location.replace(CONFIG.HOME); }, 5000);
                    }, 1000);
                } else {
                    showUI("ОШИБКА: ТЕМА ЗАКРЫТА");
                    saveToDone(url);
                    setTimeout(() => { location.replace(CONFIG.HOME); }, 2000);
                }
            }
        }
    }

    function saveToDone(url) {
        let list = JSON.parse(localStorage.getItem('done_threads') || '[]');
        if (!list.includes(url)) {
            list.push(url);
            localStorage.setItem('done_threads', JSON.stringify(list));
        }
    }

    setTimeout(start, 500);
})();
