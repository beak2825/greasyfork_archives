// ==UserScript==
// @name         GommeHD Namechange
// @namespace    *
// @version      0.1
// @description  enter something useful
// @author       Midnight Myth
// @match        http*://*.gommehd.net/*
// @downloadURL https://update.greasyfork.org/scripts/6265/GommeHD%20Namechange.user.js
// @updateURL https://update.greasyfork.org/scripts/6265/GommeHD%20Namechange.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName('custom-title-forum');
for (var i = 0; i < elements.length; ++i) {
    var item = elements[i];  
    item.innerHTML = 'Forenputze';
}

var mods = document.getElementsByClassName('custom-title-moderator');
for (var i = 0; i < mods.length; ++i) {
    var item = mods[i];  
    item.innerHTML = 'Modifikation';
}


var admin = document.getElementsByClassName('custom-title-admin');
for (var i = 0; i < admin.length; ++i) {
    var item = admin[i];  
    item.innerHTML = 'Admin';
}

var ts3 = document.getElementsByClassName('custom-title-supporter');
for (var i = 0; i < ts3.length; ++i) {
    var item = ts3[i];  
    item.innerHTML = 'TeÖsDrai-Supporta';
    item.style.fontSize="10px";
}

var dev = document.getElementsByClassName('custom-title-developer');
for (var i = 0; i < dev.length; ++i) {
    var item = dev[i];  
    item.innerHTML = 'Entwickla';
}