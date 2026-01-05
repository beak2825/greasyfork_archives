// ==UserScript==
// @name        mmmturkeybacon Select Amazon Payments/Disable Gift Card Withdrawal
// @author      mmmturkeybacon
// @description Selects the Amazon Payments option, unchecks and disables the Amazon Gift Card withdrawal option.
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/transferearnings*
// @match       https://payments.amazon.com/withdraw*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.05
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8150/mmmturkeybacon%20Select%20Amazon%20PaymentsDisable%20Gift%20Card%20Withdrawal.user.js
// @updateURL https://update.greasyfork.org/scripts/8150/mmmturkeybacon%20Select%20Amazon%20PaymentsDisable%20Gift%20Card%20Withdrawal.meta.js
// ==/UserScript==

$(document).ready(function ()
{
    $('input[name="selectedExecutorTypeName"][value="AmazonPayments"][type="radio"]').attr('checked', 'true');
    $('input[name="selectedExecutorTypeName"][value="GCSharp"][type="radio"]').attr('disabled', 'true');
    $('input[name="selectedExecutorTypeName"][value="GCSharp"][type="radio"]').attr('checked', null);

    // https://payments.amazon.com/withdraw
    // This form doesn't exist anymore.
    $('input[id="purchaseGC"][value="purchaseGC"][name="withdrawTo"][type="radio"]').attr('disabled', 'true');
});