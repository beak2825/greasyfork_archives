// ==UserScript==
// @name         Anishare Video Download
// @namespace    http://tampermonkey.net/
// @version      2026-01-24
// @description  adds a button to download anishare animations
// @author       @gamezboi_
// @match        *://anishare.co/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anishare.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563855/Anishare%20Video%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/563855/Anishare%20Video%20Download.meta.js
// ==/UserScript==

(function() {

    setTimeout(function(){
var div = document.getElementsByTagName("video")[0].parentElement

var aye = document.createElement("a")

aye.href = div.getElementsByTagName("video")[0].src

aye.target = "_blank"

var button = document.createElement("button")

button.className = "absolute bottom-0 left-0 rounded-full bg-black aspect-square text-white m-5 z-10 min-w-9 text-xs transition-opacity"

button.style.opacity = ".66"

button.textContent = "V"



div.appendChild(aye)

aye.appendChild(button)
    }, 500)

})()