// ==UserScript==
// @name         SB/SV/QQ Simple Filter & Search
// @description  Adds a simpler mobile-friendly tag-search + thread-search popup button.
// @version      1.20
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://*.spacebattles.com/*
// @match        https://*.sufficientvelocity.com/*
// @match        https://*.questionablequesting.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/548776/SBSVQQ%20Simple%20Filter%20%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/548776/SBSVQQ%20Simple%20Filter%20%20Search.meta.js
// ==/UserScript==

'use strict';

let FOCUS = false;

let site = location.hostname.split('.').slice(-2, -1)[0];
if (location.pathname.includes('/threads/')) return;
// if (!location.pathname.includes('/forums/')) return;
const isSearchPage = location.pathname.match(/\/search\/\d+\//) && location.search;

const FORUM_NODES = {
    'spacebattles': {
        creative: [18],
        quests: [240]
    },
    'sufficientvelocity': {
        creative: [2],
        quests: [29]
    },
    'questionablequesting': {
        creative: [19, 29],
        quests: [20, 12]
    },
    'alternatehistory': {
        creative: [],
        quests: []
    }
}[site];

// --- Initial State from URL Parameters ---
let initialSimpleOrder = 'post_date';
let initialSimpleDirection = 'desc';
let initialMinWordCount = 0;
let initialMaxWordCount = 0;
let initialWithoutSynonyms = false;
let initialTags = [];
let initialActiveTab = 'simple'; // Default to simple filter for URL params
let initialThreadQuery = '';
let initialThreadSearchFirstPostOnly = false;
let initialThreadMinReplies = 0;
let initialThreadSortBy = 'date';
let initialThreadForums = ['creative', 'quests']; // Default to checked

function parseAndSetInitialState() {
    const params = new URLSearchParams(location.search);

    // If on a thread search result page, parse thread search params
    if (isSearchPage) {
        initialActiveTab = 'thread';

        if (params.has('keywords') || params.has('q')) initialThreadQuery = params.get('keywords') || params.get('q');
        if (params.get('c[content]') === 'thread') initialThreadSearchFirstPostOnly = true;
        if (params.has('c[tags]')) {
            initialTags = params.get('c[tags]').split(',').map(t => t.trim()).filter(t => t);
        }
        if (params.has('c[word_count][lower]')) initialMinWordCount = parseInt(params.get('c[word_count][lower]'), 10) || 0;
        if (params.has('c[word_count][upper]')) initialMaxWordCount = parseInt(params.get('c[word_count][upper]'), 10) || 0;
        if (params.has('c[min_reply_count]')) initialThreadMinReplies = parseInt(params.get('c[min_reply_count]'), 10) || 0;
        if (params.has('order') || params.has('o')) initialThreadSortBy = params.get('order') || params.get('o');

        // Parse c[nodes] to determine which forums were searched
        const urlNodeKeys = Array.from(params.keys()).filter(key => key.startsWith('c[nodes]['));
        if (urlNodeKeys.length > 0) {
            const urlNodes = new Set(urlNodeKeys.map(key => parseInt(params.get(key), 10)));
            const selectedForums = [];
            // For each forum category, check if ALL its required nodes are in the URL params
            for (const forumCategory in FORUM_NODES) {
                const requiredNodes = FORUM_NODES[forumCategory];
                if (requiredNodes.length > 0 && requiredNodes.every(nodeId => urlNodes.has(nodeId))) {
                    selectedForums.push(forumCategory);
                }
            }
            initialThreadForums = selectedForums;
        }


    } else { // It's a simple filter URL or a regular forum page
        if (params.has('order')) {
            initialSimpleOrder = params.get('order');
        }
        if (params.has('direction')) {
            initialSimpleDirection = params.get('direction');
        }
        if (params.has('min_word_count')) {
            initialMinWordCount = parseInt(params.get('min_word_count'), 10);
        }
        if (params.has('max_word_count')) {
            initialMaxWordCount = parseInt(params.get('max_word_count'), 10);
        }
        if (params.has('withoutSynonym') && params.get('withoutSynonym') === '1') {
            initialWithoutSynonyms = true;
        }

        // Parse tags[] for simple filter
        const tagKeys = Array.from(params.keys()).filter(key => key.startsWith('tags[') && key.endsWith(']'));
        tagKeys.forEach(tagKey => {
            initialTags.push(params.get(tagKey));
        });

        if (tagKeys.length > 0 || params.has('min_word_count') || params.has('max_word_count') || params.has('withoutSynonym')) {
            initialActiveTab = 'simple'; // Ensure simple tab is active if any simple filter params are present
        }
    }
}

// Call this function immediately to set initial state from URL
parseAndSetInitialState();


// --- 1. SCRIPT INITIALIZATION ---
const targetContainer = document.querySelector('.block-outer-opposite .buttonGroup')
                     || document.querySelector('.p-breadcrumbs'); // on search pages, .p-breadcrumbs puts it at the top
if (!targetContainer) return;

const xfToken = document.querySelector('input[name="_xfToken"]')?.value;
if (!xfToken) console.warn('QQ Search Script: Could not find _xfToken. Tag search will not work.');

// --- 2. STATE MANAGEMENT ---
let searchPanel = null;
let selectedTags = new Set();
let debounceTimer;
let activeTab = initialActiveTab; // Set initial active tab based on URL parameters
const TAG_SEARCH_DEBOUNCE_DELAY = 500;

const TOP_BACKGROUND_COLOR = window.getComputedStyle(document.querySelector('#top')).backgroundColor;

// --- 3. CSS STYLES ---
const styles = `
    .menu { margin: 0; }
    .qq-search-panel {
        position: absolute; display: none; z-index: 1200; top: 0;
        width: 90vw; max-width: 480px;
        left: 50%; transform: translateX(-50%);
    }
    .qq-search-panel.is-active { display: block; }

    /* Tab navigation */
    .search-tabs { display: flex; position: relative; }
    .search-tab { padding: 8px 12px; cursor: pointer; border: 1px solid transparent; border-bottom: none; user-select: none; }
    .search-tab.is-active {
        background-color: var(--xf-contentBg); border-color: var(--input-border-light);
        border-bottom-color: var(--xf-contentBg); position: relative; top: 1px;
        border-top-left-radius: 3px; border-top-right-radius: 3px;
    }
    .qq-search-panel .close-button {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-size: 24px;
        cursor: pointer;
        color: #808080; /* A neutral gray color */
        background-color: transparent;
        border: none;
        box-sizing: border-box;
        user-select: none; /* Make the 'X' non-selectable */
    }
    .qq-search-panel .close-button:hover {
        color: #007bff; /* A common blue for hover effect */
    }
    /* removed padding so items sit flush with the top */

    /* Hide/Show elements based on active tab */
    /* FIX: Increased selector specificity to ensure elements are hidden by default, fixing the visibility bug. */
    .menu-row[data-tab-exclusive] { display: none; }
    .qq-search-panel.is-simple-tab .menu-row[data-tab-exclusive="simple"],
    .qq-search-panel.is-thread-tab .menu-row[data-tab-exclusive="thread"] {
        display: flex; /* Use flex for alignment */
    }

    /* Form row layout fixes for vertical alignment */
    .flex-form-row { display: flex; align-items: center; }
    .flex-form-row > label {
        /* FIX: Set a fixed basis for all labels to align them into a neat column. */
        flex-basis: 70px; /* 25% smaller than 95px (95 * 0.75 = 71.25) */
        flex-shrink: 0;
        margin-right: 12px;
        white-space: nowrap;
        text-align: right;
    }
    /* generic vertical row layout */
    .menu-row { border-top: 1px solid var(--input-border-light); display: flex; flex-direction: column; padding-top: 6px; }
    .menu-row:first-child { border-top: none; }
    .menu-row.no-border { border-top: none; padding-top: 0; }

    .menu-row > label { margin-bottom: 6px; text-align: left; }

    .menu-row > .split-2 { display: flex; gap: 5px; }

    /* inputs / selects share the space evenly, single element fills all */
    .split-2 > .input,
    .split-2 > .input--number { flex: 1 1 50% !important; min-width: 0; width: 100% !important; max-width: none !important; }

    /* Checkbox row layout */
    .checkbox-row { display: flex; flex-wrap: wrap; gap: 15px; align-items: center; }
    .checkbox-row label, .selected-tag { user-select: none; }

    /* Tag search styling */
    .tag-search-container { display: flex; flex-wrap: wrap; align-items: center; padding: 2px; }
    /* Thread search field styling */
    .thread-search-container { display: flex; align-items: center; width: 100%; }
    /* Fix overflow for simple sort selectors */
    .flex-form-row .inputGroup .input { flex: 1 1 50%; min-width: 0; }
    .selected-tag {
        display: inline-flex; align-items: center;
        border: 1px solid var(--input-border-heavy, #505050);
        margin: 2px; padding: 0px 0px 0px 6px; border-radius: 5px; font-size: 0.9em;
    }
    .selected-tag-remove { padding: 0 6px 0 4px; cursor: pointer; font-weight: bold; }
    #tag-search-input { flex-grow: 1; border: none; background: transparent; padding: 4px; min-width: 120px; }
    #tag-search-input:focus { outline: none; }

    .tag-suggestions-wrapper { position: relative; }
    /* Suggestion box */
    #tag-suggestions {
        position: absolute;
        width: 100%;
        top: calc(100% - 1px); /* Offset below the input container */
        left: 0;
        z-index: 1201; /* On top of the panel (z-index 1200) */
    }
    #tag-suggestions:not(:empty)::before {
        content: ''; display: block; margin: 0; border-top: none; /* Remove separator */
    }
    .suggestion-list { max-height: 153px; overflow-y: auto; border: 1px solid var(--input-border-light); border-radius: 3px; /* background-color will be set dynamically */ }
    .suggestion-item .contentRow-main { padding: 8px 12px; }
    .suggestion-item:hover, .suggestion-item.is-highlighted { background-color: var(--xf-contentHighlightBg); }

    /* Disable number input spinners */
    input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    label:has(input[type="checkbox"]) { user-select: none; }

    #sf-menu-form { border: 1px solid var(--input-border-light); border-top: none;  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// --- 4. CREATE THE TRIGGER BUTTON ---
const triggerButton = document.createElement('a');
triggerButton.className = 'button'; // button--link
triggerButton.innerHTML = `<span class="button-text">Simple Filter</span>`;
triggerButton.href = "#";
targetContainer.appendChild(triggerButton);

// --- 5. PANEL CREATION AND LOGIC ---
function createSearchPanel() {
    if (searchPanel) return;

    const panel = document.createElement('div');
    panel.className = 'menu menu--wide qq-search-panel is-simple-tab';
    panel.innerHTML = `
        <div class="menu-content">
            <div id="sf-search-tabs" class="search-tabs">
                <div class="search-tab is-active" data-tab="simple">Simple Filter</div>
                <div class="search-tab" data-tab="thread">Thread Search</div>
                <div class="close-button">&times;</div>
            </div>
            <div id="sf-menu-form" class="menu-form">
                <!-- THREAD SEARCH EXCLUSIVE -->
                <div class="menu-row" data-tab-exclusive="thread">
                    <label for="thread-search-query">Search title:</label>
                    <div>
                        <input type="text" class="input" id="thread-search-query" placeholder="Search title and tags..." autocomplete="off">
                    </div>
                </div>
                <div class="menu-row no-border" data-tab-exclusive="thread">
                    <label style="align-self:flex-start;"><input type="checkbox" id="search-first-post" /> Search first post</label>
                </div>

                <!-- SHARED: Tags -->
                <div class="menu-row">
                    <label>Tags:</label>
                    <!-- Use a simple, non-flex wrapper instead of .split-2 -->
                    <div class="tag-suggestions-wrapper">
                        <div class="input tag-search-container">
                            <input type="text" id="tag-search-input" placeholder="Search tags..." autocomplete="off">
                        </div>
                        <!-- This will now appear below the div above, as intended -->
                        <div id="tag-suggestions"></div>
                    </div>
                </div>
                <div class="menu-row no-border">
                    <label style="align-self:flex-start;"><input type="checkbox" id="without-synonyms" /> Without synonyms</label>
                </div>
                <!-- SHARED: Word Count -->
                <div class="menu-row">
                    <label>Word count:</label>
                    <div class="split-2">
                        <input type="text" class="input input--number" value="0" name="min_word_count" placeholder="Min">
                        <input type="text" class="input input--number" value="0" name="max_word_count" placeholder="Max">
                    </div>
                </div>

                <!-- SIMPLE SEARCH EXCLUSIVE -->
                <div class="menu-row" data-tab-exclusive="simple">
                    <label>Sort by:</label>
                    <div class="split-2">
                        <select name="simple_order" class="input">
                                <!-- <option value="last_post_date" selected="selected">Last message</option> -->
                                <!-- <option value="title">Title</option> -->
                            <option value="word_count">Word count</option>
                            <option value="view_count">Views</option>
                            <option value="reply_count">Replies</option>
                            <option value="first_post_reaction_score">Likes count</option>
                            <option value="post_date" selected>First message</option>
                            <option value="last_threadmark">Last threadmark</option>
                            <option value="watchers">Watchers</option>
                        </select>
                        <select name="simple_direction" class="input">
                            <option value="desc" selected>Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                </div>

                <!-- THREAD SEARCH EXCLUSIVE -->
                <div class="menu-row" data-tab-exclusive="thread">
                    <label for="min-replies">Min replies:</label>
                    <div>
                        <input type="text" class="input input--number" value="0" id="min-replies">
                    </div>
                </div>

                <div class="menu-row" data-tab-exclusive="thread">
                    <label>Forums:</label>
                    <div id="ts_forum_choice" class="checkbox-row">
                        <label><input type="checkbox" name="forum_choice" value="creative" checked> Creative Writing</label>
                        <label><input type="checkbox" name="forum_choice" value="quests"> Quests</label>
                    </div>
                </div>

                <div class="menu-row" data-tab-exclusive="thread">
                    <label>Sort by:</label>
                    <div>
                        <select id="ts_thread_order" name="thread_order" class="input">
                            <option value="relevance">Relevance</option>
                            <option value="date" selected>Date</option>
                            <option value="last_update">Most recent</option>
                            <option value="replies">Most replies</option>
                            <option value="word_count">Words</option>
                        </select>
                    </div>
                </div>

                <!-- Filter Button -->
                <div class="menu-footer">
                    <span class="menu-footer-controls">
                        <button type="submit" class="button--primary button" id="advanced-search-filter-btn">
                            <span class="button-text">Filter</span>
                        </button>
                    </span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    searchPanel = panel;
    if (isSearchPage) {
        // Remove the first tab "Simple Filter"
        const simpleTab = searchPanel.querySelector('.search-tab[data-tab="simple"]');
        if (simpleTab) {
            simpleTab.remove();
        }
    }
    addPanelEventListeners();
    loadInitialFilterState(); // Load query parameters into the filter
}

