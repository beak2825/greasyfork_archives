// ==UserScript==
// @name         Shikimori → чистый block2
// @version      2.0
// @description  ---
// @match        https://shikimori.one
// @grant        none
// @author       Graf_NEET
// @run-at       document-idle
// @license      MIT
// @namespace https://greasyfork.org/users/1538944
// @downloadURL https://update.greasyfork.org/scripts/556711/Shikimori%20%E2%86%92%20%D1%87%D0%B8%D1%81%D1%82%D1%8B%D0%B9%20block2.user.js
// @updateURL https://update.greasyfork.org/scripts/556711/Shikimori%20%E2%86%92%20%D1%87%D0%B8%D1%81%D1%82%D1%8B%D0%B9%20block2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // HTML на замену
    const newContent = `
<div class="fc-user-sections">
  <div class="f-user" data-dynamic="postloaded" data-postloaded-url="/dashboards/dynamic"></div>
  <div class="f-sections">
    <div class="fc-headlines">
      <div class="f-headline"><div class="midheadline red linkheadline"><a href="/animes">Аниме</a></div></div>
      <div class="f-headline"><div class="midheadline blue linkheadline"><a href="/mangas">Манга</a></div></div>
      <div class="f-headline"><div class="midheadline green linkheadline"><a href="/ranobe">Ранобэ</a></div></div>
    </div>
    <div class="fc-tags">
      <div class="f-tags anime-tags"><div class="tags">
        <a class="tag-link anime-tag" href="/animes/season/winter_2026">Зима 2026</a>
        <a class="tag-link anime-tag" href="/animes/season/fall_2025">Осень 2025</a>
        <a class="tag-link anime-tag" href="/animes/season/2025">2025</a>
        <a class="tag-link anime-tag" href="/animes/season/2024">2024</a>
        <a class="tag-link anime-tag" href="/animes/status/ongoing">Онгоинги</a>
        <a class="tag-link anime-tag" href="/kakie-anime-postmotret">Избранное</a>
        <a class="tag-link anime-tag" href="/recommendations/anime">Рекомендации</a>
      </div></div>
      <div class="f-tags manga-tags"><div class="tags">
        <a class="tag-link manga-tag" href="/mangas/kind/manga">Манга</a>
        <a class="tag-link manga-tag" href="/mangas/kind/manhwa">Манхва</a>
        <a class="tag-link manga-tag" href="/mangas/kind/manhua">Маньхуа</a>
        <a class="tag-link manga-tag" href="/mangas/kind/one_shot">Ваншот</a>
        <a class="tag-link manga-tag" href="/mangas/kind/doujin">Додзинси</a>
        <a class="tag-link manga-tag" href="/kakuyu-mangu-pochitat">Избранное</a>
        <a class="tag-link manga-tag" href="/recommendations/manga">Рекомендации</a>
      </div></div>
      <div class="f-tags ranobe-tags"><div class="tags">
        <a class="tag-link ranobe-tag" href="/kakie-ranobe-pochitat">Избранное</a>
      </div><div class="forum-container"><a class="b-link_button dark arrow-right" href="/forum">Форум</a></div></div>
    </div>
  </div>
</div>`;

    // Логика замены
    const replace = () => {
        const block = document.querySelectorAll('div.block2')[1];
        if (!block || block.dataset.pure) return;

        const myList = block.querySelector('.my-list');
        block.innerHTML = newContent;

        // Вставляем my-list внутрь .f-user
        const fUser = block.querySelector('.f-user');
        if (fUser && myList) {
            fUser.appendChild(myList);
        }

        block.dataset.pure = 'true';
    };

    // Просто перезаписываем блок каждый раз, когда появляется .my-list (он же триггер полной загрузки дашборда)
    const observer = new MutationObserver(() => {
        if (document.querySelector('.my-list')) replace();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // На всякий случай сразу и при turbolinks
    ['DOMContentLoaded', 'turbolinks:load', 'load'].forEach(ev =>
        window.addEventListener(ev, () => setTimeout(replace, 300))
    );
})();