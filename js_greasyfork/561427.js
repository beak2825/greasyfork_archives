// ==UserScript==
// @name        Sainsbury's delivery slot banner
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/sainsburys-delivery-slot-banner
// @include     https://www.sainsburys.co.uk/gol-ui/*
// @exclude     none
// @version     1.0.2
// @description:en	Shows a banner when not editing a delivery slot
// @grant    		none
// @description	Shows a banner when not editing a delivery slot
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561427/Sainsbury%27s%20delivery%20slot%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/561427/Sainsbury%27s%20delivery%20slot%20banner.meta.js
// ==/UserScript==

const BANNER_ID = 'sainsburys-slot-banner';
const CHECK_INTERVAL = 2000; // Check every 2 seconds

function injectFlashAnimation() {
  // Check if style already exists
  if (document.getElementById('sainsburys-flash-animation')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'sainsburys-flash-animation';
  style.textContent = `
    @keyframes flashRed {
      0%, 100% {
        background-color:rgb(246, 156, 0); 
      }
      50% {
        background-color: #dc3545;
      }
    }
  `;
  document.head.appendChild(style);
}

function checkAndUpdateBanner() {
  const deliverySlotElement = document.querySelector(
    '.book-delivery__datetime',
  );
  const isInCheckout = window.location.toString().includes('checkout');
  const isInSlotBooking = window.location.toString().includes('slot/book');
  const shouldShowBanner =
    !deliverySlotElement && !isInCheckout && !isInSlotBooking;

  const existingBanner = document.getElementById(BANNER_ID);

  if (shouldShowBanner) {
    // Element not found - show banner if it doesn't exist
    if (!existingBanner) {
      const banner = document.createElement('div');
      banner.id = BANNER_ID;
      banner.textContent = "FYI you're not editing a slot";
      banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #ff8a8a;
        color: white;
        padding: 44px;
        text-align: center;
        font-size: 34px;
        font-weight: bold;
        z-index: 99999;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        animation: flashRed 1.2s ease-in-out infinite;
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
    // Inject CSS animation
    injectFlashAnimation();

    // Initial check
    checkAndUpdateBanner();

    // Set up interval to check periodically
    setInterval(checkAndUpdateBanner, CHECK_INTERVAL);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in sainsburys-delivery-slot-banner', e);
  }
}

worker();
