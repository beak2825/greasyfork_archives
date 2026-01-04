// ==UserScript==
// @name         MRM Content Blocker
// @namespace    r.arvie
// @version      1.5
// @description  Blocks content in MyReadingManga
// @match        https://myreadingmanga.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555386/MRM%20Content%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/555386/MRM%20Content%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedClasses = GM_getValue('blockedClasses', []);
if (!blockedClasses.includes('tag-ai-generate')) {
    blockedClasses.push('tag-ai-generate');
    GM_setValue('blockedClasses', blockedClasses);
}
    function hideArticles() {
        document.querySelectorAll('article').forEach(article => {
            const articleClasses = article.className.split(/\s+/);
            if (articleClasses.some(cls => blockedClasses.includes(cls))) {
                article.style.display = 'none';
            } else {
                article.style.display = '';
            }
        });
    }

    hideArticles();

    const classSet = {
        tag: new Set(),
        lang: new Set(),
        genre: new Set(),
        artist: new Set()
    };

    document.querySelectorAll('article').forEach(article => {
        article.className.split(/\s+/).forEach(cls => {
            if (cls.startsWith('tag-')) classSet.tag.add(cls);
            else if (cls.startsWith('lang-')) classSet.lang.add(cls);
            else if (cls.startsWith('genre-')) classSet.genre.add(cls);
            else if (cls.startsWith('artist-')) classSet.artist.add(cls);
        });
    });


    const mergedTags = Array.from(new Set([...classSet.tag, ...blockedClasses.filter(c => c.startsWith('tag-'))])).sort();
    const mergedLangs = Array.from(new Set([...classSet.lang, ...blockedClasses.filter(c => c.startsWith('lang-'))])).sort();
    const mergedGenres = Array.from(new Set([...classSet.genre, ...blockedClasses.filter(c => c.startsWith('genre-'))])).sort();
    const mergedArtists = Array.from(new Set([...classSet.artist, ...blockedClasses.filter(c => c.startsWith('artist-'))])).sort();

    const footerText = Array.from(document.body.querySelectorAll('p, div'))
        .find(el => el.textContent.includes("MyReadingManga is free"));

    if (footerText) {
        const container = document.createElement('div');
        container.style.marginTop = "10px";
        container.style.fontSize = "12px";
        container.style.background = "#333";
        container.style.color = "#fff";
        container.style.padding = "8px";
        container.style.borderRadius = "5px";

        function createCategory(name, items) {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = "5px";

            const header = document.createElement('b');
            header.style.cursor = "pointer";
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.style.userSelect = "none";
            header.style.color = "#4da6ff";

            const icon = document.createElement('span');
            icon.textContent = "▶";
            icon.style.marginRight = "5px";
            header.appendChild(icon);
            header.appendChild(document.createTextNode(name));

            const list = document.createElement('div');
            list.style.marginTop = "3px";
            list.style.display = "none";

            items.forEach(item => {
                const label = document.createElement('label');
                label.style.display = "block";
                label.style.color = "#fff";
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = item;
                if (blockedClasses.includes(item)) checkbox.checked = true;

                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        if (!blockedClasses.includes(item)) blockedClasses.push(item);
                    } else {
                        blockedClasses = blockedClasses.filter(cls => cls !== item);
                    }
                    GM_setValue('blockedClasses', blockedClasses);
                    hideArticles();
                };

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + item));
                list.appendChild(label);
            });

            header.onclick = () => {
                if (list.style.display === "none") {
                    list.style.display = "block";
                    icon.textContent = "▼";
                } else {
                    list.style.display = "none";
                    icon.textContent = "▶";
                }
            };

            wrapper.appendChild(header);
            wrapper.appendChild(list);
            return wrapper;
        }

        const title = document.createElement('div');
        title.textContent = "MRM Content Blocker";
        title.style.fontWeight = "bold";
        title.style.fontSize = "14px";
        title.style.marginBottom = "8px";
        title.style.textAlign = "center";
        title.style.color = "#4da6ff";
        container.appendChild(title);

        container.appendChild(createCategory("Genres", mergedGenres));
        container.appendChild(createCategory("Languages", mergedLangs));
        container.appendChild(createCategory("Tags", mergedTags));
        container.appendChild(createCategory("Artists", mergedArtists));

        footerText.appendChild(container);
    }

})();