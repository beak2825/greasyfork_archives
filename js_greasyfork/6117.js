// ==UserScript==
// @name           TradeMe List View Enforcer
// @namespace      http://www.girlza.com/
// @include        https://www.trademe.co.nz/*
// @description    Forces the list view!
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version 0.22
// @downloadURL https://update.greasyfork.org/scripts/6117/TradeMe%20List%20View%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/6117/TradeMe%20List%20View%20Enforcer.meta.js
// ==/UserScript==
function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
  results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function doMe(){
$( document ).ready(function() {
 document.getElementById('listViewTab').click()
});}

if (document.getElementById('listingLayout') != null) {
    var x = document.getElementById('listingLayout').value
    if (x.toUpperCase() == 'GALLERY') {
        if (document.getElementById('listViewTab') != null) {
            doMe()
        }
    }
} else if (document.getElementById('ListingsTitle_galleryViewTab_icon_a') != null) {
    var v = getParameterByName('v');
    var w = document.location.toString().substring(document.location.toString().length - 9)
    if (v.toUpperCase() != "GALLERY" && w.toUpperCase() != "V-GALLERY" && document.getElementById("ListingsTitle_galleryViewTab_icon_a").classList.contains('btn-checked')) {
        window.location.href = document.getElementById("ListingsTitle_listViewTab_icon_a").href
            //doMe()
    }

} else if (document.getElementById("ListingsTitle_ListingViewBar_listViewTab_icon_a") != null) {
    if (document.getElementById("ListingsTitle_ListingViewBar_listViewTab_icon_a").href == "") {
        //already in list view
    } else {
        window.location.href = document.getElementById("ListingsTitle_ListingViewBar_listViewTab_icon_a").href
    }
} else if (document.getElementById("ListingViewBar_listViewTab_icon_a") != null) {
    if (document.getElementById("ListingViewBar_listViewTab_icon_a").href == "") {
        //already in list view
    } else {
        window.location.href = document.getElementById("ListingViewBar_listViewTab_icon_a").href
    }
}

