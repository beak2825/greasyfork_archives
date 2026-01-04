// ==UserScript==
// @name            ModernMonkeyConfig Enhanced Security Edition v0.4.5
// @noframes
// @version         0.4.5
// @namespace       http://odyniec.net/
// @include         *
// @description     Enhanced Security Configuration Dialog - FULLY FIXED & OPTIMIZED VERSION
// @require         https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.5/purify.min.js#sha384-qSFej5dZNviyoPgYJ5+Xk4bEbX8AYddxAHPuzs1aSgRiXxJ3qmyWNaPsRkpv/+x5
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// ==/UserScript==

/**
 * ModernMonkeyConfig Enhanced Security Edition v0.4.5
 * مع تحسينات معالجة الأحداث والأداء
 */
class ModernMonkeyConfig {
  constructor(data) {
    this.version = '0.4.5';
    this.data = this.validateAndSanitizeConfig(data);
    this.params = this.data.parameters || this.data.params || {};
    this.values = {};
    this.storageKey = '';
    this.displayed = false;
    this.openLayer = null;
    this.shadowRoot = null;
    this.container = null;
    this.iframeFallback = null;
    this.elementCache = new Map();
    this.eventListeners = new Map();
    this.trustedPolicy = null;
    this.validationRules = new Map();
    this.abortController = null;
    this.isDestroyed = false;
    
    this.init();
  }

