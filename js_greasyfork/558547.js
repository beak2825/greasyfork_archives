// ==UserScript==
// @name         Auto Typer for Nitro Type (NEW 2025)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  An auto-typing script with customizable speed and accuracy for Nitro Type.
// @author       Anon2004
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://cdn2.steamgriddb.com/icon/2b16a44bb65751bb0ebe5d8b42644bc4/32/512x512.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558547/Auto%20Typer%20for%20Nitro%20Type%20%28NEW%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558547/Auto%20Typer%20for%20Nitro%20Type%20%28NEW%202025%29.meta.js
// ==/UserScript==

/*
===================================================================================
🛠️ SETUP INSTRUCTIONS – PLEASE READ CAREFULLY
===================================================================================

To customize the WPM (Words Per Minute) and Accuracy ranges for typing sessions:

---------------------------------------------------
STEP 1: Update the configuration values
---------------------------------------------------

⬇️ DO NOT edit anything in this comment block. ⬇️

Scroll down and find the following lines in the code:

  AppConfig.get wpmValues
  AppConfig.get accuracies

You’ll see something like:

  const MIN_WPM = 100;
  const MAX_WPM = 125;

  const MIN_ACC = 95;
  const MAX_ACC = 99;

🎯 Change these `MIN_` and `MAX_` values to set your preferred WPM and accuracy ranges.

💾 After making changes, save the file:

  File > Save   (or press Ctrl+S / Cmd+S)

⚠️ Stick to updating the min/max values only — leave `SESSIONS` untouched.

---------------------------------------------------
STEP 2: Clear the session cache
---------------------------------------------------

WPM and accuracy values are cached in `localStorage` when sessions start.
To apply your new settings, you **must** reset the cache.

⚠️ Run the following code from the browser console
**on the Nitro Type race page**, not elsewhere.

How to do it:

1. Go to nitrotype.com/race.
2. Open Developer Tools:
   - Press F12 or Ctrl+Shift+I (Windows/Linux)
   - Or Cmd+Option+I (Mac)
3. Go to the “Console” tab.
4. Paste and run this code:

(() => {
  localStorage.setItem('typingWpmSessionCount', '1');
  localStorage.setItem('typingAccuracySessionCount', '1');
  localStorage.setItem('typingAccuracyBufferCount', '1');

  localStorage.removeItem('dynamicWpmValues');
  localStorage.removeItem('dynamicAccuracies');

  window.location.reload();
})();

✅ This clears cached values and resets session counters.
Your updated min/max settings will take effect after the page reloads.

---------------------------------------------------
💬 Additional Notes
---------------------------------------------------

✔️ All changes are local to your browser. Nitro Type won’t detect them —
unless you set unusually high or suspicious values (e.g. WPM 300+, or 100% accuracy every time).

👀 Keep the **Console tab open** while using this setup — important debug info (like current WPM, accuracy, and mode-switch instructions) is printed there.

🎮 Mode Descriptions:

Auto Mode: Automatically simulates and injects keystrokes at the configured typing speed without user intervention.
Manual Mode: Waits for a user trigger before injecting each keystroke, giving you step-by-step control over the typing.
Normal Mode: Disables all automation hacks and behaves like a standard, unmodified typing experience.

===================================================================================
*/

// ===== CORE CONSTANTS AND CONFIGURATION =====

/**
 * Application modes with state preservation
 */
const AppModes = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NORMAL: 'normal',
  STORAGE_KEY: 'typingAppMode'
};

/**
 * Application-wide constants for typing parameters, events, storage keys, and behavior factors
 */
const Constants = {
  TYPING: { CHARS_PER_WORD: 5, MS_PER_MINUTE: 60 * 1000 },
  EVENTS: {
    MODE_CHANGE: 'modeChange',
    METRICS_UPDATED: 'metricsUpdated',
    SESSION_COMPLETED: 'sessionCompleted',
    COUNTERS_INCREMENTED: 'countersIncremented',
    MANUAL_SESSION_COMPLETED: 'manualSessionCompleted',
    SESSION_COMPLETED_REFRESH: 'sessionCompletedRefresh'
  },
  STORAGE: {
    WPM_SESSION_COUNT: 'typingWpmSessionCount',
    ACCURACY_SESSION_COUNT: 'typingAccuracySessionCount',
    ACCURACY_BUFFER_COUNT: 'typingAccuracyBufferCount',
    DYNAMIC_WPM_VALUES: 'dynamicWpmValues',
    DYNAMIC_ACCURACIES: 'dynamicAccuracies'
  },
  BEHAVIOR: {
    MIN_DELAY_FACTOR: 0.4,
    MAX_DELAY_FACTOR: 1.8,
    WORD_BOUNDARY_MIN: 1.05,
    WORD_BOUNDARY_MAX: 0.1,
    COMMON_SEQ_MIN: 0.85,
    COMMON_SEQ_MAX: 0.05
  }
};

/**
 * Centralized application configuration with target WPM, accuracy values, and typing parameters
 */
