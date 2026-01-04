// ==UserScript==
// @name            CASPER Smart Connect Fill
// @namespace       casper-smart-connect-fill/wme
// @version         2025.11.22.014
// @description     Copy City and Country from connected segments in Waze Map Editor.
// @author          Ari (modified by Casper)
// @match           https://www.waze.com/editor*
// @match           https://www.waze.com/*/editor*
// @match           https://beta.waze.com/editor*
// @match           https://beta.waze.com/*/editor*
// @license         GPL-2.0
// @grant           GM_info
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @connect         gist.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/557991/CASPER%20Smart%20Connect%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/557991/CASPER%20Smart%20Connect%20Fill.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  // ---------- logging ----------
  const LOG = 'SCF:';
  const dbg  = (...a) => console.debug(LOG, ...a);
  const warn = (...a) => console.warn(LOG,  ...a);
  const err  = (...a) => console.error(LOG, ...a);

  let sdk;

  // ---------- constants ----------
  const I18N_URL = 'https://gist.githubusercontent.com/ariwazer694/8c7b1950e48fee54d6d5291f48544fce/raw/6766bf25fc90d4c0a16237dc8cdb3ebddcbc7260/wme-smart-connect-fill-lang.json';

  // Fallback English (معدل بحيث يذكر فقط City / Country)
  const I_EN = Object.freeze({
    tab_title: 'CASPER Smart Connect Fill',
    intro: 'Copies City and Country from connected segments for new / just-connected segments.',
    enable: 'Enable on new / just-connected segments',
    copy_street: 'Copy Street name',
    copy_city: 'Copy City',
    copy_state_country: 'Copy Country',
    copy_alternate: 'Copy Alternate names',
    copy_road_type: 'Copy Street type',
    copy_speed: 'Copy Speed limit(s)',
    also_nameless_existing: 'Also fill when segment has no street name (existing)',
    auto_lock: 'Auto-lock new segments',
    help: 'Only fills empty/unset fields on likely-new/nameless segments.',
    ready: 'CASPER Smart Connect Fill ready (City & Country only)',
    reset_cache: 'Reset processed cache',
    smart_connect_fill: 'CASPER SMART CONNECT FILL'
  });

  // ---------- settings/state ----------
  const STORAGE_KEY = 'wme_scf_settings';

  // كل شيء يتوقف ما عدا:
  // - enableSCF
  // - inheritCity
  // - inheritStateCountry
  const DEFAULTS = Object.freeze({
    enableSCF: false,

    // copy policies
    inheritStreet: false,
    inheritCity: true,
    inheritStateCountry: true,
    inheritAlternate: false,
    onNamelessExisting: false,
    inheritRoadType: false,
    inheritSpeed: false,

    // lock
    enableAutoLock: false,
    autoLockLevel: 'my'
  });

  const SETTINGS_KEYS = Object.keys(DEFAULTS);
  let S = { ...DEFAULTS };

  // Active i18n dict + all dictionaries
  let I = { ...I_EN };
  let I_ALL = null;

  // Per-session guards
  const processedSegments = new Set();
  const lockCandidates = new Set();
  const lockProcessed  = new Set();

  // ---------- small utils ----------
  const $  = (id) => document.getElementById(id);
  const on = (el, evt, cb) => el && el.addEventListener(evt, cb);
  const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const loadSettings = () => {
    try { S = { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')) }; }
    catch { S = { ...DEFAULTS }; }
    dbg('settings loaded', S);
  };
  const saveSettings = () => {
    const out = {}; SETTINGS_KEYS.forEach(k => out[k] = S[k]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    dbg('settings saved', out);
  };

  const setChecked = (id, v) => {
    const e = $(id); if (!e) return;
    e.checked = !!v;
    if (v) e.setAttribute('checked', ''); else e.removeAttribute('checked');
  };
  const setValue = (id, v) => { const e = $(id); if (e) e.value = String(v ?? ''); };

  const isSelected = (id) => {
    const sel = sdk.Editing.getSelection();
    return (sel?.objectType === 'segment' && Array.isArray(sel.ids)) ? sel.ids.includes(id) : false;
  };

  const getEditorLocale = () => {
    try {
      if (sdk?.Environment?.getLocale) return String(sdk.Environment.getLocale());
      const u = (sdk?.User?.getUser && sdk.User.getUser()) || sdk?.User;
      if (u?.locale) return String(u.locale);
    } catch {}
    return String(document.documentElement?.lang || navigator.language || 'en');
  };

  const isNorwayPath = () => {
    try { return (location.pathname.split('/')[1] || '').toLowerCase() === 'no'; }
    catch { return false; }
  };

  // Map browser/editor locale
  const chooseLang = (locRaw) => {
    const loc = (locRaw || 'en').toLowerCase().replace('_', '-');
    const [lang, region] = loc.split('-');
    if (lang === 'nb' || lang === 'nn' || lang === 'no') {
      if (!region || region === 'no' || isNorwayPath()) return 'no';
    }
    if (isNorwayPath()) return 'no';
    if (lang === 'de') return 'de';
    if (lang === 'da') return 'da';
    if (lang === 'sv') return 'sv';
    if (lang === 'es') return 'es';
    if (lang === 'en') return 'en';
    return 'en';
  };

  const mergeInto = (base, add) => {
    const out = { ...base };
    if (add && typeof add === 'object') for (const k of Object.keys(add)) if (add[k] != null) out[k] = add[k];
    return out;
  };

  // Fetch JSON via GMXHR
  const gmFetchJson = (url, timeoutMs = 8000) => new Promise((resolve, reject) => {
    const xhr = (GM && GM.xmlHttpRequest) ? GM.xmlHttpRequest : (typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null);
    if (!xhr) return reject(new Error('GM(XHR) unavailable'));
    let done = false;
    const timer = setTimeout(() => { if (!done) { done = true; reject(new Error('timeout')); } }, timeoutMs);
    try {
      xhr({
        method: 'GET', url, headers: { Accept: 'application/json' },
        onload: (res) => {
          if (done) return; done = true; clearTimeout(timer);
          if (res.status >= 200 && res.status < 300) {
            try { resolve(JSON.parse(res.responseText)); }
            catch { reject(new Error('JSON parse error')); }
          } else reject(new Error('HTTP ' + res.status));
        },
        onerror: () => { if (!done) { done = true; clearTimeout(timer); reject(new Error('network error')); } },
        ontimeout: () => { if (!done) { done = true; clearTimeout(timer); reject(new Error('timeout')); } }
      });
    } catch (e) { if (!done) { done = true; clearTimeout(timer); reject(e); } }
  });

  // Load i18n and pick active dict by auto-detected language
  const loadI18n = async () => {
    try {
      I_ALL = await gmFetchJson(I18N_URL, 8000);
      if (!I_ALL || typeof I_ALL !== 'object') throw new Error('Invalid JSON root');

      const auto = chooseLang(getEditorLocale());
      const dict = I_ALL[auto] || I_ALL['en'] || {};

      // ندمج الترجمة الأصلية مع ملف اللغات
      I = mergeInto(I_EN, dict);

      // تثبيت اسم CASPER مهما كانت الترجمة الخارجية
      I.tab_title          = 'CASPER Smart Connect Fill';
      I.smart_connect_fill = 'CASPER SMART CONNECT FILL';
      I.intro              = 'Copies City and Country from connected segments for new / just-connected segments.';
      I.ready              = 'CASPER Smart Connect Fill ready (City & Country only)';

      dbg('i18n loaded', { auto, keys: Object.keys(dict).length });
    } catch (e) {
      warn('i18n load failed; using built-in English', e);
      I_ALL = { en: I_EN };
      I = { ...I_EN };

      I.tab_title          = 'CASPER Smart Connect Fill';
      I.smart_connect_fill = 'CASPER SMART CONNECT FILL';
      I.intro              = 'Copies City and Country from connected segments for new / just-connected segments.';
      I.ready              = 'CASPER Smart Connect Fill ready (City & Country only)';
    }
  };

  // ---------- styles ----------
  const injectCss = () => {
    const css = `
      #sidepanel-scf{font-size:13px}
      #sidepanel-scf .controls-container{padding:0 0 4px 0}
      #sidepanel-scf .row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
      #sidepanel-scf .scf-group-label{font-size:11px;width:100%;font-family:Poppins,sans-serif;text-transform:uppercase;font-weight:700;color:#354148;margin:8px 0 6px}
      #sidepanel-scf label{white-space:normal}
      #sidepanel-scf .muted{font-size:10px;color:#999}
      #sidepanel-scf .scf-details{margin-left:.25rem}
      #scfResetProcessedBtn{margin-top:6px;padding:4px 8px;border:1px solid #ccc;border-radius:6px;background:#f7f7f7;cursor:pointer;font-size:12px}
      #scfHelpNote{font-size:10px;color:#777;margin:6px 0 0 0}
      #scfIntro{font-size:12px;color:#555;margin:6px 0 8px 0;line-height:1.35}
      #scfAutoLockSelect{font-size:12px;padding:2px 4px}

      /* رابط موقع CasperDevs في أسفل اللوحة */
      #sidepanel-scf .scf-footer-link a{
        color:#007acc;
        text-decoration:none;
      }
      #sidepanel-scf .scf-footer-link a:hover{
        text-decoration:underline;
      }
    `;
    const el = document.createElement('style'); el.textContent = css; document.head.appendChild(el);
  };

  // ---------- UI ----------
  const label = (text) => {
    const l = document.createElement('label');
    l.className = 'scf-group-label';
    l.textContent = text;
    return l;
  };
  const checkbox = (id, setting, text) => {
    const wrap = document.createElement('div');
    wrap.className = 'controls-container';
    wrap.innerHTML = `<input type="checkbox" id="${id}" class="scfSettingsControl" data-setting="${setting}"><label for="${id}">${text}</label>`;
    return wrap;
  };

  const syncVisibility = () => {
    const details = document.querySelector('#sidepanel-scf .scf-details');
    if (details) details.style.display = S.enableSCF ? '' : 'none';
  };

  const bindUIFromSettings = () => {
    setChecked('scfEnableCheckBox', S.enableSCF);
    setChecked('scfInheritCityCheckBox', S.inheritCity);
    setChecked('scfInheritStateCountryCheckBox', S.inheritStateCountry);
    syncVisibility();
  };

  const bindDeferred = () => requestAnimationFrame(() => requestAnimationFrame(bindUIFromSettings));

  const initPanel = async () => {
    const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
    tabLabel.textContent = I.tab_title;

    const panel = document.createElement('div');
    panel.id = 'sidepanel-scf';
    panel.appendChild(label(I.smart_connect_fill));

    const intro = document.createElement('div');
    intro.id = 'scfIntro';
    intro.textContent = I.intro;
    panel.appendChild(intro);

    // Master enable
    panel.appendChild(checkbox('scfEnableCheckBox', 'enableSCF', I.enable));

    const details = document.createElement('div');
    details.className = 'scf-details';

    // فقط City و Country
    details.appendChild(checkbox('scfInheritCityCheckBox', 'inheritCity', I.copy_city));
    details.appendChild(checkbox('scfInheritStateCountryCheckBox', 'inheritStateCountry', I.copy_state_country));

    const help = document.createElement('div');
    help.id = 'scfHelpNote';
    help.textContent = I.help;
    details.appendChild(help);
    panel.appendChild(details);

    const footer = document.createElement('div');
    footer.className = 'muted';
    footer.textContent = I.ready;
    panel.appendChild(footer);

    // رابط موقع CasperDevs
    const siteLink = document.createElement('div');
    siteLink.className = 'muted scf-footer-link';
    siteLink.innerHTML = `
      Developed by <strong>Casper</strong> –
      <a href="https://casperdevs.com/" target="_blank" rel="noopener noreferrer">
        casperdevs.com
      </a>
    `;
    panel.appendChild(siteLink);

    const resetBtn = document.createElement('button');
    resetBtn.id = 'scfResetProcessedBtn';
    resetBtn.textContent = I.reset_cache;
    on(resetBtn, 'click', () => {
      processedSegments.clear();
      lockCandidates.clear();
      lockProcessed.clear();
      dbg('caches cleared');
    });
    panel.appendChild(resetBtn);

    tabPane.appendChild(panel);

    on(panel, 'change', (evt) => {
      const t = evt.target; if (!t) return;
      if (t.id === 'scfAutoLockSelect') {
        S.autoLockLevel = String(t.value);
        saveSettings();
        dbg('autoLock level', S.autoLockLevel);
        return;
      }
      if (!t.classList.contains('scfSettingsControl')) return;
      const key = t.dataset.setting;
      if (!SETTINGS_KEYS.includes(key)) return;
      S[key] = !!t.checked;
      saveSettings();
      if (key === 'enableSCF') syncVisibility();
    });

    // Keep checkbox states even if sidebar rerenders
    const mo = new MutationObserver(() => bindDeferred());
    mo.observe(panel, { childList: true, subtree: true });

    bindDeferred();
    dbg('panel ready');
  };

  // ---------- data helpers ----------
  const getSelectionSegmentIds = () => {
    const sel = sdk.Editing.getSelection();
    return (sel?.objectType === 'segment' && Array.isArray(sel.ids)) ? sel.ids : [];
  };

  const getNeighbors = (id) => {
    const a = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: false }) || [];
       const b = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: true }) || [];
    const out = [...a, ...b].map(s => s.id);
    dbg('neighbors', id, out);
    return out;
  };

  const isLikelyNew = (id, seg) => {
    if (typeof id === 'number' && id < 0) return true;
    if (typeof id === 'string' && /^tmp|^neg/i.test(id)) return true;
    if (seg?.isNew || seg?.isCreated) return true;
    const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
    return (!addr || addr.isEmpty === true);
  };

  const isUnsavedNew = (id, seg) =>
    (typeof id === 'number' && id < 0) ||
    (typeof id === 'string' && /^tmp|^neg/i.test(id)) ||
    !!(seg?.isNew || seg?.isCreated);

  const isStreetUnset = (addr) => {
    try {
      if (!addr || !addr.street || addr.street.isEmpty) return true;
      const n = addr.street.name;
      return n == null || n === '';
    } catch { return true; }
  };

  const firstNeighborWithAddress = (id) => {
    const seen = new Set([id]);
    const q = [id];
    const hasAddr = (sid) => {
      try {
        const a = sdk.DataModel.Segments.getAddress({ segmentId: sid });
        return a && !a.isEmpty;
      } catch { return false; }
    };
    while (q.length) {
      const cur = q.shift();
      const ns = getNeighbors(cur);
      const donorId = ns.find(hasAddr);
      if (donorId) {
        const addr = sdk.DataModel.Segments.getAddress({ segmentId: donorId });
        dbg('donor addr', donorId, addr);
        return { donorId, addr };
      }
      ns.forEach(n => { if (!seen.has(n)) { seen.add(n); q.push(n); } });
    }
    dbg('no donor addr');
    return null;
  };

  const firstNeighborWithRoadType = (id) => {
    const ns = getNeighbors(id);
    for (let i = 0; i < ns.length; i++) {
      const seg = sdk.DataModel.Segments.getById({ segmentId: ns[i] });
      if (!seg) continue;
      if (seg.roadType != null) {
        dbg('donor roadType', ns[i], seg.roadType);
        return seg;
      }
    }
    dbg('no donor roadType');
    return null;
  };

  const firstNeighborWithSpeed = (id) => {
    const ns = getNeighbors(id);
    for (let i = 0; i < ns.length; i++) {
      const seg = sdk.DataModel.Segments.getById({ segmentId: ns[i] });
      if (!seg) continue;
      if (seg.fwdSpeedLimit != null || seg.revSpeedLimit != null) {
        dbg('donor speed', ns[i], { fwd: seg.fwdSpeedLimit, rev: seg.revSpeedLimit });
        return seg;
      }
    }
    dbg('no donor speed');
    return null;
  };

  const getOrCreateStreet = (streetName, cityId) => {
    try {
      return sdk.DataModel.Streets.getStreet({ streetName, cityId }) ||
             sdk.DataModel.Streets.addStreet({ streetName, cityId });
    } catch (e) { err('street get/create failed', { streetName, cityId, e }); throw e; }
  };

  // ---------- alternates ----------
  const normalizeAlt = (alt) => {
    if (typeof alt === 'number') return { streetId: alt };
    if (typeof alt === 'string' && /^\d+$/.test(alt)) return { streetId: +alt };
    const streetId   = alt?.streetId ?? alt?.id ?? alt?.street?.id;
    const streetName = alt?.street?.name ?? alt?.streetName ?? '';
    const cityName   = alt?.city?.name   ?? alt?.cityName   ?? '';
    const stateId    = alt?.state?.id    ?? alt?.stateId    ?? undefined;
    const countryId  = alt?.country?.id  ?? alt?.countryId  ?? undefined;
    return { streetId, streetName, cityName, stateId, countryId };
  };

  const resolveStreetId = (n) => {
    if (n.streetId != null) return n.streetId;
    const cityProps = { cityName: n.cityName || '', stateId: n.stateId, countryId: n.countryId };
    let cityId = sdk.DataModel.Cities.getCity(cityProps)?.id;
    if (cityId == null) {
      cityId = sdk.DataModel.Cities.addCity(cityProps).id;
      dbg('alt city created', cityProps);
    }
    return getOrCreateStreet(n.streetName || '', cityId).id;
  };

  const readDonorAlternates = (donorId, donorAddr) => {
    try {
      if (typeof sdk.DataModel?.Segments?.getAlternateStreets === 'function') {
        const alts = sdk.DataModel.Segments.getAlternateStreets({ segmentId: donorId }) || [];
        dbg('donor alternates via getAlternateStreets', donorId, alts);
        return alts;
      }
    } catch (e) { warn('getAlternateStreets failed', e); }
    try {
      const seg = sdk.DataModel.Segments.getById({ segmentId: donorId }) || {};
      if (Array.isArray(seg.alternateStreetIds)) return seg.alternateStreetIds;
      if (Array.isArray(seg.alternateStreets))   return seg.alternateStreets;
    } catch {}
    try {
      const viaAddr = donorAddr?.alternateStreets || donorAddr?.alternates || donorAddr?.alternateNames || [];
      dbg('donor alternates via address fallback', donorId, viaAddr);
      return viaAddr;
    } catch {}
    dbg('no donor alternates detected', donorId);
    return [];
  };

  const readExistingAlternateIds = (segId) => {
    try {
      if (typeof sdk.DataModel?.Segments?.getAlternateStreets === 'function') {
        const arr = sdk.DataModel.Segments.getAlternateStreets({ segmentId: segId }) || [];
        return arr.map(normalizeAlt).map(resolveStreetId);
      }
      const seg = sdk.DataModel.Segments.getById({ segmentId: segId }) || {};
      if (Array.isArray(seg.alternateStreetIds)) return seg.alternateStreetIds.slice();
      if (Array.isArray(seg.alternateStreets))  return seg.alternateStreets.map(normalizeAlt).map(resolveStreetId);
    } catch {}
    return [];
  };

  const applyAlternateIds = (segId, altIds) => {
    if (!altIds?.length) return false;
    try {
      sdk.DataModel.Segments.updateAddress({ segmentId: segId, alternateStreetIds: altIds });
      dbg('alternates applied via updateAddress', { segId, altIds });
      return true;
    } catch (e1) { warn('updateAddress(alternateStreetIds) failed', e1); }
    try {
      sdk.DataModel.Segments.updateSegment({ segmentId: segId, alternateStreetIds: altIds });
      dbg('alternates applied via updateSegment', { segId, altIds });
      return true;
    } catch (e2) { warn('updateSegment(alternateStreetIds) failed', e2); }
    try {
      if (typeof sdk.DataModel?.Segments?.setAlternateStreets === 'function') {
        sdk.DataModel.Segments.setAlternateStreets({ segmentId: segId, alternateStreetIds: altIds });
        dbg('alternates applied via setAlternateStreets', { segId, altIds });
        return true;
      }
    } catch (e3) { warn('setAlternateStreets failed', e3); }
    try {
      if (typeof sdk.DataModel?.Segments?.addAlternateStreet === 'function') {
        let any = false;
        altIds.forEach((sid) => {
          try { sdk.DataModel.Segments.addAlternateStreet({ segmentId: segId, streetId: sid }); any = true; }
          catch (e4) { warn('addAlternateStreet failed for ' + sid, e4); }
        });
        if (any) {
          dbg('alternates applied via addAlternateStreet loop', { segId, altIds });
          return true;
        }
      }
    } catch (e5) { warn('addAlternateStreet loop failed', e5); }
    err('failed to set alternateStreetIds', { segId, altIds });
    return false;
  };

  // ---------- lock ----------
  const getUserRank0 = () => {
    try {
      const u = (sdk.User?.getUser && sdk.User.getUser()) || sdk.User || {};
      const c = [
        u.rank, u.userRank, u.editorRank,
        u.level, u.userLevel, u.editorLevel,
        u.attributes?.rank, u.attributes?.level
      ].filter(n => typeof n === 'number');
      if (c.length) {
        const m = Math.max(...c);
        return (m >= 1 && m <= 6) ? (m - 1) : Math.max(0, Math.min(5, m));
      }
    } catch (e) { warn('user rank resolve failed', e); }
    warn('user rank not detected; defaulting to 0');
    return 0;
  };

  const desiredLockRank0 = () => {
    const user0 = getUserRank0();
    const sel = String(S.autoLockLevel || 'my');
    const desired0 = (sel === 'my')
      ? user0
      : Math.max(0, Math.min(5, (parseInt(sel, 10) || (user0 + 1)) - 1));
    dbg('desired lock', { selection: sel, userRank0: user0, desired0 });
    return desired0;
  };

  const setLockForNew = (id) => {
    if (!S.enableAutoLock) return false;
    const seg = sdk.DataModel.Segments.getById({ segmentId: id }); if (!seg) return false;
    if (!lockCandidates.has(id)) return dbg('lock skip: not a candidate', { id }), false;
    if (!isSelected(id))         return dbg('lock skip: not selected', { id }), false;
    if (!isUnsavedNew(id, seg))  return dbg('lock skip: not unsaved-new', { id }), false;
    const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
    if (!isStreetUnset(addr))    return dbg('lock skip: street set', { id }), false;

    const desired = desiredLockRank0();
    const curLock = (typeof seg.lockRank === 'number') ? seg.lockRank : null;
    const inhRank = (typeof seg.rank === 'number')     ? seg.rank     : null;
    const effective = (curLock != null) ? curLock : (inhRank != null ? inhRank : -1);
    if (effective >= 0 && desired < effective) return dbg('lock skip: would lower', { id, effective, desired }), false;
    if (curLock === desired) return dbg('lock unchanged', { id, desired }), false;

    try {
      sdk.DataModel.Segments.updateSegment({ segmentId: id, lockRank: desired });
      dbg('locked', { id, desired });
      return true;
    } catch (e) {
      err('lock set failed', { id, desired, e });
      return false;
    }
  };

  // ---------- core: address (primary + alternates) ----------
  const inheritAddress = (id) => {
    const targetAddr = sdk.DataModel.Segments.getAddress({ segmentId: id });
    const donorBundle = firstNeighborWithAddress(id); if (!donorBundle) return false;
    const { donorId, addr: donor } = donorBundle;

    // فقط City / Country حسب الإعدادات
    const wantS   = S.inheritStreet;
    const wantC   = S.inheritCity || S.inheritStateCountry;
    const wantSC  = S.inheritStateCountry;
    const wantAlt = !!S.inheritAlternate;

    const curStreet = targetAddr?.street?.name ?? '';
    const curCityId = targetAddr?.city?.id ?? null;

    const setStreet = wantS && !curStreet;
    const setCity   = (wantC || wantSC) && (curCityId == null);

    const cityProps = {
      cityName: (setCity && donor.city && !donor.city.isEmpty && S.inheritCity)
        ? donor.city.name
        : (targetAddr.city?.name ?? ''),
      stateId:  (setCity && donor.state)   ? donor.state.id   : (targetAddr.state?.id   ?? undefined),
      countryId:(setCity && donor.country) ? donor.country.id : (targetAddr.country?.id ?? undefined)
    };
    if (wantSC && !S.inheritCity) cityProps.cityName = '';

    let cityId = sdk.DataModel.Cities.getCity(cityProps)?.id;
    if (cityId == null) {
      cityId = sdk.DataModel.Cities.addCity(cityProps).id;
      dbg('city created', cityProps);
    }

    const donorStreetName = donor?.street?.name ?? '';
    const streetName      = setStreet ? donorStreetName : (targetAddr.street?.name ?? '');
    const primaryStreetId = getOrCreateStreet(streetName, cityId).id;

    let altIds = [];
    if (wantAlt) {
      const donorAlts = readDonorAlternates(donorId, donor) || [];
      const normalized = donorAlts.map(normalizeAlt)
        .filter(a => (a.streetId != null) || ((a.streetName ?? '').trim().length > 0));
      altIds = normalized.map(resolveStreetId);
      const existingAltIds = readExistingAlternateIds(id);
      altIds = altIds
        .filter((sid, i, arr) => arr.indexOf(sid) === i)
        .filter(sid => sid !== primaryStreetId)
        .filter(sid => !existingAltIds.includes(sid));
    }

    let changed = false;
    if (setStreet || setCity) {
      try {
        sdk.DataModel.Segments.updateAddress({ segmentId: id, primaryStreetId });
        dbg('primary address updated', { id, primaryStreetId });
        changed = true;
      } catch (e) { err('primary address update failed', { id, e }); }
    }
    if (wantAlt && altIds.length) {
      if (applyAlternateIds(id, altIds)) changed = true;
    }

    return changed;
  };

  // ---------- core: road type ----------
  const inheritRoadType = (id) => {
    if (!S.inheritRoadType) return false;
    const target = sdk.DataModel.Segments.getById({ segmentId: id }); if (!target) return false;
    const donor  = firstNeighborWithRoadType(id); if (!donor) return false;

    if (!isLikelyNew(id, target)) {
      dbg('roadType skip: not new', { id, targetRoadType: target.roadType, donorRoadType: donor.roadType });
      return false;
    }

    if (target.roadType === donor.roadType) return false;

    const upd = { segmentId: id, roadType: donor.roadType };
    try {
      sdk.DataModel.Segments.updateSegment(upd);
      dbg('roadType updated', { id, roadType: donor.roadType });
      return true;
    } catch (e) {
      err('roadType update failed', { id, upd, e });
      return false;
    }
  };

  // ---------- core: speed ----------
  const inheritSpeed = (id) => {
    if (!S.inheritSpeed) return false;
    const target = sdk.DataModel.Segments.getById({ segmentId: id }); if (!target) return false;
    const donor  = firstNeighborWithSpeed(id); if (!donor) return false;

    const tF = target.fwdSpeedLimit, tR = target.revSpeedLimit;
    const dF = donor.fwdSpeedLimit,  dR = donor.revSpeedLimit;

    const upd = { segmentId: id }; let changed = false;
    if (dF != null && (tF == null)) { upd.fwdSpeedLimit = dF; changed = true; }
    if (dR != null && (tR == null)) { upd.revSpeedLimit = dR; changed = true; }
    if (!changed) return false;

    try {
      sdk.DataModel.Segments.updateSegment(upd);
      dbg('speed updated', { id, fwd: upd.fwdSpeedLimit, rev: upd.revSpeedLimit });
      return true;
    } catch (e) {
      err('speed error', { id, upd, e });
      return false;
    }
  };

  // ---------- driver ----------
  const run = () => {
    if (!S.enableSCF) return dbg('SCF disabled');
    const ids = getSelectionSegmentIds(); if (!ids.length) return dbg('no selection');

    ids.forEach((id) => {
      const seg = sdk.DataModel.Segments.getById({ segmentId: id }); if (!seg) return;

      const newLikely   = isLikelyNew(id, seg);
      const selectedNow = isSelected(id);
      const trulyNew    = isUnsavedNew(id, seg);
      const candidate   = selectedNow && lockCandidates.has(id);

      const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
      const streetMissing    = isStreetUnset(addr);
      const namelessExisting = streetMissing && !newLikely;

      dbg('candidate', { id, newLikely, trulyNew, selectedNow, candidate, streetMissing, namelessExisting });

      if (candidate && trulyNew && S.enableAutoLock && !lockProcessed.has(id)) {
        try { if (setLockForNew(id)) lockProcessed.add(id); } catch (e) { err('auto-lock error', e); }
      }
      if (candidate && trulyNew) {
        try { inheritRoadType(id); } catch (e) { err('roadType error', e); }
        try { inheritSpeed(id);   } catch (e) { err('speed error', e); }
      }

      if (processedSegments.has(id)) return dbg('skip processed', id);

      const shouldAddress = (newLikely && streetMissing) || (S.onNamelessExisting && namelessExisting);
      if (!shouldAddress) return dbg('policy skip', { id });

      if (inheritAddress(id)) {
        processedSegments.add(id);
        dbg('processed add', id);
      } else {
        dbg('address unchanged', id);
      }
    });
  };

  const runDebounced = debounce(run, 120);

  const waitForEditPanel = (tries = 40) => new Promise(res => {
    const tick = (n) => {
      const el = document.getElementById('edit-panel');
      if (el || n <= 0) return res(el || null);
      setTimeout(() => tick(n - 1), 250);
    };
    tick(tries);
  });

  const init = async () => {
    dbg('init start');
    injectCss();
    loadSettings();
    await loadI18n();
    await initPanel();

    on(window, 'beforeunload', saveSettings);

    try {
      sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });
      sdk.Events.on({
        eventName: 'wme-data-model-objects-changed',
        eventHandler: () => {
          try { runDebounced(); } catch (e) { err('data change', e); }
        }
      });
      dbg('events:data wired');
    } catch (e) { err('track events fail', e); }

    try {
      sdk.Events.on({
        eventName: 'wme-selection-changed',
        eventHandler: () => {
          try {
            const sel = sdk.Editing.getSelection();
            const ids = (sel?.objectType === 'segment' && Array.isArray(sel.ids)) ? sel.ids : [];
            ids.forEach(id => {
              const seg  = sdk.DataModel.Segments.getById({ segmentId: id });
              const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
              if (isUnsavedNew(id, seg) && isStreetUnset(addr)) {
                lockCandidates.add(id);
                dbg('lock candidate add', id);
              }
            });
            runDebounced();
          } catch (e) { err('on selection change', e); }
        }
      });
      dbg('events:selection wired');
    } catch (e) { err('selection events fail', e); }

    const editPanel = await waitForEditPanel();
    dbg('edit-panel?', !!editPanel);
    if (editPanel) {
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const n = m.addedNodes[i];
            if (n.nodeType !== 1) continue;
            if (n.querySelector?.('.road-type-control') ||
                n.querySelector?.('wz-chip-select.road-type-chip-select')) {
              try { runDebounced(); } catch (e) { err('mutation', e); }
            }
          }
        }
      });
      mo.observe(editPanel, { childList: true, subtree: true });
      dbg('mutation wired');
    } else {
      warn('no edit-panel; mutation skip');
    }

    dbg('init done');
  };

  try {
    sdk = await bootstrap();
    if (!sdk) throw new Error('bootstrap returned falsy sdk');
    dbg('sdk', {
      hasSidebar: !!sdk.Sidebar,
      hasEvents: !!sdk.Events,
      hasSegments: !!sdk.DataModel?.Segments,
      hasEditing: !!sdk.Editing
    });
    await init();
  } catch (e) {
    err('bootstrap/init fail', e);
  }
})();
