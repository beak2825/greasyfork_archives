// ==UserScript==
// @name         WME Boundary Tools (WKTMap + Polygons) - Casper Edition
// @namespace    casper/wme-boundary-tools
// @version      1.3.2
// @description  Multi-select boundary search + export ONE combined file (GeoJSON/WKT/POLY/WKT-ALL-DL). Stable (no Turf).
// @author       Casper
// @license      MIT
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_info
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js?version=latest
// @connect      nominatim.openstreetmap.org
// @connect      polygons.openstreetmap.fr
// @downloadURL https://update.greasyfork.org/scripts/560652/WME%20Boundary%20Tools%20%28WKTMap%20%2B%20Polygons%29%20-%20Casper%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/560652/WME%20Boundary%20Tools%20%28WKTMap%20%2B%20Polygons%29%20-%20Casper%20Edition.meta.js
// ==/UserScript==


(async () => {
  'use strict';

  // -------------------- bootstrap --------------------
  let sdk;
  try {
    sdk = await bootstrap();
    if (!sdk?.Sidebar) throw new Error('WME SDK Sidebar not available.');
  } catch (e) {
    console.error('WME Boundary Tools: bootstrap failed', e);
    return;
  }

  // -------------------- constants --------------------
  // ✅ updated key to avoid mixing old settings
  const STORAGE_KEY = 'casper_wme_boundary_tools_settings_v3_2';

  const POLY_BASE = 'https://polygons.openstreetmap.fr/';
  const WKT_URL   = (relId) => `${POLY_BASE}get_wkt.py?id=${relId}&params=0`;
  const GEOJSON   = (relId) => `${POLY_BASE}get_geojson.py?id=${relId}&params=0`;
  const POLY      = (relId) => `${POLY_BASE}get_poly.py?id=${relId}&params=0`;
  const IMG_PNG   = (relId) => `${POLY_BASE}get_image.py?id=${relId}&params=0`;

  const WKT_MAP_HOME = () => `https://wktmap.com/`;

  // ✅ auto version from GM_info
  const VERSION = (typeof GM_info !== 'undefined' && GM_info?.script?.version)
    ? GM_info.script.version
    : '1.3.2';

  // -------------------- i18n --------------------
  const I18N = {
    en: {
      tab: 'Boundary Tools',
      title: 'WME Boundary Tools',
      subtitle: 'Multi-select + export ONE combined file (GeoJSON/WKT/POLY).',
      lang: 'Language',
      level: 'Boundary level',
      level_country: 'Country',
      level_state: 'State/Province',
      level_city: 'City',
      query: 'Search name',
      query_ph: 'Example: Iraq / Baghdad / Basra / الأنبار ...',
      search: 'Search',
      batch: 'Batch search (one per line)',
      batch_ph: 'Iraq\nBaghdad Iraq\nBasra Iraq\nالأنبار العراق',
      batch_btn: 'Batch Search',
      results: 'Results',
      selected: 'Selected',
      export_one: 'Export Combined (ONE file)',
      exp_geo_all: 'Download GeoJSON (ALL)',
      exp_wkt_all: 'Copy WKT (ALL)',
      exp_wkt_all_dl: 'Download WKT (ALL)',
      exp_wkt_open: 'Copy WKT then open WKTMap',
      exp_poly: 'Download POLY (Combined)',
      status: 'Status',
      status_ready: 'Ready.',
      status_searching: 'Searching…',
      status_no_results: 'No results.',
      status_need_pick: 'Select at least one item.',
      status_fetch_geo: 'Fetching GeoJSON…',
      status_fetch_wkt: 'Fetching WKT…',
      status_fetch_poly: 'Fetching POLY…',
      status_done: 'Done.',
      status_copied: 'Copied.',
      status_opened: 'Opened.',
      status_dl: 'Download started.',
      footer: 'Developed by Casper'
    },
    ar: {
      tab: 'الحدود',
      title: 'أداة الحدود',
      subtitle: 'تحديد متعدد + تصدير ملف واحد (GeoJSON/WKT/POLY).',
      lang: 'اللغة',
      level: 'مستوى الحدود',
      level_country: 'دولة',
      level_state: 'ولاية/محافظة',
      level_city: 'مدينة',
      query: 'اسم البحث',
      query_ph: 'مثال: العراق / بغداد / البصرة / الأنبار ...',
      search: 'بحث',
      batch: 'بحث جماعي (كل سطر اسم)',
      batch_ph: 'العراق\nبغداد العراق\nالبصرة العراق\nالأنبار العراق',
      batch_btn: 'بحث جماعي',
      results: 'النتائج',
      selected: 'المحدد',
      export_one: 'تصدير ملف واحد (مجمع)',
      exp_geo_all: 'تنزيل GeoJSON (الكل)',
      exp_wkt_all: 'نسخ WKT (الكل)',
      exp_wkt_all_dl: 'تنزيل WKT (الكل)',
      exp_wkt_open: 'نسخ WKT ثم فتح WKTMap',
      exp_poly: 'تنزيل POLY (مجمع)',
      status: 'الحالة',
      status_ready: 'جاهز.',
      status_searching: 'جارِ البحث…',
      status_no_results: 'ماكو نتائج.',
      status_need_pick: 'حدد عنصر واحد على الأقل.',
      status_fetch_geo: 'جارِ جلب GeoJSON…',
      status_fetch_wkt: 'جارِ جلب WKT…',
      status_fetch_poly: 'جارِ جلب POLY…',
      status_done: 'تم.',
      status_copied: 'تم النسخ.',
      status_opened: 'تم الفتح.',
      status_dl: 'بدأ التنزيل.',
      footer: 'تطوير: Casper'
    }
  };

  // -------------------- settings --------------------
  const DEFAULTS = Object.freeze({ lang: 'en', level: 'country', lastQuery: '', lastBatch: '' });
  let S = { ...DEFAULTS };

  const loadSettings = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) S = { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { S = { ...DEFAULTS }; }
  };
  const saveSettings = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch {} };
  loadSettings();

  const t = (k) => (I18N[S.lang]?.[k] ?? I18N.en[k] ?? k);

  // -------------------- helpers --------------------
  const el = (tag, props = {}, children = []) => {
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    children.forEach(c => n.appendChild(c));
    return n;
  };

  const escapeHtml = (s) =>
    String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const setStatus = (msg, isError = false) => {
    const box = document.getElementById('cwt-status');
    if (!box) return;
    box.textContent = msg;
    box.style.color = isError ? '#b00020' : '#2b2b2b';
  };

