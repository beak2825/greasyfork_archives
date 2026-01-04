// ==UserScript==
// @name         Custom NYT Connections Puzzle
// @namespace    https://github.com/amitmadnawat
// @version      1.8.2
// @description  Use customized words in any NYT Connections puzzle (Daily and Archive)
// @author       Amit Madnawat
// @license      MIT
// @match        https://www.nytimes.com/games/connections*
// @exclude      https://www.nytimes.com/games-assets/*
// @icon         https://www.nytimes.com/games-assets/v2/assets/icons/connections.svg
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547722/Custom%20NYT%20Connections%20Puzzle.user.js
// @updateURL https://update.greasyfork.org/scripts/547722/Custom%20NYT%20Connections%20Puzzle.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const customGroups = [
    { name: "Subway", words: ["Underground", "Metro", "Footlong", "Tube"] },
    { name: "Law", words: ["Civil", "Criminal", "Divorce", "Corporate"] },
    { name: "Bunny", words: ["Easter", "Hare", "Playboy", "Carrot"] },
    { name: "Sadhika", words: ["Will", "You", "Marry", "Me"] }
  ];

    // Track whether we should show or hide the results screen
    let showResultsScreenFlag = false;
    let resultsScreenDelay = 15000;

  (function injectCSS() {
    const css = `
[data-testid="card-label"]{
  display:flex;
  justify-content:center;
  align-items:center;
  text-align:center;
  white-space:nowrap; /* prefer single-line; script will allow wrap if needed */
  overflow:visible;
  padding:4px;
  line-height:1;
}
@media (max-width:480px){
  [data-testid="card-label"]{ padding:3px; }
}
/* remove pseudo commas for list items inside containers where we add .no-after */
.no-after li::after{ content:none !important; }
.no-after::after{ content:none !important; }

/* Dynamic results screen visibility */
.pz-moment__congrats.on-stage {
  display: flex !important;
}
.pz-game-screen.on-stage {
  display: flex !important;
}

.pz-game-field > article > section > a { display: none !important; }

/* Remove promo link under connections board */
[data-testid="connections-board"] { section { a { display: none !important; } } }
`;
    const s = document.createElement("style");
    s.id = "nyt-connections-size-only-css";
    s.textContent = css;
    document.head.appendChild(s);
  })();

  function getDateFromUrl() {
    try {
      const m = window.location.pathname.match(/\/games\/connections\/(\d{4}-\d{2}-\d{2})/);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  function formatLocalDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  async function fetchJsonV2(date) {
    const url = `https://www.nytimes.com/svc/connections/v2/${date}.json`;
    const resp = await fetch(url, { credentials: "include" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  }

  function findLabelTextNode(label) {
    for (const n of label.childNodes) {
      if (n.nodeType === Node.TEXT_NODE && n.nodeValue && n.nodeValue.trim().length) return n;
    }
    return null;
  }

  function walkTextNodes(root, fn) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) fn(node);
  }

  // Build maps from API data
  function buildMapsFromApi(data) {
    const wordMap = {};
    const titleMap = {};
    data.categories.forEach((cat, catIdx) => {
      const customGroup = customGroups[catIdx] || { name: `Group ${catIdx + 1}`, words: [] };
      if (cat.title) titleMap[cat.title.trim().toLowerCase()] = customGroup.name;
      if (Array.isArray(cat.cards)) {
        cat.cards.forEach((card, cIdx) => {
          const orig = String(card.content || "").trim().toLowerCase();
          const custom = customGroup.words[cIdx] || customGroup.words[0] || "";
          if (orig) wordMap[orig] = custom;
        });
      }
    });
    return { wordMap, titleMap };
  }

  // Apply mapped custom words to visible cards
  function applyCardReplacements(wordMap) {
    const labels = document.querySelectorAll('[data-testid="card-label"]');
    labels.forEach((label) => {
      const origText = label.textContent.trim();
      const key = origText.toLowerCase();
      if (key && key in wordMap) {
        const textNode = findLabelTextNode(label);
        if (textNode) textNode.nodeValue = wordMap[key];
        else label.textContent = wordMap[key];
      }
    });
  }

  // Per-word shrink logic
  // Per-word max-size buckets (px). Tuned small for phones; only font-size/line-height changed.
  function maxSizeForLength(len) {
    if (len <= 4) return 16;
    if (len <= 6) return 14;
    if (len <= 8) return 12;
    if (len <= 12) return 11;
    return 10;
  }

  // Shrink-to-fit for a single label: modify only font-size and line-height when needed.
  function shrinkLabelToFit(label) {
    const prevVis = label.style.visibility || "";
    label.style.visibility = "hidden";

    const textNode = findLabelTextNode(label);
    if (!textNode) {
      label.style.visibility = prevVis;
      return;
    }
    const text = textNode.nodeValue.trim();
    const maxPx = maxSizeForLength(text.length);
    const minPx = 9;
    let fitted = false;
    let size = Math.min(maxPx, 20);
    while (size >= minPx) {
      label.style.fontSize = size + "px";
      const fits = label.scrollWidth <= label.clientWidth + 1;
      if (fits) {
        fitted = true;
        break;
      }
      size -= 1;
    }
    if (!fitted) {
      label.style.whiteSpace = "normal";
      const twoLineSize = Math.max(minPx, Math.min(11, maxPx));
      label.style.fontSize = twoLineSize + "px";
      label.style.lineHeight = "1.05";
    } else {
      label.style.lineHeight = "1";
    }

    label.style.visibility = prevVis;
  }

  let autosizeTimer = null;
  function autosizeAllLabels() {
    clearTimeout(autosizeTimer);
    autosizeTimer = setTimeout(() => {
      const labels = document.querySelectorAll('[data-testid="card-label"]');
      labels.forEach((label) => shrinkLabelToFit(label));
    }, 30);
  }

  function observeLabelChanges() {
    const labels = document.querySelectorAll('[data-testid="card-label"]');
    labels.forEach((label) => {
      if (label.__autosize_obs) return;
      const obs = new MutationObserver(() => autosizeAllLabels());
      obs.observe(label, { childList: true, characterData: true, subtree: true });
      label.__autosize_obs = obs;
    });
  }

  function formatPurpleRow() {
    setTimeout(() => {
      const solvedCategoryContainer = document.querySelectorAll('[data-testid="solved-category-container"]');

      if (!solvedCategoryContainer) return;

      const purpleRowWordList = customGroups[3].words;
      const purpleRow = Array.from(solvedCategoryContainer).find((category) =>
        Array.from(category.querySelectorAll('li[data-testid="solved-category-card"]')).every((wordListItem) =>
          purpleRowWordList.includes(wordListItem.textContent)
        )
      );

      if (!purpleRow || purpleRow.length === 0) return;

      const purpleRowWordListItems = purpleRow.querySelectorAll('li[data-testid="solved-category-card"]');

      purpleRowWordListItems.forEach((wordListItem, index, arr) => {
        const word = wordListItem.textContent;
        if (purpleRowWordList.includes(word)) {
          wordListItem.textContent = "";
          if (index !== arr.length - 1) {
            wordListItem.style.display = "none";
          }
        }
      });

      if (purpleRowWordListItems[3]) purpleRowWordListItems[3].textContent = purpleRowWordList.join(" ") + "?";
    }, 50);
  }

  // Ensure purple formatting persists by observing the purple container
  function ensurePersistentPurpleFormatting(container) {
    if (!container) return;
    if (container.__purple_obs_attached) return;
    const obs = new MutationObserver(() => {
      setTimeout(() => {
        formatPurpleRow();
        autosizeAllLabels();
      }, 45);
    });
    obs.observe(container, { childList: true, subtree: true, characterData: true });
    container.__purple_obs_attached = true;
  }

  function hideResultsScreen() {
    const congratsElement = document.querySelector(".pz-moment__congrats");
    if (congratsElement) congratsElement.classList.remove("on-stage");

    const gameScreen = document.querySelector(".pz-game-screen");
    if (gameScreen) gameScreen.classList.add("on-stage");
  }

  function showResultsScreen() {
    const congratsElement = document.querySelector(".pz-moment__congrats");
    if (congratsElement) congratsElement.classList.add("on-stage");

    const gameScreen = document.querySelector(".pz-game-screen");
    if (gameScreen) gameScreen.classList.remove("on-stage");
  }

  function observeGameCompletion() {
    const completionObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.classList &&
                (node.classList.contains("pz-moment__congrats") ||
                  (node.querySelector && node.querySelector(".pz-moment__congrats")))
              ) {
                if (!showResultsScreenFlag) {
                  hideResultsScreen();
                } else {
                  showResultsScreen();
                }
              }
            }
          });
        }
      });
    });
    completionObserver.observe(document.body, { childList: true, subtree: true });
  }

  // New: temporary on-stage CSS injection/removal to avoid flash when on-stage classes are added
  let _tempOnStageTimer = null;

  function addTempOnStageCss(ms) {
    try {
      // If already present, refresh timer only
      if (document.getElementById("nyt-temp-onstage")) {
        if (_tempOnStageTimer) {
          clearTimeout(_tempOnStageTimer);
        }
        _tempOnStageTimer = setTimeout(() => {
          const el = document.getElementById("nyt-temp-onstage");
          if (el) el.remove();
          _tempOnStageTimer = null;
        }, ms);
        return;
      }

      const css = `
/* Temporary rules to prevent flash while on-stage classes are settling */
.pz-moment__congrats, .pz-moment__congrats.on-stage {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
.pz-game-screen, .pz-game-screen.on-stage {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}
`;
      const el = document.createElement("style");
      el.id = "nyt-temp-onstage";
      el.textContent = css;
      document.head.appendChild(el);
      _tempOnStageTimer = setTimeout(() => {
        const rr = document.getElementById("nyt-temp-onstage");
        if (rr) rr.remove();
        _tempOnStageTimer = null;
      }, ms);
    } catch (e) {
      _tempOnStageTimer = null;
    }
  }

  // Observe attribute changes to detect when 'on-stage' class is added to relevant elements
  const onStageObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "attributes" || mutation.attributeName !== "class") continue;
      const target = mutation.target;
      if (!(target instanceof Element)) continue;
      try {
        if (target.matches && (target.matches(".pz-moment__congrats") || target.matches(".pz-game-screen"))) {
          if (target.classList && target.classList.contains("on-stage")) {
            addTempOnStageCss(resultsScreenDelay);
          }
        }
      } catch (e) {
        /* ignore */
      }
    }
  });

  // Start observing for class changes
  onStageObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });

  // Add button click handler to toggle results screen visibility
  function setupResultsScreenToggle() {
    const button = document.querySelector('div.pz-game-field section button[class^="ActionButton-module_archiveGameOverButton"]');
    if (button && !button.__resultsToggleAdded) {
      button.__resultsToggleAdded = true;
      button.addEventListener('click', function(e) {
        // Toggle the visibility state
        showResultsScreenFlag = !showResultsScreenFlag;
          resultsScreenDelay = 20;

        // Apply the appropriate visibility
        if (showResultsScreenFlag) {
          showResultsScreen();
        } else {
          hideResultsScreen();
        }

        // Prevent default behavior if needed
        e.stopPropagation();
        return false;
      });
    }
  }

    function updateArchiveTitle() {
        const h2Title = document.querySelector('h2.pz-moment__title');
        const updatedTitle = 'Connections';
        if (h2Title && h2Title.textContent !== updatedTitle) {
            h2Title.textContent = updatedTitle;
        }
    }

    function updateBotLinkContent() {
        const botDiv = document.querySelector('[data-testid="bot-link-cta"]');
        const updatedHTML = `<p>How tough was today's puzzle?<br><span class="botLinkHref">Find out with Connections Bot ›</span></p>`;
        if (botDiv && botDiv.lastChild.innerHTML !== updatedHTML) {
            botDiv.lastChild.innerHTML = updatedHTML;
        }
    }

    function hideArchiveLinkButton() {
        const archiveLinkButton = document.querySelector('section[class^="Board-module_archiveGameOverButtonGroup"] a[class^="ActionButton-module_archiveGameOverButton"]');
        if (archiveLinkButton) {
            archiveLinkButton.style.setProperty('display', 'none', 'important');
        }
    }

  function removeArchiveGameOverLinkOnce() {
    function tryRemove() {
      const link = document.querySelector('div.pz-game-field a[class^="ActionButton-module_archiveGameOverButton"]');
      if (link) {
        if (typeof link.remove === "function") link.remove();
        else if (link.parentNode) link.parentNode.removeChild(link);
        return true;
      }
      return false;
    }

    if (tryRemove()) return;

    const observer = new MutationObserver(function () {
      if (tryRemove()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", function onLoad() {
        tryRemove();
        window.removeEventListener("DOMContentLoaded", onLoad);
      });
    } else {
      tryRemove();
    }
  }

  const mainObserver = new MutationObserver((mutations, obs) => {
    const labels = document.querySelectorAll('[data-testid="card-label"]');
    if (labels.length === 16) {
      obs.disconnect();
      (async () => {
        try {
          let puzzleDate = getDateFromUrl();
          if (!puzzleDate) puzzleDate = formatLocalDate(new Date());
          const data = await fetchJsonV2(puzzleDate);
          if (!data || !Array.isArray(data.categories)) {
            console.error("Unexpected API response format for", puzzleDate);
            return;
          }
          const maps = buildMapsFromApi(data);
          applyCardReplacements(maps.wordMap);

          autosizeAllLabels();
          observeLabelChanges();

          // initial purple attempt and persistent formatting
          const purpleContainer = (function tryFormat() {
            formatPurpleRow();
            // attempt to find the container quickly (may be set by formatPurpleRow)
            return document.querySelector('[data-testid="solved-category-container"].no-after') || null;
          })();

          if (purpleContainer) ensurePersistentPurpleFormatting(purpleContainer);

          // Start light observer for congrats additions
          observeGameCompletion();

          // Also call hide once (in case congrats already present)
          hideResultsScreen();

          // Setup results screen toggle button
          setupResultsScreenToggle();

          // Call so the archive link is removed as soon as the main observer detects the board ready
          removeArchiveGameOverLinkOnce();
            hideArchiveLinkButton();

            // Update Bot link text on the results page
            updateBotLinkContent();

          // reveal observer: replace titles/words and react to solved container additions
          const revealObserver = new MutationObserver((mutList) => {
            mutList.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                // If reveal modal inserted, replace category titles
                const titleElements = node.querySelectorAll(".category-title");
                if (titleElements && titleElements.length) {
                  titleElements.forEach((el, idx) => {
                    if (idx < customGroups.length) el.textContent = customGroups[idx].name;
                  });
                }

                // If solved-category-container added or updated, run formatting and attach persistence
                if ((node.matches && node.matches('[data-testid="solved-category-container"]')) || (node.querySelector && node.querySelector('[data-testid="solved-category-container"]'))) {
                  const found = (function f() {
                    formatPurpleRow();
                    return document.querySelector('[data-testid="solved-category-container"].no-after') || null;
                  })();
                  if (found) {
                    ensurePersistentPurpleFormatting(found);
                    autosizeAllLabels();
                  }
                }

                // If congrats element added anywhere, hide it and show game
                if (node.classList && (node.classList.contains("pz-moment__congrats") || (node.querySelector && node.querySelector(".pz-moment__congrats")))) {
                  if (!showResultsScreenFlag) {
                    hideResultsScreen();
                  } else {
                    showResultsScreen();
                  }
                }

                // Check if the results toggle button was added
                if (node.querySelector && node.querySelector('div.pz-game-field section button[class^="ActionButton-module_archiveGameOverButton"]')) {
                  setupResultsScreenToggle();
                }

                if (node.querySelector && node.querySelector('div.pz-game-field a[class^="ActionButton-module_archiveGameOverButton"]')) {
                  removeArchiveGameOverLinkOnce();
                }

                  hideArchiveLinkButton();

                  // Update Bot link text on the results page
                  updateBotLinkContent();

                // Walk text nodes for replacements
                walkTextNodes(node, (textNode) => {
                  const t = String(textNode.nodeValue || "").trim();
                  if (!t) return;
                  const lower = t.toLowerCase();
                  if (lower in maps.titleMap) {
                    textNode.nodeValue = maps.titleMap[lower];
                    return;
                  }
                  for (const [origWord, customWord] of Object.entries(maps.wordMap)) {
                    if (t.toLowerCase() === origWord.toLowerCase()) {
                      textNode.nodeValue = customWord;
                      break;
                    }
                  }
                });
              });
            });
            autosizeAllLabels();
          });

          revealObserver.observe(document.body, { childList: true, subtree: true });
          window.addEventListener("resize", autosizeAllLabels);
        } catch (err) {
          console.error("Failed to fetch NYT connections JSON for date:", err);
        }
      })();
    }
  });

    // Update the h2 title on the first page for archive puzzles
    updateArchiveTitle();

  mainObserver.observe(document.body, { childList: true, subtree: true });

  console.log("NYT Connections customizer loaded");
})();
