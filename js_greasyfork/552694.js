// ==UserScript==
// @name         GeoCheck AutoCaptcha
// @version      1.03
// @author       Konano
// @namespace    https://github.com/Konano/
// @description  Auto-complete GeoCheck CAPTCHA
// @homepageURL  https://greasyfork.org/zh-CN/scripts/552694-geocheck-autocaptcha
// @supportURL   https://greasyfork.org/zh-CN/scripts/552694-geocheck-autocaptcha/feedback
// @match        http*://geocheck.org/*
// @match        http*://geotjek.dk/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552694/GeoCheck%20AutoCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/552694/GeoCheck%20AutoCaptcha.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const matches = [...document.body.innerHTML.matchAll(/validate\w+Form\(this,\s+'([0-9a-f]{32})'\)/g)];
    if (!matches.length) return console.log('No captcha hashes found');

    matches.forEach((m, i) => {
        for (let n = 0; n <= 99999; n++) {
            if (hex_md5(pad(n)) === m[1]) {
                document.getElementsByName('usercaptcha')[i].value = pad(n);
                break;
            }
        }
    });

    function pad(num) {
        return num.toString().padStart(5, '0');
    }
})();