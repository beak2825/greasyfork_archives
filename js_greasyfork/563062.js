// ==UserScript==
// @name         HDBits Extra Filters
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Filter torrent results by seeder count, resolution, year, text search, release group, country, and duplicates with multi-page loading
// @author       EightBall
// @match        https://hdbits.org/browse.php*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563062/HDBits%20Extra%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/563062/HDBits%20Extra%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration defaults
    const DEFAULT_MIN_SEEDERS = 40;
    const STORAGE_KEY_MIN_SEEDERS = 'hdbits_min_seeders';
    const STORAGE_KEY_FILTER_ENABLED = 'hdbits_filter_enabled';
    const STORAGE_KEY_RES_720P = 'hdbits_res_720p';
    const STORAGE_KEY_RES_1080P = 'hdbits_res_1080p';
    const STORAGE_KEY_RES_2160P = 'hdbits_res_2160p';
    const STORAGE_KEY_YEAR_FROM = 'hdbits_year_from';
    const STORAGE_KEY_YEAR_TO = 'hdbits_year_to';
    const STORAGE_KEY_REMOVE_DUPES = 'hdbits_remove_dupes';
    const STORAGE_KEY_COLLAPSED = 'hdbits_collapsed';
    const STORAGE_KEY_COUNTRIES = 'hdbits_countries';
    const STORAGE_KEY_COUNTRY_TYPE = 'hdbits_country_type';
    const STORAGE_KEY_COUNTRY_STICKY = 'hdbits_country_sticky';
    const STORAGE_KEY_BASE_PARAMS = 'hdbits_base_params'; // Store other search box params

    // Country groups for easier selection
    const COUNTRY_GROUPS = {
        "English-Speaking": ["United States", "United Kingdom", "Canada", "Australia", "New Zealand", "Ireland", "Scotland"],
        "Western Europe": ["France", "Germany", "Italy", "Spain", "Portugal", "Netherlands", "Belgium", "Austria", "Switzerland", "Luxembourg", "Monaco", "Liechtenstein"],
        "Nordic": ["Sweden", "Norway", "Denmark", "Finland", "Iceland", "Faroe Islands", "Greenland"],
        "Eastern Europe": ["Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria", "Slovenia", "Croatia", "Serbia", "Bosnia and Herzegovina", "Montenegro", "Republic of Macedonia", "Albania", "Kosovo", "Moldova", "Ukraine", "Belarus", "Lithuania", "Latvia", "Estonia"],
        "Russia/CIS": ["Russia", "Soviet Union", "Kazakhstan", "Uzbekistan", "Tajikistan", "Kyrgyzstan", "Turkmenistan", "Georgia", "Armenia", "Azerbaijan"],
        "East Asia": ["China", "Japan", "South Korea", "North Korea", "Korea", "Taiwan", "Hong Kong", "Macao", "Mongolia"],
        "South Asia": ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Maldives", "Afghanistan"],
        "Southeast Asia": ["Thailand", "Vietnam", "Philippines", "Indonesia", "Malaysia", "Singapore", "Myanmar", "Burma", "Cambodia", "Laos", "Brunei Darussalam", "Timor-Leste", "Siam"],
        "Middle East": ["Turkey", "Iran", "Iraq", "Israel", "Palestine", "Palestinian Territory", "Lebanon", "Syria", "Jordan", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Yemen", "Egypt"],
        "Latin America": ["Mexico", "Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Cuba", "Dominican Republic", "Puerto Rico", "Costa Rica", "Panama", "Guatemala", "Honduras", "El Salvador", "Nicaragua"],
        "Africa": ["South Africa", "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Uganda", "Morocco", "Algeria", "Tunisia", "Egypt", "Senegal", "Côte d´Ivoire", "Cameroon", "Zimbabwe", "Zambia", "Angola", "Mozambique", "Democratic Republic of the Congo", "Congo"]
    };

    // Load saved settings
    let minSeeders = GM_getValue(STORAGE_KEY_MIN_SEEDERS, DEFAULT_MIN_SEEDERS);
    let filterEnabled = GM_getValue(STORAGE_KEY_FILTER_ENABLED, true);
    let show720p = GM_getValue(STORAGE_KEY_RES_720P, true);
    let show1080p = GM_getValue(STORAGE_KEY_RES_1080P, true);
    let show2160p = GM_getValue(STORAGE_KEY_RES_2160P, true);
    let yearFrom = GM_getValue(STORAGE_KEY_YEAR_FROM, '');
    let yearTo = GM_getValue(STORAGE_KEY_YEAR_TO, '');
    let removeDuplicates = GM_getValue(STORAGE_KEY_REMOVE_DUPES, true);
    let isCollapsed = GM_getValue(STORAGE_KEY_COLLAPSED, false);
    let countrySticky = GM_getValue(STORAGE_KEY_COUNTRY_STICKY, false);

    // Text filter (not persisted)
    let textFilter = '';
    let useRegex = false;
    let releaseGroupFilter = '';

    // Track loaded pages and loading state
    let loadedPages = new Set();
    let isLoading = false;
    let currentPage = 0;

    // Get current page from URL
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page')) || 0;
    }

    // Parse current URL for country filter state
    function getCountryFilterFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const countries = urlParams.getAll('selected_countries[]');
        const filterType = urlParams.get('countrysearchtype') || 'showonly';
        return { countries, filterType };
    }

    // Build URL with country filter parameters (preserves searchbox params from pagination links)
    function buildCountryFilterUrl(countries, filterType) {
        const url = getBaseFilterUrl();
        // Remove existing country params
        while (url.searchParams.has('selected_countries[]')) url.searchParams.delete('selected_countries[]');
        url.searchParams.delete('countrysearchtype');
        // Add new country params
        if (countries.length) {
            countries.forEach(c => url.searchParams.append('selected_countries[]', c));
            url.searchParams.set('countrysearchtype', filterType);
        }
        url.searchParams.delete('page');
        return url.toString();
    }

    // Extract the base filter URL from pagination links
    function getBaseFilterUrl() {
        const link = document.querySelector('#resultsarea a[href*="browse.php?"]');
        if (link) {
            const url = new URL(link.getAttribute('href'), window.location.origin);
            url.searchParams.delete('page');
            return url;
        }
        return new URL(window.location.href);
    }

    // Build URL for a specific page using the extracted filters
    function getPageUrl(pageNum) {
        const url = getBaseFilterUrl();
        url.searchParams.set('page', pageNum);
        return url.toString();
    }

    // Create the control panel UI
    function createControlPanel() {
        const searchbox = document.getElementById('searchbox');
        if (!searchbox) return;

        const panel = document.createElement('table');
        panel.id = 'seeder-filter-panel';
        panel.setAttribute('cellpadding', '3');
        panel.style.cssText = 'width:800px; margin-top: 5px;';

        panel.innerHTML = `
            <tbody>
                <tr>
                    <th colspan="3" style="position: relative;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 5px;">
                            <div style="display: flex; align-items: center;">
                                <span>&nbsp;Extra Filters</span>
                                <input type="checkbox" id="filter-enabled" ${filterEnabled ? 'checked' : ''} title="Enable or disable all extra filters" style="cursor: pointer; margin-left: 10px;">
                            </div>
                            <a href="javascript:void(0)" id="collapse-toggle" style="font-weight: normal; font-size: 11px;">[${isCollapsed ? 'Expand' : 'Collapse'}]</a>
                        </div>
                    </th>
                </tr>
                <tr id="filter-row-1" ${isCollapsed ? 'style="display: none;"' : ''}>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        Min Seeders: <input type="text" id="min-seeders" value="${minSeeders}" size="4" style="width: 40px;">
                    </td>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        <label style="cursor: pointer;">
                            <input type="checkbox" id="remove-dupes" ${removeDuplicates ? 'checked' : ''}>
                            Remove Duplicates
                        </label>
                    </td>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;" align="center">
                        Showing <b id="visible-count">0</b> of <b id="total-count">0</b>
                        <span id="pages-loaded-info" style="color: #666;">(Page ${currentPage + 1})</span>
                    </td>
                </tr>
                <tr id="filter-row-2" ${isCollapsed ? 'style="display: none;"' : ''}>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        <b>Resolution:</b>
                        <label style="cursor: pointer; margin-left: 10px;">
                            <input type="checkbox" id="res-720p" ${show720p ? 'checked' : ''}> 720p
                        </label>
                        <label style="cursor: pointer; margin-left: 8px;">
                            <input type="checkbox" id="res-1080p" ${show1080p ? 'checked' : ''}> 1080p
                        </label>
                        <label style="cursor: pointer; margin-left: 8px;">
                            <input type="checkbox" id="res-2160p" ${show2160p ? 'checked' : ''}> 2160p
                        </label>
                    </td>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        <b>Year:</b>
                        <input type="text" id="year-from" value="${yearFrom}" size="4" style="width: 40px; margin-left: 5px;" placeholder="from">
                        <span style="margin: 0 3px;">-</span>
                        <input type="text" id="year-to" value="${yearTo}" size="4" style="width: 40px;" placeholder="to">
                    </td>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;" align="center">
                        Load
                        <select id="pages-to-load" style="width: 45px; margin: 0 3px;">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        pages <input type="button" id="load-more-btn" value="Go!" style="margin-left: 3px;">
                        <div id="loading-status" style="font-size: 10px; color: #666; margin-top: 2px;"></div>
                    </td>
                </tr>
                <tr id="filter-row-3" ${isCollapsed ? 'style="display: none;"' : ''}>
                    <td colspan="2" style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <b style="flex-shrink: 0;">Title Filter:</b>
                            <input type="text" id="text-filter" value="" style="flex: 1; min-width: 100px;" placeholder="Filter by name...">
                            <input type="button" id="text-filter-clear" value="Clear" style="flex-shrink: 0;">
                            <label style="cursor: pointer; flex-shrink: 0;" title="Use regular expression matching">
                                <input type="checkbox" id="text-filter-regex"> Regex
                            </label>
                            <span id="text-filter-error" style="color: #c00; font-size: 11px; flex-shrink: 0;"></span>
                        </div>
                    </td>
                    <td style="padding: 6px 10px; border: black solid 1px; white-space: nowrap;">
                        <b>Release Group:</b>
                        <select id="release-group-filter" style="margin-left: 5px; min-width: 100px;">
                            <option value="">All</option>
                        </select>
                    </td>
                </tr>
                <tr id="filter-row-4" ${isCollapsed ? 'style="display: none;"' : ''}>
                    <td colspan="3" style="padding: 6px 10px; border: black solid 1px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <b style="flex-shrink: 0;">Country:</b>
                                <select id="country-filter-type" style="flex-shrink: 0;">
                                    <option value="showonly">Show only</option>
                                    <option value="exclude">Exclude</option>
                                </select>
                                <div id="country-group-toggles" style="display: flex; flex-wrap: wrap; gap: 3px 12px;">
                                    ${Object.keys(COUNTRY_GROUPS).map(g => `
                                        <label style="cursor: pointer; white-space: nowrap;" title="${COUNTRY_GROUPS[g].join(', ')}">
                                            <input type="checkbox" class="country-group-checkbox" value="${g}"> ${g}
                                        </label>
                                    `).join('')}
                                </div>
                                <input type="button" id="country-filter-apply" value="Apply" style="flex-shrink: 0;">
                                <input type="button" id="country-filter-clear" value="Clear" style="flex-shrink: 0;">
                                <label style="cursor: pointer; flex-shrink: 0; margin-left: 8px;" title="Remember country selection and auto-apply on page load">
                                    <input type="checkbox" id="country-sticky" ${countrySticky ? 'checked' : ''}> Sticky
                                </label>
                            </div>
                            <div id="country-selection-summary" style="font-size: 10px; color: #555; display: none;"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        `;

        // Insert after searchbox
        searchbox.parentNode.insertBefore(panel, searchbox.nextSibling);

        // Collapse toggle event listener
        document.getElementById('collapse-toggle').addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            GM_setValue(STORAGE_KEY_COLLAPSED, isCollapsed);
            const display = isCollapsed ? 'none' : '';
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`filter-row-${i}`).style.display = display;
            }
            this.textContent = isCollapsed ? '[Expand]' : '[Collapse]';
        });

        // Event listeners
        document.getElementById('filter-enabled').addEventListener('change', function() {
            filterEnabled = this.checked;
            GM_setValue(STORAGE_KEY_FILTER_ENABLED, filterEnabled);
            applyFilter();
        });

        document.getElementById('min-seeders').addEventListener('input', function() {
            minSeeders = parseInt(this.value) || 0;
            GM_setValue(STORAGE_KEY_MIN_SEEDERS, minSeeders);
            applyFilter();
        });

        document.getElementById('remove-dupes').addEventListener('change', function() {
            removeDuplicates = this.checked;
            GM_setValue(STORAGE_KEY_REMOVE_DUPES, removeDuplicates);
            applyFilter();
        });

        document.getElementById('load-more-btn').addEventListener('click', loadMorePages);

        // Resolution filter event listeners
        document.getElementById('res-720p').addEventListener('change', function() {
            show720p = this.checked;
            GM_setValue(STORAGE_KEY_RES_720P, show720p);
            applyFilter();
        });

        document.getElementById('res-1080p').addEventListener('change', function() {
            show1080p = this.checked;
            GM_setValue(STORAGE_KEY_RES_1080P, show1080p);
            applyFilter();
        });

        document.getElementById('res-2160p').addEventListener('change', function() {
            show2160p = this.checked;
            GM_setValue(STORAGE_KEY_RES_2160P, show2160p);
            applyFilter();
        });

        // Year filter event listeners
        document.getElementById('year-from').addEventListener('input', function() {
            yearFrom = this.value.trim();
            GM_setValue(STORAGE_KEY_YEAR_FROM, yearFrom);
            applyFilter();
        });

        document.getElementById('year-to').addEventListener('input', function() {
            yearTo = this.value.trim();
            GM_setValue(STORAGE_KEY_YEAR_TO, yearTo);
            applyFilter();
        });

        // Text filter event listeners
        document.getElementById('text-filter').addEventListener('input', function() {
            textFilter = this.value;
            applyFilter();
        });

        document.getElementById('text-filter-clear').addEventListener('click', function() {
            textFilter = '';
            document.getElementById('text-filter').value = '';
            document.getElementById('text-filter-error').textContent = '';
            applyFilter();
        });

        document.getElementById('text-filter-regex').addEventListener('change', function() {
            useRegex = this.checked;
            applyFilter();
        });

        document.getElementById('release-group-filter').addEventListener('change', function() {
            releaseGroupFilter = this.value;
            applyFilter();
        });

        // Country filter event listeners
        initializeCountryFilter();

        document.getElementById('country-filter-apply').addEventListener('click', function() {
            applyCountryFilterFromUI();
        });

        document.getElementById('country-filter-clear').addEventListener('click', function() {
            // Clear all group checkboxes
            document.querySelectorAll('.country-group-checkbox').forEach(cb => {
                cb.checked = false;
                cb.indeterminate = false;
            });
            updateCountrySelectionDisplay();
            // Clear saved countries and base params if sticky is enabled
            if (countrySticky) {
                GM_setValue(STORAGE_KEY_COUNTRIES, []);
                GM_setValue(STORAGE_KEY_COUNTRY_TYPE, 'showonly');
                GM_setValue(STORAGE_KEY_BASE_PARAMS, []);
            }
            // Apply (this will reload without country filter)
            applyCountryFilterFromUI();
        });

        // Group checkbox event listeners
        document.querySelectorAll('.country-group-checkbox').forEach(cb => {
            cb.addEventListener('change', function() {
                updateCountrySelectionDisplay();
            });
        });

        // Sticky checkbox event listener
        document.getElementById('country-sticky').addEventListener('change', function() {
            countrySticky = this.checked;
            GM_setValue(STORAGE_KEY_COUNTRY_STICKY, countrySticky);
            // If enabling sticky, save current URL state including base params
            if (countrySticky) {
                const { countries, filterType } = getCountryFilterFromUrl();
                GM_setValue(STORAGE_KEY_COUNTRIES, countries);
                GM_setValue(STORAGE_KEY_COUNTRY_TYPE, filterType);
                // Save base params
                const baseUrl = getBaseFilterUrl();
                const baseParams = [];
                for (const [key, value] of baseUrl.searchParams.entries()) {
                    if (key !== 'selected_countries[]' && key !== 'countrysearchtype' && key !== 'page') {
                        baseParams.push([key, value]);
                    }
                }
                GM_setValue(STORAGE_KEY_BASE_PARAMS, baseParams);
            }
        });
    }

    // Initialize country filter UI from URL state (URL is source of truth)
    function initializeCountryFilter() {
        const { countries, filterType } = getCountryFilterFromUrl();
        document.getElementById('country-filter-type').value = filterType;

        document.querySelectorAll('.country-group-checkbox').forEach(cb => {
            const groupCountries = COUNTRY_GROUPS[cb.value] || [];
            const allIn = groupCountries.every(c => countries.includes(c));
            const someIn = groupCountries.some(c => countries.includes(c));
            cb.checked = allIn;
            cb.indeterminate = someIn && !allIn;
        });
        updateCountrySelectionDisplay();
    }

    // Get all currently selected countries from checked groups
    function getAllSelectedCountries() {
        const countries = new Set();
        document.querySelectorAll('.country-group-checkbox:checked').forEach(cb => {
            (COUNTRY_GROUPS[cb.value] || []).forEach(c => countries.add(c));
        });
        return [...countries];
    }

    // Update the display showing selected countries summary
    function updateCountrySelectionDisplay() {
        const selectedCountries = getAllSelectedCountries();
        const summaryEl = document.getElementById('country-selection-summary');

        if (selectedCountries.length > 0) {
            summaryEl.style.display = 'block';
            const displayList = selectedCountries.slice(0, 15).join(', ');
            const ellipsis = selectedCountries.length > 15 ? '...' : '';
            summaryEl.textContent = `Selected (${selectedCountries.length}): ${displayList}${ellipsis}`;
            summaryEl.title = selectedCountries.join(', ');
        } else {
            summaryEl.style.display = 'none';
        }
    }

    // Apply country filter from UI state
    function applyCountryFilterFromUI() {
        const selectedCountries = getAllSelectedCountries();
        const filterType = document.getElementById('country-filter-type').value;

        // Save to storage if sticky is enabled
        if (countrySticky) {
            GM_setValue(STORAGE_KEY_COUNTRIES, selectedCountries);
            GM_setValue(STORAGE_KEY_COUNTRY_TYPE, filterType);
            // Save base params (all search box params except countries/page)
            const baseUrl = getBaseFilterUrl();
            const baseParams = [];
            for (const [key, value] of baseUrl.searchParams.entries()) {
                if (key !== 'selected_countries[]' && key !== 'countrysearchtype' && key !== 'page') {
                    baseParams.push([key, value]);
                }
            }
            GM_setValue(STORAGE_KEY_BASE_PARAMS, baseParams);
        }

        const newUrl = buildCountryFilterUrl(selectedCountries, filterType);

        if (newUrl !== window.location.href) {
            window.location.href = newUrl;
        }
    }

    // Load more pages
    async function loadMorePages() {
        if (isLoading) return;

        const pagesToLoad = parseInt(document.getElementById('pages-to-load').value) || 5;
        const loadBtn = document.getElementById('load-more-btn');
        const statusEl = document.getElementById('loading-status');

        isLoading = true;
        loadBtn.disabled = true;
        loadBtn.value = 'Loading...';

        let pagesLoaded = 0;
        let nextPage = Math.max(...loadedPages) + 1;

        for (let i = 0; i < pagesToLoad; i++) {
            const pageToLoad = nextPage + i;

            if (loadedPages.has(pageToLoad)) continue;

            statusEl.textContent = `Loading page ${pageToLoad + 1}...`;

            try {
                const rows = await fetchPage(pageToLoad);
                if (rows.length === 0) {
                    statusEl.textContent = `No more results after page ${pageToLoad}.`;
                    break;
                }
                appendRows(rows);
                loadedPages.add(pageToLoad);
                pagesLoaded++;

                // Small delay to be nice to the server
                if (i < pagesToLoad - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            } catch (error) {
                console.error('Error loading page:', error);
                statusEl.textContent = `Error loading page ${pageToLoad + 1}`;
                break;
            }
        }

        isLoading = false;
        loadBtn.disabled = false;
        loadBtn.value = 'Go!';

        if (pagesLoaded > 0) {
            updatePagesLoadedInfo();
            statusEl.textContent = `Loaded ${pagesLoaded} page(s)`;
            applyFilter();
        }
    }

    // Fetch a page and extract torrent rows
    async function fetchPage(pageNum) {
        const url = getPageUrl(pageNum);
        const response = await fetch(url);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.getElementById('torrent-list');

        if (!table) return [];

        const tbody = table.querySelector('tbody');
        if (!tbody) return [];

        const rows = tbody.querySelectorAll('tr[id^="t"]');
        return Array.from(rows);
    }

    // Append rows to the current table
    function appendRows(rows) {
        const table = document.getElementById('torrent-list');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const addedRows = [];
        rows.forEach(row => {
            // Check if this torrent ID already exists
            if (!document.getElementById(row.id)) {
                const clonedRow = row.cloneNode(true);
                tbody.appendChild(clonedRow);
                addedRows.push(clonedRow);
            }
        });

        // Attach hover events for poster preview on new rows
        if (addedRows.length > 0) {
            attachHoverEvents(addedRows);
        }
    }

    // Update the pages loaded info display
    function updatePagesLoadedInfo() {
        const infoEl = document.getElementById('pages-loaded-info');
        if (!infoEl) return;
        const pages = Array.from(loadedPages);
        const min = Math.min(...pages) + 1, max = Math.max(...pages) + 1;
        infoEl.textContent = min === max ? `(Page ${min})` : `(Pages ${min}-${max})`;
    }

    // Get resolution from torrent name
    function getResolution(name) {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('2160p')) return '2160p';
        if (nameLower.includes('1080p') || nameLower.includes('1080i')) return '1080p';
        if (nameLower.includes('720p')) return '720p';
        if (nameLower.includes('4k') || nameLower.includes('uhd')) return '2160p';
        return 'other';
    }

    // Check if resolution passes filter
    function resolutionPassesFilter(resolution) {
        if (resolution === '720p') return show720p;
        if (resolution === '1080p') return show1080p;
        if (resolution === '2160p') return show2160p;
        return true;
    }

    // Extract year from torrent name
    function getYear(name) {
        const match = name.match(/[\s\.\(](19\d{2}|20\d{2})[\s\.\)]/);
        return match ? parseInt(match[1]) : null;
    }

    // Check if year passes filter
    function yearPassesFilter(year) {
        const fromYear = parseInt(yearFrom) || null;
        const toYear = parseInt(yearTo) || null;

        if (!fromYear && !toYear) return true;
        if (!year) return true;
        if (fromYear && !toYear) return year === fromYear;
        if (!fromYear && toYear) return year === toYear;
        return year >= fromYear && year <= toYear;
    }

    // Check if text filter passes
    function textPassesFilter(name) {
        if (!textFilter || textFilter.trim() === '') return true;

        const errorEl = document.getElementById('text-filter-error');

        if (useRegex) {
            try {
                const regex = new RegExp(textFilter, 'i');
                if (errorEl) errorEl.textContent = '';
                return regex.test(name);
            } catch (e) {
                if (errorEl) errorEl.textContent = 'Invalid regex';
                return true;
            }
        }

        if (errorEl) errorEl.textContent = '';
        return name.toLowerCase().includes(textFilter.toLowerCase());
    }

    // Extract release group from torrent name (e.g., "Movie.2024.1080p-GROUP" -> "GROUP")
    function getReleaseGroup(name) {
        const match = name.match(/-([A-Za-z0-9]+)$/);
        return match ? match[1].toUpperCase() : null;
    }

    // Check if release group passes filter
    function releaseGroupPassesFilter(group) {
        return !releaseGroupFilter || !group || group === releaseGroupFilter;
    }

    // Populate release group dropdown with unique values from filtered results
    function populateReleaseGroups() {
        const table = document.getElementById('torrent-list');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        const groups = new Set();

        // First pass: collect data and build duplicate groups (same as applyFilter)
        const rowData = [];
        const duplicateGroups = {};

        rows.forEach(row => {
            if (!row.id || !row.id.startsWith('t')) return;

            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return;

            const nameCell = cells[2];
            const nameLink = nameCell.querySelector('a[href*="details.php"]');
            const torrentName = nameLink ? nameLink.textContent.trim() : '';

            const resolution = getResolution(torrentName);
            const year = getYear(torrentName);
            const releaseGroup = getReleaseGroup(torrentName);

            const seedersCell = cells[7];
            const seeders = parseInt(seedersCell.textContent.trim().replace(/,/g, '')) || 0;

            const qualityScore = scoreQuality(torrentName, seeders);
            const dupeKey = getDuplicateKey(row, torrentName);

            // Apply all filters EXCEPT release group filter
            const passesSeeders = !filterEnabled || seeders >= minSeeders;
            const passesResolution = !filterEnabled || resolutionPassesFilter(resolution);
            const passesYear = !filterEnabled || yearPassesFilter(year);
            const passesText = !filterEnabled || textPassesFilter(torrentName);

            if (passesSeeders && passesResolution && passesYear && passesText) {
                const data = { row, releaseGroup, qualityScore, dupeKey };
                rowData.push(data);

                if (!duplicateGroups[dupeKey]) {
                    duplicateGroups[dupeKey] = [];
                }
                duplicateGroups[dupeKey].push(data);
            }
        });

        // Identify best torrent in each duplicate group
        const bestInGroup = new Set();
        for (const key in duplicateGroups) {
            const group = duplicateGroups[key];
            group.sort((a, b) => b.qualityScore - a.qualityScore);
            bestInGroup.add(group[0].row.id);
        }

        // Collect release groups from visible results
        rowData.forEach(data => {
            const passesDuplicates = !removeDuplicates || bestInGroup.has(data.row.id);
            if (passesDuplicates && data.releaseGroup) {
                groups.add(data.releaseGroup);
            }
        });

        // Sort groups alphabetically
        const sortedGroups = Array.from(groups).sort();

        // Update dropdown
        const dropdown = document.getElementById('release-group-filter');
        if (!dropdown) return;

        // Remember current selection
        const currentSelection = dropdown.value;

        // Clear and repopulate
        dropdown.innerHTML = '<option value="">All</option>';
        sortedGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            dropdown.appendChild(option);
        });

        // Restore selection if it still exists, otherwise reset to All
        if (currentSelection && sortedGroups.includes(currentSelection)) {
            dropdown.value = currentSelection;
        } else if (currentSelection && !sortedGroups.includes(currentSelection)) {
            // Selected group no longer in results, reset filter
            dropdown.value = '';
            releaseGroupFilter = '';
        }
    }

    // Extract IMDB ID from row
    function getImdbId(row) {
        const imdbLink = row.querySelector('a[data-imdb-link]');
        if (imdbLink) {
            const match = imdbLink.getAttribute('data-imdb-link')?.match(/tt(\d+)/);
            if (match) return match[1];
        }
        const filmLink = row.querySelector('a[href^="/film/info?id="]');
        if (filmLink) {
            const match = filmLink.href.match(/id=(\d+)/);
            if (match) return 'film_' + match[1];
        }
        return null;
    }

    // Calculate quality score for a torrent
    function scoreQuality(name, seeders) {
        const nameLower = name.toLowerCase();
        let score = 0;

        // Video Codec scoring (0-100)
        if (nameLower.includes('hevc') || nameLower.includes('x265') || nameLower.includes('h.265') || nameLower.includes('h265')) {
            score += 100;
        } else if (nameLower.includes('h.264') || nameLower.includes('h264') || nameLower.includes('x264') || nameLower.includes('avc')) {
            score += 50;
        }

        // HDR scoring (0-100) - additive for combo formats
        let hdrScore = 0;
        if (nameLower.includes('dovi') || nameLower.includes('dolby vision') || nameLower.includes('dv')) {
            hdrScore += 50;
        }
        if (nameLower.includes('hdr10+') || nameLower.includes('hdr10plus')) {
            hdrScore += 45;
        } else if (nameLower.includes('hdr10') || nameLower.includes('hdr')) {
            hdrScore += 30;
        }
        if (nameLower.includes('hlg')) {
            hdrScore += 20;
        }
        score += Math.min(hdrScore, 100); // Cap at 100

        // Audio scoring (0-100)
        if (nameLower.includes('atmos')) {
            score += 100;
        } else if (nameLower.includes('dts:x') || nameLower.includes('dtsx')) {
            score += 95;
        } else if (nameLower.includes('truehd 7.1') || nameLower.includes('truehd7.1')) {
            score += 90;
        } else if (nameLower.includes('dd+7.1') || nameLower.includes('ddp7.1') || nameLower.includes('eac3 7.1') || nameLower.includes('dd+ 7.1')) {
            score += 85;
        } else if (nameLower.includes('dts-hd ma 7.1') || nameLower.includes('dts-hd.ma.7.1')) {
            score += 85;
        } else if (nameLower.includes('7.1')) {
            score += 80;
        } else if (nameLower.includes('truehd 5.1') || nameLower.includes('truehd5.1') || nameLower.includes('truehd')) {
            score += 75;
        } else if (nameLower.includes('dts-hd ma') || nameLower.includes('dts-hd.ma')) {
            score += 75;
        } else if (nameLower.includes('dd+5.1') || nameLower.includes('ddp5.1') || nameLower.includes('eac3 5.1') || nameLower.includes('dd+ 5.1') || nameLower.includes('dd+') || nameLower.includes('eac3')) {
            score += 70;
        } else if (nameLower.includes('dts 5.1') || nameLower.includes('dts')) {
            score += 60;
        } else if (nameLower.includes('dd5.1') || nameLower.includes('dd 5.1') || nameLower.includes('ac3 5.1') || nameLower.includes('5.1')) {
            score += 55;
        } else if (nameLower.includes('dd+2.0') || nameLower.includes('ddp2.0') || nameLower.includes('eac3 2.0')) {
            score += 45;
        } else if (nameLower.includes('aac') || nameLower.includes('dd2.0') || nameLower.includes('dd 2.0') || nameLower.includes('2.0')) {
            score += 40;
        } else if (nameLower.includes('flac')) {
            score += 70;
        }

        // Source scoring (0-100)
        if (nameLower.includes('remux')) {
            score += 100;
        } else if (nameLower.includes('hybrid')) {
            score += 95;
        } else if (nameLower.includes('bluray') || nameLower.includes('blu-ray')) {
            score += 85;
        } else if (nameLower.includes('web-dl') || nameLower.includes('webdl')) {
            score += 70;
        } else if (nameLower.includes('webrip') || nameLower.includes('web-rip')) {
            score += 55;
        } else if (nameLower.includes('hdtv')) {
            score += 40;
        } else if (nameLower.includes('web')) {
            score += 60;
        }

        // Seeder bonus (0-50) - logarithmic scale to not overwhelm other factors
        const seederBonus = Math.min(Math.log10(seeders + 1) * 15, 50);
        score += seederBonus;

        return score;
    }

    // Get a unique key for duplicate detection (IMDB ID + resolution)
    function getDuplicateKey(row, torrentName) {
        const imdbId = getImdbId(row);
        return imdbId ? `${imdbId}_${getResolution(torrentName)}` : 'no_imdb_' + row.id;
    }

    // Attach hover events for poster preview (needed for dynamically loaded rows)
    function attachHoverEvents(rows) {
        if (typeof $j === 'undefined') return;

        rows.forEach(row => {
            const nameCell = row.querySelector('.browse_td_name_cell');
            if (nameCell && !nameCell.dataset.hoverAttached) {
                $j(nameCell).hover(
                    function() {
                        $j(this).addClass("has_hover");
                        $j(".browse_imdb_poster", this).show();
                    },
                    function() {
                        $j(".browse_imdb_poster", this).hide();
                    }
                );
                nameCell.dataset.hoverAttached = 'true';
            }
        });
    }

    // Apply the seeder filter to the table
    function applyFilter() {
        const table = document.getElementById('torrent-list');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Update release group dropdown based on current filtered results
        populateReleaseGroups();

        const rows = tbody.querySelectorAll('tr');
        let visibleCount = 0;
        let totalCount = 0;

        // First pass: collect info and identify best duplicates
        const rowData = [];
        const duplicateGroups = {};

        rows.forEach(row => {
            // Skip if not a data row
            if (!row.id || !row.id.startsWith('t')) return;

            totalCount++;

            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return;

            // Get torrent name from the name cell (3rd column, index 2)
            const nameCell = cells[2];
            // Extract just the torrent name from the main link, not all cell text
            const nameLink = nameCell.querySelector('a[href*="details.php"]');
            const torrentName = nameLink ? nameLink.textContent.trim() : (nameCell.textContent || '');
            const resolution = getResolution(torrentName);
            const year = getYear(torrentName);
            const releaseGroup = getReleaseGroup(torrentName);

            // Find the seeders cell (8th column, index 7)
            const seedersCell = cells[7];
            const seeders = parseInt(seedersCell.textContent.trim().replace(/,/g, '')) || 0;

            // Calculate quality score
            const qualityScore = scoreQuality(torrentName, seeders);

            // Get duplicate key
            const dupeKey = getDuplicateKey(row, torrentName);

            const data = {
                row,
                torrentName,
                resolution,
                year,
                releaseGroup,
                seeders,
                qualityScore,
                dupeKey
            };

            rowData.push(data);

            // Group by duplicate key
            if (!duplicateGroups[dupeKey]) {
                duplicateGroups[dupeKey] = [];
            }
            duplicateGroups[dupeKey].push(data);
        });

        // Identify best torrent in each duplicate group
        const bestInGroup = new Set();
        for (const key in duplicateGroups) {
            const group = duplicateGroups[key];
            // Sort by quality score descending
            group.sort((a, b) => b.qualityScore - a.qualityScore);
            // Mark the best one
            bestInGroup.add(group[0].row.id);
        }

        // Second pass: apply filters and duplicate removal
        rowData.forEach(data => {
            const { row, torrentName, resolution, year, releaseGroup, seeders } = data;

            // Apply standard filters
            const passesSeeders = !filterEnabled || seeders >= minSeeders;
            const passesResolution = !filterEnabled || resolutionPassesFilter(resolution);
            const passesYear = !filterEnabled || yearPassesFilter(year);
            const passesText = !filterEnabled || textPassesFilter(torrentName);
            const passesReleaseGroup = !filterEnabled || releaseGroupPassesFilter(releaseGroup);

            // Check if this is the best duplicate (or duplicates disabled)
            const passesDuplicates = !removeDuplicates || bestInGroup.has(row.id);

            if (passesSeeders && passesResolution && passesYear && passesText && passesReleaseGroup && passesDuplicates) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Update stats
        document.getElementById('visible-count').textContent = visibleCount;
        document.getElementById('total-count').textContent = totalCount;
    }

    // Show a loading indicator when redirecting for sticky country filter
    function showStickyRedirectNotice() {
        const searchbox = document.getElementById('searchbox');
        if (!searchbox) return;

        // Add spinner animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes hdb-spinner {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .hdb-loading-spinner {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 2px solid #555;
                border-top-color: #ddd;
                border-radius: 50%;
                animation: hdb-spinner 0.8s linear infinite;
                vertical-align: middle;
                margin-right: 8px;
            }
        `;
        document.head.appendChild(style);

        const notice = document.createElement('table');
        notice.id = 'seeder-filter-panel';
        notice.setAttribute('cellpadding', '3');
        notice.style.cssText = 'width:800px; margin-top: 5px;';
        notice.innerHTML = `
            <tbody>
                <tr>
                    <th style="padding: 8px;">
                        <span>&nbsp;Extra Filters</span>
                        <span style="margin-left: 15px; font-weight: normal; color: #aaa;">
                            <span class="hdb-loading-spinner"></span>
                            Applying saved country filter...
                        </span>
                    </th>
                </tr>
            </tbody>
        `;
        searchbox.parentNode.insertBefore(notice, searchbox.nextSibling);
    }

    // Initialize
    function init() {
        // Track the current page as already loaded
        currentPage = getCurrentPage();
        loadedPages.add(currentPage);

        // If sticky is enabled and we're on a page with country filters,
        // update saved base params to capture any new search box selections
        if (countrySticky) {
            const { countries: urlCountries } = getCountryFilterFromUrl();
            if (urlCountries.length > 0) {
                // We're on a filtered page - save current base params
                const baseUrl = getBaseFilterUrl();
                const baseParams = [];
                for (const [key, value] of baseUrl.searchParams.entries()) {
                    if (key !== 'selected_countries[]' && key !== 'countrysearchtype' && key !== 'page') {
                        baseParams.push([key, value]);
                    }
                }
                GM_setValue(STORAGE_KEY_BASE_PARAMS, baseParams);
            }
        }

        createControlPanel();
        applyFilter();

        // Re-apply filter if table is dynamically updated
        const observer = new MutationObserver(() => {
            applyFilter();
        });

        const table = document.getElementById('torrent-list');
        if (table) {
            observer.observe(table, { childList: true, subtree: true });
        }
    }

    // Check if sticky redirect is needed (doesn't trigger redirect, just checks)
    function shouldStickyRedirect() {
        const savedCountries = GM_getValue(STORAGE_KEY_COUNTRIES, []);
        const { countries: urlCountries } = getCountryFilterFromUrl();

        if (countrySticky && savedCountries.length > 0 && urlCountries.length === 0) {
            const savedType = GM_getValue(STORAGE_KEY_COUNTRY_TYPE, 'showonly');
            const savedBaseParams = GM_getValue(STORAGE_KEY_BASE_PARAMS, []);

            // Build URL with saved base params + country filter
            const url = new URL(window.location.origin + '/browse.php');

            // Restore saved base params (category, codec, medium, etc.)
            savedBaseParams.forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            // Add country filter
            savedCountries.forEach(c => url.searchParams.append('selected_countries[]', c));
            url.searchParams.set('countrysearchtype', savedType);

            if (url.toString() !== window.location.href) {
                return url.toString(); // Return the URL to redirect to
            }
        }
        return null;
    }

    // Show loading overlay and hide content
    function showRedirectOverlay() {
        const style = document.createElement('style');
        style.id = 'hdb-redirect-styles';
        style.textContent = `
            #torrent-list, #resultsarea, .browsetable { visibility: hidden !important; }
            #hdb-redirect-overlay {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 99999;
            }
            @keyframes hdb-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            #hdb-redirect-overlay .hdb-spinner {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 2px solid #555;
                border-top-color: #ddd;
                border-radius: 50%;
                animation: hdb-spin 0.8s linear infinite;
                vertical-align: middle;
                margin-right: 8px;
            }
        `;
        (document.head || document.documentElement).appendChild(style);

        // Create overlay using table structure to match site styling
        const overlay = document.createElement('div');
        overlay.id = 'hdb-redirect-overlay';
        overlay.innerHTML = `
            <table cellpadding="3" style="width: 300px; font: 11px tahoma, arial, helvetica, sans-serif; border-collapse: collapse; background-color: #bccad6;">
                <tbody>
                    <tr>
                        <th style="background-color: #2f4879; color: #fff; border: solid #000 1px; padding: 4px; font-weight: bold;">&nbsp;Extra Filters</th>
                    </tr>
                    <tr>
                        <td style="padding: 12px 15px; border: solid #000 1px; text-align: center; color: #000;">
                            <span class="hdb-spinner"></span>
                            Applying saved country filter...
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
        document.documentElement.appendChild(overlay);
    }

    // Run redirect check immediately
    const redirectUrl = shouldStickyRedirect();
    if (redirectUrl) {
        // Show overlay FIRST, then redirect after a brief moment to allow render
        const doRedirect = () => {
            showRedirectOverlay();
            // Small delay to allow browser to paint the overlay
            setTimeout(() => {
                window.location.replace(redirectUrl);
            }, 10);
        };

        if (document.documentElement) {
            doRedirect();
        } else {
            // Wait for documentElement to be created
            const observer = new MutationObserver(() => {
                if (document.documentElement) {
                    observer.disconnect();
                    doRedirect();
                }
            });
            observer.observe(document, { childList: true });
        }
    } else {
        // No redirect needed, proceed with normal init
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();