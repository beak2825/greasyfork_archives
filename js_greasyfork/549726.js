// ==UserScript==
// @name         FicTrail - AO3 History Viewer
// @namespace    https://github.com/serpentineegg/fictrail
// @version      0.4.1
// @description  Advanced search and filtering for your reading history. Find fics by title, author, fandom, tags, or summary.
// @author       serpentineegg
// @match        https://archiveofourown.org/users/*/readings*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549726/FicTrail%20-%20AO3%20History%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/549726/FicTrail%20-%20AO3%20History%20Viewer.meta.js
// ==/UserScript==


(function() {
  'use strict';

// Constants Module - Configuration and constants
const AO3_BASE_URL = 'https://archiveofourown.org';
const MAX_PAGES_FETCH = 100;
const ITEMS_PER_PAGE = 20;
const DEFAULT_PAGES_TO_LOAD = 2;
const PAGE_FETCH_DELAY = 100;
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

// Error Messages
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Uh oh! Something went wrong while fetching your reading adventures. Let\'s try again?',
  NO_DATA: 'Hmm, we didn\'t get any fic data back. Want to try that again?'
};


// Utils Module - Helper functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if we're on AO3 and user is logged in
function getUsername() {
  const greetingLink = document.querySelector('#greeting .user a[href*="/users/"]');
  if (greetingLink) {
    const href = greetingLink.getAttribute('href');
    const match = href.match(/\/users\/([^/]+)/);
    return match ? match[1] : null;
  }
  return null;
}

// Detect logged-out state based on AO3 login indicators within a fetched Document
function isLoggedOutDoc(doc) {
  const loginLink = doc.querySelector('a[href*="/users/login"]');
  const loggedOutMessage = doc.querySelector('.flash.notice');
  return Boolean(loginLink || (loggedOutMessage && loggedOutMessage.textContent.includes('log in')));
}


// Styles Module - CSS will be injected during build

function addStyles() {
    // CSS content will be injected here during build
    const css = `/* Subtitle styling */
#fictrail-subtitle {
    display: flex;
    flex-wrap: wrap;
    gap: 0 8px;
    align-items: center;
    justify-content: center;
}

#fictrail-subtitle span:not(:first-child)::before {
    content: " • ";
    margin-right: 4px;
}

/* Favorite tags summary */
#fictrail-favorite-tags-summary-container {
    text-align: center;
    font-style: italic;
}

/* === REUSABLE COMPONENTS === */
.fictrail-content-state {
    padding-top: 1em;
}

.fictrail-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid inherit;
    border-top-color: transparent;
    border-radius: 50%;
    animation: fictrail-spin 1s linear infinite;
    margin: 0 auto 1em;
    opacity: 0.6;
}

/* === LAYOUT PATTERNS === */
.fictrail-search-row {
    display: flex;
    gap: 1em;
    align-items: stretch;
}

.fictrail-search-field {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
}

.fictrail-filter-field {
    flex: 0 0 250px;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
}

.fictrail-slider-field {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 1em 0;
    align-items: center;
}

.fictrail-slider-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
}

/* === COMPONENT VARIATIONS === */
.fictrail-slider-min,
.fictrail-slider-max {
    font-size: 0.8em;
    min-width: 1.5em;
    text-align: center;
}

.fictrail-pages-section {
    margin: 1em 0;
}

.fictrail-pages-toggle {
    cursor: pointer;
    user-select: none;
    padding: 0.8em 1em;
    border-bottom: 1px solid transparent;
    transition: background-color 0.2s ease;
}

.fictrail-pages-toggle:hover,
.fictrail-pages-toggle:focus {
    background: rgba(0, 0, 0, 0.05);
}

.fictrail-toggle-header {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 1em;
}

.fictrail-toggle-icon {
    font-family: monospace;
    font-size: 0.8em;
    transition: transform 0.2s ease;
    display: inline-block;
}

/* === STATE-BASED STYLING === */
.fictrail-pages-toggle.ft-expanded .fictrail-toggle-icon {
    transform: rotate(90deg);
}

.fictrail-pages-content {
    padding: 0;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
}

.fictrail-pages-content.ft-expanded {
    padding: 1em 0 0;
    max-height: 500px;
    opacity: 1;
}

/* === CONTENT-SPECIFIC === */
.loading-content,
.error-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.error-content .actions {
    display: flex;
    justify-content: center;
}

.fictrail-fieldset {
    margin: 0;
}

.fictrail-actions {
    display: flex;
    justify-content: center;
}

.fictrail-results-counter {
    padding-top: 0.8em;
    font-size: 0.9em;
    text-align: center;
    font-style: italic;
}

.fictrail-load-more-container {
    width: 100%;
    text-align: center;
    margin-top: 1.5em;
}

.fictrail-summary {
    max-height: 120px;
    overflow-y: auto;
    padding: 0.5em;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.02);
    margin: 0.5em 0;
    line-height: 1.4;
}

.fictrail-bottom-actions {
    margin-top: 2em;
    padding-top: 1.5em;
}

.fictrail-bottom-actions .heading {
    margin-bottom: 0.5em;
}

.fictrail-bottom-actions .actions {
    display: flex;
    justify-content: center;
    margin: 0;
}

.fictrail-bottom-actions .actions li {
    margin: 0;
}

/* === ANIMATIONS === */
@keyframes fictrail-spin {
    to {
        transform: rotate(360deg);
    }
}

/* === RESPONSIVE OVERRIDES === */
@media (max-width: 768px) {
    .fictrail-search-row {
        flex-direction: column;
        align-items: stretch;
    }

    .fictrail-search-field,
    .fictrail-filter-field {
        flex: none;
        max-width: none;
    }

    .fictrail-search-field label,
    .fictrail-filter-field label {
        margin-bottom: 0.3em;
    }

    .fictrail-search-field input,
    .fictrail-filter-field select {
        margin-top: 0;
    }

    #fictrail-subtitle {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1em;
    }

    #fictrail-subtitle span:not(:first-child)::before {
        display: none;
    }

    #fictrail-favorite-tags-summary-container {
        display: none;
    }

    .fictrail-slider-field {
        align-items: normal;
    }

    .fictrail-slider-track {
        gap: 0.5em;
    }

    .fictrail-slider {
        width: 100%;
    }

    .fictrail-bottom-actions {
        margin-top: 1.5em;
        padding-top: 1em;
    }

    .fictrail-bottom-actions .heading {
        font-size: 1em;
        text-align: center;
    }
}

/* === DARK MODE === */
@media (prefers-color-scheme: dark) {
    .fictrail-summary {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
    }

    .fictrail-bottom-actions {
        border-top-color: rgba(255, 255, 255, 0.2);
    }
}

/* === LARGE SCREENS === */
@media (min-width: 1800px) {
    #fictrail-works-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5em;
        align-items: stretch;
    }

    #fictrail-works-list li.work {
        margin: 0;
        break-inside: avoid;
    }
}

/* === FOCUS AND INPUT STYLING === */
#fictrail-search-input,
#fictrail-fandom-filter {
    width: auto !important;
    max-width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.2;
}

#fictrail-search-input:focus,
#fictrail-fandom-filter:focus {
    outline: 2px solid;
    outline-color: inherit;
    outline-offset: 1px;
}

.fictrail-slider {
    width: 200px;
}

/* === WORKS LIST STYLING === */
#fictrail-works-container::after {
    content: "";
    display: table;
    clear: both;
}

#fictrail-works-list {
    margin: 1.5em 0 0;
}

#fictrail-works-list li.work {
    margin: 0 0 1em;
}`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}


// Scraper Module - AO3 history fetching and parsing

function scrapeHistoryFromPage(doc) {
  const works = [];
  const workItems = doc.querySelectorAll('ol.reading li.work');

  workItems.forEach((item) => {
    const titleLink = item.querySelector('h4.heading a[href*="/works/"]');
    const authorLink = item.querySelector('h4.heading a[rel="author"]');
    const fandomLinks = item.querySelectorAll('h5.fandoms a.tag');
    const lastVisitedEl = item.querySelector('h4.viewed.heading');
    const summaryEl = item.querySelector('.userstuff.summary');
    const statsEl = item.querySelector('.stats');
    const dateEl = item.querySelector('.datetime');
    const tagsEl = item.querySelector('.tags.commas');
    const seriesEl = item.querySelector('.series');

    // Extract required tags from the required-tags ul
    const requiredTagsEl = item.querySelector('.required-tags');

    // Extract rating
    const ratingSpan = requiredTagsEl?.querySelector('.rating');
    const ratingText = ratingSpan?.querySelector('.text')?.textContent.trim() || '';
    const ratingClass = ratingSpan?.className || '';

    // Extract warnings
    // Warnings can be:
    // 1. "Creator Chose Not To Use Archive Warnings" (single, maps to "Choose Not To Use Archive Warnings" in URL)
    //    Detected by class "warning-choosenotto"
    // 2. Multiple warnings comma-separated (e.g., "Graphic Depictions Of Violence, Major Character Death, No Archive Warnings Apply")
    //    These should be split into individual objects for the tags list, but kept together for required-tags display
    // 3. "No Archive Warnings Apply" (single)
    const warningSpans = requiredTagsEl?.querySelectorAll('.warnings') || [];
    const warnings = []; // Individual warnings for tags list (split by commas)
    const warningSpansData = []; // Original span data for required-tags display (full text + class)

    warningSpans.forEach(span => {
      const textEl = span.querySelector('.text');
      const text = textEl ? textEl.textContent.trim() : '';
      if (!text) return;

      const spanClass = span.className;
      const isChooseNotTo = span.classList.contains('warning-choosenotto');

      // Store the original span data for required-tags display (full text, single element)
      warningSpansData.push({
        text: text,
        class: spanClass
      });

      // Split by commas to create individual warning objects for tags list
      const warningTexts = text.split(',').map(w => w.trim()).filter(w => w);

      warningTexts.forEach(warningText => {
        // Special case: "Creator Chose Not To Use Archive Warnings" maps to "Choose Not To Use Archive Warnings" in URL
        // Detected by the warning-choosenotto class
        let urlText = warningText;
        if (isChooseNotTo) {
          urlText = 'Choose Not To Use Archive Warnings';
        }

        // Construct URL for the warning tag
        const url = `/tags/${encodeURIComponent(urlText)}/works`;

        warnings.push({
          text: warningText,
          url: url
        });
      });
    });

    // Extract categories
    const categorySpans = requiredTagsEl?.querySelectorAll('.category') || [];
    const categories = Array.from(categorySpans).map(span => {
      const textEl = span.querySelector('.text');
      return textEl ? textEl.textContent.trim() : '';
    }).filter(c => c);
    const categoryClasses = Array.from(categorySpans).map(el => el.className);

    // Extract status (Complete/WIP)
    const statusSpan = requiredTagsEl?.querySelector('.iswip');
    const status = statusSpan?.querySelector('.text')?.textContent.trim() || '';
    const statusClass = statusSpan?.className || '';

    if (titleLink) {
      // Extract last visited date
      let lastVisited = '';
      if (lastVisitedEl) {
        const fullText = lastVisitedEl.textContent;
        const dateMatch = fullText.match(/Last visited:\s*([^(]+)/);
        if (dateMatch) {
          lastVisited = dateMatch[1].trim();
        }
      }

      // Extract stats
      const stats = {};
      if (statsEl) {
        stats.language = statsEl.querySelector('dd.language')?.textContent.trim() || '';
        stats.words = statsEl.querySelector('dd.words')?.textContent.trim() || '';
        stats.chapters = statsEl.querySelector('dd.chapters')?.textContent.trim() || '';
        stats.collections = statsEl.querySelector('dd.collections')?.textContent.trim() || '';
        stats.comments = statsEl.querySelector('dd.comments')?.textContent.trim() || '';
        stats.kudos = statsEl.querySelector('dd.kudos')?.textContent.trim() || '';
        stats.bookmarks = statsEl.querySelector('dd.bookmarks')?.textContent.trim() || '';
        stats.hits = statsEl.querySelector('dd.hits')?.textContent.trim() || '';
      }

      // Extract series information
      const series = [];
      if (seriesEl) {
        const seriesLinks = seriesEl.querySelectorAll('li');
        seriesLinks.forEach(li => {
          const seriesLink = li.querySelector('a[href*="/series/"]');
          const partMatch = li.textContent.match(/Part\s+(\d+)\s+of/);
          if (seriesLink && partMatch) {
            series.push({
              title: seriesLink.textContent.trim(),
              url: AO3_BASE_URL + seriesLink.getAttribute('href'),
              part: partMatch[1]
            });
          }
        });
      }

      const work = {
        title: titleLink.textContent.trim(),
        url: AO3_BASE_URL + titleLink.getAttribute('href'),
        author: authorLink ? authorLink.textContent.trim() : 'Anonymous',
        authorUrl: authorLink ? AO3_BASE_URL + authorLink.getAttribute('href') : null,
        fandoms: Array.from(fandomLinks).map(link => ({
          text: link.textContent.trim(),
          url: link.getAttribute('href')
        })),
        lastVisited: lastVisited,
        summary: summaryEl ? summaryEl.innerHTML : '',
        publishDate: dateEl ? dateEl.textContent.trim() : '',
        tags: tagsEl ? Array.from(tagsEl.querySelectorAll('a.tag')).map(tag => ({
          text: tag.textContent.trim(),
          url: tag.getAttribute('href')
        })) : [],
        relationships: tagsEl ? Array.from(tagsEl.querySelectorAll('.relationships a.tag')).map(rel => ({
          text: rel.textContent.trim(),
          url: rel.getAttribute('href')
        })) : [],
        characters: tagsEl ? Array.from(tagsEl.querySelectorAll('.characters a.tag')).map(char => ({
          text: char.textContent.trim(),
          url: char.getAttribute('href')
        })) : [],
        freeforms: tagsEl ? Array.from(tagsEl.querySelectorAll('.freeforms a.tag')).map(tag => ({
          text: tag.textContent.trim(),
          url: tag.getAttribute('href')
        })) : [],
        // Required tags with text and CSS classes
        rating: ratingText,
        ratingClass: ratingClass,
        warnings: warnings, // Individual warnings for tags list (split)
        warningSpans: warningSpansData, // Original span data for required-tags display (full text + class)
        categories: categories,
        categoryClasses: categoryClasses,
        status: status,
        statusClass: statusClass,
        // Stats and series
        stats: stats,
        series: series
      };
      works.push(work);
    }
  });

  return works;
}

async function fetchHistoryPage(username, page = 1) {
  const url = `${AO3_BASE_URL}/users/${username}/readings?page=${page}`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check logged-out state using shared helper
    if (isLoggedOutDoc(doc)) {
      throw new Error('NOT_LOGGED_IN');
    }

    return scrapeHistoryFromPage(doc);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    if (error.message === 'NOT_LOGGED_IN') {
      throw error;
    }
    return [];
  }
}

function getTotalPages(doc = document) {
  const pagination = doc.querySelector('.pagination');
  if (!pagination) return 1;

  const pageLinks = pagination.querySelectorAll('a');
  let maxPage = 1;

  pageLinks.forEach(link => {
    const pageNum = parseInt(link.textContent.trim());
    if (!isNaN(pageNum) && pageNum > maxPage) {
      maxPage = pageNum;
    }
  });

  const nextLink = pagination.querySelector('a[rel="next"]');
  if (nextLink && maxPage === 1) {
    maxPage = 2;
  }

  return maxPage;
}

async function fetchMultiplePagesWithCache(username, maxPagesToFetch = MAX_PAGES_FETCH) {
  let totalPages = cachedTotalPages;
  const works = [];

  // Determine which pages we need to fetch
  const cachedPages = getMaxCachedPage();
  const startPage = isCacheValid() ? Math.max(1, cachedPages + 1) : 1;
  const endPage = Math.min(maxPagesToFetch, totalPages || MAX_PAGES_FETCH);

  // If we need to fetch page 1 or cache is invalid, start fresh
  if (startPage === 1 || !isCacheValid()) {
    console.log('Fetching fresh data starting from page 1');
    clearCache();

    try {
      const firstPageUrl = `${AO3_BASE_URL}/users/${username}/readings?page=1`;
      const response = await fetch(firstPageUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      if (isLoggedOutDoc(doc)) {
        throw new Error('NOT_LOGGED_IN');
      }

      totalPages = getTotalPages(doc);
      cachedTotalPages = totalPages;
      cacheTimestamp = Date.now();

      const firstPageWorks = scrapeHistoryFromPage(doc);
      pageCache.set(1, { works: firstPageWorks, timestamp: Date.now() });
      works.push(...firstPageWorks);

      console.log(`Cached page 1 with ${firstPageWorks.length} works`);
    } catch (error) {
      console.error('Error fetching first page:', error);
      if (error.message === 'NOT_LOGGED_IN') {
        throw error;
      }
      return { works: [], totalPages: 1 };
    }
  } else {
    // Use existing cached data
    console.log(`Using cached data for pages 1-${cachedPages}`);
    for (let page = 1; page <= Math.min(cachedPages, maxPagesToFetch); page++) {
      if (pageCache.has(page)) {
        works.push(...pageCache.get(page).works);
      }
    }
  }

  // Fetch additional pages if needed
  const actualStartPage = Math.max(startPage, 2);
  const pagesToFetch = Math.min(maxPagesToFetch, totalPages || MAX_PAGES_FETCH);

  if (actualStartPage <= pagesToFetch) {
    console.log(`Fetching pages ${actualStartPage}-${pagesToFetch}`);

    for (let page = actualStartPage; page <= pagesToFetch; page++) {
      // Skip if we already have this page cached
      if (pageCache.has(page)) {
        console.log(`Page ${page} already cached, skipping`);
        continue;
      }

      showFicTrailLoading(`Loading page ${page} of ${pagesToFetch}...`);
      const pageWorks = await fetchHistoryPage(username, page);

      if (pageWorks.length > 0) {
        pageCache.set(page, { works: pageWorks, timestamp: Date.now() });
        works.push(...pageWorks);
        console.log(`Cached page ${page} with ${pageWorks.length} works`);
      }

      await new Promise(resolve => setTimeout(resolve, PAGE_FETCH_DELAY));
    }
  }

  console.log(`Total works loaded: ${works.length} from ${Math.min(maxPagesToFetch, totalPages || 1)} pages`);
  console.log(`Cache now contains ${pageCache.size} pages`);

  return { works: works, totalPages: totalPages || 1 };
}


// Search Module - Search and filtering functionality
function performSearch() {
  const query = document.getElementById('fictrail-search-input').value.toLowerCase().trim();

  if (query === '') {
    filteredWorks = [...allWorks];
    filteredWorks.forEach(work => {
      work.matchingTags = [];
    });
    // Apply filter which will show the count
    applyFilter();
    return;
  } else {
    filteredWorks = allWorks.filter(work => {
      const matchingTags = [];

      if (work.relationships) {
        work.relationships.forEach(rel => {
          if (rel.text.toLowerCase().includes(query)) {
            matchingTags.push({
              type: 'relationship',
              value: rel.text,
              url: rel.url
            });
          }
        });
      }
      if (work.characters) {
        work.characters.forEach(char => {
          if (char.text.toLowerCase().includes(query)) {
            matchingTags.push({
              type: 'character',
              value: char.text,
              url: char.url
            });
          }
        });
      }
      if (work.freeforms) {
        work.freeforms.forEach(tag => {
          if (tag.text.toLowerCase().includes(query)) {
            matchingTags.push({
              type: 'freeform',
              value: tag.text,
              url: tag.url
            });
          }
        });
      }


      work.matchingTags = matchingTags;

      // Extract text from HTML summary for searching
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = work.summary || '';
      const summaryText = tempDiv.textContent || tempDiv.innerText || '';

      return work.title.toLowerCase().includes(query) ||
                     work.author.toLowerCase().includes(query) ||
                     work.fandoms.some(fandom => fandom.text.toLowerCase().includes(query)) ||
                     summaryText.toLowerCase().includes(query) ||
                     matchingTags.length > 0 ||
                     (work.tags && work.tags.some(tag => tag.text.toLowerCase().includes(query)));
    });
  }

  applyFilter();
}

function applyFilter() {
  const selectedFandom = document.getElementById('fictrail-fandom-filter').value;

  let worksToDisplay = [...filteredWorks];
  if (selectedFandom) {
    worksToDisplay = worksToDisplay.filter(work =>
      work.fandoms.some(fandom => fandom.text === selectedFandom)
    );
  }

  worksToDisplay.sort((a, b) => {
    if (a.lastVisited && b.lastVisited) {
      return new Date(b.lastVisited) - new Date(a.lastVisited);
    }
    return 0;
  });

  // Reset pagination for new search/filter
  currentDisplayCount = ITEMS_PER_PAGE;

  // Show results count
  updateResultsCount(worksToDisplay.length);
  displayWorks(worksToDisplay);
}

function updateResultsCount(count) {
  const resultsCountElement = document.getElementById('fictrail-results-count');
  if (resultsCountElement) {
    if (count > 0) {
      resultsCountElement.textContent = `${count} result${count === 1 ? '' : 's'}`;
      resultsCountElement.style.display = 'block';
    } else {
      resultsCountElement.style.display = 'none';
    }
  }
}

function populateFandomFilter(works) {
  const fandomFilter = document.getElementById('fictrail-fandom-filter');
  const allFandoms = new Set();
  works.forEach(work => {
    work.fandoms.forEach(fandom => {
      allFandoms.add(fandom.text);
    });
  });

  const sortedFandoms = Array.from(allFandoms).sort((a, b) => a.localeCompare(b));
  fandomFilter.innerHTML = '<option value="">All Fandoms</option>';

  sortedFandoms.forEach(fandom => {
    const option = document.createElement('option');
    option.value = fandom;
    option.textContent = fandom;
    fandomFilter.appendChild(option);
  });
}


// UI Module - DOM creation and event handling

// HTML Template Functions
const Templates = {
  workItem(work, index) {
    return `
      <li id="work_${work.url.match(/\/works\/(\d+)/)?.[1] || 'unknown'}" 
          class="reading work blurb group work-${work.url.match(/\/works\/(\d+)/)?.[1] || 'unknown'}" 
          role="article">
        ${this.workHeader(work)}
        ${this.workTags(work)}
        ${this.workSummary(work)}
        ${this.workSeries(work)}
        ${this.workStats(work)}
        ${this.workUserModule(work)}
      </li>
    `;
  },

  workHeader(work) {
    // Get current search query for highlighting
    const searchInput = document.getElementById('fictrail-search-input');
    const searchQuery = searchInput ? searchInput.value.trim() : '';

    // Apply highlighting to title and author
    const highlightedTitle = searchQuery ?
      highlightSearchTerms(escapeHtml(work.title), searchQuery) :
      escapeHtml(work.title);

    const highlightedAuthor = searchQuery ?
      highlightSearchTerms(escapeHtml(work.author), searchQuery) :
      escapeHtml(work.author);

    return `
      <div class="header module">
        <h4 class="heading">
          <a href="${work.url}" target="_blank" rel="noopener">${highlightedTitle}</a>
          by
          ${work.authorUrl
      ? `<a rel="author" href="${work.authorUrl}" target="_blank" rel="noopener">${highlightedAuthor}</a>`
      : highlightedAuthor
    }
        </h4>
        ${this.workFandoms(work)}
        ${this.workRequiredTags(work)}
        ${work.publishDate ? `<p class="datetime">${escapeHtml(work.publishDate)}</p>` : ''}
      </div>
    `;
  },

  workFandoms(work) {
    // Get current search query for highlighting
    const searchInput = document.getElementById('fictrail-search-input');
    const searchQuery = searchInput ? searchInput.value.trim() : '';

    return `
      <h5 class="fandoms heading">
        <span class="landmark">Fandoms:</span>
        ${work.fandoms.map(fandom => {
      const highlightedFandom = searchQuery ?
        highlightSearchTerms(escapeHtml(fandom.text), searchQuery) :
        escapeHtml(fandom.text);

      return `<a class="tag" href="${fandom.url}" target="_blank" rel="noopener">${highlightedFandom}</a>`;
    }).join(', ')}
        &nbsp;
      </h5>
    `;
  },

  workRequiredTags(work) {
    const tags = [];

    if (work.rating && work.ratingClass) {
      tags.push(this.requiredTag(work.rating, work.ratingClass));
    }

    // Use warningSpans for required-tags display (single element per span with full text)
    if (work.warningSpans && work.warningSpans.length > 0) {
      work.warningSpans.forEach(warningSpan => {
        tags.push(this.requiredTag(warningSpan.text, warningSpan.class || ''));
      });
    }

    if (work.categories && work.categoryClasses) {
      work.categories.forEach((category, index) => {
        tags.push(this.requiredTag(category, work.categoryClasses[index] || ''));
      });
    }

    if (work.status && work.statusClass) {
      tags.push(this.requiredTag(work.status, work.statusClass));
    }

    return tags.length > 0 ? `<ul class="required-tags">${tags.join('')}</ul>` : '';
  },

  requiredTag(title, cssClass) {
    return `
      <li>
        <a class="help symbol question modal modal-attached" 
           title="Symbols key" 
           href="/help/symbols-key.html" 
           aria-controls="modal">
          <span class="${cssClass}" title="${escapeHtml(title)}">
            <span class="text">${escapeHtml(title)}</span>
          </span>
        </a>
      </li>
    `;
  },

  workTags(work) {
    const tagsToShow = getTagsToDisplay(work);
    if (tagsToShow.length === 0) return '';

    return `
      <h6 class="landmark heading">Tags</h6>
      <ul class="tags commas">
        ${tagsToShow.map(tag => this.tagItem(tag)).join(' ')}
      </ul>
    `;
  },

  tagItem(tag) {
    const cssClass = getTagCssClass(tag.type);
    const tagValue = tag.value || tag.text;
    const tagUrl = tag.url || `/tags/${encodeURIComponent(tagValue)}/works`;
    let escapedValue = escapeHtml(tagValue);

    // Highlight search terms if there's a search query
    const searchInput = document.getElementById('fictrail-search-input');
    const searchQuery = searchInput ? searchInput.value.trim() : '';
    if (searchQuery) {
      escapedValue = highlightSearchTerms(escapedValue, searchQuery);
    }

    return `
      <li class="${cssClass}">
        <a class="tag" 
           href="${tagUrl}" 
           target="_blank" 
           rel="noopener">${escapedValue}</a>
      </li>
    `;
  },

  workSummary(work) {
    if (!work.summary) return '';

    let summaryHTML = work.summary;
    const searchInput = document.getElementById('fictrail-search-input');
    if (searchInput && searchInput.value.trim()) {
      summaryHTML = highlightSearchTerms(summaryHTML, searchInput.value.trim());
    }

    return `
      <h6 class="landmark heading">Summary</h6>
      <blockquote class="userstuff summary fictrail-summary">
        ${summaryHTML}
      </blockquote>
    `;
  },

  workSeries(work) {
    if (!work.series || work.series.length === 0) return '';

    return `
      <h6 class="landmark heading">Series</h6>
      <ul class="series">
        ${work.series.map(series => `
          <li>
            Part <strong>${series.part}</strong> of 
            <a href="${series.url}" target="_blank" rel="noopener">${escapeHtml(series.title)}</a>
          </li>
        `).join('')}
      </ul>
    `;
  },

  workStats(work) {
    const stats = work.stats || {};
    const hasStats = Object.values(stats).some(value => value && value.trim());
    if (!hasStats) return '';

    const statItems = [];
    const statFields = [
      { key: 'language', label: 'Language' },
      { key: 'words', label: 'Words' },
      { key: 'chapters', label: 'Chapters' },
      { key: 'collections', label: 'Collections' },
      { key: 'comments', label: 'Comments' },
      { key: 'kudos', label: 'Kudos' },
      { key: 'bookmarks', label: 'Bookmarks' },
      { key: 'hits', label: 'Hits' }
    ];

    statFields.forEach(field => {
      if (stats[field.key]) {
        statItems.push(`
          <dt class="${field.key.toLowerCase()}">${field.label}:</dt>
          <dd class="${field.key.toLowerCase()}" ${field.key === 'language' ? 'lang="en"' : ''}>
            ${escapeHtml(stats[field.key])}
          </dd>
        `);
      }
    });

    return statItems.length > 0 ? `<dl class="stats">${statItems.join('')}</dl>` : '';
  },

  workUserModule(work) {
    return `
      <div class="user module group">
        <h4 class="viewed heading">
          <span>Last visited:</span> ${work.lastVisited || 'Unknown'}
        </h4>
      </div>
    `;
  },

  loadMoreSection(works, currentCount) {
    const remainingCount = works.length - currentCount;
    const nextBatchSize = Math.min(ITEMS_PER_PAGE, remainingCount);

    return {
      message: `<p>Showing ${currentCount} of ${works.length} ${works.length === 1 ? 'result' : 'results'}</p>`,
      buttonText: `Load ${nextBatchSize} More ${nextBatchSize === 1 ? 'Result' : 'Results'}`
    };
  },

  favoriteTagsSummary(tag) {
    return `So you've been really into ${escapeHtml(tag)} lately. Love it for you.`;
  }
};

// DOM Element Creation Functions
const DOMHelpers = {
  createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  },

  createButton(id, text, clickHandler, keydownHandler = null) {
    const button = this.createElement('a', {
      id,
      style: { cursor: 'pointer' },
      tabIndex: 0
    }, text);

    button.addEventListener('click', clickHandler);

    if (keydownHandler) {
      button.addEventListener('keydown', keydownHandler);
    } else {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickHandler();
        }
      });
    }

    return button;
  }
};

