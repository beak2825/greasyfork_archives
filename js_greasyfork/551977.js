// ==UserScript==
// @name         Steam🎮-100%
// @description  Steam "-100%"
// @version      1.1.8
// @match        *store.steampowered.com/app/*
// @match        https://online-fix.me/games/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @connect      igg-games.com
// @connect      skidrowreloaded.com
// @connect      fitgirl-repacks.site
// @connect      online-fix.me
// @license      MIT
// @namespace    DEV314R
// @downloadURL https://update.greasyfork.org/scripts/551977/Steam%F0%9F%8E%AE-100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/551977/Steam%F0%9F%8E%AE-100%25.meta.js
// ==/UserScript==

(function(){
'use strict';

// ---------- Utils ----------
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// ---------- Labels ----------
const LABELS = {
    dl: { en:"Download",ar:"تحميل",bg:"Изтегли",
  "zh-CN":"下载","zh-TW":"下載",
  cs:"Stáhnout",da:"Download",nl:"Downloaden",
  fi:"Lataa", fr:"Télécharger",de:"Herunterladen",
  el:"Λήψη",hu:"Letöltés", id:"Unduh",
  it:"Scarica",ja:"ダウンロード",ko:"다운로드",
  no:"Last ned",pl:"Pobierz",
  "pt-PT":"Transferir","pt-BR":"Baixar",
  ro:"Descărcare", ru:"Скачать",
  "es-ES":"Descargar","es-LA":"Bajar",
  sv:"Ladda ner", th:"ดาวน์โหลด", tr:"İndir",
  uk:"Завантажити", vi:"Tải xuống"},

    multi: {en:"Multiplayer",ar:"متعدد اللاعبين",bg:"Мултиплейър",
  "zh-CN":"多人游戏","zh-TW":"多人遊戲",
  cs:"Multiplayer",da:"Flerspiller", nl:"Multiplayer",
  fi:"Moninpeli",fr:"Multijoueur",de:"Mehrspieler",
  el:"Πολλαπλών παικτών", hu:"Többjátékos",id:"Multipemain",
  it:"Multigiocatore",ja:"マルチプレイヤー",ko:"멀티플레이어",
  no:"Flerspiller",pl:"Wieloosобowy",
  "pt-PT":"Multijogador","pt-BR":"Multijogador",
  ro:"Multiplayer",ru:"Многопользовательская игра",
  "es-ES":"Multijugador","es-LA":"Multijugador",
  sv:"Flerspelarläge",th:"ผู้เล่นหลายคน", tr:"Çok Oyunculu",
  uk:"Багатокористувацька",vi:"Nhiều người chơi"},

    source: { en:"Source",ar:"المصدر",bg:"Източник",
  "zh-CN":"来源","zh-TW":"來源",
  cs:"Zdroj",da:"Kilde",nl:"Bron",
  fi:"Lähde",fr:"Source",de:"Quelle",
  el:"Πηγή",hu:"Forrás",id:"Sumber",
  it:"Fonte",ja:"ソース",ko:"출처",
  no:"Kilde",pl:"Źródło",
  "pt-PT":"Fonte","pt-BR":"Fonte",
  ro:"Sursă",ru:"Источник",
  "es-ES":"Fuente","es-LA":"Fuente",
  sv:"Källa",th:"แหล่งที่มา",tr:"Kaynak",
  uk:"Джерело",vi:"Nguồn"},

    unavailable: { en:"unavailable",ar:"غير متوفر",bg:"Недостъпно",
  "zh-CN":"不可用","zh-TW":"不可用",
  cs:"Nedostupné",da:"Ikke tilgængelig",nl:"Niet beschikbaar",
  fi:"Ei saatavilla",fr:"indisponible",de:"Nicht verfügbar",
  el:"Μη διαθέσιμο",hu:"Nem elérhető",id:"Tidak tersedia",
  it:"Non disponibile",ja:"利用不可",ko:"사용 불가",
  no:"Utilgjengelig",pl:"Niedostępne",
  "pt-PT":"Indisponível","pt-BR":"Indisponível",
  ro:"Indisponibil",ru:"Недоступно",
  "es-ES":"No disponible","es-LA":"No disponible",
  sv:"Inte tillgängligt",th:"ไม่พร้อมใช้งาน",tr:"Mevcut değil",
  uk:"Недоступно",vi:"Không khả dụng" }

};
const lang = (navigator.language||'en').toLowerCase();
const langKey = (()=>{if(lang.startsWith('pt-br'))return'pt-BR';if(lang.startsWith('pt-pt'))return'pt-PT';if(lang.startsWith('zh-tw')||lang.startsWith('zh-hk'))return'zh-TW';if(lang.startsWith('zh'))return'zh-CN';if(lang.startsWith('es-'))return['es-mx','es-ar','es-co','es-cl','es-pe','es-ve','es-uy','es-bo','es-py','es-cr','es-pa','es-do','es-ec','es-gt','es-hn','es-ni','es-sv','es-pr','es-419'].includes(lang)?'es-LA':'es-ES';return lang.split('-')[0]||'en';})();
const dlLabel = LABELS.dl[langKey]||LABELS.dl.en;
const multiLabel = LABELS.multi[langKey]||LABELS.multi.en;
const sourceLabel = LABELS.source[langKey]||LABELS.source.en;
const unavailableLabel = LABELS.unavailable[langKey]||LABELS.unavailable.en;

const norm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]|[©®™℠]|\?/g,'').replace(/[:'–—]/g,'').trim().toLowerCase();
const slugify = s => norm(s).replace(/\s+/g,'-');

// ---------- GM fetch ----------
const gmFetchHTML = async (url, timeout = 10000) => {
    if(typeof GM_xmlhttpRequest!=='function') return null;
    return new Promise(resolve=>{
        let done=false;
        const timer=setTimeout(()=>{if(!done){done=true;resolve(null);}},timeout);
        try{
            GM_xmlhttpRequest({
                method:'GET',url,
                onload:r=>{
                    if(!done){
                        done=true;clearTimeout(timer);
                        try{resolve(new DOMParser().parseFromString(r.responseText,'text/html'));}catch(e){resolve(null);}
                    }
                },
                onerror:()=>{if(!done){done=true;clearTimeout(timer);resolve(null);}}
            });
        }catch(e){if(!done){done=true;clearTimeout(timer);resolve(null);}}
    });
};

// ---------- Platform ----------
const defaultData={IGG:{source:'1Fichier'},Skidrow:{source:'MEGA'},FitGirl:{source:'DataNodes'}};
let platformData = GM_getValue('platformData',defaultData)||defaultData;
let platform = GM_getValue('platform','Skidrow')||'Skidrow';
platformData[platform] ||= { source: defaultData[platform].source };
GM_setValue('platformData',platformData);
let sdl = platformData[platform].source;

function setPlatform(p){platform=p;GM_setValue('platform',p);platformData[p] ||= {source:defaultData[p]?.source||''};sdl=platformData[p].source;GM_setValue('platformData',platformData);renderSourceFlyout();updateDownloadLink(true);}
function setSourceForPlatform(src){platformData[platform].source=src;GM_setValue('platformData',platformData);sdl=src;}

// ---------- Styles ----------
const style=document.createElement('style');
style.textContent=`.menu{font-family:Arial,sans-serif;font-size:1em;position:relative;user-select:none;padding:.1em;display:inline-flex}.menu-btn{background:#67c1f533;color:#67c1f5;padding:.4em .6em;border-radius:.3em;cursor:pointer}.menu-btn:hover{background:#67c1f5bb;color:#fff}.flyout{border:none;border-radius:.3em;background:#23262E;position:absolute;top:100%;left:0;display:none;z-index:10000}.menu:hover .flyout{display:block}.flyout a{display:block;padding:.4em .6em;background:#23262E;color:#ddd;text-decoration:none}.flyout a:hover{background:#85949d59;color:#fff}.menu-container{right:.75em;top:.75em;z-index:9999;position:fixed}`;
document.head.appendChild(style);

// ---------- Spinner ----------
function startLoadingAnim(btn){
    if(!btn) return;
    stopLoadingAnim(btn,'');
    const frames=["⠁","⠃","⠇","⠧","⠷","⠿","⠻","⠟","⠯","⠷","⠧","⠇","⠃"];
    let i=0;
    btn._timer=setInterval(()=>{if(!document.contains(btn)){clearInterval(btn._timer);delete btn._timer;return;}btn.textContent=frames[i=(i+1)%frames.length]+" "+btn.dataset.label;},90);
    setTimeout(()=>stopLoadingAnim(btn,btn.dataset.label),15000);
}
function stopLoadingAnim(btn,text){if(!btn)return;clearInterval(btn._timer);delete btn._timer;if(document.contains(btn))btn.textContent=text;}

// ---------- Game Name ----------
let gameName=null;
async function fetchGameNameFromStore(timeout=10000){
    const href=location.href.split('?')[0]+'?l=english';
    const doc=await gmFetchHTML(href,timeout);
    if(!doc)return null;
    const nameEl=doc?.querySelector('span[itemprop="name"]');
    if(!nameEl)return null;
    const n=norm(nameEl.textContent);
    gameName=n;return n;
}

// ---------- Download Links ----------
let skidrowLinkCache=new Map();
let LinkCache=null;

async function IGGStepByStep({slug=gameName,enc=sdl,delay=1000,timeout=10000}={}){
    if(!slug)return "❌";
    const cleanSlug=slug.replace(/(\s|-)?[^A-Za-z0-9\s]/gi,"").replace(/\s/gi,"-");
    const url=`https://igg-games.com/${cleanSlug}-free-download.html`;
    const doc=await gmFetchHTML(url,timeout);
    if(!doc)return "❌";
    const encLower=(enc||"").toLowerCase();
    const matches=[];
    const pushUnique=u=>{if(u&&!matches.includes(u))matches.push(u);};
    for(const b of doc.querySelectorAll("b.uk-heading-bullet")){
        const txt=(b.innerText||"").replace(/Link\s*:?/i,"").toLowerCase();
        if(txt.includes(encLower)){
            const parent=b.parentElement||b.closest("li,p")||b;
            for(const a of parent.querySelectorAll("a[href]"))if(/^https?:\/\//i.test(a.href))pushUnique(a.href);
        }
    }
    for(const span of doc.querySelectorAll(".uk-label.uk-label-success")){
        if(!(span.innerText||"").toLowerCase().includes("update"))continue;
        let node=span.parentElement?.nextElementSibling||span.nextElementSibling;let tries=0;
        while(node&&tries<3&&node.querySelectorAll&&node.querySelectorAll("a[href]").length===0){node=node.nextElementSibling;tries++;}
        if(!node)continue;
        for(const a of node.querySelectorAll("a[href]")){
            const text=(a.innerText||"").toLowerCase();
            if(/^https?:\/\//i.test(a.href)&&(text.includes(encLower)||text.includes((sdl||"").toLowerCase())))pushUnique(a.href);
        }
    }
    if(matches.length===0)return "❌ "+unavailableLabel;
    for(const u of matches){try{window.open(u,"_blank");}catch(e){console.warn("open failed",u,e);}await new Promise(r=>setTimeout(r,delay));}
    return matches;
}

async function SkidrowStep(slug,enc){
    if(!slug)return "❌";
    const cacheKey=slug+"::"+enc.toLowerCase();
    if(skidrowLinkCache.has(cacheKey))return skidrowLinkCache.get(cacheKey);
    const searchDoc=await gmFetchHTML(`https://www.skidrowreloaded.com/?s=${encodeURIComponent(slug)}`);
    if(!searchDoc)return "❌";
    const slugNorm=slug.replace(/-/g," ").normalize("NFD").replace(/(\s|-)?[^A-Za-z0-9\s]/gi,"").toLowerCase();
    const encNorm=enc.toLowerCase();
    const post=[...searchDoc.querySelectorAll("[class^=post] h2 a[href]")].find(a=>a.textContent.toLowerCase().includes(slugNorm));
    if(!post)return "❌ "+unavailableLabel;
    const postDoc=await gmFetchHTML(post.href);
    if(!postDoc)return "❌";
    const link=[...postDoc.querySelectorAll("[id^=tabs] p strong")].find(s=>s.textContent.toLowerCase().includes(encNorm))?.closest("p")?.querySelector("a[href]")?.href||null;
    const result=link||sourceLabel+" "+unavailableLabel;
    skidrowLinkCache.set(cacheKey,result);
    return result;
}

async function FitGirlStep(slug,enc){
    if(!slug)return '❌';
    const searchDoc=await gmFetchHTML(`https://fitgirl-repacks.site/${slug}`);
    if(!searchDoc)return '❌';
    const encNorm=(enc||'').replace(/Filehoster: /g,'').toLowerCase();
    const link=[...searchDoc.querySelectorAll('.entry-content > ul > li > a[href]')].find(a=>a.textContent.toLowerCase().includes(encNorm))?.href||null;
    return link||('❌ '+unavailableLabel);
}

// ---------- Apply Link ----------
function applyLink(dl){
    if(!dl)return;
    let span=dl.querySelector('span');if(!span){span=document.createElement('span');dl.appendChild(span);}
    const newDl=dl.cloneNode(true);dl.replaceWith(newDl);
    const btnSpan=newDl.querySelector('span')||span;
    btnSpan.dataset.label=dlLabel;
    newDl.addEventListener('click',async e=>{
        e.preventDefault();startLoadingAnim(btnSpan);
        let link;
        try{
            if(platform==='IGG'){link=await IGGStepByStep({delay:1000});stopLoadingAnim(btnSpan,Array.isArray(link)?dlLabel:link);}
            else if(platform==='FitGirl'){link=await FitGirlStep(slugify(gameName),sdl);stopLoadingAnim(btnSpan,link&&link.startsWith('http')?dlLabel:link);if(link&&link.startsWith('http'))window.open(link,'_blank');}
            else if(platform==='Skidrow'){link=await SkidrowStep(gameName,sdl);stopLoadingAnim(btnSpan,link&&link.startsWith('http')?dlLabel:link);if(link&&link.startsWith('http'))window.open(link,'_blank');}
        }catch(err){stopLoadingAnim(btnSpan,dlLabel);console.warn('Download failed',err);}
    });
}

// ---------- Reset labels uniquement Download ----------
document.addEventListener('click',e=>{
    if(!e.target.closest('.flyout')) return;
    LinkCache=null;
    const dlBtn = document.querySelector('#add314 span');
    if(dlBtn) dlBtn.textContent = dlLabel;
});

// ---------- Flyouts ----------
const sourcesByPlatform={
    IGG:['1Fichier','MegaUp.net','Mega.nz','GoFile','MixDrop','Rapidgator','Clicknupload','Bowfile','SendCM','Google Drive'],
    Skidrow:['MEGA','1FICHIER','PIXELDRAIN','MEDIAFIRE','GOFILE','VIKINGFILE','BOWFILE','1CLOUDFILE','MEGAUP','MULTI LINKS','TORRENT'],
    FitGirl:['DataNodes','FuckingFast','MultiUpload','1337x','magnet','.torrent file only','RuTor','magnet','Tapochek.net']
};
function createFlyout(label,key,items,stars=[]){
    const container=$('#category_block');if(!container)return;
    const val=key==='platform'?platform:sdl;
    const div=document.createElement('div');div.className='menu';div.dataset.type=key;
    div.innerHTML=`<div class="menu-btn">${label}: ${val}</div><div class="flyout">${items.map(i=>`<a href="#" data-value="${i}">${stars.includes(i)?'⭐'+i:i}</a>`).join('')}</div>`;
    container.insertAdjacentElement('beforebegin',div);
    const btn=div.querySelector('.menu-btn');
    div.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const v=a.dataset.value;if(key==='platform')setPlatform(v);else setSourceForPlatform(v);btn.textContent=`${label}: ${v}`;updateDownloadLink(true);}));
}
function renderSourceFlyout(){
    $$('.menu[data-type="source"]').forEach(n=>n.remove());
    const container=$('#category_block');if(!container)return;
    const list=sourcesByPlatform[platform]||[];
    const val=platformData[platform]?.source||defaultData[platform]?.source||list[0]||'';
    GM_setValue('platformData',platformData);
    const div=document.createElement('div');div.className='menu';div.dataset.type='source';
    div.innerHTML=`<div class="menu-btn">${sourceLabel}: ${val}</div><div class="flyout">${list.map(i=>`<a href="#" data-value="${i}">${i}</a>`).join('')}</div>`;
    container.insertAdjacentElement('beforebegin',div);
    const btn=div.querySelector('.menu-btn');
    div.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setSourceForPlatform(a.dataset.value);btn.textContent=`${sourceLabel}: ${a.dataset.value}`;updateDownloadLink(true);}));
}

