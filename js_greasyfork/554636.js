// ==UserScript==
// @name         Torn Hospital Timer
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Displays hospital timers with live countdown
// @author       Zer0CooL / Copilot /Claude
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554636/Torn%20Hospital%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/554636/Torn%20Hospital%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Don't activate on your own faction page
    if (window.location.href.includes('factions.php?step=your')) {
        console.log('Hospital Timer: Skipping activation on own faction page');
        return;
    }

    let apiKey = localStorage.getItem("tornApiKey") || prompt("Enter your Torn API Key:");
    if (apiKey) {
        localStorage.setItem("tornApiKey", apiKey);
    } else {
        alert("API Key is required to fetch hospital data.");
        return;
    }

    // Default filter settings - show all statuses
    const defaultFilters = {
        // Online status filters
        online: true,
        idle: true,
        offline: true,

        // Player state filters
        okay: true,
        hospital: true,
        jail: true,
        abroad: true,
        traveling: true,

        // Last action time filter
        lastActionFilter: {
            enabled: false,
            minutes: 30,
            showBelow: true // true = show players with last action LESS than the specified time
        }
    };

    // Load filters from localStorage or use defaults
    let filters = {};
    function loadFilters() {
        const savedFilters = localStorage.getItem("tornHospitalTimerFilters");
        if (savedFilters) {
            try {
                filters = JSON.parse(savedFilters);
                // Ensure all default properties exist (for backward compatibility)
                filters = { ...defaultFilters, ...filters };
                if (filters.lastActionFilter) {
                    filters.lastActionFilter = { ...defaultFilters.lastActionFilter, ...filters.lastActionFilter };
                }
            } catch (e) {
                console.error("Error loading saved filters:", e);
                filters = { ...defaultFilters };
            }
        } else {
            filters = { ...defaultFilters };
        }
    }

    function saveFilters() {
        localStorage.setItem("tornHospitalTimerFilters", JSON.stringify(filters));
    }

    function resetFilters() {
        filters = { ...defaultFilters };
        filters.lastActionFilter = { ...defaultFilters.lastActionFilter };
        saveFilters();
        updateFilterUI();
        applyFilters();
    }

    function resetSortSettings() {
        currentSort = { column: null, direction: 'asc' };
        saveSortSettings();
        // Update header classes
        const sortHeaders = document.querySelectorAll('.sortable');
        sortHeaders.forEach(h => {
            h.classList.remove('asc', 'desc');
        });
    }

    function updateFilterUI() {
        // Update online status checkboxes
        const onlineStatuses = ["online", "idle", "offline"];
        onlineStatuses.forEach(status => {
            const checkbox = document.querySelector(`input[data-status="${status}"]`);
            if (checkbox) {
                checkbox.checked = filters[status];
            }
        });

        // Update player state checkboxes
        const playerStates = ["okay", "hospital", "jail", "abroad", "traveling"];
        playerStates.forEach(state => {
            const checkbox = document.querySelector(`input[data-state="${state}"]`);
            if (checkbox) {
                checkbox.checked = filters[state];
            }
        });

        // Update last action filter controls
        const enableCheckbox = document.querySelector('#lastActionEnable');
        if (enableCheckbox) {
            enableCheckbox.checked = filters.lastActionFilter.enabled;
        }

        const timeInput = document.querySelector('#lastActionMinutes');
        if (timeInput) {
            timeInput.value = filters.lastActionFilter.minutes;
        }

        const belowRadio = document.querySelector('#lastActionBelow');
        if (belowRadio) {
            belowRadio.checked = filters.lastActionFilter.showBelow;
        }

        const aboveRadio = document.querySelector('#lastActionAbove');
        if (aboveRadio) {
            aboveRadio.checked = !filters.lastActionFilter.showBelow;
        }
    }

    // Initialize filters on script load
    loadFilters();

    // Column sorting - load from localStorage
    let currentSort = {
        column: null,
        direction: 'asc'
    };

    function loadSortSettings() {
        const savedSort = localStorage.getItem("tornHospitalTimerSort");
        if (savedSort) {
            try {
                currentSort = JSON.parse(savedSort);
            } catch (e) {
                console.error("Error loading saved sort settings:", e);
                currentSort = { column: null, direction: 'asc' };
            }
        }
    }

    function saveSortSettings() {
        localStorage.setItem("tornHospitalTimerSort", JSON.stringify(currentSort));
    }

    // Load sort settings on script load
    loadSortSettings();

    // Global interval variables
    let updateInterval;
    let countdownInterval;
    let lastActionInterval;
    let lastApiTimestamp = null; // Track the last API timestamp

    function extractFactionID() {
        // Don't extract ID from own faction page
        if (window.location.href.includes('step=your')) {
            return null;
        }
        const match = window.location.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    }

    function getStatusIndicator(status) {
        const statusColors = {
            "Online": "green",
            "Idle": "orange",
            "Offline": "grey"
        };
        return statusColors[status] || "black";
    }

    function getStateColor(state) {
        const stateColors = {
            "Okay": "#4CAF50",
            "Hospital": "#FF5722",
            "Jail": "#9C27B0",
            "Abroad": "#2196F3",
            "Traveling": "#03A9F4"
        };
        return stateColors[state] || "#FFC107";
    }

    function createUI() {
        // Add clipboard copy helper style
        GM_addStyle(`
            .copy-icon {
                cursor: pointer;
                color: #ff4444;
                font-size: 16px;
            }
            .copy-icon:hover {
                color: #ffffff;
            }
            .attack-icon {
                cursor: pointer;
                color: #ff4444;
                font-size: 16px;
                text-decoration: none;
            }
            .attack-icon:hover {
                color: #ffffff;
            }
            .profile-icon {
                cursor: pointer;
                color: #4CAF50;
                font-size: 16px;
                text-decoration: none;
            }
            .profile-icon:hover {
                color: #ffffff;
            }
            .sortable {
                cursor: pointer;
                user-select: none;
            }
            .sortable:hover {
                background-color: #333;
            }
            .sortable::after {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                margin-left: 5px;
            }
            .sortable.asc::after {
                content: '▲';
                font-size: 10px;
            }
            .sortable.desc::after {
                content: '▼';
                font-size: 10px;
            }
            .tooltip {
                position: absolute;
                background: #333;
                color: white;
                padding: 5px;
                border-radius: 3px;
                font-size: 12px;
                z-index: 1003;
                display: none;
            }
            .api-key-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #2a2a2a;
                color: #ff4444;
                border: 1px solid #ff4444;
                border-radius: 3px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
                z-index: 1003;
            }
            .api-key-button:hover {
                background: #3a3a3a;
            }
            .reset-filters-button {
                position: absolute;
                top: 40px;
                right: 10px;
                background: #2a2a2a;
                color: #4CAF50;
                border: 1px solid #4CAF50;
                border-radius: 3px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
                z-index: 1003;
            }
            .reset-filters-button:hover {
                background: #3a3a3a;
                color: #ffffff;
            }
            .api-info-button {
                position: absolute;
                top: 10px;
                right: 130px;
                background: #2a2a2a;
                color: #4CAF50;
                border: 1px solid #4CAF50;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                z-index: 1003;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .api-info-button:hover {
                background: #3a3a3a;
                color: white;
            }
            .api-info-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .api-info-content {
                background: #1e1e1e;
                border: 2px solid #ff4444;
                border-radius: 5px;
                padding: 20px;
                max-width: 90%;
                max-height: 90%;
                overflow-y: auto;
                color: white;
            }
            .api-info-content h3 {
                color: #ff4444;
                margin-top: 0;
                text-align: center;
            }
        `);

        const button = document.createElement("button");
        button.textContent = "Hospital Timers";
        Object.assign(button.style, {
            position: "fixed", top: "10px", right: "10px", zIndex: "1000",
            padding: "10px", background: "#ff4444", color: "#fff",
            border: "none", cursor: "pointer", borderRadius: "5px", fontSize: "14px"
        });
        document.body.appendChild(button);

        const popup = document.createElement("div");
        popup.id = "hospitalPopup";
        Object.assign(popup.style, {
            position: "fixed", top: "50px", right: "10px", width: "620px", height: "450px",
            background: "#1e1e1e", color: "#fff", border: "2px solid #ff4444",
            padding: "10px", display: "none", overflowY: "auto", zIndex: "1001"
        });
        document.body.appendChild(popup);

        // Create API key update button
        const apiKeyButton = document.createElement("button");
        apiKeyButton.textContent = "Update API Key";
        apiKeyButton.className = "api-key-button";
        apiKeyButton.addEventListener("click", () => {
            const newApiKey = prompt("Enter your new Torn API Key:", "");
            if (newApiKey) {
                localStorage.setItem("tornApiKey", newApiKey);
                apiKey = newApiKey;
                // Reset timestamp to force fresh data with new API key
                lastApiTimestamp = null;
                fetchHospitalData(); // Refresh data with new API key
                alert("API Key updated successfully!");
            }
        });
        popup.appendChild(apiKeyButton);

        // Create reset filters button
        const resetFiltersButton = document.createElement("button");
        resetFiltersButton.textContent = "Reset Filters";
        resetFiltersButton.className = "reset-filters-button";
        resetFiltersButton.addEventListener("click", () => {
            if (confirm("Reset all filters and sorting to default settings?")) {
                resetFilters();
                resetSortSettings();
                sortTable(); // Re-sort with default settings
            }
        });
        popup.appendChild(resetFiltersButton);

        // Create API info button
        const apiInfoButton = document.createElement("button");
        apiInfoButton.textContent = "?";
        apiInfoButton.className = "api-info-button";
        apiInfoButton.addEventListener("click", () => {
            const infoPopup = document.createElement("div");
            infoPopup.className = "api-info-popup";
            infoPopup.innerHTML = `
                <div class="api-info-content">
                    <h3>API Key Usage Information</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0; color: white;">
                        <tr style="background-color: #333;">
                            <th style="border: 1px solid #555; padding: 8px;">Data Storage</th>
                            <th style="border: 1px solid #555; padding: 8px;">Data Sharing</th>
                            <th style="border: 1px solid #555; padding: 8px;">Purpose of Use</th>
                            <th style="border: 1px solid #555; padding: 8px;">Key Storage & Sharing</th>
                            <th style="border: 1px solid #555; padding: 8px;">Key Access Level</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #555; padding: 8px;">Will the data be stored for any purpose?</td>
                            <td style="border: 1px solid #555; padding: 8px;">Who can access the data besides the end user?</td>
                            <td style="border: 1px solid #555; padding: 8px;">What is the stored data being used for?</td>
                            <td style="border: 1px solid #555; padding: 8px;">Will the API key be stored securely and who can access it?</td>
                            <td style="border: 1px solid #555; padding: 8px;">What key access level or specific selections are required?</td>
                        </tr>
                        <tr style="background-color: #2a2a2a;">
                            <td style="border: 1px solid #555; padding: 8px; color: #ff6b6b;">Only locally</td>
                            <td style="border: 1px solid #555; padding: 8px; color: #ff6b6b;">Nobody</td>
                            <td style="border: 1px solid #555; padding: 8px; color: #ff6b6b;">Not eligible - only end user has access</td>
                            <td style="border: 1px solid #555; padding: 8px; color: #ff6b6b;">Stored locally / Not shared</td>
                            <td style="border: 1px solid #555; padding: 8px; color: #ff6b6b;">Public Only</td>
                        </tr>
                    </table>
                    <p style="margin: 10px 0; color: #ccc;">
                        <strong>Privacy Notice:</strong> Your API key is stored only in your browser's local storage and is never transmitted to any external servers except directly to Torn's official API.
                        This script only accesses public faction member data to display hospital timers and player status information.
                    </p>
                    <button class="close-info-btn" style="background: #ff4444; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 3px; margin-top: 10px;">Close</button>
                </div>
            `;

            document.body.appendChild(infoPopup);

            // Close button functionality
            infoPopup.querySelector('.close-info-btn').addEventListener('click', () => {
                document.body.removeChild(infoPopup);
            });

            // Close on background click
            infoPopup.addEventListener('click', (e) => {
                if (e.target === infoPopup) {
                    document.body.removeChild(infoPopup);
                }
            });
        });
        popup.appendChild(apiInfoButton);

        // Create tooltip div for copy notification
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        document.body.appendChild(tooltip);

        // Create online status filter options
        const onlineFilterContainer = document.createElement("div");
        onlineFilterContainer.style.marginBottom = "10px";
        onlineFilterContainer.style.display = "flex";
        onlineFilterContainer.style.flexDirection = "column";
        onlineFilterContainer.style.padding = "5px";
        onlineFilterContainer.style.background = "#2a2a2a";
        onlineFilterContainer.style.borderRadius = "5px";
        onlineFilterContainer.style.position = "absolute";
        onlineFilterContainer.style.top = "10px";
        onlineFilterContainer.style.left = "10px";
        onlineFilterContainer.style.zIndex = "1002";

        // Create online status filter checkboxes
        const onlineStatuses = ["Online", "Idle", "Offline"];
        onlineStatuses.forEach(status => {
            const label = document.createElement("label");
            label.style.marginBottom = "5px";
            label.style.display = "flex";
            label.style.alignItems = "center";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = filters[status.toLowerCase()];
            checkbox.dataset.status = status.toLowerCase();
            checkbox.style.marginRight = "5px";

            const statusDot = document.createElement("span");
            statusDot.style.width = "10px";
            statusDot.style.height = "10px";
            statusDot.style.borderRadius = "50%";
            statusDot.style.display = "inline-block";
            statusDot.style.marginRight = "5px";
            statusDot.style.backgroundColor = getStatusIndicator(status);

            label.appendChild(checkbox);
            label.appendChild(statusDot);
            label.appendChild(document.createTextNode(status));

            checkbox.addEventListener("change", function() {
                filters[status.toLowerCase()] = this.checked;
                saveFilters();
                applyFilters();
            });

            onlineFilterContainer.appendChild(label);
        });

        // Create player state filter options
        const stateFilterContainer = document.createElement("div");
        stateFilterContainer.style.marginBottom = "10px";
        stateFilterContainer.style.display = "flex";
        stateFilterContainer.style.flexDirection = "column";
        stateFilterContainer.style.padding = "5px";
        stateFilterContainer.style.background = "#2a2a2a";
        stateFilterContainer.style.borderRadius = "5px";
        stateFilterContainer.style.position = "absolute";
        stateFilterContainer.style.top = "10px";
        stateFilterContainer.style.left = "130px"; // Positioned at the center column
        stateFilterContainer.style.zIndex = "1002";

        // Create player state filter checkboxes
        const playerStates = ["Okay", "Hospital", "Jail", "Abroad", "Traveling"];
        playerStates.forEach(state => {
            const label = document.createElement("label");
            label.style.marginBottom = "5px";
            label.style.display = "flex";
            label.style.alignItems = "center";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = filters[state.toLowerCase()];
            checkbox.dataset.state = state.toLowerCase();
            checkbox.style.marginRight = "5px";

            const stateDot = document.createElement("span");
            stateDot.style.width = "10px";
            stateDot.style.height = "10px";
            stateDot.style.borderRadius = "50%";
            stateDot.style.display = "inline-block";
            stateDot.style.marginRight = "5px";
            stateDot.style.backgroundColor = getStateColor(state);

            label.appendChild(checkbox);
            label.appendChild(stateDot);
            label.appendChild(document.createTextNode(state));

            checkbox.addEventListener("change", function() {
                filters[state.toLowerCase()] = this.checked;
                saveFilters();
                applyFilters();
            });

            stateFilterContainer.appendChild(label);
        });

        // Create last action time filter container
        const timeFilterContainer = document.createElement("div");
        timeFilterContainer.style.marginBottom = "10px";
        timeFilterContainer.style.display = "flex";
        timeFilterContainer.style.flexDirection = "column";
        timeFilterContainer.style.padding = "5px";
        timeFilterContainer.style.background = "#2a2a2a";
        timeFilterContainer.style.borderRadius = "5px";
        timeFilterContainer.style.position = "absolute";
        timeFilterContainer.style.top = "10px";
        timeFilterContainer.style.left = "250px"; // Positioned at the right column
        timeFilterContainer.style.zIndex = "1002";

        // Create time filter label
        const timeFilterTitle = document.createElement("div");
        timeFilterTitle.textContent = "Last Action Filter";
        timeFilterTitle.style.marginBottom = "5px";
        timeFilterTitle.style.fontWeight = "bold";
        timeFilterTitle.style.color = "#ff4444";
        timeFilterContainer.appendChild(timeFilterTitle);

        // Create enable checkbox
        const enableContainer = document.createElement("div");
        enableContainer.style.display = "flex";
        enableContainer.style.alignItems = "center";
        enableContainer.style.marginBottom = "5px";

        const enableCheckbox = document.createElement("input");
        enableCheckbox.type = "checkbox";
        enableCheckbox.id = "lastActionEnable";
        enableCheckbox.checked = filters.lastActionFilter.enabled;
        enableCheckbox.style.marginRight = "5px";

        enableCheckbox.addEventListener("change", function() {
            filters.lastActionFilter.enabled = this.checked;
            saveFilters();
            applyFilters();
        });

        enableContainer.appendChild(enableCheckbox);
        enableContainer.appendChild(document.createTextNode("Enable"));
        timeFilterContainer.appendChild(enableContainer);

        // Create time input
        const timeInputContainer = document.createElement("div");
        timeInputContainer.style.display = "flex";
        timeInputContainer.style.alignItems = "center";
        timeInputContainer.style.marginBottom = "5px";

        const timeInput = document.createElement("input");
        timeInput.type = "number";
        timeInput.id = "lastActionMinutes";
        timeInput.min = "1";
        timeInput.max = "1440"; // 24 hours in minutes
        timeInput.value = filters.lastActionFilter.minutes;
        timeInput.style.width = "50px";
        timeInput.style.marginRight = "5px";
        timeInput.style.background = "#3a3a3a";
        timeInput.style.color = "#fff";
        timeInput.style.border = "1px solid #555";

        timeInput.addEventListener("change", function() {
            filters.lastActionFilter.minutes = parseInt(this.value) || 30;
            saveFilters();
            applyFilters();
        });

        timeInputContainer.appendChild(timeInput);
        timeInputContainer.appendChild(document.createTextNode("minutes"));
        timeFilterContainer.appendChild(timeInputContainer);

        // Create above/below selector
        const aboveBelowContainer = document.createElement("div");
        aboveBelowContainer.style.display = "flex";
        aboveBelowContainer.style.flexDirection = "column";

        const belowLabel = document.createElement("label");
        belowLabel.style.display = "flex";
        belowLabel.style.alignItems = "center";
        belowLabel.style.marginBottom = "5px";

        const belowRadio = document.createElement("input");
        belowRadio.type = "radio";
        belowRadio.id = "lastActionBelow";
        belowRadio.name = "aboveBelow";
        belowRadio.checked = filters.lastActionFilter.showBelow;
        belowRadio.style.marginRight = "5px";

        belowRadio.addEventListener("change", function() {
            if (this.checked) {
                filters.lastActionFilter.showBelow = true;
                saveFilters();
                applyFilters();
            }
        });

        belowLabel.appendChild(belowRadio);
        belowLabel.appendChild(document.createTextNode("< Less than"));

        const aboveLabel = document.createElement("label");
        aboveLabel.style.display = "flex";
        aboveLabel.style.alignItems = "center";

        const aboveRadio = document.createElement("input");
        aboveRadio.type = "radio";
        aboveRadio.id = "lastActionAbove";
        aboveRadio.name = "aboveBelow";
        aboveRadio.checked = !filters.lastActionFilter.showBelow;
        aboveRadio.style.marginRight = "5px";

        aboveRadio.addEventListener("change", function() {
            if (this.checked) {
                filters.lastActionFilter.showBelow = false;
                saveFilters();
                applyFilters();
            }
        });

        aboveLabel.appendChild(aboveRadio);
        aboveLabel.appendChild(document.createTextNode("> More than"));

        aboveBelowContainer.appendChild(belowLabel);
        aboveBelowContainer.appendChild(aboveLabel);
        timeFilterContainer.appendChild(aboveBelowContainer);

        popup.appendChild(onlineFilterContainer);
        popup.appendChild(stateFilterContainer);
        popup.appendChild(timeFilterContainer);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "120px"; // Increased margin to make space for both filter sets
        popup.appendChild(table);

        const tableHeader = document.createElement("tr");
        tableHeader.innerHTML = `
            <th class="sortable" data-sort="attack" style="border-bottom: 2px solid #ff4444; padding: 3px; color: #ff4444; width: 30px; min-width: 30px;">⚔️</th>
            <th class="sortable" data-sort="name" style="border-bottom: 2px solid #ff4444; padding: 5px; color: #ff4444;">Player</th>
            <th class="sortable" data-sort="copy" style="border-bottom: 2px solid #ff4444; padding: 3px; color: #ff4444; width: 30px; min-width: 30px;">✂️</th>
            <th class="sortable" data-sort="level" style="border-bottom: 2px solid #ff4444; padding: 5px; color: #ff4444;">Lvl</th>
            <th class="sortable" data-sort="time" style="border-bottom: 2px solid #ff4444; padding: 5px; color: #ff4444;">Time Left</th>
            <th class="sortable" data-sort="status" style="border-bottom: 2px solid #ff4444; padding: 5px; color: #ff4444;">Status</th>
            <th class="sortable" data-sort="action" style="border-bottom: 2px solid #ff4444; padding: 5px; color: #ff4444;">Last Action</th>
        `;
        table.appendChild(tableHeader);

        // Add event listeners for sorting
        const sortHeaders = tableHeader.querySelectorAll('.sortable');
        sortHeaders.forEach(header => {
            // Apply saved sort indicator on load
            if (currentSort.column === header.dataset.sort) {
                header.classList.add(currentSort.direction);
            }

            header.addEventListener('click', function() {
                const column = this.dataset.sort;

                // Toggle sort direction or set to asc if new column
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = column;
                    currentSort.direction = 'asc';
                }

                // Save the sort settings
                saveSortSettings();

                // Update header classes
                sortHeaders.forEach(h => {
                    h.classList.remove('asc', 'desc');
                });
                this.classList.add(currentSort.direction);

                // Re-sort the table
                sortTable();
            });
        });

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        Object.assign(closeButton.style, {
            marginTop: "10px", background: "#ff4444", color: "#fff",
            border: "none", padding: "5px", cursor: "pointer"
        });
        popup.appendChild(closeButton);

        closeButton.addEventListener("click", () => {
            popup.style.display = "none";
            clearAllIntervals();
            // Reset timestamp tracking when closing
            lastApiTimestamp = null;
        });

        button.addEventListener("click", () => {
            if (popup.style.display === "none" || !popup.style.display) {
                popup.style.display = "block";
                // Reset timestamp tracking when opening
                lastApiTimestamp = null;
                fetchHospitalData();
                // Start API update interval (every 5 seconds)
                updateInterval = setInterval(fetchHospitalData, 5000);
                // Start countdown timers (every 1 second)
                startTimers();
            } else {
                popup.style.display = "none";
                clearAllIntervals();
                // Reset timestamp tracking when closing
                lastApiTimestamp = null;
            }
        });
    }

    function clearAllIntervals() {
        if (updateInterval) clearInterval(updateInterval);
        if (countdownInterval) clearInterval(countdownInterval);
        if (lastActionInterval) clearInterval(lastActionInterval);
        // Reset interval variables
        updateInterval = null;
        countdownInterval = null;
        lastActionInterval = null;
    }

    function startTimers() {
        // Clear any existing countdown/action intervals first (but not the update interval)
        if (countdownInterval) clearInterval(countdownInterval);
        if (lastActionInterval) clearInterval(lastActionInterval);

        // Start countdown timer
        countdownInterval = setInterval(() => {
            document.querySelectorAll(".hospital-time").forEach(cell => {
                let timeLeft = parseInt(cell.getAttribute("data-timeleft"));
                if (timeLeft > 0) {
                    timeLeft--;
                    cell.textContent = formatTime(timeLeft);
                    cell.setAttribute("data-timeleft", timeLeft);
                } else {
                    cell.textContent = "0";
                }
            });
        }, 1000);

        // Start last action timer
        lastActionInterval = setInterval(() => {
            document.querySelectorAll(".last-action-time").forEach(cell => {
                let timeElapsed = parseInt(cell.getAttribute("data-lastaction"));
                timeElapsed++; // Increase per second
                cell.textContent = formatTime(timeElapsed);
                cell.setAttribute("data-lastaction", timeElapsed);
            });
        }, 1000);
    }

    function copyToClipboard(text, event) {
        navigator.clipboard.writeText(text).then(() => {
            // Show tooltip
            const tooltip = document.querySelector('.tooltip');
            tooltip.style.display = 'block';
            tooltip.textContent = 'Player info copied!';
            tooltip.style.left = (event.clientX + 10) + 'px';
            tooltip.style.top = (event.clientY - 10) + 'px';

            // Hide tooltip after 1.5 seconds
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 1500);
        });
    }

    function fetchHospitalData() {
        const factionID = extractFactionID();
        if (!factionID) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/${factionID}?selections=basic,timestamp&key=${apiKey}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    console.error("Error fetching Torn API:", data.error);
                    return;
                }

                // Only update if we got new data (different timestamp)
                if (lastApiTimestamp === null || data.timestamp !== lastApiTimestamp) {
                    console.log("Updating with fresh API data, timestamp:", data.timestamp);
                    lastApiTimestamp = data.timestamp;
                    updatePopup(data.members, data.timestamp);
                } else {
                    console.log("API returned cached data, skipping update. Timestamp:", data.timestamp);
                }
            }
        });
    }

    function updatePopup(members, apiTimestamp) {
        const table = document.querySelector("#hospitalPopup table");
        // Keep the header row
        const headerRow = table.querySelector('tr');
        table.innerHTML = '';
        table.appendChild(headerRow);

        const players = Object.entries(members).map(([id, player]) => {
            const color = getStatusIndicator(player.last_action.status);
            const onlineStatus = player.last_action.status;

            let timeLeft = 0;
            let timerType = "0";
            let playerStatus = player.status.state;
            let lastActionAgo = apiTimestamp - player.last_action.timestamp;

            if (player.status.state === "Hospital") {
                timeLeft = Math.max(0, player.status.until - apiTimestamp);
                timerType = timeLeft > 0 ? formatTime(timeLeft) : "Out of Hospital";
            } else if (player.status.state === "Jail") {
                timeLeft = Math.max(0, player.status.until - apiTimestamp);
                timerType = timeLeft > 0 ? formatTime(timeLeft) : "Released from Jail";
            }

            // Only show destination for Traveling and Abroad
            if (player.status.state === "Traveling" || player.status.state === "Abroad") {
                playerStatus = player.status.description || "Unknown destination";
            }

            // Normalize the status state to handle "Okay" state
            let playerState = player.status.state;
            if (player.status.state === "") {
                playerState = "Okay";
            }

            return {
                id,
                player,
                color,
                timeLeft,
                timerType,
                playerStatus,
                lastActionAgo,
                onlineStatus,
                playerState,
                level: player.level || 0, // Add level
                name: player.name
            };
        });

        players.forEach(({ id, player, color, timeLeft, timerType, playerStatus, lastActionAgo, onlineStatus, playerState, level, name }) => {
            const attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
            const profileLink = `https://www.torn.com/profiles.php?XID=${id}`;

            // Create the extended copy text with player info
            const timeLeftText = player.status.state === "Hospital" || player.status.state === "Jail" ? timerType : "N/A";
            const copyText = `${name} - Status: ${playerStatus} - Time Left: ${timeLeftText} - Last Action: ${formatTime(lastActionAgo)} ago - ${attackLink}`;

            const row = document.createElement("tr");
            row.className = "player-row";
            row.dataset.status = onlineStatus.toLowerCase();
            row.dataset.state = playerState.toLowerCase();
            row.dataset.name = name.toLowerCase();
            row.dataset.level = level;
            row.dataset.timeleft = timeLeft;
            row.dataset.lastaction = lastActionAgo;

            row.innerHTML = `
                <td style="padding: 3px; text-align: center; width: 30px;">
                    <a href="${attackLink}" target="_blank" class="attack-icon">⚔️</a>
                </td>
                <td style="padding: 5px; text-align: center; display: flex; align-items: center;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; display: inline-block; margin-right: 5px;"></span>
                    <a href="${profileLink}" target="_blank" style="color: white; text-decoration: none;">${name}</a>
                </td>
                <td style="padding: 3px; text-align: center; width: 30px;">
                    <span class="copy-icon" data-copytext="${copyText.replace(/"/g, '&quot;')}">✂️</span>
                </td>
                <td style="padding: 5px; text-align: center; color: ${color};">
                    ${level}
                </td>
                <td style="padding: 5px; text-align: center; color: ${color};" class="hospital-time" data-timeleft="${timeLeft}">
                    ${player.status.state === "Hospital" || player.status.state === "Jail" ? timerType : "0"}
                </td>
                <td style="padding: 5px; text-align: center; color: ${color};">
                    ${playerStatus}
                </td>
                <td style="padding: 5px; text-align: center; color: ${color};" class="last-action-time" data-lastaction="${lastActionAgo}">
                    ${formatTime(lastActionAgo)}
                </td>
            `;
            table.appendChild(row);
        });

        // Add event listeners to copy icons
        document.querySelectorAll('.copy-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const copyText = e.target.dataset.copytext;
                copyToClipboard(copyText, e);
                e.stopPropagation();
            });
        });

        sortTable(); // Sort based on current sort settings
        applyFilters();
    }

    function sortTable() {
        if (!currentSort.column) return;

        const table = document.querySelector("#hospitalPopup table");
        const rows = Array.from(table.querySelectorAll(".player-row"));

        // Get the header to keep it as the first row
        const headerRow = table.querySelector('tr:not(.player-row)');

        // Sort the rows
        rows.sort((a, b) => {
            let valA, valB;

            switch(currentSort.column) {
                case 'copy':
                    // Sort by ID might be more useful here
                    valA = a.querySelector('.copy-icon').dataset.link;
                    valB = b.querySelector('.copy-icon').dataset.link;
                    break;
                case 'name':
                    valA = a.dataset.name;
                    valB = b.dataset.name;
                    break;
                case 'level':
                    valA = parseInt(a.dataset.level);
                    valB = parseInt(b.dataset.level);
                    break;
                case 'time':
                    valA = parseInt(a.dataset.timeleft);
                    valB = parseInt(b.dataset.timeleft);
                    break;
                case 'status':
                    valA = a.dataset.state;
                    valB = b.dataset.state;
                    break;
                case 'action':
                    valA = parseInt(a.dataset.lastaction);
                    valB = b.dataset.lastaction;
                    break;
                default:
                    return 0;
            }

            // Compare values
            let comparison = 0;
            if (valA > valB) {
                comparison = 1;
            } else if (valA < valB) {
                comparison = -1;
            }

            // Reverse if descending order
            return currentSort.direction === 'desc' ? comparison * -1 : comparison;
        });

        // Clear the table and re-add rows in the new order
        table.innerHTML = '';
        table.appendChild(headerRow);
        rows.forEach(row => table.appendChild(row));

        // Reapply filters after sorting
        applyFilters();
    }

    function applyFilters() {
        const rows = document.querySelectorAll(".player-row");
        rows.forEach(row => {
            const onlineStatus = row.dataset.status;
            const playerState = row.dataset.state;
            const lastActionSeconds = parseInt(row.querySelector(".last-action-time").dataset.lastaction) || 0;
            const lastActionMinutes = Math.floor(lastActionSeconds / 60);

            // Check online status and player state filters
            let showRow = filters[onlineStatus] && filters[playerState];

            // Apply last action time filter if enabled
            if (showRow && filters.lastActionFilter.enabled) {
                const filterMinutes = filters.lastActionFilter.minutes;

                if (filters.lastActionFilter.showBelow) {
                    // Show players with last action LESS than the specified time
                    showRow = lastActionMinutes < filterMinutes;
                } else {
                    // Show players with last action MORE than the specified time
                    showRow = lastActionMinutes > filterMinutes;
                }
            }

            row.style.display = showRow ? "table-row" : "none";
        });
    }

    function formatTime(seconds) {
        if (seconds <= 0) return "0";

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const sec = seconds % 60;

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m ${sec}s`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${sec}s`;
        } else {
            return `${minutes}m ${sec}s`;
        }
    }

    createUI();
})();