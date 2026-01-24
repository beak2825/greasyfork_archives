// ==UserScript==
// @name         Menéame dark
// @namespace    http://meneame.net/
// @version      0.403
// @description  Meneame dark mode – sin flash de contenido claro
// @author       I my me
// @match        *://*.meneame.net/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563802/Men%C3%A9ame%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/563802/Men%C3%A9ame%20dark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Evitar múltiples ejecuciones
    if (window.meneameDarkApplied) return;
    window.meneameDarkApplied = true;

    const darkCSS = `
        :root {
            --bg-primary: #1A1A1A;
            --text-primary: #FFF2E8;
            --accent-orange: #e35614;
            --comment-author: #BF5500;
            --comment-phantom: #693000;
            --border-color: orange;
        }
        body {
            color: var(--text-primary) !important;
            background: var(--bg-primary) !important;
        }
        .news-content,
        a,
        .news-details span,
        .comment-footer .votes-counter,
        .news-shakeit .votes a, .comment-text {
            color: var(--text-primary) !important;
        }
        .header-menu01,
        .header-menu-wrapper,
        .header-top-wrapper,
        .news-summary .warn,
        .story-blog .warn,
        .comment-body,
        .news-details a.comments,
        .news-shakeit .clics,
        .news-shakeit .votes,
        .news-shakeit.mnm-queued .votes,
        .news-shakeit.mnm-queued .clics,
        .section-profile .contents-layout,
        .section-profile .contents-layout .contents-body {
            background: var(--bg-primary) !important;
        }
        .comment.author .comment-body,
        .threader.collapsed > .comment .comment-body {
            background: var(--comment-author) !important;
            color: var(--text-primary) !important;
        }
        .comment.phantom .comment-body,
        .comment.high .comment-body {
            background: var(--comment-phantom) !important;
        }
        .topbox,
        #sidebar,
        .news-body .box {
            display: none !important;
        }
        #newswrap {
            margin: 10px 10% !important;
        }
        .menu01-itemsl a.submit_new_post,
        .menu01-itemsl a.submit_new_article,
        fieldset,
        .button,
        button,
        input[type="button"],
        input[type="submit"] {
            background: none !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: none !important;
        }
        ul#userinfo a.notifications span {
            border-color: var(--bg-primary) !important;
        }
        div.dropdown.menu-more.open ul.dropdown-menu.menu-subheader,
        div.dropdown.menu-more.open a.menu-more-button {
            background: darkgrey !important;
        }
        .section-profile .contents-layout .contents-body table.table-condensed th:hover,
        .table-condensed > tbody > tr > td:hover {
            background: darkgrey !important;
        }
        .section-profile .contents-layout .contents-menu a.selected,
        .section-profile .contents-layout .contents-menu a:hover {
            background: var(--border-color) !important;
        }
        .btn.btn-mnm.btn-inverted {
            background: var(--border-color) !important;
        }
        .comment-header .comment-date,
        .comment.high .comment-date {
            color: white !important;
        }
        select {
            background: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }
        /* Fallback anti-FOUC */
        html { background: #1A1A1A !important; }
        
        .news-details select {
            text-overflow: ellipsis;
        }
    `;

    // 🚀 Inyectar CSS directamente en el stream del documento
    const styleTag = `<style id="menemame-dark-preload">${darkCSS}<\/style>`;

    // Guardar referencia original
    const originalOpen = document.open;
    const originalWrite = document.write;
    const originalWriteln = document.writeln;

    // Sobreescribir document.write para inyectar CSS al inicio
    document.open = function () {
        const result = originalOpen.apply(this, arguments);
        // Asegurar que el estilo se inyecta al abrir
        try {
            originalWrite.call(this, styleTag);
        } catch (e) {}
        return result;
    };

    document.write = function (...args) {
        // Si es la primera escritura, inyectar el estilo antes
        if (!this._darkModeInjected) {
            this._darkModeInjected = true;
            // Insertar el estilo antes del primer fragmento de HTML
            args[0] = styleTag + (args[0] || '');
        }
        return originalWrite.apply(this, args);
    };

    document.writeln = function (...args) {
        if (!this._darkModeInjected) {
            this._darkModeInjected = true;
            args[0] = styleTag + (args[0] || '');
        }
        return originalWriteln.apply(this, args);
    };

    // Además, por si acaso, inyectar en el DOM actual (fallback)
    if (document.readyState === 'loading') {
        // Aún estamos en parsing: inyectar en <head> tan pronto como exista
        const inject = () => {
            if (document.head && !document.getElementById('menemame-dark-preload')) {
                const s = document.createElement('style');
                s.id = 'menemame-dark-preload';
                s.textContent = darkCSS;
                document.head.appendChild(s);
            }
        };
        if (document.head) {
            inject();
        } else {
            new MutationObserver((_, obs) => {
                if (document.head) {
                    inject();
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true, subtree: true });
        }
    }
})();