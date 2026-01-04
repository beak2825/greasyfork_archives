// ==UserScript==
// @name         forumfr-hide-cookies-button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fait glisser le bouton persistant des paramètres de cookies afin de ne pas gêner la navigation sur les petits écrans.
// @author       Ed38
// @license      MIT
// @match        https://www.forumfr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumfr.com
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/555922/forumfr-hide-cookies-button.user.js
// @updateURL https://update.greasyfork.org/scripts/555922/forumfr-hide-cookies-button.meta.js
// ==/UserScript==

// Note de l'auteur :
//
// Le script peut sembler bien compliqué pour pas grand'chose
// mais il est conçu ainsi afin d'éviter un léger tressautement
// du bouton sur certains affichages lors du chargement de la page.

(function() {
    GM_addStyle(`

        #sd-cmp > div > div  {
            top: calc(100% - 60px);
            transition-property: top;
            transition-duration: 250ms;
            transition-timing-function: ease;
            transition-delay: 0s;
            display: none;
        }

        .sd-cmp-noglitch{
            display: block !important;
        }

        .sd-cmp-hide {
            transition-property: top;
            transition-duration: 750ms;
            transition-timing-function: ease;
            transition-delay: 5s;
            top: calc(100% - 4px)  !important;
        }

        `);

    const buttonSelector = '#sd-cmp > div > div' ;
    let timeoutHandle ;
    let button ;

    waitForElement(buttonSelector).then((element) => {
        start(element) ;
    });

    function start(b) {
        button = b ;
        button.addEventListener("mouseover",showCookiesButton,false);
        window.addEventListener("scroll", showCookiesButton,false);
        window.addEventListener("endscroll", timeout, false);
        timeout();
        showCookiesButton();
    }

    function timeout(){
        timeoutHandle = setTimeout(hideCookiesButton, 2000);
    }

    function hideCookiesButton() {
        button.classList.add("sd-cmp-hide");
    }

    function showCookiesButton() {
        clearTimeout(timeoutHandle);
        button.classList.remove("sd-cmp-hide");
        button.classList.add("sd-cmp-noglitch");
        timeout();
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, observer) => {
                const element = document.body.querySelector(selector) ;
                if (element) {
                    observer.disconnect() ;
                    resolve(element) ;
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

})();