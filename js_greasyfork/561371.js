// ==UserScript==
// @name         Novel Library Manager v3.4.1
// @namespace    http://tampermonkey.net/
// @version      3.4.1
// @description  Visual Element Selector + Negative Pattern Learning + Site-Specific Extraction
// @author       Prince Jona
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561371/Novel%20Library%20Manager%20v341.user.js
// @updateURL https://update.greasyfork.org/scripts/561371/Novel%20Library%20Manager%20v341.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /* ============================================================
     SECTION 1: CORE UTILITIES, EVENTS & DYNAMIC CONFIG
     ============================================================ */

  /* --- EventEmitter: Lightweight pub/sub for decoupling --- */
  class EventEmitter {
    constructor() {
      this._events = {};
    }
    on(event, callback) {
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(callback);
      return () => this.off(event, callback);
    }
    off(event, callback) {
      if (!this._events[event]) return;
      this._events[event] = this._events[event].filter(cb => cb !== callback);
    }
    emit(event, data) {
      if (!this._events[event]) return;
      this._events[event].forEach(cb => {
        try { cb(data); } catch (e) { console.error(`[NL] Event error (${event}):`, e); }
      });
    }
  }

  // Global event bus
  const Events = new EventEmitter();

  /* --- SafeStorage: Error-resilient localStorage wrapper --- */
  const SafeStorage = {
    get(key, defaultValue = {}) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
      } catch (e) {
        console.error(`[NL] Storage read error for ${key}:`, e);
        Events.emit('storage:error', { key, error: e });
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[NL] Storage write error for ${key}:`, e);
        Events.emit('storage:error', { key, error: e });
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error(`[NL] Storage remove error for ${key}:`, e);
        return false;
      }
    }
  };

  /* --- ConfigStore: Dynamic configuration with persistence --- */
  class ConfigStore {
    constructor() {
      this.KEY = 'NL_Config_v3';
      this.defaults = {
        PREFIX: 'NL_',
        VERSION: '3.4.1',
        MIN_WORDS: 500,
        MIN_CONTENT_LENGTH: 400,
        SPAM_PARAGRAPH_THRESHOLD: 50,
        BATCH_DELAY_MS: 2000,
        RESUME_DELAY_MS: 1500,
        BLOB_REVOKE_DELAY_MS: 150,
        MAX_RETRIES: 3,
        Z_INDEX: 2147483647,
        // v3.3+ Validation settings
        VALIDATION_MODE: 'auto',           // 'always' | 'auto' | 'never'
        AUTO_VALIDATE_THRESHOLD: 0.85,     // Skip validation above this confidence
        VALIDATION_TIMEOUT: 7,             // Seconds before auto-accept (longer for mobile)
        ASK_FOR_BOOK_TITLE: true           // Prompt for title when detection fails
      };
      this.state = this._load();
    }

    _load() {
      const stored = SafeStorage.get(this.KEY, {});
      return { ...this.defaults, ...stored };
    }

    set(key, value) {
      this.state[key] = value;
      // Only persist non-default values
      const toStore = {};
      for (const k of Object.keys(this.state)) {
        if (this.state[k] !== this.defaults[k]) {
          toStore[k] = this.state[k];
        }
      }
      SafeStorage.set(this.KEY, toStore);
      Events.emit('config:changed', { key, value });
    }

    get(key) {
      return this.state[key] !== undefined ? this.state[key] : this.defaults[key];
    }
    
    reset(key) {
      if (this.defaults[key] !== undefined) {
        this.state[key] = this.defaults[key];
        this.set(key, this.defaults[key]);
      }
    }
    
    // Editable settings for Settings UI
    getEditable() {
      return [
        { key: 'BATCH_DELAY_MS', label: 'Batch Delay', unit: 'ms', min: 500, max: 10000, step: 500, desc: 'Wait between chapters' },
        { key: 'MIN_WORDS', label: 'Min Words', unit: '', min: 0, max: 2000, step: 100, desc: 'Quality threshold' },
        { key: 'RESUME_DELAY_MS', label: 'Resume Delay', unit: 'ms', min: 500, max: 5000, step: 500, desc: 'Wait after page load' },
        { key: 'SPAM_PARAGRAPH_THRESHOLD', label: 'Spam Threshold', unit: 'chars', min: 10, max: 200, step: 10, desc: 'Short paragraph filter' },
        { key: 'AUTO_VALIDATE_THRESHOLD', label: 'Auto-Trust %', unit: '', min: 0.5, max: 0.99, step: 0.05, desc: 'Skip validation above this', format: v => `${Math.round(v*100)}%` },
        { key: 'VALIDATION_TIMEOUT', label: 'Validate Timer', unit: 's', min: 3, max: 15, step: 1, desc: 'Auto-accept countdown' }
      ];
    }
  }

  // Initialize global config
  const Config = new ConfigStore();

  /* --- ContentIntelligence: Site-adaptive learning system --- */
  class ContentIntelligence {
    constructor() {
      this.KEY = Config.get('PREFIX') + 'SiteProfiles';
      this.profiles = this._load();
      this.currentSite = this._getSiteKey();
    }

    _load() {
      return SafeStorage.get(this.KEY, {});
    }

    _save() {
      SafeStorage.set(this.KEY, this.profiles);
    }

    _getSiteKey() {
      // Normalize domain (strip www, use hostname)
      return window.location.hostname.replace(/^www\./, '');
    }

    // Get or create profile for current site
    getProfile() {
      if (!this.profiles[this.currentSite]) {
        this.profiles[this.currentSite] = {
          domain: this.currentSite,
          selectors: {},        // { selector: { hits: N, lastUsed: ts } }
          preferredSelector: null,
          successRate: 0,
          totalAttempts: 0,
          successfulExtracts: 0,
          avgWordCount: 0,
          spamPatterns: [],     // Site-specific spam patterns discovered
          firstSeen: Date.now(),
          lastSeen: Date.now()
        };
      }
      return this.profiles[this.currentSite];
    }

    // Record a successful content extraction
    recordSuccess(selector, wordCount, quality) {
      const profile = this.getProfile();
      profile.totalAttempts++;
      profile.successfulExtracts++;
      profile.successRate = profile.successfulExtracts / profile.totalAttempts;
      profile.lastSeen = Date.now();

      // Update selector stats
      if (!profile.selectors[selector]) {
        profile.selectors[selector] = { hits: 0, avgWords: 0, avgQuality: 0 };
      }
      const sel = profile.selectors[selector];
      sel.hits++;
      sel.avgWords = ((sel.avgWords * (sel.hits - 1)) + wordCount) / sel.hits;
      sel.avgQuality = ((sel.avgQuality * (sel.hits - 1)) + quality) / sel.hits;
      sel.lastUsed = Date.now();

      // Update preferred selector (highest hits with good quality)
      const best = Object.entries(profile.selectors)
        .filter(([_, s]) => s.avgQuality >= 0.5)
        .sort((a, b) => b[1].hits - a[1].hits)[0];
      if (best) profile.preferredSelector = best[0];

      // Update running average word count
      profile.avgWordCount = ((profile.avgWordCount * (profile.successfulExtracts - 1)) + wordCount) / profile.successfulExtracts;

      this._save();
      Events.emit('intelligence:learn', { site: this.currentSite, selector, wordCount });
      VisualLog.add(`🧠 Learned: ${selector} (${sel.hits} hits)`);
    }

    // Record a failed extraction attempt
    recordFailure(selector, reason) {
      const profile = this.getProfile();
      profile.totalAttempts++;
      profile.successRate = profile.successfulExtracts / profile.totalAttempts;
      profile.lastSeen = Date.now();

      // Penalize selector
      if (profile.selectors[selector]) {
        profile.selectors[selector].failures = (profile.selectors[selector].failures || 0) + 1;
      }

      this._save();
      Events.emit('intelligence:failure', { site: this.currentSite, selector, reason });
    }

    // Record a discovered spam pattern
    recordSpamPattern(pattern) {
      const profile = this.getProfile();
      if (!profile.spamPatterns.includes(pattern)) {
        profile.spamPatterns.push(pattern);
        this._save();
        VisualLog.add(`🧠 New spam pattern: ${pattern.slice(0, 30)}...`);
      }
    }

    // Get ranked selectors for this site (learned first, then defaults)
    getRankedSelectors() {
      const profile = this.getProfile();
      const defaultSelectors = ['.chapter-content', '#chapter-content', '.entry-content', '.post-content', 'article', '.content', 'main'];

      // Sort learned selectors by (hits * quality)
      const learned = Object.entries(profile.selectors)
        .filter(([_, s]) => s.hits >= 2 && s.avgQuality >= 0.4)
        .sort((a, b) => (b[1].hits * b[1].avgQuality) - (a[1].hits * a[1].avgQuality))
        .map(([sel, _]) => sel);

      // Preferred first, then learned, then defaults (deduplicated)
      const ranked = [];
      if (profile.preferredSelector) ranked.push(profile.preferredSelector);
      learned.forEach(s => { if (!ranked.includes(s)) ranked.push(s); });
      defaultSelectors.forEach(s => { if (!ranked.includes(s)) ranked.push(s); });

      return ranked;
    }

    // Get site-specific spam patterns (merged with global)
    getSiteSpamPatterns() {
      const profile = this.getProfile();
      return profile.spamPatterns || [];
    }

    // Get confidence level for current site (0-1)
    getConfidence() {
      const profile = this.getProfile();
      if (profile.totalAttempts === 0) return 0;
      
      const volumeFactor = Math.min(1, profile.successfulExtracts / 10);
      const successFactor = profile.successRate;
      const recencyFactor = Math.max(0, 1 - ((Date.now() - profile.lastSeen) / (30 * 24 * 60 * 60 * 1000))); // Decay over 30 days

      return (volumeFactor * 0.3) + (successFactor * 0.5) + (recencyFactor * 0.2);
    }

    // Get all site profiles for display
    getAllProfiles() {
      return Object.values(this.profiles).sort((a, b) => b.lastSeen - a.lastSeen);
    }

    // Clear profile for current site
    clearCurrentProfile() {
      delete this.profiles[this.currentSite];
      this._save();
      Events.emit('intelligence:cleared', { site: this.currentSite });
      VisualLog.add(`🧠 Cleared profile for ${this.currentSite}`);
    }
  }

  // Initialize global intelligence
  const Intelligence = new ContentIntelligence();

  /* ============================================================
     SECTION 1.5: BOOK CONTEXT MANAGER
     ============================================================ */

  class BookManager {
    constructor() {
      this.KEY = Config.get('PREFIX') + 'BookDB';
      this.db = SafeStorage.get(this.KEY, {});
      this.currentBook = null;
    }

    _save() {
      SafeStorage.set(this.KEY, this.db);
    }

    getDomain() {
      return window.location.hostname.replace(/^www\./, '');
    }

    // Multi-strategy book detection
    detectBook() {
      const strategies = [
        this.detectFromMeta.bind(this),
        this.detectFromTitle.bind(this),
        this.detectFromURL.bind(this),
        this.detectFromBreadcrumbs.bind(this)
      ];

      for (let strategy of strategies) {
        const book = strategy();
        if (book && book.title && book.title.length > 3) {
          return this.normalizeBook(book);
        }
      }

      // Fallback: Create "Unknown" book
      VisualLog.add('⚠️ Could not detect book title', 'error');
      return this.createFallbackBook();
    }

    detectFromMeta() {
      const og = document.querySelector('meta[property="og:title"]');
      const bookTitle = document.querySelector('meta[name="book-title"], meta[name="novel-title"]');
      
      if (bookTitle) return { title: bookTitle.content };
      if (og) {
        const title = og.content.replace(/chapter\s*\d+/i, '').replace(/ch\.\s*\d+/i, '').trim();
        if (title.length > 3) return { title };
      }
      return null;
    }

    detectFromTitle() {
      const title = document.title;
      
      const patterns = [
        /^(?:Chapter|Ch\.?)\s*\d+\s*[-:–]\s*(.+?)\s*[|\-]/i,
        /^(.+?)\s*[-:–]\s*(?:Chapter|Ch\.?)\s*\d+/i,
        /^(.+?)\s*[|\-]\s*(?:Chapter|Ch\.?)\s*\d+/i,
        /^(.+?)\s*[-–]\s*Read\s/i,
        /^Read\s+(.+?)\s*[-–]/i
      ];

      for (let pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1].length > 3 && match[1].length < 100) {
          return { title: match[1].trim() };
        }
      }
      return null;
    }

    detectFromURL() {
      const match = window.location.pathname.match(/\/(?:novel|book|series|story)\/([^\/]+)/i);
      if (match) {
        const slug = match[1].replace(/-/g, ' ').replace(/_/g, ' ');
        if (slug.length > 3) return { title: this.titleCase(slug) };
      }
      return null;
    }

    detectFromBreadcrumbs() {
      const selectors = ['.breadcrumb a', 'nav.breadcrumb a', '.novel-title', '.book-title', 'h1.title a'];
      for (let sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.length > 3 && el.innerText.length < 100) {
          const text = el.innerText.trim();
          if (!text.match(/chapter|home|index|page/i)) {
            return { title: text };
          }
        }
      }
      return null;
    }

    titleCase(str) {
      return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    createFallbackBook() {
      const domain = this.getDomain();
      const pathMatch = window.location.pathname.match(/\/([^\/]+)\/chapter/i);
      const hint = pathMatch ? pathMatch[1].replace(/-/g, ' ') : '';
      const title = hint ? `Unknown (${this.titleCase(hint)})` : 'Unknown Book';
      
      return this.normalizeBook({
        title,
        author: 'Unknown',
        isUnknown: true,
        detectionFailed: true
      });
    }

    normalizeBook(book) {
      let title = book.title
        .replace(/\s*[|\-]\s*(Read|Novel|Light Novel|Web Novel|Chapter|Latest|Online|Free).*/i, '')
        .replace(/\s+/g, ' ')
        .trim();

      const id = this.generateBookId(title);

      return {
        id,
        title,
        author: book.author || 'Unknown',
        domain: this.getDomain(),
        isUnknown: book.isUnknown || false,
        detectionFailed: book.detectionFailed || false,
        detected: Date.now()
      };
    }

    generateBookId(title) {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
    }

    getOrCreateBook(bookData) {
      const id = bookData.id;

      if (!this.db[id]) {
        this.db[id] = {
          ...bookData,
          chapters: [],
          batchState: {
            isActive: false,
            current: 0,
            target: 0,
            nextUrl: null
          },
          stats: {
            created: Date.now(),
            lastRead: Date.now(),
            totalChapters: 0,
            totalWords: 0
          }
        };
        VisualLog.add(`📚 New book: "${bookData.title}"`, 'success');
        Events.emit('book:created', { book: this.db[id] });
      } else {
        this.db[id].stats.lastRead = Date.now();
        // Update detection status if we have better info now
        if (!bookData.isUnknown && this.db[id].isUnknown) {
          this.db[id].title = bookData.title;
          this.db[id].isUnknown = false;
          this.db[id].detectionFailed = false;
        }
      }

      this._save();
      this.currentBook = this.db[id];
      return this.currentBook;
    }

    addChapter(bookId, chapterNum, url, wordCount = 0) {
      if (!this.db[bookId]) return;

      const existing = this.db[bookId].chapters.find(c => c.num === chapterNum);
      if (!existing) {
        this.db[bookId].chapters.push({
          num: chapterNum,
          url,
          wordCount,
          downloaded: Date.now()
        });
        this.db[bookId].chapters.sort((a, b) => a.num - b.num);
        this.db[bookId].stats.totalChapters = this.db[bookId].chapters.length;
        this.db[bookId].stats.totalWords += wordCount;
        this._save();
        Events.emit('chapter:added', { bookId, chapterNum, wordCount });
      }
    }

    getProgress(bookId) {
      const book = this.db[bookId];
      if (!book || book.chapters.length === 0) return null;

      const chapters = book.chapters.map(c => c.num).sort((a, b) => a - b);
      const firstChapter = chapters[0];
      const lastChapter = chapters[chapters.length - 1];
      const gaps = [];
      
      for (let i = firstChapter; i < lastChapter; i++) {
        if (!chapters.includes(i)) {
          gaps.push(i);
        }
      }

      return {
        firstChapter,
        lastChapter,
        totalDownloaded: chapters.length,
        expectedTotal: lastChapter - firstChapter + 1,
        completionRate: chapters.length / (lastChapter - firstChapter + 1),
        gaps,
        totalWords: book.stats.totalWords
      };
    }

    getBatchState(bookId) {
      return this.db[bookId]?.batchState || null;
    }

    updateBatchState(bookId, state) {
      if (!this.db[bookId]) return;
      this.db[bookId].batchState = { ...this.db[bookId].batchState, ...state };
      this._save();
      Events.emit('batch:updated', { bookId, state: this.db[bookId].batchState });
    }

    updateBookTitle(bookId, newTitle) {
      if (!this.db[bookId]) return false;
      
      const oldTitle = this.db[bookId].title;
      this.db[bookId].title = newTitle;
      this.db[bookId].isUnknown = false;
      this.db[bookId].detectionFailed = false;
      
      this._save();
      VisualLog.add(`📝 Renamed: "${oldTitle}" → "${newTitle}"`, 'success');
      Events.emit('book:renamed', { bookId, oldTitle, newTitle });
      return true;
    }

    getAllBooks() {
      return Object.values(this.db).sort((a, b) => b.stats.lastRead - a.stats.lastRead);
    }

    getCurrentBook() {
      return this.currentBook;
    }

    getBook(bookId) {
      return this.db[bookId] || null;
    }

    deleteBook(bookId) {
      if (!this.db[bookId]) return false;
      delete this.db[bookId];
      this._save();
      Events.emit('book:deleted', { bookId });
      return true;
    }
  }

  // Global book manager instance
  const Books = new BookManager();

  /* ============================================================
     SECTION 1.6: DOMAIN-SCOPED PATTERN LEARNER
     ============================================================ */

  class PatternLearner {
    constructor() {
      this.KEY = Config.get('PREFIX') + 'PatternDB';
      this.NEGATIVE_KEY = Config.get('PREFIX') + 'NegativePatterns';
      this.db = SafeStorage.get(this.KEY, {});
      this.negativePatterns = SafeStorage.get(this.NEGATIVE_KEY, {});
    }

    _save() {
      SafeStorage.set(this.KEY, this.db);
    }

    _saveNegative() {
      SafeStorage.set(this.NEGATIVE_KEY, this.negativePatterns);
    }

    getDomain() {
      return window.location.hostname.replace(/^www\./, '');
    }

    getPattern() {
      const domain = this.getDomain();
      return this.db[domain] || null;
    }

    // ============ NEGATIVE PATTERN STORAGE ============
    
    addNegativePattern(el, reason = 'user_rejected') {
      const domain = this.getDomain();
      if (!this.negativePatterns[domain]) {
        this.negativePatterns[domain] = [];
      }
      
      const pattern = {
        cssPath: this.getCSSPath(el),
        className: el.className || '',
        id: el.id || '',
        tagName: el.tagName.toLowerCase(),
        reason,
        added: Date.now()
      };
      
      // Avoid duplicates
      const exists = this.negativePatterns[domain].some(p => 
        p.cssPath === pattern.cssPath || (p.id && p.id === pattern.id)
      );
      
      if (!exists) {
        this.negativePatterns[domain].push(pattern);
        this._saveNegative();
        VisualLog.add(`🚫 Blocked: ${pattern.cssPath.substring(0, 40)}...`, 'error');
      }
    }

    isNegativePattern(el) {
      const domain = this.getDomain();
      const negatives = this.negativePatterns[domain] || [];
      
      if (negatives.length === 0) return false;
      
      const cssPath = this.getCSSPath(el);
      const className = el.className || '';
      const id = el.id || '';
      
      return negatives.some(neg => {
        if (neg.cssPath === cssPath) return true;
        if (neg.id && id && neg.id === id) return true;
        if (neg.className && className && neg.className === className) return true;
        return false;
      });
    }

    setManualSelection(el) {
      const domain = this.getDomain();
      const features = this.extractFeatures(el);
      
      this.db[domain] = {
        signature: features,
        confidence: 0.95,
        samples: 1,
        successCount: 1,
        failureCount: 0,
        lastUpdate: Date.now(),
        booksUsing: [],
        manuallySelected: true
      };
      
      this._save();
      VisualLog.add(`✓ Manual selection saved (${features.cssPath})`, 'success');
      Events.emit('pattern:manual', { domain, cssPath: features.cssPath });
    }

    clearNegativePatterns() {
      const domain = this.getDomain();
      this.negativePatterns[domain] = [];
      this._saveNegative();
      VisualLog.add('🗑 Negative patterns cleared', 'info');
    }

    // ============ OBVIOUS JUNK DETECTION ============
    
    isObviousJunk(el) {
      const className = (el.className || '').toLowerCase();
      const id = (el.id || '').toLowerCase();
      const tagName = el.tagName.toLowerCase();
      
      // Blacklist patterns (genre menus, navigation, sidebars, etc.)
      const junkPatterns = [
        'dropdown', 'menu', 'nav', 'genre', 'sidebar', 'widget',
        'footer', 'header', 'ads', 'banner', 'toolbar', 'breadcrumb',
        'm-dl', 'ul-nav', 'catalog', 'social', 'share', 'comment',
        'rating', 'vote', 'bookmark', 'recommend', 'related',
        'author-info', 'chapter-list', 'toc', 'pagination'
      ];
      
      // Check class and ID
      const hasJunkPattern = junkPatterns.some(pattern => 
        className.includes(pattern) || id.includes(pattern)
      );
      
      if (hasJunkPattern) return true;
      
      // Check if it's a list-heavy element (likely navigation)
      const listItems = el.querySelectorAll('li, dd, dt').length;
      const links = el.querySelectorAll('a').length;
      if (listItems > 10 && links > 10) return true;
      
      // Enhanced genre catalog detection (dd/dt heavy + genre keywords)
      const ddCount = el.querySelectorAll('dd').length;
      const dtCount = el.querySelectorAll('dt').length;
      if ((ddCount + dtCount) > 15) {
        const text = el.textContent.toLowerCase();
        if (/action|adventure|romance|fantasy|drama|comedy|horror|mystery|sci-fi|xuanhuan|xianxia|wuxia|martial|cultivation|reincarnation|isekai/.test(text)) {
          return true; // Genre catalog
        }
      }
      
      // Check if mostly links (>70% of text is in links)
      const totalText = el.innerText.length;
      const linkText = Array.from(el.querySelectorAll('a'))
        .reduce((sum, a) => sum + a.innerText.length, 0);
      if (totalText > 100 && linkText / totalText > 0.7) return true;
      
      // Detect ad containers by data attributes (universal ad network detection)
      if (el.hasAttribute('data-widget-id') || 
          el.hasAttribute('data-funnel') || 
          el.hasAttribute('data-unit') ||
          el.hasAttribute('data-type')) {
        const dataType = el.getAttribute('data-type');
        if (!dataType || dataType === '_mgwidget') return true;
      }
      
      // Detect ad skeleton: many nested divs but no real text (lazy-loading ads)
      const childDivs = el.querySelectorAll('div').length;
      const hasText = el.innerText.trim().length > 50;
      if (childDivs > 5 && !hasText) return true;
      
      return false;
    }

    // ============ SITE-SPECIFIC SELECTORS ============
    
    getSiteSpecificSelectors() {
      return {
        // Major novel sites
        'novellive.app': ['.txt', 'div.txt', '#chapter-content'],
        'novelbin.com': ['.chr-c', '.chapter-content', '#chr-content'],
        'novelbin.net': ['.chr-c', '.chapter-content', '#chr-content'],
        'readlightnovel.com': ['.chapter-content', '.reading-content', '.desc'],
        'wuxiaworld.com': ['.chapter-content', '#chapter-content'],
        'webnovel.com': ['#chapterContent', '.cha-content', '.chapter_content'],
        'royalroad.com': ['.chapter-content', '.chapter-inner'],
        'scribblehub.com': ['.chp_raw', '#chp_raw'],
        'lightnovelpub.com': ['#chapter-container', '.chapter-content'],
        'fanfiction.net': ['#storytext', '.storytext'],
        'archiveofourown.org': ['#chapters', '.userstuff'],
        'freewebnovel.com': ['.txt', '.chapter-content'],
        'novelfull.com': ['#chr-content', '.chr-c'],
        'boxnovel.com': ['.text-left', '.reading-content'],
        'mtlnovel.com': ['.par', '.post-content'],
        'novelhall.com': ['#htmlContent', '.entry-content'],
        // Ranobes network (note: #arrticle is their typo, not ours)
        'ranobes.net': ['.text', '#arrticle', 'div.text', '.story'],
        'ranobes.top': ['.text', '#arrticle', 'div.text', '.story'],
        'ranobes.com': ['.text', '#arrticle', 'div.text', '.story'],
        // Additional sites
        'lightnovelworld.com': ['.chapter-content', '.reading-content'],
        'novelupdates.cc': ['.text-left', '.chapter-content'],
        'allnovel.org': ['.chr-c', '.chapter-content'],
        'noveltop1.org': ['.content-text', '#content'],
        'readnovelfull.com': ['#chr-content', '.chr-c'],
        'lightnovelcave.com': ['#chapter-container', '.chapter-content'],
        'novelpub.com': ['#chapter-container', '.chapter-content']
      };
    }

    // Extract ALL candidate content blocks
    extractCandidates() {
      const candidates = [];
      const seen = new Set();
      const domain = this.getDomain();
      
      // PRIORITY 1: Site-specific hardcoded selectors (most reliable)
      const siteSelectors = this.getSiteSpecificSelectors();
      const domainKey = Object.keys(siteSelectors).find(key => domain.includes(key));
      
      if (domainKey && siteSelectors[domainKey]) {
        siteSelectors[domainKey].forEach(sel => {
          const el = document.querySelector(sel);
          if (el && !seen.has(el)) {
            const features = this.extractFeatures(el);
            features.source = 'site-specific';
            if (features.textLength > 300) {
              seen.add(el);
              candidates.push({ el, features, selector: sel, source: 'site-specific' });
              VisualLog.add(`📌 Site-specific match: ${sel}`);
            }
          }
        });
      }
      
      // If site-specific found good content, return early
      if (candidates.length > 0 && candidates[0].features.wordCount > 500) {
        return candidates;
      }
      
      // PRIORITY 2: Primary generic selectors
      const primarySelectors = [
        'article', 'main',
        'div[class*="content"]', 'div[class*="chapter"]', 'div[class*="text"]',
        'div[id*="content"]', 'div[id*="chapter"]', 'div[id*="text"]',
        '.entry-content', '.post-content', '.reading-content'
      ];
      
      primarySelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (seen.has(el)) return;
          
          // AGGRESSIVE JUNK FILTERING
          if (this.isObviousJunk(el)) {
            VisualLog.add(`🚫 Junk skipped: ${(el.className || el.id || el.tagName).substring(0, 30)}`, 'error');
            return;
          }
          
          // Check negative patterns
          if (this.isNegativePattern(el)) {
            VisualLog.add(`🚫 Blocked pattern skipped`, 'error');
            return;
          }
          
          seen.add(el);
          const features = this.extractFeatures(el);
          features.source = 'generic';
          if (features.textLength > 200) {
            candidates.push({ el, features, selector: sel, source: 'generic' });
          }
        });
      });
      
      // PRIORITY 3: Fallback - scan all divs with class/id
      if (candidates.length === 0) {
        document.querySelectorAll('div[class], div[id]').forEach(el => {
          if (seen.has(el)) return;
          if (this.isObviousJunk(el)) return;
          if (this.isNegativePattern(el)) return;
          
          const features = this.extractFeatures(el);
          if (features.textLength > 500) {
            seen.add(el);
            features.source = 'fallback';
            const sel = el.id ? `#${el.id}` : `.${(el.className || '').split(' ')[0]}`;
            candidates.push({ el, features, selector: sel, source: 'fallback' });
          }
        });
      }
      
      return candidates;
    }

    extractFeatures(el) {
      const text = el.innerText || '';
      const html = el.innerHTML || '';
      
      // Count actual link elements (more accurate than text-based)
      const links = el.querySelectorAll('a');
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;
      
      // Filter out navigation links (prev/next/toc) for more accurate density
      const navLinks = Array.from(links).filter(a => 
        /prev|next|chapter\s*\d|bookmark|toc|table.of.contents|back|forward|index|home/i.test(a.textContent)
      );
      const contentLinkCount = links.length - navLinks.length;
      
      // Link density by element count: content links per 10 words
      const linkDensityByCount = wordCount > 0 ? contentLinkCount / (wordCount / 10) : 0;
      
      // Link density by text length (traditional, uses all links)
      const linkText = Array.from(links).reduce((sum, a) => sum + a.innerText.length, 0);
      const linkDensityByText = text.length > 0 ? linkText / text.length : 0;
      
      // Use the higher of the two (more conservative)
      const linkDensity = Math.max(linkDensityByCount / 10, linkDensityByText);
      const linkCount = contentLinkCount;
      
      return {
        textLength: text.length,
        wordCount,
        paragraphCount: (html.match(/<p[^>]*>/gi) || []).length,
        depth: this.getDepth(el),
        className: el.className || '',
        id: el.id || '',
        tagName: el.tagName.toLowerCase(),
        linkCount,
        linkDensity,
        hasNavigation: this.hasNavigationWords(text),
        scriptCount: el.querySelectorAll('script, style').length,
        cssPath: this.getCSSPath(el),
        source: 'unknown'
      };
    }

    getDepth(el) {
      let depth = 0;
      let current = el;
      while (current.parentElement && depth < 20) {
        depth++;
        current = current.parentElement;
      }
      return depth;
    }

    hasNavigationWords(text) {
      return /next\s+chapter|prev\s+chapter|table\s+of\s+contents|bookmark|report|navigation/gi.test(text);
    }

    getCSSPath(el) {
      const path = [];
      let current = el;
      
      while (current && current !== document.body && path.length < 5) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
          selector += `#${current.id}`;
          path.unshift(selector);
          break;
        } else if (current.className) {
          const classes = (current.className || '').split(/\s+/).filter(c => c.length > 0);
          if (classes.length > 0) selector += `.${classes[0]}`;
        }
        path.unshift(selector);
        current = current.parentElement;
      }
      
      return path.join(' > ');
    }

    scoreCandidate(features, learnedPattern = null) {
      let score = 0;
      
      // Base scoring
      score += Math.min(features.wordCount / 1000, 1) * 40;
      score += Math.min(features.paragraphCount / 10, 1) * 20;
      
      // ============ NUCLEAR LINK DENSITY PENALTY ============
      // If >50% links, this is almost certainly navigation/menu
      if (features.linkDensity > 0.5) {
        score -= 100; // Kill it completely
        VisualLog.add(`🚫 High link density (${(features.linkDensity * 100).toFixed(0)}%)`, 'error');
      } else if (features.linkDensity > 0.3) {
        score -= 70; // Heavy penalty
      } else if (features.linkDensity > 0.15) {
        score -= 40; // Moderate penalty
      } else {
        score -= features.linkDensity * 30; // Light penalty
      }
      
      // Navigation words penalty (increased)
      score -= features.hasNavigation ? 30 : 0;
      
      // Script penalty
      score -= features.scriptCount * 10;
      
      // Depth bonus (content usually nested)
      const idealDepth = 8;
      score -= Math.min(Math.abs(features.depth - idealDepth) * 2, 15);
      
      // ============ SOURCE BOOST ============
      if (features.source === 'site-specific') {
        score += 60; // Massive boost for hardcoded selectors
      }
      
      // ============ LEARNED PATTERN BOOST ============
      if (learnedPattern?.signature) {
        if (features.cssPath === learnedPattern.signature.cssPath) {
          score += 40;
        } else if (features.className && learnedPattern.signature.className &&
                   features.className === learnedPattern.signature.className) {
          score += 30;
        } else if (features.id && learnedPattern.signature.id &&
                   features.id === learnedPattern.signature.id) {
          score += 35;
        }
        
        // Extra boost for manually selected patterns
        if (learnedPattern.manuallySelected) {
          score += 50;
        }
        
        // Cross-book confidence boost: Patterns validated across multiple books are more trustworthy
        if (learnedPattern.booksUsing?.length > 3) {
          score += 20; // Multi-book validation (4+ books)
        } else if (learnedPattern.booksUsing?.length > 1) {
          score += 10; // Some cross-book validation (2-3 books)
        }
      }
      
      return Math.max(0, Math.min(score, 100));
    }

    findBestCandidate(candidates, learnedSignature = null) {
      const scored = candidates.map(c => ({
        ...c,
        score: this.scoreCandidate(c.features, learnedSignature ? { signature: learnedSignature } : null)
      }));
      
      scored.sort((a, b) => b.score - a.score);
      
      if (scored.length > 0) {
        VisualLog.add(`📊 ${scored.length} candidates, best: ${scored[0].score.toFixed(0)}pts`);
      }
      
      return scored[0] || null;
    }

    learn(winner, bookId = null) {
      const domain = this.getDomain();
      
      if (!this.db[domain]) {
        this.db[domain] = {
          signature: winner.features,
          confidence: 0.5,
          samples: 1,
          successCount: 0,
          failureCount: 0,
          booksUsing: bookId ? [bookId] : [],
          lastUpdate: Date.now()
        };
        VisualLog.add(`🔍 Learning pattern for ${domain}`);
      } else {
        const old = this.db[domain].signature;
        const blend = (o, n, w = 0.3) => o * (1 - w) + n * w;
        
        this.db[domain].signature = {
          ...old,
          textLength: blend(old.textLength, winner.features.textLength),
          wordCount: blend(old.wordCount, winner.features.wordCount),
          paragraphCount: blend(old.paragraphCount, winner.features.paragraphCount),
          depth: Math.round(blend(old.depth, winner.features.depth)),
          cssPath: old.cssPath === winner.features.cssPath ? old.cssPath : 'variable',
          className: old.className === winner.features.className ? old.className : 'variable',
          id: old.id === winner.features.id ? old.id : 'variable'
        };
        
        this.db[domain].samples++;
        this.db[domain].confidence = Math.min(0.95, 0.5 + (this.db[domain].samples * 0.05));
        this.db[domain].lastUpdate = Date.now();
        
        if (bookId && !this.db[domain].booksUsing.includes(bookId)) {
          this.db[domain].booksUsing.push(bookId);
        }
      }
      
      this._save();
      Events.emit('pattern:learned', { domain, confidence: this.db[domain].confidence });
    }

    recordFeedback(wasCorrect, bookId = null) {
      const domain = this.getDomain();
      const pattern = this.db[domain];
      if (!pattern) return;

      if (wasCorrect) {
        pattern.confidence = Math.min(0.98, pattern.confidence + 0.05);
        pattern.successCount = (pattern.successCount || 0) + 1;
        VisualLog.add(`✓ Pattern validated (${Math.round(pattern.confidence * 100)}%)`, 'success');
      } else {
        pattern.confidence = Math.max(0.2, pattern.confidence - 0.15);
        pattern.failureCount = (pattern.failureCount || 0) + 1;
        VisualLog.add(`✗ Pattern rejected (${Math.round(pattern.confidence * 100)}%)`, 'error');
        
        if (pattern.failureCount >= 3) {
          VisualLog.add(`⚠️ Resetting pattern for ${domain}`, 'error');
          delete this.db[domain];
        }
      }
      
      this._save();
      Events.emit('pattern:feedback', { domain, wasCorrect, confidence: pattern?.confidence });
    }

    extractWithLearning(bookId = null) {
      const learnedPattern = this.getPattern();
      const threshold = Config.get('AUTO_VALIDATE_THRESHOLD');
      const isTrusted = learnedPattern && learnedPattern.confidence >= threshold;
      
      if (isTrusted) {
        const booksCount = learnedPattern.booksUsing?.length || 0;
        VisualLog.add(`✓ Trusted pattern (${booksCount} books, ${Math.round(learnedPattern.confidence * 100)}%)`);
      }
      
      const candidates = this.extractCandidates();
      const winner = this.findBestCandidate(candidates, learnedPattern?.signature);
      
      if (!winner) return null;
      
      this.learn(winner, bookId);
      
      return {
        el: winner.el,
        selector: winner.selector,
        score: winner.score,
        isTrusted,
        confidence: learnedPattern?.confidence || 0.5
      };
    }

    getDomainStats() {
      const domain = this.getDomain();
      const pattern = this.db[domain];
      
      if (!pattern) return null;
      
      return {
        domain,
        confidence: pattern.confidence,
        samples: pattern.samples,
        successCount: pattern.successCount || 0,
        failureCount: pattern.failureCount || 0,
        booksUsing: pattern.booksUsing || [],
        lastUpdate: pattern.lastUpdate
      };
    }

    getAllPatterns() {
      return Object.entries(this.db).map(([domain, pattern]) => ({
        domain,
        ...pattern
      })).sort((a, b) => b.lastUpdate - a.lastUpdate);
    }
  }

  // Global pattern learner instance
  const Patterns = new PatternLearner();

  /* ============================================================
     SECTION 1.7: VISUAL ELEMENT SELECTOR
     ============================================================ */

  class ElementSelector {
    constructor() {
      this.isActive = false;
      this.highlightedEl = null;
      this.overlay = null;
      this.instructionsEl = null;
      this.onSelect = null;
      this.hoverHandler = null;
      this.clickHandler = null;
    }

    activate(onSelectCallback) {
      if (this.isActive) return;
      
      this.isActive = true;
      this.onSelect = onSelectCallback;
      
      // Create dark overlay
      this.overlay = document.createElement('div');
      this.overlay.id = 'nl-selector-overlay';
      this.overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: ${Config.get('Z_INDEX') + 100};
        pointer-events: none;
      `;
      
      // Create instructions banner
      this.instructionsEl = document.createElement('div');
      this.instructionsEl.id = 'nl-selector-instructions';
      this.instructionsEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 14px;
        font-size: 14px;
        text-align: center;
        z-index: ${Config.get('Z_INDEX') + 101};
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      `;
      this.instructionsEl.innerHTML = `
        <div style="font-weight:700;margin-bottom:8px;font-size:16px;">👆 Tap the Chapter Content</div>
        <div style="font-size:12px;color:#aaa;margin-bottom:12px;">Touch content areas to highlight, tap to select</div>
        <button id="nl-selector-cancel" style="
          padding: 10px 20px;
          background: #ff453a;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        ">Cancel</button>
      `;
      
      document.body.appendChild(this.overlay);
      document.body.appendChild(this.instructionsEl);
      
      this.instructionsEl.querySelector('#nl-selector-cancel').onclick = () => {
        this.deactivate();
        if (this.onSelect) this.onSelect(null);
      };
      
      // Enable touch/hover highlighting
      this.enableHighlighting();
      
      VisualLog.add('👆 Selector mode active - tap content', 'info');
    }

    enableHighlighting() {
      document.body.style.cursor = 'crosshair';
      
      // Store original styles for restoration
      this.originalStyles = new Map();
      
      this.hoverHandler = (e) => {
        if (!this.isActive) return;
        
        // Ignore our own UI elements
        if (e.target.closest('#nl-selector-overlay, #nl-selector-instructions, #nl-root, #nl-debug')) {
          return;
        }
        
        e.stopPropagation();
        
        // Remove previous highlight
        if (this.highlightedEl && this.highlightedEl !== e.target) {
          this.removeHighlight(this.highlightedEl);
        }
        
        // Highlight current element
        this.highlightedEl = e.target;
        this.applyHighlight(this.highlightedEl);
      };
      
      this.clickHandler = (e) => {
        if (!this.isActive) return;
        
        // Ignore our UI
        if (e.target.closest('#nl-selector-overlay, #nl-selector-instructions, #nl-root, #nl-debug')) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const selected = e.target;
        
        // Find a reasonable parent if user tapped on text or small element
        let contentEl = this.findContentContainer(selected);
        
        this.deactivate();
        
        if (this.onSelect) {
          this.onSelect(contentEl);
        }
      };
      
      // Use touchstart for mobile, mouseover for desktop
      document.addEventListener('touchstart', this.hoverHandler, { capture: true, passive: true });
      document.addEventListener('mouseover', this.hoverHandler, true);
      document.addEventListener('click', this.clickHandler, true);
      document.addEventListener('touchend', this.clickHandler, true);
    }

    applyHighlight(el) {
      if (!el) return;
      
      // Store original
      this.originalStyles.set(el, {
        outline: el.style.outline,
        backgroundColor: el.style.backgroundColor,
        boxShadow: el.style.boxShadow
      });
      
      // Apply highlight
      el.style.outline = '3px solid #FFD700';
      el.style.backgroundColor = 'rgba(255, 215, 0, 0.15)';
      el.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
    }

    removeHighlight(el) {
      if (!el) return;
      
      const original = this.originalStyles.get(el);
      if (original) {
        el.style.outline = original.outline;
        el.style.backgroundColor = original.backgroundColor;
        el.style.boxShadow = original.boxShadow;
        this.originalStyles.delete(el);
      } else {
        el.style.outline = '';
        el.style.backgroundColor = '';
        el.style.boxShadow = '';
      }
    }

    findContentContainer(el) {
      // If tapped element is small (like a <p> or <span>), walk up to find container
      let current = el;
      let iterations = 0;
      
      while (current && iterations < 10) {
        const text = current.innerText || '';
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        
        // If this element has substantial content (>100 words), use it
        if (wordCount > 100) {
          return current;
        }
        
        // Check if parent has significantly more content
        if (current.parentElement) {
          const parentText = current.parentElement.innerText || '';
          const parentWords = parentText.split(/\s+/).filter(w => w.length > 0).length;
          
          // If parent has 2x+ more content, move up
          if (parentWords > wordCount * 2 && parentWords > 200) {
            current = current.parentElement;
            iterations++;
            continue;
          }
        }
        
        // Current element is good enough
        break;
      }
      
      return current || el;
    }

    deactivate() {
      this.isActive = false;
      document.body.style.cursor = '';
      
      // Remove highlight
      if (this.highlightedEl) {
        this.removeHighlight(this.highlightedEl);
        this.highlightedEl = null;
      }
      
      // Clear all stored styles
      this.originalStyles?.forEach((styles, el) => {
        this.removeHighlight(el);
      });
      this.originalStyles = new Map();
      
      // Remove overlay and instructions
      if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
      }
      if (this.instructionsEl) {
        this.instructionsEl.remove();
        this.instructionsEl = null;
      }
      
      // Remove event listeners
      document.removeEventListener('touchstart', this.hoverHandler, { capture: true });
      document.removeEventListener('mouseover', this.hoverHandler, true);
      document.removeEventListener('click', this.clickHandler, true);
      document.removeEventListener('touchend', this.clickHandler, true);
      
      VisualLog.add('Selector deactivated', 'info');
    }
  }

  // Global element selector instance
  const Selector = new ElementSelector();

  /* --- Utilities --- */
  const Utils = {
    slugify: (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
    wordCount: (h) => h.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length,
    getChapterNum: (url, title) => {
      const p = [/chapter-(\d+)/i, /ch-?(\d+)/i, /(\d+)-/, /Chapter\s*(\d+)/i];
      for (let r of p) {
        let m = url.match(r) || title.match(r);
        if (m) return parseInt(m[1]);
      }
      return null;
    }
  };

  /* --- VisualLog: Debug panel (can be hidden in production) --- */
  const VisualLog = {
    el: null,
    log: [],
    enabled: true, // Set false to hide debug panel
    init() {
      if (this.el || !this.enabled) return;
      this.el = document.createElement('div');
      this.el.id = 'nl-debug';
      this.el.style.cssText = `position:fixed;top:10px;left:10px;width:260px;max-height:120px;background:rgba(0,0,0,0.9);color:#0f0;font:9px monospace;padding:6px;border-radius:8px;z-index:${Config.get('Z_INDEX')};overflow-y:auto;pointer-events:auto;border:1px solid #333;display:none;`;
      this.el.innerHTML = `<b style="color:#0af">NL v${Config.get('VERSION')}</b><div id="nl-log-content"></div>`;
      this.attach();
    },
    attach() {
      if (document.body) document.body.appendChild(this.el);
      else setTimeout(() => this.attach(), 100);
    },
    show() { if (this.el) this.el.style.display = 'block'; },
    hide() { if (this.el) this.el.style.display = 'none'; },
    add(msg, type = 'info') {
      this.init();
      const time = new Date().toLocaleTimeString().split(' ')[0];
      const color = type === 'error' ? '#f55' : type === 'success' ? '#5f5' : '#0f0';
      this.log.push({ time, msg, color });
      if (this.log.length > 50) this.log.shift();
      const content = this.el?.querySelector('#nl-log-content');
      if (content) {
        content.innerHTML = this.log.slice(-8).map(l => 
          `<span style="color:#666">${l.time}</span> <span style="color:${l.color}">${l.msg}</span>`
        ).join('<br>');
        this.el.scrollTop = this.el.scrollHeight;
      }
      // Also emit for MobileGUI log tab
      Events.emit('log:entry', { time, msg, type });
    }
  };

  /* ============================================================
     SECTION 2: AGGRESSIVE CONTENT CLEANER (3-LAYER)
     ============================================================ */

  class AggressiveCleaner {
    
    // Layer 1: Remove navigation elements before innerHTML extraction
    removeNavElements(container) {
      VisualLog.add('Layer 1: DOM surgery');
      
      // Clone to avoid mutating live DOM
      const clone = container.cloneNode(true);
      
      // Remove navigation links
      clone.querySelectorAll('a').forEach(link => {
        const text = link.innerText.toLowerCase();
        if (text.includes('prev chapter') || 
            text.includes('next chapter') || 
            text.includes('report') ||
            text.includes('prev') && text.length < 15 ||
            text.includes('next') && text.length < 15) {
          link.remove();
        }
      });
      
      // Remove common junk elements + universal ad networks
      const junkSelectors = [
        'script', 'style', 'iframe', 'ins', 'noscript',
        '.ads', '.advertisement', '[class*="ad-"]', '[id*="ad-"]',
        '.social-share', '.comments', 'footer', '.navigation',
        'nav', 'aside', '.sidebar', '.widget', 'form',
        
        // Universal ad networks (PUBFUTURE, SSP, MonetizeGo across all novel sites)
        '.PUBFUTURE',                    // PUBFUTURE wrapper
        '[class*="pf-"]',                // pf-config, pf-wrapper, pf-banner
        '[id*="pf-"]',                   // pf-10686-1, pf-2338-1
        '.free-support-top',             // Ranobes ad wrapper
        '[id*="bg-ssp-"]',               // bg-ssp-10448-*, bg-ssp-10534-*
        '[class*="bg-ssp-"]',            // bg-ssp-10448, bg-container-*
        '[data-widget-id]',              // Monetix/generic widget ads
        '[data-funnel]',                 // SSP funnel tracking
        '[data-type="_mgwidget"]',       // MonetizeGo widgets
        'div[class*="vpa-ssp"]',         // Video player ads
        'a[href*="pubadx"]',             // PubADX ad links
        'a[href*="aliexpress.com/e/"]'   // AliExpress affiliate spam
      ];
      
      junkSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(el => el.remove());
      });
      
      return clone;
    }

    // Layer 2: Fix UTF-8 encoding corruption
    fixEncoding(html) {
      VisualLog.add('Layer 2: Encoding fix');
      
      return html
        // Primary corruption patterns (Windows-1252 misread as UTF-8)
        .replace(/â€œ/g, '"')    // Opening double quote
        .replace(/â€/g, '"')     // Closing double quote  
        .replace(/â€™/g, "'")    // Apostrophe/possessive
        .replace(/â€˜/g, "'")    // Left single quote
        .replace(/â€¦/g, '…')    // Ellipsis
        .replace(/â€"/g, '—')    // Em dash
        .replace(/â€"/g, '–')    // En dash
        
        // Accented character corruptions
        .replace(/Ã©/g, 'é')    // é
        .replace(/Ã¨/g, 'è')    // è
        .replace(/Ã /g, 'à')    // à
        .replace(/Ã¡/g, 'á')    // á
        .replace(/Ã±/g, 'ñ')    // ñ
        .replace(/Ã¼/g, 'ü')    // ü
        .replace(/Ã¶/g, 'ö')    // ö
        .replace(/Ã¤/g, 'ä')    // ä
        .replace(/Ã§/g, 'ç')    // ç
        
        // Symbol corruptions
        .replace(/â„¢/g, '™')    // Trademark
        .replace(/Â©/g, '©')    // Copyright
        .replace(/Â®/g, '®')    // Registered
        .replace(/Â°/g, '°')    // Degree
        
        // Combined patterns
        .replace(/â€¦â€/g, '…"')  // Ellipsis + closing quote
        
        // Normalize smart quotes to standard
        .replace(/['']/g, "'")   // Smart single quotes → straight
        .replace(/[""]/g, '"')   // Smart double quotes → straight
        
        // Space corruptions
        .replace(/Â /g, ' ')     // Non-breaking space corruption
        .replace(/Â\s/g, ' ')   // NBSP variants
        .replace(/\u00A0/g, ' '); // Actual NBSP to regular space
    }

    // Layer 3: Remove terminal spam paragraphs
    removeTerminalSpam(html) {
      VisualLog.add('Layer 3: Terminal filter');
      
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const paragraphs = Array.from(temp.querySelectorAll('p'));
      
      if (paragraphs.length === 0) return html;
      
      // Get site-specific patterns from Intelligence
      const sitePatterns = Intelligence.getSiteSpamPatterns();
      
      // Spam patterns to detect (global + site-specific)
      const spamPatterns = [
        ...sitePatterns,
        // Navigation/UI spam
        'announcement:',
        'visit and read more',
        'use arrow keys',
        'report chapter',
        'prev/next chapter',
        '(or a / d)',
        'keyboard navigation',
        
        // Site watermarks
        'boxnovel.com',
        'bronovel.com',
        'novelfull.com',
        'readlightnovel',
        'wuxiaworld',
        'webnovel.com',
        
        // Call-to-action spam
        'please bookmark',
        'thank you so much!',
        'help us update chapter',
        'support the author',
        'reading on aggregator',
        'stolen from',
        'original site',
        
        // Social/donation spam
        'join discord',
        'join our discord',
        'patreon.com',
        'ko-fi.com',
        'paypal.me',
        'buy me a coffee',
        
        // Translator notes (end of chapter)
        'translator note',
        "translator's note",
        'tl note:',
        'a/n:',
        "author's note"
      ];
      
      // Check last 5 paragraphs
      const startIdx = Math.max(0, paragraphs.length - 5);
      const toRemove = [];
      
      for (let i = startIdx; i < paragraphs.length; i++) {
        const text = paragraphs[i].innerText.toLowerCase().trim();
        
        // Very short paragraphs at the end are likely junk
        if (text.length < Config.get('SPAM_PARAGRAPH_THRESHOLD') && i > startIdx) {
          toRemove.push(paragraphs[i]);
          continue;
        }
        
        // Check against spam patterns
        if (spamPatterns.some(pattern => text.includes(pattern))) {
          toRemove.push(paragraphs[i]);
        }
      }
      
      VisualLog.add(`Removed ${toRemove.length} spam paragraphs`);
      toRemove.forEach(p => p.remove());
      
      return temp.innerHTML;
    }

    // Full 3-layer pipeline
    clean(container) {
      if (!container) {
        VisualLog.add('❌ No container to clean', 'error');
        return '';
      }
      
      // Layer 1: DOM surgery (pre-extraction)
      const cleaned = this.removeNavElements(container);
      
      // Layer 2: Encoding normalization (post-extraction)
      let html = cleaned.innerHTML;
      html = this.fixEncoding(html);
      
      // Layer 3: Terminal spam removal
      html = this.removeTerminalSpam(html);
      
      return html;
    }
  }

  /* ============================================================
     SECTION 3: STORAGE LAYER (THE CATALOG)
     ============================================================ */

  class CatalogStore {
    constructor() {
      this.KEY = Config.get('PREFIX') + 'Library';
    }
    get() { return SafeStorage.get(this.KEY, {}); }
    save(slug, bookData) {
      const lib = this.get();
      lib[slug] = bookData;
      SafeStorage.set(this.KEY, lib);
    }
    logReceipt(slug, title, chapterData) {
      const lib = this.get();
      if (!lib[slug]) lib[slug] = { title, slug, chapters: {}, gaps: [] };
      lib[slug].chapters[chapterData.number] = {
        num: chapterData.number,
        title: chapterData.title,
        quality: chapterData.quality,
        words: chapterData.words,
        ts: Date.now()
      };
      this.save(slug, lib[slug]);
      this.detectGaps(slug);
    }
    detectGaps(slug) {
      const book = this.get()[slug];
      if (!book || !book.chapters) return;
      const nums = Object.keys(book.chapters).map(Number).sort((a,b)=>a-b);
      const gaps = [];
      for(let i=0; i<nums.length-1; i++) {
        for(let j=nums[i]+1; j<nums[i+1]; j++) gaps.push(j);
      }
      book.gaps = gaps;
      this.save(slug, book);
      if (gaps.length > 0) {
        VisualLog.add(`📊 ${gaps.length} gaps detected`);
      }
    }
  }

  /* --- BatchController: Full batch state management with pause/stop/resume --- */
  class BatchController {
    constructor() {
      this.KEY = Config.get('PREFIX') + 'Batch';
      this.state = this._load();
    }
    
    _load() {
      return SafeStorage.get(this.KEY, {
        active: false,
        paused: false,
        stopped: false,
        current: 0,
        total: 0,
        skipped: [],
        startTime: null
      });
    }
    
    _save() {
      SafeStorage.set(this.KEY, this.state);
    }
    
    get isActive() { return this.state.active && !this.state.stopped; }
    get isPaused() { return this.state.paused; }
    get isStopped() { return this.state.stopped; }
    get current() { return this.state.current; }
    get total() { return this.state.total; }
    get skipped() { return this.state.skipped; }
    get progress() { return this.state.total > 0 ? this.state.current / this.state.total : 0; }
    
    start(total) {
      this.state = {
        active: true,
        paused: false,
        stopped: false,
        current: 0,
        total,
        skipped: [],
        startTime: Date.now()
      };
      this._save();
      Events.emit('batch:start', { total });
      VisualLog.add(`📚 Batch started: ${total} chapters`);
    }
    
    pause() {
      if (!this.state.active) return;
      this.state.paused = true;
      this._save();
      Events.emit('batch:paused', { current: this.state.current, total: this.state.total });
      VisualLog.add('⏸️ Batch paused', 'info');
    }
    
    resume() {
      if (!this.state.active || !this.state.paused) return;
      this.state.paused = false;
      this._save();
      Events.emit('batch:resumed', { current: this.state.current, total: this.state.total });
      VisualLog.add('▶️ Batch resumed', 'info');
    }
    
    stop() {
      if (!this.state.active) return;
      const summary = this._getSummary();
      this.state.stopped = true;
      this.state.active = false;
      this._save();
      Events.emit('batch:stopped', summary);
      VisualLog.add(`⏹️ Batch stopped at ${summary.completed}/${summary.total}`, 'info');
      this.clear();
    }
    
    increment() {
      this.state.current++;
      this._save();
      Events.emit('batch:progress', { 
        current: this.state.current, 
        total: this.state.total,
        progress: this.progress,
        skipped: this.state.skipped.length
      });
    }
    
    skip(chapterNum, reason) {
      this.state.skipped.push({ chapter: chapterNum, reason, ts: Date.now() });
      this._save();
      Events.emit('batch:skip', { chapter: chapterNum, reason });
      VisualLog.add(`⏭️ Skipped Ch ${chapterNum}: ${reason}`, 'error');
    }
    
    complete() {
      const summary = this._getSummary();
      this.state.active = false;
      this._save();
      Events.emit('batch:complete', summary);
      VisualLog.add(`🎉 Batch complete: ${summary.completed}/${summary.total} (${summary.skipped} skipped)`, 'success');
      this.clear();
    }
    
    _getSummary() {
      const duration = this.state.startTime ? Date.now() - this.state.startTime : 0;
      return {
        total: this.state.total,
        completed: this.state.current - this.state.skipped.length,
        skipped: this.state.skipped.length,
        skippedChapters: [...this.state.skipped],
        duration,
        durationStr: `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`
      };
    }
    
    clear() {
      SafeStorage.remove(this.KEY);
      this.state = this._load();
    }
    
    // Reload state from storage (for page navigation)
    reload() {
      this.state = this._load();
    }
  }

  /* ============================================================
     SECTION 4: L1 ENGINE & L2 OBSERVER
     ============================================================ */

  class ContentExtractor {
    constructor() {
      this.lastSelector = null;
    }

    findContent() {
      // Use Intelligence for ranked selectors (learned patterns first)
      const rankedSelectors = Intelligence.getRankedSelectors();
      
      for (let s of rankedSelectors) {
        const el = document.querySelector(s);
        if (el && el.innerText.length > Config.get('MIN_CONTENT_LENGTH')) {
          const confidence = Intelligence.getConfidence();
          const badge = confidence >= 0.7 ? '🧠' : confidence >= 0.3 ? '📖' : '🔍';
          VisualLog.add(`${badge} Content: ${s} (${Math.round(confidence * 100)}% conf)`);
          this.lastSelector = s;
          return el;
        }
      }
      
      // Fallback: largest div (heuristic)
      let max = 0, best = null, bestSel = null;
      document.querySelectorAll('div[class], div[id]').forEach(d => {
        const len = d.innerText.length;
        if (len > max && len > Config.get('MIN_CONTENT_LENGTH')) { 
          max = len; 
          best = d;
          bestSel = d.id ? `#${d.id}` : `.${d.className.split(' ')[0]}`;
        }
      });
      
      if (best) {
        VisualLog.add(`🔍 Content: fallback (${bestSel})`);
        this.lastSelector = bestSel;
      }
      return best;
    }

    getLastSelector() {
      return this.lastSelector;
    }
    
    findNext() {
      const links = document.querySelectorAll('a');
      for (let a of links) {
        const t = a.innerText.toLowerCase();
        if (['next', 'siguiente', '→', '»'].some(x => t.includes(x)) && t.length < 20) {
          return a.href;
        }
      }
      return null;
    }
  }

  class L2Observer {
    score(content, words) {
      const pCount = (content.match(/<p>/g) || []).length;
      const lengthScore = Math.min(1, words / Config.get('MIN_WORDS'));
      const structScore = Math.min(1, pCount / 5);
      const overall = (lengthScore + structScore) / 2;
      
      const badge = overall >= 0.8 ? '🟢' : overall >= 0.6 ? '🟡' : '🔴';
      VisualLog.add(`Quality: ${badge} ${(overall*100).toFixed(0)}%`);
      
      return { overall, words, pCount };
    }
  }

  /* ============================================================
     SECTION 5: L3 INTERFACE & TOASTS
     ============================================================ */

  const Toast = {
    show(msg, type = 'info') {
      const t = document.createElement('div');
      const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
      t.style.cssText = `position:fixed;top:calc(env(safe-area-inset-top, 20px) + 10px);right:20px;background:${bg};color:white;padding:12px 18px;border-radius:12px;font:14px -apple-system,sans-serif;z-index:${Config.get('Z_INDEX')};box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:nlFade 0.3s;pointer-events:auto;max-width:280px;`;
      t.textContent = msg;
      if (document.body) {
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
      }
    }
  };

  /* ============================================================
     SECTION 6: THE LIBRARIAN ORCHESTRATOR (v3.3 - Book-Aware)
     ============================================================ */

  class Librarian {
    constructor(batchController) {
      this.catalog = new CatalogStore();
      this.extractor = new ContentExtractor();
      this.observer = new L2Observer();
      this.cleaner = new AggressiveCleaner();
      this.batch = batchController;
      this.currentBook = null;
      this.gui = null; // Set by MobileGUI after construction
    }

    setGUI(gui) {
      this.gui = gui;
    }

    async download() {
      VisualLog.add('🔽 Download started');
      Events.emit('download:start', { url: window.location.href });
      
      // === STEP 1: Detect Book Context ===
      let bookData = Books.detectBook();
      
      // If detection failed and prompting is enabled, ask user
      if (bookData.detectionFailed && Config.get('ASK_FOR_BOOK_TITLE') && this.gui) {
        VisualLog.add('📝 Asking for book title...', 'info');
        
        const manualTitle = await this.gui.promptBookTitle(bookData.title);
        
        if (manualTitle) {
          bookData = Books.normalizeBook({
            title: manualTitle,
            author: 'Unknown',
            isUnknown: false
          });
          Toast.show(`Book: ${manualTitle}`, 'success');
        } else {
          Toast.show('Using fallback title', 'info');
        }
      }
      
      this.currentBook = Books.getOrCreateBook(bookData);
      
      if (this.currentBook.isUnknown) {
        VisualLog.add(`📖 "${this.currentBook.title}" (unverified)`, 'info');
      } else {
        VisualLog.add(`📖 "${this.currentBook.title}"`, 'info');
      }

      // === STEP 2: Extract Content with Pattern Learning ===
      let extraction = Patterns.extractWithLearning(this.currentBook.id);
      
      if (!extraction || !extraction.el) {
        VisualLog.add('❌ No content found', 'error');
        Toast.show('No content found', 'error');
        Patterns.recordFeedback(false, this.currentBook.id);
        Events.emit('download:error', { reason: 'no-content' });
        return null;
      }

      let selectedEl = extraction.el;
      let wasManuallySelected = false;

      // === STEP 3: Validation (based on mode and trust) ===
      const validationMode = Config.get('VALIDATION_MODE');
      let shouldValidate = false;
      
      if (validationMode === 'always') {
        shouldValidate = true;
      } else if (validationMode === 'auto') {
        shouldValidate = !extraction.isTrusted;
      }
      // 'never' = shouldValidate stays false

      if (shouldValidate && this.gui) {
        const preview = selectedEl.innerText.substring(0, 400).trim() + '...';
        const domain = Patterns.getDomain();
        
        const result = await this.gui.validateExtraction(
          Utils.getChapterNum(window.location.href, document.title),
          this.currentBook.title,
          preview,
          // onConfirm
          () => {
            Patterns.recordFeedback(true, this.currentBook.id);
            const stats = Patterns.getDomainStats();
            if (stats && stats.confidence >= Config.get('AUTO_VALIDATE_THRESHOLD')) {
              Toast.show(`🎓 ${stats.domain} pattern trusted!`, 'success');
            }
          },
          // onReject - Store negative pattern AND abort
          () => {
            Patterns.addNegativePattern(selectedEl, 'user_rejected');
            Patterns.recordFeedback(false, this.currentBook.id);
            Toast.show('Pattern blocked - will skip in future', 'error');
          },
          // onManualSelect - NEW!
          () => {
            // This callback is called before the promise resolves
            // The actual selection happens after resolve('manual')
          }
        );
        
        if (result === 'bad') {
          VisualLog.add('❌ User rejected extraction', 'error');
          Events.emit('download:cancelled', { reason: 'user-rejected' });
          return null;
        }
        
        if (result === 'manual') {
          // Activate element selector and wait for user pick
          VisualLog.add('👆 Manual selection mode...', 'info');
          
          const pickedEl = await new Promise((resolve) => {
            Selector.activate((el) => {
              resolve(el);
            });
          });
          
          if (!pickedEl) {
            VisualLog.add('❌ Selection cancelled', 'error');
            return null;
          }
          
          // Block the wrong element, save the correct one
          Patterns.addNegativePattern(selectedEl, 'replaced_by_manual');
          Patterns.setManualSelection(pickedEl);
          
          selectedEl = pickedEl;
          wasManuallySelected = true;
          
          Toast.show('Pattern saved! Future chapters will use this.', 'success');
          VisualLog.add(`✓ Manual selection: ${selectedEl.className || selectedEl.tagName}`, 'success');
        }
      } else {
        // Auto-accepted (trusted or validation disabled)
        Patterns.recordFeedback(true, this.currentBook.id);
      }

      // === STEP 4: Clean Content ===
      const cleanHtml = this.cleaner.clean(selectedEl);
      
      if (!cleanHtml || cleanHtml.length < 200) {
        VisualLog.add('❌ Content too short after cleaning', 'error');
        Toast.show('Content cleaning failed', 'error');
        if (!wasManuallySelected) {
          Patterns.recordFeedback(false, this.currentBook.id);
        }
        Events.emit('download:error', { reason: 'content-too-short' });
        return null;
      }

      const title = document.querySelector('h1')?.innerText || document.title;
      const num = Utils.getChapterNum(window.location.href, title);
      const nextUrl = this.extractor.findNext();
      const words = Utils.wordCount(cleanHtml);
      const metrics = this.observer.score(cleanHtml, words);

      // === STEP 5: Generate File with Book Context ===
      const safeBookTitle = this.currentBook.title
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 30);
      
      const filename = `${safeBookTitle}_Ch${num || 'X'}.html`;
      
      const fileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.currentBook.title} - Chapter ${num}</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 18px;
      line-height: 1.8;
      max-width: 42rem;
      margin: 0 auto;
      padding: 1.5rem;
      background: #fafafa;
      color: #1a1a1a;
    }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e0e0e0; }
    }
    .book-header {
      text-align: center;
      border-bottom: 2px solid #ccc;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .book-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .chapter-num {
      font-size: 1.1rem;
      color: #666;
    }
    p {
      margin-bottom: 1em;
      text-align: justify;
    }
  </style>
