// ==UserScript==
// @name          AO3: Chapter Shortcuts
// @version       2.4
// @description   Add shortcuts for first and last chapters on AO3 works. Customize the latest chapter symbol on work titles.
// @author        BlackBatCat
// @license       MIT
// @match         *://archiveofourown.org/*
// @require       https://update.greasyfork.org/scripts/554170/1693013/AO3%3A%20Menu%20Helpers%20Library%20v2.js?v=2.1.6
// @grant         none
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/549571/AO3%3A%20Chapter%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/549571/AO3%3A%20Chapter%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Wait for library to load
  if (!window.AO3MenuHelpers) {
    console.error("[AO3: Chapter Shortcuts] Menu Helpers library not loaded!");
    return;
  }

  const helpers = window.AO3MenuHelpers;

  // --- SETTINGS STORAGE ---
  const CHAPTER_SHORTCUTS_CONFIG_KEY = "ao3_chapter_shortcuts_config";
  const DEFAULT_CHAPTER_SHORTCUTS_CONFIG = {
    lastChapterSymbol: "»",
    hideMenuOptions: false,
  };
  let CHAPTER_SHORTCUTS_CONFIG = { ...DEFAULT_CHAPTER_SHORTCUTS_CONFIG };

  function loadChapterShortcutsConfig() {
    try {
      const saved = localStorage.getItem(CHAPTER_SHORTCUTS_CONFIG_KEY);
      if (saved) {
        CHAPTER_SHORTCUTS_CONFIG = {
          ...DEFAULT_CHAPTER_SHORTCUTS_CONFIG,
          ...JSON.parse(saved),
        };
      }
    } catch (e) {
      console.error("Error loading config:", e);
    }
  }

  function saveChapterShortcutsConfig() {
    try {
      localStorage.setItem(
        CHAPTER_SHORTCUTS_CONFIG_KEY,
        JSON.stringify(CHAPTER_SHORTCUTS_CONFIG)
      );
    } catch (e) {
      console.error("Error saving config:", e);
    }
  }

  // --- SETTINGS MENU ---
  function showChapterShortcutsMenu() {
    // Remove any existing dialogs
    helpers.removeAllDialogs();

    // Create dialog
    const dialog = helpers.createDialog("🏃🏻 Chapter Shortcuts 🏃🏻", {
      maxWidth: "500px",
    });

    // Add separator
    const separator = document.createElement("hr");
    separator.style.cssText =
      "margin: 10px 0; border: none; border-top: 1px solid inherit;";
    dialog.appendChild(separator);

    // Create preset buttons section
    const presetGroup = helpers.createSettingGroup();
    presetGroup.appendChild(
      helpers.createLabel("Choose a symbol for the Last Chapter button:")
    );

    const presetSymbols = ["»", "➼", "➺", "✦", "♥", "✿", "ɞɞ"];
    const presetButtons = presetSymbols.map((symbol) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-symbol";
      btn.dataset.symbol = symbol;
      btn.textContent = symbol;
      btn.style.cssText =
        "font-family: inherit; font-size: inherit; color: inherit;";
      return btn;
    });

    const buttonContainer = helpers.createHorizontalLayout(presetButtons, {
      gap: "10px",
    });
    buttonContainer.style.marginBottom = "10px";
    presetGroup.appendChild(buttonContainer);

    dialog.appendChild(presetGroup);

    // Create custom input
    const customInput = helpers.createTextInput({
      id: "custom-symbol",
      label: "Or enter your own:",
      value: CHAPTER_SHORTCUTS_CONFIG.lastChapterSymbol,
      placeholder: "",
    });
    customInput.querySelector("#custom-symbol").maxLength = 4;
    dialog.appendChild(customInput);

    // Add preset button click handlers
    presetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("custom-symbol").value = btn.dataset.symbol;
      });
    });

    // Create hide menu checkbox
    const hideMenuCheckbox = helpers.createCheckbox({
      id: "hide-menu-option",
      label: "Hide menu option",
      checked: CHAPTER_SHORTCUTS_CONFIG.hideMenuOptions,
      tooltip: "When checked, the 'Chapter Shortcuts' menu item will only appear on the main AO3 page to reduce menu clutter, but the script will still work on all pages.",
    });
    dialog.appendChild(hideMenuCheckbox);

    // Create button group
    const buttons = helpers.createButtonGroup([
      {
        text: "Save",
        id: "chapter-shortcuts-save",
        primary: true,
        onClick: () => {
          CHAPTER_SHORTCUTS_CONFIG.lastChapterSymbol =
            helpers.getValue("custom-symbol") || "»";
          CHAPTER_SHORTCUTS_CONFIG.hideMenuOptions = helpers.getValue("hide-menu-option");
          saveChapterShortcutsConfig();
          dialog.remove();
          addChapterButtons(true);
        },
      },
      {
        text: "Cancel",
        id: "chapter-shortcuts-cancel",
        onClick: () => {
          dialog.remove();
        },
      },
    ]);
    dialog.appendChild(buttons);

    // Add to page
    document.body.appendChild(dialog);

    // Close on background click
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.remove();
    });
  }

  // --- GET STORY ID ---
  function getStoryId() {
    const match = window.location.pathname.match(/works\/(\d+)/);
    if (match !== null) {
      return match[1];
    }
    const chapterForm = document.querySelector("#chapter_index li form");
    if (chapterForm && chapterForm.getAttribute("action")) {
      const actionMatch = chapterForm
        .getAttribute("action")
        .match(/works\/(\d+)/);
      if (actionMatch) {
        return actionMatch[1];
      }
    }
    return null;
  }

  // --- ADD CHAPTER BUTTONS & LINKS ---
  function addChapterButtons(forceRerender = false) {
    // Remove any previous custom links/buttons if rerendering
    if (forceRerender) {
      document
        .querySelectorAll("#go_to_last_chap, #go_to_first_chap")
        .forEach((el) => el.remove());
      document
        .querySelectorAll(".ao3-last-chapter-link")
        .forEach((el) => el.remove());
    }

    // Check if we're on a work page with chapter navigation
    const workNav = document.querySelector("ul.work");
    const indexList = document.querySelector("ul.index");
    if (workNav && !indexList) {
      // Add Last Chapter button if not on the last chapter
      if (document.querySelector(".next")) {
        const lastChapterBtn = document.createElement("li");
        lastChapterBtn.id = "go_to_last_chap";
        lastChapterBtn.innerHTML = `<a>Last Chapter</a>`;
        lastChapterBtn.addEventListener("click", function () {
          const select = document.querySelector("#selected_id");
          if (select && select.options.length > 0) {
            const lastChapterId =
              select.options[select.options.length - 1].value;
            window.location.href = `/works/${getStoryId()}/chapters/${lastChapterId}`;
          }
        });
        workNav.prepend(lastChapterBtn);
      }

      // Add First Chapter button if not on the first chapter
      if (document.querySelector(".previous")) {
        const firstChapterBtn = document.createElement("li");
        firstChapterBtn.id = "go_to_first_chap";
        firstChapterBtn.innerHTML = "<a>First Chapter</a>";
        firstChapterBtn.addEventListener("click", function () {
          window.location.href = `/works/${getStoryId()}`;
        });
        workNav.prepend(firstChapterBtn);
      }
    }

    // Add last chapter links to work listings
    if (document.querySelector(".header h4.heading")) {
      const headings = document.querySelectorAll(".header h4.heading");
      headings.forEach((heading) => {
        const link = heading.querySelector("a");
        if (link) {
          const storyPath = link.getAttribute("href");
          const match = storyPath.match(/works\/(\d+)/);
          if (match) {
            const storyId = match[1];
            fetch(`/works/${storyId}/navigate`)
              .then((response) => response.text())
              .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");
                const lastChapterLink = doc.querySelector("ol li:last-child a");
                if (lastChapterLink) {
                  const lastChapterPath = lastChapterLink.getAttribute("href");
                  const lastChapterEl = document.createElement("a");
                  lastChapterEl.href = lastChapterPath;
                  lastChapterEl.title = "Jump to last chapter";
                  lastChapterEl.textContent = ` ${
                    CHAPTER_SHORTCUTS_CONFIG.lastChapterSymbol || "»"
                  }`;
                  lastChapterEl.className = "ao3-last-chapter-link";
                  heading.appendChild(lastChapterEl);
                }
              })
              .catch((error) =>
                console.error("Error fetching chapter data:", error)
              );
          }
        }
      });
    }
  }

  // --- INITIALIZATION ---
  loadChapterShortcutsConfig();

  // Show startup message
  console.log("[AO3: Chapter Shortcuts] loaded.");

  // Add to shared menu using library helper (conditionally)
  const isMainPage = window.location.href === "https://archiveofourown.org/" || window.location.href === "https://archiveofourown.org";
  if (!CHAPTER_SHORTCUTS_CONFIG.hideMenuOptions || isMainPage) {
    helpers.addToSharedMenu({
      id: "opencfg_chapter_shortcuts",
      text: "Chapter Shortcuts",
      onClick: showChapterShortcutsMenu,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      addChapterButtons();
    });
  } else {
    addChapterButtons();
  }
})();
