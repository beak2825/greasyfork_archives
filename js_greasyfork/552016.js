// ==UserScript==
// @name         OWOP Stealth Mode
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Stops sending updates about your position to the server
// @author       NothingHere7759 & thisisks
// @match        https://ourworldofpixels.com/*
// @match        https://pre.ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api/*
// @exclude      https://pre.ourworldofpixels.com/api/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552016/OWOP%20Stealth%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552016/OWOP%20Stealth%20Mode.meta.js
// ==/UserScript==

'use strict'

!function() {

    function install() {
        // The actual script
        window.stealthMode = false;
        const oldSendUpdate = OWOP.net.protocol.sendUpdates;
        OWOP.net.protocol.sendUpdates = function () {
            if (!stealthMode) { oldSendUpdate.apply(OWOP.net.protocol, []) } else { return; }
        }

        // Command
        const oldSM = OWOP.misc.chatSendModifier;
        OWOP.misc.chatSendModifier = (msg) => {
            oldSM(msg);
            if (msg.toLowerCase().startsWith('/stealth')) {
                let args = msg.toLowerCase().split(' ');
                if (args.length != 2 || !['true', 'false'].includes(args[1])) {
                    OWOP.chat.local('Usage: /stealth true/false');
                    return '';
                } else {
                    stealthMode = args[1] == 'true' ? true : false;
                    if (stealthMode) { OWOP.chat.local(`Last recorded position: ${OWOP.mouse.tileX} ${OWOP.mouse.tileY}`); };
                    return '';
                }
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