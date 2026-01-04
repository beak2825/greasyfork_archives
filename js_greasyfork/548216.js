// ==UserScript==
// @name         YouTube Auto High Quality
// @namespace    https://www.youtube.com
// @license      GPL-3.0
// @version      1.0.0
// @description  Auto select the highest quality on YouTube (incl. Premium, if applicable)
// @author       CJMAXiK
// @license      GPL-3.0
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @website      https://gist.github.com/cjmaxik/889bdc983f95d1b589464a655e0ce5bf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548216/YouTube%20Auto%20High%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/548216/YouTube%20Auto%20High%20Quality.meta.js
// ==/UserScript==

// Partially ported from the Chrome extention by Avi
// Code: https://github.com/avi12/youtube-auto-hd
// Avi: https://avi12.com/

const SELECTORS = {
  title: "title",
  video: "video",
  buttonSettings: ".ytp-settings-button",
  sizeToggle: ".ytp-size-button#original-size, .ytp-size-button",
  optionQuality: ".ytp-settings-menu[data-layer] .ytp-menuitem:last-child",
  menuOption: ".ytp-settings-menu[data-layer] .ytp-menuitem",
  menuOptionContent: ".ytp-menuitem-content",
  panelHeaderBack: ".ytp-panel-header button",
  player: ".html5-video-player:not(#inline-preview-player)",
  donationInjectParent: "ytd-comments",
  // Premium
  labelPremium: ".ytp-premium-label",
};

const OBSERVER_OPTIONS = {
  childList: true,
  subtree: true,
};

const SUFFIX_EBR = "ebr";

let qualityChanged = false;

function isElementVisible(element) {
  return element?.offsetWidth > 0 && element?.offsetHeight > 0;
}

async function getCurrentQualityElements() {
  const elPlayer = await waitElement(SELECTORS.player);
  const elMenuOptions = [...elPlayer.querySelectorAll(SELECTORS.menuOption)];
  return elMenuOptions.filter(getIsQualityElement);
}

function convertQualityToNumber(elQuality) {
  const isPremiumQuality = Boolean(
    elQuality.querySelector(SELECTORS.labelPremium)
  );
  const qualityNumber = parseInt(elQuality.textContent.substring(0, 4));

  if (isPremiumQuality) {
    return qualityNumber + SUFFIX_EBR;
  }

  return qualityNumber;
}

async function getAvailableQualities() {
  const elQualities = await getCurrentQualityElements();
  const qualities = elQualities.map(convertQualityToNumber);
  return qualities;
}

function getPlayerDiv(elVideo) {
  const elPlayer = elVideo.closest(SELECTORS.player);
  if (!elPlayer) {
    console.warn(
      "Player div not found. Is the video element correct?",
      elVideo,
      elVideo.parentElement
    );
  }
  return elPlayer;
}

function getIsQualityElement(element) {
  const isQuality = Boolean(element.textContent.match(/\d/));
  const isHasChildren = element.children.length > 1;
  return isQuality && !isHasChildren;
}

async function getIsSettingsMenuOpen() {
  const elButtonSettings = await waitElement(SELECTORS.buttonSettings);
  return elButtonSettings?.ariaExpanded === "true";
}

function getIsLastOptionQuality(elVideo) {
  const elOptionInSettings = getPlayerDiv(elVideo).querySelector(
    SELECTORS.optionQuality
  );

  if (!elOptionInSettings) {
    return false;
  }

  const elQualityName = elOptionInSettings.querySelector(
    SELECTORS.menuOptionContent
  );

  // If the video is a channel trailer, the last option is initially the speed one,
  // and the speed setting can only be a single digit
  const matchNumber = elQualityName?.textContent?.match(/\d+/);

  if (!matchNumber) {
    return false;
  }

  const numberString = matchNumber[0];
  const minQualityCharLength = 3; // e.g. 3 characters in 720p

  return numberString.length >= minQualityCharLength;
}

async function changeQualityAndClose(elVideo, elPlayer) {
  await changeQualityWhenPossible(elVideo);
  await closeMenu(elPlayer);

  qualityChanged = true;
}

