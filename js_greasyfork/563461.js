// ==UserScript==
// @name         Veck.io Cheat Aimbot, Visuals, Exploits | Recte
// @description  The Best & Only Veck.io Cheat
// @namespace    Recte
// @version      2.007
// @icon         https://recte.cc/imgs/recte_logo.png
// @description
// @author       recte.cc | Suppress @ TJ
// @match        https://*veck.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563461/Veckio%20Cheat%20Aimbot%2C%20Visuals%2C%20Exploits%20%7C%20Recte.user.js
// @updateURL https://update.greasyfork.org/scripts/563461/Veckio%20Cheat%20Aimbot%2C%20Visuals%2C%20Exploits%20%7C%20Recte.meta.js
// ==/UserScript==

(() => {
    'use strict';

    console.log('[Recte] Starting loader…');

    /**
     * Load external JS safely using GM_xmlhttpRequest
     */
    function loadScript(url, name) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: res => {
                    try {
                        // Execute in page context
                        unsafeWindow.eval(res.responseText);
                        console.log(`[Recte] Loaded: ${name}`);
                        resolve();
                    } catch (err) {
                        reject(`[Recte] Eval failed for ${name}: ${err}`);
                    }
                },
                onerror: err => reject(`[Recte] Request failed for ${name}: ${err}`)
            });
        });
    }

    const libs = [
        {
            name: 'UWMK',
            url: 'https://raw.githubusercontent.com/TJGTA3/filehostalskdfjkalsjflaksdjf/refs/heads/main/metadata31fixed5'
        },
        {
            name: 'Vecte',
            url: 'https://raw.githubusercontent.com/guy69436-boop/Vecte/refs/heads/main/Vecte.js'
        }
    ];

    (async () => {
        try {
            for (const lib of libs) {
                await loadScript(lib.url, lib.name);
            }

            unsafeWindow.cheat = true;
            console.log('[Recte] Loader finished.');
        } catch (e) {
            console.error(e);
        }
    })();
})();