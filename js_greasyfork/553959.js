// ==UserScript==
// @name         SxyPrn UI Update Video Layout and Wicked Tab
// @namespace    http://tampermonkey.net/
// @version      1.4
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sxyprn.com
// @description  Well utilised screen & select videos and open them all in one SxyPrn Wicked Tab!
// @author       6969RandomGuy6969
// @match        https://sxyprn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @connect      sxyprn.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553959/SxyPrn%20UI%20Update%20Video%20Layout%20and%20Wicked%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/553959/SxyPrn%20UI%20Update%20Video%20Layout%20and%20Wicked%20Tab.meta.js
// ==/UserScript==

(()=>{'use strict';
const KEY='sxyprn_grid_videos',SEL_KEY='sxyprn_selections',IS_GRID=new URLSearchParams(location.search).get('gridview')==='true',SKIP=['/post/','/community/','/blog/'];
if(!IS_GRID&&SKIP.some(p=>location.pathname.startsWith(p)))return;

const state={sel:[],obs:null,vis:false},
store={
    get:()=>{try{return JSON.parse(localStorage[KEY]||'[]')}catch{return[]}},
    set:d=>{try{localStorage[KEY]=JSON.stringify(d);return 1}catch{return 0}},
    clr:()=>delete localStorage[KEY],
    getSel:()=>{try{return JSON.parse(localStorage[SEL_KEY]||'[]')}catch{return[]}},
    setSel:d=>{try{localStorage[SEL_KEY]=JSON.stringify(d);return 1}catch{return 0}},
    clrSel:()=>delete localStorage[SEL_KEY]
};

const share={
    encode:videos=>{
        const data=JSON.stringify(videos);
        return btoa(unescape(encodeURIComponent(data)));
    },
    decode:code=>{
        try{
            const data=decodeURIComponent(escape(atob(code)));
            return JSON.parse(data);
        }catch{return null}
    },
    getUrl:code=>`${location.origin}/?gridview=true&share=${encodeURIComponent(code)}&t=${Date.now()}`
};

GM_addStyle(IS_GRID?`
*{margin:0;padding:0;box-sizing:border-box}
body{background:#24272f!important;font-family:monospace;overflow-x:hidden;color:#fff;font-size:13px}
::-webkit-scrollbar{width:12px;height:12px}
::-webkit-scrollbar-track{background:#1a1d24}
::-webkit-scrollbar-thumb{background:#4a4d55;border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:#5a5d65}
*{scrollbar-width:thin;scrollbar-color:#4a4d55 #1a1d24}
#grid-header{background:rgba(36,39,47,.95);border-bottom:1px solid rgba(255,255,255,.2);padding:20px 32px;color:#fff;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.6);position:sticky;top:0;z-index:100}
#grid-header h2{font-size:20px;font-family:monospace;display:flex;align-items:center;gap:12px}
#grid-header h2::before{content:"▶";color:#00e;font-size:16px}
#close-grid-btn,#refresh-all-btn,#share-tab-btn{background:#24272f;color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 24px;border-radius:0;cursor:pointer;font-family:monospace;font-size:13px;transition:all .2s;outline:none;margin-left:10px}
#close-grid-btn:hover,#refresh-all-btn:hover,#share-tab-btn:hover{background:#34373f;border-color:rgba(255,255,255,.35);transform:translateY(-2px)}
#refresh-all-btn{background:#1a4d7a}
#refresh-all-btn:hover{background:#2563a8}
#share-tab-btn{background:#1a7a4d}
#share-tab-btn:hover{background:#25a863}
#grid-viewer-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:24px;padding:32px;max-width:100%;margin:0 auto}
.video-grid-item{background:rgba(36,39,47,.95);border:1px solid rgba(255,255,255,.15);overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.6);transition:all .3s;position:relative}
.video-grid-item:hover{transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,0,0,.8);border-color:rgba(0,0,238,.4)}
.video-refresh-btn,.video-close-btn{position:absolute;top:10px;background:rgba(26,77,122,.9);color:#fff;border:1px solid rgba(255,255,255,.3);padding:8px 16px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:12px;z-index:10;transition:all .2s;display:none}
.video-refresh-btn{right:10px}
.video-close-btn{right:110px;background:rgba(122,26,26,.9)}
.video-close-btn:hover{background:rgba(168,37,37,.9);transform:scale(1.05)}
.video-grid-item.has-error .video-refresh-btn{display:block}
.video-grid-item:hover .video-close-btn{display:block}
.video-refresh-btn:hover{background:rgba(37,99,168,.9);transform:scale(1.05)}
.video-grid-item video,.video-grid-item iframe{width:100%;height:auto;aspect-ratio:16/9;background:#000;display:block}
.video-grid-loading{width:100%;aspect-ratio:16/9;background:rgba(36,39,47,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#888;gap:16px;font-family:monospace}
.video-grid-loading::before{content:"";width:40px;height:40px;border:3px solid rgba(0,0,238,.2);border-top-color:#00e;border-radius:50%;animation:spin 1s linear infinite}
.video-grid-error{width:100%;aspect-ratio:16/9;background:rgba(36,39,47,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f44;gap:12px;font-family:monospace;padding:20px;text-align:center}
.video-grid-error::before{content:"⚠";font-size:48px;color:#f44}
@keyframes spin{to{transform:rotate(360deg)}}
.video-grid-title{padding:16px 20px;color:#fff;font-size:13px;font-family:monospace;line-height:1.5;transition:all .2s;cursor:pointer;text-decoration:none;display:block;background:rgba(255,255,255,.02)}
.video-grid-title:hover{color:#00e;background:rgba(0,0,238,.1)}
#share-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.85);z-index:10000;display:none;align-items:center;justify-content:center}
#share-modal.visible{display:flex}
.share-content{background:#24272f;border:1px solid rgba(255,255,255,.2);padding:30px;border-radius:8px;max-width:600px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.8)}
.share-content h3{margin-bottom:20px;color:#fff;font-size:18px}
.share-content textarea{width:100%;background:#1a1d24;color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px;font-family:monospace;font-size:12px;border-radius:4px;resize:vertical;min-height:120px;margin-bottom:15px}
.share-content textarea::-webkit-scrollbar{width:8px}
.share-content textarea::-webkit-scrollbar-track{background:#0f1116}
.share-content textarea::-webkit-scrollbar-thumb{background:#4a4d55;border-radius:4px}
.share-content textarea::-webkit-scrollbar-thumb:hover{background:#5a5d65}
.share-content button{background:#1a7a4d;color:#fff;border:1px solid rgba(255,255,255,.2);padding:10px 20px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:13px;margin-right:10px;transition:all .2s}
.share-content button:hover{background:#25a863;transform:translateY(-2px)}
.share-content button.secondary{background:#24272f}
.share-content button.secondary:hover{background:#34373f}
.share-info{color:#888;font-size:11px;margin-top:10px;line-height:1.5}
@media(min-width:3200px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}}
@media(min-width:2800px)and (max-width:3199px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:22px}}
@media(min-width:2400px)and (max-width:2799px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:22px}}
@media(min-width:2000px)and (max-width:2399px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:24px}}
@media(min-width:1600px)and (max-width:1999px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:24px}}
@media(min-width:1200px)and (max-width:1599px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:24px}}
@media(min-width:900px)and (max-width:1199px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:20px;padding:24px}}
@media(min-width:600px)and (max-width:899px){#grid-viewer-container{grid-template-columns:repeat(auto-fit,minmax(350px,1fr));padding:24px;gap:20px}}
@media(max-width:599px){#grid-viewer-container{grid-template-columns:1fr;padding:20px;gap:16px}#grid-header{padding:16px 20px}#grid-header h2{font-size:18px}#close-grid-btn{padding:10px 20px}}
`:`
:root{--bg:#181a1f;--txt:#e0e0e0;--card:#1f2129;--sh:rgba(0,0,0,.4);--shh:rgba(0,0,0,.6);--hi:#4A90E2;--tit:#f1f1f1;--met:#999;--w:clamp(180px,16vw,280px)}
body{margin:0!important;padding:0!important;max-width:100%!important;width:100%!important}
#wrapper_div{margin:0!important;padding:0!important;max-width:100%!important;width:100%!important}
.container:not(#top_panel_menu):not(#top_panel_hsa){display:flex!important;flex-wrap:wrap;justify-content:flex-start;gap:10px;padding:15px;box-sizing:border-box;margin:0!important;max-width:100%!important;width:100%!important}
.post_el_small{display:inline-block;position:relative;width:var(--w);margin:4px;background:var(--card);overflow:hidden;box-shadow:0 4px 18px var(--sh);cursor:pointer;text-align:left;aspect-ratio:4/3;transition:transform .25s,box-shadow .25s}
.post_el_small:hover{transform:translateY(-5px);box-shadow:0 8px 24px var(--shh)}
.post_el_small img{width:100%;height:70%;object-fit:cover;transition:transform .3s}
.post_el_small:hover img{transform:scale(1.05)}
.post_el_small .title{padding:8px 12px;color:var(--tit);font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.post_el_small .meta{padding:0 12px 10px;color:var(--met);font-size:12px}
.post_el_small::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55),transparent);opacity:0;transition:opacity .3s;pointer-events:none}
.post_el_small:hover::after{opacity:1}
.grid-select-overlay{position:absolute;top:10px;left:10px;width:28px;height:28px;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;opacity:0;transition:all .2s;z-index:10;pointer-events:none}
body.panel-active .post_el_small:hover .grid-select-overlay{opacity:1}
body.panel-active .post_el_small.selected .grid-select-overlay{opacity:1;background:rgba(74,144,226,.9);border-color:var(--hi);color:#fff;box-shadow:0 4px 15px rgba(74,144,226,.4)}
.post_el_small.selected::before{content:"";position:absolute;inset:0;border:3px solid var(--hi);pointer-events:none;z-index:5;box-shadow:0 0 20px rgba(74,144,226,.3)}
#grid-toggle-btn{background:transparent;color:#e0e0e0;border:none;padding:0;cursor:pointer;font-size:inherit;transition:all .3s;display:inline-block;vertical-align:middle;order:999}
#grid-toggle-btn:hover{color:#fff}
#grid-toggle-btn span:first-child{background:linear-gradient(90deg,#fff,#e0e0e0,#fff,#f0f0f0,#fff);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:rgb 3s linear infinite;font-weight:900;filter:drop-shadow(0 0 3px rgba(255,255,255,.6));margin-right:8px}
@keyframes rgb{to{background-position:200% 50%}}
#grid-toggle-btn:hover span:first-child{filter:drop-shadow(0 0 10px rgba(255,255,255,.9));animation:rgb 1.5s linear infinite}
#grid-toggle-btn .badge{background:rgba(74,144,226,.9);color:#fff;padding:2px 6px;border-radius:10px;font-size:11px;font-weight:700;min-width:18px;text-align:center;display:inline-block}
#grid-toggle-btn.has-selection .badge{animation:pulse 2s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.15)}}
#grid-control-panel{position:fixed;bottom:30px;left:30px;background:rgba(31,33,41,.95);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px 20px;box-shadow:0 20px 40px rgba(0,0,0,.6);z-index:10000;display:none!important;flex-direction:column;gap:10px;min-width:200px}
#grid-control-panel.visible{display:flex!important;animation:slideUp .3s}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.grid-btn{background:rgba(40,40,40,.8);backdrop-filter:blur(10px);color:#e0e0e0;border:1px solid rgba(255,255,255,.15);padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:500;font-size:13px;transition:all .2s;outline:none}
.grid-btn:hover{background:rgba(60,60,60,.9);border-color:rgba(255,255,255,.25);transform:translateY(-2px)}
.grid-btn.primary{background:rgba(74,144,226,.8);border-color:rgba(74,144,226,.6)}
.grid-btn.primary:hover{background:rgba(74,144,226,1);box-shadow:0 4px 15px rgba(74,144,226,.4)}
.grid-counter{text-align:center;color:#fff;font-size:14px;padding:8px;font-weight:600;margin-bottom:4px;background:rgba(74,144,226,.1);border-radius:6px}
@media(min-width:2400px){.post_el_small{width:clamp(140px,11vw,200px)}}
@media(min-width:2000px)and (max-width:2399px){.post_el_small{width:clamp(150px,12vw,220px)}}
@media(min-width:1650px)and (max-width:1999px){.post_el_small{width:clamp(150px,13vw,230px)}}
@media(min-width:1500px)and (max-width:1649px){.post_el_small{width:clamp(150px,14vw,240px)}}
@media(min-width:1200px)and (max-width:1499px){.post_el_small{width:clamp(160px,15vw,260px)}}
@media(max-width:900px){.post_el_small{width:48%}}
@media(max-width:600px){.post_el_small{width:100%}}
`);

const ui={
    upd:()=>{
        const b=document.getElementById('grid-toggle-btn'),bg=b?.querySelector('.badge');
        if(!b||!bg)return;
        bg.textContent=state.sel.length;
        if(state.sel.length>0){b.classList.add('has-selection');bg.style.display='inline-block'}
        else{b.classList.remove('has-selection');bg.style.display='none'}
    },
    btn:()=>{
        const mk=()=>{
            const menu=document.getElementById('top_panel_menu');
            if(menu){
                if(document.getElementById('grid-toggle-btn'))return;
                const sp=document.createElement('span');
                sp.id='grid-toggle-btn';sp.className='transition';
                sp.style.cssText='cursor:pointer;display:inline-block;border-left:2px solid aliceblue;padding-left:10px;margin-left:10px;';
                sp.innerHTML='<span style="padding-left:0px;">SxyPrn Wicked Tab</span><span class="badge" style="display:none">0</span>';
                const splitter=menu.querySelector('.splitter.spl2');
                if(splitter){menu.insertBefore(sp,splitter)}else{menu.appendChild(sp)}
                sp.onclick=h.tog;
            }else{setTimeout(mk,500)}
        };
        setTimeout(mk,1500);
    },
    pan:()=>{
        const p=document.createElement('div');
        p.id='grid-control-panel';
        p.innerHTML='<div class="grid-counter">Selected: <span id="grid-count">0</span></div><button class="grid-btn primary" id="open-grid-btn">Open SxyPrn Wicked Tab</button><button class="grid-btn" id="clear-selection-btn">Clear Selection</button>';
        document.body.appendChild(p);
        p.querySelector('#open-grid-btn').onclick=h.opn;
        p.querySelector('#clear-selection-btn').onclick=h.clr;
    },
    shareModal:()=>{
        const m=document.createElement('div');
        m.id='share-modal';
        m.innerHTML=`<div class="share-content"><h3>Share Your Collection</h3><textarea id="share-code" readonly placeholder="Your share link will appear here..."></textarea><div><button id="copy-url-btn">Copy Link</button><button class="secondary" id="close-share-btn">Close</button></div><div class="share-info">Share this link with friends. They can open it to load your collection!</div></div>`;
        document.body.appendChild(m);
        m.onclick=e=>{if(e.target===m)m.classList.remove('visible')};
        m.querySelector('#close-share-btn').onclick=()=>m.classList.remove('visible');
        m.querySelector('#copy-url-btn').onclick=()=>{
            const ta=document.getElementById('share-code'),url=ta.value;
            try{GM_setClipboard?GM_setClipboard(url):navigator.clipboard.writeText(url);alert('Share link copied to clipboard!')}
            catch{ta.select();document.execCommand('copy');alert('Share link copied to clipboard!')}
        };
    }
},
h={
    tog:()=>{
        const p=document.getElementById('grid-control-panel');
        if(!p)return;
        state.vis=!state.vis;
        p.classList.toggle('visible',state.vis);
        document.body.classList.toggle('panel-active',state.vis);
        if(state.vis){const c=document.getElementById('grid-count');c&&(c.textContent=state.sel.length)}
    },
    sel:(c,u,t,e)=>{
        e?.preventDefault();e?.stopPropagation();
        const i=state.sel.findIndex(v=>v.url===u);
        i>-1?(state.sel.splice(i,1),c.classList.remove('selected')):(state.sel.push({url:u,title:t}),c.classList.add('selected'));
        store.setSel(state.sel);
        ui.upd();
        if(state.vis){const ct=document.getElementById('grid-count');ct&&(ct.textContent=state.sel.length)}
    },
    opn:()=>{
        if(!state.sel.length){alert('No videos selected! Right-click or Ctrl+Click videos to add them to your SxyPrn Wicked Tab.');return}
        const u=[...new Map(state.sel.map(v=>[v.url,v])).values()];
        if(!store.set(u)){alert('Failed to save videos');return}
        try{GM_openInTab(`${location.origin}/?gridview=true&t=${Date.now()}`,{active:1,insert:1})}catch{alert('Failed to open SxyPrn Wicked Tab')}
    },
    clr:()=>{
        state.sel=[];
        store.clrSel();
        ui.upd();
        if(state.vis){const c=document.getElementById('grid-count');c&&(c.textContent='0')}
        document.querySelectorAll('.post_el_small.selected').forEach(c=>c.classList.remove('selected'));
    },
    share:()=>{
        const v=store.get();
        if(!v.length){alert('No videos in current tab to share!');return}
        const code=share.encode(v);
        const url=share.getUrl(code);
        document.getElementById('share-code').value=url;
        document.getElementById('share-modal').classList.add('visible');
    },
    key:e=>{
        if((e.key==='g'||e.key==='G')&&!e.ctrlKey&&!e.metaKey&&state.sel.length>0)h.opn();
        if((e.key==='w'||e.key==='W')&&!e.ctrlKey&&!e.metaKey)h.tog();
        if(e.key==='Escape'&&state.vis)h.tog();
    },
    remove:(idx)=>{
        const v=store.get();
        v.splice(idx,1);
        store.set(v);
        location.reload();
    }
},
proc=()=>{
    document.querySelectorAll('.post_el_small:not([data-processed])').forEach(c=>{
        c.dataset.processed='1';
        const l=c.querySelector('a.js-pop[href*="/post/"]');
        if(!l?.href.includes('/post/'))return;
        const u=l.href,pt=c.querySelector('.post_text'),
        t=pt?pt.textContent.replace(/\bNEW\b/g,'').replace(/\s+/g,' ').trim().split('#')[0]?.trim().substring(0,80)||'Untitled':'Untitled',
        o=document.createElement('div');
        o.className='grid-select-overlay';o.innerHTML='✓';c.appendChild(o);
        state.sel.some(v=>v.url===u)&&c.classList.add('selected');
        c.onclick=e=>{
            const cl=e.target.closest('a');
            if(cl&&!cl.classList.contains('js-pop'))return;
            if((e.ctrlKey||e.metaKey)&&state.vis){h.sel(c,u,t,e)}
            else if(!e.ctrlKey&&!e.metaKey){location.href=u}
        };
        c.oncontextmenu=e=>{if(state.vis){h.sel(c,u,t,e)}};
    });
},
grid=()=>{
    const params=new URLSearchParams(location.search);
    const sharedCode=params.get('share');
    let v=[];
    if(sharedCode){
        v=share.decode(sharedCode);
        if(v){store.set(v)}else{alert('Invalid share code!');v=store.get()}
    }else{v=store.get()}
    document.body.innerHTML='<div style="padding:40px;text-align:center;color:#fff;font-family:monospace"><h2>Loading videos...</h2></div>';
    if(!v.length){
        document.body.innerHTML='<div style="padding:40px;text-align:center;color:#fff;font-family:monospace"><h2>Nothing here… yet</h2><p>Come back and grab all those wicked videos first. This tab\'s getting impatient.</p><button onclick="window.close()" style="margin-top:20px;padding:10px 20px;background:#24272f;color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;font-family:monospace">Close</button></div>';
        return;
    }
    document.body.innerHTML=`<div id="grid-header"><h2>SxyPrn Wicked Tab (${v.length} Videos)</h2><div><button id="share-tab-btn">Share Tab</button><button id="refresh-all-btn">Refresh All</button><button id="close-grid-btn">Close Tab</button></div></div><div id="grid-viewer-container"></div>`;
    document.getElementById('close-grid-btn').onclick=()=>window.close();
    document.getElementById('refresh-all-btn').onclick=()=>location.reload();
    document.getElementById('share-tab-btn').onclick=h.share;
    ui.shareModal();
    const con=document.getElementById('grid-viewer-container');
    const loadVideo=(vid,i,it)=>{
        GM_xmlhttpRequest({
            method:'GET',url:vid.url,timeout:10000,
            onload:r=>{
                try{
                    const d=new DOMParser().parseFromString(r.responseText,'text/html'),
                    p=d.querySelector('video source')||d.querySelector('video'),
                    s=p?.src||p?.getAttribute('src');
                    if(s){
                        const vd=document.createElement('video');
                        vd.controls=1;vd.style.cssText='width:100%;height:auto;aspect-ratio:16/9;background:#000';
                        vd.innerHTML=`<source src="${s}">`;
                        it.querySelector('div').replaceWith(vd);
                        it.classList.remove('has-error');return;
                    }
                }catch{}
                const ifr=document.createElement('iframe');
                ifr.src=vid.url;ifr.style.cssText='width:100%;height:auto;aspect-ratio:16/9;border:none;background:#000';
                ifr.allowFullscreen=1;ifr.allow='autoplay';
                it.querySelector('div').replaceWith(ifr);
                it.classList.remove('has-error');
            },
            onerror:()=>{
                const err=document.createElement('div');
                err.className='video-grid-error';
                err.innerHTML=`<span>Failed to load video</span><small style="color:#888">SSL handshake failed or network error</small>`;
                it.querySelector('div').replaceWith(err);
                it.classList.add('has-error');
            },
            ontimeout:()=>{
                const err=document.createElement('div');
                err.className='video-grid-error';
                err.innerHTML=`<span>Request timed out</span><small style="color:#888">Try refreshing</small>`;
                it.querySelector('div').replaceWith(err);
                it.classList.add('has-error');
            }
        });
    };
    v.forEach((vid,i)=>{
        const it=document.createElement('div');
        it.className='video-grid-item';
        it.innerHTML=`<button class="video-close-btn" data-idx="${i}">✕ Remove</button><button class="video-refresh-btn">↻ Reload</button><div class="video-grid-loading"><span>Loading video ${i+1}...</span></div><a href="${vid.url}" target="_blank" class="video-grid-title">${vid.title}</a>`;
        con.appendChild(it);
        it.querySelector('.video-close-btn').onclick=(e)=>{
            e.stopPropagation();
            if(confirm('Remove this video from the collection?')){h.remove(i)}
        };
        it.querySelector('.video-refresh-btn').onclick=()=>{
            const loading=document.createElement('div');
            loading.className='video-grid-loading';
            loading.innerHTML=`<span>Reloading video ${i+1}...</span>`;
            it.querySelector('div').replaceWith(loading);
            it.classList.remove('has-error');
            loadVideo(vid,i,it);
        };
        loadVideo(vid,i,it);
    });
},
init=()=>{
    if(IS_GRID){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',grid):grid();return}
    const st=()=>{
        state.sel=store.getSel();
        ui.btn();ui.pan();proc();
        const c=document.querySelector('.container');
        c&&(state.obs=new MutationObserver(proc),state.obs.observe(c,{childList:1,subtree:1}));
        document.addEventListener('keydown',h.key);
    };
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',st):st();
};
init();
})();