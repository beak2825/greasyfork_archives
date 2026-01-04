// ==UserScript==
// @name         Машинный русификатор сайта DeepSeek.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Переводит на русский интерфейс сайта DeepSeek.
// @author       MrVovchick
// @match        https://chat.deepseek.com/*
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548174/%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%80%D1%83%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20DeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/548174/%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%80%D1%83%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20DeepSeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        'How can I help you today?': 'Чем я могу помочь вам сегодня?',
        'Hi, I\'m DeepSeek.': 'Привет, я DeepSeek.',
        'Message DeepSeek': 'Написать DeepSeek',
        'Search': 'Поиск',
        'AI-generated, for reference only': 'Сгенерировано ИИ (только для справки)',
        'Message is empty': 'Сообщение пустое',
        'Text extraction only.': 'Только извлечение текста.',
        'Upload docs or images (Max 50, 100MB each)': 'Загрузите документы или изображения (макс. 50, по 100 МБ каждый)',
        'Search the web when necessary': 'Ищет в интернете при необходимости',
        'Think before responding to solve reasoning problems': 'Думает перед ответом, чтобы решать задачи на рассуждение',
        'No chat history': 'История чатов отсутствует',
        'New chat': 'Новый чат',
        'Open sidebar': 'Открыть боковую панель',
        'Close sidebar': 'Закрыть боковую панель',
        'Scan to get DeepSeek App': 'Приложение DeepSeek',
        'My Profile': 'Мой профиль',
        'Get App': 'Приложение',
        'Settings': 'Настройки',
        'Contact us': 'Связаться с нами',
        'Log out': 'Выйти',
        'Language': 'Язык',
        'System': 'Система',
        'Theme': 'Тема',
        'General': 'Общие',
        'Light': 'Светлая',
        'Dark': 'Тёмная',
        'Name': 'Имя',
        'Email address': 'Адрес электронной почты',
        'Phone number': 'Номер телефона',
        'Profile': 'Профиль',
        'About': 'О программе',
        'Improve the model for everyone': 'Улучшить модель для всех',
        'Allow your content to be used to train our models and improve our services. We secure your data privacy.': 'Разрешить использовать ваш контент для обучения наших моделей и улучшения сервисов. Мы обеспечиваем конфиденциальность ваших данных.',
        'Export data': 'Экспорт данных',
        'This data includes your account information and all chat history. Exporting may take some time. The download link will be valid for 7 days.': 'Эти данные включают информацию об аккаунте и всю историю чатов. Экспорт может занять некоторое время. Ссылка на скачивание будет действительна 7 дней.',
        'Export': 'Экспорт',
        'Log out of all devices': 'Выйти со всех устройств',
        'Delete all chats': 'Удалить все чаты',
        'Delete all': 'Удалить всё',
        'Delete account': 'Удалить аккаунт',
        'Terms of Use': 'Условия использования',
        'View': 'Просмотреть',
        'Delete': 'Удалить',
        'English': 'Русский',
        'Exported on': 'Экспортировано на',
        ', expires on': ', истекает',
        'Re-exporting': 'Повторный экспорт',
        'will update the download link.': 'обновит ссылку на скачивание.',
        'Download': 'Скачать',
        'Privacy Policy': 'Политика конфиденциальности',
        'Delete account?': 'Удалить аккаунт?',
        'Deletion will prevent you from accessing DeepSeek services, including DeepSeek Chat and Platform.': 'Удаление лишит вас доступа к сервисам DeepSeek, включая DeepSeek Chat и Platform.',
        'If there is any unused balance in your account, deletion will be considered as forfeiting the balance. Frequent account deletions may be flagged as suspicious activity, resulting in restrictions or bans.': 'Если на вашем аккаунте есть неиспользованный баланс, удаление будет считаться отказом от этого баланса. Частые удаления аккаунта могут быть отмечены как подозрительная активность, что может привести к ограничениям или блокировкам.',
        'If you have any questions, please contact us by email at': 'Если у вас есть вопросы, свяжитесь с нами по электронной почте по адресу ',
        'To verify, please type': 'Для подтверждения введите',
        'below:': 'ниже:',
        'Cancel': 'Отмена',
        'Confirm delete my account': 'Подтвердить удаление',
        'Delete all chats?': 'Удалить все чаты?',
        'If you confirm deletion, all chat history for this account will be permanently erased and cannot be recovered.': 'Если вы подтвердите удаление, вся история чатов для этого аккаунта будет безвозвратно удалена и не подлежит восстановлению.',
        'Confirm deletion': 'Подтвердить удаление',
        'Copy': 'Копировать',
        'Edit': 'Редактировать',
        'Dislike': 'Не нравится',
        'Like': 'Нравится',
        'Regenerate': 'Перегенерировать',
        'Drop files here to add to chat (Text extraction only)': 'Перетащите файлы сюда, чтобы добавить в чат (только извлечение текста)',
        'Max 50 files per chat at 100MB each. Text extraction only.': 'Максимум 50 файлов в чате, по 100 МБ каждый. Только извлечение текста.',
        'Rename': 'Переименовать',
        'Delete chat?': 'Удалить чат?',
        'Are you sure you want to delete this chat?': 'Вы уверены, что хотите удалить этот чат?',
        'How can I help you?': 'Чем я могу вам помочь?',
        'Download mobile App': 'Скачать приложение',
        'Data': 'Данные',
        'Feedback': 'Обратная связь',
        'Harmful / Unsafe': 'Вредоносное / небезопасное',
        'Fake': 'Фейк',
        'Unhelpful': 'Бесполезное',
        'Others': 'Другое',
        'Submit': 'Отправить',
        'We appreciate your feedback. Please share any comments or suggestions that you have to help us improve.': 'Мы ценим вашу обратную связь. Пожалуйста, поделитесь любыми комментариями или предложениями, которые помогут нам стать лучше.',
        'Log out of all devices?': 'Выйти со всех устройств?',
        'Clicking "Confirm Logout" will sign you out of all devices and browsers, including this device.': 'Нажатие «Подтвердить выход» выполнит выход на всех устройствах и во всех браузерах, включая это устройство.',
        'Confirm Logout': 'Подтвердить выход',
        'Only login via email, Google, or +86 phone number login is supported in your region.': 'В вашем регионе поддерживается вход только через электронную почту, Google или номер телефона с кодом +86.',
        'Phone number / email address': 'Номер телефона / адрес электронной почты',
        'Password': 'Пароль',
        'By signing up or logging in, you consent to DeepSeek\'s': 'Регистрируясь или входя в систему, вы соглашаетесь с политиками DeepSeek',
        'and': 'и',
        'Log in': 'Войти',
        'Forgot password?': 'Забыли пароль?',
        'Sign up': 'Зарегистрироваться',
        'OR': 'ИЛИ',
        'Log in with Google': 'Войти через Google',
        'Reset password': 'Сбросить пароль',
        'Enter your phone number or email address and we will send you a verification code to reset your password.': 'Введите номер телефона или адрес электронной почты, и мы отправим код подтверждения для сброса пароля.',
        'Code': 'Код',
        'Send code': 'Отправить код',
        'Continue': 'Продолжить',
        'Back to log in': 'Назад ко входу',
        'Confirm password': 'Подтвердить пароль',
        'Only email registration is supported in your region.': 'В вашем регионе поддерживается только регистрация по электронной почте.',
        'One DeepSeek account is all you need to access to all DeepSeek services.': 'Одного аккаунта DeepSeek достаточно для доступа ко всем сервисам DeepSeek.',
        'Email address / +86 phone number': 'Адрес электронной почты / номер телефона с кодом +86',
        'By signing up, you consent to DeepSeek\'s': 'Регистрируясь, вы соглашаетесь с политиками DeepSeek',
        'Monday': 'Понедельник',
        'Tuesday': 'Вторник',
        'Wednesday': 'Среда',
        'Thursday': 'Четверг',
        'Friday': 'Пятница',
        'Saturday': 'Суббота',
        'Sunday': 'Воскресенье',
        'New password': 'Новый пароль',
        'Today': 'Сегодня',
        'Yesterday': 'Вчера',
        'Extract only text from images and files.': 'Извлечение только текста из изображений и файлов.',
        'Uploading...': 'Загрузка...',
        'Pending...': 'Ожидание...',
        'Parsing...': 'Анализ...',
        'Shared links': 'Общие ссылки',
        'Manage': 'Управление',
        'No shared links': 'Нет общих ссылок',
        'Share': 'Поделиться',
        'Create public link': 'Создать публичную ссылку',
        'Select all': 'Выбрать все',
        'Uploading files is unavailable for searching': 'Загрузка файлов недоступна для поиска',
        'Please remove the file before searching': 'Пожалуйста, удалите файл перед поиском',












        'Shader': 'Шейдер'  // Добавлено по примеру
    };

    // Сортируем ключи по убыванию длины, чтобы длинные фразы обрабатывались раньше коротких
    const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

    function translateText(node) {
        // Обработка текстовых узлов
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.textContent;
            const trimmed = original.trim();
            if (trimmed === '') return; // Пропустить пустые

            for (const [en, ru] of sortedTranslations) {
                if (trimmed === en) {
                    node.textContent = original.replace(trimmed, ru);
                    break;
                }
            }
        }
        // Обработка элементов
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Обработка атрибутов title и placeholder
            ['title', 'placeholder'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const original = node.getAttribute(attr);
                    const trimmed = original.trim();
                    if (trimmed === '') return;

                    for (const [en, ru] of sortedTranslations) {
                        if (trimmed === en) {
                            node.setAttribute(attr, original.replace(trimmed, ru));
                            break;
                        }
                    }
                }
            });

            // Рекурсивная обработка дочерних элементов
            node.childNodes.forEach(translateText);
        }
    }

    function translateDocument() {
        if (document.body) {
            translateText(document.body);
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        translateText(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                translateText(mutation.target);
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true
    });

    if (document.readyState !== 'loading') {
        translateDocument();
    } else {
        document.addEventListener('DOMContentLoaded', translateDocument);
    }

})();