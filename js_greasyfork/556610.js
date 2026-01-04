// ==UserScript==
// @name         YouTube Pro: Premium Logo + Downloader + AdBlock
// @version      2025.1.15
// @description  Combines YouTube Premium Logo, Multi Downloader, and AdBlock features.
// @author       Evreu1pro
// @match        https://*.youtube.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @icon         https://www.youtube.com/s/desktop/2731d6a3/img/favicon_48x48.png
// @namespace electroknight22_youhou_premium_logo_telegram_v13
// @downloadURL https://update.greasyfork.org/scripts/556610/YouTube%20Pro%3A%20Premium%20Logo%20%2B%20Downloader%20%2B%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/556610/YouTube%20Pro%3A%20Premium%20Logo%20%2B%20Downloader%20%2B%20AdBlock.meta.js
// ==/UserScript==

// --- MODULE 1: YouTube Premium Logo ---
(function () {
    'use strict';

    // fix "TrustedError" on chrome[-ium], code snippet from zerodytrash/Simple-YouTube-Age-Restriction-Bypass@d2cbcc0
    if (window.trustedTypes && trustedTypes.createPolicy) {
        if (!trustedTypes.defaultPolicy) {
            const passThroughFn = (x) => x;
            trustedTypes.createPolicy('default', {
                createHTML: passThroughFn,
                createScriptURL: passThroughFn,
                createScript: passThroughFn,
            });
        }
    }

    // Add load event listener to only spawn MutationObserver when the web actually loaded
    window.addEventListener('load', () => {
        // Function to be called when the target element is found
        function modifyYtIcon(ytdLogos) {
            ytdLogos.forEach(ytdLogo => {
                const ytdLogoSvg = ytdLogo.querySelector("svg");
                // Safety check
                if (!ytdLogoSvg) return;

                ytdLogoSvg.setAttribute('width', '101');
                ytdLogoSvg.setAttribute('viewBox', '0 0 101 20');
                ytdLogoSvg.closest('ytd-logo').setAttribute('is-red-logo', '');
                ytdLogoSvg.innerHTML = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';
            });

            // Disconnect the observer once the element is found
            observer.disconnect();
        }

        // Function to check if the target element exists and call the modification function
        function checkYtIconExistence() {
            let ytdLogos = document.querySelectorAll("ytd-logo > yt-icon > span > div");
            const pfp = document.querySelector("#avatar-btn");
            const signInBtn = document.querySelector("a[href^='https://accounts.google.com']");

            if (pfp && ytdLogos.length == 4) {
                // run in the next event cycle to make sure the logo is fully loaded
                setTimeout(() => {
                    // grab it again just in case youtube swapped them
                    ytdLogos = document.querySelectorAll("ytd-logo > yt-icon > span > div");
                    modifyYtIcon(ytdLogos);
                }, 50)
            } else if (signInBtn) {
                // dont apply the premium logo to non-logged in user
                // and disconnect the observer
                observer.disconnect();
            };
        }

        // Observe changes in the DOM
        const observer = new MutationObserver(checkYtIconExistence);

        // Start observing the document
        observer.observe(document.body, { childList: true, subtree: true });

        // Call the function once at the beginning in case the element is already present
        checkYtIconExistence();
    });
})();

