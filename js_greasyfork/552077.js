// ==UserScript==
// @name        SceneNZBs: Ultra Suite (V13 - Ghost Gallery)
// @description Cover-Zoom, Smart-Sortierung, Clean-Search & "Ghost"-Navigation (Kein Scrollen bei Tastatur).
// @version     13.0.0
// @match       https://*.scenenzbs.com/*
// @icon        https://cdn.scenenzbs.com/assets/static/favicon.ico
// @namespace   https://scenenzbs.com/
// @author      Baumeister (Architekt Edition)
// @grant       GM_openInTab
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/552077/SceneNZBs%3A%20Ultra%20Suite%20%28V13%20-%20Ghost%20Gallery%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552077/SceneNZBs%3A%20Ultra%20Suite%20%28V13%20-%20Ghost%20Gallery%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguration ---
    const CONFIG = {
        hOffset: 200, 
        rowSelector: '.browsetable-row',
        imgSelector: 'img.thumb-zoom',
        badPatterns: ['placeholder.webp', 'no-cover.webp', 'category_', 'img-fallback']
    };

    const NFO_CACHE = new Map();
    let overlayImg = null;
    let hintText = null;
    let isSorting = false;
    
    // --- STATUS-VARIABLEN ---
    let activeIndex = -1;
    let allImagesCache = [];
    let isKeyboardMode = false; // Der "Ghost Mode" Schalter

    // ==========================================
    // 1. HELPER & CLEANER
    // ==========================================
    
    function cleanReleaseName(rawName) {
        if (!rawName) return '';
        let name = rawName.replace(/-[a-zA-Z0-9]+$/, '');
        const techTags = [
            /2160p/gi, /1080p/gi, /720p/gi, /480p/gi, /\bSD\b/gi, /\bHD\b/gi,
            /BluRay/gi, /WEB-DL/gi, /WEBRip/gi, /HDTV/gi, /DVDRip/gi, /BDRip/gi, /HD2DVD/gi,
            /x264/gi, /x265/gi, /h264/gi, /h265/gi, /HEVC/gi, /AVC/gi, /AV1/gi,
            /AAC/gi, /AC3/gi, /DTS/gi, /DDP5\.1/gi, /DD\+5\.1/gi, /EAC3/gi, /DTSMAD/gi,
            /MP4/gi, /MKV/gi, /AVI/gi,
            /German/gi, /DL/gi, /ML/gi, /Dubbed/gi, /Subbed/gi, /Multi/gi,
            /XXX/gi, /Complete/gi, /Internal/gi, /REPACK/gi, /PROPER/gi, /Remastered/gi, /Uncut/gi,
            /S\d+E\d+/gi, /S\d+/gi, /\b(19|20)\d{2}\b/g, /\b\d{2} \d{2} \d{2}\b/g
        ];
        techTags.forEach(tag => { name = name.replace(tag, ''); });
        return name.replace(/[._]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const DOM_HELPERS = {
        getReleaseName(container) {
            const link = container.querySelector('a.fw-bold.text-decoration-none[href*="/details/"]');
            return link ? link.textContent.trim() : '';
        },
        getCategory(container) {
            const link = container.querySelector('.text-muted a[href*="/browse?t="]');
            return link ? link.textContent.trim().split('>')[0].trim() : '';
        },
        getNfoUrl(container) {
            const btn = container.querySelector('a[data-url*="/nfo?id="]');
            return btn ? btn.getAttribute('data-url') : '';
        },
        getContainer(img) {
            return img.closest(CONFIG.rowSelector);
        },
        isPlaceholder(img) {
            const fallback = img.getAttribute('data-fallback');
            const src = img.getAttribute('src');
            if (fallback && src === fallback) return true;
            return CONFIG.badPatterns.some(p => (src || '').toLowerCase().includes(p));
        }
    };

    // ==========================================
    // 2. UI SETUP
    // ==========================================

    function setupGlobalElements() {
        if (document.getElementById('ultra-overlay-style')) return;

        const style = document.createElement('style');
        style.id = 'ultra-overlay-style';
        style.textContent = `
            img.thumb-zoom:hover, .thumb-zoom-wrap:hover img.thumb-zoom {
                transform: none !important; box-shadow: none !important; outline: none !important;
            }
            .ultra-overlay-img {
                position: fixed; top: 50%; left: 50%;
                z-index: 999999; opacity: 0; visibility: hidden;
                pointer-events: none; display: block;
                height: 70vh; width: auto; max-width: 50vw; 
                object-fit: contain;
                transform: translate(calc(-50% + ${CONFIG.hOffset}px), -50%);
                transition: opacity 0.15s ease-out, visibility 0.15s step-end;
                background: rgba(20, 20, 30, 0.95);
                box-shadow: 0 10px 40px rgba(0,0,0,0.7);
                border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 2px;
            }
            .ultra-overlay-img.is-visible {
                opacity: 1; visibility: visible;
                transition: opacity 0.15s ease-out, visibility 0s;
            }
            .ultra-hint-text {
                position: fixed; top: 50%; left: 50%;
                transform: translate(calc(-50% + ${CONFIG.hOffset}px), -50%);
                z-index: 999999; opacity: 0; visibility: hidden; pointer-events: none;
                background: rgba(0, 0, 0, 0.9); color: #fff;
                padding: 15px 25px; border-radius: 8px;
                font-size: 15px; font-weight: 600; text-align: center;
                transition: opacity 0.15s ease-out;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .ultra-hint-text.is-visible { opacity: 1; visibility: visible; }
            img.thumb-zoom[data-is-placeholder="true"] { cursor: help !important; }
            
            /* Nur dezente Markierung im Keyboard Mode, kein wildes Scrollen */
            .ultra-keyboard-active { 
                outline: 3px solid #4da3ff !important; 
                outline-offset: 2px; 
                transition: outline 0.1s;
            }
        `;
        document.head.appendChild(style);

        overlayImg = document.createElement('img');
        overlayImg.className = 'ultra-overlay-img';
        document.body.appendChild(overlayImg);

        hintText = document.createElement('div');
        hintText.className = 'ultra-hint-text';
        document.body.appendChild(hintText);
    }

    function hideOverlay() {
        // Im Keyboard Modus verstecken wir das Overlay NICHT automatisch beim mouseleave,
        // sondern nur, wenn explizit gewünscht oder der Modus endet.
        if (isKeyboardMode) return;

        if (overlayImg) overlayImg.classList.remove('is-visible');
        if (hintText) hintText.classList.remove('is-visible');
    }

    function showOverlay(img, releaseName, isPlaceholderImg) {
        if (!document.body.contains(overlayImg)) setupGlobalElements();

        if (isPlaceholderImg) {
            const cleanName = cleanReleaseName(releaseName);
            const displayName = cleanName.length > 2 ? cleanName : releaseName;
            hintText.innerHTML = releaseName ? 
                `<span style="font-size:12px; opacity:0.7">Suche nach:</span><br><span style="color:#4da3ff; font-size:16px">${displayName}</span>` : 
                'Bildersuche starten';
            hintText.classList.add('is-visible');
            overlayImg.classList.remove('is-visible');
        } else {
            if (overlayImg.src !== img.src) overlayImg.src = img.src;
            overlayImg.classList.add('is-visible');
            hintText.classList.remove('is-visible');
        }
    }

    // ==========================================
    // 3. NAVIGATION (GHOST MODE)
    // ==========================================

    function updateImageCache() {
        allImagesCache = Array.from(document.querySelectorAll(CONFIG.imgSelector));
    }

    function navigateGallery(direction) {
        if (allImagesCache.length === 0) updateImageCache();
        if (activeIndex === -1) return; 

        // Ghost Mode aktivieren: Maus wird ignoriert
        isKeyboardMode = true;

        let newIndex = activeIndex + direction;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= allImagesCache.length) newIndex = allImagesCache.length - 1;

        if (newIndex === activeIndex) return;

        const targetImg = allImagesCache[newIndex];
        const container = DOM_HELPERS.getContainer(targetImg);
        
        // KEIN SCROLLEN MEHR (User Wunsch: "nicht unbedingt hinscrollen")
        // container.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Overlay aktualisieren
        const name = DOM_HELPERS.getReleaseName(container);
        const isPh = DOM_HELPERS.isPlaceholder(targetImg);
        showOverlay(targetImg, name, isPh);
        
        // Visuelles Highlight anpassen
        document.querySelectorAll('.ultra-keyboard-active').forEach(el => el.classList.remove('ultra-keyboard-active'));
        targetImg.classList.add('ultra-keyboard-active');

        activeIndex = newIndex;
    }

    // ==========================================
    // 4. LOGIK & BINDINGS
    // ==========================================

    function sortContainer(container) {
        if (isSorting) return;
        isSorting = true;
        const rows = Array.from(container.querySelectorAll(CONFIG.rowSelector));
        if (rows.length < 2) { isSorting = false; return; }

        let needsSort = false;
        let foundFake = false;
        rows.forEach(row => {
            const img = row.querySelector(CONFIG.imgSelector);
            row._isReal = img ? !DOM_HELPERS.isPlaceholder(img) : false;
            if (!row._isReal) foundFake = true;
            if (row._isReal && foundFake) needsSort = true;
        });

        if (needsSort) {
            rows.sort((a, b) => (a._isReal === b._isReal) ? 0 : a._isReal ? -1 : 1);
            const frag = document.createDocumentFragment();
            rows.forEach(row => frag.appendChild(row));
            container.append(frag);
        }
        isSorting = false;
    }

    async function extractUrlFromNfo(nfoUrl) {
        if (NFO_CACHE.has(nfoUrl)) return NFO_CACHE.get(nfoUrl);
        try {
            const res = await fetch(nfoUrl);
            const txt = (new DOMParser()).parseFromString(await res.text(), 'text/html').body.textContent || '';
            const patterns = [/URL[.\s:]+([^\s\n]+)/i, /https?:\/\/(play\.napster\.com|tidal\.com|open\.spotify\.com|music\.apple\.com|www\.deezer\.com|music\.youtube\.com|open\.qobuz\.com|soundcloud\.com)[^\s\n]*/gi];
            for (const p of patterns) {
                const m = txt.match(p);
                if (m) {
                    const url = (m[1] && !m[0].startsWith('http')) ? m[1].trim() : m[0].trim();
                    NFO_CACHE.set(nfoUrl, url);
                    return url;
                }
            }
        } catch (e) { console.error(e); }
        NFO_CACHE.set(nfoUrl, null);
        return null;
    }

    function addStreamingButton(container, nfoUrl) {
        const btnContainer = container.querySelector('.mt-2.d-flex.flex-wrap.gap-1');
        if (!btnContainer || btnContainer.parentElement.querySelector('.ultra-streaming-btn')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'mt-1'; 
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'btn btn-sm btn-tag btn-outline-primary ultra-streaming-btn';
        btn.textContent = '♫ Link checken';
        btn.style.fontSize = '0.75rem'; 
        
        btn.addEventListener('click', async (e) => {
            e.preventDefault(); e.stopPropagation();
            if (btn.disabled) return;
            btn.textContent = '🔍...'; btn.disabled = true;
            const url = await extractUrlFromNfo(nfoUrl);
            if (url) {
                GM_openInTab(url, { active: false, insert: true });
                btn.textContent = '✅ Link';
                btn.href = url;
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-success');
                const newBtn = btn.cloneNode(true);
                btn.replaceWith(newBtn);
            } else {
                btn.textContent = '❌ N/A';
                btn.classList.replace('btn-outline-primary', 'btn-outline-secondary');
                setTimeout(() => btn.disabled = false, 2000);
            }
        });
        wrapper.appendChild(btn);
        btnContainer.parentElement.insertBefore(wrapper, btnContainer.nextSibling);
    }

    function processImage(img) {
        if (img.dataset.ultraBound) return;
        img.dataset.ultraBound = '1';

        const container = DOM_HELPERS.getContainer(img);
        if (!container) return;

        const isPh = DOM_HELPERS.isPlaceholder(img);
        const name = DOM_HELPERS.getReleaseName(container);

        if (isPh) img.dataset.isPlaceholder = "true";

        // --- MOUSE EVENTS (mit Keyboard Guard) ---
        img.addEventListener('mouseenter', () => {
            // Wenn wir im Keyboard Modus sind, ignorieren wir "zufälliges" Hovern beim Scrollen etc.
            if (isKeyboardMode) return;

            updateImageCache();
            activeIndex = allImagesCache.indexOf(img);
            showOverlay(img, name, isPh);
        });

        img.addEventListener('mouseleave', () => {
            // Nur verstecken, wenn NICHT im Keyboard Modus
            if (!isKeyboardMode) hideOverlay();
        });

        if (isPh) {
            img.addEventListener('click', (e) => {
                e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); 
                if (name) {
                    const cleanName = cleanReleaseName(name);
                    const finalName = cleanName.length > 2 ? cleanName : name; 
                    const q = encodeURIComponent(finalName + ' cover');
                    GM_openInTab(`https://www.google.com/search?tbm=isch&q=${q}`, { active: false, insert: true });
                }
                return false;
            }, true); 
        }

        const nfo = DOM_HELPERS.getNfoUrl(container);
        if (nfo) addStreamingButton(container, nfo);
    }

    // ==========================================
    // 5. MAIN LOOPS
    // ==========================================

    function runLoop() {
        const firstRow = document.querySelector(CONFIG.rowSelector);
        if (firstRow && firstRow.parentElement) {
            sortContainer(firstRow.parentElement);
        }
        document.querySelectorAll(CONFIG.imgSelector).forEach(processImage);
        updateImageCache();
    }

    function init() {
        setupGlobalElements();
        
        // 1. Keyboard Listener (Navi)
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') navigateGallery(1);
            else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') navigateGallery(-1);
        });

        // 2. Mouse Move Listener (Reset Ghost Mode)
        // Wenn die Maus sich signifikant bewegt, beenden wir den Keyboard-Modus
        // und das Overlay verschwindet (wenn man nicht zufällig über einem Bild ist).
        document.addEventListener('mousemove', (e) => {
            if (!isKeyboardMode) return; // Performance

            // Wir schalten den Modus aus.
            isKeyboardMode = false;
            
            // Check: Sind wir gerade über einem Bild?
            const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
            if (!hoveredEl || !hoveredEl.classList.contains('thumb-zoom')) {
                // Wenn Maus im Leeren ist: Overlay weg
                hideOverlay();
                // Highlight weg
                document.querySelectorAll('.ultra-keyboard-active').forEach(el => el.classList.remove('ultra-keyboard-active'));
            } else {
                // Wenn Maus über einem Bild ist: Trigger Hover manuell für dieses Bild
                const evt = new MouseEvent('mouseenter');
                hoveredEl.dispatchEvent(evt);
            }
        });

        window.addEventListener('scroll', hideOverlay);
        runLoop();
        const observer = new MutationObserver((mutations) => {
            if (isSorting) return;
            if (mutations.some(m => m.addedNodes.length > 0)) requestAnimationFrame(runLoop);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();