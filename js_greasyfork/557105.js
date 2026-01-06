// ==UserScript==
// @name         Pixlr | Unlimited saves
// @namespace    https://greasyfork.org/users/821661
// @version      1.1
// @description  Bypass saves in pixlr
// @author       hdyzen
// @match        https://pixlr.com/*
// @icon         https://www.google.com/s2/favicons?domain=pixlr.com/&sz=64
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/557105/Pixlr%20%7C%20Unlimited%20saves.user.js
// @updateURL https://update.greasyfork.org/scripts/557105/Pixlr%20%7C%20Unlimited%20saves.meta.js
// ==/UserScript==

window.Number = new Proxy(window.Number, {
    apply(target, thisArg, args) {
        const result = Reflect.apply(target, thisArg, args);
        const stack = new Error().stack;

        if (stack.includes("saveClick") && !stack.includes("changeType")) {
            return 0;
        }

        return result;
    },
});
