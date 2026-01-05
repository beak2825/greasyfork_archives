// ==UserScript==
// @name        9gagScroll-O-Meter
// @namespace   xMAC94x
// @include     http://9gag.com/
// @version     1
// @grant       none
// @description Show how much u scrolled on 9gag
// @downloadURL https://update.greasyfork.org/scripts/7875/9gagScroll-O-Meter.user.js
// @updateURL https://update.greasyfork.org/scripts/7875/9gagScroll-O-Meter.meta.js
// ==/UserScript==
// i am not an JavaScript expert, so this is just some aweful code.
// dont be hard to me. Be happy that the code is working :)
// thanks to post http://9gag.com/gag/aObqqrD 
var scrolledPixel = 0;
var gagmode = 0;
var lastscrop = window.pageYOffset;
var pixelperinch = 96;

function pixels_to_si(apixel) {
  var aamount = apixel / pixelperinch * 2.54;
  var aunit = "cm";
  if (aamount > 120) {
    aamount = aamount / 100;
    aunit = "m";
    if (aamount > 1200) {
      aamount = aamount / 1000;
      aunit = "km";
    }
  }
  return {
        amount: aamount,
        unit: aunit
  };  
}

function pixels_to_iu(apixel) {
  var aamount = apixel / pixelperinch;
  var aunit = "inch";
  if (aamount > 15) {
    aamount = aamount / 12;
    aunit = "feet";
    if (aamount > 4) {
      aamount = aamount / 3;
      aunit = "yard";
      if (aamount > 1500) {
        aamount = aamount / 1760;
        aunit = "miles";
      }
    }
  }
  return {
        amount: aamount,
        unit: aunit
  };  
}

function pixels_to_9gag(apixel) {
  var bannanasize = 14; // official min bannana Size in EU ;)
  var aamount = apixel / pixelperinch * 2.54 / bannanasize;
  var aunit = "Bananas";
  if (aamount > 1200) {
    aamount = aamount / 1000;
    aunit = "k Banana";
    if (aamount > 1200) {
      aamount = aamount / 1000;
      aunit = "kk Banana";
      if (aamount > 1200) {
        aamount = aamount / 1000;
        aunit = "kkk Banana";
      }
    }
  }
  return {
        amount: aamount,
        unit: aunit
  };  
}

function createCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } 
  else {expires = '';}
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, '', - 1);
}

function gagShow() {
  var r = null;
  switch (gagmode) {
    case 0:
        r = pixels_to_si(scrolledPixel);
        break;
    case 1:
        r = pixels_to_iu(scrolledPixel);
        break;
    case 2:
        r = pixels_to_9gag(scrolledPixel);
        break;
  } 
  var astr = (r.amount).toFixed(1) + " " + r.unit;
  document.title = '[' + astr + '] 9GAG';
  iDiv2.innerHTML = astr;
}

function gagDoScroll() {
  var scrolldiff = window.pageYOffset - lastscrop;
  scrolldiff = Math.abs(scrolldiff);
  lastscrop = window.pageYOffset;
  scrolledPixel = scrolledPixel + scrolldiff;
  gagShow();
  gagSave();
}

function gagSave() {
  createCookie('scrolledPixel_amount', scrolledPixel, 370);
}

function gagLoad() {
  scrolledPixel = 0.0;
  scrolledPixel = parseInt(readCookie('scrolledPixel_amount'),10);
  
  if (isNaN(scrolledPixel) || (scrolledPixel > 100000000000)) {
    scrolledPixel = 0.0;
  }
}

function gagModeChange() {
  gagmode = gagmode + 1;
  if (gagmode > 2) {
    gagmode = 0;
  }
  gagShow();
}

function gaghandleVisibilityChange() {
  // ohhh yeah, sync between multiple tabs, cool huuu ?
  if (document['hidden']) {
    gagSave();
  } else {
    gagLoad();
    gagShow();
  }
}

var abox = document.getElementById("top-nav").children[0];
var iDiv = document.createElement('div');
var iDiv2 = document.createElement('h2');
iDiv.className = "headbar-items";
iDiv.style.marginRight = "20px";
iDiv.onclick = gagModeChange;
iDiv.titel = "click to change unit";
iDiv2.innerHTML = "Hello";
iDiv.insertBefore(iDiv2,null);
abox.insertBefore(iDiv,abox.children[0]);

document.addEventListener("visibilitychange", gaghandleVisibilityChange, false);
window.onbeforeunload = gagSave;
window.onscroll = gagDoScroll;
gagLoad();
gagShow();

