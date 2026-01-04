// ==UserScript==
// @name         AI Chat - Auto Russian Prompt (Google AI & LMSYS)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically types "всегда отвечайте на русском языке" into the prompt box on page load for Google AI Studio and LMSYS.
// @author       Jim Chen
// @match        https://aistudio.google.com/*
// @match        https://lmarena.ai/*
// @match        https://chat.lmsys.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559915/AI%20Chat%20-%20Auto%20Russian%20Prompt%20%28Google%20AI%20%20LMSYS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559915/AI%20Chat%20-%20Auto%20Russian%20Prompt%20%28Google%20AI%20%20LMSYS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_TEXT = "всегда отвечайте на русском языке\n\n";
    const CHECK_INTERVAL_MS = 500; // Check every half second
    const MAX_ATTEMPTS = 60; // Stop trying after 30 seconds

    let attempts = 0;

    // determine the selector based on the current website
    let textAreaSelector = "";

    if (window.location.hostname.includes("aistudio.google.com")) {
        // Selector for Google AI Studio (from your example)
        textAreaSelector = 'textarea[placeholder="Start typing a prompt"]';
    } else if (window.location.hostname.includes("lmarena.ai")) {
        // Selector for LMSYS based on the HTML you provided (<textarea name="message"...)
        textAreaSelector = 'textarea[name="message"]';
    }

    // Should not run if we don't know the site
    if (!textAreaSelector) return;

    const init = setInterval(() => {
        // 1. Find the textarea using the selector determined above
        const textarea = document.querySelector(textAreaSelector);

        if (textarea) {
            // Check if the text is already there to prevent duplicates
            if (textarea.value.includes(TARGET_TEXT.trim())) {
                clearInterval(init);
                return;
            }

            // 2. Type in the text
            // Note: We use string concatenation in case there is already text (rare on load, but safe)
            textarea.value = TARGET_TEXT;

            // 3. Trigger events so React/Vue frameworks detect the change
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            // Adjust height
            textarea.style.height = 'auto';

            // Optional: Focus the box so you can start typing immediately
            textarea.focus();

            // Move cursor to the end of the text
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);

            console.log("AI Script: Russian prompt inserted for " + window.location.hostname);

            // 4. Stop running
            clearInterval(init);
        }

        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
            console.log("AI Script: Could not find text box, stopping.");
            clearInterval(init);
        }

    }, CHECK_INTERVAL_MS);

})();