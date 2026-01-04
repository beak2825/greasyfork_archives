// ==UserScript==
// @name         CSStats.gg: Метка + Steam/Faceit + Предложить в базу (GitHub JSON + Google Form)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Проверяет Steam ID по JSON на GitHub, показывает причину, открывает Google Form для предложений (SPA-совместимость включена)
// @author       DØAM 유
// @match        https://csstats.gg/*
// @grant        none
// @license      MIT
// @supportURL   kirill@poprotsky.by
// @downloadURL https://update.greasyfork.org/scripts/555302/CSStatsgg%3A%20%D0%9C%D0%B5%D1%82%D0%BA%D0%B0%20%2B%20SteamFaceit%20%2B%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B8%D1%82%D1%8C%20%D0%B2%20%D0%B1%D0%B0%D0%B7%D1%83%20%28GitHub%20JSON%20%2B%20Google%20Form%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555302/CSStatsgg%3A%20%D0%9C%D0%B5%D1%82%D0%BA%D0%B0%20%2B%20SteamFaceit%20%2B%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B8%D1%82%D1%8C%20%D0%B2%20%D0%B1%D0%B0%D0%B7%D1%83%20%28GitHub%20JSON%20%2B%20Google%20Form%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const suspiciousSourceURL = 'https://raw.githubusercontent.com/doam90-bit/suspect.github.io/refs/heads/main/suspicious.json';
    const googleFormURL = 'https://forms.gle/pMf68Zxe5heAwZay6';
    const preferredLocale = 'ru-RU';
    let suspiciousEntries = [];

    const enforceRussianLocaleInURL = () => {
        const pathParts = window.location.pathname.split('/');
        const currentLocale = pathParts[1];
        if (currentLocale !== preferredLocale) {
            const newPathParts = [...pathParts];
            if (['en-US', 'ru-RU'].includes(currentLocale)) {
                newPathParts[1] = preferredLocale;
            } else {
                newPathParts.splice(1, 0, preferredLocale);
            }
            const newPath = newPathParts.join('/');
            const newUrl = `${window.location.origin}${newPath}${window.location.search}`;
            window.location.replace(newUrl);
        }
    };

    const fetchSuspiciousList = async () => {
        try {
            const res = await fetch(suspiciousSourceURL);
            if (res.ok) {
                const data = await res.json();
                suspiciousEntries = Array.isArray(data) ? data : [];
                runEnhancements();
            }
        } catch (err) {
            console.warn('Не удалось загрузить список подозрительных Steam ID:', err);
        }
    };

    const getSteamIdFromURL = () => {
        const match = location.pathname.match(/\/player\/(\d+)/);
        return match ? match[1] : null;
    };

    const isPlayerProfilePage = () => location.pathname.includes('/player/');

    const enhancePlayerInfoBlock = () => {
        const steamId = getSteamIdFromURL();
        if (!steamId) return;

        const interval = setInterval(() => {
            const infoBlock = document.querySelector('#player-info');
            const nameBlock = document.querySelector('#player-name');
            if (!infoBlock || !nameBlock || infoBlock.querySelector('.csstats-status')) return;

            const status = document.createElement('div');
            status.className = 'csstats-status';
            status.style = 'margin-top:8px; display:flex; gap:12px; align-items:center; font-size:13px; flex-wrap:wrap;';

            const label = document.createElement('span');
            label.style = 'font-weight:bold;';
            const entry = suspiciousEntries.find(e => e.steamId === steamId);
            if (entry) {
                label.innerHTML = `⚠️ Есть в базе подозрительных.<br><span style="font-weight:normal;">Причина: ${entry.reason}</span>`;
                label.style.color = 'red';
            } else {
                label.textContent = '✅ Нет в базе подозрительных';
                label.style.color = 'green';
            }

            const btnSteam = document.createElement('a');
            btnSteam.href = `https://steamcommunity.com/profiles/${steamId}`;
            btnSteam.target = '_blank';
            btnSteam.textContent = 'Steam';
            btnSteam.style = 'text-decoration:none; background:#1b2838; color:#fff; padding:4px 6px; border-radius:4px; font-size:12px;';

            const btnFaceit = document.createElement('a');
            btnFaceit.href = `https://faceitanalyser.com/player?id=${steamId}`;
            btnFaceit.target = '_blank';
            btnFaceit.textContent = 'Faceit';
            btnFaceit.style = 'text-decoration:none; background:#f50; color:#fff; padding:4px 6px; border-radius:4px; font-size:12px;';

            status.appendChild(label);
            status.appendChild(btnSteam);
            status.appendChild(btnFaceit);

            if (!entry) {
                const suggestBtn = document.createElement('button');
                suggestBtn.textContent = 'Предложить в базу';
                suggestBtn.style = 'background:#444; color:#fff; padding:4px 6px; border:none; border-radius:4px; font-size:12px; cursor:pointer;';
                suggestBtn.onclick = () => {
                    window.open(googleFormURL, '_blank');
                };
                status.appendChild(suggestBtn);
            }

            infoBlock.appendChild(status);
            clearInterval(interval);
        }, 500);
    };

    const runEnhancements = () => {
        if (isPlayerProfilePage()) {
            enhancePlayerInfoBlock();
        }
    };

    const observer = new MutationObserver(() => {
        runEnhancements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    enforceRussianLocaleInURL();
    fetchSuspiciousList();
})();