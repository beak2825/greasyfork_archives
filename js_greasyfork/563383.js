// ==UserScript==
// @name         Кнопки навигации в плеере AnimeLib
// @namespace    animelib-ep-nav
// @version      1.2.0
// @author       Milihraim 
// @description  Кнопки навигации и горячие клавиши для перехода между сериями.
// @match        http*://*.animelib.org/*
// @match        http*://*animelib.me/*
// @match        http*://*animelib*/*
// @match        http*://anilib*/*
// @icon         https://v3.animelib.org/static/images/logo/al/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @inject-into  content
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563383/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%BF%D0%BB%D0%B5%D0%B5%D1%80%D0%B5%20AnimeLib.user.js
// @updateURL https://update.greasyfork.org/scripts/563383/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%BF%D0%BB%D0%B5%D0%B5%D1%80%D0%B5%20AnimeLib.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        color: '#b388ff',
        btnClass: 'custom-nav-btn',
        anchor: '.z6_bv.mz_et'
    };

    const NAV_ICON = `<svg viewBox="0 0 512 512" style="width:21px;height:21px"><path d="M120,95.4c-20.3-11.8-46,2.8-46,26.3v268.6c0,23.5,25.7,38.1,46,26.3l210.3-134.3c20.1-11.7,20.1-40.8,0-52.5L120,95.4z" fill="currentColor"/><path d="M390,80c-19.1,0-35,15.9-35,35v282c0,19.1,15.9,35,35,35s35-15.9,35-35V115C425,95.9,409.1,80,390,80z" fill="currentColor"/></svg>`;

    const style = document.createElement('style');
    style.textContent = `
        #animelib-ep-nav { display: flex; align-items: center; margin-right: 10px; gap: 4px; }
        .${CONFIG.btnClass} { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #e5e5e5; transition: color .2s, transform .1s; user-select: none; }
        .${CONFIG.btnClass}:hover { color: ${CONFIG.color} !important; }
        .${CONFIG.btnClass}:active { transform: scale(.9); }
        .${CONFIG.btnClass}.prev { transform: rotate(180deg); }
        .${CONFIG.btnClass}.prev:active { transform: rotate(180deg) scale(.9); }
        [id^="episode_"].current-episode { outline: 2px solid ${CONFIG.color} !important; outline-offset: -2px; }
    `;
    document.head.append(style);

    let episodeIds = [];
    let lastUrl = location.href;

    const getEpId = () => new URL(location.href).searchParams.get('episode') || location.pathname.match(/episode\/(\d+)/)?.[1];

    const updateEpisodeIds = () => {
        const nodes = document.querySelectorAll('[id^="episode_"]');
        if (nodes.length === 0) return false;
        episodeIds = Array.from(nodes).map(el => el.id.replace('episode_', ''));
        return true;
    };

    const highlightCurrentEpisode = () => {
        document.querySelectorAll('.current-episode').forEach(el => el.classList.remove('current-episode'));
        const id = getEpId();
        if (id) {
            const el = document.getElementById(`episode_${id}`);
            if (el) el.classList.add('current-episode');
        }
    };

    const navigate = (step) => {
        updateEpisodeIds();
        const currentId = getEpId();
        const index = episodeIds.indexOf(currentId);
        const targetId = episodeIds[index + step];

        if (targetId) {
            const url = new URL(location.href);
            if (url.searchParams.has('episode')) {
                url.searchParams.set('episode', targetId);
            } else {
                url.pathname = url.pathname.replace(/episode\/\d+/, `episode/${targetId}`);
            }

            history.pushState({}, '', url);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    function injectButtons() {
        if (document.getElementById('animelib-ep-nav')) return;

        const anchor = document.querySelector(CONFIG.anchor) || document.querySelector('.fa-angles-right')?.closest('div');
        if (!anchor) return;

        const nav = document.createElement('div');
        nav.id = 'animelib-ep-nav';

        const btnPrev = document.createElement('div');
        btnPrev.className = `${CONFIG.btnClass} prev`;
        btnPrev.title = 'Предыдущая серия (P)';
        btnPrev.innerHTML = NAV_ICON;
        btnPrev.onclick = () => navigate(-1);

        const btnNext = document.createElement('div');
        btnNext.className = CONFIG.btnClass;
        btnNext.title = 'Следующая серия (N)';
        btnNext.innerHTML = NAV_ICON;
        btnNext.onclick = () => navigate(1);

        nav.append(btnPrev, btnNext);
        anchor.after(nav);
    }

    const checkUrlChange = () => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            highlightCurrentEpisode();
            setTimeout(injectButtons, 500);
        }
    };

    const observer = new MutationObserver(() => {
        checkUrlChange();
        if (updateEpisodeIds()) {
            highlightCurrentEpisode();
            injectButtons();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Горячие клавиши
    document.addEventListener('keydown', e => {
        if (/input|textarea|select|contenteditable/i.test(document.activeElement.tagName)) return;
        const isShift = e.shiftKey;
        const key = e.key.toLowerCase();

        if ((key === 'p' || key === 'з' || (isShift && key === 'arrowleft'))) navigate(-1);
        if ((key === 'n' || key === 'т' || (isShift && key === 'arrowright'))) navigate(1);
    });
})();