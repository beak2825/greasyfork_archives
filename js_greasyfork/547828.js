// ==UserScript==
// @name         Reading Bad Eggs
// @namespace    https://reading-eggs.mutoo.im
// @version      0.1.2
// @description  enable locked features
// @author       mutoo<gmutoo@gmail.com>
// @match        https://student-client.readingeggs.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readingeggs.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547828/Reading%20Bad%20Eggs.user.js
// @updateURL https://update.greasyfork.org/scripts/547828/Reading%20Bad%20Eggs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for requirejs and target path to be available
    function trySetFlag() {
        try {
            const appMod = window.requirejs?.entries?.["@ember/application/index"]?.module?.exports;
            const userService = appMod?._loaded?.application?.__container__?.cache?.["service:user"];

            if (userService && userService.student) {
                userService.student.gamesAccess = true;
                userService.student.playroomAccess = true;
                console.log("[Tampermonkey] gamesAccess & playroomAccess set to true");
                return true;
            }
        } catch (err) {
            console.warn("[Tampermonkey] Failed to set access:", err);
        }
        return false;
    }

    // Poll every 500ms
    const interval = setInterval(() => {
        trySetFlag();
    }, 500);
})();