// ==UserScript==
// @name         Google Gemini AI: Add Table of Contents (TOC) to Chats
// @namespace    Violentmonkey userscripts by ReporterX
// @author       ReporterX
// @version      1.0
// @description  Add a floating Table of Contents (TOC) to each Google Gemini chat. This would allow users to easily jump to any section of the chat with a single click. The TOC is adjustable, remembering its size and position for a consistent experience across all chats.
// @match        https://gemini.google.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548404/Google%20Gemini%20AI%3A%20Add%20Table%20of%20Contents%20%28TOC%29%20to%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/548404/Google%20Gemini%20AI%3A%20Add%20Table%20of%20Contents%20%28TOC%29%20to%20Chats.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Saves the TOC's current position and size to localStorage.
  function saveTOCState(toc) {
    const state = {
      top: toc.style.top,
      left: toc.style.left,
      width: toc.style.width,
      height: toc.style.height,
    };
    localStorage.setItem("gemini-toc-state", JSON.stringify(state));
  }

  // Loads the TOC's saved position and size from localStorage.
  function loadTOCState() {
    const state = localStorage.getItem("gemini-toc-state");
    return state ? JSON.parse(state) : null;
  }

  // Creates and initializes the main TOC element, along with its interactive components.
  function createTOC() {
    const toc = document.createElement("div");
    toc.id = "gemini-toc";

    // Retrieve saved state or set default dimensions and position.
    const savedState = loadTOCState();
    const initialState = {
      top: savedState?.top || "20px",
      left: savedState?.left || "auto",
      right: savedState?.left ? "auto" : "20px", // Position from the right if no left coordinate is saved.
      width: savedState?.width || "250px",
      height: savedState?.height || "300px",
    };

    toc.style.cssText = `
            position: fixed;
            top: ${initialState.top};
            left: ${initialState.left};
            right: ${initialState.right};
            width: ${initialState.width};
            height: ${initialState.height};
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 0;
            z-index: 10000;
            opacity: 0.3;
            transition: opacity 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
        `;

    // Create the draggable header for the TOC window.
    const header = document.createElement("h3");
    header.textContent = "TOC";
    header.style.cssText = `
            margin: 0;
            padding: 4px;
            font-size: 11px;
            color: #666;
            text-align: center;
            border-bottom: 1px solid #eee;
            font-weight: 500;
            cursor: move;
            background-color: rgba(240, 240, 240, 0.7);
        `;
    toc.appendChild(header);

    // Create the container that will hold the scrollable TOC links.
    const content = document.createElement("div");
    content.id = "gemini-toc-content";
    content.style.cssText = `
        overflow-y: auto;
        flex-grow: 1;
        padding: 8px;
        min-width: 0; /* Flexbox fix to allow shrinking */
    `;
    toc.appendChild(content);

    // Make the TOC more visible when the user hovers over it.
    toc.addEventListener("mouseenter", () => {
      toc.style.opacity = "1.0";
    });
    toc.addEventListener("mouseleave", () => {
      toc.style.opacity = "0.3";
    });

    document.body.appendChild(toc);

    // Initialize the new, unified interaction handler.
    makeInteractive(toc, header);

    return toc;
  }

  // A new, single function to handle both dragging and resizing.
  function makeInteractive(element, header) {
    let action = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    const minWidth = 150;
    const minHeight = 100;

    // Determines the resize direction based on mouse position.
    function getResizeDirection(e) {
        const rect = element.getBoundingClientRect();
        const zone = 8;
        const onRight = e.clientX > rect.right - zone;
        const onLeft = e.clientX < rect.left + zone;
        const onBottom = e.clientY > rect.bottom - zone;

        if (onRight && onBottom) return 'se';
        if (onLeft && onBottom) return 'sw';
        if (onRight) return 'e';
        if (onLeft) return 'w';
        if (onBottom) return 's';
        return null;
    }

    // Handles the initial mousedown event to determine the action.
    function onMouseDown(e) {
        if (e.button !== 0) return;

        const resizeDir = getResizeDirection(e);

        if (e.target === header && !resizeDir) {
            action = { type: 'drag' };
        } else if (resizeDir) {
            action = { type: 'resize', dir: resizeDir };
        } else {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const rect = element.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;

        // Ensure positioning is done via 'left' and 'top'.
        element.style.right = 'auto';
        element.style.left = `${startLeft}px`;
        element.style.top = `${startTop}px`;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Handles the mouse movement for dragging or resizing.
    function onMouseMove(e) {
        if (!action) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (action.type === 'drag') {
            element.style.left = `${startLeft + dx}px`;
            element.style.top = `${startTop + dy}px`;
        } else if (action.type === 'resize') {
            if (action.dir.includes('e')) {
                element.style.width = `${Math.max(minWidth, startWidth + dx)}px`;
            }
            if (action.dir.includes('w')) {
                const newWidth = Math.max(minWidth, startWidth - dx);
                element.style.width = `${newWidth}px`;
                element.style.left = `${startLeft + startWidth - newWidth}px`;
            }
            if (action.dir.includes('s')) {
                element.style.height = `${Math.max(minHeight, startHeight + dy)}px`;
            }
        }
    }

    // Cleans up event listeners and saves state on mouse up.
    function onMouseUp() {
        if (action) {
            saveTOCState(element);
        }
        action = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Updates the cursor style based on mouse position.
    function updateCursor(e) {
        if (action) return;
        const resizeDir = getResizeDirection(e);
        element.style.cursor = resizeDir ? `${resizeDir}-resize` : 'default';
        header.style.cursor = 'move';
    }

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', updateCursor);
  }

  // Scans the page for user prompts to include in the TOC.
  function findUserPrompts() {
    const prompts = [];
    // Prioritize specific selectors that are known to work.
    let queryTextElements = document.querySelectorAll("p.query-text-line.ng-star-inserted");
    if (queryTextElements.length === 0) {
      queryTextElements = document.querySelectorAll('p[class*="query-text"]');
    }
    if (queryTextElements.length > 0) {
      queryTextElements.forEach((element) => {
        const text = element.textContent.trim();
        if (text) prompts.push({ element, text });
      });
      return prompts;
    }
    // Fallback to a broader set of selectors if the primary ones fail.
    const selectors = [
      '[data-message-author-role="user"]', ".user-message", '[role="user"]',
      ".message.user", 'div[data-test-id*="user"]', 'div[data-test-id*="prompt"]',
      ".prompt-content", ".user-input", '[class*="user"][class*="message"]',
    ];
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach((element) => {
          const text = element.textContent.trim();
          if (text) prompts.push({ element, text });
        });
        if (prompts.length > 0) break;
      }
    }
    return prompts;
  }

  // Finds user prompts and populates the TOC content.
  function updateTOC(tocContainer) {
    const contentContainer = tocContainer.querySelector("#gemini-toc-content");
    const prompts = findUserPrompts();

    // Remove old items before repopulating.
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild);
    }

    if (prompts.length === 0) {
        const noContent = document.createElement("div");
        noContent.textContent = "No chat found";
        noContent.style.cssText = `color: #999; font-style: italic; text-align: center; padding: 15px 0;`;
        contentContainer.appendChild(noContent);
        return;
    }

    prompts.forEach((prompt, index) => {
      const item = document.createElement("div");
      item.className = "toc-item";
      item.style.cssText = `
                padding: 6px 8px;
                margin: 2px 0;
                background: rgba(240, 240, 240, 0.5);
                border-radius: 3px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 12px;
                line-height: 1.3;
                border-left: 2px solid #4285f4;
            `;

      const itemText = document.createElement("span");
      // Use CSS for intelligent text truncation based on the container's width.
      itemText.style.cssText = `
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
      // Set the full text content; the browser will handle truncating it.
      itemText.textContent = `${index + 1}. ${prompt.text}`;
      item.appendChild(itemText);

      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "rgba(66, 133, 244, 0.1)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
      });

      item.addEventListener("click", () => {
        prompt.element.scrollIntoView({ behavior: "smooth", block: "center" });
        const originalBg = prompt.element.style.backgroundColor;
        prompt.element.style.transition = "background-color 0.5s ease";
        prompt.element.style.backgroundColor = "rgba(66, 133, 244, 0.2)";
        setTimeout(() => {
          prompt.element.style.backgroundColor = originalBg;
        }, 2000);
      });

      contentContainer.appendChild(item);
    });
  }

  // Main initialization function.
  function init() {
    // Wait for the DOM to be fully loaded before running.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // Create the main TOC container.
    const tocContainer = createTOC();

    // A short delay to allow the Gemini UI to load before the first TOC update.
    setTimeout(() => {
      updateTOC(tocContainer);
    }, 1000);

    // Use a MutationObserver to detect when the conversation content changes.
    const observer = new MutationObserver(() => {
      // Debounce the update function to avoid excessive calls during rapid DOM changes.
      clearTimeout(window.tocUpdateTimeout);
      window.tocUpdateTimeout = setTimeout(() => {
        updateTOC(tocContainer);
      }, 500);
    });

    // Observe changes to the entire document body to catch all relevant updates.
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start the script.
  init();
})();