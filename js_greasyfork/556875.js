// ==UserScript==
// @name         Canva Auto-Skip & Smart Promo (iOS Style)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Canva Auto-Skip & Smart Promo
// @author       Gostibissi
// @match        *://*.canva.com/*
// @grant        none
// @icon         https://i.pinimg.com/564x/32/20/9e/32209ee862a7969a7e5ba0e702332533.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556875/Canva%20Auto-Skip%20%20Smart%20Promo%20%28iOS%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556875/Canva%20Auto-Skip%20%20Smart%20Promo%20%28iOS%20Style%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= НАСТРОЙКИ =================
    const TELEGRAM_LINK = "https://t.me/gostibissi";

    // Словарик текстов (Успех + Промо)
    const i18n = {
        "ru": { success: "Переход выполнен", promo: "Больше плагинов здесь" },
        "en": { success: "Switched to browser", promo: "More plugins here" },
        "de": { success: "Browser-Modus aktiv", promo: "Mehr Plugins hier" },
        "uk": { success: "Перехід виконано", promo: "Більше плагінів тут" },
        "fr": { success: "Mode navigateur", promo: "Plus de plugins ici" },
        "es": { success: "Modo navegador", promo: "Más plugins aquí" },
        "pt": { success: "Modo navegador", promo: "Mais plugins aqui" },
        "it": { success: "Modalità browser", promo: "Altri plugin qui" },
        "pl": { success: "Tryb przeglądarki", promo: "Więcej wtyczek tutaj" },
        "tr": { success: "Tarayıcı modu", promo: "Daha fazla eklenti" },
        "zh": { success: "浏览器模式", promo: "更多插件在这里" }
    };

    // Корни слов для поиска кнопки
    const skipKeywords = [
        "browser", "браузер", "navigateur", "navegador",
        "fortfahren", "continue", "продолжить", "продовжити",
        "utiliser", "usar", "continuare"
    ];

    let hasClicked = false;

    // ================= ЛОКАЛИЗАЦИЯ =================
    function getTexts() {
        const lang = (document.documentElement.lang || navigator.language || 'en').toLowerCase().split('-')[0];
        return i18n[lang] || i18n['en'];
    }

    // ================= СТИЛИ (CSS) =================
    function injectStyles() {
        if (document.getElementById('canva-styles')) return;
        const style = document.createElement('style');
        style.id = 'canva-styles';
        style.innerHTML = `
            .canva-toast {
                position: fixed;
                left: 50%;
                transform: translateX(-50%);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                padding: 10px 20px;
                border-radius: 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Эффект пружины */
                border: 1px solid rgba(255,255,255,0.4);
            }

            /* Основное уведомление (Успех) */
            #toast-main {
                top: -80px;
                background: rgba(255, 255, 255, 0.95);
                color: #1d1d1f;
                z-index: 999999;
                pointer-events: none;
            }
            #toast-main.show {
                top: 30px;
            }

            /* Промо уведомление (Кнопка) */
            #toast-promo {
                top: 30px; /* Стартует ЗА основным уведомлением */
                background: rgba(0, 136, 204, 0.9); /* Цвет Telegram */
                color: white;
                z-index: 999998; /* Слой ниже основного */
                opacity: 0;
                cursor: pointer;
                padding: 8px 18px;
                font-size: 13px;
            }
            #toast-promo:hover {
                background: rgba(0, 136, 204, 1);
                transform: translateX(-50%) scale(1.05);
            }
            #toast-promo.pop-out {
                top: 85px; /* Выезжает вниз */
                opacity: 1;
            }

            .c-icon {
                width: 18px;
                height: 18px;
                background: #34c759;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
            }
            .tg-icon {
                background: white;
                color: #0088cc;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    // ================= ЛОГИКА УВЕДОМЛЕНИЙ =================

    function showNotifications() {
        injectStyles();
        const texts = getTexts();

        // 1. Создаем ОСНОВНОЕ уведомление
        const mainToast = document.createElement('div');
        mainToast.id = 'toast-main';
        mainToast.className = 'canva-toast';
        mainToast.innerHTML = `<div class="c-icon">✓</div><span>${texts.success}</span>`;
        document.body.appendChild(mainToast);

        // 2. Создаем ПРОМО (скрыто под основным)
        const promoToast = document.createElement('div');
        promoToast.id = 'toast-promo';
        promoToast.className = 'canva-toast';
        promoToast.innerHTML = `<div class="c-icon tg-icon">➤</div><span>${texts.promo}</span>`;

        // Логика клика по промо
        promoToast.onclick = function() {
            window.open(TELEGRAM_LINK, '_blank');
        };
        document.body.appendChild(promoToast);

        // --- АНИМАЦИЯ ---

        // Шаг 1: Показываем "Успех" сразу
        requestAnimationFrame(() => {
            mainToast.classList.add('show');
        });

        // Шаг 2: "Выплевываем" промо через случайное время (0.5 - 1.5 сек)
        const randomDelay = Math.floor(Math.random() * 1000) + 500;

        setTimeout(() => {
            promoToast.classList.add('pop-out');
        }, randomDelay);

        // Шаг 3: Убираем "Успех" через 3 секунды
        setTimeout(() => {
            mainToast.classList.remove('show');
            setTimeout(() => mainToast.remove(), 600);
        }, 3000);

        // Шаг 4: Убираем "Промо" через 7 секунд (оно висит дольше)
        setTimeout(() => {
            promoToast.classList.remove('pop-out');
            setTimeout(() => promoToast.remove(), 600);
        }, 4000);
    }

    // ================= КЛИКЕР =================

    function tryClickButton() {
        if (hasClicked) return;

        const candidates = document.querySelectorAll('a[role="button"], button, a[href*="#"]');

        for (const element of candidates) {
            const text = (element.innerText || element.textContent).toLowerCase();

            const isTextMatch = skipKeywords.some(word => text.includes(word));
            const href = element.getAttribute('href');
            const role = element.getAttribute('role');
            const isStructureMatch = href && href.includes('#') && role === 'button';
            const isNotApp = !text.includes("app") && !text.includes("desktop") && !text.includes("exe");

            if ((isTextMatch || (isStructureMatch && isNotApp)) && element.offsetParent !== null) {
                console.log(`Auto-Skip: [${text}]`);
                hasClicked = true;
                showNotifications(); // Запускаем цепочку уведомлений
                element.click();
                return;
            }
        }
    }

    // ================= ЗАПУСК =================

    tryClickButton();

    const observer = new MutationObserver((mutations) => {
        if (!hasClicked) {
            tryClickButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();