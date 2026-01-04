// ==UserScript==
// @name         ОПС-Helper
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  Кнопка «ОПС»: копирует ID, отправляет комментарий, копирует ID+кабинет (без *), показывает уведомления, без перезагрузки страницы
// @author       Вы
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554324/%D0%9E%D0%9F%D0%A1-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554324/%D0%9E%D0%9F%D0%A1-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.href.includes('dispatcher.dostavista.ru/dispatcher/orders/view/')) return;

    // 🔧 Конфиг
    const CONFIG = {
        SELECTORS: {
            orderId: '#address_points_parent > div:nth-child(1) > div.info > div:nth-child(3) > span.order-id-copy-wrapper > span',
            cabinetName: '#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div:nth-child(2) > div.data > a',
            commentLink: 'a.ajax-dispatcher-note-add-dialog',
            commentForm: 'div[style*="position:absolute;bottom:60px;right:25px"]',
            commentInput: 'textarea[id="order_note_add_input"]',
            submitButton: '#js_order_note_add_form_submit_button'
        },
        COLORS: {
            blue: '#1976D2',
            lightBlue: '#E3F2FD',
            orange: '#FF9800',
            green: '#4CAF50',
            red: '#E74C3C'
        }
    };

    // 🪄 Создание кнопки
    const opsButton = document.createElement('button');
    opsButton.textContent = 'ОПС';
    Object.assign(opsButton.style, {
        position: 'fixed',
        zIndex: 99999,
        fontSize: 'clamp(12px, 2vw, 14px)',
        fontWeight: 'bold',
        borderRadius: '8px',
        border: `1px solid ${CONFIG.COLORS.blue}`,
        background: CONFIG.COLORS.lightBlue,
        color: CONFIG.COLORS.blue,
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'none'
    });
    document.body.appendChild(opsButton);

    // Ховер эффект
    opsButton.addEventListener('mouseenter', () => {
        opsButton.style.background = CONFIG.COLORS.blue;
        opsButton.style.color = '#fff';
    });
    opsButton.addEventListener('mouseleave', () => {
        opsButton.style.background = CONFIG.COLORS.lightBlue;
        opsButton.style.color = CONFIG.COLORS.blue;
    });

    // 🧭 Debounce
    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    // 💬 Toast уведомления
function showToast(message, color = CONFIG.COLORS.blue) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        background: color,
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 100000,
        opacity: '0',
        transition: 'opacity 0.4s ease'
    });

    // Проверяем, есть ли форма комментария
    const form = document.querySelector(CONFIG.SELECTORS.commentForm);

    if (form && opsButton.style.display === 'block') {
        // Позиционируем над кнопкой «ОПС»
        const btnRect = opsButton.getBoundingClientRect();
        toast.style.left = `${btnRect.left}px`;
        toast.style.top = `${btnRect.top - 45}px`; // немного выше кнопки
    } else {
        // Стандартное место — внизу справа
        toast.style.bottom = '20px';
        toast.style.right = '20px';
    }

    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = '1'), 10);
    setTimeout(() => toast.remove(), 2500);
}


    // ⏳ Утилита ожидания элемента
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Не найден элемент: ${selector}`));
            }, timeout);
        });
    }

    // 📋 Копирование текста (с fallback)
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
        }
    }

    // 🔢 Копирование ID
    async function copyOrderId() {
        const idElement = document.querySelector(CONFIG.SELECTORS.orderId);
        if (!idElement) throw new Error('ID заказа не найден');
        const orderId = idElement.textContent.trim();
        await copyToClipboard(orderId);
        console.log('[ОПС] ID заказа скопирован:', orderId);
        return orderId;
    }

    // 📎 Открыть форму комментария
    function openCommentForm() {
        const link = document.querySelector(CONFIG.SELECTORS.commentLink);
        if (!link) throw new Error('Ссылка на форму комментария не найдена');
        link.click();
        console.log('[ОПС] Форма комментария открыта');
    }

    // ✍️ Вставить ID и отправить комментарий
    async function pasteIdAndSubmit(orderId) {
        const inputField = await waitForElement(CONFIG.SELECTORS.commentInput);
        inputField.focus();
        inputField.value = orderId;
        const submitBtn = document.querySelector(CONFIG.SELECTORS.submitButton);
        if (!submitBtn) throw new Error('Кнопка отправки не найдена');
        submitBtn.click();
        console.log('[ОПС] Комментарий отправлен');
    }

    // 🧾 Копирование ID + кабинет без звёздочек
    async function copyIdAndCabinet(orderId) {
        const el = document.querySelector(CONFIG.SELECTORS.cabinetName);
        let cabinetName = el ? el.textContent.replace(/\*/g, '').trim() : 'Не найдено';
        const text = `${orderId} ${cabinetName}\n`;
        await copyToClipboard(text);
        console.log('[ОПС] В буфер скопировано:', text);
    }

    // 📍 Обновление видимости кнопки
    function updateButtonVisibilityAndPosition() {
        const form = document.querySelector(CONFIG.SELECTORS.commentForm);
        const link = document.querySelector(CONFIG.SELECTORS.commentLink);

        if (!form && !link) {
            opsButton.style.display = 'none';
            return;
        }

        if (form) {
            const rect = form.getBoundingClientRect();
            opsButton.style.bottom = `${window.innerHeight - rect.top + 10}px`;
            opsButton.style.right = '250px';
        } else {
            opsButton.style.bottom = '20px';
            opsButton.style.right = '200px';
        }

        opsButton.style.display = 'block';
    }

    // 🚀 Основная логика клика
    let isProcessing = false;
    opsButton.addEventListener('click', async () => {
        if (isProcessing) return;
        isProcessing = true;

        opsButton.style.background = CONFIG.COLORS.orange;
        opsButton.style.color = '#fff';
        opsButton.textContent = 'Выполняю...';

        try {
            const orderId = await copyOrderId();
            openCommentForm();
            await pasteIdAndSubmit(orderId);
            await copyIdAndCabinet(orderId);

            showToast('ОПС выполнено ✅', CONFIG.COLORS.green);
            opsButton.style.background = CONFIG.COLORS.green;
            opsButton.textContent = 'Готово!';
        } catch (err) {
            console.error('[ОПС] Ошибка:', err.message);
            showToast('Ошибка: ' + err.message, CONFIG.COLORS.red);
            opsButton.style.background = CONFIG.COLORS.red;
            opsButton.textContent = 'Ошибка!';
        } finally {
            setTimeout(() => {
                opsButton.style.background = CONFIG.COLORS.lightBlue;
                opsButton.style.color = CONFIG.COLORS.blue;
                opsButton.textContent = 'ОПС';
                isProcessing = false;
            }, 2500);
        }
    });

    // 🧭 Инициализация
    window.addEventListener('load', () => setTimeout(updateButtonVisibilityAndPosition, 500));

    const observer = new MutationObserver(debounce(updateButtonVisibilityAndPosition, 300));
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateButtonVisibilityAndPosition, 3000);
})();
