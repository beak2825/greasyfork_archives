// ==UserScript==
// @name        Azure DevOps Wiki blockquotes alert customizer
// @namespace   http://tampermonkey.net/
// @version     2025-10-03
// @description Customize markdown blockquotes with DocFx syntax ([!NOTE], [!TIP], etc.) in Azure DevOps Wiki with support for dynamic browsing.
// @author      You
// @match       https://dev.azure.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=dev.azure.com
// @grant       none
// @license     CC
// @downloadURL https://update.greasyfork.org/scripts/551023/Azure%20DevOps%20Wiki%20blockquotes%20alert%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/551023/Azure%20DevOps%20Wiki%20blockquotes%20alert%20customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const alertTypes = {
        '[!NOTE]': { class: 'alert alert-note', title: 'Nota' },
        '[!TIP]': { class: 'alert alert-tip', title: 'Recomendación' },
        '[!IMPORTANT]': { class: 'alert alert-important', title: 'Importante' },
        '[!CAUTION]': { class: 'alert alert-caution', title: 'Precaución' },
        '[!WARNING]': { class: 'alert alert-warning', title: 'Advertencia' },
        '[!TODO]': { class: 'alert alert-todo', title: 'TODO' }
    };

    function processQuotes() {
        const quotes = document.querySelectorAll('blockquote:not(.processed)');
        quotes.forEach(q => {
            const p = q.querySelector('p');
            if (p) {
                for (const [prefix, config] of Object.entries(alertTypes)) {
                    if (p.innerHTML.startsWith(prefix)) {
                        p.innerHTML = p.innerHTML.replace(prefix, '');

                        const classArray = config.class.split(' ');
                        q.classList.add(...classArray);
                        q.classList.add('processed'); // Marca como procesado

                        const title = document.createElement('div');
                        title.textContent = config.title;
                        title.classList.add('alert-heading');
                        p.insertBefore(title, p.firstChild);
                        break;
                    }
                }
            }
        });
    }

    // Ejecutar inicialmente
    processQuotes();

    // Observar cambios en el DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                processQuotes();
            }
        });
    });

    // Configurar el observador para monitorear cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();