// ==UserScript==
// @name         AI Studio Mod: taula de continguts
// @name:es         AI Studio Mod: tabla de contenidos
// @name:en         AI Studio Mod: Table of Contents
// @namespace    https://greasyfork.org/users/137913
// @description  Afegeix una taula de continguts dinàmica amb desplaçament intel·ligent per a seccions llargues al tauler de configuració.
// @description:es  Añade una tabla de contenidos dinámica con desplazamiento inteligente para secciones largas en el tablero de configuración.
// @description:en  Add a dynamic table of contents with smart scrolling for long sections to the settings panel.
// @author       Margu (original TigerYT)
// @version      2.3.3
// @match        *://aistudio.google*/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_2_32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551056/AI%20Studio%20Mod%3A%20taula%20de%20continguts.user.js
// @updateURL https://update.greasyfork.org/scripts/551056/AI%20Studio%20Mod%3A%20taula%20de%20continguts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyCustomStyles() {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) {
            console.error('[TOC MOD] Could not find document head to inject styles.');
            return;
        }

        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'ai-studio-mod-styles'; // Give it an ID to prevent duplicates
        style.textContent = `
            /* Estil comú per a la taula de continguts */
            .toc-group-title {
                font-family: Inter,sans-serif;
                font-optical-sizing: auto;
                font-size: 12px;
                font-weight: 400;
                line-height: 20px;
                color: var(--color-v3-text-var);
                margin-block: 20px 12px;
            }

            .toc-item {
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-orient: horizontal;
                -webkit-box-direction: normal;
                -webkit-flex-direction: row;
                -moz-box-orient: horizontal;
                -moz-box-direction: normal;
                -ms-flex-direction: row;
                flex-direction: row;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                gap: 4px;
                -webkit-box-pack: justify;
                -webkit-justify-content: space-between;
                -moz-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;

                > p {
                    margin-block: 8px;
                }
            }

            .toc-jump-link {
                color: var(--google-blue-600, #1a73e8);
                text-decoration: none;
                font-weight: 500;
                cursor: pointer;

                &.jump-to-bottom {
                    color: oklch(from var(--color-v3-text-link) l c calc(h - 30));
                    margin-right: 1ch;
                }

                &:hover {
                    text-decoration: underline;
                    color: oklch(from currentColor calc(l * 1.5) c h);
                }
            }
        `;

        if (!document.getElementById(style.id)) {
            head.append(style);
        }
    }

    function updateTableOfContents(settingsContainer, chatBox) {

        // Esborreu els elements de la taula de continguts generats anteriorment per evitar la duplicació.
        const oldElements = settingsContainer.querySelectorAll('.injected');
        oldElements.forEach(el => el.remove());

        // Create the static container elements for the TOC.
        const dividerElement = document.createElement('mat-divider');
        dividerElement.className = 'injected mat-divider';
        dividerElement.style.margin = "8px 0";

        const headingElement = document.createElement('h3');
        headingElement.className = 'injected toc-group-title';
        headingElement.textContent = 'Table of Contents';

        const tocItemsContainer = document.createElement('div');
        tocItemsContainer.className = 'injected';

        // Find all chat turns and create a link for each one.
        const chatTurns = Array.from(chatBox.querySelectorAll('[class$="-prompt-container"]'));

        if (chatTurns.length > 0) {
            chatTurns.forEach((responseElem, index) => {
                let responseName = 'Unknown Turn';

                switch (responseElem.dataset.turnRole) {
                    case "User":
                        responseName = 'Entrada del User';
                        break;
                    case "Model":
                        responseName = responseElem.parentElement.querySelector('button[class*="edit"]') ? 'Sortida del model' : 'Pensament model';
                        break;
                }

                // Create the main container DIV for the row
                const tocItemContainer = document.createElement('div');
                tocItemContainer.className = 'toc-item';

                // Create the P element for the label
                const labelElement = document.createElement('p');
                labelElement.className = 'v3-font-body';
                labelElement.textContent = (index + 1) + '. ' + responseName;

                // Create a span to hold all action links
                const actionsSpan = document.createElement('span');

                // Check if the element is taller than the viewport
                const isTallerThanViewport = responseElem.offsetHeight > window.innerHeight;

                if (isTallerThanViewport) {
                    // If it's too tall, add the special 'scroll to bottom' link
                    const jumpLinkDown = document.createElement('a');
                    jumpLinkDown.className = 'toc-jump-link jump-to-bottom';
                    jumpLinkDown.textContent = '↓';
                    jumpLinkDown.title = 'Scroll to the bottom of this turn';
                    jumpLinkDown.addEventListener('click', () => {
                        responseElem.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
                    });
                    actionsSpan.append(jumpLinkDown);
                }

                // Always add the standard 'Go To' (scroll to top) link
                const jumpLinkGoTo = document.createElement('a');
                jumpLinkGoTo.className = 'toc-jump-link';
                jumpLinkGoTo.textContent = 'Go To';
                jumpLinkGoTo.title = 'Scroll to the top of this turn';
                jumpLinkGoTo.addEventListener('click', () => {
                    responseElem.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
                });
                actionsSpan.append(jumpLinkGoTo);

                // Assemble and append the final element
                tocItemContainer.append(labelElement, actionsSpan);
                tocItemsContainer.append(tocItemContainer);
            });
        }

        // Insert the newly created TOC elements into the settings panel.
        if (chatTurns.length > 0) {
            settingsContainer.insertAdjacentElement('beforeend', dividerElement);
            settingsContainer.insertAdjacentElement('beforeend', headingElement);
            settingsContainer.insertAdjacentElement('beforeend', tocItemsContainer);
        }
    }


    function initializeAndMonitor() {
        const observer = new MutationObserver((mutations, obs) => {
            const settingsContainer = document.querySelector('ms-prompt-run-settings');
            const chatBox = document.querySelector('ms-autoscroll-container');

            if (settingsContainer && chatBox && chatBox.firstElementChild) {
                obs.disconnect();
                updateTableOfContents(settingsContainer, chatBox);

                let debounceTimer;
                const chatObserver = new MutationObserver(() => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        updateTableOfContents(settingsContainer, chatBox);
                    }, 250);
                });

                chatObserver.observe(chatBox.firstElementChild, { childList: true });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    applyCustomStyles();
    initializeAndMonitor();

})();