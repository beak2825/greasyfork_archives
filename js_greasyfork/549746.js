// ==UserScript==
// @name         Vectal.ai Reimagined - Drawaria Script Maker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Transforms the UI of vectal.ai to precise layout, colors, and button placements for Drawaria Script Maker
// @author       YouTubeDrawaria
// @match        https://vectal.ai/*
// @match        https://www.vectal.ai/*
// @license MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/9/9a/Noun_Robot_1749584.svg
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549746/Vectalai%20Reimagined%20-%20Drawaria%20Script%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/549746/Vectalai%20Reimagined%20-%20Drawaria%20Script%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL do ícone
    const iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Noun_Robot_1749584.svg';

    function changeTitleAndIcon() {
        // Altera o título
        document.title = "Drawaria Script Maker";

        // Altera os ícones
        const iconLinkTypes = ['icon', 'apple-touch-icon', 'shortcut icon', 'apple-touch-icon-precomposed'];
        for (let type of iconLinkTypes) {
            let link = document.querySelector(`link[rel*='${type}']`);
            if (link) {
                link.href = iconUrl;
            } else {
                link = document.createElement('link');
                link.rel = type;
                link.href = iconUrl;
                document.head.appendChild(link);
            }
        }

        // Altera a meta tag og:image
        let metaOgImage = document.querySelector(`meta[property='og:image']`);
        if (metaOgImage) {
            metaOgImage.content = iconUrl;
        }
    }

    // Chama a função changeTitleAndIcon a cada 1000 milissegundos (ou seja, 1 segundo)
    setInterval(changeTitleAndIcon, 1000);

    /**
     * Función para ocultar los elementos de la interfaz.
     */
    function hideUnwantedElements() {
        console.log('Intentando ocultar elementos no deseados en vectal.ai...');

        // Función auxiliar para ocultar un elemento si se encuentra
        const hideElement = (selector, identifier) => {
            const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (element && element.style.display !== 'none') {
                element.style.setProperty('display', 'none', 'important');
                console.log(`${identifier} ocultado.`);
                return true;
            }
            return false;
        };

                // 1. Ocultar el sidebar (el div con w-[50px])
        hideElement('div.relative.flex.flex-col.h-\\[100dvh\\].w-\\[50px\\]', 'Sidebar');

        // 2. Ocultar el botón "Exit Fullscreen"
        hideElement('button[aria-label="Exit Fullscreen"]', 'Botón "Exit Fullscreen"');

        // 3. Ocultar el botón "UPGRADE TO PRO"
        const upgradeButton = Array.from(document.querySelectorAll('button')).find(button =>
            button.textContent.includes('UPGRADE TO PRO')
        );
        hideElement(upgradeButton, 'Botón "UPGRADE TO PRO"');

        // 4. Ocultar el prompt "¿What can I help with?"
        hideElement('div.flex.flex-col.items-center.gap-6.-mt-44', 'Prompt "¿What can I help with?"');

        // 5. Ocultar el elemento "vectal / today's tasks"
        // Se usa un selector basado en las clases del div principal.
        hideElement('div.absolute.left-1\\/2.transform.-translate-x-1\\/2.max-w-\\[50\\%\\]', 'Elemento "vectal / today\'s tasks"');
    }
    // Ejecutar la función de ocultación de elementos cuando la ventana completa esté cargada
    window.addEventListener('load', hideUnwantedElements);

    // Mantenemos un MutationObserver para detectar elementos que puedan ser
    // inyectados dinámicamente en el DOM DESPUÉS de la carga inicial de la página.
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Si se añadieron nuevos nodos, intenta ocultar los elementos nuevamente.
                // Usamos un pequeño retraso para permitir que el framework de la página
                // termine de procesar los nuevos nodos antes de intentar ocultarlos.
                requestAnimationFrame(hideUnwantedElements);
            }
        }
    });

    // Empezar a observar el cuerpo del documento y sus subárboles para cambios.
    observer.observe(document.body, { childList: true, subtree: true });

    // Como una medida adicional de seguridad, ejecutar también la función
    // después de pequeños retrasos por si algún elemento tarda en aparecer.
    setTimeout(hideUnwantedElements, 500); // 0.5 segundos después de la carga
    setTimeout(hideUnwantedElements, 1500); // 1.5 segundos después de la carga
    setTimeout(hideUnwantedElements, 3000); // 3 segundos después de la carga (para elementos muy lentos)

})();