function loadInitialFilterState() {
    // --- Load Shared State ---
    searchPanel.querySelector(`input[name="min_word_count"]`).value = initialMinWordCount || 0;
    searchPanel.querySelector(`input[name="max_word_count"]`).value = initialMaxWordCount || 0;
    searchPanel.querySelector(`#without-synonyms`).checked = initialWithoutSynonyms;
    if (initialTags.length > 0) {
        initialTags.forEach(tagText => {
            selectTag({ id: tagText, text: tagText });
        });
    }

    // --- Load Simple Filter State ---
    searchPanel.querySelector(`select[name="simple_order"]`).value = initialSimpleOrder;
    searchPanel.querySelector(`select[name="simple_direction"]`).value = initialSimpleDirection;

    // --- Load Thread Search State ---
    searchPanel.querySelector('#thread-search-query').value = initialThreadQuery;
    searchPanel.querySelector('#search-first-post').checked = initialThreadSearchFirstPostOnly;
    searchPanel.querySelector('#min-replies').value = initialThreadMinReplies || 0;
    searchPanel.querySelector('#ts_thread_order').value = initialThreadSortBy;
    searchPanel.querySelectorAll('#ts_forum_choice input[name="forum_choice"]').forEach(cb => {
        cb.checked = initialThreadForums.includes(cb.value);
    });

    // --- Set Initial Active Tab ---
    const tabToActivate = initialActiveTab === 'thread' ? 'thread' : 'simple';
    const tabElement = searchPanel.querySelector(`#sf-search-tabs .search-tab[data-tab="${tabToActivate}"]`);
    if (tabElement) {
        handleTabClick({ currentTarget: tabElement });
    }
}

