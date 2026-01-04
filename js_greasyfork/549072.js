// ==UserScript==
// @name         SteamGifts Group Tools
// @namespace    SG-Group-Tools
// @version      1.0.4
// @description  Tools to track leechers and group rules
// @author       CapnJ
// @license      MIT
// @match        https://www.steamgifts.com/group/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      steamgifts.com
// @downloadURL https://update.greasyfork.org/scripts/549072/SteamGifts%20Group%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/549072/SteamGifts%20Group%20Tools.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.textContent = `
  .sggt-btn {
    background: #4a90e2;
    color: white;
    border: none;
    padding: 8px 12px;
    margin-top: 6px;
    margin-right: 6px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }
  .sggt-btn:hover {
    background: #357ab8;
  }
`;


document.head.appendChild(style);



function injectSettingsButton() {
  const leftContainer = document.querySelector('body > header > nav > div.nav__left-container');
  if (!leftContainer) return;

  const esgstContainer = document.querySelector('#esgst');
  if (!esgstContainer) return;

  const settingsBtn = document.createElement('a');
  settingsBtn.className = 'nav__button';
  settingsBtn.href = '#';
  settingsBtn.innerHTML = `
  <i class="fa fa-fw fa-cogs icon-grey grey"></i>
  <span style="margin-left: 4px;">Group Settings</span>
