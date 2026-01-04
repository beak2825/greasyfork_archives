// ==UserScript==
// @name         WaniKani RadicalGuessr
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Enhance your kanji lessons by attempting to guess which radicals make up a kanji.
// @author       romans-boi
// @license      MIT
// @match        https://www.wanikani.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558787/WaniKani%20RadicalGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/558787/WaniKani%20RadicalGuessr.meta.js
// ==/UserScript==

(async function () {
  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Constants and other important variables
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const RADICAL_SECTION_TITLE_KEY = "Radical Composition";

  let state = {};

  class State {
    constructor(pageUrl, lesson) {
      this.pageUrl = pageUrl;
      this.lesson = lesson;
    }
  }

  class Lesson {
    constructor() {
      this.radicalsSection = null;
      this.radicals = [];
      this.initialisedInput = false;
      this.initialisedCovers = false;
      this.initialisedSubmitAll = false;
      this.incorrectAnimationInProgress = false;
    }
  }

  class Radical {
    constructor(title, coverElement) {
      this.title = title;
      this.coverElement = coverElement;
      this.isCovered = true;
    }
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Initialising and setting up the script
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  window.addEventListener("turbo:load", onTurboLoad);

  function onTurboLoad(event) {
    state = new State(event.detail.url, new Lesson());

    const runApp = () => {
      router();
    };

    runApp();
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Router setup for handling correct page setups
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function router() {
    const { pageUrl } = state;

    console.log(pageUrl);

    if (/subject-lessons/.test(pageUrl)) {
      LessonPage.init();
    } else {
      // Nothing to be done at the moment
    }
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Review page 'module' which handles setting up the relevant bits for the review page
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const LessonPage = {
    async init() {
      addStyle();

      const element = await waitForElement(".subject-section", 10);

      // Only care if we are on a radical lesson
      if (element.title == RADICAL_SECTION_TITLE_KEY) {
        state.lesson.radicalsSection = element;
        RadicalQuiz.init();
      }
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Review page 'module' which handles setting up the relevant bits for the review page
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const RadicalQuiz = {
    async init() {
      this.initInput();
      this.initRadicalCovers();
      this.initSubmitAllButton();
      this.replaceDescriptionText();
    },

    initInput() {
      // Want to avoid inserting the input more than once
      if (state.lesson.initialisedInput) return;
      state.lesson.initialisedInput = true;

      const subjectSection = state.lesson.radicalsSection;

      const container = document.createElement("div");
      container.className = "radical__input-container";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type radical...";
      input.className = "radical__input";

      const resetInput = () => {
        input.value = "";
      };

      const button = document.createElement("button");
      button.className = "radical__input-submit-button";
      button.innerHTML = `
        <svg class="wk-icon wk-icon--chevron_right" viewBox="0 0 320 512" aria-hidden="true">
            <use href="#wk-icon__chevron-right"></use>
        </svg>
      `;

      // Handle normal click
      button.addEventListener("click", () => {
        this.handleSubmit(input.value, resetInput);
      });

      // Handle Enter key
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.handleSubmit(input.value, resetInput);
        }
      });

      container.appendChild(input);
      container.appendChild(button);

      // Insert right before the list of radicals
      const parent = subjectSection.querySelector(".subject-section__content");
      const subjectListDiv = subjectSection.querySelector(".subject-list");

      parent.insertBefore(container, subjectListDiv);
    },

    initRadicalCovers() {
      // Want to avoid inserting the covers more than once
      if (state.lesson.initialisedCovers) return;
      state.lesson.initialisedCovers = true;

      const subjectSection = state.lesson.radicalsSection;

      const subjectItems = subjectSection.querySelector(
        ".subject-list__items"
      ).children;

      for (let index = 0; index < subjectItems.length; index++) {
        // Insert the cover with absolute position into
        // the <li> so that it masks the link set on the child <a>
        const parent = subjectItems[index];

        const coverDiv = document.createElement("div");
        coverDiv.className = "subject-character__cover";

        const rect = parent.getBoundingClientRect();
        coverDiv.style.width = rect.width + "px";
        coverDiv.style.height = rect.height + "px";
        coverDiv.title = "Tap to reveal";

        const title = subjectItems[index].querySelector(
          ".subject-character__meaning"
        ).textContent;

        const radical = new Radical(title, coverDiv);

        // Update state
        state.lesson.radicals.push(radical);

        coverDiv.addEventListener("click", (e) => {
          // Prevent navigation to the radical page
          // when clicking on the cover
          e.stopPropagation();
          e.preventDefault();

          this.revealRadical(radical);
        });

        parent.appendChild(coverDiv);
      }
    },

    initSubmitAllButton() {
      // Want to avoid inserting the button more than once
      if (state.lesson.initialisedSubmitAll) return;
      state.lesson.initialisedSubmitAll = true;

      const subjectSection = state.lesson.radicalsSection;

      const container = document.createElement("div");
      container.className = "submit-all__container";

      const button = document.createElement("button");
      button.className = "wk-button wk-button--primary";
      button.innerHTML = `
        <span class="wk-button__shadow"></span>
        <span class="wk-button__edge"></span>
        <span class="wk-button__content">
            <span class="wk-button__text">Reveal All</span>
        </span>
      `;

      button.addEventListener("click", () => {
        this.revealAll();
      });

      container.appendChild(button);
      subjectSection.appendChild(container);
    },

    replaceDescriptionText() {
      const description = document.querySelector(".subject-section__content")
        .children[0];
      console.log(description);
      description.textContent = description.textContent.replace(
        "Can you see where the radicals fit in the kanji?",
        "Can you guess which radicals make up this kanji?"
      );
    },

    handleSubmit(inputText, resetInput) {
      const radicals = state.lesson.radicals;

      // Skip handling submit if every radical is already uncovered
      if (radicals.every((radical) => !radical.isCovered)) return;

      const normalizeText = (text) => {
        return text.trim().toLowerCase();
      };

      const matchingRadicalIndex = radicals.findIndex(
        (radical) =>
          // Checking isCovered accounts for mutliple radicals with same name (still
          // reveals one at a time)
          radical.isCovered &&
          normalizeText(radical.title) == normalizeText(inputText)
      );

      if (matchingRadicalIndex !== -1) {
        // Reset the input only if correct, and reveal radical
        resetInput();
        this.revealRadical(radicals[matchingRadicalIndex]);
      } else {
        this.showIncorrectAnimation();
      }
    },

    showIncorrectAnimation() {
      const { radicals, incorrectAnimationInProgress } = state.lesson;

      if (incorrectAnimationInProgress) return;

      state.lesson.incorrectAnimationInProgress = true;

      const addAnimation = (radical) => {
        radical.coverElement.classList.add("incorrect");
      };

      const removeAnimation = (radical) => {
        radical.coverElement.classList.remove("incorrect");
        state.lesson.incorrectAnimationInProgress = false;
      };

      for (let index = 0; index < radicals.length; index++) {
        const radical = radicals[index];

        addAnimation(radical);

        setTimeout(() => {
          removeAnimation(radical);
        }, 1010);
      }
    },

    revealRadical(radical) {
      // No point revealing radical if already uncovered
      if (!radical.isCovered) return;

      radical.coverElement.classList.add("correct");

      setTimeout(() => {
        radical.coverElement.remove();
        radical.isCovered = false;
      }, 1010);
    },

    revealAll() {
      const radicals = state.lesson.radicals;

      for (let index = 0; index < radicals.length; index++) {
        this.revealRadical(radicals[index]);
      }
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Utils and helpers
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function waitForElement(selector, interval = 50) {
    return new Promise((resolve) => {
      const handle = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(handle);
          resolve(element);
        }
      }, interval);
    });
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Styling
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function addStyle() {
    // Add CSS style for current SRS elements
    const cssStyle = `
        .subject-character__cover {
            border-radius: 8px;
            background: var(--color-blue);
            border: 1px solid var(--color-blue-dark);
            position: absolute;
            cursor: pointer;
            z-index: 999999;
            transition:none;
        }
    
        .subject-character__cover.correct {
            opacity: 0;
            transition: opacity 1s linear;
        }        

        @keyframes incorrectAnimation {
            0% { background-color: var(--color-quiz-incorrect-background); }
            20% { background-color: var(--color-quiz-incorrect-background); }
            100% { background-color: var(--color-blue); }
        }

        .subject-character__cover.incorrect {
            animation-name: incorrectAnimation;
            animation-duration: 1s;
        }        

        .radical__input-container {
            margin-bottom: var(--spacing-normal);
            position:relative;
            display:inline-flex;
        }

        .radical__input {
            font-weight: 400;
            line-height: 1.4;
            font-size: 16px;
            text-shadow: 0 1px 0 #fff;
            box-shadow: 3px 3px 0 #e1e1e1;
            padding: 10px;
            border: 2px solid rgba(0,0,0,0);
            background-color: var(--color-quiz-input-background);
            outline: none;
        }

        .radical__input:focus {
            border-color:var(--color-quiz-input-focus)
        }

        .radical__input-submit-button {
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 0px;
            bottom: 10px;
            background: rgba(0,0,0,0);
            border: 0;
            padding: 0 12px;
            font-size: 16px;
            color: inherit;
        }

        .submit-all__container {
            display: inline-block;
        }
    `;
    const styleEl = document.createElement("style");
    styleEl.id = "css_radical-guessr";
    styleEl.textContent = cssStyle;
    document.head.appendChild(styleEl);
  }
})();