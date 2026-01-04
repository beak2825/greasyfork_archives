// ==UserScript==
// @name        xeno auto typer 
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Ultra-simple Lite autotyper: Only WPM and Accuracy configurable. Purple theme option added.
// @author       convicted
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @match        *://www.google.com/recaptcha/api2/anchor*
// @icon         https://cdn2.steamgriddb.com/icon/2b16a44bb65751bb0ebe5d8b42644bc2/32/512x512.png
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559144/xeno%20auto%20typer.user.js
// @updateURL https://update.greasyfork.org/scripts/559144/xeno%20auto%20typer.meta.js
// ==/UserScript==
/*
===================================================================================
🛠️ CONFIGURATION – ULTRA-SIMPLE FOR LITE VERSION
===================================================================================
*/

// ===== USER CONFIGURABLE OPTIONS (Only WPM, Accuracy, and Theme) =====

/**
 * Configure your desired typing speed and accuracy here.
 * Defaults: WPM 81, Accuracy 95%, Theme 'blue'.
 */
const AppConfig = {
  defaults: {
    // Default WPM value.
    WPM_VALUE: 81,

    // Default Accuracy value (minimum target).
    ACCURACY_VALUE: 95,

    // Default theme
    theme: 'blue',

// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
    // Default WPM band range (e.g., +/- 5 WPM)
    WPM_BAND_RANGE: 5,

    // Default number of races to run before stopping
    RACES_TO_RUN: 10,
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---

    // Fixed basic parameters (no advanced stuff)
    TYPING_PARAMS: {
      allowedDeviation: 3, // Simple deviation
      correctionStrength: 0.5, // Basic correction
      speedBoost: 0.95, // Basic initial boost
      wpmSmoothingFactor: 0.8 // Simple smoothing
    }
  },

  // Internal configuration values
  config: {},

  /**
   * Initializes the configuration.
   */
  init(savedSettings = null) {
    this.config = JSON.parse(JSON.stringify(this.defaults)); // Deep copy defaults

    if (savedSettings) {
      this.loadFromSettings(savedSettings);
    }
  },

  /**
   * Overrides default configuration with saved settings (only basic keys).
   */
  loadFromSettings(settings) {
    if (settings.WPM_VALUE !== undefined) {
        this.config.WPM_VALUE = settings.WPM_VALUE;
    }
    if (settings.ACCURACY_VALUE !== undefined) {
        this.config.ACCURACY_VALUE = settings.ACCURACY_VALUE;
    }
    if (settings.theme !== undefined) {
        this.config.theme = settings.theme;
    }
// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
    if (settings.WPM_BAND_RANGE !== undefined) {
        this.config.WPM_BAND_RANGE = settings.WPM_BAND_RANGE;
    }
    if (settings.RACES_TO_RUN !== undefined) {
        this.config.RACES_TO_RUN = settings.RACES_TO_RUN;
    }
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---
    console.log('[AppConfig] Loaded settings:', this.config);
  },

  /**
   * Provides access to WPM value.
   */
  get wpmValue() {
    return this.config.WPM_VALUE;
  },

  /**
   * Provides access to Accuracy value.
   */
  get accuracyValue() {
    return this.config.ACCURACY_VALUE;
  },

  /**
   * Provides access to theme.
   */
  get theme() {
    return this.config.theme;
  },

// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
  /**
   * Provides access to WPM Band Range.
   */
  get wpmBandRange() {
    return this.config.WPM_BAND_RANGE;
  },

  /**
   * Provides access to Races to Run value.
   */
  get racesToRun() {
    return this.config.RACES_TO_RUN;
  },
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---

  /**
   * Provides access to basic Typing Params (fixed).
   */
  get typingParams() {
    return this.config.TYPING_PARAMS;
  }
};

/**
 * Configure elements to hide for performance.
 */
const ElementHiderConfig = {
    elementsToHide: [
        '.structure-leaderboard',
        '.ad--side',
        '.ad--side-extra',
        '.raceChat',
        '.sound-controls',
        '.header-bar--return-to-garage',
        '.dropdown--account',
        '.header-nav',
        '.structure-footer',
        '.pre-header-bar',
        '.site-takeover--header',
        '.site-takeover--footer'
    ]
};

/**
 * Hides specified elements using CSS.
 */
