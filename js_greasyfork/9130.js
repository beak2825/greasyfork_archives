// ==UserScript==
// @name        Amazon Address Book Cleaner (Checkout Page)
// @description Delete all addresses except the first one on the Amazon.com checkout page
// @namespace   com.butter.aabc
// @include     https://www.amazon.*/gp/buy/addressselect/handlers/display.html*
// @version     3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/9130/Amazon%20Address%20Book%20Cleaner%20%28Checkout%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9130/Amazon%20Address%20Book%20Cleaner%20%28Checkout%20Page%29.meta.js
// ==/UserScript==
var tid;

function doStuff() {
  if (typeof $ == 'undefined') {
    return;
  }
  
  function getDeleteButton() {
     return $('div[data-action=checkout-delete-address]:eq(1)');
  }
  
  if (getDeleteButton().length == 0) {
    return;
  }
  
  if (tid) {
    clearInterval(tid);
  }
  
  var deleteStarted = false;
  
  window.clickDeleteAddressButton = function () {
    var deleteButton = getDeleteButton();

    if (deleteButton.length == 0) {
      deleteStarted = false;
    } else {
      deleteStarted = true;
      deleteButton.first().click();
    }
  }
  
  $(document).ajaxComplete(function () {
    if (deleteStarted) {
      clickDeleteAddressButton();
    }
  });
  
  $('#a-navbar + .a-container form').first().prepend('<div><span style="float: right; display: inline-block; padding: 5px; margin: 5px; background-color: #ffffcc;"><input type="button" value="Delete All Addresses Except Default" onclick="javascript:clickDeleteAddressButton()" /></span><p style="clear: both"></p></div>');
}

// setting an interval and running at document-start so that other script's errors do not prevent this script from working
tid = setInterval(doStuff, 1000);
