// ==UserScript==
// @name         BR | Ultra Auto-Reply (Pro Version)
// @namespace    https://forum.blackrussia.online
// @version      6.2.0
// @description  Бесконечные ответы, расширенные фразы и имитация действий человека.
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/categories/*
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561352/BR%20%7C%20Ultra%20Auto-Reply%20%28Pro%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561352/BR%20%7C%20Ultra%20Auto-Reply%20%28Pro%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MY_NICK: "Nuserik Detta",
        // Базовое ожидание + случайный бонус ниже
        MIN_WAIT: 16, 
        MAX_WAIT: 22,
        PHRASES: [
            "Up", "Согласен", "Поддерживаю", "Полностью поддерживаю", 
            "Up!", "Разумное предложение", "За", "Однозначно Up", 
            "Не поддерживаю", "Хорошая идея"
        ]
    };

    function showStatus(msg, color = "white") {
        let ui = document.getElementById('br-status-ui');
        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'br-status-ui';
            ui.style = 'position:fixed;top:0;left:0;right:0;background:rgba(15,15,15,0.98);color:white;padding:14px;z-index:999999;text-align:center;font-family:sans-serif;font-weight:bold;border-bottom:3px solid #ff4444;box-shadow:0 2px 10px rgba(0,0,0,0.5);';
            document.body.appendChild(ui);
        }
        ui.innerText = `[BR-SYSTEM] ${msg}`;
        ui.style.borderBottomColor = color;
    }

    const Storage = {
        save: (id) => {
            let list = JSON.parse(localStorage.getItem('br_replied_ids') || '[]');
            if (!list.includes(id)) {
                list.push(id);
                if (list.length > 3000) list.shift();
                localStorage.setItem('br_replied_ids', JSON.stringify(list));
            }
        },
        has: (id) => JSON.parse(localStorage.getItem('br_replied_ids') || '[]').includes(id)
    };

    async function run() {
        const url = window.location.href;

        // --- ЛОГИКА В СПИСКЕ ТЕМ ---
        if (url.includes('/categories/') || url.includes('/forums/')) {
            showStatus("ПОИСК НЕОТВЕЧЕННОЙ ТЕМЫ...", "#3498db");

            const threads = document.querySelectorAll('.structItem--thread');
            let targetLink = null;

            for (let thread of threads) {
                const linkElem = thread.querySelector('.structItem-title a[href*="/threads/"]');
                const isLocked = thread.querySelector('.structItem-status--locked');
                const isSticky = thread.classList.contains('structItem--sticky'); // Пропускаем закрепленные (важные) темы
                
                if (linkElem && !isSticky) {
                    const threadId = linkElem.href.match(/\.(\d+)\//)?.[1];
                    if (threadId && !Storage.has(threadId) && !isLocked) {
                        targetLink = linkElem.href;
                        break;
                    }
                }
            }

            if (targetLink) {
                showStatus("ЦЕЛЬ НАЙДЕНА. ПЕРЕХОД...", "#2ecc71");
                location.assign(targetLink);
            } else {
                const nextBtn = document.querySelector('.pageNav-jump--next');
                if (nextBtn) {
                    showStatus("НА СТРАНИЦЕ ВСЁ ОТВЕЧЕНО. ЛИСТАЮ...", "#f1c40f");
                    setTimeout(() => nextBtn.click(), 1500);
                } else {
                    showStatus("РАЗДЕЛ ПОЛНОСТЬЮ ПРОЙДЕН. ПЕРЕЗАПУСК...", "#e74c3c");
                    setTimeout(() => location.assign('https://forum.blackrussia.online/forums/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/'), 5000);
                }
            }
        }

        // --- ЛОГИКА ВНУТРИ ТЕМЫ ---
        if (url.includes('/threads/')) {
            const threadId = url.match(/\.(\d+)\//)?.[1];
            const authors = document.querySelectorAll('.message-name .username');
            let alreadyReplied = false;

            authors.forEach(a => {
                if (a.innerText.trim().toLowerCase() === CONFIG.MY_NICK.toLowerCase()) alreadyReplied = true;
            });

            if (alreadyReplied) {
                showStatus("ВЫ УЖЕ ЗДЕСЬ ОТВЕТИЛИ. ВОЗВРАТ...", "#e67e22");
                if (threadId) Storage.save(threadId);
                setTimeout(() => window.history.back(), 1500);
                return;
            }

            // Рандомный таймер для имитации человека
            let timer = Math.floor(Math.random() * (CONFIG.MAX_WAIT - CONFIG.MIN_WAIT + 1)) + CONFIG.MIN_WAIT;
            
            const interval = setInterval(() => {
                showStatus(`ИМИТАЦИЯ ЧТЕНИЯ: ${timer} СЕК.`, "#1abc9c");
                if (timer <= 0) {
                    clearInterval(interval);
                    sendReply();
                }
                timer--;
            }, 1000);

            async function sendReply() {
                const editor = document.querySelector('.fr-element.fr-view');
                const submit = document.querySelector('.button--primary.button--icon--reply');

                if (editor && submit) {
                    const msg = CONFIG.PHRASES[Math.floor(Math.random() * CONFIG.PHRASES.length)];
                    editor.innerHTML = `<p>${msg}</p>`;
                    showStatus(`ПЕЧАТАЮ ОТВЕТ: ${msg}`, "#2ecc71");
                    
                    setTimeout(() => {
                        submit.click();
                        if (threadId) Storage.save(threadId);
                        setTimeout(() => window.history.back(), 3500);
                    }, 1200);
                } else {
                    showStatus("ДОСТУП ОГРАНИЧЕН (ЗАКРЫТО)", "#e74c3c");
                    if (threadId) Storage.save(threadId);
                    window.history.back();
                }
            }
        }
    }

    setTimeout(run, 1500);
})();
