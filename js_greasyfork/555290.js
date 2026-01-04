// ==UserScript==
// @name        Highlight diff in patches
// @namespace   imxitiz's-Script
// @match       https://dwm.suckless.org/patches/*.diff*
// @match       https://*/*.patch*
// @match       https://*/*.diff*
// @grant       none
// @version     1.1
// @author      imxitiz
// @license     GNU GPLv3
// @description Highlight additions, deletions, file changes, and line changes in diff/patch files for better visibility. Nov 06 2024, 11:00:34 PM 
// @downloadURL https://update.greasyfork.org/scripts/555290/Highlight%20diff%20in%20patches.user.js
// @updateURL https://update.greasyfork.org/scripts/555290/Highlight%20diff%20in%20patches.meta.js
// ==/UserScript==

(() => {
  // Function to inject CSS styles
  function addStyles() {
    const styles = `
            .addition {
                color: green;
                font-weight: bold;
            }
            .deletion {
                color: red;
                text-decoration: line-through;
            }

            .file-change {
                color: yellow; /* or any visible color */
                background-color: rgba(255, 255, 0, 0.2); /* Light yellow background */
                font-weight: bold; /* Optional: make it bold for emphasis */
            }

            .line-change {
                color: cyan; /* or any visible color */
                background-color: rgba(0, 255, 255, 0.2); /* Light cyan background */
                font-weight: bold; /* Optional: make it bold for emphasis */
            }

        `;
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("type", "text/css");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }

  // Function to highlight the diff changes
  function highlightDiff() {
    const pre = document.querySelector("pre");
    if (!pre) return; // Exit if no <pre> tag found
    let content = pre.innerHTML;

    // Highlight additions, ignoring lines that start with --- or +++, and remove the "+"
    content = content.replace(
      /^(?!\+\+\+|---)\+(.*)$/gm,
      (_match, p1) => `<span class="addition">${p1}</span>`,
    );

    // Highlight deletions, ignoring lines that start with --- or +++, and remove the "-"
    content = content.replace(
      /^(?!\+\+\+|---)-(.*)$/gm,
      (_match, p1) => `<span class="deletion">${p1}</span>`,
    );

    // Highlight file change indicators (--- and +++)
    content = content.replace(
      /^(--- .+|^\+\+\+ .+)$/gm,
      (match) => `<span class="file-change">${match}</span>`,
    );

    // Highlight line number changes (starting with @@)
    content = content.replace(
      /^@@ .+$/gm,
      (match) => `<span class="line-change">${match}</span>`,
    );

    pre.innerHTML = content;
  }

  // Execute functions
  addStyles();
  highlightDiff();
})();
