// ==UserScript==
// @name         Scroll to Anime Player
// @name:en      Scroll to Anime Player
// @namespace    animestars.org
// @version      0.2
// @description  Быстрый переход к аниме-плееру с кнопкой 👁
// @description:en  Quickly jump to the anime player with a 👁️ button️
// @author       ThinkForge-core
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @match        https://ass.astars.club/*
// @match        https://as2.asstars.tv/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550206/Scroll%20to%20Anime%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/550206/Scroll%20to%20Anime%20Player.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Только страницы где есть числа
    if (!/\d+/.test(location.pathname)) return;


    // Проверка наличия хэша (#...)
    const hasHash = location.hash && location.hash.length > 1;

    function getPlayer() {
        return document.querySelector('.pmovie__player.tabs-block')
            || document.getElementById('player')
            || document.getElementById('ibox');
    }

    function scrollToPlayer() {
        const player = getPlayer();
        if (player) {
            const yOffset = -10;
            const y = player.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            return true;
        }
        return false;
    }

    function createScrollButton() {
        if (document.getElementById('scrollToPlayerBtn')) return;

        const button = document.createElement('div');
        button.id = 'scrollToPlayerBtn';
        button.innerHTML = '👁️';
        button.style.position = 'fixed';
        button.style.left = '15px';
        button.style.bottom = '15px';
        button.style.zIndex = '9999';
        button.style.fontSize = '24px';
        button.style.cursor = 'pointer';
        button.style.background = 'rgba(0, 0, 0, 0.6)';
        button.style.color = 'white';
        button.style.borderRadius = '50%';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        button.style.transition = 'transform 0.2s, background 0.2s';
        button.title = 'Прокрутить к плееру';

        button.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(0, 0, 0, 0.8)';
        });
        button.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(0, 0, 0, 0.6)';
        });
        button.addEventListener('click', scrollToPlayer);

        document.body.appendChild(button);
    }

    createScrollButton();

    if (!hasHash) {
        let scrolled = false;

        // 1. Сразу
        scrolled = scrollToPlayer();

        // 2. Через 2 сек
        setTimeout(() => {
            if (!scrolled) scrolled = scrollToPlayer();
        }, 2000);

        // 3. Через 5 сек (и если не найдено — удаляем глаз)
        setTimeout(() => {
            if (!scrolled) scrolled = scrollToPlayer();
            if (!scrolled && !getPlayer()) {
                const btn = document.getElementById('scrollToPlayerBtn');
                if (btn) btn.remove();
            }
        }, 5000);
    }
})();