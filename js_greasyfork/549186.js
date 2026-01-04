// ==UserScript==
// @name        takapuna grammar kamar no profile image + tgs
// @namespace   Violentmonkey Scripts
// @match       https://tgs.school.kiwi/*
// @grant       none
// @version     1.0
// @author      EnvIr0n
// @description For those people with unsatisfactory ID photos.
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/549186/takapuna%20grammar%20kamar%20no%20profile%20image%20%2B%20tgs.user.js
// @updateURL https://update.greasyfork.org/scripts/549186/takapuna%20grammar%20kamar%20no%20profile%20image%20%2B%20tgs.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    document.querySelectorAll('img').forEach(el => el.remove());
});
//EOF