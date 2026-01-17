// ==UserScript==
// @name         Berkutschi JSON -> Tabulka skokanů
// @namespace    kvido
// @version      1.0.7
// @description  Jednoduchá tabulka, ID řádku = jmeno_prijmeni + náhodný refresh
// @match        https://live.berkutschi.com/events/*.json
// @author       LM
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562901/Berkutschi%20JSON%20-%3E%20Tabulka%20skokan%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/562901/Berkutschi%20JSON%20-%3E%20Tabulka%20skokan%C5%AF.meta.js
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

  // "tvorba id do řádků"
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

  function pickResults(json) {
    if (Array.isArray(json?.results)) return json.results;
    if (Array.isArray(json?.data?.results)) return json.data.results;
    return [];
  }

  function build(rows) {
    rows.sort((a, b) => Number(a.final_rank) - Number(b.final_rank));

    document.open();
    document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Berkutschi – výsledky</title>
<style>
  body { background:#fff; color:#000; font-family:Arial,Helvetica,sans-serif; padding:20px; }
  table { border-collapse:collapse; margin:auto; width:860px; }
  th, td { border:1px solid #000; padding:6px 8px; text-align:center; }
  th { font-weight:bold; }
</style>
</head>
<body>
<table>
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

<script>
(function(){
  const delays=[10000,15000,20000];
  const delay=delays[Math.floor(Math.random()*delays.length)];
  setTimeout(()=>location.reload(), delay);
})();
</script>

</body>
</html>`);
    document.close();
  }

  function main() {
    try {
      const raw = getRawJsonText();
      if (!raw) return;

      const json = JSON.parse(raw);
      const results = pickResults(json);

      const rows = results.map(r => ({
        _id: idFromName(r.name),
        name: r.name ?? "",
        final_rank: r.final_rank ?? "",
        length1: r.length1 ?? "",
        points1: r.points1 ?? "",
        length2: r.length2 ?? "",
        points2: r.points2 ?? ""
      }));

      build(rows);
    } catch (e) {
      console.error("Berkutschi table error:", e);
    }
  }

  // @run-at document-start: počkej, až existuje <pre>
  const tryRun = () => {
    if (document.querySelector("pre") || document.readyState !== "loading") main();
    else setTimeout(tryRun, 20);
  };
  tryRun();
})();