function hideElements() {
    const style = document.createElement('style');
    style.id = 'nitro-type-hider-style';
    let css = '';
    ElementHiderConfig.elementsToHide.forEach(selector => {
        css += `${selector} { display: none !important; }`;
    });
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

hideElements();

/*
===================================================================================
*/

// ===== CORE CONSTANTS =====

/**
 * Application-wide constants
 */
const Constants = {
  TYPING: {
    CHARS_PER_WORD: 5,
    MS_PER_MINUTE: 60 * 1000
  },
  EVENTS: {
    METRICS_UPDATED: 'metricsUpdated',
    SESSION_COMPLETED: 'sessionCompleted',
  },
  STORAGE: {
    CONFIG_KEY: 'typingBotConfig',
// --- START: ADDED CODE FOR RACE COUNTER ---
    RACE_COUNT_KEY: 'typingBotRaceCount',
// --- END: ADDED CODE FOR RACE COUNTER ---
  },
  BEHAVIOR: {
    MIN_DELAY_FACTOR: 0.9,
    MAX_DELAY_FACTOR: 1.1
  }
};

class EventBus {
// ... (existing EventBus code)
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }
}

/**
 * Centralized logging for errors only
 */
class Logger {
  static error(message, context = '') {
    console.error(`${context ? `[${context}] ` : ''}🔴 ${message}`);
  }
}

/**
 * Handles localStorage operations
 */
class StorageService {
  static getJson(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        Logger.error('Error parsing JSON from storage', 'StorageService');
        return null;
    }
  }

  static setJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        Logger.error('Error stringifying JSON for storage', 'StorageService');
    }
  }

  static getMoney() {
    try {
      const persisted = JSON.parse(localStorage.getItem("persist:nt"));
      if (persisted && persisted.user) {
        const parsed = JSON.parse(persisted.user);
        return parsed.money || 0;
      }
    } catch (e) {
      console.error("[StorageService] Error getting money from storage:", e);
    }
    return 0;
  }
}

/**
 * General utilities
 */
class Utils {
// ... (existing Utils code)
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getLongestWord(content) {
    const words = content.split(/\s+/);
    let longest = { word: "", index: 0 };

    for (let i = 0; i < words.length; i++) {
      if (words[i].length > longest.word.length) {
        longest.word = words[i];
        longest.index = content.indexOf(longest.word);
      }
    }

    return longest;
  }

  static boundValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static async retryUntilSuccess(operation, interval = 500) {
    if (operation()) return true;

    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (operation()) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, interval);
    });
  }

  static getWordAtIndex(content, index) {
    if (index < 0 || index >= content.length) return "";
    const words = content.split(/(\s+)/);
    let currentLength = 0;
    for (const wordOrSpace of words) {
        if (index >= currentLength && index < currentLength + wordOrSpace.length) {
            return wordOrSpace.trim();
        }
        currentLength += wordOrSpace.length;
    }
    return "";
  }
}

// ===== SETTINGS MANAGER (ULTRA-SIMPLE GUI WITH THEME TOGGLE) =====

class SettingsManager {
    constructor(appConfig) {
        this.config = appConfig;
        this.settings = {};
        this.modalId = 'nt-bot-settings-modal';
        this.toggleId = 'nt-bot-settings-toggle';
        this.dragElement = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }

    /**
     * Public entry point to load settings and create the GUI.
     */
    init() {
        this.loadSettings();
        this.config.init(this.settings);

        // FIX: Wait for document.body to be available since we run at document-start
        Utils.retryUntilSuccess(() => {
            if (document.body) {
                this.createGUI();
                return true;
            }
            return false;
        }, 100);
    }

    /**
     * Loads settings from localStorage or uses defaults (only WPM/Acc/Theme).
     */
    loadSettings() {
        const saved = StorageService.getJson(Constants.STORAGE.CONFIG_KEY);

        const defaults = this.config.defaults;
        this.settings = {
            WPM_VALUE: saved?.WPM_VALUE ?? defaults.WPM_VALUE,
            ACCURACY_VALUE: saved?.ACCURACY_VALUE ?? defaults.ACCURACY_VALUE,
            theme: saved?.theme ?? defaults.theme,
// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
            WPM_BAND_RANGE: saved?.WPM_BAND_RANGE ?? defaults.WPM_BAND_RANGE,
            RACES_TO_RUN: saved?.RACES_TO_RUN ?? defaults.RACES_TO_RUN
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---
        };
    }

    /**
     * Saves the current settings state to localStorage (only basic).
     */
    saveSettings() {
        const settingsToSave = {
            WPM_VALUE: this.config.config.WPM_VALUE,
            ACCURACY_VALUE: this.config.config.ACCURACY_VALUE,
            theme: this.config.config.theme,
// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
            WPM_BAND_RANGE: this.config.config.WPM_BAND_RANGE,
            RACES_TO_RUN: this.config.config.RACES_TO_RUN
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---
        };
        StorageService.setJson(Constants.STORAGE.CONFIG_KEY, settingsToSave);
        console.log('[SettingsManager] Configuration saved.');
    }

