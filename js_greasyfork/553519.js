// ==UserScript==
// @name         Psy's PA Team Builder
// @namespace    psy.pa.teams
// @version      3.3
// @description  Build PA teams (snake draft) from the PA roster order. Pink launcher, per-team Select/Plan with success states.
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553519/Psy%27s%20PA%20Team%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/553519/Psy%27s%20PA%20Team%20Builder.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  /* ----------------- ROSTER SCRAPING (robust + normalized names) ----------------- */
  function normalizeNameAndId(nameText, linkHref) {
    const txt = (nameText || '').trim();
    const mHref = linkHref ? linkHref.match(/XID=(\d+)/) : null;
    const mBracket = txt.match(/\[(\d+)\]\s*$/);
    const xid = (mHref && mHref[1]) || (mBracket && mBracket[1]) || '';
    const name = txt.replace(/\s*\[\d+\]\s*$/, '').trim(); // strip any trailing [123]
    return { name, xid };
  }

  function findPaListRoster() {
    const root = document.querySelector('.plan-list-scrollbar.plans-list');
    if (!root) return null;
    const header = root.querySelector('ul.item.title, ul.item.title.bold');
    const rows = root.querySelectorAll('ul.item:not(.title)');
    if (!header || rows.length === 0) return null;
    return { header, rows };
  }
  function listMemberIndex(headerUL) {
    const labels = Array.from(headerUL.querySelectorAll('li')).map(li => li.textContent.trim());
    return labels.findIndex(t => /member/i.test(t));
  }
  function scrapeFromList({ header, rows }) {
    const mi = listMemberIndex(header);
    if (mi < 0) return [];
    const out = [];
    rows.forEach(ul => {
      const cells = ul.querySelectorAll('li');
      const mCell = cells[mi];
      if (!mCell) return;
      const a = mCell.querySelector('a[href]');
      const { name, xid } = normalizeNameAndId(a ? a.textContent : mCell.textContent, a ? a.href : '');
      if (name) out.push({ name, xid });
    });
    const seen = new Set();
    return out.filter(p => !seen.has(p.xid || p.name) && (seen.add(p.xid || p.name), true));
  }

  function findPaTableRoster() {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const tbl of tables) {
      const headers = Array.from(tbl.querySelectorAll('thead th')).map(th => th.textContent.trim());
      if (headers.length && headers.some(h => /member/i.test(h)) && headers.some(h => /add/i.test(h))) {
        return { table: tbl, headers };
      }
    }
    return null;
  }
  function scrapeFromTable({ table, headers }) {
    const mi = headers.findIndex(h => /member/i.test(h));
    if (mi < 0) return [];
    const out = [];
    for (const tr of table.querySelectorAll('tbody tr')) {
      const tds = tr.querySelectorAll('td');
      const mCell = tds[mi];
      if (!mCell) continue;
      const a = mCell.querySelector('a[href]');
      const { name, xid } = normalizeNameAndId(a ? a.textContent : mCell.textContent, a ? a.href : '');
      if (name) out.push({ name, xid });
    }
    const seen = new Set();
    return out.filter(p => !seen.has(p.xid || p.name) && (seen.add(p.xid || p.name), true));
  }

  function scrapeRosterKeepOrder() {
    const l = findPaListRoster();
    if (l) {
      const r = scrapeFromList(l);
      if (r.length) return r;
    }
    const t = findPaTableRoster();
    if (t) {
      const r = scrapeFromTable(t);
      if (r.length) return r;
    }
    return [];
  }

  /* ----------------- TEAM BUILDING (snake) ----------------- */
  function buildTeams(members) {
    const T = Math.floor(members.length / 4);
    const teams = Array.from({ length: T }, (_, i) => ({ team: i + 1, p1: null, p2: null, p3: null, p4: null }));
    if (!T) return { teams: [], extras: members.slice() };
    const p1 = members.slice(0, T);
    const p2 = members.slice(T, 2*T);
    const p3 = members.slice(2*T, 3*T);
    const p4 = members.slice(3*T, 4*T);
    const extras = members.slice(4*T);
    p1.forEach((m,i)=>teams[i].p1=m);
    p2.forEach((m,i)=>teams[(T-1)-i].p2=m);
    p3.forEach((m,i)=>teams[i].p3=m);
    p4.forEach((m,i)=>teams[(T-1)-i].p4=m);
    return { teams, extras };
  }

  /* ----------------- INLINE LAUNCHER (pink w/ gray text) ----------------- */
  function currentCrimesWrapper() {
    const root = document.getElementById('faction-crimes');
    if (!root || root.getAttribute('aria-hidden') === 'true') return null;
    const org = root.querySelector('.faction-crimes-wrap .organize-wrap');
    return org ? org.closest('.faction-crimes-wrap') : null;
  }
  function ensureInlineButton() {
    const wrap = currentCrimesWrapper();
    if (!wrap) return;
    let holder = document.getElementById('pa-inline-holder');
    if (!holder || !holder.isConnected) {
      holder = document.createElement('div');
      holder.id = 'pa-inline-holder';
      holder.style.padding = '10px 0 12px 0';
      wrap.insertAdjacentElement('afterend', holder);
    }
    let btn = document.getElementById('pa-inline-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'pa-inline-btn';
      btn.textContent = 'PA Team Builder';
      Object.assign(btn.style, {
        display: 'inline-block',
        padding: '10px 18px',
        borderRadius: '14px',
        border: '1px solid #8f8082',
        background: '#fab2b9',
        color: '#2f3338',           // gray text on pink
        fontWeight: 800,
        letterSpacing: '0.3px',
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 2px 6px rgba(0,0,0,.25)'
      });
      btn.onmouseenter = () => btn.style.filter = 'brightness(0.96)';
      btn.onmouseleave = () => btn.style.filter = '';
      btn.addEventListener('click', openPanel);
      holder.appendChild(btn);
    }
  }

  /* ----------------- SELECT & PLAN IN UI ----------------- */
  async function ensurePaPlansWrap() {
    const rows = Array.from(document.querySelectorAll('#faction-crimes .begin-wrap .item-wrap > ul.item.plan-row'));
    const paRow = rows.find(ul => /political\s*assassination/i.test(ul.textContent));
    if (!paRow) throw new Error('Could not find the Political Assassination row.');
    let plansWrap = paRow.parentElement.querySelector('.plans-wrap');
    const planLink = paRow.querySelector('li.act a');
    if (!plansWrap || plansWrap.offsetParent === null) {
      if (planLink) planLink.click();
      for (let i = 0; i < 60; i++) {
        await sleep(100);
        plansWrap = paRow.parentElement.querySelector('.plans-wrap');
        if (plansWrap && plansWrap.querySelector('.plan-list-scrollbar.plans-list')) break;
      }
    }
    if (!plansWrap) throw new Error('PA roster did not open.');
    return plansWrap;
  }
  function rosterCheckboxes(plansWrap) {
    return Array.from(plansWrap.querySelectorAll('input[type="checkbox"][name="ID[]"]'));
  }
  async function selectTeamInUi(teamMembers) {
    const xids = teamMembers.map(m => m?.xid).filter(Boolean);
    if (xids.length !== 4) throw new Error('Some members are missing XIDs; cannot auto-select.');
    const wrap = await ensurePaPlansWrap();
    const cbs = rosterCheckboxes(wrap);
    // clear
    cbs.forEach(cb => { if (cb.checked) cb.click(); });
    // select
    for (const xid of xids) {
      const target = cbs.find(cb => cb.value === String(xid));
      if (!target) throw new Error(`Could not find XID ${xid} in PA roster.`);
      if (!target.checked) target.click();
    }
    cbs.find(cb => cb.value === String(xids[3]))?.scrollIntoView({ block: 'center' });
  }
  async function planSelectedTeam() {
    const wrap = await ensurePaPlansWrap();
    let btn = wrap.querySelector('.begin-plan-wrap button.torn-btn');
    if (!btn) btn = Array.from(wrap.querySelectorAll('button, a')).find(el => /begin\s+planning|^plan$/i.test(el.textContent.trim()));
    if (!btn) throw new Error('Could not find the final Plan button.');
    btn.click();
  }

  /* ----------------- PANEL ----------------- */
  let panel, listDiv, resultsDiv;

  function openPanel() {
    if (!panel || !panel.isConnected) buildPanel();
    panel.style.display = 'flex';

    // fresh scrape when opening
    const roster = scrapeRosterKeepOrder();
    if (!roster.length) {
      resultsDiv.textContent = 'Open the PA roster (click Plan on Political Assassination), scroll once if needed, then try again.';
      listDiv.innerHTML = '';
      return;
    }

    // list (checkboxes for excludes later if we want)
    listDiv.innerHTML = '';
    roster.forEach(p => {
      const row = document.createElement('div');
      row.className = 'pa-row';
      row.dataset.name = (p.name || '').toLowerCase();
      Object.assign(row.style, {
        display: 'grid', gridTemplateColumns: '24px 1fr', gap: '8px',
        alignItems: 'center', padding: '6px 8px',
        borderBottom: '1px solid #111827', fontSize: '13px'
      });
      row.innerHTML = `<input type="checkbox" checked> <div><strong>${p.name}</strong>${p.xid ? ` [${p.xid}]` : ''}</div>`;
      listDiv.appendChild(row);
    });

    resultsDiv.textContent = 'Uncheck anyone to exclude, then click Generate Teams.';
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.id = 'pa-builder-panel';
    Object.assign(panel.style, {
      position: 'fixed', right: '16px', top: '16px',
      width: '620px', height: '80vh',
      background: '#0f172a', color: '#e5e7eb',
      borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,.35)',
      padding: '14px', zIndex: 999999,
      display: 'flex', flexDirection: 'column', gap: '10px',
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    });

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:800;font-size:16px;">PA Team Builder</div>
        <button id="pa-close" style="background:#1f2937;color:#e5e7eb;border:none;border-radius:10px;padding:6px 10px;cursor:pointer;">Close</button>
      </div>
      <input id="pa-search" type="text" placeholder="Search member…"
             style="display:block;width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:1px solid #334155;background:#0b1220;color:#e5e7eb;">
      <div id="pa-list" style="flex:1;overflow:auto;border:1px solid #1f2937;border-radius:12px;padding:8px;background:#0b1220"></div>
      <button id="pa-generate" style="background:#22c55e;color:#0b1220;border:none;border-radius:12px;padding:12px 14px;font-weight:800;cursor:pointer;">Generate Teams</button>
      <div id="pa-results" style="flex:1;overflow:auto;border:1px solid #1f2937;border-radius:12px;padding:10px;background:#0b1220;"></div>
      <button id="pa-copy" style="background:#1f2937;color:#e5e7eb;border:none;border-radius:12px;padding:10px 12px;cursor:pointer;">Copy text</button>
    `;
    document.body.appendChild(panel);

    listDiv = panel.querySelector('#pa-list');
    resultsDiv = panel.querySelector('#pa-results');

    panel.querySelector('#pa-close').onclick = () => { panel.style.display = 'none'; };
    panel.querySelector('#pa-generate').onclick = runGenerate;
    panel.querySelector('#pa-copy').onclick = () => {
      const txt = resultsDiv.querySelector('[data-plain]')?.textContent || resultsDiv.textContent || '';
      navigator.clipboard.writeText(txt);
    };
    panel.querySelector('#pa-search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      listDiv.querySelectorAll('.pa-row').forEach(row => row.style.display = (row.dataset.name || '').includes(q) ? '' : 'none');
    });

    // handle per-team Select/Plan, with success state
    resultsDiv.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const idx = +btn.dataset.team;
      const team = resultsDiv._teams?.[idx];
      if (!team) return;

      const selectBtn = resultsDiv.querySelector(`[data-action="select"][data-team="${idx}"]`);
      const planBtn   = resultsDiv.querySelector(`[data-action="plan"][data-team="${idx}"]`);

      try {
        if (btn.dataset.action === 'select') {
          btn.disabled = true; btn.textContent = 'Selecting…';
          await selectTeamInUi([team.p1, team.p2, team.p3, team.p4]);
          btn.textContent = 'Team Selected';
          btn.style.background = '#16a34a';
          btn.style.color = '#0b1220';
          btn.disabled = true;
        } else if (btn.dataset.action === 'plan') {
          btn.disabled = true; btn.textContent = 'Planning…';
          if (selectBtn && !/Selected/i.test(selectBtn.textContent)) {
            await selectTeamInUi([team.p1, team.p2, team.p3, team.p4]);
            selectBtn.textContent = 'Team Selected';
            selectBtn.style.background = '#16a34a';
            selectBtn.style.color = '#0b1220';
            selectBtn.disabled = true;
          }
          await sleep(150);
          await planSelectedTeam();
          btn.textContent = 'PA Planned';
          btn.style.background = '#16a34a';
          btn.style.color = '#0b1220';
          btn.disabled = true;
        }
      } catch (e) {
        alert(e.message || e);
        if (btn.dataset.action === 'select') { btn.disabled = false; btn.textContent = 'Select in roster'; }
        if (btn.dataset.action === 'plan')   { btn.disabled = false; btn.textContent = 'Plan this team'; }
      }
    });
  }

  function collectIncluded() {
    // At the moment we just use everyone for teams (order must match DOM),
    // but keeping this in case you want to exclude via checkboxes later.
    return Array.from(document.querySelectorAll('#pa-builder-panel .pa-row'))
      .map(row => {
        const cb = row.querySelector('input[type="checkbox"]');
        if (!cb || !cb.checked) return null;
        const txt = row.querySelector('div').textContent;
        const name = txt.replace(/\s*\[\d+\]\s*$/, '').trim();
        const m = txt.match(/\[(\d+)\]\s*$/);
        const xid = m ? m[1] : '';
        return { name, xid };
      })
      .filter(Boolean);
  }

  function renderTeams(teams, extras) {
    const fmt = (m) => m ? `${m.name}${m.xid ? ` [${m.xid}]` : ''}` : '—';

    // plain text (for Copy)
    const plain = [];
    plain.push(`Teams of 4: ${teams.length}${extras.length ? `  |  Extras: ${extras.length}` : ''}`);
    plain.push('');
    teams.forEach(t => {
      plain.push(`Team ${t.team}`);
      plain.push(`  1) ${fmt(t.p1)}`);
      plain.push(`  2) ${fmt(t.p2)}`);
      plain.push(`  3) ${fmt(t.p3)}`);
      plain.push(`  4) ${fmt(t.p4)}`);
      plain.push('');
    });
    if (extras.length) {
      plain.push('Extras / Bench:');
      extras.forEach((m, i) => plain.push(`  ${i + 1}. ${fmt(m)}`));
      plain.push('');
    }
    plain.push('Pattern: 1→T, T→1, 1→T, T→1 (snake draft).');

    // HTML cards with buttons
    const html = [];
    html.push(`<div data-plain style="display:none;">${plain.join('\n')}</div>`);
    html.push(`<div style="font-weight:700;margin-bottom:6px;">Teams of 4: ${teams.length}${extras.length ? `  |  Extras: ${extras.length}` : ''}</div>`);
    teams.forEach((t, idx) => {
      html.push(`
        <div class="team-card" style="border:1px solid #1f2937;border-radius:12px;padding:10px;margin:8px 0;">
          <div style="font-weight:800;margin-bottom:6px;">Team ${t.team}</div>
          <ol style="margin:0 0 8px 18px;line-height:1.35;">
            <li>${fmt(t.p1)}</li>
            <li>${fmt(t.p2)}</li>
            <li>${fmt(t.p3)}</li>
            <li>${fmt(t.p4)}</li>
          </ol>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button data-action="select" data-team="${idx}" style="background:#334155;color:#e5e7eb;border:none;border-radius:10px;padding:6px 10px;cursor:pointer;">Select in roster</button>
            <button data-action="plan" data-team="${idx}" style="background:#22c55e;color:#0b1220;border:none;border-radius:10px;padding:6px 10px;cursor:pointer;">Plan this team</button>
          </div>
        </div>
      `);
    });
    if (extras.length) {
      html.push(`<div class="team-card" style="border:1px solid #1f2937;border-radius:12px;padding:10px;margin:8px 0;">
        <div style="font-weight:800;margin-bottom:6px;">Extras / Bench</div>
        <ol style="margin:0 0 0 18px;line-height:1.35;">
          ${extras.map((m)=>`<li>${fmt(m)}</li>`).join('')}
        </ol>
      </div>`);
    }

    resultsDiv.innerHTML = html.join('');
    resultsDiv._teams = teams;
  }

  function runGenerate() {
    // prefer includes if you unchecked some
    const included = collectIncluded();
    const roster = included.length ? included : scrapeRosterKeepOrder();
    if (roster.length < 4) {
      resultsDiv.innerHTML = `<div style="opacity:.8">Need at least 4 included members to form a team.</div>`;
      return;
    }
    const { teams, extras } = buildTeams(roster);
    renderTeams(teams, extras);
  }

  /* ----------------- INIT ----------------- */
  (async function init() {
    for (let i = 0; i < 60; i++) { await sleep(100); ensureInlineButton(); }
    const obs = new MutationObserver(() => ensureInlineButton());
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', ensureInlineButton);
    window.addEventListener('resize', ensureInlineButton);
  })();
})();
