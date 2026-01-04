// ==UserScript==
// @name         MusicBrainz: Resizable Secondary Types Forms
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.0.3
// @tag          ai-created
// @description  Makes the release group secondary type drop-down expandable and remembers its height.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/add*
// @match        *://*.musicbrainz.org/release/*/edit
// @match        *://*.musicbrainz.org/release-group/create*
// @match        *://*.musicbrainz.org/release-group/*/edit
// @match        *://*.musicbrainz.org/dialog*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549173/MusicBrainz%3A%20Resizable%20Secondary%20Types%20Forms.user.js
// @updateURL https://update.greasyfork.org/scripts/549173/MusicBrainz%3A%20Resizable%20Secondary%20Types%20Forms.meta.js
// ==/UserScript==

'use strict';

const PAGE_CONFIG = [
    {
        pathTest: (path, search) => path.startsWith('/release-group/') || (path.startsWith('/dialog') && search.includes('/release_group/create')),
        selector: '#id-edit-release-group\\.secondary_type_ids',
        storageKey: 'resizable_select_size_rge_secondary',
        isDynamic: false,
    },
    {
        pathTest: (path) => path.startsWith('/release/'),
        selector: '#secondary-types',
        storageKey: 'resizable_select_size_re_secondary',
        isDynamic: true,
    },
];

const MIN_VISIBLE_OPTIONS = 2;
const HANDLE_WIDTH = 16;

GM.addStyle(`
    .resizable-select-wrapper { display: flex; align-items: stretch; overflow: hidden; }
    .resizable-select-wrapper select { flex-grow: 1; width: 0; margin: 0; min-width: 0; }
    .resizable-select-handle {
        flex-shrink: 0; width: ${HANDLE_WIDTH}px; cursor: ns-resize; background-color: #f0f0f0;
        border: 1px solid #ccc; border-left: none; box-sizing: border-box;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="gray" d="M10 12 L12 10 L14 12 L12 14 z M6 12 L8 10 L10 12 L8 14 z M2 12 L4 10 L6 12 L4 14 z"/></svg>');
        background-repeat: no-repeat; background-position: center; opacity: 0.8;
    }
    .resizable-select-handle:hover { opacity: 1; background-color: #e0e0e0; }
`);

async function makeSelectResizable(selectEl, storageKey) {
    if (selectEl.dataset.resizable) return;
    selectEl.dataset.resizable = 'true';
    const initialSiteSize = selectEl.size || 4;
    const savedSize = await GM.getValue(storageKey, initialSiteSize);
    const maxVisibleOptions = selectEl.options.length > 1 ? selectEl.options.length : 20;
    selectEl.size = Math.max(MIN_VISIBLE_OPTIONS, Math.min(maxVisibleOptions, savedSize));
    const wrapper = document.createElement('div');
    wrapper.className = 'resizable-select-wrapper';
    const handle = document.createElement('div');
    handle.className = 'resizable-select-handle';
    handle.title = 'Drag to resize';
    selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);
    wrapper.appendChild(handle);
    let startY, startSize;
    let optionHeight = 0;
    const calculateOptionHeight = () => (parseFloat(window.getComputedStyle(selectEl).fontSize) || 16) * 1.3;
    optionHeight = calculateOptionHeight() || 20;
    const onDragStart = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        startY = e.clientY;
        startSize = selectEl.size;
        document.addEventListener('mousemove', onDragging);
        document.addEventListener('mouseup', onDragEnd, { once: true });
        document.body.style.userSelect = 'none';
    };
    const onDragging = (e) => {
        const deltaY = e.clientY - startY;
        const deltaSize = Math.round(deltaY / optionHeight);
        let newSize = startSize + deltaSize;
        newSize = Math.max(MIN_VISIBLE_OPTIONS, Math.min(maxVisibleOptions, newSize));
        if (newSize !== selectEl.size) {
            selectEl.size = newSize;
        }
    };
    const onDragEnd = async () => {
        document.removeEventListener('mousemove', onDragging);
        document.body.style.userSelect = '';
        await GM.setValue(storageKey, selectEl.size);
    };
    handle.addEventListener('mousedown', onDragStart);
}

function enhanceSelect(selector, storageKey) {
    const selectEl = document.querySelector(selector);
    if (selectEl && !selectEl.dataset.resizable) {
        makeSelectResizable(selectEl, storageKey).catch(console.error);
    }
}

(function main() {
    const path = window.location.pathname;
    const search = decodeURIComponent(window.location.search);

    const page = PAGE_CONFIG.find(p => p.pathTest(path, search));

    if (!page) return;

    if (page.isDynamic) {
        const observer = new MutationObserver(() => enhanceSelect(page.selector, page.storageKey));
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        enhanceSelect(page.selector, page.storageKey);
    }
})();