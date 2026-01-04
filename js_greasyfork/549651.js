// ==UserScript==
// @name         CAI Avatar Size Increaser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  I have no idea what am i doing
// @author       koskleimenov
// @match        *://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549651/CAI%20Avatar%20Size%20Increaser.user.js
// @updateURL https://update.greasyfork.org/scripts/549651/CAI%20Avatar%20Size%20Increaser.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const SIZE_PX = 120;
  const GAP_PX = 12;
  const LOG = true;

  const BLACKLIST_KEYWORDS = ['sidebar','card','cards','profile','toolbar','nav','header','menu','discover','create','search'];

  function lg(...args){ if(LOG) console.log('[CAI-avatar-scope]', ...args); }

  function looksLikeAvatar(img){
    if(!img || !img.src) return false;
    const s = img.src.toLowerCase();
    if(s.includes('/avatars/') || s.includes('/avatar/') || s.includes('avatar-')) return true;
    const cls = (img.className||'').toLowerCase();
    if(cls.includes('avatar') || cls.includes('profile')) return true;
    return false;
  }

  function isBlacklisted(el){
    if(!el) return false;
    let cur = el;
    while(cur){
      const combined = (cur.className||'') + ' ' + (cur.id||'') + ' ' + (cur.getAttribute && (cur.getAttribute('data-testid')||''));
      for(const kw of BLACKLIST_KEYWORDS){
        if(combined.toLowerCase().includes(kw)) return true;
      }
      cur = cur.parentElement;
    }
    return false;
  }

  function findChatPanel(){
    const els = Array.from(document.querySelectorAll('main, section, div'));
    let best = null, bestScore = 0;
    for(const el of els){
      try {
        if (!el.offsetParent) continue; // hidden
        if (isBlacklisted(el)) continue;
        const imgs = el.querySelectorAll('img');
        let avatarCount = 0;
        for(const img of imgs) if(looksLikeAvatar(img)) avatarCount++;
        if(avatarCount < 1) continue;
        const textLen = (el.innerText || '').trim().length;
        const score = avatarCount * 3 + (textLen > 40 ? 1 : 0);
        if(score > bestScore){
          best = el;
          bestScore = score;
        }
      } catch(e){}
    }
    if(bestScore > 0){
      lg('picked chat panel candidate (score):', best, bestScore);
      return best;
    }
    return null;
  }

  function findMessageAncestor(node){
    if(!node) return null;
    return node.closest('[class*="message"], [class*="msg-"], [data-testid*="message"], [role="article"], [role="listitem"]') || node.closest('div');
  }

  function findAvatarContainer(img){
    if(!img) return null;
    let cur = img;
    for(let i=0;i<8 && cur;i++){
      if(!cur) break;
      const cname = (cur.className||'').toLowerCase();
      if(cname.includes('avatar') || cname.includes('avatar-wrap') || cur.tagName.toLowerCase()==='figure') return cur;
      cur = cur.parentElement;
    }
    return img.parentElement;
  }

  function findBubbleElement(msgAncestor, avatarContainer){
    if(!msgAncestor) return null;
    const sel = ['[class*="bubble"]','[class*="msg-bubble"]','[data-testid*="message-text"]','[class*="messageBody"]','[class*="content"]'];
    for(const s of sel){
      try {
        const el = msgAncestor.querySelector(s);
        if(el) return el;
      } catch(e){}
    }
    try{
      const nodes = Array.from(msgAncestor.querySelectorAll('*')).filter(n=>{
        if(n === avatarContainer) return false;
        try { return (n.innerText||'').trim().length > 0; } catch(e){ return false; }
      });
      return nodes.length ? nodes[0] : null;
    } catch(e){}
    return null;
  }

  function styleOneAvatar(img, chatScopeEl){
    try{
      if(!img || img.__cai_scoped) return false;
      if(!looksLikeAvatar(img)) return false;
      if(!chatScopeEl || !chatScopeEl.contains(img)) return false;

      const msg = findMessageAncestor(img);
      if(!msg) { lg('skip: not in message ancestor', img); return false; }
      if(isBlacklisted(msg)) { lg('skip: message in blacklisted area', msg); return false; }

      const container = findAvatarContainer(img);
      if(!container) { lg('skip: no container', img); return false; }

      container.style.width = `${SIZE_PX}px`;
      container.style.height = `${SIZE_PX}px`;
      container.style.minWidth = `${SIZE_PX}px`;
      container.style.minHeight = `${SIZE_PX}px`;
      container.style.flex = `0 0 ${SIZE_PX}px`;
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.overflow = 'visible';
      container.style.boxSizing = 'border-box';
      container.style.gap = '0';

      img.style.width = '100%';
      img.style.height = '100%';
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '10px';
      img.style.transform = 'none';
      img.style.display = 'block';

      const bubble = findBubbleElement(msg, container);
      if(bubble){
        try {
          const aRect = container.getBoundingClientRect();
          const bRect = bubble.getBoundingClientRect();
          if(aRect.left < bRect.left) {
            bubble.style.marginLeft = `${SIZE_PX + GAP_PX}px`;
            bubble.style.marginRight = '';
          } else {
            bubble.style.marginRight = `${SIZE_PX + GAP_PX}px`;
            bubble.style.marginLeft = '';
          }
        } catch(e){
          bubble.style.marginLeft = `${SIZE_PX + GAP_PX}px`;
        }
      }

      img.__cai_scoped = true;
      lg('styled avatar:', img.src || img, 'containerClass=' + (container.className||container.tagName), 'bubble=', bubble && (bubble.className || bubble.tagName));
      return true;
    } catch(err){
      console.error('CAI-scope error', err);
      return false;
    }
  }

  function processAllInScope(chatScopeEl){
    if(!chatScopeEl) return 0;
    let changed = 0;
    const imgs = chatScopeEl.querySelectorAll('img');
    imgs.forEach(img => {
      if(styleOneAvatar(img, chatScopeEl)) changed++;
    });
    return changed;
  }

  (function start(){
    let attempts = 0;
    const maxAttempts = 40;
    const t = setInterval(()=>{
      attempts++;
      const chat = findChatPanel();
      if(chat){
        clearInterval(t);
        lg('CHAT SCOPE FOUND:', chat);
        try { chat.setAttribute('data-cai-chat-scope','1'); } catch(e){}
        processAllInScope(chat);

        const mo = new MutationObserver((mutations)=>{
          for(const m of mutations){
            if(!m.addedNodes) continue;
            m.addedNodes.forEach(node=>{
              if(node.nodeType !== 1) return;
              if(node.tagName && node.tagName.toLowerCase() === 'img'){
                styleOneAvatar(node, chat);
              } else {
                const imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
                imgs.forEach(i => styleOneAvatar(i, chat));
              }
            });
          }
        });
        mo.observe(chat, { childList: true, subtree: true });
        setInterval(()=>processAllInScope(chat), 3000);
        lg('CAI avatar scoper running (SIZE_PX=' + SIZE_PX + ')');
      } else {
        if(attempts >= maxAttempts){
          clearInterval(t);
          lg('Unable to find a confident chat panel candidate. Falling back to limited global scan (will attempt to avoid sidebars).');
          processAllInScope(document);
          const globalMo = new MutationObserver((mutations)=>{
            for(const m of mutations){
              if(!m.addedNodes) continue;
              m.addedNodes.forEach(node=>{
                if(node.nodeType !== 1) return;
                const imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
                imgs.forEach(i=>{
                  try{
                    if(!isBlacklisted(i) && looksLikeAvatar(i)) styleOneAvatar(i, document);
                  }catch(e){}
                });
              });
            }
          });
          globalMo.observe(document, { childList: true, subtree: true });
        } else {
          // keep trying
        }
      }
    }, 300);
  })();
})();