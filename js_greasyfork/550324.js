// ==UserScript==
// @name             Pastel 3.0
// @namespace        https://github.com/GameSketchers/Pastel
// @version          3.0
// @description      Gartic.io Pastel – watch rooms, players and chat in real time.
// @description:tr   Gartic.io Pastel – odalari, oyunculari ve sohbeti anlik takip et.
// @author           Qwyua
// @match            *://gartic.io/*
// @match            *://www.croxyproxy.com/*
// @match            *://*/__cpi.php?s=*
// @run-at           document-start
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_addValueChangeListener
// @grant            GM_removeValueChangeListener
// @grant            GM_xmlhttpRequest
// @grant            GM_getResourceText
// @grant            unsafeWindow
// @resource         PASTEL_WORKER https://cdn.jsdelivr.net/gh/GameSketchers/Pastel@97ea1be/src/pastelLiveWorkerTEST.js
// @connect          *
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/550324/Pastel%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/550324/Pastel%2030.meta.js
// ==/UserScript==

// ==>>>> https://gartic.io/pastel <<<<== //

const W=unsafeWindow,B=W.__gmBus??=new EventTarget(),I=Symbol();Object.assign(W,{GM_scriptSendMessage:(c,...d)=>B.dispatchEvent(new CustomEvent(c,{detail:{from:I,data:d}})),GM_scriptOnMessage:(c,f)=>B.addEventListener(c,e=>e.detail.from!==I&&f?.(...e.detail.data))});
const {GM_scriptSendMessage, GM_scriptOnMessage}=W;
const baseHeaders={Accept:"*/*","Content-Type":"application/x-www-form-urlencoded","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\"Windows\"","sec-fetch-dest":"document","sec-fetch-mode":"navigate","sec-fetch-site":"none","sec-fetch-user":"?1","upgrade-insecure-requests":"1"};
const [GM_onMessage,GM_sendMessage,getCookie,onBodyReady,observer,observer2,rand,GM_req,randomColor,enc]=[
    (k,c)=>GM_addValueChangeListener(k,(_,__,o)=>c(...o)),
    (k,...d)=>GM_setValue(k,d),
    c=>document.cookie.split("; ").find(e=>e.startsWith(c+"="))?.split("=")[1],
    cb=>document.body?cb():new MutationObserver((_,o)=>document.body&&(o.disconnect(),cb())).observe(document.documentElement,{childList:1}),
    (s,c)=>{const w=()=>{const e=document.querySelector(s);e&&(c(e),o.disconnect())};const o=new MutationObserver(w);document.body?o.observe(document.body,{childList:1,subtree:1}):new MutationObserver((_,m)=>{document.body&&(m.disconnect(),o.observe(document.body,{childList:1,subtree:1}))}).observe(document.documentElement,{childList:1})},
    (s,c)=>{const w=()=>{const e=document.querySelector(s);if(e){c(e);o.disconnect()}};const o=new MutationObserver(w);o.observe(document.documentElement,{childList:true,subtree:true})},
    _=>Math.floor(Math.random()*100)+1,
    q=>GM_xmlhttpRequest({...q,onerror:e=>console.error(e)}),
    w=>`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.20)`,
    ()=>{const t=/^[A-Za-z0-9+/]+={0,2}$/;function n(t,n,r,e){const o=function(t){let n=t>>>0;return function(){return n^=n<<13,n>>>=0,n^=n>>>17,n>>>=0,n^=n<<5,n>>>=0,n>>>0}}(function(t){let n=5381;for(let r=0;r<t.length;r++)n=(n<<5)+n^t.charCodeAt(r),n>>>=0;return n||1}(t+"|"+String.fromCharCode(...n)+"|"+String.fromCharCode(...r))),c=new Uint8Array(e);for(let t=0;t<e;t++)c[t]=255&o();return c}function r(t,n){const r=new Uint8Array(t.length);for(let e=0;e<t.length;e++)r[e]=t[e]^n[e%n.length];return r}function e(t){const n=new Uint8Array(t);return crypto.getRandomValues(n),n}return function(o,c,f={}){if("string"!=typeof o)throw new TypeError("text must be a string");if("string"!=typeof c||0===c.length)throw new TypeError("password must be non-empty string");if(t.test(o)){const t=function(t){try{const n=atob(t),r=new Uint8Array(n.length);for(let t=0;t<n.length;t++)r[t]=n.charCodeAt(t);return r.buffer}catch(t){return null}}(o);if(t){const e=new Uint8Array(t);if(e.length>=17){const t=e.slice(0,8),o=e.slice(8,16),f=e.slice(16),u=r(f,n(c,t,o,f.length)),s=(i=u,(new TextDecoder).decode(i));if(/^[\t\n\r\x20-\x7E]*$/.test(s)&&s.length>0)return s}}}var i;const u=e(8),s=e(8),a=(l=o,(new TextEncoder).encode(l));var l;const g=r(a,n(c,u,s,a.length)),h=function(...t){const n=t.reduce(((t,n)=>t+n.byteLength),0),r=new Uint8Array(n);let e=0;for(const n of t)r.set(new Uint8Array(n),e),e+=n.byteLength;return r.buffer}(u.buffer,s.buffer,g.buffer);return y=h,btoa(String.fromCharCode(...new Uint8Array(y)));var y}}
];

