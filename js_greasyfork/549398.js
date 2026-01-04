// ==UserScript==
// @name         MusicBrainz: Search by ISRC in release editor
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.1.2
// @tag          ai-created
// @description  Hooks into the inline recording search of the release editor to allow searching by ISRC.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/*/edit*
// @match        *://*.musicbrainz.org/release/add*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549398/MusicBrainz%3A%20Search%20by%20ISRC%20in%20release%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/549398/MusicBrainz%3A%20Search%20by%20ISRC%20in%20release%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = GM.info.script.name;

    // --- ⚙️ DEBUG MODE ---
    const DEBUG_MODE = false;

    const log = (...args) => {
        if (DEBUG_MODE) {
            console.log(`[${SCRIPT_NAME}]`, ...args);
        }
    };

    log('Script loaded and running.');

    // Regex to identify an ISRC. It matches the 12-character code, allowing for optional hyphens.
    const ISRC_REGEX = /^([A-Z]{2})-?([A-Z0-9]{3})-?(\d{2})-?(\d{5})$/i;

    /**
     * Converts an artist credit object from the /ws/2 API into a simple string.
     * @param {Array<object>} artistCredit - The artist-credit object from the API response.
     * @returns {string} The formatted artist credit string.
     */
    function reduceArtistCredit(artistCredit) {
        if (!artistCredit || !Array.isArray(artistCredit)) return '';
        return artistCredit.map(ac => (ac.name || '') + (ac.joinphrase || '')).join('');
    }

    /**
     * Creates an array of unique elements from an array of objects.
     * @param {Array<object>} array The array to process.
     * @param {function} keyFn A function that returns the key to determine uniqueness.
     * @returns {Array<object>}
     */
    function uniqBy(array, keyFn) {
        const seen = new Set();
        return array.filter(item => {
            const key = keyFn(item);
            return seen.has(key) ? false : seen.add(key);
        });
    }

    /**
     * Monkey-patches the recording association autocomplete hook to modify the search behavior.
     */
    function patchAutocompleteHook() {
        const releaseEditor = window.MB?.releaseEditor;
        const recordingAssociation = releaseEditor?.recordingAssociation;

        if (!recordingAssociation?.autocompleteHook) {
            log('Recording association hook not found. Cannot patch.');
            return;
        }

        const originalAutocompleteHook = recordingAssociation.autocompleteHook;

        recordingAssociation.autocompleteHook = function(track) {
            const originalHook = originalAutocompleteHook.call(this, track);

            return function(requestArgs) {
                const searchTerm = requestArgs.data.q.trim();
                const isrcMatch = searchTerm.match(ISRC_REGEX);

                if (isrcMatch) {
                    const isrc = isrcMatch.slice(1).join('').toUpperCase();
                    log(`ISRC detected: ${isrc}. Modifying search query.`);

                    const newRequestArgs = {
                        url: '/ws/2/recording',
                        dataType: 'json',
                        data: {
                            query: `isrc:${releaseEditor.utils.escapeLuceneValue(isrc)}`,
                            limit: 10,
                            fmt: 'json'
                        },
                        success: function(data) {
                            const recordings = data.recordings || [];

                            const cleanedData = recordings.map(item => {
                                const artistCredit = item['artist-credit'];
                                const appearsOn = uniqBy(
                                    item.releases?.map(release => ({
                                        name: release.title,
                                        gid: release.id,
                                        releaseGroupGID: release['release-group'].id,
                                    })) ?? [],
                                    x => x.releaseGroupGID
                                );

                                return {
                                    name: item.title,
                                    length: item.length,
                                    gid: item.id,
                                    comment: item.disambiguation,
                                    video: item.video || false,
                                    artist: reduceArtistCredit(artistCredit),
                                    artistCredit: { names: artistCredit },
                                    appearsOn: {
                                        hits: appearsOn.length,
                                        results: appearsOn,
                                        entityType: 'release',
                                    },
                                };
                            });

                            const pager = {
                                current: (data.offset || 0) / (data.limit || 10) + 1,
                                pages: Math.ceil((data.count || 0) / (data.limit || 10)),
                            };
                            cleanedData.push(pager);

                            requestArgs.success(cleanedData);
                        },
                        error: requestArgs.error
                    };

                    return newRequestArgs;
                }

                return originalHook(requestArgs);
            };
        };
        log("Successfully patched the recording association autocomplete hook.");
    }

    /**
     * Waits for the release editor and its utilities to be fully initialized.
     */
    function waitForEditor() {
        if (window.MB?.releaseEditor?.recordingAssociation?.autocompleteHook) {
            log("Release editor is ready. Applying patch.");
            patchAutocompleteHook();
        } else {
            log("Waiting for release editor to initialize...");
            setTimeout(waitForEditor, 250);
        }
    }

    // Start the process once the page is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForEditor);
    } else {
        waitForEditor();
    }

})();

