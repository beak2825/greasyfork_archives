// ==UserScript==
// @name            GrometsPlaza
// @namespace       Gromet
// @description     Modernizes layout/typography, adds auto dark/light, improves readability across sub-sites
// @copyright       tightnshiny
// @icon            https://grometsplaza.net/favicon.ico
//
// @match           https://grometsplaza.net/*
// @match           https://www.grometsplaza.net/*
// @match           https://www.selfbound.net/*
// @match           https://www.mummified.net/*
// @match           https://www.boundstories.net/*
// @match           https://www.latexstories.net/*
// @match           https://www.packagedstories.net/*
// @match           https://www.dollstories.net/*
// @match           https://www.maidbots.net/*
// @match           https://www.trashcanstories.net/*
// @match           https://www.devouredstories.net/*
//
// @grant		none
// @run-at		document-start
//
// @license MIT
// @version         1.0.0
// @downloadURL https://update.greasyfork.org/scripts/548176/GrometsPlaza.user.js
// @updateURL https://update.greasyfork.org/scripts/548176/GrometsPlaza.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const STORAGE_KEY = 'gp-theme'; // 'auto' | 'dark' | 'light'
    const READ_KEY = 'gp-reading'; // 'narrow' | 'wide'
    const DATA_ATTR = 'data-gp-theme';
    const READING_ATTR = 'data-gp-reading';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredMode() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            return v === 'dark' || v === 'light' || v === 'auto' ? v : null;
        } catch (_) { return null; }
    }

    function setStoredMode(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch (_) {}
    }

    function computeEffective(mode) {
        if (mode === 'dark' || mode === 'light') return mode;
        return prefersDark && prefersDark.matches ? 'dark' : 'light';
    }

    function applyThemeAttr(mode) {
        const effective = computeEffective(mode);
        document.documentElement.setAttribute(DATA_ATTR, effective);
        try {
            document.documentElement.style.colorScheme = effective === 'dark' ? 'dark' : 'light';
        } catch (_) {}
    }

    // Early paint: set initial theme and minimal background to reduce FOUC
    const initMode = getStoredMode() || 'auto';
    applyThemeAttr(initMode);
    try {
        if (computeEffective(initMode) === 'dark') {
            document.documentElement.style.backgroundColor = '#0f1115';
        }
    } catch (_) {}

    // React to OS theme changes in auto mode
    if (prefersDark && typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', () => {
            if ((getStoredMode() || 'auto') === 'auto') applyThemeAttr('auto');
        });
    }

    // Reading width
    function getReadingMode() {
        try {
            const v = localStorage.getItem(READ_KEY);
            return v === 'wide' ? 'wide' : 'narrow';
        } catch (_) { return 'narrow'; }
    }
    function setReadingMode(v) {
        try { localStorage.setItem(READ_KEY, v); } catch (_) {}
    }
    function applyReadingAttr(mode) {
        const m = mode === 'wide' ? 'wide' : 'narrow';
        document.documentElement.setAttribute(READING_ATTR, m);
    }
    applyReadingAttr(getReadingMode());

    // Accent per host
    function applyHostAccent() {
        const host = (location.hostname || '').replace(/^www\./, '');
        const map = {
            'grometsplaza.net': '#2b90d9',
            'boundstories.net': '#ef4444',
            'selfbound.net': '#3b82f6',
            'mummified.net': '#a855f7',
            'latexstories.net': '#64748b',
            'packagedstories.net': '#14b8a6',
            'dollstories.net': '#ec4899',
            'maidbots.net': '#06b6d4',
            'trashcanstories.net': '#f97316',
            'devouredstories.net': '#10b981'
        };
        const accent = map[host] || '#2b90d9';
        try { document.documentElement.style.setProperty('--gp-accent', accent); } catch (_) {}
        document.documentElement.setAttribute('data-gp-host', host);
        // Mark legacy subsites that use older fixed layouts
        const legacyHosts = new Set([
          'boundstories.net','selfbound.net','mummified.net','latexstories.net',
          'packagedstories.net','dollstories.net','maidbots.net','trashcanstories.net','devouredstories.net'
        ]);
        document.documentElement.setAttribute('data-gp-legacy', legacyHosts.has(host) ? '1' : '0');
    }

    function applyPathContext() {
        const path = (location.pathname || '').toLowerCase();
        const isWorld = /(^|\/)world\//.test(path);
        document.documentElement.setAttribute('data-gp-world', isWorld ? '1' : '0');
    }
    applyPathContext();

    // Mark root subpages that should use the "home-like" layout tweaks
    function applyMainlikeContext() {
        const path = (location.pathname || '').toLowerCase();
        const mainlike = (
            /^\/search\.html$/.test(path) ||
            /^\/links\.html$/.test(path) ||
            /^\/pages\/(writers|storycodes)\.html$/.test(path) ||
            /^\/author_[a-z]+\.html$/.test(path)
        );
        document.documentElement.setAttribute('data-gp-mainlike', mainlike ? '1' : '0');
    }
    applyMainlikeContext();
    applyHostAccent();

    // Inject a viewport meta for better mobile layout
    function ensureViewport() {
        if (document.querySelector('meta[name="viewport"]')) return;
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1';
        (document.head || document.documentElement).appendChild(meta);
    }

    // Critical CSS to normalize backgrounds fast
    function injectCriticalStyles() {
        if (document.getElementById('gp-critical')) return;
        const style = document.createElement('style');
        style.id = 'gp-critical';
        style.textContent = `
          html[${DATA_ATTR}="dark"], html[${DATA_ATTR}="dark"] body { background:#0f1115 !important; }
        `;
        const root = document.documentElement;
        if (root && root.firstChild) root.insertBefore(style, root.firstChild); else root.appendChild(style);
    }

    // Full stylesheet: typography, layout, light/dark tokens
    function injectFullStyles() {
        if (document.getElementById('gp-styles')) return;
        const style = document.createElement('style');
        style.id = 'gp-styles';
        style.textContent = `
          /* Tokens: default to light */
          :root {
            --gp-bg: #f7f8fb;
            --gp-surface: #ffffff;
            --gp-surface-2: #f3f4f6;
            --gp-fg: #111418;
            --gp-fg-muted: #4b5563;
            --gp-link: #0b6bcb;
            --gp-link-visited: #6b44b3;
            --gp-border: #d0d7de;
            --gp-accent: #2b90d9;
            --gp-chip-bg: #eef2ff;
            --gp-chip-fg: #384bfd;
            --gp-read-width: 66ch;

            /* extra taxonomy chips (light) */
            --chip-package-bg:#efe9ff; --chip-package-fg:#5b21b6; --chip-package-bd:#ddd6fe;
            --chip-mummify-bg:#fde7f4; --chip-mummify-fg:#9d174d; --chip-mummify-bd:#fbcfe8;
            --chip-trash-bg:#e7f5d8;   --chip-trash-fg:#166534; --chip-trash-bd:#ccebc0;
            --chip-doll-bg:#ffe9f6;    --chip-doll-fg:#9d174d;  --chip-doll-bd:#ffc7e8;
            --chip-machine-bg:#eeeeee; --chip-machine-fg:#374151; --chip-machine-bd:#d1d5db;
            --chip-buried-bg:#111111;  --chip-buried-fg:#e5e7eb; --chip-buried-bd:#27272a;
            --chip-giant-bg:#d6ffe0;   --chip-giant-fg:#065f46;  --chip-giant-bd:#a7f3d0;

            /* taxonomy chip defaults (light) */
            --chip-bound-bg: #fee2e2; --chip-bound-fg: #991b1b; --chip-bound-bd: #fecaca;
            --chip-sb-bg: #dbeafe;    --chip-sb-fg: #1e40af; --chip-sb-bd: #bfdbfe;
            --chip-latex-bg: #e5e7eb; --chip-latex-fg:#374151; --chip-latex-bd:#d1d5db;
            --chip-erotic-bg:#fde2f3; --chip-erotic-fg:#9d174d; --chip-erotic-bd:#fbcfe8;
          }

          html[${DATA_ATTR}="dark"] {
            --gp-bg: #0f1115;
            --gp-surface: #151a21;
            --gp-surface-2: #12161c;
            --gp-fg: #e6e8eb;
            --gp-fg-muted: #9aa4af;
            --gp-link: #8ab4f8;
            --gp-link-visited: #c58af9;
            --gp-border: #2a3138;
            --gp-accent: #4da6ff;
            --gp-chip-bg: #1f2630;
            --gp-chip-fg: #9db7ff;
            /* taxonomy chip defaults (dark) */
            --chip-bound-bg: #3b1f23; --chip-bound-fg: #fca5a5; --chip-bound-bd: #7f1d1d;
            --chip-sb-bg: #1e293b;    --chip-sb-fg: #93c5fd; --chip-sb-bd: #1e3a8a;
            --chip-latex-bg:#1f2937;  --chip-latex-fg:#cbd5e1; --chip-latex-bd:#334155;
            --chip-erotic-bg:#3a1f2d; --chip-erotic-fg:#f9a8d4; --chip-erotic-bd:#831843;

            --chip-package-bg:#2a2238; --chip-package-fg:#c4b5fd; --chip-package-bd:#4c1d95;
            --chip-mummify-bg:#3a1f2d; --chip-mummify-fg:#f9a8d4; --chip-mummify-bd:#831843;
            --chip-trash-bg:#132916;   --chip-trash-fg:#86efac; --chip-trash-bd:#14532d;
            --chip-doll-bg:#3a1f2d;    --chip-doll-fg:#f9a8d4;  --chip-doll-bd:#831843;
            --chip-machine-bg:#1f2937; --chip-machine-fg:#cbd5e1; --chip-machine-bd:#374151;
            --chip-buried-bg:#0b0b0c;  --chip-buried-fg:#e5e7eb; --chip-buried-bd:#27272a;
            --chip-giant-bg:#052e24;   --chip-giant-fg:#6ee7b7;  --chip-giant-bd:#065f46;
          }

          /* Base */
          html[${DATA_ATTR}], html[${DATA_ATTR}] body {
            background: var(--gp-bg) !important; /* reset any gradients */
            background-image: none !important;
            color: var(--gp-fg) !important;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
          html[${DATA_ATTR}] body {
            font-family: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 16px !important;
            line-height: 1.7 !important;
          }

          /* Legacy subsites (light mode): restore classic body styling for layout compatibility */
          html[${DATA_ATTR}][data-gp-legacy="1"][data-gp-theme="light"] BODY {
            background: #F0F0F0 !important;
            color: #303030 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Containers */
          html[${DATA_ATTR}] #top,
          html[${DATA_ATTR}] #head-outer,
          html[${DATA_ATTR}] #head,
          html[${DATA_ATTR}] #main {
            background: var(--gp-surface) !important;
            color: var(--gp-fg) !important;
            box-shadow: none !important;
          }
          html[${DATA_ATTR}] #main { 
            max-width: 1320px; 
            margin: 0 auto; 
            padding: 12px 16px !important;
          }
          /* Home pages: no inner padding and wider max width */
          html[${DATA_ATTR}] .home #main { padding: 0 !important; max-width: 1440px !important; }
          /* Main-like subpages: replicate home layout tweaks */
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main { padding: 0 !important; max-width: 1440px !important; margin: 0 auto; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main > table { width: 100% !important; table-layout: fixed !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main > table td { vertical-align: top !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main > table > tbody > tr > td:first-child { width: 210px !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main > table > tbody > tr > td:last-child { width: auto !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] .sidebar { width: 210px !important; min-width: 210px !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] .sidebar a { white-space: normal !important; word-break: normal !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] .sidebar li { line-height: 1.35; }

          /* Author/links/search tables on main-like pages: normalize borders and backgrounds */
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main th,
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main td { 
            border: 1px solid var(--gp-border) !important;
            background: transparent !important; color: var(--gp-fg) !important;
            padding: 4px 6px !important; vertical-align: top !important; 
          }
          html[${DATA_ATTR}="dark"][data-gp-mainlike="1"] #main th { background: var(--gp-surface-2) !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main th[bgcolor],
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main td[bgcolor],
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main tr[bgcolor] { background: transparent !important; color: var(--gp-fg) !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main a { color: var(--gp-link) !important; }
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main a:visited { color: var(--gp-link-visited) !important; }

          /* World pages: stabilize legacy table layout */
          html[${DATA_ATTR}][data-gp-world="1"] #main { padding: 0 !important; max-width: 1440px; margin: 0 auto; }
          html[${DATA_ATTR}][data-gp-world="1"] center { display:block; max-width: 1440px; margin: 0 auto; }
          html[${DATA_ATTR}][data-gp-world="1"] body > table,
          html[${DATA_ATTR}][data-gp-world="1"] center > table,
          html[${DATA_ATTR}][data-gp-world="1"] #main > table {
            width: 100% !important;
            table-layout: fixed !important;
          }
          html[${DATA_ATTR}][data-gp-world="1"] body > table td,
          html[${DATA_ATTR}][data-gp-world="1"] center > table td,
          html[${DATA_ATTR}][data-gp-world="1"] #main > table td { vertical-align: top !important; padding: 0 8px !important; }
          html[${DATA_ATTR}][data-gp-world="1"] body > table > tbody > tr > td:first-child,
          html[${DATA_ATTR}][data-gp-world="1"] center > table > tbody > tr > td:first-child,
          html[${DATA_ATTR}][data-gp-world="1"] #main > table > tbody > tr > td:first-child {
            width: 210px !important; min-width: 210px !important;
          }
          html[${DATA_ATTR}][data-gp-world="1"] body > table > tbody > tr > td:nth-child(2),
          html[${DATA_ATTR}][data-gp-world="1"] center > table > tbody > tr > td:nth-child(2),
          html[${DATA_ATTR}][data-gp-world="1"] #main > table > tbody > tr > td:nth-child(2) { width: auto !important; }
          html[${DATA_ATTR}][data-gp-world="1"] body > table > tbody > tr > td:last-child,
          html[${DATA_ATTR}][data-gp-world="1"] center > table > tbody > tr > td:last-child,
          html[${DATA_ATTR}][data-gp-world="1"] #main > table > tbody > tr > td:last-child { width: 220px !important; min-width: 220px !important; }

          /* World pages: replace float-based layout with margin gutters */
          html[${DATA_ATTR}][data-gp-world="1"] .sidebar { float: left !important; width: 210px !important; }
          html[${DATA_ATTR}][data-gp-world="1"] .rhsbar { float: right !important; width: 220px !important; }
          html[${DATA_ATTR}][data-gp-world="1"] #main {
            margin-left: 230px !important;  /* sidebar 210 + gutters */
            margin-right: 240px !important; /* rhsbar 220 + gutters */
          }

          /* World pages: avoid dl/dt/dd clear rules interfering with columns */
          html[${DATA_ATTR}][data-gp-world="1"] dt { clear: none !important; }
          html[${DATA_ATTR}][data-gp-world="1"] dd { clear: none !important; }
          /* Home page: widen layout sensibly for legacy tables */
          html[${DATA_ATTR}] .home #main > table { width: 100% !important; table-layout: fixed !important; }
          html[${DATA_ATTR}] .home #main > table td { vertical-align: top !important; }
          html[${DATA_ATTR}] .home #main > table > tbody > tr > td:first-child { width: 210px !important; }
          html[${DATA_ATTR}] .home #main > table > tbody > tr > td:last-child { width: auto !important; }

          /* Boxes and cards */
          html[${DATA_ATTR}] .box-outer,
          html[${DATA_ATTR}] .box {
            background: var(--gp-surface-2) !important;
            border: 1px solid var(--gp-border) !important;
            border-radius: 12px !important;
            box-shadow: none !important;
          }
          html[${DATA_ATTR}] .box { padding: 10px 14px !important; }

          /* Readable story text blocks */
          html[${DATA_ATTR}] .story1,
          html[${DATA_ATTR}] .story1c,
          html[${DATA_ATTR}] .story5l,
          html[${DATA_ATTR}] .story6,
          html[${DATA_ATTR}] .storym,
          html[${DATA_ATTR}] .style4,
          html[${DATA_ATTR}] .styleDW,
          html[${DATA_ATTR}] .style20,
          html[${DATA_ATTR}] .style21,
          html[${DATA_ATTR}] .style22 {
            max-width: var(--gp-read-width);
            margin: 0 auto;
            padding: 0 12px;
            font-size: 17px !important;
            line-height: 1.8 !important;
          }

          html[${READING_ATTR}="wide"] { --gp-read-width: 132ch; }

          /* When in reading wide mode on story pages, hide asides and widen */
          html[${READING_ATTR}="wide"][data-gp-context="story"] #main { max-width: 1600px; }
          html[${READING_ATTR}="wide"][data-gp-context="story"] .gp-aside { display: none !important; }
          html[${READING_ATTR}="wide"][data-gp-context="story"] #main .box-outer:not(.gp-aside),
          html[${READING_ATTR}="wide"][data-gp-context="story"] #main .box:not(.gp-aside) {
            float: none !important; width: auto !important; max-width: none !important; clear: both !important;
          }

          /* Headings */
          html[${DATA_ATTR}] h1, html[${DATA_ATTR}] h2, html[${DATA_ATTR}] h3, html[${DATA_ATTR}] h4 {
            font-weight: 650 !important;
            color: var(--gp-fg) !important;
            background: transparent !important;
            border: none !important;
            margin: 1.2em 0 0.6em !important;
          }
          html[${DATA_ATTR}] h1 b, html[${DATA_ATTR}] h1 B {
            background: transparent !important;
            color: inherit !important;
            display: inline !important;
            padding: 0 !important;
            border-radius: 0 !important;
            font-weight: 700 !important;
          }
          html[${DATA_ATTR}] h1 { font-size: 1.7rem !important; }
          html[${DATA_ATTR}] h2 { font-size: 1.4rem !important; }
          html[${DATA_ATTR}] h3 { font-size: 1.15rem !important; color: var(--gp-fg-muted) !important; }

          /* Paragraphs and lists */
          html[${DATA_ATTR}] p { margin: 0.9em 0 !important; }
          html[${DATA_ATTR}] li { margin: 0.25em 0; }

          /* Links */
          html[${DATA_ATTR}] a { color: var(--gp-link) !important; }
          html[${DATA_ATTR}] a:visited { color: var(--gp-link-visited) !important; }
          html[${DATA_ATTR}] a:hover { text-decoration: underline !important; }
          html[${DATA_ATTR}] a { word-break: break-word; }

          /* Definition lists: keep simple to avoid layout breakage */
          html[${DATA_ATTR}] dl { margin: 0; padding: 0; }
          html[${DATA_ATTR}] dt { font-weight: 600; margin-top: 1em; clear: both; }
          html[${DATA_ATTR}] dd { margin: 0.4em 0 0.8em 0; color: var(--gp-fg-muted); padding: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; display: block; clear: both; }
          html[${DATA_ATTR}] dd::after { content: ""; display: block; clear: both; }

          /* Taxonomy chips */
          html[${DATA_ATTR}] #main dd .bound,
          html[${DATA_ATTR}] #main dd .sb,
          html[${DATA_ATTR}] #main dd .latex,
          html[${DATA_ATTR}] #main dd .erotic,
          html[${DATA_ATTR}] #main dd .package,
          html[${DATA_ATTR}] #main dd .mummify,
          html[${DATA_ATTR}] #main dd .trash,
          html[${DATA_ATTR}] #main dd .doll,
          html[${DATA_ATTR}] #main dd .machine,
          html[${DATA_ATTR}] #main dd .buried,
          html[${DATA_ATTR}] #main dd .giant {
            display: inline-block;
            padding: 2px 6px;
            margin: 0 6px 0 0;
            border: 1px solid var(--gp-border);
            border-radius: 8px;
            background: var(--gp-chip-bg);
            color: var(--gp-chip-fg);
            font-size: 12px;
            line-height: 1.4;
            min-width: 96%
          }

          /* Color-coded taxonomy chips */
          html[${DATA_ATTR}] #main dd .bound { background: var(--chip-bound-bg) !important; color: var(--chip-bound-fg) !important; border-color: var(--chip-bound-bd) !important; }
          html[${DATA_ATTR}] #main dd .sb    { background: var(--chip-sb-bg) !important;    color: var(--chip-sb-fg) !important;    border-color: var(--chip-sb-bd) !important; }
          html[${DATA_ATTR}] #main dd .latex { background: var(--chip-latex-bg) !important; color: var(--chip-latex-fg) !important; border-color: var(--chip-latex-bd) !important; }
          html[${DATA_ATTR}] #main dd .erotic{ background: var(--chip-erotic-bg) !important;color: var(--chip-erotic-fg) !important;border-color: var(--chip-erotic-bd) !important; }
          html[${DATA_ATTR}] #main dd .package{ background: var(--chip-package-bg) !important; color: var(--chip-package-fg) !important; border-color: var(--chip-package-bd) !important; }
          html[${DATA_ATTR}] #main dd .mummify{ background: var(--chip-mummify-bg) !important; color: var(--chip-mummify-fg) !important; border-color: var(--chip-mummify-bd) !important; }
          html[${DATA_ATTR}] #main dd .trash  { background: var(--chip-trash-bg) !important;   color: var(--chip-trash-fg) !important;   border-color: var(--chip-trash-bd) !important; }
          html[${DATA_ATTR}] #main dd .doll   { background: var(--chip-doll-bg) !important;    color: var(--chip-doll-fg) !important;    border-color: var(--chip-doll-bd) !important; }
          html[${DATA_ATTR}] #main dd .machine{ background: var(--chip-machine-bg) !important; color: var(--chip-machine-fg) !important; border-color: var(--chip-machine-bd) !important; }
          html[${DATA_ATTR}] #main dd .buried { background: var(--chip-buried-bg) !important;  color: var(--chip-buried-fg) !important;  border-color: var(--chip-buried-bd) !important; }
          html[${DATA_ATTR}] #main dd .giant  { background: var(--chip-giant-bg) !important;   color: var(--chip-giant-fg) !important;   border-color: var(--chip-giant-bd) !important; }

          /* Home page: also color .newstory when category is on the container or the item */
          html[${DATA_ATTR}] .home #main dd.bound .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.bound { background: var(--chip-bound-bg) !important; color: var(--chip-bound-fg) !important; border: 1px solid var(--chip-bound-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.sb .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.sb    { background: var(--chip-sb-bg) !important;    color: var(--chip-sb-fg) !important;    border: 1px solid var(--chip-sb-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.latex .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.latex { background: var(--chip-latex-bg) !important; color: var(--chip-latex-fg) !important; border: 1px solid var(--chip-latex-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.erotic .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.erotic{ background: var(--chip-erotic-bg) !important;color: var(--chip-erotic-fg) !important;border: 1px solid var(--chip-erotic-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.package .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.package{ background: var(--chip-package-bg) !important; color: var(--chip-package-fg) !important; border: 1px solid var(--chip-package-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.mummify .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.mummify{ background: var(--chip-mummify-bg) !important; color: var(--chip-mummify-fg) !important; border: 1px solid var(--chip-mummify-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.trash .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.trash  { background: var(--chip-trash-bg) !important;   color: var(--chip-trash-fg) !important;   border: 1px solid var(--chip-trash-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.doll .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.doll   { background: var(--chip-doll-bg) !important;    color: var(--chip-doll-fg) !important;    border: 1px solid var(--chip-doll-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.machine .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.machine{ background: var(--chip-machine-bg) !important; color: var(--chip-machine-fg) !important; border: 1px solid var(--chip-machine-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.buried .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.buried { background: var(--chip-buried-bg) !important;  color: var(--chip-buried-fg) !important;  border: 1px solid var(--chip-buried-bd) !important; }
          html[${DATA_ATTR}] .home #main dd.giant .newstory,
          html[${DATA_ATTR}] .home #main dd .newstory.giant  { background: var(--chip-giant-bg) !important;   color: var(--chip-giant-fg) !important;   border: 1px solid var(--chip-giant-bd) !important; }

          /* Images responsive */
          html[${DATA_ATTR}] img { max-width: 100% !important; height: auto !important; }

          /* Header/logo simplification */
          html[${DATA_ATTR}] .plaza #logo { background-image: none !important; }
          html[${DATA_ATTR}] #logo { 
            background: var(--gp-surface) !important;
            background-image: none !important;
            min-height: 64px;
            text-align: center;
            border-bottom: 3px solid var(--gp-accent);
          }

          /* Inputs */
          html[${DATA_ATTR}] input, html[${DATA_ATTR}] select, html[${DATA_ATTR}] textarea, html[${DATA_ATTR}] button {
            background: var(--gp-surface-2) !important;
            color: var(--gp-fg) !important;
            border: 1px solid var(--gp-border) !important;
            border-radius: 6px !important;
            padding: 6px 8px !important;
          }
          html[${DATA_ATTR}] #head input { font-size: 14px !important; cursor: pointer; }

          /* Tables (scoped to main content) */
          html[${DATA_ATTR}] #main table { border-color: var(--gp-border) !important; }
          html[${DATA_ATTR}] #main td, html[${DATA_ATTR}] #main th { background: transparent !important; color: var(--gp-fg) !important; }

          /* Old tags (scoped): keep header layout intact */
          html[${DATA_ATTR}] #main center { text-align: left !important; display: block; }
          html[${DATA_ATTR}] font { color: inherit !important; font: inherit !important; }

          /* Header search/input sizing so it doesn't overflow */
          html[${DATA_ATTR}] #head input[type="text"],
          html[${DATA_ATTR}] #head input[type="search"] {
            width: 220px !important;
            max-width: 60vw !important;
          }

          /* Code / pre */
          html[${DATA_ATTR}] pre, html[${DATA_ATTR}] code {
            white-space: pre-wrap; 
            word-break: break-word; 
            background: var(--gp-surface-2) !important; 
            border: 1px solid var(--gp-border) !important; 
            border-radius: 6px !important; 
            padding: 8px 10px !important; 
          }

          /* Section spacing */
          html[${DATA_ATTR}] #top, html[${DATA_ATTR}] #head-outer { margin-bottom: 8px !important; }

          /* Remove heavy gradients from skins */
          html[${DATA_ATTR}] .mummified .box-outer, 
          html[${DATA_ATTR}] .latex .box-outer, 
          html[${DATA_ATTR}] .bound .box-outer, 
          html[${DATA_ATTR}] .plaza .box-outer, 
          html[${DATA_ATTR}] .erotic .box-outer {
            background: var(--gp-surface-2) !important;
            box-shadow: none !important;
            border: 1px solid var(--gp-border) !important;
            border-radius: 12px !important;
            border-top: 2px solid var(--gp-accent) !important;
          }

          /* Selection */
          html[${DATA_ATTR}] ::selection { background: #1f6feb55; }

          /* Back to Top button */
          #gp-backtotop {
            position: fixed; bottom: 84px; right: 12px; z-index: 100000;
            padding: 8px 10px; font-size: 12px; line-height: 1;
            border-radius: 999px; cursor: pointer;
            border: 1px solid var(--gp-border);
            background: var(--gp-surface-2); color: var(--gp-fg);
            box-shadow: none; opacity: 0; pointer-events: none;
            transition: opacity .2s ease;
          }
          #gp-backtotop.visible { opacity: 1; pointer-events: auto; }

          /* Mini sticky header removed per user preference */

          /* Header links and search tidy */
          html[${DATA_ATTR}] #head p { margin: 0 !important; padding: 6px 10px !important; height: auto !important; line-height: 1.4 !important; }
          html[${DATA_ATTR}] #head p a { margin-right: 10px; }
          html[${DATA_ATTR}] #head input[type="text"],
          html[${DATA_ATTR}] #head input[type="search"] { height: 28px !important; padding: 4px 8px !important; }

          /* Home page: preserve update list rhythm */
          html[${DATA_ATTR}] .home #main dl,
          html[${DATA_ATTR}] .home #main dt,
          html[${DATA_ATTR}] .home #main dd { margin: 0 !important; }
          html[${DATA_ATTR}] .home #main dd { padding: 0 !important; display:block; width:100%; }
          html[${DATA_ATTR}] .home #main dd a { display:inline-block; max-width:100%; float:none !important; }

          /* Old fixed-width tables in home pages: relax to fluid */
          html[${DATA_ATTR}] .home #main table[width],
          html[${DATA_ATTR}] .home #main td[width],
          html[${DATA_ATTR}] .home #main table[style*="width" i] {
            width: auto !important; max-width: 100% !important; table-layout: auto !important;
          }
          /* Sidebar column width to prevent link wraps */
          html[${DATA_ATTR}] .home .sidebar { width: 210px !important; min-width: 210px !important; }
          html[${DATA_ATTR}] .home .sidebar a { white-space: normal !important; word-break: normal !important; }
          html[${DATA_ATTR}] .home .sidebar li { line-height: 1.35; }

          /* Footer back-to-top link */
          .gp-footer-backtop { text-align: center; margin: 18px 0 8px; }
          .gp-footer-backtop a { color: var(--gp-link); text-decoration: none; }
          .gp-footer-backtop a:hover { text-decoration: underline; }

          /* World pages: ensure dark-mode link and heading colors use theme tokens */
          html[${DATA_ATTR}="dark"][data-gp-world="1"] a,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] #main a,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .sidebar a,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .rhsbar a {
            color: var(--gp-link) !important;
          }
          html[${DATA_ATTR}="dark"][data-gp-world="1"] a:visited,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] #main a:visited,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .sidebar a:visited,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .rhsbar a:visited {
            color: var(--gp-link-visited) !important;
          }
          html[${DATA_ATTR}="dark"][data-gp-world="1"] h1,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] h2,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] h3,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] h4,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] h5,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .sidebar h5,
          html[${DATA_ATTR}="dark"][data-gp-world="1"] .rhsbar h3 {
            color: var(--gp-fg) !important;
          }

          /* Author pages: some headings use .authors > li > div with light gradients */
          html[${DATA_ATTR}="dark"] .authors div {
            background: var(--gp-surface-2) !important;
            background-image: none !important;
            color: var(--gp-fg) !important;
            border: 1px solid var(--gp-border) !important;
          }
          html[${DATA_ATTR}="dark"] .authors div a { color: var(--gp-fg) !important; }

          /* Multi-column lists on author and similar pages */
          html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories,
          html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors,
          html[${DATA_ATTR}][data-gp-world="1"] ul.stories,
          html[${DATA_ATTR}][data-gp-world="1"] ul.authors {
            margin: 0 !important;
            padding: 0 8px !important; /* add small left/right gutter so first/last columns align with inner columns */
            list-style: none !important;
            -webkit-column-count: 5 !important;
            -moz-column-count: 5 !important;
            column-count: 5 !important;
            -webkit-column-gap: 16px !important;
            -moz-column-gap: 16px !important;
            column-gap: 16px !important;
            -webkit-column-rule: 1px solid var(--gp-border) !important;
            -moz-column-rule: 1px solid var(--gp-border) !important;
            column-rule: 1px solid var(--gp-border) !important;
            background: transparent !important;
          }
          html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories li,
          html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors li,
          html[${DATA_ATTR}][data-gp-world="1"] ul.stories li,
          html[${DATA_ATTR}][data-gp-world="1"] ul.authors li {
            margin: 0 6px 12px 0 !important;
            overflow: visible !important;
          }

          /* Ensure author name blocks don't indent in the first column */
          html[${DATA_ATTR}] ul.authors li > div { margin-left: 0 !important; }

          /* Author links: normalize spacing and line-height */
          html[${DATA_ATTR}][data-gp-mainlike="1"] .authors a,
          html[${DATA_ATTR}][data-gp-world="1"] .authors a {
            font-weight: normal !important;
            display: block !important;
            margin-top: 6px !important;
            margin-left: 5px !important;
            line-height: 14px !important;
            text-decoration: none !important;
          }
          /* First link under each author: slightly tighter top margin */
          html[${DATA_ATTR}][data-gp-mainlike="1"] #main .authors a:first-of-type,
          html[${DATA_ATTR}][data-gp-world="1"] #main .authors a:first-of-type {
            margin-top: 3px !important;
          }

          /* Fix light border on chapter separators */
          html[${DATA_ATTR}][data-gp-mainlike="1"] .chN,
          html[${DATA_ATTR}][data-gp-world="1"] .chN { border-bottom: 1px solid var(--gp-border) !important; }

          /* Responsive column counts */
          @media (max-width: 1200px) {
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors,
            html[${DATA_ATTR}][data-gp-world="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-world="1"] ul.authors {
              -webkit-column-count: 4 !important; -moz-column-count: 4 !important; column-count: 4 !important;
            }
          }
          @media (max-width: 900px) {
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors,
            html[${DATA_ATTR}][data-gp-world="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-world="1"] ul.authors {
              -webkit-column-count: 3 !important; -moz-column-count: 3 !important; column-count: 3 !important;
            }
          }
          @media (max-width: 670px) {
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors,
            html[${DATA_ATTR}][data-gp-world="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-world="1"] ul.authors {
              -webkit-column-count: 2 !important; -moz-column-count: 2 !important; column-count: 2 !important;
            }
          }
          @media (max-width: 420px) {
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-mainlike="1"] ul.authors,
            html[${DATA_ATTR}][data-gp-world="1"] ul.stories,
            html[${DATA_ATTR}][data-gp-world="1"] ul.authors {
              -webkit-column-count: 1 !important; -moz-column-count: 1 !important; column-count: 1 !important;
            }
          }
          html[${DATA_ATTR}] .home #main dd .bound,
          html[${DATA_ATTR}] .home #main dd .sb,
          html[${DATA_ATTR}] .home #main dd .latex,
          html[${DATA_ATTR}] .home #main dd .erotic { border-radius: 8px; padding: 1px 6px; }

          /* Category pages: avoid over-constraining list layouts */
          html[${DATA_ATTR}] #main .categories dl,
          html[${DATA_ATTR}] #main .categories dd,
          html[${DATA_ATTR}] #main .categories dt { background: transparent !important; border: 0 !important; padding: 0 !important; border-radius: 0 !important; }

          /* Homepage-specific tweaks requested */
          /* Make newstory/category pills nearly full-width on homepage */
          html[${DATA_ATTR}] .home #main dd .bound,
          html[${DATA_ATTR}] .home #main dd .sb,
          html[${DATA_ATTR}] .home #main dd .latex,
          html[${DATA_ATTR}] .home #main dd .erotic,
          html[${DATA_ATTR}] .home #main dd .package,
          html[${DATA_ATTR}] .home #main dd .mummify,
          html[${DATA_ATTR}] .home #main dd .trash,
          html[${DATA_ATTR}] .home #main dd .doll,
          html[${DATA_ATTR}] .home #main dd .machine,
          html[${DATA_ATTR}] .home #main dd .buried,
          html[${DATA_ATTR}] .home #main dd .giant {
            display: inline-block;
            padding: 2px 6px;
            margin: 0 6px 0 0;
            border: 1px solid var(--gp-border);
            border-radius: 8px !important;
            background: var(--gp-chip-bg) !important;
            color: var(--gp-chip-fg) !important;
            font-size: 12px;
            line-height: 1.4;
            min-width: 96%;
            box-sizing: border-box;
          }

          /* Homepage header containers */
          html[${DATA_ATTR}] .home #top,
          html[${DATA_ATTR}][data-gp-mainlike="1"] #top {
            max-width: 1440px; margin: 0 auto;
            background: #E8E8E8; border-radius: 15px; padding: 5px 0; overflow: hidden;
          }
          html[${DATA_ATTR}] .home #head,
          html[${DATA_ATTR}][data-gp-mainlike="1"] #head {
            padding: 4px 12px; height: 40px; border: 1px solid #E3E3E3; border-radius: 15px;
            background: #F1F1F1; /* ie9 */
            background: linear-gradient(#FEFEFE,#D5D5D5);
          }

          /* Homepage banner strip (theme-aware) */
          html[${DATA_ATTR}] .home .banner,
          html[${DATA_ATTR}][data-gp-mainlike="1"] .banner {
            background: var(--gp-surface-2);
            color: var(--gp-fg);
            text-align: center;
            padding: 3px;
            margin-top: 5px;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    // Theme toggle button
    function injectToggle() {
        if (document.getElementById('gp-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'gp-toggle';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '12px',
            right: '12px',
            zIndex: 99999,
            padding: '6px 8px',
            fontSize: '12px',
            lineHeight: '1',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid var(--gp-border)',
            background: 'var(--gp-surface-2)',
            color: 'var(--gp-fg)'
        });

        function labelFor(mode) {
            const eff = computeEffective(mode);
            const icon = eff === 'dark' ? '🌙' : '☀️';
            return `GP: ${mode[0].toUpperCase()}${mode.slice(1)} ${icon}`;
        }

        let current = getStoredMode() || 'auto';
        btn.textContent = labelFor(current);
        btn.addEventListener('click', () => {
            current = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
            setStoredMode(current);
            applyThemeAttr(current);
            btn.textContent = labelFor(current);
        });

        document.documentElement.appendChild(btn);
    }

    // Reading mode toggle button
    function injectReadingToggle() {
        if (document.getElementById('gp-reading-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'gp-reading-toggle';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '48px',
            right: '12px',
            zIndex: 99999,
            padding: '6px 8px',
            fontSize: '12px',
            lineHeight: '1',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid var(--gp-border)',
            background: 'var(--gp-surface-2)',
            color: 'var(--gp-fg)'
        });

        function labelFor(mode) {
            return `Read: ${mode === 'wide' ? 'Wide' : 'Narrow'}`;
        }
        let current = getReadingMode();
        btn.textContent = labelFor(current);
        btn.addEventListener('click', () => {
            current = current === 'narrow' ? 'wide' : 'narrow';
            setReadingMode(current);
            applyReadingAttr(current);
            btn.textContent = labelFor(current);
        });
        document.documentElement.appendChild(btn);
    }

    // Heuristics: detect story page and tag side boxes as asides
    function markReadingContextAndAsides() {
        const storySel = '.story1, .story1c, .story5l, .story6, .storym, .style4, .styleDW, .style20, .style21, .style22';
        const isStory = !!document.querySelector(storySel);
        document.documentElement.setAttribute('data-gp-context', isStory ? 'story' : 'other');

        if (!isStory) return;
        // Likely aside boxes are generic .box-outer blocks with certain headings
        const ASIDE_HEADINGS = [
            'menu', 'premier', 'note', 'submit', 'monitor', 'search', 'rss',
            'other worlds', 'stories by author', 'authors', 'links', 'forum', 'contact'
        ];
        document.querySelectorAll('.box-outer').forEach((el) => {
            const h = el.querySelector('h4, h3, h2, h1');
            const title = (h && (h.textContent || '')).trim().toLowerCase();
            if (!title) return;
            if (ASIDE_HEADINGS.some(k => title.includes(k))) {
                el.classList.add('gp-aside');
            }
        });
    }

    // Back to top button
    function injectBackToTop() {
        if (document.getElementById('gp-backtotop')) return;
        const btn = document.createElement('button');
        btn.id = 'gp-backtotop';
        btn.textContent = 'Top ↑';
        btn.addEventListener('click', () => {
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
            catch (_) { window.scrollTo(0, 0); }
        });
        document.documentElement.appendChild(btn);

        const onScroll = () => {
            const show = window.scrollY > 600;
            btn.classList.toggle('visible', !!show);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Footer back to top link near the bottom of #main
    function injectFooterBackTop() {
        if (document.getElementById('gp-footer-backtop')) return;
        const container = document.querySelector('#main') || document.body;
        if (!container) return;
        const wrap = document.createElement('div');
        wrap.className = 'gp-footer-backtop';
        wrap.id = 'gp-footer-backtop';
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'back to the top ⤴';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
            catch (_) { window.scrollTo(0, 0); }
        });
        wrap.appendChild(link);
        container.appendChild(wrap);
    }

    // Mini sticky header removed per user request

    // Initialize
    function init() {
        ensureViewport();
        injectCriticalStyles();
        injectFullStyles();
        injectToggle();
        injectReadingToggle();
        injectBackToTop();
        injectFooterBackTop();
        markReadingContextAndAsides();
        // Remove critical after full loads
        const crit = document.getElementById('gp-critical');
        if (crit && crit.parentNode) crit.parentNode.removeChild(crit);
    }

    if (document.readyState === 'loading') {
        // inject critical immediately, wait for rest
        injectCriticalStyles();
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle bfcache restores
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            injectFullStyles();
        }
    });
})();
