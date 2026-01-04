// ==UserScript==
// @name         Shikimori Advanced Search (GraphQL)
// @version      1.0
// @description  Performs a simultaneous GraphQL search and prepends results to the search box.
// @match        https://shikimori.one/*
// @author       404FT
// @license      MIT
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1536826
// @downloadURL https://update.greasyfork.org/scripts/556769/Shikimori%20Advanced%20Search%20%28GraphQL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556769/Shikimori%20Advanced%20Search%20%28GraphQL%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        DEBUG_MODE: true,
        GRAPHQL_URL: '/api/graphql',
        DEBOUNCE_MS: 300
    };

    // --- STATE MANAGEMENT ---
    let cachedResultsHTML = '';
    let activeRequestController = null;

    // --- LOGGING ---
    const log = (...args) => console.log('[AdvSrch]', ...args);
    const debug = (...args) => CONFIG.DEBUG_MODE && console.log('[AdvSrch]', ...args);

    // --- DICTIONARIES (Localization) ---
    const KIND_MAP = {
      tv: "TV Сериал",
      movie: "Фильм",
      ova: "OVA",
      ona: "ONA",
      special: "Спецвыпуск",
      tv_special: "TV Спецвыпуск",
      music: "Клип",
      pv: "PV",
      cm: "CM",
      manga: "Манга",
      manhwa: "Манхва",
      manhua: "Маньхуа",
      novel: "Ранобэ",
      one_shot: "Ваншот",
      doujin: "Додзинси",
    };

    const STATUS_MAP = {
      released: "вышло",
      ongoing: "онгоинг",
      anons: "анонс",
      paused: "приостановлено",
      discontinued: "прекращено",
    };

    // For manga specifically, status text varies slightly in UI ("издано" vs "вышло")
    // but we will use a generic map or specific overrides in the builder.

    // --- GRAPHQL QUERIES ---

    const QUERIES = {
        anime: `query($search: String) {
            animes(search: $search, limit: 5, censored: false) {
                id name russian url kind status
                airedOn { year }
                studios { name }
                genres { id name russian }
                poster { miniUrl mainUrl }
            }
        }`,
        manga: `query($search: String) {
            mangas(search: $search, limit: 5, censored: false) {
                id name russian url kind status
                airedOn { year }
                publishers { name }
                genres { id name russian }
                poster { miniUrl mainUrl }
            }
        }`,
        ranobe: `query($search: String) {
            mangas(search: $search, limit: 5, censored: false, kind: "novel") {
                id name russian url kind status
                airedOn { year }
                publishers { name }
                genres { id name russian }
                poster { miniUrl mainUrl }
            }
        }`,
        character: `query($search: String) {
            characters(search: $search, limit: 5) {
                id name russian url
                poster { miniUrl mainUrl }
                isAnime isManga isRanobe
            }
        }`,
        person: `query($search: String) {
            people(search: $search, limit: 5) {
                id name russian url
                poster { miniUrl mainUrl }
                isSeyu isMangaka isProducer
            }
        }`
    };

    // --- FETCH HANDLER ---
    const fetchGraphQL = async (query, searchTerm) => {
        if (activeRequestController) activeRequestController.abort();
        activeRequestController = new AbortController();

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
            'X-Requested-With': 'XMLHttpRequest'
        };

        try {
            const response = await fetch(CONFIG.GRAPHQL_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    query: query,
                    variables: { search: searchTerm }
                }),
                signal: activeRequestController.signal
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            debug(json);
            return json.data;
        } catch (e) {
            if (e.name !== 'AbortError') console.error(e);
            return null;
        }
    };

    // --- HTML BUILDERS ---

    const buildAnimeHTML = (item) => {
        const titleRu = item.russian || item.name;
        const url = item.url;
        const kindLabel = KIND_MAP[item.kind] || item.kind;
        const year = item.airedOn?.year ? `${item.airedOn.year} год` : '';
        const studio = item.studios?.[0]?.name || '';
        const statusLabel = STATUS_MAP[item.status] || item.status;

        const genresHtml = (item.genres || []).slice(0, 3).map(g => `
            <div class="b-tag" data-href="https://shikimori.one/animes/genre/${g.id}-${g.name}">
                <span class="genre-en">${g.name}</span><span class="genre-ru">${g.russian}</span>
            </div>`).join('');

        let metaLine = `<div class="b-tag">${kindLabel}</div>`;
        if (year) metaLine += `<div class="b-tag">${year}</div>`;
        if (studio) metaLine += `<div class="b-anime_status_tag studio" data-text="${studio}" title="${studio}"></div>`;
        metaLine += `<div class="b-anime_status_tag released" data-text="${statusLabel}"></div>`;

        return `
        <a class="b-db_entry-variant-list_item" data-id="${item.id}" href="${url}" data-adv="true">
            <div class="image"><img src="${item.poster.miniUrl}" srcset="${item.poster.mainUrl} 2x" alt="${titleRu}"></div>
            <div class="info">
                <div class="name"><span class="b-link">${titleRu}<span class="b-separator inline">/</span>${item.name}</span></div>
                <div class="line"><div class="key">Тип:</div><div class="value">${metaLine}</div></div>
                <div class="line"><div class="key">Жанры:</div><div class="value">${genresHtml}</div></div>
            </div>
        </a>`;
    };

    const buildMangaHTML = (item) => {
        const titleRu = item.russian || item.name;
        const url = item.url;
        const kindLabel = KIND_MAP[item.kind] || 'Манга';
        const year = item.airedOn?.year ? `${item.airedOn.year} год` : '';
        const publisher = item.publishers?.[0]?.name || '';
        // Manga status text often differs in UI ("издано" instead of "вышло"), but we use standard map for simplicity or override
        const statusLabel = item.status === 'released' ? 'издано' : (STATUS_MAP[item.status] || item.status);

        const genresHtml = (item.genres || []).slice(0, 3).map(g => `
            <div class="b-tag" data-href="https://shikimori.one/mangas/genre/${g.id}-${g.name}">
                <span class="genre-en">${g.name}</span><span class="genre-ru">${g.russian}</span>
            </div>`).join('');

        let metaLine = `<div class="b-tag">${kindLabel}</div>`;
        if (year) metaLine += `<div class="b-tag">${year}</div>`;
        if (publisher) metaLine += `<div class="b-anime_status_tag studio" data-text="${publisher}" title="${publisher}"></div>`;
        metaLine += `<div class="b-anime_status_tag released" data-text="${statusLabel}"></div>`;

        return `
        <a class="b-db_entry-variant-list_item" data-id="${item.id}" href="${url}" data-adv="true">
            <div class="image"><img src="${item.poster.miniUrl}" srcset="${item.poster.mainUrl} 2x" alt="${titleRu}"></div>
            <div class="info">
                <div class="name"><span class="b-link">${titleRu}<span class="b-separator inline">/</span>${item.name}</span></div>
                <div class="line"><div class="key">Тип:</div><div class="value">${metaLine}</div></div>
                <div class="line"><div class="key">Жанры:</div><div class="value">${genresHtml}</div></div>
            </div>
        </a>`;
    };

    const buildCharacterHTML = (item) => {
        const titleRu = item.russian || item.name;
        const url = item.url;

        // Subtitle Logic
        const types = [];
        if (item.isAnime) types.push('аниме');
        if (item.isManga) types.push('манги');
        if (item.isRanobe) types.push('ранобэ');

        let subtitle = 'Персонаж';
        if (types.length > 0) {
            const joined = types.length > 1
                ? types.slice(0, -1).join(', ') + ' и ' + types.slice(-1)
                : types[0];
            subtitle += ` ${joined}`;
        }

        return `
        <a class="b-db_entry-variant-list_item" data-id="${item.id}" href="${url}" data-adv="true">
            <div class="image"><img src="${item.poster.miniUrl}" srcset="${item.poster.mainUrl} 2x" alt="${titleRu}"></div>
            <div class="info">
                <div class="name"><span class="b-link">${titleRu}<span class="b-separator inline">/</span>${item.name}</span></div>
                <div class="line"><div class="value"><div class="b-tag">${subtitle}</div></div></div>
            </div>
        </a>`;
    };

    const buildPersonHTML = (item) => {
        const titleRu = item.russian || item.name;
        const url = item.url;

        // Priority based Subtitle Logic (simplified based on UI examples)
        let subtitle = 'Участник проекта'; // Fallback
        if (item.isSeyu) subtitle = 'Сэйю';
        else if (item.isMangaka) subtitle = 'Автор манги';
        else if (item.isProducer) subtitle = 'Режиссёр/Продюсер'; // UI often says specific role, but we only have boolean

        return `
        <a class="b-db_entry-variant-list_item" data-id="${item.id}" href="${url}" data-adv="true">
            <div class="image"><img src="${item.poster.miniUrl}" srcset="${item.poster.mainUrl} 2x" alt="${titleRu}"></div>
            <div class="info">
                <div class="name"><span class="b-link">${titleRu}<span class="b-separator inline">/</span>${item.name}</span></div>
                <div class="line"><div class="value"><div class="b-tag">${subtitle}</div></div></div>
            </div>
        </a>`;
    };

    // --- MAIN SEARCH LOGIC ---

    const performSearch = async (container, input) => {
        const term = input.value.trim();
        if (!term) {
            cachedResultsHTML = '';
            renderResults(container);
            return;
        }

        // Determine Mode
        // Shikimori sets 'active' class on .search-mode div
        const modeEl = container.querySelector('.search-mode.active') || container.querySelector('.search-mode');
        let mode = modeEl ? modeEl.dataset.mode : 'anime';

        // Default to anime if mode logic fails, but try to detect based on global context if possible
        // The HTML provided shows data-mode="anime" etc. inside .inner div usually before search starts
        if (!['anime', 'manga', 'ranobe', 'character', 'person'].includes(mode)) {
            mode = 'anime';
        }

        debug(`Searching '${term}' in mode '${mode}'`);

        let query = QUERIES[mode];
        // Ranobe shares 'manga' structure usually but we have a dedicated query const
        if (mode === 'ranobe') query = QUERIES.ranobe;

        const data = await fetchGraphQL(query, term);

        if (data) {
            let items = [];
            if (data.animes) items = data.animes.map(buildAnimeHTML);
            else if (data.mangas) items = data.mangas.map(buildMangaHTML);
            else if (data.characters) items = data.characters.map(buildCharacterHTML);
            else if (data.people) items = data.people.map(buildPersonHTML);

            if (items.length > 0) {
                const resultsHtml = items.join('');
                // Header + Results + Separator
                cachedResultsHTML = `
                    <div class="adv-results-group">
                        <div class="adv-result-label" style="padding: 5px 10px; font-size: 0.8em; opacity: 0.6;">GraphQL Results:</div>
                        ${resultsHtml}
                    </div>
                    <div class="adv-separator" style="height: 15px; border-bottom: 1px dashed rgba(127,127,127,0.2); margin-bottom: 10px;"></div>
                `;
            } else {
                cachedResultsHTML = '';
            }
        }

        renderResults(container);
    };

    // --- DOM MANIPULATION ---

    const renderResults = (container) => {
        const wrapperId = 'adv-search-wrapper';
        let wrapper = container.querySelector(`#${wrapperId}`);

        // Check if the native "Search Categories" are visible.
        // If '.search-mode' elements exist, the user is NOT searching (or has cleared input/blurred), so hide or remove results.
        const isSearchModeActive = container.querySelector('.search-mode');

        if (!cachedResultsHTML || isSearchModeActive) {
            if (wrapper) wrapper.remove();
            return;
        }

        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = wrapperId;
            container.prepend(wrapper);
        } else {
            // If it exists, ensure it is the first child
            if (container.firstElementChild !== wrapper) {
                container.prepend(wrapper);
            }
        }
        
        // Only update innerHTML if it changed
        if (wrapper.innerHTML !== cachedResultsHTML) {
            wrapper.innerHTML = cachedResultsHTML;
        }
    };

    // --- INITIALIZATION & EVENTS ---

    let observerInstance = null;

    const attachSearchListener = (resultsInner, inputField) => {
        // Prevent attaching multiple listeners to the same element
        if (resultsInner.dataset.advAttached === 'true') return;
        resultsInner.dataset.advAttached = 'true';

        // 1. Input Listener (Debounced search)
        let debounceTimer;
        inputField.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(resultsInner, inputField);
            }, CONFIG.DEBOUNCE_MS);
        });

        // 2. Observer (Keeps results on top, removes them if Search Mode resets)
        const observer = new MutationObserver(() => {
            renderResults(resultsInner);
        });
        
        observer.observe(resultsInner, { childList: true });
    };

    const init = () => {
        // Disconnect previous observer to prevent duplicates/memory leaks
        if (observerInstance) {
            observerInstance.disconnect();
            observerInstance = null;
        }

        observerInstance = new MutationObserver(() => {
            const globalSearch = document.querySelector('.global-search');
            if (globalSearch) {
                const input = globalSearch.querySelector('input');
                const innerResults = globalSearch.querySelector('.search-results .inner');
                
                if (input && innerResults) {
                    attachSearchListener(innerResults, input);
                }
            }
        });

        if (document.body) {
            observerInstance.observe(document.body, { childList: true, subtree: true });
        }
        
        log("Initialized!");
    };

    // --- STARTUP ---
    // 1. Run immediately if page is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // 2. Re-run on Turbolinks navigation (Page change without refresh)
    document.addEventListener('turbolinks:load', init);
})();