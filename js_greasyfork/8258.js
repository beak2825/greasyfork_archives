// ==UserScript==
// @name        save the goddamn signing key
// @namespace   hax
// @include     http://www.fimfiction.net/*
// @version     2
// @grant       GM_getValue
// @grant       GM_setValue
// @description save the signing key on FIMFiction
// @downloadURL https://update.greasyfork.org/scripts/8258/save%20the%20goddamn%20signing%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/8258/save%20the%20goddamn%20signing%20key.meta.js
// ==/UserScript==


function restore() {
  if(!localStorage.signing_key) {
    var testkey = GM_getValue('signing_key');
    if(testkey) {
      localStorage.signing_key = testkey;
      return;
    }
    testkey = localStorage.backup_signing_key;
    if(testkey) {
      localStorage.signing_key = testkey;  
      return;
    }
  }  
}

var saver = null;
var saveInterval = 100;

function save() {
  console.log('save',saveInterval);
  if(localStorage.signing_key && localStorage.signing_key != GM_getValue('signing_key')) {
    console.log("Setting the signing key to",localStorage.signing_key);
    GM_setValue('signing_key',localStorage.signing_key);
    localStorage.backup_signing_key = localStorage.signing_key;
    // no need to continue checking, it only sets the signing key once per page load at most
  } else {
    // taper off because it doesn't set any signing key after it's done futzing around
    saveInterval *= 4;
    saver = setTimeout(save,saveInterval);
  }
}


document.addEventListener('DOMContentLoaded',function(e) { 
  if(!saver) {
    // this could get called for sub-page loads so just start it up once
    saver = setTimeout(save,saveInterval); // amazingly, the site erases the signing key, then sets the signing key, then erases it and tells you to log in again.
    restore(); // if we restore from backup it'll overwrite that later anyway, so we can do this early.
  }
},true);