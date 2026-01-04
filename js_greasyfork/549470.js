// ==UserScript==
// @name         鼠标定位
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mouse coordinates 
// @author       Agiler SU
// @match       *://*/*
// @icon         https://www.iconfinder.com/icons/3671817/download/png/512
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549470/%E9%BC%A0%E6%A0%87%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/549470/%E9%BC%A0%E6%A0%87%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const coordDiv = document.createElement('div');
    coordDiv.style.position = 'fixed';
    coordDiv.style.pointerEvents = 'none';
    coordDiv.style.background = 'rgba(0,0,0,0.5)';
    coordDiv.style.color = 'white';
    coordDiv.style.padding = '2px 5px';
    coordDiv.style.borderRadius = '3px';
    coordDiv.style.fontSize = '12px';
    coordDiv.style.zIndex = '9999';
    document.body.appendChild(coordDiv);

    document.addEventListener('mousemove', function(e) {
        coordDiv.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
        coordDiv.style.left = (e.clientX + 10) + 'px';
        coordDiv.style.top = (e.clientY + 10) + 'px';
    });
})();
