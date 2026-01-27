// ==UserScript==
// @name         WME Admin Boundaries Layer - Casper Edition
// @namespace    casper/wme-admin-boundaries-layer
// @version      1.4.0
// @description  Display-only admin boundaries layer (multi-level L4-L9) + selectable lists (All default) + labels + bilingual UI (EN default). Casper Edition.
// @author       Casper
// @license      MIT
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js?version=latest
// @connect      nominatim.openstreetmap.org
// @connect      overpass-api.de
// @connect      polygons.openstreetmap.fr
// @downloadURL https://update.greasyfork.org/scripts/564168/WME%20Admin%20Boundaries%20Layer%20-%20Casper%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/564168/WME%20Admin%20Boundaries%20Layer%20-%20Casper%20Edition.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  // -------------------- bootstrap / sidebar --------------------
  let sdk;
  try {
    sdk = await bootstrap();
    if (!sdk?.Sidebar) throw new Error('WME SDK Sidebar not available.');
  } catch (e) {
    console.error('Casper Admin Boundaries: bootstrap failed', e);
    return;
  }

  // -------------------- constants --------------------
  // ✅ نفس المفتاح السابق حتى ما نكسر النسخة المستقرة عندك
  const STORAGE_KEY = 'casper_admin_boundaries_layer_v1';
  const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
  const OVERPASS = 'https://overpass-api.de/api/interpreter';
  const POLY_BASE = 'https://polygons.openstreetmap.fr/';
  const GEOJSON_URL = (relId) => `${POLY_BASE}get_geojson.py?id=${relId}&params=0`;

  // -------------------- levels (L4 -> L9) --------------------
