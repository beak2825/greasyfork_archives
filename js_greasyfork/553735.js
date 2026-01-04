// ==UserScript==
// @name         Userscript Logger Pro
// @name:ru      Userscript Logger Pro
// @namespace    https://greasyfork.org/ru/users/1092923-maxscorpy
// @version      1.1.0
// @description  Professional logging system for userscripts with history, colored labels and emoji support. Centralized logger for all your scripts.
// @description:ru Профессиональная система логирования для userscripts с поддержкой истории, цветных меток и эмодзи. Централизованный логгер для всех ваших скриптов.
// @author       MaxScorpy
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-start
// @homepageURL  https://greasyfork.org/ru/users/1092923-maxscorpy
// @supportURL   https://greasyfork.org/ru/users/1092923-maxscorpy
// ==/UserScript==

/**
 * Userscript Logger Pro
 *
 * Centralized logging system for all userscripts.
 * Provides unified interface for structured logging with support
 * for log levels, emoji, colored output and history.
 *
 * @example
 * // Usage in other scripts
 * const logManager = window.MaxScorpyLogger.createLogManager({
 *     scriptName: 'MY-SCRIPT',
 *     emoji: '🚀'
 * });
 * logManager.info('Script started');
 * logManager.success('Operation completed');
 * logManager.error('Error occurred', { details: error });
 */

(function() {
    'use strict';

    /**
     * Class for logging management
     * @class LogManager
     */
    class LogManager {
        /**
         * Creates LogManager instance
         * @param {Object} config - Logger configuration
         * @param {string} [config.scriptName='SCRIPT'] - Script name for display in logs
         * @param {string} [config.emoji='🔧'] - Emoji for script identification
         */
        constructor(config = {}) {
            this.scriptName = config.scriptName || 'SCRIPT';
            this.emoji = config.emoji || '🔧';
            this.logs = [];
            this.logStyles = {
                debug: { emoji: '🔍', color: '#9b59b6', label: 'DEBUG' },
                info: { emoji: 'ℹ️', color: '#3498db', label: 'INFO' },
                success: { emoji: '✅', color: '#2ecc71', label: 'SUCCESS' },
                warning: { emoji: '⚠️', color: '#f39c12', label: 'WARNING' },
                error: { emoji: '❌', color: '#e74c3c', label: 'ERROR' }
            };
        }

        /**
         * Internal logging method
         * @private
         * @param {string} level - Log level (debug, info, success, warning, error)
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details (object, error, etc.)
         */
        _log(level, message, details = null) {
            const style = this.logStyles[level] || this.logStyles.info;
            const logEntry = {
                timestamp: new Date(),
                level: level,
                message: message,
                details: details
            };
            this.logs.push(logEntry);

            const prefix = `${this.emoji} [${this.scriptName}] ${style.emoji} ${style.label}`;
            const timeStr = new Date().toLocaleTimeString();
            const consoleStyle = `color: ${style.color}; font-weight: bold;`;
            const consoleMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;

            consoleMethod(`%c${prefix} [${timeStr}] ${message}`, consoleStyle);
            if (details) consoleMethod('📋 Details:', details);
        }

        /**
         * Log debug information
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details
         */
        debug(message, details = null) {
            this._log('debug', message, details);
        }

        /**
         * Log information
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details
         */
        info(message, details = null) {
            this._log('info', message, details);
        }

        /**
         * Log successful operation
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details
         */
        success(message, details = null) {
            this._log('success', message, details);
        }

        /**
         * Log warning
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details
         */
        warning(message, details = null) {
            this._log('warning', message, details);
        }

        /**
         * Log error
         * @param {string} message - Message to log
         * @param {*} [details=null] - Additional details (usually Error object)
         */
        error(message, details = null) {
            this._log('error', message, details);
        }

        /**
         * Get history of all logs
         * @returns {Array} Array of all log entries
         */
        getHistory() {
            return [...this.logs];
        }

        /**
         * Clear log history
         */
        clearHistory() {
            this.logs = [];
        }

        /**
         * Get logs of specific level
         * @param {string} level - Log level to filter
         * @returns {Array} Filtered logs
         */
        getLogsByLevel(level) {
            return this.logs.filter(log => log.level === level);
        }

        /**
         * Export logs to JSON
         * @returns {string} JSON string with logs
         */
        exportLogs() {
            return JSON.stringify(this.logs, null, 2);
        }

        /**
         * Get formatted logs as human-readable text
         * @returns {string} Formatted logs with timestamps, levels, and details
         */
        getFormattedLogs() {
            if (this.logs.length === 0) {
                return 'No logs available.';
            }

            return this.logs.map(log => {
                const style = this.logStyles[log.level] || this.logStyles.info;
                const time = log.timestamp instanceof Date
                    ? log.timestamp.toLocaleTimeString()
                    : new Date(log.timestamp).toLocaleTimeString();

                let formatted = `[${time}] ${style.emoji} ${style.label}: ${log.message}`;

                if (log.details) {
                    const detailsStr = typeof log.details === 'object'
                        ? JSON.stringify(log.details, null, 2)
                        : String(log.details);
                    formatted += `\n  📋 Details: ${detailsStr}`;
                }

                return formatted;
            }).join('\n\n');
        }
    }

    // ============================================
    // GLOBAL API
    // ============================================

    /**
     * Global API for Userscript Logger Pro
     * @namespace MaxScorpyLogger
     */
    window.MaxScorpyLogger = {
        /**
         * Create new LogManager instance
         * @param {Object} config - Logger configuration
         * @param {string} [config.scriptName='SCRIPT'] - Script name
         * @param {string} [config.emoji='🔧'] - Script emoji
         * @returns {LogManager} LogManager instance
         */
        createLogManager: (config) => new LogManager(config),

        /**
         * Userscript Logger Pro version
         * @type {string}
         */
        version: '1.1.0',

        /**
         * Library information
         * @type {Object}
         */
        info: {
            name: 'Userscript Logger Pro',
            author: 'MaxScorpy',
            description: 'Professional logging system for userscripts',
            repository: 'https://greasyfork.org/ru/users/1092923-maxscorpy'
        }
    };

    // Log successful initialization
    const initLogger = new LogManager({ scriptName: 'LOGGER-PRO', emoji: '📚' });
    initLogger.success(`Userscript Logger Pro v${window.MaxScorpyLogger.version} initialized`);
    initLogger.info('Available via: window.MaxScorpyLogger.createLogManager(config)');

})();
