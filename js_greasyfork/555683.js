// ==UserScript==
// @name         GGn Chain Helper
// @namespace    https://greasyfork.org
// @license      MIT
// @version      2.0
// @description  Find valid next games using ≥4 consecutive letters from the previous title; copy BBCode + chain note; mounts above #quickpost; matches GGn theme.
// @author       kdln
// @match        https://gazellegames.net/forums.php*
// @icon         https://gazellegames.net/favicon.ico
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555683/GGn%20Chain%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555683/GGn%20Chain%20Helper.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ========== CONFIGURATION ==========
  const CONFIG = {
    DEFAULT_FILTER_ADULT: true,
    DEFAULT_MODE: 'within',
    MAX_RESULTS: 30,
    PER_SUBSTRING_LIMIT: 10,
    MIN_SUBSTRING_LENGTH: 4,
    MAX_SUBSTRINGS_TO_TRY: 120,
    FLASH_DURATION: 1100
  };

  // ========== INITIALIZATION ==========
  const params = new URLSearchParams(location.search);
  if (params.get('action') !== 'viewthread' || !params.get('threadid')) return;

  // ========== DOM HELPERS ==========
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ========== UTILITY FUNCTIONS ==========
  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

  const flash = (message) => {
    const flashDiv = document.createElement('div');
    flashDiv.textContent = message;
    Object.assign(flashDiv.style, {
      position: 'fixed',
      left: '50%',
      top: '12px',
      transform: 'translateX(-50%)',
      background: 'rgba(40,40,40,.9)',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: '6px',
      zIndex: '10000'
    });
    document.body.appendChild(flashDiv);
    setTimeout(() => flashDiv.remove(), CONFIG.FLASH_DURATION);
  };

  const normalizeLettersOnly = (str) =>
    (str.match(/[A-Za-z]/g) || []).map(c => c.toLowerCase()).join('');

  // ========== TEXT EXTRACTION ==========
  const TextExtractor = {
    getLinkedGameFromLatestPost() {
      const anchors = $$('td.body div[id^="content"] a[href*="torrents.php?id="]');
      if (anchors.length === 0) return '';
      const lastAnchor = anchors[anchors.length - 1];
      return (lastAnchor.textContent || '').replace(/\s+/g, ' ').trim();
    },

    getLatestPostText() {
      const postBody = $('.forum_post .post_body') || $('.forum_post') || $('.post_body');
      return postBody?.innerText?.trim() || '';
    },

    getSelectionText() {
      const selection = getSelection();
      return selection && selection.rangeCount ? selection.toString().trim() : '';
    },

    getLastLineFromPost() {
      const text = this.getLatestPostText();
      if (!text) return '';
      const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      return lines.at(-1) || '';
    }
  };

  // ========== SUBSTRING GENERATION ==========
  const SubstringGenerator = {
    acrossWords(str, minLen = CONFIG.MIN_SUBSTRING_LENGTH) {
      const normalized = normalizeLettersOnly(str);
      const substrings = new Set();

      for (let i = 0; i <= normalized.length - minLen; i++) {
        for (let j = i + minLen; j <= normalized.length; j++) {
          substrings.add(normalized.slice(i, j));
        }
      }

      return Array.from(substrings).sort((a, b) => b.length - a.length);
    },

    withinWords(str, minLen = CONFIG.MIN_SUBSTRING_LENGTH) {
      const words = (str.match(/[A-Za-z]+/g) || []).map(w => w.toLowerCase());
      const substrings = new Set();

      for (const word of words) {
        for (let i = 0; i <= word.length - minLen; i++) {
          for (let j = i + minLen; j <= word.length; j++) {
            substrings.add(word.slice(i, j));
          }
        }
      }

      return Array.from(substrings).sort((a, b) => b.length - a.length);
    },

    generate(str, mode) {
      return mode === 'within'
        ? this.withinWords(str)
        : this.acrossWords(str);
    }
  };

  // ========== TITLE FORMATTING ==========
  const TitleFormatter = {
    highlightMatch(title, substring) {
      const index = title.toLowerCase().indexOf(substring.toLowerCase());
      if (index === -1) return escapeHtml(title);

      const before = escapeHtml(title.slice(0, index));
      const match = escapeHtml(title.slice(index, index + substring.length));
      const after = escapeHtml(title.slice(index + substring.length));

      return `${before}<u style="text-decoration: underline !important;">${match}</u>${after}`;
    },

    addBBCodeUnderline(title, substring) {
      const index = title.toLowerCase().indexOf(substring.toLowerCase());
      if (index === -1) return title;

      const before = title.slice(0, index);
      const match = title.slice(index, index + substring.length);
      const after = title.slice(index + substring.length);

      return `${before}[u]${match}[/u]${after}`;
    }
  };

  // ========== RESULT EXTRACTION ==========
  const ResultExtractor = {
    SELECTORS: [
      "a[href*='torrents.php?id='].tooltip",
      ".group_info a[href*='torrents.php?id=']",
      "a[href*='torrents.php?id='].group_name",
      "a[href*='torrents.php?id=']"
    ],

    extractFromDoc(doc) {
      const results = [];
      const seenIds = new Set();

      // Try DOM selectors first
      const links = this.SELECTORS.flatMap(selector => $$(selector, doc));

      for (const anchor of links) {
        const result = this._extractFromAnchor(anchor);
        if (result && !seenIds.has(result.id)) {
          results.push(result);
          seenIds.add(result.id);
        }
      }

      // Fallback to regex if no results
      if (results.length === 0) {
        return this._extractWithRegex(doc, seenIds);
      }

      return results;
    },

    _extractFromAnchor(anchor) {
      const href = anchor.getAttribute('href') || '';
      const match = href.match(/torrents\.php\?id=(\d+)/);
      if (!match) return null;

      const id = match[1];
      const title = (anchor.textContent || anchor.getAttribute('title') || '').trim();
      if (!title) return null;

      const absoluteHref = href.startsWith('http')
        ? href
        : `https://gazellegames.net/${href.replace(/^\//, '')}`;

      return { id, title, href: absoluteHref };
    },

    _extractWithRegex(doc, seenIds) {
      const results = [];
      const html = doc.documentElement.outerHTML;
      const regex = /<a[^>]+href="([^"]*torrents\.php\?id=(\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const [, href, id, rawText] = match;
        if (seenIds.has(id)) continue;

        const title = rawText.replace(/<[^>]+>/g, '').trim();
        if (!title) continue;

        const absoluteHref = href.startsWith('http')
          ? href
          : `https://gazellegames.net/${href.replace(/^\//, '')}`;

        results.push({ id, title, href: absoluteHref });
        seenIds.add(id);
      }

      return results;
    }
  };

  // ========== SEARCH ENGINE ==========
  const SearchEngine = {
    async search(previousTitle, mode, filterAdult) {
      const substrings = SubstringGenerator.generate(previousTitle, mode);

      if (substrings.length === 0) {
        return { success: false, error: 'No valid 4+ letter substrings found.', substrings: [] };
      }

      const adultFilter = filterAdult ? '&taglist=-adult' : '';
      const seenIds = new Set();
      const results = [];
      const substrsToTry = substrings.slice(0, CONFIG.MAX_SUBSTRINGS_TO_TRY);

      let searchesRun = 0;
      let totalLinksSeen = 0;

      for (const substring of substrsToTry) {
        const url = `/torrents.php?action=basic&searchstr=${encodeURIComponent(substring)}${adultFilter}&order_by=relevance&order_way=desc`;

        try {
          const response = await fetch(url, { credentials: 'same-origin' });
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const extracted = ResultExtractor.extractFromDoc(doc);

          totalLinksSeen += extracted.length;

          for (const item of extracted) {
            if (seenIds.has(item.id)) continue;
            if (!item.title.toLowerCase().includes(substring.toLowerCase())) continue;

            seenIds.add(item.id);
            results.push({ ...item, match: substring, length: substring.length });

            if (results.length >= CONFIG.MAX_RESULTS) break;
          }

          if (results.length >= CONFIG.MAX_RESULTS) break;
        } catch (error) {
          console.error(`Search error for "${substring}":`, error);
        }

        searchesRun++;
        if (results.length >= CONFIG.PER_SUBSTRING_LIMIT) break;
      }

      // Sort by match length (longer first), then alphabetically
      results.sort((a, b) => (b.length - a.length) || a.title.localeCompare(b.title));

      return {
        success: true,
        results,
        substrings,
        stats: { searchesRun, totalLinksSeen, uniqueKept: results.length }
      };
    }
  };

  // ========== UI BUILDER ==========
  const UIBuilder = {
    buildPanel() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('box', 'pad');
      Object.assign(wrapper.style, {
        margin: '8px 0 10px',
        fontSize: '12px',
        lineHeight: '1.55'
      });

      const header = this._buildHeader();
      const controls = this._buildControls();
      const inputRow = this._buildInputRow();
      const status = this._buildStatus();
      const debug = this._buildDebug();
      const substrings = this._buildSubstrings();
      const results = this._buildResults();

      wrapper.append(header, controls, inputRow, status, debug, substrings, results);
      return wrapper;
    },

    _buildHeader() {
      const header = document.createElement('div');
      Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      });
      header.innerHTML = '<strong>Chain Helper (≥4 consecutive letters)</strong>';
      return header;
    },

    _buildControls() {
      const controls = document.createElement('div');
      Object.assign(controls.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      });

      const adultCheckbox = this._buildAdultFilter();
      const modeSelect = this._buildModeSelect();

      controls.append(adultCheckbox, modeSelect);
      return controls;
    },

    _buildAdultFilter() {
      const label = document.createElement('label');
      Object.assign(label.style, {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap'
      });

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'ch_filter_adult';

      label.append(checkbox, document.createTextNode('Filter adult'));
      return label;
    },

    _buildModeSelect() {
      const label = document.createElement('label');
      Object.assign(label.style, {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap'
      });

      const select = document.createElement('select');
      select.id = 'ch_mode';
      select.innerHTML = `
        <option value="across">Across words (ignore spaces/punct)</option>
        <option value="within">Within words only</option>
      `;

      label.append(document.createTextNode('Mode: '), select);
      return label;
    },

    _buildInputRow() {
      const row = document.createElement('div');
      Object.assign(row.style, {
        marginTop: '6px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        alignItems: 'center'
      });

      const input = document.createElement('input');
      input.id = 'ch_prev';
      input.type = 'text';
      input.placeholder = 'Previous game title…';
      Object.assign(input.style, {
        flex: '1',
        minWidth: '280px',
        padding: '6px 8px'
      });

      const buttons = [
        { id: 'ch_use_linked', text: 'Use linked game in latest post' },
        { id: 'ch_use_sel', text: 'Use selected text' },
        { id: 'ch_use_last', text: 'Use last line of latest post' },
        { id: 'ch_generate', text: 'Find candidates' }
      ].map(({ id, text }) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.type = 'button';
        btn.textContent = text;
        return btn;
      });

      row.append(input, ...buttons);
      return row;
    },

    _buildStatus() {
      const status = document.createElement('div');
      status.id = 'ch_status';
      Object.assign(status.style, {
        marginTop: '6px',
        opacity: '.8'
      });
      return status;
    },

    _buildDebug() {
      const details = document.createElement('details');
      details.id = 'ch_debug';
      Object.assign(details.style, {
        marginTop: '6px',
        opacity: '.9'
      });

      const summary = document.createElement('summary');
      summary.style.cursor = 'pointer';
      summary.textContent = 'Debug';

      const content = document.createElement('div');
      content.id = 'ch_debug_content';
      Object.assign(content.style, {
        marginTop: '6px',
        fontFamily: 'monospace',
        fontSize: '11px'
      });

      details.append(summary, content);
      return details;
    },

    _buildSubstrings() {
      const details = document.createElement('details');
      details.id = 'ch_substrings_wrap';
      details.style.marginTop = '6px';

      const summary = document.createElement('summary');
      summary.style.cursor = 'pointer';
      summary.textContent = 'Show generated substrings (≥4)';

      const box = document.createElement('div');
      box.id = 'ch_substrings';
      Object.assign(box.style, {
        marginTop: '6px',
        maxHeight: '150px',
        overflow: 'auto',
        border: '1px solid var(--border, #4443)',
        padding: '6px',
        borderRadius: '6px',
        background: 'var(--bg, #0000)',
        fontFamily: 'monospace',
        fontSize: '11px'
      });

      details.append(summary, box);
      return details;
    },

    _buildResults() {
      const results = document.createElement('div');
      results.id = 'ch_results';
      Object.assign(results.style, {
        marginTop: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '8px'
      });
      return results;
    },

    buildResultCard(item, previousTitle) {
      const card = document.createElement('div');
      card.classList.add('box', 'pad');
      card.style.margin = '0';

      const top = document.createElement('div');
      Object.assign(top.style, {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap'
      });

      const link = document.createElement('a');
      link.href = item.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = TitleFormatter.highlightMatch(item.title, item.match);
      link.style.fontWeight = '600';

      const buttons = this._buildResultButtons(item, previousTitle);
      top.append(link, buttons);
      card.append(top);

      const meta = this._buildResultMeta(item);
      const snippet = this._buildResultSnippet(item, previousTitle);
      card.append(meta, snippet);

      return card;
    },

    _buildResultButtons(item, previousTitle) {
      const buttonsWrapper = document.createElement('div');
      Object.assign(buttonsWrapper.style, {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      });

      const titleWithUnderline = TitleFormatter.addBBCodeUnderline(item.title, item.match);
      const bbcode = `[url=${item.href}]${titleWithUnderline}[/url]`;
      const replySnippet = `${bbcode} (chain: "${item.match}" from "${previousTitle}")`;

      const copyBBCodeBtn = document.createElement('button');
      copyBBCodeBtn.type = 'button';
      copyBBCodeBtn.textContent = 'Copy BBCode';
      copyBBCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this._handleCopyBBCode(bbcode);
      });

      const copySnippetBtn = document.createElement('button');
      copySnippetBtn.type = 'button';
      copySnippetBtn.textContent = 'Copy Reply Snippet';
      copySnippetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          typeof GM_setClipboard === 'function'
            ? GM_setClipboard(replySnippet)
            : await navigator.clipboard.writeText(replySnippet);
          flash('Reply snippet copied');
        } catch {
          alert('Clipboard blocked');
        }
      });

      buttonsWrapper.append(copyBBCodeBtn, copySnippetBtn);
      return buttonsWrapper;
    },

    _handleCopyBBCode(bbcode) {
      const textarea = $('#quickpost textarea, textarea[name="body"], #body');

      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        textarea.value = text.substring(0, start) + bbcode + text.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + bbcode.length;
        textarea.focus();

        flash('BBCode inserted');

        // Clear results
        $('#ch_results').innerHTML = '';
        $('#ch_status').textContent = 'BBCode inserted into message box. Results cleared.';
      } else {
        // Fallback to clipboard
        try {
          typeof GM_setClipboard === 'function'
            ? GM_setClipboard(bbcode)
            : navigator.clipboard.writeText(bbcode);
          flash('BBCode copied (message box not found)');
        } catch {
          alert('Failed to copy BBCode');
        }
      }
    },

    _buildResultMeta(item) {
      const meta = document.createElement('div');
      Object.assign(meta.style, {
        marginTop: '6px',
        fontSize: '11px',
        opacity: '.85'
      });
      meta.textContent = `Match: "${item.match}" (${item.length} letters) • SFW search${CONFIG.DEFAULT_FILTER_ADULT ? ' (adult filtered)' : ''}`;
      return meta;
    },

    _buildResultSnippet(item, previousTitle) {
      const snippet = document.createElement('div');
      Object.assign(snippet.style, {
        fontFamily: 'monospace',
        fontSize: '11px',
        opacity: '.8',
        marginTop: '4px'
      });
      const titleWithUnderline = TitleFormatter.addBBCodeUnderline(item.title, item.match);
      const bbcode = `[url=${item.href}]${titleWithUnderline}[/url]`;
      snippet.textContent = `${bbcode} (chain: "${item.match}" from "${previousTitle}")`;
      return snippet;
    }
  };

  // ========== APP CONTROLLER ==========
  const AppController = {
    init() {
      const panel = UIBuilder.buildPanel();
      this._mountPanel(panel);
      this._setupEventListeners();
      this._setDefaults();
      this._ensureButtonTypes(panel);

      setTimeout(() => flash('Chain Helper ready above the reply box'), 50);
    },

    _mountPanel(panel) {
      const quickpost = document.getElementById('quickpost');
      if (quickpost?.parentNode) {
        quickpost.parentNode.insertBefore(panel, quickpost);
        return;
      }

      const replyForm = $('#reply_box, form[action*="reply"], #content .thin');
      if (replyForm?.parentNode) {
        replyForm.parentNode.insertBefore(panel, replyForm);
        return;
      }

      const content = $('#content') || document.body;
      content.insertBefore(panel, content.firstChild);
    },

    _setupEventListeners() {
      $('#ch_use_linked').addEventListener('click', (e) => {
        e.preventDefault();
        const title = TextExtractor.getLinkedGameFromLatestPost();
        if (!title) {
          alert('No linked game found in latest post body.');
          return;
        }
        $('#ch_prev').value = title;
      });

      $('#ch_use_sel').addEventListener('click', (e) => {
        e.preventDefault();
        const selection = TextExtractor.getSelectionText();
        if (!selection) {
          alert('Select the previous game title in a post first.');
          return;
        }
        $('#ch_prev').value = selection;
      });

      $('#ch_use_last').addEventListener('click', (e) => {
        e.preventDefault();
        const lastLine = TextExtractor.getLastLineFromPost();
        if (!lastLine) {
          alert('Could not find the latest post text.');
          return;
        }
        $('#ch_prev').value = lastLine;
      });

      $('#ch_generate').addEventListener('click', (e) => {
        e.preventDefault();
        this.runSearch();
      });

      $('#ch_prev').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.runSearch();
        }
      });
    },

    _setDefaults() {
      $('#ch_filter_adult').checked = CONFIG.DEFAULT_FILTER_ADULT;
      $('#ch_mode').value = CONFIG.DEFAULT_MODE;
    },

    _ensureButtonTypes(panel) {
      panel.querySelectorAll('button').forEach(btn => {
        if (!btn.type || btn.type.toLowerCase() !== 'button') {
          btn.type = 'button';
        }
      });
    },

    async runSearch() {
      const previousTitle = $('#ch_prev').value.trim();
      const statusEl = $('#ch_status');
      const resultsEl = $('#ch_results');
      const debugEl = $('#ch_debug_content');
      const substringsEl = $('#ch_substrings');
      const filterAdult = $('#ch_filter_adult').checked;
      const mode = $('#ch_mode').value;

      // Clear previous results
      resultsEl.innerHTML = '';
      debugEl.innerHTML = '';

      if (!previousTitle) {
        statusEl.textContent = 'Enter the previous game title.';
        return;
      }

      statusEl.textContent = 'Searching…';

      const searchResult = await SearchEngine.search(previousTitle, mode, filterAdult);

      // Display substrings
      substringsEl.textContent = searchResult.substrings.length
        ? searchResult.substrings.join(' ')
        : '(none)';

      if (!searchResult.success) {
        statusEl.textContent = searchResult.error;
        return;
      }

      // Display debug info
      const { searchesRun, totalLinksSeen, uniqueKept } = searchResult.stats;
      const debugLine = document.createElement('div');
      debugLine.textContent = `Searches run: ${searchesRun}, Links scanned: ${totalLinksSeen}, Unique kept: ${uniqueKept}`;
      debugEl.appendChild(debugLine);

      if (searchResult.results.length === 0) {
        statusEl.textContent = 'No candidates found that contain any 4+ consecutive letters from the previous title. Open Debug for details.';
        return;
      }

      statusEl.textContent = `Found ${searchResult.results.length} candidate(s).`;

      // Render results
      for (const item of searchResult.results) {
        const card = UIBuilder.buildResultCard(item, previousTitle);
        resultsEl.appendChild(card);
      }
    }
  };

  // ========== START APPLICATION ==========
  AppController.init();
})();
