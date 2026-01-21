// ==UserScript==
// @name         FIVB Upcoming Matches (dynamic tournament, CORS-safe)
// @namespace    fivb.upcoming.matches
// @version      12.1
// @author       LM
// @license      MIT
// @description  Clean upcoming matches table. Tournament ID is taken from URL and data are fetched via POST (no credentials) without page reload.
// @match        https://live.app.fivb.com/tournaments/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563381/FIVB%20Upcoming%20Matches%20%28dynamic%20tournament%2C%20CORS-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563381/FIVB%20Upcoming%20Matches%20%28dynamic%20tournament%2C%20CORS-safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******** CONFIG ********/
  const ENDPOINT = 'https://www.fivb.org/Vis2009/XmlRequest.asmx';

  // From your headers
  const X_FIVB_APP_ID = '3b665ad61056495ab5514b81eb0562d8';

  const LIVE_MATCH_URL_PREFIX = 'https://live.app.fivb.com/matches/';
  const LIVE_MATCH_URL_SUFFIX = '/live';
  const LIVE_TOURNAMENT_URL_PREFIX = 'https://live.app.fivb.com/tournaments/';

  // Filters
  const FINISHED_STATUS_SET = new Set([25]); // finished per your sample
  const PAST_GRACE_MINUTES = 30;             // keep matches slightly in the past (in-progress edge)

  // Layout
  const TOP_OFFSET_PX = 36; // ~1 cm down

  // Fetch timing
  const FETCH_DELAY_MS = 800; // give SPA a moment

  /******** STATE ********/
  let lastJson = null;
  let lastRenderKey = '';

  /******** HELPERS ********/
  function getTournamentIdFromUrl() {
    const m = location.pathname.match(/\/tournaments\/(\d+)/);
    return m ? m[1] : null;
  }

  function buildXmlPayload(noTournament) {
    return (
      '<Request Type="GetVolleyMatchList" ' +
        'Fields="No City NoDocumentP2 NoInTournament CountryName DateTimeUtc PoolName ' +
                'TeamACalculatedName TeamBCalculatedName Status MatchResultText SetsResultsText">' +
        `<Filter NoTournament="${noTournament}"/>` +
        '<Relation Name="TeamA"/>' +
        '<Relation Name="TeamB"/>' +
      '</Request>'
    );
  }

  function tryParseJson(t) {
    try { return JSON.parse(t); } catch { return null; }
  }

  function isUpcomingMatch(m) {
    if (typeof m?.status === 'number' && FINISHED_STATUS_SET.has(m.status)) return false;

    const t = Date.parse(m?.dateTimeUtc || '');
    if (!Number.isFinite(t)) return true;

    return t >= Date.now() - PAST_GRACE_MINUTES * 60000;
  }

  function formatLocalDateTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);

    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function safeText(s) {
    return (s ?? '').toString();
  }

  /******** UI ********/
  function ensureContainer() {
    let wrap = document.getElementById('tm-fivb-wrap');
    if (wrap) return wrap;

    wrap = document.createElement('div');
    wrap.id = 'tm-fivb-wrap';
    wrap.style.cssText = `
      max-width: 1100px;
      margin: ${TOP_OFFSET_PX}px auto 0;
      padding: 0 12px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    `;

    wrap.innerHTML = `
      <div style="text-align:center;margin-bottom:12px">
        <div style="font-weight:700;font-size:16px;line-height:1.2;opacity:.92">Upcoming matches</div>
        <div id="tm-fivb-tournament-link" style="font-size:13px;line-height:1.2;opacity:.9"></div>
      </div>
      <div style="border:1px solid rgba(0,0,0,.15);border-radius:12px;overflow:hidden;background:#fff">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#f6f7f9;border-bottom:1px solid rgba(0,0,0,.10)">
              <th style="padding:10px 12px;text-align:left;white-space:nowrap;font-weight:700">Date/Time</th>
              <th style="padding:10px 12px;text-align:left;white-space:nowrap;font-weight:700">Home</th>
              <th style="padding:10px 12px;text-align:left;white-space:nowrap;font-weight:700">Away</th>
              <th style="padding:10px 12px;text-align:left;white-space:nowrap;font-weight:700">Live</th>
            </tr>
          </thead>
          <tbody id="tm-fivb-body"></tbody>
        </table>
      </div>
    `;

    const insert = () => {
      if (!document.body) return false;
      document.body.prepend(wrap);
      return true;
    };
    if (!insert()) window.addEventListener('DOMContentLoaded', () => insert(), { once: true });

    return wrap;
  }

  function renderTable() {
    const wrap = ensureContainer();
    const tbody = wrap.querySelector('#tm-fivb-body');
    const tLink = wrap.querySelector('#tm-fivb-tournament-link');

    const tournamentId = getTournamentIdFromUrl();
    if (tournamentId && tLink) {
      tLink.innerHTML = `<a href="${LIVE_TOURNAMENT_URL_PREFIX}${tournamentId}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Tournament ${tournamentId}</a>`;
    }

    const data = Array.isArray(lastJson?.data) ? lastJson.data : [];
    const rows = data.filter(isUpcomingMatch);

    // stable key to avoid excessive rerenders
    const key = `${rows.length}:${rows[0]?.no || ''}:${rows[0]?.dateTimeUtc || ''}`;
    if (key === lastRenderKey) return;
    lastRenderKey = key;

    tbody.innerHTML = '';

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding:12px;text-align:center;opacity:.7">No upcoming matches</td></tr>`;
      return;
    }

    rows
      .slice()
      .sort((a, b) => (Date.parse(a?.dateTimeUtc || '') - Date.parse(b?.dateTimeUtc || '')))
      .forEach((m, i) => {
        const tr = document.createElement('tr');
        if (i % 2) tr.style.background = 'rgba(0,0,0,.02)';

        const matchNo = m.no;
        const liveUrl = `${LIVE_MATCH_URL_PREFIX}${matchNo}${LIVE_MATCH_URL_SUFFIX}`;

        const home = safeText(m.teamACalculatedName || m.teamA?.name || '');
        const away = safeText(m.teamBCalculatedName || m.teamB?.name || '');

        tr.innerHTML = `
          <td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,.08);white-space:nowrap">${formatLocalDateTime(m.dateTimeUtc)}</td>
          <td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,.08)">${home}</td>
          <td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,.08)">${away}</td>
          <td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,.08);white-space:nowrap">
            <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">${matchNo}</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
  }

  /******** FETCH DATA (CORS-safe) ********/
  async function fetchMatches() {
    const tournamentId = getTournamentIdFromUrl();
    if (!tournamentId) return;

    const xml = buildXmlPayload(tournamentId);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        // IMPORTANT: no credentials -> avoids CORS '*' + credentials conflict
        headers: {
          'accept': 'application/json',
          'content-type': 'application/xml',
          'x-fivb-app-id': X_FIVB_APP_ID
        },
        body: xml
      });

      const text = await res.text();
      const json = tryParseJson(text);

      // minimal validation: must contain data array
      if (json && Array.isArray(json.data)) {
        lastJson = json;
        renderTable();
      }
    } catch (e) {
      // leave header-only table if fetch fails
    }
  }

  /******** INIT ********/
  ensureContainer();
  setTimeout(fetchMatches, FETCH_DELAY_MS);

  // Optional: if the SPA changes route without full reload, refetch
  // (cheap and safe)
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      // clear old data + rerender placeholder
      lastJson = null;
      lastRenderKey = '';
      renderTable();
      setTimeout(fetchMatches, 300);
    }
  }, 700);

})();