document.URL.includes("/__cpi")&&window.self!==window.top&&(async()=>{try{GM_sendMessage('iframe-msg',`succes`,window.location.href)}catch(e){console.error("w",e)}})();
document.URL.includes("pr0xy")&&window.self!==window.top&&(window.name=window.location.search.split('=').pop())|observer('.fa.fa-arrow-right',btn=>btn.dispatchEvent(new MouseEvent("click",{bubbles:!0,button:0})));
document.URL.includes("/servers")&&window.self!==window.top&&observer('input[name=proxyServerId]',e=>{e.value=window.name;e.parentElement.submit()});
document.URL.includes("/requests?fso=")&&window.self!==window.top&&(console.log("wwww")|GM_sendMessage('iframe-msg', 'error'));
document.URL.includes("https://gartic.io/")&&location.pathname.includes('/viewer')&&(()=>{const T=typeof unsafeWindow!=='undefined'?unsafeWindow:window,s={render:(...a)=>(a[1]?.callback||typeof a[1]==='function'&&a[1])?.('asd'),remove:()=>{}},l=()=>{try{Object.defineProperty(T,'turnstile',{value:s,writable:!1,configurable:!1,enumerable:!0});return}catch(e){try{const d=Object.getOwnPropertyDescriptor(T,'turnstile');d?.configurable&&Object.defineProperty(T,'turnstile',{value:s,writable:!1,configurable:!1,enumerable:!0});return}catch(e){try{Object.defineProperty(T,'turnstile',{configurable:!0,enumerable:!0,get:()=>s,set:()=>{throw 0}});return}catch(e){}}}};l(),setTimeout(l,0)})();
document.URL.includes("https://gartic.io/")&&["/pastel"].some(p=>document.URL.includes(p))&&(()=>{
observer2('link[rel*="icon"]',x=>{x.remove()|document.head.append(Object.assign(document.createElement('link'),{rel:'icon',href:'https://cdn.jsdelivr.net/gh/GameSketchers/Pastel-Live/assets/pastelgirl.png'}))})
document.title="Pastel";Object.defineProperty(document,"title",{get(){return "Pastel"},set(_){},configurable:true});
const o=new MutationObserver(m=>{document.querySelectorAll('body:not(#pastel),script,head:not(#pastel)').forEach(e=>e.remove());clearTimeout(o._t);o._t=setTimeout(()=>o.disconnect(),100)});o.observe(document.documentElement,{childList:true,subtree:true});

  const pastelhead = Object.assign(document.createElement('head'),{
    id:'pastel',
    innerHTML:`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="https://cdn.jsdelivr.net/gh/GameSketchers/Pastel-Live/assets/pastelgirl.png">
    <title>Pastel</title>
    <meta name="description" content="Pastel Live: Canlı oyuncu ve sohbet paneliyle etkileşimli deneyim.">
    <style id="pastel">
      *::-webkit-scrollbar{width:8px}
      *::-webkit-scrollbar-track{background:rgba(30,30,46,0.6);border-radius:4px}
      *::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#667eea,#764ba2);border-radius:4px}
      *::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#764ba2,#667eea)}
      html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;font-family:"Segoe UI", system-ui, sans-serif;color:#f2f2f2;/*background: #0f0f1e;*/}
      .pastel-background{position:fixed;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;filter:brightness(0.4) contrast(1.1);object-position:55% center}
      .pastel-page{display:flex;flex-direction:column;width:100%;height:100%}
      .pastel-header{all:unset;justify-content:center!important;;display:flex!important;;justify-content:center!important;align-items:flex-end!important;height:80px!important;z-index:2!important;padding:0 20px!important;background:rgba(15,15,30,0.4)!important;backdrop-filter:blur(5px)!important;border-bottom:1px solid rgba(255,255,255,0.1)!important}
      .pastel-title{font-weight:800;font-size:3.2em;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-0.5px}
      .pastel-version{font-size:0.25em;margin-left:8px;align-self:flex-start;color:rgba(255,255,255,0.6);font-weight:400}
      .pastel-credit{position:absolute;bottom:10px;left:10px;font-size:11px;color:#bbb;font-family:"Segoe UI",sans-serif;opacity:0.8}
      .pastel-credit a{color:#6cf;text-decoration:none;font-weight:600}
      .pastel-credit .heart{color:#e25555;margin:0 2px}
      .pastel-home{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;display:flex;flex-direction:column;height:100%}
      .pastel-home-tools{display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin:0px auto;max-width:95%;overflow-y:auto;margin-bottom:10px;padding:10px}
      .pastel-home-tool{background:linear-gradient(135deg,rgba(102,126,234,0.15),rgba(118,75,162,0.15));border-radius:20px;width:210px;cursor:pointer;overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column;border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.2)}
      .pastel-home-tool:not(.disabled):hover{background:linear-gradient(135deg,rgba(102,126,234,0.25),rgba(118,75,162,0.25));transform:translateY(-8px) scale(1.02);box-shadow:0 16px 48px rgba(0,0,0,0.3);border-color:rgba(255,255,255,0.15)}
      .pastel-home-tool.disabled{pointer-events:none;opacity:0.5;filter:grayscale(60%) contrast(0.9) brightness(0.95);transform:none !important;cursor:not-allowed;box-shadow:none;border-color:rgba(255,255,255,0.04)}
      .pastel-home-tool img{width:100%;height:130px;object-fit:cover;opacity:0.7}
      .pastel-home-tool p{margin:0;padding:15px;font-size:1.2em;text-align:center;font-weight:700;color:#fff}
      .pastel-home-select{padding:10px 18px;margin-top:10px;font-size:1.05em;font-weight:600;background:rgba(15,15,30,0.6);color:#fff;border:none;outline:none;border-radius:12px;box-shadow:inset 0 0 6px rgba(0,0,0,0.4);transition:0.18s}
      .pastel-proxy-button{padding:12px 28px;font-size:1.05em;margin-top:6px;font-weight:700;margin-bottom:6px;background:linear-gradient(90deg,#ff9a9e,#f9d423);color:#0f0c29;border:none;outline:none;cursor:pointer;transition:0.25s;border-radius:12px;box-shadow:0 6px 18px rgba(249,212,35,0.12),0 4px 10px rgba(255,78,80,0.08)}
      .pastel-proxy-button:hover,.pastel-home-select:hover{transform:scale(1.05);box-shadow:0 0 15px #f9d423,0 0 20px #ff4e50}
      .pastel-proxy-button:active{transform:translateY(1px)}
      .pastel-proxy-button.disabled{pointer-events:none;opacity:0.6;filter:grayscale(30%);cursor:not-allowed}
      .pastel-live{display:none;width:100%;height:100%;flex-direction:column;gap:5px;overflow-y:auto}
      .pastel-live-header{align-items:center;margin:0 15px;backdrop-filter:blur(5px);border-radius:16px}
      .pastel-live-stats{padding:15px 20px;background:rgba(30,30,46,0.2);border-radius:12px;text-align:center;font-weight:600;color:#a8b1ff;border:1px solid rgba(102,126,234,0.2)}
      .pastel-live-header h2{font-size:2.2em;margin:0;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700}
      .pastel-live-content{display:flex;flex:1;padding:0 12px;margin-bottom:12px;height:calc(100% - 140px)}
      .pastel-live-player-cards{flex:3;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:15px;overflow-y:auto;margin-right:5px;padding-right:5px;height:100%;display:grid;grid-auto-rows:min-content}
      .pastel-live-players-container{display:flex;flex-direction:column;gap:12px;flex:3;min-height:0}
      .pastel-live-filter-content{display:flex;gap:15px;flex-wrap:nowrap;align-items:center;padding:4px 12px;background:rgba(30,30,46,0.2);border-radius:12px}
      .filter-input{flex:5;min-width:0;background:rgba(30,30,46,0.4);border:1px solid rgba(102,126,234,0.3);border-radius:12px;padding:14px 18px;color:white;font-family:inherit;outline:none;font-size:1em;transition:all 0.3s ease}
      .filter-language:focus,.filter-input:focus{border-color:#667eea;box-shadow:0 0 0 2px rgba(102,126,234,0.2)}
      .filter-input::placeholder{color:rgba(255,255,255,0.5)}
      .filter-language{flex:2;min-width:0;padding:14px 18px;border-radius:12px;border:1px solid rgba(102,126,234,0.3);background:rgba(30,30,46,0.4);color:rgba(255,255,255,0.5);font-family:inherit;font-size:1em;cursor:pointer}
      .player-card{background:linear-gradient(135deg,rgba(40,40,60,0.9),rgba(30,30,46,0.9));border-radius:16px;overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);border:1px solid rgba(102,126,234,0.15);box-shadow:0 6px 20px rgba(0,0,0,0.15);display:flex;align-items:center;gap:16px;padding:4px 16px;height:80px}
      .player-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,0.25);border-color:rgba(102,126,234,0.4);background:linear-gradient(135deg,rgba(50,50,70,0.95),rgba(40,40,60,0.95))}
      .player-avatar{width:50px;height:50px;border-radius:14px;object-fit:cover;border:2px solid rgba(102,126,234,0.3);flex-shrink:0;transition:all 0.3s ease}
      .player-card:hover .player-avatar{border-color:rgba(102,126,234,0.6);transform:scale(1.05)}
      .avatar-badge{position:relative;display:inline-block}
      .player-win{position:absolute;left:-6px;bottom:-6px;width:34px;height:34px;background-image:url(https://gartic.io/static/images/new/trofeu.svg);background-size:contain;background-repeat:no-repeat;background-position:center;display:flex;align-items:center;justify-content:center;z-index:2}
      .player-win span{display:inline-block;transform:translateY(-4px);font-family:'Nunito',sans-serif;font-size:12px;color:#043172;font-weight:900}
      .player-info{flex:1;min-width:0}
      .player-name{font-size:16px;font-weight:700;margin:0 0 4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
      .room-code{font-size:14px;padding:4px 8px;border-radius:10px;display:inline-block;background:linear-gradient(135deg,rgba(102,126,234,0.2),rgba(118,75,162,0.2));color:#a8b1ff;font-weight:600;border:1px solid rgba(102,126,234,0.3)}
      .pastel-live-chat-container{flex:1;display:flex;flex-direction:column;background:linear-gradient(135deg,rgba(40,40,60,0.7),rgba(30,30,46,0.4));border-radius:20px;border:1px solid rgba(102,126,234,0.6);overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.2);min-width:40%}
      .pastel-live-chat-header{padding:15px 10px;border-bottom:1px solid rgba(102,126,234,0.2);font-weight:700;font-size:1.3em;display:flex;justify-content:space-between;align-items:center;background:rgba(30,30,46,0.8);color:#fff}
      .pastel-live-chat-toggle{display:none;background:rgba(102,126,234,0.2);border:1px solid rgba(102,126,234,0.3);color:#a8b1ff;width:36px;height:36px;border-radius:50%;cursor:pointer;align-items:center;justify-content:center;font-size:1.1em;transition:all 0.3s ease}
      .pastel-live-chat-toggle:hover{background:rgba(102,126,234,0.3);transform:scale(1.1)}
      .pastel-live-chat-messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;background:rgba(25,25,40,0.5)}
      .pastel-live-chat-messages::-webkit-scrollbar{width:6px}
      .pastel-live-chat-messages::-webkit-scrollbar-track{background:rgba(30,30,46,0.6);border-radius:3px}
      .pastel-live-chat-messages::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#667eea,#764ba2);border-radius:3px}
      .pastel-live-chat-messages::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#764ba2,#667eea)}
      .message{display:flex;gap:12px;animation:messageAppear 0.3s ease-out}
      @keyframes messageAppear{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .message-avatar{object-fit:cover;flex-shrink:0;content:"";border:2px solid #f9c236;width:62px;height:62px;border-radius:50%}
      .message-content{flex:1;min-width:0}
      .message-user{font-weight:700;font-size:0.95em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f9c236;margin:0 0 3px 5px}
      .message-text{display:inline-block;max-width:90%;padding:8px 14px;border-radius:10px;background:#fff;border-bottom-left-radius:0;margin:4px 0;font-size:18px;font-weight:500;line-height:1.4;color:#707b92;letter-spacing:-0.56px;border:1px solid rgba(102,126,234,0.2);word-break:break-word}
      .system-message{text-align:center;border-radius:10px;font-size:1.1em;font-weight:600}
      .system-info{color:#00dcf8}
      .system-success{color:#3ede7c}
      .system-warning{color:#f6ad55}
      .system-error{color:#c11f1f}
      .pastel-live-chat-input-container{display:flex;padding:12px;border-top:1px solid rgba(102,126,234,0.2);gap:10px;background:rgba(30,30,46,0.8);place-items:center}
      .chat-input{flex:1;background:rgba(40,40,60,0.8);border:1px solid rgba(102,126,234,0.3);border-radius:16px;padding:12px 15px;color:white;font-family:inherit;outline:none;transition:all 0.3s ease;font-size:1em}
      .chat-input:focus{border:2px solid #667eea;background:rgba(45,45,65,0.9)}
      .chat-input::placeholder{color:rgba(255,255,255,0.5)}
      .pastel-scroll-button{background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;width:37px;height:37px;border-radius:14px;cursor:pointer;display:none;align-items:center;justify-content:center;transition:all 0.3s ease;font-size:1.3em;font-weight:bold}
      .pastel-scroll-button:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(102,126,234,0.4)}
      .pastel-scroll-button.active{background:linear-gradient(135deg,#764ba2,#667eea);box-shadow:0 0 0 3px rgba(102,126,234,0.3)}
      @keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @media(max-width:768px){header .title{font-size:2.4em}.pastel-home-tool{width:160px}.pastel-home-tool img{height:100px}.pastel-home-tool p{font-size:1.1em;padding:15px}.pastel-live-content{flex-direction:column;padding:0 15px;height:calc(100% - 160px)}.pastel-live-player-cards{grid-template-columns:1fr;padding-right:0;gap:12px;padding-right:30px;margin-bottom:70px}.player-card{width:100%;height:80px;min-height:80px;padding:4px 12px}.pastel-live-players-container{padding-top:0}.pastel-live-filter-content{padding:0 15px;gap:12px;position:static;padding:0;background:transparent}.filter-input{flex:5;min-width:calc(50% - 6px)}.pastel-live-chat-container{position:fixed;bottom:0;right:0;width:100%;height:70px;border-radius:20px 20px 0 0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);z-index:10}.pastel-live-chat-container.expanded{height:75%}.pastel-live-chat-header{padding:15px 20px}.pastel-live-chat-toggle{display:flex}.pastel-live-chat-messages{display:none;padding:15px}.pastel-live-chat-container.expanded .pastel-live-chat-messages{display:flex}.pastel-live-chat-input-container{display:none;padding:15px}.pastel-live-chat-container.expanded .pastel-live-chat-input-container{display:flex}.pastel-live-header{margin:0 15px;padding:12px 15px}.pastel-live-header h2{font-size:1.8em}}
      @media(max-width:480px){.player-card{padding:10px;height:70px;min-height:70px}.player-avatar{width:50px;height:50px}.player-name{font-size:1.1em}.room-code{font-size:0.85em}header .title{font-size:2em}.pastel-home-tool{width:160px}}
    </style>
`
  });

  const pastelbody = Object.assign(document.createElement('body'),{
    id:'pastel',
    innerHTML:`
<body>
<video class="pastel-background" muted playsinline><source src="https://cdn.pixabay.com/video/2025/04/07/270468_large.mp4" type="video/mp4">xxx</video>
<div class="pastel-page">
  <div class="pastel-header">
    <div class="pastel-title">PASTEL<span class="pastel-version">v3.0</span></div>
  </div>
  <div class="pastel-home">
    <select class="pastel-home-select">
      <optgroup label="Unavailable Themes">
                  <option value="all">All Languages</option>
                  <option value="2">English</option>
                  <option value="8">Türkçe</option>
                  <option value="1">Português</option>
                  <option value="45">Bahasa Indonesia</option>
                  <option value="7">Русский</option>
                  <option value="3">Español</option>
                  <option value="19">العربية</option>
                  <option value="23">Azərbaycanca</option>
                  <option value="11">Čeština</option>
                  <option value="14">Deutsch</option>
                  <option value="4">Français</option>
                  <option value="6">Italiano</option>
                  <option value="44">Magyar</option>
                  <option value="18">Nederlands</option>
                  <option value="10">Polski</option>
                  <option value="58">Română</option>
                  <option value="22">Slovenčina</option>
                  <option value="13">Tiếng Việt</option>
                  <option value="21">български език</option>
                  <option value="40">עברית</option>
                  <option value="34">فارسی</option>
                  <option value="12">ภาษาไทย</option>
                  <option value="16">中文 (简化字)</option>
                  <option value="9">中文 (臺灣)</option>
                  <option value="17">中文 (香港)</option>
                  <option value="15">日本語</option>
                  <option value="20">한국어</option>
      </optgroup>
      <optgroup label="Unavailable Themes">
                  <option value="26">Afrikaans</option>
                  <option value="55">Bahasa Melayu</option>
                  <option value="30">Català</option>
                  <option value="31">Dansk</option>
                  <option value="33">Eesti</option>
                  <option value="67">Esperanto</option>
                  <option value="36">Føroyskt</option>
                  <option value="37">Gaeilge</option>
                  <option value="38">Galego</option>
                  <option value="43">Hrvatski</option>
                  <option value="46">Íslenska</option>
                  <option value="66">Kurdî</option>
                  <option value="52">Latviešu</option>
                  <option value="50">Lëtzebuergesch</option>
                  <option value="68">Lietuvių</option>
                  <option value="56">Malti</option>
                  <option value="53">Mакедонски</option>
                  <option value="65">Norsk</option>
                  <option value="61">Shqip</option>
                  <option value="59">Slovenščina</option>
                  <option value="35">Suomi</option>
                  <option value="24">Svenska</option>
                  <option value="62">Türkmen</option>
                  <option value="64">Yorùbá</option>
                  <option value="32">Ελληνικά</option>
                  <option value="27">Беларуская</option>
                  <option value="29">Босански</option>
                  <option value="54">Монгол Хэл</option>
                  <option value="60">Српски</option>
                  <option value="63">Українська</option>
                  <option value="49">Қазақ Tілі</option>
                  <option value="42">Հայերեն</option>
                  <option value="41">हिन्दी</option>
                  <option value="28">বাংলা</option>
                  <option value="39">ગુજરાતી</option>
                  <option value="51">ພາສາລາວ</option>
                  <option value="57">မြန်မာစကား</option>
                  <option value="47">ქართული</option>
                  <option value="25">ኣማርኛ</option>
                  <option value="48">ភាសាខ្មែរ</option>
      </optgroup>
    </select>
         <button class="pastel-proxy-button">Get Proxy (0)</button>
        <div class="pastel-home-tools">
          <div class="pastel-home-tool" id="pastel-live-rooms-button">
          <img src="https://images.unsplash.com/photo-1511882150382-421056c89033" alt="Live">
          <p>Live Rooms</p>
        </div>
        <div class="pastel-home-tool" id="pastel-who-where-button">
          <img src="https://images.unsplash.com/photo-1511882150382-421056c89033" alt="WhoWhere">
          <p>Who Where</p>
        </div>
        <div class="pastel-home-tool">
          <img src="https://images.unsplash.com/photo-1511882150382-421056c89033" alt="Soon...">
          <p>Soon...</p>
        </div>
      </div>
    <div class="pastel-credit">GameSketchers • by <a href="https://github.com/GameSketchers/Pastel-Live" target="_blank">Qwyua</a>  <span class="heart">♥</span> with love</div>
    </div>

    <div class="pastel-live">
      <div class="pastel-live-header">
   <div class="pastel-live-stats">Players: <span id="pastel-live-pcount">0</span> | Rooms: <span id="pastel-live-rcount">0</span> | Speed: <span id="pastel-live-scount">0x</span></div>
      </div>
      <div class="pastel-live-content">
        <div class="pastel-live-players-container">
        <div class="pastel-live-filter-content">
       <input type="text" class="filter-input" placeholder="Search Player or Room (User,384Sew)...">
       <select class="filter-language">
       <option value="all">All Languages</option>
       <option value="23">English</option>
       <option value="1">Turkish</option>
       <option value="8">Spanish</option>
       <option value="2">French</option>
       </select>
     </div>
          <div class="pastel-live-player-cards"></div>
        </div>
        <div class="pastel-live-chat-container">
          <div class="pastel-live-chat-header">
            <span>Live Chat</span>
            <button class="pastel-live-chat-toggle">+</button>
          </div>
          <div class="pastel-live-chat-messages"></div>
          <div class="pastel-live-chat-input-container">
            <input type="text" class="chat-input" placeholder="Search message...">
            <button class="pastel-scroll-button">↓</button>
          </div>
        </div>
      </div>
   </div>
</div>
</body>
`
  });
  document.documentElement.prepend(pastelbody);
  document.documentElement.prepend(pastelhead);


const workerCode = GM_getResourceText("PASTEL_WORKER");
const blob = new Blob([workerCode], { type: "application/javascript" });
const pastelLiveWorker = new Worker(URL.createObjectURL(blob));



    class PastelLive {
      CURRENT_VERSION = "3.0.0"
      proxies=GM_getValue("PastelLive-Proxies");
      autoScroll = !0;
      secb = enc()("aroRXI7nz2N1rwOdDuV2WvlvO1WqhaBI9TkWx04JQnysgb6tIDZdSswwsjHEwTNP7Mm+qySJ8Dy29fhxq+ZnZorH0IdPsa1g6IHOXqbabtW/kb9TfgUiGukAD5Y6aztVLtMVHhlh5Ve65wqEcPDonVlb+o/3","Qwyua")
      constructor(doc){
        doc.documentElement.lang="metta"
        this.contentSelector = doc.querySelector('.pastel-home-tools');
        this.selectorCards = doc.querySelectorAll('.pastel-home-tools .pastel-home-tool');
        this.liveRoomsContainer = doc.querySelector('.pastel-live');
        this.playersContainer = doc.querySelector('.pastel-live-player-cards');
        this.chatMessagesContainer = doc.querySelector('.pastel-live-chat-messages');
        this.chatContainer = doc.querySelector('.pastel-live-chat-container');
        this.chatToggle = doc.querySelector('.pastel-live-chat-toggle');
        this.scrollButton = doc.querySelector('.pastel-scroll-button');
        this.proxyButton = doc.querySelector('.pastel-proxy-button');
        this.startScreen = doc.querySelector('.pastel-home');
        this.liveRoomsButton = doc.querySelector('#pastel-live-rooms-button');
        this.langSelect = doc.querySelector("div.pastel-home > select");
        this.whoWhereButton = doc.querySelector('#pastel-who-where-button');
        this.filterLanguage = doc.querySelector('select[class="filter-language"]')
        this.pcount =  doc.querySelector('#pastel-live-pcount')
        this.rcount =  doc.querySelector('#pastel-live-rcount')
        this.scount =  doc.querySelector('#pastel-live-scount')


        this.proxyButton.textContent = `Get Proxy (${this.proxies?.length||0})`;
        if(GM_getValue("version")==null)GM_setValue("version",this.CURRENT_VERSION);else if(GM_getValue("version")!==this.CURRENT_VERSION)(GM_setValue("PastelLive",{}),GM_setValue("PastelLive-Proxies",[]),GM_setValue("iframe-msg",[]),GM_setValue("version",this.CURRENT_VERSION),location.reload());
        if(this.proxies === undefined){this.proxies=[];GM_setValue("PastelLive-Proxies",this.proxies)}
        if(Array.isArray(this.proxies)&&this.proxies.length===0){this.contentSelector?.classList.add('disabled');this.selectorCards.forEach(c=>c.classList.add('disabled'));this.proxyButton?.classList.remove('disabled');this.startScreen?.classList.remove('disabled');this.proxies=[];GM_setValue("PastelLive-Proxies",this.proxies)}
        Array.isArray(this.proxies)&&this.proxies.length&&(()=>{const ws = new WebSocket(`wss://${this.proxies[0].ip}/__cpw.php?u=d3NzOi8vc2VydmVyMDYuZ2FydGljLmlvL3NvY2tldC5pby8/RUlPPTMmdHJhbnNwb3J0PXdlYnNvY2tldA==&o=aHR0cHM6Ly9nYXJ0aWMuaW8=`);ws.onopen=()=>{ws.close()};ws.onerror=()=>{GM_setValue("PastelLive-Proxies",this.proxies=[]);location.reload()}})();

        this.langSelect.addEventListener("change",()=>{console.log(this.langSelect.value);GM_setValue("PastelLive-lang",this.langSelect.value)});
        this.chatToggle.onclick=y=>this.chatToggle.textContent=this.chatContainer.classList.toggle('expanded')?'-':'+';
        this.scrollButton.onclick=u=>(this.autoScroll=this.scrollButton.classList.toggle('active'),this.scrollButton.style.display="none",this.autoScroll&&(this.chatMessagesContainer.scrollTop=this.chatMessagesContainer.scrollHeight));
        this.proxyButton.addEventListener('click',()=>{if(this.proxyButton.classList.contains('disabled'))return;this.proxyButton.classList.add('disabled');this.proxyButton.textContent='Proxy Launching...';this.addNewProxy()});
        this.liveRoomsButton.addEventListener('click',()=>{if(doc.querySelector('.pastel-home-tools')?.classList.contains('disabled'))return;this.startScreen.style.display='none';this.contentSelector.style.display='none';this.liveRoomsContainer.style.display='flex';this.playerSearchGO(this.langSelect.value)});
        this.whoWhereButton.addEventListener('click',()=>{if(doc.querySelector('.pastel-home-tools')?.classList.contains('disabled'))return;this.startScreen.style.display='none';this.contentSelector.style.display='none';this.chatContainer.style.display='none';this.liveRoomsContainer.style.display='block'});
        this.chatMessagesContainer.addEventListener('scroll',()=>{const isAtBottom=this.chatMessagesContainer.scrollTop+this.chatMessagesContainer.clientHeight>=this.chatMessagesContainer.scrollHeight-10;if(!isAtBottom&&this.autoScroll){this.autoScroll=!1;this.scrollButton.classList.remove('active');this.scrollButton.style.display="block"}else if(isAtBottom&&!this.autoScroll){this.autoScroll=!0;this.scrollButton.classList.add('active');this.scrollButton.style.display = "none"}});
        this.playerDebounce;this.chatDebounce;this.updateCountsDebounce = null;
        doc.querySelector('.filter-input').oninput = e => {
          clearTimeout(this.playerDebounce);
          this.playerDebounce = setTimeout(() => {
            pastelLiveWorker.postMessage({type:"search",details:{task:'player',filterLanguage:this.filterLanguage.value,filterText:e.target.value}});
          }, 300);
        };

        doc.querySelector('.chat-input').oninput = e => {
          clearTimeout(this.chatDebounce);
          this.chatDebounce = setTimeout(() => {
            pastelLiveWorker.postMessage({type:"search",details:{task:'chat',filterLanguage:this.filterLanguage.value,filterText:e.target.value}});
          }, 300);
        };

        pastelLiveWorker.onmessage = ({data}) => {
          const { type, details } = data;
          switch(type) {
              case 'chat:addMessage':
              this.chatMessagesContainer.insertAdjacentHTML('beforeend', details.html);
              this.autoScroll&&(this.chatMessagesContainer.scrollTop=this.chatMessagesContainer.scrollHeight);
              break;
              case 'player:addPlayer':
              if(details.wrapper) this.playersContainer.insertAdjacentHTML('beforeend', details.wrapper);
              this.playersContainer.querySelector(details.selector).insertAdjacentHTML('beforeend', details.html);
              this.updateCounts()
              break;
              case 'chat:deleteMessage':
              break;
              case 'player:deletePlayer':
              this.playersContainer.querySelector(details.selector)?.remove();
              this.updateCounts()
              break;
              case 'chat:renderMessages':
              this.chatMessagesContainer.innerHTML=details.html
              break;
              case 'player:renderPlayers':
              this.playersContainer.innerHTML=details.html
              this.updateCounts()
              break;
            case 'error':
              console.error(details)
              break;
            case 'log':
              console.log(details.message)
              default:
              console.log('undefined type:', type, details);
          }
        };
      }
      updateCounts() {
        clearTimeout(this.updateCountsDebounce);
        this.updateCountsDebounce = setTimeout(() => {
          const players = this.playersContainer.querySelectorAll('.player-card').length;
          const rooms = this.playersContainer.querySelectorAll('.room-wrapper').length;
          this.pcount.textContent = players;
          this.rcount.textContent = rooms;
          },35);
      }
      async monitorRooms(languagecode = "all", callback) {
        const langs = languagecode== "all"?[...document.querySelectorAll('select option')].flatMap(o=>o.value.toLowerCase()!=='all'?[+o.value||o.value]:[]):[Number(languagecode)];
        const proxyQueue = {};
        this.proxies.forEach(p => proxyQueue[p.ip] = []);
        langs.forEach((lang, idx) => {
         const p = this.proxies[idx % this.proxies.length];
         proxyQueue[p.ip].push(lang);
        });
        const results = {};
        await Promise.all(Object.entries(proxyQueue).map(async ([ip, langList]) => {
         const proxy = this.proxies.find(p => p.ip == ip);
         for (const lang of langList) {
          try {
            const r = await new Promise((resolve, reject) =>
            GM_xmlhttpRequest({
              method: "GET",
              url: `https://${proxy.ip}/req/list?search=&language[]=${lang}&__cpo=aHR0cHM6Ly9nYXJ0aWM.uaW8`,
              headers: { ...baseHeaders, Cookie: `__cpc=${proxy.cookie}`, 'User-Agent': this.secb },
              onload:resolve,onerror:reject})
            );
            if (!r?.responseText) continue;
            const data = JSON.parse(r.responseText).filter(x=>x.quant>0);
            const rooms = data.map(x => x.code);
            if (rooms.length) results[lang] = rooms;
            }
            catch (e) {console.log(`Dil ${lang} hata:`, e.message)}
           await new Promise(r => setTimeout(r, 1577));
          }
        }));
        callback?.(results);
      }
      checkDeepProxy(yua){return new Promise((ok,fail)=>{
        GM_req({method:"GET",url:`https://${yua.ip}/server?check=1&v3=1&room=${yua.roomcode}&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8`,
          headers:{ ...baseHeaders,Cookie:`__cpc=${yua.cookie}`,'User-Agent':this.secb},onloadend:r4=>{
            const info={ip:yua.ip,cookie:yua.cookie,roomcode:yua.roomcode,language:yua.language};
            const match=r4?.responseText?.match(/this\.permalink\s*=\s*this\.URI\(['"]([^'"]+)['"]\)/);
            if(!match)ok({info,response:r4.responseText});
            else fail({info,response:r4.responseText});
         }});
       });
      }


      async addNewProxy(){try{
          const data=await GM_getValue('PastelLive');
          this.proxies=GM_getValue("PastelLive-Proxies")??[];
          const list=data?.ProxyList??[];
          if(!list.length) return console.log('!asd');
          const existing=new Set(this.proxies.map(p=>p.ip));
          const limit=existing.size?15:10;
          const newProxies=list.map(x=>x.ip).filter(ip=>!existing.has(ip)).slice(0,limit);
          if(!newProxies.length) return console.log('!!asd');
          const targets=list.filter(x=>newProxies.includes(x.ip)).slice(0,15);
          console.log(targets);
          targets.forEach(x=>document.body.append(Object.assign(document.createElement`iframe`,{
          id:'proxy-iframe-'+x.id,
          style:'display:none!important;width:0;height:0;opacity:0;pointer-events:none;position:absolute;top:0;left:0;z-index:-9999',
          src:`https://www.croxyproxy.com/?pr0xy=true&proxyid=${x.id}`,
          sandbox:'allow-scripts allow-same-origin allow-forms allow-top-navigation'})));
          const proxiesWithCookies=await new Promise(resolve=>{
          const c=[],t=setTimeout(()=>resolve(c),30_000);
          GM_onMessage('iframe-msg',(_,u)=>{
          try{const ip = new URL(u).hostname;
          GM_req({method:"GET",url:u,headers:baseHeaders,onload:r1=>
          r1.responseHeaders.match(/set-cookie:\s*__cpc=([^;\r\n]+)/i)?.[1] &&
          (c.push({ip,cookie:`${RegExp.$1};`}),c.length>=targets.length&&(clearTimeout(t),GM_removeValueChangeListener?.('iframe-msg', this),resolve(c)))
          })}catch(e){console.error(e)}})});
          this.proxies.push(...proxiesWithCookies);
          GM_setValue("PastelLive-Proxies",this.proxies);
          this.proxyButton.textContent = `Get Proxy (${this.proxies?.length||0})`;
          this.proxies.length>0&&(()=>{this.contentSelector.classList.remove('disabled')})();
          this.proxyButton.classList.remove('disabled');
          document.querySelectorAll('iframe')?.forEach(f=>f.remove());
          console.log("✅ Added proxies:", proxiesWithCookies);
          }catch(err){console.error(err)}
      }

      async playerSearchGO(languagecode){
        try{
          this.monitorRooms.call(this,languagecode,(res)=>{
            const flatList = [];
            for(const[lang,arr] of Object.entries(res)){
              for(const code of arr){
                flatList.push({language:Number(lang),code});
              }
            }
            const distributed = {};
            this.proxies.forEach(p=>distributed[p.ip]=[]);
            let i = 0;
            for(const item of flatList){
              const proxy = this.proxies[i%this.proxies.length];
              distributed[proxy.ip].push({language:item.language,roomcode:item.code,ip:proxy.ip,cookie:proxy.cookie});
              i++;
            }
            const sleep=ms=>new Promise(r=>setTimeout(r,ms));
            for(const [ip,queue] of Object.entries(distributed)){
              (async()=>{
                for(const job of queue){
                  this.checkDeepProxy(job)
                  .then(({info,response})=>{pastelLiveWorker.postMessage({type:"create:socket",details:{task:"live",ip:info.ip,language:info.language,roomCode:info.roomcode,server:response,success:true}})})
                  .catch(({info,response})=>{pastelLiveWorker.postMessage({type:"create:socket",details:{task:"live",ip:info.ip,language:info.language,roomCode:info.roomcode,server:response,success:false}})});
                  await sleep(2000);
                }
              })();
            }
          });
          }catch(e){console.log(e)}
      }

      async initProxies(){
        try{
          this.langSelect.value = await GM_getValue("PastelLive-lang", "2");
          const existing = await GM_getValue('PastelLive');
          if(existing&&(typeof existing!=="object"||Object.keys(existing).length>0))return console.log('PastelLive running...');
          const json = await (await fetch('https://raw.githubusercontent.com/Qwyua/ProxyModule/main/src/ProxyModuleList.json')).json();
          const newProxies = json?.proxyList?.filter(p=>p.active&&!p.ip.startsWith('51.'))??[];
          const data = {ProxyList:newProxies,runProxy:!0};
          await GM_setValue('PastelLive', data);
          console.log('PastelLive Started.', data);
        }catch(e){console.error('PastelLive error!',e)}
      }
    }

    (async () => {
       const live = new PastelLive(document);
       await live.initProxies();
    })();

})();
/*
const getSocialMedia=(url)=>{
        const socialMedia=(url.match(/discordapp|redditmedia|googleusercontent|twimg\.com|gartic\.io|facebook|fbsbx\.com|userapi\.com/i)||[''])[0].toLowerCase();
        const mediaMap={
        "discordapp":"Discord",
        "redditmedia":"Reddit",
        "googleusercontent":"Google",
        "twimg.com":"Twitter",
        "facebook":"Facebook",
        "fbsbx.com":"Facebook",
        "userapi.com":"Vkontakte",
        "gartic.io":"Gartic",
        };
        return mediaMap[socialMedia]||null;
      };
*/