</head>
<body>
  <div class="book-header">
    <div class="book-title">${this.currentBook.title}</div>
    <div class="chapter-num">Chapter ${num || '?'}</div>
  </div>
  ${cleanHtml}
</body>
</html>`;

      const blob = new Blob([fileHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = filename;
      a.click();
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), Config.get('BLOB_REVOKE_DELAY_MS'));

      // === STEP 6: Track in Book & Legacy Catalog ===
      Books.addChapter(this.currentBook.id, num, window.location.href, words);
      
      // Legacy catalog support
      const bookSlug = Utils.slugify(this.currentBook.title);
      this.catalog.logReceipt(bookSlug, this.currentBook.title, {
        number: num, title, quality: metrics.overall, words
      });
      
      // Report to ContentIntelligence (legacy)
      Intelligence.recordSuccess(extraction.selector, words, metrics.overall);

      VisualLog.add(`✓ ${this.currentBook.title} Ch${num} (${words}w)`, 'success');
      Toast.show(`${this.currentBook.title} - Ch${num}`, 'success');
      
      Events.emit('download:complete', { 
        num, 
        words, 
        quality: metrics.overall, 
        book: this.currentBook.title 
      });

      return { num, nextUrl, metrics, book: this.currentBook };
    }

    async startBatch(total) {
      // Ensure we have a book context before starting batch
      const bookData = Books.detectBook();
      
      if (bookData.detectionFailed && Config.get('ASK_FOR_BOOK_TITLE') && this.gui) {
        const manualTitle = await this.gui.promptBookTitle(bookData.title);
        if (manualTitle) {
          Books.getOrCreateBook(Books.normalizeBook({
            title: manualTitle,
            author: 'Unknown'
          }));
        } else {
          Books.getOrCreateBook(bookData);
        }
      } else {
        Books.getOrCreateBook(bookData);
      }
      
      this.currentBook = Books.getCurrentBook();
      
      // Update book-level batch state
      Books.updateBatchState(this.currentBook.id, {
        isActive: true,
        current: 0,
        target: total
      });
      
      this.batch.start(total);
      Toast.show(`Batch: ${total} chapters of "${this.currentBook.title}"`, 'info');
      this.runBatch();
    }

    async runBatch() {
      this.batch.reload();
      
      if (!this.batch.isActive) {
        VisualLog.add('Batch not active', 'info');
        return;
      }
      
      if (this.batch.isPaused) {
        VisualLog.add('⏸️ Batch paused', 'info');
        return;
      }

      const title = document.querySelector('h1')?.innerText || document.title;
      const currentChapterNum = Utils.getChapterNum(window.location.href, title) || this.batch.current + 1;
      
      const res = await this.download();
      
      if (!res) {
        this.batch.skip(currentChapterNum, 'extraction-failed');
        this.batch.increment();
        
        const nextUrl = this.extractor.findNext();
        if (nextUrl && this.batch.current < this.batch.total) {
          VisualLog.add(`Skipped Ch${currentChapterNum}, trying next...`);
          setTimeout(() => window.location.href = nextUrl, Config.get('BATCH_DELAY_MS'));
          return;
        } else {
          this.batch.complete();
          if (this.currentBook) {
            Books.updateBatchState(this.currentBook.id, { isActive: false });
          }
          Toast.show(`Batch ended: ${this.batch.current}/${this.batch.total}`, 'info');
          return;
        }
      }

      this.batch.increment();
      
      // Update book batch state
      if (this.currentBook) {
        Books.updateBatchState(this.currentBook.id, { current: this.batch.current });
      }
      
      if (this.batch.current >= this.batch.total) {
        this.batch.complete();
        if (this.currentBook) {
          Books.updateBatchState(this.currentBook.id, { isActive: false });
        }
        Toast.show(`✓ Batch complete: ${this.batch.total} chapters`, 'success');
        return;
      }

      if (res.nextUrl) {
        const delay = Config.get('BATCH_DELAY_MS');
        VisualLog.add(`Batch ${this.batch.current}/${this.batch.total}. Next in ${delay/1000}s...`);
        setTimeout(() => window.location.href = res.nextUrl, delay);
      } else {
        this.batch.complete();
        if (this.currentBook) {
          Books.updateBatchState(this.currentBook.id, { isActive: false });
        }
        VisualLog.add('❌ No next link', 'error');
        Toast.show('Batch ended: no next chapter', 'info');
      }
    }
    
    pauseBatch() {
      this.batch.pause();
    }
    
    resumeBatch() {
      this.batch.resume();
      setTimeout(() => this.runBatch(), 500);
    }
    
    stopBatch() {
      this.batch.stop();
      if (this.currentBook) {
        Books.updateBatchState(this.currentBook.id, { isActive: false });
      }
      Toast.show('Batch stopped', 'info');
    }

    export() {
      // Export all data (books + legacy catalog)
      const exportData = {
        version: Config.get('VERSION'),
        exported: new Date().toISOString(),
        books: Books.getAllBooks(),
        patterns: Patterns.getAllPatterns(),
        legacyCatalog: this.catalog.get()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = `novel-library-${Date.now()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), Config.get('BLOB_REVOKE_DELAY_MS'));
      Toast.show('Library exported!', 'success');
      VisualLog.add('📤 Library exported', 'success');
    }
  }

  /* ============================================================
     SECTION 7: IOS COMMAND BLADE (MOBILE-FIRST UI)
     ============================================================ */

  class MobileGUI {
    constructor(lib) {
      this.lib = lib;
      this.isOpen = false;
      this.activeTab = 'control';
      this.logs = [];
      this.el = null;
      this.refs = {};
    }

    init() {
      if (document.getElementById('nl-root')) return;
      this.injectStyles();
      this.render();
      this.bindEvents();
      this.subscribeToEvents();
      this.syncState();
      VisualLog.add('✓ iOS Blade injected');
    }

    injectStyles() {
      const css = `
        :root {
          --nl-bg: rgba(28, 28, 30, 0.92);
          --nl-glass: blur(20px) saturate(180%);
          --nl-accent: #0a84ff;
          --nl-danger: #ff453a;
          --nl-warn: #ff9f0a;
          --nl-success: #30d158;
          --nl-text: #fff;
          --nl-text-dim: rgba(255,255,255,0.6);
          --nl-border: rgba(255,255,255,0.1);
          --nl-safe-bottom: env(safe-area-inset-bottom, 20px);
        }

        #nl-root {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          z-index: ${Config.get('Z_INDEX')};
        }

        /* FLOATING PILL (Collapsed State) */
        #nl-pill {
          position: fixed;
          bottom: calc(var(--nl-safe-bottom) + 70px);
          right: 16px;
          background: var(--nl-bg);
          backdrop-filter: var(--nl-glass);
          -webkit-backdrop-filter: var(--nl-glass);
          color: var(--nl-text);
          padding: 10px 16px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--nl-border);
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        #nl-pill:active { transform: scale(0.95); }
        #nl-pill.hidden { opacity: 0; transform: scale(0.8) translateY(20px); pointer-events: none; }
        .nl-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nl-success); }
        .nl-pill-dot.active { background: var(--nl-accent); animation: nl-pulse 1.5s infinite; }
        .nl-pill-dot.paused { background: var(--nl-warn); }

        /* BOTTOM SHEET (Expanded) */
        #nl-sheet {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          background: var(--nl-bg);
          backdrop-filter: var(--nl-glass);
          -webkit-backdrop-filter: var(--nl-glass);
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          max-height: 70vh;
          padding-bottom: var(--nl-safe-bottom);
          overflow: hidden;
        }
        #nl-sheet.open { transform: translateY(0); }

        /* DRAG HANDLE */
        .nl-handle { padding: 10px; display: flex; justify-content: center; cursor: grab; }
        .nl-handle-bar { width: 36px; height: 5px; background: rgba(255,255,255,0.3); border-radius: 3px; }

        /* TABS */
        .nl-tabs {
          display: flex;
          padding: 0 12px 8px;
          gap: 4px;
          border-bottom: 1px solid var(--nl-border);
        }
        .nl-tab {
          flex: 1;
          text-align: center;
          padding: 8px 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--nl-text-dim);
          border-radius: 8px;
          transition: 0.2s;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .nl-tab.active { background: rgba(255,255,255,0.1); color: var(--nl-text); }

        /* CONTENT */
        .nl-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          padding: 12px 16px;
        }
        .nl-view { display: none; }
        .nl-view.active { display: block; animation: nl-fadeIn 0.2s; }

        /* CARDS */
        .nl-card {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .nl-card-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--nl-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        /* STATUS DISPLAY */
        .nl-status-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 10px;
        }
        .nl-status-main { font-size: 32px; font-weight: 700; }
        .nl-status-sub { font-size: 14px; color: var(--nl-accent); }

        /* PROGRESS BAR */
        .nl-progress-track {
          background: rgba(255,255,255,0.1);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }
        .nl-progress-fill {
          height: 100%;
          background: var(--nl-accent);
          border-radius: 3px;
          transition: width 0.3s;
        }

        /* BUTTONS (50px touch targets) */
        .nl-btn-row { display: flex; gap: 10px; margin-top: 12px; }
        .nl-btn {
          flex: 1;
          height: 50px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: var(--nl-text);
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .nl-btn:active { transform: scale(0.96); opacity: 0.8; }
        .nl-btn.primary { background: var(--nl-accent); }
        .nl-btn.danger { background: var(--nl-danger); }
        .nl-btn.warn { background: var(--nl-warn); color: #000; }
        .nl-btn.success { background: var(--nl-success); color: #000; }

        /* SETTINGS ROWS */
        .nl-setting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--nl-border);
        }
        .nl-setting:last-child { border-bottom: none; }
        .nl-setting-info { flex: 1; }
        .nl-setting-label { font-size: 14px; font-weight: 500; }
        .nl-setting-desc { font-size: 11px; color: var(--nl-text-dim); margin-top: 2px; }
        
        /* STEPPER */
        .nl-stepper {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .nl-step-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          color: var(--nl-accent);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .nl-step-btn:active { background: rgba(255,255,255,0.1); }
        .nl-step-val {
          min-width: 60px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          border-left: 1px solid var(--nl-border);
          border-right: 1px solid var(--nl-border);
          padding: 0 4px;
        }

        /* LIBRARY GRID */
        .nl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
          gap: 6px;
        }
        .nl-cell {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.08);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--nl-text-dim);
        }
        .nl-cell.good { background: rgba(48, 209, 88, 0.2); color: var(--nl-success); border: 1px solid var(--nl-success); }
        .nl-cell.gap { background: rgba(255, 69, 58, 0.15); color: var(--nl-danger); border: 1px dashed var(--nl-danger); }

        /* LOG FEED */
        .nl-log-feed {
          font-family: 'SF Mono', 'Menlo', monospace;
          font-size: 11px;
          line-height: 1.6;
          color: var(--nl-text-dim);
        }
        .nl-log-entry { padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nl-log-time { color: rgba(255,255,255,0.3); margin-right: 8px; }
        .nl-log-success { color: var(--nl-success); }
        .nl-log-error { color: var(--nl-danger); }

        /* SITE INTELLIGENCE */
        .nl-site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .nl-site-domain { font-size: 16px; font-weight: 600; }
        .nl-confidence-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .nl-confidence-badge.high { background: rgba(48, 209, 88, 0.2); color: var(--nl-success); }
        .nl-confidence-badge.mid { background: rgba(255, 159, 10, 0.2); color: var(--nl-warn); }
        .nl-confidence-badge.low { background: rgba(255,255,255,0.1); color: var(--nl-text-dim); }
        .nl-site-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 12px 0;
        }
        .nl-stat-box {
          background: rgba(255,255,255,0.05);
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }
        .nl-stat-value { font-size: 20px; font-weight: 700; }
        .nl-stat-label { font-size: 10px; color: var(--nl-text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
        .nl-selector-list { margin-top: 12px; }
        .nl-selector-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--nl-border);
          font-size: 12px;
        }
        .nl-selector-item:last-child { border-bottom: none; }
        .nl-selector-name { font-family: 'SF Mono', monospace; color: var(--nl-accent); }
        .nl-selector-meta { color: var(--nl-text-dim); font-size: 10px; }

        /* VALIDATION MODAL OVERLAY */
        .nl-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: ${Config.get('Z_INDEX') + 10};
          animation: nl-fadeIn 0.2s;
        }
        .nl-modal {
          background: var(--nl-bg);
          backdrop-filter: var(--nl-glass);
          -webkit-backdrop-filter: var(--nl-glass);
          border-radius: 16px;
          width: calc(100% - 32px);
          max-width: 400px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          border: 1px solid var(--nl-border);
        }
        .nl-modal-header {
          padding: 16px;
          border-bottom: 1px solid var(--nl-border);
          text-align: center;
        }
        .nl-modal-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .nl-modal-subtitle {
          font-size: 13px;
          color: var(--nl-text-dim);
        }
        .nl-modal-body {
          padding: 16px;
          max-height: 50vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .nl-modal-footer {
          padding: 16px;
          border-top: 1px solid var(--nl-border);
          display: flex;
          gap: 10px;
        }
        
        /* VALIDATION PREVIEW */
        .nl-preview-text {
          background: rgba(255,255,255,0.05);
          padding: 14px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--nl-text);
          max-height: 180px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .nl-countdown {
          text-align: center;
          margin-top: 12px;
          font-size: 12px;
          color: var(--nl-text-dim);
        }
        .nl-countdown-num {
          display: inline-block;
          min-width: 24px;
          font-weight: 700;
          color: var(--nl-accent);
        }
        
        /* INPUT MODAL */
        .nl-input-field {
          width: 100%;
          padding: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--nl-border);
          border-radius: 10px;
          font-size: 16px;
          color: var(--nl-text);
          outline: none;
          transition: border-color 0.2s;
        }
        .nl-input-field:focus {
          border-color: var(--nl-accent);
        }
        .nl-input-field::placeholder {
          color: var(--nl-text-dim);
        }
        .nl-input-hint {
          margin-top: 8px;
          font-size: 12px;
          color: var(--nl-text-dim);
        }

        /* BOOK LIBRARY VIEW */
        .nl-book-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .nl-book-card {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: 0.15s;
        }
        .nl-book-card:active { transform: scale(0.98); }
        .nl-book-card.selected {
          border: 2px solid var(--nl-accent);
        }
        .nl-book-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .nl-book-title {
          font-size: 15px;
          font-weight: 600;
          flex: 1;
          margin-right: 10px;
        }
        .nl-book-badge {
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(255,255,255,0.1);
        }
        .nl-book-badge.verified { background: rgba(48, 209, 88, 0.2); color: var(--nl-success); }
        .nl-book-badge.unknown { background: rgba(255, 159, 10, 0.2); color: var(--nl-warn); }
        .nl-book-meta {
          font-size: 12px;
          color: var(--nl-text-dim);
          margin-bottom: 10px;
        }
        .nl-book-progress {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .nl-book-progress-fill {
          height: 100%;
          background: var(--nl-success);
          border-radius: 2px;
        }
        .nl-book-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: var(--nl-text-dim);
        }

        /* ANIMATIONS */
        @keyframes nl-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `;
      const style = document.createElement('style');
      style.id = 'nl-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    render() {
      const root = document.createElement('div');
      root.id = 'nl-root';
      root.innerHTML = `
        <!-- FLOATING PILL -->
        <div id="nl-pill">
          <div class="nl-pill-dot" id="nl-dot"></div>
          <span id="nl-pill-text">Ready</span>
        </div>

        <!-- BOTTOM SHEET -->
        <div id="nl-sheet">
          <div class="nl-handle" id="nl-handle">
            <div class="nl-handle-bar"></div>
          </div>

          <div class="nl-tabs">
            <div class="nl-tab active" data-tab="control">Control</div>
            <div class="nl-tab" data-tab="library">Library</div>
            <div class="nl-tab" data-tab="site">🧠</div>
            <div class="nl-tab" data-tab="settings">Settings</div>
            <div class="nl-tab" data-tab="log">Log</div>
          </div>

          <div class="nl-content">
            <!-- CONTROL TAB -->
            <div id="view-control" class="nl-view active">
              <div class="nl-card">
                <div class="nl-card-title">Status</div>
                <div class="nl-status-row">
                  <span class="nl-status-main" id="nl-status">Idle</span>
                  <span class="nl-status-sub" id="nl-status-sub"></span>
                </div>
                <div class="nl-progress-track">
                  <div class="nl-progress-fill" id="nl-progress" style="width:0%"></div>
                </div>
              </div>

              <div class="nl-card" id="nl-idle-controls">
                <div class="nl-btn-row">
                  <button class="nl-btn primary" id="btn-download">⬇ Download</button>
                  <button class="nl-btn" id="btn-batch">📚 Batch</button>
                </div>
                <div class="nl-btn-row">
                  <button class="nl-btn" id="btn-export">💾 Export</button>
                </div>
              </div>

              <div class="nl-card" id="nl-active-controls" style="display:none">
                <div class="nl-btn-row">
                  <button class="nl-btn warn" id="btn-pause">⏸ Pause</button>
                  <button class="nl-btn danger" id="btn-stop">⏹ Stop</button>
                </div>
              </div>
            </div>

            <!-- LIBRARY TAB -->
            <div id="view-library" class="nl-view">
              <div class="nl-card">
                <div class="nl-card-title">Chapter Map</div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px;color:var(--nl-text-dim)">
                  <span>🟢 Downloaded</span>
                  <span>🔴 Gap</span>
                </div>
                <div class="nl-grid" id="nl-grid"></div>
              </div>
            </div>

            <!-- SITE INTELLIGENCE TAB -->
            <div id="view-site" class="nl-view">
              <div class="nl-card" id="nl-site-info"></div>
              <div class="nl-card" id="nl-blocked-patterns"></div>
              <div class="nl-card">
                <div class="nl-btn-row" style="flex-direction:column;gap:8px;">
                  <button class="nl-btn warn" id="btn-clear-patterns">🚫 Clear Blocked Patterns</button>
                  <button class="nl-btn danger" id="btn-clear-site">🗑 Clear All Site Data</button>
                </div>
              </div>
            </div>

            <!-- SETTINGS TAB -->
            <div id="view-settings" class="nl-view">
              <div class="nl-card" id="nl-settings-list"></div>
            </div>

            <!-- LOG TAB -->
            <div id="view-log" class="nl-view">
              <div class="nl-card">
                <div class="nl-log-feed" id="nl-log-feed"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(root);
      this.el = root;

      // Cache refs
      this.refs = {
        pill: root.querySelector('#nl-pill'),
        pillText: root.querySelector('#nl-pill-text'),
        dot: root.querySelector('#nl-dot'),
        sheet: root.querySelector('#nl-sheet'),
        handle: root.querySelector('#nl-handle'),
        status: root.querySelector('#nl-status'),
        statusSub: root.querySelector('#nl-status-sub'),
        progress: root.querySelector('#nl-progress'),
        idleControls: root.querySelector('#nl-idle-controls'),
        activeControls: root.querySelector('#nl-active-controls'),
        pauseBtn: root.querySelector('#btn-pause'),
        grid: root.querySelector('#nl-grid'),
        siteInfo: root.querySelector('#nl-site-info'),
        settingsList: root.querySelector('#nl-settings-list'),
        logFeed: root.querySelector('#nl-log-feed')
      };
    }

    bindEvents() {
      const { pill, sheet, handle } = this.refs;

      // Toggle sheet
      pill.onclick = () => this.open();
      handle.onclick = () => this.close();

      // Swipe to dismiss
      let startY = 0;
      sheet.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });
      sheet.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - startY;
        if (deltaY > 60) this.close();
      }, { passive: true });

      // Tab switching
      this.el.querySelectorAll('.nl-tab').forEach(tab => {
        tab.onclick = () => {
          this.el.querySelectorAll('.nl-tab').forEach(t => t.classList.remove('active'));
          this.el.querySelectorAll('.nl-view').forEach(v => v.classList.remove('active'));
          tab.classList.add('active');
          this.el.querySelector(`#view-${tab.dataset.tab}`).classList.add('active');
          this.activeTab = tab.dataset.tab;
          if (tab.dataset.tab === 'library') this.renderLibrary();
          if (tab.dataset.tab === 'site') this.renderSite();
          if (tab.dataset.tab === 'settings') this.renderSettings();
        };
      });

      // Action buttons
      this.el.querySelector('#btn-download').onclick = () => {
        this.close();
        this.lib.download();
      };

      this.el.querySelector('#btn-batch').onclick = () => {
        const count = prompt('How many chapters?', '10');
        if (count && parseInt(count) > 0) {
          this.close();
          this.lib.startBatch(parseInt(count));
        }
      };

      this.el.querySelector('#btn-export').onclick = () => {
        this.lib.export();
      };

      this.el.querySelector('#btn-clear-patterns').onclick = () => {
        if (confirm(`Clear blocked patterns for ${Patterns.getDomain()}?`)) {
          Patterns.clearNegativePatterns();
          this.renderSite();
          Toast.show('Blocked patterns cleared', 'info');
        }
      };

      this.el.querySelector('#btn-clear-site').onclick = () => {
        if (confirm(`Clear all learned data for ${Intelligence.currentSite}?`)) {
          Intelligence.clearCurrentProfile();
          Patterns.clearNegativePatterns();
          // Also clear pattern learner data for this domain
          const domain = Patterns.getDomain();
          if (Patterns.db[domain]) {
            delete Patterns.db[domain];
            Patterns._save();
          }
          this.renderSite();
          Toast.show('All site data cleared', 'info');
        }
      };

      this.refs.pauseBtn.onclick = () => {
        if (this.lib.batch.isPaused) {
          this.lib.resumeBatch();
        } else {
          this.lib.pauseBatch();
        }
      };

      this.el.querySelector('#btn-stop').onclick = () => {
        this.lib.stopBatch();
      };
    }

    subscribeToEvents() {
      Events.on('batch:start', () => this.syncState());
      Events.on('batch:progress', () => this.syncState());
      Events.on('batch:paused', () => this.syncState());
      Events.on('batch:resumed', () => this.syncState());
      Events.on('batch:complete', () => this.syncState());
      Events.on('batch:stopped', () => this.syncState());
      Events.on('batch:skip', () => this.syncState());
      
      Events.on('log:entry', ({ time, msg, type }) => {
        this.logs.unshift({ time, msg, type });
        if (this.logs.length > 30) this.logs.pop();
        this.renderLogs();
      });
    }

    open() {
      this.isOpen = true;
      this.refs.sheet.classList.add('open');
      this.refs.pill.classList.add('hidden');
      if (this.activeTab === 'library') this.renderLibrary();
      if (this.activeTab === 'site') this.renderSite();
      if (this.activeTab === 'settings') this.renderSettings();
    }

    close() {
      this.isOpen = false;
      this.refs.sheet.classList.remove('open');
      this.refs.pill.classList.remove('hidden');
    }

    syncState() {
      const batch = this.lib.batch;
      const { dot, pillText, status, statusSub, progress, idleControls, activeControls, pauseBtn } = this.refs;

      if (batch.isActive) {
        const pct = Math.floor(batch.progress * 100);
        const currentBook = this.lib.currentBook;
        
        // Pill - show book name during batch if available
        if (batch.isPaused) {
          pillText.textContent = 'Paused';
        } else if (currentBook && currentBook.title) {
          // Truncate book title for pill
          const shortTitle = currentBook.title.length > 12 
            ? currentBook.title.substring(0, 10) + '…' 
            : currentBook.title;
          pillText.textContent = `${pct}% · ${shortTitle}`;
        } else {
          pillText.textContent = `${pct}%`;
        }
        dot.className = 'nl-pill-dot ' + (batch.isPaused ? 'paused' : 'active');
        
        // Status card
        status.textContent = batch.isPaused ? 'Paused' : `${pct}%`;
        
        // Show book in status subtitle
        if (currentBook && currentBook.title) {
          statusSub.innerHTML = `<strong>${currentBook.title}</strong> · Ch ${batch.current}/${batch.total}`;
        } else {
          statusSub.textContent = `Ch ${batch.current} of ${batch.total}`;
        }
        progress.style.width = `${pct}%`;
        
        // Controls
        idleControls.style.display = 'none';
        activeControls.style.display = 'block';
        
        // Pause button
        if (batch.isPaused) {
          pauseBtn.textContent = '▶ Resume';
          pauseBtn.className = 'nl-btn success';
        } else {
          pauseBtn.textContent = '⏸ Pause';
          pauseBtn.className = 'nl-btn warn';
        }
      } else {
        // Idle state - show domain learning status
        const confidence = Intelligence.getConfidence();
        const confLabel = confidence >= 0.7 ? '🧠' : confidence >= 0.3 ? '📚' : '📖';
        
        pillText.textContent = `Ready ${confLabel}`;
        dot.className = 'nl-pill-dot';
        status.textContent = 'Idle';
        statusSub.textContent = '';
        progress.style.width = '0%';
        idleControls.style.display = 'block';
        activeControls.style.display = 'none';
      }
    }

    renderLibrary() {
      // Use the enhanced book library view
      this.renderBookLibrary();
    }

    renderSite() {
      const container = this.refs.siteInfo;
      const profile = Intelligence.getProfile();
      const confidence = Intelligence.getConfidence();
      
      // Get pattern learner stats
      const patternStats = Patterns.getDomainStats();
      const domain = Patterns.getDomain();
      const negativePatterns = Patterns.negativePatterns[domain] || [];
      
      // Confidence badge class (combine both systems)
      const patternConf = patternStats?.confidence || 0;
      const overallConf = Math.max(confidence, patternConf);
      const confClass = overallConf >= 0.7 ? 'high' : overallConf >= 0.3 ? 'mid' : 'low';
      const confLabel = overallConf >= 0.7 ? 'Expert' : overallConf >= 0.3 ? 'Learning' : 'New';
      
      // Format selectors list
      const selectors = Object.entries(profile.selectors || {})
        .sort((a, b) => b[1].hits - a[1].hits)
        .slice(0, 5);
      
      const selectorsHtml = selectors.length > 0 
        ? selectors.map(([sel, stats]) => `
            <div class="nl-selector-item">
              <span class="nl-selector-name">${sel}</span>
              <span class="nl-selector-meta">${stats.hits} hits · ${Math.round(stats.avgQuality * 100)}% quality</span>
            </div>
          `).join('')
        : '<div style="color:var(--nl-text-dim);font-size:12px;padding:10px 0">No patterns learned yet</div>';
      
      container.innerHTML = `
        <div class="nl-site-header">
          <span class="nl-site-domain">🌐 ${profile.domain || domain}</span>
          <span class="nl-confidence-badge ${confClass}">${confLabel}</span>
        </div>
        
        <div class="nl-site-stats">
          <div class="nl-stat-box">
            <div class="nl-stat-value">${profile.successfulExtracts || 0}</div>
            <div class="nl-stat-label">Extractions</div>
          </div>
          <div class="nl-stat-box">
            <div class="nl-stat-value">${Math.round(patternConf * 100)}%</div>
            <div class="nl-stat-label">Pattern Trust</div>
          </div>
          <div class="nl-stat-box">
            <div class="nl-stat-value">${Math.round(profile.avgWordCount || 0)}</div>
            <div class="nl-stat-label">Avg Words</div>
          </div>
          <div class="nl-stat-box">
            <div class="nl-stat-value">${negativePatterns.length}</div>
            <div class="nl-stat-label">Blocked</div>
          </div>
        </div>
        
        ${patternStats?.signature?.cssPath ? `
          <div style="margin-top:12px;padding:10px 12px;background:rgba(48,209,88,0.15);border-radius:8px;font-size:12px">
            <strong style="color:var(--nl-success)">✓ Learned Pattern:</strong><br>
            <code style="color:var(--nl-accent);font-size:11px;word-break:break-all">${patternStats.signature.cssPath}</code>
            ${patternStats.manuallySelected ? '<span style="color:var(--nl-warn);margin-left:8px">👆 Manual</span>' : ''}
          </div>
        ` : ''}
        
        <div class="nl-card-title" style="margin-top:12px">Legacy Selectors</div>
        <div class="nl-selector-list">
          ${selectorsHtml}
        </div>
      `;
      
      // Render blocked patterns
      const blockedContainer = this.el.querySelector('#nl-blocked-patterns');
      if (blockedContainer) {
        if (negativePatterns.length > 0) {
          blockedContainer.innerHTML = `
            <div class="nl-card-title">🚫 Blocked Elements (${negativePatterns.length})</div>
            <div style="font-size:11px;color:var(--nl-text-dim);max-height:120px;overflow-y:auto;">
              ${negativePatterns.map(p => `
                <div style="padding:6px 0;border-bottom:1px solid var(--nl-border);">
                  <code style="color:var(--nl-danger);word-break:break-all">${p.cssPath.substring(0, 50)}${p.cssPath.length > 50 ? '...' : ''}</code>
                  <div style="font-size:10px;color:var(--nl-text-dim)">${p.reason} · ${new Date(p.added).toLocaleDateString()}</div>
                </div>
              `).join('')}
            </div>
          `;
        } else {
          blockedContainer.innerHTML = `
            <div class="nl-card-title">🚫 Blocked Elements</div>
            <div style="font-size:12px;color:var(--nl-text-dim);padding:10px 0">No elements blocked</div>
          `;
        }
      }
    }

    renderSettings() {
      const container = this.refs.settingsList;
      container.innerHTML = '';
      
      // Validation mode selector (special - not a stepper)
      const validationRow = document.createElement('div');
      validationRow.className = 'nl-setting';
      validationRow.style.flexDirection = 'column';
      validationRow.style.alignItems = 'flex-start';
      validationRow.style.gap = '10px';
      
      const currentMode = Config.get('VALIDATION_MODE');
      const modes = [
        { value: 'always', label: '✓ Always', desc: 'Confirm every extraction' },
        { value: 'auto', label: '🤖 Auto', desc: 'Skip when trusted' },
        { value: 'never', label: '⚡ Never', desc: 'Download immediately' }
      ];
      
      validationRow.innerHTML = `
        <div class="nl-setting-info" style="width:100%">
          <div class="nl-setting-label">Validation Mode</div>
          <div class="nl-setting-desc">When to show confirmation dialog</div>
        </div>
        <div class="nl-mode-selector" style="display:flex;gap:6px;width:100%">
          ${modes.map(m => `
            <button class="nl-mode-btn ${currentMode === m.value ? 'active' : ''}" 
                    data-mode="${m.value}"
                    style="flex:1;padding:10px 8px;border:none;border-radius:8px;
                           background:${currentMode === m.value ? 'var(--nl-accent)' : 'rgba(255,255,255,0.1)'};
                           color:var(--nl-text);font-size:12px;font-weight:600;cursor:pointer">
              ${m.label}
            </button>
          `).join('')}
        </div>
      `;
      
      container.appendChild(validationRow);
      
      // Bind mode buttons
      validationRow.querySelectorAll('.nl-mode-btn').forEach(btn => {
        btn.onclick = () => {
          Config.set('VALIDATION_MODE', btn.dataset.mode);
          validationRow.querySelectorAll('.nl-mode-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'rgba(255,255,255,0.1)';
          });
          btn.classList.add('active');
          btn.style.background = 'var(--nl-accent)';
          Toast.show(`Validation: ${btn.textContent.trim()}`, 'info');
        };
      });
      
      // Numeric settings
      const settings = Config.getEditable();
      
      settings.forEach(s => {
        const row = document.createElement('div');
        row.className = 'nl-setting';
        
        const val = Config.get(s.key);
        const display = s.format ? s.format(val) : (s.unit ? `${val}${s.unit === 'ms' ? '' : ''}` : val);
        
        row.innerHTML = `
          <div class="nl-setting-info">
            <div class="nl-setting-label">${s.label}</div>
            <div class="nl-setting-desc">${s.desc}</div>
          </div>
          <div class="nl-stepper">
            <div class="nl-step-btn" data-key="${s.key}" data-dir="-1">−</div>
            <div class="nl-step-val" id="val-${s.key}">${display}</div>
            <div class="nl-step-btn" data-key="${s.key}" data-dir="1">+</div>
          </div>
        `;
        
        container.appendChild(row);
      });

      // Bind stepper events
      container.querySelectorAll('.nl-step-btn').forEach(btn => {
        btn.onclick = () => {
          const key = btn.dataset.key;
          const dir = parseInt(btn.dataset.dir);
          const schema = settings.find(s => s.key === key);
          
          let val = Config.get(key) + (dir * schema.step);
          val = Math.max(schema.min, Math.min(schema.max, val));
          
          Config.set(key, val);
          
          const display = container.querySelector(`#val-${key}`);
          if (display) display.textContent = schema.format ? schema.format(val) : val;
        };
      });
    }

    renderLogs() {
      const feed = this.refs.logFeed;
      feed.innerHTML = this.logs.map(l => {
        const colorClass = l.type === 'error' ? 'nl-log-error' : l.type === 'success' ? 'nl-log-success' : '';
        return `<div class="nl-log-entry"><span class="nl-log-time">${l.time}</span><span class="${colorClass}">${l.msg}</span></div>`;
      }).join('');
    }

    /**
     * Show validation modal for user to confirm/reject extraction
     * Returns Promise<string> - 'good', 'bad', 'manual', or 'auto'
     */
    validateExtraction(chapterNum, bookTitle, previewText, onConfirm, onReject, onManualSelect) {
      return new Promise((resolve) => {
        const timeout = Config.get('VALIDATION_TIMEOUT');
        let countdown = timeout;
        let interval = null;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nl-modal-overlay';
        overlay.innerHTML = `
          <div class="nl-modal">
            <div class="nl-modal-header">
              <div class="nl-modal-title">📖 Chapter ${chapterNum || '?'}</div>
              <div class="nl-modal-subtitle">${bookTitle}</div>
            </div>
            <div class="nl-modal-body">
              <div style="font-size:12px;color:var(--nl-text-dim);margin-bottom:8px;">Does this look correct?</div>
              <div class="nl-preview-text">${previewText}</div>
              <div class="nl-countdown">
                Auto-accepting in <span class="nl-countdown-num" id="nl-countdown-val">${countdown}</span>s
              </div>
            </div>
            <div class="nl-modal-footer" style="flex-direction:column;gap:10px;">
              <button class="nl-btn success" id="nl-validate-confirm" style="width:100%">✓ Looks Good</button>
              <button class="nl-btn primary" id="nl-validate-manual" style="width:100%">👆 Let Me Pick Content</button>
              <button class="nl-btn danger" id="nl-validate-reject" style="width:100%">✗ Wrong - Skip</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(overlay);
        
        const countdownEl = overlay.querySelector('#nl-countdown-val');
        const confirmBtn = overlay.querySelector('#nl-validate-confirm');
        const rejectBtn = overlay.querySelector('#nl-validate-reject');
        const manualBtn = overlay.querySelector('#nl-validate-manual');
        
        const cleanup = () => {
          if (interval) clearInterval(interval);
          overlay.remove();
        };
        
        // Start countdown
        interval = setInterval(() => {
          countdown--;
          if (countdownEl) countdownEl.textContent = countdown;
          
          if (countdown <= 0) {
            cleanup();
            if (onConfirm) onConfirm();
            resolve('auto');
          }
        }, 1000);
        
        // Button handlers
        confirmBtn.onclick = () => {
          cleanup();
          if (onConfirm) onConfirm();
          resolve('good');
        };
        
        manualBtn.onclick = () => {
          cleanup();
          if (onManualSelect) onManualSelect();
          resolve('manual');
        };
        
        rejectBtn.onclick = () => {
          cleanup();
          if (onReject) onReject();
          resolve('bad');
        };
        
        // Tap outside to dismiss (counts as reject)
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            cleanup();
            if (onReject) onReject();
            resolve('bad');
          }
        };
      });
    }

    /**
     * Show prompt for manual book title input
     * Returns Promise<string|null> - title if entered, null if cancelled
     */
    promptBookTitle(suggestedTitle = '') {
      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'nl-modal-overlay';
        overlay.innerHTML = `
          <div class="nl-modal">
            <div class="nl-modal-header">
              <div class="nl-modal-title">📚 Book Title</div>
              <div class="nl-modal-subtitle">Couldn't detect book title automatically</div>
            </div>
            <div class="nl-modal-body">
              <input type="text" class="nl-input-field" id="nl-book-input" 
                     placeholder="Enter book title..." 
                     value="${suggestedTitle.replace(/"/g, '&quot;')}">
              <div class="nl-input-hint">
                This helps organize chapters by book
              </div>
            </div>
            <div class="nl-modal-footer">
              <button class="nl-btn" id="nl-title-skip">Skip</button>
              <button class="nl-btn primary" id="nl-title-confirm">Confirm</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(overlay);
        
        const input = overlay.querySelector('#nl-book-input');
        const confirmBtn = overlay.querySelector('#nl-title-confirm');
        const skipBtn = overlay.querySelector('#nl-title-skip');
        
        // Focus input
        setTimeout(() => input.focus(), 100);
        
        const cleanup = () => overlay.remove();
        
        confirmBtn.onclick = () => {
          const value = input.value.trim();
          cleanup();
          resolve(value || null);
        };
        
        skipBtn.onclick = () => {
          cleanup();
          resolve(null);
        };
        
        // Enter key submits
        input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value.trim();
            cleanup();
            resolve(value || null);
          }
        };
        
        // Tap outside to dismiss
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            cleanup();
            resolve(null);
          }
        };
      });
    }

    /**
     * Render full book library view (replaces simple grid)
     */
    renderBookLibrary() {
      const grid = this.refs.grid;
      grid.innerHTML = '';
      
      const books = Books.getAllBooks();
      const bookIds = Object.keys(books);
      
      if (bookIds.length === 0) {
        grid.innerHTML = `
          <div style="text-align:center;padding:30px">
            <div style="font-size:40px;margin-bottom:10px">📚</div>
            <div style="color:var(--nl-text-dim);font-size:14px">No books downloaded yet</div>
            <div style="color:var(--nl-text-dim);font-size:12px;margin-top:6px">Chapters will appear here</div>
          </div>
        `;
        return;
      }
      
      const container = document.createElement('div');
      container.className = 'nl-book-list';
      
      bookIds.forEach(bookId => {
        const book = books[bookId];
        const progress = Books.getProgress(bookId);
        const chapterCount = Object.keys(book.chapters || {}).length;
        const maxCh = progress.max || chapterCount;
        const pct = maxCh > 0 ? Math.round((chapterCount / maxCh) * 100) : 0;
        
        const card = document.createElement('div');
        card.className = 'nl-book-card';
        card.innerHTML = `
          <div class="nl-book-header">
            <div class="nl-book-title">${book.title}</div>
            <div class="nl-book-badge ${book.isUnknown ? 'unknown' : 'verified'}">
              ${book.isUnknown ? '?' : '✓'}
            </div>
          </div>
          <div class="nl-book-meta">
            ${book.author !== 'Unknown' ? book.author + ' · ' : ''}${chapterCount} chapter${chapterCount !== 1 ? 's' : ''}
            ${progress.gaps.length > 0 ? ` · ${progress.gaps.length} gaps` : ''}
          </div>
          <div class="nl-book-progress">
            <div class="nl-book-progress-fill" style="width: ${pct}%"></div>
          </div>
          <div class="nl-book-stats">
            <span>Ch ${progress.min || 1}–${progress.max || '?'}</span>
            <span>${progress.total || 0} words</span>
          </div>
        `;
        
        // Tap to expand chapter grid
        card.onclick = () => {
          this.showBookChapters(bookId);
        };
        
        container.appendChild(card);
      });
      
      grid.appendChild(container);
    }

    /**
     * Show chapter grid for a specific book
     */
    showBookChapters(bookId) {
      const grid = this.refs.grid;
      const book = Books.getAllBooks()[bookId];
      
      if (!book) return;
      
      const progress = Books.getProgress(bookId);
      const maxCh = Math.max(progress.max || 1, ...Object.keys(book.chapters || {}).map(Number), 1);
      
      grid.innerHTML = `
        <div class="nl-card" style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:600">${book.title}</span>
            <button class="nl-btn" id="nl-back-to-books" style="flex:0;padding:8px 14px;height:auto;font-size:12px">← Back</button>
          </div>
        </div>
        <div class="nl-grid" id="nl-chapter-grid"></div>
      `;
      
      const chapterGrid = grid.querySelector('#nl-chapter-grid');
      
      for (let i = 1; i <= maxCh + 3; i++) {
        const cell = document.createElement('div');
        cell.className = 'nl-cell';
        cell.textContent = i;
        
        if (book.chapters && book.chapters[i]) {
          cell.classList.add('good');
        } else if (progress.gaps.includes(i)) {
          cell.classList.add('gap');
        }
        
        chapterGrid.appendChild(cell);
      }
      
      // Back button
      grid.querySelector('#nl-back-to-books').onclick = () => {
        this.renderBookLibrary();
      };
    }
  }

  /* ============================================================
     SECTION 8: INIT
     ============================================================ */

  async function init() {
    VisualLog.init();
    VisualLog.add(`🚀 NL v${Config.get('VERSION')} starting...`);

    // Initialize batch controller
    const batchController = new BatchController();
    
    // Initialize librarian
    const lib = new Librarian(batchController);

    // Wait for body, then inject GUI
    const poll = () => {
      if (document.body) {
        const gui = new MobileGUI(lib);
        gui.init();
        
        // Wire GUI to librarian for validation modals
        lib.setGUI(gui);

        // Resume active batch
        if (batchController.isActive && !batchController.isPaused) {
          VisualLog.add(`⏳ Resuming ${batchController.current}/${batchController.total}`);
          setTimeout(() => lib.runBatch(), Config.get('RESUME_DELAY_MS'));
        } else if (batchController.isPaused) {
          VisualLog.add(`⏸️ Paused at ${batchController.current}/${batchController.total}`);
        }
      } else {
        setTimeout(poll, 100);
      }
    };
    poll();
  }

  // Global styles
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `@keyframes nlFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
  if (document.head) document.head.appendChild(globalStyle);
  else document.addEventListener('DOMContentLoaded', () => document.head.appendChild(globalStyle));

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
