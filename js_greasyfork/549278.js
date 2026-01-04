// ==UserScript==
// @name            ModernMonkeyConfig Enhanced Security Edition v0.4.2
// @noframes
// @version         0.4.2
// @namespace       http://odyniec.net/
// @include        *
// @description     Enhanced Security Configuration Dialog - Complete Organized Version
// @require         https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.5/purify.min.js#sha384-qSFej5dZNviyoPgYJ5+Xk4bEbX8AYddxAHPuzs1aSgRiXxJ3qmyWNaPsRkpv/+x5
// ==/UserScript==

/**
 * ModernMonkeyConfig - Enhanced Security Configuration Dialog
 * Complete organized version with improved maintainability and performance
 */
class ModernMonkeyConfig {
    constructor(data) {
        this.version = '0.4.2';
        this.initializeProperties();
        this.validateAndInitialize(data);
    }

    // ===========================================
    // INITIALIZATION METHODS
    // ===========================================

    /**
     * Initialize all class properties
     */
    initializeProperties() {
        this.data = null;
        this.params = {};
        this.values = {};
        this.storageKey = '';
        
        // UI State
        this.displayed = false;
        this.openLayer = null;
        this.shadowRoot = null;
        this.container = null;
        this.iframeFallback = null;
        
        // Caching and performance
        this.elementCache = new Map();
        this.eventListeners = new Map();
        this.validationRules = new Map();
        
        // Security
        this.trustedPolicy = null;
    }