const AppConfig = {
  // Helper to generate and cache arrays
  _generateDynamicArray(storageKey, count, min, max) {
    let arr = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!Array.isArray(arr) || arr.length !== count) {
      arr = Array.from(
        { length: count },
        () => Math.floor(Math.random() * (max - min + 1)) + min
      );
      localStorage.setItem(storageKey, JSON.stringify(arr));
    }
    return arr;
  },
  // Target WPM values for each session, generated once and saved to localStorage
  get wpmValues() {
    const SESSIONS = 10;
    const MIN_WPM  = 100;
    const MAX_WPM  = 125;
    return this._generateDynamicArray(
      Constants.STORAGE.DYNAMIC_WPM_VALUES,
      SESSIONS,
      MIN_WPM,
      MAX_WPM
    );
  },
  // Target accuracy values for each session, generated once and saved to localStorage
  get accuracies() {
    const SESSIONS = 10;
    const MIN_ACC  = 95;
    const MAX_ACC  = 99;
    return this._generateDynamicArray(
      Constants.STORAGE.DYNAMIC_ACCURACIES,
      SESSIONS,
      MIN_ACC,
      MAX_ACC
    );
  },

  // Accuracy buffer values that cycle
  accuracyBuffers: [0.7, 0.7, 0.7, 0.7, 0.7, 0, 0, 0, 0, 0],

  // Common sequences typed faster by humans
  commonSequences: ['th', 'he', 'in', 'er', 'an', 'en', 'ing', 'the', 'and'],

  // Word boundary characters
  wordBoundaries: [' ', '.', ',', ';', ':'],

  // Parameters controlling typing behavior
  typingParams: {
    allowedDeviation: 2,
    correctionStrength: 0.8,
    humanVariationStrength: 0.25,
    microPauseChance: 0.06,
    burstChance: 0.12,
    hesitationChance: 0.05,
    maxMicroPause: 200,
    feedbackInterval: 800,
    wpmSmoothingFactor: 0.6,
    overcompensationFactor: 1.5,
    speedBoost: 0.85,
    adaptationRate: 0.2,
    earlyBoostFactor: 0.7
  }
};

// ===== CORE UTILITY CLASSES =====

/**
 * Simple event system to enable communication between components
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  // Register an event listener
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }

  // Emit an event to all listeners
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  // Remove an event listener
  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }
}

/**
 * Centralized logging with consistent message formatting
 */
class Logger {
  // Shared logging method to standardize format
  static _log(prefix, message, context = '') {
    const contextPrefix = context ? `[${context}] ` : '';
    console.log(`${contextPrefix}${prefix}${message}`);
  }

  // Standard logging methods with different prefixes
  static log(message, context = '') {
    this._log('', message, context);
  }

  static info(message, context = '') {
    this._log('', message, context);
  }

  static warn(message, context = '') {
    this._log('⚠️ ', message, context);
  }

  static error(message, context = '') {
    console.error(`${context ? `[${context}] ` : ''}🔴 ${message}`);
  }

  static success(message, context = '') {
    this._log('✅ ', message, context);
  }

  // Helper for logging metrics in consistent format
  static logMetric(name, value, target = null, context = '') {
    this.info(`${name}: ${Utils.formatNumber(value)}${target !== null ? ` (Target: ${target})` : ''}`, context);
  }

  // Helper for logging session info in consistent format
  static logSessionInfo(config, context = '') {
    this.info(`Session info: WPM #${config.wpmSessionCount}/${AppConfig.wpmValues.length} (${config.targetWPM} WPM) | Accuracy #${config.accuracySessionCount}/${AppConfig.accuracies.length} (${config.targetAccuracy}%)`, context);
  }
}

/**
 * Handles localStorage operations to persist session data
 */
class StorageService {
  // Get value from localStorage with default fallback
  static get(key, defaultValue) {
    return parseInt(localStorage.getItem(key) || defaultValue.toString());
  }

  // Set value in localStorage
  static set(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Increments a counter in localStorage, cycling back to 1 when reaching max
   */
  static increment(key, maxValue, defaultValue = 0) {
    let count = this.get(key, defaultValue) + 1;
    if (count > maxValue) {
      Logger.info(`Completed full ${key} cycle. Resetting counter (was at ${count})`);
      count = 1;
    }
    this.set(key, count);
    return count;
  }
}

/**
 * General utilities for common operations
 */
class Utils {
  // Create a promise that resolves after specific time
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Analyze content to find the longest word and its position
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

  // Format number with specified decimal places
  static formatNumber(num, decimals = 2) {
    if (num === undefined || num === null) return "0.00";
    return num.toFixed(decimals);
  }

  // Apply random variation within a range
  static applyRandomVariation(base, minFactor, maxVariation) {
    return base * (minFactor + Math.random() * maxVariation);
  }

  // Check if string starts with any pattern from array
  static startsWithAny(str, patterns) {
    return patterns.some(pattern => str.startsWith(pattern));
  }

  // Check if character is in array
  static isInArray(char, array) {
    return array.includes(char);
  }

  // Keep value within bounds
  static boundValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Retry operation until success
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

