// ==UserScript==
// @name         Bato Panel Fix MOBILE
// @namespace    http://tampermonkey.net/
// @version      2025-12-11
// @description  fixes broken panels on all bato sites on MOBILE
// @license      MIT
// @match        https://bato.to/*
// @match        https://ato.to/*
// @match        https://dto.to/*
// @match        https://fto.to/*
// @match        https://hto.to/*
// @match        https://jto.to/*
// @match        https://lto.to/*
// @match        https://mto.to/*
// @match        https://nto.to/*
// @match        https://vto.to/*
// @match        https://wto.to/*
// @match        https://xto.to/*
// @match        https://yto.to/*
// @match        https://vba.to/*
// @match        https://wba.to/*
// @match        https://xba.to/*
// @match        https://bato.to/*
// @match        https://yba.to/*
// @match        https://zba.to/*
// @match        https://bato.ac/*
// @match        https://bato.bz/*
// @match        https://bato.cc/*
// @match        https://bato.cx/*
// @match        https://bato.id/*
// @match        https://bato.pw/*
// @match        https://bato.sh/*
// @match        https://bato.vc/*
// @match        https://bato.day/*
// @match        https://bato.red/*
// @match        https://bato.run/*
// @match        https://batoto.in/*
// @match        https://batoto.tv/*
// @match        https://batotoo.com/*
// @match        https://batpub.com/*
// @match        https://batread.com/*
// @match        https://batotwo.com/*
// @match        https://battwo.to/*
// @match        https://xbato.com/*
// @match        https://xbato.net/*
// @match        https://xbato.org/*
// @match        https://zbato.com/*
// @match        https://zbato.net/*
// @match        https://zbato.org/*
// @match        https://comiko.net/*
// @match        https://comiko.org/*
// @match        https://mangatoto.com/*
// @match        https://mangatoto.net/*
// @match        https://mangatoto.org/*
// @match        https://batocomic.com/*
// @match        https://batocomic.net/*
// @match        https://batocomic.org/*
// @match        https://readtoto.com/*
// @match        https://readtoto.net/*
// @match        https://readtoto.org/*
// @match        https://kuku.to/*
// @match        https://okok.to/*
// @match        https://ruru.to/*
// @match        https://xdxd.to/*
// @match        https://bato.si/*
// @match        https://bato.ing/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=bato.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558683/Bato%20Panel%20Fix%20MOBILE.user.js
// @updateURL https://update.greasyfork.org/scripts/558683/Bato%20Panel%20Fix%20MOBILE.meta.js
// ==/UserScript==

(function() {
    'use strict';

javascript:setInterval(() => { document.querySelectorAll('img').forEach(img => { if (img.src.includes('//k') && img.src.includes('.mb')) { img.referrerPolicy = "no-referrer"; img.src = img.src.replace('//k', '//n'); } }); }, 2000);

})();