    /**
     * Validate configuration data and initialize the system
     */
    validateAndInitialize(data) {
        try {
            this.data = this.validateAndSanitizeConfig(data);
            this.params = this.data.parameters || {};
            
            this.setupSecurity();
            this.setupValidationRules();
            this.setupStorage();
            this.loadStoredValues();
            
            if (this.data.menuCommand) {
                this.registerMenuCommand();
            }
            
            this.setupPublicMethods();
            this.log('ModernMonkeyConfig initialized successfully');
            
        } catch (error) {
            this.log(`Initialization failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Setup security measures
     */
    setupSecurity() {
        this.createTrustedPolicy();
    }

    /**
     * Setup validation rules
     */
    setupValidationRules() {
        this.validationRules.set('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        this.validationRules.set('url', /^https?:\/\/.+/);
        this.validationRules.set('number', /^\d+$/);
        this.validationRules.set('float', /^\d*\.?\d+$/);
    }

    /**
     * Setup storage configuration
     */
    setupStorage() {
        this.storageKey = `_ModernMonkeyConfig_${this.data.title.replace(/[^a-zA-Z0-9]/g, '_')}_cfg`;
    }

    /**
     * Setup public methods with proper binding
     */
    setupPublicMethods() {
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.validate = this.validate.bind(this);
        this.reset = this.reset.bind(this);
    }

    // ===========================================
    // VALIDATION AND SANITIZATION
    // ===========================================

    /**
     * Validate and sanitize the main configuration object
     */
    validateAndSanitizeConfig(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Configuration data must be an object');
        }

        const sanitized = {
            title: this.sanitizeString(data.title) || 'Configuration',
            buttons: this.sanitizeButtons(data.buttons),
            menuCommand: Boolean(data.menuCommand),
            parameters: {},
            ...this.sanitizeDimensions(data),
            onSave: typeof data.onSave === 'function' ? data.onSave : null
        };

        // Sanitize parameters
        if (data.parameters && typeof data.parameters === 'object') {
            sanitized.parameters = this.sanitizeParameters(data.parameters);
        }

        return sanitized;
    }

    /**
     * Sanitize button configuration
     */
    sanitizeButtons(buttons) {
        const validButtons = ['save', 'reset', 'close', 'reload', 'homepage'];
        return Array.isArray(buttons) 
            ? buttons.filter(btn => validButtons.includes(btn))
            : ['save', 'reset', 'close', 'reload', 'homepage'];
    }

    /**
     * Sanitize dimension and styling properties
     */
    sanitizeDimensions(data) {
        return {
            shadowWidth: this.validateDimension(data.shadowWidth) || '600px',
            shadowHeight: this.validateDimension(data.shadowHeight) || '400px',
            iframeWidth: this.validateDimension(data.iframeWidth) || '600px',
            iframeHeight: this.validateDimension(data.iframeHeight) || '400px',
            shadowFontSize: this.validateFontSize(data.shadowFontSize) || '14px',
            shadowFontColor: this.validateColor(data.shadowFontColor) || '#000000',
            iframeFontSize: this.validateFontSize(data.iframeFontSize) || '14px',
            iframeFontColor: this.validateColor(data.iframeFontColor) || '#000000'
        };
    }

    /**
     * Sanitize all parameters
     */
    sanitizeParameters(parameters) {
        const sanitized = {};
        
        for (const [key, param] of Object.entries(parameters)) {
            if (this.isValidParameterKey(key) && this.isValidParameter(param)) {
                sanitized[key] = this.sanitizeParameter(param);
            } else {
                this.log(`Invalid parameter skipped: ${key}`, 'warn');
            }
        }
        
        return sanitized;
    }

    /**
     * Sanitize individual parameter
     */
    sanitizeParameter(param) {
        const sanitized = {
            type: param.type,
            label: this.sanitizeString(param.label),
            default: this.sanitizeValue(param.default, param.type),
            column: this.validateColumn(param.column)
        };

        // Type-specific sanitization
        switch (param.type) {
            case 'number':
            case 'range':
                Object.assign(sanitized, this.sanitizeNumericParam(param));
                break;
            case 'textarea':
                Object.assign(sanitized, this.sanitizeTextareaParam(param));
                break;
            case 'radio':
            case 'select':
                Object.assign(sanitized, this.sanitizeChoiceParam(param));
                break;
            case 'file':
                sanitized.accept = this.sanitizeString(param.accept) || '*/*';
                break;
            case 'custom':
                Object.assign(sanitized, this.sanitizeCustomParam(param));
                break;
        }

        // Common styling properties
        this.sanitizeStyleProperties(param, sanitized);

        return sanitized;
    }

    /**
     * Sanitize numeric parameter properties
     */
    sanitizeNumericParam(param) {
        return {
            min: this.sanitizeNumber(param.min),
            max: this.sanitizeNumber(param.max),
            step: this.sanitizeNumber(param.step) || 1
        };
    }

    /**
     * Sanitize textarea parameter properties
     */
    sanitizeTextareaParam(param) {
        return {
            rows: Math.max(1, Math.min(20, parseInt(param.rows) || 4)),
            cols: Math.max(10, Math.min(100, parseInt(param.cols) || 20))
        };
    }

    /**
     * Sanitize choice-based parameter properties
     */
    sanitizeChoiceParam(param) {
        const result = {
            multiple: Boolean(param.multiple)
        };
        
        if (param.choices && typeof param.choices === 'object') {
            result.choices = this.sanitizeChoices(param.choices);
        }
        
        return result;
    }

    /**
     * Sanitize custom parameter properties
     */
    sanitizeCustomParam(param) {
        const result = {
            html: this.sanitizeString(param.html)
        };
        
        if (typeof param.get === 'function') result.get = param.get;
        if (typeof param.set === 'function') result.set = param.set;
        
        return result;
    }

    /**
     * Sanitize styling properties
     */
    sanitizeStyleProperties(param, sanitized) {
        const styleProps = ['fontSize', 'fontColor', 'inputWidth', 'inputHeight', 
                           'checkboxWidth', 'checkboxHeight'];
        
        styleProps.forEach(prop => {
            if (param[prop]) {
                sanitized[prop] = this.sanitizeString(param[prop]);
            }
        });
    }

    // ===========================================
    // BASIC SANITIZATION UTILITIES
    // ===========================================

    /**
     * Sanitize string input
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.trim().substring(0, 1000);
    }

    /**
     * Sanitize numeric input
     */
    sanitizeNumber(num) {
        const parsed = parseFloat(num);
        return isNaN(parsed) ? undefined : parsed;
    }

    /**
     * Sanitize value based on parameter type
     */
    sanitizeValue(value, type) {
        const sanitizers = {
            'number': () => this.sanitizeNumber(value),
            'range': () => this.sanitizeNumber(value),
            'checkbox': () => Boolean(value),
            'text': () => this.sanitizeString(value),
            'color': () => this.sanitizeString(value),
            'textarea': () => this.sanitizeString(value),
            'select': () => Array.isArray(value) 
                ? value.map(v => this.sanitizeString(v))
                : this.sanitizeString(value)
        };

        return sanitizers[type] ? sanitizers[type]() : value;
    }

    /**
     * Sanitize choice options
     */
    sanitizeChoices(choices) {
        const sanitized = {};
        
        for (const [key, value] of Object.entries(choices)) {
            const cleanKey = this.sanitizeString(key);
            const cleanValue = this.sanitizeString(value);
            if (cleanKey && cleanValue) {
                sanitized[cleanKey] = cleanValue;
            }
        }
        
        return sanitized;
    }

    // ===========================================
    // VALIDATION UTILITIES
    // ===========================================

    /**
     * Validate parameter key format
     */
    isValidParameterKey(key) {
        return typeof key === 'string' && 
               key.length > 0 && 
               key.length <= 50 && 
               /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);
    }

    /**
     * Validate parameter structure
     */
    isValidParameter(param) {
        if (!param || typeof param !== 'object') return false;
        
        const validTypes = ['checkbox', 'number', 'text', 'color', 'textarea', 
                           'range', 'radio', 'file', 'button', 'select', 'group', 'custom'];
        
        return validTypes.includes(param.type);
    }

    /**
     * Validate column placement
     */
    validateColumn(column) {
        const validColumns = ['left', 'right', 'top', 'bottom', 
                             'left&top', 'right&top', 'left&bottom', 'right&bottom'];
        return validColumns.includes(column) ? column : null;
    }

    /**
     * Validate dimension strings
     */
    validateDimension(dimension) {
        if (typeof dimension !== 'string') return null;
        return /^\d+(px|em|rem|%|vh|vw)$/.test(dimension) ? dimension : null;
    }

    /**
     * Validate font size strings
     */
    validateFontSize(fontSize) {
        if (typeof fontSize !== 'string') return null;
        return /^\d+(px|em|rem)$/.test(fontSize) ? fontSize : null;
    }

    /**
     * Validate color strings
     */
    validateColor(color) {
        if (typeof color !== 'string') return null;
        return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;
    }

    // ===========================================
    // SECURITY AND TRUSTED TYPES
    // ===========================================

    /**
     * Create Trusted Types policy for secure HTML handling
     */
    createTrustedPolicy() {
        try {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                this.trustedPolicy = window.trustedTypes.createPolicy(`monkeyConfig-${Date.now()}`, {
                    createHTML: (input) => this.sanitizeHTML(input)
                });
            } else {
                this.trustedPolicy = {
                    createHTML: (input) => this.fallbackSanitize(input)
                };
            }
        } catch (error) {
            this.log(`Failed to create Trusted Types policy: ${error.message}`, 'error');
            this.trustedPolicy = {
                createHTML: (input) => this.fallbackSanitize(input)
            };
        }
    }

    /**
     * Sanitize HTML using DOMPurify or fallback
     */
    sanitizeHTML(input) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(input, {
                ALLOWED_TAGS: ['div', 'span', 'table', 'tr', 'td', 'input', 'textarea', 
                              'button', 'label', 'select', 'option', 'fieldset', 'legend',
                              'h1', 'br', 'svg', 'path', 'style'],
                ALLOWED_ATTR: ['type', 'name', 'id', 'class', 'style', 'for', 'value', 
                              'min', 'max', 'step', 'rows', 'cols', 'multiple', 'accept',
                              'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width',
                              'stroke-linecap', 'stroke-linejoin', 'd', 'colspan', 'checked'],
                ALLOW_DATA_ATTR: false,
                RETURN_TRUSTED_TYPE: true
            });
        } else {
            this.log('DOMPurify not available, using fallback sanitization', 'warn');
            return this.fallbackSanitize(input);
        }
    }

    /**
     * Fallback HTML sanitization
     */
    fallbackSanitize(input) {
        return String(input)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
            .replace(/on\w+\s*=\s*'[^']*'/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:/gi, '');
    }

    /**
     * Create trusted HTML content
     */
    createTrustedHTML(htmlString) {
        try {
            return this.trustedPolicy.createHTML(htmlString);
        } catch (error) {
            this.log(`Failed to create TrustedHTML: ${error.message}`, 'error');
            return '';
        }
    }

    // ===========================================
    // STORAGE AND VALUES MANAGEMENT
    // ===========================================

    /**
     * Load stored configuration values
     */
    loadStoredValues() {
        try {
            let storedValues = this.getStoredData();
            
            // Load UI settings
            this.loadUISettings(storedValues);
            
            // Load parameter values
            this.loadParameterValues(storedValues);
            
        } catch (error) {
            this.log(`Failed to load stored values: ${error.message}`, 'error');
            this.loadDefaultValues();
        }
    }

    /**
     * Get stored data from appropriate storage
     */
    getStoredData() {
        try {
            if (typeof GM_getValue !== 'undefined') {
                const stored = GM_getValue(this.storageKey);
                return stored ? JSON.parse(stored) : {};
            }
            return {};
        } catch {
            return {};
        }
    }

    /**
     * Load UI-related settings
     */
    loadUISettings(storedValues) {
        this.shadowWidth = this.validateDimension(storedValues.shadowWidth) || this.data.shadowWidth;
        this.shadowHeight = this.validateDimension(storedValues.shadowHeight) || this.data.shadowHeight;
        this.iframeWidth = this.validateDimension(storedValues.iframeWidth) || this.data.iframeWidth;
        this.iframeHeight = this.validateDimension(storedValues.iframeHeight) || this.data.iframeHeight;
        this.shadowFontSize = this.validateFontSize(storedValues.shadowFontSize) || this.data.shadowFontSize;
        this.shadowFontColor = this.validateColor(storedValues.shadowFontColor) || this.data.shadowFontColor;
        this.iframeFontSize = this.validateFontSize(storedValues.iframeFontSize) || this.data.iframeFontSize;
        this.iframeFontColor = this.validateColor(storedValues.iframeFontColor) || this.data.iframeFontColor;
    }

    /**
     * Load parameter values
     */
    loadParameterValues(storedValues) {
        for (const [key, param] of Object.entries(this.params)) {
            this.values[key] = storedValues[key] !== undefined 
                ? this.sanitizeValue(storedValues[key], param.type)
                : param.default;
        }
    }

    /**
     * Load default values for all parameters
     */
    loadDefaultValues() {
        for (const [key, param] of Object.entries(this.params)) {
            this.values[key] = param.default;
        }
    }

    /**
     * Save current configuration to storage
     */
    save() {
        try {
            const errors = this.validate();
            if (errors.length > 0) {
                alert('Validation errors:\n' + errors.join('\n'));
                return false;
            }

            const dataToSave = this.prepareDataForSaving();

            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(this.storageKey, JSON.stringify(dataToSave));
                this.log('Settings saved successfully');
            } else {
                this.log('GM_setValue not available, cannot save settings', 'warn');
                return false;
            }

            this.executeOnSaveCallback();
            return true;
            
        } catch (error) {
            this.log(`Failed to save settings: ${error.message}`, 'error');
            alert('Failed to save settings. Please check console for details.');
            return false;
        }
    }

    /**
     * Prepare data structure for saving
     */
    prepareDataForSaving() {
        return {
            ...this.values,
            shadowWidth: this.shadowWidth,
            shadowHeight: this.shadowHeight,
            iframeWidth: this.iframeWidth,
            iframeHeight: this.iframeHeight,
            shadowFontSize: this.shadowFontSize,
            shadowFontColor: this.shadowFontColor,
            iframeFontSize: this.iframeFontSize,
            iframeFontColor: this.iframeFontColor
        };
    }

    /**
     * Execute onSave callback if provided
     */
    executeOnSaveCallback() {
        if (this.data.onSave && typeof this.data.onSave === 'function') {
            try {
                this.data.onSave(this.values);
            } catch (error) {
                this.log(`Error in onSave callback: ${error.message}`, 'error');
            }
        }
    }

    // ===========================================
    // PUBLIC API METHODS
    // ===========================================

    /**
     * Get parameter value
     */
    get(name) {
        if (!this.params[name]) {
            this.log(`Parameter '${name}' does not exist`, 'warn');
            return undefined;
        }
        return this.values[name];
    }

    /**
     * Set parameter value
     */
    set(name, value) {
        try {
            if (!this.params[name]) {
                this.log(`Parameter '${name}' does not exist`, 'warn');
                return false;
            }
            
            const sanitizedValue = this.sanitizeValue(value, this.params[name].type);
            
            if (this.validateValue(name, sanitizedValue)) {
                this.values[name] = sanitizedValue;
                this.updateUI();
                return true;
            }
            
            return false;
        } catch (error) {
            this.log(`Failed to set value for ${name}: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Reset all values to defaults
     */
    reset() {
        try {
            for (const [key, param] of Object.entries(this.params)) {
                this.values[key] = param.default;
            }
            this.updateUI();
            this.log('Configuration reset to defaults');
        } catch (error) {
            this.log(`Failed to reset configuration: ${error.message}`, 'error');
        }
    }

    /**
     * Validate all current values
     */
    validate() {
        const errors = [];
        
        for (const [name, value] of Object.entries(this.values)) {
            if (!this.validateValue(name, value)) {
                errors.push(`Invalid value for parameter '${name}': ${value}`);
            }
        }
        
        return errors;
    }

    /**
     * Validate individual value
     */
    validateValue(name, value) {
        const param = this.params[name];
        if (!param) return false;

        const validators = {
            'number': (val, p) => this.validateNumericValue(val, p),
            'range': (val, p) => this.validateNumericValue(val, p),
            'text': (val, p) => this.validateTextValue(val, p),
            'checkbox': (val) => typeof val === 'boolean'
        };

        const validator = validators[param.type];
        return validator ? validator(value, param) : true;
    }

    /**
     * Validate numeric values
     */
    validateNumericValue(value, param) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (param.min !== undefined && num < param.min) return false;
        if (param.max !== undefined && num > param.max) return false;
        return true;
    }

    /**
     * Validate text values
     */
    validateTextValue(value, param) {
        if (typeof value !== 'string') return false;
        if (value.length > 1000) return false;
        
        if (param.validation && this.validationRules.has(param.validation)) {
            return this.validationRules.get(param.validation).test(value);
        }
        
        return true;
    }

    // ===========================================
    // UTILITY METHODS
    // ===========================================

    /**
     * Register menu command with userscript manager
     */
    registerMenuCommand() {
        try {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                const commandText = this.data.menuCommand === true 
                    ? this.data.title 
                    : String(this.data.menuCommand);
                
                GM_registerMenuCommand(commandText, () => this.open());
            }
        } catch (error) {
            this.log(`Failed to register menu command: ${error.message}`, 'error');
        }
    }

    /**
     * Log messages with timestamp and context
     */
    log(message, level = 'info') {
        try {
            const timestamp = new Date().toISOString();
            const formattedMessage = `[ModernMonkeyConfig v${this.version}] ${timestamp}: ${message}`;
            
            if (console[level]) {
                console[level](formattedMessage);
            } else {
                console.log(`[${level.toUpperCase()}] ${formattedMessage}`);
            }
        } catch (error) {
            console.error(`[ModernMonkeyConfig v${this.version}] Logging failed: ${error.message}`);
        }
    }

    /**
     * Escape HTML for safe display
     */
    escapeHtml(string) {
        if (string == null) return '';
        return String(string)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ===========================================
    // UI RENDERING AND MANAGEMENT
    // ===========================================

    /**
     * Open the configuration dialog
     */
    open() {
        if (this.displayed) {
            this.log('Configuration dialog is already open', 'warn');
            return;
        }

        try {
            this.createShadowDOM();
            this.displayed = true;
            this.log('Configuration dialog opened');
        } catch (error) {
            this.log(`Failed to open configuration dialog: ${error.message}`, 'error');
            this.createIframeFallback();
        }
    }

    /**
     * Close the configuration dialog
     */
    close() {
        try {
            if (!this.displayed) return;

            this.removeEventListeners();
            this.removeDOMElements();
            this.clearReferences();
            
            this.displayed = false;
            this.log('Configuration dialog closed');
        } catch (error) {
            this.log(`Error closing dialog: ${error.message}`, 'error');
        }
    }

    /**
     * Remove all event listeners
     */
    removeEventListeners() {
        for (const [event, handler] of this.eventListeners) {
            document.removeEventListener(event, handler);
        }
        this.eventListeners.clear();
    }

    /**
     * Remove DOM elements
     */
    removeDOMElements() {
        if (this.openLayer && this.openLayer.parentNode) {
            this.openLayer.parentNode.removeChild(this.openLayer);
        }
    }

    /**
     * Clear object references
     */
    clearReferences() {
        this.openLayer = null;
        this.shadowRoot = null;
        this.container = null;
        this.iframeFallback = null;
        this.elementCache.clear();
    }

    /**
     * Enhanced Shadow DOM creation with proper event isolation
     */
    createShadowDOM() {
        try {
            this.createOverlay();
            
            if (this.openLayer.attachShadow) {
                this.shadowRoot = this.openLayer.attachShadow({ mode: 'closed' });
                this.populateShadowDOM();
                
                // منع انتشار أحداث النقر من Shadow DOM إلى الخلفية
                const container = this.shadowRoot.querySelector('.__MonkeyConfig_container');
                if (container) {
                    container.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            } else {
                throw new Error('Shadow DOM not supported');
            }

            document.body.appendChild(this.openLayer);
            this.attachEventListeners();
            this.focusFirstElement();
            
        } catch (error) {
            this.log(`Failed to create Shadow DOM: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Create overlay element
     */
    createOverlay() {
        this.openLayer = document.createElement('div');
        this.openLayer.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: 2147483646 !important;
            backdrop-filter: blur(2px) !important;
        `;
    }

    /**
     * Populate Shadow DOM with content
     */
    populateShadowDOM() {
        const container = document.createElement('div');
        container.innerHTML = this.getCSS() + this.render();
        this.shadowRoot.appendChild(container);
        this.container = this.shadowRoot.querySelector('.__MonkeyConfig_container');
    }

    /**
     * Focus first interactive element
     */
    focusFirstElement() {
        setTimeout(() => {
            const firstInput = this.shadowRoot.querySelector('input, textarea, select, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    /**
     * Create iframe fallback when Shadow DOM fails
     */
    createIframeFallback() {
        try {
            this.log('Using iframe fallback', 'info');
            
            this.createOverlay();
            this.createIframe();
            this.populateIframe();
            
            document.body.appendChild(this.openLayer);
            
            // منع إغلاق النافذة عند النقر داخل الإطار
            this.preventIframeBackdropClose();
            
            this.attachEventListeners(this.iframeFallback.contentDocument);
            this.displayed = true;

        } catch (error) {
            this.log(`Failed to create iframe fallback: ${error.message}`, 'error');
            alert('Failed to open configuration dialog. Please check console for details.');
        }
    }

    /**
     * Create iframe element
     */
    createIframe() {
        this.iframeFallback = document.createElement('iframe');
        this.iframeFallback.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: ${this.iframeWidth} !important;
            height: ${this.iframeHeight} !important;
            border: none !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        `;
        
        this.openLayer.appendChild(this.iframeFallback);
    }

    /**
     * Populate iframe with content
     */
    populateIframe() {
        const iframeDoc = this.iframeFallback.contentDocument || this.iframeFallback.contentWindow.document;
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${this.escapeHtml(this.data.title)}</title>
                ${this.getIframeCSS()}
            </head>
            <body style="margin:0;padding:0;overflow:hidden;">
                ${this.render()}
            </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        this.container = iframeDoc.querySelector('.__MonkeyConfig_container');
    }

    /**
     * Get CSS adapted for iframe
     */
    getIframeCSS() {
        return this.getCSS()
            .replace(new RegExp(this.shadowFontSize, 'g'), this.iframeFontSize)
            .replace(new RegExp(this.shadowFontColor, 'g'), this.iframeFontColor);
    }

    /**
     * Prevent iframe content clicks from bubbling to backdrop
     */
    preventIframeBackdropClose() {
        if (this.iframeFallback) {
            // منع انتشار أحداث النقر من داخل الإطار إلى الخلفية
            this.iframeFallback.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // منع انتشار الأحداث من محتوى الإطار
            const iframeDoc = this.iframeFallback.contentDocument || this.iframeFallback.contentWindow.document;
            if (iframeDoc) {
                iframeDoc.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }
    }

    /**
     * Attach event listeners to the dialog
     */
    attachEventListeners(doc = null) {
        try {
            const context = doc || this.shadowRoot;
            if (!context) return;

            const container = context.querySelector('.__MonkeyConfig_container');
            if (!container) return;

            // Single event listener with delegation for better performance
            const handleEvent = (e) => {
                this.handleDialogEvent(e);
            };

            // Attach delegated event listeners
            container.addEventListener('click', handleEvent);
            container.addEventListener('change', handleEvent);
            container.addEventListener('input', handleEvent);

            // Backdrop click to close
            this.attachBackdropListener();
            
            // Keyboard shortcuts
            this.attachKeyboardListeners(doc);
            
            this.log('Event listeners attached');

        } catch (error) {
            this.log(`Failed to attach event listeners: ${error.message}`, 'error');
        }
    }

    /**
     * Handle dialog events with delegation
     */
    handleDialogEvent(e) {
        const target = e.target;
        const targetId = target.id;
        const targetName = target.name;

        // Button clicks
        if (targetId && targetId.startsWith('__MonkeyConfig_button_')) {
            e.preventDefault();
            const buttonType = targetId.replace('__MonkeyConfig_button_', '');
            this.handleButtonClick(buttonType);
            return;
        }

        // Form field changes
        if (targetName && this.params[targetName]) {
            this.handleFieldChange(targetName, target);
            return;
        }
    }

    /**
     * Attach backdrop click listener with improved logic
     */
    attachBackdropListener() {
        if (this.openLayer) {
            this.openLayer.addEventListener('click', (e) => {
                // التحقق من أن النقر كان على الخلفية المظلمة وليس على أي محتوى داخلي
                const clickTarget = e.target;
                const container = this.shadowRoot ? 
                    this.shadowRoot.querySelector('.__MonkeyConfig_container') : 
                    (this.iframeFallback ? this.iframeFallback : null);
                
                // إغلاق فقط عند النقر على الـ overlay نفسه، وليس على المحتوى
                if (clickTarget === this.openLayer) {
                    this.close();
                }
            });
        }
    }

    /**
     * Attach keyboard event listeners
     */
    attachKeyboardListeners(doc) {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.handleButtonClick('save');
            }
        };

        (doc || document).addEventListener('keydown', handleKeyDown);
        this.eventListeners.set('keydown', handleKeyDown);
    }

    /**
     * Handle button click events
     */
    handleButtonClick(buttonType) {
        try {
            const handlers = {
                'save': () => this.save(),
                'reset': () => this.handleReset(),
                'close': () => this.close(),
                'reload': () => this.handleReload(),
                'homepage': () => this.handleHomepage()
            };

            const handler = handlers[buttonType];
            if (handler) {
                handler();
            } else {
                this.log(`Unknown button type: ${buttonType}`, 'warn');
            }
        } catch (error) {
            this.log(`Error handling button click (${buttonType}): ${error.message}`, 'error');
        }
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            this.reset();
        }
    }

    /**
     * Handle reload button click
     */
    handleReload() {
        this.save();
        if (typeof GM_getValue !== 'undefined') {
            location.reload();
        } else {
            alert('Settings saved. Please refresh the page manually.');
        }
    }

    /**
     * Handle homepage button click
     */
    handleHomepage() {
        if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.homepage) {
            window.open(GM_info.script.homepage, '_blank');
        } else {
            alert('Homepage not available');
        }
    }

    /**
     * Handle form field changes
     */
    handleFieldChange(name, element) {
        try {
            const param = this.params[name];
            if (!param) return;

            const value = this.extractFieldValue(param, element);
            
            if (this.validateValue(name, value)) {
                this.values[name] = value;
                
                // Update UI for range sliders
                if (param.type === 'range') {
                    this.updateRangeDisplay(element, value);
                }
                
                this.log(`Field '${name}' updated to: ${value}`);
            } else {
                this.log(`Invalid value for field '${name}': ${value}`, 'warn');
                this.revertFieldValue(element, name);
            }

        } catch (error) {
            this.log(`Error handling field change (${name}): ${error.message}`, 'error');
        }
    }

    /**
     * Extract value from form field based on type
     */
    extractFieldValue(param, element) {
        switch (param.type) {
            case 'checkbox':
                return element.checked;
            case 'number':
            case 'range':
                const num = parseFloat(element.value);
                return isNaN(num) ? param.default : num;
            case 'select':
                return param.multiple 
                    ? Array.from(element.selectedOptions).map(option => option.value)
                    : element.value;
            case 'custom':
                return param.get && typeof param.get === 'function'
                    ? param.get(element)
                    : element.value;
            default:
                return element.value;
        }
    }

    /**
     * Update range slider display
     */
    updateRangeDisplay(element, value) {
        const rangeValue = element.parentNode.querySelector('.__MonkeyConfig_range_value');
        if (rangeValue) {
            rangeValue.textContent = value;
        }
    }

    /**
     * Revert field to previous valid value
     */
    revertFieldValue(element, name) {
        const previousValue = this.values[name];
        const param = this.params[name];
        
        switch (param.type) {
            case 'checkbox':
                element.checked = Boolean(previousValue);
                break;
            case 'select':
                element.value = previousValue;
                break;
            default:
                element.value = previousValue || '';
        }
    }

    /**
     * Update UI elements with current values
     */
    updateUI() {
        try {
            const context = this.shadowRoot || (this.iframeFallback && this.iframeFallback.contentDocument);
            if (!context) return;

            for (const [name, value] of Object.entries(this.values)) {
                const param = this.params[name];
                if (!param) continue;

                this.updateFieldValue(context, name, param, value);
            }

        } catch (error) {
            this.log(`Error updating UI: ${error.message}`, 'error');
        }
    }

    /**
     * Update individual field value in UI
     */
    updateFieldValue(context, name, param, value) {
        const element = context.querySelector(`[name="${name}"]`);
        if (!element) return;

        switch (param.type) {
            case 'checkbox':
                element.checked = Boolean(value);
                break;
            case 'select':
                this.updateSelectValue(element, param, value);
                break;
            case 'radio':
                this.updateRadioValue(context, name, value);
                break;
            case 'range':
                this.updateRangeValue(element, value);
                break;
            case 'custom':
                this.updateCustomValue(element, param, value);
                break;
            default:
                element.value = value || '';
        }
    }

    /**
     * Update select field value
     */
    updateSelectValue(element, param, value) {
        if (param.multiple && Array.isArray(value)) {
            Array.from(element.options).forEach(option => {
                option.selected = value.includes(option.value);
            });
        } else {
            element.value = value;
        }
    }

    /**
     * Update radio button value
     */
    updateRadioValue(context, name, value) {
        const radioButton = context.querySelector(`[name="${name}"][value="${value}"]`);
        if (radioButton) radioButton.checked = true;
    }

    /**
     * Update range slider value and display
     */
    updateRangeValue(element, value) {
        element.value = value;
        const rangeValue = element.parentNode.querySelector('.__MonkeyConfig_range_value');
        if (rangeValue) rangeValue.textContent = value;
    }

    /**
     * Update custom field value
     */
    updateCustomValue(element, param, value) {
        if (param.set && typeof param.set === 'function') {
            param.set(element, value);
        } else {
            element.value = value;
        }
    }

    // ===========================================
    // UI RENDERING IMPLEMENTATION
    // ===========================================

    /**
     * Render main HTML content
     */
    render() {
        try {
            const title = this.escapeHtml(this.data.title);
            
            let html = `
                <div class="__MonkeyConfig_container">
                    ${this.renderHeader(title)}
                    ${this.renderContent()}
                    ${this.renderFooter()}
                </div>`;
            
            return this.createTrustedHTML(html);
        } catch (error) {
            this.log(`Failed to render HTML: ${error.message}`, 'error');
            return this.createTrustedHTML('<div class="__MonkeyConfig_error">Error rendering configuration dialog</div>');
        }
    }

    /**
     * Render dialog header
     */
    renderHeader(title) {
        return `
            <div class="__MonkeyConfig_header">
                <h1>${title}</h1>
                <button type="button" id="__MonkeyConfig_button_close" class="__MonkeyConfig_close_btn" aria-label="Close">
                    ${this.getIcon('close')}
                </button>
            </div>`;
    }

    /**
     * Render main content area
     */
    renderContent() {
        return `
            <div class="__MonkeyConfig_content">
                <div class="__MonkeyConfig_sections">
                    ${this.renderSections()}
                </div>
            </div>`;
    }

    /**
     * Render all sections
     */
    renderSections() {
        let html = '';
        html += this.renderSection('top');
        html += this.renderColumns('top');
        html += this.renderColumns('middle');
        html += this.renderDefaultSection();
        html += this.renderColumns('bottom');
        html += this.renderSection('bottom');
        return html;
    }

    /**
     * Render positioned section
     */
    renderSection(position) {
        const items = Object.entries(this.params)
            .filter(([, param]) => param.column === position)
            .map(([key, param]) => this.renderField(key, param))
            .join('');
        
        return items ? `<div class="__MonkeyConfig_section_${position}">${items}</div>` : '';
    }

    /**
     * Render column layout
     */
    renderColumns(position) {
        const leftColumn = position !== 'middle' ? `left&${position}` : 'left';
        const rightColumn = position !== 'middle' ? `right&${position}` : 'right';
        
        const leftItems = this.getColumnItems(leftColumn);
        const rightItems = this.getColumnItems(rightColumn);
        
        if (!leftItems && !rightItems) return '';
        
        return `
            <div class="__MonkeyConfig_columns">
                <div class="__MonkeyConfig_left_column">${leftItems}</div>
                <div class="__MonkeyConfig_right_column">${rightItems}</div>
            </div>`;
    }

    /**
     * Get items for specific column
     */
    getColumnItems(column) {
        return Object.entries(this.params)
            .filter(([, param]) => param.column === column)
            .map(([key, param]) => this.renderField(key, param))
            .join('');
    }

    /**
     * Render default section (table layout)
     */
    renderDefaultSection() {
        const items = Object.entries(this.params)
            .filter(([, param]) => !param.column)
            .map(([key, param]) => this.renderField(key, param))
            .join('');
        
        return items ? `<table class="__MonkeyConfig_default_table">${items}</table>` : '';
    }

    /**
     * Render individual field
     */
    renderField(name, param) {
        const fieldId = `__MonkeyConfig_field_${this.escapeHtml(name)}`;
        const parentId = `__MonkeyConfig_parent_${this.escapeHtml(name)}`;
        
        const label = this.renderLabel(name, param, fieldId);
        const field = this.renderInput(name, param, fieldId);
        
        if (param.type === 'group') {
            return `<tr><td colspan="2">${field}</td></tr>`;
        }
        
        const isInline = ['checkbox', 'number', 'text'].includes(param.type);
        
        if (isInline) {
            return `
                <tr>
                    <td id="${parentId}" colspan="2" class="__MonkeyConfig_inline">
                        ${label}${field}
                    </td>
                </tr>`;
        }
        
        return `
            <tr>
                <td class="__MonkeyConfig_label_cell">${label}</td>
                <td id="${parentId}" class="__MonkeyConfig_field_cell">${field}</td>
            </tr>`;
    }

    /**
     * Render field label
     */
    renderLabel(name, param, fieldId) {
        const labelText = param.label || 
            name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
        
        const styles = this.getLabelStyles(param);
        const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';
        
        return `<label for="${fieldId}"${styleAttr}>${this.escapeHtml(labelText)}</label>`;
    }

    /**
     * Get label styling
     */
    getLabelStyles(param) {
        const styles = [];
        if (param.fontSize) styles.push(`font-size:${this.escapeHtml(param.fontSize)}`);
        if (param.fontColor) styles.push(`color:${this.escapeHtml(param.fontColor)}`);
        if (param.labelAlign) styles.push(`text-align:${this.escapeHtml(param.labelAlign)}`);
        return styles;
    }

    /**
     * Render input field based on type
     */
    renderInput(name, param, fieldId) {
        const inputName = this.escapeHtml(name);
        const value = this.values[name];
        
        const renderers = {
            'checkbox': () => this.renderCheckbox(fieldId, inputName, value),
            'number': () => this.renderNumber(fieldId, inputName, param, value),
            'text': () => this.renderText(fieldId, inputName, value),
            'color': () => this.renderColor(fieldId, inputName, value),
            'textarea': () => this.renderTextarea(fieldId, inputName, param, value),
            'range': () => this.renderRange(fieldId, inputName, param, value),
            'select': () => this.renderSelect(fieldId, inputName, param, value),
            'radio': () => this.renderRadio(fieldId, inputName, param, value),
            'file': () => this.renderFile(fieldId, inputName, param),
            'button': () => this.renderButton(fieldId, inputName, param),
            'group': () => this.renderGroup(fieldId, inputName, param),
            'custom': () => this.renderCustom(fieldId, inputName, param)
        };

        const renderer = renderers[param.type];
        return renderer ? renderer() : this.renderError(param.type);
    }

    /**
     * Render checkbox input
     */
    renderCheckbox(fieldId, inputName, value) {
        return `<input type="checkbox" id="${fieldId}" name="${inputName}" ${value ? 'checked' : ''}>`;
    }

    /**
     * Render number input
     */
    renderNumber(fieldId, inputName, param, value) {
        const attributes = [];
        if (param.min !== undefined) attributes.push(`min="${param.min}"`);
        if (param.max !== undefined) attributes.push(`max="${param.max}"`);
        if (param.step !== undefined) attributes.push(`step="${param.step}"`);
        
        return `<input type="number" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '')}" ${attributes.join(' ')}>`;
    }

    /**
     * Render text input
     */
    renderText(fieldId, inputName, value) {
        return `<input type="text" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '')}">`;
    }

    /**
     * Render color input
     */
    renderColor(fieldId, inputName, value) {
        return `<input type="color" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '#000000')}">`;
    }

    /**
     * Render textarea
     */
    renderTextarea(fieldId, inputName, param, value) {
        return `<textarea id="${fieldId}" name="${inputName}" 
                rows="${param.rows || 4}" cols="${param.cols || 20}">${this.escapeHtml(value || '')}</textarea>`;
    }

    /**
     * Render range input
     */
    renderRange(fieldId, inputName, param, value) {
        const currentValue = value || param.min || 0;
        return `<input type="range" id="${fieldId}" name="${inputName}" 
                value="${currentValue}" min="${param.min || 0}" max="${param.max || 100}" 
                step="${param.step || 1}">
                <span class="__MonkeyConfig_range_value">${currentValue}</span>`;
    }

    /**
     * Render select dropdown
     */
    renderSelect(fieldId, inputName, param, value) {
        const multipleAttr = param.multiple ? ' multiple' : '';
        const selectedValues = Array.isArray(value) ? value : [value];
        
        let options = '';
        if (param.choices) {
            for (const [key, label] of Object.entries(param.choices)) {
                const selected = selectedValues.includes(key) ? ' selected' : '';
                options += `<option value="${this.escapeHtml(key)}"${selected}>${this.escapeHtml(label)}</option>`;
            }
        }
        
        return `<select id="${fieldId}" name="${inputName}"${multipleAttr}>${options}</select>`;
    }

    /**
     * Render radio buttons
     */
    renderRadio(fieldId, inputName, param, value) {
        let radioHtml = '<div class="__MonkeyConfig_radio_group">';
        
        if (param.choices) {
            for (const [key, label] of Object.entries(param.choices)) {
                const checked = value === key ? ' checked' : '';
                const radioId = `${fieldId}_${key}`;
                radioHtml += `
                    <label class="__MonkeyConfig_radio_label">
                        <input type="radio" id="${radioId}" name="${inputName}" 
                               value="${this.escapeHtml(key)}"${checked}>
                        ${this.escapeHtml(label)}
                    </label>`;
            }
        }
        
        radioHtml += '</div>';
        return radioHtml;
    }

    /**
     * Render file input
     */
    renderFile(fieldId, inputName, param) {
        return `<input type="file" id="${fieldId}" name="${inputName}" 
                accept="${this.escapeHtml(param.accept || '*/*')}">`;
    }

    /**
     * Render button
     */
    renderButton(fieldId, inputName, param) {
        return `<button type="button" id="${fieldId}" name="${inputName}" 
                class="__MonkeyConfig_custom_button">${this.escapeHtml(param.label || 'Button')}</button>`;
    }

    /**
     * Render group fieldset
     */
    renderGroup(fieldId, inputName, param) {
        const legend = param.label ? `<legend>${this.escapeHtml(param.label)}</legend>` : '';
        return `<fieldset id="${fieldId}" class="__MonkeyConfig_group">${legend}</fieldset>`;
    }

    /**
     * Render custom field
     */
    renderCustom(fieldId, inputName, param) {
        const customHtml = param.html || '';
        return `<div id="${fieldId}" class="__MonkeyConfig_custom" data-name="${inputName}">${customHtml}</div>`;
    }

    /**
     * Render error message
     */
    renderError(type) {
        return `<span class="__MonkeyConfig_error">Unknown field type: ${this.escapeHtml(type)}</span>`;
    }

    /**
     * Render footer with buttons
     */
    renderFooter() {
        return `
            <div class="__MonkeyConfig_footer">
                ${this.renderButtons()}
            </div>`;
    }

    /**
     * Render action buttons
     */
    renderButtons() {
        let buttonsHtml = '';
        
        for (const buttonType of this.data.buttons) {
            if (buttonType === 'close') continue; // Close button is in header
            
            const buttonId = `__MonkeyConfig_button_${buttonType}`;
            const buttonText = this.getButtonText(buttonType);
            const icon = this.getIcon(buttonType);
            
            buttonsHtml += `
                <button type="button" id="${buttonId}" class="__MonkeyConfig_btn __MonkeyConfig_btn_${buttonType}">
                    ${icon}
                    <span>${buttonText}</span>
                </button>`;
        }
        
        return buttonsHtml;
    }

    /**
     * Get icon SVG for button type
     */
    getIcon(type) {
        const icons = {
            save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
            reset: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
            close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
            reload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
            homepage: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
        };
        return icons[type] || '';
    }

    /**
     * Get button text
     */
    getButtonText(buttonType) {
        const texts = {
            save: 'Save Without Reload',
            reset: 'Reset',
            reload: 'Save With Reload',
            homepage: 'Homepage'
        };
        return texts[buttonType] || buttonType;
    }

    /**
     * Get complete CSS styles
     */
    getCSS() {
        return `
            <style>
                .__MonkeyConfig_container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: ${this.shadowWidth};
                    max-width: 90vw;
                    height: ${this.shadowHeight};
                    max-height: 90vh;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: ${this.shadowFontSize};
                    color: ${this.shadowFontColor};
                    z-index: 2147483647;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: __MonkeyConfig_fadeIn 0.3s ease-out;
                }

                .__MonkeyConfig_header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 8px 8px 0 0;
                }

                .__MonkeyConfig_header h1 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                .__MonkeyConfig_close_btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .__MonkeyConfig_close_btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .__MonkeyConfig_content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .__MonkeyConfig_sections {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .__MonkeyConfig_columns {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .__MonkeyConfig_default_table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .__MonkeyConfig_default_table tr {
                    border-bottom: 1px solid #f0f0f0;
                }

                .__MonkeyConfig_default_table td {
                    padding: 12px 8px;
                    vertical-align: top;
                }

                .__MonkeyConfig_label_cell {
                    width: 30%;
                    font-weight: 500;
                    color: #333;
                }

                .__MonkeyConfig_field_cell {
                    width: 70%;
                }

                .__MonkeyConfig_inline {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .__MonkeyConfig_inline label {
                    margin: 0;
                    font-weight: 500;
                }

                /* Form Controls */
                .__MonkeyConfig_container input,
                .__MonkeyConfig_container textarea,
                .__MonkeyConfig_container select {
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: white;
                }

                .__MonkeyConfig_container input:focus,
                .__MonkeyConfig_container textarea:focus,
                .__MonkeyConfig_container select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .__MonkeyConfig_container input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    margin: 0;
                    cursor: pointer;
                }

                .__MonkeyConfig_container input[type="color"] {
                    width: 50px;
                    height: 40px;
                    padding: 2px;
                    cursor: pointer;
                }

                .__MonkeyConfig_container input[type="range"] {
                    width: 150px;
                    margin-right: 10px;
                }

                .__MonkeyConfig_range_value {
                    display: inline-block;
                    min-width: 40px;
                    text-align: center;
                    font-weight: 500;
                    color: #667eea;
                }

                .__MonkeyConfig_radio_group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .__MonkeyConfig_radio_label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 4px 0;
                }

                .__MonkeyConfig_radio_label input[type="radio"] {
                    margin: 0;
                }

                .__MonkeyConfig_group {
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    padding: 16px;
                    margin: 8px 0;
                }

                .__MonkeyConfig_group legend {
                    font-weight: 600;
                    color: #333;
                    padding: 0 8px;
                }

                .__MonkeyConfig_custom {
                    padding: 8px 0;
                }

                .__MonkeyConfig_custom_button {
                    background: #f8f9fa;
                    border: 2px solid #e1e5e9;
                    color: #333;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .__MonkeyConfig_custom_button:hover {
                    background: #e9ecef;
                    border-color: #667eea;
                }

                /* Footer */
                .__MonkeyConfig_footer {
                    padding: 16px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #e1e5e9;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                }

                .__MonkeyConfig_btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border: 2px solid transparent;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .__MonkeyConfig_btn_save {
                    background: #28a745;
                    color: white;
                    border-color: #28a745;
                }

                .__MonkeyConfig_btn_save:hover {
                    background: #218838;
                    transform: translateY(-1px);
                }

                .__MonkeyConfig_btn_reset {
                    background: #dc3545;
                    color: white;
                    border-color: #dc3545;
                }

                .__MonkeyConfig_btn_reset:hover {
                    background: #c82333;
                    transform: translateY(-1px);
                }

                .__MonkeyConfig_btn_reload {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }

                .__MonkeyConfig_btn_reload:hover {
                    background: #0056b3;
                    transform: translateY(-1px);
                }

                .__MonkeyConfig_btn_homepage {
                    background: #6c757d;
                    color: white;
                    border-color: #6c757d;
                }

                .__MonkeyConfig_btn_homepage:hover {
                    background: #545b62;
                    transform: translateY(-1px);
                }

                .__MonkeyConfig_error {
                    color: #dc3545;
                    font-weight: 500;
                    padding: 8px;
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 4px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .__MonkeyConfig_container {
                        width: 95vw;
                        height: 95vh;
                        margin: 0;
                        transform: translate(-50%, -50%);
                    }

                    .__MonkeyConfig_columns {
                        grid-template-columns: 1fr;
                    }

                    .__MonkeyConfig_footer {
                        flex-direction: column;
                    }

                    .__MonkeyConfig_btn {
                        justify-content: center;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .__MonkeyConfig_container {
                        background: #1a1a1a;
                        border-color: #444;
                        color: #e0e0e0;
                    }

                    .__MonkeyConfig_default_table tr {
                        border-color: #333;
                    }

                    .__MonkeyConfig_container input,
                    .__MonkeyConfig_container textarea,
                    .__MonkeyConfig_container select {
                        background: #2a2a2a;
                        border-color: #444;
                        color: #e0e0e0;
                    }

                    .__MonkeyConfig_footer {
                        background: #2a2a2a;
                        border-color: #444;
                    }

                    .__MonkeyConfig_group {
                        border-color: #444;
                    }

                    .__MonkeyConfig_custom_button {
                        background: #2a2a2a;
                        border-color: #444;
                        color: #e0e0e0;
                    }
                }

                /* Animation */
                @keyframes __MonkeyConfig_fadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            </style>`;
    }

    /**
     * Clean up all resources
     */
    destroy() {
        try {
            this.close();
            
            this.data = null;
            this.params = null;
            this.values = null;
            this.validationRules.clear();
            this.trustedPolicy = null;
            
            this.log('ModernMonkeyConfig destroyed');
        } catch (error) {
            this.log(`Error during cleanup: ${error.message}`, 'error');
        }
    }
}

// ===========================================
// FACTORY FUNCTION AND EXPORTS
// ===========================================

/**
 * Factory function for creating configuration dialogs
 */
function createMonkeyConfig(configData) {
    try {
        return new ModernMonkeyConfig(configData);
    } catch (error) {
        console.error(`[ModernMonkeyConfig] Failed to create configuration: ${error.message}`);
        return null;
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernMonkeyConfig;
} else if (typeof window !== 'undefined') {
    window.ModernMonkeyConfig = ModernMonkeyConfig;
    window.createMonkeyConfig = createMonkeyConfig;
}

/**
 * Example usage:
 * 
 * const config = createMonkeyConfig({
 *   title: 'My Script Configuration',
 *   menuCommand: true,
 *   buttons: ['save', 'reset', 'close', 'reload'],
 *   parameters: {
 *     enabled: {
 *       type: 'checkbox',
 *       label: 'Enable Script',
 *       default: true
 *     },
 *     maxItems: {
 *       type: 'number',
 *       label: 'Maximum Items',
 *       default: 10,
 *       min: 1,
 *       max: 100
 *     },
 *     theme: {
 *       type: 'select',
 *       label: 'Theme',
 *       choices: {
 *         'light': 'Light Theme',
 *         'dark': 'Dark Theme',
 *         'auto': 'Auto Detect'
 *       },
 *       default: 'auto'
 *     },
 *     opacity: {
 *       type: 'range',
 *       label: 'Opacity',
 *       min: 0.1,
 *       max: 1.0,
 *       step: 0.1,
 *       default: 0.8
 *     },
 *     description: {
 *       type: 'textarea',
 *       label: 'Description',
 *       rows: 4,
 *       cols: 40,
 *       default: ''
 *     }
 *   },
 *   onSave: (values) => {
 *     console.log('Settings saved:', values);
 *     // Apply your settings here
 *   }
 * });
 * 
 * // Usage:
 * config.open();                    // Open configuration dialog
 * const enabled = config.get('enabled');      // Get parameter value
 * config.set('enabled', false);               // Set parameter value
 * config.reset();                             // Reset to defaults
 * config.destroy();                          // Clean up resources
 */