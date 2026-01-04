// ==UserScript==
// @name         nhentai Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button under each manga on nhentai.net
// @author       You
// @match        https://nhentai.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548577/nhentai%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548577/nhentai%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Select all manga thumbnail containers
const mangaContainers = document.querySelectorAll('.gallery a.cover');

mangaContainers.forEach(container => {
  // Get the manga ID from the href (e.g., /g/591353/)
  const href = container.getAttribute('href');
  const mangaId = href.match(/\/g\/(\d+)/)[1]; // Extract the ID (e.g., 591353)

  // Create download button
  const downloadButton = document.createElement('a');
  downloadButton.href = `https://nhentai.net/g/${mangaId}/download`;
  downloadButton.textContent = 'Download';
  downloadButton.style.display = 'block';
  downloadButton.style.textAlign = 'center';
  downloadButton.style.marginTop = '5px';
  downloadButton.style.padding = '5px';
  downloadButton.style.backgroundColor = '#ff4d4d';
  downloadButton.style.color = '#fff';
  downloadButton.style.textDecoration = 'none';
  downloadButton.style.borderRadius = '3px';

  // Append button below the manga thumbnail
  container.parentElement.appendChild(downloadButton);
});
})();