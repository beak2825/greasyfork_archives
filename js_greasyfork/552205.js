// ==UserScript==
// @name         CyTu.be Playlist Manager
// @namespace    cytube-saved-playlists
// @version      3.7.10
// @description  Drive-backed playlists per channel. Save/Load, Replace/Append (Next/End), Add-N, Random, Dedupe, Import/Export, Text Editor
// @match        https://cytu.be/*
// @match        https://*.cytu.be/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      googleusercontent.com
// @connect      google.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/552205/CyTube%20Playlist%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/552205/CyTube%20Playlist%20Manager.meta.js
// ==/UserScript==
(function(){
  'use strict';

  /* ---------------------------- Small utils ---------------------------- */
  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function sleep(ms){ return new Promise(function(res){ setTimeout(res, ms); }); }
  var channelName=(window.CHANNEL&&window.CHANNEL.name)||location.pathname.split('/').filter(Boolean).pop()||'default';

  function safeDataset(el,k){ try{ return (el&&el.dataset)?el.dataset[k]:undefined; }catch(e){ return undefined; } }
  function getAttr(el,n){ try{ return (el&&typeof el.getAttribute==='function')?(el.getAttribute(n)||''):''; }catch(e){ return ''; } }
  function hasFn(obj, fn){ try{ return obj && typeof obj[fn]==='function'; }catch(e){ return false; } }

  function toast(msg){ try{ var t=document.createElement('div'); t.textContent=String(msg||''); t.style.cssText='position:fixed;right:12px;bottom:12px;z-index:100000;padding:8px 10px;border-radius:10px;color:#e9ecf1;background:rgba(10,14,22,.8);backdrop-filter:blur(12px) saturate(140%);border:1px solid rgba(255,255,255,.12);'; document.body.appendChild(t); setTimeout(function(){ if(t&&t.parentNode) t.parentNode.removeChild(t); }, 5200); }catch(e){ console.error('[toast]', e, msg); }}

  /* ----------------------- Keys & storage ---------------------- */
  function KEY(n){ return 'ct_savedpl:'+channelName+':'+n; }
  var LISTKEY='ct_savedpl_index:'+channelName;
  var UIKEY_MAIN='ct_ui_collapsed_main:'+channelName;
  var UIKEY_DB='ct_ui_collapsed_db:'+channelName;
  var REV_BROADCAST_KEY='ct_db_rev:'+channelName;

  var LAST_USED_KEY='ct_db_last_used'; // { baseUrl, dbId, token }
  var REGKEY='ct_db_registry';         // { [baseUrl]: { dbId, token } }

  function getIndex(){ try{ return JSON.parse(localStorage.getItem(LISTKEY)||'[]'); }catch(e){ return []; } }
  function setIndex(arr){ var uniq=Array.from(new Set(arr.filter(Boolean))).sort(function(a,b){ return a.localeCompare(b); }); localStorage.setItem(LISTKEY, JSON.stringify(uniq)); return uniq; }

  function readSaved(name){ try{ return JSON.parse(localStorage.getItem(KEY(name))||'{}'); }catch(e){ return {}; } }
  function writeSaved(name,payload){ localStorage.setItem(KEY(name), JSON.stringify(payload)); }

  /* ----------------------- GM fetch (with fallback) ---------------------- */
  function gmFetch(url, opts){
    opts=opts||{}; var method=opts.method||'GET'; var headers=opts.headers||{}; var data=opts.data||null; var responseType=opts.responseType||'text';
    return new Promise(function(resolve, reject){
      if (typeof GM_xmlhttpRequest !== 'function'){
        fetch(url, { method: method, headers: headers, body: data })
          .then(function(r){ return r.text().then(function(text){ resolve({status:r.status, responseText:text}); }); })
          .catch(reject);
        return;
      }
      GM_xmlhttpRequest({ url:url, method:method, headers:headers, data:data, responseType:responseType,
        onload:resolve, onerror:reject, ontimeout:function(){ reject(new Error('GM timeout')); } });
    });
  }
  function gmFetchJSON(url, opts){
    return gmFetch(url, Object.assign({}, opts||{}, {responseType:'text'}))
      .then(function(r){ var text=r.responseText||''; var json=null; try{ json=JSON.parse(text); }catch(e){} return { json: json, status: r.status, text: text }; });
  }

  /* ----------------------- URL + dedupe helpers ---------------------- */
  function parseYouTubeId(u){
    try{
      var url=new URL(u);
      if(url.hostname==='youtu.be') return url.pathname.slice(1);
      if(/youtube\.com$/i.test(url.hostname)){
        if(url.pathname==='/watch') return url.searchParams.get('v')||'';
        if(url.pathname.indexOf('/shorts/')===0) return (url.pathname.split('/')[2]||'');
        var m=url.pathname.match(/^\/embed\/([^/?#]+)/); if(m) return m[1];
      }
    }catch(e){}
    return '';
  }
  function urlToKey(u){
    var s=String(u||'').trim(); if(!s) return '';
    try{
      var url=new URL(s, location.href);
      if(/(youtu\.be|youtube\.com)$/i.test(url.hostname)){
        var id=parseYouTubeId(url.href); return id?('yt:'+id):('url:'+url.origin+url.pathname+url.search);
      }
      var host=url.hostname.replace(/^www\./,''); return 'url:'+host+':'+url.pathname+url.search;
    }catch(e){ return 'url:'+s; }
  }

  function scrapeUrlsFromQueue(){
    var out=[]; var list=$$('#queue .queue_entry, .queue_item');
    for(var i=0;i<list.length;i++){ var el=list[i]; var a=el.querySelector('a[href]'); if(a&&a.href) out.push(a.href); }
    if(!out.length){
      var anchors=$$('#queue a, #playlist a, .queue a, .qe_title a');
      for(var j=0;j<anchors.length;j++){ var a2=anchors[j]; if(a2&&a2.href) out.push(a2.href); }
    }
    return out;
  }
  function scrapeCurrentQueueKeys(){
    var keys=[]; var list=$$('#queue .queue_entry, .queue_item');
    for(var i=0;i<list.length;i++){
      var el=list[i];
      var svc=(safeDataset(el,'service')||(getAttr(el,'data-service')||'')).toLowerCase();
      var id =(safeDataset(el,'id')||(getAttr(el,'data-id')||''));
      if(svc&&id){ if(svc==='yt') keys.push('yt:'+id); else if(svc==='dm') keys.push('dm:'+id); else keys.push('url:'+svc+':'+id); continue; }
      var a=el.querySelector('a[href]'); if(a&&a.href) keys.push(urlToKey(a.href));
    }
    if(!keys.length){
      var anchors=$$('#queue a, #playlist a, .queue a, .qe_title a');
      for(var k=0;k<anchors.length;k++){ var a2=anchors[k]; if(a2&&a2.href) keys.push(urlToKey(a2.href)); }
    }
    return keys;
  }
  function getCurrentKeySet(){ return new Set(scrapeCurrentQueueKeys()); }
  function getQueueCount(){ return $$('#queue .queue_entry').length || $$('.queue .queue_entry').length || $$('.queue_item').length || 0; }

  /* ----------------------- Clear (Replace) ----------------------- */
  function clearPlaylistRobust(){
    return new Promise(function(resolve){
      (async function(){
        try{
          if(window.socket && hasFn(window.socket,'emit')){
            window.socket.emit('playlistClear');
            for(var i=0;i<15;i++){ if(getQueueCount()===0) return resolve(true); await sleep(100); }
          }
        }catch(e){}
        var btn=null; var candidates=$$('button, .btn, a');
        for(var ii=0;ii<candidates.length;ii++){
          var b=candidates[ii]; var txt=(b.textContent||''); var tit=getAttr(b,'title');
          if(/clear/i.test(txt) || /clear/i.test(tit)){ btn=b; break; }
        }
        if(btn){
          btn.click(); await sleep(80);
          var confirmBtn=null; var buttons=$$('button, .btn, a');
          for(var jj=0;jj<buttons.length;jj++){
            var bb=buttons[jj]; if(/confirm|yes|ok/i.test(bb.textContent||'') && bb.offsetParent){ confirmBtn=bb; break; }
          }
          if(confirmBtn) confirmBtn.click();
          for(var kk=0;kk<80;kk++){ if(getQueueCount()===0) return resolve(true); await sleep(100); }
        }
        resolve(false);
      })();
    });
  }

  /* ------------------ Load/Save ops (MODIFIED FOR TOAST REDUCTION) ------------------ */
  function saveAs(name){
    if(!name){ toast('Enter a name'); return; }
    var urls=scrapeUrlsFromQueue(); if(!urls.length){ toast('Playlist is empty'); return; }
    writeSaved(name,{savedAt:Date.now(),items:urls});

    var localIdx = setIndex(getIndex().concat([name]));

    if(usingRemote()){
      drivePush().then(function(){
        // Everything succeeded, including the critical post-push drivePull
        refreshList(localIdx, name);
        toast('Saved "'+name+'" ('+urls.length+')');
      }).catch(function(e){
        // If drivePush failed, it's either the push itself or the post-push pull/resync (the common case)
        console.warn('Push failed after saveAs. Attempting final pull...', e);
        // NOTE: Removing the first "Push failed" toast.

        drivePull(1, 1500).then(function(){ // Final check (single attempt)
            refreshList(localIdx, name);
            toast('Saved and re-synced successfully!'); // Success confirmation
        }).catch(function(){
            // Still failed to pull (likely server lag/issue)
            refreshList(localIdx, name); // Still update the list based on the local cache
            toast('Save sync failed. Saved locally. Please re-connect if data did not sync.');
        });
      });
    } else {
      refreshList(localIdx, name);
      toast('Saved "'+name+'" ('+urls.length+')');
      maybeBroadcast();
    }
  }

  function createNewEmptyPlaylist(name, openEditorAfter){
    if(openEditorAfter===void 0) openEditorAfter=true;
    var n=String(name||'').trim(); if(!n){ toast('Enter a name'); return; }
    var existing=readSaved(n); var existsIdx=getIndex().indexOf(n)>=0; var hasItems=(existing.items||[]).length>0;
    if((existsIdx||hasItems) && !confirm('"'+n+'" exists. Clear its items and continue?')) return;

    writeSaved(n,{savedAt:Date.now(),items:[]});
    var localIdx=setIndex(getIndex().concat([n]));

    if(usingRemote()){
      drivePush().then(function(){
        // Everything succeeded, including the critical post-push drivePull
        refreshList(localIdx, n);
        toast('Created empty playlist');
      }).catch(function(e){
        console.warn('Push failed after create. Attempting final pull...', e);
        // NOTE: Removing the first "Push failed" toast.

        drivePull(1, 1500).then(function(){
            refreshList(localIdx, n);
            toast('Created and re-synced successfully!');
        }).catch(function(){
            refreshList(localIdx, n);
            toast('Create sync failed. Created locally. Please re-connect if data did not sync.');
        });
      });
    } else {
      refreshList(localIdx, n);
      toast('Created empty playlist');
    }

    if(selectEl) selectEl.value=n;
    if(openEditorAfter) openEditor(n);
  }

  function loadWhole(name,mode,where){
    if(!name){ toast('Pick a name'); return; }
    where = where || 'end';
    var pack=readSaved(name); var items=pack.items||[];
    var input=$('#mediaurl')||$('input#mediaurl')||$$('input').find(function(i){
      var id=i&&i.id?i.id+'' : ''; var ph=i&&i.placeholder?i.placeholder+'' : '';
      return (id.indexOf('mediaurl')>=0)||(/url/i.test(ph));
    });
    var addEndBtn=$('#queue_end')||$$('button').find(function(b){ return /queue to end|queue|add/i.test(b.textContent||''); });
    var addNextBtn=$('#queue_next')||$$('button').find(function(b){ return /queue next|next/i.test(b.textContent||''); });
    if(!input||(!addEndBtn && !addNextBtn)){ toast('Could not find Add controls'); return; }

    var clicker = (where==='next' && addNextBtn) ? addNextBtn : addEndBtn;
    if(where==='next' && !addNextBtn) toast('No "Queue Next" found; adding to End.');

    // Use an IIFE with async/await internally
    (async function(){
      if(mode==='replace'){
        var ok=await clearPlaylistRobust();
        toast(ok? 'Playlist cleared.' : 'Could not clear (need perms). Loading anyway (append).');
      }
      var current=getCurrentKeySet(), toAdd=[];
      for(var i=0;i<items.length;i++){ var u=items[i]; var k=urlToKey(u); if(!current.has(k)){ toAdd.push(u); current.add(k);} }
      if(!toAdd.length){ toast('Nothing to add (all present).'); return; }
      var idx=0; (async function step(){ if(idx>=toAdd.length){ toast('Loaded "'+name+'" (+'+toAdd.length+' new, '+where+')'); return; } input.value=toAdd[idx++]; clicker.click(); await sleep(160); step(); })();
    })();
  }

  function shuffleInPlace(a){ for(var i=a.length-1;i>0;i--){ var j=(Math.random()*(i+1))|0; var t=a[i]; a[i]=a[j]; a[j]=t; } }
  function addNFromSaved(name,count,where,randomize){
    if(where===void 0) where='end'; if(randomize===void 0) randomize=true;
    if(!name){ toast('Pick a name'); return; }
    var pack=readSaved(name); var items=pack.items||[];
    var current=getCurrentKeySet(); var pool=[];
    for(var i=0;i<items.length;i++){ var u=items[i]; var k=urlToKey(u); if(!current.has(k)){ pool.push(u); current.add(k);} }
    if(!pool.length){ toast('Nothing to add (all present).'); return; }
    if(randomize) shuffleInPlace(pool);
    var take=Math.max(0, Math.min((count|0), pool.length)) || 1; var selected=pool.slice(0,take);
    var input=$('#mediaurl')||$('input#mediaurl')||$$('input').find(function(i){
      var id=i&&i.id?i.id+'' : ''; var ph=i&&i.placeholder?i.placeholder+'' : '';
      return (id.indexOf('mediaurl')>=0)||(/url/i.test(ph));
    });
    var addEndBtn=$('#queue_end')||$$('button').find(function(b){ return /queue to end|queue|add/i.test(b.textContent||''); });
    var addNextBtn=$('#queue_next')||$$('button').find(function(b){ return /queue next|next/i.test(b.textContent||''); });
    if(!input||(!addEndBtn && !addNextBtn)){ toast('Could not find Add controls'); return; }
    var clicker=(where==='next' && addNextBtn)?addNextBtn:addEndBtn;
    if(where==='next' && !addNextBtn) toast('No "Queue Next" found; adding to End.');
    var idx=0; (async function step(){ if(idx>=selected.length){ toast('Added '+selected.length+' from "'+name+'" ('+where+')'); return; } input.value=selected[idx++]; clicker.click(); await sleep(160); step(); })();
  }

  function appendUrlToSaved(name,url){
    if(!name){ toast('Pick a playlist'); return; }
    var u=String(url||'').trim(); if(!u){ toast('Enter a URL'); return; }
    var data=readSaved(name); var keys=new Set((data.items||[]).map(urlToKey)); var k=urlToKey(u);
    if(keys.has(k)){ toast('Already in list'); return; }
    data.items=(data.items||[]).concat([u]); data.savedAt=Date.now();

    writeSaved(name,data);

    if(usingRemote()){
      drivePush().then(function(){
        toast('Added to saved');
      }).catch(function(e){
        console.warn('Push failed after add URL. Attempting final pull...', e);
        // NOTE: Removing the first "Push failed" toast.

        drivePull(1, 1500).then(function(){
            toast('Added and re-synced successfully!');
        }).catch(function(){
            toast('Add URL sync failed. Saved locally. Please re-connect if data did not sync.');
        });
      });
    } else {
      toast('Added to saved');
      maybeBroadcast();
    }
  }

  function appendCurrentQueueToSaved(name){
    if(!name){ toast('Pick a playlist'); return; }
    var add=scrapeUrlsFromQueue(); if(!add.length){ toast('Current queue is empty'); return; }
    var data=readSaved(name); var keys=new Set((data.items||[]).map(urlToKey)); var added=0;
    for(var i=0;i<add.length;i++){ var u=add[i]; var k=urlToKey(u); if(!keys.has(k)){ data.items.push(u); keys.add(k); added++; } }

    if (added === 0) {
      toast('All already present');
      return;
    }

    data.savedAt=Date.now();
    writeSaved(name,data);

    if(usingRemote()){
      drivePush().then(function(){
        toast('Appended '+added+' item(s)');
      }).catch(function(e){
        console.warn('Push failed after add current. Attempting final pull...', e);
        // NOTE: Removing the first "Push failed" toast.

        drivePull(1, 1500).then(function(){
            toast('Appended and re-synced successfully!');
        }).catch(function(){
            toast('Add current sync failed. Saved locally. Please re-connect if data did not sync.');
        });
      });
    } else {
      toast('Appended '+added+' item(s)');
      maybeBroadcast();
    }
  }

  function openEditor(name){
    if(!name){ toast('Pick a playlist'); return; }
    var data=readSaved(name);
    var modal=document.createElement('div'); modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100000;display:grid;place-items:center;';
    var card=document.createElement('div'); card.style.cssText='width:min(900px,92vw);max-height:86vh;overflow:auto;padding:14px;background:rgba(24,26,30,.85);color:#e9ecf1;border-radius:14px;backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.18);';
    var title=document.createElement('div'); title.textContent='Edit: '+name; title.style.cssText='font-weight:700;margin-bottom:8px;';
    var ta=document.createElement('textarea'); ta.value=(data.items||[]).join('\n'); ta.style.cssText='width:100%;height:48vh;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:10px;';
    var row=document.createElement('div'); row.style.cssText='display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;';
    function btn(label,fn){ var b=document.createElement('button'); b.textContent=label; b.style.cssText='background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18);padding:8px 12px;border-radius:12px;cursor:pointer;'; b.addEventListener('click',fn); return b; }
    var dedupeBtn=btn('Dedupe', function(){ var lines=ta.value.split('\n').map(function(s){return s.trim();}).filter(Boolean); var seen=new Set(); var out=[]; for(var i=0;i<lines.length;i++){ var u=lines[i]; var k=urlToKey(u); if(!seen.has(k)){ seen.add(k); out.push(u); } } ta.value=out.join('\n'); toast('Deduped to '+out.length); });

    var saveBtn=btn('Save', function(){
      var lines=ta.value.split('\n').map(function(s){return s.trim();}).filter(Boolean);
      writeSaved(name,{savedAt:Date.now(),items:lines});

      if(modal.parentNode) modal.parentNode.removeChild(modal); // Close modal immediately

      if(usingRemote()){
        drivePush().then(function(){
          toast('Saved');
        }).catch(function(e){
          console.warn('Push failed after edit. Attempting final pull...', e);
          // NOTE: Removing the first "Push failed" toast.

          drivePull(1, 1500).then(function(){
              toast('Saved and re-synced successfully!');
          }).catch(function(){
              toast('Edit sync failed. Saved locally. Please re-connect if data did not sync.');
          });
        });
      } else {
        toast('Saved');
        maybeBroadcast();
      }
    });

    var cancelBtn=btn('Cancel', function(){ if(modal.parentNode) modal.parentNode.removeChild(modal); });
    row.appendChild(dedupeBtn); row.appendChild(saveBtn); row.appendChild(cancelBtn);
    card.appendChild(title); card.appendChild(ta); card.appendChild(row); modal.appendChild(card);
    modal.addEventListener('click', function(e){ if(e.target===modal && modal.parentNode) modal.parentNode.removeChild(modal); });
    document.body.appendChild(modal);
  }

  function deleteName(name){ // Revert to non-async
    if(!name){ toast('Pick a name'); return; }

    if(!usingRemote()) {
        localStorage.removeItem(KEY(name));
        var idx=setIndex(getIndex().filter(function(n){return n!==name;}));
        refreshList(idx, idx[0]||'');
        toast('Deleted "'+name+'" (local)');
        maybeBroadcast();
        return;
    }

    // For remote: remove from local cache first, then push
    // Optimistically update the remote cache (this is the state we want to push)
    if(DBSTATE.cache && DBSTATE.cache.playlists) {
        delete DBSTATE.cache.playlists[name];
    }

    drivePush().then(function(){
      // SUCCESS: Update local index/UI only on successful push/resync
      var idx=setIndex(getIndex()); // Re-reads the index from the newly pulled cache
      refreshList(idx, idx[0]||'');
      toast('Deleted "'+name+'"');
    }).catch(function(e){
      console.warn('Push/Resync failed immediately after push. Attempting final pull...', e);

      // FAILURE: The push/resync failed (likely resync failure due to delay).
      // NOTE: Temporarily showing the first message to inform the user a check is happening
      toast('Push succeeded, but immediate re-sync failed. Checking server...');

      // We must force a pull to get the definitive state from the server.
      drivePull(1, 1500).then(function(){ // Final check (single attempt)
          // If this pull succeeds, it means the local state was just stale (push probably succeeded).
          refreshList(getIndex(), getIndex()[0]||'');
          toast('Item deleted! Server state reloaded successfully.'); // <-- UPDATED SUCCESS MESSAGE
      }).catch(function(){
          // If the final pull fails, we show a critical error.
          toast('Delete operation failed to confirm. Please reload/re-connect.'); // <-- UPDATED FAILURE MESSAGE
      });
    });
  }

  function importAll(file){ // Revert to non-async
    var fr=new FileReader();
    fr.onload=function(){ // Revert to non-async
      try{
        var parsed=JSON.parse(fr.result);
        if(DBSTATE.connected && DBSTATE.cache){
          if(parsed.playlists) DBSTATE.cache=parsed;
          else if(parsed.data) DBSTATE.cache.playlists=Object.assign({}, DBSTATE.cache.playlists, parsed.data);
          else DBSTATE.cache.playlists=Object.assign({}, DBSTATE.cache.playlists, parsed);

          drivePush().then(function(){
            refreshList(getIndex(),'');
            toast('Imported to remote DB');
          }).catch(function(e){
            console.warn('Push failed after import. Attempting final pull...', e);
            // NOTE: Removing the first "Push failed" toast.

            drivePull(1, 1500).then(function(){
                refreshList(getIndex(),'');
                toast('Imported and re-synced successfully!');
            }).catch(function(){
                toast('Import sync failed. Saved locally. Please re-connect if data did not sync.');
            });
          });
        } else {
          var data=parsed.data||parsed; var idx=getIndex();
          Object.keys(data).forEach(function(name){ localStorage.setItem(KEY(name), JSON.stringify(data[name])); idx.push(name); });
          idx=setIndex(idx);
          refreshList(idx, idx[0]||'');
          toast('Imported playlists (local)');
        }
      }catch(e){ toast('Import failed (bad JSON)'); }
    };
    fr.readAsText(file);
  }

  /* ------------------ GOOGLE DRIVE (Apps Script) DB ------------------ */
  var DBSTATE={connected:false,baseUrl:'',dbId:'',token:'',cache:null};

  function readRegistry(){ try{ return JSON.parse(localStorage.getItem(REGKEY)||'{}'); }catch(e){ return {}; } }
  function writeRegistry(reg){ localStorage.setItem(REGKEY, JSON.stringify(reg||{})); }
  function getRegEntry(base){ var reg=readRegistry(); return reg && reg[base] ? reg[base] : null; }
  function setRegEntry(base, db, tok){ var reg=readRegistry(); reg[base]={ dbId:db, token:tok||'' }; writeRegistry(reg); }
  function setLastUsed(base, db, tok){ localStorage.setItem(LAST_USED_KEY, JSON.stringify({baseUrl:base, dbId:db, token:tok||''})); }
  function getLastUsed(){ try{ return JSON.parse(localStorage.getItem(LAST_USED_KEY)||''); }catch(e){ return null; } }

  function saveConnPerChannel(){
    localStorage.setItem('ct_db_conn:'+channelName, JSON.stringify({baseUrl:DBSTATE.baseUrl, dbId:DBSTATE.dbId, token:DBSTATE.token}));
    setRegEntry(DBSTATE.baseUrl, DBSTATE.dbId, DBSTATE.token);
    setLastUsed(DBSTATE.baseUrl, DBSTATE.dbId, DBSTATE.token);
  }
  function loadConnPerChannel(){
    try{
      var raw=localStorage.getItem('ct_db_conn:'+channelName);
      if(!raw) return null;
      var v=JSON.parse(raw);
      return {baseUrl:v.baseUrl||'', dbId:v.dbId||'', token:v.token||''};
    }catch(e){}
    return null;
  }

  function driveInit(baseUrl){
    return new Promise(function(resolve, reject){
      (async function(){
        try{
          var initPost=baseUrl.replace(/\?.*$/, '')+'?init=1';
          var r=await gmFetchJSON(initPost,{method:'POST'});
          if(!r.json||r.json.error||!r.json.dbId){
            r=await gmFetchJSON(initPost,{method:'GET'});
            if(!r.json||!r.json.dbId){ toast('Create failed. Status '+r.status); throw new Error('init failed'); }
          }
          resolve(r.json.dbId);
        }catch(e){ reject(e); }
      })();
    });
  }

  // --- FIX: Added retry mechanism for robustness on server delay ---
  function drivePull(retries = 3, delay = 1000){
    return new Promise(function(resolve, reject){
      (async function attempt(r = retries, d = delay){
        try{
          var url=DBSTATE.baseUrl+'?db='+encodeURIComponent(DBSTATE.dbId);
          var res=await gmFetchJSON(url,{method:'GET'});
          if(!res.json||res.json.error){
              throw new Error('Pull failed. Status '+res.status + (res.json ? ' Error: ' + res.json.error : ''));
          }
          DBSTATE.cache=res.json; if(!DBSTATE.cache.playlists) DBSTATE.cache.playlists={};
          resolve(DBSTATE.cache);
        }catch(e){
            if (r > 0) {
                console.warn(`drivePull failed (Retries left: ${r}). Retrying in ${d}ms.`, e);
                await sleep(d);
                return attempt(r - 1, d * 2);
            }
            reject(e);
        }
      })();
    });
  }

  function drivePush(){
    return new Promise(function(resolve, reject){
      (async function(){
        if(!DBSTATE.cache) return reject(new Error('nothing to push'));

        var putUrl = DBSTATE.baseUrl+'?db='+encodeURIComponent(DBSTATE.dbId)+(DBSTATE.token?('&token='+encodeURIComponent(DBSTATE.token)):'');
        var postUrl= DBSTATE.baseUrl+'?db='+encodeURIComponent(DBSTATE.dbId)+'&op=put'+(DBSTATE.token?('&token='+encodeURIComponent(DBSTATE.token)):'');
        var body   = JSON.stringify(DBSTATE.cache);

        async function tryPut(){ return gmFetchJSON(putUrl,{method:'PUT', headers:{'Content-Type':'application/json'}, data:body}); }
        async function tryPost(){ return gmFetchJSON(postUrl,{method:'POST', headers:{'Content-Type':'application/json'}, data:body}); }
        function ok(r){ return r && r.json && !r.json.error; }
        function isMethodIssue(r){ return !r || r.status===405 || r.status===400 || r.status===0; }

        var r = await tryPut().catch(function(e){ return { json:null, status:0, text:String(e&&e.message||'PUT error') }; });
        if(!ok(r)){
          if(r && r.json && r.json.error==='conflict' && r.json.server){
            DBSTATE.cache=mergeServer_(DBSTATE.cache,r.json.server);
            var r2=await tryPut().catch(function(e){ return { json:null, status:0, text:String(e&&e.message||'PUT retry error') }; });
            if(ok(r2)){ await afterPushBcast(r2); return resolve(true); }
          }
          if(isMethodIssue(r) || (r && r.json && r.json.error)){
            var p = await tryPost().catch(function(e){ return { json:null, status:0, text:String(e&&e.message||'POST error') }; });
            if(!ok(p)){
              if(p && p.json && p.json.error==='conflict' && p.json.server){
                DBSTATE.cache=mergeServer_(DBSTATE.cache,p.json.server);
                var p2=await tryPost().catch(function(e){ return { json:null, status:0, text:String(e&&e.message||'POST retry error') }; });
                if(ok(p2)){ await afterPushBcast(p2); toast('Pushed via POST (fallback)'); return resolve(true); }
                return reject(new Error('push after merge failed (POST)'));
              }
              // Improved error message
              toast('Push failed ('+(p.status||r.status)+')'); return reject(new Error('push failed: POST fallback failure'));
            }
            await afterPushBcast(p); toast('Pushed via POST (fallback)');
            return resolve(true);
          }
          // Improved error message
          toast('Push failed ('+(r.status||'err')+')'); return reject(new Error('push failed: PUT failure'));
        }

        await afterPushBcast(r);
        resolve(true);
      })();
    });
  }

  function afterPushBcast(resp){
    return new Promise(function(resolve, reject){
      (async function(){
        try{
          if(resp && resp.json && resp.json.rev && DBSTATE.cache){
            DBSTATE.cache.sync = DBSTATE.cache.sync || {};
            DBSTATE.cache.sync.rev = resp.json.rev;
            DBSTATE.cache.sync.updatedAt = Date.now();
          }
          localStorage.setItem(REV_BROADCAST_KEY, String(Date.now()));

          // --- CRITICAL FIX: Increased delay before attempting the pull to let the server state settle. ---
          await sleep(3000); // Wait 3 seconds before the first pull attempt.

          await drivePull(3, 1000); // Now drivePull runs with retries if the first attempt fails.

          // Re-update the UI based on the new definitive state (this happens on successful pull inside drivePull)
          // The caller's .then() block handles final UI updates based on the operation

          resolve();
        }catch(e){
          console.error("Failed to re-sync after push:", e);
          // Changed rejection to a more informative error for the caller
          reject(new Error("Push success, but re-sync failed after 3 retries. Check DB connection/status."));
        }
      })();
    });
  }

  function mergeServer_(local, server){
    var out=JSON.parse(JSON.stringify(server));
    out.playlists=out.playlists||{};
    var L=local.playlists||{};
    Object.keys(L).forEach(function(name){
      var pl=L[name];
      var s=out.playlists[name];
      if(!s){
        out.playlists[name]={ savedAt:(pl.savedAt||Date.now()), items:[].concat(pl.items||[]) };
        return;
      }
      var seen=new Set((s.items||[]).map(urlToKey));
      (pl.items||[]).forEach(function(u){
        var k=urlToKey(u);
        if(!seen.has(k)){ s.items.push(u); seen.add(k); }
      });
      s.savedAt=Math.max(s.savedAt||0, pl.savedAt||0);
    });
    return out;
  }

  function usingRemote(){ return DBSTATE.connected && DBSTATE.cache; }

  var _readSaved=readSaved, _writeSaved=writeSaved, _getIndex=getIndex, _setIndex=setIndex;
  readSaved=function(name){ if(!usingRemote()) return _readSaved(name); var p=(DBSTATE.cache.playlists||{})[name]; return p?{savedAt:(p.savedAt||0), items:(p.items||[])}:{savedAt:0,items:[]}; };
  writeSaved=function(name,payload){ if(!usingRemote()) return _writeSaved(name,payload); DBSTATE.cache.playlists=DBSTATE.cache.playlists||{}; DBSTATE.cache.playlists[name]={ savedAt:(payload.savedAt||Date.now()), items:(payload.items||[]) }; };
  getIndex=function(){ return usingRemote()? Object.keys(DBSTATE.cache.playlists).sort(function(a,b){return a.localeCompare(b);}): _getIndex(); };
  setIndex=function(arr){ if(!usingRemote()) return _setIndex(arr); var want=new Set(arr); var all=DBSTATE.cache.playlists||{}; Object.keys(all).forEach(function(k){ if(!want.has(k)) delete all[k]; }); return Array.from(want).sort(function(a,b){return a.localeCompare(b);}); };

  /* ---------------------- GLASS UI (embedded) ---------------------- */
  var selectEl, modeEl, whereAllEl, whereEl, countEl, nameInput, addUrlInput;

  function injectGlassCSS(){
    if($('#ct-savedpl-style')) return;
    var css='';
    css+='#ct-savedpl-panel{position:static !important;width:100% !important;max-width:none !important;margin:8px 0 10px !important;background:rgba(24,24,28,.65);color:#e9ecf1;border:1px solid rgba(255,255,255,.16);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.28);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);overflow:hidden;}';
    css+='#ct-savedpl-header{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.18);}';
    css+='#ct-savedpl-title{font-weight:700;letter-spacing:.2px;}';
    css+='#ct-savedpl-status{margin-left:auto;}';
    css+='.ct-chip{padding:4px 8px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);font-weight:600;}';
    css+='.ct-hstack{display:flex;align-items:center;gap:8px;}';
    css+='.ct-caret{appearance:none;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#e9ecf1;user-select:none;font-size:14px;opacity:.9;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border-radius:8px;cursor:pointer;}';
    css+='.ct-caret svg{width:14px;height:14px;transition:transform .2s ease;}';
    css+='.ct-caret[aria-expanded="false"] svg{transform:rotate(-90deg);}';
    css+='#ct-savedpl-body{transition:max-height .25s ease,opacity .2s ease,padding .2s ease;padding:8px 12px 10px;}';
    css+='#ct-savedpl-panel.ct-collapsed #ct-savedpl-body{max-height:0;opacity:0;padding-top:0;padding-bottom:0;overflow:hidden;}';
    css+='.ct-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:6px 0;}';
    css+='.ct-sep{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);margin:6px 0;}';
    css+='.ct-btn{padding:6px 10px;cursor:pointer;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#e9ecf1;}';
    css+='.ct-btn:hover{background:rgba(255,255,255,.10);}';
    css+='.ct-input,.ct-select{padding:6px 8px;border-radius:10px;min-height:28px;min-width:180px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e9ecf1;}';
    css+='.ct-muted{color:#bac2cf;}';
    var style=document.createElement('style'); style.id='ct-savedpl-style'; document.head.appendChild(style); style.textContent=css;
  }

  function button(label, fn, extraClass){ var b=document.createElement('button'); b.textContent=label; b.className='ct-btn '+(extraClass||''); b.addEventListener('click', fn); return b; }
  var namesDatalist=document.createElement('datalist'); namesDatalist.id='ct-savedpl-names'; document.body.appendChild(namesDatalist);

  function refreshList(names, selectName){
    if(!selectEl) return;
    var currentVal = selectEl.value;
    selectEl.innerHTML='';
    var ph=document.createElement('option'); ph.value=''; ph.textContent='(choose a playlist)'; selectEl.appendChild(ph);
    names.forEach(function(n){ var o=document.createElement('option'); o.value=n; o.textContent=n; selectEl.appendChild(o); });

    // Try to re-select what was selected
    if (selectName && names.includes(selectName)) selectEl.value = selectName;
    else if (currentVal && names.includes(currentVal)) selectEl.value = currentVal;

    namesDatalist.innerHTML='';
    names.forEach(function(n){ var o=document.createElement('option'); o.value=n; namesDatalist.appendChild(o); });
  }

  /* -------- Helper: unify all “connected” UI updates in one call -------- */
  function updateConnectedUI(statusEl, statusChipEl, urlInput, dbInput, tokInput){
    try{
      statusEl.textContent = 'Connected ('+DBSTATE.dbId.slice(0,6)+'…)';
      if (statusChipEl) statusChipEl.textContent = 'Remote';
      if (urlInput) urlInput.value = DBSTATE.baseUrl || '';
      if (dbInput)  dbInput.value  = DBSTATE.dbId   || '';
      if (tokInput) tokInput.value = DBSTATE.token  || '';
      refreshList(getIndex(), '');
    }catch(e){}
  }

  function attachDatabaseUI(container, headerStatusEl){
    var dbWrap=document.createElement('div'); dbWrap.id='ct-db-wrap';
    var head=document.createElement('div'); head.id='ct-db-head';
    var caret=document.createElement('button'); caret.className='ct-caret'; caret.title='Collapse/Expand'; caret.textContent='\u25BE';
    var title=document.createElement('span'); title.className='ct-muted'; title.textContent='Database';
    var statusChip=document.createElement('span'); statusChip.id='ct-db-status'; statusChip.className='ct-chip';
    head.appendChild(caret); head.appendChild(title); head.appendChild(statusChip);

    var section=document.createElement('div'); section.style.transition='max-height .25s ease, opacity .2s ease'; section.style.overflow='hidden';
    var body=document.createElement('div'); body.style.padding='6px 12px 12px'; body.appendChild(section);

    // Connect drawer
    var drawer=document.createElement('div');
    drawer.id='ct-connect-drawer';
    drawer.style.cssText='display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);padding:8px;border-radius:10px;margin-bottom:8px;';
    var urlInput=document.createElement('input'); urlInput.placeholder='Apps Script URL (…/exec)'; urlInput.className='ct-input'; urlInput.style.minWidth='260px';
    var dbInput =document.createElement('input'); dbInput.placeholder='dbId (from cytube_library_*.json)'; dbInput.className='ct-input'; dbInput.style.minWidth='200px';
    var tokInput=document.createElement('input'); tokInput.placeholder='Write Token (optional)'; tokInput.className='ct-input'; tokInput.style.minWidth='160px';

    var connectBtn=button('Connect', function(){
      if(!urlInput.value||!dbInput.value){ toast('Need URL and dbId'); return; }
      DBSTATE.baseUrl=String(urlInput.value).trim(); DBSTATE.dbId=String(dbInput.value).trim(); DBSTATE.token=String(tokInput.value||'').trim(); DBSTATE.connected=true;
      drivePull().then(function(){
        saveConnPerChannel();
        updateConnectedUI(headerStatusEl, statusChip, urlInput, dbInput, tokInput);
        toast('Connected.');
      }).catch(function(e){
        console.error(e); toast('Connect failed'); DBSTATE.connected=false;
      });
    });

    var createBtn=button('Create DB', function(){
      var base=String(urlInput.value||'').trim(); if(!base){ toast('Enter /exec URL'); return; }
      driveInit(base).then(function(newDb){
        DBSTATE.baseUrl=base; DBSTATE.dbId=newDb; DBSTATE.token=String(tokInput.value||'').trim();
        DBSTATE.connected=true; DBSTATE.cache={version:1, playlists:{}, sync:{rev:0,updatedAt:Date.now()}};
        saveConnPerChannel();
        updateConnectedUI(headerStatusEl, statusChip, urlInput, dbInput, tokInput);
        dbInput.value=newDb;
        toast('DB created & connected');
      }).catch(function(e){ console.error(e); toast('Create failed'); });
    });

    var pullBtn=button('Pull', function(){
      if(!DBSTATE.connected){ toast('Not connected'); return; }
      drivePull().then(function(){ refreshList(getIndex(),''); toast('Pulled latest.'); }).catch(function(){ toast('Pull failed'); });
    });
    var pushBtn=button('Push', function(){
      if(!DBSTATE.connected){ toast('Not connected'); return; }
      drivePush().then(function(){ toast('Pushed.'); }).catch(function(e){ toast(String(e && e.message || e)); });
    });

    drawer.appendChild(urlInput); drawer.appendChild(dbInput); drawer.appendChild(tokInput);
    drawer.appendChild(connectBtn); drawer.appendChild(createBtn); drawer.appendChild(pullBtn); drawer.appendChild(pushBtn);

    section.appendChild(drawer);
    dbWrap.appendChild(head); dbWrap.appendChild(body);

    function refreshStatusUI(){ if(DBSTATE.connected){ headerStatusEl.textContent='Connected ('+DBSTATE.dbId.slice(0,6)+'…)'; statusChip.textContent='Remote'; } else { headerStatusEl.textContent='Local (offline)'; statusChip.textContent='Local'; } }
    function syncDbCollapsedUI(){ var collapsed=localStorage.getItem(UIKEY_DB)==='1'; section.style.maxHeight=collapsed?'0px':''; section.style.opacity=collapsed?'0':'1'; dbWrap.classList.toggle('ct-collapsed', collapsed); caret.textContent=collapsed?'\u25B8':'\u25BE'; }

    head.addEventListener('click', function(){ var now=localStorage.getItem(UIKEY_DB)==='1'?'0':'1'; localStorage.setItem(UIKEY_DB, now); syncDbCollapsedUI(); });

    container.appendChild(dbWrap);
    refreshStatusUI(); syncDbCollapsedUI();

    // Autofill inputs if we have a stored connection (for visibility)
    try{
      var per = loadConnPerChannel();
      var last = getLastUsed();
      if(per){ if(per.baseUrl) urlInput.value=per.baseUrl; if(per.dbId) dbInput.value=per.dbId; if(per.token) tokInput.value=per.token; }
      else if(last){ if(last.baseUrl) urlInput.value=last.baseUrl; if(last.dbId) dbInput.value=last.dbId; if(last.token) tokInput.value=last.token; }
    }catch(e){}
  }

  function makeUI(){
    if($('#ct-savedpl-panel')) return;
    injectGlassCSS();

    var panel=document.createElement('div'); panel.id='ct-savedpl-panel';
    var header=document.createElement('div'); header.id='ct-savedpl-header';
    var caret=document.createElement('button'); caret.className='ct-caret'; caret.title='Collapse/Expand'; caret.setAttribute('aria-expanded','true');
    caret.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor"/></svg>';
    var title=document.createElement('div'); title.id='ct-savedpl-title'; title.textContent='Saved Playlists';
    var chan=document.createElement('span'); chan.className='ct-chip'; chan.textContent=channelName;
    var status=document.createElement('div'); status.id='ct-savedpl-status'; status.className='ct-chip'; status.textContent='Local (offline)';
    var stack=document.createElement('div'); stack.className='ct-hstack'; stack.appendChild(caret); stack.appendChild(title);
    header.appendChild(stack); header.appendChild(chan); header.appendChild(status);
    panel.appendChild(header);

    var body=document.createElement('div'); body.id='ct-savedpl-body'; panel.appendChild(body);

    var r1=document.createElement('div'); r1.className='ct-row';
    var r2=document.createElement('div'); r2.className='ct-row';
    var r3=document.createElement('div'); r3.className='ct-row';
    var r4=document.createElement('div'); r4.className='ct-row';
    var r5=document.createElement('div'); r5.className='ct-row';

    selectEl=document.createElement('select'); selectEl.className='ct-select'; selectEl.style.minWidth='180px';
    modeEl=document.createElement('select'); modeEl.className='ct-select'; modeEl.innerHTML='<option value="replace">Replace</option><option value="append">Append</option>';

    // Where selector for Load (All)
    whereAllEl=document.createElement('select'); whereAllEl.className='ct-select';
    whereAllEl.innerHTML='<option value="next">Next</option><option value="end" selected>End</option>';

    var loadBtn=button('Load (All)', function(){ loadWhole(selectEl.value, modeEl.value, whereAllEl.value); });
    var delBtn=button('Delete', function(){ deleteName(selectEl.value); });
    r1.appendChild(selectEl); r1.appendChild(modeEl); r1.appendChild(whereAllEl); r1.appendChild(loadBtn); r1.appendChild(delBtn);

    whereEl=document.createElement('select'); whereEl.className='ct-select'; whereEl.innerHTML='<option value="next">Next</option><option value="end">End</option>';
    countEl=document.createElement('input'); countEl.type='number'; countEl.min='1'; countEl.value='5'; countEl.className='ct-input'; countEl.style.width='72px';
    var randomWrap=document.createElement('label'); randomWrap.className='ct-chip'; randomWrap.style.cursor='pointer';
    var randomCb=document.createElement('input'); randomCb.type='checkbox'; randomCb.checked=true; randomCb.style.marginRight='6px';
    randomWrap.appendChild(randomCb); randomWrap.appendChild(document.createTextNode('Random'));
    var addNBtn=button('Add N', function(){ var n=parseInt(countEl.value||'5',10); var where=whereEl.value; addNFromSaved(selectEl.value,n,where,randomCb.checked); });
    r2.appendChild(whereEl); r2.appendChild(countEl); r2.appendChild(randomWrap); r2.appendChild(addNBtn);

    nameInput=document.createElement('input'); nameInput.placeholder='New playlist name'; nameInput.setAttribute('list','ct-savedpl-names'); nameInput.className='ct-input'; nameInput.style.minWidth='180px';
    var saveBtn=button('Save As', function(){ saveAs(nameInput.value.trim()); });
    var newEmptyBtn=button('New Empty', function(){ createNewEmptyPlaylist(nameInput.value.trim(), true); });
    r3.appendChild(nameInput); r3.appendChild(saveBtn); r3.appendChild(newEmptyBtn);

    addUrlInput=document.createElement('input'); addUrlInput.placeholder='URL to add to saved'; addUrlInput.className='ct-input'; addUrlInput.style.minWidth='260px';
    var addUrlBtn=button('Add URL', function(){ appendUrlToSaved(selectEl.value, addUrlInput.value); });
    var addCurrentBtn=button('Add Current', function(){ appendCurrentQueueToSaved(selectEl.value); });
    var editBtn=button('Open Editor', function(){ openEditor(selectEl.value); });
    r4.appendChild(addUrlInput); r4.appendChild(addUrlBtn); r4.appendChild(addCurrentBtn); r4.appendChild(editBtn);

    function exportAll(){
      var allData = {};
      var allNames = getIndex();
      allNames.forEach(function(name){
        allData[name] = readSaved(name);
      });
      var blob = new Blob([JSON.stringify({version:1, data:allData}, null, 2)], {type:'application/json'});
      var a = document.createElement('a');
      a.download = 'cytube_saved_playlists_'+channelName+'_'+Date.now()+'.json';
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
      toast('Exported '+allNames.length+' playlists.');
    }

    var exportBtn=button('Export', exportAll);
    var importInput=document.createElement('input'); importInput.type='file'; importInput.accept='.json'; importInput.style.display='none';
    importInput.addEventListener('change', function(e){ var f=(e.target && e.target.files && e.target.files[0]) ? e.target.files[0] : null; if(f) importAll(f); e.target.value=''; });
    var importBtn=button('Import', function(){ importInput.click(); });
    r5.appendChild(exportBtn); r5.appendChild(importBtn); r5.appendChild(importInput);

    function divSep(){ var d=document.createElement('div'); d.className='ct-sep'; return d; }
    body.appendChild(r1); body.appendChild(divSep()); body.appendChild(r2); body.appendChild(divSep()); body.appendChild(r3); body.appendChild(divSep()); body.appendChild(r4); body.appendChild(divSep()); body.appendChild(r5); body.appendChild(divSep());

    attachDatabaseUI(body, status);

    function findPM(){ return document.querySelector('#playlistmanager') || document.querySelector('#rightpane #playlistmanager') || document.querySelector('#rightpane .well:last-of-type'); }
    function ensureMounted(node){ var pm=findPM(); if(!pm) return false; if(node.nextElementSibling!==pm){ pm.parentElement.insertBefore(node, pm); } return true; }
    if(!ensureMounted(panel)) setTimeout(function(){ ensureMounted(panel); }, 300);
    var host=document.querySelector('#rightpane') || document.body; new MutationObserver(function(){ ensureMounted(panel); }).observe(host,{childList:true,subtree:true});

    refreshList(getIndex(), '');

    function syncMainCollapsedUI(){
      var collapsed = localStorage.getItem(UIKEY_MAIN)==='1';
      caret.setAttribute('aria-expanded', String(!collapsed));
      panel.classList.toggle('ct-collapsed', collapsed);
      body.style.maxHeight=collapsed?'0px':''; body.style.opacity=collapsed?'0':'1';
    }
    caret.addEventListener('click', function(){ var now = localStorage.getItem(UIKEY_MAIN)==='1' ? '0' : '1'; localStorage.setItem(UIKEY_MAIN, now); syncMainCollapsedUI(); });
    syncMainCollapsedUI();

    /* ------------------ AUTO-CONNECT (fixed) ------------------ */
    (function autoConnect(){

      // references inside DB drawer
      var dbWrap = document.querySelector('#ct-db-wrap');
      var statusChipEl = dbWrap ? dbWrap.querySelector('#ct-db-status') : null;
      var urlInput = dbWrap ? dbWrap.querySelector('input[placeholder^="Apps Script URL"]') : null;
      var dbInput  = dbWrap ? dbWrap.querySelector('input[placeholder^="dbId"]') : null;
      var tokInput = dbWrap ? dbWrap.querySelector('input[placeholder^="Write Token"]') : null;

      function tryConnectFrom(rec, label){
        return new Promise(function(resolve, reject){
          (async function(){ // Internal async block
            if (!rec || !rec.baseUrl || !rec.dbId) return resolve(false);
            DBSTATE.baseUrl=rec.baseUrl; DBSTATE.dbId=rec.dbId; DBSTATE.token=rec.token||''; DBSTATE.connected=true;
            try{
              // Using the now-retrying drivePull
              await drivePull();

              if(!DBSTATE.cache || !DBSTATE.cache.playlists) throw new Error('no cache');
              saveConnPerChannel();
              updateConnectedUI(status, statusChipEl, urlInput, dbInput, tokInput);
              toast('DB auto-connected ('+label+').');
              resolve(true);
            }catch(e){
              console.error('autoConnect tryConnectFrom failed:', e);
              DBSTATE.connected=false;
              resolve(false);
            }
          })();
        });
      }

      // The execution chain
      tryConnectFrom(loadConnPerChannel(), 'channel')
        .then(function(connected){
          if(connected) return;
          return tryConnectFrom(getLastUsed(), 'last used');
        })
        .then(function(connected){
          if(connected) return;
          var regAll = (function(){ try{ return JSON.parse(localStorage.getItem('ct_db_registry')||'{}'); }catch(e){ return {}; } })();
          var bases = Object.keys(regAll||{});
          if (bases.length===1){
            var base=bases[0], rec=regAll[base];
            return tryConnectFrom({ baseUrl: base, dbId: rec && rec.dbId, token: rec && rec.token }, 'registry');
          }
        })
        .catch(function(e){
          DBSTATE.connected=false;
          toast('Auto-connect failed; use Connect.');
        });
    })();
    /* ---------------------------------------------------------- */

    /* ------------------ Periodic Refresh ------------------ */
    setInterval(function(){
      if(DBSTATE.connected){
        // drivePull updates DBSTATE.cache on success. We then update the UI list.
        drivePull().then(function(){
          refreshList(getIndex(), selectEl.value);
        }).catch(function(e){
          // Avoid spamming user with toast, just log the error
          console.error("Periodic pull failed:", e);
        });
      }
    }, 25000); // 25 seconds
    /* ---------------------------------------------------------- */

    try{
      window.addEventListener('storage', function(e){ if(e && e.key===REV_BROADCAST_KEY){ /* optionally: auto-pull */ } });
    }catch(e){}
  }

  function maybeBroadcast(){ try{ localStorage.setItem(REV_BROADCAST_KEY, String(Date.now())); }catch(e){} }

  if(document.readyState==='complete' || document.readyState==='interactive') makeUI();
  else document.addEventListener('DOMContentLoaded', makeUI);

})();