function addPanelEventListeners() {
    searchPanel.querySelectorAll('#sf-search-tabs .search-tab').forEach(tab => tab.addEventListener('click', handleTabClick));
    searchPanel.querySelector('.close-button').addEventListener('click', hidePanel);
    const tagInput = searchPanel.querySelector('#tag-search-input');
    tagInput.addEventListener('input', handleTagInput);
    tagInput.addEventListener('focus', () => {
        const query = tagInput.value.trim();
        const suggestionsContainer = searchPanel.querySelector('#tag-suggestions');
        if (query.length >= 2 && suggestionsContainer.children.length === 0) {
            handleTagInput({ target: tagInput });
        }
    });
    tagInput.addEventListener('keydown', handleFilterKeydown);  // Must be before tag so it doesnt press filter once empty
    tagInput.addEventListener('keydown', handleTagInputKeydown); // Existing listener for suggestions
    searchPanel.querySelectorAll('input.input--number').forEach(input => {
        input.addEventListener('focus', e => e.target.select());
        input.addEventListener('keydown', handleFilterKeydown);
    });
    searchPanel.querySelector('#thread-search-query')?.addEventListener('keydown', handleFilterKeydown);
    searchPanel.querySelector('#advanced-search-filter-btn').addEventListener('click', handleFilter);
    searchPanel.addEventListener('click', (e) => {
        const suggestions = searchPanel.querySelector('#tag-suggestions');
        if (suggestions && !suggestions.contains(e.target) && e.target.id !== 'tag-search-input' && !searchPanel.querySelector('.close-button').contains(e.target)) {
            suggestions.innerHTML = '';
            clearTimeout(debounceTimer); // Clear any pending tag search
        }
    });
}