  // Apply a pattern if condition is met, otherwise return null
  static applyPatternIf(condition, factorFn, baseFactor) {
    if (condition) return factorFn(baseFactor);
    return null;
  }
}

// ===== CONFIGURATION =====

/**
 * Manages configuration and session state
 */
class ConfigService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.loadConfig();
  }

  // Load configuration values from storage
  loadConfig() {
    const savedMode = localStorage.getItem(AppModes.STORAGE_KEY) || AppModes.AUTO;
    this._typingMode = savedMode;
    this._accuracySessionCount = StorageService.get(Constants.STORAGE.ACCURACY_SESSION_COUNT, 1);
    this._wpmSessionCount      = StorageService.get(Constants.STORAGE.WPM_SESSION_COUNT, 1);
    this._accuracyBufferCount  = StorageService.get(Constants.STORAGE.ACCURACY_BUFFER_COUNT, 1);
    this.typingParams          = AppConfig.typingParams;
  }

  // Getters and setters for the typing mode
  get typingMode() {
    return this._typingMode;
  }

  set typingMode(value) {
    this._typingMode = value;
    localStorage.setItem(AppModes.STORAGE_KEY, value);
    this.eventBus.emit(Constants.EVENTS.MODE_CHANGE, value);
  }

  // Helper methods to check specific modes
  get isAutoTypingMode() {
    return this._typingMode === AppModes.AUTO;
  }

  get isManualTypingMode() {
    return this._typingMode === AppModes.MANUAL;
  }

  get isNormalTypingMode() {
    return this._typingMode === AppModes.NORMAL;
  }

  // Return the target WPM for current session
  get targetWPM() {
    return AppConfig.wpmValues[this._wpmSessionCount - 1];
  }

  // Return the target accuracy for current session
  get targetAccuracy() {
    return AppConfig.accuracies[this._accuracySessionCount - 1];
  }

  // Return the target accuracy buffer for current session
  get targetAccuracyBuffer() {
    return AppConfig.accuracyBuffers[this._accuracyBufferCount - 1];
  }

  get wpmSessionCount() {
    return this._wpmSessionCount;
  }

  get accuracySessionCount() {
    return this._accuracySessionCount;
  }

  get accuracyBufferCount() {
    return this._accuracyBufferCount;
  }

  // Increment session counters and emit event
  incrementCounters() {
   // Skip incrementing counters in normal mode
   if (this.isNormalTypingMode) {
     return {
       wpmSession: this._wpmSessionCount,
       accuracySession: this._accuracySessionCount,
       accuracyBufferSession: this._accuracyBufferCount
     };
   }

  // Increment all counters with a helper method
     this._wpmSessionCount = this._incrementCounter(
       Constants.STORAGE.WPM_SESSION_COUNT,
       AppConfig.wpmValues.length
     );
     this._accuracySessionCount = this._incrementCounter(
       Constants.STORAGE.ACCURACY_SESSION_COUNT,
       AppConfig.accuracies.length
     );
     this._accuracyBufferCount = this._incrementCounter(
       Constants.STORAGE.ACCURACY_BUFFER_COUNT,
       AppConfig.accuracyBuffers.length
     );

    // If we've wrapped back to the first WPM session, clear cached arrays so they're regenerated
    if (this._wpmSessionCount === 1) {
      localStorage.removeItem(Constants.STORAGE.DYNAMIC_WPM_VALUES);
      localStorage.removeItem(Constants.STORAGE.DYNAMIC_ACCURACIES);
    }

    const counters = {
      wpmSession: this._wpmSessionCount,
      accuracySession: this._accuracySessionCount,
      accuracyBufferSession: this._accuracyBufferCount
    };

    this.eventBus.emit(Constants.EVENTS.COUNTERS_INCREMENTED, counters);
    return counters;
  }

   // Helper method to increment a counter
   _incrementCounter(key, maxValue) {
     return StorageService.increment(key, maxValue);
   }
}

// ===== DOM INTERFACE =====

/**
 * Handles DOM interactions and provides access to typing app node
 */
class DOMInterface {
  // Extract typing app node from the DOM
  getTypingAppNode() {
    try {
      return Object.values(document.querySelector("div.dash-copyContainer"))[1].children._owner.stateNode;
    } catch (error) {
      Logger.error(`Could not access typing app node: ${error}`, 'DOMInterface');
      return null;
    }
  }
}

// ===== METRICS TRACKING =====

/**
 * Tracks and calculates typing metrics and performance
 */
class MetricsService {
  constructor(configService, eventBus) {
    this.config = configService;
    this.eventBus = eventBus;
    this.reset();
  }

  // Reset all metrics to initial values
  reset() {
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.typingStartTime = null;
    this.charactersTyped = 0;
    this.lastFeedbackTime = 0;
    this.currentWPM = 0;
    this.smoothedWPM = 0;

    // Calculate target CPM and base delay
    this.targetCPM = this.config.targetWPM * Constants.TYPING.CHARS_PER_WORD;
    this.baseDelayMs = (Constants.TYPING.MS_PER_MINUTE) / this.targetCPM * this.config.typingParams.speedBoost;
    this.currentDelayMs = this.baseDelayMs;

    // Tracking variables
    this.typingPattern = [];
    this.lastKeystrokeTime = 0;
    this.cumulativeDeviation = 0;
    this.wpmHistory = [];
    this.adjustmentHistory = [];
    this.delayOffset = 0;

    // Startup phase tracking
    this.startupPhaseDone = false;
    this.startupCounter = 0;
    this.initialBoostApplied = false;

    this.sessionCompleted = false;
  }

  // Calculate current typing accuracy
  get currentAccuracy() {
    return this.totalKeystrokes > 0 ? (this.correctKeystrokes / this.totalKeystrokes) * 100 : 100;
  }

  // Update keystroke stats (correct or incorrect)
  updateKeystrokeStats(isCorrect) {
    this.totalKeystrokes++;
    if (isCorrect) this.correctKeystrokes++;
    this.emitMetricsUpdate();
  }

  // Track a correct keystroke
  trackCorrectKeystroke() {
    this.updateKeystrokeStats(true);
  }

  // Track an incorrect keystroke
  trackIncorrectKeystroke() {
    this.updateKeystrokeStats(false);
  }

