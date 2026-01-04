// ==UserScript==
// @name         VG Thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Show thumbnails in ViperGirls thread listings
// @author       derux; based on the original script by metafox12345
// @match        https://viper.to/search.php?searchid=*
// @match        https://viper.to/forumdisplay.php?f=*
// @match        https://viper.to/forums/*/page*?prefixid=*
// @match        https://viper.to/forums/*
// @match        https://vipergirls.to/search.php?searchid=*
// @match        https://vipergirls.to/forumdisplay.php?f=*
// @match        https://vipergirls.to/forums/*/page*?prefixid=*
// @match        https://vipergirls.to/forums/*
// @match        https://planetviper.club/search.php?searchid=*
// @match        https://planetviper.club/forumdisplay.php?f=*
// @match        https://planetviper.club/forums/*/page*?prefixid=*
// @match        https://planetviper.club/forums/*
// @match        https://viperbb.rocks/search.php?searchid=*
// @match        https://viperbb.rocks/forumdisplay.php?f=*
// @match        https://viperbb.rocks/forums/*/page*?prefixid=*
// @match        https://viperbb.rocks/forums/*
// @match        https://viperkats.eu/search.php?searchid=*
// @match        https://viperkats.eu/forumdisplay.php?f=*
// @match        https://viperkats.eu/forums/*/page*?prefixid=*
// @match        https://viperkats.eu/forums/*
// @match        https://viperohilia.art/search.php?searchid=*
// @match        https://viperohilia.art/forumdisplay.php?f=*
// @match        https://viperohilia.art/forums/*/page*?prefixid=*
// @match        https://viperohilia.art/forums/*
// @match        https://viperproxy.org/search.php?searchid=*
// @match        https://viperproxy.org/forumdisplay.php?f=*
// @match        https://viperproxy.org/forums/*/page*?prefixid=*
// @match        https://viperproxy.org/forums/*
// @match        https://vipervault.link/search.php?searchid=*
// @match        https://vipervault.link/forumdisplay.php?f=*
// @match        https://vipervault.link/forums/*/page*?prefixid=*
// @match        https://vipervault.link/forums/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552240/VG%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/552240/VG%20Thumbnails.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $$ = document.querySelectorAll.bind(document);

  function addStyles() {
    const css = document.createElement('style');
    css.innerHTML = `
    .vg-preview-section {
      background: #eee;
      display: flex;
      align-items: flex-start;
      width: 100%;
      justify-content: center;
      padding: 16px 0;
      flex-wrap: wrap;
      gap: 8px;
    }

    .vg-preview-section img {
      max-width: 240px;
      max-height: 240px;
      box-shadow: 0 0 5px 0px #adadad;
    }
    `;
    document.head.appendChild(css);
  }

  function happy() {
    addStyles();

    // Find all thread links with data-images attribute
    const anchors = $$('a.title[data-images]');

    if (anchors === null || anchors.length === 0) {
      return;
    }

    for (const anchor of anchors) {
      // Get the JSON array from data-images attribute
      const dataImages = anchor.getAttribute('data-images');

      if (!dataImages) {
        continue;
      }

      // Parse the JSON array of image URLs
      let thumbUrls;
      try {
        thumbUrls = JSON.parse(dataImages);
      } catch (e) {
        console.error('Failed to parse data-images:', e);
        continue;
      }

      if (!thumbUrls || thumbUrls.length === 0) {
        continue;
      }

      // Find the parent element to append the preview section
      // Go up to find the list item or appropriate parent
      let thread = anchor.closest('li');
      if (!thread) {
        thread = anchor.parentElement;
      }

      if (!thread) {
        continue;
      }

      // Check if we already added previews to this thread
      if (thread.querySelector('.vg-preview-section')) {
        continue;
      }

      // Disable the tooltip on this anchor since we're showing thumbnails inline
      if (anchor._tippy) {
        anchor._tippy.destroy();
      }
      anchor.removeAttribute('data-images');
      anchor.classList.remove('thread-preview');

      // Generate the preview section for the thread
      const thumbsPreview = document.createElement('div');
      thumbsPreview.className = "vg-preview-section";

      for (const thumbUrl of thumbUrls) {
        // preview > a > img
        const thumb = document.createElement('img');
        thumb.src = thumbUrl;

        const thumbAnchor = document.createElement('a');
        thumbAnchor.href = thumbUrl;
        thumbAnchor.target = "_blank";

        thumbAnchor.appendChild(thumb);
        thumbsPreview.appendChild(thumbAnchor);
      }

      thread.appendChild(thumbsPreview);
    }
  }

  happy();
})();