const copyToClipboard = async (text) => {
  const str = String(text ?? '');

  // 1) Tampermonkey way (الأوثق)
  try {
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(str, 'text');
      setStatus(t('status_copied'));
      return true;
    }
  } catch {}

  // 2) Browser clipboard
  try {
    await navigator.clipboard.writeText(str);
    setStatus(t('status_copied'));
    return true;
  } catch {}

  // 3) Old fallback
  try {
    const ta = document.createElement('textarea');
    ta.value = str;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    setStatus(t('status_copied'));
    return true;
  } catch {
    setStatus('Copy failed.', true);
    return false;
  }
};


  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setStatus(t('status_opened'));
  };

  const downloadTextFile = (text, filename, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setStatus(t('status_dl'));
  };

  // ✅ تنزيل حقيقي من URL (بدون فتح صفحة نص) — يدعم WKT/GeoJSON/POLY/PNG
  const downloadBinaryViaGM = (url, filename, mime = 'application/octet-stream', timeoutMs = 30000) => new Promise((resolve, reject) => {
    const xhr = (typeof GM !== 'undefined' && GM?.xmlHttpRequest)
  ? GM.xmlHttpRequest
  : (typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null);
    if (!xhr) return reject(new Error('GM XHR unavailable'));

    xhr({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      timeout: timeoutMs,
      onload: (res) => {
        if (res.status < 200 || res.status >= 300) return reject(new Error('HTTP ' + res.status));
        const blob = new Blob([res.response], { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        setStatus(t('status_dl'));
        resolve(true);
      },
      onerror: () => reject(new Error('network error')),
      ontimeout: () => reject(new Error('timeout'))
    });
  });

  const gmFetchText = (url, timeoutMs = 25000) => new Promise((resolve, reject) => {
  const xhr = (typeof GM !== 'undefined' && GM?.xmlHttpRequest)
  ? GM.xmlHttpRequest
  : (typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null);
  if (!xhr) return reject(new Error('GM XHR unavailable'));

    xhr({
      method: 'GET',
      url,
      headers: { 'Accept': '*/*' },
      timeout: timeoutMs,
      onload: (res) => {
        if (res.status >= 200 && res.status < 300) resolve(res.responseText || '');
        else reject(new Error('HTTP ' + res.status));
      },
      onerror: () => reject(new Error('network error')),
      ontimeout: () => reject(new Error('timeout'))
    });
  });

  const gmFetchJson = async (url) => JSON.parse(await gmFetchText(url, 20000));

  // GeoJSON -> WKT (Polygon/MultiPolygon + GeometryCollection)
  const geojsonToWkt = (geom) => {
    const ringToStr = (ring) => ring.map(pt => `${pt[0]} ${pt[1]}`).join(', ');
    const polyToStr = (poly) => `(${poly.map(r => `(${ringToStr(r)})`).join(', ')})`;

    if (!geom) return '';
    if (geom.type === 'Polygon') return `POLYGON${polyToStr(geom.coordinates)}`;
    if (geom.type === 'MultiPolygon') return `MULTIPOLYGON(${geom.coordinates.map(p => polyToStr(p)).join(', ')})`;
    if (geom.type === 'GeometryCollection') {
      const parts = geom.geometries.map(g => geojsonToWkt(g)).filter(Boolean);
      return `GEOMETRYCOLLECTION(${parts.join(', ')})`;
    }
    return '';
  };

  // -------------------- Nominatim search --------------------
  const nominatimSearch = async (q, level) => {
    const url =
      'https://nominatim.openstreetmap.org/search' +
      '?format=jsonv2&addressdetails=1&extratags=1&namedetails=1&limit=15' +
      '&accept-language=' + encodeURIComponent('en') +
      '&q=' + encodeURIComponent(q);

    const data = await gmFetchJson(url);

    const want = (item) => {
      const typeOk = item.osm_type === 'relation';
      const adminOk = item?.extratags?.boundary === 'administrative' || item?.extratags?.admin_level;
      const admin = parseInt(item?.extratags?.admin_level || '', 10);

      const levelHintOk = (() => {
        if (!admin || Number.isNaN(admin)) return true;
        if (level === 'country') return admin <= 4;
        if (level === 'state') return admin >= 3 && admin <= 6;
        if (level === 'city') return admin >= 7 && admin <= 10;
        return true;
      })();

      return typeOk && adminOk && levelHintOk;
    };

    const filtered = Array.isArray(data) ? data.filter(want) : [];
    const fallback = Array.isArray(data) ? data.filter(d => d.osm_type === 'relation') : [];
    return (filtered.length ? filtered : fallback).slice(0, 12);
  };

  // -------------------- UI styles --------------------
  const injectCss = () => {
    const css = `
      #cwt-root{font-size:13px; padding:10px}
      #cwt-root *{box-sizing:border-box}
      #cwt-title{font-weight:900; font-size:14px; margin-bottom:4px}
      #cwt-sub{font-size:11px; color:#666; margin-bottom:10px; line-height:1.35}
      #cwt-row{display:flex; gap:8px; margin:6px 0}
      #cwt-row > div{flex:1}
      #cwt-root label{display:block; font-size:11px; color:#444; margin:0 0 4px 0}
      #cwt-root select, #cwt-root input, #cwt-root textarea{
        width:100%; padding:8px; border:1px solid #d6d6d6; border-radius:10px; font-size:12px; outline:none; background:#fff;
      }
      #cwt-root textarea{min-height:80px; resize:vertical}
      #cwt-root button{
        width:100%; padding:10px; border:0; border-radius:12px; cursor:pointer; font-weight:900; font-size:12px;
      }
      #cwt-searchBtn{background:#1f6feb; color:#fff}
      #cwt-batchBtn{background:#0b1320; color:#fff; margin-top:6px}
      #cwt-blockTitle{font-weight:900; font-size:12px; margin:10px 0 6px 0}
      #cwt-resultsList, #cwt-selectedList{border:1px solid #e7e7e7; border-radius:12px; overflow:hidden; background:#fff}
      .cwt-item{padding:8px 10px; border-bottom:1px solid #f0f0f0}
      .cwt-item:last-child{border-bottom:0}
      .cwt-itemHead{display:flex; align-items:flex-start; justify-content:space-between; gap:8px}
      .cwt-item strong{display:block; font-size:12px}
      .cwt-meta{font-size:10px; color:#666; margin-top:2px}
      .cwt-addBtn{border:1px solid #d7e2ff; background:#f3f7ff; color:#0b3b9f; font-weight:900; padding:6px 8px; border-radius:10px; cursor:pointer; white-space:nowrap}
      .cwt-xBtn{border:1px solid #ffd1d9; background:#fff5f7; color:#a20b2a; font-weight:900; padding:6px 8px; border-radius:10px; cursor:pointer; white-space:nowrap}
      .cwt-actionsRow{display:flex; gap:6px; flex-wrap:wrap; margin-top:8px}
      .cwt-ico{border:1px solid #e6e6e6; background:#f8f8f8; padding:7px 10px; border-radius:12px; cursor:pointer; font-weight:900; font-size:12px; user-select:none}
      .cwt-ico:hover{background:#eef5ff; border-color:#cfe0ff}
      .cwt-ico.dl{background:#f5fffb}
      .cwt-ico.dl:hover{background:#e8fff6}
      .cwt-exportBox{border:1px dashed #cfd8e3; background:#fbfdff; border-radius:12px; padding:10px; margin:10px 0}
      .cwt-exportRow{display:flex; gap:6px; flex-wrap:wrap}
      #cwt-statusWrap{margin-top:10px; padding:8px 10px; border-radius:12px; background:#f6f7f9; border:1px solid #e6e6e6}
      #cwt-statusTitle{font-size:11px; color:#555; font-weight:900; margin-bottom:2px}
      #cwt-status{font-size:11px; color:#2b2b2b; white-space:pre-wrap}
      #cwt-footer{margin-top:10px; font-size:10px; color:#888}
      #cwt-footer a{color:#1f6feb; text-decoration:none}
      #cwt-footer a:hover{text-decoration:underline}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  };

  // -------------------- data --------------------
  let currentResults = [];
  let selected = [];

  const isSelected = (relId) => selected.some(x => Number(x.relId) === Number(relId));
  const addToSelected = (item) => {
    const relId = item?.osm_type === 'relation' ? Number(item.osm_id) : null;
    if (!relId || isSelected(relId)) return;
    selected.push({ ...item, relId });
    renderSelected();
  };
  const removeFromSelected = (relId) => {
    selected = selected.filter(x => Number(x.relId) !== Number(relId));
    renderSelected();
  };

  const makeNameSafe = (name) =>
    String(name || 'boundaries').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);

  const fetchGeoForSelected = async () => {
    if (!selected.length) { setStatus(t('status_need_pick'), true); return []; }
    setStatus(t('status_fetch_geo'));
    const out = [];

    for (const it of selected) {
      const gj = await gmFetchJson(GEOJSON(it.relId));
      let feature = null;

      if (gj?.type === 'Feature') feature = gj;
      else if (gj?.type === 'FeatureCollection' && Array.isArray(gj.features) && gj.features.length) {
        feature = gj.features.find(f => f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon') || gj.features[0];
      } else if (gj?.type === 'Polygon' || gj?.type === 'MultiPolygon') {
        feature = { type: 'Feature', properties: {}, geometry: gj };
      }

      if (feature?.geometry) {
        feature.properties = feature.properties || {};
        feature.properties._relId = it.relId;
        feature.properties._display = it.display_name || '';
        out.push(feature);
      }
    }

    return out;
  };

  const buildCombinedGeoJSON_ALL = async () => {
    const features = await fetchGeoForSelected();
    if (!features.length) return null;
    return { type: 'FeatureCollection', features };
  };

  const combinedWkt_ALL = async () => {
    const gj = await buildCombinedGeoJSON_ALL();
    if (!gj) return null;
    const geoms = gj.features.map(f => f.geometry).filter(Boolean);
    const gc = { type: 'GeometryCollection', geometries: geoms };
    return geojsonToWkt(gc);
  };

  const combinedPoly = async () => {
    if (!selected.length) { setStatus(t('status_need_pick'), true); return null; }
    setStatus(t('status_fetch_poly'));
    const lines = [];
    for (const it of selected) {
      const txt = await gmFetchText(POLY(it.relId), 25000);
      lines.push(`# ---- ${it.display_name || ''} | relation ${it.relId} ----`);
      lines.push(txt.trim());
      lines.push('');
    }
    return lines.join('\n');
  };

  const actCopyThenOpenWKTMap = async (relId) => {
    try {
      setStatus(t('status_fetch_wkt'));
      const wkt = await gmFetchText(WKT_URL(relId), 25000);
      const ok = await copyToClipboard(wkt);
      if (ok) openNewTab(WKT_MAP_HOME());
    } catch (e) {
      setStatus(String(e.message || e), true);
    }
  };

  // ✅ Download WKT (ALL) as ONE file
  const actDownloadWKT_ALL = async () => {
    try {
      const wkt = await combinedWkt_ALL();
      if (!wkt) return;
      downloadTextFile(wkt, `combined_all.wkt`, 'text/plain;charset=utf-8');
    } catch (e) {
      setStatus(String(e.message || e), true);
    }
  };

  // ✅ per-item download (real save) without opening a text page
  const downloadItem = async (kind, it) => {
    const relId = Number(it.relId);
    const base = `${makeNameSafe(it.display_name)}_${relId}`;

    try {
      if (kind === 'geojson') {
        setStatus(t('status_fetch_geo'));
        return await downloadBinaryViaGM(GEOJSON(relId), `${base}.geojson`, 'application/geo+json');
      }
      if (kind === 'poly') {
        setStatus(t('status_fetch_poly'));
        return await downloadBinaryViaGM(POLY(relId), `${base}.poly`, 'text/plain;charset=utf-8');
      }
      if (kind === 'wkt') {
        setStatus(t('status_fetch_wkt'));
        return await downloadBinaryViaGM(WKT_URL(relId), `${base}.wkt`, 'text/plain;charset=utf-8');
      }
      if (kind === 'png') {
        // ✅ better status for PNG
        setStatus('Fetching PNG…');
        return await downloadBinaryViaGM(IMG_PNG(relId), `${base}.png`, 'image/png');
      }
    } catch (e) {
      setStatus(String(e.message || e), true);
    }
  };

  // -------------------- renderers --------------------
  const renderResults = () => {
    const list = document.getElementById('cwt-resultsList');
    if (!list) return;
    list.innerHTML = '';

    if (!currentResults.length) {
      list.appendChild(el('div', { class: 'cwt-item', html: `<strong>${t('status_no_results')}</strong>` }));
      return;
    }

    currentResults.forEach((r) => {
      const relId = (r.osm_type === 'relation') ? Number(r.osm_id) : null;
      const admin = r?.extratags?.admin_level ? `admin_level=${r.extratags.admin_level}` : '';

      const item = el('div', { class: 'cwt-item' }, [
        el('div', { class: 'cwt-itemHead' }, [
          el('div', { style: 'flex:1' }, [
            el('strong', { html: escapeHtml(r.display_name || '(no name)') }),
            el('div', { class: 'cwt-meta', html: `relation / ${escapeHtml(r.osm_id)} ${admin ? ' • ' + admin : ''}` })
          ]),
          el('span', { class: 'cwt-addBtn', text: isSelected(relId) ? '✓' : '+', onclick: () => addToSelected(r) })
        ])
      ]);

      list.appendChild(item);
    });
  };

  const renderSelected = () => {
    const list = document.getElementById('cwt-selectedList');
    if (!list) return;
    list.innerHTML = '';

    if (!selected.length) {
      list.appendChild(el('div', { class: 'cwt-item', html: `<strong style="color:#777">${t('status_need_pick')}</strong>` }));
      return;
    }

    const exportBox = el('div', { class: 'cwt-exportBox' }, [
      el('div', { style: 'font-weight:900; margin-bottom:8px', text: t('export_one') }),
      el('div', { class: 'cwt-exportRow' }, [
        el('span', { class: 'cwt-ico dl', text: '⬇️ ' + t('exp_geo_all'), onclick: async () => {
          try {
            const gj = await buildCombinedGeoJSON_ALL();
            if (!gj) return;
            downloadTextFile(JSON.stringify(gj, null, 2), `combined_all.geojson`, 'application/geo+json');
          } catch (e) { setStatus(String(e.message || e), true); }
        }}),

        el('span', { class: 'cwt-ico', text: '🧾 ' + t('exp_wkt_all'), onclick: async () => {
          try {
            const wkt = await combinedWkt_ALL();
            if (!wkt) return;
            await copyToClipboard(wkt);
          } catch (e) { setStatus(String(e.message || e), true); }
        }}),

        el('span', { class: 'cwt-ico dl', text: '⬇️ ' + t('exp_wkt_all_dl'), onclick: actDownloadWKT_ALL }),

        el('span', { class: 'cwt-ico', text: '🚀 ' + t('exp_wkt_open'), onclick: async () => {
          try {
            const wkt = await combinedWkt_ALL();
            if (!wkt) return;
            const ok = await copyToClipboard(wkt);
            if (ok) openNewTab(WKT_MAP_HOME());
          } catch (e) { setStatus(String(e.message || e), true); }
        }}),

        el('span', { class: 'cwt-ico dl', text: '⬇️ ' + t('exp_poly'), onclick: async () => {
          try {
            const txt = await combinedPoly();
            if (!txt) return;
            downloadTextFile(txt, `combined.poly`, 'text/plain;charset=utf-8');
          } catch (e) { setStatus(String(e.message || e), true); }
        }})
      ])
    ]);

    list.appendChild(exportBox);

    selected.forEach((it) => {
      const relId = Number(it.relId);
      const admin = it?.extratags?.admin_level ? `admin_level=${it.extratags.admin_level}` : '';

      const row = el('div', { class: 'cwt-item' });
      const head = el('div', { class: 'cwt-itemHead' }, [
        el('div', { style: 'flex:1' }, [
          el('strong', { html: escapeHtml(it.display_name || '(no name)') }),
          el('div', { class: 'cwt-meta', html: `relation / ${relId} ${admin ? ' • ' + admin : ''}` })
        ]),
        el('span', { class: 'cwt-xBtn', text: '✖', onclick: () => removeFromSelected(relId) })
      ]);

      const actions = el('div', { class: 'cwt-actionsRow' }, [
        el('span', { class: 'cwt-ico', text: '🚀', title: 'Copy WKT then open WKTMap', onclick: () => actCopyThenOpenWKTMap(relId) }),
        el('span', { class: 'cwt-ico dl', text: '⬇️ GeoJSON', onclick: () => downloadItem('geojson', it) }),
        el('span', { class: 'cwt-ico dl', text: '⬇️ POLY',   onclick: () => downloadItem('poly', it) }),
        el('span', { class: 'cwt-ico dl', text: '⬇️ WKT',    onclick: () => downloadItem('wkt', it) }),
        el('span', { class: 'cwt-ico dl', text: '🖼️ PNG',    onclick: () => downloadItem('png', it) }),
      ]);

      row.appendChild(head);
      row.appendChild(actions);
      list.appendChild(row);
    });

    setStatus(t('status_ready'));
  };

  // -------------------- searches --------------------
  const doSearch = async () => {
    const q = (document.getElementById('cwt-query')?.value || '').trim();
    if (!q) return;
    S.lastQuery = q; saveSettings();

    setStatus(t('status_searching'));
    currentResults = [];
    renderResults();

    try {
      currentResults = await nominatimSearch(q, S.level);
      renderResults();
      setStatus(currentResults.length ? t('status_ready') : t('status_no_results'));
    } catch (e) {
      setStatus(String(e.message || e), true);
    }
  };

  const doBatchSearch = async () => {
    const raw = (document.getElementById('cwt-batch')?.value || '').trim();
    if (!raw) return;
    S.lastBatch = raw; saveSettings();

    const lines = raw.split('\n').map(x => x.trim()).filter(Boolean);
    if (!lines.length) return;

    setStatus(t('status_searching'));
    const merged = [];

    for (const q of lines) {
      try {
        const res = await nominatimSearch(q, S.level);
        (res || []).slice(0, 6).forEach(r => merged.push(r));
      } catch {}
    }

    const seen = new Set();
    currentResults = merged.filter(r => r.osm_type === 'relation' && !seen.has(r.osm_id) && (seen.add(r.osm_id), true));
    renderResults();
    setStatus(currentResults.length ? t('status_ready') : t('status_no_results'));
  };

  // -------------------- panel init --------------------
  const initPanel = async () => {
    try {
      injectCss();

      const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
      tabLabel.textContent = t('tab');

      const root = el('div', { id: 'cwt-root', dir: (S.lang === 'ar' ? 'rtl' : 'ltr') });

      root.appendChild(el('div', { id: 'cwt-title', text: t('title') }));
      root.appendChild(el('div', { id: 'cwt-sub', text: t('subtitle') }));

      root.appendChild(el('div', { id: 'cwt-row' }, [
        el('div', {}, [
          el('label', { text: t('lang') }),
          el('select', {
            id: 'cwt-lang',
            onchange: (e) => {
              S.lang = e.target.value === 'ar' ? 'ar' : 'en';
              saveSettings();
              tabPane.innerHTML = '';
              currentResults = [];
              selected = [];
              initPanel();
            }
          }, [
            el('option', { value: 'en', text: 'English' }),
            el('option', { value: 'ar', text: 'العربية' })
          ])
        ]),
        el('div', {}, [
          el('label', { text: t('level') }),
          el('select', {
            id: 'cwt-level',
            onchange: (e) => { S.level = e.target.value; saveSettings(); }
          }, [
            el('option', { value: 'country', text: t('level_country') }),
            el('option', { value: 'state', text: t('level_state') }),
            el('option', { value: 'city', text: t('level_city') })
          ])
        ])
      ]));

      root.appendChild(el('label', { text: t('query') }));
      root.appendChild(el('input', {
        id: 'cwt-query',
        type: 'text',
        value: S.lastQuery || '',
        placeholder: t('query_ph'),
        onkeydown: (e) => { if (e.key === 'Enter') doSearch(); }
      }));
      root.appendChild(el('button', { id: 'cwt-searchBtn', text: t('search'), onclick: doSearch }));

      root.appendChild(el('div', { id: 'cwt-blockTitle', text: t('batch') }));
      root.appendChild(el('textarea', { id: 'cwt-batch', placeholder: t('batch_ph') }));
      root.appendChild(el('button', { id: 'cwt-batchBtn', text: t('batch_btn'), onclick: doBatchSearch }));

      root.appendChild(el('div', { id: 'cwt-blockTitle', text: t('results') }));
      root.appendChild(el('div', { id: 'cwt-resultsList' }));

      root.appendChild(el('div', { id: 'cwt-blockTitle', text: t('selected') }));
      root.appendChild(el('div', { id: 'cwt-selectedList' }));

      root.appendChild(el('div', { id: 'cwt-statusWrap' }, [
        el('div', { id: 'cwt-statusTitle', text: t('status') }),
        el('div', { id: 'cwt-status', text: t('status_ready') })
      ]));

      // ✅ footer with site + auto version
      root.appendChild(el('div', {
        id: 'cwt-footer',
        html: `${t('footer')} — <a href="https://casperdevs.com/" target="_blank" rel="noopener noreferrer">casperdevs.com</a> — v${VERSION}`
      }));

      tabPane.appendChild(root);

      document.getElementById('cwt-lang').value = S.lang;
      document.getElementById('cwt-level').value = S.level;
      document.getElementById('cwt-batch').value = S.lastBatch || '';

      renderResults();
      renderSelected();
      setStatus(t('status_ready'));
    } catch (e) {
      console.error('WME Boundary Tools: initPanel failed', e);
    }
  };

  await initPanel();

})();
