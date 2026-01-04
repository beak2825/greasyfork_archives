// ==UserScript==
// @name         better_drunkenslug_xxx_previews
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  Better Thumbnail preview for drunkenslug xxx with Hover zoom, gallery view, Ctrl-hover lightbox, click-to-add-to-cart, configurable keyword filters, and session-based new post highlighting
// @author       takuto
// @match        https://drunkenslug.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560255/better_drunkenslug_xxx_previews.user.js
// @updateURL https://update.greasyfork.org/scripts/560255/better_drunkenslug_xxx_previews.meta.js
// ==/UserScript==

const EBDS_ENABLED = (() => {
    try {
        const t = parseInt(new URLSearchParams(location.search).get('t'), 10);
        return (Number.isInteger(t) && t >= 6000 && t <= 6999) || location.pathname.startsWith('/search');
    } catch (e) { return false; }
})();

// Hover previews enabled (persisted in localStorage 'ebdsHoverEnabled')
let EBDS_HOVER_ENABLED = true;
try {
    const hv = localStorage.getItem('ebdsHoverEnabled');
    if (hv !== null) EBDS_HOVER_ENABLED = (hv === '1');
} catch (e) { }

const EBDS_DEFAULT_BLACKLIST_TERMS = [
    'a.b.multimedia.erotica.male'
];
const EBDS_BLACKLIST_STORAGE_KEY = 'ebdsBlacklistTerms';
const EBDS_HIDE_WITHOUT_PICS_STORAGE_KEY = 'ebdsHideWithoutPictures';
const EBDS_HIDE_WITH_PICS_LEGACY_KEY = 'ebdsHideWithPictures';

let EBDS_HIDE_WITHOUT_PICTURES = true;

function normalizeBlacklistTerm(term) {
    return (term || '').trim().toLowerCase();
}

function loadBlacklistTerms() {
    try {
        const stored = JSON.parse(localStorage.getItem(EBDS_BLACKLIST_STORAGE_KEY) || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
            return Array.from(new Set(stored.map(normalizeBlacklistTerm).filter(Boolean)));
        }
    } catch (e) { }
    return EBDS_DEFAULT_BLACKLIST_TERMS.slice();
}

function persistBlacklistTerms(terms) {
    try { localStorage.setItem(EBDS_BLACKLIST_STORAGE_KEY, JSON.stringify(terms)); } catch (e) { }
}

let EBDS_BLACKLIST_TERMS = loadBlacklistTerms();

let ctrlPressed = false;

function addToCartByGuid(guid, src) {
    let server = (window.SERVERROOT !== undefined) ? window.SERVERROOT : '/';
    let url = server + 'cart?add=' + guid;
    fetch(url, { method: 'POST', credentials: 'same-origin' }).then(resp => {
        if (resp.ok) {
            markAddedInDOM(guid, src);
        } else {
            resp.text().then(t => console.log('Add to cart failed', t));
        }
    }).catch(err => console.log('Add to cart error', err));
}

function markAddedInDOM(guidToUse, src) {
    // Remove original thumbnail wrapper in listing
    const orig = guidToUse ? document.querySelector('img.ebds-preview-img[data-guid="' + guidToUse + '"]') : null;
    if (orig) {
        const wrapper = orig.closest('.ebds-preview');
        try { if (wrapper) wrapper.remove(); else orig.remove(); } catch (e) { }
    }
    // Remove gallery items matching by data-guid or src
    try {
        const overlay = document.getElementById('ebds-gallery-overlay');
        if (overlay) {
            const galleryImgs = Array.from(overlay.querySelectorAll('img')).filter(i => {
                return (guidToUse && (i.dataset && i.dataset.guid == guidToUse)) || (src && i.src === src);
            });
            galleryImgs.forEach(imgElem => {
                const itemWrapper = imgElem.closest('.ebds-gallery-item');
                try { if (itemWrapper) itemWrapper.remove(); else imgElem.remove(); } catch (e) { }
            });
            // If no more items, close the gallery automatically
            if (!overlay.querySelector('.ebds-gallery-item')) {
                if (overlay.classList.contains('visible')) {
                    overlay.classList.remove('visible');
                    // restore container
                    try {
                        const container = document.querySelector('div.container-fluid');
                        if (container && container.hasAttribute('data-ebds-hidden')) {
                            container.style.display = '';
                            container.removeAttribute('data-ebds-hidden');
                        }
                    } catch (e) { }
                    // show config button
                    try {
                        const configBtn = document.querySelector('.ebds-config-button.ebds-floating');
                        if (configBtn) configBtn.style.display = '';
                    } catch (e) { }
                    // remove active from btn
                    try {
                        const btn = document.querySelector('.ebds-gallery-button');
                        if (btn) btn.classList.remove('active');
                    } catch (e) { }
                    try { localStorage.removeItem('ebdsGalleryOpen'); } catch (e) { }
                }
            }
        }
    } catch (e) { }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Control') {
        ctrlPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
        ctrlPressed = false;
    }
});

function applyRowFiltering() {
    if (!EBDS_ENABLED) return;
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const rowText = (row.textContent || '').toLowerCase();
        const containsBlacklistedTerm = EBDS_BLACKLIST_TERMS.some(term => term && rowText.includes(term));
        const hasOriginalImage = row.dataset && row.dataset.ebdsHasImgLink === '1';
        const isOperationsRow = (row.id === 'nzb_multi_operations') || !!row.querySelector('#nzb_multi_operations');
        const isReleaseRow = (!isOperationsRow) && (
            (row.id && row.id.indexOf('guid') === 0) ||
            !!row.querySelector('.icon_cart') ||
            !!row.querySelector('input[type="checkbox"][name^="nzbs"]')
        );
        const missingOriginalImage = EBDS_HIDE_WITHOUT_PICTURES && isReleaseRow && !hasOriginalImage;
        const shouldHide = containsBlacklistedTerm || missingOriginalImage;

        if (shouldHide) {
            row.dataset.ebdsHidden = '1';
            row.style.display = 'none';
            // Also remove from gallery if present
            const guid = row.id && row.id.indexOf('guid') === 0 ? row.id.substring(4) : null;
            if (guid) {
                const overlay = document.getElementById('ebds-gallery-overlay');
                if (overlay && overlay.classList.contains('visible')) {
                    const galleryImgs = Array.from(overlay.querySelectorAll('img')).filter(i => i.dataset.guid == guid);
                    galleryImgs.forEach(imgElem => {
                        const itemWrapper = imgElem.closest('.ebds-gallery-item');
                        if (itemWrapper) itemWrapper.remove();
                    });
                    // If no more items, close gallery
                    if (!overlay.querySelector('.ebds-gallery-item')) {
                        overlay.classList.remove('visible');
                        // restore container
                        try {
                            const container = document.querySelector('div.container-fluid');
                            if (container && container.hasAttribute('data-ebds-hidden')) {
                                container.style.display = '';
                                container.removeAttribute('data-ebds-hidden');
                            }
                        } catch (e) { }
                        // show config button
                        try {
                            const configBtn = document.querySelector('.ebds-config-button.ebds-floating');
                            if (configBtn) configBtn.style.display = '';
                        } catch (e) { }
                        // remove active from btn
                        try {
                            const btn = document.querySelector('.ebds-gallery-button');
                            if (btn) btn.classList.remove('active');
                        } catch (e) { }
                        try { localStorage.removeItem('ebdsGalleryOpen'); } catch (e) { }
                    }
                }
            }
        } else if (row.dataset.ebdsHidden === '1') {
            row.style.display = '';
            delete row.dataset.ebdsHidden;
        }
    });
}


