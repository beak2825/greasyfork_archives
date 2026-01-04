// ==UserScript==
// @name         Torn — BMM ID Warning
// @namespace    https://example.local/
// @version      1.0
// @author       DarthRevan
// @description  Show a warning banner when viewing a profile whose ID is in the supplied BMM list.
// @match        https://www.torn.com/*loader.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554152/Torn%20%E2%80%94%20BMM%20ID%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/554152/Torn%20%E2%80%94%20BMM%20ID%20Warning.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== Configuration ==========
  const useAlert = false;

  // Message shown to the user
  const WARNING_TEXT = "⚠️ This person is a part of BMM, DO NOT MUG THEM.";

  // ========== BMM ID Set ========== This is to eventually be linked to an external page to alllow easy expansion
  const bmmIds = new Set([
    3387224,3104527,3429433,3215135,3303003,3527387,3767900,3126358,3743668,3557301,
    3247026,3445070,3218273,2882789,2549042,2117462,3387089,3418749,3439900,3424452,
    3246784,2982440,3632073,3431920,3696702,3693999,2660552,3243958,3349229,3246146,
    3644019,3094100,3456349,3700435,3629768,3730330,3389800,2840742,3522999,2465943,
    2439537,3424092,3357431,3352053,3871798,2116826,578863,3618364,3567556,3483313,
    2410840,3419082,3784877,3344862,3575850,3681518,2331130,2874698,2836054,3166879,
    3359740,3692542,2144418,3429399,3461650,3585807,3285695,3725600,3522884,3623564,
    3681526,3328226,3574253,3247449,3677866,3631262,3565784,2752611,3460891,538353,
    3301882,3407522,3615941,3268878,2824470,3391134,3555347,2699286,1821105,3112208,
    3616383,3637844,3455361,3642719,445588,3618264,3609158,3887288,2327316,3470432,
    2947669,3270480,3402687,3426866,3535674,3281931,3617287,3670389,3679364,3721061,
    3335859,3060938,3621114,2989500,2507441,2689597,3253779,3517419,3395430,2629172,
    3502730,3500529,3626651,3499830,3249836,2830335,3796068,3405801,3570456,2587660,
    2983838,3572380,3901061,3697478,3664719,3880612,3895709,2446089,2931034,3940363,
    3269031,3367330,3498427,3869677,2804919,3881194,3593918,3964462,3929283
  ]);

  // ========== Helper: get ID from URL ==========
  function extractIdFromUrl(url) {
    try {
      const u = new URL(url);
      for (const [k, v] of u.searchParams.entries()) {
        if (k.toLowerCase().endsWith('id') && /^\d+$/.test(v)) {
          return parseInt(v, 10);
        }
      }
      if (u.searchParams.has('user2ID')) {
        const v = u.searchParams.get('user2ID');
        if (/^\d+$/.test(v)) return parseInt(v, 10);
      }
      if (u.searchParams.has('userID')) {
        const v = u.searchParams.get('userID');
        if (/^\d+$/.test(v)) return parseInt(v, 10);
      }
      const regex = /(?:user2ID=|userID=|id=)?(\b\d{5,9}\b)/i;
      const m = url.match(regex);
      if (m) return parseInt(m[1], 10);
    } catch (e) {
    }
    return null;
  }

  // ========== UI: Banner injection ==========
  function showBanner(message) {
    // Avoid duplicate banners
    if (document.getElementById('bmm-warning-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'bmm-warning-banner';
    banner.textContent = message;
    Object.assign(banner.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '999999',
      padding: '12px 16px',
      fontSize: '16px',
      fontWeight: '700',
      textAlign: 'center',
      background: '#ff4444',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    });
    // Add a small dismiss button
    const btn = document.createElement('button');
    btn.textContent = 'Dismiss';
    Object.assign(btn.style, {
      marginLeft: '12px',
      padding: '6px 10px',
      fontSize: '13px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '6px'
    });
    btn.onclick = () => banner.remove();
    banner.appendChild(btn);

    const spacer = document.createElement('div');
    spacer.id = 'bmm-warning-spacer';
    spacer.style.height = banner.offsetHeight ? `${banner.offsetHeight}px` : '48px';

    document.documentElement.appendChild(banner);
    document.body.style.marginTop = spacer.style.height;
  }

  // ========== Main ==========
  function main() {
    const id = extractIdFromUrl(window.location.href);
    if (!id) return;
    if (bmmIds.has(id)) {
      // show banner and optionally alert
      showBanner(WARNING_TEXT);
      console.log('[BMM Warning] matched ID:', id);
      if (useAlert) alert(WARNING_TEXT);
    }
  }

  // Run now and also run again if URL changes via history API (single-page navigation)
  main();

  (function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      setTimeout(main, 250);
    };
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      setTimeout(main, 250);
    };
    window.addEventListener('popstate', () => setTimeout(main, 250));
  })(window.history);

})();
