// ==UserScript==
// @name         AO3: Menu Helpers Library
// @version      2.1.2
// @description  Shared UI components and styling for AO3 userscripts - Enhanced theme detection
// @author       BlackBatCat
// @match        *://archiveofourown.org/*
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  // Prevent multiple injections
  if (window.AO3MenuHelpers) {
    return;
  }

  let stylesInjected = false;

  // ============================================================
  // THEME DETECTION SYSTEM
  // ============================================================

  const ThemeDetector = {
    cache: {},

    /**
     * Creates a temporary element with specified tag and classes
     * @private
     */
    _createTempElement(tag, className) {
      const element = document.createElement(tag);
      if (tag === "input" && className) {
        element.type = className; // Set type for inputs
      } else if (className) {
        element.className = className; // Set class for other elements
      }
      element.style.cssText =
        "position:absolute;left:-9999px;visibility:hidden;";
      if (!document.body) {
        // If body doesn't exist yet, wait for it
        return null;
      }
      document.body.appendChild(element);
      return element;
    },

    /**
     * Safely gets computed style, handling missing elements
     * @private
     */
    _getComputedStyle(selector, tempConfig) {
      let element = selector ? document.querySelector(selector) : null;
      let cleanup = false;

      if (!element && tempConfig) {
        element = this._createTempElement(tempConfig.tag, tempConfig.className);
        if (!element) return null; // Body not ready
        cleanup = true;
      }

      if (!element) return null;

      const styles = window.getComputedStyle(element);
      const result = {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        color: styles.color,
        padding: styles.padding,
      };

      if (cleanup) element.remove();
      return result;
    },

    /**
     * Sample dialog/modal styling
     */
    getDialogStyles() {
      if (this.cache.dialog) return this.cache.dialog;

      // Try to sample from actual modal
      let styles = this._getComputedStyle("#modal");

      // Fallback to fieldset
      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle("fieldset");
      }

      // Last resort: create temporary modal
      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle(null, { tag: "div", className: "" });
      }

      // Ensure we have valid values with fallbacks
      this.cache.dialog = {
        backgroundColor: styles?.backgroundColor || "#ffffff",
        borderColor: styles?.borderColor || "rgba(0, 0, 0, 0.2)",
        borderWidth: styles?.borderWidth || "1px",
        borderRadius: styles?.borderRadius || "8px",
        boxShadow: styles?.boxShadow || "0 0 20px rgba(0,0,0,0.2)",
      };

      return this.cache.dialog;
    },

    /**
     * Sample blurb styling (for list items)
     */
    getBlurbStyles() {
      if (this.cache.blurb) return this.cache.blurb;

      let styles = this._getComputedStyle("li.blurb");

      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle(null, {
          tag: "li",
          className: "blurb",
        });
      }

      this.cache.blurb = {
        backgroundColor: styles?.backgroundColor || "#f5f5f5",
        borderColor: styles?.borderColor || "rgba(0, 0, 0, 0.2)",
        borderWidth: styles?.borderWidth || "1px",
        borderRadius: styles?.borderRadius || "8px",
        boxShadow: styles?.boxShadow || "none",
        padding: styles?.padding || "0.75em",
      };

      return this.cache.blurb;
    },

    /**
     * Sample button styling
     */
    getButtonStyles() {
      if (this.cache.button) return this.cache.button;

      // Try to sample from actual submit inputs in action areas first
      let styles = this._getComputedStyle('.actions li input[type="submit"]');

      if (!styles) {
        styles = this._getComputedStyle('input[type="submit"]');
      }

      if (!styles) {
        styles = this._getComputedStyle("button");
      }

      if (!styles) {
        styles = this._getComputedStyle(".actions a");
      }

      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle(null, {
          tag: "input",
          className: "submit",
        });
      }

      this.cache.button = {
        backgroundColor: styles?.backgroundColor || "#e0e0e0",
        borderColor: styles?.borderColor || "rgba(0, 0, 0, 0.3)",
        borderWidth: styles?.borderWidth || "1px",
        borderRadius: styles?.borderRadius || "4px",
        color: styles?.color || "#000000",
        boxShadow: styles?.boxShadow || "none",
      };

      return this.cache.button;
    },

    /**
     * Sample input field styling
     */
    getInputStyles() {
      if (this.cache.input) return this.cache.input;

      // Always use temporary element for inputs to ensure skin styles are applied
      const styles = this._getComputedStyle(null, {
        tag: "input",
        className: "text",
      });

      this.cache.input = {
        backgroundColor: styles?.backgroundColor || "#ffffff",
        borderColor: styles?.borderColor || "rgba(0, 0, 0, 0.3)",
        borderWidth: styles?.borderWidth || "1px",
        borderRadius: styles?.borderRadius || "4px",
        color: styles?.color || "#000000",
      };

      return this.cache.input;
    },

    /**
     * Sample fieldset/section styling
     */
    getFieldsetStyles() {
      if (this.cache.fieldset) return this.cache.fieldset;

      let styles = null;

      // On works/chapters pages, sample from work meta group first
      const WORKS_PAGE_REGEX =
        /^https?:\/\/archiveofourown\.org\/(?:.*\/)?(works|chapters)(\/|$)/;
      if (WORKS_PAGE_REGEX.test(window.location.href)) {
        // Try the meta group container itself
        styles = this._getComputedStyle("dl.work.meta.group");

        // Fallback to dd elements within the meta group
        if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
          styles = this._getComputedStyle("dl.work.meta.group dd");
        }
      }

      // Fallback to original sampling logic (fieldsets, listbox, temp element)
      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle("fieldset");
      }

      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle(".listbox");
      }

      if (!styles || styles.backgroundColor === "rgba(0, 0, 0, 0)") {
        styles = this._getComputedStyle(null, {
          tag: "fieldset",
          className: "",
        });
      }

      // Ensure we have valid values with fallbacks
      this.cache.fieldset = {
        backgroundColor: styles?.backgroundColor || "#f9f9f9",
        borderColor: styles?.borderColor || "rgba(0, 0, 0, 0.2)",
        borderWidth: styles?.borderWidth || "1px",
        borderRadius: styles?.borderRadius || "8px",
        boxShadow: styles?.boxShadow || "none",
      };

      return this.cache.fieldset;
    },

    /**
     * Sample text color from body
     */
    getTextColor() {
      if (this.cache.textColor) return this.cache.textColor;

      const body = document.body || document.documentElement;
      if (!body) {
        this.cache.textColor = "#000000";
        return this.cache.textColor;
      }

      const styles = window.getComputedStyle(body);
      this.cache.textColor = styles.color || "#000000";
      return this.cache.textColor;
    },

    /**
     * Sample link color
     */
    getLinkColor() {
      if (this.cache.linkColor) return this.cache.linkColor;

      let link = document.querySelector("a");
      let cleanup = false;

      if (!link) {
        link = this._createTempElement("a", "");
        if (!link) {
          this.cache.linkColor = "#0000ff";
          return this.cache.linkColor;
        }
        cleanup = true;
      }

      const styles = window.getComputedStyle(link);
      this.cache.linkColor = styles.color || "#0000ff";

      if (cleanup) link.remove();

      return this.cache.linkColor;
    },

    /**
     * Clear cache (useful if theme changes)
     */
    clearCache() {
      this.cache = {};
    },
  };

  // ============================================================
  // MAIN LIBRARY
  // ============================================================

  window.AO3MenuHelpers = {
    version: "2.1.2",
    themeDetector: ThemeDetector,

    /**
     * Detects AO3's input field background color from current theme
     * Uses theme detector with caching
     * @returns {string} Background color (hex or rgba format)
     */
    getAO3InputBackground() {
      const inputStyles = this.themeDetector.getInputStyles();
      return inputStyles.backgroundColor;
    },

    /**
     * Injects shared CSS styles for all menu components
     * Only injects once per page load, safe to call multiple times
     * Automatically called when library loads
     */
    injectSharedStyles() {
      if (stylesInjected) return;
      if (!document.head) {
        // Wait for head to be available
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            this.injectSharedStyles();
          });
        }
        return;
      }

      const existingStyle = document.getElementById("ao3-menu-helpers-styles");
      if (existingStyle) {
        stylesInjected = true;
        return;
      }

      // Get theme styles - with safe fallbacks
      const dialogTheme = this.themeDetector.getDialogStyles();
      const inputTheme = this.themeDetector.getInputStyles();
      const buttonTheme = this.themeDetector.getButtonStyles();
      const fieldsetTheme = this.themeDetector.getFieldsetStyles();
      const textColor = this.themeDetector.getTextColor();

      const style = document.createElement("style");
      style.id = "ao3-menu-helpers-styles";
      style.textContent = `
            /* Dialog Container */
            .ao3-menu-dialog {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: ${dialogTheme.backgroundColor};
              padding: 20px;
              border: ${dialogTheme.borderWidth} solid ${dialogTheme.borderColor};
              border-radius: ${dialogTheme.borderRadius};
              box-shadow: ${dialogTheme.boxShadow};
              z-index: 10000;
              width: 90%;
              max-width: 600px;
              max-height: 80vh;
              overflow-y: auto;
              font-family: inherit;
              font-size: inherit;
              color: ${textColor};
              box-sizing: border-box;
            }

            /* Mobile: Full width with minimal padding */
            @media (max-width: 768px) {
              .ao3-menu-dialog {
                width: 96% !important;
                max-width: 96% !important;
                height: auto !important;
                max-height: calc(100vh - 120px) !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                padding: 15px !important;
              }
            }
            
            .ao3-menu-dialog h3 {
              text-align: center;
              margin-top: 0;
              color: inherit;
              font-family: inherit;
            }
            
            /* Settings Sections */
            .ao3-menu-dialog .settings-section {
              background: ${fieldsetTheme.backgroundColor};
              border: ${fieldsetTheme.borderWidth} solid ${fieldsetTheme.borderColor};
              border-radius: ${fieldsetTheme.borderRadius};
              padding: 15px 15px 10px 15px;
              margin-bottom: 20px;
              box-shadow: ${fieldsetTheme.boxShadow};
            }

            .ao3-menu-dialog .settings-section > *:last-child,
            .ao3-menu-dialog .settings-section > *:last-child > *:last-child {
              margin-bottom: 0 !important;
            }            

            .ao3-menu-dialog .section-title {
              margin-top: 0;
              margin-bottom: 15px;
              font-size: 1.2em;
              font-weight: bold;
              color: inherit;
              opacity: 0.85;
              font-family: inherit;
            }
            
            /* Setting Groups */
            .ao3-menu-dialog .setting-group {
              margin-bottom: 15px;
            }
            
            .ao3-menu-dialog .setting-label {
              display: block;
              margin-bottom: 6px;
              font-weight: bold;
              color: inherit;
              opacity: 0.9;
            }
            
            .ao3-menu-dialog .setting-description {
              display: block;
              margin-bottom: 8px;
              font-size: 0.9em;
              color: inherit;
              opacity: 0.6;
              line-height: 1.4;
            }
            
            /* Checkbox and Radio Labels */
            .ao3-menu-dialog .checkbox-label {
              display: block;
              font-weight: normal;
              color: inherit;
              margin-bottom: 8px;
            }
            
            .ao3-menu-dialog .radio-label {
              display: block;
              font-weight: normal;
              color: inherit;
              margin-left: 20px;
              margin-bottom: 8px;
            }
            
            /* Subsettings (indented settings) */
            .ao3-menu-dialog .subsettings {
              padding-left: 20px;
              margin-top: 10px;
            }
            
            /* Layout Helpers */
            .ao3-menu-dialog .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .ao3-menu-dialog .setting-group + .two-column {
              margin-top: 15px;
            }
            
            /* Slider with Value Display */
            .ao3-menu-dialog .slider-with-value {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .ao3-menu-dialog .slider-with-value input[type="range"] {
              flex-grow: 1;
            }
            
            .ao3-menu-dialog .value-display {
              min-width: 40px;
              text-align: center;
              font-weight: bold;
              color: inherit;
              opacity: 0.6;
            }
            
            /* Form Inputs */
            .ao3-menu-dialog input[type="text"],
            .ao3-menu-dialog input[type="number"],
            .ao3-menu-dialog select,
            .ao3-menu-dialog textarea {
              width: 100%;
              box-sizing: border-box;
              padding-left: 8px;
              background: ${inputTheme.backgroundColor};
              border: ${inputTheme.borderWidth} solid ${inputTheme.borderColor};
              border-radius: ${inputTheme.borderRadius};
              color: ${inputTheme.color};
            }

            .ao3-menu-dialog textarea {
              min-height: 100px;
              resize: vertical;
              font-family: inherit;
            }
            
            .ao3-menu-dialog input[type="text"]:focus,
            .ao3-menu-dialog input[type="number"]:focus,
            .ao3-menu-dialog input[type="color"]:focus,
            .ao3-menu-dialog select:focus,
            .ao3-menu-dialog textarea:focus {
              background: ${inputTheme.backgroundColor} !important;
              outline: 2px solid ${buttonTheme.borderColor};
            }
            
            .ao3-menu-dialog input::placeholder,
            .ao3-menu-dialog textarea::placeholder {
              opacity: 0.6 !important;
            }
            
            /* Buttons */
            .ao3-menu-dialog .button-group {
              display: flex;
              justify-content: space-between;
              gap: 10px;
              margin-top: 20px;
            }
            
            .ao3-menu-dialog .button-group input[type="submit"] {
              flex: 1;
              padding: 10px;
              opacity: 0.9;
            }
            
            /* Reset Link */
            .ao3-menu-dialog .reset-link {
              text-align: center;
              margin-top: 10px;
              font-size: 0.9em;
              color: inherit;
              opacity: 0.7;
            }
            
            /* Tooltips */
            .ao3-menu-dialog .symbol.question {
              font-size: 0.5em;
              vertical-align: middle;
              margin-left: 0.1em;
            }
            
            /* Keyboard key styling */
            .ao3-menu-dialog kbd {
              padding: 2px 6px;
              background: rgba(0,0,0,0.1);
              border-radius: 3px;
              font-family: monospace;
              font-size: 0.9em;
            }

            /* Modal Overlay */
            .ao3-menu-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 9999;
            }
          `;

      document.head.appendChild(style);
      stylesInjected = true;
    },

    /**
     * Adds ESC key support to close a dialog
     * @private
     * @param {HTMLElement} dialog - The dialog element to add ESC support to
     */
    _addEscSupport(dialog) {
      const escHandler = (e) => {
        if (e.key === "Escape") {
          dialog.remove();
          document.removeEventListener("keydown", escHandler);
        }
      };
      document.addEventListener("keydown", escHandler);
    },

    /**
     * Adds modal overlay support to a dialog
     * @private
     * @param {HTMLElement} dialog - The dialog element to add modal support to
     */
    _addModalSupport(dialog) {
      const overlay = document.createElement("div");
      overlay.className = "ao3-menu-overlay";
      overlay.addEventListener("click", () => {
        dialog.remove();
      });
      document.body.appendChild(overlay);

      // Remove overlay when dialog is removed
      const observer = new MutationObserver(() => {
        if (!document.body.contains(dialog)) {
          overlay.remove();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    /**
     * Creates a dialog/popup container
     * @param {string} title - Dialog title (can include emoji)
     * @param {Object} [options={}] - Optional configuration
     * @param {string} [options.width='90%'] - Dialog width
     * @param {string} [options.maxWidth='600px'] - Maximum dialog width
     * @param {string} [options.maxHeight='80vh'] - Maximum dialog height
     * @param {string} [options.className=''] - Additional CSS classes
     * @returns {HTMLElement} Dialog container element
     */
    createDialog(title, options = {}) {
      // Ensure styles are injected before creating dialog
      this.injectSharedStyles();

      const {
        width = "90%",
        maxWidth = "600px",
        maxHeight = "80vh",
        className = "",
      } = options;

      const dialog = document.createElement("div");
      dialog.className = `ao3-menu-dialog ${className}`.trim();

      if (width !== "90%") dialog.style.width = width;
      if (maxWidth !== "600px") dialog.style.maxWidth = maxWidth;
      if (maxHeight !== "80vh") dialog.style.maxHeight = maxHeight;

      const titleElement = document.createElement("h3");
      titleElement.textContent = title;
      dialog.appendChild(titleElement);

      this._addEscSupport(dialog);
      this._addModalSupport(dialog);

      return dialog;
    },

    /**
     * Creates a settings section with colored border
     * @param {string} title - Section title
     * @param {string|HTMLElement} [content=''] - Section content (HTML string or element)
     * @returns {HTMLElement} Section container
     */
    createSection(title, content = "") {
      const section = document.createElement("div");
      section.className = "settings-section";

      const titleElement = document.createElement("h4");
      titleElement.className = "section-title";
      titleElement.textContent = title;
      section.appendChild(titleElement);

      if (typeof content === "string" && content) {
        section.innerHTML += content;
      } else if (content instanceof HTMLElement) {
        section.appendChild(content);
      }

      return section;
    },

    /**
     * Creates a setting group container
     * @param {string|HTMLElement} content - Group content
     * @returns {HTMLElement} Setting group div
     */
    createSettingGroup(content = "") {
      const group = document.createElement("div");
      group.className = "setting-group";

      if (typeof content === "string" && content) {
        group.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        group.appendChild(content);
      }

      return group;
    },

    /**
     * Creates a tooltip help icon
     * @param {string} text - Tooltip text
     * @returns {HTMLElement} Tooltip span element
     */
    createTooltip(text) {
      if (!text) return document.createTextNode("");

      const tooltip = document.createElement("span");
      tooltip.className = "symbol question";
      tooltip.title = text;

      const questionMark = document.createElement("span");
      questionMark.textContent = "?";
      tooltip.appendChild(questionMark);

      return tooltip;
    },

    /**
     * Creates a label element with optional tooltip
     * @param {string} text - Label text
     * @param {string} [forId=''] - ID of associated input
     * @param {string} [tooltip=''] - Optional tooltip text
     * @param {string} [className='setting-label'] - CSS class name
     * @returns {HTMLElement} Label element
     */
    createLabel(text, forId = "", tooltip = "", className = "setting-label") {
      const label = document.createElement("label");
      label.className = className;
      if (forId) label.setAttribute("for", forId);

      label.textContent = text;

      if (tooltip) {
        label.appendChild(document.createTextNode(" "));
        label.appendChild(this.createTooltip(tooltip));
      }

      return label;
    },

    /**
     * Creates an inline help/description text element
     * @param {string} text - Help text
     * @returns {HTMLElement} Description span element
     */
    createDescription(text) {
      const help = document.createElement("span");
      help.className = "setting-description";
      help.textContent = text;
      return help;
    },

    /**
     * Creates a range slider input
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {number} config.min - Minimum value
     * @param {number} config.max - Maximum value
     * @param {number} config.step - Step increment
     * @param {number} config.value - Initial value
     * @param {string} [config.label=''] - Optional label text
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @returns {HTMLElement} Container with slider (or just slider if no label)
     */
    createSlider(config) {
      const { id, min, max, step, value, label = "", tooltip = "" } = config;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = id;
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = value;

      if (!label) return slider;

      const container = this.createSettingGroup();
      container.appendChild(this.createLabel(label, id, tooltip));
      container.appendChild(slider);

      return container;
    },

    /**
     * Creates a slider with synchronized value display
     * Automatically updates value display when slider moves
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.label - Label text
     * @param {number} config.min - Minimum value
     * @param {number} config.max - Maximum value
     * @param {number} config.step - Step increment
     * @param {number} config.value - Initial value
     * @param {string} [config.unit=''] - Unit to display (e.g., '%', 'px')
     * @param {string} [config.tooltip=''] - Optional tooltip text
     * @returns {HTMLElement} Container with label, slider, and value display
     */
    createSliderWithValue(config) {
      const {
        id,
        label,
        min,
        max,
        step,
        value,
        unit = "",
        tooltip = "",
      } = config;

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-with-value";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = id;
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = value;

      const valueDisplay = document.createElement("span");
      valueDisplay.className = "value-display";

      const valueSpan = document.createElement("span");
      valueSpan.id = `${id}-value`;
      valueSpan.textContent = value;
      valueDisplay.appendChild(valueSpan);

      if (unit) {
        valueDisplay.appendChild(document.createTextNode(unit));
      }

      // Auto-update value display when slider moves
      slider.addEventListener("input", (e) => {
        valueSpan.textContent = e.target.value;
      });

      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(valueDisplay);
      group.appendChild(sliderContainer);

      return group;
    },

    /**
     * Creates a text input field
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.label - Label text
     * @param {string} [config.value=''] - Initial value
     * @param {string} [config.placeholder=''] - Placeholder text
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @returns {HTMLElement} Container with label and input
     */
    createTextInput(config) {
      const { id, label, value = "", placeholder = "", tooltip = "" } = config;

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      const input = document.createElement("input");
      input.type = "text";
      input.id = id;
      input.value = value;
      if (placeholder) input.placeholder = placeholder;

      group.appendChild(input);
      return group;
    },

    /**
     * Creates a number input field
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.label - Label text
     * @param {number|string} [config.value=''] - Initial value
     * @param {number} [config.min] - Minimum value
     * @param {number} [config.max] - Maximum value
     * @param {number} [config.step=1] - Step increment
     * @param {string} [config.placeholder=''] - Placeholder text
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @returns {HTMLElement} Container with label and input
     */
    createNumberInput(config) {
      const {
        id,
        label,
        value = "",
        min,
        max,
        step = 1,
        placeholder = "",
        tooltip = "",
      } = config;

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      const input = document.createElement("input");
      input.type = "number";
      input.id = id;
      if (value !== "" && value !== null && value !== undefined) {
        input.value = value;
      }
      input.step = step;
      if (min !== undefined) input.min = min;
      if (max !== undefined) input.max = max;
      if (placeholder) input.placeholder = placeholder;

      group.appendChild(input);
      return group;
    },

    /**
     * Creates a textarea input field
     * @param {Object} config - Configuration object
     * @param {string} config.id - Textarea ID
     * @param {string} config.label - Label text
     * @param {string} [config.value=''] - Initial value
     * @param {string} [config.placeholder=''] - Placeholder text
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @param {string} [config.description=''] - Optional description text below label
     * @param {string} [config.rows='4'] - Number of visible rows
     * @param {string} [config.minHeight='100px'] - Minimum height
     * @returns {HTMLElement} Container with label, optional description, and textarea
     */
    createTextarea(config) {
      const {
        id,
        label,
        value = "",
        placeholder = "",
        tooltip = "",
        description = "",
        rows = "4",
        minHeight = "100px",
      } = config;

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      // Add description if provided
      if (description) {
        group.appendChild(this.createDescription(description));
      }

      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.value = value;
      textarea.rows = rows;
      textarea.style.minHeight = minHeight;
      textarea.style.resize = "vertical";
      if (placeholder) textarea.placeholder = placeholder;

      group.appendChild(textarea);
      return group;
    },

    /**
     * Creates a checkbox input
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.label - Label text
     * @param {boolean} [config.checked=false] - Initial checked state
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @param {boolean} [config.inGroup=true] - Wrap in setting-group div
     * @returns {HTMLElement} Label element (or container if inGroup=true)
     */
    createCheckbox(config) {
      const {
        id,
        label,
        checked = false,
        tooltip = "",
        inGroup = true,
      } = config;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = checked;

      const labelElement = document.createElement("label");
      labelElement.className = "checkbox-label";
      labelElement.appendChild(checkbox);
      labelElement.appendChild(document.createTextNode(" " + label));

      if (tooltip) {
        labelElement.appendChild(document.createTextNode(" "));
        labelElement.appendChild(this.createTooltip(tooltip));
      }

      if (!inGroup) return labelElement;

      const group = this.createSettingGroup();
      group.appendChild(labelElement);
      return group;
    },

    /**
     * Creates a checkbox with conditional subsettings that show/hide
     * Common pattern: checkbox that reveals additional options when checked
     * @param {Object} config - Configuration object
     * @param {string} config.id - Checkbox ID
     * @param {string} config.label - Checkbox label
     * @param {boolean} [config.checked=false] - Initial checked state
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @param {HTMLElement|Array<HTMLElement>} config.subsettings - Elements to show/hide
     * @returns {HTMLElement} Container with checkbox and conditional subsettings
     */
    createConditionalCheckbox(config) {
      const { id, label, checked = false, tooltip = "", subsettings } = config;

      const container = this.createSettingGroup();

      // Create checkbox
      const checkboxLabel = this.createCheckbox({
        id,
        label,
        checked,
        tooltip,
        inGroup: false,
      });
      container.appendChild(checkboxLabel);

      // Create subsettings container
      const subsettingsContainer = this.createSubsettings();
      subsettingsContainer.style.display = checked ? "" : "none";

      // Add subsettings content
      if (Array.isArray(subsettings)) {
        subsettings.forEach((element) => {
          if (element instanceof HTMLElement) {
            subsettingsContainer.appendChild(element);
          }
        });
      } else if (subsettings instanceof HTMLElement) {
        subsettingsContainer.appendChild(subsettings);
      }

      container.appendChild(subsettingsContainer);

      // Auto-toggle visibility using getElementById (more robust than querySelector)
      // Use setTimeout to ensure checkbox is in DOM after dialog is appended
      setTimeout(() => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.addEventListener("change", (e) => {
            subsettingsContainer.style.display = e.target.checked ? "" : "none";
          });
        }
      }, 0);

      return container;
    },

    /**
     * Creates a radio button group
     * @param {Object} config - Configuration object
     * @param {string} config.name - Radio group name (all radios share this)
     * @param {string} config.label - Group label text
     * @param {Array<{value: string, label: string, checked?: boolean}>} config.options - Radio options
     * @param {string} [config.tooltip=''] - Optional tooltip for group label
     * @returns {HTMLElement} Container with label and radio buttons
     */
    createRadioGroup(config) {
      const { name, label, options, tooltip = "" } = config;

      if (!options || !Array.isArray(options)) {
        return this.createSettingGroup();
      }

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, "", tooltip));

      options.forEach((option) => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = option.value;
        radio.id = `${name}-${option.value}`;
        if (option.checked) radio.checked = true;

        const radioLabel = document.createElement("label");
        radioLabel.className = "radio-label";
        radioLabel.appendChild(radio);
        radioLabel.appendChild(document.createTextNode(" " + option.label));

        group.appendChild(radioLabel);
      });

      return group;
    },

    /**
     * Creates a select dropdown
     * @param {Object} config - Configuration object
     * @param {string} config.id - Select ID
     * @param {string} config.label - Label text
     * @param {Array<{value: string, label: string, selected?: boolean}>} config.options - Select options
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @returns {HTMLElement} Container with label and select
     */
    createSelect(config) {
      const { id, label, options, tooltip = "" } = config;

      if (!options || !Array.isArray(options)) {
        return this.createSettingGroup();
      }

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      const select = document.createElement("select");
      select.id = id;

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.selected) optionElement.selected = true;
        select.appendChild(optionElement);
      });

      group.appendChild(select);
      return group;
    },

    /**
     * Creates a color picker input
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.label - Label text
     * @param {string} [config.value='#000000'] - Initial color value
     * @param {string} [config.tooltip=''] - Optional tooltip
     * @returns {HTMLElement} Container with label and color input
     */
    createColorPicker(config) {
      const { id, label, value = "#000000", tooltip = "" } = config;

      const group = this.createSettingGroup();
      group.appendChild(this.createLabel(label, id, tooltip));

      const input = document.createElement("input");
      input.type = "color";
      input.id = id;
      input.value = value;

      group.appendChild(input);
      return group;
    },

    /**
     * Creates a two-column layout
     * @param {HTMLElement} leftContent - Left column content
     * @param {HTMLElement} rightContent - Right column content
     * @returns {HTMLElement} Two-column container
     */
    createTwoColumnLayout(leftContent, rightContent) {
      const container = document.createElement("div");
      container.className = "two-column";

      if (leftContent instanceof HTMLElement) {
        container.appendChild(leftContent);
      }
      if (rightContent instanceof HTMLElement) {
        container.appendChild(rightContent);
      }

      return container;
    },

    /**
     * Creates a subsettings container (indented settings)
     * @param {HTMLElement|string} [content=''] - Content to place inside
     * @returns {HTMLElement} Subsettings div
     */
    createSubsettings(content = "") {
      const subsettings = document.createElement("div");
      subsettings.className = "subsettings";

      if (typeof content === "string" && content) {
        subsettings.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        subsettings.appendChild(content);
      }

      return subsettings;
    },

    /**
     * Creates a button group (typically for Save/Cancel)
     * @param {Array<{text: string, id: string, primary?: boolean, onClick?: function}>} buttons - Button configurations
     * @returns {HTMLElement} Button group container
     */
    createButtonGroup(buttons) {
      if (!buttons || !Array.isArray(buttons)) {
        return document.createElement("div");
      }

      const group = document.createElement("div");
      group.className = "button-group";

      buttons.forEach((btnConfig) => {
        const button = document.createElement("input");
        button.type = "submit";
        button.value = btnConfig.text;
        if (btnConfig.id) button.id = btnConfig.id;
        if (btnConfig.primary) button.classList.add("primary");
        if (btnConfig.onClick)
          button.addEventListener("click", btnConfig.onClick);

        group.appendChild(button);
      });

      return group;
    },

    /**
     * Creates a reset link
     * @param {string} text - Link text
     * @param {function} onResetCallback - Function to call when clicked
     * @returns {HTMLElement} Reset link container
     */
    createResetLink(text, onResetCallback) {
      const container = document.createElement("div");
      container.className = "reset-link";

      const link = document.createElement("a");
      link.href = "#";
      link.textContent = text;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof onResetCallback === "function") {
          onResetCallback();
        }
      });

      container.appendChild(link);
      return container;
    },

    /**
     * Creates a keyboard key visual element
     * @param {string} keyText - Text to display (e.g., 'Alt', 'Ctrl')
     * @returns {HTMLElement} Styled kbd element
     */
    createKeyboardKey(keyText) {
      const kbd = document.createElement("kbd");
      kbd.textContent = keyText;
      return kbd;
    },

    /**
     * Creates an info/tip box with border and background
     * @param {string|HTMLElement} content - HTML content, text, or element
     * @param {Object} [options={}] - Optional styling
     * @param {string|HTMLElement} [options.icon='💡'] - Icon to display
     * @param {string} [options.title=''] - Optional title
     * @returns {HTMLElement} Styled info box
     */
    createInfoBox(content, options = {}) {
      const { icon = "💡", title = "" } = options;

      const fieldsetTheme = this.themeDetector.getFieldsetStyles();

      const box = document.createElement("div");
      box.style.cssText = `
            padding: 12px;
            margin: 15px 0;
            background: ${fieldsetTheme.backgroundColor};
            border: ${fieldsetTheme.borderWidth} solid ${fieldsetTheme.borderColor};
            border-radius: ${fieldsetTheme.borderRadius};
            box-shadow: ${fieldsetTheme.boxShadow};
          `;

      const contentDiv = document.createElement("div");
      contentDiv.style.cssText =
        "display: flex; align-items: center; gap: 8px; font-size: 0.9em; opacity: 0.8;";

      if (icon) {
        if (icon instanceof HTMLElement) {
          icon.style.cssText =
            (icon.style.cssText ? icon.style.cssText + "; " : "") +
            "flex-shrink: 0;";
          contentDiv.appendChild(icon);
        } else {
          const iconSpan = document.createElement("span");
          iconSpan.innerHTML = icon;
          iconSpan.style.cssText = "flex-shrink: 0;";
          contentDiv.appendChild(iconSpan);
        }
      }

      const textDiv = document.createElement("div");
      textDiv.style.cssText = "flex: 1; line-height: 1.4;";

      if (title) {
        const titleSpan = document.createElement("strong");
        titleSpan.textContent = `${title}: `;
        textDiv.appendChild(titleSpan);
      }

      if (typeof content === "string") {
        textDiv.appendChild(document.createTextNode(content));
      } else if (content instanceof HTMLElement) {
        textDiv.appendChild(content);
      } else {
        textDiv.appendChild(document.createTextNode(String(content)));
      }

      contentDiv.appendChild(textDiv);
      box.appendChild(contentDiv);
      return box;
    },

    /**
     * Creates a file input button with custom styling
     * @param {Object} config - Configuration object
     * @param {string} config.id - Input ID
     * @param {string} config.buttonText - Button text
     * @param {string} [config.accept=''] - File accept attribute
     * @param {function} [config.onChange] - Change event handler (receives file as parameter)
     * @returns {Object} Object with {button, input} elements
     */
    createFileInput(config) {
      const { id, buttonText, accept = "", onChange } = config;

      const input = document.createElement("input");
      input.type = "file";
      input.id = id;
      input.style.display = "none";
      if (accept) input.accept = accept;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = buttonText;
      button.addEventListener("click", () => {
        input.value = "";
        input.click();
      });

      if (onChange) {
        input.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) onChange(file);
        });
      }

      return { button, input };
    },

    /**
     * Creates a horizontal layout container
     * @param {Array<HTMLElement>} elements - Elements to place horizontally
     * @param {Object} [options={}] - Layout options
     * @param {string} [options.gap='8px'] - Gap between elements
     * @param {string} [options.justifyContent='flex-start'] - Flex justify-content
     * @param {string} [options.alignItems='center'] - Flex align-items
     * @returns {HTMLElement} Horizontal layout container
     */
    createHorizontalLayout(elements, options = {}) {
      const {
        gap = "8px",
        justifyContent = "flex-start",
        alignItems = "center",
      } = options;

      const container = document.createElement("div");
      container.style.cssText = `
            display: flex;
            gap: ${gap};
            justify-content: ${justifyContent};
            align-items: ${alignItems};
            flex-wrap: wrap;
          `;

      if (Array.isArray(elements)) {
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            container.appendChild(el);
          }
        });
      }

      return container;
    },

    /**
     * Removes all dialogs with .ao3-menu-dialog class from the page
     */
    removeAllDialogs() {
      document.querySelectorAll(".ao3-menu-dialog").forEach((dialog) => {
        dialog.remove();
      });
    },

    /**
     * Helper to get value from an input by ID
     * Returns appropriate type based on input type
     * @param {string} id - Input element ID
     * @returns {string|number|boolean|null} Input value or null if not found
     */
    getValue(id) {
      const element = document.getElementById(id);
      if (!element) return null;

      if (element.type === "checkbox") {
        return element.checked;
      } else if (element.type === "number" || element.type === "range") {
        const val = parseFloat(element.value);
        return isNaN(val) ? null : val;
      } else if (element.type === "radio") {
        const name = element.name || "";
        const radios = document.querySelectorAll(
          `input[type="radio"][name="${name}"]`
        );
        for (const radio of radios) {
          if (radio.checked) return radio.value;
        }
        return null;
      }

      return element.value;
    },

    /**
     * Helper to set value of an input by ID
     * Handles different input types appropriately
     * @param {string} id - Input element ID
     * @param {*} value - Value to set
     * @returns {boolean} True if successful, false otherwise
     */
    setValue(id, value) {
      const element = document.getElementById(id);
      if (!element) return false;

      if (element.type === "checkbox") {
        element.checked = Boolean(value);
      } else if (element.type === "radio") {
        const radio = document.querySelector(
          `input[name="${element.name}"][value="${value}"]`
        );
        if (radio) radio.checked = true;
      } else {
        element.value = value;
      }

      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));

      return true;
    },

    /**
     * Creates a clickable list item (for menus/selection lists)
     * @param {Object} config - Configuration object
     * @param {string} config.text - Item text
     * @param {function} config.onClick - Click handler
     * @param {string} [config.dataAttribute=''] - Data attribute name (e.g., 'data-id')
     * @param {string} [config.dataValue=''] - Data attribute value
     * @param {string} [config.icon=''] - Optional icon/emoji to display
     * @param {string} [config.badge=''] - Optional badge text
     * @param {string} [config.badgeClass='unread'] - CSS class to apply to badge (default: 'unread')
     * @param {string} [config.badgeSize='0.7em'] - Badge font size
     * @returns {HTMLElement} Styled list item
     */
    createListItem(config) {
      const {
        text,
        onClick,
        dataAttribute = "",
        dataValue = "",
        icon = "",
        badge = "",
        badgeClass = "unread",
        badgeSize = "0.7em",
      } = config;

      const fieldsetTheme = this.themeDetector.getFieldsetStyles();
      const blurbTheme = this.themeDetector.getBlurbStyles();

      const item = document.createElement("div");
      item.className = "menu-list-item";
      item.style.cssText = `
            padding: ${blurbTheme.padding};
            margin: 8px 0;
            background: ${fieldsetTheme.backgroundColor};
            border: ${fieldsetTheme.borderWidth} solid ${fieldsetTheme.borderColor};
            border-radius: ${fieldsetTheme.borderRadius};
            box-shadow: ${fieldsetTheme.boxShadow};
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
            color: inherit;
          `;

      if (dataAttribute && dataValue) {
        item.setAttribute(dataAttribute, dataValue);
      }

      const contentDiv = document.createElement("div");
      contentDiv.style.cssText = "display: flex; align-items: center; flex: 1;";

      const textSpan = document.createElement("span");
      textSpan.textContent = text;
      contentDiv.appendChild(textSpan);

      if (badge) {
        const badgeElement = document.createElement("span");
        badgeElement.className = `item-badge ${badgeClass}`;
        badgeElement.textContent = badge;

        badgeElement.style.cssText = `
          margin-left: 8px;
          white-space: nowrap;
          display: inline-block;
          font-size: ${badgeSize};
        `;

        contentDiv.appendChild(badgeElement);
      }

      item.appendChild(contentDiv);

      if (icon) {
        const iconDiv = document.createElement("div");
        iconDiv.style.cssText = "display: flex; align-items: center; gap: 8px;";
        iconDiv.innerHTML = icon;
        item.appendChild(iconDiv);
      }

      item.addEventListener("click", onClick);

      return item;
    },

    /**
     * Creates a dialog header with title and action icons
     * @param {Object} config - Configuration object
     * @param {string} config.title - Dialog title (can include emoji)
     * @param {Array<{icon: string, title: string, onClick: function, id?: string}>} [config.actions=[]] - Action buttons
     * @param {boolean} [config.includeCloseButton=true] - Whether to include X close button
     * @returns {HTMLElement} Header container with title and icons
     */
    createDialogHeader(config) {
      const { title, actions = [], includeCloseButton = true } = config;

      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        flex-shrink: 0;
      `;

      const titleElement = document.createElement("h3");
      titleElement.style.cssText = "margin: 0; color: inherit;";
      titleElement.textContent = title;
      header.appendChild(titleElement);

      const actionsContainer = document.createElement("div");
      actionsContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
      `;

      actions.forEach((action) => {
        const button = document.createElement("button");
        if (action.id) button.id = action.id;
        button.title = action.title;
        button.className = "icon-button";
        button.style.cssText = `
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          display: flex;
          align-items: center;
          padding: 0;
          opacity: 0.7;
          transition: opacity 0.2s;
        `;
        button.innerHTML = action.icon;
        button.addEventListener("click", action.onClick);
        actionsContainer.appendChild(button);
      });

      if (includeCloseButton) {
        const closeBtn = document.createElement("button");
        closeBtn.id = "dialog-close-btn";
        closeBtn.style.cssText = `
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          color: inherit;
        `;
        closeBtn.innerHTML = "&times;";
        actionsContainer.appendChild(closeBtn);
      }

      header.appendChild(actionsContainer);
      return header;
    },

    /**
     * Creates a scrollable content area for dialogs
     * @param {HTMLElement|string} content - Content to place inside
     * @param {Object} [options={}] - Optional styling
     * @param {string} [options.maxHeight=''] - Maximum height (e.g., '400px')
     * @param {string} [options.flex='1 1 0%'] - Flex properties
     * @returns {HTMLElement} Scrollable container
     */
    createScrollableContent(content, options = {}) {
      const { maxHeight = "", flex = "1 1 0%" } = options;

      const container = document.createElement("div");
      container.style.cssText = `
        overflow-y: auto;
        flex: ${flex};
        box-sizing: border-box;
      `;

      if (maxHeight) {
        container.style.maxHeight = maxHeight;
      }

      if (typeof content === "string") {
        container.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        container.appendChild(content);
      }

      return container;
    },

    /**
     * Creates a fixed-height dialog with header and scrollable content
     * Common pattern for list/menu dialogs
     * @param {Object} config - Configuration object
     * @param {string} config.title - Dialog title
     * @param {HTMLElement|string} config.content - Scrollable content
     * @param {Array} [config.headerActions=[]] - Header action buttons
     * @param {string} [config.height='450px'] - Dialog height
     * @param {string} [config.width='90%'] - Dialog width
     * @param {string} [config.maxWidth='500px'] - Maximum width
     * @returns {HTMLElement} Complete dialog element
     */
    createFixedHeightDialog(config) {
      const {
        title,
        content,
        headerActions = [],
        height = "450px",
        width = "90%",
        maxWidth = "500px",
      } = config;

      this.injectSharedStyles();
      this.injectListItemStyles();

      const dialogTheme = this.themeDetector.getDialogStyles();

      const dialog = document.createElement("div");
      dialog.className = "ao3-menu-dialog";
      dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${dialogTheme.backgroundColor};
            padding: 20px;
            border: ${dialogTheme.borderWidth} solid ${dialogTheme.borderColor};
            border-radius: ${dialogTheme.borderRadius};
            box-shadow: ${dialogTheme.boxShadow};
            z-index: 10000;
            width: ${width};
            max-width: ${maxWidth};
            height: ${height};
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
          `;

      const header = this.createDialogHeader({
        title,
        actions: headerActions,
        includeCloseButton: true,
      });
      dialog.appendChild(header);

      const scrollable = this.createScrollableContent(content);
      dialog.appendChild(scrollable);

      const closeBtn = dialog.querySelector("#dialog-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => dialog.remove());
      }

      dialog.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.remove();
      });

      this._addEscSupport(dialog);
      this._addModalSupport(dialog);

      return dialog;
    },

    /**
     * Injects additional styles for list items and icon buttons
     * Called automatically by createFixedHeightDialog
     * Safe to call multiple times
     */
    injectListItemStyles() {
      if (document.getElementById("ao3-list-item-styles")) return;

      const style = document.createElement("style");
      style.id = "ao3-list-item-styles";
      style.textContent = `
            .menu-list-item:hover {
              background: rgba(0,0,0,0.1) !important;
            }
            
            .ao3-menu-dialog a:hover {
              border-bottom: none !important;
              text-decoration: none !important;
              transform: none !important;
            }
            
            .ao3-menu-dialog .icon-button {
              transform: none !important;
            }
            
            .icon-button:hover {
              opacity: 1 !important;
              transform: none !important;
            }
            
            .item-badge {
              margin-left: 8px;
              white-space: nowrap;
              display: inline-block;
            }
          `;

      document.head.appendChild(style);
    },

    /**
     * Samples styling from an existing AO3 element class
     * Useful for matching theme styles (e.g., .unread, .replied)
     * @param {string} selector - CSS selector for element to sample
     * @param {Array<string>} properties - CSS properties to extract
     * @returns {Object} Object with CSS property:value pairs
     */
    sampleElementStyles(selector, properties) {
      const element = document.querySelector(selector);
      if (!element) return {};

      const computed = window.getComputedStyle(element);
      const styles = {};

      properties.forEach((prop) => {
        const value = computed[prop];
        if (
          value &&
          value !== "none" &&
          value !== "0px" &&
          value !== "rgba(0, 0, 0, 0)" &&
          value !== "transparent"
        ) {
          styles[prop] = value;
        }
      });

      return styles;
    },

    /**
     * Creates a checkmark icon (using AO3's .replied style if available)
     * @param {Object} [options={}] - Optional configuration
     * @param {string} [options.title='active'] - Title attribute
     * @param {boolean} [options.useRepliedClass=true] - Use AO3's .replied class styling
     * @returns {HTMLElement} Checkmark span element
     */
    createCheckmarkIcon(options = {}) {
      const { title = "active", useRepliedClass = true } = options;

      const checkmark = document.createElement("span");
      checkmark.title = title;
      checkmark.textContent = "✓";

      if (useRepliedClass) {
        checkmark.className = "replied";
        checkmark.style.cssText = `
              border: none !important;
              background: none !important;
              font-size: 1em;
              vertical-align: middle;
              padding: 0;
            `;
      } else {
        checkmark.style.cssText = `
              font-size: 1em;
              vertical-align: middle;
              color: inherit;
              opacity: 0.7;
            `;
      }

      return checkmark;
    },

    /**
     * Creates an SVG icon for edit button
     * @returns {string} SVG markup for edit icon
     */
    getEditIconSVG() {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    },

    /**
     * Creates an SVG icon for home button
     * @returns {string} SVG markup for home icon
     */
    getHomeIconSVG() {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    },

    /**
     * Detects border styling from current theme
     * Samples from inputs, buttons, or specified elements
     * @param {Array<string>} [selectors=[]] - Custom selectors to check
     * @returns {Object} Object with borderRadius and borderColor
     */
    detectBorderStyling(selectors = []) {
      const inputTheme = this.themeDetector.getInputStyles();

      return {
        borderRadius: inputTheme.borderRadius || "8px",
        borderColor: inputTheme.borderColor || "rgba(0,0,0,0.2)",
      };
    },

    /**
     * Adds an item to the shared Userscripts dropdown menu
     * Creates the dropdown if it doesn't exist
     * @param {Object} config - Configuration object
     * @param {string} config.id - Menu item link ID
     * @param {string} config.text - Menu item text
     * @param {function} config.onClick - Click handler
     * @param {string} [config.position='append'] - 'append' or 'prepend' to control order
     * @param {string} [config.menuTitle='Userscripts'] - Dropdown menu title
     * @returns {boolean} True if successful, false otherwise
     */
    addToSharedMenu(config) {
      const {
        id,
        text,
        onClick,
        position = "append",
        menuTitle = "Userscripts",
      } = config;

      if (!id || !text || typeof onClick !== "function") {
        console.error(
          "[AO3: Menu Helpers] addToSharedMenu: id, text, and onClick are required"
        );
        return false;
      }

      let menuContainer = document.getElementById("scriptconfig");
      if (!menuContainer) {
        const headerMenu = document.querySelector(
          "ul.primary.navigation.actions"
        );
        const searchItem = headerMenu?.querySelector("li.search");
        if (!headerMenu || !searchItem) {
          console.warn(
            "[AO3: Menu Helpers] Could not find header menu to add userscripts dropdown"
          );
          return false;
        }

        menuContainer = document.createElement("li");
        menuContainer.className = "dropdown";
        menuContainer.id = "scriptconfig";
        menuContainer.innerHTML = `<a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">${menuTitle}</a><ul class="menu dropdown-menu"></ul>`;
        headerMenu.insertBefore(menuContainer, searchItem);
      }

      const menu = menuContainer.querySelector(".dropdown-menu");
      if (menu && !menu.querySelector(`#${id}`)) {
        const menuItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "javascript:void(0);";
        link.id = id;
        link.textContent = text;
        link.addEventListener("click", onClick);
        menuItem.appendChild(link);

        if (position === "prepend") {
          menu.insertBefore(menuItem, menu.firstChild);
        } else {
          menu.appendChild(menuItem);
        }

        return true;
      }

      return false;
    },
  };

  console.log(
    "[AO3: Menu Helpers] Library loaded, version",
    window.AO3MenuHelpers.version
  );
})();
