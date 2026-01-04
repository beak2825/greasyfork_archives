// ==UserScript==
// @name         GGn Mining Stats 1.0.7
// @description  Adds a button to the userlog page to calculate personal mining drops statistics and copy them to clipboard (IRC colors). Quick auto-dismissing popup for copy feedback. Also counts random staff cards and ore received.
// @namespace    https://gazellegames.net/
// @version      1.0.7
// @license      MIT
// @match        https://gazellegames.net/user.php?action=userlog
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://gazellegames.net/favicon.ico
// @supportURL   https://github.com/freshwater/userscripts
// @downloadURL https://update.greasyfork.org/scripts/558382/GGn%20Mining%20Stats%20107.user.js
// @updateURL https://update.greasyfork.org/scripts/558382/GGn%20Mining%20Stats%20107.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const userLink = document.querySelector('h2 a.username');
  if (!userLink) return;
  const href = userLink.getAttribute('href');
  const userId = new URL(href, window.location.href).searchParams.get('id');
  if (!userId) return;

  const header = document.querySelector('h2');
  if (!header) return;

  // --- Toast helper (auto-dismissing non-blocking popup) ---
  function ensureToastContainer() {
    let container = document.getElementById('ggn-mining-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ggn-mining-toast-container';
      Object.assign(container.style, {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      });
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, opts = {}) {
    const { duration = 2500, type = 'info' } = opts;
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'ggn-mining-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      pointerEvents: 'auto',
      background: type === 'error' ? 'rgba(220,50,47,0.95)' : 'rgba(40,40,40,0.95)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      fontSize: '13px',
      opacity: '0',
      transform: 'translateY(8px)',
      transition: 'opacity 220ms ease, transform 220ms ease',
      maxWidth: '360px',
      wordBreak: 'break-word'
    });

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    toast.addEventListener('click', () => {
      dismiss();
    });

    let hideTimer = setTimeout(dismiss, duration);

    function dismiss() {
      clearTimeout(hideTimer);
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.addEventListener('transitionend', () => {
        try { toast.remove(); } catch (e) {}
      }, { once: true });
    }

    return { dismiss };
  }

  // --- Buttons ---
  const btn = document.createElement('button');
  btn.textContent = 'Mining Stats';
  Object.assign(btn.style, {
    marginLeft: '8px',
    border: '1px solid white',
    cursor: 'pointer'
  });

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy Stats';
  Object.assign(copyBtn.style, {
    marginLeft: '8px',
    border: '1px solid white',
    cursor: 'pointer'
  });

  // --- helper functions ---
  async function fetchData(url, apiKey) {
    const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
    const data = await response.json();
    if (data?.status !== 'success') throw new Error(data?.error || 'API request failed');
    return data;
  }

  // Compute stats including staff card and ore counts and produce formatted strings
  function computeStats(logData, userData) {
    const drops = logData?.response || [];

    // Flames
    const flameEntries = drops.filter(e => e.message.toLowerCase().includes('flame'));
    const flameCounts = flameEntries.reduce((acc, entry) => {
      const msg = entry.message.toLowerCase();
      ['nayru', 'din', 'farore'].forEach(flame => {
        if (msg.includes(`${flame}'s flame`)) acc[flame]++;
      });
      return acc;
    }, { nayru: 0, din: 0, farore: 0 });

    // Staff card detection (case-insensitive, look for 'staff card')
    const staffPattern = /staff card/i;
    const staffEntries = drops.filter(e => staffPattern.test(e.message));
    const staffCount = staffEntries.length;

    // Ore detection: look for standalone "ore" or "ores" (word boundary)
    const orePattern = /\bore(s)?\b/i;
    const oreEntries = drops.filter(e => orePattern.test(e.message));
    const oreCount = oreEntries.length;

    const actualLines = userData?.response?.community?.ircActualLines ?? 0;
    const totalMines = drops.length;
    const totalFlames = flameEntries.length;
    const linesPerMine = actualLines / (totalMines || 1);
    const linesPerFlame = actualLines / (totalFlames || 1);

    // Plain alert formatting (multi-line)
    const plainAlert = `Mining Stats:
Mines: ${totalMines} | Flames: ${totalFlames}
Nayru: ${flameCounts.nayru}, Din: ${flameCounts.din}, Farore: ${flameCounts.farore}
Staff cards: ${staffCount}, Ore: ${oreCount}
Lines/Mine: ${linesPerMine.toFixed(2)}
Lines/Flame: ${linesPerFlame.toFixed(2)}`;

    // Single-line IRC formatted string (with flame color codes)
    const bullet = ' ••• ';
    const IRC_COLOR = '\x03';
    const IRC_RESET = '\x0f';
    const coloredNayru = `${IRC_COLOR}12Nayru: ${flameCounts.nayru}${IRC_RESET}`;
    const coloredDin = `${IRC_COLOR}04Din: ${flameCounts.din}${IRC_RESET}`;
    const coloredFarore = `${IRC_COLOR}03Farore: ${flameCounts.farore}${IRC_RESET}`;
    // Ore in yellow (IRC color code 08)
    const coloredOre = `${IRC_COLOR}08Ore: ${oreCount}${IRC_RESET}`;

    const singleLine = `Mines: ${totalMines}${bullet}Flames: ${totalFlames}${bullet}${coloredNayru}, ${coloredDin}, ${coloredFarore}${bullet}Staff: ${staffCount}, ${coloredOre}${bullet}Lines/Mine: ${linesPerMine.toFixed(2)}${bullet}Lines/Flame: ${linesPerFlame.toFixed(2)}`;

    return {
      drops,
      flameCounts,
      staffCount,
      oreCount,
      totalMines,
      totalFlames,
      linesPerMine,
      linesPerFlame,
      plainAlert,
      singleLine
    };
  }

  // --- main handlers (preserve original prompting/retry flow) ---
  btn.addEventListener('click', async () => {
    let apiKey = GM_getValue('mining_stats_api_key');
    let needsRetry = false;
    do {
      try {
        if (!apiKey) {
          apiKey = prompt('Enter your API key (requires "User" permissions):');
          if (!apiKey) return;
          GM_setValue('mining_stats_api_key', apiKey);
        }

        console.log('[Mining Stats] Fetching data...');
        const [logData, userData] = await Promise.all([
          fetchData(`https://gazellegames.net/api.php?request=userlog&limit=-1&search=as an irc reward.`, apiKey),
          fetchData(`https://gazellegames.net/api.php?request=user&id=${userId}`, apiKey)
        ]);

        const stats = computeStats(logData, userData);

        alert(stats.plainAlert);
        needsRetry = false;
      } catch (error) {
        console.error('[Mining Stats] Error:', error);
        if ([401, 403].includes(error.status)) {
          GM_setValue('mining_stats_api_key', '');
          apiKey = null;
          needsRetry = confirm(`API Error: ${error.status === 401 ? 'Invalid key' : 'No permissions'}. Retry?`);
        } else {
          alert(`Error: ${error.message}`);
          needsRetry = false;
        }
      }
    } while (needsRetry);
  });

  copyBtn.addEventListener('click', async () => {
    let apiKey = GM_getValue('mining_stats_api_key');
    let needsRetry = false;
    do {
      try {
        if (!apiKey) {
          apiKey = prompt('Enter your API key (requires "User" permissions):');
          if (!apiKey) return;
          GM_setValue('mining_stats_api_key', apiKey);
        }

        console.log('[Mining Stats] (copy) Fetching data...');
        const [logData, userData] = await Promise.all([
          fetchData(`https://gazellegames.net/api.php?request=userlog&limit=-1&search=as an irc reward.`, apiKey),
          fetchData(`https://gazellegames.net/api.php?request=user&id=${userId}`, apiKey)
        ]);

        const stats = computeStats(logData, userData);

        // Copy to clipboard (navigator.clipboard preferred)
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(stats.singleLine);
          } else {
            const ta = document.createElement('textarea');
            ta.value = stats.singleLine;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          showToast('Mining stats copied to clipboard.');
          console.log('[Mining Stats] Copied text:', stats.singleLine);
        } catch (err) {
          console.error('[Mining Stats] Clipboard error', err);
          showToast('Failed to copy to clipboard.', { type: 'error', duration: 4000 });
          console.log('[Mining Stats] Clipboard error details. Stats:\n', stats.singleLine);
        }

        needsRetry = false;
      } catch (error) {
        console.error('[Mining Stats] Error (copy):', error);
        if ([401, 403].includes(error.status)) {
          GM_setValue('mining_stats_api_key', '');
          apiKey = null;
          needsRetry = confirm(`API Error: ${error.status === 401 ? 'Invalid key' : 'No permissions'}. Retry?`);
        } else {
          alert(`Error: ${error.message}`);
          needsRetry = false;
        }
      }
    } while (needsRetry);
  });

  header.appendChild(btn);
  header.appendChild(copyBtn);
})();