// ==UserScript==
// @name         Universal Script Interceptor v1.5 i18n + UA logo + autoupdate
// @namespace    https://example.com/
// @version      1.5
// @description  Перехват скриптов с виджетом, ZIP экспортом, сворачиванием, переводом, логотип UA и автообновлением
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550832/Universal%20Script%20Interceptor%20v15%20i18n%20%2B%20UA%20logo%20%2B%20autoupdate.user.js
// @updateURL https://update.greasyfork.org/scripts/550832/Universal%20Script%20Interceptor%20v15%20i18n%20%2B%20UA%20logo%20%2B%20autoupdate.meta.js
// ==/UserScript==

(function() {
'use strict';
if(window.__universalInterceptorActive) return;

// ---------- Настройки ----------
const CURRENT_VERSION = '1.5';
const UPDATE_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/universal_interceptor.user.js';
const store = new Map();
let idCounter=1;
const nowISO=()=>new Date().toISOString();
const makeId=()=>idCounter.toString().padStart(4,'0');

// ---------- Языки ----------
const LANGS={
    ru:{title:'Script Interceptor', clear:'Очистить', export:'Экспорт ZIP', collapse:'[–]', expand:'[+]', noScripts:'Нет скриптов для экспорта', scriptLabel:'скрипт', bytes:'байт'},
    ua:{title:'Перехоплювач скриптів', clear:'Очистити', export:'Експорт ZIP', collapse:'[–]', expand:'[+]', noScripts:'Немає скриптів для експорту', scriptLabel:'скрипт', bytes:'байт'},
    en:{title:'Script Interceptor', clear:'Clear', export:'Export ZIP', collapse:'[–]', expand:'[+]', noScripts:'No scripts to export', scriptLabel:'script', bytes:'bytes'}
};
let lang=localStorage.getItem('__si_widgetLang')||'ru';
let collapsed=JSON.parse(localStorage.getItem('__si_widgetCollapsed'))||false;

// ---------- Виджет ----------
const widget=document.createElement('div');
widget.id='__scriptInterceptorWidget';
widget.style.position='fixed';
widget.style.right='10px';
widget.style.bottom='10px';
widget.style.width='340px';
widget.style.maxHeight='420px';
widget.style.overflowY='auto';
widget.style.background='rgba(0,0,0,0.9)';
widget.style.color='#0f0';
widget.style.fontSize='12px';
widget.style.padding='8px';
widget.style.zIndex=2147483647;
widget.style.borderRadius='8px';
widget.style.fontFamily='monospace';
widget.style.resize='both';
widget.style.overflow='auto';
widget.style.cursor='move';
widget.style.boxShadow='0 0 10px rgba(0,255,0,0.5)';
document.body.appendChild(widget);

// ---------- Функции ----------
function saveScript({url='(inline)', type='script', content='', origin=''}={}){
    for(const v of store.values()) if((v.url===url)&&(v.content===content)) return;
    const id = makeId(); idCounter++;
    store.set(id,{id,url,type,content,timestamp:nowISO(),size:content?content.length:0,origin});
    updateWidget();
}

function updateWidget(){
    widget.innerHTML='';
    const txt=LANGS[lang];

    // Header с логотипом и кнопками
    const header=document.createElement('div'); header.style.display='flex'; header.style.justifyContent='space-between'; header.style.alignItems='center';

    const title=document.createElement('b'); title.textContent=txt.title;
    header.appendChild(title);

    const logo=document.createElement('span');
    logo.textContent='🟦🟨 Зроблено в Україні';
    logo.style.marginLeft='6px';
    logo.style.fontSize='10px';
    logo.style.color='#FFD700';
    header.appendChild(logo);

    const btnContainer=document.createElement('div');

    const collapseBtn=document.createElement('button'); collapseBtn.textContent=collapsed?txt.expand:txt.collapse;
    collapseBtn.onclick=()=>{collapsed=!collapsed; localStorage.setItem('__si_widgetCollapsed',JSON.stringify(collapsed)); updateWidget();};
    btnContainer.appendChild(collapseBtn);

    const langSelect=document.createElement('select'); langSelect.style.marginLeft='4px';
    Object.keys(LANGS).forEach(k=>{ const opt=document.createElement('option'); opt.value=k; opt.text=k.toUpperCase(); if(k===lang) opt.selected=true; langSelect.appendChild(opt);});
    langSelect.onchange=()=>{lang=langSelect.value; localStorage.setItem('__si_widgetLang',lang); updateWidget();};
    btnContainer.appendChild(langSelect);

    header.appendChild(btnContainer);
    widget.appendChild(header);

    if(!collapsed){
        store.forEach(s=>{
            const link=document.createElement('a'); link.href='#';
            const label=s.url==='(inline)'?'(inline script)':`${txt.scriptLabel} ${s.url}`;
            link.textContent=`#${s.id} ${label} (${s.size} ${txt.bytes})`;
            link.style.color='#0f0'; link.style.display='block'; link.style.marginBottom='2px';
            link.onclick=e=>{e.preventDefault(); downloadSingle(s);};
            widget.appendChild(link);
        });
        const btns=document.createElement('div'); btns.style.marginTop='4px';
        const clearBtn=document.createElement('button'); clearBtn.textContent=txt.clear; clearBtn.onclick=()=>{store.clear(); updateWidget();};
        btns.appendChild(clearBtn);
        const zipBtn=document.createElement('button'); zipBtn.textContent=txt.export; zipBtn.style.marginLeft='4px'; zipBtn.onclick=exportZIP;
        btns.appendChild(zipBtn);
        widget.appendChild(btns);
    }
}

function downloadSingle(s){
    const blob=new Blob([s.content||''],{type:'application/javascript'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=s.url.split('/').pop()||`script-${s.id}.js`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

async function exportZIP(){
    const txt=LANGS[lang];
    if(!store.size){ alert(txt.noScripts); return; }
    const JSZipURL='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    if(!window.JSZip){
        await new Promise(resolve=>{const s=document.createElement('script'); s.src=JSZipURL; s.onload=resolve; document.head.appendChild(s);});
    }
    const zip=new JSZip();
    store.forEach(s=>{zip.file(s.url.split('/').pop()||`script-${s.id}.js`,s.content||'');});
    zip.generateAsync({type:'blob'}).then(content=>{
        const url=URL.createObjectURL(content);
        const a=document.createElement('a'); a.href=url; a.download='scripts.zip';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
}

// Перетаскивание
(function makeDraggable(el){
    let posX=0,posY=0,mouseX=0,mouseY=0;
    const stored=JSON.parse(localStorage.getItem('__si_widgetPos')||'{}');
    if(stored.left) el.style.left=stored.left; if(stored.top) el.style.top=stored.top;
    el.style.right='auto'; el.style.bottom='auto';
    el.onmousedown=function(e){if(e.target.tagName==='BUTTON'||e.target.tagName==='SELECT'||e.target.tagName==='A') return; e.preventDefault(); mouseX=e.clientX; mouseY=e.clientY; document.onmousemove=drag; document.onmouseup=stopDrag;};
    function drag(e){ e.preventDefault(); posX=mouseX-e.clientX; posY=mouseY-e.clientY; mouseX=e.clientX; mouseY=e.clientY; el.style.top=(el.offsetTop-posY)+'px'; el.style.left=(el.offsetLeft-posX)+'px'; }
    function stopDrag(){document.onmousemove=null; document.onmouseup=null; localStorage.setItem('__si_widgetPos',JSON.stringify({top:el.style.top,left:el.style.left}));}
})(widget);

// Перехват fetch/XHR/script
const origFetch=window.fetch;
window.fetch=async function(resource,init){try{const res=await origFetch.apply(this,arguments); const ct=res.headers.get&&res.headers.get('content-type'); const isJS=ct&&/javascript|ecmascript|application\/x-javascript/.test(ct)||(typeof resource==='string'&&resource.match(/\.js(\?|$)/i)); if(isJS){try{const clone=res.clone(); const text=await clone.text(); saveScript({url:(typeof resource==='string'?resource:(resource&&resource.url))||'(fetch)',type:'fetch',content:text,origin:document.location.href});}catch(e){}} return res;}catch(err){throw err;}};

const origXHROpen=XMLHttpRequest.prototype.open;
const origXHRSend=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open=function(method,url){this.__ti_url=url; return origXHROpen.apply(this,arguments);};
XMLHttpRequest.prototype.send=function(body){ const xhr=this; const url=xhr.__ti_url||'(xhr)'; const onReady=()=>{if(xhr.readyState===4){ const ct=xhr.getResponseHeader&&xhr.getResponseHeader('content-type'); const isJS=ct&&/javascript|ecmascript|application\/x-javascript/.test(ct)||(typeof url==='string'&&url.match(/\.js(\?|$)/i)); if(isJS&&typeof xhr.responseText==='string'){saveScript({url,type:'xhr',content:xhr.responseText,origin:document.location.href});}}}; this.addEventListener&&this.addEventListener('readystatechange',onReady); return origXHRSend.apply(this,arguments);};

const mo=new MutationObserver(mutations=>{for(const m of mutations){for(const n of m.addedNodes){if(n.tagName==='SCRIPT'){try{if(n.src){fetch(n.src).then(r=>r.text().then(t=>saveScript({url:n.src,type:'script[src]',content:t,origin:document.location.href}))).catch(()=>saveScript({url:n.src,type:'script[src]',content:'',origin:document.location.href}));}else{saveScript({url:'(inline script)',type:'script[inline]',content:n.textContent||'',origin:document.location.href});}}catch(e){}}}}});
mo.observe(document.documentElement||document,{childList:true,subtree:true});

updateWidget();

// ---------- Автообновление ----------
(function checkUpdate(){
    try{
        GM_xmlhttpRequest({
            method:'GET',
            url:UPDATE_URL,
            onload:function(res){
                const remoteVersionMatch=res.responseText.match(/@version\s+([0-9.]+)/);
                if(remoteVersionMatch && remoteVersionMatch[1]!==CURRENT_VERSION){
                    if(confirm(`New version ${remoteVersionMatch[1]} available. Reload and update?`)){
                        window.location.href=UPDATE_URL;
                    }
                }
            }
        });
    }catch(e){}
    setTimeout(checkUpdate,6*60*60*1000);
})();

window.__universalInterceptorActive=true;
})();