function handleTabClick(event) {
    const clickedTab = event.currentTarget;
    activeTab = clickedTab.dataset.tab;
    searchPanel.querySelectorAll('#sf-search-tabs .search-tab').forEach(t => t.classList.remove('is-active'));
    clickedTab.classList.add('is-active');
    searchPanel.classList.toggle('is-simple-tab', activeTab === 'simple');
    searchPanel.classList.toggle('is-thread-tab', activeTab === 'thread');
    // Autofocus based on active tab
    if (activeTab === 'simple') {
        // searchPanel.querySelector('#tag-search-input')?.focus();  // thread autofocus
    } else if (activeTab === 'thread') {
        // searchPanel.querySelector('#thread-search-query')?.focus();
    }
}

function togglePanel(event) {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.menu.menu--wide.menu--right.is-active')?.remove(); // close filter panel

    if (!searchPanel) createSearchPanel();
    searchPanel.classList.contains('is-active') ? hidePanel() : showPanel();
}

function showPanel() {
    const rect = triggerButton.getBoundingClientRect();
    // const panelTop = window.scrollY + rect.top -8;
    const panelTop = window.scrollY + rect.bottom + 0;
    // window.scrollTo(0, panelTop);
    searchPanel.style.top = panelTop + 'px';
    searchPanel.classList.add('is-active');
    document.addEventListener('click', closeOnClickOutside, true);

    FOCUS && searchPanel.querySelector('#tag-search-input')?.focus(); // Autofocus when panel opens
}

