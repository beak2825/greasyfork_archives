// ==UserScript==
// @name         Twitch - Expand your followed channels list automatically
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Expand your followed channels list automatically and keep expending it as new channels go online
// @author       Lloyd WESTBURY
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @run-at document-idle
// @grant        none
// @homepageURL  https://https://github.com/LloydWes/twitch-channel-expend
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549638/Twitch%20-%20Expand%20your%20followed%20channels%20list%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/549638/Twitch%20-%20Expand%20your%20followed%20channels%20list%20automatically.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // Wait for the DOM to load
    function waitForElement(querySelector) {
        return new Promise((resolve, reject) => {
            if (document.querySelectorAll(querySelector).length) resolve();
            const observer = new MutationObserver(() => {
                if (document.querySelectorAll(querySelector).length) {
                    observer.disconnect();
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    function expendUntilOfflineChannelFound() {
        let truc = (tr) => {
            let offlineChannelList = document.querySelectorAll(".side-nav-card__avatar--offline");
            let moreButton = document.querySelector(".side-nav-show-more-toggle__button > button");
            if (offlineChannelList.length == 0 && moreButton) {
                moreButton.click();
                setTimeout(tr, 200, tr);
            }
        }
        setTimeout(truc, 200, truc);
    }
    function launchInitialExpendAndListenForChanges() {
        expendUntilOfflineChannelFound();
        launchListenerObserver();
    }

    function launchListenerObserver() {
        const sideBar = document.getElementsByClassName("side-bar-contents")[0];

        const config = { attributes: false, childList: true, subtree: true };
        const callback = (mutationList, obs) => {
            let followedSection = sideBar.getElementsByClassName("side-nav-section")[0];
            let relevantMutation = false;
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    relevantMutation = true;
                    break;
                }
            }
            if (relevantMutation) {
                let fv = followedSection.querySelectorAll('div[class*=offline]');
                if (fv.length === 0) {
                    expendUntilOfflineChannelFound();
                }
            }
        };
        const observer = new MutationObserver(callback);

        observer.observe(sideBar, config);
    }

    // Initialize
    waitForElement(".side-nav-show-more-toggle__button").then(() => {
        setTimeout(launchInitialExpendAndListenForChanges, 500);
    });
}());
