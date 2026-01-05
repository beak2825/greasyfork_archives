// ==UserScript==
// @name       jawz Shitty Bryce
// @version    1.0
// @description  something useful
// @match      https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8929/jawz%20Shitty%20Bryce.user.js
// @updateURL https://update.greasyfork.org/scripts/8929/jawz%20Shitty%20Bryce.meta.js
// ==/UserScript==

var allText = $('body').text();
if (allText.indexOf("Given the name and URL of a business, find contact information for its") >= 0) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    var url = document.getElementsByClassName('overview text')[0].innerText
    console.log(url);
    url = url.replace("Business name:", "");
    url = "http://www.google.com/search?q=" + url + " Founder";
    url = url.replace(/[" "]/g, "+");
    url = url.replace("&", "%26");
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(url,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
    
}