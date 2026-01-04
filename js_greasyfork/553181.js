// ==UserScript==
// @name         LaDepeche.fr – Affiche le contenu complet des articles
// @namespace    https://greasyfork.org/fr/users/1528785
// @version      1.0
// @description  Affiche le texte des articles dans une popup.
// @author       rommar31
// @match        https://www.ladepeche.fr/*
// @icon         https://www.ladepeche.fr/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553181/LaDepechefr%20%E2%80%93%20Affiche%20le%20contenu%20complet%20des%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/553181/LaDepechefr%20%E2%80%93%20Affiche%20le%20contenu%20complet%20des%20articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const paywallDiv = document.querySelector('.article-full__body-content.article-paywall[data-state="fixed-height"]');
        if (!paywallDiv) return;

        const paragraphs = paywallDiv.querySelectorAll('p');
        if (!paragraphs.length) return;

        let fullText = '';
        paragraphs.forEach(p => {
            fullText += p.innerText.trim() + '\n\n';
        });

        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '99999',
            width: '420px',
            maxWidth: 'calc(100% - 40px)',
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #aaa',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            color: '#111',
            boxSizing: 'border-box'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            position: 'sticky',
            top: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.98)',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottom: '1px solid #e0e0e0',
            zIndex: '10', // au-dessus du contenu lors du scroll
            boxSizing: 'border-box'
        });

        const title = document.createElement('div');
        title.textContent = 'Texte de l’article';
        Object.assign(title.style, {
            fontWeight: '600',
            fontSize: '13px',
            lineHeight: '1'
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '✕';
        Object.assign(closeBtn.style, {
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '1',
            padding: '2px 6px',
            color: '#444'
        });
        closeBtn.addEventListener('click', () => popup.remove());

        const content = document.createElement('pre');
        content.textContent = fullText;
        Object.assign(content.style, {
            whiteSpace: 'pre-wrap',
            margin: '10px',
            padding: '0',
            fontSize: '13px',
            lineHeight: '1.45',
            boxSizing: 'border-box'
        });

        header.appendChild(title);
        header.appendChild(closeBtn);
        popup.appendChild(header);
        popup.appendChild(content);
        document.body.appendChild(popup);
    });
})();
