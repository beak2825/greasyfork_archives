// ==UserScript==
// @name         Bounty.chat Drag & Drop
// @namespace    bounty-chat-drag-and-drop
// @version      1.1
// @description  Ajoute le drag & drop sur l’upload d’images du site Bounty
// @match        *://bounty.chat/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564027/Bountychat%20Drag%20%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/564027/Bountychat%20Drag%20%20Drop.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let initialized = false;

  function init() {
    if (initialized) return;

    const input = document.getElementById('image-upload');
    if (!input) return;

    initialized = true;
    console.log('[TM DragUpload] activé');

    const dropZone = document.createElement('div');
    Object.assign(dropZone.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1,
      background: 'rgba(0,0,0,0.05)',
      border: '3px dashed #5D3227',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#5D3227'
    });

    dropZone.textContent = 'Déposez votre fichier ici';
    document.body.appendChild(dropZone);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
      document.addEventListener(evt, e => e.preventDefault());
    });

    document.addEventListener('dragenter', () => {
      dropZone.style.display = 'flex';
    });

    document.addEventListener('dragleave', e => {
      if (e.clientX === 0 && e.clientY === 0) {
        dropZone.style.display = 'none';
      }
    });

    dropZone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      if (!files.length) return;

      input.files = files;
      input.dispatchEvent(new Event('change', { bubbles: true }));

      dropZone.style.display = 'none';
    });

    dropZone.addEventListener('click', () => {
      dropZone.style.display = 'none';
    });

  }

  // DOM dynamique → observation légère
  const observer = new MutationObserver(init);
  observer.observe(document.body, { childList: true, subtree: true });

  init();
})();
