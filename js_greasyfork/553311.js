// ==UserScript==
// @name         Сккритие ответов яффы насралвхату
// @namespace    http://tampermonkey.net/
// @version      0.0
// @author       Сергей Щукин
// @description  хуета какая та
// @match        https://*.otvet.life/*
// @match        https://*.otvet.live/*
// @match        http://185.158.155.9:8000/*
// @match        http://185.158.155.9/*
// @match        https://*.live-otvet.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553311/%D0%A1%D0%BA%D0%BA%D1%80%D0%B8%D1%82%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D1%8F%D1%84%D1%84%D1%8B%20%D0%BD%D0%B0%D1%81%D1%80%D0%B0%D0%BB%D0%B2%D1%85%D0%B0%D1%82%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/553311/%D0%A1%D0%BA%D0%BA%D1%80%D0%B8%D1%82%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D1%8F%D1%84%D1%84%D1%8B%20%D0%BD%D0%B0%D1%81%D1%80%D0%B0%D0%BB%D0%B2%D1%85%D0%B0%D1%82%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userLink = '/profile/id800000743/'; //1:20
    const userName = 'Яффа Носферату';

    function updateAnswerCount(block) {
        let parent = block.closest('div.AnvJL, div.FbiUg');
        if (!parent) return;

        let countDiv = parent.querySelector('div.FbiUg');
        if (countDiv) {
            let match = countDiv.textContent.match(/(\d+)/);
            if (match) {
                let count = parseInt(match[1], 10) - 1;
                count = count < 0 ? 0 : count;
                countDiv.textContent = `${count} ответ${count === 1 ? '' : 'ов'}`;
            }
        }
    }

    function checkAndHide(block) {
        if (!(block instanceof HTMLElement)) return;
        if (block.style.display === 'none') return;

        const links = block.querySelectorAll('a[href]');
        for (let link of links) {
            if (link.href.includes(userLink) && link.textContent.includes(userName)) {
                block.style.display = 'none';
                updateAnswerCount(block); // 1^24
                break;
            }
        }
    }


    document.querySelectorAll('div.de_vs').forEach(checkAndHide);


    const observer = new MutationObserver(mutations => { //30
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                if (node.classList.contains('de_vs')) checkAndHide(node);
                node.querySelectorAll && node.querySelectorAll('div.de_vs').forEach(checkAndHide);
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
