// ==UserScript==
// @name         VK "Не интересно" — Быстрая кнопка
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Добавляет кнопку-крестик рядом с меню поста для быстрого доступа к функции "Не интересно"
// @author       sanni.lo | https://vk.com/sanni_lo
// @match        https://vk.com/feed*
// @grant        none
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23c00" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
// @downloadURL https://update.greasyfork.org/scripts/553797/VK%20%22%D0%9D%D0%B5%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BD%D0%BE%22%20%E2%80%94%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553797/VK%20%22%D0%9D%D0%B5%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BD%D0%BE%22%20%E2%80%94%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // 🎨 СТИЛИ И ИКОНКИ
    // ═══════════════════════════════════════════════════════════════
    
    const iconSVG = `
        <svg style="width:18px;height:18px;vertical-align:middle;cursor:pointer;transition:all 0.2s ease;" 
             viewBox="0 0 24 24">
            <path fill="#c00" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    `;

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ ОСНОВНАЯ ЛОГИКА
    // ═══════════════════════════════════════════════════════════════

    function addButton() {
        document.querySelectorAll('.PostHeader__statuses').forEach(function(el) {
            // Пропускаем, если кнопка уже добавлена
            if (el.parentElement.querySelector('.not-interest-btn')) return;
            
            const post = el.closest('[id^="post"]');
            if (!post) return;

            // Создаём кнопку
            const btn = document.createElement('span');
            btn.className = 'not-interest-btn';
            btn.innerHTML = iconSVG;
            btn.title = 'Не интересно';
            btn.style.cssText = 'margin-left:8px;display:inline-flex;align-items:center;';

            // Добавляем эффект наведения
            btn.onmouseenter = () => btn.querySelector('svg').style.transform = 'scale(1.15)';
            btn.onmouseleave = () => btn.querySelector('svg').style.transform = 'scale(1)';

            // Обработчик клика
            btn.onclick = function(e) {
                e.stopPropagation();

                // Находим кнопку меню (три точки)
                const menuToggleBtn = post.querySelector('button[data-testid="post_context_menu_toggle"]');
                
                if (menuToggleBtn) {
                    menuToggleBtn.click();
                    
                    // Ожидаем открытия меню и кликаем "Не интересно"
                    const tryClickNotInterested = () => {
                        const notInterestedBtn = document.querySelector('[data-testid="post_context_menu_item_not_interested"]');
                        
                        if (notInterestedBtn && notInterestedBtn.offsetParent !== null) {
                            notInterestedBtn.click();
                        } else if (attempts > 0) {
                            attempts--;
                            setTimeout(tryClickNotInterested, 100);
                        }
                    };
                    
                    let attempts = 10;
                    setTimeout(tryClickNotInterested, 200);
                } else {
                    console.warn('VK Quick Button: Меню поста не найдено');
                }
            };

            el.parentElement.appendChild(btn);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 НАБЛЮДАТЕЛЬ ЗА ЛЕНТОЙ
    // ═══════════════════════════════════════════════════════════════

    function observeFeed() {
        const feed = document.querySelector('#feed_rows');
        
        if (!feed) {
            setTimeout(observeFeed, 500);
            return;
        }

        const observer = new MutationObserver(addButton);
        observer.observe(feed, { childList: true, subtree: true });
        addButton();
    }

    // ═══════════════════════════════════════════════════════════════
    // 🚀 ЗАПУСК
    // ═══════════════════════════════════════════════════════════════

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", observeFeed);
    } else {
        observeFeed();
    }

    window.addEventListener("load", observeFeed);
    setTimeout(observeFeed, 1500);

})();
