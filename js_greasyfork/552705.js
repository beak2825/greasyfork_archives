// ==UserScript==
// @name         Double Ctrl Image Zoom (Edge Style)
// @namespace    https://products.agarmen.com
// @version      1.03
// @description  Double Ctrl to zoom images like Edge browser
// @match        *://*/*
// @grant        none
// @author       @emberasim
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552705/Double%20Ctrl%20Image%20Zoom%20%28Edge%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552705/Double%20Ctrl%20Image%20Zoom%20%28Edge%20Style%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastCtrlTime = 0;
    const DOUBLE_PRESS_INTERVAL = 400; // ms
    let overlayDiv = null;
    let zoomedImg = null;
    let toolbar = null;
    // Detect double Ctrl
    let isCtrlPressed = false;

    // Track mouse position
    let mouseX = 0, mouseY = 0;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastMoveTime = 0;


    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Create overlay and controls
    function createOverlay(imgSrc) {
        disposeOverlay();

        overlayDiv = document.createElement('div');
        overlayDiv.style.position = 'fixed';
        overlayDiv.classList.add("zoom-overlay");
        overlayDiv.style.top = 0;
        overlayDiv.style.left = 0;
        overlayDiv.style.width = '100vw';
        overlayDiv.style.height = '100vh';
        overlayDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
        overlayDiv.style.backdropFilter = 'blur(3px)';
        overlayDiv.style.display = 'block';
        overlayDiv.style.overflow = 'hidden';
        //overlayDiv.style.alignItems = 'center';
        //overlayDiv.style.justifyContent = 'center';
        overlayDiv.style.zIndex = 999999;
        overlayDiv.style.backdropFilter = 'blur(3px)';
        overlayDiv.style.opacity = '0';
        overlayDiv.style.transition = 'opacity 0.25s ease';

        // Image setup
        zoomedImg = document.createElement('img');
        zoomedImg.src = imgSrc;
        //zoomedImg.style.maxWidth = '95vw';
        //zoomedImg.style.maxHeight = '90vh';
        zoomedImg.style.borderRadius = '8px';
        zoomedImg.style.boxShadow = '0 0 25px rgba(0,0,0,0.7)';
        zoomedImg.style.transformOrigin = 'center center';
        zoomedImg.style.transition = 'transform 0.25s ease';
        zoomedImg.style.userSelect = 'none';
        //zoomedImg.style.pointerEvents = 'none'; // let clicks pass through to overlay for closing
        zoomedImg.style.cursor = 'grab';

        zoomedImg.style.position = 'absolute';
        zoomedImg.style.top = '50%';
        zoomedImg.style.left = '50%';
        //zoomedImg.style.transform = 'translate(-50%, -50%)';
        zoomedImg.style.maxWidth = 'none';  // remove automatic shrink
        zoomedImg.style.maxHeight = 'none'; // so zoom works naturally



        zoomedImg.addEventListener('mousedown', (e) => {
            if (zoomScale <= 1) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            velocityX = 0;
            velocityY = 0;
            lastMoveTime = performance.now();
            zoomedImg.style.cursor = 'grabbing';
            zoomedImg.style.transition = 'none';
            document.body.style.userSelect = 'none';
            e.preventDefault();
            e.stopPropagation();
        });

        overlayDiv.appendChild(zoomedImg);
        document.body.appendChild(overlayDiv);
        requestAnimationFrame(() => (overlayDiv.style.opacity = '1'));

        createToolbar(imgSrc);
        overlayDiv.appendChild(toolbar);

        overlayDiv.addEventListener('click', (e) => {
            if (e.target === overlayDiv) disposeOverlay();
        });
        document.addEventListener('keydown', escListener, { once: true });

        // Prevent background scroll and add wheel zoom
        overlayDiv.addEventListener('wheel', (e) => {
            e.preventDefault(); // stop page scroll
            e.stopPropagation();

            const delta = e.deltaY;
            if (delta < 0) adjustZoom(1.25);     // scroll up → zoom in
            else if (delta > 0) adjustZoom(1 / 1.15); // scroll down → zoom out
        }, { passive: false });

        overlayDiv.addEventListener('click', (e) => {
            if (e.target === overlayDiv) disposeOverlay();
        });

        overlayDiv.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const now = performance.now();
            const dt = Math.max(1, now - lastMoveTime);
            lastMoveTime = now;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // velocity for inertia
            velocityX = dx / dt * 16; // normalize
            velocityY = dy / dt * 16;

            startX = e.clientX;
            startY = e.clientY;
            translateX += dx;
            translateY += dy;
            updateTransform();
        });


        overlayDiv.addEventListener('mouseup', endDrag);
        overlayDiv.addEventListener('mouseleave', endDrag);
    }


    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        zoomedImg.style.cursor = 'grab';
        document.body.style.userSelect = '';
        zoomedImg.style.transition = 'transform 0.25s ease';

        // optional inertia
        requestAnimationFrame(inertiaStep);
    }

    function inertiaStep() {
        // friction decay
        velocityX *= 0.9;
        velocityY *= 0.9;
        translateX += velocityX;
        translateY += velocityY;
        updateTransform();

        if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5)
            requestAnimationFrame(inertiaStep);
    }

    function createToolbar(imgSrc) {
        toolbar = document.createElement('div');
        toolbar.style.position = 'fixed';
        toolbar.style.bottom = '30px';
        toolbar.style.left = '50%';
        toolbar.style.transform = 'translateX(-50%)';
        toolbar.style.background = 'rgba(30,30,30,0.8)';
        toolbar.style.borderRadius = '8px';
        toolbar.style.padding = '6px 10px';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '8px';
        toolbar.style.zIndex = '1000000';
        toolbar.style.fontFamily = 'sans-serif';
        toolbar.style.userSelect = 'none';
        toolbar.style.transition = 'opacity 0.25s ease';
        toolbar.style.opacity = '0';
        toolbar.style.transform = 'translateX(-50%)';
        requestAnimationFrame(() => (toolbar.style.opacity = '1'));

        const buttons = [
            { label: '🔍+', title: 'Zoom In', action: () => adjustZoom(1.2) },
            { label: '🔍−', title: 'Zoom Out', action: () => adjustZoom(1 / 1.2) },
            { label: '⟳', title: 'Rotate', action: rotateImage },
            { label: '💾', title: 'Download', action: () => downloadImage(imgSrc) },
            { label: '↗', title: 'Open in New Tab', action: () => window.open(imgSrc, '_blank') },
            { label: '✖', title: 'Close', action: disposeOverlay }
        ];

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.textContent = btn.label;
            b.title = btn.title;
            Object.assign(b.style, {
                background: 'transparent',
                color: 'white',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '5px',
            });
            b.addEventListener('click', e => {
                e.stopPropagation(); // don't close overlay
                btn.action();
            });
            b.addEventListener('mouseenter', () => (b.style.background = 'rgba(255,255,255,0.15)'));
            b.addEventListener('mouseleave', () => (b.style.background = 'transparent'));
            toolbar.appendChild(b);
        });

        overlayDiv.appendChild(toolbar);
    }

    // Zoom / rotate logic
    let zoomScale = 1;
    let rotation = 0;

    function adjustZoom(factor) {
        zoomScale *= factor;
        zoomScale = Math.max(0.2, Math.min(zoomScale, 5)); // limit 0.2x–5x
        updateTransform();
    }

    function rotateImage() {
        rotation = (rotation + 90) % 360;
        updateTransform();
    }

    function updateTransform() {
        if (!zoomedImg) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const iw = zoomedImg.naturalWidth * zoomScale;
        const ih = zoomedImg.naturalHeight * zoomScale;

        // how far we can move before edges appear
        let maxX = (iw - vw) / 2;
        let maxY = (ih - vh) / 2;

        // Allow slight movement even if image smaller than viewport
        const minPan = 80; // px of margin for small images
        if (maxX < minPan) maxX = minPan;
        if (maxY < minPan) maxY = minPan;

        // clamp translation BEFORE applying transform
        translateX = Math.min(maxX, Math.max(-maxX, translateX));
        translateY = Math.min(maxY, Math.max(-maxY, translateY));

        zoomedImg.style.transform =
            `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${zoomScale}) rotate(${rotation}deg)`;
    }




    function downloadImage(src) {
        const a = document.createElement('a');
        a.href = src;
        a.download = src.split('/').pop().split('?')[0] || 'image';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function escListener(e) {
        if (e.key === 'Escape') disposeOverlay();
    }

    function disposeOverlay() {
        if (overlayDiv) {
            overlayDiv.style.opacity = '0';
            if (toolbar) toolbar.style.opacity = '0';
            setTimeout(() => {
                overlayDiv?.remove();
                overlayDiv = null;
                zoomedImg = null;
                toolbar = null;
                zoomScale = 1;
                rotation = 0;
            }, 250);
        }
        document.querySelectorAll('.zoom-overlay').forEach(a => {
            console.log(a + ' removed');
            a.remove();
        });

        translateX = 0;
        translateY = 0;
    }

    // Wait until image is ready before computing smart zoom
    const applySmartZoom = () => {
        if (!zoomedImg || !zoomedImg.complete) {
            requestAnimationFrame(applySmartZoom);
            return;
        }

        const vw = window.innerWidth * 0.9;
        const vh = window.innerHeight * 0.9;
        const iw = zoomedImg.naturalWidth;
        const ih = zoomedImg.naturalHeight;

        if (!iw || !ih) return;

        // Compute how much scaling is needed to fit in screen
        const fitScale = Math.min(vw / iw, vh / ih);

        // Only enlarge if BOTH dimensions are significantly smaller than viewport
        const isSmall = iw < vw * 0.8 && ih < vh * 0.8;

        let targetZoom;
        if (isSmall) {
            // Small image → gentle enlargement
            targetZoom = Math.min(fitScale * 1.4, 1.6);
        } else {
            // Large image → fit perfectly inside screen
            targetZoom = Math.min(fitScale, 1.0);
        }

        zoomScale = targetZoom;
        updateTransform();
    }

    // Detect double Ctrl

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            // Ignore repeated keydown while holding
            if (isCtrlPressed) return;
            isCtrlPressed = true;

            const now = Date.now();
            if (now - lastCtrlTime < DOUBLE_PRESS_INTERVAL) {
                const elems = document.elementsFromPoint(mouseX, mouseY);
                const hoveredImg = elems.find(el => el.tagName && el.tagName.toLowerCase() === 'img');
                if (hoveredImg) {
                    createOverlay(hoveredImg.src);
                    e.preventDefault();
                    applySmartZoom();
                }
            }
            lastCtrlTime = now;
        } else if (e.key === 'Escape') {
            disposeOverlay();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            isCtrlPressed = false;
        }
    });


})();

//Script by #EMBER