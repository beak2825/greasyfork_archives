// ==UserScript==
// @name         FinalEarth Mobile Online Users (Non-Breaking Refresh)
// @namespace    https://finalearth.com/
// @version      1.0.10
// @match        https://www.finalearth.com/*
// @description  Adds online users by country on mobile, auto-refreshing every 3 minutes
// @grant        GM.xmlHttpRequest
// @connect      www.finalearth.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563668/FinalEarth%20Mobile%20Online%20Users%20%28Non-Breaking%20Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563668/FinalEarth%20Mobile%20Online%20Users%20%28Non-Breaking%20Refresh%29.meta.js
// ==/UserScript==

(() => {

  const REFRESH_MS = 3 * 60 * 1000;
  let nextRefresh = Date.now() + REFRESH_MS;
  let running = false;

  /* ================= GM XHR PROMISE HELPER ================= */
  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        withCredentials: true,
        onload: r => resolve(r.responseText),
        onerror: e => reject(e),
        ontimeout: e => reject(e)
      });
    });
  }

  /* ================= REFRESH BUTTON ================= */
  function ensureButton() {
    let btn = document.getElementById('fe-refresh-btn');
    if (btn) return btn;

    btn = document.createElement('div');
    btn.id = 'fe-refresh-btn';
    btn.style.cssText = `
      position:fixed;
      top:8px;
      right:100px;
      z-index:99999;
      background:#111;
      color:#fff;
      border:1px solid #444;
      border-radius:6px;
      padding:6px 10px;
      font-size:12px;
      font-weight:600;
      cursor:pointer;
      user-select:none;
    `;
    btn.textContent = 'Starting…';
    btn.onclick = () => runFE(true);
    document.body.appendChild(btn);
    return btn;
  }

  function updateButton(text) {
    ensureButton().textContent = text;
  }

  setInterval(() => {
    if (running) return;
    const s = Math.max(0, Math.floor((nextRefresh - Date.now()) / 1000));
    updateButton(s === 0 ? 'Refreshing…' : `Refresh in ${s}s`);
  }, 1000);

  /* ================= MAIN RUN ================= */
  async function runFE(forced = false) {
    if (running) return;
    running = true;

    updateButton('Refreshing…');

    try {

  await (async () => {

    /* ===== ORIGINAL SCRIPT (NETWORK FIXED ONLY) ===== */

    (function () {
      const origAssign = window.location.assign;
      const origReplace = window.location.replace;

      function upgrade(url) {
        if (typeof url === 'string' && url.startsWith('http://')) {
          return 'https://' + url.slice(7);
        }
        return url;
      }

      window.location.assign = function (url) {
        return origAssign.call(this, upgrade(url));
      };

      window.location.replace = function (url) {
        return origReplace.call(this, upgrade(url));
      };
    })();


    /* ================= STEP 1: FETCH USERS ONLINE ================= */
    const html = await gmGet(
      'https://www.finalearth.com/details/usersonline?time=86400&team=All'
    );

    /* ================= STEP 2: PARSE USER IDS ================= */
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const container = dom.querySelector('.scroll_bar');
    if (!container) {
      console.error('scroll_bar not found in fetched HTML');
      return;
    }

    const userMap = {};
    container.querySelectorAll('a[href*="userID="]').forEach(a => {
      const qs = new URLSearchParams(a.getAttribute('href').split('?')[1]);
      const userID = qs.get('userID');
      if (!userID) return;

      const style = a.getAttribute('style') || '';
      let faction = null;

      if (style.includes('#FF7272')) faction = 'Axis';
      else if (style.includes('#00D8A3')) faction = 'Allie';

      userMap[userID] = faction;
    });

    const userIDs = Object.keys(userMap);
    console.log(`Found ${userIDs.length} users (remote)`);

    /* ================= STEP 3: FETCH PROFILES ================= */
    const results = [];

    for (const userID of userIDs) {
      try {
        const profileHtml = await gmGet(
          `https://www.finalearth.com/details?userID=${userID}`
        );

        const doc = new DOMParser().parseFromString(profileHtml, 'text/html');
        const inform = doc.querySelector('.inform');
        if (!inform) continue;

        const getValue = label => {
          const span = [...inform.querySelectorAll('span')]
            .find(s => s.textContent.trim() === label);
          return span?.nextSibling?.textContent.trim() || '';
        };

        results.push({
          userID,
          username: getValue('Name:'),
          lastAction: getValue('Last Action:'),
          country: inform.querySelector('a[href*="/world/?country="]')?.textContent.trim() || '',
          faction: userMap[userID]
        });

        await new Promise(r => setTimeout(r, 100));
      } catch (e) {
        console.warn(`Failed to fetch profile ${userID}`, e);
      }
    }

    console.table(results);

    /* ================= STEP 4: COUNTRY MAP ================= */
    const countryUsers = {};
    results.forEach(r => {
      if (!countryUsers[r.country]) countryUsers[r.country] = [];
      countryUsers[r.country].push(r);
    });

    /* ================= STEP 5: TOOLTIP OBSERVER ================= */
    const tooltip = document.querySelector('.jvectormap-label');
    if (!tooltip) {
      console.warn('jvectormap-label not found');
      return;
    }

    let lastRenderedCountry = null;

    const observer = new MutationObserver(() => {
      const title = tooltip.querySelector('h2');
      if (!title) return;

      const country = title.textContent.trim();
      const users = countryUsers[country];
      if (!users || users.length === 0) return;

      if (country === lastRenderedCountry &&
          tooltip.querySelector('.custom-user-block')) return;

      const tipInner = tooltip.querySelector('.tolltipStyle');
      if (!tipInner) return;

      tipInner.querySelector('.custom-user-block')?.remove();
      tipInner.style.position = 'relative';

      const block = document.createElement('div');
      block.className = 'custom-user-block';
      block.innerHTML = `
        <div style="position:absolute;top:100%;left:0;margin-top:6px;padding-top:6px;width:100%;
          border-top:1px solid rgba(255,255,255,0.25);font-size:12px;
          max-height:160px;overflow-y:auto;background:rgba(0,0,0,0.85);">
          ${users.map(u => `
            <div>
              <span style="font-weight:600;color:${u.faction === 'Axis' ? '#ff7272' : '#00d8a3'}">
                ${u.username}
              </span> — ${u.lastAction}
            </div>
          `).join('')}
        </div>
      `;

      tipInner.appendChild(block);
      lastRenderedCountry = country;
    });

    // ================= ATOMIC SWAP =================

      // stop old observer last-second
      if (window.__feTooltipObserver) {
          try { window.__feTooltipObserver.disconnect(); } catch {}
          window.__feTooltipObserver = null;
      }

      // start new observer first
      observer.observe(tooltip, { childList: true, subtree: true });
      window.__feTooltipObserver = observer;

      // THEN clear old rendered blocks
      document.querySelectorAll('.custom-user-block').forEach(n => n.remove());

    console.log('Userscript active (GM.xmlHttpRequest mode)');

  })();
} catch(e) {
alert(e);

} finally {
  running = false;
  nextRefresh = Date.now() + REFRESH_MS;
}

  }

  /* ================= BOOTSTRAP ================= */
  ensureButton();
  runFE();
  setInterval(() => runFE(), REFRESH_MS);

})();
