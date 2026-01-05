// ==UserScript==
// @name         okc unblock
// @namespace    https://github.com/phracker
// @version      1.0.1
// @description  okc photo unblock
// @author       phracker
// @include      http*://*okcupid.com/profile/*/photos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7550/okc%20unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/7550/okc%20unblock.meta.js
// ==/UserScript==

document.getElementById('photo_blocker').remove();
document.getElementById('photo_blocker_windowshade').remove();
document.getElementById('action_bar').remove();