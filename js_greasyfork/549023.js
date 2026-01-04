// ==UserScript==
// @name         YouTube Auto Redirect & Theater Mode + Sub Count + UnShort Shorts + Time Remaining
// @version      4.0
// @description  Redirect channel root/featured to /videos, auto-enable theater mode, show subscription count, redirect Shorts to full watch view, and display remaining video time
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/1513610
// @downloadURL https://update.greasyfork.org/scripts/549023/YouTube%20Auto%20Redirect%20%20Theater%20Mode%20%2B%20Sub%20Count%20%2B%20UnShort%20Shorts%20%2B%20Time%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/549023/YouTube%20Auto%20Redirect%20%20Theater%20Mode%20%2B%20Sub%20Count%20%2B%20UnShort%20Shorts%20%2B%20Time%20Remaining.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ======================
  // CONFIGURATION
  // ======================
  const DEFAULT_CONFIG = {
    theaterMode: false,
    showSubCount: true,
    showTimeRemaining: true,
    scrollDelay: 1200,
    maxScrollAttempts: 50,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches,
    bannerStyle: {
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '12px',
      color: '#fff',
      background: 'rgba(204, 0, 0, 0.9)',
      margin: '10px 0',
      borderRadius: '8px',
      textAlign: 'center',
      zIndex: '1000',
      position: 'relative',
    },
  };
  let config =
    JSON.parse(localStorage.getItem('ytScriptConfig')) || DEFAULT_CONFIG;
  const channelRegex =
    /^https:\/\/www\.youtube\.com\/@[\w.-]+(?:\/featured)?\/?$/;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // ======================
  // FEATURE: SHORTS REDIRECT
  // ======================
  function redirectShorts(url) {
    if (url.includes('/shorts/')) {
      const videoId = url.split('/shorts/').pop().split(/[?&]/)[0];
      if (videoId) {
        location.replace(`https://www.youtube.com/watch?v=${videoId}`);
      }
    }
  }

  // ======================
  // FEATURE: THEATER MODE
  // ======================
  function enableTheater() {
    if (
      !config.theaterMode ||
      document.querySelector('ytd-watch-flexy[theater]')
    )
      return;
    try {
      const theaterButton = document.querySelector('button.ytp-size-button');
      if (theaterButton) {
        theaterButton.click();
        console.log('✅ Theater mode enabled.');
      }
    } catch (error) {
      console.error('⚠️ Failed to enable theater mode:', error);
    }
  }

  // ======================
  // FEATURE: REVERT DUBBED AUDIO
  // ======================
  async function revertToOriginalAudio() {
    try {
      const settingsButton = document.querySelector(
        'button.ytp-settings-button'
      );
      if (!settingsButton) return;

      settingsButton.click();
      await sleep(200);

      const menuItems = document.querySelectorAll('.ytp-menuitem-label');
      const audioTrackButton = Array.from(menuItems).find(el =>
        el.innerText.includes('Audio track')
      );

      if (!audioTrackButton) {
        return settingsButton.click();
      }

      audioTrackButton.click();
      await sleep(200);

      const audioOptions = document.querySelectorAll('.ytp-menuitem-label');
      const originalOption = Array.from(audioOptions).find(el =>
        el.innerText.toLowerCase().includes('(original)')
      );

      if (
        originalOption &&
        !originalOption.closest('.ytp-menuitem[aria-checked="true"]')
      ) {
        originalOption.click();
        console.log('✅ Audio reverted to original track.');
      } else {
        if (document.querySelector('.ytp-panel-menu')) settingsButton.click();
      }
    } catch (error) {
      console.error('⚠️ Audio revert failed:', error);
      if (document.querySelector('.ytp-panel-menu'))
        document.querySelector('button.ytp-settings-button')?.click();
    }
  }

  // ======================
  // FEATURE: COUNT SUBSCRIPTIONS
  // ======================
  async function countSubscriptions() {
    const bannerCss = Object.entries(config.bannerStyle)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
      .join(';');
    const tempBanner = document.createElement('div');
    tempBanner.id = 'sub-count-loading';
    tempBanner.textContent = '⏳ Loading all channels, please wait...';
    tempBanner.style.cssText = bannerCss;
    const container =
      document.querySelector('ytd-section-list-renderer, ytd-browse') ||
      document.body;
    container.prepend(tempBanner);

    let lastHeight = 0;
    for (let i = 0; i < config.maxScrollAttempts; i++) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await sleep(config.scrollDelay);
      if (document.documentElement.scrollHeight === lastHeight) break;
      lastHeight = document.documentElement.scrollHeight;
    }

    tempBanner.remove();
    const channels = document.querySelectorAll(
      'ytd-channel-renderer, ytd-grid-channel-renderer'
    );
    updateBanners(channels.length, bannerCss, container);

    await sleep(100);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: config.reducedMotion ? 'auto' : 'smooth',
    });
  }

  function updateBanners(count, bannerCss, container) {
    const createOrUpdate = (id, prepend = false) => {
      let banner = document.getElementById(id);
      if (!banner) {
        banner = document.createElement('div');
        banner.id = id;
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-live', 'polite');
        container[prepend ? 'prepend' : 'append'](banner);
      }
      banner.style.cssText = bannerCss;
      banner.textContent = `📺 Subscribed Channels: ${count}`;
    };
    createOrUpdate('sub-count-top', true);
    createOrUpdate('sub-count-bottom');
  }

  // ======================
  // FEATURE: TIME REMAINING (FIXED)
  // ======================
  let timeRemainingInterval = null;

  function timeToSeconds(timeString) {
    const parts = timeString.split(':');
    let seconds = 0;
    for (let i = 0; i < parts.length; i++) {
      seconds = seconds * 60 + parseInt(parts[i], 10);
    }
    return seconds;
  }

  function secondsToTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ];

    return parts.join(':');
  }

  function calculateRemaining(currentTime, totalTime) {
    if (!totalTime) return 'Not initialized';
    const remainingSeconds =
      timeToSeconds(totalTime) - timeToSeconds(currentTime);
    return secondsToTime(remainingSeconds);
  }

  function updateTimeDisplay() {
    const currentTimeElement = document.querySelector('.ytp-time-current');
    const durationElement = document.querySelector('.ytp-time-duration');

    if (!currentTimeElement || !durationElement) return;

    // Get or set the original duration FIRST, before any modifications
    let originalDuration = durationElement.getAttribute(
      'data-original-duration'
    );
    if (!originalDuration) {
      // Store the ORIGINAL unmodified duration
      originalDuration = durationElement.textContent;
      durationElement.setAttribute('data-original-duration', originalDuration);
    }

    const currentTime = currentTimeElement.textContent;
    const remaining = calculateRemaining(currentTime, originalDuration);

    // Now modify the display
    durationElement.textContent = `${originalDuration} => ${remaining}`;
  }

  function startTimeRemaining() {
    if (!config.showTimeRemaining) return;

    stopTimeRemaining();

    setTimeout(() => {
      // Clear the data attribute on new video to force re-initialization
      const durationElement = document.querySelector('.ytp-time-duration');
      if (durationElement) {
        durationElement.removeAttribute('data-original-duration');
      }

      updateTimeDisplay();
      timeRemainingInterval = setInterval(updateTimeDisplay, 500);
      console.log('✅ Time remaining display started.');
    }, 2000);
  }

  function stopTimeRemaining() {
    if (timeRemainingInterval) {
      clearInterval(timeRemainingInterval);
      timeRemainingInterval = null;

      // Clear the modified display when stopping
      const durationElement = document.querySelector('.ytp-time-duration');
      if (durationElement) {
        const originalDuration = durationElement.getAttribute(
          'data-original-duration'
        );
        if (originalDuration) {
          durationElement.textContent = originalDuration;
        }
        durationElement.removeAttribute('data-original-duration');
      }

      console.log('🛑 Time remaining display stopped.');
    }
  }

  // ======================
  // URL AND NAVIGATION HANDLER
  // ======================
  function handleUrl(url) {
    // Always stop time remaining when navigating
    stopTimeRemaining();

    if (url.includes('/shorts/')) {
      redirectShorts(url);
    } else if (channelRegex.test(url)) {
      location.replace(`${url.replace(/\/featured\/?$|$/, '')}/videos`);
    } else if (url.includes('/watch')) {
      setTimeout(() => {
        enableTheater();
        revertToOriginalAudio();
        startTimeRemaining(); // Start time remaining for watch pages
      }, 1000);
    } else if (url.includes('/feed/channels') && config.showSubCount) {
      countSubscriptions().catch(e =>
        console.error('⚠️ Subscription count failed:', e)
      );
    }
  }

  // Use YouTube's custom navigation event for SPAs
  window.addEventListener('yt-navigate-finish', () => {
    handleUrl(location.href);
    const scrollPos = sessionStorage.getItem('ytScrollPos');
    if (scrollPos && location.href.includes('/feed/channels')) {
      window.scrollTo(0, parseInt(scrollPos, 10));
    }
  });

  // Handle initial page load
  handleUrl(location.href);

  // Persist scroll position within the session
  window.addEventListener(
    'scroll',
    () => sessionStorage.setItem('ytScrollPos', window.scrollY),
    { passive: true }
  );

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopTimeRemaining();
  });
})();
