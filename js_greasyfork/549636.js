// ==UserScript==
// @name         Wildberries Space Scroll Fix v2.3
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Прокрутка по карточкам и переход на следующую страницу по пробелу
// @author       McDuck
// @match        https://www.wildberries.ru/*
// @match        https://wildberries.ru/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549636/Wildberries%20Space%20Scroll%20Fix%20v23.user.js
// @updateURL https://update.greasyfork.org/scripts/549636/Wildberries%20Space%20Scroll%20Fix%20v23.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCardElements() {
        const selectors = [
            '.product-card__wrapper',
            '.card__wrapper',
            '.j-card-item',
            '.product-card',
            '.card',
            '.catalog-product',
            '[data-nm-id]',
            '.product-card__inner'
        ];

        let allCards = [];
        selectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            allCards = allCards.concat(Array.from(cards));
        });

        // Возвращаем все карточки, включая "Вы недавно смотрели"
        return [...new Set(allCards)]
            .filter(card => card.offsetParent !== null)
            .sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                return (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
            });
    }

    function isNearBottom() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;

        // Проверяем, если до конца страницы осталось меньше 10% высоты экрана
        return (scrollHeight - scrollTop - viewportHeight) < (viewportHeight * 0.1);
    }

    function isInFooter() {
        // Проверяем, видим ли мы футер (подвал сайта)
        const footerSelectors = [
            'footer',
            '[class*="footer"]',
            '[class*="подвал"]',
            '.footer',
            '#footer'
        ];

        for (const selector of footerSelectors) {
            const footer = document.querySelector(selector);
            if (footer) {
                const rect = footer.getBoundingClientRect();
                // Если верх футера виден в области просмотра
                if (rect.top < window.innerHeight) {
                    return true;
                }
            }
        }
        return false;
    }

    function goToNextPage() {
        console.log('Пытаемся найти следующую страницу...');

        // 1. Ищем стандартную пагинацию Wildberries
        const paginationNext = document.querySelector('.pagination__next:not(.pagination__disabled)');
        if (paginationNext && paginationNext.href) {
            console.log('Найдена кнопка следующей страницы в пагинации');
            window.location.href = paginationNext.href;
            return true;
        }

        // 2. Ищем активную страницу и следующую за ней
        const activePage = document.querySelector('.pagination__item--active');
        if (activePage) {
            const nextPage = activePage.nextElementSibling;
            if (nextPage && nextPage.tagName === 'A' && nextPage.href) {
                console.log('Найдена следующая страница после активной');
                window.location.href = nextPage.href;
                return true;
            }
        }

        // 3. Ищем все ссылки пагинации
        const pageLinks = document.querySelectorAll('.pagination a, .page-number a, [class*="pagination"] a');
        for (const link of pageLinks) {
            const text = link.textContent.trim();
            // Ищем стрелку вправо или текст "Вперед"
            if (text === '→' || text === '>' || text.includes('Вперед') || text.includes('Next') || text.includes('Следующая')) {
                if (link.href) {
                    console.log('Найдена стрелка следующей страницы');
                    window.location.href = link.href;
                    return true;
                }
            }
        }

        // 4. Пытаемся определить текущую страницу из URL
        const currentUrl = window.location.href;
        let currentPage = 1;

        // Ищем page= в URL
        const pageMatch = currentUrl.match(/[?&]page=(\d+)/) || currentUrl.match(/[?&]p=(\d+)/);
        if (pageMatch) {
            currentPage = parseInt(pageMatch[1]);
            const nextPageUrl = currentUrl.replace(/([?&]page=)(\d+)/, `$1${currentPage + 1}`)
                                       .replace(/([?&]p=)(\d+)/, `$1${currentPage + 1}`);

            if (nextPageUrl !== currentUrl) {
                console.log('Сгенерирован URL следующей страницы');
                window.location.href = nextPageUrl;
                return true;
            }
        }

        console.log('Следующая страница не найдена');
        return false;
    }

    function findNextCard() {
        const cards = getCardElements();
        if (cards.length === 0) return null;

        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const viewportCenter = viewportHeight / 2;

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + (rect.height / 2);

            if (cardCenter > viewportCenter + 10) {
                const cardAbsoluteTop = rect.top + currentScroll;
                const targetScroll = cardAbsoluteTop - viewportCenter + (rect.height / 2);
                return targetScroll;
            }
        }

        return null;
    }

    function handleSpacebar(e) {
        if ((e.code === 'Space' || e.keyCode === 32) &&
            !document.activeElement.tagName.match(/^(INPUT|TEXTAREA)$/i) &&
            !document.activeElement.isContentEditable) {

            e.preventDefault();
            e.stopPropagation();

            // Если мы внизу страницы или в футере - переходим на следующую страницу
            if (isNearBottom() || isInFooter()) {
                console.log('Достигнут низ страницы, переходим на следующую...');
                goToNextPage();
                return false;
            }

            // Обычная прокрутка к следующей карточке
            const targetScroll = findNextCard();
            if (targetScroll !== null) {
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            } else {
                // Если не нашли карточку для прокрутки - переходим на след. страницу
                console.log('Карточки закончились, переходим на следующую страницу...');
                goToNextPage();
            }

            return false;
        }
    }

    // Добавляем визуальный индикатор при достижении низа
    function addBottomIndicator() {
        const style = document.createElement('style');
        style.textContent = `
            .wb-scroll-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b00, #ff8533);
                color: white;
                padding: 12px 18px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                display: none;
                box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);
                cursor: pointer;
                border: 2px solid #fff;
                animation: pulse 2s infinite;
            }
            .wb-scroll-indicator:hover {
                background: linear-gradient(135deg, #ff8533, #ff9c5c);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 107, 0, 0.5);
            }
            @keyframes pulse {
                0% { box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4); }
                50% { box-shadow: 0 4px 20px rgba(255, 107, 0, 0.6); }
                100% { box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4); }
            }
        `;
        document.head.appendChild(style);

        const indicator = document.createElement('div');
        indicator.className = 'wb-scroll-indicator';
        indicator.textContent = '🚀 ПРОБЕЛ - ПЕРЕХОД ДАЛЬШЕ →';
        indicator.onclick = goToNextPage;
        document.body.appendChild(indicator);

        // Показываем индикатор при достижении низа
        setInterval(() => {
            if (isNearBottom() || isInFooter()) {
                indicator.style.display = 'block';
            } else {
                indicator.style.display = 'none';
            }
        }, 300);
    }

    document.addEventListener('keydown', handleSpacebar, true);
    addBottomIndicator();
    console.log('Wildberries Space Scroll Fix v2.3 activated - Все карточки включены!');
})();