const LEVELS = [
  { key: 'gov',          adminRegex: '^4$', order: 1, color: '#dc2626' }, // Governorate – أحمر
  { key: 'capital',      adminRegex: '^5$', order: 2, color: '#ea580c' }, // Capital – برتقالي
  { key: 'district',     adminRegex: '^6$', order: 3, color: '#ca8a04' }, // District – أصفر غامق
  { key: 'subdistrict',  adminRegex: '^7$', order: 4, color: '#16a34a' }, // Subdistrict – أخضر
  { key: 'city',         adminRegex: '^8$', order: 5, color: '#2563eb' }, // City – أزرق
  { key: 'neighborhood', adminRegex: '^9$', order: 6, color: '#7c3aed' }, // Neighborhood – بنفسجي
];


  // -------------------- i18n --------------------
  const I18N = {
    en: {
    STOPPED_BY_USER: 'Loading stopped by user.',
    BTN_STOP: 'Stop loading',
      TAB_TITLE: 'Admin Boundaries',
      TITLE: 'Admin Boundaries Layer',
      SUB: 'Display-only boundaries layer with multi-level filters (L4–L9) — Casper Edition',
      LANG: 'Language',
      ENABLE: 'Enable layer',
      ENABLED: 'Enabled',
      DISABLED: 'Disabled',
      COUNTRY_NAME: 'Country name',
      COUNTRY_PH: 'Example: Iraq',
      ALL: 'Show all',
      BTN_LISTS: 'Load lists',
      BTN_LOAD: 'Load boundaries',
      BTN_CLEAR: 'Clear',
      STATUS_TITLE: 'Status',
      READY: 'Ready.',
      CHANGED_COUNTRY: 'Country changed. Load lists again.',
      RESOLVING_COUNTRY: 'Resolving country relation…',
      LISTS_LOADED: 'Lists loaded.',
      LOAD_LISTS: 'Loading lists…',
      FETCHING: 'Fetching boundaries…',
      DONE: 'Done.',
      CLEARED: 'Cleared.',
      DISABLED_MSG: 'Layer disabled.',
      WME_NOT_READY: 'WME not ready yet. Open map and try again.',
      ERR_WRITE_COUNTRY: 'Write country name',
      ERR_COUNTRY_REL: 'Country relation not found',
      WARN_HEAVY: 'This selection may be heavy (many polygons).',
      // Level labels
      L_GOV: 'Governorate (L4)',
      L_CAPITAL: 'Capital (L5)',
      L_DISTRICT: 'District (L6)',
      L_SUBDISTRICT: 'Subdistrict (L7)',
      L_CITY: 'City (L8)',
      L_NEIGHBORHOOD: 'Neighborhood (L9)',
      // UX
      ENABLE_LEVEL: 'Enable',
      SELECT_LEVEL: 'Select',
      PLACEHOLDER_LOAD: '— (load lists first) —',
      FOOTER: 'Developed by Casper',
    },
    ar: {
    STOPPED_BY_USER: 'تم إيقاف التحميل بواسطة المستخدم',
    BTN_STOP: 'إيقاف التحميل',
      TAB_TITLE: 'الحدود الإدارية',
      TITLE: 'طبقة الحدود الإدارية',
      SUB: 'طبقة عرض فقط مع فلاتر متعددة (L4–L9) — نسخة كاسبر',
      LANG: 'اللغة',
      ENABLE: 'تفعيل الطبقة',
      ENABLED: 'مفعّل',
      DISABLED: 'مُعطّل',
      COUNTRY_NAME: 'اسم الدولة',
      COUNTRY_PH: 'مثال: العراق',
      ALL: 'عرض الكل',
      BTN_LISTS: 'تحميل القوائم',
      BTN_LOAD: 'تحميل الحدود',
      BTN_CLEAR: 'مسح',
      STATUS_TITLE: 'الحالة',
      READY: 'جاهز.',
      CHANGED_COUNTRY: 'تم تغيير الدولة. حمّل القوائم من جديد.',
      RESOLVING_COUNTRY: 'جاري تحديد Relation للدولة…',
      LISTS_LOADED: 'تم تحميل القوائم.',
      LOAD_LISTS: 'جاري تحميل القوائم…',
      FETCHING: 'جاري جلب الحدود…',
      DONE: 'تم.',
      CLEARED: 'تم المسح.',
      DISABLED_MSG: 'الطبقة مُعطّلة.',
      WME_NOT_READY: 'WME غير جاهز بعد. افتح الخريطة ثم جرّب مرة ثانية.',
      ERR_WRITE_COUNTRY: 'اكتب اسم الدولة',
      ERR_COUNTRY_REL: 'لم يتم العثور على Relation للدولة',
      WARN_HEAVY: 'هذا الاختيار قد يكون ثقيلًا (عدد كبير من الحدود).',
      // Level labels
      L_GOV: 'المحافظة (L4)',
      L_CAPITAL: 'العاصمة (L5)',
      L_DISTRICT: 'القضاء (L6)',
      L_SUBDISTRICT: 'الناحية (L7)',
      L_CITY: 'المدينة (L8)',
      L_NEIGHBORHOOD: 'المحلة (L9)',
      // UX
      ENABLE_LEVEL: 'تفعيل',
      SELECT_LEVEL: 'اختيار',
      PLACEHOLDER_LOAD: '— (حمّل القوائم أولاً) —',
      FOOTER: 'تطوير: كاسبر',
    }
  };

  const DEFAULT_LEVEL_STATE = () => ({
    enabled: false,
    // selected can be: 'all' OR number relId
    selected: 'all',
    list: []
  });

  const DEFAULTS = {
    enabled: true,
    lang: 'en',               // ✅ English default
    countryName: 'Iraq',
    countryRel: null,
    levels: {
      gov: DEFAULT_LEVEL_STATE(),
      capital: DEFAULT_LEVEL_STATE(),
      district: DEFAULT_LEVEL_STATE(),
      subdistrict: DEFAULT_LEVEL_STATE(),
      city: DEFAULT_LEVEL_STATE(),
      neighborhood: DEFAULT_LEVEL_STATE(),
    }
  };

  let S = { ...DEFAULTS };

