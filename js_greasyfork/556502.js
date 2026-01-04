// ==UserScript==
// @name         Heroturko → Render-state Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a floating button to search Render-state.to for the Heroturko 3D model title
// @match       https://heroturko.cz/3d-models/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556502/Heroturko%20%E2%86%92%20Render-state%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/556502/Heroturko%20%E2%86%92%20Render-state%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getMetaTitle() {
        const meta = document.querySelector('meta[name="title"]');
        return meta ? (meta.getAttribute('content') || null) : null;
    }

    function cleanTitle(raw) {
        if (!raw) return null;
        const idx = raw.indexOf('»');
        if (idx === -1) return raw.trim();
        return raw.slice(0, idx).replace(/\s+$/, '').trim();
    }

    function buildRenderStateUrl(query) {
        return `https://render-state.to/?s=${encodeURIComponent(query)}&post_type=post`;
    }

    function buildEDLoadUrl(query) {
        const base = 'https://3d-load.net/';
        const params = [
            `s=${encodeURIComponent(query)}`,
            'asp_active=1',
            'p_asid=1',
            'p_asp_data=1',
            'filters_initial=1',
            'filters_changed=0',
            'qtranslate_lang=0',
            'asp_highlight=1',
            'current_page_id=163489'
        ].join('&');
        return `${base}?${params}`;
    }

    function buildZoneGfxUrl(query) {
        return `https://zonegfx.com/?s=${encodeURIComponent(query)}`;
    }

    function createButton(text, bottomOffsetPx, onClick, bg = '#1f2937') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ht-search-btn';
        btn.textContent = text;
        Object.assign(btn.style, {
            position: 'fixed',
            right: '18px',
            bottom: `${bottomOffsetPx}px`,
            zIndex: 2147483647,
            background: bg,
            color: '#fff',
            border: 'none',
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            fontSize: '13px',
            fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
        });
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px)'; btn.style.transition = 'transform .12s'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        btn.addEventListener('click', onClick);
        document.body.appendChild(btn);
        return btn;
    }

    function getSearchQuery() {
        const raw = getMetaTitle() || document.title || '';
        return cleanTitle(raw) || null;
    }

    function openUrl(url) {
        window.open(url, '_blank');
    }

    function init() {
        // Spacing: bottom button at 18px; each button height+gap is 56px
        const baseOffset = 18;
        const step = 56;

        // Bottom: Render-state
        createButton('Search Render-state', baseOffset, () => {
            const q = getSearchQuery();
            openUrl(q ? buildRenderStateUrl(q) : 'https://render-state.to/');
        }, '#1f2937');

        // Middle: 3D-Load (above Render-state)
        createButton('Search 3D-Load', baseOffset + step, () => {
            const q = getSearchQuery();
            openUrl(q ? buildEDLoadUrl(q) : 'https://3d-load.net/');
        }, '#0b74de');

        // Top: ZoneGFX (above 3D-Load)
        createButton('Search ZoneGFX', baseOffset + step * 2, () => {
            const q = getSearchQuery();
            openUrl(q ? buildZoneGfxUrl(q) : 'https://zonegfx.com/');
        }, '#2b8a3e');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();