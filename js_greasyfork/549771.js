// ==UserScript==
// @name        2048 Gallery
// @namespace   Distinct-Doubt-4875s Scripts
// @match       https://*.2048create.com/*
// @match       https://yborsk.github.io/buildyourown2048/*
// @grant       none
// @version     1.0.2
// @license     MIT
// @description Makes the 2048 game show a gallery of embedded images with hover preview to the side which unlocks as you progress in the game.
// @downloadURL https://update.greasyfork.org/scripts/549771/2048%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/549771/2048%20Gallery.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

// ----------------------------------------------------------------------------------
/* Licenses:

Lock SVG by Orchid from https://www.svgrepo.com/svg/509149/lock
Licensed under MIT: https://www.svgrepo.com/page/licensing/#MIT

Copyright 2025 Orchid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
// ----------------------------------------------------------------------------------

(() => {
  'use strict';

  const $ = window.jQuery;

  // --- Constants ---
  const UNLOCK_VALUES = [2,4,8,16,32,64,128,256,512,1024,2048]; // tiles needed to unlock images
  const REFRESH_INTERVAL = 500; // ms

  // --- DOM references ---
  const $game = $(".game-container");
  const $shareForm = $("#share-form");

  if (!$game.length || !$shareForm.length) {
    alert("Game or share form not found. Script most likely out of date.");
    return;
  }

  // --- Panels ---
  const $leftPanel = $('<div class="vm-side-panel"></div>');
  const $rightPanel = $('<div class="vm-side-panel"></div>');
  const $bottomPanel = $('<div class="vm-side-panel vm-bottom-panel"></div>');

  const $wrapper = $('<div class="vm-wrapper"></div>');
  $game.before($wrapper);
  $wrapper.append($leftPanel, $game, $rightPanel);
  $wrapper.after($bottomPanel);

  $game.css({
    flexShrink: 0,
    width: $game.outerWidth() + 'px'
  });

  $wrapper.css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    width: '100%'
  });

  // --- Inject CSS ---
  $("<style>").text(`
    .vm-side-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 120px;
      flex-shrink: 0;
      gap: 10px;
    }
    .vm-bottom-panel {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
    .vm-side-panel img {
      width: 100%;
      height: auto;
      border: 2px solid #ccc;
      border-radius: 2px;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
      color: #fff;
      transition: opacity 0.3s, border-color 0.3s;
    }
    .vm-side-panel img.unlocked {
      border-color: gold;
      opacity: 1;
    }
  `).appendTo('head');

  // --- Hover preview ---
  const $preview = $('<div id="vm-image-preview"></div>').appendTo('body');
  const $previewImg = $('<img>').appendTo($preview);

  $preview.css({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    display: 'none',
    maxWidth: '90vw',
    maxHeight: '90vh',
    pointerEvents: 'none'
  });

  $previewImg.css({
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    border: '4px solid #fff',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
  });

  // --- Game state helpers ---
  const getGameState = () => {
    try {
      return JSON.parse(localStorage.getItem('gameState'));
    } catch {
      return null;
    }
  };

  const maxTileReached = () => {
    const state = getGameState();
    if (!state?.grid) return 0;
    const values = state.grid.cells.flat().filter(c => c)?.map(c => c.value);
    return values.length ? Math.max(...values) : 0;
  };

  const isUnlocked = index => {
    if (index === 0) return true; // first image always unlocked
    return maxTileReached() >= UNLOCK_VALUES[index - 1];
  };

  const getImageUrls = () => $shareForm.find("input").map((_, el) => el.value).get();

  // --- Render panel ---
  const renderPanel = ($panel, urls, startIndex = 0, matchGameSize = false) => {
    $panel.empty();
    urls.forEach((src, i) => {
      const idx = i + startIndex;
      const unlocked = isUnlocked(idx);

      if (unlocked) {
        const $img = $('<img>').attr('src', src).addClass('unlocked');
        if (matchGameSize) {
        $img.css({
          width: $game.outerWidth() + 'px',
          height: $game.outerHeight() + 'px',
          objectFit: 'cover'
        });
      }
        $panel.append($img);
      } else {
        // Locked box
        const $box = $('<div></div>').css({
          width: '100%',
          height: matchGameSize ? $game.outerHeight() + 'px' : '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#888',
          border: '2px solid #ccc',
          borderRadius: '2px',
          color: '#ccc',
          fontSize: matchGameSize ? '2em' : '1em'
        });

        const lockSVG = `
        <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 12h-1v-3.816c0-4.589-3.32-8.184-8.037-8.184-4.736 0-7.963 3.671-7.963 8.184v3.816h-1c-2.206 0-4 1.794-4 4v12c0 2.206 1.794 4 4 4h18c2.206 0 4-1.794 4-4v-12c0-2.206-1.794-4-4-4zM10 8.184c0-3.409 2.33-6.184 5.963-6.184 3.596 0 6.037 2.716 6.037 6.184v3.816h-12v-3.816zM27 28c0 1.102-0.898 2-2 2h-18c-1.103 0-2-0.898-2-2v-12c0-1.102 0.897-2 2-2h18c1.102 0 2 0.898 2 2v12zM16 18c-1.104 0-2 0.895-2 2 0 0.738 0.405 1.376 1 1.723v3.277c0 0.552 0.448 1 1 1s1-0.448 1-1v-3.277c0.595-0.346 1-0.985 1-1.723 0-1.105-0.895-2-2-2z"></path>
        </svg>
        `;
        const $lock = $(lockSVG).css({
          width: matchGameSize ? ($game.outerWidth() * 0.25) + 'px' : '40px',
          height: 'auto',
          marginBottom: '5px',
          color: 'currentColor'
        });

        const unlockNumber = idx === 0 ? UNLOCK_VALUES[0] : UNLOCK_VALUES[idx - 1];
        const $text = $('<div></div>').text(unlockNumber).css({
          fontSize: matchGameSize ? '2em' : '1em'
        });

        $box.append($lock, $text);
        $panel.append($box);
      }
    });
  };

  // --- Bind hover preview ---
  const bindHoverPreview = () => {
    $('.vm-side-panel:not(.vm-bottom-panel) img.unlocked')
      .off('mouseenter mouseleave')
      .hover(
        function() {
          $previewImg.attr('src', $(this).attr('src'));
          $preview.fadeIn(150);
        },
        function() {
          $preview.fadeOut(150);
        }
      );
  };

  // --- Render all panels ---
  const renderImages = () => {
    const urls = getImageUrls();
    renderPanel($leftPanel, urls.slice(1,6), 1);
    renderPanel($rightPanel, urls.slice(6,11), 6);
    $bottomPanel.css({ width: $game.outerWidth() + 'px' });
    renderPanel($bottomPanel, urls.slice(11,12), 11, true);
    bindHoverPreview();
  };

  renderImages();

  // --- Watch for input changes ---
  const observer = new MutationObserver(renderImages);
  observer.observe($shareForm[0], { childList: true, subtree: true, attributes: true, characterData: true });
  $shareForm.on('input change', 'input', renderImages);

  // --- Watch for game state updates ---
  let lastState = localStorage.getItem('gameState');
  setInterval(() => {
    const current = localStorage.getItem('gameState');
    if (current !== lastState) {
      lastState = current;
      renderImages();
    }
  }, REFRESH_INTERVAL);
})();
