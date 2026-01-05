// ==UserScript==
// @name         trusteddtype disabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  disables trustedtypes
// @author       TTT
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558969/trusteddtype%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/558969/trusteddtype%20disabler.meta.js
// ==/UserScript==

const overwrite = false;
let needsTT = false;
const passThrough = s => s;
const policyName = "passthrough";
let TTP_default, TTP = {createHTML: passThrough, createScript: passThrough, createScriptURL: passThrough};

function doit() {
    try {
        if (typeof window.isSecureContext === 'boolean' && window.isSecureContext && window.trustedTypes && window.trustedTypes.createPolicy) {
            needsTT = true;
            if (trustedTypes.defaultPolicy) {
                TTP_default = trustedTypes.defaultPolicy;
                TTP = window.trustedTypes.createPolicy(overwrite ? "default" : policyName, TTP);
            } else {TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);}
        }
    } catch (e) {}
}

doit();