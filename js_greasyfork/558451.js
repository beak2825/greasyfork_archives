// ==UserScript==
// @name         Batoto Image Host Fix (Temporary)
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @version      0.1.1
// @description  Make sure that images in bato.to chapters load properly
// @author       Delmain
// @license      MIT
// @match        https://ato.to/title/*
// @match        https://dto.to/title/*
// @match        https://fto.to/title/*
// @match        https://hto.to/title/*
// @match        https://jto.to/title/*
// @match        https://lto.to/title/*
// @match        https://mto.to/title/*
// @match        https://nto.to/title/*
// @match        https://vto.to/title/*
// @match        https://wto.to/title/*
// @match        https://xto.to/title/*
// @match        https://yto.to/title/*
// @match        https://vba.to/title/*
// @match        https://wba.to/title/*
// @match        https://xba.to/title/*
// @match        https://yba.to/title/*
// @match        https://zba.to/title/*
// @match        https://bato.ac/title/*
// @match        https://bato.bz/title/*
// @match        https://bato.cc/title/*
// @match        https://bato.cx/title/*
// @match        https://bato.id/title/*
// @match        https://bato.pw/title/*
// @match        https://bato.sh/title/*
// @match        https://bato.vc/title/*
// @match        https://bato.day/title/*
// @match        https://bato.red/title/*
// @match        https://bato.run/title/*
// @match        https://batoto.in/title/*
// @match        https://batoto.tv/title/*
// @match        https://batotoo.com/title/*
// @match        https://batotwo.com/title/*
// @match        https://batpub.com/title/*
// @match        https://batread.com/title/*
// @match        https://battwo.com/title/*
// @match        https://xbato.com/title/*
// @match        https://xbato.net/title/*
// @match        https://xbato.org/title/*
// @match        https://zbato.com/title/*
// @match        https://zbato.net/title/*
// @match        https://zbato.org/title/*
// @match        https://comiko.net/title/*
// @match        https://comiko.org/title/*
// @match        https://mangatoto.com/title/*
// @match        https://mangatoto.net/title/*
// @match        https://mangatoto.org/title/*
// @match        https://batocomic.com/title/*
// @match        https://batocomic.net/title/*
// @match        https://batocomic.org/title/*
// @match        https://readtoto.com/title/*
// @match        https://readtoto.net/title/*
// @match        https://readtoto.org/title/*
// @match        https://kuku.to/title/*
// @match        https://okok.to/title/*
// @match        https://ruru.to/title/*
// @match        https://xdxd.to/title/*
// @match        https://bato.si/title/*
// @match        https://bato.ing/title/*
// @icon         https://www.google.com/s2/favicons?domain=bato.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558451/Batoto%20Image%20Host%20Fix%20%28Temporary%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558451/Batoto%20Image%20Host%20Fix%20%28Temporary%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        setTimeout(function () {
            const imgs = document.querySelectorAll('astro-island img[src^="https://k"]');
            imgs.forEach((img) => {
                img.src = img.src.replace('k', 'n'); // Replace first 'k' with 'n'
            });
        }, 1000);
    });
})();