  log(message, level = 'info') {
    try {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[ModernMonkeyConfig v${this.version}] ${timestamp}: ${message}`;
      
      if (console[level]) {
        console[level](formattedMessage);
      } else {
        console.log(`[${level.toUpperCase()}] ${formattedMessage}`);
      }
    } catch (e) {
      console.error(`[ModernMonkeyConfig v${this.version}] Logging failed: ${e.message}`);
    }
  }

  validateAndSanitizeConfig(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Configuration data must be an object');
    }

    const sanitized = {
      title: this.sanitizeString(data.title) || 'Configuration',
      buttons: Array.isArray(data.buttons) ? data.buttons.filter(btn => 
        ['save', 'reset', 'close', 'reload', 'homepage'].includes(btn)
      ) : ['save', 'reset', 'close', 'reload', 'homepage'],
      menuCommand: Boolean(data.menuCommand),
      parameters: {},
      shadowWidth: this.validateDimension(data.shadowWidth) || '600px',
      shadowHeight: this.validateDimension(data.shadowHeight) || '400px',
      iframeWidth: this.validateDimension(data.iframeWidth) || '600px',
      iframeHeight: this.validateDimension(data.iframeHeight) || '400px',
      shadowFontSize: this.validateFontSize(data.shadowFontSize) || '14px',
      shadowFontColor: this.validateColor(data.shadowFontColor) || '#000000',
      iframeFontSize: this.validateFontSize(data.iframeFontSize) || '14px',
      iframeFontColor: this.validateColor(data.iframeFontColor) || '#000000',
      onSave: typeof data.onSave === 'function' ? data.onSave : null,
      homepage: typeof data.homepage === 'string' ? this.sanitizeString(data.homepage) : null
    };

    if (data.parameters && typeof data.parameters === 'object') {
      for (const [key, param] of Object.entries(data.parameters)) {
        if (this.isValidParameterKey(key) && this.isValidParameter(param)) {
          sanitized.parameters[key] = this.sanitizeParameter(param);
        } else {
          this.log(`Invalid parameter skipped: ${key}`, 'warn');
        }
      }
    }

    return sanitized;
  }

  isValidParameterKey(key) {
    return typeof key === 'string' && 
           key.length > 0 && 
           key.length <= 50 && 
           /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);
  }

  isValidParameter(param) {
    if (!param || typeof param !== 'object') return false;
    
    const validTypes = ['checkbox', 'number', 'text', 'color', 'textarea', 
                       'range', 'radio', 'file', 'button', 'select', 'group', 'custom'];
    
    return validTypes.includes(param.type);
  }

  sanitizeParameter(param) {
    const sanitized = {
      type: param.type,
      label: this.sanitizeString(param.label),
      default: this.sanitizeValue(param.default, param.type),
      column: this.validateColumn(param.column)
    };

    switch (param.type) {
      case 'number':
      case 'range':
        sanitized.min = this.sanitizeNumber(param.min);
        sanitized.max = this.sanitizeNumber(param.max);
        sanitized.step = this.sanitizeNumber(param.step) || 1;
        break;
      
      case 'textarea':
        sanitized.rows = Math.max(1, Math.min(20, parseInt(param.rows) || 4));
        sanitized.cols = Math.max(10, Math.min(100, parseInt(param.cols) || 20));
        break;
      
      case 'radio':
      case 'select':
        if (param.choices && typeof param.choices === 'object') {
          sanitized.choices = this.sanitizeChoices(param.choices);
        }
        sanitized.multiple = Boolean(param.multiple);
        break;
      
      case 'file':
        const safeMimeTypes = /^(image\/(jpeg|png|gif|webp)|application\/pdf|text\/(plain|csv))$/;
        const acceptValue = param.accept || '*/*';
        if (acceptValue !== '*/*' && !safeMimeTypes.test(acceptValue)) {
          this.log(`Potentially unsafe MIME type: ${acceptValue}`, 'warn');
        }
        sanitized.accept = this.sanitizeString(acceptValue);
        break;
      
      case 'custom':
        sanitized.html = param.html || '';
        if (typeof param.get === 'function') sanitized.get = param.get;
        if (typeof param.set === 'function') sanitized.set = param.set;
        break;
      
      case 'button':
        if (typeof param.onClick === 'function') sanitized.onClick = param.onClick;
        break;
    }

    ['fontSize', 'fontColor', 'inputWidth', 'inputHeight', 
     'checkboxWidth', 'checkboxHeight'].forEach(prop => {
      if (param[prop]) {
        sanitized[prop] = this.sanitizeString(param[prop]);
      }
    });

    if (param.validation) {
      sanitized.validation = param.validation;
    }

    return sanitized;
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().substring(0, 1000);
  }

  sanitizeNumber(num) {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? undefined : parsed;
  }

  sanitizeValue(value, type) {
    switch (type) {
      case 'number':
      case 'range':
        return this.sanitizeNumber(value);
      case 'checkbox':
        return Boolean(value);
      case 'text':
      case 'color':
      case 'textarea':
        return this.sanitizeString(value);
      case 'select':
        return Array.isArray(value) ? 
          value.map(v => this.sanitizeString(v)) : 
          this.sanitizeString(value);
      default:
        return value;
    }
  }

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

  validateColumn(column) {
    const validColumns = ['left', 'right', 'top', 'bottom', 
                         'left&top', 'right&top', 'left&bottom', 'right&bottom'];
    return validColumns.includes(column) ? column : null;
  }

  validateDimension(dimension) {
    if (typeof dimension !== 'string') return null;
    return /^\d+(px|em|rem|%|vh|vw)$/.test(dimension) ? dimension : null;
  }

  validateFontSize(fontSize) {
    if (typeof fontSize !== 'string') return null;
    return /^\d+(px|em|rem)$/.test(fontSize) ? fontSize : null;
  }

  validateColor(color) {
    if (typeof color !== 'string') return null;
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;
  }

  createTrustedPolicy() {
    try {
      if (window.trustedTypes && window.trustedTypes.createPolicy) {
        this.trustedPolicy = window.trustedTypes.createPolicy(`monkeyConfig-${Date.now()}`, {
          createHTML: (input) => {
            if (typeof DOMPurify === 'undefined') {
              this.log('DOMPurify not available, using fallback sanitization', 'warn');
              return this.fallbackSanitize(input);
            }
            
            return DOMPurify.sanitize(input, {
              ALLOWED_TAGS: ['div', 'span', 'table', 'tr', 'td', 'input', 'textarea', 
                           'button', 'label', 'select', 'option', 'fieldset', 'legend',
                           'h1', 'br', 'svg', 'path'],
              ALLOWED_ATTR: ['type', 'name', 'id', 'class', 'style', 'for', 'value', 
                           'min', 'max', 'step', 'rows', 'cols', 'multiple', 'accept',
                           'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width',
                           'stroke-linecap', 'stroke-linejoin', 'd', 'colspan', 'checked',
                           'aria-label', 'data-name'],
              ALLOW_DATA_ATTR: false,
              SANITIZE_DOM: true,
              SAFE_FOR_TEMPLATES: true,
              WHOLE_DOCUMENT: false,
              FORBID_TAGS: ['style', 'script'],
              FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus']
            });
          }
        });
      } else {
        this.trustedPolicy = {
          createHTML: (input) => this.fallbackSanitize(input)
        };
      }
    } catch (e) {
      this.log(`Failed to create Trusted Types policy: ${e.message}`, 'error');
      this.trustedPolicy = {
        createHTML: (input) => this.fallbackSanitize(input)
      };
    }
  }

  fallbackSanitize(input) {
    return String(input)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:text\/html/gi, '');
  }

  createTrustedHTML(htmlString) {
    try {
      return this.trustedPolicy.createHTML(htmlString);
    } catch (e) {
      this.log(`Failed to create TrustedHTML: ${e.message}`, 'error');
      return '';
    }
  }

  init() {
    try {
      this.createTrustedPolicy();
      this.setupValidationRules();
      
      this.storageKey = `_ModernMonkeyConfig_${this.data.title.replace(/[^a-zA-Z0-9]/g, '_')}_cfg`;
      
      this.loadStoredValues();
      
      if (this.data.menuCommand) {
        this.registerMenuCommand();
      }
      
      this.setupPublicMethods();
      
      this.log('ModernMonkeyConfig initialized successfully');
    } catch (e) {
      this.log(`Initialization failed: ${e.message}`, 'error');
      throw e;
    }
  }

  setupValidationRules() {
    this.validationRules.set('email', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    this.validationRules.set('url', /^https?:\/\/.+/);
    this.validationRules.set('number', /^\d+$/);
    this.validationRules.set('float', /^\d*\.?\d+$/);
    this.validationRules.set('alphanumeric', /^[a-zA-Z0-9]+$/);
    this.validationRules.set('hex', /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i);
  }

  loadStoredValues() {
    try {
      let storedValues = {};
      
      if (typeof GM_getValue !== 'undefined') {
        const stored = GM_getValue(this.storageKey);
        if (stored) {
          try {
            storedValues = JSON.parse(stored);
            if (typeof storedValues !== 'object' || storedValues === null) {
              throw new Error('Invalid stored data format');
            }
          } catch (parseError) {
            this.log(`Failed to parse stored values: ${parseError.message}`, 'error');
            storedValues = {};
          }
        }
      }
      
      this.shadowWidth = this.validateDimension(storedValues.shadowWidth) || this.data.shadowWidth;
      this.shadowHeight = this.validateDimension(storedValues.shadowHeight) || this.data.shadowHeight;
      this.iframeWidth = this.validateDimension(storedValues.iframeWidth) || this.data.iframeWidth;
      this.iframeHeight = this.validateDimension(storedValues.iframeHeight) || this.data.iframeHeight;
      this.shadowFontSize = this.validateFontSize(storedValues.shadowFontSize) || this.data.shadowFontSize;
      this.shadowFontColor = this.validateColor(storedValues.shadowFontColor) || this.data.shadowFontColor;
      this.iframeFontSize = this.validateFontSize(storedValues.iframeFontSize) || this.data.iframeFontSize;
      this.iframeFontColor = this.validateColor(storedValues.iframeFontColor) || this.data.iframeFontColor;
      
      for (const [key, param] of Object.entries(this.params)) {
        this.values[key] = storedValues[key] !== undefined ? 
          this.sanitizeValue(storedValues[key], param.type) : 
          param.default;
      }
      
    } catch (e) {
      this.log(`Failed to load stored values: ${e.message}`, 'error');
      for (const [key, param] of Object.entries(this.params)) {
        this.values[key] = param.default;
      }
    }
  }

  saveStoredValues() {
    try {
      const dataToSave = {
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
      
      const serialized = JSON.stringify(dataToSave);
      const dataSize = serialized.length;
      
      if (dataSize > 4.5 * 1024 * 1024) {
        this.log('Data size exceeds safe storage limit (4.5MB)', 'error');
        alert('Configuration data is too large to save.');
        return false;
      }
      
      if (typeof GM_setValue !== 'undefined') {
        GM_setValue(this.storageKey, serialized);
      } else {
        localStorage.setItem(this.storageKey, serialized);
      }
      
      this.log(`Configuration saved successfully (${(dataSize / 1024).toFixed(2)} KB)`);
      return true;
      
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.log('Storage quota exceeded', 'error');
        alert('Failed to save: Storage quota exceeded.');
      } else {
        this.log(`Failed to save: ${e.message}`, 'error');
        alert('Failed to save configuration.');
      }
      return false;
    }
  }

  registerMenuCommand() {
    try {
      if (typeof GM_registerMenuCommand !== 'undefined') {
        const commandText = this.data.menuCommand === true ? 
          this.data.title : 
          String(this.data.menuCommand);
        
        GM_registerMenuCommand(commandText, () => this.open());
      }
    } catch (e) {
      this.log(`Failed to register menu command: ${e.message}`, 'error');
    }
  }

  setupPublicMethods() {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.validate = this.validate.bind(this);
    this.reset = this.reset.bind(this);
    this.save = this.save.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  get(name) {
    if (this.isDestroyed) {
      this.log('Cannot get value: instance is destroyed', 'warn');
      return undefined;
    }
    
    if (!this.params[name]) {
      this.log(`Parameter '${name}' does not exist`, 'warn');
      return undefined;
    }
    return this.values[name];
  }

  set(name, value) {
    try {
      if (this.isDestroyed) {
        this.log('Cannot set value: instance is destroyed', 'warn');
        return false;
      }
      
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
    } catch (e) {
      this.log(`Failed to set value for ${name}: ${e.message}`, 'error');
      return false;
    }
  }

  validateValue(name, value) {
    const param = this.params[name];
    if (!param) return false;

    switch (param.type) {
      case 'number':
      case 'range':
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (param.min !== undefined && num < param.min) return false;
        if (param.max !== undefined && num > param.max) return false;
        return true;
      
      case 'text':
        if (param.validation && this.validationRules.has(param.validation)) {
          return this.validationRules.get(param.validation).test(value);
        }
        return typeof value === 'string' && value.length <= 1000;
      
      case 'checkbox':
        return typeof value === 'boolean';
      
      case 'color':
        return this.validateColor(value) !== null;
      
      default:
        return true;
    }
  }

  validate() {
    const errors = [];
    
    for (const [name, value] of Object.entries(this.values)) {
      if (!this.validateValue(name, value)) {
        errors.push(`Invalid value for parameter '${name}': ${value}`);
      }
    }
    
    return errors;
  }

  reset() {
    try {
      if (this.isDestroyed) {
        this.log('Cannot reset: instance is destroyed', 'warn');
        return;
      }
      
      for (const [key, param] of Object.entries(this.params)) {
        this.values[key] = param.default;
      }
      this.updateUI();
      this.log('Configuration reset to defaults');
    } catch (e) {
      this.log(`Failed to reset configuration: ${e.message}`, 'error');
    }
  }

  save(reload = false) {
    try {
      if (this.isDestroyed) {
        this.log('Cannot save: instance is destroyed', 'warn');
        return false;
      }
      
      const errors = this.validate();
      if (errors.length > 0) {
        this.log(`Validation errors: ${errors.join(', ')}`, 'error');
        alert('Please fix validation errors:\n' + errors.join('\n'));
        return false;
      }
      
      const saved = this.saveStoredValues();
      
      if (saved) {
        if (this.data.onSave) {
          try {
            this.data.onSave(this.values);
          } catch (e) {
            this.log(`onSave callback error: ${e.message}`, 'error');
          }
        }
        
        if (reload) {
          location.reload();
        } else {
          alert('Configuration saved successfully!');
        }
      }
      
      return saved;
    } catch (e) {
      this.log(`Failed to save: ${e.message}`, 'error');
      return false;
    }
  }

  updateUI() {
    if (!this.displayed || !this.container) return;
    
    try {
      const context = this.iframeFallback ? 
        (this.iframeFallback.contentDocument || this.iframeFallback.contentWindow.document) : 
        this.shadowRoot;
      
      if (!context) return;
      
      for (const [name, value] of Object.entries(this.values)) {
        const param = this.params[name];
        if (!param) continue;
        
        const fieldId = `__MonkeyConfig_field_${name}`;
        const element = context.querySelector(`#${fieldId}`);
        
        if (!element) continue;
        
        switch (param.type) {
          case 'checkbox':
            element.checked = Boolean(value);
            break;
          
          case 'number':
          case 'text':
          case 'color':
            element.value = value || '';
            break;
          
          case 'textarea':
            element.value = value || '';
            break;
          
          case 'range':
            element.value = value || param.min || 0;
            const rangeValue = element.parentNode.querySelector('.__MonkeyConfig_range_value');
            if (rangeValue) {
              rangeValue.textContent = value || param.min || 0;
            }
            break;
          
          case 'select':
            if (param.multiple && Array.isArray(value)) {
              Array.from(element.options).forEach(option => {
                option.selected = value.includes(option.value);
              });
            } else {
              element.value = value || '';
            }
            break;
          
          case 'radio':
            const radioButtons = context.querySelectorAll(`input[name="${name}"]`);
            radioButtons.forEach(radio => {
              radio.checked = radio.value === value;
            });
            break;
          
          case 'custom':
            if (param.set && typeof param.set === 'function') {
              try {
                param.set(element, value);
              } catch (e) {
                this.log(`Custom set function error for ${name}: ${e.message}`, 'error');
              }
            }
            break;
        }
      }
    } catch (e) {
      this.log(`Failed to update UI: ${e.message}`, 'error');
    }
  }

  escapeHtml(string) {
    if (string == null) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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

  getButtonText(buttonType) {
    const texts = {
      save: 'Save Without Reload',
      reset: 'Reset',
      reload: 'Save With Reload',
      homepage: 'Homepage'
    };
    return texts[buttonType] || buttonType;
  }

  render() {
    try {
      const title = this.escapeHtml(this.data.title);
      
      let html = `
        <div class="__MonkeyConfig_container">
          <div class="__MonkeyConfig_header">
            <h1>${title}</h1>
            <button type="button" id="__MonkeyConfig_button_close" class="__MonkeyConfig_close_btn" aria-label="Close">
              ${this.getIcon('close')}
            </button>
          </div>
          <div class="__MonkeyConfig_content">
            <div class="__MonkeyConfig_sections">`;
      
      html += this.renderSection('top');
      html += this.renderColumns('top');
      html += this.renderColumns('middle');
      html += this.renderDefaultSection();
      html += this.renderColumns('bottom');
      html += this.renderSection('bottom');
      
      html += `
            </div>
          </div>
          <div class="__MonkeyConfig_footer">
            ${this.renderButtons()}
          </div>
        </div>`;
      
      return this.createTrustedHTML(html);
    } catch (e) {
      this.log(`Failed to render HTML: ${e.message}`, 'error');
      return this.createTrustedHTML('<div class="__MonkeyConfig_error">Error rendering configuration dialog</div>');
    }
  }

  renderSection(position) {
    const items = Object.entries(this.params)
      .filter(([, param]) => param.column === position)
      .map(([key, param]) => this.renderField(key, param))
      .join('');
    
    return items ? `<div class="__MonkeyConfig_section_${position}">${items}</div>` : '';
  }

  renderColumns(position) {
    const leftColumn = position !== 'middle' ? `left&${position}` : 'left';
    const rightColumn = position !== 'middle' ? `right&${position}` : 'right';
    
    const leftItems = Object.entries(this.params)
      .filter(([, param]) => param.column === leftColumn)
      .map(([key, param]) => this.renderField(key, param))
      .join('');
    
    const rightItems = Object.entries(this.params)
      .filter(([, param]) => param.column === rightColumn)
      .map(([key, param]) => this.renderField(key, param))
      .join('');
    
    if (!leftItems && !rightItems) return '';
    
    return `
      <div class="__MonkeyConfig_columns">
        <div class="__MonkeyConfig_left_column">${leftItems}</div>
        <div class="__MonkeyConfig_right_column">${rightItems}</div>
      </div>`;
  }

  renderDefaultSection() {
    const items = Object.entries(this.params)
      .filter(([, param]) => !param.column)
      .map(([key, param]) => this.renderField(key, param))
      .join('');
    
    return items ? `<table class="__MonkeyConfig_default_table">${items}</table>` : '';
  }

  renderField(name, param) {
    const fieldId = `__MonkeyConfig_field_${this.escapeHtml(name)}`;
    const parentId = `__MonkeyConfig_parent_${this.escapeHtml(name)}`;
    
    const label = this.renderLabel(name, param, fieldId);
    const field = this.renderInput(name, param, fieldId);
    
    const isInline = ['checkbox', 'number', 'text'].includes(param.type);
    
    if (param.type === 'group') {
      return `<tr><td colspan="2">${field}</td></tr>`;
    }
    
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

  renderLabel(name, param, fieldId) {
    const labelText = param.label || 
      name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
    
    const styles = [];
    if (param.fontSize) styles.push(`font-size:${this.escapeHtml(param.fontSize)}`);
    if (param.fontColor) styles.push(`color:${this.escapeHtml(param.fontColor)}`);
    if (param.labelAlign) styles.push(`text-align:${this.escapeHtml(param.labelAlign)}`);
    
    const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';
    
    return `<label for="${fieldId}"${styleAttr}>${this.escapeHtml(labelText)}</label>`;
  }

  renderInput(name, param, fieldId) {
    const inputName = this.escapeHtml(name);
    const value = this.values[name];
    
    switch (param.type) {
      case 'checkbox':
        return `<input type="checkbox" id="${fieldId}" name="${inputName}" ${value ? 'checked' : ''}>`;
      
      case 'number':
        return `<input type="number" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '')}" 
                ${param.min !== undefined ? `min="${param.min}"` : ''}
                ${param.max !== undefined ? `max="${param.max}"` : ''}
                ${param.step !== undefined ? `step="${param.step}"` : ''}>`;
      
      case 'text':
        return `<input type="text" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '')}">`;
      
      case 'color':
        return `<input type="color" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || '#000000')}">`;
      
      case 'textarea':
        return `<textarea id="${fieldId}" name="${inputName}" 
                rows="${param.rows || 4}" cols="${param.cols || 20}">${this.escapeHtml(value || '')}</textarea>`;
      
      case 'range':
        return `<input type="range" id="${fieldId}" name="${inputName}" 
                value="${this.escapeHtml(value || param.min || 0)}"
                min="${param.min || 0}" max="${param.max || 100}" step="${param.step || 1}">
                <span class="__MonkeyConfig_range_value">${value || param.min || 0}</span>`;
      
      case 'select':
        return this.renderSelect(fieldId, inputName, param, value);
      
      case 'radio':
        return this.renderRadio(fieldId, inputName, param, value);
      
      case 'file':
        return `<input type="file" id="${fieldId}" name="${inputName}" 
                accept="${this.escapeHtml(param.accept || '*/*')}">`;
      
      case 'button':
        return `<button type="button" id="${fieldId}" name="${inputName}" 
                class="__MonkeyConfig_custom_button">${this.escapeHtml(param.label || 'Button')}</button>`;
      
      case 'group':
        return this.renderGroup(fieldId, inputName, param);
      
      case 'custom':
        return this.renderCustom(fieldId, inputName, param);
      
      default:
        return `<span class="__MonkeyConfig_error">Unknown field type: ${this.escapeHtml(param.type)}</span>`;
    }
  }

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

  renderGroup(fieldId, inputName, param) {
    const legend = param.label ? `<legend>${this.escapeHtml(param.label)}</legend>` : '';
    return `<fieldset id="${fieldId}" class="__MonkeyConfig_group">${legend}</fieldset>`;
  }

  renderCustom(fieldId, inputName, param) {
    const customHtml = param.html ? this.createTrustedHTML(param.html) : '';
    return `<div id="${fieldId}" class="__MonkeyConfig_custom" data-name="${inputName}">${customHtml}</div>`;
  }

  renderButtons() {
    let buttonsHtml = '';
    
    for (const buttonType of this.data.buttons) {
      if (buttonType === 'close') continue;
      
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
          animation: __MonkeyConfig_fadeIn 0.2s ease-out;
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
        }

        .__MonkeyConfig_btn_save {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .__MonkeyConfig_btn_save:hover {
          background: #218838;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }

        .__MonkeyConfig_btn_reset {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .__MonkeyConfig_btn_reset:hover {
          background: #c82333;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
        }

        .__MonkeyConfig_btn_reload {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .__MonkeyConfig_btn_reload:hover {
          background: #0056b3;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
        }

        .__MonkeyConfig_btn_homepage {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .__MonkeyConfig_btn_homepage:hover {
          background: #545b62;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .__MonkeyConfig_error {
          color: #dc3545;
          font-weight: 500;
          padding: 8px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        @keyframes __MonkeyConfig_fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .__MonkeyConfig_container {
            width: 95vw;
            height: 95vh;
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

        @media (prefers-color-scheme: dark) {
          .__MonkeyConfig_container {
            background: #1a1a1a;
            border-color: #444;
            color: #e0e0e0;
          }

          .__MonkeyConfig_default_table tr {
            border-color: #333;
          }

          .__MonkeyConfig_label_cell {
            color: #e0e0e0;
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

          .__MonkeyConfig_group legend {
            color: #e0e0e0;
          }

          .__MonkeyConfig_custom_button {
            background: #2a2a2a;
            border-color: #444;
            color: #e0e0e0;
          }

          .__MonkeyConfig_custom_button:hover {
            background: #333;
          }
        }
      </style>
    `;
  }

  // ✅ نسخة محسّنة من createShadowDOM
  createShadowDOM() {
    try {
      // إنشاء AbortController لإدارة الأحداث
      this.abortController = new AbortController();
      
      // إنشاء الطبقة الخلفية (overlay)
      this.openLayer = document.createElement('div');
      this.openLayer.id = '__MonkeyConfig_overlay';
      Object.assign(this.openLayer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '2147483646',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      });

      // ✅ الإغلاق فقط عند النقر على الخلفية مباشرة
      this.openLayer.addEventListener('click', (e) => {
        if (e.target === this.openLayer) {
          this.close();
        }
      }, { signal: this.abortController.signal });

      // إنشاء shadow host
      const shadowHost = document.createElement('div');
      shadowHost.id = '__MonkeyConfig_shadow_host';
      
      // ✅ منع انتشار النقرات من المحتوى إلى الخلفية
      shadowHost.addEventListener('click', (e) => {
        e.stopPropagation();
      }, { signal: this.abortController.signal });

      // إنشاء Shadow DOM
      try {
        this.shadowRoot = shadowHost.attachShadow({ mode: 'open' });
      } catch (e) {
        this.log('Shadow DOM not supported, using iframe fallback', 'warn');
        this.createIframeFallback();
        return;
      }
      
      // إضافة الأنماط والمحتوى
      const content = this.getCSS() + `<div class="__MonkeyConfig_wrapper">${this.render()}</div>`;
      this.shadowRoot.innerHTML = content;
      
      this.container = this.shadowRoot.querySelector('.__MonkeyConfig_container');

      if (!this.container) {
        throw new Error('Failed to find container element');
      }

      // إضافة إلى الصفحة
      this.openLayer.appendChild(shadowHost);
      document.body.appendChild(this.openLayer);

      // ربط الأحداث
      this.bindEvents();
      this.displayed = true;

      this.log('Shadow DOM dialog opened successfully');
    } catch (e) {
      this.log(`Failed to create Shadow DOM: ${e.message}`, 'error');
      this.createIframeFallback();
    }
  }

  // ✅ نسخة محسّنة من createIframeFallback
  createIframeFallback() {
    try {
      // إنشاء AbortController إذا لم يكن موجوداً
      if (!this.abortController) {
        this.abortController = new AbortController();
      }
      
      // إنشاء الطبقة الخلفية
      this.openLayer = document.createElement('div');
      this.openLayer.id = '__MonkeyConfig_overlay';
      Object.assign(this.openLayer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '2147483646',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      });

      // ✅ الإغلاق عند النقر على الخلفية
      this.openLayer.addEventListener('click', (e) => {
        if (e.target === this.openLayer) {
          this.close();
        }
      }, { signal: this.abortController.signal });

      // إنشاء iframe
      this.iframeFallback = document.createElement('iframe');
      this.iframeFallback.id = '__MonkeyConfig_iframe';
      Object.assign(this.iframeFallback.style, {
        width: this.iframeWidth,
        height: this.iframeHeight,
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'auto' // ✅ ضروري لاستقبال الأحداث
      });

      // ✅ منع انتشار النقرات من iframe إلى الخلفية
      this.iframeFallback.addEventListener('click', (e) => {
        e.stopPropagation();
      }, { signal: this.abortController.signal });

      this.openLayer.appendChild(this.iframeFallback);
      document.body.appendChild(this.openLayer);

      // الانتظار حتى تحميل iframe
      const loadHandler = () => {
        try {
          const iframeDoc = this.iframeFallback.contentDocument || 
                           this.iframeFallback.contentWindow.document;
          
          if (!iframeDoc) {
            throw new Error('Unable to access iframe document');
          }
          
          // كتابة المحتوى
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="ar">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${this.escapeHtml(this.data.title)}</title>
              ${this.getCSS()}
            </head>
            <body style="margin:0;padding:0;font-size:${this.iframeFontSize};color:${this.iframeFontColor};">
              ${this.render()}
            </body>
            </html>
          `);
          iframeDoc.close();

          this.container = iframeDoc.querySelector('.__MonkeyConfig_container');

          if (!this.container) {
            throw new Error('Failed to find container in iframe');
          }

          // ربط الأحداث
          this.bindEvents();
          this.displayed = true;

          this.log('Iframe fallback dialog opened successfully');
        } catch (e) {
          this.log(`Failed to initialize iframe content: ${e.message}`, 'error');
          this.close();
        }
      };

      this.iframeFallback.addEventListener('load', loadHandler, { once: true });

      // Timeout للحماية من الانتظار اللانهائي
      setTimeout(() => {
        if (!this.displayed) {
          this.log('Iframe load timeout', 'error');
          this.close();
        }
      }, 5000);

    } catch (e) {
      this.log(`Failed to create iframe fallback: ${e.message}`, 'error');
      alert('Failed to open configuration dialog.');
    }
  }

  bindEvents() {
    try {
      const context = this.iframeFallback ? 
        (this.iframeFallback.contentDocument || this.iframeFallback.contentWindow.document) : 
        this.shadowRoot;
      
      if (!context) {
        throw new Error('No valid context for binding events');
      }

      // ربط زر الإغلاق
      const closeBtn = context.querySelector('#__MonkeyConfig_button_close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close(), 
          { signal: this.abortController?.signal });
      }

      // ربط أزرار الحفظ والإعادة تعيين
      this.data.buttons.forEach(buttonType => {
        if (buttonType === 'close') return;
        
        const btn = context.querySelector(`#__MonkeyConfig_button_${buttonType}`);
        if (!btn) return;

        btn.addEventListener('click', () => {
          switch (buttonType) {
            case 'save':
              this.handleSave();
              break;
            case 'reset':
              this.handleReset();
              break;
            case 'reload':
              this.handleReload();
              break;
            case 'homepage':
              this.handleHomepage();
              break;
          }
        }, { signal: this.abortController?.signal });
      });

      // ربط أحداث الحقول
      for (const [name, param] of Object.entries(this.params)) {
        const fieldId = `__MonkeyConfig_field_${name}`;
        const element = context.querySelector(`#${fieldId}`);
        
        if (!element) continue;

        switch (param.type) {
          case 'checkbox':
            element.addEventListener('change', (e) => {
              this.values[name] = e.target.checked;
            }, { signal: this.abortController?.signal });
            break;
          
          case 'number':
          case 'text':
          case 'color':
          case 'textarea':
            element.addEventListener('input', (e) => {
              this.values[name] = e.target.value;
            }, { signal: this.abortController?.signal });
            break;
          
          case 'range':
            element.addEventListener('input', (e) => {
              this.values[name] = parseFloat(e.target.value);
              const valueDisplay = element.parentNode.querySelector('.__MonkeyConfig_range_value');
              if (valueDisplay) {
                valueDisplay.textContent = e.target.value;
              }
            }, { signal: this.abortController?.signal });
            break;
          
          case 'select':
            element.addEventListener('change', (e) => {
              if (param.multiple) {
                this.values[name] = Array.from(e.target.selectedOptions).map(opt => opt.value);
              } else {
                this.values[name] = e.target.value;
              }
            }, { signal: this.abortController?.signal });
            break;
          
          case 'radio':
            const radioButtons = context.querySelectorAll(`input[name="${name}"]`);
            radioButtons.forEach(radio => {
              radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                  this.values[name] = e.target.value;
                }
              }, { signal: this.abortController?.signal });
            });
            break;
          
          case 'file':
            element.addEventListener('change', (e) => {
              const file = e.target.files[0];
              if (file) {
                this.values[name] = file;
              }
            }, { signal: this.abortController?.signal });
            break;
          
          case 'button':
            if (param.onClick && typeof param.onClick === 'function') {
              element.addEventListener('click', () => {
                try {
                  param.onClick(this.values);
                } catch (e) {
                  this.log(`Button click handler error: ${e.message}`, 'error');
                }
              }, { signal: this.abortController?.signal });
            }
            break;
          
          case 'custom':
            if (param.get && typeof param.get === 'function') {
              element.addEventListener('change', () => {
                try {
                  this.values[name] = param.get(element);
                } catch (e) {
                  this.log(`Custom get function error: ${e.message}`, 'error');
                }
              }, { signal: this.abortController?.signal });
            }
            break;
        }
      }

      // إضافة معالج مفتاح ESC للإغلاق
      const escHandler = (e) => {
        if (e.key === 'Escape' && this.displayed) {
          this.close();
        }
      };
      
      if (this.iframeFallback) {
        const iframeDoc = this.iframeFallback.contentDocument || 
                         this.iframeFallback.contentWindow.document;
        iframeDoc.addEventListener('keydown', escHandler, 
          { signal: this.abortController?.signal });
      } else {
        document.addEventListener('keydown', escHandler, 
          { signal: this.abortController?.signal });
      }

      this.log('Events bound successfully');
    } catch (e) {
      this.log(`Failed to bind events: ${e.message}`, 'error');
    }
  }

  handleSave() {
    this.save(false);
  }

  handleReset() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.reset();
      alert('Settings have been reset to defaults.');
    }
  }

  handleReload() {
    if (this.save(false)) {
      if (confirm('Settings saved. Reload page now?')) {
        location.reload();
      }
    }
  }

  handleHomepage() {
    if (this.data.homepage) {
      window.open(this.data.homepage, '_blank', 'noopener,noreferrer');
    }
  }

  open() {
    try {
      if (this.isDestroyed) {
        this.log('Cannot open: instance is destroyed', 'warn');
        return;
      }

      if (this.displayed) {
        this.log('Dialog is already open', 'warn');
        return;
      }

      // محاولة استخدام Shadow DOM أولاً
      if (document.body && document.body.attachShadow) {
        this.createShadowDOM();
      } else {
        this.log('Shadow DOM not supported, using iframe', 'info');
        this.createIframeFallback();
      }
    } catch (e) {
      this.log(`Failed to open dialog: ${e.message}`, 'error');
      alert('Failed to open configuration dialog.');
    }
  }

  close() {
    try {
      if (!this.displayed) {
        return;
      }

      // إلغاء جميع الأحداث
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }

      // إزالة العناصر من DOM
      if (this.openLayer && this.openLayer.parentNode) {
        this.openLayer.parentNode.removeChild(this.openLayer);
      }

      // تنظيف المراجع
      this.openLayer = null;
      this.shadowRoot = null;
      this.container = null;
      this.iframeFallback = null;
      this.displayed = false;
      this.elementCache.clear();

      this.log('Dialog closed successfully');
    } catch (e) {
      this.log(`Error closing dialog: ${e.message}`, 'error');
    }
  }

  destroy() {
    try {
      if (this.isDestroyed) {
        this.log('Instance already destroyed', 'warn');
        return;
      }

      // إغلاق النافذة إذا كانت مفتوحة
      if (this.displayed) {
        this.close();
      }

      // تنظيف جميع المراجع
      this.data = null;
      this.params = null;
      this.values = null;
      this.validationRules.clear();
      this.elementCache.clear();
      this.eventListeners.clear();
      this.trustedPolicy = null;
      
      this.isDestroyed = true;
      
      this.log('Instance destroyed successfully');
    } catch (e) {
      this.log(`Error destroying instance: ${e.message}`, 'error');
    }
  }
}

// تصدير الكلاس للاستخدام العالمي
if (typeof window !== 'undefined') {
  window.ModernMonkeyConfig = ModernMonkeyConfig;
}
