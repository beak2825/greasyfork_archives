// ==UserScript==
// @name         OWOP API Command
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gives u API info via command
// @author       thisisks
// @match        https://ourworldofpixels.com/*
// @match        https://pre.ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api/*
// @exclude      https://pre.ourworldofpixels.com/api/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554967/OWOP%20API%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/554967/OWOP%20API%20Command.meta.js
// ==/UserScript==

'use strict'

!function() {

    function install() {
        const oldSendUpdate = OWOP.net.protocol.sendUpdates;
        const oldSM = OWOP.misc.chatSendModifier;
        OWOP.misc.chatSendModifier = (msg) => {
            oldSM(msg);
            if (msg.toLowerCase().startsWith('/api')) {
                fetch(`${window.location.origin}/api`, {
                    method: "GET"
                })
                    .then(response => response.text())
                    .then(data => OWOP.chat.local(data));
                    return '';
            } else return msg;
        }
    }
    const waitUntil = (probe, cb, t = 200) => {
        const id = setInterval(() => { try { if (probe()) { clearInterval(id); cb(); } } catch { } }, t);
    };

function init() {
    if (document.getElementById("load-scr")?.style?.transform && OWOP?.player?.tool) {
        install();
    } else {
        setTimeout(init, 1e2);
    }
}

init();
}();