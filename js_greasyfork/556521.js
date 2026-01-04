// ==UserScript==
// @name         House of Web
// @namespace    https://github.com/agoramachina/House-of-Web
// @version      2.0.1
// @description  Change text to reflect the style of 'House of Leaves'
// @author       agoramachina (forked from DetectiveR's House of Chrome extension)
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556521/House%20of%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/556521/House%20of%20Web.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // =============================================================================
  // SETTINGS
  // =============================================================================

  // Set to false to only match whole words (e.g., "house" but not "household")
  // Set to true to match words inside other words (e.g., "house" in "household")
  const includeSubstrings = true;

  // =============================================================================
  // HOUSE - translations across languages (19 languages)
  // =============================================================================
  const houseWords = [
    // Latin script - European
    'house',        // English
    'maison',       // French
    'haus',         // German
    'casa',         // Spanish / Italian / Portuguese
    'domus',        // Latin
    'huis',         // Dutch
    'hus',          // Swedish / Norwegian / Danish

    // Cyrillic script
    'Дом',          // Russian
    'будинок',      // Ukrainian
    'къща',         // Bulgarian

    // Greek script
    'σπίτι',        // Greek

    // CJK (Chinese, Japanese, Korean)
    '家',           // Japanese / Chinese
    '집',           // Korean

    // Other scripts
    'בית',          // Hebrew
    'بيت',          // Arabic
    'വീട്',         // Malayalam

    // Constructed languages
    'juH qach',     // Klingon (tlhIngan Hol) - "home building"
    '-kelek',       // Vulcan (Golic Vulcan)
    'zdani',        // Lojban
  ];

  // =============================================================================
  // MINOTAUR - translations across languages (19 languages)
  // =============================================================================
  const minotaurWords = [
    // Latin script - European (most derive from Greek Μινώταυρος)
    'minotaur',     // English
    'minotaure',    // French
    'minotauro',    // Spanish / Italian / Portuguese
    'minotauros',   // Greek (romanized) / Turkish
    'minotaurus',   // Latin / German / Dutch

    // Cyrillic script
    'Минотавр',     // Russian
    'Мінотавр',     // Ukrainian
    'Минотавър',    // Bulgarian

    // Greek script
    'Μινώταυρος',   // Greek (native)

    // CJK (Chinese, Japanese, Korean)
    'ミノタウロス',       // Japanese (Minotaurosu)
    'ミーノータウロス',   // Japanese (alternate: Mīnōtaurosu)
    '미노타우로스',      // Korean
    '弥诺陶洛斯',       // Chinese (Simplified)

    // Other scripts
    'מינוטאור',     // Hebrew
    'مينوتور',      // Arabic
    'മിനോട്ടോർ',  // Malayalam

    // Constructed languages
    'veqlargh',     // Klingon - Fek'lhr (mythological demon/beast)
    'stislak',      // Vulcan
    "cizda'u",      // Lojban (monster/strange creature)
  ];

  // =============================================================================
  // STYLES
  // =============================================================================
  const houseStyle = 'color:#0047bb; font-family:Courier, monospace';
  const minotaurStyle = 'color:red; font-family:Courier, monospace; text-decoration: line-through;';

  // =============================================================================
  // HIGHLIGHTING LOGIC
  // =============================================================================
  function highlightWordInTextNodes(rootNode, words, style, className, useSubstrings) {
    const pattern = words.join('|');
    // Use word boundaries when substrings are disabled
    const regexPattern = useSubstrings ? pattern : `\\b(${pattern})\\b`;
    const regex = new RegExp(regexPattern, 'gi');
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'];

    function isInsideHighlight(node) {
      while (node) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node.classList.contains(className) || node.getAttribute('data-highlighted') === 'true')
        ) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    function walk(node) {
      if (skipTags.includes(node.nodeName)) return;

      if (node.nodeType === Node.TEXT_NODE) {
        if (isInsideHighlight(node)) return;
        // Reset regex lastIndex to avoid issues with global flag
        regex.lastIndex = 0;
        if (!regex.test(node.nodeValue)) return;

        const spanWrapper = document.createElement('span');
        regex.lastIndex = 0;
        spanWrapper.innerHTML = node.nodeValue.replace(regex, match =>
          `<span class="${className}" style="${style}" data-highlighted="true">${match}</span>`
        );

        while (spanWrapper.firstChild) {
          node.parentNode.insertBefore(spanWrapper.firstChild, node);
        }
        node.parentNode.removeChild(node);
      } else if (!isInsideHighlight(node)) {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          walk(node.childNodes[i]);
        }
      }
    }

    walk(rootNode);
  }

  function applyHighlighting(rootNode) {
    highlightWordInTextNodes(rootNode, houseWords, houseStyle, 'highlighted-house', includeSubstrings);
    highlightWordInTextNodes(rootNode, minotaurWords, minotaurStyle, 'highlighted-minotaur', includeSubstrings);
  }

  // =============================================================================
  // MUTATION OBSERVER (for dynamic content)
  // =============================================================================
  let scheduled = false;
  let pendingNodes = new Set();

  const observer = new MutationObserver((mutations) => {
    // Collect only the added nodes, skip if they're our own highlights
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip nodes we created (our highlight spans)
          if (node.getAttribute && node.getAttribute('data-highlighted') === 'true') {
            continue;
          }
          pendingNodes.add(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          // For text nodes, we'll process the parent
          if (node.parentNode && !(node.parentNode.getAttribute && node.parentNode.getAttribute('data-highlighted'))) {
            pendingNodes.add(node.parentNode);
          }
        }
      }
    }

    if (pendingNodes.size === 0) return;
    if (scheduled) return;
    scheduled = true;

    setTimeout(() => {
      // Disconnect observer while we make changes to avoid feedback loop
      observer.disconnect();

      for (const node of pendingNodes) {
        // Make sure node is still in the document
        if (document.contains(node)) {
          applyHighlighting(node);
        }
      }
      pendingNodes.clear();
      scheduled = false;

      // Reconnect observer
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 250);
  });

  // =============================================================================
  // INITIALIZE
  // =============================================================================
  applyHighlighting(document.body);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

})();
