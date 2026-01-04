// ==UserScript==
// @name         MusicBrainz: Import from Discogs CSV
// @namespace    https://musicbrainz.org/user/chaban
// @version      0.2.4
// @tag          ai-created
// @description  Imports releases to a MusicBrainz collection based on a Discogs CSV export by matching Discogs IDs to MusicBrainz Releases.
// @author       chaban
// @license      MIT
// @match        https://*.musicbrainz.org/collection/*
// @exclude      https://*musicbrainz.org/collection/*/*
// @match        https://*.musicbrainz.eu/collection/*
// @exclude      https://*musicbrainz.eu/collection/*/*
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js
// @downloadURL https://update.greasyfork.org/scripts/556207/MusicBrainz%3A%20Import%20from%20Discogs%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/556207/MusicBrainz%3A%20Import%20from%20Discogs%20CSV.meta.js
// ==/UserScript==

/* global Papa */

(function () {
    'use strict';

    // --- CONFIGURATION & CONSTANTS ---
    const DELAY_MS = 1100; // MusicBrainz API Rate Limit (1 req/sec)
    const CSS_STYLES = `
        #mb-csv-importer { position: fixed; bottom: 20px; right: 20px; width: 400px; background: #fff; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.2); z-index: 1000; padding: 15px; border-radius: 5px; font-family: sans-serif; color: #333; }
        #mb-csv-importer h3 { margin-top: 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000; }
        #mb-csv-importer .status-box { max-height: 200px; overflow-y: auto; background: #f9f9f9; border: 1px solid #ddd; margin: 10px 0; padding: 5px; font-size: 12px; }
        #mb-csv-importer .log-entry { margin-bottom: 2px; border-bottom: 1px dotted #eee; }
        #mb-csv-importer .log-success { color: green; }
        #mb-csv-importer .log-warn { color: orange; }
        #mb-csv-importer .log-error { color: red; }
        #mb-csv-importer button { cursor: pointer; padding: 5px 10px; background: #eee; border: 1px solid #ccc; border-radius: 3px; }
        #mb-csv-importer button:hover { background: #ddd; }
        #mb-csv-importer input[type="file"] { margin-bottom: 10px; width: 100%; }
        #mb-csv-importer .progress-bar { height: 5px; background: #eee; margin-top: 5px; width: 100%; }
        #mb-csv-importer .progress-fill { height: 100%; background: #736DAB; width: 0%; transition: width 0.3s; }
    `;

    // --- HELPER CLASSES ---

    /**
     * Manages the UI components of the importer.
     */
    class ImporterUI {
        constructor(onFileSelected) {
            this.container = document.createElement('div');
            this.container.id = 'mb-csv-importer';
            this.onFileSelected = onFileSelected;
            this.render();
        }

        render() {
            // Inject styles
            const style = document.createElement('style');
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);

            // HTML Structure
            this.container.innerHTML = `
                <h3>💿 Discogs CSV Import</h3>
                <p><small>Select your Discogs Export CSV file.</small></p>
                <input type="file" id="csv-file-input" accept=".csv" />
                <div class="progress-bar"><div class="progress-fill" id="csv-progress"></div></div>
                <div class="status-box" id="csv-log">Ready...</div>
                <div style="text-align: right; margin-top:5px;">
                    <button id="btn-close-importer">Close</button>
                </div>
            `;

            document.body.appendChild(this.container);

            // Event Listeners
            this.container.querySelector('#csv-file-input').addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.onFileSelected(e.target.files[0]);
                }
            });

            this.container.querySelector('#btn-close-importer').addEventListener('click', () => {
                this.container.style.display = 'none';
            });
        }

        log(message, type = 'info') {
            const logBox = this.container.querySelector('#csv-log');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = message;
            logBox.appendChild(entry);
            logBox.scrollTop = logBox.scrollHeight;
        }

        updateProgress(percent) {
            this.container.querySelector('#csv-progress').style.width = `${percent}%`;
        }
    }

    /**
     * MusicBrainz API Interactions.
     */
    class MusicBrainzAPI {
        constructor() {
            this.baseUrl = 'https://musicbrainz.org/ws/2';
        }

        /**
         * Waits for a specified amount of time (Rate Limiting).
         */
        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * Looks up an MBID based on the Discogs Release ID.
         * Uses the 'url' endpoint to find resources.
         */
        async getMBIDFromDiscogsID(discogsId) {
            const discogsUrl = `https://www.discogs.com/release/${discogsId}`;
            const queryUrl = `${this.baseUrl}/url?resource=${encodeURIComponent(discogsUrl)}&inc=release-rels&fmt=json`;

            try {
                const response = await fetch(queryUrl, { headers: { 'Accept': 'application/json' } });

                if (response.status === 404) return null; // Not found
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();

                // Look for relations that are releases
                if (data.relations) {
                    const releaseRel = data.relations.find(rel => rel['target-type'] === 'release');
                    if (releaseRel && releaseRel.release) {
                        return releaseRel.release.id;
                    }
                }
                return null;
            } catch (error) {
                console.error("API Error:", error);
                return null;
            }
        }

        /**
         * Adds a list of MBIDs to a collection.
         */
        async addReleasesToCollection(collectionId, releases) {
            const maxBatchSize = 25;

            for (let i = 0; i < releases.length; i += maxBatchSize) {
                const batch = releases.slice(i, i + maxBatchSize);
                const releaseString = batch.join(';');
                const url = `${this.baseUrl}/collection/${collectionId}/releases/${releaseString}?client=userscript-csv-importer`;

                try {
                    // Uses GM_xmlhttpRequest to bypass potential CORS/Header issues with PUT
                    await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "PUT",
                            url: url,
                            headers: {
                                "User-Agent": "DiscogsCSVImporter/1.0 ( https://musicbrainz.org/user/chaban )"
                            },
                            onload: (res) => {
                                if (res.status >= 200 && res.status < 300) resolve();
                                else reject(`Status ${res.status}`);
                            },
                            onerror: reject
                        });
                    });

                    await this.sleep(DELAY_MS);
                } catch (e) {
                    console.error("Error adding to collection:", e);
                    throw e;
                }
            }
        }
    }

    /**
     * Main Controller.
     */
    class ImporterController {
        constructor() {
            this.api = new MusicBrainzAPI();
            this.ui = new ImporterUI(this.handleFile.bind(this));
            this.collectionId = this.detectCollectionId();
        }

        detectCollectionId() {
            // Extract Collection ID from URL
            const match = window.location.href.match(/collection\/([a-f0-9-]{36})/);
            return match ? match[1] : null;
        }

        async handleFile(file) {
            if (!this.collectionId) {
                this.ui.log("Error: No Collection ID found in URL. Please open a specific collection page.", "error");
                return;
            }

            this.ui.log("Parsing CSV file...", "info");

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    await this.processCSVData(results.data);
                },
                error: (err) => {
                    this.ui.log(`CSV Error: ${err.message}`, "error");
                }
            });
        }

        async processCSVData(data) {
            const validRows = data.filter(row => row.release_id); // Only rows with Discogs ID
            this.ui.log(`${validRows.length} entries with Release ID found. Starting lookup...`, "info");

            const foundMBIDs = [];
            let processedCount = 0;

            for (const row of validRows) {
                const discogsId = row.release_id;
                const artist = row.Artist || "Unknown";
                const title = row.Title || "Unknown";

                try {
                    const mbid = await this.api.getMBIDFromDiscogsID(discogsId);

                    if (mbid) {
                        foundMBIDs.push(mbid);
                        this.ui.log(`[Found] ${artist} - ${title}`, "success");
                    } else {
                        this.ui.log(`[Not Linked] ${artist} - ${title} (Discogs: ${discogsId})`, "warn");
                    }

                } catch (e) {
                    this.ui.log(`[Error] ${artist} - ${title}: ${e}`, "error");
                }

                processedCount++;
                this.ui.updateProgress((processedCount / validRows.length) * 100);

                await this.api.sleep(DELAY_MS);
            }

            this.ui.log(`Lookup finished. ${foundMBIDs.length} releases found in MusicBrainz.`, "info");

            if (foundMBIDs.length > 0) {
                this.ui.log("Adding releases to collection...", "info");
                try {
                    await this.api.addReleasesToCollection(this.collectionId, foundMBIDs);
                    this.ui.log("Success! Reloading page...", "success");
                    setTimeout(() => window.location.reload(), 2000);
                } catch (e) {
                    this.ui.log("Error saving to collection.", "error");
                }
            }
        }
    }

    // Initialize
    window.addEventListener('load', () => {
        // 1. Check URL pattern
        if (!window.location.href.match(/collection\/([a-f0-9-]{36})/)) {
            return;
        }

        // 2. Validate Collection Type
        // We allow "Release collection" and its subtypes ("Owned music", "Wishlist")
        const typeElement = document.querySelector('dl.properties dd.type');
        const allowedTypes = ['Release collection', 'Owned music', 'Wishlist'];

        if (typeElement) {
            const typeText = typeElement.textContent.trim();
            const isAllowed = allowedTypes.some(allowed => typeText.includes(allowed));

            if (!isAllowed) {
                console.log(`Discogs Importer: Skipping collection type '${typeText}'.`);
                return;
            }
        }

        new ImporterController();
    });

})();