function hidePanel() {
    if (!searchPanel) return;
    searchPanel.classList.remove('is-active');
    searchPanel.querySelector('#tag-suggestions').innerHTML = '';
    document.removeEventListener('click', closeOnClickOutside, true);
}

function closeOnClickOutside(event) {
    if (searchPanel && !searchPanel.contains(event.target) && !triggerButton.contains(event.target)) {
        event.preventDefault(); // Prevent default action (e.g., link navigation)
        event.stopPropagation(); // Stop propagation to prevent accidental clicks on underlying elements
        hidePanel();
    }
}

// --- 6. TAG SEARCH FUNCTIONALITY ---
function handleTagInput(event) {
    clearTimeout(debounceTimer);
    const query = event.target.value.trim();
    const suggestionsContainer = searchPanel.querySelector('#tag-suggestions');
    if (query.length < 2) { suggestionsContainer.innerHTML = ''; return; }
    debounceTimer = setTimeout(() => {
        if (!xfToken) return console.error("Cannot fetch tags: _xfToken is missing.");
        const params = new URLSearchParams({ 'q': query, '_xfRequestUri': location.pathname, '_xfWithData': '1', '_xfToken': xfToken, '_xfResponseType': 'json' });
        fetch(`/misc/tag-auto-complete?${params.toString()}`)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => { if (data.results) displaySuggestions(data.results); })
            .catch(error => console.error('Error fetching tags:', error));
    }, TAG_SEARCH_DEBOUNCE_DELAY);
}

