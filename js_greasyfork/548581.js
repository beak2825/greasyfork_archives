// ==UserScript==
// @name         Yomitan Terminator for Immersion translator in ASBPlayer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Inserts an invisible `span.yomitan-terminator` element as a sibling to subtitle lines on asbplayer for better parsing.
// @author       Gemini
// @match        https://killergerbah.github.io/asbplayer/*
// @grant        none
// @run-at       document-idle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/548581/Yomitan%20Terminator%20for%20Immersion%20translator%20in%20ASBPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/548581/Yomitan%20Terminator%20for%20Immersion%20translator%20in%20ASBPlayer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuration ---
  // You can change the text content of the terminator span here.
  const terminatorText = "︙";
  // --- End Configuration ---


  const TARGET_INNER_SELECTOR = ".immersive-translate-target-inner";
  const YOMITAN_TERMINATOR_CLASS = "yomitan-terminator";
  /**
   * Creates and inserts a yomitan-terminator span before the given element if it doesn't already have one.
   * @param {Element} wrapperElement - The `font.immersive-translate-target-inner` element.
   */
  function addTerminator(wrapperElement) {
    // Check if the very previous element is already a terminator to prevent duplicates.
    if (
      wrapperElement.previousElementSibling &&
      wrapperElement.previousElementSibling.classList.contains(
        YOMITAN_TERMINATOR_CLASS
      )
    ) {
      return;
    }

    console.log("Adding terminator before:", wrapperElement);

    const terminator = document.createElement("span");

    terminator.className = YOMITAN_TERMINATOR_CLASS;
    terminator.textContent = terminatorText;
    terminator.style.width = "0px";
    terminator.style.height = "0px";
    terminator.style.overflow = "hidden";
    terminator.style.display = "inline-block";

    // This element is used by the Yomitan extension as a parsing boundary and doesn't need to be visible.
    //        terminator.style.display = 'none';

    // Insert the terminator span immediately before the subtitle wrapper element.
    wrapperElement.before(terminator);
  }

  /**
   * Processes all subtitle wrappers currently in the DOM.
   */
  function processExistingSubtitles() {
    const subtitleWrappers = document.querySelectorAll(TARGET_INNER_SELECTOR);
    subtitleWrappers.forEach(addTerminator);
  }

  // --- Main Execution ---

  // 1. Process any subtitles that are already on the page when the script runs.
  processExistingSubtitles();

  // 2. Set up a MutationObserver to watch for new subtitles being added to the page.
  const observer = new MutationObserver((mutationsList) => {
    console.log("mutationsList", mutationsList);
    for (const mutation of mutationsList) {
      const addedNodesArr = Array.from(mutation.addedNodes);
      if (mutation.type !== "childList" || addedNodesArr.length <= 0) {
        continue;
      }

      addedNodesArr
        .filter(
          (e) =>
            e.nodeType === Node.ELEMENT_NODE &&
            // e.classList.contains("immersive-translate-target-wrapper") &&
            !e.classList.contains(YOMITAN_TERMINATOR_CLASS) // Avoid processing terminators themselves.
        )
        .forEach((e) => {
          if (!(e instanceof Element)) {
            return;
          }

          e.querySelectorAll(TARGET_INNER_SELECTOR).forEach(addTerminator);
        });
    }
  });

  // 3. Start observing the entire document body for changes.
  // This is a robust way to ensure we catch the subtitles no matter where they are injected.
  const root = document.querySelector("#root");
  if (!root) {
    console.error("Root element not found");
    return;
  }

  observer.observe(root, {
    childList: true,
    subtree: true,
  });
})();
