// ==UserScript==
// @name         HS.fi paywall remover
// @version      0.1
// @description  Remove hs.fi paywall
// @author       deiga
// @match        http://www.hs.fi
// @match        http://www.hs.fi/*
// @grant        none
// @namespace https://greasyfork.org/users/9867
// @downloadURL https://update.greasyfork.org/scripts/8695/HSfi%20paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/8695/HSfi%20paywall%20remover.meta.js
// ==/UserScript==
localStorage.removeItem('_hs_paywall_hits');
