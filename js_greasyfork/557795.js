// ==UserScript==
// @name         Enlarge Bing AI Slide Container
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes the AI slide container larger on Bing search pages
// @match        *://www.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557795/Enlarge%20Bing%20AI%20Slide%20Container.user.js
// @updateURL https://update.greasyfork.org/scripts/557795/Enlarge%20Bing%20AI%20Slide%20Container.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NEW_HEIGHT = '850px'; // Define your desired height here
    // This value (in pixels) is an estimate for the height of the controls
    // like "Tweak my content", "Testing Tools", etc. Adjust if needed.
    const CONTROLS_HEIGHT = '60px';

    function enlargeSlideContainer() {
        // --- Your Original Selectors (Good) ---
        // These resize the main slider component
        const container = document.querySelector('.b_slidesContainer');
        const viewport = document.querySelector('.b_viewport.scrollbar');
        const slidebar = document.querySelector('.b_slidebar');

        // --- New Selectors (Needed) ---
        // These resize the actual content *inside* the slide
        const slide = document.querySelector('.slide.wptSld'); // The individual slide card
        const contentBlock = document.querySelector('.b_wpt_bl'); // The white box ("border")
        const contentWrapper = document.querySelector('.b_crtrm'); // Wraps the text + controls
        const responseContainer = document.querySelector('.b_cnt_resp.b_md_code'); // The text area

        // Apply height to slider
        if (container) container.style.height = NEW_HEIGHT;
        if (viewport) viewport.style.height = NEW_HEIGHT;
        if (slidebar) slidebar.style.height = NEW_HEIGHT;

        // Apply height to the inner content elements
        if (slide) slide.style.height = NEW_HEIGHT;
        if (contentBlock) contentBlock.style.height = NEW_HEIGHT;

        // Make the main content wrapper fill the new height
        if (contentWrapper) contentWrapper.style.height = '100%';

        // This is the most important part:
        // Override the text area's default max-height
        if (responseContainer) {
            // Remove the default max-height limit
            responseContainer.style.maxHeight = 'none';
            // Set the height, leaving space for the controls at the bottom
            responseContainer.style.height = `calc(100% - ${CONTROLS_HEIGHT})` ;
        }
    }

    // Run on initial page load
    enlargeSlideContainer();

    // Observe for dynamically added slides (Bing AI sometimes loads content asynchronously)
    const observer = new MutationObserver(enlargeSlideContainer);
    observer.observe(document.body, { childList: true, subtree: true });
})();