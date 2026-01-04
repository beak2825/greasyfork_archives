// ==UserScript==         
// @name           (ROYTVS) Return old YouTube video sidelist
// @namespace      https://github.com/DmitrMarch/return-old-youtube-video-sidelist
// @version        0.3
// @description    Простой userscript для возвращения старого дизайна бокового списка с видео на YouTube
// @author         DmitrMarch
// @match          https://www.youtube.com/*
// @icon           https://www.youtube.com/s/desktop/9c0f82da/img/favicon.ico
// @grant          none
// @license        https://github.com/DmitrMarch/return-old-youtube-video-sidelist/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/556428/%28ROYTVS%29%20Return%20old%20YouTube%20video%20sidelist.user.js
// @updateURL https://update.greasyfork.org/scripts/556428/%28ROYTVS%29%20Return%20old%20YouTube%20video%20sidelist.meta.js
// ==/UserScript==

(() => {

    'use strict';

    /** селектор карточек видео из бокового списка (sidelist) */
    const CARD_SELECTOR_VERTICAL = '.yt-lockup-view-model--vertical';
    /** селектор карточек видео для главной страницы */
    const CARD_SELECTOR_HORIZONTAL = '.yt-lockup-view-model--horizontal';
    /** задержка в мс для применения изменений */
    const POLL_DELAY = 50;

    /** изменить ориентацию карточки на горизонтальную */
    function changeCard(card) {

        if (card.dataset.roytvsChanged) return;
        card.dataset.roytvsChanged = "1";

        const metadata = card.querySelector('.yt-lockup-metadata-view-model--vertical');
        const img = card.querySelector('.yt-lockup-view-model__content-image');

        if (metadata) {
            
            metadata.classList.remove('yt-lockup-metadata-view-model--vertical');
            metadata.classList.add('yt-lockup-metadata-view-model--horizontal');
        }

        if (img) {

            // сохраняем оригинальную ширину, чтобы можно было вернуть
            if (!img.dataset.origWidth) img.dataset.origWidth = img.style.width || '';
            img.style.width = "168px";
        }

        card.classList.remove('yt-lockup-view-model--vertical');
        card.classList.add('yt-lockup-view-model--horizontal');
    }

    /** вернуть карточке вертикальную ориентацию (только если её меняли ранее) */
    function revertCard(card) {

        if (!card.dataset.roytvsChanged) return;
        delete card.dataset.roytvsChanged;

        const metadataHor = card.querySelector('.yt-lockup-metadata-view-model--horizontal');
        const img = card.querySelector('.yt-lockup-view-model__content-image');

        if (metadataHor) {

            metadataHor.classList.remove('yt-lockup-metadata-view-model--horizontal');
            metadataHor.classList.add('yt-lockup-metadata-view-model--vertical');
        }

        if (img) {

            // вернуть сохранённую ширину (или пустую)
            img.style.width = img.dataset.origWidth || '';
            delete img.dataset.origWidth;
        }

        card.classList.remove('yt-lockup-view-model--horizontal');
        card.classList.add('yt-lockup-view-model--vertical');
    }

    /** изменить ориентацию загруженных карточек */
    function changeAll() {

        const cards = document.querySelectorAll(CARD_SELECTOR_VERTICAL);

        if (cards) {

            cards.forEach(changeCard);
            console.log("(ROYTVS): loaded sidelist cards have been changed");
        }
    }

    /** вернуть старую ориентацию загруженных карточек */
    function revertAll() {

        const cards = document.querySelectorAll(CARD_SELECTOR_HORIZONTAL);

        if (cards) {

            cards.forEach(revertCard);
            console.log("(ROYTVS): reverted sidelist cards to vertical");
        }
    }

    /** применить нужную ориентацию для карточек в зависимости от пути */
    function applyOrRevertBasedOnPath() {

        if (location.pathname.startsWith('/watch')) {

            changeAll();
        } 
        else {

            // если мы не на странице /watch, то вернуть
            revertAll();
        }
    }

    // перехват history API для обнаружения SPA-навигации
    (() => {

        const _pushState = history.pushState;
        const _replaceState = history.replaceState;

        history.pushState = () => {

            _pushState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        
        history.replaceState = () => {

            _replaceState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => {

            window.dispatchEvent(new Event('locationchange'));
        });
    })();

    // дать SPA время на загрузку DOM, а потом применить нужную ориентацию
    window.addEventListener('locationchange', () => {

        setTimeout(applyOrRevertBasedOnPath, POLL_DELAY);
    });

    /** наблюдатель для первой загрузки страницы с видео */
    const observer = new MutationObserver(() => {

        if (location.pathname.startsWith('/watch')) {

            changeAll();
        }
        else {

            // если мы не на странице /watch, то вернуть
            revertAll();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
