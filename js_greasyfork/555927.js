// ==UserScript==
// @name         Genre 404 FIX
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Дополняет список жанров
// @author       404FT
// @match        https://shikimori.one/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/555927/Genre%20404%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/555927/Genre%20404%20FIX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customGenres = {
        'Hentai': { ids: [12], ru: 'Хентай', en: 'Hentai' },
    };

    const API_BASE = 'https://shikimori.one/api/animes';
    const GENRES_UL = '.block .b-spoiler .genres_v2';
    const ENTRIES_CONTAINER = '.cc-entries';
    const POSTLOADER = '.b-postloader';
    const DELAY_BETWEEN_PAGES = 1000; // 1 сек

    const kindMap = {
        'tv': 'TV Сериал',
        'movie': 'Фильм',
        'ova': 'OVA',
        'ona': 'ONA',
        'special': 'Спецвыпуск',
        'tv_special': 'TV Спецвыпуск',
        'music': 'Клип',
        'pv': 'Проморолик',
        'cm': 'Реклама'
    };

    let currentPage = 1;
    let isLoading = false;
    let hasMorePages = true;
    let currentParams = null;

    // ------------------- UI -------------------
    function addCustomGenreCheckboxes() {
        const ul = document.querySelector(GENRES_UL);
        if (!ul || ul.querySelector('li[data-value="Hentai"]')) return;

        // Вставляем кастомные жанры после всех существующих li
        Object.entries(customGenres).forEach(([key, genre]) => {
            const li = document.createElement('li');
            li.setAttribute('data-field', 'genre');
            li.setAttribute('data-value', key);
            li.innerHTML = `
            <input autocomplete="off" type="checkbox">
            <span class="genre-en">${genre.en}</span>
            <span class="genre">${genre.ru}</span>
        `;
            ul.appendChild(li);
            li.querySelector('input').addEventListener('change', handleGenreChange);
        });

        // Разворачиваем спойлер, если он скрыт
        const spoiler = ul.closest('.b-spoiler');
        if (spoiler) {
            const label = spoiler.querySelector('label');
            const content = spoiler.querySelector('.content');
            if (label) label.style.display = 'none';
            if (content) content.style.display = 'inline';
        }
    }

    // ------------------- Обработка выбора жанров -------------------
    function handleGenreChange() {
        let selectedGenres = [];
        document.querySelectorAll(`${GENRES_UL} li[data-value]`).forEach(li => {
            const input = li.querySelector('input[type="checkbox"]');
            if (input?.checked) {
                const key = li.getAttribute('data-value');
                if (customGenres[key]) selectedGenres.push(customGenres[key]);
            }
        });

        clearEntries();

        if (selectedGenres.length === 0) {
            resetPagination();
            return;
        }

        const allIds = [...new Set(selectedGenres.flatMap(g => g.ids))];
        currentParams = new URLSearchParams({ limit: '50', order: 'ranked' });
        allIds.forEach(id => currentParams.append('genre', id));

        currentPage = 1;
        hasMorePages = true;

        fetchAllPages(currentParams);
    }

    // ------------------- Очистка и сброс -------------------
    function clearEntries() {
        const container = document.querySelector(ENTRIES_CONTAINER);
        if (container) container.innerHTML = '';
        const postloader = document.querySelector(POSTLOADER);
        if (postloader) {
            postloader.style.display = 'none';
            postloader.classList.add('collapsed');
        }
        resetPagination();
    }

    function resetPagination() {
        currentPage = 1;
        isLoading = false;
        hasMorePages = true;
        currentParams = null;
    }

    // ------------------- Загрузка всех страниц -------------------
    function fetchAllPages(params) {
        if (!params) return;

        isLoading = true;
        params.set('page', currentPage.toString());
        const url = `${API_BASE}?${params.toString()}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': navigator.userAgent,
                'Referer': window.location.href,
                'Accept': 'application/json',
                'Cookie': document.cookie
            },
            onload: function(response) {
                if (response.status !== 200) {
                    console.error('[CUSTOM GENRES] Ошибка:', response.status);
                    isLoading = false;
                    return;
                }

                let data;
                try { data = JSON.parse(response.responseText); }
                catch (e) { console.error('[CUSTOM GENRES] Parse error:', e); isLoading = false; return; }

                const container = document.querySelector(ENTRIES_CONTAINER);
                if (container && data.length > 0) {
                    data.forEach(anime => container.appendChild(createAnimeArticle(anime)));
                    currentPage++;
                    setTimeout(() => fetchAllPages(params), DELAY_BETWEEN_PAGES);
                } else {
                    hasMorePages = false;
                    isLoading = false;
                    updatePostloaderForScroll();
                }
            },
            onerror: function(err) { console.error('[CUSTOM GENRES] onerror:', err); isLoading = false; },
            ontimeout: function() { console.error('[CUSTOM GENRES] ontimeout'); isLoading = false; }
        });
    }

    // ------------------- Создание карточки аниме -------------------
    function createAnimeArticle(anime) {
        const baseUrl = 'https://shikimori.one';
        const posterOriginal = baseUrl + (anime.image?.original || '/assets/globals/missing_original.jpg');
        const posterPreview = baseUrl + (anime.image?.preview || `/system/animes/preview/${anime.id}.jpg`);
        const posterAlt = posterPreview.replace(/preview(.*)\.jpg$/, 'preview_alt$1.jpeg');
        const year = anime.aired_on ? new Date(anime.aired_on).getFullYear() : '';
        const kindRu = kindMap[anime.kind] || anime.kind;

        const article = document.createElement('article');
        article.className = `c-column b-catalog_entry c-anime entry-${anime.id}`;
        article.dataset.trackUserRate = `catalog_entry:anime:${anime.id}`;
        article.id = anime.id;
        article.setAttribute('itemscope', '');
        article.setAttribute('itemtype', 'http://schema.org/Movie');

        const aCover = document.createElement('a');
        aCover.className = 'cover anime-tooltip-processed';
        aCover.dataset.delay = '150';
        aCover.dataset.tooltipUrl = `${baseUrl}/animes/${anime.id}-${anime.url}/tooltip`;
        aCover.href = `${baseUrl}/animes/${anime.id}-${anime.url}`;

        const imageDecor = document.createElement('span'); imageDecor.className = 'image-decor';
        const imageCutter = document.createElement('span'); imageCutter.className = 'image-cutter';
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = `${posterPreview}.webp, ${posterPreview.replace('.jpg', '_2x.webp')} 2x`;
        source.type = 'image/webp';
        picture.appendChild(source);
        const img = document.createElement('img');
        img.alt = anime.russian || anime.name;
        img.src = posterAlt;
        img.srcset = `${posterAlt.replace('.jpeg', '_2x.jpeg')} 2x`;
        picture.appendChild(img);
        imageCutter.appendChild(picture);
        imageDecor.appendChild(imageCutter);
        aCover.appendChild(imageDecor);

        const titleSpan = document.createElement('span'); titleSpan.className = 'title left_aligned'; titleSpan.setAttribute('itemprop', 'name');
        const nameEn = document.createElement('span'); nameEn.className = 'name-en'; nameEn.textContent = anime.name;
        const nameRu = document.createElement('span'); nameRu.className = 'name-ru'; nameRu.textContent = anime.russian || '';
        titleSpan.appendChild(nameEn); titleSpan.appendChild(nameRu);
        aCover.appendChild(titleSpan);

        const misc = document.createElement('span'); misc.className = 'misc';
        const kindSpan = document.createElement('span'); kindSpan.textContent = kindRu;
        const yearSpan = document.createElement('span'); yearSpan.textContent = year;
        misc.appendChild(kindSpan); misc.appendChild(yearSpan);
        aCover.appendChild(misc);

        article.appendChild(aCover);

        const metaImage = document.createElement('meta'); metaImage.content = posterOriginal; metaImage.setAttribute('itemprop', 'image'); article.appendChild(metaImage);
        const metaThumb = document.createElement('meta'); metaThumb.content = posterOriginal.replace('/original/', '/x48/'); metaThumb.setAttribute('itemprop', 'thumbnailUrl'); article.appendChild(metaThumb);
        const metaDate = document.createElement('meta'); metaDate.content = anime.aired_on || ''; metaDate.setAttribute('itemprop', 'dateCreated'); article.appendChild(metaDate);

        return article;
    }

    // ------------------- Постлоадер -------------------
    function updatePostloaderForScroll() {
        const postloader = document.querySelector(POSTLOADER);
        if (!postloader) return;
        postloader.style.display = hasMorePages ? 'block' : 'none';
        postloader.classList.toggle('collapsed', !hasMorePages);
    }

    // ------------------- Init -------------------
    function init() {
        addCustomGenreCheckboxes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Observer для UI (динамическая подгрузка)
    new MutationObserver((mutations) => {
        let shouldInit = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector(GENRES_UL)) shouldInit = true;
                });
            }
        });
        if (shouldInit) setTimeout(init, 500);
    }).observe(document.body, { childList: true, subtree: true });

})();
