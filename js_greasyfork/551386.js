// ==UserScript==
// @name         Shadow Typer - NitroType (AutoTyper)
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  An Auto-Typer that goes SUPER fast,I am gonna warn you though, if you use this you MAY get banned... https://www.youtube.com/@Burning_ShadowsYT
// @author       ShadowBlazeYouTube
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @match        https://www.nitrotype.com/garage*

// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551386/Shadow%20Typer%20-%20NitroType%20%28AutoTyper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551386/Shadow%20Typer%20-%20NitroType%20%28AutoTyper%29.meta.js
// ==/UserScript==





const AppModes = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NORMAL: 'normal',
  STORAGE_KEY: 'typingAppMode'
};


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


const AppConfig = {

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

  get wpmValues() {
    const SESSIONS = 10;
    const MIN_WPM  = 200;
    const MAX_WPM  = 230;
    return this._generateDynamicArray(
      Constants.STORAGE.DYNAMIC_WPM_VALUES,
      SESSIONS,
      MIN_WPM,
      MAX_WPM
    );
  },

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


  accuracyBuffers: [0.7, 0.7, 0.7, 0.7, 0.7, 0, 0, 0, 0, 0],


  commonSequences: ['th', 'he', 'in', 'er', 'an', 'en', 'ing', 'the', 'and'],


  wordBoundaries: [' ', '.', ',', ';', ':'],


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
    speedBoost: 0.00,
    adaptationRate: 0.2,
    earlyBoostFactor: 0.7
  }
};


class EventBus {
  constructor() {
    this.events = {};
  }


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
  const app = new TypingApp();
  app.start();
})();

(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.membership = "gold";
        b.title = "Nitro Rich";
        b.money = b.money + 1000000;
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();

(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.membership = "gold";
        b.title = "Nitro Rich";
        b.money = b.money + 1000000;
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
