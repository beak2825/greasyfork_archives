// ==UserScript==
// @name         Global Black
// @namespace    github.com/annaroblox
// @version      2.1
// @description  A global black dark mode
// @author       annaroblox
// @match        */*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553805/Global%20Black.user.js
// @updateURL https://update.greasyfork.org/scripts/553805/Global%20Black.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  const LIGHT_BACKGROUND_THRESHOLD = 400;
  const DARK_GREY_BG_THRESHOLD = 500;
  const DARK_TEXT_THRESHOLD = 128;

  const TARGET_BACKGROUND_COLOR = "#000000";
  const TARGET_TEXT_COLOR = "#FFFFFF";
  const TARGET_BORDER_COLOR = "#000000"; // change this if you want borders to be distinct

  const IGNORED_TAGS = ["IMG", "PICTURE", "VIDEO", "CANVAS", "SVG"];

  // --- IMMEDIATE STYLE INJECTION (RUNS BEFORE DOM IS READY) ---
  // This is the most important part for an instant effect and preventing a "flash of white".
  const style = document.createElement("style");
  style.id = "pure-black-mode-global-style";
  style.textContent = `
        /* Force dark scrollbars and form controls for a consistent experience */
        :root {
            color-scheme: dark !important;
        }
        /* Instantly apply to the base elements to prevent flash of white */
        html, #text, body, mt-sm, recent-posts,  article, header, footer, nav, main, aside,
        ul, ol, li, dl, table,  tr, td, overlay, label, #content, theme-auto,  th, thead, tbody, tfoot, style-scope,
        form, fieldset, button, section {
            background-color: ${TARGET_BACKGROUND_COLOR} !important;
            background: ${TARGET_BACKGROUND_COLOR} !important;
            color: ${TARGET_TEXT_COLOR} !important;
        }
        /* Handle syntax highlighting blocks gracefully */
        pre, code {
           background-color: #000000 !important;
           color: #D4D4D4 !important;
        }
    `;
  // Using document.documentElement ensures this runs as early as possible.
  document.documentElement.appendChild(style);

  // --- SCRIPT LOGIC (RUNS ONCE DOM IS INTERACTIVE) ---

  // A single, temporary div is used for all color computations to avoid DOM thrashing.
  const tempDiv = document.createElement("div");
  tempDiv.style.display = "none";
  document.documentElement.appendChild(tempDiv);

  // Cache for memoizing color lightness calculations to boost performance.
  const colorLightnessCache = new Map();

  /**
   * Calculates the "lightness" of a CSS color string, with caching.
   * @param {string} colorString - The CSS color (e.g., "rgb(255, 255, 255)", "#FFF", "white").
   * @returns {number} A lightness value from 0 (black) to 255 (white), or -1 if invalid/transparent.
   */
  function getColorLightness(colorString) {
    if (
      !colorString ||
      colorString === "none" ||
      colorString.includes("inherit") ||
      colorString.includes("initial") ||
      colorString.includes("unset")
    ) {
      return -1;
    }

    // Return from cache if value already computed.
    if (colorLightnessCache.has(colorString)) {
      return colorLightnessCache.get(colorString);
    }

    // Use the temporary div to resolve the color to a consistent rgb() format.
    tempDiv.style.color = colorString;
    const computedColor = window.getComputedStyle(tempDiv).color;

    if (computedColor === "rgba(0, 0, 0, 0)" || !computedColor) {
      colorLightnessCache.set(colorString, -1); // Cache transparent/invalid colors.
      return -1;
    }

    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    let result = -1;
    if (match) {
      const [r, g, b] = [
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3]),
      ];
      // Using a simple average is fast and sufficient for this script's purpose.
      result = (r + g + b) / 3;
    }

    colorLightnessCache.set(colorString, result);
    return result;
  }

  /**
   * The core function that processes a single element.
   * @param {HTMLElement} element - The DOM element to process.
   */
  function processElement(element) {
    // Basic checks to quickly exit for invalid or already-processed elements.
    if (
      !element ||
      element.nodeType !== 1 ||
      IGNORED_TAGS.includes(element.tagName)
    ) {
      return;
    }

    const style = window.getComputedStyle(element);

    // Ignore elements that are not visible.
    if (style.display === "none" || style.visibility === "hidden") {
      return;
    }

    const bgLightness = getColorLightness(style.backgroundColor);

    if (bgLightness === -1) return; // Skip transparent backgrounds, they'll inherit the parent's black.

    const isLight = bgLightness > LIGHT_BACKGROUND_THRESHOLD;
    const isDarkGrey = bgLightness > 0 && bgLightness < DARK_GREY_BG_THRESHOLD;

    if (isLight || isDarkGrey) {
      // If the element has no background image, we can safely use the 'background' shorthand property.
      // This is more powerful and overrides combined properties like `background: linear-gradient(...) #FFF;`.
      if (style.backgroundImage === "none") {
        element.style.setProperty(
          "background",
          TARGET_BACKGROUND_COLOR,
          "important",
        );
      } else {
        // If it has a background image, only change the color to avoid removing the image.
        element.style.setProperty(
          "background-color",
          TARGET_BACKGROUND_COLOR,
          "important",
        );
      }

      // Adjust text color for readability if it's dark.
      const textLightness = getColorLightness(style.color);
      if (textLightness !== -1 && textLightness < DARK_TEXT_THRESHOLD) {
        element.style.setProperty("color", TARGET_TEXT_COLOR, "important");
      }

      // Adjust border colors.
      const borderTargets = [
        "border-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
      ];
      for (const prop of borderTargets) {
        const borderLightness = getColorLightness(style[prop]);
        // Check if the border is not already dark. Removed redundant '> 0' check.
        if (borderLightness > DARK_GREY_BG_THRESHOLD) {
          element.style.setProperty(prop, TARGET_BORDER_COLOR, "important");
        }
      }
    }
  }

  /**
   * Traverses a node and its children (including inside Shadow DOMs) to apply the black mode.
   * @param {Node} rootNode - The starting node (usually document.body or a new element).
   */
  function applyBlackModeToTree(rootNode) {
    if (!rootNode || typeof rootNode.querySelectorAll !== "function") {
      return;
    }

    // Process the root node itself first (important for single added nodes and shadow roots).
    if (rootNode.nodeType === 1) {
      processElement(rootNode);
    }

    const elements = rootNode.querySelectorAll("*");
    elements.forEach((el) => {
      processElement(el);
      // If an element has a shadow root, we need to recursively process its contents too.
      if (el.shadowRoot) {
        applyBlackModeToTree(el.shadowRoot);
      }
    });
  }

  /**
   * Applies the dark theme logic to a given document (e.g., the main document or an iframe's document).
   * @param {Document} doc - The document to process.
   */
  function applyThemeToDocument(doc) {
    if (
      !doc ||
      !doc.documentElement ||
      doc.documentElement.dataset.globalBlackApplied
    ) {
      return;
    }
    console.log(
      "Global Black: Applying theme to new document...",
      doc.location?.href,
    );
    doc.documentElement.dataset.globalBlackApplied = "true";

    // 1. Inject the main style sheet into the new document.
    const newStyle = doc.createElement("style");
    newStyle.id = "pure-black-mode-global-style-injected";
    newStyle.textContent = style.textContent; // `style` is the global style from the parent script.
    doc.documentElement.appendChild(newStyle);

    // 2. Run a full conversion on the new document's body.
    applyBlackModeToTree(doc.documentElement);

    // 3. Set up a new observer for dynamic content within that document.
    const newObserver = new MutationObserver((mutations) => {
      (doc.defaultView || window).requestAnimationFrame(() => {
        // Use iframe's rAF if available
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            processNewlyAddedNodes(mutation.addedNodes);
          } else if (mutation.type === "attributes") {
            if (mutation.target) {
              applyBlackModeToTree(mutation.target);
            }
          }
        }
      });
    });

    newObserver.observe(doc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // When the iframe's window unloads, disconnect the observer.
    doc.defaultView?.addEventListener(
      "unload",
      () => {
        newObserver.disconnect();
        console.log(
          "Global Black: Cleaned up observer for document:",
          doc.location?.href,
        );
      },
      { once: true },
    );
  }

  /**
   * Finds and processes embeddable elements like iframes, frames, and objects.
   * @param {HTMLElement} element - The embeddable element to process.
   */
  function processEmbed(element) {
    if (element.dataset.globalBlackEmbedProcessed) {
      return;
    }
    element.dataset.globalBlackEmbedProcessed = "true";

    const setup = () => {
      try {
        const contentDoc = element.contentDocument;
        if (contentDoc) {
          applyThemeToDocument(contentDoc);
        }
      } catch (e) {
        console.warn(
          "Global Black: Could not access embed content. It may be cross-origin.",
          element,
        );
      }
    };

    try {
      const contentDoc = element.contentDocument;
      if (contentDoc && contentDoc.readyState === "complete") {
        setup();
      } else {
        element.addEventListener("load", setup, { once: true });
      }
    } catch (e) {
      console.warn(
        "Global Black: Could not access embed on initial check. It may be cross-origin.",
        element,
      );
    }
  }

  /**
   * Processes a list of newly added DOM nodes and their descendants.
   * This function is typically called by the MutationObserver.
   * @param {NodeList} nodes - A list of nodes that have been added to the DOM.
   */
  function processNewlyAddedNodes(nodes) {
    nodes.forEach((node) => {
      applyBlackModeToTree(node);

      if (node.nodeType === 1) {
        const tagName = node.tagName.toUpperCase();
        if (["IFRAME", "FRAME", "EMBED", "OBJECT"].includes(tagName)) {
          processEmbed(node);
        }
        node
          .querySelectorAll?.("iframe, frame, embed, object")
          .forEach(processEmbed);
      }
    });
  }

  function runFullConversion() {
    console.log("Global Black: Running full page conversion...");
    applyBlackModeToTree(document.documentElement);
    document
      .querySelectorAll("iframe, frame, embed, object")
      .forEach(processEmbed);
  }

  // --- OBSERVER FOR DYNAMIC CONTENT ---
  // This is the key to handling modern, dynamic websites.
  const observer = new MutationObserver((mutations) => {
    // Use requestAnimationFrame to batch all mutations that happen in a single frame.
    // This prevents performance issues and ensures the script doesn't miss anything
    // on pages that add many elements at once.
    window.requestAnimationFrame(() => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // When new nodes are added, process them and all their children.
          processNewlyAddedNodes(mutation.addedNodes);
        } else if (mutation.type === "attributes") {
          // If an element's class or style changes, its color might have changed.
          // Re-run the process on that single element AND ITS DESCENDANTS.
          // This is crucial because a class/style change on a parent can affect children's computed styles.
          if (mutation.target) {
            applyBlackModeToTree(mutation.target); // Changed from processElement
          }
        }
      }
    });
  });

  // --- INITIALIZATION ---
  // The main styles are already injected. Now we wait for the DOM to be ready for deep traversal.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFullConversion, {
      once: true,
    });
  } else {
    // If the script is injected after the page is loaded (e.g., via console).
    runFullConversion();
  }

  // --- ADDED: Re-run the conversion after all resources have loaded ---
  // This catches elements that are styled or loaded by JS after DOMContentLoaded.
  window.addEventListener("load", runFullConversion);

  // Start observing for changes after the initial conversion.
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"], // Only watch for attributes that are likely to affect appearance.
  });

  // Clean up when the user navigates away or closes the tab.
  window.addEventListener("unload", () => {
    if (observer) {
      observer.disconnect();
    }
    // Also remove the new load listener
    window.removeEventListener("load", runFullConversion);

    if (tempDiv && tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
    console.log("Global Black: Cleaned up and disconnected.");
  });
})();
