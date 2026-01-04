// ==UserScript==
// @name         iFood Filtro Flutuante Avançado (FORÇADO) — v3.6
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Filtros avançados (preço mín/máx, nota, palavras) e ordenação. Filtra itens dentro das lojas; usa fallback por data-min-price quando os itens ainda não carregaram.
// @author       ChatGPT
// @match        https://www.ifood.com.br/busca*
// @match        https://www.ifood.com.br/lista-restaurantes*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ifood.com.br
// @downloadURL https://update.greasyfork.org/scripts/552373/iFood%20Filtro%20Flutuante%20Avan%C3%A7ado%20%28FOR%C3%87ADO%29%20%E2%80%94%20v36.user.js
// @updateURL https://update.greasyfork.org/scripts/552373/iFood%20Filtro%20Flutuante%20Avan%C3%A7ado%20%28FOR%C3%87ADO%29%20%E2%80%94%20v36.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    #ifood-filters-popup {
      position: fixed; top: 96px; right: 20px; width: 300px;
      background:#fff; border:1px solid #e6e6e6; border-radius:10px;
      box-shadow:0 10px 30px rgba(0,0,0,.15);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, "iFood RC Text", sans-serif;
      z-index: 2147483647; user-select: none;
    }
    #ifood-filters-popup.minimized .ifp-body { display: none; }
    #ifood-filters-popup .ifp-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 12px; background:#f7f7f7; border-bottom:1px solid #eee; cursor:move; border-radius:10px 10px 0 0;
    }
    #ifood-filters-popup .ifp-title { font-size:14px; font-weight:700; color:#333; }
    #ifood-filters-popup .ifp-actions { display:flex; gap:8px; }
    #ifood-filters-popup .ifp-btn {
      border:none; background:#fff; border:1px solid #ddd; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;
    }
    #ifood-filters-popup .ifp-btn:hover { background:#f0f0f0; }
    #ifood-filters-popup .ifp-body { padding:12px; display:flex; flex-direction:column; gap:10px; }
    #ifood-filters-popup .ifp-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
    #ifood-filters-popup .ifp-group { border:1px dashed #eee; border-radius:8px; padding:8px; display:flex; flex-direction:column; gap:8px; }
    #ifood-filters-popup .ifp-group legend { font-size:12px; font-weight:700; padding:0 6px; color:#333; }
    #ifood-filters-popup input[type="number"], #ifood-filters-popup select { width:120px; padding:6px 8px; border:1px solid #ccc; border-radius:6px; font-size:13px; }
    #ifood-filters-popup input[type="text"] { width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:6px; font-size:13px; }
    #ifood-filters-popup .ifp-footnote { font-size:11px; color:#777; margin-top:-6px; }
    #ifood-filters-popup .ifp-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:6px; }
    #ifood-filters-popup .ifp-count { font-size:12px; color:#666; }
    #ifood-filters-popup .ifp-apply { background:#e60014; color:#fff; border:none; padding:8px 10px; border-radius:8px; font-weight:700; cursor:pointer; }
    #ifood-filters-popup .ifp-apply:hover { filter:brightness(0.95); }
    #ifood-filters-popup .ifp-reset { background:#fff; color:#333; border:1px solid #bbb; padding:8px 10px; border-radius:8px; cursor:pointer; }
    .ifp-badge { margin-left:8px; padding:2px 6px; border-radius:6px; background:#ffeaea; color:#e60014; font-size:11px; font-weight:700; }
    #ifood-filters-popup.minimized::after {
      content:"Filtros iFood"; position:absolute; left:-8px; top:50%; transform:translate(-100%, -50%);
      background:#e60014; color:#fff; padding:6px 10px; border-radius:8px; font-size:12px; box-shadow:0 6px 18px rgba(0,0,0,.2); cursor:pointer;
    }
  `);

  const LS_KEY = 'ifood_filters_v36';
  const state = {
    minPriceEnabled: false, minPrice: '',
    maxPriceEnabled: false, maxPrice: '',
    minRatingEnabled: false, minRating: '',
    incAll: '', incAny: '', exc: '',
    kwInStore: true, kwInItems: true,
    sortBy: 'default',
    minimized: false, applyScheduled: false,
  };

  function saveState(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch{} }
  function loadState(){ try{ Object.assign(state, JSON.parse(localStorage.getItem(LS_KEY)||'{}')); }catch{} }

  function parseBRL(text){
    if (text===undefined||text===null) return NaN;
    const only = String(text).replace(/[^\d,.-]/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'');
    const norm = only.replace(',', '.');
    const v = parseFloat(norm);
    return isNaN(v)?NaN:v;
  }
  function normText(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim(); }
  function parseWords(s){ return normText(s).split(/[;,]+/).map(t=>t.trim()).filter(Boolean); }
  const matchAll=(t,a)=>a.length?a.every(w=>t.includes(w)):true;
  const matchAny=(t,a)=>a.length?a.some(w=>t.includes(w)):true;
  const matchNone=(t,a)=>a.length?a.every(w=>!t.includes(w)):true;
  const debounce=(fn,ms)=>{ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args),ms); }; };

  function getRestaurantArticles(){ return Array.from(document.querySelectorAll('article.merchant-list-carousel')); }
  function getRestaurantRating(article){
    const el = article.querySelector('.cardstack-rating'); if (!el) return NaN;
    const v = parseFloat(el.textContent.replace(',', '.')); return isNaN(v)?NaN:v;
  }
  function setVisible(article, v){
    article.style.display = v? '':'none';
    const li = article.closest('li'); if (li) li.style.display = v? '':'none';
  }
  function findListContainer(){
    let c = document.querySelector('ul.merchant-list-with-item-carousel, ul.merchant-list-v2');
    if (c) return c;
    const first = document.querySelector('article.merchant-list-carousel'); if (!first) return null;
    let p = first.parentElement;
    while (p && p.querySelectorAll(':scope > article.merchant-list-carousel').length < 2) p = p.parentElement;
    return p || first.parentElement;
  }
  function getItemPriceFromNode(root){
    const priceEl = root.querySelector('.card-stack-item-price--promotion, .card-stack-item-price--regular');
    return parseBRL(priceEl?.textContent || '');
  }
  function getItemTitleFromNode(root){ return root.querySelector('.merchant-list-carousel__item-title')?.textContent || ''; }

  // Fallback legado: menor preço (promo/regular) ou data-min-price do <article>
  function getMinRestaurantPrice(article){
    let min = Infinity;
    article.querySelectorAll('.merchant-list-carousel__item-footer .card-stack-item-price--promotion').forEach(el=>{
      const v=parseBRL(el.textContent); if(!isNaN(v)&&v<min) min=v;
    });
    article.querySelectorAll('.merchant-list-carousel__item-footer .card-stack-item-price--regular').forEach(el=>{
      const v=parseBRL(el.textContent); if(!isNaN(v)&&v<min) min=v;
    });
    if (!isFinite(min)) {
      const ds = parseFloat(article.getAttribute('data-min-price')||'NaN');
      if (!isNaN(ds)) min = ds;
    }
    return min;
  }

  function updateFilteredBadge(article, minShown, vis, total){
    const header = article.querySelector('.merchant-list-carousel__merchant-header'); if (!header) return;
    let badge = header.querySelector('.ifp-badge');
    if (!vis || !total) { if (badge) badge.remove(); return; }
    if (!badge){ badge=document.createElement('span'); badge.className='ifp-badge'; header.appendChild(badge); }
    const pricePart = isFinite(minShown) ? `R$ ${String(minShown.toFixed(2)).replace('.', ',')}` : '—';
    badge.textContent = `${pricePart} • ${vis}/${total}`;
  }

  function filterItemsWithinArticle(article, criteria){
    const slides = article.querySelectorAll('.merchant-list-carousel__items .swiper-slide');
    const total = slides.length;
    let minVisible = Infinity, visibleCount = 0;

    const itemFilteringActive = criteria.priceActive || (criteria.keywordsActive && criteria.kwInItems);

    slides.forEach(slide=>{
      const price = getItemPriceFromNode(slide);
      const title = normText(getItemTitleFromNode(slide));
      let ok = true;

      if (criteria.priceActive) {
        ok = ok && isFinite(price) && price >= criteria.minPrice && price <= criteria.maxPrice;
      }
      if (criteria.keywordsActive && criteria.kwInItems) {
        ok = ok &&
          matchAll(title, criteria.incAll) &&
          matchAny(title, criteria.incAny) &&
          matchNone(title, criteria.exc);
      }

      if (itemFilteringActive) slide.style.display = ok ? '' : 'none';

      if (!itemFilteringActive || ok) {
        if (isFinite(price) && price < minVisible) minVisible = price;
        visibleCount++;
      }
    });

    // badge com base no que foi realmente avaliado
    updateFilteredBadge(article, minVisible, itemFilteringActive ? visibleCount : total, total);
    setTimeout(()=>window.dispatchEvent(new Event('resize')),0);

    return { minVisible: isFinite(minVisible)?minVisible:Infinity, visibleCount: itemFilteringActive?visibleCount:total, total };
  }

  let root, els={};
  function buildPopup(){
    if (document.getElementById('ifood-filters-popup')) return;
    const html = `
      <div id="ifood-filters-popup" class="${state.minimized ? 'minimized' : ''}">
        <div class="ifp-header" id="ifp-drag">
          <div class="ifp-title">Filtros Avançados</div>
          <div class="ifp-actions">
            <button class="ifp-btn" id="ifp-min">${state.minimized ? 'Expandir' : 'Minimizar'}</button>
            <button class="ifp-btn" id="ifp-close" title="Ocultar painel">×</button>
          </div>
        </div>

        <div class="ifp-body">
          <fieldset class="ifp-group">
            <legend>Preço</legend>
            <div class="ifp-row">
              <label><input type="checkbox" id="ifp-minPriceEnabled"> Preço mín.</label>
              <input type="number" id="ifp-minPrice" step="0.5" placeholder="5,00">
            </div>
            <div class="ifp-row">
              <label><input type="checkbox" id="ifp-maxPriceEnabled"> Preço máx.</label>
              <input type="number" id="ifp-maxPrice" step="0.5" placeholder="25,00">
            </div>
          </fieldset>

          <fieldset class="ifp-group">
            <legend>Nota</legend>
            <div class="ifp-row">
              <label><input type="checkbox" id="ifp-minRatingEnabled"> Nota mín.</label>
              <input type="number" id="ifp-minRating" step="0.1" min="0" max="5" placeholder="4.5">
            </div>
          </fieldset>

          <fieldset class="ifp-group">
            <legend>Palavras-chave</legend>
            <div>
              <label style="display:block; margin-bottom:4px;">Conter (todas)</label>
              <input type="text" id="ifp-incAll" placeholder="ex.: hot dog, bacon">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px;">Conter (qualquer)</label>
              <input type="text" id="ifp-incAny" placeholder="ex.: combo, promoção">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px;">Não conter</label>
              <input type="text" id="ifp-exc" placeholder="ex.: vegano, doce">
            </div>
            <div class="ifp-row" style="justify-content:flex-start; gap:16px;">
              <label><input type="checkbox" id="ifp-kwStore"> Nome da loja</label>
              <label><input type="checkbox" id="ifp-kwItems"> Itens</label>
            </div>
            <div class="ifp-footnote">Separe por vírgula/“;”. Ignora acentos/maiúsculas.</div>
          </fieldset>

          <div class="ifp-row">
            <label for="ifp-sort">Ordenar</label>
            <select id="ifp-sort">
              <option value="default">Padrão iFood</option>
              <option value="price_asc">Preço (menor)</option>
              <option value="rating_desc">Nota (maior)</option>
            </select>
          </div>

          <div class="ifp-footer">
            <span class="ifp-count" id="ifp-count">—</span>
            <div style="display:flex; gap:8px;">
              <button class="ifp-reset" id="ifp-reset">Limpar</button>
              <button class="ifp-apply" id="ifp-apply">Aplicar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    root = document.getElementById('ifood-filters-popup');

    els = {
      minBtn: document.getElementById('ifp-min'),
      closeBtn: document.getElementById('ifp-close'),
      minPriceEn: document.getElementById('ifp-minPriceEnabled'),
      minPriceVal: document.getElementById('ifp-minPrice'),
      maxPriceEn: document.getElementById('ifp-maxPriceEnabled'),
      maxPriceVal: document.getElementById('ifp-maxPrice'),
      minEn: document.getElementById('ifp-minRatingEnabled'),
      minVal: document.getElementById('ifp-minRating'),
      incAll: document.getElementById('ifp-incAll'),
      incAny: document.getElementById('ifp-incAny'),
      exc: document.getElementById('ifp-exc'),
      kwStore: document.getElementById('ifp-kwStore'),
      kwItems: document.getElementById('ifp-kwItems'),
      sort: document.getElementById('ifp-sort'),
      count: document.getElementById('ifp-count'),
      apply: document.getElementById('ifp-apply'),
      reset: document.getElementById('ifp-reset'),
      drag: document.getElementById('ifp-drag'),
    };

    // estado -> UI
    els.minPriceEn.checked = !!state.minPriceEnabled; els.minPriceVal.value = state.minPrice ?? '';
    els.maxPriceEn.checked = !!state.maxPriceEnabled; els.maxPriceVal.value = state.maxPrice ?? '';
    els.minEn.checked = !!state.minRatingEnabled; els.minVal.value = state.minRating ?? '';
    els.incAll.value = state.incAll ?? ''; els.incAny.value = state.incAny ?? ''; els.exc.value = state.exc ?? '';
    els.kwStore.checked = state.kwInStore ?? true; els.kwItems.checked = state.kwInItems ?? true;
    els.sort.value = state.sortBy ?? 'default';

    const debApply = debounce(scheduleApplyNow, 250);

    // auto-liga/desliga checkboxes ao digitar valor (fix)
    const autoToggle = (checkbox, input) => {
      const v = String(input.value||'').trim();
      const has = v !== '';
      if (checkbox.checked !== has) checkbox.checked = has;
    };

    ['input','change'].forEach(evt=>{
      [els.minPriceVal, els.maxPriceVal, els.minVal, els.incAll, els.incAny, els.exc, els.sort].forEach(el=>{
        el.addEventListener(evt, (e)=>{
          if (e.target===els.minPriceVal){ autoToggle(els.minPriceEn, els.minPriceVal); }
          if (e.target===els.maxPriceVal){ autoToggle(els.maxPriceEn, els.maxPriceVal); }
          debApply();
        });
      });
    });
    [els.kwStore, els.kwItems].forEach(el=> el.addEventListener('change', debApply));

    els.minPriceEn.addEventListener('change', ()=>{ state.minPriceEnabled = els.minPriceEn.checked; saveState(); scheduleApplyNow(); });
    els.maxPriceEn.addEventListener('change', ()=>{ state.maxPriceEnabled = els.maxPriceEn.checked; saveState(); scheduleApplyNow(); });
    els.minEn.addEventListener('change', ()=>{ state.minRatingEnabled = els.minEn.checked; saveState(); scheduleApplyNow(); });
    els.apply.addEventListener('click', ()=> scheduleApplyNow(true));

    els.reset.addEventListener('click', ()=>{
      state.minPriceEnabled=false; state.minPrice='';
      state.maxPriceEnabled=false; state.maxPrice='';
      state.minRatingEnabled=false; state.minRating='';
      state.incAll=''; state.incAny=''; state.exc='';
      state.kwInStore=true; state.kwInItems=true;
      state.sortBy='default';
      els.minPriceEn.checked=false; els.minPriceVal.value='';
      els.maxPriceEn.checked=false; els.maxPriceVal.value='';
      els.minEn.checked=false; els.minVal.value='';
      els.incAll.value=''; els.incAny.value=''; els.exc.value='';
      els.kwStore.checked=true; els.kwItems.checked=true;
      els.sort.value='default';
      saveState();
      getRestaurantArticles().forEach(a=>{ setVisible(a,true); a.querySelectorAll('.merchant-list-carousel__items .swiper-slide').forEach(s=>s.style.display=''); updateFilteredBadge(a,null,0,0); });
      els.count.textContent = formatCount();
    });

    // minimizar/fechar + drag
    els.minBtn.addEventListener('click', ()=>{ state.minimized=!state.minimized; saveState(); root.classList.toggle('minimized', state.minimized); els.minBtn.textContent = state.minimized?'Expandir':'Minimizar'; });
    root.addEventListener('click', ()=>{ if(root.classList.contains('minimized')){ root.classList.remove('minimized'); state.minimized=false; saveState(); }});
    els.closeBtn.addEventListener('click', ()=> root.remove());
    makeDraggable(root, els.drag);
  }

  function makeDraggable(box, handle){
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    const onDown = (e)=>{ dragging=true; sx=(e.touches?e.touches[0].clientX:e.clientX); sy=(e.touches?e.touches[0].clientY:e.clientY); const r=box.getBoundingClientRect(); ox=r.left; oy=r.top;
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false}); document.addEventListener('touchend', onUp); };
    const onMove = (e)=>{ if(!dragging) return; const cx=(e.touches?e.touches[0].clientX:e.clientX), cy=(e.touches?e.touches[0].clientY:e.clientY); const dx=cx-sx, dy=cy-sy;
      box.style.left = `${Math.max(8, ox+dx)}px`; box.style.top = `${Math.max(8, oy+dy)}px`; box.style.right='auto'; e.preventDefault?.(); };
    const onUp = ()=>{ dragging=false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp); };
    handle.addEventListener('mousedown', onDown); handle.addEventListener('touchstart', onDown, {passive:true});
  }

  function formatCount(){
    const all = getRestaurantArticles();
    const total = all.length;
    const visible = all.filter(a=> a.style.display!=='none' && (a.closest('li')? a.closest('li').style.display!=='none': true)).length;
    return `${visible} / ${total} visíveis`;
  }

  function applyFiltersAndSort(){
    domObserver?.disconnect();

    if (!root) buildPopup();
    if (!els.sort) { startDomObserver(); return; }

    // UI -> estado
    state.minPriceEnabled = !!els.minPriceEn.checked;
    state.maxPriceEnabled = !!els.maxPriceEn.checked;
    state.minPrice = els.minPriceVal.value;
    state.maxPrice = els.maxPriceVal.value;
    state.minRatingEnabled = !!els.minEn.checked;
    state.minRating = els.minVal.value;
    state.incAll = els.incAll.value; state.incAny = els.incAny.value; state.exc = els.exc.value;
    state.kwInStore = !!els.kwStore.checked; state.kwInItems = !!els.kwItems.checked;
    state.sortBy = els.sort.value;
    saveState();

    // preços
    const priceActive = (state.minPriceEnabled && state.minPrice !== '') || (state.maxPriceEnabled && state.maxPrice !== '');
    const minPrice = state.minPriceEnabled && state.minPrice!=='' ? parseFloat(String(state.minPrice).replace(',', '.')) : -Infinity;
    const maxPrice = state.maxPriceEnabled && state.maxPrice!=='' ? parseFloat(String(state.maxPrice).replace(',', '.')) : Infinity;

    // nota
    const useRating = state.minRatingEnabled && state.minRating !== '';
    const minRating = useRating ? parseFloat(String(state.minRating).replace(',', '.')) : -Infinity;

    // palavras
    const incAll = parseWords(state.incAll);
    const incAny = parseWords(state.incAny);
    const exc = parseWords(state.exc);
    const keywordsActive = !!(incAll.length || incAny.length || exc.length);

    const articles = getRestaurantArticles();

    articles.forEach(article=>{
      const storeTitle = normText(article.querySelector('.merchant-list-carousel__merchant-title')?.innerText || '');

      // 1) Palavras no nome da loja
      let storeMatches = true;
      if (keywordsActive && state.kwInStore) {
        storeMatches = matchAll(storeTitle, incAll) && matchAny(storeTitle, incAny) && matchNone(storeTitle, exc);
      }

      // 2) Itens (preço/palavras em itens)
      const res = filterItemsWithinArticle(article, {
        priceActive, minPrice, maxPrice,
        keywordsActive, kwInItems: state.kwInItems,
        incAll, incAny, exc
      });

      // 2.1) Fallback quando ainda não há slides carregados
      let minForSort = res.minVisible;
      let itemsLeft = res.visibleCount;

      if (res.total === 0) {
        const fbMin = getMinRestaurantPrice(article);
        if (priceActive) {
          const inRange = isFinite(fbMin) && fbMin >= minPrice && fbMin <= maxPrice;
          itemsLeft = inRange ? 1 : 0;
        }
        if (isFinite(fbMin)) minForSort = Math.min(minForSort, fbMin);
        // atualiza badge com fallback também
        updateFilteredBadge(article, minForSort, itemsLeft, res.total /* 0 */);
      }

      // 3) Nota
      const rating = getRestaurantRating(article);
      const ratingOk = useRating && !isNaN(rating) ? (rating >= minRating) : true;

      // 4) Regra final da loja
      let keep = true;
      if (keywordsActive) {
        const itemsOk = state.kwInItems ? (itemsLeft > 0) : false;
        keep = (state.kwInStore ? storeMatches : false) || itemsOk;
      }
      if (priceActive && itemsLeft === 0) keep = false;
      if (!ratingOk) keep = false;

      setVisible(article, keep);

      // 5) dados p/ ordenação
      if (isFinite(minForSort)) article.dataset.minPrice = String(minForSort);
      if (!isNaN(rating)) article.dataset.rating = String(rating);
    });

    // Ordenação
    if (state.sortBy !== 'default') {
      const container = findListContainer();
      if (container) {
        const group = Array.from(container.querySelectorAll('article.merchant-list-carousel'));
        const visibles = group.filter(a=>a.style.display!=='none');
        visibles.sort((a,b)=>{
          if (state.sortBy==='price_asc') {
            const pa = parseFloat(a.dataset.minPrice || 'Infinity');
            const pb = parseFloat(b.dataset.minPrice || 'Infinity');
            return pa - pb;
          }
          if (state.sortBy==='rating_desc') {
            const ra = parseFloat(a.dataset.rating || '-Infinity');
            const rb = parseFloat(b.dataset.rating || '-Infinity');
            return rb - ra;
          }
          return 0;
        });
        const frag = document.createDocumentFragment();
        visibles.forEach(a=>{ const li=a.closest('li'); frag.appendChild(li||a); });
        const target = (visibles[0]?.closest('li')?.parentElement) || container;
        if (target) target.appendChild(frag);
      }
    }

    if (els.count) els.count.textContent = formatCount();
    startDomObserver();
  }

  function scheduleApplyNow(){
    if (state.applyScheduled) return;
    state.applyScheduled = true;
    requestAnimationFrame(()=>{ state.applyScheduled=false; applyFiltersAndSort(); });
  }

  let domObserver;
  function startDomObserver(){
    if (domObserver) domObserver.disconnect();
    const main = document.querySelector('main') || document.body; if (!main) return;
    domObserver = new MutationObserver((mutList)=>{
      for (const m of mutList) {
        if (m.type==='childList') {
          if ([...m.addedNodes].some(n => (n.nodeType===1) && (n.matches?.('article.merchant-list-carousel') || n.querySelector?.('article.merchant-list-carousel')))) {
            scheduleApplyNow(); break;
          }
        } else if (m.type==='attributes') {
          if (m.target && (m.target.matches?.('ul, [role="list"]'))) { scheduleApplyNow(); break; }
        }
      }
    });
    domObserver.observe(main, { childList:true, subtree:true, attributes:true });
  }

  function hookHistory(){
    const push=history.pushState, rep=history.replaceState;
    const wrap=(fn)=>function(){ const r=fn.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return r; };
    history.pushState = wrap(push); history.replaceState = wrap(rep);
    window.addEventListener('popstate', ()=> window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', initOrRefresh);
  }

  function initOrRefresh(){
    waitFor(()=> document.querySelector('article.merchant-list-carousel'), 12000).then(()=>{
      loadState(); buildPopup(); startDomObserver(); scheduleApplyNow();
    }).catch(()=>{});
  }

  function waitFor(testFn, timeout=8000, interval=200){
    return new Promise((res, rej)=>{
      const t0=performance.now();
      const it=setInterval(()=>{
        if (testFn()) { clearInterval(it); res(true); }
        else if (performance.now()-t0>timeout) { clearInterval(it); rej(new Error('timeout')); }
      }, interval);
    });
  }

  hookHistory();
  initOrRefresh();
})();
