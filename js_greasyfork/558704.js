// ==UserScript==
// @name         YouTube reviews from Steam
// @name:en      YouTube reviews from Steam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопку обзоры и прохождение на YouTube
// @description:en Adds a reviews and walkthrough button on YouTube
// @author       antoxa-kms
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558704/YouTube%20reviews%20from%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/558704/YouTube%20reviews%20from%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // 1. Стиль
    // ========================================
    const css = `
        .sy-container {
            position: relative;
            float: right;
            margin: 0 8px;
        }
        .sy-container a {
            border-radius: 2px;
            border: 0;
            margin: 0 5px;
            padding: 1px 1px 1px 8px;
            display: inline-block;
            cursor: pointer;
            text-decoration: none !important;
            color: #fff !important;
            background: rgba(233,70,57,0.5);
            background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 20'><path d='M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z' fill='%23FFF'/><path d='M11.5 14.5L18.5 10L11.5 5.5V14.5Z' fill='%23F00'/></svg>");
            background-position: 8px center;
            background-repeat: no-repeat;
            background-size: 26px auto;
            transition: background-color 0.2s;
            font-weight: 500;
            font-family: "Motiva Sans", Arial, sans-serif;
        }
        .sy-container a:hover {
            background-color: rgba(233,70,57,0.8) !important;
        }
        .sy-container a span {
            padding: 0 12px 0 34px;
            text-align: center;
            font-size: 15px;
            line-height: 30px;
            border-radius: 3px;
            display: block;
            background: transparent;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ========================================
    // 2. Определение языка Steam
    // ========================================
    const isRussian = () => {
        const htmlLang = document.documentElement.getAttribute('lang') || '';
        return htmlLang.toLowerCase() === 'ru' || htmlLang.toLowerCase() === 'ru-ru';
    };

    // ========================================
    // 3. Наблюдатель
    // ========================================
    const observer = new MutationObserver(() => {
        const otherSiteInfo = document.querySelector('div.apphub_OtherSiteInfo');
        const appNameEl = document.querySelector('div.apphub_AppName');

        if (otherSiteInfo && appNameEl && !document.querySelector('.sy-container')) {

            let gameName = appNameEl.textContent.trim()
                .replace(/\s*(OST|Soundtrack|Demo|Демо|Edition|Bundle| - .*Edition| \(.+\)|:.*Edition).*$/gi, '')
                .trim();

            const encoded = encodeURIComponent(gameName);
            const ru = isRussian();

            const walkthroughText = ru ? 'Прохождение' : 'Walkthrough';
            const reviewText      = ru ? 'Обзор'       : 'Review';

            const walkthroughQuery = ru ? 'прохождение' : 'walkthrough';
            const reviewQuery      = ru ? 'обзор'       : 'review';

            const walkthroughLink = `https://www.youtube.com/results?search_query=${encoded}+${encodeURIComponent(walkthroughQuery)}`;
            const reviewLink      = `https://www.youtube.com/results?search_query=${encoded}+${encodeURIComponent(reviewQuery)}`;

            const container = document.createElement('div');
            container.className = 'sy-container';
            container.innerHTML = `
                <a target="_blank" href="${walkthroughLink}"><span>${walkthroughText}</span></a>
                <a target="_blank" href="${reviewLink}"><span>${reviewText}</span></a>
            `;

            otherSiteInfo.parentNode.insertBefore(container, otherSiteInfo.nextSibling);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);

})();