// ==UserScript==
// @name         Umalator Global Skill Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Whitelist skills for the Umalator Global skill chart with fuzzy search and toggle menu
// @author       deli-almendra
// @match        https://alpha123.github.io/uma-tools/umalator-global/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549892/Umalator%20Global%20Skill%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/549892/Umalator%20Global%20Skill%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Declare whitelist in the outer scope
    let whitelist = {};
    let whitelistEnabled = true;

    // Fuzzy search function
    function fuzzyMatch(pattern, str) {
        pattern = pattern.toLowerCase();
        str = str.toLowerCase();
        let patternIndex = 0;

        for (let i = 0; i < str.length; i++) {
            if (patternIndex < pattern.length && str[i] === pattern[patternIndex]) {
                patternIndex++;
            }
        }

        return patternIndex === pattern.length;
    }

    // Wait for the app to load
    function waitForApp() {
        if (document.querySelector('.basinnChartWrapper')) {
            initSkillWhitelist();
        } else {
            setTimeout(waitForApp, 500);
        }
    }

    // Initialize the skill whitelist functionality
    function initSkillWhitelist() {
        // Load whitelist from localStorage
        whitelist = JSON.parse(localStorage.getItem('umalator-whitelist') || '{}');
        whitelistEnabled = JSON.parse(localStorage.getItem('umalator-whitelist-enabled') || 'true');

        // Create the toggle button
        createToggleButton();

        // Create the side panel
        createSidePanel();

        // Add keyboard listener for P key
        document.addEventListener('keydown', function(e) {
            // Only trigger on P key press, and not when typing in input fields
            if ((e.key === 'p' || e.key === 'P') &&
                e.target.tagName !== 'INPUT' &&
                e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                togglePanel();
            }
        });

        // Apply whitelist to the chart
        applyWhitelist();

        // Update the side panel
        updateSidePanel();
    }

    // Toggle the panel visibility
    function togglePanel() {
        const panel = document.getElementById('skill-whitelist-panel');
        if (panel) {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        }
    }

    // Toggle whitelist mode
    function toggleWhitelistMode() {
        whitelistEnabled = !whitelistEnabled;
        localStorage.setItem('umalator-whitelist-enabled', JSON.stringify(whitelistEnabled));
        applyWhitelist();
        updateSidePanel();
    }

    // Apply whitelist to the chart
    function applyWhitelist() {
        const rows = document.querySelectorAll('.basinnChart tbody tr');
        rows.forEach(row => {
            const skillId = row.dataset.skillid;
            // If whitelist mode is enabled, hide skills not in whitelist
            if (whitelistEnabled && !whitelist[skillId]) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });
    }

    // Search for skills to add to whitelist (with fuzzy search)
    function searchSkills(query) {
        if (!query) return [];

        const allRows = document.querySelectorAll('.basinnChart tbody tr');
        const results = [];

        allRows.forEach(row => {
            const skillId = row.dataset.skillid;
            const skillNameElement = row.querySelector('.chartSkillName span');
            const skillName = skillNameElement ? skillNameElement.textContent : '';

            if (fuzzyMatch(query, skillName) && !whitelist[skillId]) {
                results.push({id: skillId, name: skillName});
            }
        });

        // Sort results by how well they match
        return results.sort((a, b) => {
            // Exact matches first
            if (a.name.toLowerCase() === query.toLowerCase()) return -1;
            if (b.name.toLowerCase() === query.toLowerCase()) return 1;

            // Then prefix matches
            if (a.name.toLowerCase().startsWith(query.toLowerCase())) return -1;
            if (b.name.toLowerCase().startsWith(query.toLowerCase())) return 1;

            // Then fuzzy match quality
            return a.name.toLowerCase().indexOf(query.toLowerCase()) - b.name.toLowerCase().indexOf(query.toLowerCase());
        });
    }

    // Add skill to whitelist
    function addSkillToWhitelist(skillId, skillName) {
        whitelist[skillId] = skillName;
        localStorage.setItem('umalator-whitelist', JSON.stringify(whitelist));
        applyWhitelist();
        updateSidePanel();
    }

    // Remove skill from whitelist
    function removeSkillFromWhitelist(skillId) {
        delete whitelist[skillId];
        localStorage.setItem('umalator-whitelist', JSON.stringify(whitelist));
        applyWhitelist();
        updateSidePanel();
    }

    // Create the toggle button
    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'whitelist-toggle-button';
        toggleButton.innerHTML = '📋';
        toggleButton.title = 'Toggle Whitelist Panel (P)';
        document.body.appendChild(toggleButton);

        // Add CSS styles for toggle button
        const style = document.createElement('style');
        style.textContent = `
            #whitelist-toggle-button {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #4CAF50;
                color: white;
                border: none;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #whitelist-toggle-button:hover {
                background: #45a049;
            }
        `;
        document.head.appendChild(style);

        // Add event listener for toggle button
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            togglePanel();
        });
    }

    // Create the side panel
    function createSidePanel() {
        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'skill-whitelist-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Skill Whitelist</h3>
                <button id="toggle-whitelist-mode">Disable Whitelist</button>
                <button id="close-panel">×</button>
            </div>
            <div class="search-container">
                <input type="text" id="skill-search" placeholder="Fuzzy search skills...">
                <div id="search-results"></div>
            </div>
            <div class="whitelist-container">
                <h4>Whitelisted Skills</h4>
                <ul id="whitelist-skills-list"></ul>
            </div>
        `;
        document.body.appendChild(panel);

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            #skill-whitelist-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 15px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: sans-serif;
                max-height: 90vh;
                overflow-y: auto;
                display: none;
            }

            #skill-whitelist-panel .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            #skill-whitelist-panel h3 {
                margin: 0;
                font-size: 16px;
            }

            #toggle-whitelist-mode {
                background: #ff9800;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
            }

            #toggle-whitelist-mode.enabled {
                background: #4CAF50;
            }

            #close-panel {
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #skill-whitelist-panel .search-container {
                margin-bottom: 15px;
            }

            #skill-search {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 3px;
                box-sizing: border-box;
            }

            #search-results {
                max-height: 150px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-top: none;
                display: none;
            }

            .search-result-item {
                padding: 8px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            }

            .search-result-item:hover {
                background: #e9e9e9;
            }

            .search-result-item:last-child {
                border-bottom: none;
            }

            #skill-whitelist-panel .whitelist-container h4 {
                margin: 10px 0 5px 0;
                font-size: 14px;
            }

            #whitelist-skills-list {
                list-style: none;
                padding: 0;
                margin: 0;
                max-height: 300px;
                overflow-y: auto;
            }

            #whitelist-skills-list li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 5px;
                border-bottom: 1px solid #eee;
            }

            #whitelist-skills-list li:last-child {
                border-bottom: none;
            }

            .remove-skill-btn {
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 8px;
                cursor: pointer;
                font-size: 11px;
            }

            .remove-skill-btn:hover {
                background: #cc0000;
            }
        `;
        document.head.appendChild(style);

        // Add event listener for toggle button
        document.getElementById('toggle-whitelist-mode').addEventListener('click', function() {
            toggleWhitelistMode();
        });

        // Add event listener for close button
        document.getElementById('close-panel').addEventListener('click', function() {
            document.getElementById('skill-whitelist-panel').style.display = 'none';
        });

        // Add event listener for search input
        document.getElementById('skill-search').addEventListener('input', function(e) {
            const query = e.target.value;
            const searchResults = document.getElementById('search-results');

            if (query.length > 0) {
                const results = searchSkills(query);
                if (results.length > 0) {
                    searchResults.innerHTML = '';
                    results.forEach(skill => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = skill.name;
                        div.addEventListener('click', function() {
                            addSkillToWhitelist(skill.id, skill.name);
                            document.getElementById('skill-search').value = '';
                            searchResults.style.display = 'none';
                        });
                        searchResults.appendChild(div);
                    });
                    searchResults.style.display = 'block';
                } else {
                    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                    searchResults.style.display = 'block';
                }
            } else {
                searchResults.style.display = 'none';
            }
        });
    }

    // Update the side panel with current whitelist
    function updateSidePanel() {
        // Update toggle button text and class
        const toggleButton = document.getElementById('toggle-whitelist-mode');
        if (toggleButton) {
            toggleButton.textContent = whitelistEnabled ? 'Disable Whitelist' : 'Enable Whitelist';
            if (whitelistEnabled) {
                toggleButton.classList.add('enabled');
            } else {
                toggleButton.classList.remove('enabled');
            }
        }

        // Update whitelist skills list
        const list = document.getElementById('whitelist-skills-list');
        if (!list) return;

        list.innerHTML = '';

        if (Object.keys(whitelist).length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No skills in whitelist';
            li.style.fontStyle = 'italic';
            li.style.color = '#888';
            list.appendChild(li);
        } else {
            for (const [skillId, skillName] of Object.entries(whitelist)) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${skillName}</span>
                    <button class="remove-skill-btn" data-skill-id="${skillId}">Remove</button>
                `;
                list.appendChild(li);
            }

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-skill-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const skillId = this.dataset.skillId;
                    removeSkillFromWhitelist(skillId);
                });
            });
        }
    }

    // Start the script
    waitForApp();
})();