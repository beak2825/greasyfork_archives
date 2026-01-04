// ==UserScript==
// @name         Garmin Connect: fix activity comparisons
// @namespace    http://tampermonkey.net/
// @description Fixes Connect bug where activity comparison shows a blank page for activities containing step speed loss chart
// @author       You
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/548190/Garmin%20Connect%3A%20fix%20activity%20comparisons.user.js
// @updateURL https://update.greasyfork.org/scripts/548190/Garmin%20Connect%3A%20fix%20activity%20comparisons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlPrefix = 'https://connect.garmin.com/modern/activities/compare'
    let currentPageMatchesUrl = false;

    waitForUrl()

    function waitForUrl() {
        // if (window.onurlchange == null) {
        // feature is supported
        window.addEventListener('urlchange', onUrlChange);
        // }
        onUrlChange();
    }

    function onUrlChange() {
        const urlMatches = window.location.href.startsWith(urlPrefix);
        if (!currentPageMatchesUrl) {
            if (urlMatches) {
                currentPageMatchesUrl = true;
                init();
            }
        } else {
            if (!urlMatches) {
                currentPageMatchesUrl = false;
                deinit();
            }
        }
    }

    (function () {
        const accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');

        Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
            get: function () {
                const responseText = accessor.get.call(this);

                if (!currentPageMatchesUrl) {
                    return responseText;
                }

                if (this.responseURL.toString().match('https://connect.garmin.com/activity-service/activity/[0-9]*/details')) {
                    console.warn('intercepted activity details request: ' + this.responseURL)

                    const data = JSON.parse(responseText);
                    const newDescriptors = [];

                    for (const d of data['metricDescriptors']) {
                        if (
                            !d['key'].startsWith('directStepSpeedLoss')
                            //  &&
                            // !d['key'].startsWith('directImpactLoadFactor')
                        ) {
                            newDescriptors.push(d)
                        }
                    }
                    data['metricDescriptors'] = newDescriptors;
                    console.warn('modified activity chart descriptors to exclude step speed loss')
                    return JSON.stringify(data);
                }
                return responseText;
            },
            configurable: true
        });
    })();

    function init() {
    }

    function deinit() {
    }
})();
