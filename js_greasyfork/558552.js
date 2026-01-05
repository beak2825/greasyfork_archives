// ==UserScript==
// @name         Temp fix bato
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Fix the current broken page on bato
// @author       James
// @license      MIT
// @match        https://xbato.com/chapter/*
// @match        https://xbato.net/chapter/*
// @match        https://xbato.org/chapter/*
// @match        https://zbato.com/chapter/*
// @match        https://zbato.net/chapter/*
// @match        https://zbato.org/chapter/*
// @match        https://readtoto.com/chapter/*
// @match        https://readtoto.net/chapter/*
// @match        https://readtoto.org/chapter/*
// @match        https://batocomic.com/chapter/*
// @match        https://batocomic.net/chapter/*
// @match        https://batocomic.org/chapter/*
// @match        https://batotoo.com/chapter/*
// @match        https://batotwo.com/chapter/*
// @match        https://battwo.com/chapter/*
// @match        https://comiko.net/chapter/*
// @match        https://comiko.org/chapter/*
// @match        https://mangatoto.com/chapter/*
// @match        https://mangatoto.net/chapter/*
// @match        https://mangatoto.org/chapter/*
// @match        https://dto.to/chapter/*
// @match        https://fto.to/chapter/*
// @match        https://jto.to/chapter/*
// @match        https://hto.to/chapter/*
// @match        https://mto.to/chapter/*
// @match        https://wto.to/chapter/*
// @match        https://bato.to/chapter/*
// @match        https://xbato.com/title/*
// @match        https://xbato.net/title/*
// @match        https://xbato.org/title/*
// @match        https://zbato.com/title/*
// @match        https://zbato.net/title/*
// @match        https://zbato.org/title/*
// @match        https://readtoto.com/title/*
// @match        https://readtoto.net/title/*
// @match        https://readtoto.org/title/*
// @match        https://batocomic.com/title/*
// @match        https://batocomic.net/title/*
// @match        https://batocomic.org/title/*
// @match        https://batotoo.com/title/*
// @match        https://batotwo.com/title/*
// @match        https://battwo.com/title/*
// @match        https://comiko.net/title/*
// @match        https://comiko.org/title/*
// @match        https://mangatoto.com/title/*
// @match        https://mangatoto.net/title/*
// @match        https://mangatoto.org/title/*
// @match        https://dto.to/title/*
// @match        https://fto.to/title/*
// @match        https://jto.to/title/*
// @match        https://hto.to/title/*
// @match        https://mto.to/title/*
// @match        https://wto.to/title/*
// @match        https://bato.to/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bato.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558552/Temp%20fix%20bato.user.js
// @updateURL https://update.greasyfork.org/scripts/558552/Temp%20fix%20bato.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images;

    const regex = new RegExp("^https:\/\/k\\d\\d");//start with k00 (00 any number)
    const regex1 = new RegExp("^https:\/\/k");//To simply change the last letter from k to n

    function fixImage(){
        images = document.getElementsByTagName('img');
        for(var i = 0; i < images.length; i++) {
            if (images[i].naturalWidth === 0) {
                if(images[i].src.match(regex)){
                    images[i].src = images[i].src.replace(regex1, images[i].src.match(regex1)[0].substring(0, images[i].src.match(regex1)[0].length - 1) + "n");//We change k to n for adress
                }
            }
        }
        images = null;
    }

    var timeoutId = setTimeout(_ => {
        fixImage();
    }, 1000);//1 second dealy

    var timeoutId1 = setTimeout(_ => {
        fixImage();
    }, 9000);//9 second dealy

})();
