// ==UserScript==
// @name          CIJ go to previous sentence
// @namespace     http://tampermonkey.net/
// @version       0.0.3
// @description   Go to previous sentence by CTRL/Win + ArrowLeft keys
// @author        Sapjax
// @license MIT
// @match         https://cijapanese.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=cijapanese.com
// @grant         none
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/548218/CIJ%20go%20to%20previous%20sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/548218/CIJ%20go%20to%20previous%20sentence.meta.js
// ==/UserScript==


(function() {
    const transcriptSelector = '.transcript'
    const curSentenceBtnSelector = '.btn-ghost-yellow'
    const normalSentenceBtnSelector = '.btn-ghost-primary'
    let transcriptElement = null
    let currentButton = null

    /**
     * Initializes the entire process: checks for the transcript, applies styles,
     * and sets up the observer for the button.
     */
    function initialize() {
        transcriptElement = document.querySelector(transcriptSelector);

        if (!transcriptElement) {
            // If the transcript element is not yet in the DOM, watch for it.
            const mainObserver = new MutationObserver((mutationsList, obs) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        transcriptElement = document.querySelector(transcriptSelector);
                    }
                }
            });

            mainObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log("Waiting for '.transcript' container to appear.");
        }
    }

    // press <- + CTRL or <- + Win/Meta
    function bindArrowKeyEvent() {
        document.addEventListener('keydown', (e) => {
            if(e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
                goToPrevSentence()
            }

            if(e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
                goToNextSentence()
            }
        })
    }

    function goToPrevSentence() {
        const curSentenceBtn = transcriptElement?.querySelector(curSentenceBtnSelector)
        const prevSentenceBtn = curSentenceBtn?.parentElement?.previousElementSibling?.querySelector(normalSentenceBtnSelector)
        prevSentenceBtn?.click()
    }

    function goToNextSentence() {
        const curSentenceBtn = transcriptElement?.querySelector(curSentenceBtnSelector)
        const nextSentenceBtn = curSentenceBtn?.parentElement?.nextElementSibling?.querySelector(normalSentenceBtnSelector)
        nextSentenceBtn?.click()
    }

    // Start the process.
    initialize();
    bindArrowKeyEvent();
})();