// ==UserScript==
// @name         OMCTesterSupporter
// @namespace    none
// @version      1.0.9
// @description  onlinemathcontestでのコンテストページにおいて、主にTester作業で役立つ機能を追加します。Solverとしても役に立つかもしれません。
// @match        https://onlinemathcontest.com/contests/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548515/OMCTesterSupporter.user.js
// @updateURL https://update.greasyfork.org/scripts/548515/OMCTesterSupporter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const ORIGIN = location.origin;
  const PATH = location.pathname.replace(/\/+$/, "");
  const isContestTop = /^\/contests\/[^/]+$/.test(PATH);
  const isTasksList = /^\/contests\/[^/]+\/tasks$/.test(PATH);
  const taskDetailMatch = PATH.match(/^\/contests\/([^/]+)\/tasks\/(\d+)$/);
  const editorialMatch = PATH.match(/^\/contests\/([^/]+)\/editorial\/(\d+)(?:\/(\d+))?$/);

  const contestName =
    (taskDetailMatch && taskDetailMatch[1]) ||
    (editorialMatch && editorialMatch[1]) ||
    ((PATH.match(/^\/contests\/([^/]+)/) || [])[1]) || "";

  const taskId = (taskDetailMatch && taskDetailMatch[2]) || (editorialMatch && editorialMatch[2]) || null;

  // ---------------- storage ----------------
  const store = {
    get(key, def = "on") { const v = localStorage.getItem(key); return (v === "on" || v === "off") ? v : def; },
    set(key, val) { localStorage.setItem(key, val); },
  };
  const KEY_POINT = "omcts_point_toggle"; // on=表示, off=黒塗り
  const KEY_TIME  = "omcts_time_toggle";
  const KEY_FIELD = "omcts_field_toggle"; // on=表示

  const FIELD_CACHE_KEY = taskId ? `omcts_field_value_${contestName}_${taskId}` : null;

  function purgeInvalidFieldCache() {
    if (!FIELD_CACHE_KEY) return;
    const raw = localStorage.getItem(FIELD_CACHE_KEY);
    if (raw === "不明") localStorage.removeItem(FIELD_CACHE_KEY); // 旧版の失敗キャッシュを破棄
  }
  function getFieldCache() {
    if (!FIELD_CACHE_KEY) return null;
    const raw = localStorage.getItem(FIELD_CACHE_KEY);
    if (!raw || raw === "不明") return null; // 不明は無効扱い
    try {
      const obj = JSON.parse(raw);
      const v = obj && obj.v;
      if (typeof v === "string" && /^[A-Z]$/.test(v)) return v;
    } catch {
      // 旧形式: 直接 "N" などが入っていた場合
      if (typeof raw === "string" && /^[A-Z]$/.test(raw)) return raw;
    }
    return null;
  }
  function setFieldCache(v) {
    if (!FIELD_CACHE_KEY) return;
    if (typeof v === "string" && /^[A-Z]$/.test(v)) {
      localStorage.setItem(FIELD_CACHE_KEY, JSON.stringify({ v, t: Date.now() }));
    } else {
      // 不明は保存しない（常に再取得可能に）
    }
  }
  purgeInvalidFieldCache();

  // ---------------- styles ----------------
  const style = document.createElement("style");
  style.textContent = `
  #nav-container.omcts-panel-anchor{position:relative;}
  .omcts-panel{
    position:absolute; top:70px; right:0.5rem; z-index:2147483647;
    display:flex; flex-direction:column; gap:.5rem;
    background:#ffffffee; backdrop-filter:saturate(1.2) blur(2px);
    border:1px solid #ddd; border-radius:.75rem; padding:.6rem .7rem;
    box-shadow:0 6px 18px rgba(0,0,0,.12);
    font:14px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Apple Color Emoji","Segoe UI Emoji";
  }
  .omcts-fallback-fixed{ position:fixed; top:70px; right:1rem; }
  .omcts-row{display:flex; align-items:center; gap:.5rem;}
  .omcts-btn{
    appearance:none; border:1px solid #ccc; border-radius:.5rem; padding:.35rem .65rem;
    background:#f7f7f7; cursor:pointer; font-weight:600;
  }
  .omcts-btn:hover{ background:#eee; }
  .omcts-switch{ display:flex; align-items:center; gap:.45rem; }
  .omcts-switch input{ display:none; }
  .omcts-slider{
    width:38px; height:20px; border-radius:999px; background:#ddd; position:relative; transition:.2s ease all;
  }
  .omcts-slider::after{
    content:""; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.2); transition:.2s ease all;
  }
  .omcts-switch input:checked + .omcts-slider{ background:#3b82f6; }
  .omcts-switch input:checked + .omcts-slider::after{ transform:translateX(18px); }
  .omcts-label{min-width:46px; text-align:right; opacity:.9;}

  /* overlay mask (digits only) */
  .omcts-maskwrap{
    position:relative; display:inline-flex; align-items:baseline; line-height:1; vertical-align:baseline;
    letter-spacing:normal !important; word-spacing:normal !important;
  }
  .omcts-digits, .omcts-unit{ margin:0 !important; padding:0 !important; }
  .omcts-unit{ margin-left:.2em !important; }
  .omcts-overlay{
    position:absolute; top:0; left:0; height:100%;
    background:#000; border-radius:.2rem; pointer-events:none; opacity:1; transition:opacity .15s ease;
  }
  .omcts-maskwrap.revealed .omcts-overlay{ opacity:0; }

  /* field pill text only + global hide toggled by HTML class */
  .omcts-field-pill{ margin-left:.6rem; font-weight:600; }
  .omcts-field-hidden .omcts-field-pill{ display:none !important; }
  `;
  document.head.appendChild(style);

  // overlay sizing
  const wraps = new Set();
  const sizeOverlay = (wrap) => {
    const digits = wrap.querySelector(".omcts-digits");
    const overlay = wrap.querySelector(".omcts-overlay");
    if (!digits || !overlay) return;
    const r = digits.getBoundingClientRect();
    overlay.style.width = `${Math.ceil(r.width)}px`;
  };
  const scheduleSize = (wrap) => { wraps.add(wrap); requestAnimationFrame(() => sizeOverlay(wrap)); };
  window.addEventListener("resize", () => wraps.forEach(w => sizeOverlay(w)));
  window.addEventListener("load",   () => wraps.forEach(w => sizeOverlay(w)));

  // ---------------- anchor & panel ----------------
  const getAnchorForPanel = () => {
    const nav = document.getElementById("nav-container");
    if (nav) { nav.classList.add("omcts-panel-anchor"); return nav; }
    return document.body;
  };

  function buildPanel() {
    const anchor = getAnchorForPanel();
    const root = document.createElement("div");
    root.className = "omcts-panel";
    if (!document.getElementById("nav-container")) root.classList.add("omcts-fallback-fixed");
    anchor.appendChild(root);

    function addButton(id, text, onClick) {
      const row = document.createElement("div"); row.className = "omcts-row";
      const btn = document.createElement("button");
      btn.className = "omcts-btn"; btn.id = id; btn.type = "button"; btn.textContent = text;
      btn.addEventListener("click", onClick);
      row.appendChild(btn); root.appendChild(row);
    }
    function addSwitch(id, label, initialOn, onChange) {
      const row = document.createElement("div"); row.className = "omcts-row";
      const text = document.createElement("div"); text.className = "omcts-label"; text.textContent = label;
      const wrap = document.createElement("label"); wrap.className = "omcts-switch";
      const input = document.createElement("input"); input.type = "checkbox"; input.id = id; input.checked = initialOn;
      const slider = document.createElement("span"); slider.className = "omcts-slider";
      wrap.appendChild(input); wrap.appendChild(slider);
      row.appendChild(text); row.appendChild(wrap);
      root.appendChild(row);
      input.addEventListener("change", () => onChange(input.checked));
      return input;
    }
    return { root, addButton, addSwitch };
  }

  const panel = buildPanel();

  // ---------------- toast ----------------
  function toast(msg) {
    const t = document.createElement("div");
    Object.assign(t.style, {
      position: "fixed", top: "12px", left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: ".45rem .7rem", borderRadius: ".5rem",
      boxShadow: "0 6px 18px rgba(0,0,0,.25)", zIndex: "2147483647", fontSize: "13px",
      opacity: "0", transition: "opacity .2s ease",
    });
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = "1"; });
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 250); }, 1400);
  }

  // ---------------- overlay mask ----------------
  function buildOverlayMask(digitsText, unitText) {
    const wrap = document.createElement("span"); wrap.className = "omcts-maskwrap"; wrap.title = "クリックで表示/非表示";
    const digits = document.createElement("span"); digits.className = "omcts-digits"; digits.textContent = digitsText;
    const unit = document.createElement("span"); unit.className = "omcts-unit"; unit.textContent = unitText || "";
    const ov = document.createElement("span"); ov.className = "omcts-overlay";
    wrap.appendChild(digits); wrap.appendChild(unit); wrap.appendChild(ov);
    wrap.addEventListener("click", (ev) => { ev.stopPropagation(); wrap.classList.toggle("revealed"); });
    scheduleSize(wrap);
    return wrap;
  }
  const setMasked = (wrap, masked) => { if (masked) wrap.classList.remove("revealed"); else wrap.classList.add("revealed"); };

  // ---------------- collectors ----------------
  const pointTargets = [];
  function collectPointsOnContestTop() {
    const tds = Array.from(document.querySelectorAll('table.table.table-sm tbody td'));
    tds.forEach(td => {
      if (td.querySelector(".omcts-maskwrap")) return;
      if (td.querySelector(".user-container")) return;
      const txt = (td.textContent || "").trim();
      if (/^\d+$/.test(txt)) pointTargets.push({ el: td, val: txt, kind: "td" });
    });
  }
  function collectPointsOnTasksList() {
    const tds = Array.from(document.querySelectorAll("tbody td"));
    tds.forEach(td => {
      if (td.querySelector(".omcts-maskwrap")) return;
      const txt = (td.textContent || "").trim();
      if (/^\d+$/.test(txt)) pointTargets.push({ el: td, val: txt, kind: "td" });
    });
  }
  function collectPointsOnTaskDetail() {
    const ps = Array.from(document.querySelectorAll("p"));
    for (const p of ps) {
      const m = (p.textContent || "").match(/^\s*点数\s*:\s*(\d+)\s*$/);
      if (m) { pointTargets.push({ el: p, val: m[1], kind: "p_point" }); break; }
    }
  }

  const timeTargets = [];
  function collectTimeEverywhere() {
    // pattern 1: #timer（Finished でない場合は元の文字列全体を塗りつぶし。例: "112:18:48"）
    const timerSpan = document.querySelector("p.list-group-item-heading#timer span");
    if (timerSpan) {
      const raw = (timerSpan.textContent || "").trim();
      if (!/^finished$/i.test(raw)) {
        const host = timerSpan.parentElement;
        if (host && !host.dataset.omctsTimeAdded) {
          timeTargets.push({ el: host, val: raw, kind: "timer" }); // no unit
          host.dataset.omctsTimeAdded = "1";
        }
      }
    }
    // pattern 2: 「100分」など
    const ps = Array.from(document.querySelectorAll("p.list-group-item-heading"));
    ps.forEach(p => {
      if (p.id === "timer") return;
      if (p.dataset.omctsTimeAdded) return;
      const txt = (p.textContent || "").trim();
      const m = txt.match(/^(\d+)\s*分$/);
      if (m) {
        timeTargets.push({ el: p, val: m[1], kind: "minutes" });
        p.dataset.omctsTimeAdded = "1";
      }
    });
  }

  // ---------------- renderers ----------------
  function ensurePointInParagraph(p, val, masked) {
    let pill = p.querySelector(".omcts-field-pill");
    const pillDisplay = pill ? pill.style.display : "";
    if (pill) pill.remove();

    let wrap = p.querySelector(".omcts-maskwrap");
    if (!wrap) { p.textContent = "点数: "; wrap = buildOverlayMask(String(val), ""); p.appendChild(wrap); }
    else { const d = wrap.querySelector(".omcts-digits"); if (d) d.textContent = String(val); scheduleSize(wrap); }
    setMasked(wrap, masked);

    if (pill) { pill.style.display = pillDisplay; p.appendChild(pill); }
  }
  function renderPointMasks(mask) {
    pointTargets.forEach(t => {
      if (t.kind === "p_point") ensurePointInParagraph(t.el, t.val, mask);
      else {
        const td = t.el;
        let wrap = td.querySelector(".omcts-maskwrap");
        if (!wrap) { td.textContent = ""; wrap = buildOverlayMask(String(t.val), ""); td.appendChild(wrap); }
        setMasked(wrap, mask);
      }
    });
  }
  function renderTimeMasks(mask) {
    timeTargets.forEach(t => {
      const host = t.el; if (!host) return;
      let wrap = host.querySelector(".omcts-maskwrap");
      if (!wrap) {
        host.textContent = "";
        wrap = buildOverlayMask(String(t.val), t.kind === "minutes" ? "分" : "");
        host.appendChild(wrap);
      }
      setMasked(wrap, mask);
      scheduleSize(wrap);
    });
  }

  // ---------------- field: API helpers ----------------
  const eqId = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

  async function fetchFieldStep1_submissions(contest, taskIdStr) {
    let url = `${ORIGIN}/api/contests/${encodeURIComponent(contest)}/submissions/list?`;
    let res = await fetch(url, { credentials: "include" });
    if (!res.ok) { url = `${ORIGIN}/api/contests/${encodeURIComponent(contest)}/submissions/list`; res = await fetch(url, { credentials: "include" }); if (!res.ok) return { field: null, checked2:false }; }
    const j1 = await res.json();
    const arr1 = (j1 && j1.data) || [];
    const hit1 = arr1.find(d => d && d.problem && eqId(d.problem.id, taskIdStr));
    if (hit1 && hit1.problem && typeof hit1.problem.field !== "undefined" && hit1.problem.field !== null) {
      return { field: hit1.problem.field, checked2:false };
    }

    let checked2 = false;
    if (Array.isArray(arr1) && arr1.length === 20) {
      checked2 = true;
      const url2 = `${ORIGIN}/api/contests/${encodeURIComponent(contest)}/submissions/list?page=2`;
      const res2 = await fetch(url2, { credentials: "include" });
      if (res2.ok) {
        const j2 = await res2.json();
        const arr2 = (j2 && j2.data) || [];
        const hit2 = arr2.find(d => d && d.problem && eqId(d.problem.id, taskIdStr));
        if (hit2 && hit2.problem && typeof hit2.problem.field !== "undefined" && hit2.problem.field !== null) {
          return { field: hit2.problem.field, checked2:true };
        }
      }
    }
    return { field: null, checked2 };
  }

  async function fetchFieldStep2_problems(contest, taskIdStr) {
    const TYPES = ["B","R","E","V","O","S"];
    for (const tp of TYPES) {
      try {
        const url = `${ORIGIN}/api/problems/list?type=${encodeURIComponent(tp)}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) continue;
        const json = await res.json();
        const contests = (json && json.contests) || [];

        // まず contest 一致で探す
        const target = contests.find(c => c && c.id && eqId(c.id, contest));
        if (target && Array.isArray(target.tasks)) {
          const t = target.tasks.find(x => x && eqId(x.id, taskIdStr));
          if (t && typeof t.field !== "undefined" && t.field !== null) return t.field;
        }

        // contest が拾えない表記揺れ対策として、全 tasks を走査
        for (const c of contests) {
          if (!c || !Array.isArray(c.tasks)) continue;
          const t = c.tasks.find(x => x && eqId(x.id, taskIdStr));
          if (t && typeof t.field !== "undefined" && t.field !== null) return t.field;
        }
      } catch {}
    }
    return null;
  }

  async function resolveField(contest, taskIdStr) {
    // ① submissions（page=2 まで）
    const st1 = await fetchFieldStep1_submissions(contest, taskIdStr);
    if (st1.field) return st1.field;

    // ② problems（大会の状態に関係なく必ず走査）
    return await fetchFieldStep2_problems(contest, taskIdStr);
  }

  // ---------------- field: UI & control ----------------
  let fieldFetchInFlight = false;

  const getPointParagraph = () =>
    Array.from(document.querySelectorAll("p")).find(el => /^\s*点数\s*:\s*\d+\s*$/.test(el.textContent || "")) || null;

  async function ensureFieldPill() {
    if (!taskId) return;
    const p = getPointParagraph(); if (!p) return;
    let pill = p.querySelector(".omcts-field-pill");
    if (!pill) { pill = document.createElement("span"); pill.className = "omcts-field-pill"; p.appendChild(pill); }

    const cached = getFieldCache();
    if (cached) { pill.textContent = `分野: ${cached}`; return; }

    pill.textContent = "分野: 取得中…";
    if (fieldFetchInFlight) return;
    fieldFetchInFlight = true;
    try {
      const field = await resolveField(contestName, taskId);
      const val = (typeof field === "string" && /^[A-Z]$/.test(field)) ? field : "不明";
      setFieldCache(val); // ※ "不明" は保存されない
      pill.textContent = `分野: ${val}`;
    } catch {
      pill.textContent = "分野: 不明";
    } finally {
      fieldFetchInFlight = false;
    }
  }

  // field 表示切替（CSSで即時反映）
  const applyFieldVisibility = (on) => { document.documentElement.classList.toggle("omcts-field-hidden", !on); };

  // ---------------- TeX copy ----------------
  async function extractTexFromPageSource(url) {
    const res = await fetch(url, { credentials: "include" });
    const html = await res.text();
    const m = html.match(/const\s+content\s*=\s*([`'"])([\s\S]*?)\1\s*;/);
    if (!m) throw new Error("const content が見つかりませんでした。");
    const quote = m[1], body = m[2], literal = `${quote}${body}${quote}`;
    let decoded;
    try { decoded = new Function(`"use strict"; return (${literal});`)(); }
    catch {
      decoded = body
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
        .replace(/\\r\\n|\\n/g, "\n").replace(/\\t/g, "\t")
        .replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    return decoded;
  }
  async function handleTexCopy() {
    try { const tex = await extractTexFromPageSource(location.href);
      await navigator.clipboard.writeText(tex); toast("TeX をコピーしました"); }
    catch (e) { toast(`TeX抽出に失敗: ${e && e.message ? e.message : e}`); }
  }

  // ---------------- openers ----------------
  function handleOpenAll() {
    const links = Array.from(document.querySelectorAll("tbody a[href*='/contests/'][href*='/tasks/']")).filter(a => {
      const href = a.getAttribute("href") || ""; return href.includes(`/contests/${contestName}/tasks/`);
    });
    const urls = links.map(a => a.href || a.getAttribute("href") || "").filter(Boolean);
    if (!urls.length) { toast("タスクリンクが見つかりません。"); return; }
    urls.forEach(u => window.open(u, "_blank", "noopener,noreferrer"));
    toast(`${urls.length} 件のタブを開きました`);
  }
  function handleOpenUnsolved() {
    const container = document.querySelector("challenge-container") || document;
    const rows = Array.from(container.querySelectorAll("tr"));
    const targets = rows.filter(tr => !tr.classList.contains("table-success"));
    const links = targets.map(tr => tr.querySelector("a[href*='/contests/'][href*='/tasks/']")).filter(Boolean);
    const urls = links.map(a => a.href || a.getAttribute("href") || "").filter(Boolean)
                      .filter(u => u.includes(`/contests/${contestName}/tasks/`));
    if (!urls.length) { toast("未解決タスクのリンクが見つかりません。"); return; }
    const uniq = Array.from(new Set(urls));
    uniq.forEach(u => window.open(u, "_blank", "noopener,noreferrer"));
    toast(`${uniq.length} 件の未解決タブを開きました`);
  }

  // ---------------- UI buttons ----------------
  if (taskDetailMatch || editorialMatch) {
    panel.addButton("omcts-tex", "tex copy", handleTexCopy);
  } else if (isContestTop) {
    panel.addButton("omcts-openall", "open all", handleOpenAll);
  }
  if (isTasksList) {
    panel.addButton("omcts-openunsolved", "open unsolved", handleOpenUnsolved);
  }

  // ---------------- ALWAYS show all switches ----------------
  const initialPoint = store.get(KEY_POINT, "on") === "on";
  const initialTime  = store.get(KEY_TIME,  "on") === "on";
  const initialField = store.get(KEY_FIELD, "on") === "on";

  const inputPoint = panel.addSwitch("omcts-point", "point", initialPoint, (on) => {
    store.set(KEY_POINT, on ? "on" : "off");
    renderPointMasks(!on);
  });
  const inputTime = panel.addSwitch("omcts-time", "time", initialTime, (on) => {
    store.set(KEY_TIME, on ? "on" : "off");
    collectTimeEverywhere(); // その場で拾い直し
    renderTimeMasks(!on);
  });
  const inputField = panel.addSwitch("omcts-field", "field", initialField, async (on) => {
    store.set(KEY_FIELD, on ? "on" : "off");
    applyFieldVisibility(on);            // 即時反映
    if (on && taskDetailMatch) await ensureFieldPill(); // 必要時のみ取得
  });

  // ---------------- initial collect & render ----------------
  if (isContestTop) collectPointsOnContestTop();
  if (isTasksList) collectPointsOnTasksList();
  if (taskDetailMatch) collectPointsOnTaskDetail();
  renderPointMasks(!inputPoint.checked);

  collectTimeEverywhere();
  renderTimeMasks(!inputTime.checked);

  applyFieldVisibility(initialField);
  if (initialField && taskDetailMatch) { ensureFieldPill(); }

  // ---------------- observe late DOM ----------------
  if (isContestTop || isTasksList) {
    const mo = new MutationObserver(() => {
      const beforeP = pointTargets.length;
      if (isContestTop) collectPointsOnContestTop();
      if (isTasksList) collectPointsOnTasksList();
      if (pointTargets.length > beforeP) {
        renderPointMasks(!inputPoint.checked);
      }
      const beforeT = timeTargets.length;
      collectTimeEverywhere();
      if (timeTargets.length > beforeT) {
        renderTimeMasks(!inputTime.checked);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 6000);
  }
})();