function handleTagInputKeydown(event) {
    if (event.key === 'Enter') {
        const suggestionItem = searchPanel.querySelector('.suggestion-item');
        if (suggestionItem) {
            suggestionItem.click();
            event.preventDefault(); // Prevent default form submission
            // Unfocus the input after selection
            searchPanel.querySelector('#tag-search-input').blur();
        }
    }
}

function handleFilterKeydown(event) {
    console.log(event)
    if (event.key === 'Enter') {
        const inputElement = event.target;

        if (inputElement?.id === 'tag-search-input') {
          if (inputElement.value.trim() !== '') return; // Only Filter if empty, else select the tag.
        }

        // For number inputs or empty text inputs, trigger the filter
        searchPanel.querySelector('#advanced-search-filter-btn').click();
        event.preventDefault();
    }
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = searchPanel.querySelector('#tag-suggestions');
    if (suggestions.length === 0) { suggestionsContainer.innerHTML = ''; return; }
    const suggestionList = document.createElement('div');
    suggestionList.className = 'suggestion-list';
    suggestionList.style.backgroundColor = TOP_BACKGROUND_COLOR; // Dynamically set background color
    suggestions.forEach(suggestion => {
        if (!selectedTags.has(suggestion.id)) {
            const item = document.createElement('div');
            item.className = 'suggestion-item contentRow';
            item.innerHTML = `<div class="contentRow-main">${suggestion.text}</div>`;
            item.addEventListener('click', () => selectTag(suggestion));
            suggestionList.appendChild(item);
        }
    });
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.appendChild(suggestionList);
}
function selectTag(tag) {
    selectedTags.add(tag.id);
    const tagContainer = searchPanel.querySelector('.tag-search-container');
    const tagInput = searchPanel.querySelector('#tag-search-input');
    const pill = document.createElement('span');
    pill.className = 'selected-tag';
    pill.dataset.tagId = tag.id;
    pill.innerHTML = `${tag.text}<span class="selected-tag-remove" title="Remove tag">&times;</span>`;
    pill.querySelector('.selected-tag-remove').addEventListener('click', () => {
        selectedTags.delete(tag.id);
        pill.remove();
        // tagInput.focus(); // focus when deleted
    });
    tagContainer.insertBefore(pill, tagInput);
    tagInput.value = '';
    searchPanel.querySelector('#tag-suggestions').innerHTML = '';
    tagInput.blur();
    // tagInput.focus(); // focus back in after selecting tag
}