// --- MODULE 2: Multi Downloader ---
(function () {
    var punisherYT = "//gotofreight.ca/convert/?id=";
    var tubeID = "dwnldBtn";
    var telegramID = "telegramBtn"; // New button ID
    var currentButton = "#owner";
    var addClick = `
        #${tubeID}, #${telegramID} {
            background-color: #F1F1F1;
            color: #191919;
            border: 1px solid;
            border-color: rgba(255,255,255,0.2);
            margin-left: 8px;
            padding: 0 16px;
            border-radius: 18px;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            height: 36px;
            line-height: normal;
        }
        #${tubeID}:hover, #${telegramID}:hover {
            background-color: #D9D9D9;
            color: #191919;
            border-color: #F1F1F1;
        }
    `;
    // Polyfill for GM_addStyle if not available (e.g. testing in console)
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(addClick);
    } else {
        const style = document.createElement('style');
        style.textContent = addClick;
        (document.head || document.documentElement).appendChild(style);
    }

    function inspectPg(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            var observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function addBtn() {
        inspectPg(currentButton).then((btnContainer) => {
            if (!btnContainer) {
                return;
            }
            if (document.querySelector(`#${tubeID}`)) {
            } else {
                var downloadBtn = document.createElement('a');
                downloadBtn.href = `${punisherYT + decodeURIComponent(extractYT(window.location))}`;
                downloadBtn.target = '_blank';
                downloadBtn.id = tubeID;
                downloadBtn.innerText = 'Download';
                btnContainer.appendChild(downloadBtn);

                // Add Telegram Button
                var telegramBtn = document.createElement('a');
                telegramBtn.href = 'https://t.me/gostibissi';
                telegramBtn.target = '_blank';
                telegramBtn.id = telegramID;
                telegramBtn.innerText = 'More Scripts';
                btnContainer.appendChild(telegramBtn);
            }
        });
    }

    function pageLoad() {
        inspectPg(`#${tubeID}`).then((btn) => {
            if (!btn) {
                return;
            }
            btn.href = punisherYT + decodeURIComponent(extractYT(window.location));
        });
    }

    var extractYT = function (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = String(url).match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    let buttonSet = false;
    function checkButton() {
        if (window.location.pathname === '/watch' && !buttonSet) {
            addBtn();
            buttonSet = true;
            setTimeout(pageLoad, 2000);
        }
    }
    window.addEventListener("yt-navigate-finish", () => {
        buttonSet = false;
        checkButton();
    });
    checkButton();
})();

// --- MODULE 3: AdBlocker (youtube-adb) ---
(function () {
    `use strict`;

    let video;
    // Interface ad selector
    const cssSelectorArr = [
        `#masthead-ad`, // Homepage Masthead Ad
        `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`, // Homepage Video Feed Ad
        `.video-ads.ytp-ad-module`, // Player Bottom Ad
        `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`, // Watch Page Member Promo Ad
        `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`, // Watch Page Top Right Ad
        `#related #player-ads`, // Watch Page Comment Section Right Ad
        `#related ytd-ad-slot-renderer`, // Watch Page Comment Section Right Video Ad
        `ytd-ad-slot-renderer`, // Search Page Ad
        `yt-mealbar-promo-renderer`, // Watch Page Member Recommendation Ad
        `ytd-popup-container:has(a[href="/premium"])`, // Member Interception Ad
        `ad-slot-renderer`, // Mobile Watch Page Third Party Ad
        `ytm-companion-ad-renderer`, // Mobile Skippable Video Ad Link
    ];
    window.dev = false; // Development usage

    /**
    * Format standard time
    * @param {Date} time Standard time
    * @param {String} format Format
    * @return {String}
    */
    function moment(time) {
        // Get YYYY-MM-DD HH:MM:SS
        let y = time.getFullYear()
        let m = (time.getMonth() + 1).toString().padStart(2, `0`)
        let d = time.getDate().toString().padStart(2, `0`)
        let h = time.getHours().toString().padStart(2, `0`)
        let min = time.getMinutes().toString().padStart(2, `0`)
        let s = time.getSeconds().toString().padStart(2, `0`)
        return `${y}-${m}-${d} ${h}:${min}:${s}`
    }

    /**
    * Output message
    * @param {String} msg Message
    * @return {undefined}
    */
    function log(msg) {
        if (!window.dev) {
            return false;
        }
        console.log(window.location.href);
        console.log(`${moment(new Date())}  ${msg}`);
    }

    /**
    * Set run flag
    * @param {String} name
    * @return {undefined}
    */
    function setRunFlag(name) {
        let style = document.createElement(`style`);
        style.id = name;
        (document.head || document.body).appendChild(style); // Append node to HTML
    }

    /**
    * Get run flag
    * @param {String} name
    * @return {undefined|Element}
    */
    function getRunFlag(name) {
        return document.getElementById(name);
    }

    /**
    * Check if run flag is set
    * @param {String} name
    * @return {Boolean}
    */
    function checkRunFlag(name) {
        if (getRunFlag(name)) {
            return true;
        } else {
            setRunFlag(name)
            return false;
        }
    }

    /**
    * Generate CSS style element to remove ads and append to HTML
    * @param {String} styles Style text
    * @return {undefined}
    */
    function generateRemoveADHTMLElement(id) {
        // If already set, exit
        if (checkRunFlag(id)) {
            log(`Ad removal node generated`);
            return false
        }

        // Set remove ad styles
        let style = document.createElement(`style`); // Create style element
        (document.head || document.body).appendChild(style); // Append node to HTML
        style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArr))); // Append style text to element
        log(`Successfully generated ad removal node`);
    }

    /**
    * Generate CSS text to remove ads
    * @param {Array} cssSelectorArr Array of CSS selectors
    * @return {String}
    */
    function generateRemoveADCssText(cssSelectorArr) {
        cssSelectorArr.forEach((selector, index) => {
            cssSelectorArr[index] = `${selector}{display:none!important}`; // Iterate and set styles
        });
        return cssSelectorArr.join(` `); // Join into string
    }

    /**
    * Touch event
    * @return {undefined}
    */
    function nativeTouch() {
        // Create Touch Object
        let touch = new Touch({
            identifier: Date.now(),
            target: this,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        // Create TouchEvent Object
        let touchStartEvent = new TouchEvent(`touchstart`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        // Dispatch touchstart event to target
        this.dispatchEvent(touchStartEvent);

        // Create TouchEvent Object
        let touchEndEvent = new TouchEvent(`touchend`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        // Dispatch touchend event to target
        this.dispatchEvent(touchEndEvent);
    }


    /**
    * Get DOM
    * @return {undefined}
    */
    function getVideoDom() {
        video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);
    }


    /**
    * Auto play
    * @return {undefined}
    */
    function playAfterAd() {
        if (!video) return;
        if (video.paused && video.currentTime < 1) {
            video.play();
            log(`Auto playing video`);
        }
    }


    /**
    * Remove YT ad interception popup and close overlay backdrop
    * @return {undefined}
    */
    function closeOverlay() {
        // Remove YT ad interception popup
        const premiumContainers = [...document.querySelectorAll(`ytd-popup-container`)];
        const matchingContainers = premiumContainers.filter(container => container.querySelector(`a[href="/premium"]`));

        if (matchingContainers.length > 0) {
            matchingContainers.forEach(container => container.remove());
            log(`Removed YT interceptor`);
        }

        // Get all elements with specified tag
        const backdrops = document.querySelectorAll(`tp-yt-iron-overlay-backdrop`);
        // Find element with specific style
        const targetBackdrop = Array.from(backdrops).find(
            (backdrop) => backdrop.style.zIndex === `2201`
        );
        // If found, clear class and remove open attribute
        if (targetBackdrop) {
            targetBackdrop.className = ``; // Clear all classes
            targetBackdrop.removeAttribute(`opened`); // Remove open attribute
            log(`Closed overlay backdrop`);
        }
    }


    /**
    * Skip ad
    * @return {undefined}
    */
    function skipAd(mutationsList, observer) {
        const skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-skip-ad-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
        const shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`) || document.querySelector(`.ytp-ad-button-icon`);

        if ((skipButton || shortAdMsg) && window.location.href.indexOf(`https://m.youtube.com/`) === -1) { // Mobile mute bug
            if (video) video.muted = true;
        }

        if (skipButton) {
            const delayTime = 0.5;
            setTimeout(skipAd, delayTime * 1000); // If click and call didn't skip, change ad time directly
            if (video && video.currentTime > delayTime) {
                video.currentTime = video.duration; // Force
                log(`Special account skipped button ad`);
                return;
            }
            skipButton.click(); // PC
            nativeTouch.call(skipButton); // Phone
            log(`Button skipped ad`);
        } else if (shortAdMsg) {
            if (video) video.currentTime = video.duration; // Force
            log(`Forced ad end`);
        }

    }

    /**
    * Remove playing ads
    * @return {undefined}
    */
    function removePlayerAD(id) {
        // If already running, exit
        if (checkRunFlag(id)) {
            log(`Remove playing ads function already running`);
            return false
        }

        // Monitor and handle ads in video
        const targetNode = document.body; // Directly observe body changes
        const config = { childList: true, subtree: true }; // Observe target node and subtree changes
        const observer = new MutationObserver(() => { getVideoDom(); closeOverlay(); skipAd(); playAfterAd(); }); // Handle video ad related
        observer.observe(targetNode, config); // Start observing ad nodes with config
        log(`Successfully started remove playing ads function`);
    }

    /**
    * Main function
    */
    function main() {
        generateRemoveADHTMLElement(`removeADHTMLElement`); // Remove interface ads
        removePlayerAD(`removePlayerAD`); // Remove playing ads
    }

    if (document.readyState === `loading`) {
        document.addEventListener(`DOMContentLoaded`, main); // Loading not yet complete
        log(`YouTube AdBlock script about to call:`);
    } else {
        main(); // DOMContentLoaded already triggered
        log(`YouTube AdBlock script quick call:`);
    }

    let resumeVideo = () => {
        const videoelem = document.body.querySelector('video.html5-main-video')
        if (videoelem && videoelem.paused) {
            console.log('resume video')
            videoelem.play()
        }
    }

    let removePop = node => {
        const elpopup = node.querySelector('.ytd-popup-container > .ytd-popup-container > .ytd-enforcement-message-view-model')

        if (elpopup) {
            elpopup.parentNode.remove()
            console.log('remove popup', elpopup)
            const bdelems = document
                .getElementsByTagName('tp-yt-iron-overlay-backdrop')
            for (var x = (bdelems || []).length; x--;)
                bdelems[x].remove()
            resumeVideo()
        }

        if (node.tagName.toLowerCase() === 'tp-yt-iron-overlay-backdrop') {
            node.remove()
            resumeVideo()
            console.log('remove backdrop', node)
        }
    }

    let obs = new MutationObserver(mutations => mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            Array.from(mutation.addedNodes)
                .filter(node => node.nodeType === 1)
                .map(node => removePop(node))
        }
    }))

    // have the observer observe foo for changes in children
    obs.observe(document.body, {
        childList: true,
        subtree: true
    })
})();
