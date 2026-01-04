// ==UserScript==
// @name         SearXNG Gemini Overview
// @namespace    https://github.com/Sanka1610/SearXNG-Gemini-Overview
// @version      1.1.0
// @description  SearXNGの検索結果にGeminiによる概要を表示します
// @author       Sanka1610
// @match        *://searx.*/*
// @match        *://searxng.*/*
// @match        *://search.*/*
// @match        *://priv.au/*
// @match        *://im-in.space/*
// @match        *://ooglester.com/*
// @match        *://fairsuch.net/*
// @match        *://copp.gg/*
// @match        *://darmarit.org/searx/*
// @match        *://etsi.me/*
// @match        *://gruble.de/*
// @match        *://seek.fyi/*
// @match        *://baresearch.org/*
// @match        *://127.0.0.1:8888/search*
// @match        *://localhost:8888/search*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Sanka1610/SearXNG-Gemini-Overview
// @supportURL   https://github.com/Sanka1610/SearXNG-Gemini-Overview/issues
// @icon         https://docs.searxng.org/_static/searxng-wordmark.svg
// @downloadURL https://update.greasyfork.org/scripts/552122/SearXNG%20Gemini%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/552122/SearXNG%20Gemini%20Overview.meta.js
// ==/UserScript==

(async()=>{
'use strict';

// 変更可能設定
const CONFIG={
    MAX_RESULTS:20,
    MODEL_NAME:'gemini-2.0-flash',
    SNIPPET_CHAR_LIMIT:5000,
    CACHE_KEY:'GEMINI_OVERVIEW_CACHE',
    CACHE_LIMIT:30,
    CACHE_EXPIRE:7*24*60*60*1000
};

// ダークモード判定
const isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;

// API暗号化
const FIXED_KEY = '1234567890abcdef1234567890abcdef';

async function encrypt(text){
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(FIXED_KEY), 'AES-GCM', false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({name:'AES-GCM',iv}, key, enc.encode(text));
    return btoa(String.fromCharCode(...iv)) + ':' + btoa(String.fromCharCode(...new Uint8Array(ct)));
}

async function decrypt(cipher){
    const [ivB64, ctB64] = cipher.split(':');
    const iv = Uint8Array.from(atob(ivB64), c=>c.charCodeAt(0));
    const ct = Uint8Array.from(atob(ctB64), c=>c.charCodeAt(0));
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(FIXED_KEY), 'AES-GCM', false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
    return new TextDecoder().decode(decrypted);
}

// ログ
const log={
    debug:(...args)=>console.debug('[GeminiOverview][DEBUG]',new Date().toLocaleTimeString(),...args),
    info:(...args)=>console.info('[GeminiOverview][INFO]',new Date().toLocaleTimeString(),...args),
    warn:(...args)=>console.warn('[GeminiOverview][WARN]',new Date().toLocaleTimeString(),...args),
    error:(...args)=>console.error('[GeminiOverview][ERROR]',new Date().toLocaleTimeString(),...args)
};

// 検索クエリ正規化
function normalizeQuery(q) {
    return q.trim().toLowerCase().replace(/[　]/g,' ').replace(/\s+/g,' ');
}

// キャッシュ
const getCache=()=>{
    try{
        const c=JSON.parse(sessionStorage.getItem(CONFIG.CACHE_KEY));
        return c&&typeof c==='object'?c:{keys:[],data:{}};
    }catch{return {keys:[],data:{}};}
};

const setCache=cache=>{
    const now=Date.now();
    cache.keys=cache.keys.filter(k=>cache.data[k]?.ts&&now-cache.data[k].ts<=CONFIG.CACHE_EXPIRE);
    while(cache.keys.length>CONFIG.CACHE_LIMIT) delete cache.data[cache.keys.shift()];
    sessionStorage.setItem(CONFIG.CACHE_KEY,JSON.stringify(cache));
};

// HTML整形
const formatResponse=text=>text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');

// APIキー取得
async function getApiKey(force=false){
    if(force) localStorage.removeItem('GEMINI_API_KEY');

    let encrypted=localStorage.getItem('GEMINI_API_KEY');
    let key=null;

    if(encrypted){
        try{ key=await decrypt(encrypted); }catch(e){ console.error(e); }
    }
    if(key) return key;

    const overlay=document.createElement('div');
    overlay.style.cssText=`
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.5);display:flex;justify-content:center;
        align-items:center;z-index:9999;
    `;

    const modal=document.createElement('div');
    modal.style.cssText=`
        background:${isDark?'#1e1e1e':'#fff'};
        color:${isDark?'#fff':'#000'};
        padding:1.5em 2em;border-radius:12px;text-align:center;
        max-width:480px;font-family:sans-serif;
    `;
    modal.innerHTML=`
<h2>Gemini APIキー設定</h2>
<p style="font-size:0.9em;margin-bottom:1em;">
<a href="https://aistudio.google.com/app/apikey?hl=ja" target="_blank">Google AI Studio</a>
</p>
<input id="gemini-api-input" placeholder="APIキーを入力" style="width:90%;padding:0.5em;margin-bottom:1em;">
<br>
<button id="gemini-save-btn">保存</button>
<button id="gemini-cancel-btn">キャンセル</button>
`;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return new Promise(resolve=>{
        overlay.querySelector('#gemini-save-btn').onclick=async()=>{
            const val=overlay.querySelector('#gemini-api-input').value.trim();
            if(!val) return alert('APIキーが空です');

            try{
                const enc=await encrypt(val);
                localStorage.setItem('GEMINI_API_KEY',enc);
                overlay.remove();
                resolve(val);
                setTimeout(()=>location.reload(),500);
            }catch(e){
                alert('暗号化失敗');
                console.error(e);
            }
        };
        overlay.querySelector('#gemini-cancel-btn').onclick=()=>{
            overlay.remove();
            resolve(null);
        };
    });
}

// 概要描画
function renderOverview(jsonData, contentEl, timeEl, query, cacheKey){
    if(!jsonData){
        contentEl.textContent='無効な応答';
        return;
    }

    let html='';

    if(jsonData.intro) html+=`<section><p>${formatResponse(jsonData.intro)}</p></section>`;

    if(Array.isArray(jsonData.sections)){
        jsonData.sections.forEach(sec=>{
            if(sec.title&&Array.isArray(sec.content)){
                html+=`<section><h4>${sec.title}</h4><ul>`;
                sec.content.forEach(item=> html+=`<li>${formatResponse(item)}</li>`);
                html+='</ul></section>';
            }
        });
    }

    if(Array.isArray(jsonData.urls)&&jsonData.urls.length>0){
        html+='<section><h4>出典</h4><ul>';
        jsonData.urls.slice(0,3).forEach(url=>{
            try{
                const u=new URL(url);
                html+=`<li><a href="${url}" target="_blank">${u.hostname.replace(/^www\./,'')}</a></li>`;
            }catch{
                html+=`<li>${url}</li>`;
            }
        });
        html+='</ul></section>';
    }

    contentEl.innerHTML=html;

    const now=new Date();
    timeEl.textContent=now.toLocaleString('ja-JP',{hour12:false});

    const cacheData=getCache();
    if(!cacheData.keys.includes(cacheKey)) cacheData.keys.push(cacheKey);
    cacheData.data[cacheKey]={html,ts:Date.now(),time:timeEl.textContent};
    setCache(cacheData);
}

// 実行
if(!document.querySelector('#search_form, form[action="/search"]')||!document.querySelector('#results, .results, #sidebar')){
    log.info('非対応サイト');
    return;
}

const GEMINI_API_KEY=await getApiKey();
if(!GEMINI_API_KEY){ log.error('APIキー未設定'); return; }

const queryInput=document.querySelector('input[name="q"]');
if(!queryInput?.value?.trim()){ log.error('クエリ取得失敗'); return; }
const query=queryInput.value.trim();

const sidebar=document.querySelector('#sidebar');
if(!sidebar){ log.error('sidebarなし'); return; }

// UI
const aiBox=document.createElement('div');
aiBox.innerHTML=`
<div style="margin-top:1em;margin-bottom:0.5em;padding:0.5em;">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div style="font-weight:600;font-size:1em;">Gemini Overview</div>
    <span id="gemini-overview-time" style="font-size:0.8em;opacity:0.7;"></span>
  </div>
  <div id="gemini-overview-content" style="margin-top:1.0em;line-height:1.5;">取得中...</div>
</div>`;
sidebar.insertBefore(aiBox,sidebar.firstChild);

const contentEl=aiBox.querySelector('#gemini-overview-content');
const timeEl=aiBox.querySelector('#gemini-overview-time');

// キャッシュ確認
const cache=getCache();
const cacheKey=normalizeQuery(query);
if(cache.data[cacheKey]){
    const c=cache.data[cacheKey];
    contentEl.innerHTML=c.html;
    timeEl.textContent=c.time;
    log.info('キャッシュ使用',query);
    return;
}

// 検索結果取得
const form=document.querySelector('#search_form, form[action="/search"]');
const mainResults=document.getElementById('main_results');

async function fetchSearchResults(form,mainResults,maxResults){
    let results=Array.from(mainResults.querySelectorAll('.result'));
    let currentResults=results.length;
    let pageNo=parseInt(new FormData(form).get('pageno')||1);

    async function fetchNextPage(){
        if(currentResults>=maxResults) return [];
        pageNo++;
        const fd=new FormData(form);
        fd.set('pageno',pageNo);
        try{
            const resp=await fetch(form.action,{method:'POST',body:fd});
            const doc=new DOMParser().parseFromString(await resp.text(),'text/html');
            const newResults=Array.from(doc.querySelectorAll('#main_results .result')).slice(0,maxResults-currentResults);
            currentResults+=newResults.length;
            if(currentResults<maxResults&&newResults.length>0){
                const nextResults=await fetchNextPage();
                return newResults.concat(nextResults);
            }
            return newResults;
        }catch(e){
            log.error(e);
            return [];
        }
    }

    const add=await fetchNextPage();
    results.push(...add);
    return results.slice(0,maxResults);
}

if(!mainResults){ log.error('main_resultsなし'); return; }

const results=await fetchSearchResults(form,mainResults,CONFIG.MAX_RESULTS);

// スニペット収集
const excludePatterns=[ /google キャッシュ$/i ];
const snippetsArr=[];
let totalChars=0;

for(const r of results){
    const snippetEl=r.querySelector('.result__snippet')||r;
    let text=snippetEl.innerText.trim();
    excludePatterns.forEach(p=> text=text.replace(p,'').trim());
    if(!text) continue;
    if(totalChars+text.length>CONFIG.SNIPPET_CHAR_LIMIT) break;
    snippetsArr.push(text);
    totalChars+=text.length;
}

const snippets=snippetsArr.map((t,i)=>`${i+1}. ${t}`).join('\n\n');

// 生成プロンプト
const prompt=`
検索クエリ : ${query},
検索スニペット : ${snippets},

指示 :
1. クエリとスニペットから簡潔な概要を作成。
2. 情報不足時は「情報が限られています」と記載し推測可。
3. メタ情報禁止。
4. 少なくとも1つのセクションを作る。
5. 箇条書き可。
6. 600字以内。
7. JSON形式で出力:

{
  "intro": "",
  "sections": [
    {"title":"", "content":["",""]}
  ],
  "urls":[]
}
`;

// Gemini API 呼び出し
try{
    const resp=await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${CONFIG.MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})
        }
    );
    if(!resp.ok){
        contentEl.textContent=`APIエラー: ${resp.status}`;
        return;
    }
    const data=await resp.json();
    let parsed={};

    try{
        const raw=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
        const match=raw.match(/\{[\s\S]*\}/);
        parsed=match?JSON.parse(match[0]):{};
    }catch{
        contentEl.textContent='JSON解析失敗';
        return;
    }

    renderOverview(parsed,contentEl,timeEl,query,cacheKey);

}catch(err){
    contentEl.textContent='通信失敗';
    log.error(err);
}

})();