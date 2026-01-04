// ==UserScript==
// @name         Email Address Extractor (Alert on Success)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Scans the entire current webpage for unique email addresses (username@domain.tld) and displays them in a simple alert box if any are found. The script remains completely silent if no emails are detected.
// @author       Gemini
// @match        *://*/*
// @grant        window.alert
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554669/Email%20Address%20Extractor%20%28Alert%20on%20Success%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554669/Email%20Address%20Extractor%20%28Alert%20on%20Success%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A simple, un-minified Regular Expression pattern to match most common email formats.
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

    // Get the visible text content from the body of the page.
    const pageText = document.body.innerText;

    // Execute the search for email matches.
    const emails = pageText.match(emailRegex);

    // Check if matches were found AND the array is not empty.
    if (emails && emails.length > 0) {
        
        // 1. Remove duplicates by converting the array to a Set and back to an array.
        const uniqueEmails = [...new Set(emails)];

        // 2. Format the output string for the alert box.
        const result = `--- Email Extraction Complete ---\n\n` +
                       `Found ${uniqueEmails.length} unique email(s) on this page:\n\n` +
                       uniqueEmails.join('\n');

        // 3. Display the results.
        window.alert(result);
    }
    // Per the user request, the script is silent if no emails are found.

})();