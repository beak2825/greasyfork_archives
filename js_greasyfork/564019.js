// ==UserScript==
// @name         Imaglr Scale Content to Screen
// @namespace    https://imaglr.com/
// @version      1.3
// @license      Public Domain
// @description  Scale videos and images on Imaglr to fit on one screen
// @author       Literally ChatGPT
// @match        https://imaglr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imaglr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564019/Imaglr%20Scale%20Content%20to%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/564019/Imaglr%20Scale%20Content%20to%20Screen.meta.js
// ==/UserScript==

const MAX_VH = 0.9;

function clampMedia(el) {
  // Reset width so we can measure correctly
  el.style.width = '100%';
  el.style.maxWidth = '100%';

  const rect = el.getBoundingClientRect();
  const maxHeightPx = window.innerHeight * MAX_VH;

  if (rect.height > maxHeightPx) {
    const scale = maxHeightPx / rect.height;
    const newWidth = rect.width * scale;
    el.style.width = `${newWidth}px`;
  }

  // Horizontal centering
  el.style.display = 'block';
  el.style.marginLeft = 'auto';
  el.style.marginRight = 'auto';
}

function centerContainers() {
  document.querySelectorAll('.vertical-media-item').forEach(el => {
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
  });
}

function processAll() {
  const media = document.querySelectorAll('img.w-full, video.w-full, .media-item');
  media.forEach(clampMedia);
  centerContainers();
}

// Initial pass
processAll();

// Re-run on window resize
window.addEventListener('resize', processAll);

// Robust MutationObserver (watch everything in body)
const observer = new MutationObserver(processAll);
observer.observe(document.body, { childList: true, subtree: true });

// Extra fallback: periodically process new posts in case the observer misses something
setInterval(processAll, 1000); // every 1 second