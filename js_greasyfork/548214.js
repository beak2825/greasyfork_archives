// ==UserScript==
// @name         Mathy Seeds
// @namespace    https://math-seeds.mutoo.im
// @version      0.1.0
// @description  enable locked features
// @author       mutoo<gmutoo@gmail.com>
// @match        https://student.mathseeds.com/v2/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathseeds.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548214/Mathy%20Seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/548214/Mathy%20Seeds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for requirejs and target path to be available
    function trySetFlag() {
        try {
            const envMod = window.requirejs?.entries?.['mathseeds-client/config/environment']?.module?.exports;
            const appConfig = envMod?.default?.APP;

            if (appConfig) {
                appConfig.studentPlayroomAccess = true;
                appConfig.studentGamesAccess = true;
                console.log('[Tampermonkey] studentPlayroomAccess set to true');
                return true;
            }
        } catch (err) {
            console.warn('[Tampermonkey] Failed to set studentPlayroomAccess:', err);
        }
        return false;
    }

    // Poll every 500ms until flag set
    const interval = setInterval(() => {
        trySetFlag();
    }, 500);
})();