// ==UserScript==
// @name         Ufcstats.com DOM Mapper
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Full text export with a deep DOM report, UFC events CSV, and optional fight-details stats JSON mode with outcome metadata, per-round TDs, winner flags, and event date/bout order.
// @author       You
// @match        http://ufcstats.com/*
// @match        https://ufcstats.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552459/Ufcstatscom%20DOM%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/552459/Ufcstatscom%20DOM%20Mapper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------------------------
  // Global toggles
  // ---------------------------
  window.targetedMode  = window.targetedMode  !== undefined ? window.targetedMode  : true;  // events CSV on event pages
  window.fancyMode     = window.fancyMode     !== undefined ? window.fancyMode     : true;  // styled DOM report
  window.jsonMode      = window.jsonMode      !== undefined ? window.jsonMode      : false; // wrap report+csv into JSON
  window.statsJsonMode = window.statsJsonMode !== undefined ? window.statsJsonMode : false; // fight-details JSON

  // ---------------------------
  // Small helpers
  // ---------------------------
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
  const safe = (s) => (s || "").replace(/\s+/g, " ").trim();
  const text = (el) => safe(el ? el.textContent : "");
  const toInt = (v, d = 0) => {
    const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : d;
  };
  const basename = (p) => (p || "").split("/").filter(Boolean).pop() || "";
  const nowISOshort = () => new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const nowISOfs = () => new Date().toISOString().replace(/:/g, "-"); // keep ms and Z

  function convertTimeToSeconds(timeStr) {
    const s = safe(timeStr);
    if (!s) return 0;
    if (s.includes(":")) {
      const [m, sec] = s.split(":");
      return (toInt(m) * 60) + toInt(sec);
    }
    return toInt(s);
  }
  function formatTimeDisplay(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  // ---------------------------
  // DOM report (unchanged core)
  // ---------------------------
  const isElem = (n) => n && n.nodeType === 1;
  const elChildren = (n) => Array.from(n.children || []);
  function countAllElements() { return document.querySelectorAll("*").length; }
  function countAnalyzed(root) {
    let c = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        return skipTags.has(node.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) c++;
    return c;
  }
  function cssPiece(el) {
    const tag = el.tagName.toLowerCase();
    const id  = el.id ? "#" + el.id : "";
    const cls = (el.className && typeof el.className === "string" && el.className.trim())
      ? "." + el.className.trim().replace(/\s+/g, ".")
      : "";
    return tag + id + cls;
  }
  function cssPath(el, maxLen = 160) {
    const chain = [];
    let cur = el;
    while (cur && cur.nodeType === 1 && cur !== document.documentElement) {
      chain.push(cssPiece(cur));
      if (cur.tagName === "BODY") break;
      cur = cur.parentElement;
    }
    chain.reverse();
    let s = chain.join(" > ");
    if (s.length <= maxLen) return s;
    const parts = s.split(" > ");
    if (parts.length <= 6) return s.slice(0, maxLen - 3) + "...";
    const head = parts.slice(0, 3).join(" > ");
    const tail = parts.slice(-3).join(" > ");
    return head + " > ... > " + tail;
  }
  function kindFor(el) {
    const t = (el.tagName || "").toUpperCase();
    if (t === "HTML") return "html";
    if (t === "BODY") return "body";
    if (t === "HEADER") return "header";
    if (t === "SECTION") return "section";
    if (t === "A") return "a";
    if (t === "IMG") return "img";
    if (t === "H2") return "h2";
    if (t === "H3") return "h3";
    if (t === "P") return "p";
    if (t === "TABLE") return "table";
    if (t === "THEAD") return "thead";
    if (t === "TBODY") return "tbody";
    if (t === "TR") return "tr";
    if (t === "TD") return "td";
    if (t === "TH") return "th";
    if (t === "LI") return "li";
    return el.children && el.children.length ? "container" : "leaf";
  }
  function icons(tag, kind) {
    if (!window.fancyMode) {
      const plain = {
        container: "[+]", leaf: "[ ]", a: "[A]", img: "[IMG]", header: "[HEADER]", section: "[SECTION]",
        table: "[TABLE]", thead: "[THEAD]", tbody: "[TBODY]", tr: "[TR]", td: "[TD]", th: "[TH]",
        h2: "[H2]", h3: "[H3]", p: "[P]", html: "[HTML]", body: "[BODY]", li: "- LI", target: "=>"
      };
      return plain[kind] || plain.leaf;
    }
    const fancy = {
      container: "📂", leaf: "📄", a: "🔲 A 🖱️", img: "🎯 IMG 🎯", header: "🏠 HEADER 🏗️", section: "📄 SECTION 🏗️",
      table: "📊 TABLE", thead: "📂 THEAD", tbody: "📂 TBODY", tr: "📂 TR", td: "📂 TD", th: "📄 TH",
      h2: "📝 H2 📝", h3: "📝 H3 📝", p: "📃 P", html: "📂 HTML", body: "📂 BODY", li: "•  LI", target: "🎯"
    };
    return fancy[kind] || fancy.leaf;
  }
  function deepStructureReport(root, depthMax = 18) {
    const t0 = performance.now();
    const total = countAllElements();
    const analyzed = countAnalyzed(root);
    let deepest = 0;
    const ua = navigator.userAgent;
    const site = location.hostname;
    const url  = location.href;
    const lines = [];
    const bar = window.fancyMode
      ? "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      : "================================================================";
    const title = window.fancyMode
      ? "🏗️ DOM STRUCTURE ANALYSIS - EXPORT READY"
      : "DOM STRUCTURE ANALYSIS - EXPORT READY";
    lines.push(title);
    lines.push(bar);
    lines.push("");
    lines.push((window.fancyMode ? "🌐 Site: " : "Site: ") + site);
    lines.push((window.fancyMode ? "📄 URL: " : "URL: ") + url);
    lines.push((window.fancyMode ? "📅 Generated: " : "Generated: ") + new Date().toLocaleString());
    lines.push((window.fancyMode ? "📊 Elements: " : "Elements: ") + total + " total -> " + analyzed + " analyzed");
    lines.push((window.fancyMode ? "🔍 Mode: " : "Mode: ") + (window.fancyMode ? "🏗️ Deep Structure Analysis" : "Deep Structure Analysis"));
    lines.push((window.fancyMode ? "📏 Max Depth: " : "Max Depth: ") + depthMax + " levels");
    lines.push((window.fancyMode ? "🖥️ User Agent: " : "User Agent: ") + ua);
    lines.push("");
    lines.push(bar);
    lines.push("");
    function lineFor(el, depth) {
      const k = kindFor(el);
      const cls = safe(el.className);
      const id  = safe(el.id);
      const kidCount = elChildren(el).length;
      const indent = "  ".repeat(depth);
      const L = "(L" + depth + ")";
      deepest = Math.max(deepest, depth);
      let head = icons(null, k);
      let tagName = el.tagName.toUpperCase();
      let meta = [];
      if (cls) meta.push("Classes: " + cls.split(/\s+/).map(c => "." + c).join(", "));
      if (id)  meta.push("Id: #" + id);
      if (tagName === "A") {
        const t = safe(el.textContent);
        const href = el.getAttribute("href") || "";
        meta.push('"' + t + '"');
        if (href) meta.push("href: " + JSON.stringify(href));
      } else if (tagName === "IMG") {
        const src = el.getAttribute("src") || "";
        if (src) meta.push('src: "' + basename(src) + '"');
      } else if (/^H[1-6]$/.test(tagName) || tagName === "P") {
        const t = safe(el.textContent);
        if (t) meta.push('"' + t + '"');
      }
      let childInfo = "";
      if (kidCount > 0) {
        const kinds = elChildren(el).slice(0, 6).map(c => (c.tagName || "").toLowerCase());
        const tail = kidCount > 6 ? "..." : "";
        childInfo = kidCount + " children (" + kinds.join(", ") + tail + ")";
      }
      const main = indent + head + " | " + "Tag: " + tagName + (meta.length ? " | " + meta.join(" | ") : "") + (childInfo ? " | " + childInfo : "");
      const out = [main];
      const sel = cssPath(el);
      out.push(indent + (window.fancyMode ? icons(null, "target") : "=>") + " " + sel + " " + L);
      return out.join("\n");
    }
    function walk(node, depth) {
      if (!isElem(node)) return;
      if (skipTags.has(node.tagName)) return;
      if (depth > depthMax) return;
      lines.push(lineFor(node, depth));
      elChildren(node).forEach(child => walk(child, depth + 1));
    }
    walk(document.documentElement, 0);
    const took = Math.round(performance.now() - t0) + "ms";
    const mdIdx = lines.findIndex(s => s.indexOf("Max Depth") >= 0);
    if (mdIdx !== -1) lines.splice(mdIdx + 1, 0, (window.fancyMode ? "⚡ Analysis Time: " : "Analysis Time: ") + took);
    return lines.join("\n");
  }

  // ---------------------------
  // UFC event CSV (existing feature)
  // ---------------------------
  function validateEventData(eventTitle) {
    const currentYear = new Date().getFullYear();
    const m = (eventTitle || "").match(/UFC\s+(\d+)/i);
    if (m) {
      const eventNum = parseInt(m[1], 10);
      const maxExpectedEvent = 300 + Math.max(0, (currentYear - 2024)) * 12;
      if (eventNum > maxExpectedEvent) {
        console.warn(`Potential future/invalid event detected: ${eventTitle}`);
        return false;
      }
    }
    return true;
  }
  function calculateAccuracyMetrics(strL1, strL2, tdL1, tdL2) {
    const avgStrikingAccuracy = 0.45;
    const avgTakedownAccuracy = 0.35;
    const strAttempts1 = strL1 > 0 ? Math.round(strL1 / avgStrikingAccuracy) : 0;
    const strAttempts2 = strL2 > 0 ? Math.round(strL2 / avgStrikingAccuracy) : 0;
    const tdAttempts1  = tdL1 > 0 ? Math.round(tdL1  / avgTakedownAccuracy)  : 0;
    const tdAttempts2  = tdL2 > 0 ? Math.round(tdL2  / avgTakedownAccuracy)  : 0;
    const strAcc1 = strAttempts1 > 0 ? ((strL1 / strAttempts1) * 100).toFixed(1) : "0.0";
    const strAcc2 = strAttempts2 > 0 ? ((strL2 / strAttempts2) * 100).toFixed(1) : "0.0";
    const tdAcc1  = tdAttempts1  > 0 ? ((tdL1  / tdAttempts1)  * 100).toFixed(1) : "0.0";
    const tdAcc2  = tdAttempts2  > 0 ? ((tdL2  / tdAttempts2)  * 100).toFixed(1) : "0.0";
    return { strAcc1, strAcc2, tdAcc1, tdAcc2, strAttempts1, strAttempts2, tdAttempts1, tdAttempts2 };
  }
  function extractUfcFights(tbody) {
    if (!tbody) return "";
    const titleEl = document.querySelector("h2.b-content__title");
    const eventTitle = titleEl ? safe(titleEl.textContent) : "Unknown Event";
    if (!validateEventData(eventTitle)) console.warn("Event validation failed, proceeding with caution");
    const trs = Array.from(tbody.querySelectorAll("tr[data-link]"));
    const totalBouts = trs.length;
    const fights = [];
    const issues = [];
    trs.forEach((tr, index) => {
      const boutOrder = `Bout ${index + 1}/${totalBouts}`;
      const bout = tr.dataset.link || "";
      const tds = tr.querySelectorAll("td");
      if (tds.length < 8) return;
      const wl = safe(tds[0].textContent).toLowerCase();
      const result = wl.includes("win") ? "Win" : wl.includes("draw") ? "Draw" : "Loss";
      const f1Links = tds[1].querySelectorAll("p a");
      const f1     = safe(f1Links[0]?.textContent);
      const f1Href = f1Links[0]?.href || "";
      const f2     = safe(f1Links[1]?.textContent);
      const f2Href = f1Links[1]?.href || "";
      const numPair = (td) => {
        const ps = td.querySelectorAll("p");
        const a = toInt(text(ps[0]));
        const b = toInt(text(ps[1]));
        return [a, b];
      };
      const [kdL1, kdL2]   = numPair(tds[2]);
      const [strL1, strL2] = numPair(tds[3]);
      const [tdL1, tdL2]   = numPair(tds[4]);
      const [subL1, subL2] = numPair(tds[5]);
      const weight = safe(tds[6].textContent);
      const methodPs = tds[7].querySelectorAll("p");
      let method = safe(methodPs[0]?.textContent);
      let detail = safe(methodPs[1]?.textContent);
      let round  = safe(methodPs[2]?.textContent);
      let time   = safe(methodPs[3]?.textContent);
      if (methodPs.length === 1) {
        const parts = method.split(" ");
        method = parts[0] || "";
        round  = parts.length > 1 ? parts.slice(1).join(" ") : "";
        detail = "";
        time   = "";
      }
      let formattedTime = time;
      if (time && time.length >= 3) formattedTime = formatTimeDisplay(convertTimeToSeconds(time));
      const acc = calculateAccuracyMetrics(strL1, strL2, tdL1, tdL2);
      if (!round && !time && (/KO/i.test(method) || /SUB/i.test(method))) issues.push(`${f1} vs ${f2}: Missing finish time/round for ${method}`);
      if (strL1 === 0 && strL2 === 0 && round === "5") issues.push(`${f1} vs ${f2}: Suspicious - no strikes in 5-round fight`);
      if (/^Ar/i.test(detail) && /SUB/i.test(method)) detail = "Armbar";
      if (/^Re/i.test(detail) && /SUB/i.test(method)) detail = "Rear Naked Choke";
      if (/^Gu/i.test(detail) && /SUB/i.test(method)) detail = "Guillotine Choke";
      fights.push([
        boutOrder, bout, result,
        f1, f1Href, kdL1, strL1, acc.strAcc1, acc.strAttempts1, tdL1, acc.tdAcc1, acc.tdAttempts1, subL1,
        f2, f2Href, kdL2, strL2, acc.strAcc2, acc.strAttempts2, tdL2, acc.tdAcc2, acc.tdAttempts2, subL2,
        weight, method, detail, round, formattedTime
      ].join("\t"));
    });
    let header = `Event: ${eventTitle}\n`;
    if (issues.length > 0) {
      header += `Data Quality Issues Found: ${issues.length}\n`;
      header += issues.map(x => `- ${x}`).join("\n") + "\n";
    }
    header += [
      "BoutOrder","Bout","Result",
      "F1","F1Href","KdL1","StrL1","StrAcc1%","StrAtt1","TdL1","TdAcc1%","TdAtt1","SubL1",
      "F2","F2Href","KdL2","StrL2","StrAcc2%","StrAtt2","TdL2","TdAcc2%","TdAtt2","SubL2",
      "Weight","Method","Detail","Round","Time"
    ].join("\t") + "\n";
    return header + fights.join("\n");
  }

  // ---------------------------
  // Fight-details JSON mode (new)
  // ---------------------------
  function isFightDetailsPage() {
    return /\/fight-details\//i.test(location.pathname);
  }
  function getFightId() {
    const m = location.pathname.match(/fight-details\/([^/?#]+)/i);
    return m ? m[1] : "";
  }
  function getHeaderFighters() {
    const persons = Array.from(document.querySelectorAll(".b-fight-details__person"));
    const out = persons.slice(0, 2).map(p => {
      const nameEl = p.querySelector(".b-fight-details__person-name a");
      const name = text(nameEl);
      const link = nameEl ? nameEl.href : "";
      const statusEl = p.querySelector(".b-fight-details__person-status");
      const w = /w/i.test(text(statusEl));
      return { name, link, winner: w };
    });
    // Fallback if none marked winner: infer by result banner
    if (!out.some(f => f.winner)) {
      const res = text(document.querySelector(".b-fight-details__fight-title"));
      if (/def\./i.test(res) && out.length === 2) {
        // "A def. B" - mark left as winner if pattern ambiguous
        out[0].winner = true;
      }
    }
    return out;
  }
  function getLabelMap() {
    // Scrape common "Label: Value" locations
    const nodes = [
      ...document.querySelectorAll(".b-fight-details__content .b-fight-details__text"),
      ...document.querySelectorAll(".b-list__box-list li"),
      ...document.querySelectorAll(".b-fight-details__content p"),
      ...document.querySelectorAll(".b-fight-details__content li")
    ];
    const map = {};
    nodes.forEach(n => {
      const t = text(n);
      const m = t.match(/^([^:]+):\s*(.+)$/);
      if (m) map[m[1].toLowerCase()] = m[2];
    });
    return map;
  }
  function getEventInfo() {
    const eventLink = document.querySelector(".b-fight-details__content a.b-link");
    const name = text(eventLink);
    const link = eventLink ? eventLink.href : "";
    const labels = getLabelMap();
    // Date often in "Date:" or in the small metadata box
    const date = labels["date"] || "";
    return { name, date, link };
  }
  function getWeightClass() {
    // Try fight title: "Featherweight Bout" or "Catch Weight Bout"
    const t = text(document.querySelector(".b-fight-details__fight-title"));
    const m = t.match(/([A-Za-z ]+)\s+Bout/i);
    if (m) return safe(m[1]);
    // Fallback to labeled field if exists
    const labels = getLabelMap();
    return labels["weight class"] || "";
  }
  function getOutcomeMeta() {
    const labels = getLabelMap();
    // Method may appear as "Method: KO/TKO" and detail sometimes separate as "Details: Rear Naked Choke"
    const method = labels["method"] || "";
    const methodDetail = labels["details"] || "";
    const endRound = toInt(labels["round"] || "");
    const endTimeStr = labels["time"] || "";
    const endTimeSeconds = convertTimeToSeconds(endTimeStr);
    const referee = labels["referee"] || "";
    return { method, method_detail: methodDetail, end_round: endRound, end_time_str: endTimeStr, end_time_seconds: endTimeSeconds, referee };
  }
  function parseXofY(s) {
    // "0 of 3 0%" -> [0,3]
    const m = String(s || "").match(/(\d+)\s*of\s*(\d+)/i);
    return m ? [toInt(m[1]), toInt(m[2])] : [toInt(s), 0];
  }
  function findRoundsTotalsTable() {
    const tables = Array.from(document.querySelectorAll("table.b-fight-details__table"));
    for (const t of tables) {
      const heads = Array.from(t.querySelectorAll("thead th")).map(th => safe(th.textContent).toLowerCase());
      if (heads.length && heads[0] === "round" && heads.some(h => /^td\b/i.test(h) || h === "td")) {
        return { table: t, heads };
      }
    }
    return null;
  }
  function perRoundFromTable() {
    const holder = findRoundsTotalsTable();
    if (!holder) return [];
    const { table, heads } = holder;
    const idx = (name) => heads.findIndex(h => h.replace(/\./g, "").trim().startsWith(name));
    const iRound = 0;
    const iTD = idx("td");
    const iCtrl = heads.findIndex(h => h.indexOf("ctrl") >= 0);
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const rounds = [];
    rows.forEach(r => {
      const tds = r.querySelectorAll("td");
      const roundNum = toInt(text(tds[iRound]));
      if (!roundNum) return;
      function pairCell(i) {
        const cell = tds[i];
        const ps = cell ? cell.querySelectorAll("p") : [];
        const a = text(ps[0]);
        const b = text(ps[1]);
        return [a, b];
      }
      // TD: parse "X of Y"
      const [tdF1Str, tdF2Str] = pairCell(iTD);
      const [td1L, td1A] = parseXofY(tdF1Str);
      const [td2L, td2A] = parseXofY(tdF2Str);
      // Ctrl: "M:SS"
      let ctrl1Str = "", ctrl2Str = "";
      let ctrl1Sec = 0, ctrl2Sec = 0;
      if (iCtrl >= 0) {
        const [c1, c2] = pairCell(iCtrl);
        ctrl1Str = c1;
        ctrl2Str = c2;
        ctrl1Sec = convertTimeToSeconds(c1);
        ctrl2Sec = convertTimeToSeconds(c2);
      }
      rounds.push({
        round: roundNum,
        f1: { td: { landed: td1L, attempted: td1A }, ctrl_str: ctrl1Str, ctrl_seconds: ctrl1Sec },
        f2: { td: { landed: td2L, attempted: td2A }, ctrl_str: ctrl2Str, ctrl_seconds: ctrl2Sec }
      });
    });
    return rounds;
  }
  async function tryComputeBoutOrder(currentFightId, eventLink) {
    try {
      if (!currentFightId || !eventLink) return null;
      const res = await fetch(eventLink, { credentials: "same-origin" });
      const html = await res.text();
      const dom = new DOMParser().parseFromString(html, "text/html");
      const rows = Array.from(dom.querySelectorAll("tbody.b-fight-details__table-body tr[data-link]"));
      for (let i = 0; i < rows.length; i++) {
        const href = rows[i].getAttribute("data-link") || "";
        if (href.includes(currentFightId)) return i + 1;
      }
      return null;
    } catch (e) {
      console.warn("Bout order fetch failed:", e);
      return null;
    }
  }
  async function buildFightDetailsJSON() {
    const url = location.href;
    const event = getEventInfo();
    const fighters = getHeaderFighters(); // [{name,link,winner}, {name,link,winner}]
    const outcome = getOutcomeMeta();
    const weightClass = getWeightClass();
    const rounds = perRoundFromTable();
    // Winner name convenience
    const winnerObj = fighters.find(f => f.winner);
    const winner_name = winnerObj ? winnerObj.name : "";
    // Bout order (best effort via event page)
    let bout_order = null;
    try { bout_order = await tryComputeBoutOrder(getFightId(), event.link); } catch {}
    return {
      url,
      event,                 // {name, date, link}
      bout_order,            // number or null
      weight_class: weightClass,
      outcome: {
        winner_name,
        method: outcome.method,
        method_detail: outcome.method_detail,
        end_round: outcome.end_round,
        end_time_str: outcome.end_time_str,
        end_time_seconds: outcome.end_time_seconds,
        referee: outcome.referee
      },
      fighters_from_header: fighters, // each has winner: true/false
      rounds_summary: rounds          // per-round TD and control time for both fighters
    };
  }

  // ---------------------------
  // Export orchestrator
  // ---------------------------
  function assembleDomAndCsv() {
    const hostname = location.hostname;
    let textReport = deepStructureReport(document.documentElement, 18);
    let csvAddOn = "";
    const isUfcTargeted = hostname === "ufcstats.com" && window.targetedMode;
    if (isUfcTargeted) {
      const eventsTbody = document.querySelector("tbody.b-fight-details__table-body");
      if (eventsTbody && document.querySelector("table.b-fight-details__table")) {
        csvAddOn = "\n\n=== ENHANCED UFC FIGHTS CSV ===\n" + extractUfcFights(eventsTbody);
      }
    }
    let content = textReport + csvAddOn;
    if (window.jsonMode) {
      try {
        content = JSON.stringify({
          meta: { site: location.hostname, url: location.href, generatedAt: new Date().toISOString() },
          report: textReport,
          csv: csvAddOn || ""
        }, null, 2);
      } catch (e) { console.warn("JSON packaging failed; falling back to text"); }
    }
    const ts = nowISOshort();
    const ext = window.jsonMode ? ".json" : ".txt";
    const pathSeg = basename(location.pathname) || hostname;
    const filename = `DOM-Structure_${hostname}_${pathSeg}_${ts}${ext}`;
    return { content, filename, mime: window.jsonMode ? "application/json" : "text/plain;charset=utf-8" };
  }
  function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    console.log(`Exported: ${filename}`);
  }
  async function exportNow() {
    // If statsJsonMode and on fight-details, emit fight JSON
    if (window.statsJsonMode && isFightDetailsPage()) {
      const data = await buildFightDetailsJSON();
      const fid = getFightId() || "unknown";
      const ts = nowISOfs();
      const filename = `ufcstats_fight_${fid}_${ts}.json`;
      downloadBlob(JSON.stringify(data, null, 2), filename, "application/json");
      return;
    }
    // Else default DOM report (+ optional CSV and jsonMode)
    const { content, filename, mime } = assembleDomAndCsv();
    downloadBlob(content, filename, mime);
    // reset one-shot json flag
    delete window.jsonMode;
  }

  // ---------------------------
  // UI button
  // ---------------------------
  function createButton() {
    const btn = document.createElement("button");
    btn.textContent = "Map DOM+";
    btn.title = "Click: export DOM report. Double-click: toggle UFC-targeted mode. Shift+Click: toggle ASCII. Alt+Click: toggle stats JSON mode. Set window.jsonMode=true for report-as-JSON.";
    btn.style.cssText = [
      "position: fixed","top: 10px","right: 10px","z-index: 99999",
      "background-color: #2196F3","color: #fff","border: none","border-radius: 50%",
      "width: 70px","height: 70px","font-size: 11px","font-weight: bold",
      "cursor: pointer","opacity: 0.9","transition: all 0.2s","box-shadow: 0 2px 10px rgba(0,0,0,0.3)"
    ].join(";");
    function colorize() {
      if (window.statsJsonMode) {
        btn.style.backgroundColor = "#6A1B9A"; // purple for stats mode
      } else if (!window.fancyMode) {
        btn.style.backgroundColor = "#777";
      } else {
        btn.style.backgroundColor = window.targetedMode ? "#2196F3" : "#FF9800";
      }
    }
    colorize();
    btn.addEventListener("mouseenter", () => { btn.style.opacity = "1"; btn.style.transform = "scale(1.05)"; });
    btn.addEventListener("mouseleave", () => { btn.style.opacity = "0.9"; btn.style.transform = "scale(1)"; });
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (e.shiftKey) { window.fancyMode = !window.fancyMode; console.log("ASCII mode:", !window.fancyMode ? "ON" : "OFF"); colorize(); return; }
      if (e.altKey)   { window.statsJsonMode = !window.statsJsonMode; console.log("statsJsonMode:", window.statsJsonMode ? "ON" : "OFF"); colorize(); return; }
      btn.style.transform = "scale(0.98)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 120);
      await exportNow();
    });
    btn.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      window.targetedMode = !window.targetedMode;
      console.log("Enhanced mode toggled to:", window.targetedMode ? "UFC Targeted" : "Full DOM");
      colorize();
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createButton);
  } else {
    createButton();
  }
})();
