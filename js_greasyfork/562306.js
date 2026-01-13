// ==UserScript==
// @name         Moomoo Radar
// @namespace    https://www.youtube.com/@x-RedDragonOficial
// @version      1.2
// @description  Real-time radar overlay for moomoo.io showing all players, distinguishing allies and enemies. Created by x-RedDragonOficial — give credit if used in other scripts.
// @author       x-RedDragon
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562306/Moomoo%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/562306/Moomoo%20Radar.meta.js
// ==/UserScript==

(function(){const _=['WebSocket','addEventListener','message','decode','Map','has','get','set','clear','createElement','appendChild','remove','querySelectorAll','requestAnimationFrame','hypot','atan2','PI','cos','sin','innerWidth','innerHeight','style','transform','opacity','display','borderColor','left','top','getElementById','body','fixed','0','100%','none','10px 0 10px 20px','#00ff00','#ff0000','radar-layer','r-','px','rotate(','deg)'];const $=i=>_[i];let M=new Map(),I=null,L=null;function G(){if(L)return L;L=document[$(9)]('div');L.id=$(38);let s=L[$(21)];s.position=$(30);s.left=$(31);s.top=$(31);s.width=$(32);s.height=$(32);s.pointerEvents=$(33);let u=document[$(28)]('mainMenu'),z=50;if(u){let v=parseInt(getComputedStyle(u).zIndex);if(!isNaN(v))z=v-1}s.zIndex=z;document[$(29)][$(10)](L);return L}const W=window[$(0)];window[$(0)]=new Proxy(W,{construct(t,a){const w=new t(...a);w.binaryType='arraybuffer';w[$(1)]($(2),e=>{if(!(e.data instanceof ArrayBuffer))return;const d=msgpack[$(3)](e.data);if(d[0]==='C')I=d[1][0];else if(d[0]==='a'){M[$(8)]();const r=d[1][0];for(let i=0;i<r.length;i+=13)M[$(7)](r[i],{x:r[i+1],y:r[i+2],c:r[i+7]})}});return w}});function A(id){let e=document[$(28)]($(39)+id);if(!e){e=document[$(9)]('div');e.id=$(39)+id;let s=e[$(21)];s.position=$(30);s.width=$(31);s.height=$(31);s.borderStyle='solid';s.borderWidth=$(34);s.zIndex='1';G()[$(10)](e)}return e}function R(){requestAnimationFrame(R);if(!M[$(5)](I))return;const m=M[$(6)](I),cx=window[$(19)]/2,cy=window[$(20)]/2;for(const [i,p] of M){if(i===I)continue;const a=A(i),st=a[$(21)],ang=Math[$(15)](p.y-m.y,p.x-m.x),al=Math.min(Math[$(14)](p.x-m.x,p.y-m.y)/600,1);st[$(24)]='block';st[$(23)]=al;st[$(22)]=$(42)+(ang*180/Math[$(16)])+$(43);st[$(26)]=(cx+Math[$(17)](ang)*cy*al)+$(41);st[$(27)]=(cy+Math[$(18)](ang)*cy*al)+$(41);st[$(25)]=p.c&&p.c===m.c?'transparent transparent transparent '+$(35):'transparent transparent transparent '+$(36)}document[$(12)]('[id^="'+$(39)+'"]').forEach(e=>{const i=+e.id.slice(2);M[$(5)](i)||e[$(11)]()})}R()})();
