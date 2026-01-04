// ==UserScript==
// @name            Tape Operator
// @namespace       tape-operator
// @author          Maesta_Nequitia
// @description     Watch movies on IMDB, TMDB, Kinopoisk and Letterboxd with custom button!
// @version         3.3.2
// @icon            https://github.com/Kirlovon/Tape-Operator/raw/main/assets/favicon.png
// @run-at          document-idle
// @grant           GM.info
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.openInTab
// @grant           GM.deleteValue
// @match           *://www.kinopoisk.ru/*
// @match           *://hd.kinopoisk.ru/*
// @match           *://tapeop.dev/*
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/549380/Tape%20Operator.user.js
// @updateURL https://update.greasyfork.org/scripts/549380/Tape%20Operator.meta.js
// ==/UserScript==

(function () {
    const VERSION = GM.info?.script?.version;
    const PLAYER_URL = 'https://tapeop.dev/';
    const BANNER_ID = 'tape-operator-banner';

    const KINOPOISK_MATCHER = /kinopoisk\.ru\/(film|series)\/.*/;
    const IMDB_MATCHER = /imdb\.com\/title\/tt\.*/;
    const TMDB_MATCHER = /themoviedb\.org\/(movie|tv)\/.*/;
    const LETTERBOXD_MATCHER = /letterboxd\.com\/film\/.*/;
    const MATCHERS = [KINOPOISK_MATCHER, IMDB_MATCHER, TMDB_MATCHER, LETTERBOXD_MATCHER];

    const logger = {
        info: (...args) => console.info('[Tape Operator Script]', ...args),
        warn: (...args) => console.warn('[Tape Operator Script]', ...args),
        error: (...args) => console.error('[Tape Operator Script]', ...args),
    };

    let previousUrl = '/';

    function getCurrentURL() {
        return location.origin + location.pathname;
    }

    function extractTitle() {
        try {
            const titleElement = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]');
            if (!titleElement) return null;
            let title = titleElement.content.trim();
            if (!title || title.startsWith('Кинопоиск.')) return null;

            if (title.includes('— смотреть онлайн в хорошем качестве — Кинопоиск')) {
                return title.replace('— смотреть онлайн в хорошем качестве — Кинопоиск', '').trim();
            }
            if (title.includes('⭐')) {
                return title.split('⭐')[0].trim();
            }
            if (title.endsWith('- IMDb') && title.includes(')')) {
                const lastParenthesisIndex = title.lastIndexOf(')');
                return title.slice(0, lastParenthesisIndex + 1).trim();
            }
            return title;
        } catch (error) {
            return null;
        }
    }

    function extractMovieData() {
        const url = getCurrentURL();
        const title = extractTitle();
        if (!title) return null;

        if (url.match(KINOPOISK_MATCHER)) {
            if (url.includes('hd.kinopoisk.ru')) {
                try {
                    const element = document.getElementById('__NEXT_DATA__');
                    const jsonData = JSON.parse(element.innerText);
                    const apolloState = Object.values(jsonData?.props?.pageProps?.apolloState?.data || {});
                    const id = apolloState.find((item) => item?.__typename === 'TvSeries' || item?.__typename === 'Film')?.id;
                    if (!id) throw new Error('No ID found');
                    return { kinopoisk: id, title };
                } catch (error) {
                    console.error('Kinopoisk HD ID extraction failed', error);
                    return null;
                }
            }
            const id = url.split('/')[4];
            return { kinopoisk: id, title };
        }

        if (url.match(IMDB_MATCHER)) {
            const id = url.split('/')[4];
            return { imdb: id, title };
        }

        if (url.match(TMDB_MATCHER)) {
            const id = url.split('/')[4].split('-')[0];
            return { tmdb: id, title };
        }

        if (url.match(LETTERBOXD_MATCHER)) {
            const elementsArray = Array.from(document.querySelectorAll('a'));
            const imdbLink = elementsArray.find(link => link?.href?.match(IMDB_MATCHER));
            if (imdbLink) {
                const imdbId = imdbLink.href.split('/')[4];
                if (imdbId) return { imdb: imdbId, title };
            }
            const tmdbLink = elementsArray.find(link => link?.href?.match(TMDB_MATCHER));
            if (tmdbLink) {
                const tmdbId = tmdbLink.href.split('/')[4].split('-')[0];
                if (tmdbId) return { tmdb: tmdbId, title };
            }
            return null;
        }

        return null;
    }

    function updateBanner() {
        const url = getCurrentURL();
        if (url === previousUrl) return;

        const urlMatches = MATCHERS.some(matcher => url.match(matcher));
        if (!urlMatches) return removeBanner();

        const extractedTitle = extractTitle();
        if (!extractedTitle) return removeBanner();

        previousUrl = url;
        attachBanner();
    }

    function attachBanner() {
        if (document.getElementById(BANNER_ID)) return;

        const data = extractMovieData();
        if (!data) return;

        const filmTitle = data.title || 'Movie';

        const a = document.createElement('a');
        a.id = BANNER_ID;
        a.href = PLAYER_URL;
        a.target = '_blank';

        // --- Новый стиль кнопки, как в Quick Movie Search ---
        Object.assign(a.style, {
            position: 'fixed',
            top: '26px',
            left: '1240px',
            zIndex: '9999',
            cursor: 'pointer',
            width: '16px',
            height: '16px',
            display: 'inline-block',
        });

        const img = document.createElement('img');
        img.src = 'https://favicon.yandex.net/favicon/paramountplus.com';
        img.alt = filmTitle;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';

        a.appendChild(img);

        a.addEventListener('click', (event) => {
            event.preventDefault();
            openPlayer(false);
        });

        a.addEventListener('mousedown', (event) => {
            if (event.button === 1) { // средняя кнопка
                event.preventDefault();
                openPlayer(true);
            }
        });

        document.body.appendChild(a);
    }

    function removeBanner() {
        document.getElementById(BANNER_ID)?.remove();
    }

    async function openPlayer(loadInBackground = false) {
        const data = extractMovieData();
        if (!data) return logger.error('Failed to extract movie data');

        await GM.setValue('movie-data', data);
        logger.info('Opening player for movie', data);
        GM.openInTab(PLAYER_URL, loadInBackground);
    }

    async function initPlayer() {
        const data = await GM.getValue('movie-data', {});
        await GM.deleteValue('movie-data');
        if (!data || Object.keys(data).length === 0) return;

        const dataSerialized = JSON.stringify(JSON.stringify(data));
        const versionSerialized = JSON.stringify(VERSION);

        const scriptElement = document.createElement('script');
        scriptElement.innerHTML = `globalThis.init(JSON.parse(${dataSerialized}), ${versionSerialized});`;
        document.body.appendChild(scriptElement);

        logger.info('Injected movie data:', data);
    }

    async function initBanner() {
        const observer = new MutationObserver(updateBanner);
        observer.observe(document, { subtree: true, childList: true });
        updateBanner();
    }

    logger.info('Script executed');
    location.href.includes(PLAYER_URL) ? initPlayer() : initBanner();
})();