(function () {
    'use strict';
    if (!EBDS_ENABLED) { console.log('ebds: disabled - t not in 6000-6999'); return; }

    function createImagePreview(link) {
        let div = document.createElement('div');
        div.classList.add('ebds-preview');
        div.style.display = 'inline-block';
        div.style.margin = '10px';
        div.style.position = 'relative';

        let img = document.createElement('img');
        img.classList.add('ebds-preview-img');
        // Use thumbnail src if available, else the link href
        let thumbSrc = link.querySelector('img') ? link.querySelector('img').src : link.href;
        img.src = thumbSrc;
        img.style.maxWidth = '400px';
        img.style.maxHeight = '400px';
        img.style.display = 'block';
        img.style.cursor = 'pointer';

        // Capture row/guid/cart at creation time so click handler can always find them
        let containingRow = link.closest('tr');
        let capturedGuid = null;
        let capturedCart = null;
        if (containingRow && containingRow.id && containingRow.id.indexOf('guid') === 0) {
            capturedGuid = containingRow.id.substring(4);
        }
        if (containingRow) {
            capturedCart = containingRow.querySelector('.icon_cart');
        }
        console.log('Preview created:', link.href, 'row?', !!containingRow, 'guid', capturedGuid, 'cart?', !!capturedCart);

        // expose a few data attributes so gallery items can add to cart later
        if (capturedGuid) try { img.dataset.guid = capturedGuid; } catch (e) { }
        try { img.dataset.href = link.href; } catch (e) { }
        if (containingRow && containingRow.id) try { img.dataset.rowId = containingRow.id; } catch (e) { };

        // Try to derive a display name and file size from the row (best-effort)
        let displayName = null;
        let displaySize = null;
        let displayPosted = null;
        let detailsHref = null;
        try {
            if (containingRow) {
                // Prefer a non-image link's text for the release name
                const nameAnchor = Array.from(containingRow.querySelectorAll('a')).find(a => a.href !== link.href && !a.href.match(/\.(jpeg|jpg|gif|png)$/) && a.textContent.trim().length > 0);
                if (nameAnchor) displayName = nameAnchor.textContent.trim();
                // Fallback: try the third cell which commonly holds the name
                if (!displayName) {
                    const nameCell = containingRow.querySelector('td:nth-child(3)');
                    if (nameCell) displayName = nameCell.textContent.trim();
                }
                // Size: look for patterns like "700 MB", "1.2 GB", etc.
                const sizeMatch = containingRow.textContent.match(/\b\d+(?:[.,]\d+)?\s*(KB|MB|GB|TB)\b/i);
                if (sizeMatch) displaySize = sizeMatch[0].trim();
                // Posted time: look for td with class "less mid"
                const timeCell = containingRow.querySelector('td.less.mid');
                if (timeCell) displayPosted = timeCell.textContent.trim();
                // Details href: look for a.title
                const titleLink = containingRow.querySelector('a.title');
                if (titleLink) detailsHref = titleLink.href;
            }
        } catch (e) { }
        if (displayName) try { img.dataset.name = displayName; } catch (e) { }
        if (displaySize) try { img.dataset.size = displaySize; } catch (e) { }
        if (displayPosted) try { img.dataset.posted = displayPosted; } catch (e) { }
        if (detailsHref) try { img.dataset.detailsHref = detailsHref; } catch (e) { }

        // Store caption data for the gallery (do not display inline in the listing)
        try {
            const posted = displayPosted || '';
            const name = displayName || '';
            const size = displaySize || '';
            let fullText;
            if (size) {
                const prefix = posted ? posted + ' • ' : '';
                const suffix = ' • ' + size;
                fullText = prefix + name + suffix;
            } else {
                const parts = [posted, name].filter(Boolean);
                fullText = parts.join(' • ');
            }
            if (fullText.trim()) img.title = fullText.trim(); // tooltip only
        } catch (e) { }

        // Create enlarged image container (full-screen modal like before)
        let enlargedContainer = document.createElement('div');
        enlargedContainer.style.position = 'fixed';
        // Make sure this is on top of the gallery overlay and floating buttons
        enlargedContainer.style.zIndex = '2147483660';
        enlargedContainer.style.display = 'none';
        enlargedContainer.style.top = '0';
        enlargedContainer.style.left = '0';
        enlargedContainer.style.width = '100vw';
        enlargedContainer.style.height = '100vh';
        enlargedContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
        enlargedContainer.style.alignItems = 'center';
        enlargedContainer.style.justifyContent = 'center';

        let enlargedImg = document.createElement('img');
        enlargedImg.src = link.href;
        enlargedImg.style.maxWidth = '90vw';
        enlargedImg.style.maxHeight = '90vh';
        enlargedImg.style.objectFit = 'contain';

        enlargedContainer.appendChild(enlargedImg);
        // mark for global close handling and allow clicking the overlay to close the enlarged preview
        enlargedContainer.classList.add('ebds-enlarged');
        enlargedContainer.addEventListener('click', function (ev) {
            if (ev.target === enlargedContainer) {
                enlargedContainer.style.display = 'none';
            }
        });
        // Append to body so it's not constrained by parent stacking contexts and will appear above overlays
        document.body.appendChild(enlargedContainer);

        // Add hover event for zoom onto the thumbnail image
        let hideTimeout;
        let suppressHide = false;
        img.addEventListener('mouseenter', function (e) {
            clearTimeout(hideTimeout);
            // If a click recently occurred, allow reopening but reset flag
            if (suppressHide) suppressHide = false;
            // Only show hover preview if enabled
            if (!EBDS_HOVER_ENABLED) return;
            enlargedContainer.style.display = 'flex';
        });

        // If hover previews are disabled, clicking the thumbnail opens the enlarged preview (user must click enlarged image to add to cart)
        img.addEventListener('click', function (e) {
            if (EBDS_HOVER_ENABLED) return;
            e.preventDefault();
            enlargedContainer.style.display = 'flex';
            try { enlargedContainer.dataset.openedAt = String(Date.now()); } catch (ex) { }
        });

        img.addEventListener('mouseleave', function () {
            // Only auto-hide when hover previews are enabled
            if (!EBDS_HOVER_ENABLED) return;
            hideTimeout = setTimeout(() => {
                if (suppressHide) return;
                enlargedContainer.style.display = 'none';
                try { delete enlargedContainer.dataset.openedAt; } catch (ex) { }
            }, 100);
        });

        // Add Ctrl+hover for lightbox preview
        img.addEventListener('mouseenter', (e) => {
            currentHoveredImg = img;
            if (e.ctrlKey || ctrlPressed) openHoverLightbox(img, img.src);
        });
        img.addEventListener('mousemove', (e) => {
            if (e.ctrlKey || ctrlPressed) openHoverLightbox(img, img.src);
            else closeHoverLightbox(img);
        });
        img.addEventListener('mouseleave', () => {
            currentHoveredImg = null;
            if (!ctrlPressed) closeHoverLightbox(img);
        });

        // If hover previews are disabled, clicking the thumbnail opens the enlarged preview (user must click enlarged image to add to cart)
        img.addEventListener('click', function (e) {
            if (window.EBDS_HOVER_ENABLED) return;
            e.preventDefault();
            enlargedContainer.style.display = 'flex';
        });

        // Small thumb-preview disabled here to avoid duplicating the site's own floating preview
        // (The page already provides a #thumb-preview element, so we rely on the native behavior.)

        // Keep preview open when moving between thumbnail and enlarged image
        enlargedContainer.addEventListener('mouseenter', function () {
            clearTimeout(hideTimeout);
        });

        // Also listen on the enlarged image itself so leaving the image (even
        // while still over the dark overlay) will close the preview
        enlargedImg.addEventListener('mouseenter', function () {
            clearTimeout(hideTimeout);
        });

        // Clicking the enlarged image should add the item to cart (same as cart icon)
        enlargedImg.addEventListener('click', function (e) {
            e.preventDefault();
            clearTimeout(hideTimeout);
            // If the enlarged preview was just opened via thumbnail click, ignore the first immediate click to avoid accidental add
            try {
                const openedAt = enlargedContainer.dataset.openedAt ? parseInt(enlargedContainer.dataset.openedAt, 10) : 0;
                if (openedAt && (Date.now() - openedAt) < 300) {
                    try { delete enlargedContainer.dataset.openedAt; } catch (ex) { }
                    return;
                }
            } catch (ex) { }
            suppressHide = true;

            // Hide/disable the original thumbnail immediately to avoid layout/mouse events causing flicker
            try { img.style.visibility = 'hidden'; img.style.pointerEvents = 'none'; } catch (ex) { }

            // Remove the thumbnail wrapper from the listing and update gallery if present
            function markAdded() {
                try { div.remove(); } catch (ex) { }
                // Remove the enlarged container appended to body as well (avoid orphaned modals)
                try { if (enlargedContainer && enlargedContainer.parentNode) enlargedContainer.remove(); } catch (ex) { }
                try { markAddedInDOM(capturedGuid, link.href); } catch (ex) { }
            }

            function restoreOnError(delay) {
                setTimeout(() => {
                    try { img.style.visibility = 'visible'; img.style.pointerEvents = 'auto'; } catch (ex) { }
                    suppressHide = false;
                }, delay);
            }

            console.log('Preview clicked for', link.href);

            // Determine row/cart/guid using captured values or live DOM as fallback
            let effectiveRow = containingRow || link.closest('tr') || null;
            if (!effectiveRow) console.log('Preview: no row found via captured or live lookup');

            let cart = capturedCart || (effectiveRow ? effectiveRow.querySelector('.icon_cart') : null);
            let guid = capturedGuid || (effectiveRow && effectiveRow.id && effectiveRow.id.indexOf('guid') === 0 ? effectiveRow.id.substring(4) : null);

            if (cart) {
                console.log('Preview: triggering cart click', cart);
                cart.click();

                setTimeout(() => {
                    if (cart.classList.contains('icon_cart_clicked')) {
                        console.log('Preview: cart clicked via site handler — marking thumbnail hidden and closing preview');
                        markAdded();
                        enlargedContainer.style.display = 'none';
                        // keep suppressHide true as thumbnail is hidden now
                    } else {
                        console.log('Preview: cart click did not set clicked class — falling back to POST');
                        if (guid) fallbackPost(guid, cart);
                        else { console.log('Preview: cannot determine guid to POST'); restoreOnError(400); }
                    }
                }, 200);

            } else if (guid) {
                console.log('Preview: no cart element — performing fallback POST for guid', guid);
                fallbackPost(guid, null);
            } else {
                console.log('Preview: cannot determine cart or guid for this preview');
                restoreOnError(400);
            }

            function fallbackPost(guidToUse, cartElem) {
                let server = (window.SERVERROOT !== undefined) ? window.SERVERROOT : '/';
                let url = server + 'cart?add=' + guidToUse;

                fetch(url, { method: 'POST', credentials: 'same-origin' }).then(resp => {
                    if (resp.ok) {
                        console.log('Preview: fallback POST success', url);
                        let c = cartElem || capturedCart;
                        if (c) {
                            c.classList.add('icon_cart_clicked');
                            c.setAttribute('title', ' Release added to Cart');
                        }

                        // Permanently hide the original thumbnail and show Added badge
                        markAdded();
                        enlargedContainer.style.display = 'none';
                    } else {
                        resp.text().then(t => { console.log('Preview: fallback POST failed', t); restoreOnError(400); });
                    }
                }).catch(err => { console.log('Preview: fallback POST error', err); restoreOnError(400); });
            }
        });

        enlargedImg.addEventListener('mouseleave', function () {
            if (!EBDS_HOVER_ENABLED) return;
            hideTimeout = setTimeout(() => {
                enlargedContainer.style.display = 'none';
                try { delete enlargedContainer.dataset.openedAt; } catch (ex) { }
            }, 100);
        });

        // Close when mouse leaves the enlarged container (e.g., to the browser chrome)
        enlargedContainer.addEventListener('mouseleave', function () {
            if (!EBDS_HOVER_ENABLED) return;
            hideTimeout = setTimeout(() => {
                enlargedContainer.style.display = 'none';
                try { delete enlargedContainer.dataset.openedAt; } catch (ex) { }
            }, 100);
        });

        // Close preview when the user scrolls, uses the wheel, touches and moves, or resizes the window
        function closeOnScrollOrResize() {
            clearTimeout(hideTimeout);
            if (enlargedContainer.style.display !== 'none') {
                enlargedContainer.style.display = 'none';
            }
        }
        window.addEventListener('scroll', closeOnScrollOrResize, { passive: true });
        window.addEventListener('wheel', closeOnScrollOrResize, { passive: true });
        window.addEventListener('touchmove', closeOnScrollOrResize, { passive: true });
        window.addEventListener('resize', closeOnScrollOrResize);

        // Insert thumbnail inline (previous behavior)
        div.appendChild(img);
        link.parentNode.insertBefore(div, link.nextSibling);
    }

    let currentHoveredImg = null;
    window.hoverLightboxes = new Map();

    function openHoverLightbox(img, src) {
        if (window.hoverLightboxes.has(img)) return;
        const lb = document.createElement('div');
        lb.className = 'ebds-hover-lb';
        lb.style.position = 'fixed';
        lb.style.inset = '0';
        lb.style.background = 'rgba(0,0,0,0.95)';
        lb.style.display = 'flex';
        lb.style.alignItems = 'center';
        lb.style.justifyContent = 'center';
        lb.style.zIndex = '2147483650';
        const im = document.createElement('img');
        im.src = src;
        im.style.maxWidth = '95vw';
        im.style.maxHeight = '95vh';
        im.style.objectFit = 'contain';
        lb.appendChild(im);
        im.style.cursor = 'pointer';
        im.title = 'Click to add to cart';
        im.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const guid = img.dataset.guid;
            if (guid) {
                addToCartByGuid(guid, img.src);
                lb.remove();
                window.hoverLightboxes.delete(img);
            }
        });
        lb.addEventListener('click', () => {
            lb.remove();
            window.hoverLightboxes.delete(img);
        });
        document.body.appendChild(lb);
        window.hoverLightboxes.set(img, lb);
    }

    function closeHoverLightbox(img) {
        const lb = window.hoverLightboxes.get(img);
        if (lb) {
            lb.remove();
            window.hoverLightboxes.delete(img);
        }
    }

    let rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        let imageLinks = Array.from(row.querySelectorAll('a[href]')).filter(link => link.href.match(/\.(jpeg|jpg|gif|png)$/));
        if (imageLinks.length === 0) return;
        // mark rows that originally had image links so filtering can hide them
        try { row.dataset.ebdsHasImgLink = '1'; } catch (e) { }
        // Prefer link with img (thumbnail), else first image link
        let preferredLink = imageLinks.find(link => link.querySelector('img')) || imageLinks[0];
        createImagePreview(preferredLink);
    });
})();

