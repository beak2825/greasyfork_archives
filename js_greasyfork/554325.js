// ==UserScript==
// @name         АКТ_helper
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Кнопка «АКТ»: копирует ссылку и название ЛК, отправляет комментарий. Показывается только если есть форма комментария или ссылка Add dispatcher note. Показывает уведомления над кнопкой, если форма открыта.
// @author       Кто я
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @grant        none
// @license      MIT
//
// @downloadURL https://update.greasyfork.org/scripts/554325/%D0%90%D0%9A%D0%A2_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554325/%D0%90%D0%9A%D0%A2_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.href.includes('dispatcher.dostavista.ru/dispatcher/orders/view/')) return;

    // Селекторы
    const COMMENT_FORM_SELECTOR = 'div[style*="position:absolute;bottom:60px;right:25px"] form';
    const ADD_NOTE_LINK_SELECTOR = 'a.ajax-dispatcher-note-add-dialog';
    const LK_NAME_SELECTOR = '#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div:nth-child(2) > div > a';

    // === Создаём кнопку «АКТ» ===
    const actButton = document.createElement('div');
    actButton.setAttribute('style', `
        position: fixed;
        z-index: 99999;
        transition: all 0.3s ease;
        padding: 0;
        display: none;
    `);
    actButton.innerHTML = `
        <style>
            .act-btn {
                font-size: clamp(12px, 2vw, 14px);
                font-weight: bold;
                border-radius: 8px;
                border: 1px solid #D2B48C;
                background: #F5DEB3;
                color: #8B4513;
                padding: 6px 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: block;
                white-space: nowrap;
            }
            .act-btn:hover {
                background: #D2B48C;
                color: #FFF;
                border-color: #D2B48C;
            }
        </style>
        <button class="act-btn">АКТ</button>
    `;
    document.body.appendChild(actButton);

    // === Функция позиционирования кнопки ===
    function positionActButton() {
        const form = document.querySelector(COMMENT_FORM_SELECTOR);
        const link = document.querySelector(ADD_NOTE_LINK_SELECTOR);

        if (form || link) {
            if (form) {
                const rect = form.getBoundingClientRect();
                actButton.style.right = '100px';
                actButton.style.top = `${rect.top - 60}px`;
                actButton.style.bottom = 'auto';
            } else {
                actButton.style.bottom = '20px';
                actButton.style.right = '20px';
                actButton.style.top = 'auto';
            }
            actButton.style.display = 'block';
        } else {
            actButton.style.display = 'none';
        }
    }

    window.addEventListener('load', positionActButton);
    window.addEventListener('resize', positionActButton);
    const observer = new MutationObserver(positionActButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // === Toast уведомления ===
    function showToast(message, color = '#8B4513', aboveButton = false) {
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
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            transform: 'translateY(10px)',
            right: aboveButton ? actButton.style.right || '20px' : '20px',
            bottom: aboveButton
                ? `calc(${actButton.style.bottom || '20px'} + 50px)`
                : '20px',
        });

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    // === Копирование данных ===
    async function copyDataToClipboard() {
        const lkElement = document.querySelector(LK_NAME_SELECTOR);
        let lkName = lkElement ? lkElement.textContent.trim() : '';
        lkName = lkName.replace(/\*/g, '').trim(); // Удаляем *

        const clipboardText = `${window.location.href}\n${lkName}`;

        await navigator.clipboard.writeText(clipboardText);
        console.log('[АКТ] Скопировано в буфер:', clipboardText);
    }

    // === Отправка комментария ===
    async function sendComment() {
        const orderIdMatch = /\d+/.exec(window.location.href);
        const orderId = orderIdMatch ? orderIdMatch[0] : null;
        if (!orderId) throw new Error('Не удалось извлечь ID заказа из URL');

        const formData = new FormData();
        formData.append('order_note', 'акт');
        formData.append('ctoken', JS.CTOKEN);

        const response = await fetch(`/dispatcher/orders/order-note-add/${orderId}`, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        });

        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        console.log('[АКТ] Комментарий "акт" успешно отправлен');
    }

    // === Обработчик кнопки ===
    const btn = actButton.querySelector('.act-btn');
    btn.addEventListener('click', async () => {
        const formExists = !!document.querySelector(COMMENT_FORM_SELECTOR);

        btn.style.background = '#ff9800';
        btn.style.color = '#fff';
        btn.textContent = 'Выполняю...';

        try {
            await copyDataToClipboard();
            showToast('✅ Скопировано в буфер', '#8B4513', formExists);
            await sendComment();
            showToast('💬 Комментарий отправлен', '#4CAF50', formExists);

            btn.style.background = '#4CAF50';
            btn.style.color = '#fff';
            btn.textContent = 'Готово!';

            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error('[АКТ] Ошибка:', error);
            btn.style.background = '#e74c3c';
            btn.style.color = '#fff';
            btn.textContent = 'Ошибка!';
            showToast('❌ Ошибка: ' + error.message, '#e74c3c', formExists);

            setTimeout(() => {
                btn.style.background = '#F5DEB3';
                btn.style.color = '#8B4513';
                btn.textContent = 'АКТ';
            }, 3000);
        }
    });
})();
