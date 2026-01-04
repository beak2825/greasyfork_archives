// ==UserScript==
// @name         WaniKani Stroke Order + Last-Stroke Marker (KanjiVG)
// @namespace    https://wanikani.com
// @version      1.4
// @description  Thumbnails per stroke (KanjiVG). Jisho Style. Previous strokes semi-opaque black, last stroke full black + red dot. SPA-safe, launches without reload.
// @match        https://www.wanikani.com/*
// @author       NoahCha + ChatGPT
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555989/WaniKani%20Stroke%20Order%20%2B%20Last-Stroke%20Marker%20%28KanjiVG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555989/WaniKani%20Stroke%20Order%20%2B%20Last-Stroke%20Marker%20%28KanjiVG%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------------------------------
        CSS
  -------------------------------- */
  const css = `
.wk-sos-box {
  margin: 18px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  background: #fff;
  box-shadow: 0 1px 0 rgba(16,24,40,0.03);
}
.wk-sos-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 16px;
}
.wk-sos-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
.wk-sos-item {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px;
  text-align: center;
}
.wk-sos-thumb {
  width: 100%;
  height: auto;
  display:block;
}
.wk-sos-label {
  margin-top: 6px;
  font-size: 12px;
  color: #333;
}
.wk-sos-loading {
  font-size: 13px;
  color: #666;
}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* -------------------------------
      HELPERS
  -------------------------------- */
  const getKanjiFromURL = () =>
    decodeURIComponent(location.pathname.replace('/kanji/', '')).match(/[\u4e00-\u9faf\u3400-\u4dbf]/)?.[0] || null;

  const findReadingsSection = () =>
    document.querySelector('[data-subject-section="readings"]')
    || Array.from(document.querySelectorAll('h2,h3'))
        .find(x => x.textContent.trim() === 'Readings')?.closest('.subject-section');

  const kanjiVGUrl = ch =>
    `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${ch.codePointAt(0).toString(16).padStart(5,"0")}.svg`;

  const fetchText = async url => {
    const r = await fetch(url, { cache: "force-cache" });
    if (!r.ok) throw new Error("fetch failed");
    return r.text();
  };

  const extractStrokes = doc => {
    const svg = doc.querySelector("svg");
    if (!svg) return { viewBox:"0 0 109 109", strokes:[] };

    const viewBox = svg.getAttribute("viewBox") || "0 0 109 109";
    const groups = Array.from(svg.querySelectorAll('[id*="-s"]'));
    const map = new Map();

    for (let g of groups) {
      const m = g.id.match(/-s(\d+)$/);
      if (!m) continue;
      const n = parseInt(m[1]);
      if (!map.has(n)) map.set(n, []);
      map.get(n).push(g);
    }

    return {
      viewBox,
      strokes: [...map.entries()]
        .sort((a,b)=>a[0]-b[0])
        .map(([n,nodes]) => ({n, nodes}))
    };
  };

  const getPathStartCoordsFromD = d => {
    if (!d) return null;
    const m = d.match(/M\s*([\-0-9.]+)[,\s]+([\-0-9.]+)/i);
    if (m) return { x:parseFloat(m[1]), y:parseFloat(m[2]) };
    return null;
  };

  function buildMiniSVG(viewBox, prevHtml, lastHtml, lastPathD) {
    const start = getPathStartCoordsFromD(lastPathD);
    const dot = start ? `<circle cx="${start.x}" cy="${start.y}" r="3.5" fill="#ff3b30"/>` : '';
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g stroke="#000" stroke-opacity="0.5" stroke-width="2.3">${prevHtml}</g>
  <g stroke="#000" stroke-opacity="1"   stroke-width="2.8">${lastHtml}</g>
  ${dot}
</svg>`;
  }

  /* -------------------------------
        MAIN
  -------------------------------- */
  let lastKanji = null;

  async function generate(char) {
    const readings = findReadingsSection();
    if (!readings || readings.querySelector(".wk-sos-box")) return;

    const box = document.createElement("div");
    box.className = "wk-sos-box";
    box.innerHTML = `<div class="wk-sos-title">Stroke Order</div>
                     <div class="wk-sos-loading">Loading…</div>`;
    readings.prepend(box);

    let svgText = null;
    try {
      svgText = await fetchText(kanjiVGUrl(char));
    } catch {
      box.innerHTML = `<div class="wk-sos-title">Stroke Order</div>
                       <div class="wk-sos-loading">KanjiVG unavailable.</div>`;
      return;
    }

    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const { viewBox, strokes } = extractStrokes(doc);
    if (!strokes.length) {
      box.innerHTML = `<div class="wk-sos-title">Stroke Order</div>
                       <div class="wk-sos-loading">No stroke data.</div>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "wk-sos-grid";

    const urls = [];
    const accumulated = [];

    for (let i = 0; i < strokes.length; i++) {
      const step = strokes[i];
      for (const n of step.nodes) accumulated.push(n);

      const prev = accumulated.slice(0, accumulated.length - step.nodes.length);
      const last = step.nodes;

      const prevHtml = prev.map(p => {
        const c = p.cloneNode(true); c.removeAttribute("stroke"); c.removeAttribute("fill"); return c.outerHTML;
      }).join("");

      const lastHtml = last.map(p => {
        const c = p.cloneNode(true); c.removeAttribute("stroke"); c.removeAttribute("fill"); return c.outerHTML;
      }).join("");

      let lastD = null;
      for (let n of last)
        if (n.tagName.toLowerCase() === "path") { lastD = n.getAttribute("d"); break; }

      const svg = buildMiniSVG(viewBox, prevHtml, lastHtml, lastD);
      const url = URL.createObjectURL(new Blob([svg], {type:"image/svg+xml"}));
      urls.push(url);

      const div = document.createElement("div");
      div.className = "wk-sos-item";
      div.innerHTML = `<img class="wk-sos-thumb" src="${url}">
                       <div class="wk-sos-label">Step ${i+1}</div>`;
      grid.appendChild(div);
    }

    box.innerHTML = `<div class="wk-sos-title">Stroke Order</div>`;
    box.appendChild(grid);

    setTimeout(() => urls.forEach(u => URL.revokeObjectURL(u)), 60000);
  }

  /* -------------------------------
      AUTO-INJECT — RELIABLE VERSION
  -------------------------------- */
  function onURLChange() {
    const k = getKanjiFromURL();
    if (k && k !== lastKanji) {
      lastKanji = k;
      const check = setInterval(() => {
        const r = findReadingsSection();
        if (r) { clearInterval(check); generate(k); }
      }, 80);
      setTimeout(() => clearInterval(check), 3000);
    }
  }

  // Detect navigation changes
  document.addEventListener("turbo:load", onURLChange);
  window.addEventListener("popstate", onURLChange);

  const push = history.pushState;
  history.pushState = function () {
    push.apply(this, arguments);
    onURLChange();
  };

  // First page load
  onURLChange();

})();