    /**
     * Creates and injects the ultra-simple GUI.
     */
    createGUI() {
        // Inject Styles
        const style = document.createElement('style');
        style.textContent = this._getStyles();
        document.head.appendChild(style);

        // Inject Modal HTML
        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.classList.add('nt-bot-modal', 'hidden', `nt-bot-theme--${this.config.config.theme}`);
        modal.innerHTML = this._getModalHTML();
        document.body.appendChild(modal); // This line is now safe because init() waits for document.body

        // Inject Toggle Button
        const toggle = document.createElement('button');
        toggle.id = this.toggleId;
        toggle.classList.add('nt-bot-toggle-btn', `nt-bot-theme--${this.config.config.theme}`);
        toggle.textContent = '⚙️ Bot Config';
        document.body.appendChild(toggle);

        // Populate and Attach Listeners
        this._populateInputs();
        this._attachListeners(modal, toggle);
    }

    /**
     * Populates input fields with current config values (only 2 + theme).
     */
    _populateInputs() {
        const config = this.config.config;

        this._updateInput('WPM_VALUE', config.WPM_VALUE);
        this._updateInput('ACCURACY_VALUE', config.ACCURACY_VALUE);
// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
        this._updateInput('WPM_BAND_RANGE', config.WPM_BAND_RANGE);
        this._updateInput('RACES_TO_RUN', config.RACES_TO_RUN);
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---

        // Theme checkbox
        const themeCheckbox = document.getElementById('config-theme-purple');
        if (themeCheckbox) themeCheckbox.checked = (config.theme === 'purple');
    }

    /**
     * Helper to update an input element and its label.
     */
    _updateInput(key, value) {
        const input = document.getElementById('config-' + key);
        const label = document.getElementById('label-' + key);
        if (input) {
            input.value = value;
        }
        if (label) {
            let formattedValue = Math.round(value);
            label.textContent = formattedValue;
        }
    }

    /**
     * Attaches listeners (basic only).
     */
    _attachListeners(modal, toggle) {
        // Toggle button
        toggle.addEventListener('click', () => modal.classList.toggle('hidden'));

        // Close button
        modal.querySelector('.nt-bot-modal-close').addEventListener('click', () => modal.classList.add('hidden'));

        // Input change listener
        modal.addEventListener('input', (e) => this._handleInputChange(e));
        modal.addEventListener('change', (e) => this._handleInputChange(e));

        // Dragging listeners
        const header = modal.querySelector('.nt-bot-modal-header');
        header.addEventListener('mousedown', (e) => this._dragStart(e, modal));
        document.addEventListener('mousemove', (e) => this._dragMove(e, modal));
        document.addEventListener('mouseup', () => this._dragEnd());
    }

    /**
     * Handles updates from GUI inputs.
     */
    _handleInputChange(e) {
        const input = e.target;
        if (!input.id || !input.id.startsWith('config-')) return;

        const key = input.id.replace('config-', '');
        let value = input.type === 'checkbox' ? input.checked : parseInt(input.value);

        // Update config
        if (key === 'WPM_VALUE') {
            this.config.config.WPM_VALUE = value;
        } else if (key === 'ACCURACY_VALUE') {
            this.config.config.ACCURACY_VALUE = value;
// --- START: ADDED CODE FOR WPM BAND AND RACE COUNT ---
        } else if (key === 'WPM_BAND_RANGE') {
            this.config.config.WPM_BAND_RANGE = value;
        } else if (key === 'RACES_TO_RUN') {
            this.config.config.RACES_TO_RUN = value;
// --- END: ADDED CODE FOR WPM BAND AND RACE COUNT ---
        } else if (key === 'theme-purple') {
            const newTheme = value ? 'purple' : 'blue';
            this.config.config.theme = newTheme;
            // Apply theme change immediately
            const currentModal = document.getElementById(this.modalId);
            const currentToggle = document.getElementById(this.toggleId);
            currentModal.classList.remove('nt-bot-theme--blue', 'nt-bot-theme--purple');
            currentModal.classList.add(`nt-bot-theme--${newTheme}`);
            currentToggle.classList.remove('nt-bot-theme--blue', 'nt-bot-theme--purple');
            currentToggle.classList.add(`nt-bot-theme--${newTheme}`);
        }

        // Update display
        if (key !== 'theme-purple') {
            this._updateInput(key, value);
        }

        // Save
        this.saveSettings();
    }

    // Dragging Logic
    _dragStart(e, modal) {
        this.dragElement = modal;
        this.dragElement.style.transition = 'none';
        this.dragOffsetX = e.clientX - this.dragElement.offsetLeft;
        this.dragOffsetY = e.clientY - this.dragElement.offsetTop;
        e.preventDefault();
    }

    _dragMove(e) {
        if (this.dragElement) {
            this.dragElement.style.left = `${e.clientX - this.dragOffsetX}px`;
            this.dragElement.style.top = `${e.clientY - this.dragOffsetY}px`;
        }
    }

    _dragEnd() {
        if (this.dragElement) {
            this.dragElement.style.transition = 'all 0.2s ease-out';
            this.dragElement = null;
        }
    }

