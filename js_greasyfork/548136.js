// ==UserScript==
// @name         YouTube Auto-Hide Progress Bar
// @description  Auto-hide YouTube video controls and progress bar while paused. Hover to reveal.
// @namespace    https://github.com/sonnenfell/Hide-YouTube-Progress-Bar
// @version      1.6.2
// @patchnotes   Fixed a bug where the plugin would initially block you from interacting with some video controls before pausing and unpausing the video
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       Sunfur
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548136/YouTube%20Auto-Hide%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/548136/YouTube%20Auto-Hide%20Progress%20Bar.meta.js
// ==/UserScript==
let hoverToggle;
let elements_shown = true;

const setupHoverToggle = () => {
  const player = document.querySelector('.html5-video-player');
  if (!player || hoverToggle) return;

  player.style.position = 'relative';

  hoverToggle = document.createElement('div');
  hoverToggle.style.position = 'absolute';
  hoverToggle.style.left = '0';
  hoverToggle.style.bottom = '0';
  hoverToggle.style.width = '100%';
  hoverToggle.style.height = '0%';
  hoverToggle.style.zIndex = '9998';
  hoverToggle.style.pointerEvents = 'auto';
  hoverToggle.style.background = 'transparent';

  player.appendChild(hoverToggle);
};

const observer = new MutationObserver(() => {
  const video = document.querySelector('video');
  const player = document.querySelector('.html5-video-player');
  const progressBar = document.querySelector('.ytp-progress-bar');
  const controls = document.querySelector('.ytp-chrome-bottom');

  if (!video || !player || !progressBar || !controls) return;

  setupHoverToggle();

  const show_elements = () => {
    progressBar.style.opacity = '1';
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
    // move div above controls area (else it will interfere with controls):
    hoverToggle.style.bottom = '20%';
    hoverToggle.style.height = '20%';

    elements_shown = true;

  };

  const hide_elements = () => {
    progressBar.style.opacity = '0';
    controls.style.opacity = '0';
    controls.style.pointerEvents = 'none';
    // move div to controls area:
    hoverToggle.style.bottom = '0%';
    hoverToggle.style.height = '20%';

    elements_shown = false;
  };

  const release_elements = () => {
    progressBar.style.removeProperty('opacity');
    controls.style.removeProperty('opacity');
    controls.style.removeProperty('pointer-events');
    // move div above controls area:
    hoverToggle.style.bottom = '20%';
    hoverToggle.style.height = '0%';
  };

  // Hover logic
  hoverToggle.onmouseenter = () => {
    if (video.paused) {
      if (elements_shown == false) {show_elements();}
      else if (elements_shown == true) {hide_elements();}
    }
  };

  // Event listeners
  video.addEventListener('pause', () => {
    show_elements();
  });

  video.addEventListener('play', () => {
    release_elements(); // restore defaults when playing
  });
});

observer.observe(document.body, { childList: true, subtree: true });
