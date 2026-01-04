// ==UserScript==
// @name         Actu.fr - Affiche le contenu complet des articles
// @namespace    https://greasyfork.org/fr/users/1528785
// @version      1.0
// @description  Affiche le texte complet des articles
// @match        https://actu.fr/*
// @icon         https://static.actu.fr/themes/actu_v2/dist/favicons/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553212/Actufr%20-%20Affiche%20le%20contenu%20complet%20des%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/553212/Actufr%20-%20Affiche%20le%20contenu%20complet%20des%20articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unlockArticle() {
        const container = document.querySelector('.ac-article-content');
        if (container) {
            const hiddenParagraphs = container.querySelectorAll('p.wall-content');
            hiddenParagraphs.forEach(p => {
                p.style.display = '';
            });
        }
        const paywalls = document.querySelectorAll('.p3-advanced-paywall');
        paywalls.forEach(el => el.remove());
    }

    unlockArticle();

    const observer = new MutationObserver(() => {
        unlockArticle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