    // Ultra-Simple GUI HTML with Theme Checkbox
    _getModalHTML() {
        return `
            <div class="nt-bot-modal-header">
                <h2>Private Bot</h2>
                <button class="nt-bot-modal-close">&times;</button>
            </div>
            <div class="nt-bot-modal-content">
                <div class="nt-bot-section-title">Base Targets</div>
                ${this._createInputGroup('WPM_VALUE', 'Target WPM', 50, 200, 1)}
                ${this._createInputGroup('ACCURACY_VALUE', 'Target Accuracy (%)', 90, 100, 1)}

                <div class="nt-bot-input-group nt-bot-checkbox-group">
                    <label for="config-theme-purple" class="nt-bot-label">Purple Theme</label>
                    <input type="checkbox" id="config-theme-purple" name="config-theme-purple" />
                </div>

                <div class="nt-bot-section-title">WPM Band & Session</div>
                ${this._createInputGroup('WPM_BAND_RANGE', 'WPM Band Range (±)', 0, 20, 1)}
                ${this._createInputGroup('RACES_TO_RUN', 'Races to Run', 1, 500, 1)}

                <p class="nt-bot-info-footer">Changes saved automatically. Takes effect next race.</p>
                <p class="nt-bot-info-footer">Developed by @fd7u Owned by @yoraritystar on discord.</p>
                
            </div>
        `;
    }

    _createInputGroup(key, label, min, max, step = 1, unit = '') {
        const currentValue = this.config.config[key] ?? this.config.defaults[key];

        return `
            <div class="nt-bot-input-group">
                <label for="config-${key}" class="nt-bot-label">${label}</label>
                <div class="nt-bot-input-row">
                    <input type="range" id="config-${key}" name="config-${key}"
                           min="${min}" max="${max}" step="${step}" value="${currentValue}"
                           class="nt-bot-slider">
                    <span id="label-${key}" class="nt-bot-value-label">${Math.round(currentValue)}${unit}</span>
                </div>
            </div>
        `;
    }

