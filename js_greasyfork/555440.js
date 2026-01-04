// ==UserScript==
// @name        Fill Screenshot URLs from Clipboard
// @namespace   http://tampermonkey.net/
// @match       https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @match       https://gazellegames.net/upload.php
// @grant       GM_setClipboard
// @version     1.0
// @author      ConstanceHarm
// @description Adds a button to fill empty screens[] input fields with clipboard content from ptpimg.me
// @downloadURL https://update.greasyfork.org/scripts/555440/Fill%20Screenshot%20URLs%20from%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/555440/Fill%20Screenshot%20URLs%20from%20Clipboard.meta.js
// ==/UserScript==

(function() {
  "use strict";

  let fillButton = null;
  const TARGET_DOMAIN = "ptpimg.me";

  // Function to check if URL is from target domain
  function isFromTargetDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === TARGET_DOMAIN;
    } catch (e) {
      return false;
    }
  }

  // Function to check if URL looks like an image link
  function isImageUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
      return imageExtensions.some(ext => pathname.endsWith(ext));
    } catch (e) {
      return false;
    }
  }

  // Function to create the fill button
  function createFillButton() {
    if (fillButton) return fillButton; // Don't create multiple buttons

    // Create the button
    fillButton = document.createElement("button");
    fillButton.textContent = `Fill Screen URLs from ${TARGET_DOMAIN}`;
    fillButton.type = "button";
    fillButton.setAttribute("data-clipboard-filler", "true");
    fillButton.style.cssText = `
            background-color: #007cba;
            color: white;
            border: none;
            padding: 8px 12px;
            padding-top: 0px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
            z-index: 9999;
            position: relative;
        `;

    // Add hover effect
    fillButton.onmouseenter = function() {
      this.style.backgroundColor = "#005a87";
    };
    fillButton.onmouseleave = function() {
      this.style.backgroundColor = "#007cba";
    };

    // Add click event
    fillButton.addEventListener("click", async function() {
      try {
        // Read clipboard content
        const clipboardText = await navigator.clipboard.readText();

        if (!clipboardText.trim()) {
          alert("Clipboard is empty!");
          return;
        }

        // Split clipboard content by newlines and filter out empty lines
        const allLines = clipboardText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Check if we have newline-separated content (multiple lines)
        if (allLines.length <= 1) {
          alert("Clipboard should contain newline-separated URLs!\n\nFound only a single line. Please copy multiple URLs separated by line breaks.");
          return;
        }

        // Filter to only include image URLs from target domain
        const imageUrls = allLines.filter(line =>
            isFromTargetDomain(line) && isImageUrl(line),
        );

        if (imageUrls.length === 0) {
          const domainUrls = allLines.filter(line => isFromTargetDomain(line));
          const imageUrls = allLines.filter(line => isImageUrl(line));

          let errorMessage = `No valid image URLs from ${TARGET_DOMAIN} found in clipboard!\n\n`;
          errorMessage += `Found ${allLines.length} total line(s)\n`;
          errorMessage += `Found ${domainUrls.length} URL(s) from ${TARGET_DOMAIN}\n`;
          errorMessage += `Found ${imageUrls.length} image URL(s) (any domain)\n\n`;
          errorMessage += `Need: Image URLs from ${TARGET_DOMAIN} with extensions like .jpg, .png, .gif, etc.`;

          alert(errorMessage);
          return;
        }

        // Get all screens[] input fields
        const screenInputs = document.querySelectorAll("input[name=\"screens[]\"]");

        if (screenInputs.length === 0) {
          alert("No screen input fields found on this page!");
          return;
        }

        // Filter to get only empty inputs
        const emptyInputs = Array.from(screenInputs).filter(input =>
            !input.value || input.value.trim() === "",
        );

        if (emptyInputs.length === 0) {
          alert("All screen input fields are already filled!");
          return;
        }

        // Fill empty inputs with URLs
        let fillCount = 0;
        for (let i = 0; i < Math.min(imageUrls.length, emptyInputs.length); i++) {
          emptyInputs[i].value = imageUrls[i];

          // Trigger change event to ensure any listeners are notified
          const changeEvent = new Event("change", { bubbles: true });
          emptyInputs[i].dispatchEvent(changeEvent);

          // Also trigger input event for better compatibility
          const inputEvent = new Event("input", { bubbles: true });
          emptyInputs[i].dispatchEvent(inputEvent);

          fillCount++;
        }

        // Show success message
        const remainingUrls = imageUrls.length - fillCount;
        const remainingFields = emptyInputs.length - fillCount;

        let message = `Successfully filled ${fillCount} field(s) with ${TARGET_DOMAIN} image URLs!`;
        if (remainingUrls > 0) {
          message += `\n${remainingUrls} image URL(s) remaining in clipboard.`;
        }
        if (remainingFields > 0) {
          message += `\n${remainingFields} empty field(s) remaining.`;
        }

        alert(message);

      } catch (error) {
        console.error("Error reading clipboard:", error);
        alert("Error reading clipboard.\n\nThis could be because:\n• The browser denied clipboard access\n• You need to interact with the page first\n• The page needs to be focused\n\nTry clicking somewhere on the page first, then try the button again.");
      }
    });

    return fillButton;
  }

  // Function to show or hide the button based on page content
  function updateButtonVisibility() {
    // Check if screens[] inputs exist on the page
    const screenInputs = document.querySelectorAll("input[name=\"screens[]\"]");

    if (screenInputs.length === 0) {
      // No screen inputs found, hide button if it exists
      if (fillButton) {
        fillButton.style.display = "none";
        // Also hide the line break
        const lineBreak = document.querySelector("br[data-clipboard-filler-br=\"true\"]");
        if (lineBreak) {
          lineBreak.style.display = "none";
        }
      }
      return;
    }

    // Screen inputs found, show button
    if (!fillButton) {
      createFillButton();

      // Find a good place to insert the button
      const firstScreenInput = document.querySelector("input[name=\"screens[]\"]");
      if (firstScreenInput) {
        const insertTarget = firstScreenInput.parentElement || firstScreenInput.parentNode;

        // Insert the button
        insertTarget.insertBefore(fillButton, firstScreenInput);

        // Add a line break after the button
        const lineBreak = document.createElement("br");
        lineBreak.setAttribute("data-clipboard-filler-br", "true");
        insertTarget.insertBefore(lineBreak, firstScreenInput);
      }
    }

    if (fillButton) {
      fillButton.style.display = "inline-block";
      // Also show the line break
      const lineBreak = document.querySelector("br[data-clipboard-filler-br=\"true\"]");
      if (lineBreak) {
        lineBreak.style.display = "block";
      }
    }
  }

  // Initialize when DOM is ready
  function initialize() {
    updateButtonVisibility();
  }

  // Wait for DOM to be ready and initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Watch for dynamic content changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "childList") {
        // Check if any screens[] inputs were added or removed
        const hasScreenInputChanges = Array.from(mutation.addedNodes)
            .concat(Array.from(mutation.removedNodes))
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .some(node => {
              if (node.name === "screens[]") return true;
              return node.querySelector && node.querySelector("input[name=\"screens[]\"]");
            });

        if (hasScreenInputChanges) {
          // Clean up any existing elements first
          const existingButton = document.querySelector("button[data-clipboard-filler=\"true\"]");
          const existingBreak = document.querySelector("br[data-clipboard-filler-br=\"true\"]");

          if (existingButton) existingButton.remove();
          if (existingBreak) existingBreak.remove();

          fillButton = null;

          // Update button visibility after a short delay
          setTimeout(updateButtonVisibility, 100);
        }
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

})();