// Create FicTrail button - try history page placement first
function createFicTrailButton() {
  // Only add to history page if we're on the readings page
  if (window.location.pathname.includes('/readings')) {
    addToHistoryPage();
  }
}

// Add FicTrail button in front of "Full History" in subnav
function addToHistoryPage() {
  const subNav = document.querySelector('ul.navigation.actions[role="navigation"]');
  if (!subNav) return false;

  const listItem = DOMHelpers.createElement('li');
  const button = DOMHelpers.createButton('fictrail-history-btn', 'FicTrail', openFicTrail);

  listItem.appendChild(button);
  subNav.insertBefore(listItem, subNav.firstChild);

  return true;
}

// Update navigation links with current user's URLs
function updateNavigationLinks() {
  const username = getUsername();
  if (!username) {
    console.warn('Could not determine username for navigation links');
    return;
  }

  const fullHistoryLink = document.getElementById('fictrail-full-history-link');
  const markedLaterLink = document.getElementById('fictrail-marked-later-link');
  const clearHistoryLink = document.getElementById('fictrail-clear-history-link');

  if (fullHistoryLink) {
    fullHistoryLink.href = `/users/${username}/readings`;
  }
  if (markedLaterLink) {
    markedLaterLink.href = `/users/${username}/readings?show=to-read`;
  }
  if (clearHistoryLink) {
    clearHistoryLink.href = `/users/${username}/readings/clear`;
  }
}

