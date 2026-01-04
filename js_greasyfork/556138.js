// ==UserScript==
// @name Shikimori Filter Reset Button
// @namespace http://tampermonkey.net/
// @version 5.3
// @description Добавляет кнопку сброса всех выбранных фильтров на все страницы с фильтрацией
// @author You
// @match https://shikimori.one/*
// @match https://shikimori.org/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/556138/Shikimori%20Filter%20Reset%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/556138/Shikimori%20Filter%20Reset%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function rgbToArray(color) {
        return color.match(/\d+/g).map(Number);
    }
    function arrayToRgb(arr) {
        return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
    }
    function darken(color, percent) {
        const rgb = rgbToArray(color);
        return arrayToRgb(rgb.map(v => Math.max(0, Math.floor(v * (1 - percent / 100)))));
    }
    function lighten(color, percent) {
        const rgb = rgbToArray(color);
        return arrayToRgb(rgb.map(v => Math.min(255, Math.floor(v + (255 - v) * (percent / 100)))));
    }
    function getBrightness(color) {
        const [r, g, b] = rgbToArray(color);
        return (r * 0.299 + g * 0.587 + b * 0.114);
    }
    function getActualBackgroundColor(el) {
        let cur = el;
        while (cur) {
            const bg = getComputedStyle(cur).backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                return bg;
            }
            cur = cur.parentElement;
        }
        return 'rgb(255,255,255)';
    }
    function getThemeColors(container) {
        const bgRaw = getActualBackgroundColor(container);
        const isLight = getBrightness(bgRaw) > 128;
        const text = isLight ? '#000000' : '#ffffff';
        const border = isLight ? '#000000' : '#ffffff';
        const borderHover = border;
        const baseAdjust = 5;
        const hoverAdjust = 10;
        const bg = isLight ? darken(bgRaw, baseAdjust) : lighten(bgRaw, baseAdjust);
        const bgHover = isLight ? darken(bgRaw, hoverAdjust) : lighten(bgRaw, hoverAdjust);
        return { bg, bgHover, border, borderHover, text };
    }
    const SELECTORS_FOR_BUTTON = [
        '#user_rates_index > section > div > div > div.menu-slide-outer.x199 > div > aside > div:nth-child(3) > div.subheadline',
        '.b-collection-filters > aside > div:nth-child(3) > div.subheadline',
        '.b-collection-filters aside .subheadline'
    ];
    const INSERT_BEFORE = true;
    function createResetButton(targetElement) {
        const container = targetElement.closest('aside') || document.body;
        const theme = getThemeColors(container);
        const btn = document.createElement('div');
        btn.id = 'custom-reset-filters-btn';
        btn.className = 'block';
        btn.style.cssText = `
            padding: 12px 15px !important;
            margin: 15px 0 !important;
            background: ${theme.bg} !important;
            border: 1px solid ${theme.border} !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            text-align: center !important;
            transition: all 0.2s !important;
            user-select: none !important;
            z-index: 1000 !important;
        `;
        btn.innerHTML = `<div style="color:${theme.text};font-size:13px;font-weight:600;">Сбросить все фильтры</div>`;
        const textEl = btn.firstChild;
        btn.addEventListener('mouseenter', () => {
            const th = getThemeColors(container);
            btn.style.background = th.bgHover;
            btn.style.borderColor = th.borderHover;
        });
        btn.addEventListener('mouseleave', () => {
            const th = getThemeColors(container);
            btn.style.background = th.bg;
            btn.style.borderColor = th.border;
        });
        btn.addEventListener('click', () => {
            const th = getThemeColors(container);
            textEl.textContent = 'Сброс...';
            btn.style.background = th.bgHover;
            const url = new URL(location.href);
            url.searchParams.forEach((_, k) => {
                if (!['order', 'page'].includes(k)) url.searchParams.delete(k);
            });
            const path = url.pathname.replace(/\/(status|genre|kind|season|rating|mylist|studio|publisher|duration|airdate|block|search)\/[^/]+/g, '');
            location.href = path + url.search + url.hash;
        });
        return btn;
    }
    function findTargetElement() {
        for (let sel of SELECTORS_FOR_BUTTON) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        const fc = document.querySelector('.b-collection-filters');
        return fc ? fc.querySelector('.subheadline') : null;
    }
    function addResetButton() {
        if (document.getElementById('custom-reset-filters-btn')) return false;
        const target = findTargetElement();
        if (!target) return false;
        const btn = createResetButton(target);
        target.parentNode.insertBefore(btn, INSERT_BEFORE ? target : target.nextSibling);
        return true;
    }
    function isFilterPage() {
        return location.pathname.includes('/list/') || !!document.querySelector('.b-collection-filters');
    }
    function init() {
        if (!isFilterPage()) return;
        if (addResetButton()) return;
        let tries = 0;
        const iv = setInterval(() => {
            if (addResetButton() || tries++ > 50) clearInterval(iv);
        }, 100);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
    const obs = new MutationObserver(() => { if (isFilterPage() && !document.getElementById('custom-reset-filters-btn')) init(); });
    obs.observe(document.body, { childList: true, subtree: true });
    setInterval(() => { if (isFilterPage() && !document.getElementById('custom-reset-filters-btn')) init(); }, 500);
})();