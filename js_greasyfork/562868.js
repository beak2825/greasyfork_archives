// ==UserScript==
// @name         YouTube Ad-blocker
// @icon         https://www.gstatic.com/youtube/img/branding/favicon/favicon_192x192.png
// @version      5.0.0
// @description  Removes ads from YouTube videos and pages using Enhancer for YouTube's 'Remove Ads' button.
// @author       AlejandroLHC
// @license      MIT
// @match        https://www.youtube.com/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/562868/YouTube%20Ad-blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/562868/YouTube%20Ad-blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const searchInterval = 50;
    let failCounter = 0;
    let blockCounter = 0;
    let masterSwitch = true;
    let allowUpdate = true;

    function removeAds() {
        const currentURL = window.location.href;

        if (!masterSwitch || !currentURL.includes("youtube.com")) {
            return;
        }

        if (/https:\/\/www\.youtube\.com\/watch\?.*/.test(currentURL)) {
            const adShowing = document.querySelector('.ad-showing');
            const ad2Showing = document.querySelector('#video-ads');
            const bannerShowing = document.querySelector('.player-ads');
            const adMiniBanner = document.querySelector('.ytd-ad-slot-renderer');
            const skipButtonShowing = document.querySelector('#ytp-ad-skip-button-modern');
            const adContainerShowing = document.querySelector('.ytp-cultural-moment-player-content')
            const blockMessageShown = document.querySelector('ytd-enforcement-message-view-model');
            const premiumDialogShowing = document.querySelector('.mealbar-promo-renderer');
            const button = document.querySelector('efyt-not-interested');

            removeElement(bannerShowing);
            removeElement(ad2Showing);
            removeElement(adMiniBanner);
            removeElement(adContainerShowing);
            removeElement(premiumDialogShowing.parentNode);
            clickElement(skipButtonShowing);

            if (blockMessageShown) {
                navigateHistory();
                blockCounter = blockMessageShown ? blockCounter + 1 : 0;
            }

            if (blockCounter > 10) {
                handleAdBlockerRetry();
            }

            if (button) {
                button.click();
                failCounter = 0;
            } else {
                handleButtonNotFound();
            }

            if (failCounter > 10) {
                handleFailedToFindButton();
            }
        }

        if (/https:\/\/www\.youtube\.com\/$/.test(currentURL)) {
            const headAdShowing = document.querySelector('#masthead-ad');
            const adCardShowing = document.querySelector('ytd-ad-slot-renderer');
            const ytAdBanner = document.querySelector('ytd-statement-banner-renderer');

            removeElement(headAdShowing);

            if (adCardShowing || ytAdBanner) {
                const adParent = (adCardShowing || ytAdBanner).parentNode.parentNode;
                removeElement(adParent);
            }
        }
    }

    function removeElement(element) {
        element?.remove();
    }

    function clickElement(element) {
        element?.click();
    }

    function navigateHistory() {
        History.back();
        History.forward();
    }

    function handleAdBlockerRetry() {
        const blocker = window.confirm("Make sure there are no other ad-blockers working on this page.\n\nPress 'OK' to retry.\nPress 'Cancel' to disable the YouTube ad-blocker script for this session.");

        if (blocker) {
            blockCounter = 0;
        } else {
            masterSwitch = false;
        }
    }

    function handleButtonNotFound() {
        console.error(`Failed to find button. Retrying in ${searchInterval} ms`);
        failCounter++;
    }

    function handleFailedToFindButton() {
        const buttonNotFound = window.confirm("Failed to find the 'Remove Ads' button. Please make sure that Enhancer for YouTube is installed.\n\nPress 'OK' to redirect to the installation page.\nPress 'Cancel' to disable the YouTube ad-blocker script for this session.");

        if (buttonNotFound) {
            window.open("https://chrome.google.com/webstore/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle");
            failCounter = 0;
        } else {
            masterSwitch = false;
        }
    }

    function checkUpdate() {
        if (!allowUpdate || !window.location.href.includes("youtube.com")) {
            return;
        }

        const scriptUrl = 'https://raw.githubusercontent.com/AlejandroLuisHC/yt-adblocker-script/main/script.user.js';

        fetch(scriptUrl)
            .then(response => response.text())
            .then(data => {
            const match = data.match(/@version\s+(\d+\.\d+)/)[1];
            if (match) {
                const majorVersion = match.split('.')[0];
                handleVersionCheck(majorVersion, scriptUrl);
            } else {
                console.error('YouTube ad-blocker script: Unable to extract version from the GitHub script.');
            }
        })
            .catch(error => {
            console.error('YouTube ad-blocker script: Error checking for updates:', error);
        });
    }

    function handleVersionCheck(version, script) {
        const currentVersion = GM_info.script.version.split('.')[0];

        if (version > currentVersion) {
            handleUpdateAvailable(version, script);
        }
    }

    function handleUpdateAvailable(version, script) {
        if (window.confirm(`A major update is available for the YouTube ad-blocker script. Please update to version ${version}.\n\nPress 'OK' to redirect and upgrade the script.\nPress 'Cancel' to not update for this session.`)) {
            window.open(script);
        } else {
            allowUpdate = false;
        }
    }

    removeAds();
    checkUpdate();
    setInterval(removeAds, searchInterval);
    setInterval(checkUpdate, 30 * 60 * 1000);
})();