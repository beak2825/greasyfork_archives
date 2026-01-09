// ==UserScript==
// @name         Безкоштовні коментарі до завдань для ZNO.OSVITA.UA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unlock explanations
// @match        *://zno.osvita.ua/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561911/%D0%91%D0%B5%D0%B7%D0%BA%D0%BE%D1%88%D1%82%D0%BE%D0%B2%D0%BD%D1%96%20%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%96%20%D0%B4%D0%BE%20%D0%B7%D0%B0%D0%B2%D0%B4%D0%B0%D0%BD%D1%8C%20%D0%B4%D0%BB%D1%8F%20ZNOOSVITAUA.user.js
// @updateURL https://update.greasyfork.org/scripts/561911/%D0%91%D0%B5%D0%B7%D0%BA%D0%BE%D1%88%D1%82%D0%BE%D0%B2%D0%BD%D1%96%20%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%96%20%D0%B4%D0%BE%20%D0%B7%D0%B0%D0%B2%D0%B4%D0%B0%D0%BD%D1%8C%20%D0%B4%D0%BB%D1%8F%20ZNOOSVITAUA.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function processButtons() {
        document.querySelectorAll('.q-btn.explan_open').forEach(oldBtn => {
            // to not proccess it two times
            if (oldBtn.dataset.replaced) return;

            const idMatch = oldBtn.id.match(/\d+/);
            if (!idMatch) return;

            const qId = idMatch[0];
            const explanation = document.getElementById(`commentar_${qId}`);
            if (!explanation) return;

            // creating new button
            const newBtn = document.createElement('span');
            newBtn.className = 'q-btn button-gray';
            newBtn.textContent = 'Показати пояснення';

            newBtn.style.cursor = 'pointer';

            newBtn.onclick = () => {
                explanation.style.display = '';
                explanation.removeAttribute('style');
                explanation.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };

            // now i change here button
            oldBtn.replaceWith(newBtn);
            oldBtn.dataset.replaced = '1';
        });
    }

    // initial launch
    processButtons();

    // якщо сайт довантажує питання динамічно
    const observer = new MutationObserver(processButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
