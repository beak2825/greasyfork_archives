// ==UserScript==
// @name         MAIL.RU TITLE YYYY-MM-DD
// @namespace    https://greasyfork.org/ru/scripts/555313-mail-ru-title-yyyy-mm-dd
// @version      2.1
// @description  Изменяет title страницы почты mail ru на основе элемента темы письма и адресата c добавлением времени в верхнем регистре. Заголовок закладки вкладки
// @author       SPASIBOKVN
// @homepage     http://sk-3.ru/
// @icon         http://gorbunki.info-lan.me:8080/INI/SPASIBOKVN.png
// @icon64       http://gorbunki.info-lan.me:8080/INI/SPASIBOKVN.png
// @match        https://e.mail.ru/*
// @match        https://light.mail.ru/*
// @match        https://octavius.mail.ru/*
// @grant        none
// @license      GNU GPLv3

// @namespace https://greasyfork.org/users/1535975
// @downloadURL https://update.greasyfork.org/scripts/555313/MAILRU%20TITLE%20YYYY-MM-DD.user.js
// @updateURL https://update.greasyfork.org/scripts/555313/MAILRU%20TITLE%20YYYY-MM-DD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    function parseRussianDate(dateString) {
        const months = {
            'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
            'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
            'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        };
        
        try {
            const now = new Date();
            let targetDate = new Date(now);
            
            // Проверяем специальные случаи "сегодня" и "вчера"
            if (dateString.toLowerCase().includes('сегодня')) {
                // Используем текущую дату
                targetDate = new Date(now);
            } else if (dateString.toLowerCase().includes('вчера')) {
                // Используем вчерашнюю дату
                targetDate = new Date(now);
                targetDate.setDate(targetDate.getDate() - 1);
            } else {
                // Обычный парсинг даты с русскими месяцами
                const parts = dateString.split(',');
                if (parts.length < 2) return getCurrentTimestamp();
                
                const datePart = parts[0].trim(); // "6 ноября"
                const timePart = parts[1].trim(); // "19:11"
                
                // Разбираем дату
                const dateParts = datePart.split(' ');
                if (dateParts.length < 2) return getCurrentTimestamp();
                
                const day = parseInt(dateParts[0]);
                const monthName = dateParts[1].toLowerCase();
                const month = months[monthName];
                
                if (isNaN(day) || month === undefined) return getCurrentTimestamp();
                
                // Разбираем время
                const timeParts = timePart.split(':');
                if (timeParts.length < 2) return getCurrentTimestamp();
                
                const hours = parseInt(timeParts[0]);
                const minutes = parseInt(timeParts[1]);
                
                if (isNaN(hours) || isNaN(minutes)) return getCurrentTimestamp();
                
                // Создаем дату (предполагаем текущий год)
                const year = now.getFullYear();
                targetDate = new Date(year, month, day, hours, minutes);
                
                // Проверяем, не находится ли дата в будущем (например, если это прошлогодняя дата)
                if (targetDate > now) {
                    targetDate.setFullYear(year - 1);
                }
            }
            
            // Извлекаем время из строки если есть
            let finalHours = targetDate.getHours();
            let finalMinutes = targetDate.getMinutes();
            let finalSeconds = targetDate.getSeconds();
            
            // Если в строке есть время, используем его
            const timeMatch = dateString.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
                finalHours = parseInt(timeMatch[1]);
                finalMinutes = parseInt(timeMatch[2]);
                finalSeconds = 0;
                
                targetDate.setHours(finalHours, finalMinutes, finalSeconds);
            }
            
            // Форматируем в YYYY-MM-DD HH:MM:SS
            const formattedYear = targetDate.getFullYear();
            const formattedMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
            const formattedDay = String(targetDate.getDate()).padStart(2, '0');
            const formattedHours = String(finalHours).padStart(2, '0');
            const formattedMinutes = String(finalMinutes).padStart(2, '0');
            const formattedSeconds = String(finalSeconds).padStart(2, '0');
            
            return `${formattedYear}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            
        } catch (error) {
            console.error('Ошибка парсинга даты:', error);
            return getCurrentTimestamp();
        }
    }
    
    function getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    function getDateFromElements() {
        // Сначала пробуем получить дату из letter__date
        const letterDateElement = document.querySelector('.letter__date');
        if (letterDateElement) {
            const dateText = letterDateElement.textContent.trim();
            if (dateText) {
                return parseRussianDate(dateText);
            }
        }
        
        // Затем пробуем получить дату из m-header mh-DateUTS
        const dateUTSElement = document.querySelector('.m-header.mh-DateUTS');
        if (dateUTSElement) {
            const dateText = dateUTSElement.textContent.trim();
            if (dateText) {
                return parseRussianDate(dateText);
            }
        }
        
        return getCurrentTimestamp();
    }
    
    function getMainText() {
        // Сначала ищем элемент с классом "val"
        let targetElement = document.querySelector('.val');
        
        // Если не нашли, ищем элемент с классами "thread-subject thread-subject_pony-mode"
        if (!targetElement) {
            targetElement = document.querySelector('.thread-subject.thread-subject_pony-mode');
        }
        
        // Если не нашли, ищем элемент с классами "m-header mh-Subject mr_read__title"
        if (!targetElement) {
            targetElement = document.querySelector('.m-header.mh-Subject.mr_read__title');
        }
        
        return targetElement ? targetElement.textContent.trim() : '';
    }
    
    function getAdditionalText() {
        const additionalParts = [];
        
        // Ищем элемент с классом "mr_read__fromf"
        const fromfElement = document.querySelector('.mr_read__fromf');
        if (fromfElement) {
            const fromfText = fromfElement.textContent.trim();
            if (fromfText) {
                additionalParts.push(fromfText);
            }
        }
        
        // Ищем элемент с классом "letter-contact letter-contact_pony-mode"
        const contactElement = document.querySelector('.letter-contact.letter-contact_pony-mode');
        if (contactElement) {
            const contactText = contactElement.textContent.trim();
            if (contactText) {
                additionalParts.push(contactText);
            }
        }
        
        return additionalParts.length > 0 ? additionalParts.join(' | ') : '';
    }
    
    function changeTitle() {
        // Получаем основной текст
        const mainText = getMainText();
        // Получаем дополнительный текст
        const additionalText = getAdditionalText();
        
        if (mainText) {
            // Получаем дату из доступных элементов
            const timestamp = getDateFromElements();
            // Преобразуем основной текст в заглавные буквы
            const uppercaseText = mainText.toUpperCase();
            
            // Формируем новый title
            let newTitle = `${timestamp} ${uppercaseText}`;
            
            // Добавляем дополнительный текст если есть
            if (additionalText) {
                newTitle += ` | ${additionalText}`;
            }
            
            // Изменяем title страницы
            document.title = newTitle;
            console.log('Title изменен на: ' + newTitle);
            
            // Логируем источники
            const mainElement = document.querySelector('.val') || 
                               document.querySelector('.thread-subject.thread-subject_pony-mode') ||
                               document.querySelector('.m-header.mh-Subject.mr_read__title');
            const dateElement = document.querySelector('.letter__date') || 
                               document.querySelector('.m-header.mh-DateUTS');
            console.log('Основной источник: ' + (mainElement ? mainElement.className : 'не найден'));
            console.log('Источник даты: ' + (dateElement ? dateElement.textContent.trim() : 'не найден, использовано текущее время'));
            if (additionalText) {
                console.log('Дополнительные источники: ' + additionalText);
            }
        } else {
            console.log('Основные элементы не найдены');
        }
    }
    
    // Запускаем функцию сразу после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', changeTitle);
    } else {
        changeTitle();
    }
    
    // Дополнительно: отслеживаем изменения DOM на случай динамической загрузки контента
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Проверяем, был ли добавлен или изменен любой из целевых элементов
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Проверяем все классы которые нас интересуют
                        if (node.classList) {
                            if (node.classList.contains('val') ||
                                (node.classList.contains('thread-subject') && node.classList.contains('thread-subject_pony-mode')) ||
                                (node.classList.contains('m-header') && node.classList.contains('mh-Subject') && node.classList.contains('mr_read__title')) ||
                                node.classList.contains('mr_read__fromf') ||
                                (node.classList.contains('letter-contact') && node.classList.contains('letter-contact_pony-mode')) ||
                                node.classList.contains('letter__date') ||
                                (node.classList.contains('m-header') && node.classList.contains('mh-DateUTS'))) {
                                shouldUpdate = true;
                            }
                        }
                        // Проверяем вложенные элементы
                        if (node.querySelector) {
                            if (node.querySelector('.val') || 
                                node.querySelector('.thread-subject.thread-subject_pony-mode') ||
                                node.querySelector('.m-header.mh-Subject.mr_read__title') ||
                                node.querySelector('.mr_read__fromf') ||
                                node.querySelector('.letter-contact.letter-contact_pony-mode') ||
                                node.querySelector('.letter__date') ||
                                node.querySelector('.m-header.mh-DateUTS')) {
                                shouldUpdate = true;
                            }
                        }
                    }
                });
            }
        });
        
        if (shouldUpdate) {
            changeTitle();
        }
    });
    
    // Начинаем наблюдение за изменениями в body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();