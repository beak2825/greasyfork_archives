// ==UserScript==
// @name         NH ↔ EH Crosslinker
// @namespace    github.com/longkidkoolstar
// @version      0.2.1
// @description  Adds cross-links between nhentai and e-hentai/exhentai galleries
// @author       longkidkoolstar
// @match        https://nhentai.net/g/*
// @match        https://e-hentai.org/g/*
// @match        https://exhentai.org/g/*
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/fb6L0sx9/e-h.png
// @downloadURL https://update.greasyfork.org/scripts/562156/NH%20%E2%86%94%20EH%20Crosslinker.user.js
// @updateURL https://update.greasyfork.org/scripts/562156/NH%20%E2%86%94%20EH%20Crosslinker.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const url = location.href;

    /* ---------------- NHENTAI → E-HENTAI ---------------- */
    if (url.includes('nhentai.net/g/')) {
        const titleEl = document.querySelector('#info h1');
        if (!titleEl) return;
        let title = titleEl.innerText;
        title = cleanTitle(title);

        const artistEl = document.querySelector(
            '.tag-container.field-name a[href^="/artist/"] .name'
        );
        const artist = artistEl ? artistEl.textContent.trim() : '';
        let query = title;
        if (artist) query += ` artist:${artist}`;
        const ehUrl = 'https://e-hentai.org/?f_search=' + encodeURIComponent(query);
        addButton('#info', '🔗 Search on e-hentai', ehUrl);
        return;
    }

    /* ---------------- E / EXHENTAI → NHENTAI ---------------- */
    if (url.includes('e-hentai.org/g/') || url.includes('exhentai.org/g/')) {
        let title = '';
        const gj = document.querySelector('#gj');
        const gn = document.querySelector('#gn');
        if (gn) title = gn.innerText;
        else if (gj) title = gj.innerText;
        else return;

        title = cleanTitle(title);

        const artistEl = document.querySelector(
            '#taglist a[href^="https://e-hentai.org/tag/artist:"]'
        );
        const artist = artistEl ? artistEl.textContent.trim() : '';
        let query = title;
        if (artist) query += ` ${artist}`;
        const nhUrl =
            'https://nhentai.net/search/?q=' + encodeURIComponent(query);
        addButton('#gd2', '🔗 Search on nhentai', nhUrl);
    }

    /* ---------------- SWITCH e-hentai → exhentai ---------------- */
    if (
        url.startsWith('https://e-hentai.org/?') ||
        url.startsWith('https://e-hentai.org/?f_search=')
    ) {
        const exhUrl = url.replace('https://e-hentai.org/', 'https://exhentai.org/');
        addFloatingButton('🔄 Switch to exhentai', exhUrl);
    }

    /* ---------------- Helpers ---------------- */
    function cleanTitle(title) {
        // If title contains |, take only the left part
        if (title.includes('|')) {
            title = title.split('|')[0];
        }

        // Remove bracketed content
        title = title.replace(/\[[^\]]*\]/g, '');

        // Remove numbers (standalone digits and sequences)
        title = title.replace(/\b\d+\b/g, '');

        // Clean up extra whitespace
        title = title.replace(/\s+/g, ' ').trim();

        return title;
    }

    function addButton(parentSelector, text, link) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.textContent = text;
        a.style.display = 'block';
        a.style.marginTop = '10px';
        a.style.fontSize = '16px';
        parent.appendChild(a);
    }

    function addFloatingButton(text, link) {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = text;
        a.style.position = 'fixed';
        a.style.bottom = '20px';
        a.style.right = '20px';
        a.style.padding = '10px 14px';
        a.style.background = '#34353b';
        a.style.color = '#fff';
        a.style.borderRadius = '6px';
        a.style.fontSize = '14px';
        a.style.zIndex = '9999';
        a.style.textDecoration = 'none';
        document.body.appendChild(a);
    }
})();