// Create FicTrail content inside #main
function createOverlay() {
  // Check if overlay already exists
  if (document.getElementById('fictrail-container')) return;

  const mainElement = document.getElementById('main');
  if (!mainElement) {
    console.error('Could not find #main element');
    return;
  }

  // Create FicTrail container
  const fictrailDiv = DOMHelpers.createElement('div', {
    id: 'fictrail-container'
  });

  // HTML template will be injected here during build
  fictrailDiv.innerHTML = `<!--Descriptive page name, messages and instructions-->
<h2 class="heading">
    History + FicTrail
</h2>
<!--/descriptions-->

<!--subnav-->
<ul class="navigation actions" role="navigation">
    <li>
        <span class="current">FicTrail</span>
    </li>
    <li>
        <a id="fictrail-full-history-link" href="">Full History</a>
    </li>
    <li>
        <a id="fictrail-marked-later-link" href="">Marked for Later</a>
    </li>
    <li>
        <a id="fictrail-clear-history-link" data-confirm="Are you sure you want to clear your History and Marked for Later lists? This cannot be undone!"
           rel="nofollow" data-method="post" href="">Clear History</a>
    </li>
</ul>
<!--/subnav-->

<!--main content-->
<h3 class="landmark heading">
    History Items + FicTrail
</h3>

<!-- Loading State -->
<div id="fictrail-loading" class="fictrail-content-state" style="display: none;">
    <div class="loading-content">
        <div class="fictrail-spinner"></div>
        <h3>Summoning your fic history...</h3>
        <p id="fictrail-loading-status">Diving deep into your AO3 rabbit hole...</p>
    </div>
</div>

<!-- Error State -->
<div id="fictrail-error" class="fictrail-content-state" style="display: none;">
    <div class="error-content">
        <h3>Plot Twist!</h3>
        <p id="fictrail-error-message">Something went wrong...</p>
        <div class="actions">
            <a id="fictrail-retry-btn" style="cursor: pointer;" tabindex="0">Try Again (Please?)</a>
        </div>
    </div>
</div>

<!-- Search Results State -->
<div id="fictrail-results" class="fictrail-content-state" style="display: none;">
    <div id="fictrail-subtitle" class="subtitle">
        <span id="fictrail-works-count"></span>
        <span id="fictrail-fandoms-count"></span>
        <span id="fictrail-authors-count"></span>
    </div>
    <div id="fictrail-favorite-tags-summary-container"></div>

    <!-- Search and Filter Form -->
    <form class="fictrail-form">
        <fieldset class="fictrail-fieldset">
            <legend>Search and Filter</legend>
            <div class="fictrail-search-row">
                <div class="fictrail-search-field">
                    <label for="fictrail-search-input">Search</label>
                    <input type="text" id="fictrail-search-input"
                           placeholder="Search works, authors, fandoms, tags..."/>
                </div>
                <div class="fictrail-filter-field">
                    <label for="fictrail-fandom-filter">Fandom</label>
                    <select id="fictrail-fandom-filter">
                        <option value="">All Fandoms</option>
                    </select>
                </div>
            </div>
        </fieldset>
    </form>

    <!-- Pages Loaded Info - Collapsible -->
    <div id="fictrail-pages-info" class="fictrail-pages-section" style="display: none;">
        <!-- Toggle Header -->
        <div class="fictrail-pages-toggle" id="fictrail-pages-toggle" tabindex="0">
            <div class="fictrail-toggle-header">
                <span class="fictrail-toggle-icon">▶</span>
                <span class="fictrail-toggle-text" id="fictrail-toggle-text">History Pages Loaded</span>
            </div>
        </div>

        <!-- Collapsible Content -->
        <div class="fictrail-pages-content" id="fictrail-pages-content">
            <form class="fictrail-form">
                <fieldset class="fictrail-fieldset">
                    <p class="note">Loading many pages can be slow. Start with fewer pages for better performance,
                        then reload with more if needed.</p>

                    <div class="fictrail-slider-field">
                        <label for="fictrail-pages-slider" class="fictrail-slider-label">Pages to load</label>
                        <div class="fictrail-slider-track">
                            <span class="fictrail-slider-min">1</span>
                            <input type="range" id="fictrail-pages-slider" min="1" max="100" value="1"
                                   class="fictrail-slider"/>
                            <span class="fictrail-slider-max">100</span>
                        </div>
                    </div>

                    <div class="fictrail-actions actions">
                        <a id="fictrail-load-btn" style="cursor: pointer;" tabindex="0">Load History</a>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>

    <!-- Results Counter -->
    <div id="fictrail-results-count" class="fictrail-results-counter"></div>

    <!-- Works List -->
    <div id="fictrail-works-container" style="display: none;">
        <ol id="fictrail-works-list" class="reading work index group"></ol>
    </div>

    <!-- Load More Container -->
    <div id="fictrail-load-more-container" class="fictrail-load-more-container" style="display: none;">
        <div id="fictrail-load-more-message"></div>
        <div class="actions">
            <a id="fictrail-load-more-button" style="cursor: pointer;" tabindex="0"></a>
        </div>
    </div>

    <!-- No Results -->
    <div id="fictrail-no-results" class="notice" style="display: none;">
        <h4>No Results Found</h4>
        <span>Your search came up empty! Try different keywords or maybe you haven't read that trope yet?</span>
    </div>

    <!-- Bottom Actions with Top Button -->
    <div id="fictrail-bottom-actions" class="fictrail-bottom-actions" style="display: none;">
        <h3 class="landmark heading">Actions</h3>
        <ul class="actions" role="navigation">
            <li><a id="fictrail-top-btn" href="#main" style="cursor: pointer;" tabindex="0">↑ Top</a></li>
        </ul>
    </div>
</div>
<!--/content-->`;

  // Insert FicTrail inside #main
  mainElement.appendChild(fictrailDiv);

  // Update navigation links with current user's URLs
  updateNavigationLinks();

  // Set default slider value after creating the overlay
  setTimeout(() => {
    const slider = document.getElementById('fictrail-pages-slider');
    if (slider) {
      slider.value = DEFAULT_PAGES_TO_LOAD;
      updateReloadButtonText();
    }
  }, 0);

  // Add event listeners
  attachEventListeners();
}

