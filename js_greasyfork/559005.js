// ==UserScript==
// @name         USAA ERDC Redirect
// @description  USAA-ERDC Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://apps.usaa.com/erdc/admin/data/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559005/USAA%20ERDC%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/559005/USAA%20ERDC%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const params = new URLSearchParams(window.location.search);
    const tblName = params.get('sourceTblName');
    const tblVersion = params.get('sourceTblVersion');
    window.location.replace(`https://apps.usaa.com/utils/erdc/source-table/${tblName}/${tblVersion}`);
})();