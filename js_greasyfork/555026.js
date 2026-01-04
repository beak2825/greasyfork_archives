// ==UserScript==
// @name         Strava HR Zones Extractor for non subscribers
// @namespace    https://example.local/
// @version      1.2
// @description  Add a button to extract HR stream from Strava overview page, compute zones, show pie + copy CSV (non-auto). Works by inline JSON detection / pageView / streams fetch fallback.
// @author       You
// @match        https://www.strava.com/activities/*
// @grant        GM_setClipboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555026/Strava%20HR%20Zones%20Extractor%20for%20non%20subscribers.user.js
// @updateURL https://update.greasyfork.org/scripts/555026/Strava%20HR%20Zones%20Extractor%20for%20non%20subscribers.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- CONFIG ----
  const DEFAULT_MAX_HR = 200; // edit in-script as desired
  // zone definitions: [name, lo_ratio, hi_ratio]
  const ZONES = [
    ["Zone 1 (Recovery)", 0.0, 0.60],
    ["Zone 2 (Endurance)", 0.60, 0.70],
    ["Zone 3 (Tempo)", 0.70, 0.80],
    ["Zone 4 (Threshold)", 0.80, 0.90],
    ["Zone 5 (Max Effort)", 0.90, 1.10]
  ];
  // ----------------

  // tiny helper to wait until document ready-ish
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(() => {
    // don't add multiple buttons
    if (document.getElementById('gm-hr-extract-btn')) return;
    addControlButton();
  });

  function addControlButton() {
    const btn = document.createElement('button');
    btn.id = 'gm-hr-extract-btn';
    btn.textContent = 'HR → Zones';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 99999,
      background: '#ff7a18',
      color: '#fff',
      border: 'none',
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
    });
    btn.addEventListener('click', runExtraction);
    document.body.appendChild(btn);
  }

  async function runExtraction() {
    const activityId = detectActivityId();
    if (!activityId) return alert('Activity id not found on this page.');

    // UI: overlay
    const overlay = createOverlay();
    try {
      overlay.setStatus('Locating HR data (inline JSON / page objects / fetch) ...');
      const { hr, time } = await extractHrAndTime(activityId);
      if (!hr || hr.length === 0) throw new Error('No HR samples found.');

      // compute sample durations (seconds)
      const durations = computeDurations(time, hr.length);

      // compute per-zone durations excluding zeros
      const maxHr = prompt('Enter max HR (used to compute bpm ranges). Leave blank to use default.', DEFAULT_MAX_HR) || DEFAULT_MAX_HR;
      const result = computeZones(hr, durations, Number(maxHr));

      // draw table + pie + copy button
      overlay.showResults(result, Number(maxHr));
    } catch (err) {
      console.error(err);
      overlay.setStatus('❌ Failed: ' + (err && err.message ? err.message : err));
    }
  }

  // Try multiple extraction strategies:
  // 1) inline JSON in <script> tags containing "heartrate":[...]
  // 2) window.pageView or other page-exposed objects
  // 3) fetch streams endpoint fallback
  async function extractHrAndTime(activityId) {
    // 1) inline JSON search
    const inline = findInlineHeartrate();
    if (inline) {
      console.log('HR found inline JSON');
      return inline;
    }

    // 2) attempt to read pageView (if available)
    try {
      const pv = window.pageView || window.Strava && window.Strava.pageView;
      if (pv) {
        // various pages expose streams differently; try common names
        const candidates = [
          pv.streams && pv.streams(),
          typeof pv.streams === 'function' && pv.streams(), // try call
          pv.streamsByType && pv.streamsByType(),
          pv.streamsByType && pv.streamsByType('heartrate'),
          (window.Strava && window.Strava.Streams && window.Strava.Streams.data) || null
        ];
        for (const c of candidates) {
          if (!c) continue;
          const res = normalizeStreamsObject(c);
          if (res) return res;
        }
      }
    } catch (e) {
      console.warn('pageView read failed', e);
    }

    // 3) fetch the streams endpoint (works if logged-in and permitted)
    try {
      const fallback = await fetchStreamsEndpoint(activityId);
      if (fallback) {
        console.log('HR fetched from streams endpoint');
        return fallback;
      }
    } catch (e) {
      console.warn('streams fetch failed', e);
    }

    throw new Error('Could not find heartrate stream on page.');
  }

  // --- Strategy helpers ---

  // search page <script> text nodes for "heartrate":[...]
  function findInlineHeartrate() {
    const scripts = Array.from(document.querySelectorAll('script'));
    const hrRegex = /"heartrate"\s*:\s*\[([^\]]+)\]/i;
    const timeRegex = /"time"\s*:\s*\[([^\]]+)\]/i;
    for (const s of scripts) {
      const txt = s.textContent;
      if (!txt) continue;
      const m = hrRegex.exec(txt);
      if (m) {
        try {
          // find the full array text and parse robustly
          const hrArr = parseNumberArrayToken(m[1]);
          let timeArr = null;
          const mt = timeRegex.exec(txt);
          if (mt) timeArr = parseNumberArrayToken(mt[1]);
          return { hr: hrArr, time: timeArr };
        } catch (e) {
          // continue searching
          console.warn('inline parse error', e);
        }
      }
    }
    return null;
  }

  // parse a comma-separated number list possibly with whitespace/newlines
  function parseNumberArrayToken(token) {
    return token
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(x => Number(x));
  }

  // normalize candidate stream object to {hr:[], time:[]}
  function normalizeStreamsObject(obj) {
    // obj might look like {heartrate: [...], time: [...]} or an array of {type:'heartrate', data:[...]}
    if (!obj) return null;
    if (Array.isArray(obj)) {
      // array of streams
      const hrEntry = obj.find(e => e.type === 'heartrate' || e.stream_type === 'heartrate' || e.key === 'heartrate');
      const timeEntry = obj.find(e => e.type === 'time' || e.key === 'time');
      const hr = hrEntry && (hrEntry.data || hrEntry.values || hrEntry.stream) ? (hrEntry.data || hrEntry.values || hrEntry.stream) : null;
      const time = timeEntry && (timeEntry.data || timeEntry.values || timeEntry.stream) ? (timeEntry.data || timeEntry.values || timeEntry.stream) : null;
      if (hr) return { hr: hr.slice(), time: time ? time.slice() : null };
    } else if (typeof obj === 'object') {
      if (obj.heartrate || obj.heart_rate || obj['heartrate']) {
        const hr = obj.heartrate || obj.heart_rate || obj['heartrate'];
        const time = obj.time || obj.timestamps || null;
        if (Array.isArray(hr)) return { hr: hr.slice(), time: Array.isArray(time) ? time.slice() : null };
      }
    }
    return null;
  }

  // fallback fetch — try endpoint used by strava web UI.
  // Constructed as /activities/<id>/streams?keys=heartrate,time&key_by_type=true
  async function fetchStreamsEndpoint(activityId) {
    // we will request heartrate and time; key_by_type often used by Strava to return keyed JSON
    const url = `/activities/${activityId}/streams?keys=heartrate,time,distance,velocity_smooth&key_by_type=true`;
    const resp = await fetch(url, { credentials: 'same-origin' });
    if (!resp.ok) {
      // second try: the plural-less type endpoint pattern sometimes exists
      const url2 = `/activities/${activityId}/streams/heartrate,time?key_by_type=true`;
      const r2 = await fetch(url2, { credentials: 'same-origin' });
      if (!r2.ok) throw new Error(`streams request failed ${resp.status}`);
      const json2 = await r2.json();
      return convertStreamsJson(json2);
    }
    const json = await resp.json();
    return convertStreamsJson(json);
  }

  function convertStreamsJson(json) {
    // json might be keyed by type or be an array
    if (!json) return null;
    // keyed
    if (json.heartrate && Array.isArray(json.heartrate.data || json.heartrate)) {
      const hr = Array.isArray(json.heartrate.data) ? json.heartrate.data : json.heartrate;
      const time = json.time ? (Array.isArray(json.time.data) ? json.time.data : json.time) : null;
      return { hr: hr.slice(), time: time ? time.slice() : null };
    }
    // array
    if (Array.isArray(json)) {
      return normalizeStreamsObject(json);
    }
    return null;
  }

  // compute per-sample durations (in seconds)
  // if timeArr present -> durations are diff between consecutive times (last sample uses same as previous)
  // if timeArr missing -> assume 1 second per sample
  function computeDurations(timeArr, sampleCount) {
    if (timeArr && timeArr.length >= sampleCount) {
      const durations = [];
      for (let i = 0; i < sampleCount; i++) {
        if (i === sampleCount - 1) {
          durations.push((timeArr[i] - (timeArr[i - 1] || timeArr[i])) || 1);
        } else {
          durations.push((timeArr[i + 1] - timeArr[i]) || 1);
        }
      }
      // replace zeros or negative with 1
      return durations.map(d => (d > 0 ? d : 1));
    } else {
      // fallback: 1 second per sample
      return new Array(sampleCount).fill(1);
    }
  }

  function computeZones(hrArr, durations, maxHr) {
    const zones = ZONES.map(z => ({
      name: z[0],
      loRatio: z[1],
      hiRatio: z[2],
      loBpm: Math.round(z[1] * maxHr),
      hiBpm: Math.round(z[2] * maxHr),
      seconds: 0
    }));

    let totalValidSeconds = 0;
    for (let i = 0; i < hrArr.length; i++) {
      const bpm = Number(hrArr[i]);
      const dur = Number(durations[i] || 1);
      if (!isFinite(bpm) || bpm <= 0) continue; // skip zeros/missing
      totalValidSeconds += dur;
      for (const z of zones) {
        if (bpm >= z.loBpm && bpm < z.hiBpm) {
          z.seconds += dur;
          break;
        }
      }
    }

    // compute minutes/percent
    const out = zones.map(z => {
      const mins = z.seconds / 60;
      const pct = totalValidSeconds > 0 ? (z.seconds / totalValidSeconds) * 100 : 0;
      return {
        Zone: z.name,
        Range: `${z.loBpm}-${z.hiBpm}`,
        TimeMin: Number(mins.toFixed(1)),
        Percent: Number(pct.toFixed(1)),
        Seconds: z.seconds
      };
    });

    return { zones: out, totalSeconds: totalValidSeconds };
  }

  // overlay UI builder
  function createOverlay() {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      right: '16px',
      bottom: '72px',
      zIndex: 99999,
      width: '360px',
      maxHeight: '70vh',
      overflow: 'auto',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
      padding: '12px',
      fontFamily: 'Arial, sans-serif'
    });
    document.body.appendChild(container);

    const status = document.createElement('div');
    status.style.marginBottom = '8px';
    container.appendChild(status);

    function setStatus(txt) {
      status.textContent = txt;
    }
    setStatus('Ready.');

    let resultArea = null;

    function showResults(result, maxHr) {
      container.innerHTML = ''; // clear
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.innerHTML = `<strong>HR Zone Distribution (maxHR=${maxHr})</strong>`;
      container.appendChild(header);

      // table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '8px';
      table.innerHTML = `<thead><tr>
        <th style="text-align:left">Zone</th>
        <th style="text-align:right">Range (bpm)</th>
        <th style="text-align:right">Time (min)</th>
        <th style="text-align:right">Percent</th>
      </tr></thead>`;
      const tbody = document.createElement('tbody');
      for (const z of result.zones) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${z.Zone}</td>
                        <td style="text-align:right">${z.Range}</td>
                        <td style="text-align:right">${z.TimeMin}</td>
                        <td style="text-align:right">${z.Percent}%</td>`;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      container.appendChild(table);

      // canvas pie
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      canvas.style.display = 'block';
      canvas.style.margin = '12px auto';
      container.appendChild(canvas);

      // draw pie
      drawPie(canvas, result.zones.map(z => z.Percent), result.zones.map(z => z.Zone));

      // CSV & copy button
      const csvText = makeCsv(result, maxHr);
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy CSV to clipboard';
      Object.assign(copyBtn.style, { display: 'inline-block', marginTop: '6px', padding: '6px 8px', cursor: 'pointer' });
      copyBtn.addEventListener('click', () => {
        // use navigator.clipboard where available, otherwise GM_setClipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(csvText).then(() => alert('Copied CSV to clipboard'));
        } else if (typeof GM_setClipboard === 'function') {
          GM_setClipboard(csvText);
          alert('Copied CSV to clipboard (GM_setClipboard)');
        } else {
          // fallback: textarea
          const ta = document.createElement('textarea');
          ta.value = csvText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          alert('Copied CSV to clipboard (fallback)');
        }
      });
      container.appendChild(copyBtn);

      // raw download (optional)
      const dl = document.createElement('a');
      dl.textContent = 'Download CSV';
      dl.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
      dl.download = `hr_zones_activity.csv`;
      Object.assign(dl.style, { display: 'inline-block', marginLeft: '8px', marginTop: '6px' });
      container.appendChild(dl);

      // status
      const summary = document.createElement('div');
      summary.style.marginTop = '8px';
      summary.innerHTML = `<small>Total HR sample time (non-zero): ${(result.totalSeconds/60).toFixed(2)} min</small>`;
      container.appendChild(summary);
    }

    function setStatusText(t) {
      setStatus(t);
    }

    return {
      setStatus: setStatusText,
      showResults
    };
  }

  function drawPie(canvas, values, labels) {
    const ctx = canvas.getContext('2d');
    const total = values.reduce((s, v) => s + v, 0) || 1;
    // simple palette
    const palette = ['#4CAF50','#2196F3','#FFC107','#FF5722','#E91E63','#9C27B0','#00BCD4'];
    let start = -0.5 * Math.PI;
    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx,cy)-6;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      const ang = (v/total) * (2*Math.PI);
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,start,start+ang);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      start += ang;
    }
    // draw legend
    const legendX = 8;
    let legendY = 8;
    ctx.font = '12px Arial';
    for (let i = 0; i < values.length; i++) {
      ctx.fillStyle = palette[i % palette.length];
      ctx.fillRect(canvas.width - 140, legendY, 12, 12);
      ctx.fillStyle = '#000';
      ctx.fillText(`${labels[i]} (${values[i]}%)`, canvas.width - 120, legendY + 11);
      legendY += 18;
    }
  }

  function makeCsv(result, maxHr) {
    const rows = [['Zone','Range (bpm)','Time (min)','Percent']];
    for (const z of result.zones) rows.push([z.Zone, z.Range, z.TimeMin, `${z.Percent}%`]);
    return rows.map(r => r.join(',')).join('\n');
  }

  // find activity id from URL or from pageView declaration in page
  function detectActivityId() {
    // try URL first: /activities/<id>
    const m = location.pathname.match(/\/activities\/(\d+)/);
    if (m) return m[1];
    // try pageView global script text
    try {
      if (window.pageView && window.pageView.activityId) return window.pageView.activityId;
      if (window.pageView && window.pageView.activity && window.pageView.activity().id) return window.pageView.activity().id;
    } catch (e) {}
    // search inline scripts for "new Strava.Labs.Activities.Pages.RunPageView(<id>"
    const scripts = Array.from(document.querySelectorAll('script'));
    const rx = /RunPageView\s*\(\s*(\d+)\s*,/;
    for (const s of scripts) {
      const t = s.textContent;
      if (!t) continue;
      const mm = rx.exec(t);
      if (mm) return mm[1];
    }
    return null;
  }

})();
