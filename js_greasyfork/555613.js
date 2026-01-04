// ==UserScript==
// @name         PT - Director
// @namespace    http://tampermonkey.net/
// @version      9.6
// @description  Loads work stats for authorized faction members.
// @author       Upsilon[3212478] & ThatJimmyGuy [2924303] & vavi [2224491]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @connect      api.upsilon-cloud.uk
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/555613/PT%20-%20Director.user.js
// @updateURL https://update.greasyfork.org/scripts/555613/PT%20-%20Director.meta.js
// ==/UserScript==

(function () {
    // UPSILON - LIB
    'use strict';
    if (window.Ups?.showToast) return;

    window.Ups = window.Ups || {};

    const isPda = /tornpda/i.test(navigator.userAgent);

    window.Ups.showToast = (message, type = 'info', duration = 5000) => {
        const createToast = () => {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.position = 'fixed';
                container.style.bottom = '5%';
                container.style.right = '5%';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.zIndex = 100000;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
            toast.style.color = 'white';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            toast.style.fontFamily = 'monospace';
            toast.style.whiteSpace = 'pre-wrap';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.addEventListener('transitionend', () => toast.remove());
            }, duration);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToast);
        } else {
            createToast();
        }
    };

    window.Ups.callAPI = function (url, method, requestObject, callback) {
        const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase());
        const useFetch = typeof GM_xmlhttpRequest !== 'function';

        if (useFetch) {
            const fetchOptions = {
                method: method,
                headers: {'Content-Type': 'application/json'}
            };

            if (isBodyMethod) {
                fetchOptions.body = typeof requestObject === 'string'
                    ? requestObject
                    : JSON.stringify(requestObject);
            }

            fetch(url, fetchOptions)
                .then(response => response.text().then(text => ({
                    status: response.status,
                    text
                })))
                .then(({status, text}) => {
                    try {
                        const data = text ? JSON.parse(text) : {};

                        if (status >= 400) {
                            let errorMessage = 'Unknown error';
                            if (data.error) {
                                errorMessage = data.error;
                            } else if (data.Error) {
                                errorMessage = data.Error;
                            }

                            const error = new Error(errorMessage);
                            error.status = status;
                            error.data = data;

                            console.error(`[UpsLib] API Error (${status}):`, errorMessage);
                            callback && callback(error, null);
                            return;
                        }

                        callback && callback(null, data);
                    } catch (e) {
                        console.error("[UpsLib] Error processing JSON:", e);
                        callback && callback(e, null);
                    }
                })
                .catch(err => {
                    console.error("[UpsLib] Error while calling API:", err);
                    console.error("URL:", url);
                    console.error("Method:", method);
                    console.error("isPda:", isPda);
                    console.error("GM_xmlhttpRequest available:", typeof GM_xmlhttpRequest);
                    callback && callback(err, null);
                });
        } else {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: isBodyMethod
                    ? (typeof requestObject === 'string' ? requestObject : JSON.stringify(requestObject))
                    : undefined,
                onload: function (response) {
                    const safeResponse = response || {};
                    const responseText = typeof safeResponse.responseText === 'string' ? safeResponse.responseText : '';
                    const status = typeof safeResponse.status === 'number' ? safeResponse.status : 0;

                    let data = {};
                    try {
                        data = responseText ? JSON.parse(responseText) : {};
                    } catch (e) {
                        console.error('[UpsLib] Error processing JSON:', e, {status, response});
                        callback && callback(e, null);
                        return;
                    }

                    if (status >= 400) {
                        let errorMessage = 'Unknown error';
                        if (data.error) {
                            errorMessage = data.error;
                        } else if (data.Error) {
                            errorMessage = data.Error;
                        }

                        const error = new Error(errorMessage);
                        error.status = status;
                        error.data = data;

                        console.error(`[UpsLib] API Error (${status}):`, errorMessage);
                        callback && callback(error, null);
                        return;
                    }

                    callback && callback(null, data);
                },
                onerror: function (err) {
                    console.error("[UpsLib] Error while calling API:", err);
                    callback && callback(err, null);
                }
            });
        }
    };
})();

