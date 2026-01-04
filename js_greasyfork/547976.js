// ==UserScript==
// @name         Hymnary.org Copy Lyrics Button
// @namespace    https://hymnary.org/
// @version      1.1
// @description  Adds a "Copy Lyrics" button to hymn pages that formats and copies lyrics cleanly.
// @author       You
// @match        https://hymnary.org/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547976/Hymnaryorg%20Copy%20Lyrics%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/547976/Hymnaryorg%20Copy%20Lyrics%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Utility: Wait for element using MutationObserver
  function waitForElement(selector, callback) {
    const target = document.body;

    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        callback(el);
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });

    // In case it's already there
    const existing = document.querySelector(selector);
    if (existing) {
      callback(existing);
    }
  }

  // Main logic
  function addCopyLyricsButton(targetDiv) {
    if (document.querySelector('.copylyrics')) return; // Avoid duplicates

    const button = document.createElement('button');
    button.textContent = 'Copy Lyrics';
    button.className = 'copylyrics';
    button.style.margin = '1em 0';
    button.onclick = () => {
      let text = targetDiv.innerText;

      const lines = text.split('\n');
      const result = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // --- NEW: Remove trailing inline tags in [], (), {} at line end (e.g. [Refrain])
        line = line.replace(/\s*[\[\(\{][^\]\)\}]+[\]\)\}]\s*$/g, '');

        // --- NEW: Remove prefixing brackets from section labels (e.g. [Chorus], (Verse 2))
        line = line.replace(/^([\[\(\{])([^]\)\}]+)([\]\)\}])\s*/, (_, _open, content) => content.trim() + ' ');

        // Replace REFRAIN with Chorus (remove colon)
        line = line.replace(/\bREFRAIN:?\b/gi, 'Chorus');

        // Prepend 'Verse' if line starts with number and not already 'Verse'
        if (/^\d+/.test(line) && !/^Verse\s*\d+/i.test(line)) {
          line = line.replace(/^(\d+\.?)/, 'Verse $1');
        }

        // Remove colon from Verse N: or Chorus:
        line = line.replace(/^(Verse\s*\d+|Chorus)\s*:/i, '$1');

        // Add newline after label if there's more text on the same line
        line = line.replace(/^(Verse\s*\d+|Chorus)(\s+.+)/i, (_, label, rest) => {
          return label.trim() + '\n' + rest.trim();
        });

        // Ensure a blank line before a new section label (Verse or Chorus)
        if (
          /^Verse\s*\d+$/i.test(line) ||
          /^Chorus$/i.test(line) ||
          /^Verse\s*\d+\n/i.test(line) ||
          /^Chorus\n/i.test(line)
        ) {
          if (result.length > 0 && result[result.length - 1].trim() !== '') {
            result.push('');
          }
        }

        result.push(line);
      }

      const processedText = result.join('\n');
      navigator.clipboard.writeText(processedText).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => (button.textContent = 'Copy Lyrics'), 2000);
      });
    };

    // Insert button after the target div
    targetDiv.parentNode.insertBefore(button, targetDiv.nextSibling);
  }

  // Start watching for the target lyrics container
  waitForElement('#at_fulltext > div:nth-child(2) > div', addCopyLyricsButton);
})();
