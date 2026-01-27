// ==UserScript==
// @name         Platesmania: Transport Company Helper
// @namespace    https://greasyfork.org/users/976031
// @version      2.1.1
// @description  Transport company picker for supported /add pages. Queues plate+company until applied, searches flexibly, shows non-intrusive errors. Also adds company buttons on gallery pages.
// @match        https://platesmania.com/*/add*
// @match        https://platesmania.com/*/gallery*
// @match        https://platesmania.com/gallery*
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
    const STORAGE_KEY_DISMISSED = 'pm_helper_dismissed';
    const ADMIN_BASE = 'https://platesmania.com/admin/company_edit.php';
    const ADMIN_SELECT_NAME = 'markaavto';
    const SELECT_NAME_UI = 'transcom';
    const MAX_QUEUE_LENGTH = 30;

    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const visible = (el) => el && !el.disabled && el.offsetParent !== null &&
          getComputedStyle(el).visibility !== 'hidden' &&
          getComputedStyle(el).display !== 'none';
    const isVisuallyVisible = (el) => el && el.offsetParent !== null &&
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
    const escapeHtml = (s='') => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    function generatePermutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
            const perms = generatePermutations(rest);
            for (const perm of perms) {
                result.push([arr[i], ...perm]);
            }
        }
        return result;
    }

    function readDismissed() {
        try {
            const d = GM_getValue(STORAGE_KEY_DISMISSED, []);
            return Array.isArray(d) ? d : [];
        } catch {
            return [];
        }
    }

    function writeDismissed(dismissed) {
        try {
            GM_setValue(STORAGE_KEY_DISMISSED, dismissed);
        } catch (e) {
            console.error('[PM Helper] writeDismissed failed:', e);
        }
    }

    function isDismissed(plateComposed, companyId) {
        const dismissed = readDismissed();
        return dismissed.some(d =>
            d.plate === normalizePlate(plateComposed) &&
            d.company === String(companyId)
        );
    }

    function addDismissed(plateComposed, companyId) {
        const dismissed = readDismissed();
        const key = {
            plate: normalizePlate(plateComposed),
            company: String(companyId)
        };
        if (!dismissed.some(d => d.plate === key.plate && d.company === key.company)) {
            dismissed.push(key);
            // Keep only the last 100 dismissed items
            const maxDismissed = 100;
            const trimmed = dismissed.slice(-maxDismissed);
            writeDismissed(trimmed);
        }
    }

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
    function clearSelectedCompany() {
        const select = document.querySelector(`#pm-company-holder select[name="${SELECT_NAME_UI}"]`);
        if (select) {
            select.value = '';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const searchInput = $('#pm-company-search');
        if (searchInput) searchInput.value = '';
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
        holder.textContent = msg; console.error('[PM Helper] load companies failed:', e);
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

    /* UNIVERSAL PLATE BUILDERS */
    const NON_PLATE_FIELDS = new Set(['ctype', 'drop_1', 'drop_2', 'cntr', 'fon', 'fonv', 'dfon', 'color', 'transdate', 'expdate']);
    const NON_PLATE_KEYWORDS = ['single-row', 'two-row', 'three-row', 'euroband', 'with flag', 'without euroband', 'with euroband', 'us-style', 'fe-font'];

    function isNonPlateField(field) {
        if (!field || !field.name) return true;
        if (NON_PLATE_FIELDS.has(field.name)) return true;
        if (field.tagName === 'SELECT') {
            const options = Array.from(field.options || []);
            const optionText = options.map(opt => (opt.textContent || '').toLowerCase()).join(' ');
            return NON_PLATE_KEYWORDS.some(kw => optionText.includes(kw.toLowerCase()));
        }
        return false;
    }

    function getPlateFieldsFromFieldset() {
        const fieldset = $('fieldset.margin-bottom-20');
        if (!fieldset) return [];

        const allFields = [
            ...$$('input[type="text"]', fieldset),
            ...$$('input[type="number"]', fieldset),
            ...$$('select', fieldset)
        ];

        return allFields.filter(field => {
            // Check visual visibility (not disabled state) - disabled but visible fields should be included
            if (!isVisuallyVisible(field)) return false;
            if (isNonPlateField(field)) return false;
            if (field.tagName === 'INPUT' && (!field.value || !field.value.trim())) return false;
            if (field.tagName === 'SELECT' && (!field.value || field.selectedIndex < 0)) return false;
            return true;
        });
    }

    function getFieldValue(field) {
        if (field.tagName === 'SELECT') {
            const opt = field.selectedOptions?.[0] || field.options?.[field.selectedIndex];
            return opt ? (opt.textContent || opt.value || '').trim() : '';
        }
        return (field.value || '').trim();
    }

    function buildPlateForCurrentPage() {
        const fields = getPlateFieldsFromFieldset();
        if (!fields.length) return '';
        return fields.map(f => getFieldValue(f)).join('');
    }

    function buildPlateForSearchDisplay() {
        const fields = getPlateFieldsFromFieldset();
        if (!fields.length) return '';
        return fields.map(f => getFieldValue(f)).join(' ').trim();
    }

    function buildPlatePatternForSearch() {
        const fields = getPlateFieldsFromFieldset();
        if (!fields.length) return '';
        const values = fields.map(f => {
            const val = getFieldValue(f);
            return normalizePlate(val);
        }).filter(v => v);
        if (!values.length) return '';
        // Create pattern with wildcards: value1*value2*value3 (matches with any chars in between)
        return values.join('*');
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
        plate.searchPattern = buildPlatePatternForSearch() || normalizePlate(plate.composed);
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
        const saveDebounced = debounce(saveCurrentState, 120);
        const fieldset = $('fieldset.margin-bottom-20');
        if (fieldset) {
            // Watch all input and select changes within the fieldset
            fieldset.addEventListener('input', saveDebounced, true);
            fieldset.addEventListener('change', saveDebounced, true);
            // Watch for DOM changes (fields appearing/disappearing)
            new MutationObserver(saveDebounced).observe(fieldset, { attributes:true, subtree:true, childList:true, attributeFilter:['style','disabled'] });
        }
        // Also watch document-level events for any form fields
        document.addEventListener('input', (e)=>{ if (e.target?.closest('fieldset.margin-bottom-20')) saveDebounced(); }, true);
        document.addEventListener('change', (e)=>{ if (e.target?.closest('fieldset.margin-bottom-20')) saveDebounced(); }, true);
        saveCurrentState();
    }
    function handleCompanyChange() { const company = getCurrentCompanySelection(); const plate = collectCurrentPlateParts(true); if (plate?.composed) enqueueOrUpdateCurrent(plate, company); }
    function collectCurrentPlateParts(allowEmpty=false) {
        const composedDisplay = (buildPlateForSearchDisplay() || '').replace(/[\u00A0\s\-–—·•/\\]+/g,' ').replace(/\s+/g,' ').trim();
        if (!allowEmpty && !composedDisplay) return null;
        const fields = getPlateFieldsFromFieldset();
        const fieldData = {};
        fields.forEach(field => {
            if (field.name) {
                fieldData[field.name] = getFieldValue(field);
            }
        });
        return { ...fieldData, composed:composedDisplay };
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
    function calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        if (longer.length === 0) return 1.0;
        const distance = levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    function levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    function matchPatternSingleOrder(parts, text) {
        if (parts.length === 0) return false;
        if (parts.length === 1) {
            const similarity = calculateSimilarity(parts[0], text);
            const result = similarity >= 0.9;
            console.log('[PM Helper] matchPatternSingleOrder (single part):', parts[0], 'vs', text, 'similarity:', similarity, '→', result);
            return result;
        }
        // Normalize text to remove spaces for easier matching
        const textNoSpaces = text.replace(/\s+/g, '');
        const partsNoSpaces = parts.map(p => p.replace(/\s+/g, ''));
        console.log('[PM Helper] matchPatternSingleOrder (multi-part): parts:', partsNoSpaces, 'textNoSpaces:', textNoSpaces);

        // For multi-part patterns, check if all parts appear in order with any chars in between
        let searchIndex = 0;
        for (let partIdx = 0; partIdx < partsNoSpaces.length; partIdx++) {
            const part = partsNoSpaces[partIdx];
            const index = textNoSpaces.indexOf(part, searchIndex);
            console.log('[PM Helper]   Looking for part', partIdx + 1, ':', part, 'starting at index', searchIndex, '→ found at', index);
            if (index === -1) {
                // Try fuzzy match for this part
                let found = false;
                for (let i = searchIndex; i < textNoSpaces.length; i++) {
                    const substring = textNoSpaces.substring(i, Math.min(i + part.length + 2, textNoSpaces.length));
                    const sim = calculateSimilarity(part, substring);
                    if (sim >= 0.9) {
                        console.log('[PM Helper]     Fuzzy match found at index', i, 'similarity:', sim);
                        searchIndex = i + substring.length;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log('[PM Helper]   Part not found, returning false');
                    return false;
                }
            } else {
                searchIndex = index + part.length;
            }
        }
        // Final similarity check for overall match (compare without spaces)
        const normalizedPattern = partsNoSpaces.join('');
        const similarity = calculateSimilarity(normalizedPattern, textNoSpaces);
        const result = similarity >= 0.9;
        console.log('[PM Helper]   Final similarity check:', normalizedPattern, 'vs', textNoSpaces, 'similarity:', similarity, '→', result);
        return result;
    }

    function matchPattern(pattern, text) {
        if (!pattern || !text) return false;
        const parts = pattern.split('*').filter(p => p);
        if (parts.length === 0) return false;

        // Generate all permutations of the parts
        const permutations = generatePermutations(parts);

        // Try matching with each permutation
        for (const perm of permutations) {
            if (matchPatternSingleOrder(perm, text)) {
                return true;
            }
        }
        return false;
    }

    function findLastBarMatchFlexible(pattern, originalPlate) {
        console.log('[PM Helper] findLastBarMatchFlexible called with pattern:', pattern, 'originalPlate:', originalPlate);
        const smalls = $$('small');
        console.log('[PM Helper] Found', smalls.length, '<small> elements');
        let bestMatch = null;
        let bestSimilarity = 0;
        let bestNomerId = 0;

        const parts = pattern.split('*').filter(p => p);
        console.log('[PM Helper] Pattern parts:', parts);
        const permutations = parts.length > 1 ? generatePermutations(parts) : [parts];
        console.log('[PM Helper] Generated', permutations.length, 'permutations');

        let checkedPlates = 0;
        for (const sm of smalls) {
            const textContent = sm.textContent || '';
            console.log('[PM Helper] Checking <small> element, textContent (first 200 chars):', textContent.substring(0, 200));

            // Try multiple selectors to find links
            const links1 = $$('a[href*="/nomer"]', sm);
            const links2 = $$('a', sm);
            const links3 = sm.querySelectorAll ? Array.from(sm.querySelectorAll('a[href*="/nomer"]')) : [];
            console.log('[PM Helper]   Links found with $$("a[href*=\\"/nomer\\"]"):', links1.length);
            console.log('[PM Helper]   Links found with $$("a"):', links2.length);
            console.log('[PM Helper]   Links found with querySelectorAll:', links3.length);

            const links = links1.length > 0 ? links1 : (links3.length > 0 ? links3 : links2);
            console.log('[PM Helper]   Using', links.length, 'plate links from this <small>');

            if (links.length > 0) {
                console.log('[PM Helper]   First few link hrefs:', links.slice(0, 3).map(a => a.getAttribute('href')));
            }

            // Filter to only links with /nomer in href
            const nomerLinks = links.filter(a => {
                const href = a.getAttribute('href') || '';
                return href.includes('/nomer');
            });
            console.log('[PM Helper]   Filtered to', nomerLinks.length, 'links with /nomer in href');

            // Language-agnostic check: look for <small> elements with multiple /nomer links
            // This identifies the "recently uploaded" section regardless of language
            if (nomerLinks.length < 2) {
                console.log('[PM Helper]   Skipping: less than 2 /nomer links (not the recently uploaded section)');
                continue;
            }

            console.log('[PM Helper] Found <small> with', nomerLinks.length, 'plate links (recently uploaded section)');
            console.log('[PM Helper]   <small> innerHTML (first 300 chars):', sm.innerHTML?.substring(0, 300));

            for (const a of nomerLinks) {
                checkedPlates++;
                const plateText = a.textContent || '';
                const labelNorm = normalizePlate(plateText);
                console.log('[PM Helper] Checking plate:', plateText, 'normalized:', labelNorm);

                // Extract nomer ID for comparison (higher = more recent)
                const href = a.getAttribute('href') || '';
                const m = href.match(/\/([a-z]{2})\/nomer(\d+)/i);
                const nomerId = parseInt(m?.[2] || '0', 10);

                // Try matching with each permutation
                for (const perm of permutations) {
                    const matched = matchPatternSingleOrder(perm, labelNorm);
                    console.log('[PM Helper]   Trying permutation:', perm.join(' '), '→', matched ? 'MATCH' : 'no match');
                    if (matched) {
                        const permPattern = perm.join('').replace(/\s+/g, '');
                        const textNoSpaces = labelNorm.replace(/\s+/g, '');
                        const similarity = calculateSimilarity(permPattern, textNoSpaces);
                        console.log('[PM Helper]   Similarity:', similarity, 'nomerId:', nomerId);

                        // Prefer higher nomer ID (more recent) if similarity is similar
                        if (similarity > bestSimilarity || (similarity >= 0.9 && nomerId > bestNomerId)) {
                            bestSimilarity = similarity;
                            bestNomerId = nomerId;
                            const id = m?.[2] || '';
                            const param = encodeURIComponent(href);
                            bestMatch = { id, param, foundPlate: plateText };
                            console.log('[PM Helper]   New best match! id:', id, 'plate:', plateText);
                        }
                        break; // Found a match with this permutation, no need to try others
                    }
                }
            }
        }
        console.log('[PM Helper] Checked', checkedPlates, 'plates total. Best match:', bestMatch);
        return bestMatch;
    }
    async function postCompanyToItem(id, param, companyValue) {
        const body = new URLSearchParams({ posted1:'1', id:String(id), param:String(param), [ADMIN_SELECT_NAME]:String(companyValue), status:'0', Submit:'Save' });
        const res = await gmRequest({ method:'POST', url:`${ADMIN_BASE}?id=${encodeURIComponent(id)}&param=${param}`, headers:{ 'Content-Type':'application/x-www-form-urlencoded','Accept':'text/html,application/xhtml+xml' }, data: body.toString(), timeout:20000 });
        if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);
    }
    /* INFO BOX */
    let infoBoxTimer = null;
    let infoBoxPaused = false;
    let infoBoxTimeLeft = 10;
    let infoBoxOnClose = null; // Callback to call when infobox is dismissed

    function showInfoBox(success, companyName, plateText, searchPattern, onDismiss, onClose) {
        const existing = $('#pm-info-box');
        if (existing) {
            // If there's an existing infobox, call its onClose callback before removing
            if (infoBoxOnClose) {
                infoBoxOnClose();
                infoBoxOnClose = null;
            }
            existing.remove();
        }

        const box = document.createElement('div');
        box.id = 'pm-info-box';
        box.className = `pm-info-box ${success ? 'pm-info-success' : 'pm-info-error'}`;

        const message = success
            ? `Added company ${escapeHtml(companyName)} to ${escapeHtml(plateText)} successfully.`
            : `${escapeHtml(companyName)} wasn't added to the last upload because ${escapeHtml(searchPattern)} hasn't been found in the recently uploaded plates.`;

        const dismissButton = success ? '' : `
            <button class="pm-info-dismiss" id="pm-info-dismiss">Don't try adding this company to this plate anymore</button>
        `;

        box.innerHTML = `
            <div class="pm-info-content">
                <span class="pm-info-message">${message}</span>
                <div class="pm-info-controls">
                    <span class="pm-info-timer" id="pm-info-timer" title="Click to pause">10</span>
                    <span class="pm-info-close" id="pm-info-close" title="Dismiss">×</span>
                </div>
            </div>
            ${dismissButton}
        `;

        document.body.appendChild(box);

        const timerEl = $('#pm-info-timer');
        const closeEl = $('#pm-info-close');
        const dismissBtn = $('#pm-info-dismiss');

        infoBoxTimeLeft = 10;
        infoBoxPaused = false;
        infoBoxOnClose = onClose || null; // Store the onClose callback

        const dismissInfoBox = () => {
            if (infoBoxTimer) {
                clearInterval(infoBoxTimer);
                infoBoxTimer = null;
            }
            box.remove();
            // Call onClose callback when infobox is dismissed
            if (infoBoxOnClose) {
                infoBoxOnClose();
                infoBoxOnClose = null;
            }
        };

        const updateTimer = () => {
            if (!infoBoxPaused && infoBoxTimeLeft > 0) {
                timerEl.textContent = infoBoxTimeLeft;
                infoBoxTimeLeft--;
            }
        };

        timerEl.addEventListener('mouseenter', () => {
            timerEl.textContent = '⏸';
            timerEl.style.cursor = 'pointer';
        });

        timerEl.addEventListener('mouseleave', () => {
            if (!infoBoxPaused) {
                timerEl.textContent = infoBoxTimeLeft;
            }
        });

        timerEl.addEventListener('click', () => {
            infoBoxPaused = !infoBoxPaused;
            if (infoBoxPaused) {
                timerEl.textContent = '⏸';
            } else {
                timerEl.textContent = infoBoxTimeLeft;
            }
        });

        closeEl.addEventListener('click', dismissInfoBox);

        if (dismissBtn && onDismiss) {
            dismissBtn.addEventListener('click', () => {
                onDismiss();
                if (infoBoxTimer) {
                    clearInterval(infoBoxTimer);
                    infoBoxTimer = null;
                }
                box.innerHTML = `
                    <div class="pm-info-content">
                        <span class="pm-info-message">Successfully dismissed.</span>
                        <div class="pm-info-controls">
                            <span class="pm-info-close" id="pm-info-close-2" title="Dismiss">×</span>
                        </div>
                    </div>
                `;
                $('#pm-info-close-2')?.addEventListener('click', dismissInfoBox);
                setTimeout(dismissInfoBox, 2000);
            });
        }

        infoBoxTimer = setInterval(() => {
            updateTimer();
            if (infoBoxTimeLeft < 0 || (!infoBoxPaused && infoBoxTimeLeft === 0)) {
                dismissInfoBox();
            }
        }, 1000);
    }

    function renderMessages(messages = null, isError = false) {
        // Messages are now only shown in the info box, not in the form
        // This function is kept for compatibility but does nothing
        return;
    }

    async function maybeFinalizeQueue() {
        let q = readQueue();
        console.log('[PM Helper] maybeFinalizeQueue called. Queue length:', q.length, 'URL:', window.location.href);
        console.log('[PM Helper] Full queue:', JSON.stringify(q, null, 2));
        if (!q.length) return;
        let successCount = 0;
        let lastProcessedItem = null;

        for (let i = 0; i < q.length; i++) {
            const item = q[i];
            console.log('[PM Helper] Processing queue item', i + 1, 'of', q.length, ':', {
                composed: item.plate?.composed,
                searchPattern: item.plate?.searchPattern,
                company: item.company?.text,
                status: item.status
            });
            if (!item || item.status === 'applied') {
                console.log('[PM Helper]   Skipping: no item or already applied');
                continue;
            }
            const plateDisplay = item.plate?.composed || ''; const companyId = item.company?.value || '';
            if (!plateDisplay || !companyId) {
                console.log('[PM Helper]   Skipping: missing plateDisplay or companyId');
                continue;
            }

            // Check if this combination is dismissed
            if (isDismissed(plateDisplay, companyId)) {
                console.log('[PM Helper]   Skipping: dismissed');
                item.status = 'dismissed';
                continue;
            }

            lastProcessedItem = item;
            const searchPattern = item.plate?.searchPattern || normalizePlate(plateDisplay);
            console.log('[PM Helper]   Searching for pattern:', searchPattern, 'plateDisplay:', plateDisplay);
            const found = findLastBarMatchFlexible(searchPattern, plateDisplay);

            if (!found?.id || !found?.param) {
                console.log('[PM Helper]   No match found for pattern:', searchPattern);
                item.status='error';
                item.error=`Could not find uploaded post for plate "${plateDisplay}".`;
                const companyName = item.company?.text || 'Unknown company';
                const displayPattern = searchPattern.includes('*') ? searchPattern : searchPattern.split('').join('*');
                console.log('[PM Helper]   Showing error infobox for:', companyName, 'pattern:', displayPattern);
                showInfoBox(false, companyName, '', displayPattern, () => {
                    addDismissed(plateDisplay, companyId);
                }, () => {
                    // Remove only this item from queue after infobox is dismissed
                    const updatedQ = readQueue().filter(it => !(it.plate?.composed === plateDisplay && it.company?.value === companyId));
                    writeQueue(updatedQ);
                    console.log('[PM Helper]   Item removed from queue, processing next item...');
                    // Process next item in queue if any
                    setTimeout(() => maybeFinalizeQueue(), 100);
                });
                // Stop processing - wait for user to interact with infobox
                break;
            }
            console.log('[PM Helper]   Match found! id:', found.id, 'plate:', found.foundPlate);
            try {
                await postCompanyToItem(found.id, found.param, companyId);
                successCount++;
                const companyName = item.company?.text || 'Unknown company';
                const foundPlate = found.foundPlate || plateDisplay;
                showInfoBox(true, companyName, foundPlate, '', null, () => {
                    // Remove only this item from queue after infobox is dismissed
                    const updatedQ = readQueue().filter(it => !(it.plate?.composed === plateDisplay && it.company?.value === companyId));
                    writeQueue(updatedQ);
                    // Process next item in queue if any
                    setTimeout(() => maybeFinalizeQueue(), 100);
                });
                // Stop processing - wait for infobox to be dismissed
                break;
            } catch (e) {
                console.error('[PM Helper] posting company failed:', e);
                item.status='error';
                item.error=`Failed to set company for plate "${plateDisplay}" (network/admin error).`;
                const companyName = item.company?.text || 'Unknown company';
                const displayPattern = searchPattern.includes('*') ? searchPattern : searchPattern.split('').join('*');
                showInfoBox(false, companyName, '', displayPattern, () => {
                    addDismissed(plateDisplay, companyId);
                }, () => {
                    // Remove only this item from queue after infobox is dismissed
                    const updatedQ = readQueue().filter(it => !(it.plate?.composed === plateDisplay && it.company?.value === companyId));
                    writeQueue(updatedQ);
                    // Process next item in queue if any
                    setTimeout(() => maybeFinalizeQueue(), 100);
                });
                // Stop processing - wait for user to interact with infobox
                break;
            }
        }
        // If we processed items but didn't show infobox (dismissed items), clean up
        if (successCount === 0 && q.every(it => it.status === 'dismissed' || !it.plate?.composed || !it.company?.value)) {
            writeQueue([]);
        }
    }

    /* GALLERY PAGE FUNCTIONALITY */
    function isGalleryPage() {
        const path = window.location.pathname;
        return /\/gallery/.test(path);
    }

    function extractPanelInfo(panelHeading) {
        const form = panelHeading.querySelector('form[method="post"]');
        if (!form) return null;
        
        const idInput = form.querySelector('input[name="id"]');
        const paramInput = form.querySelector('input[name="param"]');
        
        if (!idInput || !paramInput) return null;
        
        const id = idInput.value;
        const param = paramInput.value;
        
        // Try to extract country code from param (e.g., "/de/gallery" -> "de")
        let countryMatch = param.match(/\/([a-z]{2})\//);
        let country = countryMatch ? countryMatch[1] : '';
        
        // If not found in param, try to extract from the link in panel heading
        if (!country) {
            const link = panelHeading.querySelector('a[href*="/gallery"]');
            if (link) {
                const href = link.getAttribute('href') || '';
                countryMatch = href.match(/\/([a-z]{2})\//);
                country = countryMatch ? countryMatch[1] : '';
            }
        }
        
        // If still not found, try to extract from current URL path
        if (!country) {
            const pathMatch = window.location.pathname.match(/\/([a-z]{2})\//);
            country = pathMatch ? pathMatch[1] : '';
        }
        
        return { id, param, country };
    }

    function createCompanyButton(id, country) {
        const button = document.createElement('button');
        button.className = 'btn-u btn-u-green btn-u-xs pull-right';
        button.type = 'button';
        button.style.marginLeft = '6px';
        button.innerHTML = '<i data-toggle="tooltip" class="fa fa-truck tooltips" data-original-title="Transport companies"></i>';
        button.title = 'Transport companies';
        button.dataset.pmId = id;
        button.dataset.pmCountry = country;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showCompanyPopup(id, country, button);
        });
        
        return button;
    }

    function addCompanyButtonsToGallery() {
        if (!isGalleryPage()) return;
        
        const panelHeadings = $$('.panel-heading');
        
        panelHeadings.forEach(panelHeading => {
            // Check if button already exists
            if (panelHeading.querySelector('.pm-company-btn')) return;
            
            const info = extractPanelInfo(panelHeading);
            if (!info || !info.id) return;
            
            const vcenterDiv = panelHeading.querySelector('.col-xs-6.vcenter:last-child');
            if (!vcenterDiv) return;
            
            const button = createCompanyButton(info.id, info.country);
            button.classList.add('pm-company-btn');
            vcenterDiv.insertBefore(button, vcenterDiv.firstChild);
        });
    }

    let currentPopup = null;

    function showCompanyPopup(id, country, buttonElement) {
        // Close existing popup if any
        if (currentPopup) {
            closeCompanyPopup();
        }
        
        // Construct param: /{country}/nomer{id} if country exists, otherwise /nomer{id}
        const param = country ? `/${country}/nomer${id}` : `/nomer${id}`;
        const url = `https://platesmania.com/admin/company_edit.php?id=${encodeURIComponent(id)}&param=${encodeURIComponent(param)}`;
        
        // Create popup structure
        const popover = document.createElement('div');
        popover.className = 'popover editable-container editable-popup fade top in';
        popover.id = `pm-company-popover-${Date.now()}`;
        popover.style.display = 'block';
        popover.style.position = 'absolute';
        popover.style.zIndex = '10000';
        
        popover.innerHTML = `
            <div class="arrow" style="left: 50%;"></div>
            <h3 class="popover-title">
                edit
                <button type="button" class="close pm-popup-close" aria-label="Close" style="margin-top: -2px;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </h3>
            <div class="popover-content">
                <div class="editableform-loading" style="display: block; text-align: center; padding: 20px;">
                    Loading...
                </div>
            </div>
        `;
        
        document.body.appendChild(popover);
        currentPopup = popover;
        
        // Position popup near the button
        if (buttonElement) {
            const rect = buttonElement.getBoundingClientRect();
            const popoverWidth = 500; // Approximate width
            let left = rect.left + window.scrollX - (popoverWidth / 2) + (rect.width / 2);
            
            // Ensure popup doesn't go off screen
            if (left < 10) left = 10;
            if (left + popoverWidth > window.innerWidth - 10) {
                left = window.innerWidth - popoverWidth - 10;
            }
            
            popover.style.top = `${rect.bottom + window.scrollY + 10}px`;
            popover.style.left = `${left}px`;
        } else {
            // Center on screen as fallback
            popover.style.top = `${window.innerHeight / 2 + window.scrollY}px`;
            popover.style.left = `${window.innerWidth / 2 + window.scrollX}px`;
            popover.style.transform = 'translate(-50%, -50%)';
        }
        
        // Close button handler
        popover.querySelector('.pm-popup-close')?.addEventListener('click', () => {
            closeCompanyPopup();
        });
        
        // Load content
        loadCompanyEditContent(url, popover, id, country);
        
        // Close on outside click
        setTimeout(() => {
            const closeHandler = function(e) {
                if (!popover.contains(e.target) && !e.target.closest('.pm-company-btn')) {
                    closeCompanyPopup();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    async function loadCompanyEditContent(url, popover, id, country) {
        const contentDiv = popover.querySelector('.popover-content');
        const loadingDiv = popover.querySelector('.editableform-loading');
        
        try {
            const res = await gmRequest({
                method: 'GET',
                url: url,
                headers: { 'Accept': 'text/html,application/xhtml+xml' },
                timeout: 20000
            });
            
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}`);
            }
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(res.responseText, 'text/html');
            
            // Extract the col-md-7 div and the row div with alert
            const colMd7 = doc.querySelector('.col-md-7');
            const rowWithAlert = doc.querySelector('.row .col-md-6 .alert');
            const rowParent = rowWithAlert?.closest('.row');
            
            let filteredContent = '';
            
            if (colMd7) {
                // Check if rowParent is already inside colMd7 by checking if it's a descendant
                let rowParentInsideColMd7 = false;
                if (rowParent && colMd7.contains(rowParent)) {
                    rowParentInsideColMd7 = true;
                }
                
                filteredContent += colMd7.outerHTML;
                
                // Only add rowParent separately if it's not already inside colMd7
                if (rowParent && !rowParentInsideColMd7) {
                    filteredContent += rowParent.outerHTML;
                }
            } else if (rowParent) {
                // If colMd7 doesn't exist, just use rowParent
                filteredContent += rowParent.outerHTML;
            }
            
            if (!filteredContent) {
                throw new Error('Required content elements not found');
            }
            
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            
            // Create form wrapper
            const formWrapper = document.createElement('div');
            formWrapper.innerHTML = filteredContent;
            
            // Extract and inject scripts from the original page to initialize the form
            const scripts = doc.querySelectorAll('script');
            const scriptPromises = [];
            scripts.forEach(script => {
                if (script.src) {
                    // External script - load it
                    const newScript = document.createElement('script');
                    newScript.src = script.src;
                    scriptPromises.push(new Promise((resolve) => {
                        newScript.onload = resolve;
                        newScript.onerror = resolve; // Continue even if script fails
                        document.head.appendChild(newScript);
                    }));
                } else if (script.textContent && script.textContent.trim()) {
                    // Inline script - execute it after DOM is ready
                    const scriptContent = script.textContent;
                    scriptPromises.push(new Promise((resolve) => {
                        setTimeout(() => {
                            try {
                                // Execute in a way that preserves the original context
                                const executeScript = new Function(scriptContent);
                                executeScript();
                            } catch (e) {
                                console.warn('[PM Helper] Script execution warning:', e);
                            }
                            resolve();
                        }, 50);
                    }));
                }
            });
            
            // Wait for scripts to load, then set up form handlers
            Promise.all(scriptPromises).then(() => {
                // Initialize custom search (in case original scripts don't work in popup context)
                // Use a small delay to ensure DOM is ready
                setTimeout(() => {
                    initializePopupSearch(formWrapper);
                }, 100);
                
                // Handle form submission - intercept to prevent navigation
                const forms = formWrapper.querySelectorAll('form');
                forms.forEach(form => {
                    // Set form action to the full URL
                    form.setAttribute('action', url);
                    form.setAttribute('method', 'POST');
                    
                    // Intercept form submission to prevent navigation
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[PM Helper] Form submit intercepted');
                        
                        // Get form data (this will include markaavto if JS set it)
                        const formData = new FormData(form);
                        const body = new URLSearchParams();
                        for (const [key, value] of formData.entries()) {
                            body.append(key, value);
                        }
                        
                        console.log('[PM Helper] Submitting form data:', body.toString());
                        
                        // Submit via GM_xmlhttpRequest
                        const loadingDiv = popover.querySelector('.editableform-loading');
                        const contentDiv = popover.querySelector('.popover-content');
                        if (loadingDiv) {
                            loadingDiv.style.display = 'block';
                        }
                        if (contentDiv) {
                            contentDiv.style.opacity = '0.5';
                        }
                        
                        try {
                            const submitRes = await gmRequest({
                                method: 'POST',
                                url: url,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Accept': 'text/html,application/xhtml+xml'
                                },
                                data: body.toString(),
                                timeout: 20000
                            });
                            
                            // Check for redirect
                            if (submitRes.status >= 300 && submitRes.status < 400 || 
                                submitRes.responseText.includes('window.location') || 
                                submitRes.responseText.includes('location.href')) {
                                closeCompanyPopup();
                                return;
                            }
                            
                            // Reload content
                            await loadCompanyEditContent(url, popover, id, country);
                        } catch (err) {
                            console.error('[PM Helper] Form submission failed:', err);
                            if (loadingDiv) {
                                loadingDiv.style.display = 'none';
                            }
                            if (contentDiv) {
                                contentDiv.style.opacity = '1';
                            }
                            alert('Failed to save. Please try again.');
                        }
                    });
                });
            });
            
            // Handle delete buttons
            const deleteButtons = formWrapper.querySelectorAll('a[href*="delete=1"]');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const deleteUrl = btn.getAttribute('href');
                    if (deleteUrl && confirm('Are you sure you want to delete this connection?')) {
                        await handleCompanyDelete(deleteUrl, popover);
                    }
                });
            });
            
            contentDiv.innerHTML = '';
            contentDiv.appendChild(formWrapper);
            
        } catch (e) {
            console.error('[PM Helper] Failed to load company edit content:', e);
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load company information. Please try again.
                </div>
            `;
        }
    }

    function initializePopupSearch(container) {
        const select = container.querySelector('select[name="markaavto"]');
        const searchInput = container.querySelector('#markamodtype');
        const searchWrapper = searchInput?.closest('.ui-widget');
        
        if (!select || !searchInput || !searchWrapper) {
            console.warn('[PM Helper] Search elements not found in popup');
            return;
        }
        
        // Ensure search input has proper attributes
        searchInput.setAttribute('autocomplete', 'off');
        if (!searchInput.classList.contains('ui-autocomplete-input')) {
            searchInput.classList.add('ui-autocomplete-input');
        }
        
        // Create autocomplete list similar to /add page
        const list = document.createElement('ul');
        list.className = 'pm-ac-list';
        list.id = `pm-ac-list-popup-${Date.now()}`;
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-label', 'Companies');
        list.style.cssText = 'display:none; position:absolute; left:0; right:0; z-index:9999; background:#fff; border:1px solid #ccc; max-height:260px; overflow:auto; margin:2px 0 0; padding:0; list-style:none';
        
        // Make search wrapper position relative for absolute positioning of list
        searchWrapper.style.position = 'relative';
        
        searchWrapper.appendChild(list);
        
        // Build autocomplete array from select options
        const autocomplarr = [...select.options].map(o => ({ 
            label: (o.textContent || '').trim(), 
            value: (o.value || '') + ',' 
        }));
        autocomplarr.push({ label: '000 Номерной знак без ТС', value: '297,' });
        
        const accentMap = {
            "á": "a", "à": "a", "ä": "a", "ã": "a", "ö": "o", "ó": "o", "ò": "o", "ô": "o",
            "ü": "u", "ú": "u", "ù": "u", "é": "e", "è": "e", "í": "i", "ž": "z", "ñ": "n",
            "š": "s", "Š": "S", "ş": "s", "ğ": "g", "ç": "c", "і": "i", "ё": "e", "Ẽ": "E",
            "(": " ", ")": " ", "-": " ", "/": " ", "\u00AB": " ", "\u00BB": " "
        };
        const normalize = (term) => term.split('').map(ch => accentMap[ch] || ch).join('');
        
        let activeIndex = -1;
        const closeList = () => { 
            list.innerHTML = ''; 
            list.style.display = 'none'; 
            activeIndex = -1; 
        };
        const openList = () => { 
            list.style.display = list.children.length ? 'block' : 'none'; 
        };
        const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const matchItems = (term) => {
            term = term.trim();
            if (term.length < 2) return [];
            const parts = term.split(/\s+/);
            let sr = '';
            parts.forEach(v => { 
                sr += '(?:^|\\s)' + escapeReg(v) + '.*'; 
            });
            const re = new RegExp(sr, 'ig');
            const out = [];
            for (const it of autocomplarr) {
                const v = it.label || it.value || '';
                if (re.test(v) || re.test(normalize(v))) {
                    out.push(it);
                    if (out.length >= 50) break;
                }
            }
            return out;
        };
        
        const renderItems = (items) => {
            list.innerHTML = '';
            items.slice(0, 20).forEach(it => {
                const li = document.createElement('li');
                li.setAttribute('role', 'option');
                li.tabIndex = -1;
                li.className = 'pm-ac-item';
                li.style.cssText = 'padding:6px 8px; cursor:pointer';
                li.textContent = it.label;
                li.dataset.value = it.value;
                li.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    selectFromItem(it);
                });
                list.appendChild(li);
            });
            activeIndex = -1;
            openList();
        };
        
        const selectFromItem = (item) => {
            const id = item.value.split(',')[0];
            if ([...select.options].some(o => o.value === id)) {
                select.value = id;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
            searchInput.value = item.label;
            closeList();
        };
        
        const moveActive = (dir) => {
            const items = [...list.children];
            if (!items.length) return;
            activeIndex = (activeIndex + dir + items.length) % items.length;
            items.forEach((li, i) => {
                if (i === activeIndex) {
                    li.style.background = '#eee';
                    li.classList.add('active');
                } else {
                    li.style.background = '';
                    li.classList.remove('active');
                }
            });
            items[activeIndex]?.scrollIntoView({ block: 'nearest' });
        };
        
        const onInput = debounce(() => renderItems(matchItems(searchInput.value)), 80);
        searchInput.addEventListener('input', onInput);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveActive(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveActive(-1);
            } else if (e.key === 'Enter') {
                if (list.style.display === 'block' && activeIndex >= 0) {
                    e.preventDefault();
                    const li = list.children[activeIndex];
                    if (li) {
                        selectFromItem({ label: li.textContent, value: li.dataset.value });
                    }
                }
            } else if (e.key === 'Escape') {
                closeList();
            }
        });
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                renderItems(matchItems(searchInput.value));
            }
        });
        
        // Close list when clicking outside
        const closeOnOutside = (e) => {
            if (!searchWrapper.contains(e.target)) {
                closeList();
            }
        };
        document.addEventListener('click', closeOnOutside);
        
        // Handle clear button (X span)
        const clearBtn = searchWrapper.querySelector('span[onclick*="markamodtype"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                searchInput.value = '';
                closeList();
                searchInput.focus();
            });
        }
        
        // Update search input when select changes
        select.addEventListener('change', () => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption && selectedOption.value) {
                searchInput.value = selectedOption.textContent.trim();
            } else {
                searchInput.value = '';
            }
        });
    }

    async function handleCompanyFormSubmit(form, originalUrl, popover) {
        const contentDiv = popover.querySelector('.popover-content');
        const loadingDiv = popover.querySelector('.editableform-loading');
        
        loadingDiv.style.display = 'block';
        contentDiv.style.opacity = '0.5';
        
        try {
            const formData = new FormData(form);
            const body = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                body.append(key, value);
            }
            
            // Debug: log form data
            console.log('[PM Helper] Submitting form data:', body.toString());
            
            const res = await gmRequest({
                method: 'POST',
                url: originalUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml'
                },
                data: body.toString(),
                timeout: 20000
            });
            
            // Check if response is a redirect (status 302, 301, or HTML with redirect)
            if (res.status >= 300 && res.status < 400) {
                // Redirect detected, close popup
                closeCompanyPopup();
                return;
            }
            
            // Check if response HTML indicates a redirect
            if (res.responseText.includes('window.location') || 
                res.responseText.includes('location.href') ||
                res.responseText.includes('Location:')) {
                closeCompanyPopup();
                return;
            }
            
            // Otherwise, reload the content
            const urlMatch = originalUrl.match(/id=([^&]+)/);
            const paramMatch = originalUrl.match(/param=([^&]+)/);
            if (urlMatch && paramMatch) {
                const id = decodeURIComponent(urlMatch[1]);
                const param = decodeURIComponent(paramMatch[1]);
                const countryMatch = param.match(/\/([a-z]{2})\//);
                const country = countryMatch ? countryMatch[1] : '';
                await loadCompanyEditContent(originalUrl, popover, id, country);
            }
            
        } catch (e) {
            console.error('[PM Helper] Failed to submit company form:', e);
            loadingDiv.style.display = 'none';
            contentDiv.style.opacity = '1';
            alert('Failed to save. Please try again.');
        }
    }

    async function handleCompanyDelete(deleteUrl, popover) {
        const loadingDiv = popover.querySelector('.editableform-loading');
        const contentDiv = popover.querySelector('.popover-content');
        loadingDiv.style.display = 'block';
        contentDiv.style.opacity = '0.5';
        
        try {
            // Normalize URL
            let fullUrl = deleteUrl;
            if (deleteUrl.startsWith('http://') || deleteUrl.startsWith('https://')) {
                fullUrl = deleteUrl;
            } else if (deleteUrl.startsWith('/')) {
                fullUrl = `https://platesmania.com${deleteUrl}`;
            } else {
                fullUrl = `https://platesmania.com/admin/${deleteUrl}`;
            }
            
            const res = await gmRequest({
                method: 'GET',
                url: fullUrl,
                headers: { 'Accept': 'text/html,application/xhtml+xml' },
                timeout: 20000
            });
            
            // Check for redirect
            if (res.status >= 300 && res.status < 400 || 
                res.responseText.includes('window.location') || 
                res.responseText.includes('location.href')) {
                closeCompanyPopup();
                return;
            }
            
            // Reload the popup content - extract from current popup or deleteUrl
            const urlMatch = deleteUrl.match(/id=([^&]+)/);
            const paramMatch = deleteUrl.match(/param=([^&]+)/);
            if (urlMatch && paramMatch) {
                const id = decodeURIComponent(urlMatch[1]);
                const param = decodeURIComponent(paramMatch[1]);
                const countryMatch = param.match(/\/([a-z]{2})\//);
                const country = countryMatch ? countryMatch[1] : '';
                const originalUrl = `https://platesmania.com/admin/company_edit.php?id=${id}&param=${encodeURIComponent(param)}`;
                await loadCompanyEditContent(originalUrl, popover, id, country);
            } else {
                // Try to reload from the original URL stored in popover
                loadingDiv.style.display = 'none';
                contentDiv.style.opacity = '1';
            }
            
        } catch (e) {
            console.error('[PM Helper] Failed to delete company connection:', e);
            loadingDiv.style.display = 'none';
            contentDiv.style.opacity = '1';
            alert('Failed to delete. Please try again.');
        }
    }

    function closeCompanyPopup() {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
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
    #pm-info-box{position:fixed; bottom:20px; right:20px; z-index:10000; min-width:300px; max-width:500px; box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:8px; overflow:hidden; animation:slideIn 0.3s ease-out}
    @keyframes slideIn{from{transform:translateX(100%); opacity:0} to{transform:translateX(0); opacity:1}}
    .pm-info-box.pm-info-success{background:#d4edda; border:2px solid #28a745; color:#155724}
    .pm-info-box.pm-info-error{background:#f8d7da; border:2px solid #dc3545; color:#721c24}
    .pm-info-content{padding:12px 16px; display:flex; justify-content:space-between; align-items:center; gap:12px}
    .pm-info-message{flex:1; font-size:14px; line-height:1.4}
    .pm-info-controls{display:flex; align-items:center; gap:8px; flex-shrink:0}
    .pm-info-timer{font-weight:bold; font-size:14px; min-width:20px; text-align:center; cursor:pointer; user-select:none}
    .pm-info-close{font-size:20px; font-weight:bold; cursor:pointer; user-select:none; opacity:0.7; line-height:1}
    .pm-info-close:hover{opacity:1}
    .pm-info-dismiss{display:block; width:100%; padding:8px 12px; margin-top:8px; background:rgba(0,0,0,0.1); border:none; border-top:1px solid rgba(0,0,0,0.1); cursor:pointer; font-size:12px; color:inherit; text-align:center; transition:background 0.2s}
    .pm-info-dismiss:hover{background:rgba(0,0,0,0.15)}
    .popover.editable-container.editable-popup{min-width:400px; max-width:600px}
    .popover .popover-title{display:flex; justify-content:space-between; align-items:center}
    .popover .pm-popup-close{background:none; border:none; font-size:21px; font-weight:bold; opacity:0.5; cursor:pointer; padding:0; margin:0; line-height:1}
    .popover .pm-popup-close:hover{opacity:1}
    .popover .popover-content{max-height:500px; overflow-y:auto}
    .popover .ui-widget{position:relative}
    .popover .pm-ac-list{display:none; position:absolute; left:0; right:0; z-index:9999; background:#fff; border:1px solid #ccc; max-height:260px; overflow:auto; margin:2px 0 0; padding:0; list-style:none}
    .popover .pm-ac-item{padding:6px 8px; cursor:pointer}
    .popover .pm-ac-item:hover,.popover .pm-ac-item.active{background:#eee}
  `);

    (function init() {
        // Handle /add pages
        if (!isGalleryPage()) {
            const ui = injectUI();
            if (ui) {
                const loadBtn = $('#pm-load-companies');
                if (loadBtn) {
                    loadBtn.addEventListener('click', () => {
                        clearSelectedCompany();
                        loadAndRenderCompanySelector();
                    });
                }
            }

            // Clear selected company when upload button is clicked
            const uploadBtn = $('section.col-xs-6 button[type="submit"].btn-u, button[type="submit"].btn-u');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', () => {
                    clearSelectedCompany();
                });
            }

            // Also watch for form submission and any submit buttons
            const form = $('form');
            if (form) {
                form.addEventListener('submit', () => {
                    clearSelectedCompany();
                });
            }

            // Watch for dynamically added upload buttons
            const observer = new MutationObserver(() => {
                const uploadBtn = $('section.col-xs-6 button[type="submit"].btn-u, button[type="submit"].btn-u');
                if (uploadBtn && !uploadBtn.dataset.pmHelperWatched) {
                    uploadBtn.dataset.pmHelperWatched = '1';
                    uploadBtn.addEventListener('click', () => {
                        clearSelectedCompany();
                    });
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            startLiveCapture();
            maybeFinalizeQueue();
        } else {
            // Handle gallery pages
            addCompanyButtonsToGallery();
            
            // Watch for dynamically added gallery items
            const galleryObserver = new MutationObserver(() => {
                addCompanyButtonsToGallery();
            });
            galleryObserver.observe(document.body, { childList: true, subtree: true });
        }
    })();

})();
