// ==UserScript==
// @name         ATK Scouter v2.1.12
// @namespace    Violentmonkey Scripts
// @match        https://www.torn.com/*
// @match        https://pda.torn.com/*
// @version      2.1.12
// @description  FIXED: API counter flickering on mobile - prevented multiple setInterval timers from running simultaneously
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/563368/ATK%20Scouter%20v2112.user.js
// @updateURL https://update.greasyfork.org/scripts/563368/ATK%20Scouter%20v2112.meta.js
// ==/UserScript==

/*
 * ATK SCOUTER v2.1.9 - RELEASE NOTES
 * 
 * MAJOR FEATURES:
 * ===============
 * 
 * RSI Analysis & Caching System:
 * - 7-day persistent RSI cache using IndexedDB
 * - Instant triangle indicators on faction pages
 * - Intelligent cache refresh based on fight history
 * - Massive API call reduction (saves 60-80% on reloads)
 * 
 * Status Tracking System:
 * - Real-time hospital/traveling status indicators
 * - 3-minute status cache with automatic refresh
 * - Background timer for automatic status updates
 * - Never miss when opponents become available
 * 
 * Smart Refresh Logic:
 * - LastCheck cache prevents redundant API calls
 * - Zero API calls on page reload (within 3-minute window)
 * - Background refresh every 3 minutes (automatic)
 * - Aligned TTLs prevent icons from disappearing
 * 
 * Fight Intelligence:
 * - Win/loss tracking with machine learning
 * - Historical fight data analysis
 * - Probability-based recommendations
 * - Auto-learning from every fight
 * 
 * RECENT UPDATES (v2.0.0 → v2.1.9):
 * ==================================
 * 
 * v2.1.9 - API Counter Overlay (Current) - Option 3:
 * - REDESIGNED: API counter now overlays TOP PORTION of settings cog (not above it)
 * - Translucent glass-morphism design with gradient background
 * - Counter appears INSIDE the cog's top ~40% area
 * - Cog icon remains visible through semi-transparent overlay
 * - Backdrop blur effect (glass effect) for modern aesthetic
 * - Space saved: Maximum efficiency - 0px additional vertical space
 * - Clickability: Settings cog remains 100% clickable (pointer-events: none)
 * - Design: Counter sits at z-index 9998, cog at 10000 (icon shows through)
 * - Gradient fades from opaque (92%) at top to more transparent (65%) at bottom
 * - Rounded top matches cog's circular edge for seamless integration
 * - NOTE: v2.1.8 (arc style) didn't look right - this version overlays instead
 * 
 * v2.1.7 - Duplicate Logging Fix - CRITICAL:
 * - FIXED: Wins and losses being logged twice to database
 * - Root cause: Script was processing BOTH attack page (sid=attack) AND attackLog page (sid=attackLog)
 * - When fights finished quickly, result was visible on both pages
 * - Both pages would detect the outcome and log it → duplicate entries
 * - Solution: Only process attackLog page (the official result page after fight completes)
 * - Removed sid=attack from isAttackResultPage() check
 * - Now: One page = one log entry (as intended)
 * - Affects: Both wins AND losses (both were duplicating)
 * - Testing: Confirmed on both PC and mobile (Torn PDA)
 * 
 * v2.1.6 - IndexedDB Schema Fix - CRITICAL MOBILE FIX:
 * - FIXED: Fight Intelligence panel not appearing on mobile devices (Torn PDA)
 * - Root cause: IndexedDB schema corruption causing "index not found" errors
 * - Incremented DB_VERSION to 3 to force schema recreation on all devices
 * - Added proper error handling - panel now appears even if database has errors
 * - Database queries now fail gracefully instead of crashing the panel
 * - Improved database migration - deletes and recreates stores to fix corruption
 * - Added detailed logging for database upgrade process
 * - Panel will show "No data yet" message if database is broken (instead of not appearing)
 * - This fix resolves the mobile-specific issue where panel worked on PC but not mobile
 * 
 * v2.1.3 - Mobile UI Fix:
 * - Moved API counter from top-right to bottom-left (below settings cog wheel)
 * - Improves mobile usability by preventing interference with Torn UI elements
 * - Counter now vertically stacked with settings button for better mobile layout
 * 
 * v2.1.2 - Mobile Reload Fix:
 * - Fixed "Save & Reload" button not working on mobile browsers (Torn PDA)
 * - CRITICAL FIX: Close modal before reload (modal overlay was blocking navigation)
 * - Added 100ms delay to allow modal close to complete (event loop requirement)
 * - Primary method now uses window.open(_self) which bypasses mobile restrictions
 * - Shows loading indicator during reload process (visual feedback)
 * - Fallback message if auto-reload fails (tells user to refresh manually)
 * - Multiple aggressive reload methods: open(_self) → reload(true) → replace() → href
 * - Settings panel now properly saves and reloads on all devices
 * - Bust Sniper and Bounty Sniper can now be properly disabled on mobile
 * 
 * v2.1.1 - TTL Alignment Fix:
 * - Fixed status icons disappearing between refreshes
 * - Extended Status Cache TTL from 60s to 180s
 * - Aligned Status Cache TTL with LastCheck interval (both 3 minutes)
 * - Status icons now display continuously without gaps
 * 
 * v2.1.0 - LastCheck + Background Timer:
 * - Added LastCheckCacheManager to track refresh timestamps
 * - Implemented automatic background status refresh timer
 * - Timer fires every 3 minutes on faction/bounty pages
 * - Prevents duplicate refreshes on page reload
 * - Reduces reload API calls from 100 to 0 (within refresh window)
 * 
 * v2.0.0 - Smart Refresh:
 * - Implemented separate cache checking for RSI and status
 * - RSI cache: 7-day TTL (battle stats change slowly)
 * - Status cache: 60s TTL → 180s TTL (v2.1.1)
 * - Lightweight status-only refresh when RSI is cached
 * - Eliminated duplicate status queue system
 * 
 * v1.9.x - Status Cache System:
 * - Added StatusCacheManager with IndexedDB storage
 * - Selective caching (only hospital/traveling users)
 * - Status icons with hospital countdown timers
 * - Traveling indicator with destination display
 * 
 * v1.8.0 - RSI Cache Introduction:
 * - Implemented RSICacheManager with IndexedDB
 * - 7-day persistent cache for battle stats
 * - Priority-based refresh system
 * - Cache statistics tracking
 * 
 * v1.7.2 - Schema Fixes:
 * - Fixed IndexedDB schema bugs ('odefinerId' → 'opponentId')
 * - Fixed self-fight logging with user ID checks
 * - Improved loss tracking with retry logic
 * - Incremented DB_VERSION to 2 for schema migration
 * 
 * PERFORMANCE METRICS:
 * ====================
 * 
 * API Call Reduction:
 * - First load: 100 calls (unchanged)
 * - Reload @ 30s: 0 calls (was 100) - 100% reduction
 * - Reload @ 2min: 0 calls (was 100) - 100% reduction
 * - Reload @ 5min: 100 lightweight calls (was 100 full calls) - 67% data reduction
 * - Daily usage: ~50% fewer API calls vs no caching
 * 
 * Cache Hit Rates (typical):
 * - RSI cache: 95%+ hit rate on faction page reloads
 * - Status cache: 100% hit rate within 3-minute window
 * - Combined: Saves ~2,000+ API calls per day (active user)
 * 
 * TECHNICAL DETAILS:
 * ==================
 * 
 * Cache Architecture:
 * - RSI Cache: IndexedDB (persistent, 7-day TTL)
 * - Status Cache: IndexedDB (persistent, 3-minute TTL)
 * - LastCheck Cache: localStorage (persistent, 3-minute interval)
 * - Background Timer: setInterval (3-minute cycle)
 * 
 * API Call Types:
 * - Full RSI: /user/{id}?selections=personalstats,basic,profile
 * - Status Only: /user/{id}?selections=profile (lightweight)
 * - Rate Limiting: 3 concurrent max, 100ms delay between calls
 * 
 * Cache Tiers (RSI):
 * - FRESH: <2 days (high confidence)
 * - MODERATE: 2-5 days (medium confidence, queued for refresh)
 * - STALE: 5-7 days (low confidence, queued for refresh)
 * - EXPIRED: >7 days (deleted, requires fresh fetch)
 * 
 * KNOWN LIMITATIONS:
 * ==================
 * - Background timer only works on faction/bounty pages
 * - Status cache requires active status (hospital/traveling)
 * - RSI cache disabled if user disables in settings
 * - localStorage/IndexedDB required (not available in private mode)
 * 
 * FUTURE ROADMAP:
 * ===============
 * - Configurable refresh intervals
 * - Cache priority based on user preferences
 * - Advanced ML model for fight predictions
 * - Historical trend analysis
 * - Export/import cache functionality
 * 
 */

