// ==UserScript==
// @name         Счётчик токенов DeepSeek
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Считаем токены и длину диалога в chat.deepseek.com, заменяя дисклеймер на индикатор длины диалога
// @author       Нейросеть
// @license MIT
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555969/%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%BE%D0%B2%20DeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/555969/%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%BE%D0%B2%20DeepSeek.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const AUTO_UPDATE_STORAGE_KEY = 'dsIndicatorAutoUpdate';
    let autoUpdateEnabled = GM_getValue(AUTO_UPDATE_STORAGE_KEY, true); // true = таймер включён
    let autoUpdateTimer = null;
    let menuId = null;

    const TEXTAREA_SELECTOR = 'textarea[placeholder="Message DeepSeek"]';
    const USER_MESSAGE_SELECTOR = 'div[data-um-id]';
    const AI_MARKDOWN_SELECTOR = 'div.ds-markdown';
    const AI_THOUGHT_SELECTOR = '[class*="ds-think-content"]';

    const TOKEN_LIMIT = 64000;
    const NORMAL_PREFIX = '';
    const WARNING_PREFIX = '⚠️ ';
    const CRITICAL_PREFIX = '‼️ ';

    let disclaimerEl = null;
    let alertShown = false;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 50;

    function log(msg, level = 'info') {
        const prefix = '[DeepSeek Indicator]';
        const emoji = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️', debug: '🔍' };
        console.log(`${prefix} ${emoji[level] || ''} ${msg}`);
    }

    // Сбор текста из чата (пользователь + ответы ИИ без «мыслей»)
    function getConversationText() {
        let text = '';
        try {
            const userMessages = document.querySelectorAll(
                `${USER_MESSAGE_SELECTOR} > div.ds-message > div:first-child`
            );
            userMessages.forEach(div => {
                text += div.innerText + '\n';
            });

            const aiBlocks = document.querySelectorAll(AI_MARKDOWN_SELECTOR);
            aiBlocks.forEach(div => {
                if (!div.closest(AI_THOUGHT_SELECTOR)) {
                    text += div.innerText + '\n';
                }
            });
        } catch (e) {
            log(`Ошибка при сборе текста: ${e.message}`, 'error');
        }
        return text;
    }

    // Подсчёт токенов (EN/RU/ZH)
    function calculateTokens(text) {
        const latinChars    = (text.match(/[a-zA-Z0-9\s.,!?;:'"(){}\[\]]/g) || []).length;
        const cyrillicChars = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
        const chineseChars  = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const otherChars    = text.length - latinChars - cyrillicChars - chineseChars;

        return Math.ceil(
            latinChars    * 0.25 + // английский
            cyrillicChars * 0.55 + // русский
            chineseChars  * 0.65 + // китайский
            otherChars    * 0.4
        );
    }

    function buildLine(tokenCount, charCount) {
        const percent = Math.round((tokenCount / TOKEN_LIMIT) * 100);
        return `Токены: ~${tokenCount.toLocaleString()} (Символы: ${charCount.toLocaleString()}, ${percent}%)`;
    }

    // Нормализация текста: схлопывание пробелов, lowerCase
    function normalizeText(str) {
        return (str || '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // Поиск дисклеймера по ТОЧНОМУ тексту, с явным игнором #root
    function findDisclaimerByTextExact() {
        const target = 'ai-generated, for reference only';
        const divs = document.querySelectorAll('div');

        for (const el of divs) {
            if (el.id === 'root') continue; // игнорируем корневой контейнер
            const text = normalizeText(el.textContent);
            if (text === target) {
                return el;
            }
        }
        return null;
    }

    function updateIndicator() {
        if (!disclaimerEl) {
            log('Попытка обновления до инициализации дисклеймера', 'warn');
            return;
        }
        try {
            const text = getConversationText();
            const charCount = text.length;
            const tokenCount = calculateTokens(text);
            const ratio = tokenCount / TOKEN_LIMIT;

            let prefix = NORMAL_PREFIX;
            if (tokenCount > TOKEN_LIMIT) {
                prefix = CRITICAL_PREFIX;
                if (!alertShown) {
                    log(`Опасный лимит токенов: ${tokenCount}/${TOKEN_LIMIT}`, 'warn');
                    alertShown = true;
                }
            } else if (ratio > 0.9) {
                prefix = WARNING_PREFIX;
            } else {
                alertShown = false;
            }

            const line = buildLine(tokenCount, charCount);
            disclaimerEl.textContent = `${prefix}${line}`;
        } catch (e) {
            log(`Ошибка при обновлении индикатора: ${e.message}`, 'error');
        }
    }

    function startAutoUpdate() {
        if (autoUpdateTimer) {
            clearInterval(autoUpdateTimer);
            autoUpdateTimer = null;
        }

        if (!autoUpdateEnabled) {
            log('Автообновление выключено, таймер не запускаем', 'info');
            return;
        }

        log('Автообновление включено, запускаем таймер', 'info');
        updateIndicator(); // сразу пересчитать
        autoUpdateTimer = setInterval(updateIndicator, 10000); // затем раз в 10 секунд
    }

    function injectIndicator() {
        if (disclaimerEl) {
            log('Дисклеймер уже найден, повторное внедрение не нужно', 'info');
            return true;
        }

        const el = findDisclaimerByTextExact();
        if (!el) {
            log('Точный дисклеймер "AI-generated, for reference only" не найден — не вмешиваемся', 'error');
            return false;
        }

        disclaimerEl = el;
        log('Дисклеймер найден по точному тексту и подготовлен для замены', 'success');

        // Клик по строке с токенами → принудительное обновление
        disclaimerEl.style.cursor = 'pointer';
        disclaimerEl.title =
            'Нажмите, чтобы пересчитать токены.\nОткройте меню Tampermonkey для переключения автообновления.';
        disclaimerEl.addEventListener('click', () => {
            log('Ручное обновление по клику по индикатору', 'debug');
            updateIndicator();
        });

        // Глобальная функция проверки (для отладки)
        window.checkTokens = function () {
            const text = getConversationText();
            const charCount = text.length;

            const latinChars    = (text.match(/[a-zA-Z0-9\s.,!?;:'"(){}\[\]]/g) || []).length;
            const cyrillicChars = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
            const chineseChars  = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
            const otherChars    = charCount - latinChars - cyrillicChars - chineseChars;

            const tokens = calculateTokens(text);

            console.log('\n═══════════════════════════════════════════════════════════');
            console.log('📊 ПРОВЕРКА ПОДСЧЁТА ТОКЕНОВ');
            console.log('═══════════════════════════════════════════════════════════');
            console.log(`Всего символов: ${charCount.toLocaleString()}`);
            console.log(`Примерно токенов: ${tokens.toLocaleString()}`);
            console.log(`Процент от лимита: ${Math.round((tokens / TOKEN_LIMIT) * 100)}%`);
            console.log('───────────────────────────────────────────────────────────');
            console.log('📝 Статистика по типам символов:');
            console.log(`  Латиница:  ${latinChars.toLocaleString()} симв.`);
            console.log(`  Кириллица: ${cyrillicChars.toLocaleString()} симв.`);
            console.log(`  Китайский: ${chineseChars.toLocaleString()} симв.`);
            console.log(`  Прочие:    ${otherChars.toLocaleString()} симв.`);
            console.log('═══════════════════════════════════════════════════════════\n');

            return {
                characters: charCount,
                tokens,
                breakdown: {
                    latin: latinChars,
                    cyrillic: cyrillicChars,
                    chinese: chineseChars,
                    other: otherChars
                }
            };
        };

        // Старт автообновления с учётом текущей настройки
        setTimeout(() => {
            startAutoUpdate();
        }, 1000);

        return true;
    }

    function tryInit() {
        initAttempts++;
        log(`Попытка инициализации #${initAttempts}`, 'debug');

        const textarea = document.querySelector(TEXTAREA_SELECTOR);
        const hasRoot = !!document.getElementById('root');

        if (textarea && hasRoot) {
            log('Страница загружена, пытаемся внедрить индикатор...', 'success');
            const ok = injectIndicator();
            if (ok) return true;
        }

        if (initAttempts < MAX_ATTEMPTS) {
            setTimeout(tryInit, 500);
        } else {
            log('Достигнут лимит попыток инициализации, прекращаем попытки', 'error');
        }
        return false;
    }

    // Справка
    function showHelp() {
        alert(
            [
                'Счётчик токенов DeepSeek — счётчик токенов для chat.deepseek.com.',
                '',
                'Что делает скрипт:',
                '• Ищет служебную надпись "AI-generated, for reference only" под чатом и заменяет её на строку с количеством токенов.',
                '• Считает приблизительное количество токенов в текущем чате (учитывая английский, русский и китайский текст).',
                '• Не трогает структуру страницы и не вмешивается в сетевые запросы.',
                '• Считает лимитом 64 тысячи токенов.',
                '',
                'Режимы обновления:',
                '• Автообновление: раз в 10 секунд пересчитывает токены (можно включать/выключать через меню расширения).',
                '• Ручное обновление: клик по строке индикатора сразу пересчитывает токены.',
                '',
                'Консольные команды (F12 → Console):',
                '• checkTokens() — вывести подробный отчёт:',
                '  - общее количество символов;',
                '  - примерное число токенов;',
                '  - разбиение по латинице/кириллице/китайскому;',
                '  - процент от лимита контекста.',
                ''
            ].join('\n')
        );
    }

    // Пункт меню Tampermonkey для включения/выключения автообновления + справка
    function registerMenu() {
        // Сносим старый пункт, если он уже был
        if (menuId !== null && typeof GM_unregisterMenuCommand === 'function') {
            try {
                GM_unregisterMenuCommand(menuId);
            } catch (e) {
                // старый Tampermonkey может не поддерживать GM_unregisterMenuCommand — игнорируем
            }
        }

        const title = autoUpdateEnabled
            ? '✅ Автообновление индикатора'
            : '❌ Автообновление индикатора';

        menuId = GM_registerMenuCommand(title, () => {
            autoUpdateEnabled = !autoUpdateEnabled;
            GM_setValue(AUTO_UPDATE_STORAGE_KEY, autoUpdateEnabled);
            log(`Автообновление: ${autoUpdateEnabled ? 'ВКЛ' : 'ВЫКЛ'}`, 'info');
            startAutoUpdate();
            registerMenu(); // обновляем название пункта
        });

        // Второй пункт меню — справка
        GM_registerMenuCommand('❓ Справка', showHelp);
    }

    registerMenu();
    log('Старт v12 (safe text replace, ignore #root)', 'info');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log('DOM загружен, запуск инициализации', 'info');
            setTimeout(tryInit, 1000);
        });
    } else {
        log('DOM уже загружен, запуск инициализации', 'info');
        setTimeout(tryInit, 1000);
    }
})();