// Centralized event listener attachment
function attachEventListeners() {
  const eventMap = [
    { id: 'fictrail-load-btn', event: 'click', handler: reloadHistory },
    { id: 'fictrail-retry-btn', event: 'click', handler: reloadHistory },
    { id: 'fictrail-search-input', event: 'input', handler: debounce(performSearch, 300) },
    { id: 'fictrail-fandom-filter', event: 'change', handler: applyFilter },
    { id: 'fictrail-pages-slider', event: 'input', handler: updatePagesValue },
    { id: 'fictrail-pages-toggle', event: 'click', handler: togglePagesSection },
    { id: 'fictrail-top-btn', event: 'click', handler: scrollToTop }
  ];

  eventMap.forEach(({ id, event, handler }) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, handler);

      // Add keyboard support for clickable elements
      if (event === 'click') {
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
          }
        });
      }
    }
  });
}

function openFicTrail() {
  if (!document.getElementById('fictrail-container')) {
    createOverlay();
  }

  const mainElement = document.getElementById('main');
  const fictrailContainer = document.getElementById('fictrail-container');

  if (mainElement) {
    Array.from(mainElement.children).forEach(child => {
      if (child.id !== 'fictrail-container') {
        child.style.display = 'none';
      }
    });
  }

  if (fictrailContainer) fictrailContainer.style.display = 'block';

  // Check if we have valid cached data
  if (isCacheValid() && getCachedPageCount() > 0) {
    console.log('Reopening FicTrail with cached data');
    const works = [];
    const maxCachedPage = getMaxCachedPage();

    // Load all cached works
    for (let page = 1; page <= maxCachedPage; page++) {
      if (pageCache.has(page)) {
        works.push(...pageCache.get(page).works);
      }
    }

    if (works.length > 0) {
      displayHistory(getUsername(), works, cachedTotalPages, maxCachedPage);
      return;
    }
  }

  // No valid cache or no works, load fresh data
  if (allWorks.length === 0) {
    showFicTrailLoading();
    setTimeout(() => {
      reloadHistory();
    }, 100);
  } else {
    showFicTrailResults();
  }
}

