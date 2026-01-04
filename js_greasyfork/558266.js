// ==UserScript==
// @name         WaniKani Item SRS Stage Indicator
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Displays the exact item SRS stage (Apprentice IV, Guru I, etc.), both before and after completing a review for the item.
// @author       romans-boi
// @license      MIT
// @match        https://www.wanikani.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558266/WaniKani%20Item%20SRS%20Stage%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/558266/WaniKani%20Item%20SRS%20Stage%20Indicator.meta.js
// ==/UserScript==

// "topStatsBar" for top-right variant
// "underItem" for the under the item variant
// "none" to turn off the current-SRS indicator
const REVIEW_INDICATOR_VARIANT_DEFAULT = "underItem";

(async function () {
  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Constants and other important variables
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================
  const APP_ID = "wk-item-srs-stage-indicator";
  const APP_TITLE = "Item SRS Stage Indicator";
  const WKOF_MODULES = "Menu, Settings";

  const CURRENT_NAMES = [
    "Unlocked",
    "Apprentice",
    "Apprentice",
    "Apprentice",
    "Apprentice",
    "Guru",
    "Guru",
    "Master",
    "Enlightened",
    "Burned",
  ];

  const CORRECTED_NAMES = [
    "Unlocked",
    "Apprentice I",
    "Apprentice II",
    "Apprentice III",
    "Apprentice IV",
    "Guru I",
    "Guru II",
    "Master",
    "Enlightened",
    "Burned",
  ];

  const STAGE_TO_ICON_MAP = new Map([
    ["Apprentice I", "#wk-icon__srs-apprentice1"],
    ["Apprentice II", "#wk-icon__srs-apprentice2"],
    ["Apprentice III", "#wk-icon__srs-apprentice3"],
    ["Apprentice IV", "#wk-icon__srs-apprentice4"],
    ["Guru I", "#wk-icon__srs-guru5"],
    ["Guru II", "#wk-icon__srs-guru6"],
    ["Master", "#wk-icon__srs-master"],
    ["Enlightened", "#wk-icon__srs-enlightened"],
  ]);

  const TEXT_COLOR = new Map([
    ["Radical", "#a1dfff"],
    ["Kanji", "#ffc5ec"],
    ["Vocabulary", "#edcaff"],
  ]);

  const REVIEW_INDICATOR_VARIANTS = {
    none: "No current SRS indicator",
    underItem: "Under the item",
    topStatsBar: "Top-Right Statistics Bar",
  };

  const SUBJECT_IDS_WITH_SRS_TARGET = "subjectIdsWithSRS";

  const state = {
    pageUrl: null,
    settings: {},
    review: {
      subject: {
        id: null,
        type: null,
      },
      currentIndicator: {
        iconHtml: null,
        srsStageName: null,
      },
      queueElement: null,
      clonedQueueElement: null,
    },
    get variantWithDefault() {
      return this.settings.indicatorVariant ?? REVIEW_INDICATOR_VARIANT_DEFAULT;
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Initialising and setting up the script
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  // Optionally including wkof
  if (!window.wkof) {
    console.log(
      "[Item SRS Stage Indicator] If you would like to use Settings to switch between indicator variants, " +
      "please install Wanikani Open Framework. Otherwise, you can modify the default variant in the script directly. " +
      "The default variant is currently for displaying under the item."
    );
  } else {
    wkof.include(WKOF_MODULES);
  }

  window.addEventListener("turbo:load", onTurboLoad);

  function onTurboLoad(event) {
    state.pageUrl = event.detail.url;

    const runApp = () => {
      router();
    };

    if (!window.wkof) {
      runApp();
      return;
    }

    wkof
      .ready(WKOF_MODULES)
      .then(() => wkof.Settings.load(APP_ID))
      .then(() => {
        initWkofSettings();
        runApp();
      });
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Router setup for handling correct page setups
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function router() {
    const { pageUrl } = state;

    if (/subjects\/review/.test(pageUrl)) {
      ReviewPage.init();
    } else {
      // Nothing to be done at the moment
    }
  }

  function onSettingsChangedRouter() {
    const { pageUrl } = state;

    if (/subjects\/review/.test(pageUrl)) {
      SrsIndicator.onSettingsChanged();
    } else {
      // Nothing to be done at the moment
    }
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Review page 'module' which handles setting up the relevant bits for the review page
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const ReviewPage = {
    async init() {
      state.review.queueElement = await waitForElement("#quiz-queue");

      addStyle();

      QueueManager.init();
      SrsIndicator.init();
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Queue Manager 'module' which handles queue manipulation
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const QueueManager = {
    init() {
      const queue = state.review.queueElement;
      const parent = queue.parentElement;

      state.review.clonedQueue = queue.cloneNode(true);
      queue.remove();

      this.replaceSrsStageNames();

      parent.appendChild(state.review.clonedQueue);
    },

    replaceSrsStageNames() {
      // Get the element that holds the SRS names, and replace them with the corrected ones.
      const srsStagesElement = this.getQuizQueueTarget(
        SUBJECT_IDS_WITH_SRS_TARGET
      );
      const srsStagesText = srsStagesElement.textContent;
      const srsStagesCorrectedText = srsStagesText.replaceAll(
        JSON.stringify(CURRENT_NAMES),
        JSON.stringify(CORRECTED_NAMES)
      );
      srsStagesElement.textContent = srsStagesCorrectedText;
    },

    getQuizQueueTarget(target) {
      return state.review.clonedQueue.querySelector(
        `[data-quiz-queue-target="${target}"]`
      );
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // SRS Indicator 'module' which manages the indicator UI and any indicator variant changes
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  const SrsIndicator = {
    init() {
      const variant = state.settings.indicatorVariant;

      this.reset();

      if (variant === "none") {
        return;
      }

      this.onNextQuestion = this.onNextQuestion.bind(this);
      this.onDidChangeSrs = this.onDidChangeSrs.bind(this);

      this.addListeners();
      this.onViewRequested();
    },

    onSettingsChanged() {
      // Currently the same as the init(), but this exists for flexibility
      this.init();
    },

    reset() {
      this.hideSrsContainerItemVariant();
      this.hideSrsContainerTopBarVariant();
      this.removeListeners();
    },

    addListeners() {
      window.addEventListener("didChangeSRS", this.onDidChangeSrs);
      window.addEventListener("willShowNextQuestion", this.onNextQuestion);
    },

    removeListeners() {
      window.removeEventListener("didChangeSRS", this.onDidChangeSrs);
      window.removeEventListener("willShowNextQuestion", this.onNextQuestion);
    },

    onDidChangeSrs() {
      const variant = state.variantWithDefault;
      if (variant == "topStatsBar") {
        // Nothing to be done at the moment.
      } else if (variant == "underItem") {
        this.hideSrsContainerItemVariant();
      }
    },

    onNextQuestion(event) {
      const subjectId = event.detail.subject.id;
      const subjectType = event.detail.subject.subject_category;

      // Get SRS stages config
      const srsStagesJson = JSON.parse(
        QueueManager.getQuizQueueTarget(SUBJECT_IDS_WITH_SRS_TARGET).textContent
      );

      const subjectIdSrsList = srsStagesJson.subject_ids_with_srs_info;

      // The tuple we get for a subject looks like this `[id, index, X]` where X is pointing to which array of SRS names to use within
      // srs_ids_stage_names, but from what I can tell... it doesn't matter? So I just use the local corrected names array for lookup.
      const currentItemSrsIndex = subjectIdSrsList.find(
        (subjectSrsInfo) => subjectSrsInfo[0] == subjectId
      )[1];
      const currentSrsStageName = CORRECTED_NAMES[currentItemSrsIndex];

      const iconHtml = getIconHtmlFor(currentSrsStageName);

      // Update state
      state.review.subject.id = subjectId;
      state.review.subject.type = subjectType;
      state.review.currentIndicator.iconHtml = iconHtml;
      state.review.currentIndicator.srsStageName = currentSrsStageName;

      this.onViewRequested();
    },

    onViewRequested() {
      const variant = state.variantWithDefault;
      if (variant == "topStatsBar") {
        this.onViewRequestedTopBarVariant();
      } else if (variant == "underItem") {
        this.onViewRequestedItemVariant();
      }
    },

    // ------------------------------------------------------------------------------------------
    // SRS indicator - under-the-item variant related code
    // ------------------------------------------------------------------------------------------

    onViewRequestedItemVariant() {
      const textColour = TEXT_COLOR.get(state.review.subject.type);

      const currentSrsContentDiv = document.querySelector(
        `div[class='character-header__current-srs-content']`
      );

      // If doesn't exist, create a new container with the icon and text element, otherwise change icon and text.
      if (!currentSrsContentDiv) {
        this.appendNewSrsContainerItemVariant(textColour);
      } else {
        this.modifyExistingSrsContainerItemVariant(
          currentSrsContentDiv,
          textColour
        );
      }

      this.showSrsContainerItemVariant();
    },

    appendNewSrsContainerItemVariant(textColour) {
      const { iconHtml, srsStageName } = state.review.currentIndicator;

      const container = document.createElement("div");
      container.className = "character-header__current-srs-container";
      container.dataset.hidden = "false";

      const content = document.createElement("div");
      content.className = "character-header__current-srs-content";
      content.style.color = textColour;

      const icon = document.createElement("div");
      icon.className = "character-header__current-srs-icon";
      icon.innerHTML = iconHtml;

      const text = document.createElement("div");
      text.className = "character-header__current-srs-text";
      text.textContent = srsStageName;

      content.appendChild(icon);
      content.appendChild(text);
      container.appendChild(content);

      const characterHeader = document.querySelector(
        `div[class='character-header__content']`
      );

      characterHeader.appendChild(container);
    },

    modifyExistingSrsContainerItemVariant(contentDiv, textColour) {
      const { iconHtml, srsStageName } = state.review.currentIndicator;

      const iconDiv = contentDiv.querySelector(
        `div[class='character-header__current-srs-icon']`
      );
      const textDiv = contentDiv.querySelector(
        `div[class='character-header__current-srs-text']`
      );

      iconDiv.innerHTML = iconHtml;

      textDiv.textContent = srsStageName;
      contentDiv.style.color = textColour;
    },

    showSrsContainerItemVariant() {
      const div = document.querySelector(
        ".character-header__current-srs-container"
      );

      if (div) {
        div.dataset.hidden = "false";
      }
    },

    hideSrsContainerItemVariant() {
      const div = document.querySelector(
        ".character-header__current-srs-container"
      );
      if (div) {
        div.dataset.hidden = "true";
      }
    },

    // ------------------------------------------------------------------------------------------
    // SRS indicator top-bar-menu variant related code
    // ------------------------------------------------------------------------------------------

    onViewRequestedTopBarVariant() {
      const currentSrsContainerDiv = document.querySelector(
        `div[id='top-current-srs-stage-container']`
      );

      if (!currentSrsContainerDiv) {
        this.appendNewSrsContainerTopBarVariant();
      } else {
        this.modifyExistingSrsContainerTopBarVariant(currentSrsContainerDiv);
      }

      this.showSrsContainerTopBarVariant();
    },

    appendNewSrsContainerTopBarVariant() {
      const { iconHtml, srsStageName } = state.review.currentIndicator;

      // Copying the structure and style classes of existing WaniKani statistics header.
      const container = document.createElement("div");
      container.className = "quiz-statistics__item";
      container.id = "top-current-srs-stage-container";

      const content = document.createElement("div");
      content.className = "quiz-statistics__item-count";

      const icon = document.createElement("div");
      icon.className = "quiz-statistics__item-count-icon";
      icon.innerHTML = iconHtml;

      const text = document.createElement("div");
      text.className = "quiz-statistics__item-count-text";
      text.textContent = srsStageName;

      content.appendChild(icon);
      content.appendChild(text);
      container.appendChild(content);

      const statisticsHeader = document.querySelector(
        `div[class='quiz-statistics']`
      );

      statisticsHeader.prepend(container);
    },

    modifyExistingSrsContainerTopBarVariant(containerDiv) {
      const { iconHtml, srsStageName } = state.review.currentIndicator;

      const iconDiv = containerDiv.querySelector(
        `div[class='quiz-statistics__item-count-icon']`
      );
      const textDiv = containerDiv.querySelector(
        `div[class='quiz-statistics__item-count-text']`
      );

      iconDiv.innerHTML = iconHtml;
      textDiv.textContent = srsStageName;
    },

    showSrsContainerTopBarVariant() {
      const div = document.querySelector(
        `div[id='top-current-srs-stage-container']`
      );
      if (div) {
        div.style.display = "inline";
      }
    },

    hideSrsContainerTopBarVariant() {
      const div = document.querySelector(
        `div[id='top-current-srs-stage-container']`
      );
      if (div) {
        div.style.display = "none";
      }
    },
  };

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // WaniKani Open Framework Helpers
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function initWkofSettings() {
    wkof.Menu.insert_script_link({
      name: APP_ID,
      submenu: "Settings",
      title: APP_TITLE,
      on_click: dialogOpen,
    });

    state.settings = wkof.settings[APP_ID];
  }

  function dialogOpen() {
    const dialog = new wkof.Settings({
      script_id: APP_ID,
      title: APP_TITLE,
      on_close: onSettingsChangedRouter,
      content: {
        config: {
          type: "group",
          label: "Configuration",
          content: {
            indicatorVariant: {
              type: "dropdown",
              label: "SRS Stage Indicator Variant",
              default: REVIEW_INDICATOR_VARIANT_DEFAULT,
              hover_tip:
                "Current SRS stage indicator variant you would like to see in reviews.",
              content: REVIEW_INDICATOR_VARIANTS,
            },
          },
        },
      },
    });

    dialog.open();
  }

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

  function getIconHtmlFor(srsStage) {
    const iconRef = STAGE_TO_ICON_MAP.get(srsStage);
    if (!iconRef) return "";

    return `
      <svg class="wk-icon wk-icon--current-srs" viewBox="0 0 512 512" aria-hidden="true">
        <use href="${iconRef}"></use>
      </svg>
    `;
  }

  // ==========================================================================================
  // ------------------------------------------------------------------------------------------
  // Styling
  // ------------------------------------------------------------------------------------------
  // ==========================================================================================

  function addStyle() {
    // Add CSS style for current SRS elements
    const cssStyle = `
            .quiz-statistics__item-count-text {
                white-space: nowrap;
            }

            .character-header__current-srs-container {
                position:absolute;
                bottom:10px;
                left:0;
                width:100%;
                display:flex;
                justify-content:center;
                opacity:0.8;
                pointer-events:none;
                transform:translateY(0);
                transition:none
            }

            .character-header__current-srs-container[data-hidden=true] {
                opacity:0;
                transform:translateY(-10px);
                transition:all .5s ease-in
            }

            .character-header__current-srs-content {
                display:flex;
                align-items:center;
                padding:var(--spacing-xtight);
                font-weight:400;
                line-height:1.4;
                font-size:14px;
                text-shadow:0 1px 0 rgba(0,0,0,.2);
                border-radius:var(--border-radius-tight)
            }

            .character-header__current-srs-icon {
              display:flex;
              margin-right:var(--spacing-xtight)
            }

            @supports(container-type: inline-size) {
                @container (min-width: 768px) {
                    .character-header__current-srs-content {
                        font-size:18px
                    }
                }
            }

            @supports not (container-type: inline-size) {
                @media only screen and (min-width: 768px) {
                    .character-header__current-srs-content {
                        font-size:18px
                    }
                }
            }

            .character-header__current-srs-container .character-header__current-srs-content {
                background-color: rgba(65, 65, 65, 1);
            }
        `;
    const styleEl = document.createElement("style");
    styleEl.id = "css_current-srs";
    styleEl.textContent = cssStyle;
    document.head.appendChild(styleEl);
  }
})();