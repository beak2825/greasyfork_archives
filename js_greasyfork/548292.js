// ==UserScript==
// @name         Linkedin Company Insights
// @namespace    yanxi-tools
// @version      1.5
// @description  Show Blind company review score (headline) and Levels.fyi SWE (US) per-level average total compensation on LinkedIn jobs/company pages.
// @author       your-name
// @match        https://www.linkedin.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      teamblind.com
// @connect      www.teamblind.com
// @connect      levels.fyi
// @connect      www.levels.fyi
// @run-at       document-end
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548292/Linkedin%20Company%20Insights.user.js
// @updateURL https://update.greasyfork.org/scripts/548292/Linkedin%20Company%20Insights.meta.js
// ==/UserScript==

(function () {
  const TAG = '[LI-Insights]';
  const log  = (...a)=>console.log(TAG, ...a);
  const warn = (...a)=>console.warn(TAG, ...a);
  const err  = (...a)=>console.error(TAG, ...a);

  // ---------- Styles ----------
  GM_addStyle(`
    #lii-panel{position:fixed;z-index:2147483647;background:#fff;border:1px solid #e3e3e3;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);font:13px system-ui;min-width:250px;max-width:600px;width:380px;min-height:200px;max-height:600px;height:300px;display:flex;flex-direction:column;resize:both;overflow:hidden}
    #lii-panel.collapsed{height:auto!important;min-height:auto;resize:none}
    #lii-panel.collapsed #lii-bd{display:none}
    #lii-panel.dragging{opacity:0.8}
    #lii-hd{padding:10px 12px;border-bottom:1px solid #eee;font-weight:700;display:flex;justify-content:space-between;align-items:center;cursor:move;background:#fafbff;flex-shrink:0;user-select:none}
    #lii-hd:hover{background:#f0f5ff}
    #lii-panel.collapsed #lii-hd{border-bottom:none}
    #lii-bd{padding:10px 12px;overflow-y:auto;flex:1;user-select:text}
    #lii-meta{color:#666;font-size:12px;margin-top:6px;user-select:text}
    .pill{background:#f3f7fe;border-radius:999px;padding:2px 8px;font-weight:600;user-select:text}
    .row{display:flex;justify-content:space-between;align-items:center;margin:4px 0;gap:8px}
    .link{color:#0a66c2;text-decoration:none}
    table.lii{width:100%;border-collapse:collapse;margin-top:6px}
    table.lii th, table.lii td{padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:left;user-select:text}
    table.lii th{font-weight:600;background:#fafbff}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}
    #lii-toggle{cursor:pointer;font-size:12px;margin-left:8px;user-select:none}
    #lii-toggle:hover{color:#0a66c2}
    #lii-resize-handle{position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:nw-resize;background:linear-gradient(-45deg,transparent 30%,#ccc 30%,#ccc 35%,transparent 35%,transparent 45%,#ccc 45%,#ccc 50%,transparent 50%);border-radius:0 0 12px 0}
    #lii-panel.collapsed #lii-resize-handle{display:none}
  `);

  // ---------- Panel State Persistence ----------
  const STORAGE_KEY = 'lii-panel-state';
  
  function savePanelState() {
    const panel = document.getElementById('lii-panel');
    if (!panel) return;
    
    const state = {
      position: {},
      size: {
        width: panel.offsetWidth,
        height: panel.offsetHeight
      },
      collapsed: panel.classList.contains('collapsed')
    };
    
    // Save position based on current style
    if (panel.style.left && panel.style.top) {
      state.position = {
        left: parseInt(panel.style.left),
        top: parseInt(panel.style.top)
      };
    } else {
      // Default bottom-right position
      state.position = { right: 16, bottom: 16 };
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      log('Panel state saved:', state);
    } catch (e) {
      warn('Failed to save panel state:', e);
    }
  }
  
  function loadPanelState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const state = JSON.parse(saved);
      
      // Validate saved position is within viewport
      if (state.position.left !== undefined && state.position.top !== undefined) {
        const maxX = window.innerWidth - (state.size.width || 250);
        const maxY = window.innerHeight - (state.size.height || 200);
        
        if (state.position.left < 0 || state.position.left > maxX ||
            state.position.top < 0 || state.position.top > maxY) {
          log('Saved position is off-screen, using default');
          return null;
        }
      }
      
      log('Panel state loaded:', state);
      return state;
    } catch (e) {
      warn('Failed to load panel state:', e);
      return null;
    }
  }

  // ---------- Panel ----------
  function ensurePanel(){
    let p = document.querySelector('#lii-panel');
    if (p) return p;

    // Load saved state
    const savedState = loadPanelState();

    p = document.createElement('div');
    p.id = 'lii-panel';

    const hd = document.createElement('div');
    hd.id = 'lii-hd';

    const hspan = document.createElement('span');
    hspan.textContent = 'Company insights';

    const toggle = document.createElement('span');
    toggle.id = 'lii-toggle';
    toggle.textContent = '−';
    toggle.title = 'Collapse/Expand panel';

    hd.appendChild(hspan);
    hd.appendChild(toggle);

    const bd = document.createElement('div');
    bd.id = 'lii-bd';
    bd.innerHTML = `
      <div class="row"><span>Company</span><span id="lii-company" class="pill">—</span></div>
      <div class="row"><span>Blind (reviews)</span><span id="lii-blind-meta">loading…</span></div>
      <div class="row"><span>Levels.fyi (SWE · US)</span><span id="lii-levels-meta">loading…</span></div>
      <table id="lii-levels-table" class="lii" style="display:none">
        <thead><tr><th>Level</th><th>Avg Total</th></tr></thead>
        <tbody id="lii-levels-body"></tbody>
      </table>
      <div id="lii-meta" class="meta">idle…</div>
    `;

    p.appendChild(hd);
    p.appendChild(bd);
    document.body.appendChild(p);

    // Apply saved state or defaults
    if (savedState) {
      // Apply saved size
      if (savedState.size.width) p.style.width = savedState.size.width + 'px';
      if (savedState.size.height) p.style.height = savedState.size.height + 'px';
      
      // Apply saved position
      if (savedState.position.left !== undefined && savedState.position.top !== undefined) {
        p.style.left = savedState.position.left + 'px';
        p.style.top = savedState.position.top + 'px';
        p.style.right = 'auto';
        p.style.bottom = 'auto';
      } else {
        // Default position
        p.style.right = '16px';
        p.style.bottom = '16px';
      }
      
      // Apply saved collapsed state
      if (savedState.collapsed) {
        p.classList.add('collapsed');
        toggle.textContent = '+';
      }
    } else {
      // Default position for first time users
      p.style.right = '16px';
      p.style.bottom = '16px';
    }

    // Toggle functionality
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      p.classList.toggle('collapsed');
      toggle.textContent = p.classList.contains('collapsed') ? '+' : '−';
      savePanelState(); // Save state when toggling
    });

    // Drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    hd.addEventListener('mousedown', (e) => {
      if (e.target === toggle) return;
      isDragging = true;
      p.classList.add('dragging');
      const rect = p.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      p.style.left = Math.max(0, Math.min(window.innerWidth - p.offsetWidth, x)) + 'px';
      p.style.top = Math.max(0, Math.min(window.innerHeight - p.offsetHeight, y)) + 'px';
      p.style.right = 'auto';
      p.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        p.classList.remove('dragging');
        savePanelState(); // Save state when dragging ends
      }
    });

    // ResizeObserver to save state when panel is resized
    if (window.ResizeObserver) {
      let resizeTimeout;
      const resizeObserver = new ResizeObserver(() => {
        // Debounce resize saves to avoid excessive localStorage writes
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          savePanelState();
        }, 300); // Wait 300ms after resize ends
      });
      resizeObserver.observe(p);
    }

    return p;
  }
  ensurePanel();

  const $ = (id)=>document.getElementById(id);
  const setHTML = (id, html)=>{ const el=$(id); if (el) el.innerHTML=html; };

  // ---------- Company Name Mapping ----------
  const COMPANY_MAPPINGS = {
    // LinkedIn name -> { blind: 'blind name', levels: 'levels name' }
    // Verified mappings:
    'square': { blind: 'block', levels: 'block' },
    'meta': { blind: 'meta', levels: 'facebook' },
    'alphabet': { blind: 'google', levels: 'google' },
    'x': { blind: 'x', levels: 'twitter' },
    'paypal': { blind: 'paypal', levels: 'paypal' },
    // Add more mappings as needed
  };

  function getCompanyName(originalName, platform) {
    const normalized = originalName.toLowerCase().trim();
    const mapping = COMPANY_MAPPINGS[normalized];
    
    if (mapping && mapping[platform]) {
      log(`Company mapping: ${originalName} -> ${mapping[platform]} (${platform})`);
      return mapping[platform];
    }
    
    return originalName;
  }

  // ---------- Utils ----------
  function sanitize(name){
    return name.replace(/\(.*?\)/g,'')
      .replace(/,?\s+(Inc\.?|LLC|Ltd\.?|PLC|S\.?A\.?|GmbH|AG|Co\.?|Holdings?|Corp\.?)\b/ig,'')
      .replace(/[®™]/g,'')
      .trim();
  }
  function fmtUSD(n){ return n==null ? 'n/a' : ('$'+Math.round(n).toLocaleString()); }

  // ---------- Company detect (jobs + company pages) ----------
  function getCompany(){
    const sels = [
      '[data-test="company-name"]',
      '.job-details-jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__company-name a',
      'a.topcard__org-name-link',
      'h4 a[href*="/company/"]',
      '.job-card-container__company-name a',
      '.job-card-container__company-name',
      'h1.org-top-card-summary__title',
      'h1[data-test-id="org-about-company-name"]',
    ];
    for (const sel of sels){
      const el = document.querySelector(sel);
      const txt = el && el.textContent && el.textContent.trim();
      if (txt){ log('selector hit:', sel, '→', txt); return sanitize(txt); }
    }
    if (location.pathname.startsWith('/company/')){
      const slug = location.pathname.split('/').filter(Boolean)[1];
      if (slug) return sanitize(slug.replace(/-/g,' '));
    }
    return '';
  }

  // ---------- HTTP ----------
  function gmFetch(url){
    log('HTTP GET →', url);
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url, timeout:20000, headers:{'Accept':'*/*'},
        onload:r=>{ log('HTTP DONE ←', url, 'status=', r.status, 'len=', (r.responseText||'').length); resolve(r); },
        onerror:e=>{ err('HTTP ERROR ←', url, e); reject(e); },
        ontimeout:()=>{ err('HTTP TIMEOUT ←', url); reject(new Error('timeout')); }
      });
    });
  }

  // ---------- Parsers ----------
  function extractAnyJSON(html) {
    // __NEXT_DATA__ first
    let m = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>(.+?)<\/script>/is);
    if (m) { try { return JSON.parse(m[1]); } catch {} }

    // Any <script type="application/json">
    const all = [...html.matchAll(/<script[^>]*type="application\/json"[^>]*>(.+?)<\/script>/gis)];
    for (const s of all) {
      try {
        const j = JSON.parse(s[1]);
        const txt = JSON.stringify(j).toLowerCase();
        if (txt.includes('rating') && txt.includes('review')) return j;
      } catch {}
    }
    return null;
  }
  const extractNextData = extractAnyJSON;

  function numbersFrom(v){
    if (typeof v==='number') return v;
    if (typeof v==='string'){ const n=parseFloat(v.replace(/[^\d.]/g,'')); return isNaN(n)?null:n; }
    return null;
  }

  // ---------- Blind: headline rating + review count ----------
  function isRSCStream(body){
    // Next.js RSC flight responses look like "1:I[...]" chunks
    return /^[0-9]+:/.test(body) && body.includes("I[");
  }

  async function fetchHTML(url){
    const res = await gmFetch(url);
    const text = res.responseText || '';
    if (isRSCStream(text)) throw new Error("RSC stream (skip)");
    return text;
  }

  function slugifyCompany(name){
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  // Pull overall rating + review count from visible text or LD+JSON
  function parseRatingFromHTML(html){
    // 1) Visible pattern like "4.2 ★ (616)"
    let m =
      html.match(/([0-5](?:\.\d)?)\s*[★⭐]\s*\(([\d,]+)\)/i) ||
      html.match(/Average\s*rating[^0-9]*([0-5](?:\.\d)?)[^()]*\(([\d,]+)\s*reviews?\)/i);
    if (m){
      const rating  = parseFloat(m[1]);
      const reviews = parseInt(m[2].replace(/,/g,''), 10);
      if (Number.isFinite(rating) && Number.isFinite(reviews)) return { rating, reviews };
    }

    // 2) LD+JSON AggregateRating (SEO block)
    const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const s of ld){
      try{
        const j = JSON.parse(s[1]);
        const arr = Array.isArray(j) ? j : [j];
        for (const o of arr){
          const agg = o && (o.aggregateRating || (o['@type']==='EmployerAggregateRating' ? o : null));
          if (agg){
            const rating  = parseFloat(String(agg.ratingValue ?? agg.rating ?? agg.score));
            const reviews = parseInt(String(agg.reviewCount ?? agg.ratingCount ?? agg.count).replace(/,/g,''), 10);
            if (Number.isFinite(rating) && Number.isFinite(reviews)) return { rating, reviews };
          }
        }
      }catch{}
    }

    // 3) Generic <script> JSON hunt (EmployerAggregateRating / ratingValue / reviewCount)
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1] || '');
    for (const block of scripts){
      if (!/rating(?:Value)?|review(?:s|Count)|EmployerAggregateRating/i.test(block)) continue;

      const candidates = block.match(/\{[\s\S]*?\}/g) || [];
      for (const cand of candidates){
        try{
          const obj = JSON.parse(cand);
          const agg = obj?.aggregateRating || obj?.EmployerAggregateRating || obj;
          const val = agg?.ratingValue ?? agg?.rating ?? agg?.score;
          const cnt = agg?.reviewCount ?? agg?.ratingCount ?? agg?.count;
          const rating  = val != null ? parseFloat(String(val)) : NaN;
          const reviews = cnt != null ? parseInt(String(cnt).replace(/,/g,''),10) : NaN;
          if (Number.isFinite(rating) && Number.isFinite(reviews) && rating>0 && rating<=5) {
            return { rating, reviews };
          }
        } catch {}
      }

      // Regex fallback
      const r2 = block.match(/"ratingValue"\s*:\s*"?(?<rv>[0-5](?:\.\d)?)"?/i);
      const c2 = block.match(/"(?:reviewCount|ratingCount|count)"\s*:\s*"?(?<rc>[\d,]+)"?/i);
      if (r2 && c2){
        const rating  = parseFloat(r2.groups.rv);
        const reviews = parseInt(c2.groups.rc.replace(/,/g,''),10);
        if (Number.isFinite(rating) && Number.isFinite(reviews)) return { rating, reviews };
      }
    }

    return { rating: null, reviews: null };
  }

  async function resolveCompanySlug(name){
    const q = encodeURIComponent(name);
    const html = await fetchHTML(`https://www.teamblind.com/search?query=${q}`);
    const m = html.match(/\/company\/([a-z0-9-]+)"/i);
    return m ? m[1] : null;
  }

  async function fetchBlind(companyName){
    const mappedName = getCompanyName(companyName, 'blind');
    const candidates = (slug) => [
      `https://www.teamblind.com/company/${slug}`,
      `https://www.teamblind.com/company/${slug}/posts`,
      `https://www.teamblind.com/company/${slug}/jobs`,
    ];

    let slug = slugifyCompany(mappedName);

    // Try guessed slug
    for (const url of candidates(slug)){
      try{
        const html = await fetchHTML(url);
        const { rating, reviews } = parseRatingFromHTML(html);
        if (rating != null || reviews != null){
          return {
            company: companyName,
            url: `https://www.teamblind.com/company/${slug}/reviews`,
            overall: rating != null ? rating.toFixed(1) : null,
            count: reviews != null ? String(reviews) : null,
          };
        }
      }catch{}
    }

    // Resolve via search, retry
    const resolved = await resolveCompanySlug(mappedName);
    if (resolved && resolved !== slug){
      slug = resolved;
      for (const url of candidates(slug)){
        try{
          const html = await fetchHTML(url);
          const { rating, reviews } = parseRatingFromHTML(html);
          if (rating != null || reviews != null){
            return {
              company: companyName,
              url: `https://www.teamblind.com/company/${slug}/reviews`,
              overall: rating != null ? rating.toFixed(1) : null,
              count: reviews != null ? String(reviews) : null,
            };
          }
        }catch{}
      }
    }

    return null;
  }

  // ---------- Levels.fyi: per-level Avg Total (SWE US) ----------
  function levelsSlugs(company){
    const core=company.trim();
    return [
      core.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-'),
      core.toLowerCase().replace(/[^\w]/g,''),
      core.replace(/[^\w]/g,''),
    ];
  }

  function digLevelsPerLevel(next){
    const rows=[];
    const stack=[next];
    const seen = new Map(); // level -> max total
    while(stack.length){
      const node = stack.pop();
      if (!node) continue;
      if (Array.isArray(node)){ for (const it of node) stack.push(it); continue; }
      if (typeof node!=='object') continue;

      const levelName = node.levelName ?? node.level ?? node.title ?? node.name ?? node.level_label;
      const total = numbersFrom(
        node.avgTotalComp ?? node.averageTotalComp ?? node.averageCompTotal ??
        node.totalCompAverage ?? node.totalCompAvg ?? node.totalCompensation?.average ??
        node.totalYearlyCompensation ?? node.totalComp ?? node.total
      );
      const looksLevel = typeof levelName==='string';
      if (looksLevel && total!=null && total>20000){
        const key = levelName.trim();
        const prev = seen.get(key);
        if (!prev || total>prev){ seen.set(key,total); }
      }
      for (const k in node) if (node[k] && typeof node[k]==='object') stack.push(node[k]);
    }
    for (const [level, total] of seen.entries()) rows.push({level, total});
    rows.sort((a,b)=>{
      const la = Number((a.level.match(/^L(\d+)/i)||[])[1]);
      const lb = Number((b.level.match(/^L(\d+)/i)||[])[1]);
      return (isNaN(la)||isNaN(lb)) ? a.level.localeCompare(b.level) : la - lb;
    });
    return rows;
  }

  async function fetchLevelsPerLevel(company){
    const mappedName = getCompanyName(company, 'levels');
    const base='https://www.levels.fyi/companies';
    for (const slug of levelsSlugs(mappedName)){
      const url = `${base}/${encodeURIComponent(slug)}/salaries/software-engineer?country=254`;
      try{
        const res = await gmFetch(url);
        const html = res.responseText || '';
        const next = extractNextData(html);
        if (!next) continue;
        const rows = digLevelsPerLevel(next);
        if (rows.length) return { url, rows };
      }catch(e){ warn('Levels fetch error for', slug, e); }
    }
    return null;
  }

  // ---------- Render ----------
  function renderBlind(data){
    const meta = $('lii-blind-meta');
    if (!data){
      meta.innerHTML = `n/a (no match / login?) · <a class="link" target="_blank" href="https://www.teamblind.com/company">Open</a>`;
      return;
    }
    const cnt = data.count ? Number(data.count).toLocaleString() : '?';
    const star = data.overall ? `${data.overall} ⭐` : '—';
    meta.innerHTML = `${star} (${cnt}) · <a class="link" target="_blank" href="${data.url}">Open</a>`;
  }

  function renderLevels(data){
    const meta = $('lii-levels-meta'), tbl=$('lii-levels-table'), body=$('lii-levels-body');
    if (!data){
      meta.textContent = 'n/a (no rows)';
      tbl.style.display='none'; body.innerHTML=''; return;
    }
    meta.innerHTML = `<a class="link" target="_blank" href="${data.url}">Open</a> · ${data.rows.length} levels`;
    tbl.style.display=''; body.innerHTML = data.rows.map(r=>(
      `<tr><td>${r.level}</td><td class="mono">${fmtUSD(r.total)}</td></tr>`
    )).join('');
  }

  // ---------- Loop ----------
  let lastCompany='';
  async function refresh(){
    const path = location.pathname;
    if (!(path.startsWith('/jobs') || path.startsWith('/company/'))) return;

    const company = getCompany();
    if (!company){ setHTML('lii-meta','no company detected'); return; }
    if (company === lastCompany) return;
    lastCompany = company;

    ensurePanel();
    setHTML('lii-company', company);
    setHTML('lii-blind-meta', 'loading…');
    setHTML('lii-levels-meta', 'loading…');
    $('lii-levels-table').style.display='none'; $('lii-levels-body').innerHTML='';
    setHTML('lii-meta', new Date().toLocaleTimeString() + ' · fetching…');

    try{
      const [blind, levels] = await Promise.all([
        fetchBlind(company),
        fetchLevelsPerLevel(company),
      ]);
      renderBlind(blind);
      renderLevels(levels);
      setHTML('lii-meta', new Date().toLocaleTimeString() + ' · done');
    }catch(e){
      err('refresh error', e);
      setHTML('lii-meta','error — see console');
    }
  }

  const obs = new MutationObserver(()=>refresh());
  document.addEventListener('DOMContentLoaded', ()=>{
    obs.observe(document.body, {subtree:true, childList:true});
    refresh();
  });
  setInterval(refresh, 2500);
})();
