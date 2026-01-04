// ==UserScript==
// @name         DeepL Unlimited - UI Cleaner Only
// @name:en      DeepL Unlimited - UI Cleaner Only
// @name:ru      DeepL Unlimited — Очистка интерфейса
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Removes client-side limitations in DeepL without interfering with network requests.
// @description:ru Убирает визуальные ограничения в DeepL, не вмешиваясь в сетевые запросы (что предотвращает ошибки DAP/CORS).
// @author       Claude
// @match        https://www.deepl.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556995/DeepL%20Unlimited%20-%20UI%20Cleaner%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/556995/DeepL%20Unlimited%20-%20UI%20Cleaner%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[DeepL UI Cleaner] Запущен v4.0');

    // Список селекторов и текстов для удаления
    const BLOCKERS = {
        selectors: [
            '[role="dialog"]',
            '[role="alertdialog"]',
            '[class*="modal"]',
            '[class*="Modal"]',
            '[class*="overlay"]',
            '[class*="backdrop"]',
            '[data-testid="modal-overlay"]',
            'div[class*="paywall"]',
            'div[class*="limit"]',
            'div[class*="quota"]'
        ],
        keywords: [
            'Лимит', 'предусмотренный', 'исчерпан', 'DeepL Pro',
            'limit', 'quota', 'exceeded', 'upgrade', 'subscription',
            'бесплатная версия', 'free version', 'character limit'
        ]
    };

    // Функция очистки стилей блокировки
    function unlockScroll() {
        const styles = [
            'overflow', 
            'overflow-x', 
            'overflow-y', 
            'position', 
            'filter', 
            'blur',
            'pointer-events'
        ];
        
        [document.body, document.documentElement].forEach(el => {
            if (!el) return;
            styles.forEach(style => {
                if (el.style[style]) el.style[style] = '';
            });
            el.classList.remove('is-locked', 'modal-open');
        });

        document.querySelectorAll('*[style*="blur"]').forEach(el => {
            el.style.filter = 'none';
        });
        
        document.querySelectorAll('[inert]').forEach(el => {
            el.removeAttribute('inert');
            el.removeAttribute('aria-hidden');
        });
    }

    // Основная функция очистки
    function cleanUI() {
        let found = false;

        BLOCKERS.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const text = el.textContent || '';
                const isBlocker = BLOCKERS.keywords.some(kw => text.includes(kw));
                
                if (isBlocker && el.style.display !== 'none') {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.pointerEvents = 'none';
                    found = true;
                }
            });
        });

        if (found || document.body?.style.overflow === 'hidden') {
            unlockScroll();
        }
    }

    // CSS-инъекция для гарантированного скрытия
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            [class*="paywall"], [class*="quota-limit"], 
            [data-testid*="paywall"], [data-testid*="limit-modal"] {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            body, html {
                overflow: auto !important;
                position: static !important;
                filter: none !important;
            }
            *[inert] {
                pointer-events: auto !important;
                user-select: auto !important;
                filter: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    injectCSS();
    
    // Быстрый поллинг для реактивности
    setInterval(cleanUI, 500);
    
    // Наблюдение за DOM
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            cleanUI();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        cleanUI();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            cleanUI();
        });
    }

    // Мягкая очистка кук раз в минуту
    setInterval(() => {
        ['LMTBID', 'dapUid'].forEach(key => {
             document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.deepl.com`;
        });
    }, 60000);

})();
