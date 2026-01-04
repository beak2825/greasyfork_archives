// ==UserScript==
// @name         TMN Crimes
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  TMN Crimes Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/crimes.aspx
// @match        https://www.tmn2010.net/authenticated/crimes.aspx?scriptCheck
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/550308/TMN%20Crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/550308/TMN%20Crimes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const API_KEY = localStorage.getItem("CAPTCHA_KEY") || prompt("Enter Captcha Token");
    localStorage.setItem("CAPTCHA_KEY", API_KEY)

    const scriptCheck = $("#ctl00_main_MyScriptTest_btnSubmit")[0];

    function universalCaptchaSolve() {
        const panel = document.querySelector('#ctl00_main_pnlVerify');
        const recDiv = panel ? panel.querySelector('.g-recaptcha') : null;
        const siteKey = recDiv ? recDiv.getAttribute('data-sitekey') : null;
        if (!siteKey) { return; }
        const pageUrl = location.href;
        if (window._tmn_solving_captcha) return;
        window._tmn_solving_captcha = true;
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://2captcha.com/in.php?key=${API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&json=1`,
            onload: function(response) {
                const json = JSON.parse(response.responseText);
                if (json.status === 1) pollUniversalCaptcha(json.request);
                else { window._tmn_solving_captcha = false; }
            }
        });
        function pollUniversalCaptcha(requestId) {
            const poll = setInterval(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${requestId}&json=1`,
                    onload: function(response) {
                        const json = JSON.parse(response.responseText);
                        if (json.status === 1) {
                            clearInterval(poll);
                            injectUniversalCaptcha(json.request);
                        } else if (json.request !== 'CAPCHA_NOT_READY') {
                            clearInterval(poll);
                            window._tmn_solving_captcha = false;
                        }
                    }
                });
            }, 5000);
        }
        function injectUniversalCaptcha(token) {
            const textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const submit = document.querySelector('#ctl00_main_MyScriptTest_btnSubmit');
            if (!textarea || !submit) {
                window._tmn_solving_captcha = false; return;
            }
            textarea.style.display = 'block';
            textarea.value = token;
            setTimeout(() => { submit.click(); window._tmn_solving_captcha = false; }, 1200);
        }
    }

    if (window.self == window.top) {
        if (scriptCheck && location.href.includes("scriptCheck")) {
            $("#divContent").prepend(`
  <div id="console" style="color:#FF9933; font-weight: bold; text-align: left; align-content: center; grid-area: a; width: 100%; height: 30px; border-bottom: 2px solid #ccc">Solving Captcha...</div>
`);
            universalCaptchaSolve();
            return;
        } else if (document.referrer?.includes("scriptCheck")) {
            setTimeout(() => { location.href = "default.aspx" }, 3000);
            return;
        } else {
            return;
        }
    }

    function humanClick(el) {
        if (!el) return;
        el.click();
    }

    if (scriptCheck) {
        /*const recheck = setInterval(() => {
            fetch(location.href)
                .then(res => res.text())
                .then(body => {
                const doc = $("<div>").html($(body));
                const scriptCheckStillPresent = doc.find("#ctl00_main_MyScriptTest_btnSubmit")[0];
                if (!scriptCheckStillPresent) {
                    clearInterval(recheck);
                    location.href = location.href;
                }
            });
        }, 5000);
        return;*/
        window.top.location.href = "crimes.aspx?scriptCheck";
    }

    // Get the result text
    var text = $("#ctl00_main_lblResult").text();
    if (text.includes("seconds")) {
        var match = text.match(/(\d+)\s*seconds/);
        if (match) {
            var seconds = parseInt(match[1], 10);

            // Calculate target timestamp
            var targetTime = Date.now() + seconds * 1000;

            // Store in localStorage
            localStorage.setItem("TMN_Crime_Time", targetTime);

            // Log human-readable local time
            console.log("Reload scheduled at:", new Date(targetTime).toLocaleTimeString());

            // Check periodically to reload when time is reached
            var interval = setInterval(() => {
                text = $("#ctl00_main_lblResult").text();
                match = text.match(/(\d+)\s*seconds/);
                $("#ctl00_main_lblResult").html(`You are only allowed to attempt a crime every 2 minutes!<br>Still ${match[1] - 1} seconds left.`)
                var storedTime = parseInt(localStorage.getItem("TMN_Crime_Time"), 10);
                if (storedTime && Date.now() >= storedTime) {
                    clearInterval(interval);
                    setTimeout(() => { location.href = location.href }, Math.random() * 5000);
                }
            }, 1000); // check every second
        }
    } else if ($("#ctl00_main_btnCrime1")[0]) {
        //localStorage.setItem("TMN_Crime_Time", new Date().getTime() + 24 * 60 * 60 * 1000 * 100)
        humanClick($("#ctl00_main_btnCrime1")[0]);
    } else {
        setTimeout(() => { location.href = location.href }, Math.random() * 5000);
    }
})();