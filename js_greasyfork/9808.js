// ==UserScript==
// @name        Special Occasions Headers
// @namespace   PXgamer
// @include     *kickass.to/*
// @include     *kat.cr/*
// @include     *localhost:999/kat/*
// @version     2.2
// @description Adds banners for special occasions
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9808/Special%20Occasions%20Headers.user.js
// @updateURL https://update.greasyfork.org/scripts/9808/Special%20Occasions%20Headers.meta.js
// ==/UserScript==

var today = new Date();
today = today.toDateString();
var day = today.split(" ")[2];
var month = today.split(" ")[1];
today = month + day;
console.log(today);

//URL set for holidays
var easter = "https://yuq.me/users/38/488/yph6m45BXY.png";
var halloween = "https://yuq.me/users/38/488/Fsnz6TArol.png";
var christmas = "https://yuq.me/users/38/488/k7gr6tzpSn.png";
var torrentDay = "https://yuq.me/users/38/488/CcbeQq7L5I.png";
var valentines = "https://yuq.me/users/38/488/5G9mSOCyc2.png";
var userBirthday = "https://yuq.me/users/38/488/KxFZ4u9mBU.png";

//Dates set for holidays
var easterDate = "Mar27";
var halloweenDate = "Oct31";
var christmasDate = "Dec25";
var torrentDayDate = "Mar30";
var valentinesDate = "Feb14";
//var userBirthdayDate = "";

var logo = document.getElementById("logo");
var header = document.getElementById("menu");
var dropdown = document.getElementsByClassName("dropdown");
var dropdowns = dropdown.length;

if (today == easterDate) {
  logo.style.backgroundImage = 'url(' + easter + ')';
  logo.style.backgroundSize = '220px 40px';
  header.style.backgroundColor = 'white';
  for (var i = 0; i < dropdowns; i++) {
    dropdown[i].style.backgroundColor = 'white';
    $('#navigation li a').css("background-color","white");
    $('#navigation li a').css("color","#197103");
    $('#navigation li a').css("text-shadow","0px 1px 2px #1A3A13");
  }
  var searchBack = document.getElementById('contentSearch');
  searchBack.style.backgroundImage = 'url(https://yuq.me/users/38/488/AnwCcRJeO4.png)';
  searchBack.style.backgroundSize = '40px';
  searchBack.style.backgroundRepeat = 'no-repeat';
  searchBack.style.backgroundPosition = 'right top';
}

else if (today == halloweenDate) {
  logo.style.backgroundImage = 'url(' + halloween + ')';
  logo.style.backgroundSize = '220px 40px';
  header.style.backgroundColor = 'black';
  for (var i = 0; i < dropdowns; i++) {
    dropdown[i].style.backgroundColor = 'black';
    $('#navigation li a').css("background-color","black");
  }
  var searchBack = document.getElementById('contentSearch');
  searchBack.style.backgroundImage = 'url(https://yuq.me/users/38/488/siLCKlPupb.png)';
  searchBack.style.backgroundSize = '30px';
  searchBack.style.backgroundRepeat = 'no-repeat';
  searchBack.style.backgroundPosition = '78%';
}

else if (today == christmasDate) {
  logo.style.backgroundImage = 'url(' + christmas + ')';
  logo.style.backgroundSize = '220px 40px';
  header.style.backgroundColor = 'white';
  for (var i = 0; i < dropdowns; i++) {
    dropdown[i].style.backgroundColor = 'white';
    $('#navigation li a').css("background-color","white");
    $('#navigation li a').css("color","#197103");
    $('#navigation li a').css("text-shadow","0px 1px 2px #1A3A13");
  }
  var searchBack = document.getElementById('contentSearch');
  searchBack.style.backgroundImage = 'url(https://yuq.me/users/38/488/rVktGNQ9XZ.png)';
  searchBack.style.backgroundSize = '40px';
  searchBack.style.backgroundRepeat = 'no-repeat';
  searchBack.style.backgroundPosition = '78%';
}

else if (today == torrentDayDate) {
  logo.style.backgroundImage = 'url(' + torrentDay + ')';
  logo.style.backgroundSize = '220px 40px';
  header.style.backgroundColor = 'white';
  for (var i = 0; i < dropdowns; i++) {
    dropdown[i].style.backgroundColor = 'white';
    $('#navigation li a').css("background-color","white");
    $('#navigation li a').css("color","black");
    $('#navigation li a').css("text-shadow","0px 1px 2px black");
  }
  var searchBack = document.getElementById('contentSearch');
  searchBack.style.backgroundImage = 'url(https://yuq.me/users/38/488/uZKAiGa2cW.png)';
  searchBack.style.backgroundSize = '40px';
  searchBack.style.backgroundRepeat = 'no-repeat';
  searchBack.style.backgroundPosition = '78%';
}

else if (today == valentinesDate) {
  logo.style.backgroundImage = 'url(' + valentines + ')';
  logo.style.backgroundSize = '220px 40px';
  header.style.backgroundColor = 'white';
  for (var i = 0; i < dropdowns; i++) {
    dropdown[i].style.backgroundColor = 'white';
    $('#navigation li a').css("background-color","white");
    $('#navigation li a').css("color","#980101");
    $('#navigation li a').css("text-shadow","0px 1px 2px #FB3B3B");
  }
  var searchBack = document.getElementById('contentSearch');
  searchBack.style.backgroundImage = 'url(https://yuq.me/users/38/488/y1GZ7glo3h.png)';
  searchBack.style.backgroundSize = '30px';
  searchBack.style.backgroundRepeat = 'no-repeat';
  searchBack.style.backgroundPosition = '78%';
}

else if (today == userBirthdayDate) {
  logo.style.backgroundImage = 'url(' + userBirthday + ')';
  logo.style.backgroundSize = '220px 40px';
}