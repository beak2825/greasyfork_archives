// ==UserScript==
// @name        Sainsbury's delivery slot banner
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/sainsburys-delivery-slot-banner
// @include     https://www.sainsburys.co.uk/gol-ui/*
// @exclude     none
// @version     1.0.0
// @description:en	Shows a banner when not editing a delivery slot
// @grant    		none
// @description	Shows a banner when not editing a delivery slot
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561427/Sainsbury%27s%20delivery%20slot%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/561427/Sainsbury%27s%20delivery%20slot%20banner.meta.js
// ==/UserScript==

const BANNER_ID = 'sainsburys-slot-banner';
const CHECK_INTERVAL = 2000; // Check every 2 seconds

function checkAndUpdateBanner() {
  const deliverySlotElement = document.querySelector(
    '.book-delivery__datetime',
  );
  const existingBanner = document.getElementById(BANNER_ID);

  if (!deliverySlotElement) {
    // Element not found - show banner if it doesn't exist
    if (!existingBanner) {
      const banner = document.createElement('div');
      banner.id = BANNER_ID;
      banner.textContent = "FYI you're not editing a slot";
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #dc3545;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        z-index: 99999;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      `;
      document.body.appendChild(banner);
    }
  } else {
    // Element found - remove banner if it exists
    if (existingBanner) {
      existingBanner.remove();
    }
  }
}

function worker() {
  try {
    // Initial check
    checkAndUpdateBanner();

    // Set up interval to check periodically
    setInterval(checkAndUpdateBanner, CHECK_INTERVAL);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

worker();
