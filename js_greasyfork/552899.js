// ==UserScript==
// @name         Highlight no_calls tag
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Если у игрока есть тег no_calls — дублировать его сверху ярко-красным блоком.
// @author       a.golovin
// @match        https://admin.crimson.*.prd.maxbit.private/admin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552899/Highlight%20no_calls%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/552899/Highlight%20no_calls%20tag.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showNoCallsTag() {
        const tagEl = document.querySelector('.player-tag-no_calls');
        if (!tagEl) return;

        let pageTitle = document.getElementById('page_title');
        if (!pageTitle) return;


        if (document.getElementById('no-calls-badge')) return;

        let statusElement = document.createElement('div');
        statusElement.id = 'no-calls-badge';
        statusElement.textContent = tagEl.textContent;


        statusElement.style.padding = '8px 14px';
        statusElement.style.color = 'white';
        statusElement.style.display = 'inline-block';
        statusElement.style.marginLeft = '12px';
        statusElement.style.borderRadius = '6px';
        statusElement.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';
        statusElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.3)';
        statusElement.style.fontSize = '14px';
        statusElement.style.fontWeight = 'bold';
        statusElement.style.backgroundColor = '#7b2cbf';
        statusElement.style.backgroundImage = 'linear-gradient(to bottom, #9d4edd, #5a189a)';

        pageTitle.appendChild(statusElement);
    }


    showNoCallsTag();


    const observer = new MutationObserver(() => showNoCallsTag());
    observer.observe(document.body, { childList: true, subtree: true });
})();