    _getStyles() {
        return `
            /* Core Modal Styles */
            .nt-bot-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 300px;
                max-width: 90vw;
                background: #2c3e50; /* Default blue */
                color: #ecf0f1;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
                z-index: 100000;
                font-family: 'Inter', sans-serif;
                border: 2px solid #3498db;
                transition: all 0.2s ease-out;
            }

            .nt-bot-modal.nt-bot-theme--blue {
                background: #2c3e50;
                color: #ecf0f1;
                border: 2px solid #3498db;
            }

            .nt-bot-modal.nt-bot-theme--purple {
                background: #2c1b3a;
                color: #f0e6ff;
                border: 2px solid #8e44ad;
            }

            .nt-bot-modal.hidden {
                display: none !important;
            }

            /* Header */
            .nt-bot-modal-header {
                background: #34495e; /* Default blue */
                padding: 12px 15px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #3498db;
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-modal-header {
                background: #34495e;
                border-bottom: 1px solid #3498db;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-modal-header {
                background: #3b2265;
                border-bottom: 1px solid #8e44ad;
            }

            .nt-bot-modal-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .nt-bot-modal-close {
                background: none;
                border: none;
                color: #e74c3c;
                font-size: 24px;
                cursor: pointer;
                transition: color 0.2s;
            }
            .nt-bot-modal-close:hover {
                color: #c0392b;
            }

            /* Content - Increased padding for better internal spacing */
            .nt-bot-modal-content {
                padding: 15px 20px;
                max-height: 70vh;
                overflow-y: auto;
            }

            /* Section Titles - Ensure consistent separation and style */
            .nt-bot-section-title {
                font-size: 14px;
                font-weight: 700;
                color: #3498db; /* Default blue */
                margin-top: 15px;
                margin-bottom: 8px;
                border-bottom: 1px dashed #3498db50;
                padding-bottom: 4px;
            }

            /* Add margin separation for sections after the first one */
            .nt-bot-section-title:not(:first-child) {
                margin-top: 20px;
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-section-title {
                color: #3498db;
                border-bottom: 1px dashed #3498db50;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-section-title {
                color: #8e44ad;
                border-bottom: 1px dashed #8e44ad50;
            }

            /* Input Groups - Ensure consistent vertical spacing */
            .nt-bot-input-group {
                margin-bottom: 12px; /* Increased margin for better separation */
            }

            /* Make checkbox group use flex to align label and box */
            .nt-bot-checkbox-group {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 0px;
            }

            .nt-bot-label {
                display: block;
                font-size: 13px;
                margin-bottom: 4px;
                color: #bdc3c7; /* Default blue */
            }

            /* Remove margin-bottom override for checkbox group label */
            .nt-bot-checkbox-group .nt-bot-label {
                margin-bottom: 0;
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-label {
                color: #bdc3c7;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-label {
                color: #d7bde2;
            }

            .nt-bot-input-group input[type="checkbox"] {
                width: auto;
                margin-left: 10px;
                transform: scale(1.2);
            }

            /* Input Row - Crucial for slider alignment */
            .nt-bot-input-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            /* Improved Slider Look */
            .nt-bot-slider {
                flex-grow: 1;
                -webkit-appearance: none;
                width: 100%;
                height: 10px; /* Increased height */
                background: #34495e; /* Default blue */
                outline: none;
                opacity: 0.9;
                transition: opacity 0.2s;
                border-radius: 5px; /* Rounded track */
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4); /* Added inner shadow */
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-slider {
                background: #34495e;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-slider {
                background: #3b2265;
            }

            .nt-bot-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px; /* Increased size */
                height: 18px;
                border-radius: 50%;
                background: #3498db; /* Default blue */
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* Added thumb shadow */
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-slider::-webkit-slider-thumb {
                background: #3498db;
                border: 2px solid #fff;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-slider::-webkit-slider-thumb {
                background: #8e44ad;
                border: 2px solid #f0e6ff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* Added thumb shadow */
            }

            .nt-bot-value-label {
                min-width: 40px;
                font-size: 13px;
                font-weight: bold;
                color: #95a5a6; /* Default blue */
                text-align: right;
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-value-label {
                color: #95a5a6;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-value-label {
                color: #bb8fce;
            }

            .nt-bot-info-footer {
                margin-top: 20px;
                padding: 10px;
                border-top: 1px solid #3498db; /* Default blue */
                font-size: 12px;
                text-align: center;
                color: #95a5a6;
            }

            .nt-bot-modal.nt-bot-theme--blue .nt-bot-info-footer {
                border-top: 1px solid #3498db;
                color: #95a5a6;
            }

            .nt-bot-modal.nt-bot-theme--purple .nt-bot-info-footer {
                border-top: 1px solid #8e44ad;
                color: #bb8fce;
            }

            /* Toggle Button */
            .nt-bot-toggle-btn {
                position: fixed;
                top: 10px;
                left: 10px;
                background-color: #3498db; /* Default blue */
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
                z-index: 99999;
                font-weight: bold;
                transition: background-color 0.2s, transform 0.1s;
            }

            .nt-bot-toggle-btn.nt-bot-theme--blue {
                background-color: #3498db;
                color: #fff;
            }

            .nt-bot-toggle-btn.nt-bot-theme--purple {
                background-color: #8e44ad;
                color: #f0e6ff;
            }

            .nt-bot-toggle-btn:hover {
                background-color: #2980b9; /* Default blue hover */
                transform: scale(1.02);
            }

            .nt-bot-toggle-btn.nt-bot-theme--blue:hover {
                background-color: #2980b9;
            }

            .nt-bot-toggle-btn.nt-bot-theme--purple:hover {
                background-color: #7d3c98;
            }
        `;
    }
}

// ===== AUTO-CAPTCHA HANDLER =====
(function() {
// ... (existing Auto-Captcha Handler code)
    'use strict';

    const RECAPTCHA_CHECKBOX_SELECTOR = '#recaptcha-anchor';
    const CHECK_INTERVAL_MS = 400;

    const isRunningInRecaptchaIframe = window.location.href.includes('/recaptcha/api2/anchor');

    if (isRunningInRecaptchaIframe || window.top === window) {

        let clickSuccessful = false;

        function simulateClick(element) {
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }

        function attemptClick() {
            if (clickSuccessful) {
                return;
            }

            const checkbox = document.querySelector(RECAPTCHA_CHECKBOX_SELECTOR);

            if (checkbox) {
                console.log(`[AutoClicker] Found checkbox. Simulating click.`);
                simulateClick(checkbox);
                clickSuccessful = true;
                clearInterval(intervalCheck);
            }
        }

        const intervalCheck = setInterval(attemptClick, CHECK_INTERVAL_MS);
    }
})();

function autoClickCaptchaContinue() {
  const check = setInterval(() => {
    const button = document.querySelector('.modal-body .btn--primary');
    if (button) {
      button.click();
      clearInterval(check);
    }
  }, 1000);
}

autoClickCaptchaContinue();

// ===== CORE SERVICES (SIMPLIFIED) =====

/**
 * Manages configuration and session state (simple).
 */
class ConfigService {
  constructor(eventBus, settingsManager) {
    this.eventBus = eventBus;
    this.settingsManager = settingsManager;
    this.typingParams = AppConfig.typingParams;
    this.actualTargetWPM = AppConfig.wpmValue; // Set initial target
    this.calculateActualTargetWPM(); // Calculate randomized target
  }

