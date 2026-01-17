// ==UserScript==
// @name         [TMS] Shibari Study – Copy Suite (✂️ + ⛏️)
// @namespace    https://greasyfork.org/en/users/30331-setcher
// @version      1.0.0
// @description  ✂️ for title, description, playlist (smaller playlist ✂️) • ⛏️ next to logo
// @author       Setcher
// @match        https://shibaristudy.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562900/%5BTMS%5D%20Shibari%20Study%20%E2%80%93%20Copy%20Suite%20%28%E2%9C%82%EF%B8%8F%20%2B%20%E2%9B%8F%EF%B8%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562900/%5BTMS%5D%20Shibari%20Study%20%E2%80%93%20Copy%20Suite%20%28%E2%9C%82%EF%B8%8F%20%2B%20%E2%9B%8F%EF%B8%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ACTIVE     = 'ssCopyActive';
    const STRIP_HTML = 'ssStripHtml';
    const SAFE_NAME  = 'ssSafeName';

    let isActive  = GM_getValue(ACTIVE, false);
    let stripHtml = GM_getValue(STRIP_HTML, true);
    let safeName  = GM_getValue(SAFE_NAME, true);

    // ── Toast ─────────────────────────────────────────────────────────────
    function toast(msg) {
        const existing = document.querySelector('.tms-toast');
        if (existing) existing.remove();

        const t = document.createElement('div');
        t.textContent = msg;
        t.className = 'tms-toast';
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    }

    // ── Safe filename ─────────────────────────────────────────────────────
    function makeSafe(str) {
        if (!safeName) return str.trim();
        return str
            .replace(/[\/\\:*?"<>|]/g, '-')
            .replace(/\s*\|\s*/g, ' - ')
            .replace(/[:]/g, ' - ')
            .replace(/-+/g, '-')
            .trim();
    }

    // ── Pure visible text (excludes our buttons) ─────────────────────────
    function getVisibleText(element) {
        if (!element) return '';
        const clone = element.cloneNode(true);
        clone.querySelectorAll('.tms-program-cp, .tms-collection-cp, .tms-playlist-cp').forEach(b => b.remove());
        return clone.textContent.trim();
    }

    // ── Description extraction ───────────────────────────────────────────
    function getDescriptionHtml() {
        for (const el of document.querySelectorAll('ds-calendar-sharing')) {
            const options = el.getAttribute('options');
            if (!options || !options.includes('description')) continue;

            const descMatch = options.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/);
            if (descMatch && descMatch[1]) {
                let escaped = descMatch[1];
                escaped = escaped
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\t/g, '\t');

                const div = document.createElement('div');
                div.innerHTML = escaped
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&');
                return div.innerHTML;
            }
        }
        const visible = document.querySelector('.editor-content');
        return visible ? visible.innerHTML : '';
    }

    // ── Short visible description (the one shown under ds-show-more) ──────
    function getShortDescriptionHtml() {
        const shortEditor = document.querySelector('ds-show-more .editor-content');
        return shortEditor ? shortEditor.innerHTML : '';
    }

    // ── IMPROVED plain text conversion ───────────────────────────────────
    function htmlToText(html) {
        if (!stripHtml || !html) return html?.trim() || '';

        const div = document.createElement('div');
        div.innerHTML = html;

        // Replace <br> with single newline
        div.querySelectorAll('br').forEach(br => {
            br.replaceWith(document.createTextNode('\n'));
        });

        // Replace block elements (<p>, <div>, <li>, etc.) with double newline
        const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre'];
        blockTags.forEach(tag => {
            div.querySelectorAll(tag).forEach(el => {
                el.replaceWith(document.createTextNode('\n\n' + el.textContent + '\n\n'));
            });
        });

        let text = div.textContent;

        // Clean up excessive newlines
        text = text
            .replace(/\n{3,}/g, '\n\n')  // max two newlines between paragraphs
            .replace(/^[\n\s]+|[\n\s]+$/g, '')  // trim
            .trim();

        return text;
    }

    // ── Add copy buttons (idempotent) ─────────────────────────────────────
    function addCopyButtons() {
        if (!isActive) return;

        // Program title ✂️
        const programTitle = document.querySelector('h1.program-title, h2.program-collection-title, [data-area="program-title"]');
        if (programTitle && !programTitle.querySelector('.tms-program-cp')) {
            const b = document.createElement('span');
            b.textContent = '✂️';
            b.className = 'tms-program-cp';
            b.title = 'Copy program title';
            b.onclick = () => {
                const final = makeSafe(getVisibleText(programTitle));
                GM_setClipboard(final);
                toast(`✂️ Program → ${final}`);
            };
            programTitle.appendChild(b);
        }

        // Collection title ✂️
        const collectionTitle = document.querySelector('.collection-title[data-area="collection-title"]');
        if (collectionTitle && !collectionTitle.querySelector('.tms-collection-cp')) {
            const b = document.createElement('span');
            b.textContent = '✂️';
            b.className = 'tms-collection-cp';
            b.title = 'Copy collection title';
            b.onclick = () => {
                const final = makeSafe(getVisibleText(collectionTitle));
                GM_setClipboard(final);
                toast(`✂️ Collection → ${final}`);
            };
            collectionTitle.appendChild(b);
        }

        // Description ✂️ — Full course description (from calendar JSON)
        const aboutBlock = document.querySelector('#program_about > #program_description_block');
        if (aboutBlock && !aboutBlock.querySelector('.tms-desc-short-cp')) {
            const fullHtml = getShortDescriptionHtml();
            if (fullHtml) {
                const b = document.createElement('button');
                b.textContent = `✂️ Copy Short Description ${stripHtml ? '(plain)' : '(HTML)'}`;
                b.className = 'tms-desc-short-cp tms-desc-cp';
                b.onclick = () => {
                    GM_setClipboard(stripHtml ? htmlToText(fullHtml) : fullHtml.trim());
                    toast('✂️ Description copied');
                };
                aboutBlock.insertBefore(b, aboutBlock.firstChild);
            }
        }

        // Short description ✂️ — the visible one under "Show more"
        const showMore = document.querySelector('mt-1');
        if (showMore && !showMore.querySelector('.tms-desc-short-cp')) {
            const shortHtml = getShortDescriptionHtml();
            if (shortHtml) {
                const b = document.createElement('button');
                b.textContent = `✂️ Copy Video Description ${stripHtml ? '(plain)' : '(HTML)'}`;
                b.className = 'tms-desc-full-cp tms-desc-cp';
                b.style.marginTop = '12px';  // a little spacing below the text
                b.onclick = () => {
                    GM_setClipboard(stripHtml ? htmlToText(shortHtml) : shortHtml.trim());
                    toast('✂️ Description copied');
                };
                showMore.parent.insertAfter(b, showMore);
            }
        }

        // Author name ✂️
        const authorSpan = document.querySelector('.content-author-name.text-ds-default');
        if (authorSpan && !authorSpan.querySelector('.tms-author-cp')) {
            const b = document.createElement('span');
            b.textContent = '✂️';
            b.className = 'tms-author-cp';
            b.title = 'Copy author name';
            b.onclick = (e) => {
                e.stopPropagation();   // Stops the click from bubbling to the parent <a>
                e.preventDefault();    // Extra safety – prevents default link behavior
                const name = authorSpan.textContent.trim();
                GM_setClipboard(name);
                toast(`✂️ Author → ${name}`);
            };
            authorSpan.parentNode.appendChild(b);
        }

        // Playlist numbering ✂️
        const counter = document.querySelector('[data-area="counter"]');
        if (counter && !counter.querySelector('.tms-playlist-cp')) {
            const b = document.createElement('span');
            b.textContent = '✂️';
            b.className = 'tms-playlist-cp';
            b.title = 'Copy numbered playlist';
            b.onclick = () => {
                const titles = Array.from(document.querySelectorAll('[data-area="playlist-item"] [data-area="title"]'))
                    .map(el => el.textContent.trim())
                    .filter(Boolean);

                if (!titles.length) return toast('No videos found');

                const list = titles
                    .map((t, i) => `${String(i + 1).padStart(2, '0')}. ${makeSafe(t)}`)
                    .join('\n');

                GM_setClipboard(list);
                toast(`✂️ Playlist copied (${titles.length} videos)`);
            };
            counter.appendChild(b);
        }
    }

    // ── ⛏️ button next to logo (once only) ───────────────────────────────
    function addRefreshButton() {
        const logoLink = document.querySelector('.navbar a.navbar-brand-link');
        if (!logoLink) return;

        const parentDiv = logoLink.parentElement;
        if (parentDiv && !parentDiv.querySelector('.tms-refresh')) {
            const b = document.createElement('span');
            b.textContent = '⛏️';
            b.className = 'tms-refresh';
            b.title = 'Refresh copy buttons';
            b.onclick = (e) => {
                e.stopPropagation();
                addCopyButtons();
                addRefreshButton();
                toast('⛏️ Refreshed');
            };
            parentDiv.appendChild(b);
        }
    }

    // ── Menu ─────────────────────────────────────────────────────────────
    GM_registerMenuCommand(`${isActive ? '✅' : '❌'} Activate Copy Tools (instant)`, () => {
        isActive = true;
        GM_setValue(ACTIVE, true);
        addCopyButtons();
        addRefreshButton();
        toast('✂️ Tools activated');
    });

    GM_registerMenuCommand(`${isActive ? '✅' : '❌'} Deactivate Copy Tools`, () => {
        isActive = false;
        GM_setValue(ACTIVE, false);
        document.querySelectorAll('.tms-program-cp,.tms-collection-cp,.tms-desc-cp,.tms-playlist-cp,.tms-refresh').forEach(el => el.remove());
        toast('Tools deactivated');
    });

    GM_registerMenuCommand(`${stripHtml ? '✅' : '❌'} Toggle Strip HTML`, () => {
        stripHtml = !stripHtml;
        GM_setValue(STRIP_HTML, stripHtml);
        toast(`Strip HTML → ${stripHtml ? 'ON' : 'OFF'}`);
    });

    GM_registerMenuCommand(`${safeName ? '✅' : '❌'} Toggle Safe filename mode`, () => {
        safeName = !safeName;
        GM_setValue(SAFE_NAME, safeName);
        toast(`Safe filename → ${safeName ? 'ON' : 'OFF'}`);
    });

    // ── Styles (playlist ✂️ smaller) ─────────────────────────────────────
    GM_addStyle(`
        .tms-program-cp, .tms-collection-cp, .tms-refresh {
            cursor:pointer; font-size:22px; opacity:0.7; user-select:none; vertical-align:middle; margin-left:10px;
        }
        .tms-program-cp:hover, .tms-collection-cp:hover, .tms-refresh:hover { opacity:1; }
        .tms-playlist-cp {
            cursor:pointer; font-size:18px; opacity:0.7; user-select:none; vertical-align:middle; margin-left:8px;
        }
        .tms-author-cp {
            cursor:pointer; font-size:18px; opacity:0.7; user-select:none; margin-left:8px; vertical-align:middle;
        }
        .tms-author-cp:hover { opacity:1; }
        .tms-playlist-cp:hover { opacity:1; }
        .tms-desc-cp {
            display:block; margin:16px 0 12px; padding:11px 18px; background:#2a2a2a; color:#fff;
            border:none; border-radius:8px; font-size:15px; cursor:pointer; width:fit-content;
        }
        .tms-desc-full-cp, .tms-desc-short-cp {
            margin-bottom: 8px;
        }
        .tms-desc-cp:hover { background:#444; }
        .tms-toast {
            position:fixed; top:20px; right:20px; background:#111; color:#fff;
            padding:14px 24px; border-radius:10px; z-index:99999; font-size:15px;
            box-shadow:0 8px 30px rgba(0,0,0,0.6);
        }
    `);

    // ── Initial run ──────────────────────────────────────────────────────
    if (isActive) {
        addCopyButtons();
        addRefreshButton();
    }

    // Turbo support
    document.addEventListener('turbo:render', () => setTimeout(() => {
        addCopyButtons();
        addRefreshButton();
    }, 600));
    document.addEventListener('turbo:load', () => setTimeout(() => {
        addCopyButtons();
        addRefreshButton();
    }, 600));

})();