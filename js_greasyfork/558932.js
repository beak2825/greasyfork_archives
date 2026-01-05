// ==UserScript==
// @name         WME Hide Follow Discussion
// @namespace    https://greasyfork.org/users/wme-scripts
// @version      1.0.0
// @description  Blendet die "Diskussion verfolgen" Option im Waze Map Editor dauerhaft aus
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558932/WME%20Hide%20Follow%20Discussion.user.js
// @updateURL https://update.greasyfork.org/scripts/558932/WME%20Hide%20Follow%20Discussion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_ID = 'wme-hide-follow-discussion-style';

    // CSS zum Ausblenden des "Diskussion verfolgen" Toggle-Switch
    const hideCSS = `
        /* Versteckt den wz-toggle-switch mit name="follow" */
        wz-toggle-switch[name="follow"] {
            display: none !important;
        }
    `;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = hideCSS;
        (document.head || document.documentElement).appendChild(style);
    }

    // Sofort injizieren
    injectStyle();

    // Nochmal nach DOM-Load, falls nötig
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyle);
    }

    console.log('WME Hide Follow Discussion: Aktiv');
})();