(function () {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const CONFIG = {
        // Working Stats Color Thresholds
        THRESHOLDS: {
            LOW: 90000,
            HIGH: 200000
        },

        // Timing configurations (in milliseconds)
        TIMINGS: {
            TOAST_DEFAULT: 5000,
            ELEMENT_WAIT: 10000,
            MUTATION_POLL: 150,
            MUTATION_MAX_WAIT: 10000,
            QUEUE_DELAY: 25,
            DEBOUNCE_PAGE_CHANGE: 100,
            DOM_SETTLE: 200,
            HASH_CHANGE_DELAY: 500,
            HASH_CHANGE_MAX: 2000,
            PAGE_LOAD_DELAY: 500
        },

        // Retry configuration
        RETRY: {
            MAX_ATTEMPTS: 5,
            BASE_DELAY: 5000,
            MAX_DELAY: 30000
        },

        // CSS Selectors
        SELECTORS: {
            // User List Page
            USER_LIST_WRAP: '.user-info-list-wrap',
            USER_LIST_ITEM: '.user-info-list-wrap > li[class^="user"]',
            USER_NAME_LINK: 'a.user.name',

            // Company Page
            EMPLOYEES_WRAP: '.employees-wrap',
            EMPLOYEES_LIST: '.employees-wrap ul.employees-list.cont-gray.bottom-round > li',
            EMPLOYEE_LINK: 'li.employee a.user',

            // Job List Page
            DIRECTOR_LINK: 'ul.item li.director a',
            JOBLIST_CONTAINER: '.joblist-wrap, .content-wrapper',

            // Profile Page
            PROFILE_HEADER: 'h4#skip-to-content.left',
            PROFILE_WRAPPER: '.profile-wrapper',
            SETTINGS_LINK: '.settings-menu > .link > a:first-child',

            // Common
            USER_LINK_WITH_ID: 'a[href*="XID="]'
        },

        // CSS Classes and IDs
        CSS_IDS: {
            TOOLTIP: 'torn-stats-tooltip',
            FILTER_CONTAINER: 'working-stats-filter-container',
            PROFILE_STATS: 'working-stats-profile-display',
            SETTINGS_ACCORDION: 'pt-director-settings'
        },

        CSS_CLASSES: {
            STATS_CONTAINER: 'working-stats-container',
            STATS_CONTAINER_COMPANY: 'working-stats-container-company',
            STATS_INLINE: 'working-stats-inline',
            STATS_INLINE_COMPANY: 'working-stats-inline-company',
            STATS_ICON: 'working-stats-icon',
            CONTACTED_CHECKBOX: 'contacted-checkbox',
            LAST_ACTION_SPAN: 'torn-last-action-span'
        },

        // Storage Keys
        STORAGE_KEYS: {
            API_KEY: 'pt-director-api-key',
            SERVER: 'pt-director-server',
            CACHE_TIME: 'pt-director-cache-time',
            ROUTES: 'pt-director-routes',
            CACHE_DATA: 'pt-director-cache'
        },

        // Special values for working stats
        SPECIAL_VALUES: {
            NOT_AVAILABLE: -1,
            ERROR: -2
        },

        // Colors
        COLORS: {
            LOW: 'red',
            MEDIUM: 'orange',
            HIGH: 'green',
            NOT_AVAILABLE: 'grey',
            ERROR: 'yellow',
            DEFAULT: 'black'
        }
    };

    // ============================================================
    // GLOBAL STATE
    // ============================================================
    const state = {
        apiKey: null,
        apiServer: null,
        expirationDays: null,
        routesEnabled: {
            userList: true,
            jobList: true,
            profiles: true
        }
    };

    const cache = {
        userDetails: new Map(),
        workingStats: new Map(),
        pendingRequests: new Set()  // URLs des requêtes en cours
    };

    const filters = {
        minWorkingStats: null,
        maxWorkingStats: null
    };

    const ui = {
        observer: null,
        tooltipId: CONFIG.CSS_IDS.TOOLTIP,
        tooltipTarget: null
    };

    const queue = {
        apiRequests: [],
        isProcessing: false,
        maxRequestsPerMinute: 60,
        requestsInCurrentMinute: 0,
        minuteStartTime: Date.now()
    };

    const isPda = /tornpda/i.test(navigator.userAgent);
    const Ups = window.Ups;
    const prefersTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // ============================================================
    // STORAGE UTILITIES
    // ============================================================

    /**
     * Retrieves and parses a value from localStorage.
     * @param {string} key - The storage key to retrieve.
     * @returns {*} The parsed value or undefined if not found or invalid JSON.
     */
    function getLocalStorage(key) {
        const value = window.localStorage.getItem(key);
        try {
            return JSON.parse(value) ?? undefined;
        } catch (err) {
            return undefined;
        }
    }

    function setLocalStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    const [GM_getValue, GM_setValue] =
        isPda || typeof window.GM_getValue !== 'function' || typeof window.GM_setValue !== 'function'
            ? [getLocalStorage, setLocalStorage]
            : [window.GM_getValue, window.GM_setValue];


    async function waitForElement(selector, timeout = 10000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await new Promise(res => setTimeout(res, 200));
        }
        return null;
    }

    // Store API key
    async function getOrPromptValue(storageKey, promptMessage, errorMessage) {
        let value = GM_getValue(storageKey);
        if (!value || value === '') {
            value = await prompt(promptMessage);
            if (value) {
                GM_setValue(storageKey, value);
            } else {
                alert(errorMessage);
                return null;
            }
        }
        return value;
    }

    /**
     * Migrates storage keys from old format to new format.
     * Detects if cache contains a number (cache-time) and migrates it.
     */
    function migrateStorageKeys() {
        const cacheValue = GM_getValue('pt-director-cache');

        if (typeof cacheValue === 'number') {
            GM_setValue('pt-director-cache-time', cacheValue);
            GM_setValue('pt-director-cache', []);

        }
    }

    /**
     * Retrieves the API key from storage or prompts the user to enter it.
     * @returns {Promise<string|null>} The API key or null if not provided
     */
    async function getApiKey() {
        return await getOrPromptValue(
            CONFIG.STORAGE_KEYS.API_KEY,
            'Please enter your Torn API key to use PT-Director:\n(This will only be shown once and stored locally)',
            'No API key provided. The PT-Director script will not work.'
        );
    }

    /**
     * Retrieves the server address from storage or prompts the user to enter it.
     * @returns {Promise<string|null>} The server address or null if not provided
     */
    async function getServerAddress() {
        return await getOrPromptValue(
            CONFIG.STORAGE_KEYS.SERVER,
            'Please enter the PT-Director server address:\n(This will only be shown once and stored locally)',
            'No server address provided. The PT-Director script will not work.'
        );
    }

    /**
     * Retrieves the cache time from storage or prompts the user to enter it.
     * @returns {Promise<number|undefined>} The cache time in days or undefined if not provided
     */
    async function getCachingTime() {
        let value = await getOrPromptValue(
            CONFIG.STORAGE_KEYS.CACHE_TIME,
            'Please enter the PT-Director cache time:\n(This will only be shown once and stored locally)\nExample: type "2" for 2 days',
            'No cache time provided. The PT-Director script will not work.'
        );

        if (value !== null) {
            const num = Number(value);
            if (!isNaN(num) && num >= 0) {
                GM_setValue(CONFIG.STORAGE_KEYS.CACHE_TIME, num);
                return num;
            } else {
                Ups.showToast('Invalid number entered. Please reload and enter a valid number.\nDefault 2 days', 'error');
                GM_setValue(CONFIG.STORAGE_KEYS.CACHE_TIME, 2);
                return 2;
            }
        }
        return undefined;
    }

    function getCurrentProfileId() {
        const m = window.location.href.match(/XID=(\d+)/);
        return m ? m[1] : null;
    }

    function createSettingsAccordion() {
        if (document.querySelector('#pt-director-settings')) return;

        const profileWrapper =
            document.querySelector('.profile-wrapper') ||
            document.querySelector('h4#skip-to-content.left')?.parentElement;
        if (!profileWrapper) return;

        const style = document.createElement('style');
        style.textContent = `
      details.ptd-settings-accordion {
        margin: 12px 0 0 0;
        border: 1px solid #2d2d2d;
        border-radius: 8px;
        background: #1e1e1e;
        color: #e9e9e9;
        overflow: hidden;
      }
      details.ptd-settings-accordion > summary {
        list-style: none;
        cursor: pointer;
        padding: 10px 14px;
        font-weight: 700;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #242424;
        border-bottom: 1px solid #2d2d2d;
      }
      details.ptd-settings-accordion > summary::-webkit-details-marker { display: none; }
      details.ptd-settings-accordion > summary:before {
        content: "▸";
        transition: transform .15s ease;
        font-size: 12px;
        opacity: .9;
      }
      details.ptd-settings-accordion[open] > summary:before { transform: rotate(90deg); }
      .ptd-settings-content {
        padding: 12px 14px 14px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        font-family: Consolas, Menlo, monospace;
      }
      .ptd-field {
        width: 80%;
      }
      .ptd-field label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #bfc7cf;
      }
      .ptd-field input[type="text"],
      .ptd-field input[type="number"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #3a3a3a;
        border-radius: 6px;
        background: #2b2b2b;
        color: #eee;
        outline: none;
      }
      .ptd-fieldset {
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        padding: 10px;
      }
      .ptd-fieldset legend {
        padding: 0 6px;
        font-weight: 600;
        color: #bfc7cf;
      }
      .ptd-checkbox { display: block; margin: 6px 0; }
      .ptd-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 4px;
      }
      .ptd-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
      }
      .ptd-btn.primary { background: #00bcd4; color: #000; }
      .ptd-btn.ghost { background: #424242; color: #fff; }
    `;
        document.head.appendChild(style);

        // ----- Structure du panneau -----
        const details = document.createElement('details');
        details.className = 'ptd-settings-accordion';
        details.id = 'pt-director-settings';
        details.open = false;

        details.innerHTML = `
      <summary>⚙️ PT Director Settings</summary>
      <div class="ptd-settings-content">
        <div class="ptd-field">
          <label>API Key</label>
          <input id="director-apiKey" type="text" placeholder="Enter API Key...">
        </div>

        <div class="ptd-field">
          <label>Server URL</label>
          <input id="director-server" type="text" placeholder="https://example.com">
        </div>

        <div class="ptd-field">
          <label>Cache duration (days)</label>
          <input id="director-cache" type="number" min="0" placeholder="2">
        </div>

        <fieldset class="ptd-fieldset">
          <legend>Enabled routes</legend>
          <label class="ptd-checkbox"><input id="director-enableUserList" type="checkbox"> Work on User List</label>
          <label class="ptd-checkbox"><input id="director-enableProfiles" type="checkbox"> Work on Profiles</label>
          <label class="ptd-checkbox"><input id="director-enableJobList" type="checkbox"> Work on Job List</label>
        </fieldset>

        <div class="ptd-actions">
          <button id="director-save" class="ptd-btn primary" type="button">Save</button>
        </div>
      </div>
    `;

        profileWrapper.parentNode.insertBefore(details, profileWrapper.nextSibling);
        // console.log('[PT Director] Accordion inserted under profile');

        const apiInput = document.getElementById("director-apiKey");
        const serverInput = document.getElementById("director-server");
        const cacheInput = document.getElementById("director-cache");
        const enableUserListCheckbox = document.getElementById("director-enableUserList");
        const enableJobListCheckbox = document.getElementById("director-enableJobList");
        const enableProfilesCheckbox = document.getElementById("director-enableProfiles");
        const saveBtn = document.getElementById("director-save");

        apiInput.value = GM_getValue("pt-director-api-key", "");
        serverInput.value = GM_getValue("pt-director-server", "");
        cacheInput.value = GM_getValue("pt-director-cache-time", 1);

        let routesConfig = GM_getValue("pt-director-routes", { userList: true, jobList: true, profiles: true });

        if (typeof routesConfig === "string") {
            try {
                routesConfig = JSON.parse(routesConfig);
                // console.log("[PT Director] routesConfig parsed from JSON:", routesConfig);
            } catch (err) {
                // console.warn("[PT Director] Invalid routesConfig detected, resetting to defaults.", err);
                routesConfig = { userList: true, jobList: true, profiles: true };
                GM_setValue("pt-director-routes", routesConfig);
            }
        }

        if (typeof routesConfig !== "object" || routesConfig === null) {
            // console.warn("[PT Director] routesConfig is not an object, resetting to defaults.");
            routesConfig = { userList: true, jobList: true, profiles: true };
            GM_setValue("pt-director-routes", routesConfig);
        }
        if (enableUserListCheckbox) enableUserListCheckbox.checked = routesConfig.userList !== false;
        if (enableJobListCheckbox) enableJobListCheckbox.checked = routesConfig.jobList !== false;
        if (enableProfilesCheckbox) enableProfilesCheckbox.checked = routesConfig.profiles !== false;

        if (!saveBtn) return;
        if (saveBtn.dataset.listenerAttached) return;

        saveBtn.dataset.listenerAttached = "true";
        saveBtn.addEventListener("click", () => {
            GM_setValue("pt-director-api-key", apiInput.value.trim());
            GM_setValue("pt-director-server", serverInput.value.trim());
            GM_setValue("pt-director-cache-time", parseInt(cacheInput.value, 10));

            const routesEnabled = {
                userList: enableUserListCheckbox.checked,
                jobList: enableJobListCheckbox.checked,
                profiles: enableProfilesCheckbox.checked,
            };
            GM_setValue("pt-director-routes", routesEnabled);

            (window.Ups?.showToast || alert)("✅ Configuration applied with success.");
        });
    }


    const currentProfileId = getCurrentProfileId();
    if (currentProfileId) {
        const pollInterval = 150;
        const maxWait = 10000;
        let waited = 0;

        const id = setInterval(() => {
            const profileLink = document.querySelector('.settings-menu > .link > a:first-child');
            if (profileLink && profileLink.href) {
                const m = profileLink.href.match(/XID=(\d+)/);
                const localId = m ? m[1] : null;
                if (localId && localId === currentProfileId) {
                    createSettingsAccordion();
                } else {
                    // console.log('[PT Director UI] Not my profile — nothing to display.');
                }
                clearInterval(id);
                return;
            }
            waited += pollInterval;
            if (waited >= maxWait) {
                // console.warn('[PT Director UI] Timeout waiting for settings link; abort.');
                clearInterval(id);
            }
        }, pollInterval);
    }

    // ============================================================
    // EXECUTION
    // ============================================================
    const storageKey = CONFIG.STORAGE_KEYS.CACHE_DATA;

    // --- Local Storage Management ---
    /**
     * Retrieves the list of contacted users from localStorage.
     * Automatically filters out expired entries based on configured expiration time.
     * @returns {Array<{id: number, timestamp: number}>} Array of contacted user objects
     */
    function getContactedList() {
        const now = Date.now();
        const expirationMs = state.expirationDays * 60 * 60 * 1000 * 24;

        let list;
        try {
            list = JSON.parse(localStorage.getItem(storageKey));
        } catch (e) {
            console.warn('[PT-Director] Failed to parse contacted list from localStorage:', e);
            list = [];
        }

        // Ensure list is an array
        if (!Array.isArray(list)) {
            console.warn('[PT-Director] Contacted list is not an array, resetting to empty array. Found:', typeof list);
            list = [];
        }

        list = list.filter(item => now - item.timestamp < expirationMs);

        localStorage.setItem(storageKey, JSON.stringify(list));
        return list;
    }

    /**
     * Find if user has been contacted or not
     * @param {userId} id of the user.
     */
    function isContacted(userId) {
        return getContactedList().some(item => item.id === userId);
    }

    /**
     * Add or remove a user from contacted list
     * @param {userId} id of the user.
     * @param {contacted} true / false.
     */
    function setContacted(userId, contacted) {
        let list = getContactedList();

        if (contacted) {
            if (!list.some(item => item.id === userId)) {
                list.push({id: userId, timestamp: Date.now()});
            }
        } else {
            list = list.filter(item => item.id !== userId);
        }

        localStorage.setItem(storageKey, JSON.stringify(list));
    }

    // ============================================================
    // REQUEST QUEUE LOGIC
    // ============================================================

    /**
     * Adds an API request to the queue for processing.
     * Implements retry logic with exponential backoff for rate limiting errors.
     * @param {object} requestDetails - Details for the API request (url, method, onload, onerror)
     * @param {function} resolve - Promise resolve function
     * @param {function} reject - Promise reject function
     * @param {number} [retryCount=0] - Current retry attempt count
     */
    function queueApiRequest(requestDetails, resolve, reject, retryCount = 0) {
        queue.apiRequests.push({requestDetails, resolve, reject, retryCount});
        processQueue();
    }

    /**
     * Clears the API request queue and resets processing state.
     */
    function clearQueue() {
        queue.apiRequests.length = 0;
        queue.isProcessing = false;
    }

    /**
     * Processes the API request queue with retry logic and rate limiting.
     * Limits requests to maxRequestsPerMinute and maintains a delay between each request.
     * Automatically retries requests on rate limit errors with exponential backoff.
     */
    function processQueue() {
        if (queue.apiRequests.length === 0) {
            return;
        }

        if (!document.body) {
            queue.apiRequests.length = 0;
            queue.isProcessing = false;
            return;
        }

        const now = Date.now();

        // Reset counter if a new minute has started
        if (now - queue.minuteStartTime >= 60 * 1000) {
            queue.requestsInCurrentMinute = 0;
            queue.minuteStartTime = now;
        }

        // If we've reached the rate limit, schedule retry after the minute resets
        if (queue.requestsInCurrentMinute >= queue.maxRequestsPerMinute) {
            const timeUntilNextMinute = 60 * 1000 - (now - queue.minuteStartTime);
            setTimeout(processQueue, timeUntilNextMinute + 100);
            return;
        }

        queue.isProcessing = true;
        const {requestDetails, resolve, reject, retryCount} = queue.apiRequests.shift();

        // Check cache before making the request
        if (typeof requestDetails.cacheCheck === 'function') {
            try {
                const cached = requestDetails.cacheCheck();
                if (cached !== undefined) {
                    resolve(cached);
                    queue.isProcessing = false;
                    if (queue.apiRequests.length > 0) {
                        setTimeout(processQueue, CONFIG.TIMINGS.QUEUE_DELAY);
                    }
                    return;
                }
            } catch (err) {
                console.warn('[PT-Director] cacheCheck failed, continuing request.', err);
            }
        }

        // Increment the request counter
        queue.requestsInCurrentMinute++;

        Ups.callAPI(
            requestDetails.url,
            requestDetails.method,
            {},
            function (err, data) {
                if (err) {
                    console.error('API call failed', err);
                    Ups.showToast(`API error: ${err.message}`, 'error');
                }

                // Check if error is due to rate limiting/key overload
                const isOverloaded = err && (
                    err.message?.toLowerCase().includes('rate limit exceeded') ||
                    err.message?.toLowerCase().includes('failed to check rate limit')
                );

                if (isOverloaded && retryCount < CONFIG.RETRY.MAX_ATTEMPTS) {
                    // Re-queue the request with exponential backoff
                    const delay = Math.min(
                        CONFIG.RETRY.BASE_DELAY * Math.pow(2, retryCount),
                        CONFIG.RETRY.MAX_DELAY
                    );

                    setTimeout(() => {
                        queueApiRequest(requestDetails, resolve, reject, retryCount + 1);
                    }, delay);
                } else if (err) {
                    // Permanent error or max retries reached
                    if (requestDetails.onerror) requestDetails.onerror(err);
                    reject(err);
                } else {
                    // Success
                    if (requestDetails.onload) {
                        (async () => {
                            await requestDetails.onload(data);
                        })();
                    } else {
                        resolve(data);
                    }
                }

                // Continue processing queue with delay
                queue.isProcessing = false;
                if (queue.apiRequests.length > 0) {
                    setTimeout(processQueue, CONFIG.TIMINGS.QUEUE_DELAY);
                }
            }
        );
    }

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    /**
     * Formats a number with commas as thousands separators.
     * @param {number|null|undefined} number - The number to format
     * @returns {string} The formatted number string or 'N/A' if invalid
     */
    function formatNumberWithCommas(number) {
        if (number === null || number === undefined) return 'N/A';
        const num = Number(number);
        if (isNaN(num)) return 'N/A';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Determines the display color for working stats based on value thresholds.
     * @param {number} rawStatsValue - The raw working stats value
     * @returns {string} CSS color name
     */
    function getWorkingStatsColor(rawStatsValue) {
        if (rawStatsValue >= 0) {
            if (rawStatsValue < CONFIG.THRESHOLDS.LOW) {
                return CONFIG.COLORS.LOW;
            } else if (rawStatsValue <= CONFIG.THRESHOLDS.HIGH) {
                return CONFIG.COLORS.MEDIUM;
            } else {
                return CONFIG.COLORS.HIGH;
            }
        } else if (rawStatsValue === CONFIG.SPECIAL_VALUES.NOT_AVAILABLE) {
            return CONFIG.COLORS.NOT_AVAILABLE;
        } else if (rawStatsValue === CONFIG.SPECIAL_VALUES.ERROR) {
            return CONFIG.COLORS.ERROR;
        }
        return CONFIG.COLORS.DEFAULT;
    }

    /**
     * Handles API errors in a consistent manner across the application.
     * Logs the error and optionally shows a toast notification to the user.
     * @param {Error|string} error - The error object or message
     * @param {string} context - Context description for the error (e.g., "fetching user details")
     * @param {boolean} [showToast=true] - Whether to show a toast notification
     */
    function handleAPIError(error, context, showToast = true) {
        const errorMessage = error?.message || error || 'Unknown error';
        console.error(`[PT-Director] Error ${context}:`, errorMessage);

        if (showToast) {
            Ups.showToast(`Error ${context}: ${errorMessage}`, 'error');
        }
    }

    /**
     * Creates HTML content for user details tooltip.
     * @param {object} userDetails - User details object from API
     * @param {string} formattedStats - Formatted working stats string
     * @returns {string} HTML content for tooltip
     */
    function createTooltipContent(userDetails, formattedStats) {
        if (!userDetails || !userDetails.last_action || !userDetails.personalstats) {
            return `<div style="color: red;">Could not retrieve user details.</div>`;
        }

        const lastAction = userDetails.last_action.relative;
        const xantaken = formatNumberWithCommas(userDetails.personalstats.xantaken);
        const networth = formatNumberWithCommas(userDetails.personalstats.networth);
        const activityStreak = formatNumberWithCommas(userDetails.personalstats.activestreak);
        const bestStreak = formatNumberWithCommas(userDetails.personalstats.bestactivestreak);

        return `
            <div style="font-weight: bold; margin-bottom: 5px;">User Details</div>
            <div><b>Last Action:</b> ${lastAction}</div>
            <div><b>Xanax Taken:</b> ${xantaken}</div>
            <div><b>Networth:</b> $${networth}</div>
            <div><b>Activity Streak:</b> ${activityStreak}</div>
            <div><b>Best Streak:</b> ${bestStreak}</div>
            <div><b>Working stats:</b> ${formattedStats}</div>
        `;
    }

    /**
     * Creates a stats container with checkbox, info icon, and stats display.
     * @param {string} userId - The user ID
     * @param {string} formattedStats - Formatted working stats string
     * @param {number} rawStatsValue - Raw working stats value for coloring
     * @param {('userlist'|'company'|'profile')} pageType - Type of page being displayed
     * @returns {HTMLElement} The created stats container element
     */
    function createStatsContainer(userId, formattedStats, rawStatsValue, pageType) {
        const containerClass = pageType === 'company'
            ? CONFIG.CSS_CLASSES.STATS_CONTAINER_COMPANY
            : CONFIG.CSS_CLASSES.STATS_CONTAINER;

        const statsClass = pageType === 'company'
            ? CONFIG.CSS_CLASSES.STATS_INLINE_COMPANY
            : CONFIG.CSS_CLASSES.STATS_INLINE;

        const statsContainer = document.createElement('span');
        statsContainer.classList.add(containerClass);

        // Style configuration based on page type
        if (pageType === 'company') {
            statsContainer.style.marginLeft = '5px';
        } else if (pageType === 'userlist') {
            statsContainer.style.marginLeft = '10px';
        }

        // Add contacted checkbox
        const contactedCheckbox = createContactedCheckbox(userId);
        statsContainer.appendChild(contactedCheckbox);

        if (!isPda) {
            const iconSpan = document.createElement('span');
            iconSpan.classList.add(CONFIG.CSS_CLASSES.STATS_ICON);
            iconSpan.textContent = 'ⓘ';
            iconSpan.style.marginRight = pageType === 'company' ? '1px' : '5px';
            iconSpan.style.fontSize = '10px';
            iconSpan.style.padding = '0px 5px';
            iconSpan.style.cursor = 'pointer';
            iconSpan.style.color = '#888';
            iconSpan.style.verticalAlign = 'middle';

            const showInfo = async (event) => {
                event.stopPropagation();
                event.preventDefault?.();

                const userDetails = await fetchUserDetails(userId);
                const tooltipContent = createTooltipContent(userDetails, formattedStats);
                showTooltip(iconSpan, tooltipContent);

                if (event.type === 'touchstart') {
                    setTimeout(hideTooltip, 3500);
                }
            };

            ['click', 'touchstart'].forEach(evt =>
                iconSpan.addEventListener(evt, showInfo, {capture: true, passive: false})
            );

            iconSpan.addEventListener('mouseout', hideTooltip);
            iconSpan.addEventListener('touchend', hideTooltip);
            iconSpan.addEventListener('touchcancel', hideTooltip);
            statsContainer.appendChild(iconSpan);
        }

        // Add working stats span
        const statsSpan = document.createElement('span');
        statsSpan.classList.add(statsClass);

        if (pageType === 'profile') {
            statsSpan.textContent = `Total Working Stats: ${formattedStats}`;
            statsSpan.style.fontSize = '1.8em';
        } else if (pageType === 'company') {
            statsSpan.textContent = `WS:${formattedStats}`;
            statsSpan.style.marginLeft = '1px';
            statsSpan.style.fontSize = '1em';
        } else {
            statsSpan.textContent = ` WS: ${formattedStats}`;
            statsSpan.style.fontSize = '11px';
        }

        statsSpan.style.fontWeight = 'bold';
        statsSpan.style.color = getWorkingStatsColor(rawStatsValue);
        statsContainer.appendChild(statsSpan);

        return statsContainer;
    }

    // ============================================================
    // API FETCHING FUNCTIONS
    // ============================================================

    /**
     * Fetches user profile and personal stats from the server.
     * Uses in-memory cache to avoid redundant requests.
     * @param {number|string} userId - The ID of the user
     * @returns {Promise<object|null>} User details data or null on error
     */
    async function fetchUserDetails(userId) {
        // Check in-memory cache first (from bulk fetch)
        const userIdNum = parseInt(userId);
        if (cache.userDetails.has(userIdNum)) {
            return cache.userDetails.get(userIdNum);
        }

        // Use our server endpoint instead of direct Torn API
        const apiUrl = `${state.apiServer}/pt-director/user/${userId}?api_key=${state.apiKey}`;

        // Check if request is already pending
        if (cache.pendingRequests.has(apiUrl)) {
            return undefined; // Ignore duplicate request (undefined = pending, null = error)
        }

        // Mark request as pending
        cache.pendingRequests.add(apiUrl);

        return new Promise((resolve, reject) => {
            queueApiRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                cacheCheck: () => cache.userDetails.get(userIdNum),
                onload: async function (data) {
                    cache.pendingRequests.delete(apiUrl);
                    try {
                        resolve(data);
                    } catch (error) {
                        console.error(`Error caching user details JSON for User ${userId}:`, error);
                        Ups.showToast(`Error caching user details for User ${userId}: ${error.message}`, "error");
                        resolve(null);
                    }
                },
                onerror: function (error) {
                    cache.pendingRequests.delete(apiUrl);
                    console.error(`Error during fetch for user details of User ${userId}:`, error);
                    Ups.showToast(`Error fetching user details for User ${userId}: ${error.message}`, "error");
                    resolve(null);
                }
            }, resolve, reject);
        });
    }

    /**
     * Fetches Hall of Fame working stats from the server.
     * Uses in-memory cache to avoid redundant requests.
     * @param {number|string} userId - The ID of the user
     * @returns {Promise<{formattedOriginalStats: string, rawStatsValue: number}>} Working stats data
     */
    async function fetchWorkingStats(userId) {
        // Check in-memory cache first (from bulk fetch)
        const userIdNum = parseInt(userId);
        if (cache.workingStats.has(userIdNum)) {
            return cache.workingStats.get(userIdNum);
        }

        // Use our server endpoint instead of direct Torn API
        const apiUrl = `${state.apiServer}/pt-director/user/${userId}/workingStats?api_key=${state.apiKey}`;

        // Check if request is already pending
        if (cache.pendingRequests.has(apiUrl)) {
            return undefined; // Ignore duplicate request (undefined = pending, null = error)
        }

        // Mark request as pending
        cache.pendingRequests.add(apiUrl);

        return new Promise((resolve, reject) => {
            queueApiRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                cacheCheck: () => cache.workingStats.get(userIdNum),
                onload: async function (data) {
                    cache.pendingRequests.delete(apiUrl);
                    try {
                        if (data && data.hof && data.hof.working_stats && data.hof.working_stats.value !== undefined) {
                            const workingStatsValue = data.hof.working_stats.value;
                            const formattedOriginalStats = formatNumberWithCommas(workingStatsValue);
                            const result = {formattedOriginalStats, rawStatsValue: workingStatsValue};
                            resolve(result);
                        } else {
                            console.error(`Could not find working stats for User ${userId}`);
                            Ups.showToast(`Could not find working stats for User ${userId}`, "error");
                            const result = {
                                formattedOriginalStats: 'N/A',
                                rawStatsValue: CONFIG.SPECIAL_VALUES.NOT_AVAILABLE
                            };
                            resolve(result);
                        }
                    } catch (error) {
                        console.error(`Error processing working stats for User ${userId}:`, error);
                        Ups.showToast(`Error processing working stats for User ${userId}: ${error.message}`, "error");
                        const result = {
                            formattedOriginalStats: 'Error',
                            rawStatsValue: CONFIG.SPECIAL_VALUES.ERROR
                        };
                        resolve(result);
                    }
                },
                onerror: function (error) {
                    cache.pendingRequests.delete(apiUrl);
                    console.error(`Error during fetch for working stats of User ${userId}:`, error);
                    Ups.showToast(`Error fetching working stats for User ${userId}: ${error.message}`, "error");
                    const result = {
                        formattedOriginalStats: 'Error',
                        rawStatsValue: CONFIG.SPECIAL_VALUES.ERROR
                    };
                    resolve(result);
                }
            }, resolve, reject);
        });
    }

    /**
     * Fetches working stats in bulk for multiple users and caches the results.
     * More efficient than individual requests when processing many users.
     * @param {number[]} userIds - Array of user IDs to fetch
     * @returns {Promise<void>}
     */
    async function fetchBulkWorkingStats(userIds) {
        if (!userIds || userIds.length === 0) return;

        const apiUrl = `${state.apiServer}/pt-director/users/workingStats/bulk?api_key=${state.apiKey}`;
        const requestObject = {user_ids: userIds};

        return new Promise((resolve, reject) => {
            Ups.callAPI(
                apiUrl,
                'POST',
                JSON.stringify(requestObject),
                function (err, data) {
                    if (err) {
                        console.error('Bulk working stats fetch failed:', err);
                        Ups.showToast(`Bulk fetch error: ${err.message}`, "error");
                        resolve();
                        return;
                    }

                    if (data && data.data) {
                        Object.entries(data.data).forEach(([userId, statsData]) => {
                            if (statsData && statsData.hof && statsData.hof.working_stats && statsData.hof.working_stats.value !== undefined) {
                                const workingStatsValue = statsData.hof.working_stats.value;
                                const formattedOriginalStats = formatNumberWithCommas(workingStatsValue);
                                const result = {formattedOriginalStats, rawStatsValue: workingStatsValue};
                                cache.workingStats.set(parseInt(userId), result);
                            }
                        });
                    }

                    resolve();
                }
            );
        });
    }

    /**
     * Extracts all user IDs from the current page based on page type.
     * Used for bulk fetching to reduce API calls.
     * @param {('userlist'|'company'|'joblist')} pageType - Type of page to extract from
     * @returns {number[]} Array of unique user IDs found on the page
     */
    function extractAllUserIds(pageType) {
        const userIds = new Set();

        if (pageType === 'userlist') {
            // Extract from User List page
            const userLinks = document.querySelectorAll('.user-info-list-wrap > li[class^="user"] a.user.name[href*="XID="]');
            userLinks.forEach(link => {
                const match = link.href.match(/XID=(\d+)/);
                if (match && match[1]) {
                    userIds.add(parseInt(match[1]));
                }
            });
        } else if (pageType === 'company') {
            // Extract from Company page
            const userLinks = document.querySelectorAll('.employees-wrap ul.employees-list.cont-gray.bottom-round > li a.user[href*="XID="]');
            userLinks.forEach(link => {
                const match = link.href.match(/XID=(\d+)/);
                if (match && match[1]) {
                    userIds.add(parseInt(match[1]));
                }
            });
        } else if (pageType === 'joblist') {
            // Extract from Job List (director links)
            const directorLinks = document.querySelectorAll('ul.item li.director a[href*="XID="]');
            directorLinks.forEach(link => {
                const match = link.href.match(/XID=(\d+)/);
                if (match && match[1]) {
                    userIds.add(parseInt(match[1]));
                }
            });
        }

        return Array.from(userIds);
    }

    // ============================================================
    // DIRECTOR LINKS FUNCTIONS
    // ============================================================

    /**
     * Processes all director links on the job list page to display last action times.
     * Adds formatted last action information next to each director's name.
     */
    async function processDirectorLinks() {
        // Direct query without waiting - if elements aren't ready, they'll be caught by MutationObserver
        const playerLinkElements = document.querySelectorAll(CONFIG.SELECTORS.DIRECTOR_LINK);

        playerLinkElements.forEach(async playerLinkElement => {
            const lastActionSpanClass = `.${CONFIG.CSS_CLASSES.LAST_ACTION_SPAN}`;
            if (playerLinkElement.parentElement && playerLinkElement.parentElement.querySelector(lastActionSpanClass)) {
                return; // Skip if already processed
            }

            let playerId = null;
            const targetElement = playerLinkElement.parentElement;

            if (playerLinkElement.href) {
                const href = playerLinkElement.href;
                try {
                    const url = new URL(href);
                    playerId = url.searchParams.get('XID');
                } catch (e) {
                    console.error('Error parsing player link URL:', e);
                    const idMatch = href.match(/XID=(\d+)/);
                    if (idMatch && idMatch[1]) {
                        playerId = idMatch[1];
                    }
                }
            }

            if (!playerId) {
                if (targetElement) {
                    const errorElement = document.createElement('span');
                    errorElement.classList.add(CONFIG.CSS_CLASSES.LAST_ACTION_SPAN);
                    errorElement.style.marginLeft = '10px';
                    errorElement.style.color = 'orange';
                    errorElement.style.fontSize = '0.9em';
                    errorElement.style.fontWeight = 'normal';
                    errorElement.textContent = `(ID not found)`;
                    targetElement.appendChild(errorElement);
                }
                return;
            }

            // Fetch user details (will use cache from bulk fetch if available)
            fetchUserDetails(playerId).then(data => {
                // If data === undefined, request is pending/duplicate - do nothing
                if (data === undefined) {
                    return;
                }

                // Only show error for actual errors (null), not for pending duplicates
                if (data === null) {
                    if (targetElement) {
                        const errorElement = document.createElement('span');
                        errorElement.classList.add('torn-last-action-span');
                        errorElement.style.marginLeft = '10px';
                        errorElement.style.color = 'red';
                        errorElement.style.fontSize = '0.9em';
                        errorElement.style.fontWeight = 'normal';
                        errorElement.textContent = `(Fetch Error)`;
                        targetElement.appendChild(errorElement);
                    }
                    return;
                }

                try {
                    if (data && data.last_action && data.last_action.relative) {
                        let lastActionRelative = data.last_action.relative;
                        const originalLastAction = lastActionRelative;

                        // Format the last action time
                        if (lastActionRelative.includes('hours')) {
                            lastActionRelative = lastActionRelative.replace('hours', 'hrs');
                        } else if (lastActionRelative.includes('hour')) {
                            lastActionRelative = lastActionRelative.replace('hour', 'hr');
                        }
                        if (lastActionRelative.includes('minutes')) {
                            lastActionRelative = lastActionRelative.replace('minutes', 'min');
                        } else if (lastActionRelative.includes('minute')) {
                            lastActionRelative = lastActionRelative.replace('minute', 'min');
                        }

                        if (targetElement) {
                            const resultElement = document.createElement('span');
                            resultElement.classList.add('torn-last-action-span');
                            resultElement.style.marginLeft = '10px';
                            resultElement.style.fontWeight = 'normal';
                            resultElement.style.fontSize = '0.9em';
                            if (originalLastAction.includes('days')) {
                                resultElement.style.color = 'red';
                            } else {
                                resultElement.style.color = 'inherit';
                            }
                            resultElement.textContent = `(${lastActionRelative})`;
                            targetElement.appendChild(resultElement);
                        }
                    } else {
                        if (targetElement) {
                            const notFoundElement = document.createElement('span');
                            notFoundElement.classList.add('torn-last-action-span');
                            notFoundElement.style.marginLeft = '10px';
                            notFoundElement.style.color = 'gray';
                            notFoundElement.style.fontSize = '0.9em';
                            notFoundElement.style.fontWeight = 'normal';
                            notFoundElement.textContent = `(Last action not available)`;
                            targetElement.appendChild(notFoundElement);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing data for player ${playerId}:`, error);
                    if (targetElement) {
                        const errorElement = document.createElement('span');
                        errorElement.classList.add('torn-last-action-span');
                        errorElement.style.marginLeft = '10px';
                        errorElement.style.color = 'red';
                        errorElement.style.fontSize = '0.9em';
                        errorElement.style.fontWeight = 'normal';
                        errorElement.textContent = `(Parse Error)`;
                        targetElement.appendChild(errorElement);
                    }
                }
            }).catch(error => {
                console.error(`Error fetching data for player ${playerId}:`, error);
                if (targetElement) {
                    const errorElement = document.createElement('span');
                    errorElement.classList.add('torn-last-action-span');
                    errorElement.style.marginLeft = '10px';
                    errorElement.style.color = 'red';
                    errorElement.style.fontSize = '0.9em';
                    errorElement.style.fontWeight = 'normal';
                    errorElement.textContent = `(Fetch Error)`;
                    targetElement.appendChild(errorElement);
                }
            });
        });
    }

    // ============================================================
    // DISPLAY FUNCTIONS
    // ============================================================

    /**
     * Unified function to display working stats on any page type.
     * Handles userlist, company, and profile pages with appropriate styling.
     * @param {HTMLElement|null} element - The element to attach stats to (null for profile page)
     * @param {string} formattedStats - Formatted working stats string
     * @param {number} rawStatsValue - Raw working stats value
     * @param {string} userId - The user ID
     * @param {('userlist'|'company'|'profile')} pageType - Type of page being displayed
     */
    function displayStats(element, formattedStats, rawStatsValue, userId, pageType) {
        if (pageType === 'profile') {
            const targetElement = document.querySelector(CONFIG.SELECTORS.PROFILE_HEADER);
            if (!targetElement) {
                console.error(`Could not find target element for profile page`);
                return;
            }

            // Check if already displayed
            if (document.getElementById(CONFIG.CSS_IDS.PROFILE_STATS)) {
                return;
            }

            // Add contacted checkbox before the target element
            if (!targetElement.parentNode.querySelector(`.${CONFIG.CSS_CLASSES.CONTACTED_CHECKBOX}`)) {
                try {
                    const contactedCheckbox = createContactedCheckbox(userId);
                    targetElement.parentNode.insertBefore(contactedCheckbox, targetElement);
                } catch (error) {
                    handleAPIError(error, `creating checkbox for user ${userId}`, false);
                }
            }

            // Add stats display
            const statsElement = document.createElement('span');
            statsElement.id = CONFIG.CSS_IDS.PROFILE_STATS;
            statsElement.textContent = `Total Working Stats: ${formattedStats}`;
            statsElement.style.marginLeft = '10px';
            statsElement.style.fontSize = '1.8em';
            statsElement.style.fontWeight = 'bold';
            statsElement.style.color = getWorkingStatsColor(rawStatsValue);
            targetElement.parentNode.insertBefore(statsElement, targetElement.nextSibling);

        } else {
            // For userlist and company pages
            const userNameSelector = pageType === 'company'
                ? 'a.user'
                : CONFIG.SELECTORS.USER_NAME_LINK;

            const userNameLink = element.querySelector(userNameSelector);
            if (!userNameLink) return;

            const containerClass = pageType === 'company'
                ? CONFIG.CSS_CLASSES.STATS_CONTAINER_COMPANY
                : CONFIG.CSS_CLASSES.STATS_CONTAINER;

            // Check if already displayed
            let statsContainer = userNameLink.nextElementSibling;
            if (!statsContainer || !statsContainer.classList.contains(containerClass)) {
                statsContainer = createStatsContainer(userId, formattedStats, rawStatsValue, pageType);
                userNameLink.parentNode.insertBefore(statsContainer, userNameLink.nextSibling);
            } else {
                statsContainer.innerHTML = '';
                const newContainer = createStatsContainer(userId, formattedStats, rawStatsValue, pageType);
                statsContainer.innerHTML = newContainer.innerHTML;
            }

            // Store the raw stats value on the list item for filtering (userlist only)
            if (pageType === 'userlist') {
                element.dataset.workingStats = rawStatsValue;
                applyWorkingStatsFilter(element, rawStatsValue);
            }
        }
    }

    // ============================================================
    // TOOLTIP FUNCTIONS
    // ============================================================

    /**
     * Creates and appends the tooltip element to the body.
     * @returns {HTMLElement} The created tooltip element.
     */
    function createTooltip() {
        let tooltip = document.getElementById(ui.tooltipId);
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = ui.tooltipId;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#f9f9f9';
            tooltip.style.color = '#333';
            tooltip.style.border = '1px solid #ccc';
            tooltip.style.padding = '8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
            tooltip.style.zIndex = '4000';
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease-in-out';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.maxWidth = '300px';
            tooltip.style.wordWrap = 'break-word';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }

    function isTooltipVisible() {
        const tooltip = document.getElementById(ui.tooltipId);
        return tooltip && tooltip.style.visibility === 'visible' && tooltip.style.opacity !== '0';
    }

    /**
     * Shows the tooltip with the given content near the target element.
     * @param {HTMLElement} targetElement The element to position the tooltip near.
     * @param {string} content The HTML content for the tooltip.
     */
    function showTooltip(targetElement, content) {
        const tooltip = createTooltip();
        tooltip.innerHTML = content;
        ui.tooltipTarget = targetElement;

        const targetRect = targetElement.getBoundingClientRect();

        tooltip.style.top = `${targetRect.bottom + window.scrollY + 5}px`;
        let tooltipLeft = targetRect.left + window.scrollX - (tooltip.offsetWidth / 2) + (targetRect.width / 2);

        if (tooltipLeft < 5) {
            tooltipLeft = 5;
        }

        if (tooltipLeft + tooltip.offsetWidth > window.innerWidth - 5) {
            tooltipLeft = window.innerWidth - tooltip.offsetWidth - 5;
            if (tooltipLeft < 5) tooltipLeft = 5;
        }

        tooltip.style.left = `${tooltipLeft}px`;
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = 1;
    }

    /**
     * Hides the tooltip.
     */
    function hideTooltip() {
        const tooltip = document.getElementById(ui.tooltipId);
        if (tooltip) {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = 0;
        }
        ui.tooltipTarget = null;
    }

    // ============================================================
    // CONTACTED CHECKBOX FUNCTIONS
    // ============================================================

    /**
     * Creates a checkbox element for tracking contacted status.
     * @param {number|string} userId - The ID of the user
     * @returns {HTMLInputElement} The checkbox element
     */
    function createContactedCheckbox(userId) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add(CONFIG.CSS_CLASSES.CONTACTED_CHECKBOX);
        checkbox.dataset.userId = userId;

        // Load initial state from storage
        const hasBeenContacted = isContacted(userId);
        checkbox.checked = hasBeenContacted;

        // Prevent parent row/card click handlers from firing on tap
        ['click', 'touchstart'].forEach(evt =>
            checkbox.addEventListener(evt, e => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, {capture: true})
        );

        // Add event listener to save state on change
        checkbox.addEventListener('change', function () {
            const status = this.checked;
            setContacted(userId, status)
        });

        return checkbox;
    }

    // ============================================================
    // FILTERING FUNCTIONS
    // ============================================================

    /**
     * Adds filtering controls to the User List page.
     */
    function addFilteringControlsToUserListPage() {
        const filterContainerId = CONFIG.CSS_IDS.FILTER_CONTAINER;
        if (document.getElementById(filterContainerId)) {
            return; // Controls already added
        }

        const filterContainer = document.createElement('div');
        filterContainer.id = filterContainerId;
        filterContainer.style.marginBottom = '10px';
        filterContainer.style.padding = '10px';
        filterContainer.style.border = '1px solid #ccc';
        filterContainer.style.borderRadius = '4px';
        filterContainer.style.backgroundColor = '#f0f0f0';
        filterContainer.style.display = 'flex';
        filterContainer.style.alignItems = 'center';
        filterContainer.style.gap = '10px';

        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.placeholder = 'Min WS';
        minInput.id = 'min-working-stats';
        minInput.style.padding = '5px';
        minInput.style.border = '1px solid #ccc';
        minInput.style.borderRadius = '3px';
        minInput.style.width = '80px';

        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.placeholder = 'Max WS';
        maxInput.id = 'max-working-stats';
        maxInput.style.padding = '5px';
        maxInput.style.border = '1px solid #ccc';
        maxInput.style.borderRadius = '3px';
        maxInput.style.width = '80px';

        const filterButton = document.createElement('button');
        filterButton.textContent = 'Filter';
        filterButton.style.padding = '5px 10px';
        filterButton.style.backgroundColor = '#5cb85c';
        filterButton.style.color = 'white';
        filterButton.style.border = 'none';
        filterButton.style.borderRadius = '3px';
        filterButton.style.cursor = 'pointer';

        filterButton.addEventListener('click', () => {
            filters.minWorkingStats = parseInt(minInput.value, 10);
            filters.maxWorkingStats = parseInt(maxInput.value, 10);

            // If input is not a valid number, treat as null/no filter
            if (isNaN(filters.minWorkingStats)) filters.minWorkingStats = null;
            if (isNaN(filters.maxWorkingStats)) filters.maxWorkingStats = null;

            // Re-apply filter to all existing list items
            applyWorkingStatsFilterToAll();
        });

        filterContainer.appendChild(document.createTextNode('Filter Working Stats: '));
        filterContainer.appendChild(minInput);
        filterContainer.appendChild(document.createTextNode(' to '));
        filterContainer.appendChild(maxInput);
        filterContainer.appendChild(filterButton);

        // Find a suitable place to insert the filter controls
        const userListWrap = document.querySelector('.user-info-list-wrap');
        if (userListWrap) {
            userListWrap.parentNode.insertBefore(filterContainer, userListWrap);
        } else {
            const contentArea = document.querySelector('.content-wrapper');
            if (contentArea) {
                contentArea.insertBefore(filterContainer, contentArea.firstChild);
            } else {
                console.error("Could not find a suitable element to insert filter controls.");
            }
        }
    }

    /**
     * Applies the current working stats filter to a single list item.
     * @param {HTMLElement} employeeLi - The list item element
     * @param {number} rawStatsValue - The raw working stats value
     */
    function applyWorkingStatsFilter(employeeLi, rawStatsValue) {
        let shouldShow = true;

        // Only filter if min or max values are set
        if (filters.minWorkingStats !== null || filters.maxWorkingStats !== null) {
            // If stats are N/A or Error, hide them by default when filtering is active
            if (rawStatsValue < 0) {
                shouldShow = false;
            } else {
                if (filters.minWorkingStats !== null && rawStatsValue < filters.minWorkingStats) {
                    shouldShow = false;
                }
                if (filters.maxWorkingStats !== null && rawStatsValue > filters.maxWorkingStats) {
                    shouldShow = false;
                }
            }
        }

        if (shouldShow) {
            employeeLi.style.display = ''; // Show the element
        } else {
            employeeLi.style.display = 'none'; // Hide the element
        }
    }

    /**
     * Applies the current working stats filter to all list items on the User List page.
     */
    function applyWorkingStatsFilterToAll() {
        const employeeList = document.querySelectorAll(CONFIG.SELECTORS.USER_LIST_ITEM);
        employeeList.forEach(employeeRow => {
            const rawStatsValue = parseFloat(employeeRow.dataset.workingStats);
            if (!isNaN(rawStatsValue)) {
                applyWorkingStatsFilter(employeeRow, rawStatsValue);
            } else {
                // If stats weren't fetched or are not a number, hide them when filtering is active
                if (filters.minWorkingStats !== null || filters.maxWorkingStats !== null) {
                    employeeRow.style.display = 'none';
                } else {
                    employeeRow.style.display = ''; // Show if no filter is active
                }
            }
        });
    }

    // ============================================================
    // PAGE PROCESSING FUNCTIONS
    // ============================================================

    /**
     * Processes the list of employees on the User List page.
     * Fetches working stats in bulk and displays them with filtering controls.
     */
    async function processUserListPage() {
        addFilteringControlsToUserListPage();

        const allUserIds = extractAllUserIds('userlist');
        if (allUserIds.length > 0) {
            await fetchBulkWorkingStats(allUserIds);
        }

        // After bulk fetch, loop through elements and display from cache
        const employeeList = document.querySelectorAll(CONFIG.SELECTORS.USER_LIST_ITEM);
        if (employeeList.length > 0) {
            for (const employeeRow of employeeList) {
                const containerSelector = `.${CONFIG.CSS_CLASSES.STATS_CONTAINER}`;
                const checkboxSelector = `.${CONFIG.CSS_CLASSES.CONTACTED_CHECKBOX}`;

                // Check if the li element already has the stats added to prevent re-processing
                if (!employeeRow.querySelector(containerSelector) ||
                    employeeRow.dataset.workingStats === undefined ||
                    !employeeRow.querySelector(checkboxSelector)) {
                    // Check if the li element's class list contains "tt-hidden"
                    if (!Array.from(employeeRow.classList).some(className => className.includes('tt-hidden'))) {
                        const userNameLink = employeeRow.querySelector(CONFIG.SELECTORS.USER_NAME_LINK);
                        if (userNameLink && userNameLink.href) {
                            const userIdMatch = userNameLink.href.match(/XID=(\d+)/);
                            if (userIdMatch && userIdMatch[1]) {
                                const userId = userIdMatch[1];
                                const userIdNum = parseInt(userId);

                                // Get stats from cache (already populated by bulk fetch)
                                let workingStatsData = cache.workingStats.get(userIdNum);

                                // If not in cache, fetch individually (fallback)
                                if (!workingStatsData) {
                                    fetchWorkingStats(userId).then(data => {
                                        if (data) {
                                            displayStats(employeeRow, data.formattedOriginalStats, data.rawStatsValue, userId, 'userlist');
                                        } else if (data === null) {
                                            // Only show error for actual errors, not for pending duplicates (undefined)
                                            displayStats(employeeRow, 'Error', CONFIG.SPECIAL_VALUES.ERROR, userId, 'userlist');
                                        }
                                        // If data === undefined, request is pending/duplicate - do nothing
                                    });
                                } else {
                                    // Display directly from cache (instant)
                                    displayStats(
                                        employeeRow,
                                        workingStatsData.formattedOriginalStats,
                                        workingStatsData.rawStatsValue,
                                        userId,
                                        'userlist'
                                    );
                                }
                            }
                        }
                    }
                } else {
                    // If stats and checkbox were already added, just re-apply the filter
                    const rawStatsValue = parseFloat(employeeRow.dataset.workingStats);
                    if (!isNaN(rawStatsValue)) {
                        applyWorkingStatsFilter(employeeRow, rawStatsValue);
                    } else {
                        // Re-apply filter for rows that might have had N/A or Error previously
                        if (filters.minWorkingStats !== null || filters.maxWorkingStats !== null) {
                            employeeRow.style.display = 'none';
                        } else {
                            employeeRow.style.display = '';
                        }
                    }
                }
            }
        }
    }

    /**
     * Processes the list of employees on the Company page.
     * Fetches working stats in bulk and displays them.
     */
    async function processCompanyPage() {
        // Extract all user IDs and fetch bulk data first
        const allUserIds = extractAllUserIds('company');
        if (allUserIds.length > 0) {
            await fetchBulkWorkingStats(allUserIds);
        }

        const employeeList = document.querySelectorAll(CONFIG.SELECTORS.EMPLOYEES_LIST);
        if (employeeList.length > 0) {
            for (const employeeRow of employeeList) {
                const containerSelector = `.${CONFIG.CSS_CLASSES.STATS_CONTAINER_COMPANY}`;
                const checkboxSelector = `.${CONFIG.CSS_CLASSES.CONTACTED_CHECKBOX}`;

                if (!employeeRow.querySelector(containerSelector) ||
                    !employeeRow.querySelector(checkboxSelector)) {

                    const userLink = employeeRow.querySelector(CONFIG.SELECTORS.EMPLOYEE_LINK);
                    if (userLink && userLink.href) {
                        const userIdMatch = userLink.href.match(/XID=(\d+)/);
                        if (userIdMatch && userIdMatch[1]) {
                            const userId = userIdMatch[1];
                            const userIdNum = parseInt(userId);

                            // Get stats from cache (already populated by bulk fetch)
                            let workingStatsData = cache.workingStats.get(userIdNum);

                            // If not in cache, fetch individually (fallback)
                            if (!workingStatsData) {
                                fetchWorkingStats(userId).then(data => {
                                    if (data) {
                                        displayStats(employeeRow, data.formattedOriginalStats, data.rawStatsValue, userId, 'company');
                                    } else if (data === null) {
                                        // Only show error for actual errors, not for pending duplicates (undefined)
                                        displayStats(employeeRow, 'Error', CONFIG.SPECIAL_VALUES.ERROR, userId, 'company');
                                    }
                                    // If data === undefined, request is pending/duplicate - do nothing
                                });
                            } else {
                                // Display directly from cache (instant)
                                displayStats(
                                    employeeRow,
                                    workingStatsData.formattedOriginalStats,
                                    workingStatsData.rawStatsValue,
                                    userId,
                                    'company'
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Processes the Profile page to display working stats and a contacted checkbox.
     */
    async function processProfilePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');
        if (userId) {
            const targetElement = document.querySelector(CONFIG.SELECTORS.PROFILE_HEADER);

            if (targetElement) {
                // Fetch and display working stats
                const workingStatsData = await fetchWorkingStats(userId);
                if (workingStatsData) {
                    displayStats(
                        null,
                        workingStatsData.formattedOriginalStats,
                        workingStatsData.rawStatsValue,
                        userId,
                        'profile'
                    );
                } else {
                    displayStats(
                        null,
                        'Error',
                        CONFIG.SPECIAL_VALUES.ERROR,
                        userId,
                        'profile'
                    );
                }
            } else {
                console.error(`Could not find the target HTML element for profile page`);
            }
        } else {
            console.error("Could not extract User ID from the profile URL.");
        }
    }

    // --- Main Page Handler and Observer ---

    // Debounce tracking for handlePageChange
    let lastHandlePageChangeCall = 0;
    const HANDLE_PAGE_CHANGE_DEBOUNCE_MS = 100;

    /**
     * Dispatches to the correct processing function based on the current URL.
     */
    function handlePageChange() {
        // Debounce: ignore calls that happen too quickly
        const now = Date.now();
        if (now - lastHandlePageChangeCall < HANDLE_PAGE_CHANGE_DEBOUNCE_MS) {
            return;
        }
        lastHandlePageChangeCall = now;

        const currentUrl = window.location.href;

        if (currentUrl.startsWith("https://www.torn.com/page.php?sid=UserList")) {
            if (state.routesEnabled.userList) {
                processUserListPage();
            }
        } else if (currentUrl.startsWith("https://www.torn.com/joblist.php")) {
            if (state.routesEnabled.jobList) {
                if (currentUrl.includes('corpinfo')) {
                    processCompanyPage();
                } else if (currentUrl.includes('corp')) {
                    processDirectorLinks();
                }
            }
        } else if (currentUrl.startsWith("https://www.torn.com/profiles.php?XID=")) {
            if (state.routesEnabled.profiles) {
                processProfilePage();
            }
        }
    }

    /**
     * MutationObserver callback to handle dynamic content loading.
     */
    function onDomChange(mutationList) {
        const currentUrl = window.location.href;

        let relevantMutationDetected = false;
        for (const mutation of mutationList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (currentUrl.startsWith("https://www.torn.com/page.php?sid=UserList")) {
                            if (node.matches('.user-info-list-wrap') ||
                                node.querySelector('.user-info-list-wrap') ||
                                node.matches('.user-info-list-wrap > li[class^="user"]')) {
                                relevantMutationDetected = true;
                                break;
                            }
                        } else if (currentUrl.startsWith("https://www.torn.com/joblist.php")) {
                            if (node.matches('.employees-wrap') ||
                                node.querySelector('.employees-wrap') ||
                                node.matches('.employees-wrap ul.employees-list > li')) {
                                relevantMutationDetected = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (relevantMutationDetected) break;
        }

        if (relevantMutationDetected) {
            setTimeout(handlePageChange, 100);
        }
    }

    function loadCSS() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
        /* General styles for inline stats container */
        /* Using !important to ensure styles override Torn's default styles if necessary */
        .working-stats-container, .working-stats-container-company, #working-stats-profile-display {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            vertical-align: middle !important;
        }

        /* Styles specific to the User List page (.user-info-list-wrap) */
        .working-stats-container {
            margin-left: 10px !important; /* Spacing after the user name */
        }
        .working-stats-inline {
            font-size: 11px !important; /* Smaller font size as in the original script */
            font-weight: bold !important;
            /* Color is applied inline by the script based on value */
        }

        /* Styles specific to the Company page (.employees-wrap) */
        .working-stats-container-company {
            margin-left: 5px !important; /* Spacing after the user name */
        }
        .working-stats-inline-company {
            margin-left: 1px !important; /* Small space after icon */
            font-size: 1em !important; /* Standard font size */
            font-weight: bold !important; /* Make it bold for better visibility */
            /* Color is applied inline by the script based on value */
        }

        /* Styles for the info icon (used on User List and Company pages) */
        .working-stats-icon {
            display: inline-block !important; /* Ensure icon is inline */
            margin-right: 1px !important; /* Small space between icon and stats */
            font-size: 10px !important; /* Small icon size */
            cursor: pointer !important; /* Indicate it's interactive */
            color: #888; /* Grey color for the info icon */
            vertical-align: middle !important; /* Align with text */
            position: relative !important; /* Allow z-index to apply */
            z-index: 2001 !important; /* Keep info icon tappable above parent */
        }

        /* Styles specific to the Profile page */
        #working-stats-profile-display {
            margin-left: 10px !important; /* Spacing after the target header */
			font-size: 1.8em!important; /* Larger font size as requested */
            font-weight: bold !important;
            /* Color is applied inline by the script based on value */
        }

		        /* Tooltip styles (used on User List and Company pages) */
        #${CONFIG.CSS_IDS.TOOLTIP} {
            position: absolute; /* Position relative to the viewport */
            background-color: #f9f9f9; /* Light grey background */
            color: #333; /* Dark text color */
            border: 1px solid #ccc; /* Light grey border */
            padding: 8px; /* Padding inside the tooltip */
            border-radius: 4px; /* Rounded corners */
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow */
            z-index: 4000; /* Ensure it's above checkboxes/info icons */
            visibility: hidden; /* Hidden by default */
            opacity: 0; /* Fully transparent by default */
            transition: opacity 0.2s ease-in-out; /* Smooth fade transition */
            pointer-events: none; /* Allow mouse events to pass through to elements behind the tooltip */
            max-width: 300px; /* Limit tooltip width */
            word-wrap: break-word; /* Prevent long text from overflowing */
        }

        /* Styles for the filtering controls */
        #working-stats-filter-container {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            gap: 10px; /* Space between filter elements */
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
        }

        #working-stats-filter-container input[type="number"] {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            width: 80px; /* Fixed width for input fields */
        }

         #working-stats-filter-container button {
            padding: 5px 10px;
            background-color: #5cb85c;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s ease; /* Smooth transition on hover */
        }

        #working-stats-filter-container button:hover {
            background-color: #4cae4c; /* Darker green on hover */
        }

        /* Style for the contacted checkbox */
        .contacted-checkbox {
            margin-right: 5px !important; /* Space between checkbox and username */
            vertical-align: middle !important; /* Align with text */
            position: relative !important; /* Allow z-index to apply */
            z-index: 2001 !important; /* Keep checkbox tappable above parent */
        }`
        document.head.appendChild(styleElement);
    }


    function initializeExecution() {
        // Add the hashchange event listener for director links
        window.addEventListener('hashchange', () => {
            clearQueue();

            const container = document.querySelector('.joblist-wrap, .content-wrapper');
            if (!container) {
                console.warn('[PT-Director] No joblist container found yet, waiting...');
                setTimeout(() => handlePageChange(), 500);
                return;
            }

            let settleTimer = null;
            let maxTimer = null;
            let observerInstance = null;
            const startTime = Date.now();

            const executeHandlePageChange = () => {
                if (settleTimer) clearTimeout(settleTimer);
                if (maxTimer) clearTimeout(maxTimer);
                if (observerInstance) observerInstance.disconnect();
                //console.log('[PT-Director] DOM settled after navigation, reprocessing...');
                handlePageChange();
            };

            observerInstance = new MutationObserver(() => {
                if (settleTimer) clearTimeout(settleTimer);

                settleTimer = setTimeout(executeHandlePageChange, 200);
            });

            observerInstance.observe(container, {childList: true, subtree: true});

            maxTimer = setTimeout(() => {
                //console.log('[PT-Director] Max timeout reached, forcing execution...');
                executeHandlePageChange();
            }, 2000);
        });

        window.addEventListener('popstate', () => {
            hideTooltip();
            clearQueue();
            setTimeout(handlePageChange, CONFIG.TIMINGS.HASH_CHANGE_DELAY);
        });

        // Observe changes to the DOM to handle dynamically loaded content
        ui.observer = new MutationObserver(onDomChange);
        ui.observer.observe(document.body, {childList: true, subtree: true});

        // Initial processing on page load
        setTimeout(handlePageChange, CONFIG.TIMINGS.PAGE_LOAD_DELAY);
        loadCSS();
    }

    async function initialize() {
        try {
            // Migrate storage keys if needed (fixes cache/cache-time collision)
            migrateStorageKeys();

            state.apiKey = await getApiKey();
            if (!state.apiKey) return;
            state.apiServer = await getServerAddress();
            if (!state.apiServer) return;
            state.expirationDays = await getCachingTime();
            if (!state.expirationDays) return;
            state.routesEnabled = GM_getValue(CONFIG.STORAGE_KEYS.ROUTES, {userList: true, jobList: true, profiles: true});

            initializeExecution();
        } catch (error) {
            console.error('Initialization error:', error);
            if (error.message.includes('faction is not authorized')) {
                Ups.showToast('Your faction is not authorized to use PT-Director. Contact the script author for access.', 'error');
            } else if (error.message.includes('API key')) {
                Ups.showToast('Invalid API key. Please refresh the page and enter a valid key.', 'error');
            } else {
                Ups.showToast('Error initializing PT-Director. Please try again later.', 'error');
            }
        }
    }

    initialize();
})();