  // --- START: ADDED CODE FOR WPM BAND ---
  /**
   * Calculates a randomized WPM target within the defined band on startup.
   */
  calculateActualTargetWPM() {
    const baseWPM = AppConfig.wpmValue;
    const range = AppConfig.wpmBandRange;
    // Calculate a random offset between -range and +range
    const offset = Math.random() * (range * 2) - range;

    this.actualTargetWPM = Math.round(baseWPM + offset);

    // Ensure it's not too low (e.g., min of 50 WPM)
    this.actualTargetWPM = Math.max(50, this.actualTargetWPM);

    console.log(`[ConfigService] Base WPM: ${baseWPM}, Range: ±${range}. Actual Target WPM: ${this.actualTargetWPM}`);
  }
  // --- END: ADDED CODE FOR WPM BAND ---

  get targetWPM() {
    // --- START: MODIFIED TO USE ACTUAL TARGET WPM ---
    return this.actualTargetWPM;
    // --- END: MODIFIED TO USE ACTUAL TARGET WPM ---
  }

  get targetAccuracy() {
    return AppConfig.accuracyValue;
  }
}

/**
 * Handles DOM interactions
 */
class DOMInterface {
  getTypingAppNode() {
    try {
      const dashContainer = document.querySelector("div.dash-copyContainer");
      if (dashContainer) {
          return Object.values(dashContainer)[1].children._owner.stateNode;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

/**
 * Tracks typing metrics (simplified: no stamina, no history, basic WPM/Acc).
 */
class MetricsService {
// ... (existing MetricsService code)
  constructor(configService, eventBus) {
    this.config = configService;
    this.eventBus = eventBus;
    this.reset();
  }

  reset() {
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.typingStartTime = null;
    this.charactersTyped = 0;
    this.currentWPM = 0;
    this.smoothedWPM = 0;

    this.targetCPM = this.config.targetWPM * Constants.TYPING.CHARS_PER_WORD;
    this.baseDelayMs = Constants.TYPING.MS_PER_MINUTE / this.targetCPM * this.config.typingParams.speedBoost;
    this.currentDelayMs = this.baseDelayMs;

    this.sessionCompleted = false;
  }

  get currentAccuracy() {
// ... (existing MetricsService methods)
    if (this.totalKeystrokes === 0) return 100;
    return (this.correctKeystrokes / this.totalKeystrokes) * 100;
  }

  updateKeystrokeStats(isCorrect) {
    this.totalKeystrokes++;
    if (isCorrect) this.correctKeystrokes++;
    this.emitMetricsUpdate();
  }

  trackCorrectKeystroke() {
    this.updateKeystrokeStats(true);
  }

  trackIncorrectKeystroke() {
    this.updateKeystrokeStats(false);
  }

  updateWPM(newChars) {
    if (this.typingStartTime === null) {
      this.typingStartTime = Date.now();
      return 0;
    }

    this.charactersTyped += newChars;
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - this.typingStartTime) / Constants.TYPING.MS_PER_MINUTE;

    if (elapsedMinutes > 0) {
      const instantWPM = (this.charactersTyped / Constants.TYPING.CHARS_PER_WORD) / elapsedMinutes;
      this.smoothedWPM = this.smoothedWPM === 0 ?
        instantWPM :
        this.smoothedWPM * this.config.typingParams.wpmSmoothingFactor +
        instantWPM * (1 - this.config.typingParams.wpmSmoothingFactor);

      this.currentWPM = this.smoothedWPM;
      return this.currentWPM;
    }

    return 0;
  }

  emitMetricsUpdate() {
    this.eventBus.emit(Constants.EVENTS.METRICS_UPDATED, {
      accuracy: this.currentAccuracy,
      wpm: this.currentWPM,
      keystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
    });
  }

  markSessionComplete() {
    if (this.sessionCompleted) return;
    this.sessionCompleted = true;

    this.eventBus.emit(Constants.EVENTS.SESSION_COMPLETED, {
      finalWPM: this.currentWPM || 0,
      finalAccuracy: this.currentAccuracy || 0,
    });
  }
}

/**
 * Controls timing (simplified: basic delay with minor correction, no patterns/pauses).
 */
class TimingController {
  constructor(metricsService, configService) {
    this.metrics = metricsService;
    this.config = configService;
  }

  calculateNextDelay(content, typedIndex) {
    let delay = this.metrics.baseDelayMs;

    // Basic speed adjustment
    if (this.metrics.charactersTyped > 5 && this.metrics.currentWPM > 0) {
      const wpmDiff = this.metrics.currentWPM - this.config.targetWPM;
      const correction = wpmDiff * this.config.typingParams.correctionStrength;
      delay = delay * (1 + correction / 10);
    }

    // Minor random variation for basic human feel
    delay *= (0.95 + Math.random() * 0.1);

    // Bound delay
    delay = Utils.boundValue(
      delay,
      this.metrics.baseDelayMs * Constants.BEHAVIOR.MIN_DELAY_FACTOR,
      this.metrics.baseDelayMs * Constants.BEHAVIOR.MAX_DELAY_FACTOR
    );

    this.metrics.currentDelayMs = delay;

    return delay;
  }
}

/**
 * Controls typing accuracy (simple probability-based).
 */
class AccuracyController {
// ... (existing AccuracyController code)
  constructor(metricsService, configService) {
    this.metrics = metricsService;
    this.config = configService;

    this.targetMinimum = this.config.targetAccuracy;
    this.errorScalingFactor = 0.02; // Simple scaling
  }

  shouldMakeError() {
    if (this.metrics.totalKeystrokes < 10) return false;

    const currentAcc = this.metrics.currentAccuracy;

    if (currentAcc <= this.targetMinimum) {
      return false;
    }

    const accDiff = currentAcc - this.targetMinimum;
    let errorProb = accDiff * this.errorScalingFactor;
    errorProb = Utils.boundValue(errorProb, 0.0, 0.15);

    return Math.random() < errorProb;
  }
}

/**
 * Handles keyboard input simulation (simple).
 */
class KeyboardHandler {
// ... (existing KeyboardHandler code)
  constructor(metricsService, configService, eventBus) {
    this.metrics = metricsService;
    this.config = configService;
    this.eventBus = eventBus;
  }

  processKeystroke(appNode, makeCorrect) {
    if (makeCorrect) {
      this.metrics.trackCorrectKeystroke();
      this.metrics.updateWPM(1);
    } else {
      this.metrics.trackIncorrectKeystroke();
    }

    appNode.handleKeyPress("character", new KeyboardEvent("keypress", {
      key: makeCorrect ? appNode.props.lessonContent[appNode.typedIndex] : "$"
    }));

    this._checkSessionComplete(appNode);
  }

  simulateEnterKey(appNode) {
    appNode.handleKeyPress("character", new KeyboardEvent("keypress", { key: "\n" }));
    this._checkSessionComplete(appNode);
  }

  _checkSessionComplete(appNode) {
    if (this._isSessionComplete(appNode)) {
      this.handleSessionCompletion();
    }
  }

  _isSessionComplete(appNode) {
    return appNode.typedIndex >= appNode.props.lessonContent.length;
  }

  handleSessionCompletion() {
    this.metrics.markSessionComplete();
  }

  createAutoKeyHandler(appNode, originalKeyHandler, accuracyController, longestWord) {
    return (e, n) => {
      if (n.key >= '1' && n.key <= '8' || n.key === 'Shift' || n.key === 'Control') {
        return originalKeyHandler(e, n);
      }
      return false;
    };
  }
}

// --- START: ADDED CODE FOR RACE COUNTER ---
/**
 * Handles the race count limit
 */
class RaceCounter {
  constructor(configService) {
    this.config = configService;
    this.limit = this.config.settingsManager.settings.RACES_TO_RUN;
    this.currentCount = this.loadCount();

    if (this.currentCount >= this.limit) {
      this.reset();
    }
  }

  loadCount() {
    return parseInt(localStorage.getItem(Constants.STORAGE.RACE_COUNT_KEY) || '0', 10);
  }

  saveCount(count) {
    localStorage.setItem(Constants.STORAGE.RACE_COUNT_KEY, count.toString());
  }

  increment() {
    this.currentCount++;
    this.saveCount(this.currentCount);
    console.log(`[RaceCounter] Current race: ${this.currentCount} of ${this.limit}`);
  }

  reset() {
    this.saveCount(0);
    this.currentCount = 0;
    console.log('[RaceCounter] Counter reset.');
  }

  hasReachedLimit() {
    return this.currentCount >= this.limit;
  }
}
// --- END: ADDED CODE FOR RACE COUNTER ---


/**
 * Manages typing session lifecycle (simple reload).
 */
class SessionManager {
  constructor(configService, metricsService, eventBus) {
    this.config = configService;
    this.metrics = metricsService;
    this.eventBus = eventBus;
    this.isHandlingCompletion = false;
    // --- START: ADDED CODE FOR RACE COUNTER ---
    this.raceCounter = new RaceCounter(configService);
    // --- END: ADDED CODE FOR RACE COUNTER ---

    this.eventBus.on(Constants.EVENTS.SESSION_COMPLETED, data => {
      if (!this.isHandlingCompletion) {
        this.handleSessionCompleted(data);
      }
    });
  }

  handleSessionCompleted(sessionData) {
    this.isHandlingCompletion = true;

    // --- START: ADDED CODE FOR RACE COUNTER ---
    this.raceCounter.increment();
    if (this.raceCounter.hasReachedLimit()) {
      console.log(`[SessionManager] Reached race limit (${this.raceCounter.currentCount}/${this.raceCounter.limit}). Stopping autotyper.`);
      return; // Do not reload
    }
    // --- END: ADDED CODE FOR RACE COUNTER ---

    // Simple reload after delay
    setTimeout(() => window.location.reload(), 4000);
  }
}

/**
 * Main auto-typer controller (simplified).
 */
class AutoTyper {
  constructor(services) {
// ... (existing AutoTyper constructor)
    this.dom = services.dom;
    this.config = services.config;
    this.metrics = services.metrics;
    this.timingController = services.timingController;
    this.accuracyController = services.accuracyController;
    this.keyboardHandler = services.keyboardHandler;
    this.eventBus = services.eventBus;
    this.sessionManager = services.sessionManager;
  }

  async init() {
    await Utils.retryUntilSuccess(() => {
// --- START: ADDED CODE FOR RACE COUNTER CHECK ---
      if (this.sessionManager.raceCounter.hasReachedLimit()) {
        console.log('[AutoTyper] Race limit reached. Not starting new session.');
        return true;
      }
// --- END: ADDED CODE FOR RACE COUNTER CHECK ---
      const result = this.initTypingScript();
      return result;
    }, 200);
  }

  initTypingScript() {
    try {
      this.appNode = this.dom.getTypingAppNode();
      if (!this.appNode) return false;

      const content = this.appNode.props.lessonContent;
      this.longestWord = Utils.getLongestWord(content);
      this.originalKeyHandler = this.appNode.input.keyHandler;
      this._nitroUsed = false;

      this.startTypingSession();
      return true;
    } catch (error) {
      return false;
    }
  }

  async startTypingSession() {
    this.appNode.input.keyHandler = this.keyboardHandler.createAutoKeyHandler(
      this.appNode,
      this.originalKeyHandler,
      this.accuracyController,
      this.longestWord
    );

    await Utils.delay(Math.random() * 2000 + 1000);

    this._runAutoTyper();
  }

  async _runAutoTyper() {
    let isTyping = true;

    this.metrics.typingStartTime = Date.now();

    this._nitroUsed = false;

    const typeNextCharacter = async () => {
      const currentTypedIndex = this.appNode.typedIndex;

      if (!isTyping || this._isSessionComplete(currentTypedIndex)) {
        if (this._isSessionComplete(currentTypedIndex)) {
          this.metrics.markSessionComplete();
        }
        return;
      }

      const delay = this.timingController.calculateNextDelay(
        this.appNode.props.lessonContent,
        currentTypedIndex
      );

      setTimeout(() => {
        // Nitro at longest word
        if (!this._nitroUsed && currentTypedIndex === this.longestWord.index) {
          try {
            this.keyboardHandler.simulateEnterKey(this.appNode);
            this._nitroUsed = true;
            console.log("Nitro used on:", this.longestWord.word);
          } catch (e) {
            console.error("Nitro error:", e);
          }
        }

        const makeError = this.accuracyController.shouldMakeError();
        this.keyboardHandler.processKeystroke(this.appNode, !makeError);

        typeNextCharacter();
      }, delay);
    };

    typeNextCharacter();
  }

  _isSessionComplete(currentTypedIndex) {
    return currentTypedIndex >= this.appNode.props.lessonContent.length;
  }
}

/**
 * Service container
 */
class ServiceContainer {
// ... (existing ServiceContainer code)
  constructor() {
    this.services = {};
  }

  register(name, service) {
    this.services[name] = service;
    return this;
  }

  get(name) {
    return this.services[name];
  }

  createServices() {
    const eventBus = new EventBus();
    this.register('eventBus', eventBus);

    const settingsManager = new SettingsManager(AppConfig);
    settingsManager.init(); // This now waits for the DOM before creating GUI
    this.register('settingsManager', settingsManager);

    const configService = new ConfigService(eventBus, settingsManager);
    this.register('config', configService);

    const domService = new DOMInterface();
    this.register('dom', domService);

    const metricsService = new MetricsService(configService, eventBus);
    this.register('metrics', metricsService);

    const timingController = new TimingController(metricsService, configService);
    this.register('timingController', timingController);

    const accuracyController = new AccuracyController(metricsService, configService);
    this.register('accuracyController', accuracyController);

    const keyboardHandler = new KeyboardHandler(metricsService, configService, eventBus);
    this.register('keyboardHandler', keyboardHandler);

    const sessionManager = new SessionManager(configService, metricsService, eventBus);
    this.register('sessionManager', sessionManager);

    const autoTyper = new AutoTyper(this.services);
    this.register('autoTyper', autoTyper);

    return this;
  }
}

/**
 * Main application
 */
class TypingApp {
  constructor() {
    this.container = new ServiceContainer().createServices();
    this.autoTyper = this.container.get('autoTyper');
  }

  async start() {
    await this.autoTyper.init();
  }
}

// ===== INITIALIZE =====
(function() {
  const app = new TypingApp();
  app.start();
})();