// ==UserScript==
// @name         HiveHQ Faction CPR Tracker
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Tracks CPR data for organized crimes by intercepting Fetch requests and sending them to HiveHQ, compatible with TornPDA and PC
// @author       Antish [1877236]
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      hivehq.org
// @downloadURL https://update.greasyfork.org/scripts/556119/HiveHQ%20Faction%20CPR%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/556119/HiveHQ%20Faction%20CPR%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const HIVEHQ_API_KEY = "#############"; // Hardcoded for TornPDA. Set this to your HiveHQ API key.

    class HiveHQCprTracker {
        _VERSION = "1.3.0";
        _EXTENSION_NAME = "HiveHQ CPR Tracker";
        _HIVEHQ_API_ENDPOINT = "https://www.hivehq.org/hive/external/api/v1/cpr/store";
        _INTERCEPT_TARGET_URL = "page.php?sid=organizedCrimesData&step=crimeList";
        _STORAGE_PREFIX = "HiveHQFactionCPRTracker_";
        _STORAGE_KEYS = {
            apiKey: "HiveHQFactionCPRTracker_ApiKey",
            lastUpdatedAt: "HiveHQFactionCPRTracker_LastUpdatedAt",
            cprData: "HiveHQFactionCPRTracker_CheckpointPassRates",
        };

        _STALE_DATA = 3 * 24 * 60 * 60; // Consider data over 3 days as stale
        _REQUEST_LIMITER = 60; // Limit requests to once per minute

        _DURATIONS = {
            week: 7 * 24 * 60 * 60,
            day: 24 * 60 * 60,
            hour: 60 * 60,
            minute: 60,
        };

        _settings = {
            hardcodedApiKey: "#############",
            isTornPDA: false,
            dashboardClasses: {
                container: "HiveHQCprTracker",
                apiKey: "HiveHQCprTracker_ApiKey",
                lastSentData: "HiveHQCprTracker_LastSentData",
            }
        };

        _dashboard = {
            /**
             * Internal HiveHQCprTracker Object
             * @type {HiveHQCprTracker}
             */
            _hhqCprTracker: null,
            classes: {
                injectableClass: "content-title m-bottom10",
                container: "HiveHQCprTracker",
                title: "HiveHQCprTracker_Title",
                fieldHeaders: "HiveHQCprTracker_FieldHeaders",
                apiKey: "HiveHQCprTracker_ApiKey",
                apiKeyManipulation: "HiveHQCprTracker_ApiKeyManipulation",
                lastSentData: "HiveHQCprTracker_LastSentData",
                status: "HiveHQCprTracker_Status",
            },
            elements: {
                injectableContainer: null,
                container: null,
                apiKey: null,
                apiKeyManipulation: null,
                lastSentData: null,
                status: null,
            },
            intervalFunction: null,
            init: function (hhqCprTracker) {
                this._hhqCprTracker = hhqCprTracker;

                // Get Injectable Container
                this.elements.injectableContainer = document.getElementsByClassName(this.classes.injectableClass)[0];

                // Create Dashboard
                if (document.getElementsByClassName(this.classes.container).length === 0) {
                    this.createDashboard();
                }

                // Initialise other elements
                this.elements.container = document.getElementsByClassName(this.classes.container)[0];
                this.elements.apiKey = document.getElementsByClassName(this.classes.apiKey)[0];
                this.elements.apiKeyManipulation = document.getElementsByClassName(this.classes.apiKeyManipulation)[0];
                this.elements.lastSentData = document.getElementsByClassName(this.classes.lastSentData)[0];
                this.elements.status = document.getElementsByClassName(this.classes.status)[0];

                const dashboard = this;

                // API key handling
                this.elements.apiKeyManipulation.onclick = function () {
                    let apiKey = hhqCprTracker._getAPIKey();

                    // If a key doesn't already exist, prompt and store the key
                    if (!apiKey) {
                        const newApiKey = prompt('Please enter your Torn API key that you use with HiveHQ:');
                        if (!newApiKey) {
                            hhqCprTracker._displayAlert("API key is required for functionality.");
                            return;
                        }
                        if (newApiKey.length !== 16) {
                            hhqCprTracker._displayAlert("Invalid API key provided!");
                            return;
                        }
                        hhqCprTracker._setStorageValue(hhqCprTracker._STORAGE_KEYS.apiKey, newApiKey);
                        dashboard.updateDashboard();
                        hhqCprTracker._displayAlert("Successfully added API Key.");
                        return;
                    }

                    // At this point, a key already exists. We can update/delete it.
                    const newApiKey = prompt('Please enter your updated Torn API key that you use with HiveHQ (or leave it empty to delete from this script):');
                    if (!newApiKey || newApiKey.length === 0) {
                        hhqCprTracker._deleteStorageValue(hhqCprTracker._STORAGE_KEYS.apiKey);
                        dashboard.updateDashboard();
                        hhqCprTracker._displayAlert("API key has been successfully removed.");
                        return;
                    }
                    if (newApiKey.length !== 16) {
                        hhqCprTracker._displayAlert("Invalid API key provided!");
                        return;
                    }
                    hhqCprTracker._setStorageValue(hhqCprTracker._STORAGE_KEYS.apiKey, newApiKey);
                    dashboard.updateDashboard();
                    hhqCprTracker._displayAlert("Successfully updated API Key.");
                };

                // Initial update of dashboard
                this.updateDashboard();

                window.setInterval(this.updateDashboard.bind(this), 60);
            },
            createDashboard: function () {
                let dashboard = document.createElement("div");
                dashboard.className = this.classes.container;
                dashboard.innerHTML = `
                <span class="${this.classes.title}">HiveHQ CPR Tracker v${this._hhqCprTracker._VERSION}</span>
                <br/>
                <span class="${this.classes.fieldHeaders}">API Key: </span><span class="${this.classes.apiKey}"></span><span> - </span><span class="${this.classes.apiKeyManipulation}"></span>
                <br/>
                <span class="${this.classes.fieldHeaders}">Last sent data: </span><span class="${this.classes.lastSentData}"></span>
                <br/>
                <span class="${this.classes.fieldHeaders}">Status: </span><span class="${this.classes.status}">-</span>
                <br/>
                <span class="${this.classes.fieldHeaders}">In order to send updated CPR Data to HiveHQ, first go to the crimes tab and then on the recruiting sub-tab.</span>
                `;

                // Add styling
                const styling = document.createElement('style');
                styling.type = "text/css";
                styling.innerHTML = `
                .${this.classes.container} {
                    background: #14213d !important;
                    border: 5px solid #fca311;
                    padding: 5px;
                    line-height: 20px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                }

                .${this.classes.title} {
                    text-align: center;
                    width: 100% !important;
                    display: block;
                    font-size: 25px;
                    color: #fca311;
                }

                .${this.classes.fieldHeaders} {
                    color: #fca311;
                }

                .${this.classes.apiKey} {
                    color: #c1b631;
                }

                .${this.classes.apiKeyManipulation} {
                    color: #14213d;
                    background: #82c91e;
                    padding: 2px 9px;
                    border-radius: 9px;
                    cursor: pointer;
                }

                `;
                this.elements.injectableContainer.prepend(dashboard);
                this.elements.injectableContainer.prepend(styling);
            },
            updateDashboard: function () {
                let apiKey = this._hhqCprTracker._getAPIKey();
                if (apiKey) {
                    let anonymisedApiKey = "************" + apiKey.slice(12);
                    this.updateApiKeyText(anonymisedApiKey);
                    this.updateApiKeyManipulationText("Click here to update/delete your API Key");
                } else {
                    this.updateApiKeyText("Not set");
                    this.updateApiKeyManipulationText("Click here to set an API Key");
                }

                const currentTimestamp = this._hhqCprTracker.getCurrentTimestamp();
                let lastUpdatedAt = this._hhqCprTracker._getStorageValue(this._hhqCprTracker._STORAGE_KEYS.lastUpdatedAt, null);
                let lastSentDataText = "Never (Please send new updated data by following the instructions below)";

                if (lastUpdatedAt) {
                    let secondsSinceUpdate = currentTimestamp - lastUpdatedAt;
                    const staleData = secondsSinceUpdate > this._hhqCprTracker._STALE_DATA;

                    let timeDisplay = {
                        days: null,
                        hours: null,
                        minutes: null,
                        seconds: null,
                        textBuilder: [],
                        text: "Now",
                    };
                    timeDisplay.days = Math.floor(secondsSinceUpdate / this._hhqCprTracker._DURATIONS.day);
                    secondsSinceUpdate -= timeDisplay.days * this._hhqCprTracker._DURATIONS.day;
                    timeDisplay.hours = Math.floor(secondsSinceUpdate / this._hhqCprTracker._DURATIONS.hour);
                    secondsSinceUpdate -= timeDisplay.hours * this._hhqCprTracker._DURATIONS.hour;
                    timeDisplay.minutes = Math.floor(secondsSinceUpdate / this._hhqCprTracker._DURATIONS.minute);
                    secondsSinceUpdate -= timeDisplay.minutes * this._hhqCprTracker._DURATIONS.minute;
                    timeDisplay.seconds = secondsSinceUpdate;

                    timeDisplay.days > 0 ? timeDisplay.textBuilder.push(`${timeDisplay.days} day(s)`) : null;
                    timeDisplay.hours > 0 ? timeDisplay.textBuilder.push(`${timeDisplay.hours} hour(s)`) : null;
                    timeDisplay.minutes > 0 ? timeDisplay.textBuilder.push(`${timeDisplay.minutes} minute(s)`) : null;
                    timeDisplay.seconds > 0 ? timeDisplay.textBuilder.push(`${timeDisplay.seconds} second(s)`) : null;

                    if (timeDisplay.textBuilder.length > 0) {
                        timeDisplay.text = `${timeDisplay.textBuilder.join(", ")} ago`;
                    }

                    if (staleData) {
                        timeDisplay.text += " - Stale data, please send new updated data by following the instructions below.";
                    }

                    lastSentDataText = timeDisplay.text;
                }

                this.updateLastSentDataText(lastSentDataText);
            },
            updateApiKeyText: function (text) {
                this.elements.apiKey.textContent = text;
            },
            updateApiKeyManipulationText: function (text) {
                this.elements.apiKeyManipulation.textContent = text;
            },
            updateLastSentDataText: function (text) {
                this.elements.lastSentData.textContent = text;
            },
            updateStatus: function (text) {
                this.elements.status.textContent = text;
            }
        };

        constructor(hardcodedApiKey) {
            this._settings.hardcodedApiKey = hardcodedApiKey;
            this._settings.isTornPDA = typeof window.flutter_inappwebview !== 'undefined';

            // Define the getter/setter/deleter functions for the local data storage.
            this._getStorageValue = this._settings.isTornPDA
                ? (key, defaultValue) => JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
                : GM_getValue;
            this._setStorageValue = this._settings.isTornPDA
                ? (key, value) => localStorage.setItem(key, JSON.stringify(value))
                : GM_setValue;
            this._deleteStorageValue = this._settings.isTornPDA
                ? (key) => localStorage.removeItem(key)
                : GM_deleteValue;

            // Define HTTP request function
            this._xmlhttpRequest = this._settings.isTornPDA
                ? (details) => {
                    window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
                        .then(response => {
                            details.onload({
                                status: response.status,
                                responseText: response.data
                            });
                        })
                        .catch(err => details.onerror(err));
                }
                : GM_xmlhttpRequest;

            this._performMaintenance();

            // Initialise Dashboard
            this._dashboard.init(this);

            // Configure interception of requests
            this._interceptFetchRequests();

        }

        _getStorageValue(key, defaultValue) {
            // Defined later on based on TornPDA or not
            return null;
        };

        _setStorageValue(key, value) {
            // Defined later on based on TornPDA or not
            return null;
        }

        _deleteStorageValue(key) {
            // Defined later on based on TornPDA or not
            return null;
        }

        _xmlhttpRequest(details) {
            // Defined later on based on TornPDA or not
            return null;
        }

        _getAPIKey() {
            let storedApiKey = this._getStorageValue(this._STORAGE_KEYS.apiKey, null);
            if (!storedApiKey) {
                return (this._settings.hardcodedApiKey === "#############") ? null : this._settings.hardcodedApiKey;
            }
            return storedApiKey;
        }

        _performMaintenance() {
            // 1.1.2 to 1.2.0
            // API Key
            let oldAPIKey = this._getStorageValue("HiveHQFactionCPRTracker_api_key", null);
            if (oldAPIKey) {
                this._setStorageValue(this._STORAGE_KEYS.apiKey, oldAPIKey);
                this._deleteStorageValue("HiveHQFactionCPRTracker_api_key");
            }

            // RequestRateLimiter
            this._deleteStorageValue("HiveHQFactionCPRTracker_RequestsRateLimiter");
        }

        _interceptFetchRequests() {
            const self = this;

            const win = this._settings.isTornPDA
                ? window
                : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);

            const originalFetch = win.fetch;

            win.fetch = async function (resource, config) {
                const url = typeof resource === 'string' ? resource : resource.url;
                if (config?.method?.toUpperCase() !== 'POST' || !url.includes(self._INTERCEPT_TARGET_URL)) {
                    return originalFetch.apply(this, arguments);
                }

                let isRecruitingGroup = false;
                if (config?.body instanceof FormData) {
                    isRecruitingGroup = config.body.get('group') === 'Recruiting';
                } else if (config?.body) {
                    isRecruitingGroup = config.body.toString().includes('group=Recruiting');
                }

                if (!isRecruitingGroup) {
                    return originalFetch.apply(this, arguments);
                }

                const response = await originalFetch.apply(this, arguments);
                try {
                    const json = JSON.parse(await response.clone().text());
                    if (json.success && json.data && json.data.length > 1) {
                        // Empty CPR Data
                        self._setStorageValue(self._STORAGE_KEYS.cprData, {});
                        json.data.forEach(self._processCPRs.bind({_hhqCprTracker: self}));
                        const apiKey = self._getAPIKey();
                        if (apiKey) {
                            await self._submitCPRData(
                                apiKey,
                                self._getStorageValue(self._STORAGE_KEYS.cprData, {})
                            );
                        }
                    }
                } catch (err) {
                    const errorMessage = "Torn Error: Ignore this error, and it should resolve itself when torn works as usual again.";
                    self._dashboard.updateStatus(errorMessage)
                    console.error('Torn Error: processing response:', err);
                }
                return response;
            };
        }

        _processCPRs(data) {

            /**
             * Internal HiveHQCprTracker Object
             * @type {HiveHQCprTracker}
             */
            const hhqCprTracker = this._hhqCprTracker;
            const scenarioName = String(data.scenario.name).toUpperCase();
            let checkpointPassRates = hhqCprTracker._getStorageValue(hhqCprTracker._STORAGE_KEYS.cprData, {});

            // Get the number of empty slots
            const totalPlayerSlots = data.playerSlots.length;
            let emptySlots = 0;
            data.playerSlots.forEach(slot => {
                if (slot.player === null) {
                    emptySlots++;
                }
            });

            // 1. Create CPR for scenario if it doesn't already exist
            if (!checkpointPassRates[scenarioName]) {
                checkpointPassRates[scenarioName] = {
                    "updatedAt": hhqCprTracker.getCurrentTimestamp(),
                    "roles": {}
                };
            }

            data.playerSlots.forEach(slot => {
                if (slot.player !== null) {
                    return;
                }
                const slotName = String(slot.name).split(" #")[0];
                checkpointPassRates[scenarioName]["roles"][slotName] = slot.successChance;
            });

            hhqCprTracker._setStorageValue(hhqCprTracker._STORAGE_KEYS.cprData, checkpointPassRates);
        }

        async _submitCPRData(apiKey, checkpointPassRates) {
            // If CPR data is empty, don't send data.
            if (Object.values(checkpointPassRates).length < 1) {
                const statusMessage = "Not sending data - Empty CPR Dataset";
                this._dashboard.updateStatus(statusMessage)
                console.log(statusMessage);
                return;
            }

            // Limits requests to once a minute.
            const currentTimestamp = this.getCurrentTimestamp();
            const lastUpdate = this._getStorageValue(this._STORAGE_KEYS.lastUpdatedAt, 0);
            const timeLeftForNextRequest = currentTimestamp - lastUpdate;
            if (timeLeftForNextRequest < this._REQUEST_LIMITER) {
                const statusMessage = `Not sending data - Rate limited - Try again in ${timeLeftForNextRequest} seconds.`;
                this._dashboard.updateStatus(statusMessage)
                console.log(statusMessage);
                return;
            }

            this._setStorageValue(this._STORAGE_KEYS.lastUpdatedAt, currentTimestamp);
            console.log({cprData: checkpointPassRates});
            return new Promise((resolve, reject) => {
                this._xmlhttpRequest({
                    method: 'POST',
                    url: this._HIVEHQ_API_ENDPOINT,
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify({
                        cprData: checkpointPassRates,
                        hash: apiKey,
                        version: this._VERSION,
                    }),
                    dataType: "json",
                    onload: (response) => {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            console.log('Response JSON:', jsonResponse);

                            //jsonResponse = {
                            // status: 1, // boolean - true - 1 , false - 0
                            // message: "XX", // Message to display
                            // }

                            if (jsonResponse.status === -1) {
                                // Server Error and Outdated Script error
                                this._dashboard.updateStatus(jsonResponse.message)
                                console.warn(jsonResponse.message);
                                return;
                            }

                            if (jsonResponse.status === -2) {
                                const errorMessage = "An invalid API Key was provided. " +
                                    "Please set your API key here to the same one that you use on HiveHQ."
                                this._displayAlert(errorMessage)
                                this._dashboard.updateStatus(errorMessage)

                                console.warn(jsonResponse.message);
                                console.warn('Clearing stored key...');

                                // Clear the stored key
                                this._deleteStorageValue(this._STORAGE_KEYS.apiKey);

                                reject(new Error('Invalid API key. Informed user to update API Key.'));
                                return;
                            }

                            if (jsonResponse.status === -3) {
                                const errorMessage = "Your API key isn't recognised on HiveHQ. " +
                                    "Please set your API key here to the same one that you use on HiveHQ."
                                this._displayAlert(errorMessage)
                                this._dashboard.updateStatus(errorMessage)

                                console.warn(jsonResponse.message);
                                console.warn('Unknown user - Not registered on HiveHQ');

                                // Clear the stored key
                                this._deleteStorageValue(this._STORAGE_KEYS.apiKey);

                                reject(new Error('Error authenticating with HiveHQ. Informed user to update API Key.'));
                                return;
                            }

                            if (jsonResponse.status === -4) {
                                const errorMessage = "Script Error. Contact author of script.";
                                this._displayAlert(errorMessage);
                                this._dashboard.updateStatus(errorMessage);

                                console.warn(jsonResponse.message);
                                console.warn(errorMessage);
                                return;
                            }
                        } catch (e) {
                            console.error('Could not parse JSON:', e);
                        }
                        if (response.status >= 200 && response.status < 300) {
                            const successMessage = "CPR data submitted successfully";
                            this._dashboard.updateStatus(successMessage);
                            console.log(successMessage);
                            resolve();
                        } else {
                            const errorMessage = "Error establishing connection to HiveHQ. Contact author of script.";
                            this._dashboard.updateStatus(errorMessage);
                            console.error(errorMessage, response.status, response.responseText);
                            reject(new Error(errorMessage));
                        }
                    },
                    onerror: (err) => {
                        const errorMessage = "Error submitting data to HiveHQ. Contact author of script.";
                        this._dashboard.updateStatus(errorMessage);
                        console.error(errorMessage, err);
                        reject(err);
                    }
                });
            });
        }

        _displayAlert(alertText) {
            alert(`${this._EXTENSION_NAME}: ${alertText}`);
        }

        getCurrentTimestamp = function () {
            return Math.floor(Date.now() / 1000);
        }
    }

    new HiveHQCprTracker(HIVEHQ_API_KEY);
})();
