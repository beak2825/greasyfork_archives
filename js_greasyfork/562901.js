// ==UserScript==
// @name         Berkutschi JSON -> Tabulka skokanů + status
// @namespace    kvido
// @version      1.1.0
// @description  Tabulka jmen + výkonů (obě kola) + statusu
// @match        https://live.berkutschi.com/events/*.json
// @author       LM
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562901/Berkutschi%20JSON%20-%3E%20Tabulka%20skokan%C5%AF%20%2B%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/562901/Berkutschi%20JSON%20-%3E%20Tabulka%20skokan%C5%AF%20%2B%20status.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function n(v) {
    if (v === null || v === undefined) return "";
    const num = Number(v);
    return Number.isFinite(num) ? String(num) : "";
  }

  function idFromName(nameRaw) {
    const name = String(nameRaw ?? "").trim();
    let first = "", last = "";

    if (name.includes(",")) {
      const parts = name.split(",");
      last = (parts[0] || "").trim();
      first = (parts.slice(1).join(",") || "").trim();
    } else {
      const parts = name.split(/\s+/).filter(Boolean);
      first = parts[0] || "";
      last = parts.slice(1).join("_") || "";
    }

    return `${first}_${last}`
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function getRawJsonText() {
    const pre = document.querySelector("pre");
    const raw = (pre ? pre.textContent : document.documentElement?.textContent) || "";
    return raw.trim();
  }

  function pickJumpers(json) {
    if (Array.isArray(json?.jumpers)) return json.jumpers;
    if (Array.isArray(json?.startlist?.jumpers)) return json.startlist.jumpers;
    if (Array.isArray(json?.data?.jumpers)) return json.data.jumpers;
    if (Array.isArray(json?.data?.startlist?.jumpers)) return json.data.startlist.jumpers;
    return [];
  }

  function pickResults(json) {
    if (Array.isArray(json?.results)) return json.results;
    if (Array.isArray(json?.data?.results)) return json.data.results;
    return [];
  }

  function pickStatusText(json) {
    const msgs =
      (Array.isArray(json?.messages) ? json.messages :
      Array.isArray(json?.data?.messages) ? json.data.messages :
      []);

    if (!msgs.length) return "";

    // poslední zpráva = nejaktuálnější
    const last = msgs[msgs.length - 1];
    return String(last?.text ?? "").trim();
  }

  function formatNameFromJumper(j) {
    const last = String(j?.lastname ?? "").trim();
    const first = String(j?.firstname ?? "").trim();
    const name = `${last}, ${first}`.trim();
    return name === "," ? "" : name;
  }

  function build(rows, statusText) {
    rows.sort((a, b) => {
      const ar = Number(a.final_rank);
      const br = Number(b.final_rank);
      if (Number.isFinite(ar) && Number.isFinite(br)) return ar - br;

      const ab = Number(a.bib);
      const bb = Number(b.bib);
      if (Number.isFinite(ab) && Number.isFinite(bb)) return ab - bb;

      return 0;
    });

    document.open();
    document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Berkutschi – výsledky</title>
<style>
  body { background:#fff; color:#000; font-family:Arial,Helvetica,sans-serif; padding:20px; }
  .wrap { width: 1100px; margin: 0 auto; display:flex; gap:20px; align-items:flex-start; }
  table { border-collapse:collapse; background:#fff; }
  .main { width:860px; }
  th, td { border:1px solid #000; padding:6px 8px; text-align:center; }
  th { font-weight:bold; }
  .status { width: 220px; }
  .status td { text-align:left; }
</style>
</head>
<body>

<div class="wrap">
  <table class="main">
    <thead>
      <tr>
        <th>Pořadí</th>
        <th>Jméno</th>
        <th>Délka 1</th>
        <th>Body 1</th>
        <th>Délka 2</th>
        <th>Body 2</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
      <tr id="${esc(r._id)}">
        <td>${esc(n(r.final_rank))}</td>
        <td>${esc(r.name)}</td>
        <td>${esc(n(r.length1))}</td>
        <td>${esc(n(r.points1))}</td>
        <td>${esc(n(r.length2))}</td>
        <td>${esc(n(r.points2))}</td>
      </tr>`).join("")}
    </tbody>
  </table>

  <table class="status">
  <thead>
    <tr><th>Status</th></tr>
  </thead>
  <tbody>
    <tr>
      <td id="status">${esc(statusText)}</td>
    </tr>
  </tbody>
</table>
</div>
</body>
</html>`);
    document.close();
  }

  function main() {
    try {
      const raw = getRawJsonText();
      if (!raw) return;

      const json = JSON.parse(raw);

      const jumpers = pickJumpers(json);
      const results = pickResults(json);
      const statusText = pickStatusText(json);

      const resultsByBib = new Map();
      for (const r of results) {
        const bib = String(r?.bib ?? "").trim();
        if (bib) resultsByBib.set(bib, r);
      }

      const rows = jumpers.map(j => {
        const bib = String(j?.bib ?? "").trim();
        const res = bib ? resultsByBib.get(bib) : undefined;

        const displayName = formatNameFromJumper(j); // "SATO, Keiichi"
        const id = idFromName(displayName);          // "keiichi_sato"

        return {
          bib,
          _id: id,
          name: displayName,
          final_rank: res?.final_rank ?? "",
          length1: res?.length1 ?? "",
          points1: res?.points1 ?? "",
          length2: res?.length2 ?? "",
          points2: res?.points2 ?? ""
        };
      });

      build(rows, statusText);
    } catch (e) {
      console.error("Berkutschi table error:", e);
    }
  }

  const tryRun = () => {
    if (document.querySelector("pre") || document.readyState !== "loading") main();
    else setTimeout(tryRun, 20);
  };
  tryRun();
})();