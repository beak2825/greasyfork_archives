// ==UserScript==
// @name         Impex Cube Better Dropdowns
// @namespace    https://github.com/quantavil
// @version      1.0.1
// @description  Transforms basic select dropdowns into searchable, modern dropdowns with fuzzy search
// @author       Quantavil
// @match        *://*.impexcube.in/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563014/Impex%20Cube%20Better%20Dropdowns.user.js
// @updateURL https://update.greasyfork.org/scripts/563014/Impex%20Cube%20Better%20Dropdowns.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = { searchDebounceMs: 50 };

    const STYLES = `
    /* Better Dropdown Styles */
    .bd-wrapper {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
    }

    .bd-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 0 4px; /* compacted padding */
      width: 100%;
      background: #fff;
      border: 1px solid #767676; /* Match default Chrome border */
      border-radius: 2px; /* Match default Look */
      cursor: default;
      font-size: 13px; /* Will be overwritten by inline styles if present */
      color: #000;
      transition: all 0.2s ease;
      min-height: 20px; /* Reduced min-height */
      height: 100%; /* Fill wrapper */
      box-sizing: border-box;
    }

    .bd-trigger:hover {
      border-color: #9ca3af;
      background: #f9fafb;
    }

    .bd-trigger:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .bd-trigger.bd-open {
      border-color: #2563eb;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .bd-trigger-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }

    .bd-trigger-text.bd-placeholder {
      color: #9ca3af;
    }

    .bd-arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #6b7280;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }

    .bd-open .bd-arrow {
      transform: rotate(180deg);
    }

    .bd-dropdown {
      position: fixed;
      min-width: 150px;
      width: max-content;
      max-width: 350px;
      z-index: 99999;
      background: #fff;
      border: 1px solid #2563eb;
      border-radius: 6px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: none;
      overflow: hidden;
    }

    .bd-dropdown.bd-visible {
      display: block;
    }

    .bd-search-container {
      padding: 6px;
      border-bottom: 1px solid #f3f4f6;
      background: #f9fafb;
    }

    .bd-search {
      width: 100%;
      padding: 5px 8px;
      padding-left: 30px;
      font-size: 13px;
      border: 1px solid #d1d5db;
      border-radius: 5px;
      background: #fff url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%239ca3af" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>') no-repeat 8px center;
      background-size: 14px;
      transition: all 0.2s ease;
    }

    .bd-search:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .bd-options {
      max-height: 250px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    /* Custom scrollbar */
    .bd-options::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .bd-options::-webkit-scrollbar-track {
      background: transparent;
    }
    .bd-options::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }
    .bd-options::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    .bd-option {
      padding: 6px 10px;
      font-size: 13px;
      color: #1f2937;
      cursor: pointer;
      transition: all 0.1s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
    }

    .bd-option:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }

    .bd-option:hover,
    .bd-option.bd-highlighted {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .bd-option.bd-selected {
      background: #dbeafe;
      color: #1e40af;
      font-weight: 500;
    }

    .bd-option-text {
      flex: 1;
    }

    .bd-option.bd-selected::after {
      content: '✓';
      margin-left: 8px;
      color: #2563eb;
      font-weight: bold;
      font-size: 11px;
    }

    .bd-option-code {
      color: #6b7280;
      font-size: 11px;
      font-family: monospace;
      background: #f3f4f6;
      padding: 1px 5px;
      border-radius: 4px;
      margin-left: 6px;
    }

    .bd-highlighted .bd-option-code {
      background: #dbeafe;
      color: #1e40af;
    }

    .bd-no-results {
      padding: 12px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      font-style: italic;
    }

    .bd-count {
      padding: 4px 8px;
      font-size: 10px;
      color: #9ca3af;
      background: #f9fafb;
      border-top: 1px solid #f3f4f6;
      text-align: right;
    }

    select.bd-enhanced {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .bd-match {
      background: #fef3c7;
      color: #92400e;
      border-radius: 2px;
      padding: 0 1px;
    }
  `;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function scoreMatch(text, query) {
        if (!query) return { score: 0, matches: [] };
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // 1. Exact Match
        if (lowerText === lowerQuery) {
            return { score: 100, matches: [[0, text.length]] };
        }

        // 2. Starts With
        if (lowerText.startsWith(lowerQuery)) {
            return { score: 80, matches: [[0, query.length]] };
        }

        // 3. Contains (Word boundary preferred)
        const index = lowerText.indexOf(lowerQuery);
        if (index > -1) {
            // Bonus for word boundary
            const isWordBoundary = index === 0 || /\s/.test(text[index - 1]);
            return {
                score: 60 + (isWordBoundary ? 10 : 0),
                matches: [[index, index + query.length]]
            };
        }

        // 4. Strict Fuzzy Match (Acronyms/Subsequence)
        // Must match all characters in order.
        // DENSITY CHECK: match span length vs query length must be >= 0.9 (90%)
        let qIdx = 0;
        let tIdx = 0;
        let firstMatchIdx = -1;
        let lastMatchIdx = -1;

        while (tIdx < lowerText.length && qIdx < lowerQuery.length) {
            if (lowerText[tIdx] === lowerQuery[qIdx]) {
                if (firstMatchIdx === -1) firstMatchIdx = tIdx;
                lastMatchIdx = tIdx;
                qIdx++;
            }
            tIdx++;
        }

        // Did we find all characters?
        if (qIdx === lowerQuery.length) {
            // Calculate span of the match in text
            const spanLength = (lastMatchIdx - firstMatchIdx) + 1;
            const matchDensity = lowerQuery.length / spanLength;

            if (matchDensity >= 0.85) {
                // Calculate simple score based on density
                // Base score 40, max 50 based on density
                return { score: 40 + (matchDensity * 10), matches: [] };
            }
        }

        return null;
    }

    /**
     * Better Text Highlighter
     */
    function highlightMatch(text, query) {
        if (!query) return text;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Try strict container match first for cleaner highlighting
        const idx = lowerText.indexOf(lowerQuery);
        if (idx >= 0) {
            return text.substring(0, idx) +
                `<span class="bd-match">${text.substring(idx, idx + query.length)}</span>` +
                text.substring(idx + query.length);
        }

        // Fallback to fuzzy highlight
        let result = "";
        let queryIdx = 0;
        for (let i = 0; i < text.length; i++) {
            if (queryIdx < query.length && lowerText[i] === lowerQuery[queryIdx]) {
                result += `<span class="bd-match">${text[i]}</span>`;
                queryIdx++;
            } else {
                result += text[i];
            }
        }
        return result;
    }

    function injectStyles() {
        if (document.getElementById("bd-styles")) return;
        const styleEl = document.createElement("style");
        styleEl.id = "bd-styles";
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
    }

    class BetterDropdown {
        constructor(selectElement) {
            this.select = selectElement;
            this.options = [];
            this.filteredOptions = [];
            this.isOpen = false;
            this.highlightedIndex = -1;
            this.searchQuery = "";

            this.parseOptions();
            this.createElements();
            this.bindEvents();
            this.updateDisplay();
        }

        parseOptions() {
            this.options = Array.from(this.select.options).map((opt) => ({
                value: opt.value,
                text: opt.textContent.trim(),
                selected: opt.selected,
                disabled: opt.disabled,
            }));
            this.filteredOptions = [...this.options];
        }

        createElements() {
            // Create wrapper
            this.wrapper = document.createElement("div");
            this.wrapper.className = "bd-wrapper";

            // Preserve original select's width/margin styles for inline layout
            // Preserve original select's styles
            const computedStyle = window.getComputedStyle(this.select);

            // basic copy of layout properties
            this.wrapper.style.width = computedStyle.width;
            this.wrapper.style.margin = computedStyle.margin;
            this.wrapper.style.display = computedStyle.display === 'inline' ? 'inline-block' : computedStyle.display;
            this.wrapper.style.verticalAlign = computedStyle.verticalAlign;

            // If the original has a specific height set, try to respect it on the trigger
            if (computedStyle.height && computedStyle.height !== 'auto') {
                // this.wrapper.style.height = computedStyle.height; 
                // We rely on child filling height 
            }

            // Create trigger button
            this.trigger = document.createElement("button");
            this.trigger.type = "button";
            this.trigger.className = "bd-trigger";
            this.trigger.innerHTML = `
        <span class="bd-trigger-text bd-placeholder">--Choose--</span>
        <span class="bd-arrow"></span>
      `;

            // Copy font styles to trigger
            this.trigger.style.fontFamily = computedStyle.fontFamily;
            this.trigger.style.fontSize = computedStyle.fontSize;
            this.trigger.style.fontWeight = computedStyle.fontWeight;
            this.trigger.style.height = computedStyle.height; // Explicitly set height if possible
            this.trigger.style.lineHeight = computedStyle.lineHeight;
            this.trigger.style.width = "100%";

            // Create dropdown
            this.dropdown = document.createElement("div");
            this.dropdown.className = "bd-dropdown";

            // Create search container
            const searchContainer = document.createElement("div");
            searchContainer.className = "bd-search-container";

            this.searchInput = document.createElement("input");
            this.searchInput.type = "text";
            this.searchInput.className = "bd-search";
            this.searchInput.placeholder = "Type to search...";
            searchContainer.appendChild(this.searchInput);

            // Create options container
            this.optionsContainer = document.createElement("div");
            this.optionsContainer.className = "bd-options";

            // Create count display
            this.countDisplay = document.createElement("div");
            this.countDisplay.className = "bd-count";

            // Assemble dropdown
            this.dropdown.appendChild(searchContainer);
            this.dropdown.appendChild(this.optionsContainer);
            this.dropdown.appendChild(this.countDisplay);

            // Assemble wrapper
            this.wrapper.appendChild(this.trigger);
            // Dropdown is appended to body later or kept here? 
            // Better to keep in wrapper for positioning context if using absolute, 
            // OR append to body and use fixed positioning. 
            // The logic currently uses fixed/absolute positioning but inside wrapper? 
            // Wait, existing CSS `bd-dropdown` is `position: fixed`.
            // So appending to body is safer for z-index and overflow clipping.
            document.body.appendChild(this.dropdown);

            // Insert wrapper and hide original select
            this.select.parentNode.insertBefore(this.wrapper, this.select);
            this.select.classList.add("bd-enhanced");

            this.renderOptions();
        }

        destroy() {
            this.wrapper.remove();
            this.dropdown.remove(); // Remove dropdown from body
            this.select.classList.remove("bd-enhanced");
        }

        renderOptions(highlight = "") {
            this.optionsContainer.innerHTML = "";

            if (this.filteredOptions.length === 0) {
                this.optionsContainer.innerHTML = `
          <div class="bd-no-results">No matches found</div>
        `;
                this.countDisplay.textContent = "0 results";
                return;
            }

            this.filteredOptions.forEach((opt, index) => {
                const optionEl = document.createElement("div");
                optionEl.className = "bd-option";
                if (opt.selected) optionEl.classList.add("bd-selected");
                if (index === this.highlightedIndex)
                    optionEl.classList.add("bd-highlighted");
                optionEl.dataset.index = index;
                optionEl.dataset.value = opt.value;

                // Create option content
                let displayText = highlight
                    ? highlightMatch(opt.text, highlight)
                    : opt.text;

                // Construct inner HTML structure
                let content = `<span class="bd-option-text">${displayText}</span>`;

                // Show value code if it's different from text and somewhat short
                if (opt.value && opt.value !== opt.text && opt.value.length <= 15) {
                    const displayValue = highlight ? highlightMatch(opt.value, highlight) : opt.value;
                    content += `<span class="bd-option-code">${displayValue}</span>`;
                }

                optionEl.innerHTML = content;
                this.optionsContainer.appendChild(optionEl);
            });

            this.countDisplay.textContent = `${this.filteredOptions.length} of ${this.options.length}`;
        }

        bindEvents() {
            // Toggle dropdown
            this.trigger.addEventListener("click", () => this.toggle());

            // Search input
            const debouncedSearch = debounce((query) => {
                this.search(query);
            }, CONFIG.searchDebounceMs);

            this.searchInput.addEventListener("input", (e) => {
                debouncedSearch(e.target.value);
            });

            // Option click
            this.optionsContainer.addEventListener("click", (e) => {
                const optionEl = e.target.closest(".bd-option");
                if (optionEl) {
                    this.selectOption(parseInt(optionEl.dataset.index));
                }
            });

            // Keyboard navigation
            this.wrapper.addEventListener("keydown", (e) =>
                this.handleKeydown(e)
            );

            // Click outside to close
            document.addEventListener("click", (e) => {
                if (!this.wrapper.contains(e.target) && this.isOpen) {
                    this.close();
                }
            });

            // Focus on search when dropdown opens
            this.dropdown.addEventListener("transitionend", () => {
                if (this.isOpen) {
                    this.searchInput.focus();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.trigger.classList.add("bd-open");
            this.dropdown.classList.add("bd-visible");
            this.positionDropdown();
            this.searchInput.value = "";
            this.search("");
            this.highlightedIndex = -1;

            setTimeout(() => {
                this.searchInput.focus();
            }, 50);

            const selectedIdx = this.filteredOptions.findIndex((o) => o.selected);
            if (selectedIdx !== -1) {
                this.highlightedIndex = selectedIdx;
                this.scrollToOption(selectedIdx);
            }

            this.renderOptions();
        }

        positionDropdown() {
            const rect = this.trigger.getBoundingClientRect();
            const dropdownHeight = 280;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
                this.dropdown.style.top = `${rect.bottom}px`;
                this.dropdown.style.bottom = 'auto';
            } else {
                this.dropdown.style.bottom = `${window.innerHeight - rect.top}px`;
                this.dropdown.style.top = 'auto';
            }
            this.dropdown.style.left = `${rect.left}px`;
            this.dropdown.style.minWidth = `${rect.width}px`;
        }

        close() {
            this.isOpen = false;
            this.trigger.classList.remove("bd-open");
            this.dropdown.classList.remove("bd-visible");
            this.trigger.focus();
        }

        search(query) {
            this.searchQuery = query;

            if (!query) {
                this.filteredOptions = [...this.options];
            } else {
                const scored = this.options.map(opt => {
                    // Score both text and value
                    const textScore = scoreMatch(opt.text, query);
                    const valueScore = scoreMatch(opt.value, query);

                    // Take best score
                    const best = (textScore && textScore.score > (valueScore?.score || 0)) ? textScore : valueScore;

                    return {
                        opt,
                        score: best ? best.score : 0
                    };
                }).filter(item => item.score > 0);

                // Sort by score desc, then alphabetical
                scored.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return a.opt.text.localeCompare(b.opt.text);
                });

                this.filteredOptions = scored.map(item => item.opt);
            }

            this.highlightedIndex = this.filteredOptions.length > 0 ? 0 : -1;
            this.renderOptions(query);
        }

        selectOption(index) {
            if (index < 0 || index >= this.filteredOptions.length) return;

            const option = this.filteredOptions[index];

            // Update options
            this.options.forEach((o) => (o.selected = false));
            const originalOption = this.options.find((o) => o.value === option.value);
            if (originalOption) originalOption.selected = true;

            // Update original select
            this.select.value = option.value;

            // Trigger change event on original select
            const event = new Event("change", { bubbles: true });
            this.select.dispatchEvent(event);

            // Also trigger ASP.NET postback if applicable
            if (this.select.onchange) {
                this.select.onchange();
            }

            this.updateDisplay();
            this.close();
        }

        updateDisplay() {
            const selectedOption = this.options.find((o) => o.selected);
            const textEl = this.trigger.querySelector(".bd-trigger-text");

            if (selectedOption && selectedOption.value) {
                textEl.textContent = selectedOption.text;
                textEl.classList.remove("bd-placeholder");
            } else {
                textEl.textContent = "--Choose--";
                textEl.classList.add("bd-placeholder");
            }
        }

        handleKeydown(e) {
            if (!this.isOpen) {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                    e.preventDefault();
                    this.open();
                }
                return;
            }

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    this.highlightedIndex = Math.min(
                        this.highlightedIndex + 1,
                        this.filteredOptions.length - 1
                    );
                    this.renderOptions(this.searchQuery);
                    this.scrollToOption(this.highlightedIndex);
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
                    this.renderOptions(this.searchQuery);
                    this.scrollToOption(this.highlightedIndex);
                    break;

                case "Enter":
                    e.preventDefault();
                    if (this.highlightedIndex >= 0) {
                        this.selectOption(this.highlightedIndex);
                    }
                    break;

                case "Escape":
                    e.preventDefault();
                    this.close();
                    break;

                case "Tab":
                    this.close();
                    break;
            }
        }

        scrollToOption(index) {
            const options = this.optionsContainer.querySelectorAll(".bd-option");
            if (options[index]) {
                options[index].scrollIntoView({ block: "nearest" });
            }
        }

        destroy() {
            this.wrapper.remove();
            this.select.classList.remove("bd-enhanced");
        }
    }

    const enhancedDropdowns = new Map();

    function enhanceDropdown(select) {
        if (enhancedDropdowns.has(select)) return;
        if (select.closest(".bd-wrapper")) return;
        const dropdown = new BetterDropdown(select);
        enhancedDropdowns.set(select, dropdown);
    }

    function init() {
        injectStyles();

        // Enhance all qualifying selects
        document.querySelectorAll("select").forEach(enhanceDropdown);

        // Watch for dynamically added selects
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === "SELECT") {
                            enhanceDropdown(node);
                        }
                        node.querySelectorAll?.("select").forEach(enhanceDropdown);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.log(
            "%c🔽 Impex Cube Better Dropdowns loaded!",
            "color: #0d6efd; font-weight: bold"
        );
    }

    // Run init when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
