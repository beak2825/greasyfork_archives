// ==UserScript==
// @version 1.02
// @author          Maike André
// @icon            https://s.ytimg.com/yts/img/favicon-vflz7uhzw.ico
// @name Remove NEXT video button from youtube auto play bar in HTML5 PLAYER
// @description     Removes the NEXT button from AUTO PLAY BAR of a HTML5 YouTube pLAYER.
// @match https://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @run-at document-start
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/11421
// @downloadURL https://update.greasyfork.org/scripts/9895/Remove%20NEXT%20video%20button%20from%20youtube%20auto%20play%20bar%20in%20HTML5%20PLAYER.user.js
// @updateURL https://update.greasyfork.org/scripts/9895/Remove%20NEXT%20video%20button%20from%20youtube%20auto%20play%20bar%20in%20HTML5%20PLAYER.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function removeAPUN() {
        var autoplaybar = document.getElementsByClassName('ytp-play-button ytp-button')[0];
        if (autoplaybar) {
            //autoplaybar.removeAttribute('class');
            //document.getElementsByClassName('ytp-next-button ytp-button')[0].remove();
            document.getElementsByClassName('ytp-next-button')[0].remove();
        }
    }
    window.addEventListener('readystatechange', removeAPUN, true);
    window.addEventListener('spfdone', removeAPUN);
}());