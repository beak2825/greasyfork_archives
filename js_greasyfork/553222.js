// ==UserScript==
// @name         LEquipe.fr - Affiche le contenu complet des articles
// @namespace    https://greasyfork.org/fr/users/1528785
// @version      1.0
// @description  Affiche le texte complet des articles
// @match        https://www.lequipe.fr/*
// @icon         https:/www.lequipe.fr/img/favicons/manifest-48x48.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553222/LEquipefr%20-%20Affiche%20le%20contenu%20complet%20des%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/553222/LEquipefr%20-%20Affiche%20le%20contenu%20complet%20des%20articles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectArticleBody(article) {
        if (!article || article.dataset.articleBodyInjected === '1') return false;
        const script = article.querySelector('script');
        if (!script || !script.textContent.trim()) return false;
        let json;
        try {
            json = JSON.parse(script.textContent);
        } catch (e) {
            return false;
        }
        const body = json.articleBody;
        if (!body) return false;
        const paragraphs = article.querySelectorAll('p.Paragraph__content');
        if (!paragraphs.length) return false;
        paragraphs.forEach(p => {
            p.innerHTML = body;
        });
        article.dataset.articleBodyInjected = '1';
        return true;
    }

    function observeArticle(article) {
        if (!article || article.dataset.observerAttached === '1') return;
        const observer = new MutationObserver(() => {
            injectArticleBody(article);
        });
        observer.observe(article, { childList: true, subtree: true, characterData: true });
        article.dataset.observerAttached = '1';
        injectArticleBody(article);
    }

    function scanArticles() {
        document.querySelectorAll('article.Article--premium').forEach(observeArticle);
    }

    const globalObserver = new MutationObserver(scanArticles);
    globalObserver.observe(document.body, { childList: true, subtree: true });

    scanArticles();

})();
