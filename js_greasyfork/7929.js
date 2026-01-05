// ==UserScript==
// @name         Wix Branding Destroyer
// @namespace    https://userscripts-mirror.org/users/zackton
// @version      1.1.2
// @description  Youtube first list item removal
// @include      htt*://*.wix.com/*
// @downloadURL https://update.greasyfork.org/scripts/7929/Wix%20Branding%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/7929/Wix%20Branding%20Destroyer.meta.js
// ==/UserScript==

var del = document.getElementById('wixFooter')
del.parentNode.removeChild(del)