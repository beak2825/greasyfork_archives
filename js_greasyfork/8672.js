// ==UserScript==
// @name         Auto-select Amazon Payments
// @version      0.2
// @description  Changes auto-selection from gift card to payments balance
// @author       Tjololo
// @match        https://www.mturk.com/mturk/transferearnings*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/8672/Auto-select%20Amazon%20Payments.user.js
// @updateURL https://update.greasyfork.org/scripts/8672/Auto-select%20Amazon%20Payments.meta.js
// ==/UserScript==

$('input[value="AmazonPayments"]').click();