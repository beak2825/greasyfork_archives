// ==UserScript==
// @name         F95Zone Auto Add Notags
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically adds your personal blocked tags (notags) into the F95Zone SAM hash URL so you never have to set them manually.
// @author       Nakimor
// @license      MIT
// @match        https://f95zone.to/sam/latest_alpha/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549981/F95Zone%20Auto%20Add%20Notags.user.js
// @updateURL https://update.greasyfork.org/scripts/549981/F95Zone%20Auto%20Add%20Notags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    // Add here all tag IDs you want to exclude (comma-separated).
    // How to find a tag ID:
    // 1. Go to F95Zone "latest" or "SAM" page.
    // 2. Manually add a tag to the "Excluded tags" filter.
    // 3. Look at the URL — you will see something like: .../notags=522,1707,2265
    // 4. Copy those numbers and paste them here.
    const bannedTags = "522,1707,2265"; // <-- EDIT THIS LINE TO ADD/REMOVE YOUR TAGS

    // Get the current hash (part after "#")
    let hash = window.location.hash;

    // Only modify the URL if it doesn't already contain "notags="
    if (!hash.includes("notags=")) {
        // Split hash into segments (removing the leading "#")
        let segments = hash.slice(1).split("/");
        let newSegments = [];

        // We just rebuild the hash keeping known parts untouched
        segments.forEach(seg => {
            // Pass-through all known segments
            if (
                seg.startsWith("tags=") ||
                seg.startsWith("prefixes=") ||
                seg.startsWith("noprefixes=") ||
                seg.startsWith("cat=") ||
                seg.startsWith("page=") ||
                seg.startsWith("sort=") ||
                seg.startsWith("search=") ||
                seg.startsWith("date=")
            ) {
                newSegments.push(seg);
            } else {
                // Keep any unknown segment as well (safe for future updates)
                newSegments.push(seg);
            }
        });

        // Insert notags after "cat=" or "page=" if found, otherwise just append at the end
        let index = newSegments.findIndex(s => s.startsWith("cat=") || s.startsWith("page="));
        if (index >= 0) index++;
        else index = newSegments.length;

        newSegments.splice(index, 0, "notags=" + bannedTags);

        // Replace the current hash with our new one
        window.location.replace("#/" + newSegments.join("/"));
    }
})();