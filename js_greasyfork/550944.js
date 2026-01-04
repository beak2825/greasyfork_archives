// ==UserScript==
// @name         Platesmania: Transport Company Helper
// @namespace    https://greasyfork.org/users/976031
// @version      1.0
// @description  Transport company picker for supported /add pages. Queues plate+company until applied, searches flexibly, shows non-intrusive errors.
// @match        https://platesmania.com/*/add*
// @connect      platesmania.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550944/Platesmania%3A%20Transport%20Company%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550944/Platesmania%3A%20Transport%20Company%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* CONFIG + HELPERS */
    const STORAGE_KEY_QUEUE = 'pm_helper_queue';
    const ADMIN_BASE = 'https://platesmania.com/admin/company_edit.php';
    const ADMIN_SELECT_NAME = 'markaavto';
    const SELECT_NAME_UI = 'transcom';
    const MAX_QUEUE_LENGTH = 30;
    const SUPPORTED_COUNTRIES = new Set(['nl','ua','no','dk','se','fr','us','es','fi','uk','pl','lt','cz','sk','ie','is','it','de','ch']);

    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const visible = (el) => el && !el.disabled && el.offsetParent !== null &&
          getComputedStyle(el).visibility !== 'hidden' &&
          getComputedStyle(el).display !== 'none';
    const textOfSelected = (select) => {
        if (!select) return '';
        const opt = select.selectedOptions && select.selectedOptions[0];
        return opt ? (opt.textContent || '').trim() : (select.options[select.selectedIndex]?.textContent || '').trim();
    };
    const selectedText = (id) => { const el = document.getElementById(id); return el ? textOfSelected(el) : ''; };
    const normalizePlate = (s) => (s || '').replace(/[\u00A0\s\-–—·•/\\]+/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    const debounce = (fn, wait) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
    const getCountryFromUrl = () => (location.pathname.match(/^\/([a-z]{2})\/add/i)?.[1] || '').toLowerCase();
    const isPage = (cc) => getCountryFromUrl() === cc;
    const escapeHtml = (s='') => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    /* UI BOOTSTRAP */
    function injectUI() {
        const rulesLink = document.querySelector('a.btn.btn-warning.pull-right[href*="/rules"]');
        if (!rulesLink) return null;
        const row = rulesLink.closest('.row'); const parent = row?.parentNode;
        if (!row || !parent) return null;
        const container = document.createElement('div');
        container.className = 'row margin-top-10';
        container.id = 'pm-helper-row';
        container.innerHTML = `
      <section class="col-xs-12">
        <div class="row"><button type="button" class="btn btn-info" id="pm-load-companies">Choose transport company</button></div>
        <div class="row" id="pm-company-holder" style="margin-top:8px;"></div>
        <div class="row" id="pm-helper-messages-row" style="margin-top:8px;"><div class="col-xs-12"><div id="pm-helper-messages"></div></div></div>
      </section>`;
      parent.insertBefore(container, row.nextSibling);
      return container;
  }

    /* ADMIN FORM LOAD + COMPANY SELECT */
    function gmRequest(opts) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...opts,
                anonymous: false,
                withCredentials: true,
                onload: (res) => resolve(res),
                onerror: (err) => reject(err?.error || err),
                ontimeout: () => reject(new Error('timeout')),
            });
        });
    }
    async function fetchAdminFormHtml() {
        const res = await gmRequest({ method:'GET', url:`${ADMIN_BASE}?id=`, headers:{ 'Accept':'text/html,application/xhtml+xml' }, timeout:20000 });
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        return res.responseText;
    }
    function parseCompanySelect(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const select = doc.querySelector(`select[name="${ADMIN_SELECT_NAME}"]`);
        if (!select) return null;
        const cloned = select.cloneNode(true);
        cloned.setAttribute('name', SELECT_NAME_UI);
        cloned.removeAttribute('id');
        return { selectHtml: cloned.outerHTML };
    }
    async function loadAndRenderCompanySelector() {
        const holder = $('#pm-company-holder'); if (!holder) return;
        holder.textContent = 'Loading companies…';
        try {
            const parsed = parseCompanySelect(await fetchAdminFormHtml());
            if (!parsed?.selectHtml) throw new Error('Company <select> not found.');
            holder.innerHTML = '';
            const wrap = document.createElement('div');
            wrap.className = 'col-xs-12';
            wrap.innerHTML = `
        <label style="display:block; font-weight:bold; margin-bottom:4px;">Transport company:</label>
        <div class="pm-search-wrap">
          ${parsed.selectHtml}
          <div class="pm-search">
            <input id="pm-company-search" type="text" class="form-control" placeholder="Search company… (min 2 chars)" />
            <span class="pm-search-clear" title="Clear">×</span>
            <ul class="pm-ac-list" id="pm-ac-list" role="listbox" aria-label="Companies"></ul>
          </div>
        </div>`;
        holder.appendChild(wrap);
        const select = holder.querySelector(`select[name="${SELECT_NAME_UI}"]`);
        if (select) {
            select.classList.add('form-control'); select.style.marginBottom = '8px';
            select.addEventListener('change', handleCompanyChange);
            const lastWithCompany = [...readQueue()].reverse().find(it => it?.company?.value);
            if (lastWithCompany && [...select.options].some(o => o.value === lastWithCompany.company.value)) select.value = lastWithCompany.company.value;
            new MutationObserver(() => handleCompanyChange()).observe(select, { attributes: true, attributeFilter: ['value'] });
            installCompanySearch(select);
        }
    } catch (e) {
        const msg = 'Could not load companies. (Are you logged in?)';
        holder.textContent = msg; console.error('[PM Helper] load companies failed:', e); renderMessages([{ text: msg }], true);
    }
  }
    function installCompanySearch(selectEl) {
        const input = $('#pm-company-search'); const clear = $('.pm-search-clear'); const list = $('#pm-ac-list');
        if (!input || !list) return;
        const autocomplarr = [...selectEl.options].map(o => ({ label:(o.textContent||'').trim(), value:(o.value||'')+',' }));
        autocomplarr.push({ label:'000 Номерной знак без ТС', value:'297,' });
        const accentMap = {"á":"a","à":"a","ä":"a","ã":"a","ö":"o","ó":"o","ò":"o","ô":"o","ü":"u","ú":"u","ù":"u","é":"e","è":"e","í":"i","ž":"z","ñ":"n","š":"s","Š":"S","ş":"s","ğ":"g","ç":"c","і":"i","ё":"e","Ẽ":"E","(":" ",")":" ","-":" ","/":" ","\u00AB":" ","\u00BB":" "};
        const normalize = (term) => term.split('').map(ch => accentMap[ch] || ch).join('');
        let activeIndex = -1;
        const closeList = () => { list.innerHTML=''; list.style.display='none'; activeIndex=-1; };
        const openList = () => { list.style.display = list.children.length ? 'block' : 'none'; };
        const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        const matchItems = (term) => {
            term = term.trim(); if (term.length < 2) return [];
            const parts = term.split(/\s+/); let sr = ''; parts.forEach(v => { sr += '(?:^|\\s)'+escapeReg(v)+'.*'; });
            const re = new RegExp(sr, 'ig'); const out = [];
            for (const it of autocomplarr) { const v = it.label || it.value || ''; if (re.test(v) || re.test(normalize(v))) out.push(it); if (out.length>=50) break; }
            return out;
        };
        const renderItems = (items) => {
            list.innerHTML=''; items.slice(0,20).forEach(it => {
                const li = document.createElement('li'); li.setAttribute('role','option'); li.tabIndex=-1; li.className='pm-ac-item';
                li.textContent = it.label; li.dataset.value = it.value;
                li.addEventListener('mousedown', (e)=>{ e.preventDefault(); selectFromItem(it); });
                list.appendChild(li);
            }); activeIndex=-1; openList();
        };
        const selectFromItem = (item) => {
            const id = item.value.split(',')[0];
            if ([...selectEl.options].some(o => o.value === id)) {
                selectEl.value = id;
                selectEl.dispatchEvent(new Event('change', { bubbles:true }));
            }
            input.value = item.label; closeList();
        };
        const moveActive = (dir) => {
            const items = [...list.children]; if (!items.length) return;
            activeIndex = (activeIndex + dir + items.length) % items.length;
            items.forEach((li,i)=>li.classList.toggle('active', i===activeIndex));
            items[activeIndex]?.scrollIntoView({ block:'nearest' });
        };
        const onInput = debounce(()=>renderItems(matchItems(input.value)),80);
        input.addEventListener('input', onInput);
        input.addEventListener('keydown', (e)=>{
            if (e.key==='ArrowDown'){ e.preventDefault(); moveActive(1); }
            else if (e.key==='ArrowUp'){ e.preventDefault(); moveActive(-1); }
            else if (e.key==='Enter'){ if (list.style.display==='block' && activeIndex>=0){ e.preventDefault(); const li = list.children[activeIndex]; if (li) selectFromItem({ label: li.textContent, value: li.dataset.value }); } }
            else if (e.key==='Escape'){ closeList(); }
        });
        input.addEventListener('focus', ()=>{ if (input.value.trim().length>=2) renderItems(matchItems(input.value)); });
        document.addEventListener('click', (e)=>{ if (!e.target.closest('.pm-search')) closeList(); });
        clear?.addEventListener('click', (e)=>{ e.preventDefault(); input.value=''; closeList(); input.focus(); });
    }

    /* PLATE BUILDERS (country-aware) */
    function buildPlateForCurrentPage() {
        if (isPage('nl')) return document.getElementById('nomer')?.value || '';
        if (isPage('ua')) {
            const region = document.getElementById('region1')?.value || '';
            const digits = document.getElementById('digit1')?.value || '';
            const b1 = document.getElementById('b1')?.value || '';
            const b2 = document.getElementById('b2')?.value || '';
            return `${region}${digits}${b1}${b2}`;
        }
        if (isPage('no') || isPage('dk') || isPage('se')) return `${document.getElementById('let')?.value||''}${document.getElementById('digit')?.value||''}`;
        if (isPage('fr')) return `${document.getElementById('b1')?.value||''}${document.getElementById('digit2')?.value||''}${document.getElementById('b2')?.value||''}`;
        if (isPage('us')) return (document.getElementById('nomer')?.value || '').replace(/\s+/g,'');
        if (isPage('es')) {
            const ctype = document.getElementById('ctype')?.value; const q = (id)=>document.getElementById(id)?.value || '';
            if (ctype==='1') return q('digit1')+q('let');
            if (ctype==='2') return selectedText('dip')+selectedText('region')+q('digit1');
            if (ctype==='3') return selectedText('region')+q('digit1')+q('let');
            if (ctype==='4') return selectedText('region')+q('digit2')+q('let');
            if (ctype==='5') return selectedText('region')+q('digit1')+q('let');
            if (ctype==='7') return selectedText('region')+q('digit2');
            return '';
        }
        if (isPage('fi')) return `${document.getElementById('let1')?.value||''}-${document.getElementById('digit')?.value||''}`;
        if (isPage('uk')) return (document.getElementById('nomerpl')?.value || document.getElementById('nomer')?.value || '');
        if (isPage('pl')) {
            const ctype = document.getElementById('ctype')?.value; const q = (id)=>document.getElementById(id)?.value || '';
            switch (ctype) {
                case '1': case '2': case '3': case '4': case '5': case '9': case '10': case '11': return selectedText('region') + q('nomerpl');
                case '6': case '7': case '8': return selectedText('region') + q('b1') + q('nomerpl');
                case '12': return selectedText('dip') + selectedText('region') + q('digit');
                default: return '';
            }
        }
        if (isPage('lt')) {
            const b1=$('#b1'), b2=$('#b2'), b3=$('#b3'), d1=$('#digit1'), d2=$('#digit2'), d3=$('#digit3'), vanity=$('#nomer'); const ctype=$('#ctype')?.value;
            if (ctype==='1') return (b1?.value||'')+(b2?.value||'')+(b3?.value||'')+(d2?.value||'');
            if (ctype==='2') return (d1?.value||'')+(b1?.value||'')+(b2?.value||'');
            if (ctype==='3') return (b1?.value||'')+(b2?.value||'')+(d2?.value||'');
            if (ctype==='4') return (d1?.value||'')+(b1?.value||'')+(b2?.value||'')+(b3?.value||'');
            if (['5','6','7','9'].includes(ctype)) return vanity?.value || '';
            if (ctype==='8') return (d3?.value||'')+(b1?.value||'')+(b2?.value||'');
            return '';
        }
        if (isPage('cz')) {
            const q=(id)=>document.getElementById(id)?.value||''; const cat=q('ctype');
            const regionField=$('#region'); const r = regionField?.options?.[regionField.selectedIndex]?.text || '';
            const b1=q('b1'),b2=q('b2'),b3=q('b3'),d1=q('digit1'),d2=q('digit2'),d3=q('digit3'),nomer=q('nomer'),el=q('el');
            switch (cat){
                case '1': return `${b1}${r}${b2}${d1}`; case '2': return `${b1}${r}${d1}`;
                case '4': case '5': case '6': return `${r}${b2}${d1}`;
                case '7': case '8': case '9': case '10': return `${r}${b2}${d2}`;
                case '11': case '3': return nomer;
                case '12': return `${el}${b3}${d3}`;
                case '13': return `${d1}${d3}`;
                default: return '';
            }
        }
        if (isPage('sk')) {
            const ctype=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            switch (ctype){
                case '1': case '2': case '12': return selectedText('region') + q('digit') + q('let2');
                case '3': case '4': case '5': case '6': case '7': case '8': return selectedText('region') + q('let1') + q('digit');
                case '9': return q('let2') + q('nomerpl');
                case '10': return q('let1') + q('police');
                case '11': return q('digit') + q('police');
                case '13': return selectedText('dip') + q('police');
                default: return '';
            }
        }
        if (isPage('ie')) {
            const ctype=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            switch (ctype){
                case '1': return q('digit1') + selectedText('region') + q('digit2');
                case '2': case '3': return q('let') + q('digit2');
                default: return '';
            }
        }
        if (isPage('is')) {
            const ctype=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            switch (ctype){
                case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '9': return (q('nomer')||'').replace(/\s+/g,'');
                case '8': return selectedText('b1')+selectedText('b2')+selectedText('b3')+selectedText('b4')+selectedText('b5')+selectedText('b6');
                case '10': return selectedText('region') + q('nomer').replace(/\s+/g,'');
                default: return '';
            }
        }
        if (isPage('it')) {
            const c=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            const txt=(id)=>{ const el=$('#'+id); if (!el || el.selectedIndex<0 || !el.options) return ''; return el.options[el.selectedIndex].text||''; };
            const join=(...p)=>p.join('').replace(/[\s-]+/g,'');
            switch (c){
                case '1': return join(q('b1'), q('digit1'), q('b2'));
                case '2': case '3': return join(q('b1'), q('digit2'));
                case '4': return join(q('b1'), q('digit1'), q('b2'));
                case '5': case '6': case '7': return join(txt('region1'), q('nomerpl1'));
                case '8': return '';
                case '9': { const dip = txt('dipreg').replace(/\s*\(.*?\)\s*/g,''); return join(dip, q('digit2'), q('b2')); }
                case '10': return join(q('b1'), q('digit2'));
                default: return '';
            }
        }
        if (isPage('de')) {
            const rb=$('#region'); const r=rb?.options?.[rb.selectedIndex]?.text||''; const b1=$('#b1')?.value||''; const b2=$('#b2')?.value||''; const d=$('#digit')?.value||'';
            return `${r}${b1}${d}${b2}`;
        }
        if (isPage('ch')) return `${$('#region')?.value||''}${$('#digit')?.value||''}`;
        return '';
    }
    function buildPlateForSearchDisplay() {
        if (isPage('nl')) return $('#nomer')?.value || '';
        if (isPage('ua')) {
            const region=$('#region1')?.value||'', digits=$('#digit1')?.value||'', b1=$('#b1')?.value||'', b2=$('#b2')?.value||'';
            return `${region} ${digits} ${b1}${b2}`.trim();
        }
        if (isPage('no') || isPage('dk') || isPage('se')) return `${$('#let')?.value||''} ${$('#digit')?.value||''}`.trim();
        if (isPage('fr')) return `${$('#b1')?.value||''} ${$('#digit2')?.value||''} ${$('#b2')?.value||''}`.trim();
        if (isPage('us')) return ($('#nomer')?.value || '').replace(/\s+/g,'');
        if (isPage('es')) return buildPlateForCurrentPage();
        if (isPage('de')) {
            const rb=$('#region'); const r=rb?.options?.[rb.selectedIndex]?.text||''; const b1=$('#b1')?.value||''; const b2=$('#b2')?.value||''; const d=$('#digit')?.value||'';
            return `${r} ${b1} ${d}${b2}`.trim();
        }
        if (isPage('ch')) return `${$('#region')?.value||''} ${$('#digit')?.value||''}`.trim();
        if (isPage('fi')) return `${$('#let1')?.value||''}-${$('#digit')?.value||''}`.trim();
        if (isPage('pl')) {
            const rf=$('#region'); const r=rf?.options?.[rf.selectedIndex]?.text||''; const d=$('#nomerpl')?.value||'';
            return `${r} ${d}`.trim();
        }
        if (isPage('uk')) return ($('#nomerpl')?.value || $('#nomer')?.value || '');
        if (['lt','it','cz','sk'].includes(getCountryFromUrl())) return buildPlateForCurrentPage();
        if (isPage('ie')) {
            const c=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            if (c==='1') return `${q('digit1')}-${selectedText('region')}-${q('digit2')}`.trim();
            if (c==='2' || c==='3') return (q('let')+q('digit2')).trim();
            return '';
        }
        if (isPage('is')) {
            const c=$('#ctype')?.value; const q=(id)=>$('#'+id)?.value||'';
            if (['1','2','3','4','5','6','7','9'].includes(c)) return q('nomer');
            if (c==='8') return selectedText('b1')+selectedText('b2')+selectedText('b3')+selectedText('b4')+selectedText('b5')+selectedText('b6');
            if (c==='10') return `${selectedText('region')} ${q('nomer').replace(/\s+/g,'')}`;
            return '';
        }
        return '';
    }

    /* QUEUE + MESSAGES */
    function readQueue() { try { const q = GM_getValue(STORAGE_KEY_QUEUE, []); return Array.isArray(q)?q:[]; } catch { return []; } }
    function writeQueue(q) { try { GM_setValue(STORAGE_KEY_QUEUE, q.slice(-MAX_QUEUE_LENGTH)); } catch (e) { console.error('[PM Helper] writeQueue failed:', e); } }

    function enqueueOrUpdateCurrent(plate, company) {
        if (!plate) return;
        const composedDisplay = buildPlateForSearchDisplay() || plate.composed || '';
        const composedStored = normalizePlate(composedDisplay).replace(/\s+/g,' ');
        if (!composedStored) return;
        plate.composed = (composedDisplay || '').replace(/[\u00A0\s\-–—·•/\\]+/g,' ').replace(/\s+/g,' ').trim();
        const now = Date.now(); const q = readQueue(); const last = q[q.length-1];
        const sameAsLast = last && normalizePlate(last.plate?.composed||'') === normalizePlate(plate.composed||'');
        if (sameAsLast) {
            last.plate = { ...last.plate, ...plate };
            last.company = company?.value ? { ...company } : last.company;
            last.ts = now; last.status = undefined; last.error = undefined;
        } else {
            q.push({ plate, company: company?.value ? { ...company } : { value:'', text:'' }, ts: now });
        }
        writeQueue(q);
    }

    /* LIVE CAPTURE */
    function startLiveCapture() {
        const idsToWatch = ['region','regionreg','regionfed','regiondip','regionfed1','dipf','b1','b2','digit','season','transdate','let','let1','digit2','region1','digit1','ctype','dip','nomerpl','nomerpl1','digit3','b3','nomer','el','let2','police','dipreg'];
        const saveDebounced = debounce(saveCurrentState, 120);
        idsToWatch.forEach(id => { const el = document.getElementById(id); if (el) { el.addEventListener('input', saveDebounced, true); el.addEventListener('change', saveDebounced, true); } });
        document.addEventListener('input', (e)=>{ if (e.target?.id && idsToWatch.includes(e.target.id)) saveDebounced(); }, true);
        document.addEventListener('change', (e)=>{ if (e.target?.id && idsToWatch.includes(e.target.id)) saveDebounced(); }, true);
        const plateSection = findPlateSection(); if (plateSection) new MutationObserver(saveDebounced).observe(plateSection, { attributes:true, subtree:true, childList:true });
        saveCurrentState();
    }
    function findPlateSection() { const region = $('#region') || $('#region1') || $('#nomer'); return region ? region.closest('section') || region.closest('.row') || region.parentElement : null; }
    function handleCompanyChange() { const company = getCurrentCompanySelection(); const plate = collectCurrentPlateParts(true); if (plate?.composed) enqueueOrUpdateCurrent(plate, company); }
    function collectCurrentPlateParts(allowEmpty=false) {
        const getVal=(id)=>{ const el=$('#'+id); return (el && visible(el) && (el.value||'').trim())?el.value.trim():''; };
        let regionText=''; for (const sel of ['#region','#region1']) { const el=$(sel); if (el && visible(el)) { regionText = textOfSelected(el) || el.value || ''; break; } }
        const composedDisplay = (buildPlateForSearchDisplay() || '').replace(/[\u00A0\s\-–—·•/\\]+/g,' ').replace(/\s+/g,' ').trim();
        if (!allowEmpty && !composedDisplay) return null;
        return { region:regionText, b1:getVal('b1'), b2:getVal('b2'), digit:getVal('digit')||getVal('digit1')||getVal('nomerpl')||getVal('nomer')||'', season:getVal('season'), transdate:getVal('transdate'), composed:composedDisplay };
    }
    function getCurrentCompanySelection() {
        const sel = document.querySelector(`#pm-company-holder select[name="${SELECT_NAME_UI}"]`);
        const value = sel?.value || ''; const text = value ? (sel?.selectedOptions?.[0]?.textContent || '').trim() : '';
        return { value, text };
    }
    async function saveCurrentState() {
        const plate = collectCurrentPlateParts(false); if (!plate?.composed) return;
        const company = getCurrentCompanySelection(); enqueueOrUpdateCurrent(plate, company);
    }

    /* APPLY QUEUE */
    function findLastBarMatchFlexible(normalizedKey) {
        const smalls = $$('small');
        for (const sm of smalls) {
            if (!/last/i.test(sm.textContent || '')) continue;
            const links = $$('a[href*="/nomer"]', sm);
            for (const a of links) {
                const labelNorm = normalizePlate(a.textContent || '');
                if (labelNorm && labelNorm === normalizedKey) {
                    const href = a.getAttribute('href') || '';
                    const m = href.match(/\/([a-z]{2})\/nomer(\d+)/i);
                    const id = m?.[2] || '';
                    const param = encodeURIComponent(href);
                    return { id, param };
                }
            }
        }
        return null;
    }
    async function postCompanyToItem(id, param, companyValue) {
        const body = new URLSearchParams({ posted1:'1', id:String(id), param:String(param), [ADMIN_SELECT_NAME]:String(companyValue), status:'0', Submit:'Save' });
        const res = await gmRequest({ method:'POST', url:`${ADMIN_BASE}?id=${encodeURIComponent(id)}&param=${param}`, headers:{ 'Content-Type':'application/x-www-form-urlencoded','Accept':'text/html,application/xhtml+xml' }, data: body.toString(), timeout:20000 });
        if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);
    }
    async function maybeFinalizeQueue() {
        let q = readQueue(); if (!q.length) return;
        let successCount = 0;
        for (let i = 0; i < q.length; i++) {
            const item = q[i]; if (!item || item.status === 'applied') continue;
            const plateDisplay = item.plate?.composed || ''; const companyId = item.company?.value || '';
            if (!plateDisplay || !companyId) continue;
            const targetKey = normalizePlate(plateDisplay);
            const found = findLastBarMatchFlexible(targetKey);
            if (!found?.id || !found?.param) { item.status='error'; item.error=`Could not find uploaded post for plate "${plateDisplay}".`; continue; }
            try {
                await postCompanyToItem(found.id, found.param, companyId);
                successCount++;
                // continue loop to ensure we mark errors on others if nothing else matches; we'll clear after if success occurred
            } catch (e) {
                console.error('[PM Helper] posting company failed:', e);
                item.status='error'; item.error=`Failed to set company for plate "${plateDisplay}" (network/admin error).`;
            }
        }
        if (successCount > 0) {
            // After a successful apply (i.e., after each upload), clear everything so storage doesn't grow from per-keystroke entries.
            writeQueue([]);
            renderMessages([]); // clear errors box
        } else {
            // No success => keep errors so user sees what's wrong.
            writeQueue(q);
            renderMessages();
        }
    }

    /* STYLES + INIT */
    GM_addStyle(`
    #pm-helper-row{margin-top:10px}
    #pm-company-holder select{max-width:100%}
    .margin-top-10{margin-top:10px}
    .pm-search-wrap{display:block}
    .pm-search{position:relative}
    #pm-company-search{padding-right:26px}
    .pm-search-clear{position:absolute; right:8px; top:50%; transform:translateY(-50%); font-weight:bold; cursor:pointer; user-select:none; opacity:.6}
    .pm-search-clear:hover{opacity:1}
    .pm-ac-list{display:none; position:absolute; left:0; right:0; z-index:9999; background:#fff; border:1px solid #ccc; max-height:260px; overflow:auto; margin:2px 0 0; padding:0; list-style:none}
    .pm-ac-item{padding:6px 8px; cursor:pointer}
    .pm-ac-item:hover,.pm-ac-item.active{background:#eee}
    .pm-msg{border:1px solid #e0b4b4; background:#fff6f6; color:#912d2b; padding:8px 10px; border-radius:4px}
    .pm-msg ul{margin:6px 0 0 18px}
    .pm-msg .btn{margin-top:6px}
  `);

    (function init() {
        const supported = SUPPORTED_COUNTRIES.has(getCountryFromUrl());
        if (supported) { const ui = injectUI(); if (ui) $('#pm-load-companies')?.addEventListener('click', loadAndRenderCompanySelector); }
        startLiveCapture();
        maybeFinalizeQueue();
        renderMessages();
    })();

})();