  // Update WPM calculation based on typing progress
  updateWPM(newChars) {
    // Initialize start time on first update
    if (this.typingStartTime === null) {
      this.typingStartTime = Date.now();
      this.lastKeystrokeTime = Date.now();
      return 0;
    }

    this.charactersTyped += newChars;
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - this.typingStartTime) / Constants.TYPING.MS_PER_MINUTE;

    // Calculate WPM if enough time has passed
    if (elapsedMinutes > 0) {
      // Calculate instant WPM and apply smoothing
      const instantWPM = (this.charactersTyped / Constants.TYPING.CHARS_PER_WORD) / elapsedMinutes;
      this.smoothedWPM = this.smoothedWPM === 0
        ? instantWPM
        : this.smoothedWPM * this.config.typingParams.wpmSmoothingFactor +
          instantWPM * (1 - this.config.typingParams.wpmSmoothingFactor);

      this.currentWPM = this.smoothedWPM;
      this._updateWpmHistory(currentTime);
      return this.currentWPM;
    }

    return 0;
  }

  // Update WPM history and provide feedback
  _updateWpmHistory(currentTime) {
    // Maintain a rolling window of recent WPM values
    if (this.wpmHistory.length > 10) this.wpmHistory.shift();
    this.wpmHistory.push(this.currentWPM);

    // Provide periodic feedback on typing speed
    if (currentTime - this.lastFeedbackTime > this.config.typingParams.feedbackInterval) {
      Logger.logMetric('Current typing speed', this.currentWPM, this.config.targetWPM, 'WPM');
      this.lastFeedbackTime = currentTime;
      this._handleSpeedDeviation();
    }

    this._handleStartupPhase();
  }

  // Handle deviations from target WPM
  _handleSpeedDeviation() {
    const deviation = this.currentWPM - this.config.targetWPM;
    const deviationPercent = Utils.formatNumber(Math.abs(deviation) / this.config.targetWPM * 100, 1);

    if (Math.abs(deviation) > this.config.typingParams.allowedDeviation) {
      if (deviation < 0) {
        Logger.warn(`TOO SLOW: ${Utils.formatNumber(Math.abs(deviation), 1)} WPM below target (${deviationPercent}%) - Increasing typing speed...`, 'WPM');
      } else {
        Logger.warn(`TOO FAST: ${Utils.formatNumber(deviation, 1)} WPM above target (${deviationPercent}%) - Reducing typing speed...`, 'WPM');
      }

      this._adjustForConsistentDeviation(deviation);
    }
  }

  // Make adjustments for consistent deviations
  _adjustForConsistentDeviation(deviation) {
    if (this.wpmHistory.length >= 5) {
      const recentAvg = this.wpmHistory.slice(-5).reduce((sum, wpm) => sum + wpm, 0) / 5;
      const avgDeviation = recentAvg - this.config.targetWPM;

      if (Math.abs(avgDeviation) > this.config.typingParams.allowedDeviation) {
        const adjustmentFactor = -avgDeviation * 0.015;
        this.delayOffset += adjustmentFactor;
        Logger.info(`🔄 Making permanent base delay adjustment: ${Utils.formatNumber(adjustmentFactor, 3)}ms (cumulative: ${Utils.formatNumber(this.delayOffset, 3)}ms)`, 'WPM');
      }
    }
  }

  // Handle special adjustments during startup phase
  _handleStartupPhase() {
    if (!this.startupPhaseDone) {
      this.startupCounter++;

      // Apply initial boost if typing too slow
      if (this.startupCounter === 10 && !this.initialBoostApplied) {
        if (this.currentWPM < this.config.targetWPM * 0.9) {
          const boostFactor = 0.7; // 30% faster typing
          this.baseDelayMs *= boostFactor;
          this.currentDelayMs *= boostFactor;
          this.initialBoostApplied = true;
          Logger.info(`🚀 Initial speed boost applied! Base delay reduced to ${Utils.formatNumber(this.baseDelayMs)}ms`, 'WPM');
        }
      }

      // End startup phase after sufficient keystrokes
      if (this.startupCounter >= 30) {
        this.startupPhaseDone = true;
        Logger.info("Startup phase complete, switching to normal control mode", 'WPM');
      }
    }
  }

  // Emit metrics updates and log feedback
  emitMetricsUpdate() {
    // Log accuracy periodically
    if (this.totalKeystrokes % 20 === 0) {
       this._logAccuracyFeedback();
    }

    this.eventBus.emit(Constants.EVENTS.METRICS_UPDATED, {
      accuracy: this.currentAccuracy,
      wpm: this.currentWPM,
      keystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
      accuracyBuffer: this.config.targetAccuracyBuffer
    });
  }

    // Log accuracy feedback in consistent format
   _logAccuracyFeedback() {
     Logger.logMetric('Current accuracy', this.currentAccuracy, this.config.targetAccuracy, 'Accuracy');
     Logger.info(`(${this.correctKeystrokes}/${this.totalKeystrokes})`, 'Accuracy');
   }

  // Mark session as complete and emit event
  markSessionComplete() {
    if (this.sessionCompleted) return;
    this.sessionCompleted = true;

    this.eventBus.emit(Constants.EVENTS.SESSION_COMPLETED, {
      finalWPM: this.currentWPM || 0,
      finalAccuracy: this.currentAccuracy || 0
    });
  }

  // Log history of WPM adjustments
  logAdjustmentHistory() {
    Logger.info("WPM and delay adjustment history:", 'Metrics');
    this.adjustmentHistory.forEach((item, i) => {
      Logger.info(`${i}: WPM=${Utils.formatNumber(item.wpm, 1)}, Target=${item.targetWpm}, Delay=${Utils.formatNumber(item.adjustedDelay, 1)}ms`, 'Metrics');
    });
  }
}