async function changeQualityWhenPossible(elVideo) {
  console.log("Trying...");
  openQualityMenu(elVideo);
  await changeQuality();
}

async function changeQuality() {
  const elQualities = await getCurrentQualityElements();
  const qualitiesAvailable = await getAvailableQualities();
  const applyQuality = (iQuality) => {
    const quality = qualitiesAvailable[iQuality];
    console.log(`Setting up the ${quality}`);
    elQualities[iQuality]?.click();
  };

  const isQualityPreferredEBR = qualitiesAvailable[0]
    .toString()
    .endsWith(SUFFIX_EBR);
  if (isQualityPreferredEBR) {
    applyQuality(0);
    return;
  }

  const iQualityFallback = qualitiesAvailable.findIndex(
    (quality) => !quality.toString().endsWith(SUFFIX_EBR)
  );
  applyQuality(iQualityFallback);
}

async function closeMenu(elPlayer) {
  const clickPanelBackIfPossible = () => {
    const elPanelHeaderBack = elPlayer.querySelector(SELECTORS.panelHeaderBack);
    if (elPanelHeaderBack) {
      elPanelHeaderBack.click();
      return true;
    }
    return false;
  };

  if (clickPanelBackIfPossible()) {
    return;
  }

  const observer = new MutationObserver((_, observer) => {
    if (clickPanelBackIfPossible()) {
      observer.disconnect();
    }
  });
  observer.observe(elPlayer, OBSERVER_OPTIONS);
}

async function openQualityMenu(elVideo) {
  const elSettingQuality = getPlayerDiv(elVideo).querySelector(
    SELECTORS.optionQuality
  );
  elSettingQuality.click();
}

function waitElement(selector) {
  return new Promise((resolve) => {
    let element = [...document.querySelectorAll(selector)].find(
      isElementVisible
    );

    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver((mutations) => {
      let element = [...document.querySelectorAll(selector)].find(
        isElementVisible
      );

      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, OBSERVER_OPTIONS);
  });
}

async function setEventListeners(event) {
  if (qualityChanged) return;

  const elVideo = document.querySelector(SELECTORS.video);
  if (!elVideo) {
    console.error("Auto HD: Video element was not found.");
    return;
  }

  const elPlayer = getPlayerDiv(elVideo);
  if (!elPlayer) {
    console.error("Auto HD: Player div was not found.");
    return;
  }

  const elSettings = elPlayer.querySelector(SELECTORS.buttonSettings);
  if (!elSettings) {
    console.error("Auto HD: Settings button was not found.");
    return;
  }

  const isSettingsMenuOpen = await getIsSettingsMenuOpen();
  if (!isSettingsMenuOpen) {
    elSettings.click();
  }
  elSettings.click();

  await changeQualityAndClose(elVideo, elPlayer);
  elPlayer.querySelector(SELECTORS.buttonSettings).blur();
}

(function () {
  "use strict";
  window.addEventListener(
    "yt-navigate-start",
    () => (qualityChanged = false),
    true
  );
  window.addEventListener("yt-navigate-finish", setEventListeners, true);

  setEventListeners();
})();

// document.addEventListener("yt-navigate-start", function () {
//   console.log("document.yt-navigate-start", arguments);
// });
// document.addEventListener("yt-navigate-finish", function () {
//   console.log("document.yt-navigate-finish", arguments);
// });
// document.addEventListener("yt-navigate-error", function () {
//   console.log("document.yt-navigate-error", arguments);
// });
// document.addEventListener("yt-navigate-redirect", function () {
//   console.log("document.yt-navigate-redirect", arguments);
// });
// document.addEventListener("yt-navigate-cache", function () {
//   console.log("document.yt-navigate-cache", arguments);
// });
// document.addEventListener("yt-navigate-action", function () {
//   console.log("document.yt-navigate-action", arguments);
// });
// document.addEventListener("yt-navigate-home-action", function () {
//   console.log("document.yt-navigate-home-action", arguments);
// });
// document.addEventListener("yt-page-data-fetched", function () {
//   console.log("document.yt-page-data-fetched", arguments);
// });
