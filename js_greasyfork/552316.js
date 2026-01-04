// ==UserScript==
// @name        Fix bullshit upload timeout in Matrix Element
// @namespace   Violentmonkey Scripts
// @match       *://app.element.io/*
// @match       *://app.schildi.chat/*
// @match       *://chat.das-labor.org/*
// @match       *://element.envs.net/*
// @match       *://matrix.dropnet.ch/*
// @match       *://element.gnulinux.club/*
// @match       *://element.nope.chat/*
// @match       *://chat.bark.lgbt/*
// @match       *://chat.socialnetwork24.com/*
// @match       *://chat.tchncs.de/*
// @match       *://element.hot-chilli.im/*
// @match       *://chat.pub.solar/*
// @match       *://matrix.glasgow.social/*
// @match       *://matrix.furryrefuge.com/*
// @match       *://element.catgirl.cloud/*
// @match       *://element.private.coffee/*
// @match       *://element.tedomum.fr/*
// @match       *://app.nitro.chat/*
// @match       *://element.arcticfoxes.net/*
// @match       *://chat.archaeo.social/*
// @match       *://element.fachschaften.org/*
// @match       *://*/*
// @grant       none
// @version     1.0.5
// @author      ainofeet
// @description 10/11/2025, 9:48:28 PM
// @license     GPLv2
// @downloadURL https://update.greasyfork.org/scripts/552316/Fix%20bullshit%20upload%20timeout%20in%20Matrix%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/552316/Fix%20bullshit%20upload%20timeout%20in%20Matrix%20Element.meta.js
// ==/UserScript==

(function() {
    let initRetries = 0;
    window.initJob = 0;
    let patchFn = function() {
        if (initRetries > 30) clearInterval(window.initJob);
        if(window.matrixChat == undefined) { initRetries++; return; };
        clearInterval(window.initJob);
        window.origDateNow = Date.now;
        window.newTimeout = 3000000;
        Date.now = window.origDateNow === Date.now ? () => {
            let stack = new Error().stack.toString().split(/\n +at /);
            let applyOffset = stack?.some((i) => 
                i.includes(".upload.onprogress") || 
                i.includes(".sendContentToRoom")
            );
            const actualNow = window.origDateNow();
            const hardcodedShit = 30000;
            const offset = window.newTimeout - hardcodedShit;
            const patchedNow = actualNow + offset;
            if(window.debugPatch && applyOffset) console.trace(
              "Applying patched Date.now");
            return applyOffset ? patchedNow : actualNow;
        } : Date.now;
    }
    window.initJob = setInterval(patchFn, 1000);
})();