// ===== TIMING CONTROLLER =====

/**
 * Controls timing between keystrokes to achieve target WPM
 */
class TimingController {
  constructor(metricsService, configService) {
    this.metrics = metricsService;
    this.config = configService;
  }

  /**
   * Calculate delay for next keystroke based on current metrics
   */
  calculateNextDelay(content, typedIndex) {
    const now = Date.now();
    let delay = this.metrics.baseDelayMs;

    // Apply early boost during startup
    if (!this.metrics.startupPhaseDone) {
      delay *= this.config.typingParams.earlyBoostFactor;
    }

    // Adjust based on current WPM
    if (this.metrics.charactersTyped > 5 && this.metrics.currentWPM > 0) {
      delay = this._calculateSpeedAdjustedDelay(delay);
    }

    // Apply human-like variations
    const humanFactor = this._applyHumanTypingPatterns(content, typedIndex);
    delay *= humanFactor;

    // Keep delay within reasonable bounds
    delay = Utils.boundValue(
      delay,
      this.metrics.baseDelayMs * Constants.BEHAVIOR.MIN_DELAY_FACTOR,
      this.metrics.baseDelayMs * Constants.BEHAVIOR.MAX_DELAY_FACTOR
    );

    this._updateDelayHistory(delay);

    this.metrics.currentDelayMs = delay;
    this.metrics.lastKeystrokeTime = now;

    return delay;
  }

  /**
   * Calculate delay adjustments based on WPM difference
   */
  _calculateSpeedAdjustedDelay(baseDelay) {
    const wpmDifference = this.metrics.currentWPM - this.config.targetWPM;
    let correctionFactor = wpmDifference * this.config.typingParams.correctionStrength;

    // Apply stronger correction when below target
    if (wpmDifference < 0) {
      correctionFactor *= this.config.typingParams.overcompensationFactor;
    }

    // Apply correction and offset
    let delay = baseDelay * (1 + correctionFactor / 10);
    delay += this.metrics.delayOffset;

    // Track cumulative deviation
    this.metrics.cumulativeDeviation += wpmDifference * this.config.typingParams.adaptationRate;

    return this._applyTrendCorrections(delay, wpmDifference);
  }

  /**
   * Apply corrections based on observed typing trends
   */
  _applyTrendCorrections(delay, wpmDifference) {
    // Apply cumulative corrections periodically
    if (this.metrics.charactersTyped % 3 === 0 && Math.abs(this.metrics.cumulativeDeviation) > 0.5) {
      delay *= (1 + this.metrics.cumulativeDeviation * 0.02);

      // Prevent overcompensation
      if (Math.abs(this.metrics.cumulativeDeviation) > 3) {
        this.metrics.cumulativeDeviation *= 0.7;
      }
    }

    // Analyze recent WPM trends
    if (this.metrics.wpmHistory.length >= 3) {
      const trend = this.metrics.wpmHistory.slice(-3);
      const avgTrend = trend.reduce((sum, wpm) => sum + wpm, 0) / trend.length;
      const trendDeviation = avgTrend - this.config.targetWPM;

      // If trend consistently deviates, apply stronger correction
      if (Math.abs(trendDeviation) > this.config.typingParams.allowedDeviation &&
          Math.sign(trendDeviation) === Math.sign(wpmDifference)) {
        delay *= (1 - (trendDeviation * 0.01));
      }
    }

    return delay;
  }

  /**
   * Apply human-like variations to typing rhythm
   */
  _applyHumanTypingPatterns(content, typedIndex) {
    // Base human factor with random variation
    let humanFactor = 0.9 + (Math.random() * 0.2);
    const pattern = Math.random();
    const params = this.config.typingParams;

    // Apply pattern-based variations (micro-pause, burst, hesitation)
    const microPause = Utils.applyPatternIf(
      pattern < params.microPauseChance,
      (factor) => factor * (1 + Math.random() * 0.3),
       humanFactor
    );
    if (microPause !== null) return microPause;

    const burst = Utils.applyPatternIf(
      pattern < params.microPauseChance + params.burstChance,
      (factor) => factor * (0.75 + Math.random() * 0.1),
       humanFactor
    );
    if (burst !== null) return burst;

    const hesitation = Utils.applyPatternIf(
      pattern < params.microPauseChance + params.burstChance + params.hesitationChance,
      (factor) => factor * (1.1 + Math.random() * 0.4),
       humanFactor
    );
    if (hesitation !== null) return hesitation;

    // Apply content-based variations (word boundaries, common sequences)
    const currentChar = content[typedIndex];
    const wordBoundary = Utils.applyPatternIf(
      Utils.isInArray(currentChar, AppConfig.wordBoundaries),
      (factor) => Utils.applyRandomVariation(
        factor,
        Constants.BEHAVIOR.WORD_BOUNDARY_MIN,
        Constants.BEHAVIOR.WORD_BOUNDARY_MAX
      ),
       humanFactor
    );
    if (wordBoundary !== null) return wordBoundary;

    let nextFewChars = content.slice(typedIndex, typedIndex + 3);
    const commonSeq = Utils.applyPatternIf(
      Utils.startsWithAny(nextFewChars, AppConfig.commonSequences),
      (factor) => Utils.applyRandomVariation(
        factor,
        Constants.BEHAVIOR.COMMON_SEQ_MIN,
        Constants.BEHAVIOR.COMMON_SEQ_MAX
      ),
       humanFactor
    );
    if (commonSeq !== null) return commonSeq;

    return humanFactor;
  }

