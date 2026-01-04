// ==UserScript==
// @name         Torn Drug Cooldown v2
// @namespace    https://greasyfork.org/users/blacksmithop
// @version      1.4
// @description  Colored coded drug cooldown indicator in newsfeed. Credits: FLC for original version
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554613/Torn%20Drug%20Cooldown%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/554613/Torn%20Drug%20Cooldown%20v2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BANNER_ID      = 'drugCooldownInHeader';
  const CHECK_INTERVAL = 1000;
  const FLASH_INTERVAL = 30000;   // Total cycle
  const FLASH_DURATION = 5000;    // Visible time
  const RIGHT_PADDING  = '12px';

  let banner = null;
  let flashTimeout = null;
  let isOnCooldown = false;

  // -------------------------------------------------
  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) return resolve(document.querySelector(selector));
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // -------------------------------------------------
  function ensureBanner() {
    if (banner) return banner;
    banner = document.getElementById(BANNER_ID);
    if (!banner) {
      banner = document.createElement('span');
      banner.id = BANNER_ID;
      Object.assign(banner.style, {
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: 'bold',
        marginLeft: '8px',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        paddingRight: '0'
      });
    }
    return banner;
  }

  // -------------------------------------------------
  function parseCooldownTime(text) {
    const match = text.match(/(\d+)\s+(\d+)/);
    if (!match) return null;
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    return minutes * 60 + seconds;
  }

  function getDrugName(text) {
    const lower = text.toLowerCase();
    if (lower.includes('xanax')) return 'Xanax';
    if (lower.includes('lsd')) return 'LSD';
    if (lower.includes('opium')) return 'Opium';
    if (lower.includes('shrooms')) return 'Shrooms';
    if (lower.includes('weed')) return 'Weed';
    if (lower.includes('pc')) return 'PCP';
    if (lower.includes('meth')) return 'Meth';
    if (lower.includes('cocaine')) return 'Cocaine';
    if (lower.includes('ecstasy')) return 'Ecstasy';
    return 'Drug';
  }

  function getDisplayInfo() {
    const ariaEl = document.querySelector("[aria-label^='Drug Cooldown:']");
    const rawText = ariaEl ? ariaEl.getAttribute('aria-label').trim() : null;

    if (!rawText || rawText.includes('ready')) {
      return { text: 'Not Using', color: '#ff69b4', isOnCD: false }; // Hot Pink
    }

    const timeSec = parseCooldownTime(rawText);
    if (timeSec === null) {
      return { text: rawText, color: '#fff', isOnCD: true };
    }

    const drug = getDrugName(rawText);
    const mins = Math.floor(timeSec / 60);
    const secs = timeSec % 60;
    const timer = `${mins}:${secs.toString().padStart(2, '0')}`;

    // Color: 0–8 minutes → green → yellow → red
    const ratio = Math.min(timeSec / (8 * 60), 1); // 0 to 1
    let r, g;

    if (ratio <= 0.5) {
      // Green → Yellow
      r = Math.round(255 * (ratio * 2));
      g = 255;
    } else {
      // Yellow → Red
      r = 255;
      g = Math.round(255 * (2 - ratio * 2));
    }

    const color = `rgb(${r}, ${g}, 0)`;

    return { text: `${drug} ${timer}`, color, isOnCD: true };
  }

  // -------------------------------------------------
  function showBanner(text, color) {
    if (!banner) return;
    banner.textContent = text;
    banner.style.color = color;
    banner.style.opacity = '1';
    banner.style.paddingRight = RIGHT_PADDING;
  }

  function hideBanner() {
    if (!banner) return;
    banner.style.opacity = '0';
    banner.style.paddingRight = '0';
  }

  // -------------------------------------------------
  function updateDisplay() {
    const info = getDisplayInfo();
    const currentlyOnCD = info.isOnCD;

    if (currentlyOnCD !== isOnCooldown) {
      isOnCooldown = currentlyOnCD;
      clearTimeout(flashTimeout);
      hideBanner();

      if (!isOnCooldown) {
        showBanner(info.text, info.color); // Sticky: Not Using
      } else {
        triggerFlash(info);
      }
    } else if (!isOnCooldown) {
      // Update text/color if still off CD
      showBanner(info.text, info.color);
    }
  }

  function triggerFlash(info) {
    if (!isOnCooldown) return;
    showBanner(info.text, info.color);
    flashTimeout = setTimeout(() => {
      hideBanner();
      setTimeout(() => triggerFlash(getDisplayInfo()), FLASH_INTERVAL - FLASH_DURATION);
    }, FLASH_DURATION);
  }

  // -------------------------------------------------
  waitForElm('.news-ticker-slider-wrapper').then(wrapper => {
    banner = ensureBanner();

    if (!wrapper.querySelector(`#${BANNER_ID}`)) {
      const icon = wrapper.querySelector('svg');
      if (icon && icon.parentNode) {
        icon.parentNode.insertBefore(banner, icon.nextSibling);
      } else {
        wrapper.appendChild(banner);
      }
    }

    updateDisplay();
    setInterval(updateDisplay, CHECK_INTERVAL);
  });

})();