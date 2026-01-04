// ==UserScript==
// @name         Lolz.live: Предпросмотр тем с сохранением стилей
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Предпросмотр темы при наведении с сохранением стилей никнеймов
// @author       You
// @match        https://lolz.live/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554629/Lolzlive%3A%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D1%82%D0%B5%D0%BC%20%D1%81%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D1%81%D1%82%D0%B8%D0%BB%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/554629/Lolzlive%3A%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D1%82%D0%B5%D0%BC%20%D1%81%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D1%81%D1%82%D0%B8%D0%BB%D0%B5%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // 1. Скрываем цитаты/рекламу
    /////////////////////////////
    const style = document.createElement('style');
    style.textContent = `
        .threadMessage.bbCodeQuote.noQuote { display: none !important; }

        .thread-preview-popup {
            position: fixed;
            z-index: 9999;
            max-width: 480px;
            max-height: 500px;
            overflow: auto;
            background: #1c1c1c;
            color: #fff;
            border: 1px solid #555;
            border-radius: 8px;
            padding: 10px;
            font-size: 13px;
            line-height: 1.3em;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .thread-preview-popup img {
            max-width: 400px;
            max-height: 300px;
            display: block;
            margin: 8px auto;
        }
        .thread-preview-popup .thread-preview-header {
            font-weight: bold;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            padding: 0 5px;
        }
        .thread-preview-popup blockquote {
            margin: 0 0 5px 0;
        }
        .thread-preview-popup p, .thread-preview-popup div {
            margin: 0 0 5px 0;
        }
        .thread-preview-popup .author, .thread-preview-popup .date {
            font-size: 13px;
        }
    `;
    document.head.appendChild(style);

    /////////////////////////////
    // 2. Создаем контейнер предпросмотра
    /////////////////////////////
    const popup = document.createElement('div');
    popup.className = 'thread-preview-popup';
    popup.style.display = 'none';
    document.body.appendChild(popup);

    let showTimeout;

    /////////////////////////////
    // 3. Функция получения первого поста темы
    /////////////////////////////
    async function fetchFirstPost(url) {
        try {
            const resp = await fetch(url);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.querySelector('.message.firstPost');
        } catch (e) {
            console.error('Ошибка загрузки темы:', e);
            return null;
        }
    }

    /////////////////////////////
    // 4. Навешиваем обработчики на ссылки тем
    /////////////////////////////
    document.querySelectorAll('.discussionListItem--Wrapper a[href*="threads/"]').forEach(a => {
        a.addEventListener('mouseenter', async e => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            clearTimeout(showTimeout);
            showTimeout = setTimeout(async () => {
                // Позиционируем popup
                popup.style.display = 'block';
                const popupWidth = 480;
                const popupHeight = 500;
                let left = mouseX;
                let top = mouseY;
                if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 10;
                if (top + popupHeight > window.innerHeight) top = window.innerHeight - popupHeight - 10;
                if (left < 0) left = 10;
                if (top < 0) top = 10;
                popup.style.left = `${left}px`;
                popup.style.top = `${top}px`;

                popup.innerHTML = '<i>Загрузка предпросмотра...</i>';

                // Получаем первый пост
                const firstPost = await fetchFirstPost(a.href);
                if (!firstPost) {
                    popup.innerHTML = '<i>Не удалось загрузить предпросмотр</i>';
                    return;
                }

                // Заголовок с автором и датой
                const header = document.createElement('div');
                header.className = 'thread-preview-header';
                const authorEl = firstPost.querySelector('.poster, .username');
                const author = authorEl ? authorEl.cloneNode(true) : document.createElement('span');
                const dateEl = firstPost.querySelector('.DateTime');
                const date = dateEl ? dateEl.getAttribute('data-datestring') + ' ' + dateEl.getAttribute('data-timestring') : '—';
                const dateSpan = document.createElement('span');
                dateSpan.className = 'date';
                dateSpan.textContent = date;

                header.appendChild(author);
                header.appendChild(dateSpan);
                popup.innerHTML = '';
                popup.appendChild(header);

                const style = document.createElement('style');
style.textContent = `
    .threadMessage.bbCodeQuote.noQuote { display: none !important; }

    .thread-preview-popup {
        position: fixed;
        z-index: 9999;
        max-width: 480px;
        max-height: 500px;
        overflow: auto;
        background: #1c1c1c;
        color: #fff;
        border: 1px solid #555;
        border-radius: 8px;
        padding: 10px;
        font-size: 13px;
        line-height: 1.3em;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);

        /* Скроллбар */
        scrollbar-width: thin;
        scrollbar-color: #555 #1c1c1c;
    }

    /* Для Webkit-браузеров */
    .thread-preview-popup::-webkit-scrollbar {
        width: 8px;
    }
    .thread-preview-popup::-webkit-scrollbar-track {
        background: #1c1c1c;
        border-radius: 8px;
    }
    .thread-preview-popup::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 8px;
        border: 2px solid #1c1c1c;
    }

    .thread-preview-popup img {
        max-width: 400px;
        max-height: 300px;
        display: block;
        margin: 8px auto;
    }
    .thread-preview-popup .thread-preview-header {
        font-weight: bold;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
    }
    .thread-preview-popup blockquote {
        margin: 0 0 5px 0;
    }
    .thread-preview-popup p, .thread-preview-popup div {
        margin: 0 0 5px 0;
    }
    .thread-preview-popup .author, .thread-preview-popup .date {
        font-size: 13px;
    }
`;
document.head.appendChild(style);

                // Содержимое поста
                const content = firstPost.querySelector('.messageContent') || firstPost.querySelector('.messageText');
                if (content) {
                    const clone = content.cloneNode(true);

                    // Центрируем изображения и ограничиваем размер
                    clone.querySelectorAll('img').forEach(img => {
                        img.style.maxWidth = '400px';
                        img.style.maxHeight = '300px';
                        img.style.display = 'block';
                        img.style.margin = '8px auto';
                    });

                    // Убираем лишние отступы
                    clone.querySelectorAll('p, div, blockquote').forEach(el => {
                        el.style.marginTop = '0';
                        el.style.marginBottom = '5px';
                    });

                    popup.appendChild(clone);
                }
            }, 250);
        });

        // Скрываем popup при уходе с ссылки
        a.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
            setTimeout(() => {
                if (!popup.matches(':hover')) popup.style.display = 'none';
            }, 50);
        });
    });

    // Закрываем popup, когда мышь покидает его
    popup.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
    });

})();