  /**
   * Update delay history for analysis
   */
  _updateDelayHistory(delay) {
    // Maintain limited history of patterns
    if (this.metrics.typingPattern.length > 15) this.metrics.typingPattern.shift();
    this.metrics.typingPattern.push(delay);

    // Keep adjustment history for analysis
    if (this.metrics.adjustmentHistory.length > 10) this.metrics.adjustmentHistory.shift();
    this.metrics.adjustmentHistory.push({
      wpm: this.metrics.currentWPM,
      targetWpm: this.config.targetWPM,
      baseDelay: this.metrics.baseDelayMs,
      adjustedDelay: delay
    });
  }

  /**
   * Add random micro-pauses for human-like typing
   */
  async addMicroPause() {
    if (Math.random() < 0.07) {
      const pauseTime = Math.random() * this.config.typingParams.maxMicroPause;
      return Utils.delay(pauseTime);
    }
    return Promise.resolve();
  }
}

// ===== ACCURACY CONTROLLER =====

/**
 * Controls typing accuracy to match target percentage
 */
class AccuracyController {
  constructor(metricsService, configService) {
    this.metrics = metricsService;
    this.config = configService;

    // Use the cyclic buffer value
    this.accuracyBuffer = this.config.targetAccuracyBuffer;
  }

  /**
   * Get the current accuracy buffer for logging purposes
   */
  getBufferInfo() {
    return `+${Utils.formatNumber(this.accuracyBuffer, 2)}%`;
  }

  /**
   * Determine if an error should be made to maintain target accuracy
   */
  shouldMakeError() {
    // Don't make errors at the beginning
    if (this.metrics.totalKeystrokes === 0) return false;

    // Target accuracy with buffer
    const targetWithBuffer = this.config.targetAccuracy + this.accuracyBuffer;

    // Dynamic error probability based on current vs. target accuracy
    if (this.metrics.currentAccuracy > targetWithBuffer) {
      return true; // More likely to make errors when above target
    } else if (this.metrics.currentAccuracy < targetWithBuffer) {
      return false; // Less likely when below target
    }

    // When at target accuracy, error probability matches adjusted target
    return Math.random() > (targetWithBuffer / 100);
  }
}

// ===== KEYBOARD HANDLER =====

/**
 * Handles keyboard input and simulates keystrokes
 */
class KeyboardHandler {
  constructor(metricsService, configService, eventBus) {
    this.metrics = metricsService;
    this.config = configService;
    this.eventBus = eventBus;
  }

  /**
   * Process keystroke and update metrics
   */
  processKeystroke(appNode, makeCorrect) {
    // Update metrics based on keystroke correctness
    if (makeCorrect) {
      this.metrics.trackCorrectKeystroke();
      if (this.config.isAutoTypingMode) {
        this.metrics.updateWPM(1);
      }
    } else {
      this.metrics.trackIncorrectKeystroke();
    }

    // Simulate keystroke in the app
    appNode.handleKeyPress("character", new KeyboardEvent("keypress", {
      key: makeCorrect ? appNode.props.lessonContent[appNode.typedIndex] : "$"
    }));

    this._checkSessionComplete(appNode);
  }

  /**
   * Simulate pressing Enter key
   */
  simulateEnterKey(appNode) {
    appNode.handleKeyPress("character", new KeyboardEvent("keypress", { key: "\n" }));
    this._checkSessionComplete(appNode);
  }

  /**
   * Check if session is complete in manual mode
   */
  _checkSessionComplete(appNode) {
    if (!this.config.isAutoTypingMode && this._isSessionComplete(appNode)) {
      this.handleSessionCompletion();
    }
  }

  /**
   * Check if typing session is complete
   */
  _isSessionComplete(appNode) {
    return appNode.typedIndex >= appNode.props.lessonContent.length;
  }

  /**
   * Handle completion of a manual typing session
   */
  handleSessionCompletion() {
    this.metrics.markSessionComplete();
    this.eventBus.emit(Constants.EVENTS.MANUAL_SESSION_COMPLETED);
  }

  /**
   * Create key handlers for different typing modes
   */
  createKeyHandlers(appNode, originalKeyHandler, accuracyController, longestWord) {
    return {
      // Normal typing mode handler
      createNormalHandler: () => {
         return this._createNormalKeyHandler(appNode, originalKeyHandler, accuracyController, longestWord);
      },

      // Countdown phase handler
      createCountdownHandler: () => {
         return this._createCountdownKeyHandler(originalKeyHandler);
      }
    };
  }

  /**
   * Create normal typing mode key handler
   */
  _createNormalKeyHandler(appNode, originalKeyHandler, accuracyController, longestWord) {
    return (e, n) => {
      if ("character" === e) {
        if (appNode.typedIndex === longestWord.index) {
          this.simulateEnterKey(appNode);
          return;
        }
        this.processKeystroke(appNode, !accuracyController.shouldMakeError());
      } else if (n.key === "\n") {
        this.simulateEnterKey(appNode);
      } else {
        return originalKeyHandler(e, n);
      }
   };
 }