// ---------- Download Link Updater ----------
const updateDownloadLink=async(force=false)=>{
    const dl=$('#add314');if(!dl||(!force&&!document.hasFocus()))return;
    if(!gameName)await fetchGameNameFromStore();
    if(gameName)applyLink(dl);
};

// ---------- Multiplayer Button ----------
async function createMultiButton(){
    const FixGameSet=new Set(['slime rancher 2']);
    const slug=gameName||await fetchGameNameFromStore();
    if(!slug)return;
    const normName=slug.normalize('NFD').replace(/[\u0300-\u036f\u00A9\u00AE\u2122\u2120]/g,'').replace(/-/g,' ').trim().toLowerCase();
    if(!document.querySelector(".game_area_details_specs_ctn[href*='category2=3']:is([href*='6'],[href*='8'],[href*='9'])")&&!FixGameSet.has(normName))return;
    if($('#add314r'))return;
    const base=$('#add314');if(!base)return;
    let btn=document.querySelector('#add314r');
    if(!btn){
        btn=document.createElement('a');btn.id='add314r';btn.className='btn_green_steamui btn_medium';btn.target='_blank';btn.innerHTML=`<span>${multiLabel}</span>`;base.insertAdjacentElement('afterend',btn);
        const btnSpan = btn.querySelector('span'); btnSpan.dataset.label = multiLabel;
        btn.addEventListener('click',async e=>{
            e.preventDefault();
            startLoadingAnim(btnSpan);
            const query=normName.replace(/[\/\s]+/g,'+');
            const url=`https://online-fix.me/index.php?do=search&subaction=search&story=${query}`;
            const doc=await gmFetchHTML(url,10000);
            stopLoadingAnim(btnSpan,multiLabel);
            if(!doc)return;
            const hit=[...doc.querySelectorAll('.article')].map(a=>{
                const h2=a.querySelector('h2.title');if(!h2)return null;
                const title=h2.textContent.replace(/ по сети/gi,'').normalize('NFD').replace(/[\u0300-\u036f\u00A9\u00AE\u2122\u2120]/g,'').trim().toLowerCase();
                const link=a.querySelector('a.big-link')?.href||a.querySelector('a.img')?.href||h2.closest('a')?.href||null;
                return title===normName&&link?link:null;
            }).filter(Boolean)[0];
            if(hit)btn.href=hit;if(hit)window.open(hit,'_blank');
        });
    }
}

