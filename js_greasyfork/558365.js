// ==UserScript==
// @name         Temp fix bato
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fix the current broken page on bato.to
// @author       entityJY
// @license      MIT
// @match        https://bato.to/title/*
// @match        https://mto.to/title/*
// @icon        https://bato.to/amsta/img/btoto/logo-batoto.png?v0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558365/Temp%20fix%20bato.user.js
// @updateURL https://update.greasyfork.org/scripts/558365/Temp%20fix%20bato.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var images = document.getElementsByTagName('img');
 
    let retries = 11;
 
    let integer = 0;
 
    const regex = new RegExp("^https:\/\/(s|d|k)\\d\\d");
 
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
        }, 500);//Attempt evey .5 seconds
 
    }, 500);//.5 second dealy
 
 
})();