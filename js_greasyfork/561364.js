// ==UserScript==
// @name         BR | Ultra Auto-Reply (REBORN)
// @namespace    https://forum.blackrussia.online
// @version      9.5.0
// @description  Полная переработка на MutationObserver. Работает даже если форум лагает.
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/categories/*
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561364/BR%20%7C%20Ultra%20Auto-Reply%20%28REBORN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561364/BR%20%7C%20Ultra%20Auto-Reply%20%28REBORN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOME: 'https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/',
        MY_NICK: "Nuserik Detta",
        WAIT: 35,
        PHRASES: ["Up", "Согласен", "Поддерживаю", "Up!", "За"]
    };

    const DB = {
        key: 'br_reborn_db',
        save: (id) => {
            let data = JSON.parse(localStorage.getItem(DB.key) || '[]');
            if (!data.includes(id)) { data.push(id); localStorage.setItem(DB.key, JSON.stringify(data)); }
        },
        has: (id) => JSON.parse(localStorage.getItem(DB.key) || '[]').includes(id)
    };

    function setUI(text, color = "#ff4444") {
        let p = document.getElementById('br-reborn-ui');
        if (!p) {
            p = document.createElement('div');
            p.id = 'br-reborn-ui';
            p.style = 'position:fixed;top:0;left:0;right:0;background:#000;color:#fff;padding:12px;z-index:9999999;text-align:center;font-weight:bold;border-bottom:3px solid ' + color + ';font-family:sans-serif;';
            document.body.appendChild(p);
        }
        p.innerText = `[BR BOT 9.5] » ${text}`;
        p.style.borderBottomColor = color;
    }

    function startBot() {
        const url = window.location.href;

        // 1. ЕСЛИ В КАТЕГОРИИ
        if (url.includes('/categories/')) {
            const node = document.querySelector('.node-title a');
            if (node) { setUI("ВХОД В РАЗДЕЛ..."); location.replace(node.href); }
        }

        // 2. ЕСЛИ В СПИСКЕ ТЕМ
        if (url.includes('/forums/')) {
            const threads = document.querySelectorAll('.structItem--thread');
            if (threads.length === 0) return setUI("ОЖИДАНИЕ ЗАГРУЗКИ ТЕМ...");

            for (let t of threads) {
                const links = t.querySelectorAll('.structItem-title a');
                let target = null;
                links.forEach(l => { if (!l.href.includes('prefix_id=')) target = l; });

                const id = target ? target.href.match(/\.(\d+)\//)?.[1] : null;
                const locked = t.querySelector('.structItem-status--locked');
                const sticky = t.classList.contains('structItem--sticky');

                if (id && !DB.has(id) && !locked && !sticky) {
                    setUI("ЦЕЛЬ: " + target.innerText.substring(0, 15), "lime");
                    return location.assign(target.href);
                }
            }
            // Листалка
            const next = document.querySelector('.pageNav-jump--next');
            if (next) setTimeout(() => next.click(), 3000);
            else setTimeout(() => location.replace(CONFIG.HOME), 5000);
        }

        // 3. ЕСЛИ В ТЕМЕ
        if (url.includes('/threads/')) {
            const threadId = url.match(/\.(\d+)\//)?.[1];
            if (document.body.innerText.includes(CONFIG.MY_NICK) || (threadId && DB.has(threadId))) {
                setUI("УЖЕ ОТВЕЧЕНО. НАЗАД...");
                if (threadId) DB.save(threadId);
                return setTimeout(() => window.history.back(), 2000);
            }

            let time = CONFIG.WAIT;
            const timer = setInterval(() => {
                setUI(`КД: ${time} СЕК`, "#00eaff");
                if (time <= 0) {
                    clearInterval(timer);
                    const ed = document.querySelector('.fr-element.fr-view');
                    const btn = document.querySelector('.button--primary.button--icon--reply');
                    if (ed && btn) {
                        ed.innerHTML = `<p>${CONFIG.PHRASES[Math.floor(Math.random()*CONFIG.PHRASES.length)]}</p>`;
                        setTimeout(() => { btn.click(); if(threadId) DB.save(threadId); setTimeout(()=>window.history.back(), 4000); }, 1000);
                    } else { location.reload(); }
                }
                time--;
            }, 1000);
        }
    }

    // ГЛАВНЫЙ МЕХАНИЗМ: Следим за изменениями на странице
    const observer = new MutationObserver(() => {
        if (document.querySelector('.p-pageWrapper') || document.querySelector('.node-title')) {
            observer.disconnect(); // Нашли страницу - выключаем слежку и запускаем бота
            setTimeout(startBot, 1500);
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Запасной запуск, если MutationObserver не сработал
    setTimeout(() => { if (document.getElementById('br-reborn-ui') === null) startBot(); }, 5000);

})();