// 🛑 تحميل / إيقاف
let LOAD_ABORT = false;
let LOAD_RUNNING = false;


  const loadSettings = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) S = { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { S = { ...DEFAULTS }; }

    // harden
    if (!I18N[S.lang]) S.lang = 'en';
    if (!S.levels) S.levels = { ...DEFAULTS.levels };
    for (const L of LEVELS) {
      if (!S.levels[L.key]) S.levels[L.key] = DEFAULT_LEVEL_STATE();
      if (!('enabled' in S.levels[L.key])) S.levels[L.key].enabled = false;
      if (!('selected' in S.levels[L.key])) S.levels[L.key].selected = 'all';
      if (!Array.isArray(S.levels[L.key].list)) S.levels[L.key].list = [];
    }
  };

  const saveSettings = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch {}
  };

  loadSettings();

  const T = (key, ...args) => {
    const dict = I18N[S.lang] || I18N.en;
    const v = dict[key] ?? I18N.en[key] ?? key;
    return (typeof v === 'function') ? v(...args) : v;
  };

  // -------------------- helpers --------------------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const gmXhr = (opts) => new Promise((resolve, reject) => {
    const xhr = (typeof GM !== 'undefined' && GM?.xmlHttpRequest)
      ? GM.xmlHttpRequest
      : (typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null);
    if (!xhr) return reject(new Error('GM xmlHttpRequest not available'));

    xhr({
      method: opts.method || 'GET',
      url: opts.url,
      data: opts.data,
      headers: opts.headers || {},
      responseType: opts.responseType,
      timeout: opts.timeout || 30000,
      onload: (res) => resolve(res),
      onerror: () => reject(new Error('Network error')),
      ontimeout: () => reject(new Error('Timeout')),
    });
  });

  const setStatus = (msg, progress = null, isError = false) => {
  const box = document.getElementById('cab-status');
  if (!box) return;

  box.innerHTML = '';
  box.style.color = isError ? '#b00020' : '#1b1b1b';

  const text = document.createElement('div');
  text.textContent = msg;
  box.appendChild(text);

  if (typeof progress === 'number') {
    const barWrap = document.createElement('div');
    barWrap.style.marginTop = '6px';
    barWrap.style.background = '#e5e7eb';
    barWrap.style.borderRadius = '6px';
    barWrap.style.overflow = 'hidden';

    const bar = document.createElement('div');
    bar.style.height = '6px';
    bar.style.width = `${progress}%`;
    bar.style.background = '#2563eb';
    bar.style.transition = 'width .3s ease';

    barWrap.appendChild(bar);
    box.appendChild(barWrap);
  }
};


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

  const toInt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // -------------------- WME map layer --------------------
  let vectorLayer = null;

  const ensureLayer = () => {
    if (vectorLayer) return;

    vectorLayer = new OpenLayers.Layer.Vector('Casper – Admin Boundaries', {
  styleMap: new OpenLayers.StyleMap({
    'default': new OpenLayers.Style({
      // ❌ لا ألوان هنا
      strokeWidth: 2,
      fillOpacity: 0.25,

      // labels فقط
      label: '${label}',
      fontColor: '#111827',
      fontSize: '12px',
      fontWeight: 'bold',
      labelOutlineColor: '#ffffff',
      labelOutlineWidth: 3,
      labelYOffset: -8
    })
  })
});


    W.map.addLayer(vectorLayer);
  };

  const clearLayer = () => {
    if (!vectorLayer) return;
    vectorLayer.removeAllFeatures();
  };

  const addLabelPoint = (geometry, text) => {
    if (!geometry || !text) return;
    try {
      const center = geometry.getCentroid();
      const pt = new OpenLayers.Feature.Vector(center, { label: String(text) });
      vectorLayer.addFeatures([pt]);
    } catch {}
  };

// 🎨 generate stable color from numeric relation id (SAFE)
const colorFromRelId = (relId) => {
  const h = (Math.abs(relId) * 137) % 360; // golden angle
  return `hsl(${h}, 75%, 45%)`;
};



const addGeoJsonToLayer = (geojson, labelText, levelKey, relId) => {

    ensureLayer();

    const format = new OpenLayers.Format.GeoJSON();
    let feats = [];

    try {
      feats = format.read(geojson);
    } catch (e) {
      console.warn('GeoJSON parse failed', e);
      return;
    }

    if (!Array.isArray(feats)) feats = [feats].filter(Boolean);

    const src = new OpenLayers.Projection("EPSG:4326");
    const dst = W.map.getProjectionObject();

    feats.forEach(f => {
  if (!f?.geometry) return;

  f.geometry.transform(src, dst);

  // ✅ هنا التعديل المهم
  f.attributes = f.attributes || {};
  f.attributes.relId = relId;   // 👈 نخزّن relId داخل الـ feature

  // 🎨 ستايل ديناميكي حسب المستوى
  const L = LEVELS.find(x => x.key === levelKey);

  let color;
  if (levelKey === 'city') {
    color = colorFromRelId(f.attributes.relId); // ✅ الآن relId موجود
  } else {
    color = L?.color || '#6d28d9';
  }

  f.style = {
    strokeColor: color,
    strokeWidth: 2,
    fillColor: color,
    fillOpacity: 0.25

  };

  f.attributes.label = '';

  vectorLayer.addFeatures([f]);
  addLabelPoint(f.geometry, labelText);
});


  };

  const zoomToLayer = () => {
    if (!vectorLayer) return;
    const ext = vectorLayer.getDataExtent();
    if (ext) W.map.zoomToExtent(ext, true);
  };

  // -------------------- OSM fetchers --------------------
  const nominatimFindRelation = async (q) => {
    const url =
      `${NOMINATIM}?format=jsonv2&addressdetails=1&extratags=1&namedetails=1&limit=10` +
      `&accept-language=en&q=${encodeURIComponent(q)}`;

    const res = await gmXhr({
      url,
      method: 'GET',
      headers: { 'User-Agent': 'CasperAdminBoundaries/1.3.0 (WME script)' }
    });

    const data = JSON.parse(res.responseText || '[]');
    const rels = (Array.isArray(data) ? data : []).filter(x => x.osm_type === 'relation');

    const best =
      rels.find(x => x?.extratags?.boundary === 'administrative' && x?.extratags?.admin_level) ||
      rels.find(x => x?.extratags?.admin_level) ||
      rels[0];

    if (!best?.osm_id) return null;
    return {
      relId: Number(best.osm_id),
      display: best.display_name || q,
      admin_level: best?.extratags?.admin_level || null
    };
  };

