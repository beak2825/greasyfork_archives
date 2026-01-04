// ==UserScript==
// @name         MBSSNameMentionCounter
// @version      1.7
// @description  Счетчик сообщений без упоминания имени
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @author       a.golovin
// @run-at       document-idle
// @namespace    Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/552898/MBSSNameMentionCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/552898/MBSSNameMentionCounter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const CHAT_SEL = '.vac-room-item';
    const ROOM_HEADER_SEL = '.vac-room-header';
    const MY_MSG_CLS = 'vac-message-current';
    const MSG_CARD_SEL = '.vac-message-card';
    const STORAGE_PREFIX = 'NameMentionCounter:';
    
    let debugMode = true;
    
    function log(...args) {
        if (debugMode) {
            console.log('MBSSNameMentionCounter:', ...args);
        }
    }
    
    // Счетчики для каждого чата
    const mentionCounters = new WeakMap();
    
    // Получаем ключ для хранения в localStorage
    function getStorageKey(room) {
        const roomId = room.id || room.getAttribute('data-room-id');
        const roomName = room.querySelector('.vac-room-name')?.textContent.trim();
        return STORAGE_PREFIX + (roomId || roomName || 'default');
    }
    
    // Сохраняем счетчик в localStorage
    function saveCounter(room, count) {
        try {
            const key = getStorageKey(room);
            localStorage.setItem(key, count.toString());
            log(`Счетчик сохранен: ${count} для ключа ${key}`);
        } catch (e) {
            log('Ошибка при сохранении счетчика:', e);
        }
    }
    
    // Загружаем счетчик из localStorage
    function loadCounter(room) {
        try {
            const key = getStorageKey(room);
            const saved = localStorage.getItem(key);
            const count = saved ? parseInt(saved, 10) : 0;
            log(`Счетчик загружен: ${count} для ключа ${key}`);
            return count;
        } catch (e) {
            log('Ошибка при загрузке счетчика:', e);
            return 0;
        }
    }
    
    // Инициализация счетчика для чата
    function initCounter(room) {
        if (mentionCounters.has(room)) {
            return;
        }
        
        log('Инициализация счетчика для комнаты', room);
        
        // Загружаем сохраненное значение
        const savedCount = loadCounter(room);
        
        const counter = {
            count: savedCount,
            element: null,
            headerElement: null,
            room: room
        };
        
        mentionCounters.set(room, counter);
        injectCounterElement(room, counter);
        updateCounterDisplay(room);
        
        log(`Счетчик инициализирован со значением: ${savedCount}`);
    }
    
    // Встраиваем элемент счетчика в список чатов
    function injectCounterElement(room, counter) {
        if (counter.element) {
            return;
        }
        
        const el = document.createElement('div');
        el.className = 'name-mention-counter';
        el.style.cssText = `
            display: inline-block;
            margin: 0 8px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
            border: 2px solid #ccc;
            background-color: transparent;
        `;
        el.title = 'Счетчик сообщений без упоминания имени';
        
        // Пробуем разные места для вставки
        const roomInfo = room.querySelector('.vac-room-info');
        if (roomInfo) {
            roomInfo.prepend(el);
            counter.element = el;
            return;
        }
        
        const roomName = room.querySelector('.vac-room-name');
        if (roomName) {
            roomName.parentNode.insertBefore(el, roomName.nextSibling);
            counter.element = el;
            return;
        }
        
        room.prepend(el);
        counter.element = el;
    }
    
    // Встраиваем счетчик в header чата
    function injectHeaderCounterElement() {
        const roomHeader = document.querySelector(ROOM_HEADER_SEL);
        if (!roomHeader) {
            return null;
        }
        
        const oldCounter = roomHeader.querySelector('.name-mention-counter-header');
        if (oldCounter) {
            oldCounter.remove();
        }
        
        const headerEl = document.createElement('div');
        headerEl.className = 'name-mention-counter-header';
        headerEl.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 12px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 14px;
            font-weight: bold;
            color: #000;
            border: 2px solid #666;
            background-color: transparent;
        `;
        headerEl.title = 'Счетчик сообщений без упоминания имени';
        
        const tagsContainer = roomHeader.querySelector('.vac-info-tags');
        if (tagsContainer) {
            tagsContainer.prepend(headerEl);
            return headerEl;
        }
        
        const roomWrapper = roomHeader.querySelector('.vac-room-wrapper');
        if (roomWrapper) {
            roomWrapper.appendChild(headerEl);
            return headerEl;
        }
        
        roomHeader.prepend(headerEl);
        return headerEl;
    }
    
    // Получаем имя оператора из комнаты
    function getOperatorName(room) {
        const nameElement = room.querySelector('.vac-room-name.vac-text-ellipsis');
        if (!nameElement) {
            return null;
        }
        
        const fullName = nameElement.textContent.trim();
        const firstName = fullName.split(' ')[0];
        return firstName;
    }
    
    // Получаем текст сообщения из карточки
    function getMessageText(messageCard) {
        // Пробуем разные селекторы для текста сообщения
        const selectors = [
            '.vac-text-message',
            '.vac-message-text',
            '.message-text',
            '.text-content',
            'div[class*="message"]',
            'div[class*="text"]',
            'span[class*="message"]',
            'span[class*="text"]'
        ];
        
        for (const selector of selectors) {
            try {
                const element = messageCard.querySelector(selector);
                if (element && element.textContent && element.textContent.trim()) {
                    const text = element.textContent.trim();
                    log(`Текст сообщения найден с селектором ${selector}:`, text);
                    return text;
                }
            } catch (e) {
                log(`Ошибка с селектором ${selector}:`, e.message);
            }
        }
        
        // Если стандартные селекторы не работают, ищем любой текст в карточке
        try {
            const allText = messageCard.textContent || messageCard.innerText;
            if (allText) {
                // Ищем текст который не является временем или служебной информацией
                const textLines = allText.split('\n').filter(line => 
                    line.trim() && 
                    !line.match(/\d{1,2}:\d{2}/) && // не время
                    !line.match(/^(Today|Вчера|Yesterday|Сегодня)/i) && // не дата
                    !line.match(/^\d{1,2}\.\d{1,2}\.\d{4}/) && // не дата
                    line.trim().length > 2 // не слишком короткий текст
                );
                
                if (textLines.length > 0) {
                    const text = textLines[0].trim();
                    log('Текст сообщения найден в общем содержимом:', text);
                    return text;
                }
            }
        } catch (e) {
            log('Ошибка при анализе общего текста:', e.message);
        }
        
        return '';
    }
    
    // Проверяем, содержит ли сообщение упоминание имени
    function containsNameMention(messageText, operatorName) {
        if (!messageText || !operatorName) {
            return false;
        }
        
        const cleanText = messageText.toLowerCase().trim();
        const name = operatorName.toLowerCase();
        
        const patterns = [
            name + ',',
            name + '!', 
            name + '?',
            name + '...',
            name + ' ',
            ' ' + name + ' ',
            ' ' + name + ',',
            ' ' + name + '!',
            ' ' + name + '?',
            name + '.',
            name + ':'
        ];
        
        for (const pattern of patterns) {
            if (cleanText.includes(pattern)) {
                log(`Упоминание найдено: содержит "${pattern}"`);
                return true;
            }
        }
        
        if (cleanText.startsWith(name)) {
            log(`Упоминание в начале: начинается с "${name}"`);
            return true;
        }
        
        log(`Упоминание не найдено: не содержит "${name}"`);
        return false;
    }
    
    // Находим комнату по активному чату
    function findRoomForActiveChat() {
        const activeRoom = document.querySelector('.vac-room-item.vac-room-selected');
        if (activeRoom) {
            return activeRoom;
        }
        
        const headerName = document.querySelector('.vac-room-header .vac-room-name');
        if (headerName) {
            const roomName = headerName.textContent.trim();
            const rooms = document.querySelectorAll(CHAT_SEL);
            for (const room of rooms) {
                const roomNameEl = room.querySelector('.vac-room-name');
                if (roomNameEl && roomNameEl.textContent.trim() === roomName) {
                    return room;
                }
            }
        }
        
        return null;
    }
    
    // Обрабатываем новое сообщение
    function processNewMessage(messageCard) {
        log('Обработка нового сообщения');
        
        const room = findRoomForActiveChat();
        if (!room) {
            log('Комната не найдена для сообщения');
            return;
        }
        
        if (!mentionCounters.has(room)) {
            log('Инициализируем счетчик для комнаты');
            initCounter(room);
        }
        
        const counter = mentionCounters.get(room);
        if (!counter) {
            log('Счетчик не найден');
            return;
        }
        
        const isMyMessage = messageCard.classList.contains(MY_MSG_CLS);
        log(`Сообщение мое: ${isMyMessage}`);
        
        if (!isMyMessage) {
            return;
        }
        
        const messageText = getMessageText(messageCard);
        if (!messageText) {
            log('Текст сообщения пустой');
            return;
        }
        
        const operatorName = getOperatorName(room);
        if (!operatorName) {
            log('Имя оператора не найдено');
            return;
        }
        
        log(`Проверяем сообщение: "${messageText}" на имя: "${operatorName}"`);
        
        if (containsNameMention(messageText, operatorName)) {
            log('Имя упомянуто, сбрасываем счетчик');
            counter.count = 0;
        } else {
            log('Имя не упомянуто, увеличиваем счетчик');
            counter.count++;
        }
        
        // Сохраняем новое значение
        saveCounter(room, counter.count);
        
        log(`Новое значение счетчика: ${counter.count}`);
        updateCounterDisplay(room);
    }
    
    // Обновляем отображение счетчика
    function updateCounterDisplay(room) {
        const counter = mentionCounters.get(room);
        if (!counter) {
            return;
        }
        
        const count = counter.count;
        log(`Обновление счетчика: ${count} сообщений без имени`);
        
        if (counter.element) {
            counter.element.textContent = count > 0 ? count.toString() : '';
            updateCounterStyle(counter.element, count);
        }
        
        updateHeaderCounter(count);
    }
    
    // Обновляем счетчик в header'е
    function updateHeaderCounter(count) {
        let headerCounter = document.querySelector('.name-mention-counter-header');
        
        if (!headerCounter) {
            headerCounter = injectHeaderCounterElement();
            if (!headerCounter) return;
        }
        
        headerCounter.textContent = count > 0 ? count.toString() : '';
        updateCounterStyle(headerCounter, count);
    }
    
    // Обновляем стили счетчика
    function updateCounterStyle(element, count) {
        if (count === 0) {
            element.style.backgroundColor = 'transparent';
            element.style.borderColor = '#ccc';
            element.style.color = '#000';
        } else if (count === 1) {
            element.style.backgroundColor = '#9ACD32';
            element.style.borderColor = '#9ACD32';
            element.style.color = '#000';
        } else if (count === 2) {
            element.style.backgroundColor = '#F0E68C';
            element.style.borderColor = '#F0E68C';
            element.style.color = '#000';
        } else if (count >= 3) {
            element.style.backgroundColor = '#CD5C5C';
            element.style.borderColor = '#CD5C5C';
            element.style.color = '#fff';
        }
    }
    
    // Восстанавливаем историю сообщений при загрузке
    function restoreMessageHistory() {
        log('Восстановление истории сообщений...');
        
        const activeRoom = findRoomForActiveChat();
        if (!activeRoom) {
            log('Активная комната не найдена для восстановления истории');
            return;
        }
        
        // Инициализируем счетчик для активной комнаты
        if (!mentionCounters.has(activeRoom)) {
            initCounter(activeRoom);
        }
        
        const counter = mentionCounters.get(activeRoom);
        if (!counter) {
            return;
        }
        
        // Ищем все мои сообщения в истории
        const myMessages = document.querySelectorAll(`${MSG_CARD_SEL}.${MY_MSG_CLS}`);
        log(`Найдено моих сообщений в истории: ${myMessages.length}`);
        
        let consecutiveWithoutMention = 0;
        const operatorName = getOperatorName(activeRoom);
        
        if (!operatorName) {
            log('Имя оператора не найдено для восстановления истории');
            return;
        }
        
        // Проходим по всем сообщениям с конца (от новых к старым)
        for (let i = myMessages.length - 1; i >= 0; i--) {
            const messageCard = myMessages[i];
            const messageText = getMessageText(messageCard);
            
            if (!messageText) continue;
            
            if (containsNameMention(messageText, operatorName)) {
                // Нашли сообщение с упоминанием - останавливаемся
                log(`Найдено сообщение с упоминанием, сбрасываем счетчик`);
                break;
            } else {
                consecutiveWithoutMention++;
                log(`Сообщение без упоминания: ${consecutiveWithoutMention}`);
            }
        }
        
        // Обновляем счетчик если нашли сообщения без упоминания
        if (consecutiveWithoutMention > 0 && consecutiveWithoutMention !== counter.count) {
            log(`Восстановлен счетчик: ${consecutiveWithoutMention} сообщений без упоминания`);
            counter.count = consecutiveWithoutMention;
            saveCounter(activeRoom, counter.count);
            updateCounterDisplay(activeRoom);
        }
    }
    
    // Инициализация всех чатов
    function initChats() {
        const chats = document.querySelectorAll(CHAT_SEL);
        log(`Найдено чатов: ${chats.length}`);
        
        chats.forEach((room) => {
            initCounter(room);
        });
        
        // Восстанавливаем историю для активного чата
        setTimeout(restoreMessageHistory, 1000);
    }
    
    // Наблюдатель за новыми сообщениями
    function setupMessageObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (!(node instanceof Element)) continue;
                        
                        let messageCard = null;
                        if (node.matches(MSG_CARD_SEL)) {
                            messageCard = node;
                        } else {
                            messageCard = node.querySelector(MSG_CARD_SEL);
                        }
                        
                        if (messageCard) {
                            log('Найдена новая карточка сообщения');
                            // Даем время для рендера текста
                            setTimeout(() => {
                                try {
                                    processNewMessage(messageCard);
                                } catch (error) {
                                    log('Ошибка при обработке сообщения:', error);
                                }
                            }, 300);
                        }
                    }
                }
            }
        });
        
        const messageContainer = document.querySelector('.vac-room-container') || document.body;
        observer.observe(messageContainer, {
            childList: true,
            subtree: true
        });
        
        log('Наблюдатель за сообщениями запущен');
    }
    
    // Наблюдатель за изменениями DOM
    function setupDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node instanceof Element) {
                            if (node.matches(CHAT_SEL) || node.querySelector(CHAT_SEL)) {
                                setTimeout(initChats, 1000);
                                break;
                            }
                        }
                    }
                }
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Запуск
    function start() {
        log('Запуск скрипта MBSSNameMentionCounter v1.7...');
        
        setTimeout(() => {
            try {
                initChats();
                setupMessageObserver();
                setupDOMObserver();
                injectHeaderCounterElement();
                
                log('Скрипт полностью инициализирован');
            } catch (error) {
                log('Ошибка при инициализации:', error);
            }
        }, 2000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
    
})();