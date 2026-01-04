// ==UserScript==
// @name         JVA Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Applique un thème sombre/clair personnalisé sur le forum 18-25, qui s'adapte au thème du site.
// @author       FaceDePet
// @match        https://www.jeuxvideo.com/forums/0-51-0-1-0-*-0-blabla-18-25-ans.htm
// @match        https://www.jeuxvideo.com/forums/42-51-*
// @match        https://www.jeuxvideo.com/recherche/forums/*
// @grant        GM_xmlhttpRequest
// @connect      *.jeuxvideo.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555538/JVA%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/555538/JVA%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================================================================
    // --- PARTIE 1 : STYLES CSS ---
    // ==================================================================
    const style = document.createElement('style');
    style.textContent = `
        /* ================================================================== */
        /* --- THÈME SOMBRE (Styles par défaut) --- */
        /* ================================================================== */

        /* --- STYLES GÉNÉRAUX --- */
        body, .layout, .header, .footer { background-color: #18181B !important; color: #E7E5E4 !important; }

        /* --- LISTE DES TOPICS --- */
        ul.topic-list > li { background-color: #27272A !important; border-bottom: 1px solid #3f3f46 !important; }
        ul.topic-list > li:not(.topic-head):hover { background-color: #3F3F46 !important; }
        li.topic-head { background-color: #18181B !important; border-bottom: 2px solid #8AA0EF !important; color: #E7E5E4 !important; }
        a.topic-title, a.topic-author { color: #8AA0EF !important; }
        ul.topic-list > li:not(.topic-head):hover a.topic-title { color: #A6B9F2 !important; }
        .topic-date, .topic-count, .topic-date a { color: #E7E5E4 !important; }

        /* --- BOUTONS --- */
        .postMessage, .btn-repondre-msg, #page-topics .bloc-pre-left .btn-actu-new-list-forum {
             background-color: #8AA0EF !important; color: #18181B !important;
             border: 1px solid transparent !important; border-radius: 4px !important;
             transition: background-color 0.2s ease-in-out !important;
        }
        .postMessage:hover, .btn-repondre-msg:hover, #page-topics .bloc-pre-left .btn-actu-new-list-forum:hover { background-color: #5E72E4 !important; }

        .btn-actualiser-forum, #page-messages-forum .group-two .btn-actu-new-list-forum {
            background: transparent !important; color: #8AA0EF !important;
            border: 1px solid #8AA0EF !important; border-radius: 4px !important;
            transition: all 0.2s ease-in-out !important;
        }
        .btn-actualiser-forum:hover, #page-messages-forum .group-two .btn-actu-new-list-forum:hover { background-color: #1F2247 !important; }

        /* --- PAGE DES MESSAGES (dans un topic) --- */
        .bloc-message-forum { border: none !important; border-top: 1px solid #27272A !important; }
        .bloc-message-forum:nth-of-type(odd) { background-color: #1D1D20 !important; }
        .bloc-message-forum:nth-of-type(even) { background-color: #27272A !important; }
        .bloc-pseudo-msg { color: #8AA0EF !important; }
        .bloc-date-msg a, .bloc-user-level { color: #A1A1AA !important; }
        .txt-msg, .txt-msg p { color: #E7E5E4 !important; }
        .user-avatar-msg { border-radius: 8px !important; }

        /* --- PAGINATION --- */
        [class*="pagi-suivant-"], [class*="pagi-fin-"], [class*="pagi-precedent-"], [class*="pagi-debut-"] {
            background: transparent !important; color: #C3C3C7 !important; border: 1px solid #3F3F46 !important;
            border-radius: 8px !important; transition: all 0.2s ease-in-out !important;
        }
        [class*="pagi-suivant-actif"]:hover, [class*="pagi-fin-actif"]:hover, [class*="pagi-precedent-actif"]:hover, [class*="pagi-debut-actif"]:hover { background-color: #27272A !important; border-color: #52525b !important; }
        .bloc-liste-num-page span, .bloc-liste-num-page a { border-radius: 4px !important; transition: all 0.2s ease-in-out !important; }
        .bloc-liste-num-page a { color: #8AA0DC !important; }
        .page-active { background-color: #8AA0EF !important; color: #181837 !important; }
        .bloc-liste-num-page a:hover { background-color: #1F2247 !important; color: #8AA0EF !important; }
        .page-active:hover { background-color: #5E72E4 !important; color: #181836 !important; }
        [class*="-inactif"] { color: #666 !important; }

        /* --- COLONNE DROITE (CARDS) --- */
        .card, .header__bottom, .header__top { background-color: #27272A !important; border: 1px solid #3f3f46 !important; }
        .card .card-header, .card .card-body { color: #DFE5E4 !important; }
        .card .card-body a, .card .lien-jv { color: #879CE8 !important; }

        /* --- CITATIONS AMÉLIORÉES --- */
        .nested-quote-toggle-box, .btn-opener { display: none !important; }
        .jbc-btn-opener {
            margin-left: 10px; padding: 1px 8px; font-size: 0.8em; cursor: pointer;
            border: 1px solid #3f3f46; border-radius: 0 10px 10px 10px;
            background-color: #2b2a33; color: #E7E5E4;
            transition: background-color 0.2s ease;
        }
        .jbc-btn-opener:hover { background-color: #3a3942; }
        .jbc-btn-opener span { font-weight: bold; }
        .jbc-count-open { color: #8AA0EF; }
        .jbc-count-close { color: #f87171; }

        /* --- BADGE OP --- */
        .bloc-pseudo-msg.is-op {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px; /* Espace entre le pseudo et le badge */
            /* Logique pour tronquer le texte si besoin */
            max-width: 150px; /* Ajustez si besoin pour mobile */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .op-badge {
            flex-shrink: 0;
            padding: 2px 6px; font-size: 0.75em;
            font-weight: normal; border-radius: 4px; line-height: 1;
            background-color: #31333E; color: #A6B9F2;
        }

        /* --- ÉLÉMENTS DIVERS --- */
        .header__navLink, .headerAccount__pseudo, .titre-head-bloc, .breadcrumb__item { color: #E7E5E4 !important; }
        input.txt-search { background-color: #18181B !important; border: 1px solid #3f3f46 !important; color: #E7E5E4 !important; }
        .bloc-pre-pagi-forum { background-color: #27272A !important; }

        /* ================================================================ */
        /* --- THÈME CLAIR --- */
        /* ================================================================ */

        html.theme-light body, html.theme-light .layout, html.theme-light .header, html.theme-light .footer { background-color: #F1F5F9 !important; color: #334155 !important; }
        html.theme-light ul.topic-list > li { background-color: #FFFFFF !important; border-bottom: 1px solid #e2e8f0 !important; }
        html.theme-light ul.topic-list > li:not(.topic-head):hover { background-color: #FEFCE8 !important; }
        html.theme-light li.topic-head { background-color: #F1F5F9 !important; border-bottom: 2px solid #5E72E4 !important; color: #334155 !important; }
        html.theme-light a.topic-title, html.theme-light a.topic-author { color: #5E72E4 !important; }
        html.theme-light ul.topic-list > li:not(.topic-head):hover a.topic-title { color: #3C4AB8 !important; }
        html.theme-light .topic-date, html.theme-light .topic-count, html.theme-light .topic-date a { color: #334155 !important; }

        html.theme-light .postMessage, html.theme-light .btn-repondre-msg, html.theme-light #page-topics .bloc-pre-left .btn-actu-new-list-forum { background-color: #5E72E4 !important; color: #FFFFFF !important; }
        html.theme-light .postMessage:hover, html.theme-light .btn-repondre-msg:hover, html.theme-light #page-topics .bloc-pre-left .btn-actu-new-list-forum:hover { background-color: #525CD9 !important; }

        html.theme-light .btn-actualiser-forum, html.theme-light #page-messages-forum .group-two .btn-actu-new-list-forum { background: transparent !important; color: #5E72E4 !important; border: 1px solid #5E72E4 !important; }
        html.theme-light .btn-actualiser-forum:hover, html.theme-light #page-messages-forum .group-two .btn-actu-new-list-forum:hover { background-color: #EFF5FE !important; }

        html.theme-light .bloc-message-forum { border: none !important; border-top: 1px solid #E4E4E7 !important; }
        html.theme-light .bloc-message-forum:nth-of-type(odd) { background-color: #F8FAFC !important; }
        html.theme-light .bloc-message-forum:nth-of-type(even) { background-color: #FFFFFF !important; }
        html.theme-light .bloc-pseudo-msg { color: #5E72E9 !important; }
        html.theme-light .bloc-date-msg a, html.theme-light .bloc-user-level { color: #71717A !important; }
        html.theme-light .txt-msg, html.theme-light .txt-msg p { color: #334155 !important; }

        html.theme-light [class*="pagi-suivant-"], html.theme-light [class*="pagi-fin-"], html.theme-light [class*="pagi-precedent-"], html.theme-light [class*="pagi-debut-"] {
            background: transparent !important; color: #71717A !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important;
        }
        html.theme-light [class*="pagi-suivant-actif"]:hover, html.theme-light [class*="pagi-fin-actif"]:hover, html.theme-light [class*="pagi-precedent-actif"]:hover, html.theme-light [class*="pagi-debut-actif"]:hover { background-color: #f8fafc !important; border-color: #cbd5e1 !important; }
        html.theme-light .bloc-liste-num-page a { color: #5E72E4 !important; }
        html.theme-light .page-active { background-color: #5E72E4 !important; color: #FCFCFE !important; }
        html.theme-light .bloc-liste-num-page a:hover { background-color: #EFF5FE !important; color: #6072E4 !important; }
        html.theme-light .page-active:hover { background-color: #525CD9 !important; color: #FFFFFB !important; }
        html.theme-light [class*="-inactif"] { color: #cbd5e1 !important; }

        html.theme-light .card, html.theme-light .header__bottom, html.theme-light .header__top { background-color: #FFFFFF !important; border: 1px solid #e2e8f0 !important; }
        html.theme-light .card .card-header, html.theme-light .card .card-body { color: #33415C !important; }
        html.theme-light .card .card-body a, html.theme-light .card .lien-jv { color: #6376E5 !important; }

        html.theme-light .header__navLink, html.theme-light .headerAccount__pseudo, html.theme-light .titre-head-bloc, html.theme-light .breadcrumb__item { color: #334155 !important; }
        html.theme-light input.txt-search { background-color: #FFFFFF !important; border: 1px solid #e2e8f0 !important; color: #334155 !important; }
        html.theme-light .bloc-pre-pagi-forum { background-color: #FFFFFF !important; }

        html.theme-light .jbc-btn-opener { background-color: #f8fafc; color: #334155; border-color: #e2e8f0; }
        html.theme-light .jbc-btn-opener:hover { background-color: #e2e8f0; }
        html.theme-light .jbc-count-open { color: #5E72E4; }
        html.theme-light .jbc-count-close { color: #ef4444; }

        html.theme-light .op-badge { background-color: #EFF5FE; color: #5E72E4; }
    `;
    (document.head || document.documentElement).appendChild(style);

    // ==================================================================
    // --- PARTIE 2 : LOGIQUE JAVASCRIPT ---
    // ==================================================================

    function onPageReady() {
        if (document.getElementById('page-messages-forum')) {
            initializeBetterCitations();
            initializeOpHighlighter();
        }
    }

    function initializeBetterCitations() {
        const nestedQuotes = document.querySelectorAll('.txt-msg .blockquote-jv .blockquote-jv');
        nestedQuotes.forEach(quote => {
            const header = quote.previousElementSibling;
            if (!header || header.tagName !== 'P' || header.querySelector('.jbc-btn-opener')) return;
            quote.style.display = 'none';
            const nestedCount = quote.querySelectorAll('blockquote').length + 1;
            const btn = document.createElement('button');
            btn.className = 'jbc-btn-opener';
            btn.innerHTML = `ouvrir <span class="jbc-count-open">(${nestedCount})</span>`;
            header.appendChild(btn);
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const isHidden = quote.style.display === 'none';
                if (isHidden) {
                    quote.style.display = 'block';
                    btn.innerHTML = `fermer <span class="jbc-count-close">(${nestedCount})</span>`;
                } else {
                    quote.style.display = 'none';
                    btn.innerHTML = `ouvrir <span class="jbc-count-open">(${nestedCount})</span>`;
                }
            });
        });
    }

    async function initializeOpHighlighter() {
        const getTopicId = () => window.location.href.match(/\/forums\/\d+-\d+-(\d+)-/)?.[1];
        const getCurrentPage = () => parseInt(window.location.href.match(/-(\d+)-0-1-0-/)?.[1] || '1', 10);
        const topicId = getTopicId();
        const currentPage = getCurrentPage();
        if (!topicId) return;
        let opUsername = sessionStorage.getItem(`op_${topicId}`);
        if (!opUsername) {
            if (currentPage === 1) {
                opUsername = document.querySelector('.bloc-message-forum .bloc-pseudo-msg')?.textContent.trim();
            } else {
                try { opUsername = await fetchOpUsername(topicId); }
                catch (e) { console.error("Erreur lors de la récupération de l'OP:", e); return; }
            }
            if (opUsername) { sessionStorage.setItem(`op_${topicId}`, opUsername); }
        }
        if (opUsername) { highlightOpMessages(opUsername); }
    }

    function fetchOpUsername(topicId) {
        const pageOneUrl = window.location.href.replace(/-(\d+)-0-1-0-/, '-1-0-1-0-');
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: pageOneUrl,
                onload: (res) => {
                    const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                    const op = doc.querySelector('.bloc-message-forum .bloc-pseudo-msg')?.textContent.trim();
                    if (op) resolve(op);
                    else reject("Pseudo de l'OP non trouvé sur la page 1.");
                },
                onerror: (err) => reject(err)
            });
        });
    }

    function highlightOpMessages(opUsername) {
        document.querySelectorAll('.bloc-message-forum').forEach(message => {
            const pseudoElement = message.querySelector('.bloc-pseudo-msg');

            if (pseudoElement && pseudoElement.textContent.trim() === opUsername && !pseudoElement.classList.contains('is-op')) {
                const badge = document.createElement('span');
                badge.className = 'op-badge';
                badge.textContent = 'OP';

                pseudoElement.appendChild(badge);
                pseudoElement.classList.add('is-op');
            }
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPageReady);
    } else {
        onPageReady();
    }
})();