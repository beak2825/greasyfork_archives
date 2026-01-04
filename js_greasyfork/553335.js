// ==UserScript==
// @name         TikTok Clickable Plox
// @namespace    tiktok-clickable-plox
// @description  Hace clicables con rueda del raton videos relacionados (miniatura y título) en TikTok Desktop y añade toggle para abrir en nueva pestaña al darles click normal.
// @version      0.0.2
// @author       Alplox
// @match        https://www.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/Alplox/TikTok-Clickable-Plox
// @supportURL   https://github.com/Alplox/TikTok-Clickable-Plox/issues
// @downloadURL https://update.greasyfork.org/scripts/553335/TikTok%20Clickable%20Plox.user.js
// @updateURL https://update.greasyfork.org/scripts/553335/TikTok%20Clickable%20Plox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIGURACIÓN DEL ESTADO ---
    const RELATED_KEY = 'tiktok_open_related_new_tab';
    const SHOW_FULL_URL_KEY = 'tiktok_show_full_url_in_bio';

    // Establecido a 'false' para que esté DESACTIVADO por defecto
    // Si el valor guardado es 'false', se usa. Si no existe, se usa 'false' por defecto.
    let openRelatedInNewTab = GM_getValue(RELATED_KEY, false);
    let showFullUrl = GM_getValue(SHOW_FULL_URL_KEY, false);

    let menuRelatedId = null;
    let menuFullUrlId = null;

    // --- MENÚS ---
    function updateMenus() {
        if (typeof GM_unregisterMenuCommand === 'function') {
            if (menuRelatedId !== null) GM_unregisterMenuCommand(menuRelatedId);
            if (menuFullUrlId !== null) GM_unregisterMenuCommand(menuFullUrlId);
        }

        menuRelatedId = GM_registerMenuCommand(
            `${openRelatedInNewTab ? '✅ Activado' : '❌ Desactivado (por defecto)'} abrir relacionados en nueva pestaña`,
            () => {
                const wasActive = openRelatedInNewTab; // Guarda el estado actual
                openRelatedInNewTab = !openRelatedInNewTab;

                // 1. Guardar el nuevo estado
                GM_setValue(RELATED_KEY, openRelatedInNewTab);

                // 2. Aplicar/retirar estilo dinámico que hace clickables los enlaces
                setClickableStyle(openRelatedInNewTab);

                // 3. Si se DESACTIVA, eliminar handlers y forzar un re-scan para limpiar marcas/atributos
                if (wasActive && !openRelatedInNewTab) {
                    // quitar handlers/flags y restaurar anchors
                    detachHandlers(document);
                    // re-scan para elementos hijos nuevos si fuera necesario
                    scan(document);
                    updateMenus();
                    return;
                }

                // 4. Si se ACTIVA, hacer un re-scan para añadir handlers a los elementos ya existentes
                updateMenus();
                scan(document);
            }
        );

        menuFullUrlId = GM_registerMenuCommand(
            `${showFullUrl ? '✅ Mostrando' : '❌ Ocultando (por defecto)'} URL completa en biografía`,
            () => {
                showFullUrl = !showFullUrl;
                GM_setValue(SHOW_FULL_URL_KEY, showFullUrl);
                applyFullUrlStyle(document);
                updateMenus();
            }
        );
    }

    // --- ESTILOS GENERALES ---
    // Reglas base (siempre aplicadas). NOTA: la regla que forcea "pointer-events:auto" para enlaces
    // se maneja dinámicamente en setClickableStyle() para poder desactivar sin recargar.
    GM_addStyle(`
    [data-e2e="user-post-item"], [data-e2e="video-item"], [data-e2e="video-card"],
    a[href*="/video/"], a[href*="/@"] {
      user-select: text !important;
    }
    .tiktok-overlay, .overlay, [data-e2e="video-overlay"] {
      pointer-events: none !important;
    }
    `);

    // Elemento <style> que se añade/remueve cuando activamos/desactivamos el comportamiento "clickable"
    let clickableStyleEl = null;
    function setClickableStyle(enabled) {
        try {
            if (enabled) {
                if (clickableStyleEl) return;
                clickableStyleEl = document.createElement('style');
                clickableStyleEl.id = 'tiktok-clickable-plox-clickable-style';
                clickableStyleEl.textContent = `
                    a[class*="--LinkNonClickable"], a[role="link"] {
                        pointer-events: auto !important;
                        cursor: pointer !important;
                    }
                `;
                (document.head || document.documentElement).appendChild(clickableStyleEl);
            } else {
                if (!clickableStyleEl) {
                    const ex = document.getElementById('tiktok-clickable-plox-clickable-style');
                    if (ex) { ex.remove(); clickableStyleEl = null; }
                    return;
                }
                clickableStyleEl.remove();
                clickableStyleEl = null;
            }
        } catch { }
    }

    // --- SELECTORES ---
    const cardSelector = `
    [data-e2e="video-item"],
    [data-e2e="user-post-item"],
    article,
    div[class*="--DivItemContainer"],
    div[class*="--DivCoverContainer"]
    `;

    // --- UTILS ---
    function normalizeUrl(s) {
        if (!s) return null;
        s = String(s).trim();
        if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
        try { return new URL(s).href; } catch { return null; }
    }

    function abs(href) {
        if (!href) return null;
        href = href.trim();
        if (href.startsWith('//')) href = location.protocol + href;
        if (href.startsWith('/')) href = location.origin + href;
        if (!/^https?:\/\//i.test(href)) href = 'https://' + href;
        try { return new URL(href).href; } catch { return href; }
    }

    // --- UNWRAP LINK ---
    function extractFromLinkHref(href) {
        if (!href) return null;
        try {
            const u = new URL(href, location.origin);
            const target = u.searchParams.get('target') || u.searchParams.get('u') || u.searchParams.get('url');
            if (target) return normalizeUrl(decodeURIComponent(target)) || normalizeUrl(target);

            if (u.pathname.startsWith('/link/')) {
                const seg = u.pathname.split('/').slice(2).join('/') || '';
                try {
                    const decoded = decodeURIComponent(seg);
                    if (decoded && (decoded.includes('.') || decoded.startsWith('http'))) return normalizeUrl(decoded);
                } catch { }
                try {
                    const b64 = seg.replace(/_/g, '/').replace(/-/g, '+');
                    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
                    const dec = atob(padded);
                    if (dec && (dec.includes('.') || dec.startsWith('http'))) return normalizeUrl(dec);
                } catch { }
            }

            for (const p of ['redirect', 'r']) {
                const v = u.searchParams.get(p);
                if (v) {
                    try { return normalizeUrl(decodeURIComponent(v)); } catch { }
                    return normalizeUrl(v);
                }
            }
        } catch { }
        return null;
    }

    function fixAnchor(a) {
        try {
            if (!a || a.dataset?.tiktokUnwrapped) return;
            const raw = a.getAttribute('href');
            if (!raw || !raw.includes('/link')) return;
            const resolved = extractFromLinkHref(raw) ||
                normalizeUrl(a.dataset?.href || a.dataset?.url || a.dataset?.link);
            if (resolved) {
                a.href = resolved;
                a.target ||= '_blank';
                a.rel ||= 'noopener noreferrer';
                a.dataset.tiktokUnwrapped = '1';
            }
        } catch { }
    }

    // --- SHOW FULL URL IN BIO ---
    function applyFullUrlStyle(root = document) {
        const bios = root.querySelectorAll('div[class*="--DivShareLinks"] a[data-e2e="user-link"]');
        bios.forEach(bio => {
            bio.style.maxWidth = showFullUrl ? 'none' : '';
        });
    }

    // --- OPEN RELATED HANDLERS ---
    function getHrefFromCard(card) {
        if (!card) return null;
        const preferred = card.querySelector('a[class*="--LinkNonClickable"][href], a[href*="/video/"], a[href*="/@"]');
        if (preferred?.getAttribute('href')) return abs(preferred.getAttribute('href'));
        const a = card.querySelector('a[href]');
        if (a?.getAttribute('href')) return abs(a.getAttribute('href'));

        const vid = card.querySelector('[data-video-id], [data-post-id], [data-id]');
        if (vid) {
            const id = vid.dataset.videoId || vid.dataset.postId || vid.dataset.id;
            if (id) {
                const userA = card.querySelector('a[href*="/@"]');
                if (userA) return abs(userA.getAttribute('href')).replace(/\/$/, '') + '/video/' + id;
                return 'https://www.tiktok.com/video/' + id;
            }
        }
        return null;
    }
    function attachHandlers(card) {
        if (!card || card.__tiktok_attached) return;

        const url = getHrefFromCard(card);
        if (!url) return;

        // Marcar SOLO después de confirmar que hay URL y que se añaden handlers
        card.__tiktok_attached = true;
        card.dataset.tiktokAttached = '1';

        card.style.cursor = 'pointer';

        // Handler para pointerdown: previene la accion nativa solo si está ACTIVO
        const pointerDownHandler = e => {
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

            const shouldOpenInNewTab = GM_getValue('tiktok_open_related_new_tab', false);

            // Si está DESACTIVADO, salimos y permitimos el evento nativo.
            if (!shouldOpenInNewTab) return;

            // Si está ACTIVO: Bloqueamos la propagación AQUI para evitar que TikTok procese el 'pointerdown'/'mousedown'.
            const path = e.composedPath?.() || e.path || [];
            for (const el of path) {
                if (el === card) continue;
                if (el instanceof HTMLElement && el.closest('button,a,input,textarea,select,[role="button"],[role="link"]')) return;
            }

            // Anulación agresiva en pointerdown
            e.stopImmediatePropagation();
            e.preventDefault();
        };

        // Handler para click: abre la nueva pestaña
        const clickHandler = e => {
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

            const shouldOpenInNewTab = GM_getValue('tiktok_open_related_new_tab', false);

            // Si está DESACTIVADO, salimos (el evento ya no fue bloqueado en pointerdown).
            if (!shouldOpenInNewTab) return;

            // Si el click no fue ya bloqueado, lo hacemos ahora (redundante pero seguro)
            e.preventDefault();
            e.stopPropagation();

            // Abrir nueva pestaña
            try {
                window.open(url, '_blank', 'noopener,noreferrer');
            } catch {
                const t = document.createElement('a');
                t.href = url; t.target = '_blank'; t.rel = 'noopener noreferrer';
                document.body.appendChild(t); t.click(); t.remove();
            }
        };

        // Adjuntar handlers en la fase de captura (true)
        card.addEventListener('pointerdown', pointerDownHandler, true);
        card.addEventListener('click', clickHandler, true);

        // Almacenar handlers para un hipotético detach futuro (si la recarga falla)
        card.__tiktok_handler = { down: pointerDownHandler, click: clickHandler };
    }

    // --- NEW: DETACH HANDLERS ---
    // Elimina listeners añadidos por attachHandlers para poder volver al comportamiento nativo sin recargar
    function detachHandlers(root = document) {
        try {
            // 1) intentar selector rápido (marcados)
            const marked = Array.from(root.querySelectorAll('[data-tiktok-attached]'));
            // 2) además inspeccionar todos los nodos para capturar handlers añadidos antes de la marca
            const all = Array.from(root.getElementsByTagName('*'));
            const candidates = new Set([...marked, ...all]);
            candidates.forEach(el => {
                if (!el) return;
                // detectar handlers guardados como propiedad o marca
                const hasHandler = !!el.__tiktok_handler || !!el.__tiktok_attached || el.dataset?.tiktokAttached === '1';
                if (!hasHandler) return;
                const h = el.__tiktok_handler;
                try {
                    if (h?.down) el.removeEventListener('pointerdown', h.down, true);
                    if (h?.click) el.removeEventListener('click', h.click, true);
                } catch { }
                // limpiar propiedades / atributos
                try { delete el.__tiktok_handler; } catch { }
                try { delete el.__tiktok_attached; } catch { }
                try { el.removeAttribute && el.removeAttribute('data-tiktok-attached'); } catch { }
                try { el.dataset && (el.dataset.tiktokAttached = undefined); } catch { }
                // Restaurar cursor por si se cambió
                try { el.style && (el.style.cursor = ''); } catch { }
            });

            // Además, restaurar target/rel en anchors internos para evitar que el middle-click abra nueva pestaña
            try { restoreAnchorTargets(root); } catch { }

        } catch (err) {
            // no hacer nada si falla el proceso de limpieza
            try { console.warn('detachHandlers error', err); } catch { }
        }
    }

    // --- RESTAURAR TARGETS EN ANCLAS DE TARJETAS ---
    // Quita target="_blank" (y rel 'noopener noreferrer' si fue añadido) en enlaces internos de tarjetas relacionadas
    function restoreAnchorTargets(root = document) {
        try {
            // Selecciona anclas dentro de las tarjetas (incluye variantes por si las tarjetas no coinciden exactamente con cardSelector)
            const anchors = Array.from(root.querySelectorAll(`${cardSelector} a[href], a[href*="/video/"], a[href*="/@"]`));
            anchors.forEach(a => {
                if (!a || !a.getAttribute) return;
                const href = a.getAttribute('href') || '';
                // considerar rutas relativas o internas que tienden a abrir en la misma SPA
                const isInternal = href.startsWith('/') || href.includes(location.hostname) || /\/video\/|\/@/.test(href);
                if (!isInternal) return;
                // Sólo quitar target si está explícitamente en _blank (no tocar si el site lo necesita distinto)
                try {
                    if (a.target === '_blank') {
                        a.removeAttribute('target');
                    }
                    // quitar rel añadido por nosotros si es exactamente noopener noreferrer (pero no tocar otros valores)
                    const rel = a.getAttribute('rel') || '';
                    if (rel.split(/\s+/).sort().join(' ') === 'noopener noreferrer') {
                        a.removeAttribute('rel');
                    }
                } catch { }
            });
        } catch (err) {
            try { console.warn('restoreAnchorTargets error', err); } catch { }
        }
    }

    // --- ESCANEO GENERAL ---
    function scan(root = document) {
        root.querySelectorAll('a[href*="/link"], a[href*="tiktok.com/link"]').forEach(fixAnchor);
        root.querySelectorAll(cardSelector).forEach(attachHandlers);
        root.querySelectorAll('a[class*="--LinkNonClickable"]').forEach(a => {
            const c = a.closest(cardSelector) || a.parentElement;
            if (c) attachHandlers(c);
        });
        applyFullUrlStyle(root);
    }

    // --- OBSERVADOR ---
    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.addedNodes?.length) m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); });
            if (m.type === 'attributes' && m.target?.matches?.('a[href]')) fixAnchor(m.target);
        }
    });

    // --- INICIO ---
    function start() {
        scan(document);
        mo.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'class']
        });
    }

    updateMenus();
    // Aplicar estado de estilo según el valor guardado al arrancar
    setClickableStyle(openRelatedInNewTab);
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();