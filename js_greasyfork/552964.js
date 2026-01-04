// ==UserScript==
// @name         Privacy Enhancer - ProtectedText
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Removes the ProtectedText password from your browser URL+history for increased security, while keeping you logged in.
// @author       hacker09
// @match        https://www.protectedtext.com/*
// @icon         https://www.protectedtext.com/img/apple-touch-icon-114x114.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552964/Privacy%20Enhancer%20-%20ProtectedText.user.js
// @updateURL https://update.greasyfork.org/scripts/552964/Privacy%20Enhancer%20-%20ProtectedText.meta.js
// ==/UserScript==

window.onload = () => {
  history.replaceState(null, '', 'https://www.protectedtext.com' + location.pathname);
};