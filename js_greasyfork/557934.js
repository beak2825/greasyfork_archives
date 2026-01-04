// ==UserScript==
// @name         Champions Hockey League
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Vytváří záložku "Tracking" a odemyká záložku "Stats"
// @author       MK + Zelí
// @match        https://www.chl.hockey/en/matches/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557934/Champions%20Hockey%20League.user.js
// @updateURL https://update.greasyfork.org/scripts/557934/Champions%20Hockey%20League.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onhashchange = function() {
        if (location.href.includes('tab_event=tracking')) {
            setTimeout(function() {
                const iframe = document.querySelector('section > iframe');
                if (iframe) {
                    const iframeSrc = iframe.src;
                    const numberMatch = iframeSrc.match(/\d+$/);
                    if (numberMatch) {
                        const id = numberMatch[0];
                        const newUrl = "https://chl.hokejovyzapis.cz/pdf/print/de-html/" + id;
                        window.location.href = newUrl;
                        const liveUrl = "https://chlvisualization.laura.esports.cz/deserve2win/" + id;
                        window.open(liveUrl, '_blank');
                    } else {
                        console.log('Žádné číslo nebylo nalezeno v URL iframe.');
                    }
                } else {
                    console.log('Žádný iframe nebyl nalezen.');
                }
            }, 1000);
        }
    };

    setTimeout(function() {
        const trackingElement = document.querySelector('menuitem[data-target="tracking"]');
        if (trackingElement) {
            trackingElement.style.display = 'inline';
        }
    }, 2500);

    function processStatsTabs() {
        const containers = document.querySelectorAll('.m-event-tabs');
        containers.forEach(container => {
            const statsTab = container.querySelector('menuitem[data-content-id="stats"]');
            const previewTab = container.querySelector('menuitem[data-content-id="preview"]');
            if (!statsTab || !previewTab) return;

            statsTab.style.display = "inline";

            if (previewTab.nextElementSibling !== statsTab) {
                previewTab.insertAdjacentElement("afterend", statsTab);
            }

            statsTab.onclick = () => {
                window.location.hash = "#tab_event=stats";
            };
        });
    }

    function delayedInit() {
        processStatsTabs();
        setTimeout(processStatsTabs, 300);
        setTimeout(processStatsTabs, 1000);
        setTimeout(processStatsTabs, 2000);
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.m-event-tabs')) {
            delayedInit();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("load", delayedInit);
})();