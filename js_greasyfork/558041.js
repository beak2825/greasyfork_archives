// ==UserScript==
// @name         KittyCatS Enter Interceptor for Naming
// @namespace    es.jessjon.kittycats.nameenter
// @version      1.1.20251205
// @description  Intercepts [Enter] keypress on the KittyCatS name field to submit
// @author       Jessica Jones
// @match        https://kittycats.ws/online/*
// @match        https://kittycats.ws/pedigree/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kittycats.ws
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558041/KittyCatS%20Enter%20Interceptor%20for%20Naming.user.js
// @updateURL https://update.greasyfork.org/scripts/558041/KittyCatS%20Enter%20Interceptor%20for%20Naming.meta.js
// ==/UserScript==

/* global $ */
var version = GM_info.script.version;

$(document).ready(function() {
    $('body').on('keydown', '#text_name', function (e) {
        const enter = /enter/i; // regex used to match NumpadEnter and other "Enter" keys
        if (enter.test(e.code)) {
            new_name();
            return false;
        }
    });
});