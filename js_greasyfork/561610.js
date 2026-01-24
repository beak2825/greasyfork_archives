// ==UserScript==
// @name         Настройка тем
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        allowCommentIgnoreGroup: false,
        autoCloseThread: false
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

        if (!form) return;

        const replyGroupRadio = document.querySelector(`input[name="reply_group"][value="${settings.replyGroup}"]`);
        if (replyGroupRadio && !replyGroupRadio.checked) {
            replyGroupRadio.checked = true;
        }

        const checkboxes = [
            { name: 'dont_alert_followers', value: settings.noNotifySubscribers },
            { name: 'hide_contacts', value: settings.hideContacts },
            { name: 'allow_ask_hidden_content', value: settings.allowPersonalRequest },
            { name: 'watch_thread', value: settings.subscribeToThread },
            { name: 'watch_thread_email', value: settings.emailNotifications },
            { name: 'comment_ignore_group', value: settings.allowCommentIgnoreGroup }
        ];

        checkboxes.forEach(item => {
            const checkbox = document.querySelector(`input[name="${item.name}"]`);
            if (checkbox && checkbox.checked !== item.value) {
                checkbox.checked = item.value;
            }
        });
    }

    function autoCloseThread() {
        const settings = loadSettings();
        if (!settings.autoCloseThread) return;

        const isThreadPage = window.location.pathname.includes('/threads/') &&
                           !window.location.pathname.includes('/create-thread');
        if (!isThreadPage) return;

        const lockIcon = document.querySelector('h1 .fa-lock');
        if (lockIcon) {
            console.log('[AutoClose] Тема уже закрыта');
            return;
        }

        const discussionOpenCheckbox = document.querySelector('form[action*="quick-update"] input[name="discussion_open"][value="1"]');
        if (!discussionOpenCheckbox) {
            console.log('[AutoClose] Чекбокс не найден');
            return;
        }

        if (!discussionOpenCheckbox.checked) {
            console.log('[AutoClose] Тема уже закрыта');
            return;
        }

        console.log('[AutoClose] Закрываю тему...');
        discussionOpenCheckbox.click();
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
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 550px; width: 90%; color: #e0e0e0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.6); border: 1px solid #333;">
                <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #333;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Настройки создания тем</h2>
                </div>

                <div style="margin-bottom: 18px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #999; font-weight: 500;">Кто может отвечать</h3>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="0" ${settings.replyGroup === '0' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Только Команда и Кураторы</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="2" ${settings.replyGroup === '2' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Все</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="21" ${settings.replyGroup === '21' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Местный и выше</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="22" ${settings.replyGroup === '22' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Постоялец и выше</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="23" ${settings.replyGroup === '23' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Эксперт и выше</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="60" ${settings.replyGroup === '60' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Гуру и выше</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="radio" name="modal_reply_group" value="351" ${settings.replyGroup === '351' ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">ИИ и выше</span>
                        </label>
                    </div>
                </div>

                <div style="margin-bottom: 18px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #999; font-weight: 500;">Параметры темы</h3>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label style="display: flex; align-items: center; padding: 8px 10px; background: #2a1a1a; border: 1px solid #d32f2f; border-radius: 4px; cursor: pointer;">
                            <input type="checkbox" id="modal_auto_close" ${settings.autoCloseThread ? 'checked' : ''} style="margin-right: 8px; width: 16px; height: 16px;">
                            <span style="font-size: 13px; font-weight: bold; color: #ff8a80;">Закрывать тему после создания</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_no_notify" ${settings.noNotifySubscribers ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Не оповещать подписчиков</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_hide_contacts" ${settings.hideContacts ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Скрывать контакты</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_allow_personal" ${settings.allowPersonalRequest ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Разрешить просить личный</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_subscribe" ${settings.subscribeToThread ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Подписаться на тему</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_email" ${settings.emailNotifications ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Уведомления на почту</span>
                        </label>
                        <label style="display: flex; align-items: center; padding: 6px 10px; background: #252525; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            <input type="checkbox" id="modal_comment_ignore" ${settings.allowCommentIgnoreGroup ? 'checked' : ''} style="margin-right: 8px;">
                            <span style="font-size: 13px;">Разрешить комментировать</span>
                        </label>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end; padding-top: 12px; border-top: 1px solid #333;">
                    <button id="save-settings-btn" style="padding: 8px 16px; background: #4a9eff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Сохранить</button>
                    <button id="reset-settings-btn" style="padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Сбросить</button>
                    <button id="close-settings-btn" style="padding: 8px 16px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('label').forEach(label => {
            label.addEventListener('mouseenter', () => {
                if (!label.style.border) {
                    label.style.background = '#2a2a2a';
                }
            });
            label.addEventListener('mouseleave', () => {
                if (!label.style.border) {
                    label.style.background = '#252525';
                }
            });
        });

        modal.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '0.9';
            });
            button.addEventListener('mouseleave', () => {
                button.style.opacity = '1';
            });
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const newSettings = {
                replyGroup: document.querySelector('input[name="modal_reply_group"]:checked').value,
                autoCloseThread: document.getElementById('modal_auto_close').checked,
                noNotifySubscribers: document.getElementById('modal_no_notify').checked,
                hideContacts: document.getElementById('modal_hide_contacts').checked,
                allowPersonalRequest: document.getElementById('modal_allow_personal').checked,
                subscribeToThread: document.getElementById('modal_subscribe').checked,
                emailNotifications: document.getElementById('modal_email').checked,
                allowCommentIgnoreGroup: document.getElementById('modal_comment_ignore').checked
            };

            saveSettings(newSettings);
            alert('Настройки сохранены');
            modal.remove();
        });

        document.getElementById('reset-settings-btn').addEventListener('click', () => {
            if (confirm('Сбросить настройки?')) {
                saveSettings(defaultSettings);
                alert('Настройки сброшены');
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

    GM_registerMenuCommand('Настройки тем', createSettingsModal);

    function init() {
        setTimeout(applySettings, 500);
        setTimeout(applySettings, 1500);
        setTimeout(autoCloseThread, 2000);
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
    setTimeout(autoCloseThread, 3500);

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

    console.log('Theme Settings Manager загружен');
})();