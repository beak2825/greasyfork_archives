// ==UserScript==
// @name         MusicBrainz: Ajax Collection Links
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.1.1
// @tag          ai-created
// @description  Enhances entity sidebar collection links (Add/Remove from Collection) to use AJAX, preventing page reloads and toggling the link text on success.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/area/*
// @match        *://*.musicbrainz.org/artist/*
// @match        *://*.musicbrainz.org/event/*
// @match        *://*.musicbrainz.org/genre/*
// @match        *://*.musicbrainz.org/instrument/*
// @match        *://*.musicbrainz.org/label/*
// @match        *://*.musicbrainz.org/place/*
// @match        *://*.musicbrainz.org/recording/*
// @match        *://*.musicbrainz.org/release-group/*
// @match        *://*.musicbrainz.org/release/*
// @match        *://*.musicbrainz.org/series/*
// @match        *://*.musicbrainz.org/work/*
// @connect      self
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552597/MusicBrainz%3A%20Ajax%20Collection%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552597/MusicBrainz%3A%20Ajax%20Collection%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_NAME = GM.info.script.name;
    const COLLECTION_LINK_SELECTOR =
        'a[href*="/collection/"][href*="/collection_collaborator/"]';
    let activeRequests = 0;
    let isUnloading = false;

    /**
     * Extracts parameters from a collection URL for processing.
     * @param {string} url - The URL of the collection action link.
     * @returns {{action: string, collectionId: string, entity: string, entityId: string}|null}
     */
    function parseUrl(url) {
        const urlObj = new URL(url, window.location.origin);
        const urlRegex = /^\/collection\/([0-9a-f-]{36})\/collection_collaborator\/(add|remove)/;
        const match = urlObj.pathname.match(urlRegex);

        if (!match) return null;

        const [, collectionId, action] = match;

        let entity, entityId;
        for (const [key, value] of urlObj.searchParams.entries()) {
            if (key !== 'returnto') {
                entity = key;
                entityId = value;
                break;
            }
        }

        if (!entity || !entityId) {
            console.error(`[${SCRIPT_NAME}] Failed to parse entity parameters from URL: ${url}`);
            return null;
        }

        return { action, collectionId, entity, entityId };
    }

    /**
     * Sends the AJAX request to toggle the collection status.
     * @param {URL} apiUrl - The fully constructed URL for the API call.
     * @returns {Promise<boolean>} Resolves to true on success, false otherwise.
     */
    async function sendCollectionRequest(apiUrl) {
        try {
            const response = await fetch(apiUrl, { method: 'GET' });
            if (response.ok) {
                return true;
            } else {
                console.error(`[${SCRIPT_NAME}] Request failed with status: ${response.status} ${response.statusText}`);
                return false;
            }
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] Network or fetching error:`, error);
            return false;
        }
    }

    /**
     * Toggles the UI state of a successful action link.
     * @param {HTMLAnchorElement} link - The link element to update.
     * @param {object} urlData - Parsed URL data containing action details.
     * @param {string} originalText - The original text content of the link before "Processing...".
     */
    function updateLink(link, urlData, originalText) {
        const isAddAction = urlData.action === 'add';
        const newAction = isAddAction ? 'remove' : 'add';

        link.href = link.href.replace(`/${urlData.action}`, `/${newAction}`);
        link.textContent = originalText.replace(
            isAddAction ? 'Add to' : 'Remove from',
            isAddAction ? 'Remove from' : 'Add to'
        );
    }

    /**
     * Updates the "Found in X user collections" counter in the sidebar.
     * @param {string} action - The action that was *performed* ('add' or 'remove').
     */
    function updateCollectionCounter(action) {
        const counterElement = document.querySelector('#sidebar a[href$="/collections"] bdi');
        if (!counterElement) {
            return;
        }

        const text = counterElement.textContent;
        const regex = /Found in (\d+) user collection(s?)/;
        const match = text.match(regex);

        if (!match) {
            console.error(`[${SCRIPT_NAME}] Could not parse collection counter text: ${text}`);
            return;
        }

        let count = parseInt(match[1], 10);

        if (action === 'add') {
            count++;
        } else {
            count = Math.max(0, count - 1);
        }

        const pluralS = (count === 1) ? '' : 's';
        counterElement.textContent = `Found in ${count} user collection${pluralS}`;
    }

    /**
     * Handles clicks on the sidebar using event delegation.
     * @param {Event} event - The click event.
     */
    async function handleSidebarClick(event) {
        const link = event.target.closest(COLLECTION_LINK_SELECTOR);

        if (!link) {
            return;
        }

        event.preventDefault();

        if (link.dataset.isProcessing === 'true') {
            return;
        }

        const originalHref = link.href;
        const originalText = link.textContent;
        const urlData = parseUrl(originalHref);

        if (!urlData) {
            // If parsing fails, fall back to default navigation to avoid breaking functionality.
            window.location.href = originalHref;
            return;
        }

        try {
            link.dataset.isProcessing = 'true';
            link.style.cursor = 'wait';
            link.textContent = 'Processing...';
            activeRequests++;

            const apiUrl = new URL(originalHref);
            const success = await sendCollectionRequest(apiUrl);

            if (success) {
                updateCollectionCounter(urlData.action);
                updateLink(link, urlData, originalText);
            } else {
                link.textContent = originalText;
                if (!isUnloading) {
                    alert(`[${SCRIPT_NAME}] Failed to perform collection action. See console for details.`);
                }
            }
        } finally {
            link.style.cursor = 'pointer';
            link.dataset.isProcessing = 'false';
            activeRequests--;
        }
    }

    /**
     * Bootstrap function to initialize the script.
     */
    function initialize() {
        const sidebar = document.getElementById('sidebar');

        if (sidebar) {
            sidebar.addEventListener('click', handleSidebarClick);
        }

        window.addEventListener('beforeunload', (event) => {
            if (activeRequests > 0) {
                event.preventDefault();
            }
        });

        window.addEventListener('unload', () => {
            if (activeRequests > 0) {
                isUnloading = true;
            }
        });
    }

    initialize();
})();