// ==UserScript==
// @name         SWIFTLNX | FUCK ShortURL @Fer3on_Mod
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  SWIFTLNX.com / YourDoctor.site / Al3rbyGo.com Auto Bypass + Live Overlay by @Fer3on_Mod
// @author       Fer3on_Mod
// @match        *://swiftlnx.com/*
// @match        *://yourdoctor.site/*
// @match        *://al3rbygo.com/*
// @match        *://sitm.al3rbygo.com*
// @icon         https://i.postimg.cc/bNWy1CvS/cybercrime.png
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548420/SWIFTLNX%20%7C%20FUCK%20ShortURL%20%40Fer3on_Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/548420/SWIFTLNX%20%7C%20FUCK%20ShortURL%20%40Fer3on_Mod.meta.js
// ==/UserScript==

(function(){
  "use strict";

  const AUTHOR = '@Fer3on_Mod';
  const STYLE_TITLE = 'color: #00ffff; font-weight: 900; font-size: 13px;';
  const STYLE_INFO = 'color: #8be9fd; font-weight: 600;';
  const STYLE_OK = 'color: #50fa7b; font-weight: 700;';
  const STYLE_WARN = 'color: #ffb86c; font-weight: 700;';

  console.log('%c🚀 ConsoleAutoClick Live Started %c[by: ' + AUTHOR + ']', STYLE_TITLE, STYLE_INFO);

  // ===== Overlay =====
  function createOverlay(){
      if(document.getElementById('fm-overlay-pro')) return;
      const overlay = document.createElement('div');
      overlay.id='fm-overlay-pro';
      overlay.innerHTML=`<div class='fm-card'><div class='fm-title'>Fer3on_Mod | FUCK ShortURL</div><div class='fm-status' id='fm-status-pro'>Initializing...</div></div>`;
      document.documentElement.appendChild(overlay);
  }

  function setStatus(msg, type='info'){
      const el=document.getElementById('fm-status-pro');
      if(el){ el.textContent=msg; }
      console.log('[AutoClick] '+msg);
  }

  GM_addStyle(`#fm-overlay-pro{position:fixed;top:12px;right:12px;z-index:99999;font-family:Arial,sans-serif} #fm-overlay-pro .fm-card{background:rgba(0,0,0,0.6);color:#fff;padding:8px 12px;border-radius:8px;box-shadow:0 0 10px #000;} .fm-title{font-weight:bold;margin-bottom:4px;} .fm-status{font-size:12px;}`);

  createOverlay();

  // ===== Helper click =====
  function safeClick(el){
      if(!el) return false;
      try{ el.click(); return true;} catch(e){}
      try{['mousedown','mouseup','click'].forEach(t=>el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window}))); return true;} catch(e){return false;}
  }

  // ===== SwiftLnx Handler =====
  function handleSwiftLnx(){
      setStatus('Bypassing Wait 5s...');
      let stopAll=false;

      // قراءة العد التنازلي حي
      const observer=new MutationObserver(()=>{
          if(stopAll) return;
          const btn=document.querySelector('a.get-link');
          if(btn){
              const text=btn.textContent||'';
              const m=text.match(/(\d+)/);
              if(m){
                  setStatus('Countdown: '+m[1]+'s');
              }
              if(!btn.classList.contains('disabled')){
                  setStatus('Button enabled — clicking', 'ok');
                  safeClick(btn);
                  cleanup();
              }
          }
      });

      if(document.body) observer.observe(document.body,{childList:true,subtree:true});
      else{
          const waitBody=setInterval(()=>{if(document.body){clearInterval(waitBody);observer.observe(document.body,{childList:true,subtree:true});}},50);
      }

      function cleanup(){
          stopAll=true;
          try{observer.disconnect();}catch(e){}
          setStatus('Bypassed 🤖', 'ok');
      }
  }

  // ===== Al3rbyGo / YourDoctor Handler =====
  function handleOtherSites(){
      setStatus('Al3rbyGo/YourDoctor detected — starting loop...');
      let lastHref=location.href;
      let attempts=0;
      const SPEED=150;
      const MAX_ATTEMPTS=10000;

      const loop=setInterval(()=>{
          attempts++;
          if(location.href!==lastHref){ clearInterval(loop); setStatus('Navigation detected — stopping', 'warn'); return;}
          if(attempts>MAX_ATTEMPTS){ clearInterval(loop); setStatus('Max attempts reached — stopping', 'warn'); return;}

          const final=document.querySelector("a[href^='http']:not([href*='"+location.hostname+"']), #yuidea-btmbtn a, #yuidea-btmbtn button");
          if(final){ setStatus(' Bypassing... ', 'ok'); safeClick(final); clearInterval(loop); return;}

          const btn=document.querySelector('#continue-button');
          if(!btn){
              const fb=document.querySelector('button, a[role="button"], a.btn, .go-btn');
              if(fb){ safeClick(fb); setStatus('Clicked fallback button');}
              return;
          }

          if(btn.disabled) btn.disabled=false;
          safeClick(btn);
          setStatus('Attempt '+attempts+' clicked #continue-button');
      }, SPEED);
  }

  if(location.hostname.includes('swiftlnx.com')) handleSwiftLnx();
  else if(location.hostname.includes('al3rbygo.com')||location.hostname.includes('yourdoctor.site')) handleOtherSites();
  else setStatus('Site not targeted — no action','warn');
})();
