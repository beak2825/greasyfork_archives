// ==UserScript==
// @name         More Speed Buttons on YouTube
// @name:tr      YouTube-da Daha Fazla Hız Düğmesi
// @name:az      YouTube-da Daha Çox Sürət Düyməsi
// @name:ru      Больше кнопок скорости на YouTube
// @description  Adds buttons under a YouTube video with more speeds.
// @description:tr YouTube videosunun altında daha fazla hız için düğmeler ekler.
// @description:az YouTube videosunun altında daha çox sürət üçün düymələr əlavə edir.
// @description:ru Больше кнопок скорости на YouTube.
// @author       Oruc Qafarov (Orr888)
// @version      1.0.0
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @contributionURL https://www.youtube.com/@OrrStudio
// @namespace    https://github.com/orrstudio
// @homepageURL  https://github.com/orrstudio/youtube-more-speed-buttons
// @supportURL   https://github.com/orrstudio/youtube-more-speed-buttons/issues
// @downloadURL https://update.greasyfork.org/scripts/549838/More%20Speed%20Buttons%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/549838/More%20Speed%20Buttons%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // BEGIN waitForKeyElements
    /**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * Usage example:
 *
 *     function callback(domElement) {
 *         domElement.innerHTML = "This text inserted by waitForKeyElements().";
 *     }
 *
 *     waitForKeyElements("div.comments", callback);
 *     // or
 *     waitForKeyElements(selectorFunction, callback);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function} callback - The callback function; takes a single DOM element as parameter.
 *                              If returns true, element will be processed again on subsequent iterations.
 * @param {boolean} [waitOnce=true] - Whether to stop after the first elements are found.
 * @param {number} [interval=300] - The time (ms) to wait between iterations.
 * @param {number} [maxIntervals=-1] - The max number of intervals to run (negative number for unlimited).
 */
    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                var attrAlreadyFound = "data-userscript-alreadyFound";
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    }
                    else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }
    // END waitForKeyElements

    // Actual code starts here
    let funcDone = false;
    const titleElemSelector = 'div#title.style-scope.ytd-watch-metadata';
    const colors = ['#072525', '#287F54', '#C22544']; // https://www.schemecolor.com/wedding-in-india.php
    if (!funcDone) window.addEventListener('yt-navigate-start', addSpeeds);

    if (document.body && !funcDone) {
        waitForKeyElements(titleElemSelector, addSpeeds);
    }

    function addSpeeds() {
        if (funcDone) return;

        let bgColor = colors[0];
        let moreSpeedsDiv = document.createElement('div');
        moreSpeedsDiv.id = 'more-speeds';

        for (let i = 0.25; i < 16; i +=.25) {
            if (i >= 1) { bgColor = colors[1]; }
            if (i > 4) { i+=.75; }
            if (i > 8) { i++; bgColor = colors[2]; }

            let btn = document.createElement('button');
            btn.style.backgroundColor = bgColor;
            btn.style.marginRight = '4px';
            btn.style.border = '1px solid #D3D3D3';
            btn.style.borderRadius = '2px';
            btn.style.color = '#ffffff';
            btn.style.cursor = 'pointer';
            btn.style.fontFamily = 'monospace';
            btn.textContent = '×' + (i.toString().substr(0, 1) == '0' ? i.toString().substr(1): i.toString());
            btn.addEventListener('click', () => { document.getElementsByTagName('video')[0].playbackRate = i } );
            moreSpeedsDiv.appendChild(btn);
        }

        let titleElem = document.querySelector(titleElemSelector);
        titleElem.after(moreSpeedsDiv);

        funcDone = true;
    }
})();
