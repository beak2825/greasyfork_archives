// ==UserScript==
// @name         Stash Universal Performer Search
// @version      1.0.13
// @description  Empornium, Bunkr, SimpCity (prefill + focus), and Coomer (with OnlyFans/Fansly username detection) performer search for Stash.  Handles SPA + hard-refresh fallback and a minimal settings panel.
// @license      MIT
// @author       BiAndNerdy@gmail.com
// @match        http*://*/performers/*
// @run-at       document-idle
// @grant        none
// @namespace https://stashapp.example/rob
// @downloadURL https://update.greasyfork.org/scripts/555467/Stash%20Universal%20Performer%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555467/Stash%20Universal%20Performer%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- SimpCity Prefill Helper ---------- */
    if (
        location.hostname.includes('simpcity.cr') &&
        location.pathname.startsWith('/search') &&
        new URLSearchParams(location.search).has('sus_auto')
    ) {
        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(location.search);
            const qParam = params.get('q') || '';
            if (!qParam) return;

            const term = decodeURIComponent(qParam.replace(/\+/g, ' '));
            let attempts = 0;
            const tryFill = () => {
                const input = document.querySelector('input[name="q"]');
                if (input) {
                    input.value = term;
                    input.focus();
                } else if (attempts < 20) {
                    attempts++;
                    setTimeout(tryFill, 250);
                }
            };
            tryFill();
        });
        return;
    }

    /* ---------- Settings ---------- */
    const LS_KEY = 'stash-universal-search:settings';
    const DEFAULT_SETTINGS = {
        openInNewTabs: true,
        enabledSites: ['empornium', 'bunkr_archive', 'bunkr_albums', 'simpcity', 'coomer'],
    };
    const loadSettings = () => {
        try {
            return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(LS_KEY) || '{}'));
        } catch { return { ...DEFAULT_SETTINGS }; }
    };
    const saveSettings = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s));
    let SETTINGS = loadSettings();

    /* ---------- Site Definitions ---------- */
    const SITES = {
        empornium: {
            label: 'Empornium',
            tooltip: 'Empornium: taglist uses firstname.lastname (lowercase); mononyms plain.',
            buildUrls: (name) => {
                const parts = name.trim().split(/\s+/);
                const tag =
                      parts.length === 1
                ? parts[0].toLowerCase()
                : `${parts[0].toLowerCase()}.${parts.pop().toLowerCase()}`;
                return [`https://www.empornium.sx/torrents.php?&taglist=${encodeURIComponent(tag)}`];
            },
        },

        bunkr_archive: {
            label: 'Bunkr Archive',
            tooltip: 'Bunkr Archive: spaces become + (literal, not encoded).',
            buildUrls: (name) => {
                const q = name.trim().replace(/\s+/g, '+');
                return [`https://bunkrarchive.pythonanywhere.com/search?q=${q}`];
            },
        },

        bunkr_albums: {
            label: 'Bunkr Albums',
            tooltip: 'Bunkr-Albums.io: uses %20 for spaces.',
            buildUrls: (name) => {
                const q = name.trim().replace(/\s+/g, '%20');
                return [`https://bunkr-albums.io/?search=${q}`];
            },
        },

        simpcity: {
            label: 'SimpCity',
            tooltip: 'SimpCity: opens search page (title-only), prefilled and focused. MUST HIT ENTER OR CLICK SEARCH.',
            buildUrls: (name) => [
                `https://simpcity.cr/search/?t=post&c[title_only]=1&q=${encodeURIComponent(name)}&sus_auto=1`,
            ],
        },

        // --- Coomer with OnlyFans/Fansly username extraction ---
        coomer: {
            label: 'Coomer',
            tooltip: 'Coomer: prefers OnlyFans/Fansly handle if performer URLs contain one.',
            buildUrls: (name, _aliases, _inc, _cap, performer) => {
                const extractHandle = (urls) => {
                    if (!urls) return null;
                    const all = Array.isArray(urls) ? urls.join('\n') : String(urls);
                    const m = all.match(/(?:onlyfans\.com|fansly\.com)\/([A-Za-z0-9._-]+)/i);
                    return m ? m[1] : null;
                };

                const handle = performer?.urls ? extractHandle(performer.urls) : null;
                let term;

                if (handle) {
                    term = handle;
                    console.log(`[SUS] Using ${handle} from performer URLs for Coomer search`);
                } else {
                    term = name.trim().replace(/\s+/g, '');
                }

                return [`https://coomer.st/artists?q=${encodeURIComponent(term)}`];
            },
        },
    };

    /* ---------- GraphQL ---------- */
    const gql = async (query, variables) => {
        const res = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            credentials: 'same-origin',
        });
        const j = await res.json();
        if (j.errors) throw new Error(JSON.stringify(j.errors));
        return j.data;
    };

    const fetchPerformer = async (id) => {
        const q = `
      query FindPerformer($id: ID!) {
        findPerformer(id: $id) {
          id
          name
          alias_list
          urls
        }
      }`;
      const d = await gql(q, { id });
      return d?.findPerformer || null;
  };

    /* ---------- Helpers ---------- */
    const isPerf = () => /\/performers\/\d+/.test(location.pathname);
    const getPerfId = () => location.pathname.match(/\/performers\/(\d+)/)?.[1];

    const addStyles = () => {
        if (document.getElementById('sus-styles')) return;
        const css = `
      .sus-group{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
      .sus-btn{border:1px solid #4b5563;background:#1f2937;color:#e5e7eb;
        padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer}
      .sus-btn:hover{filter:brightness(1.15)}
      #sus-panel{position:fixed;top:20px;right:20px;z-index:99999;
        background:#111827;color:#e5e7eb;border:1px solid #6b7280;
        border-radius:8px;padding:12px;max-width:360px;}
      #sus-panel input[type="checkbox"]{accent-color:#93c5fd;}
      #sus-panel label{display:block;margin:4px 0;}
      #sus-panel button{margin-top:6px;}
    `;
      const s = document.createElement('style');
      s.id = 'sus-styles';
      s.textContent = css;
      document.head.appendChild(s);
  };

    const openUrls = (urls) => {
        urls.forEach((u, i) =>
                     setTimeout(() => window.open(u, SETTINGS.openInNewTabs ? '_blank' : '_self'), i * 150)
                    );
    };

    /* ---------- Settings Panel ---------- */
    function showSettingsPanel() {
        const existing = document.getElementById('sus-panel');
        if (existing) existing.remove();

        const p = document.createElement('div');
        p.id = 'sus-panel';
        const sites = Object.keys(SITES);
        p.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <b>Universal Search Settings</b>
        <span style="cursor:pointer;" id="sus-close">✕</span>
      </div>
      <label><input type="checkbox" id="sus-tabs" ${SETTINGS.openInNewTabs ? 'checked' : ''}>
        Open results in new tabs</label>
      <hr>
      <b>Enabled sites:</b>
      ${sites.map((k) =>
                  `<label><input type="checkbox" data-site="${k}" ${SETTINGS.enabledSites.includes(k) ? 'checked' : ''}>
         ${SITES[k].label}</label>`).join('')}
      <div style="text-align:right;">
        <button id="sus-save" class="sus-btn">Save</button>
      </div>
    `;
      document.body.appendChild(p);

      p.querySelector('#sus-close').onclick = () => p.remove();
      p.querySelector('#sus-save').onclick = () => {
          SETTINGS.openInNewTabs = p.querySelector('#sus-tabs').checked;
          SETTINGS.enabledSites = Array.from(p.querySelectorAll('input[data-site]:checked'))
              .map((i) => i.getAttribute('data-site'));
          saveSettings(SETTINGS);
          p.remove();
          alert('Settings saved. Refresh performer page to apply.');
      };
  }

    /* ---------- Build Buttons ---------- */
    const buildButtons = (perf) => {
        const anchor = Array.from(document.querySelectorAll('button'))
        .find((b) => /Edit/i.test(b.textContent || ''))?.parentElement;
        if (!anchor) return;

        const group = document.createElement('div');
        group.className = 'sus-group';

        SETTINGS.enabledSites.forEach((k) => {
            const site = SITES[k];
            if (!site) return;
            const btn = document.createElement('button');
            btn.className = 'sus-btn';
            btn.textContent = site.label;
            btn.title = site.tooltip;
            btn.onclick = () => {
                const urls = site.buildUrls(perf.name, perf.alias_list, false, 0, perf);
                openUrls(urls);
            };
            group.appendChild(btn);
        });

        const gear = document.createElement('button');
        gear.className = 'sus-btn';
        gear.textContent = '⚙️ Settings';
        gear.title = 'Configure Universal Search';
        gear.onclick = showSettingsPanel;
        group.appendChild(gear);

        anchor.parentElement.insertBefore(group, anchor.nextSibling);
    };

    /* ---------- SPA / Hard Refresh Fallback ---------- */
    let lastPath = '';
    let isInitializing = false;

    async function init() {
        if (isInitializing) return;
        isInitializing = true;

        if (!isPerf()) { isInitializing = false; return; }
        const id = getPerfId();
        if (!id) { isInitializing = false; return; }

        try {
            const perf = await fetchPerformer(id);
            if (perf) {
                if (!document.querySelector('.sus-group')) {
                    addStyles();
                    buildButtons(perf);
                }
            }
        } catch (e) {
            console.error('[SUS] GraphQL fail', e);
        }

        isInitializing = false;
    }

    function waitForPerformerPage() {
        const editButton = Array.from(document.querySelectorAll('button')).find(
            (b) => /Edit/i.test(b.textContent || '')
        );
        if (editButton) {
            init();
        } else {
            setTimeout(waitForPerformerPage, 500);
        }
    }

    waitForPerformerPage();

    const observer = new MutationObserver(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            document.querySelectorAll('.sus-group').forEach((e) => e.remove());
            waitForPerformerPage();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
})();
