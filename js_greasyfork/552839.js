// ==UserScript==
// @name         CB User Context Menu
// @namespace    aravvn.tools
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @version      4.9.1
// @description  Modify the user context menu
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552839/CB%20User%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/552839/CB%20User%20Context%20Menu.meta.js
// ==/UserScript==
(() => {
    'use strict';

    /** ---------------- Selectors & Config ---------------- */
    const MENU_SEL = '#user-context-menu[data-testid="user-context-menu"]';
    const LINK_SEL = 'a[data-testid="username"][href]';

    const CACHE_TTL         = 5 * 60 * 1000;  // success cache 5 min
    const POLL_MS           = 400;
    const MAX_API_TRIES     = 2;              // <= your request
    const FAIL_SILENCE_MS   = 10 * 60 * 1000; // cool-down after maxed out

    const MODE_KEY   = 'cbx_info_mode';              // 'list' | 'pills'
    const FIELDS_KEY = 'cbx_info_fields_enabled';    // JSON array of keys

    /** ---------------- Field defs ---------------- */
    const FIELD_DEFS = [
        { key:'i_am',            label:'I Am' },
        { key:'birth_date',      label:'Birth Date' },
        { key:'age',             label:'Age' },
        { key:'interested_in',   label:'Interested In' },
        { key:'location',        label:'Location' },
        { key:'languages',       label:'Language(s)' },
        { key:'body_type',       label:'Body Type' },
        { key:'body_decorations',label:'Body Decorations' },
        { key:'smoke_drink',     label:'Smoke / Drink' },
        { key:'last_broadcast',  label:'Last Broadcast' },
        { key:'fan_club_cost',   label:'Fan Club Cost' },
        { key:'follower_count',  label:'Follower Count' },
        { key:'has_social',      label:'Social Media' },
        { key:'has_media_sets',  label:'Media Sets' },
    ];
    const DEFAULT_ENABLED = [
        'i_am','age','interested_in','location','languages',
        'body_type','body_decorations','smoke_drink','last_broadcast',
        'fan_club_cost','follower_count'
    ];

    /** ---------------- State/helpers ---------------- */
    const cache = new Map(); // success cache: user -> { t, data }
    const inFlight = new Map(); // user -> Promise
    const failState = new Map(); // user -> { attempts, nextAllowedAt }

    let debTimer = 0;
    const debounce = (fn, ms=80) => (...a)=>{ clearTimeout(debTimer); debTimer=setTimeout(()=>fn(...a), ms); };
    const isVisible = (el)=>{ if(!el) return false; const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0) return false; const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; };
    const esc = (s)=> String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const pick = (...vals)=> vals.find(v => v!=null && String(v).trim()!=='') ?? '';
    const getUserFromHref = (href)=>{ try{ const u=new URL(href, location.origin); return u.pathname.split('/').filter(Boolean)[0]||''; }catch{ return (href||'').replace(/^\/+|\/+$/g,'').split('/')[0]||''; } };
    const isValidBio = (bio)=> !!bio && typeof bio === 'object' && Object.keys(bio).length > 0;

    const asListText = (val) => {
        if (Array.isArray(val)) return val.filter(Boolean).join(', ');
        if (val && typeof val === 'object') { try { return Object.values(val).filter(Boolean).join(', '); } catch { return String(val); } }
        return pick(val);
    };
    const timeAgo = (isoOrText) => {
        if (!isoOrText) return '';
        if (typeof isoOrText==='string' && /\bago\b/i.test(isoOrText)) return isoOrText;
        const d = new Date(isoOrText); if (isNaN(d)) return String(isoOrText);
        let s = Math.max(0,(Date.now()-d.getTime())/1000);
        for (const [lab,sec] of [['y',31536000],['mo',2592000],['d',86400],['h',3600],['m',60],['s',1]]) { const v=Math.floor(s/sec); if(v>=1) return `${v}${lab} ago`; }
        return 'just now';
    };

    /** ---------------- Tampermonkey Prefs ---------------- */
    const getMode = () => { try { return (GM_getValue(MODE_KEY, 'list') === 'pills') ? 'pills' : 'list'; } catch { return 'list'; } };
    const setMode = (mode) => { try { GM_setValue(MODE_KEY, (mode === 'pills') ? 'pills' : 'list'); } catch {} };
    const getEnabledSet = () => {
        try {
            const raw = GM_getValue(FIELDS_KEY, JSON.stringify(DEFAULT_ENABLED));
            const arr = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
            return new Set(arr.filter(Boolean));
        } catch { return new Set(DEFAULT_ENABLED); }
    };
    const setEnabledSet = (set) => { try { GM_setValue(FIELDS_KEY, JSON.stringify(Array.from(set))); } catch {} };

    const registerMenu = () => {
        const cur = getMode();
        GM_registerMenuCommand(`Mode: ${cur === 'list' ? 'Details list (current)' : 'Fact pills (current)'}`, ()=>{});
        GM_registerMenuCommand(cur === 'list' ? 'Switch to: Fact pills' : 'Switch to: Details list', ()=>{
            const next = cur === 'list' ? 'pills' : 'list';
            setMode(next);
            const menu = document.querySelector(MENU_SEL);
            if (menu && isVisible(menu)) augmentMenu(menu, /*force*/true);
            alert(`Info display mode changed to: ${next}`);
        });
        GM_registerMenuCommand('Configure visible fields…', async ()=>{
            const enabled = getEnabledSet();
            for (const f of FIELD_DEFS) {
                const curOn = enabled.has(f.key);
                const ans = confirm(`[CB Info] Show field "${f.label}"?\nCurrent: ${curOn ? 'ON' : 'OFF'}\n\nOK = ON, Cancel = OFF`);
                if (ans) enabled.add(f.key); else enabled.delete(f.key);
            }
            setEnabledSet(enabled);
            const menu = document.querySelector(MENU_SEL);
            if (menu && isVisible(menu)) augmentMenu(menu, /*force*/true);
            alert(`[CB Info] Fields saved: ${FIELD_DEFS.filter(f=>enabled.has(f.key)).map(f=>f.label).join(', ') || '(none)'}`);
        });
        GM_registerMenuCommand('Reset fields to defaults', ()=>{
            setEnabledSet(new Set(DEFAULT_ENABLED));
            const menu = document.querySelector(MENU_SEL);
            if (menu && isVisible(menu)) augmentMenu(menu, /*force*/true);
            alert('[CB Info] Fields reset to defaults.');
        });
        GM_registerMenuCommand('Export fields JSON', ()=>{
            const json = JSON.stringify(Array.from(getEnabledSet()), null, 2);
            prompt('Copy your fields JSON:', json);
        });
        GM_registerMenuCommand('Import fields JSON', ()=>{
            const raw = prompt('Paste fields JSON (array of keys):', '[]');
            if (!raw) return;
            try {
                const arr = JSON.parse(raw);
                if (!Array.isArray(arr)) throw new Error('Not an array');
                const validKeys = new Set(FIELD_DEFS.map(f=>f.key));
                const cleaned = arr.filter(k=> validKeys.has(k));
                setEnabledSet(new Set(cleaned));
                const menu = document.querySelector(MENU_SEL);
                if (menu && isVisible(menu)) augmentMenu(menu, /*force*/true);
                alert('[CB Info] Fields imported.');
            } catch { alert('Invalid JSON.'); }
        });
    };

    /** ---------------- Styles (additive only) ---------------- */
    const ensureStyle = ()=>{
        if (document.getElementById('cbx-info-mode-style')) return;
        const css = document.createElement('style');
        css.id = 'cbx-info-mode-style';
        css.textContent = `
    /* Auto-width for the context menu */
    #user-context-menu[data-testid="user-context-menu"] {
      width: auto !important;
      min-width: 180px !important;
      max-width: 360px !important;
      white-space: normal !important;
    }

    /* Keep text wrapping nicely */
    #user-context-menu[data-testid="user-context-menu"] * {
      white-space: normal !important;
      text-overflow: initial !important;
    }

    /* Existing styles from before... */
    #user-context-menu[data-testid="user-context-menu"] .ucmHeader { position: relative; }

    /* Real name under username */
    #user-context-menu [data-cbx="realname"] {
      display:block; font-size:11px; line-height:1.2; opacity:.9; margin-top:4px;
      max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }

    /* Fact pills */
    #user-context-menu [data-cbx="facts"] {
      display:flex; flex-wrap:wrap; gap:6px; margin:6px 10px 0 10px;
    }
    #user-context-menu [data-cbx="facts"] .cbx-pill {
      padding:2px 6px; border:1px solid rgba(0,0,0,.15); border-radius:999px; font-size:10px; opacity:.95;
    }

    /* Detail list */
    #user-context-menu [data-cbx="details"] {
      margin:6px 10px 0 10px;
      display:grid; grid-template-columns:auto 1fr; gap:6px 10px;
      font-size:11.5px; line-height:1.35;
    }
    #user-context-menu [data-cbx="details"] .lab { font-weight:700; opacity:.95; white-space:nowrap; }
    #user-context-menu [data-cbx="details"] .val { opacity:.95; }
  `;
      document.head.appendChild(css);
  };

    /** ---------------- API (with retry cap) ---------------- */
    const fetchBio = async (user) => {
        const url = new URL(`/api/biocontext/${encodeURIComponent(user)}/`, location.origin).href;
        const resp = await fetch(url, { credentials:'include' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
    };

    // Guard against repeated attempts: success cache + failState + inFlight
    const getBioLimited = async (user) => {
        const now = Date.now();

        // 1) Success cache hit?
        const hit = cache.get(user);
        if (hit && (now - hit.t) < CACHE_TTL) return hit.data;

        // 2) Fail cool-down?
        const fs = failState.get(user);
        if (fs) {
            const { attempts, nextAllowedAt } = fs;
            if (attempts >= MAX_API_TRIES && now < nextAllowedAt) {
                return null; // hard stop during cool-down
            }
        }

        // 3) In-flight dedupe
        if (inFlight.has(user)) return inFlight.get(user);

        // 4) Do request (once)
        const p = (async ()=>{
            try {
                const data = await fetchBio(user);
                if (isValidBio(data)) {
                    cache.set(user, { t: now, data });
                    failState.delete(user); // clear fail state on success
                    return data;
                }
                // invalid data counts as a failed attempt
                const prev = failState.get(user) || { attempts:0, nextAllowedAt:0 };
                const attempts = prev.attempts + 1;
                const nextAllowedAt = attempts >= MAX_API_TRIES ? (now + FAIL_SILENCE_MS) : now;
                failState.set(user, { attempts, nextAllowedAt });
                return null;
            } catch {
                const prev = failState.get(user) || { attempts:0, nextAllowedAt:0 };
                const attempts = prev.attempts + 1;
                const nextAllowedAt = attempts >= MAX_API_TRIES ? (now + FAIL_SILENCE_MS) : now;
                failState.set(user, { attempts, nextAllowedAt });
                return null;
            } finally {
                inFlight.delete(user);
            }
        })();

        inFlight.set(user, p);
        return p;
    };

    /** ---------------- Header box visibility (API-only) ---------------- */
    const setHeaderAgeGenderVisibility = (menuEl, hide) => {
        const header = menuEl.querySelector('.ucmHeader');
        if (!header) return;
        const rightBox = header.querySelector('[data-testid="gender-icon"]')?.closest('div');
        const ageSpan  = header.querySelector('[data-testid="age"]');
        if (rightBox) rightBox.style.display = hide ? 'none' : '';
        if (ageSpan)  ageSpan.style.display  = hide ? 'none' : '';
    };

    /** ---------------- Real name (only when API valid) ---------------- */
    const upsertRealName = (menuEl, username, bio) => {
        const header = menuEl.querySelector('.ucmHeader'); if (!header) return;
        const unameWrap = header.querySelector(LINK_SEL)?.parentElement || header;
        const real = pick(bio?.display_name, bio?.real_name, bio?.full_name, bio?.name);
        const r = (real||'').trim();
        const same = r && username && r.toLowerCase()===username.toLowerCase();
        let node = header.querySelector('[data-cbx="realname"]');
        if (!r || same){ if (node) node.remove(); return; }
        if (!node){
            node = document.createElement('div');
            node.setAttribute('data-cbx','realname');
            node.setAttribute('aria-hidden','true');
            unameWrap.after(node);
        }
        node.textContent = r;
    };

    /** ---------------- Value extraction map ---------------- */
    const valuesFromBio = (bio) => {
        const v = {};
        v.i_am            = pick(bio?.sex, bio?.subgender, bio?.gender);
        v.birth_date      = pick(bio?.birth_date, bio?.dob, bio?.display_birthday, bio?.birthday);
        v.age             = pick(bio?.age, bio?.display_age);
        v.interested_in   = Array.isArray(bio?.interested_in) ? bio.interested_in.join(', ') : pick(bio?.interested_in);
        v.location        = pick(bio?.location, [bio?.city,bio?.region,bio?.country].filter(Boolean).join(', '));
        v.languages       = pick(bio?.languages, Array.isArray(bio?.languages_spoken) ? bio.languages_spoken.join(', ') : '');
        v.body_type       = pick(bio?.body_type, bio?.body, bio?.build);
        v.body_decorations= asListText(pick(bio?.body_decorations, bio?.body_decoration, bio?.decorations));
        v.smoke_drink     = pick(bio?.smoke_drink, [bio?.smokes, bio?.drinks].filter(v=>v!=null).join(' / '));
        v.last_broadcast  = pick(bio?.time_since_last_broadcast, bio?.last_broadcast ? timeAgo(bio.last_broadcast) : '');
        v.fan_club_cost   = (bio?.performer_has_fanclub && Number.isFinite(bio?.fan_club_cost)) ? String(bio.fan_club_cost) : '';
        v.follower_count  = (bio?.follower_count!=null) ? String(bio.follower_count) : '';
        v.has_social      = Array.isArray(bio?.social_medias) && bio.social_medias.length>0 ? 'Yes' : '';
        v.has_media_sets  = Array.isArray(bio?.photo_sets)   && bio.photo_sets.length>0   ? 'Yes' : '';
        return v;
    };

    /** ---------------- Renderers (respecting field selection) ---------------- */
    const ensureStyleOnce = ()=> ensureStyle();

    const upsertFacts = (menuEl, values, enabledSet) => {
        const header = menuEl.querySelector('.ucmHeader'); if (!header) return;
        let holder = menuEl.querySelector('[data-cbx="facts"]');
        const iconFor = (k) => ({
            i_am:'⚧', birth_date:'🎂', age:'🔢', interested_in:'❤️', location:'📍',
            languages:'🗣', body_type:'🏷', body_decorations:'✳️', smoke_drink:'🚬',
            last_broadcast:'⏱', fan_club_cost:'⭐', follower_count:'👥', has_social:'🔗', has_media_sets:'🖼'
        }[k] || '•');

        const pills = FIELD_DEFS
        .filter(f => enabledSet.has(f.key))
        .map(f => [f.key, values[f.key]])
        .filter(([_, val]) => !!val && String(val).trim()!=='')
        .map(([k, val]) => `<span class="cbx-pill" data-k="${k}">${iconFor(k)} ${esc(String(val))}</span>`);

        if (!pills.length){ if (holder) holder.remove(); return; }
        if (!holder){
            holder = document.createElement('div');
            holder.setAttribute('data-cbx','facts');
            const userLabel = menuEl.querySelector('.ucmUserLabel');
            (userLabel || header).insertAdjacentElement('afterend', holder);
        }
        holder.innerHTML = pills.join('');
    };

    const upsertDetails = (menuEl, values, enabledSet) => {
        const header = menuEl.querySelector('.ucmHeader'); if (!header) return;
        let box = menuEl.querySelector('[data-cbx="details"]');

        const rowsHtml = FIELD_DEFS
        .filter(f => enabledSet.has(f.key))
        .map(f => [f.label, values[f.key]])
        .filter(([_, val]) => !!val && String(val).trim()!=='')
        .map(([lab, val]) => `<div class="lab">${esc(lab)}:</div><div class="val">${esc(String(val))}</div>`)
        .join('');

        if (!rowsHtml){ if (box) box.remove(); return; }
        if (!box){
            box = document.createElement('div');
            box.setAttribute('data-cbx','details');
            const userLabel = menuEl.querySelector('.ucmUserLabel');
            (userLabel || header).insertAdjacentElement('afterend', box);
        }
        box.innerHTML = rowsHtml;
    };

    /** ---------------- Core Logic ---------------- */
    const augmentMenu = async (menuEl /*, force*/ ) => {
        if (!menuEl || !isVisible(menuEl)) return;
        ensureStyleOnce();

        const a = menuEl.querySelector(LINK_SEL);
        if (!a) return;
        const username = getUserFromHref(a.getAttribute('href')||'');
        if (!username) return;

        const bio = await getBioLimited(username);
        if (!isValidBio(bio)) return; // No changes if no valid data

        // Hide header age/gender (API-only behavior)
        setHeaderAgeGenderVisibility(menuEl, /*hide*/ true);

        // Real name
        upsertRealName(menuEl, username, bio);

        // Values + rendering per mode/fields
        const values = valuesFromBio(bio);
        const enabledSet = getEnabledSet();
        const mode = getMode();

        if (mode === 'pills') {
            upsertFacts(menuEl, values, enabledSet);
            const dt = menuEl.querySelector('[data-cbx="details"]'); if (dt) dt.remove();
        } else {
            upsertDetails(menuEl, values, enabledSet);
            const fx = menuEl.querySelector('[data-cbx="facts"]'); if (fx) fx.remove();
        }
    };

    /** ---------------- Observers ---------------- */
    const handleDomChange = debounce(()=>{
        const menu = document.querySelector(MENU_SEL);
        if (menu && isVisible(menu)) augmentMenu(menu);
    }, 60);

    const mo = new MutationObserver(handleDomChange);
    mo.observe(document.documentElement || document.body, {
        childList:true, subtree:true, attributes:true, attributeFilter:['style','class','data-testid','id']
    });

    setInterval(()=>{
        const menu = document.querySelector(MENU_SEL);
        if (menu && isVisible(menu)) augmentMenu(menu);
    }, POLL_MS);

    /** ---------------- Init ---------------- */
    ensureStyle();
    registerMenu();
    const existing = document.querySelector(MENU_SEL);
    if (existing && isVisible(existing)) augmentMenu(existing);
})();