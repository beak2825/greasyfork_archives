// ==UserScript==
// @name         Pepper.ru Hide Blacklisted Users (Discussions & Comments & Threads)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Скрывает карточки, комментарии и ветки комментариев пользователей из черного списка на pepper.ru
// @author       You
// @match        https://www.pepper.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560186/Pepperru%20Hide%20Blacklisted%20Users%20%28Discussions%20%20Comments%20%20Threads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560186/Pepperru%20Hide%20Blacklisted%20Users%20%28Discussions%20%20Comments%20%20Threads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'pepper_blacklist_semicolon_v3'; // Новый ключ для версии 3.0

    function loadBlacklist() {
        const stored = GM_getValue(STORAGE_KEY, '');
        return new Set(
            stored.split(';')
                  .map(name => name.trim())
                  .filter(name => name.length > 0)
        );
    }

    function saveBlacklist(blacklist) {
        const blacklistString = [...blacklist].join('; ');
        GM_setValue(STORAGE_KEY, blacklistString);
    }

    function editBlacklist() {
        const currentBlacklist = loadBlacklist();
        const blacklistString = [...currentBlacklist].join('; ');

        const newBlacklistString = prompt(
            'Введите имена пользователей для черного списка, разделяя их точкой с запятой (;):',
            blacklistString
        );

        if (newBlacklistString !== null) {
            const newBlacklistArray = newBlacklistString
                .split(';')
                .map(name => name.trim())
                .filter(name => name.length > 0);
            const newBlacklistSet = new Set(newBlacklistArray);
            saveBlacklist(newBlacklistSet);
            console.log('Черный список обновлен (v3.0):', newBlacklistSet);
            alert('Черный список обновлен. Перезагрузите страницу для применения изменений.');
        }
    }

    // --- Функция для скрытия карточек обсуждений ---
    function hideBlacklistedCards() {
        const blacklist = loadBlacklist();

        if (blacklist.size === 0) {
            console.log("Черный список пуст (карточки), скрытие не требуется.");
            return;
        }

        console.log("Поиск карточек для скрытия (по черному списку)...");

        const cardSelectors = [
            '.card.cursor-pointer.group.discussion-card',
            '.card.cursor-pointer.group.deal-card',
            '.card.cursor-pointer.group' // Общий fallback
        ];
        const allCards = document.querySelectorAll(cardSelectors.join(', '));

        allCards.forEach(cardElement => {
            let shouldHide = false;
            const usernameElements = cardElement.querySelectorAll('.text-primary-text-light, .text-secondary-text-light, .text-primary-text-dark, .text-secondary-text-dark');

            for (let elem of usernameElements) {
                if (blacklist.has(elem.textContent.trim())) {
                    shouldHide = true;
                    break;
                }
                for (let attr of elem.attributes) {
                    if (blacklist.has(attr.value.trim())) {
                        shouldHide = true;
                        break;
                    }
                }
                if (shouldHide) break;
            }

            if (shouldHide) {
                console.log(`Скрыта КАРТОЧКА для пользователя: ${[...blacklist].find(name => cardElement.textContent.includes(name))}`);
                cardElement.style.display = 'none';
            }
        });
    }

    // --- Обновлённая функция для скрытия комментариев и веток ---
    function hideBlacklistedCommentsAndThreads() {
        const blacklist = loadBlacklist();

        if (blacklist.size === 0) {
            console.log("Черный список пуст (комментарии), скрытие не требуется.");
            return;
        }

        console.log("Поиск комментариев и веток для скрытия (по черному списку)...");

        // Найдем все потенциальные ветки комментариев (div с id вида "post_..._new")
        const commentThreadSelectors = 'div[id^="post_"][id$="_new"]';
        const commentThreadElements = document.querySelectorAll(commentThreadSelectors);

        commentThreadElements.forEach(threadElement => {
            // Внутри каждой ветки ищем родительский комментарий (обычно это div с id вида "post_..._1", но часто
            // самый первый элемент с именем пользователя находится на верхнем уровне ветки или внутри первого div.
            // Найдем элемент, содержащий имя автора родительского комментария.
            // Обычно это div, содержащий onclick="openProfileTooltip(...)" и текст имени.
            // Попробуем найти *первый* такой элемент *внутри* ветки.
            const firstUserLinkElement = threadElement.querySelector('div[onclick*="openProfileTooltip"], a[onclick*="openProfileTooltip"]');

            if (firstUserLinkElement) {
                let usernameFound = false;
                const elementText = firstUserLinkElement.textContent.trim();

                // Проверяем текстовое содержимое
                if (blacklist.has(elementText)) {
                    usernameFound = true;
                }

                // Проверяем атрибут onclick
                const onclickAttr = firstUserLinkElement.getAttribute('onclick');
                if (onclickAttr) {
                    // Ищем имя в строке onclick
                    const match = onclickAttr.match(/openProfileTooltip\(\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]post['"]\s*\)/);
                    if (match && blacklist.has(match[2])) {
                        usernameFound = true;
                    }
                }

                if (usernameFound) {
                    // Если имя пользователя из черного списка найдено в *первом* элементе с именем,
                    // скрываем *всю* ветку комментариев (родительский элемент threadElement).
                    console.log(`Скрыта ВЕТКА комментариев для пользователя: ${elementText || (onclickAttr ? onclickAttr.match(/openProfileTooltip\(\s*\d+\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]post['"]\s*\)/)[2] : 'Unknown')}`);
                    threadElement.style.display = 'none'; // Скрываем всю ветку
                }
            }
        });
    }

    // --- Объединенная функция для вызова обеих ---
    function hideBlacklistedContent() {
        hideBlacklistedCards();
        hideBlacklistedCommentsAndThreads();
    }

    GM_registerMenuCommand("Редактировать черный список (через ;)", editBlacklist);

    hideBlacklistedContent(); // Выполняем при загрузке

    // Observer для динамически загружаемого контента
    const observer = new MutationObserver(function(mutationsList, observer) {
        let shouldCheck = false;
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Проверяем добавленные узлы на наличие карточек или комментариев/веток
                        if (node.classList.contains('card') && node.classList.contains('cursor-pointer') && node.classList.contains('group')) {
                            shouldCheck = true;
                        }
                        if (node.id && node.id.startsWith('post_') && node.id.endsWith('_new')) {
                            shouldCheck = true; // Новая ветка комментариев
                        }
                        if (node.querySelectorAll) {
                            const cards = node.querySelectorAll('.card.cursor-pointer.group');
                            const commentDivs = node.querySelectorAll('div[id^="post_"][id$="_new"]');
                            if (cards.length > 0 || commentDivs.length > 0) {
                                shouldCheck = true;
                            }
                        }
                    }
                });
            }
        }
        if (shouldCheck) {
             console.log("Обнаружены изменения в DOM, возможно новые карточки или ветки комментариев. Перезапуск скрытия...");
             hideBlacklistedContent();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();