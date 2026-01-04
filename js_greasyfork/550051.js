// ==UserScript==
// @name                PlusAI Widescreen 🖥️
// @namespace           lanvent
// @description         Enables widescreen mode for ChatGPT automatically.
// @description:zh      启用 ChatGPT 宽屏模式，支持markdown源码查看、长消息折叠和对话快捷操作功能。
// @author              lanvent
// @version             2025.10.13
// @license             MIT
// @match               *://cc.plusai.me/* 
// @match               *://cc2.plusai.me/*
// @grant               GM_setValue
// @grant               GM_getValue

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550051/PlusAI%20Widescreen%20%F0%9F%96%A5%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550051/PlusAI%20Widescreen%20%F0%9F%96%A5%EF%B8%8F.meta.js
// ==/UserScript==


var ChatGPTWidescreen = function(exports) {
  "use strict";
  const CONFIG = {
    VERSION: "2025.10.13",
    STYLES: {},
    UI: {
      ANIMATIONS: {
        scrollBehavior: "smooth"
      }
    },
    BUTTON_STYLES: {
      borderWidth: "2px",
      borderRadius: "8px",
      width: "38px",
      height: "38px",
      background: "inherit",
      borderColor: "rgba(100, 150, 250, 0.6)",
      fontSize: "16px",
      fontWeight: "700"
    },
    SCREEN_MARGIN: 50,
    MESSAGE: {
      LONG_MESSAGE_THRESHOLD: 1e3,
      VISIBILITY_THRESHOLD: .05,
      MAX_LINES: 6,
      MIN_LINE_HEIGHT: 20,
      ESTIMATED_CHARS_PER_LINE: 80
    },
    SELECTORS: {
      TEXT_CONTAINER: "main .mx-auto.text-base",
      CONVERSATION: '[data-testid^="conversation-turn"]',
      messages: {
        user: '[data-message-author-role="user"]',
        assistant: '[data-message-author-role="assistant"]',
        content: ".markdown"
      },
      ui: {
        turnActions: '[data-testid*="turn-action"]'
      },
      CODE_BLOCK: "pre code",
      FLOAT_PANEL: ".chatgpt-widescreen-float-panel"
    },
    STORAGE_KEYS: {
      SETTINGS: "chatgpt_widescreen_settings"
    },
    DEBUG: !1
  }, CSS_CLASSES_WIDESCREEN = "chatgpt-widescreen", CSS_CLASSES_COLLAPSED = "direct-collapse", CSS_CLASSES_FLOAT_PANEL = "chatgpt-widescreen-float-panel", CSS_CLASSES_BUTTON = "chatgpt-widescreen-btn", CSS_CLASSES_HIDDEN = "chatgpt-hidden", FIELD_TYPES_BOOLEAN = "boolean", FIELD_TYPES_NUMBER = "number", FIELD_TYPES_TEXT = "text", FIELD_TYPES_SELECT = "select", FIELD_TYPES_COLOR = "color", FIELD_TYPES_OBJECT = "object", SETTINGS_SCHEMA = {
    $schema: "chatgpt-widescreen-settings-v1",
    title: "PlusAI Widescreen Settings",
    description: "Configure your ChatGPT widescreen experience",
    groups: [ {
      id: "display",
      title: "Display & Layout",
      description: "Control the appearance and layout of the interface",
      icon: "🖥️"
    }, {
      id: "messages",
      title: "Message Handling",
      description: "Configure how messages are displayed and managed",
      icon: "💬"
    }, {
      id: "navigation",
      title: "Navigation & Controls",
      description: "Customize keyboard shortcuts and navigation behavior",
      icon: "⌨️"
    }, {
      id: "advanced",
      title: "Advanced Options",
      description: "Fine-tune performance and behavior settings",
      icon: "⚙️"
    } ],
    fields: {
      widescreenMode: {
        type: "boolean",
        group: "display",
        label: "Enable Widescreen Mode",
        description: "Expand the conversation area to use more screen width",
        default: !0,
        order: 1
      },
      widescreenWidth: {
        type: "number",
        group: "display",
        label: "Widescreen Width (%)",
        description: "Set the width of the conversation area in widescreen mode",
        default: 90,
        min: 60,
        max: 100,
        step: 1,
        unit: "%",
        order: 2,
        dependsOn: {
          widescreenMode: !0
        }
      },
      screenMargin: {
        type: "number",
        group: "display",
        label: "Screen Margin (px)",
        description: "Minimum margin for buttons from screen top edge",
        default: 50,
        min: 0,
        max: 200,
        requiresRefresh: !0,
        step: 10,
        unit: "px",
        order: 3
      },
      showFloatButtons: {
        type: "boolean",
        group: "display",
        label: "Show Floating Buttons",
        description: "Display the floating control panel with quick actions",
        default: !0,
        order: 4
      },
      buttonPosition: {
        type: "select",
        group: "display",
        label: "Button Panel Position",
        description: "Choose where to display the floating button panel",
        default: "right",
        options: [ {
          value: "left",
          label: "Left"
        }, {
          value: "right",
          label: "Right"
        } ],
        order: 5,
        dependsOn: {
          showFloatButtons: !0
        }
      },
      autoCollapse: {
        type: "boolean",
        group: "messages",
        label: "Auto-Collapse Long Messages",
        description: "Automatically collapse messages that exceed length thresholds",
        default: !0,
        order: 10
      },
      longMessageThreshold: {
        type: "number",
        group: "messages",
        label: "Long Message Threshold (characters)",
        description: "Messages longer than this will be auto-collapsed",
        default: 1e3,
        min: 100,
        max: 5e3,
        step: 100,
        order: 11,
        dependsOn: {
          autoCollapse: !0
        }
      },
      maxVisibleLines: {
        type: "number",
        group: "messages",
        label: "Max Visible Lines",
        description: "Maximum number of lines to show before collapsing",
        default: 6,
        min: 3,
        max: 20,
        step: 1,
        order: 12,
        dependsOn: {
          autoCollapse: !0
        }
      },
      enableMarkdownView: {
        type: "boolean",
        group: "messages",
        label: "Enable Markdown Source View",
        description: "Allow viewing raw Markdown source of assistant messages",
        default: !0,
        order: 13
      },
      collapseAnimation: {
        type: "boolean",
        group: "messages",
        label: "Collapse Animation",
        description: "Enable smooth animations when collapsing/expanding messages",
        default: !0,
        order: 14
      },
      enableMessageNavigation: {
        type: "boolean",
        group: "navigation",
        label: "Enable Message Navigation",
        description: "Show previous/next message navigation buttons",
        default: !0,
        order: 20
      },
      enableScroll: {
        type: "boolean",
        group: "navigation",
        label: "Enable Quick Scroll Buttons",
        description: "Show buttons for scrolling to top/bottom",
        default: !0,
        order: 21
      },
      scrollBehavior: {
        type: "select",
        group: "navigation",
        label: "Scroll Behavior",
        description: "Choose how scrolling animations work",
        default: "smooth",
        options: [ {
          value: "smooth",
          label: "Smooth"
        }, {
          value: "auto",
          label: "Instant"
        } ],
        order: 22
      },
      enableKeyboardShortcuts: {
        type: "boolean",
        group: "navigation",
        label: "Enable Keyboard Shortcuts",
        description: "Use keyboard shortcuts for navigation",
        default: !0,
        order: 23
      },
      keyboardShortcuts: {
        type: "object",
        group: "navigation",
        label: "Keyboard Shortcuts",
        description: "Configure keyboard shortcut bindings",
        default: {
          previousMessage: "ArrowUp",
          nextMessage: "ArrowDown",
          scrollUp: "Alt+ArrowUp",
          scrollDown: "Alt+ArrowDown",
          toggleWidescreen: "Alt+W",
          collapseAll: "Alt+C",
          expandAll: "Alt+E"
        },
        order: 24,
        dependsOn: {
          enableKeyboardShortcuts: !0
        },
        fields: {
          previousMessage: {
            type: "text",
            label: "Previous Message",
            placeholder: "e.g., ArrowUp"
          },
          nextMessage: {
            type: "text",
            label: "Next Message",
            placeholder: "e.g., ArrowDown"
          },
          scrollUp: {
            type: "text",
            label: "Scroll Up",
            placeholder: "e.g., Alt+ArrowUp"
          },
          scrollDown: {
            type: "text",
            label: "Scroll Down",
            placeholder: "e.g., Alt+ArrowDown"
          },
          toggleWidescreen: {
            type: "text",
            label: "Toggle Widescreen",
            placeholder: "e.g., Alt+W"
          },
          collapseAll: {
            type: "text",
            label: "Collapse All",
            placeholder: "e.g., Alt+C"
          },
          expandAll: {
            type: "text",
            label: "Expand All",
            placeholder: "e.g., Alt+E"
          }
        }
      },
      enableConversationOps: {
        type: "boolean",
        group: "navigation",
        label: "Enable Conversation Operations",
        description: "Show quick action buttons in conversation list",
        default: !0,
        order: 25
      },
      visibilityThreshold: {
        type: "number",
        group: "advanced",
        label: "Visibility Threshold",
        description: "Element visibility threshold for intersection observer",
        default: .05,
        requiresRefresh: !0,
        min: .01,
        max: 1,
        step: .05,
        order: 30
      },
      minLineHeight: {
        type: "number",
        group: "advanced",
        label: "Minimum Line Height (px)",
        description: "Minimum line height for message calculations",
        default: 20,
        min: 10,
        max: 50,
        step: 1,
        unit: "px",
        order: 31
      },
      estimatedCharsPerLine: {
        type: "number",
        group: "advanced",
        label: "Estimated Characters Per Line",
        description: "Fallback value for line length calculations",
        default: 80,
        min: 40,
        max: 200,
        step: 10,
        order: 32
      },
      debugMode: {
        type: "boolean",
        group: "advanced",
        label: "Debug Mode",
        description: "Enable detailed logging for troubleshooting",
        default: !1,
        order: 33
      },
      buttonStyles: {
        type: "object",
        group: "advanced",
        label: "Button Styles",
        description: "Customize the appearance of floating buttons",
        default: {
          borderWidth: "2px",
          borderRadius: "8px",
          width: "38px",
          height: "38px",
          borderColor: "rgba(100, 150, 250, 0.6)",
          fontSize: "16px"
        },
        order: 34,
        fields: {
          borderWidth: {
            type: "text",
            label: "Border Width",
            placeholder: "e.g., 2px"
          },
          borderRadius: {
            type: "text",
            label: "Border Radius",
            placeholder: "e.g., 8px"
          },
          width: {
            type: "text",
            label: "Width",
            placeholder: "e.g., 38px"
          },
          height: {
            type: "text",
            label: "Height",
            placeholder: "e.g., 38px"
          },
          borderColor: {
            type: "color",
            label: "Border Color",
            placeholder: "e.g., rgba(100, 150, 250, 0.6)"
          },
          fontSize: {
            type: "text",
            label: "Font Size",
            placeholder: "e.g., 16px"
          }
        }
      }
    }
  };
  function getDefaultSettings() {
    return Object.fromEntries(Object.entries(SETTINGS_SCHEMA.fields).map(([key, field]) => [ key, field.default ]));
  }
  function isFieldVisible(fieldKey, currentSettings) {
    const field = SETTINGS_SCHEMA.fields[fieldKey];
    return !field.dependsOn || Object.entries(field.dependsOn).every(([depKey, depValue]) => currentSettings[depKey] === depValue);
  }
  const STYLED_PREFIXES = {
    debug: {
      prefix: "%c[DEBUG]",
      style: "color: #6c757d; font-weight: bold;"
    },
    info: {
      prefix: "%c[INFO]",
      style: "color: #28a745; font-weight: bold;"
    },
    warn: {
      prefix: "%c[WARN]",
      style: "color: #ffc107; font-weight: bold;"
    },
    error: {
      prefix: "%c[ERROR]",
      style: "color: #dc3545; font-weight: bold;"
    }
  }, LEVEL_PRIORITY = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  let currentLevel = "info";
  const createLoggerMethod = (level, method) => {
    if ("debug" === level) return () => {};
    const {prefix: prefix, style: style} = STYLED_PREFIXES[level];
    return (...args) => {
      (level => LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel])(level) && method.call(console, prefix, style, ...args);
    };
  }, Logger = {
    debug: createLoggerMethod("debug", console.debug),
    info: createLoggerMethod("info", console.info),
    warn: createLoggerMethod("warn", console.warn),
    error: createLoggerMethod("error", console.error),
    setLevel(level) {
      currentLevel = level;
    },
    getLevel: () => currentLevel
  };
  class EventManager {
    listeners=new Map;
    static dispatch(eventType, data, target = window) {
      const event = new CustomEvent(`chatgpt-${eventType}`, {
        detail: data,
        bubbles: !0,
        cancelable: !0
      });
      Logger.debug(`[EventManager] 分发事件: ${eventType}`, data), target.dispatchEvent(event);
    }
    static listen(events, handler, target = window) {
      const eventList = Array.isArray(events) ? events : [ events ], unlistenFns = [];
      return eventList.forEach(eventType => {
        if ("string" != typeof eventType) throw new Error("EventManager.listen: eventType must be a string or an array of strings");
        const fullEventType = `chatgpt-${eventType}`, wrappedHandler = event => {
          const customEvent = event;
          Logger.debug(`[EventManager] 收到事件: ${eventType}`, customEvent.detail), handler(customEvent.detail, customEvent);
        };
        target.addEventListener(fullEventType, wrappedHandler), unlistenFns.push(() => {
          target.removeEventListener(fullEventType, wrappedHandler);
        });
      }), () => {
        unlistenFns.forEach(unlisten => unlisten());
      };
    }
    static once(eventType, handler = null, target = window) {
      return new Promise(resolve => {
        const unlisten = this.listen(eventType, (data, event) => {
          unlisten(), handler && handler(data, event), resolve(data);
        }, target);
      });
    }
    static removeAllListeners(eventType) {
      Logger.warn(`[EventManager] removeAllListeners(${eventType}) 需要手动管理监听器`);
    }
    on(eventType, handler) {
      this.listeners.has(eventType) || this.listeners.set(eventType, new Set);
      const handlers = this.listeners.get(eventType);
      return handlers?.add(handler), () => {
        handlers?.delete(handler), handlers && 0 === handlers.size && this.listeners.delete(eventType);
      };
    }
  }
  const EVENTS_PAGE_NAVIGATION = "page-navigation", EVENTS_PAGE_STYLE_CHANGED = "page-style-changed", EVENTS_PAGE_RESIZE = "page-resize", EVENTS_MESSAGE_ADDED = "message-added", EVENTS_MESSAGE_COLLAPSED = "message-collapsed", EVENTS_MESSAGE_EXPANDED = "message-expanded", EVENTS_LONG_MESSAGES_UPDATED = "long-messages-updated", EVENTS_BUTTON_CREATED = "button-created", EVENTS_WIDESCREEN_TOGGLED = "widescreen-toggled", EVENTS_SCROLL_DETECTED = "scroll-detected", EVENTS_CONVERSATION_ACTION = "conversation-action", EVENTS_SETTINGS_CHANGED = "settings-changed";
  const settingsService = new class {
    storageKey="chatgpt_widescreen_settings";
    settings=null;
    eventManager=new EventManager;
    listeners=new Map;
    async init() {
      return Logger.info("[SettingsService] Initializing..."), this.settings = await this.loadSettings(), 
      this.settings;
    }
    isInitialized() {
      return null !== this.settings;
    }
    async loadSettings() {
      try {
        let stored = null;
        if ("undefined" != typeof GM_getValue) stored = GM_getValue(this.storageKey, null); else {
          const localData = localStorage.getItem(this.storageKey);
          localData && (stored = localData);
        }
        let loadedSettings = {};
        if (stored) {
          loadedSettings = "string" == typeof stored ? JSON.parse(stored) : stored;
        }
        const mergedSettings = {
          ...getDefaultSettings(),
          ...loadedSettings
        }, validatedSettings = this.validateSettings(mergedSettings);
        return Logger.info("[SettingsService] Settings loaded:", validatedSettings), validatedSettings;
      } catch (error) {
        return Logger.error("[SettingsService] Failed to load settings:", error), getDefaultSettings();
      }
    }
    validateSettings(settings) {
      const validatedEntries = Object.entries(SETTINGS_SCHEMA.fields).map(([key, field]) => {
        const typedKey = key, value = settings[typedKey], result = this.validateField(typedKey, value, field);
        return result.valid || Logger.warn("[SettingsService] Validation error:", {
          key: typedKey,
          error: result.error
        }), [ typedKey, result.value ];
      });
      return Object.fromEntries(validatedEntries);
    }
    validateField(key, value, field) {
      if (null == value) return {
        valid: !0,
        value: field.default
      };
      try {
        switch (field.type) {
         case FIELD_TYPES_BOOLEAN:
          return this.validateBoolean(value, field.default);

         case FIELD_TYPES_NUMBER:
          return this.validateNumber(value, field);

         case FIELD_TYPES_TEXT:
          return this.validateText(value, field);

         case FIELD_TYPES_SELECT:
          return this.validateSelect(value, field);

         case FIELD_TYPES_COLOR:
          return this.validateColor(value, field);

         case FIELD_TYPES_OBJECT:
          return this.validateObject(value, field);

         default:
          return {
            valid: !0,
            value: value
          };
        }
      } catch (error) {
        return {
          valid: !1,
          value: field.default,
          error: error.message
        };
      }
    }
    validateBoolean(value, fallback) {
      return "boolean" == typeof value ? {
        valid: !0,
        value: value
      } : "true" === value || 1 === value ? {
        valid: !0,
        value: !0
      } : "false" === value || 0 === value ? {
        valid: !0,
        value: !1
      } : {
        valid: !1,
        value: fallback,
        error: "Invalid boolean value"
      };
    }
    validateNumber(value, field) {
      const num = "number" == typeof value ? value : parseFloat(String(value));
      return Number.isNaN(num) ? {
        valid: !1,
        value: field.default,
        error: "Invalid number"
      } : void 0 !== field.min && num < field.min ? {
        valid: !0,
        value: field.min
      } : void 0 !== field.max && num > field.max ? {
        valid: !0,
        value: field.max
      } : {
        valid: !0,
        value: num
      };
    }
    validateText(value, field) {
      const text = String(value);
      if (void 0 !== field.minLength && text.length < field.minLength) return {
        valid: !1,
        value: field.default,
        error: `Text too short (min: ${field.minLength})`
      };
      if (void 0 !== field.maxLength && text.length > field.maxLength) return {
        valid: !1,
        value: field.default,
        error: `Text too long (max: ${field.maxLength})`
      };
      if (field.pattern) {
        if (!new RegExp(field.pattern).test(text)) return {
          valid: !1,
          value: field.default,
          error: "Text does not match required pattern"
        };
      }
      return {
        valid: !0,
        value: text
      };
    }
    validateSelect(value, field) {
      return field.options.map(opt => opt.value).includes(String(value)) ? {
        valid: !0,
        value: String(value)
      } : {
        valid: !1,
        value: field.default,
        error: `Invalid option: ${value}`
      };
    }
    validateColor(value, field) {
      const color = String(value);
      return /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+).*$/.test(color) ? {
        valid: !0,
        value: color
      } : {
        valid: !1,
        value: field.default,
        error: "Invalid color format"
      };
    }
    validateObject(value, field) {
      if ("object" != typeof value || null === value) return {
        valid: !1,
        value: field.default,
        error: "Value must be an object"
      };
      if (!field.fields) return {
        valid: !0,
        value: value
      };
      const validated = {};
      return Object.entries(field.fields).forEach(([nestedKey, nestedField]) => {
        const nestedValue = value[nestedKey];
        if ("text" === nestedField.type) validated[nestedKey] = void 0 !== nestedValue ? String(nestedValue) : ""; else if ("color" === nestedField.type) {
          const color = this.validateColor(nestedValue, {
            ...nestedField,
            group: field.group,
            description: nestedField.label,
            default: ""
          });
          validated[nestedKey] = color.valid ? color.value : "";
        } else validated[nestedKey] = nestedValue ?? "";
      }), {
        valid: !0,
        value: validated
      };
    }
    async saveSettings(notify = !0) {
      if (!this.settings) return !1;
      try {
        const settingsString = JSON.stringify(this.settings);
        return "undefined" != typeof GM_setValue ? GM_setValue(this.storageKey, settingsString) : localStorage.setItem(this.storageKey, settingsString), 
        Logger.info("[SettingsService] Settings saved"), notify && EventManager.dispatch(EVENTS_SETTINGS_CHANGED, this.settings), 
        !0;
      } catch (error) {
        return Logger.error("[SettingsService] Failed to save settings:", error), !1;
      }
    }
    get(key, defaultValue) {
      return this.settings && key in this.settings ? this.settings[key] : defaultValue;
    }
    set(key, value) {
      const field = SETTINGS_SCHEMA.fields[key];
      if (!field) return Logger.warn(`[SettingsService] Unknown setting key: ${String(key)}`), 
      !1;
      const result = this.validateField(key, value, field);
      if (!result.valid) return Logger.warn(`[SettingsService] Validation failed for ${String(key)}:`, result.error), 
      !1;
      this.settings || (this.settings = getDefaultSettings());
      const oldValue = this.settings[key];
      return JSON.stringify(oldValue) === JSON.stringify(result.value) ? (Logger.debug(`[SettingsService] Value unchanged for ${String(key)}, skipping update`), 
      !0) : (this.settings[key] = result.value, this.saveSettings(), this.notifyListeners(key, result.value), 
      !0);
    }
    getAll() {
      return this.settings ? {
        ...this.settings
      } : (Logger.warn("[SettingsService] getAll() called before init()"), getDefaultSettings());
    }
    update(newSettings) {
      this.settings || (this.settings = getDefaultSettings());
      const updates = [];
      for (const key of Object.keys(newSettings)) {
        const value = newSettings[key], typedKey = key, field = SETTINGS_SCHEMA.fields[typedKey];
        if (!field) {
          Logger.warn(`[SettingsService] Unknown setting key: ${key}`);
          continue;
        }
        const result = this.validateField(typedKey, value, field);
        if (result.valid) {
          this.settings[typedKey] = result.value, updates.push(typedKey);
        }
      }
      return this.saveSettings(), updates.forEach(key => this.notifyListeners(key, this.settings[key])), 
      updates;
    }
    reset() {
      const oldSettings = this.settings ? {
        ...this.settings
      } : getDefaultSettings();
      this.settings = getDefaultSettings(), this.saveSettings(), Object.keys(this.settings).forEach(key => {
        const typedKey = key, newValue = this.settings[typedKey];
        JSON.stringify(oldSettings[typedKey]) !== JSON.stringify(newValue) && this.notifyListeners(typedKey, newValue);
      }), Logger.info("[SettingsService] Settings reset to defaults");
    }
    export() {
      return JSON.stringify(this.settings, null, 2);
    }
    import(settingsJson) {
      try {
        const imported = JSON.parse(settingsJson), validated = this.validateSettings(imported);
        return this.settings = validated, this.saveSettings(), Logger.info("[SettingsService] Settings imported successfully"), 
        {
          success: !0
        };
      } catch (error) {
        return Logger.error("[SettingsService] Failed to import settings:", error), {
          success: !1,
          error: error.message
        };
      }
    }
    onChange(callback) {
      return this.eventManager.on(EVENTS_SETTINGS_CHANGED, settings => {
        callback(settings);
      });
    }
    watch(key, callback) {
      return this.listeners.has(key) || this.listeners.set(key, new Set), this.listeners.get(key).add(callback), 
      () => {
        const callbacks = this.listeners.get(key);
        callbacks?.delete(callback);
      };
    }
    notifyListeners(key, value) {
      const callbacks = this.listeners.get(key);
      callbacks?.forEach(callback => {
        try {
          callback(value, key);
        } catch (error) {
          Logger.error("[SettingsService] Listener error:", error);
        }
      });
    }
    getSchema() {
      return SETTINGS_SCHEMA;
    }
  };
  class DOMUtils {
    static createElement(tagName, attributes = {}, textContent = "") {
      const element = document.createElement(tagName);
      return "string" == typeof attributes ? attributes && (element.className = attributes) : Object.entries(attributes).forEach(([key, value]) => {
        void 0 !== value && ("className" === key && "string" == typeof value ? element.className = value : "dataset" === key && "object" == typeof value ? Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = String(dataValue);
        }) : element.setAttribute(key, String(value)));
      }), textContent && (element.textContent = textContent), element;
    }
    static async waitForElement(selector, parent = document, timeout = 5e3) {
      return new Promise((resolve, reject) => {
        const element = parent.querySelector(selector);
        if (element) return void resolve(element);
        const observer = new MutationObserver(() => {
          const found = parent.querySelector(selector);
          found && (observer.disconnect(), resolve(found));
        });
        observer.observe(parent, {
          childList: !0,
          subtree: !0
        }), setTimeout(() => {
          observer.disconnect(), reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    }
    static isElementVisible(element, _threshold = 0, bottomThreshold = 120, topThreshold = 50) {
      const rect = element.getBoundingClientRect(), windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return !(rect.top > windowHeight - bottomThreshold || rect.bottom < topThreshold);
    }
    static getComputedStyle(element, property) {
      return window.getComputedStyle(element).getPropertyValue(property);
    }
    static hide(element) {
      element instanceof HTMLElement && element.classList.add("invisible");
    }
    static show(element) {
      element instanceof HTMLElement && element.classList.remove("invisible");
    }
    static toggleVisibility(element, show) {
      show ? this.show(element) : this.hide(element);
    }
    static isInDOM(element) {
      return !!element && document.contains(element);
    }
    static getOrCreateId(element, prefix = "element") {
      if (element.id) return element.id;
      const id = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      return element.id = id, id;
    }
    static addClass(element, className) {
      element instanceof HTMLElement && className && !element.classList.contains(className) && element.classList.add(className);
    }
    static removeClass(element, className) {
      element instanceof HTMLElement && className && element.classList.contains(className) && element.classList.remove(className);
    }
    static toggleClass(element, className) {
      return !!(element instanceof HTMLElement && className) && (element.classList.toggle(className), 
      element.classList.contains(className));
    }
    static hasClass(element, className) {
      return element instanceof HTMLElement && element.classList.contains(className);
    }
    static findElement(selectors, container = document) {
      if (Array.isArray(selectors)) {
        for (const selector of selectors) {
          const element = container.querySelector(selector);
          if (element) return element;
        }
        return null;
      }
      return container.querySelector(selectors);
    }
    static findElements(selector, container = document) {
      return Array.from(container.querySelectorAll(selector));
    }
    static removeElement(element) {
      element && element.parentNode && element.parentNode.removeChild(element);
    }
    static debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        timeoutId && Logger.debug("Debounce: clearing timeout", timeoutId, func, args), 
        clearTimeout(timeoutId), timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
    static throttle(func, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        now - lastCall >= delay && (lastCall = now, func.apply(this, args));
      };
    }
  }
  class UIUtils {
    static getVisibleLineCount(element) {
      if (!element) return 0;
      try {
        const style = window.getComputedStyle(element);
        let lineHeight = parseFloat(style.lineHeight);
        if (!lineHeight || Number.isNaN(lineHeight)) {
          const fontSize = parseFloat(style.fontSize) || 16, minLineHeight = settingsService.get("minLineHeight", CONFIG.MESSAGE.MIN_LINE_HEIGHT) ?? CONFIG.MESSAGE.MIN_LINE_HEIGHT;
          lineHeight = Math.max(1.2 * fontSize, minLineHeight);
        }
        const elementHeight = element.getBoundingClientRect().height, paddingTop = parseFloat(style.paddingTop) || 0, paddingBottom = parseFloat(style.paddingBottom) || 0, marginTop = parseFloat(style.marginTop) || 0, contentHeight = elementHeight - paddingTop - paddingBottom - marginTop - (parseFloat(style.marginBottom) || 0), lineCount = Math.floor(contentHeight / lineHeight);
        return Math.max(0, lineCount);
      } catch (error) {
        Logger.debug("计算行数时出错:", error);
        const textLength = element.textContent?.length ?? 0, charsPerLine = settingsService.get("estimatedCharsPerLine", CONFIG.MESSAGE.ESTIMATED_CHARS_PER_LINE) ?? CONFIG.MESSAGE.ESTIMATED_CHARS_PER_LINE;
        return Math.ceil(textLength / charsPerLine);
      }
    }
    static scrollToMessageTop(messageElement, offsetRatio = 0) {
      try {
        const parentElement = messageElement.parentElement;
        if (!parentElement) return void messageElement.scrollIntoView({
          behavior: CONFIG.UI.ANIMATIONS.scrollBehavior
        });
        const messageEls = parentElement.querySelectorAll(CONFIG.SELECTORS.messages.content), focusElement = messageEls.length > 1 && messageEls[0] !== messageElement ? messageElement : parentElement, parentOrWindow = this.findScrollableParent(focusElement);
        if (!(parentOrWindow instanceof HTMLElement)) return;
        const scrollContainer = parentOrWindow;
        "true" !== scrollContainer.dataset.scrollListenerAdded && (scrollContainer.dataset.scrollListenerAdded = "true", 
        Logger.debug("Adding scroll listener to container:", scrollContainer), scrollContainer.addEventListener("scroll", () => {
          EventManager.dispatch(EVENTS_SCROLL_DETECTED, {
            source: "element-scroll"
          });
        }));
        const topBarHeight = scrollContainer.firstElementChild?.firstElementChild?.getBoundingClientRect().height ?? 80, containerRect = scrollContainer.getBoundingClientRect(), relativeTop = focusElement.getBoundingClientRect().top - containerRect.top + scrollContainer.clientHeight * offsetRatio, targetScrollTop = Math.max(0, scrollContainer.scrollTop + relativeTop - topBarHeight);
        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: CONFIG.UI.ANIMATIONS.scrollBehavior
        });
      } catch (error) {
        Logger.error("Scroll error:", error), messageElement.scrollIntoView({
          behavior: CONFIG.UI.ANIMATIONS.scrollBehavior
        });
      }
    }
    static findScrollableParent(element) {
      let parent = element.parentElement;
      for (;parent && parent !== document.body; ) {
        const style = window.getComputedStyle(parent), overflow = `${style.overflow}${style.overflowY}${style.overflowX}`;
        if ((overflow.includes("scroll") || overflow.includes("auto")) && (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth)) return parent;
        parent = parent.parentElement;
      }
      return window;
    }
    static triggerMouseEvents(element, type = "click") {
      if (!element) return !1;
      Logger.debug("尝试触发事件，元素:", element);
      try {
        if ("click" === type) {
          element.style.pointerEvents = "auto", element.style.display = "";
          try {
            element.focus();
          } catch (e) {
            Logger.debug("元素无法获取焦点:", e);
          }
          const rect = element.getBoundingClientRect(), centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2, baseConfig = {
            bubbles: !0,
            cancelable: !0,
            detail: 1,
            button: 0,
            buttons: 1,
            clientX: centerX,
            clientY: centerY,
            screenX: centerX,
            screenY: centerY,
            shiftKey: !1,
            ctrlKey: !1,
            altKey: !1,
            metaKey: !1
          };
          try {
            [ "pointerdown", "pointerup" ].forEach(eventType => {
              const event = new PointerEvent(eventType, {
                ...baseConfig,
                pointerId: 1,
                isPrimary: !0
              });
              element.dispatchEvent(event);
            });
          } catch (e) {
            Logger.debug("PointerEvent触发失败:", e);
          }
          return element.dispatchEvent(new MouseEvent("click", baseConfig)), !0;
        }
        const elementRecord = element, reactFiberKey = Object.keys(elementRecord).find(key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
        if (reactFiberKey) try {
          const fiber = elementRecord[reactFiberKey], handler = fiber?.memoizedProps?.onClick;
          "function" == typeof handler && (Logger.debug("调用React事件处理器"), handler({
            preventDefault: () => {},
            stopPropagation: () => {},
            target: element,
            currentTarget: element
          }));
        } catch (e) {
          Logger.debug("React事件触发失败:", e);
        }
        return !0;
      } catch (error) {
        return Logger.error("触发鼠标事件失败:", error), !1;
      }
    }
    static analyzeButton(button) {
      if (!button) return;
      Logger.debug("=== 按钮分析 ==="), Logger.debug("元素:", button), Logger.debug("标签名:", button.tagName), 
      Logger.debug("类名:", button.className), Logger.debug("ID:", button.id), Logger.debug("data-testid:", button.getAttribute("data-testid")), 
      Logger.debug("aria-label:", button.getAttribute("aria-label")), Logger.debug("disabled:", button.disabled), 
      Logger.debug("style.display:", button.style.display), Logger.debug("style.visibility:", button.style.visibility), 
      Logger.debug("offsetParent:", button.offsetParent), Logger.debug("getBoundingClientRect:", button.getBoundingClientRect());
      const attrs = Array.from(button.attributes).map(attr => `${attr.name}="${attr.value}"`);
      Logger.debug("所有属性:", attrs);
      const windowWithListeners = window, events = windowWithListeners.getEventListeners?.(button) ?? {};
      Logger.debug("事件监听器:", events);
      const buttonRecord = button, reactKeys = Object.keys(buttonRecord).filter(key => key.includes("react") || key.includes("React"));
      Logger.debug("React相关键:", reactKeys), Logger.debug("父元素:", button.parentElement), 
      Logger.debug("最近的可点击父元素:", button.closest('[role="button"], button, a'));
    }
    static createResizableCodeContainer(content) {
      const codeContainer = DOMUtils.createElement("div", {
        className: "chatgpt-resizable-code-container"
      }), codeBlock = DOMUtils.createElement("pre", {
        className: "bg-black rounded p-4 overflow-auto language-markdown chatgpt-code-block"
      }), codeElement = DOMUtils.createElement("code", {
        className: "chatgpt-code-element"
      }, content);
      codeBlock.appendChild(codeElement);
      const resizeHandle = this.createResizeHandle(codeContainer);
      return codeContainer.appendChild(codeBlock), codeContainer.appendChild(resizeHandle), 
      codeContainer;
    }
    static createResizeHandle(container) {
      const resizeHandle = DOMUtils.createElement("div", {
        className: "chatgpt-resize-handle"
      });
      resizeHandle.innerHTML = '<div class="chatgpt-resize-grip"></div>', resizeHandle.addEventListener("mouseenter", () => {
        resizeHandle.classList.add("chatgpt-resize-handle-hover");
      });
      let isDragging = !1, startY = 0, startHeight = 0;
      return resizeHandle.addEventListener("mouseleave", () => {
        isDragging || resizeHandle.classList.remove("chatgpt-resize-handle-hover");
      }), resizeHandle.addEventListener("mousedown", e => {
        isDragging = !0, startY = e.clientY, startHeight = container.offsetHeight, document.body.style.cursor = "ns-resize", 
        document.body.style.userSelect = "none", e.preventDefault();
      }), document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY, newHeight = Math.max(400, startHeight + deltaY);
        container.style.height = `${newHeight}px`;
      }), document.addEventListener("mouseup", () => {
        isDragging && (isDragging = !1, document.body.style.cursor = "", document.body.style.userSelect = "", 
        resizeHandle.classList.remove("chatgpt-resize-handle-hover"));
      }), resizeHandle;
    }
    static createFloatingPanel() {
      return DOMUtils.createElement("div", {
        className: CSS_CLASSES_FLOAT_PANEL
      });
    }
    static createFloatingButton(content, className, title, onClick) {
      const button = document.createElement("button");
      return button.className = `${CSS_CLASSES_BUTTON} ${className}`.trim(), button.title = title, 
      "string" == typeof content ? button.textContent = content : content?.nodeType === Node.ELEMENT_NODE && button.appendChild(content), 
      onClick && button.addEventListener("click", onClick), button;
    }
    static showNotification(message, type = "info", duration = 3e3) {
      const existing = document.querySelector(".chatgpt-notification");
      existing?.remove();
      const notification = DOMUtils.createElement("div", {
        className: `chatgpt-notification chatgpt-notification-${type}`
      }, message);
      document.body.appendChild(notification), setTimeout(() => {
        notification.classList.add("chatgpt-notification-show");
      }, 10), setTimeout(() => {
        notification.classList.remove("chatgpt-notification-show"), setTimeout(() => {
          notification.remove();
        }, 300);
      }, duration);
    }
    static showConfirmDialog(message, onConfirm, onCancel) {
      confirm(message) ? onConfirm?.() : onCancel?.();
    }
    static scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: CONFIG.UI.ANIMATIONS.scrollBehavior
      });
    }
    static isScrolledToBottom(threshold = 100) {
      return document.body.scrollHeight - (window.pageYOffset || document.documentElement.scrollTop) - window.innerHeight <= threshold;
    }
    static findMainScrollContainer() {
      const lastMessage = document.querySelector("[data-message-author-role]:last-of-type");
      return lastMessage instanceof HTMLElement ? UIUtils.findScrollableParent(lastMessage) : window;
    }
  }
  const settingsUI = new class {
    isOpen=!1;
    overlay=null;
    currentGroup=null;
    formData=getDefaultSettings();
    styleInjected=!1;
    refreshRequiredShown=!1;
    open() {
      if (this.isOpen) return;
      if (!settingsService.isInitialized()) return Logger.error("[SettingsUI] Cannot open - settings service not initialized"), 
      void alert("Settings are still loading. Please try again in a moment.");
      this.styleInjected || (this.injectStyles(), this.styleInjected = !0), this.formData = settingsService.getAll(), 
      this.overlay = this.createModal(), document.body.appendChild(this.overlay);
      const firstGroup = SETTINGS_SCHEMA.groups[0];
      firstGroup && this.showGroup(firstGroup.id), this.isOpen = !0, Logger.info("[SettingsUI] Settings opened");
    }
    close() {
      this.isOpen && (this.overlay?.parentNode && this.overlay.parentNode.removeChild(this.overlay), 
      this.overlay = null, this.isOpen = !1, this.refreshRequiredShown = !1, Logger.info("[SettingsUI] Settings closed"));
    }
    injectStyles() {
      const style = document.createElement("style");
      style.id = "cgw-settings-styles", style.textContent = "/* Settings Modal Styles */\n\n.cgw-settings-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 999999;\n  animation: cgw-fade-in 0.2s ease-out;\n}\n\n@keyframes cgw-fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n.cgw-settings-modal {\n  position: fixed;\n  background: var(--main-surface-primary, #ffffff);\n  border-radius: 16px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n  width: 90%;\n  max-width: 900px;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  animation: cgw-slide-up 0.3s ease-out;\n  color: var(--text-primary, #000000);\n  /* Center by default */\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-modal {\n    background: var(--main-surface-primary, #212121);\n    color: var(--text-primary, #ececec);\n  }\n}\n\n@keyframes cgw-slide-up {\n  from {\n    transform: translate(-50%, calc(-50% + 30px));\n    opacity: 0;\n  }\n  to {\n    transform: translate(-50%, -50%);\n    opacity: 1;\n  }\n}\n\n/* Header */\n.cgw-settings-header {\n  padding: 24px 28px;\n  border-bottom: 1px solid var(--border-light, rgba(0, 0, 0, 0.1));\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  cursor: move;\n  user-select: none;\n}\n\n.cgw-settings-header:active {\n  cursor: grabbing;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-header {\n    border-bottom-color: var(--border-light, rgba(255, 255, 255, 0.1));\n  }\n}\n\n.cgw-settings-title {\n  font-size: 24px;\n  font-weight: 600;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.cgw-settings-close {\n  background: transparent;\n  border: none;\n  font-size: 28px;\n  cursor: pointer;\n  color: var(--text-secondary, #666);\n  padding: 4px 8px;\n  border-radius: 8px;\n  transition: all 0.2s;\n  line-height: 1;\n}\n\n.cgw-settings-close:hover {\n  background: var(--main-surface-secondary, #f9f9f9);\n  color: var(--text-primary, #000);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-close:hover {\n    background: var(--main-surface-secondary, #2f2f2f);\n    color: var(--text-primary, #fff);\n  }\n}\n\n/* Content */\n.cgw-settings-content {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n\n/* Sidebar */\n.cgw-settings-sidebar {\n  width: 240px;\n  background: var(--main-surface-secondary, #f9f9f9);\n  border-right: 1px solid var(--border-light, rgba(0, 0, 0, 0.1));\n  overflow-y: auto;\n  padding: 12px 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-sidebar {\n    background: var(--main-surface-secondary, #2f2f2f);\n    border-right-color: var(--border-light, rgba(255, 255, 255, 0.1));\n  }\n}\n\n.cgw-settings-group-btn {\n  width: 100%;\n  padding: 12px 20px;\n  border: none;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n  font-size: 14px;\n  color: var(--text-secondary, #666);\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  border-left: 3px solid transparent;\n}\n\n.cgw-settings-group-btn:hover {\n  background: var(--main-surface-tertiary, rgba(0, 0, 0, 0.05));\n  color: var(--text-primary, #000);\n}\n\n.cgw-settings-group-btn.active {\n  background: var(--main-surface-tertiary, rgba(100, 150, 250, 0.1));\n  color: var(--primary, #6496fa);\n  border-left-color: var(--primary, #6496fa);\n  font-weight: 500;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-group-btn {\n    color: var(--text-secondary, #b4b4b4);\n  }\n\n  .cgw-settings-group-btn:hover {\n    background: var(--main-surface-tertiary, rgba(255, 255, 255, 0.05));\n    color: var(--text-primary, #fff);\n  }\n}\n\n.cgw-settings-group-icon {\n  font-size: 18px;\n  display: inline-block;\n  min-width: 22px;\n}\n\n/* Main Panel */\n.cgw-settings-main {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px 28px;\n}\n\n.cgw-settings-panel {\n  display: none;\n}\n\n.cgw-settings-panel.active {\n  display: block;\n}\n\n.cgw-settings-panel-header {\n  margin-bottom: 24px;\n}\n\n.cgw-settings-panel-title {\n  font-size: 20px;\n  font-weight: 600;\n  margin: 0 0 8px 0;\n}\n\n.cgw-settings-panel-desc {\n  color: var(--text-secondary, #676767);\n  margin: 0;\n  font-size: 14px;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-panel-desc {\n    color: var(--text-secondary, #b4b4b4);\n  }\n}\n\n/* Field Rows */\n.cgw-settings-field {\n  margin-bottom: 24px;\n  padding-bottom: 24px;\n  border-bottom: 1px solid var(--border-xlight, rgba(0, 0, 0, 0.05));\n  transition:\n    opacity 0.2s,\n    height 0.2s;\n}\n\n.cgw-settings-field:last-child {\n  border-bottom: none;\n}\n\n.cgw-settings-field.hidden {\n  display: none;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-field {\n    border-bottom-color: var(--border-xlight, rgba(255, 255, 255, 0.05));\n  }\n}\n\n.cgw-settings-field-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 8px;\n}\n\n.cgw-settings-field-label {\n  font-size: 15px;\n  font-weight: 500;\n  margin: 0;\n  flex: 1;\n}\n\n.cgw-settings-field-desc {\n  font-size: 13px;\n  color: var(--text-secondary, #676767);\n  margin: 0 0 12px 0;\n  line-height: 1.5;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-field-desc {\n    color: var(--text-secondary, #b4b4b4);\n  }\n}\n\n/* Input Controls */\n.cgw-settings-control {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n/* Toggle Switch */\n.cgw-settings-toggle {\n  position: relative;\n  display: inline-block;\n  width: 50px;\n  height: 28px;\n}\n\n.cgw-settings-toggle input {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n\n.cgw-settings-toggle-slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: var(--toggle-bg, #ccc);\n  transition: 0.3s;\n  border-radius: 28px;\n}\n\n.cgw-settings-toggle-slider:before {\n  position: absolute;\n  content: '';\n  height: 20px;\n  width: 20px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  transition: 0.3s;\n  border-radius: 50%;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n}\n\n.cgw-settings-toggle input:checked + .cgw-settings-toggle-slider {\n  background-color: var(--primary, #6496fa);\n}\n\n.cgw-settings-toggle input:checked + .cgw-settings-toggle-slider:before {\n  transform: translateX(22px);\n}\n\n.cgw-settings-toggle-slider:hover {\n  box-shadow: 0 0 0 8px rgba(100, 150, 250, 0.1);\n}\n\n/* Number Input with Slider */\n.cgw-settings-number {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n\n.cgw-settings-slider {\n  flex: 1;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--main-surface-secondary, #f9f9f9);\n  outline: none;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.cgw-settings-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: var(--primary, #6496fa);\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.cgw-settings-slider::-webkit-slider-thumb:hover {\n  transform: scale(1.2);\n  box-shadow: 0 0 0 8px rgba(100, 150, 250, 0.15);\n}\n\n.cgw-settings-slider::-moz-range-thumb {\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: var(--primary, #6496fa);\n  cursor: pointer;\n  border: none;\n  transition: all 0.2s;\n}\n\n.cgw-settings-slider::-moz-range-thumb:hover {\n  transform: scale(1.2);\n  box-shadow: 0 0 0 8px rgba(100, 150, 250, 0.15);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-slider {\n    background: var(--main-surface-secondary, #2f2f2f);\n  }\n}\n\n.cgw-settings-number-value {\n  min-width: 60px;\n  text-align: center;\n  font-weight: 500;\n  font-size: 14px;\n  padding: 6px 12px;\n  background: var(--main-surface-secondary, #f9f9f9);\n  border-radius: 6px;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-number-value {\n    background: var(--main-surface-secondary, #2f2f2f);\n  }\n}\n\n/* Text Input */\n.cgw-settings-text-input {\n  width: 100%;\n  padding: 10px 14px;\n  border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.15));\n  border-radius: 8px;\n  font-size: 14px;\n  background: var(--main-surface-primary, #fff);\n  color: var(--text-primary, #000);\n  transition: all 0.2s;\n}\n\n.cgw-settings-text-input:focus {\n  outline: none;\n  border-color: var(--primary, #6496fa);\n  box-shadow: 0 0 0 3px rgba(100, 150, 250, 0.1);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-text-input {\n    background: var(--main-surface-primary, #212121);\n    border-color: var(--border-medium, rgba(255, 255, 255, 0.15));\n    color: var(--text-primary, #fff);\n  }\n}\n\n/* Select Dropdown */\n.cgw-settings-select {\n  width: 100%;\n  padding: 10px 14px;\n  border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.15));\n  border-radius: 8px;\n  font-size: 14px;\n  background: var(--main-surface-primary, #fff);\n  color: var(--text-primary, #000);\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.cgw-settings-select:focus {\n  outline: none;\n  border-color: var(--primary, #6496fa);\n  box-shadow: 0 0 0 3px rgba(100, 150, 250, 0.1);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-select {\n    background: var(--main-surface-primary, #212121);\n    border-color: var(--border-medium, rgba(255, 255, 255, 0.15));\n    color: var(--text-primary, #fff);\n  }\n}\n\n/* Color Picker */\n.cgw-settings-color-input {\n  width: 60px;\n  height: 40px;\n  border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.15));\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.cgw-settings-color-input:hover {\n  box-shadow: 0 0 0 3px rgba(100, 150, 250, 0.1);\n}\n\n/* Nested Object Fields */\n.cgw-settings-object {\n  margin-top: 12px;\n  padding: 16px;\n  background: var(--main-surface-secondary, #f9f9f9);\n  border-radius: 8px;\n  border-left: 3px solid var(--primary, #6496fa);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-object {\n    background: var(--main-surface-secondary, #2f2f2f);\n  }\n}\n\n.cgw-settings-object-field {\n  margin-bottom: 16px;\n}\n\n.cgw-settings-object-field:last-child {\n  margin-bottom: 0;\n}\n\n.cgw-settings-object-label {\n  font-size: 13px;\n  font-weight: 500;\n  margin: 0 0 6px 0;\n  display: block;\n}\n\n/* Footer */\n.cgw-settings-footer {\n  padding: 20px 28px;\n  border-top: 1px solid var(--border-light, rgba(0, 0, 0, 0.1));\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-footer {\n    border-top-color: var(--border-light, rgba(255, 255, 255, 0.1));\n  }\n}\n\n.cgw-settings-footer-actions {\n  display: flex;\n  gap: 12px;\n}\n\n.cgw-settings-btn {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.cgw-settings-btn-primary {\n  background: var(--primary, #6496fa);\n  color: white;\n}\n\n.cgw-settings-btn-primary:hover {\n  background: var(--primary-hover, #5080e0);\n  box-shadow: 0 4px 12px rgba(100, 150, 250, 0.3);\n}\n\n.cgw-settings-btn-secondary {\n  background: var(--main-surface-secondary, #f9f9f9);\n  color: var(--text-primary, #000);\n}\n\n.cgw-settings-btn-secondary:hover {\n  background: var(--main-surface-tertiary, #ececec);\n}\n\n.cgw-settings-btn-danger {\n  background: #ff4444;\n  color: white;\n}\n\n.cgw-settings-btn-danger:hover {\n  background: #ff2222;\n  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-btn-secondary {\n    background: var(--main-surface-secondary, #2f2f2f);\n    color: var(--text-primary, #fff);\n  }\n\n  .cgw-settings-btn-secondary:hover {\n    background: var(--main-surface-tertiary, #424242);\n  }\n}\n\n/* Validation Error */\n.cgw-settings-error {\n  color: #ff4444;\n  font-size: 12px;\n  margin-top: 6px;\n  display: none;\n}\n\n.cgw-settings-field.error .cgw-settings-error {\n  display: block;\n}\n\n.cgw-settings-field.error input,\n.cgw-settings-field.error select {\n  border-color: #ff4444;\n}\n\n/* Scrollbar Styling */\n.cgw-settings-sidebar::-webkit-scrollbar,\n.cgw-settings-main::-webkit-scrollbar {\n  width: 8px;\n}\n\n.cgw-settings-sidebar::-webkit-scrollbar-track,\n.cgw-settings-main::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.cgw-settings-sidebar::-webkit-scrollbar-thumb,\n.cgw-settings-main::-webkit-scrollbar-thumb {\n  background: var(--scrollbar-thumb, #c0c0c0);\n  border-radius: 4px;\n}\n\n.cgw-settings-sidebar::-webkit-scrollbar-thumb:hover,\n.cgw-settings-main::-webkit-scrollbar-thumb:hover {\n  background: var(--scrollbar-thumb-hover, #a0a0a0);\n}\n\n@media (prefers-color-scheme: dark) {\n  .cgw-settings-sidebar::-webkit-scrollbar-thumb,\n  .cgw-settings-main::-webkit-scrollbar-thumb {\n    background: var(--scrollbar-thumb, #555);\n  }\n\n  .cgw-settings-sidebar::-webkit-scrollbar-thumb:hover,\n  .cgw-settings-main::-webkit-scrollbar-thumb:hover {\n    background: var(--scrollbar-thumb-hover, #666);\n  }\n}\n\n/* Input wrapper for key-capture */\n.cgw-settings-input-wrapper {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n\n.cgw-settings-input-wrapper input {\n  flex: 1;\n}\n\n.cgw-key-record-btn {\n  flex-shrink: 0;\n  padding: 8px 12px !important;\n  font-size: 13px !important;\n  min-width: 90px;\n  white-space: nowrap;\n}\n\n.cgw-key-record-btn.listening {\n  background: var(--primary, #6496fa) !important;\n  color: white !important;\n  animation: pulse 1s infinite;\n}\n\n@keyframes pulse {\n  0%,\n  100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n", 
      document.head.appendChild(style);
    }
    createModal() {
      const overlay = DOMUtils.createElement("div", "cgw-settings-overlay"), modal = DOMUtils.createElement("div", "cgw-settings-modal");
      modal.appendChild(this.createHeader());
      const content = DOMUtils.createElement("div", "cgw-settings-content");
      return content.appendChild(this.createSidebar()), content.appendChild(this.createMainPanel()), 
      modal.appendChild(content), modal.appendChild(this.createFooter()), overlay.addEventListener("click", event => {
        event.target === overlay && this.close();
      }), overlay.appendChild(modal), overlay;
    }
    createHeader() {
      const header = DOMUtils.createElement("div", "cgw-settings-header");
      header.style.cursor = "move", header.style.userSelect = "none";
      const title = DOMUtils.createElement("h2", "cgw-settings-title");
      title.textContent = SETTINGS_SCHEMA.title;
      const closeBtn = DOMUtils.createElement("button", "cgw-settings-close");
      return closeBtn.textContent = "×", closeBtn.style.cursor = "pointer", closeBtn.addEventListener("click", () => this.close()), 
      header.appendChild(title), header.appendChild(closeBtn), this.addDragFunctionality(header), 
      header;
    }
    addDragFunctionality(header) {
      let isDragging = !1, startX = 0, startY = 0, modalStartX = 0, modalStartY = 0, modal = null;
      const dragStart = event => {
        const target = event.target;
        if (target?.classList.contains("cgw-settings-close")) return;
        if (modal = header.parentElement, !modal) return;
        const rect = modal.getBoundingClientRect();
        if (modalStartX = rect.left, modalStartY = rect.top, "touchstart" === event.type) {
          const touch = event.touches[0];
          startX = touch.clientX, startY = touch.clientY;
        } else startX = event.clientX, startY = event.clientY;
        isDragging = !0, modal.style.transition = "none", modal.style.transform = "none", 
        modal.style.left = `${rect.left}px`, modal.style.top = `${rect.top}px`, header.style.cursor = "grabbing", 
        document.addEventListener("mousemove", drag, {
          passive: !1
        }), document.addEventListener("mouseup", dragEnd), document.addEventListener("touchmove", drag, {
          passive: !1
        }), document.addEventListener("touchend", dragEnd);
      }, drag = event => {
        if (!isDragging || !modal) return;
        let currentX, currentY;
        if (event.preventDefault(), "touchmove" === event.type) {
          const touch = event.touches[0];
          currentX = touch.clientX, currentY = touch.clientY;
        } else currentX = event.clientX, currentY = event.clientY;
        let newX = modalStartX + (currentX - startX), newY = modalStartY + (currentY - startY);
        const maxX = window.innerWidth - modal.offsetWidth, maxY = window.innerHeight - modal.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX)), newY = Math.max(0, Math.min(newY, maxY)), 
        modal.style.left = `${newX}px`, modal.style.top = `${newY}px`;
      }, dragEnd = () => {
        modal && (isDragging = !1, modal.style.transition = "", header.style.cursor = "move", 
        document.removeEventListener("mousemove", drag), document.removeEventListener("mouseup", dragEnd), 
        document.removeEventListener("touchmove", drag), document.removeEventListener("touchend", dragEnd));
      };
      header.addEventListener("mousedown", dragStart), header.addEventListener("touchstart", dragStart, {
        passive: !0
      });
    }
    createSidebar() {
      const sidebar = DOMUtils.createElement("div", "cgw-settings-sidebar");
      return SETTINGS_SCHEMA.groups.forEach(group => {
        const button = DOMUtils.createElement("button", "cgw-settings-group-btn");
        button.dataset.group = group.id;
        const icon = DOMUtils.createElement("span", "cgw-settings-group-icon");
        icon.textContent = group.icon, button.appendChild(icon), button.appendChild(document.createTextNode(group.title)), 
        button.addEventListener("click", () => this.showGroup(group.id)), sidebar.appendChild(button);
      }), sidebar;
    }
    createMainPanel() {
      const main = DOMUtils.createElement("div", "cgw-settings-main");
      return SETTINGS_SCHEMA.groups.forEach(group => {
        const panel = this.createGroupPanel(group.id);
        main.appendChild(panel);
      }), main;
    }
    createGroupPanel(groupId) {
      const group = SETTINGS_SCHEMA.groups.find(g => g.id === groupId);
      if (!group) throw new Error(`Unknown settings group: ${groupId}`);
      const panel = DOMUtils.createElement("div", "cgw-settings-panel");
      panel.dataset.group = group.id;
      const header = DOMUtils.createElement("div", "cgw-settings-panel-header"), title = DOMUtils.createElement("h3", "cgw-settings-panel-title");
      title.textContent = group.title;
      const desc = DOMUtils.createElement("p", "cgw-settings-panel-desc");
      desc.textContent = group.description, header.appendChild(title), header.appendChild(desc), 
      panel.appendChild(header);
      const fields = function(groupId) {
        return Object.entries(SETTINGS_SCHEMA.fields).filter(([_, field]) => field.group === groupId).sort((a, b) => (a[1].order || 0) - (b[1].order || 0)).map(([key, field]) => ({
          key: key,
          field: field
        }));
      }(group.id);
      return fields.forEach(({key: key, field: field}) => {
        const fieldElement = this.createField(key, field);
        panel.appendChild(fieldElement);
      }), panel;
    }
    createField(key, field) {
      const fieldContainer = DOMUtils.createElement("div", "cgw-settings-field");
      fieldContainer.dataset.key = key, isFieldVisible(key, this.formData) || fieldContainer.classList.add("hidden");
      const header = DOMUtils.createElement("div", "cgw-settings-field-header"), label = DOMUtils.createElement("div", "cgw-settings-field-label");
      if (label.textContent = field.label, header.appendChild(label), fieldContainer.appendChild(header), 
      field.description) {
        const desc = DOMUtils.createElement("div", "cgw-settings-field-desc");
        desc.textContent = field.description, fieldContainer.appendChild(desc);
      }
      const control = this.createControl(key, field);
      fieldContainer.appendChild(control);
      const error = DOMUtils.createElement("div", "cgw-settings-error");
      return error.textContent = "Invalid value", fieldContainer.appendChild(error), fieldContainer;
    }
    createControl(key, field) {
      switch (field.type) {
       case FIELD_TYPES_BOOLEAN:
        return this.createToggle(key);

       case FIELD_TYPES_NUMBER:
        return this.createNumberInput(key, field);

       case FIELD_TYPES_TEXT:
        return this.createTextInput(key, field);

       case FIELD_TYPES_SELECT:
        return this.createSelect(key, field);

       case FIELD_TYPES_COLOR:
        return this.createColorPicker(key, field);

       case FIELD_TYPES_OBJECT:
        return this.createObjectField(key, field);

       default:
        return DOMUtils.createElement("div", "cgw-settings-control");
      }
    }
    createToggle(key) {
      const label = DOMUtils.createElement("label", "cgw-settings-toggle"), input = document.createElement("input");
      input.type = "checkbox", input.checked = Boolean(this.formData[key]), input.dataset.key = key, 
      input.addEventListener("change", event => {
        const target = event.target;
        this.updateValue(key, target.checked);
      });
      const slider = DOMUtils.createElement("span", "cgw-settings-toggle-slider");
      return label.appendChild(input), label.appendChild(slider), label;
    }
    createNumberInput(key, field) {
      const container = DOMUtils.createElement("div", "cgw-settings-number"), slider = document.createElement("input");
      slider.type = "range", slider.min = String(field.min ?? 0), slider.max = String(field.max ?? 100), 
      slider.step = String(field.step ?? 1), slider.value = String(this.formData[key] ?? field.default), 
      slider.className = "cgw-settings-slider", slider.dataset.key = key;
      const valueDisplay = DOMUtils.createElement("span", "cgw-settings-number-value");
      return valueDisplay.textContent = `${slider.value}${field.unit ?? ""}`, slider.addEventListener("input", event => {
        const target = event.target, value = parseFloat(target.value);
        valueDisplay.textContent = `${value}${field.unit ?? ""}`, this.updateValue(key, value);
      }), container.appendChild(slider), container.appendChild(valueDisplay), container;
    }
    createTextInput(key, field) {
      const input = document.createElement("input");
      return input.type = "text", input.value = String(this.formData[key] ?? field.default ?? ""), 
      input.placeholder = field.placeholder ?? "", input.className = "cgw-settings-text-input", 
      input.dataset.key = key, input.addEventListener("input", event => {
        const target = event.target;
        this.updateValue(key, target.value);
      }), input;
    }
    createSelect(key, field) {
      const select = document.createElement("select");
      return select.className = "cgw-settings-select", select.dataset.key = key, field.options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value, opt.textContent = option.label, opt.selected = this.formData[key] === option.value, 
        select.appendChild(opt);
      }), select.addEventListener("change", event => {
        const target = event.target;
        this.updateValue(key, target.value);
      }), select;
    }
    createColorPicker(key, field) {
      const input = document.createElement("input");
      return input.type = "color", input.value = String(this.formData[key] ?? field.default ?? "#ffffff"), 
      input.className = "cgw-settings-color-input", input.dataset.key = key, input.addEventListener("input", event => {
        const target = event.target;
        this.updateValue(key, target.value);
      }), input;
    }
    createObjectField(key, field) {
      const container = DOMUtils.createElement("div", "cgw-settings-object"), nestedFields = field.fields ?? {}, currentValue = this.formData[key] ?? {};
      return Object.entries(nestedFields).forEach(([nestedKey, nestedField]) => {
        const nestedContainer = DOMUtils.createElement("div", "cgw-settings-object-field"), label = DOMUtils.createElement("label", "cgw-settings-object-label");
        label.textContent = nestedField.label, nestedContainer.appendChild(label);
        const fullKey = `${String(key)}.${nestedKey}`, nestedDefaults = nestedField.default ?? "", value = currentValue[nestedKey] ?? nestedDefaults, input = this.createNestedInput(fullKey, nestedField, value);
        nestedContainer.appendChild(input), container.appendChild(nestedContainer);
      }), container;
    }
    createNestedInput(fullKey, field, value) {
      const wrapper = DOMUtils.createElement("div", "cgw-settings-input-wrapper");
      if (field.type === FIELD_TYPES_COLOR) {
        const input = document.createElement("input");
        input.type = "color", input.value = value, input.className = "cgw-settings-color-input", 
        input.dataset.key = fullKey, input.addEventListener("input", event => {
          const target = event.target;
          this.updateNestedValue(fullKey, target.value);
        }), wrapper.appendChild(input);
      } else {
        const input = document.createElement("input");
        input.type = "text", input.value = value, input.placeholder = field.placeholder ?? "", 
        input.className = "cgw-settings-text-input", input.dataset.key = fullKey, input.addEventListener("input", event => {
          const target = event.target;
          this.updateNestedValue(fullKey, target.value);
        }), wrapper.appendChild(input), fullKey.startsWith("keyboardShortcuts.") && this.attachShortcutRecorder(wrapper, input, fullKey);
      }
      return wrapper;
    }
    attachShortcutRecorder(wrapper, input, fullKey) {
      const button = DOMUtils.createElement("button", "cgw-settings-btn cgw-settings-btn-secondary cgw-key-record-btn");
      button.type = "button", button.innerHTML = "⌨️ Record", button.title = "Click to record a key combination";
      let isListening = !1, keydownHandler = null;
      button.addEventListener("click", event => {
        if (event.preventDefault(), event.stopPropagation(), isListening) return keydownHandler && document.removeEventListener("keydown", keydownHandler), 
        isListening = !1, button.textContent = "⌨️ Record", button.classList.remove("listening"), 
        void (input.disabled = !1);
        isListening = !0, button.textContent = "🎙️ Listening...", button.classList.add("listening"), 
        input.disabled = !0, input.focus(), keydownHandler = keyEvent => {
          keyEvent.preventDefault(), keyEvent.stopPropagation();
          const parts = [];
          if (keyEvent.ctrlKey && parts.push("Ctrl"), keyEvent.altKey && parts.push("Alt"), 
          keyEvent.shiftKey && parts.push("Shift"), keyEvent.metaKey && parts.push("Meta"), 
          keyEvent.key && ![ "Control", "Alt", "Shift", "Meta" ].includes(keyEvent.key) && parts.push(keyEvent.key), 
          parts.length > 0) {
            const keyCombination = parts.join("+");
            input.value = keyCombination, this.updateNestedValue(fullKey, keyCombination), document.removeEventListener("keydown", keydownHandler), 
            isListening = !1, button.textContent = "⌨️ Record", button.classList.remove("listening"), 
            input.disabled = !1;
          }
        }, document.addEventListener("keydown", keydownHandler);
      }), wrapper.appendChild(button);
    }
    createFooter() {
      const footer = DOMUtils.createElement("div", "cgw-settings-footer"), leftActions = DOMUtils.createElement("div", "cgw-settings-footer-actions"), resetBtn = DOMUtils.createElement("button", "cgw-settings-btn cgw-settings-btn-danger");
      resetBtn.textContent = "Reset to Defaults", resetBtn.addEventListener("click", () => this.resetToDefaults()), 
      leftActions.appendChild(resetBtn);
      const rightActions = DOMUtils.createElement("div", "cgw-settings-footer-actions"), exportBtn = DOMUtils.createElement("button", "cgw-settings-btn cgw-settings-btn-secondary");
      exportBtn.textContent = "Export", exportBtn.addEventListener("click", () => this.exportSettings()), 
      rightActions.appendChild(exportBtn);
      const importBtn = DOMUtils.createElement("button", "cgw-settings-btn cgw-settings-btn-secondary");
      importBtn.textContent = "Import", importBtn.addEventListener("click", () => this.importSettings()), 
      rightActions.appendChild(importBtn);
      const closeBtn = DOMUtils.createElement("button", "cgw-settings-btn cgw-settings-btn-primary");
      return closeBtn.textContent = "Close", closeBtn.addEventListener("click", () => this.close()), 
      rightActions.appendChild(closeBtn), footer.appendChild(leftActions), footer.appendChild(rightActions), 
      footer;
    }
    showGroup(groupId) {
      if (!this.overlay) return;
      this.overlay.querySelectorAll(".cgw-settings-group-btn").forEach(button => {
        button.dataset.group === groupId ? button.classList.add("active") : button.classList.remove("active");
      });
      this.overlay.querySelectorAll(".cgw-settings-panel").forEach(panel => {
        panel.dataset.group === groupId ? panel.classList.add("active") : panel.classList.remove("active");
      }), this.currentGroup = groupId;
    }
    updateValue(key, value) {
      this.formData[key] = value, settingsService.set(key, value);
      const field = SETTINGS_SCHEMA.fields[key];
      field?.requiresRefresh && !this.refreshRequiredShown && (this.refreshRequiredShown = !0, 
      UIUtils.showNotification("⚠️ This setting requires a page refresh to take effect", "warning", 5e3)), 
      this.updateFieldVisibility(), Logger.debug(`[SettingsUI] Updated ${String(key)} =`, value);
    }
    updateNestedValue(fullKey, value) {
      const [parentKey, childKey] = fullKey.split("."), existing = {
        ...this.formData[parentKey]
      };
      existing[childKey] = value, this.formData[parentKey] = existing, settingsService.set(parentKey, existing), 
      Logger.debug(`[SettingsUI] Updated ${fullKey} =`, value);
    }
    updateFieldVisibility() {
      if (!this.overlay) return;
      this.overlay.querySelectorAll(".cgw-settings-field").forEach(field => {
        isFieldVisible(field.dataset.key, this.formData) ? field.classList.remove("hidden") : field.classList.add("hidden");
      });
    }
    renderAllGroups() {
      if (!this.overlay) return;
      const mainPanel = this.overlay.querySelector(".cgw-settings-main");
      mainPanel && (mainPanel.innerHTML = "", SETTINGS_SCHEMA.groups.forEach(group => {
        const panel = this.createGroupPanel(group.id);
        mainPanel.appendChild(panel);
      }));
    }
    resetToDefaults() {
      confirm("Are you sure you want to reset all settings to default values?") && (settingsService.reset(), 
      this.formData = settingsService.getAll(), this.renderAllGroups(), Logger.info("[SettingsUI] Settings reset to defaults - UI updated"));
    }
    exportSettings() {
      const json = settingsService.export(), blob = new Blob([ json ], {
        type: "application/json"
      }), url = window.URL.createObjectURL(blob), anchor = document.createElement("a");
      anchor.href = url, anchor.download = "chatgpt-widescreen-settings.json", anchor.click(), 
      window.URL.revokeObjectURL(url), Logger.info("[SettingsUI] Settings exported");
    }
    importSettings() {
      const input = document.createElement("input");
      input.type = "file", input.accept = "application/json", input.addEventListener("change", event => {
        const target = event.target, file = target.files?.[0];
        if (!file) return;
        const reader = new FileReader;
        reader.onload = loadEvent => {
          try {
            const json = String(loadEvent.target?.result ?? ""), result = settingsService.import(json);
            result.success ? (this.formData = settingsService.getAll(), this.close(), setTimeout(() => this.open(), 100), 
            alert("Settings imported successfully!"), Logger.info("[SettingsUI] Settings imported")) : result.error && alert(`Failed to import settings: ${result.error}`);
          } catch (error) {
            alert("Failed to import settings: Invalid JSON file"), Logger.error("[SettingsUI] Import error:", error);
          }
        }, reader.readAsText(file);
      }), input.click();
    }
  };
  const DEFAULT_BUTTON_BACKGROUND = "rgba(30, 30, 35, 0.95)";
  function generateDynamicStyles(styleConfig = {}) {
    const {buttons: buttons = {}, widescreenWidth: widescreenWidth = 90} = styleConfig;
    return `\n    ${function(config = {}) {
      const {borderWidth: borderWidth = "2px", borderRadius: borderRadius = "8px", width: width = "38px", height: height = "38px", background: background = DEFAULT_BUTTON_BACKGROUND, borderColor: borderColor = "rgba(100, 150, 250, 0.6)", fontSize: fontSize = "16px", fontWeight: fontWeight = "700"} = config;
      return `\n    .chatgpt-widescreen-btn,\n    .floating-collapse-btn,\n    .floating-scroll-btn {\n      border: ${borderWidth} solid;\n      border-radius: ${borderRadius};\n      width: ${width};\n      height: ${height};\n      background: ${background} !important;\n      border-color: ${borderColor} !important;\n      font-size: ${fontSize};\n      font-weight: ${fontWeight};\n    }\n  `;
    }(buttons)}\n    \n    :root {\n      --cgw-widescreen-width: ${widescreenWidth}%;\n    }\n  `;
  }
  class StyleManager {
    injectedStyles=new Map;
    styleOverrides={};
    injectCSS(id, css) {
      if (this.injectedStyles.has(id)) return this.injectedStyles.get(id);
      const style = document.createElement("style");
      return style.id = `chatgpt-widescreen-${id}`, style.textContent = css, document.head.appendChild(style), 
      this.injectedStyles.set(id, style), style;
    }
    removeCSS(id) {
      const style = this.injectedStyles.get(id);
      style?.parentNode && style.parentNode.removeChild(style), this.injectedStyles.delete(id);
    }
    setStyleOverrides(overrides = {}) {
      this.styleOverrides = {
        ...this.styleOverrides,
        ...overrides
      }, this.updateDynamicStyles();
    }
    getButtonStyles() {
      return {
        ...CONFIG.BUTTON_STYLES,
        ...this.styleOverrides.buttons ?? {}
      };
    }
    updateDynamicStyles() {
      const dynamicCSS = generateDynamicStyles({
        buttons: this.getButtonStyles(),
        widescreenWidth: this.styleOverrides.widescreenWidth
      });
      this.updateCSS("dynamic", dynamicCSS);
    }
    initAllStyles() {
      this.injectCSS("base", "/* Base utility classes */\n.chatgpt-hidden {\n  display: none !important;\n}\n\n.invisible {\n  visibility: hidden !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n}\n"), 
      this.injectCSS("widescreen", "/* ChatGPT 宽屏模式样式 */\n\n.chatgpt-widescreen {\n  max-width: none !important;\n  width: var(--cgw-widescreen-width, 90%) !important;\n}\n\nhtml.light:root,\nhtml.dark:root {\n  --user-chat-width: 100%;\n}\n/* 可调整大小的代码容器样式 */\n.chatgpt-resizable-code-container {\n  position: relative;\n  min-height: 400px;\n  max-height: 1000px;\n  height: 800px;\n  border-radius: 6px;\n  display: flex;\n  flex-direction: column;\n}\n\n.chatgpt-code-block {\n  background-color: transparent;\n  color: #c9d1d9;\n  font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;\n  font-size: 14px;\n  line-height: 1.45;\n  border: none;\n  margin: 0;\n  padding: 16px;\n  flex: 1;\n  min-height: 0;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n\n.chatgpt-code-element {\n  color: inherit;\n  background-color: transparent;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n\n/* 调整大小手柄样式 */\n.chatgpt-resize-handle {\n  height: 12px;\n  cursor: ns-resize;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-bottom-left-radius: 6px;\n  border-bottom-right-radius: 6px;\n  transition: background-color 0.2s ease;\n}\n\n.chatgpt-resize-grip {\n  width: 40px;\n  height: 3px;\n  background: #6e7681;\n  border-radius: 2px;\n  transition: background-color 0.2s ease;\n}\n\n.chatgpt-resize-handle-hover {\n  background-color: #30363d;\n}\n\n.chatgpt-resize-handle-hover .chatgpt-resize-grip {\n  background: #8b949e;\n}\n\n/* 通知样式 */\n.chatgpt-notification {\n  position: fixed;\n  top: 20px;\n  right: 20px;\n  color: white;\n  padding: 12px 20px;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  z-index: 100000;\n  font-size: 14px;\n  font-weight: 500;\n  max-width: 300px;\n  transform: translateX(100%);\n  transition: transform 0.3s ease-out;\n  backdrop-filter: blur(10px);\n}\n\n.chatgpt-notification-success {\n  background: rgba(34, 197, 94, 0.9);\n}\n\n.chatgpt-notification-error {\n  background: rgba(239, 68, 68, 0.9);\n}\n\n.chatgpt-notification-warning {\n  background: rgba(245, 158, 11, 0.9);\n}\n\n.chatgpt-notification-info {\n  background: rgba(59, 130, 246, 0.9);\n}\n\n.chatgpt-notification-show {\n  transform: translateX(0);\n}\n"), 
      this.injectCSS("buttons", "/* 浮动按钮容器样式 */\n.chatgpt-widescreen-float-panel {\n  position: fixed;\n  top: 50%;\n  right: 20px;\n  transform: translateY(-50%);\n  z-index: 10000;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  pointer-events: none;\n  max-height: 80vh;\n  overflow-y: auto;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n\n/* 浮动按钮基础样式 */\n.chatgpt-widescreen-btn,\n.floating-collapse-btn,\n.floating-scroll-btn {\n  cursor: pointer;\n  transition: all 0.2s ease-out;\n  z-index: 10000 !important;\n  backdrop-filter: blur(10px);\n  opacity: 1 !important;\n  pointer-events: auto !important;\n  display: block;\n  text-align: center;\n  line-height: 1;\n  padding: 0;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);\n}\n\n.floating-collapse-btn,\n.floating-scroll-btn {\n  position: fixed;\n  top: 50%;\n}\n\n.chatgpt-widescreen-btn {\n  position: relative;\n}\n\n/* 折叠按钮专用样式 */\n.floating-collapse-btn {\n  right: 70px;\n  box-shadow:\n    0 3px 12px rgba(0, 0, 0, 0.4),\n    0 1px 3px rgba(100, 150, 250, 0.3) !important;\n}\n\n/* 跳转按钮专用样式 */\n.floating-scroll-btn {\n  right: 20px;\n  box-shadow:\n    0 3px 12px rgba(0, 0, 0, 0.4),\n    0 1px 3px rgba(150, 100, 250, 0.3) !important;\n}\n\n/* 通用悬停效果 */\n.chatgpt-widescreen-btn:hover,\n.floating-collapse-btn:hover,\n.floating-scroll-btn:hover {\n  background: var(--main-surface-tertiary, rgba(20, 20, 25, 0.98)) !important;\n  color: var(--text-primary, #ffffff) !important;\n  border-color: var(--border-medium, rgba(255, 255, 255, 0.9)) !important;\n  box-shadow:\n    0 4px 20px rgba(0, 0, 0, 0.5),\n    0 2px 8px rgba(200, 140, 240, 0.5) !important;\n}\n\n/* 用户消息按钮专用紫色样式 */\n.user-message-btn {\n  border-color: rgba(180, 120, 220, 0.4) !important;\n  box-shadow:\n    0 3px 12px rgba(0, 0, 0, 0.4),\n    0 1px 3px rgba(180, 120, 220, 0.4) !important;\n}\n\n.floating-collapse-btn.visible,\n.floating-scroll-btn.visible {\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n\n/* 被控制的对话高亮效果 */\n.conversation-highlighted {\n  position: relative;\n}\n\n.conversation-highlighted::before {\n  content: '';\n  position: absolute;\n  left: -8px;\n  top: 0;\n  bottom: 0;\n  width: 3px;\n  background: linear-gradient(180deg, #64b5f6, #42a5f5);\n  border-radius: 1.5px;\n  opacity: 0.8;\n}\n\n/* 用户消息的折叠线显示在右边 - 紫色系优雅配色 */\n.conversation-highlighted[data-message-author-role='user']::before {\n  left: auto;\n  right: -8px;\n  background: linear-gradient(180deg, #ba68c8, #ab47bc);\n}\n\n/* 对话操作按钮样式 */\n.conversation-item-actions {\n  opacity: 0;\n  display: flex;\n  gap: 4px;\n  margin-left: auto;\n  margin-right: 8px;\n  transition: opacity 0.2s ease;\n  z-index: 100;\n  position: absolute;\n  right: 8px;\n  top: 50%;\n  transform: translateY(-50%);\n}\n\n.conversation-item:hover .conversation-item-actions,\n.conversation-item:focus-within .conversation-item-actions {\n  opacity: 1;\n}\n\n/* 始终显示按钮的选项（可选） */\n.conversation-item-actions.always-visible {\n  opacity: 1;\n}\n\n.conversation-action-btn {\n  width: 26px;\n  height: 26px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 13px;\n  transition: all 0.2s ease;\n  z-index: 101;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  min-width: 26px;\n  flex-shrink: 0;\n}\n\n.conversation-action-btn:hover {\n  background: var(--main-surface-tertiary, rgba(65, 65, 75, 0.95));\n  color: var(--text-primary, rgba(220, 220, 235, 1));\n  transform: scale(1.1);\n}\n\n/* 确保对话项有足够的空间容纳按钮 */\n.conversation-item {\n  position: relative !important;\n  align-items: center !important;\n}\n\n.conversation-item [role='menuitem'] {\n  position: relative !important;\n  display: flex !important;\n  align-items: center !important;\n  min-height: 44px !important;\n  padding-right: 80px !important;\n}\n\n/* 暗色主题样式 */\nhtml.dark .conversation-action-btn {\n  background: var(--main-surface-secondary, rgba(35, 35, 40, 0.8));\n  color: var(--text-secondary, rgba(200, 200, 210, 0.9));\n}\n\nhtml.dark .conversation-action-btn:hover {\n  background: var(--main-surface-tertiary, rgba(55, 55, 65, 0.95));\n  color: var(--text-primary, rgba(220, 220, 235, 1));\n}\n\n/* Markdown切换按钮样式 */\n.markdown-toggle-button {\n  transition: all 0.2s ease;\n}\n\n.markdown-toggle-button:hover {\n  background-color: var(--main-surface-secondary, rgba(0, 0, 0, 0.05)) !important;\n  transform: scale(1.05);\n}\n\nhtml.dark .markdown-toggle-button:hover {\n  background-color: var(--main-surface-tertiary, rgba(255, 255, 255, 0.1)) !important;\n}\n\n.markdown-toggle-button .icon-md-heavy {\n  transition: all 0.2s ease;\n}\n\n.markdown-toggle-button:active .icon-md-heavy {\n  transform: scale(0.95);\n}\n\n/* 消息跳转高亮效果 */\n.message-navigation-highlight {\n  position: relative;\n  animation: messageHighlight 3s ease-out;\n}\n\n.message-navigation-highlight::before {\n  content: '';\n  position: absolute;\n  left: -12px;\n  top: -4px;\n  bottom: -4px;\n  width: 4px;\n  background: linear-gradient(180deg, #4caf50, #45a049);\n  border-radius: 2px;\n  opacity: 0.9;\n  animation: highlightPulse 3s ease-out;\n}\n\n/* 用户消息的高亮显示在右边 */\n.message-navigation-highlight[data-message-author-role='user']::before {\n  left: auto;\n  right: -12px;\n  /* background: linear-gradient(180deg, #FF9800, #F57C00); */\n}\n\n@keyframes messageHighlight {\n  0% {\n    background-color: rgba(76, 175, 80, 0.15);\n  }\n\n  20% {\n    background-color: rgba(76, 175, 80, 0.1);\n  }\n\n  100% {\n    background-color: transparent;\n  }\n}\n@keyframes highlightPulse {\n  0% {\n    opacity: 0.9;\n    width: 4px;\n  }\n\n  20% {\n    opacity: 1;\n    width: 6px;\n  }\n\n  100% {\n    opacity: 0.7;\n    width: 4px;\n  }\n}\n"), 
      this.injectCSS("messages", "/* 消息折叠和展开样式 */\n\n.direct-collapse pre {\n  max-width: 100% !important;\n  width: 100% !important;\n  box-sizing: border-box !important;\n  overflow-x: auto !important;\n  white-space: pre-wrap !important;\n  word-wrap: break-word !important;\n  margin: 0 !important;\n}\n\n.direct-collapse code {\n  white-space: pre-wrap !important;\n  word-wrap: break-word !important;\n}\n\n.direct-collapse {\n  max-height: 160px;\n  overflow: hidden;\n  position: relative;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  border-radius: 8px;\n}\n\n.direct-collapse:hover {\n  background-color: rgba(255, 255, 255, 0.03);\n  border-color: rgba(100, 150, 250, 0.3);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n\nhtml.dark .direct-collapse:hover {\n  background-color: rgba(255, 255, 255, 0.08);\n  border-color: rgba(100, 150, 250, 0.4);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n\n.direct-collapse::after {\n  content: '点击展开完整内容 ↓';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 100px;\n  background: linear-gradient(transparent 20%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.85) 100%);\n  pointer-events: none;\n  z-index: 10;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  padding: 12px;\n  font-size: 14px;\n  color: #ffffff;\n  font-weight: 600;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);\n  backdrop-filter: blur(0.5px);\n  border-radius: 0 0 8px 8px;\n}\n\nhtml.dark .direct-collapse::after {\n  background: linear-gradient(transparent 20%, rgba(0, 0, 0, 0.8) 70%, rgba(0, 0, 0, 0.9) 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);\n}\n\n/* 折叠区域动画效果 */\n.direct-collapse::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: linear-gradient(45deg, rgba(100, 150, 250, 0.05) 0%, rgba(150, 100, 250, 0.05) 50%, rgba(100, 150, 250, 0.05) 100%);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  z-index: 5;\n  pointer-events: none;\n}\n\n.direct-collapse:hover::before {\n  opacity: 1;\n}\n"), 
      this.updateDynamicStyles();
    }
    updateCSS(id, css) {
      this.removeCSS(id), this.injectCSS(id, css);
    }
    static parseCSSValue(cssValue) {
      return "string" == typeof cssValue ? parseFloat(cssValue.replace(/px$/, "")) || 0 : cssValue ?? 0;
    }
    cleanup() {
      this.injectedStyles.forEach((_style, id) => {
        this.removeCSS(id);
      });
    }
  }
  class MessageHandler {
    messageButtons=new Map;
    hasAutoCollapsed=!settingsService.get("autoCollapse");
    retryCount=0;
    app;
    intersectionObserver=null;
    updateMessageButtonsStateDebounceHandler=null;
    unlistenMessageUpdated=null;
    unlistenButtonCreated=null;
    unlistenMessageCollapsed=null;
    constructor(app = null) {
      this.app = app, this.init();
    }
    init() {
      this.setupEventListeners(), this.setupScrollObserver(), this.handleInitialMessages();
    }
    immediateScrollHandler(source) {
      EventManager.dispatch(EVENTS_SCROLL_DETECTED, {
        source: source
      });
    }
    setupEventListeners() {
      this.unlistenMessageUpdated = EventManager.listen([ EVENTS_LONG_MESSAGES_UPDATED, EVENTS_SCROLL_DETECTED, EVENTS_PAGE_RESIZE ], (data, event) => {
        Logger.debug("按钮更新触发:" + event.type + " source:" + data?.source), this.updateMessageButtonsState();
      }), this.unlistenButtonCreated = EventManager.listen(EVENTS_BUTTON_CREATED, () => this.addMarkdownButtonToAllMessages()), 
      this.unlistenMessageCollapsed = EventManager.listen(EVENTS_MESSAGE_COLLAPSED, data => {
        data?.messages && (Logger.debug("检测到消息内容变化，重置相关Markdown按钮状态，影响消息数:", data.messages.length), 
        this.resetMarkdownButtonsForMessages(data.messages));
      });
    }
    setupScrollObserver() {
      window.addEventListener("wheel", () => this.immediateScrollHandler("wheel"), {
        passive: !0
      });
      const debounceHandler = DOMUtils.debounce(() => this.immediateScrollHandler("intersection-observer"), 100), observer = new IntersectionObserver(entries => {
        let hasChanges = !1;
        entries.forEach(entry => {
          !entry.isIntersecting && entry.isIntersecting || (hasChanges = !0);
        }), hasChanges && debounceHandler();
      }, {
        threshold: [ 0, .1, .5, .9, 1 ],
        rootMargin: "50px"
      });
      this.intersectionObserver = observer, setTimeout(() => {
        MessageHandler.getAllMessages().forEach(msg => observer.observe(msg));
      }, 2e3), window.addEventListener("resize", DOMUtils.debounce(() => {
        EventManager.dispatch(EVENTS_PAGE_RESIZE);
      }, 500));
    }
    handleInitialMessages() {
      setTimeout(() => {
        this.updateMessageButtonsState(), this.addMarkdownButtonToAllMessages();
      }, 1e3);
    }
    isMessageCollapsed(messageEl) {
      return !!messageEl?.classList?.contains(CSS_CLASSES_COLLAPSED);
    }
    collapseMessage(messageEl) {
      if (messageEl && !this.isMessageCollapsed(messageEl)) {
        if ("true" === messageEl.dataset.isProcessContainer) {
          const elementsToCollapse = messageEl._elementsToCollapse, firstSpan = messageEl._firstSpan;
          elementsToCollapse && (firstSpan && messageEl.appendChild(firstSpan), elementsToCollapse.forEach(el => {
            messageEl.appendChild(el);
          }));
        }
        messageEl.classList.add(CSS_CLASSES_COLLAPSED), this.addClickToExpandFeature(messageEl);
      }
    }
    uncollapseMessage(messageEl) {
      if (messageEl && this.isMessageCollapsed(messageEl) && (messageEl.classList.remove(CSS_CLASSES_COLLAPSED), 
      "true" === messageEl.dataset.isProcessContainer)) {
        const parent = messageEl.parentElement;
        Array.from(messageEl.childNodes).forEach(node => {
          parent?.insertBefore(node, messageEl);
        });
      }
    }
    collapseAllMessages() {
      try {
        if (!this.messageButtons || 0 === this.messageButtons.size) return;
        const changed = [];
        this.messageButtons.forEach((_buttons, messageEl) => {
          this.isMessageCollapsed(messageEl) || (this.collapseMessage(messageEl), changed.push(messageEl));
        }), changed.length > 0 && (EventManager.dispatch(EVENTS_MESSAGE_COLLAPSED, {
          messages: changed
        }), EventManager.dispatch(EVENTS_LONG_MESSAGES_UPDATED), UIUtils.showNotification(`已折叠 ${changed.length} 条消息`, "info"));
      } catch (e) {
        Logger.error("折叠所有消息时出错:", e), UIUtils.showNotification("折叠失败，请重试", "error");
      }
    }
    expandAllMessages() {
      try {
        const messages = MessageHandler.getAllMessages();
        if (!messages || 0 === messages.length) return void UIUtils.showNotification("没有可展开的消息", "warning");
        const changed = [];
        messages.forEach(msg => {
          this.isMessageCollapsed(msg) && (this.uncollapseMessage(msg), changed.push(msg));
        }), changed.length > 0 ? (EventManager.dispatch(EVENTS_MESSAGE_EXPANDED, {
          messages: changed
        }), EventManager.dispatch(EVENTS_LONG_MESSAGES_UPDATED), UIUtils.showNotification(`已展开 ${changed.length} 条消息`, "info")) : UIUtils.showNotification("没有需要展开的消息", "info");
      } catch (e) {
        Logger.error("展开所有消息时出错:", e), UIUtils.showNotification("展开失败，请重试", "error");
      }
    }
    addClickToExpandFeature(messageEl) {
      if (!messageEl || "true" === messageEl.dataset.clickToExpandAdded) return;
      const isProcessContainer = "true" === messageEl.dataset.isProcessContainer;
      messageEl.addEventListener("click", e => {
        const target = e.target;
        if ((isProcessContainer || "BUTTON" !== target?.tagName && "A" !== target?.tagName && !target?.closest("button")) && this.isMessageCollapsed(messageEl)) {
          e.preventDefault(), e.stopPropagation(), this.uncollapseMessage(messageEl);
          const buttons = this.messageButtons.get(messageEl);
          buttons && buttons.collapseBtn && (buttons.collapseBtn.innerHTML = "▲"), setTimeout(() => {
            this.immediateScrollHandler("click-to-expand");
          }, 50);
        }
      }, !0), messageEl.dataset.clickToExpandAdded = "true";
    }
    updateMessageButtonsState() {
      const allMessages = MessageHandler.getAllMessages(), {analysisMessages: analysisMessages, hasEmptyContent: hasEmptyContent} = MessageHandler.analysisMessages(allMessages);
      this.messageButtons.forEach((buttons, _messageEl) => {
        buttons.collapseBtn && (buttons.collapseBtn.style.display = "none"), buttons.scrollBtn && (buttons.scrollBtn.style.display = "none");
      }), analysisMessages.forEach((analysis, _index) => {
        const {messageEl: messageEl, lineCount: lineCount, textLength: textLength} = analysis, container = UIUtils.findScrollableParent(messageEl);
        if (MessageHandler.isLongMessage(lineCount, textLength) && !this.messageButtons.has(messageEl)) {
          const buttons = this.createFloatingButtonForMessage(container, messageEl);
          this.messageButtons.set(messageEl, buttons);
        }
        const parentElement = messageEl.parentElement;
        if (!parentElement) return;
        let processContainer = parentElement.querySelector(".process-collapse-container");
        if (!processContainer) {
          let firstSpan = null, start = 0;
          parentElement?.children?.length > 0 && "SPAN" === parentElement.children[0].tagName && (firstSpan = parentElement.children[0], 
          start = 1);
          const needToCollapse = [];
          for (let i = start; i < parentElement.children.length; i += 2) {
            const child0 = parentElement.children[i], child1 = parentElement.children[i + 1];
            "SPAN" === child0?.tagName && "DIV" === child1?.tagName && child1.classList.contains("overflow-hidden") && (needToCollapse.push(child0), 
            needToCollapse.push(child1));
          }
          if (!(needToCollapse.length > 0)) return;
          {
            processContainer = document.createElement("div"), processContainer.classList.add("process-collapse-container"), 
            processContainer.dataset.isProcessContainer = "true", parentElement.insertBefore(processContainer, parentElement.firstChild), 
            processContainer._elementsToCollapse = needToCollapse, processContainer._firstSpan = firstSpan;
            const buttons = this.createFloatingButtonForMessage(container, processContainer);
            this.messageButtons.set(processContainer, buttons), Logger.debug("为分析过程创建折叠按钮:", processContainer);
          }
        }
      }), analysisMessages.forEach((analysis, index) => {
        const {messageEl: messageEl} = analysis, buttons = this.messageButtons.get(messageEl);
        buttons && DOMUtils.isElementVisible(messageEl, CONFIG.MESSAGE.VISIBILITY_THRESHOLD) && this.positionButtons(buttons, analysis, index, analysisMessages.length);
        const parentElement = messageEl.parentElement;
        if (!parentElement) return;
        const processContainer = parentElement.querySelector(".process-collapse-container");
        if (processContainer) {
          let firstVisible = null;
          const elements = processContainer._elementsToCollapse ?? [];
          for (const el of elements) if (DOMUtils.isElementVisible(el, CONFIG.MESSAGE.VISIBILITY_THRESHOLD)) {
            firstVisible = el;
            break;
          }
          if (firstVisible) {
            const buttons = this.messageButtons.get(processContainer);
            this.positionButtons(buttons, {
              messageEl: processContainer,
              rect: firstVisible.getBoundingClientRect(),
              type: "container"
            }, index, analysisMessages.length);
          }
        }
      }), hasEmptyContent && this.retryCount < 10 && (this.updateMessageButtonsStateDebounceHandler || (this.updateMessageButtonsStateDebounceHandler = DOMUtils.debounce(() => {
        this.retryCount++, this.updateMessageButtonsState();
      }, 1e3)), this.updateMessageButtonsStateDebounceHandler()), !this.hasAutoCollapsed && (allMessages.length > 0 && !hasEmptyContent || this.retryCount >= 10) && (this.hasAutoCollapsed = !0, 
      this.retryCount >= 10 && hasEmptyContent ? Logger.debug("内容加载重试已达到最大次数(10次)，停止重试") : this.collapseAllMessages()), 
      this.cleanupRemovedMessages();
    }
    createFloatingButtonForMessage(container, messageEl) {
      const collapseBtn = DOMUtils.createElement("button", {
        className: "floating-collapse-btn",
        title: "点击折叠/展开这条回复"
      }), scrollBtn = DOMUtils.createElement("button", {
        className: "floating-scroll-btn",
        title: "跳转到消息顶部"
      }, "↑"), actuallyCollapsed = this.isMessageCollapsed(messageEl);
      collapseBtn.innerHTML = actuallyCollapsed ? "▼" : "▲", collapseBtn.addEventListener("click", e => {
        e.preventDefault(), e.stopPropagation(), this.handleMessageButtonClick(messageEl, collapseBtn), 
        this.immediateScrollHandler("button-click");
      }), scrollBtn.addEventListener("click", e => {
        e.preventDefault(), e.stopPropagation(), UIUtils.scrollToMessageTop(messageEl), 
        this.immediateScrollHandler("button-click");
      });
      const hostContainer = container instanceof HTMLElement ? container : document.body;
      hostContainer.appendChild(collapseBtn), hostContainer.appendChild(scrollBtn);
      const buttons = {
        collapseBtn: collapseBtn,
        scrollBtn: scrollBtn
      };
      return this.messageButtons.set(messageEl, buttons), buttons;
    }
    positionButtons(buttons, msgData, index, totalCount) {
      if (!buttons) return;
      if (!msgData || !msgData.rect) return void Logger.warn("positionButtons: msgData or rect is null", msgData);
      const {messageEl: messageEl, rect: rect, type: type} = msgData, {collapseBtn: collapseBtn, scrollBtn: scrollBtn} = buttons;
      collapseBtn.style.display = "block", collapseBtn.style.pointerEvents = "auto", "container" !== type && (scrollBtn.style.display = "block", 
      scrollBtn.style.pointerEvents = "auto"), "user" === type && (collapseBtn.classList.add("user-message-btn"), 
      scrollBtn.classList.add("user-message-btn")), DOMUtils.addClass(messageEl, "conversation-highlighted"), 
      this.calculateButtonPosition(buttons, rect, index, totalCount);
      const isCollapsed = this.isMessageCollapsed(messageEl);
      collapseBtn.textContent = isCollapsed ? "▼" : "▲", scrollBtn.textContent = "↑";
    }
    calculateButtonPosition(buttons, rect, _index, _totalCount) {
      this.setAttachedPosition(buttons, rect);
    }
    setAttachedPosition(buttons, rect) {
      const {collapseBtn: collapseBtn, scrollBtn: scrollBtn} = buttons;
      collapseBtn.style.position = "fixed", scrollBtn.style.position = "fixed";
      const buttonStyles = this.app?.getButtonStyles() ?? CONFIG.BUTTON_STYLES, buttonWidth = StyleManager.parseCSSValue(buttonStyles.width) + 2 * StyleManager.parseCSSValue(buttonStyles.borderWidth), buttonHeight = StyleManager.parseCSSValue(buttonStyles.height) + 2 * StyleManager.parseCSSValue(buttonStyles.borderWidth), buttonTop = Math.max(settingsService.get("screenMargin", 50), rect.top - buttonHeight), buttonBottom = buttonTop + buttonHeight;
      collapseBtn.style.top = `${buttonTop}px`, scrollBtn.style.top = `${buttonTop}px`;
      const viewportWidth = window.innerWidth;
      let scrollButtonRight = 0, collapseButtonRight = 0;
      const floatingPanelRect = document.querySelector(`.${CSS_CLASSES_FLOAT_PANEL}`)?.getBoundingClientRect();
      floatingPanelRect && "right" === settingsService.get("buttonPosition") && floatingPanelRect.top <= buttonBottom + 10 && floatingPanelRect.bottom >= buttonTop - 10 ? (scrollButtonRight = Math.max(viewportWidth - floatingPanelRect.right, 0) - 2 * buttonWidth, 
      scrollButtonRight < 0 && (scrollButtonRight = Math.max(viewportWidth - floatingPanelRect.right, 0) + buttonWidth)) : (scrollButtonRight = Math.max(viewportWidth - rect.right, 0) - 2 * buttonWidth - 10, 
      scrollButtonRight < 0 && (scrollButtonRight = Math.max(Math.max(viewportWidth - rect.right, 0) - buttonWidth, 0))), 
      collapseButtonRight = scrollButtonRight + buttonWidth, collapseBtn.style.right = collapseButtonRight + "px", 
      scrollBtn.style.right = scrollButtonRight + "px", collapseBtn.style.transform = "none", 
      scrollBtn.style.transform = "none";
    }
    handleMessageButtonClick(messageEl, button) {
      "true" !== messageEl.dataset.processing && (messageEl.dataset.processing = "true", 
      this.performToggleOperation(messageEl, button));
    }
    performToggleOperation(messageEl, button) {
      this.isMessageCollapsed(messageEl) ? (this.uncollapseMessage(messageEl), button.innerHTML = "▲", 
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          UIUtils.scrollToMessageTop(messageEl);
        });
      })) : (this.collapseMessage(messageEl), button.innerHTML = "▼"), setTimeout(() => {
        delete messageEl.dataset.processing;
      }, 100);
    }
    cleanupRemovedMessages() {
      this.messageButtons.forEach((buttons, messageEl) => {
        DOMUtils.isInDOM(messageEl) || (buttons.collapseBtn && buttons.collapseBtn.remove(), 
        buttons.scrollBtn && buttons.scrollBtn.remove(), this.messageButtons.delete(messageEl));
      });
    }
    reevaluateAllMessages() {
      Logger.debug("重新评估所有消息的折叠状态"), this.messageButtons.forEach((buttons, _messageEl) => {
        buttons.collapseBtn && buttons.collapseBtn.remove(), buttons.scrollBtn && buttons.scrollBtn.remove();
      }), this.messageButtons.clear(), this.updateMessageButtonsState();
    }
    toggleAutoCollapse(enabled) {
      Logger.debug("切换自动折叠功能:", enabled), enabled ? this.hasAutoCollapsed || (this.hasAutoCollapsed = !0, 
      this.collapseAllMessages()) : this.expandAllMessages();
    }
    resetAutoCollapseState() {
      this.hasAutoCollapsed = !1, this.retryCount = 0;
    }
    static getAllMessages() {
      const messages = [];
      return document.querySelectorAll(`${CONFIG.SELECTORS.messages.user}, ${CONFIG.SELECTORS.messages.assistant}`).forEach(msg => {
        if (!(msg instanceof HTMLElement)) return;
        (msg.getAttribute("data-message-id") ?? "").includes("0000-0000-0000") || messages.push(msg);
      }), messages.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    }
    static isLongMessage(lineCount, textLength) {
      const maxLines = settingsService.get("maxVisibleLines", CONFIG.MESSAGE.MAX_LINES) ?? CONFIG.MESSAGE.MAX_LINES, threshold = settingsService.get("longMessageThreshold", CONFIG.MESSAGE.LONG_MESSAGE_THRESHOLD) ?? CONFIG.MESSAGE.LONG_MESSAGE_THRESHOLD;
      return lineCount > maxLines || textLength >= threshold;
    }
    static analyzeMessage(messageEl) {
      const content = messageEl.querySelector(CONFIG.SELECTORS.messages.content) ?? messageEl;
      if (!content) return null;
      const lineCount = UIUtils.getVisibleLineCount(content), textLength = content.textContent?.trim().length ?? 0, style = window.getComputedStyle(content), rect = messageEl.getBoundingClientRect(), analysis = {
        messageEl: messageEl,
        textLength: textLength,
        lineCount: lineCount,
        rect: rect,
        centerY: rect.top + rect.height / 2,
        type: messageEl.getAttribute("data-message-author-role")
      };
      return Logger.debug("消息分析结果:", {
        ...analysis,
        isLongMessage: MessageHandler.isLongMessage(lineCount, textLength),
        dimensions: {
          width: rect.width,
          height: rect.height,
          lineHeight: parseFloat(style.lineHeight) || "auto",
          fontSize: parseFloat(style.fontSize) || 16
        },
        thresholds: {
          maxLines: CONFIG.MESSAGE.MAX_LINES,
          longTextThreshold: CONFIG.MESSAGE.LONG_MESSAGE_THRESHOLD
        }
      }), analysis;
    }
    static analysisMessages(messages) {
      let hasEmptyContent = !1;
      const ret = [];
      return messages.forEach(messageEl => {
        const content = messageEl.querySelector(CONFIG.SELECTORS.messages.content) ?? messageEl, textLength = content ? content.textContent?.trim().length ?? 0 : 0;
        !!content && 0 === textLength && !hasEmptyContent && (hasEmptyContent = !0);
        const lineCount = UIUtils.getVisibleLineCount(content), rect = messageEl.getBoundingClientRect();
        ret.push({
          messageEl: messageEl,
          textLength: textLength,
          lineCount: lineCount,
          rect: rect,
          centerY: rect.top + rect.height / 2,
          type: messageEl.getAttribute("data-message-author-role")
        });
      }), {
        analysisMessages: ret,
        hasEmptyContent: hasEmptyContent
      };
    }
    static getCurrentMainMessage() {
      const messages = MessageHandler.getAllMessages();
      if (0 === messages.length) return null;
      const scrollContainer = UIUtils.findMainScrollContainer();
      Logger.debug("Finding current main message in container:", scrollContainer);
      const isWindow = scrollContainer === window, viewportHeight = isWindow ? window.innerHeight : scrollContainer.clientHeight, scrollTop = isWindow ? window.scrollY : scrollContainer.scrollTop, containerTop = isWindow ? 0 : scrollContainer.getBoundingClientRect().top;
      let bestMessage = null, bestScore = -1;
      return messages.forEach(message => {
        const rect = message.getBoundingClientRect(), messageTop = isWindow ? rect.top + window.scrollY : rect.top + scrollTop - containerTop, messageBottom = messageTop + rect.height, visibleTop = Math.max(messageTop, scrollTop), visibleBottom = Math.min(messageBottom, scrollTop + viewportHeight), visibleHeight = Math.max(0, visibleBottom - visibleTop);
        let score = (rect.height > 0 ? visibleHeight / rect.height : 0) + (viewportHeight > 0 ? visibleHeight / viewportHeight : 0);
        const messageCenter = (visibleTop + visibleBottom) / 2, viewportCenter = scrollTop + viewportHeight / 2;
        score += .5 * (1 - Math.abs(messageCenter - viewportCenter) / (viewportHeight / 2 || 1)), 
        score > bestScore && (bestScore = score, bestMessage = message);
      }), Logger.debug("Current main message selected with score:", bestScore, bestMessage), 
      bestMessage;
    }
    resetMarkdownButtonForMessage(messageEl) {
      if (!messageEl) return;
      const buttonsContainer = messageEl.parentElement?.parentElement?.querySelector(CONFIG.SELECTORS.ui.turnActions)?.parentElement?.parentElement;
      if (!buttonsContainer) return;
      const markdownButton = buttonsContainer.querySelector("button.markdown-toggle-button");
      if (!(markdownButton && markdownButton instanceof HTMLButtonElement)) return;
      const toggleButton = markdownButton, state = toggleButton._markdownState;
      if (!state) return;
      const currentMessageId = messageEl.getAttribute("data-message-id");
      if (currentMessageId && currentMessageId === state.lastMessageId) return;
      if (state.isMarkdownView && state.originalContent && state.contentContainer) try {
        state.contentContainer.innerHTML = state.originalContent;
      } catch (error) {
        console.warn("恢复原始内容时出错:", error);
      }
      toggleButton.setAttribute("aria-label", "显示Markdown源码"), toggleButton.title = "切换显示Markdown源码";
      const buttonSpan = toggleButton.querySelector("span");
      buttonSpan && (buttonSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7H15V5H9V19H15V17H17V19C17 20.1046 16.1046 21 15 21H9C7.89543 21 7 20.1046 7 19V5Z" fill="currentColor"/>\n                <path d="M11 9H13V15H11V9Z" fill="currentColor"/>\n                <path d="M9 11H11V13H9V11Z" fill="currentColor"/>\n                <path d="M13 11H15V13H13V11Z" fill="currentColor"/>\n            </svg>'), 
      state.isMarkdownView = !1, state.originalContent = null, state.lastMessageId = messageEl.getAttribute("data-message-id"), 
      state.messageEl = messageEl, Logger.debug("已重置消息相关的Markdown按钮状态:", messageEl.getAttribute("data-message-id"));
    }
    resetMarkdownButtonsForMessages(messageElements) {
      messageElements.forEach(messageEl => {
        messageEl instanceof HTMLElement && this.resetMarkdownButtonForMessage(messageEl);
      });
    }
    getOriginalMessageContent(messageEl) {
      try {
        const reactFiber = Object.keys(messageEl).find(key => key.startsWith("__reactFiber"));
        if (!reactFiber) return console.warn("No React fiber found"), null;
        const fiber = messageEl[reactFiber], searchFiberTree = (currentFiber, depth = 0) => {
          if (depth > 15 || !currentFiber) return null;
          const props = currentFiber.memoizedProps ?? currentFiber.pendingProps, parts = MessageHandler.extractMessageParts(props);
          if (parts) return parts.join("\n");
          const turn = MessageHandler.extractTurn(props);
          if (turn?.messages && Array.isArray(turn.messages)) for (const msg of turn.messages) {
            if ("object" != typeof msg || null === msg) continue;
            const innerProps = msg.message, innerParts = MessageHandler.extractMessageParts(innerProps);
            if (innerParts) return innerParts.join("\n");
          }
          return searchFiberTree(currentFiber.return, depth + 1) || searchFiberTree(currentFiber.child, depth + 1) || searchFiberTree(currentFiber.sibling, depth + 1);
        }, content = searchFiberTree(fiber);
        if (content) return Logger.debug("成功获取到消息内容，长度:", content.length), content;
        const textContent = messageEl.textContent || messageEl.innerText || "";
        return textContent && textContent.length > 20 ? (Logger.debug("React Fiber失败，使用文本内容，长度:", textContent.length), 
        textContent.trim()) : null;
      } catch (error) {
        return Logger.error("获取原始消息内容时出错:", error), null;
      }
    }
    static extractMessageParts(props) {
      if (!props) return null;
      const message = props.message, parts = message?.content?.parts;
      return Array.isArray(parts) && parts.every(part => "string" == typeof part) ? parts : null;
    }
    static extractTurn(props) {
      if (!props) return null;
      return props.conversationTurn ?? props.turn ?? null;
    }
    addMarkdownButtonToAllMessages() {
      document.querySelectorAll(CONFIG.SELECTORS.messages.assistant).forEach(messageEl => {
        this.addMarkdownButton(messageEl);
      });
    }
    addMarkdownButton(messageEl, retry = 0) {
      if (!(messageEl instanceof HTMLElement)) return;
      const typedMessage = messageEl;
      if ("assistant" !== typedMessage.getAttribute("data-message-author-role")) return;
      const buttonsContainer = typedMessage.parentElement?.parentElement?.querySelector(CONFIG.SELECTORS.ui.turnActions)?.parentElement?.parentElement;
      if (!buttonsContainer) return;
      if (buttonsContainer.querySelector(".markdown-toggle-button")) return;
      const markdownButton = this.createMarkdownButton(typedMessage);
      markdownButton ? this.insertMarkdownButton(buttonsContainer, markdownButton) : retry < 10 && (Logger.debug("消息内容可能未完全加载，稍后重试添加Markdown按钮，重试次数:", retry + 1), 
      retry++, setTimeout(() => {
        this.addMarkdownButton(typedMessage, retry);
      }, 2e3 * retry));
    }
    createMarkdownButton(messageEl) {
      const markdownButton = DOMUtils.createElement("span", {
        "data-state": "closed"
      }), button = DOMUtils.createElement("button", {
        className: "rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary markdown-toggle-button",
        "aria-label": "显示Markdown源码",
        "data-testid": "markdown-toggle-turn-action-button",
        title: "切换显示Markdown源码"
      }), buttonSpan = DOMUtils.createElement("span", {
        className: "flex h-[30px] w-[30px] items-center justify-center"
      });
      return buttonSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7H15V5H9V19H15V17H17V19C17 20.1046 16.1046 21 15 21H9C7.89543 21 7 20.1046 7 19V5Z" fill="currentColor"/>\n            <path d="M11 9H13V15H11V9Z" fill="currentColor"/>\n            <path d="M9 11H11V13H9V11Z" fill="currentColor"/>\n            <path d="M13 11H15V13H13V11Z" fill="currentColor"/>\n        </svg>', 
      button.appendChild(buttonSpan), markdownButton.appendChild(button), this.setupMarkdownButton(button, messageEl) ? markdownButton : null;
    }
    setupMarkdownButton(button, messageEl) {
      const contentContainer = messageEl.querySelector(".markdown") || messageEl.querySelector(".prose") || messageEl.querySelector("[data-message-content]") || messageEl.querySelector('div[class*="markdown"]');
      return contentContainer ? (button._markdownState = {
        isMarkdownView: !1,
        originalContent: null,
        lastMessageId: messageEl.getAttribute("data-message-id"),
        messageEl: messageEl,
        contentContainer: contentContainer
      }, button.addEventListener("click", e => {
        this.handleMarkdownButtonClick(e, button);
      }), !0) : (Logger.debug("找不到消息内容容器，跳过添加Markdown按钮", messageEl), !1);
    }
    handleMarkdownButtonClick(e, button) {
      e.preventDefault(), e.stopPropagation();
      const state = button._markdownState;
      state ? (state.isMarkdownView ? this.showNormalView(button, state) : this.showMarkdownView(button, state), 
      state.messageEl && UIUtils.scrollToMessageTop(state.messageEl)) : Logger.warn("Markdown button state not found");
    }
    showMarkdownView(button, state) {
      const currentMessageEl = this.findCurrentMessageElement(state.messageEl, button);
      if (!currentMessageEl) return Logger.error("无法找到当前消息元素"), void alert("消息元素已改变，请刷新页面后重试");
      this.uncollapseMessage(currentMessageEl);
      const currentContentContainer = currentMessageEl.firstElementChild;
      if (!currentContentContainer) return void Logger.warn("消息元素缺少内容容器");
      currentContentContainer.querySelectorAll(".dark, .light").forEach(el => {
        el instanceof HTMLElement && el.classList.remove("dark", "light");
      }), state.originalContent = currentContentContainer.innerHTML;
      const markdownContent = this.getOriginalMessageContent(currentMessageEl);
      if (!markdownContent) return void alert("无法获取Markdown源码。可能原因：\\n1. 消息刚刚生成，请稍等再试\\n2. 页面需要刷新\\n3. 先展开消息再转换");
      const codeContainer = UIUtils.createResizableCodeContainer(markdownContent);
      currentContentContainer.innerHTML = "", currentContentContainer.appendChild(codeContainer), 
      state.contentContainer = currentContentContainer, state.messageEl = currentMessageEl, 
      state.lastMessageId = currentMessageEl.getAttribute("data-message-id"), this.updateMarkdownButtonState(button, !0), 
      state.isMarkdownView = !0;
    }
    showNormalView(button, state) {
      if (state.originalContent) {
        const currentMessageEl = this.findCurrentMessageElement(state.messageEl, button);
        if (currentMessageEl) {
          const currentContentContainer = currentMessageEl.querySelector(".markdown") || currentMessageEl.querySelector(".prose") || currentMessageEl.querySelector("[data-message-content]") || currentMessageEl.querySelector('div[class*="markdown"]');
          currentContentContainer ? (currentContentContainer.innerHTML = state.originalContent, 
          state.contentContainer = currentContentContainer, state.messageEl = currentMessageEl, 
          state.lastMessageId = currentMessageEl.getAttribute("data-message-id")) : state.contentContainer && (state.contentContainer.innerHTML = state.originalContent);
        } else state.contentContainer && (state.contentContainer.innerHTML = state.originalContent);
        this.updateMarkdownButtonState(button, !1), state.isMarkdownView = !1;
      }
    }
    updateMarkdownButtonState(button, isMarkdownView) {
      const buttonSpan = button.querySelector("span");
      buttonSpan && (isMarkdownView ? (button.setAttribute("aria-label", "显示正常内容"), button.title = "切换回正常显示", 
      buttonSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 5H19V19H5V5Z" fill="currentColor"/>\n                <path d="M7 7H17V9H7V7Z" fill="currentColor"/>\n                <path d="M7 11H14V13H7V11Z" fill="currentColor"/>\n                <path d="M7 15H12V17H7V15Z" fill="currentColor"/>\n            </svg>') : (button.setAttribute("aria-label", "显示Markdown源码"), 
      button.title = "切换显示Markdown源码", buttonSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7H15V5H9V19H15V17H17V19C17 20.1046 16.1046 21 15 21H9C7.89543 21 7 20.1046 7 19V5Z" fill="currentColor"/>\n                <path d="M11 9H13V15H11V9Z" fill="currentColor"/>\n                <path d="M9 11H11V13H9V11Z" fill="currentColor"/>\n                <path d="M13 11H15V13H13V11Z" fill="currentColor"/>\n            </svg>'));
    }
    insertMarkdownButton(buttonsContainer, markdownButton) {
      const copyButtonContainer = buttonsContainer.querySelector('[data-testid="copy-turn-action-button"]')?.parentElement;
      if (copyButtonContainer) {
        const parent = copyButtonContainer.parentElement;
        parent?.insertBefore(markdownButton, copyButtonContainer.nextSibling);
      } else {
        const firstButtonGroup = buttonsContainer.querySelector(".flex.items-center") || buttonsContainer.firstElementChild;
        firstButtonGroup ? firstButtonGroup.appendChild(markdownButton) : buttonsContainer.appendChild(markdownButton);
      }
    }
    findCurrentMessageElement(originalMessageEl, button) {
      try {
        let currentElement = button;
        for (;currentElement && currentElement !== document.body; ) if (currentElement = currentElement.parentElement, 
        currentElement) {
          const elem = currentElement.querySelector('[data-message-author-role="assistant"]');
          if (elem instanceof HTMLElement) return Logger.debug("通过按钮位置找到消息元素"), elem;
        }
        if (originalMessageEl && DOMUtils.isInDOM(originalMessageEl)) {
          if (originalMessageEl.getAttribute("data-message-id")) return Logger.debug("原消息元素仍然有效且ID匹配"), 
          originalMessageEl;
        }
        return Logger.warn("无法找到当前消息元素"), null;
      } catch (error) {
        return Logger.error("查找消息元素时出错:", error), null;
      }
    }
    destroy() {
      this.unlistenMessageUpdated && (this.unlistenMessageUpdated(), this.unlistenMessageUpdated = null), 
      this.unlistenButtonCreated && (this.unlistenButtonCreated(), this.unlistenButtonCreated = null), 
      this.unlistenMessageCollapsed && (this.unlistenMessageCollapsed(), this.unlistenMessageCollapsed = null), 
      this.intersectionObserver && (this.intersectionObserver.disconnect(), this.intersectionObserver = null), 
      this.messageButtons.forEach(buttons => {
        buttons.collapseBtn && buttons.collapseBtn.remove(), buttons.scrollBtn && buttons.scrollBtn.remove();
      }), this.messageButtons.clear(), document.querySelectorAll(".conversation-highlighted").forEach(el => {
        el.classList.remove("conversation-highlighted");
      }), document.querySelectorAll(`.${CSS_CLASSES_COLLAPSED}`).forEach(el => {
        el.classList.remove(CSS_CLASSES_COLLAPSED);
      });
    }
  }
  const SVG_ICONS = {
    settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <circle cx="12" cy="12" r="3"/>\n    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>\n    <path d="M18.36 5.64l-4.24 4.24m-4.24 0L5.64 5.64m12.72 12.72l-4.24-4.24m-4.24 0L5.64 18.36"/>\n  </svg>',
    widescreen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>\n    <line x1="8" y1="21" x2="16" y2="21"/>\n    <line x1="12" y1="17" x2="12" y2="21"/>\n  </svg>',
    mobile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>\n    <line x1="12" y1="18" x2="12.01" y2="18"/>\n  </svg>',
    arrowUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <line x1="12" y1="19" x2="12" y2="5"/>\n    <polyline points="5 12 12 5 19 12"/>\n  </svg>',
    arrowDown: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <line x1="12" y1="5" x2="12" y2="19"/>\n    <polyline points="19 12 12 19 5 12"/>\n  </svg>',
    arrowLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <line x1="19" y1="12" x2="5" y2="12"/>\n    <polyline points="12 19 5 12 12 5"/>\n  </svg>',
    arrowRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <line x1="5" y1="12" x2="19" y2="12"/>\n    <polyline points="12 5 19 12 12 19"/>\n  </svg>',
    chevronUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="18 15 12 9 6 15"/>\n  </svg>',
    chevronDown: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="6 9 12 15 18 9"/>\n  </svg>',
    chevronsUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="17 11 12 6 7 11"/>\n    <polyline points="17 18 12 13 7 18"/>\n  </svg>',
    chevronsDown: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="7 13 12 18 17 13"/>\n    <polyline points="7 6 12 11 17 6"/>\n  </svg>',
    eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>\n    <circle cx="12" cy="12" r="3"/>\n  </svg>',
    edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>\n    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>\n  </svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="3 6 5 6 21 6"/>\n    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>\n    <line x1="10" y1="11" x2="10" y2="17"/>\n    <line x1="14" y1="11" x2="14" y2="17"/>\n  </svg>',
    archive: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="21 8 21 21 3 21 3 8"/>\n    <rect x="1" y="3" width="22" height="5"/>\n    <line x1="10" y1="12" x2="14" y2="12"/>\n  </svg>',
    code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polyline points="16 18 22 12 16 6"/>\n    <polyline points="8 6 2 12 8 18"/>\n  </svg>',
    fileText: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>\n    <polyline points="14 2 14 8 20 8"/>\n    <line x1="16" y1="13" x2="8" y2="13"/>\n    <line x1="16" y1="17" x2="8" y2="17"/>\n    <polyline points="10 9 9 9 8 9"/>\n  </svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <circle cx="12" cy="12" r="10"/>\n    <line x1="12" y1="16" x2="12" y2="12"/>\n    <line x1="12" y1="8" x2="12.01" y2="8"/>\n  </svg>',
    display: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>\n    <line x1="8" y1="21" x2="16" y2="21"/>\n    <line x1="12" y1="17" x2="12" y2="21"/>\n  </svg>',
    message: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>\n  </svg>',
    navigation: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <polygon points="3 11 22 2 13 21 11 13 3 11"/>\n  </svg>',
    advanced: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <circle cx="12" cy="12" r="3"/>\n    <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 0l4.2-4.2M1 12h6m6 0h6m-12.4 6.4l4.2-4.2m4.4 0l4.2 4.2"/>\n  </svg>'
  }, Icons = {
    ...SVG_ICONS,
    create(iconName, className = "") {
      const wrapper = document.createElement("span");
      return wrapper.className = `icon-wrapper ${className}`.trim(), wrapper.innerHTML = SVG_ICONS[iconName] ?? SVG_ICONS.info, 
      wrapper.style.display = "inline-flex", wrapper.style.alignItems = "center", wrapper.style.justifyContent = "center", 
      wrapper;
    }
  };
  class ButtonManager {
    floatPanel=null;
    currentMessage=null;
    app;
    buttons=new Map;
    scrollBehavior;
    keyboardHandler;
    unlistenFloatPanelEvents;
    buttonPosition;
    constructor(app) {
      this.app = app, this.scrollBehavior = settingsService.get("scrollBehavior", "smooth") ?? "smooth", 
      this.buttonPosition = settingsService.get("buttonPosition", "right") ?? "right", 
      this.init();
    }
    setScrollBehavior(behavior) {
      this.scrollBehavior = behavior;
    }
    init() {
      this.createFloatPanel(), this.createButtons(), this.setupSettingsWatchers();
    }
    setupSettingsWatchers() {
      settingsService.watch("showFloatButtons", value => {
        value ? this.floatPanel && this.floatPanel.parentNode || (this.createFloatPanel(), 
        this.createButtons()) : this.floatPanel?.parentNode && this.floatPanel.parentNode.removeChild(this.floatPanel), 
        Logger.info("[Settings] Float buttons:", value ? "shown" : "hidden");
      }), settingsService.watch("enableScroll", value => {
        settingsService.get("showFloatButtons") && this.createButtons(), Logger.info("[Settings] Scroll buttons:", value ? "enabled" : "disabled");
      }), settingsService.watch("enableMessageNavigation", value => {
        settingsService.get("showFloatButtons") && this.createButtons(), Logger.info("[Settings] Message navigation:", value ? "enabled" : "disabled");
      }), settingsService.watch("buttonPosition", value => {
        this.buttonPosition = value ?? "right", this.applyFloatPanelFallbackPosition(), 
        this.updateFloatPanelState(), Logger.info("[Settings] Button position:", this.buttonPosition);
      }), settingsService.watch("keyboardShortcuts", () => {
        settingsService.get("enableKeyboardShortcuts") && (this.bindKeyboardShortcuts(), 
        Logger.info("[Settings] Keyboard shortcuts updated"));
      });
    }
    createFloatPanel() {
      const existingPanel = document.querySelector(`.${CSS_CLASSES_FLOAT_PANEL}`);
      existingPanel && DOMUtils.removeElement(existingPanel), this.floatPanel = UIUtils.createFloatingPanel(), 
      document.body.appendChild(this.floatPanel), this.applyFloatPanelFallbackPosition(), 
      this.updateFloatPanelState(), this.unlistenFloatPanelEvents = EventManager.listen([ EVENTS_PAGE_STYLE_CHANGED, EVENTS_PAGE_RESIZE ], () => {
        this.updateFloatPanelState();
      });
    }
    updateFloatPanelState() {
      if (!this.floatPanel) return;
      const messageEl = MessageHandler.getCurrentMainMessage();
      if (!messageEl) return void this.applyFloatPanelFallbackPosition();
      const rect = messageEl.getBoundingClientRect(), buttonStyles = this.app.getButtonStyles(), buttonWidth = StyleManager.parseCSSValue(buttonStyles.width) + 2 * StyleManager.parseCSSValue(buttonStyles.borderWidth);
      if ("left" === this.buttonPosition) {
        const leftOffset = Math.max(rect.left - buttonWidth - 10 - 48, 10);
        this.floatPanel.style.left = `${leftOffset}px`, this.floatPanel.style.right = "auto";
      } else {
        const rightOffset = Math.max(window.innerWidth - rect.right - buttonWidth - 10, 0);
        this.floatPanel.style.right = `${rightOffset}px`, this.floatPanel.style.left = "auto";
      }
    }
    applyFloatPanelFallbackPosition() {
      this.floatPanel && ("left" === this.buttonPosition ? (this.floatPanel.style.left = "10px", 
      this.floatPanel.style.right = "auto") : (this.floatPanel.style.right = "10px", this.floatPanel.style.left = "auto"));
    }
    createButtons() {
      this.clearAllButtons(), settingsService.get("showFloatButtons") && (this.createWidescreenToggleButton(), 
      settingsService.get("enableScroll") && this.createScrollButton(), settingsService.get("enableMessageNavigation") && this.createMessageNavigationButtons(), 
      this.createCollapseExpandAllButtons(), this.createSettingsButton(), settingsService.get("enableKeyboardShortcuts") && this.bindKeyboardShortcuts());
    }
    clearAllButtons() {
      this.buttons.forEach(button => {
        button?.parentNode && button.parentNode.removeChild(button);
      }), this.buttons.clear();
    }
    bindKeyboardShortcuts() {
      this.keyboardHandler && this.unbindKeyboardShortcuts();
      const fallbackShortcuts = settingsService.getAll().keyboardShortcuts, shortcuts = settingsService.get("keyboardShortcuts", fallbackShortcuts) ?? fallbackShortcuts;
      this.keyboardHandler = event => {
        const target = event.target;
        if (!target || "INPUT" === target.tagName || "TEXTAREA" === target.tagName || target.isContentEditable) return;
        switch (this.getKeyCombo(event)) {
         case shortcuts.previousMessage:
          event.preventDefault(), this.navigateToMessage("prev");
          break;

         case shortcuts.nextMessage:
          event.preventDefault(), this.navigateToMessage("next");
          break;

         case shortcuts.scrollUp:
          event.preventDefault(), this.scrollToTop();
          break;

         case shortcuts.scrollDown:
          event.preventDefault(), this.scrollToBottom();
          break;

         case shortcuts.toggleWidescreen:
          event.preventDefault(), this.toggleWidescreenMode();
          break;

         case shortcuts.collapseAll:
          event.preventDefault(), this.app.messageHandler?.collapseAllMessages();
          break;

         case shortcuts.expandAll:
          event.preventDefault(), this.app.messageHandler?.expandAllMessages();
        }
      }, document.addEventListener("keydown", this.keyboardHandler), Logger.info("[ButtonManager] Keyboard shortcuts bound");
    }
    unbindKeyboardShortcuts() {
      this.keyboardHandler && (document.removeEventListener("keydown", this.keyboardHandler), 
      this.keyboardHandler = void 0, Logger.info("[ButtonManager] Keyboard shortcuts unbound"));
    }
    activateKeyboardShortcuts() {
      this.bindKeyboardShortcuts();
    }
    deactivateKeyboardShortcuts() {
      this.unbindKeyboardShortcuts();
    }
    getKeyCombo(event) {
      const parts = [];
      return event.altKey && parts.push("Alt"), event.ctrlKey && parts.push("Ctrl"), event.shiftKey && parts.push("Shift"), 
      event.metaKey && parts.push("Meta"), parts.push(event.key), parts.length > 1 ? parts.join("+") : event.key;
    }
    createCollapseExpandAllButtons() {
      this.createFloatButton(Icons.create("chevronsUp"), "messages-collapse-all", "折叠所有消息", () => this.app.messageHandler?.collapseAllMessages()), 
      this.createFloatButton(Icons.create("chevronsDown"), "messages-expand-all", "展开所有消息", () => this.app.messageHandler?.expandAllMessages());
    }
    createWidescreenToggleButton() {
      const isActive = settingsService.get("widescreenMode", !0), icon = isActive ? Icons.create("mobile") : Icons.create("widescreen"), button = UIUtils.createFloatingButton(icon, "toggle-widescreen " + (isActive ? "active" : ""), isActive ? "退出宽屏模式" : "启用宽屏模式", () => this.toggleWidescreenMode());
      this.buttons.set("widescreen", button), this.floatPanel?.appendChild(button);
    }
    createSettingsButton() {
      this.createFloatButton(Icons.create("settings"), "settings", "打开设置", () => settingsUI.open());
    }
    createScrollButton() {
      this.createFloatButton(Icons.create("arrowUp"), "scroll-top", "滚动到顶部", () => this.scrollToTop()), 
      this.createFloatButton(Icons.create("arrowDown"), "scroll-bottom", "滚动到底部", () => this.scrollToBottom());
    }
    createMessageNavigationButtons() {
      this.createFloatButton(Icons.create("arrowLeft"), "message-prev", "跳转到上一则消息", () => this.navigateToMessage("prev")), 
      this.createFloatButton(Icons.create("arrowRight"), "message-next", "跳转到下一则消息", () => this.navigateToMessage("next"));
    }
    navigateToMessage(direction) {
      const messages = MessageHandler.getAllMessages();
      if (0 === messages.length) return void UIUtils.showNotification("没有找到消息", "warning");
      let currentMessage = this.currentMessage;
      !currentMessage || document.body.contains(currentMessage) && DOMUtils.isElementVisible(currentMessage) || (Logger.debug("当前消息不在视图中，重置为null", currentMessage), 
      currentMessage = MessageHandler.getCurrentMainMessage(), this.currentMessage = currentMessage);
      let targetMessage = null;
      if (currentMessage) {
        const currentIndex = messages.indexOf(currentMessage);
        if (-1 === currentIndex) return;
        targetMessage = "prev" === direction ? currentIndex > 0 ? messages[currentIndex - 1] : messages[messages.length - 1] : currentIndex < messages.length - 1 ? messages[currentIndex + 1] : messages[0];
      } else targetMessage = "prev" === direction ? messages[messages.length - 1] : messages[0];
      targetMessage && (this.currentMessage = targetMessage, this.scrollToMessage(targetMessage, direction));
    }
    scrollToMessage(message, direction) {
      Logger.debug("Scrolling to message:", message, "Direction:", direction), UIUtils.scrollToMessageTop(message, -.05), 
      this.highlightMessage(message);
    }
    highlightMessage(message) {
      document.querySelectorAll(".message-navigation-highlight").forEach(el => {
        el.classList.remove("message-navigation-highlight");
      }), message.classList.add("message-navigation-highlight"), setTimeout(() => {
        message.classList.remove("message-navigation-highlight");
      }, 3e3);
    }
    toggleWidescreenMode() {
      const newMode = !(settingsService.get("widescreenMode", !0) ?? !0);
      settingsService.set("widescreenMode", newMode);
      const button = this.buttons.get("widescreen");
      if (button) {
        button.innerHTML = "";
        const icon = newMode ? Icons.create("mobile") : Icons.create("widescreen");
        button.appendChild(icon), button.title = newMode ? "退出宽屏模式" : "启用宽屏模式", DOMUtils.toggleClass(button, "active");
      }
      UIUtils.showNotification(newMode ? "宽屏模式已启用" : "宽屏模式已关闭", "success"), EventManager.dispatch(EVENTS_WIDESCREEN_TOGGLED, {
        enabled: newMode
      });
    }
    scrollToBottom() {
      const scrollContainer = UIUtils.findMainScrollContainer(), behavior = this.scrollBehavior || settingsService.get("scrollBehavior", "smooth") || "smooth";
      scrollContainer instanceof HTMLElement && scrollContainer !== window.document.body ? scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: behavior
      }) : window.scrollTo({
        top: document.body.scrollHeight,
        behavior: behavior
      });
    }
    scrollToTop() {
      const scrollContainer = UIUtils.findMainScrollContainer(), behavior = this.scrollBehavior || settingsService.get("scrollBehavior", "smooth") || "smooth";
      scrollContainer instanceof HTMLElement && scrollContainer !== window.document.body ? scrollContainer.scrollTo({
        top: 0,
        behavior: behavior
      }) : window.scrollTo({
        top: 0,
        behavior: behavior
      });
    }
    startNewChat() {
      const selectors = [ 'a[href="/"]', 'button[data-testid="new-chat-button"]', '[data-testid="new-chat"]', 'nav a[href="/"]' ], newChatButton = DOMUtils.findElement(selectors);
      newChatButton instanceof HTMLElement ? (newChatButton.click(), UIUtils.showNotification("正在创建新对话...", "info")) : window.location.href = "/";
    }
    toggleFloatPanel(visible = null) {
      if (!this.floatPanel) return;
      (null !== visible ? visible : DOMUtils.hasClass(this.floatPanel, CSS_CLASSES_HIDDEN)) ? DOMUtils.removeClass(this.floatPanel, CSS_CLASSES_HIDDEN) : DOMUtils.addClass(this.floatPanel, CSS_CLASSES_HIDDEN);
    }
    destroy() {
      this.floatPanel && (DOMUtils.removeElement(this.floatPanel), this.floatPanel = null), 
      this.unlistenFloatPanelEvents && (this.unlistenFloatPanelEvents(), this.unlistenFloatPanelEvents = void 0), 
      this.buttons.clear(), this.unbindKeyboardShortcuts();
    }
    createFloatButton(content, className, title, onClick) {
      const button = UIUtils.createFloatingButton(content, className, title, onClick);
      return this.buttons.set(className, button), this.floatPanel?.appendChild(button), 
      button;
    }
  }
  class ConversationManager {
    conversationButtons=new Map;
    unlistenConversationAction;
    constructor() {
      this.init();
    }
    init() {
      this.addConversationActionButtons(), this.bindEvents();
    }
    bindEvents() {
      this.unlistenConversationAction = EventManager.listen(EVENTS_CONVERSATION_ACTION, data => {
        data && "object" == typeof data && "type" in data && "check" === data.type && this.addConversationActionButtons();
      });
    }
    addConversationActionButtons() {
      const conversationItems = document.querySelectorAll('li[data-testid^="history-item-"]');
      conversationItems.forEach(item => {
        if ("true" === item.dataset.buttonsAdded) return;
        const link = item.querySelector("a");
        if (!link?.href || !link.href.includes("/c/") && !link.href.includes("/chat/")) return;
        item.classList.add("conversation-item");
        const actionsContainer = document.createElement("div");
        actionsContainer.className = "conversation-item-actions";
        const renameBtn = this.createActionButton("重命名对话", "rename", this.getRenameIconSVG());
        renameBtn.onclick = event => {
          event.preventDefault(), event.stopPropagation(), this.handleRenameConversation(item);
        };
        const deleteBtn = this.createActionButton("删除对话", "delete", this.getDeleteIconSVG());
        deleteBtn.onclick = event => {
          event.preventDefault(), event.stopPropagation(), this.handleDeleteConversation(item);
        };
        const archiveBtn = this.createActionButton("归档对话", "archive", this.getArchiveIconSVG());
        archiveBtn.onclick = event => {
          event.preventDefault(), event.stopPropagation(), this.handleArchiveConversation(item);
        }, actionsContainer.append(renameBtn, archiveBtn, deleteBtn);
        const nextSibling = link.nextSibling;
        nextSibling instanceof HTMLElement && DOMUtils.hide(nextSibling), link.parentNode?.insertBefore(actionsContainer, nextSibling), 
        item.dataset.buttonsAdded = "true";
        const conversationId = this.extractConversationId(link);
        conversationId && this.conversationButtons.set(conversationId, {
          container: actionsContainer,
          renameBtn: renameBtn,
          deleteBtn: deleteBtn,
          archiveBtn: archiveBtn,
          item: item
        });
      }), conversationItems.length > 0 && Logger.debug(`[ConversationManager] 共处理了 ${conversationItems.length} 个对话项`);
    }
    createActionButton(title, type, svgIcon) {
      const button = document.createElement("button");
      return button.className = `conversation-action-btn ${type}-btn`, button.title = title, 
      button.innerHTML = svgIcon, button;
    }
    extractConversationId(linkElement) {
      const match = linkElement.href.match(/\/c\/([^\/\?]+)/);
      return match ? match[1] : null;
    }
    handleRenameConversation(item) {
      try {
        const originalMenuBtn = this.findOriginalMenuButton(item);
        Logger.debug("Original Menu Button for Rename:", originalMenuBtn), originalMenuBtn && (UIUtils.triggerMouseEvents(originalMenuBtn), 
        setTimeout(() => {
          const menuItems = document.querySelectorAll('[role="menuitem"]');
          Logger.debug("菜单项数量:", menuItems.length, menuItems);
          for (const menuItem of menuItems) {
            const text = menuItem.textContent ?? "";
            if (text.includes("重命名") || text.includes("Rename") || text.includes("编辑")) {
              UIUtils.triggerMouseEvents(menuItem, "fiber");
              break;
            }
          }
        }, 50));
      } catch (error) {
        Logger.error("重命名对话时出错:", error), UIUtils.showNotification("重命名失败，请重试", "error");
      }
    }
    handleDeleteConversation(item) {
      try {
        const originalMenuBtn = this.findOriginalMenuButton(item);
        Logger.debug("开始触发删除菜单按钮事件"), UIUtils.analyzeButton(originalMenuBtn), originalMenuBtn && UIUtils.triggerMouseEvents(originalMenuBtn), 
        setTimeout(() => {
          const menuItems = document.querySelectorAll('[role="menuitem"], .menu-item, [data-testid*="delete"]');
          for (const menuItem of menuItems) {
            const text = menuItem.textContent ?? "";
            if (Logger.debug("找到菜单项:", text), text.includes("删除") || text.includes("Delete") || text.includes("移除")) {
              UIUtils.triggerMouseEvents(menuItem, "fiber"), setTimeout(() => {
                const confirmBtn = document.querySelector('[data-testid*="delete-conversation-confirm-button"]');
                confirmBtn && (Logger.debug("确认按钮:", confirmBtn), UIUtils.triggerMouseEvents(confirmBtn, "fiber"));
              }, 200);
              break;
            }
          }
        }, 100);
      } catch (error) {
        Logger.error("删除对话时出错:", error), UIUtils.showNotification("删除失败，请重试", "error");
      }
    }
    handleArchiveConversation(item) {
      try {
        const originalMenuBtn = this.findOriginalMenuButton(item);
        UIUtils.analyzeButton(originalMenuBtn), originalMenuBtn && UIUtils.triggerMouseEvents(originalMenuBtn, "click"), 
        setTimeout(() => {
          const menuItems = document.querySelectorAll('[role="menuitem"], .menu-item, [data-testid*="archive"]');
          for (const menuItem of menuItems) {
            const text = menuItem.textContent ?? "";
            if (text.includes("归档") || text.includes("Archive") || text.includes("存档")) {
              UIUtils.triggerMouseEvents(menuItem, "fiber");
              break;
            }
          }
        }, 200);
      } catch (error) {
        Logger.error("归档对话时出错:", error), UIUtils.showNotification("归档失败，请重试", "error");
      }
    }
    findOriginalMenuButton(conversationItem) {
      return Logger.debug("查找菜单按钮，对话项:", conversationItem), conversationItem.querySelector('button[data-testid*="options"]');
    }
    destroy() {
      this.unlistenConversationAction && (this.unlistenConversationAction(), this.unlistenConversationAction = void 0), 
      this.conversationButtons.clear();
    }
    getRenameIconSVG() {
      return '\n        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0">\n          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path>\n        </svg>\n      ';
    }
    getDeleteIconSVG() {
      return '\n        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0">\n          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path>\n        </svg>\n      ';
    }
    getArchiveIconSVG() {
      return '\n        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0">\n          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.82918 4.10557C5.16796 3.428 5.86049 3 6.61803 3H17.382C18.1395 3 18.832 3.428 19.1708 4.10557L20.7889 7.34164C20.9277 7.61935 21 7.92558 21 8.23607V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8.23607C3 7.92558 3.07229 7.61935 3.21115 7.34164L4.82918 4.10557ZM17.382 5H6.61803L5.61803 7H18.382L17.382 5ZM19 9H5V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V9ZM9 12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H10C9.44772 13 9 12.5523 9 12Z" fill="currentColor"></path>\n        </svg>\n      ';
    }
  }
  class ChatGPTWidescreenApp {
    messageHandler;
    buttonManager;
    conversationManager;
    styleManager;
    mutationObserver;
    unlisten;
    initialized=!1;
    widescreenMode=!1;
    settingUnsubscribes=[];
    constructor() {
      this.init = this.init.bind(this), this.reinit = this.reinit.bind(this);
    }
    async init() {
      if (!this.initialized) try {
        Logger.info("[PlusAI Widescreen] 开始初始化..."), await settingsService.init(), await this.waitForPageReady(), 
        this.initializeComponents(), this.applyInitialSettings(), this.bindGlobalEvents(), 
        this.initialized = !0, Logger.info("[PlusAI Widescreen] 初始化完成");
      } catch (error) {
        Logger.error("[PlusAI Widescreen] 初始化失败:", error), UIUtils.showNotification("初始化失败，请刷新页面重试", "error");
      }
    }
    async waitForPageReady() {
      await DOMUtils.waitForElement('main, [role="main"], #app', document, 1e4);
      const promises = [ "textarea[data-id]", "[data-testid]", ".text-base" ].map(selector => DOMUtils.waitForElement(selector, document, 3e3).catch(() => null));
      await Promise.race(promises), await new Promise(resolve => setTimeout(resolve, 1e3));
    }
    getButtonStyles() {
      return this.styleManager?.getButtonStyles() ?? CONFIG.BUTTON_STYLES;
    }
    initializeComponents() {
      Logger.info("[PlusAI Widescreen] 初始化组件..."), this.styleManager || (this.styleManager = new StyleManager, 
      this.styleManager.initAllStyles()), this.buttonManager || (this.buttonManager = new ButtonManager(this)), 
      this.messageHandler || (this.messageHandler = new MessageHandler(this)), this.conversationManager || (this.conversationManager = new ConversationManager), 
      Logger.info("[PlusAI Widescreen] 组件初始化完成");
    }
    applyInitialSettings() {
      Logger.info("[PlusAI Widescreen] 应用初始设置..."), this.styleManager && this.styleManager.setStyleOverrides({
        widescreenWidth: settingsService.get("widescreenWidth", 90),
        buttons: settingsService.get("buttonStyles")
      }), settingsService.get("widescreenMode") ? (this.widescreenMode = !0, this.applyWidescreenMode()) : this.widescreenMode = !1, 
      Logger.info("[PlusAI Widescreen] 初始设置应用完成");
    }
    applyWidescreenMode() {
      DOMUtils.findElements([ CONFIG.SELECTORS.TEXT_CONTAINER ].join(", ")).forEach(container => {
        this.widescreenMode ? DOMUtils.addClass(container, CSS_CLASSES_WIDESCREEN) : DOMUtils.removeClass(container, CSS_CLASSES_WIDESCREEN);
      }), EventManager.dispatch(EVENTS_PAGE_STYLE_CHANGED);
    }
    bindGlobalEvents() {
      this.mutationObserver || this.setupUnifiedMutationObserver(), this.unlisten || (this.unlisten = EventManager.listen(EVENTS_WIDESCREEN_TOGGLED, e => {
        this.widescreenMode = e.enabled, this.applyWidescreenMode();
      })), this.setupSettingsWatchers();
    }
    cleanupSettingWatchers() {
      this.settingUnsubscribes.forEach(unsubscribe => unsubscribe()), this.settingUnsubscribes.length = 0;
    }
    setupSettingsWatchers() {
      this.cleanupSettingWatchers(), this.settingUnsubscribes.push(settingsService.watch("widescreenMode", value => {
        this.widescreenMode = value, this.applyWidescreenMode(), Logger.info("[Settings] Widescreen mode:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("widescreenWidth", value => {
        this.styleManager?.setStyleOverrides({
          widescreenWidth: value
        }), Logger.info("[Settings] Widescreen width:", `${value}%`);
      })), this.settingUnsubscribes.push(settingsService.watch("debugMode", value => {
        Logger.setLevel(value ? "debug" : "info"), Logger.info("[Settings] Debug mode:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("buttonStyles", value => {
        this.styleManager?.setStyleOverrides({
          buttons: value
        }), Logger.info("[Settings] Button styles updated");
      })), this.settingUnsubscribes.push(settingsService.watch("enableMarkdownView", value => {
        this.messageHandler && (value ? this.messageHandler.addMarkdownButtonToAllMessages() : document.querySelectorAll(".markdown-toggle-button").forEach(btn => btn.remove())), 
        Logger.info("[Settings] Markdown view:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("collapseAnimation", value => {
        document.documentElement.style.setProperty("--collapse-animation-duration", value ? "0.3s" : "0s"), 
        Logger.info("[Settings] Collapse animation:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("scrollBehavior", value => {
        this.buttonManager?.setScrollBehavior(value), Logger.info("[Settings] Scroll behavior:", value);
      })), this.settingUnsubscribes.push(settingsService.watch("enableKeyboardShortcuts", value => {
        value ? this.buttonManager?.activateKeyboardShortcuts() : this.buttonManager?.deactivateKeyboardShortcuts(), 
        Logger.info("[Settings] Keyboard shortcuts:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("enableConversationOps", value => {
        value ? this.conversationManager?.init() : document.querySelectorAll(".conversation-item-actions").forEach(el => el.remove()), 
        Logger.info("[Settings] Conversation ops:", value ? "enabled" : "disabled");
      })), this.settingUnsubscribes.push(settingsService.watch("autoCollapse", value => {
        this.messageHandler?.toggleAutoCollapse(value), Logger.info("[Settings] Auto-collapse:", value ? "enabled" : "disabled");
      }));
      const reevalMessages = label => {
        this.messageHandler?.reevaluateAllMessages(), Logger.info("[Settings]", label);
      };
      this.settingUnsubscribes.push(settingsService.watch("longMessageThreshold", value => {
        reevalMessages(`Long message threshold: ${value}`);
      })), this.settingUnsubscribes.push(settingsService.watch("maxVisibleLines", value => {
        reevalMessages(`Max visible lines: ${value}`);
      })), this.settingUnsubscribes.push(settingsService.watch("minLineHeight", value => {
        reevalMessages(`Min line height: ${value}`);
      })), this.settingUnsubscribes.push(settingsService.watch("estimatedCharsPerLine", value => {
        reevalMessages(`Estimated chars per line: ${value}`);
      }));
    }
    setupUnifiedMutationObserver() {
      this.mutationObserver?.disconnect();
      let currentUrl = window.location.href;
      const observer = new MutationObserver(mutations => {
        try {
          if (window.location.href !== currentUrl) {
            const previousUrl = currentUrl;
            currentUrl = window.location.href, Logger.info("[PlusAI Widescreen] URL变化，重新初始化..."), 
            EventManager.dispatch(EVENTS_PAGE_NAVIGATION, {
              from: previousUrl,
              to: currentUrl
            }), setTimeout(() => this.reinit(), 1e3);
          }
          let hasNewContainers = !1, hasNewMessages = !1, needsButtonCheck = !1, needsConversationCheck = !1;
          const changedMessages = new Set;
          for (const mutation of mutations) mutation.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            node.querySelector("[data-message-author-role]") && (hasNewMessages = !0, EventManager.dispatch(EVENTS_MESSAGE_ADDED, {
              element: node
            })), node.querySelector(CONFIG.SELECTORS.TEXT_CONTAINER) && (hasNewContainers = !0);
            if (node.querySelector('[data-testid*="action-button"]') && (needsButtonCheck = !0, 
            hasNewMessages = !0), settingsService.get("enableConversationOps") && node.querySelector('[data-testid^="history-item"]') && (needsConversationCheck = !0), 
            node.querySelector(".markdown") || node.querySelector(".prose") || node.getAttribute("data-message-author-role")) {
              const messageEl = node.closest('[data-message-author-role="assistant"]');
              messageEl ? changedMessages.add(messageEl) : "assistant" === node.getAttribute("data-message-author-role") && changedMessages.add(node);
            }
          }), mutation.removedNodes.forEach(node => {
            if (node instanceof HTMLElement && (node.querySelector(".markdown") || node.querySelector(".prose") || node.getAttribute("data-message-author-role"))) {
              const target = mutation.target;
              if (target instanceof HTMLElement) {
                const parentMessageEl = target.closest('[data-message-author-role="assistant"]');
                parentMessageEl instanceof HTMLElement && changedMessages.add(parentMessageEl);
              }
            }
          });
          (hasNewMessages || needsButtonCheck || changedMessages.size > 0 || hasNewContainers) && setTimeout(() => {
            hasNewMessages && EventManager.dispatch(EVENTS_LONG_MESSAGES_UPDATED), needsButtonCheck && EventManager.dispatch(EVENTS_BUTTON_CREATED), 
            changedMessages.size > 0 && (EventManager.dispatch(EVENTS_MESSAGE_COLLAPSED, {
              messages: Array.from(changedMessages.values())
            }), changedMessages.clear()), hasNewContainers && this.applyWidescreenMode();
          }, 100), needsConversationCheck && setTimeout(() => {
            EventManager.dispatch(EVENTS_CONVERSATION_ACTION, {
              type: "check"
            });
          }, 200);
        } catch (error) {
          Logger.error("[PlusAI Widescreen] MutationObserver 回调错误:", error);
        }
      }), body = document.body;
      body && (observer.observe(body, {
        childList: !0,
        subtree: !0
      }), this.mutationObserver = observer);
    }
    checkAndReinit() {
      const floatPanel = document.querySelector(`.${CSS_CLASSES_FLOAT_PANEL}`), hasMessages = document.querySelector(CONFIG.SELECTORS.CONVERSATION);
      (!floatPanel || hasMessages && !floatPanel.children.length) && (Logger.info("[PlusAI Widescreen] 检测到组件丢失，重新初始化..."), 
      this.reinit());
    }
    async reinit() {
      Logger.info("[PlusAI Widescreen] 重新初始化...");
      try {
        this.messageHandler?.resetAutoCollapseState(), this.destroy(), this.initialized = !1, 
        await new Promise(resolve => setTimeout(resolve, 500)), await this.init();
      } catch (error) {
        Logger.error("[PlusAI Widescreen] 重新初始化失败:", error);
      }
    }
    destroy() {
      Logger.info("[PlusAI Widescreen] 清理资源..."), this.cleanupSettingWatchers(), this.buttonManager?.destroy(), 
      this.buttonManager = void 0, this.messageHandler?.destroy(), this.messageHandler = void 0, 
      this.conversationManager?.destroy(), this.conversationManager = void 0, this.styleManager?.cleanup(), 
      this.styleManager = void 0, this.unlisten?.(), this.unlisten = void 0, this.mutationObserver?.disconnect(), 
      this.mutationObserver = void 0, this.initialized = !1;
    }
    getStatus() {
      return {
        initialized: this.initialized,
        widescreenMode: settingsService.get("widescreenMode"),
        settings: settingsService.getAll(),
        components: {
          buttonManager: !!this.buttonManager,
          messageHandler: !!this.messageHandler,
          conversationManager: !!this.conversationManager
        }
      };
    }
  }
  const app = new ChatGPTWidescreenApp;
  return "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", app.init) : setTimeout(app.init, 100), 
  "undefined" != typeof window && (window.ChatGPTWidescreenApp = app), Logger.info("[PlusAI Widescreen] 应用已加载，版本:", CONFIG.VERSION), 
  Logger.debug("[PlusAI Widescreen] 调试模式已启用"), exports.ChatGPTWidescreenApp = ChatGPTWidescreenApp, 
  exports.default = app, Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports;
}({});
