// ==UserScript==
// @name        Open archive
// @namespace   Violentmonkey Scripts
// @match       https://wplace.live/*
// @grant       none
// @version     1.1
// @author      nopeee
// @description 11/21/2025, 1:04:55 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556442/Open%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/556442/Open%20archive.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let targetElement = document.querySelector("input[readonly='']");
  let openArchiveButton = null;

  const observer = new MutationObserver((mutations) => {
    const container = targetElement.parentNode;
    if (container) {
      const copyButton = container.querySelector('button.btn-primary');
      if (copyButton && !openArchiveButton) {
        openArchiveButton = document.createElement('button');
        openArchiveButton.textContent = 'Open Archive';
        openArchiveButton.classList.add('btn');
        openArchiveButton.classList.add('btn-primary');
        container.insertBefore(openArchiveButton, copyButton.nextSibling);

        openArchiveButton.addEventListener('click', () => {
          const inputValue = targetElement.value;
          const url = new URL(inputValue);
          const params = new URLSearchParams(url.search);
          const lat = params.get('lat');
          const lng = params.get('lng');
          const zoom = params.get('zoom');
          const archiveUrl = `https://wplace.samuelscheit.com/#lat=${lat}&lng=${lng}&zoom=${zoom}`;
          window.open(archiveUrl, '_blank');
        });
      } else if (copyButton && openArchiveButton) {
        // if button already exists, check if it's still in the correct position
        if (openArchiveButton.parentNode !== container) {
          container.insertBefore(openArchiveButton, copyButton.nextSibling);
        }
      } else if (!copyButton && openArchiveButton) {
        // if copy button is gone, remove open archive button
        openArchiveButton.remove();
        openArchiveButton = null;
      }
    }
  });
  const watcherInterval = setInterval(()=> {
    targetElement = document.querySelector("input[readonly='']");
    if (targetElement) {
      clearInterval(watcherInterval)
        observer.observe(targetElement.parentElement.parentElement, {
    childList: true,
  });
    }
  }, 100)

})();
