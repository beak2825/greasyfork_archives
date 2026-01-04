// ==UserScript==
// @name         DDoS-Guard Captcha Autoclick
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Automatically clicks the DDoS-Guard captcha checkbox when detected it and doesn't solve the captcha for you!
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAG8UlEQVRogc2aa2wcVxXHf7Ozs7veXXvXsQnUqcI4aWwHQhM6CUVIlDZRaaFOSfmCEBU0CDFSeQkJtUDFq6ICgeADUOikQaIKVVVaoqQVEdCmgIC6pAxtkzaPksaTbFqHxI7X8fq1j7l8uNvE3uzszozXiL+0X+7MPef8771n7v+euwpLBMNyVGAbkLNN/cBS+YkshVHDcqLAHcADwAOG5Vy7FH4AlFYbNCwnBXwJuBvoqDYfq7b90TZ10Up/LSVgWE4P8G3gU0Cs5vEbwD3Aw7apl1rlsyUEDMtRgPcC3wOua2B3EvgJ8CPb1Mdb4XvRBAzLSSNH/KvAlT66VIAngW/Ypv7yYv2HJlAd9fXA14CPAPGAJl4F7gMes019JmwcoQgYlrMcOeqfB1aGdQ7MALuBHwIHwyR4IAKG5WSAQeALwEZADerQAzlgJ/CQbeong3T0RaA64jcB24H3EXy5+IELHAV2AY8DJ2xTd5t18iRgWE4H8A7gZuBWYB2gtSTUxnCBk8A+ZLLbwJjX8lpAwLCcAcAA3g1ciww6GyoKAVoEKgJErSP/mEYm+z+AfwGvAYdtUx9584VoTYcvA58N5+sSKgL0bJRPrs8wPF5i95FJpkuCSHAWSWBD9SeAOeSOvuPNF2oJTIYPG4SAiALXvb2Nz23K0tcVo+QKBrpjWHaeUxNl1PA7j1KNd2x+Yy2B18NadwW0xyN87J3tfOLqDjJxqRO1iMKH16RY3alx//N5ns3NIAQo4YjMICXJRdSq0dPInTJw8Ks7Nb71gS5MI0t7LMKx0SJ7jhYoVmTu9XfHuPeGbrZvyJCORXDDSbpx4Mz8htoZOAUUgIwfawJQFdjcm+TOTVn0rMZwvsSeowX2vVpgTVeMD12Vuvh+NhHB3JhhoDvGL/6Z58R4KWhejADnGxEYQa4xXwTiqsIdGzLcfnU74zMu9x/Is+/fBUou3NCb5KNr24lHF0YYjShsWZWkt1Pjx0PnGcrNBllOw8gB9iQwhpyFVc0sCSFH9Jor4jxyaJInjhUouYItvUm29qe5alms4eiu6tTY0pviudOzvqMHjtimvmCJLyBgm/qUYTlHgeubWVIUyM+6fPNPo2iqwo2rU2ztS7EyqzFVdBnKzTBSKHNrf5qYx6cnYCKXgVdqG2tnAOAlP9ZENYBb1qS5bW2a7qTKifESO+0J/npqmiOjRdYtjzPYlw4UZQOcR57sFqAegYPABS4dB+tDQCYe4T1XJnj+9VmePjHNobNzzJRclqejbOlNsrk36Tn6ITCMFH0LUI/AcWQerGtkTVHg/IzLPftHKVYEKzqiDPal2NiTYKA7xluSUdTWlgxesE19oraxHoFR4AWaEBBATIVtA2nev7KN3k6NdExG7AqYKrnMlgVdbWoYCVELFxiq9+AyArapu4bl/A24nUYarLrzDvalyMRVTl8oc2qixHC+xPB4CSdfYkWHxn2bu0lEF83gLFKVNidQxXPAOWC5l0VFgYlZl+/8eYxC0eXCnEtFQExVaI9FyCZU+rq0Vi2jl5A5cBm8CBwHXgQ+6GVRIDelTSsSrO7UWJZU6UyotMcjpDSFuBppZQ48Y5v6dL0HdQnYpj5tWM5TNCCAgERUYf1b42QSKoWiy8mJEoWiS2FOzsiyNpVta9Noi0uCMeAZr4deMwDwNHLt1V1GAjg7VeGup87hCii5gooLrhC4QLkCG1ck2NqfRvOYCSGg4goiitJoUzsAHA5D4Ajwd+C22geKApuuSPC2tHpJVdYEIAToWa2h/l+ZiTLYn+bQf+bITZTrkXCBvV7LpyEB29TnDMv5LbIKseAsrCoKH39XO9frSe/ofMDoSXBNT4J7/zLGyfwk6uUMjgN/aGSj0QwA7AdeRp6RL6IiBI8fnmQoN4vL4mu1B8/MEam/hvbapu406tuQgG3qZwzL+Q01BISAZ3OzuCJ0QW0B1Po5MAI80qxvsxkAeAxZD+qb3xhR8Bq1VmE3Upc1RNMvtW3qryGLTf9LnAZ21mr/evC71ezCx2i0EL/Cp6z3RaBar/wpUAwfk2/YwA6/hd4gm/2jwO9CheQfk8D3bVO/TPd7wTcB29QnkfX8uqKqRfglsDdIh0ByyzZ1G/guMBWkn0/sB34Q9P4sjF78NfAzQhTAGuAV4Cvzi7Z+EZiAbepF5GXeLmjBNiyX5BdtU38xTOdQir16Nr0LeBgpuMJiGLjTNnVPudwMoY8ctqmfQ5a6f44sewfFQWC7beq/DxsDtOaatQ34DPKatcdHlzLyc/x129Q9db5ftPqi+27kXVrC49Uc8gPw4P/NRfd8VC+9bwY+jbwMzCBz5A3k930HcKiV/5dYEjlpWE47ksAtyJr+HmTg5Vb7+i+Yxi3RfXYInQAAAABJRU5ErkJggg==
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549414/DDoS-Guard%20Captcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/549414/DDoS-Guard%20Captcha%20Autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if there is a DDoS-Guard captcha on the site page
    function isDDOSGuardPage() {
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            if (script.src.includes('ddos-guard.net') || script.src.includes('/.well-known/ddos-guard')) {
                return true;
            }
        }
        return !!document.querySelector('#ddg-captcha');
    }

    // Exit if there is no DDoS-Guard captcha on the site page
    if (!isDDOSGuardPage()) return;

    let hasClicked = false;

    // Simulate a click on an element
    function simulateClick(element) {
        if (!element || hasClicked) return false;
        const rect = element.getBoundingClientRect();
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        });
        element.dispatchEvent(event);
        hasClicked = true;
        return true;
    }

    // Find and click the CAPTCHA checkbox in iframe
    function clickCaptcha() {
        if (hasClicked) return true;
        const iframe = document.querySelector('#ddg-iframe');
        if (!iframe) return false;

        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const checkbox = iframeDoc?.querySelector('.ddg-captcha__checkbox');
            if (checkbox) {
                simulateClick(checkbox);
                setTimeout(() => {
                    if (!checkbox.classList.contains('ddg-captcha__checkbox--checked')) {
                        checkbox.click();
                    }
                }, 500);
                return true;
            }
        } catch (error) {
            console.log('Error accessing iframe:', error.message);
        }
        return false;
    }

    // Start polling to check for CAPTCHA
    function startPolling() {
        const interval = setInterval(() => {
            if (clickCaptcha()) {
                setTimeout(() => clearInterval(interval), 3000);
            }
        }, 250);
    }

    // Observe DOM for iframe addition
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length && document.querySelector('#ddg-iframe'))) {
            setTimeout(clickCaptcha, 1000);
            startPolling();
            observer.disconnect();
        }
    });

    // Initialize the script
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (isDDOSGuardPage()) {
                    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
                    setTimeout(clickCaptcha, 1000);
                    startPolling();
                }
            });
        } else if (isDDOSGuardPage()) {
            observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
            setTimeout(clickCaptcha, 1000);
            startPolling();
        }
    }

    init();
})();