// ==UserScript==
// @name         Facebook Event → Download ICS
// @namespace    https://djpanaflex.com/
// @version      1.0
// @description  Adds a button on Facebook Event pages to download the event as an .ics file
// @match        https://www.facebook.com/events/*
// @match        https://m.facebook.com/events/*
// @grant        none
// @license      none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550607/Facebook%20Event%20%E2%86%92%20Download%20ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/550607/Facebook%20Event%20%E2%86%92%20Download%20ICS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Extract the numeric event ID from the URL path (/events/123456789012345/)
  function getEventIdFromPath() {
    const parts = location.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('events');
    if (idx !== -1 && parts[idx + 1]) {
      const candidate = parts[idx + 1].replace(/\D+/g, ''); // keep digits only
      if (candidate.length >= 9) return candidate; // FB event IDs are long
    }
    return null;
  }

  function buildIcsUrl(eventId) {
    return `https://www.facebook.com/events/ical/export/?eid=${eventId}`;
  }

  // Create a small floating button (robust against FB DOM churn)
  function injectButton(icsUrl) {
    // Avoid duplicates
    if (document.getElementById('fb-ics-download-btn')) return;

    const btn = document.createElement('a');
    btn.id = 'fb-ics-download-btn';
    btn.href = icsUrl;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = 'Download ICS';

    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 999999,
      padding: '10px 14px',
      borderRadius: '999px',
      background: '#1877f2',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      textDecoration: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif',
    });

    btn.onmouseenter = () => (btn.style.filter = 'brightness(1.1)');
    btn.onmouseleave = () => (btn.style.filter = 'none');

    document.body.appendChild(btn);
  }

  // Because FB is SPA-ish, observe URL changes and (re)inject when on an event
  let lastEventId = null;

  function tryInject() {
    const eid = getEventIdFromPath();
    if (!eid) return;
    if (eid === lastEventId && document.getElementById('fb-ics-download-btn')) return;
    lastEventId = eid;
    injectButton(buildIcsUrl(eid));
  }

  // Initial run
  tryInject();

  // Re-run on navigation changes
  const pushState = history.pushState;
  history.pushState = function () {
    const ret = pushState.apply(this, arguments);
    setTimeout(tryInject, 300);
    return ret;
  };
  window.addEventListener('popstate', () => setTimeout(tryInject, 300));

  // Also poll a bit, in case of dynamic loads
  let tries = 0;
  const iv = setInterval(() => {
    tryInject();
    if (++tries > 20) clearInterval(iv); // stop after a few seconds
  }, 500);
})();