// ==UserScript==
// @name         Настройка тем
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматическое применение сохраненных настроек при создании темы
// @author       Forest
// @match        https://lolz.live/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561610/%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561610/%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        replyGroup: '2',
        noNotifySubscribers: false,
        hideContacts: false,
        allowPersonalRequest: true,
        subscribeToThread: false,
        emailNotifications: false,
        allowCommentIgnoreGroup: false
    };

    function loadSettings() {
        const saved = GM_getValue('themeSettings', null);
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    function saveSettings(settings) {
        GM_setValue('themeSettings', JSON.stringify(settings));
    }

    function applySettings() {
        const settings = loadSettings();

        const form = document.querySelector('form[action*="threads/create"]') ||
                     document.querySelector('form[action*="threads/add"]') ||
                     document.querySelector('form.AutoValidator');

        if (!form) {
            console.log('Lolz Theme Settings: Форма не найдена');
            return;
        }

        const replyGroupRadio = document.querySelector(`input[name="reply_group"][value="${settings.replyGroup}"]`);
        if (replyGroupRadio) {
            replyGroupRadio.checked = true;
            console.log('Lolz Theme Settings: Применена группа ответов -', settings.replyGroup);
        }

        const noNotifyCheckbox = document.querySelector('input[name="dont_alert_followers"]');
        if (noNotifyCheckbox) {
            noNotifyCheckbox.checked = settings.noNotifySubscribers;
            console.log('Lolz Theme Settings: Не оповещать подписчиков -', settings.noNotifySubscribers);
        }

        const hideContactsCheckbox = document.querySelector('input[name="hide_contacts"]');
        if (hideContactsCheckbox) {
            hideContactsCheckbox.checked = settings.hideContacts;
            console.log('Lolz Theme Settings: Скрывать контакты -', settings.hideContacts);
        }

        const allowPersonalCheckbox = document.querySelector('input[name="allow_ask_hidden_content"]');
        if (allowPersonalCheckbox) {
            allowPersonalCheckbox.checked = settings.allowPersonalRequest;
            console.log('Lolz Theme Settings: Разрешить просить личный -', settings.allowPersonalRequest);
        }

        const subscribeCheckbox = document.querySelector('input[name="watch_thread"]');
        if (subscribeCheckbox) {
            subscribeCheckbox.checked = settings.subscribeToThread;
            console.log('Lolz Theme Settings: Подписаться на тему -', settings.subscribeToThread);
        }

        const emailCheckbox = document.querySelector('input[name="watch_thread_email"]');
        if (emailCheckbox) {
            emailCheckbox.checked = settings.emailNotifications;
            console.log('Lolz Theme Settings: Уведомления на почту -', settings.emailNotifications);
        }

        const commentIgnoreCheckbox = document.querySelector('input[name="comment_ignore_group"]');
        if (commentIgnoreCheckbox) {
            commentIgnoreCheckbox.checked = settings.allowCommentIgnoreGroup;
            console.log('Lolz Theme Settings: Разрешить комментировать -', settings.allowCommentIgnoreGroup);
        }

        console.log('Lolz Theme Settings: Настройки применены', settings);
    }

    function createSettingsModal() {
        const settings = loadSettings();

        const modal = document.createElement('div');
        modal.id = 'lolz-settings-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: #2d2d2d;
                border-radius: 8px;
                padding: 25px;
                max-width: 500px;
                width: 90%;
                color: #e0e0e0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            ">
                <h2 style="margin-top: 0; color: #fff; border-bottom: 2px solid #4a4a4a; padding-bottom: 10px;">
                    ⚙️ Настройки тем
                </h2>

                <div style="margin: 20px 0;">
                    <h3 style="color: #9d9d9d; font-size: 14px; margin-bottom: 15px;">Кто может отвечать:</h3>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="0" ${settings.replyGroup === '0' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Только Команда Форума и Кураторы</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="2" ${settings.replyGroup === '2' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Все</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="21" ${settings.replyGroup === '21' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Местный и выше</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="22" ${settings.replyGroup === '22' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Постоялец и выше</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="23" ${settings.replyGroup === '23' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Эксперт и выше</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="60" ${settings.replyGroup === '60' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Гуру и выше</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="modal_reply_group" value="351" ${settings.replyGroup === '351' ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Искусственный интеллект и выше</span>
                    </label>
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="color: #9d9d9d; font-size: 14px; margin-bottom: 15px;">Настройки:</h3>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_no_notify" ${settings.noNotifySubscribers ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Не оповещать подписчиков о создании темы</span>
                    </label>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_hide_contacts" ${settings.hideContacts ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Скрывать контакты в теме</span>
                    </label>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_allow_personal" ${settings.allowPersonalRequest ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Разрешить просить "Личный" (если есть "хайд" в теме)</span>
                    </label>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_subscribe" ${settings.subscribeToThread ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Подписаться на тему...</span>
                    </label>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_email" ${settings.emailNotifications ? 'checked' : ''}>
                        <span style="margin-left: 8px;">и получать уведомления на электронную почту</span>
                    </label>

                    <label style="display: block; margin: 12px 0; cursor: pointer;">
                        <input type="checkbox" id="modal_comment_ignore" ${settings.allowCommentIgnoreGroup ? 'checked' : ''}>
                        <span style="margin-left: 8px;">Разрешить комментировать сообщения, если нет прав писать сообщения</span>
                    </label>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 25px;">
                    <button id="save-settings-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">💾 Сохранить</button>

                    <button id="reset-settings-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #ff9800;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">🔄 Сбросить</button>

                    <button id="close-settings-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #666;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                    ">✖️ Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const newSettings = {
                replyGroup: document.querySelector('input[name="modal_reply_group"]:checked').value,
                noNotifySubscribers: document.getElementById('modal_no_notify').checked,
                hideContacts: document.getElementById('modal_hide_contacts').checked,
                allowPersonalRequest: document.getElementById('modal_allow_personal').checked,
                subscribeToThread: document.getElementById('modal_subscribe').checked,
                emailNotifications: document.getElementById('modal_email').checked,
                allowCommentIgnoreGroup: document.getElementById('modal_comment_ignore').checked
            };

            saveSettings(newSettings);
            alert('✅ Настройки сохранены! Они будут автоматически применяться при создании новых тем.');
            modal.remove();
        });

        document.getElementById('reset-settings-btn').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
                saveSettings(defaultSettings);
                alert('🔄 Настройки сброшены к значениям по умолчанию!');
                modal.remove();
            }
        });

        document.getElementById('close-settings-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    GM_registerMenuCommand('⚙️ Настройки тем', createSettingsModal);

    function init() {
        setTimeout(applySettings, 500);
        setTimeout(applySettings, 1500);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const form = document.querySelector('form[action*="threads/create"]') ||
                            document.querySelector('form[action*="threads/add"]') ||
                            document.querySelector('form.AutoValidator');
                if (form) {
                    setTimeout(() => applySettings(), 100);
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    init();

    setTimeout(applySettings, 2000);
    setTimeout(applySettings, 3000);

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            const href = target.getAttribute('href') || '';
            const text = target.textContent || '';

            if (href.includes('threads/create') || text.includes('Создать тему') || text.includes('создать')) {
                setTimeout(applySettings, 500);
                setTimeout(applySettings, 1000);
                setTimeout(applySettings, 1500);
            }
        }
    });

    console.log('Lolz Theme Settings Manager загружен!');
})();