  /**
   * Create countdown phase key handler
   */
  _createCountdownKeyHandler(originalKeyHandler) {
    return (e, n) => {
     // Toggle modes with different keys: 'a' for auto, 'm' for manual, 'n' for normal
     if ("character" === e) {
       if (n.key === "a") {
         this.config.typingMode = AppModes.AUTO;
         Logger.info(`Mode switched to: AUTO typing`, 'KeyboardHandler');
         return;
       } else if (n.key === "m") {
         this.config.typingMode = AppModes.MANUAL;
         Logger.info(`Mode switched to: MANUAL typing`, 'KeyboardHandler');
         return;
       } else if (n.key === "n") {
         this.config.typingMode = AppModes.NORMAL;
         Logger.info(`Mode switched to: NORMAL typing (script disabled)`, 'KeyboardHandler');
         return;
       }
     }

      // Pass through specific keys
      if (n.key >= '1' && n.key <= '8' || n.key === 'Shift' || n.key === 'Control') {
        return originalKeyHandler(e, n);
      }
    };
  }
}

// ===== SESSION MANAGER =====

/**
 * Manages typing session lifecycle and transitions
 */
class SessionManager {
  constructor(configService, metricsService, eventBus) {
    this.config = configService;
    this.metrics = metricsService;
    this.eventBus = eventBus;
    this.isHandlingCompletion = false;

    // Subscribe to session completion event
    this.eventBus.on(Constants.EVENTS.SESSION_COMPLETED, data => {
      if (!this.isHandlingCompletion) {
        this.handleSessionCompleted(data);
      }
    });
  }

  /**
   * Handle session completion and report results
   */
  handleSessionCompleted(sessionData) {
    this.isHandlingCompletion = true;

    // Save target values before incrementing
    const currentTargetWPM = this.config.targetWPM;
    const currentTargetAccuracy = this.config.targetAccuracy;

    // Get final metrics
    const finalWPM = sessionData?.finalWPM || 0;
    const finalAccuracy = sessionData?.finalAccuracy || 0;

    // Log completion results
    this._logSessionResults(finalWPM, finalAccuracy, currentTargetWPM, currentTargetAccuracy);

    // Increment counters for next session
    const newCounters = this.config.incrementCounters();
    Logger.info(`New WPM session: ${newCounters.wpmSession}/${AppConfig.wpmValues.length} | New Accuracy session: ${newCounters.accuracySession}/${AppConfig.accuracies.length} | New Buffer session: ${newCounters.accuracyBufferSession}/${AppConfig.accuracyBuffers.length}`, 'SessionManager');

    // Log additional metrics in auto mode
    if (this.config.isAutoTypingMode) {
      this.metrics.logAdjustmentHistory();
    }

    Logger.info("Waiting 4 seconds before refreshing page...", 'SessionManager');

    // Emit refresh notification event
    this.eventBus.emit(Constants.EVENTS.SESSION_COMPLETED_REFRESH, {
      isAutoMode: this.config.isAutoTypingMode,
      isManualMode: this.config.isManualTypingMode,
      isNormalMode: this.config.isNormalTypingMode,
      nextWpmSession: newCounters.wpmSession,
      nextAccuracySession: newCounters.accuracySession,
      nextBufferSession: newCounters.accuracyBufferSession
    });

    // Refresh page after delay
    setTimeout(() => window.location.reload(), 4000);
  }

  /**
   * Log session completion results
   */
  _logSessionResults(finalWPM, finalAccuracy, targetWPM, targetAccuracy) {
    if (this.config.isAutoTypingMode) {
      Logger.success("Auto-typing completed!", 'SessionManager');
      Logger.logMetric('Final WPM', finalWPM, targetWPM, 'SessionManager');
    } else {
      Logger.success("Manual typing session completed!", 'SessionManager');
    }

    Logger.logMetric('Final accuracy', finalAccuracy, targetAccuracy, 'SessionManager');
  }
}

// ===== AUTO-TYPER =====

/**
 * Main controller for auto-typing functionality
 */
class AutoTyper {
  constructor(services) {
    this.dom = services.dom;
    this.config = services.config;
    this.metrics = services.metrics;
    this.timingController = services.timingController;
    this.accuracyController = services.accuracyController;
    this.keyboardHandler = services.keyboardHandler;
    this.eventBus = services.eventBus;
    this.sessionManager = services.sessionManager;
  }

  /**
   * Initialize auto-typer and wait for page to load
   */
  async init() {
    Logger.info("Waiting for page to fully load...", 'AutoTyper');

    // Retry initialization until typing app is ready
    await Utils.retryUntilSuccess(() => {
      const result = this.initTypingScript();
      if (result) {
        Logger.info("Script is now running!", 'AutoTyper');
      }
      return result;
    }, 500);
  }

  /**
   * Set up typing script once page is loaded
   */
  initTypingScript() {
    try {
      this.appNode = this.dom.getTypingAppNode();
      if (!this.appNode) return false;

      // Get content and analyze
      const content = this.appNode.props.lessonContent;
      this.longestWord = Utils.getLongestWord(content);
      this.originalKeyHandler = this.appNode.input.keyHandler;

      // Log setup information
      Logger.info("Script successfully loaded", 'AutoTyper');
      Logger.logSessionInfo(this.config, 'AutoTyper');
      Logger.info(`Accuracy target buffer: ${this.accuracyController.getBufferInfo()} (Session ${this.config.accuracyBufferCount}/${AppConfig.accuracyBuffers.length})`, 'AutoTyper');
      Logger.info(`Longest word detected: '${this.longestWord.word}' at position ${this.longestWord.index}`, 'AutoTyper');
      let modeDisplay = "UNKNOWN";
      if (this.config.isAutoTypingMode) modeDisplay = "AUTO";
      else if (this.config.isManualTypingMode) modeDisplay = "MANUAL";
      else if (this.config.isNormalTypingMode) modeDisplay = "NORMAL (script disabled)";
      Logger.info(`Mode: ${modeDisplay} typing`, 'AutoTyper');

      this.startTypingSession();
      return true;
    } catch (error) {
      Logger.info("Content not ready yet, retrying...", 'AutoTyper');
      return false;
    }
  }

