// ==UserScript==
// @name         Sam-Wiesz-Skrypt
// @namespace    duch
// @version      0.2
// @description  Zamienia IMIĘ
// @author       duch_revolucyji
// @match        http://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9854/Sam-Wiesz-Skrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/9854/Sam-Wiesz-Skrypt.meta.js
// ==/UserScript==

$('p').each(function()
{
var h = this.innerHTML;
if (h.indexOf('oldemort')> 0 || h.indexOf('OLDEMORT') > 0) 
{
h = h.replace(/voldemorta/gi, 'Sam-Wiesz-Kogo');
h = h.replace(/voldemort/gi, 'Sam-Wiesz-Kto');
this.innerHTML = h;
}
});