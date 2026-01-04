// ==UserScript==
// @name         Pornolab Advanced Filtering
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Advanced filtering for Pornolab, you can hide rows based on title containing  keywords, you can highlight rows containing keywords, you can hide rows based on minimum number of seeds, can disable all filters manually. All filters keywords and settings are saved in browser local storage.
// @author       me
// @match        https://pornolab.net/forum/tracker.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554621/Pornolab%20Advanced%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/554621/Pornolab%20Advanced%20Filtering.meta.js
// ==/UserScript==

(function() {

    // Define an array of filter words that will be hidden
    const filterWords = [];

    // Define an object for highlight words and colors
    const highlightWordsWithColors = {};

    let filterToggleState = false;


    // Function to save highlight words and their associated color to local storage
    function saveHighlightWords() {
        const highlightWordsInput = document.getElementById('highlightWordsInput').value.trim();
        const selectedColor = document.getElementById('highlightColorSelect').value;

        const highlightWordsWithColors = localStorage.getItem('highlightWordsWithColors') ? JSON.parse(localStorage.getItem('highlightWordsWithColors')) : {};

        if (highlightWordsInput) {
            highlightWordsWithColors[selectedColor] = highlightWordsInput.split(',').map(word => word.trim());
        } else {
            delete highlightWordsWithColors[selectedColor];
        }

        localStorage.setItem('highlightWordsWithColors', JSON.stringify(highlightWordsWithColors));
        applyHighlights();
    }

    // Load saved highlight words for color
    function loadHighlightWordsForColor() {
        const selectedColor = document.getElementById('highlightColorSelect').value;
        const savedHighlightWords = localStorage.getItem('highlightWordsWithColors') ? JSON.parse(localStorage.getItem('highlightWordsWithColors')) : {};

        document.getElementById('highlightWordsInput').value = savedHighlightWords[selectedColor] ? savedHighlightWords[selectedColor].join(', ') : '';
    }

    // Save filter words
    function saveFilterWords() {
        const filterWordsInput = document.getElementById('filterWords');
        const filterWords = filterWordsInput.value.split(',').map(word => word.trim());
        localStorage.setItem('filterWords', JSON.stringify(filterWords));
        applyFilters();
    }

    function saveMinSeeds(minSeeds) {
        localStorage.setItem('minSeeds', JSON.stringify(minSeeds));
        applyFilters();
    }

    // function to add annotation note into the row’s text cell
function addMatchNote(row, lowSeed) {
    if (!lowSeed) return; // only for rows that fail minSeeds

    const anchor = row.cells[3].querySelector("a");
    if (!anchor) return;

    // Prevent stacking on multiple runs
    if (anchor.querySelector('span[data-low-seed-badge]')) return;

    const badge = document.createElement('span');
    badge.textContent = " Low Seed";
    badge.setAttribute('data-low-seed-badge', 'true');

    badge.style.background = "#006699";
    badge.style.color = "white";
    badge.style.padding = "2px 4px";
    badge.style.borderRadius = "4px";
    badge.style.fontWeight = "bold";
    badge.style.fontSize = "smaller";
    badge.style.marginLeft = "4px";
    badge.style.whiteSpace = "nowrap";

    
    anchor.appendChild(badge);
}


    // Apply filters (hide rows)
    function applyFilters(toggle = false) {
        const filterWords = localStorage.getItem('filterWords') ? JSON.parse(localStorage.getItem('filterWords')) : [];
        const minSeeds = localStorage.getItem('minSeeds') ? JSON.parse(localStorage.getItem('minSeeds')) : '0';

        document.getElementById('filterWords').value = filterWords;
        document.getElementById('minSeedsInput').value = minSeeds;

        const tableRows = document.querySelectorAll('#tor-tbl > tbody > tr');

        tableRows.forEach(row => {
            const rowText = row.cells[3].childNodes[1].textContent.toLowerCase();
            const rowSeed = row.cells[6].firstChild.textContent;

            const matchedFilterWords = filterWords.filter(filterWord =>
                matchesKeyword(rowText, filterWord)
            );

            const shouldHide = matchedFilterWords.length > 0;
            var lowSeed = +rowSeed < +minSeeds;

            if (toggle) {
                row.style.display = '';
                return;
            }

            // ★ ADD ANNOTATION FOR FILTER MATCHES
            addMatchNote(row, lowSeed);
            convertKeywordToBadge(row.cells[3].childNodes[1], matchedFilterWords);

            if (shouldHide || lowSeed) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });
    }

    // Apply highlight logic
    function applyHighlights() {
        const highlightWordsWithColors = localStorage.getItem('highlightWordsWithColors') ? JSON.parse(localStorage.getItem('highlightWordsWithColors')) : {};
        const tableRows = document.querySelectorAll('#tor-tbl > tbody > tr');

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const bgCell = row.cells[3];

            bgCell.style.background = '';

            for (const color in highlightWordsWithColors) {
                const highlightWords = highlightWordsWithColors[color];

                const matchedHighlightWords = highlightWords.filter(word =>
                    matchesKeyword(rowText, word)
                );

                const shouldHighlight = matchedHighlightWords.length > 0;

                if (shouldHighlight) {
                    bgCell.style.background = color;

                    convertKeywordToBadge(row.cells[3].childNodes[1], matchedHighlightWords);
                }
            }
        });
    }

    // Toggle filters
    function filterToggle() {
        if (!filterToggleState) {
            document.getElementById('toggleFilters').innerText = "Enable All Filters";
            document.getElementById('filterStatus').innerText = "DISABLED";
            document.getElementById('filterStatus').style = "color:red;font-weight:bold;";
            applyFilters(true);
            filterToggleState = true;
        } else {
            document.getElementById('toggleFilters').innerText = "Disable All Filters";
            document.getElementById('filterStatus').innerText = "ENABLED";
            document.getElementById('filterStatus').style = "color:green;font-weight:bold;";
            applyFilters(false);
            filterToggleState = false;
        }
    }

    // UI creation
    const filterDiv = document.createElement('div');
    filterDiv.innerHTML = `
    <table class="forumline">
    <tbody>
    <tr class="tCenter">
    <td class="row1" width="60%">
    <label for="filterWords" style="color:black;font-weight:bold;">Filter rows containing these words:</label><br><br>
    <textarea id="filterWords" rows="5" cols="130"></textarea> <br>
    <button class="bold clickable" id="buttonSaveFilterAction">Save Filter Words</button>
    </td>
    <td class="row1" width="25%">
    <label for="highlightWordsInput" style="color:black;font-weight:bold;">Highlight rows containing these words:</label><br><br>
    <input id="highlightWordsInput" type="text" size="30"> <br>
    <label for="highlightColorSelect" style="color:black;font-weight:bold;">Choose highlight color:</label><br>
    <select id="highlightColorSelect">
        <option value="#FFFF00">Yellow</option>
        <option value="#FFB6C1">Light Pink</option>
        <option value="#98FB98">Pale Green</option>
        <option value="#87CEFA">Light Sky Blue</option>
        <option value="#FFD700">Gold</option>
        <option value="#FFA07A">Light Salmon</option>
        <option value="#EE82EE">Violet</option>
        <option value="#FA8072">Salmon</option>
        <option value="#40E0D0">Turquoise</option>
        <option value="#FF69B4">Hot Pink</option>
    </select> <br><br>
    <button class="bold clickable" id="buttonSaveHighlightAction">Save Highlight Words</button>
    <button class="bold clickable" id="buttonApplyHighlightAction">Apply Highlight Manually</button>
    </td>
    <td class="row1" width="15%">
    <label for="highlightWords">Minimum seeds: </label><input id="minSeedsInput" type="number" style='width:50px' value="0"><br><br>
    <span>Filters are: </span><span id="filterStatus" style="color:green;font-weight:bold;">ENABLED</span><br><br>
    <button class="bold clickable" id="toggleFilters">Disable All Filters</button>
    </td>
    </tr>
    </tbody>
    <table>
`;

    const table = document.getElementById('tor-tbl');
    table.parentNode.insertBefore(filterDiv, table);

    document.getElementById('highlightColorSelect').addEventListener('change', loadHighlightWordsForColor);
    document.getElementById('buttonSaveHighlightAction').addEventListener('click', saveHighlightWords);
    document.getElementById('buttonApplyHighlightAction').addEventListener('click', applyHighlights);
    document.getElementById('buttonSaveFilterAction').addEventListener('click', saveFilterWords);
    document.getElementById('toggleFilters').addEventListener('click', filterToggle);
    document.getElementById('minSeedsInput').addEventListener('input', function(event) {
        saveMinSeeds(this.value);
    });

    function matchesKeyword(rowText, keyword) {
        if (!keyword) return false;

        const lowerKeyword = keyword.toLowerCase();

        // If keyword is long, normal matching
        if (lowerKeyword.length >= 5) {
            return rowText.includes(lowerKeyword);
        }

        // If keyword is short, ensure NO letters around it
        // Allowed neighbors: start/end, punctuation, numbers, whitespace, brackets, etc.
        const pattern = new RegExp(`(^|[^a-zA-Z])${lowerKeyword}([^a-zA-Z]|$)`, "i");
        return pattern.test(rowText);
    }

function convertKeywordToBadge(cellAnchor, matchedWords) {
    if (!matchedWords || matchedWords.length === 0) return;

    // Check if badge already exists
    if (cellAnchor.querySelector('span[data-filter-badge]')) return;

    // Remove <wbr> tags
    let html = cellAnchor.innerHTML.replace(/<wbr\s*\/?>/gi, '');

    matchedWords.forEach(word => {
        if (!word || !word.trim()) return; // skip empty keywords

        // Escape special regex characters
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(`(${escapedWord})`, "ig");

        html = html.replace(regex, (match) => {
            // Don't insert empty badges
            if (!match) return match;
            return `<span data-filter-badge style="background:#006699;font-size: smaller;color:white;padding:2px 2px;border-radius:4px;font-weight:bold;">${match}</span>`;
        });
    });

    cellAnchor.innerHTML = html;
}


    applyFilters();
    applyHighlights();



})();