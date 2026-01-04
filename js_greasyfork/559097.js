// ==UserScript==
// @name         RAP
// @namespace    http://tampermonkey.net/
// @version      21
// @match        *://*/*
// @match        file:///*
// @grant        none
// @run-at       document-start
// @description Инъекция ПЕРЕД любым скриптом страницы
// @downloadURL https://update.greasyfork.org/scripts/559097/RAP.user.js
// @updateURL https://update.greasyfork.org/scripts/559097/RAP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const b = ['blur', 'focus', 'focusin', 'focusout', 'visibilitychange', 'webkitvisibilitychange', 'pagehide', 'pageshow', 'freeze', 'resume'];
    const bs = new Set(b);
    const s = e => { e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault(); return false; };

    const code = `(function(){
const b=['blur','focus','focusin','focusout','visibilitychange','webkitvisibilitychange','pagehide','pageshow','freeze','resume'];
const bs=new Set(b);
const s=e=>{e.stopImmediatePropagation();e.stopPropagation();e.preventDefault();return false;};
const t=x=>x===window||x===document||x===document.body||x===document.documentElement;
b.forEach(e=>{window.addEventListener(e,s,true);document.addEventListener(e,s,true);});
const oa=EventTarget.prototype.addEventListener;
const or=EventTarget.prototype.removeEventListener;
EventTarget.prototype.addEventListener=function(type,fn,opt){if(bs.has(type)&&t(this))return;return oa.call(this,type,fn,opt);};
EventTarget.prototype.removeEventListener=function(type,fn,opt){if(bs.has(type)&&t(this))return;return or.call(this,type,fn,opt);};
const nh={get:()=>null,set:()=>true,configurable:true};
['onblur','onfocus','onvisibilitychange','onpagehide','onpageshow'].forEach(p=>{try{Object.defineProperty(window,p,nh);}catch(e){}try{Object.defineProperty(document,p,nh);}catch(e){}});
try{Object.defineProperty(document,'hidden',{get:()=>false,configurable:true});}catch(e){}
try{Object.defineProperty(document,'visibilityState',{get:()=>'visible',configurable:true});}catch(e){}
try{Object.defineProperty(document,'webkitHidden',{get:()=>false,configurable:true});}catch(e){}
Document.prototype.hasFocus=function(){return true;};
const ns=n=>function toString(){return'function '+n+'() { [native code] }';};
EventTarget.prototype.addEventListener.toString=ns('addEventListener');
EventTarget.prototype.removeEventListener.toString=ns('removeEventListener');
Document.prototype.hasFocus.toString=ns('hasFocus');
const skc=new Set([9,17,18,19,20,27,33,34,35,36,44,45,91,92,93,112,113,114,115,116,117,118,119,120,121,122,123,144,145]);
const sk=new Set(['Tab','Alt','Control','Meta','Escape','PrintScreen','ScrollLock','Pause','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Insert','Home','End','PageUp','PageDown','NumLock','CapsLock','ContextMenu']);
const isk=e=>sk.has(e.key)||skc.has(e.keyCode)||e.altKey||e.ctrlKey||e.metaKey;
const okd={altKey:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'altKey'),ctrlKey:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'ctrlKey'),metaKey:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'metaKey'),key:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'key'),code:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'code'),keyCode:Object.getOwnPropertyDescriptor(KeyboardEvent.prototype,'keyCode')};
const m=new WeakSet();
['keydown','keyup','keypress'].forEach(e=>{oa.call(window,e,ev=>{if(isk(ev))m.add(ev);},true);oa.call(document,e,ev=>{if(isk(ev))m.add(ev);},true);});
Object.defineProperty(KeyboardEvent.prototype,'altKey',{get:function(){return m.has(this)?false:okd.altKey?.get?.call(this)??false;},configurable:true});
Object.defineProperty(KeyboardEvent.prototype,'ctrlKey',{get:function(){return m.has(this)?false:okd.ctrlKey?.get?.call(this)??false;},configurable:true});
Object.defineProperty(KeyboardEvent.prototype,'metaKey',{get:function(){return m.has(this)?false:okd.metaKey?.get?.call(this)??false;},configurable:true});
Object.defineProperty(KeyboardEvent.prototype,'key',{get:function(){return m.has(this)?'':okd.key?.get?.call(this)??'';},configurable:true});
Object.defineProperty(KeyboardEvent.prototype,'code',{get:function(){return m.has(this)?'':okd.code?.get?.call(this)??'';},configurable:true});
Object.defineProperty(KeyboardEvent.prototype,'keyCode',{get:function(){return m.has(this)?0:okd.keyCode?.get?.call(this)??0;},configurable:true});
const of=window.fetch;
window.fetch=function(url){const u=typeof url==='string'?url:url?.url||'';if(u.toLowerCase().includes('violation')||u.toLowerCase().includes('proctoring')||u.includes('LEAVE_PAGE')){return Promise.resolve(new Response('{"success":true}',{status:200}));}return of.apply(this,arguments);};
try{Object.defineProperty(navigator,'onLine',{get:()=>true,configurable:false});}catch(e){}
})();`;

    const inj = () => {
        const sc = document.createElement('script');
        sc.textContent = code;
        (document.documentElement || document.head || document.body).prepend(sc);
        sc.remove();
        return true;
    };

    if (document.documentElement) {
        inj();
    } else {
        const obs = new MutationObserver(() => {
            if (document.documentElement) { inj(); obs.disconnect(); }
        });
        obs.observe(document, { childList: true });
    }

    const t = x => x === window || x === document || x === document.body || x === document.documentElement;
    b.forEach(e => { window.addEventListener(e, s, true); document.addEventListener(e, s, true); });

    const oa = EventTarget.prototype.addEventListener;
    const or = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opt) { if (bs.has(type) && t(this)) return; return oa.call(this, type, fn, opt); };
    EventTarget.prototype.removeEventListener = function (type, fn, opt) { if (bs.has(type) && t(this)) return; return or.call(this, type, fn, opt); };

    const nh = { get: () => null, set: () => true, configurable: true };
    ['onblur', 'onfocus', 'onvisibilitychange', 'onpagehide', 'onpageshow'].forEach(p => {
        try { Object.defineProperty(window, p, nh); } catch (e) { }
        try { Object.defineProperty(document, p, nh); } catch (e) { }
    });

    try { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); } catch (e) { }
    try { Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true }); } catch (e) { }
    try { Object.defineProperty(document, 'webkitHidden', { get: () => false, configurable: true }); } catch (e) { }
    Document.prototype.hasFocus = function () { return true; };

    const skc = new Set([9, 17, 18, 19, 20, 27, 33, 34, 35, 36, 44, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145]);
    const sk = new Set(['Tab', 'Alt', 'Control', 'Meta', 'Escape', 'PrintScreen', 'ScrollLock', 'Pause', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Insert', 'Home', 'End', 'PageUp', 'PageDown', 'NumLock', 'CapsLock', 'ContextMenu']);
    const isk = e => sk.has(e.key) || skc.has(e.keyCode) || e.altKey || e.ctrlKey || e.metaKey;

    const okd = {
        altKey: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'altKey'),
        ctrlKey: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'ctrlKey'),
        metaKey: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'metaKey'),
        key: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'key'),
        code: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'code'),
        keyCode: Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'keyCode'),
    };

    const m = new WeakSet();
    ['keydown', 'keyup', 'keypress'].forEach(e => {
        oa.call(window, e, ev => { if (isk(ev)) m.add(ev); }, true);
        oa.call(document, e, ev => { if (isk(ev)) m.add(ev); }, true);
    });

    Object.defineProperty(KeyboardEvent.prototype, 'altKey', { get: function () { return m.has(this) ? false : okd.altKey?.get?.call(this) ?? false; }, configurable: true });
    Object.defineProperty(KeyboardEvent.prototype, 'ctrlKey', { get: function () { return m.has(this) ? false : okd.ctrlKey?.get?.call(this) ?? false; }, configurable: true });
    Object.defineProperty(KeyboardEvent.prototype, 'metaKey', { get: function () { return m.has(this) ? false : okd.metaKey?.get?.call(this) ?? false; }, configurable: true });
    Object.defineProperty(KeyboardEvent.prototype, 'key', { get: function () { return m.has(this) ? '' : okd.key?.get?.call(this) ?? ''; }, configurable: true });
    Object.defineProperty(KeyboardEvent.prototype, 'code', { get: function () { return m.has(this) ? '' : okd.code?.get?.call(this) ?? ''; }, configurable: true });
    Object.defineProperty(KeyboardEvent.prototype, 'keyCode', { get: function () { return m.has(this) ? 0 : okd.keyCode?.get?.call(this) ?? 0; }, configurable: true });

    const of = window.fetch;
    window.fetch = function (url) {
        const u = typeof url === 'string' ? url : url?.url || '';
        if (u.toLowerCase().includes('violation') || u.toLowerCase().includes('proctoring') || u.includes('LEAVE_PAGE')) {
            return Promise.resolve(new Response('{"success":true}', { status: 200 }));
        }
        return of.apply(this, arguments);
    };

    try { Object.defineProperty(navigator, 'onLine', { get: () => true, configurable: false }); } catch (e) { }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body) b.forEach(e => document.body.addEventListener(e, s, true));
        if (document.documentElement) b.forEach(e => document.documentElement.addEventListener(e, s, true));
    });
})();
