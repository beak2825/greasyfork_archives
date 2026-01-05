// ==UserScript==
// @name         BR | Reaction Farmer (FIXED)
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Исправлен поиск профилей и клики по реакциям.
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/members/*
// @match        https://forum.blackrussia.online/online/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561401/BR%20%7C%20Reaction%20Farmer%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561401/BR%20%7C%20Reaction%20Farmer%20%28FIXED%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        ONLINE_URL: 'https://forum.blackrussia.online/online/',
        LIKE_DELAY: 2500, // Увеличил задержку для обхода защиты
        MAX_PER_USER: 3   // Ставим 3 лайка и идем дальше (быстрее фарм)
    };

    const DB = {
        key: 'br_farm_v21',
        save: (id) => {
            let data = JSON.parse(localStorage.getItem(DB.key) || '[]');
            if (!data.includes(id)) {
                data.push(id);
                localStorage.setItem(DB.key, JSON.stringify(data));
            }
        },
        has: (id) => JSON.parse(localStorage.getItem(DB.key) || '[]').includes(id)
    };

    function setStatus(msg, color = "lime") {
        let ui = document.getElementById('farm-status');
        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'farm-status';
            ui.style = 'position:fixed;bottom:20px;left:20px;background:rgba(0,0,0,0.9);color:#fff;padding:15px;z-index:10000;border-radius:8px;border:1px solid ' + color + ';font-family:sans-serif;font-size:13px;';
            document.body.appendChild(ui);
        }
        ui.innerText = `[FARMER 2.1] ${msg}`;
        ui.style.borderColor = color;
    }

    async function farm() {
        const url = window.location.href;

        // 1. ЛОГИКА В СПИСКЕ ОНЛАЙН
        if (url.includes('/online/')) {
            setStatus("Ищу профиль для фарма...");
            
            // Ищем ссылки именно на профили (фильтруем лишнее)
            const links = Array.from(document.querySelectorAll('a[username]')).filter(l => l.href.includes('/members/'));
            
            for (let link of links) {
                const id = link.href.match(/\.(\d+)\//)?.[1];
                if (id && !DB.has(id)) {
                    setStatus(`Выбрана цель: ${link.innerText}`, "cyan");
                    setTimeout(() => location.assign(link.href), 1500);
                    return;
                }
            }
            // Если на странице всех пролайкали - идем на 2 страницу онлайн
            setStatus("На этой странице все готовы. Листаю...");
            const next = document.querySelector('.pageNav-jump--next');
            if (next) next.click(); else location.assign(CONFIG.ONLINE_URL);
        }

        // 2. ЛОГИКА В ПРОФИЛЕ
        if (url.includes('/members/')) {
            const userId = url.match(/\.(\d+)\//)?.[1];
            
            // Ждем прогрузки ленты сообщений
            setTimeout(async () => {
                const reactions = document.querySelectorAll('.reaction--imageBinary, .reaction');
                let count = 0;

                if (reactions.length === 0) {
                    setStatus("Тут нет сообщений. Ухожу...");
                    DB.save(userId);
                    return setTimeout(() => location.assign(CONFIG.ONLINE_URL), 2000);
                }

                for (let btn of reactions) {
                    if (count >= CONFIG.MAX_PER_USER) break;

                    // Проверяем, что это не "уже поставленный" лайк
                    if (!btn.classList.contains('reaction--reacted')) {
                        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(r => setTimeout(r, CONFIG.LIKE_DELAY));
                        
                        try {
                            btn.click();
                            count++;
                            setStatus(`Лайкаю: ${count}/${CONFIG.MAX_PER_USER}`);
                        } catch(e) { console.log("Ошибка клика"); }
                    }
                }

                setStatus("Готово. Иду за новым профилем...");
                DB.save(userId);
                setTimeout(() => location.assign(CONFIG.ONLINE_URL), 3000);
            }, 2000);
        }
    }

    // Запуск после полной загрузки
    if (document.readyState === 'complete') farm();
    else window.addEventListener('load', farm);

})();
