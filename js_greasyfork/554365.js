// ==UserScript==
// @name         GGn Better.php Link in alertbar
// @namespace    https://gazellegames.net/
// @version      1.0
// @description  This will show a link to the Better.php page in the toolbar, next to the Alertbar link
// @author       monkeys
// @license      MIT
// @match        https://gazellegames.net/*
// @icon         https://gazellegames.net/favicon.ico
// @homepage     https://greasyfork.org/en/scripts/554365-ggn-better-php-link-in-alertbar
// @downloadURL https://update.greasyfork.org/scripts/554365/GGn%20Betterphp%20Link%20in%20alertbar.user.js
// @updateURL https://update.greasyfork.org/scripts/554365/GGn%20Betterphp%20Link%20in%20alertbar.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const betterLinkHTML = '<a href="better.php">Better</a> |'
  const alertbarMenu = document.getElementsByClassName('alertbar blend')[0];

  alertbarMenu.insertAdjacentHTML("afterbegin", betterLinkHTML);
})();
