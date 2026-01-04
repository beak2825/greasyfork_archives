// ==UserScript==
// @name         iCloud dotfile
// @description  allows you to view files & folders starting with "." in iCloud.
// @version      1
// @icon         https://i.imgur.com/ORAaPzD.png

// @author       VillainsRule
// @namespace    https://villainsrule.xyz

// @match        https://www.icloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560240/iCloud%20dotfile.user.js
// @updateURL https://update.greasyfork.org/scripts/560240/iCloud%20dotfile.meta.js
// ==/UserScript==

let oStartsWith = String.prototype.startsWith;
String.prototype.startsWith = function(a, b) {
    if (a === '.') return false;
    return oStartsWith.call(this, a, b);
}