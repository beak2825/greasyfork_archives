// ==UserScript==
// @name        Amazon Address Book Cleaner
// @namespace   com.butter.aabc
// @description Deletes all addresses from an Amazon.com address book
// @include     https://www.amazon.*/gp/css/account/address/view.html*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9086/Amazon%20Address%20Book%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/9086/Amazon%20Address%20Book%20Cleaner.meta.js
// ==/UserScript==

var cookieName = 'com_butter_aabc';
var cookieMatchRegex = new RegExp(cookieName + '=([^;]+)');

function deleteModeSet() {
    var m = document.cookie.match(cookieMatchRegex);
    if (m) { return m[1]; }
    return undefined;
}

function getSessionId() {
    var m = document.cookie.match('session-id=([^;]*)');
    if (m) { return m[1]; }
    return undefined;
}

window.deleteAddress = function () {
    var deleteLink;

    if (!deleteModeSet()) return;

    // the first of the additional addresses
    deleteLink = document.getElementById('myab_AddrBookDeleteAddr_1');

    if (!deleteLink && deleteModeSet() === 'all') {
        // default address
        deleteLink = document.getElementById('myab_AddrBookDeleteAddr_');
    }

    if (deleteLink) {
        var confirmDeleteLink = deleteLink.href.replace(/viewID=confirmDelete/, 'addressDelete=true&sessionId=' + getSessionId());
        // delete the address
        document.location = confirmDeleteLink;
    } else {
        // clear the cookie if all addresses have been deleted. This is so that
        // even if the Greasemonkey script is active, it won't delete an more
        // newly created addresses unless the button is clicked
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

window.startDeleteAddress = function(deleteMode) {
    // create a cookie to denote that address deletion is in progress
    document.cookie = cookieName + "=" + deleteMode;
    window.deleteAddress();
}

var url = document.location.href;

if (!url.match(/viewID/)) {
    // the address book page. This does not have any viewID

    // the 'Delete all addresses' button
    var ia = '<a class="amzn-btn btn-sec-med" href="javascript:startDeleteAddress(\'all\')" style="margin-left: 10px">' +
        '<span>Delete all addresses</span></a>';

    // add the button after the 'Enter a new address' buttons
    jQuery('a.amzn-btn[href*=newAddress]').after(ia);

    // the 'Delete all addresses except default' button
    ia = '<a class="amzn-btn btn-sec-med" href="javascript:startDeleteAddress(\'allExceptDefault\')" style="margin-left: 10px">' +
        '<span>Delete all addresses except default</span></a>';

    // add the button after the 'Enter a new address' buttons
    jQuery('a.amzn-btn[href*=newAddress]').after(ia);

    if (deleteModeSet()) {
        window.deleteAddress();
    }
}

