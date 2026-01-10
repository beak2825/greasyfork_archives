// ==UserScript==
// @name         xHamster Ultimate Enhancer
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Enhances xHamster: hides watched videos, auto large player, advanced filters, mark viewed, scroll to top
// @author       dweebz
// @license      MIT
// @match        https://xhamster.com/*
// @match        https://*.xhamster.com/*
// @match        https://xhamster2.com/*
// @match        https://*.xhamster2.com/*
// @match        https://xhamster3.com/*
// @match        https://*.xhamster3.com/*
// @include      *xhamster.com/*
// @grant        GM.addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562140/xHamster%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/562140/xHamster%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Options storage
    const options = {
        autoResizePlayer: JSON.parse(localStorage.getItem('xh_autoResizePlayer')) || false,
        hdOnly: JSON.parse(localStorage.getItem('xh_hdOnly')) || false,
        minViews: parseInt(localStorage.getItem('xh_minViews')) || 0,
        maxViews: parseInt(localStorage.getItem('xh_maxViews')) || 10000000,
        minDuration: parseInt(localStorage.getItem('xh_minDuration')) || 0,
        maxDuration: parseInt(localStorage.getItem('xh_maxDuration')) || 9999,
        minRating: parseInt(localStorage.getItem('xh_minRating')) || 0,
        maxRating: parseInt(localStorage.getItem('xh_maxRating')) || 100,
        textSearch: localStorage.getItem('xh_textSearch') || '',
        textWhitelist: localStorage.getItem('xh_textWhitelist') || '',
        textBlacklist: localStorage.getItem('xh_textBlacklist') || '',
        textSanitize: localStorage.getItem('xh_textSanitize') || '',
        disableFilters: JSON.parse(localStorage.getItem('xh_disableFilters')) || false
    };

    // CSS: watched hiding + layout tweaks + buttons
    GM.addStyle(`
        .plus-buttons {
            background: rgba(67,67,67,0.85);
            box-shadow: 0 0 12px rgba(20,111,223,0.85);
            font-size: 12px;
            position: fixed;
            bottom: 10px;
            padding: 10px 22px 8px 24px;
            right: 0;
            z-index: 100;
            transition: all 0.3s ease;
            color: white;
            border-radius: 8px 0 0 8px;
        }
        .plus-buttons:hover { box-shadow: 0 0 3px rgba(0,0,0,0.3); }
        .plus-button {
            margin: 10px 0;
            padding: 6px 15px;
            border-radius: 4px;
            font-weight: 700;
            display: block;
            text-align: center;
            cursor: pointer;
            border: none;
            text-decoration: none;
            background: rgb(221,221,221);
            color: rgb(51,51,51);
        }
        .plus-button:hover { background: rgb(187,187,187); }
        .plus-button.isOn { background: rgb(20,111,223); color: #fff; }
        .plus-button.isOn:hover { background: rgb(0,91,203); }
        .plus-hidden { display: none !important; }

        /* Hide watched videos - display:none for better reflow */
        .thumb-list__item:has(> a > div > div.thumb-image-container__watched),
        .thumb-list-mobile-item:has(div > a > div > div.thumb-image-container__watched),
        [class*="watched"], .watched-overlay, .thumb-watched {
            display: none !important;
        }

        /* Override on excluded pages (e.g., favorites) */
        .xh-no-hide-watched .thumb-list__item:has(> a > div > div.thumb-image-container__watched),
        .xh-no-hide-watched .thumb-list-mobile-item:has(div > a > div > div.thumb-image-container__watched),
        .xh-no-hide-watched [class*="watched"], .xh-no-hide-watched .watched-overlay, .xh-no-hide-watched .thumb-watched {
            display: block !important;
        }

        /* Layout improvements */
        .video-page.video-page--large-mode .player-container__player {
            height: 720px;
            max-height: 90vh !important;
        }
        .favorites-dropdown__list { max-height: unset !important; }
        .entity-container { margin: 22px 0; border-top: 1px solid #ccc; }
    `);

    function applyEnhancements() {
        $('.thumb-list__item, .thumb-list-mobile-item').each(function() {
            const item = $(this);
            if (item.hasClass('plus-hidden')) return;

            const titleEl = item.find('a.video-thumb-info__name, .video-thumb-info__name-link');
            const title = titleEl.length ? titleEl.text().toLowerCase() : '';

            const durationStr = item.find('.thumb-image-container__duration, [class*="duration"]').text() || '';
            const viewsStr = item.find('.views .metric-text, [class*="views"]').text().replace(/[^0-9]/g, '') || '0';
            const ratingStr = item.find('.rating .metric-text, [class*="rating"]').text().replace('%', '') || '0';
            const hasHD = item.find('i.thumb-image-container__icon--hd, i.thumb-image-container__icon--uhd, [class*="hd-icon"]').length > 0;

            const durationMin = parseDuration(durationStr);
            const views = parseInt(viewsStr) || 0;
            const rating = parseInt(ratingStr) || 0;

            let hide = false;

            if (options.hdOnly && !hasHD) hide = true;
            if (views < options.minViews || views > options.maxViews) hide = true;
            if (durationMin < options.minDuration || durationMin > options.maxDuration) hide = true;
            if (rating < options.minRating || rating > options.maxRating) hide = true;

            const searchTerms = options.textSearch.toLowerCase().split('\n').filter(t => t.trim());
            const whitelist = options.textWhitelist.toLowerCase().split('\n').filter(t => t.trim());
            const blacklist = options.textBlacklist.toLowerCase().split('\n').filter(t => t.trim());

            if (searchTerms.length && !searchTerms.every(term => title.includes(term))) hide = true;
            if (whitelist.length && !whitelist.some(term => title.includes(term))) hide = true;
            if (blacklist.some(term => title.includes(term))) hide = true;

            if (hide) item.addClass('plus-hidden');
        });
    }

    function parseDuration(str) {
        const parts = str.match(/(\d+):?(\d+)?/) || [];
        const min = parseInt(parts[1]) || 0;
        const sec = parseInt(parts[2]) || 0;
        return min + (sec / 60);
    }

    function applySanitization(text) {
        const rules = options.textSanitize.split('\n').filter(r => r.trim());
        rules.forEach(rule => {
            const [from, to = ''] = rule.split('=').map(s => s.trim());
            if (from) text = text.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
        });
        return text;
    }

    function markAllViewed() {
        const currentUrl = window.location.href;
        $('a.video-thumb-info__name, .video-thumb-info__name-link').each((_, el) => {
            history.replaceState({}, '', el.href);
        });
        history.replaceState({}, '', currentUrl);
        location.reload();
    }

    function forceReflow() {
        const containers = ['.thumb-list', '.thumb-list-mobile', 'main', '.video-list'];
        const scrollPos = window.scrollY;
        containers.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.style.display = 'none';
                void el.offsetHeight; // trigger reflow
                el.style.display = '';
            }
        });
        window.scrollTo(0, scrollPos);
    }

    const observer = new MutationObserver(() => {
        if (!options.disableFilters) {
            applyEnhancements();
            forceReflow();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('DOMContentLoaded', () => {
        const isVideoPage = window.location.pathname.startsWith('/videos');
        const isFavoritesPage = window.location.pathname.startsWith('/my/favorites/videos');
        const player = document.querySelector('#player-container');
        const video = player ? player.querySelector('video') : null;

        // Exclude watched hiding on favorites page
        if (isFavoritesPage) {
            document.body.classList.add('xh-no-hide-watched');
        }

        if (video && options.autoResizePlayer && isVideoPage) {
            video.addEventListener('canplay', () => {
                const largeBtn = document.querySelector('.large-mode, [class*="large"], .player-large-toggle');
                if (largeBtn) largeBtn.click();
            }, { once: true });
        }

        if (player) {
            window.addEventListener('resize', () => {
                if (document.querySelector('.xplayer-large-mode, [class*="large-mode"]')) {
                    player.style.maxHeight = `${window.innerHeight - 60}px`;
                }
            });
        }

        if (options.textSanitize && isVideoPage) {
            const title = $('h1').first();
            if (title.length) title.text(applySanitization(title.text()));
        }

        if (!options.disableFilters) {
            applyEnhancements();
            forceReflow();
        }

        const buttons = $('<div class="plus-buttons"></div>');

        const resizeBtn = $('<a class="plus-button"></a>').text('Auto Large Player').addClass(options.autoResizePlayer ? 'isOn' : '');
        resizeBtn.click(() => {
            options.autoResizePlayer = !options.autoResizePlayer;
            localStorage.setItem('xh_autoResizePlayer', options.autoResizePlayer);
            resizeBtn.toggleClass('isOn');
            location.reload();
        });

        const scrollBtn = $('<a class="plus-button"></a>').text('Scroll to Top').click(() => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const markBtn = $('<a class="plus-button"></a>').text('Mark All Viewed').click(markAllViewed);

        const disableBtn = $('<a class="plus-button"></a>').text('Disable Filters').addClass(options.disableFilters ? 'isOn' : '');
        disableBtn.click(() => {
            options.disableFilters = !options.disableFilters;
            localStorage.setItem('xh_disableFilters', options.disableFilters);
            disableBtn.toggleClass('isOn');
            location.reload();
        });

        const filtersForm = $(`
            <div id="xh-filters" style="background: rgba(255,255,255,0.92); color: black; padding: 12px; border: 1px solid #aaa; border-radius: 6px; margin-top: 10px; display: none; max-width: 280px;">
                <strong>Filters (save & reload):</strong><br>
                <label><input type="checkbox" ${options.hdOnly ? 'checked' : ''}> HD Only</label><br>
                Min Views: <input type="number" value="${options.minViews}" class="minViews"><br>
                Max Views: <input type="number" value="${options.maxViews}" class="maxViews"><br>
                Min Duration (min): <input type="number" value="${options.minDuration}" class="minDuration"><br>
                Max Duration (min): <input type="number" value="${options.maxDuration}" class="maxDuration"><br>
                Min Rating (%): <input type="number" value="${options.minRating}" class="minRating"><br>
                Max Rating (%): <input type="number" value="${options.maxRating}" class="maxRating"><br>
                Text Search:<br><textarea class="textSearch" rows="3">${options.textSearch}</textarea><br>
                Whitelist:<br><textarea class="textWhitelist" rows="3">${options.textWhitelist}</textarea><br>
                Blacklist:<br><textarea class="textBlacklist" rows="3">${options.textBlacklist}</textarea><br>
                Sanitize (old=new):<br><textarea class="textSanitize" rows="3">${options.textSanitize}</textarea><br>
                <button id="saveFilters" style="margin-top:8px; width:100%;">Save & Reload</button>
            </div>
        `);

        const showFiltersBtn = $('<a class="plus-button"></a>').text('Filters').click(() => $('#xh-filters').toggle());

        $('#saveFilters', filtersForm).click(() => {
            options.hdOnly = filtersForm.find('input[type=checkbox]').is(':checked');
            options.minViews = parseInt(filtersForm.find('.minViews').val()) || 0;
            options.maxViews = parseInt(filtersForm.find('.maxViews').val()) || 10000000;
            options.minDuration = parseInt(filtersForm.find('.minDuration').val()) || 0;
            options.maxDuration = parseInt(filtersForm.find('.maxDuration').val()) || 9999;
            options.minRating = parseInt(filtersForm.find('.minRating').val()) || 0;
            options.maxRating = parseInt(filtersForm.find('.maxRating').val()) || 100;
            options.textSearch = filtersForm.find('.textSearch').val();
            options.textWhitelist = filtersForm.find('.textWhitelist').val();
            options.textBlacklist = filtersForm.find('.textBlacklist').val();
            options.textSanitize = filtersForm.find('.textSanitize').val();

            Object.entries(options).forEach(([key, val]) => localStorage.setItem(`xh_${key}`, JSON.stringify(val)));
            location.reload();
        });

        buttons.append(resizeBtn, scrollBtn, markBtn, disableBtn, showFiltersBtn, filtersForm);
        $('body').append(buttons);

        // Dynamic slide-out
        setTimeout(() => {
            const width = buttons.outerWidth();
            GM.addStyle(`.plus-buttons { margin-right: -${width - 23}px; } .plus-buttons:hover { margin-right: 0; }`);
        }, 500);
    });
})();