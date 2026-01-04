// ==UserScript==
// @name         imgbb download all images (deduped)
// @namespace    https://example.com/
// @version      0.2
// @description  Download all images from imgbb/ibb gallery pages with deduplicated URLs
// @match        https://imgbb.com/*
// @match        https://www.imgbb.com/*
// @match        https://ibb.co/*
// @match        https://www.ibb.co/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/556010/imgbb%20download%20all%20images%20%28deduped%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556010/imgbb%20download%20all%20images%20%28deduped%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Keep track of what we already downloaded (per page load)
  const downloadedUrls = new Set();

  function createButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Download all images (scroll down first!)';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 999999,
      padding: '6px 10px',
      fontSize: '12px',
      background: '#1e88e5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      opacity: '0.9'
    });

    btn.addEventListener('click', handleClick);
    document.body.appendChild(btn);
  }

  function handleClick() {
    const anchors = document.querySelectorAll('a.image-container.--media');
    if (!anchors.length) {
      console.log('No a.image-container.--media found on this page.');
      return;
    }

    const uniqueImages = [];

    anchors.forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;

      const pageUrl = a.href;
      const imgUrl = img.src;

      // Deduplicate by image URL
      if (downloadedUrls.has(imgUrl)) return;
      downloadedUrls.add(imgUrl);

      // Extract page id: https://ibb.co/1GqGrKp -> "1GqGrKp"
      let pageId = '';
      try {
        pageId = (new URL(pageUrl)).pathname.replace(/^\/+|\/+$/g, '');
      } catch (e) {
        pageId = pageUrl;
      }

      // Extract hash and original file name:
      // https://i.ibb.co/23t3vPL/2024-08-16-20-41-11-Bamadoute.png
      let hash = '';
      let originalName = 'image';
      try {
        const imgUrlObj = new URL(imgUrl);
        const pathParts = imgUrlObj.pathname.split('/').filter(Boolean);
        hash = pathParts[0] || '';
        originalName =
          img.alt ||
          pathParts[pathParts.length - 1] ||
          'image';
      } catch (e) {
        originalName = img.alt || 'image';
      }

      // Filename: "[1GqGrKp][23t3vPL]2024-08-16-20-41-11-Bamadoute.png"
      const filename = `[${pageId}][${hash}] ${originalName}`;

      uniqueImages.push({ imgUrl, filename });
    });

    if (!uniqueImages.length) {
      console.log('No new images to download (all already processed).');
      return;
    }

    console.log(`Downloading ${uniqueImages.length} image(s)...`);

    // Kick off downloads
    uniqueImages.forEach(({ imgUrl, filename }, index) => {
      // Small stagger (optional, to avoid hammering)
      setTimeout(() => {
        console.log('Downloading:', imgUrl, 'as', filename);
        GM_download({
          url: imgUrl,
          name: filename,
          saveAs: false
        });
      }, index * 500); // 500 ms between downloads; adjust as you like
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();