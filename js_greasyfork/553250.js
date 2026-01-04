// ==UserScript==
// @name         Cinny GIF Embedder
// @namespace    org.jerryjhird.cinnygifs
// @description  embeds tenor and other gif url's into media players like discord
// @version      1.1
// @match        https://app.cinny.in/*
// @match        https://cinny.*/*
// @match        https://*.cinny.*/*
// @match        https://*.matrix.org/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      GPL3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553250/Cinny%20GIF%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/553250/Cinny%20GIF%20Embedder.meta.js
// ==/UserScript==

// WARNING WILL BE BUGGED WITH "Url Preview" ENABLED IN YOUR ACCOUNT/GENERAL SETTINGS TURN OFF FOR THE BEST EXPERIENCE

(function(){
'use strict';

const log = (...a)=>console.log("CinnyGIF:",...a);

const decodeHref = h=>{
    try {
        if(!/^https?:\/\//i.test(h)) h="https://"+h;
        return decodeURIComponent(h);
    } catch { return h; }
};

const extractMedia = t=>{
    if(!t) return null;
    let d=t.match(/https?:\/\/[^"'<> ]+\.(?:mp4|gif|webm)(?:\?[^\s"'<>]*)?/i);
    if(d) return d[0];
    let m=t.match(/https?:\/\/[^"'<> ]+(?:media|i|thumb|media0)\.[^"'<> ]+\/[^"'<> ]+\.(?:mp4|gif|webm)(?:\?[^\s"'<>]*)?/i);
    return m?m[0]:null;
};

const httpGet = url => new Promise((res, rej)=>GM_xmlhttpRequest({method:"GET",url,responseType:"text",onload:res,onerror:rej,ontimeout:rej}));

const fetchMedia = async u=>{
    if(/\.(gif|mp4|webm)(?:\?|$)/i.test(u)) return u;
    try {
        if(u.includes("tenor.com")||u.includes("giphy.com")){
            const endpoint = u.includes("tenor.com")
                ? `https://tenor.com/oembed?url=${encodeURIComponent(u)}`
                : `https://giphy.com/services/oembed?url=${encodeURIComponent(u)}`;
            const resp = await httpGet(endpoint);
            const data = JSON.parse(resp.responseText||"{}");
            if(data.html){
                const m = data.html.match(/src="([^"]+)"/);
                if(m?.[1] && /\.(mp4|gif|webm)(?:\?|$)/i.test(m[1])) return m[1];
                try{ const r2=await httpGet(m?.[1]||""); const f=extractMedia(r2.responseText); if(f) return f; } catch{}
            }
            if(data.thumbnail_url && /\.(gif|mp4|webm)(?:\?|$)/i.test(data.thumbnail_url)) return data.thumbnail_url;
        }
    } catch{}
    try{ const r=await httpGet(u); return extractMedia(r.responseText); } catch{}
    return null;
};

const createPlayer = url=>{
    if(!url) return null;
    const isVideo = /\.(mp4|webm)(?:\?|$)/i.test(url.toLowerCase());
    if(isVideo){
        const v=document.createElement("video");
        Object.assign(v,{src:url,autoplay:true,loop:true,muted:true,playsInline:true});
        v.className="cinny-gif-player";
        Object.assign(v.style,{maxHeight:"260px",borderRadius:"8px",marginTop:"6px",transition:"opacity 0.25s",opacity:"0"});
        setTimeout(()=>v.style.opacity="1",40);
        return v;
    } else {
        const i=document.createElement("img");
        i.src=url;
        i.className="cinny-gif-player";
        Object.assign(i.style,{maxHeight:"260px",borderRadius:"8px",marginTop:"6px",transition:"opacity 0.25s",opacity:"0"});
        setTimeout(()=>i.style.opacity="1",40);
        return i;
    }
};

const processLink = async a=>{
    if(a.dataset.processed) return;
    a.dataset.processed="1";
    let url = decodeHref(a.href || a.getAttribute("href")||a.textContent||"");
    if(!url) return;

    const media = await fetchMedia(url);
    if(!media) return;
    if(a.parentElement.querySelector(".cinny-gif-player")) return;

    const player = createPlayer(media);
    if(player){
        a.style.display="none"; // hide URL
        a.parentElement.appendChild(player);
        setTimeout(()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}),100);
    }
};

const observer = new MutationObserver(ms=>{
    for(const m of ms) for(const n of m.addedNodes) if(n instanceof HTMLElement){
        const links = n.querySelectorAll? n.querySelectorAll("a[href],span"):[];
        links.forEach(a=>{
            const h = a.href || a.getAttribute("href") || a.textContent;
            if(h && /tenor\.com|giphy\.com|\.gif$|\.mp4$|\.webm$/i.test(h)) processLink(a);
        });
    }
});

const start = ()=>{
    const container = [
        document.querySelector("[class*='Timeline']"),
        document.querySelector("[role='log']"),
        document.querySelector("main"),
        document.body
    ].find(Boolean)||document.body;

    observer.observe(container,{childList:true,subtree:true});

    container.querySelectorAll && container.querySelectorAll("a[href],span").forEach(a=>{
        const h=a.href||a.getAttribute("href")||a.textContent||"";
        if(/tenor\.com|giphy\.com|\.gif$|\.mp4$|\.webm$/i.test(h)) processLink(a);
    });
};

const ready = setInterval(()=>{
    if(document.readyState==="complete"){clearInterval(ready);start();}
},500);

})();