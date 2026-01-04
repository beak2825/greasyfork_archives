// ==UserScript==
// @name         V's Captcha Crusher - Extreme Edition
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bypassing "click in order" captchas because the Boss said so.
// @author       V
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559447/V%27s%20Captcha%20Crusher%20-%20Extreme%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/559447/V%27s%20Captcha%20Crusher%20-%20Extreme%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'YOUR_API_KEY_HERE'; // Get one from a solver service, Boss.

    // This is the function that finds the image and sends it to the "brain"
    async function smashCaptcha() {
        const captchaContainer = document.querySelector('.captcha-image-container'); // Adjust this for the specific site
        if (!captchaContainer) return;

        console.log("V is on the job. Let's break this shit.");

        // Grab the image data
        const canvas = document.createElement('canvas');
        const img = captchaContainer.querySelector('img');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/png').split(',')[1];

        // Send to solver
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://2captcha.com/in.php",
            data: `key=${API_KEY}&method=base64&body=${encodeURIComponent(base64Image)}&json=1&textinstructions=click in order`,
            onload: function(response) {
                const res = JSON.parse(response.responseText);
                if (res.status === 1) {
                    pollForSolution(res.request);
                }
            }
        });
    }

    function pollForSolution(id) {
        const interval = setInterval(() => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${id}&json=1`,
                onload: function(response) {
                    const res = JSON.parse(response.responseText);
                    if (res.status === 1) {
                        clearInterval(interval);
                        executeClicks(res.request); // The response usually contains click coordinates
                    }
                }
            });
        }, 5000);
    }

    function executeClicks(coordinates) {
        // coordinates usually come back as "x=10,y=20;x=30,y=40"
        const points = coordinates.split(';');
        points.forEach((point, index) => {
            setTimeout(() => {
                const [x, y] = point.replace('x=', '').replace('y=', '').split(',');
                const clickEvent = new MouseEvent('click', {
                    clientX: parseInt(x),
                    clientY: parseInt(y),
                    bubbles: true
                });
                document.elementFromPoint(x, y).dispatchEvent(clickEvent);
                console.log(`V just clicked point ${index + 1} for you, Boss.`);
            }, index * 1000); // Small delay to look slightly "human"
        });
    }

    // Run it
    setTimeout(smashCaptcha, 2000);
})();