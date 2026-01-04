// ==UserScript==
// @name         Overseas Online Activity Filter (Desktop + TORN-PDA)
// @namespace    https://www.torn.com/
// @version      2.14
// @description  Fetch last_action via API on demand, filter by inactivity.
// @author       SuperGogu
// @match        https://www.torn.com/index.php?page=people*
// @run-at       document-end
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549877/Overseas%20Online%20Activity%20Filter%20%28Desktop%20%2B%20TORN-PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549877/Overseas%20Online%20Activity%20Filter%20%28Desktop%20%2B%20TORN-PDA%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- LOG ----------
  function L(){ var a = Array.prototype.slice.call(arguments); a.unshift('[OOAF]'); try{ console.log.apply(console, a); }catch(e){} }

  // ---------- ENV ----------
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent) ||
                  Math.min(window.innerWidth, window.innerHeight) <= 820;

  // ---------- SELECTORS ----------
  var SELECTORS = IS_MOBILE ? {
    rootList: [
      '.travel-people.revive-people > ul.users-list.icons.cont-gray.bottom-round.m-bottom10',
      '.travel-people.revive-people ul.users-list',
      'ul.users-list.icons.cont-gray.bottom-round.m-bottom10',
      'ul.users-list'
    ],
    row: ':scope > li',
    nameLink: 'a.user.name[href*="/profiles.php?XID="]',
    levelWrap: 'span.level'
  } : {
    rootList: [
      'ul.users-list.icons.cont-gray.bottom-round.m-bottom10',
      'ul.users-list.icons.cont-gray.bottom-round',
      'ul.users-list.icons',
      'ul.users-list'
    ],
    row: ':scope > li',
    nameLink: 'a[href*="/profiles.php?XID="]',
    levelWrap: '.level, .level-wrap, span.level'
  };

  // ---------- CONST ----------
  var LS_KEY = 'ooaf_settings_v10';
  var CLASS_BADGE = 'ooaf-lastaction-badge';
  var CLASS_META  = 'ooaf-meta';
  var FETCH_DELAY_MS_DEFAULT = 1000;
  var MAX_RETRIES = 3;
  var RATE_LIMIT_PAUSE_MS = 65000;

  // ---------- CSS (simplu) ----------
  GM_addStyle(
    '.ooaf-badge-status{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.10)}' +
    '.ooaf-badge-status.fresh{background:rgba(0,200,0,.20)}' +
    '.ooaf-badge-status.stale{background:rgba(200,200,0,.20)}' +
    '.ooaf-badge-status.unknown{background:rgba(200,0,0,.20)}'
  );

  GM_addStyle(
    '.ooaf-panel{position:fixed;z-index:2147483647;top:'+ (IS_MOBILE?'12px':'80px') +';left:'+ (IS_MOBILE?'12px':'80px') +';width:'+ (IS_MOBILE?'92vw':'380px') +';min-width:260px;height:'+ (IS_MOBILE?'54vh':'320px') +';min-height:200px;background:rgba(30,30,36,.85);color:#fff;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);display:flex;flex-direction:column;}' +
    '.ooaf-header{padding:8px 10px;background:rgba(20,20,25,.9);display:flex;align-items:center;gap:8px;cursor:move;font-weight:700;font-size:13px;}' +
    '.ooaf-title{flex:1}' +
    '.ooaf-btn{border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;border-radius:6px;padding:5px 8px;font-size:12px;}' +
    '.ooaf-body{flex:1;padding:10px;overflow:auto;font-size:12px;}' +
    '.ooaf-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}' +
    '.ooaf-row-1{grid-template-columns:1fr;}' +
    '.ooaf-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);padding:4px 8px;border-radius:999px;}' +
    '.ooaf-body input[type="text"],.ooaf-body input[type="password"],.ooaf-body input[type="number"],.ooaf-body select{width:100%;background:#1f1f25;color:#e9e9ee;border:1px solid #3a3a44;border-radius:6px;padding:4px 6px;font-size:12px;}' +
    '.ooaf-progress{height:8px;border-radius:999px;background:rgba(255,255,255,.18);overflow:hidden}' +
    '.ooaf-progress>div{height:100%;width:0%;background:#9aa6ff}' +
    '.'+CLASS_BADGE+'{margin-left:8px;padding:2px 6px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.10);display:inline-block}' +
    '.ooaf-badge-fresh{background:rgba(0,200,0,.20)} .ooaf-badge-stale{background:rgba(200,200,0,.20)} .ooaf-badge-unknown{background:rgba(200,0,0,.20)}' +
    '.ooaf-resizer{position:absolute;right:0;bottom:0;width:14px;height:14px;cursor:se-resize;background:linear-gradient(135deg, transparent 0 50%, rgba(255,255,255,.35) 50% 100%);opacity:.7}' +
    '.ooaf-hidden{display:none!important}' +
    '.ooaf-fab{position:fixed;right:12px;bottom:24px;z-index:2147483647;width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:#121217;color:#fff;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.35)}'
  );

  // ---------- HELPERS ----------
  function uiBtn(txt){ var b=document.createElement('button'); b.className='ooaf-btn'; b.type='button'; b.textContent=txt; return b; }

  function enableDrag(panel, handle, onEnd) {
    var dragging=false,startX=0,startY=0,startL=0,startT=0,touchId=null;
    function start(x,y){ dragging=true; startX=x; startY=y; var r=panel.getBoundingClientRect(); startL=r.left; startT=r.top; panel.style.left=startL+'px'; panel.style.top=startT+'px'; panel.style.right='auto'; panel.style.bottom='auto'; }
    function move(x,y){ if(!dragging)return; panel.style.left=(startL+x-startX)+'px'; panel.style.top=(startT+y-startY)+'px'; }
    function end(){ if(!dragging)return; dragging=false; if(onEnd) onEnd(); }
    handle.addEventListener('mousedown', function(e){ if(e.button!==0)return; e.preventDefault(); e.stopPropagation(); start(e.clientX,e.clientY); });
    document.addEventListener('mousemove', function(e){ if(dragging){ move(e.clientX,e.clientY); e.preventDefault(); } }, {passive:false});
    document.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', function(e){ var t=e.changedTouches[0]; touchId=t.identifier; start(t.clientX,t.clientY); }, {passive:false});
    document.addEventListener('touchmove', function(e){ var t=null,i; for(i=0;i<e.changedTouches.length;i++){ if(e.changedTouches[i].identifier===touchId){ t=e.changedTouches[i]; break; } } if(t&&dragging){ move(t.clientX,t.clientY); e.preventDefault(); } }, {passive:false});
    document.addEventListener('touchend', function(e){ var t=null,i; for(i=0;i<e.changedTouches.length;i++){ if(e.changedTouches[i].identifier===touchId){ t=e.changedTouches[i]; break; } } if(t) end(); }, {passive:true});
  }

  function ensureFab(panel){
    var fab=document.querySelector('.ooaf-fab');
    if(!fab){ fab=document.createElement('button'); fab.className='ooaf-fab'; fab.textContent='OOAF'; document.body.appendChild(fab); }
    function toggle(e){ e.preventDefault(); e.stopPropagation(); panel.classList.toggle('ooaf-hidden'); saveState(); }
    fab.addEventListener('click', toggle);
    fab.addEventListener('touchstart', toggle, {passive:false});
    return fab;
  }

  // ---------- STATE ----------
  function LSget(){ try{ return JSON.parse(GM_getValue(LS_KEY)||'{}'); }catch(e){ return {}; } }
  function LSset(o){ GM_setValue(LS_KEY, JSON.stringify(o)); }
  function saveState(extra){
    var st=LSget(), panel=document.querySelector('.ooaf-panel');
    if(panel){ st.top=panel.style.top; st.left=panel.style.left; st.width=panel.style.width; st.height=panel.style.height; st.hidden=panel.classList.contains('ooaf-hidden'); }
    if(apiInput){ st.apiKey=apiInput.value.trim(); st.apiMasked=(apiInput.type==='password'); }
    if(thrVal){ st.value=+thrVal.value||60; }
    if(thrUnit){ st.unit=thrUnit.value; }
    if(delayInput){ st.delay=+delayInput.value||FETCH_DELAY_MS_DEFAULT; }
    if(hideUnknownChk){ st.hideUnknown=hideUnknownChk.checked; }
    if(sortSel){ st.sortBy=sortSel.value; }
    if(extra && typeof extra==='object'){ var k; for(k in extra){ if(Object.prototype.hasOwnProperty.call(extra,k)) st[k]=extra[k]; } }
    LSset(st);
  }

  // ---------- GLOBAL REFS ----------
  var apiInput, apiToggleBtn, thrVal, thrUnit, delayInput, hideUnknownChk, sortSel;

  // ---------- PANEL ----------
  function createPanel(){
    var s=LSget();

    var panel=document.createElement('div');
    panel.className='ooaf-panel';
    panel.style.width=s.width ? s.width : (IS_MOBILE?'92vw':'380px');
    panel.style.height=s.height ? s.height : (IS_MOBILE?'54vh':'320px');
    panel.style.top=s.top ? s.top : (IS_MOBILE?'12px':'80px');
    panel.style.left=s.left ? s.left : (IS_MOBILE?'12px':'80px');



    var header=document.createElement('div'); header.className='ooaf-header';
    var title=document.createElement('span'); title.className='ooaf-title'; title.textContent='Last Action by API ('+(IS_MOBILE?'Mobile':'Desktop')+')';
    var btnClose=uiBtn('X'); btnClose.setAttribute('aria-label','Close');
    header.appendChild(title); header.appendChild(btnClose);

    var body=document.createElement('div'); body.className='ooaf-body';
    body.innerHTML =
      '<div class="ooaf-row" style="grid-template-columns:1fr auto;">' +
      '  <label class="ooaf-chip" style="min-width:0;">API key <input type="password" class="ooaf-api" placeholder="Paste your TORN API key"></label>' +
      '  <button type="button" class="ooaf-btn ooaf-api-toggle">TOGGLE</button>' +
      '</div>' +
      '<div class="ooaf-row">' +
      '  <label class="ooaf-chip">Value <input type="number" min="1" step="1" class="ooaf-thr-val" style="width:80px" value="60"></label>' +
      '  <label class="ooaf-chip">Unit ' +
      '    <select class="ooaf-thr-unit">' +
      '      <option value="minutes">minutes</option>' +
      '      <option value="hours">hours</option>' +
      '      <option value="days">days</option>' +
      '    </select>' +
      '  </label>' +
      '</div>' +
      '<div class="ooaf-row">' +
      '  <label class="ooaf-chip">Delay <input type="number" min="250" step="250" class="ooaf-delay" style="width:80px" value="'+FETCH_DELAY_MS_DEFAULT+'"></label>' +
      '  <label class="ooaf-chip"><input type="checkbox" class="ooaf-hide-unknown"> Hide unknown</label>' +
      '</div>' +
      '<div class="ooaf-row">' +
      '  <label class="ooaf-chip">Sort ' +
      '    <select class="ooaf-sort">' +
      '      <option value="none">None</option>' +
      '      <option value="inactivity">Inactivity (desc)</option>' +
      '      <option value="level">Level (desc)</option>' +
      '    </select>' +
      '  </label>' +
      '  <span class="ooaf-chip">Hotkey Alt+L</span>' +
      '</div>' +
      '<div class="ooaf-row">' +
      '  <button type="button" class="ooaf-btn ooaf-fetch" style="font-weight:700;">Fetch</button>' +
      '  <button type="button" class="ooaf-btn ooaf-stop">Stop</button>' +
      '</div>' +
      '<div class="ooaf-row ooaf-row-1"><div class="ooaf-progress"><div class="ooaf-bar"></div></div></div>' +
      '<div class="ooaf-row"><span class="ooaf-chip">Found <b class="ooaf-found">0</b></span><span class="ooaf-chip">Processed <b class="ooaf-processed">0</b></span></div>' +
      '<div class="ooaf-row"><span class="ooaf-chip">Hidden <b class="ooaf-hidden-count">0</b></span><span class="ooaf-chip">Visible <b class="ooaf-visible-count">0</b></span></div>' +
      '<div class="ooaf-row"><span class="ooaf-chip">ETA <b class="ooaf-eta">—</b></span><span class="ooaf-chip ooaf-status">Ready</span></div>';

    var resizer=document.createElement('div'); resizer.className='ooaf-resizer';

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(resizer);
    document.body.appendChild(panel);
    ensureFab(panel);

    // --- wire buttons (după ce ai pus body în DOM) ---
    var fetchBtn = body.querySelector('.ooaf-fetch');
    var stopBtn  = body.querySelector('.ooaf-stop');

    var lastTouchTime = 0;

    function callFetch(e){
      e.preventDefault(); e.stopPropagation();
      console.log('[OOAF] Fetch handler fired');
      if (typeof onFetch === 'function') onFetch();
      else alert('onFetch not defined'); // fallback temporar
    }

    function callStop(e){
      e.preventDefault(); e.stopPropagation();
      console.log('[OOAF] Stop handler fired');
      if (typeof onStop === 'function') onStop();
      else alert('onStop not defined');
    }

    // touch → pornește imediat
    if (fetchBtn) {
      fetchBtn.addEventListener('touchstart', function(e){
        lastTouchTime = Date.now();
        callFetch(e);
      }, {passive:false});

      // click → ignoră dacă a fost un touch foarte recent (fix pentru dublu-trigger)
      fetchBtn.addEventListener('click', function(e){
        if (Date.now() - lastTouchTime < 400) return;
        callFetch(e);
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('touchstart', function(e){
        lastTouchTime = Date.now();
        callStop(e);
      }, {passive:false});

      stopBtn.addEventListener('click', function(e){
        if (Date.now() - lastTouchTime < 400) return;
        callStop(e);
      });
    }


    // refs
    apiInput       = panel.querySelector('.ooaf-api');
    apiToggleBtn   = panel.querySelector('.ooaf-api-toggle');
    thrVal         = panel.querySelector('.ooaf-thr-val');
    thrUnit        = panel.querySelector('.ooaf-thr-unit');
    delayInput     = panel.querySelector('.ooaf-delay');
    hideUnknownChk = panel.querySelector('.ooaf-hide-unknown');
    sortSel        = panel.querySelector('.ooaf-sort');

    var foundEl  = panel.querySelector('.ooaf-found');
    var procEl   = panel.querySelector('.ooaf-processed');
    var hidEl    = panel.querySelector('.ooaf-hidden-count');
    var visEl    = panel.querySelector('.ooaf-visible-count');
    var bar      = panel.querySelector('.ooaf-bar');
    var etaEl    = panel.querySelector('.ooaf-eta');
    var statusEl = panel.querySelector('.ooaf-status');

    // restore
    s=LSget();
    if(s.hidden) panel.classList.add('ooaf-hidden');
    apiInput.value = s.apiKey ? s.apiKey : '';
    if(s.apiMasked===false) apiInput.type='text';
    thrVal.value = s.value ? s.value : 60;
    thrUnit.value = s.unit ? s.unit : 'minutes';
    delayInput.value = s.delay ? s.delay : FETCH_DELAY_MS_DEFAULT;
    hideUnknownChk.checked = !!s.hideUnknown;
    sortSel.value = s.sortBy ? s.sortBy : 'none';

    // interactions
    enableDrag(panel, header, saveState);
    resizer.addEventListener('mousedown', function(e){
      e.stopPropagation();
      var startX=e.clientX, startY=e.clientY, r=panel.getBoundingClientRect(), sw=r.width, sh=r.height;
      function mm(ev){ panel.style.width = Math.max(260, sw + (ev.clientX-startX)) + 'px'; panel.style.height = Math.max(200, sh + (ev.clientY-startY)) + 'px'; }
      function mu(){ document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); saveState(); }
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    });

    btnClose.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); panel.classList.add('ooaf-hidden'); saveState({hidden:true}); });
    apiToggleBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); apiInput.type = (apiInput.type==='password'?'text':'password'); saveState(); });

    document.addEventListener('keydown', function(e){ if(e.altKey && String(e.key).toLowerCase()==='l'){ panel.classList.toggle('ooaf-hidden'); saveState(); } });
    GM_registerMenuCommand('Show/Hide panel (Alt+L)', function(){ panel.classList.toggle('ooaf-hidden'); saveState(); });

    [thrVal, thrUnit, hideUnknownChk, apiInput, delayInput, sortSel].forEach(function(el){
      el.addEventListener('change', saveState);
      el.addEventListener('input', saveState);
    });

    // delegate Fetch/Stop (merge pe mobil)
    function onFetch(){
      if(RUN.running) return;
      var key=(apiInput.value||'').trim();
      if(!key){ alert('Set your TORN API key first.'); return; }

      statusEl.textContent='Scanning list…';
      var until=Date.now()+5000;
      var rows=getPlayerRows();
      (function waitList(){
        if(!rows.length && Date.now()<until){ setTimeout(function(){ rows=getPlayerRows(); waitList(); }, 300); return; }
        if(!rows.length){ alert('List not found. Scroll/refresh, then try again.'); return; }

        var list=[], i;
        for(i=0;i<rows.length;i++){ var r=rows[i], uid=extractUserId(r); if(uid) list.push({row:r, uid:uid, level:extractLevelFromRow(r)}); }
        if(!list.length){ alert('List found but no XID links.'); return; }

        foundEl.textContent=String(list.length);
        procEl.textContent='0';
        bar.style.width='0%';
        etaEl.textContent='—';
        var visCount=0; for(i=0;i<list.length;i++){ if(list[i].row.style.display!=='none') visCount++; }
        hidEl.textContent=String(list.length-visCount);
        visEl.textContent=String(visCount);

        RUN.running=true; RUN.queue=list; RUN.processed=0; RUN.startedAt=Date.now(); RUN.paused=false; RUN.pauseUntil=0;

        processQueueSequential(key, list, function(progress){
          procEl.textContent=String(progress.done);
          bar.style.width=(progress.total? Math.floor(progress.done/progress.total*100):0)+'%';
          etaEl.textContent=progress.etaText;
          var nowRows=getPlayerRows(), res=recountVisibility(nowRows);
          hidEl.textContent=String(res.hidden);
          visEl.textContent=String(res.visible);
        }, function(){
          RUN.running=false; statusEl.textContent='Done';
          if(sortSel.value!=='none') sortRowsBySelection(sortSel.value);
        });
      })();
    }

    function onStop(){
      RUN.running=false; RUN.paused=false;
      if(RUN.timer){ clearTimeout(RUN.timer); RUN.timer=null; }
      statusEl.textContent='Stopped';
    }


  }

  // ---------- RUN STATE ----------
  var RUN = { running:false, queue:[], timer:null, processed:0, startedAt:0, paused:false, pauseUntil:0 };

  function etaText(ms){
    if(!isFinite(ms) || ms<=0) return '—';
    var s=Math.ceil(ms/1000), m=Math.floor(s/60), sec=s%60;
    return m ? (m+'m '+sec+'s') : (sec+'s');
  }

  function processQueueSequential(apiKey, list, onEach, onDone){
    var delay = Math.max(250, +(document.querySelector('.ooaf-delay') ? document.querySelector('.ooaf-delay').value : FETCH_DELAY_MS_DEFAULT));
    var total = list.length;
    var statusEl = document.querySelector('.ooaf-status');
    var idx=0, avgPerItem=delay;

    function step(){
      if(!RUN.running){ if(onDone) onDone(); return; }
      if(idx>=total){ if(onDone) onDone(); return; }

      if(RUN.paused){
        var now=Date.now();
        if(now<RUN.pauseUntil){
          var remaining=RUN.pauseUntil-now;
          if(statusEl) statusEl.textContent='Paused (rate-limit)…';
          if(onEach) onEach({done:idx,total:total,etaText:etaText(remaining+(total-idx)*delay)});
          RUN.timer=setTimeout(step, Math.min(remaining, 1000));
          return;
        } else {
          RUN.paused=false;
        }
      }

      var item=list[idx], t0=Date.now();
      fetchUserWithRetry(apiKey, item.uid).then(function(data){
        var relative = (data && data.last_action && data.last_action.relative) ? data.last_action.relative : '';
        var mins = parseRelativeToMinutes(relative);
        attachMeta(item.row, { mins:mins, level:(data && data.level) ? data.level : extractLevelFromRow(item.row) });
        decorateRowWithLastAction(item.row, relative);
        applyRowVisibility(item.row, { mins:mins });
        if(statusEl) statusEl.textContent='Fetching…';
      }).catch(function(e){
        if(e && e.__rateLimit){ RUN.paused=true; RUN.pauseUntil=Date.now()+RATE_LIMIT_PAUSE_MS; if(statusEl) statusEl.textContent='Rate-limited, pausing…'; }
        attachMeta(item.row, { mins:null, level:extractLevelFromRow(item.row) });
        decorateRowWithLastAction(item.row, null, e);
        applyRowVisibility(item.row, { mins:null });
      }).finally(function(){
        idx++; RUN.processed=idx;
        var took=Date.now()-t0; avgPerItem = avgPerItem*0.7 + took*0.3;
        var remaining=(total-idx)*(avgPerItem+delay);
        if(onEach) onEach({done:idx,total:total,etaText:etaText(remaining)});
        if(!RUN.running){ if(onDone) onDone(); return; }
        RUN.timer=setTimeout(step, delay);
      });
    }
    step();
  }

  function fetchUserWithRetry(apiKey, userId){
    var attempt=0, backoffs=[1000,2000,4000];
    return new Promise(function(resolve,reject){
      function go(){
        attempt++;
        GM_xmlhttpRequest({
          method:'GET',
          url:'https://api.torn.com/user/'+userId+'?key='+encodeURIComponent(apiKey)+'&selections=profile',
          headers:{'Accept':'application/json'},
          timeout:20000,
          onload:function(res){
            var status=res.status, json={};
            try{ json=JSON.parse(res.responseText||'{}'); }catch(e){ json={}; }
            if(status===429 || (json && json.error && json.error.code===5)){ var er=new Error('Rate limited'); er.__rateLimit=true; reject(er); return; }
            if(status>=200 && status<300 && !(json && json.error)){ resolve(json); return; }
            if((status>=500 && status<600) || (json && json.error)){
              if(attempt<=MAX_RETRIES){ var w=backoffs[Math.min(attempt-1, backoffs.length-1)]; setTimeout(go, w); }
              else{ reject(new Error((json && json.error && json.error.error)? json.error.error : ('HTTP '+status))); }
              return;
            }
            reject(new Error('HTTP '+status));
          },
          onerror:function(){ if(attempt<=MAX_RETRIES){ var w=backoffs[Math.min(attempt-1, backoffs.length-1)]; setTimeout(go, w); } else reject(new Error('Network error')); },
          ontimeout:function(){ if(attempt<=MAX_RETRIES){ var w=backoffs[Math.min(attempt-1, backoffs.length-1)]; setTimeout(go, w); } else reject(new Error('Request timeout')); }
        });
      }
      go();
    });
  }

  // ---------- DOM HELPERS ----------
  function getListRoot(){
    var i, el;
    for(i=0;i<SELECTORS.rootList.length;i++){ el=document.querySelector(SELECTORS.rootList[i]); if(el) return el; }
    var all=document.querySelectorAll('ul.users-list');
    for(i=0;i<all.length;i++){ if(all[i].querySelector(SELECTORS.nameLink)) return all[i]; }
    return null;
  }

  function getPlayerRows(){
    var root=getListRoot(); if(!root) return [];
    var rows=root.querySelectorAll(SELECTORS.row), out=[], i;
    for(i=0;i<rows.length;i++){ var r=rows[i]; if(!r.matches('.title,.header,.pagination,.table-header')) out.push(r); }
    return out;
  }

  function extractUserId(row){
    var a=row.querySelector(SELECTORS.nameLink) || row.querySelector('a[href*="/profiles.php?XID="]');
    if(!a) return null;
    var m=a.href.match(/XID=(\d+)/);
    return m ? m[1] : null;
  }

  function extractLevelFromRow(row){
    var wrap=row.querySelector(SELECTORS.levelWrap);
    if(wrap){ var mm=(wrap.textContent||'').match(/(\d+)/); if(mm) return parseInt(mm[1],10); }
    var left=row.querySelector('.left-side') || row;
    var nums=(left.textContent||'').match(/\b\d+\b/g);
    if(nums && nums.length){ var n=parseInt(nums[0],10); if(!isNaN(n)) return n; }
    return 0;
  }

  // ---------- DECORATION / FILTER ----------
  function attachMeta(row, meta){
    var h=row.querySelector('.'+CLASS_META);
    if(!h){ h=document.createElement('span'); h.className=CLASS_META; h.style.display='none'; row.appendChild(h); }
    try{ h.textContent=JSON.stringify(meta); }catch(e){ h.textContent='{}'; }
  }

  function readMeta(row){
    var h=row.querySelector('.'+CLASS_META); if(!h) return null;
    try{ return JSON.parse(h.textContent||'{}'); }catch(e){ return null; }
  }

  function decorateRowWithLastAction(row, relative, err){
    // șterge orice badge vechi (fie lângă nume, fie în status)
    var old1 = row.querySelector('.'+CLASS_BADGE); if (old1) old1.remove();
    var old2 = row.querySelector('.ooaf-badge-status'); if (old2) old2.remove();

    // caută zona de status din dreapta
    var statusWrap = row.querySelector('.right-side .status');
    // în TORN-PDA, valoarea „Okay” e în span.user-*-status
    var statusValue = statusWrap ? (statusWrap.querySelector('.user-green-status, .user-red-status, .user-yellow-status, .user-blue-status, .user-orange-status, .user-white-status') || statusWrap.querySelector('span:last-child')) : null;

    // fallback: dacă nu găsim status, rămânem pe varianta veche lângă nume
    if (!statusWrap || !statusValue) {
      var a = row.querySelector(SELECTORS.nameLink) || row.querySelector('a[href*="/profiles.php?XID="]');
      if (!a) return;
      var b = document.createElement('span');
      b.className = CLASS_BADGE;
      if (relative == null) { b.textContent = err ? ('N/A ('+(err && err.message ? err.message : 'error')+')') : 'N/A'; b.classList.add('ooaf-badge-unknown'); }
      else {
        b.textContent = relative;
        var mins = parseRelativeToMinutes(relative);
        if (mins == null) b.classList.add('ooaf-badge-unknown');
        else if (mins < 60) b.classList.add('ooaf-badge-fresh');
        else b.classList.add('ooaf-badge-stale');
      }
      if (a.parentElement) a.parentElement.appendChild(b);
      return;
    }

    // preferat: inserează după „Okay”
    var s = document.createElement('span');
    s.className = 'ooaf-badge-status';
    if (relative == null) {
      s.textContent = err ? ('N/A ('+(err && err.message ? err.message : 'error')+')') : 'N/A';
      s.classList.add('unknown');
    } else {
      s.textContent = relative;
      var mins2 = parseRelativeToMinutes(relative);
      if (mins2 == null) s.classList.add('unknown');
      else if (mins2 < 60) s.classList.add('fresh');
      else s.classList.add('stale');
    }

    // inserează imediat după valoarea de status
    statusValue.insertAdjacentElement('afterend', s);
  }


  function applyRowVisibility(row, ctx){
    var st=LSget(), thr=thresholdToMinutes(st);
    if(ctx.mins==null){ row.style.display = st.hideUnknown ? 'none' : ''; return; }
    row.style.display = (ctx.mins <= thr) ? '' : 'none';
  }

  function recountVisibility(rows){
    var hidden=0, visible=0, i; for(i=0;i<rows.length;i++){ if(rows[i].style.display==='none') hidden++; else visible++; }
    return {hidden:hidden, visible:visible};
  }

  function sortRowsBySelection(mode){
    var root=getListRoot(); if(!root) return;
    var rows=getPlayerRows(); if(!rows.length) return;
    var items=[], i;
    for(i=0;i<rows.length;i++){
      var r=rows[i], m=readMeta(r);
      var mins=(m && m.mins!=null) ? m.mins : parseRelativeToMinutes((r.querySelector('.'+CLASS_BADGE)||{}).textContent||'');
      var lvl=(m && m.level!=null) ? m.level : extractLevelFromRow(r);
      items.push({el:r, mins:mins, level:lvl});
    }
    if(mode==='inactivity'){
      items.sort(function(a,b){
        var am=(a.mins==null)?-1:a.mins, bm=(b.mins==null)?-1:b.mins;
        if(am===-1 && bm===-1) return 0; if(am===-1) return 1; if(bm===-1) return -1; return bm-am;
      });
    } else if(mode==='level'){
      items.sort(function(a,b){ return (b.level||0)-(a.level||0); });
    } else { return; }
    for(i=0;i<items.length;i++){ root.appendChild(items[i].el); }
  }

  // ---------- PARSERS ----------
  function thresholdToMinutes(st){
    var v=Math.max(1, +(st.value!=null ? st.value : 60));
    var u=st.unit ? st.unit : 'minutes';
    if(u==='minutes') return v;
    if(u==='hours') return v*60;
    if(u==='days') return v*1440;
    return v;
  }

  function parseRelativeToMinutes(raw){
    if(!raw) return null;
    var s=String(raw).toLowerCase().trim();
    if(/^(online|now|just now|moments? ago)$/.test(s)) return 0;
    if(/a\s+minute/.test(s)) return 1;
    if(/a\s+second/.test(s)) return 0;
    if(/a\s+few\s+minutes?/.test(s)) return 3;
    if(/less\s+than\s+a\s+minute/.test(s)) return 0;

    var minutes=0, matched=false, re=/(\d+)\s*(y|yr|yrs|year|years|mo|month|months|w|wk|wks|week|weeks|d|day|days|h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\b/g, m;
    while((m=re.exec(s))!==null){ matched=true; var val=parseInt(m[1],10); minutes += val * unitToMinutes(m[2]); }
    if(matched) return minutes;

    var ml=s.match(/(\d+)\s+(years?|months?|weeks?|days?|hours?|minutes?|seconds?)\s+ago/);
    if(ml) return parseInt(ml[1],10) * unitToMinutes(ml[2]);

    var mn=s.match(/(\d+)\s*(minutes?|hours?|days?)/);
    if(mn) return parseInt(mn[1],10) * unitToMinutes(mn[2]);

    return null;
  }

  function unitToMinutes(u){
    u=u.toLowerCase();
    if(u.indexOf('y')===0) return 525600;
    if(u.indexOf('mo')===0) return 43200;
    if(u.indexOf('w')===0) return 10080;
    if(u.indexOf('d')===0) return 1440;
    if(u.indexOf('h')===0) return 60;
    if(u.indexOf('m')===0) return 1;
    if(u.indexOf('s')===0) return 0;
    return 0;
  }

  // ---------- INIT ----------
  function onReady(fn){ if(document.readyState==='complete' || document.readyState==='interactive') fn(); else document.addEventListener('DOMContentLoaded', fn, {once:true}); }
  onReady(createPanel);
})();
