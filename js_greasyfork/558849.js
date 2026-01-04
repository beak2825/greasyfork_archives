// ==UserScript==
// @name         Force Enable Audio Download Controls
// @namespace    AudioDownloadEnabler
// @version      1.0
// @description  Forces the native audio player to show the download button (removes controlsList="nodownload").
// @author       Runterya
// @match        *://*/*
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558849/Force%20Enable%20Audio%20Download%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/558849/Force%20Enable%20Audio%20Download%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

console.log("AudioDownloadEnabler")

    // Function to enable controls and remove restrictions
    function enableAudioDownload(audio) {
        // 1. Force the native controls to be visible
        audio.controls = true;

        // 2. Remove the attribute that hides the download button
        if (audio.hasAttribute('controlsList')) {
            audio.removeAttribute('controlsList');
        }
        
        // 3. Ensure the element isn't hidden by CSS
        audio.style.display = 'inline-block';
        audio.style.visibility = 'visible';
        
        console.log('Audio download enabled for:', audio);
    }

    // 1. Handle audio elements already on the page
    document.querySelectorAll('audio').forEach(enableAudioDownload);

    // 2. Watch for new audio elements added dynamically (Observer)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Check if the added node is an AUDIO tag
                if (node.tagName === 'AUDIO') {
                    enableAudioDownload(node);
                }
                // Check if the added node contains AUDIO tags inside it
                else if (node.querySelectorAll) {
                    node.querySelectorAll('audio').forEach(enableAudioDownload);
                }
            });
        });
    });

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

})();
