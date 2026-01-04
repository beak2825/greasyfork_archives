// ==UserScript==
// @name         HaijiaoHideAd
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  去广告与弹窗!
// @author       You
// @match        https://best.rpxrkoc.cc/*
// @match        https://best.gvlilxkg.xyz/*
// @match        https://best.rpxrkoc.cc/*
// @match        https://best.gucqttlg.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpxrkoc.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555316/HaijiaoHideAd.user.js
// @updateURL https://update.greasyfork.org/scripts/555316/HaijiaoHideAd.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setTimeout(() => {
        const dialogTarget = document.querySelector('.xqbj-component-advertises');
        const adTargetArr = document.querySelectorAll('.xqbj-list .xqbj-list-rows .xqbj-list-rows-placard');
        Array.from(adTargetArr).forEach((item) => {
            item.style.display='none';
        });
        dialogTarget.style.display = 'none';
        document.body.classList.remove('fixbody')
    }, 100)
})();