(() => {
  'use strict';

  // Global reload guard to prevent multiple simultaneous reload attempts
  let _reloadInProgress = false;

  // Global API budget interval tracker to prevent multiple timers
  let _apiBudgetIntervalId = null;

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const VERSION = '2.1.12-FINAL';

  const GREEN_ARROW_UP  = "data:image/svg+xml;utf8,<svg width='20' height='20' xmlns='http://www.w3.org/2000/svg'><polygon points='10,3 19,17 1,17' fill='%232e7d32'/></svg>";
  const YELLOW_ARROW_UP = "data:image/svg+xml;utf8,<svg width='20' height='20' xmlns='http://www.w3.org/2000/svg'><polygon points='10,3 19,17 1,17' fill='%23f9a825'/></svg>";
  const RED_ARROW_UP    = "data:image/svg+xml;utf8,<svg width='20' height='20' xmlns='http://www.w3.org/2000/svg'><polygon points='10,3 19,17 1,17' fill='%23c62828'/></svg>";

  const PLANE_ICON_URL = 'https://raw.githubusercontent.com/infodump01/LE-Scouter/main/airport-xxl.png';
  const HOSPITAL_ICON_URL = 'https://github.com/infodump01/LE-Scouter/raw/main/hospital.png';
  const CIRCLE_ICON_URL = 'https://github.com/infodump01/LE-Scouter/raw/main/circle.png';
  const PILL_ICON_URL = 'https://raw.githubusercontent.com/infodump01/LE-Scouter/main/pill-icon-2048x2048.png';

  const API_MAX_ACTIVE = 3;
  const API_MIN_DELAY = 200;
  const API_CACHE_MAX_SIZE = 500;
  const API_CACHE_TTL_BASIC = 10000;
  const API_CACHE_TTL_DEFAULT = 30000;

  // RSI Cache Constants (NEW v1.8.0)
  const RSI_CACHE_DB_NAME = 'ATKScouterRSICache';
  const RSI_CACHE_DB_VERSION = 1;
  const RSI_CACHE_STORE_NAME = 'rsiData';

  // Cache expiry tiers
  const CACHE_TIERS = {
    FRESH: 2 * 24 * 60 * 60 * 1000,
    MODERATE: 5 * 24 * 60 * 60 * 1000,
    STALE: 7 * 24 * 60 * 60 * 1000
  };

  // Refresh priority levels
  const REFRESH_PRIORITY = {
    FIGHTING_NOW: 1,
    FACTION_MEMBER: 2,
    RECENT_TARGET: 3,
    FREQUENT_TARGET: 4,
    RANDOM_BOUNTY: 5
  };


  // Fight logging constants
  const DB_NAME = 'ATKScouterFightLog';
  const DB_VERSION = 3;  // v2.1.6: Incremented to fix missing index bug causing mobile crashes
  const PENDING_ATTACK_KEY = 'ff_pending_attack';
  const MAX_FIGHTS_STORED = 2000;

  // Gym tier multipliers based on xanax consumption → energy → multiplier
  const GYM_TIERS = [
    { energy: 0,         mul: 1.0000 },
    { energy: 200,       mul: 1.2375 },
    { energy: 500,       mul: 1.4500 },
    { energy: 1000,      mul: 1.6000 },
    { energy: 2000,      mul: 1.7000 },
    { energy: 2750,      mul: 1.8000 },
    { energy: 3000,      mul: 1.8500 },
    { energy: 3500,      mul: 1.8500 },
    { energy: 4000,      mul: 2.0000 },
    { energy: 6000,      mul: 2.1750 },
    { energy: 7000,      mul: 2.2750 },
    { energy: 8000,      mul: 2.4250 },
    { energy: 11000,     mul: 2.5250 },
    { energy: 12420,     mul: 2.5500 },
    { energy: 18000,     mul: 2.7375 },
    { energy: 18100,     mul: 2.7850 },
    { energy: 24140,     mul: 3.0000 },
    { energy: 31260,     mul: 3.1000 },
    { energy: 36610,     mul: 3.1625 },
    { energy: 46640,     mul: 3.2625 },
    { energy: 56520,     mul: 3.3250 },
    { energy: 67775,     mul: 3.2875 },
    { energy: 84535,     mul: 3.3500 },
    { energy: 106305,    mul: 3.4500 },
    { energy: 100000000, mul: 3.6500 }
  ];

  // Location abbreviation map
  const LOC_TO_CODE = {
    "China": "CN", "Japan": "JP", "Mexico": "MX", "Canada": "CA",
    "United Kingdom": "GB", "UK": "GB", "Argentina": "AR",
    "UAE": "AE", "United Arab Emirates": "AE", "Dubai": "AE",
    "Switzerland": "CH", "South Africa": "ZA", "Hawaii": "HW", "Hawai'i": "HW"
  };

  // ============================================================================
  // ENVIRONMENT ADAPTER
  // ============================================================================

  const Env = (() => {
    if (typeof PDA_httpGet === 'function') {
      return {
        httpRequest: d => d.method.toLowerCase() === 'get'
          ? PDA_httpGet(d.url).then(d.onload).catch(d.onerror)
          : PDA_httpPost(d.url, d.headers, d.data).then(d.onload).catch(d.onerror),
        setValue: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
        getValue: (k, d) => {
          try { return JSON.parse(localStorage.getItem(k)) ?? d; }
          catch { return d; }
        },
        deleteValue: k => localStorage.removeItem(k),
        isPDA: true
      };
    }
    return {
      httpRequest: GM_xmlhttpRequest,
      setValue: GM_setValue,
      getValue: GM_getValue,
      deleteValue: GM_deleteValue,
      isPDA: false
    };
  })();

  // ============================================================================
  // SETTINGS
  // ============================================================================

  const DEFAULTS = {
    lowHigh: 100,
    highMed: 120,
    lifeWeight: 0.1,
    drugWeight: 0.1,
    // RSI Cache settings
    rsiCacheEnabled: true,
    rsiCacheShowConfidence: true,
    rsiCacheBackgroundRefresh: true,
    // Bounty Sniper defaults
    sniperEnabled: false,
    sniperMinReward: 100000,
    sniperMaxLevel: 100,
    sniperRsiMin: 80,
    sniperRsiMax: 200,
    sniperShowOkay: true,
    sniperShowHospital: true,
    sniperHospitalMins: 1,
    sniperShowTraveling: false,
    sniperApiBudget: 10,
    sniperPagesToScan: 10,
    sniperSoundAlert: false,
    sniperSortBy: 'value', // 'value', 'reward', 'rsi', 'beaten'
    sniperFetchInterval: 45,
    // Jail Bust Sniper defaults
    bustSniperEnabled: false,
    bustSniperMinLevel: 1,
    bustSniperMaxLevel: 100,
    bustSniperMinSentence: 0,
    bustSniperMaxSentence: 6000,
    bustSniperPagesToScan: 2,
    bustSniperSoundAlert: false,
    bustSniperSortBy: 'priority',
    bustSniperFetchInterval: 30,
    bustSniperShowNormalJail: true,
    bustSniperShowFederalJail: true,
    bustSniperMaxTargets: 10
  };

  let API_KEY = Env.getValue('api_key', '');
  const settings = {
    lowHigh:    +Env.getValue('threshold_lowHigh', DEFAULTS.lowHigh),
    highMed:    +Env.getValue('threshold_highMed', DEFAULTS.highMed),
    lifeWeight: +Env.getValue('lifeWeight', DEFAULTS.lifeWeight),
    drugWeight: +Env.getValue('drugWeight', DEFAULTS.drugWeight),
    // RSI Cache settings
    rsiCacheEnabled: Env.getValue('rsiCacheEnabled', DEFAULTS.rsiCacheEnabled) !== false,
    rsiCacheShowConfidence: Env.getValue('rsiCacheShowConfidence', DEFAULTS.rsiCacheShowConfidence) !== false,
    rsiCacheBackgroundRefresh: Env.getValue('rsiCacheBackgroundRefresh', DEFAULTS.rsiCacheBackgroundRefresh) !== false,
    // Bounty Sniper settings
    sniperEnabled:      Env.getValue('sniperEnabled', DEFAULTS.sniperEnabled) === true || Env.getValue('sniperEnabled', DEFAULTS.sniperEnabled) === 'true',
    sniperMinReward:    +Env.getValue('sniperMinReward', DEFAULTS.sniperMinReward),
    sniperMaxLevel:     +Env.getValue('sniperMaxLevel', DEFAULTS.sniperMaxLevel),
    sniperRsiMin:       +Env.getValue('sniperRsiMin', DEFAULTS.sniperRsiMin),
    sniperRsiMax:       +Env.getValue('sniperRsiMax', DEFAULTS.sniperRsiMax),
    sniperShowOkay:     Env.getValue('sniperShowOkay', DEFAULTS.sniperShowOkay) === true || Env.getValue('sniperShowOkay', DEFAULTS.sniperShowOkay) === 'true',
    sniperShowHospital: Env.getValue('sniperShowHospital', DEFAULTS.sniperShowHospital) === true || Env.getValue('sniperShowHospital', DEFAULTS.sniperShowHospital) === 'true',
    sniperHospitalMins: +Env.getValue('sniperHospitalMins', DEFAULTS.sniperHospitalMins),
    sniperShowTraveling: Env.getValue('sniperShowTraveling', DEFAULTS.sniperShowTraveling) === true || Env.getValue('sniperShowTraveling', DEFAULTS.sniperShowTraveling) === 'true',
    sniperApiBudget:    +Env.getValue('sniperApiBudget', DEFAULTS.sniperApiBudget),
    sniperPagesToScan:  +Env.getValue('sniperPagesToScan', DEFAULTS.sniperPagesToScan),
    sniperSoundAlert:   Env.getValue('sniperSoundAlert', DEFAULTS.sniperSoundAlert) === true || Env.getValue('sniperSoundAlert', DEFAULTS.sniperSoundAlert) === 'true',
    sniperSortBy:       Env.getValue('sniperSortBy', DEFAULTS.sniperSortBy),
    sniperFetchInterval: +Env.getValue('sniperFetchInterval', DEFAULTS.sniperFetchInterval),
    // Jail Bust Sniper settings
    bustSniperEnabled:      Env.getValue('bustSniperEnabled', DEFAULTS.bustSniperEnabled) === true || Env.getValue('bustSniperEnabled', DEFAULTS.bustSniperEnabled) === 'true',
    bustSniperMinLevel:     +Env.getValue('bustSniperMinLevel', DEFAULTS.bustSniperMinLevel),
    bustSniperMaxLevel:     +Env.getValue('bustSniperMaxLevel', DEFAULTS.bustSniperMaxLevel),
    bustSniperMinSentence:  +Env.getValue('bustSniperMinSentence', DEFAULTS.bustSniperMinSentence),
    bustSniperMaxSentence:  +Env.getValue('bustSniperMaxSentence', DEFAULTS.bustSniperMaxSentence),
    bustSniperPagesToScan:  +Env.getValue('bustSniperPagesToScan', DEFAULTS.bustSniperPagesToScan),
    bustSniperSoundAlert:   Env.getValue('bustSniperSoundAlert', DEFAULTS.bustSniperSoundAlert) === true || Env.getValue('bustSniperSoundAlert', DEFAULTS.bustSniperSoundAlert) === 'true',
    bustSniperSortBy:       Env.getValue('bustSniperSortBy', DEFAULTS.bustSniperSortBy),
    bustSniperFetchInterval: +Env.getValue('bustSniperFetchInterval', DEFAULTS.bustSniperFetchInterval),
    bustSniperShowNormalJail: Env.getValue('bustSniperShowNormalJail', DEFAULTS.bustSniperShowNormalJail) === true || Env.getValue('bustSniperShowNormalJail', DEFAULTS.bustSniperShowNormalJail) === 'true',
    bustSniperShowFederalJail: Env.getValue('bustSniperShowFederalJail', DEFAULTS.bustSniperShowFederalJail) === true || Env.getValue('bustSniperShowFederalJail', DEFAULTS.bustSniperShowFederalJail) === 'true',
    bustSniperMaxTargets:     Math.min(10, Math.max(1, +Env.getValue('bustSniperMaxTargets', DEFAULTS.bustSniperMaxTargets)))
  };

  // ============================================================================
  // STYLES (consolidated)
  // ============================================================================

  GM_addStyle(`
    /* Score badges */
    .ff-score-badge {
      display: inline-block;
      margin-left: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.95em;
      color: #fff;
    }
    .ff-score-badge.high { background: #c62828; }
    .ff-score-badge.med { background: #f9a825; }
    .ff-score-badge.low { background: #2e7d32; }
    .ff-score-badge.wounded {
      box-shadow: 0 0 6px 2px rgba(229, 57, 53, 0.8);
    }
    /* Cache confidence indicators */
    .ff-cache-indicator {
      display: inline-block;
      margin-left: 4px;
      font-size: 0.85em;
      vertical-align: middle;
      opacity: 0.7;
    }
    .ff-cache-indicator.high { color: #4caf50; }
    .ff-cache-indicator.medium { color: #ff9800; }
    .ff-cache-indicator.low { color: #f44336; }

    /* API Budget indicator - Translucent overlay on top of settings cog */
    .ff-api-budget {
      position: fixed;
      bottom: 48px;  /* Overlays top ~40% of cog (20px + 50px - 22px) */
      left: 20px;    /* Aligned with cog */
      width: 50px;   /* Matches cog width */
      background: linear-gradient(180deg, 
        rgba(76, 175, 80, 0.75) 0%,   /* More transparent: 75% instead of 92% */
        rgba(76, 175, 80, 0.45) 100%); /* More transparent: 45% instead of 65% */
      color: #fff;
      padding: 3px 0;
      border-radius: 25px 25px 0 0;  /* Rounded top matching cog curve */
      font-size: 9px;
      font-weight: bold;
      z-index: 10001;  /* ABOVE cog (10000) so text is visible */
      font-family: monospace;
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15);
      pointer-events: none;  /* CRITICAL: Allows clicks to pass through to cog */
      text-align: center;
      backdrop-filter: blur(3px);  /* Glass-morphism effect */
      -webkit-backdrop-filter: blur(3px);  /* Safari support */
      height: 22px;
      line-height: 1.2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ff-api-budget.warning { 
      background: linear-gradient(180deg, 
        rgba(255, 152, 0, 0.75) 0%,   /* More transparent */
        rgba(255, 152, 0, 0.45) 100%);
    }
    .ff-api-budget.danger { 
      background: linear-gradient(180deg, 
        rgba(244, 67, 54, 0.75) 0%,   /* More transparent */
        rgba(244, 67, 54, 0.45) 100%);
    }

    /* Cache stats panel */
    .ff-cache-stats {
      margin: 15px 0;
      padding: 12px;
      background: rgba(76, 175, 80, 0.1);
      border: 1px solid rgba(76, 175, 80, 0.3);
      border-radius: 6px;
    }
    .ff-cache-stats-title {
      font-weight: 600;
      color: #4caf50;
      margin-bottom: 8px;
      font-size: 0.95em;
    }
    .ff-cache-stat-row {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      font-size: 0.85em;
    }
    .ff-cache-stat-label { color: #999; }
    .ff-cache-stat-value { color: #fff; font-weight: 500; }


    /* Honor wrap positioning */
    div[class*="honorWrap"] {
      overflow: visible !important;
      position: relative !important;
    }
    .honor-text-wrap {
      position: relative !important;
    }

    /* Bounty page uses same positioning as faction pages */
    li[data-ff-bounty="1"] > div {
      position: relative !important;
      overflow: visible !important;
    }

    /* List arrow indicators */
    .ff-list-arrow-img {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 16px !important;
      height: 16px !important;
      max-width: 16px !important;
      max-height: 16px !important;
      pointer-events: auto;
      z-index: 10000;
      transform: translate(-50%, 38%);
      display: block;
      transition: box-shadow 0.15s;
    }
    .ff-list-arrow-img.wounded {
      box-shadow: 0 0 10px 4px #c62828, 0 0 2px 2px rgba(255, 255, 255, 0.13);
      border-radius: 5px;
    }

    /* Tooltip */
    .ff-tooltip-viewport {
      position: absolute;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      line-height: 1.2em;
      white-space: nowrap;
      z-index: 2147483647 !important;
      pointer-events: none;
    }
    .ff-tooltip-viewport a {
      color: #ff5252 !important;
      text-decoration: underline;
    }
    .ff-tooltip-viewport a:visited {
      color: #e53935 !important;
    }

    /* FAB and Modal */
    .ff-fab {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background: rgba(34, 34, 34, 0.9);  /* Slightly transparent to allow overlay text visibility */
      color: #eee;
      font-size: 26px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: background 0.2s;
    }
    .ff-fab:hover { background: rgba(51, 51, 51, 0.9); }

    /* Bounty Sniper Panel - Mobile Optimized & Draggable */
    .ff-sniper-panel {
      position: fixed;
      bottom: 20px;
      left: 80px;
      width: 240px;
      background: linear-gradient(135deg, rgba(25,25,35,0.98) 0%, rgba(15,15,25,0.98) 100%);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      font-size: 12px;
      color: #e0e0e0;
      overflow: hidden;
      touch-action: none;
    }
    .ff-sniper-panel.dragging {
      box-shadow: 0 8px 32px rgba(79,195,247,0.3);
      opacity: 0.95;
    }
    .ff-sniper-panel.collapsed .ff-sniper-list,
    .ff-sniper-panel.collapsed .ff-sniper-status {
      display: none;
    }
    .ff-sniper-panel.follower {
      border-color: rgba(255,193,7,0.4);
    }
    .ff-sniper-panel.follower .ff-sniper-leader-btn {
      display: inline-flex;
    }
    .ff-sniper-leader-btn {
      display: none;
      font-size: 12px;
      cursor: pointer;
      padding: 2px 4px;
      margin-left: 4px;
      border-radius: 4px;
      background: rgba(255,193,7,0.2);
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .ff-sniper-leader-btn:hover {
      background: rgba(255,193,7,0.4);
    }
    .ff-sniper-leader-btn:active {
      background: rgba(255,193,7,0.6);
    }
    .ff-sniper-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background: rgba(0,0,0,0.3);
      cursor: grab;
      user-select: none;
    }
    .ff-sniper-header:active {
      cursor: grabbing;
    }
    .ff-sniper-header:hover {
      background: rgba(255,255,255,0.05);
    }
    .ff-sniper-title {
      font-weight: 600;
      color: #4fc3f7;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
    }
    .ff-sniper-badge {
      background: #4caf50;
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 700;
      min-width: 16px;
      text-align: center;
    }
    .ff-sniper-badge.empty {
      background: #666;
    }
    .ff-sniper-toggle {
      font-size: 12px;
      color: #888;
      padding: 6px 8px;
      margin: -6px -8px;
      cursor: pointer;
      min-width: 32px;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ff-sniper-toggle:hover {
      color: #fff;
    }
    .ff-sniper-list {
      max-height: 160px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .ff-sniper-item {
      display: flex;
      align-items: center;
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      gap: 6px;
    }
    .ff-sniper-item:last-child {
      border-bottom: none;
    }
    .ff-sniper-item:hover {
      background: rgba(255,255,255,0.05);
    }
    .ff-sniper-rsi {
      font-size: 10px;
      padding: 2px 4px;
      border-radius: 3px;
      font-weight: 600;
      min-width: 32px;
      text-align: center;
      flex-shrink: 0;
    }
    .ff-sniper-rsi.low { background: rgba(76,175,80,0.3); color: #81c784; }
    .ff-sniper-rsi.med { background: rgba(255,193,7,0.3); color: #ffd54f; }
    .ff-sniper-rsi.high { background: rgba(198,40,40,0.3); color: #ef5350; }
    .ff-sniper-name {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
    }
    .ff-sniper-name a {
      color: #e0e0e0;
      text-decoration: none;
    }
    .ff-sniper-name a:hover {
      color: #4fc3f7;
    }
    .ff-sniper-reward {
      font-size: 10px;
      color: #81c784;
      font-weight: 600;
      flex-shrink: 0;
    }
    .ff-sniper-beaten {
      font-size: 9px;
      color: #ffd700;
      flex-shrink: 0;
    }
    .ff-sniper-atk {
      background: #c62828;
      color: #fff;
      font-size: 9px;
      padding: 3px 6px;
      border-radius: 3px;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
    }
    .ff-sniper-atk:hover {
      background: #e53935;
    }
    .ff-sniper-status {
      padding: 5px 10px;
      font-size: 9px;
      color: #888;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ff-sniper-status .leader {
      color: #81c784;
    }
    .ff-sniper-status .follower {
      color: #ffd54f;
    }

    /* Mobile-specific adjustments */
    @media (max-width: 768px) {
      .ff-sniper-panel {
        width: 220px;
        bottom: 70px;
        left: 10px;
      }
      .ff-sniper-item {
        padding: 8px 10px;
      }
      .ff-sniper-atk {
        padding: 5px 8px;
        font-size: 10px;
      }
      .ff-sniper-toggle {
        min-width: 40px;
        min-height: 40px;
      }
    }

    /* ==================================================================
       JAIL BUST SNIPER PANEL STYLES
       ================================================================== */
    .ff-bust-panel {
      position: fixed;
      top: 300px;
      left: 20px;
      width: 320px;
      background: linear-gradient(135deg, rgba(40, 20, 50, 0.96) 0%, rgba(20, 10, 30, 0.96) 100%);
      border: 2px solid rgba(156, 39, 176, 0.6);
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(156, 39, 176, 0.3);
      z-index: 2147483646;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 13px;
      color: #e6e6e6;
      backdrop-filter: blur(4px);
      transition: transform 0.2s;
    }
    .ff-bust-panel.collapsed { width: 52px; }
    .ff-bust-panel.follower { opacity: 0.88; }
    .ff-bust-panel:hover { transform: scale(1.01); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7); }

    .ff-bust-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: rgba(156, 39, 176, 0.2);
      border-bottom: 1px solid rgba(156, 39, 176, 0.4);
      cursor: move;
      user-select: none;
      border-radius: 8px 8px 0 0;
    }
    .ff-bust-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      flex: 1;
    }
    .ff-bust-badge {
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      color: #fff;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      min-width: 20px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(156, 39, 176, 0.5);
    }
    .ff-bust-badge.empty { background: #555; box-shadow: none; }
    .ff-bust-toggle {
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      user-select: none;
      transition: transform 0.2s;
    }
    .ff-bust-toggle:hover { transform: scale(1.2); }

    .ff-bust-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 4px;
    }
    .ff-bust-panel.collapsed .ff-bust-list { display: none; }

    .ff-bust-item {
      display: grid;
      grid-template-columns: 60px 1fr 80px;
      gap: 8px;
      align-items: center;
      padding: 8px 10px;
      margin: 4px 0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(156, 39, 176, 0.2);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .ff-bust-item:hover {
      background: rgba(156, 39, 176, 0.15);
      border-color: rgba(156, 39, 176, 0.4);
      transform: translateX(2px);
    }

    .ff-bust-time {
      font-weight: 700;
      font-size: 12px;
      color: #ba68c8;
      white-space: nowrap;
    }
    .ff-bust-time.urgent { color: #ff5252; animation: pulse-bust 1.5s ease-in-out infinite; }
    .ff-bust-time.soon { color: #ffb74d; }

    @keyframes pulse-bust {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .ff-bust-name {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0; /* Important for flex truncation */
    }
    .ff-bust-name a {
      color: #e6e6e6 !important;
      text-decoration: none !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0; /* Important for flex child truncation */
    }
    .ff-bust-name a:hover { color: #ba68c8 !important; }

    .ff-bust-level {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0; /* Prevent level badge from shrinking */
    }
    .ff-bust-level.easy { background: #4caf50; color: #fff; }
    .ff-bust-level.medium { background: #ff9800; color: #fff; }
    .ff-bust-level.hard { background: #f44336; color: #fff; }

    .ff-bust-btn {
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      color: #fff !important;
      text-align: center;
      padding: 6px 12px;
      border-radius: 6px;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 11px;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(156, 39, 176, 0.4);
      display: block;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    .ff-bust-btn:hover {
      background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%);
      box-shadow: 0 4px 12px rgba(156, 39, 176, 0.6);
      transform: translateY(-1px);
    }

    .ff-bust-status {
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(156, 39, 176, 0.2);
      font-size: 11px;
      color: #aaa;
      text-align: center;
      border-radius: 0 0 8px 8px;
    }
    .ff-bust-panel.collapsed .ff-bust-status { display: none; }

    .ff-bust-status .scanning {
      color: #ba68c8;
      font-weight: 600;
    }
    .ff-bust-status .leader { color: #4caf50; }
    .ff-bust-status .follower { color: #ff9800; }

    .ff-bust-jail-type {
      display: inline-block;
      margin-left: 4px;
      opacity: 0.8;
      font-size: 10px;
    }

    /* Mobile/PDA adjustments */
    @media (max-width: 768px) {
      .ff-bust-panel {
        width: 280px;
        left: 10px;
      }
      .ff-bust-item {
        padding: 6px 8px;
      }
      .ff-bust-btn {
        padding: 4px 8px;
        font-size: 10px;
      }
    }

    .ff-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2147483645 !important;
      display: none;
    }
    .ff-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #2b2b2b;
      color: #eee;
      padding: 20px;
      border-radius: 8px;
      z-index: 2147483648 !important;
      min-width: 360px;
      max-width: 90vw;
      max-height: 85vh;
      overflow-y: auto;
      display: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      font-family: sans-serif;
    }
    .ff-modal h3 {
      margin: 0 0 12px;
      font-size: 1.3em;
      display: flex;
      align-items: center;
    }
    .ff-modal h3::before {
      content: "⚙️";
      margin-right: 8px;
    }
    .ff-tabs { display: flex; margin-bottom: 12px; flex-wrap: wrap; }
    .ff-tab {
      flex: 1;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      color: #aaa;
      border-bottom: 2px solid transparent;
      user-select: none;
      transition: color 0.2s, border-color 0.2s;
      min-width: 80px;
    }
    .ff-tab.active { color: #fff; border-color: #fff; }
    .ff-tab-content { display: none; }
    .ff-tab-content.active { display: block; }
    .ff-modal label {
      display: block;
      margin: 12px 0 4px;
      font-size: 0.9em;
      color: #ccc;
    }
    .ff-modal input {
      width: 100%;
      padding: 6px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #333;
      color: #eee;
      font-size: 1em;
      box-sizing: border-box;
    }
    .ff-modal .btn {
      display: inline-block;
      margin-top: 16px;
      padding: 8px 14px;
      border: none;
      border-radius: 4px;
      font-size: 0.95em;
      cursor: pointer;
      transition: background 0.2s;
    }
    .ff-modal .btn-save { background: #4caf50; color: #fff; margin-right: 8px; }
    .ff-modal .btn-save:hover { background: #66bb6a; }
    .ff-modal .btn-cancel { background: #c62828; color: #fff; }
    .ff-modal .btn-cancel:hover { background: #e53935; }
    .ff-modal .btn-clear { background: #555; color: #fff; margin-left: 8px; }
    .ff-modal .btn-clear:hover { background: #666; }

    /* Status icons (travel/hospital) - consolidated positioning */
    .ff-travel-icon,
    .ff-hospital-icon {
      position: absolute;
      right: 4px;
      top: -2px;
      height: 12px !important;
      width: 12px !important;
      max-width: 12px !important;
      max-height: 12px !important;
      z-index: 2147483647 !important;
      opacity: 0.92;
      pointer-events: auto;
      transition: filter 0.15s, box-shadow 0.15s;
    }
    .ff-travel-icon {
      filter: grayscale(1) brightness(0.7);
    }
    .ff-travel-icon.ff-traveling {
      filter: grayscale(0) brightness(1) drop-shadow(0 0 3px #2094fa) drop-shadow(0 0 2px #42a5f5);
    }
    .ff-travel-icon.ff-abroad {
      filter: grayscale(0) brightness(1) drop-shadow(0 0 3px #ff9800) drop-shadow(0 0 2px #ffb300);
    }
    .ff-travel-icon:hover,
    .ff-hospital-icon:hover {
      filter: brightness(1.4) !important;
    }

    /* Countdown chips and location badges */
    .ff-countdown-chip,
    .ff-loc-badge {
      position: absolute;
      right: 4px;
      bottom: -4px;
      padding: 0 3px;
      font-size: 9px;
      line-height: 10px;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      border-radius: 3px;
      font-weight: 700;
      z-index: 2147483647 !important;
      pointer-events: none;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .ff-loc-badge[data-kind="travel"] { outline: 1px solid rgba(33, 150, 243, 0.9); }
    .ff-loc-badge[data-kind="return"] { outline: 1px solid rgba(3, 169, 244, 0.9); }
    .ff-loc-badge[data-kind="abroad"] {
      background: #ffb300 !important;
      color: #111 !important;
      outline: 1px solid #ffd54f !important;
      box-shadow: 0 0 6px rgba(255, 179, 0, 0.45);
    }

    /* BOUNTY PAGE SPECIFIC - tighter spacing for smaller cells */
    li[data-ff-bounty="1"] .ff-travel-icon,
    li[data-ff-bounty="1"] .ff-hospital-icon {
      top: 2px;
    }
    li[data-ff-bounty="1"] .ff-countdown-chip,
    li[data-ff-bounty="1"] .ff-loc-badge {
      bottom: 2px;
    }

    /* API warning banner */
    #ff-api-warning {
      position: fixed;
      left: 20px;
      bottom: 80px;
      max-width: 260px;
      background: rgba(33, 33, 33, 0.95);
      color: #ffeb3b;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      z-index: 2147483647;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }

    /* RSI+ Experimental Panel */
    #ff-exp-panel, #ff-exp-panel * { color: #e6e6e6 !important; }
    #ff-exp-panel .ff-chip-label {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(66, 165, 245, 0.18);
      border: 1px solid rgba(66, 165, 245, 0.45);
    }
    #ff-exp-panel .ff-mini-btn {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #e6e6e6;
      cursor: pointer;
      font-size: 11px;
    }
    #ff-exp-panel .ff-mini-btn:hover { background: rgba(255, 255, 255, 0.14); }
    #ff-exp-panel .ff-note { opacity: 0.8; font-size: 11px; margin-left: 6px; }

    /* Fight Intelligence Panel */
    #ff-intel-panel {
      margin-top: 8px;
      background: linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 12px 14px;
      color: #e6e6e6;
      font-size: 12px;
    }
    #ff-intel-panel .ff-intel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #ff-intel-panel .ff-intel-title {
      font-weight: 600;
      font-size: 13px;
      color: #4fc3f7;
    }
    #ff-intel-panel .ff-intel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    #ff-intel-panel .ff-intel-row:last-child {
      border-bottom: none;
    }
    #ff-intel-panel .ff-intel-label {
      color: #aaa;
      font-size: 11px;
    }
    #ff-intel-panel .ff-intel-value {
      font-weight: 600;
      font-size: 13px;
    }
    #ff-intel-panel .ff-intel-value.positive { color: #4caf50; }
    #ff-intel-panel .ff-intel-value.warning { color: #f9a825; }
    #ff-intel-panel .ff-intel-value.danger { color: #ef5350; }
    #ff-intel-panel .ff-intel-value.neutral { color: #90a4ae; }
    #ff-intel-panel .ff-win-chance-bar {
      width: 100%;
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 4px;
    }
    #ff-intel-panel .ff-win-chance-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    #ff-intel-panel .ff-history-tag {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-right: 4px;
    }
    #ff-intel-panel .ff-history-tag.win {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }
    #ff-intel-panel .ff-history-tag.loss {
      background: rgba(239, 83, 80, 0.2);
      color: #ef5350;
      border: 1px solid rgba(239, 83, 80, 0.3);
    }
    #ff-intel-panel .ff-no-data {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 8px;
    }
    #ff-intel-panel .ff-confidence {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 10px;
      margin-left: 6px;
      background: rgba(255,255,255,0.1);
      color: #888;
    }
    #ff-intel-panel .ff-confidence.high {
      background: rgba(76, 175, 80, 0.15);
      color: #81c784;
    }
    #ff-intel-panel .ff-confidence.medium {
      background: rgba(255, 193, 7, 0.15);
      color: #ffd54f;
    }
    #ff-intel-panel .ff-confidence.low {
      background: rgba(158, 158, 158, 0.15);
      color: #9e9e9e;
    }

    /* Anti-overlap utility */
    .ff-anti-overlap {
      z-index: 2147483647 !important;
      will-change: transform;
      pointer-events: none;
    }

    /* Stats tab styles */
    .ff-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
      margin: 12px 0;
    }
    .ff-stat-card {
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .ff-stat-value {
      font-size: 1.8em;
      font-weight: 700;
      color: #4caf50;
      display: block;
    }
    .ff-stat-value.warning { color: #f9a825; }
    .ff-stat-value.danger { color: #c62828; }
    .ff-stat-label {
      font-size: 0.75em;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ff-calibration-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 0.85em;
      color: #e0e0e0;
    }
    .ff-calibration-table th,
    .ff-calibration-table td {
      padding: 6px 8px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: #e0e0e0;
    }
    .ff-calibration-table th {
      color: #aaa;
      font-weight: 600;
    }
    .ff-calibration-table td {
      color: #ccc;
    }
    .ff-recent-fights {
      max-height: 200px;
      overflow-y: auto;
      margin: 12px 0;
    }
    .ff-fight-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.85em;
      color: #ccc;
    }
    .ff-fight-row:hover {
      background: rgba(255,255,255,0.03);
    }
    .ff-fight-row span {
      color: #ccc;
    }
    .ff-fight-win { color: #4caf50; }
    .ff-fight-loss { color: #c62828; }
    .ff-fight-other { color: #9e9e9e; }
    .ff-btn-small {
      padding: 4px 8px;
      font-size: 0.8em;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      margin: 2px;
    }
    .ff-btn-export { background: #2196f3; color: #fff; }
    .ff-btn-export:hover { background: #42a5f5; }
    .ff-btn-danger { background: #c62828; color: #fff; }
    .ff-btn-danger:hover { background: #e53935; }
    .ff-empty-state {
      text-align: center;
      padding: 30px;
      color: #666;
    }
    .ff-log-indicator {
      position: fixed;
      bottom: 80px;
      left: 80px;
      background: rgba(76, 175, 80, 0.9);
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10001;
      animation: ff-fade-out 3s forwards;
      pointer-events: none;
    }
    @keyframes ff-fade-out {
      0%, 70% { opacity: 1; }
      100% { opacity: 0; }
    }
  `);

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Escapes HTML to prevent XSS
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Gets gym multiplier based on xanax count
   */
  function getGymMultiplier(xanCount) {
    const energy = xanCount * 250;

    // Last real gym tier values
    const LAST_TIER_ENERGY = 106305;
    const LAST_TIER_MUL = 3.45;

    // If beyond last gym tier, use logarithmic scaling
    if (energy > LAST_TIER_ENERGY) {
      const extraEnergy = energy - LAST_TIER_ENERGY;
      // Logarithmic growth: every ~10x increase in extra energy adds ~1.0 to multiplier
      // This means someone with 10x more training beyond max gym gets ~1.0 higher multiplier
      const extraBonus = Math.log10(extraEnergy / 10000 + 1) * 1.0;
      const result = LAST_TIER_MUL + extraBonus;
      return result;
    }

    // Within gym tiers, use the tier lookup
    let multiplier = 1;
    for (const tier of GYM_TIERS) {
      if (energy >= tier.energy && tier.energy <= LAST_TIER_ENERGY) {
        multiplier = tier.mul;
      }
    }
    return multiplier;
  }

  /**
   * Abbreviates location name to country code
   */
  function abbreviateLocation(loc) {
    if (!loc) return '';
    if (LOC_TO_CODE[loc]) return LOC_TO_CODE[loc];
    const upper = String(loc).toUpperCase();
    const firstWord = upper.split(/\s+/)[0];
    return (firstWord.slice(0, 3) || upper.slice(0, 3)).replace(/[^A-Z]/g, '');
  }

  /**
   * Parses travel info from status description
   */
  function parseTravelInfo(desc) {
    if (!desc) return null;
    let match;
    if ((match = desc.match(/^Traveling to\s+(.+)$/i))) {
      return { kind: 'travel', loc: match[1].trim() };
    }
    if ((match = desc.match(/^Returning to Torn from\s+(.+)$/i))) {
      return { kind: 'return', loc: match[1].trim() };
    }
    if ((match = desc.match(/^In\s+(.+)$/i))) {
      return { kind: 'abroad', loc: match[1].trim() };
    }
    return null;
  }

  /**
   * Parses minutes from status text
   */
  function parseMinutesFromText(txt) {
    if (!txt) return null;
    const match = String(txt).match(/(\d+)\s*min/i);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Shows a temporary notification
   */
  function showNotification(message, isError = false) {
    const existing = document.querySelector('.ff-log-indicator');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'ff-log-indicator';
    if (isError) notif.style.background = 'rgba(198, 40, 40, 0.9)';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
  }

  // ============================================================================
  // INDEXEDDB FIGHT LOG
  // ============================================================================

  const FightDB = (() => {
    let db = null;
    let dbReady = false;
    let dbError = false;

    /**
     * Opens/creates the IndexedDB database
     */
    function openDatabase() {
      return new Promise((resolve, reject) => {
        if (db && dbReady) {
          resolve(db);
          return;
        }

        if (dbError) {
          reject(new Error('Database previously failed to open'));
          return;
        }

        // Check IndexedDB availability
        if (!window.indexedDB) {
          dbError = true;
          reject(new Error('IndexedDB not supported'));
          return;
        }

        try {
          const request = indexedDB.open(DB_NAME, DB_VERSION);

          request.onerror = (e) => {
            console.error('FightDB: Error opening database', e);
            dbError = true;
            reject(e.target.error);
          };

          request.onsuccess = (e) => {
            db = e.target.result;
            dbReady = true;

            // Handle connection errors
            db.onerror = (event) => {
              console.error('FightDB: Database error', event.target.error);
            };

            resolve(db);
          };

          request.onupgradeneeded = (e) => {
            const database = e.target.result;
            const transaction = e.target.transaction;

            console.log(`FightDB: Upgrading database from v${e.oldVersion} to v${e.newVersion}`);

            // Delete and recreate fights store to fix any schema issues
            if (database.objectStoreNames.contains('fights')) {
              console.log('FightDB: Deleting old fights store to fix schema');
              database.deleteObjectStore('fights');
            }
            
            // Create fights store with proper indexes
            const fightStore = database.createObjectStore('fights', {
              keyPath: 'id',
              autoIncrement: true
            });
            fightStore.createIndex('timestamp', 'timestamp', { unique: false });
            fightStore.createIndex('opponentId', 'opponentId', { unique: false });
            fightStore.createIndex('result', 'outcome', { unique: false });
            fightStore.createIndex('rsiRaw', 'rsiRaw', { unique: false });
            console.log('FightDB: Created fights store with indexes');

            // Delete and recreate players store to fix any schema issues
            if (database.objectStoreNames.contains('players')) {
              console.log('FightDB: Deleting old players store to fix schema');
              database.deleteObjectStore('players');
            }
            
            // Create players store with proper indexes
            const playerStore = database.createObjectStore('players', {
              keyPath: 'opponentId'
            });
            playerStore.createIndex('lastFought', 'lastFought', { unique: false });
            playerStore.createIndex('fightCount', 'fightCount', { unique: false });
            console.log('FightDB: Created players store with indexes');
          };
        } catch (e) {
          dbError = true;
          reject(e);
        }
      });
    }

    /**
     * Logs a fight to the database
     */
    async function logFight(fightData) {
      try {
        const database = await openDatabase();

        return new Promise((resolve, reject) => {
          const transaction = database.transaction(['fights', 'players'], 'readwrite');
          const fightStore = transaction.objectStore('fights');
          const playerStore = transaction.objectStore('players');

          // Add fight record
          const fightRecord = {
            ...fightData,
            timestamp: Date.now()
          };

          const addRequest = fightStore.add(fightRecord);

          addRequest.onsuccess = () => {
            // Update player record
            const playerGet = playerStore.get(fightData.opponentId);

            playerGet.onsuccess = () => {
              const existing = playerGet.result || {
                opponentId: fightData.opponentId,  // PATCHED: Fixed typo from 'odefinerId'
                opponentName: fightData.opponentName,
                fightCount: 0,
                wins: 0,
                losses: 0
              };

              existing.fightCount++;
              existing.lastFought = Date.now();
              existing.opponentName = fightData.opponentName || existing.opponentName;

              if (fightData.outcome === 'win') existing.wins++;
              else if (fightData.outcome === 'loss') existing.losses++;

              playerStore.put(existing);
            };

            resolve(addRequest.result);
          };

          addRequest.onerror = () => reject(addRequest.error);

          transaction.oncomplete = () => {
            // Cleanup old records if over limit
            cleanupOldFights();
          };
        });
      } catch (e) {
        console.error('FightDB: Error logging fight', e);
        throw e;
      }
    }

    /**
     * Removes oldest fights if over the limit
     */
    async function cleanupOldFights() {
      try {
        const database = await openDatabase();
        const transaction = database.transaction('fights', 'readwrite');
        const store = transaction.objectStore('fights');
        const countRequest = store.count();

        countRequest.onsuccess = () => {
          const count = countRequest.result;
          if (count <= MAX_FIGHTS_STORED) return;

          const toDelete = count - MAX_FIGHTS_STORED;
          const index = store.index('timestamp');
          const cursor = index.openCursor();
          let deleted = 0;

          cursor.onsuccess = (e) => {
            const c = e.target.result;
            if (c && deleted < toDelete) {
              store.delete(c.primaryKey);
              deleted++;
              c.continue();
            }
          };
        };
      } catch (e) {
        console.error('FightDB: Cleanup error', e);
      }
    }

    /**
     * Gets all fights
     */
    async function getAllFights() {
      try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = database.transaction('fights', 'readonly');
          const store = transaction.objectStore('fights');
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('FightDB: Error getting fights', e);
        return [];
      }
    }

    /**
     * Gets recent fights (last N)
     */
    async function getRecentFights(limit = 50) {
      try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = database.transaction('fights', 'readonly');
          const store = transaction.objectStore('fights');
          const index = store.index('timestamp');
          const request = index.openCursor(null, 'prev');
          const results = [];

          request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor && results.length < limit) {
              results.push(cursor.value);
              cursor.continue();
            } else {
              resolve(results);
            }
          };
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('FightDB: Error getting recent fights', e);
        return [];
      }
    }

    /**
     * Gets fight history for a specific opponent
     */
    async function getOpponentHistory(opponentId) {
      try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = database.transaction('fights', 'readonly');
          const store = transaction.objectStore('fights');
          const index = store.index('opponentId');  // PATCHED: Fixed typo from 'odefinerId'
          const request = index.getAll(opponentId);

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('FightDB: Error getting opponent history', e);
        return [];
      }
    }

    /**
     * Gets player record
     */
    async function getPlayerRecord(opponentId) {
      try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = database.transaction('players', 'readonly');
          const store = transaction.objectStore('players');
          const request = store.get(opponentId);

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('FightDB: Error getting player record', e);
        return null;
      }
    }

    /**
     * Gets statistics by RSI bucket
     */
    async function getStatsByRsiBucket() {
      const fights = await getAllFights();
      const buckets = {
        '0-50':    { wins: 0, losses: 0, other: 0, total: 0 },
        '50-75':   { wins: 0, losses: 0, other: 0, total: 0 },
        '75-100':  { wins: 0, losses: 0, other: 0, total: 0 },
        '100-125': { wins: 0, losses: 0, other: 0, total: 0 },
        '125-150': { wins: 0, losses: 0, other: 0, total: 0 },
        '150+':    { wins: 0, losses: 0, other: 0, total: 0 }
      };

      for (const fight of fights) {
        const rsi = fight.rsiAdjusted || fight.rsiRaw || 100;
        let bucket;
        if (rsi < 50) bucket = '0-50';
        else if (rsi < 75) bucket = '50-75';
        else if (rsi < 100) bucket = '75-100';
        else if (rsi < 125) bucket = '100-125';
        else if (rsi < 150) bucket = '125-150';
        else bucket = '150+';

        buckets[bucket].total++;
        if (fight.outcome === 'win') buckets[bucket].wins++;
        else if (fight.outcome === 'loss') buckets[bucket].losses++;
        else buckets[bucket].other++;
      }

      return buckets;
    }

    /**
     * Gets overall statistics
     */
    async function getOverallStats() {
      const fights = await getAllFights();
      const stats = {
        total: fights.length,
        wins: 0,
        losses: 0,
        other: 0,
        avgRsi: 0,
        avgRsiOnWin: 0,
        avgRsiOnLoss: 0
      };

      if (fights.length === 0) return stats;

      let rsiSum = 0, winRsiSum = 0, lossRsiSum = 0;

      for (const fight of fights) {
        const rsi = fight.rsiAdjusted || fight.rsiRaw || 100;
        rsiSum += rsi;

        if (fight.outcome === 'win') {
          stats.wins++;
          winRsiSum += rsi;
        } else if (fight.outcome === 'loss') {
          stats.losses++;
          lossRsiSum += rsi;
        } else {
          stats.other++;
        }
      }

      stats.avgRsi = rsiSum / fights.length;
      stats.avgRsiOnWin = stats.wins > 0 ? winRsiSum / stats.wins : 0;
      stats.avgRsiOnLoss = stats.losses > 0 ? lossRsiSum / stats.losses : 0;
      stats.winRate = stats.total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;

      return stats;
    }

    /**
     * Exports all data as JSON
     */
    async function exportData() {
      const fights = await getAllFights();
      const database = await openDatabase();

      return new Promise((resolve, reject) => {
        const transaction = database.transaction('players', 'readonly');
        const store = transaction.objectStore('players');
        const request = store.getAll();

        request.onsuccess = () => {
          resolve({
            exportDate: new Date().toISOString(),
            version: VERSION,
            fights: fights,
            players: request.result || []
          });
        };
        request.onerror = () => reject(request.error);
      });
    }

    /**
     * Clears all data
     */
    async function clearAllData() {
      try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = database.transaction(['fights', 'players'], 'readwrite');

          transaction.objectStore('fights').clear();
          transaction.objectStore('players').clear();

          transaction.oncomplete = () => resolve(true);
          transaction.onerror = () => reject(transaction.error);
        });
      } catch (e) {
        console.error('FightDB: Error clearing data', e);
        throw e;
      }
    }

    /**
     * Check if database is available
     */
    async function isAvailable() {
      try {
        await openDatabase();
        return true;
      } catch {
        return false;
      }
    }

    /**
     * Gets win rate for a specific RSI value (finds the appropriate bucket)
     * Returns: { winRate, totalFights, wins, losses, confidence }
     */
    async function getWinRateForRSI(rsiValue) {
      const fights = await getAllFights();

      // Find fights in a range around this RSI (±15%)
      const margin = 15;
      const lower = rsiValue - margin;
      const upper = rsiValue + margin;

      let wins = 0, losses = 0, total = 0;

      for (const fight of fights) {
        const rsi = fight.rsiAdjusted || fight.rsiRaw;
        if (rsi === null || rsi === undefined) continue;

        if (rsi >= lower && rsi < upper) {
          total++;
          if (fight.outcome === 'win') wins++;
          else if (fight.outcome === 'loss') losses++;
        }
      }

      // Determine confidence level
      let confidence = 'none';
      if (total >= 20) confidence = 'high';
      else if (total >= 10) confidence = 'medium';
      else if (total >= 3) confidence = 'low';

      return {
        winRate: total > 0 ? (wins / total) * 100 : null,
        totalFights: total,
        wins,
        losses,
        confidence,
        rsiRange: `${Math.round(lower)}-${Math.round(upper)}%`
      };
    }

    /**
     * Auto-update learned RSI parameters when a fight is logged
     * Uses online logistic regression update
     */
    function updateLearnedRSI(rsiValue, isWin) {
      try {
        // Get current parameters
        let theta0 = Number(Env.getValue('ff_lrsi_theta0', 0));
        let theta1 = Number(Env.getValue('ff_lrsi_theta1', 0.12));
        let hist = Env.getValue('ff_lrsi_hist', []) || [];

        // Add to history
        const xRaw = rsiValue - 100; // Center around 100%
        const y = isWin ? 1 : 0;
        hist.push({ x: xRaw, y, ts: Date.now() });

        // Keep only last 500 entries
        if (hist.length > 500) {
          hist = hist.slice(-500);
        }

        // Perform gradient descent update (learning rate = 0.01)
        const lr = 0.01;
        const pWin = 1 / (1 + Math.exp(-(theta0 + theta1 * xRaw)));
        const error = y - pWin;

        theta0 += lr * error;
        theta1 += lr * error * xRaw;

        // Clamp theta1 to reasonable bounds
        theta1 = Math.max(0.01, Math.min(0.5, theta1));

        // Save updated parameters
        Env.setValue('ff_lrsi_theta0', theta0);
        Env.setValue('ff_lrsi_theta1', theta1);
        Env.setValue('ff_lrsi_hist', hist);
        Env.setValue('ff_lrsi_meta', { n: hist.length, ts: Date.now() });

        console.log(`Win Chance model updated: θ0=${theta0.toFixed(4)}, θ1=${theta1.toFixed(4)}, n=${hist.length}`);

        return { theta0, theta1, historyLength: hist.length };
      } catch (e) {
        console.error('FightDB: Error updating learned RSI', e);
        return null;
      }
    }

    /**
     * Gets learned RSI win probability for a given RSI value
     */
    function getLearnedWinProbability(rsiValue) {
      const theta0 = Number(Env.getValue('ff_lrsi_theta0', 0));
      const theta1 = Number(Env.getValue('ff_lrsi_theta1', 0.12));
      const hist = Env.getValue('ff_lrsi_hist', []) || [];

      const xRaw = rsiValue - 100;
      const pWin = 1 / (1 + Math.exp(-(theta0 + theta1 * xRaw)));

      return {
        probability: pWin * 100,
        theta0,
        theta1,
        dataPoints: hist.length,
        confidence: hist.length >= 50 ? 'high' : hist.length >= 20 ? 'medium' : hist.length >= 5 ? 'low' : 'none'
      };
    }

    return {
      logFight,
      getAllFights,
      getRecentFights,
      getOpponentHistory,
      getPlayerRecord,
      getStatsByRsiBucket,
      getOverallStats,
      exportData,
      clearAllData,
      isAvailable,
      getWinRateForRSI,
      updateLearnedRSI,
      getLearnedWinProbability
    };
  })();

  // ============================================================================
  // FIGHT CAPTURE SYSTEM
  // ============================================================================

  const FightCapture = (() => {
    /**
     * Stores a pending attack prediction
     */
    function storePendingAttack(data) {
      try {
        const pending = {
          opponentId: data.opponentId,
          opponentName: data.opponentName,
          rsiRaw: data.rsiRaw,
          rsiAdjusted: data.rsiAdjusted,
          riskClass: data.riskClass,
          oppLife: data.oppLife,
          oppLevel: data.oppLevel,
          oppSnapshot: data.oppSnapshot,
          timestamp: Date.now()
        };
        sessionStorage.setItem(PENDING_ATTACK_KEY, JSON.stringify(pending));
      } catch (e) {
        console.error('FightCapture: Error storing pending attack', e);
      }
    }

    /**
     * Retrieves and clears pending attack
     */
    function getPendingAttack() {
      try {
        const data = sessionStorage.getItem(PENDING_ATTACK_KEY);
        if (!data) return null;

        const pending = JSON.parse(data);

        // Only valid for 5 minutes
        if (Date.now() - pending.timestamp > 5 * 60 * 1000) {
          sessionStorage.removeItem(PENDING_ATTACK_KEY);
          return null;
        }

        return pending;
      } catch (e) {
        console.error('FightCapture: Error getting pending attack', e);
        return null;
      }
    }

    /**
     * Clears pending attack
     */
    function clearPendingAttack() {
      try {
        sessionStorage.removeItem(PENDING_ATTACK_KEY);
      } catch (e) {
        // Ignore
      }
    }

    /**
     * Checks if current page is an attack result page
     * 
     * FIXED v2.1.7: Only process attackLog pages to prevent duplicate logging.
     * Previously checked both sid=attack AND sid=attackLog, which caused wins/losses
     * to be logged twice (once on attack page, once on attackLog page).
     * Now only processes the final attackLog page where complete results are shown.
     */
    function isAttackResultPage() {
      // ONLY process the attackLog page (after fight completes)
      // Do NOT process sid=attack pages (fight in progress or just finished)
      return location.href.includes('sid=attackLog');
    }

    /**
     * Gets the unique attack log ID from URL
     */
    function getAttackLogId() {
      // Extract the hash ID from attackLog URLs like:
      // loader.php?sid=attackLog&ID=3f7eea8c1697b01e3740d3b3c5062f55
      const match = location.href.match(/sid=attackLog[^&]*&ID=([a-f0-9]+)/i);
      return match ? match[1] : null;
    }

    /**
     * Checks if this attack log has already been processed
     */
    function isAttackLogProcessed(logId) {
      if (!logId) return false;
      try {
        const processed = JSON.parse(localStorage.getItem('ff_processed_logs') || '[]');
        return processed.includes(logId);
      } catch (e) {
        return false;
      }
    }

    /**
     * Marks an attack log as processed
     */
    function markAttackLogProcessed(logId) {
      if (!logId) return;
      try {
        let processed = JSON.parse(localStorage.getItem('ff_processed_logs') || '[]');
        if (!processed.includes(logId)) {
          processed.push(logId);
          // Keep only last 200 to prevent localStorage bloat
          if (processed.length > 200) {
            processed = processed.slice(-200);
          }
          localStorage.setItem('ff_processed_logs', JSON.stringify(processed));
        }
      } catch (e) {
        console.error('FightCapture: Error marking log processed', e);
      }
    }

    /**
     * Checks if current page is the attack log page
     */
    function isAttackLogPage() {
      return location.href.includes('attacklog.php') ||
             location.href.includes('page.php?sid=attackLog');
    }

    /**
     * Parses the attack outcome from the page
     */
    function parseAttackOutcome() {
      const bodyText = document.body.innerText || '';
      const htmlText = document.body.innerHTML || '';
      
      // PATCHED: Check for "You lost" or "YOU LOST" anywhere in the DOM
      // This is more robust than relying on specific class names
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const text = el.textContent?.trim();
        // Look for exact "You lost" or "YOU LOST" as the only/main content
        if (text && (text === 'You lost' || text === 'YOU LOST' || text === 'you lost')) {
          console.log('FightCapture: LOSS detected via DOM element with exact text match');
          return 'loss';
        }
      }
      
      // CRITICAL: Check LOSS patterns FIRST to prevent false positives from win patterns
      // Loss conditions - EXPANDED PATTERNS
      if (/You lost/i.test(bodyText) ||
          /YOU LOST/i.test(bodyText) ||
          /You were defeated/i.test(bodyText) ||
          /defeated you/i.test(bodyText) ||
          /you were beaten/i.test(bodyText) ||
          /lost the fight/i.test(bodyText) ||
          /and hospitalized you/i.test(bodyText) ||
          /hospitalized you for\s+\d+/i.test(bodyText) ||
          /put you in the hospital/i.test(bodyText) ||
          /put you in hospital/i.test(bodyText) ||
          /sent you to the hospital/i.test(bodyText) ||
          /You were hospitalized for/i.test(bodyText) ||
          /sent to hospital for/i.test(bodyText) ||
          /lost to\s+\w+/i.test(bodyText)) {
        console.log('FightCapture: LOSS detected via text pattern');
        return 'loss';
      }
      
      // Also check HTML for "You lost" in case it's not in innerText
      if (/You\s+lost/i.test(htmlText) || /YOU\s+LOST/i.test(htmlText)) {
        console.log('FightCapture: LOSS detected in HTML');
        return 'loss';
      }

      // Win conditions - RESTORED BROADER PATTERNS while keeping loss-first logic
      if (/You attacked\s+.+\s+and won/i.test(bodyText) ||
          /executing\s+.+\s+for\s+\d+/i.test(bodyText) ||  // RESTORED: Matches "executing KoTomka for 173"
          /hospitalized\s+.+\s+for\s+\d+/i.test(bodyText) ||  // RESTORED: Broad hospitalization pattern
          /You mugged/i.test(bodyText) ||
          /You have taken\s+.+\s+from/i.test(bodyText) ||
          /left\s+.+\s+on the street/i.test(bodyText) ||  // RESTORED: Removed "You" requirement
          /left them on the street/i.test(bodyText) ||
          /defeated\s+/i.test(bodyText) ||  // RESTORED: Broad defeated pattern
          /won the fight/i.test(bodyText) ||
          /knocked out/i.test(bodyText) ||  // RESTORED: Removed "You" requirement
          /beat\s+.+\s+(up|down)/i.test(bodyText)) {  // RESTORED: Removed "You" requirement
        console.log('FightCapture: WIN detected via text pattern');
        return 'win';
      }

      // Stalemate
      if (/stalemate/i.test(bodyText) ||
          /draw/i.test(bodyText)) {
        return 'stalemate';
      }

      // Escape
      if (/escaped/i.test(bodyText) ||
          /ran away/i.test(bodyText) ||
          /fled/i.test(bodyText)) {
        return 'escape';
      }

      // Interrupted/Assist
      if (/Someone else/i.test(bodyText) ||
          /interrupted/i.test(bodyText) ||
          /assist/i.test(bodyText)) {
        return 'assist';
      }

      // Timeout
      if (/timeout/i.test(bodyText) ||
          /timed out/i.test(bodyText)) {
        return 'timeout';
      }

      return 'unknown';
    }

    /**
     * Extracts opponent info from attack page
     */
    function extractOpponentFromPage() {
      try {
        let opponentId = null;
        let opponentName = null;
        
        // PATCHED: Get current user's ID from API data to prevent self-fights
        const currentUserId = ME_STATS?.player_id || ME_STATS?.basic?.player_id || null;
        
        // First try URL's user2ID parameter (during attack)
        const urlMatch = location.href.match(/user2ID=(\d+)/i);
        if (urlMatch) {
          opponentId = parseInt(urlMatch[1], 10);
          
          // PATCHED: Skip if this is the current user (self-fight)
          if (currentUserId && opponentId === currentUserId) {
            console.log('FightCapture: Skipping self-fight (detected via URL parameter)');
            return { opponentId: null, opponentName: null };
          }
        }
        
        // For attackLog pages, we need to find the opponent from page content
        // The opponent is the other person in the fight (not the current user)
        if (!opponentId) {
          // Get current user's name to exclude them
          const currentUserEl = document.querySelector('#sidebarroot a[href*="profiles.php"]') ||
                               document.querySelector('[class*="user-name"]') ||
                               document.querySelector('.info-name');
          const currentUserName = currentUserEl?.textContent?.trim()?.toLowerCase();
          
          // Find all profile links in the attack log
          const profileLinks = document.querySelectorAll('a[href*="profiles.php?XID="]');
          
          for (const link of profileLinks) {
            const match = link.href.match(/XID=(\d+)/);
            const linkName = link.textContent?.trim();
            
            if (match) {
              const id = parseInt(match[1], 10);
              
              // Validate it's a real user ID (not a tiny number)
              if (id <= 100) continue;
              
              // PATCHED: Skip if this is the current user (by ID)
              if (currentUserId && id === currentUserId) {
                console.log('FightCapture: Skipping self (by ID):', id);
                continue;
              }
              
              // Skip if this is the current user (by name - fallback)
              if (currentUserName && linkName?.toLowerCase() === currentUserName) {
                console.log('FightCapture: Skipping self (by name):', linkName);
                continue;
              }
              
              opponentId = id;
              opponentName = linkName;
              break;
            }
          }
        }
        
        // Try title as fallback for name
        if (opponentId && !opponentName) {
          const titleMatch = document.title.match(/attacking\s+(.+)/i);
          if (titleMatch) {
            opponentName = titleMatch[1].trim();
          }
        }
        
        // PATCHED: Final safety check - prevent self-fight
        if (opponentId && currentUserId && opponentId === currentUserId) {
          console.log('FightCapture: Final check - preventing self-fight');
          return { opponentId: null, opponentName: null };
        }

        console.log('FightCapture: Extracted opponent - ID:', opponentId, 'Name:', opponentName);
        return { opponentId, opponentName };
      } catch (e) {
        console.error('FightCapture: Error extracting opponent info', e);
        return { opponentId: null, opponentName: null };
      }
    }

    /**
     * Processes attack result and logs it
     */
    let _processedThisPage = false;

    async function processAttackResult() {
      // Strict guards to prevent duplicate logging
      if (_processedThisPage) return;
      if (!isAttackResultPage()) return;

      // Check if this specific attack log has already been processed (persists across refreshes)
      const logId = getAttackLogId();
      if (logId && isAttackLogProcessed(logId)) {
        console.log('FightCapture: Attack log already processed:', logId);
        _processedThisPage = true; // Prevent further attempts this session
        return;
      }

      console.log('FightCapture: Detected attack page, waiting for content...');

      // Wait for page to fully load
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Double-check we haven't processed while waiting
      if (_processedThisPage) return;

      // Re-check persistent storage after wait
      if (logId && isAttackLogProcessed(logId)) {
        console.log('FightCapture: Attack log already processed (after wait):', logId);
        _processedThisPage = true;
        return;
      }

      // PATCHED: Try multiple times if outcome is unknown (handles late-loading modals)
      let outcome = 'unknown';
      let attempts = 0;
      const maxAttempts = 5;
      
      while (outcome === 'unknown' && attempts < maxAttempts) {
        outcome = parseAttackOutcome();
        
        if (outcome === 'unknown') {
          console.log(`FightCapture: Attempt ${attempts + 1}/${maxAttempts} - outcome still unknown, waiting...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        } else {
          console.log(`FightCapture: Outcome detected on attempt ${attempts + 1}: ${outcome}`);
        }
      }
      
      console.log('FightCapture: Final parsed outcome:', outcome);

      if (outcome === 'unknown') {
        console.log('FightCapture: Could not determine outcome from page text after', maxAttempts, 'attempts');
        console.log('FightCapture: Page sample:', document.body.innerText?.substring(0, 300));
        return;
      }

      const pending = getPendingAttack();
      const pageInfo = extractOpponentFromPage();

      console.log('FightCapture: Pending attack data:', pending);
      console.log('FightCapture: Page info:', pageInfo);

      // Build fight record
      const fightRecord = {
        opponentId: pending?.opponentId || pageInfo.opponentId,
        opponentName: pending?.opponentName || pageInfo.opponentName,
        outcome: outcome,
        rsiRaw: pending?.rsiRaw || null,
        rsiAdjusted: pending?.rsiAdjusted || null,
        riskClass: pending?.riskClass || null,
        oppLife: pending?.oppLife || null,
        oppLevel: pending?.oppLevel || null,
        oppSnapshot: pending?.oppSnapshot || null,
        hadPrediction: !!pending,
        attackLogId: logId, // Store the log ID for reference
        capturedAt: Date.now()
      };

      // Only log if we have a VALID opponent ID (not just any number)
      if (!fightRecord.opponentId || fightRecord.opponentId < 100) {
        console.log('FightCapture: Invalid opponent ID:', fightRecord.opponentId, '- skipping log');
        return;
      }

      // Mark as processed BEFORE async operations (both session and persistent)
      _processedThisPage = true;
      if (logId) {
        markAttackLogProcessed(logId);
      }

      try {
        await FightDB.logFight(fightRecord);
        clearPendingAttack();

        // Auto-update learned RSI if we have RSI data
        if (fightRecord.rsiAdjusted || fightRecord.rsiRaw) {
          const rsiValue = fightRecord.rsiAdjusted || fightRecord.rsiRaw;
          const isWin = outcome === 'win';
          FightDB.updateLearnedRSI(rsiValue, isWin);
          console.log('FightCapture: Auto-updated Win Chance model with', { rsiValue, isWin });
        }

        showNotification(`📊 Fight logged: ${outcome.toUpperCase()}`);
        console.log('FightCapture: Successfully logged fight', fightRecord);
      } catch (e) {
        console.error('FightCapture: Failed to log fight', e);
        showNotification('Failed to log fight: ' + e.message, true);
        // Note: We don't reset _processedThisPage here because we already marked it in persistent storage
      }
    }

    /**
     * Parses fights from the attack log page
     */
    function parseAttackLogEntries() {
      const entries = [];

      // Look for attack log rows
      document.querySelectorAll('[class*="log-list"] li, .attack-log-item, [class*="attackLog"] [class*="row"]').forEach(row => {
        const text = row.innerText || '';

        // Skip if already processed
        if (row.dataset.ffProcessed) return;

        // Try to extract opponent ID from links
        const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
        const opponentId = profileLink?.href.match(/XID=(\d+)/)?.[1];
        const opponentName = profileLink?.textContent?.trim();

        if (!opponentId) return;

        let outcome = null;
        if (/left\s+.+\s+on the street/i.test(text) ||
            /hospitalized/i.test(text) ||
            /mugged/i.test(text) ||
            /won/i.test(text)) {
          outcome = 'win';
        } else if (/lost/i.test(text) ||
                   /hospitalized you/i.test(text) ||
                   /defeated you/i.test(text)) {
          outcome = 'loss';
        }

        if (outcome) {
          entries.push({
            opponentId: parseInt(opponentId, 10),
            opponentName,
            outcome,
            source: 'attacklog'
          });
          row.dataset.ffProcessed = '1';
        }
      });

      return entries;
    }

    /**
     * Sets up attack page observer
     */
    function setupAttackPageObserver() {
      // Only run on attack result pages
      if (!isAttackResultPage()) return;

      // Track if we've already set up observer
      if (window.__ff_observer_setup) return;
      window.__ff_observer_setup = true;

      console.log('FightCapture: Attack result page detected at', location.href);

      // Process after a delay to let page load
      setTimeout(() => processAttackResult(), 3000);

      // Also observe for late-loading content, but with limited retries
      let retryCount = 0;
      const observer = new MutationObserver(() => {
        if (retryCount < 2 && !_processedThisPage) {
          retryCount++;
          setTimeout(() => processAttackResult(), 1000);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Stop observing after 15 seconds
      setTimeout(() => observer.disconnect(), 15000);
    }

    return {
      storePendingAttack,
      getPendingAttack,
      clearPendingAttack,
      isAttackResultPage,
      isAttackLogPage,
      parseAttackOutcome,
      processAttackResult,
      setupAttackPageObserver,
      parseAttackLogEntries
    };
  })();

// ============================================================================
// ATK SCOUTER v1.8.0 - RSI CACHE MODULE
// Standalone module for persistent RSI caching with IndexedDB
// INSERT THIS MODULE AFTER LINE 2227 (after FightCapture) and BEFORE ApiManager
// ============================================================================

// ============================================================================
// API BUDGET TRACKER
// ============================================================================

const APIBudgetTracker = (() => {
  const limit = 100;           // Per minute
  const window = 60000;        // 1 minute in ms
  let calls = [];              // Array of timestamps

  return {
    canMakeCall() {
      const now = Date.now();
      calls = calls.filter(t => now - t < window);
      return calls.length < limit;
    },

    getRemainingBudget() {
      const now = Date.now();
      calls = calls.filter(t => now - t < window);
      return limit - calls.length;
    },

    getUsedBudget() {
      const now = Date.now();
      calls = calls.filter(t => now - t < window);
      return calls.length;
    },

    recordCall() {
      calls.push(Date.now());
    },

    getStats() {
      const now = Date.now();
      calls = calls.filter(t => now - t < window);
      return {
        limit: limit,
        used: calls.length,
        remaining: limit - calls.length,
        percentage: Math.round((calls.length / limit) * 100)
      };
    }
  };
})();

// ============================================================================
// RSI CACHE MANAGER (IndexedDB persistent storage)
// ============================================================================

const RSICacheManager = (() => {
  let db = null;
  let isInitialized = false;
  let refreshQueue = [];
  let isProcessingQueue = false;

  // Cache statistics
  let stats = {
    totalHits: 0,
    totalMisses: 0,
    totalRefreshes: 0,
    apiCallsSaved: 0
  };

  // Load stats from localStorage
  const savedStats = Env.getValue('rsiCacheStats', null);
  if (savedStats) {
    stats = savedStats;
  }

  function saveStats() {
    Env.setValue('rsiCacheStats', stats);
  }

  /**
   * Initialize IndexedDB
   */
  async function init() {
    if (isInitialized) return true;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(RSI_CACHE_DB_NAME, RSI_CACHE_DB_VERSION);

      request.onerror = () => {
        console.error('RSI Cache: Failed to open IndexedDB', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        db = request.result;
        isInitialized = true;
        console.log('RSI Cache: IndexedDB initialized successfully');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        // Create object store if it doesn't exist
        if (!database.objectStoreNames.contains(RSI_CACHE_STORE_NAME)) {
          const objectStore = database.createObjectStore(RSI_CACHE_STORE_NAME, { keyPath: 'userId' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('refreshPriority', 'refreshPriority', { unique: false });
          console.log('RSI Cache: Created object store');
        }
      };
    });
  }

  /**
   * Get cache confidence level based on age
   */
  function getCacheConfidence(timestamp) {
    const age = Date.now() - timestamp;
    if (age < CACHE_TIERS.FRESH) return 'high';
    if (age < CACHE_TIERS.MODERATE) return 'medium';
    return 'low';
  }

  /**
   * Get cached RSI data for a user
   */
  async function get(userId) {
    if (!settings.rsiCacheEnabled) return null;
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      const request = objectStore.get(parseInt(userId, 10));

      request.onsuccess = () => {
        const data = request.result;
        
        if (!data) {
          stats.totalMisses++;
          saveStats();
          resolve(null);
          return;
        }

        // Check if expired
        const age = Date.now() - data.timestamp;
        if (age > CACHE_TIERS.STALE) {
          stats.totalMisses++;
          saveStats();
          // Delete expired entry
          deleteEntry(userId);
          resolve(null);
          return;
        }

        // Cache hit!
        stats.totalHits++;
        stats.apiCallsSaved++;
        saveStats();

        // Queue for background refresh if stale
        if (settings.rsiCacheBackgroundRefresh && age > CACHE_TIERS.MODERATE) {
          queueBackgroundRefresh(userId, data.refreshPriority || REFRESH_PRIORITY.RANDOM_BOUNTY);
        }

        resolve(data);
      };

      request.onerror = () => {
        console.error('RSI Cache: Error reading from cache', request.error);
        resolve(null);
      };
    });
  }

  /**
   * Store RSI data in cache
   */
  async function set(userId, apiData, priority = REFRESH_PRIORITY.RANDOM_BOUNTY) {
    if (!settings.rsiCacheEnabled) return;
    if (!isInitialized) await init();

    // Calculate RSI from API data
    const rsi = calcRSI(USER_BP, apiData.personalstats, apiData.basic, apiData.life);

    const cacheEntry = {
      userId: parseInt(userId, 10),
      timestamp: Date.now(),
      
      // Raw API data
      personalstats: apiData.personalstats,
      basic: apiData.basic,
      life: apiData.life,
      profile: apiData.profile,
      name: apiData.name || apiData.basic?.name,
      level: apiData.level || apiData.basic?.level,
      
      // Pre-calculated RSI values
      rsiRaw: rsi.raw,
      rsiAdjusted: rsi.adjusted,
      woundPenalty: rsi.woundPenalty,
      boost: rsi.boost,
      lifeRatio: rsi.lifeRatio,
      oppBP: rsi.oppBP,
      
      // Metadata
      viewCount: 1,
      lastFoughtTimestamp: 0,
      refreshPriority: priority
    };

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      
      // Get existing entry to preserve view count and last fought
      const getRequest = objectStore.get(parseInt(userId, 10));
      
      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (existing) {
          cacheEntry.viewCount = (existing.viewCount || 0) + 1;
          cacheEntry.lastFoughtTimestamp = existing.lastFoughtTimestamp || 0;
        }
        
        const putRequest = objectStore.put(cacheEntry);
        
        putRequest.onsuccess = () => {
          resolve(true);
        };
        
        putRequest.onerror = () => {
          console.error('RSI Cache: Error storing in cache', putRequest.error);
          resolve(false);
        };
      };
    });
  }

  /**
   * Update last fought timestamp (for priority calculation)
   */
  async function updateLastFought(userId) {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      const request = objectStore.get(parseInt(userId, 10));

      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          data.lastFoughtTimestamp = Date.now();
          data.refreshPriority = REFRESH_PRIORITY.RECENT_TARGET;
          objectStore.put(data);
        }
        resolve();
      };

      request.onerror = () => resolve();
    });
  }

  /**
   * Delete a single cache entry
   */
  async function deleteEntry(userId) {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      const request = objectStore.delete(parseInt(userId, 10));

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  /**
   * Clear entire cache
   */
  async function clearAll() {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('RSI Cache: All entries cleared');
        // Reset stats
        stats = {
          totalHits: 0,
          totalMisses: 0,
          totalRefreshes: 0,
          apiCallsSaved: 0
        };
        saveStats();
        resolve(true);
      };

      request.onerror = () => {
        console.error('RSI Cache: Error clearing cache', request.error);
        resolve(false);
      };
    });
  }

  /**
   * Get cache statistics
   */
  async function getStats() {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([RSI_CACHE_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(RSI_CACHE_STORE_NAME);
      const countRequest = objectStore.count();

      countRequest.onsuccess = () => {
        const totalPlayers = countRequest.result;
        
        // Get oldest entry
        const cursorRequest = objectStore.index('timestamp').openCursor();
        let oldestTimestamp = null;

        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            oldestTimestamp = cursor.value.timestamp;
          }

          const totalCalls = stats.totalHits + stats.totalMisses;
          const hitRate = totalCalls > 0 ? ((stats.totalHits / totalCalls) * 100).toFixed(1) : '0.0';
          
          let oldestAge = 'None';
          if (oldestTimestamp) {
            const age = Date.now() - oldestTimestamp;
            const days = Math.floor(age / (24 * 60 * 60 * 1000));
            const hours = Math.floor((age % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            if (days > 0) {
              oldestAge = `${days}d ${hours}h`;
            } else {
              oldestAge = `${hours}h`;
            }
          }

          resolve({
            totalPlayers,
            cacheHitRate: hitRate + '%',
            apiCallsSaved: stats.apiCallsSaved,
            oldestEntry: oldestAge,
            totalHits: stats.totalHits,
            totalMisses: stats.totalMisses,
            refreshQueueSize: refreshQueue.length
          });
        };

        cursorRequest.onerror = () => {
          resolve({
            totalPlayers,
            cacheHitRate: '0%',
            apiCallsSaved: stats.apiCallsSaved,
            oldestEntry: 'Error',
            totalHits: stats.totalHits,
            totalMisses: stats.totalMisses,
            refreshQueueSize: refreshQueue.length
          });
        };
      };

      countRequest.onerror = () => {
        resolve({
          totalPlayers: 0,
          cacheHitRate: '0%',
          apiCallsSaved: 0,
          oldestEntry: 'Error',
          totalHits: 0,
          totalMisses: 0,
          refreshQueueSize: 0
        });
      };
    });
  }

  /**
   * Queue a user for background refresh
   */
  function queueBackgroundRefresh(userId, priority = REFRESH_PRIORITY.RANDOM_BOUNTY) {
    // Don't queue if already in queue
    if (refreshQueue.some(item => item.userId === userId)) {
      return;
    }

    refreshQueue.push({
      userId: parseInt(userId, 10),
      priority,
      timestamp: Date.now()
    });

    // Sort queue by priority
    refreshQueue.sort((a, b) => a.priority - b.priority);

    // Start processing if not already running
    if (!isProcessingQueue) {
      processRefreshQueue();
    }
  }

  /**
   * Process background refresh queue
   */
  async function processRefreshQueue() {
    if (isProcessingQueue || refreshQueue.length === 0) {
      return;
    }

    isProcessingQueue = true;

    while (refreshQueue.length > 0) {
      // Check if we have API budget
      const remaining = APIBudgetTracker.getRemainingBudget();
      if (remaining < 10) {
        // Wait if budget is low
        console.log('RSI Cache: Pausing background refresh - low API budget');
        await new Promise(resolve => setTimeout(resolve, 10000));
        continue;
      }

      const item = refreshQueue.shift();
      
      try {
        // Fetch fresh data from API
        await new Promise((resolve) => {
          ApiManager.get(`/user/${item.userId}?selections=personalstats,basic,profile`, async (data) => {
            if (data && !data.error) {
              await set(item.userId, data, item.priority);
              stats.totalRefreshes++;
              saveStats();
              console.log(`RSI Cache: Background refresh completed for user ${item.userId}`);
            }
            resolve();
          });
        });

        // Small delay between refreshes
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.error('RSI Cache: Background refresh error', e);
      }
    }

    isProcessingQueue = false;
  }

  /**
   * Batch get multiple users (for faction pages)
   */
  async function batchGet(userIds) {
    if (!isInitialized) await init();

    const results = {};
    const promises = userIds.map(async (userId) => {
      const data = await get(userId);
      if (data) {
        results[userId] = data;
      }
    });

    await Promise.all(promises);
    return results;
  }

  // Initialize on load
  init().catch(e => console.error('RSI Cache: Init error', e));

  return {
    init,
    get,
    set,
    deleteEntry,
    clearAll,
    getStats,
    getCacheConfidence,
    updateLastFought,
    queueBackgroundRefresh,
    batchGet
  };
})();


// ============================================================================
// STATUS CACHE MANAGER (NEW - Short-term status caching)
// ============================================================================

const StatusCacheManager = (() => {
  let db = null;
  let isInitialized = false;
  const STATUS_CACHE_TTL = 180 * 1000; // 3 minutes (matches refresh interval)
  const STATUS_CACHE_DB_NAME = 'ATKScouterStatusCache';
  const STATUS_CACHE_DB_VERSION = 1;
  const STATUS_CACHE_STORE_NAME = 'statusData';

  // Queue for background status fetches
  let statusQueue = [];
  let isProcessingStatusQueue = false;

  /**
   * Initialize Status Cache DB
   */
  async function init() {
    if (isInitialized) return true;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(STATUS_CACHE_DB_NAME, STATUS_CACHE_DB_VERSION);

      request.onerror = () => {
        console.error('Status Cache: Failed to open IndexedDB', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        db = request.result;
        isInitialized = true;
        console.log('Status Cache: IndexedDB initialized');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        if (!database.objectStoreNames.contains(STATUS_CACHE_STORE_NAME)) {
          const objectStore = database.createObjectStore(STATUS_CACHE_STORE_NAME, { keyPath: 'userId' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('hasActiveStatus', 'hasActiveStatus', { unique: false });
          console.log('Status Cache: Created object store');
        }
      };
    });
  }

  /**
   * Check if player has active status (traveling or in hospital)
   */
  function hasActiveStatus(statusData) {
    if (!statusData) return false;
    
    const status = statusData.status;
    const travel = statusData.travel;
    
    // Check status.state first (most reliable indicator from profile selection)
    if (status && status.state) {
      const state = status.state;
      
      // Hospital
      if (state === 'Hospital') return true;
      
      // Traveling/Abroad
      if (state === 'Traveling' || state === 'Abroad') return true;
      
      // Jail/Federal
      if (state === 'Jail' || state === 'Federal') return true;
    }
    
    // Fallback: Check travel object (in case it's available)
    if (travel && travel.time_left > 0) return true;
    
    return false;
  }

  /**
   * Get cached status for a user
   */
  async function get(userId) {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const request = objectStore.get(parseInt(userId, 10));

      request.onsuccess = () => {
        const data = request.result;
        
        if (!data) {
          resolve(null);
          return;
        }

        // Check if expired
        const age = Date.now() - data.timestamp;
        if (age > STATUS_CACHE_TTL) {
          deleteEntry(userId);
          resolve(null);
          return;
        }

        resolve(data);
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  }

  /**
   * Store status data (only if player has active status)
   */
  async function set(userId, apiData) {
    if (!isInitialized) await init();

    // Extract status data from API response
    // When using profile selection, status is in data.status
    const statusData = {
      status: apiData.status,
      travel: apiData.travel,
      timestamp: apiData.timestamp || (apiData.last_action ? apiData.last_action.timestamp : Date.now() / 1000)
    };

    const hasStatus = hasActiveStatus(statusData);

    // Debug logging
    console.log(`Status Cache: User ${userId} status check:`, {
      state: statusData.status?.state,
      hasStatus: hasStatus,
      travel_time_left: statusData.travel?.time_left,
      hospital_until: statusData.status?.until
    });

    // Only cache if player has active status
    if (!hasStatus) {
      // Remove from cache if they no longer have status
      await deleteEntry(userId);
      console.log(`Status Cache: User ${userId} has no active status - removed from cache`);
      return false;
    }

    const cacheEntry = {
      userId: parseInt(userId, 10),
      timestamp: Date.now(),
      status: statusData.status,
      travel: statusData.travel,
      apiTimestamp: statusData.timestamp,
      hasActiveStatus: true
    };

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const putRequest = objectStore.put(cacheEntry);
      
      putRequest.onsuccess = () => {
        console.log(`Status Cache: ✓ STORED user ${userId}:`, {
          state: statusData.status?.state,
          destination: statusData.travel?.destination,
          hasStatus: hasActiveStatus(statusData)
        });
        resolve(true);
      };
      
      putRequest.onerror = () => {
        resolve(false);
      };
    });
  }

  /**
   * Delete a status cache entry
   */
  async function deleteEntry(userId) {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const request = objectStore.delete(parseInt(userId, 10));

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  /**
   * Get all users who recently had active status
   */
  async function getUsersWithRecentStatus() {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const request = objectStore.getAll(); // Get all, we'll filter manually

      request.onsuccess = () => {
        const results = request.result || [];
        // Filter to only entries with hasActiveStatus === true
        const activeUsers = results.filter(entry => entry.hasActiveStatus === true);
        const userIds = activeUsers.map(entry => entry.userId);
        console.log(`Status Cache: Found ${userIds.length} users with recent status`);
        resolve(userIds);
      };

      request.onerror = () => {
        console.error('Status Cache: Error getting users with recent status');
        resolve([]);
      };
    });
  }

  /**
   * Queue users for background status check
   */
  function queueStatusCheck(userIds) {
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    userIds.forEach(userId => {
      if (!statusQueue.some(id => id === userId)) {
        statusQueue.push(parseInt(userId, 10));
      }
    });

    // Start processing
    if (!isProcessingStatusQueue) {
      processStatusQueue();
    }
  }

  /**
   * Process background status check queue
   */
  async function processStatusQueue() {
    if (isProcessingStatusQueue || statusQueue.length === 0) {
      return;
    }

    isProcessingStatusQueue = true;
    console.log(`Status Cache: Processing queue (${statusQueue.length} users)`);

    while (statusQueue.length > 0) {
      // Check API budget
      const remaining = APIBudgetTracker.getRemainingBudget();
      if (remaining < 20) {
        console.log('Status Cache: Pausing - low API budget');
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }

      // Process in batch of 10
      const batch = statusQueue.splice(0, 10);
      
      await Promise.all(batch.map(userId => {
        return new Promise((resolve) => {
          // Lightweight API call - only status, travel, timestamp
          // Use profile selection which includes status, travel, timestamp
          ApiManager.get(`/user/${userId}?selections=profile`, async (data) => {
            if (data && !data.error) {
              await set(userId, data);
              
              // Update UI if this user is visible
              updateStatusIndicatorsForUser(userId, data);
            }
            resolve();
          });
        });
      }));

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    isProcessingStatusQueue = false;
    console.log('Status Cache: Queue processing complete');
    
    // Debug: dump cache contents to verify what was stored
    debugDump();
  }

  /**
   * Update status indicators for a specific user in the DOM
   */
  function updateStatusIndicatorsForUser(userId, statusData) {
    console.log(`[updateStatusIndicatorsForUser] Updating UI for user ${userId}`);
    
    // Find all elements for this user
    const elements = document.querySelectorAll(`[data-user-id="${userId}"]`);
    
    if (elements.length === 0) {
      console.log(`[updateStatusIndicatorsForUser] No elements found for user ${userId}`);
      return;
    }
    
    elements.forEach(el => {
      // Use the existing addStatusIcon function which properly handles all status types
      addStatusIcon(statusData, el, userId);
    });
  }

  /**
   * Clear entire status cache
   */
  async function clearAll() {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('Status Cache: Cleared all entries');
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  }

  /**
   * Debug function - dump all cache entries to console
   */
  async function debugDump() {
    if (!isInitialized) await init();

    return new Promise((resolve) => {
      const transaction = db.transaction([STATUS_CACHE_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STATUS_CACHE_STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const entries = request.result || [];
        console.log(`===== STATUS CACHE DEBUG DUMP (${entries.length} entries) =====`);
        if (entries.length === 0) {
          console.log('No entries in cache');
        } else {
          entries.forEach(entry => {
            const age = Math.floor((Date.now() - entry.timestamp) / 1000);
            console.log(`User ${entry.userId}: ${entry.status?.state} at ${entry.travel?.destination || 'N/A'} (${age}s old)`);
          });
        }
        console.log('====================================================');
        resolve(entries);
      };

      request.onerror = () => {
        console.error('Failed to dump cache');
        resolve([]);
      };
    });
  }

  // Initialize on load
  init().catch(e => console.error('Status Cache: Init error', e));

  return {
    init,
    get,
    set,
    deleteEntry,
    clearAll,
    getUsersWithRecentStatus,
    queueStatusCheck,
    hasActiveStatus,
    debugDump
  };
})();


/**
 * Last Check Cache Manager
 * Tracks when we last checked each user's status (even "Okay" users)
 * This prevents unnecessary refreshes on page reload
 */
const LastCheckCacheManager = (() => {
  const CACHE_KEY_PREFIX = 'ff_last_status_check_';
  const CHECK_INTERVAL = 180000; // 3 minutes
  
  function set(userId) {
    try {
      localStorage.setItem(CACHE_KEY_PREFIX + userId, Date.now().toString());
    } catch (e) {
      console.warn('LastCheckCache: Failed to set', e);
    }
  }
  
  function get(userId) {
    try {
      const timestamp = localStorage.getItem(CACHE_KEY_PREFIX + userId);
      return timestamp ? parseInt(timestamp, 10) : 0;
    } catch (e) {
      console.warn('LastCheckCache: Failed to get', e);
      return 0;
    }
  }
  
  function shouldCheck(userId) {
    const lastCheck = get(userId);
    const timeSinceCheck = Date.now() - lastCheck;
    return timeSinceCheck > CHECK_INTERVAL;
  }
  
  function getTimeSinceCheck(userId) {
    const lastCheck = get(userId);
    if (!lastCheck) return 999999;
    return Date.now() - lastCheck;
  }
  
  function clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('LastCheckCache: Cleared all entries');
    } catch (e) {
      console.warn('LastCheckCache: Failed to clear', e);
    }
  }
  
  return {
    set,
    get,
    shouldCheck,
    getTimeSinceCheck,
    clearAll,
    CHECK_INTERVAL
  };
})();



  // ============================================================================
  // API LAYER (with cache eviction)
  // ============================================================================

  const ApiManager = (() => {
    const cache = new Map();
    const queue = [];
    const inFlight = new Map();
    let active = 0;
    let lastStart = 0;
    let timer = null;
    let errorShown = false;

    function evictOldEntries() {
      if (cache.size <= API_CACHE_MAX_SIZE) return;
      const entries = [...cache.entries()]
        .sort((a, b) => a[1].ts - b[1].ts);
      const toRemove = entries.slice(0, Math.floor(cache.size * 0.25));
      toRemove.forEach(([key]) => cache.delete(key));
    }

    function showBanner(text) {
      let el = document.getElementById('ff-api-warning');
      if (!el) {
        el = document.createElement('div');
        el.id = 'ff-api-warning';
        document.body.appendChild(el);
      }
      el.textContent = text + ' (click to hide)';
      el.onclick = () => el.style.display = 'none';
      el.style.display = 'block';
    }

    function drainQueue() {
      if (!queue.length || active >= API_MAX_ACTIVE) return;

      const now = Date.now();
      const wait = API_MIN_DELAY - (now - lastStart);
      if (wait > 0) {
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            drainQueue();
          }, wait);
        }
        return;
      }

      const item = queue.shift();
      if (!item) return;
      const { ep, cbs } = item;

      inFlight.set(ep, cbs);
      active++;
      lastStart = now;

      Env.httpRequest({
        method: 'GET',
        url: `https://api.torn.com${ep}&key=${API_KEY}`,
        onload: async r => {
          active--;
          const callbacks = inFlight.get(ep) || cbs;
          inFlight.delete(ep);

          try {
            const data = JSON.parse(r.responseText);
            if (!data.error) {
              cache.set(ep, { data, ts: Date.now() });
              evictOldEntries();
              
              // Store in RSI cache
              const userMatch = ep.match(/^\/user\/(\d+)\?selections=personalstats,basic/);
              if (userMatch && settings.rsiCacheEnabled) {
                const userId = userMatch[1];
                await RSICacheManager.set(userId, data, REFRESH_PRIORITY.RANDOM_BOUNTY);
                console.log(`RSI Cache: Stored user ${userId}`);
              }
              
              callbacks.forEach(fn => { try { fn(data); } catch (e) { console.error(e); } });
            } else {
              console.error('Torn API error', data.error);
              if (!errorShown) {
                errorShown = true;
                let msg = `ATK Scouter: Torn API error ${data.error.code} — ${data.error.error}`;
                if (data.error.code === 1 || data.error.code === 2) {
                  msg = 'ATK Scouter: Your Torn API key is invalid or lacks required permissions. Open the ⚙️ settings and verify the key.';
                } else if (data.error.code === 5) {
                  msg = 'ATK Scouter: Torn API rate limit reached. Some data may be delayed.';
                }
                showBanner(msg);
              }
            }
          } catch (e) {
            console.error('Torn API parse error', e);
          }
          drainQueue();
        },
        onerror: err => {
          active--;
          inFlight.delete(ep);
          console.error('Torn API request failed', err);
          drainQueue();
        }
      });
    }

    return {
      async get(ep, cb) {
        if (!API_KEY) return;

        // Check RSI cache first for user API calls
        const userMatch = ep.match(/^\/user\/(\d+)\?selections=personalstats,basic/);
        if (userMatch && settings.rsiCacheEnabled) {
          const userId = userMatch[1];
          const cached = await RSICacheManager.get(userId);
          if (cached) {
            console.log(`RSI Cache: HIT for user ${userId}`);
            try { cb(cached); } catch (e) { console.error(e); }
            return;
          }
        }

        // Record API call
        APIBudgetTracker.recordCall();

        const now = Date.now();
        const ttl = /selections=basic/.test(ep) ? API_CACHE_TTL_BASIC : API_CACHE_TTL_DEFAULT;
        const cached = cache.get(ep);

        if (cached && now - cached.ts < ttl) {
          try { cb(cached.data); } catch (e) { console.error(e); }
          return;
        }

        const pending = inFlight.get(ep);
        if (pending) {
          pending.push(cb);
          return;
        }

        queue.push({ ep, cbs: [cb] });
        drainQueue();
      },

      clearCache() {
        cache.clear();
      }
    };
  })();

  // ============================================================================
  // RSI CALCULATION
  // ============================================================================

  /**
   * Calculates battle power components and total
   */
  function calcBattlePower(personalStats, basic) {
    const ps = personalStats || {};
    const b = basic || {};

    const elo = (ps.elo || 0) * 2;
    const dmg = Math.sqrt((ps.attackdamage || 0) / 1000) * 1.5;
    const winDiff = Math.max((ps.attackswon || 0) - (ps.attackslost || 0), 0);
    const win = Math.sqrt(winDiff) * 1.2;

    const totalAttacks = (ps.attackswon || 0) + (ps.attackslost || 0);
    const winRate = totalAttacks > 0 ? (ps.attackswon / totalAttacks) * 100 : 0;
    const critRate = ps.attackhits > 0 ? ((ps.attackcriticalhits || 0) / ps.attackhits) * 100 : 0;
    const networth = Math.log10((ps.networth || 0) + 1) * 5;

    const now = Date.now() / 1000;
    const joined = b.joined || now;
    const ageDays = (now - joined) / 86400;
    const age = Math.log10(ageDays + 1) * 5;
    const activity = Math.log10((ps.useractivity || 0) + 1) * 2;

    const parts = { elo, dmg, win, winRate, critRate, networth, age, activity };
    const sum = elo + dmg + win + winRate + critRate + networth + age + activity;

    return { parts, sum };
  }

  /**
   * Calculates RSI percentage
   */
  function calcRSI(userBP, oppPersonalStats, oppBasic, oppLife) {
    const oppCalc = calcBattlePower(oppPersonalStats, oppBasic);
    const oppBP = oppCalc.sum * getGymMultiplier(oppPersonalStats?.xantaken || 0);

    const raw = (userBP / oppBP) * 100;
    const lifeRatio = (oppLife?.current && oppLife?.maximum)
      ? oppLife.current / oppLife.maximum
      : 1;
    const woundPenalty = 1 - lifeRatio;
    const fairness = Math.min(raw / 100, 1);
    const boost = woundPenalty * settings.lifeWeight * fairness;
    const adjusted = raw * (1 + boost);

    return {
      raw,
      adjusted,
      woundPenalty,
      boost,
      lifeRatio,
      oppBP,
      oppCalc
    };
  }

  // ============================================================================
  // TOOLTIP MANAGER
  // ============================================================================

  const Tooltip = (() => {
    let element = null;

    function getElement() {
      if (!element) {
        element = document.createElement('div');
        element.className = 'ff-tooltip-viewport';
        document.body.appendChild(element);
      }
      return element;
    }

    return {
      show(pageX, pageY, html) {
        const tt = getElement();
        tt.innerHTML = html;  // Already sanitized by caller
        requestAnimationFrame(() => {
          const rect = tt.getBoundingClientRect();
          let left = pageX - rect.width / 2;
          left = Math.max(4, Math.min(left, document.documentElement.clientWidth - rect.width - 4));
          const top = pageY - rect.height - 12;
          tt.style.left = left + 'px';
          tt.style.top = top + 'px';
          tt.style.display = 'block';
        });
      },

      hide() {
        if (element) element.style.display = 'none';
      }
    };
  })();

  // ============================================================================
  // USER STATE
  // ============================================================================

  let ME_STATS = null;
  let ME_DRUGS = null;
  let USER_BP = null;
  let USER_DRUG_DEBUFF = 0;

  // Global references for RSI+ panel
  window.__FF_ME_STATS_OBJ = null;
  window.__FF_LAST_PROFILE_OBJ = null;

  function initUserState() {
    ApiManager.get('/user/?selections=personalstats,basic', d => {
      ME_STATS = d;
      window.__FF_ME_STATS_OBJ = d;
      tryInitComplete();
    });
    ApiManager.get('/user/?selections=battlestats', d => {
      ME_DRUGS = d;
      tryInitComplete();
    });
  }

  function tryInitComplete() {
    if (!ME_STATS || !ME_DRUGS) return;

    const modifiers = [
      ME_DRUGS.strength_modifier,
      ME_DRUGS.defense_modifier,
      ME_DRUGS.speed_modifier,
      ME_DRUGS.dexterity_modifier
    ];

    const negatives = modifiers
      .filter(x => typeof x === 'number' && x < 0)
      .map(x => -x / 100);

    USER_DRUG_DEBUFF = negatives.length
      ? negatives.reduce((a, c) => a + c, 0) / negatives.length
      : 0;

    const userCalc = calcBattlePower(ME_STATS.personalstats, ME_STATS.basic);
    USER_BP = userCalc.sum
      * getGymMultiplier(ME_STATS.personalstats?.xantaken || 0)
      * (1 - USER_DRUG_DEBUFF * settings.drugWeight);

    // Start injection after user state is ready
    ObserverManager.start();

    // Start Bounty Sniper if enabled
    if (settings.sniperEnabled && API_KEY) {
      // Small delay to let page settle
      setTimeout(() => {
        BountySniper.start();
      }, 2000);
    }

    // Start Jail Bust Sniper if enabled
    if (settings.bustSniperEnabled) {
      // Small delay to let page settle
      setTimeout(() => {
        JailBustSniper.start();
      }, 2500);
    }
  }

  // ============================================================================
  // RSI+ EXPERIMENTAL PANEL
  // ============================================================================

  function buildRSIPlusPanel(headerEl, meStatsObj, oppObj) {
    try {
      if (!headerEl || document.getElementById('ff-exp-panel')) return;
      if (!meStatsObj || !oppObj) return;

      const mePS = meStatsObj.personalstats || {};
      const meB = meStatsObj.basic || {};
      const oppPS = oppObj.personalstats || {};
      const oppB = oppObj.basic || oppObj.profile || {};

      const me = calcBattlePower(mePS, meB);
      const op = calcBattlePower(oppPS, oppB);

      const meGymMul = getGymMultiplier(mePS.xantaken || 0);
      const meDrugMul = 1 - USER_DRUG_DEBUFF * settings.drugWeight;
      const opGymMul = getGymMultiplier(oppPS.xantaken || 0);

      const keys = ['elo', 'dmg', 'win', 'winRate', 'critRate', 'networth', 'age', 'activity'];
      const nameMap = {
        elo: 'ELO×2',
        dmg: '√Damage×1.5',
        win: '√(W−L)×1.2',
        winRate: 'Win%×100',
        critRate: 'Crit%×100',
        networth: 'log₁₀(NW+1)×5',
        age: 'log Age×5',
        activity: 'log Activity×2'
      };

      const efficiencies = keys.map(k => {
        const you = me.parts[k] * meGymMul * meDrugMul;
        const opp = op.parts[k] * opGymMul;
        return { key: k, you, opp, delta: you - opp };
      }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

      const oppBP = op.sum * opGymMul;
      const yourBP = (typeof USER_BP === 'number' && USER_BP > 0)
        ? USER_BP
        : (me.sum * meGymMul * meDrugMul);

      const raw = (yourBP / oppBP) * 100;
      const life = (oppObj.life?.maximum)
        ? oppObj.life.current / oppObj.life.maximum
        : 1;
      const wp = 1 - life;
      const fair = Math.min(raw / 100, 1);
      const boost = wp * settings.lifeWeight * fair;
      const adj = raw * (1 + boost);

      // Win Chance model: logistic regression on RSI
      let theta0 = Number(Env.getValue('ff_lrsi_theta0', 0));
      let theta1 = Number(Env.getValue('ff_lrsi_theta1', 0.12));
      const xRaw = raw - 100;
      const pWin = 1 / (1 + Math.exp(-(theta0 + theta1 * xRaw)));

      const top3 = efficiencies.slice(0, 3).map(r => {
        const sign = r.delta >= 0 ? '+' : '−';
        return `${nameMap[r.key]} ${sign}${Math.abs(r.delta).toFixed(1)}`;
      }).join(' · ');

      const wrap = document.createElement('details');
      wrap.id = 'ff-exp-panel';
      wrap.open = false;
      wrap.style.cssText = 'margin-top:6px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px 10px;color:#e6e6e6;';

      const summary = document.createElement('summary');
      summary.textContent = 'RSI+ Details';
      summary.style.cssText = 'cursor:pointer;color:#e6e6e6;font-weight:600;font-size:12px;';
      wrap.appendChild(summary);

      const div = document.createElement('div');
      div.innerHTML = `
        <div style="margin-top:6px;font-size:12px;line-height:1.35">
          <div style="margin-bottom:6px;">
            <b>Adjusted RSI:</b> ${adj.toFixed(2)}%
            <span style="margin-left:10px;"><b>Win Chance (Learned):</b> <span id="ff-lrsi-value">${(pWin * 100).toFixed(1)}%</span></span>
            <span id="ff-lrsi-msg" class="ff-note"></span>
          </div>
          <div class="ff-lrsi-controls">
            <b>Learning controls:</b>
            θ<sub>0</sub>=<span id="ff-theta0"></span>, θ<sub>1</sub>=<span id="ff-theta1"></span>
            <span class="ff-note" id="ff-lrsi-n"></span>
            <span class="ff-mini-btn" id="ff-softer">Softer</span>
            <span class="ff-mini-btn" id="ff-steeper">Steeper</span>
            <span class="ff-mini-btn" id="ff-reset">Reset</span>
            <span class="ff-mini-btn" id="ff-refit">Re-fit (from log)</span>
            <span class="ff-mini-btn" id="ff-clear">Clear log</span>
            <span class="ff-mini-btn" id="ff-logwin">Log Win</span>
            <span class="ff-mini-btn" id="ff-logloss">Log Loss</span>
          </div>
          <div style="margin-top:6px;opacity:.9;"><b>Top drivers:</b> ${escapeHtml(top3)}</div>
          <div style="opacity:.8;">Raw: ${raw.toFixed(2)}% · Wound boost: ${(boost * 100).toFixed(1)}% · Life: ${(life * 100).toFixed(0)}%</div>
          <table style="width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;color:#e6e6e6;margin-top:6px;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,.1)">
                <th style="text-align:left;padding:4px 2px">Term</th>
                <th style="text-align:right;padding:4px 2px">You</th>
                <th style="text-align:right;padding:4px 2px">Target</th>
                <th style="text-align:right;padding:4px 2px">Δ</th>
              </tr>
            </thead>
            <tbody>
              ${efficiencies.map(r => `<tr>
                <td style="padding:3px 2px;opacity:.9;color:#e6e6e6">${escapeHtml(nameMap[r.key])}</td>
                <td style="padding:3px 2px;text-align:right;color:#e6e6e6">${r.you.toFixed(1)}</td>
                <td style="padding:3px 2px;text-align:right;color:#e6e6e6">${r.opp.toFixed(1)}</td>
                <td style="padding:3px 2px;text-align:right;color:${r.delta >= 0 ? '#9ccc65' : '#ef5350'}">${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(1)}</td>
              </tr>`).join('')}
              <tr style="border-top:1px dotted rgba(255,255,255,.15)">
                <td style="padding:4px 2px"><span class="ff-chip-label">Gym × Drug multipliers applied</span></td>
                <td style="padding:4px 2px;text-align:right;opacity:.9;color:#e6e6e6">× ${(meGymMul * meDrugMul).toFixed(3)}</td>
                <td style="padding:4px 2px;text-align:right;opacity:.9;color:#e6e6e6">× ${opGymMul.toFixed(3)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>`;
      wrap.appendChild(div);
      headerEl.insertAdjacentElement('afterend', wrap);

      // Wire up trainer controls
      setupTrainerControls(wrap, raw);
    } catch (e) {
      console.error('RSI+ Panel error:', e);
    }
  }

  function setupTrainerControls(wrap, rawRSI) {
    const load = () => ({
      t0: Number(Env.getValue('ff_lrsi_theta0', 0)),
      t1: Number(Env.getValue('ff_lrsi_theta1', 0.12)),
      meta: Env.getValue('ff_lrsi_meta', { n: 0, ts: 0 }) || { n: 0, ts: 0 },
      hist: Env.getValue('ff_lrsi_hist', []) || []
    });

    const saveTheta = (t0, t1) => {
      Env.setValue('ff_lrsi_theta0', t0);
      Env.setValue('ff_lrsi_theta1', t1);
    };

    const saveHist = hist => {
      Env.setValue('ff_lrsi_hist', hist);
      Env.setValue('ff_lrsi_meta', { n: hist.length, ts: Date.now() });
    };

    const addSample = (hist, rsi, won) => {
      const now = Date.now();
      const ninetyDays = 90 * 24 * 3600 * 1000;
      const pruned = (hist || []).filter(h => now - h.ts <= ninetyDays);
      pruned.push({ ts: now, rsi: Number(rsi) || 0, y: won ? 1 : 0 });
      while (pruned.length > 500) pruned.shift();
      saveHist(pruned);
      return pruned;
    };

    const refit = hist => {
      if (!hist?.length) return null;
      let t0 = 0;
      let t1 = Number(Env.getValue('ff_lrsi_theta1', 0.12));
      const lr = 1e-3, reg = 1e-4, iters = 250;

      for (let it = 0; it < iters; it++) {
        let g0 = 0, g1 = 0;
        for (const h of hist) {
          const x = h.rsi - 100;
          const z = t0 + t1 * x;
          const p = 1 / (1 + Math.exp(-z));
          const e = p - (h.y ? 1 : 0);
          g0 += e;
          g1 += e * x;
        }
        g0 += reg * t0;
        g1 += reg * t1;
        t0 -= lr * g0;
        t1 -= lr * g1;
      }
      saveTheta(t0, t1);
      return { t0, t1 };
    };

    const t0El = wrap.querySelector('#ff-theta0');
    const t1El = wrap.querySelector('#ff-theta1');
    const nEl = wrap.querySelector('#ff-lrsi-n');
    const valEl = wrap.querySelector('#ff-lrsi-value');
    const msgEl = wrap.querySelector('#ff-lrsi-msg');

    const flash = msg => {
      if (!msgEl) return;
      msgEl.textContent = ` · ${msg}`;
      setTimeout(() => {
        if (msgEl.textContent === ` · ${msg}`) msgEl.textContent = '';
      }, 2000);
    };

    const showTheta = () => {
      const cur = load();
      if (t0El) t0El.textContent = cur.t0.toFixed(3);
      if (t1El) t1El.textContent = cur.t1.toFixed(3);
      if (nEl) nEl.textContent = ` · samples: ${cur.meta?.n ?? cur.hist?.length ?? 0}`;
    };

    const updateProb = () => {
      const cur = load();
      const x = rawRSI - 100;
      const p = 1 / (1 + Math.exp(-(cur.t0 + cur.t1 * x)));
      if (valEl) valEl.textContent = `${(p * 100).toFixed(1)}%`;
    };

    const refreshAll = () => { showTheta(); updateProb(); };
    refreshAll();

    wrap.querySelector('#ff-softer')?.addEventListener('click', () => {
      const cur = load();
      saveTheta(cur.t0, cur.t1 * 0.9);
      refreshAll();
      flash('slope softer');
    });

    wrap.querySelector('#ff-steeper')?.addEventListener('click', () => {
      const cur = load();
      saveTheta(cur.t0, cur.t1 * 1.1);
      refreshAll();
      flash('slope steeper');
    });

    wrap.querySelector('#ff-reset')?.addEventListener('click', () => {
      saveTheta(0, 0.12);
      Env.setValue('ff_lrsi_hist', []);
      Env.setValue('ff_lrsi_meta', { n: 0, ts: Date.now() });
      refreshAll();
      flash('reset');
    });

    wrap.querySelector('#ff-refit')?.addEventListener('click', async () => {
      try {
        // Pull fights from IndexedDB instead of old manual log
        const fights = await FightDB.getAllFights();

        if (!fights || fights.length === 0) {
          flash('no fights in database');
          return;
        }

        // Convert fights to learning format
        const samples = [];
        for (const fight of fights) {
          const rsi = fight.rsiAdjusted || fight.rsiRaw;
          if (rsi === null || rsi === undefined) continue;
          if (fight.outcome !== 'win' && fight.outcome !== 'loss') continue;

          samples.push({
            x: rsi - 100, // Center around 100%
            y: fight.outcome === 'win' ? 1 : 0,
            ts: fight.capturedAt || Date.now()
          });
        }

        if (samples.length === 0) {
          flash('no fights with RSI data');
          return;
        }

        // Refit using the converted samples
        const fitted = refit(samples);

        // Also save samples to the learning history
        Env.setValue('ff_lrsi_hist', samples);
        Env.setValue('ff_lrsi_meta', { n: samples.length, ts: Date.now() });

        refreshAll();
        flash(fitted ? `re-fit from ${samples.length} fights: θ0=${fitted.t0.toFixed(3)}, θ1=${fitted.t1.toFixed(3)}` : 'fit failed');
      } catch (e) {
        console.error('Re-fit error:', e);
        flash('error: ' + e.message);
      }
    });

    wrap.querySelector('#ff-clear')?.addEventListener('click', () => {
      Env.setValue('ff_lrsi_hist', []);
      Env.setValue('ff_lrsi_meta', { n: 0, ts: Date.now() });
      refreshAll();
      flash('log cleared');
    });

    const logSample = won => {
      const cur = load();
      const hist = addSample(cur.hist, rawRSI, won);
      refreshAll();
      flash(`logged ${won ? 'win' : 'loss'} (#${hist.length})`);
    };

    wrap.querySelector('#ff-logwin')?.addEventListener('click', () => logSample(true));
    wrap.querySelector('#ff-logloss')?.addEventListener('click', () => logSample(false));
  }

  // ============================================================================
  // FIGHT INTELLIGENCE PANEL
  // ============================================================================

  async function buildFightIntelPanel(headerEl, opponentId, opponentName, currentRSI) {
    try {
      // Don't duplicate
      if (document.getElementById('ff-intel-panel')) return;

      // Get data from database with proper error handling
      // If database has schema errors (missing indexes), return empty data instead of crashing
      let opponentHistory = [];
      let winRateData = { totalFights: 0, wins: 0, losses: 0, winRate: 0, confidence: 'none', rsiRange: '' };
      let learnedData = { probability: 0, confidence: 'none', dataPoints: 0 };
      
      try {
        [opponentHistory, winRateData, learnedData] = await Promise.all([
          FightDB.getOpponentHistory(opponentId).catch(e => {
            console.warn('FightIntel: getOpponentHistory failed (DB schema error?)', e.message);
            return [];
          }),
          FightDB.getWinRateForRSI(currentRSI).catch(e => {
            console.warn('FightIntel: getWinRateForRSI failed (DB schema error?)', e.message);
            return { totalFights: 0, wins: 0, losses: 0, winRate: 0, confidence: 'none', rsiRange: '' };
          }),
          Promise.resolve(FightDB.getLearnedWinProbability(currentRSI))
        ]);
      } catch (dbError) {
        console.warn('FightIntel: Database queries failed, using empty data', dbError.message);
        // Continue with empty data - panel will show "No data yet" message
      }

      // Calculate opponent-specific stats
      const oppWins = opponentHistory.filter(f => f.outcome === 'win').length;
      const oppLosses = opponentHistory.filter(f => f.outcome === 'loss').length;
      const oppTotal = opponentHistory.length;

      // Determine win chance data
      const hasLearnedData = learnedData.dataPoints >= 5;
      const hasHistoricalData = winRateData.totalFights >= 3;

      let winChance = null;
      let confidenceClass = 'none';
      let confidenceShort = '';

      if (hasLearnedData && learnedData.confidence !== 'none') {
        winChance = learnedData.probability;
        confidenceClass = learnedData.confidence;
        confidenceShort = learnedData.confidence === 'high' ? '✓' : learnedData.confidence === 'medium' ? '📊' : '⚠️';
      } else if (hasHistoricalData) {
        winChance = winRateData.winRate;
        confidenceClass = winRateData.confidence;
        confidenceShort = winRateData.confidence === 'high' ? '✓' : winRateData.confidence === 'medium' ? '📊' : '⚠️';
      }

      // Build summary line for collapsed state
      let summaryParts = [];

      // Win chance summary
      if (winChance !== null) {
        const wcColor = winChance >= 70 ? '#4caf50' : winChance >= 50 ? '#f9a825' : '#ef5350';
        summaryParts.push(`<span style="color:${wcColor};font-weight:600;">${winChance.toFixed(0)}%</span> win ${confidenceShort}`);
      } else {
        summaryParts.push('<span style="color:#666;">No prediction</span>');
      }

      // Opponent history summary
      if (oppTotal > 0) {
        const histColor = oppWins > oppLosses ? '#4caf50' : oppLosses > oppWins ? '#ef5350' : '#90a4ae';
        summaryParts.push(`<span style="color:${histColor};">${oppWins}W-${oppLosses}L</span> vs ${escapeHtml(opponentName || 'them')}`);
      } else {
        summaryParts.push(`<span style="color:#666;">Never fought</span>`);
      }

      // Create collapsible panel
      const panel = document.createElement('details');
      panel.id = 'ff-intel-panel';
      panel.style.cssText = 'margin-top:6px;background:linear-gradient(135deg,rgba(30,30,40,0.92) 0%,rgba(20,20,30,0.92) 100%);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:12px;color:#e6e6e6;';

      // Summary header (always visible)
      const summary = document.createElement('summary');
      summary.style.cssText = 'padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;user-select:none;list-style:none;';
      summary.innerHTML = `
        <span style="color:#4fc3f7;font-weight:600;">⚔️ Intel</span>
        <span style="color:#888;">—</span>
        ${summaryParts.join(' <span style="color:#444;margin:0 4px;">·</span> ')}
      `;
      panel.appendChild(summary);

      // Expanded content container
      const content = document.createElement('div');
      content.style.cssText = 'padding:0 12px 10px 12px;border-top:1px solid rgba(255,255,255,0.08);';

      let contentHtml = '';

      // Win Chance Section (only if data exists)
      if (winChance !== null) {
        let valueClass = winChance >= 70 ? 'positive' : winChance >= 50 ? 'warning' : 'danger';
        let barColor = winChance >= 70 ? '#4caf50' : winChance >= 50 ? '#f9a825' : '#ef5350';

        let confidenceNote = '';
        if (confidenceClass === 'low') {
          confidenceNote = '⚠️ Low confidence — need more fights';
        } else if (confidenceClass === 'medium') {
          confidenceNote = '📊 Medium confidence';
        } else if (confidenceClass === 'high') {
          confidenceNote = '✓ High confidence';
        }

        const dataPointsLabel = hasLearnedData ? `${learnedData.dataPoints} fights` : `${winRateData.totalFights} similar`;

        contentHtml += `
          <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="color:#aaa;font-size:11px;">Est. Win Chance</span>
              <span style="font-weight:600;color:${barColor};">${winChance.toFixed(1)}%</span>
            </div>
            <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${Math.min(winChance, 100)}%;background:${barColor};border-radius:3px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:#666;">
              <span>${dataPointsLabel}</span>
              <span>${confidenceNote}</span>
            </div>
          </div>
        `;
      }

      // Historical Win Rate (only show if different from learned data source AND has data)
      if (hasHistoricalData && hasLearnedData) {
        let wrColor = winRateData.winRate >= 70 ? '#4caf50' : winRateData.winRate >= 50 ? '#f9a825' : '#ef5350';
        contentHtml += `
          <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#aaa;font-size:11px;">At RSI ${winRateData.rsiRange}</span>
            <span style="color:${wrColor};font-weight:600;">${winRateData.wins}W ${winRateData.losses}L</span>
          </div>
        `;
      }

      // Opponent History Section (only if fought before)
      if (oppTotal > 0) {
        let recordColor = oppWins > oppLosses ? '#4caf50' : oppLosses > oppWins ? '#ef5350' : '#90a4ae';

        const recentFights = opponentHistory
          .sort((a, b) => (b.capturedAt || 0) - (a.capturedAt || 0))
          .slice(0, 5);

        let tagsHtml = recentFights.map(f => {
          const cls = f.outcome === 'win' ? 'background:rgba(76,175,80,0.2);color:#4caf50;border:1px solid rgba(76,175,80,0.3);'
                    : f.outcome === 'loss' ? 'background:rgba(239,83,80,0.2);color:#ef5350;border:1px solid rgba(239,83,80,0.3);'
                    : 'background:rgba(158,158,158,0.2);color:#9e9e9e;';
          const txt = f.outcome === 'win' ? 'W' : f.outcome === 'loss' ? 'L' : '?';
          return `<span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:600;${cls}">${txt}</span>`;
        }).join('');

        let lastFightInfo = '';
        if (recentFights[0]) {
          const timeAgo = formatTimeAgo(recentFights[0].capturedAt);
          lastFightInfo = `<span style="font-size:10px;color:#666;margin-left:8px;">Last: ${timeAgo}</span>`;
        }

        contentHtml += `
          <div style="padding:8px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="color:#aaa;font-size:11px;">vs ${escapeHtml(opponentName || 'this player')}</span>
              <span style="color:${recordColor};font-weight:600;">${oppWins}W - ${oppLosses}L</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              ${tagsHtml}
              ${lastFightInfo}
            </div>
          </div>
        `;
      }

      // If no meaningful expanded content, show a minimal message
      if (!contentHtml) {
        contentHtml = `
          <div style="padding:10px 0;text-align:center;color:#666;font-style:italic;">
            Fight opponents to build intelligence data
          </div>
        `;
      }

      content.innerHTML = contentHtml;
      panel.appendChild(content);

      // Insert after the h4 header (or after RSI+ panel if it exists)
      const rsiPlusPanel = document.getElementById('ff-exp-panel');
      if (rsiPlusPanel) {
        rsiPlusPanel.after(panel);
      } else {
        headerEl.after(panel);
      }

    } catch (e) {
      console.error('FightIntel: Error building panel', e);
      console.error('FightIntel: If error persists, clear browser data to rebuild database');
    }
  }

  // ============================================================================
  // INJECTION FUNCTIONS
  // ============================================================================

  function injectProfile() {
    const h = document.querySelector('h4');
    if (!h || h.dataset.ff) return;
    h.dataset.ff = '1';

    const match = location.href.match(/[?&](?:XID|user2ID)=(\d+)/);
    const userId = match?.[1];
    if (!userId) return;

    ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, async (o) => {
      // Cache the RSI data immediately
      await RSICacheManager.set(userId, o, REFRESH_PRIORITY.PROFILE_VIEW);
      
      const rsi = calcRSI(USER_BP, o.personalstats, o.basic, o.life);
      const pct = parseFloat(rsi.adjusted.toFixed(2));

      let cls = 'low', note = 'Advantage';
      if (pct < settings.lowHigh) { cls = 'high'; note = 'High risk'; }
      else if (pct < settings.highMed) { cls = 'med'; note = 'Moderate risk'; }

      const lifePct = o.life?.maximum
        ? Math.round((o.life.current / o.life.maximum) * 100)
        : null;

      const lastAction = o.last_action || o.profile?.last_action || o.basic?.last_action;
      let rel = null;
      if (lastAction?.relative) {
        const mm = lastAction.relative.match(/^(\d+)\s+(\w+)/);
        if (mm) {
          const num = mm[1];
          const word = mm[2].toLowerCase();
          let suffix = 'm';
          if (word.startsWith('hour')) suffix = 'h';
          else if (word.startsWith('day')) suffix = 'd';
          rel = num + suffix;
        }
      }

      let extra = '';
      if (lifePct !== null && rel !== null) extra = ` (L ${lifePct}% · A ${rel})`;
      else if (lifePct !== null) extra = ` (L ${lifePct}%)`;
      else if (rel !== null) extra = ` (A ${rel})`;

      const sp = document.createElement('span');
      sp.className = `ff-score-badge ${cls}${rsi.woundPenalty > 0 ? ' wounded' : ''}`;
      sp.innerHTML = `
        RSI ${pct}% — ${escapeHtml(note)}${escapeHtml(extra)}
        ${rsi.woundPenalty > 0 ? '<span style="margin-left:6px;color:#fff;">✚</span>' : ''}
        ${USER_DRUG_DEBUFF > 0 ? `<img src="${PILL_ICON_URL}" style="width:12px;height:12px;vertical-align:middle;margin-left:6px;">` : ''}
      `;
      h.appendChild(sp);

      // Store prediction for fight capture
      FightCapture.storePendingAttack({
        opponentId: parseInt(userId, 10),
        opponentName: o.name || o.basic?.name || null,
        rsiRaw: rsi.raw,
        rsiAdjusted: rsi.adjusted,
        riskClass: cls,
        oppLife: rsi.lifeRatio,
        oppLevel: o.level || o.basic?.level || null,
        oppSnapshot: {
          elo: o.personalstats?.elo,
          attacksWon: o.personalstats?.attackswon,
          attacksLost: o.personalstats?.attackslost,
          xantaken: o.personalstats?.xantaken,
          networth: o.personalstats?.networth
        }
      });

      window.__FF_LAST_PROFILE_OBJ = o;
      buildRSIPlusPanel(h, ME_STATS, o);

      // Build Fight Intelligence panel
      buildFightIntelPanel(h, parseInt(userId, 10), o.name || o.basic?.name, pct);
      
      // Cache status data if present
      if (o.status || o.travel) {
        StatusCacheManager.set(userId, o);
      }
    });
  }

  async function injectListItem(honorWrap) {
    if (honorWrap.dataset.ff) return;
    honorWrap.dataset.ff = '1';

    const profileLink = honorWrap.querySelector('a[href*="profiles.php?XID="]');
    if (!profileLink) return;

    const honorTextWrap = honorWrap.querySelector('.honor-text-wrap') || honorWrap;
    if (getComputedStyle(honorTextWrap).position === 'static') {
      honorTextWrap.style.position = 'relative';
    }

    const userIdMatch = profileLink.href.match(/XID=(\d+)/);
    if (!userIdMatch) return;
    const userId = userIdMatch[1];

    // Add user ID as data attribute for later status updates
    honorTextWrap.dataset.userId = userId;

    // Step 1: Check status cache first (60s TTL)
    console.log(`[User ${userId}] Checking status cache...`);
    const cachedStatus = await StatusCacheManager.get(userId);
    if (cachedStatus) {
      console.log(`[User ${userId}] ✓ Status cache HIT - status:`, cachedStatus.status?.state, 'travel:', cachedStatus.travel?.destination);
      addStatusIcon(cachedStatus, honorTextWrap, userId);
    } else {
      console.log(`[User ${userId}] ✗ Status cache MISS (probably Okay status)`);
    }

    // Step 2: Check RSI cache (24h TTL)
    console.log(`[User ${userId}] Checking RSI cache...`);
    const cachedRSI = await RSICacheManager.get(userId);
    
    if (cachedRSI) {
      console.log(`[User ${userId}] ✓ RSI cache HIT`);
      
      // Use cached RSI data to display triangle
      const rsi = calcRSI(USER_BP, cachedRSI.personalstats, cachedRSI.basic, cachedRSI.life);
      const pct = parseFloat(rsi.adjusted.toFixed(2));
      const cls = rsi.adjusted < settings.lowHigh ? 'high'
        : rsi.adjusted < settings.highMed ? 'med'
        : 'low';
      const pos = (100 - Math.min(rsi.adjusted, 200) / 200 * 100) + '%';
      
      const lifePct = cachedRSI.life?.maximum
        ? Math.round((cachedRSI.life.current / cachedRSI.life.maximum) * 100)
        : null;
      const lastAction = cachedRSI.last_action || cachedRSI.profile?.last_action || cachedRSI.basic?.last_action;
      
      let tooltipHtml = `RSI: ${escapeHtml(pct.toFixed(2))}%`;
      if (lifePct !== null) tooltipHtml += `<br>Life: ${escapeHtml(String(lifePct))}%`;
      if (lastAction?.relative) tooltipHtml += `<br>Last action: ${escapeHtml(lastAction.relative)}`;
      
      const img = document.createElement('img');
      img.className = 'ff-list-arrow-img';
      img.style.left = pos;
      img.src = cls === 'low' ? GREEN_ARROW_UP : cls === 'med' ? YELLOW_ARROW_UP : RED_ARROW_UP;
      img.setAttribute('width', '20');
      img.setAttribute('height', '20');
      if (rsi.woundPenalty > 0) img.classList.add('wounded');
      
      img.addEventListener('mouseenter', e => {
        Tooltip.show(e.pageX, e.pageY, tooltipHtml);
        ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, async d2 => {
          await RSICacheManager.set(userId, d2, REFRESH_PRIORITY.FACTION_LIST);
          if (d2.status || d2.travel) {
            await StatusCacheManager.set(userId, d2);
          }
          honorTextWrap.querySelectorAll('.ff-list-arrow-img').forEach(el => el.remove());
          injectTriangle(honorTextWrap, d2, userId, e);
        });
      });
      img.addEventListener('mousemove', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
      img.addEventListener('mouseleave', () => Tooltip.hide());
      img.addEventListener('click', e => {
        e.preventDefault();
        Tooltip.show(e.pageX, e.pageY, tooltipHtml);
        setTimeout(Tooltip.hide, 2000);
      });
      
      honorTextWrap.appendChild(img);
      
      // Step 3: Check if status needs refresh using LastCheckCache
      // This tracks ALL users (even "Okay" status) to prevent unnecessary refreshes
      const timeSinceCheck = LastCheckCacheManager.getTimeSinceCheck(userId);
      
      if (LastCheckCacheManager.shouldCheck(userId)) {
        console.log(`[User ${userId}] Last checked ${Math.round(timeSinceCheck/1000)}s ago - refreshing status`);
        
        // Make lightweight status-only API call
        ApiManager.get(`/user/${userId}?selections=profile`, async d => {
          // Mark as checked regardless of result
          LastCheckCacheManager.set(userId);
          
          // Update status cache if user has active status
          if (d.status || d.travel) {
            console.log(`[User ${userId}] Status refresh: has status - caching`);
            await StatusCacheManager.set(userId, d);
            addStatusIcon(d, honorTextWrap, userId);
          } else {
            console.log(`[User ${userId}] Status refresh: no active status`);
            // Don't cache "Okay" status, but we marked it as checked
          }
        });
      } else {
        console.log(`[User ${userId}] Last checked ${Math.round(timeSinceCheck/1000)}s ago - no refresh needed`);
      }
      
      return; // Done - using cached RSI, status refreshed if needed
    }
    
    // Step 4: RSI cache MISS - need to fetch full data
    console.log(`[User ${userId}] ✗ RSI cache MISS - fetching full data`);

    ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, async d => {
      // Clear existing RSI indicators only (preserve status icons)
      honorTextWrap.querySelectorAll('.ff-list-arrow-img').forEach(el => el.remove());

      // Cache the RSI data immediately to prevent duplicate API calls
      await RSICacheManager.set(userId, d, REFRESH_PRIORITY.FACTION_LIST);
      
      // Mark as checked in LastCheckCache
      LastCheckCacheManager.set(userId);

      const rsi = calcRSI(USER_BP, d.personalstats, d.basic, d.life);
      const pct = parseFloat(rsi.adjusted.toFixed(2));

      const cls = rsi.adjusted < settings.lowHigh ? 'high'
        : rsi.adjusted < settings.highMed ? 'med'
        : 'low';

      const pos = (100 - Math.min(rsi.adjusted, 200) / 200 * 100) + '%';

      const lifePct = d.life?.maximum
        ? Math.round((d.life.current / d.life.maximum) * 100)
        : null;

      const lastAction = d.last_action || d.profile?.last_action || d.basic?.last_action;

      // Build sanitized tooltip HTML
      let tooltipHtml = `RSI: ${escapeHtml(pct.toFixed(2))}%`;
      if (lifePct !== null) tooltipHtml += `<br>Life: ${escapeHtml(String(lifePct))}%`;
      if (lastAction?.relative) tooltipHtml += `<br>Last action: ${escapeHtml(lastAction.relative)}`;

      // Create triangle indicator
      const img = document.createElement('img');
      img.className = 'ff-list-arrow-img';
      img.style.left = pos;
      img.src = cls === 'low' ? GREEN_ARROW_UP : cls === 'med' ? YELLOW_ARROW_UP : RED_ARROW_UP;
      img.setAttribute('width', '20');
      img.setAttribute('height', '20');
      if (rsi.woundPenalty > 0) img.classList.add('wounded');

      img.addEventListener('mouseenter', e => {
        Tooltip.show(e.pageX, e.pageY, tooltipHtml);
        // Refresh data on hover
        ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, async d2 => {
          await RSICacheManager.set(userId, d2, REFRESH_PRIORITY.FACTION_LIST);
          if (d2.status || d2.travel) {
            await StatusCacheManager.set(userId, d2);
          }
          honorTextWrap.querySelectorAll('.ff-list-arrow-img').forEach(el => el.remove());
          injectTriangle(honorTextWrap, d2, userId, e);
        });
      });
      img.addEventListener('mousemove', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
      img.addEventListener('mouseleave', () => Tooltip.hide());
      img.addEventListener('click', e => {
        e.preventDefault();
        Tooltip.show(e.pageX, e.pageY, tooltipHtml);
        setTimeout(Tooltip.hide, 2000);
      });

      honorTextWrap.appendChild(img);

      // Cache status data if present
      if (d.status || d.travel) {
        console.log(`[User ${userId}] API returned status data - caching and displaying icons`);
        await StatusCacheManager.set(userId, d);
        addStatusIcon(d, honorTextWrap, userId);
      } else {
        console.log(`[User ${userId}] API has no status data - preserving cached icons`);
      }
    });
  }

  function injectTriangle(honorTextWrap, d, userId, event) {
    const rsi = calcRSI(USER_BP, d.personalstats, d.basic, d.life);
    const pct = parseFloat(rsi.adjusted.toFixed(2));
    const cls = rsi.adjusted < settings.lowHigh ? 'high'
      : rsi.adjusted < settings.highMed ? 'med'
      : 'low';
    const pos = (100 - Math.min(rsi.adjusted, 200) / 200 * 100) + '%';

    const lifePct = d.life?.maximum ? Math.round((d.life.current / d.life.maximum) * 100) : null;
    const lastAction = d.last_action || d.profile?.last_action || d.basic?.last_action;

    let tooltipHtml = `RSI: ${escapeHtml(pct.toFixed(2))}%`;
    if (lifePct !== null) tooltipHtml += `<br>Life: ${escapeHtml(String(lifePct))}%`;
    if (lastAction?.relative) tooltipHtml += `<br>Last action: ${escapeHtml(lastAction.relative)}`;

    const img = document.createElement('img');
    img.className = 'ff-list-arrow-img';
    img.style.left = pos;
    img.src = cls === 'low' ? GREEN_ARROW_UP : cls === 'med' ? YELLOW_ARROW_UP : RED_ARROW_UP;
    img.setAttribute('width', '20');
    img.setAttribute('height', '20');
    if (rsi.woundPenalty > 0) img.classList.add('wounded');

    img.addEventListener('mouseenter', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
    img.addEventListener('mousemove', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
    img.addEventListener('mouseleave', () => Tooltip.hide());
    img.addEventListener('click', e => {
      e.preventDefault();
      Tooltip.show(e.pageX, e.pageY, tooltipHtml);
      setTimeout(Tooltip.hide, 2000);
    });

    honorTextWrap.appendChild(img);
    if (event?.pageX) Tooltip.show(event.pageX, event.pageY, tooltipHtml);
  }

  function addStatusIcon(statusData, honorTextWrap, userId) {
    console.log(`[addStatusIcon] Called for user ${userId}, has status:`, !!statusData?.status, 'state:', statusData?.status?.state);
    
    if (!statusData?.status) {
      console.log(`[addStatusIcon] No status data - returning without clearing icons`);
      return;
    }

    console.log(`[addStatusIcon] Clearing existing status icons for user ${userId}`);
    honorTextWrap.querySelectorAll('.ff-travel-icon, .ff-hospital-icon').forEach(el => {
      console.log(`[addStatusIcon] Removing icon: ${el.className}`);
      el.remove();
    });

    const makeTooltip = s => {
      let tip = escapeHtml(s.status.description || s.status.state);
      if (s.status.details) tip += `<br>${escapeHtml(s.status.details)}`;
      return tip;
    };

    // Hospital takes priority
    if (statusData.status.state === "Hospital") {
      const desc = (statusData.status.description || statusData.status.details || "").trim();
      const isAbroad = /^In a\s+.+\s+hospital\s+for\s+\d+\s+min/i.test(desc);

      const icon = document.createElement('img');
      icon.src = HOSPITAL_ICON_URL;
      icon.className = 'ff-hospital-icon';
      icon.alt = 'Hospital';
      icon.draggable = false;

      if (desc) icon.dataset.ffDesc = desc;
      if (statusData.status.until) icon.dataset.ffUntil = String(statusData.status.until);

      icon.style.filter = isAbroad
        ? 'grayscale(0) brightness(1) drop-shadow(0 0 3px #ff9800) drop-shadow(0 0 2px #ffb300)'
        : 'grayscale(0) brightness(1) drop-shadow(0 0 3px #2094fa) drop-shadow(0 0 2px #42a5f5)';

      let lastTooltip = makeTooltip(statusData);

      icon.addEventListener('mouseenter', ev => {
        Tooltip.show(ev.pageX, ev.pageY, lastTooltip);
        ApiManager.get(`/user/${userId}?selections=basic`, newStatus => {
          if (!newStatus.status) return;
          if (JSON.stringify(newStatus.status) !== JSON.stringify(statusData.status)) {
            honorTextWrap.querySelectorAll('.ff-hospital-icon, .ff-travel-icon').forEach(el => el.remove());
            addStatusIcon(newStatus, honorTextWrap, userId);
            Tooltip.show(ev.pageX, ev.pageY, makeTooltip(newStatus));
          }
        });
      });
      icon.addEventListener('mousemove', ev => Tooltip.show(ev.pageX, ev.pageY, lastTooltip));
      icon.addEventListener('mouseleave', () => Tooltip.hide());
      icon.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        Tooltip.show(ev.pageX, ev.pageY, lastTooltip);
        setTimeout(Tooltip.hide, 2000);
      });

      honorTextWrap.appendChild(icon);

      // Add countdown chip
      addCountdownChip(icon, honorTextWrap);
      return;
    }

    // Travel/Abroad
    if (statusData.status.state === "Traveling" || statusData.status.state === "Abroad") {
      const icon = document.createElement('img');
      icon.src = PLANE_ICON_URL;
      icon.className = 'ff-travel-icon ' + (statusData.status.state === "Traveling" ? 'ff-traveling' : 'ff-abroad');
      icon.alt = statusData.status.state;
      icon.draggable = false;

      const desc = (statusData.status.description || statusData.status.details || '').trim();
      if (desc) icon.dataset.ffDesc = desc;

      let lastTooltip = makeTooltip(statusData);

      icon.addEventListener('mouseenter', ev => {
        Tooltip.show(ev.pageX, ev.pageY, lastTooltip);
        ApiManager.get(`/user/${userId}?selections=basic`, newStatus => {
          if (!newStatus.status) return;
          if (JSON.stringify(newStatus.status) !== JSON.stringify(statusData.status)) {
            honorTextWrap.querySelectorAll('.ff-travel-icon, .ff-hospital-icon').forEach(el => el.remove());
            addStatusIcon(newStatus, honorTextWrap, userId);
            Tooltip.show(ev.pageX, ev.pageY, makeTooltip(newStatus));
          }
        });
      });
      icon.addEventListener('mousemove', ev => Tooltip.show(ev.pageX, ev.pageY, lastTooltip));
      icon.addEventListener('mouseleave', () => Tooltip.hide());
      icon.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        Tooltip.show(ev.pageX, ev.pageY, lastTooltip);
        setTimeout(Tooltip.hide, 2000);
      });

      honorTextWrap.appendChild(icon);

      // Add location badge
      addLocationBadge(icon, honorTextWrap);
    }
  }

  function addCountdownChip(icon, parent) {
    if (icon.dataset.ffChipped === '1') return;

    let untilMs = null;
    const untilAttr = icon.dataset.ffUntil;
    if (untilAttr) {
      const raw = parseInt(untilAttr, 10);
      if (!isNaN(raw) && raw > 0) {
        untilMs = raw < 1e12 ? raw * 1000 : raw;
      }
    }

    if (!untilMs) {
      const desc = icon.dataset.ffDesc || '';
      const mins = parseMinutesFromText(desc);
      if (mins != null) {
        untilMs = Date.now() + mins * 60 * 1000;
      }
    }

    if (!untilMs) return;

    let chip = parent.querySelector('.ff-countdown-chip');
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'ff-countdown-chip';
      parent.appendChild(chip);
    }

    chip.dataset.ffUntil = String(untilMs);
    icon.dataset.ffChipped = '1';
  }

  function addLocationBadge(icon, parent) {
    if (parent.querySelector('.ff-loc-badge')) return;

    const desc = icon.dataset.ffDesc || '';
    const info = parseTravelInfo(desc);
    if (!info) return;

    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    const badge = document.createElement('span');
    badge.className = 'ff-loc-badge';
    badge.dataset.kind = info.kind;

    const arrow = info.kind === 'travel' ? '→ ' : info.kind === 'return' ? '← ' : '';
    badge.textContent = arrow + abbreviateLocation(info.loc);
    parent.appendChild(badge);
  }

  // ============================================================================
  // BOUNTY PAGE INJECTION
  // ============================================================================

  function injectBountyItem(listItem) {
    if (listItem.getAttribute('data-ff-bounty') === '1') return;
    listItem.setAttribute('data-ff-bounty', '1');

    // Find the profile link (target name)
    const profileLink = listItem.querySelector('a[href*="profiles.php?XID="]');
    if (!profileLink) return;

    const userIdMatch = profileLink.href.match(/XID=(\d+)/);
    if (!userIdMatch) return;
    const userId = userIdMatch[1];

    // Find the cell/container that holds the name - this becomes our positioning parent
    // On bounty page, the structure is: li > div.target_left > a
    let container = profileLink.parentElement;

    // Make container a positioning context (like honor-text-wrap on faction pages)
    container.style.position = 'relative';
    container.style.overflow = 'visible';

    ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, async d => {
      if (!d) return;

      // Cache the RSI data immediately
      await RSICacheManager.set(userId, d, REFRESH_PRIORITY.BOUNTY_LIST);

      // Clear existing indicators from this container
      container.querySelectorAll('.ff-list-arrow-img, .ff-travel-icon, .ff-hospital-icon, .ff-loc-badge, .ff-countdown-chip')
        .forEach(el => el.remove());

      const rsi = calcRSI(USER_BP, d.personalstats, d.basic, d.life);
      const pct = parseFloat(rsi.adjusted.toFixed(2));

      const cls = rsi.adjusted < settings.lowHigh ? 'high'
        : rsi.adjusted < settings.highMed ? 'med'
        : 'low';

      // Position on 0-200% scale (same as faction pages)
      const pos = (100 - Math.min(rsi.adjusted, 200) / 200 * 100) + '%';

      const lifePct = d.life?.maximum
        ? Math.round((d.life.current / d.life.maximum) * 100)
        : null;

      const lastAction = d.last_action || d.profile?.last_action || d.basic?.last_action;

      // Build tooltip
      let tooltipHtml = `RSI: ${escapeHtml(pct.toFixed(2))}%`;
      if (lifePct !== null) tooltipHtml += `<br>Life: ${escapeHtml(String(lifePct))}%`;
      if (d.status?.description) tooltipHtml += `<br>Status: ${escapeHtml(d.status.description)}`;
      if (lastAction?.relative) tooltipHtml += `<br>Last action: ${escapeHtml(lastAction.relative)}`;

      // Create triangle indicator using same class as faction pages (.ff-list-arrow-img)
      const img = document.createElement('img');
      img.className = 'ff-list-arrow-img';
      img.style.left = pos;
      img.src = cls === 'low' ? GREEN_ARROW_UP : cls === 'med' ? YELLOW_ARROW_UP : RED_ARROW_UP;
      img.setAttribute('width', '20');
      img.setAttribute('height', '20');
      if (rsi.woundPenalty > 0) img.classList.add('wounded');

      img.addEventListener('mouseenter', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
      img.addEventListener('mousemove', e => Tooltip.show(e.pageX, e.pageY, tooltipHtml));
      img.addEventListener('mouseleave', () => Tooltip.hide());
      img.addEventListener('click', e => {
        e.preventDefault();
        Tooltip.show(e.pageX, e.pageY, tooltipHtml);
        setTimeout(Tooltip.hide, 2000);
      });

      container.appendChild(img);

      // Cache status data if present
      if (d.status || d.travel) {
        StatusCacheManager.set(userId, d);
      }

      // Add status icons using the SAME function as faction pages
      addStatusIcon(d, container, userId);
    });
  }

  // ============================================================================
  // MARKET ATTACK BUTTONS
  // ============================================================================

  function injectMarketAttackButton(profileLink) {
    if (profileLink.parentElement?.querySelector('.ff-attack-btn')) return;

    const xidMatch = profileLink.getAttribute('href')?.match(/XID=(\d+)/);
    if (!xidMatch) return;
    const xid = xidMatch[1];

    const btn = document.createElement('a');
    btn.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${xid}`;
    btn.target = '_blank';
    btn.className = 'ff-attack-btn';
    btn.title = 'Attack this player';
    btn.style.cssText = 'margin-left:5px;background:transparent;border:none;padding:0;cursor:pointer;vertical-align:middle;display:inline-block;';

    const icon = document.createElement('img');
    icon.src = CIRCLE_ICON_URL;
    icon.alt = 'Attack';
    icon.style.cssText = 'width:16px;height:16px;display:inline-block;filter:drop-shadow(0 0 5px #ff1744) drop-shadow(0 0 6px #c62828);transition:filter 0.2s;';

    btn.appendChild(icon);
    btn.addEventListener('mouseenter', () => {
      icon.style.filter = 'drop-shadow(0 0 8px #ff1744) drop-shadow(0 0 14px #c62828)';
    });
    btn.addEventListener('mouseleave', () => {
      icon.style.filter = 'drop-shadow(0 0 5px #ff1744) drop-shadow(0 0 6px #c62828)';
    });

    profileLink.parentElement?.appendChild(btn);
  }

  // ============================================================================
  // BOUNTY SNIPER MODULE
  // With cross-tab sync, draggable panel, and mobile optimization
  // ============================================================================

  const BountySniper = (() => {
    // State
    let isEnabled = false;
    let targets = [];  // Current sniper targets (shown in panel)
    let rsiCache = new Map();  // userId -> {rsi, timestamp}
    let beatenCache = new Map();  // userId -> {wins, losses}
    let apiCallsThisMinute = 0;
    let lastMinuteReset = Date.now();
    let scanInterval = null;
    let heartbeatInterval = null;
    let panelEl = null;
    let isCollapsed = false;

    // Progressive scanning state
    let cachedBounties = [];  // Full bounty list from page scraping
    let cachedCandidates = [];  // Filtered candidates awaiting API check
    let lastBountyFetch = 0;  // Timestamp of last bounty page fetch
    let scanIndex = 0;  // Current position in candidate list
    let verifiedTargets = new Map();  // userId -> bounty object (API-verified good targets)

    // Target verification
    let targetLastVerified = new Map();  // userId -> timestamp

    // Cross-tab sync state
    const TAB_ID = Math.random().toString(36).substr(2, 9);
    let isLeader = false;
    let isProvisionalFollower = true;  // New pages start as provisional followers
    const LEADER_TIMEOUT = 5000;  // 5 seconds without heartbeat = leader lost
    const HEARTBEAT_INTERVAL = 2000;  // Send heartbeat every 2 seconds
    const VISIBILITY_TAKEOVER_TIME = 10000;  // Take leadership after 10 seconds of viewing (PC)
    const LEADERSHIP_CLAIM_DELAY = 15000;  // Wait 15 seconds before claiming leadership (mobile-friendly)
    const STORAGE_KEY_TARGETS = 'ff_sniper_targets';
    const STORAGE_KEY_LEADER = 'ff_sniper_leader';
    const STORAGE_KEY_HEARTBEAT = 'ff_sniper_heartbeat';
    const STORAGE_KEY_POSITION = 'ff_sniper_position';
    const STORAGE_KEY_COLLAPSED = 'ff_sniper_collapsed';
    const STORAGE_KEY_SCAN_STATE = 'ff_sniper_scan_state';
    const STORAGE_KEY_FORCE_LEADER = 'ff_sniper_force_leader';  // For forced takeover
    const STORAGE_KEY_FULL_STATE = 'ff_sniper_full_state';  // Comprehensive state for mobile
    const STORAGE_KEY_NAVIGATING = 'ff_sniper_navigating';  // Navigation detection

    // Mobile/PDA detection
    const isMobilePDA = /PDA|Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)
                        || window.innerWidth < 768;

    // Visibility tracking
    let visibilityStartTime = 0;
    let visibilityCheckInterval = null;
    let panelCreated = false;  // Prevent duplicate panels
    let leadershipClaimTimer = null;  // Delayed leadership claim
    let receivedUpdatesDuringDelay = false;  // Track if we got updates while waiting

    // Watchdog / reconnection handling
    let watchdogInterval = null;
    let lastActivityTime = Date.now();
    const WATCHDOG_INTERVAL = 30000;  // Check every 30 seconds
    const WATCHDOG_TIMEOUT = 120000;  // Restart if no activity for 2 minutes

    // Drag state
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panelStartX = 0;
    let panelStartY = 0;

    const RSI_CACHE_TTL = 10 * 60 * 1000;  // 10 minutes for general cache
    const TARGET_VERIFY_TTL = 45 * 1000;  // 45 seconds - verify panel targets frequently
    const BOUNTY_REFRESH_INTERVAL = 90 * 1000;  // Refresh bounty pages every 90 seconds
    const MAX_TARGETS = 5;

    // Throttling constants - slower to reduce load
    const PAGE_LOAD_DELAY = 2500;  // 2.5 seconds between page loads (was 1.5s)
    const API_CALL_DELAY = 200;    // 200ms between API calls (was 100ms)

    // Check if a page-scraped status matches user's enabled preferences
    function statusMatchesPrefs(status) {
      if (status === 'Okay' && settings.sniperShowOkay) return true;
      if (status === 'Hospital' && settings.sniperShowHospital) return true;
      if (status === 'Traveling' && settings.sniperShowTraveling) return true;
      return false;
    }

    // =========================================================================
    // CROSS-TAB SYNC
    // =========================================================================

    // Try to become leader
    function tryBecomeLeader() {
      const now = Date.now();
      const lastHeartbeat = parseInt(localStorage.getItem(STORAGE_KEY_HEARTBEAT) || '0', 10);
      const currentLeader = localStorage.getItem(STORAGE_KEY_LEADER);

      // Become leader if: no leader, leader timed out, or we are already leader
      if (!currentLeader || currentLeader === TAB_ID || (now - lastHeartbeat) > LEADER_TIMEOUT) {
        localStorage.setItem(STORAGE_KEY_LEADER, TAB_ID);
        localStorage.setItem(STORAGE_KEY_HEARTBEAT, now.toString());

        if (!isLeader) {
          isLeader = true;
          console.log(`BountySniper: Tab ${TAB_ID} became LEADER`);
          restoreScanState();
          updatePanelRole();

          // Start scanning if we're not in provisional mode and don't have scan interval
          if (!isProvisionalFollower && !scanInterval) {
            console.log('BountySniper: Starting scanning after leadership takeover');
            startLeaderScanning();
          }
        }
        return true;
      }

      if (isLeader) {
        isLeader = false;
        updatePanelRole();
      }
      return false;
    }

    // Send leader heartbeat
    function sendHeartbeat() {
      if (isLeader) {
        localStorage.setItem(STORAGE_KEY_HEARTBEAT, Date.now().toString());
      }
    }

    // Check if current leader is still alive
    function checkLeader() {
      const now = Date.now();
      const lastHeartbeat = parseInt(localStorage.getItem(STORAGE_KEY_HEARTBEAT) || '0', 10);
      const currentLeader = localStorage.getItem(STORAGE_KEY_LEADER);

      if (currentLeader === TAB_ID) {
        // We are leader, send heartbeat
        sendHeartbeat();
        return;
      }

      // Check if leader timed out
      if ((now - lastHeartbeat) > LEADER_TIMEOUT) {
        console.log('BountySniper: Leader timed out, trying to take over...');
        tryBecomeLeader();
      }
    }

    // Broadcast targets to other tabs
    function broadcastTargets() {
      if (!isLeader) return;

      const data = {
        targets: targets,
        timestamp: Date.now(),
        scanIndex: scanIndex,
        cachedCandidatesCount: cachedCandidates.length,
        progress: cachedCandidates.length > 0 ? Math.round((getCheckedCount() / cachedCandidates.length) * 100) : 0
      };

      localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify(data));
    }

    // Broadcast scan state for other tabs to continue if they become leader
    function broadcastScanState() {
      if (!isLeader) return;

      const state = {
        scanIndex,
        lastBountyFetch,
        verifiedTargets: Array.from(verifiedTargets.entries()),
        rsiCache: Array.from(rsiCache.entries()).slice(0, 100)
      };

      try {
        localStorage.setItem(STORAGE_KEY_SCAN_STATE, JSON.stringify(state));
      } catch (e) {
        // localStorage full
        console.log('BountySniper: localStorage full, clearing old scan state');
      }

      // Also save full state for mobile navigation
      saveFullState();
    }

    // Save comprehensive state (for mobile navigation recovery)
    function saveFullState() {
      try {
        const fullState = {
          timestamp: Date.now(),
          targets: targets,
          scanIndex: scanIndex,
          lastBountyFetch: lastBountyFetch,
          verifiedTargets: Array.from(verifiedTargets.entries()),
          cachedCandidates: cachedCandidates.slice(0, 200),  // Limit size
          cachedBounties: cachedBounties.slice(0, 200),
          rsiCache: Array.from(rsiCache.entries()).slice(0, 100),
          progress: cachedCandidates.length > 0 ? Math.round((getCheckedCount() / cachedCandidates.length) * 100) : 0
        };
        localStorage.setItem(STORAGE_KEY_FULL_STATE, JSON.stringify(fullState));
      } catch (e) {
        console.log('BountySniper: Could not save full state', e);
      }
    }

    // Cleanup stale localStorage data (older than threshold)
    function cleanupStaleData(threshold) {
      try {
        let cleaned = [];

        // Check targets timestamp
        const targetsData = JSON.parse(localStorage.getItem(STORAGE_KEY_TARGETS) || '{}');
        if (targetsData.timestamp && (Date.now() - targetsData.timestamp) > threshold) {
          localStorage.removeItem(STORAGE_KEY_TARGETS);
          cleaned.push('targets');
        }

        // Check full state timestamp
        const fullState = JSON.parse(localStorage.getItem(STORAGE_KEY_FULL_STATE) || '{}');
        if (fullState.timestamp && (Date.now() - fullState.timestamp) > threshold) {
          localStorage.removeItem(STORAGE_KEY_FULL_STATE);
          cleaned.push('fullState');
        }

        // Check scan state (no timestamp, but clear if leader is stale)
        const lastHeartbeat = parseInt(localStorage.getItem(STORAGE_KEY_HEARTBEAT) || '0', 10);
        if ((Date.now() - lastHeartbeat) > threshold) {
          localStorage.removeItem(STORAGE_KEY_SCAN_STATE);
          localStorage.removeItem(STORAGE_KEY_LEADER);
          localStorage.removeItem(STORAGE_KEY_HEARTBEAT);
          cleaned.push('scanState', 'leader', 'heartbeat');
        }

        if (cleaned.length > 0) {
          console.log(`BountySniper: Cleaned stale data: ${cleaned.join(', ')}`);
        }

        return cleaned.length > 0;
      } catch (e) {
        console.log('BountySniper: Error cleaning stale data', e);
        return false;
      }
    }

    // Load comprehensive state (for mobile navigation recovery)
    function loadFullState() {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_FULL_STATE) || '{}');

        // Check if state is fresh (less than 5 minutes old)
        const stateAge = Date.now() - (data.timestamp || 0);
        const isFresh = stateAge < 5 * 60 * 1000;  // 5 minutes

        if (!isFresh) {
          console.log(`BountySniper: Saved state is stale (${(stateAge/1000/60).toFixed(1)} mins old), starting fresh`);
          return false;
        }

        // Restore targets (for immediate display)
        if (data.targets && data.targets.length > 0) {
          targets = data.targets;
          console.log(`BountySniper: Restored ${targets.length} targets from saved state`);
        }

        // Restore scan progress
        if (data.scanIndex !== undefined) {
          scanIndex = data.scanIndex;
        }
        if (data.lastBountyFetch) {
          lastBountyFetch = data.lastBountyFetch;
        }
        if (data.verifiedTargets) {
          verifiedTargets = new Map(data.verifiedTargets);
        }
        if (data.cachedCandidates && data.cachedCandidates.length > 0) {
          cachedCandidates = data.cachedCandidates;
        }
        if (data.cachedBounties && data.cachedBounties.length > 0) {
          cachedBounties = data.cachedBounties;
        }
        if (data.rsiCache) {
          rsiCache = new Map(data.rsiCache);
        }

        console.log(`BountySniper: Loaded full state - ${targets.length} targets, ${cachedCandidates.length} candidates, progress: ${data.progress || 0}%`);
        return true;
      } catch (e) {
        console.log('BountySniper: Could not load full state', e);
        return false;
      }
    }

    // Mark navigation start (helps new page know we're mid-navigation)
    function markNavigating() {
      try {
        localStorage.setItem(STORAGE_KEY_NAVIGATING, Date.now().toString());
      } catch (e) {}
    }

    // Check if we recently navigated (within last 10 seconds)
    function isRecentNavigation() {
      try {
        const navTime = parseInt(localStorage.getItem(STORAGE_KEY_NAVIGATING) || '0', 10);
        return (Date.now() - navTime) < 10000;
      } catch (e) {
        return false;
      }
    }

    // Receive targets from leader tab
    // isStorageEvent = true means this was triggered by another tab, false = initial read
    function receiveTargets(isStorageEvent = false) {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_TARGETS) || '{}');
        if (data.targets && Array.isArray(data.targets)) {
          targets = data.targets;

          // Only mark as "received updates" if this is an actual storage event from another tab
          // AND the data is fresh (less than 30 seconds old)
          if (isStorageEvent && data.timestamp && (Date.now() - data.timestamp) < 30000) {
            receivedUpdatesDuringDelay = true;
            console.log('BountySniper: Received LIVE update from leader');
          }

          renderPanel();
          updateStatusFromSync(data);
        }
      } catch (e) {
        // Invalid data
      }
    }

    // Update status display from synced data
    function updateStatusFromSync(data) {
      if (!panelEl) return;
      const status = panelEl.querySelector('.ff-sniper-status');
      if (status && data.progress !== undefined) {
        status.innerHTML = `<span class="follower">●</span> Synced | ${data.progress}% scanned`;
      }
    }

    // Restore scan state when becoming leader
    function restoreScanState() {
      try {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY_SCAN_STATE) || '{}');
        if (state.scanIndex !== undefined) {
          scanIndex = state.scanIndex;
        }
        if (state.lastBountyFetch) {
          lastBountyFetch = state.lastBountyFetch;
        }
        if (state.verifiedTargets) {
          verifiedTargets = new Map(state.verifiedTargets);
        }
        if (state.rsiCache) {
          rsiCache = new Map(state.rsiCache);
        }
        console.log(`BountySniper: Restored scan state - index: ${scanIndex}, verified: ${verifiedTargets.size}`);
      } catch (e) {
        console.log('BountySniper: Could not restore scan state');
      }
    }

    // Listen for storage changes (other tabs updating)
    function setupStorageListener() {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_TARGETS && !isLeader) {
          receiveTargets(true);  // true = this is a real storage event from another tab
        }
        if (e.key === STORAGE_KEY_LEADER) {
          // Leader changed
          const newLeader = e.newValue;
          if (newLeader !== TAB_ID && isLeader) {
            // We lost leadership
            isLeader = false;
            if (scanInterval) {
              clearInterval(scanInterval);
              scanInterval = null;
            }
            updatePanelRole();
            console.log(`BountySniper: Tab ${TAB_ID} is now FOLLOWER (another tab took over)`);
          }
        }
        if (e.key === STORAGE_KEY_FORCE_LEADER) {
          // Another tab is forcing leadership
          try {
            const data = JSON.parse(e.newValue || '{}');
            if (data.tabId && data.tabId !== TAB_ID && isLeader) {
              // Someone else is forcing takeover, relinquish leadership
              isLeader = false;
              if (scanInterval) {
                clearInterval(scanInterval);
                scanInterval = null;
              }
              updatePanelRole();
              console.log(`BountySniper: Tab ${TAB_ID} relinquished leadership to ${data.tabId}`);
            }
          } catch (err) {}
        }
        if (e.key === STORAGE_KEY_POSITION) {
          // Position changed from another tab, apply it
          try {
            const pos = JSON.parse(e.newValue || '{}');
            if (pos.x !== undefined && pos.y !== undefined) {
              applyPosition(pos.x, pos.y);
            }
          } catch (err) {}
        }
        if (e.key === STORAGE_KEY_COLLAPSED) {
          // Collapsed state changed
          try {
            const collapsed = JSON.parse(e.newValue || 'false');
            if (isCollapsed !== collapsed) {
              isCollapsed = collapsed;
              if (panelEl) {
                panelEl.classList.toggle('collapsed', isCollapsed);
                panelEl.querySelector('.ff-sniper-toggle').textContent = isCollapsed ? '▶' : '▼';
              }
            }
          } catch (err) {}
        }
      });
    }

    // Update panel to show if leader or follower
    function updatePanelRole() {
      if (!panelEl) return;

      panelEl.classList.toggle('follower', !isLeader);
    }

    // Force this tab to become leader (called by user clicking satellite icon)
    function forceLeadership() {
      console.log(`BountySniper: Tab ${TAB_ID} forcing leadership takeover`);

      // No longer provisional
      isProvisionalFollower = false;

      // Broadcast force takeover message
      localStorage.setItem(STORAGE_KEY_FORCE_LEADER, JSON.stringify({
        tabId: TAB_ID,
        timestamp: Date.now()
      }));

      // Take leadership
      localStorage.setItem(STORAGE_KEY_LEADER, TAB_ID);
      localStorage.setItem(STORAGE_KEY_HEARTBEAT, Date.now().toString());

      if (!isLeader) {
        isLeader = true;

        // Load full state (mobile) or restore scan state (desktop)
        if (isMobilePDA) {
          loadFullState();
        } else {
          restoreScanState();
        }

        updatePanelRole();

        // Start scanning if not already
        if (!scanInterval) {
          startLeaderScanning();
        }

        console.log(`BountySniper: Tab ${TAB_ID} is now LEADER (forced)`);
      }
    }

    // Handle visibility change - take leadership after 10 seconds of viewing
    function setupVisibilityTracking() {
      // Track when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          visibilityStartTime = Date.now();
        } else {
          visibilityStartTime = 0;
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Initial state
      if (document.visibilityState === 'visible') {
        visibilityStartTime = Date.now();
      }

      // Use longer takeover time on mobile
      const takeoverTime = isMobilePDA ? VISIBILITY_TAKEOVER_TIME * 2 : VISIBILITY_TAKEOVER_TIME;

      // Check periodically if we should take over
      visibilityCheckInterval = setInterval(() => {
        // Don't take over if we're still in provisional follower mode
        if (isProvisionalFollower) {
          return;
        }

        if (!isLeader && visibilityStartTime > 0) {
          const viewingTime = Date.now() - visibilityStartTime;
          if (viewingTime >= takeoverTime) {
            // On mobile, only take over if we haven't received updates recently
            if (isMobilePDA && receivedUpdatesDuringDelay) {
              console.log('BountySniper: Skipping visibility takeover - received recent updates');
              receivedUpdatesDuringDelay = false;  // Reset for next check
              visibilityStartTime = Date.now();  // Reset timer
              return;
            }

            console.log(`BountySniper: Page visible for ${(viewingTime/1000).toFixed(0)}s, taking leadership`);
            forceLeadership();
            visibilityStartTime = Date.now();  // Reset to prevent repeated takeovers
          }
        }
      }, 2000);
    }

    // =========================================================================
    // WATCHDOG / RECONNECTION HANDLING
    // =========================================================================

    // Setup watchdog to detect and recover from script crashes
    function setupWatchdog() {
      if (watchdogInterval) {
        clearInterval(watchdogInterval);
      }

      lastActivityTime = Date.now();

      watchdogInterval = setInterval(() => {
        const timeSinceActivity = Date.now() - lastActivityTime;

        // If leader and no activity for too long, something is wrong
        if (isLeader && timeSinceActivity > WATCHDOG_TIMEOUT) {
          console.warn(`BountySniper: ⚠️ Watchdog triggered - no activity for ${(timeSinceActivity/1000).toFixed(0)}s, restarting...`);
          restartSniper();
        }

        // Update panel status to show we're alive
        if (isEnabled && panelEl) {
          const status = panelEl.querySelector('.ff-sniper-status');
          if (status && !status.innerHTML.includes('Error')) {
            // Heartbeat indicator - subtle update to show script is running
            lastActivityTime = Date.now();  // Watchdog check counts as activity
          }
        }
      }, WATCHDOG_INTERVAL);

      console.log('BountySniper: Watchdog started');
    }

    // Restart the sniper after a crash/timeout
    function restartSniper() {
      console.log('BountySniper: Attempting restart...');

      // Clear all intervals
      if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      if (visibilityCheckInterval) {
        clearInterval(visibilityCheckInterval);
        visibilityCheckInterval = null;
      }

      // Reset state
      lastActivityTime = Date.now();

      // Try to become leader again
      tryBecomeLeader();

      // Restart scanning if leader
      if (isLeader) {
        console.log('BountySniper: Restart successful - resuming as leader');

        // Setup heartbeat
        heartbeatInterval = setInterval(() => {
          checkLeader();
        }, HEARTBEAT_INTERVAL);

        // Setup visibility tracking
        setupVisibilityTracking();

        // Start scanning
        const intervalMs = settings.sniperFetchInterval * 1000;
        scanInterval = setInterval(() => {
          if (isLeader) {
            scan();
            broadcastScanState();
          }
        }, intervalMs);

        // Immediate scan
        scan();

        updateStatus('Restarted');
      } else {
        console.log('BountySniper: Restart - became follower');
        receiveTargets();
      }
    }

    // =========================================================================
    // DRAG FUNCTIONALITY
    // =========================================================================

    // Get saved position or default
    function getSavedPosition() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_POSITION) || '{}');
        if (saved.x !== undefined && saved.y !== undefined) {
          return saved;
        }
      } catch (e) {}

      // Default position - bottom left, accounting for mobile
      const isMobile = window.innerWidth < 768;
      return {
        x: isMobile ? 10 : 80,
        y: window.innerHeight - (isMobile ? 290 : 240)
      };
    }

    // Save position to localStorage
    function savePosition(x, y) {
      try {
        localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify({ x, y }));
      } catch (e) {}
    }

    // Apply position to panel
    function applyPosition(x, y) {
      if (!panelEl) return;

      // Bounds checking
      const rect = panelEl.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - 10;
      const maxY = window.innerHeight - rect.height - 10;

      x = Math.max(10, Math.min(x, maxX));
      y = Math.max(10, Math.min(y, maxY));

      panelEl.style.left = x + 'px';
      panelEl.style.top = y + 'px';
      panelEl.style.bottom = 'auto';
      panelEl.style.right = 'auto';
    }

    // Handle drag start (mouse)
    function onMouseDown(e) {
      // Only drag from header, not toggle button
      if (e.target.closest('.ff-sniper-toggle')) return;
      if (!e.target.closest('.ff-sniper-header')) return;

      e.preventDefault();
      startDrag(e.clientX, e.clientY);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      moveDrag(e.clientX, e.clientY);
    }

    function onMouseUp() {
      endDrag();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    // Handle drag start (touch)
    function onTouchStart(e) {
      // Only drag from header, not toggle button
      if (e.target.closest('.ff-sniper-toggle')) return;
      if (!e.target.closest('.ff-sniper-header')) return;

      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }

    function onTouchEnd() {
      endDrag();
    }

    // Common drag functions
    function startDrag(clientX, clientY) {
      isDragging = true;
      dragStartX = clientX;
      dragStartY = clientY;

      const rect = panelEl.getBoundingClientRect();
      panelStartX = rect.left;
      panelStartY = rect.top;

      panelEl.classList.add('dragging');
    }

    function moveDrag(clientX, clientY) {
      const deltaX = clientX - dragStartX;
      const deltaY = clientY - dragStartY;

      applyPosition(panelStartX + deltaX, panelStartY + deltaY);
    }

    function endDrag() {
      if (!isDragging) return;

      isDragging = false;
      panelEl.classList.remove('dragging');

      // Save position
      const rect = panelEl.getBoundingClientRect();
      savePosition(rect.left, rect.top);
    }

    // Reset position on double-click
    function onDoubleClick(e) {
      if (!e.target.closest('.ff-sniper-header')) return;
      if (e.target.closest('.ff-sniper-toggle')) return;

      // Reset to default position
      localStorage.removeItem(STORAGE_KEY_POSITION);
      const pos = getSavedPosition();
      applyPosition(pos.x, pos.y);
      savePosition(pos.x, pos.y);
    }

    // Setup all drag event listeners
    function setupDragListeners() {
      if (!panelEl) return;

      // Mouse events
      panelEl.addEventListener('mousedown', onMouseDown);

      // Touch events
      panelEl.addEventListener('touchstart', onTouchStart, { passive: true });
      panelEl.addEventListener('touchmove', onTouchMove, { passive: false });
      panelEl.addEventListener('touchend', onTouchEnd);

      // Double-click to reset
      panelEl.addEventListener('dblclick', onDoubleClick);
    }

    // Parse bounty data from HTML string
    function parseBountyHtml(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bounties = [];

      // Debug: log what we're working with
      const allLis = doc.querySelectorAll('li');
      console.log('BountySniper: Found', allLis.length, 'list items in HTML');

      // Try multiple selectors for bounty rows
      const selectors = [
        'ul.bounties-list > li',
        'ul[class*="bounty"] > li',
        '.bounties-wrap li',
        'li[class*="bounty"]',
        'li'  // fallback to all li elements
      ];

      let foundItems = [];
      for (const sel of selectors) {
        const items = doc.querySelectorAll(sel);
        if (items.length > 0) {
          console.log('BountySniper: Selector', sel, 'matched', items.length, 'items');
          // Only use this selector if it found items with profile links
          const withLinks = Array.from(items).filter(li => li.querySelector('a[href*="profiles.php?XID="]'));
          if (withLinks.length > 0) {
            foundItems = withLinks;
            break;
          }
        }
      }

      console.log('BountySniper: Processing', foundItems.length, 'items with profile links');

      foundItems.forEach(li => {
        const profileLink = li.querySelector('a[href*="profiles.php?XID="]');
        if (!profileLink) return;

        const userIdMatch = profileLink.href.match(/XID=(\d+)/);
        if (!userIdMatch) return;

        const userId = userIdMatch[1];
        const name = profileLink.textContent.trim();

        // Extract level - look for the level column
        let level = 0;
        const levelEl = li.querySelector('[class*="level"]') || li.querySelector('div:nth-child(3)');
        if (levelEl) {
          const levelMatch = levelEl.textContent.match(/(\d+)/);
          if (levelMatch) level = parseInt(levelMatch[1], 10);
        }
        // Fallback: search all text for a standalone number that looks like level
        if (!level) {
          const allText = li.textContent;
          const matches = allText.match(/\b([1-9]\d?|100)\b/g);
          if (matches && matches.length > 0) {
            // Usually level is a small number, pick first reasonable one
            for (const m of matches) {
              const n = parseInt(m, 10);
              if (n >= 1 && n <= 100) { level = n; break; }
            }
          }
        }

        // Extract reward
        let reward = 0;
        const rewardEl = li.querySelector('[class*="reward"]') || li.querySelector('div:first-child');
        if (rewardEl) {
          const rewardText = rewardEl.textContent.replace(/[,$]/g, '');
          const rewardMatch = rewardText.match(/([\d,]+)/);
          if (rewardMatch) reward = parseInt(rewardMatch[1].replace(/,/g, ''), 10);
        }
        // Fallback: search for dollar amounts
        if (!reward) {
          const dollarMatch = li.textContent.match(/\$?([\d,]+)/);
          if (dollarMatch) reward = parseInt(dollarMatch[1].replace(/,/g, ''), 10);
        }

        // Extract status - look for status column/link
        let status = 'Okay';
        let hospitalTime = null;  // null = unknown, 0 = just released, >0 = time remaining in minutes

        // Look for status link/text
        const statusLink = li.querySelector('a[href*="hospitalview"]');
        const travelingLink = li.querySelector('a[href*="travelagency"], a[class*="traveling"], a[class*="abroad"]');
        const statusEl = li.querySelector('[class*="status"]');
        const liText = li.textContent;

        if (statusLink || /hospital/i.test(liText)) {
          status = 'Hospital';
          // Try to extract hospital time - formats: "HH:MM:SS" or "MM:SS" or "X hrs Y mins" etc.
          const timePatterns = [
            /(\d+):(\d+):(\d+)/,  // HH:MM:SS
            /(\d+):(\d+)/,        // MM:SS
            /(\d+)\s*h(?:r|our)?s?\s*(\d+)?\s*m/i,  // "X hrs Y mins"
            /(\d+)\s*m(?:in)?s?/i  // "X mins"
          ];

          for (const pattern of timePatterns) {
            const match = liText.match(pattern);
            if (match) {
              if (match[3] !== undefined) {
                // HH:MM:SS format
                hospitalTime = parseInt(match[1], 10) * 60 + parseInt(match[2], 10) + (parseInt(match[3], 10) / 60);
              } else if (match[2] !== undefined && match[0].includes(':')) {
                // MM:SS format
                hospitalTime = parseInt(match[1], 10) + (parseInt(match[2], 10) / 60);
              } else if (match[2] !== undefined) {
                // X hrs Y mins format
                hospitalTime = parseInt(match[1], 10) * 60 + (parseInt(match[2], 10) || 0);
              } else {
                // Just minutes
                hospitalTime = parseInt(match[1], 10);
              }
              break;
            }
          }

          // If we couldn't parse time, assume they're in for a while
          if (hospitalTime === null) hospitalTime = 999;

        } else if (travelingLink || /travel|abroad|flying/i.test(liText)) {
          status = 'Traveling';
        }

        bounties.push({
          id: userId,
          userId,
          name,
          level,
          reward,
          status,
          hospitalTime,
          rsi: null,
          beaten: null,
          valueScore: 0
        });
      });

      return bounties;
    }

    // Parse bounties from current page DOM (when on bounty page)
    function parseBountyDOM() {
      const bounties = [];

      // More comprehensive selectors for bounty rows
      const rows = document.querySelectorAll('ul.bounties-list > li, [class*="bounties"] li, ul.item > li');

      console.log('BountySniper: Found', rows.length, 'potential bounty rows');

      rows.forEach(li => {
        const profileLink = li.querySelector('a[href*="profiles.php?XID="]');
        if (!profileLink) return;

        const userIdMatch = profileLink.href.match(/XID=(\d+)/);
        if (!userIdMatch) return;

        const userId = userIdMatch[1];
        const name = profileLink.textContent.trim();
        const liText = li.textContent;

        // Get data from table cells
        const cells = li.querySelectorAll('div');
        let level = 0, reward = 0;

        cells.forEach(cell => {
          const text = cell.textContent.trim();

          // Check for reward (has $ or large number)
          if (/^\$?[\d,]+$/.test(text.replace(/,/g, ''))) {
            const num = parseInt(text.replace(/[$,]/g, ''), 10);
            if (num > 10000) reward = num;
            else if (num >= 1 && num <= 100 && !level) level = num;
          }
        });

        // Check status - look for status column specifically
        let status = 'Okay';  // Default to Okay
        let hospitalTime = null;

        // Look for status-related elements
        const statusLink = li.querySelector('a[href*="hospitalview"]');
        const travelLink = li.querySelector('a[class*="traveling"], a[class*="abroad"]');
        const okayLink = li.querySelector('a[class*="okay"], span[class*="okay"]');

        // Check the STATUS column text
        const statusTexts = ['Hospital', 'Traveling', 'Abroad', 'Okay'];
        for (const cell of cells) {
          const cellText = cell.textContent.trim();
          for (const st of statusTexts) {
            if (cellText.toLowerCase() === st.toLowerCase()) {
              if (st === 'Hospital') {
                status = 'Hospital';
              } else if (st === 'Traveling' || st === 'Abroad') {
                status = 'Traveling';
              } else if (st === 'Okay') {
                status = 'Okay';
              }
              break;
            }
          }
        }

        // Fallback detection
        if (statusLink) {
          status = 'Hospital';
        } else if (travelLink) {
          status = 'Traveling';
        }

        // Parse hospital time if applicable
        if (status === 'Hospital') {
          const timePatterns = [
            /(\d+):(\d+):(\d+)/,  // HH:MM:SS
            /(\d+):(\d+)/         // MM:SS or HH:MM
          ];

          for (const pattern of timePatterns) {
            const match = liText.match(pattern);
            if (match) {
              if (match[3] !== undefined) {
                hospitalTime = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
              } else {
                const first = parseInt(match[1], 10);
                const second = parseInt(match[2], 10);
                hospitalTime = first * 60 + second;  // Assume HH:MM
              }
              break;
            }
          }
          if (hospitalTime === null) hospitalTime = 999;  // Unknown, assume long
        }

        // Get level from specific position if available
        const lvlCell = li.querySelector('[class*="lvl"], [class*="level"]');
        if (lvlCell) {
          const m = lvlCell.textContent.match(/(\d+)/);
          if (m) level = parseInt(m[1], 10);
        }

        bounties.push({
          id: userId,
          userId,
          name,
          level,
          reward,
          status,
          hospitalTime,
          rsi: null,
          beaten: null,
          valueScore: 0
        });
      });

      // Log status breakdown
      const statusCounts = { Okay: 0, Hospital: 0, Traveling: 0 };
      bounties.forEach(b => statusCounts[b.status] = (statusCounts[b.status] || 0) + 1);
      console.log('BountySniper: Status breakdown:', statusCounts);

      return bounties;
    }

    // Fetch bounty data using hidden iframe (needed because TORN uses React/SPA)
    // Scans multiple pages and uses "Hide Unavailable" filter
    async function fetchBountyPage() {
      const MAX_PAGES_TO_SCAN = Math.min(settings.sniperPagesToScan || 10, 20);  // Use setting, max 20
      const BOUNTIES_PER_PAGE = 20;  // TORN shows 20 bounties per page
      const allBounties = [];
      const seenIds = new Set();

      for (let page = 1; page <= MAX_PAGES_TO_SCAN; page++) {
        console.log(`BountySniper: Loading page ${page}/${MAX_PAGES_TO_SCAN}...`);
        updateStatus(`Loading page ${page}/${MAX_PAGES_TO_SCAN}...`);

        try {
          const pageBounties = await fetchBountyPageSingle(page);

          // Add unique bounties
          let newCount = 0;
          for (const b of pageBounties) {
            if (!seenIds.has(b.id)) {
              seenIds.add(b.id);
              allBounties.push(b);
              newCount++;
            }
          }

          console.log(`BountySniper: Page ${page} found ${pageBounties.length} bounties, ${newCount} new, total: ${allBounties.length}`);

          // If we got very few bounties, might be at end of filtered results
          if (pageBounties.length < 5) {
            console.log('BountySniper: Few results on page, stopping pagination');
            break;
          }

          // Throttled delay between page loads to reduce load
          if (page < MAX_PAGES_TO_SCAN) {
            await new Promise(r => setTimeout(r, PAGE_LOAD_DELAY));
          }
        } catch (err) {
          console.error(`BountySniper: Error loading page ${page}:`, err);
          break;
        }
      }

      // Log status breakdown from iframe fetching
      const statusCounts = { Okay: 0, Hospital: 0, Traveling: 0, Unknown: 0 };
      allBounties.forEach(b => {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      });
      console.log('BountySniper: Iframe total status breakdown:', statusCounts);

      return allBounties;
    }

    // Fetch a single page of bounties
    async function fetchBountyPageSingle(pageNum = 1) {
      return new Promise((resolve, reject) => {
        // Create hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1024px;height:768px;visibility:hidden;';

        // TORN pagination uses: #/!p=main&start=X where X = (page-1) * 20
        const start = (pageNum - 1) * 20;
        const url = `https://www.torn.com/bounties.php#/!p=main&start=${start}`;
        console.log(`BountySniper: Loading iframe URL: ${url}`);
        iframe.src = url;

        let resolved = false;
        let checkInterval = null;
        let clickedHideUnavailable = false;

        const cleanup = () => {
          if (checkInterval) clearInterval(checkInterval);
          if (iframe.parentNode) iframe.remove();
        };

        const tryClickHideUnavailable = (doc) => {
          if (clickedHideUnavailable) return false;
          try {
            // Look for "Hide Unavailable" checkbox and click it
            const labels = doc.querySelectorAll('label');
            for (const label of labels) {
              if (label.textContent.includes('Hide Unavailable')) {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && !checkbox.checked) {
                  console.log('BountySniper: Clicking Hide Unavailable checkbox');
                  checkbox.click();
                  clickedHideUnavailable = true;
                  return true;  // Will need to wait for re-render
                } else if (checkbox && checkbox.checked) {
                  clickedHideUnavailable = true;  // Already checked
                }
              }
            }
            // Also try by finding any checkbox near "Hide" text
            const allCheckboxes = doc.querySelectorAll('input[type="checkbox"]');
            for (const cb of allCheckboxes) {
              const parent = cb.closest('label') || cb.parentElement;
              if (parent && /hide.*unavailable/i.test(parent.textContent)) {
                if (!cb.checked) {
                  cb.click();
                  clickedHideUnavailable = true;
                  return true;
                }
                clickedHideUnavailable = true;
              }
            }
          } catch (e) {
            console.log('BountySniper: Could not click Hide Unavailable:', e);
          }
          return false;
        };

        const tryParse = () => {
          try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return null;

            // Look for profile links - if found, page has rendered
            const profileLinks = doc.querySelectorAll('a[href*="profiles.php?XID="]');
            if (profileLinks.length > 0) {
              return doc;
            }
          } catch (e) {
            // Cross-origin error - shouldn't happen since same domain
          }
          return null;
        };

        // Timeout after 30 seconds per page
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            console.log(`BountySniper: Iframe timeout for page ${pageNum}`);
            reject(new Error('Iframe timeout'));
          }
        }, 30000);

        iframe.onload = () => {
          let attempts = 0;
          let waitingForRerender = false;

          checkInterval = setInterval(() => {
            attempts++;
            const doc = tryParse();

            if (doc) {
              // Try to click Hide Unavailable on first detection
              if (!clickedHideUnavailable) {
                const clicked = tryClickHideUnavailable(doc);
                if (clicked) {
                  // Wait for page to re-render after clicking
                  waitingForRerender = true;
                  attempts = 0;  // Reset attempts counter
                  return;
                }
              }

              // If we clicked the checkbox, wait a bit for re-render
              if (waitingForRerender && attempts < 8) {
                return;  // Wait 4 more seconds (8 * 500ms)
              }

              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);

                // Parse bounties from iframe DOM
                const bounties = parseBountyFromDoc(doc);
                console.log(`BountySniper: Page ${pageNum} parsed ${bounties.length} bounties`);

                cleanup();
                resolve(bounties);
              }
            } else if (attempts > 50) {
              // Give up after 25 seconds
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                console.log(`BountySniper: Page ${pageNum} content never rendered`);
                reject(new Error('Content not rendered'));
              }
            }
          }, 500);
        };

        iframe.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            cleanup();
            reject(new Error('Iframe load error'));
          }
        };

        document.body.appendChild(iframe);
      });
    }

    // Parse bounties from a document (iframe or current page)
    function parseBountyFromDoc(doc) {
      const bounties = [];

      // Find all list items with profile links
      const rows = doc.querySelectorAll('li');

      rows.forEach(li => {
        const profileLink = li.querySelector('a[href*="profiles.php?XID="]');
        if (!profileLink) return;

        const userIdMatch = profileLink.href.match(/XID=(\d+)/);
        if (!userIdMatch) return;

        const userId = userIdMatch[1];
        const name = profileLink.textContent.trim();
        const liText = li.textContent.toLowerCase();

        // Extract level
        let level = 0;
        const cells = li.querySelectorAll('div');
        cells.forEach(cell => {
          const text = cell.textContent.trim();
          if (/^\d+$/.test(text)) {
            const num = parseInt(text, 10);
            if (num >= 1 && num <= 100 && !level) level = num;
          }
        });

        // Extract reward
        let reward = 0;
        const rewardMatch = li.textContent.match(/\$?([\d,]+)/);
        if (rewardMatch) {
          const num = parseInt(rewardMatch[1].replace(/,/g, ''), 10);
          if (num > 10000) reward = num;
        }

        // Extract status - be very explicit about detection
        let status = 'Unknown';  // Default to Unknown, not Okay
        let hospitalTime = null;

        // Method 1: Look for status links
        const hospitalLink = li.querySelector('a[href*="hospitalview"], a[class*="hospital"]');
        const travelLink = li.querySelector('a[href*="abroad"], a[class*="traveling"], a[class*="abroad"]');
        const okayLink = li.querySelector('a[class*="okay"], span[class*="okay"]');

        // Method 2: Check for status text in cells
        for (const cell of cells) {
          const cellText = cell.textContent.trim().toLowerCase();
          if (cellText === 'hospital') {
            status = 'Hospital';
            break;
          } else if (cellText === 'traveling' || cellText === 'abroad') {
            status = 'Traveling';
            break;
          } else if (cellText === 'okay') {
            status = 'Okay';
            break;
          }
        }

        // Method 3: Check links if text didn't match
        if (status === 'Unknown') {
          if (hospitalLink) {
            status = 'Hospital';
          } else if (travelLink) {
            status = 'Traveling';
          } else if (okayLink) {
            status = 'Okay';
          }
        }

        // Method 4: Check full row text for keywords
        if (status === 'Unknown') {
          if (liText.includes('hospital')) {
            status = 'Hospital';
          } else if (liText.includes('traveling') || liText.includes('abroad')) {
            status = 'Traveling';
          } else if (liText.includes('okay')) {
            status = 'Okay';
          }
        }

        // Parse hospital time if applicable
        if (status === 'Hospital') {
          const timeMatch = li.textContent.match(/(\d+):(\d+):(\d+)/);
          if (timeMatch) {
            hospitalTime = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
          } else {
            hospitalTime = 999;  // Unknown, assume long
          }
        }

        bounties.push({
          id: userId,
          userId,
          name,
          level,
          reward,
          status,
          hospitalTime,
          rsi: null,
          beaten: null,
          valueScore: 0
        });
      });

      // Log status breakdown for this page
      const statusCounts = { Okay: 0, Hospital: 0, Traveling: 0, Unknown: 0 };
      bounties.forEach(b => statusCounts[b.status] = (statusCounts[b.status] || 0) + 1);
      console.log('BountySniper: Page status breakdown:', statusCounts);

      return bounties;
    }

    // Check if we've beaten this player before
    async function checkBeatenStatus(userId) {
      if (beatenCache.has(userId)) {
        return beatenCache.get(userId);
      }

      try {
        const history = await FightDB.getOpponentHistory(userId);
        const wins = history.filter(f => f.outcome === 'win').length;
        const losses = history.filter(f => f.outcome === 'loss').length;
        const result = { wins, losses, total: history.length };
        beatenCache.set(userId, result);
        return result;
      } catch (e) {
        return { wins: 0, losses: 0, total: 0 };
      }
    }

    // Get RSI from cache or fetch - also returns status info
    // Set forceRefresh=true to bypass cache (used for panel target verification)
    async function getRsi(userId, forceRefresh = false) {
      // Check cache unless force refresh requested
      if (!forceRefresh) {
        const cached = rsiCache.get(userId);
        if (cached && (Date.now() - cached.timestamp) < RSI_CACHE_TTL) {
          return cached.rsi;
        }
      }

      // Check API budget
      if (!canUseApi()) {
        return null;
      }

      return new Promise((resolve) => {
        apiCallsThisMinute++;
        // Request all needed selections: personalstats for RSI calc, status for current state
        ApiManager.get(`/user/${userId}?selections=personalstats,basic,profile`, d => {
          if (!d) {
            console.log(`BountySniper: API returned null for ${userId}`);
            resolve(null);
            return;
          }

          // Calculate RSI
          const rsi = calcRSI(USER_BP, d.personalstats, d.basic, d.life);

          // Extract level and age from API response
          const playerLevel = d.level || d.basic?.level || 0;
          const playerAge = d.age || 0;  // Age in days

          // Log level/age for debugging
          console.log(`BountySniper: ${d.name || userId} - Level: ${playerLevel}, Age: ${playerAge} days`);

          // Extract status - TORN API returns status object with state, description, until
          const statusObj = d.status || {};
          const stateStr = statusObj.state || '';
          const statusDesc = statusObj.description || '';
          const statusUntil = statusObj.until || 0;

          // Log raw API response for debugging
          console.log(`BountySniper: API raw status for ${d.name || userId}:`, JSON.stringify(statusObj));

          // Normalize status - be very explicit about detection
          let normalizedStatus = 'Unknown';

          // Check state string first
          if (stateStr) {
            const stateLower = stateStr.toLowerCase();
            if (stateLower.includes('hospital')) {
              normalizedStatus = 'Hospital';
            } else if (stateLower.includes('travel') || stateLower.includes('abroad') || stateLower.includes('flying')) {
              normalizedStatus = 'Traveling';
            } else if (stateLower === 'okay' || stateLower === 'online' || stateLower === 'offline' || stateLower === 'idle') {
              normalizedStatus = 'Okay';
            }
          }

          // Also check description as backup
          if (normalizedStatus === 'Unknown' && statusDesc) {
            const descLower = statusDesc.toLowerCase();
            if (descLower.includes('hospital')) {
              normalizedStatus = 'Hospital';
            } else if (descLower.includes('travel') || descLower.includes('abroad')) {
              normalizedStatus = 'Traveling';
            }
          }

          // If still unknown but we got a response, assume Okay
          if (normalizedStatus === 'Unknown' && d.name) {
            normalizedStatus = 'Okay';
          }

          // Calculate hospital time remaining in minutes
          let hospitalMins = null;
          if (normalizedStatus === 'Hospital' && statusUntil) {
            const remainingMs = (statusUntil * 1000) - Date.now();
            hospitalMins = Math.max(0, remainingMs / 60000);
            console.log(`BountySniper: ${d.name} hospital time: ${hospitalMins.toFixed(1)} mins remaining`);
          }

          const result = {
            adjusted: rsi.adjusted,
            raw: rsi.raw,
            life: d.life?.maximum ? Math.round((d.life.current / d.life.maximum) * 100) : 100,
            status: normalizedStatus,
            hospitalTime: hospitalMins,
            statusDescription: statusDesc,
            level: playerLevel,
            age: playerAge
          };

          console.log(`BountySniper: API status for ${d.name || userId}: "${stateStr}" -> ${normalizedStatus}`);

          // Update cache
          rsiCache.set(userId, { rsi: result, timestamp: Date.now() });
          resolve(result);
        });
      });
    }

    // Check if we can make an API call within budget
    function canUseApi() {
      // Reset counter every minute
      if (Date.now() - lastMinuteReset > 60000) {
        apiCallsThisMinute = 0;
        lastMinuteReset = Date.now();
      }
      return apiCallsThisMinute < settings.sniperApiBudget;
    }

    // Calculate value score for a bounty
    function calculateValueScore(bounty) {
      // Base score from reward (normalized to 0-100)
      const rewardScore = Math.min(bounty.reward / 1000000, 1) * 40;  // Max 40 points for $1M+

      // RSI score (higher RSI = easier = better)
      let rsiScore = 0;
      if (bounty.rsi) {
        // RSI 100 = 50% win, RSI 150 = ~90% win, RSI 200+ = 100% win
        const winProb = Math.min(bounty.rsi.adjusted / 150, 1);
        rsiScore = winProb * 30;  // Max 30 points
      }

      // Beaten bonus
      let beatenScore = 0;
      if (bounty.beaten && bounty.beaten.wins > 0) {
        const winRate = bounty.beaten.wins / (bounty.beaten.total || 1);
        beatenScore = winRate * 20;  // Max 20 points
      }

      // Status penalty
      let statusPenalty = 0;
      if (bounty.status === 'Hospital') statusPenalty = 5;
      if (bounty.status === 'Traveling') statusPenalty = 15;

      return rewardScore + rsiScore + beatenScore - statusPenalty;
    }

    // Apply filters to bounty list
    // Pass 1 (strictHospitalFilter=false): Only filter by reward/level, let all statuses through for API verification
    // Pass 2 (strictHospitalFilter=true): Apply full status filters after API verification
    function filterBounties(bounties, strictHospitalFilter = false) {
      return bounties.filter(b => {
        // Reward filter - always apply
        if (b.reward < settings.sniperMinReward) return false;

        // Level filter - always apply
        if (b.level > settings.sniperMaxLevel && b.level > 0) return false;

        // RSI filter - only if we have RSI data
        if (b.rsi) {
          if (b.rsi.adjusted < settings.sniperRsiMin) return false;
          if (b.rsi.adjusted > settings.sniperRsiMax) return false;
        }

        // STATUS FILTERS - Only apply in strict mode (after API verification)
        // Page-scraped status is unreliable, so we let everything through initially
        if (!strictHospitalFilter) {
          // Non-strict mode: let all statuses through for API verification
          // Only filter out if we KNOW it's bad (has API data already)
          if (b.rsi && b.rsi.status) {
            // We have API-verified status, can apply some filters
            if (b.rsi.status === 'Traveling' && !settings.sniperShowTraveling) {
              return false;
            }
          }
          return true;
        }

        // STRICT MODE - Apply full status filters (after API verification)

        // Unknown status after API check = filter out
        if (b.status === 'Unknown') {
          console.log(`BountySniper: Filtering out ${b.name} - unknown status`);
          return false;
        }

        // Okay status
        if (b.status === 'Okay') {
          if (!settings.sniperShowOkay) {
            console.log(`BountySniper: Filtering out ${b.name} - okay (setting disabled)`);
            return false;
          }
        }

        // Hospital status
        if (b.status === 'Hospital') {
          if (!settings.sniperShowHospital) {
            console.log(`BountySniper: Filtering out ${b.name} - hospital (setting disabled)`);
            return false;
          }
          // Hospital time filter
          if (b.hospitalTime !== null && b.hospitalTime > settings.sniperHospitalMins) {
            console.log(`BountySniper: Filtering out ${b.name} - hospital time ${b.hospitalTime.toFixed(1)} mins > ${settings.sniperHospitalMins} threshold`);
            return false;
          }
          // If we still don't have hospital time after API check, filter out
          if (b.hospitalTime === null || b.hospitalTime === 999) {
            console.log(`BountySniper: Filtering out ${b.name} - hospital time unknown`);
            return false;
          }
        }

        // Traveling status
        if (b.status === 'Traveling') {
          if (!settings.sniperShowTraveling) {
            console.log(`BountySniper: Filtering out ${b.name} - traveling (setting disabled)`);
            return false;
          }
        }

        return true;
      });
    }

    // Sort targets based on user preference
    function sortTargets(targets) {
      const sortBy = settings.sniperSortBy;
      return targets.sort((a, b) => {
        switch (sortBy) {
          case 'reward':
            return b.reward - a.reward;
          case 'rsi':
            return (b.rsi?.adjusted || 0) - (a.rsi?.adjusted || 0);
          case 'beaten':
            return (b.beaten?.wins || 0) - (a.beaten?.wins || 0);
          case 'value':
          default:
            return b.valueScore - a.valueScore;
        }
      });
    }

    // Main scan function - uses progressive scanning
    async function scan() {
      if (!isEnabled || !API_KEY) {
        console.log('BountySniper: Not scanning - disabled or no API key');
        return;
      }

      // Update activity time for watchdog
      lastActivityTime = Date.now();

      try {
        const now = Date.now();
        const needsBountyRefresh = (now - lastBountyFetch) > BOUNTY_REFRESH_INTERVAL || cachedCandidates.length === 0;

        // PHASE 1: Refresh bounty list if needed (every 3 minutes or if empty)
        if (needsBountyRefresh) {
          updateStatus('Refreshing bounty list...');
          console.log('BountySniper: Refreshing bounty list...');

          let bounties;

          // If on bounty page, scrape DOM directly (fastest)
          if (location.href.includes('bounties.php')) {
            console.log('BountySniper: Scraping bounty page DOM');
            bounties = parseBountyDOM();
          } else {
            // Use iframe to load bounty page and scrape after React renders
            console.log('BountySniper: Loading bounty page via iframe...');
            try {
              bounties = await fetchBountyPage();
            } catch (fetchErr) {
              console.error('BountySniper: Fetch failed:', fetchErr);
              updateStatus('Fetch failed');
              return;
            }
          }

          console.log('BountySniper: Parsed', bounties.length, 'bounties');

          if (bounties.length === 0) {
            updateStatus('No bounties found');
            renderPanel();
            return;
          }

          // Deduplicate by userId (keep highest reward entry)
          const bountyMap = new Map();
          for (const b of bounties) {
            const existing = bountyMap.get(b.userId);
            if (!existing || b.reward > existing.reward) {
              bountyMap.set(b.userId, b);
            }
          }
          cachedBounties = Array.from(bountyMap.values());
          console.log('BountySniper: After deduplication:', cachedBounties.length, 'unique bounties');

          // Apply initial filter (non-strict, lets unknown hospital times through)
          cachedCandidates = filterBounties(cachedBounties, false);
          console.log('BountySniper: After initial filtering:', cachedCandidates.length, 'candidates');

          // Check beaten status for all candidates (uses local DB, no API)
          for (const bounty of cachedCandidates) {
            bounty.beaten = await checkBeatenStatus(bounty.userId);
          }

          // Sort candidates for processing order
          // 1. Prioritize candidates matching user's enabled statuses (page-scraped hint)
          // 2. Not yet checked (no RSI cache)
          // 3. Okay status first
          // 4. Beaten before
          // 5. By reward
          cachedCandidates.sort((a, b) => {
            // First: prioritize candidates matching enabled status settings
            // This uses page-scraped status as a HINT (not a filter)
            const aMatchesPrefs = statusMatchesPrefs(a.status);
            const bMatchesPrefs = statusMatchesPrefs(b.status);
            if (aMatchesPrefs && !bMatchesPrefs) return -1;
            if (!aMatchesPrefs && bMatchesPrefs) return 1;

            // Then: unchecked candidates
            const aHasCache = rsiCache.has(a.userId) && (now - rsiCache.get(a.userId).timestamp) < RSI_CACHE_TTL;
            const bHasCache = rsiCache.has(b.userId) && (now - rsiCache.get(b.userId).timestamp) < RSI_CACHE_TTL;
            if (!aHasCache && bHasCache) return -1;
            if (aHasCache && !bHasCache) return 1;

            // Okay status gets priority
            if (a.status === 'Okay' && b.status !== 'Okay') return -1;
            if (a.status !== 'Okay' && b.status === 'Okay') return 1;
            // Then beaten before
            if (a.beaten?.wins && !b.beaten?.wins) return -1;
            if (!a.beaten?.wins && b.beaten?.wins) return 1;
            // Then by reward
            return b.reward - a.reward;
          });

          // Reset scan index on refresh
          scanIndex = 0;
          lastBountyFetch = now;

          // Clean up verified targets - remove those no longer on bounty list
          const currentUserIds = new Set(cachedBounties.map(b => b.userId));
          for (const userId of verifiedTargets.keys()) {
            if (!currentUserIds.has(userId)) {
              verifiedTargets.delete(userId);
            }
          }
        }

        // PHASE 1.5: Verify existing panel targets are still valid
        // This runs FIRST to ensure panel accuracy (uses up to 5 API calls for 5 targets)
        if (verifiedTargets.size > 0) {
          updateStatus('Verifying targets...');
          const verifyApiCalls = await verifyPanelTargets();
          console.log(`BountySniper: Target verification used ${verifyApiCalls} API calls`);
        }

        // PHASE 2: Progressive API checking from current scan position
        if (cachedCandidates.length === 0) {
          updateStatus('No candidates');
          renderPanel();
          return;
        }

        const budget = settings.sniperApiBudget;
        let apiCallsMade = 0;
        let checkedThisCycle = 0;
        const startIndex = scanIndex;

        console.log(`BountySniper: Starting API check from index ${scanIndex}/${cachedCandidates.length}, budget: ${budget}`);
        updateStatus(`Checking ${scanIndex}/${cachedCandidates.length}...`);

        // Process candidates starting from scanIndex
        while (checkedThisCycle < cachedCandidates.length && canUseApi()) {
          const idx = (startIndex + checkedThisCycle) % cachedCandidates.length;
          const bounty = cachedCandidates[idx];
          checkedThisCycle++;

          // Check if already cached
          const cached = rsiCache.get(bounty.userId);
          if (cached && (Date.now() - cached.timestamp) < RSI_CACHE_TTL) {
            // Use cached data
            bounty.rsi = cached.rsi;
            bounty.status = cached.rsi.status || bounty.status;
            bounty.hospitalTime = cached.rsi.hospitalTime;

            // If this is a verified good target, update in verified map
            const result = isGoodTarget(bounty);
            if (result.valid) {
              bounty.valueScore = calculateValueScore(bounty);
              verifiedTargets.set(bounty.userId, bounty);
            } else {
              verifiedTargets.delete(bounty.userId);
            }
            continue;
          }

          // Need to make API call
          bounty.rsi = await getRsi(bounty.userId);
          apiCallsMade++;

          if (bounty.rsi) {
            bounty.status = bounty.rsi.status || bounty.status;
            bounty.hospitalTime = bounty.rsi.hospitalTime;

            // Check if this is a good target
            const result = isGoodTarget(bounty);
            if (result.valid) {
              bounty.valueScore = calculateValueScore(bounty);
              verifiedTargets.set(bounty.userId, bounty);
              console.log(`BountySniper: ✓ Good target: ${bounty.name} (${bounty.status}, RSI: ${bounty.rsi.adjusted?.toFixed(0) || '?'}%)`);
            } else {
              verifiedTargets.delete(bounty.userId);
              console.log(`BountySniper: ✗ Filtered: ${bounty.name} - ${result.reason}`);
            }
          }

          // Throttled delay between API calls
          await new Promise(r => setTimeout(r, API_CALL_DELAY));
        }

        // Update scan index for next cycle
        scanIndex = (startIndex + checkedThisCycle) % cachedCandidates.length;

        const progress = Math.round((getCheckedCount() / cachedCandidates.length) * 100);
        const cacheHits = checkedThisCycle - apiCallsMade;

        // Detailed logging for debugging
        if (apiCallsMade === 0 && checkedThisCycle > 0) {
          console.log(`BountySniper: All ${checkedThisCycle} candidates used cached data (${cacheHits} cache hits, progress: ${progress}%)`);
        } else if (checkedThisCycle === 0) {
          console.log(`BountySniper: No candidates checked this cycle (API budget: ${apiCallsThisMinute}/${settings.sniperApiBudget}, progress: ${progress}%)`);
        } else {
          console.log(`BountySniper: Made ${apiCallsMade} API calls, ${cacheHits} cache hits, checked ${checkedThisCycle} candidates, progress: ${progress}%`);
        }

        // If we hit 100% and bounties were refreshed, clear cache for removed players
        if (progress === 100 && needsBountyRefresh) {
          const currentIds = new Set(cachedCandidates.map(c => c.userId));
          let clearedCount = 0;
          for (const [userId] of rsiCache) {
            if (!currentIds.has(userId)) {
              rsiCache.delete(userId);
              clearedCount++;
            }
          }
          if (clearedCount > 0) {
            console.log(`BountySniper: Cleared ${clearedCount} stale cache entries for removed bounties`);
          }
        }

        // PHASE 3: Build targets from verified targets
        // Save current target IDs BEFORE updating for sound alert comparison
        const previousTargetIds = new Set(targets.map(t => t.userId));

        const verifiedArray = Array.from(verifiedTargets.values());
        targets = sortTargets(verifiedArray).slice(0, MAX_TARGETS);

        // Check for NEW targets that just appeared in the panel
        const newTargetsInPanel = targets.filter(t => !previousTargetIds.has(t.userId));
        if (newTargetsInPanel.length > 0) {
          console.log(`BountySniper: 🆕 New targets detected: ${newTargetsInPanel.map(t => t.name).join(', ')}`);
          if (settings.sniperSoundAlert) {
            playAlertSound();
          }
        }

        // Update status
        const statusMsg = `${targets.length} targets | ${progress}% scanned`;
        updateStatus(statusMsg);

        // Broadcast targets to other tabs
        broadcastTargets();

        // Update UI
        renderPanel();

      } catch (e) {
        console.error('BountySniper: Scan error', e);
        updateStatus('Error: ' + (e.message || 'Unknown'));
      }
    }

    // Check if a bounty passes all filters (after API verification)
    function isGoodTarget(bounty) {
      // Must have RSI data
      if (!bounty.rsi) {
        return { valid: false, reason: 'no RSI data' };
      }

      // NEW PLAYER PROTECTION: Cannot attack players level 15 or below
      const playerLevel = bounty.rsi.level || bounty.level || 0;
      if (playerLevel > 0 && playerLevel <= 15) {
        return { valid: false, reason: `Level ${playerLevel} ≤ 15 (protected)` };
      }

      // NEW PLAYER PROTECTION: Cannot attack players 15 days old or less
      const playerAge = bounty.rsi.age || 0;
      if (playerAge > 0 && playerAge <= 15) {
        return { valid: false, reason: `Age ${playerAge} days ≤ 15 (protected)` };
      }

      // RSI filter - add null safety
      const rsiValue = bounty.rsi.adjusted;
      if (rsiValue === null || rsiValue === undefined) {
        return { valid: false, reason: 'RSI value is null' };
      }
      if (rsiValue < settings.sniperRsiMin) {
        return { valid: false, reason: `RSI ${rsiValue.toFixed(0)}% < ${settings.sniperRsiMin}% min` };
      }
      if (rsiValue > settings.sniperRsiMax) {
        return { valid: false, reason: `RSI ${rsiValue.toFixed(0)}% > ${settings.sniperRsiMax}% max` };
      }

      // Status filter
      if (bounty.status === 'Unknown') {
        return { valid: false, reason: 'unknown status' };
      }

      if (bounty.status === 'Okay') {
        if (!settings.sniperShowOkay) {
          return { valid: false, reason: 'Okay (setting disabled)' };
        }
      }

      if (bounty.status === 'Hospital') {
        if (!settings.sniperShowHospital) {
          return { valid: false, reason: 'Hospital (setting disabled)' };
        }
        if (bounty.hospitalTime === null || bounty.hospitalTime > settings.sniperHospitalMins) {
          return { valid: false, reason: `Hospital ${bounty.hospitalTime?.toFixed(0) || '?'} mins > ${settings.sniperHospitalMins} threshold` };
        }
      }

      if (bounty.status === 'Traveling') {
        if (!settings.sniperShowTraveling) {
          return { valid: false, reason: 'Traveling (setting disabled)' };
        }
      }

      return { valid: true, reason: null };
    }

    // Count how many candidates have been checked (have fresh cache)
    function getCheckedCount() {
      const now = Date.now();
      return cachedCandidates.filter(c => {
        const cached = rsiCache.get(c.userId);
        return cached && (now - cached.timestamp) < RSI_CACHE_TTL;
      }).length;
    }

    // Verify targets currently in panel are still valid
    // Returns number of API calls made
    async function verifyPanelTargets() {
      const now = Date.now();
      let apiCallsMade = 0;
      const targetsToRemove = [];

      for (const [userId, target] of verifiedTargets) {
        // Check if target needs re-verification (every 60 seconds)
        const lastVerified = targetLastVerified.get(userId) || 0;
        if ((now - lastVerified) < TARGET_VERIFY_TTL) {
          continue;  // Recently verified, skip
        }

        // Check API budget
        if (!canUseApi()) {
          console.log('BountySniper: API budget exhausted during target verification');
          break;
        }

        // Re-fetch player data with FORCE REFRESH to bypass cache
        console.log(`BountySniper: Verifying target: ${target.name} (forcing fresh API call)`);
        const rsi = await getRsi(userId, true);  // true = force refresh, bypass cache
        apiCallsMade++;
        targetLastVerified.set(userId, now);

        if (!rsi) {
          console.log(`BountySniper: ⚠ Could not verify ${target.name} - API error`);
          continue;  // Keep target for now, will retry next cycle
        }

        // Log the status change detection
        const oldStatus = target.status;
        const newStatus = rsi.status;
        if (oldStatus !== newStatus) {
          console.log(`BountySniper: ⚡ Status CHANGED for ${target.name}: ${oldStatus} -> ${newStatus}`);
        }

        // Update target data with fresh API results
        target.rsi = rsi;
        target.status = rsi.status;
        target.hospitalTime = rsi.hospitalTime;

        // Check if still valid against current settings
        const result = isGoodTarget(target);
        if (!result.valid) {
          console.log(`BountySniper: 🔴 Target no longer valid: ${target.name} - ${result.reason}`);
          targetsToRemove.push(userId);
        } else {
          console.log(`BountySniper: ✅ Target still valid: ${target.name} (${target.status}, RSI: ${rsi.adjusted?.toFixed(0) || '?'}%)`);
          target.valueScore = calculateValueScore(target);
        }

        // Throttled delay between API calls
        await new Promise(r => setTimeout(r, API_CALL_DELAY));
      }

      // Remove invalid targets
      for (const userId of targetsToRemove) {
        verifiedTargets.delete(userId);
        targetLastVerified.delete(userId);
      }

      // Also remove from targets array
      if (targetsToRemove.length > 0) {
        targets = targets.filter(t => !targetsToRemove.includes(t.userId));
        renderPanel();
        broadcastTargets();
      }

      return apiCallsMade;
    }

    // Audio context (persistent, unlocked on user gesture)
    let audioCtx = null;
    let audioUnlocked = false;

    // Unlock audio on first user interaction
    function unlockAudio() {
      if (audioUnlocked) return;

      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create and play a silent buffer to unlock
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);

        audioUnlocked = true;
        console.log('BountySniper: Audio unlocked');
      } catch (e) {
        console.log('BountySniper: Audio unlock failed', e);
      }
    }

    // Play alert sound
    function playAlertSound() {
      try {
        // Create context if needed
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume if suspended (browser policy)
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().then(() => {
            playBeep();
          }).catch(e => {
            console.log('BountySniper: Could not resume audio context', e);
          });
        } else {
          playBeep();
        }
      } catch (e) {
        console.log('BountySniper: Audio not available', e);
      }
    }

    // Actually play the beep sound
    function playBeep() {
      if (!audioCtx) return;

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Two-tone alert (more noticeable)
        osc.frequency.value = 880;  // A5
        gain.gain.value = 0.3;
        osc.start();

        // Frequency sweep for attention
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);

        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.3);

        console.log('BountySniper: 🔊 Alert sound played');
      } catch (e) {
        console.log('BountySniper: Beep failed', e);
      }
    }

    // Format reward for display
    function formatReward(reward) {
      if (reward >= 1000000) return `$${(reward / 1000000).toFixed(1)}M`;
      if (reward >= 1000) return `$${Math.round(reward / 1000)}k`;
      return `$${reward}`;
    }

    // Update status text in panel
    function updateStatus(text) {
      if (!panelEl) return;
      const status = panelEl.querySelector('.ff-sniper-status');
      if (status) {
        const roleIndicator = isLeader ? '<span class="leader">●</span>' : '<span class="follower">●</span>';
        const budget = `${apiCallsThisMinute}/${settings.sniperApiBudget}`;
        status.innerHTML = `${roleIndicator} ${text} | API: ${budget}/min`;
      }
    }

    // Render the sniper panel UI
    function renderPanel() {
      if (!panelEl) {
        createPanel();
      }

      const badge = panelEl.querySelector('.ff-sniper-badge');
      const list = panelEl.querySelector('.ff-sniper-list');
      const status = panelEl.querySelector('.ff-sniper-status');

      // Update badge count
      if (badge) {
        badge.textContent = targets.length;
        badge.className = `ff-sniper-badge${targets.length === 0 ? ' empty' : ''}`;
      }

      // Update list
      if (list) {
        if (targets.length === 0) {
          list.innerHTML = '<div style="padding:10px;text-align:center;color:#666;font-style:italic;">No targets found</div>';
        } else {
          list.innerHTML = targets.map(t => {
            const rsiClass = !t.rsi ? '' : t.rsi.adjusted < settings.lowHigh ? 'high' : t.rsi.adjusted < settings.highMed ? 'med' : 'low';
            const rsiText = t.rsi ? `${Math.round(t.rsi.adjusted)}%` : '...';
            const beatenIcon = t.beaten?.wins > 0 ? `<span class="ff-sniper-beaten" title="Beat ${t.beaten.wins}x">⭐</span>` : '';

            return `
              <div class="ff-sniper-item">
                <span class="ff-sniper-rsi ${rsiClass}">${rsiText}</span>
                <span class="ff-sniper-name">
                  <a href="https://www.torn.com/profiles.php?XID=${t.userId}" target="_blank">${escapeHtml(t.name)}</a>
                  ${beatenIcon}
                </span>
                <span class="ff-sniper-reward">${formatReward(t.reward)}</span>
                <a class="ff-sniper-atk" href="https://www.torn.com/loader.php?sid=attack&user2ID=${t.userId}" target="_blank">ATK</a>
              </div>
            `;
          }).join('');
        }
      }

      // Update status
      if (status) {
        const budget = `${apiCallsThisMinute}/${settings.sniperApiBudget}`;
        status.innerHTML = `<span class="scanning">Scanning</span> | API: ${budget}/min`;
      }
    }

    // Create the panel element
    function createPanel() {
      // DUPLICATE PREVENTION: Check if panel already exists
      if (panelCreated || document.querySelector('.ff-sniper-panel')) {
        console.log('BountySniper: Panel already exists, skipping creation');
        // If panelEl is null but DOM has panel, grab reference
        if (!panelEl) {
          panelEl = document.querySelector('.ff-sniper-panel');
        }
        return;
      }

      // Load saved collapsed state
      try {
        const savedCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED);
        if (savedCollapsed !== null) {
          isCollapsed = JSON.parse(savedCollapsed);
        }
      } catch (e) {}

      panelEl = document.createElement('div');
      panelEl.className = 'ff-sniper-panel' + (isCollapsed ? ' collapsed' : '') + (!isLeader ? ' follower' : '');
      panelEl.setAttribute('data-tab-id', TAB_ID);  // Mark which tab created this
      panelEl.innerHTML = `
        <div class="ff-sniper-header">
          <span class="ff-sniper-title">
            🎯 <span>Sniper</span>
            <span class="ff-sniper-badge empty">0</span>
            <span class="ff-sniper-leader-btn" title="Click to make this tab the leader">📡</span>
          </span>
          <span class="ff-sniper-toggle">${isCollapsed ? '▶' : '▼'}</span>
        </div>
        <div class="ff-sniper-list"></div>
        <div class="ff-sniper-status">Initializing...</div>
      `;

      // Toggle collapse on toggle button click only (not whole header - that's for drag)
      const toggle = panelEl.querySelector('.ff-sniper-toggle');
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockAudio();  // Unlock audio on user interaction
        isCollapsed = !isCollapsed;
        panelEl.classList.toggle('collapsed', isCollapsed);
        toggle.textContent = isCollapsed ? '▶' : '▼';
        // Save collapsed state
        try {
          localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(isCollapsed));
        } catch (err) {}
      });

      // Unlock audio on any click on the panel
      panelEl.addEventListener('click', () => {
        unlockAudio();
      }, { once: true });  // Only need to unlock once

      // Click satellite icon to become leader (only visible on followers)
      const leaderBtn = panelEl.querySelector('.ff-sniper-leader-btn');
      leaderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isLeader) {
          forceLeadership();
        }
      });

      document.body.appendChild(panelEl);
      panelCreated = true;  // Mark as created

      // Apply saved position
      const pos = getSavedPosition();
      applyPosition(pos.x, pos.y);

      // Setup drag listeners
      setupDragListeners();

      // Update role display
      updatePanelRole();

      // Unlock audio on any document interaction (for sound alerts)
      document.addEventListener('click', unlockAudio, { once: true });
      document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    // Start the sniper
    function start() {
      if (!settings.sniperEnabled) return;

      console.log(`BountySniper: Starting on ${isMobilePDA ? 'MOBILE/PDA' : 'DESKTOP'} (Tab: ${TAB_ID})`);

      // DUPLICATE PREVENTION: Check for existing panels on page
      const existingPanels = document.querySelectorAll('.ff-sniper-panel');
      if (existingPanels.length > 1) {
        console.log('BountySniper: Multiple panels detected, removing extras');
        for (let i = 1; i < existingPanels.length; i++) {
          existingPanels[i].remove();
        }
      }

      isEnabled = true;
      receivedUpdatesDuringDelay = false;

      // Check if there's an ACTIVE leader (heartbeat within timeout) - another tab scanning
      const currentLeader = localStorage.getItem(STORAGE_KEY_LEADER);
      const lastHeartbeat = parseInt(localStorage.getItem(STORAGE_KEY_HEARTBEAT) || '0', 10);
      const heartbeatAge = Date.now() - lastHeartbeat;
      const hasActiveLeader = currentLeader && currentLeader !== TAB_ID && heartbeatAge < LEADER_TIMEOUT;

      console.log(`BountySniper: Leadership check - activeLeader: ${hasActiveLeader}, heartbeatAge: ${(heartbeatAge/1000).toFixed(0)}s`);

      // ALWAYS try to load saved state - loadFullState() has built-in 5-minute freshness check
      // Returns true if fresh data was loaded, false if stale/missing
      const hasFreshState = loadFullState();

      console.log(`BountySniper: loadFullState returned ${hasFreshState} (has fresh saved data: ${hasFreshState})`);

      if (!hasFreshState) {
        // No fresh state - clear any stale data and start fresh
        console.log('BountySniper: No fresh state - starting clean');
        targets = [];
        cachedCandidates = [];
        cachedBounties = [];
        verifiedTargets.clear();
        rsiCache.clear();
      }

      // Setup cross-tab sync
      setupStorageListener();

      // Create panel
      if (!panelEl) {
        createPanel();
      }
      panelEl.style.display = 'block';

      // Mark navigation for future page loads
      window.addEventListener('beforeunload', markNavigating);
      window.addEventListener('pagehide', markNavigating);

      // DECISION: Should we delay leadership claim?
      // Delay if: another tab is actively leading, OR we have fresh state to preserve
      const shouldDelayLeadership = hasActiveLeader || hasFreshState;

      console.log(`BountySniper: shouldDelay=${shouldDelayLeadership} (activeLeader=${hasActiveLeader}, hasFreshState=${hasFreshState})`);

      if (shouldDelayLeadership) {
        // Start as provisional follower - preserve data, wait before claiming leadership
        isProvisionalFollower = true;
        isLeader = false;
        updatePanelRole();
        renderPanel();
        updateStatus(`${targets.length} targets | Syncing...`);

        console.log(`BountySniper: Starting as PROVISIONAL FOLLOWER (delay: ${LEADERSHIP_CLAIM_DELAY/1000}s)`);

        // Start heartbeat checking (storage events will handle target updates)
        heartbeatInterval = setInterval(() => {
          if (isLeader) {
            checkLeader();
          }
        }, HEARTBEAT_INTERVAL);

        // DELAYED LEADERSHIP CLAIM
        leadershipClaimTimer = setTimeout(() => {
          isProvisionalFollower = false;

          // Check if we received updates during the delay
          if (receivedUpdatesDuringDelay) {
            console.log('BountySniper: Received updates during delay, staying as follower');
            // Continue as follower, check if leader is still alive
            checkLeader();
          } else {
            // No updates received, check if we should become leader
            const nowHeartbeat = parseInt(localStorage.getItem(STORAGE_KEY_HEARTBEAT) || '0', 10);
            const nowAge = Date.now() - nowHeartbeat;

            if (nowAge > LEADER_TIMEOUT) {
              console.log(`BountySniper: No leader activity for ${(nowAge/1000).toFixed(0)}s, claiming leadership`);
              tryBecomeLeader();  // This now starts scanning if we become leader
            } else {
              console.log('BountySniper: Leader is active, remaining as follower');
            }
          }

          // Setup visibility tracking after delay (for both mobile and desktop)
          setupVisibilityTracking();

        }, LEADERSHIP_CLAIM_DELAY);

      } else {
        // No active leader: immediate start as leader
        console.log('BountySniper: No active leader detected, starting as LEADER immediately');
        isProvisionalFollower = false;
        tryBecomeLeader();  // This now starts scanning if we become leader

        // Start heartbeat interval
        heartbeatInterval = setInterval(() => {
          checkLeader();
        }, HEARTBEAT_INTERVAL);

        // Setup visibility tracking
        setupVisibilityTracking();

        // Render empty panel
        renderPanel();
        updateStatus('Starting scan...');
      }

      // Setup watchdog for crash recovery
      setupWatchdog();
    }

    // Start scanning as leader (extracted for reuse)
    function startLeaderScanning() {
      scan();

      // Set up scan interval
      const intervalMs = settings.sniperFetchInterval * 1000;
      if (scanInterval) {
        clearInterval(scanInterval);
      }
      scanInterval = setInterval(() => {
        if (isLeader) {
          scan();
          broadcastScanState();
        }
      }, intervalMs);

      console.log(`BountySniper: Started as LEADER (interval: ${settings.sniperFetchInterval}s, budget: ${settings.sniperApiBudget}/min)`);
    }

    // Stop the sniper
    function stop() {
      isEnabled = false;

      if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
      }

      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }

      if (visibilityCheckInterval) {
        clearInterval(visibilityCheckInterval);
        visibilityCheckInterval = null;
      }

      if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
      }

      if (leadershipClaimTimer) {
        clearTimeout(leadershipClaimTimer);
        leadershipClaimTimer = null;
      }

      // Save state before stopping (for mobile navigation)
      if (isLeader) {
        saveFullState();
        localStorage.removeItem(STORAGE_KEY_LEADER);
        isLeader = false;
      }

      if (panelEl) {
        panelEl.style.display = 'none';
      }
      console.log('BountySniper: Stopped');
    }

    // Toggle sniper on/off
    function toggle(enabled) {
      if (enabled) {
        start();
      } else {
        stop();
      }
    }

    // Cleanup when tab is closing
    function cleanup() {
      // Save state before leaving (critical for mobile)
      if (isLeader) {
        saveFullState();
        markNavigating();
        // Give up leadership so other tabs can take over
        localStorage.removeItem(STORAGE_KEY_LEADER);
        console.log('BountySniper: Saved state and released leadership on tab close');
      } else {
        markNavigating();
      }
    }

    // Listen for tab close/unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    // Public API
    return {
      start,
      stop,
      toggle,
      scan,
      getTargets: () => targets,
      isRunning: () => isEnabled,
      isLeader: () => isLeader,
      getTabId: () => TAB_ID
    };
  })();


  // ============================================================================
  // JAIL BUST SNIPER
  // ============================================================================

  const JailBustSniper = (() => {
    // State
    let isEnabled = false;
    let panelEl = null;
    let panelCreated = false;
    let targets = [];
    let cachedPrisoners = [];
    let scanIndex = 0;
    let lastJailFetch = 0;
    let scanInterval = null;
    let isCollapsed = false;

    // Multi-tab coordination
    let isLeader = false;
    const TAB_ID = `bust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const STORAGE_KEY_LEADER = 'ff-bust-leader';
    const STORAGE_KEY_TARGETS = 'ff-bust-targets';
    const STORAGE_KEY_POSITION = 'ff-bust-sniper-pos';
    const STORAGE_KEY_COLLAPSED = 'ff-bust-sniper-collapsed';
    const LEADER_HEARTBEAT_INTERVAL = 5000;  // Reduced from 2000 to 5000 (less aggressive)
    const LEADER_TIMEOUT = 12000;  // Increased from 5000 to 12000 (more tolerance)

    // Constants
    const MAX_TARGETS = settings.bustSniperMaxTargets || 10;
    const SCAN_INTERVAL = (settings.bustSniperFetchInterval || 30) * 1000;
    const PAGE_LOAD_DELAY = 2000;
    const isMobilePDA = window.innerWidth <= 768 || Env.isPDA;

    // Audio context
    let audioCtx = null;
    let audioUnlocked = false;

    /**
     * Check if this tab should be the leader
     */
    function electLeader() {
      const stored = localStorage.getItem(STORAGE_KEY_LEADER);

      if (!stored) {
        // No leader exists, become leader
        isLeader = true;
        saveLeaderInfo();
        console.log('JailBustSniper: Elected as leader (no existing leader)');
        return;
      }

      try {
        const leaderInfo = JSON.parse(stored);
        const now = Date.now();

        // Check if leader is still alive
        if (now - leaderInfo.heartbeat < LEADER_TIMEOUT) {
          // Leader is active
          if (leaderInfo.tabId === TAB_ID) {
            isLeader = true;
          } else {
            isLeader = false;
            console.log('JailBustSniper: Following existing leader');
          }
        } else {
          // Leader is dead, take over
          isLeader = true;
          saveLeaderInfo();
          console.log('JailBustSniper: Elected as leader (previous leader timeout)');
        }
      } catch (e) {
        // Corrupted data, become leader
        isLeader = true;
        saveLeaderInfo();
      }
    }

    /**
     * Force this tab to become leader
     */
    function forceLeadership() {
      isLeader = true;
      saveLeaderInfo();
      console.log('JailBustSniper: Forced leadership');
      updatePanelRole();
      scan(); // Immediately scan as new leader
    }

    /**
     * Save leader information
     */
    function saveLeaderInfo() {
      if (isLeader) {
        try {
          localStorage.setItem(STORAGE_KEY_LEADER, JSON.stringify({
            tabId: TAB_ID,
            heartbeat: Date.now()
          }));
        } catch (e) {
          console.error('JailBustSniper: Failed to save leader info:', e);
        }
      }
    }

    /**
     * Broadcast targets to other tabs
     */
    function broadcastTargets() {
      if (isLeader) {
        localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify({
          targets,
          timestamp: Date.now(),
          leaderId: TAB_ID
        }));
      }
    }

    /**
     * Listen for target updates from leader
     */
    function listenForTargets() {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_TARGETS && !isLeader) {
          try {
            const data = JSON.parse(e.newValue);
            if (data && data.targets) {
              targets = data.targets;
              renderPanel();
            }
          } catch (err) {
            console.error('JailBustSniper: Error parsing targets', err);
          }
        }
      });
    }

    /**
     * Update panel to show leader/follower status
     */
    function updatePanelRole() {
      if (!panelEl) return;

      if (isLeader) {
        panelEl.classList.remove('follower');
      } else {
        panelEl.classList.add('follower');
      }

      const leaderBtn = panelEl.querySelector('.ff-bust-leader-btn');
      if (leaderBtn) {
        leaderBtn.style.display = isLeader ? 'none' : 'inline';
      }
    }

    /**
     * Parse jail page DOM to extract prisoner data
     * ENHANCED with extensive debugging and multiple parsing strategies
     */
    /**
     * Parse jail page DOM to extract prisoner data
     * SMART TABLE PARSER - Detects column structure and extracts data correctly
     */
    function parseJailFromDoc(doc, pageNum = 1) {
      const prisoners = [];

      console.log('JailBustSniper: 🔍 Smart Table Parser - Starting analysis...');

      // STEP 1: Find the jail list table/container
      // Try multiple selectors for the main jail list
      let jailContainer = doc.querySelector('ul.jail-list, ul.users-list, ul[class*="jail"], ul[class*="user"], div.user-info-list-wrap, .content-wrapper');

      if (!jailContainer) {
        // Fallback: find any list with user links
        const userLinks = doc.querySelectorAll('a[href*="profiles.php?XID="]');
        if (userLinks.length > 0) {
          jailContainer = userLinks[0].closest('ul, div[class*="list"], div[class*="wrap"]') || doc.body;
        } else {
          console.log('JailBustSniper: ❌ No jail list found');
          return prisoners;
        }
      }

      console.log(`JailBustSniper: Found jail container: ${jailContainer.className || jailContainer.tagName}`);

      // STEP 2: Find all prisoner rows
      // Try multiple selectors
      let rows = jailContainer.querySelectorAll('li[class*="user"], li');

      if (rows.length === 0) {
        rows = jailContainer.querySelectorAll('div[class*="user-info"]');
      }

      if (rows.length === 0) {
        rows = jailContainer.querySelectorAll('tr');
      }

      console.log(`JailBustSniper: Found ${rows.length} potential prisoner rows`);

      // STEP 3: Analyze first row to understand structure
      if (rows.length > 0) {
        const firstRow = rows[0];
        const rowText = firstRow.textContent;
        console.log(`JailBustSniper: 📊 Sample row text: "${rowText.substring(0, 200)}..."`);

        // Check what data patterns exist
        const hasTimePattern = /\d+[hm]\s*\d*[m]?/.test(rowText);
        const hasLevelNumber = /\d{1,3}/.test(rowText);
        console.log(`JailBustSniper: Row analysis - Has time pattern: ${hasTimePattern}, Has numbers: ${hasLevelNumber}`);
      }

      // STEP 4: Parse each row with intelligent extraction
      let successCount = 0;
      let failCount = 0;

      rows.forEach((row, index) => {
        try {
          // === EXTRACT USER ID AND NAME ===
          const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
          if (!profileLink) {
            failCount++;
            return;
          }

          const userIdMatch = profileLink.href.match(/XID=(\d+)/);
          if (!userIdMatch) {
            failCount++;
            return;
          }

          const userId = userIdMatch[1];
          let name = profileLink.textContent.trim();

          // Clean up name (remove extra whitespace, icons, etc.)
          name = name.replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim();

          // === EXTRACT SENTENCE TIME ===
          let sentence = 0;
          const rowText = row.textContent;

          // Strategy: Find time patterns (handle various formats)
          // Examples: "51h 18m", "5h", "45m", "2h 30m", "1h18m"
          const timePatterns = [
            { regex: /(\d+)\s*h\s*(\d+)\s*m/i, parse: m => parseInt(m[1]) * 60 + parseInt(m[2]) },
            { regex: /(\d+)\s*h\s*(\d+)/i, parse: m => parseInt(m[1]) * 60 + parseInt(m[2]) },
            { regex: /(\d+)h(\d+)m/i, parse: m => parseInt(m[1]) * 60 + parseInt(m[2]) },
            { regex: /(\d+)\s*h/i, parse: m => parseInt(m[1]) * 60 },
            { regex: /(\d+)\s*m/i, parse: m => parseInt(m[1]) }
          ];

          for (const { regex, parse } of timePatterns) {
            const match = rowText.match(regex);
            if (match) {
              sentence = parse(match);
              if (sentence > 0 && sentence < 20000) { // Sanity check (max ~333 hours)
                break;
              }
            }
          }

          // === EXTRACT LEVEL ===
          let level = 0;

          // Strategy 1: Look in specific elements that typically hold level
          // Check all divs, spans, and tds for standalone numbers
          const allElements = row.querySelectorAll('div, span, td, li');
          const numberCandidates = [];

          for (const el of allElements) {
            const text = el.textContent.trim();
            // Look for text that is ONLY a number (with optional label)
            if (/^(Level\s*)?(\d{1,3})$/i.test(text)) {
              const num = parseInt(text.match(/\d+/)[0], 10);
              if (num >= 1 && num <= 100) {
                numberCandidates.push({ num, element: el.tagName, text });
              }
            }
          }

          // If we found candidates, pick the most likely one
          // Preference: numbers in the middle range (levels are usually 1-100)
          if (numberCandidates.length > 0) {
            // Sort by how "level-like" they are (favor 1-100 range)
            numberCandidates.sort((a, b) => {
              // Prefer numbers in typical level range
              const scoreA = (a.num >= 1 && a.num <= 100) ? 100 - Math.abs(50 - a.num) : 0;
              const scoreB = (b.num >= 1 && b.num <= 100) ? 100 - Math.abs(50 - b.num) : 0;
              return scoreB - scoreA;
            });

            level = numberCandidates[0].num;
          }

          // Strategy 2: Look for "Level X" pattern in text
          if (!level) {
            const levelMatch = rowText.match(/Level[:\s]+(\d+)/i);
            if (levelMatch) {
              level = parseInt(levelMatch[1], 10);
            }
          }

          // === DETECT JAIL TYPE ===
          let jailType = 'normal';
          const lowerText = rowText.toLowerCase();
          if (lowerText.includes('federal') || lowerText.includes('fed jail') ||
              row.querySelector('[class*="federal"]') ||
              row.querySelector('img[alt*="federal"]')) {
            jailType = 'federal';
          }

          // === FIND TORN'S BUST BUTTON IN THIS ROW ===
          let bustButton = null;

          // Strategy 1: Find link with action=rescue, step=breakout, and matching XID
          // CRITICAL: Must have "breakout" in URL, NOT "buy" (which is the buy-out button)
          const links = row.querySelectorAll('a[href*="rescue"], a[href*="action=rescue"], a.bust, a[class*="bust"]');
          for (const link of links) {
            if (link.href &&
                link.href.includes(`XID=${userId}`) &&
                link.href.includes('rescue') &&
                link.href.includes('breakout') &&  // Must have breakout
                !link.href.includes('step=buy')) {  // Must NOT be buy button
              bustButton = link;
              console.log(`JailBustSniper: Found bust button for ${userId}: ${link.href}`);
              break;
            }
          }

          // Strategy 2: Find any link with breakout in href
          if (!bustButton) {
            for (const link of row.querySelectorAll('a[href]')) {
              if (link.href.includes('breakout') &&
                  link.href.includes(`XID=${userId}`) &&
                  !link.href.includes('step=buy')) {  // Exclude buy buttons
                bustButton = link;
                console.log(`JailBustSniper: Found bust button (strategy 2) for ${userId}: ${link.href}`);
                break;
              }
            }
          }

          // Log if no bust button found (for debugging)
          if (!bustButton) {
            console.log(`JailBustSniper: ⚠️ No bust button found for ${name} [${userId}]`);
          }

          // === CREATE PRISONER OBJECT ===
          if (userId && name) {
            prisoners.push({
              id: userId,
              userId,
              name,
              level: level || 0,
              sentence: sentence || 0,
              jailType,
              bustUrl: `https://www.torn.com/jailview.php?XID=${userId}&action=rescue&step=breakout`,  // First step - shows confirmation
              bustButton: bustButton, // Store the actual DOM element
              pageNum: pageNum,  // Which page this target is on
              pageUrl: pageNum === 1 ? 'https://www.torn.com/jailview.php#' : `https://www.torn.com/jailview.php#start=${(pageNum - 1) * 50}`,
              priorityScore: 0
            });

            successCount++;

            // Detailed logging for first 3 and any that fail to parse completely
            if (index < 3 || !level || !sentence) {
              const levelStr = level ? `Level ${level}` : 'Level N/A ❌';
              const sentenceStr = sentence ? `${sentence} mins` : 'Sentence N/A ❌';
              console.log(`JailBustSniper: Row ${index + 1}: ${name} [${userId}] - ${levelStr}, ${sentenceStr}, ${jailType} jail`);
            }
          } else {
            failCount++;
          }

        } catch (e) {
          console.error(`JailBustSniper: ❌ Error parsing row ${index}:`, e);
          failCount++;
        }
      });

      // === SUMMARY ===
      console.log(`JailBustSniper: ✅ PARSE COMPLETE - ${successCount} prisoners extracted, ${failCount} failed`);

      // Show stats on what was parsed
      const withLevel = prisoners.filter(p => p.level > 0).length;
      const withSentence = prisoners.filter(p => p.sentence > 0).length;
      const complete = prisoners.filter(p => p.level > 0 && p.sentence > 0).length;

      console.log(`JailBustSniper: 📊 Parse quality - Complete: ${complete}, With level: ${withLevel}, With sentence: ${withSentence}`);

      if (complete < prisoners.length * 0.5) {
        console.warn(`JailBustSniper: ⚠️ LOW QUALITY PARSE - Only ${Math.round(complete/prisoners.length*100)}% have complete data`);
        console.log(`JailBustSniper: 💡 Tip: Check browser console for detailed row parsing. The jail page structure may have changed.`);
      }

      return prisoners;
    }

    /**
     * Fetch jail page using hidden iframe
     */
    async function fetchJailPageSingle(pageNum = 1) {
      return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1024px;height:768px;visibility:hidden;';

        // Construct jail page URL with pagination
        // Jail page uses hash fragments: page 1 = #, page 2 = #start=50, page 3 = #start=100
        const start = (pageNum - 1) * 50; // 50 prisoners per page
        const url = pageNum === 1
          ? 'https://www.torn.com/jailview.php#'
          : `https://www.torn.com/jailview.php#start=${start}`;

        let resolved = false;
        let checkInterval;

        const cleanup = () => {
          clearInterval(checkInterval);
          iframe.remove();
        };

        const tryParse = () => {
          try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return null;

            // Look for profile links - if found, page has rendered
            const profileLinks = doc.querySelectorAll('a[href*="profiles.php?XID="]');
            if (profileLinks.length > 0) {
              return doc;
            }
          } catch (e) {
            // Cross-origin error shouldn't happen on same domain
          }
          return null;
        };

        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            console.log(`JailBustSniper: Iframe timeout for page ${pageNum}`);
            reject(new Error('Iframe timeout'));
          }
        }, 30000);

        iframe.onload = () => {
          let attempts = 0;

          checkInterval = setInterval(() => {
            attempts++;
            const doc = tryParse();

            if (doc) {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);

                const prisoners = parseJailFromDoc(doc, pageNum);
                console.log(`JailBustSniper: Page ${pageNum} parsed ${prisoners.length} prisoners`);

                cleanup();
                resolve(prisoners);
              }
            } else if (attempts > 50) {
              // Give up after 25 seconds
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                console.log(`JailBustSniper: Page ${pageNum} content never rendered`);
                reject(new Error('Content not rendered'));
              }
            }
          }, 500);
        };

        iframe.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            cleanup();
            reject(new Error('Iframe load error'));
          }
        };

        iframe.src = url;
        document.body.appendChild(iframe);
      });
    }

    /**
     * Fetch multiple jail pages
     */
    async function fetchJailPages() {
      const MAX_PAGES = Math.min(settings.bustSniperPagesToScan || 2, 5);
      const allPrisoners = [];
      const seenIds = new Set();

      for (let page = 1; page <= MAX_PAGES; page++) {
        console.log(`JailBustSniper: Loading page ${page}/${MAX_PAGES}...`);
        updateStatus(`Loading page ${page}/${MAX_PAGES}...`);

        try {
          const pagePrisoners = await fetchJailPageSingle(page);

          // Add unique prisoners
          let newCount = 0;
          for (const p of pagePrisoners) {
            if (!seenIds.has(p.id)) {
              seenIds.add(p.id);
              allPrisoners.push(p);
              newCount++;
            }
          }

          console.log(`JailBustSniper: Page ${page} found ${pagePrisoners.length} prisoners, ${newCount} new, total: ${allPrisoners.length}`);

          // Stop if no new prisoners (all duplicates = we've hit the end)
          if (newCount === 0 && pagePrisoners.length > 0) {
            console.log(`JailBustSniper: ⚠️ Page ${page} returned ${pagePrisoners.length} prisoners but all were duplicates`);
            console.log(`JailBustSniper: 💡 This means we've reached the last page (only ${page - 1} pages exist)`);
            break;
          }

          // If very few prisoners, might be at end
          if (pagePrisoners.length < 5) {
            console.log('JailBustSniper: Few results, stopping pagination');
            break;
          }

          // Delay between pages
          if (page < MAX_PAGES) {
            await new Promise(r => setTimeout(r, PAGE_LOAD_DELAY));
          }
        } catch (err) {
          console.error(`JailBustSniper: Error loading page ${page}:`, err);
          break;
        }
      }

      return allPrisoners;
    }

    /**
     * Filter prisoners by settings
     * ENHANCED with extensive debugging
     */
    function filterPrisoners(prisoners) {
      console.log('JailBustSniper: 🔍 FILTER DEBUG - Starting filter process');
      console.log('JailBustSniper: Filter settings:', {
        minLevel: settings.bustSniperMinLevel,
        maxLevel: settings.bustSniperMaxLevel,
        minSentence: settings.bustSniperMinSentence,
        maxSentence: settings.bustSniperMaxSentence,
        showNormal: settings.bustSniperShowNormalJail,
        showFederal: settings.bustSniperShowFederalJail
      });

      const rejectionReasons = {
        levelTooLow: 0,
        levelTooHigh: 0,
        sentenceTooShort: 0,
        sentenceTooLong: 0,
        normalJailFiltered: 0,
        federalJailFiltered: 0,
        passed: 0
      };

      const filtered = prisoners.filter((p, index) => {
        let rejectReason = null;

        // Level filter
        if (p.level < settings.bustSniperMinLevel) {
          rejectReason = `level ${p.level} < min ${settings.bustSniperMinLevel}`;
          rejectionReasons.levelTooLow++;
        } else if (p.level > settings.bustSniperMaxLevel) {
          rejectReason = `level ${p.level} > max ${settings.bustSniperMaxLevel}`;
          rejectionReasons.levelTooHigh++;
        }
        // Sentence filter (in minutes)
        else if (p.sentence < settings.bustSniperMinSentence) {
          rejectReason = `sentence ${p.sentence}min < min ${settings.bustSniperMinSentence}min`;
          rejectionReasons.sentenceTooShort++;
        } else if (p.sentence > settings.bustSniperMaxSentence) {
          rejectReason = `sentence ${p.sentence}min > max ${settings.bustSniperMaxSentence}min`;
          rejectionReasons.sentenceTooLong++;
        }
        // Jail type filter
        else if (p.jailType === 'normal' && !settings.bustSniperShowNormalJail) {
          rejectReason = 'normal jail filtered out';
          rejectionReasons.normalJailFiltered++;
        } else if (p.jailType === 'federal' && !settings.bustSniperShowFederalJail) {
          rejectReason = 'federal jail filtered out';
          rejectionReasons.federalJailFiltered++;
        }

        if (rejectReason) {
          if (index < 5) { // Log first 5 rejections
            console.log(`JailBustSniper: ❌ REJECTED ${p.name} [${p.userId}]: ${rejectReason}`);
          }
          return false;
        } else {
          if (index < 5) { // Log first 5 passes
            console.log(`JailBustSniper: ✅ PASSED ${p.name} [${p.userId}] - Level: ${p.level}, Sentence: ${p.sentence}min, Jail: ${p.jailType}`);
          }
          rejectionReasons.passed++;
          return true;
        }
      });

      console.log('JailBustSniper: 📊 FILTER RESULTS:', rejectionReasons);
      console.log(`JailBustSniper: ✅ ${filtered.length}/${prisoners.length} prisoners passed filters`);

      return filtered;
    }

    /**
     * Calculate priority score for a prisoner
     * Lower level + lower sentence = higher score (better target)
     */
    function calculatePriorityScore(prisoner) {
      // Base score starts at 100
      let score = 100;

      // Level component (0-40 points)
      // Lower level = higher score
      // Level 1 gets 40 points, level 100 gets 0 points
      const levelScore = ((100 - prisoner.level) / 100) * 40;
      score -= (40 - levelScore);

      // Sentence component (0-40 points)
      // Lower sentence = higher score
      // 0 minutes gets 40 points, 6000 minutes gets 0 points
      const maxSentence = 6000; // 100 hours
      const sentenceScore = ((maxSentence - Math.min(prisoner.sentence, maxSentence)) / maxSentence) * 40;
      score -= (40 - sentenceScore);

      // Jail type bonus (0-20 points)
      if (prisoner.jailType === 'federal') {
        score += 10; // Federal jail slightly more prestigious
      } else {
        score += 5;
      }

      return Math.max(0, Math.min(100, score));
    }

    /**
     * Sort prisoners by selected strategy
     */
    function sortPrisoners(prisoners) {
      const sorted = [...prisoners];

      switch (settings.bustSniperSortBy) {
        case 'priority':
          // Best priority score first
          return sorted.sort((a, b) => b.priorityScore - a.priorityScore);

        case 'sentence':
          // Shortest sentence first
          return sorted.sort((a, b) => a.sentence - b.sentence);

        case 'level':
          // Lowest level first
          return sorted.sort((a, b) => a.level - b.level);

        case 'name':
          // Alphabetical
          return sorted.sort((a, b) => a.name.localeCompare(b.name));

        default:
          return sorted;
      }
    }

    /**
     * Format time for display
     */
    function formatTime(minutes) {
      if (minutes < 60) {
        return `${minutes}m`;
      } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
    }

    /**
     * Main scan function
     */
    async function scan() {
      if (!isEnabled || !isLeader) return;

      try {
        const now = Date.now();

        // Fetch jail pages
        if (now - lastJailFetch > SCAN_INTERVAL) {
          updateStatus('Fetching jail data...');

          const prisoners = await fetchJailPages();
          cachedPrisoners = prisoners;
          lastJailFetch = now;
          scanIndex = 0;

          console.log(`JailBustSniper: Fetched ${prisoners.length} total prisoners`);
        }

        // Filter and score
        const filtered = filterPrisoners(cachedPrisoners);

        // Calculate priority scores
        filtered.forEach(p => {
          p.priorityScore = calculatePriorityScore(p);
        });

        // Sort and limit
        const sorted = sortPrisoners(filtered);

        // Save current target IDs for comparison
        const previousTargetIds = new Set(targets.map(t => t.userId));

        targets = sorted.slice(0, MAX_TARGETS);

        // Check for new targets
        const newTargetsInPanel = targets.filter(t => !previousTargetIds.has(t.userId));
        if (newTargetsInPanel.length > 0 && settings.bustSniperSoundAlert) {
          console.log(`JailBustSniper: 🆕 New targets: ${newTargetsInPanel.map(t => t.name).join(', ')}`);
          playAlertSound();
        }

        // Update status
        const statusMsg = `${targets.length} targets | ${filtered.length} total`;
        updateStatus(statusMsg);

        // Broadcast to other tabs
        broadcastTargets();

        // Update UI
        renderPanel();

      } catch (e) {
        console.error('JailBustSniper: Scan error', e);
        updateStatus('Error: ' + (e.message || 'Unknown'));
      }
    }

    /**
     * Play alert sound for new targets
     */
    function playAlertSound() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume().then(() => playBeep()).catch(e => {
            console.log('JailBustSniper: Could not resume audio', e);
          });
        } else {
          playBeep();
        }
      } catch (e) {
        console.log('JailBustSniper: Audio not available', e);
      }
    }

    function playBeep() {
      if (!audioCtx) return;

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Two-tone alert
        osc.frequency.value = 660; // E5
        gain.gain.value = 0.3;
        osc.start();

        osc.frequency.setValueAtTime(660, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.2);

        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.3);

        console.log('JailBustSniper: 🔊 Alert sound played');
      } catch (e) {
        console.log('JailBustSniper: Beep failed', e);
      }
    }

    function unlockAudio() {
      if (audioUnlocked) return;

      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
        audioUnlocked = true;
        console.log('JailBustSniper: Audio unlocked');
      } catch (e) {
        console.log('JailBustSniper: Audio unlock failed', e);
      }
    }

    /**
     * Update status text in panel
     */
    function updateStatus(text) {
      if (!panelEl) return;
      const status = panelEl.querySelector('.ff-bust-status');
      if (status) {
        const roleIndicator = isLeader ? '<span class="leader">●</span>' : '<span class="follower">●</span>';
        status.innerHTML = `${roleIndicator} ${text}`;
      }
    }

    /**
     * Render the panel UI
     */
    function renderPanel() {
      if (!panelEl) {
        createPanel();
      }

      const badge = panelEl.querySelector('.ff-bust-badge');
      const list = panelEl.querySelector('.ff-bust-list');

      // Update badge count
      if (badge) {
        badge.textContent = targets.length;
        badge.className = `ff-bust-badge${targets.length === 0 ? ' empty' : ''}`;
      }

      // Update list
      if (list) {
        if (targets.length === 0) {
          list.innerHTML = '<div style="padding:10px;text-align:center;color:#666;font-style:italic;">No targets found</div>';
        } else {
          list.innerHTML = targets.map(t => {
            // Time urgency class
            let timeClass = '';
            if (t.sentence <= 60) timeClass = 'urgent';
            else if (t.sentence <= 180) timeClass = 'soon';

            // Level difficulty badge
            let levelClass = 'easy';
            if (t.level > 50) levelClass = 'hard';
            else if (t.level > 25) levelClass = 'medium';

            const jailIcon = t.jailType === 'federal' ? '⚖️' : '🔒';

            // Status display
            let statusHTML = '';
            if (t.status) {
              let statusColor = '#666';
              let statusIcon = '';
              switch(t.status) {
                case 'busting':
                  statusColor = '#2196f3';
                  statusIcon = '⏳';
                  break;
                case 'not-found':
                  statusColor = '#ff9800';
                  statusIcon = '👻';
                  break;
                case 'success':
                  statusColor = '#4caf50';
                  statusIcon = '✅';
                  break;
                case 'error':
                  statusColor = '#f44336';
                  statusIcon = '❌';
                  break;
              }
              statusHTML = `<div style="font-size:10px;color:${statusColor};margin-top:2px;">${statusIcon} ${escapeHtml(t.statusMessage || '')}</div>`;
            }

            return `
              <div class="ff-bust-item" data-user-id="${t.userId}">
                <span class="ff-bust-time ${timeClass}">${formatTime(t.sentence)}</span>
                <span class="ff-bust-name">
                  <a href="https://www.torn.com/profiles.php?XID=${t.userId}" target="_blank" title="${escapeHtml(t.name)} (Level ${t.level})">${escapeHtml(t.name)}</a>
                  <span class="ff-bust-level ${levelClass}">${t.level}</span>
                  <span class="ff-bust-jail-type">${jailIcon}</span>
                  ${statusHTML}
                </span>
                <button class="ff-bust-btn" data-bust-url="${t.bustUrl}" data-user-id="${t.userId}" data-user-name="${escapeHtml(t.name)}">BUST</button>
              </div>
            `;
          }).join('');
        }
      }
    }

    /**
     * Perform bust by clicking the stored TORN button element
     * Uses the bustButton we found during background scanning
     */
    function performAutoBust(target, buttonEl) {
      if (!target) {
        console.error('JailBustSniper: No target provided');
        return;
      }

      const { userId, userName, name, pageNum, pageUrl } = target;
      const displayName = userName || name;

      console.log(`JailBustSniper: 🎯 Attempting bust for ${displayName} [${userId}] on page ${pageNum || 1}`);

      // Update our button
      if (buttonEl) {
        buttonEl.disabled = true;
        buttonEl.textContent = '🔍';
        buttonEl.style.opacity = '0.6';
      }

      // CHECK: Are we on the correct page?
      const currentUrl = window.location.href;
      const onCorrectPage = pageUrl ? currentUrl.includes(pageUrl.split('#')[1] || 'jailview.php') : true;

      if (!onCorrectPage && pageUrl) {
        console.log(`JailBustSniper: ⚠️ Target is on page ${pageNum}, but we're viewing a different page`);
        console.log(`JailBustSniper: 🚀 Navigating to page ${pageNum} first...`);

        // Store bust intent in sessionStorage
        sessionStorage.setItem('ff-pending-bust', JSON.stringify({
          userId: userId,
          userName: displayName,
          timestamp: Date.now()
        }));

        setTargetStatus(userId, 'busting', `Going to page ${pageNum}...`);
        showPanelMessage(`${displayName}: Navigating to page ${pageNum}...`, 'info');

        // Navigate to target's page
        window.location.href = pageUrl;
        return;  // Will resume on page load
      }

      // STEP 1: Find TORN's bust button on CURRENT page
      console.log(`JailBustSniper: Searching current page for bust button...`);

      let tornButton = null;

      // Search by XID in href - MUST have breakout, NOT buy
      const bustLinks = document.querySelectorAll('a[href*="action=rescue"], a.bust, a[class*="bust"]');
      for (const link of bustLinks) {
        if (link.href &&
            link.href.includes(`XID=${userId}`) &&
            link.href.includes('rescue') &&
            link.href.includes('breakout') &&  // Must be bust, not buy
            !link.href.includes('step=buy')) {
          tornButton = link;
          console.log(`JailBustSniper: ✅ Found bust button on current page via XID match`);
          console.log(`JailBustSniper: Button href: ${link.href}`);
          break;
        }
      }

      // Search in user's row
      if (!tornButton) {
        const listItems = document.querySelectorAll('li, div[class*="user"], div[class*="jail"], tr');
        for (const item of listItems) {
          const profileLink = item.querySelector(`a[href*="XID=${userId}"]`);
          if (profileLink) {
            const bustLink = item.querySelector('a[href*="rescue"], a.bust, a[class*="bust"]');
            if (bustLink &&
                bustLink.href.includes('rescue') &&
                bustLink.href.includes('breakout') &&  // Must be bust
                !bustLink.href.includes('step=buy')) {  // Not buy
              tornButton = bustLink;
              console.log(`JailBustSniper: ✅ Found bust button in user's row`);
              console.log(`JailBustSniper: Button href: ${bustLink.href}`);
              break;
            }
          }
        }
      }

      // No button found
      if (!tornButton) {
        console.error(`JailBustSniper: ❌ Could not find TORN's bust button for user ${userId}`);

        // Check if we're supposedly on the correct page
        if (onCorrectPage && pageUrl) {
          // We're on the "correct" page but button not found
          // This likely means the page is stale (data changed since scan)
          console.log(`JailBustSniper: ⚠️ Button not found but we're on page ${pageNum}`);
          console.log(`JailBustSniper: 💡 Page data is likely stale, forcing refresh...`);

          // Update status
          setTargetStatus(userId, 'not-found', 'Refreshing page...');
          showPanelMessage(`${displayName}: Refreshing page data...`, 'info');

          // Store bust intent
          sessionStorage.setItem('ff-pending-bust', JSON.stringify({
            userId: userId,
            userName: displayName,
            timestamp: Date.now()
          }));

          // Force refresh to get current data
          window.location.reload();
          return;
        }

        // Not on correct page, or player not found (likely already busted)
        console.log(`JailBustSniper: 💡 Player not found - likely already busted by someone else`);

        // Update target status with clear message
        setTargetStatus(userId, 'not-found', 'Already busted');
        showPanelMessage(`${displayName}: Player not found (likely already busted)`, 'warning');

        if (buttonEl) {
          buttonEl.disabled = true;
          buttonEl.textContent = '👻';
          buttonEl.title = 'Player not found (likely already busted)';
          buttonEl.style.opacity = '0.5';
          buttonEl.style.cursor = 'not-allowed';
        }

        // Remove from targets after 3 seconds
        setTimeout(() => {
          targets = targets.filter(t => t.userId !== userId);
          renderPanel();
        }, 3000);

        return;
      }

      // STEP 2: Click the button (triggers TORN's panel expansion)
      console.log(`JailBustSniper: 🎯 Clicking TORN's bust button to expand panel...`);

      if (buttonEl) {
        buttonEl.textContent = '⏳';
      }

      setTargetStatus(userId, 'busting', 'Opening confirmation...');
      showPanelMessage(`${displayName}: Opening bust confirmation...`, 'info');

      try {
        tornButton.click();
        console.log(`JailBustSniper: ✅ Bust button clicked - panel should expand`);
      } catch (e) {
        console.error(`JailBustSniper: ❌ Error clicking button:`, e);

        setTargetStatus(userId, 'error', 'Click failed');
        showPanelMessage(`${displayName}: Failed to click button`, 'error');

        if (buttonEl) {
          buttonEl.disabled = false;
          buttonEl.textContent = 'BUST';
          buttonEl.style.background = '';
          buttonEl.style.opacity = '';
        }
        return;
      }

      // STEP 3: Wait for confirmation panel to appear, then click Yes
      console.log(`JailBustSniper: ⏰ Waiting for confirmation panel to appear...`);

      let attempts = 0;
      const maxAttempts = 40; // 20 seconds max

      const checkInterval = setInterval(() => {
        attempts++;

        // Look for Yes button (link with step=breakout1)
        const yesButtons = document.querySelectorAll('a[href*="step=breakout1"]');

        for (const yesBtn of yesButtons) {
          if (yesBtn.href.includes(`XID=${userId}`)) {
            console.log(`JailBustSniper: ✅ Found Yes button in confirmation panel`);
            console.log(`JailBustSniper: Yes button href: ${yesBtn.href}`);

            clearInterval(checkInterval);

            // Click Yes button
            if (buttonEl) {
              buttonEl.textContent = '✓';
              buttonEl.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
            }

            setTargetStatus(userId, 'busting', 'Clicking Yes...');
            showPanelMessage(`${displayName}: Bust in progress...`, 'info');

            setTimeout(() => {
              try {
                yesBtn.click();
                console.log(`JailBustSniper: 🚀 Yes button clicked - bust in progress...`);

                setTargetStatus(userId, 'success', 'Bust complete!');

                // Wait for result to appear
                setTimeout(() => {
                  if (buttonEl) {
                    buttonEl.disabled = false;
                    buttonEl.textContent = 'BUST';
                    buttonEl.style.background = '';
                    buttonEl.style.opacity = '';
                  }

                  // Refresh targets after bust
                  if (isLeader) {
                    setTimeout(() => scan(), 3000);
                  }
                }, 5000);

              } catch (e) {
                console.error(`JailBustSniper: ❌ Error clicking Yes:`, e);

                if (buttonEl) {
                  buttonEl.disabled = false;
                  buttonEl.textContent = 'BUST';
                  buttonEl.style.background = '';
                  buttonEl.style.opacity = '';
                }
              }
            }, 300);

            return;
          }
        }

        // Timeout
        if (attempts >= maxAttempts) {
          console.log(`JailBustSniper: ⚠️ Confirmation panel did not appear after ${maxAttempts/2} seconds`);
          console.log(`JailBustSniper: 💡 You may need to click Yes manually`);

          clearInterval(checkInterval);

          setTargetStatus(userId, 'error', 'Timeout - click manually');
          showPanelMessage(`${displayName}: Confirmation timeout - you may need to click Yes manually`, 'warning');

          if (buttonEl) {
            buttonEl.disabled = false;
            buttonEl.textContent = 'BUST';
            buttonEl.style.background = '';
            buttonEl.style.opacity = '';
          }
        }
      }, 500);
    }

    /**
     * Show bust notification overlay
     */
    /**
     * Show message in panel (replaces popup notifications)
     */
    function showPanelMessage(message, type = 'info') {
      if (!panelEl) return;

      const messageEl = panelEl.querySelector('.ff-bust-message');
      if (!messageEl) return;

      // Color and icon based on type
      let bgColor, icon;
      switch(type) {
        case 'success':
          bgColor = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
          icon = '✅';
          break;
        case 'error':
          bgColor = 'linear-gradient(135deg, #f44336 0%, #c62828 100%)';
          icon = '❌';
          break;
        case 'warning':
          bgColor = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
          icon = '⚠️';
          break;
        default: // info
          bgColor = 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
          icon = 'ℹ️';
      }

      messageEl.style.background = bgColor;
      messageEl.style.color = 'white';
      messageEl.style.display = 'block';
      messageEl.innerHTML = `${icon} ${message}`;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    }

    /**
     * Set status for specific target
     */
    function setTargetStatus(userId, status, message) {
      const target = targets.find(t => t.userId === userId);
      if (target) {
        target.status = status;
        target.statusMessage = message;
        renderPanel(); // Update UI
      }
    }

    /**
     * OLD: Show bust notification (kept for compatibility but replaced)
     */
    function showBustNotification(userName, success, message) {
      // Deprecated - now uses showPanelMessage
      const type = success ? 'info' : 'error';
      showPanelMessage(`${userName}: ${message}`, type);
    }

    /**
     * Create the panel element
     */
    function createPanel() {
      // Duplicate prevention
      if (panelCreated || document.querySelector('.ff-bust-panel')) {
        console.log('JailBustSniper: Panel already exists');
        if (!panelEl) {
          panelEl = document.querySelector('.ff-bust-panel');
        }
        return;
      }

      // Load saved collapsed state
      try {
        const savedCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED);
        if (savedCollapsed !== null) {
          isCollapsed = JSON.parse(savedCollapsed);
        }
      } catch (e) {}

      panelEl = document.createElement('div');
      panelEl.className = 'ff-bust-panel' + (isCollapsed ? ' collapsed' : '') + (!isLeader ? ' follower' : '');
      panelEl.setAttribute('data-tab-id', TAB_ID);
      panelEl.innerHTML = `
        <div class="ff-bust-header">
          <span class="ff-bust-title">
            🚔 <span>Bust Sniper</span>
            <span class="ff-bust-badge empty">0</span>
            <span class="ff-bust-leader-btn" title="Click to make this tab the leader" style="display:${isLeader ? 'none' : 'inline'};cursor:pointer;margin-left:8px;">📡</span>
          </span>
          <span class="ff-bust-toggle">${isCollapsed ? '▶' : '▼'}</span>
        </div>
        <div class="ff-bust-message" style="display:none;padding:8px;margin:0 8px 8px;border-radius:4px;font-size:11px;font-weight:500;"></div>
        <div class="ff-bust-list"></div>
        <div class="ff-bust-status">Initializing...</div>
      `;

      // Toggle collapse
      const toggle = panelEl.querySelector('.ff-bust-toggle');
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockAudio();
        isCollapsed = !isCollapsed;
        panelEl.classList.toggle('collapsed', isCollapsed);
        toggle.textContent = isCollapsed ? '▶' : '▼';
        try {
          localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(isCollapsed));
        } catch (err) {}
      });

      // Unlock audio on panel click
      panelEl.addEventListener('click', unlockAudio, { once: true });

      // Leader button
      const leaderBtn = panelEl.querySelector('.ff-bust-leader-btn');
      if (leaderBtn) {
        leaderBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!isLeader) {
            forceLeadership();
          }
        });
      }

      // Event delegation for BUST buttons
      panelEl.addEventListener('click', (e) => {
        const bustBtn = e.target.closest('.ff-bust-btn');
        if (bustBtn) {
          e.preventDefault();
          e.stopPropagation();

          const bustUrl = bustBtn.dataset.bustUrl;
          const userName = bustBtn.dataset.userName;
          const userId = bustBtn.dataset.userId;

          console.log(`JailBustSniper: Attempting auto-bust on ${userName} [${userId}]`);

          // Find the full target object from targets array
          const target = targets.find(t => t.userId === userId);

          // Disable button during bust attempt
          bustBtn.disabled = true;
          bustBtn.textContent = '...';

          // Execute auto-bust with full target object (includes stored bustButton)
          performAutoBust(target, bustBtn);
        }
      });

      document.body.appendChild(panelEl);
      panelCreated = true;

      // Apply saved position
      const pos = getSavedPosition();
      applyPosition(pos.x, pos.y);

      // Setup drag
      setupDragListeners();

      // Update role display
      updatePanelRole();

      // Check for stored bust results from previous page load
      checkStoredBustResult();

      // Unlock audio on document interaction
      document.addEventListener('click', unlockAudio, { once: true });
      document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    /**
     * Check for and display stored bust result from previous page
     */
    function checkStoredBustResult() {
      try {
        const stored = sessionStorage.getItem('ff-bust-result');
        if (!stored) return;

        const result = JSON.parse(stored);
        const { userName, status, message, timestamp } = result;

        // Check age (expire after 30 seconds)
        if (Date.now() - timestamp > 30000) {
          sessionStorage.removeItem('ff-bust-result');
          return;
        }

        // Clear it immediately to prevent repeated display
        sessionStorage.removeItem('ff-bust-result');

        console.log(`JailBustSniper: Displaying stored bust result for ${userName}`);

        // Show the stored message
        let messageType = 'info';
        switch(status) {
          case 'not-found':
            messageType = 'warning';
            break;
          case 'success':
            messageType = 'success';
            break;
          case 'error':
            messageType = 'error';
            break;
        }

        showPanelMessage(`${userName}: ${message}`, messageType);

        // Keep message visible longer for important info
        if (status === 'not-found' || status === 'error') {
          setTimeout(() => {
            const messageEl = panelEl?.querySelector('.ff-bust-message');
            if (messageEl && messageEl.textContent.includes(userName)) {
              messageEl.style.display = 'none';
            }
          }, 10000); // 10 seconds for errors/warnings
        }

      } catch (e) {
        console.error('JailBustSniper: Error checking stored bust result:', e);
        sessionStorage.removeItem('ff-bust-result');
      }
    }

    /**
     * Get saved position from localStorage
     */
    function getSavedPosition() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_POSITION);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
      return { x: 20, y: 320 }; // Default position (below bounty sniper)
    }

    /**
     * Apply position to panel
     */
    function applyPosition(x, y) {
      if (!panelEl) return;
      panelEl.style.left = x + 'px';
      panelEl.style.top = y + 'px';
    }

    /**
     * Setup drag listeners
     */
    function setupDragListeners() {
      if (!panelEl) return;

      const header = panelEl.querySelector('.ff-bust-header');
      let isDragging = false;
      let startX, startY, initialX, initialY;

      const onMouseDown = (e) => {
        // Don't drag if clicking toggle or buttons
        if (e.target.closest('.ff-bust-toggle') || e.target.closest('.ff-bust-leader-btn')) {
          return;
        }
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        const rect = panelEl.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        applyPosition(initialX + deltaX, initialY + deltaY);
      };

      const onMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          const rect = panelEl.getBoundingClientRect();
          const pos = { x: rect.left, y: rect.top };
          try {
            localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(pos));
          } catch (e) {}
        }
      };

      header.addEventListener('mousedown', onMouseDown);
      header.addEventListener('touchstart', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onMouseUp);
    }

    /**
     * Start the bust sniper
     */
    function start() {
      if (!settings.bustSniperEnabled) return;

      console.log(`JailBustSniper: Starting (Tab: ${TAB_ID})`);

      isEnabled = true;

      // Election and coordination
      electLeader();
      listenForTargets();

      // Create panel
      createPanel();

      // Start scanning if leader
      if (isLeader) {
        scan(); // Initial scan
        scanInterval = setInterval(scan, SCAN_INTERVAL);

        // Heartbeat
        setInterval(saveLeaderInfo, LEADER_HEARTBEAT_INTERVAL);
      }

      updateStatus('Ready');
    }

    /**
     * Stop the bust sniper
     */
    function stop() {
      isEnabled = false;

      if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
      }

      if (panelEl) {
        panelEl.remove();
        panelEl = null;
        panelCreated = false;
      }

      console.log('JailBustSniper: Stopped');
    }

    // Cleanup on tab close
    window.addEventListener('beforeunload', () => {
      if (isLeader) {
        localStorage.removeItem(STORAGE_KEY_LEADER);
      }
    });

    /**
     * Force this tab to become leader (used after navigation)
     */
    function forceLeader() {
      console.log('JailBustSniper: 👑 Forcing leader mode...');
      isLeader = true;
      saveLeaderInfo();  // Use existing function

      // Update UI
      if (panelEl) {
        updatePanelRole();
      }

      // Start scanning if enabled
      if (isEnabled && !scanInterval) {
        scanInterval = setInterval(() => scan(), SCAN_INTERVAL);
        scan(); // Immediate scan
      }

      console.log('JailBustSniper: ✅ Now in leader mode');
    }

    // Public API
    return {
      start,
      stop,
      scan,
      getTargets: () => targets,
      isRunning: () => isEnabled,
      isLeader: () => isLeader,
      forceLeader  // NEW: For forcing leader after navigation
    };
  })();
  // ============================================================================
  // CONSOLIDATED OBSERVER MANAGER
  // ============================================================================

  const ObserverManager = (() => {
    let observer = null;
    let debounceTimer = null;
    const seenAvailCells = new WeakSet();
    const seenMarketRows = new WeakSet();

    function processDOM() {
      // Profile injection
      injectProfile();

      // List items (faction, user lists)
      document.querySelectorAll('div[class*="honorWrap"]').forEach(injectListItem);

      // Bounty page injection
      if (location.href.includes('bounties.php')) {
        // Find all list items that contain profile links
        document.querySelectorAll('li').forEach(li => {
          const profileLink = li.querySelector('a[href*="profiles.php?XID="]');
          if (profileLink && li.getAttribute('data-ff-bounty') !== '1') {
            injectBountyItem(li);
          }
        });

        // Also check for any profile links in table-like structures
        document.querySelectorAll('a[href*="profiles.php?XID="]').forEach(link => {
          // Find the row container (li, tr, or div)
          const row = link.closest('li') || link.closest('tr') || link.closest('[class*="row"]');
          if (row && row.getAttribute('data-ff-bounty') !== '1') {
            injectBountyItem(row);
          }
        });
      }

      // Market attack buttons (seller list)
      document.querySelectorAll('[class*="sellerListWrapper"] ul a[href*="profiles.php?XID="]')
        .forEach(injectMarketAttackButton);

      // Market rows (PDA/PC)
      document.querySelectorAll('[class*="rowWrapper"]').forEach(row => {
        if (!seenMarketRows.has(row)) {
          seenMarketRows.add(row);
          row.style.transition = 'background 2.5s cubic-bezier(.4,0,.2,1)';
          row.style.background = '#ff3e30';
          setTimeout(() => row.style.background = '', 1200);
        }

        const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
        if (profileLink) injectMarketAttackButton(profileLink);
      });

      // "Available" cell highlighting (optimized selector)
      document.querySelectorAll('div').forEach(el => {
        if (el.childNodes.length === 1 && el.textContent.match(/^\d+\s*available$/)) {
          if (!seenAvailCells.has(el)) {
            seenAvailCells.add(el);
            el.style.transition = 'background 3s cubic-bezier(.4,0,.2,1)';
            el.style.background = '#ff0000';
            setTimeout(() => el.style.background = '', 1200);
          }
        }
      });

      // RSI+ panel mount fallback
      if (!document.getElementById('ff-exp-panel')) {
        const badge = document.querySelector('span.ff-score-badge');
        if (badge) {
          const h = badge.closest('h4');
          if (h && window.__FF_ME_STATS_OBJ && window.__FF_LAST_PROFILE_OBJ) {
            buildRSIPlusPanel(h, window.__FF_ME_STATS_OBJ, window.__FF_LAST_PROFILE_OBJ);
          }
        }
      }

      // Update countdown chips
      updateCountdowns();

      // Prune orphaned overlays
      pruneOrphans();

      // Anti-overlap adjustments
      adjustOverlaps();
    }

    function updateCountdowns() {
      document.querySelectorAll('.ff-countdown-chip').forEach(chip => {
        const until = parseInt(chip.dataset.ffUntil || '0', 10);
        if (!until) { chip.textContent = ''; return; }
        const remaining = Math.max(0, until - Date.now());
        const s = Math.floor(remaining / 1000);
        const hh = String(Math.floor(s / 3600)).padStart(2, '0');
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        chip.textContent = `${hh}:${mm}:${ss}`;
      });
    }

    function pruneOrphans() {
      document.querySelectorAll('.honor-text-wrap, div[class*="honorWrap"]').forEach(wrap => {
        if (!wrap.querySelector('.ff-travel-icon')) {
          wrap.querySelectorAll('.ff-loc-badge').forEach(n => n.remove());
        }
        if (!wrap.querySelector('.ff-hospital-icon')) {
          wrap.querySelectorAll('.ff-countdown-chip').forEach(n => n.remove());
        }
      });
    }

    function adjustOverlaps() {
      document.querySelectorAll('.honor-text-wrap, div[class*="honorWrap"]').forEach(wrap => {
        const wRect = wrap.getBoundingClientRect();
        if (!wRect.width) return;

        const cell = wrap.closest('.table-cell') || wrap.closest('td,th') || wrap.parentElement;
        if (!cell?.parentElement) return;

        const barriers = [];
        Array.from(cell.parentElement.children).forEach(sib => {
          if (sib === cell) return;
          const r = sib.getBoundingClientRect();
          if (r.width && r.left <= wRect.right && r.left >= wRect.left) {
            barriers.push(r.left);
          }
        });

        let shift = 0;
        if (barriers.length) {
          const inside = barriers.filter(x => x < wRect.right);
          const target = inside.length ? Math.max(...inside) : null;
          if (target !== null) shift = Math.ceil(wRect.right - target) + 6;
        }

        wrap.querySelectorAll('.ff-travel-icon, .ff-hospital-icon, .ff-loc-badge, .ff-countdown-chip')
          .forEach(el => {
            el.classList.add('ff-anti-overlap');
            el.style.transform = shift ? `translateX(${-shift}px)` : '';
          });
      });
    }

    function debouncedProcess() {
      if (debounceTimer) return;
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        processDOM();
      }, 100);
    }

    return {
      start() {
        processDOM();

        observer = new MutationObserver(debouncedProcess);
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', processDOM);

        // Countdown timer
        setInterval(updateCountdowns, 1000);

        // Setup fight capture on attack pages
        FightCapture.setupAttackPageObserver();
      },

      stop() {
        observer?.disconnect();
        observer = null;
      }
    };
  })();

  // ============================================================================
  // SETTINGS UI WITH STATS TAB
  // ============================================================================

  function createSettingsUI() {
    const fab = document.createElement('div');
    fab.className = 'ff-fab';
    fab.textContent = '⚙️';

    const backdrop = document.createElement('div');
    backdrop.className = 'ff-modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'ff-modal';

    modal.innerHTML = `
      <h3>ATK Scouter Settings v${VERSION}</h3>
      <div class="ff-tabs">
        <div class="ff-tab active" data-tab="settings">⚙️ Settings</div>
        <div class="ff-tab" data-tab="sniper">🎯 Sniper</div>
        <div class="ff-tab" data-tab="bust-sniper">🚔 Bust</div>
        <div class="ff-tab" data-tab="stats">📊 Stats</div>
        <div class="ff-tab" data-tab="apikey">🔑 API Key</div>
      </div>
      <div class="ff-tab-content active" id="tab-settings">
        <label>High→Med cutoff (%)</label>
        <input type="number" id="ff-th1" value="${settings.lowHigh}" min="0" max="1000">
        <label>Med→Low cutoff (%)</label>
        <input type="number" id="ff-th2" value="${settings.highMed}" min="0" max="1000">
        <label>Life weight (0–1)</label>
        <input type="number" step="0.01" id="ff-lw" value="${settings.lifeWeight}" min="0" max="1">
        <label>Drug weight (0–1)</label>
        <input type="number" step="0.01" id="ff-dw" value="${settings.drugWeight}" min="0" max="1">
        <hr style="border:none;border-top:1px solid #444;margin:15px 0;">
        <div style="background:rgba(76,175,80,0.1);padding:10px;border-radius:6px;margin-bottom:10px;">
          <div style="font-weight:600;color:#4caf50;margin-bottom:8px;">⚡ RSI Cache System</div>
          <div style="font-size:0.85em;color:#aaa;margin-bottom:10px;">Persistent caching reduces API calls by 90%+</div>
          <label style="display:flex;align-items:center;gap:8px;margin:6px 0;">
            <input type="checkbox" id="ff-rsi-cache-enabled" ${settings.rsiCacheEnabled ? 'checked' : ''}>
            <span>Enable RSI Cache</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:6px 0;">
            <input type="checkbox" id="ff-rsi-cache-show-confidence" ${settings.rsiCacheShowConfidence ? 'checked' : ''}>
            <span>Show Confidence Indicators</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:6px 0;">
            <input type="checkbox" id="ff-rsi-cache-background-refresh" ${settings.rsiCacheBackgroundRefresh ? 'checked' : ''}>
            <span>Auto-Refresh Stale Data</span>
          </label>
          <div id="ff-cache-stats-container" style="margin-top:10px;"></div>
          <div style="display:flex;gap:8px;margin-top:10px;">
            <button id="ff-refresh-cache-stats" style="flex:1;padding:6px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;">View Stats</button>
            <button id="ff-clear-cache-btn" style="flex:1;padding:6px;background:#c62828;color:#fff;border:none;border-radius:4px;cursor:pointer;">Clear Cache</button>
          </div>
        </div>
      </div>
      <div class="ff-tab-content" id="tab-sniper">
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <input type="checkbox" id="ff-sniper-enabled" ${settings.sniperEnabled ? 'checked' : ''}>
          <span style="font-weight:600;">Enable Bounty Sniper</span>
        </label>
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <label>Min Reward ($)</label>
        <input type="number" id="ff-sniper-minreward" value="${settings.sniperMinReward}" min="0" step="10000">
        <label>Max Level</label>
        <input type="number" id="ff-sniper-maxlevel" value="${settings.sniperMaxLevel}" min="1" max="100">
        <div style="display:flex;gap:10px;">
          <div style="flex:1;">
            <label>RSI Min (%)</label>
            <input type="number" id="ff-sniper-rsimin" value="${settings.sniperRsiMin}" min="0" max="500">
          </div>
          <div style="flex:1;">
            <label>RSI Max (%)</label>
            <input type="number" id="ff-sniper-rsimax" value="${settings.sniperRsiMax}" min="0" max="500">
          </div>
        </div>
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <label>Status Filters</label>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin:8px 0;">
          <label style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="ff-sniper-showokay" ${settings.sniperShowOkay ? 'checked' : ''}>
            <span>Okay</span>
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="ff-sniper-showhospital" ${settings.sniperShowHospital ? 'checked' : ''}>
            <span>Hospital</span>
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="ff-sniper-showtraveling" ${settings.sniperShowTraveling ? 'checked' : ''}>
            <span>Traveling</span>
          </label>
        </div>
        <label>Hospital threshold (mins) - show if less than:</label>
        <input type="number" id="ff-sniper-hospitalmins" value="${settings.sniperHospitalMins}" min="0" max="60">
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <label>Pages to Scan (1-20)</label>
        <input type="number" id="ff-sniper-pagestoscan" value="${settings.sniperPagesToScan}" min="1" max="20">
        <label>API Budget (calls/min)</label>
        <input type="number" id="ff-sniper-apibudget" value="${settings.sniperApiBudget}" min="1" max="50">
        <label>Sort By</label>
        <select id="ff-sniper-sortby" style="width:100%;padding:6px;background:#333;color:#eee;border:1px solid #555;border-radius:4px;">
          <option value="value" ${settings.sniperSortBy === 'value' ? 'selected' : ''}>Value Score (recommended)</option>
          <option value="reward" ${settings.sniperSortBy === 'reward' ? 'selected' : ''}>Highest Reward</option>
          <option value="rsi" ${settings.sniperSortBy === 'rsi' ? 'selected' : ''}>Highest RSI</option>
          <option value="beaten" ${settings.sniperSortBy === 'beaten' ? 'selected' : ''}>Previously Beaten</option>
        </select>
        <label style="display:flex;align-items:center;gap:8px;margin-top:10px;">
          <input type="checkbox" id="ff-sniper-soundalert" ${settings.sniperSoundAlert ? 'checked' : ''}>
          <span>Sound alert for new targets</span>
        </label>
      </div>
      <div class="ff-tab-content" id="tab-bust-sniper">
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <input type="checkbox" id="ff-bust-sniper-enabled" ${settings.bustSniperEnabled ? 'checked' : ''}>
          <span style="font-weight:600;">Enable Jail Bust Sniper</span>
        </label>
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <h4 style="margin:10px 0 5px;font-size:1em;color:#ba68c8;">Level Range</h4>
        <div style="display:flex;gap:10px;">
          <div style="flex:1;">
            <label>Min Level</label>
            <input type="number" id="ff-bust-minlevel" value="${settings.bustSniperMinLevel}" min="1" max="100">
          </div>
          <div style="flex:1;">
            <label>Max Level</label>
            <input type="number" id="ff-bust-maxlevel" value="${settings.bustSniperMaxLevel}" min="1" max="100">
          </div>
        </div>
        <h4 style="margin:15px 0 5px;font-size:1em;color:#ba68c8;">Sentence Range (hours)</h4>
        <div style="display:flex;gap:10px;">
          <div style="flex:1;">
            <label>Min Sentence</label>
            <input type="number" id="ff-bust-minsentence" value="${Math.floor(settings.bustSniperMinSentence / 60)}" min="0" step="1">
          </div>
          <div style="flex:1;">
            <label>Max Sentence</label>
            <input type="number" id="ff-bust-maxsentence" value="${Math.floor(settings.bustSniperMaxSentence / 60)}" min="0" step="1">
          </div>
        </div>
        <div style="font-size:11px;color:#999;margin-top:4px;">💡 Enter hours (e.g., 5 for 5 hours). Max 100 hours.</div>
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <label>Jail Type Filters</label>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin:8px 0;">
          <label style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="ff-bust-show-normal" ${settings.bustSniperShowNormalJail ? 'checked' : ''}>
            <span>🔒 Normal Jail</span>
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="ff-bust-show-federal" ${settings.bustSniperShowFederalJail ? 'checked' : ''}>
            <span>⚖️ Federal Jail</span>
          </label>
        </div>
        <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        <label>Max Targets to Display (1-10)</label>
        <input type="number" id="ff-bust-maxtargets" value="${settings.bustSniperMaxTargets}" min="1" max="10">
        <label>Pages to Scan (1-5)</label>
        <input type="number" id="ff-bust-pagestoscan" value="${settings.bustSniperPagesToScan}" min="1" max="5">
        <label>Refresh Interval (seconds)</label>
        <input type="number" id="ff-bust-interval" value="${settings.bustSniperFetchInterval}" min="15" max="300">
        <label>Sort By</label>
        <select id="ff-bust-sortby" style="width:100%;padding:6px;background:#333;color:#eee;border:1px solid #555;border-radius:4px;">
          <option value="priority" ${settings.bustSniperSortBy === 'priority' ? 'selected' : ''}>Priority Score (recommended)</option>
          <option value="sentence" ${settings.bustSniperSortBy === 'sentence' ? 'selected' : ''}>Shortest Sentence</option>
          <option value="level" ${settings.bustSniperSortBy === 'level' ? 'selected' : ''}>Lowest Level</option>
          <option value="name" ${settings.bustSniperSortBy === 'name' ? 'selected' : ''}>Name (A-Z)</option>
        </select>
        <label style="display:flex;align-items:center;gap:8px;margin-top:10px;">
          <input type="checkbox" id="ff-bust-soundalert" ${settings.bustSniperSoundAlert ? 'checked' : ''}>
          <span>Sound alert for new targets</span>
        </label>
        <div style="margin-top:12px;padding:10px;background:rgba(156,39,176,0.1);border:1px solid rgba(156,39,176,0.3);border-radius:6px;font-size:11px;color:#ccc;">
          <strong style="color:#ba68c8;">💡 Tip:</strong> Lower level + shorter sentence = easier busts. The system prioritizes targets automatically.
        </div>
      </div>
      <div class="ff-tab-content" id="tab-stats">
        <div id="ff-stats-content">
          <div class="ff-empty-state">Loading stats...</div>
        </div>
      </div>
      <div class="ff-tab-content" id="tab-apikey">
        <label>API Key</label>
        <input type="text" id="ff-key" value="${API_KEY ? API_KEY.slice(0, 4) + '••••••••' + API_KEY.slice(-4) : ''}" placeholder="Enter your Torn API Key…">
        <button class="btn btn-clear" id="ff-clear-key">Clear Key</button>
      </div>
      <div style="text-align:right;">
        <button class="btn btn-save" id="ff-save">💾 Save & Reload</button>
        <button class="btn btn-cancel" id="ff-cancel">❌ Cancel</button>
      </div>
    `;

    document.body.append(fab, backdrop, modal);

    // Tab switching
    modal.querySelectorAll('.ff-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.ff-tab, .ff-tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        modal.querySelector('#tab-' + tab.dataset.tab)?.classList.add('active');

        // Load stats when stats tab is shown
        if (tab.dataset.tab === 'stats') {
          loadStatsTab();
        }
      });
    });

    const closeModal = () => {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    };

    fab.addEventListener('click', () => {
      backdrop.style.display = 'block';
      modal.style.display = 'block';
    });

    backdrop.addEventListener('click', closeModal);
    modal.querySelector('#ff-cancel')?.addEventListener('click', closeModal);

    modal.querySelector('#ff-clear-key')?.addEventListener('click', () => {
      Env.deleteValue('api_key');
      API_KEY = '';
      const keyInput = modal.querySelector('#ff-key');
      if (keyInput) keyInput.value = '';
      alert('API key cleared');
    });

    modal.querySelector('#ff-save')?.addEventListener('click', () => {
      const keyInput = modal.querySelector('#ff-key');
      const newKey = keyInput?.value.trim();
      // Only save if it doesn't look like the masked key
      if (newKey && !newKey.includes('••')) {
        Env.setValue('api_key', newKey);
        API_KEY = newKey;
      }

      const v1 = parseFloat(modal.querySelector('#ff-th1')?.value);
      const v2 = parseFloat(modal.querySelector('#ff-th2')?.value);
      const v3 = parseFloat(modal.querySelector('#ff-lw')?.value);
      const v4 = parseFloat(modal.querySelector('#ff-dw')?.value);

      if (!isNaN(v1)) Env.setValue('threshold_lowHigh', v1);
      if (!isNaN(v2)) Env.setValue('threshold_highMed', v2);
      if (!isNaN(v3)) Env.setValue('lifeWeight', v3);
      if (!isNaN(v4)) Env.setValue('drugWeight', v4);

      // Save sniper settings
      Env.setValue('sniperEnabled', modal.querySelector('#ff-sniper-enabled')?.checked || false);
      Env.setValue('sniperMinReward', parseInt(modal.querySelector('#ff-sniper-minreward')?.value) || DEFAULTS.sniperMinReward);
      Env.setValue('sniperMaxLevel', parseInt(modal.querySelector('#ff-sniper-maxlevel')?.value) || DEFAULTS.sniperMaxLevel);
      Env.setValue('sniperRsiMin', parseInt(modal.querySelector('#ff-sniper-rsimin')?.value) || DEFAULTS.sniperRsiMin);
      Env.setValue('sniperRsiMax', parseInt(modal.querySelector('#ff-sniper-rsimax')?.value) || DEFAULTS.sniperRsiMax);
      Env.setValue('sniperShowOkay', modal.querySelector('#ff-sniper-showokay')?.checked || false);
      Env.setValue('sniperShowHospital', modal.querySelector('#ff-sniper-showhospital')?.checked || false);
      Env.setValue('sniperShowTraveling', modal.querySelector('#ff-sniper-showtraveling')?.checked || false);
      Env.setValue('sniperHospitalMins', parseInt(modal.querySelector('#ff-sniper-hospitalmins')?.value) || DEFAULTS.sniperHospitalMins);
      Env.setValue('sniperPagesToScan', Math.min(20, Math.max(1, parseInt(modal.querySelector('#ff-sniper-pagestoscan')?.value) || DEFAULTS.sniperPagesToScan)));
      Env.setValue('sniperApiBudget', parseInt(modal.querySelector('#ff-sniper-apibudget')?.value) || DEFAULTS.sniperApiBudget);
      Env.setValue('sniperSortBy', modal.querySelector('#ff-sniper-sortby')?.value || DEFAULTS.sniperSortBy);
      Env.setValue('sniperSoundAlert', modal.querySelector('#ff-sniper-soundalert')?.checked || false);

      // Save bust sniper settings
      Env.setValue('bustSniperEnabled', modal.querySelector('#ff-bust-sniper-enabled')?.checked || false);
      Env.setValue('bustSniperMinLevel', parseInt(modal.querySelector('#ff-bust-minlevel')?.value) || DEFAULTS.bustSniperMinLevel);
      Env.setValue('bustSniperMaxLevel', parseInt(modal.querySelector('#ff-bust-maxlevel')?.value) || DEFAULTS.bustSniperMaxLevel);
      // Convert hours to minutes for storage
      Env.setValue('bustSniperMinSentence', (parseInt(modal.querySelector('#ff-bust-minsentence')?.value) || 0) * 60);
      Env.setValue('bustSniperMaxSentence', (parseInt(modal.querySelector('#ff-bust-maxsentence')?.value) || 100) * 60);
      Env.setValue('bustSniperPagesToScan', parseInt(modal.querySelector('#ff-bust-pagestoscan')?.value) || DEFAULTS.bustSniperPagesToScan);
      Env.setValue('bustSniperSoundAlert', modal.querySelector('#ff-bust-soundalert')?.checked || false);
      Env.setValue('bustSniperSortBy', modal.querySelector('#ff-bust-sortby')?.value || DEFAULTS.bustSniperSortBy);
      Env.setValue('bustSniperFetchInterval', parseInt(modal.querySelector('#ff-bust-interval')?.value) || DEFAULTS.bustSniperFetchInterval);
      Env.setValue('bustSniperShowNormalJail', modal.querySelector('#ff-bust-show-normal')?.checked !== false);
      Env.setValue('bustSniperShowFederalJail', modal.querySelector('#ff-bust-show-federal')?.checked !== false);
      Env.setValue('bustSniperMaxTargets', Math.min(10, Math.max(1, parseInt(modal.querySelector('#ff-bust-maxtargets')?.value) || DEFAULTS.bustSniperMaxTargets)));

      // Save RSI cache settings
      Env.setValue('rsiCacheEnabled', modal.querySelector('#ff-rsi-cache-enabled')?.checked !== false);
      Env.setValue('rsiCacheShowConfidence', modal.querySelector('#ff-rsi-cache-show-confidence')?.checked !== false);
      Env.setValue('rsiCacheBackgroundRefresh', modal.querySelector('#ff-rsi-cache-background-refresh')?.checked !== false);

      console.log('Settings saved, preparing to reload...');
      
      // CRITICAL: Guard against multiple reload attempts
      if (_reloadInProgress) {
        console.log('Reload already in progress, ignoring duplicate save click');
        return;
      }
      _reloadInProgress = true;
      
      // CRITICAL: Close modal first to prevent interference with navigation
      closeModal();
      
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#fff;padding:20px 40px;border-radius:8px;z-index:999999;font-size:16px;';
      loadingDiv.textContent = '💾 Saving settings...';
      document.body.appendChild(loadingDiv);
      
      // Use setTimeout to allow modal close to complete, then trigger reload
      // This is critical for mobile browsers - they need the event loop to complete
      setTimeout(() => {
        loadingDiv.textContent = '🔄 Reloading page...';
        console.log('Attempting reload...');
        
        // Try reload methods sequentially with delays
        // Method 1: Direct href assignment (most compatible)
        console.log('Trying Method 1: location.href assignment');
        window.location.href = window.location.href;
        
        // Fallback: If still here after 500ms, try harder reload
        setTimeout(() => {
          console.log('Trying Method 2: location.reload()');
          window.location.reload();
        }, 500);
        
        // Final fallback: If still here after 1.5 seconds, show manual refresh message
        setTimeout(() => {
          loadingDiv.innerHTML = '⚠️ Auto-reload failed<br><small style="font-size:12px;">Please refresh manually (pull down or F5)</small>';
          setTimeout(() => {
            loadingDiv.remove();
            _reloadInProgress = false; // Reset guard
          }, 5000);
        }, 1500);
        
      }, 100); // 100ms delay allows modal close to complete
    });


    // Cache stats button handlers
    modal.querySelector('#ff-refresh-cache-stats')?.addEventListener('click', async () => {
      const btn = modal.querySelector('#ff-refresh-cache-stats');
      const originalText = btn.textContent;
      btn.textContent = 'Loading...';
      btn.disabled = true;
      
      try {
        const stats = await RSICacheManager.getStats();
        const container = modal.querySelector('#ff-cache-stats-container');
        const cacheSizeMB = ((stats.totalPlayers * 2) / 1000).toFixed(2);
        
        container.innerHTML = `
          <div style="background:rgba(0,0,0,0.2);padding:8px;border-radius:4px;font-size:0.85em;">
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="color:#999;">Players Cached:</span>
              <span style="color:#4caf50;font-weight:600;">${stats.totalPlayers.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="color:#999;">Cache Hit Rate:</span>
              <span style="color:#4caf50;font-weight:600;">${stats.cacheHitRate}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="color:#999;">API Calls Saved:</span>
              <span style="color:#4caf50;font-weight:600;">${stats.apiCallsSaved.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="color:#999;">Oldest Entry:</span>
              <span style="color:#fff;">${stats.oldestEntry}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="color:#999;">Est. Size:</span>
              <span style="color:#fff;">~${cacheSizeMB} MB</span>
            </div>
          </div>
        `;
      } catch (e) {
        console.error('Error loading cache stats:', e);
        alert('Error loading cache stats. See console.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });

    modal.querySelector('#ff-clear-cache-btn')?.addEventListener('click', async () => {
      if (!confirm('Clear ALL cached RSI data? This cannot be undone.')) return;
      
      const btn = modal.querySelector('#ff-clear-cache-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Clearing...';
      btn.disabled = true;
      
      try {
        await RSICacheManager.clearAll();
        alert('Cache cleared successfully!');
        modal.querySelector('#ff-refresh-cache-stats')?.click();
      } catch (e) {
        console.error('Error clearing cache:', e);
        alert('Error clearing cache. See console.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });

    // Auto-load cache stats when modal opens
    if (settings.rsiCacheEnabled) {
      setTimeout(() => modal.querySelector('#ff-refresh-cache-stats')?.click(), 100);
    }

    // Auto-open settings if no API key
    if (!API_KEY) {
      fab.click();
      modal.querySelector('[data-tab=apikey]')?.click();
    }
  }

  /**
   * Loads the stats tab content
   */
  async function loadStatsTab() {
    const container = document.getElementById('ff-stats-content');
    if (!container) return;

    try {
      const isAvailable = await FightDB.isAvailable();
      if (!isAvailable) {
        container.innerHTML = `
          <div class="ff-empty-state">
            <p>📵 IndexedDB not available</p>
            <p style="font-size:0.85em;opacity:0.7">Fight logging requires IndexedDB support.</p>
          </div>
        `;
        return;
      }

      const [overall, buckets, recent] = await Promise.all([
        FightDB.getOverallStats(),
        FightDB.getStatsByRsiBucket(),
        FightDB.getRecentFights(20)
      ]);

      if (overall.total === 0) {
        container.innerHTML = `
          <div class="ff-empty-state">
            <p>📭 No fights logged yet</p>
            <p style="font-size:0.85em;opacity:0.7">Fight outcomes are automatically captured when you attack players.</p>
            <p style="font-size:0.85em;opacity:0.7">View a profile, then attack — the result will be logged.</p>
          </div>
        `;
        return;
      }

      const winRateClass = overall.winRate >= 60 ? '' : overall.winRate >= 40 ? 'warning' : 'danger';

      container.innerHTML = `
        <div class="ff-stats-grid">
          <div class="ff-stat-card">
            <span class="ff-stat-value">${overall.total}</span>
            <span class="ff-stat-label">Total Fights</span>
          </div>
          <div class="ff-stat-card">
            <span class="ff-stat-value ${winRateClass}">${overall.winRate.toFixed(1)}%</span>
            <span class="ff-stat-label">Win Rate</span>
          </div>
          <div class="ff-stat-card">
            <span class="ff-stat-value">${overall.wins}</span>
            <span class="ff-stat-label">Wins</span>
          </div>
          <div class="ff-stat-card">
            <span class="ff-stat-value danger">${overall.losses}</span>
            <span class="ff-stat-label">Losses</span>
          </div>
        </div>

        <h4 style="margin:16px 0 8px;font-size:0.95em;">Win Rate by RSI Bucket</h4>
        <table class="ff-calibration-table">
          <thead>
            <tr>
              <th>RSI Range</th>
              <th>Fights</th>
              <th>Wins</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(buckets).map(([range, data]) => {
              const wr = data.total > 0 ? ((data.wins / data.total) * 100).toFixed(1) : '—';
              const wrClass = data.total === 0 ? '' : (data.wins / data.total >= 0.6 ? 'ff-fight-win' : data.wins / data.total < 0.4 ? 'ff-fight-loss' : '');
              return `
                <tr>
                  <td>${escapeHtml(range)}%</td>
                  <td>${data.total}</td>
                  <td>${data.wins}</td>
                  <td class="${wrClass}">${wr}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <h4 style="margin:16px 0 8px;font-size:0.95em;">Recent Fights</h4>
        <div class="ff-recent-fights">
          ${recent.length === 0 ? '<div class="ff-empty-state">No recent fights</div>' :
            recent.map(f => {
              const outcomeClass = f.outcome === 'win' ? 'ff-fight-win' : f.outcome === 'loss' ? 'ff-fight-loss' : 'ff-fight-other';
              const rsiDisplay = f.rsiAdjusted ? f.rsiAdjusted.toFixed(1) + '%' : '—';
              const timeAgo = formatTimeAgo(f.timestamp || f.capturedAt);
              return `
                <div class="ff-fight-row">
                  <span>${escapeHtml(f.opponentName || 'Unknown')} [${f.opponentId || '?'}]</span>
                  <span>RSI: ${rsiDisplay}</span>
                  <span class="${outcomeClass}">${f.outcome?.toUpperCase() || '?'}</span>
                  <span style="opacity:0.6;font-size:0.8em">${timeAgo}</span>
                </div>
              `;
            }).join('')
          }
        </div>

        <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="ff-btn-small ff-btn-export" id="ff-export-data">📤 Export Data</button>
          <button class="ff-btn-small ff-btn-danger" id="ff-clear-data">🗑️ Clear All Data</button>
        </div>
      `;

      // Wire up buttons
      document.getElementById('ff-export-data')?.addEventListener('click', async () => {
        try {
          const data = await FightDB.exportData();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `atk-scouter-fights-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showNotification('Data exported!');
        } catch (e) {
          showNotification('Export failed: ' + e.message, true);
        }
      });

      document.getElementById('ff-clear-data')?.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete ALL fight data? This cannot be undone.')) return;
        try {
          await FightDB.clearAllData();
          showNotification('All data cleared');
          loadStatsTab(); // Reload
        } catch (e) {
          showNotification('Clear failed: ' + e.message, true);
        }
      });

    } catch (e) {
      console.error('Error loading stats:', e);
      container.innerHTML = `
        <div class="ff-empty-state">
          <p>❌ Error loading stats</p>
          <p style="font-size:0.85em;opacity:0.7">${escapeHtml(e.message)}</p>
        </div>
      `;
    }
  }

  /**
   * Formats timestamp as relative time
   */
  function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Auto-sync learning model from IndexedDB fights
   * Runs once on startup if learning model is empty but fights exist
   */
  async function autoSyncLearningModel() {
    try {
      const hist = Env.getValue('ff_lrsi_hist', []) || [];

      // Only auto-sync if learning model is empty
      if (hist.length > 0) return;

      const fights = await FightDB.getAllFights();
      if (!fights || fights.length < 3) return; // Need at least 3 fights

      // Convert fights to learning format
      const samples = [];
      for (const fight of fights) {
        const rsi = fight.rsiAdjusted || fight.rsiRaw;
        if (rsi === null || rsi === undefined) continue;
        if (fight.outcome !== 'win' && fight.outcome !== 'loss') continue;

        samples.push({
          x: rsi - 100,
          y: fight.outcome === 'win' ? 1 : 0,
          ts: fight.capturedAt || Date.now()
        });
      }

      if (samples.length < 3) return;

      // Perform logistic regression fit
      let t0 = 0, t1 = 0.12;
      const lr = 0.05;
      for (let iter = 0; iter < 100; iter++) {
        let g0 = 0, g1 = 0;
        for (const s of samples) {
          const p = 1 / (1 + Math.exp(-(t0 + t1 * s.x)));
          const err = s.y - p;
          g0 += err;
          g1 += err * s.x;
        }
        t0 += lr * g0 / samples.length;
        t1 += lr * g1 / samples.length;
      }
      t1 = Math.max(0.01, Math.min(0.5, t1));

      // Save to learning model
      Env.setValue('ff_lrsi_theta0', t0);
      Env.setValue('ff_lrsi_theta1', t1);
      Env.setValue('ff_lrsi_hist', samples);
      Env.setValue('ff_lrsi_meta', { n: samples.length, ts: Date.now() });

      console.log(`ATK Scouter: Auto-synced learning model from ${samples.length} fights (θ0=${t0.toFixed(3)}, θ1=${t1.toFixed(3)})`);
    } catch (e) {
      console.error('ATK Scouter: Auto-sync failed', e);
    }
  }

  /**
   * Auto-Yes Clicker for Bust Confirmation
   * Runs on step=breakout pages and automatically clicks the Yes button
   */
  function setupAutoYesClicker() {
    // Check if we're on a bust confirmation page
    const url = window.location.href;
    if (!url.includes('action=rescue') || !url.includes('step=breakout')) {
      return; // Not a bust page
    }

    // Don't run on step=breakout1 (already past confirmation)
    if (url.includes('step=breakout1')) {
      return;
    }

    console.log('JailBustSniper: 🎯 On bust confirmation page, looking for Yes button...');

    // Function to find and click Yes button
    function findAndClickYes() {
      // Strategy 1: Find link with step=breakout1
      const links = document.querySelectorAll('a[href*="step=breakout1"]');
      if (links.length > 0) {
        console.log('JailBustSniper: ✅ Found Yes button (breakout1 link)');
        links[0].click();
        return true;
      }

      // Strategy 2: Find button/link with "Yes" text near "break out" context
      const allButtons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
      for (const btn of allButtons) {
        const text = (btn.textContent || btn.value || '').trim().toLowerCase();
        if (text === 'yes' || text === 'confirm' || text === 'proceed') {
          // Check if it's in bust context
          const parent = btn.closest('div, p, section, article');
          if (parent) {
            const parentText = parent.textContent.toLowerCase();
            if (parentText.includes('break') || parentText.includes('bust') || parentText.includes('jail')) {
              console.log('JailBustSniper: ✅ Found Yes button by text:', text);
              btn.click();
              return true;
            }
          }
        }
      }

      // Strategy 3: Find any button with href containing breakout1
      const allLinks = document.querySelectorAll('a[href]');
      for (const link of allLinks) {
        if (link.href.includes('breakout1') && link.href.includes('rescue')) {
          console.log('JailBustSniper: ✅ Found Yes button (any breakout1 link)');
          link.click();
          return true;
        }
      }

      return false;
    }

    // Try immediately
    if (findAndClickYes()) {
      console.log('JailBustSniper: 🚀 Yes button clicked, proceeding to bust...');
      return;
    }

    // Wait for page to fully load, then try again
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds max

    const interval = setInterval(() => {
      attempts++;

      if (findAndClickYes()) {
        console.log('JailBustSniper: 🚀 Yes button clicked, proceeding to bust...');
        clearInterval(interval);
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('JailBustSniper: ⚠️ Could not find Yes button after', maxAttempts, 'attempts');
        console.log('JailBustSniper: 💡 You may need to click Yes manually');
        clearInterval(interval);
      }
    }, 500);
  }

  /**
   * Check for pending bust and auto-execute after page navigation
   */
  function checkPendingBust() {
    // Only run on jail pages
    if (!window.location.href.includes('jailview.php')) {
      return;
    }

    const pendingBust = sessionStorage.getItem('ff-pending-bust');
    if (!pendingBust) {
      return;
    }

    try {
      const data = JSON.parse(pendingBust);
      const { userId, userName, timestamp } = data;

      // Check age (expire after 1 minute)
      if (Date.now() - timestamp > 60000) {
        console.log('JailBustSniper: Pending bust expired, clearing');
        sessionStorage.removeItem('ff-pending-bust');
        return;
      }

      // Clear it immediately
      sessionStorage.removeItem('ff-pending-bust');

      console.log(`JailBustSniper: 🎯 Resuming pending bust for ${userName} [${userId}]`);

      // CRITICAL: Force this tab to become leader after navigation
      // Otherwise it might go into satellite mode and stop working
      if (typeof JailBustSniper !== 'undefined' && JailBustSniper.forceLeader) {
        console.log(`JailBustSniper: 👑 Forcing leader mode after navigation`);
        JailBustSniper.forceLeader();
      }

      // Wait for page to fully load, then find and click button
      setTimeout(() => {
        console.log(`JailBustSniper: Looking for bust button for ${userName}...`);

        // Find button on this page
        const bustLinks = document.querySelectorAll('a[href*="action=rescue"], a.bust, a[class*="bust"]');
        let tornButton = null;

        for (const link of bustLinks) {
          if (link.href &&
              link.href.includes(`XID=${userId}`) &&
              link.href.includes('rescue') &&
              link.href.includes('breakout') &&
              !link.href.includes('step=buy')) {
            tornButton = link;
            console.log(`JailBustSniper: ✅ Found button for resumed bust`);
            break;
          }
        }

        if (!tornButton) {
          console.log(`JailBustSniper: ❌ Could not find button for ${userName} on this page`);
          console.log(`JailBustSniper: 💡 Player likely already busted by someone else`);

          // Store result so panel can display it after initialization
          sessionStorage.setItem('ff-bust-result', JSON.stringify({
            userName: userName,
            status: 'not-found',
            message: 'Player not found (likely already busted)',
            timestamp: Date.now()
          }));

          console.log(`JailBustSniper: 📝 Stored bust result for display`);
          return;
        }

        // Click it to expand panel
        console.log(`JailBustSniper: 🎯 Clicking bust button to expand panel...`);
        tornButton.click();

        // Wait for panel, then click Yes
        setTimeout(() => {
          let attempts = 0;
          const checkInterval = setInterval(() => {
            attempts++;

            const yesButtons = document.querySelectorAll('a[href*="step=breakout1"]');
            for (const yesBtn of yesButtons) {
              if (yesBtn.href.includes(`XID=${userId}`)) {
                console.log(`JailBustSniper: ✅ Found Yes button, clicking...`);
                clearInterval(checkInterval);

                yesBtn.click();
                console.log(`JailBustSniper: 🚀 Resumed bust complete!`);
                return;
              }
            }

            if (attempts >= 40) {
              console.log(`JailBustSniper: ⚠️ Timeout waiting for Yes button`);

              // Store result
              sessionStorage.setItem('ff-bust-result', JSON.stringify({
                userName: userName,
                status: 'error',
                message: 'Confirmation timeout - you may need to click Yes manually',
                timestamp: Date.now()
              }));

              clearInterval(checkInterval);
            }
          }, 500);
        }, 1000);

      }, 2000);  // Wait 2 seconds for page to fully load

    } catch (e) {
      console.error('JailBustSniper: Error processing pending bust:', e);
      sessionStorage.removeItem('ff-pending-bust');
    }
  }


  /**
   * Display API budget monitor
   */
  function displayAPIBudget() {
    let budgetEl = document.getElementById('ff-api-budget');
    if (!budgetEl) {
      budgetEl = document.createElement('div');
      budgetEl.id = 'ff-api-budget';
      budgetEl.className = 'ff-api-budget';
      document.body.appendChild(budgetEl);
    }

    function update() {
      const stats = APIBudgetTracker.getStats();
      budgetEl.textContent = `${stats.used}/${stats.limit}`;  /* Removed "API: " prefix */
      budgetEl.className = 'ff-api-budget';
      if (stats.percentage > 80) budgetEl.className += ' danger';
      else if (stats.percentage > 60) budgetEl.className += ' warning';
    }

    // CRITICAL: Clear any existing interval to prevent multiple timers
    if (_apiBudgetIntervalId !== null) {
      console.log('Clearing existing API budget interval:', _apiBudgetIntervalId);
      clearInterval(_apiBudgetIntervalId);
      _apiBudgetIntervalId = null;
    }

    // Initial update
    update();
    
    // Create new interval and store its ID
    _apiBudgetIntervalId = setInterval(update, 2000);
    console.log('Created new API budget interval:', _apiBudgetIntervalId);
  }


  /**
   * Initialize smart status checking for visible players on page load
   */
  async function initSmartStatusChecking() {
    // Only run on faction/bounty pages
    const isFactionPage = window.location.href.includes('factions.php');
    const isBountyPage = window.location.href.includes('bounties.php');
    
    if (!isFactionPage && !isBountyPage) return;

    // Check if this is first load or reload by checking RSI cache
    const rsiStats = await RSICacheManager.getStats();
    
    if (rsiStats.totalPlayers === 0) {
      console.log('Smart Status: First load detected (RSI cache empty) - skipping bulk status check');
      console.log('Smart Status: Status data will be cached from RSI API calls');
      return; // First load - RSI API calls will get and cache all status data
    }

    console.log(`Smart Status: Reload detected (${rsiStats.totalPlayers} players in RSI cache) - checking for expired status`);

    // Get all visible player IDs on current page
    const visibleUserIds = [];
    document.querySelectorAll('a[href*="profiles.php?XID="]').forEach(link => {
      const match = link.href.match(/XID=(\d+)/);
      if (match) {
        const userId = parseInt(match[1], 10);
        if (!visibleUserIds.includes(userId)) {
          visibleUserIds.push(userId);
        }
      }
    });

    if (visibleUserIds.length === 0) {
      console.log('Smart Status: No visible players found');
      return;
    }

    console.log(`Smart Status: Found ${visibleUserIds.length} visible players on page`);

    // Check which of the VISIBLE users are already cached
    const cachedUsers = await StatusCacheManager.getUsersWithRecentStatus();
    const cachedVisibleUsers = visibleUserIds.filter(id => cachedUsers.includes(id));
    const uncachedUsers = visibleUserIds.filter(id => !cachedUsers.includes(id));

    console.log(`Smart Status: ${cachedVisibleUsers.length} users cached with active status, ${uncachedUsers.length} need checking`);

    // Always queue ONLY the uncached users (never re-check cached ones)
    if (uncachedUsers.length === 0) {
      console.log('Smart Status: All visible users with status are cached - nothing to check');
      return;
    }

    console.log(`Smart Status: Queueing ${uncachedUsers.length} uncached users for status check`);
    StatusCacheManager.queueStatusCheck(uncachedUsers);
  }

  /**
   * Background Status Refresh Timer
   * Periodically refreshes status for all visible users (every 3 minutes)
   * This keeps status data fresh without requiring page reloads
   */
  function startBackgroundStatusRefresh() {
    // Only run on faction/bounty pages
    const isFactionPage = window.location.href.includes('factions.php');
    const isBountyPage = window.location.href.includes('bounties.php');
    
    if (!isFactionPage && !isBountyPage) {
      console.log('Background Status Refresh: Not on faction/bounty page - skipping');
      return;
    }

    console.log('Background Status Refresh: Starting timer (refreshes every 3 minutes)');
    
    // Function to refresh all visible users
    async function refreshVisibleUsers() {
      const visibleUserIds = [];
      document.querySelectorAll('a[href*="profiles.php?XID="]').forEach(link => {
        const match = link.href.match(/XID=(\d+)/);
        if (match) {
          const userId = parseInt(match[1], 10);
          if (!visibleUserIds.includes(userId)) {
            visibleUserIds.push(userId);
          }
        }
      });
      
      if (visibleUserIds.length === 0) {
        console.log('Background Status Refresh: No visible users found');
        return;
      }
      
      console.log(`Background Status Refresh: Refreshing ${visibleUserIds.length} visible users`);
      
      // Refresh each user
      for (const userId of visibleUserIds) {
        // Make lightweight status-only API call
        ApiManager.get(`/user/${userId}?selections=profile`, async d => {
          // Mark as checked
          LastCheckCacheManager.set(userId);
          
          // Update status cache if user has active status
          if (d.status || d.travel) {
            await StatusCacheManager.set(userId, d);
            
            // Update UI if element still exists
            const honorTextWrap = document.querySelector(`[data-user-id="${userId}"]`);
            if (honorTextWrap) {
              addStatusIcon(d, honorTextWrap, userId);
            }
          }
        });
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('Background Status Refresh: Refresh complete');
    }
    
    // Run refresh every 3 minutes
    setInterval(refreshVisibleUsers, LastCheckCacheManager.CHECK_INTERVAL);
  }

  function init() {
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #4CAF50; font-weight: bold');
    console.log('%c ATK SCOUTER v' + VERSION, 'color: #4CAF50; font-weight: bold; font-size: 14px');
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #4CAF50; font-weight: bold');
    console.log('%c✨ Intelligent RSI Caching (7-day persistent cache)', 'color: #2196F3');
    console.log('%c🏥 Real-time Status Tracking (hospital/traveling indicators)', 'color: #2196F3');
    console.log('%c⚡ Smart Refresh (0 API calls on reload within 3 minutes)', 'color: #2196F3');
    console.log('%c🔄 Auto-Background Updates (status refresh every 3 minutes)', 'color: #2196F3');
    console.log('%c🎯 Fight Intelligence (ML-powered win probability)', 'color: #2196F3');
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #4CAF50; font-weight: bold');
    console.log('Initializing components...');

    createSettingsUI();
    initUserState();
    displayAPIBudget();

    // Start background status refresh timer (Option 1 + Option 4 combo)
    // This refreshes all visible users every 3 minutes in the background
    // Combined with LastCheckCache, prevents duplicate refreshes on page reload
    startBackgroundStatusRefresh();

    // Check if on attack-related page immediately
    FightCapture.setupAttackPageObserver();

    // Auto-sync learning model from IndexedDB (runs async in background)
    autoSyncLearningModel();

    // Check for pending bust (after navigation)
    checkPendingBust();
    
    console.log('%c✓ ATK Scouter ready!', 'color: #4CAF50; font-weight: bold');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
