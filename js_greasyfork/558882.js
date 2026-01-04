// ==UserScript==
// @name         WaniKani JPDB Frequency
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Adds JPDB frequency data to WaniKani
// @author       12092014
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://update.greasyfork.org/scripts/442805/1036436/fflateumd.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/558882/WaniKani%20JPDB%20Frequency.user.js
// @updateURL https://update.greasyfork.org/scripts/558882/WaniKani%20JPDB%20Frequency.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const JPDB_FREQ_URL = 'https://github.com/Kuuuube/yomitan-dictionaries/raw/main/dictionaries/JPDB_v2.2_Frequency_2024-10-13.zip';
    const CACHE_KEY_FREQ_DATA = 'wk_jpdb_freq_data_v2';
    const CACHE_KEY_LAST_FETCH = 'wk_jpdb_last_fetch_v2';

    // WKOF Check
    const wkof_check_interval = setInterval(() => {
        // Check window.wkof (if not sandboxed) or unsafeWindow.wkof (if sandboxed)
        const wkof = window.wkof || (typeof unsafeWindow !== 'undefined' && unsafeWindow.wkof);

        if (wkof) {
            clearInterval(wkof_check_interval);
            // If we found it on unsafeWindow, we might need to reference it from there
            // But usually wkof commands work fine if we just have the reference.
            // However, for `wkof.include` to work, we might need to ensure `wkof` is available in our scope.
            if (!window.wkof && unsafeWindow.wkof) {
                window.wkof = unsafeWindow.wkof;
            }

            window.wkof.include('ItemData, Menu, Settings');
            window.wkof.ready('ItemData, Menu, Settings').then(load_settings).then(startup);
        }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
        const wkof = window.wkof || (typeof unsafeWindow !== 'undefined' && unsafeWindow.wkof);
        if (!wkof && typeof wkof_check_interval !== 'undefined') {
            clearInterval(wkof_check_interval);
            if (confirm('WaniKani JPDB Frequency requires WaniKani Open Framework.\nDo you want to be forwarded to the installation page?')) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            }
        }
    }, 5000);

    function load_settings() {
        // TODO: Implement settings if needed
        return Promise.resolve();
    }

    async function startup() {
        // console.log('WaniKani JPDB Frequency: Starting up...');

        let freq_map = await load_frequency_data();
        if (!freq_map) {
            console.error('WaniKani JPDB Frequency: Failed to load frequency data.');
            return;
        }
        // console.log(`WaniKani JPDB Frequency: Loaded ${freq_map.size} entries.`);

        // Expose for debugging
        // if (typeof unsafeWindow !== 'undefined') {
        //     unsafeWindow.jpdb_freq_map = freq_map;
        //     console.log('WaniKani JPDB Frequency: Debug data exposed as `window.jpdb_freq_map`');
        // }

        inject_frequency(freq_map);
    }

    function inject_frequency(freq_map) {
        // CSS for the frequency indicator
        const style = document.createElement('style');
        style.innerHTML = `
            .jpdb-freq-indicator {
                background-color: #eee;
                color: #333;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.8em;
                margin-left: 8px;
                display: inline-block;
                vertical-align: middle;
                text-shadow: none;
            }
            .jpdb-freq-indicator.high-freq { background-color: #d4edda; color: #155724; }
            .jpdb-freq-indicator.med-freq { background-color: #fff3cd; color: #856404; }
            .jpdb-freq-indicator.low-freq { background-color: #f8d7da; color: #721c24; }
        `;
        document.head.appendChild(style);

        // Observer for Reviews and Lessons
        // WaniKani is a SPA now, so we need to observe DOM changes or URL changes
        // A common target for reviews is the character element or the meaning container

        const observer = new MutationObserver((mutations) => {
            // Ignore mutations caused by our own indicator injections
            const isOurMutation = mutations.some(mutation => {
                // Check if any added nodes are our indicator or contain our indicator
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.classList && node.classList.contains('jpdb-freq-indicator')) {
                            return true;
                        }
                        if (node.querySelector && node.querySelector('.jpdb-freq-indicator')) {
                            return true;
                        }
                    }
                }
                return false;
            });

            if (!isOurMutation) {
                update_ui(freq_map);
            }
        });

        // Start observing the body for general changes, then narrow down
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial check
        update_ui(freq_map);
    }

    let lastProcessedCharacter = null;

    function update_ui(freq_map) {
        // Check if we are in a review or lesson session
        // Reviews: URL contains /subjects/review or similar, or just check for specific elements
        // The current WaniKani review UI has a specific structure.

        // Try to find the current subject character
        // In reviews: .character-header__characters
        // In lessons: .character-header__characters

        const char_elem = document.querySelector('.character-header__characters') ||
            document.querySelector('#character span'); // Legacy/Fallback

        if (!char_elem) {
            // console.log('WaniKani JPDB Frequency: Character element not found'); // Too spammy for mutation observer
            return;
        }

        const text = char_elem.innerText.trim();
        if (!text) return;

        const target_container = document.querySelector('.quiz-input__question-type-container') || char_elem.parentNode;
        let freq_elem = target_container.querySelector('.jpdb-freq-indicator');

        // Skip if we just processed this character AND the indicator is still visible
        if (text === lastProcessedCharacter && freq_elem) {
            return;
        }
        lastProcessedCharacter = text;

        const freq = freq_map.get(text);

        if (freq !== undefined) {
            if (!freq_elem) {
                // Create new indicator
                freq_elem = document.createElement('span');
                freq_elem.className = 'jpdb-freq-indicator';
                target_container.appendChild(freq_elem);
                // console.log(`WaniKani JPDB Frequency: Created indicator for "${text}"`);
            }

            // Update the indicator content
            freq_elem.innerText = `#${freq}`;

            // Color coding based on rank (approximate)
            freq_elem.classList.remove('high-freq', 'med-freq', 'low-freq');
            if (freq < 2000) freq_elem.classList.add('high-freq');
            else if (freq < 10000) freq_elem.classList.add('med-freq');
            else freq_elem.classList.add('low-freq');

            // console.log(`WaniKani JPDB Frequency: Updated indicator for "${text}" with freq: ${freq}`);
        } else {
            // Remove indicator if it exists but no frequency data
            if (freq_elem) {
                freq_elem.remove();
            }
            // console.log('WaniKani JPDB Frequency: No frequency data found for', text);
        }
    }


    async function load_frequency_data() {
        // Check memory cache first (not implemented here as script reloads, but good for SPA nav if stored in window)
        // Check GM storage
        let stored_data = GM_getValue(CACHE_KEY_FREQ_DATA);
        if (stored_data) {
            // console.log('WaniKani JPDB Frequency: Loading from cache...');
            // stored_data is expected to be an object or array of [term, freq]. We need to reconstruct the Map
            try {
                const map = new Map(JSON.parse(stored_data));
                // console.log(`WaniKani JPDB Frequency: Loaded ${map.size} entries from cache.`);
                return map;
            } catch (e) {
                console.warn('WaniKani JPDB Frequency: Cached data corrupt, refetching...');
            }
        } else {
            // console.log('WaniKani JPDB Frequency: No cache found, fetching fresh data...');
        }

        return await fetch_and_process_zip();
    }

    function fetch_and_process_zip() {
        return new Promise((resolve, reject) => {
            // console.log('WaniKani JPDB Frequency: Fetching ZIP...');
            GM_xmlhttpRequest({
                method: "GET",
                url: JPDB_FREQ_URL,
                responseType: "arraybuffer",
                onload: async function (response) {
                    if (response.status !== 200) {
                        console.error('WaniKani JPDB Frequency: Download failed', response);
                        resolve(null);
                        return;
                    }

                    try {
                        // console.log('WaniKani JPDB Frequency: Unzipping...');
                        const buffer = new Uint8Array(response.response);

                        fflate.unzip(buffer, (err, unzipped) => {
                            if (err) {
                                console.error('WaniKani JPDB Frequency: Unzip error', err);
                                resolve(null);
                                return;
                            }

                            // console.log('WaniKani JPDB Frequency: Unzipped. Searching for JSON...');

                            let target_filename = null;
                            for (const filename in unzipped) {
                                if (filename.includes('term_meta_bank') && filename.endsWith('.json')) {
                                    target_filename = filename;
                                    break;
                                }
                            }

                            if (!target_filename) {
                                console.error('WaniKani JPDB Frequency: No term_meta_bank JSON found in ZIP');
                                resolve(null);
                                return;
                            }

                            const file_data = unzipped[target_filename];
                            // console.log(`WaniKani JPDB Frequency: Found ${target_filename} (Size: ${(file_data.length / 1024 / 1024).toFixed(2)} MB)`);

                            // console.log('WaniKani JPDB Frequency: Decoding text...');
                            const text = new TextDecoder("utf-8").decode(file_data);

                            // console.log('WaniKani JPDB Frequency: Text decoded, parsing JSON...');
                            const json = JSON.parse(text);
                            // console.log(`WaniKani JPDB Frequency: JSON parsed. Processing ${json.length} entries...`);
                            // if (json.length > 0) {
                            //     console.log('WaniKani JPDB Frequency: First entry sample:', json[0]);
                            //     console.log('WaniKani JPDB Frequency: First entry structure - length:', json[0].length, 'type of [2]:', typeof json[0][2]);
                            // }

                            // Format: [term, mode, data]
                            const freq_map = new Map();
                            const simplified_list = [];
                            let processed_count = 0;
                            let skipped_count = 0;

                            for (const entry of json) {
                                processed_count++;
                                if (processed_count % 10000 === 0) {
                                    // console.log(`WaniKani JPDB Frequency: Processed ${processed_count} / ${json.length} entries (${skipped_count} skipped)...`);
                                }

                                if (entry.length >= 3) {
                                    const term = entry[0];
                                    const data = entry[2];
                                    let freq = 0;

                                    if (typeof data === 'number') {
                                        freq = data;
                                    } else if (typeof data === 'string') {
                                        freq = parseInt(data, 10);
                                    } else if (typeof data === 'object') {
                                        // Handle nested structures
                                        if (data.value !== undefined) {
                                            // Could be {value: 123} or {value: {value: 123, displayValue: "123"}}
                                            if (typeof data.value === 'number') {
                                                freq = data.value;
                                            } else if (typeof data.value === 'object' && data.value.value !== undefined) {
                                                freq = data.value.value;
                                            }
                                        } else if (data.frequency !== undefined) {
                                            // Could be {frequency: 123} or {frequency: {value: 123, displayValue: "123"}}
                                            if (typeof data.frequency === 'number') {
                                                freq = data.frequency;
                                            } else if (typeof data.frequency === 'object' && data.frequency.value !== undefined) {
                                                freq = data.frequency.value;
                                            }
                                        }
                                    }

                                    // // Debug specific term - log ALL occurrences
                                    // if (term === '役') {
                                    //     console.log(`WaniKani JPDB Frequency: Found "役" entry #${processed_count}`);
                                    //     console.log('  - Full entry:', entry);
                                    //     console.log('  - Data (entry[2]):', data);
                                    //     console.log('  - Type of data:', typeof data);
                                    //     console.log('  - Parsed freq:', freq);
                                    //     console.log('  - Will be added to map:', freq > 0);
                                    // }

                                    if (freq > 0) {
                                        // Only add if this is a new term, or if this frequency is lower (more common) than existing
                                        const existingFreq = freq_map.get(term);
                                        if (existingFreq === undefined || freq < existingFreq) {
                                            freq_map.set(term, freq);
                                            simplified_list.push([term, freq]);

                                            if (term === '役') {
                                                // console.log(`WaniKani JPDB Frequency: Setting "役" to freq ${freq} (${existingFreq === undefined ? 'new entry' : `replacing ${existingFreq}`})`);
                                            }
                                        } else if (term === '役') {
                                            // console.log(`WaniKani JPDB Frequency: Skipping "役" freq ${freq} (keeping existing ${existingFreq})`);
                                        }
                                    } else {
                                        skipped_count++;
                                        if (term === '役') {
                                            // console.log('WaniKani JPDB Frequency: SKIPPED "役" because freq <= 0');
                                        }
                                    }
                                } else {
                                    skipped_count++;
                                }
                            }
                            // console.log(`WaniKani JPDB Frequency: Finished processing. Total: ${processed_count}, Added: ${freq_map.size}, Skipped: ${skipped_count}`);
                            // console.log('WaniKani JPDB Frequency: Finished processing entries.');

                            // Save to cache
                            GM_setValue(CACHE_KEY_FREQ_DATA, JSON.stringify(simplified_list));
                            GM_setValue(CACHE_KEY_LAST_FETCH, Date.now());

                            resolve(freq_map);
                        });

                    } catch (e) {
                        console.error('WaniKani JPDB Frequency: Error processing ZIP', e);
                        resolve(null);
                    }
                },
                onerror: function (err) {
                    console.error('WaniKani JPDB Frequency: Network error', err);
                    resolve(null);
                }
            });
        });
    }

})();
