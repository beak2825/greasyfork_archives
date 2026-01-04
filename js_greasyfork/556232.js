// ==UserScript==
// @name         AO3: Auto Pseud
// @version      1.0.0
// @description  Assign pseuds based on fandoms when commenting and bookmarking works
// @author       BlackBatCat
// @match        *://archiveofourown.org/users/*/pseuds/*/edit
// @match        *://archiveofourown.org/users/*/pseuds/*/bookmarks*
// @match        *://archiveofourown.org/works*
// @match        *://archiveofourown.org/chapters/*
// @match        *://archiveofourown.org/collections/*/bookmarks
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/556232/AO3%3A%20Auto%20Pseud.user.js
// @updateURL https://update.greasyfork.org/scripts/556232/AO3%3A%20Auto%20Pseud.meta.js
// ==/UserScript==

console.log("[AO3: Auto Pseud] loaded.");
(function () {
  "use strict";

  // Storage key
  const STORAGE_KEY = "ao3_auto_pseud_config";

  // Page detection regex
  const WORKS_PAGE_REGEX =
    /^https?:\/\/archiveofourown\.org\/(?:.*\/)?(works|chapters)(\/|$)/;
  const PSEUD_EDIT_REGEX =
    /^https?:\/\/archiveofourown\.org\/users\/.*\/pseuds\/.*\/edit$/;
  const BOOKMARKS_PAGE_REGEX =
    /^https?:\/\/archiveofourown\.org\/(?:collections\/.*\/)?(?:users\/.*\/(?:pseuds\/.*\/)?)?bookmarks(?:\/.*)?$/;

  // Get the entire config object
  function getConfig() {
    try {
      const config = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (!config.pseuds) config.pseuds = {};
      if (config.enableComments === undefined) config.enableComments = false;
      if (config.enableBookmarks === undefined) config.enableBookmarks = false;
      return config;
    } catch (e) {
      console.error("[AO3: Auto Pseud] Error loading config:", e);
      return { pseuds: {}, enableComments: false, enableBookmarks: false };
    }
  }

  // Save the entire config object
  function saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("[AO3: Auto Pseud] Error saving config:", e);
    }
  }

  // Get current pseud name from URL
  function getCurrentPseudName() {
    const urlParts = window.location.pathname.split("/");
    const pseudIndex = urlParts.indexOf("pseuds");
    return pseudIndex !== -1 ? urlParts[pseudIndex + 1] : null;
  }

  // Get stored fandoms for current pseud
  function getStoredFandoms(pseudName) {
    const config = getConfig();
    return config.pseuds[pseudName]?.fandoms || [];
  }

  // Save fandoms for current pseud
  function saveFandomsForPseud(pseudName, fandoms) {
    const config = getConfig();
    if (!config.pseuds[pseudName]) {
      config.pseuds[pseudName] = {};
    }
    config.pseuds[pseudName].fandoms = fandoms;
    saveConfig(config);
  }

  // Get pseud ID for a given pseud name
  function getPseudIdByName(pseudName) {
    const config = getConfig();
    return config.pseuds[pseudName]?.id || null;
  }

  // Save pseud name to ID mapping
  function savePseudNameMapping(pseudName, pseudId) {
    const config = getConfig();
    if (!config.pseuds[pseudName]) {
      config.pseuds[pseudName] = {};
    }
    config.pseuds[pseudName].id = pseudId;
    saveConfig(config);
  }

  // Find which pseud should be used for given fandoms
  function findMatchingPseud(workFandoms) {
    try {
      const config = getConfig();

      for (const [pseudName, pseudData] of Object.entries(config.pseuds)) {
        const pseudFandoms = pseudData.fandoms || [];
        const pseudId = pseudData.id;

        if (!pseudId) continue;

        for (const workFandom of workFandoms) {
          if (pseudFandoms.includes(workFandom)) {
            return pseudId;
          }
        }
      }

      return null;
    } catch (e) {
      console.error("[AO3: Auto Pseud] Error finding matching pseud:", e);
      return null;
    }
  }

  // ==================== PSEUD EDIT PAGE ====================

  // Add fandom fieldset to the page
  function addFandomFieldset() {
    const form = document.querySelector("form.edit_pseud");
    if (!form) {
      console.error("[AO3: Auto Pseud] Could not find pseud edit form");
      return;
    }

    const submitDd = form.querySelector("dd.submit.actions");
    if (!submitDd) {
      console.error("[AO3: Auto Pseud] Could not find submit button");
      return;
    }

    const pseudName = getCurrentPseudName();
    const storedFandoms = pseudName ? getStoredFandoms(pseudName) : [];
    const fandomValue = storedFandoms.join(", ");

    // Create the fandom dt and dd elements
    const fandomDt = document.createElement("dt");
    fandomDt.className = "fandom";
    fandomDt.innerHTML = `
            <label for="pseud_fandom_autocomplete" title="fandoms">Fandoms</label>
            <a class="help symbol question modal modal-attached" title="Associate fandoms with this pseud for automatic selection when commenting and bookmarking" href="#" onclick="alert('Associate fandoms with this pseud. When you comment on or bookmark works in these fandoms, this pseud will be suggested automatically.'); return false;">
                <span class="symbol question"><span>?</span></span>
            </a>
        `;

    const config = getConfig();
    const fandomDd = document.createElement("dd");
    fandomDd.className = "fandom";
    fandomDd.setAttribute("title", "fandoms");
    fandomDd.innerHTML = `
            <input type="text" name="pseud[fandom_string]" id="pseud_fandom" 
                   value="${fandomValue}" class="autocomplete" 
                   data-autocomplete-method="/autocomplete/fandom" 
                   data-autocomplete-hint-text="Start typing for suggestions!" 
                   data-autocomplete-no-results-text="(No suggestions found)" 
                   data-autocomplete-min-chars="1" 
                   data-autocomplete-searching-text="Searching..." 
                   title="fandoms">
            <div style="margin-top: 0.5em;">
                <label><input type="checkbox" id="enable_comments" ${
                  config.enableComments ? "checked" : ""
                }> Assign pseud to comments</label><br>
                <label><input type="checkbox" id="enable_bookmarks" ${
                  config.enableBookmarks ? "checked" : ""
                }> Assign pseud to bookmarks</label>
            </div>
        `;

    const submitDt = form.querySelector("dt.landmark");
    submitDt.parentNode.insertBefore(fandomDt, submitDt);
    submitDt.parentNode.insertBefore(fandomDd, submitDt);
  }

  // Intercept form submission to save fandoms
  function interceptFormSubmit() {
    const form = document.querySelector("form.edit_pseud");
    if (!form) return;

    const formAction = form.getAttribute("action");
    const pseudId = formAction ? formAction.split("/").pop() : null;

    form.addEventListener("submit", function (e) {
      const pseudName = getCurrentPseudName();
      const fandomInput = document.querySelector("#pseud_fandom");

      if (pseudName && fandomInput) {
        const fandoms = fandomInput.value
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);

        saveFandomsForPseud(pseudName, fandoms);

        if (pseudId) {
          savePseudNameMapping(pseudName, pseudId);
        }

        fandomInput.disabled = true;
        const autocompleteInput = document.querySelector(
          "#pseud_fandom_autocomplete"
        );
        if (autocompleteInput) autocompleteInput.disabled = true;
      }
    });
  }

  // Save options when checkboxes change
  function saveOptions() {
    const enableCommentsCheckbox = document.querySelector("#enable_comments");
    const enableBookmarksCheckbox = document.querySelector("#enable_bookmarks");

    if (enableCommentsCheckbox && enableBookmarksCheckbox) {
      const config = getConfig();
      config.enableComments = enableCommentsCheckbox.checked;
      config.enableBookmarks = enableBookmarksCheckbox.checked;
      saveConfig(config);
    }
  }

  // Initialize the pseud edit page
  function initPseudEditPage() {
    addFandomFieldset();
    interceptFormSubmit();

    // Add listeners for options checkboxes
    const enableCommentsCheckbox = document.querySelector("#enable_comments");
    const enableBookmarksCheckbox = document.querySelector("#enable_bookmarks");

    if (enableCommentsCheckbox) {
      enableCommentsCheckbox.addEventListener("change", saveOptions);
    }
    if (enableBookmarksCheckbox) {
      enableBookmarksCheckbox.addEventListener("change", saveOptions);
    }
  }

  // ==================== WORKS PAGE ====================

  // Get fandoms from the current work page
  function getWorkFandoms(workId = null) {
    if (workId) {
      // Try to find the blurb by .work-<id> (standard AO3 class)
      let blurb = document.querySelector(`.work-${workId}`);
      if (!blurb) {
        // Try to find a <li> with class containing work-<id>
        blurb = Array.from(
          document.querySelectorAll("li.bookmark, li.blurb, li.group")
        ).find((el) => el.className && el.className.includes(`work-${workId}`));
      }
      if (!blurb) {
        // Try to find by id (sometimes used)
        blurb =
          document.getElementById(`work-${workId}`) ||
          document.getElementById(`bookmark_${workId}`);
      }
      if (blurb) {
        // Try standard AO3 structure
        let fandomTags = blurb.querySelectorAll("h5.fandoms.heading a.tag");
        if (fandomTags.length === 0) {
          // Try fallback: any a.tag inside blurb
          fandomTags = blurb.querySelectorAll("a.tag");
        }
        const fandoms = Array.from(fandomTags).map((tag) =>
          tag.textContent.trim()
        );
        return fandoms;
      }
      // If no blurb found, fall through to page-wide selectors
    }

    // On bookmark list pages, don't auto-select to avoid using wrong fandoms
    if (
      BOOKMARKS_PAGE_REGEX.test(window.location.href) &&
      !window.location.href.includes("/edit")
    ) {
      return [];
    }
    // Check for fandoms in work page structure (dd.fandom.tags)
    let fandomTags = document.querySelectorAll("dd.fandom.tags a.tag");
    if (fandomTags.length === 0) {
      // Check for fandoms in bookmark page structure (h5.fandoms.heading a.tag)
      fandomTags = document.querySelectorAll("h5.fandoms.heading a.tag");
    }
    return Array.from(fandomTags).map((tag) => tag.textContent.trim());
  }

  // Build pseud name-to-ID map from comment form select options
  function buildPseudMapFromCommentForm() {
    const commentSelect = document.querySelector(
      'select[name="comment[pseud_id]"]'
    );
    if (!commentSelect) return;

    const options = commentSelect.querySelectorAll("option");
    options.forEach((option) => {
      const pseudId = option.value;
      const pseudName = option.textContent.trim();
      savePseudNameMapping(pseudName, pseudId);
    });
  }

  // Build pseud name-to-ID map from bookmark form select options
  function buildPseudMapFromBookmarkForm() {
    const bookmarkSelect = document.querySelector(
      'select[name="bookmark[pseud_id]"]'
    );
    if (!bookmarkSelect) return;

    const options = bookmarkSelect.querySelectorAll("option");
    options.forEach((option) => {
      const pseudId = option.value;
      const pseudName = option.textContent.trim();
      savePseudNameMapping(pseudName, pseudId);
    });
  }

  // Switch the comment form pseud to the matching one
  function switchCommentPseud() {
    const config = getConfig();
    if (!config.enableComments) return;

    const workFandoms = getWorkFandoms();
    if (workFandoms.length === 0) return;

    buildPseudMapFromCommentForm();

    const matchingPseudId = findMatchingPseud(workFandoms);
    if (!matchingPseudId) return;

    const commentSelects = document.querySelectorAll(
      'select[name="comment[pseud_id]"]'
    );
    commentSelects.forEach((select) => {
      const option = select.querySelector(`option[value="${matchingPseudId}"]`);
      if (option) {
        select.value = matchingPseudId;
      }
    });
  }

  // Observe comment fieldsets for pseud selects
  function observeCommentFieldsets() {
    const commentLegends = document.querySelectorAll("fieldset legend");
    commentLegends.forEach((legend) => {
      if (legend.textContent.trim() === "Comment") {
        const fieldset = legend.closest("fieldset");
        if (!fieldset) return;
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (
                node.nodeType === 1 &&
                node.matches('select[name="comment[pseud_id]"]')
              ) {
                switchCommentPseud();
                observer.disconnect();
                return;
              }
            }
          }
        });
        observer.observe(fieldset, { childList: true, subtree: true });
        // Also check if select is already there
        const existingSelect = fieldset.querySelector(
          'select[name="comment[pseud_id]"]'
        );
        if (existingSelect) {
          switchCommentPseud();
        }
      }
    });
  }

  // Observe bookmark fieldsets for pseud selects
  function observeBookmarkFieldsets() {
    const bookmarkLegends = document.querySelectorAll("fieldset legend");
    bookmarkLegends.forEach((legend) => {
      if (legend.textContent.trim() === "Bookmark") {
        const fieldset = legend.closest("fieldset");
        if (!fieldset) return;
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (
                node.nodeType === 1 &&
                node.matches('select[name="bookmark[pseud_id]"]')
              ) {
                switchBookmarkPseud();
                observer.disconnect();
                return;
              }
            }
          }
        });
        observer.observe(fieldset, { childList: true, subtree: true });
        // Also check if select is already there
        const existingSelect = fieldset.querySelector(
          'select[name="bookmark[pseud_id]"]'
        );
        if (existingSelect) {
          switchBookmarkPseud();
        }
      }
    });
  }

  // Observe for new bookmark fieldsets being added to the page
  function observeForNewBookmarkFieldsets() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && node.matches("fieldset")) {
            const legend = node.querySelector("legend");
            if (legend && legend.textContent.trim() === "Bookmark") {
              observeBookmarkFieldsets();
            }
          }
          // Handle AO3 collection bookmarks: <div id="bookmark-form">
          if (node.nodeType === 1 && node.id === "bookmark-form") {
            // Watch for the select being added inside #bookmark-form
            const formObserver = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                for (const added of mutation.addedNodes) {
                  if (
                    added.nodeType === 1 &&
                    added.matches('select[name="bookmark[pseud_id]"]')
                  ) {
                    switchBookmarkPseud();
                    formObserver.disconnect();
                    return;
                  }
                }
              }
            });
            formObserver.observe(node, { childList: true, subtree: true });
            // Also check if select is already there
            const existingSelect = node.querySelector(
              'select[name="bookmark[pseud_id]"]'
            );
            if (existingSelect) {
              switchBookmarkPseud();
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function switchBookmarkPseud() {
    const config = getConfig();
    if (!config.enableBookmarks) {
      return;
    }

    const bookmarkSelects = document.querySelectorAll(
      'select[name="bookmark[pseud_id]"]'
    );
    if (bookmarkSelects.length === 0) {
      return;
    }
    bookmarkSelects.forEach((select) => {
      const form = select.closest('form[action^="/works/"]');
      let workId = null;
      if (form) {
        const match = form.getAttribute("action").match(/\/works\/(\d+)/);
        if (match) workId = match[1];
      }
      if (!workId) {
        return;
      }
      const workFandoms = getWorkFandoms(workId);
      if (workFandoms.length === 0) {
        return;
      }
      buildPseudMapFromBookmarkForm();
      const matchingPseudId = findMatchingPseud(workFandoms);
      if (!matchingPseudId) {
        return;
      }
      const option = select.querySelector(`option[value="${matchingPseudId}"]`);
      if (option) {
        select.value = matchingPseudId;
      }
    });
  }

  // Initialize works page functionality
  function initWorksPage() {
    switchCommentPseud();
    switchBookmarkPseud();
    observeCommentFieldsets();
    observeBookmarkFieldsets();
    observeForNewBookmarkFieldsets();
  }

  // Initialize bookmarks page functionality
  function initBookmarksPage() {
    switchBookmarkPseud();
    observeBookmarkFieldsets();
    observeForNewBookmarkFieldsets();
  }

  // Determine which page we're on and initialize accordingly
  function initializeScript() {
    const currentUrl = window.location.href;
    if (PSEUD_EDIT_REGEX.test(currentUrl)) {
      initPseudEditPage();
    } else if (WORKS_PAGE_REGEX.test(currentUrl)) {
      initWorksPage();
    } else if (BOOKMARKS_PAGE_REGEX.test(currentUrl)) {
      initBookmarksPage();
    }
  }

  // Wait for page to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeScript);
  } else {
    initializeScript();
  }
})();
