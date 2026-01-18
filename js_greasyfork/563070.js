// ==UserScript==
// @name         SlowPics Frame Info Overlay
// @namespace    https://slow.pics
// @version      1.0.1
// @description  Frame info overlay for slow.pics
// @author       Super
// @match        https://slow.pics/c/*
// @match        https://slow.pics/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slow.pics
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563070/SlowPics%20Frame%20Info%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/563070/SlowPics%20Frame%20Info%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let overlayHidden = false;
    let dragState = { dragging: false, offsetX: 0, offsetY: 0 };
    let userOffset = { x: 0, y: 0 };
    let compactMode = GM_getValue('sp-compact-mode', false);

    GM_addStyle(`
        .frame-overlay {
            position: fixed;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            color: #fff;
            cursor: grab;
            user-select: none;
            transition: opacity 0.2s ease;
        }
        .frame-overlay.dragging { cursor: grabbing; }
        .frame-overlay.hidden { opacity: 0; pointer-events: none; }
        .frame-overlay__frame { color: rgba(255,255,255,0.75); font-variant-numeric: tabular-nums; }
        .frame-overlay__divider { color: rgba(255,255,255,0.3); }
        .frame-overlay__source {
            background: linear-gradient(135deg, rgba(10, 15, 15, 0.85), rgba(10, 26, 26, 0.85));
            padding: 3px 8px;
            border-radius: 5px;
            font-weight: 600;
            border: 1px solid rgba(20, 184, 166, 0.3);
        }
        .frame-overlay__sources { display: flex; align-items: center; gap: 6px; }
        .frame-overlay__vs { color: rgba(255,255,255,0.35); font-size: 10px; }
        .frame-overlay__hint { color: rgba(255,255,255,0.3); font-size: 10px; margin-left: 4px; }
        .frame-overlay.compact .frame-overlay__frame,
        .frame-overlay.compact .frame-overlay__divider { display: none; }
    `);

    function isSliderMode() {
        return location.pathname.startsWith('/s/') || !!document.getElementById('slider-container');
    }

    function getImageElement() {
        if (isSliderMode()) {
            return document.querySelector('.slider-canvas img[data-rcs="image"]') || document.querySelector('.slider-canvas img');
        }
        return document.getElementById('image');
    }

    function getImageBounds() {
        const img = getImageElement();
        if (!img) return null;
        const rect = img.getBoundingClientRect();
        const style = getComputedStyle(img);
        const objectFit = style.objectFit;
        const objectPosition = style.objectPosition || 'center center';

        if (objectFit !== 'contain') {
            return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        }

        const naturalRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = rect.width / rect.height;
        let renderWidth, renderHeight;
        if (naturalRatio > containerRatio) {
            renderWidth = rect.width;
            renderHeight = rect.width / naturalRatio;
        } else {
            renderHeight = rect.height;
            renderWidth = rect.height * naturalRatio;
        }

        const posMatch = objectPosition.match(/(\S+)\s+(\S+)/);
        let posX = 'center', posY = 'center';
        if (posMatch) { posX = posMatch[1]; posY = posMatch[2]; }

        let offsetX = (rect.width - renderWidth) / 2;
        let offsetY = (rect.height - renderHeight) / 2;
        if (posX === 'left' || posX === '0%') offsetX = 0;
        else if (posX === 'right' || posX === '100%') offsetX = rect.width - renderWidth;
        if (posY === 'top' || posY === '0%') offsetY = 0;
        else if (posY === 'bottom' || posY === '100%') offsetY = rect.height - renderHeight;

        return { left: rect.left + offsetX, top: rect.top + offsetY, width: renderWidth, height: renderHeight };
    }

    function createOverlay() {
        document.getElementById('frame-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.className = 'frame-overlay' + (compactMode ? ' compact' : '');
        overlay.id = 'frame-overlay';

        overlay.innerHTML = isSliderMode()
            ? `<span class="frame-overlay__frame" id="overlay-frame"></span>
               <span class="frame-overlay__divider">•</span>
               <div class="frame-overlay__sources">
                   <span class="frame-overlay__source" id="overlay-left"></span>
                   <span class="frame-overlay__vs">vs</span>
                   <span class="frame-overlay__source" id="overlay-right"></span>
               </div>
               <span class="frame-overlay__hint">[H/I]</span>`
            : `<span class="frame-overlay__frame" id="overlay-frame"></span>
               <span class="frame-overlay__divider">•</span>
               <span class="frame-overlay__source" id="overlay-source"></span>
               <span class="frame-overlay__hint">[H/I]</span>`;

        document.body.appendChild(overlay);
        setupDrag(overlay);
        positionOverlay();
        updateOverlay();
    }

    function positionOverlay() {
        const overlay = document.getElementById('frame-overlay');
        const bounds = getImageBounds();
        if (!overlay || !bounds) return;

        const padding = 4;
        const overlayW = overlay.offsetWidth;
        const overlayH = overlay.offsetHeight;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;

        const visibleLeft = Math.max(bounds.left, 0);
        const visibleTop = Math.max(bounds.top, 0);
        const visibleRight = Math.min(bounds.left + bounds.width, viewW);
        const visibleBottom = Math.min(bounds.top + bounds.height, viewH);

        if (visibleRight - visibleLeft < overlayW + padding * 2 || visibleBottom - visibleTop < overlayH + padding * 2) {
            overlay.style.opacity = '0';
            return;
        }
        overlay.style.opacity = '';

        let idealLeft = bounds.left + padding + userOffset.x;
        let idealTop = bounds.top + padding + userOffset.y;

        // Clamp to visible viewport and image bounds
        let left = Math.max(visibleLeft + padding, Math.min(idealLeft, visibleRight - overlayW - padding));
        let top = Math.max(visibleTop + padding, Math.min(idealTop, visibleBottom - overlayH - padding));

        overlay.style.left = left + 'px';
        overlay.style.top = top + 'px';
    }

    function setupDrag(overlay) {
        overlay.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            const rect = overlay.getBoundingClientRect();
            dragState = { dragging: true, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
            overlay.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!dragState.dragging) return;
            const bounds = getImageBounds();
            if (!bounds) return;
            const padding = 4;

            // Calculate new position based on mouse
            let newLeft = e.clientX - dragState.offsetX;
            let newTop = e.clientY - dragState.offsetY;

            // Clamp strict bounds to image area
            const maxLeft = bounds.left + bounds.width - overlay.offsetWidth - padding;
            const maxTop = bounds.top + bounds.height - overlay.offsetHeight - padding;

            // Allow dragging within the entire image, not just visible part
            newLeft = Math.max(bounds.left + padding, Math.min(newLeft, maxLeft));
            newTop = Math.max(bounds.top + padding, Math.min(newTop, maxTop));

            userOffset.x = newLeft - bounds.left - padding;
            userOffset.y = newTop - bounds.top - padding;

            positionOverlay();
        });

        document.addEventListener('mouseup', () => {
            if (dragState.dragging) {
                dragState.dragging = false;
                overlay.classList.remove('dragging');
            }
        });
    }

    function updateOverlay() {
        const frameEl = document.getElementById('overlay-frame');
        const compEl = document.getElementById('active-comparison-name');
        if (compEl && frameEl) {
            const text = compEl.textContent.trim();
            const match = text.match(/\d+\/\d+:\s*(.+)/);
            frameEl.textContent = match ? match[1] : text;
        }

        if (isSliderMode()) {
            const left = document.getElementById('left-image-dropdown');
            const right = document.getElementById('right-image-dropdown');
            const ol = document.getElementById('overlay-left');
            const or = document.getElementById('overlay-right');
            if (left && ol) ol.textContent = left.textContent.trim();
            if (right && or) or.textContent = right.textContent.trim();
        } else {
            const imgEl = document.getElementById('active-image-name');
            const srcEl = document.getElementById('overlay-source');
            if (imgEl && srcEl) {
                const text = imgEl.textContent.trim();
                const match = text.match(/\d+\/\d+:\s*(.+?)\s*\[/);
                srcEl.textContent = match ? match[1] : text.replace(/\[.*\]/, '').trim();
            }
        }
    }

    function toggleOverlay() {
        const overlay = document.getElementById('frame-overlay');
        if (!overlay) return;
        overlayHidden = !overlayHidden;
        overlay.classList.toggle('hidden', overlayHidden);
    }

    function toggleCompactMode() {
        const overlay = document.getElementById('frame-overlay');
        if (!overlay) return;
        compactMode = !compactMode;
        GM_setValue('sp-compact-mode', compactMode);
        overlay.classList.toggle('compact', compactMode);
    }

    function init() {
        const img = getImageElement();
        if (!img) return setTimeout(init, 300);

        if (!img.complete) {
            img.addEventListener('load', createOverlay);
        } else {
            createOverlay();
        }

        const observer = new MutationObserver(() => {
            const overlay = document.getElementById('frame-overlay');
            const oldRect = overlay ? overlay.getBoundingClientRect() : null;

            updateOverlay();

            // Compensate for source switching shifts
            const bounds = getImageBounds();
            if (oldRect && bounds && !overlayHidden && !overlay.classList.contains('hidden')) {
                const padding = 4;
                // Re-pin to the current visual position relative to the new bounds
                userOffset.x = oldRect.left - bounds.left - padding;
                userOffset.y = oldRect.top - bounds.top - padding;
            }
            positionOverlay();
        });
        const config = { childList: true, characterData: true, subtree: true };
        ['active-comparison-name', 'active-image-name', 'left-image-dropdown', 'right-image-dropdown']
            .forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el, config); });

        new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 && (n.id === 'slider-container' || n.classList?.contains('image-container'))) {
                        userOffset = { x: 0, y: 0 };
                        setTimeout(createOverlay, 100);
                        return;
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });

        document.addEventListener('keydown', e => {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey && !e.metaKey) toggleOverlay();
            if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.altKey && !e.metaKey) toggleCompactMode();
            setTimeout(updateOverlay, 50);
        });

        document.addEventListener('click', () => setTimeout(updateOverlay, 100));
        window.addEventListener('scroll', positionOverlay, true);
        window.addEventListener('resize', positionOverlay);
        new ResizeObserver(positionOverlay).observe(document.body);
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200))
        : setTimeout(init, 200);
})();
