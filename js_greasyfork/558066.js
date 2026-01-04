// ==UserScript==
// @name         NerdScript
// @namespace    https://nerd.wwnorton.com/nerd/
// @version      1.0
// @description  Add a button to open an iframe's source in a new tab on nerd.wwnorton.com/nerd/
// @author       Augusto Larson
// @match        https://nerd.wwnorton.com/nerd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558066/NerdScript.user.js
// @updateURL https://update.greasyfork.org/scripts/558066/NerdScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function openIframeSourceInNewTab() {
        var iframe = document.querySelector('#iframe-content');
        var src = iframe.src;
        // console.log(src);
        window.open(src, '_blank');
    }

    var button = document.createElement('button');
    button.innerHTML = 'Open Source in New Tab';
    button.style.position = 'fixed';
    button.style.top = '100';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'white';
    button.style.borderRadius = '5px';
    button.style.color = 'white';

    button.addEventListener('click', openIframeSourceInNewTab);

    document.body.appendChild(button);
})();