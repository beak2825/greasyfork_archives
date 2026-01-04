// ==UserScript==
// @name         IMVU Dev Report Local Time
// @namespace    https://example.local/
// @version      2.0
// @description  Converts IMVU Pacific timestamps to local time with optional manual offset and 24-hour toggle
// @match        https://www.imvu.com/catalog/developer_report.php*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549059/IMVU%20Dev%20Report%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/549059/IMVU%20Dev%20Report%20Local%20Time.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const IMVU_TZ = 'America/Los_Angeles';
  const DATETIME_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  let force24h = GM_getValue('imvu_force24h', true);
  let manualOffsetHours = GM_getValue('imvu_manualOffsetHours', 0);

  const pacificDtf = new Intl.DateTimeFormat('en-US', {
    timeZone: IMVU_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatLocalISO(d) {
    return (
      d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      ' ' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes()) + ':' +
      pad(d.getSeconds())
    );
  }

  function pacificToLocal(s) {
    const [datePart, timePart] = s.split(' ');
    if (!datePart || !timePart) return s;

    const [y, mo, d] = datePart.split('-').map(Number);
    const [hh, mm, ss] = timePart.split(':').map(Number);

    // epoch0 = treat the components as if UTC
    const epoch0 = Date.UTC(y, mo - 1, d, hh, mm, ss);

    // Map epoch0 into Pacific wall time
    const parts = pacificDtf.formatToParts(new Date(epoch0));
    const obj = {};
    for (const p of parts) if (p.type !== 'literal') obj[p.type] = p.value;

    const asUTC = Date.UTC(
      +obj.year, +obj.month - 1, +obj.day,
      +obj.hour, +obj.minute, +obj.second
    );

    const tzOffsetMs = asUTC - epoch0;
    const pacificEpoch = epoch0 - tzOffsetMs;

    // Apply manual adjustment
    const correctedEpoch = pacificEpoch + manualOffsetHours * 3600 * 1000;
    const localDate = new Date(correctedEpoch);

    return force24h ? formatLocalISO(localDate) : localDate.toLocaleString();
  }

  function convertOnce() {
    document.querySelectorAll('td.pi_data').forEach(td => {
      const txt = (td.dataset.imvuOriginal || td.textContent || '').trim();
      if (!DATETIME_RE.test(txt)) return;

      if (!td.dataset.imvuOriginal) td.dataset.imvuOriginal = txt;
      const orig = td.dataset.imvuOriginal;
      const localStr = pacificToLocal(orig);

      td.textContent = localStr;
      td.title = `IMVU (Pacific): ${orig} → Local: ${localStr} (offset: ${manualOffsetHours}h)`;
    });
  }

  function toggle24h() {
    force24h = !force24h;
    GM_setValue('imvu_force24h', force24h);
    convertOnce();
    alert(`24-hour ISO format: ${force24h ? 'ON' : 'OFF'}`);
  }

  function adjustOffset(delta) {
    manualOffsetHours += delta;
    GM_setValue('imvu_manualOffsetHours', manualOffsetHours);
    convertOnce();
    alert(`Manual offset now: ${manualOffsetHours} hours`);
  }

  function resetOffset() {
    manualOffsetHours = 0;
    GM_setValue('imvu_manualOffsetHours', 0);
    convertOnce();
    alert(`Manual offset reset to 0 hours`);
  }

  function registerMenus() {
    GM_registerMenuCommand(
      `Toggle 24-hour ISO (currently: ${force24h ? 'ON' : 'OFF'})`,
      toggle24h
    );
    GM_registerMenuCommand('Convert IMVU times now', convertOnce);

    GM_registerMenuCommand(`Current offset: ${manualOffsetHours}h`, () => {});
    GM_registerMenuCommand('Offset +1h', () => adjustOffset(1));
    GM_registerMenuCommand('Offset -1h', () => adjustOffset(-1));
    GM_registerMenuCommand('Reset offset', resetOffset);
  }

  registerMenus();
  convertOnce();
})();