`;

  settingsBtn.style.marginLeft = '8px';
  settingsBtn.addEventListener('click', e => {
    e.preventDefault();
    openSettingsModal();
  });

  esgstContainer.insertAdjacentElement('afterend', settingsBtn);
}

function waitForESGSTAndInjectSettings(retries = 10) {
  const esgstContainer = document.querySelector('#esgst');
  const leftContainer = document.querySelector('body > header > nav > div.nav__left-container');

  if (esgstContainer && leftContainer) {
    injectSettingsButton();
  } else if (retries > 0) {
    setTimeout(() => waitForESGSTAndInjectSettings(retries - 1), 500);
  }
}


  const groupKey = window.location.pathname.split('/')[2];
  const lastCheckKey = `lastCheckTime_${groupKey}`;
  const lastEntryKey = `lastEntryTimes_${groupKey}`;
  const successKey = `creatorSuccessFlags_${groupKey}`;

    const defaultFeatures = {
        kickBuffer: { label: 'Kick Buffer Column' },
        offsetInput: { label: 'Offset Column' },
        lastEntry: { label: 'Last Entry Function' },
        successTags: { label: 'Monthly Giveaway and Tags' }
    };

    function getGroupFeatureSettings() {
        const stored = localStorage.getItem(`groupFeatureSettings_${groupKey}`);
        const parsed = stored ? JSON.parse(stored) : {};
        return Object.assign({}, ...Object.keys(defaultFeatures).map(k => ({ [k]: parsed[k] ?? true })));
    }

    const settings = getGroupFeatureSettings();

    // Ensure all expected keys are present
    Object.keys(defaultFeatures).forEach(key => {
        if (typeof settings[key] === 'undefined') {
            settings[key] = true;
        }
    });


    function openSettingsModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: white; padding: 20px; border: 2px solid #333; z-index: 10000;
    box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 8px;
  `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 9999;
  `;
        overlay.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });

        const settings = getGroupFeatureSettings();

        modal.innerHTML = `
    <h3>Feature Visibility Settings</h3>
    ${Object.keys(defaultFeatures).map(key => `
      <label style='display:block;margin-bottom:8px;'>
      ${defaultFeatures[key].label}
        <input type='checkbox' data-feature='${key}' ${settings[key] ? 'checked' : ''}/>
      </label>
    `).join('')}
    <button id='saveSettingsBtn' class='sggt-btn'>Save</button>
  `;

        modal.querySelector('#saveSettingsBtn').addEventListener('click', () => {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            const newSettings = {};
            checkboxes.forEach(cb => {
                newSettings[cb.dataset.feature] = cb.checked;
            });
            localStorage.setItem(`groupFeatureSettings_${groupKey}`, JSON.stringify(newSettings));
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
            location.reload();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }



   function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
function getMonthName(date) {
  return date.toLocaleString('default', { month: 'long' });
}
  async function rolloverSuccessFlags() {
    const flags = await GM_getValue(successKey, {});
    const now = new Date();
    const thisMonth = getMonthKey(now);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = getMonthKey(lastMonthDate);

    const updated = {};
    for (const [user, record] of Object.entries(flags)) {
      updated[user] = {
        lastMonth: record.thisMonth || false,
        thisMonth: false
      };
    }
    await GM_setValue(successKey, updated);
  }
async function scanSuccessfulGiveawaysOnPage() {
  let flags = await GM_getValue(successKey, {});
  let updatedUsers = 0;

  document.querySelectorAll('.giveaway__row-outer-wrap').forEach(g => {
    const creator = g.querySelector('.giveaway__username');
    const winner = g.querySelector('[data-draggable-id="winners"] .fa-check-circle');
    const tsEl = g.querySelector('span[data-timestamp]');
    if (!creator || !winner || !tsEl) return;

    const username = creator.href.split('/user/')[1];
    const ts = parseInt(tsEl.dataset.timestamp) * 1000;
    const ended = new Date(ts);
    const monthKey = getMonthKey(ended);

    // Determine if we are in lastMonth or thisMonth
    const now = new Date();
    const currentKey = getMonthKey(now);
    const prevMonthKey = getMonthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    if (!flags[username]) flags[username] = { thisMonth: false, lastMonth: false };

    let wasUpdated = false;
    if (monthKey === currentKey && !flags[username].thisMonth) {
      flags[username].thisMonth = true;
      wasUpdated = true;
    }
    if (monthKey === prevMonthKey && !flags[username].lastMonth) {
      flags[username].lastMonth = true;
      wasUpdated = true;
    }

    if (wasUpdated) updatedUsers++;
  });

  await GM_setValue(successKey, flags);
  alert(`Successful creator flags updated. ${updatedUsers} user(s) modified.`);
}

  async function getStoredEntryTimes() {
    return await GM_getValue(lastEntryKey, {});
  }

  async function getConfirmedEntryTime() {
    return await GM_getValue(lastCheckKey);
  }

  async function setConfirmedEntryTime(timestamp) {
    return await GM_setValue(lastCheckKey, timestamp);
  }

  function getSettings() {
      const base = parseFloat(localStorage.getItem(`kickBufferBaseLimit_${groupKey}`) || '200');
      const pct = parseFloat(localStorage.getItem(`kickBufferPercentage_${groupKey}`) || '10');
    return { baseLimit: isNaN(base) ? 200 : base, percentage: isNaN(pct) ? 10 : pct };
  }

    function getOffset(username) {
        return parseInt(localStorage.getItem(`kickBufferOffset_${groupKey}_${username}`) || '0') || 0;
    }

  function rerun() {
    document.querySelectorAll('.kick-buffer-cell, .offset-cell, .last-entry-cell').forEach(e => e.remove());
    document.querySelectorAll('.table__row-inner-wrap').forEach(processRow);
  }

  async function processRow(row) {
    const link = row.querySelector('a[href*="/user/"]');
    if (!link) return;

    const username = link.href.split('/user/')[1];
    const s = getSettings();
    const offset = getOffset(username);
    const cells = row.querySelectorAll('.table__column--width-small.text-center');

    const sent = parseFloat(cells[0]?.textContent.match(/\(([^)]+)\)/)?.[1]?.replace(/[^\d.-]/g, '') || '0');
    const valueDiffCell = cells[3];
    const valueDiff = parseFloat(valueDiffCell?.textContent.replace(/[^\d.-]/g, '') || '0');

    const minBuffer = parseInt(localStorage.getItem(`kickBufferMinLimit_${groupKey}`) ?? '0');
    const calculatedBuffer = s.baseLimit + sent * (s.percentage / 100) + offset;
    const buffer = -Math.max(calculatedBuffer, minBuffer);


    if (valueDiff < buffer) {
      valueDiffCell.style.color = 'red';
      valueDiffCell.style.fontWeight = 'bold';
    } else {
      valueDiffCell.style.color = '';
      valueDiffCell.style.fontWeight = '';
    }

    const lastEntryCell = document.createElement('div');
    lastEntryCell.className = 'table__column table__column--width-small text-center last-entry-cell';

    const [storedEntries, confirmedTime] = await Promise.all([getStoredEntryTimes(), getConfirmedEntryTime()]);
    const lastEntryTime = storedEntries[username] || 0;

    lastEntryCell.textContent = lastEntryTime ? new Date(lastEntryTime * 1000).toLocaleString() : '-';
    if (confirmedTime && lastEntryTime > confirmedTime / 1000) {
        lastEntryCell.style.fontWeight = 'bold';
        if (valueDiff < buffer) {
            lastEntryCell.style.color = 'red';
        } else {
            lastEntryCell.style.color = 'green';
        }
    }

    const offsetCell = document.createElement('div');
    offsetCell.className = 'table__column table__column--width-small text-center offset-cell';
    const input = document.createElement('input');
    input.type = 'number';
    input.value = Math.round(offset);
    input.step = '1';
    input.style.cssText = 'width:60px;text-align:center;font-size:11px;';
    input.addEventListener('change', () => {
        localStorage.setItem(`kickBufferOffset_${groupKey}_${username}`, input.value);
        rerun();
    });
if (settings.offsetInput){
    offsetCell.appendChild(input);
    row.appendChild(offsetCell);
};
    const bCell = document.createElement('div');
    bCell.className = 'table__column table__column--width-small text-center kick-buffer-cell';
    bCell.textContent = buffer.toFixed(2);
      if (settings.kickBuffer) row.appendChild(bCell);

      if (settings.lastEntry) row.appendChild(lastEntryCell);
  }

  function injectHeader() {
    const head = document.querySelector('.table__heading');
    if (!head || head.querySelector('.kick-buffer-header')) return;
if (settings.offsetInput){
    const offset = document.createElement('div');
    offset.className = 'table__column--width-small text-center';
    offset.textContent = 'Offset (-)';
    head.appendChild(offset);
}
if (settings.kickBuffer){
    const buffer = document.createElement('div');
    buffer.className = 'table__column--width-small text-center kick-buffer-header';
    buffer.textContent = 'Kick Buffer';
    head.appendChild(buffer);
}
if (settings.lastEntry){
    const lastEntry = document.createElement('div');
    lastEntry.className = 'table__column--width-small text-center';
    lastEntry.textContent = 'Last Entry';
    head.appendChild(lastEntry);
}

    

  }

async function injectControls() {
  const nav = document.querySelector('.sidebar__navigation');
  if (!nav || nav.nextElementSibling?.classList.contains('kick-buffer-config-panel')) return;

  const settings = getGroupFeatureSettings();
  const s = getSettings();
  const confirmedTime = await getConfirmedEntryTime();

  const wrap = document.createElement('div');
  wrap.className = 'kick-buffer-config-panel';
  wrap.style.cssText = 'margin-top:15px;padding:10px;border:1px solid #ccc;background:#f4f4f4;';

  let html = `
    <strong style="display:block;margin-bottom:8px;">Kick Buffer Settings</strong>
    <label style="margin-right:15px;">
      Base Limit: <input type="number" id="baseLimitInput" value="${s.baseLimit}" step="1" style="width:60px;">
    </label>
    <label>
      Percentage: <input type="number" id="percentageInput" value="${s.percentage}" step="1" style="width:60px;">
    </label>
    <label>
      Min Buffer: <input type="number" id="minBufferInput" value="${localStorage.getItem(`kickBufferMinLimit_${groupKey}`) ?? '0'}" step="1" style="width:60px;">
    </label>

  `;

  if (settings.lastEntry) {
    html += `
      <div style="margin: 8px 0;">
        <strong>Last Check:</strong> <span id="confirmedTimeDisplay">${confirmedTime ? new Date(confirmedTime).toLocaleString() : 'Not set'}</span>
      </div>
      <button id="confirmNowBtn" class="sggt-btn">Set timecheck to now</button>
    `;
  }

  wrap.innerHTML = html;
  nav.insertAdjacentElement('afterend', wrap);

  // Attach input listeners
  document.getElementById('baseLimitInput').addEventListener('input', () => {
    localStorage.setItem(`kickBufferBaseLimit_${groupKey}`, document.getElementById('baseLimitInput').value);
    rerun();
  });

  document.getElementById('percentageInput').addEventListener('input', () => {
    localStorage.setItem(`kickBufferPercentage_${groupKey}`, document.getElementById('percentageInput').value);
    rerun();
  });
  document.getElementById('minBufferInput').addEventListener('input', () => {
    localStorage.setItem(`kickBufferMinLimit_${groupKey}`, document.getElementById('minBufferInput').value);
    rerun();
  });



  // Optional button listener
  if (settings.lastEntry) {
    document.getElementById('confirmNowBtn').addEventListener('click', async () => {
      const now = Date.now();
      await setConfirmedEntryTime(now);
      document.getElementById('confirmedTimeDisplay').textContent = new Date(now).toLocaleString();
      rerun();
    });
  }

  // Export/import buttons (if present elsewhere in DOM)
  const exportBtn = document.getElementById('exportKickBuffer');
  const importBtn = document.getElementById('importKickBuffer');
  if (exportBtn) exportBtn.addEventListener('click', exportData);
  if (importBtn) importBtn.addEventListener('click', importData);
}




  function autoScrollUntilLoaded(cb) {
    const status = document.createElement('div');
    status.id = 'kick-buffer-status';
    status.style.cssText = 'position:fixed;bottom:0;left:0;right:0;padding:8px;text-align:center;background:#fffae5;color:#222;z-index:1000;font-weight:bold;box-shadow:0 -2px 4px rgba(0,0,0,0.1);';
    status.textContent = 'Kick Buffer: Loading users…';
    document.body.appendChild(status);

    let prev = 0, idle = 0;
    const interval = setInterval(() => {
      window.scrollTo(0, document.body.scrollHeight);
      const count = document.querySelectorAll('.table__row-inner-wrap').length;
      if (count === prev) idle++; else { idle = 0; prev = count; }
      if (idle > 10) {
        clearInterval(interval);
        status.textContent = 'Kick Buffer: Loaded and calculated.';
        cb();
        setTimeout(() => status.remove(), 5000);
      }
    }, 200);
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async function scanAllGiveaways() {
    const entryLinks = Array.from(
      document.querySelectorAll('.giveaway__links a[href$="/entries"]')
    ).filter(link => {
      const text = link.textContent.trim();
      return !text.startsWith("0 ");
    });
      console.log(`[Entry Check] Found ${entryLinks.length} giveaways to check.`);
    if (entryLinks.length === 0) {
      alert("No giveaways with entries found on this page.");
      return;
    }

    const entryTimes = await getStoredEntryTimes();

    for (const link of entryLinks) {
      const giveawayUrl = 'https://www.steamgifts.com' + link.getAttribute('href').replace(/\/entries$/, '');
      updateGiveawayStatusText(`Checking: ${giveawayUrl}`);
      await processGiveawayEntries(giveawayUrl, entryTimes);
      await delay(550);
    }

    await GM_setValue(lastEntryKey, entryTimes);
    updateGiveawayStatusText("Giveaway check complete.");
    alert("Entrant timestamps saved successfully.");
  }

  async function processGiveawayEntries(giveawayUrl, entryTimes) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: "GET",
        url: giveawayUrl + "/entries",
        onload: response => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
console.log(`[Entry Check] Checking giveaway: ${giveawayUrl}`);

          const rows = doc.querySelectorAll('.table__row-inner-wrap');
let newEntries = 0;
rows.forEach(row => {
  const userLink = row.querySelector('a[href*="/user/"]');
  const span = row.querySelector('span[data-timestamp]');
  if (!userLink || !span) return;
  const username = userLink.href.split('/user/')[1];
  const timestamp = parseInt(span.dataset.timestamp);
  if (!entryTimes[username] || timestamp > entryTimes[username]) {
    entryTimes[username] = timestamp;
    newEntries++;
  }
});
console.log(`[Entry Check] Updated ${newEntries} entries from ${giveawayUrl}`);

          resolve();
        },
        onerror: err => {
          console.error("Error fetching entries for", giveawayUrl, err);
          resolve();
        }
      });
    });
  }

function createGiveawayStatusPanel() {
  const nav = document.querySelector('.sidebar__navigation');
  if (!nav || document.querySelector('.kick-buffer-status-panel')) return;

  const settings = getGroupFeatureSettings();

  const wrap = document.createElement('div');
  wrap.className = 'kick-buffer-status-panel';
  wrap.style.cssText = 'margin-top:15px;padding:10px;border:1px solid #ccc;background:#f4f4f4;';

  let title = '';
  const buttons = [];

  if (settings.successTags && settings.lastEntry) {
    title = 'Giveaway Scanner';
    buttons.push({
      id: 'startGiveawayCheck',
      label: 'Scan for Last Entries',
      handler: scanAllGiveaways
    });
    buttons.push({
      id: 'scanCreatorFlags',
      label: 'Scan For Monthly',
      handler: scanSuccessfulGiveawaysOnPage
    });
  } else if (settings.successTags) {
    title = 'Monhtly Scanner';
    buttons.push({
      id: 'scanCreatorFlags',
      label: 'Scan For Monthly',
      handler: scanSuccessfulGiveawaysOnPage
    });
  } else {
    title = 'Entry Date Sniffer';
    buttons.push({
      id: 'startGiveawayCheck',
      label: 'Scan for Last Entries',
      handler: scanAllGiveaways
    });
  }

  wrap.innerHTML = `
    <strong style="display:block;margin-bottom:8px;">${title}</strong>
    <div id="kickBufferGiveawayStatus">Ready to scan giveaways.</div>
    ${buttons.map(btn => `<button id="${btn.id}" class="sggt-btn">${btn.label}</button>`).join('')}
  `;

  nav.insertAdjacentElement('afterend', wrap);

  buttons.forEach(btn => {
    document.getElementById(btn.id).addEventListener('click', btn.handler);
  });
}


  function updateGiveawayStatusText(text) {
    const statusEl = document.getElementById('kickBufferGiveawayStatus');
    if (statusEl) statusEl.textContent = text;
  }
  async function injectSuccessTags() {
    const flags = await GM_getValue(successKey, {});
    const now = new Date();
    const thisMonthKey = getMonthKey(now);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = getMonthKey(lastMonthDate);

    document.querySelectorAll('.table__row-inner-wrap').forEach(row => {
      const usernameEl = row.querySelector('a[href^="/user/"]');
      if (!usernameEl) return;

      const username = usernameEl.href.split('/user/')[1];
      const data = flags[username];
      if (!data) return;

      const createTag = (text, color) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.cssText = `background-color:${color};color:white;padding:2px 6px;margin-left:5px;border-radius:10px;font-size:10px;font-weight:bold;`;
        return span;
      };

const tagContainer = row.querySelector('.esgst-tag-button');
if (tagContainer) {
const thisMonthName = getMonthName(now);
const lastMonthName = getMonthName(lastMonthDate);
tagContainer.insertAdjacentElement('afterend',
  createTag(thisMonthName, data.thisMonth ? 'green' : 'red')
);
tagContainer.insertAdjacentElement('afterend',
  createTag(lastMonthName, data.lastMonth ? 'green' : 'red')
);

}
    });
  }
  // Run rollover once per new month
  (async () => {
    const monthKey = `lastRolloverMonth_${groupKey}`;
    const stored = await GM_getValue(monthKey, null);
    const now = new Date();
    const thisMonth = getMonthKey(now);
    if (stored !== thisMonth) {
      await rolloverSuccessFlags();
      await GM_setValue(monthKey, thisMonth);
    }
  })();

    async function injectGiveawayCreatorFlags() {
  const flags = await GM_getValue(successKey, {});
  const now = new Date();
  const thisMonthKey = getMonthKey(now);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = getMonthKey(lastMonthDate);

  document.querySelectorAll('.giveaway__row-outer-wrap').forEach(g => {
    const usernameEl = g.querySelector('.giveaway__username');
    if (!usernameEl) return;

    const username = usernameEl.href.split('/user/')[1];
    const data = flags[username];
    if (!data) return;

    const createTag = (text, color) => {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.cssText = `background-color:${color};color:white;padding:2px 6px;margin-left:5px;border-radius:10px;font-size:10px;font-weight:bold;`;
      return span;
    };

    usernameEl.insertAdjacentElement('afterend',
      createTag(lastMonthKey.split('-')[1], data.lastMonth ? 'green' : 'red')
    );
    usernameEl.insertAdjacentElement('afterend',
      createTag(thisMonthKey.split('-')[1], data.thisMonth ? 'green' : 'red')
    );
  });
}

    waitForESGSTAndInjectSettings();

  if (location.pathname.includes("/users")) {
    injectHeader();
    if (settings.kickBuffer || settings.offsetInput || settings.LastEntry) injectControls();
    autoScrollUntilLoaded(() => {
      rerun();
      if (settings.successTags) injectSuccessTags();
    });
  } else {
    if (settings.successTags || settings.lastEntry) createGiveawayStatusPanel();
  }
})();