  /**
   * Start typing session with countdown and mode selection
   */
  async startTypingSession() {
    // Set up key handlers
    const keyHandlers = this.keyboardHandler.createKeyHandlers(
      this.appNode,
      this.originalKeyHandler,
      this.accuracyController,
      this.longestWord
    );

    // Start with countdown handler for initial setup
    this.appNode.input.keyHandler = keyHandlers.createCountdownHandler();

    Logger.info("Press: 'a' for AUTO typing, 'm' for MANUAL typing, 'n' for NORMAL typing", 'AutoTyper');
    Logger.info("Countdown started. Auto-typing will begin in 4 seconds...", 'AutoTyper');

    await Utils.delay(4000);

    // If in normal mode, use the original key handler and return
    if (this.config.isNormalTypingMode) {
      Logger.info("Starting in NORMAL mode. Script disabled.", 'AutoTyper');
      this.appNode.input.keyHandler = this.originalKeyHandler;
      return;
    }

    // Switch to normal typing handler after countdown
    this.appNode.input.keyHandler = keyHandlers.createNormalHandler();

    // Start appropriate typing mode
    this._startTypingMode();
  }

  /**
   * Start appropriate typing mode with proper logging
   */
  _startTypingMode() {
    if (this.config.isAutoTypingMode) {
      Logger.info(`Starting auto-typing - Target WPM: ${this.config.targetWPM} (Session ${this.config.wpmSessionCount}/${AppConfig.wpmValues.length})`, 'AutoTyper');
      Logger.info(`Base delay between keystrokes: ${Utils.formatNumber(this.metrics.baseDelayMs)}ms (with ${this.config.typingParams.speedBoost.toFixed(2)}x speed boost)`, 'AutoTyper');
      this._runAutoTyper();
    } else if (this.config.isManualTypingMode) {
      Logger.info(`Starting manual typing - Target accuracy: ${this.config.targetAccuracy}% (Session ${this.config.accuracySessionCount}/${AppConfig.accuracies.length})`, 'AutoTyper');
    }
  }

  /**
   * Run auto-typing process character by character
   */
  async _runAutoTyper() {
    let currentIndex = 0;
    let isTyping = true;

    // Initialize WPM tracking
    this.metrics.typingStartTime = Date.now();
    this.metrics.lastKeystrokeTime = Date.now();

    /**
     * Type next character with appropriate timing
     */
    const typeNextCharacter = async () => {
      // Stop if typing is cancelled or complete
      if (!isTyping || !this.config.isAutoTypingMode || this.config.isNormalTypingMode || this._isSessionComplete(currentIndex)) {
        if (this._isSessionComplete(currentIndex)) {
          this.metrics.markSessionComplete();
        }
        return;
      }

      // Calculate delay for natural typing rhythm
      const delay = this.timingController.calculateNextDelay(
        this.appNode.props.lessonContent,
        this.appNode.typedIndex
      );

      // Add random micro-pauses for realism
      await this.timingController.addMicroPause();

      setTimeout(() => {
        if (!this.config.isAutoTypingMode || this.config.isNormalTypingMode) return;

        // Handle special case for longest word (press Enter)
        if (currentIndex === this.longestWord.index) {
          this.keyboardHandler.simulateEnterKey(this.appNode);
          currentIndex++;
          typeNextCharacter();
          return;
        }

        // Determine whether to make an error
        const makeError = this.accuracyController.shouldMakeError();
        this.keyboardHandler.processKeystroke(this.appNode, !makeError);

        // Only advance index on correct keystrokes
        if (!makeError) {
          currentIndex++;
        }

        // Continue typing next character
        typeNextCharacter();
      }, delay);
    };

    // Start the typing process
    typeNextCharacter();
  }

  /**
   * Check if typing session is complete
   */
  _isSessionComplete(currentIndex) {
    return currentIndex >= this.appNode.props.lessonContent.length;
  }
}

// ===== SERVICE CONTAINER =====

/**
 * Manages service instances and dependencies
 */
class ServiceContainer {
  constructor() {
    this.services = {};
  }

  /**
   * Register a service in the container
   */
  register(name, service) {
    this.services[name] = service;
    return this;
  }

  /**
   * Retrieve a service from the container
   */
  get(name) {
    return this.services[name];
  }

  /**
   * Create and register all services with dependencies
   */
  createServices() {
    // Create core services
    const eventBus = new EventBus();
    this.register('eventBus', eventBus);

    const configService = new ConfigService(eventBus);
    this.register('config', configService);

    const domService = new DOMInterface();
    this.register('dom', domService);

    // Create dependent services
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

    // Create main application controller
    const autoTyper = new AutoTyper(this.services);
    this.register('autoTyper', autoTyper);

    return this;
  }
}

// ===== MAIN APP =====

/**
 * Main application entry point
 */
class TypingApp {
  constructor() {
    // Create and initialize services
    this.container = new ServiceContainer().createServices();
    this.autoTyper = this.container.get('autoTyper');
  }

  /**
   * Start the typing application
   */
  async start() {
    await this.autoTyper.init();
  }
}

// ===== INITIALIZE THE APP =====

/**
 * Self-executing function to start the application
 */
(function() {
  const app = new TypingApp(); app.start();
})();