// --- 7. FINAL FILTER ACTION ---
function handleFilter(event) {
    event.preventDefault();
    hidePanel();

    const sharedData = {
        tags: Array.from(selectedTags),
        word_count_min: parseInt(searchPanel.querySelector('input[name="min_word_count"]').value, 10) || 0,
        word_count_max: parseInt(searchPanel.querySelector('input[name="max_word_count"]').value, 10) || 0,
        without_synonyms: searchPanel.querySelector('#without-synonyms').checked,
    };

    if (activeTab === 'simple') {
        const simpleSearchData = {
            ...sharedData,
            sort_by: searchPanel.querySelector('select[name="simple_order"]').value,
            sort_direction: searchPanel.querySelector('select[name="simple_direction"]').value,
        };
        let simpleSearchURL = location.origin + location.pathname.replace(/\/page-\d+$/, ''); // strip trailing /page-2
        const params = new URLSearchParams();

        params.append('order', simpleSearchData.sort_by);
        params.append('direction', simpleSearchData.sort_direction);
        simpleSearchData.tags.forEach((tag, index) => {
            params.append(`tags[${index}]`, tag);
        });
        if (simpleSearchData.without_synonyms) {
            params.append('withoutSynonym', '1');
        }
        if (simpleSearchData.word_count_min > 0) {
            params.append('min_word_count', simpleSearchData.word_count_min);
        }
        if (simpleSearchData.word_count_max > 0) {
            params.append('max_word_count', simpleSearchData.word_count_max);
        }
        // params.append('nodes[0]', -1);

        const queryString = params.toString();
        if (queryString) {
            simpleSearchURL += `?${queryString}`;
        }

        // console.log("--- Simple Search Data ---", simpleSearchData);
        // console.log("Constructed Simple Search URL:", simpleSearchURL);
        location.href = simpleSearchURL;

    } else if (activeTab === 'thread') {
        const threadSearchData = {
            ...sharedData,
            query: searchPanel.querySelector('#thread-search-query').value,
            minimum_replies: parseInt(searchPanel.querySelector('#min-replies').value, 10) || 0,
            sort_by: searchPanel.querySelector('#ts_thread_order').value,
            search_first_post_only: searchPanel.querySelector('#search-first-post').checked,
            forums: Array.from(searchPanel.querySelectorAll('#ts_forum_choice [name="forum_choice"]:checked')).map(cb => cb.value),
        };

        // Note: Inspect the /search/search request multipart payload
        const searchForm = document.createElement('form');
        searchForm.method = 'POST';
        searchForm.action = '/search/search/';
        searchForm.style.display = 'none';

        const addInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            searchForm.appendChild(input);
        };

        addInput('_xfToken', xfToken);
        addInput('keywords', threadSearchData.query);

        if (threadSearchData.search_first_post_only) {
            addInput('c[content]', 'thread');
        } else {
            addInput('c[title_only]', '1');
        }

        addInput('c[threadmark_only]', '1');
        addInput('c[users]', '');
        addInput('c[newer_than]', '');
        addInput('c[older_than]', '');
        addInput('c[tags]', threadSearchData.tags.join(', '));
        addInput('c[excludeTags]', '');

        if (threadSearchData.word_count_min > 0) addInput('c[word_count][lower]', threadSearchData.word_count_min);
        if (threadSearchData.word_count_max > 0) addInput('c[word_count][upper]', threadSearchData.word_count_max);
        if (threadSearchData.minimum_replies > 0) addInput('c[min_reply_count]', threadSearchData.minimum_replies);

        addInput('c[child_nodes]', '1');
        addInput('order', threadSearchData.sort_by);
        addInput('grouped', '1');
        addInput('search_type', 'post');
        addInput('_xfRequestUri', '/search/?type=post');
        addInput('_xfWithData', '1');

        if (threadSearchData.forums.length > 0) {
            threadSearchData.forums.forEach(forumChoice => {
                let nodesToAppend = [];
                if (forumChoice === 'creative') nodesToAppend = FORUM_NODES.creative;
                if (forumChoice === 'quests')   nodesToAppend = FORUM_NODES.quests;
                nodesToAppend.forEach(nodeId => {
                    addInput('c[nodes][]', nodeId);
                });
            });
        }

        document.body.appendChild(searchForm);
        searchForm.submit();
    }
}

// --- 8. ATTACH THE MAIN TRIGGER ---
triggerButton.addEventListener('click', togglePanel);
