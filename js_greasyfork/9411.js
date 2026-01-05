// ==UserScript==
// @name       jawz OCMP5
// @version    1.2
// @description  enter something useful
// @match      https://wml1.crowdcomputingsystems.com/mturk-web/*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9411/jawz%20OCMP5.user.js
// @updateURL https://update.greasyfork.org/scripts/9411/jawz%20OCMP5.meta.js
// ==/UserScript==

var x = document.getElementsByClassName("place bg-dark")[0];
var y = document.getElementsByClassName("place bg-dark")[1];

x = x.textContent.trim().replace("Product Name:", "")
y = y.textContent.trim().replace("Product Name:", "")

var google_x = "http://www.walmart.com/search/?query=" + x;
google_x = google_x.replace("Company Name: ","").replace(/[" "]/g, "+");
google_x = google_x.replace("&", "%26");

var google_y = "http://www.walmart.com/search/?query=" + y;
google_y = google_y.replace("Company Name: ","").replace(/[" "]/g, "+");
google_y = google_y.replace("&", "%26");

var halfScreen = screen.width/2; 
var windowHeight = screen.height; 
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

popupY = window.open(google_y,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
popupX = window.open(google_x,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);

window.onbeforeunload = function (e) {
    popupX.close();
    popupY.close();
}

$('body').click(function(){
  popupX.close();
});

//http://www.google.com/search?q=