// ==UserScript==
// @name         Kinopoisk All-in-One Tools
// @namespace    All-in-One Tools
// @version      1.0
// @description  Скрипт для Kinopoisk и IMDb: случайный фильм, быстрый поиск с языком, центрирование и фиксированный заголовок IMDb
// @author       Maesta_Nequitia
// @match        *://www.kinopoisk.ru/*
// @match        *://www.imdb.com/*
// @grant        none
// @icon         https://www.kinopoisk.ru/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549379/Kinopoisk%20All-in-One%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/549379/Kinopoisk%20All-in-One%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================
    // Блок для Kinopoisk
    // ===========================
    if (window.location.hostname.includes('kinopoisk.ru')) {

        // ===== Случайный фильм =====
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function createRandomButton() {
            const randomButton = document.createElement('button');
            randomButton.textContent = 'Случайный фильм';
            randomButton.style.margin = '-4px';
            randomButton.addEventListener('click', handleButtonClick);

            const targetElement = document.querySelector('.hide_my_vote_filtr');
            targetElement ? targetElement.appendChild(randomButton) : console.log('Target element not found.');
        }

        function handleButtonClick() {
            const infoElements = document.querySelectorAll('.info');
            if (!infoElements.length) return;

            const randomIndex = getRandomInt(0, infoElements.length - 1);
            const randomInfo = infoElements[randomIndex];
            const filmName = randomInfo.querySelector('.name').textContent.trim();
            const filmDuration = randomInfo.querySelector('span:nth-child(2)').textContent.trim();
            const englishName = randomInfo.querySelector('.name-ru + .name-en');
            let filmInfo = `Случайный фильм (${randomIndex + 1}):\n${filmName}`;
            englishName && (filmInfo += `\n${englishName.textContent.trim()}`);
            filmInfo += `\n${filmDuration}`;
            alert(filmInfo);
        }

        createRandomButton();

        // ===== Центрирование контейнера =====
        window.addEventListener('load', () => {
            const container = document.querySelector('.styles_mainContainer__9Dor_');
            if (container) {
                container.style.marginLeft = '0';
                container.style.display = 'flex';
                container.style.justifyContent = 'center';
            }
        });

        // ===== Быстрый поиск фильмов =====
        const BUTTON_STYLE = {
            position: 'fixed',
            top: '26px',
            zIndex: '9999',
            cursor: 'pointer',
        };

        const filmSeriesRegex = /^https:\/\/www\.kinopoisk\.ru\/(film|series)\/[^\/]+\/?$/;

        const customSites = [
            { icon: 'https://favicon.yandex.net/favicon/imdb.com', handler: 'https://www.imdb.com/find/?q=', lang: 'en' },
            { icon: 'https://favicon.yandex.net/favicon/letterboxd.com', handler: 'https://letterboxd.com/search/', lang: 'en' },
            { icon: 'https://favicon.yandex.net/favicon/rutracker.org', handler: 'https://rutracker.org/forum/tracker.php?nm=', lang: 'ru' },
            { icon: 'https://favicon.yandex.net/favicon/rutor.info', handler: 'http://rutor.info/search/0/0/100/0/', lang: 'ru' },
            { icon: 'https://favicon.yandex.net/favicon/nnmclub.to', handler: 'https://nnmclub.to/forum/tracker.php?nm=', lang: 'ru' },
            { icon: 'https://favicon.yandex.net/favicon/kinozal.tv', handler: 'https://kinozal.tv/browse.php?s=', lang: 'ru' },
            { icon: 'https://favicon.yandex.net/favicon/ext.to', handler: 'https://ext.to/browse/?q=', lang: 'en' },
            { icon: 'https://favicon.yandex.net/favicon/thepiratebay10.xyz', handler: 'https://thepiratebay10.xyz/search/', lang: 'en' },
        ];

        function getRussianTitle() {
            const russianSpan = document.querySelector('h1 span[data-tid]');
            if (!russianSpan) return null;
            return russianSpan.innerText.replace(/\([^\)]+\)/g, '').trim();
        }

        function getEnglishTitle() {
            const englishSpan = document.querySelector('.styles_originalTitle__nZWQK');
            if (!englishSpan) return null;
            return englishSpan.innerText.replace(/\([^\)]+\)/g, '').trim();
        }

        function createCustomButton(site, index) {
            const buttonId = `quick-search-btn-${index}`;
            if (document.getElementById(buttonId)) return;

            let filmTitle = site.lang === 'en' ? getEnglishTitle() : getRussianTitle();
            if (!filmTitle) return;

            const a = document.createElement('a');
            a.id = buttonId;
            a.href = site.handler + encodeURIComponent(filmTitle);
            a.target = '_blank';
            Object.assign(a.style, BUTTON_STYLE, { left: `${1280 + index * 40}px` });

            const img = document.createElement('img');
            img.src = site.icon;
            img.alt = 'Search';
            img.style.width = '100%';
            img.style.height = '100%';

            a.appendChild(img);
            document.body.appendChild(a);
        }

        function removeCustomButtons() {
            customSites.forEach((_, index) => {
                const btn = document.getElementById(`quick-search-btn-${index}`);
                if (btn) btn.remove();
            });
        }

        function updateButtons() {
            if (filmSeriesRegex.test(window.location.href)) {
                customSites.forEach(createCustomButton);
            } else {
                removeCustomButtons();
            }
        }

        updateButtons();
        const observer = new MutationObserver(updateButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ===========================
    // Блок для IMDb
    // ===========================
    if (window.location.hostname.includes('imdb.com')) {

        const header = document.getElementById('imdbHeader');
        if (!header) return;

        // Фиксируем заголовок
        const style = document.createElement('style');
        style.textContent = `.fixed-header{position:fixed;top:0;left:0;right:0;z-index:1000;box-shadow:0 2px 5px rgba(0,0,0,0.1)}`;
        document.head.appendChild(style);
        window.addEventListener('scroll', () => header.classList.toggle('fixed-header', window.scrollY > 0));

        // Добавляем кнопку Kinopoisk
        window.addEventListener('load', () => {
            const titleEl = document.querySelector('.sc-d8941411-1.fTeJrK, .hero__primary-text');
            if (!titleEl) return;

            let title = titleEl.textContent.replace(/^Original title:\s*/i, '').trim();

            const btn = document.createElement('button');
            Object.assign(btn.style, {
                position:'fixed',
                top:'10px',
                right:'20px',
                zIndex:9999,
                cursor:'pointer',
                border:'none',
                padding:'0',
                background:'transparent',
                width:'40px',
                height:'40px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
            });

            const img = document.createElement('img');
            img.src = 'https://favicon.yandex.net/favicon/kinopoisk.ru';
            img.style.width = img.style.height = '16px';
            btn.appendChild(img);

            btn.onclick = () => window.open('https://www.kinopoisk.ru/index.php?kp_query=' + encodeURIComponent(title), '_blank');

            header.appendChild(btn);
        });
    }

})();
