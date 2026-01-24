// ==UserScript==
// @name         QwenPersona
// @namespace    https://www.kev1nweng.space
// @version      1769138683
// @description  一个便于用户自定义、保存并同步 Qwen Chat 自定义角色的 Tampermonkey 脚本。A Tampermonkey script for customizing user-defined personas in Qwen Chat.
// @author       小翁同学 (kev1nweng)
// @license      AGPL-3.0
// @match        https://chat.qwen.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556914/QwenPersona.user.js
// @updateURL https://update.greasyfork.org/scripts/556914/QwenPersona.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==================== Debug Helpers ====================
  // Enable with: localStorage.setItem('qwen_persona_debug','1') then refresh.
  // Disable with: localStorage.removeItem('qwen_persona_debug') then refresh.
  const Debug = {
    enabled: false,
    _events: [],
    _maxEvents: 250,
    init() {
      try {
        this.enabled = localStorage.getItem("qwen_persona_debug") === "1";
      } catch (e) {
        this.enabled = false;
      }
    },
    event(type, data = {}) {
      try {
        const entry = {
          t: new Date().toISOString(),
          type,
          url: location.href,
          ...data,
        };
        this._events.push(entry);
        if (this._events.length > this._maxEvents) {
          this._events.splice(0, this._events.length - this._maxEvents);
        }
      } catch (e) {}
    },
    getEvents() {
      return this._events.slice();
    },
    log(...args) {
      if (!this.enabled) return;
      console.log("[QwenPersona][DBG]", ...args);
    },
    warn(...args) {
      if (!this.enabled) return;
      console.warn("[QwenPersona][DBG]", ...args);
    },
    table(obj) {
      if (!this.enabled) return;
      try {
        console.table(obj);
      } catch (e) {
        console.log("[QwenPersona][DBG]", obj);
      }
    },
    stack(label) {
      if (!this.enabled) return;
      try {
        const err = new Error(label || "stack");
        console.log("[QwenPersona][DBG] stack:", err.stack);
      } catch (e) {}
    },
  };

  Debug.init();

  // Wrap persona-specific console logs so they only print when debug is enabled.
  // This avoids silencing other scripts while keeping persona logs gated by Debug.enabled.
  (function () {
    const origLog = console.log.bind(console);
    const origWarn = console.warn.bind(console);
    console.log = function (...args) {
      try {
        const first = args[0];
        if (typeof first === "string" && first.startsWith("[QwenPersona]")) {
          if (Debug.enabled) origLog(...args);
          return;
        }
      } catch (e) {}
      origLog(...args);
    };
    console.warn = function (...args) {
      try {
        const first = args[0];
        if (typeof first === "string" && first.startsWith("[QwenPersona]")) {
          if (Debug.enabled) origWarn(...args);
          return;
        }
      } catch (e) {}
      origWarn(...args);
    };
  })();

  // ==================== Constants & Configuration ====================
  const CONSTANTS = {
    STORAGE: {
      PERSONAS: "qwen_personas",
      SELECTED: "qwen_selected_persona",
      MODELS_CACHE: "qwen_models_cache",
      CHAT_MAP: "qwen_chat_persona_map",
      CHAT_INJECTED: "qwen_chat_injected",
    },
    SELECTORS: {
      // Custom UI IDs
      CONTAINER: "persona-dropdown-container",
      TRIGGER: "persona-trigger",
      MENU: "persona-dropdown-menu",
      MODAL_OVERLAY: "persona-modal-overlay",
      MODAL: "persona-modal",
      CREATE_BTN: "persona-create-btn",
      IMPORT_BTN: "persona-import-btn",
      SAVE_BTN: "persona-save-btn",
      STYLE_ID: "persona-manager-styles",

      // Form Inputs
      INPUT_NAME: "persona-name-input",
      INPUT_EMOJI: "persona-emoji-input",
      INPUT_MODEL: "persona-model-input",
      INPUT_PROMPT: "persona-prompt-input",
      INPUT_DEEP_THINKING: "persona-deep-thinking-input",
      INPUT_WEB_SEARCH: "persona-web-search-input",

      // Qwen UI Elements
      HEADER_DESKTOP: ".header-desktop",
      HEADER_LEFT: ".header-desktop .header-content .header-left",
      MODEL_SELECTOR: '[class*="index-module__model-selector-text"]',
      MODEL_SELECTOR_TRIGGER: '.header-left .ant-dropdown-trigger',
      MODEL_SELECTOR_CONTENT: '[class*="index-module__model-selector-text"]',
      MODEL_SELECTOR_DROPDOWN:
        '[class*="index-module__model-selector-popup"]',
      MODEL_SELECTOR_DROPDOWN_SECONDARY:
        '[class*="index-module__model-selector-popup-secondary"]',
      MODEL_SELECTOR_ITEM: '[class*="index-module__model-item___"]',
      MODEL_NAME_TEXT: '[class*="index-module__model-item-name___"]',
      MODEL_SELECTOR_VIEW_MORE:
        '[class*="index-module__view-more___"]',
      MODEL_VIEW_MORE_TEXT: '[class*="index-module__view-more-text___"]',
      ANT_DROPDOWN_TRIGGER: ".ant-dropdown-trigger",
      CHAT_INPUT_FEATURE_BTN: ".chat-input-feature-btn",
      CHAT_INPUT_FEATURE_TEXT: ".chat-input-feature-btn-text",
      DEEP_THINKING_CONTAINER: ".chat-message-input-thinking-budget-btn",
      WEB_SEARCH_BTN: "button.websearch_button",
      TEXTAREA: "textarea#chat-input, textarea.chat-input, textarea",
      INPUT_CONTAINER: ".prompt-input-container, .chat-input-container, .chat-message-input-container-inner",
      CHAT_MESSAGE_INPUT: ".chat-message-input, #chat-message-input",
      CHAT_PROMPT_INPUT_CONTAINER: ".chat-prompt-input-container, .chat-prompt-input",

      // Classes
      TRIGGER_COLLAPSED: "collapsed",
      TRIGGER_ACTIVE: "active",
      MENU_VISIBLE: "visible",
      ARROW_OPEN: "open",
      ITEM_SELECTED: "selected",
      INPUT_DISABLED: "persona-input-disabled",
      INTERACTION_DISABLED: "persona-interaction-disabled",
      TRANSITION: "persona-input-transition",
      AGENT_ACTIVE: "persona-agent-active",
    },
  };

  // ==================== State Management ====================
  const State = {
    personas: [],
    selectedPersonaId: null,
    availableModels: [],
    dropdownVisible: false,
    modalVisible: false,
    editingPersona: null,
    lastUrl: location.href,
    chatPersonaMap: {},
    chatInjectedMap: {}, // { chatId: personaId }
    // When Qwen creates a new chat, the URL->chatId mapping may lag the first request.
    // We store a short-lived personaId here and bind it to the chatId once it appears.
    pendingNewChatPersona: null, // { personaId, ts, reason }
  };

  // ==================== I18n Service ====================
  const I18n = {
    locale: "en",
    translations: {
      en: {
        noPersona: "No Persona",
        selectPersona: "Select Persona",
        useDefaultSettings: "Use default settings",
        defaultModel: "Default Model",
        edit: "Edit",
        delete: "Delete",
        createPersona: "Create new Persona...",
        personaName: "Persona Name",
        namePlaceholder: "e.g. Coding Assistant, Translator...",
        icon: "Icon",
        model: "Model",
        useCurrentModel: "Use current model",
        modelHint:
          "Select the model for this Persona. Leave empty to use the current model.",
        systemPrompt: "System Prompt",
        promptPlaceholder:
          "Enter custom system prompt to define AI behavior and role...",
        promptHint:
          "This prompt will be injected as a system message, overriding default prompts.",
        features: "Features",
        deepThinking: "Deep Thinking",
        webSearch: "Web Search",
        featuresHint:
          "Enabled features will be automatically activated for each chat.",
        cancel: "Cancel",
        save: "Save",
        deleteConfirm: "Are you sure you want to delete this Persona?",
        editPersona: "Edit Persona",
        createNewPersona: "Create New Persona",
        importFromUrl: "Import from URL",
        enterUrl: "Enter the URL of the persona configuration JSON:",
        importSuccess: "Personas imported successfully!",
        nameRequired: "Please enter a Persona name",
        importError:
          "Failed to import personas. Please check the URL and JSON format.",
      },
      zh: {
        noPersona: "无 Persona",
        selectPersona: "选择 Persona",
        useDefaultSettings: "使用默认设置",
        defaultModel: "默认模型",
        edit: "编辑",
        delete: "删除",
        createPersona: "创建新 Persona...",
        personaName: "Persona 名称",
        namePlaceholder: "例如：代码助手、翻译专家...",
        icon: "图标",
        model: "模型",
        useCurrentModel: "使用当前选择的模型",
        modelHint: "选择此 Persona 使用的模型，留空则使用页面当前选择的模型",
        systemPrompt: "系统提示词",
        promptPlaceholder: "输入自定义系统提示词，定义 AI 的行为和角色...",
        promptHint: "此提示词将作为系统消息注入到对话中，优先于默认系统提示",
        features: "增强功能",
        deepThinking: "深度思考",
        webSearch: "联网搜索",
        featuresHint: "启用后将在每次对话时自动开启对应功能",
        cancel: "取消",
        save: "保存",
        deleteConfirm: "确定要删除这个 Persona 吗？",
        editPersona: "编辑 Persona",
        createNewPersona: "创建新 Persona",
        importFromUrl: "从 URL 导入",
        enterUrl: "请输入 Persona 配置 JSON 的 URL：",
        importSuccess: "Persona 导入成功！",
        nameRequired: "请输入 Persona 名称",
        importError: "导入失败，请检查 URL 和 JSON 格式。",
      },
    },

    init() {
      const lang = navigator.language || navigator.userLanguage;
      this.locale = lang.startsWith("zh") ? "zh" : "en";
    },

    t(key) {
      return (
        this.translations[this.locale]?.[key] ||
        this.translations["en"][key] ||
        key
      );
    },
  };

  // ==================== Utilities ====================
  const Utils = {
    escapeHtml(str) {
      if (!str) return "";
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    },

    generateFid() {
      // lightweight unique id for messages injected by the persona manager
      return (
        "fid-" +
        Math.random().toString(36).slice(2, 9) +
        "-" +
        Date.now().toString(36)
      );
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    waitForElement(selector, timeout = 2000) {
      return new Promise((resolve) => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
      });
    },
  };

  // ==================== Storage Service ====================
  const Storage = {
    loadPersonas() {
      try {
        const stored = localStorage.getItem(CONSTANTS.STORAGE.PERSONAS);
        State.personas = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("[QwenPersona] Failed to load personas:", e);
        State.personas = [];
      }
    },

    savePersonas() {
      try {
        localStorage.setItem(
          CONSTANTS.STORAGE.PERSONAS,
          JSON.stringify(State.personas)
        );
      } catch (e) {
        console.error("[QwenPersona] Failed to save personas:", e);
      }
    },

    loadSelectedPersona() {
      try {
        State.selectedPersonaId =
          localStorage.getItem(CONSTANTS.STORAGE.SELECTED) || null;
      } catch (e) {
        State.selectedPersonaId = null;
      }
    },

    saveSelectedPersona() {
      try {
        if (State.selectedPersonaId) {
          localStorage.setItem(
            CONSTANTS.STORAGE.SELECTED,
            State.selectedPersonaId
          );
        } else {
          localStorage.removeItem(CONSTANTS.STORAGE.SELECTED);
        }
      } catch (e) {
        console.error("[QwenPersona] Failed to save selected persona:", e);
      }
    },

    loadChatPersonaMap() {
      try {
        const stored = localStorage.getItem(CONSTANTS.STORAGE.CHAT_MAP);
        State.chatPersonaMap = stored ? JSON.parse(stored) : {};

        // Cleanup any pseudo-IDs that might have leaked into the map
        const pseudoNames = ["new", "new-chat", "start", "create", "home", "null", "undefined"];
        let changed = false;
        pseudoNames.forEach((id) => {
          if (State.chatPersonaMap[id]) {
            delete State.chatPersonaMap[id];
            changed = true;
          }
        });
        if (changed) Storage.saveChatPersonaMap();
      } catch (e) {
        State.chatPersonaMap = {};
      }
    },

    saveChatPersonaMap() {
      try {
        localStorage.setItem(
          CONSTANTS.STORAGE.CHAT_MAP,
          JSON.stringify(State.chatPersonaMap)
        );
      } catch (e) {
        console.error("[QwenPersona] Failed to save chat persona map:", e);
      }
    },

    loadChatInjectedMap() {
      try {
        const stored = localStorage.getItem(CONSTANTS.STORAGE.CHAT_INJECTED);
        State.chatInjectedMap = stored ? JSON.parse(stored) : {};
      } catch (e) {
        State.chatInjectedMap = {};
      }
    },

    saveChatInjectedMap() {
      try {
        localStorage.setItem(
          CONSTANTS.STORAGE.CHAT_INJECTED,
          JSON.stringify(State.chatInjectedMap)
        );
      } catch (e) {
        console.error("[QwenPersona] Failed to save chat injected map:", e);
      }
    },
  };

  // ==================== UI Service ====================
  const UI = {
    injectStyles() {
      const style = document.createElement("style");
      style.id = CONSTANTS.SELECTORS.STYLE_ID;
      style.textContent = `
            /* Persona Dropdown Container */
            .persona-dropdown-container {
                position: relative;
                display: flex;
                align-items: center;
                margin-right: 12px;
                z-index: 100;
            }

            /* Transition Helper */
            .persona-input-transition {
                transition: filter 0.3s ease, opacity 0.3s ease;
            }

            /* Disabled Input State */
            .persona-input-disabled {
                filter: grayscale(100%);
                opacity: 0.7;
                pointer-events: none;
                cursor: not-allowed;
                position: relative;
            }

            .persona-input-disabled::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10;
                border-radius: inherit;
            }

            /* Persona Trigger Button */
            .persona-trigger {
                display: flex;
                align-items: center;
              justify-content: flex-start;
              gap: 8px;
              width: var(--persona-trigger-expanded-width, 10rem);
              min-width: 36px;
              height: 36px;
              padding: 0 12px;
              box-sizing: border-box;
              border-radius: 999px;
              background: var(--container-secondary-fill, #f7f8fc);
              cursor: pointer;
              border: 1px solid var(--line-secondary-border, #e0e2eb);
              font-size: 14px;
              color: var(--character-primary-text, #2c2c36);
              overflow: hidden;
              transition:
                width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                padding 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                gap 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                background 0.2s ease,
                border 0.2s ease,
                color 0.2s ease,
                filter 0.3s ease,
                opacity 0.3s ease;
            }

            /* Collapsed State (Circular) */
            .persona-trigger.collapsed {
              width: 36px;
              padding: 0;
              justify-content: center;
              background: transparent;
              gap: 0;
              margin-right: 4px;
            }

            .persona-trigger.collapsed:hover {
                background: var(--container-secondary-fill, #f7f8fc);
            }

            .persona-trigger.collapsed .persona-trigger-text,
            .persona-trigger.collapsed .persona-trigger-arrow {
                opacity: 0;
                width: 0;
                margin: 0;
                pointer-events: none;
            }

            .persona-trigger.collapsed .persona-trigger-icon {
              margin: 0;
              font-size: 20px;
              width: 100%;
              height: 100%;
              justify-content: center;
            }

            .persona-trigger:hover {
                background: var(--container-tertiary-fill, #eef0f5);
            }

            .persona-trigger.active {
                border-color: var(--btn-brandprimary-fill, #615ced);
                background: var(--container-brandquinary-fill, #eeedff);
            }

            .persona-trigger-icon {
              font-size: 18px;
              flex-shrink: 0;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
            }

            .persona-trigger-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                transition: opacity 0.2s ease, width 0.2s ease;
            }

            .persona-trigger-arrow {
                font-size: 16px;
                transition: transform 0.2s ease, opacity 0.2s ease, width 0.2s ease;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transform-origin: center;
            }

            .persona-trigger-arrow.open {
                transform: rotate(180deg);
            }

            /* Dropdown Menu */
            .persona-dropdown-menu {
                position: fixed;
                min-width: 240px;
                max-width: 320px;
                background: var(--container-primary-fill, #fff);
                border-radius: 16px;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
                border: 1px solid var(--line-secondary-border, #e0e2eb);
                z-index: 99999;
                opacity: 0;
                transform: translateY(-8px);
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
                overflow: visible;
            }

            .persona-dropdown-menu.visible {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }

            .persona-dropdown-header {
                padding: 12px 16px;
                font-size: 12px;
                font-weight: 500;
                color: var(--character-tertiary-text, #8f91a8);
                border-bottom: 1px solid var(--line-secondary-border, #e0e2eb);
            }

            .persona-dropdown-list {
                max-height: 66vh;
                overflow-y: auto;
                padding: 0 8px;
            }

            .persona-dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                cursor: pointer !important;
                border-radius: 12px;
                transition: all 0.15s ease;
                margin: 8px 0;
                user-select: none;
            }

            .persona-dropdown-item:hover {
                background: var(--container-secondary-fill, #f7f8fc) !important;
            }

            .persona-dropdown-item.selected {
                background: var(--container-brandquinary-fill, #eeedff);
            }

            .persona-dropdown-item.selected:hover {
                background: var(--container-brandquinary-fill, #eeedff) !important;
            }

            .persona-dropdown-item-icon {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: var(--container-tertiary-fill, #eef0f5);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .persona-dropdown-item.selected .persona-dropdown-item-icon {
                background: var(--btn-brandprimary-fill, #615ced);
                color: white;
            }

            .persona-dropdown-item-content {
                flex: 1;
                overflow: hidden;
            }

            .persona-dropdown-item-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--character-primary-text, #2c2c36);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .persona-dropdown-item-model {
                font-size: 12px;
                color: var(--character-tertiary-text, #8f91a8);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .persona-dropdown-item-actions {
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.15s ease;
            }

            .persona-dropdown-item:hover .persona-dropdown-item-actions {
                opacity: 1;
            }

            .persona-action-btn {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.15s ease;
                color: var(--character-tertiary-text, #8f91a8);
            }

            .persona-action-btn:hover {
                background: var(--container-tertiary-fill, #eef0f5);
                color: var(--character-primary-text, #2c2c36);
            }

            .persona-action-btn.delete:hover {
                background: #fee2e2;
                color: #dc2626;
            }

            .persona-dropdown-divider {
                height: 1px;
                background: var(--line-secondary-border, #e0e2eb);
            }

            .persona-dropdown-footer {
                padding: 4px;
            }

            .persona-create-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 12px;
                cursor: pointer !important;
                border-radius: 12px;
                transition: all 0.15s ease;
                color: var(--btn-brandprimary-fill, #615ced);
                font-size: 14px;
                font-weight: 500;
                user-select: none;
            }

            .persona-create-btn:hover {
                background: var(--container-brandquinary-fill, #eeedff) !important;
            }

            /* Modal Styles */
            .persona-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }

            .persona-modal-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .persona-modal {
                background: var(--container-primary-fill, #fff);
                border-radius: 20px;
                width: 480px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transform: scale(0.95);
                transition: transform 0.2s ease;
            }

            .persona-modal-overlay.visible .persona-modal {
                transform: scale(1);
            }

            .persona-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid var(--line-secondary-border, #e0e2eb);
            }

            .persona-modal-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--character-primary-text, #2c2c36);
            }

            .persona-modal-close {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.15s ease;
                color: var(--character-tertiary-text, #8f91a8);
            }

            .persona-modal-close:hover {
                background: var(--container-secondary-fill, #f7f8fc);
            }

            .persona-modal-body {
                padding: 24px;
                overflow-y: auto;
                max-height: calc(90vh - 180px);
            }

            .persona-form-group {
                margin-bottom: 20px;
            }

            .persona-form-label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                color: var(--character-primary-text, #2c2c36);
                margin-bottom: 8px;
            }

            .persona-form-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--line-secondary-border, #e0e2eb);
                border-radius: 12px;
                font-size: 14px;
                color: var(--character-primary-text, #2c2c36);
                background: var(--container-primary-fill, #fff);
                transition: all 0.15s ease;
                box-sizing: border-box;
            }

            .persona-form-input:focus {
                outline: none;
                border-color: var(--btn-brandprimary-fill, #615ced);
                box-shadow: 0 0 0 3px rgba(97, 92, 237, 0.1);
            }

            .persona-form-textarea {
                resize: vertical;
                min-height: 120px;
                font-family: inherit;
                line-height: 1.5;
            }

            .persona-form-select {
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238f91a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 12px center;
                padding-right: 40px;
            }

            .persona-form-hint {
                font-size: 12px;
                color: var(--character-tertiary-text, #8f91a8);
                margin-top: 6px;
            }

            .persona-modal-footer {
                display: flex;
                gap: 12px;
                padding: 20px 24px;
                border-top: 1px solid var(--line-secondary-border, #e0e2eb);
            }

            .persona-btn {
                flex: 1;
                padding: 12px 24px;
                border-radius: 999px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s ease;
                border: none;
            }

            .persona-btn-secondary {
                background: var(--container-secondary-fill, #f7f8fc);
                color: var(--character-primary-text, #2c2c36);
            }

            .persona-btn-secondary:hover {
                background: var(--container-tertiary-fill, #eef0f5);
            }

            .persona-btn-primary {
                background: var(--btn-brandprimary-fill, #615ced);
                color: white;
            }

            .persona-btn-primary:hover {
                background: #5248d9;
            }

            .persona-btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Dark mode adjustments */
            html.dark .persona-trigger {
                background: var(--container-secondary-fill, #2a2a2a);
            }

            html.dark .persona-trigger:hover {
                background: var(--container-tertiary-fill, #3a3a3a);
            }

            html.dark .persona-dropdown-menu {
                background: var(--container-primary-fill, #1f1f1f);
                border-color: var(--line-secondary-border, #424554);
            }

            html.dark .persona-modal {
                background: var(--container-primary-fill, #1f1f1f);
            }

            html.dark .persona-form-input {
                background: var(--container-secondary-fill, #2a2a2a);
                border-color: var(--line-secondary-border, #424554);
            }

            /* Animation */
            @keyframes persona-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .persona-indicator {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--btn-brandprimary-fill, #615ced);
                animation: persona-pulse 2s ease-in-out infinite;
            }

            /* Scrollbar styling */
            .persona-dropdown-list::-webkit-scrollbar {
                width: 6px;
            }

            .persona-dropdown-list::-webkit-scrollbar-track {
                background: transparent;
            }

            .persona-dropdown-list::-webkit-scrollbar-thumb {
                background: var(--line-secondary-border, #e0e2eb);
                border-radius: 3px;
            }

            .persona-dropdown-list::-webkit-scrollbar-thumb:hover {
                background: var(--character-quaternary-text, #c8cad9);
            }

            /* Checkbox group styling */
            .persona-form-checkbox-group {
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
            }

            .persona-form-checkbox-item {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                user-select: none;
            }

            .persona-form-checkbox {
                width: 18px;
                height: 18px;
                border: 2px solid var(--line-secondary-border, #e0e2eb);
                border-radius: 4px;
                appearance: none;
                cursor: pointer;
                position: relative;
                transition: all 0.15s ease;
                background: var(--container-primary-fill, #fff);
            }

            .persona-form-checkbox:checked {
                background: var(--btn-brandprimary-fill, #615ced);
                border-color: var(--btn-brandprimary-fill, #615ced);
            }

            .persona-form-checkbox:checked::after {
                content: '';
                position: absolute;
                left: 5px;
                top: 2px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            .persona-form-checkbox:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(97, 92, 237, 0.1);
            }

            .persona-form-checkbox-label {
                font-size: 14px;
                color: var(--character-primary-text, #2c2c36);
            }

            /* Feature badges in dropdown */
            .persona-dropdown-item-features {
                display: flex;
                gap: 4px;
                margin-top: 2px;
            }

            .persona-feature-badge {
                font-size: 10px;
                padding: 1px 6px;
                border-radius: 4px;
                background: var(--container-tertiary-fill, #eef0f5);
                color: var(--character-tertiary-text, #8f91a8);
            }

            .persona-feature-badge.active {
                background: var(--container-brandquinary-fill, #eeedff);
                color: var(--btn-brandprimary-fill, #615ced);
            }

            /* Adjust model selector margin */
            [class*="index-module__model-selector-text"],
            [class*="index-module__web-model-selector"] {
                margin-left: 0;
            }

            /* Hide native model selector when agent is active */
            body.persona-agent-active .header-left > .ant-dropdown-trigger {
                display: none !important;
            }

            body.persona-agent-active [class*="index-module__model-selector-text"] {
                display: none !important;
            }

            body.persona-agent-active [class*="index-module__web-model-selector"] {
                display: none !important;
            }

            /* Hide the "设为默认/取消默认" button when agent is active */
            /* This might need adjustment based on new structure, but usually it's near the selector */
            body.persona-agent-active [class*="index-module__add-model-icon"] {
                display: none !important;
            }

            /* Adjust navbar layout when model selector is hidden */
            body.persona-agent-active .persona-dropdown-container {
                margin-left: 0;
                margin-right: 16px;
            }

            /* Emoji Picker Styles */
            .persona-emoji-wrapper {
                position: relative;
            }

            .persona-emoji-trigger {
                font-size: 24px;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--line-secondary-border, #e0e2eb);
                border-radius: 12px;
                cursor: pointer;
                background: var(--container-primary-fill, #fff);
                transition: all 0.15s ease;
            }

            .persona-emoji-trigger:hover {
                background: var(--container-secondary-fill, #f7f8fc);
                border-color: var(--btn-brandprimary-fill, #615ced);
            }

            .persona-emoji-picker-container {
                position: absolute;
                top: 100%;
                left: 0;
                z-index: 100;
                margin-top: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                border: 1px solid var(--line-secondary-border, #e0e2eb);
                border-radius: 12px;
                overflow: hidden;
                display: none;
                width: 380px;
                max-width: 90vw;
            }

            .persona-emoji-picker-container.visible {
                display: block;
            }

            emoji-picker {
                --background: var(--container-primary-fill, #fff);
                --border-color: var(--line-secondary-border, #e0e2eb);
                --input-border-color: var(--line-secondary-border, #e0e2eb);
                --input-font-color: var(--character-primary-text, #2c2c36);
                --button-hover-background: var(--container-secondary-fill, #f7f8fc);
                width: 100%;
                height: 320px;
            }

            html.dark emoji-picker {
                --background: #1f1f1f;
                --border-color: #424554;
                --input-border-color: #424554;
                --input-font-color: #e0e2eb;
                --button-hover-background: #2a2a2a;
            }
      `;
      document.head.appendChild(style);
    },

    createDropdownUI() {
      const container = document.createElement("div");
      container.className = "persona-dropdown-container";
      container.id = CONSTANTS.SELECTORS.CONTAINER;

      const trigger = document.createElement("div");
      trigger.className = `persona-trigger ${CONSTANTS.SELECTORS.TRIGGER_COLLAPSED}`;
      trigger.id = CONSTANTS.SELECTORS.TRIGGER;
      trigger.innerHTML = `
            <span class="persona-trigger-icon">🤖</span>
            <span class="persona-trigger-text">${I18n.t("noPersona")}</span>
            <span class="persona-trigger-arrow">
                <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><use xlink:href="#icon-line-chevron-down"></use></svg>
            </span>
        `;

      trigger.onclick = (e) => {
        e.stopPropagation();
        UI.toggleDropdown();
      };

      trigger.addEventListener("mouseenter", () => {
        trigger.classList.remove(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
      });

      trigger.addEventListener("mouseleave", () => {
        if (!State.selectedPersonaId && !State.dropdownVisible) {
          trigger.classList.add(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
        }
      });

      container.appendChild(trigger);

      if (!document.getElementById(CONSTANTS.SELECTORS.MENU)) {
        const menu = document.createElement("div");
        menu.className = "persona-dropdown-menu";
        menu.id = CONSTANTS.SELECTORS.MENU;
        document.body.appendChild(menu);
      }

      return container;
    },

    renderDropdownMenu() {
      const menu = document.getElementById(CONSTANTS.SELECTORS.MENU);
      if (!menu) return;

      let html = `
            <div class="persona-dropdown-header">${I18n.t(
              "selectPersona"
            )}</div>
            <div class="persona-dropdown-list">
                <div class="persona-dropdown-item ${
                  !State.selectedPersonaId
                    ? CONSTANTS.SELECTORS.ITEM_SELECTED
                    : ""
                }" data-id="">
                    <div class="persona-dropdown-item-icon">🚫</div>
                    <div class="persona-dropdown-item-content">
                        <div class="persona-dropdown-item-name">${I18n.t(
                          "noPersona"
                        )}</div>
                        <div class="persona-dropdown-item-model">${I18n.t(
                          "useDefaultSettings"
                        )}</div>
                    </div>
                </div>
        `;

      State.personas.forEach((persona) => {
        let featureBadges = "";
        if (persona.deepThinking || persona.webSearch) {
          featureBadges = '<div class="persona-dropdown-item-features">';
          if (persona.deepThinking) {
            featureBadges += `<span class="persona-feature-badge active">${I18n.t(
              "deepThinking"
            )}</span>`;
          }
          if (persona.webSearch) {
            featureBadges += `<span class="persona-feature-badge active">${I18n.t(
              "webSearch"
            )}</span>`;
          }
          featureBadges += "</div>";
        }

        html += `
                <div class="persona-dropdown-item ${
                  persona.id === State.selectedPersonaId
                    ? CONSTANTS.SELECTORS.ITEM_SELECTED
                    : ""
                }" data-id="${persona.id}">
                    <div class="persona-dropdown-item-icon">${
                      persona.emoji || "🚫"
                    }</div>
                    <div class="persona-dropdown-item-content">
                        <div class="persona-dropdown-item-name">${Utils.escapeHtml(
                          persona.name
                        )}</div>
                        <div class="persona-dropdown-item-model">${Utils.escapeHtml(
                          persona.modelName ||
                            persona.model ||
                            I18n.t("defaultModel")
                        )}</div>
                        ${featureBadges}
                    </div>
                    <div class="persona-dropdown-item-actions">
                        <div class="persona-action-btn edit" data-action="edit" data-id="${
                          persona.id
                        }" title="${I18n.t("edit")}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </div>
                        <div class="persona-action-btn delete" data-action="delete" data-id="${
                          persona.id
                        }" title="${I18n.t("delete")}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                </div>
            `;
      });

      html += `
            </div>
            <div class="persona-dropdown-divider"></div>
            <div class="persona-dropdown-footer">
                <div class="persona-create-btn" id="${
                  CONSTANTS.SELECTORS.CREATE_BTN
                }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>${I18n.t("createPersona")}</span>
                </div>
                <div class="persona-create-btn" id="${
                  CONSTANTS.SELECTORS.IMPORT_BTN
                }" style="margin-top: 4px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>${I18n.t("importFromUrl")}</span>
                </div>
            </div>
        `;

      menu.innerHTML = html;

      menu.querySelectorAll(".persona-dropdown-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.closest(".persona-action-btn")) return;
          const id = item.dataset.id;
          console.log("[QwenPersona] Item clicked, id:", id);
          PersonaManager.selectPersona(id || null);
        });
      });

      menu.querySelectorAll(".persona-action-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          console.log("[QwenPersona] Action clicked:", action, id);
          if (action === "edit") {
            PersonaManager.editPersona(id);
          } else if (action === "delete") {
            PersonaManager.deletePersona(id);
          }
        });
      });

      const createBtn = document.getElementById(CONSTANTS.SELECTORS.CREATE_BTN);
      if (createBtn) {
        createBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("[QwenPersona] Create button clicked");
          UI.openModal();
        });
      }

      const importBtn = document.getElementById(CONSTANTS.SELECTORS.IMPORT_BTN);
      if (importBtn) {
        importBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("[QwenPersona] Import button clicked");
          const url = prompt(I18n.t("enterUrl"));
          if (url) {
            PersonaManager.importFromUrl(url);
          }
        });
      }
    },

    updateTriggerUI() {
      const trigger = document.getElementById(CONSTANTS.SELECTORS.TRIGGER);
      if (!trigger) return;

      const selectedPersona = State.personas.find(
        (p) => p.id === State.selectedPersonaId
      );
      const iconSpan = trigger.querySelector(".persona-trigger-icon");
      const textSpan = trigger.querySelector(".persona-trigger-text");

      if (selectedPersona) {
        trigger.classList.remove(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
        trigger.classList.add(CONSTANTS.SELECTORS.TRIGGER_ACTIVE);
        iconSpan.textContent = selectedPersona.emoji || "🚫";
        textSpan.textContent = selectedPersona.name;
        if (selectedPersona.model) {
          document.body.classList.add(CONSTANTS.SELECTORS.AGENT_ACTIVE);
        } else {
          document.body.classList.remove(CONSTANTS.SELECTORS.AGENT_ACTIVE);
        }
      } else {
        trigger.classList.add(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
        trigger.classList.remove(CONSTANTS.SELECTORS.TRIGGER_ACTIVE);
        iconSpan.textContent = "🤖";
        textSpan.textContent = I18n.t("noPersona");
        document.body.classList.remove(CONSTANTS.SELECTORS.AGENT_ACTIVE);
      }
    },

    createModalUI() {
      const overlay = document.createElement("div");
      overlay.className = "persona-modal-overlay";
      overlay.id = CONSTANTS.SELECTORS.MODAL_OVERLAY;
      overlay.onclick = (e) => {
        if (e.target === overlay) UI.closeModal();
      };

      const modal = document.createElement("div");
      modal.className = "persona-modal";
      modal.id = CONSTANTS.SELECTORS.MODAL;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    },

    renderModal(persona = null) {
      const modal = document.getElementById(CONSTANTS.SELECTORS.MODAL);
      if (!modal) return;

      const isEdit = !!persona;
      const title = isEdit ? I18n.t("editPersona") : I18n.t("createNewPersona");

      let modelOptions = "";
      State.availableModels.forEach((m) => {
        const selected = persona && persona.model === m.id ? "selected" : "";
        modelOptions += `<option value="${m.id}" ${selected}>${
          m.name || m.id
        }</option>`;
      });

      modal.innerHTML = `
            <div class="persona-modal-header">
                <div class="persona-modal-title">${title}</div>
                <div class="persona-modal-close" onclick="window.personaManager.closeModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="persona-modal-body">
                <div class="persona-form-group">
                    <label class="persona-form-label">${I18n.t(
                      "personaName"
                    )}</label>
                    <input type="text" class="persona-form-input" id="${
                      CONSTANTS.SELECTORS.INPUT_NAME
                    }"
                           value="${
                             persona ? Utils.escapeHtml(persona.name) : ""
                           }"
                           placeholder="${I18n.t("namePlaceholder")}">
                </div>
                <div class="persona-form-group">
                    <label class="persona-form-label">${I18n.t("icon")}</label>
                    <div class="persona-emoji-wrapper">
                        <button class="persona-emoji-trigger" id="persona-emoji-trigger-btn">
                            ${persona ? persona.emoji : "🤖"}
                        </button>
                        <input type="hidden" id="${
                          CONSTANTS.SELECTORS.INPUT_EMOJI
                        }" value="${persona ? persona.emoji : "🤖"}">
                        <div class="persona-emoji-picker-container" id="persona-emoji-picker">
                            <emoji-picker></emoji-picker>
                        </div>
                    </div>
                </div>
                <div class="persona-form-group">
                    <label class="persona-form-label">${I18n.t("model")}</label>
                    <select class="persona-form-input persona-form-select" id="${
                      CONSTANTS.SELECTORS.INPUT_MODEL
                    }">
                        <option value="">${I18n.t("useCurrentModel")}</option>
                        ${modelOptions}
                    </select>
                    <div class="persona-form-hint">${I18n.t("modelHint")}</div>
                </div>
                <div class="persona-form-group">
                    <label class="persona-form-label">${I18n.t(
                      "systemPrompt"
                    )}</label>
                    <textarea class="persona-form-input persona-form-textarea" id="${
                      CONSTANTS.SELECTORS.INPUT_PROMPT
                    }"
                              placeholder="${I18n.t("promptPlaceholder")}">${
        persona ? Utils.escapeHtml(persona.prompt) : ""
      }</textarea>
                    <div class="persona-form-hint">${I18n.t("promptHint")}</div>
                </div>
                <div class="persona-form-group">
                    <label class="persona-form-label">${I18n.t(
                      "features"
                    )}</label>
                    <div class="persona-form-checkbox-group">
                        <label class="persona-form-checkbox-item">
                            <input type="checkbox" class="persona-form-checkbox" id="${
                              CONSTANTS.SELECTORS.INPUT_DEEP_THINKING
                            }"
                                   ${
                                     persona && persona.deepThinking
                                       ? "checked"
                                       : ""
                                   }>
                            <span class="persona-form-checkbox-label">${I18n.t(
                              "deepThinking"
                            )}</span>
                        </label>
                        <label class="persona-form-checkbox-item">
                            <input type="checkbox" class="persona-form-checkbox" id="${
                              CONSTANTS.SELECTORS.INPUT_WEB_SEARCH
                            }"
                                   ${
                                     persona && persona.webSearch
                                       ? "checked"
                                       : ""
                                   }>
                            <span class="persona-form-checkbox-label">${I18n.t(
                              "webSearch"
                            )}</span>
                        </label>
                    </div>
                    <div class="persona-form-hint">${I18n.t(
                      "featuresHint"
                    )}</div>
                </div>
            </div>
            <div class="persona-modal-footer">
                <button class="persona-btn persona-btn-secondary" onclick="window.personaManager.closeModal()">${I18n.t(
                  "cancel"
                )}</button>
                <button class="persona-btn persona-btn-primary" id="${
                  CONSTANTS.SELECTORS.SAVE_BTN
                }">${I18n.t("save")}</button>
            </div>
        `;

      // Emoji Picker Logic
      const emojiBtn = document.getElementById("persona-emoji-trigger-btn");
      const emojiInput = document.getElementById(
        CONSTANTS.SELECTORS.INPUT_EMOJI
      );
      const emojiPickerContainer = document.getElementById(
        "persona-emoji-picker"
      );
      const emojiPicker = emojiPickerContainer
        ? emojiPickerContainer.querySelector("emoji-picker")
        : null;

      if (emojiBtn && emojiPickerContainer) {
        emojiBtn.onclick = (e) => {
          e.stopPropagation();
          emojiPickerContainer.classList.toggle("visible");
        };
      }

      if (emojiPicker) {
        if (I18n.locale === "zh") {
          emojiPicker.dataSource =
            "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/zh/cldr/data.json";
          emojiPicker.locale = "zh";
        }
        emojiPicker.addEventListener("emoji-click", (event) => {
          const emoji = event.detail.unicode;
          emojiBtn.textContent = emoji;
          emojiInput.value = emoji;
          emojiPickerContainer.classList.remove("visible");
        });
      }

      document.getElementById(CONSTANTS.SELECTORS.SAVE_BTN).onclick = () =>
        PersonaManager.savePersonaFromModal(persona?.id);
    },

    toggleDropdown() {
      State.dropdownVisible = !State.dropdownVisible;
      const trigger = document.getElementById(CONSTANTS.SELECTORS.TRIGGER);
      const menu = document.getElementById(CONSTANTS.SELECTORS.MENU);
      const arrow = document.querySelector(".persona-trigger-arrow");

      if (State.dropdownVisible) {
        trigger.classList.remove(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
        UI.renderDropdownMenu();

        if (trigger && menu) {
          const rect = trigger.getBoundingClientRect();
          menu.style.top = rect.bottom + 8 + "px";
          menu.style.left = rect.left + "px";
          console.log("[QwenPersona] Dropdown position:", {
            top: menu.style.top,
            left: menu.style.left,
            rect,
          });
        } else {
          console.warn("[QwenPersona] Missing elements:", {
            trigger: !!trigger,
            menu: !!menu,
          });
        }

        menu.classList.add(CONSTANTS.SELECTORS.MENU_VISIBLE);
        if (arrow) arrow.classList.add(CONSTANTS.SELECTORS.ARROW_OPEN);
        console.log(
          "[QwenPersona] Dropdown opened, menu classes:",
          menu.className
        );
      } else {
        if (!State.selectedPersonaId) {
          trigger.classList.add(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
        }
        menu.classList.remove(CONSTANTS.SELECTORS.MENU_VISIBLE);
        if (arrow) arrow.classList.remove(CONSTANTS.SELECTORS.ARROW_OPEN);
        console.log("[QwenPersona] Dropdown closed");
      }
    },

    closeDropdown() {
      State.dropdownVisible = false;
      const trigger = document.getElementById(CONSTANTS.SELECTORS.TRIGGER);
      const menu = document.getElementById(CONSTANTS.SELECTORS.MENU);
      const arrow = document.querySelector(".persona-trigger-arrow");

      if (trigger && !State.selectedPersonaId) {
        trigger.classList.add(CONSTANTS.SELECTORS.TRIGGER_COLLAPSED);
      }

      if (menu) menu.classList.remove(CONSTANTS.SELECTORS.MENU_VISIBLE);
      if (arrow) arrow.classList.remove(CONSTANTS.SELECTORS.ARROW_OPEN);
    },

    openModal(persona = null) {
      State.editingPersona = persona;
      UI.closeDropdown();
      UI.renderModal(persona);
      const overlay = document.getElementById(
        CONSTANTS.SELECTORS.MODAL_OVERLAY
      );
      if (overlay) {
        overlay.classList.add(CONSTANTS.SELECTORS.MENU_VISIBLE);
        State.modalVisible = true;
      }
    },

    closeModal() {
      const overlay = document.getElementById(
        CONSTANTS.SELECTORS.MODAL_OVERLAY
      );
      if (overlay) {
        overlay.classList.remove(CONSTANTS.SELECTORS.MENU_VISIBLE);
        State.modalVisible = false;
      }
      State.editingPersona = null;
    },

    setInteractionState(disabled) {
      const personaTrigger = document.getElementById(
        CONSTANTS.SELECTORS.TRIGGER
      );
      if (personaTrigger) {
        if (disabled) {
          personaTrigger.classList.add(CONSTANTS.SELECTORS.INPUT_DISABLED);
        } else {
          personaTrigger.classList.remove(CONSTANTS.SELECTORS.INPUT_DISABLED);
        }
      }

      const textareas = document.querySelectorAll(CONSTANTS.SELECTORS.TEXTAREA);
      textareas.forEach((t) => {
        // Find the outermost chat-message-input container for visual effect
        const outerContainer = t.closest(CONSTANTS.SELECTORS.CHAT_MESSAGE_INPUT);
        // Also find the inner container for additional styling
        const innerContainer =
          t.closest(CONSTANTS.SELECTORS.INPUT_CONTAINER) || t.parentElement;
        // Find the prompt input container as well
        const promptContainer = t.closest(CONSTANTS.SELECTORS.CHAT_PROMPT_INPUT_CONTAINER);

        // Add transition class to all containers
        [outerContainer, innerContainer, promptContainer].forEach((c) => {
          if (c) c.classList.add(CONSTANTS.SELECTORS.TRANSITION);
        });

        if (disabled) {
          if (!t.disabled) {
            t.dataset.originalPlaceholder = t.placeholder || "";
            t.placeholder = "正在切换 Persona...";
            t.disabled = true;
            t.classList.add(CONSTANTS.SELECTORS.INTERACTION_DISABLED);

            // Apply disabled style to outermost container for best visual effect
            if (outerContainer) {
              outerContainer.classList.add(CONSTANTS.SELECTORS.INPUT_DISABLED);
            } else if (promptContainer) {
              promptContainer.classList.add(CONSTANTS.SELECTORS.INPUT_DISABLED);
            } else if (innerContainer) {
              innerContainer.classList.add(CONSTANTS.SELECTORS.INPUT_DISABLED);
            }
          }
        } else {
          if (
            t.disabled &&
            t.classList.contains(CONSTANTS.SELECTORS.INTERACTION_DISABLED)
          ) {
            t.disabled = false;
            t.placeholder = t.dataset.originalPlaceholder || "";
            t.classList.remove(CONSTANTS.SELECTORS.INTERACTION_DISABLED);

            // Remove disabled style from all containers
            [outerContainer, innerContainer, promptContainer].forEach((c) => {
              if (c) c.classList.remove(CONSTANTS.SELECTORS.INPUT_DISABLED);
            });
          }
        }
      });
    },

    waitForNavbar() {
      const maxAttempts = 50;
      let attempts = 0;

      const checkNavbar = () => {
        const headerLeft = document.querySelector(
          CONSTANTS.SELECTORS.HEADER_LEFT
        );

        if (
          headerLeft &&
          !document.getElementById(CONSTANTS.SELECTORS.CONTAINER)
        ) {
          // Try to find the model selector trigger (new structure uses ant-dropdown-trigger)
          const modelSelectorTrigger = headerLeft.querySelector(
            CONSTANTS.SELECTORS.MODEL_SELECTOR_TRIGGER
          );
          const modelSelector = headerLeft.querySelector(
            CONSTANTS.SELECTORS.MODEL_SELECTOR
          );

          const container = UI.createDropdownUI();

          // Insert before the model selector trigger or model selector text
          if (modelSelectorTrigger) {
            headerLeft.insertBefore(container, modelSelectorTrigger);
          } else if (modelSelector) {
            headerLeft.insertBefore(container, modelSelector.parentElement || modelSelector);
          } else {
            headerLeft.appendChild(container);
          }

          UI.updateTriggerUI();
          console.log("[QwenPersona] UI injected");

          PersonaManager.autoSelectPersonaForChat();
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkNavbar, 200);
        } else {
          console.warn(
            "[QwenPersona] Failed to find navbar after",
            maxAttempts,
            "attempts"
          );
        }
      };

      checkNavbar();
    },

    startMessageObserver() {
        // Deprecated: previous releases used a MutationObserver to remove
        // plaintext markers like "[System Instruction]" from rendered messages.
        // With explicit system-message injection we no longer need this DOM
        // rewriting. Keep a no-op here to avoid changing the public API.
        if (this.messageObserver) return;
        this.messageObserver = null;
    },
  };

  // ==================== Model Service ====================
  const ModelManager = {
    async fetchModels() {
      try {
        const response = await fetch("/api/models", {
          method: "GET",
          headers: {
            Accept: "application/json",
            source: "web",
          },
        });
        if (response.ok) {
          const data = await response.json();
          State.availableModels = data.data || data || [];
          localStorage.setItem(
            CONSTANTS.STORAGE.MODELS_CACHE,
            JSON.stringify(State.availableModels)
          );
          console.log(
            "[QwenPersona] Models loaded:",
            State.availableModels.length
          );
        }
      } catch (e) {
        console.error("[QwenPersona] Failed to fetch models:", e);
        try {
          const cached = localStorage.getItem(CONSTANTS.STORAGE.MODELS_CACHE);
          if (cached) State.availableModels = JSON.parse(cached);
        } catch (err) {}
      }
    },

    async simulateModelSelection(modelId) {
      if (!modelId) return false;

      console.log("[QwenPersona] Attempting to select model via UI:", modelId);

      const hideStyle = document.createElement("style");
      hideStyle.id = "persona-hide-model-selector";
      hideStyle.textContent = `
            ${CONSTANTS.SELECTORS.MODEL_SELECTOR_DROPDOWN},
            .ant-dropdown,
            .ant-select-dropdown {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: none !important;
            animation: none !important;
            }
        `;
      document.head.appendChild(hideStyle);

      // Ensure the style has been applied before we open the dropdown.
      // Without this, some browsers may show a 1-frame flash before the CSS takes effect.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      try {
        // Try to find the model selector trigger using multiple strategies
        let modelTrigger = null;
        
        // Strategy 1: Find by model selector content
        const modelTriggerContent = document.querySelector(
          CONSTANTS.SELECTORS.MODEL_SELECTOR_CONTENT
        );
        if (modelTriggerContent) {
          modelTrigger = modelTriggerContent.closest(
            CONSTANTS.SELECTORS.ANT_DROPDOWN_TRIGGER
          );
        }
        
        // Strategy 2: Find by header-left trigger directly
        if (!modelTrigger) {
          const headerLeft = document.querySelector(CONSTANTS.SELECTORS.HEADER_LEFT);
          if (headerLeft) {
            modelTrigger = headerLeft.querySelector(
              CONSTANTS.SELECTORS.MODEL_SELECTOR_TRIGGER
            );
          }
        }

        if (!modelTrigger) {
          console.warn("[QwenPersona] Model selector trigger not found");
          return false;
        }

        modelTrigger.click();
        console.log("[QwenPersona] Clicked model selector trigger");

        const findModelInOpenDropdowns = () => {
          // AntD dropdowns are typically rendered in portals under body.
          // We search all open dropdown containers to catch both primary and secondary menus.
          const candidates = Array.from(document.querySelectorAll(".ant-dropdown"));
          for (const el of candidates) {
            if (!el.querySelector(CONSTANTS.SELECTORS.MODEL_SELECTOR_ITEM)) continue;
            const btn = ModelManager.findModelButton(el, modelId);
            if (btn) return btn;
          }

          // Fallback: directly search all model selector popups if the container class differs.
          const popups = Array.from(
            document.querySelectorAll(CONSTANTS.SELECTORS.MODEL_SELECTOR_DROPDOWN)
          );
          for (const popup of popups) {
            if (!popup.querySelector(CONSTANTS.SELECTORS.MODEL_SELECTOR_ITEM)) continue;
            const btn = ModelManager.findModelButton(popup, modelId);
            if (btn) return btn;
          }

          return null;
        };

        const menuSelector = CONSTANTS.SELECTORS.MODEL_SELECTOR_DROPDOWN;
        let menu = await Utils.waitForElement(menuSelector, 2000);
        if (!menu) {
          // Also try .ant-dropdown as fallback
          menu = await Utils.waitForElement('.ant-dropdown', 1000);
          if (!menu) {
            console.warn("[QwenPersona] Model selector menu not found");
            return false;
          }
        }

        let modelButton = ModelManager.findModelButton(menu, modelId) || findModelInOpenDropdowns();

        if (!modelButton) {
          // Look for the "展开更多模型" button which opens a secondary dropdown
          const expandBtn = menu.querySelector(
            CONSTANTS.SELECTORS.MODEL_SELECTOR_VIEW_MORE
          );
          console.log("[QwenPersona] Expand button:", expandBtn);

          if (expandBtn) {
            const textEl = expandBtn.querySelector(
              CONSTANTS.SELECTORS.MODEL_VIEW_MORE_TEXT
            );
            const text = textEl ? textEl.textContent : expandBtn.textContent || "";

            const isExpanded = text.includes("折叠") || text.includes("收起");
            console.log("[QwenPersona] Menu expanded state:", isExpanded);

            if (!isExpanded) {
              console.log("[QwenPersona] Hovering over expand button to trigger secondary menu...");
              
              // The "展开更多模型" button triggers a secondary dropdown on hover/click
              // It's wrapped in an ant-dropdown-trigger
              const triggerWrapper = expandBtn.closest('.ant-dropdown-trigger') || expandBtn;
              
              // Trigger hover-based submenu (some builds require mouseover/mousemove).
              triggerWrapper.dispatchEvent(
                new MouseEvent("mouseenter", { bubbles: true })
              );
              triggerWrapper.dispatchEvent(
                new MouseEvent("mouseover", { bubbles: true })
              );
              triggerWrapper.dispatchEvent(
                new MouseEvent("mousemove", { bubbles: true })
              );
              await Utils.sleep(250);

              // Also click as a fallback (some builds open on click).
              triggerWrapper.click();

              // Wait briefly for the secondary dropdown to mount.
              await Utils.waitForElement(
                CONSTANTS.SELECTORS.MODEL_SELECTOR_DROPDOWN_SECONDARY,
                1200
              );
              await Utils.sleep(200);

              // Prefer searching the secondary menu first if present.
              const secondaryMenu = document.querySelector(
                CONSTANTS.SELECTORS.MODEL_SELECTOR_DROPDOWN_SECONDARY
              );
              if (secondaryMenu) {
                console.log(
                  "[QwenPersona] Found secondary menu, searching for model..."
                );
                modelButton = ModelManager.findModelButton(secondaryMenu, modelId);
              }

              // Robust fallback: search across all open dropdowns/popups.
              if (!modelButton) {
                modelButton = findModelInOpenDropdowns();
              }
            }
          } else {
            console.log("[QwenPersona] No expand button found in menu");
          }
        }

        if (modelButton) {
          const itemContainer = modelButton.closest(
            CONSTANTS.SELECTORS.MODEL_SELECTOR_ITEM
          ) || modelButton;

          if (
            itemContainer &&
            Array.from(itemContainer.classList).some((c) =>
              c.includes("model-item-selected") || c.includes("model-selector-item-selected")
            )
          ) {
            console.log("[QwenPersona] Model already selected:", modelId);
            ModelManager.closeModelSelector();
            return true;
          }

          modelButton.click();
          console.log("[QwenPersona] Clicked model button:", modelId);
          return true;
        } else {
          console.warn("[QwenPersona] Model button not found for:", modelId);
          ModelManager.closeModelSelector();
          return false;
        }
      } catch (e) {
        console.error("[QwenPersona] Error selecting model:", e);
        return false;
      } finally {
        await Utils.sleep(50);
        const style = document.getElementById("persona-hide-model-selector");
        if (style) style.remove();
      }
    },

    findModelButton(menu, modelId) {
      const modelItems = menu.querySelectorAll(
        CONSTANTS.SELECTORS.MODEL_SELECTOR_ITEM
      );

      console.log(
        "[QwenPersona] Looking for model:",
        modelId,
        "in",
        modelItems.length,
        "items"
      );

      const normalize = (s) =>
        (s || "")
          .toLowerCase()
          .normalize("NFKC")
          .replace(/\s+/g, "")
          // Keep only a-z and 0-9 to ignore punctuation like '-', '.', '_' etc.
          .replace(/[^a-z0-9]/g, "");

      const normalizedId = normalize(modelId);

      for (const item of modelItems) {
        // Try multiple selectors for model name text
        let nameEl = item.querySelector(CONSTANTS.SELECTORS.MODEL_NAME_TEXT);
        if (!nameEl) {
          // Fallback: look for any text element within the item
          nameEl = item.querySelector('[class*="model-item-name"]') || 
                   item.querySelector('[class*="model-name"]') ||
                   item.querySelector('[class*="model-selector-item-name"]');
        }
        
        // Get text from the first span child if present, otherwise use textContent
        let modelName = '';
        if (nameEl) {
          const spanEl = nameEl.querySelector('span');
          modelName = spanEl ? spanEl.textContent.trim() : nameEl.textContent.trim();
        } else {
          modelName = item.textContent.trim();
        }

        if (modelName) {
          const normalizedName = normalize(modelName);

          if (normalizedName === normalizedId) {
            console.log("[QwenPersona] Found exact match:", modelName);
            return item;
          }

          if (
            normalizedId.includes(normalizedName) ||
            normalizedName.includes(normalizedId)
          ) {
            console.log("[QwenPersona] Found partial match:", modelName);
            return item;
          }
        }
      }

      for (const item of modelItems) {
        let nameEl = item.querySelector(CONSTANTS.SELECTORS.MODEL_NAME_TEXT);
        if (!nameEl) {
          nameEl = item.querySelector('[class*="model-item-name"]') || 
                   item.querySelector('[class*="model-name"]') ||
                   item.querySelector('[class*="model-selector-item-name"]');
        }
        
        let modelName = '';
        if (nameEl) {
          const spanEl = nameEl.querySelector('span');
          modelName = spanEl ? spanEl.textContent.trim() : nameEl.textContent.trim();
        } else {
          modelName = item.textContent.trim();
        }

        if (modelName) {
          const mainPart = modelId
            .split("-")
            .slice(0, 2)
            .join("-")
            .toLowerCase();
          const namePart = modelName
            .split("-")
            .slice(0, 2)
            .join("-")
            .toLowerCase();
          if (mainPart === namePart) {
            console.log("[QwenPersona] Found loose match:", modelName);
            return item;
          }
        }
      }

      console.log("[QwenPersona] No match found for:", modelId);
      return null;
    },

    closeModelSelector() {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
          keyCode: 27,
          which: 27,
          bubbles: true,
        })
      );

      setTimeout(() => {
        const backdrop = document
          .querySelector(".selector-modal-list")
          ?.closest(".fixed");
        if (backdrop) {
          const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          document.body.dispatchEvent(event);
        }
      }, 50);
    },
  };

  // ==================== Feature Service ====================
  const FeatureManager = {
    findDeepThinkingButton() {
      // First try to find within the new container structure
      const thinkingContainer = document.querySelector(
        CONSTANTS.SELECTORS.DEEP_THINKING_CONTAINER
      );
      if (thinkingContainer) {
        const btn = thinkingContainer.querySelector(
          CONSTANTS.SELECTORS.CHAT_INPUT_FEATURE_BTN
        );
        if (btn) return btn;
      }

      const buttons = document.querySelectorAll(
        CONSTANTS.SELECTORS.CHAT_INPUT_FEATURE_BTN
      );
      for (const btn of buttons) {
        const use = btn.querySelector("use");
        if (
          use &&
          use.getAttribute("xlink:href")?.includes("icon-line-deepthink-01")
        ) {
          return btn;
        }
        if (use &&
          use.getAttribute("xlink:href")?.includes("icon-fill-deepthink-01")
        ) {
          return btn;
        }
        if (btn.querySelector(".icon-line-deepthink-01")) {
          return btn;
        }
        if (btn.querySelector(".icon-fill-deepthink-01")) {
          return btn;
        }
      }

      for (const btn of buttons) {
        const textEl = btn.querySelector(
          CONSTANTS.SELECTORS.CHAT_INPUT_FEATURE_TEXT
        );
        if (textEl && textEl.textContent.includes("深度思考")) {
          return btn;
        }
      }

      return null;
    },

    findWebSearchButton() {
      const btn = document.querySelector(CONSTANTS.SELECTORS.WEB_SEARCH_BTN);
      if (btn) return btn;

      const buttons = document.querySelectorAll(
        CONSTANTS.SELECTORS.CHAT_INPUT_FEATURE_BTN
      );
      for (const b of buttons) {
        const use = b.querySelector("use");
        if (
          use &&
          use.getAttribute("xlink:href")?.includes("icon-line-globe-01")
        ) {
          return b;
        }
        if (b.querySelector(".icon-line-globe-01")) {
          return b;
        }
      }

      for (const b of buttons) {
        const textEl = b.querySelector(
          CONSTANTS.SELECTORS.CHAT_INPUT_FEATURE_TEXT
        );
        if (textEl && textEl.textContent.includes("搜索")) {
          return b;
        }
      }

      return null;
    },

    isFeatureButtonActive(button) {
      if (!button) return false;

      // Check for common active states
      if (button.classList.contains("active")) return true;
      if (button.classList.contains("checked")) return true;
      if (button.getAttribute("aria-pressed") === "true") return true;
      if (button.dataset.state === "active" || button.dataset.state === "on")
        return true;

      // Check for disabled state (web search is disabled when deep thinking is active)
      if (button.classList.contains("disabled")) return false;

      // Check for fill icons (filled = active state)
      const use = button.querySelector("use");
      if (use) {
        const href = use.getAttribute("xlink:href") || "";
        if (href.includes("icon-fill-deepthink")) return true;
        if (href.includes("icon-fill-globe")) return true;
      }

      const icon = button.querySelector('i[class*="icon-"]');
      if (icon && icon.classList.contains("icon-fill-deepthink-01"))
        return true;
      if (icon && icon.classList.contains("icon-fill-globe-01")) return true;

      // Check SVG icon within
      const svg = button.querySelector("svg use");
      if (svg) {
        const href = svg.getAttribute("xlink:href") || "";
        if (href.includes("fill")) return true;
      }

      // Check background color for active state
      const style = window.getComputedStyle(button);
      const bgColor = style.backgroundColor;
      if (
        bgColor &&
        bgColor !== "rgba(0, 0, 0, 0)" &&
        bgColor !== "transparent" &&
        bgColor !== "rgb(255, 255, 255)"
      ) {
        // Has a background color, might be active
        // Check if it matches the brand color pattern
        if (bgColor.includes("97") || bgColor.includes("92") || bgColor.includes("237")) {
          return true;
        }
      }

      return false;
    },

    async simulateDeepThinking(enabled) {
      console.log("[QwenPersona] Setting deep thinking to:", enabled);

      const button = FeatureManager.findDeepThinkingButton();
      if (!button) {
        console.warn("[QwenPersona] Deep thinking button not found");
        return false;
      }

      const currentlyActive = FeatureManager.isFeatureButtonActive(button);
      console.log(
        "[QwenPersona] Deep thinking currently active:",
        currentlyActive
      );

      if (currentlyActive !== enabled) {
        button.click();
        console.log("[QwenPersona] Clicked deep thinking button");
        await Utils.sleep(100);
        return true;
      } else {
        console.log("[QwenPersona] Deep thinking already in desired state");
        return true;
      }
    },

    async simulateWebSearch(enabled) {
      console.log("[QwenPersona] Setting web search to:", enabled);

      const button = FeatureManager.findWebSearchButton();
      if (!button) {
        console.warn("[QwenPersona] Web search button not found");
        return false;
      }

      const currentlyActive = FeatureManager.isFeatureButtonActive(button);
      console.log(
        "[QwenPersona] Web search currently active:",
        currentlyActive
      );

      if (currentlyActive !== enabled) {
        button.click();
        console.log("[QwenPersona] Clicked web search button");
        await Utils.sleep(100);
        return true;
      } else {
        console.log("[QwenPersona] Web search already in desired state");
        return true;
      }
    },

    async applyFeatureSettings(persona) {
      if (!persona) return;

      await Utils.sleep(200);

      const deepThinkingEnabled = persona.deepThinking === true;
      await FeatureManager.simulateDeepThinking(deepThinkingEnabled);

      const webSearchEnabled = persona.webSearch === true;
      await FeatureManager.simulateWebSearch(webSearchEnabled);
    },
  };

  // ==================== Chat Service ====================
  const ChatManager = {
    isPseudoId(id) {
      if (!id) return true;
      const pseudoIds = new Set([
        "new",
        "new-chat",
        "create",
        "start",
        "home",
        "null",
        "undefined",
        "test",
      ]);
      return pseudoIds.has(id.toLowerCase());
    },

    getCurrentChatId(url = location.pathname) {
      const match = url.match(/\/(?:c|chat)\/([a-zA-Z0-9-]+)/);
      const id = match ? match[1] : null;
      if (!id) return null;

      if (ChatManager.isPseudoId(id)) {
        Debug.log("getCurrentChatId pseudo route", { url, id });
        return null;
      }

      Debug.log("getCurrentChatId", { url, id });

      return id;
    },

    setPersonaForCurrentChat(personaId) {
      const chatId = ChatManager.getCurrentChatId();
      Debug.log("setPersonaForCurrentChat", {
        url: location.href,
        chatId,
        personaId,
        selectedPersonaId: State.selectedPersonaId,
      });
      if (chatId) {
        if (personaId) {
          State.chatPersonaMap[chatId] = personaId;
        } else {
          delete State.chatPersonaMap[chatId];
        }
        Storage.saveChatPersonaMap();
        console.log(
          "[QwenPersona] Mapped chat",
          chatId,
          "to persona",
          personaId
        );
        Debug.log("chatPersonaMap[chatId] now", {
          chatId,
          mappedTo: State.chatPersonaMap[chatId] || null,
          mapSize: Object.keys(State.chatPersonaMap || {}).length,
        });
      }
    },

    getPersonaForCurrentChat() {
      const chatId = ChatManager.getCurrentChatId();
      if (chatId && State.chatPersonaMap[chatId]) {
        return State.chatPersonaMap[chatId];
      }
      return null;
    },

    startUrlMonitor() {
      State.lastUrl = location.href;

      window.addEventListener("popstate", ChatManager.handleUrlChange);

      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        ChatManager.handleUrlChange();
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        ChatManager.handleUrlChange();
      };

      const navbarObserver = new MutationObserver(() => {
        if (!document.getElementById(CONSTANTS.SELECTORS.CONTAINER)) {
          console.log("[QwenPersona] Dropdown removed, re-injecting...");
          UI.waitForNavbar();
        }
      });

      const startNavbarObserver = () => {
        const navbar = document.querySelector(
          CONSTANTS.SELECTORS.HEADER_DESKTOP
        );
        if (navbar) {
          navbarObserver.observe(navbar, { childList: true, subtree: true });
          console.log("[QwenPersona] Navbar observer started");
        } else {
          setTimeout(startNavbarObserver, 500);
        }
      };
      startNavbarObserver();

      console.log("[QwenPersona] URL monitor started");
    },

    handleUrlChange() {
      const currentUrl = location.href;
      if (currentUrl === State.lastUrl) return;

      console.log(
        "[QwenPersona] URL changed:",
        State.lastUrl,
        "->",
        currentUrl
      );

      const prevChatId = ChatManager.getCurrentChatId(State.lastUrl);
      const currChatId = ChatManager.getCurrentChatId(currentUrl);

      Debug.event("url_change", {
        lastUrl: State.lastUrl,
        currentUrl,
        prevChatId,
        currChatId,
        selectedPersonaId: State.selectedPersonaId,
        pendingNewChatPersona: State.pendingNewChatPersona,
      });

      Debug.log("handleUrlChange ids", {
        lastUrl: State.lastUrl,
        currentUrl,
        prevChatId,
        currChatId,
        selectedPersonaId: State.selectedPersonaId,
        hasMappingForCurr: !!(currChatId && State.chatPersonaMap[currChatId]),
        mapSize: Object.keys(State.chatPersonaMap || {}).length,
      });

      if (
        !prevChatId &&
        currChatId &&
        State.selectedPersonaId &&
        !State.chatPersonaMap[currChatId]
      ) {
        console.log(
          "[QwenPersona] New chat detected, mapping current persona:",
          State.selectedPersonaId
        );
        State.chatPersonaMap[currChatId] = State.selectedPersonaId;
        Storage.saveChatPersonaMap();
        Debug.log("mapped new chat on navigation", {
          currChatId,
          mappedTo: State.selectedPersonaId,
        });
        Debug.event("map_new_chat_from_selection", {
          currChatId,
          mappedTo: State.selectedPersonaId,
        });
      }

      // If we navigated FROM a real chat TO the start page/pseudo route, 
      // reset the persona to "No Persona" to avoid carrying over selection 
      // from the previous chat session into the next one unexpectedly.
      if (prevChatId && !currChatId) {
        console.log("[QwenPersona] Navigated away from chat, resetting persona");
        Debug.log("Resetting persona on navigation to home", { prevChatId });
        PersonaManager.selectPersona(null);
      }

      // Bridge: if we just sent the first message of a new chat, bind the pending persona
      // to the chatId once the URL shows it.
      if (currChatId && !State.chatPersonaMap[currChatId] && State.pendingNewChatPersona) {
        const ageMs = Date.now() - (State.pendingNewChatPersona.ts || 0);
        if (ageMs >= 0 && ageMs < 15000) {
          State.chatPersonaMap[currChatId] = State.pendingNewChatPersona.personaId;
          Storage.saveChatPersonaMap();
          Debug.log("bridged pending persona to chat", {
            currChatId,
            mappedTo: State.pendingNewChatPersona.personaId,
            ageMs,
            reason: State.pendingNewChatPersona.reason,
          });
          Debug.event("map_new_chat_from_pending", {
            currChatId,
            mappedTo: State.pendingNewChatPersona.personaId,
            ageMs,
            reason: State.pendingNewChatPersona.reason,
          });
        }
        // Always clear after attempting to bind to avoid accidentally affecting later navigations.
        State.pendingNewChatPersona = null;
      }

      State.lastUrl = currentUrl;

      setTimeout(() => {
        if (!document.getElementById(CONSTANTS.SELECTORS.CONTAINER)) {
          console.log("[QwenPersona] Re-injecting UI after navigation");
          UI.waitForNavbar();
        }

        Debug.log("calling autoSelectPersonaForChat after navigation", {
          url: location.href,
          selectedPersonaId: State.selectedPersonaId,
        });
        PersonaManager.autoSelectPersonaForChat();
      }, 300);
    },
  };

  // ==================== Persona Manager ====================
  const PersonaManager = {
    selectPersona(id) {
      Debug.event("select_persona", {
        fromSelected: State.selectedPersonaId,
        toSelected: id || null,
        chatId: ChatManager.getCurrentChatId(),
      });
      Debug.log("selectPersona called", {
        fromSelected: State.selectedPersonaId,
        toSelected: id || null,
        url: location.href,
        chatId: ChatManager.getCurrentChatId(),
      });
      Debug.stack("selectPersona");

      State.selectedPersonaId = id || null;
      Storage.saveSelectedPersona();
      UI.updateTriggerUI();
      UI.closeDropdown();
      console.log("[QwenPersona] Selected:", id || "None");

      ChatManager.setPersonaForCurrentChat(id);

      setTimeout(async () => {
        UI.setInteractionState(true);
        try {
          if (id) {
            const persona = State.personas.find((p) => p.id === id);
            if (persona) {
              if (persona.model || persona.modelName) {
                const modelToSelect = persona.modelName || persona.model;
                await ModelManager.simulateModelSelection(modelToSelect);
              }

              await FeatureManager.applyFeatureSettings(persona);
            }
          } else {
            await FeatureManager.applyFeatureSettings({
              deepThinking: false,
              webSearch: false,
            });
          }
        } finally {
          UI.setInteractionState(false);
        }
      }, 100);
    },

    editPersona(id) {
      const persona = State.personas.find((p) => p.id === id);
      if (persona) {
        UI.openModal(persona);
      }
    },

    deletePersona(id) {
      if (!confirm(I18n.t("deleteConfirm"))) return;

      State.personas = State.personas.filter((p) => p.id !== id);
      Storage.savePersonas();

      if (State.selectedPersonaId === id) {
        State.selectedPersonaId = null;
        Storage.saveSelectedPersona();
        UI.updateTriggerUI();
      }

      // Clean up any stored chat mappings pointing to this persona
      try {
        let changed = false;
        for (const [chatId, personaId] of Object.entries(State.chatPersonaMap)) {
          if (personaId === id) {
            delete State.chatPersonaMap[chatId];
            changed = true;
          }
        }
        if (changed) Storage.saveChatPersonaMap();
      } catch (e) {
        // ignore cleanup failures
      }

      UI.renderDropdownMenu();
      console.log("[QwenPersona] Deleted:", id);
    },

    savePersonaFromModal(existingId = null) {
      const name = document
        .getElementById(CONSTANTS.SELECTORS.INPUT_NAME)
        .value.trim();
      const emoji = document.getElementById(
        CONSTANTS.SELECTORS.INPUT_EMOJI
      ).value;
      const model = document.getElementById(
        CONSTANTS.SELECTORS.INPUT_MODEL
      ).value;
      const prompt = document
        .getElementById(CONSTANTS.SELECTORS.INPUT_PROMPT)
        .value.trim();
      const deepThinking = document.getElementById(
        CONSTANTS.SELECTORS.INPUT_DEEP_THINKING
      ).checked;
      const webSearch = document.getElementById(
        CONSTANTS.SELECTORS.INPUT_WEB_SEARCH
      ).checked;

      if (!name) {
        alert(I18n.t("nameRequired"));
        return;
      }

      const modelObj = State.availableModels.find((m) => m.id === model);
      const modelName = modelObj ? modelObj.name : "";

      if (existingId) {
        const idx = State.personas.findIndex((p) => p.id === existingId);
        if (idx !== -1) {
          State.personas[idx] = {
            ...State.personas[idx],
            name,
            emoji,
            model,
            modelName,
            prompt,
            deepThinking,
            webSearch,
          };
        }
      } else {
        const newPersona = {
          id: "persona_" + Date.now(),
          name,
          emoji,
          model,
          modelName,
          prompt,
          deepThinking,
          webSearch,
          createdAt: Date.now(),
        };
        State.personas.push(newPersona);
      }

      Storage.savePersonas();
      UI.updateTriggerUI();
      UI.closeModal();
      console.log("[QwenPersona] Saved persona:", name);
    },

    async importFromUrl(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        if (!Array.isArray(data))
          throw new Error("Invalid JSON format: expected an array");

        // Basic validation
        const isValid = data.every((p) => p.id && p.name);
        if (!isValid) throw new Error("Invalid persona data");

        State.personas = data;
        Storage.savePersonas();

        // Reset selection if current selection is not in new list
        if (
          State.selectedPersonaId &&
          !State.personas.find((p) => p.id === State.selectedPersonaId)
        ) {
          State.selectedPersonaId = null;
          Storage.saveSelectedPersona();
          UI.updateTriggerUI();
        }

        UI.renderDropdownMenu();
        alert(I18n.t("importSuccess"));
      } catch (e) {
        console.error("[QwenPersona] Import failed:", e);
        alert(I18n.t("importError") + "\n" + e.message);
      }
    },

    autoSelectPersonaForChat() {
      const chatId = ChatManager.getCurrentChatId();

      Debug.log("autoSelectPersonaForChat", {
        url: location.href,
        chatId,
        selectedPersonaId: State.selectedPersonaId,
        recordedPersonaId: chatId ? State.chatPersonaMap[chatId] : null,
      });

      if (!chatId) {
        // We are on Home or a Pseudo route (/c/new, /c/new-chat etc).
        // Selection is maintained manually here or reset via navigation logic.
        return;
      }

      const recordedPersonaId = State.chatPersonaMap[chatId];

      // New-chat bridge: if a first-message request happened recently, we may have a
      // pending persona before the mapping is written. Prefer it over clearing selection.
      if (!recordedPersonaId && State.pendingNewChatPersona) {
        const ageMs = Date.now() - (State.pendingNewChatPersona.ts || 0);
        if (ageMs >= 0 && ageMs < 15000) {
          const pendingId = State.pendingNewChatPersona.personaId;
          Debug.log("autoSelect: using pending persona bridge", {
            chatId,
            pendingId,
            ageMs,
            reason: State.pendingNewChatPersona.reason,
          });
          Debug.event("auto_select_from_pending", {
            chatId,
            pendingId,
            ageMs,
            reason: State.pendingNewChatPersona.reason,
          });

          // Persist mapping now.
          State.chatPersonaMap[chatId] = pendingId;
          Storage.saveChatPersonaMap();
          State.pendingNewChatPersona = null;

          if (pendingId && pendingId !== State.selectedPersonaId) {
            PersonaManager.selectPersona(pendingId);
          }
          return;
        }
      }

      if (recordedPersonaId) {
        const personaExists = State.personas.find(
          (p) => p.id === recordedPersonaId
        );
        Debug.log("autoSelect: mapping exists", {
          chatId,
          recordedPersonaId,
          personaExists: !!personaExists,
        });
        if (personaExists) {
          if (recordedPersonaId !== State.selectedPersonaId) {
            console.log(
              "[QwenPersona] Auto-selecting persona for chat:",
              chatId,
              "->",
              recordedPersonaId
            );
            PersonaManager.selectPersona(recordedPersonaId);
          }
        } else {
          // Mapping points to a deleted/nonexistent persona. Remove it to avoid repeated flips.
          Debug.warn("autoSelect: mapping points to missing persona; deleting mapping", {
            chatId,
            recordedPersonaId,
          });
          delete State.chatPersonaMap[chatId];
          Storage.saveChatPersonaMap();
          if (State.selectedPersonaId) PersonaManager.selectPersona(null);
        }
      } else {
        Debug.log("autoSelect: no mapping for this chat", {
          chatId,
          selectedPersonaId: State.selectedPersonaId,
        });
        if (State.selectedPersonaId) {
          console.log(
            "[QwenPersona] No mapping for this chat, resetting to None"
          );
          PersonaManager.selectPersona(null);
        }
      }
    },
  };

  // ==================== Network Service ====================
  const NetworkManager = {
    interceptFetch() {
      const originalFetch = window.fetch;

      window.fetch = async function (url, options = {}) {
        const urlStr = typeof url === "string" ? url : (url.url || "");

        // Legacy: previous versions attempted to hide plaintext "[System Instruction]"
        // markers in chat history by rewriting GET /api/v2/chats responses. That
        // approach is no longer necessary because we now inject an explicit
        // role:"system" message. Keeping a historical response-rewrite here
        // increases complexity and may cause subtle bugs, so it's been removed.

        // 2. Intercept Completions (Injection logic)
        if (urlStr.includes("/api/v2/chat/completions")) {
          const persona = State.personas.find(
            (p) => p.id === State.selectedPersonaId
          );

          if (persona && options.body) {
            try {
              let body = JSON.parse(options.body);
              let modified = false;

              const chatId = body.chat_id || ChatManager.getCurrentChatId();

              // Detect if this is an edit action (user editing a previous message)
              const isEditAction =
                Array.isArray(body.messages) &&
                body.messages.some((m) => m.user_action === "edit");

              // Detect if this is truly a new chat (no existing conversation context)
              const isNewChat =
                (!body.conversation_id &&
                  !body.conversationId &&
                  !body.chat_id) ||
                (!body.parent_id &&
                  !body.parentId &&
                  body.messages &&
                  body.messages.length === 1 &&
                  !isEditAction);

              const hasSystemMessage =
                Array.isArray(body.messages) &&
                body.messages.some((m) => m.role === "system");

              // Check if chat_id exists in URL (indicates existing conversation)
              const urlChatIdMatch = urlStr.match(/chat_id=([a-zA-Z0-9-]+)/);
              const urlHasChatId = !!urlChatIdMatch;

              console.log("[QwenPersona] Debug - Request Check:", {
                url: urlStr,
                isNewChat,
                isEditAction,
                hasSystemMessage,
                urlHasChatId,
                chat_id: body.chat_id,
                parent_id: body.parent_id || body.parentId,
              });

              // Handle pending new chat persona mapping
              if (isNewChat && persona && persona.id) {
                State.pendingNewChatPersona = {
                  personaId: persona.id,
                  ts: Date.now(),
                  reason: "first_message_new_chat_request",
                };
                
                const currChatId = ChatManager.getCurrentChatId();
                if (currChatId && !State.chatPersonaMap[currChatId]) {
                  State.chatPersonaMap[currChatId] = persona.id;
                  Storage.saveChatPersonaMap();
                  State.pendingNewChatPersona = null;
                }
              }

              // Only inject system prompt if it's a new chat or if a system message is already present in the request.
              // Re-injecting system prompts on follow-up turns in an existing chat causes "no more than one system message" error.
              if (persona.prompt && Array.isArray(body.messages) && (isNewChat || hasSystemMessage)) {
                // Always upsert a system message at messages[0] with persona prompt and metadata.
                // This is more explicit and increases the chance the backend will honor the persona.
                const systemMsgIndex = body.messages.findIndex((m) => m.role === "system");

                const systemMessage = {
                  role: "system",
                  content: persona.prompt,
                  extra: {
                    injected_by: "qwen_persona",
                    personaId: persona.id,
                    injected_at: Date.now(),
                  },
                  fid: Utils.generateFid(),
                  timestamp: Date.now(),
                  models: body.model ? [body.model] : persona.model ? [persona.model] : [],
                };

                if (systemMsgIndex !== -1) {
                  // Replace existing system message content and metadata
                  const sys = body.messages[systemMsgIndex];
                  sys.content = systemMessage.content;
                  sys.extra = Object.assign({}, sys.extra || {}, systemMessage.extra);
                  sys.fid = sys.fid || systemMessage.fid;
                  sys.timestamp = sys.timestamp || systemMessage.timestamp;
                  if (systemMsgIndex !== 0) {
                    const [msg] = body.messages.splice(systemMsgIndex, 1);
                    body.messages.unshift(msg);
                  }
                } else {
                  // Insert as the first message
                  body.messages.unshift(systemMessage);
                }

                modified = true;
              }

              if (persona.model) {
                body.model = persona.model;
                modified = true;
              }

              if (modified) {
                options.body = JSON.stringify(body);
                console.log("[QwenPersona] Request modified with persona:", persona.name);

                // Track injection with metadata
                try {
                  if (chatId && persona.id) {
                    State.chatInjectedMap[chatId] = {
                      personaId: persona.id,
                      ts: Date.now(),
                      method: body.messages && body.messages[0] && body.messages[0].role === 'system' ? 'system_message' : 'body_extra',
                    };
                    Storage.saveChatInjectedMap();
                  }
                } catch (e) {
                  Debug.warn('Failed to record chatInjectedMap metadata', e);
                }
              }
            } catch (e) {
              console.error("[QwenPersona] Failed to modify request:", e);
            }
          }
        }

        return originalFetch.call(this, url, options);
      };

      console.log("[QwenPersona] Fetch intercepted");
    },
  };

  // ==================== Initialization ====================
  function init() {
    console.log("[QwenPersona] Initializing...");

    I18n.init();
    Storage.loadPersonas();
    Storage.loadSelectedPersona();
    Storage.loadChatPersonaMap();
    Storage.loadChatInjectedMap();
    ModelManager.fetchModels();

    UI.injectStyles();
    UI.createModalUI();

    // Load emoji-picker-element
    const emojiScript = document.createElement("script");
    emojiScript.type = "module";
    emojiScript.src =
      "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";
    document.head.appendChild(emojiScript);

    NetworkManager.interceptFetch();

    UI.waitForNavbar();

    ChatManager.startUrlMonitor();

    // Reset to "No Persona" on initial load if we start on the home page or a pseudo-chat page
    const startId = ChatManager.getCurrentChatId();
    if (!startId) {
      console.log("[QwenPersona] Starting on home/pseudo page, resetting persona");
      PersonaManager.selectPersona(null);
    }

    window.personaManager = {
      closeModal: UI.closeModal,
      openModal: UI.openModal,
      refresh: () => {
        Storage.loadPersonas();
        Storage.loadSelectedPersona();
        UI.updateTriggerUI();
      },
      debugDump: () => {
        const chatId = ChatManager.getCurrentChatId();
        const payload = {
          url: location.href,
          chatId,
          selectedPersonaId: State.selectedPersonaId,
          selectedPersonaName:
            State.personas.find((p) => p.id === State.selectedPersonaId)?.name ||
            null,
          recordedPersonaId: chatId ? State.chatPersonaMap[chatId] : null,
          recordedPersonaName:
            chatId && State.chatPersonaMap[chatId]
              ? State.personas.find((p) => p.id === State.chatPersonaMap[chatId])
                  ?.name || null
              : null,
          pendingNewChatPersona: State.pendingNewChatPersona,
          mapSize: Object.keys(State.chatPersonaMap || {}).length,
          mapSample: Object.entries(State.chatPersonaMap || {}).slice(0, 10),
          debugEvents: typeof Debug !== "undefined" ? Debug.getEvents() : [],
        };
        console.log("[QwenPersona] debugDump", payload);
        return payload;
      },
    };

    document.addEventListener("click", (e) => {
      const container = document.getElementById(CONSTANTS.SELECTORS.CONTAINER);
      const menu = document.getElementById(CONSTANTS.SELECTORS.MENU);
      const isClickInsideContainer = container && container.contains(e.target);
      const isClickInsideMenu = menu && menu.contains(e.target);

      if (!isClickInsideContainer && !isClickInsideMenu) {
        UI.closeDropdown();
      }

      // Close emoji picker when clicking outside
      const emojiPickerContainer = document.getElementById(
        "persona-emoji-picker"
      );
      const emojiBtn = document.getElementById("persona-emoji-trigger-btn");
      if (emojiPickerContainer && emojiBtn) {
        if (
          !emojiPickerContainer.contains(e.target) &&
          !emojiBtn.contains(e.target)
        ) {
          emojiPickerContainer.classList.remove("visible");
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
