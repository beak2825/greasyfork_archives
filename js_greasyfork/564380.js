// ==UserScript==
// @name         SkTorrent Overhauled
// @name:cs      SkTorrent Overhauled
// @name:sk      SkTorrent Overhauled
// @name:en      SkTorrent Overhauled
// @name:de      SkTorrent Overhauled
// @name:pl      SkTorrent Overhauled
// @name:ru      SkTorrent Overhauled
// @name:uk      SkTorrent Overhauled
// @name:fr      SkTorrent Overhauled
// @name:es      SkTorrent Overhauled
// @name:it      SkTorrent Overhauled
// @name:pt-br   SkTorrent Overhauled
// @name:zh-cn   SkTorrent Overhauled
// @name:zh-tw   SkTorrent Overhauled
// @name:ja      SkTorrent Overhauled
// @name:ko      SkTorrent Overhauled
// @name:ar      SkTorrent Overhauled
// @name:he      SkTorrent Overhauled
// @name:hi      SkTorrent Overhauled
// @name:th      SkTorrent Overhauled
// @name:hu      SkTorrent Overhauled
// @name:ro      SkTorrent Overhauled
// @name:fi      SkTorrent Overhauled
// @name:el      SkTorrent Overhauled
// @name:da      SkTorrent Overhauled
// @name:sv      SkTorrent Overhauled
// @name:nb      SkTorrent Overhauled
// @name:sr      SkTorrent Overhauled
// @name:vi      SkTorrent Overhauled
// @name:ug      SkTorrent Overhauled
//
// @namespace    http://greasyfork.org/
// @version      1.1
//
// @description     Kompletní moderní UI overhaul vč. typografie, rozložení, opravení řazení podle seedu a přidání funkce magnet.
// @description:cs  Kompletní moderní UI overhaul vč. typografie, rozložení, opravení řazení podle seedu a přidání funkce magnet.
// @description:sk  Kompletný moderný UI overhaul vrátane typografie, rozloženia, opravy radenia podľa seedu a pridania magnet funkcie.
// @description:en  Full modern UI overhaul incl. typography/layout, fixed seed sorting and added magnet links.
// @description:de  Komplettes modernes UI-Overhaul inkl. Typografie/Layout, korrigierter Seed-Sortierung und Magnet-Links.
// @description:pl  Kompletny nowoczesny overhaul UI (typografia/układ), poprawione sortowanie seedów i dodane linki magnet.
// @description:ru  Полный современный редизайн UI (типографика/раскладка), исправлена сортировка по сидам и добавлены magnet-ссылки.
// @description:uk  Повний сучасний редизайн UI (типографіка/макет), виправлено сортування за сідами та додано magnet-посилання.
// @description:fr  Refonte UI moderne complète (typo/mise en page), tri des seeds corrigé et liens magnet ajoutés.
// @description:es  Renovación completa de UI moderna (tipografía/diseño), ordenación por seeds corregida y enlaces magnet añadidos.
// @description:it  Restyling UI moderno completo (tipografia/layout), ordinamento seed corretto e link magnet aggiunti.
// @description:pt-br Reformulação completa de UI moderna (tipografia/layout), ordenação por seeds corrigida e links magnet adicionados.
// @description:zh-cn 全面现代化 UI（排版/布局），修复按做种排序并添加 magnet 链接。
// @description:zh-tw 全面現代化 UI（排版/佈局），修復按做種排序並新增 magnet 連結。
// @description:ja  タイポ/レイアウトを含むUIを全面刷新。シード順ソート修正とmagnetリンク追加。
// @description:ko  타이포/레이아웃 포함 UI 전면 개편, 시드 정렬 수정 및 magnet 링크 추가.
// @description:ar  تجديد كامل لواجهة المستخدم (الخط/التخطيط)، إصلاح الفرز حسب السيد وإضافة روابط magnet.
// @description:he  שדרוג UI מלא (טיפוגרפיה/פריסה), תיקון מיון לפי seeds והוספת קישורי magnet.
// @description:hi  टाइपोग्राफी/लेआउट सहित पूर्ण UI ओवरहॉल, seed sorting फिक्स और magnet लिंक जोड़े।
// @description:th  ปรับ UI ใหม่ทั้งหมด (ตัวอักษร/เลย์เอาต์), แก้การเรียงตาม seed และเพิ่มลิงก์ magnet.
// @description:hu  Teljes modern UI átalakítás (tipográfia/elrendezés), javított seed rendezés és magnet linkek.
// @description:ro  Revizie completă UI modernă (tipografie/layout), sortare seed corectată și linkuri magnet adăugate.
// @description:fi  Täysi moderni UI-uudistus (typografia/asettelu), korjattu seed-lajittelu ja lisätty magnet-linkit.
// @description:el  Πλήρης μοντέρνα αναβάθμιση UI (τυπογραφία/διάταξη), διόρθωση ταξινόμησης seeds και προσθήκη magnet.
// @description:da  Fuld moderne UI-overhaul (typografi/layout), rettet seed-sortering og tilføjet magnet-links.
// @description:sv  Fullständig modern UI-omdesign (typografi/layout), fixad seed-sortering och tillagda magnetlänkar.
// @description:nb  Full modern UI-overhaling (typografi/layout), fikset seed-sortering og lagt til magnet-lenker.
// @description:sr  Potpuni moderni UI overhaul (tipografija/raspored), ispravljen seed sorting i dodati magnet linkovi.
// @description:vi  Đại tu UI hiện đại (chữ/bố cục), sửa sắp xếp seed và thêm liên kết magnet.
// @description:ug  تولۇق زامانىۋى UI يېڭىلاش (ھەرپ/تەرتىپ)، seed بويىچە تىزىشنى تۈزىتىش ۋە magnet ئۇلانمىسى قوشۇش.
//
// @author       ShinoYumi
//
// @match        https://sktorrent.eu/torrent/*
// @match        https://announce.sktorrent.eu/torrent/*
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sktorrent.eu
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/564380/SkTorrent%20Overhauled.user.js
// @updateURL https://update.greasyfork.org/scripts/564380/SkTorrent%20Overhauled.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const THEMES = {
    Nocturne: {
      bg: '#0b0e14',
      bg2: '#0f141d',
      panel: '#11151c',
      panel2: '#161b22',
      border: 'rgba(147, 51, 234, 0.28)',
      borderSoft: 'rgba(255,255,255,0.07)',
      accent: '#9333ea',
      accent2: '#c084fc',
      accentSoft: 'rgba(147, 51, 234, 0.14)',
      text: '#e5e7eb',
      textDim: '#9aa6b2',
      good: '#4ade80',
      warn: '#facc15',
      hover: 'rgba(147, 51, 234, 0.12)',
      focusRing: 'rgba(147, 51, 234, 0.40)',
      glow: 'rgba(147, 51, 234, 0.25)',
      shade: 'rgba(0, 0, 0, 0.25)',
    },
    Ember: {
      bg: '#0f1115',
      bg2: '#151a22',
      panel: '#141821',
      panel2: '#191f2a',
      border: 'rgba(251, 146, 60, 0.35)',
      borderSoft: 'rgba(255,255,255,0.06)',
      accent: '#fb923c',
      accent2: '#f97316',
      accentSoft: 'rgba(251, 146, 60, 0.14)',
      text: '#f1f5f9',
      textDim: '#aab4c3',
      good: '#22c55e',
      warn: '#f59e0b',
      hover: 'rgba(251, 146, 60, 0.16)',
      focusRing: 'rgba(251, 146, 60, 0.45)',
      glow: 'rgba(251, 146, 60, 0.22)',
      shade: 'rgba(0, 0, 0, 0.25)',
    },
    Tide: {
      bg: '#071317',
      bg2: '#0b1d22',
      panel: '#0f1d21',
      panel2: '#13242a',
      border: 'rgba(56, 189, 248, 0.35)',
      borderSoft: 'rgba(255,255,255,0.06)',
      accent: '#22d3ee',
      accent2: '#38bdf8',
      accentSoft: 'rgba(56, 189, 248, 0.14)',
      text: '#e6f1f5',
      textDim: '#9db2bd',
      good: '#34d399',
      warn: '#fbbf24',
      hover: 'rgba(56, 189, 248, 0.16)',
      focusRing: 'rgba(56, 189, 248, 0.45)',
      glow: 'rgba(34, 211, 238, 0.20)',
      shade: 'rgba(0, 0, 0, 0.25)',
    },
    Paper: {
      bg: '#f6f3ef',
      bg2: '#efe7dd',
      panel: '#ffffff',
      panel2: '#f8f4ef',
      border: 'rgba(45, 45, 45, 0.15)',
      borderSoft: 'rgba(45, 45, 45, 0.08)',
      accent: '#0ea5a4',
      accent2: '#0f766e',
      accentSoft: 'rgba(14, 165, 164, 0.12)',
      text: '#1f2933',
      textDim: '#52606d',
      good: '#16a34a',
      warn: '#d97706',
      hover: 'rgba(14, 165, 164, 0.10)',
      focusRing: 'rgba(14, 165, 164, 0.35)',
      glow: 'rgba(14, 165, 164, 0.20)',
      shade: 'rgba(0, 0, 0, 0.08)',
    },
  };

  const DEFAULT_THEME = 'Nocturne';
  const STORAGE_KEY = 'skt-theme';
  const THEME_OPTION_PREFIX = 'skt-theme:';
  const THEME_MESSAGE_TYPE = 'skt-theme-sync';
  const MAIN_ORIGIN = 'https://sktorrent.eu';
  const ANNOUNCE_ORIGIN = 'https://announce.sktorrent.eu';
  const SEARCH_TOGGLE_KEY = 'skt-search-collapsed';
  const PASSKEY_STORAGE_KEY = 'skt-passkey';
  const DEFAULT_VARS = THEMES[DEFAULT_THEME];
  let activeTheme = DEFAULT_THEME;

  function injectFontLink() {
    try {
      const l1 = document.createElement('link');
      l1.rel = 'preconnect';
      l1.href = 'https://fonts.googleapis.com';
      l1.crossOrigin = 'anonymous';

      const l2 = document.createElement('link');
      l2.rel = 'preconnect';
      l2.href = 'https://fonts.gstatic.com';
      l2.crossOrigin = 'anonymous';

      const l3 = document.createElement('link');
      l3.rel = 'stylesheet';
      l3.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';

      (document.head || document.documentElement).appendChild(l1);
      (document.head || document.documentElement).appendChild(l2);
      (document.head || document.documentElement).appendChild(l3);
    } catch (_) {}
  }

  const CSS = `
    :root{
      --bg:${DEFAULT_VARS.bg};
      --bg2:${DEFAULT_VARS.bg2};
      --panel:${DEFAULT_VARS.panel};
      --panel2:${DEFAULT_VARS.panel2};
      --border:${DEFAULT_VARS.border};
      --borderSoft:${DEFAULT_VARS.borderSoft};
      --accent:${DEFAULT_VARS.accent};
      --accent2:${DEFAULT_VARS.accent2};
      --accentSoft:${DEFAULT_VARS.accentSoft};
      --text:${DEFAULT_VARS.text};
      --textDim:${DEFAULT_VARS.textDim};
      --hover:${DEFAULT_VARS.hover};
      --focusRing:${DEFAULT_VARS.focusRing};
      --glow:${DEFAULT_VARS.glow};
      --shade:${DEFAULT_VARS.shade};
      --good:${DEFAULT_VARS.good};
      --warn:${DEFAULT_VARS.warn};

      --radius: 14px;
      --pad: 14px;
    }

    html, body {
      background:
        radial-gradient(1200px 700px at 10% -10%, var(--glow), transparent 60%),
        radial-gradient(900px 600px at 110% 10%, var(--shade), transparent 60%),
        linear-gradient(180deg, var(--bg), var(--bg2)) !important;
      background-attachment: fixed;
      color: var(--text) !important;
      font-family: "Space Grotesk", "Segoe UI", Tahoma, Arial, sans-serif !important;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { color: var(--accent2) !important; text-decoration: none !important; }
    a:hover { color: var(--text) !important; }
    a.skt-magnet { color: var(--accent2) !important; font-weight: 800 !important; }
    a.skt-magnet svg { width: 16px; height: 16px; margin-right: 6px; vertical-align: -3px; }
    a.skt-magnet:hover { color: var(--text) !important; }

    table[bgcolor], tr[bgcolor], td[bgcolor] {
      background: transparent !important;
    }
    [style*="background:#000"], [style*="background: #000"],
    [style*="background-color:#000"], [style*="background-color: #000"] {
      background: transparent !important;
    }

    font[color="black"], font[color="#000"], font[color="#000000"] {
      color: var(--text) !important;
    }
    font[color="brown"] { color: var(--textDim) !important; }
    font[color="blue"] { color: var(--accent2) !important; }
    font[color="purple"] { color: var(--accent) !important; }
    font[color="red"] { color: #ef4444 !important; }
    font[color="maroon"] { color: var(--text) !important; }
    [style*="color:black"], [style*="color: black"],
    [style*="color:#000"], [style*="color: #000"] {
      color: var(--text) !important;
    }

    table[bgcolor="#BEDBEB"], table[bgcolor="#76b83e"],
    tr[bgcolor="#BEDBEB"], tr[bgcolor="#76b83e"],
    td[bgcolor="#BEDBEB"], td[bgcolor="#76b83e"] {
      background: transparent !important;
    }

    #skt-app {
      width: min(1320px, 98vw);
      margin: 14px auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      transform: translateZ(0);
      will-change: transform;
    }
    @media (min-width: 1100px) {
      #skt-app { grid-template-columns: 1fr 360px; align-items: start; }
    }

    .skt-card {
      background: var(--panel2) !important;
      border: 1px solid var(--border) !important;
      border-radius: var(--radius) !important;
      overflow: hidden !important;
    }
    .skt-card__inner { padding: var(--pad); }

    .skt-title {
      display:flex; align-items:center; justify-content:space-between; gap:10px;
      padding: 10px 12px;
      background: var(--accentSoft) !important;
      border-bottom: 1px solid var(--borderSoft) !important;
      font-weight: 900 !important;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      color: var(--text) !important;
    }

    input[type="text"], select, textarea {
      background: var(--panel) !important;
      color: var(--text) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      padding: 10px 12px !important;
      outline: none !important;
    }
    input.auto {
      display: block !important;
      margin: 0 auto !important;
      text-align: center !important;
    }
    #skt-search-toggle {
      display: flex;
      justify-content: center;
      margin: 6px 0 10px;
    }
    #skt-search-toggle button {
      padding: 8px 12px !important;
      font-size: 12px !important;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }
    input[type="text"]:focus, select:focus, textarea:focus {
      box-shadow: 0 0 0 3px var(--focusRing) !important;
      border-color: rgba(147, 51, 234, 0.55) !important;
    }

    input[type="submit"], button.skt-btn {
      background: linear-gradient(135deg, var(--accent), var(--accent2)) !important;
      color: #fff !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      padding: 10px 12px !important;
      font-weight: 900 !important;
      cursor: pointer !important;
    }
    input[type="submit"]:hover, button.skt-btn:hover {
      filter: brightness(1.05);
    }

    #skt-sortbar { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .skt-inline-sort {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      padding: 6px 10px;
      border: 1px solid var(--borderSoft);
      border-radius: 10px;
      background: var(--panel);
      margin-top: 8px;
    }
    .skt-inline-sort a {
      color: var(--accent2) !important;
      font-weight: 800 !important;
    }

    table.lista { width: 100% !important; border-collapse: collapse !important; background: transparent !important; }
    .block {
      background: var(--accentSoft) !important;
      border: 1px solid var(--borderSoft) !important;
      color: var(--text) !important;
      font-weight: 900 !important;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      padding: 10px 12px !important;
    }
    .header {
      background: transparent !important;
      color: var(--textDim) !important;
      border-bottom: 1px solid var(--borderSoft) !important;
      padding: 10px 8px !important;
      font-weight: 800 !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 12px;
    }
    td.lista {
      background: transparent !important;
      border-bottom: 1px solid var(--borderSoft) !important;
      padding: 10px 8px !important;
      vertical-align: middle;
      color: var(--text) !important;
    }
    table.lista tr:hover td.lista { background: var(--hover) !important; }

    .green, .green a { color: var(--good) !important; font-weight: 900 !important; }
    .yellow, .yellow a { color: var(--warn) !important; font-weight: 900 !important; }
    .red, .red a { color: #ef4444 !important; font-weight: 900 !important; }
    td.green, td.yellow, td.red {
      background: var(--panel) !important;
      border: 1px solid var(--borderSoft) !important;
    }

    /* Panely (komenty/fórum) */
    .maxwidthclass, .maxwidthclass.greenbox { position: static !important; margin: 0 !important; width: 100% !important; }
    .maxwidthclass table, .maxwidthclass.greenbox table { width: 100% !important; border-collapse: collapse !important; background: transparent !important; }

    /* Práve sa sťahuje */
    #div_refresh_members, .fixed1 { position: static !important; margin: 0 !important; width: 100% !important; }
    #div_refresh_members strong {
      display:block !important; padding: 10px 12px !important; color: var(--accent2) !important;
      border-bottom: 1px solid var(--borderSoft) !important; font-weight: 900 !important; text-transform: uppercase;
    }
    .alert_default {
      background: transparent !important;
      border: none !important;
      border-left: 3px solid rgba(147, 51, 234, 0.85) !important;
      padding: 8px 12px !important;
      margin: 0 !important;
      border-bottom: 1px solid var(--borderSoft) !important;
    }
    .alert_default li { list-style: none !important; }
    .alert_default em { font-style: normal !important; color: var(--textDim) !important; }

    button,
    input[type="button"],
    input[type="submit"],
    input[type="reset"] {
      background: linear-gradient(135deg, var(--accent), var(--accent2)) !important;
      color: #fff !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      padding: 10px 14px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
    }
    button:hover,
    input[type="button"]:hover,
    input[type="submit"]:hover,
    input[type="reset"]:hover {
      filter: brightness(1.05);
    }

    iframe#mujIframe {
      display: block;
      background: var(--panel2);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 18px 45px rgba(0,0,0,0.25);
    }
    #cboxdiv {
      background: var(--panel2);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 10px;
      box-shadow: 0 18px 45px rgba(0,0,0,0.25);
    }
    #cboxdiv iframe {
      border: 1px solid var(--border) !important;
      border-radius: 12px;
      background: var(--panel);
    }
    #cboxdiv iframe + iframe {
      border-top: 1px solid var(--border) !important;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    :root[data-skt-host="announce"] table,
    :root[data-skt-host="announce"] th,
    :root[data-skt-host="announce"] td {
      color: var(--text) !important;
      background: transparent !important;
    }
    :root[data-skt-host="announce"] th {
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-size: 12px;
      background: var(--accentSoft) !important;
      border-bottom: 1px solid var(--borderSoft) !important;
      padding: 8px 6px;
    }
    :root[data-skt-host="announce"] td {
      border-bottom: 1px solid var(--borderSoft) !important;
      padding: 8px 6px;
    }
    :root[data-skt-host="announce"] a {
      color: var(--accent2) !important;
    }
    :root[data-skt-host="announce"] a:hover {
      color: var(--text) !important;
    }

    /* UserCP layout */
    .container {
      max-width: 1200px;
      margin: 18px auto;
      padding: 0 12px;
      color: var(--text);
    }
    .profile-header,
    .panel,
    .session-card,
    .status-box-container {
      background: var(--panel2);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 18px 45px rgba(0,0,0,0.25);
    }
    .profile-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .header-left { display: flex; gap: 14px; align-items: center; }
    .avatar-placeholder {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: var(--accentSoft);
      color: var(--text);
      font-weight: 900;
    }
    .profile-info h1 { margin: 0; font-size: 22px; }
    .subtitle { color: var(--textDim); }
    .status-box-container {
      padding: 12px;
      min-width: 260px;
    }
    .status-title { color: var(--textDim); font-weight: 700; }
    .status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid var(--borderSoft);
      border-radius: 12px;
      padding: 10px 12px;
      margin-top: 10px;
      background: var(--panel);
    }
    .st-ip { color: var(--text); font-weight: 700; }
    .st-label,
    .bg-green {
      background: rgba(34, 197, 94, 0.18);
      color: var(--good);
      border: 1px solid rgba(34, 197, 94, 0.35);
      padding: 4px 8px;
      border-radius: 999px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
      margin: 12px 0 18px;
    }
    .panel { padding: 14px; }
    .panel h2 { margin: 0 0 12px; font-size: 16px; }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--borderSoft);
      flex-wrap: wrap;
    }
    .row:last-child { border-bottom: 0; }
    .label { color: var(--textDim); font-weight: 600; }
    .value {
      color: var(--text);
      text-align: right;
      overflow-wrap: anywhere;
      word-break: break-word;
      max-width: 65%;
    }
    .badge {
      background: var(--accentSoft);
      color: var(--text);
      border: 1px solid var(--borderSoft);
      border-radius: 999px;
      padding: 4px 8px;
      font-weight: 700;
    }
    .badge-success {
      background: rgba(34, 197, 94, 0.18);
      color: var(--good);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .badge-warning {
      background: rgba(245, 158, 11, 0.16);
      color: var(--warn);
      border-color: rgba(245, 158, 11, 0.35);
    }
    .session-card { margin: 12px 0; }
    .session-card,
    .session-card details,
    .session-card details > summary,
    .session-card .session-content {
      background: var(--panel2) !important;
      color: var(--text) !important;
    }
    .session-card details > summary {
      cursor: pointer;
      list-style: none;
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .session-card details > summary,
    .session-card details > summary * {
      color: var(--text);
    }
    .session-card details > summary::-webkit-details-marker { display: none; }
    .sess-header-main { display: grid; gap: 6px; }
    .sess-ip { font-weight: 700; }
    .sess-client { color: var(--textDim); }
    .sess-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--text);
      background: var(--panel);
      border: 1px solid var(--borderSoft);
      border-radius: 12px;
      padding: 8px 10px;
    }
    .sess-stats .sess-stat-item { color: var(--text); }
    .sess-stats .sess-stat-item b { color: var(--accent2); }
    .sess-stats .sess-stat-item:nth-child(1) { color: var(--accent2); }
    .sess-stats .sess-stat-item:nth-child(1) b { color: var(--accent2); }
    .sess-stats .sess-stat-item:nth-child(2) { color: var(--good); }
    .sess-stats .sess-stat-item:nth-child(2) b { color: var(--good); }
    .sess-stats .sess-stat-item:nth-child(3) { color: #ef4444; }
    .sess-stats .sess-stat-item:nth-child(3) b { color: #ef4444; }
    .session-content { padding: 12px 14px 16px; border-top: 1px solid var(--borderSoft); }
    .session-content table {
      width: 100%;
      border-collapse: collapse;
      background: transparent !important;
    }
    .session-content th {
      text-align: left;
      color: var(--textDim);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 8px 6px;
      border-bottom: 1px solid var(--borderSoft);
    }
    .session-content td {
      padding: 8px 6px;
      border-bottom: 1px solid var(--borderSoft);
      color: var(--text);
    }
    .session-content td[style*="color: green"],
    .session-content td[style*="color:green"] {
      color: var(--good) !important;
    }
    .session-content td[style*="color: red"],
    .session-content td[style*="color:red"] {
      color: #ef4444 !important;
    }

    div[style*="background: #e8f6f3"],
    div[style*="background:#e8f6f3"] {
      background: var(--panel) !important;
      border: 1px solid var(--border) !important;
      color: var(--text) !important;
      border-radius: 12px !important;
    }
    div[style*="background: #e8f6f3"] b,
    div[style*="background:#e8f6f3"] b {
      color: var(--text) !important;
    }

    /* Google custom search */
    .gsc-control-cse,
    .gsc-control-cse .gsc-control-wrapper-cse {
      background: transparent !important;
      color: var(--text) !important;
    }
    .gsc-control-cse .gsc-search-box,
    .gsc-control-cse .gsc-input-box,
    .gsc-control-cse .gsc-input,
    .gsc-control-cse input.gsc-input {
      background: var(--panel) !important;
      color: var(--text) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      box-shadow: none !important;
    }
    .gsc-control-cse .gsc-search-button-v2 {
      background: linear-gradient(135deg, var(--accent), var(--accent2)) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
    }
    .gsc-control-cse .gsc-search-button-v2 svg path { fill: #fff !important; }
    .gsc-control-cse .gsc-clear-button,
    .gsc-control-cse .gsst_a,
    .gsc-control-cse .gscb_a {
      color: var(--textDim) !important;
    }
    .gsc-control-cse .gsc-resultsbox-visible,
    .gsc-control-cse .gsc-resultsRoot,
    .gsc-control-cse .gsc-result,
    .gsc-control-cse .gsc-webResult {
      background: transparent !important;
      color: var(--text) !important;
    }
    .gsc-control-cse .gsc-result .gs-title,
    .gsc-control-cse .gsc-result .gs-title * {
      color: var(--accent2) !important;
    }
    .gsc-control-cse .gsc-result .gs-title:hover,
    .gsc-control-cse .gsc-result .gs-title:hover * {
      color: var(--text) !important;
    }
    .gsc-control-cse .gs-snippet,
    .gsc-control-cse .gsc-snippet,
    .gsc-control-cse .gsc-result-info,
    .gsc-control-cse .gs-visibleUrl,
    .gsc-control-cse .gs-visibleUrl-short,
    .gsc-control-cse .gs-visibleUrl-long,
    .gsc-control-cse .gsc-cursor-page {
      color: var(--textDim) !important;
    }
    .gsc-control-cse .gsc-cursor-page.gsc-cursor-current-page {
      color: var(--text) !important;
      border-color: var(--accent) !important;
    }
    .gsc-control-cse .gcsc-find-more-on-google,
    .gsc-control-cse .gcsc-find-more-on-google * {
      color: var(--textDim) !important;
    }
  `;

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  injectFontLink();
  injectStyle();
  applyTheme(readStoredTheme() || DEFAULT_THEME);
  setHostDataset();
  setupThemeBridge();

  // ---- Sort (hidden inputs + submit) ----
  function safeQS() {
    try { return new URLSearchParams(location.search); } catch { return new URLSearchParams(); }
  }

  function ensureHidden(form, name, value) {
    if (!form) return;
    let i = form.querySelector(`input[name="${CSS.escape(name)}"]`);
    if (!i) {
      i = document.createElement('input');
      i.type = 'hidden';
      i.name = name;
      form.appendChild(i);
    }
    i.value = value;
  }

  function applySort(field) {
    const qs = safeQS();
    const currentOrder = (qs.get('order') || '').toLowerCase();
    const currentBy = (qs.get('by') || 'desc').toLowerCase();
    const nextBy = (currentOrder === field && currentBy === 'desc') ? 'asc' : 'desc';

    const form =
      document.querySelector('form[action*="torrents_v2.php"]') ||
      document.querySelector('form[action*="torrents.php"]');

    if (!form) return;

    ensureHidden(form, 'order', field);
    ensureHidden(form, 'by', nextBy);
    form.submit();
  }

  function injectSortUI() {
    if (document.getElementById('skt-sortbar')) return;

    const form =
      document.querySelector('form[action*="torrents_v2.php"]') ||
      document.querySelector('form[action*="torrents.php"]');
    if (!form) return;

    const submit = form.querySelector('input[type="submit"]');
    if (!submit) return;

    const qs = safeQS();
    const currentOrder = (qs.get('order') || '').toLowerCase();
    const currentBy = (qs.get('by') || 'desc').toLowerCase();

    const bar = document.createElement('div');
    bar.id = 'skt-sortbar';

    function mk(label, field) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'skt-btn';
      const arrow = (currentOrder === field) ? (currentBy === 'desc' ? ' ↓' : ' ↑') : ' ↕';
      b.textContent = `${label}${arrow}`;
      b.addEventListener('click', (e) => {
        e.preventDefault();
        applySort(field);
      });
      return b;
    }

    bar.appendChild(mk('Seeds', 'seeds'));
    bar.appendChild(mk('Velikost', 'size'));

    submit.parentNode.appendChild(bar);
  }

  function injectInlineSortLinks() {
    if (!location.pathname.includes('torrents_v2.php')) return;
    if (injectSortInPagination()) return;
    injectSortInSearchRow();
  }

  function injectSortInPagination() {
    const pageLinks = Array.from(document.querySelectorAll('a[href*="page="]'));
    const candidate = pageLinks.find((link) => {
      const p = link.closest('p');
      return p && /Predchozi|Dalsi/i.test(p.textContent || '');
    });
    if (!candidate) return false;

    const cell = candidate.closest('td');
    if (!cell || cell.querySelector('.skt-inline-sort')) return false;

    const wrap = document.createElement('div');
    wrap.className = 'skt-inline-sort';

    const { order: currentOrder, by: currentBy } = getSortState();
    wrap.appendChild(makeInlineSortLink('S', 'seeds', currentOrder, currentBy));
    wrap.appendChild(makeInlineSortLink('L', 'leechers', currentOrder, currentBy));
    wrap.appendChild(makeInlineSortLink('C', 'finished', currentOrder, currentBy));

    cell.appendChild(wrap);
    return true;
  }

  function injectSortInSearchRow() {
    const form = document.querySelector('form[action*="torrents_v2.php"]');
    if (!form) return;
    const searchInput = form.querySelector('input[name="search"]');
    const row = searchInput ? searchInput.closest('tr') : null;
    if (!row || row.querySelector('.skt-inline-sort')) return;

    const submitCell = row.querySelector('input[type="submit"]')?.closest('td');
    const targetCell = document.createElement('td');
    targetCell.className = 'lista';
    targetCell.setAttribute('align', 'center');

    const wrap = document.createElement('div');
    wrap.className = 'skt-inline-sort';

    const { order: currentOrder, by: currentBy } = getSortState();
    wrap.appendChild(makeInlineSortLink('S', 'seeds', currentOrder, currentBy));
    wrap.appendChild(makeInlineSortLink('L', 'leechers', currentOrder, currentBy));
    wrap.appendChild(makeInlineSortLink('C', 'finished', currentOrder, currentBy));

    targetCell.appendChild(wrap);

    if (submitCell && submitCell.parentNode === row) {
      submitCell.insertAdjacentElement('afterend', targetCell);
    } else {
      row.appendChild(targetCell);
    }
  }

  function makeInlineSortLink(label, order, currentOrder, currentBy) {
    const isActive = currentOrder === order;
    const nextBy = isActive && currentBy === 'desc' ? 'asc' : 'desc';
    const arrow = isActive ? (currentBy === 'desc' ? ' ↓' : ' ↑') : ' ↕';
    const link = document.createElement('a');
    link.href = buildSortHref(order, nextBy);
    link.textContent = `${label}${arrow}`;
    return link;
  }

  function injectListSortLinks() {
    if (!location.pathname.includes('torrents_v2.php')) return;
    const { order: currentOrder, by: currentBy } = getSortState();
    const rows = Array.from(document.querySelectorAll('table.lista tr'));
    let applied = false;
    for (const row of rows) {
      const headers = Array.from(row.querySelectorAll('td.header, th.header'));
      if (!headers.length) continue;
      const labels = headers.map((cell) => (cell.textContent || '').replace(/\s+/g, '').toUpperCase());
      if (!labels.includes('S') || !labels.includes('L') || !labels.includes('C')) continue;

      const cellS = findHeaderCell(headers, 'S');
      const cellL = findHeaderCell(headers, 'L');
      const cellC = findHeaderCell(headers, 'C');
      if (!cellS || !cellL || !cellC) continue;

      setHeaderSortLink(cellS, 'S', 'seeds', currentOrder, currentBy);
      setHeaderSortLink(cellL, 'L', 'leechers', currentOrder, currentBy);
      setHeaderSortLink(cellC, 'C', 'finished', currentOrder, currentBy);
      applied = true;
    }
    if (!applied) injectListSortLinksFallback(currentOrder, currentBy);
  }

  function injectListSortLinksFallback(currentOrder, currentBy) {
    const headers = Array.from(document.querySelectorAll('td.header, th.header'));
    const cells = headers.filter((cell) => {
      const text = (cell.textContent || '').replace(/\s+/g, '').toUpperCase();
      return text === 'S' || text === 'L' || text === 'C';
    });
    if (!cells.length) return;
    cells.forEach((cell) => {
      const label = (cell.textContent || '').replace(/\s+/g, '').toUpperCase();
      if (label === 'S') setHeaderSortLink(cell, 'S', 'seeds', currentOrder, currentBy);
      if (label === 'L') setHeaderSortLink(cell, 'L', 'leechers', currentOrder, currentBy);
      if (label === 'C') setHeaderSortLink(cell, 'C', 'finished', currentOrder, currentBy);
    });
  }

  function getSortState() {
    const qs = safeQS();
    return {
      order: (qs.get('order') || '').toLowerCase(),
      by: (qs.get('by') || 'desc').toLowerCase(),
    };
  }

  function findHeaderCell(headers, label) {
    const match = label.trim().toUpperCase();
    return headers.find((cell) => {
      const text = (cell.textContent || '').replace(/\s+/g, '').toUpperCase();
      return text === match;
    });
  }

  function setHeaderSortLink(cell, label, order, currentOrder, currentBy) {
    if (cell.dataset.sktSort === order) return;
    const isActive = currentOrder === order;
    const nextBy = isActive && currentBy === 'desc' ? 'asc' : 'desc';
    const arrow = isActive ? (currentBy === 'desc' ? ' ↓' : ' ↑') : ' ↕';
    const link = document.createElement('a');
    link.href = buildSortHref(order, nextBy);
    link.textContent = label;
    cell.textContent = '';
    cell.appendChild(link);
    cell.appendChild(document.createTextNode(arrow));
    cell.dataset.sktSort = order;
  }

  function buildSortHref(order, by) {
    const qs = safeQS();
    const params = new URLSearchParams();
    params.set('active', qs.get('active') || '0');
    params.set('order', order);
    params.set('by', (by || 'desc').toUpperCase());
    return `/torrent/torrents_v2.php?${params.toString()}`;
  }

  // ---- Layout fix: move ALL 950 tables ----
  function createCard(titleText, nodeToWrap) {
    const card = document.createElement('section');
    card.className = 'skt-card';

    if (titleText) {
      const title = document.createElement('div');
      title.className = 'skt-title';
      title.textContent = titleText;
      card.appendChild(title);
    }

    const inner = document.createElement('div');
    inner.className = 'skt-card__inner';
    if (nodeToWrap) inner.appendChild(nodeToWrap);
    card.appendChild(inner);
    return card;
  }

  function stripLegacyAttrs(root) {
    if (!root) return;
    root.querySelectorAll('[bgcolor]').forEach(el => {
      const bg = (el.getAttribute('bgcolor') || '').toLowerCase();
      if (bg === '#bedbeb' || bg === '#76b83e') el.removeAttribute('bgcolor');
    });
    root.querySelectorAll('table[width="950"]').forEach(t => t.removeAttribute('width'));
    root.querySelectorAll('.maxwidthclass').forEach(el => {
      el.style.left = '';
      el.style.top = '';
      el.style.position = '';
      el.style.marginLeft = '';
    });
  }

  function buildLayout() {
    if (document.getElementById('skt-app')) return;

    const center = document.querySelector('center');
    if (!center) return;

    // KLÍČOVÁ OPRAVA: vezmeme všechny 950px tabulky (hlavička + vyhledávání + torrenty + další bloky)
    const mainTables = Array.from(center.querySelectorAll(':scope > table[width="950"]'));
    if (!mainTables.length) return;

    // Side zdroje
    const downloading = document.querySelector('#div_refresh_members') || document.querySelector('.fixed1');

    // V praxi bývají dva .maxwidthclass panely (komenty + fórum)
    const sidePanels = Array.from(center.querySelectorAll('.maxwidthclass')).filter(Boolean);

    // Wrapper grid
    const app = document.createElement('div');
    app.id = 'skt-app';

    const main = document.createElement('div');
    main.id = 'skt-main';

    const side = document.createElement('div');
    side.id = 'skt-side';

    // Hlavní karta: vložíme VŠECHNY 950 tabulky za sebou
    const mainCard = document.createElement('section');
    mainCard.className = 'skt-card';
    const inner = document.createElement('div');
    inner.className = 'skt-card__inner';

    // přesun – nikoli clone (zachováme funkčnost skriptů/formů)
    for (const t of mainTables) inner.appendChild(t);
    mainCard.appendChild(inner);
    main.appendChild(mainCard);

    // Sidebar: stahuje + panely
    if (downloading) side.appendChild(createCard('Práve sa sťahuje', downloading));

    // Popisky panelů heuristicky (bez závislosti na textu)
    if (sidePanels[0]) side.appendChild(createCard('Najnovšie v komentoch / fóre', sidePanels[0]));
    if (sidePanels[1]) side.appendChild(createCard('Najnovšie v komentoch / fóre', sidePanels[1]));

    // vložit před center a odstranit center (aby nezůstalo prázdno)
    center.parentNode.insertBefore(app, center);
    app.appendChild(main);
    app.appendChild(side);
    center.remove();

    stripLegacyAttrs(app);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function idle(fn, timeout = 1200) {
    const ric = window.requestIdleCallback;
    if (typeof ric === 'function') ric(fn, { timeout });
    else setTimeout(fn, 200);
  }

  onReady(() => {
    buildLayout();
    injectSortUI();
    injectListSortLinks();
    injectInlineSortLinks();
    injectSearchToggle();
    moveCategoryCheckboxes();
    adjustPredCheckboxRow();
    capturePasskeyFromPage();
    injectMagnetLinks();
    injectThemeOptionsIntoStyleSelect();
    localizeCzech(document.body);
    idle(() => stripLegacyAttrs(document), 1200);
    idle(() => localizeCzech(document.body), 1400);
    idle(() => injectListSortLinks(), 1200);
    idle(() => adjustPredCheckboxRow(), 1400);
    idle(() => capturePasskeyFromPage(), 1500);
    idle(() => injectMagnetLinks(), 1000);
  });

  function readStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function applyTheme(name) {
    const nextTheme = THEMES[name] ? name : DEFAULT_THEME;
    activeTheme = nextTheme;
    const vars = THEMES[nextTheme];
    const root = document.documentElement;
    Object.keys(vars).forEach((key) => {
      root.style.setProperty(`--${key}`, vars[key]);
    });
    root.dataset.sktTheme = nextTheme;
    try { localStorage.setItem(STORAGE_KEY, nextTheme); } catch (_) {}
    syncStyleSelect();
    broadcastThemeToIframes();
  }

  function syncStyleSelect() {
    const select = getStyleSelect();
    if (!select) return;
    const themeValue = `${THEME_OPTION_PREFIX}${activeTheme}`;
    const hasTheme = Array.from(select.options).some((opt) => opt.value === themeValue);
    if (hasTheme) select.value = themeValue;
  }

  function getStyleSelect() {
    return document.querySelector('select[name="style"]');
  }

  function injectThemeOptionsIntoStyleSelect() {
    const select = getStyleSelect();
    if (!select || select.dataset.sktThemes === 'true') return;
    select.dataset.sktThemes = 'true';

    const existing = new Set(Array.from(select.options).map((opt) => opt.value));
    Object.keys(THEMES).forEach((name) => {
      const value = `${THEME_OPTION_PREFIX}${name}`;
      if (existing.has(value)) return;
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = `${name}`;
      select.appendChild(opt);
    });

    select.onchange = null;
    select.removeAttribute('onchange');
    select.addEventListener('change', (event) => {
      const value = select.value || '';
      if (value.startsWith(THEME_OPTION_PREFIX)) {
        event.preventDefault();
        applyTheme(value.slice(THEME_OPTION_PREFIX.length));
        return;
      }
      if (value) window.location.href = value;
    });

    syncStyleSelect();
  }

  function isMainHost() {
    return location.hostname === 'sktorrent.eu';
  }

  function isAnnounceHost() {
    return location.hostname === 'announce.sktorrent.eu';
  }

  function setHostDataset() {
    document.documentElement.dataset.sktHost = isAnnounceHost() ? 'announce' : 'main';
  }

  function setupThemeBridge() {
    if (isAnnounceHost()) {
      window.addEventListener('message', (event) => {
        if (!event || !event.data || event.data.type !== THEME_MESSAGE_TYPE) return;
        if (event.origin !== MAIN_ORIGIN) return;
        const theme = event.data.theme;
        if (theme && THEMES[theme]) applyTheme(theme);
      });
    }

    if (isMainHost()) {
      onReady(() => {
        const frames = getAnnounceIframes();
        frames.forEach((frame) => {
          frame.addEventListener('load', () => postThemeToFrame(frame));
        });
        broadcastThemeToIframes();
      });
    }
  }

  function isCzechUI() {
    const select = document.querySelector('select[name="langue"]');
    if (!select) return false;
    const opt = select.options[select.selectedIndex];
    const text = (opt?.textContent || '').toLowerCase();
    const value = opt?.value || '';
    return text.includes('cesk') || value.includes('langue=3');
  }

  function localizeCzech(root) {
    if (!root || !isCzechUI()) return;
    document.documentElement.lang = 'cs';
    const replacements = [
      { from: /Vitejte zpet/g, to: 'Vítejte zpět' },
      { from: /Odhlasit/g, to: 'Odhlásit' },
      { from: /Ako stahovat/g, to: 'Jak stahovat' },
      { from: /Pridaj novy torrent na stranku/g, to: 'Přidej nový torrent na stránku' },
      { from: /Ako vytvorit torrent a nahrat ho na server/g, to: 'Jak vytvořit torrent a nahrát ho na server' },
      { from: /Navod/g, to: 'Návod' },
      { from: /Pravidlá/g, to: 'Pravidla' },
      { from: /Najnovsich 20 prispevkov v komentoch/g, to: 'Nejnovějších 20 příspěvků v komentářích' },
      { from: /Najnovsich 10 prispevkov vo fore/g, to: 'Nejnovějších 10 příspěvků ve fóru' },
      { from: /Notifikacia navrchu/g, to: 'Notifikace nahoře' },
      { from: /Vzhlad/g, to: 'Vzhled' },
      { from: /Posledni pristup/g, to: 'Poslední přístup' },
      { from: /Pouzivas/g, to: 'Používáš' },
      { from: /Prednastavenie zobrazovania/g, to: 'Přednastavení zobrazení' },
      { from: /Serial\b/g, to: 'Seriál' },
      { from: /Uzivatelsky CP/g, to: 'Uživatelský CP' },
      { from: /Vase schranka SZ/g, to: 'Vaše schránka SZ' },
      { from: /Vase odeslane SZ/g, to: 'Vaše odeslané SZ' },
      { from: /Nova SZ/g, to: 'Nová SZ' },
      { from: /Zmenit profil/g, to: 'Změnit profil' },
      { from: /Zmenit heslo/g, to: 'Změnit heslo' },
      { from: /Zmenit PID/g, to: 'Změnit PID' },
      { from: /Aktivne torrenty/g, to: 'Aktivní torrenty' },
      { from: /Vitejte ve svem uzivatelskem CP/g, to: 'Vítejte ve svém uživatelském CP' },
      { from: /Uzivatel\b/g, to: 'Uživatel' },
      { from: /Registrovan\b/g, to: 'Registrován' },
      { from: /Zeme\b/g, to: 'Země' },
      { from: /Stazeno\b/g, to: 'Staženo' },
      { from: /Uploadnute Torrenty/g, to: 'Nahrané torrenty' },
      { from: /Uploadnute\b/g, to: 'Nahráno' },
      { from: /Forum Prispevku/g, to: 'Příspěvků ve fóru' },
      { from: /Pocitat seed/g, to: 'Počítat seed' },
      { from: /Vypnut seed sa da v sekcii/g, to: 'Vypnout seed lze v sekci' },
      { from: /Zoznamit sa/g, to: 'Seznámit se' },
      { from: /Zmenit Status sa da v sekcii/g, to: 'Změnit stav lze v sekci' },
      { from: /Zobrazovat Chat a Podpora/g, to: 'Zobrazovat chat a podporu' },
      { from: /Vas kredit/g, to: 'Váš kredit' },
      { from: /Vase seedbody/g, to: 'Vaše seedbody' },
      { from: /Vymenit za VIP! - 10000 bodov/g, to: 'Vyměnit za VIP! - 10000 bodů' },
      { from: /Zmena sa prejavi o 5 min/g, to: 'Změna se projeví do 5 min' },
      { from: /Prezyvka/g, to: 'Přezdívka' },
      { from: /Zobrazi sa namiesto/g, to: 'Zobrazí se místo' },
      { from: /Presunut svoje uploudovane veci na SystemSKT/g, to: 'Přesunout své uploadované věci na SystemSKT' },
      { from: /Zmena o 5 min/g, to: 'Změna do 5 min' },
      { from: /Tento uzivatel nenauploadoval zadne torrenty/g, to: 'Tento uživatel nenahrál žádné torrenty' },
      { from: /Aktívne Relácie/g, to: 'Aktivní relace' },
      { from: /Práve sa sťahuje/g, to: 'Právě se stahuje' },
      { from: /Zákaz pisania komentov/g, to: 'Zákaz psaní komentářů' },
      { from: /Zákaz Uploadu/g, to: 'Zákaz uploadu' },
      { from: /Zákaz PM\/Koment/g, to: 'Zákaz PM/komentářů' },
      { from: /Zákaz Mostu/g, to: 'Zákaz mostu' },
      { from: /Počítať Seed/g, to: 'Počítat seed' },
      { from: /Ignorované Kategórie/g, to: 'Ignorované kategorie' },
      { from: /Žiadne \(Všetko povolené\)/g, to: 'Žádné (Vše povoleno)' },
      { from: /Posledná IP na webe/g, to: 'Poslední IP na webu' },
      { from: /Posledný klient/g, to: 'Poslední klient' },
      { from: /Nastavenia/g, to: 'Nastavení' },
      { from: /Štýl/g, to: 'Styl' },
      { from: /Bezpečnosť/g, to: 'Bezpečnost' },
      { from: /ZBALENÁ/g, to: 'SBALENÁ' },
      { from: /ÁNO/g, to: 'ANO' },
      { from: /\bAKTIV\b/g, to: 'AKTIVNÍ' },
      { from: /Cesky\b/g, to: 'Česky' },
      { from: /Forum\b/g, to: 'Fórum' },
    ];

    const attrReplacements = [
      { from: /Ako stahovat torrenty/g, to: 'Jak stahovat torrenty' },
      { from: /Pridaj novy torrent na stranku/g, to: 'Přidej nový torrent na stránku' },
      { from: /Ako vytvorit torrent a nahrat ho na server/g, to: 'Jak vytvořit torrent a nahrát ho na server' },
      { from: /Vitejte zpet/g, to: 'Vítejte zpět' },
      { from: /Vase schranka SZ/g, to: 'Vaše schránka SZ' },
      { from: /Vase odeslane SZ/g, to: 'Vaše odeslané SZ' },
      { from: /Nova SZ/g, to: 'Nová SZ' },
      { from: /Zmenit profil/g, to: 'Změnit profil' },
      { from: /Zmenit heslo/g, to: 'Změnit heslo' },
      { from: /Zmenit PID/g, to: 'Změnit PID' },
      { from: /Vymenit za VIP! - 10000 bodov/g, to: 'Vyměnit za VIP! - 10000 bodů' },
      { from: /ulozit/gi, to: 'uložit' },
      { from: /zatvorit/gi, to: 'zavřít' },
    ];

    const applyReplacements = (text, list) => {
      let out = text;
      list.forEach((rule) => {
        out = out.replace(rule.from, rule.to);
      });
      return out;
    };

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest('script, style, noscript')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.nodeValue;
      const next = applyReplacements(text, replacements);
      if (next !== text) node.nodeValue = next;
    });

    root.querySelectorAll('a[title], img[alt], [aria-label], input[type="submit"], input[type="button"], input[type="reset"]').forEach((el) => {
      if (el.hasAttribute('title')) {
        const current = el.getAttribute('title') || '';
        const next = applyReplacements(current, attrReplacements);
        if (next !== current) el.setAttribute('title', next);
      }
      if (el.hasAttribute('alt')) {
        const current = el.getAttribute('alt') || '';
        const next = applyReplacements(current, attrReplacements);
        if (next !== current) el.setAttribute('alt', next);
      }
      if (el.hasAttribute('aria-label')) {
        const current = el.getAttribute('aria-label') || '';
        const next = applyReplacements(current, attrReplacements);
        if (next !== current) el.setAttribute('aria-label', next);
      }
      if (el instanceof HTMLInputElement && el.type !== 'hidden') {
        const current = el.value || '';
        const next = applyReplacements(current, attrReplacements);
        if (next !== current) el.value = next;
      }
    });
  }

  function injectSearchToggle() {
    const panel = document.getElementById('pzbalene');
    if (!panel || document.getElementById('skt-search-toggle')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'skt-search-toggle';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'skt-btn';
    wrapper.appendChild(button);

    panel.parentNode.insertBefore(wrapper, panel);

    let collapsed = readSearchToggle();
    setSearchCollapsed(collapsed);

    button.addEventListener('click', () => {
      collapsed = !collapsed;
      setSearchCollapsed(collapsed);
      storeSearchToggle(collapsed);
    });

    function setSearchCollapsed(isCollapsed) {
      panel.style.display = isCollapsed ? 'none' : 'block';
      button.textContent = getSearchToggleLabel(isCollapsed);
      button.setAttribute('aria-expanded', String(!isCollapsed));
    }
  }

  function moveCategoryCheckboxes() {
    const predx = document.querySelector('input[name="predx"]');
    const preds = document.querySelector('input[name="preds"]');
    if (!predx || !preds) return;

    const firstRow = predx.closest('tr');
    const predsCell = preds.closest('td');
    const secondRow = preds.closest('tr');
    if (!firstRow || !predsCell || !secondRow) return;

    const firstTable = firstRow.closest('table');
    const secondTable = secondRow.closest('table');
    if (!firstTable || !secondTable || firstTable !== secondTable) return;

    firstRow.appendChild(predsCell);
    if (!secondRow.querySelector('input')) secondRow.remove();
  }

  function adjustPredCheckboxRow() {
    const names = ['predx', 'predh', 'preda', 'predp', 'predf', 'preds'];
    const cells = names
      .map((name) => document.querySelector(`input[name="${name}"]`)?.closest('td'))
      .filter(Boolean);
    if (!cells.length) return;

    cells.forEach((cell) => {
      cell.colSpan = 1;
    });

    let total = cells.reduce((sum, cell) => sum + (cell.colSpan || 1), 0);
    let extra = 10 - total;
    let index = 0;
    while (extra > 0) {
      cells[index % cells.length].colSpan += 1;
      extra -= 1;
      index += 1;
    }
  }

  function capturePasskeyFromPage() {
    if (!isMainHost()) return;
    const existing = getStoredPasskey();
    const candidates = [];

    const pidEl = document.getElementById('user-pid');
    if (pidEl) candidates.push(pidEl.textContent || '');

    const labelCandidates = Array.from(document.querySelectorAll('.label, td, th, span, div, b'));
    const label = labelCandidates.find((el) => /PID|Passkey/i.test(el.textContent || ''));
    if (label) {
      const container = label.closest('tr') || label.parentElement;
      if (container) candidates.push(container.textContent || '');
    }

    const passkeyFromLinks = extractPasskeyFromLinks();
    if (passkeyFromLinks) candidates.push(passkeyFromLinks);

    candidates.push(document.body?.textContent || '');

    const passkey = candidates.map(parsePasskey).find(Boolean);
    if (passkey && passkey !== existing) {
      try { localStorage.setItem(PASSKEY_STORAGE_KEY, passkey); } catch (_) {}
      refreshMagnetLinks();
    }
  }

  function getStoredPasskey() {
    try { return localStorage.getItem(PASSKEY_STORAGE_KEY); } catch (_) { return null; }
  }

  function parsePasskey(text) {
    if (!text) return null;
    const match = text.match(/\b[a-f0-9]{32}\b/i);
    return match ? match[0] : null;
  }

  function extractPasskeyFromLinks() {
    const nodes = Array.from(document.querySelectorAll('a[href], iframe[src], script[src]'));
    for (const node of nodes) {
      const raw = node.getAttribute('href') || node.getAttribute('src') || '';
      if (!raw) continue;
      let url;
      try {
        url = new URL(raw, location.origin);
      } catch (_) {
        continue;
      }
      const pid = url.searchParams.get('pid') || url.searchParams.get('passkey');
      const parsed = parsePasskey(pid || '');
      if (parsed) return parsed;
    }
    return null;
  }

  function getMagnetTrackers() {
    const passkey = getStoredPasskey();
    const trackers = [];
    if (passkey) {
      trackers.push(`https://announce.sktorrent.eu/announce.php?passkey=${passkey}`);
    } else {
      trackers.push('https://announce.sktorrent.eu/announce.php');
    }
    trackers.push('udp://ipv4announce.sktorrent.eu:6969/announce');
    trackers.push('udp://tracker.opentrackr.org:1337/announce');
    return trackers;
  }

  function injectMagnetLinks() {
    const links = Array.from(document.querySelectorAll('a[href*="download.php?id="]'));
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      let url;
      try {
        url = new URL(href, location.origin);
      } catch (_) {
        return;
      }
      const id = url.searchParams.get('id') || '';
      if (!/^[a-f0-9]{40}$/i.test(id)) return;

      const name = url.searchParams.get('f') || '';
      const cell = link.closest('td');
      let magnetLink = cell ? cell.querySelector('a.skt-magnet') : null;
      if (!magnetLink) {
        magnetLink = document.createElement('a');
        magnetLink.className = 'skt-magnet';
        magnetLink.appendChild(createMagnetIcon());
        magnetLink.appendChild(document.createTextNode('Magnet'));
        if (cell) {
          cell.appendChild(document.createElement('br'));
          cell.appendChild(magnetLink);
        } else {
          link.insertAdjacentElement('afterend', magnetLink);
        }
      }

      magnetLink.dataset.sktInfohash = id;
      magnetLink.dataset.sktName = name;
      magnetLink.href = buildMagnetLink(id, name);

      link.dataset.sktMagnetAdded = '1';
    });
  }

  function buildMagnetLink(infoHash, name) {
    const parts = [`xt=urn:btih:${infoHash}`];
    if (name) {
      parts.push(`dn=${encodeURIComponent(name)}`);
    }
    getMagnetTrackers().forEach((tracker) => {
      parts.push(`tr=${encodeURIComponent(tracker)}`);
    });
    return `magnet:?${parts.join('&')}`;
  }

  function createMagnetIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M6 2h4v6a2 2 0 1 1-4 0V2zm8 0h4v6a2 2 0 1 1-4 0V2zM6 11a6 6 0 0 0 12 0V9h-2v2a4 4 0 0 1-8 0V9H6v2z',
    );
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    return svg;
  }

  function refreshMagnetLinks() {
    const magnets = Array.from(document.querySelectorAll('a.skt-magnet[data-skt-infohash]'));
    magnets.forEach((link) => {
      const hash = link.dataset.sktInfohash;
      if (!hash) return;
      const name = link.dataset.sktName || '';
      link.href = buildMagnetLink(hash, name);
    });
  }

  function readSearchToggle() {
    try { return localStorage.getItem(SEARCH_TOGGLE_KEY) === '1'; } catch (_) { return false; }
  }

  function storeSearchToggle(isCollapsed) {
    try { localStorage.setItem(SEARCH_TOGGLE_KEY, isCollapsed ? '1' : '0'); } catch (_) {}
  }

  function getSearchToggleLabel(isCollapsed) {
    if (isCzechUI()) return isCollapsed ? 'Zobrazit filtry' : 'Skrýt filtry';
    return isCollapsed ? 'Show filters' : 'Hide filters';
  }

  function getAnnounceIframes() {
    return Array.from(document.querySelectorAll('iframe')).filter((frame) => {
      const src = frame.getAttribute('src') || '';
      return frame.id === 'mujIframe' || src.includes('announce.sktorrent.eu/torrent/');
    });
  }

  function postThemeToFrame(frame) {
    try {
      frame.contentWindow?.postMessage(
        { type: THEME_MESSAGE_TYPE, theme: activeTheme },
        ANNOUNCE_ORIGIN,
      );
    } catch (_) {}
  }

  function broadcastThemeToIframes() {
    if (!isMainHost()) return;
    getAnnounceIframes().forEach((frame) => postThemeToFrame(frame));
  }

})();