const overpassQuery = async (query) => {
  const res = await gmXhr({
    url: OVERPASS,
    method: 'POST',
    data: query,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    timeout: 45000
  });

  const text = res.responseText || '';

  // 🛡️ حماية من HTML / XML (Cloudflare, rate-limit)
  if (!text.trim().startsWith('{')) {
    console.warn('Overpass returned non-JSON:', text.slice(0, 200));
    throw new Error('Overpass API returned non-JSON response (server busy or rate-limited)');
  }

  return JSON.parse(text);
};


const fetchGeoJsonByRelation = async (relId) => {
  const url = GEOJSON_URL(relId);
  const res = await gmXhr({ url, method: 'GET', timeout: 45000 });

  const text = res.responseText || '';

  // 🛡️ أحيانًا السيرفر يرجّع XML error بدل GeoJSON
  if (!text.trim().startsWith('{')) {
    console.warn('Polygon server returned non-GeoJSON:', text.slice(0, 200));
    throw new Error('Polygon server error (non-GeoJSON response)');
  }

  return text;
};


  // ✅ generic: get relations in area by admin_level regex
  const getRelationsInArea = async (areaRelId, adminLevelRegex) => {
    const areaId = 3600000000 + Number(areaRelId);

    const q =
      `[out:json][timeout:45];` +
      `area(${areaId})->.a;` +
      `relation(area.a)["boundary"="administrative"]["admin_level"~"${adminLevelRegex}"];` +
      `out tags;`;

    const data = await overpassQuery(q);
    const els = Array.isArray(data?.elements) ? data.elements : [];

    const items = els
      .filter(e => e.type === 'relation' && e.id && e.tags)
      .map(e => ({
        relId: Number(e.id),
        name: e.tags.name || e.tags['name:en'] || e.tags['official_name'] || `relation ${e.id}`,
        admin_level: e.tags.admin_level || ''
      }))
      .filter((x, i, arr) => arr.findIndex(y => y.relId === x.relId) === i)
      .sort((a, b) => (a.name || '').localeCompare((b.name || ''), 'en', { sensitivity: 'base' }));

    return items;
  };

  // -------------------- scope logic (حرية + بدون إجبار) --------------------
  // الفكرة: كل مستوى يأخذ "نطاق" التحميل من أقرب مستوى أعلى مفعّل ومحدد (ليس all)، وإلا من الدولة.
  const levelIndex = (key) => LEVELS.findIndex(x => x.key === key);

  const getScopeRelForLevel = (key) => {
    // must have countryRel resolved
    const idx = levelIndex(key);
    if (idx <= 0) return S.countryRel; // gov scope = country

    // scan upwards
    for (let i = idx - 1; i >= 0; i--) {
      const upKey = LEVELS[i].key;
      const st = S.levels[upKey];
      if (!st?.enabled) continue;
      if (st.selected !== 'all' && Number.isFinite(Number(st.selected))) {
        return Number(st.selected);
      }
    }
    return S.countryRel;
  };

  // -------------------- core actions --------------------
  const resolveCountryIfNeeded = async () => {
    const country = (S.countryName || '').trim();
    if (!country) throw new Error(T('ERR_WRITE_COUNTRY'));

    if (S.countryRel && Number.isFinite(S.countryRel)) return;

    setStatus(T('RESOLVING_COUNTRY'));
    const found = await nominatimFindRelation(country);
    if (!found?.relId) throw new Error(T('ERR_COUNTRY_REL'));

    S.countryRel = found.relId;
    saveSettings();
  };

  // ✅ load lists for enabled levels (and keep selects valid)
