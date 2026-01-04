// ==UserScript==
// @name         Kour.io Motion Blur (Trail)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kour.io (canvas/WebGL) için basit motion blur / frame trail overlay. press M for open, wirh +/-  change the power
// @author       ChatGPT
// @match        https://kour.io/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550270/Kourio%20Motion%20Blur%20%28Trail%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550270/Kourio%20Motion%20Blur%20%28Trail%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------
    // Ayarlar (istediğiniz gibi değiştirin)
    // ----------------------------
    let enabled = true;           // başlangıçta açık mu?
    let decay = 0.12;             // fade miktarı; küçük => daha uzun iz (0.02..0.3 arası uygun)
    let maxCanvasSearchAttempts = 20; // sayfa yüklenince canvas bulunana kadar deneme sayısı
    let searchIntervalMs = 500;
    // ----------------------------

    let targetCanvas = null;
    let overlay = null;
    let accCanvas = null;
    let rafId = null;
    let lastWidth = 0, lastHeight = 0;

    function findLargestCanvas() {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        if (canvases.length === 0) return null;
        // alanına göre en büyüğü seç
        canvases.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        return canvases[0];
    }

    function createOverlayFor(canvas) {
        const rect = canvas.getBoundingClientRect();
        const w = canvas.width || Math.max(1, Math.round(rect.width));
        const h = canvas.height || Math.max(1, Math.round(rect.height));

        // accumulation canvas (offscreen)
        accCanvas = document.createElement('canvas');
        accCanvas.width = w;
        accCanvas.height = h;
        const accCtx = accCanvas.getContext('2d', { alpha: true });

        // visible overlay
        overlay = document.createElement('canvas');
        overlay.width = w;
        overlay.height = h;
        overlay.style.position = 'absolute';
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = 999999; // üstte görünsün
        overlay.style.mixBlendMode = 'normal'; // isterseniz 'screen' veya 'lighter' deneyin
        overlay.style.imageRendering = 'auto';

        document.body.appendChild(overlay);

        // handle resizing / repositioning
        function syncSizePos() {
            const r = canvas.getBoundingClientRect();
            const newW = canvas.width || Math.max(1, Math.round(r.width));
            const newH = canvas.height || Math.max(1, Math.round(r.height));
            if (overlay.width !== newW || overlay.height !== newH) {
                overlay.width = newW; accCanvas.width = newW;
            }
            if (overlay.height !== newH || overlay.width !== newW) {
                overlay.height = newH; accCanvas.height = newH;
            }
            overlay.style.left = r.left + 'px';
            overlay.style.top = r.top + 'px';
            overlay.style.width = r.width + 'px';
            overlay.style.height = r.height + 'px';
        }

        window.addEventListener('resize', syncSizePos);
        // MutationObserver to keep position synced if canvas moves in DOM
        const mo = new MutationObserver(syncSizePos);
        mo.observe(document.body, { attributes: true, childList: true, subtree: true });

        return { accCanvas, overlay, accCtx, syncSizePos, mo };
    }

    function startLoop() {
        if (!targetCanvas || !overlay || !accCanvas) return;
        const accCtx = accCanvas.getContext('2d', { alpha: true });
        const overCtx = overlay.getContext('2d', { alpha: true });

        function frame() {
            if (!enabled) { rafId = requestAnimationFrame(frame); return; }

            // fade accumulation slightly (draw a semi-opaque rect to dim previous content)
            accCtx.fillStyle = `rgba(0,0,0,${decay})`;
            accCtx.fillRect(0, 0, accCanvas.width, accCanvas.height);

            // draw current game frame onto accumulation canvas
            try {
                // drawImage from target canvas (same-origin expected)
                accCtx.drawImage(targetCanvas, 0, 0, accCanvas.width, accCanvas.height);
            } catch (e) {
                // drawImage hata veriyorsa (ör. cross-origin), dur ve temizle
                console.warn('MotionBlur: drawImage failed (cross-origin?). Disabling effect.', e);
                stop();
                return;
            }

            // copy accumulation to overlay (clear then draw)
            overCtx.clearRect(0, 0, overlay.width, overlay.height);
            overCtx.drawImage(accCanvas, 0, 0, overlay.width, overlay.height);

            rafId = requestAnimationFrame(frame);
        }
        if (!rafId) frame();
    }

    function stop() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (accCanvas) accCanvas = null;
        overlay = null;
    }

    function enableEffect() {
        if (!targetCanvas) return;
        if (!overlay || !accCanvas) {
            const created = createOverlayFor(targetCanvas);
            accCanvas = created.accCanvas;
            overlay = created.overlay;
        }
        startLoop();
    }

    function disableEffect() {
        stop();
    }

    // keyboard controls: M toggle, +/- adjust decay (motion strength)
    function keyHandler(e) {
        if (e.key === 'm' || e.key === 'M') {
            enabled = !enabled;
            if (enabled) enableEffect(); else disableEffect();
            showToast(`Motion blur ${enabled ? 'Açıldı' : 'Kapandı'}. decay=${decay.toFixed(3)}`);
        } else if (e.key === '+') {
            // daha güçlü iz = daha küçük decay
            decay = Math.max(0.01, decay - 0.02);
            showToast(`Decay: ${decay.toFixed(3)}`);
        } else if (e.key === '-') {
            decay = Math.min(0.6, decay + 0.02);
            showToast(`Decay: ${decay.toFixed(3)}`);
        }
    }

    function showToast(msg, duration = 1500) {
        let el = document.getElementById('tm-mblur-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'tm-mblur-toast';
            Object.assign(el.style, {
                position: 'fixed',
                right: '12px',
                bottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontSize: '13px',
                borderRadius: '6px',
                zIndex: 9999999,
                pointerEvents: 'none'
            });
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        clearTimeout(el._hideT);
        el._hideT = setTimeout(() => { el.style.transition = 'opacity 400ms'; el.style.opacity = '0'; }, duration);
    }

    // Tampermonkey menu commands
    try {
        GM_registerMenuCommand && GM_registerMenuCommand('Toggle Motion Blur (M)', () => { enabled = !enabled; enabled ? enableEffect() : disableEffect(); });
        GM_registerMenuCommand && GM_registerMenuCommand('Increase Blur (+)', () => { decay = Math.max(0.01, decay - 0.02); });
        GM_registerMenuCommand && GM_registerMenuCommand('Decrease Blur (-)', () => { decay = Math.min(0.6, decay + 0.02); });
    } catch (e) { /* ignore if not available */ }

    // Başlangıç: sayfadaki en büyük canvas'ı bulana kadar dene
    let attempts = 0;
    const finder = setInterval(() => {
        if (attempts++ > maxCanvasSearchAttempts) {
            clearInterval(finder);
            console.warn('MotionBlur: canvas bulunamadı.');
            return;
        }
        const c = findLargestCanvas();
        if (c) {
            clearInterval(finder);
            targetCanvas = c;
            // bazen oyun canvas boyutunu daha sonra ayarlıyor; overlay'i yaratmadan önce biraz bekleyebiliriz
            setTimeout(() => {
                enableEffect();
                window.addEventListener('keydown', keyHandler);
                showToast('Motion Blur hazır. M ile aç/kapa, +/- ile güç ayarla.');
            }, 300);
        }
    }, searchIntervalMs);
})();
