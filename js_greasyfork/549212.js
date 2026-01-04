// ==UserScript==
// @name         1177 - Förkortad lista över ärendetyper (läkare)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Återgår till en enklare, mer robust metod baserat på användarens feedback. Döljer element utan att flytta dem.
// @author       Din användare
// @match        https://personal.arende.1177.se/*/healthcareprofessional/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549212/1177%20-%20F%C3%B6rkortad%20lista%20%C3%B6ver%20%C3%A4rendetyper%20%28l%C3%A4kare%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549212/1177%20-%20F%C3%B6rkortad%20lista%20%C3%B6ver%20%C3%A4rendetyper%20%28l%C3%A4kare%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[1177-TM-V9]';
    const log = (...a) => console.log(LOG_PREFIX, ...a);
    const warn = (...a) => console.warn(LOG_PREFIX, ...a);

    const DEFAULT_VISIBLE_ORDER = [
        'Fråga till invånare',
        'Meddelande till invånare',
    ];

    const PROCESSED_FLAG = 'data-tm-processed';

    // Lägg till CSS-regeln för att dölja de alternativ vi inte vill se
    GM_addStyle(`
        .mat-select-panel mat-option:not([data-tm-visible="true"]) {
            display: none !important;
        }
    `);

    // Funktion för att läsa den primära texten från ett alternativ
    function readOptionText(opt) {
        const textElement = opt.querySelector('.select-template-step__option-name');
        return textElement ? (textElement.textContent || '').trim() : '';
    }

    // Huvudfunktionen som hanterar själva listboxen
    function handleListBox() {
        const listbox = document.querySelector('.mat-select-panel[role="listbox"]');
        if (!listbox || listbox.hasAttribute(PROCESSED_FLAG)) {
            return;
        }

        listbox.setAttribute(PROCESSED_FLAG, 'true');

        const visibleOptions = GM_getValue('visibleOrderedItems', DEFAULT_VISIBLE_ORDER);
        const visibleSet = new Set(visibleOptions);

        const options = Array.from(listbox.querySelectorAll('mat-option'));

        if (options.length === 0) {
            warn('Listboxen är tom, kan inte processa.');
            listbox.removeAttribute(PROCESSED_FLAG);
            return;
        }

        log('Listbox hittad. Hittade följande primära ärendetyper:', options.map(o => readOptionText(o)));

        let foundCount = 0;
        options.forEach(option => {
            const label = readOptionText(option);

            if (visibleSet.has(label)) {
                option.setAttribute('data-tm-visible', 'true');
                foundCount++;
            } else {
                option.setAttribute('data-tm-visible', 'false');
            }
        });

        if (foundCount > 0) {
            log(`Processad. Visar ${foundCount} av ${options.length} alternativ.`);
        } else {
            warn('Inga matchningar hittades. Listboxen kan vara tom.');
        }

        // Sortera om de element som ska visas
        const container = listbox.querySelector('.mat-select-content, .mdc-list, .cdk-virtual-scroll-content-wrapper') || listbox;
        const frag = document.createDocumentFragment();

        visibleOptions.forEach(label => {
            const optionEl = options.find(o => readOptionText(o) === label);
            if (optionEl && optionEl.getAttribute('data-tm-visible') === 'true') {
                frag.appendChild(optionEl);
            }
        });

        if (frag.children.length > 0) {
            container.prepend(frag);
        }
    }

    // Den enkla men fungerande loopen som letar efter listboxen
    setInterval(handleListBox, 100);

    // Lyssnar på när menyn stängs för att återställa flaggan
    document.body.addEventListener('click', () => {
        setTimeout(() => {
            const listbox = document.querySelector('.mat-select-panel[role="listbox"]');
            if (!listbox) {
                const processedListbox = document.querySelector('.mat-select-panel['+ PROCESSED_FLAG +']');
                if(processedListbox) {
                   processedListbox.removeAttribute(PROCESSED_FLAG);
                }
                document.querySelectorAll('mat-option').forEach(option => {
                    option.removeAttribute('data-tm-visible');
                });
                log('Listbox stängd. Flaggor borttagna.');
            }
        }, 100);
    }, true);

    // Initialt anrop
    handleListBox();

})();