// Helper functions to show different content states
function showFicTrailState(stateId) {
  const states = ['fictrail-loading', 'fictrail-error', 'fictrail-results'];

  states.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = id === stateId ? 'block' : 'none';
    }
  });
}

function showFicTrailLoading(message = 'Summoning your fic history...') {
  showFicTrailState('fictrail-loading');
  const statusElement = document.getElementById('fictrail-loading-status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function showFicTrailError(message) {
  showFicTrailState('fictrail-error');
  const errorElement = document.getElementById('fictrail-error-message');
  if (errorElement) {
    errorElement.innerHTML = message;
  }
}

function showFicTrailResults() {
  showFicTrailState('fictrail-results');

  // Show bottom actions when results are displayed
  const bottomActions = document.getElementById('fictrail-bottom-actions');
  if (bottomActions) {
    bottomActions.style.display = 'block';
  }
}

function updatePagesValue() {
  updateReloadButtonText();
}

function updateReloadButtonText() {
  const slider = document.getElementById('fictrail-pages-slider');
  if (!slider) return;

  const currentPages = parseInt(slider.value);
  const pagesInfo = document.getElementById('fictrail-pages-info');
  const loadBtn = document.getElementById('fictrail-load-btn');

  if (!loadBtn) return;

  // Check if we're in reload mode (pagesInfo is visible)
  if (pagesInfo && pagesInfo.style.display === 'block') {
    loadBtn.textContent = `Reload History (${currentPages} ${currentPages === 1 ? 'page' : 'pages'})`;
  }
}

function getPagesToLoad() {
  const slider = document.getElementById('fictrail-pages-slider');
  // If slider doesn't exist yet, use default
  if (!slider) return DEFAULT_PAGES_TO_LOAD;
  return parseInt(slider.value);
}

function displayWorks(works, append = false) {
  const worksListContainer = document.getElementById('fictrail-works-container');
  const worksList = document.getElementById('fictrail-works-list');
  const noResults = document.getElementById('fictrail-no-results');
  const bottomActions = document.getElementById('fictrail-bottom-actions');

  if (works.length === 0) {
    worksListContainer.style.display = 'none';
    noResults.style.display = 'block';
    hideLoadMoreButton();
    // Hide bottom actions when no results
    if (bottomActions) bottomActions.style.display = 'none';
    return;
  }

  worksListContainer.style.display = 'block';
  noResults.style.display = 'none';
  // Show bottom actions when there are results
  if (bottomActions) bottomActions.style.display = 'block';

  // Reset display count if not appending (new search/filter)
  if (!append) {
    currentDisplayCount = ITEMS_PER_PAGE;
  }

  const worksToShow = works.slice(0, currentDisplayCount);
  const hasMoreResults = works.length > currentDisplayCount;

  // Generate HTML for works to display
  const worksToRender = worksToShow.slice(append ? currentDisplayCount - ITEMS_PER_PAGE : 0);
  const worksHTML = worksToRender.map((work, index) => Templates.workItem(work, index)).join('');

  if (append) {
    worksList.insertAdjacentHTML('beforeend', worksHTML);
  } else {
    worksList.innerHTML = worksHTML;
  }

  // Show or hide load more button based on remaining results
  if (hasMoreResults) {
    showLoadMoreButton(works, currentDisplayCount);
  } else {
    hideLoadMoreButton();
  }
}

function loadMoreWorks() {
  currentDisplayCount += ITEMS_PER_PAGE;
  displayWorks(filteredWorks, true);
}

function addFavoriteTagsSummary(works) {
  // Only consider the most recent works (approximately first 2 pages worth)
  const recentWorksLimit = 40;
  const recentWorks = works.slice(0, recentWorksLimit);

  // Count all tags across recent works only
  const tagCounts = {};

  recentWorks.forEach(work => {
    // Count relationships, characters, and freeforms
    ['relationships', 'characters', 'freeforms'].forEach(tagType => {
      if (work[tagType]) {
        work[tagType].forEach(tag => {
          tagCounts[tag.text] = (tagCounts[tag.text] || 0) + 1;
        });
      }
    });
  });

  // Sort tags by frequency and get the most popular one
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (sortedTags.length > 0) {
    // Remove existing summary if it exists
    const existingSummary = document.getElementById('fictrail-favorite-tags-summary');
    if (existingSummary) {
      existingSummary.remove();
    }

    // Get the most popular tag and create summary element
    const [mostPopularTag] = sortedTags[0];
    const summaryDiv = DOMHelpers.createElement('p', {
      id: 'fictrail-favorite-tags-summary'
    });
    summaryDiv.innerHTML = Templates.favoriteTagsSummary(mostPopularTag);

    // Insert in the designated container
    const summaryContainer = document.getElementById('fictrail-favorite-tags-summary-container');
    if (summaryContainer) {
      summaryContainer.appendChild(summaryDiv);
    }
  }
}

/**
 * Determines which tags to display based on search state
 * @param {Object} work - The work object
 * @returns {Array} Array of tag objects with type and value
 */
function getTagsToDisplay(work) {
  const searchInput = document.getElementById('fictrail-search-input');
  const hasSearchQuery = searchInput && searchInput.value.trim();

  // Always include warnings
  const warningTags = (work.warnings || []).map(tag => ({
    type: 'warning',
    value: tag.text,
    url: tag.url
  }));

  if (hasSearchQuery) {
    // Show warnings plus matching tags during search
    const matchingTags = work.matchingTags || [];
    // Filter out warnings from matchingTags to avoid duplicates
    const nonWarningMatchingTags = matchingTags.filter(tag => tag.type !== 'warning');
    return [...warningTags, ...nonWarningMatchingTags];
  } else {
    // Show all tags when no search query
    return [
      ...warningTags,
      ...(work.relationships || []).map(tag => ({ type: 'relationship', value: tag.text, url: tag.url })),
      ...(work.characters || []).map(tag => ({ type: 'character', value: tag.text, url: tag.url })),
      ...(work.freeforms || []).map(tag => ({ type: 'freeform', value: tag.text, url: tag.url }))
    ];
  }
}

/**
 * Gets the CSS class name for a tag type
 * @param {string} tagType - The type of tag (warning, relationship, character, freeform)
 * @returns {string} The CSS class name
 */
function getTagCssClass(tagType) {
  const classMap = {
    'relationship': 'relationships',
    'character': 'characters',
    'freeform': 'freeforms',
    'warning': 'warnings'
  };
  return classMap[tagType] || '';
}

function showLoadMoreButton(works, currentCount) {
  const loadMoreContainer = document.getElementById('fictrail-load-more-container');
  const loadMoreMessage = document.getElementById('fictrail-load-more-message');
  const loadMoreButton = document.getElementById('fictrail-load-more-button');

  if (!loadMoreContainer || !loadMoreMessage || !loadMoreButton) return;

  const loadMoreContent = Templates.loadMoreSection(works, currentCount);

  // Update message and button
  loadMoreMessage.innerHTML = loadMoreContent.message;
  loadMoreButton.textContent = loadMoreContent.buttonText;

  // Show the container
  loadMoreContainer.style.display = 'block';

  // Remove existing event listeners and add new one
  const newButton = loadMoreButton.cloneNode(true);
  loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton);

  // Add event listeners
  newButton.addEventListener('click', loadMoreWorks);
  newButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      loadMoreWorks();
    }
  });
}

