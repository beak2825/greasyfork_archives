// ==UserScript==
// @name         Syllabus MCQ Helper — Advanced (UPSC / SSC CGL) — Panel stays open fix
// @namespace    https://example.com/tm/syllabus-mcq-helper-advanced
// @version      1.0.1
// @license      MIT
// @description  Advanced Study Boost: keyword scan, accordion links, per-site mute, dark-mode, custom keywords, daily quiz, highlight, rescan. Panel remains open until user minimizes. Responsive/mobile-friendly.
// @author       iamnobodybaba
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549916/Syllabus%20MCQ%20Helper%20%E2%80%94%20Advanced%20%28UPSC%20%20SSC%20CGL%29%20%E2%80%94%20Panel%20stays%20open%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/549916/Syllabus%20MCQ%20Helper%20%E2%80%94%20Advanced%20%28UPSC%20%20SSC%20CGL%29%20%E2%80%94%20Panel%20stays%20open%20fix.meta.js
// ==/UserScript==

/*
Minimal inline comments. Key change: panel open state persisted to sessionStorage (key 'smhq_panel_open')
so re-rendering does not force the panel to collapse.
*/
(function () {
  "use strict";

  /* ---------- Storage keys & util ---------- */
  const LS = {
    EXAMS: "smhq_exams",
    LANG: "smhq_lang",
    MUTED: "smhq_muted_sites",
    CUSTOM_KW: "smhq_custom_keywords",
    THEME: "smhq_theme_pref",
    DAILY_DATE: "smhq_daily_date",
    DAILY_SEED: "smhq_daily_seed",
    HIGHLIGHT: "smhq_highlight_enabled",
    SAVED: "smhq_saved_links"
  };
  const PANEL_OPEN_KEY = "smhq_panel_open"; // sessionStorage key to persist panel open state (per-tab/session)

  function lsGet(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  }
  function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  const currentHost = location.hostname;

  /* ---------- Base syllabus & i18n ---------- */
  const baseSyllabus = {
    polity: {
      keywords: ["constitution", "fundamental rights", "parliament", "president", "governor", "preamble", "judiciary"],
      links: [
        { name: "GKToday Polity MCQs", url: "https://www.gktoday.in/quiz-questions-answers/indian-polity-constitution/" },
        { name: "Drishti IAS Polity Quiz", url: "https://www.drishtiias.com/quiz" },
        { name: "ClearIAS Polity Test", url: "https://www.clearias.com/upsc-prelims-online-mock-tests/" }
      ]
    },
    economy: {
      keywords: ["budget", "fiscal deficit", "inflation", "rbi", "gst", "wto", "balance of payments"],
      links: [
        { name: "GKToday Economy MCQs", url: "https://www.gktoday.in/quiz-questions-answers/indian-economy/" },
        { name: "AffairsCloud Economy Quiz", url: "https://affairscloud.com/quiz-section/" },
        { name: "Examrace Economy MCQs", url: "https://www.examrace.com/Current-Affairs/MCQs/" }
      ]
    },
    history: {
      keywords: ["indus valley", "maurya", "gupta", "1857", "gandhi", "nehru", "quit india"],
      links: [
        { name: "GKToday History MCQs", url: "https://www.gktoday.in/quiz-questions-answers/ancient-medieval-history/" },
        { name: "JagranJosh History Quiz", url: "https://www.jagranjosh.com/general-knowledge-quiz" },
        { name: "Drishti IAS History Quiz", url: "https://www.drishtiias.com/quiz" }
      ]
    },
    geography: {
      keywords: ["himalayas", "monsoon", "soil", "climate", "river", "el nino", "plate tectonics"],
      links: [
        { name: "GKToday Geography MCQs", url: "https://www.gktoday.in/quiz-questions-answers/indian-geography/" },
        { name: "ClearIAS Geography Quiz", url: "https://www.clearias.com/upsc-prelims-online-mock-tests/" },
        { name: "IASbaba Daily Quiz", url: "https://iasbaba.com/iasbaba-daily-prelims-test/" }
      ]
    },
    science: {
      keywords: ["photosynthesis", "genetics", "gravity", "satellite", "nuclear", "vaccine", "disease"],
      links: [
        { name: "GKToday Science MCQs", url: "https://www.gktoday.in/quiz-questions-answers/general-science/" },
        { name: "AffairsCloud Science Quiz", url: "https://affairscloud.com/quiz/" },
        { name: "Examrace Science MCQs", url: "https://www.examrace.com/Current-Affairs/MCQs/" }
      ]
    },
    current: {
      keywords: ["g20", "brics", "un", "climate change", "imf", "world bank", "wto", "summit"],
      links: [
        { name: "AffairsCloud Current Affairs Quiz", url: "https://affairscloud.com/quiz/" },
        { name: "GKToday Current Affairs MCQs", url: "https://www.gktoday.in/current-affairs-quiz-questions-answers/" },
        { name: "IASbaba Daily Quiz", url: "https://iasbaba.com/iasbaba-daily-prelims-test/" }
      ]
    }
  };

  const SUBJECT_TITLES = {
    polity: { en: "Polity", hi: "राजनीति" },
    economy: { en: "Economy", hi: "अर्थशास्त्र" },
    history: { en: "History", hi: "इतिहास" },
    geography: { en: "Geography", hi: "भूगोल" },
    science: { en: "Science", hi: "विज्ञान" },
    current: { en: "Current Affairs", hi: "सामयिक" }
  };

  const STR = {
    en: { title: "Study Boost", selectExamsTitle: "Select your exam(s)", save: "Save", todaysQuiz: "Today's Quiz",
          rescan: "Rescan", settings: "Settings", muteSite: "Don't show on this site", minimize: "Minimize", expand: "Expand",
          addKeyword: "Add keyword", importExport: "Import / Export JSON", highlightToggle: "Highlight keywords on page",
          language: "Language", theme: "Theme", themeAuto: "Auto", themeLight: "Light", themeDark: "Dark",
          customKeywords: "Custom Keywords", importPlaceholder: "Paste JSON here to import or press Export to copy current config.",
          export: "Export", importBtn: "Import", savedLinks: "Saved Links", copyLink: "Copy link", bookmark: "Save",
          clearAll: "Clear All", atLeastOne: "Please select at least one exam."
    },
    hi: { title: "अध्ययन बूस्ट", selectExamsTitle: "अपने परीक्षा(यों) को चुनें", save: "सेव करें", todaysQuiz: "आज की क्विज़",
          rescan: "पुनः स्कैन करें", settings: "सेटिंग्स", muteSite: "इस साइट पर दिखाएँ नहीं", minimize: "छोटा करें", expand: "बड़ा करें",
          addKeyword: "कीवर्ड जोड़ें", importExport: "इम्पोर्ट / एक्सपोर्ट JSON", highlightToggle: "पेज पर कीवर्ड हाइलाइट करें",
          language: "भाषा", theme: "थीम", themeAuto: "ऑटो", themeLight: "लाइट", themeDark: "डार्क",
          customKeywords: "कस्टम कीवर्ड्स", importPlaceholder: "इम्पोर्ट करने के लिए JSON यहाँ पेस्ट करें या करेंट कॉन्फ़िग कॉपी करने के लिए Export दबाएँ।",
          export: "एक्सपोर्ट", importBtn: "इम्पोर्ट", savedLinks: "सहेजे हुए लिंक", copyLink: "लिंक कॉपी करें", bookmark: "सहेजें",
          clearAll: "सभी हटाएँ", atLeastOne: "कृपया कम से कम एक परीक्षा चुनें।"
    }
  };

  /* ---------- Pref helpers ---------- */
  function getExams() { const e = lsGet(LS.EXAMS, null); return Array.isArray(e) && e.length ? e : null; }
  function setExams(a) { lsSet(LS.EXAMS, a); }
  function getLang() { return lsGet(LS.LANG, "en"); }
  function setLang(v) { lsSet(LS.LANG, v); }
  function isMutedHere() { const m = lsGet(LS.MUTED, {}); return !!m[currentHost]; }
  function setMutedHere(val) { const m = lsGet(LS.MUTED, {}); if (val) m[currentHost] = true; else delete m[currentHost]; lsSet(LS.MUTED, m); }
  function getCustomKeywords() { return lsGet(LS.CUSTOM_KW, {}); }
  function setCustomKeywords(o) { lsSet(LS.CUSTOM_KW, o); }
  function getThemePref() { return lsGet(LS.THEME, "auto"); }
  function setThemePref(v) { lsSet(LS.THEME, v); }
  function getHighlightPref() { return !!lsGet(LS.HIGHLIGHT, true); }
  function setHighlightPref(v) { lsSet(LS.HIGHLIGHT, !!v); }
  function getSavedLinks() { return lsGet(LS.SAVED, []); }
  function setSavedLinks(a) { lsSet(LS.SAVED, a); }

  function buildSyllabus() {
    const s = JSON.parse(JSON.stringify(baseSyllabus));
    const custom = getCustomKeywords() || {};
    for (const [sub, kws] of Object.entries(custom)) {
      if (!s[sub]) s[sub] = { keywords: [], links: [] };
      for (const k of kws) if (!s[sub].keywords.includes(k)) s[sub].keywords.push(k);
    }
    return s;
  }

  /* ---------- UI CSS ---------- */
  function injectStyles() {
    if (document.getElementById("smhq-styles")) return;
    const style = document.createElement("style"); style.id = "smhq-styles";
    style.textContent = `
      :root { --smhq-bg: #ffffff; --smhq-fg: #111; --smhq-accent:#0b5ed7; --smhq-hl-bg: #fff3bf; --smhq-hl-fg: #111; }
      @media (prefers-color-scheme: dark) { :root { --smhq-bg: #111316; --smhq-fg: #e6eef8; --smhq-accent: #558bff; --smhq-hl-bg: #3a3b3c; --smhq-hl-fg: #fff; } }
      .smhq-wrap { position: fixed; bottom: 12px; right: 12px; z-index:2147483647; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
      .smhq-mini-btn { background: var(--smhq-accent); color: white; border:none; border-radius:20px; padding:10px 14px; font-size:14px; box-shadow: 0 6px 18px rgba(0,0,0,0.2); cursor:pointer; min-width:140px; }
      .smhq-panel { background: var(--smhq-bg); color: var(--smhq-fg); width: min(360px, 90vw); max-height: 70vh; overflow:auto; border-radius:12px; box-shadow: 0 14px 40px rgba(0,0,0,0.25); margin-top:8px; }
      .smhq-header{ display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(0,0,0,0.06); position:sticky; top:0; background:inherit; z-index:1;}
      .smhq-title{ font-weight:600; }
      .smhq-controls button, .smhq-controls select { margin-left:8px; padding:6px 8px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); background:transparent; cursor:pointer; color:inherit; }
      .smhq-body{ padding:10px 12px; font-size:14px; }
      .smhq-section{ margin-bottom:10px; }
      .smhq-subject{ font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:8px 4px; border-radius:8px; }
      .smhq-links{ padding:6px 4px 0 6px; }
      .smhq-links a{ color:var(--smhq-accent); text-decoration:none; display:block; padding:6px 0; word-break:break-word; }
      .smhq-small{ font-size:12px; color:rgba(0,0,0,0.6); }
      .smhq-highlight{ background:var(--smhq-hl-bg); color:var(--smhq-hl-fg); padding:0 2px; border-radius:3px; }
      .smhq-settings{ padding:10px; border-top:1px dashed rgba(0,0,0,0.06); }
      .smhq-accordion-item + .smhq-accordion-item{ margin-top:6px; }
      .smhq-btn { background:var(--smhq-accent); color:#fff; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; }
      .smhq-toggle{ cursor:pointer; padding:6px; border-radius:6px; }
      @media (max-width:600px){ .smhq-mini-btn{ font-size:13px; padding:10px 12px; } .smhq-panel{ width: 92vw; right:4vw; } }
    `;
    document.head.appendChild(style);
  }

  function t(key) { const lang = getLang(); return (STR[lang] && STR[lang][key]) || STR["en"][key] || key; }

  /* ---------- Highlighting ---------- */
  function getTextNodes(root = document.body, limit = 2000) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement; if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(tag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode() && nodes.length < limit) nodes.push(walker.currentNode);
    return nodes;
  }
  function clearHighlights() { document.querySelectorAll("span.smhq-highlight").forEach(s => s.replaceWith(document.createTextNode(s.textContent))); }
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function highlightKeywords(syllabus) {
    clearHighlights();
    const kws = [];
    for (const cfg of Object.values(syllabus)) for (const k of (cfg.keywords || [])) kws.push(k);
    if (kws.length === 0) return;
    kws.sort((a,b)=>b.length - a.length);
    const nodes = getTextNodes(document.body, 1200);
    const re = new RegExp("\\b(" + kws.map(k=>escapeRegExp(k)).join("|") + ")\\b","ig");
    for (const node of nodes) {
      const txt = node.nodeValue;
      if (!re.test(txt)) continue;
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      txt.replace(re, (match, ...args) => {
        const idx = args[args.length - 2];
        if (idx > lastIndex) frag.appendChild(document.createTextNode(txt.slice(lastIndex, idx)));
        const span = document.createElement("span");
        span.className = "smhq-highlight";
        span.textContent = match;
        span.style.background = "var(--smhq-hl-bg)";
        span.style.color = "var(--smhq-hl-fg)";
        span.style.padding = "0 2px";
        span.style.borderRadius = "3px";
        frag.appendChild(span);
        lastIndex = idx + match.length;
      });
      if (lastIndex < txt.length) frag.appendChild(document.createTextNode(txt.slice(lastIndex)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  /* ---------- Scanning ---------- */
  function getPageText(limit = 300000) { let t = ""; if (document.body) t = document.body.innerText || ""; if (t.length > limit) t = t.slice(0, limit); return t; }
  function scanMatches(syllabus, textLC) {
    const results = [];
    for (const [sub, cfg] of Object.entries(syllabus)) {
      for (const kw of cfg.keywords || []) {
        if (!kw || typeof kw !== "string") continue;
        const kwLC = kw.toLowerCase();
        if (textLC.includes(kwLC)) results.push({ subjectKey: sub, subjectTitle: SUBJECT_TITLES[sub] || { en: sub, hi: sub }, matchedKeyword: kw, links: cfg.links || [] });
      }
    }
    const seen = new Set();
    return results.filter(r => {
      const k = `${r.subjectKey}::${r.matchedKeyword.toLowerCase()}`; if (seen.has(k)) return false; seen.add(k); return true;
    });
  }

  function ensureDailySeed() {
    const today = (new Date()).toISOString().slice(0,10);
    const storedDate = lsGet(LS.DAILY_DATE, null);
    if (storedDate !== today) {
      const seed = Math.floor(Math.random() * 1e9);
      lsSet(LS.DAILY_DATE, today);
      lsSet(LS.DAILY_SEED, seed);
      return seed;
    }
    return lsGet(LS.DAILY_SEED, Math.floor(Math.random()*1e9));
  }
  function pickTodaysQuiz(matches, syllabus) {
    const seed = ensureDailySeed();
    let pool = [];
    if (matches && matches.length > 0) for (const m of matches) pool.push(...(m.links || []));
    if (pool.length === 0) for (const cfg of Object.values(syllabus)) pool.push(...(cfg.links || []));
    if (pool.length === 0) return null;
    return pool[seed % pool.length];
  }

  /* ---------- Render widget (panel open state persistence added) ---------- */
  function renderWidget(matches, syllabus) {
    const existing = document.getElementById("smhq-root");
    // capture current session state if existing so we can preserve on re-render (sessionStorage is used)
    // sessionStorage key is authoritative across re-renders during session

    if (existing) existing.remove();
    injectStyles();

    const root = document.createElement("div"); root.id = "smhq-root"; root.className = "smhq-wrap";
    const exams = getExams() || [];

    const mini = document.createElement("button"); mini.className = "smhq-mini-btn";
    mini.textContent = `${t("title")} • ${exams.join(" + ")} ▸`;

    const panel = document.createElement("div"); panel.className = "smhq-panel";

    // header
    const header = document.createElement("div"); header.className = "smhq-header";
    const title = document.createElement("div"); title.className = "smhq-title"; title.textContent = `${t("title")} • ${exams.join(" + ")}`;
    const controls = document.createElement("div"); controls.className = "smhq-controls";

    // language select
    const langSel = document.createElement("select");
    ["en","hi"].forEach(l => { const op = document.createElement("option"); op.value = l; op.textContent = l === "en" ? "EN" : "हिन्दी"; langSel.appendChild(op); });
    langSel.value = getLang();
    langSel.onchange = () => { setLang(langSel.value); rebuildUI(); };

    // theme select
    const themeSel = document.createElement("select");
    const createOpt = (v, ttxt) => { const o = document.createElement("option"); o.value = v; o.textContent = ttxt; return o; };
    themeSel.appendChild(createOpt("auto", t("themeAuto"))); themeSel.appendChild(createOpt("light", t("themeLight"))); themeSel.appendChild(createOpt("dark", t("themeDark")));
    themeSel.value = getThemePref();
    themeSel.onchange = () => { setThemePref(themeSel.value); applyTheme(); };

    // rescan
    const rescanBtn = document.createElement("button"); rescanBtn.textContent = t("rescan"); rescanBtn.className = "smhq-btn";
    rescanBtn.onclick = () => doScanImmediate();

    // settings
    const settingsBtn = document.createElement("button"); settingsBtn.textContent = t("settings");
    settingsBtn.onclick = () => toggleSettings();

    // minimize
    const minimizeBtn = document.createElement("button"); minimizeBtn.textContent = t("minimize");
    minimizeBtn.onclick = () => {
      panel.style.display = "none";
      mini.style.display = "inline-block";
      try { sessionStorage.setItem(PANEL_OPEN_KEY, "false"); } catch (e) {}
    };

    controls.appendChild(langSel); controls.appendChild(themeSel); controls.appendChild(rescanBtn); controls.appendChild(settingsBtn); controls.appendChild(minimizeBtn);
    header.appendChild(title); header.appendChild(controls);

    const body = document.createElement("div"); body.className = "smhq-body";

    // Today's quiz
    const today = pickTodaysQuiz(matches, syllabus);
    if (today) {
      const tq = document.createElement("div"); tq.className = "smhq-section";
      tq.innerHTML = `<div style="font-weight:600">${t("todaysQuiz")}</div>`;
      const a = document.createElement("a"); a.href = today.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = today.name; a.style.color = "var(--smhq-accent)"; a.style.display = "inline-block"; a.style.marginTop = "6px";
      tq.appendChild(a); body.appendChild(tq);
    }

    // group matches by subject
    const bySubject = new Map();
    for (const m of matches) {
      if (!bySubject.has(m.subjectKey)) bySubject.set(m.subjectKey, { title: m.subjectTitle, keywords: new Set(), links: m.links || [] });
      bySubject.get(m.subjectKey).keywords.add(m.matchedKeyword);
    }
    if (bySubject.size === 0) {
      const hint = document.createElement("div"); hint.className = "smhq-small"; hint.textContent = "No syllabus keywords detected on this page."; body.appendChild(hint);
    }

    const accordionRoot = document.createElement("div"); accordionRoot.id = "smhq-accordion-root";
    for (const [subKey, info] of bySubject.entries()) {
      const item = document.createElement("div"); item.className = "smhq-accordion-item smhq-section";
      const subjBar = document.createElement("div"); subjBar.className = "smhq-subject";
      const subjTitle = document.createElement("div");
      const labelTitle = (SUBJECT_TITLES[subKey] && SUBJECT_TITLES[subKey][getLang()]) || subKey;
      subjTitle.textContent = `${labelTitle} → ${Array.from(info.keywords).join(", ")}`;
      const chevron = document.createElement("div"); chevron.textContent = "▸";
      subjBar.appendChild(subjTitle); subjBar.appendChild(chevron);

      const linksWrap = document.createElement("div"); linksWrap.className = "smhq-links"; linksWrap.style.display = "none";

      for (const link of info.links) {
        const a = document.createElement("a"); a.href = link.url; a.target = "_blank"; a.rel = "noopener";
        a.textContent = link.name;
        const actionWrap = document.createElement("div"); actionWrap.style.display = "flex"; actionWrap.style.justifyContent = "space-between"; actionWrap.style.alignItems = "center";
        const left = document.createElement("div"); left.appendChild(a);
        const right = document.createElement("div"); right.style.display = "flex"; right.style.gap = "8px";
        const copyBtn = document.createElement("button"); copyBtn.textContent = "⧉"; copyBtn.title = t("copyLink");
        copyBtn.onclick = (e) => { e.preventDefault(); navigator.clipboard?.writeText(link.url); copyBtn.textContent = "✓"; setTimeout(()=>copyBtn.textContent="⧉", 1200); };
        const saveBtn = document.createElement("button"); saveBtn.textContent = "☆"; saveBtn.title = t("bookmark");
        saveBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); const saved = getSavedLinks(); saved.push({ name: link.name, url: link.url, subject: subKey, date: new Date().toISOString() }); setSavedLinks(saved); saveBtn.textContent="★"; setTimeout(()=>saveBtn.textContent="☆",800); };
        right.appendChild(copyBtn); right.appendChild(saveBtn);
        actionWrap.appendChild(left); actionWrap.appendChild(right); linksWrap.appendChild(actionWrap);
      }

      subjBar.onclick = () => {
        const open = linksWrap.style.display === "block";
        linksWrap.style.display = open ? "none" : "block";
        chevron.textContent = open ? "▸" : "▾";
      };

      item.appendChild(subjBar); item.appendChild(linksWrap); accordionRoot.appendChild(item);
    }
    body.appendChild(accordionRoot);

    // settings area
    const settingsArea = document.createElement("div"); settingsArea.className = "smhq-settings"; settingsArea.style.display = "none";
    const hlLabel = document.createElement("label"); hlLabel.style.display = "block"; hlLabel.style.marginBottom = "8px";
    const hlCb = document.createElement("input"); hlCb.type = "checkbox"; hlCb.checked = getHighlightPref();
    hlCb.onchange = () => { setHighlightPref(hlCb.checked); if (hlCb.checked) highlightKeywords(syllabus); else clearHighlights(); };
    hlLabel.appendChild(hlCb); hlLabel.appendChild(document.createTextNode(" " + t("highlightToggle"))); settingsArea.appendChild(hlLabel);

    const ckTitle = document.createElement("div"); ckTitle.textContent = t("customKeywords"); ckTitle.style.fontWeight = "600"; ckTitle.style.marginTop = "8px";
    settingsArea.appendChild(ckTitle);
    const ckContainer = document.createElement("div"); ckContainer.style.maxHeight = "160px"; ckContainer.style.overflow = "auto"; ckContainer.style.marginBottom = "8px";
    const customKw = getCustomKeywords();
    for (const sub of Object.keys(buildSyllabus())) {
      const row = document.createElement("div"); row.style.marginBottom = "6px";
      const lab = document.createElement("div"); lab.style.fontSize = "13px"; lab.style.fontWeight = "600";
      lab.textContent = (SUBJECT_TITLES[sub] && SUBJECT_TITLES[sub][getLang()]) || sub;
      const input = document.createElement("input"); input.type = "text"; input.style.width = "100%"; input.style.marginTop = "4px";
      input.placeholder = "comma,separated,keywords"; input.value = (customKw[sub] || []).join(",");
      const saveBtn = document.createElement("button"); saveBtn.textContent = t("save"); saveBtn.style.marginTop = "6px";
      saveBtn.onclick = () => { const val = input.value.split(",").map(s=>s.trim()).filter(s=>s); const curr = getCustomKeywords(); if (val.length>0) curr[sub]=val; else delete curr[sub]; setCustomKeywords(curr); alert("Saved"); };
      row.appendChild(lab); row.appendChild(input); row.appendChild(saveBtn); ckContainer.appendChild(row);
    }
    settingsArea.appendChild(ckContainer);

    const ieTitle = document.createElement("div"); ieTitle.textContent = t("importExport"); ieTitle.style.fontWeight = "600";
    settingsArea.appendChild(ieTitle);
    const ieArea = document.createElement("div");
    const txtArea = document.createElement("textarea"); txtArea.placeholder = t("importPlaceholder"); txtArea.style.width = "100%"; txtArea.style.height = "80px";
    const expBtn = document.createElement("button"); expBtn.textContent = t("export"); expBtn.onclick = () => {
      const exportObj = { exams: getExams(), lang: getLang(), muted: lsGet(LS.MUTED, {}), customKeywords: getCustomKeywords(), theme: getThemePref(), highlight: getHighlightPref() };
      txtArea.value = JSON.stringify(exportObj, null, 2);
    };
    const impBtn = document.createElement("button"); impBtn.textContent = t("importBtn"); impBtn.onclick = () => {
      try { const obj = JSON.parse(txtArea.value); if (obj.exams) setExams(obj.exams); if (obj.lang) setLang(obj.lang); if (obj.muted) lsSet(LS.MUTED, obj.muted); if (obj.customKeywords) setCustomKeywords(obj.customKeywords); if (obj.theme) setThemePref(obj.theme); if (typeof obj.highlight !== "undefined") setHighlightPref(!!obj.highlight); alert("Imported"); } catch (e) { alert("Invalid JSON"); }
    };
    ieArea.appendChild(txtArea); ieArea.appendChild(expBtn); ieArea.appendChild(impBtn); settingsArea.appendChild(ieArea);

    const savedTitle = document.createElement("div"); savedTitle.textContent = t("savedLinks"); savedTitle.style.fontWeight = "600"; savedTitle.style.marginTop = "8px";
    settingsArea.appendChild(savedTitle);
    const savedWrap = document.createElement("div");
    function renderSaved() {
      savedWrap.innerHTML = "";
      const saved = getSavedLinks();
      if (!saved || saved.length === 0) savedWrap.textContent = "—";
      else {
        for (const s of saved.slice().reverse()) {
          const r = document.createElement("div"); r.style.display = "flex"; r.style.justifyContent = "space-between"; r.style.marginBottom = "6px";
          const l = document.createElement("a"); l.href = s.url; l.target = "_blank"; l.rel = "noopener"; l.textContent = `${s.name} (${s.subject})`;
          const rm = document.createElement("button"); rm.textContent = "✕"; rm.onclick = () => { const arr = getSavedLinks().filter(x=>x.url!==s.url); setSavedLinks(arr); renderSaved(); };
          r.appendChild(l); r.appendChild(rm); savedWrap.appendChild(r);
        }
      }
    }
    renderSaved();
    settingsArea.appendChild(savedWrap);

    // assemble
    panel.appendChild(header); panel.appendChild(body); panel.appendChild(settingsArea);

    // mute label
    const muteLabel = document.createElement("label"); muteLabel.style.padding = "8px 12px";
    const muteCb = document.createElement("input"); muteCb.type = "checkbox"; muteCb.checked = isMutedHere();
    muteCb.onchange = () => { setMutedHere(!!muteCb.checked); if (muteCb.checked) { root.remove(); } };
    muteLabel.appendChild(muteCb); muteLabel.appendChild(document.createTextNode(" " + t("muteSite")));
    panel.appendChild(muteLabel);

    root.appendChild(mini); root.appendChild(panel);
    document.body.appendChild(root);

    // Apply theme
    function applyTheme() {
      const pref = getThemePref();
      if (pref === "auto") { document.documentElement.style.removeProperty('--smhq-bg'); document.documentElement.style.removeProperty('--smhq-fg'); document.documentElement.style.removeProperty('--smhq-accent'); }
      else if (pref === "light") { document.documentElement.style.setProperty('--smhq-bg', '#ffffff'); document.documentElement.style.setProperty('--smhq-fg', '#111'); document.documentElement.style.setProperty('--smhq-accent', '#0b5ed7'); }
      else { document.documentElement.style.setProperty('--smhq-bg', '#0f1720'); document.documentElement.style.setProperty('--smhq-fg', '#e6eef8'); document.documentElement.style.setProperty('--smhq-accent', '#558bff'); }
    }
    applyTheme();

    // settings toggle
    function toggleSettings() { settingsArea.style.display = settingsArea.style.display === "none" ? "block" : "none"; }

    // rebuild UI helper
    function rebuildUI() { const matchesNow = lastMatchesCache || []; root.remove(); renderWidget(matchesNow, syllabus); }

    // session persistence for panel state
    const panelOpen = (function(){
      try { return sessionStorage.getItem(PANEL_OPEN_KEY) === "true"; } catch { return false; }
    })();

    // set initial visibility based on sessionStorage
    if (panelOpen) { panel.style.display = "block"; mini.style.display = "none"; if (getHighlightPref()) highlightKeywords(syllabus); }
    else { panel.style.display = "none"; mini.style.display = "inline-block"; }

    // expand action: one-way expand until user minimizes (persist)
    mini.onclick = () => {
      panel.style.display = "block";
      mini.style.display = "none";
      try { sessionStorage.setItem(PANEL_OPEN_KEY, "true"); } catch (e) {}
      if (getHighlightPref()) highlightKeywords(syllabus);
    };

    // expose some utilities for buttons
    window.__smhq_rebuildUI = rebuildUI; window.__smhq_toggleSettings = toggleSettings; window.__smhq_applyTheme = applyTheme; window.__smhq_renderSaved = renderSaved;
  }

  /* ---------- Scanning loop & observer ---------- */
  let lastHash = null;
  let lastMatchesCache = [];
  let debounceTimer = null;
  function textHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i), h |= 0; return h; }

  function doScanImmediate() {
    const syllabus = buildSyllabus();
    const txt = getPageText();
    const lc = txt.toLowerCase();
    const h = textHash(lc.slice(0, 120000));
    if (h === lastHash) return;
    lastHash = h;
    const matches = scanMatches(syllabus, lc);
    lastMatchesCache = matches;
    if (isMutedHere()) return;
    renderWidget(matches, syllabus);
    if (getHighlightPref()) highlightKeywords(syllabus);
  }

  function scheduleScan() { if (debounceTimer) clearTimeout(debounceTimer); debounceTimer = setTimeout(doScanImmediate, 600); }

  function startObserver() {
    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: false });
    scheduleScan();
  }

  /* ---------- Exam modal ---------- */
  function askExamsModal(onDone) {
    const lang = getLang(); const S = STR[lang];
    const overlay = document.createElement("div"); overlay.style.position = "fixed"; overlay.style.inset = "0"; overlay.style.background = "rgba(0,0,0,0.5)"; overlay.style.zIndex = 2147483646; overlay.style.display = "flex"; overlay.style.alignItems = "center"; overlay.style.justifyContent = "center";
    const box = document.createElement("div"); box.style.background = "var(--smhq-bg)"; box.style.color = "var(--smhq-fg)"; box.style.padding = "18px"; box.style.borderRadius = "12px"; box.style.width = "320px"; box.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)"; box.style.fontFamily = "system-ui, sans-serif"; box.style.textAlign = "center";
    const title = document.createElement("h3"); title.textContent = S.selectExamsTitle; title.style.margin = "0 0 12px"; box.appendChild(title);
    const form = document.createElement("form"); form.style.textAlign = "left";
    ["UPSC","SSC CGL"].forEach(ex => { const label = document.createElement("label"); label.style.display = "block"; label.style.margin = "8px 0"; const input = document.createElement("input"); input.type = "checkbox"; input.value = ex; input.style.marginRight = "8px"; label.appendChild(input); label.appendChild(document.createTextNode(ex)); form.appendChild(label); });
    const submit = document.createElement("button"); submit.type = "submit"; submit.textContent = S.save; submit.style.marginTop = "12px"; submit.style.padding = "8px 14px"; submit.style.borderRadius = "8px"; submit.style.border = "none"; submit.style.cursor = "pointer"; submit.style.background = "#0b5ed7"; submit.style.color = "#fff";
    form.appendChild(submit);
    form.onsubmit = (e) => { e.preventDefault(); const chosen = Array.from(form.querySelectorAll("input:checked")).map(i => i.value); if (chosen.length === 0) { alert(S.atLeastOne); return; } setExams(chosen); overlay.remove(); onDone(chosen); };
    box.appendChild(form); overlay.appendChild(box); document.body.appendChild(overlay);
  }

  /* ---------- Bootstrap & GM menu ---------- */
  function boot() {
    injectStyles();
    if (isMutedHere()) return;
    const exams = getExams();
    if (!exams) { askExamsModal((chosen)=>{ setExams(chosen); boot(); }); return; }
    if (!lsGet(LS.LANG)) setLang("en");
    if (!lsGet(LS.THEME)) setThemePref("auto");
    if (lsGet(LS.HIGHLIGHT) === null) setHighlightPref(true);
    ensureDailySeed(); startObserver();
  }

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Change exam(s) / Reset preferences", () => {
      if (confirm("Reset Study Boost preferences? This clears exam selection, language, custom keywords and muted sites.")) {
        localStorage.removeItem(LS.EXAMS); localStorage.removeItem(LS.LANG); localStorage.removeItem(LS.MUTED);
        localStorage.removeItem(LS.CUSTOM_KW); localStorage.removeItem(LS.THEME); localStorage.removeItem(LS.HIGHLIGHT);
        localStorage.removeItem(LS.SAVED); localStorage.removeItem(LS.DAILY_DATE); localStorage.removeItem(LS.DAILY_SEED);
        try { sessionStorage.removeItem(PANEL_OPEN_KEY); } catch {}
        location.reload();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();

  // expose scan button in console if needed
  window.__smhq_scanNow = doScanImmediate;

})();
