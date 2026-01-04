// ==UserScript==
// @name         StashDB Favorites
// @namespace    https://greasyfork.org/fr/users/1468290-payamarre
// @version      1.4
// @author       NoOne
// @description  Add a new favorite page with persistent syncable storage
// @match        https://stashdb.org/*
// @icon         https://cdn-icons-png.flaticon.com/512/4784/4784090.png
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/551882/StashDB%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/551882/StashDB%20Favorites.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FAVORITES_KEY = 'stash_favorites';
    const SUPER_KEY = 'stash_super_favorites';
    const SUPER_VISIBLE_KEY = 'stash_super_visible';
    const SORT_STATE_KEY = 'stash_sort_state';
    const TAG_COLORS_KEY = 'stash_tag_colors';

    let favoritesCache = JSON.parse(GM_getValue(FAVORITES_KEY, '[]'));
    let superCache = JSON.parse(GM_getValue(SUPER_KEY, '[]'));
    let tagColorsCache = JSON.parse(GM_getValue(TAG_COLORS_KEY, '{}'));

    const getFavorites = () => favoritesCache;

    const saveFavorites = favs => {
        favoritesCache = favs;
        GM_setValue(FAVORITES_KEY, JSON.stringify(favs));
        syncSuperWithFavorites();
    };

    const getSuper = () => superCache;

    const saveSuper = sup => {
        superCache = sup;
        GM_setValue(SUPER_KEY, JSON.stringify(sup));
    };

    const getSortState = () =>
        GM_getValue(SORT_STATE_KEY, 'none');

    const saveSortState = state =>
        GM_setValue(SORT_STATE_KEY, state);

    const getTagColors = () => tagColorsCache;

    const saveTagColors = colors => {
        tagColorsCache = colors;
        GM_setValue(TAG_COLORS_KEY, JSON.stringify(colors));
    };

    const isFavorited = url => getFavorites().some(f => f.url === url);
    const isSuper = url => getSuper().some(f => f.url === url);

    if (typeof GM_addValueChangeListener !== 'undefined') {
        GM_addValueChangeListener(FAVORITES_KEY, (name, oldVal, newVal, remote) => {
            if (remote) {
                favoritesCache = JSON.parse(newVal || '[]');
                if (location.pathname === '/favorites' && window.refreshFavorites) window.refreshFavorites();
            }
        });
        GM_addValueChangeListener(SUPER_KEY, (name, oldVal, newVal, remote) => {
            if (remote) {
                superCache = JSON.parse(newVal || '[]');
                if (location.pathname === '/favorites' && window.refreshFavorites) window.refreshFavorites();
            }
        });
    }

    const addFavorite = (url, title, image, date, duration, tags, performers) => {
        const favs = getFavorites();
        if (!favs.some(f => f.url === url)) {
            favs.push({ url, title, image, date, duration, tags, performers });
            saveFavorites(favs);
        }
    };

    const removeFavorite = url => {
        const favs = getFavorites().filter(f => f.url !== url);
        saveFavorites(favs);
    };

    const addSuper = fav => {
        const sup = getSuper();
        if (!sup.some(f => f.url === fav.url)) {
            saveSuper([...sup, Object.assign({}, fav)]);
        }
    };

    const removeSuper = url => {
        const sup = getSuper().filter(f => f.url !== url);
        saveSuper(sup);
    };

    function syncSuperWithFavorites() {
        const favs = getFavorites();
        const sup = getSuper();
        const updated = sup.map(s => favs.find(f => f.url === s.url) || null)
            .filter(Boolean);
        saveSuper(updated);
    }

    function randomColor() {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 20);
        const l = 45 + Math.floor(Math.random() * 10);
        return `hsl(${h} ${s}% ${l}%)`;
    }
    function insertSceneFavButton() {
        if (!location.pathname.startsWith('/scenes/')) return;

        const tryInsert = () => {
            const h3Span = document.querySelector('.card-header h3 span');
            if (!h3Span || document.getElementById('fav-btn-scene')) return false;

            const dateText = document.querySelector('.card-header h6')
                ?.textContent.trim().split('•').pop().trim() || '';
            const durationText = document.querySelector('.card-footer [title][class*="ms-3"] b')
                ?.textContent.trim() || '';
            const tags = Array.from(document.querySelectorAll('.scene-tags ul.scene-tag-list li a'))
                .map(a => a.textContent.trim());
            const performers = Array.from(document.querySelectorAll('.scene-performers a.scene-performer'))
                .filter(a => a.querySelector('svg title')?.textContent.trim() === 'Female')
                .map(a => ({
                    name: a.querySelector('span')?.textContent.trim() || a.textContent.trim(),
                    id: a.href.split('/').pop()
                }));

            if (isFavorited(location.href)) {
                const favs = getFavorites();
                const favIndex = favs.findIndex(f => f.url === location.href);
                if (favIndex !== -1 && (favs[favIndex].performers || []).length === 0) {
                    favs[favIndex].performers = performers;
                    saveFavorites(favs);
                }
            }

            const heartBtn = document.createElement('button');
            heartBtn.id = 'fav-btn-scene';
            Object.assign(heartBtn.style, {
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '0', margin: '0 10px 0 0', display: 'inline-flex',
                alignItems: 'center', fontSize: '1.2em', verticalAlign: 'middle'
            });

            const icon = document.createElement('i');
            const isFav = isFavorited(location.href);
            icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
            icon.style.color = '#ff4d4d';
            heartBtn.appendChild(icon);

            heartBtn.onclick = () => {
                const already = isFavorited(location.href);
                const title = h3Span.textContent.trim();
                const image = document.querySelector('.Image-image')?.src || '';
                if (already) {
                    removeFavorite(location.href);
                    icon.className = 'far fa-heart';
                } else {
                    addFavorite(location.href, title, image, dateText, durationText, tags, performers);
                    icon.className = 'fas fa-heart';
                }
            };

            h3Span.prepend(heartBtn);
            return true;
        };

        if (!tryInsert()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (tryInsert() || attempts > 20) clearInterval(interval);
            }, 300);
        }
    }

    function insertHeaderFavButton() {
        if (document.getElementById('fav-btn-header')) return;

        const tryInsert = () => {
            const navList = document.querySelector('.navbar-nav');
            if (!navList || document.getElementById('fav-btn-header')) return false;

            const navItem = document.createElement('li');
            navItem.className = 'nav-item';
            navItem.id = 'fav-btn-header';

            const favLink = document.createElement('a');
            favLink.className = 'nav-link';
            favLink.href = '/favorites';
            favLink.style.display = 'flex';
            favLink.style.alignItems = 'center';
            favLink.style.gap = '8px';
            favLink.innerHTML = '<i class="fas fa-heart" style="color:white; font-size:14px;"></i> Favorites';

            navItem.appendChild(favLink);
            navList.appendChild(navItem);
            return true;
        };

        if (!tryInsert()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (tryInsert() || attempts > 20) clearInterval(interval);
            }, 300);
        }
    }

    (function hookHistoryEvents() {
        const _push = history.pushState;
        const _replace = history.replaceState;

        history.pushState = function () {
            _push.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        history.replaceState = function () {
            _replace.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () =>
            window.dispatchEvent(new Event('locationchange'))
        );
        window.addEventListener('locationchange', () =>
            setTimeout(init, 150)
        );
    })();

    function insertFavicon() {
        const isFavPage = location.pathname === '/favorites';
        const color = isFavPage ? '%23ff4d4d' : 'white';
        const existing = document.getElementById('stash-fav-icon');
        const href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="${color}" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;

        if (existing) {
            if (existing.getAttribute('data-page') === (isFavPage ? 'fav' : 'stash')) return;
            existing.href = href;
            existing.setAttribute('data-page', isFavPage ? 'fav' : 'stash');
        } else {
            document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
            const favicon = document.createElement('link');
            favicon.id = 'stash-fav-icon';
            favicon.rel = 'icon';
            favicon.href = href;
            favicon.setAttribute('data-page', isFavPage ? 'fav' : 'stash');
            document.head.appendChild(favicon);
        }
    }

    function renderFavoritesPage() {
        const startTime = performance.now();
        if (location.pathname !== '/favorites') return;
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        document.title = 'StashDB Favorites';

        if (!document.getElementById('font-awesome-css')) {
            const link = document.createElement('link');
            link.id = 'font-awesome-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }

        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-color: #202b33;
                --card-bg: #17171b;
                --text-color: #f9f9f9;
                --accent-blue: #0063e5;
                --header-z: 1000;
            }
            body { 
                background-color: var(--bg-color); 
                color: var(--text-color); 
                margin: 0; 
                padding: 0; 
                font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                min-height: 100vh;
                overflow-x: hidden;
            }
            .navbar {
                position: fixed;
                top: 0; left: 0; right: 0;
                height: 80px;
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
                z-index: var(--header-z);
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                padding: 0 36px;
                transition: background 0.3s;
            }
            .nav-pill {
                display: flex;
                align-items: center;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 6px;
                border-radius: 50px;
                gap: 5px;
            }
            .nav-item {
                padding: 10px 18px;
                color: #ccc;
                font-weight: 600;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 1.1px;
                transition: all 0.3s ease;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .nav-item:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
            .nav-item.active {
                background: #ffffff;
                color: #000000;
            }
            .nav-search {
                display: flex;
                align-items: center;
                padding: 0 12px;
                border-radius: 25px;
                height: 36px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                background: transparent;
            }
            .nav-search:hover, .nav-search:focus-within { background: rgba(255, 255, 255, 0.1); }
            .nav-search i { font-size: 16px; color: #ccc; transition: all 0.3s ease; }
            .nav-search i.fa-times { color: #fff; }
            .nav-search i.fa-times:hover { color: #ccc; transform: scale(1.1); }
            .search-input {
                background: transparent;
                border: none;
                color: white;
                width: 0;
                font-size: 14px;
                font-weight: 600;
                outline: none;
                padding: 0;
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .nav-search:focus-within i { color: #fff; }
            .nav-search:focus-within .search-input, .nav-search.has-content .search-input {
                width: 160px;
                padding-left: 10px;
            }

            .skeleton {
                background-color: #1a2228;
                background-image: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0) 100%
                );
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 12px;
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .skeleton-card {
                aspect-ratio: 16/11;
                width: 100%;
            }
            
            .navbar-actions {
                display: flex;
                gap: 10px;
                position: absolute;
                right: 40px;
            }
            .action-btn {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #ccc;
                min-width: 40px;
                height: 40px;
                padding: 0 16px;
                border-radius: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 13px;
                font-weight: 600;
                overflow: hidden;
                white-space: nowrap;
            }
            .action-btn:hover { background: rgba(255, 255, 255, 0.2); color: #fff; transform: scale(1.05); }
            .action-btn span { 
                transition: opacity 0.4s ease, max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                display: inline-block;
                max-width: 100px;
                opacity: 1;
            }
            .action-btn.clicked { min-width: 40px; width: 40px; padding: 0; gap: 0; }
            .action-btn.clicked span { max-width: 0; opacity: 0; margin: 0; transition: opacity 0.15s ease, max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
            .action-btn i { transition: transform 0.3s ease; }
            .action-btn.clicked i { transform: scale(1.1); color: #fff; }
            .fa-spin { animation: fa-spin 2s infinite linear; }
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(359deg); }
            }

            .hero-area {
                padding-top: 10vh;
                width: 100%;
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
                perspective: 1000px;
                display: none;
            }
            .hero-carousel {
                position: relative;
                width: 95vw;
                aspect-ratio: 16/6;
                border-radius: 20px;
                box-shadow: 0 40px 60px -20px rgba(0,0,0,0.5);
            }
            .carousel-slide {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                opacity: 0;
                transition: opacity 0.8s ease-in-out;
                border-radius: 20px;
                overflow: hidden;
                pointer-events: none;
            }
            .carousel-slide.active {
                opacity: 1;
                pointer-events: auto;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .carousel-slide img.bg-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .carousel-overlay {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle, transparent 30%, rgba(32, 43, 51, 0.8) 70%, rgba(32, 43, 51, 1) 100%);
            }
            .carousel-content {
                position: absolute;
                bottom: 40px; left: 60px;
                z-index: 10;
                max-width: 50%;
                opacity: 0;
                transition: opacity 0.8s 0.2s;
            }
            .carousel-slide.active .carousel-content {
                opacity: 1;
            }
            .carousel-title {
                font-size: 2rem;
                font-weight: 800;
                margin-bottom: 10px;
                line-height: 1.1;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .carousel-meta {
                display: flex;
                gap: 5px;
                align-items: center;
                font-size: 1rem;
                color: #ccc;
                font-weight: 500;
            }
            
            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: white;
                width: 50px; height: 50px;
                border-radius: 50%;
                font-size: 30px;
                cursor: pointer;
                z-index: 20;
                opacity: 0.5;
                transition: all 0.3s;
                display: flex; align-items: center; justify-content: center;
                pointer-events: auto;
                text-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .carousel-arrow:hover { opacity: 1 !important; transform: translateY(-50%) scale(1.1); }
            .carousel-arrow:active { transform: translateY(-50%) scale(0.9); transition: transform 0.1s; }
            .arrow-left { left: 20px; }
            .arrow-right { right: 20px; }
            
            .carousel-dots {
                position: absolute;
                bottom: -40px;
                left: 0; right: 0;
                display: flex;
                justify-content: center;
                gap: 10px;
                z-index: 20;
            }
            .dot {
                width: 10px; height: 10px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }
            .dot.active {
                width: 40px;
                border-radius: 10px;
                background: rgba(255,255,255,0.2);
            }
            .dot.active::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                height: 100%;
                width: 0;
                background: white;
                border-radius: 10px;
                animation: progressBar 5s linear forwards;
            }
            @keyframes progressBar {
                from { width: 0%; }
                to { width: 100%; }
            }

            .main-container {
                padding: 75px 40px 50px;
                z-index: 5;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            .card {
                background: var(--card-bg);
                border-radius: 20px;
                overflow: hidden;
                position: relative;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                aspect-ratio: 16/9;
                cursor: pointer;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255,255,255,0.1);
                margin: 0;
            }
            .card:hover {
                transform: scale(1.04);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                border: 3px solid rgba(255,255,255,1);
                z-index: 10;
            }
            .card img.poster-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
            .card:hover img.poster-img { transform: scale(1.02); }

            .card-info {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                padding: 60px 15px 15px;
                background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%);
                display: flex;
                flex-direction: column;
                gap: 6px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
                z-index: 5;
            }
            .card:hover .card-info { opacity: 1; transform: translateY(0); }
            
            .card-title {
                color: #fff;
                font-weight: 700;
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            .card-meta {
                display: flex;
                justify-content: flex-start;
                gap: 2px;
                font-size: 11px;
                color: #bbb;
                font-weight: 500;
                align-items: center;
                overflow: hidden;
            }
            .performer-scroll {
                display: flex;
                flex: 1;
                overflow-x: auto;
                white-space: nowrap;
                gap: 4px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .duration-meta { margin-left: auto; flex-shrink: 0; }
            .performer-scroll::-webkit-scrollbar { display: none; }
            .performer-link { color: inherit; text-decoration: none; }
            .performer-link:hover { text-decoration: underline !important; }
            .sep { color: #666; margin: 0 2px; flex-shrink: 0; }
            .card-tags {
                display: flex;
                gap: 2px;
                overflow-x: auto;
                padding-bottom: 8px;
            }
            .card-tags::-webkit-scrollbar {
                height: 4px;
            }
            .card-tags::-webkit-scrollbar-track {
                background: transparent;
            }
            .card-tags::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
            }
            .tag {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                padding: 2px 5px;
                border-radius: 20px;
                font-size: 8px;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                transition: all 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }
            .tag:hover { background: rgba(255,255,255,0.15); border-color: #fff !important; }
            .tag-dot { width: 8px; height: 8px; border-radius: 50%; }

            .card-actions {
                position: absolute;
                top: 10px; right: 10px;
                display: flex;
                flex-direction: row;
                gap: 8px;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 20;
            }
            .card:hover .card-actions { opacity: 1; }
            .icon-btn {
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                width: 30px; height: 30px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                font-size: 18px;
                transition: all 0.2s;
                position: relative;
            }
            .icon-btn:hover { transform: scale(1.2); filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
            .icon-btn[data-action="delete"]:hover { color: #ff4d4d; filter: drop-shadow(0 0 5px rgba(255, 77, 77, 0.5)); }
            .icon-btn[data-action="super"]:hover { color: #FFD700; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
            .icon-btn.active { color: #FFD700; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6)); }

            .card.removing {
                opacity: 0;
                transform: scale(0.8);
                pointer-events: none;
            }

            @keyframes mirrorFlip {
                0% { transform: scale(1); }
                50% { transform: scaleX(-1) scale(1.2); }
                100% { transform: scale(1); }
            }
            .flip-anim { animation: mirrorFlip 0.5s ease-in-out; }

            .super-badge {
                position: absolute;
                top: 10px; left: 10px;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #000;
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 800;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                z-index: 2;
                letter-spacing: 0.5px;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .page-footer {
                padding: 40px;
                text-align: center;
                color: #555;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            .load-time { color: rgba(255,255,255,0.15); }
            .page-footer a { color: inherit; text-decoration: none; transition: color 0.3s; }
            .page-footer a:hover { color: #fff; text-decoration: underline; }
            .navbar-left {
                position: absolute;
                left: 40px;
                display: flex;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);

        document.body.innerHTML = `
            <nav class="navbar">
                <div class="navbar-left">
                    <button id="sync-btn" class="action-btn" title="Sync All Performers"><i class="fas fa-sync"></i> <span>Sync</span></button>
                </div>
                <div class="nav-pill">
                    <div id="btn-all" class="nav-item active"><i class="fas fa-layer-group"></i> All</div>
                    <div id="btn-super" class="nav-item"><i class="fas fa-star"></i> Superstar</div>
                    <div id="btn-sort" class="nav-item"><i class="fas fa-sort"></i> Sort: None</div>
                    <div class="nav-search" id="searchWrapper">
                        <i id="search-icon" class="fas fa-search"></i>
                        <input type="text" id="search-favs" class="search-input" placeholder="Search...">
                    </div>
                </div>
                <div class="navbar-actions">
                    <button id="import-btn" class="action-btn" title="Import"><i class="fas fa-file-import"></i> <span>Import</span></button>
                    <button id="export-btn" class="action-btn" title="Export"><i class="fas fa-file-export"></i> <span>Export</span></button>
                </div>
            </nav>
            <div id="hero-area" class="hero-area">
                 <div class="hero-carousel" id="hero-carousel">
                    <button class="carousel-arrow arrow-left" id="c-arrow-left"><i class="fas fa-chevron-left"></i></button>
                    <button class="carousel-arrow arrow-right" id="c-arrow-right"><i class="fas fa-chevron-right"></i></button>
                    <div id="carousel-slides"></div>
                    <div class="carousel-dots" id="carousel-dots"></div>
                 </div>
            </div>
            <div class="main-container">
                <div id="fav-grid" class="grid"></div>
            </div>
            <footer class="page-footer">
                <a href="https://greasyfork.org/en/scripts/551882-stashdb-favorites" target="_blank">STASHDB FAVORITES</a> <span class="load-time" id="load-time-val"></span>
            </footer>
            <div id="image-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:9999; justify-content:center; align-items:center;">
                <img id="overlay-img" style="max-width:90%; max-height:90%; border-radius:8px; box-shadow:0 0 50px rgba(0,0,0,0.7);">
            </div>
        `;

        let viewMode = 'all';
        let displayedCount = 24;
        let renderTimer;
        let isRendering = false;
        const PAGE_SIZE = 24;
        const grid = document.getElementById('fav-grid');
        const searchInput = document.getElementById('search-favs');
        const searchIcon = document.getElementById('search-icon');
        const searchWrapper = document.getElementById('searchWrapper');
        const overlay = document.getElementById('image-overlay');
        const overlayImg = document.getElementById('overlay-img');
        const heroArea = document.getElementById('hero-area');
        const syncBtn = document.getElementById('sync-btn');

        syncBtn.onclick = async () => {
            const favs = getFavorites();
            const toSync = favs.filter(f => !f.performers || f.performers.length === 0);
            if (toSync.length === 0) {
                alert('All scenes already have performer data!');
                return;
            }

            if (!confirm(`Sync performers for ${toSync.length} scenes? This may take a moment.`)) return;

            syncBtn.classList.add('clicked');
            const icon = syncBtn.querySelector('i');
            icon.className = 'fas fa-sync fa-spin';

            let count = 0;
            for (const fav of toSync) {
                try {
                    const match = fav.url.match(/\/scenes\/([a-f0-9-]{36})/);
                    const sceneId = match ? match[1] : null;
                    if (!sceneId) continue;

                    const resp = await fetch('/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: `query FindScene($id: ID!) {
                                findScene(id: $id) {
                                    performers {
                                        performer {
                                            id
                                            name
                                            gender
                                        }
                                    }
                                }
                            }`,
                            variables: { id: sceneId }
                        })
                    });

                    const json = await resp.json();
                    const performers = json.data?.findScene?.performers
                        ?.filter(p => p.performer?.gender === 'FEMALE')
                        .map(p => ({
                            name: p.performer.name,
                            id: p.performer.id
                        })) || [];

                    if (performers.length > 0) {
                        fav.performers = performers;
                        count++;
                    }
                } catch (e) {
                    console.error('Failed to sync', fav.url, e);
                }
            }

            saveFavorites(favs);
            icon.className = 'fas fa-sync';
            syncBtn.classList.remove('clicked');
            alert(`Synced ${count} scenes!`);
            render();
            initCarousel();
        };

        function updateSearchIcon() {
            if (searchInput.value.length > 0) {
                searchIcon.className = 'fas fa-times';
                searchWrapper.classList.add('has-content');
            } else {
                searchIcon.className = 'fas fa-search';
                searchWrapper.classList.remove('has-content');
            }
        }

        searchIcon.onclick = () => {
            if (searchIcon.classList.contains('fa-times')) {
                searchInput.value = '';
                updateSearchIcon();
                render();
            } else {
                searchInput.focus();
            }
        };

        overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };

        let currentSlide = 0;
        let slideInterval;
        let superFavs = [];

        function updateSortBtn() {
            const state = getSortState();
            let icon = 'fa-sort';
            let label = 'None';
            if (state === 'asc') { icon = 'fa-sort-up'; label = 'Oldest'; }
            else if (state === 'desc') { icon = 'fa-sort-down'; label = 'Newest'; }
            document.getElementById('btn-sort').innerHTML = `<i class="fas ${icon}"></i> Sort: ${label}`;
        }

        function getSearchScore(item, query) {
            const title = (item.title || '').toLowerCase();
            const performers = (item.performers || []).map(p => (typeof p === 'object' ? p.name : p).toLowerCase()).join(' ');
            query = query.toLowerCase();

            if (title === query || (performers && performers === query)) return 10000;
            if (title.startsWith(query) || (performers && performers.startsWith(query))) return 8000;
            if (title.includes(query) || (performers && performers.includes(query))) return 5000;

            const words = query.split(/\s+/).filter(w => w.length > 1);
            if (words.length > 0) {
                let score = 0;
                const combined = `${title} ${performers}`;
                if (combined.includes(words[0])) score += 2000;
                for (let i = 1; i < words.length; i++) {
                    if (combined.includes(words[i])) score += 500;
                }
                if (score > 0) return 1000 + score;
            }

            try {
                const fuzzy = query.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
                const regex = new RegExp(fuzzy, 'i');
                if (regex.test(title) || regex.test(performers)) return 100;
            } catch (e) { }

            return 0;
        }

        function getFilteredData() {
            let baseData = viewMode === 'super' ? getSuper() : getFavorites();
            let data = baseData.map((item, originalIndex) => ({ item, originalIndex }));
            const query = searchInput.value.trim().toLowerCase();

            if (query) {
                if (query.includes('tag:')) {
                    const tagTerms = query.match(/tag:"([^"]+)"|tag:([^\s]+)/g) || [];
                    const otherTerms = query.replace(/tag:"([^"]+)"|tag:([^\s]+)/g, '').trim();
                    const tags = tagTerms.map(t => t.startsWith('tag:"') ? t.slice(5, -1) : t.slice(4)).filter(Boolean).map(t => t.toLowerCase());

                    if (tags.length) {
                        data = data.filter(entry => tags.every(t => (entry.item.tags || []).some(ft => ft.toLowerCase() === t)));
                    }
                    if (otherTerms) {
                        data = data.map(entry => ({ ...entry, score: getSearchScore(entry.item, otherTerms) }))
                            .filter(entry => entry.score > 0)
                            .sort((a, b) => {
                                if (b.score !== a.score) return b.score - a.score;
                                return b.originalIndex - a.originalIndex;
                            });
                    } else {
                        data = data.sort((a, b) => b.originalIndex - a.originalIndex);
                    }
                } else {
                    data = data.map(entry => ({ ...entry, score: getSearchScore(entry.item, query) }))
                        .filter(entry => entry.score > 0)
                        .sort((a, b) => {
                            if (b.score !== a.score) return b.score - a.score;
                            return b.originalIndex - a.originalIndex;
                        });
                }
                return data.map(entry => entry.item);
            }

            const state = getSortState();
            if (state !== 'none') {
                baseData = baseData.slice().sort((a, b) => {
                    const da = new Date(a.date || 0).getTime();
                    const db = new Date(b.date || 0).getTime();
                    return state === 'asc' ? da - db : db - da;
                });
            } else {
                baseData = baseData.slice().reverse();
            }
            return baseData;
        }

        function createCard(fav) {
            const el = document.createElement('div');
            el.className = 'card';
            const isSup = isSuper(fav.url);

            let tagsHtml = '';
            if (fav.tags && fav.tags.length) {
                tagsHtml = '<div class="card-tags">' + fav.tags.map(t => {
                    const color = tagColorsCache[t] || randomColor();
                    if (!tagColorsCache[t]) { tagColorsCache[t] = color; saveTagColors(tagColorsCache); }
                    return `<span class="tag" data-tag="${t}" style="border-color:${color}"><span class="tag-dot" style="background:${color}"></span>${t}</span>`;
                }).join('') + '</div>';
            }

            el.innerHTML = `
                <img class="poster-img" src="${fav.image || ''}" loading="lazy">
                ${isSup ? '<div class="super-badge">SUPER</div>' : ''}
                <div class="card-actions">
                    <button class="icon-btn ${isSup ? 'active' : ''}" title="Toggle Super" data-action="super"><i class="fas fa-star"></i></button>
                    <button class="icon-btn" title="Delete" data-action="delete"><i class="fas fa-trash"></i></button>
                </div>
                <div class="card-info">
                    <div class="card-title">${fav.title}</div>
                     <div class="card-meta">
                        <span>${fav.date || ''}</span>
                        ${fav.performers && fav.performers.length ? `
                            <span class="sep">•</span>
                            <div class="performer-scroll">${fav.performers.map(p => {
                const name = typeof p === 'object' ? p.name : p;
                const id = typeof p === 'object' ? p.id : null;
                const url = id ? `https://stashdb.org/performers/${id}` : `https://stashdb.org/search/%22${encodeURIComponent(name)}%22`;
                return `<a href="${url}" target="_blank" class="performer-link" onclick="event.stopPropagation();">${name}</a>`;
            }).join('<span style="color:#666">,</span> ')}</div>` : ''}
                        <span class="duration-meta">${fav.duration || ''}</span>
                    </div>
                    ${tagsHtml}
                </div>
            `;

            el.onclick = (e) => {
                if (e.target.closest('.card-actions') || e.target.closest('.tag') || e.target.closest('.super-badge')) return;
                window.open(fav.url, '_blank');
            };

            const onBadgeClick = (e) => {
                e.stopPropagation();
                viewMode = 'super';
                document.getElementById('btn-super').classList.add('active');
                document.getElementById('btn-all').classList.remove('active');
                window.scrollTo(0, 0);
                render(false, true);
            };

            const badge = el.querySelector('.super-badge');
            if (badge) badge.onclick = onBadgeClick;

            el.querySelector('.card-actions').onclick = (e) => {
                e.stopPropagation();
                const btn = e.target.closest('button');
                if (!btn) return;
                const action = btn.dataset.action;

                if (action === 'super') {
                    btn.classList.remove('flip-anim');
                    void btn.offsetWidth;
                    btn.classList.add('flip-anim');
                    const isSup = isSuper(fav.url);
                    if (isSup) {
                        removeSuper(fav.url);
                        btn.classList.remove('active');
                        el.querySelector('.super-badge')?.remove();
                    } else {
                        addSuper(fav);
                        btn.classList.add('active');
                        if (!el.querySelector('.super-badge')) {
                            const badge = document.createElement('div');
                            badge.className = 'super-badge';
                            badge.textContent = 'SUPER';
                            badge.onclick = onBadgeClick;
                            el.prepend(badge);
                        }
                    }
                    setTimeout(() => {
                        btn.classList.remove('flip-anim');
                        if (viewMode === 'super' && isSup) {
                            el.classList.add('removing');
                            setTimeout(() => {
                                el.remove();
                                initCarousel();
                            }, 300);
                        } else if (viewMode === 'super' && !isSup) {
                            render();
                            initCarousel();
                        } else {
                            initCarousel();
                        }
                    }, 500);
                } else if (action === 'delete') {
                    if (confirm('Remove from favorites?')) {
                        el.classList.add('removing');
                        setTimeout(() => {
                            removeFavorite(fav.url);
                            el.remove();
                            initCarousel();
                        }, 300);
                    }
                }
            };

            el.querySelectorAll('.tag').forEach(tagEl => {
                tagEl.onclick = (e) => {
                    e.stopPropagation();
                    const t = tagEl.dataset.tag;
                    let val = searchInput.value.trim();
                    const tagStr = `tag:"${t}"`;

                    if (val.includes(tagStr)) {
                        const escaped = tagStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const re = new RegExp('(^|\\s)' + escaped + '(\\s|$)', 'g');
                        val = val.replace(re, ' ').trim();
                        searchInput.value = val;
                    } else {
                        searchInput.value = val ? val + ' ' + tagStr : tagStr;
                    }

                    if (searchInput.value.length > 0) searchWrapper.classList.add('has-content');
                    else searchWrapper.classList.remove('has-content');

                    updateSearchIcon();
                    displayedCount = PAGE_SIZE;
                    window.scrollTo(0, 0);
                    render(false, true);
                };
            });

            return el;
        }

        function render(append = false, showSkeletons = false) {
            if (isRendering && append) return;
            isRendering = true;
            clearTimeout(renderTimer);
            const data = getFilteredData();

            if (!append) {
                window.scrollTo(0, 0);
                if (showSkeletons) {
                    grid.innerHTML = '';
                    for (let i = 0; i < 9; i++) {
                        const skel = document.createElement('div');
                        skel.className = 'skeleton skeleton-card';
                        grid.appendChild(skel);
                    }
                    renderTimer = setTimeout(() => {
                        grid.innerHTML = '';
                        const subset = data.slice(0, displayedCount);
                        const frag = document.createDocumentFragment();
                        subset.forEach(item => frag.appendChild(createCard(item)));
                        grid.appendChild(frag);
                        window.scrollTo(0, 0);
                        grid.style.minHeight = '';
                        setTimeout(() => { isRendering = false; }, 100);
                    }, 300);
                } else {
                    const subset = data.slice(0, displayedCount);
                    grid.innerHTML = '';
                    const frag = document.createDocumentFragment();
                    subset.forEach(item => frag.appendChild(createCard(item)));
                    grid.appendChild(frag);
                    isRendering = false;
                }
            } else {
                const start = grid.children.length;
                const subset = data.slice(start, start + PAGE_SIZE);
                const frag = document.createDocumentFragment();
                subset.forEach(item => frag.appendChild(createCard(item)));
                grid.appendChild(frag);
                displayedCount = grid.children.length;
                isRendering = false;
            }
        }

        function initCarousel() {
            const prevUrl = superFavs[currentSlide]?.url;
            superFavs = getSuper().slice().reverse();
            if (superFavs.length === 0) {
                heroArea.style.display = 'none';
                return;
            }
            heroArea.style.display = 'flex';
            const slidesContainer = document.getElementById('carousel-slides');
            const dotsContainer = document.getElementById('carousel-dots');

            slidesContainer.innerHTML = superFavs.map((item, i) => `
                <div class="carousel-slide" data-index="${i}" onclick="window.open('${item.url}', '_blank')" style="cursor: pointer;">
                    <img class="bg-img" src="${item.image}">
                    <div class="carousel-overlay"></div>
                    <div class="carousel-content">
                        <div class="carousel-title">${item.title}</div>
                        <div class="carousel-meta">
                              ${item.date ? `<span>${item.date}</span>` : ''}
                              ${item.date && (item.performers?.length) ? '<span class="sep">•</span>' : ''}
                              ${item.performers && item.performers.length ? `
                                  <div class="performer-scroll">${item.performers.map(p => {
                const name = typeof p === 'object' ? p.name : p;
                const id = typeof p === 'object' ? p.id : null;
                const url = id ? `https://stashdb.org/performers/${id}` : `https://stashdb.org/search/%22${encodeURIComponent(name)}%22`;
                return `<a href="${url}" target="_blank" class="performer-link" onclick="event.stopPropagation();">${name}</a>`;
            }).join('<span style="color:#666">,</span> ')}</div>` : ''}
                              <span class="duration-meta">${item.duration || ''}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            dotsContainer.innerHTML = superFavs.map((_, i) => `
                <div class="dot" data-index="${i}"></div>
            `).join('');

            dotsContainer.querySelectorAll('.dot').forEach(dot => {
                dot.onclick = (e) => {
                    e.stopPropagation();
                    window.setSlide(parseInt(dot.dataset.index));
                };
            });
            const newIndex = superFavs.findIndex(f => f.url === prevUrl);
            currentSlide = newIndex >= 0 ? newIndex : 0;
            const slides = slidesContainer.querySelectorAll('.carousel-slide');
            const dots = dotsContainer.querySelectorAll('.dot');
            slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            resetTimer();
        }

        window.refreshFavorites = () => {
            render();
            initCarousel();
        };

        window.setSlide = function (index) {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.dot');
            if (!slides.length) return;
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;

            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            resetTimer();
        }

        function resetTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                window.setSlide(currentSlide + 1);
            }, 5000);

            const activeDot = document.querySelector('.dot.active');
            if (activeDot) {
                activeDot.classList.remove('active');
                void activeDot.offsetWidth;
                activeDot.classList.add('active');
            }
        }

        document.getElementById('c-arrow-left').onclick = () => window.setSlide(currentSlide - 1);
        document.getElementById('c-arrow-right').onclick = () => window.setSlide(currentSlide + 1);


        document.getElementById('btn-all').onclick = () => {
            viewMode = 'all';
            document.getElementById('btn-all').classList.add('active');
            document.getElementById('btn-super').classList.remove('active');
            render();
        };
        document.getElementById('btn-super').onclick = () => {
            viewMode = 'super';
            document.getElementById('btn-super').classList.add('active');
            document.getElementById('btn-all').classList.remove('active');
            render();
        };
        document.getElementById('btn-sort').onclick = () => {
            const state = getSortState();
            const next = state === 'none' ? 'asc' : state === 'asc' ? 'desc' : 'none';
            saveSortState(next);
            updateSortBtn();
            render();
        };

        document.addEventListener('keydown', (e) => {
            if (location.pathname !== '/favorites' || e.ctrlKey || e.altKey || e.metaKey) return;
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
                updateSearchIcon();
                render();
                return;
            }
            if (e.key.length !== 1 || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            searchInput.focus();
        });

        searchInput.oninput = () => {
            updateSearchIcon();
            displayedCount = PAGE_SIZE;
            window.scrollTo(0, 0);
            render(false, true);
        };

        window.onscroll = () => {
            if (isRendering) return;
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 600) {
                const total = getFilteredData().length;
                if (grid.children.length < total) {
                    render(true);
                }
            }
        };

        document.getElementById('export-btn').onclick = () => {
            const btn = document.getElementById('export-btn');
            const icon = btn.querySelector('i');
            btn.classList.add('clicked');
            icon.className = 'fas fa-check';
            const now = new Date();
            const name = `StashDB_Favorites_${now.toISOString().slice(0, 10)}.json`;
            const data = { favorites: getFavorites(), superFavorites: getSuper(), sortState: getSortState(), tagColors: getTagColors() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
            setTimeout(() => {
                btn.classList.remove('clicked');
                setTimeout(() => { icon.className = 'fas fa-file-export'; }, 300);
            }, 2500);
        };

        document.getElementById('import-btn').onclick = () => {
            const btn = document.getElementById('import-btn');
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                btn.classList.add('clicked');
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        const d = JSON.parse(ev.target.result);
                        if (d.favorites) saveFavorites(d.favorites);
                        if (d.superFavorites) saveSuper(d.superFavorites);
                        render();
                        initCarousel();
                    } catch { }
                    setTimeout(() => btn.classList.remove('clicked'), 1000);
                };
                reader.readAsText(file);
            };
            input.click();
        };

        updateSortBtn();
        render(false, true);
        initCarousel();

        const loadTime = (performance.now() - startTime).toFixed(0);
        const timeVal = document.getElementById('load-time-val');
        if (timeVal) timeVal.textContent = `• LOADED IN ${loadTime}MS`;
    }

    function init() {
        if (!document.getElementById('font-awesome-global')) {
            const link = document.createElement('link');
            link.id = 'font-awesome-global';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }
        insertFavicon();
        insertHeaderFavButton();
        insertSceneFavButton();
        if (location.pathname === '/favorites')
            renderFavoritesPage();
    }

    init();
})();
