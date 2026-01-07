// ==UserScript==
// @name         Desmos Keybind Assist
// @namespace    http://tampermonkey.net/
// @version      2026-01-06
// @description  Enables you to bind keyboard keys to action expressions in Desmos. Add "@action_bind_key <list of keys>" in a text box before an action to add a key binding.
// @author       lemon
// @license      MIT
// @match        https://www.desmos.com/calculator*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=desmos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561584/Desmos%20Keybind%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/561584/Desmos%20Keybind%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForCalc() {
        if (window.Calc) setTimeout(initKeybinds, 1000);
        else setTimeout(waitForCalc, 100);
    }
    function initKeybinds() {
        console.log("[keybind assist] desmos detected, scanning for action bindings...");

        const exprs = Calc.getExpressions();
        const bindings = {}; // key: action id

        for (let i = 0; i < exprs.length; i++) {
            const expr = exprs[i];
            if (expr.type === "text" && expr.text.startsWith("@action_bind_key")) {
                const args = expr.text.trim().split(/\s+/);
                if (args.length < 2) continue;

                const actionExpr = exprs[i + 1];
                if (actionExpr && actionExpr.type === "expression") {
                    let keys = args.slice(1);
                    console.log(`[keybind assist] found binding: key ${keys.join(", ")} --> expression id ${actionExpr.id}:\n${actionExpr.latex}`)
                    for (let k of keys) {
                        k = k.toLowerCase();
                        if (k === "space") k = " ";
                        bindings[k] = actionExpr.id;
                    }
                }
            }
        }
        document.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (bindings[key]) {
                const exprId = bindings[key];
                Calc.controller.dispatch({
                    type: "action-single-step",
                    id: exprId
                });
                console.log(`[keybind assist] key ${key} pressed: triggered action id ${exprId}`);
            }
        });
    }
    waitForCalc();
})();