(function () {
    'use strict';
    if (!EBDS_ENABLED) return;
    applyRowFiltering();
})();

(function () {
    'use strict';
    if (!EBDS_ENABLED) return;

    let links = document.querySelectorAll('a');

    links.forEach(link => {
        const t = link.textContent.trim();
        if (t === 'Thumbnail' || t === 'Preview') {
            link.remove();
        }
    });
})();

(function () {
    'use strict';
    if (!EBDS_ENABLED) return;
    // Inject CSS for gallery button and overlay
    const style = document.createElement('style');
    style.textContent = `
    .ebds-gallery-button{
        position:fixed;
        right:16px;
        bottom:16px;
        transform:none;
        z-index:2147483646;
        background:#0d6efd;
        color:white;
        border:none;
        border-radius:50%;
        width:56px;
        height:56px;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 6px 18px rgba(0,0,0,0.25);
        cursor:pointer;
        font-weight:600;
        font-size:14px;
    }
    .ebds-gallery-button.active{
        background:white;
        color:#0d6efd;
    }
    .ebds-config-button{
        z-index:2147483646;
        background:#f0ad4e;
        color:#1b1f24;
        border:none;
        border-radius:10px;
        padding:8px 12px;
        min-width:72px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 6px 18px rgba(0,0,0,0.18);
        cursor:pointer;
        font-weight:700;
        font-size:12px;
        line-height:1.2;
        gap:6px;
    }
    .ebds-config-button.ebds-floating{
        position:fixed;
        top:12px;
        right:16px;
        transform:none;
    }
    .ebds-config-panel{
        position:fixed;
        right:16px;
        top:60px;
        bottom:auto;
        width:320px;
        max-width:90vw;
        background:#0f0f0f;
        color:#eee;
        border:1px solid rgba(255,255,255,0.08);
        border-radius:12px;
        padding:12px;
        box-shadow:0 12px 32px rgba(0,0,0,0.55);
        z-index:2147483647;
        display:none;
        max-height:80vh;
        overflow-y:auto;
    }
    .ebds-config-panel.visible{ display:block; }
    .ebds-config-title{ font-weight:700; font-size:14px; margin-bottom:4px; }
    .ebds-config-desc{ color:#b5b5b5; font-size:12px; margin-bottom:8px; }
    .ebds-config-row{ display:flex; gap:8px; }
    .ebds-config-input{ flex:1; padding:7px 8px; border-radius:8px; border:1px solid #2b2b2b; background:#1a1a1a; color:#eee; }
    .ebds-config-add{ background:#0d6efd; color:white; border:none; border-radius:8px; padding:7px 10px; font-weight:700; cursor:pointer; }
    .ebds-chip-list{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .ebds-chip{ background:#191919; border:1px solid #2d2d2d; padding:6px 8px; border-radius:999px; display:inline-flex; align-items:center; gap:6px; font-size:12px; }
    .ebds-chip button{ background:none; border:none; color:#bbb; cursor:pointer; font-weight:700; }
    .ebds-chip button:hover{ color:#fff; }
    .ebds-config-empty{ color:#888; font-size:12px; }
    .ebds-config-actions{ display:flex; justify-content:flex-end; margin-top:10px; }
    .ebds-config-close{ background:#343a40; color:white; border:none; border-radius:8px; padding:6px 10px; cursor:pointer; }
    .ebds-config-toggle{ display:flex; align-items:center; gap:8px; margin:0; font-size:12px; }
    .ebds-config-toggle input[type="checkbox"]{ width:16px; height:16px; }
    .ebds-config-toggle input[type="range"]{ -webkit-appearance: none; appearance: none; background: #ddd; height: 6px; border-radius: 3px; flex:1; }
    .ebds-config-toggle input[type="range"]::-webkit-slider-thumb{ -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #0d6efd; border-radius: 50%; cursor: pointer; }
    .ebds-config-toggle input[type="range"]::-moz-range-thumb{ width: 16px; height: 16px; background: #0d6efd; border-radius: 50%; cursor: pointer; border: none; }
    .ebds-category-toggles{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
    #ebds-gallery-overlay{
        position:fixed;
        inset:0;
        z-index:2147483645;
        background:rgba(0,0,0,0.9);
        display:none;
        padding:24px;
        overflow:auto;
    }
    #ebds-gallery-overlay.visible{ display:block; }
    .ebds-gallery-grid{
        display:grid;
        grid-template-columns: repeat(var(--ebds-cols, 3), minmax(0, 1fr));
        gap:16px;
        align-items:start;
    }
    .ebds-gallery-item img{
        width:100%;
        height:auto;
        max-height:350px;
        display:block;
        border-radius:6px;
        box-shadow:0 4px 12px rgba(0,0,0,0.5);
        cursor:pointer;
    }
    .ebds-gallery-item{ position:relative; }
    .ebds-preview-caption{
        margin-top:6px;
        font-size:12px;
        color:#ddd;
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    /* Highlight for posts newer than last visit */
    .ebds-preview-caption.ebds-new-post{
        color: #7ab800; /* green */
    }
    .ebds-gallery-category-links{
        margin-top:0px;
        display:flex;
        justify-content:center;
        gap:10px;
        flex-wrap:wrap;
    }
    .ebds-gallery-category-links a{
        color:#ddd;
        text-decoration:none;
    }
    .ebds-gallery-category-links a:hover{
        color:#fff;
    }
    .ebds-gallery-pagination{
        margin-top:0px;
        display:flex;
        justify-content:center;
        color:#ddd;
    }
    .ebds-gallery-pagination .pagination{ margin:0; }
    .ebds-gallery-pagination a, .ebds-gallery-pagination span { color: #ddd; }
    `;
    document.head.appendChild(style);

    let EBDS_GALLERY_COLS = 3;
    try { EBDS_GALLERY_COLS = parseInt(localStorage.getItem('ebdsGalleryCols')) || 3; } catch (e) { }

    const EBDS_SESSION_EXPIRATION_KEY = 'ebdsSessionExpirationMinutes';
    let EBDS_SESSION_EXPIRATION_MINUTES = 5;
    try { EBDS_SESSION_EXPIRATION_MINUTES = parseInt(localStorage.getItem(EBDS_SESSION_EXPIRATION_KEY)) || 5; } catch (e) { }

    const categoryLinks = [
        { id: 'todaysTop', href: '/browse?t=6000&top=1', title: 'Todays Top Grabs', text: 'Todays Top Grabs' },
        { id: 'allXxx', href: '/browse?t=6000', text: 'All XXX' },
        { id: 'dvd', href: '/browse?t=6010', text: 'DVD' },
        { id: 'hd', href: '/browse?t=6040', text: 'HD' },
        { id: 'other', href: '/browse?t=6999', text: 'Other' },
        { id: 'packs', href: '/browse?t=6070', text: 'Packs' },
        { id: 'sd', href: '/browse?t=6080', text: 'SD' },
        { id: 'uhd', href: '/browse?t=6045', text: 'UHD' },
        { id: 'vr', href: '/browse?t=6050', text: 'VR' },
        { id: 'wmv', href: '/browse?t=6020', text: 'WMV' },
        { id: 'xvid', href: '/browse?t=6030', text: 'XviD' }
    ];

    // Create floating button
    const btn = document.createElement('button');
    btn.className = 'ebds-gallery-button';
    btn.title = 'Open image gallery (G)';
    btn.textContent = 'Gallery';
    document.body.appendChild(btn);

    // Configuration button and panel for blacklist keywords
    const configBtn = document.createElement('button');
    configBtn.className = 'ebds-config-button ebds-floating';
    configBtn.title = 'Configure EBDS keyword filters';
    configBtn.textContent = 'Config';
    document.body.appendChild(configBtn);

    const configPanel = document.createElement('div');
    configPanel.className = 'ebds-config-panel';
    configPanel.innerHTML = `
        <div class="ebds-config-title">Keyboard shortcuts</div>
        <div class="ebds-config-desc">G: Gallery | ←/→: Navigate | Esc: Close | Ctrl-hover: Preview</div>
        <div class="ebds-config-toggle">
            <input class="ebds-hover-toggle" type="checkbox" id="ebdsHoverToggle">
            <label for="ebdsHoverToggle">Enable hover previews</label>
        </div>
        <div class="ebds-config-toggle">
            <input class="ebds-hide-nopics-toggle" type="checkbox" id="ebdsHideNoPicsToggle">
            <label for="ebdsHideNoPicsToggle">Hide items without pictures</label>
        </div>
        <div class="ebds-config-toggle">
            <label for="ebdsGalleryCols">Gallery columns: <span id="ebdsGalleryColsValue">3</span></label>
            <input type="range" id="ebdsGalleryCols" min="1" max="10" value="3">
        </div>
        <div class="ebds-config-toggle">
            <label for="ebdsSessionExpirationInput">Session expiration (mins): <span id="ebdsSessionExpirationValue">5</span></label>
            <input type="number" id="ebdsSessionExpirationInput" min="1" max="1440" value="5" style="width:80px; padding:4px;">
            <button id="ebdsSessionExpirationSet" type="button" class="ebds-config-add" style="margin-left:8px; padding:6px 8px;">Set</button>
        </div>
        <div class="ebds-config-title">Exclude keywords</div>
        <div class="ebds-config-desc">Rows containing these terms will be hidden.</div>
        <div class="ebds-config-row">
            <input class="ebds-config-input" type="text" placeholder="Add keyword..." aria-label="Add keyword to exclude">
            <button class="ebds-config-add" type="button">Add</button>
        </div>
        <div class="ebds-chip-list"></div>
        <br>
        <div class="ebds-config-actions"><button class="ebds-config-close" type="button">Close</button></div>
    `;
    document.body.appendChild(configPanel);

    const categoryLinksDiv = document.createElement('div');
    categoryLinksDiv.innerHTML = '<div class="ebds-config-title">Category links visibility</div><div class="ebds-config-desc">Choose which category links to show in the gallery.</div><div class="ebds-category-toggles"></div>';
    configPanel.appendChild(categoryLinksDiv);

    const actions = configPanel.querySelector('.ebds-config-actions');
    if (actions) {
        configPanel.insertBefore(categoryLinksDiv, actions);
    }

    const EBDS_LINK_VISIBILITY_KEY = 'ebdsCategoryLinksVisibility';

    function loadLinkVisibility() {
        try {
            const stored = JSON.parse(localStorage.getItem(EBDS_LINK_VISIBILITY_KEY) || '{}');
            return stored;
        } catch (e) {
            return {};
        }
    }

    function persistLinkVisibility(vis) {
        try {
            localStorage.setItem(EBDS_LINK_VISIBILITY_KEY, JSON.stringify(vis));
        } catch (e) {}
    }

    let EBDS_LINK_VISIBILITY = loadLinkVisibility();

    categoryLinks.forEach(link => {
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'ebds-config-toggle';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'ebdsLink' + link.id;
        input.checked = EBDS_LINK_VISIBILITY[link.id] !== false;
        input.addEventListener('change', () => {
            EBDS_LINK_VISIBILITY[link.id] = input.checked;
            persistLinkVisibility(EBDS_LINK_VISIBILITY);
        });
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = link.text;
        toggleDiv.appendChild(input);
        toggleDiv.appendChild(label);
        categoryLinksDiv.querySelector('.ebds-category-toggles').appendChild(toggleDiv);
    });

    const blacklistInput = configPanel.querySelector('.ebds-config-input');
    const blacklistList = configPanel.querySelector('.ebds-chip-list');
    const addBlacklistBtn = configPanel.querySelector('.ebds-config-row .ebds-config-add');
    const closeConfigBtn = configPanel.querySelector('.ebds-config-close');
    const hoverToggle = configPanel.querySelector('.ebds-hover-toggle');
    const hidePicsToggle = configPanel.querySelector('.ebds-hide-nopics-toggle');

    if (hoverToggle) {
        hoverToggle.checked = EBDS_HOVER_ENABLED;
        hoverToggle.addEventListener('change', () => {
            EBDS_HOVER_ENABLED = !!hoverToggle.checked;
            try { localStorage.setItem('ebdsHoverEnabled', EBDS_HOVER_ENABLED ? '1' : '0'); } catch (e) { }
        });
    }

    if (hidePicsToggle) {
        hidePicsToggle.checked = EBDS_HIDE_WITHOUT_PICTURES;
        hidePicsToggle.addEventListener('change', () => {
            EBDS_HIDE_WITHOUT_PICTURES = !!hidePicsToggle.checked;
            try { localStorage.setItem(EBDS_HIDE_WITHOUT_PICS_STORAGE_KEY, EBDS_HIDE_WITHOUT_PICTURES ? '1' : '0'); } catch (e) { }
            applyRowFiltering();
        });
    }

    const galleryColsSlider = configPanel.querySelector('#ebdsGalleryCols');
    const galleryColsValue = configPanel.querySelector('#ebdsGalleryColsValue');
    if (galleryColsSlider && galleryColsValue) {
        galleryColsSlider.value = EBDS_GALLERY_COLS;
        galleryColsValue.textContent = EBDS_GALLERY_COLS;
        galleryColsSlider.addEventListener('input', () => {
            const val = parseInt(galleryColsSlider.value);
            EBDS_GALLERY_COLS = val;
            galleryColsValue.textContent = val;
            try { localStorage.setItem('ebdsGalleryCols', val.toString()); } catch (e) { }
            // Update grid columns
            grid.style.setProperty('--ebds-cols', val);
        });
    }

    // Session expiration minutes control
    const sessionExpirationInput = configPanel.querySelector('#ebdsSessionExpirationInput');
    const sessionExpirationValue = configPanel.querySelector('#ebdsSessionExpirationValue');
    const sessionExpirationSetBtn = configPanel.querySelector('#ebdsSessionExpirationSet');
    if (sessionExpirationInput && sessionExpirationValue) {
        sessionExpirationInput.value = EBDS_SESSION_EXPIRATION_MINUTES;
        sessionExpirationValue.textContent = EBDS_SESSION_EXPIRATION_MINUTES;
        function applySessionExpiration() {
            let m = parseInt(sessionExpirationInput.value, 10);
            if (!Number.isFinite(m) || m < 1) m = 1;
            if (m > 1440) m = 1440;
            EBDS_SESSION_EXPIRATION_MINUTES = m;
            sessionExpirationInput.value = m;
            sessionExpirationValue.textContent = m;
            try { localStorage.setItem(EBDS_SESSION_EXPIRATION_KEY, String(m)); } catch (e) { }
        }
        sessionExpirationSetBtn && sessionExpirationSetBtn.addEventListener('click', applySessionExpiration);
        sessionExpirationInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applySessionExpiration(); });
        sessionExpirationInput.addEventListener('blur', applySessionExpiration);
    }


    function renderBlacklistChips() {
        blacklistList.innerHTML = '';
        if (!EBDS_BLACKLIST_TERMS.length) {
            const empty = document.createElement('div');
            empty.className = 'ebds-config-empty';
            empty.textContent = 'No keywords yet.';
            blacklistList.appendChild(empty);
            return;
        }

        EBDS_BLACKLIST_TERMS.forEach(term => {
            const chip = document.createElement('div');
            chip.className = 'ebds-chip';
            const label = document.createElement('span');
            label.textContent = term;
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.title = 'Remove keyword';
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', () => {
                EBDS_BLACKLIST_TERMS = EBDS_BLACKLIST_TERMS.filter(t => t !== term);
                persistBlacklistTerms(EBDS_BLACKLIST_TERMS);
                applyRowFiltering();
                renderBlacklistChips();
            });
            chip.appendChild(label);
            chip.appendChild(removeBtn);
            blacklistList.appendChild(chip);
        });
    }

    function addBlacklistTerm(raw) {
        const normalized = normalizeBlacklistTerm(raw);
        if (!normalized) return;
        if (!EBDS_BLACKLIST_TERMS.includes(normalized)) {
            EBDS_BLACKLIST_TERMS.push(normalized);
            persistBlacklistTerms(EBDS_BLACKLIST_TERMS);
            applyRowFiltering();
            renderBlacklistChips();
        }
    }

    addBlacklistBtn.addEventListener('click', () => {
        addBlacklistTerm(blacklistInput.value);
        blacklistInput.value = '';
        blacklistInput.focus();
    });

    blacklistInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBlacklistTerm(blacklistInput.value);
            blacklistInput.value = '';
            blacklistInput.focus();
        }
    });

    configBtn.addEventListener('click', () => {
        const nowVisible = !configPanel.classList.contains('visible');
        configPanel.classList.toggle('visible');
        if (nowVisible) {
            renderBlacklistChips();
            if (hoverToggle) hoverToggle.checked = EBDS_HOVER_ENABLED;
            if (hidePicsToggle) hidePicsToggle.checked = EBDS_HIDE_WITHOUT_PICTURES;
            blacklistInput.focus();
        }
    });

    closeConfigBtn.addEventListener('click', () => {
        configPanel.classList.remove('visible');
    });

    // Keep Config button floating on the right side of the viewport

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'ebds-gallery-overlay';
    const grid = document.createElement('div');
    grid.className = 'ebds-gallery-grid';
    overlay.appendChild(grid);
    document.body.appendChild(overlay);

    // Quick state for gallery hover lightboxes
    let galleryHoverLightboxes = new Map();
    let currentHoveredGalleryItem = null;
    // Track whether Control is currently pressed so we don't accidentally close the hover lightbox while it's held
    // using global ctrlPressed

    // preserve previous display value of the main browse container so we can hide/show it
    let browseContainerPrevDisplay = null;

    // Default columns
    let DEFAULT_COLS = EBDS_GALLERY_COLS;

    // Set initial columns
    grid.style.setProperty('--ebds-cols', DEFAULT_COLS);

    // --- EBDS: per-category session and saved state helpers ---
    const EBDS_SESSION_PREFIX = 'ebdSession_';
    const EBDS_SAVED_PREFIX = 'ebdSaved_';
    const EBDS_SAVED_EXPIRED_PREFIX = 'ebdSavedExpired_';

    function getCategoryIdFromUrl() {
        try {
            const params = new URLSearchParams(location.search);
            const t = params.get('t');
            if (t) {
                const match = categoryLinks.find(l => l.href && l.href.indexOf('t=' + t) !== -1);
                if (match) return match.id;
            }
            // Fallback: try to match a visible category link by pathname/search
            const href = location.pathname + (location.search || '');
            const match = categoryLinks.find(l => href.indexOf(l.href) !== -1 || l.href.indexOf(href) !== -1);
            if (match) return match.id;
        } catch (e) { }
        return null;
    }

    function parseRowTitleEpoch(row) {
        try {
            if (!row) return null;
            // Look for the first time cell with a title attribute: <td class="less mid" title="YYYY-MM-DD HH:MM:SS">...
            const timeCell = row.querySelector('td.less.mid[title]');
            if (!timeCell) return null;
            const t = timeCell.getAttribute('title');
            if (!t) return null;
            // Convert to ISO-ish form to be parsed as local datetime: replace first space with 'T'
            const iso = t.replace(' ', 'T');
            const d = new Date(iso);
            const ms = d.getTime();
            return Number.isFinite(ms) ? ms : null;
        } catch (e) { return null; }
    }

    function getSessionTimestamp(catId) {
        try {
            if (!catId) return 0;
            const v = localStorage.getItem(EBDS_SESSION_PREFIX + catId);
            if (!v) return 0;
            const n = parseInt(v, 10);
            return Number.isFinite(n) ? n : 0;
        } catch (e) { return 0; }
    }

    function setSessionTimestamp(catId, epochMs) {
        try {
            if (!catId || !epochMs) return;
            localStorage.setItem(EBDS_SESSION_PREFIX + catId, String(Number(epochMs)));
        } catch (e) { }
    }

    function getSavedTimestamp(catId) {
        try {
            if (!catId) return 0;
            const v = localStorage.getItem(EBDS_SAVED_PREFIX + catId);
            if (!v) return 0;
            const n = parseInt(v, 10);
            return Number.isFinite(n) ? n : 0;
        } catch (e) { return 0; }
    }

    function setSavedTimestamp(catId, epochMs) {
        try {
            if (!catId || !epochMs) return;
            localStorage.setItem(EBDS_SAVED_PREFIX + catId, String(Number(epochMs)));
        } catch (e) { }
    }

    function getSavedExpiredTimestamp(catId) {
        try {
            if (!catId) return 0;
            const v = localStorage.getItem(EBDS_SAVED_EXPIRED_PREFIX + catId);
            if (!v) return 0;
            const n = parseInt(v, 10);
            return Number.isFinite(n) ? n : 0;
        } catch (e) { return 0; }
    }

    function setSavedExpiredTimestamp(catId, epochMs) {
        try {
            if (!catId || !epochMs) return;
            localStorage.setItem(EBDS_SAVED_EXPIRED_PREFIX + catId, String(Number(epochMs)));
        } catch (e) { }
    }

    function getLastVisitTimestamp(catId) {
        // For highlighting, use ebdSavedExpired
        return getSavedExpiredTimestamp(catId);
    }

    function updateLastVisitFromPageOnLoad() {
        try {
            const catId = getCategoryIdFromUrl();
            if (!catId) return;
            const params = new URLSearchParams(location.search);
            const offset = params.get('offset');
            const now = Date.now();
            const sessionExpirationMs = EBDS_SESSION_EXPIRATION_MINUTES * 60 * 1000;
            const lastSession = getSessionTimestamp(catId);
            const sessionExpired = !lastSession || (now - lastSession) >= sessionExpirationMs;

            if (sessionExpired) {
                // Session expired: backup ebdSaved to ebdSavedExpired if exists
                const currentSaved = getSavedTimestamp(catId);
                if (currentSaved) {
                    setSavedExpiredTimestamp(catId, currentSaved);
                }
                // Update session timestamp
                setSessionTimestamp(catId, now);
                // If on first page, save the first item's timestamp to ebdSaved
                if (!offset || offset === '0') {
                    const firstRow = document.querySelector('tr[id^="guid"]');
                    if (firstRow) {
                        const epoch = parseRowTitleEpoch(firstRow);
                        if (epoch) {
                            setSavedTimestamp(catId, epoch);
                        }
                    }
                }
            } else {
                // Session not expired: just update session timestamp
                setSessionTimestamp(catId, now);
            }
        } catch (e) { }
    }

    function openGallery() {
        grid.innerHTML = '';
        // determine last-visit epoch for the current category (if any)
        const currentCategoryId = getCategoryIdFromUrl();
        const lastVisit = currentCategoryId ? getLastVisitTimestamp(currentCategoryId) : 0;

        const imgs = Array.from(document.querySelectorAll('.ebds-preview-img'));
        imgs.forEach((img, idx) => {
            // Skip images from hidden rows (filtered out)
            const rowId = img.dataset.rowId;
            if (rowId) {
                const row = document.getElementById(rowId);
                if (row && row.style.display === 'none') return;
            }
            const item = document.createElement('div');
            item.className = 'ebds-gallery-item';
            const copy = img.cloneNode(true);
            // Remove inline transition handlers to avoid duplication issues
            copy.style.maxWidth = '';
            copy.style.maxHeight = '';
            copy.addEventListener('click', (e) => {
                e.preventDefault();
                const guid = copy.dataset.guid || (copy.getAttribute('data-guid') || null);
                if (guid) addToCartForGuid(guid, copy.src);
                else addToCartBySrc(copy.src);
            });

            item.appendChild(copy);
            // add caption under clone (use stored data attributes if available)
            try {
                const detailsHref = copy.dataset.detailsHref;
                const caption = document.createElement(detailsHref ? 'a' : 'div');
                caption.className = 'ebds-preview-caption';
                if (detailsHref) {
                    caption.href = detailsHref;
                    caption.style.textDecoration = 'none';
                }
                const posted = copy.dataset.posted || '';
                const name = copy.dataset.name || '';
                const size = copy.dataset.size || '';
                let txt;
                if (size) {
                    const prefix = posted ? posted + ' • ' : '';
                    const suffix = ' • ' + size;
                    const full = prefix + name + suffix;
                    const maxLen = 80;
                    if (full.length > maxLen) {
                        const available = maxLen - prefix.length - suffix.length;
                        if (available > 1) {
                            const truncatedName = name.substring(0, available - 1) + '…';
                            txt = prefix + truncatedName + suffix;
                        } else {
                            txt = full.substring(0, maxLen - 1) + '…';
                        }
                    } else {
                        txt = full;
                    }
                } else {
                    const parts = [posted, name].filter(Boolean);
                    txt = parts.join(' • ');
                    const maxLen = 80;
                    txt = txt.length > maxLen ? txt.substring(0, maxLen - 1) + '…' : txt;
                }
                caption.textContent = txt;
                try {
                    // Mark as new when the parsed row epoch is newer than stored last visit for this category
                    const row = copy.dataset.rowId ? document.getElementById(copy.dataset.rowId) : null;
                    const itemEpoch = row ? parseRowTitleEpoch(row) : null;
                    if (itemEpoch && lastVisit && itemEpoch > lastVisit) {
                        caption.classList.add('ebds-new-post');
                    }
                } catch (e) { }
                item.appendChild(caption);
            } catch (e) { }
            // Add ctrl+hover behavior: open a large preview while holding Control
            try {
                copy.addEventListener('mouseenter', (e) => {
                    currentHoveredGalleryItem = item;
                    if (e.ctrlKey || ctrlPressed) openGalleryHoverLightbox(item, copy.src);
                });
                copy.addEventListener('mousemove', (e) => {
                    // open when ctrl is indicated (either via event or global flag); don't close while ctrl is held
                    if (e.ctrlKey || ctrlPressed) openGalleryHoverLightbox(item, copy.src);
                    else closeGalleryHoverLightbox(item);
                });
                copy.addEventListener('mouseleave', (e) => {
                    currentHoveredGalleryItem = null;
                    // Only close when Ctrl is NOT pressed
                    if (!ctrlPressed) closeGalleryHoverLightbox(item);
                });
            } catch (ex) { }
            grid.appendChild(item);
        });

        // Add category links at the top of gallery
        try {
            // remove existing category links if present
            const oldLinks = overlay.querySelectorAll('.ebds-gallery-category-links');
            oldLinks.forEach(l => l.remove());
            const linksDiv = document.createElement('div');
            linksDiv.className = 'ebds-gallery-category-links';
            const links = categoryLinks;
            const visibleLinks = links.filter(link => EBDS_LINK_VISIBILITY[link.id] !== false);
            for (let i = 0; i < visibleLinks.length; i++) {
                const link = visibleLinks[i];
                const a = document.createElement('a');
                a.href = link.href;
                if (link.title) a.title = link.title;
                a.textContent = link.text;
                a.addEventListener('click', () => { try { localStorage.setItem('ebdsGalleryOpen', '1'); } catch (e) { } });
                linksDiv.appendChild(a);
                if (i < visibleLinks.length - 1) {
                    linksDiv.appendChild(document.createTextNode(' | '));
                }
            }
            overlay.insertBefore(linksDiv, grid);
        } catch (e) { }

        // Append page pagination to top and bottom of gallery overlay (if present on the page)
        try {
            // remove existing gallery pagination clones if present
            const oldPags = overlay.querySelectorAll('.ebds-gallery-pagination');
            oldPags.forEach(p => p.remove());
            const pageNav = document.querySelector('nav.pagination[aria-label="Pagination"]');
            if (pageNav) {
                const clonedNavTop = pageNav.cloneNode(true);
                clonedNavTop.classList.add('ebds-gallery-pagination');
                const clonedNavBottom = pageNav.cloneNode(true);
                clonedNavBottom.classList.add('ebds-gallery-pagination');
                // Keep gallery open across pages: do NOT close the gallery when pagination links are clicked.
                // Instead ensure the persistent flag is set so the new page will re-open the gallery.
                [clonedNavTop, clonedNavBottom].forEach(clonedNav => {
                    try { clonedNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { try { localStorage.setItem('ebdsGalleryOpen', '1'); } catch (e) { } })); } catch (e) { }
                });
                overlay.insertBefore(clonedNavTop, grid);
                overlay.appendChild(clonedNavBottom);
            }
        } catch (e) { }

        try {
            const container = document.querySelector('div.container-fluid');
            if (container) {
                browseContainerPrevDisplay = container.style.display;
                container.style.display = 'none';
                container.setAttribute('data-ebds-hidden', '1');
            }
        } catch (e) { }
        overlay.classList.add('visible');
        btn.classList.add('active');
        try { localStorage.setItem('ebdsGalleryOpen', '1'); } catch (e) { }
    }

    function closeGallery() {
        try {
            const container = document.querySelector('div.container-fluid');
            if (container && browseContainerPrevDisplay !== null) {
                container.style.display = browseContainerPrevDisplay;
                container.removeAttribute('data-ebds-hidden');
            }
            browseContainerPrevDisplay = null;
        } catch (e) { }
        overlay.classList.remove('visible');
        btn.classList.remove('active');
        try { localStorage.removeItem('ebdsGalleryOpen'); } catch (e) { }
    }

    function openLightbox(src) {
        // Simple full-screen lightbox
        const lb = document.createElement('div');
        lb.style.position = 'fixed';
        lb.style.inset = '0';
        lb.style.background = 'rgba(0,0,0,0.9)';
        lb.style.display = 'flex';
        lb.style.alignItems = 'center';
        lb.style.justifyContent = 'center';
        lb.style.zIndex = '2147483647';
        const im = document.createElement('img');
        im.src = src;
        im.style.maxWidth = '90vw';
        im.style.maxHeight = '90vh';
        im.style.objectFit = 'contain';
        lb.appendChild(im);
        lb.addEventListener('click', () => lb.remove());
        document.body.appendChild(lb);
    }

    // Hover lightboxes inside the gallery (opened while Ctrl is held)
    function openGalleryHoverLightbox(item, src) {
        try {
            if (galleryHoverLightboxes.has(item)) return;
            const lb = document.createElement('div');
            lb.className = 'ebds-gallery-hover-lb';
            lb.style.position = 'fixed';
            lb.style.inset = '0';
            lb.style.background = 'rgba(0,0,0,0.95)';
            lb.style.display = 'flex';
            lb.style.alignItems = 'center';
            lb.style.justifyContent = 'center';
            lb.style.zIndex = '2147483650';
            const im = document.createElement('img');
            im.src = src;
            im.style.maxWidth = '95vw';
            im.style.maxHeight = '95vh';
            im.style.objectFit = 'contain';
            lb.appendChild(im);
            // image click => add to cart; background click closes lightbox. (Escape handled globally)
            im.style.cursor = 'pointer';
            im.title = 'Click to add to cart';
            im.addEventListener('click', (ev) => {
                ev.stopPropagation();
                try {
                    const guidImg = item.querySelector('img');
                    const guid = guidImg && guidImg.dataset ? (guidImg.dataset.guid || null) : null;
                    if (guid) addToCartForGuid(guid, src);
                    else addToCartBySrc(src);
                } catch (e) { console.log('hover-lightbox add-to-cart error', e); }
                try { lb.remove(); } catch (e) { }
                try { galleryHoverLightboxes.delete(item); } catch (e) { }
            });
            lb.addEventListener('click', () => {
                try { lb.remove(); } catch (e) { }
                galleryHoverLightboxes.delete(item);
            });
            document.body.appendChild(lb);
            galleryHoverLightboxes.set(item, lb);
        } catch (e) { console.log('openGalleryHoverLightbox error', e); }
    }

    function closeGalleryHoverLightbox(item) {
        try {
            const lb = galleryHoverLightboxes.get(item);
            if (lb) {
                try { lb.remove(); } catch (e) { }
                galleryHoverLightboxes.delete(item);
            }
        } catch (e) { }
    }

    // Open hover lightbox when Control is pressed while hovering over a gallery item
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            ctrlPressed = true;
            try {
                if (currentHoveredGalleryItem) {
                    const img = currentHoveredGalleryItem.querySelector('img');
                    if (img) openGalleryHoverLightbox(currentHoveredGalleryItem, img.src);
                }
            } catch (ex) { console.log('keydown ctrl openGalleryHoverLightbox error', ex); }
        }
    });

    // Close hover lightboxes when Ctrl is released
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            ctrlPressed = false;
            try { galleryHoverLightboxes.forEach((lb, item) => { lb.remove(); }); galleryHoverLightboxes.clear(); } catch (ex) { }
            try { window.hoverLightboxes.forEach((lb, img) => { lb.remove(); }); window.hoverLightboxes.clear(); } catch (ex) { }
        }
    });

    // Also close hover lightboxes when gallery closes
    const originalCloseGallery = closeGallery;
    closeGallery = function () {
        try { galleryHoverLightboxes.forEach((lb, item) => { lb.remove(); }); galleryHoverLightboxes.clear(); } catch (ex) { }
        originalCloseGallery();
    };

    // --- helper: add to cart by guid or src ---
    function addToCartForGuid(guid, src) {
        let row = document.getElementById('guid' + guid);
        let cart = row ? row.querySelector('.icon_cart') : null;
        if (cart) {
            cart.click();
            setTimeout(() => {
                if (cart.classList.contains('icon_cart_clicked')) {
                    markAddedInDOM(guid, src);
                } else {
                    fallbackPost(guid, cart, src);
                }
            }, 200);
        } else {
            fallbackPost(guid, null, src);
        }
    }

    function addToCartBySrc(src) {
        const anchor = Array.from(document.querySelectorAll('a[href]')).find(a => a.href === src);
        if (anchor) {
            const row = anchor.closest('tr');
            const guid = row && row.id && row.id.indexOf('guid') === 0 ? row.id.substring(4) : null;
            if (guid) { addToCartForGuid(guid, src); return; }
        }
        try { if (window.$ && $.pnotify) { $.pnotify({ title: 'CART', text: 'Could not determine item to add', type: 'error' }); } } catch (e) { }
    }

    function fallbackPost(guidToUse, cartElem, src) {
        let server = (window.SERVERROOT !== undefined) ? window.SERVERROOT : '/';
        let url = server + 'cart?add=' + guidToUse;
        fetch(url, { method: 'POST', credentials: 'same-origin' }).then(resp => {
            if (resp.ok) {
                if (cartElem) {
                    cartElem.classList.add('icon_cart_clicked');
                    cartElem.setAttribute('title', ' Release added to Cart');
                }

                markAddedInDOM(guidToUse, src);
            } else {
                resp.text().then(t => { console.log('Gallery: fallback POST failed', t); try { if (window.$ && $.pnotify) { $.pnotify({ title: 'CART', text: 'Add to cart failed', type: 'error' }); } } catch (e) { }; });
            }
        }).catch(err => { console.log('Gallery: fallback POST error', err); try { if (window.$ && $.pnotify) { $.pnotify({ title: 'CART', text: 'Add to cart error', type: 'error' }); } } catch (e) { }; });
    }

    function markAddedInDOM(guidToUse, src) {
        // Remove original thumbnail wrapper in listing
        const orig = guidToUse ? document.querySelector('img.ebds-preview-img[data-guid="' + guidToUse + '"]') : null;
        if (orig) {
            const wrapper = orig.closest('.ebds-preview');
            try { if (wrapper) wrapper.remove(); else orig.remove(); } catch (e) { }
        }
        // Remove gallery items matching by data-guid or src
        if (typeof overlay !== 'undefined' && overlay) {
            const galleryImgs = Array.from(overlay.querySelectorAll('img')).filter(i => {
                return (guidToUse && (i.dataset && i.dataset.guid == guidToUse)) || (src && i.src === src);
            });
            galleryImgs.forEach(imgElem => {
                const itemWrapper = imgElem.closest('.ebds-gallery-item');
                try { if (itemWrapper) itemWrapper.remove(); else imgElem.remove(); } catch (e) { }
            });
            // If no more items, close the gallery automatically
            if (!overlay.querySelector('.ebds-gallery-item')) {
                closeGallery();
            }
        }
    }

    btn.addEventListener('click', () => {
        if (overlay.classList.contains('visible')) closeGallery();
        else openGallery();
    });



    // Keyboard shortcut helpers for Prev/Next page (ArrowLeft / ArrowRight)
    function findPaginationLink(direction) {
        try {
            // Prefer rel attributes if present
            const rel = direction === 'prev' ? 'prev' : 'next';
            const relLink = document.querySelector('a[rel="' + rel + '"]');
            if (relLink) return relLink;
        } catch (e) { }

        // Try common pagination containers
        const nav = document.querySelector('nav.pagination') || document.querySelector('nav[aria-label="Pagination"]') || document.querySelector('ul.pagination') || document.querySelector('.pagination');
        if (!nav) return null;

        // Find current page item and walk siblings
        const current = nav.querySelector('[aria-current="page"]') || nav.querySelector('.active, li.active, .current') || nav.querySelector('a.active');
        if (current) {
            const curAnchor = current.tagName === 'A' ? current : (current.querySelector('a') || current);
            const li = (curAnchor && curAnchor.closest) ? curAnchor.closest('li') || curAnchor.parentElement : null;
            if (li) {
                let sib = direction === 'prev' ? li.previousElementSibling : li.nextElementSibling;
                while (sib) {
                    const a = sib.querySelector('a');
                    if (a && a.getAttribute('href')) return a;
                    sib = direction === 'prev' ? sib.previousElementSibling : sib.nextElementSibling;
                }
            }
        }

        // Fallback: try aria-label or visible text matching Prev/Next
        const labels = direction === 'prev' ? /prev|previous|‹|«|<|left|←/i : /next|›|»|>|right|→/i;
        const a = Array.from(nav.querySelectorAll('a')).find(a => (a.getAttribute('aria-label') && labels.test(a.getAttribute('aria-label'))) || labels.test(a.textContent));
        return a || null;
    }

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
// Ignore when typing in form controls or when a focused element exists (covers custom elements/shadow hosts)
    try {
        const ae = document.activeElement;
        // If focus is on anything other than the document body or root, assume the user is interacting with UI and don't intercept
        if (ae && ae !== document.body && ae !== document.documentElement) return;
        } catch (ex) { }

        if (e.key.toLowerCase() === 'g' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (overlay.classList.contains('visible')) closeGallery();
            else openGallery();
        } else if (e.key === 'Escape') {
            // Close the gallery and any visible enlarged previews
            closeGallery();
            try { document.querySelectorAll('.ebds-enlarged').forEach(el => { if (el.style.display && el.style.display !== 'none') el.style.display = 'none'; }); } catch (ex) { }
        } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey) {
            // Jump to previous/next page using site pagination
            const direction = (e.key === 'ArrowLeft') ? 'prev' : 'next';
            e.preventDefault();

            // Prefer global rel links first
            let link = null;
            try { link = document.querySelector('a[rel="' + (direction === 'prev' ? 'prev' : 'next') + '"]'); } catch (ex) { }
            if (!link) link = findPaginationLink(direction);

            // Also check overlay cloned pagination (gallery) for matching links
            if (!link && overlay && overlay.querySelector) {
                try {
                    const cloneNav = overlay.querySelector('.ebds-gallery-pagination');
                    if (cloneNav) {
                        // look for obvious labels
                        const labels = direction === 'prev' ? /prev|previous|‹|«|<|left|←/i : /next|›|»|>|right|→/i;
                        link = Array.from(cloneNav.querySelectorAll('a')).find(a => (a.getAttribute('aria-label') && labels.test(a.getAttribute('aria-label'))) || labels.test(a.textContent));
                        if (!link) {
                            const cur = cloneNav.querySelector('[aria-current="page"]') || cloneNav.querySelector('.active, li.active, a.active');
                            if (cur) {
                                const li = cur.closest ? cur.closest('li') : null;
                                if (li) {
                                    let sib = direction === 'prev' ? li.previousElementSibling : li.nextElementSibling;
                                    while (sib) {
                                        const a = sib.querySelector('a');
                                        if (a && a.getAttribute('href')) { link = a; break; }
                                        sib = direction === 'prev' ? sib.previousElementSibling : sib.nextElementSibling;
                                    }
                                }
                            }
                        }
                    }
                } catch (ex) { }
            }

            if (link) {
                try { link.click(); } catch (ex) { try { window.location = link.href; } catch (e) { } }
                // Keep gallery open if it was visible so the gallery state persists across navigation
                try { if (overlay.classList && overlay.classList.contains('visible')) try { localStorage.setItem('ebdsGalleryOpen', '1'); } catch (e) { } } catch (ex) { }
            }
        }
    });

    // Restore state across page loads
    try { if (localStorage.getItem('ebdsGalleryOpen') === '1') openGallery(); } catch (e) { }

    // Update per-category last-visit on initial page load when on first page (offset missing or =0)
    try { updateLastVisitFromPageOnLoad(); } catch (e) { }
})();