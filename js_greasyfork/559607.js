// ==UserScript==
// @name         Mostra aviso quando chegar novo email no Outlook com base no FAVICON
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dispara alert() quando o favicon do Outlook muda (ponto vermelho de nova notificação). Sem contador, sem DOM, sem título.
// @author       Eliton
// @match        https://outlook.office.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559607/Mostra%20aviso%20quando%20chegar%20novo%20email%20no%20Outlook%20com%20base%20no%20FAVICON.user.js
// @updateURL https://update.greasyfork.org/scripts/559607/Mostra%20aviso%20quando%20chegar%20novo%20email%20no%20Outlook%20com%20base%20no%20FAVICON.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('🔔 Monitor FAVICON Outlook INICIANDO...');

    let lastIconHref = null;
    let alertAberto = false;

    function mostrarAlertaSimples() {
        if (alertAberto) return;
        alertAberto = true;
        window.alert('📧 Chegou um NOVO EMAIL / nova notificação no Outlook!');
        alertAberto = false;
    }

    function getFaviconLink() {
        // pega <link rel="icon"> ou similares
        const links = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="mask-icon"]');
        if (links.length > 0) return links[0];
        return null;
    }

    function verificarMudancaFavicon() {
        const link = getFaviconLink();
        if (!link) return;

        const href = link.href || link.getAttribute('href') || '';
        if (lastIconHref === null) {
            lastIconHref = href;
            console.log('📌 Favicon inicial:', href);
            return;
        }

        if (href !== lastIconHref) {
            console.log('🎯 FAVICON MUDOU:', { antes: lastIconHref, depois: href });
            lastIconHref = href;
            // sempre que mudar, considera como nova notificação
            mostrarAlertaSimples();
        }
    }

    function iniciarObserverFavicon() {
        const head = document.head || document.documentElement;
        if (!head) return;

        const observer = new MutationObserver(() => {
            verificarMudancaFavicon();
        });

        observer.observe(head, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['href', 'rel']
        });

        // checagem periódica de segurança
        setInterval(verificarMudancaFavicon, 2000);
    }

    function init() {
        verificarMudancaFavicon();
        iniciarObserverFavicon();
        console.log('✅ Monitor FAVICON Outlook ATIVO');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
