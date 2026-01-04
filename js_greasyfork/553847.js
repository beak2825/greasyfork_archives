// ==UserScript==
// @name         Скрыть посты с Психология или Юмор
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрывает div, если там есть текст "Психология" или "Юмор"
// @match        *://*.otvet.life/*
// @match        *://*.otvet.live/*
// @match        *://*.live-otvet.online/*
// @match        *://185.158.155.9:8000/*
// @match        *://185.158.155.9/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553847/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B%20%D1%81%20%D0%9F%D1%81%D0%B8%D1%85%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%20%D0%B8%D0%BB%D0%B8%20%D0%AE%D0%BC%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/553847/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B%20%D1%81%20%D0%9F%D1%81%D0%B8%D1%85%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%20%D0%B8%D0%BB%D0%B8%20%D0%AE%D0%BC%D0%BE%D1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePosts() {
        const posts = document.querySelectorAll('div.wjjeg');
        posts.forEach(post => {
            const text = post.textContent;
            if (text.includes("Психология") || text.includes("Юмор")) {
                post.style.display = 'none';
            }
        });
    }

    hidePosts();
    setInterval(hidePosts, 1000);
})();
