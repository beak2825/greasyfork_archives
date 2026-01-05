// ==UserScript==
// @name        hideQuoraSignInModal
// @namespace   DT
// @description Hide Quora signin modal
// @include     http://www.quora.com/*
// @include     https://www.quora.com/*
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/6558/hideQuoraSignInModal.user.js
// @updateURL https://update.greasyfork.org/scripts/6558/hideQuoraSignInModal.meta.js
// ==/UserScript==

GM_addStyle(".modal_signup_background { display: none;}");
GM_addStyle(".modal_signup_dialog { display: none;}");
GM_addStyle(".dialog_wrapper { display: none;}");