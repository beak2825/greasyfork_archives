// ==UserScript==
// @name         Шрекс
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  шрекис
// @author       Sky
// @license      MIT
// @match        https://www.heroeswm.ru/pvp_guild.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550461/%D0%A8%D1%80%D0%B5%D0%BA%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550461/%D0%A8%D1%80%D0%B5%D0%BA%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NEW_IMG = "https://avatars.mds.yandex.net/i?id=6d7afeb3592802a0f826b1053fb628aaff89c3df-4121127-images-thumbs&n=13";

    function ensureStyle() {
        if (document.getElementById('hwm-guild-image-replacer-style')) return;
        const s = document.createElement('style');
        s.id = 'hwm-guild-image-replacer-style';
        s.textContent = `
            img[data-custom="guild"] {
                width: 180px !important;
                max-width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: 0 auto !important;
            }
        `;
        document.head?.appendChild(s);
    }

    function replaceAllGuildImages() {
        ensureStyle();

        const imgs = Array.from(document.querySelectorAll('img')).filter(img => {
            const alt = (img.getAttribute('alt') || '').trim();
            const title = (img.getAttribute('title') || '').trim();
            const src = (img.src || '').toLowerCase();
            return alt.includes('гильдия тактик') || title.includes('гильдия тактик') || src.includes('pvp_gerb');
        });

        if (imgs.length === 0) return;

        imgs.forEach(img => {
            try {
                if (!img.hasAttribute('data-original-src')) img.setAttribute('data-original-src', img.src);

                img.src = NEW_IMG;
                img.setAttribute('data-custom', 'guild');

                const parent = img.parentElement;
                if (parent) {
                    const pw = parent.getBoundingClientRect().width;
                    if (pw && pw < 200) {
                        img.style.setProperty('width', '150px', 'important');
                    } else {
                        img.style.setProperty('width', '180px', 'important');
                    }
                } else {
                    img.style.setProperty('width', '180px', 'important');
                }

                img.style.setProperty('height', 'auto', 'important');
                img.style.setProperty('display', 'block', 'important');
                img.style.setProperty('margin', '0 auto', 'important');

            } catch (e) {
                console.warn('HWM replace error:', e);
            }
        });

        const customs = Array.from(document.querySelectorAll('img[data-custom="guild"]'));
        if (customs.length > 1) {
            for (let i = 1; i < customs.length; i++) {
                try { customs[i].remove(); } catch (e) { /* ignore */ }
            }
        }

        console.debug('HWM: replaced', customs.length || imgs.length, 'images (kept 1).');
    }

    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(replaceAllGuildImages, 150);
    });

    window.addEventListener('load', () => {
        replaceAllGuildImages();
        observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    });

    replaceAllGuildImages();
})();