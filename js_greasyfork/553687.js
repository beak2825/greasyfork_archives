// ==UserScript==
// @name        MusicBrainz: Remember Search Type
// @namespace   https://musicbrainz.org/user/chaban
// @version     1.0.1
// @tag         ai-created
// @description Remembers the last selected entity type in the header search bar (expires after 48h).
// @author      chaban
// @license     MIT
// @match       *://*.musicbrainz.org/*
// @match       *://*.musicbrainz.eu/*
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/553687/MusicBrainz%3A%20Remember%20Search%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/553687/MusicBrainz%3A%20Remember%20Search%20Type.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Get script name for logging
    const SCRIPT_NAME = GM.info.script.name;

    // Constants for storage and element IDs
    const STORAGE_KEY = 'mb-remember-search-type';
    const HEADER_SELECT_ID = 'headerid-type';
    const PAGE_SELECT_ID = 'id-type'; // The select in the main /search page form
    const EXPIRY_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

    const headerSelect = document.getElementById(HEADER_SELECT_ID);
    const pageSelect = document.getElementById(PAGE_SELECT_ID);
    const urlType = new URLSearchParams(window.location.search).get('type');

    if (!headerSelect) {
        // No header search bar found on this page, nothing to do.
        return;
    }

    let typeToApply = null;
    let storedValue = null;

    if (urlType) {
        // 1. Highest priority: The 'type' parameter in the current URL.
        typeToApply = urlType;
    } else if (pageSelect) {
        // 2. Second priority: The value of the search form on the /search page.
        typeToApply = pageSelect.value;
    } else {
        // 3. Lowest priority: The last saved value from GM storage.
        try {
            storedValue = await GM_getValue(STORAGE_KEY);
            if (storedValue && storedValue.timestamp && storedValue.type) {
                const now = new Date().getTime();
                if ((now - storedValue.timestamp) < EXPIRY_DURATION_MS) {
                    typeToApply = storedValue.type;
                } else {
                    // Value is expired, don't apply it
                    console.log(`[${SCRIPT_NAME}] Stored search type expired.`);
                }
            }
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Error getting stored value:`, e);
        }
    }

    /**
     * Saves the search type along with a current timestamp to GM storage.
     * @param {string} type - The search type (e.g., "recording").
     */
    async function saveSearchType(type) {
        try {
            const dataToStore = {
                type: type,
                timestamp: new Date().getTime()
            };
            await GM_setValue(STORAGE_KEY, dataToStore);
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Error setting stored value:`, e);
        }
    }


    // Apply the determined type to the header select
    if (typeToApply) {
        if (headerSelect.value !== typeToApply) {
            // Set the value directly, as requested
            headerSelect.value = typeToApply;
        }

        // Save this type as the new "last used" type
        // This ensures URL or page-form types get persisted
        await saveSearchType(typeToApply);
    }

    // --- Event Listeners to keep things in sync ---

    // When the header select is changed, save the new value
    headerSelect.addEventListener('change', async () => {
        const newType = headerSelect.value;
        await saveSearchType(newType);
        // Also update the main page form select if it exists
        if (pageSelect) {
            pageSelect.value = newType;
        }
    });

    // When the main page search form select is changed, save and update the header
    if (pageSelect) {
        pageSelect.addEventListener('change', async () => {
            const newType = pageSelect.value;
            headerSelect.value = newType; // Update header to match
            await saveSearchType(newType);
        });
    }

})();

