// ==UserScript==
// @name         Free Watch kinopoisk
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет кнопку "Онлайн" с ссылкой на flcksbr для фильмов и сериалов на kinopoisk
// @author       antoxa-kms
// @match        *://www.kinopoisk.ru/*
// @match        *://kinopoisk.ru/*
// @match        *://flcksbr.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558615/Free%20Watch%20kinopoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/558615/Free%20Watch%20kinopoisk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Добавляем нужный margin для кнопки "Онлайн"
    const customStyle = document.createElement('style');
    customStyle.textContent = `
        .style_buttonPlus__2wkyd2 {
            color: #fff;
            background: var(--plus-main, linear-gradient(90deg, #ff5c4d 0, #eb469f 26.56%, #8341ef 75%, #3f68f9 100%));
            transition: background .2s ease,
            transform .2s ease;
            margin: 0 5px 0 0 !important;
        }
    `;
    document.head.appendChild(customStyle);

    /* -------------------------------- */
    /* 1. Kinopoisk.ru: кнопка "Онлайн" */
    /* -------------------------------- */
    if (window.location.hostname.includes('kinopoisk.ru')) {

     const containers = [
        '.styles_buttonsContainer__5GGuL',
        '.styles_buttonsContainer__Kcrch'
    ];

    function getGGpoiskUrl() {
        const currentUrl = window.location.href; 
        const match = currentUrl.match(/\/(film|series)\/(\d+)/);
        if (match) {
            const type = match[1]; 
            const id = match[2]; 
            return `https://www.ggpoisk.ru/${type}/${id}/`;
        }
        return null; 
    }

    function addButton() {
        const ggpoiskUrl = getGGpoiskUrl(); 
        if (!ggpoiskUrl) return; 
        containers.forEach(selector => {
            const container = document.querySelector(selector); 
            if (container && !container.dataset.watchButtonAdded) {
                const buttonHTML = `
<div class="styles_button__3MsZF">
  <div class="watch-online-button styles_containerRoot__gEBlA styles_containerWithShield__eJ3ox" data-tid="712957ef">
    <a class="style_button__Awsrq kinopoisk-watch-online-button styles_watchOnlineButton__VufaL style_buttonSize52__MBeHC style_buttonLight__C8cK7 style_withIconLeft__USlpL style_buttonPlus__2wkyd2"
       href="${ggpoiskUrl}"
       target="_blank"
       data-test-id="Watch">
      <span class="style_iconLeft__9qY8j" data-tid="53b4357d">
        <span class="styles_icon__UOJnq" data-tid="6cb8d12f"></span>
      </span>
      <span class="styles_defaultText__LTsoD" data-tid="6cb8d12f">Онлайн</span>
    </a>
  </div>
</div>`;
                container.insertAdjacentHTML('afterbegin', buttonHTML);
                container.dataset.watchButtonAdded = "true";
            }
        });
    }

    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList: true, subtree: true });
    addButton();
        }

    /* ---------------------------------------- */
    /* 2. flcksbr.top: CSS и удаление элементов */
    /* ---------------------------------------- */
    if (window.location.hostname.includes('flcksbr.top')) {

        const cssToAdd = `
        @media screen and (min-width: 901px) {
            .wrapper {
                width: 100% !important;
                height: 100% !important;
            }
        }`;

        const style = document.createElement("style");
        style.textContent = cssToAdd;
        document.head.appendChild(style);

        function removeElements() {
            const tgMain = document.querySelector('.tgMain');
            const tgClose = document.querySelector('#tgClose');

            if (tgMain) tgMain.remove();
            if (tgClose) tgClose.remove();
        }

        removeElements();

        const observerFlcksbr = new MutationObserver(removeElements);
        observerFlcksbr.observe(document.body, { childList: true, subtree: true });
    }

})();