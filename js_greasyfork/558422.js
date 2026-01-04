// ==UserScript==
// @name         Hoyts IMDb Button
// @namespace    https://tampermonkey.net/
// @version      3.2
// @description  Auto-resolves IMDb info on movie pages; uses two-click resolve on session-times.
// @match        https://www.hoyts.com.au/*
// @icon         https://www.imdb.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558422/Hoyts%20IMDb%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558422/Hoyts%20IMDb%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMDB_LOGO =
        'https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg';

    function fetchImdbData(title, callback) {
        const url = `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(title)}&limit=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { accept: 'application/json' },
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    callback(data?.titles?.[0] || null);
                } catch {
                    callback(null);
                }
            },
            onerror: () => callback(null)
        });
    }

    function createContainer() {
        const span = document.createElement('span');
        span.className = 'imdb-container';
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.marginLeft = '10px';
        return span;
    }

    function createRating(rating) {
        const span = document.createElement('span');
        span.textContent = rating ? rating.toFixed(1) : 'N/A';
        span.style.marginLeft = '6px';
        span.style.fontSize = '0.9em';
        span.style.color = '#f5c518';
        span.style.fontWeight = 'bold';
        return span;
    }

    function createImdbButtonBase() {
        const a = document.createElement('a');
        a.target = '_blank';
        a.style.width = '40px';
        a.style.height = '20px';
        a.style.backgroundImage = `url(${IMDB_LOGO})`;
        a.style.backgroundSize = 'contain';
        a.style.backgroundRepeat = 'no-repeat';
        a.style.display = 'inline-block';
        return a;
    }

    /* ===============================
       Auto-resolve (movie page)
       =============================== */
    function handleMoviePage() {
        const heading = document.querySelector('.hero__heading');
        if (!heading || heading.querySelector('.imdb-container')) return;

        const title = heading.textContent.trim();
        if (!title) return;

        const container = createContainer();
        const button = createImdbButtonBase();
        button.title = 'Loading IMDb info…';
        button.href = '#';

        container.appendChild(button);
        heading.appendChild(container);

        fetchImdbData(title, movie => {
            const imdbUrl = movie?.id
                ? `https://www.imdb.com/title/${movie.id}/`
                : `https://www.imdb.com/find/?q=${encodeURIComponent(title)}&s=tt&ttype=ft&ref_=fn_mov`;

            button.href = imdbUrl;
            button.title = 'View on IMDb';

            if (movie?.rating?.aggregateRating !== undefined) {
                container.appendChild(
                    createRating(movie.rating.aggregateRating)
                );
            }
        });
    }

    /* ===============================
       Two-click resolve (session-times)
       =============================== */
    function createSessionImdbButton(title, container) {
        let resolved = false;
        let imdbUrl = null;

        const searchUrl =
            `https://www.imdb.com/find/?q=${encodeURIComponent(title)}&s=tt&ttype=ft&ref_=fn_mov`;

        const a = createImdbButtonBase();
        a.href = '#';
        a.title = 'Resolve IMDb info';
        a.style.cursor = 'pointer';

        a.addEventListener('click', e => {
            e.preventDefault();

            if (resolved) {
                window.open(imdbUrl || searchUrl, '_blank');
                return;
            }

            fetchImdbData(title, movie => {
                if (movie?.id) {
                    imdbUrl = `https://www.imdb.com/title/${movie.id}/`;
                }

                if (movie?.rating?.aggregateRating !== undefined) {
                    container.appendChild(
                        createRating(movie.rating.aggregateRating)
                    );
                }

                resolved = true;
                a.title = 'Open on IMDb';
            });
        });

        return a;
    }

    function handleSessionTimesPage() {
        document.querySelectorAll('.movies-list__link').forEach(link => {
            if (link.parentElement.querySelector('.imdb-container')) return;

            const title = link.textContent.trim();
            if (!title) return;

            const container = createContainer();
            container.appendChild(
                createSessionImdbButton(title, container)
            );
            link.after(container);
        });
    }

    function run() {
        if (location.pathname.startsWith('/movies/')) {
            handleMoviePage();
        }

        if (location.pathname.startsWith('/session-times')) {
            handleSessionTimesPage();
        }
    }

    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });

    run();
})();