function hideLoadMoreButton() {
  const loadMoreContainer = document.getElementById('fictrail-load-more-container');
  if (loadMoreContainer) {
    loadMoreContainer.style.display = 'none';
  }
}

function togglePagesSection() {
  const toggle = document.getElementById('fictrail-pages-toggle');
  const content = document.getElementById('fictrail-pages-content');

  if (!toggle || !content) return;

  const isExpanded = content.classList.contains('ft-expanded');

  if (isExpanded) {
    // Collapse
    toggle.classList.remove('ft-expanded');
    content.classList.remove('ft-expanded');
  } else {
    // Expand
    toggle.classList.add('ft-expanded');
    content.classList.add('ft-expanded');
  }
}

function highlightSearchTerms(html, searchQuery) {
  if (!searchQuery.trim()) return html;

  // Create a temporary div to work with the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Function to highlight text in text nodes only
  function highlightInTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');

      if (regex.test(text)) {
        const highlightedText = text.replace(regex, '<mark class="fictrail-highlight">$1</mark>');

        // Create a document fragment to avoid extra wrapper spans
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = highlightedText;

        // Move all child nodes from temp container to fragment
        while (tempContainer.firstChild) {
          fragment.appendChild(tempContainer.firstChild);
        }

        // Replace the text node with the fragment contents
        node.parentNode.replaceChild(fragment, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Recursively process child nodes (need to convert to array first since we're modifying)
      const children = Array.from(node.childNodes);
      children.forEach(child => highlightInTextNodes(child));
    }
  }

  highlightInTextNodes(tempDiv);
  return tempDiv.innerHTML;
}

function scrollToTop(event) {
  event.preventDefault();

  // Scroll to the top of the main element (where FicTrail is)
  const mainElement = document.getElementById('main');
  if (mainElement) {
    mainElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    // Fallback to scrolling to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}


// Core Module - Main functionality and history loading
let allWorks = [];
let filteredWorks = [];

// Pagination state
let currentDisplayCount = 20;

function showLoginError() {
  showFicTrailError('Oops! It looks like you\'ve been logged out of AO3. <a href="https://archiveofourown.org/users/login" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Log in to AO3</a> and then try again.');
}

async function reloadHistory() {
  const username = getUsername();
  if (!username) {
    showLoginError();
    return;
  }

  // Disable buttons while loading
  const loadBtn = document.getElementById('fictrail-load-btn');
  const retryBtn = document.getElementById('fictrail-retry-btn');
  if (loadBtn) loadBtn.disabled = true;
  if (retryBtn) retryBtn.disabled = true;

  // Preserve search and filter values when reloading
  const searchInput = document.getElementById('fictrail-search-input');
  const fandomFilter = document.getElementById('fictrail-fandom-filter');
  const preservedSearchValue = searchInput ? searchInput.value : '';
  const preservedFandomValue = fandomFilter ? fandomFilter.value : '';

  const pagesToLoad = getPagesToLoad();

  // Check if we can use cached data
  if (isCacheValid() && getMaxCachedPage() >= pagesToLoad) {
    console.log(`Using cached data for ${pagesToLoad} pages`);
    showFicTrailLoading('Loading from cache...');

    // Combine cached pages up to the requested amount
    const works = [];
    for (let page = 1; page <= pagesToLoad; page++) {
      if (pageCache.has(page)) {
        works.push(...pageCache.get(page).works);
      }
    }

    displayHistory(username, works, cachedTotalPages, pagesToLoad, preservedSearchValue, preservedFandomValue);

    // Re-enable buttons
    if (loadBtn) loadBtn.disabled = false;
    if (retryBtn) retryBtn.disabled = false;
    return;
  }

  try {
    showFicTrailLoading(`Loading ${pagesToLoad} ${pagesToLoad === 1 ? 'page' : 'pages'} of ${username}'s fic history...`);
    const result = await fetchMultiplePagesWithCache(username, pagesToLoad);

    if (result.works && result.works.length > 0) {
      displayHistory(username, result.works, result.totalPages, Math.min(pagesToLoad, result.totalPages), preservedSearchValue, preservedFandomValue);
    } else {
      showFicTrailError(ERROR_MESSAGES.NO_DATA);
    }
  } catch (error) {
    if (error.message === 'NOT_LOGGED_IN') {
      showLoginError();
      return;
    }
    console.error('Error loading history:', error);
    showFicTrailError(ERROR_MESSAGES.FETCH_FAILED);
  } finally {
    // Re-enable buttons after loading completes
    if (loadBtn) loadBtn.disabled = false;
    if (retryBtn) retryBtn.disabled = false;
  }
}

function displayHistory(username, works, totalPages, actualPagesLoaded, preservedSearchValue = '', preservedFandomValue = '') {
  showFicTrailResults();

  allWorks = works;
  filteredWorks = [...works];
  currentDisplayCount = ITEMS_PER_PAGE;

  const workCount = works.length;
  const uniqueAuthors = new Set(works.map(work => work.author)).size;
  const uniqueFandoms = new Set(works.flatMap(work =>
    work.fandoms.map(fandom => fandom.text)
  )).size;

  // Update subtitle with cache status
  const worksCountEl = document.getElementById('fictrail-works-count');
  const fandomsCountEl = document.getElementById('fictrail-fandoms-count');
  const authorsCountEl = document.getElementById('fictrail-authors-count');

  if (worksCountEl) worksCountEl.textContent = `${workCount} ${workCount === 1 ? 'work' : 'works'}`;
  if (fandomsCountEl) fandomsCountEl.textContent = `${uniqueFandoms} ${uniqueFandoms === 1 ? 'fandom' : 'fandoms'}`;
  if (authorsCountEl) authorsCountEl.textContent = `${uniqueAuthors} ${uniqueAuthors === 1 ? 'author' : 'authors'}`;

  // Update slider and pages info
  if (totalPages && totalPages > 0) {
    const slider = document.getElementById('fictrail-pages-slider');
    const sliderMax = document.querySelector('.fictrail-slider-max');

    if (slider) slider.max = totalPages;
    if (sliderMax) sliderMax.textContent = totalPages;

    if (slider) {
      if (actualPagesLoaded !== undefined) {
        slider.value = actualPagesLoaded;
      } else {
        slider.value = Math.min(parseInt(slider.value), totalPages);
      }
    }

    // Update toggle text with cache information
    const cachedPageCount = getCachedPageCount();
    const toggleText = document.getElementById('fictrail-toggle-text');
    if (toggleText) {
      toggleText.textContent = `${actualPagesLoaded}/${totalPages} History Pages Loaded`;
    }
  }

  // Show pages info and update button
  const pagesInfo = document.getElementById('fictrail-pages-info');
  const loadBtn = document.getElementById('fictrail-load-btn');
  if (pagesInfo) pagesInfo.style.display = 'block';
  if (loadBtn) {
    loadBtn.textContent = 'Reload History';
    loadBtn.onclick = reloadHistory;
  }
  updateReloadButtonText();

  addFavoriteTagsSummary(works);
  populateFandomFilter(works);

  // Restore preserved values and apply search/filter
  const searchInput = document.getElementById('fictrail-search-input');
  const fandomFilter = document.getElementById('fictrail-fandom-filter');

  if (searchInput && preservedSearchValue) {
    searchInput.value = preservedSearchValue;
  }
  if (fandomFilter && preservedFandomValue) {
    fandomFilter.value = preservedFandomValue;
  }

  if (preservedSearchValue || preservedFandomValue) {
    performSearch();
  } else {
    updateResultsCount(works.length);
    displayWorks(works);
  }

  console.log(`Loaded ${works.length} works from ${actualPagesLoaded} pages (${getCachedPageCount()} pages cached)`);
}

// Initialize when page loads
function init() {
  addStyles();
  createFicTrailButton();
  // Don't create overlay until button is clicked
}

// Auto-initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- Cache management BEGIN ---

const pageCache = new Map(); // Map of page numbers to {works: [], timestamp: number}
let cachedTotalPages = null;
let cacheTimestamp = null;

function isCacheValid() {
  return cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_EXPIRY_MS;
}

function clearCache() {
  pageCache.clear();
  cachedTotalPages = null;
  cacheTimestamp = null;
  console.log('Cache cleared');
}

function getCachedPageCount() {
  return pageCache.size;
}

function getMaxCachedPage() {
  if (pageCache.size === 0) return 0;
  return Math.max(...pageCache.keys());
}

// --- Cache management END ---



})();