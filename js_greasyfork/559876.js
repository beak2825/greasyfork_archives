// ==UserScript==
// @name         Block annoying notification badge :P
// @namespace    http://sissel.horse
// @version      2025-12-23
// @description  Blocks the notification badge in a very very very crude way.
// @author       Sissel
// @match        https://a-lilian-garden.discourse.group/*
// @include      https://a-lilian-garden.discourse.group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discourse.group
// @license      MIT
// @grant GM_log
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/559876/Block%20annoying%20notification%20badge%20%3AP.user.js
// @updateURL https://update.greasyfork.org/scripts/559876/Block%20annoying%20notification%20badge%20%3AP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const chatTitle = "#Blanket Fort - Chat - a_lilian's garden";
    const chatUrl = 'https://a-lilian-garden.discourse.group/chat/c/blanket-fort/4';
    const updateTitle = (href) => {
        if (href === chatUrl) {
            Object.defineProperty(document, 'title', {
               configurable: true,
               set(value) {
                   if (value.substring(0,1) !== '(') {
                       document.getElementsByTagName("title")[0].innerHTML = value;
                   }
               }
           });
        } else {
            Object.defineProperty(document, 'title', {
               configurable: true,
               set(value) {
                   document.getElementsByTagName("title")[0].innerHTML = value;
               }
           });
        }
    };

    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => {
            updateTitle(info.url);
        });
    }
})();