// ---------- UI init ----------
const initUI=()=>{
    const wrap=$('.game_area_purchase_game_wrapper:not(#demoGameBtn) > * > .game_purchase_action');
    if(!wrap||$('.game_area_comingsoon,.game_area_bubble'))return;
    if($('.menu-container'))return;
    const cont=document.createElement('div');cont.className='menu-container';document.body.appendChild(cont);
    createFlyout('🌐','platform',['IGG','Skidrow','FitGirl'],['IGG','Skidrow']);
    renderSourceFlyout();
    const priceEl=document.querySelector("[class^='discount_original_price'],[data-price-final]");
    const price=(priceEl?.innerText?.trim())||'';
    const finalPrice=price?`0,--${price.slice(-1)}`:'0,00';
    wrap.innerHTML=`<div class="game_purchase_action_bg"><div class="discount_block game_purchase_discount" data-discount="100"><div class="discount_pct">-100%</div><div class="discount_prices"><div class="discount_original_price">${price}</div><div class="discount_final_price">${finalPrice}</div></div></div><div class="btn_addtocart"><a id="add314" class="btn_green_steamui btn_medium" href="#" target="_blank"><span>${dlLabel}</span></a></div></div>`;
    updateDownloadLink(true);
    createMultiButton();
};

// ---------- SPA observe ----------
const observer=new MutationObserver(()=>{if($('.game_area_purchase_game_wrapper'))initUI();});
const target=$('#appMountPoint')||document.documentElement;
observer.observe(target,{childList:true,subtree:true});
initUI();

// ---------- Online-Fix auto-translate ----------
if(/^https?:\/\/online-fix\.me\/games\/.+/.test(location.href)){
    const langShort=(navigator.language||'en').split('-')[0];
    const applyTranslate=()=>{const sel=document.querySelector('.goog-te-combo');if(!sel)return false;sel.value=langShort;sel.dispatchEvent(new Event('change'));return true;};
    const t=setInterval(()=>{if(applyTranslate())clearInterval(t);},300);
    document.addEventListener('DOMContentLoaded',applyTranslate);
}

})();