const loadLists = async () => {
  if (LOAD_RUNNING) {
    setStatus('⚠️ Loading already in progress', true);
    return;
  }

  await resolveCountryIfNeeded();

  LOAD_ABORT = false;
  LOAD_RUNNING = true;

  const enabledLevels = LEVELS.filter(L => S.levels[L.key]?.enabled);
let done = 0;
const total = enabledLevels.length;

for (const L of enabledLevels) {
  done++;
  setStatus(
    `${T('LOAD_LISTS')} (${done}/${total})\n${T(levelTitleKey(L.key))}`,
    Math.round((done / total) * 100)
  );

  // تحميل القائمة…
}


  for (const L of LEVELS) {
    if (LOAD_ABORT) break;

    const st = S.levels[L.key];
    if (!st?.enabled) continue;

    const scopeRel = getScopeRelForLevel(L.key);

// 🔒 منع تحميل المستويات العميقة من الدولة مباشرة
if (['district','subdistrict','city'].includes(L.key)) {
  if (scopeRel === S.countryRel) {
    // بدل ما نتجاوز، نخلي القائمة فاضية بوضوح
    st.list = [];
    st.selected = 'all';
    saveSettings();
    renderLevelsUI();
    continue;
  }
}


try {
  const list = await getRelationsInArea(scopeRel, L.adminRegex);
  if (LOAD_ABORT) break;

  st.list = list;


      if (st.selected !== 'all') {
        const selId = Number(st.selected);
        if (!list.some(x => x.relId === selId)) {
          st.selected = 'all';
        }
      }

      saveSettings();
      renderLevelsUI();
    } catch (e) {
      console.warn(`Failed loading ${L.key}`, e);
    }

    await sleep(200);
  }

  LOAD_RUNNING = false;

  if (LOAD_ABORT) {
    setStatus('⛔ Loading stopped.');
  } else {
    setStatus(T('LISTS_LOADED'));
  }
};


  // ✅ draw boundaries for enabled levels (all/default)
  const loadBoundaries = async () => {
  if (LOAD_RUNNING) {
    setStatus('⚠️ Loading already in progress', true);
    return;
  }

  if (!S.enabled) {
    setStatus(T('DISABLED_MSG'));
    return;
  }

  LOAD_ABORT = false;
  LOAD_RUNNING = true;
    if (typeof W === 'undefined' || !W?.map) {
      setStatus(T('WME_NOT_READY'), true);
      return;
    }

    try {
      await resolveCountryIfNeeded();
      ensureLayer();
      clearLayer();

      // count total polygons expected (approx)
      let totalTargets = 0;
      for (const L of LEVELS) {
        const st = S.levels[L.key];
        if (!st?.enabled) continue;

        if (st.selected === 'all') totalTargets += (st.list?.length || 0);
        else totalTargets += 1;
      }

      setStatus(T('FETCHING') + (totalTargets > 80 ? `\n⚠️ ${T('WARN_HEAVY')}` : ''));

      let done = 0;

      for (const L of LEVELS) {
        const st = S.levels[L.key];
        if (!st?.enabled) continue;

        // if list empty, try load just this level list quickly
        // 🔒 لا نحمّل قوائم أثناء الرسم
if (!Array.isArray(st.list) || !st.list.length) {
  console.warn(`No list loaded for ${L.key}, skipping draw`);
  continue;
}

        const targets = (st.selected === 'all')
          ? (st.list || []).map(x => ({ relId: x.relId, name: x.name }))
          : (() => {
              const selId = Number(st.selected);
              const item = (st.list || []).find(x => x.relId === selId);
              return [{ relId: selId, name: item?.name || `${L.key} ${selId}` }];
            })();

        for (const t of targets) {
  if (LOAD_ABORT) break;

  done++;

          setStatus(`${T('FETCHING')}\n${done}/${totalTargets}: ${t.name}`);

          try {
            const txt = await fetchGeoJsonByRelation(t.relId);
            addGeoJsonToLayer(txt, t.name, L.key, t.relId);


          } catch (e) {
            // silent fail per polygon (keeps stable)
          }

          await sleep(500);
        }
      }

      LOAD_RUNNING = false;

if (LOAD_ABORT) {
  setStatus('⛔ Boundary loading stopped.');
  return;
}

zoomToLayer();
setStatus(T('DONE'));
    } catch (e) {
      console.error(e);
      setStatus(String(e.message || e), true);
    }
  };

  const clearAll = () => {
    clearLayer();
    setStatus(T('CLEARED'));
  };

  // -------------------- UI --------------------
  const injectCss = () => {
    const css = `
      #cab-root{font-size:13px;padding:10px}
      #cab-root *{box-sizing:border-box}
      #cab-title{font-size:16px;font-weight:900;margin:0 0 4px 0}
      #cab-sub{font-size:11px;color:#666;margin:0 0 10px 0;line-height:1.35}
      #cab-root label{display:block;font-size:11px;color:#444;margin:8px 0 4px}
      #cab-root input,#cab-root select{width:100%;padding:8px;border:1px solid #d6d6d6;border-radius:10px;font-size:12px;outline:none;background:#fff}
      #cab-row{display:flex;gap:8px}
      #cab-row > div{flex:1}

      .cab-btn{width:100%;padding:10px;border:0;border-radius:12px;font-weight:900;cursor:pointer}
      #cab-load{background:#1f6feb;color:#fff;margin-top:10px}
      #cab-clear{background:#0b1320;color:#fff;margin-top:8px}
      #cab-lists{background:#111827;color:#fff;margin-top:10px}

      #cab-statusWrap{margin-top:10px;padding:8px 10px;border-radius:12px;background:#f6f7f9;border:1px solid #e6e6e6}
      #cab-status{font-size:11px;white-space:pre-wrap}

      #cab-footer{margin-top:10px;font-size:10px;color:#888}
      #cab-footer a{color:#1f6feb;text-decoration:none}
      #cab-footer a:hover{text-decoration:underline}

      .cab-card{margin-top:10px;padding:10px;border-radius:14px;border:1px solid #e6e6e6;background:#fff}
      .cab-card-title{font-weight:900;font-size:12px;margin-bottom:8px;color:#111827}

      .cab-level-row{display:grid;grid-template-columns:56px 1fr;gap:8px;align-items:center;margin:8px 0}
      .cab-level-row .cab-toggle{display:flex;gap:6px;align-items:center;justify-content:flex-start}
      .cab-level-row input[type="checkbox"]{width:16px;height:16px}
      .cab-level-row .cab-level-label{font-size:11px;color:#111827;font-weight:900;margin:0}
      .cab-level-row .cab-select{width:100%}
      .cab-level-row select:disabled{opacity:.55}
      .cab-hint{font-size:10px;color:#666;margin-top:6px;line-height:1.35}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  };

  let tabPaneRef = null;
  let tabLabelRef = null;

  const applyLangUi = () => {
    if (!tabPaneRef) return;
    const root = tabPaneRef.querySelector('#cab-root');
    if (!root) return;

    const isAr = (S.lang === 'ar');
    root.dir = isAr ? 'rtl' : 'ltr';
    root.style.textAlign = isAr ? 'right' : 'left';
  };

  const levelTitleKey = (key) => {
    if (key === 'gov') return 'L_GOV';
    if (key === 'capital') return 'L_CAPITAL';
    if (key === 'district') return 'L_DISTRICT';
    if (key === 'subdistrict') return 'L_SUBDISTRICT';
    if (key === 'city') return 'L_CITY';
    if (key === 'neighborhood') return 'L_NEIGHBORHOOD';
    return key;
  };

  const renderLevelsUI = () => {
    if (!tabPaneRef) return;
    const wrap = tabPaneRef.querySelector('#cab-levels-wrap');
    if (!wrap) return;

    wrap.innerHTML = '';

    for (const L of LEVELS) {
      const st = S.levels[L.key];

      const row = el('div', { class: 'cab-level-row' });

      const toggle = el('div', { class: 'cab-toggle' }, [
        el('input', {
          type: 'checkbox',
          id: `cab-chk-${L.key}`,
        }),
      ]);

      const chk = toggle.querySelector('input');
      chk.checked = !!st.enabled;

      const right = el('div', {}, [
        el('div', { class: 'cab-level-label', text: T(levelTitleKey(L.key)) }),
      ]);

      const sel = el('select', { class: 'cab-select', id: `cab-sel-${L.key}` });

      // options
      sel.appendChild(el('option', { value: 'all', text: `— ${T('ALL')} —` }));

      const list = Array.isArray(st.list) ? st.list : [];
      if (!list.length) {
        sel.appendChild(el('option', { value: '__empty__', text: T('PLACEHOLDER_LOAD') }));
      } else {
        list.forEach(item => {
          sel.appendChild(el('option', { value: String(item.relId), text: item.name }));
        });
      }

      // selected
      if (st.selected === 'all') sel.value = 'all';
      else sel.value = String(st.selected);

      // enable/disable select
      sel.disabled = !st.enabled;

      // listeners
      chk.addEventListener('change', async () => {
        st.enabled = chk.checked;
        // لما يفعّل: نخلي الافتراضي all
        if (st.enabled && !st.selected) st.selected = 'all';

        saveSettings();
        renderLevelsUI();

        // تحميل قوائم للمستوى اللي تفعّل (فقط) حتى يصير جاهز
        if (st.enabled) {
          try {
            await resolveCountryIfNeeded();
            setStatus(T('LOAD_LISTS'));
            const scopeRel = getScopeRelForLevel(L.key);
            st.list = await getRelationsInArea(scopeRel, L.adminRegex);

            // validate selection
            if (st.selected !== 'all') {
              const selId = Number(st.selected);
              if (!st.list.some(x => x.relId === selId)) st.selected = 'all';
            }

            saveSettings();
            renderLevelsUI();
            setStatus(T('LISTS_LOADED'));
          } catch (e) {
            console.error(e);
            setStatus(String(e.message || e), true);
          }
        } else {
          setStatus(T('READY'));
        }
      });

     sel.addEventListener('change', async () => {
  const v = sel.value;
  if (v === '__empty__') return;

  st.selected = (v === 'all') ? 'all' : Number(v);
  saveSettings();

  const baseIdx = LEVELS.findIndex(x => x.key === L.key);
  const enabledNext = LEVELS
    .slice(baseIdx + 1)
    .filter(x => S.levels[x.key]?.enabled);

  const totalSteps = enabledNext.length;
  let currentStep = 0;

  for (const lvl of enabledNext) {
    currentStep++;

    const percent = totalSteps
      ? Math.round((currentStep / totalSteps) * 100)
      : 100;

    const next = S.levels[lvl.key];

    // 🧹 (1) تنظيف فوري قبل التحميل
    next.list = [];
    next.selected = 'all';
    saveSettings();
    renderLevelsUI();

    setStatus(
      `↻ Updating ${lvl.key} list… (${currentStep}/${totalSteps})`,
      percent
    );

    try {
      const scopeRel = getScopeRelForLevel(lvl.key);
      next.list = await getRelationsInArea(scopeRel, lvl.adminRegex);
    } catch (e) {
      console.warn(`Failed updating ${lvl.key}`, e);
    }
  }

  saveSettings();
  renderLevelsUI();
});




      right.appendChild(sel);
      row.appendChild(toggle);
      row.appendChild(right);

      wrap.appendChild(row);
    }
  };

  const renderStaticTexts = () => {
    if (!tabPaneRef) return;

    const title = tabPaneRef.querySelector('#cab-title');
    const sub = tabPaneRef.querySelector('#cab-sub');
    if (title) title.textContent = T('TITLE');
    if (sub) sub.textContent = T('SUB');

    tabPaneRef.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.getAttribute('data-i18n');
      if (!key) return;
      node.textContent = T(key);
    });

    const countryInput = tabPaneRef.querySelector('#cab-country');
    if (countryInput) countryInput.setAttribute('placeholder', T('COUNTRY_PH'));

    const btnLists = tabPaneRef.querySelector('#cab-lists');
const btnLoad  = tabPaneRef.querySelector('#cab-load');
const btnStop  = tabPaneRef.querySelector('#cab-stop');
const btnClear = tabPaneRef.querySelector('#cab-clear');

if (btnLists) btnLists.textContent = T('BTN_LISTS');
if (btnLoad)  btnLoad.textContent = T('BTN_LOAD');
if (btnStop)  btnStop.textContent = T('BTN_STOP');
if (btnClear) btnClear.textContent = T('BTN_CLEAR');


    const enSel = tabPaneRef.querySelector('#cab-enabled');
    if (enSel) {
      const opt1 = enSel.querySelector('option[value="1"]');
      const opt0 = enSel.querySelector('option[value="0"]');
      if (opt1) opt1.textContent = T('ENABLED');
      if (opt0) opt0.textContent = T('DISABLED');
    }

    const st = tabPaneRef.querySelector('#cab-status-title');
    if (st) st.textContent = T('STATUS_TITLE');

    const footer = tabPaneRef.querySelector('#cab-footer-text');
    if (footer) footer.textContent = `${T('FOOTER')} — v1.3.0`;

    if (tabLabelRef) tabLabelRef.textContent = T('TAB_TITLE');

    applyLangUi();
    renderLevelsUI();
  };

  const initPanel = async () => {
    injectCss();

    const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
    tabLabelRef = tabLabel;
    tabLabel.textContent = T('TAB_TITLE');
    tabPaneRef = tabPane;

    tabPane.innerHTML = `
      <div id="cab-root">
        <div id="cab-title"></div>
        <div id="cab-sub"></div>

        <label data-i18n="LANG"></label>
        <select id="cab-lang">
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>

        <label data-i18n="ENABLE"></label>
        <select id="cab-enabled">
          <option value="1"></option>
          <option value="0"></option>
        </select>

        <div id="cab-row">
          <div>
            <label data-i18n="COUNTRY_NAME"></label>
            <input id="cab-country" type="text" />
          </div>
        </div>

        <div class="cab-card">
          <div class="cab-card-title">L4–L9 Filters</div>
          <div class="cab-hint">
            • Each level has its own checkbox + select.<br/>
            • Default is <b>${T('ALL')}</b> for maximum freedom.<br/>
            • Lists load based on the nearest enabled & selected upper level (otherwise country).
          </div>
          <div id="cab-levels-wrap"></div>
        </div>

        <button class="cab-btn" id="cab-lists"></button>
        <button class="cab-btn" id="cab-load" style="background:#1f6feb;color:#fff;margin-top:8px"></button>
        <button class="cab-btn" id="cab-stop"
  style="background:#b91c1c;color:#fff;margin-top:8px">
</button>
        <button class="cab-btn" id="cab-clear"></button>

        <div id="cab-statusWrap">
          <div id="cab-status-title" style="font-size:11px;color:#555;font-weight:900;margin-bottom:2px"></div>
          <div id="cab-status"></div>
        </div>

        <div id="cab-footer">
          <span id="cab-footer-text"></span>
          — <a href="https://casperdevs.com/" target="_blank" rel="noopener noreferrer">casperdevs.com</a>
        </div>
      </div>
    `;

    // initial values
    tabPane.querySelector('#cab-lang').value = S.lang || 'en';
    tabPane.querySelector('#cab-enabled').value = S.enabled ? '1' : '0';
    tabPane.querySelector('#cab-country').value = S.countryName || '';

    // handlers
    tabPane.querySelector('#cab-lang').addEventListener('change', (e) => {
      S.lang = String(e.target.value || 'en');
      if (!I18N[S.lang]) S.lang = 'en';
      saveSettings();
      renderStaticTexts();
      setStatus(T('READY'));
    });

    tabPane.querySelector('#cab-enabled').addEventListener('change', (e) => {
      S.enabled = (e.target.value === '1');
      saveSettings();
      if (!S.enabled) clearLayer();
      setStatus(S.enabled ? T('ENABLED') : T('DISABLED'));
    });

    tabPane.querySelector('#cab-country').addEventListener('change', (e) => {
      S.countryName = String(e.target.value || '').trim();
      S.countryRel = null;

      // reset lists only (keep toggles & selections)
      for (const L of LEVELS) {
        S.levels[L.key].list = [];
        // keep selection; if invalid it will normalize on loadLists
      }

      saveSettings();
      renderLevelsUI();
      setStatus(T('CHANGED_COUNTRY'));
    });

    tabPane.querySelector('#cab-lists').addEventListener('click', async () => {
      try {
        await loadLists();
      } catch (e) {
        console.error(e);
        setStatus(String(e.message || e), true);
      }
    });

    tabPane.querySelector('#cab-load').addEventListener('click', async () => {
  await loadBoundaries();
});

tabPane.querySelector('#cab-stop').addEventListener('click', () => {
  LOAD_ABORT = true;
LOAD_RUNNING = false;
setStatus('⛔ Loading stopped by user.');
});

tabPane.querySelector('#cab-clear').addEventListener('click', () => {
  clearAll();
});


    // render UI texts + levels
    renderStaticTexts();
    setStatus(T('READY'));
  };

  await initPanel();

})();
