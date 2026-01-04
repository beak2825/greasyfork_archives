// ==UserScript==
// @name         Счетчик слов в биографиях
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Подсчитывает количество слов в РП-биографиях
// @author       Dany_Forbs
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/Hk1JCSZd/i-3.jpg
// @downloadURL https://update.greasyfork.org/scripts/552568/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%81%D0%BB%D0%BE%D0%B2%20%D0%B2%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/552568/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%81%D0%BB%D0%BE%D0%B2%20%D0%B2%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%D1%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки, что это раздел биографий
    function isBiographySection() {
        // Проверяем несколько способов определения раздела биографий
        const breadcrumb = document.querySelector('.p-breadcrumbs');
        if (breadcrumb) {
            const breadcrumbText = breadcrumb.textContent.toLowerCase();
            if (breadcrumbText.includes('рп-биографии') || 
                breadcrumbText.includes('биографи') ||
                document.URL.includes('/forums/РП-биографии')) {
                return true;
            }
        }
        
        // Проверяем заголовок темы
        const title = document.querySelector('.p-title-value');
        if (title && title.textContent.toLowerCase().includes('биографи')) {
            return true;
        }
        
        // Проверяем URL
        if (document.URL.includes('биографи')) {
            return true;
        }
        
        return false;
    }

    // Функция для очистки текста от не-слов
    function cleanText(text) {
        // Удаляем BB-коды и HTML теги
        text = text.replace(/\[.*?\]/g, ' ');
        text = text.replace(/<.*?>/g, ' ');
        
        // Удаляем смайлики и эмодзи
        text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, ' '); // Эмодзи
        text = text.replace(/[\u{1F300}-\u{1F5FF}]/gu, ' '); // Символы и пиктограммы
        text = text.replace(/[\u{1F680}-\u{1F6FF}]/gu, ' '); // Транспорт и карты
        text = text.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ' '); // Флаги
        text = text.replace(/[;:][)(]|[)(][;:]|:[()]|\([;:)]|[:;]-?[()DPp]|\(-?[:;]|<3/gi, ' '); // Текстовые смайлы
        
        // Удаляем цифры, года, даты (только отдельные числа)
        text = text.replace(/\b\d+\b/g, ' '); // Любые отдельные числа
        
        // Удаляем специальные символы, оставляем только буквы, дефисы и пробелы
        text = text.replace(/[^\w\sа-яА-ЯёЁ\-]/g, ' ');
        
        // Удаляем лишние пробелы
        text = text.trim().replace(/\s+/g, ' ');
        
        return text;
    }

    // Функция для подсчета слов
    function countWords(text) {
        // Очищаем текст
        text = cleanText(text);
        if (text === '') return 0;
        
        // Разделяем на слова и фильтруем
        const words = text.split(' ').filter(word => {
            // Исключаем пустые строки
            return word.length > 0 && 
                   // Исключаем слова содержащие только цифры
                   !/^\d+$/.test(word);
        });
        
        return words.length;
    }

    // Функция для проверки, что это первое сообщение темы
    function isFirstPost(post) {
        // Находим все сообщения в теме
        const allPosts = document.querySelectorAll('.message--post');
        if (allPosts.length === 0) return false;
        
        // Первое сообщение - это первое в списке
        return post === allPosts[0];
    }

    // Функция для добавления счетчика к посту
    function addWordCounterToPost(post) {
        // Проверяем, что это раздел биографий
        if (!isBiographySection()) {
            return;
        }

        // Проверяем, что это ПЕРВОЕ сообщение темы
        if (!isFirstPost(post)) {
            return;
        }

        // Ищем контент поста
        const content = post.querySelector('.bbWrapper');
        if (!content) return;

        // Пропускаем пустые посты или посты с малым количеством текста
        if (content.textContent.trim().length < 50) {
            return;
        }

        // Удаляем предыдущий счетчик если есть
        const existingCounter = post.querySelector('.word-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // Получаем текст без цитат
        let text = content.innerHTML;
        
        // Удаляем цитаты
        text = text.replace(/<blockquote.*?<\/blockquote>/gs, '');
        text = text.replace(/\[quote.*?\[\/quote\]/gs, '');
        
        // Удаляем подписи
        const signature = content.querySelector('.message-signature');
        if (signature) {
            text = text.replace(signature.outerHTML, '');
        }
        
        // Получаем чистый текст
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';

        // Удаляем лишние пробелы и переносы
        cleanText = cleanText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // Считаем слова
        const rawWordCount = countWords(cleanText);
        // Вычитаем 15 слов
        const finalWordCount = Math.max(0, rawWordCount - 15);

        // Создаем элемент счетчика
        const counter = document.createElement('div');
        counter.className = 'word-counter';
        counter.style.cssText = `
            margin: 15px 0;
            padding: 12px;
            border-radius: 8px;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        // Определяем цвет в зависимости от количества слов
        let color, status, icon;
        if (finalWordCount >= 200 && finalWordCount <= 600) {
            color = '#28a745';
            status = 'Соответствует требованиям';
            icon = '✅';
        } else if (finalWordCount < 200) {
            color = '#dc3545';
            status = `Меньше 200 слов (не хватает ${200 - finalWordCount})`;
            icon = '❌';
        } else {
            color = '#dc3545';
            status = `Больше 600 слов (лишних ${finalWordCount - 600})`;
            icon = '❌';
        }

        counter.innerHTML = `
            <div style="color: ${color}; font-size: 16px; margin-bottom: 5px;">
                ${icon} <strong>Слов в биографии: ${finalWordCount}</strong>
            </div>
            <div style="color: #6c757d; font-size: 12px; margin-bottom: 3px;">
                (с учетом вычета 15 слов, изначально: ${rawWordCount})
            </div>
            <div style="color: ${color}; font-size: 12px; margin-bottom: 5px;">
                ${status}
            </div>
            <div style="font-size: 11px; color: #6c757d;">
                Требования: 200-600 слов (учитывается вычет 15 слов)
            </div>
        `;

        // Добавляем счетчик после контента
        content.parentNode.insertBefore(counter, content.nextSibling);
        
        console.log('Счетчик слов:', {
            'Изначально слов': rawWordCount,
            'После вычета': finalWordCount,
            'Текст для проверки': cleanText.substring(0, 100) + '...'
        });
    }

    // Функция для обработки всех постов на странице
    function processAllPosts() {
        if (!isBiographySection()) {
            console.log('Это не раздел биографий, скрипт не активирован');
            return;
        }
        
        console.log('Раздел биографий обнаружен, активирую счетчик слов...');
        
        const posts = document.querySelectorAll('.message--post');
        console.log('Найдено постов:', posts.length);
        
        // Обрабатываем только первый пост
        if (posts.length > 0) {
            addWordCounterToPost(posts[0]);
        }
    }

    // Запускаем при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllPosts);
    } else {
        processAllPosts();
    }

    // Обработка динамически загружаемого контента
    const observer = new MutationObserver(function(mutations) {
        if (!isBiographySection()) return;
        
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('message--post')) {
                        // Проверяем, что это первое сообщение
                        const allPosts = document.querySelectorAll('.message--post');
                        if (allPosts.length > 0 && node === allPosts[0]) {
                            setTimeout(() => addWordCounterToPost(node), 500);
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();