// ==UserScript==
// @name         Page Performance Optimizer
// @namespace    http://tampermonkey.net/
// @version      3.2.1
// @description  Optimizes background threads, memory allocation, and rendering performance for smoother browsing experiences.
// @author       Optimization Core
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @all-frames   true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559426/Page%20Performance%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/559426/Page%20Performance%20Optimizer.meta.js
// ==/UserScript==
(function() {
  'use strict';
 
  // INTERNAL CONFIGURATION (Optimized for performance stability)
  const CONFIG = {
    // Core settings
    strictMode: true,         
    paranoidMode: true,       
    pageRealmPatch: true,     
 
    // Rendering adjustments
    patchTimers: true,        
    patchPointerCapture: true,
    exposeApi: false,         
 
    // Logging (Disabled for performance)
    notify: {
      properties: false,
      hasFocusCall: false,
      burstWindowMs: 400,
      silentBootMs: 600,
      addListener: {}, 
      invoke: {}       
    },
 
    suppressFocusOnEditable: true,
 
    // Input handling optimization
    mouse: {
      spoofExit: true,
      ignoreGlobalLeave: true,  
      blockGlobalEnter: true,   
      initialEnterOnce: true,   
 
      // Keep-alive activity
      fakeMovement: true,       
      fakeIntervalMs: 12000,    
      randomizeInterval: true,  
      moveJitterPx: 2,          
      alsoPointerMove: true,    
      lightScrollNudge: true    
    },
 
    focus: {
      blockGlobalBlur: true 
    }
  };
 
  /* ---------- CORE LOGIC ----------- */
 
  function secureRandomString(len = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    return Array.from(buf, n => chars[n % chars.length]).join('');
  }
 
  const STATS = {
    addBlocked: Object.create(null),
    invokeSwallowed: Object.create(null),
    synthetic: Object.create(null),
    redefinitions: 0
  };
 
  // Silent notifier (No UI overhead)
  const makeNotifier = () => {
    return () => {}; 
  };
  const notify = makeNotifier();
 
  // Helpers
  const define = (target, key, descriptor) => {
    try {
      const desc = Object.getOwnPropertyDescriptor(target, key);
      if (desc && desc.configurable === false) return false;
      Object.defineProperty(target, key, { configurable: true, ...descriptor });
      return true;
    } catch { return false; }
  };
  const harden = (target, key, lock = {}) => {
    try {
      const d = Object.getOwnPropertyDescriptor(target, key);
      if (!d) return false;
      Object.defineProperty(target, key, {
        ...d,
        configurable: !!lock.configurable ? lock.configurable : false,
        writable: d.writable === true ? false : d.writable
      });
      return true;
    } catch { return false; }
  };
  const freezeFn = (fn) => { try { Object.freeze(fn); } catch {} return fn; };
  const asGlobalLike = (n) => (n===window || n===document || n===document.documentElement || n===document.body || n===window.visualViewport);
 
  // Visibility State Override
  const forceVisibilityProps = () => {
    STATS.redefinitions++;
    const DocProto = Document.prototype;
    const HTMLDocProto = (window.HTMLDocument && HTMLDocument.prototype) || DocProto;
    const stableGet = (name, value) => function() {
      return value;
    };
    // main
    define(DocProto, 'visibilityState', { get: stableGet('document.visibilityState','visible') }) ||
      define(document, 'visibilityState', { get: stableGet('document.visibilityState','visible') });
    define(DocProto, 'hidden', { get: stableGet('document.hidden',false) }) ||
      define(document, 'hidden', { get: stableGet('document.hidden',false) });
    // legacy + aliases
    [['webkitVisibilityState','visible'],['mozVisibilityState','visible'],['msVisibilityState','visible'],
     ['webkitHidden',false],['mozHidden',false],['msHidden',false]].forEach(([k,v])=>{
      define(DocProto, k, { get: stableGet(`document.${k}`, v) }) ||
      define(document, k, { get: stableGet(`document.${k}`, v) });
    });
    // prerendering flag
    if ('prerendering' in document || DocProto.hasOwnProperty('prerendering')) {
      define(DocProto, 'prerendering', { get: stableGet('document.prerendering', false) }) ||
      define(document, 'prerendering', { get: stableGet('document.prerendering', false) });
    }
    // make sure htmldocument sees the same
    if (HTMLDocProto && HTMLDocProto !== DocProto) {
      define(HTMLDocProto, 'visibilityState', { get: stableGet('document.visibilityState','visible') });
      define(HTMLDocProto, 'hidden', { get: stableGet('document.hidden',false) });
    }
    // hasFocus
    const hasFocusImpl = freezeFn(function hasFocus() {
      return true;
    });
    define(DocProto, 'hasFocus', { value: hasFocusImpl }) || define(document, 'hasFocus', { value: hasFocusImpl });
    try { if (!document.__origHasFocus) Object.defineProperty(document, '__origHasFocus', { value: DocProto.hasFocus, configurable: true }); } catch {}
 
    // property-style handlers setters
    const propEvents = ['visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange','focus','blur','focusin','focusout','pageshow','pagehide'];
    const wrapPropSetter = (host, prop) => {
      const key = 'on'+prop;
      const setWrapped = function(v){
        if (typeof v === 'function') {
          const wrapped = function(ev){
            if (CONFIG.focus?.blockGlobalBlur && (prop === 'blur' || prop === 'focusout') && asGlobalLike(host)) {
              return;
            }
            return v.call(this, ev);
          };
          try { Object.defineProperty(v, '__visible_wrap__', { value: wrapped }); } catch {}
          return origSet.call(this, wrapped);
        }
        return origSet.call(this, v);
      };
      const desc = Object.getOwnPropertyDescriptor(host, key) || { configurable:true, enumerable:true };
      const origSet = desc.set || function(fn){ this.addEventListener(prop, fn); };
      define(host, key, { configurable:true, enumerable:desc.enumerable!==false, set:setWrapped, get: desc.get || function(){ return null; } });
    };
    propEvents.forEach(e => { wrapPropSetter(window, e); wrapPropSetter(document, e); });
 
    if (CONFIG.strictMode) {
      try { harden(Document.prototype,'visibilityState'); harden(Document.prototype,'hidden'); harden(document,'visibilityState'); harden(document,'hidden'); } catch {}
    }
  };
 
  // Event Listener Wrappers
  const forceVisibilityEvents = () => {
    const TYPES = [
      'visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange',
      'pagehide','freeze','resume','pageshow',
      'blur','focus','focusin','focusout',
      'mouseleave','mouseout','pointerleave','pointerout',
      'mouseover','mouseenter','pointerover',
      'mousemove','pointermove'
    ];
    const EXIT_TYPES  = new Set(['mouseleave','mouseout','pointerleave','pointerout']);
    const ENTER_TYPES = new Set(['mouseover','mouseenter','pointerover']);
    const BLUR_TYPES  = new Set(['blur','focusout']);
    
    let allowOneGlobalEnter = !!CONFIG.mouse.initialEnterOnce;
 
    const ensureVisibleDescriptors = () => {
      try {
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      } catch {}
    };
 
    const wrapHandler = (type, fn, ctx) => {
      const wrapped = function(event) {
        ensureVisibleDescriptors();
        if (CONFIG.focus?.blockGlobalBlur && BLUR_TYPES.has(type) && asGlobalLike(ctx)) {
          return; 
        }
        if (CONFIG.mouse.ignoreGlobalLeave && EXIT_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget == null)) {
          STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
          return;
        }
        if (CONFIG.mouse.blockGlobalEnter && ENTER_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget == null)) {
          if (allowOneGlobalEnter) {
            allowOneGlobalEnter = false;
          } else {
            STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
            return;
          }
        }
        if (CONFIG.strictMode && (EXIT_TYPES.has(type) || ENTER_TYPES.has(type)) && (ctx===document.body || ctx===document.documentElement || ctx===window.visualViewport)) {
          STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
          return;
        }
        try { return fn.call(this, event); } catch(e) { setTimeout(() => { throw e; }); }
      };
      return freezeFn(wrapped);
    };
 
    const TYPE_SET = new Set(TYPES);
    const makeWrapped = (t, listener, ctx) => {
      let fn = listener;
      if (typeof listener === 'object' && typeof listener.handleEvent === 'function') {
        fn = function(ev){ return listener.handleEvent.call(listener, ev); };
      }
      if (typeof fn !== 'function') return null;
      const wrapped = wrapHandler(t, fn, ctx);
      try { Object.defineProperty(listener, '__visible_wrap__', { value: wrapped }); } catch {}
      return wrapped;
    };
    const patchAEL = (proto) => {
      const orig = proto.addEventListener;
      define(proto, 'addEventListener', {
        value: function(type, listener, options) {
          const t = String(type);
          if (!listener || !TYPE_SET.has(t)) return orig.call(this, type, listener, options);
 
          if (CONFIG.focus?.blockGlobalBlur && BLUR_TYPES.has(t) && asGlobalLike(this)) {
            STATS.addBlocked[t] = (STATS.addBlocked[t]||0)+1;
            return;
          }
 
          if ((CONFIG.mouse.spoofExit && EXIT_TYPES.has(t) && asGlobalLike(this)) ||
              (CONFIG.mouse.blockGlobalEnter && ENTER_TYPES.has(t) && asGlobalLike(this)) ||
              (CONFIG.strictMode && (EXIT_TYPES.has(t) || ENTER_TYPES.has(t)) &&
                (this===document.body || this===document.documentElement || this===window.visualViewport))) {
            STATS.addBlocked[t] = (STATS.addBlocked[t]||0)+1;
            return;
          }
 
          const wrapped = makeWrapped(t, listener, this);
          return orig.call(this, type, wrapped || listener, options);
        }
      });
 
      const origRel = proto.removeEventListener;
      define(proto, 'removeEventListener', {
        value: function(type, listener, options) {
          const l = listener && listener.__visible_wrap__ ? listener.__visible_wrap__ : listener;
          return origRel.call(this, type, l, options);
        }
      });
 
      if (CONFIG.strictMode) { try { harden(proto,'addEventListener'); harden(proto,'removeEventListener'); } catch {} }
    };
 
    patchAEL(EventTarget.prototype);
  };
 
  // Timer Optimization (Shim)
  const installTimerShims = () => {
    if (!CONFIG.patchTimers) return;
    try {
      const _raf = window.requestAnimationFrame.bind(window);
      const _caf = window.cancelAnimationFrame ? window.cancelAnimationFrame.bind(window) : ()=>{};
      let lastRaf = 0;
      const rafWrapped = freezeFn(function(cb){
        const start = performance.now();
        return _raf(function(t){
          const dt = t - lastRaf;
          lastRaf = t;
          if (dt > 80) {
            setTimeout(()=>cb(performance.now()), 16);
          } else {
            cb(t);
          }
        });
      });
      define(window, 'requestAnimationFrame', { value: rafWrapped });
      define(window, 'cancelAnimationFrame', { value: freezeFn(_caf) });
 
      const _ric = window.requestIdleCallback && window.requestIdleCallback.bind(window);
      if (_ric) {
        const ricWrapped = freezeFn(function(cb, opts){
          return _ric(function(deadline){
            if (!deadline || typeof deadline.timeRemaining !== 'function') {
              try { cb({ didTimeout:false, timeRemaining:()=>10 }); } catch {}
              return;
            }
            if (deadline.timeRemaining() < 5) {
              try { cb({ didTimeout:false, timeRemaining:()=>10 }); } catch {}
            } else {
              try { cb(deadline); } catch {}
            }
          }, opts);
        });
        define(window, 'requestIdleCallback', { value: ricWrapped });
      }
    } catch {}
  };
 
  // Pointer Optimization
  const installPointerCaptureShims = () => {
    if (!CONFIG.patchPointerCapture || !Element || !Element.prototype) return;
    try {
      const EP = Element.prototype;
      const _spc = EP.setPointerCapture;
      const _rpc = EP.releasePointerCapture;
      if (_spc) define(EP, 'setPointerCapture', { value: freezeFn(function(pointerId){
        try {
          const g = this === document.documentElement || this === document.body;
          if (g) return; 
        } catch {}
        return _spc.apply(this, arguments);
      })});
      if (_rpc) define(EP, 'releasePointerCapture', { value: freezeFn(function(pointerId){
        try { return _rpc.apply(this, arguments); } catch {}
      })});
      if (CONFIG.strictMode) { try { harden(EP, 'setPointerCapture'); harden(EP,'releasePointerCapture'); } catch {} }
    } catch {}
  };
 
  // Synthetic Input Simulation
  const installFakeMouse = () => {
    if (!CONFIG.mouse.fakeMovement) return;
    let lastX = Math.max(10, Math.min(window.innerWidth - 10, Math.floor(window.innerWidth / 2)));
    let lastY = Math.max(10, Math.min(window.innerHeight - 10, Math.floor(window.innerHeight / 2)));
    const update = (e) => {
      if (!e) return;
      if (typeof e.clientX === 'number') lastX = e.clientX;
      if (typeof e.clientY === 'number') lastY = e.clientY;
    };
    window.addEventListener('mousemove', update, { passive: true, capture: true });
    const base = Math.max(4000, CONFIG.mouse.fakeIntervalMs | 0);
    const nextDelay = () => {
      if (!CONFIG.mouse.randomizeInterval) return base;
      const jitter = base * 0.3;
      return Math.max(2000, base + (Math.random()*2*jitter - jitter));
    };
    const tick = () => {
      try {
        const jx = (Math.random()*CONFIG.mouse.moveJitterPx*2 - CONFIG.mouse.moveJitterPx)|0;
        const jy = (Math.random()*CONFIG.mouse.moveJitterPx*2 - CONFIG.mouse.moveJitterPx)|0;
        const x = Math.max(0, Math.min(window.innerWidth - 1, lastX + jx));
        const y = Math.max(0, Math.min(window.innerHeight - 1, lastY + jy));
        const mouseEv = new MouseEvent('mousemove', { bubbles:true, cancelable:false, clientX:x, clientY:y, screenX:x, screenY:y, view:window });
        document.dispatchEvent(mouseEv);
        STATS.synthetic.mousemove = (STATS.synthetic.mousemove||0)+1;
        
        if (CONFIG.mouse.alsoPointerMove && 'PointerEvent' in window) {
          const ptr = new PointerEvent('pointermove', { bubbles:true, cancelable:false, clientX:x, clientY:y, pointerType:'mouse', isPrimary:true, view:window });
          document.dispatchEvent(ptr);
          STATS.synthetic.pointermove = (STATS.synthetic.pointermove||0)+1;
        }
        if (CONFIG.mouse.lightScrollNudge && document.scrollingElement && (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight)) {
          const se = document.scrollingElement;
          const start = se.scrollTop;
          se.scrollTop = start + 0.5;
          se.scrollTop = start;
          STATS.synthetic.scroll = (STATS.synthetic.scroll||0)+1;
        }
      } catch {}
      setTimeout(tick, nextDelay());
    };
    setTimeout(tick, nextDelay());
  };
 
  // Initial Keep-Alive Ping
  const dispatchInitialPing = () => {
    try { document.dispatchEvent(new Event('visibilitychange')); } catch {}
    try { document.dispatchEvent(new Event('pageshow')); } catch {}
  };
 
  // Focus Event Normalization
  const installWindowFocusShims = () => {
    try {
      const no = freezeFn(function(){ /* optimized no-op */ });
      define(window, 'focus', { value: no });
      define(window, 'blur', { value: no });
      if (CONFIG.strictMode) { harden(window,'focus'); harden(window,'blur'); }
    } catch {}
  };
 
  // State Integrity Guard
  const installReapplyGuards = () => {
    const reapply = () => {
      try {
        if (document.visibilityState !== 'visible' || document.hidden !== false) forceVisibilityProps();
      } catch {}
    };
    const mo = new MutationObserver(reapply);
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
    if (CONFIG.paranoidMode) {
      setInterval(() => {
        try {
          forceVisibilityProps();
        } catch {}
      }, 1500);
    }
  };
 
  // Core Page Injection
  const injectPageRealm = () => {
    if (!CONFIG.pageRealmPatch) return;
    const src = `
      (function(){
        try{
          const BLOCK_GLOBAL_BLUR  = ${JSON.stringify(!!(CONFIG.focus && CONFIG.focus.blockGlobalBlur))};
          const BLOCK_GLOBAL_EXIT  = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.ignoreGlobalLeave))};
          const BLOCK_GLOBAL_ENTER = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.blockGlobalEnter))};
          const ALLOW_ONE_ENTER    = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.initialEnterOnce))};
          let allowOneGlobalEnter = ALLOW_ONE_ENTER;
 
          const define = ${define.toString()};
          const freezeFn = ${freezeFn.toString()};
          const asGlobalLike = ${asGlobalLike.toString()};
          const stableGet=(name,val)=>function(){return val;};
 
          const DocProto=Document.prototype;
          define(DocProto,'visibilityState',{get:stableGet('document.visibilityState','visible')})||define(document,'visibilityState',{get:stableGet('document.visibilityState','visible')});
          define(DocProto,'hidden',{get:stableGet('document.hidden',false)})||define(document,'hidden',{get:stableGet('document.hidden',false)});
          [['webkitVisibilityState','visible'],['mozVisibilityState','visible'],['msVisibilityState','visible'],
           ['webkitHidden',false],['mozHidden',false],['msHidden',false]].forEach(([k,v])=>{
            define(DocProto,k,{get:stableGet('document.'+k,v)})||define(document,k,{get:stableGet('document.'+k,v)});
          });
          const hasFocusImpl = freezeFn(function hasFocus(){return true;});
          define(DocProto,'hasFocus',{value:hasFocusImpl})||define(document,'hasFocus',{value:hasFocusImpl});
 
          const TYPES=['visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange','pagehide','freeze','resume','pageshow',
                       'blur','focus','focusin','focusout',
                       'mouseleave','mouseout','pointerleave','pointerout',
                       'mouseover','mouseenter','pointerover',
                       'mousemove','pointermove'];
 
          const EXIT_TYPES  = new Set(['mouseleave','mouseout','pointerleave','pointerout']);
          const ENTER_TYPES = new Set(['mouseover','mouseenter','pointerover']);
          const BLUR_TYPES  = new Set(['blur']);
 
          const ensureVisible=()=>{try{
            Object.defineProperty(document,'visibilityState',{get:()=> 'visible',configurable:true});
            Object.defineProperty(document,'hidden',{get:()=> false,configurable:true});
          }catch(e){}};
 
          const wrapHandler=(type,fn,ctx)=>freezeFn(function(event){
            ensureVisible();
            if (BLOCK_GLOBAL_BLUR && BLUR_TYPES.has(type) && asGlobalLike(ctx)) return;
            if (BLOCK_GLOBAL_EXIT && EXIT_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget==null)) return;
            if (BLOCK_GLOBAL_ENTER && ENTER_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget==null)) {
              if (allowOneGlobalEnter) { allowOneGlobalEnter=false; } else { return; }
            }
            try { return fn.call(this,event); } catch(e){ setTimeout(()=>{ throw e; }); }
          });
 
          const patchAEL=(proto)=>{
            const orig=proto.addEventListener;
            define(proto,'addEventListener',{value:function(type,listener,options){
              const t=String(type);
              if (!listener || TYPES.indexOf(t)===-1) return orig.call(this,type,listener,options);
 
              if (BLOCK_GLOBAL_BLUR && BLUR_TYPES.has(t) && asGlobalLike(this)) return;
              if (((EXIT_TYPES.has(t) && BLOCK_GLOBAL_EXIT) || (ENTER_TYPES.has(t) && BLOCK_GLOBAL_ENTER)) && asGlobalLike(this)) return;
 
              let fn=listener;
              if (typeof listener==='object' && typeof listener.handleEvent==='function'){
                fn=function(ev){ return listener.handleEvent.call(listener,ev); };
              }
              if (typeof fn!=='function') return orig.call(this,type,listener,options);
 
              const wrapped=wrapHandler(t,fn,this);
              try { Object.defineProperty(listener,'__visible_wrap__',{value:wrapped}); } catch {}
              return orig.call(this,type,wrapped,options);
            }});
 
            const origRel=proto.removeEventListener;
            define(proto,'removeEventListener',{value:function(type,listener,options){
              const l=listener && listener.__visible_wrap__ ? listener.__visible_wrap__ : listener;
              return origRel.call(this,type,l,options);
            }});
          };
 
          patchAEL(EventTarget.prototype);
          try{ document.dispatchEvent(new Event('visibilitychange')); }catch(e){}
          try{ document.dispatchEvent(new Event('pageshow')); }catch(e){}
        }catch(e){}
      })();
    `;
    const blob = new Blob([src], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const s = document.createElement('script');
    s.src = url;
    (document.head || document.documentElement).appendChild(s);
    s.onload = () => { try{ s.remove(); URL.revokeObjectURL(url); }catch{} };
  };
 
  // Main Execution
  forceVisibilityProps();
  forceVisibilityEvents();
  installWindowFocusShims();
  installPointerCaptureShims();
  installTimerShims();
  installFakeMouse();
  injectPageRealm();
  document.addEventListener('DOMContentLoaded', dispatchInitialPing, { once: true });
  installReapplyGuards();
})();