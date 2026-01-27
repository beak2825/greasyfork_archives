// ==UserScript==
// @name         OpenFront.io Bundle: Player List + Auto-Join
// @namespace    https://openfront.io/
// @version      2.7.0
// @description  Merges "Lobby Player List" and "Auto-Join Lobby" into one efficient script. Shared API calls to prevent 429 errors. Compatible with OpenFront.io v0.29.0+
// @homepageURL  https://github.com/DeLoWaN/openfront-autojoin-lobby
// @author       DeLoVaN + SyntaxMenace + DeepSeek + Claude
// @match        https://openfront.io/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      UNLICENSED
// @downloadURL https://update.greasyfork.org/scripts/555551/OpenFrontio%20Bundle%3A%20Player%20List%20%2B%20Auto-Join.user.js
// @updateURL https://update.greasyfork.org/scripts/555551/OpenFrontio%20Bundle%3A%20Player%20List%20%2B%20Auto-Join.meta.js
// ==/UserScript==

"use strict";(()=>{var ct=Object.create;var Me=Object.defineProperty;var ut=Object.getOwnPropertyDescriptor;var dt=Object.getOwnPropertyNames;var pt=Object.getPrototypeOf,mt=Object.prototype.hasOwnProperty;var O=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports);var gt=(i,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of dt(e))!mt.call(i,o)&&o!==t&&Me(i,o,{get:()=>e[o],enumerable:!(a=ut(e,o))||a.enumerable});return i};var bt=(i,e,t)=>(t=i!=null?ct(pt(i)):{},gt(e||!i||!i.__esModule?Me(t,"default",{value:i,enumerable:!0}):t,i));var Ie=O((Pe,ce)=>{(function(i,e,t){function a(n){var l=this,u=s();l.next=function(){var c=2091639*l.s0+l.c*23283064365386963e-26;return l.s0=l.s1,l.s1=l.s2,l.s2=c-(l.c=c|0)},l.c=1,l.s0=u(" "),l.s1=u(" "),l.s2=u(" "),l.s0-=u(n),l.s0<0&&(l.s0+=1),l.s1-=u(n),l.s1<0&&(l.s1+=1),l.s2-=u(n),l.s2<0&&(l.s2+=1),u=null}function o(n,l){return l.c=n.c,l.s0=n.s0,l.s1=n.s1,l.s2=n.s2,l}function r(n,l){var u=new a(n),c=l&&l.state,d=u.next;return d.int32=function(){return u.next()*4294967296|0},d.double=function(){return d()+(d()*2097152|0)*11102230246251565e-32},d.quick=d,c&&(typeof c=="object"&&o(c,u),d.state=function(){return o(u,{})}),d}function s(){var n=4022871197,l=function(u){u=String(u);for(var c=0;c<u.length;c++){n+=u.charCodeAt(c);var d=.02519603282416938*n;n=d>>>0,d-=n,d*=n,n=d>>>0,d-=n,n+=d*4294967296}return(n>>>0)*23283064365386963e-26};return l}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.alea=r})(Pe,typeof ce=="object"&&ce,typeof define=="function"&&define)});var Ae=O((je,ue)=>{(function(i,e,t){function a(s){var n=this,l="";n.x=0,n.y=0,n.z=0,n.w=0,n.next=function(){var c=n.x^n.x<<11;return n.x=n.y,n.y=n.z,n.z=n.w,n.w^=n.w>>>19^c^c>>>8},s===(s|0)?n.x=s:l+=s;for(var u=0;u<l.length+64;u++)n.x^=l.charCodeAt(u)|0,n.next()}function o(s,n){return n.x=s.x,n.y=s.y,n.z=s.z,n.w=s.w,n}function r(s,n){var l=new a(s),u=n&&n.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var d=l.next()>>>11,m=(l.next()>>>0)/4294967296,g=(d+m)/(1<<21);while(g===0);return g},c.int32=l.next,c.quick=c,u&&(typeof u=="object"&&o(u,l),c.state=function(){return o(l,{})}),c}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.xor128=r})(je,typeof ue=="object"&&ue,typeof define=="function"&&define)});var Re=O((Ge,de)=>{(function(i,e,t){function a(s){var n=this,l="";n.next=function(){var c=n.x^n.x>>>2;return n.x=n.y,n.y=n.z,n.z=n.w,n.w=n.v,(n.d=n.d+362437|0)+(n.v=n.v^n.v<<4^(c^c<<1))|0},n.x=0,n.y=0,n.z=0,n.w=0,n.v=0,s===(s|0)?n.x=s:l+=s;for(var u=0;u<l.length+64;u++)n.x^=l.charCodeAt(u)|0,u==l.length&&(n.d=n.x<<10^n.x>>>4),n.next()}function o(s,n){return n.x=s.x,n.y=s.y,n.z=s.z,n.w=s.w,n.v=s.v,n.d=s.d,n}function r(s,n){var l=new a(s),u=n&&n.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var d=l.next()>>>11,m=(l.next()>>>0)/4294967296,g=(d+m)/(1<<21);while(g===0);return g},c.int32=l.next,c.quick=c,u&&(typeof u=="object"&&o(u,l),c.state=function(){return o(l,{})}),c}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.xorwow=r})(Ge,typeof de=="object"&&de,typeof define=="function"&&define)});var Fe=O((Be,pe)=>{(function(i,e,t){function a(s){var n=this;n.next=function(){var u=n.x,c=n.i,d,m,g;return d=u[c],d^=d>>>7,m=d^d<<24,d=u[c+1&7],m^=d^d>>>10,d=u[c+3&7],m^=d^d>>>3,d=u[c+4&7],m^=d^d<<7,d=u[c+7&7],d=d^d<<13,m^=d^d<<9,u[c]=m,n.i=c+1&7,m};function l(u,c){var d,m,g=[];if(c===(c|0))m=g[0]=c;else for(c=""+c,d=0;d<c.length;++d)g[d&7]=g[d&7]<<15^c.charCodeAt(d)+g[d+1&7]<<13;for(;g.length<8;)g.push(0);for(d=0;d<8&&g[d]===0;++d);for(d==8?m=g[7]=-1:m=g[d],u.x=g,u.i=0,d=256;d>0;--d)u.next()}l(n,s)}function o(s,n){return n.x=s.x.slice(),n.i=s.i,n}function r(s,n){s==null&&(s=+new Date);var l=new a(s),u=n&&n.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var d=l.next()>>>11,m=(l.next()>>>0)/4294967296,g=(d+m)/(1<<21);while(g===0);return g},c.int32=l.next,c.quick=c,u&&(u.x&&o(u,l),c.state=function(){return o(l,{})}),c}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.xorshift7=r})(Be,typeof pe=="object"&&pe,typeof define=="function"&&define)});var ze=O((Oe,me)=>{(function(i,e,t){function a(s){var n=this;n.next=function(){var u=n.w,c=n.X,d=n.i,m,g;return n.w=u=u+1640531527|0,g=c[d+34&127],m=c[d=d+1&127],g^=g<<13,m^=m<<17,g^=g>>>15,m^=m>>>12,g=c[d]=g^m,n.i=d,g+(u^u>>>16)|0};function l(u,c){var d,m,g,y,h,v=[],$=128;for(c===(c|0)?(m=c,c=null):(c=c+"\0",m=0,$=Math.max($,c.length)),g=0,y=-32;y<$;++y)c&&(m^=c.charCodeAt((y+32)%c.length)),y===0&&(h=m),m^=m<<10,m^=m>>>15,m^=m<<4,m^=m>>>13,y>=0&&(h=h+1640531527|0,d=v[y&127]^=m+h,g=d==0?g+1:0);for(g>=128&&(v[(c&&c.length||0)&127]=-1),g=127,y=4*128;y>0;--y)m=v[g+34&127],d=v[g=g+1&127],m^=m<<13,d^=d<<17,m^=m>>>15,d^=d>>>12,v[g]=m^d;u.w=h,u.X=v,u.i=g}l(n,s)}function o(s,n){return n.i=s.i,n.w=s.w,n.X=s.X.slice(),n}function r(s,n){s==null&&(s=+new Date);var l=new a(s),u=n&&n.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var d=l.next()>>>11,m=(l.next()>>>0)/4294967296,g=(d+m)/(1<<21);while(g===0);return g},c.int32=l.next,c.quick=c,u&&(u.X&&o(u,l),c.state=function(){return o(l,{})}),c}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.xor4096=r})(Oe,typeof me=="object"&&me,typeof define=="function"&&define)});var Ne=O((He,ge)=>{(function(i,e,t){function a(s){var n=this,l="";n.next=function(){var c=n.b,d=n.c,m=n.d,g=n.a;return c=c<<25^c>>>7^d,d=d-m|0,m=m<<24^m>>>8^g,g=g-c|0,n.b=c=c<<20^c>>>12^d,n.c=d=d-m|0,n.d=m<<16^d>>>16^g,n.a=g-c|0},n.a=0,n.b=0,n.c=-1640531527,n.d=1367130551,s===Math.floor(s)?(n.a=s/4294967296|0,n.b=s|0):l+=s;for(var u=0;u<l.length+20;u++)n.b^=l.charCodeAt(u)|0,n.next()}function o(s,n){return n.a=s.a,n.b=s.b,n.c=s.c,n.d=s.d,n}function r(s,n){var l=new a(s),u=n&&n.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var d=l.next()>>>11,m=(l.next()>>>0)/4294967296,g=(d+m)/(1<<21);while(g===0);return g},c.int32=l.next,c.quick=c,u&&(typeof u=="object"&&o(u,l),c.state=function(){return o(l,{})}),c}e&&e.exports?e.exports=r:t&&t.amd?t(function(){return r}):this.tychei=r})(He,typeof ge=="object"&&ge,typeof define=="function"&&define)});var Ue=O(()=>{});var _e=O((De,ee)=>{(function(i,e,t){var a=256,o=6,r=52,s="random",n=t.pow(a,o),l=t.pow(2,r),u=l*2,c=a-1,d;function m(b,C,T){var w=[];C=C==!0?{entropy:!0}:C||{};var S=v(h(C.entropy?[b,P(e)]:b??$(),3),w),I=new g(w),j=function(){for(var E=I.g(o),R=n,G=0;E<l;)E=(E+G)*a,R*=a,G=I.g(1);for(;E>=u;)E/=2,R/=2,G>>>=1;return(E+G)/R};return j.int32=function(){return I.g(4)|0},j.quick=function(){return I.g(4)/4294967296},j.double=j,v(P(I.S),e),(C.pass||T||function(E,R,G,F){return F&&(F.S&&y(F,I),E.state=function(){return y(I,{})}),G?(t[s]=E,R):E})(j,S,"global"in C?C.global:this==t,C.state)}function g(b){var C,T=b.length,w=this,S=0,I=w.i=w.j=0,j=w.S=[];for(T||(b=[T++]);S<a;)j[S]=S++;for(S=0;S<a;S++)j[S]=j[I=c&I+b[S%T]+(C=j[S])],j[I]=C;(w.g=function(E){for(var R,G=0,F=w.i,D=w.j,z=w.S;E--;)R=z[F=c&F+1],G=G*a+z[c&(z[F]=z[D=c&D+R])+(z[D]=R)];return w.i=F,w.j=D,G})(a)}function y(b,C){return C.i=b.i,C.j=b.j,C.S=b.S.slice(),C}function h(b,C){var T=[],w=typeof b,S;if(C&&w=="object")for(S in b)try{T.push(h(b[S],C-1))}catch{}return T.length?T:w=="string"?b:b+"\0"}function v(b,C){for(var T=b+"",w,S=0;S<T.length;)C[c&S]=c&(w^=C[c&S]*19)+T.charCodeAt(S++);return P(C)}function $(){try{var b;return d&&(b=d.randomBytes)?b=b(a):(b=new Uint8Array(a),(i.crypto||i.msCrypto).getRandomValues(b)),P(b)}catch{var C=i.navigator,T=C&&C.plugins;return[+new Date,i,T,i.screen,P(e)]}}function P(b){return String.fromCharCode.apply(0,b)}if(v(t.random(),e),typeof ee=="object"&&ee.exports){ee.exports=m;try{d=Ue()}catch{}}else typeof define=="function"&&define.amd?define(function(){return m}):t["seed"+s]=m})(typeof self<"u"?self:De,[],Math)});var Je=O((Vt,qe)=>{var ft=Ie(),ht=Ae(),yt=Re(),vt=Fe(),xt=ze(),Ct=Ne(),N=_e();N.alea=ft;N.xor128=ht;N.xorwow=yt;N.xorshift7=vt;N.xor4096=xt;N.tychei=Ct;qe.exports=N});var p={bgPrimary:"rgba(10, 14, 22, 0.92)",bgSecondary:"rgba(18, 26, 40, 0.75)",bgHover:"rgba(35, 48, 70, 0.6)",textPrimary:"#e7f1ff",textSecondary:"rgba(231, 241, 255, 0.7)",textMuted:"rgba(231, 241, 255, 0.5)",accent:"rgba(46, 211, 241, 0.95)",accentHover:"rgba(99, 224, 255, 0.95)",accentMuted:"rgba(46, 211, 241, 0.18)",accentAlt:"rgba(99, 110, 255, 0.9)",success:"rgba(20, 220, 170, 0.9)",successSolid:"#38d9a9",warning:"#f2c94c",error:"#ff7d87",highlight:"rgba(88, 211, 255, 0.2)",border:"rgba(120, 140, 180, 0.3)",borderAccent:"rgba(46, 211, 241, 0.55)"},L={display:"'Trebuchet MS', 'Segoe UI', Tahoma, Verdana, sans-serif",body:"'Segoe UI', Tahoma, Verdana, sans-serif",mono:"'Consolas', 'Courier New', monospace"},f={xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},M={sm:"4px",md:"6px",lg:"8px",xl:"12px"},W={sm:"0 2px 8px rgba(3, 8, 18, 0.35)",md:"0 10px 22px rgba(3, 8, 18, 0.45)",lg:"0 24px 40px rgba(2, 6, 16, 0.55), 0 0 24px rgba(46, 211, 241, 0.08)"},x={fast:"0.12s",normal:"0.2s",slow:"0.3s"};var Q={threadCount:20,lobbyPollingRate:1e3},k={autoJoinSettings:"OF_AUTOJOIN_SETTINGS",autoJoinPanelPosition:"OF_AUTOJOIN_PANEL_POSITION",playerListPanelPosition:"OF_PLAYER_LIST_PANEL_POSITION",playerListPanelSize:"OF_PLAYER_LIST_PANEL_SIZE",playerListShowOnlyClans:"OF_PLAYER_LIST_SHOW_ONLY_CLANS",playerListCollapseStates:"OF_PLAYER_LIST_COLLAPSE_STATES",playerListRecentTags:"OF_PLAYER_LIST_RECENT_TAGS",playerListAutoRejoin:"OF_PLAYER_LIST_AUTO_REJOIN"},V={panel:9998,panelOverlay:9999,modal:1e4,notification:2e4};function Ee(){return`
    /* Body layout wrapper for flexbox */
    #of-game-layout-wrapper {
      display: flex;
      height: 100vh;
      width: 100vw;
    }
    #of-game-content {
      flex: 1;
      overflow: auto;
      min-width: 0;
    }

    :root {
      --of-hud-accent: ${p.accent};
      --of-hud-accent-soft: ${p.accentMuted};
      --of-hud-accent-alt: ${p.accentAlt};
      --of-hud-border: ${p.border};
      --of-hud-border-strong: ${p.borderAccent};
      --of-hud-bg: ${p.bgPrimary};
      --of-hud-bg-2: ${p.bgSecondary};
      --of-hud-text: ${p.textPrimary};
    }

    @keyframes ofPanelEnter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .of-panel {
      position: fixed;
      background: linear-gradient(145deg, rgba(12, 18, 30, 0.98) 0%, rgba(10, 16, 26, 0.94) 60%, rgba(8, 12, 20, 0.96) 100%);
      border: 1px solid ${p.border};
      border-radius: ${M.lg};
      box-shadow: ${W.lg};
      font-family: ${L.body};
      color: ${p.textPrimary};
      user-select: none;
      z-index: ${V.panel};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      animation: ofPanelEnter ${x.slow} ease;
    }
    .of-panel input[type="checkbox"] { accent-color: ${p.accent}; }
    .of-panel.hidden { display: none; }
    .of-header {
      padding: ${f.md} ${f.lg};
      background: linear-gradient(90deg, rgba(20, 30, 46, 0.85), rgba(12, 18, 30, 0.6));
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      font-size: 0.85em;
      border-bottom: 1px solid ${p.border};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }
    .of-header-title {
      display: flex;
      align-items: center;
      gap: ${f.sm};
    }
    .of-player-list-title {
      font-size: 1em;
      color: ${p.textPrimary};
    }
    .of-player-list-header {
      position: relative;
    }
    .of-player-list-header::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46, 211, 241, 0.7), transparent);
      pointer-events: none;
    }
    .autojoin-header {
      cursor: pointer;
      gap: ${f.sm};
      padding: ${f.sm} ${f.md};
      font-size: 0.85em;
      position: relative;
    }
    .autojoin-header:hover {
      background: ${p.bgHover};
    }
    .autojoin-header::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46, 211, 241, 0.7), transparent);
      pointer-events: none;
    }
    .autojoin-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .autojoin-title-text {
      color: ${p.textPrimary};
      font-weight: 700;
    }
    .autojoin-title-sub {
      font-size: 0.72em;
      color: ${p.textMuted};
      letter-spacing: 0.2em;
    }
    .of-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(80,110,160,0.4) transparent; }
    .of-content::-webkit-scrollbar { width: 7px; }
    .of-content::-webkit-scrollbar-thumb { background: rgba(80,110,160,0.4); border-radius: 5px; }
    .of-footer {
      padding: ${f.sm} ${f.lg};
      display: flex;
      justify-content: space-between;
      background: ${p.bgSecondary};
      flex-shrink: 0;
      border-top: 1px solid ${p.border};
    }
    .of-button {
      background: ${p.bgHover};
      border: 1px solid ${p.border};
      color: ${p.textPrimary};
      padding: ${f.sm} ${f.md};
      border-radius: ${M.md};
      cursor: pointer;
      font-size: 0.95em;
      font-weight: 600;
      transition: background ${x.fast}, border-color ${x.fast}, color ${x.fast};
      outline: none;
    }
    .of-button:hover { background: rgba(80,110,160,0.5); border-color: ${p.borderAccent}; }
    .of-button.primary { background: ${p.accent}; color: #04131a; }
    .of-button.primary:hover { background: ${p.accentHover}; }
    .of-input {
      padding: ${f.sm};
      background: rgba(20, 30, 46, 0.7);
      border: 1px solid ${p.border};
      border-radius: ${M.md};
      color: ${p.textPrimary};
      font-size: 0.95em;
      outline: none;
      transition: border ${x.fast};
    }
    .of-input:focus { border-color: ${p.accent}; }
    .of-badge {
      background: ${p.accentMuted};
      border: 1px solid ${p.borderAccent};
      border-radius: ${M.xl};
      padding: 2px 10px;
      font-size: 0.75em;
      color: ${p.textPrimary};
    }
    .of-toggle {
      width: 34px;
      height: 18px;
      border-radius: 11px;
      background: rgba(35, 48, 70, 0.9);
      border: 1px solid ${p.border};
      position: relative;
      transition: background ${x.fast}, border-color ${x.fast};
      cursor: pointer;
    }
    .of-toggle.on { background: ${p.successSolid}; }
    .of-toggle-ball {
      position: absolute; left: 2px; top: 2px; width: 14px; height: 14px;
      border-radius: 50%; background: #fff; transition: left ${x.fast};
    }
    .of-toggle.on .of-toggle-ball { left: 18px; }

    .of-player-list-container {
      width: var(--player-list-width, 320px);
      min-width: 240px;
      max-width: 50vw;
      height: 100vh;
      flex-shrink: 0;
      position: relative;
      background: linear-gradient(180deg, rgba(12, 18, 30, 0.98), rgba(8, 12, 20, 0.95));
      border: 1px solid ${p.border};
      border-left: 1px solid ${p.borderAccent};
      border-radius: 0;
      box-shadow: ${W.lg};
      font-family: ${L.body};
      color: ${p.textPrimary};
      user-select: none;
      z-index: ${V.panel};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      resize: none;
    }
    .of-autojoin-slot {
      width: 100%;
      flex-shrink: 0;
    }
    .of-resize-handle {
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, ${p.accent}, rgba(46, 211, 241, 0.1));
      cursor: ew-resize;
      z-index: ${V.panel+1};
      opacity: 0.35;
      transition: opacity ${x.fast}, box-shadow ${x.fast};
    }
    .of-resize-handle:hover {
      opacity: 0.8;
      box-shadow: 0 0 12px rgba(46, 211, 241, 0.4);
    }
    .of-resize-handle.dragging {
      opacity: 1;
    }
    .of-player-list-count { font-size: 0.72em; letter-spacing: 0.12em; font-family: ${L.mono}; }
    .of-player-debug-info { font-size: 0.75em; color: rgba(148, 170, 210, 0.7); padding: 2px 6px; display: none; font-family: ${L.mono}; }

    .of-quick-tag-switch {
      padding: ${f.md} ${f.lg};
      background: rgba(14, 22, 34, 0.75);
      border-bottom: 1px solid ${p.border};
      display: flex;
      align-items: center;
      gap: ${f.sm};
      flex-shrink: 0;
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .of-quick-tag-switch::-webkit-scrollbar { height: 5px; }
    .of-quick-tag-switch::-webkit-scrollbar-thumb { background: rgba(80,110,160,0.45); border-radius: 4px; }
    .of-quick-tag-label {
      font-size: 0.75em;
      color: ${p.textMuted};
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    .of-quick-tag-item {
      display: flex;
      align-items: center;
      gap: ${f.xs};
    }
    .of-quick-tag-btn {
      padding: 4px 12px;
      font-size: 0.8em;
      background: rgba(22, 34, 52, 0.9);
      color: ${p.textPrimary};
      border: 1px solid ${p.border};
      border-radius: ${M.md};
      cursor: pointer;
      transition: all ${x.fast};
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }
    .of-quick-tag-btn:hover {
      background: ${p.accentMuted};
      border-color: ${p.accent};
    }
    .of-quick-tag-remove {
      width: 16px;
      height: 16px;
      padding: 0;
      font-size: 11px;
      line-height: 1;
      background: rgba(255, 125, 135, 0.15);
      color: ${p.error};
      border: 1px solid rgba(255, 125, 135, 0.6);
      border-radius: 50%;
      cursor: pointer;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background ${x.fast}, border-color ${x.fast}, transform ${x.fast};
    }
    .of-quick-tag-remove:hover {
      background: rgba(255, 117, 117, 0.25);
      border-color: ${p.error};
      transform: scale(1.05);
    }

    .of-clan-checkbox-filter {
      padding: ${f.md} ${f.lg};
      background: rgba(14, 22, 34, 0.75);
      border-bottom: 1px solid ${p.border};
      display: flex;
      align-items: center;
      gap: ${f.sm};
      flex-shrink: 0;
    }
    .of-clan-checkbox-filter input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }
    .of-clan-checkbox-filter label {
      cursor: pointer;
      color: ${p.textPrimary};
      font-size: 0.85em;
      user-select: none;
      flex: 1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }

    .of-team-group {
      position: relative;
      padding: 12px ${f.md} 6px ${f.md};
    }
    .of-team-group + .of-team-group {
      border-top: 1px dashed rgba(90, 110, 150, 0.35);
    }
    .of-team-group.current-player-team .of-team-band {
      border-left-width: 5px;
      box-shadow: 0 0 12px var(--team-color, ${p.accent});
    }
    .of-team-band {
      position: absolute;
      inset: 0;
      border-left: 3px solid var(--team-color, ${p.accent});
      background: transparent;
      pointer-events: none;
    }
    .of-team-header {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: ${f.xs};
      padding: 4px 10px;
      border-radius: ${M.xl};
      border: 1px solid var(--team-color, ${p.borderAccent});
      background: rgba(10, 16, 28, 0.7);
      font-size: 0.7em;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--team-color, ${p.textPrimary});
      font-family: ${L.display};
      margin-bottom: ${f.xs};
    }
    .of-team-group.current-player-team .of-team-header::before {
      content: "\u25C6";
      color: var(--team-color, ${p.accent});
      font-size: 0.85em;
      margin-right: 2px;
    }
    .of-team-label {
      font-weight: 700;
    }
    .of-team-count {
      color: ${p.textSecondary};
      font-size: 0.85em;
      letter-spacing: 0.1em;
      font-family: ${L.mono};
      margin-left: ${f.xs};
    }

    .of-clan-group {
      margin: 8px ${f.md};
      border: 1px solid rgba(90, 110, 150, 0.35);
      border-radius: ${M.md};
      background: rgba(14, 20, 32, 0.78);
      overflow: hidden;
      box-shadow: 0 10px 18px rgba(2, 6, 16, 0.35);
      --clan-color: ${p.accent};
      --clan-color-soft: rgba(46, 211, 241, 0.14);
      --clan-color-strong: rgba(46, 211, 241, 0.28);
      --clan-color-border: rgba(46, 211, 241, 0.6);
    }
    .of-clan-group.of-clan-group-neutral {
      --clan-color: rgba(150, 165, 190, 0.5);
      --clan-color-soft: rgba(90, 105, 130, 0.2);
      --clan-color-strong: rgba(120, 135, 170, 0.35);
      --clan-color-border: rgba(120, 135, 170, 0.6);
    }
    .of-clan-group-enter {
      animation: clanGroupEnter ${x.slow} cubic-bezier(.27,.82,.48,1.06) forwards;
    }
    @keyframes clanGroupEnter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .of-clan-group-exit {
      animation: clanGroupExit 0.25s cubic-bezier(.51,.01,1,1.01) forwards;
    }
    @keyframes clanGroupExit {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-8px); }
    }
    .of-clan-group-header {
      padding: calc(${f.sm} - 2px) ${f.md};
      background: linear-gradient(90deg, var(--clan-color-soft), rgba(22, 32, 48, 0.9) 65%);
      border-left: 3px solid var(--clan-color-border);
      cursor: default;
      display: flex;
      align-items: center;
      gap: ${f.sm};
      transition: background ${x.fast}, border-color ${x.fast};
      flex-wrap: wrap;
      font-family: ${L.display};
    }
    .of-clan-group-header:hover {
      background: linear-gradient(90deg, var(--clan-color-strong), rgba(28, 40, 60, 0.95) 65%);
    }
    .of-clan-arrow {
      font-size: 0.8em;
      color: ${p.textSecondary};
      transition: transform ${x.fast};
      width: 16px;
      display: inline-block;
    }
    .of-clan-group.collapsed .of-clan-arrow {
      transform: rotate(-90deg);
    }
    .of-clan-tag {
      font-weight: 700;
      color: ${p.textPrimary};
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-family: ${L.display};
    }
    .of-clan-you-badge {
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      padding: 2px 6px;
      border-radius: ${M.xl};
      border: 1px solid var(--clan-color-border);
      background: var(--clan-color-soft);
      color: ${p.textPrimary};
      font-family: ${L.mono};
    }
    .of-clan-count {
      font-size: 0.75em;
      color: ${p.textPrimary};
      background: var(--clan-color-soft);
      padding: 2px 7px;
      border-radius: ${M.xl};
      border: 1px solid var(--clan-color-border);
      letter-spacing: 0.1em;
      font-family: ${L.mono};
    }
    .of-clan-actions {
      display: flex;
      gap: ${f.xs};
      flex-wrap: wrap;
      align-items: center;
      margin-left: auto;
    }
    .of-clan-stats {
      display: flex;
      gap: ${f.xs};
      font-size: 0.66em;
      color: ${p.textSecondary};
      flex-wrap: wrap;
      font-family: ${L.mono};
      line-height: 1.2;
    }
    .of-clan-stats span {
      white-space: nowrap;
    }
    .of-clan-use-btn {
      padding: 4px 10px;
      font-size: 0.75em;
      background: rgba(46, 211, 241, 0.15);
      color: ${p.textPrimary};
      border: 1px solid ${p.borderAccent};
      border-radius: ${M.sm};
      cursor: pointer;
      transition: all ${x.fast};
      font-weight: 700;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }
    .of-clan-use-btn:hover {
      background: ${p.accent};
      border-color: ${p.accent};
      color: #04131a;
    }
    .of-clan-group-players {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 10px 10px 12px 10px;
      overflow: visible;
      transition: max-height ${x.normal} ease-in-out, opacity ${x.normal} ease-in-out;
      border-top: 1px solid rgba(60, 80, 120, 0.35);
    }
    .of-clan-group.collapsed .of-clan-group-players {
      max-height: 0;
      padding: 0;
      opacity: 0;
      overflow: hidden;
    }
    .of-clan-group-players .of-player-item {
      display: inline-flex;
      padding: 4px 10px;
      border: 1px solid var(--clan-color-border);
      border-radius: ${M.sm};
      background: var(--clan-color-soft);
      cursor: default;
      transition: background ${x.fast}, border-color ${x.fast}, transform ${x.fast};
      font-size: 0.85em;
    }
    .of-clan-group-players .of-player-item:hover {
      background: var(--clan-color-strong);
      border-color: var(--clan-color);
      transform: translateY(-1px);
    }
    .of-solo-players {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 10px 12px 10px;
      border-top: 1px dashed rgba(70, 90, 120, 0.35);
    }
    .of-solo-players .of-player-item {
      display: inline-flex;
      padding: 4px 10px;
      border: 1px solid var(--player-accent-border, rgba(120, 135, 170, 0.5));
      border-radius: ${M.sm};
      background: var(--player-accent-soft, rgba(90, 105, 130, 0.18));
      cursor: default;
      transition: background ${x.fast}, border-color ${x.fast}, transform ${x.fast};
      font-size: 0.85em;
    }
    .of-solo-players .of-player-item:hover {
      background: var(--player-accent-strong, rgba(120, 135, 170, 0.28));
      border-color: var(--player-accent, rgba(150, 165, 190, 0.6));
      transform: translateY(-1px);
    }
    .of-player-list-content { flex: 1; padding: ${f.xs} 0; }
    /* Base player item styles (for untagged players) */
    .of-player-list-content > .of-player-item {
      padding: 6px ${f.md};
      border-bottom: 1px solid rgba(60, 80, 120, 0.35);
      font-size: 0.85em;
      line-height: 1.4;
      position: relative;
      transition: background-color ${x.slow}, border-color ${x.slow};
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .of-player-list-content > .of-player-item:hover {
      background: rgba(24, 34, 52, 0.7);
      border-bottom-color: rgba(80, 110, 160, 0.5);
    }
    .of-player-item.of-player-item-accent {
      border-left: 3px solid var(--player-accent-border, rgba(120, 135, 170, 0.6));
      background: var(--player-accent-soft, rgba(120, 135, 170, 0.18));
    }
    .of-clan-group-players .of-player-item.of-player-item-clanmate {
      border-left: 4px solid var(--clan-color, ${p.accent});
      background: var(--clan-color);
      box-shadow: 0 0 0 1px var(--clan-color-border) inset, 0 0 12px rgba(46, 211, 241, 0.3);
      color: #fff;
      text-shadow: 0 1px 2px rgba(6, 10, 18, 0.8);
    }
    .of-player-name { color: ${p.textPrimary}; white-space: nowrap; overflow: visible; font-weight: 400; flex: 1; }
    .of-player-highlighted { background: linear-gradient(90deg, ${p.highlight} 40%, rgba(46, 211, 241, 0.05)); border-left: 3px solid ${p.accent}; }
    .of-player-enter { animation: playerEnter ${x.slow} cubic-bezier(.27,.82,.48,1.06) forwards; }
    .of-player-enter-stagger-1 { animation-delay: 30ms; }
    .of-player-enter-stagger-2 { animation-delay: 60ms; }
    .of-player-enter-stagger-3 { animation-delay: 90ms; }
    .of-player-enter-stagger-4 { animation-delay: 120ms; }
    .of-player-enter-highlight { background-color: rgba(110,160,255,0.14) !important; }
    .of-player-exit-highlight { background-color: rgba(220, 70, 90, 0.18); }
    .of-player-exit { animation: playerExit 0.25s cubic-bezier(.51,.01,1,1.01) forwards; }
    @keyframes playerEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes playerExit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
    .of-player-list-footer { padding: ${f.sm} ${f.lg}; display: flex; justify-content: space-between; background: ${p.bgSecondary}; font-size: 0.95em; flex-shrink: 0; border-top: 1px solid ${p.border}; }
    .of-player-list-button { background: ${p.bgHover}; border: 1px solid ${p.border}; color: ${p.textPrimary}; padding: 6px 13px; border-radius: ${M.md}; cursor: pointer; font-size: 0.9em; font-weight: 600; transition: background ${x.fast}, border-color ${x.fast}; outline: none; }
    .of-player-list-button:hover { background: rgba(80,110,160,0.5); border-color: ${p.borderAccent}; }

    .autojoin-panel {
      position: relative;
      width: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
      border: none;
      border-bottom: 1px solid ${p.border};
      border-radius: 0;
      box-shadow: none;
      transition: opacity ${x.slow}, transform ${x.slow};
      cursor: default;
    }
    .autojoin-panel::after { display: none; }
    .autojoin-panel.hidden { display: none; }
    .autojoin-body { display: flex; flex-direction: column; }
    .autojoin-content { display: flex; flex-direction: column; gap: ${f.sm}; padding: ${f.sm} ${f.md} ${f.md}; }
    .autojoin-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${f.sm};
      flex-wrap: wrap;
      padding: ${f.sm} ${f.md};
      background: rgba(18, 26, 40, 0.75);
      border: 1px solid ${p.border};
      border-radius: ${M.md};
    }
    .autojoin-action-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${f.sm};
    }
    .autojoin-modes {
      display: flex;
      flex-direction: column;
      gap: ${f.xs};
    }
    .autojoin-modes-rail {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px ${f.sm};
      border-radius: ${M.md};
      border: 1px solid ${p.border};
      background: rgba(14, 22, 34, 0.55);
      cursor: pointer;
      transition: background ${x.fast}, border-color ${x.fast};
    }
    .autojoin-modes-rail:hover {
      border-color: ${p.borderAccent};
      background: rgba(20, 30, 46, 0.75);
    }
    .autojoin-modes-caret {
      color: ${p.textMuted};
      font-size: 0.9em;
      transition: transform ${x.fast}, color ${x.fast};
    }
    .autojoin-modes-label {
      font-size: 0.7em;
      color: ${p.textMuted};
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-family: ${L.display};
      margin-right: 2px;
    }
    .autojoin-modes-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: ${p.textMuted};
      opacity: 0.7;
    }
    .autojoin-modes-body {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      margin-top: 0;
      transition: max-height ${x.slow}, opacity ${x.fast}, margin-top ${x.fast};
    }
    .autojoin-modes.is-expanded .autojoin-modes-body {
      max-height: 2000px;
      opacity: 1;
      margin-top: ${f.xs};
    }
    .autojoin-modes.is-expanded .autojoin-modes-caret {
      transform: rotate(90deg);
      color: ${p.textPrimary};
    }
    .autojoin-clanmate-button {
      width: 100%;
      background: rgba(22, 34, 52, 0.9);
      border: 1px solid ${p.border};
      color: ${p.textPrimary};
      padding: ${f.sm} ${f.md};
      border-radius: ${M.md};
      font-size: 0.8em;
      font-weight: 700;
      cursor: pointer;
      transition: background ${x.fast}, border-color ${x.fast};
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }
    .autojoin-clanmate-button:hover { background: rgba(30, 44, 66, 0.95); border-color: ${p.borderAccent}; }
    .autojoin-clanmate-button.armed { background: ${p.accent}; border-color: ${p.accentHover}; color: #04131a; box-shadow: 0 0 12px rgba(46, 211, 241, 0.35); }
    .autojoin-clanmate-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .autojoin-config-grid { display: flex; flex-direction: column; gap: ${f.sm}; }
    .autojoin-config-card { flex: 1 1 auto; min-width: 0; width: 100%; background: rgba(14, 22, 34, 0.7); border: 1px solid ${p.border}; border-radius: ${M.md}; }
    .autojoin-mode-inner {
      display: flex;
      flex-direction: column;
      gap: ${f.xs};
      margin-top: ${f.xs};
    }
    .autojoin-section {
      display: flex;
      flex-direction: column;
      gap: ${f.xs};
    }
    .autojoin-section-title {
      font-size: 0.72em;
      color: ${p.textMuted};
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-family: ${L.display};
      margin-top: ${f.xs};
    }
    .autojoin-footer { align-items: center; justify-content: flex-start; gap: ${f.sm}; flex-wrap: wrap; padding: ${f.sm} ${f.md}; background: rgba(14, 22, 34, 0.75); border-top: 1px solid ${p.border}; }
    .autojoin-main-button {
      width: auto;
      flex: 1 1 160px;
      padding: ${f.sm} ${f.md};
      border: 1px solid ${p.border};
      border-radius: ${M.md};
      font-size: 0.8em;
      font-weight: 700;
      cursor: pointer;
      transition: all ${x.slow};
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${L.display};
    }
    .autojoin-main-button.active { background: ${p.accent}; color: #04131a; border-color: ${p.accentHover}; box-shadow: 0 0 14px rgba(46, 211, 241, 0.35); }
    .autojoin-main-button.inactive { background: rgba(28, 38, 58, 0.9); color: ${p.textSecondary}; }
    .autojoin-mode-config { margin-bottom: ${f.xs}; padding: ${f.sm}; background: rgba(18, 26, 40, 0.8); border-radius: ${M.md}; border: 1px solid rgba(90, 110, 150, 0.35); }
    .mode-checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 6px;
      font-size: 0.8em;
      color: ${p.textPrimary};
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-family: ${L.display};
    }
    .mode-checkbox-label input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    .player-filter-info { margin-bottom: 4px; padding: 2px 0; }
    .player-filter-info small { color: ${p.textSecondary}; font-size: 0.8em; }
    .capacity-range-wrapper { margin-top: 4px; }
    .capacity-range-visual { position: relative; padding: 8px 0 4px 0; }
    .capacity-track { position: relative; height: 6px; background: rgba(46, 211, 241, 0.2); border-radius: 3px; margin-bottom: ${f.sm}; }
    .team-count-options-centered { display: flex; justify-content: space-between; gap: 10px; margin: ${f.xs} 0; }
    .team-count-column { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; background: rgba(12, 18, 30, 0.6); padding: 5px; border-radius: ${M.sm}; border: 1px solid rgba(90, 110, 150, 0.25); }
    .team-count-column label { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 0.78em; color: ${p.textPrimary}; white-space: nowrap; user-select: none; }
    .team-count-column input[type="checkbox"] { width: 16px; height: 16px; margin: 0; }
    .select-all-btn { background: rgba(46, 211, 241, 0.15); color: ${p.textPrimary}; border: 1px solid ${p.borderAccent}; border-radius: ${M.sm}; padding: ${f.xs} ${f.sm}; font-size: 0.75em; cursor: pointer; flex: 1; text-align: center; margin: 0 2px; text-transform: uppercase; letter-spacing: 0.1em; font-family: ${L.display}; }
    .select-all-btn:hover { background: rgba(46, 211, 241, 0.25); }
    .team-count-section > div:first-of-type { display: flex; gap: 5px; margin-bottom: ${f.xs}; }
    .team-count-section > label { font-size: 0.8em; color: ${p.textPrimary}; font-weight: 600; margin-bottom: 4px; display: block; text-transform: uppercase; letter-spacing: 0.08em; font-family: ${L.display}; }
    .capacity-labels { display: flex; justify-content: space-between; align-items: center; margin-top: ${f.sm}; }
    .three-times-checkbox { display: flex; align-items: center; gap: ${f.xs}; font-size: 0.78em; color: ${p.textPrimary}; margin: 0 5px; }
    .three-times-checkbox input[type="checkbox"] { width: 15px; height: 15px; }
    .capacity-range-fill { position: absolute; height: 100%; background: rgba(46, 211, 241, 0.5); border-radius: 3px; pointer-events: none; opacity: 0.7; transition: left 0.1s ease, width 0.1s ease; }
    .capacity-slider { position: absolute; width: 100%; height: 6px; top: 0; left: 0; background: transparent; outline: none; -webkit-appearance: none; pointer-events: none; margin: 0; }
    .capacity-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${p.accent}; cursor: pointer; pointer-events: all; border: 2px solid rgba(5, 20, 26, 0.9); box-shadow: ${W.sm}; }
    .capacity-slider-min { z-index: 2; }
    .capacity-slider-max { z-index: 1; }
    .capacity-label-group { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .capacity-label-group label { font-size: 0.8em; color: ${p.textSecondary}; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-family: ${L.display}; }
    .capacity-value { font-size: 0.85em; color: #FFFFFF; font-weight: 600; min-width: 40px; text-align: center; }
    .capacity-inputs-hidden { display: none; }
    .autojoin-status { display: flex; align-items: center; gap: 8px; cursor: pointer; white-space: nowrap; flex-wrap: wrap; }
    @keyframes statusPulse {
      0% { box-shadow: 0 0 0 0 rgba(20, 220, 170, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(20, 220, 170, 0); }
      100% { box-shadow: 0 0 0 0 rgba(20, 220, 170, 0); }
    }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: ${p.success}; box-shadow: 0 0 10px rgba(20, 220, 170, 0.4); }
    .status-indicator.active { animation: statusPulse 2s infinite; }
    .status-indicator.inactive { animation: none; box-shadow: none; }
    .status-text { font-size: 0.8em; color: ${p.textPrimary}; text-transform: uppercase; letter-spacing: 0.12em; font-family: ${L.display}; }
    .search-timer { font-size: 0.8em; color: rgba(147, 197, 253, 0.9); font-weight: 500; font-family: ${L.mono}; }
    .autojoin-settings { display: flex; align-items: center; gap: ${f.sm}; flex-wrap: wrap; }
    .autojoin-toggle-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.8em; color: ${p.textPrimary}; font-family: ${L.display}; text-transform: uppercase; letter-spacing: 0.08em; }
    .autojoin-toggle-label input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
    .current-game-info { margin: 6px 0; padding: 6px ${f.sm}; background: rgba(46, 211, 241, 0.1); border-radius: ${M.sm}; font-size: 0.8em; color: rgba(147, 197, 253, 0.9); text-align: center; border: 1px solid rgba(46, 211, 241, 0.25); }
    .current-game-info.not-applicable { background: rgba(100, 100, 100, 0.1); color: ${p.textMuted}; border-color: rgba(100, 100, 100, 0.2); font-style: italic; }
    .game-found-notification {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: linear-gradient(135deg, rgba(12, 20, 32, 0.95) 0%, rgba(10, 16, 28, 0.9) 100%);
      border: 1px solid ${p.borderAccent};
      border-radius: ${M.lg};
      padding: ${f.xl} 30px;
      z-index: ${V.notification};
      color: ${p.textPrimary};
      font-family: ${L.display};
      font-size: 0.9em;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
      box-shadow: ${W.md};
      transition: transform ${x.slow}, opacity ${x.slow};
      opacity: 0;
      min-width: 300px;
      max-width: 520px;
    }
    .game-found-notification .notification-title {
      font-size: 1.1em;
    }
    .game-found-notification .notification-detail {
      font-size: 0.85em;
      margin-top: ${f.sm};
      text-transform: none;
      letter-spacing: 0.06em;
      color: ${p.textSecondary};
      font-family: ${L.mono};
    }
    .game-found-notification .notification-hint {
      font-size: 0.7em;
      margin-top: 6px;
      text-transform: none;
      letter-spacing: 0.08em;
      color: ${p.textMuted};
    }
    .game-found-notification.notification-visible { transform: translateX(-50%) translateY(0); opacity: 1; }
    .game-found-notification.notification-dismissing { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    .game-found-notification:hover { background: rgba(16, 26, 40, 0.96); border-color: ${p.accentHover}; box-shadow: 0 0 18px rgba(46, 211, 241, 0.2); }
  `}var K={gameFoundAudio:null,gameStartAudio:null,audioUnlocked:!1,preloadSounds(){try{this.gameFoundAudio=new Audio("https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/new-notification-014-363678.mp3"),this.gameFoundAudio.volume=.5,this.gameFoundAudio.preload="auto",this.gameStartAudio=new Audio("https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/opening-bell-421471.mp3"),this.gameStartAudio.volume=.5,this.gameStartAudio.preload="auto",this.setupAudioUnlock()}catch(i){console.warn("[SoundUtils] Could not preload audio:",i)}},setupAudioUnlock(){let i=()=>{if(this.audioUnlocked)return;let e=[];this.gameFoundAudio&&(this.gameFoundAudio.volume=.01,e.push(this.gameFoundAudio.play().then(()=>{this.gameFoundAudio&&(this.gameFoundAudio.pause(),this.gameFoundAudio.currentTime=0,this.gameFoundAudio.volume=.5)}).catch(()=>{}))),this.gameStartAudio&&(this.gameStartAudio.volume=.01,e.push(this.gameStartAudio.play().then(()=>{this.gameStartAudio&&(this.gameStartAudio.pause(),this.gameStartAudio.currentTime=0,this.gameStartAudio.volume=.5)}).catch(()=>{}))),Promise.all(e).then(()=>{this.audioUnlocked=!0,console.log("[SoundUtils] Audio unlocked successfully"),document.removeEventListener("click",i),document.removeEventListener("keydown",i),document.removeEventListener("touchstart",i)})};document.addEventListener("click",i,{once:!0}),document.addEventListener("keydown",i,{once:!0}),document.addEventListener("touchstart",i,{once:!0})},playGameFoundSound(){this.gameFoundAudio?(console.log("[SoundUtils] Attempting to play game found sound"),this.gameFoundAudio.currentTime=0,this.gameFoundAudio.play().catch(i=>{console.warn("[SoundUtils] Failed to play game found sound:",i)})):console.warn("[SoundUtils] Game found audio not initialized")},playGameStartSound(){this.gameStartAudio?(console.log("[SoundUtils] Attempting to play game start sound"),this.gameStartAudio.currentTime=0,this.gameStartAudio.play().catch(i=>{console.warn("[SoundUtils] Failed to play game start sound:",i)})):console.warn("[SoundUtils] Game start audio not initialized")}};var _={callbacks:[],lastUrl:location.href,initialized:!1,init(){if(this.initialized)return;this.initialized=!0;let i=()=>{location.href!==this.lastUrl&&(this.lastUrl=location.href,this.notify())};window.addEventListener("popstate",i),window.addEventListener("hashchange",i);let e=history.pushState,t=history.replaceState;history.pushState=function(...a){e.apply(history,a),setTimeout(i,0)},history.replaceState=function(...a){t.apply(history,a),setTimeout(i,0)},setInterval(i,200)},subscribe(i){this.callbacks.push(i),this.init()},notify(){this.callbacks.forEach(i=>i(location.href))}};var le={subscribers:[],ws:null,fallbackInterval:null,lastLobbies:[],pollingRate:Q.lobbyPollingRate,wsConnectionAttempts:0,maxWsAttempts:3,reconnectTimeout:null,start(){this.ws||this.fallbackInterval||(console.log("[Bundle] Starting LobbyDataManager with WebSocket"),this.wsConnectionAttempts=0,this.connectWebSocket())},stop(){this.ws&&(this.ws.close(),this.ws=null),this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.stopFallbackPolling()},subscribe(i){this.subscribers.push(i)},connectWebSocket(){try{let e=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/lobbies`;this.ws=new WebSocket(e),this.ws.addEventListener("open",()=>{console.log("[Bundle] WebSocket connected"),this.wsConnectionAttempts=0,this.stopFallbackPolling(),this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null)}),this.ws.addEventListener("message",t=>{try{let a=JSON.parse(t.data);a.type==="lobbies_update"&&(this.lastLobbies=a.data?.lobbies??[],this.notifySubscribers())}catch(a){console.error("[Bundle] WebSocket parse error:",a)}}),this.ws.addEventListener("close",()=>{console.log("[Bundle] WebSocket disconnected"),this.ws=null,this.wsConnectionAttempts++,this.wsConnectionAttempts>=this.maxWsAttempts?(console.log("[Bundle] Max WebSocket attempts reached, falling back to HTTP"),this.startFallbackPolling()):this.reconnectTimeout=setTimeout(()=>this.connectWebSocket(),3e3)}),this.ws.addEventListener("error",t=>{console.error("[Bundle] WebSocket error:",t)})}catch(i){console.error("[Bundle] WebSocket connection error:",i),this.wsConnectionAttempts++,this.wsConnectionAttempts>=this.maxWsAttempts&&this.startFallbackPolling()}},startFallbackPolling(){this.fallbackInterval||(console.log("[Bundle] Starting HTTP fallback polling"),this.fetchData(),this.fallbackInterval=setInterval(()=>this.fetchData(),this.pollingRate))},stopFallbackPolling(){this.fallbackInterval&&(clearInterval(this.fallbackInterval),this.fallbackInterval=null)},async fetchData(){if(!(location.pathname!=="/"&&!location.pathname.startsWith("/public-lobby")))try{let i=await fetch("/api/public_lobbies");if(i.status===429){console.warn("[Bundle] Rate limited.");return}let e=await i.json();this.lastLobbies=e.lobbies||[],this.notifySubscribers()}catch(i){console.error("[Bundle] API Error:",i),this.lastLobbies=[],this.notifySubscribers()}},notifySubscribers(){this.subscribers.forEach(i=>i(this.lastLobbies))}};var Y={data:null,dataByTag:null,fetching:!1,fetched:!1,async fetch(){if(this.fetched||this.fetching)return this.data||[];this.fetching=!0;let i=async()=>{let e=await fetch("https://api.openfront.io/public/clans/leaderboard");if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()};try{let e=await i();this.data=e.clans||[],this.dataByTag=new Map;for(let t of this.data)this.dataByTag.set(t.clanTag.toLowerCase(),t);this.fetched=!0,console.log("[Bundle] Clan leaderboard cached:",this.data.length,"clans")}catch(e){console.warn("[Bundle] Clan fetch failed, retrying...",e instanceof Error?e.message:String(e)),await new Promise(t=>setTimeout(t,5e3));try{let t=await i();this.data=t.clans||[],this.dataByTag=new Map;for(let a of this.data)this.dataByTag.set(a.clanTag.toLowerCase(),a);this.fetched=!0,console.log("[Bundle] Clan leaderboard cached (retry):",this.data.length,"clans")}catch(t){console.error("[Bundle] Clan leaderboard unavailable:",t instanceof Error?t.message:String(t)),this.data=[],this.dataByTag=new Map,this.fetched=!0}}return this.fetching=!1,this.data||[]},getStats(i){return!this.dataByTag||!i?null:this.dataByTag.get(i.toLowerCase())||null}};var $e={Red:{r:235,g:51,b:51},Blue:{r:41,g:98,b:255},Teal:{r:43,g:212,b:189},Purple:{r:146,g:52,b:234},Yellow:{r:231,g:176,b:8},Orange:{r:249,g:116,b:21},Green:{r:65,g:190,b:82},Bot:{r:209,g:205,b:199},Humans:{r:41,g:98,b:255},Nations:{r:235,g:51,b:51}},ke=["Red","Blue","Yellow","Green","Purple","Orange","Teal"],q=[{r:163,g:230,b:53},{r:132,g:204,b:22},{r:16,g:185,b:129},{r:52,g:211,b:153},{r:45,g:212,b:191},{r:74,g:222,b:128},{r:110,g:231,b:183},{r:134,g:239,b:172},{r:151,g:255,b:187},{r:186,g:255,b:201},{r:230,g:250,b:210},{r:34,g:197,b:94},{r:67,g:190,b:84},{r:82,g:183,b:136},{r:48,g:178,b:180},{r:230,g:255,b:250},{r:220,g:240,b:250},{r:233,g:213,b:255},{r:204,g:204,b:255},{r:220,g:220,b:255},{r:202,g:225,b:255},{r:147,g:197,b:253},{r:125,g:211,b:252},{r:99,g:202,b:253},{r:56,g:189,b:248},{r:96,g:165,b:250},{r:59,g:130,b:246},{r:79,g:70,b:229},{r:124,g:58,b:237},{r:147,g:51,b:234},{r:179,g:136,b:255},{r:167,g:139,b:250},{r:217,g:70,b:239},{r:168,g:85,b:247},{r:190,g:92,b:251},{r:192,g:132,b:252},{r:240,g:171,b:252},{r:244,g:114,b:182},{r:236,g:72,b:153},{r:220,g:38,b:38},{r:239,g:68,b:68},{r:235,g:75,b:75},{r:245,g:101,b:101},{r:248,g:113,b:113},{r:251,g:113,b:133},{r:253,g:164,b:175},{r:252,g:165,b:165},{r:255,g:204,b:229},{r:250,g:215,b:225},{r:251,g:235,b:245},{r:240,g:240,b:200},{r:250,g:250,b:210},{r:255,g:240,b:200},{r:255,g:223,b:186},{r:252,g:211,b:77},{r:251,g:191,b:36},{r:234,g:179,b:8},{r:202,g:138,b:4},{r:245,g:158,b:11},{r:251,g:146,b:60},{r:249,g:115,b:22},{r:234,g:88,b:12},{r:133,g:77,b:14}],J=[{r:35,g:0,b:0},{r:45,g:0,b:0},{r:55,g:0,b:0},{r:65,g:0,b:0},{r:75,g:0,b:0},{r:85,g:0,b:0},{r:95,g:0,b:0},{r:105,g:0,b:0},{r:115,g:0,b:0},{r:125,g:0,b:0},{r:135,g:0,b:0},{r:145,g:0,b:0},{r:155,g:0,b:0},{r:165,g:0,b:0},{r:175,g:0,b:0},{r:185,g:0,b:0},{r:195,g:0,b:5},{r:205,g:0,b:10},{r:215,g:0,b:15},{r:225,g:0,b:20},{r:235,g:0,b:25},{r:245,g:0,b:30},{r:255,g:0,b:35},{r:255,g:10,b:45},{r:255,g:20,b:55},{r:255,g:30,b:65},{r:255,g:40,b:75},{r:255,g:50,b:85},{r:255,g:60,b:95},{r:255,g:70,b:105},{r:255,g:80,b:115},{r:255,g:90,b:125},{r:255,g:100,b:135},{r:255,g:110,b:145},{r:255,g:120,b:155},{r:255,g:130,b:165},{r:255,g:140,b:175},{r:255,g:150,b:185},{r:255,g:160,b:195},{r:255,g:170,b:205},{r:255,g:180,b:215},{r:255,g:190,b:225},{r:255,g:200,b:235},{r:0,g:45,b:0},{r:0,g:55,b:0},{r:0,g:65,b:0},{r:0,g:75,b:0},{r:0,g:85,b:0},{r:0,g:95,b:0},{r:0,g:105,b:0},{r:0,g:115,b:0},{r:0,g:125,b:0},{r:0,g:135,b:0},{r:0,g:145,b:0},{r:0,g:155,b:0},{r:0,g:165,b:0},{r:0,g:175,b:0},{r:0,g:185,b:0},{r:0,g:195,b:5},{r:0,g:205,b:10},{r:0,g:215,b:15},{r:0,g:225,b:20},{r:0,g:235,b:25},{r:0,g:245,b:30},{r:0,g:255,b:35},{r:10,g:255,b:45},{r:20,g:255,b:55},{r:30,g:255,b:65},{r:40,g:255,b:75},{r:50,g:255,b:85},{r:60,g:255,b:95},{r:70,g:255,b:105},{r:80,g:255,b:115},{r:90,g:255,b:125},{r:100,g:255,b:135},{r:110,g:255,b:145},{r:120,g:255,b:155},{r:130,g:255,b:165},{r:140,g:255,b:175},{r:150,g:255,b:185},{r:160,g:255,b:195},{r:170,g:255,b:205},{r:180,g:255,b:215},{r:190,g:255,b:225},{r:200,g:255,b:235},{r:0,g:0,b:35},{r:0,g:0,b:45},{r:0,g:0,b:55},{r:0,g:0,b:65},{r:0,g:0,b:75},{r:0,g:0,b:85},{r:0,g:0,b:95},{r:0,g:0,b:105},{r:0,g:0,b:115},{r:0,g:0,b:125},{r:0,g:0,b:135},{r:0,g:0,b:145},{r:0,g:0,b:155},{r:0,g:0,b:165},{r:0,g:0,b:175},{r:0,g:0,b:185},{r:5,g:0,b:195},{r:10,g:0,b:205},{r:15,g:0,b:215},{r:20,g:0,b:225},{r:25,g:0,b:235},{r:30,g:0,b:245},{r:35,g:0,b:255},{r:45,g:10,b:255},{r:55,g:20,b:255},{r:65,g:30,b:255},{r:75,g:40,b:255},{r:85,g:50,b:255},{r:95,g:60,b:255},{r:105,g:70,b:255},{r:115,g:80,b:255},{r:125,g:90,b:255},{r:135,g:100,b:255},{r:145,g:110,b:255},{r:155,g:120,b:255},{r:165,g:130,b:255},{r:175,g:140,b:255},{r:185,g:150,b:255},{r:195,g:160,b:255},{r:205,g:170,b:255},{r:215,g:180,b:255},{r:225,g:190,b:255},{r:235,g:200,b:255},{r:35,g:0,b:35},{r:45,g:0,b:45},{r:55,g:0,b:55},{r:65,g:0,b:65},{r:75,g:0,b:75},{r:85,g:0,b:85},{r:95,g:0,b:95},{r:105,g:0,b:105},{r:115,g:0,b:115},{r:125,g:0,b:125},{r:135,g:0,b:135},{r:145,g:0,b:145},{r:155,g:0,b:155},{r:165,g:0,b:165},{r:175,g:0,b:175},{r:185,g:0,b:185},{r:195,g:5,b:195},{r:205,g:10,b:205},{r:215,g:15,b:215},{r:225,g:20,b:225},{r:235,g:25,b:235},{r:245,g:30,b:245},{r:255,g:35,b:255},{r:255,g:45,b:255},{r:255,g:55,b:255},{r:255,g:65,b:255},{r:255,g:75,b:255},{r:255,g:85,b:255},{r:255,g:95,b:255},{r:255,g:105,b:255},{r:255,g:115,b:255},{r:255,g:125,b:255},{r:255,g:135,b:255},{r:255,g:145,b:255},{r:255,g:155,b:255},{r:255,g:165,b:255},{r:255,g:175,b:255},{r:255,g:185,b:255},{r:255,g:195,b:255},{r:255,g:205,b:255},{r:255,g:215,b:255},{r:0,g:35,b:35},{r:0,g:45,b:45},{r:0,g:55,b:55},{r:0,g:65,b:65},{r:0,g:75,b:75},{r:0,g:85,b:85},{r:0,g:95,b:95},{r:0,g:105,b:105},{r:0,g:115,b:115},{r:0,g:125,b:125},{r:0,g:135,b:135},{r:0,g:145,b:145},{r:0,g:155,b:155},{r:0,g:165,b:165},{r:0,g:175,b:175},{r:0,g:185,b:185},{r:5,g:195,b:195},{r:10,g:205,b:205},{r:15,g:215,b:215},{r:20,g:225,b:225},{r:25,g:235,b:235},{r:30,g:245,b:245},{r:35,g:255,b:255},{r:45,g:255,b:255},{r:55,g:255,b:255},{r:65,g:255,b:255},{r:75,g:255,b:255},{r:85,g:255,b:255},{r:95,g:255,b:255},{r:105,g:255,b:255},{r:115,g:255,b:255},{r:125,g:255,b:255},{r:135,g:255,b:255},{r:145,g:255,b:255},{r:155,g:255,b:255},{r:165,g:255,b:255},{r:175,g:255,b:255},{r:185,g:255,b:255},{r:195,g:255,b:255},{r:205,g:255,b:255},{r:215,g:255,b:255},{r:35,g:35,b:0},{r:45,g:45,b:0},{r:55,g:55,b:0},{r:65,g:65,b:0},{r:75,g:75,b:0},{r:85,g:85,b:0},{r:95,g:95,b:0},{r:105,g:105,b:0},{r:115,g:115,b:0},{r:125,g:125,b:0},{r:135,g:135,b:0},{r:145,g:145,b:0},{r:155,g:155,b:0},{r:165,g:165,b:0},{r:175,g:175,b:0},{r:185,g:185,b:0},{r:195,g:195,b:5},{r:205,g:205,b:10},{r:215,g:215,b:15},{r:225,g:225,b:20},{r:235,g:235,b:25},{r:245,g:245,b:30},{r:255,g:255,b:35},{r:255,g:255,b:45},{r:255,g:255,b:55},{r:255,g:255,b:65},{r:255,g:255,b:75},{r:255,g:255,b:85},{r:255,g:255,b:95},{r:255,g:255,b:105},{r:255,g:255,b:115},{r:255,g:255,b:125},{r:255,g:255,b:135},{r:255,g:255,b:145},{r:255,g:255,b:155},{r:255,g:255,b:165},{r:255,g:255,b:175},{r:255,g:255,b:185},{r:255,g:255,b:195},{r:255,g:255,b:205},{r:255,g:255,b:215},{r:215,g:255,b:200},{r:225,g:255,b:175},{r:240,g:250,b:160},{r:245,g:245,b:175},{r:150,g:200,b:255},{r:160,g:215,b:255},{r:170,g:225,b:255},{r:180,g:235,b:250},{r:190,g:245,b:240},{r:210,g:255,b:245},{r:220,g:255,b:255},{r:230,g:250,b:255},{r:240,g:240,b:255},{r:250,g:230,b:255},{r:170,g:190,b:255},{r:180,g:180,b:255},{r:200,g:170,b:255},{r:190,g:140,b:195},{r:195,g:145,b:200},{r:200,g:150,b:205},{r:205,g:155,b:210},{r:210,g:160,b:215},{r:215,g:165,b:220},{r:220,g:170,b:225},{r:225,g:175,b:230},{r:230,g:180,b:235},{r:235,g:185,b:240},{r:240,g:190,b:245},{r:245,g:195,b:250},{r:250,g:200,b:255},{r:255,g:205,b:255},{r:255,g:210,b:255},{r:255,g:210,b:250},{r:255,g:205,b:245},{r:255,g:215,b:245},{r:220,g:160,b:255},{r:235,g:150,b:255},{r:245,g:160,b:240},{r:255,g:170,b:225},{r:255,g:185,b:215},{r:255,g:195,b:235},{r:255,g:200,b:220},{r:255,g:210,b:230},{r:255,g:220,b:235},{r:255,g:220,b:250},{r:255,g:225,b:255},{r:255,g:230,b:245},{r:255,g:235,b:235},{r:255,g:215,b:195},{r:255,g:225,b:180},{r:255,g:230,b:190},{r:255,g:235,b:200},{r:255,g:245,b:210},{r:255,g:240,b:220}];var Z=class{constructor(e,t,a=null,o=200,r=50){this.isDragging=!1;this.startX=0;this.startWidth=0;this.el=e,this.onResize=t,this.storageKey=a,this.minWidth=o,this.maxWidthVw=r,this.handleMouseDown=this._handleMouseDown.bind(this),this.handleMouseMove=this._handleMouseMove.bind(this),this.handleMouseUp=this._handleMouseUp.bind(this),this.handle=this.createHandle(),e.appendChild(this.handle),a&&this.loadWidth()}createHandle(){let e=document.createElement("div");return e.className="of-resize-handle",e.addEventListener("mousedown",this.handleMouseDown),e}loadWidth(){if(!this.storageKey)return;let e=GM_getValue(this.storageKey,null);if(e&&e.width){let t=this.clampWidth(e.width);this.el.style.width=t+"px",this.onResize(t)}}saveWidth(){this.storageKey&&GM_setValue(this.storageKey,{width:this.el.offsetWidth})}clampWidth(e){let t=window.innerWidth*(this.maxWidthVw/100);return Math.max(this.minWidth,Math.min(e,t))}_handleMouseDown(e){e.preventDefault(),e.stopPropagation(),this.isDragging=!0,this.startX=e.clientX,this.startWidth=this.el.offsetWidth,this.handle.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp)}_handleMouseMove(e){if(!this.isDragging)return;let t=this.startX-e.clientX,a=this.clampWidth(this.startWidth+t);this.el.style.width=a+"px",this.onResize(a)}_handleMouseUp(){this.isDragging&&(this.isDragging=!1,this.handle.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp),this.saveWidth())}destroy(){this.handle.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp),this.handle.parentNode&&this.handle.parentNode.removeChild(this.handle)}};var A={lastActionTime:0,debounceDelay:800,getLobbyButton(){return document.querySelector("public-lobby")?.querySelector("button.group.relative.isolate")},canJoinLobby(){let i=document.querySelector("public-lobby");if(!i)return!1;let e=this.getLobbyButton();return!!(e&&!i.isLobbyHighlighted&&i.lobbies&&i.lobbies.length>0&&!e.disabled&&e.offsetParent!==null)},verifyState(i){let e=document.querySelector("public-lobby");if(!e)return!1;let t=this.getLobbyButton();return!t||t.disabled||t.offsetParent===null?!1:i==="in"?e.isLobbyHighlighted===!0:i==="out"?!!(!e.isLobbyHighlighted&&e.lobbies&&e.lobbies.length>0):!1},tryJoinLobby(){let i=Date.now();if(i-this.lastActionTime<this.debounceDelay)return!1;let e=this.getLobbyButton(),t=document.querySelector("public-lobby");return e&&t&&!t.isLobbyHighlighted&&t.lobbies&&t.lobbies.length>0&&!e.disabled&&e.offsetParent!==null?(this.lastActionTime=i,e.click(),setTimeout(()=>{this.verifyState("in")||console.warn("[LobbyUtils] Join may have failed, state not updated")},100),!0):!1},isOnLobbyPage(){let i=document.getElementById("page-game");if(i&&!i.classList.contains("hidden"))return!1;let e=document.querySelector("canvas");if(e&&e.offsetParent!==null){let r=e.getBoundingClientRect();if(r.width>100&&r.height>100)return!1}let t=document.querySelector("public-lobby");if(t&&t.offsetParent!==null)return!0;if(t&&t.offsetParent===null)return!1;let a=document.getElementById("page-play");if(a&&!a.classList.contains("hidden")&&t)return!0;let o=window.location.pathname.replace(/\/+$/,"")||"/";return o==="/"||o==="/public-lobby"}};var Ve=bt(Je(),1);function te(i){return`rgb(${i.r},${i.g},${i.b})`}function H(i,e){return`rgba(${i.r},${i.g},${i.b},${e})`}var fe=class{constructor(e){this.rng=(0,Ve.default)(String(e))}nextInt(e,t){return Math.floor(this.rng()*(t-e))+e}};function wt(i){let e=0;for(let t=0;t<i.length;t++)e=(e<<5)-e+i.charCodeAt(t),e|=0;return Math.abs(e)}function be(i){let e=i/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function Tt(i){let e=be(i.r),t=be(i.g),a=be(i.b),o=e*.4124+t*.3576+a*.1805,r=e*.2126+t*.7152+a*.0722,s=e*.0193+t*.1192+a*.9505;return{x:o*100,y:r*100,z:s*100}}function Lt(i){let o=i.x/95.047,r=i.y/100,s=i.z/108.883,n=6/29,l=n*n*n,u=c=>c>l?Math.cbrt(c):c/(3*n*n)+4/29;return o=u(o),r=u(r),s=u(s),{l:116*r-16,a:500*(o-r),b:200*(r-s)}}function We(i){return Lt(Tt(i))}function St(i,e){let{l:t,a,b:o}=i,{l:r,a:s,b:n}=e,l=(t+r)/2,u=Math.sqrt(a*a+o*o),c=Math.sqrt(s*s+n*n),d=(u+c)/2,m=.5*(1-Math.sqrt(Math.pow(d,7)/(Math.pow(d,7)+Math.pow(25,7)))),g=(1+m)*a,y=(1+m)*s,h=Math.sqrt(g*g+o*o),v=Math.sqrt(y*y+n*n),$=(h+v)/2,P=Math.atan2(o,g)*(180/Math.PI),b=Math.atan2(n,y)*(180/Math.PI),C=P<0?P+360:P,T=b<0?b+360:b,w=T-C;Math.abs(w)>180&&(w+=w>0?-360:360);let S=r-t,I=v-h,j=2*Math.sqrt(h*v)*Math.sin(w*Math.PI/360),E=0;h*v===0?E=C+T:Math.abs(C-T)>180?E=(C+T+360)/2:E=(C+T)/2;let R=1-.17*Math.cos((E-30)*Math.PI/180)+.24*Math.cos(2*E*Math.PI/180)+.32*Math.cos((3*E+6)*Math.PI/180)-.2*Math.cos((4*E-63)*Math.PI/180),G=30*Math.exp(-Math.pow((E-275)/25,2)),F=2*Math.sqrt(Math.pow($,7)/(Math.pow($,7)+Math.pow(25,7))),D=1+.015*Math.pow(l-50,2)/Math.sqrt(20+Math.pow(l-50,2)),z=1+.045*$,Te=1+.015*$*R,st=-Math.sin(2*G*Math.PI/180)*F,lt=1,Le=1,Se=1;return Math.sqrt(Math.pow(S/(D*lt),2)+Math.pow(I/(z*Le),2)+Math.pow(j/(Te*Se),2)+st*(I/(z*Le))*(j/(Te*Se)))}function Mt(i,e){let t=We(i),a=1/0;for(let o of e){let r=St(t,We(o));r<a&&(a=r)}return a}function Et(i,e){let t=-1/0,a=0;for(let o=0;o<i.length;o++){let r=Mt(i[o],e);r>t&&(t=r,a=o)}return a}var U=class{constructor(e,t){this.assigned=new Map;this.baseColors=[...e],this.availableColors=[...e],this.fallbackColors=[...e,...t]}reset(){this.availableColors=[...this.baseColors],this.assigned.clear()}assignColor(e){if(this.assigned.has(e))return this.assigned.get(e);this.availableColors.length===0&&(this.availableColors=[...this.fallbackColors]);let t=0;if(this.assigned.size===0||this.assigned.size>50)t=new fe(wt(e)).nextInt(0,this.availableColors.length);else{let o=Array.from(this.assigned.values());t=Et(this.availableColors,o)}let a=this.availableColors.splice(t,1)[0];return this.assigned.set(e,a),a}},X=class{constructor(){this.teamAllocator=new U(q,J)}reset(){this.teamAllocator.reset()}getTeamColor(e){let t=$e[e];return t||this.teamAllocator.assignColor(e)}getTeamColorMap(e){let t=new Map;for(let a of e)t.set(a,this.getTeamColor(a));return t}},Yt=new X,Xt=new U(q,J);var Ke={showPlayerCount:!0,animationsEnabled:!0,debug:!1};function B(i){if(!i)return null;let e=i.trim().match(/\[([a-zA-Z0-9]{2,5})\]/);return e?e[1]??null:null}function Xe(i){return i&&i.replace(/^\[([a-zA-Z0-9]{2,5})\]\s?/,"")}function Ye(i,e){let t=null,a=0;for(let o of i){let r=e.get(o)??0;t!==null&&a<=r||(a=r,t=o)}return{team:t,teamSize:a}}function he(i){if(!i)return null;if(i.playerTeams)return i.playerTeams;let e=i.teamCount??i.teams;return typeof e=="number"?e:null}function ne(i,e,t){if(!i||i.gameMode!=="Team")return[];let a=he(i);if(a==="Humans Vs Nations")return["Humans","Nations"];let o=a==="Duos"||a==="Trios"||a==="Quads",r=2;if(typeof a=="number")r=Math.max(2,a);else{let s=a==="Duos"?2:a==="Trios"?3:a==="Quads"?4:2,n=i.maxClients??i.maxPlayers??i.maxPlayersPerGame??null,l=n!==null?Math.max(e,n):e;r=Math.max(2,Math.ceil((l+t)/s))}return o?Array.from({length:r},(s,n)=>`Team ${n+1}`):r<8?ke.slice(0,r):Array.from({length:r},(s,n)=>`Team ${n+1}`)}function $t(i,e){return Math.ceil(i/e)}function Qe(i,e,t){if(!e||e.gameMode!=="Team")return new Map;if(he(e)==="Humans Vs Nations"){let r=new Map;for(let s of i){let n=B(s);n&&r.set(n.toLowerCase(),"Humans")}return r}let{clanTeamMap:o}=Ze(i,e,t);return o}function Ze(i,e,t){if(!e||e.gameMode!=="Team")return{teams:[],clanTeamMap:new Map,soloTeamMap:new Map};let a=he(e),o=ne(e,i.length,t);if(o.length===0)return{teams:[],clanTeamMap:new Map,soloTeamMap:new Map};let r=new Map,s=new Map;if(a==="Humans Vs Nations"){for(let m of i){let g=B(m);g?r.set(g.toLowerCase(),"Humans"):s.set(m,"Humans")}return{teams:o,clanTeamMap:r,soloTeamMap:s}}let n=$t(i.length+t,o.length),l=new Map,u=[];for(let m of i){let g=B(m),y={name:m,clan:g};g?(l.has(g)||l.set(g,[]),l.get(g).push(y)):u.push(y)}let c=Array.from(l.entries()).sort((m,g)=>g[1].length-m[1].length),d=new Map;for(let[m,g]of c){let{team:y,teamSize:h}=Ye(o,d);if(!y)continue;r.set(m.toLowerCase(),y);let v=h;for(let $ of g)v<n&&v++;d.set(y,v)}for(let m of u){let{team:g,teamSize:y}=Ye(o,d);g&&(s.set(m.name,g),d.set(g,y+1))}return{teams:o,clanTeamMap:r,soloTeamMap:s}}function et(i,e,t,a,o){let{teams:r,clanTeamMap:s,soloTeamMap:n}=Ze(i,a,o);if(r.length===0)return[];let l=new Map;for(let u of r)l.set(u,{team:u,clanGroups:[],soloPlayers:[]});for(let u of e){let c=s.get(u.tag.toLowerCase());c&&l.has(c)&&l.get(c).clanGroups.push(u)}for(let u of t){let c=n.get(u);c&&l.has(c)&&l.get(c).soloPlayers.push(u)}return r.map(u=>l.get(u)).filter(u=>!!u)}function tt(i){if(!i)return null;let e=i.replace(/[^a-zA-Z0-9]/g,"").toLowerCase();return e.length>0?e:null}function nt(i){let e=new Map,t=[];for(let o of i){let r=B(o);if(r){let s=r.toLowerCase();e.has(s)?e.get(s).players.push(o):e.set(s,{tag:r,players:[o]})}else t.push(o)}return{clanGroups:Array.from(e.values()),untaggedPlayers:t}}function kt(i){let e=0;for(let t=0;t<i.length;t++)e=(e<<5)-e+i.charCodeAt(t),e|=0;return Math.abs(e)}function at(i){return kt(i)%Q.threadCount}async function ot(i,e){try{let t=await fetch(`/w${e}/api/game/${i}`);if(t.headers.get("content-type")?.includes("text/html"))throw new Error("Game started");return await t.json()}catch{return{clients:{}}}}function it(i,e,t,a,o,r){let s=new Set(e),n=new Set,l=new Set;for(let b of e)i.has(b)||n.add(b);for(let b of i)s.has(b)||l.add(b);let u=new Map;for(let b of t)u.set(b.tag.toLowerCase(),new Set(b.players));let c=new Map;for(let b of a)c.set(b.tag.toLowerCase(),new Set(b.players));let d=new Map,m=new Map;for(let[b,C]of c){let T=u.get(b);if(!T)continue;let w=[];for(let S of C)T.has(S)||w.push(S);w.length>0&&d.set(b,w)}for(let[b,C]of u){let T=c.get(b);if(!T)continue;let w=[];for(let S of C)T.has(S)||w.push(S);w.length>0&&m.set(b,w)}let g=[],y=[];for(let b of a)u.has(b.tag.toLowerCase())||g.push(b.tag);for(let b of t)c.has(b.tag.toLowerCase())||y.push(b.tag);let h=new Set(o),v=new Set(r),$=[],P=[];for(let b of r)h.has(b)||$.push(b);for(let b of o)v.has(b)||P.push(b);return{added:n,removed:l,addedByClan:d,removedByClan:m,addedUntagged:$,removedUntagged:P,newClans:g,removedClans:y}}var ae=null,ye=null,oe=class{constructor(){this.currentPlayers=[];this.clanGroups=[];this.untaggedPlayers=[];this.previousPlayers=new Set;this.previousClanGroups=[];this.previousUntaggedPlayers=[];this.debugSequence=[];this.showOnlyClans=!0;this.recentTags=[];this.usernameCheckInterval=null;this.usernameAttachInterval=null;this.debugKeyHandler=null;this.lastFetchedGameId=null;this.lastFetchTime=0;this.fetchDebounceMs=1500;this.currentPlayerUsername="";this.selectedClanTag=null;this.playerListUpdateSubscribers=[];this.lobbyConfig=null;this.nationCount=0;this.lastMapKey=null;this.currentGameId=null;this.teamColorAllocator=new X;this.clanColorAllocator=new U(q,J);this.clanColorMap=new Map;this.clanTeamMap=new Map;this.soloPlayerColorAllocator=new U(q,J);this.soloPlayerColorMap=new Map;this.settings={...Ke},this.sleeping=!A.isOnLobbyPage(),this.loadSettings(),this.initUI(),this.initDebugKey(),this.updateSleepState(),_.subscribe(()=>this.updateSleepState()),Y.fetch()}async receiveLobbyUpdate(e){if(this.sleeping)return;if(!e||!e.length){ae=ye=null,this.lastFetchedGameId=null,this.currentGameId=null,this.lobbyConfig=null,this.nationCount=0,this.lastMapKey=null,this.resetColorAllocators(),this.updateListWithNames([]);return}let t=e[0];if(!t)return;let a=t.gameID;this.currentGameId!==a&&(this.currentGameId=a,this.resetColorAllocators(),this.nationCount=0,this.lastMapKey=null),this.lobbyConfig=t.gameConfig??null,this.lobbyConfig&&this.updateNationCount(this.lobbyConfig);let o=at(a),r=Date.now();if(!(this.lastFetchedGameId===a&&r-this.lastFetchTime<this.fetchDebounceMs)){this.lastFetchedGameId=a,this.lastFetchTime=r,ae=a,ye=o;try{let s=await ot(a,o),n=Object.values(s.clients||{}).map(l=>l.username);this.updateListWithNames(n)}catch(s){console.warn("[PlayerList] Failed to fetch game data:",s)}}}onPlayerListUpdate(e){this.playerListUpdateSubscribers.push(e)}updateListWithNames(e){this.currentPlayers=e,this.settings.debug&&ae!=null&&(this.debugInfo.textContent=`GameID: ${ae} | WorkerID: ${ye}`);let t=new Set(e),a=this.previousPlayers&&this.previousPlayers.size===t.size&&e.every(c=>this.previousPlayers.has(c)),o=this.lastRenderedShowOnlyClans===this.showOnlyClans,r=this.getActiveClanTag(),s=this.lastRenderedSelectedClanTag===r,n=this.lastRenderedTeamMode===this.isTeamMode();if(a&&o&&s&&n)return;let{clanGroups:l,untaggedPlayers:u}=nt(e);if(this.previousClanGroups=this.clanGroups,this.previousUntaggedPlayers=this.untaggedPlayers,this.clanGroups=l,this.untaggedPlayers=u,this.updateClanColorMaps(),this.renderPlayerList(),this.settings.showPlayerCount){let c=this.header.querySelector(".of-player-list-count");c&&(c.textContent=String(e.length))}this.previousPlayers=t,this.lastRenderedShowOnlyClans=this.showOnlyClans,this.notifyPlayerListUpdate()}notifyPlayerListUpdate(){if(this.playerListUpdateSubscribers.length===0)return;let e=this.getActiveClanTag(),t=this.hasClanmateMatch(e),a={activeClanTag:e,hasClanmateMatch:t};this.playerListUpdateSubscribers.forEach(o=>o(a))}hasClanmateMatch(e){if(!e)return!1;let t=e.toLowerCase(),a=this.currentPlayerUsername.trim();for(let o of this.clanGroups)if(o.tag.toLowerCase()===t)return a?o.players.some(r=>r.trim()!==a):o.players.length>0;return!1}isTeamMode(){return this.lobbyConfig?.gameMode==="Team"}getSoloPlayerColor(e){if(this.soloPlayerColorMap.has(e))return this.soloPlayerColorMap.get(e);let t=this.soloPlayerColorAllocator.assignColor(e);return this.soloPlayerColorMap.set(e,t),t}getClanColor(e){let t=e.toLowerCase();if(this.clanColorMap.has(t))return this.clanColorMap.get(t);let a=this.clanColorAllocator.assignColor(t);return this.clanColorMap.set(t,a),a}initUI(){this.container=document.createElement("div"),this.container.className="of-panel of-player-list-container";let e=document.getElementById("of-game-layout-wrapper");e?e.appendChild(this.container):(console.warn("[PlayerList] Layout wrapper not found, appending to body"),document.body.appendChild(this.container));let t=document.createElement("div");t.id="of-autojoin-slot",t.className="of-autojoin-slot",this.container.appendChild(t),this.header=document.createElement("div"),this.header.className="of-header of-player-list-header",this.header.innerHTML=`
      <div class="of-header-title">
        <span class="of-player-list-title">Lobby Intel</span>
        <span class="of-badge of-player-list-count">0</span>
      </div>
    `,this.container.appendChild(this.header),this.debugInfo=document.createElement("div"),this.debugInfo.className="of-player-debug-info",this.header.appendChild(this.debugInfo),this.quickTagSwitch=document.createElement("div"),this.quickTagSwitch.className="of-quick-tag-switch";let a=document.createElement("span");a.className="of-quick-tag-label",a.textContent="Quick tags",this.quickTagSwitch.appendChild(a),this.container.appendChild(this.quickTagSwitch),this.checkboxFilter=document.createElement("div"),this.checkboxFilter.className="of-clan-checkbox-filter";let o=document.createElement("input");o.type="checkbox",o.id="show-only-clans-checkbox",o.checked=this.showOnlyClans,o.addEventListener("change",s=>{if(this.showOnlyClans=s.target.checked,this.saveSettings(),this.renderPlayerList(),this.settings.showPlayerCount){let n=this.header.querySelector(".of-player-list-count");n&&(n.textContent=String(this.currentPlayers.length))}});let r=document.createElement("label");r.htmlFor="show-only-clans-checkbox",r.textContent="Show only players with clan tags",this.checkboxFilter.appendChild(o),this.checkboxFilter.appendChild(r),this.container.appendChild(this.checkboxFilter),this.content=document.createElement("div"),this.content.className="of-content of-player-list-content",this.container.appendChild(this.content),this.resizeHandler=new Z(this.container,s=>{document.documentElement.style.setProperty("--player-list-width",s+"px")},k.playerListPanelSize,200,50),this.applySavedPanelSize(),this.resizeObserver=new ResizeObserver(()=>{if(!A.isOnLobbyPage())return;let s=this.container.offsetWidth,n=this.container.offsetHeight;s<=0||n<=0||GM_setValue(k.playerListPanelSize,{width:s,height:n})}),this.resizeObserver.observe(this.container),this.applySettings(),this.renderQuickTagSwitch(),this.monitorUsernameInput()}monitorUsernameInput(){let e=()=>{let s=document.querySelector("username-input");if(!s)return null;let n=s.querySelector('input[maxlength="5"]'),l=s.querySelector('input:not([maxlength="5"])');return{clanInput:n,nameInput:l,component:s}},t="",a=()=>{let s=e();if(!s)return;let n=s.clanInput?.value||"",l=s.nameInput?.value||"",u=n?`[${n}] ${l}`:l,c=n||B(u);c&&c.length>=2&&this.addRecentTag(c)},o=()=>{let s=e();if(!s)return;let n=s.clanInput?.value||"",l=s.nameInput?.value||"",u=n?`[${n}] ${l}`:l;if(u!==t){t=u,this.currentPlayerUsername=u;let c=B(u);!this.setSelectedClanTag(n||c)&&this.clanGroups.length>0&&this.renderPlayerList()}};o(),this.usernameCheckInterval=setInterval(o,1e3);let r=()=>{let s=e(),n=s?.clanInput,l=s?.nameInput;n&&!n.dataset.ofMonitored&&(n.dataset.ofMonitored="true",n.addEventListener("input",o),n.addEventListener("change",()=>{o(),a()})),l&&!l.dataset.ofMonitored&&(l.dataset.ofMonitored="true",l.addEventListener("input",o),l.addEventListener("change",()=>{o(),a()}))};r(),this.usernameAttachInterval=setInterval(r,5e3)}loadSettings(){let e=GM_getValue(k.playerListShowOnlyClans);e!==void 0&&(e==="true"?this.showOnlyClans=!0:e==="false"?this.showOnlyClans=!1:this.showOnlyClans=!!e);let t=GM_getValue(k.playerListRecentTags);t&&Array.isArray(t)&&(this.recentTags=t)}saveSettings(){GM_setValue(k.playerListShowOnlyClans,this.showOnlyClans)}getAutoRejoinOnClanChange(){let e=GM_getValue(k.autoJoinSettings,null);return e&&typeof e.autoRejoinOnClanChange=="boolean"?e.autoRejoinOnClanChange:GM_getValue(k.playerListAutoRejoin)??!1}applyClanTagToNickname(e){this.setSelectedClanTag(e);let t=document.querySelector("username-input");if(!t)return;let a=t.querySelector('input[maxlength="5"]');if(a){let o=e.toUpperCase(),r=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value")?.set;r&&(r.call(a,o),a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0})),this.getAutoRejoinOnClanChange()&&this.performLobbyRejoin())}}addRecentTag(e){let t=e.toUpperCase();this.recentTags.includes(t)||(this.recentTags.unshift(t),this.recentTags.length>3&&(this.recentTags=this.recentTags.slice(0,3)),GM_setValue(k.playerListRecentTags,this.recentTags),this.renderQuickTagSwitch())}renderQuickTagSwitch(){this.quickTagSwitch.querySelectorAll(".of-quick-tag-item").forEach(t=>t.remove());for(let t of this.recentTags){let a=document.createElement("div");a.className="of-quick-tag-item";let o=document.createElement("button");o.type="button",o.className="of-quick-tag-btn",o.textContent=t,o.title=`Apply [${t}] to your username`,o.addEventListener("click",()=>{this.applyClanTagToNickname(t)});let r=document.createElement("button");r.type="button",r.className="of-quick-tag-remove",r.textContent="x",r.title="Remove from recent tags",r.setAttribute("aria-label",`Remove ${t} from recent tags`),r.addEventListener("click",s=>{s.stopPropagation(),this.recentTags=this.recentTags.filter(n=>n!==t),GM_setValue(k.playerListRecentTags,this.recentTags),this.renderQuickTagSwitch()}),a.appendChild(o),a.appendChild(r),this.quickTagSwitch.appendChild(a)}}createClanGroupEl(e,t,a,o){let r=document.createElement("div");if(r.className="of-clan-group",r.setAttribute("data-clan-tag",e.toLowerCase()),o?.applyClanColor??!0){let y=this.clanColorMap.get(e.toLowerCase());y&&(r.style.setProperty("--clan-color",te(y)),r.style.setProperty("--clan-color-soft",H(y,.14)),r.style.setProperty("--clan-color-strong",H(y,.28)),r.style.setProperty("--clan-color-border",H(y,.6)))}else r.classList.add("of-clan-group-neutral");o?.isNew&&r.classList.add("of-clan-group-enter");let n=document.createElement("div");n.className="of-clan-group-header";let l="";if(a){let y=a.wins&&a.losses?(a.wins/a.losses).toFixed(2):a.weightedWLRatio?.toFixed(2)||"0.00",h=a.wins?.toLocaleString()||0,v=a.losses?.toLocaleString()||0;l=`
        <span>W ${h}</span>
        <span>\u2022</span>
        <span>L ${v}</span>
        <span>\u2022</span>
        <span>R ${y}</span>
      `}let u=this.getActiveClanTag(),c=!!u&&e.toLowerCase()===u;n.innerHTML=`
      <span class="of-clan-tag">[${e}]</span>
      <span class="of-clan-count">${t.length}</span>
      <div class="of-clan-actions">
        ${l?`<div class="of-clan-stats">${l}</div>`:""}
        <button class="of-clan-use-btn" title="Apply [${e}] to your username">Use tag</button>
      </div>
    `;let d=n.querySelector(".of-clan-use-btn");d&&d.addEventListener("click",y=>{y.stopPropagation(),this.applyClanTagToNickname(e)});let m=document.createElement("div");m.className="of-clan-group-players";let g=o?.newPlayers;for(let y of t){let h=g?g.has(y):!1;m.appendChild(this.createPlayerEl(y,h,!0,void 0,c))}return r.appendChild(n),r.appendChild(m),r}createPlayerEl(e,t=!1,a=!1,o,r=!1){let s=document.createElement("div");s.className="of-player-item",s.setAttribute("data-player-name",e),t&&s.classList.add("of-player-enter"),o&&(s.classList.add("of-player-item-accent"),s.style.setProperty("--player-accent",te(o)),s.style.setProperty("--player-accent-soft",H(o,.16)),s.style.setProperty("--player-accent-strong",H(o,.32)),s.style.setProperty("--player-accent-border",H(o,.7))),r&&s.classList.add("of-player-item-clanmate");let n=document.createElement("span");return n.className="of-player-name",n.textContent=a?Xe(e):e,s.appendChild(n),s}normalizeClanTag(e){if(!e)return null;let t=e.trim();return t?t.toLowerCase():null}setSelectedClanTag(e){let t=this.normalizeClanTag(e);return t===this.selectedClanTag?!1:(this.selectedClanTag=t,this.renderPlayerList(),this.notifyPlayerListUpdate(),!0)}getActiveClanTag(){return this.selectedClanTag?this.selectedClanTag:this.currentPlayerUsername?this.normalizeClanTag(B(this.currentPlayerUsername)):null}sortClanGroupsWithPlayerFirst(e,t){let a=t??this.getActiveClanTag();if(!a)return e;let o=e.findIndex(r=>r.tag.toLowerCase()===a);return o>0?[e[o],...e.slice(0,o),...e.slice(o+1)]:e}async performLobbyRejoin(){let e=document.querySelector("public-lobby"),t=A.getLobbyButton();if(!t||!e){console.warn("[PlayerList] Cannot rejoin - lobby elements not found");return}if(e.isLobbyHighlighted===!0&&(t.click(),await new Promise(r=>setTimeout(r,900)),!A.verifyState("out"))){console.warn("[PlayerList] Failed to leave lobby");return}await new Promise(r=>setTimeout(r,200)),A.tryJoinLobby()||console.warn("[PlayerList] Failed to join lobby")}renderPlayerList(){let e=it(this.previousPlayers,this.currentPlayers,this.previousClanGroups,this.clanGroups,this.previousUntaggedPlayers,this.untaggedPlayers),t=this.previousPlayers.size===0,a=this.lastRenderedShowOnlyClans!==this.showOnlyClans,o=this.getActiveClanTag(),r=this.lastRenderedSelectedClanTag!==o,s=this.isTeamMode(),n=this.lastRenderedTeamMode!==s;s?this.renderPlayerListTeamMode(e,o):t||a||r||n?this.renderPlayerListFfaFull():this.renderPlayerListFfaDifferential(e),this.lastRenderedSelectedClanTag=o,this.lastRenderedTeamMode=s}renderPlayerListFfaFull(){this.content.innerHTML="";let e=this.showOnlyClans?this.currentPlayers.filter(t=>B(t)):this.currentPlayers;for(let t of e){let a=B(t),o=a?this.getClanColor(a):this.getSoloPlayerColor(t);this.content.appendChild(this.createPlayerEl(t,!1,!1,o,!1))}}renderPlayerListTeamMode(e,t){this.content.innerHTML="";let a=this.lobbyConfig;if(!a||a.gameMode!=="Team")return;let o=ne(a,this.currentPlayers.length,this.nationCount);if(o.length===0)return;let r=this.teamColorAllocator.getTeamColorMap(o),s=et(this.currentPlayers,this.clanGroups,this.untaggedPlayers,a,this.nationCount),n=t??this.getActiveClanTag(),l=this.findCurrentTeam(s,n),u=this.orderTeamGroups(s,l),c=new Set(e.newClans.map(m=>m.toLowerCase())),d=new Set(e.addedUntagged);for(let m of u){if(this.showOnlyClans&&m.clanGroups.length===0)continue;let g=document.createElement("div");g.className="of-team-group",g.setAttribute("data-team",m.team),m.team===l&&g.classList.add("current-player-team");let y=r.get(m.team);y&&(g.style.setProperty("--team-color",te(y)),g.style.setProperty("--team-color-soft",H(y,.28)));let h=document.createElement("div");h.className="of-team-band",g.appendChild(h);let v=document.createElement("div");v.className="of-team-header";let $=m.soloPlayers.length+m.clanGroups.reduce((b,C)=>b+C.players.length,0);v.innerHTML=`
        <span class="of-team-label">${m.team}</span>
        <span class="of-team-count">${$}</span>
      `,g.appendChild(v);let P=this.sortClanGroupsWithPlayerFirst(m.clanGroups,n);for(let b of P){let C=Y.getStats(b.tag),T=e.addedByClan.get(b.tag.toLowerCase()),w=this.createClanGroupEl(b.tag,b.players,C,{isNew:c.has(b.tag.toLowerCase()),applyClanColor:!0,newPlayers:T?new Set(T):void 0});g.appendChild(w),w.classList.contains("of-clan-group-enter")&&w.addEventListener("animationend",()=>{w.classList.remove("of-clan-group-enter")},{once:!0})}if(!this.showOnlyClans&&m.soloPlayers.length>0){let b=document.createElement("div");b.className="of-solo-players";for(let C of m.soloPlayers){let T=d.has(C);b.appendChild(this.createPlayerEl(C,T,!1,y))}g.appendChild(b)}this.content.appendChild(g)}}findCurrentTeam(e,t){if(t){for(let o of e)if(o.clanGroups.some(r=>r.tag.toLowerCase()===t))return o.team}let a=this.currentPlayerUsername.trim();if(!a)return null;for(let o of e)if(o.soloPlayers.includes(a))return o.team;return null}orderTeamGroups(e,t){if(!t)return e;let a=e.findIndex(r=>r.team===t);return a<=0?e:[e[a],...e.slice(0,a),...e.slice(a+1)]}renderPlayerListFfaDifferential(e){for(let a of e.removed){let o=this.content.querySelector(`.of-player-item[data-player-name="${CSS.escape(a)}"]`);o&&this.removePlayerWithAnimation(o)}let t=0;for(let a of e.added){let o=B(a);if(this.showOnlyClans&&!o)continue;let r=o?this.getClanColor(o):this.getSoloPlayerColor(a),s=this.createPlayerEl(a,!0,!1,r,!1);t>0&&t<=4&&s.classList.add(`of-player-enter-stagger-${t}`),t++,this.content.appendChild(s),s.addEventListener("animationend",()=>{s.classList.remove("of-player-enter");for(let n=1;n<=4;n++)s.classList.remove(`of-player-enter-stagger-${n}`)},{once:!0})}}resetColorAllocators(){this.teamColorAllocator.reset(),this.clanColorAllocator.reset(),this.clanColorMap.clear(),this.clanTeamMap.clear(),this.soloPlayerColorAllocator.reset(),this.soloPlayerColorMap.clear()}updateClanColorMaps(){if(this.clanColorMap.clear(),this.clanTeamMap.clear(),this.clanGroups.length===0)return;let e=this.lobbyConfig;if(e?.gameMode==="Team"&&e){let o=ne(e,this.currentPlayers.length,this.nationCount),r=this.teamColorAllocator.getTeamColorMap(o),s=Qe(this.currentPlayers,e,this.nationCount);for(let n of this.clanGroups){let l=n.tag.toLowerCase(),u=s.get(l),c=u?r.get(u):void 0;u&&this.clanTeamMap.set(l,u),c&&this.clanColorMap.set(l,c)}return}let a=[...this.clanGroups].map(o=>o.tag.toLowerCase()).sort((o,r)=>o.localeCompare(r));for(let o of a)this.clanColorMap.set(o,this.clanColorAllocator.assignColor(o))}async updateNationCount(e){if(e.disableNations){this.nationCount=0;return}let t=tt(e.gameMap);if(!t){this.nationCount=0;return}if(this.lastMapKey!==t){this.lastMapKey=t;try{let a=await fetch(`/maps/${t}/manifest.json`);if(!a.ok)throw new Error(`Failed to load manifest for ${t}`);let o=await a.json(),r=Array.isArray(o.nations)?o.nations.length:0,s=!!e.publicGameModifiers?.isCompact||e.gameMapSize==="Compact";r===0?this.nationCount=0:s?this.nationCount=Math.max(1,Math.floor(r*.25)):this.nationCount=r}catch(a){console.warn("[PlayerList] Failed to fetch map manifest:",a),this.nationCount=0}this.updateClanColorMaps(),this.renderPlayerList()}}removePlayerWithAnimation(e){e.classList.add("of-player-exit"),e.addEventListener("animationend",()=>{e.remove()},{once:!0})}applySettings(){this.settings.debug&&(this.debugInfo.style.display="block")}applySavedPanelSize(){let e=GM_getValue(k.playerListPanelSize);e&&e.width&&(this.container.style.width=e.width+"px",document.documentElement.style.setProperty("--player-list-width",e.width+"px"))}updateSleepState(){let e=A.isOnLobbyPage();this.sleeping=!e,this.sleeping?this.container.classList.add("hidden"):this.container.classList.remove("hidden")}initDebugKey(){this.debugKeyHandler=e=>{e.ctrlKey&&e.shiftKey&&e.key==="D"&&(this.debugSequence.push("D"),this.debugSequence.length>3&&this.debugSequence.shift(),this.debugSequence.join("")==="DDD"&&(this.settings.debug=!this.settings.debug,this.applySettings(),console.log("[PlayerList] Debug mode:",this.settings.debug),this.debugSequence=[]))},document.addEventListener("keydown",this.debugKeyHandler)}cleanup(){this.usernameCheckInterval&&clearInterval(this.usernameCheckInterval),this.usernameAttachInterval&&clearInterval(this.usernameAttachInterval),this.debugKeyHandler&&document.removeEventListener("keydown",this.debugKeyHandler),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeHandler&&this.resizeHandler.destroy(),this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container)}};function ve(i,e){return!i||!e?null:i==="Duos"?2:i==="Trios"?3:i==="Quads"?4:typeof i=="number"&&i>0?Math.floor(e/i):null}function Pt(i){if(!i)return null;let e=i.toLowerCase().trim();return e==="free for all"||e==="ffa"?"FFA":e==="team"||e==="teams"?"Team":e==="humans vs nations"||e==="hvn"?"HvN":null}function xe(i){return Pt(i.gameConfig?.gameMode)}function ie(i){let e=i.gameConfig;if(!e)return null;if(e.playerTeams)return e.playerTeams;let t=e.teamCount??e.teams;return typeof t=="number"?t:null}function Ce(i){let e=i.gameConfig;return e?e.maxClients??e.maxPlayers??e.maxPlayersPerGame??i.maxClients??null:null}function we(i){let e=xe(i),t=ie(i),a=Ce(i);if(e==="FFA")return a!==null?`FFA (${a} max players)`:"FFA";if(e==="Team"){if(t==="Duos")return"Duos";if(t==="Trios")return"Trios";if(t==="Quads")return"Quads";if(typeof t=="number"&&a!==null){let o=ve(t,a);return o!==null?`${t} teams (${o} per team)`:`${t} teams`}return"Team"}return"Unknown"}var re=class{matchesCriteria(e,t){if(!e||!e.gameConfig||!t||t.length===0)return!1;let a=Ce(e),o=xe(e);for(let r of t){let s=!1;if(r.gameMode==="FFA"&&o==="FFA")s=!0;else if(r.gameMode==="Team"&&o==="Team"){if(r.teamCount!==null&&r.teamCount!==void 0){let n=ie(e);if(r.teamCount==="Duos"&&n!=="Duos"||r.teamCount==="Trios"&&n!=="Trios"||r.teamCount==="Quads"&&n!=="Quads"||typeof r.teamCount=="number"&&n!==r.teamCount)continue}s=!0}else r.gameMode==="HvN"&&o==="Team"&&e.gameConfig?.playerTeams==="Humans Vs Nations"&&(s=!0);if(s){if(r.gameMode==="FFA"){if(a===null)return!0;if(r.minPlayers!==null&&a<r.minPlayers||r.maxPlayers!==null&&a>r.maxPlayers)continue}else if(r.gameMode==="Team"){let n=ie(e),l=ve(n,a);if(l===null)return!0;if(r.minPlayers!==null&&l<r.minPlayers||r.maxPlayers!==null&&l>r.maxPlayers)continue}return!0}}return!1}};var se=class{constructor(){this.autoJoinEnabled=!0;this.criteriaList=[];this.joinedLobbies=new Set;this.searchStartTime=null;this.gameFoundTime=null;this.isJoining=!1;this.soundEnabled=!0;this.recentlyLeftLobbyID=null;this.joinMode="autojoin";this.notifiedLobbies=new Set;this.lastNotifiedGameID=null;this.isTeamThreeTimesMinEnabled=!1;this.sleeping=!1;this.autoRejoinOnClanChange=!1;this.clanmateWatcherArmed=!1;this.lastClanmateMatch=!1;this.lastActiveClanTag=null;this.timerInterval=null;this.gameInfoInterval=null;this.notificationTimeout=null;this.engine=new re,this.loadSettings(),this.createUI(),this.updateSleepState(),_.subscribe(()=>this.updateSleepState())}receiveLobbyUpdate(e){this.processLobbies(e)}handleClanmateUpdate(e){if(this.lastActiveClanTag=e.activeClanTag,this.lastClanmateMatch=e.hasClanmateMatch,this.updateClanmateButtonState(),!!this.clanmateWatcherArmed){if(!e.activeClanTag){this.setClanmateWatcherArmed(!1);return}e.hasClanmateMatch&&this.attemptClanmateJoin()}}migrateSettings(){let e="autoJoinSettings",t=k.autoJoinSettings,a="autoJoinPanelPosition",o=k.autoJoinPanelPosition,r=k.playerListAutoRejoin,s=GM_getValue(e),n=GM_getValue(t);s&&!n&&GM_setValue(t,s);let l=GM_getValue(a),u=GM_getValue(o);l&&!u&&GM_setValue(o,l);let c=GM_getValue(r);if(c!==void 0){let d=GM_getValue(t,null);d?d.autoRejoinOnClanChange===void 0&&GM_setValue(t,{...d,autoRejoinOnClanChange:c}):GM_setValue(t,{criteria:[],autoJoinEnabled:!0,soundEnabled:!0,joinMode:"autojoin",isTeamThreeTimesMinEnabled:!1,autoRejoinOnClanChange:c})}}loadSettings(){this.migrateSettings();let e=GM_getValue(k.autoJoinSettings,null);e&&(this.criteriaList=e.criteria||[],this.soundEnabled=e.soundEnabled!==void 0?e.soundEnabled:!0,this.joinMode=e.joinMode||"autojoin",this.isTeamThreeTimesMinEnabled=e.isTeamThreeTimesMinEnabled||!1,this.autoJoinEnabled=e.autoJoinEnabled!==void 0?e.autoJoinEnabled:!0,this.autoRejoinOnClanChange=e.autoRejoinOnClanChange!==void 0?e.autoRejoinOnClanChange:!1)}saveSettings(){GM_setValue(k.autoJoinSettings,{criteria:this.criteriaList,autoJoinEnabled:this.autoJoinEnabled,soundEnabled:this.soundEnabled,joinMode:this.joinMode,isTeamThreeTimesMinEnabled:this.isTeamThreeTimesMinEnabled,autoRejoinOnClanChange:this.autoRejoinOnClanChange})}updateSearchTimer(){let e=document.getElementById("search-timer");if(!e)return;if(!this.autoJoinEnabled||this.searchStartTime===null||!this.criteriaList||this.criteriaList.length===0){e.style.display="none",this.gameFoundTime=null;return}if(this.gameFoundTime!==null){let a=Math.floor((this.gameFoundTime-this.searchStartTime)/1e3);e.textContent=`Game found! (${Math.floor(a/60)}m ${a%60}s)`,e.style.display="inline";return}let t=Math.floor((Date.now()-this.searchStartTime)/1e3);e.textContent=`Searching: ${Math.floor(t/60)}m ${t%60}s`,e.style.display="inline"}updateCurrentGameInfo(){let e=document.getElementById("current-game-info");if(!e||!A.isOnLobbyPage()){e&&(e.style.display="none");return}e.style.display="block";let t=document.querySelector("public-lobby");if(!t||!t.lobbies||t.lobbies.length===0){e.textContent="Current game: No game",e.classList.add("not-applicable");return}let a=t.lobbies[0];if(!a||!a.gameConfig){e.textContent="Current game: No game",e.classList.add("not-applicable");return}let o=we(a);e.textContent=`Current game: ${o}`,e.classList.remove("not-applicable")}processLobbies(e){try{if(this.updateCurrentGameInfo(),this.isJoining||!this.autoJoinEnabled||!this.criteriaList||this.criteriaList.length===0||!A.isOnLobbyPage())return;this.joinMode==="notify"&&this.gameFoundTime!==null&&this.lastNotifiedGameID!==null&&(e.length>0?e[0]:null)?.gameID!==this.lastNotifiedGameID&&(this.gameFoundTime=null,this.lastNotifiedGameID=null,this.syncSearchTimer({resetStart:!0}));for(let t of e)if(this.engine.matchesCriteria(t,this.criteriaList)){if(this.recentlyLeftLobbyID===t.gameID)continue;if(this.joinMode==="notify"){this.notifiedLobbies.has(t.gameID)||(this.showGameFoundNotification(t),console.log("[AutoJoin] Sound enabled:",this.soundEnabled),this.soundEnabled&&K.playGameFoundSound(),this.notifiedLobbies.add(t.gameID),this.gameFoundTime=Date.now(),this.lastNotifiedGameID=t.gameID);return}else{this.joinedLobbies.has(t.gameID)||(this.joinLobby(t),this.joinedLobbies.add(t.gameID));return}}}catch(t){console.error("[AutoJoin] Error processing lobbies:",t)}}showGameFoundNotification(e){this.dismissNotification();let t=this.createNewNotification(e);document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("notification-visible")}),this.notificationTimeout=setTimeout(()=>{this.dismissNotification(t)},1e4)}createNewNotification(e){let t=document.createElement("div");t.className="game-found-notification";let a=we(e);return t.innerHTML=`
      <div class="notification-title">Game Found</div>
      <div class="notification-detail">${a}</div>
      <div class="notification-hint">Click to dismiss</div>
    `,t.addEventListener("click",()=>{this.dismissNotification(t)}),t}dismissNotification(e=null){this.notificationTimeout&&(clearTimeout(this.notificationTimeout),this.notificationTimeout=null);let t=e?[e]:Array.from(document.querySelectorAll(".game-found-notification"));for(let a of t)a.classList.remove("notification-visible"),a.classList.add("notification-dismissing"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)}joinLobby(e){if(this.isJoining)return;console.log("[AutoJoin] Attempting to join lobby:",e.gameID),this.isJoining=!0,this.gameFoundTime=Date.now(),setTimeout(()=>{A.tryJoinLobby()?(console.log("[AutoJoin] Join initiated"),this.soundEnabled&&K.playGameStartSound(),this.recentlyLeftLobbyID=e.gameID,setTimeout(()=>{this.recentlyLeftLobbyID=null},5e3)):console.warn("[AutoJoin] Failed to join lobby"),this.isJoining=!1},100)}stopTimer(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null)}startGameInfoUpdates(){this.stopGameInfoUpdates(),this.updateCurrentGameInfo(),this.gameInfoInterval=setInterval(()=>this.updateCurrentGameInfo(),1e3)}stopGameInfoUpdates(){this.gameInfoInterval&&(clearInterval(this.gameInfoInterval),this.gameInfoInterval=null)}syncSearchTimer(e={}){let{resetStart:t=!1}=e;this.stopTimer(),t&&(this.searchStartTime=null,this.gameFoundTime=null,this.notifiedLobbies.clear(),this.lastNotifiedGameID=null),this.autoJoinEnabled&&this.criteriaList&&this.criteriaList.length>0?(this.searchStartTime===null&&(this.searchStartTime=Date.now()),this.timerInterval=setInterval(()=>this.updateSearchTimer(),100)):(this.searchStartTime=null,this.gameFoundTime=null),this.updateSearchTimer()}setAutoJoinEnabled(e,t={}){let{resetTimer:a=!1}=t;this.autoJoinEnabled=e,this.saveSettings(),this.updateUI(),this.syncSearchTimer({resetStart:a})}setModesExpanded(e){let t=document.getElementById("autojoin-modes");t&&t.classList.toggle("is-expanded",e)}setClanmateWatcherArmed(e){this.clanmateWatcherArmed=e,this.updateClanmateButtonState()}updateClanmateButtonState(){let e=document.getElementById("autojoin-clanmate-button");if(!e)return;let t="One-shot. Uses clan tag input. Independent of Auto-Join status.",a=!!this.lastActiveClanTag,o=this.lastActiveClanTag?this.lastActiveClanTag.toUpperCase():null;e.disabled=!a,e.setAttribute("title",t),this.clanmateWatcherArmed?(e.textContent="Waiting for clanmate...",e.classList.add("armed")):(e.textContent=a?`Join any [${o}] member`:"Set your clan tag to enable",e.classList.remove("armed"))}attemptClanmateJoin(){if(!this.clanmateWatcherArmed)return;this.setClanmateWatcherArmed(!1),A.tryJoinLobby()||console.warn("[AutoJoin] Clanmate auto-join attempt failed")}getNumberValue(e){let t=document.getElementById(e);if(!t)return null;let a=parseInt(t.value,10);return isNaN(a)?null:a}getAllTeamCountValues(){let e=[],t=["autojoin-team-duos","autojoin-team-trios","autojoin-team-quads","autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7"];for(let a of t){let o=document.getElementById(a);if(o?.checked){let r=o.value;if(r==="Duos"||r==="Trios"||r==="Quads")e.push(r);else{let s=parseInt(r,10);isNaN(s)||e.push(s)}}}return e}setAllTeamCounts(e){let t=["autojoin-team-duos","autojoin-team-trios","autojoin-team-quads","autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7"];for(let a of t){let o=document.getElementById(a);o&&(o.checked=e)}}buildCriteriaFromUI(){let e=[];if(document.getElementById("autojoin-ffa")?.checked&&e.push({gameMode:"FFA",minPlayers:this.getNumberValue("autojoin-ffa-min"),maxPlayers:this.getNumberValue("autojoin-ffa-max")}),document.getElementById("autojoin-team")?.checked){let r=this.getAllTeamCountValues();if(r.length===0)e.push({gameMode:"Team",teamCount:null,minPlayers:this.getNumberValue("autojoin-team-min"),maxPlayers:this.getNumberValue("autojoin-team-max")});else for(let s of r)e.push({gameMode:"Team",teamCount:s,minPlayers:this.getNumberValue("autojoin-team-min"),maxPlayers:this.getNumberValue("autojoin-team-max")})}return document.getElementById("autojoin-hvn")?.checked&&e.push({gameMode:"HvN",teamCount:null,minPlayers:null,maxPlayers:null}),e}updateUI(){let e=document.getElementById("autojoin-main-button"),t=document.querySelector(".status-text"),a=document.querySelector(".status-indicator");e&&(this.joinMode==="autojoin"?(e.textContent="Auto-Join",e.classList.add("active"),e.classList.remove("inactive")):(e.textContent="Notify Only",e.classList.remove("active"),e.classList.add("inactive"))),t&&a&&(this.autoJoinEnabled?(t.textContent="Active",a.style.background="#38d9a9",a.classList.add("active"),a.classList.remove("inactive")):(t.textContent="Inactive",a.style.background="#888",a.classList.remove("active"),a.classList.add("inactive")))}loadUIFromSettings(){let e=document.getElementById("autojoin-ffa"),t=document.getElementById("ffa-config"),a=this.criteriaList.some(h=>h.gameMode==="FFA");e&&(e.checked=a,t&&(t.style.display=a?"block":"none"));let o=document.getElementById("autojoin-team"),r=document.getElementById("team-config"),s=this.criteriaList.some(h=>h.gameMode==="Team");o&&(o.checked=s,r&&(r.style.display=s?"block":"none"));let n=this.criteriaList.filter(h=>h.gameMode==="Team"),l=n.map(h=>h.teamCount).filter(h=>h!==null);for(let h of l){let v=null;h==="Duos"?v=document.getElementById("autojoin-team-duos"):h==="Trios"?v=document.getElementById("autojoin-team-trios"):h==="Quads"?v=document.getElementById("autojoin-team-quads"):typeof h=="number"&&(v=document.getElementById(`autojoin-team-${h}`)),v&&(v.checked=!0)}let u=document.getElementById("autojoin-hvn"),c=this.criteriaList.some(h=>h.gameMode==="HvN");u&&(u.checked=c);let d=this.criteriaList.find(h=>h.gameMode==="FFA");if(d){let h=document.getElementById("autojoin-ffa-min"),v=document.getElementById("autojoin-ffa-max");h&&d.minPlayers!==null&&(h.value=String(d.minPlayers)),v&&d.maxPlayers!==null&&(v.value=String(d.maxPlayers))}let m=n[0];if(m){let h=document.getElementById("autojoin-team-min"),v=document.getElementById("autojoin-team-max");h&&m.minPlayers!==null&&(h.value=String(m.minPlayers)),v&&m.maxPlayers!==null&&(v.value=String(m.maxPlayers))}let g=document.getElementById("autojoin-sound-toggle");g&&(g.checked=this.soundEnabled);let y=document.getElementById("autojoin-auto-rejoin");y&&(y.checked=this.autoRejoinOnClanChange)}initializeSlider(e,t,a,o,r,s,n){let l=document.getElementById(e),u=document.getElementById(t),c=document.getElementById(a),d=document.getElementById(o);if(!l||!u||!c||!d)return;let m=parseInt(c.value,10),g=parseInt(d.value,10);Number.isNaN(m)||(l.value=String(m)),Number.isNaN(g)||(u.value=String(g));let y=()=>{this.updateSliderRange(e,t,a,o,r,s,n),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})};l.addEventListener("input",y),u.addEventListener("input",y),this.updateSliderRange(e,t,a,o,r,s,n)}updateSliderRange(e,t,a,o,r,s,n){let l=document.getElementById(e),u=document.getElementById(t),c=document.getElementById(a),d=document.getElementById(o),m=document.getElementById(r),g=document.getElementById(s),y=document.getElementById(n);if(!l||!u||!c||!d)return;let h=parseInt(l.value,10),v=parseInt(u.value,10);if(e.includes("team")&&this.isTeamThreeTimesMinEnabled&&(v=Math.min(parseInt(u.max,10),Math.max(1,3*h)),u.value=String(v)),h>v&&(h=v,l.value=String(h)),c.value=String(h),d.value=String(v),g&&(g.textContent=h===1?"Any":String(h)),y&&(y.textContent=v===parseInt(u.max,10)?"Any":String(v)),m){let $=(h-parseInt(l.min,10))/(parseInt(l.max,10)-parseInt(l.min,10))*100,P=(v-parseInt(l.min,10))/(parseInt(l.max,10)-parseInt(l.min,10))*100;m.style.left=$+"%",m.style.width=P-$+"%"}}setupEventListeners(){document.getElementById("autojoin-main-button")?.addEventListener("click",()=>{this.joinMode=this.joinMode==="autojoin"?"notify":"autojoin",this.saveSettings(),this.updateUI()}),document.getElementById("autojoin-status")?.addEventListener("click",()=>{this.setAutoJoinEnabled(!this.autoJoinEnabled,{resetTimer:!0})}),document.getElementById("autojoin-clanmate-button")?.addEventListener("click",()=>{if(this.clanmateWatcherArmed){this.setClanmateWatcherArmed(!1);return}if(!this.lastActiveClanTag){this.setClanmateWatcherArmed(!1);return}this.setClanmateWatcherArmed(!0),this.lastClanmateMatch&&this.attemptClanmateJoin()});let e=document.getElementById("autojoin-modes");e&&(e.addEventListener("mouseenter",()=>this.setModesExpanded(!0)),e.addEventListener("mouseleave",()=>this.setModesExpanded(!1)));let t=document.getElementById("autojoin-ffa");t&&t.addEventListener("change",()=>{let u=document.getElementById("ffa-config");u&&(u.style.display=t.checked?"block":"none"),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let a=document.getElementById("autojoin-team");a&&a.addEventListener("change",()=>{let u=document.getElementById("team-config");u&&(u.style.display=a.checked?"block":"none"),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let o=document.getElementById("autojoin-hvn");o&&o.addEventListener("change",()=>{this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let r=document.getElementById("autojoin-team-three-times");r&&(r.checked=this.isTeamThreeTimesMinEnabled,r.addEventListener("change",()=>{this.isTeamThreeTimesMinEnabled=r.checked,this.saveSettings(),this.updateUI();let u=document.getElementById("autojoin-team-min-slider"),c=document.getElementById("autojoin-team-max-slider");if(u&&c){let d=parseInt(u.value,10);c.value=this.isTeamThreeTimesMinEnabled?String(Math.min(50,Math.max(1,3*d))):c.value,this.updateSliderRange("autojoin-team-min-slider","autojoin-team-max-slider","autojoin-team-min","autojoin-team-max","team-range-fill","team-min-value","team-max-value")}})),document.getElementById("autojoin-team-select-all")?.addEventListener("click",()=>{this.setAllTeamCounts(!0),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})}),document.getElementById("autojoin-team-deselect-all")?.addEventListener("click",()=>{this.setAllTeamCounts(!1),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let s=["autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7","autojoin-team-duos","autojoin-team-trios","autojoin-team-quads"];for(let u of s)document.getElementById(u)?.addEventListener("change",()=>{this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let n=document.getElementById("autojoin-sound-toggle");n&&n.addEventListener("change",()=>{this.soundEnabled=n.checked,this.saveSettings()});let l=document.getElementById("autojoin-auto-rejoin");l&&l.addEventListener("change",()=>{this.autoRejoinOnClanChange=l.checked,this.saveSettings()})}createUI(){if(document.getElementById("openfront-autojoin-panel"))return;this.panel=document.createElement("div"),this.panel.id="openfront-autojoin-panel",this.panel.className="of-panel autojoin-panel",this.panel.innerHTML=`
      <div class="of-header autojoin-header">
        <div class="autojoin-title">
          <span class="autojoin-title-text">Tactical Auto-Join</span>
          <span class="autojoin-title-sub">HUD ACTIVE</span>
        </div>
      </div>
      <div class="autojoin-body">
        <div class="of-content autojoin-content">
          <div class="autojoin-status-bar">
            <div class="autojoin-status" id="autojoin-status">
              <span class="status-indicator"></span>
              <span class="status-text">Active</span>
              <span class="search-timer" id="search-timer" style="display: none;"></span>
            </div>
            <label class="autojoin-toggle-label">
              <input type="checkbox" id="autojoin-sound-toggle">
              <span>Sound</span>
            </label>
          </div>
          <div class="autojoin-action-row">
            <button type="button" id="autojoin-main-button" class="autojoin-main-button active">Auto-Join</button>
            <button type="button" id="autojoin-clanmate-button" class="autojoin-clanmate-button">Join the game if any member of your clan is in the lobby</button>
          </div>
          <div class="autojoin-modes" id="autojoin-modes">
            <div class="autojoin-modes-rail" aria-hidden="true">
              <span class="autojoin-modes-caret">\u25B8</span>
              <span class="autojoin-modes-label">Modes</span>
              <span class="autojoin-modes-dot"></span>
              <span class="autojoin-modes-dot"></span>
              <span class="autojoin-modes-dot"></span>
            </div>
            <div class="autojoin-modes-body">
              <div class="autojoin-section">
                <div class="autojoin-section-title">Modes</div>
                <div class="autojoin-config-grid">
                <div class="autojoin-mode-config autojoin-config-card">
                  <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-ffa" name="gameMode" value="FFA"><span>FFA</span></label>
                  <div class="autojoin-mode-inner" id="ffa-config" style="display: none;">
                    <div class="player-filter-info"><small>Filter by max players:</small></div>
                    <div class="capacity-range-wrapper">
                      <div class="capacity-range-visual">
                        <div class="capacity-track">
                          <div class="capacity-range-fill" id="ffa-range-fill"></div>
                          <input type="range" id="autojoin-ffa-min-slider" min="1" max="100" value="1" class="capacity-slider capacity-slider-min">
                          <input type="range" id="autojoin-ffa-max-slider" min="1" max="100" value="100" class="capacity-slider capacity-slider-max">
                        </div>
                        <div class="capacity-labels">
                          <div class="capacity-label-group"><label for="autojoin-ffa-min-slider">Min:</label><span class="capacity-value" id="ffa-min-value">Any</span></div>
                          <div class="capacity-label-group"><label for="autojoin-ffa-max-slider">Max:</label><span class="capacity-value" id="ffa-max-value">Any</span></div>
                        </div>
                      </div>
                      <div class="capacity-inputs-hidden">
                        <input type="number" id="autojoin-ffa-min" min="1" max="100" style="display: none;">
                        <input type="number" id="autojoin-ffa-max" min="1" max="100" style="display: none;">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="autojoin-mode-config autojoin-config-card">
                  <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-hvn" name="gameMode" value="HvN"><span>Humans Vs Nations</span></label>
                </div>
                <div class="autojoin-mode-config autojoin-config-card">
                  <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-team" name="gameMode" value="Team"><span>Team</span></label>
                  <div class="autojoin-mode-inner" id="team-config" style="display: none;">
                    <div class="team-count-section">
                      <label>Teams (optional):</label>
                      <div>
                        <button type="button" id="autojoin-team-select-all" class="select-all-btn">Select All</button>
                        <button type="button" id="autojoin-team-deselect-all" class="select-all-btn">Deselect All</button>
                      </div>
                      <div class="team-count-options-centered">
                        <div class="team-count-column">
                          <label><input type="checkbox" id="autojoin-team-duos" value="Duos"> Duos</label>
                          <label><input type="checkbox" id="autojoin-team-trios" value="Trios"> Trios</label>
                          <label><input type="checkbox" id="autojoin-team-quads" value="Quads"> Quads</label>
                        </div>
                        <div class="team-count-column">
                          <label><input type="checkbox" id="autojoin-team-2" value="2"> 2 teams</label>
                          <label><input type="checkbox" id="autojoin-team-3" value="3"> 3 teams</label>
                          <label><input type="checkbox" id="autojoin-team-4" value="4"> 4 teams</label>
                        </div>
                        <div class="team-count-column">
                          <label><input type="checkbox" id="autojoin-team-5" value="5"> 5 teams</label>
                          <label><input type="checkbox" id="autojoin-team-6" value="6"> 6 teams</label>
                          <label><input type="checkbox" id="autojoin-team-7" value="7"> 7 teams</label>
                        </div>
                      </div>
                    </div>
                    <div class="player-filter-info"><small>Filter by players per team:</small></div>
                    <div class="capacity-range-wrapper">
                      <div class="capacity-range-visual">
                        <div class="capacity-track">
                          <div class="capacity-range-fill" id="team-range-fill"></div>
                          <input type="range" id="autojoin-team-min-slider" min="1" max="50" value="1" class="capacity-slider capacity-slider-min">
                          <input type="range" id="autojoin-team-max-slider" min="1" max="50" value="50" class="capacity-slider capacity-slider-max">
                        </div>
                        <div class="capacity-labels">
                          <div class="capacity-label-group"><label for="autojoin-team-min-slider">Min:</label><span class="capacity-value" id="team-min-value">1</span></div>
                          <div class="three-times-checkbox"><label for="autojoin-team-three-times">3\xD7</label><input type="checkbox" id="autojoin-team-three-times"></div>
                          <div class="capacity-label-group"><label for="autojoin-team-max-slider">Max:</label><span class="capacity-value" id="team-max-value">50</span></div>
                        </div>
                      </div>
                      <div class="capacity-inputs-hidden">
                        <input type="number" id="autojoin-team-min" min="1" max="50" style="display: none;">
                        <input type="number" id="autojoin-team-max" min="1" max="50" style="display: none;">
                      </div>
                    </div>
                    <div class="current-game-info" id="current-game-info" style="display: none;"></div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div class="of-footer autojoin-footer">
          <div class="autojoin-settings">
            <label class="autojoin-toggle-label"><input type="checkbox" id="autojoin-auto-rejoin"><span>Auto rejoin on clan tag apply</span></label>
          </div>
        </div>
      </div>
    `;let e=document.getElementById("of-autojoin-slot");e?e.appendChild(this.panel):(console.warn("[AutoJoin] Auto-join slot not found, appending to body"),document.body.appendChild(this.panel)),this.setupEventListeners(),this.setModesExpanded(!1),this.loadUIFromSettings(),this.updateClanmateButtonState(),this.initializeSlider("autojoin-ffa-min-slider","autojoin-ffa-max-slider","autojoin-ffa-min","autojoin-ffa-max","ffa-range-fill","ffa-min-value","ffa-max-value"),this.initializeSlider("autojoin-team-min-slider","autojoin-team-max-slider","autojoin-team-min","autojoin-team-max","team-range-fill","team-min-value","team-max-value"),this.updateUI(),this.syncSearchTimer(),this.startGameInfoUpdates()}updateSleepState(){let e=A.isOnLobbyPage();this.sleeping=!e,this.sleeping?(this.panel.classList.add("hidden"),this.stopTimer(),this.stopGameInfoUpdates()):(this.panel.classList.remove("hidden"),this.syncSearchTimer(),this.startGameInfoUpdates())}cleanup(){this.stopTimer(),this.stopGameInfoUpdates(),this.notificationTimeout&&clearTimeout(this.notificationTimeout),this.panel&&this.panel.parentNode&&this.panel.parentNode.removeChild(this.panel),this.dismissNotification()}};function rt(){if(!document.body){console.warn("[OpenFront Bundle] Body not ready, retrying layout wrapper injection..."),setTimeout(rt,100);return}if(document.getElementById("of-game-layout-wrapper")){console.log("[OpenFront Bundle] Layout wrapper already exists");return}let i=document.body,e=document.createElement("div");e.id="of-game-layout-wrapper";let t=document.createElement("div");for(t.id="of-game-content";i.firstChild;)t.appendChild(i.firstChild);e.appendChild(t),i.appendChild(e);let o=GM_getValue(k.playerListPanelSize)?.width||300;document.documentElement.style.setProperty("--player-list-width",o+"px"),console.log("[OpenFront Bundle] Layout wrapper injected \u2705")}(function(){"use strict";console.log("[OpenFront Bundle] Initializing v2.3.0..."),GM_addStyle(Ee()),console.log("[OpenFront Bundle] Styles injected \u2705"),rt(),K.preloadSounds(),console.log("[OpenFront Bundle] Sound system initialized \u2705"),_.init(),console.log("[OpenFront Bundle] URL observer initialized \u2705"),le.start(),console.log("[OpenFront Bundle] Lobby data manager started \u2705"),Y.fetch(),console.log("[OpenFront Bundle] Clan leaderboard caching started \u2705");let i=new oe;console.log("[OpenFront Bundle] Player list initialized \u2705");let e=new se;console.log("[OpenFront Bundle] Auto-join initialized \u2705"),i.onPlayerListUpdate(t=>{e.handleClanmateUpdate(t)}),le.subscribe(t=>{i.receiveLobbyUpdate(t),e.receiveLobbyUpdate(t)}),console.log("[OpenFront Bundle] Modules subscribed to lobby updates \u2705"),console.log("[OpenFront Bundle] Ready! \u{1F680}")})();})();
