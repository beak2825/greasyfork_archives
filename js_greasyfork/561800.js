// ==UserScript==
// @name         XV Profile Search - Create Date (Custom literal >=360, URL submit)
// @namespace    daniel.tools
// @version      3.2
// @description  Mejora create_date: custom literal >=360, sin recorte; acciones rápidas (aplicar sin recarga, copiar URL, limpiar) y atajos.
// @match        *://*.xvideos.com/*
// @all-frames   true
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561800/XV%20Profile%20Search%20-%20Create%20Date%20%28Custom%20literal%20%3E%3D360%2C%20URL%20submit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561800/XV%20Profile%20Search%20-%20Create%20Date%20%28Custom%20literal%20%3E%3D360%2C%20URL%20submit%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const OK = () => /^\/(profile-search|profileslist)/.test(location.pathname);
  const Y = 365.25, M = Y / 12, W = 7;
  const toNum = x => parseFloat(String(x).replace(',', '.'));
  const fmtYears = d => (d / Y).toFixed(1);
  const stripAccents = s => (s.normalize ? s.normalize('NFD').replace(/\p{Diacritic}/gu, '') : s);

  function parseDays(input) {
    const s = stripAccents((input || '').toLowerCase());
    const re = /([\d.,]+)\s*(anos?|a|yrs?|years?|y|mes(es)?|months?|m|semanas?|weeks?|w|s|dias?|days?|d)\b/gi;
    let m, total = 0, usedUnits = false;
    while ((m = re.exec(s))) {
      const n = toNum(m[1]); const u = m[2].toLowerCase(); usedUnits = true;
      if (['ano', 'anos', 'a', 'yr', 'yrs', 'year', 'years', 'y'].some(x => u.startsWith(x))) total += n * Y;
      else if (['mes', 'meses', 'month', 'months', 'm'].some(x => u.startsWith(x))) total += n * M;
      else if (['semana', 'semanas', 'week', 'weeks', 'w', 's'].some(x => u.startsWith(x))) total += n * W;
      else if (['dia', 'dias', 'day', 'days', 'd'].some(x => u.startsWith(x))) total += n;
    }
    if (!usedUnits && /^\s*[\d.,]+\s*$/.test(s)) total = toNum(s); // numero solo = dias
    return Math.max(0, Math.round(total));
  }

  function normalizeDays(d) {
    if (d >= 360) return String(d);
    if (d >= 90) return '90';
    if (d >= 40) return '40';
    if (d >= 15) return '15';
    if (d >= 4) return '4';
    return '0';
  }

  function buildUrlFromForm(form) {
    const url = new URL(form?.action || location.href, location.origin);
    if (!form) return url;
    const fd = new FormData(form);
    for (const [k, v] of fd.entries()) {
      if (v === '' || v === null) url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    }
    return url;
  }

  function syncFromURL(sel) {
    const v = new URL(location.href).searchParams.get('create_date');
    if (!v) return;
    let opt = [...sel.options].find(o => o.value === v);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = v;
      const d = Number(v) || 0;
      opt.textContent = d >= 360 ? `Custom: ${d} days (~${fmtYears(d)}y)` : `Custom: ${v}`;
      sel.appendChild(opt);
    }
    sel.value = v;
  }

  function describeValue(val) {
    const d = Number(val) || 0;
    if (val === 'custom') return 'Custom';
    if (!d) return 'Any';
    return d >= 360 ? `${d} days (~${fmtYears(d)}y)` : `${d} days`;
  }

  async function fetchProfileCount(url) {
    try {
      const res = await fetch(url.toString(), { credentials: 'same-origin' });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const el = doc.querySelector('#profile-search-result-count');
      return el?.textContent?.trim() || 'n/a';
    } catch (err) {
      console.error('count fetch error', err);
      return 'error';
    }
  }

  const debounce = (fn, ms = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  // --- Ocultar perfiles ya vistos ---
  const SEEN_KEY = 'xv_seen_profiles';
  const loadSeen = () => {
    try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
    catch { return new Set(); }
  };
  const saveSeen = (seenSet) => {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seenSet]));
  };
  const extractUsername = (href) => {
    try {
      const u = new URL(href, location.origin);
      // profile URL suele ser /profile/username o /profiles/username
      const parts = u.pathname.split('/').filter(Boolean);
      const ix = parts.indexOf('profile') >= 0 ? parts.indexOf('profile') : parts.indexOf('profiles');
      if (ix >= 0 && parts[ix + 1]) return parts[ix + 1].toLowerCase();
      return parts[parts.length - 1]?.toLowerCase() || '';
    } catch { return ''; }
  };
  const findProfileNodes = () => {
    return [...document.querySelectorAll('a[href*="/profile/"], a[href*="/profiles/"]')];
  };
  const hideSeenProfiles = (seenSet) => {
    const links = findProfileNodes();
    let hidden = 0;
    links.forEach(a => {
      const user = extractUsername(a.href);
      if (!user) return;
      const card = a.closest('.profile-card, .thumb-block, .profile-result, .row, li, div');
      if (card) card.classList.add('codex-seen-card');
      const ensureBadge = (show) => {
        if (!card) return;
        let badge = card.querySelector('.codex-seen-badge');
        if (show) {
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'codex-seen-badge';
            badge.textContent = 'Visto';
            card.appendChild(badge);
          }
        } else if (badge) {
          badge.remove();
        }
      };
      if (seenSet.has(user)) {
        if (card) card.classList.add('codex-seen-hidden');
        ensureBadge(true);
        hidden++;
      } else if (card) {
        card.classList.remove('codex-seen-hidden');
        ensureBadge(false);
      }
    });
    return hidden;
  };
  const markCurrentAsSeen = (seenSet) => {
    const links = findProfileNodes();
    links.forEach(a => {
      const user = extractUsername(a.href);
      if (user) seenSet.add(user);
    });
    saveSeen(seenSet);
  };

  function enhance() {
    if (!OK()) return;
    if (!document.getElementById('codex-style')) {
      const st = document.createElement('style');
      st.id = 'codex-style';
      st.textContent = `
        .codex-seen-hidden { display: none !important; }
        .codex-seen-card { position: relative; }
        .codex-seen-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 3px;
          pointer-events: none;
          z-index: 2;
        }
      `;
      document.head.appendChild(st);
    }
    const sel = document.querySelector('#create_date_select, select[name="create_date"]');
    if (!sel) return;
    if (sel.dataset.enhanced === 'codex' && sel.isConnected) return;

    const form = sel.closest('form') || document.querySelector('#profile-search-form') || document.querySelector('form[action*="profile"]');

    const initial = sel.value || sel.querySelector('option[selected]')?.value || '0';

    const add = (txt, val, id) => {
      if (id && sel.querySelector('#' + id)) return;
      if ([...sel.options].some(o => o.value == String(val))) return;
      const o = document.createElement('option');
      o.textContent = txt; o.value = String(val); if (id) o.id = id;
      o.selected = false; sel.appendChild(o);
    };
    add('Last 180 days', 180);
    add('Last 270 days', 270);
    add('Last 360 days', 360);
    add('Custom (anos/meses/semanas/dias)', 'custom', 'custom_date_option');

    sel.value = initial;
    syncFromURL(sel);

    let lastValue = sel.value || initial;

    const status = document.createElement('div');
    status.style.fontSize = '11px';
    status.style.margin = '4px 0';
    status.textContent = `create_date: ${describeValue(sel.value)}`;
    status.style.color = '#2c7a00';

    const seenSet = loadSeen();
    const seenLabels = [];
    const refreshSeenLabels = (hidden = null) => {
      const size = seenSet.size;
      const suffix = hidden !== null ? ` (ocultos: ${hidden})` : '';
      const txt = `Vistos: ${size}${suffix}`;
      seenLabels.forEach(l => l.textContent = txt);
    };

    const countLabels = [];
    const countNowAll = async () => {
      countLabels.forEach(l => l.textContent = '...');
      const url = buildUrlFromForm(form);
      url.searchParams.set('create_date', String(sel.value || '0'));
      const count = await fetchProfileCount(url);
      const txt = `Perfiles: ${count}`;
      countLabels.forEach(l => l.textContent = txt);
    };
    const countDebouncedAll = debounce(countNowAll, 400);

    const applyNoReload = () => {
      const url = buildUrlFromForm(form);
      url.searchParams.set('create_date', String(sel.value || '0'));
      history.replaceState(null, '', url.toString());
    };

    const buildTools = (container) => {
      if (!container) return;
      const actionsWrap = document.createElement('div');
      actionsWrap.style.margin = '4px 0';
      const toggle = document.createElement('a');
      toggle.href = '#';
      toggle.textContent = 'Herramientas ▼';
      toggle.style.fontSize = '11px';
      toggle.style.display = 'inline-block';
      toggle.style.marginRight = '6px';
      toggle.style.color = '#007bff';
      const actions = document.createElement('div');
      actions.style.display = 'none';
      actions.style.gap = '4px';
      actions.style.marginTop = '4px';
      actions.style.flexWrap = 'wrap';
      actions.style.alignItems = 'center';
      const mkBtn = (label, title, handler) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.title = title;
        b.style.fontSize = '11px';
        b.className = 'btn btn-default btn-xs';
        b.addEventListener('click', handler);
        b.style.color = '#0a0a0a';
        return b;
      };
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const open = actions.style.display !== 'none';
        actions.style.display = open ? 'none' : 'flex';
        toggle.textContent = open ? 'Herramientas ▼' : 'Herramientas ▲';
      });

      actions.appendChild(mkBtn('Aplicar', 'Actualiza la URL con el valor actual sin navegar', applyNoReload));
      actions.appendChild(mkBtn('Copiar URL', 'Copia la URL con los filtros actuales', () => {
        const url = buildUrlFromForm(form);
        url.searchParams.set('create_date', String(sel.value || '0'));
        const txt = url.toString();
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt);
        else prompt('Copia la URL:', txt);
      }));
      actions.appendChild(mkBtn('Limpiar fecha', 'Reinicia create_date a 0', () => {
        sel.value = '0';
        lastValue = '0';
        applyNoReload();
        status.textContent = `create_date: ${describeValue(sel.value)}`;
        countDebouncedAll();
      }));

      const countLabel = document.createElement('span');
      countLabel.style.fontSize = '11px';
      countLabel.style.color = '#0a58aa';
      countLabel.textContent = '';
      countLabels.push(countLabel);
      actions.appendChild(mkBtn('Contar', 'Calcula cantidad de perfiles con filtros actuales', countNowAll));
      actions.appendChild(countLabel);

      const seenLabel = document.createElement('span');
      seenLabel.style.fontSize = '11px';
      seenLabel.style.color = '#0a58aa';
      seenLabel.textContent = '';
      seenLabels.push(seenLabel);
      actions.appendChild(mkBtn('Marcar vistos', 'Añade los perfiles de esta página a la lista de vistos', () => {
        markCurrentAsSeen(seenSet);
        const hidden = hideSeenProfiles(seenSet);
        refreshSeenLabels(hidden);
      }));
      actions.appendChild(mkBtn('Ocultar vistos', 'Oculta los perfiles ya vistos en esta búsqueda', () => {
        const hidden = hideSeenProfiles(seenSet);
        refreshSeenLabels(hidden);
      }));
      actions.appendChild(mkBtn('Limpiar vistos', 'Borra la lista de vistos', () => {
        seenSet.clear();
        saveSeen(seenSet);
        hideSeenProfiles(seenSet);
        refreshSeenLabels(0);
      }));
      actions.appendChild(seenLabel);

      actionsWrap.appendChild(toggle);
      actionsWrap.appendChild(actions);
      container.appendChild(actionsWrap);
    };

    sel.parentElement?.appendChild(status);
    buildTools(sel.parentElement);
    const summary = document.querySelector('#profile-search-filters-summary');
    if (summary) buildTools(summary);
    countDebouncedAll();
    hideSeenProfiles(seenSet);
    refreshSeenLabels();

    // Guarda el ultimo valor no-custom
    sel.addEventListener('change', () => {
      if (sel.value !== 'custom') {
        lastValue = sel.value;
        status.textContent = `create_date: ${describeValue(sel.value)}`;
        countDebounced();
      }
    }, { capture: true });

    // Handler de Custom
    sel.addEventListener('change', () => {
      if (sel.value !== 'custom') { return; }
      const prev = lastValue;
      const inp = prompt('Ej: "2 anos", "6 meses", "400 dias", "720", "1y 3m".\n>=360 se envian literal.');
      if (!inp) { sel.value = prev; return; }
      const days = parseDays(inp);
      if (!days || isNaN(days)) { alert('Formato invalido'); sel.value = prev; return; }
      const final = normalizeDays(days);

      let dyn = document.getElementById('custom_dynamic_option');
      if (!dyn) { dyn = document.createElement('option'); dyn.id = 'custom_dynamic_option'; sel.appendChild(dyn); }
      const dNum = Number(final) || 0;
      dyn.value = final;
      dyn.textContent = dNum >= 360 ? `Custom: ${final} days (~${fmtYears(dNum)}y)` : `Custom: ${final}`;
      sel.value = final;
      lastValue = final;
      status.textContent = `create_date: ${describeValue(sel.value)}`;

      if ((Number(final) || 0) >= 360) {
        const url = buildUrlFromForm(form);
        url.searchParams.set('create_date', String(final));
        history.replaceState(null, '', url.toString());
      }
      countDebounced();
    });

    // Intercepta submit nativo SOLO si el valor es >=360 para forzar URL completa
    if (form) {
      form.addEventListener('submit', (e) => {
        const val = String(sel.value || '0');
        const d = Number(val) || 0;
        const final = normalizeDays(d);
        if ((Number(final) || 0) >= 360) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const url = buildUrlFromForm(form);
          url.searchParams.set('create_date', String(final));
          location.assign(url.toString());
          return false;
        }
        sel.value = final;
        lastValue = final;
        status.textContent = `create_date: ${describeValue(sel.value)}`;
        countDebounced();
        return true;
      }, { capture: true });

      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(el => {
        const evt = el.tagName === 'INPUT' && el.type === 'text' ? 'input' : 'change';
        el.addEventListener(evt, () => countDebounced());
      });
    }

    sel.dataset.enhanced = 'codex';
  }

  new MutationObserver(enhance).observe(document, { childList: true, subtree: true });
  enhance();

  // Atajos: Alt+D (custom prompt), Alt+K focus keywords, Alt+T aplica sin recargar
  window.addEventListener('keydown', e => {
    if (!OK()) return;
    if (e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      const sel = document.querySelector('#create_date_select, select[name="create_date"]');
      if (!sel) return;
      sel.value = 'custom';
      sel.dispatchEvent(new Event('change'));
    }
    if (e.altKey && (e.key === 'k' || e.key === 'K')) {
      const kw = document.querySelector('#keywords_text');
      if (kw) { e.preventDefault(); kw.focus(); }
    }
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      const form = document.querySelector('#profile-search-form') || document.querySelector('form[action*="profile"]');
      const url = buildUrlFromForm(form);
      url.searchParams.set('create_date', String((document.querySelector('#create_date_select, select[name="create_date"]')?.value) || '0'));
      history.replaceState(null, '', url.toString());
    }
  });
})();



