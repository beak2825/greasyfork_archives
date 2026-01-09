// ==UserScript==
// @name         Steam owned games Highlighter (GOG, INDIEGALA, CHEAPKEYS.OVH (table))
// @namespace    http://tampermonkey.net/
// @version      3.4.12
// @description  Owned у всех игр имеющихся на аккаунте Steam, протестированов на GOG, IDIEGALA, CHEAPKEYS.OVH, GAMESFORFARM (другие ресурсы не лез ибо регон-бан).
// @author       Baron_KartoFFeL
// @license      MIT
// @match        https://cheapkeys.ovh/*
// @match        https://cheapkeys.ovh/table.php
// @match        https://gamesforfarm.com/*
// @match        https://www.gog.com/*
// @match        https://www.indiegala.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.steampowered.com
// @connect      cheapkeys.ovh
// @downloadURL https://update.greasyfork.org/scripts/561754/Steam%20owned%20games%20Highlighter%20%28GOG%2C%20INDIEGALA%2C%20CHEAPKEYSOVH%20%28table%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561754/Steam%20owned%20games%20Highlighter%20%28GOG%2C%20INDIEGALA%2C%20CHEAPKEYSOVH%20%28table%29%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const CONFIG = {
        API_KEY: GM_getValue('steam_api_key', ''),
        STEAM_ID: GM_getValue('steam_id64', ''),
        DEBUG: GM_getValue('debug_mode', false)
    };
    const log = (...args) => CONFIG.DEBUG && console.log('[SH]', ...args);

    GM_registerMenuCommand('Настроить Steam API', showSettings);

    function showSettings() {
        const div = document.createElement('div');
        div.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);
            background:#1b2838;color:#c6d4df;padding:20px;border-radius:10px;
            box-shadow:0 0 20px rgba(0,0,0,.8);z-index:99999;font-family:Arial;
            min-width:420px;border:2px solid #66c0f4;`;
        div.innerHTML = `
            <h3 style="margin:0 0 15px;color:#66c0f4">Steam Highlighter – настройки</h3>
            <label>Steam API Key:<br><input id="api_key" type="password" style="width:100%;padding:8px;margin:5px 0;background:#2a475e;color:#fff;border:1px solid #66c0f4;" value="${CONFIG.API_KEY}"></label><br><br>
            <label>SteamID64:<br><input id="steam_id" type="text" style="width:100%;padding:8px;margin:5px 0;background:#2a475e;color:#fff;border:1px solid #66c0f4;" value="${CONFIG.STEAM_ID}"></label><br><br>
            <label><input id="debug_cb" type="checkbox" ${CONFIG.DEBUG?'checked':''}> Debug в консоль</label><br><br>
            <button id="save_btn" style="background:#66c0f4;color:#1b2838;padding:10px 20px;border:none;border-radius:5px;font-weight:bold;">Сохранить и проверить</button>
            <button id="close_btn" style="background:#c6695d;color:#fff;padding:10px 20px;border:none;border-radius:5px;font-weight:bold;margin-left:10px;">Закрыть</button>
            <div id="status" style="margin-top:12px;font-size:14px;"></div>`;
        document.body.appendChild(div);

        document.getElementById('close_btn').onclick = () => div.remove();
        document.getElementById('debug_cb').onchange = e => GM_setValue('debug_mode', e.target.checked);

        document.getElementById('save_btn').onclick = () => {
            const key = document.getElementById('api_key').value.trim();
            const id = document.getElementById('steam_id').value.trim();
            const status = document.getElementById('status');

            if (!key || !id) return status.innerHTML = '<span style="color:#f44">Заполни оба поля!</span>';

            status.innerHTML = 'Проверка...';
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&format=json&include_appinfo=1`,
                onload: r => {
                    if (r.status !== 200) return status.innerHTML = `<span style="color:#f44">HTTP ${r.status}</span>`;
                    try {
                        const json = JSON.parse(r.responseText);
                        const cnt = json.response?.game_count || 0;
                        GM_setValue('steam_api_key', key);
                        GM_setValue('steam_id64', id);
                        status.innerHTML = `<span style="color:#6f4">Ок! ${cnt} игр</span>`;
                        setTimeout(() => location.reload(), 1500);
                    } catch (e) {
                        status.innerHTML = '<span style="color:#f44">Неверный ключ или приватный профиль</span>';
                    }
                }
            });
        };
    }

    if (!CONFIG.API_KEY || !CONFIG.STEAM_ID) {
        setTimeout(showSettings, 1000);
        return;
    }

    let ownedGames = new Set();
    const cacheKey = 'owned_cache';
    const cacheTimeKey = 'owned_time';

    function loadOwned() {
        const cached = GM_getValue(cacheKey, null);
        const ts = GM_getValue(cacheTimeKey, 0);
        const now = Date.now();

        if (cached && now - ts < 3_600_000) {
            ownedGames = new Set(cached);
            log('owned из кэша:', ownedGames.size);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${CONFIG.API_KEY}&steamid=${CONFIG.STEAM_ID}&format=json&include_appinfo=1`,
            onload: r => {
                if (r.status !== 200) return log('Steam HTTP', r.status);
                try {
                    const json = JSON.parse(r.responseText);
                    if (!json.response || json.response.game_count === 0) return;
                    const names = json.response.games.map(g => g.name.toLowerCase());
                    ownedGames = new Set(names);
                    GM_setValue(cacheKey, names);
                    GM_setValue(cacheTimeKey, now);
                    log('owned загружено:', names.length);
                    smartHighlight();
                } catch (e) {
                    log('owned JSON', e);
                }
            }
        });
    }

    function isOwned(candidate) {
        // (строгий матчинг)
        for (const owned of ownedGames) {
            if (owned === candidate) return true;
            if (owned.includes(candidate) || candidate.includes(owned)) {
                const a = Math.min(owned.length, candidate.length);
                const b = Math.max(owned.length, candidate.length);
                if (a / b >= 0.8) return true;
            }
        }
        return false;
    }

    let processed = new WeakSet();

    function tryHighlight(el) {
        if (!el || processed.has(el)) return;
        processed.add(el);

        const text = el.textContent.trim();
        if (!text || text.length < 3) return;

        const lower = text.toLowerCase();

        if (!isOwned(lower)) return;

        const host = location.hostname;
        const isIndieGala = host === 'www.indiegala.com';
        const isGOG = host === 'www.gog.com';

        if (isIndieGala) {
            const card = el.closest('.main-list-results-item');
            if (!card || card.classList.contains('owned-indiegala')) return;
            card.classList.add('owned-indiegala');

            const title = el.closest('h3.bg-gradient-red');
            if (title) {
                title.classList.remove('bg-gradient-red');
                title.style.background = 'linear-gradient(to right, #28a745, #5cb85c)';
                title.style.color = '#fff';
            }

            const discount = card.querySelector('.main-list-results-item-discount.bg-gradient-red');
            if (discount) {
                discount.classList.remove('bg-gradient-red');
                discount.style.background = 'linear-gradient(to right, #28a745, #5cb85c)';
                discount.style.color = '#fff';
            }

            const cartBtn = card.querySelector('.main-list-results-item-add-to-cart.bg-gradient-red');
            if (cartBtn) {
                cartBtn.classList.remove('bg-gradient-red');
                cartBtn.style.background = 'linear-gradient(to right, #28a745, #5cb85c)';
                cartBtn.style.color = '#fff';
            }

            el.style.borderLeft = 'none';
            const badge = el.parentNode.querySelector('.owned-badge');
            if (badge) badge.remove();

        } else if (isGOG) {
            // Основная подсветка
            el.style.borderLeft = '4px solid #28a745';

            if (!el.parentNode.querySelector('.owned-badge')) {
                const badge = document.createElement('span');
                badge.textContent = ' Owned';
                badge.className = 'owned-badge';
                badge.style.cssText = 'color:#28a745;font-weight:bold;margin-left:6px;font-size:0.9em;';
                el.parentNode.insertBefore(badge, el.nextSibling);
            }

            const infoBlock = el.closest('.product-tile__info');
            if (infoBlock && !infoBlock.classList.contains('owned-gog-title')) {
                infoBlock.style.backgroundColor = '#11421c';
                infoBlock.style.borderRadius = '14px';
                infoBlock.style.padding = '4px 8px';
                infoBlock.classList.add('owned-gog-title');
            }

            // Расширенное название в портале
            const portalTitle = document.querySelector('product-title span');
            if (portalTitle && !processed.has(portalTitle)) {
                portalTitle.style.borderLeft = '14px solid #11421c';
                if (!portalTitle.parentNode.querySelector('.owned-badge-portal')) {
                    const badgePortal = document.createElement('span');
                    badgePortal.textContent = ' Owned';
                    badgePortal.className = 'owned-badge-portal';
                    badgePortal.style.cssText = 'color:#28a745;font-weight:bold;margin-left:8px;font-size:1.1em;';
                    portalTitle.parentNode.insertBefore(badgePortal, portalTitle.nextSibling);
                }
                processed.add(portalTitle);
            }

        } else {
            // Остальные сайты
            el.style.borderLeft = '4px solid #28a745';

            if (!el.parentNode.querySelector('.owned-badge')) {
                const badge = document.createElement('span');
                badge.textContent = ' Owned';
                badge.className = 'owned-badge';
                badge.style.cssText = 'color:#28a745;font-weight:bold;margin-left:6px;font-size:0.9em;';
                el.parentNode.insertBefore(badge, el.nextSibling);
            }

            if (host.includes('cheapkeys.ovh')) {
                const row = el.closest('tr');
                if (row && !row.classList.contains('owned-row')) {
                    row.style.backgroundColor = '#d4edda';
                    row.classList.add('owned-row');
                }
            }
        }

        if (CONFIG.DEBUG) log('owned →', text);
    }

    function smartHighlight() {
        const host = location.hostname;

        if (host.includes('cheapkeys.ovh')) {
            document.querySelectorAll('table tr td:nth-child(2) a').forEach(tryHighlight);
        } else if (host === 'www.gog.com') {
            // Основные названия
            document.querySelectorAll('.product-tile__title span').forEach(tryHighlight);
            // Расширенное в портале
            const portalEls = document.querySelectorAll('product-title span');
            portalEls.forEach(tryHighlight);
        } else if (host === 'www.indiegala.com') {
            document.querySelectorAll('h3 a[href^="/store/game/"], h3 a[href^="/store/item/"]').forEach(tryHighlight);
        } else {
            document.querySelectorAll(
                'a[href*="/app/"], a[href*="/game/"], .game_title a, .title a, .entity-title a, .product-title a, [class*="title"] a'
            ).forEach(tryHighlight);
        }
    }

    loadOwned();

    setTimeout(smartHighlight, 1500);
    setTimeout(smartHighlight, 4000);
    setTimeout(smartHighlight, 8000);

    // На GOG чаще проверяем из-за динамического портала
    if (location.hostname === 'www.gog.com') {
        setInterval(smartHighlight, 600);  // каждые 0.6 сек — ловит ховер мгновенно
    }

    if (!location.hostname.includes('cheapkeys.ovh')) {
        new MutationObserver(() => setTimeout(smartHighlight, 300))
            .observe(document.body, { childList: true, subtree: true });
    }
})();