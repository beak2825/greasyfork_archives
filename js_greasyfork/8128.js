// ==UserScript==
// @name         Youtube H.264
// @namespace    http://www.youtube.com
// @version      1.1.2
// @description  use H.264 on youtube. based on https://github.com/erkserkserks/h264ify.
// @match        http://youtube.com/*
// @match        https://youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/8128/Youtube%20H264.user.js
// @updateURL https://update.greasyfork.org/scripts/8128/Youtube%20H264.meta.js
// ==/UserScript==


// code from https://github.com/erkserkserks/h264ify/blob/master/src/inject/inject.js

var h264ify = function () {
    // Override video element canPlayType() function
    var videoElem = document.createElement('video');
    var origCanPlayType = videoElem.canPlayType.bind(videoElem);
    videoElem.__proto__.canPlayType = function (type) {
        if (type === undefined) return '';
        // If queried about webM/vp8/vp8 support, say we don't support them
        if (type.indexOf('webm') != -1
            || type.indexOf('vp8') != -1
            || type.indexOf('vp9') != -1) {
            return '';
        }
        // Otherwise, ask the browser
        return origCanPlayType(type);
    }
    
    // Override media source extension isTypeSupported() function
    var mse = window.MediaSource;
    var origIsTypeSupported = mse.isTypeSupported.bind(mse);
    mse.isTypeSupported = function (type) {
        if (type === undefined) return '';
        // If queried about webM/vp8/vp8 support, say we don't support them
        if (type.indexOf('webm') != -1
            || type.indexOf('vp8') != -1
            || type.indexOf('vp9') != -1) {
            return '';
        }
        // Otherwise, ask the browser
        return origIsTypeSupported(type);
    }
};

h264ify();
