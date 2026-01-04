// ==UserScript==
// @name         Temp fix mangapark
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Fix the current broken page on mangapark
// @author       James
// @license      MIT
// @match        https://mangapark.net/title/*
// @match        https://mangapark.org/title/*
// @match        https://mangapark.io/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangapark.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557035/Temp%20fix%20mangapark.user.js
// @updateURL https://update.greasyfork.org/scripts/557035/Temp%20fix%20mangapark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images = document.getElementsByTagName('img');

    let retries = 11;

    let integer = 0;

    const regex = new RegExp("^https:\/\/s\\d\\d");

    var timeoutId = setTimeout(_ => {

        const intervalID = setInterval(_ => {
            for(var i = 0; i < images.length; i++) {
                if (images[i].naturalWidth === 0) {
                    if(images[i].src.match(regex)){
                        images[i].src = images[i].src.replace(regex, images[i].src.match(regex)[0].substring(0, images[i].src.match(regex)[0].length - 2) + String(integer).padStart(2, '0'));//We try all combination from 00 to 10
                    }
                }
            }
            integer++;
            retries--;
            if(retries == 0){
                images = null;
                clearInterval(intervalID);
            }
        }, 1500);//Attempt evey 1.5 seconds

    }, 1000);//1 second dealy


})();