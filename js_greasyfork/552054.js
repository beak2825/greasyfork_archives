// ==UserScript==
// @name         enhanced todo
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.3.7
// @description  Todo-Panel mit Tag-Verwaltung
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/eintrag*
// @match        https://opus.geizhals.at/kalif/matchcode*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/552054/enhanced%20todo.user.js
// @updateURL https://update.greasyfork.org/scripts/552054/enhanced%20todo.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
  try {
    if (window.self !== window.top) return;
  } catch (e) {
    // Cross-origin iframe - auch nicht ausführen
    return;
  }

  // Zusätzliche Prüfung: Nur auf der erwarteten Seite ausführen
  if (!window.location.pathname.startsWith('/kalif/')) return;

  // Verhindere mehrfache Initialisierung im selben Fenster
  if (window.__enhancedTodoInitialized) return;
  window.__enhancedTodoInitialized = true;

  // Globaler Error-Handler um bestimmte DOM-Fehler zu unterdrücken
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('insertBefore')) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);

  const STORAGE_KEY_SELECTED_TAGS = 'geizhals_selected_tags';
  const SETTINGS_KEY = 'geizhals_tag_tracker_settings';
  const SEPARATOR_MARKER = '__separator__';

  // NEW: Hotkey Storage Keys
  const HOTKEYS_KEY = 'geizhals_hotkey_mappings';
  const HOTKEY_MODE_ENABLED_KEY = 'geizhals_hotkey_mode_enabled';
  const HIDE_TAGGED_KEY = 'geizhals_hide_tagged_rows';
  const TAG_HISTORY_KEY = 'geizhals_tag_history';
  const RESERVED_HOTKEYS = ['Enter', 'Escape', 'Tab'];

  // NEW: Sort State Keys
  const SORT_STATE_KEY_PREFIX = 'geizhals_sort_state_';
  const SORT_COLUMNS = {
    'Bezeichnung und Matchinfo': {
      storageKey: SORT_STATE_KEY_PREFIX + 'bezeichnung'
    },
    'Händler Kategorie': {
      storageKey: SORT_STATE_KEY_PREFIX + 'haendler_cat'
    }
  };

  // Default settings
  const DEFAULT_SETTINGS = {
    hotkeyModifier: 'mmb-or-alt',
    panelHeight: 'full',
    showFrequency: false,
    fixAGRDropdown: false,
    fixAGRDropdownValue: '',
    agrButtonOverride: '',
    searchbarEnabled: true,
    highlightingEnabled: true,
    highlightingColor: '#EF0FFF',
    pageSize: 100
  };

  // Hotkey Zone State
  let hotkeyZoneActive = false;

  // TAG_MAP: tag name -> { id, category, available: ['ohne', '@1', '@2', '@3'] }
  const TAG_MAP = {
    "3d": { id: "437", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "band": { id: "449", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "bare": { id: "450", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "buero": { id: "458", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "card": { id: "461", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "case": { id: "463", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "cont": { id: "464", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "cool": { id: "465", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "cpu": { id: "466", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "druck": { id: "485", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "ebook": { id: "488", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "epc": { id: "491", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "garantie": { id: "301548", category: "AGR-HW", available: ["@3"] },
    "graka": { id: "516", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "hdd": { id: "523", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "homeauto": { id: "526", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "input": { id: "530", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "kabel": { id: "534", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "kvm": { id: "565", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "lan": { id: "566", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "mks": { id: "571", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "mobo": { id: "573", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "mod": { id: "575", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "nks": { id: "577", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "noteb": { id: "578", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "odd": { id: "579", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "pca": { id: "585", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "pcv": { id: "586", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "psu": { id: "589", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "ram": { id: "595", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "roh": { id: "599", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "scan": { id: "606", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "sicherheit": { id: "608", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "ssd": { id: "628", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "tab": { id: "632", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "tft": { id: "633", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "tier": { id: "634", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "tito": { id: "635", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "usb": { id: "639", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "usv": { id: "640", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "wakü": { id: "641", category: "AGR-HW", available: ["@1", "@2", "@3"] },
    "wlan": { id: "653", category: "AGR-HW", available: ["@1", "@2", "@3"] },

    "akku": { id: "438", category: "AGR-CE", available: ["@1", "@2"] },
    "beamer": { id: "451", category: "AGR-CE", available: ["@1", "@2"] },
    "buehne": { id: "456", category: "AGR-CE", available: ["@1", "@2"] },
    "caraudio": { id: "459", category: "AGR-CE", available: ["@1", "@2"] },
    "djpro": { id: "467", category: "AGR-CE", available: ["@1", "@2"] },
    "dvb": { id: "486", category: "AGR-CE", available: ["@1", "@2"] },
    "einstall": { id: "488", category: "AGR-CE", available: ["@1", "@2"] },
    "festnetz": { id: "493", category: "AGR-CE", available: ["@1", "@2", "@3"] },
    "filme": { id: "496", category: "AGR-CE", available: ["@1"] },
    "foto": { id: "499", category: "AGR-CE", available: ["@1", "@2", "@3"] },
    "funk": { id: "501", category: "AGR-CE", available: ["@1"] },
    "handy": { id: "520", category: "AGR-CE", available: ["@1", "@2", "@3"] },
    "hifi": { id: "524", category: "AGR-CE", available: ["@1", "@2"] },
    "homevideo": { id: "527", category: "AGR-CE", available: ["@1", "@2"] },
    "instrument": { id: "531", category: "AGR-CE", available: ["@1", "@2", "@3"] },
    "kfz": { id: "538", category: "AGR-CE", available: ["ohne"] },
    "kopf": { id: "563", category: "AGR-CE", available: ["@1", "@2"] },
    "optik": { id: "580", category: "AGR-CE", available: ["@1", "@2"] },
    "portable": { id: "587", category: "AGR-CE", available: ["@1", "@2"] },
    "solar": { id: "610", category: "AGR-CE", available: ["@1", "@2"] },
    "spirits": { id: "622", category: "AGR-CE", available: ["@1", "@2"] },
    "tv": { id: "636", category: "AGR-CE", available: ["@1", "@2"] },

    "armaturen": { id: "439", category: "AGR-HH", available: ["@1"] },
    "baby": { id: "444", category: "AGR-HH", available: ["@1"] },
    "baby kisitz": { id: "441", category: "AGR-HH", available: ["@1"] },
    "baby kiwa": { id: "442", category: "AGR-HH", available: ["@1"] },
    "baby tasche": { id: "443", category: "AGR-HH", available: ["@1"] },
    "besteck": { id: "453", category: "AGR-HH", available: ["@1"] },
    "buegel": { id: "454", category: "AGR-HH", available: ["@1", "@2"] },
    "drogerie": { id: "299881", category: "AGR-HH", available: ["ohne"] },
    "drogerie advent": { id: "469", category: "AGR-HH", available: ["@1"] },
    "drogerie apo": { id: "470", category: "AGR-HH", available: ["@1"] },
    "drogerie duft": { id: "471", category: "AGR-HH", available: ["@1"] },
    "drogerie hygiene": { id: "475", category: "AGR-HH", available: ["@1", "@2"] },
    "drogerie koerper": { id: "477", category: "AGR-HH", available: ["@1", "@2"] },
    "drogerie kosmetik": { id: "479", category: "AGR-HH", available: ["@1"] },
    "drogerie liebe": { id: "480", category: "AGR-HH", available: ["@1"] },
    "drogerie linsen": { id: "481", category: "AGR-HH", available: ["@1", "@2"] },
    "drogerie mund": { id: "483", category: "AGR-HH", available: ["@1", "@2"] },
    "drogerie haar": { id: "472", category: "AGR-HH", available: ["@1", "@2"] },
    "esl": { id: "492", category: "AGR-HH", available: ["@1"] },
    "garten": { id: "512", category: "AGR-HH", available: ["@1", "@2"] },
    "garten hochdruck": { id: "507", category: "AGR-HH", available: ["@1"] },
    "garten moebel": { id: "508", category: "AGR-HH", available: ["@1"] },
    "garten rasen": { id: "509", category: "AGR-HH", available: ["@1", "@2"] },
    "garten wasser": { id: "511", category: "AGR-HH", available: ["@1"] },
    "geschirr": { id: "514", category: "AGR-HH", available: ["@1"] },
    "grill": { id: "518", category: "AGR-HH", available: ["@1", "@2"] },
    "kaffee": { id: "536", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross": { id: "548", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross back": { id: "540", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross dunst": { id: "541", category: "AGR-HH", available: ["@1"] },
    "kgross feld": { id: "542", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross gsp": { id: "543", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross kuehl": { id: "545", category: "AGR-HH", available: ["@1", "@2"] },
    "kgross mikro": { id: "547", category: "AGR-HH", available: ["@1", "@2"] },
    "kklein": { id: "550", category: "AGR-HH", available: ["@1", "@2"] },
    "klima heiz": { id: "558", category: "AGR-HH", available: ["@1", "@2"] },
    "klima luft": { id: "560", category: "AGR-HH", available: ["@1", "@2"] },
    "koffer": { id: "562", category: "AGR-HH", available: ["@1"] },
    "leuchten": { id: "568", category: "AGR-HH", available: ["@1", "@2"] },
    "mist": { id: "570", category: "AGR-HH", available: ["@1"] },
    "naeh": { id: "576", category: "AGR-HH", available: ["@1"] },
    "spielz": { id: "299880", category: "AGR-HH", available: ["ohne"] },
    "spielz gesellschaft": { id: "291185", category: "AGR-HH", available: ["@1"] },
    "spielz gesellsch": { id: "293838", category: "AGR-HH", available: ["ohne"] },
    "spielz modell": { id: "617", category: "AGR-HH", available: ["@1"] },
    "spielz baby": { id: "612", category: "AGR-HH", available: ["@1"] },
    "spielz bastel": { id: "613", category: "AGR-HH", available: ["@1"] },
    "spielz bau": { id: "614", category: "AGR-HH", available: ["@1"] },
    "spielz figur": { id: "615", category: "AGR-HH", available: ["@1"] },
    "spielz outdoor": { id: "619", category: "AGR-HH", available: ["@1"] },
    "spielz puzzle": { id: "620", category: "AGR-HH", available: ["@1"] },
    "spielz rolle": { id: "621", category: "AGR-HH", available: ["@1"] },
    "spuelen": { id: "624", category: "AGR-HH", available: ["@1", "@2"] },
    "staub": { id: "629", category: "AGR-HH", available: ["@1", "@2"] },
    "uhr": { id: "638", category: "AGR-HH", available: ["@1"] },
    "wamat": { id: "642", category: "AGR-HH", available: ["@1", "@2"] },
    "werkz": { id: "647", category: "AGR-HH", available: ["@1", "@2"] },
    "wetter": { id: "649", category: "AGR-HH", available: ["@1"] },

    "aze": { id: "440", category: "AGR-SPSWG", available: ["@1", "@2"] },
    "ball": { id: "445", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "fit": { id: "497", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "games": { id: "502", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "kleid": { id: "552", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "klett": { id: "555", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "out": { id: "582", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "rad": { id: "590", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "rkomp": { id: "596", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "roll": { id: "600", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "rzub": { id: "603", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "schuh": { id: "607", category: "AGR-SPSWG", available: ["@1", "@2"] },
    "software": { id: "609", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "spuhr": { id: "626", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "sun": { id: "631", category: "AGR-SPSWG", available: ["@1", "@2"] },
    "wasser": { id: "644", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },
    "winter": { id: "650", category: "AGR-SPSWG", available: ["@1", "@2", "@3"] },

    "keinekat": { id: "45127", category: "common", available: ["ohne"] },
    "keinhersteller": { id: "45128", category: "common", available: ["ohne"] },
    "keinedaten": { id: "45129", category: "common", available: ["ohne"] },
    "fixme": { id: "45134", category: "common", available: ["ohne"] },
    "top500": { id: "45136", category: "common", available: ["ohne"] },
    "top50": { id: "45137", category: "common", available: ["ohne"] }
  };

  // ==================== STYLES ====================

  const style = document.createElement('style');
  style.textContent = `
    /* Searchbar Styles */
    #geizhals-searchbar-container {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-bottom: 6px;
    }

    #geizhals-searchbar {
      flex: 1;
      max-width: 400px;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }

    #geizhals-searchbar:focus {
      border-color: #0066cc;
      box-shadow: 0 0 3px rgba(0, 102, 204, 0.3);
    }

    #geizhals-searchbar:disabled {
      background-color: #f0f0f0;
      color: #999;
      cursor: not-allowed;
    }

    .geizhals-tag-highlight {
      background-color: var(--highlight-color, #EF0FFF);
      padding: 0 2px;
      border-radius: 2px;
    }

    /* Quick Tags Panel */
    #geizhals-quick-tags {
      position: fixed;
      width: auto;
      max-width: calc(100vw - 40px);
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      display: none;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }

    #geizhals-quick-tags.height-limited {
      max-height: 500px;
      overflow-y: auto;
    }

    #geizhals-quick-tags.height-full {
      max-height: none;
      overflow-y: visible;
    }

    #geizhals-tag-list {
      display: flex;
      flex-direction: row;
      gap: 0;
      width: auto;
    }

    .geizhals-tag-column {
      flex: none;
      width: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px;
      border-right: 2px solid #ddd;
    }

    .geizhals-tag-column:last-child {
      border-right: none;
    }

    .geizhals-tag-entry {
      padding: 8px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 3px;
      margin-bottom: 4px;
    }

    .geizhals-tag-name {
      font-weight: bold;
      margin-bottom: 4px;
      color: #333;
    }

    .geizhals-tag-buttons {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .geizhals-tag-button {
      padding: 4px 8px;
      border: 1px solid #ccc;
      background: white;
      border-radius: 2px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .geizhals-tag-button:hover:not(:disabled) {
      background: #e8f4f8;
      border-color: #0066cc;
    }

    .geizhals-tag-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: #f0f0f0;
    }

    /* Management Overlay */
    #geizhals-entries-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      display: none;
      z-index: 10000;
    }

    #geizhals-entries-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 16px;
      z-index: 10001;
      min-width: 900px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }

    .geizhals-entries-grid {
      display: grid;
      grid-template-columns: 200px 1fr 1fr 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .geizhals-entries-column {
      display: flex;
      flex-direction: column;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fafafa;
      min-height: 400px;
      overflow-y: auto;
    }

    .geizhals-entries-column-header {
      padding: 8px;
      background: #e8e8e8;
      font-weight: bold;
      font-size: 12px;
      border-bottom: 1px solid #ddd;
      position: sticky;
      top: 0;
      text-align: center;
    }

    .geizhals-entries-column-content {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .geizhals-entry-item {
      padding: 6px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 2px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
    }

    .geizhals-entry-item:hover:not(.disabled) {
      background: #e8f4f8;
      border-color: #0066cc;
    }

    .geizhals-entry-item.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: #f0f0f0;
    }

    .geizhals-entry-item.dragging {
      opacity: 0.6;
      background: #fff3cd;
    }

    /* Separator Styles */
    .geizhals-separator-item {
      padding: 4px;
      background: #FFC107;
      border: 1px solid #FF9800;
      border-radius: 2px;
      font-size: 11px;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 20px;
    }

    .geizhals-separator-label {
      flex: 1;
      text-align: center;
      font-weight: bold;
      color: #333;
      cursor: default;
    }

    /* Add Separator Button */
    #geizhals-add-separator-btn {
      display: block;
      width: 100%;
      padding: 4px 6px;
      background: #FFC107;
      color: #333;
      border: 1px solid #FF9800;
      border-radius: 2px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 6px;
    }

    #geizhals-add-separator-btn:hover:not(:disabled) {
      background: #FFB300;
      border-color: #F57F17;
    }

    #geizhals-add-separator-btn:disabled {
      background: #E0E0E0;
      border-color: #BDBDBD;
      color: #999;
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Auto-Layout Controls */
    #geizhals-auto-layout-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      margin-top: 8px;
    }

    .geizhals-auto-layout-title {
      font-size: 11px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }

    .geizhals-columns-row {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .geizhals-columns-label {
      font-size: 12px;
      font-weight: 500;
      color: #333;
    }

    #geizhals-columns-dropdown {
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 2px;
      font-size: 12px;
      background: white;
      cursor: pointer;
      min-width: 70px;
    }

    #geizhals-columns-dropdown:disabled {
      background: #f0f0f0;
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Hotkey Zone Styles */
    .geizhals-hotkey-zone {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 2px dashed #999;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
      margin-bottom: 6px;
      min-height: 24px;
      user-select: none;
    }

    .geizhals-hotkey-zone:hover {
      border-color: #666;
      background: #eee;
    }

    .geizhals-hotkey-zone.waiting {
      border-color: #0066cc;
      border-style: solid;
      background: #e8f4ff;
      color: #0066cc;
    }

    .geizhals-hotkey-zone.success {
      border-color: #228B22;
      border-style: solid;
      background: #e8ffe8;
      color: #228B22;
    }

    .geizhals-hotkey-zone.error {
      border-color: #cc0000;
      border-style: solid;
      background: #ffe8e8;
      color: #cc0000;
    }

    /* Hotkey Mode Section */
    #geizhals-hotkey-mode-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      margin-top: 8px;
    }

    #geizhals-hotkey-mode-toggle {
      width: 24px;
      height: 16px;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      background: #ccc;
      border: 1px solid #999;
      border-radius: 8px;
      outline: none;
      transition: background 0.3s;
    }

    #geizhals-hotkey-mode-toggle:checked {
      background: #84E8BA;
    }

    .geizhals-hotkey-button-inline {
      padding: 0;
      border: 1px solid rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      font-size: 9px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      color: #000;
      white-space: nowrap;
      flex-shrink: 0;
      text-align: center;
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .geizhals-hotkey-button-inline:hover {
      background: rgba(255,255,255,0.5);
    }

    .geizhals-hotkey-button-inline.has-key {
      background: #84E8BA;
    }

    /* Enhanced Todo Styles */
    .geizhals-todo-tag-header {
      width: 1%;
      white-space: nowrap;
    }

    #trash-toggle-container {
      padding: 6px 10px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin-top: 8px;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      white-space: nowrap;
    }

    #trash-toggle-container label {
      margin: 0;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      font-size: 0.64rem;
      white-space: nowrap;
    }

    #trash-toggle-checkbox,
    #hide-tagged-checkbox {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }

    .trash-toggle-row {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .hide-tagged-separator {
      display: none;
    }

    #hide-tagged-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .tag.force-hover,
    .tag.force-hover *,
    .tag.force-hover span.delete-button,
    .tag.force-hover span.delete-button * {
      transition: none !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      animation: none !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transform: none !important;
    }

    .tag.force-hover span.delete-button,
    .tag.force-hover > span.delete-button {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
    }

    .tag.force-hover span.delete-button *,
    .tag.force-hover > span.delete-button * {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
    }

    .copy-icon-wrapper {
      display: inline-flex;
      align-items: center;
      margin-left: 6px;
      vertical-align: middle;
    }

    .copy-icon {
      cursor: pointer;
      color: #6c757d;
      transition: color 0.2s ease, transform 0.1s ease;
      display: inline-flex;
      align-items: center;
    }

    .copy-icon:hover {
      color: #495057;
      transform: scale(1.1);
    }

    .copy-icon:active {
      transform: scale(0.95);
    }

    .copy-icon.copied {
      color: #28a745;
    }

    /* Image Hover Animation Disable */
    body.disable-image-hover img.image--small {
      pointer-events: none !important;
      cursor: default !important;
    }

    body.disable-image-hover img[data-doubleclick-listener="true"] {
      pointer-events: none !important;
      cursor: default !important;
    }

    /* Hotkey Modal */
    #geizhals-hotkey-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 999999;
      align-items: center;
      justify-content: center;
    }

    /* Hotkey Mode Dialog Expansion */
    body.geizhals-hotkey-mode-active #geizhals-entries-dialog {
      min-width: 1560px !important;
    }

    body.geizhals-hotkey-mode-active .geizhals-entries-grid {
      grid-template-columns: 420px 1fr 1fr 1fr 1fr 1fr !important;
    }

    /* Hotkey Buttons - Keep in single row */
    .geizhals-hotkey-buttons-div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      align-items: center;
      justify-items: stretch;
      flex-shrink: 0;
      width: 200px;
      min-width: 200px;
      height: 24px;
      align-content: center;
    }

    /* Tag-Verwaltung Link */
    .geizhals-tag-management-link {
      display: block;
      padding: 8px 12px;
      background: #E8F1FF;
      border: 1px solid #B3D9FF;
      border-radius: 3px;
      text-align: center;
      color: #0066cc;
      font-weight: 500;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 12px;
      text-decoration: none;
      user-select: none;
    }

    .geizhals-tag-management-link:hover {
      background: #D4E5FF;
      border-color: #8AB3FF;
      color: #003d99;
    }

    .geizhals-tag-management-link:active {
      background: #C0D9FF;
    }

    /* Settings Checkbox Groups */
    .geizhals-settings-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .geizhals-settings-group input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .geizhals-settings-group label {
      font-size: 12px;
      cursor: pointer;
      color: #333;
      user-select: none;
    }

    .geizhals-settings-group.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .geizhals-color-picker-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .geizhals-color-picker-group label {
      font-size: 12px;
      color: #333;
      min-width: 150px;
    }

    .geizhals-color-picker-group input[type="color"] {
      width: 40px;
      height: 28px;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
    }

    .geizhals-color-picker-group input[type="color"]:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .geizhals-color-picker-group.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Sort Buttons Container */
    .geizhals-sort-container {
      padding: 4px 8px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin-top: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      width: 100%;
      box-sizing: border-box;
    }

    .geizhals-sort-button {
      background: white;
      border: 1px solid #ccc;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: #333;
      user-select: none;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .geizhals-sort-button:hover {
      background: #e8f4f8;
      border-color: #0066cc;
    }

    .geizhals-sort-button:active {
      background: #d4e8f3;
    }

    .geizhals-search-input {
      flex: 1;
      min-width: 0;
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-size: 11px;
      background: white;
      color: #333;
      box-sizing: border-box;
    }

    .geizhals-search-input::placeholder {
      color: #999;
    }

    .geizhals-search-input:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 3px rgba(0, 102, 204, 0.3);
    }

    .geizhals-highlight-search {
      background-color: #EF0FFF;
      padding: 0 2px;
    }
  `;
  document.head.appendChild(style);

  // ==================== SETTINGS ====================

  function getSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function getSelectedTags() {
    const stored = localStorage.getItem(STORAGE_KEY_SELECTED_TAGS);
    return stored ? JSON.parse(stored) : [];
  }

  function saveSelectedTags(tags) {
    localStorage.setItem(STORAGE_KEY_SELECTED_TAGS, JSON.stringify(tags));
  }

  // ==================== SORT STATE MANAGEMENT ====================

  function getSortState(columnKey) {
    const state = localStorage.getItem(SORT_COLUMNS[columnKey].storageKey);
    return state || 'asc';
  }

  function setSortState(columnKey, state) {
    localStorage.setItem(SORT_COLUMNS[columnKey].storageKey, state);
  }

  function getSortButtonText(sortState) {
    return sortState === 'asc' ? '↑' : '↓';
  }

  // ==================== COLUMN SEARCH/FILTER ====================

  function getFilterState(columnName) {
    const key = 'geizhals_filter_' + columnName.replace(/\s+/g, '_').toLowerCase();
    return localStorage.getItem(key) || '';
  }

  function setFilterState(columnName, value) {
    const key = 'geizhals_filter_' + columnName.replace(/\s+/g, '_').toLowerCase();
    localStorage.setItem(key, value);
  }

  function parseSearchTerms(input) {
    if (!input.trim()) return [];
    const terms = input.split(/\s+/);
    return terms.map(term => {
      if (term.includes('|')) {
        return { type: 'or', values: term.split('|').filter(v => v.length > 0) };
      } else {
        return { type: 'and', values: [term] };
      }
    });
  }

  function matchesFilter(text, parsedTerms) {
    if (parsedTerms.length === 0) return true;
    const lowerText = text.toLowerCase();
    return parsedTerms.every(term => {
      return term.values.some(val => lowerText.includes(val.toLowerCase()));
    });
  }

  function highlightCellText(cell, parsedTerms) {
    if (parsedTerms.length === 0) {
      cell.innerHTML = cell.textContent;
      return;
    }
    let html = cell.textContent;
    const allTerms = parsedTerms.flatMap(t => t.values);
    const uniqueTerms = [...new Set(allTerms)].sort((a, b) => b.length - a.length);
    uniqueTerms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      html = html.replace(regex, '<span class="geizhals-highlight-search">$1</span>');
    });
    cell.innerHTML = html;
  }

  // Global filter state
  const filterState = {};

  function filterTableBySearch(columnName, searchText, cellIdentifier) {
    // Speichere den Filter für diese Spalte
    if (searchText.trim()) {
      filterState[columnName] = { searchText, cellIdentifier };
    } else {
      delete filterState[columnName];
    }

    // Wende ALLE Filter kombiniert an
    applyAllFilters();
  }

  function applyAllFilters() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr.ft__body__row'));

    const hasActiveFilter = Object.keys(filterState).length > 0;
    const masterCheckboxCell = document.querySelector('th.ft__head__filter__cell');

    if (hasActiveFilter && masterCheckboxCell) {
      masterCheckboxCell.style.pointerEvents = 'none';
      masterCheckboxCell.style.opacity = '0.6';
    } else if (masterCheckboxCell) {
      masterCheckboxCell.style.pointerEvents = 'auto';
      masterCheckboxCell.style.opacity = '1';
    }

    if (!hasActiveFilter) {
      // Wenn kein Filter aktiv ist, alle Zeilen anzeigen und alle Zellen bereinigen
      rows.forEach(row => {
        row.style.display = '';
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
          if (cell.querySelector('.geizhals-highlight-search')) {
            cell.innerHTML = cell.textContent;
          }
        });
      });
    } else {
      // Mit aktiven Filtern: Zeilen filtern und highlighting anwenden
      rows.forEach(row => {
        let isVisible = true;

        // Überprüfe jeden aktiven Filter
        for (const [columnName, filterConfig] of Object.entries(filterState)) {
          const cell = row.querySelector(`td[id^="${filterConfig.cellIdentifier}"]`);
          if (!cell) {
            isVisible = false;
            break;
          }
          const parsedTerms = parseSearchTerms(filterConfig.searchText);
          if (!matchesFilter(cell.textContent, parsedTerms)) {
            isVisible = false;
            break;
          }
        }

        row.style.display = isVisible ? '' : 'none';

        // Highlighting für alle sichtbaren Zellen
        if (isVisible) {
          for (const [columnName, filterConfig] of Object.entries(filterState)) {
            const cell = row.querySelector(`td[id^="${filterConfig.cellIdentifier}"]`);
            if (cell) {
              const parsedTerms = parseSearchTerms(filterConfig.searchText);
              highlightCellText(cell, parsedTerms);
            }
          }
        } else {
          // Clear highlighting von versteckten Zeilen
          for (const [columnName, filterConfig] of Object.entries(filterState)) {
            const cell = row.querySelector(`td[id^="${filterConfig.cellIdentifier}"]`);
            if (cell) {
              cell.innerHTML = cell.textContent;
            }
          }
        }
      });
    }

    updateMasterCheckboxState();
  }

  function getVisibleRows() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return [];
    // Nutze getComputedStyle um sicherzugehen, dass die Zeile wirklich sichtbar ist
    return Array.from(tbody.querySelectorAll('tr.ft__body__row')).filter(row => {
      return window.getComputedStyle(row).display !== 'none';
    });
  }

  function hasActiveFilter() {
    const searchInputs = document.querySelectorAll('.geizhals-search-input');
    return Array.from(searchInputs).some(input => input.value.trim() !== '');
  }

  function getOrCreateMasterCheckbox() {
    let masterCheckbox = document.getElementById('geizhals-master-checkbox');
    if (masterCheckbox) return masterCheckbox;

    // Finde die native Master-Checkbox
    const nativeCheckbox = document.getElementById('select-all');
    if (!nativeCheckbox) return null;

    // Erstelle die Master-Checkbox
    masterCheckbox = document.createElement('input');
    masterCheckbox.type = 'checkbox';
    masterCheckbox.id = 'geizhals-master-checkbox';
    masterCheckbox.className = 'form-check-input';
    masterCheckbox.style.cssText = 'cursor: pointer;';

    // Click-Handler für Master-Checkbox
    masterCheckbox.addEventListener('click', function(e) {
      e.stopPropagation();

      const visibleRows = getVisibleRows();
      const visibleCheckboxes = visibleRows
        .map(row => row.querySelector('input.form-check-input'))
        .filter(cb => cb && cb !== masterCheckbox && cb.id !== 'select-all');

      const allChecked = visibleCheckboxes.every(cb => cb.checked);
      const newState = !allChecked;

      visibleCheckboxes.forEach(cb => {
        if (cb.checked !== newState) {
          // Dispatche ein echtes MouseEvent für React-Kompatibilität
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          cb.dispatchEvent(clickEvent);
        }
      });

      // Verzögert Master-State aktualisieren
      setTimeout(() => {
        updateMasterCheckboxState();
      }, 50);
    });

    // Füge die Skript-Checkbox direkt nach der nativen ein
    nativeCheckbox.parentNode.insertBefore(masterCheckbox, nativeCheckbox.nextSibling);
    return masterCheckbox;
  }

  function removeMasterCheckbox() {
    const masterCheckbox = document.getElementById('geizhals-master-checkbox');
    if (masterCheckbox) {
      masterCheckbox.remove();
    }
  }

  function updateMasterCheckboxVisibility() {
    const hasFilter = hasActiveFilter();
    const visibleRows = getVisibleRows();
    const visibleCheckboxes = visibleRows
      .map(row => row.querySelector('input.form-check-input'))
      .filter(cb => cb && cb.id !== 'geizhals-master-checkbox' && cb.id !== 'select-all');

    const nativeCheckbox = document.getElementById('select-all');
    const parentCell = nativeCheckbox ? nativeCheckbox.closest('th.ft__head__filter__cell') : null;

    if (hasFilter && visibleCheckboxes.length > 0) {
      // Native Checkbox ausblenden
      if (nativeCheckbox) {
        nativeCheckbox.style.display = 'none';
      }
      // Parent-Styles zurücksetzen damit Skript-Checkbox sichtbar und klickbar ist
      if (parentCell) {
        parentCell.style.pointerEvents = '';
        parentCell.style.opacity = '';
      }
      // Skript-Checkbox anzeigen
      getOrCreateMasterCheckbox();
      updateMasterCheckboxState();
    } else {
      // Skript-Checkbox entfernen
      removeMasterCheckbox();
      // Native Checkbox wieder einblenden
      if (nativeCheckbox) {
        nativeCheckbox.style.display = '';
      }
      // Parent-Styles nicht zurücksetzen - das macht die Seite selbst
    }
  }

  function updateMasterCheckboxState() {
    const masterCheckbox = document.getElementById('geizhals-master-checkbox');
    if (!masterCheckbox) return;

    const visibleRows = getVisibleRows();
    const visibleCheckboxes = visibleRows
      .map(row => row.querySelector('input.form-check-input'))
      .filter(cb => cb && cb !== masterCheckbox && cb.id !== 'select-all');
    const checkedCount = visibleCheckboxes.filter(cb => cb.checked).length;

    if (visibleCheckboxes.length === 0) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    } else if (checkedCount === 0) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    } else if (checkedCount === visibleCheckboxes.length) {
      masterCheckbox.checked = true;
      masterCheckbox.indeterminate = false;
    } else {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = true;
    }
  }

  function handleMasterCheckbox() {
    // Überwache Änderungen bei einzelnen Checkboxen
    const tbody = document.querySelector('tbody');
    if (tbody) {
      const observer = new MutationObserver(() => {
        const checkboxes = document.querySelectorAll('input.form-check-input:not(#geizhals-master-checkbox):not(#select-all)');
        checkboxes.forEach(cb => {
          if (!cb.dataset.masterListening) {
            cb.dataset.masterListening = 'true';
            cb.addEventListener('change', () => {
              updateMasterCheckboxState();
            });
          }
        });
        // Aktualisiere Master-Checkbox Sichtbarkeit bei DOM-Änderungen
        updateMasterCheckboxVisibility();
      });
      observer.observe(tbody, { childList: true, subtree: true });
    }

    // Überwache Filter-Eingabefelder
    const setupFilterListeners = () => {
      const searchInputs = document.querySelectorAll('.geizhals-search-input');
      searchInputs.forEach(input => {
        if (!input.dataset.masterFilterListening) {
          input.dataset.masterFilterListening = 'true';
          input.addEventListener('input', () => {
            // Verzögert ausführen um DOM-Updates abzuwarten
            setTimeout(() => {
              updateMasterCheckboxVisibility();
            }, 50);
          });
        }
      });
    };

    // Initial und bei DOM-Änderungen
    setupFilterListeners();

    // MutationObserver für neue Filter-Felder
    const headerObserver = new MutationObserver(() => {
      setupFilterListeners();
    });
    const thead = document.querySelector('thead');
    if (thead) {
      headerObserver.observe(thead, { childList: true, subtree: true });
    }

    // Initial prüfen
    updateMasterCheckboxVisibility();
  }

  // ==================== HOTKEY MANAGEMENT ====================

  let activeHotkeyListener = null;

  function getHotkeys() {
    const stored = localStorage.getItem(HOTKEYS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  function saveHotkeys(hotkeys) {
    localStorage.setItem(HOTKEYS_KEY, JSON.stringify(hotkeys));
  }

  function isHotkeyModeEnabled() {
    return localStorage.getItem(HOTKEY_MODE_ENABLED_KEY) === 'true';
  }

  function setHotkeyModeEnabled(enabled) {
    localStorage.setItem(HOTKEY_MODE_ENABLED_KEY, enabled ? 'true' : 'false');
  }

  function generateHotkeyKey(tagName, slot) {
    return `${tagName}:${slot}`;
  }

  function getHotkeyForTag(tagName, slot) {
    const hotkeys = getHotkeys();
    return hotkeys[generateHotkeyKey(tagName, slot)] || null;
  }

  function setHotkeyForTag(tagName, slot, hotkey) {
    const hotkeys = getHotkeys();
    const key = generateHotkeyKey(tagName, slot);
    if (hotkey) {
      hotkeys[key] = hotkey.toUpperCase();
    } else {
      delete hotkeys[key];
    }
    saveHotkeys(hotkeys);
  }

  function isHotkeyUnique(newHotkey) {
    const hotkeys = getHotkeys();
    const normalizedNewHotkey = newHotkey.toUpperCase();
    for (const hotkey of Object.values(hotkeys)) {
      if (hotkey.toUpperCase() === normalizedNewHotkey) {
        return false;
      }
    }
    return true;
  }

  function findHotkeyAssignment(hotkey) {
    const hotkeys = getHotkeys();
    const normalizedHotkey = hotkey.toUpperCase();
    for (const [key, value] of Object.entries(hotkeys)) {
      if (value.toUpperCase() === normalizedHotkey) {
        const [tagName, slot] = key.split(':');
        return { tagName, slot };
      }
    }
    return null;
  }

  function isModifierKey(key) {
    return ['Shift', 'Control', 'Alt', 'Meta'].includes(key);
  }

  function getNormalizedHotkeyFromEvent(event) {
    const keyCode = event.code;
    const key = event.key;

    if (keyCode.startsWith('Numpad')) {
      const numpadNumber = keyCode.replace('Numpad', '');
      if (numpadNumber === 'Multiply') return 'Num*';
      if (numpadNumber === 'Add') return 'Num+';
      if (numpadNumber === 'Subtract') return 'Num-';
      if (numpadNumber === 'Decimal') return 'Num.';
      if (numpadNumber === 'Divide') return 'Num/';
      if (numpadNumber === 'Enter') return 'NumEnter';
      return `Num${numpadNumber}`;
    }

    return key.toUpperCase();
  }

  function displayHotkeyText(hotkey) {
    if (!hotkey) return '';
    const upperHotkey = hotkey.toUpperCase();
    if (upperHotkey.startsWith('NUM')) {
      const rest = upperHotkey.substring(3);
      return `Num${rest}`;
    }
    return upperHotkey;
  }

  function getAvailableSlots(tagName) {
    const tagInfo = TAG_MAP[tagName];
    if (!tagInfo) return [];
    const result = [];
    if (tagInfo.available.includes('ohne')) result.push('ohne');
    if (tagInfo.available.includes('@1')) result.push('@1');
    if (tagInfo.available.includes('@2')) result.push('@2');
    if (tagInfo.available.includes('@3')) result.push('@3');
    return result;
  }

  function deleteHotkeysForTag(tagName) {
    const hotkeys = getHotkeys();
    const slots = getAvailableSlots(tagName);
    slots.forEach(slot => {
      const key = generateHotkeyKey(tagName, slot);
      delete hotkeys[key];
    });
    saveHotkeys(hotkeys);
  }

  // ==================== HOTKEY MODAL ====================

  function createHotkeyModal() {
    let modal = document.getElementById('geizhals-hotkey-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'geizhals-hotkey-modal';
    modal.style.cssText = `position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);display: none;z-index: 999999;align-items: center;justify-content: center;`;

    const dialog = document.createElement('div');
    dialog.style.cssText = `background: white;border: 1px solid #ddd;border-radius: 6px;padding: 24px;box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;text-align: center;max-width: 320px;z-index: 999999;`;

    const messageEl = document.createElement('div');
    messageEl.id = 'geizhals-hotkey-modal-message';
    messageEl.style.cssText = `font-size: 14px;color: #333;margin-bottom: 20px;line-height: 1.5;font-weight: 500;`;
    messageEl.textContent = 'Taste drücken, um Hotkey zu setzen';

    const errorEl = document.createElement('div');
    errorEl.id = 'geizhals-hotkey-modal-error';
    errorEl.style.cssText = `font-size: 12px;color: #D32F2F;margin-bottom: 12px;display: none;font-weight: 500;`;

    const keyDisplayEl = document.createElement('div');
    keyDisplayEl.id = 'geizhals-hotkey-modal-key';
    keyDisplayEl.style.cssText = `font-size: 24px;font-weight: bold;color: #0066cc;margin-bottom: 20px;min-height: 30px;letter-spacing: 2px;`;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Abbrechen';
    cancelBtn.style.cssText = `background: #ddd;color: #333;border: none;padding: 8px 16px;border-radius: 3px;font-size: 13px;font-weight: 500;cursor: pointer;transition: all 0.2s;`;
    cancelBtn.onmouseover = () => cancelBtn.style.background = '#ccc';
    cancelBtn.onmouseout = () => cancelBtn.style.background = '#ddd';
    cancelBtn.onclick = () => closeHotkeyModal();

    dialog.appendChild(messageEl);
    dialog.appendChild(errorEl);
    dialog.appendChild(keyDisplayEl);
    dialog.appendChild(cancelBtn);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    return modal;
  }

  function openHotkeyModal(tagName, slot, onConfirm) {
    const modal = createHotkeyModal();
    const messageEl = document.getElementById('geizhals-hotkey-modal-message');
    const errorEl = document.getElementById('geizhals-hotkey-modal-error');
    const keyDisplayEl = document.getElementById('geizhals-hotkey-modal-key');

    messageEl.textContent = 'Taste drücken, um Hotkey zu setzen';
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    keyDisplayEl.textContent = '';
    modal.style.display = 'flex';

    let hasInput = false;

    const handleKeydown = (e) => {
      if (hasInput) return;

      const key = getNormalizedHotkeyFromEvent(e);

      // Escape schließt das Modal ohne Hotkey zu setzen
      if (e.key === 'Escape' || key === 'ESCAPE') {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('keydown', handleKeydown, true);
        closeHotkeyModal();
        return;
      }

      hasInput = true;
      e.preventDefault();
      e.stopPropagation();

      if (isModifierKey(e.key)) {
        errorEl.textContent = 'Nur Modifizierer - bitte eine andere Taste drücken';
        errorEl.style.display = 'block';
        hasInput = false;
        return;
      }

      if (RESERVED_HOTKEYS.includes(key)) {
        errorEl.textContent = `"${key}" ist reserviert`;
        errorEl.style.display = 'block';
        hasInput = false;
        return;
      }

      if (!isHotkeyUnique(key)) {
        errorEl.textContent = 'Hotkey bereits vergeben';
        errorEl.style.display = 'block';
        hasInput = false;
        return;
      }

      keyDisplayEl.textContent = displayHotkeyText(key);
      messageEl.textContent = 'Hotkey gespeichert ✓';
      messageEl.style.color = '#28a745';

      setTimeout(() => {
        closeHotkeyModal();
        if (onConfirm) onConfirm(key);
      }, 800);

      document.removeEventListener('keydown', handleKeydown, true);
    };

    document.addEventListener('keydown', handleKeydown, true);
    activeHotkeyListener = handleKeydown;
  }

  function closeHotkeyModal() {
    const modal = document.getElementById('geizhals-hotkey-modal');
    if (!modal) return;

    if (activeHotkeyListener) {
      document.removeEventListener('keydown', activeHotkeyListener, true);
      activeHotkeyListener = null;
    }

    modal.style.display = 'none';
  }

  function closePanel(panel) {
    if (!panel) return;
    const searchbar = document.getElementById('geizhals-searchbar');
    if (searchbar) {
      searchbar.value = '';
    }
    Object.keys(filterState).forEach(key => delete filterState[key]);
    hotkeyZoneActive = false;
    panel.style.display = 'none';
  }

  // ==================== CENTERED ALERT ====================

  function showCenteredAlert(message) {
    const existingOverlay = document.getElementById('geizhals-alert-overlay');
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'geizhals-alert-overlay';
    overlay.style.cssText = `position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);display: flex;align-items: center;justify-content: center;z-index: 999999;`;

    const alertBox = document.createElement('div');
    alertBox.style.cssText = `background: white;border: 1px solid #ddd;border-radius: 6px;padding: 24px;box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;text-align: center;max-width: 400px;z-index: 999999;`;

    const messageEl = document.createElement('div');
    messageEl.style.cssText = `font-size: 14px;color: #333;margin-bottom: 20px;line-height: 1.5;`;
    messageEl.textContent = message;
    alertBox.appendChild(messageEl);

    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `background: #0066cc;color: white;border: none;padding: 8px 24px;border-radius: 3px;font-size: 13px;font-weight: 500;cursor: pointer;transition: all 0.2s;`;
    okBtn.onmouseover = () => okBtn.style.background = '#0052a3';
    okBtn.onmouseout = () => okBtn.style.background = '#0066cc';
    okBtn.onclick = () => overlay.remove();

    const handleKeydown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);

    alertBox.appendChild(okBtn);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    okBtn.focus();
  }

  // ==================== AGR VALIDATION ====================

  function validateAGRDropdown(tagName) {
    const tagInfo = TAG_MAP[tagName];
    if (!tagInfo) return true;

    const category = tagInfo.category;

    if (category === 'common') return true;

    const categoryToDropdownValue = {
      'AGR-HW': 'AGR-HW',
      'AGR-CE': 'AGR-CE',
      'AGR-HH': 'AGR-HH',
      'AGR-SPSWG': 'AGR-SP/SWG'
    };

    const expectedDropdownValue = categoryToDropdownValue[category];
    if (!expectedDropdownValue) return true;

    const agrDropdown = document.querySelector('select[aria-label="AGR"]');
    if (!agrDropdown) return true;

    const currentValue = agrDropdown.value;

    if (currentValue === expectedDropdownValue || currentValue === 'all') {
      return true;
    }

    showCenteredAlert(`AGR-Dropdown nicht korrekt ("${expectedDropdownValue}" oder "Alle AGR")`);
    return false;
  }

  // ==================== SEPARATOR UTILITIES ====================

  function isSeparator(tag) {
    return tag === SEPARATOR_MARKER;
  }

  function validateAndCleanSeparators(tags) {
    if (tags.length === 0) return tags;

    while (tags.length > 0 && isSeparator(tags[0])) {
      tags.shift();
    }

    while (tags.length > 0 && isSeparator(tags[tags.length - 1])) {
      tags.pop();
    }

    for (let i = tags.length - 1; i > 0; i--) {
      if (isSeparator(tags[i]) && isSeparator(tags[i - 1])) {
        tags.splice(i, 1);
      }
    }

    const regularCount = tags.filter(tag => !isSeparator(tag)).length;

    if (regularCount === 0) {
      return tags.filter(tag => !isSeparator(tag));
    }

    return tags;
  }

  function calculateMaxTagNameWidth(columnTags) {
    let maxWidth = 0;

    columnTags.forEach(tagName => {
      const tagInfo = TAG_MAP[tagName];
      if (!tagInfo) return;

      const tempSpan = document.createElement('span');
      tempSpan.style.cssText = `position: absolute;visibility: hidden;font-weight: bold;font-size: 11px;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;`;
      tempSpan.textContent = tagName;
      document.body.appendChild(tempSpan);

      const width = tempSpan.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }

      document.body.removeChild(tempSpan);
    });

    return maxWidth + 8;
  }

  // ==================== SEARCH & HIGHLIGHT FUNCTIONS ====================

  function highlightText(text, searchTerm, highlightColor) {
    if (!searchTerm || !highlightColor) return text;

    const lowerSearch = searchTerm.toLowerCase();
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);

    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);

    const highlighted = `<span class="geizhals-tag-highlight" style="background-color: ${highlightColor};">${match}</span>`;
    return before + highlighted + after;
  }

  function filterAndHighlightTags(selectedTags, searchTerm, settings) {
    const filtered = selectedTags.filter(tag => {
      if (isSeparator(tag)) return false;
      return tag.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    return filtered;
  }

  function createSearchbar(container) {
    const selectedTags = getSelectedTags();
    const hasItems = selectedTags.length > 0;

    let searchbar = document.getElementById('geizhals-searchbar');
    if (searchbar) searchbar.parentElement.remove();

    const searchbarContainer = document.createElement('div');
    searchbarContainer.id = 'geizhals-searchbar-container';
    searchbarContainer.style.cssText = `display: flex; gap: 6px; align-items: center; margin-bottom: 6px;`;

    searchbar = document.createElement('input');
    searchbar.id = 'geizhals-searchbar';
    searchbar.type = 'text';
    searchbar.placeholder = 'Tags filtern...';
    searchbar.disabled = !hasItems;
    searchbar.style.cssText = `flex: 1; max-width: 400px;`;

    searchbar.addEventListener('input', (e) => {
      const panel = document.getElementById('geizhals-quick-tags');
      if (panel) {
        updateQuickTagsPanel(panel);
      }
    });

    searchbarContainer.appendChild(searchbar);

    // Kommentar Button rechts neben der Suchleiste
    const kommentarBtn = document.createElement('button');
    kommentarBtn.type = 'button';
    kommentarBtn.id = 'geizhals-kommentar-btn';
    kommentarBtn.style.cssText = `background: ${hasItems ? '#e8e8e8' : '#d3d3d3'};border: 1px solid ${hasItems ? '#ccc' : '#999'};cursor: ${hasItems ? 'pointer' : 'not-allowed'};font-size: 11px;padding: 2px 4px;color: ${hasItems ? '#333' : '#999'};font-weight: 500;border-radius: 3px;transition: all 0.2s;white-space: nowrap;height: 22px;line-height: 1;display: inline-flex;align-items: center;flex-shrink: 0;`;
    kommentarBtn.textContent = 'Kommentar';
    kommentarBtn.disabled = !hasItems;
    kommentarBtn.onmouseover = () => {
      if (!kommentarBtn.disabled && !kommentarBtn.dataset.active) {
        kommentarBtn.style.background = '#d0d0d0';
      }
    };
    kommentarBtn.onmouseout = () => {
      if (!kommentarBtn.disabled && !kommentarBtn.dataset.active) {
        kommentarBtn.style.background = '#e8e8e8';
      }
    };
    kommentarBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!kommentarBtn.disabled) {
        toggleCommentMode(kommentarBtn);
      }
    };
    searchbarContainer.appendChild(kommentarBtn);

    // Gear Button rechts neben der Suchleiste
    const gearBtn = document.createElement('button');
    gearBtn.id = 'geizhals-gear-btn-header';
    gearBtn.type = 'button';
    gearBtn.style.cssText = `background: none;border: none;cursor: pointer;font-size: 13px;padding: 1px 2px;color: #666;transition: color 0.2s;display: inline-flex;align-items: center;height: 22px;flex-shrink: 0;`;
    gearBtn.innerHTML = '⚙️';
    gearBtn.onmouseover = () => gearBtn.style.color = '#333';
    gearBtn.onmouseout = () => gearBtn.style.color = '#666';
    gearBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSettingsDialog();
    };

    searchbarContainer.appendChild(gearBtn);

    // X-Button zum Schließen
    const closeBtn = document.createElement('button');
    closeBtn.id = 'geizhals-close-btn';
    closeBtn.type = 'button';
    closeBtn.style.cssText = `background: none;border: none;cursor: pointer;font-size: 14px;padding: 1px 4px;color: #999;transition: color 0.2s;display: inline-flex;align-items: center;height: 22px;flex-shrink: 0;margin-left: auto;`;
    closeBtn.innerHTML = '✕';
    closeBtn.onmouseover = () => closeBtn.style.color = '#cc0000';
    closeBtn.onmouseout = () => closeBtn.style.color = '#999';
    closeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePanel(container);
    };

    searchbarContainer.appendChild(closeBtn);

    // Panel-Drag über den weißen Bereich
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panelStartX = 0;
    let panelStartY = 0;

    container.style.cursor = 'move';

    container.addEventListener('mousedown', (e) => {
      // Nicht starten wenn auf interaktive Elemente geklickt wird
      if (e.target.closest('button, input, select, a, .geizhals-tag-button, .geizhals-hotkey-zone')) return;
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const rect = container.getBoundingClientRect();
      panelStartX = rect.left;
      panelStartY = rect.top;
      e.preventDefault();
    }, true);

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      let newX = panelStartX + deltaX;
      let newY = panelStartY + deltaY;
      newX = Math.max(10, Math.min(newX, window.innerWidth - container.offsetWidth - 10));
      newY = Math.max(10, Math.min(newY, window.innerHeight - 30));
      container.style.left = newX + 'px';
      container.style.top = newY + 'px';
    }, false);

    document.addEventListener('mouseup', () => {
      isDragging = false;
    }, false);

    try {
      const tagList = container.querySelector('#geizhals-tag-list');
      if (tagList && tagList.parentNode === container) {
        container.insertBefore(searchbarContainer, tagList);
      } else if (container.firstChild) {
        container.insertBefore(searchbarContainer, container.firstChild);
      } else {
        container.appendChild(searchbarContainer);
      }
    } catch (e) {
      // Fallback: einfach anhängen
      try { container.appendChild(searchbarContainer); } catch (e2) {}
    }
  }

  function getSearchTerm() {
    const searchbar = document.getElementById('geizhals-searchbar');
    return searchbar ? searchbar.value : '';
  }

  // ==================== QUICK TAGS PANEL ====================

  function createQuickTagsPanel() {
    let panel = document.getElementById('geizhals-quick-tags');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'geizhals-quick-tags';
    panel.classList.add('height-full');
    panel.style.cssText = `position: fixed;width: auto;max-width: calc(100vw - 40px);background: white;border: 1px solid #ddd;border-radius: 4px;padding: 8px;display: none;z-index: 9999;box-shadow: 0 2px 8px rgba(0,0,0,0.15);font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;max-height: 80vh;overflow-y: auto;`;


    const tagList = document.createElement('div');
    tagList.id = 'geizhals-tag-list';
    tagList.style.cssText = 'display: flex; flex-direction: row; gap: 0; flex: 1; min-height: 20px;';
    panel.appendChild(tagList);

    document.body.appendChild(panel);
    return panel;
  }

  function updateQuickTagsPanel(panel) {
    let selectedTags = getSelectedTags();
    const searchTerm = getSearchTerm();
    const settings = getSettings();

    if (searchTerm && settings.searchbarEnabled) {
      selectedTags = filterAndHighlightTags(selectedTags, searchTerm, settings);
    }

    const tagList = panel.querySelector('#geizhals-tag-list');
    tagList.innerHTML = '';

    const kommentarBtn = document.getElementById('geizhals-kommentar-btn');
    if (kommentarBtn) {
      const hasContent = selectedTags.filter(tag => !isSeparator(tag)).length > 0;
      kommentarBtn.disabled = !hasContent;
      kommentarBtn.style.cssText = `background: ${hasContent ? '#e8e8e8' : '#d3d3d3'};border: 1px solid ${hasContent ? '#ccc' : '#999'};cursor: ${hasContent ? 'pointer' : 'not-allowed'};font-size: 11px;padding: 2px 4px;color: ${hasContent ? '#333' : '#999'};font-weight: 500;border-radius: 3px;transition: all 0.2s;height: 22px;line-height: 1;display: inline-flex;align-items: center;flex-shrink: 0;`;
    }

    if (selectedTags.length === 0 && getSelectedTags().filter(tag => !isSeparator(tag)).length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'font-size: 11px; color: #999; padding: 8px;';
      empty.textContent = 'noch keine Einträge';

      tagList.appendChild(empty);
      return;
    }

    const columns = [];
    let currentColumn = [];

    selectedTags.forEach(tagName => {
      if (isSeparator(tagName)) {
        if (currentColumn.length > 0) {
          columns.push(currentColumn);
          currentColumn = [];
        }
      } else {
        currentColumn.push(tagName);
      }
    });

    if (currentColumn.length > 0) {
      columns.push(currentColumn);
    }

    panel.style.width = 'auto';

    columns.forEach((columnTags, columnIndex) => {
      const maxNameWidth = calculateMaxTagNameWidth(columnTags);

      const columnDiv = document.createElement('div');
      columnDiv.className = 'geizhals-tag-column';

      if (columnIndex === 0 && isHotkeyModeEnabled()) {
        const baseWidth = maxNameWidth + 100;
        const enlargedWidth = Math.ceil(baseWidth * 1.2);
        columnDiv.style.minWidth = enlargedWidth + 'px';

        // Hotkey-Zone als erstes Element
        const hotkeyZone = document.createElement('div');
        hotkeyZone.id = 'geizhals-hotkey-zone';
        hotkeyZone.className = 'geizhals-hotkey-zone';
        hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';

        hotkeyZone.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (hotkeyZoneActive) {
            // Zurück zum Ausgangszustand
            hotkeyZoneActive = false;
            hotkeyZone.className = 'geizhals-hotkey-zone';
            hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
          } else {
            // Aktivieren
            hotkeyZoneActive = true;
            hotkeyZone.className = 'geizhals-hotkey-zone waiting';
            hotkeyZone.textContent = 'Warte auf Eingabe…';
          }
        };

        columnDiv.appendChild(hotkeyZone);
      }

      columnTags.forEach(tagName => {
        const tagInfo = TAG_MAP[tagName];
        if (!tagInfo) {
          return;
        }

        const entry = document.createElement('div');
        entry.style.cssText = `display: flex;align-items: center;gap: 6px;padding: 6px;background: #f9f9f9;border: 1px solid #eee;border-radius: 3px;font-size: 11px;`;

        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = `font-weight: bold;min-width: ${maxNameWidth}px;flex-shrink: 0;`;

        if (searchTerm && settings.searchbarEnabled) {
          nameSpan.innerHTML = highlightText(tagName, searchTerm, settings.highlightingColor);
        } else {
          nameSpan.textContent = tagName;
        }

        entry.appendChild(nameSpan);

        let priorities;
        if (tagInfo.available.includes('ohne') && tagInfo.available.length === 1) {
          priorities = ['ohne'];
        } else if (tagInfo.available.includes('ohne')) {
          priorities = ['ohne', '@1', '@2', '@3'].filter(p => tagInfo.available.includes(p));
        } else {
          priorities = ['@1', '@2', '@3'].filter(p => tagInfo.available.includes(p));
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `display: grid;grid-template-columns: repeat(3, 1fr);gap: 4px;`;

        const slotToGridColumn = {
          'ohne': 1,
          '@1': 1,
          '@2': 2,
          '@3': 3
        };

        priorities.forEach(priority => {
          const btn = document.createElement('button');
          btn.className = 'geizhals-tag-button';
          btn.type = 'button';
          btn.style.cssText = `padding: 3px 6px;border: 1px solid #ccc;background: white;border-radius: 2px;font-size: 12px;font-weight: bold;cursor: pointer;transition: all 0.15s;flex-shrink: 0;grid-column: ${slotToGridColumn[priority]};`;
          btn.textContent = priority;

          btn.onmouseover = () => {
            btn.style.background = '#e8f4f8';
            btn.style.borderColor = '#0066cc';
          };
          btn.onmouseout = () => {
            btn.style.background = 'white';
            btn.style.borderColor = '#ccc';
          };
          btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const storedInput = document.querySelector('[id^="react-select-"][id$="-input"]');
            selectTag(tagName, priority, storedInput);
          };

          buttonContainer.appendChild(btn);
        });

        entry.appendChild(buttonContainer);
        columnDiv.appendChild(entry);
      });

      tagList.appendChild(columnDiv);
    });
  }

  // ==================== TAG HISTORY ====================

  function getTagHistory() {
    const stored = localStorage.getItem(TAG_HISTORY_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  function saveTagHistory(history) {
    localStorage.setItem(TAG_HISTORY_KEY, JSON.stringify(history));
  }

  function trackTagUsage(tagName, priority) {
    const history = getTagHistory();
    const key = `${tagName} ${priority}`;

    // Zähle nur aktivierte Row-Checkboxen im tbody
    const checkedCount = document.querySelectorAll('tbody tr.ft__body__row input.form-check-input:checked').length;
    const count = checkedCount > 0 ? checkedCount : 1;

    history[key] = (history[key] || 0) + count;
    saveTagHistory(history);
  }

  function openTagHistoryOverlay() {
    // Prüfe ob Overlay bereits existiert
    if (document.getElementById('geizhals-tag-history-overlay')) return;

    const history = getTagHistory();
    const entries = Object.entries(history).sort((a, b) => b[1] - a[1]);

    // Overlay erstellen
    const overlay = document.createElement('div');
    overlay.id = 'geizhals-tag-history-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // Dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      min-width: 350px;
      max-width: 500px;
      max-height: 70vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    `;

    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0; font-size: 16px;';
    title.textContent = 'Tag-History';

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      padding: 0;
      line-height: 1;
    `;
    closeBtn.textContent = '×';
    closeBtn.onclick = () => overlay.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.style.cssText = `
      overflow-y: auto;
      flex: 1;
    `;

    if (entries.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.cssText = 'color: #666; text-align: center; margin: 20px 0;';
      emptyMsg.textContent = 'Noch keine Tags verwendet.';
      content.appendChild(emptyMsg);
    } else {
      const table = document.createElement('table');
      table.style.cssText = 'width: 100%; border-collapse: collapse;';

      // Table Header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr style="background: #f5f5f5;">
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">#</th>
          <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Tag</th>
          <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Anzahl</th>
        </tr>
      `;
      table.appendChild(thead);

      // Table Body
      const tbody = document.createElement('tbody');
      entries.forEach(([tag, count], index) => {
        const tr = document.createElement('tr');
        tr.style.cssText = index % 2 === 0 ? 'background: #fff;' : 'background: #f9f9f9;';
        tr.innerHTML = `
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #999;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${tag}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${count}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      content.appendChild(table);
    }

    dialog.appendChild(content);

    // Footer mit Reset-Button
    const footer = document.createElement('div');
    footer.style.cssText = `
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    `;

    const totalCount = entries.reduce((sum, [, count]) => sum + count, 0);
    const totalLabel = document.createElement('span');
    totalLabel.style.cssText = 'color: #666; font-size: 12px; align-self: center;';
    totalLabel.textContent = `Gesamt: ${totalCount} Tags`;

    const resetBtn = document.createElement('button');
    resetBtn.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    resetBtn.textContent = 'History löschen';
    resetBtn.onclick = () => {
      if (confirm('Tag-History wirklich löschen?')) {
        localStorage.removeItem(TAG_HISTORY_KEY);
        overlay.remove();
      }
    };

    footer.appendChild(totalLabel);
    footer.appendChild(resetBtn);
    dialog.appendChild(footer);

    overlay.appendChild(dialog);

    // Schließen bei Klick außerhalb
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    // Schließen mit Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(overlay);
  }

  function selectTag(tagName, priority, storedInput) {
    if (!validateAGRDropdown(tagName)) {
      return;
    }

    const tagInfo = TAG_MAP[tagName];
    if (!tagInfo || !tagInfo.available.includes(priority)) return;

    // Tag-History tracken
    trackTagUsage(tagName, priority);

    const input = storedInput || document.querySelector('[id^="react-select-"][id$="-input"]');
    if (!input) {
      try { console.error('selectTag: Input field not found!'); } catch (e) {}
      return;
    }

    if (priority === 'ohne') {
      input.focus();

      setTimeout(() => {
        input.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          code: 'ArrowDown',
          keyCode: 40,
          bubbles: true
        }));

        setTimeout(() => {
          const allOptions = Array.from(document.querySelectorAll('[role="option"]'));
          let targetOption = null;
          for (let i = 0; i < allOptions.length; i++) {
            const option = allOptions[i];
            const optionText = option.textContent.trim();

            if (optionText === tagName) {
              targetOption = option;
              break;
            }
          }

          if (targetOption) {
            targetOption.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            targetOption.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            targetOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            targetOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                        highlightTagButton(tagName, priority);

            if (!isCommentMode) {
              setTimeout(() => {
                input.dispatchEvent(new KeyboardEvent('keydown', {
                  key: 'Enter',
                  code: 'Enter',
                  keyCode: 13,
                  bubbles: true
                }));
              }, 100);
            }

			setTimeout(() => {
			  const panel = document.getElementById('geizhals-quick-tags');
			  closePanel(panel);
			}, 200);
          }
        }, 150);
      }, 50);

      return;
    }

    if (tagName === 'fixme') {
      const kommentarBtn = document.getElementById('geizhals-kommentar-btn');
      if (kommentarBtn && !isCommentMode) {
        toggleCommentMode(kommentarBtn);
      }
    }

    if (isCommentMode) {
      input.focus();
      setTimeout(() => {
        const arrowDownEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          code: 'ArrowDown',
          keyCode: 40,
          bubbles: true,
          cancelable: true
        });
        input.dispatchEvent(arrowDownEvent);

        setTimeout(() => {
          const allOptions = Array.from(document.querySelectorAll('[role="option"]'));
          let categoryOption = null;
          let categoryIndex = -1;

          for (let i = 0; i < allOptions.length; i++) {
            const option = allOptions[i];
            if (option.getAttribute('aria-disabled') === 'true' && option.textContent.trim() === tagName) {
              categoryOption = option;
              categoryIndex = i;
              break;
            }
          }

          if (!categoryOption) {
            return;
          }

          let targetOption = null;
          const priorityText = priority;

          for (let i = categoryIndex + 1; i < allOptions.length; i++) {
            const option = allOptions[i];
            if (option.getAttribute('aria-disabled') === 'true') break;

            if (option.textContent.trim().includes(priorityText)) {
              targetOption = option;
              break;
            }
          }

          if (!targetOption) {
            return;
          }

          targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          targetOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          targetOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                      highlightTagButton(tagName, priority);

        }, 200);
      }, 100);

      const kommentarBtn = document.getElementById('geizhals-kommentar-btn');
      if (kommentarBtn) {
        exitCommentMode(kommentarBtn);
      }

	  const panel = document.getElementById('geizhals-quick-tags');
	  closePanel(panel);
      return;
    }

    input.focus();
    setTimeout(() => {
      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(arrowDownEvent);

      setTimeout(() => {
        const allOptions = Array.from(document.querySelectorAll('[role="option"]'));
        let categoryOption = null;
        let categoryIndex = -1;

        for (let i = 0; i < allOptions.length; i++) {
          const option = allOptions[i];
          if (option.getAttribute('aria-disabled') === 'true' && option.textContent.trim() === tagName) {
            categoryOption = option;
            categoryIndex = i;
            break;
          }
        }

        if (!categoryOption) return;

        let targetOption = null;
        const priorityText = priority;

        for (let i = categoryIndex + 1; i < allOptions.length; i++) {
          const option = allOptions[i];
          if (option.getAttribute('aria-disabled') === 'true') break;

          if (option.textContent.trim().includes(priorityText)) {
            targetOption = option;
            break;
          }
        }

        if (!targetOption) return;

        targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        targetOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        targetOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    highlightTagButton(tagName, priority);

        setTimeout(() => {
          input.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true,
            cancelable: true
          }));

		  setTimeout(() => {
		    const panel = document.getElementById('geizhals-quick-tags');
		    closePanel(panel);
		  }, 100);
        }, 150);
      }, 200);
    }, 100);
  }

  function positionPanel(input) {
    const panel = document.getElementById('geizhals-quick-tags');
    if (!panel || !input) return;

    const rect = input.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;

    const topPosition = Math.max(10, rect.top - panelHeight - 10);
    const leftPosition = rect.left - 220;

    panel.style.top = topPosition + 'px';
    panel.style.left = leftPosition + 'px';
  }

  // ==================== AUTO-LAYOUT FUNCTIONS ====================

  function countRegularTags(tags) {
    return tags.filter(tag => !isSeparator(tag)).length;
  }

  function calculateColumnDistribution(itemCount, columnCount) {
    if (columnCount < 1 || columnCount > 8) return null;
    if (itemCount < columnCount * 3) return null;

    const basePer = Math.floor(itemCount / columnCount);
    const remainder = itemCount % columnCount;

    const distribution = [];
    for (let col = 0; col < columnCount; col++) {
      if (col < remainder) {
        distribution.push(basePer + 1);
      } else {
        distribution.push(basePer);
      }
    }

    return distribution;
  }

  function getDistributionPreview(itemCount, columnCount) {
    const dist = calculateColumnDistribution(itemCount, columnCount);
    return dist ? dist.join('/') : null;
  }

  function getValidColumnCounts(itemCount) {
    const valid = [];
    for (let n = 2; n <= 8; n++) {
      if (itemCount >= n * 3) {
        valid.push(n);
      }
    }
    return valid;
  }

  function updateColumnsDropdown(regularCount) {
    const dropdown = document.getElementById('geizhals-columns-dropdown');
    if (!dropdown) return;

    // Only keep the value if it was explicitly set by a change event
    let currentValue = '';
    if (window.__geizhalsSelectedColumnValue) {
      currentValue = window.__geizhalsSelectedColumnValue;
      delete window.__geizhalsSelectedColumnValue;
    }

    const validCounts = getValidColumnCounts(regularCount);

    dropdown.innerHTML = '';

    // If no items, disable dropdown and show placeholder
    if (regularCount === 0) {
      dropdown.disabled = true;
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '-- Wählen --';
      dropdown.appendChild(emptyOption);
      dropdown.value = '';
      return;
    }

    if (validCounts.length === 0) {
      dropdown.disabled = true;
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '-- Zu wenig Einträge --';
      dropdown.appendChild(emptyOption);
      return;
    }

    dropdown.disabled = false;

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Wählen --';
    dropdown.appendChild(emptyOption);

    // Add "1" option to remove all separators with item count
    const option1 = document.createElement('option');
    option1.value = '1';
    option1.textContent = `1 (${regularCount})`;
    dropdown.appendChild(option1);

    // Add valid column options with distribution preview
    validCounts.forEach(col => {
      const preview = getDistributionPreview(regularCount, col);
      const option = document.createElement('option');
      option.value = col.toString();
      option.textContent = `${col} (${preview})`;
      dropdown.appendChild(option);
    });

    // Only restore value if it was explicitly set from a change event
    if (currentValue && validCounts.includes(parseInt(currentValue))) {
      dropdown.value = currentValue;
    } else {
      dropdown.value = '';
    }
  }

  function insertSeparatorsForColumns(tags, columnCount) {
    const cleanedTags = tags.filter(tag => !isSeparator(tag));

    const regularCount = cleanedTags.length;
    if (columnCount === 1) return cleanedTags;
    if (regularCount < 4 || columnCount < 2) return cleanedTags;

    const distribution = calculateColumnDistribution(regularCount, columnCount);
    if (!distribution) return cleanedTags;

    const newTags = [];
    let currentPos = 0;

    for (let col = 0; col < columnCount; col++) {
      const entriesInThisColumn = distribution[col];

      for (let i = 0; i < entriesInThisColumn; i++) {
        if (currentPos < cleanedTags.length) {
          newTags.push(cleanedTags[currentPos]);
          currentPos++;
        }
      }

      if (col < columnCount - 1) {
        newTags.push(SEPARATOR_MARKER);
      }
    }

    return newTags;
  }

  // ==================== ENTRIES DIALOG ====================

  function createEntriesDialog() {
    let overlay = document.getElementById('geizhals-entries-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'geizhals-entries-overlay';
    overlay.onmousedown = () => {
      const selectedTags = getSelectedTags();
      const cleaned = validateAndCleanSeparators(selectedTags);
      saveSelectedTags(cleaned);
      overlay.style.display = 'none';
    };

    const dialog = document.createElement('div');
    dialog.id = 'geizhals-entries-dialog';
    dialog.onmousedown = (e) => e.stopPropagation();

    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `display: flex;justify-content: space-between;align-items: center;margin-bottom: 12px;`;

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; font-size: 14px;';
    title.textContent = 'Tag-Verwaltung';
    titleContainer.appendChild(title);

    const toggleContainer = document.createElement('div');
    toggleContainer.style.cssText = 'display: flex; align-items: center; gap: 12px;';

    // Tag-History Button
    const historyBtn = document.createElement('button');
    historyBtn.style.cssText = `
      background: #6c757d;
      color: white;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
    `;
    historyBtn.textContent = 'Tag-History';
    historyBtn.onmouseover = () => historyBtn.style.background = '#5a6268';
    historyBtn.onmouseout = () => historyBtn.style.background = '#6c757d';
    historyBtn.onclick = () => openTagHistoryOverlay();
    toggleContainer.appendChild(historyBtn);

    // IDs anzeigen Toggle
    const idsToggleWrapper = document.createElement('div');
    idsToggleWrapper.style.cssText = 'display: flex; align-items: center; gap: 6px;';

    const toggleLabel = document.createElement('label');
    toggleLabel.style.cssText = 'font-size: 12px; cursor: pointer; user-select: none;';
    toggleLabel.textContent = 'IDs anzeigen';

    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'geizhals-show-ids-toggle';
    toggleCheckbox.style.cssText = 'cursor: pointer; width: 18px; height: 18px;';
    toggleCheckbox.checked = localStorage.getItem('geizhals_show_ids') === 'true';
    toggleCheckbox.onchange = () => {
      localStorage.setItem('geizhals_show_ids', toggleCheckbox.checked);
      updateEntriesDialog();
    };

    idsToggleWrapper.appendChild(toggleLabel);
    idsToggleWrapper.appendChild(toggleCheckbox);
    toggleContainer.appendChild(idsToggleWrapper);
    titleContainer.appendChild(toggleContainer);

    dialog.appendChild(titleContainer);

    const grid = document.createElement('div');
    grid.className = 'geizhals-entries-grid';

    const categories = ['Auswahl', 'AGR-CE', 'AGR-HH', 'AGR-HW', 'AGR-SPSWG', 'Global'];

    categories.forEach(category => {
      const column = document.createElement('div');
      column.className = 'geizhals-entries-column';
      column.id = `geizhals-column-${category}`;

      const headerContainer = document.createElement('div');
      headerContainer.style.cssText = `padding: 8px;background: #e8e8e8;border-bottom: 1px solid #ddd;position: sticky;top: 0;`;

      const headerInner = document.createElement('div');
      headerInner.style.cssText = `display: flex;flex-direction: column;align-items: center;gap: 4px;`;

      const headerText = document.createElement('div');
      headerText.style.cssText = 'font-weight: bold; font-size: 12px; text-align: center;';
      headerText.textContent = category;

      const headerAction = document.createElement('div');
      headerAction.id = `geizhals-header-action-${category}`;
      headerAction.style.cssText = `font-size: 11px;cursor: pointer;padding: 2px 4px;user-select: none;text-align: center;width: 100%;`;

      headerInner.appendChild(headerText);
      headerInner.appendChild(headerAction);
      headerContainer.appendChild(headerInner);
      column.appendChild(headerContainer);

      const content = document.createElement('div');
      content.className = 'geizhals-entries-column-content';
      column.appendChild(content);

      grid.appendChild(column);
    });

    dialog.appendChild(grid);

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display: flex; gap: 8px;';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.style.cssText = `flex: 1;padding: 8px;background: #ddd;color: #333;border: none;border-radius: 3px;font-size: 12px;cursor: pointer;`;
    closeBtn.textContent = 'Schließen';
    closeBtn.onclick = () => {
      const selectedTags = getSelectedTags();
      const cleaned = validateAndCleanSeparators(selectedTags);
      saveSelectedTags(cleaned);
      overlay.style.display = 'none';
    };

    btnContainer.appendChild(closeBtn);
    dialog.appendChild(btnContainer);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    return overlay;
  }

  function createSettingsDialog() {
    let overlay = document.getElementById('geizhals-settings-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'geizhals-settings-overlay';
    overlay.style.cssText = `position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.3);display: none;z-index: 10000;`;
    overlay.onmousedown = () => overlay.style.display = 'none';

    const dialog = document.createElement('div');
    dialog.id = 'geizhals-settings-dialog';
    dialog.style.cssText = `position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: white;border: 1px solid #ddd;border-radius: 6px;padding: 16px;z-index: 10001;min-width: 320px;box-shadow: 0 4px 12px rgba(0,0,0,0.2);font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;max-height: 80vh;overflow-y: auto;`;
    dialog.onmousedown = (e) => e.stopPropagation();

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; font-size: 14px; margin-bottom: 12px; color: #333;';
    title.textContent = 'Einstellungen';
    dialog.appendChild(title);

    // Tag-Verwaltung Link
    const tagManagementLink = document.createElement('a');
    tagManagementLink.className = 'geizhals-tag-management-link';
    tagManagementLink.textContent = '🏷️ Tag-Verwaltung';
    tagManagementLink.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      overlay.style.display = 'none';
      openEntriesDialog();
    };
    dialog.appendChild(tagManagementLink);

    const hotkeyGroup = document.createElement('div');
    hotkeyGroup.style.cssText = 'margin-bottom: 12px;';

    const hotkeyLabel = document.createElement('label');
    hotkeyLabel.style.cssText = 'display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px; color: #333;';
    hotkeyLabel.textContent = 'Panel-Hotkey:';

    const hotkeySelect = document.createElement('select');
    hotkeySelect.id = 'geizhals-hotkey-modifier';
    hotkeySelect.style.cssText = `width: 100%;padding: 6px;border: 1px solid #ddd;border-radius: 3px;font-size: 12px;box-sizing: border-box;background: white;cursor: pointer;`;

    const optionMmbOrAlt = document.createElement('option');
    optionMmbOrAlt.value = 'mmb-or-alt';
    optionMmbOrAlt.textContent = 'Mausradklick oder Alt';

    const optionMmb = document.createElement('option');
    optionMmb.value = 'mmb';
    optionMmb.textContent = 'Mausradklick';

    const optionAlt = document.createElement('option');
    optionAlt.value = 'alt';
    optionAlt.textContent = 'Alt';

    hotkeySelect.appendChild(optionMmbOrAlt);
    hotkeySelect.appendChild(optionMmb);
    hotkeySelect.appendChild(optionAlt);
    hotkeySelect.value = 'mmb-or-alt';

    hotkeyGroup.appendChild(hotkeyLabel);
    hotkeyGroup.appendChild(hotkeySelect);
    dialog.appendChild(hotkeyGroup);

    // Überschrift AGR
    const agrSectionTitle = document.createElement('div');
    agrSectionTitle.style.cssText = 'display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px; color: #333; margin-top: 12px;';
    agrSectionTitle.textContent = 'AGR:';
    dialog.appendChild(agrSectionTitle);

    // AGR-Dropdown fixieren
    const agrFixGroup = document.createElement('div');
    agrFixGroup.style.cssText = 'margin-bottom: 12px;';

    const agrFixLabel = document.createElement('label');
    agrFixLabel.id = 'geizhals-fix-agr-dropdown-label';
    agrFixLabel.style.cssText = 'display: block; font-size: 12px; margin-bottom: 4px; color: #333;';
    agrFixLabel.textContent = 'AGR-Dropdown fixieren:';

    const agrFixSelect = document.createElement('select');
    agrFixSelect.id = 'geizhals-fix-agr-dropdown-value';
    agrFixSelect.style.cssText = 'width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px; background: white; cursor: pointer;';

    const agrFixOptions = [
      { value: '', text: '(keine Fixierung)' },
      { value: 'all', text: 'Alle AGR' },
      { value: 'AGR-HH', text: 'AGR-HH' },
      { value: 'AGR-CE', text: 'AGR-CE' },
      { value: 'AGR-SP/SWG', text: 'AGR-SP/SWG' },
      { value: 'AGR-HW', text: 'AGR-HW' }
    ];
    agrFixOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      agrFixSelect.appendChild(option);
    });

    agrFixGroup.appendChild(agrFixLabel);
    agrFixGroup.appendChild(agrFixSelect);
    dialog.appendChild(agrFixGroup);

    // AGR-Auswahl für den Erledigt-Button
    const agrButtonGroup = document.createElement('div');
    agrButtonGroup.id = 'geizhals-agr-button-group';
    agrButtonGroup.style.cssText = 'margin-bottom: 12px;';

    const agrButtonLabel = document.createElement('label');
    agrButtonLabel.id = 'geizhals-agr-button-label';
    agrButtonLabel.style.cssText = 'display: block; font-size: 12px; margin-bottom: 4px; color: #333;';
    agrButtonLabel.textContent = 'AGR-Auswahl für den Erledigt-Button:';

    const agrButtonSelect = document.createElement('select');
    agrButtonSelect.id = 'geizhals-agr-button-override';
    agrButtonSelect.style.cssText = 'width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px; background: white; cursor: pointer;';

    const agrButtonOptions = [
      { value: '', text: '(keine Auswahl)' },
      { value: 'AGR-HH', text: 'AGR-HH' },
      { value: 'AGR-CE', text: 'AGR-CE' },
      { value: 'AGR-SP/SWG', text: 'AGR-SP/SWG' },
      { value: 'AGR-HW', text: 'AGR-HW' }
    ];
    agrButtonOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      agrButtonSelect.appendChild(option);
    });

    agrButtonGroup.appendChild(agrButtonLabel);
    agrButtonGroup.appendChild(agrButtonSelect);
    dialog.appendChild(agrButtonGroup);

    // Funktion zum Aktualisieren beider Dropdown-Status
    function updateAgrButtonSelectState() {
      const isAlleAGR = agrFixSelect.value === 'all';
      const hasButtonOverride = agrButtonSelect.value !== '';

      // agrButtonSelect: nur aktiv wenn "Alle AGR" ausgewählt und agrFixSelect nicht gesperrt
      agrButtonSelect.disabled = !isAlleAGR;
      agrButtonLabel.style.color = isAlleAGR ? '#333' : '#999';
      agrButtonSelect.style.opacity = isAlleAGR ? '1' : '0.5';
      agrButtonSelect.style.cursor = isAlleAGR ? 'pointer' : 'not-allowed';

      // agrFixSelect: gesperrt wenn ein Wert im agrButtonSelect ausgewählt ist
      agrFixSelect.disabled = hasButtonOverride;
      agrFixLabel.style.color = hasButtonOverride ? '#999' : '#333';
      agrFixSelect.style.opacity = hasButtonOverride ? '0.5' : '1';
      agrFixSelect.style.cursor = hasButtonOverride ? 'not-allowed' : 'pointer';
    }

    agrFixSelect.onchange = () => {
      try {
        const newValue = agrFixSelect.value;
        const settings = getSettings();
        settings.fixAGRDropdownValue = newValue;

        // IMMER agrButtonOverride zurücksetzen wenn AGR-Dropdown fixieren geändert wird
        settings.agrButtonOverride = '';
        agrButtonSelect.value = '';

        saveSettings(settings);
        updateAgrButtonSelectState();

        // ZUERST erledigtButtonObserver stoppen um DOM-Konflikte zu vermeiden
        if (erledigtButtonObserver) {
          erledigtButtonObserver.disconnect();
          erledigtButtonObserver = null;
        }

        // Natives AGR-Dropdown sofort aktualisieren
        const nativeAgrDropdown = document.querySelector('select[aria-label="AGR"]');
        if (nativeAgrDropdown) {
          // Bestehende Listener entfernen
          if (agrDropdownChangeListener) {
            nativeAgrDropdown.removeEventListener('change', agrDropdownChangeListener);
            agrDropdownChangeListener = null;
          }
          if (agrDropdownObserver) {
            agrDropdownObserver.disconnect();
            agrDropdownObserver = null;
          }

          // Dann Wert setzen wenn ein fixierter Wert gewählt wurde
          if (newValue) {
            nativeAgrDropdown.value = newValue;
            // dispatchEvent verzögert ausführen um React-Konflikte zu vermeiden
            setTimeout(() => {
              try {
                nativeAgrDropdown.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (e) {
                // Fehler ignorieren
              }
              // Monitoring nach dem Event neu starten
              monitorAGRDropdown();
              updateErledigtButton();
            }, 0);
            return; // Rest wird im setTimeout ausgeführt
          }
        }

        // Jetzt Monitoring neu starten (nur wenn kein setTimeout)
        monitorAGRDropdown();
        updateErledigtButton();
      } catch (e) {
        // Fehler ignorieren
      }
    };

    agrButtonSelect.onchange = () => {
      try {
        const settings = getSettings();
        settings.agrButtonOverride = agrButtonSelect.value;
        saveSettings(settings);
        updateAgrButtonSelectState(); // agrFixSelect deaktivieren/aktivieren
        updateErledigtButton();
      } catch (e) {
        // Fehler ignorieren
      }
    };

    // Überschrift Sonstiges
    const miscSectionTitle = document.createElement('div');
    miscSectionTitle.style.cssText = 'display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px; color: #333; margin-top: 12px;';
    miscSectionTitle.textContent = 'Sonstiges:';
    dialog.appendChild(miscSectionTitle);

    // PAGE SIZE DROPDOWN
    const pageSizeGroup = document.createElement('div');
    pageSizeGroup.style.cssText = 'display: flex; align-items: center; gap: 8px;';

    const pageSizeLabel = document.createElement('label');
    pageSizeLabel.style.cssText = 'font-size: 12px; cursor: pointer; color: #333; user-select: none;';
    pageSizeLabel.textContent = 'Seitengröße Standard:';

    const pageSizeSelect = document.createElement('select');
    pageSizeSelect.id = 'geizhals-page-size';
    pageSizeSelect.style.cssText = 'padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px; background: white; cursor: pointer;';

    const pageSizeOptions = [25, 50, 100, 250, 500, 1000, 2000];
    pageSizeOptions.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      pageSizeSelect.appendChild(option);
    });

    pageSizeSelect.onchange = function() {
      const currentSettings = getSettings();
      currentSettings.pageSize = parseInt(this.value);
      saveSettings(currentSettings);
    };

    pageSizeGroup.appendChild(pageSizeLabel);
    pageSizeGroup.appendChild(pageSizeSelect);
    dialog.appendChild(pageSizeGroup);

    // Highlight-Farbe (Suchleiste)
    const colorPickerGroup = document.createElement('div');
    colorPickerGroup.className = 'geizhals-color-picker-group';
    colorPickerGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 8px;';

    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'geizhals-highlighting-color';
    colorLabel.style.cssText = 'font-size: 12px; color: #333;';
    colorLabel.textContent = 'Highlight-Farbe (Suchleiste):';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'geizhals-highlighting-color';
    colorPicker.style.cssText = 'width: 40px; height: 28px; border: 1px solid #ddd; border-radius: 3px; cursor: pointer;';
    colorPicker.value = '#EF0FFF';

    colorPickerGroup.appendChild(colorLabel);
    colorPickerGroup.appendChild(colorPicker);
    dialog.appendChild(colorPickerGroup);

    // Export/Import Section
    const exportImportSection = document.createElement('div');
    exportImportSection.style.cssText = 'margin-top: 16px; padding-top: 12px; border-top: 1px solid #ddd;';

    const exportImportTitle = document.createElement('div');
    exportImportTitle.style.cssText = 'font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #333;';
    exportImportTitle.textContent = 'Sicherung & Wiederherstellung';
    exportImportSection.appendChild(exportImportTitle);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 6px;';

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.style.cssText = `flex: 1;padding: 8px;background: #4CAF50;color: white;border: none;border-radius: 3px;font-size: 12px;cursor: pointer;transition: background 0.2s;font-weight: 500;`;
    exportBtn.textContent = '💾 Export';
    exportBtn.onmouseover = () => exportBtn.style.background = '#45a049';
    exportBtn.onmouseout = () => exportBtn.style.background = '#4CAF50';
    exportBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      exportSettings();
    };

    const importBtn = document.createElement('button');
    importBtn.type = 'button';
    importBtn.style.cssText = `flex: 1;padding: 8px;background: #2196F3;color: white;border: none;border-radius: 3px;font-size: 12px;cursor: pointer;transition: background 0.2s;font-weight: 500;`;
    importBtn.textContent = '📂 Import';
    importBtn.onmouseover = () => importBtn.style.background = '#0b7dda';
    importBtn.onmouseout = () => importBtn.style.background = '#2196F3';
    importBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImportDialog();
    };

    buttonContainer.appendChild(exportBtn);
    buttonContainer.appendChild(importBtn);
    exportImportSection.appendChild(buttonContainer);

    dialog.appendChild(exportImportSection);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.style.cssText = `width: 100%;padding: 8px;background: #ddd;color: #333;border: none;border-radius: 3px;font-size: 12px;cursor: pointer;transition: background 0.2s;margin-top: 12px;`;
    closeBtn.textContent = 'Schließen';
    closeBtn.onmouseover = () => closeBtn.style.background = '#ccc';
    closeBtn.onmouseout = () => closeBtn.style.background = '#ddd';
    closeBtn.onclick = () => overlay.style.display = 'none';

    dialog.appendChild(closeBtn);

    hotkeySelect.onchange = () => {
      const settings = getSettings();
      settings.hotkeyModifier = hotkeySelect.value;
      saveSettings(settings);
    };

    colorPicker.onchange = function() {
      const settings = getSettings();
      settings.highlightingColor = this.value;
      saveSettings(settings);

      const panel = document.getElementById('geizhals-quick-tags');
      if (panel) {
        updateQuickTagsPanel(panel);
      }
    };

    // Initial state für agrButtonSelect setzen
    updateAgrButtonSelectState();

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    return overlay;
  }

  function openEntriesDialog() {
    const overlay = createEntriesDialog();
    overlay.style.display = 'block';

	const panel = document.getElementById('geizhals-quick-tags');
	closePanel(panel);

    if (isHotkeyModeEnabled()) {
      document.body.classList.add('geizhals-hotkey-mode-active');
    } else {
      document.body.classList.remove('geizhals-hotkey-mode-active');
    }

    updateEntriesDialog();
  }

  function openSettingsDialog() {
    const overlay = createSettingsDialog();

    const settings = getSettings();
    const hotkeySelect = document.getElementById('geizhals-hotkey-modifier');
    const agrFixSelect = document.getElementById('geizhals-fix-agr-dropdown-value');
    const agrFixLabel = document.getElementById('geizhals-fix-agr-dropdown-label');
    const agrButtonSelect = document.getElementById('geizhals-agr-button-override');
    const agrButtonLabel = document.getElementById('geizhals-agr-button-label');
    const colorPicker = document.getElementById('geizhals-highlighting-color');
    const pageSizeSelect = document.getElementById('geizhals-page-size');

    if (hotkeySelect) hotkeySelect.value = settings.hotkeyModifier;
    if (agrFixSelect) agrFixSelect.value = settings.fixAGRDropdownValue || '';
    if (agrButtonSelect) agrButtonSelect.value = settings.agrButtonOverride || '';
    if (colorPicker) colorPicker.value = settings.highlightingColor;
    if (pageSizeSelect) pageSizeSelect.value = settings.pageSize || 100;

    // Beide AGR-Dropdowns Status aktualisieren
    if (agrFixSelect && agrButtonSelect && agrButtonLabel && agrFixLabel) {
      const isAlleAGR = agrFixSelect.value === 'all';
      const hasButtonOverride = agrButtonSelect.value !== '';

      // agrButtonSelect: nur aktiv wenn "Alle AGR" ausgewählt
      agrButtonSelect.disabled = !isAlleAGR;
      agrButtonLabel.style.color = isAlleAGR ? '#333' : '#999';
      agrButtonSelect.style.opacity = isAlleAGR ? '1' : '0.5';
      agrButtonSelect.style.cursor = isAlleAGR ? 'pointer' : 'not-allowed';

      // agrFixSelect: gesperrt wenn ein Wert im agrButtonSelect ausgewählt ist
      agrFixSelect.disabled = hasButtonOverride;
      agrFixLabel.style.color = hasButtonOverride ? '#999' : '#333';
      agrFixSelect.style.opacity = hasButtonOverride ? '0.5' : '1';
      agrFixSelect.style.cursor = hasButtonOverride ? 'not-allowed' : 'pointer';
    }

    overlay.style.display = 'block';

	const panel = document.getElementById('geizhals-quick-tags');
	closePanel(panel);
  }

  function updateEntriesDialog() {
    const selectedTags = getSelectedTags();
    const showIds = localStorage.getItem('geizhals_show_ids') === 'true';

    ['Auswahl', 'AGR-CE', 'AGR-HH', 'AGR-HW', 'AGR-SPSWG', 'Global'].forEach(category => {
      const content = document.querySelector(`#geizhals-column-${category} .geizhals-entries-column-content`);
      if (content) content.innerHTML = '';
    });

    const regularCount = selectedTags.filter(tag => !isSeparator(tag)).length;

    const categories = ['Auswahl', 'AGR-CE', 'AGR-HH', 'AGR-HW', 'AGR-SPSWG', 'Global'];
    categories.forEach(category => {
      const actionDiv = document.getElementById(`geizhals-header-action-${category}`);
      if (!actionDiv) return;
      actionDiv.innerHTML = '';

      if (category === 'Auswahl') {
        const addSepBtn = document.createElement('button');
        addSepBtn.id = 'geizhals-add-separator-btn';
        addSepBtn.type = 'button';
        addSepBtn.textContent = '+ Trenner hinzufügen';
        addSepBtn.disabled = regularCount === 0;
        addSepBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          selectedTags.push(SEPARATOR_MARKER);
          saveSelectedTags(selectedTags);
          updateEntriesDialog();
          updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
        };
        actionDiv.appendChild(addSepBtn);

        const autoLayoutContainer = document.createElement('div');
        autoLayoutContainer.id = 'geizhals-auto-layout-container';

        const autoLayoutTitle = document.createElement('div');
        autoLayoutTitle.className = 'geizhals-auto-layout-title';
        autoLayoutTitle.textContent = 'Auto-Layout';

        const columnsRow = document.createElement('div');
        columnsRow.className = 'geizhals-columns-row';

        const columnsLabel = document.createElement('label');
        columnsLabel.className = 'geizhals-columns-label';
        columnsLabel.textContent = 'Spalten:';

        const dropdown = document.createElement('select');
        dropdown.id = 'geizhals-columns-dropdown';

        columnsRow.appendChild(columnsLabel);
        columnsRow.appendChild(dropdown);
        autoLayoutContainer.appendChild(autoLayoutTitle);
        autoLayoutContainer.appendChild(columnsRow);
        actionDiv.appendChild(autoLayoutContainer);

        updateColumnsDropdown(regularCount);

        dropdown.addEventListener('change', function() {
          if (this.value) {
            const selectedValue = this.value;
            const columnCount = parseInt(this.value);
            const newTags = insertSeparatorsForColumns(selectedTags, columnCount);
            saveSelectedTags(newTags);
            // Store the value globally before updateEntriesDialog is called
            // (which recreates the dropdown)
            window.__geizhalsSelectedColumnValue = selectedValue;
            updateEntriesDialog();
            updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
          }
        });

        // HOTKEY-MODUS TOGGLE
        const hotkeyModeSection = document.createElement('div');
        hotkeyModeSection.id = 'geizhals-hotkey-mode-section';

        const hotkeyTitle = document.createElement('div');
        hotkeyTitle.style.cssText = 'font-size: 11px; font-weight: bold; color: #333; text-align: center;';
        hotkeyTitle.textContent = 'Hotkey-Modus';

        const toggleRow = document.createElement('div');
        toggleRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px;';

        const hotkeyCheckbox = document.createElement('input');
        hotkeyCheckbox.type = 'checkbox';
        hotkeyCheckbox.id = 'geizhals-hotkey-mode-toggle';
        hotkeyCheckbox.checked = isHotkeyModeEnabled();
        hotkeyCheckbox.style.cssText = `width: 24px;height: 16px;cursor: pointer;appearance: none;-webkit-appearance: none;background: ${hotkeyCheckbox.checked ? '#84E8BA' : '#ccc'};border: 1px solid #999;border-radius: 8px;outline: none;transition: background 0.3s;`;

        const hotkeyLabel = document.createElement('label');
        hotkeyLabel.htmlFor = 'geizhals-hotkey-mode-toggle';
        hotkeyLabel.style.cssText = 'font-size: 11px; font-weight: 500; color: #333; cursor: pointer; user-select: none;';
        hotkeyLabel.textContent = isHotkeyModeEnabled() ? 'AN' : 'AUS';

        const hotkeySubtext = document.createElement('div');
        hotkeySubtext.style.cssText = 'font-size: 11px; text-align: center; margin-top: 4px; font-weight: 400; line-height: 1.4;';
        hotkeySubtext.textContent = 'Eintrag über die Checkbox markieren und anschließend den Hotkey drücken – oder im Panel die Hotkey-Zone anklicken und dann den Hotkey ausführen.';
        const updateHotkeySubtextColor = () => {
          hotkeySubtext.style.color = isHotkeyModeEnabled() ? '#666' : '#ccc';
        };
        updateHotkeySubtextColor();

        hotkeyCheckbox.onchange = function() {
          setHotkeyModeEnabled(this.checked);
          hotkeyLabel.textContent = this.checked ? 'AN' : 'AUS';
          this.style.background = this.checked ? '#84E8BA' : '#ccc';

          if (this.checked) {
            document.body.classList.add('geizhals-hotkey-mode-active');
          } else {
            document.body.classList.remove('geizhals-hotkey-mode-active');
          }
          updateHotkeySubtextColor();

          updateEntriesDialog();
          updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
        };

        toggleRow.appendChild(hotkeyCheckbox);
        toggleRow.appendChild(hotkeyLabel);
        hotkeyModeSection.appendChild(hotkeyTitle);
        hotkeyModeSection.appendChild(toggleRow);
        hotkeyModeSection.appendChild(hotkeySubtext);
        actionDiv.appendChild(hotkeyModeSection);

        const removeAllBtn = document.createElement('span');
        removeAllBtn.textContent = '🚫 Alle entfernen';
        removeAllBtn.style.cssText = `display: block;margin-top: 6px;cursor: ${selectedTags.length > 0 ? 'pointer' : 'not-allowed'};opacity: ${selectedTags.length > 0 ? '1' : '0.4'};transition: opacity 0.2s;font-size: 11px;`;
        if (selectedTags.length > 0) {
          removeAllBtn.onmouseover = () => removeAllBtn.style.textDecoration = 'underline';
          removeAllBtn.onmouseout = () => removeAllBtn.style.textDecoration = 'none';
          removeAllBtn.onclick = () => {
            // Alle Hotkeys für alle Tags löschen
            selectedTags.forEach(tagName => {
              if (!isSeparator(tagName)) {
                deleteHotkeysForTag(tagName);
              }
            });
            saveSelectedTags([]);
            updateEntriesDialog();
            updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
          };
        }
        actionDiv.appendChild(removeAllBtn);
      } else {
        const categoryKey = category === 'Global' ? 'common' : category;
        const availableInCategory = Object.entries(TAG_MAP)
          .filter(([_, info]) => info.category === categoryKey && !selectedTags.includes(_))
          .map(([tagName, _]) => tagName);

        const addAllBtn = document.createElement('span');
        addAllBtn.textContent = '☑️ Alle übernehmen';
        addAllBtn.style.cssText = `cursor: ${availableInCategory.length > 0 ? 'pointer' : 'not-allowed'};opacity: ${availableInCategory.length > 0 ? '1' : '0.4'};transition: opacity 0.2s;font-size: 11px;`;
        if (availableInCategory.length > 0) {
          addAllBtn.onmouseover = () => addAllBtn.style.textDecoration = 'underline';
          addAllBtn.onmouseout = () => addAllBtn.style.textDecoration = 'none';
          addAllBtn.onclick = () => {
            availableInCategory.forEach(tagName => {
              if (!selectedTags.includes(tagName)) {
                selectedTags.push(tagName);
              }
            });
            saveSelectedTags(selectedTags);
            updateEntriesDialog();
            updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
          };
        }
        actionDiv.appendChild(addAllBtn);
      }
    });

    const auswahl = document.querySelector('#geizhals-column-Auswahl .geizhals-entries-column-content');
    const auswahlHeader = document.querySelector('#geizhals-column-Auswahl > div:first-child');
    auswahl.style.background = '#E7F1FF';
    if (auswahlHeader) {
      auswahlHeader.style.background = '#0D6EFD';
      auswahlHeader.style.color = 'white';
    }

    selectedTags.forEach((tagName, index) => {
      if (isSeparator(tagName)) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'geizhals-separator-item';

        const label = document.createElement('span');
        label.className = 'geizhals-separator-label';
        label.textContent = '—— Trenner ——';
        itemContainer.appendChild(label);

        const sepControlsContainer = document.createElement('div');
        sepControlsContainer.style.cssText = `display: flex;gap: 4px;margin-left: auto;`;

        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.style.cssText = `background: none;border: none;cursor: ${index > 0 ? 'pointer' : 'not-allowed'};font-size: 12px;padding: 2px 4px;color: ${index > 0 ? '#333' : 'rgba(0,0,0,0.2)'};transition: color 0.2s;`;
        upBtn.innerHTML = '▲';
        upBtn.disabled = index === 0;
        upBtn.onclick = () => {
          if (index > 0) {
            [selectedTags[index - 1], selectedTags[index]] = [selectedTags[index], selectedTags[index - 1]];
            saveSelectedTags(selectedTags);
            updateEntriesDialog();
            updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
          }
        };
        if (index > 0) {
          upBtn.onmouseover = () => upBtn.style.color = '#000';
          upBtn.onmouseout = () => upBtn.style.color = '#333';
        }
        sepControlsContainer.appendChild(upBtn);

        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.style.cssText = `background: none;border: none;cursor: ${index < selectedTags.length - 1 ? 'pointer' : 'not-allowed'};font-size: 12px;padding: 2px 4px;color: ${index < selectedTags.length - 1 ? '#333' : 'rgba(0,0,0,0.2)'};transition: color 0.2s;`;
        downBtn.innerHTML = '▼';
        downBtn.disabled = index === selectedTags.length - 1;
        downBtn.onclick = () => {
          if (index < selectedTags.length - 1) {
            [selectedTags[index], selectedTags[index + 1]] = [selectedTags[index + 1], selectedTags[index]];
            saveSelectedTags(selectedTags);
            updateEntriesDialog();
            updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
          }
        };
        if (index < selectedTags.length - 1) {
          downBtn.onmouseover = () => downBtn.style.color = '#000';
          downBtn.onmouseout = () => downBtn.style.color = '#333';
        }
        sepControlsContainer.appendChild(downBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.style.cssText = `background: none;border: none;cursor: pointer;font-size: 12px;padding: 2px 4px;color: #D32F2F;transition: color 0.2s;`;
        deleteBtn.innerHTML = '✕';
        deleteBtn.onclick = () => {
          selectedTags.splice(index, 1);
          saveSelectedTags(selectedTags);
          updateEntriesDialog();
          updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
        };
        deleteBtn.onmouseover = () => deleteBtn.style.color = '#B71C1C';
        deleteBtn.onmouseout = () => deleteBtn.style.color = '#D32F2F';
        sepControlsContainer.appendChild(deleteBtn);

        itemContainer.appendChild(sepControlsContainer);

        auswahl.appendChild(itemContainer);
        return;
      }

      const itemContainer = document.createElement('div');
      itemContainer.style.cssText = `display: flex;align-items: center;gap: 4px;padding: 6px;background: #0D6EFD;border: 1px solid #0D6EFD;border-radius: 2px;font-size: 11px;color: white;min-height: 28px;`;

      const tagLabel = document.createElement('span');
      tagLabel.style.cssText = 'font-weight: bold; cursor: pointer; flex-shrink: 0;';
      tagLabel.textContent = tagName;
      tagLabel.onclick = () => {
        deleteHotkeysForTag(tagName);
        selectedTags.splice(index, 1);
        saveSelectedTags(selectedTags);
        updateEntriesDialog();
        updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
      };
      itemContainer.appendChild(tagLabel);

      const spacer = document.createElement('div');
      spacer.style.cssText = 'flex: 1;';
      itemContainer.appendChild(spacer);

      const controlsContainer = document.createElement('div');
      controlsContainer.style.cssText = `display: flex;gap: 4px;align-items: center;flex-shrink: 0;`;

      if (isHotkeyModeEnabled()) {
        const hotkeyButtonsDiv = document.createElement('div');
        hotkeyButtonsDiv.className = 'geizhals-hotkey-buttons-div';

        const slotToGridColumn = {
          'ohne': 1,
          '@1': 1,
          '@2': 2,
          '@3': 3
        };

        const slots = getAvailableSlots(tagName);
        slots.forEach(slot => {
          const hotkeyBtn = document.createElement('button');
          hotkeyBtn.type = 'button';
          hotkeyBtn.className = 'geizhals-hotkey-button-inline';

          const hotkey = getHotkeyForTag(tagName, slot);
          const displayText = hotkey ? `${slot} [${displayHotkeyText(hotkey)}]` : slot;
          const bgColor = hotkey ? '#84E8BA' : 'rgba(255,255,255,0.3)';

          hotkeyBtn.style.cssText = `background: ${bgColor};grid-column: ${slotToGridColumn[slot]};`;
          hotkeyBtn.textContent = displayText;

          hotkeyBtn.onmouseover = () => {
            hotkeyBtn.style.background = hotkey ? '#7CD5A3' : 'rgba(255,255,255,0.5)';
          };
          hotkeyBtn.onmouseout = () => {
            hotkeyBtn.style.background = bgColor;
          };

          hotkeyBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const hotkey = getHotkeyForTag(tagName, slot);
            if (hotkey) {
              // Hotkey ist bereits vergeben - entfernen
              setHotkeyForTag(tagName, slot, null);
              updateEntriesDialog();
              updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
            } else {
              // Kein Hotkey - Modal öffnen
              openHotkeyModal(tagName, slot, (key) => {
                setHotkeyForTag(tagName, slot, key);
                updateEntriesDialog();
                updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
              });
            }
          };

          hotkeyButtonsDiv.appendChild(hotkeyBtn);
        });

        controlsContainer.appendChild(hotkeyButtonsDiv);
      }

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.style.cssText = `background: none;border: none;cursor: ${index > 0 ? 'pointer' : 'not-allowed'};font-size: 12px;padding: 2px 4px;color: ${index > 0 ? 'white' : 'rgba(255,255,255,0.4)'};transition: color 0.2s;`;
      upBtn.innerHTML = '▲';
      upBtn.disabled = index === 0;
      upBtn.onclick = () => {
        if (index > 0) {
          [selectedTags[index - 1], selectedTags[index]] = [selectedTags[index], selectedTags[index - 1]];
          saveSelectedTags(selectedTags);
          updateEntriesDialog();
          updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
        }
      };
      if (index > 0) {
        upBtn.onmouseover = () => upBtn.style.color = '#fff';
        upBtn.onmouseout = () => upBtn.style.color = 'white';
      }
      controlsContainer.appendChild(upBtn);

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.style.cssText = `background: none;border: none;cursor: ${index < selectedTags.length - 1 ? 'pointer' : 'not-allowed'};font-size: 12px;padding: 2px 4px;color: ${index < selectedTags.length - 1 ? 'white' : 'rgba(255,255,255,0.4)'};transition: color 0.2s;`;
      downBtn.innerHTML = '▼';
      downBtn.disabled = index === selectedTags.length - 1;
      downBtn.onclick = () => {
        if (index < selectedTags.length - 1) {
          [selectedTags[index], selectedTags[index + 1]] = [selectedTags[index + 1], selectedTags[index]];
          saveSelectedTags(selectedTags);
          updateEntriesDialog();
          updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
        }
      };
      if (index < selectedTags.length - 1) {
        downBtn.onmouseover = () => downBtn.style.color = '#fff';
        downBtn.onmouseout = () => downBtn.style.color = 'white';
      }
      controlsContainer.appendChild(downBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.style.cssText = `background: none;border: none;cursor: pointer;font-size: 12px;padding: 2px 4px;color: #ffcccc;transition: color 0.2s;`;
      deleteBtn.innerHTML = '✕';
      deleteBtn.onclick = () => {
        deleteHotkeysForTag(tagName);
        selectedTags.splice(index, 1);
        saveSelectedTags(selectedTags);
        updateEntriesDialog();
        updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
      };
      deleteBtn.onmouseover = () => deleteBtn.style.color = '#fff';
      deleteBtn.onmouseout = () => deleteBtn.style.color = '#ffcccc';
      controlsContainer.appendChild(deleteBtn);

      itemContainer.appendChild(controlsContainer);

      auswahl.appendChild(itemContainer);
    });

    const categoryMap = { 'AGR-CE': 'AGR-CE', 'AGR-HH': 'AGR-HH', 'AGR-HW': 'AGR-HW', 'AGR-SPSWG': 'AGR-SPSWG', 'Global': 'common' };
    Object.entries(categoryMap).forEach(([colId, category]) => {
      const content = document.querySelector(`#geizhals-column-${colId} .geizhals-entries-column-content`);
      if (!content) return;

      Object.entries(TAG_MAP).forEach(([tagName, info]) => {
        if (info.category === category) {
          const isSelected = selectedTags.includes(tagName);

          const itemContainer = document.createElement('div');
          itemContainer.style.cssText = `display: flex;align-items: center;justify-content: space-between;padding: 6px;background: ${isSelected ? '#f0f0f0' : 'white'};border: 1px solid #ccc;border-radius: 2px;font-size: 11px;cursor: ${isSelected ? 'not-allowed' : 'pointer'};opacity: ${isSelected ? '0.4' : '1'};transition: all 0.15s;`;

          const labelContainer = document.createElement('div');
          labelContainer.style.cssText = 'flex: 1;';

          const label = document.createElement('span');
          label.style.cssText = 'font-weight: bold;';
          label.textContent = tagName;
          labelContainer.appendChild(label);

          if (showIds) {
            const idSpan = document.createElement('span');
            idSpan.style.cssText = `display: inline-block;margin-left: 8px;font-size: 10px;color: #666;`;
            idSpan.textContent = `(${info.id})`;
            labelContainer.appendChild(idSpan);
          }

          itemContainer.appendChild(labelContainer);

          if (!isSelected) {
            itemContainer.onmouseover = () => {
              itemContainer.style.background = '#e8f4f8';
              itemContainer.style.borderColor = '#0066cc';
            };
            itemContainer.onmouseout = () => {
              itemContainer.style.background = 'white';
              itemContainer.style.borderColor = '#ccc';
            };
            itemContainer.onclick = () => {
              selectedTags.push(tagName);
              saveSelectedTags(selectedTags);
              updateEntriesDialog();
              updateQuickTagsPanel(document.getElementById('geizhals-quick-tags'));
            };
          }

          content.appendChild(itemContainer);
        }
      });
    });
  }

  // ==================== IMAGE HOVER ANIMATION TOGGLE ====================

  const IMAGE_HOVER_DISABLE_KEY = 'geizhals_disable_image_hover';

  function createImageHoverToggle() {
    try {
      // Nicht auf showeintr-Seiten anzeigen
      if (window.location.pathname.includes('/eintrag/showeintr')) return;

      const headers = document.querySelectorAll('th.ft__head__cell');
      let imageHeader = null;

      for (let header of headers) {
        const div = header.querySelector('.d-flex.align-items-center');
        if (div && div.textContent.trim() === 'Bild') {
          imageHeader = header;
          break;
        }
      }

      if (!imageHeader || document.getElementById('image-hover-toggle-container')) return;

      const toggleContainer = document.createElement('div');
      toggleContainer.id = 'image-hover-toggle-container';
      toggleContainer.style.cssText = `padding: 6px 10px;background: #f8f9fa;border: 1px solid #dee2e6;border-radius: 4px;margin-top: 8px;display: inline-flex;align-items: center;gap: 6px;`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'image-hover-toggle-checkbox';
      checkbox.className = 'form-check-input';
      checkbox.style.cssText = `cursor: pointer;width: 14px;height: 14px;`;

      const isDisabled = localStorage.getItem(IMAGE_HOVER_DISABLE_KEY) === 'true';
      checkbox.checked = isDisabled;

      const label = document.createElement('label');
      label.htmlFor = 'image-hover-toggle-checkbox';
      label.style.cssText = `margin: 0;cursor: pointer;user-select: none;font-weight: 500;font-size: 0.64rem;`;
      label.textContent = 'Hover deaktivieren';

      checkbox.addEventListener('change', function() {
        const isChecked = this.checked;
        localStorage.setItem(IMAGE_HOVER_DISABLE_KEY, isChecked);

        if (isChecked) {
          document.body.classList.add('disable-image-hover');
        } else {
          document.body.classList.remove('disable-image-hover');
        }
      });

      toggleContainer.appendChild(checkbox);
      toggleContainer.appendChild(label);

      if (isDisabled) {
        document.body.classList.add('disable-image-hover');
      }

      const headerDiv = imageHeader.querySelector('.d-flex.align-items-center');
      if (headerDiv) {
        try {
          if (headerDiv.nextSibling && headerDiv.nextSibling.parentNode === imageHeader) {
            imageHeader.insertBefore(toggleContainer, headerDiv.nextSibling);
          } else {
            imageHeader.appendChild(toggleContainer);
          }
        } catch (e) {
          try { imageHeader.appendChild(toggleContainer); } catch (e2) {}
        }
      }
    } catch (e) {
      // Fehler ignorieren
    }
  }

  // ==================== ENHANCED TODO ====================

  let trashToggleCheckbox = null;

  function applyForceHover(enable) {
    const tags = document.querySelectorAll('.tag');
    tags.forEach((tag) => {
      if (enable) {
        tag.classList.add('force-hover');
      } else {
        tag.classList.remove('force-hover');
      }
    });
  }

  function findTodoTagHeader() {
    const headers = document.querySelectorAll('th.ft__head__cell');
    for (let header of headers) {
      const div = header.querySelector('.d-flex.align-items-center');
      if (div && div.textContent.includes('Todo') && div.textContent.includes('Tag')) {
        return header;
      }
    }
    return null;
  }

  function createToggle() {
    try {
      const header = findTodoTagHeader();
      if (!header || document.getElementById('trash-toggle-container')) return;

      // Klasse für minimale Spaltenbreite hinzufügen
      header.classList.add('geizhals-todo-tag-header');

      const toggleContainer = document.createElement('div');
      toggleContainer.id = 'trash-toggle-container';

      // Erste Zeile: Löschen anzeigen
      const trashRow = document.createElement('span');
      trashRow.className = 'trash-toggle-row';

      trashToggleCheckbox = document.createElement('input');
      trashToggleCheckbox.type = 'checkbox';
      trashToggleCheckbox.id = 'trash-toggle-checkbox';
      trashToggleCheckbox.className = 'form-check-input';

      const label = document.createElement('label');
      label.htmlFor = 'trash-toggle-checkbox';
      label.textContent = 'Löschen anzeigen';

      trashToggleCheckbox.addEventListener('change', function() {
        if (this.checked) {
          document.body.classList.add('show-trash-icons');
          applyForceHover(true);
        } else {
          document.body.classList.remove('show-trash-icons');
          applyForceHover(false);
        }
      });

      trashRow.appendChild(trashToggleCheckbox);
      trashRow.appendChild(label);
      toggleContainer.appendChild(trashRow);

      // Zweite Zeile: Getaggte ausblenden (nur auf rejects-Seite)
      const isRejectsPage = window.location.pathname.includes('/matchcode/rejects');

      if (isRejectsPage) {
        const hideTaggedWrapper = document.createElement('span');
        hideTaggedWrapper.id = 'hide-tagged-wrapper';

        const hideTaggedCheckbox = document.createElement('input');
        hideTaggedCheckbox.type = 'checkbox';
        hideTaggedCheckbox.id = 'hide-tagged-checkbox';
        hideTaggedCheckbox.className = 'form-check-input';

        // Zustand aus localStorage laden
        const savedHideTagged = localStorage.getItem(HIDE_TAGGED_KEY) === 'true';
        hideTaggedCheckbox.checked = savedHideTagged;

        const hideTaggedLabel = document.createElement('label');
        hideTaggedLabel.htmlFor = 'hide-tagged-checkbox';
        hideTaggedLabel.textContent = 'Getaggte ausblenden';

        hideTaggedCheckbox.addEventListener('change', function() {
          // Zustand in localStorage speichern
          localStorage.setItem(HIDE_TAGGED_KEY, this.checked ? 'true' : 'false');
          applyHideTaggedFilter();
        });

        hideTaggedWrapper.appendChild(hideTaggedCheckbox);
        hideTaggedWrapper.appendChild(hideTaggedLabel);
        toggleContainer.appendChild(hideTaggedWrapper);
      }

      const headerContent = header.querySelector('.d-flex.align-items-center');
      if (headerContent && headerContent.parentNode) {
        try {
          if (headerContent.nextSibling && headerContent.nextSibling.parentNode === headerContent.parentNode) {
            headerContent.parentNode.insertBefore(toggleContainer, headerContent.nextSibling);
          } else {
            headerContent.parentNode.appendChild(toggleContainer);
          }
        } catch (e) {
          try { headerContent.parentNode.appendChild(toggleContainer); } catch (e2) {}
        }
      }

      // Initial Filter anwenden und Observer starten (nur auf rejects-Seite)
      if (isRejectsPage) {
        applyHideTaggedFilter();
        setupTagObserver();
      }
    } catch (e) {
      // Fehler ignorieren
    }
  }

  function applyHideTaggedFilter() {
    const checkbox = document.getElementById('hide-tagged-checkbox');
    if (!checkbox) return;

    const shouldHide = checkbox.checked;
    const rows = document.querySelectorAll('tr.ft__body__row');

    rows.forEach(row => {
      const tagCell = row.querySelector('[id^="matchcode_todo_tag_id-"]');
      if (tagCell) {
        const tagElement = tagCell.querySelector('.tag');
        if (tagElement) {
          // Row hat einen Tag
          if (shouldHide) {
            row.style.display = 'none';
          } else {
            row.style.display = '';
          }
        }
      }
    });

    // Master-Checkbox Status aktualisieren
    updateMasterCheckboxVisibility();
  }

  function setupTagObserver() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const tagObserver = new MutationObserver(() => {
      // Filter erneut anwenden falls aktiv
      const checkbox = document.getElementById('hide-tagged-checkbox');
      if (checkbox && checkbox.checked) {
        applyHideTaggedFilter();
      }
    });

    tagObserver.observe(tbody, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function createCopyIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const frontRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    frontRect.setAttribute('x', '9');
    frontRect.setAttribute('y', '9');
    frontRect.setAttribute('width', '13');
    frontRect.setAttribute('height', '13');
    frontRect.setAttribute('rx', '2');
    frontRect.setAttribute('ry', '2');

    const backPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    backPath.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');

    svg.appendChild(backPath);
    svg.appendChild(frontRect);

    return svg;
  }

  async function copyToClipboard(text, iconElement) {
    try {
      await navigator.clipboard.writeText(text);
      iconElement.classList.add('copied');
      setTimeout(() => iconElement.classList.remove('copied'), 1000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        iconElement.classList.add('copied');
        setTimeout(() => iconElement.classList.remove('copied'), 1000);
      } catch (err) {
      }

      document.body.removeChild(textArea);
    }
  }

  function addCopyIcons() {
    try {
      const designationDivs = document.querySelectorAll('td[id^="eintrag_name_sample-"] > div[style*="color: rgb(136, 136, 136)"]');

      designationDivs.forEach(div => {
        try {
          if (div.querySelector('.copy-icon-wrapper')) return;

          const span = div.querySelector('span');
          if (!span) return;

          const textToCopy = span.textContent.trim();

          const wrapper = document.createElement('span');
          wrapper.className = 'copy-icon-wrapper';

          const iconContainer = document.createElement('span');
          iconContainer.className = 'copy-icon';
          iconContainer.title = 'In Zwischenablage kopieren';

          const svgIcon = createCopyIcon();
          iconContainer.appendChild(svgIcon);

          iconContainer.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard(textToCopy, iconContainer);
          });

          wrapper.appendChild(iconContainer);
          div.appendChild(wrapper);
        } catch (e) {
          // Fehler im forEach ignorieren
        }
      });
    } catch (e) {
      // Fehler ignorieren
    }
  }

  // ==================== SORT BUTTONS ====================

  function sortTableByColumn(columnName, direction) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr.ft__body__row'));
    if (rows.length === 0) return;

    let cellIdentifier = '';
    if (columnName === 'Bezeichnung und Matchinfo') {
      cellIdentifier = 'eintrag_name_sample-';
    } else if (columnName === 'Händler Kategorie') {
      cellIdentifier = 'eintrag_haendler_cat-';
    } else {
      return;
    }

    const rowData = rows.map((row) => {
      const cell = row.querySelector(`td[id^="${cellIdentifier}"]`);
      const text = cell ? cell.textContent.trim() : '';
      return { row, text };
    });

    rowData.sort((a, b) => {
      const comparison = a.text.localeCompare(b.text, 'de', { numeric: true });
      return direction === 'asc' ? comparison : -comparison;
    });

    rowData.forEach((data) => {
      tbody.appendChild(data.row);
    });

    // Update master checkbox state after sorting
    updateMasterCheckboxState();
  }

  function createSortButton() {
    try {
      Object.entries(SORT_COLUMNS).forEach(([columnName, columnConfig]) => {
        try {
          const headers = document.querySelectorAll('th.ft__head__cell');
          let targetHeader = null;

          for (let header of headers) {
            const div = header.querySelector('.d-flex.align-items-center');
            if (div && div.textContent.trim() === columnName) {
              targetHeader = header;
              break;
            }
          }

          if (!targetHeader || targetHeader.querySelector(`[data-sort-column="${columnName}"]`)) {
            return; // Bereits hinzugefügt
          }

          const currentSortState = getSortState(columnName);
          let cellIdentifier = '';
          if (columnName === 'Bezeichnung und Matchinfo') {
            cellIdentifier = 'eintrag_name_sample-';
          } else if (columnName === 'Händler Kategorie') {
            cellIdentifier = 'eintrag_haendler_cat-';
          }

          const sortContainer = document.createElement('div');
          sortContainer.className = 'geizhals-sort-container';
          sortContainer.setAttribute('data-sort-column', columnName);

          const sortBtn = document.createElement('button');
          sortBtn.type = 'button';
          sortBtn.className = 'geizhals-sort-button';
          sortBtn.textContent = getSortButtonText(currentSortState);

          sortBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentState = getSortState(columnName);
            const newState = currentState === 'asc' ? 'desc' : 'asc';
            setSortState(columnName, newState);
            sortBtn.textContent = getSortButtonText(newState);

            sortTableByColumn(columnName, newState);
          };

          const searchInput = document.createElement('input');
          searchInput.type = 'text';
          searchInput.className = 'geizhals-search-input';
          searchInput.placeholder = 'Filtern...';
          searchInput.value = '';

          searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value;
            filterTableBySearch(columnName, searchText, cellIdentifier);
            updateMasterCheckboxVisibility();
          });

          sortContainer.appendChild(sortBtn);
          sortContainer.appendChild(searchInput);
          targetHeader.appendChild(sortContainer);
        } catch (e) {
          // Fehler im forEach ignorieren
        }
      });
    } catch (e) {
      // Fehler ignorieren
    }
  }

  // ==================== EXPORT/IMPORT ====================

  function getAllStorageData() {
    return {
      settings: localStorage.getItem(SETTINGS_KEY),
      selectedTags: localStorage.getItem(STORAGE_KEY_SELECTED_TAGS),
      hotkeys: localStorage.getItem(HOTKEYS_KEY),
      hotkeyModeEnabled: localStorage.getItem(HOTKEY_MODE_ENABLED_KEY),
      imageHoverDisabled: localStorage.getItem(IMAGE_HOVER_DISABLE_KEY),
      hideTaggedRows: localStorage.getItem(HIDE_TAGGED_KEY),
      tagHistory: localStorage.getItem(TAG_HISTORY_KEY),
      showIds: localStorage.getItem('geizhals_show_ids'),
      exportDate: new Date().toISOString(),
      version: '1.2.5'
    };
  }

  function exportSettings() {
    const data = getAllStorageData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geizhals-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importSettings(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (!data || typeof data !== 'object') {
            reject('Ungültiges Dateiformat');
            return;
          }

          if (data.settings) localStorage.setItem(SETTINGS_KEY, data.settings);
          if (data.selectedTags) localStorage.setItem(STORAGE_KEY_SELECTED_TAGS, data.selectedTags);
          if (data.hotkeys) localStorage.setItem(HOTKEYS_KEY, data.hotkeys);
          if (data.hotkeyModeEnabled) localStorage.setItem(HOTKEY_MODE_ENABLED_KEY, data.hotkeyModeEnabled);
          if (data.imageHoverDisabled) localStorage.setItem(IMAGE_HOVER_DISABLE_KEY, data.imageHoverDisabled);
          if (data.hideTaggedRows) localStorage.setItem(HIDE_TAGGED_KEY, data.hideTaggedRows);
          if (data.tagHistory) localStorage.setItem(TAG_HISTORY_KEY, data.tagHistory);
          if (data.showIds) localStorage.setItem('geizhals_show_ids', data.showIds);

          resolve('Einstellungen erfolgreich importiert!');
        } catch (err) {
          reject('Fehler beim Parsen der Datei: ' + err.message);
        }
      };
      reader.onerror = () => reject('Fehler beim Lesen der Datei');
      reader.readAsText(file);
    });
  }

  function showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const message = await importSettings(file);
        showCenteredAlert(message);

        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (err) {
        showCenteredAlert('Import fehlgeschlagen: ' + err);
      }
    };
    input.click();
  }

  let agrDropdownObserver = null;
  let agrDropdownChangeListener = null;

  function monitorAGRDropdown() {
    try {
      const settings = getSettings();
      const agrDropdown = document.querySelector('select[aria-label="AGR"]');
      const fixValue = settings.fixAGRDropdownValue;

      // Wenn keine Fixierung gewählt, Listener entfernen
      if (!fixValue) {
        if (agrDropdownChangeListener && agrDropdown) {
          agrDropdown.removeEventListener('change', agrDropdownChangeListener);
          agrDropdownChangeListener = null;
        }
        if (agrDropdownObserver) {
          agrDropdownObserver.disconnect();
          agrDropdownObserver = null;
        }
        return;
      }

      if (!agrDropdown) {
        setTimeout(monitorAGRDropdown, 1000);
        return;
      }

      // Setze den gewünschten Wert
      agrDropdown.value = fixValue;
      // dispatchEvent verzögert und in try-catch
      setTimeout(() => {
        try {
          agrDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {
          // Fehler ignorieren
        }
      }, 0);

      if (agrDropdownChangeListener) {
        agrDropdown.removeEventListener('change', agrDropdownChangeListener);
      }

      agrDropdownChangeListener = () => {
        try {
          if (agrDropdown.value !== fixValue) {
            agrDropdown.value = fixValue;
            setTimeout(() => {
              try {
                agrDropdown.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (e) {
                // Fehler ignorieren
              }
            }, 0);
          }
        } catch (e) {
          // Fehler ignorieren
        }
      };

      agrDropdown.addEventListener('change', agrDropdownChangeListener);

      if (agrDropdownObserver) agrDropdownObserver.disconnect();

      agrDropdownObserver = new MutationObserver(() => {
        try {
          const currentSettings = getSettings();
          const currentFixValue = currentSettings.fixAGRDropdownValue;
          if (currentFixValue && agrDropdown.value !== currentFixValue) {
            agrDropdown.value = currentFixValue;
            setTimeout(() => {
              try {
                agrDropdown.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (e) {
                // Fehler ignorieren
              }
            }, 0);
          }
        } catch (e) {
          // Fehler ignorieren
        }
      });

      agrDropdownObserver.observe(agrDropdown, { attributes: true, attributeFilter: ['value'] });
    } catch (e) {
      // Fehler ignorieren
    }
  }

  // ==================== ERLEDIGT-BUTTON OVERRIDE ====================

  let originalFetch = null;
  let erledigtButtonObserver = null;

  function updateErledigtButton() {
    const settings = getSettings();
    const agrOverride = settings.agrButtonOverride;
    const fixValue = settings.fixAGRDropdownValue;

    // Nur aktiv wenn "Alle AGR" fixiert und ein Override gewählt ist
    if (fixValue !== 'all' || !agrOverride) {
      // Fetch zurücksetzen falls überschrieben
      if (originalFetch) {
        window.fetch = originalFetch;
        originalFetch = null;
      }
      // Button-Text beobachten beenden
      if (erledigtButtonObserver) {
        erledigtButtonObserver.disconnect();
        erledigtButtonObserver = null;
      }
      return;
    }

    // Fetch überschreiben um agr Parameter hinzuzufügen
    if (!originalFetch) {
      originalFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('/api/matchcode/last_seen?h_id=')) {
          const currentSettings = getSettings();
          const currentOverride = currentSettings.agrButtonOverride;
          const currentFixValue = currentSettings.fixAGRDropdownValue;

          if (currentFixValue === 'all' && currentOverride && !url.includes('&agr=')) {
            url = url + '&agr=' + encodeURIComponent(currentOverride);
          }
        }
        // WICHTIG: Verwende die modifizierte url, nicht arguments!
        return originalFetch.call(this, url, options);
      };
    }

    // Button-Text überwachen und ändern
    function updateButtonText() {
      const buttons = document.querySelectorAll('button.btn.btn-secondary.btn-sm');
      buttons.forEach(btn => {
        const text = btn.textContent;
        if (text.includes('Händler als erledigt setzen')) {
          const currentSettings = getSettings();
          const currentOverride = currentSettings.agrButtonOverride;
          const currentFixValue = currentSettings.fixAGRDropdownValue;

          if (currentFixValue === 'all' && currentOverride) {
            // Extrahiere die Händlerzahl
            const match = text.match(/\((\d+)\s+Händler\)/);
            if (match) {
              const haendlerCount = match[1];
              const expectedText = `Händler als erledigt setzen (${currentOverride}) (${haendlerCount} Händler)`;
              if (btn.textContent !== expectedText) {
                btn.textContent = expectedText;
              }
            }
          }
        }
      });
    }

    updateButtonText();

    // MutationObserver für Button-Änderungen
    if (!erledigtButtonObserver) {
      erledigtButtonObserver = new MutationObserver(updateButtonText);
      erledigtButtonObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  // ==================== HOTKEY EXECUTION ====================

  function setupHotkeyExecutionListener(quickTagsPanel) {
    document.addEventListener('keydown', (e) => {
      if (!isHotkeyModeEnabled()) return;

      // Searchbar des Panels immer erlauben
      const searchbar = document.getElementById('geizhals-searchbar');
      if (document.activeElement === searchbar) return;

      // Input-Check: Textfelder haben Vorrang, aber Checkboxen erlauben
      const activeEl = document.activeElement;
      if (activeEl.tagName === 'TEXTAREA') return;
      if (activeEl.tagName === 'INPUT' && activeEl.type !== 'checkbox') return;
      if (activeEl.contentEditable === 'true') return;

      const isPanelOpen = quickTagsPanel.style.display === 'block';
      const hasCheckbox = hasActiveCheckbox();

      const canExecuteHotkey = isPanelOpen || hasCheckbox;
      if (!canExecuteHotkey) return;

      // Hotkey-Zone muss nur aktiv sein wenn das Panel offen ist
      // Bei aktiver Checkbox werden Hotkeys direkt ausgeführt
      if (isPanelOpen && !hotkeyZoneActive) return;

      const key = getNormalizedHotkeyFromEvent(e);
      if (isModifierKey(e.key)) return;

      // Escape-Taste bricht den Eingabemodus ab (nur wenn Panel offen und Zone aktiv)
      if ((e.key === 'Escape' || key === 'ESCAPE') && isPanelOpen && hotkeyZoneActive) {
        e.preventDefault();
        e.stopPropagation();
        const hotkeyZone = document.getElementById('geizhals-hotkey-zone');
        if (hotkeyZone) {
          hotkeyZoneActive = false;
          hotkeyZone.className = 'geizhals-hotkey-zone';
          hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
        }
        return;
      }

      // Ignoriere Navigations-Tasten und programmatisch dispatchte Events
      const ignoredKeys = ['ARROWDOWN', 'ARROWUP', 'ARROWLEFT', 'ARROWRIGHT', 'ENTER', 'TAB', 'ESCAPE'];
      if (ignoredKeys.includes(key) || !e.isTrusted) return;

      const hotkeyZone = document.getElementById('geizhals-hotkey-zone');
      const assignment = findHotkeyAssignment(key);

      if (!assignment) {
        // Kein Hotkey erkannt
        if (isPanelOpen && hotkeyZone) {
          // Bei offenem Panel: Zone rot färben und Event blockieren
          e.preventDefault();
          e.stopPropagation();
          hotkeyZone.className = 'geizhals-hotkey-zone error';
          hotkeyZone.textContent = '❌ Kein Hotkey: ' + key;
          setTimeout(() => {
            hotkeyZoneActive = false;
            hotkeyZone.className = 'geizhals-hotkey-zone';
            hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
          }, 1500);
        }
        // Bei Checkbox ohne gültigen Hotkey: Event NICHT blockieren (normal weiterleiten)
        return;
      }

      // Gültiger Hotkey erkannt - jetzt Event blockieren
      e.preventDefault();
      e.stopPropagation();

      // Zone grün färben (nur wenn Panel offen)
      if (hotkeyZone && isPanelOpen) {
        hotkeyZone.className = 'geizhals-hotkey-zone success';
        hotkeyZone.textContent = '✓ ' + assignment.tagName + ' ' + assignment.slot;
        setTimeout(() => {
          hotkeyZoneActive = false;
          hotkeyZone.className = 'geizhals-hotkey-zone';
          hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
        }, 1000);
      }

      const { tagName, slot } = assignment;
      const storedInput = document.querySelector('[id^="react-select-"][id$="-input"]');
      selectTag(tagName, slot, storedInput);
    }, true);
  }

  // ==================== HOTKEY LISTENER ====================

  let currentMouseX = 0;
  let currentMouseY = 0;
  let lastActiveInput = null;
  let isCommentMode = false;
  let searchbarFocusEnabled = true;

  function highlightTagButton(tagName, priority) {
    const buttons = document.querySelectorAll(".geizhals-tag-button");
    buttons.forEach(btn => {
      if (btn.textContent.trim() === priority && btn.closest(".geizhals-tag-entry")?.querySelector(".geizhals-tag-name")?.textContent.trim() === tagName) {
        btn.style.background = "#90EE90";
        btn.style.borderColor = "#228B22";
        btn.dataset.highlighted = "true";
      } else if (btn.dataset.highlighted === "true") {
        btn.style.background = "white";
        btn.style.borderColor = "#ccc";
        btn.dataset.highlighted = "";
      }
    });
  }

  function toggleCommentMode(btn) {
    isCommentMode = !isCommentMode;

    if (isCommentMode) {
      btn.style.background = '#90EE90';
      btn.style.borderColor = '#228B22';
      btn.dataset.active = 'true';
    } else {
      btn.style.background = '#e8e8e8';
      btn.style.borderColor = '#ccc';
      btn.dataset.active = '';
    }
  }

  function exitCommentMode(btn) {
    isCommentMode = false;
    btn.style.background = '#e8e8e8';
    btn.style.borderColor = '#ccc';
    btn.dataset.active = '';
  }

  function positionPanelAtMouse(panel) {
    if (!panel) return;

    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;

    let topPosition = currentMouseY;
    let leftPosition = currentMouseX;

    if (leftPosition + panelWidth > window.innerWidth) {
      leftPosition = window.innerWidth - panelWidth - 10;
    }
    leftPosition = Math.max(10, leftPosition);

    const spaceBelow = window.innerHeight - currentMouseY;
    const spaceAbove = currentMouseY;

    // If cursor is near bottom of screen (less than 400px), shift panel up by 400px
    if (spaceBelow < 400) {
      topPosition = Math.max(10, currentMouseY - 400);
    } else if (spaceBelow >= panelHeight + 10) {
      topPosition = currentMouseY;
    }
    else if (spaceAbove >= panelHeight + 10) {
      topPosition = currentMouseY - panelHeight - 10;
    }
    else if (spaceAbove > spaceBelow) {
      topPosition = Math.max(10, currentMouseY - panelHeight - 10);
    } else {
      topPosition = Math.max(10, currentMouseY);
    }

    topPosition = Math.max(10, topPosition);

    panel.style.top = topPosition + 'px';
    panel.style.left = leftPosition + 'px';
  }

  function hasActiveCheckbox() {
    // Versuche verschiedene Checkbox-Selectors
    const selectors = [
      'input.form-check-input[type="checkbox"]',
      'input[type="checkbox"]',
      'input[type="checkbox"].form-check-input'
    ];

    for (const selector of selectors) {
      const checkboxes = document.querySelectorAll(selector);

      for (let checkbox of checkboxes) {
        // Master-Checkboxen ausschließen
        if (checkbox.id === 'geizhals-master-checkbox') continue;
        if (checkbox.id === 'select-all') continue;
        if (checkbox.checked && checkbox.offsetParent !== null) {
          return true;
        }
      }
    }
    return false;
  }

  function getActiveInputField() {
    const inputs = document.querySelectorAll('[id^="react-select-"][id$="-input"]');
    return inputs.length > 0 ? inputs[0] : null;
  }

  function applyDefaultPageSize() {
    const settings = getSettings();
    const pageSize = settings.pageSize || 100;
    const pageSizeSelect = document.querySelector('nav.fixed-bottom select.ms-1');
    if (pageSizeSelect && pageSizeSelect.value !== pageSize.toString()) {
      pageSizeSelect.value = pageSize;
      pageSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function watchPageSizeChanges() {
    let isInitialized = false;
    const observer = new MutationObserver(() => {
      const pageSizeSelect = document.querySelector('nav.fixed-bottom select.ms-1');
      if (pageSizeSelect && !isInitialized) {
        isInitialized = true;
        pageSizeSelect.addEventListener('change', function() {
          const settings = getSettings();
          settings.pageSize = parseInt(this.value);
          saveSettings(settings);
        });
        applyDefaultPageSize();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function focusSearchbarIfNeeded() {
    searchbarFocusEnabled = true;
    const searchbar = document.getElementById("geizhals-searchbar");
    if (searchbar && !searchbar.disabled) {
      searchbar.focus();
    }
  }

  function setupHotkeyListener(quickTagsPanel) {
    document.addEventListener('keydown', (e) => {
      const settings = getSettings();

      if (settings.hotkeyModifier === 'alt') {
        if (!e.altKey) return;
      }
      else if (settings.hotkeyModifier === 'mmb') {
        return;
      }
      else if (settings.hotkeyModifier === 'mmb-or-alt') {
        if (!e.altKey) return;
      }
      else {
        return;
      }

      if (!hasActiveCheckbox()) {
        return;
      }

      const inputField = getActiveInputField();
      if (!inputField) {
        return;
      }

      lastActiveInput = inputField;

      e.preventDefault();
      e.stopPropagation();

      updateQuickTagsPanel(quickTagsPanel);
      createSearchbar(quickTagsPanel);
      positionPanelAtMouse(quickTagsPanel);
      quickTagsPanel.style.display = 'block';
      focusSearchbarIfNeeded();
    }, true);

    document.addEventListener('mousedown', (e) => {
      const settings = getSettings();

      const isMmbPressed = e.button === 1;

      if (settings.hotkeyModifier === 'mmb') {
        if (!isMmbPressed) return;
      }
      else if (settings.hotkeyModifier === 'alt') {
        return;
      }
      else if (settings.hotkeyModifier === 'mmb-or-alt') {
        if (!isMmbPressed) return;
      }
      else {
        return;
      }

      if (!hasActiveCheckbox()) {
        return;
      }

      const inputField = getActiveInputField();
      if (!inputField) {
        return;
      }

      lastActiveInput = inputField;

      e.preventDefault();
      e.stopPropagation();

      updateQuickTagsPanel(quickTagsPanel);
      createSearchbar(quickTagsPanel);
      positionPanelAtMouse(quickTagsPanel);
      quickTagsPanel.style.display = 'block';
      focusSearchbarIfNeeded();
    }, true);

    document.addEventListener('focus', (e) => {
      const searchbar = document.getElementById('geizhals-searchbar');
      if (e.target === searchbar) {
        searchbarFocusEnabled = true;
      }
    }, true);
  }

  // ==================== PAGINATION SCROLL-TO-TOP ====================

  function setupPaginationScrollTop() {
    // Event-Delegation für Pagination-Buttons
    document.addEventListener('click', (e) => {
      const pageItem = e.target.closest('.page-item');
      if (pageItem) {
        // Speichere den aktuellen Inhalt der ersten Zeile (ctimes_id aus Link)
        const firstRowLink = document.querySelector('#haendler_count-0 a');
        const currentCtimesId = firstRowLink ? firstRowLink.href : '';

        console.log('[Pagination] Klick erkannt, aktuelle ctimes_id:', currentCtimesId);

        const scrollToTop = () => {
          console.log('[Pagination] scrollToTop ausgeführt');
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        };

        // Warte bis sich der Inhalt der ersten Zeile ändert
        const checkContentChange = setInterval(() => {
          const newFirstRowLink = document.querySelector('#haendler_count-0 a');
          const newCtimesId = newFirstRowLink ? newFirstRowLink.href : '';

          if (newCtimesId !== currentCtimesId && newCtimesId !== '') {
            console.log('[Pagination] Inhalt geändert, neue ctimes_id:', newCtimesId);
            clearInterval(checkContentChange);
            // Kurzes Delay für vollständiges Rendering
            setTimeout(scrollToTop, 50);
          }
        }, 50);

        // Timeout nach 30 Sekunden
        setTimeout(() => {
          console.log('[Pagination] Timeout erreicht');
          clearInterval(checkContentChange);
        }, 30000);
      }
    });
  }

  // ==================== INITIALIZATION ====================

  let panelResizeObserver = null;

  function setupPanelResizeObserver(panel) {
    // ResizeObserver nicht verwenden um zu verhindern, dass sich das Panel
    // beim Filtern/Tippen verschiebt
  }


  function setupPanelDragListener(quickTagsPanel) {
    // Drag-Funktionalität ist jetzt in createSearchbar integriert
  }
  function initializeScript() {
    document.addEventListener('mousemove', (e) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
    });

    const quickTagsPanel = createQuickTagsPanel();
    updateQuickTagsPanel(quickTagsPanel);
    createSearchbar(quickTagsPanel);
    setupPanelResizeObserver(quickTagsPanel);
    setupHotkeyExecutionListener(quickTagsPanel);
    setupHotkeyListener(quickTagsPanel);
    setupPanelDragListener(quickTagsPanel);

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('geizhals-quick-tags');
      if (!panel || panel.style.display !== 'block') return;

      const searchbar = document.getElementById('geizhals-searchbar');
      const hotkeyZone = document.getElementById('geizhals-hotkey-zone');

      if (searchbar && searchbar.contains(e.target)) {
        searchbarFocusEnabled = true;
        // Deaktiviere Hotkey-Zone wenn in Searchbar geklickt
        if (hotkeyZoneActive && hotkeyZone) {
          hotkeyZoneActive = false;
          hotkeyZone.className = 'geizhals-hotkey-zone';
          hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
        }
        return;
      }

      // Prüfe ob in die Hotkey-Zone geklickt wurde
      if (hotkeyZone && hotkeyZone.contains(e.target)) {
        return;
      }

      if (panel.contains(e.target)) {
        searchbarFocusEnabled = false;
        // Deaktiviere Hotkey-Zone wenn woanders im Panel geklickt
        if (hotkeyZoneActive && hotkeyZone) {
          hotkeyZoneActive = false;
          hotkeyZone.className = 'geizhals-hotkey-zone';
          hotkeyZone.textContent = 'Klicken für Hotkey-Eingabe';
        }
        return;
      }
      if (e.target.closest('input, select, button, [role="combobox"], [role="option"]')) return;

      closePanel(panel);
    }, true);

    createToggle();
    addCopyIcons();
    createImageHoverToggle();
    createSortButton();

    const mutationObserver = new MutationObserver(() => {
      try {
        if (document.body.classList.contains('show-trash-icons')) {
          const tags = document.querySelectorAll('.tag:not(.force-hover)');
          tags.forEach(tag => tag.classList.add('force-hover'));
        }

        if (!document.getElementById('trash-toggle-container')) {
          createToggle();
        }
        addCopyIcons();

        if (!document.getElementById('image-hover-toggle-checkbox')) {
          createImageHoverToggle();
        }

        // Sortier-Buttons auch bei DOM-Updates prüfen
        const columns = Object.keys(SORT_COLUMNS);
        for (let columnName of columns) {
          const headers = document.querySelectorAll('th.ft__head__cell');
          let found = false;
          for (let header of headers) {
            if (header.querySelector(`[data-sort-column="${columnName}"]`)) {
              found = true;
              break;
            }
          }
          if (!found) {
            createSortButton();
            break;
          }
        }
      } catch (e) {
        // Fehler ignorieren um serverseitige Logs zu vermeiden
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    watchPageSizeChanges();
    handleMasterCheckbox();
    setupPaginationScrollTop();

    // Escape-Taste schließt alle UI-Elemente
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Panel schließen
        const panel = document.getElementById('geizhals-quick-tags');
        if (panel && panel.style.display === 'block') {
          panel.style.display = 'none';
          return;
        }

        // Settings-Overlay schließen
        const settingsOverlay = document.getElementById('geizhals-settings-overlay');
        if (settingsOverlay && settingsOverlay.style.display === 'block') {
          settingsOverlay.style.display = 'none';
          return;
        }

        // Tag-Verwaltung-Dialog schließen
        const entriesOverlay = document.getElementById('geizhals-entries-overlay');
        if (entriesOverlay && entriesOverlay.style.display === 'block') {
          entriesOverlay.style.display = 'none';
          return;
        }
      }
    });
  }

  initializeScript();
  monitorAGRDropdown();
  updateErledigtButton();

})();