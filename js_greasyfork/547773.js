// ==UserScript==
// @name         ShortsBlock
// @version      1.1.2
// @description  Simple browser extension that allows you to hide Shorts on a YouTube
// @author       artemgassan
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1510082
// @downloadURL https://update.greasyfork.org/scripts/547838/ShortsBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/547838/ShortsBlock.meta.js
// ==/UserScript==

const KEYWORD = 'shorts';

const SELECTORS = {
  chips: [
    'yt-chip-cloud-chip-renderer',
    'ytd-chip-cloud-chip-renderer',
    'button.ytChipShapeButtonReset',
    'chip-shape'
  ],
  links: [
    'a[title]',
    'a[aria-label]'
  ],
  tabs: [
    '[role="tab"]'
  ],
  videos: [
    'ytd-video-renderer'
  ],
  sections: [
    'ytd-rich-section-renderer',
    'grid-shelf-view-model',
    'ytd-reel-shelf-renderer'
  ]
};

const CANDIDATE_SELECTORS = [
  ...SELECTORS.chips,
  ...SELECTORS.links,
  ...SELECTORS.tabs,
  ...SELECTORS.videos
].join(',');

const CONTAINER_SELECTORS = [
  ...SELECTORS.chips,
  ...SELECTORS.tabs
].join(',');

const SECTION_SELECTORS = SELECTORS.sections.join(',');

function hideShorts() {
  const candidates = document.querySelectorAll(CANDIDATE_SELECTORS);
  for (const node of candidates) {
    const text = (node.textContent || '').trim().toLowerCase();
    if (text.includes(KEYWORD)) {
      const chipContainer = node.closest(CONTAINER_SELECTORS) || node;
      if (chipContainer) {
        chipContainer.style.display = 'none';
      }
    }
  }

  const sections = document.querySelectorAll(SECTION_SELECTORS);
  for (const element of sections) {
    element.style.display = 'none';
  }
}

hideShorts();

const observer = new MutationObserver(hideShorts);
observer.observe(document.body, { childList: true, subtree: true });
