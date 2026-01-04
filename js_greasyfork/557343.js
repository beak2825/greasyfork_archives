// ==UserScript==
// @name         Circle Engine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The Circle Engine is connected to Drawaria.online's stories and is designed for simulations. It's made for the Circle Fairy and it serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://i.ibb.co/YTZLWcNt/circle2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557343/Circle%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557343/Circle%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --- 1. CSS STYLES --- */
    GM_addStyle(`
        #circle-engine-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; display: none; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        #circle-engine-gif { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 150px; height: 150px; cursor: pointer; z-index: 10000; border-radius: 50%; }
        @keyframes circle-float { 0% { transform: translate(-50%, -50%) rotate(0deg) translate(20px) rotate(0deg); } 50% { transform: translate(-50%, -50%) rotate(180deg) translate(25px) rotate(-180deg); } 100% { transform: translate(-50%, -50%) rotate(360deg) translate(20px) rotate(-360deg); } }
        #circle-engine-gif.float { animation: circle-float 15s infinite linear; }
        #circle-engine-menu-container, #options-menu-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; display: none; width: auto; height: auto; max-width: 95vw; max-height: 95vh; }
        #circle-engine-menu-container svg, #options-menu-container svg { display: block; width: 900px; height: auto; max-width: 100%; }
        #game-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10001; display: none; background: #050a05; }
        #game-iframe { border: none; width: 100%; height: 100%; display: block; }
        #options, .btn-group { cursor: pointer; }
        .back-button-svg { position: fixed; top: 20px; left: 20px; width: 50px; height: 50px; cursor: pointer; z-index: 10002; fill: #4fffa8; transition: fill 0.3s, filter 0.3s; display: none; }
        .back-button-svg:hover { fill: #ccffdd; filter: drop-shadow(0 0 5px #4fffa8); }
    `);

    /* --- 2. GAME CODES (Simulaciones) --- */
    const GAMES = {
        gravity_well: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><div style="position:absolute;top:20px;left:20px;color:#4fffa8;border:1px solid #4fffa8;padding:10px;border-radius:20px;font-family:sans-serif">GRAVITY WELL</div><canvas id="c"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d');let w,h,p=[],m={x:0,y:0,a:0};function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();window.onmousemove=e=>{m.x=e.clientX;m.y=e.clientY;m.a=1};window.onmousedown=()=>{p.forEach(o=>{let dx=o.x-m.x,dy=o.y-m.y,d=Math.hypot(dx,dy),an=Math.atan2(dy,dx),f=Math.random()*30+10;o.vx+=Math.cos(an)*f;o.vy+=Math.sin(an)*f})};class P{constructor(){this.init()}init(){this.x=Math.random()*w;this.y=Math.random()*h;this.vx=(Math.random()-.5)*2;this.vy=(Math.random()-.5)*2;this.s=Math.random()*2+1}u(){if(m.a){let dx=m.x-this.x,dy=m.y-this.y,d=Math.hypot(dx,dy);if(d<5000){let f=1000/(d*d+100),an=Math.atan2(dy,dx);this.vx+=Math.cos(an)*f;this.vy+=Math.sin(an)*f}}this.vx*=.96;this.vy*=.96;this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>w)this.vx*=-1;if(this.y<0||this.y>h)this.vy*=-1}d(){x.beginPath();x.arc(this.x,this.y,this.s,0,7);x.fillStyle='#4fffa8';x.fill()}}for(let i=0;i<400;i++)p.push(new P());function a(){x.fillStyle='rgba(5,10,5,0.2)';x.fillRect(0,0,w,h);p.forEach(o=>{o.u();o.d()});requestAnimationFrame(a)}a()<\/script></body></html>`,

        neural_grid: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><div style="position:absolute;top:20px;left:20px;color:#4fffa8;border:1px solid #4fffa8;padding:10px;border-radius:20px;font-family:sans-serif">NEURAL GRID</div><canvas id="c"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d');let w,h,p=[],m={x:null,y:null};function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();window.onmousemove=e=>{m.x=e.clientX;m.y=e.clientY};class P{constructor(){this.x=Math.random()*w;this.y=Math.random()*h;this.vx=(Math.random()-.5);this.vy=(Math.random()-.5)}u(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>w)this.vx*=-1;if(this.y<0||this.y>h)this.vy*=-1;if(m.x){let dx=m.x-this.x,dy=m.y-this.y,d=Math.hypot(dx,dy);if(d<100){this.vx-=dx/d*0.05;this.vy-=dy/d*0.05}}}d(){x.beginPath();x.arc(this.x,this.y,2,0,7);x.fillStyle='#4fffa8';x.fill()}}for(let i=0;i<100;i++)p.push(new P());function a(){x.clearRect(0,0,w,h);p.forEach(i=>{i.u();i.d();p.forEach(j=>{let dx=i.x-j.x,dy=i.y-j.y,d=dx*dx+dy*dy;if(d<22500){x.strokeStyle=\`rgba(79,255,168,\${1-d/22500})\`;x.beginPath();x.moveTo(i.x,i.y);x.lineTo(j.x,j.y);x.stroke()}});if(m.x){let dx=i.x-m.x,dy=i.y-m.y,d=dx*dx+dy*dy;if(d<62500){x.strokeStyle=\`rgba(79,255,168,\${1-d/62500})\`;x.beginPath();x.moveTo(i.x,i.y);x.lineTo(m.x,m.y);x.stroke()}}});requestAnimationFrame(a)}a()<\/script></body></html>`,

        audio_flux: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05;display:flex;justify-content:center;align-items:center;height:100vh"><button id="b" style="z-index:9;background:0;color:#4fffa8;border:2px solid #4fffa8;padding:15px;font-size:20px;border-radius:50px;cursor:pointer">INIT AUDIO</button><canvas id="c" style="position:absolute;top:0;left:0"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d'),b=document.getElementById('b');let w,h,ac,an,da;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();b.onclick=async()=>{ac=new(window.AudioContext||window.webkitAudioContext)();const s=await navigator.mediaDevices.getUserMedia({audio:true});an=ac.createAnalyser();ac.createMediaStreamSource(s).connect(an);an.fftSize=256;da=new Uint8Array(an.frequencyBinCount);b.remove();l()};function l(){requestAnimationFrame(l);x.fillStyle='rgba(5,10,5,0.2)';x.fillRect(0,0,w,h);an.getByteFrequencyData(da);let cx=w/2,cy=h/2,rad=100,len=da.length,step=(Math.PI*2)/len;for(let i=0;i<len;i++){let v=da[i],bh=(v/255)*200,ang=i*step;x.strokeStyle=\`hsl(140,100%,\${50+v/5}%)\`;x.lineWidth=2;x.save();x.translate(cx,cy);x.rotate(ang);x.beginPath();x.moveTo(0,rad);x.lineTo(0,rad+bh);x.stroke();x.restore()}let avg=da.reduce((a,b)=>a+b)/len;x.beginPath();x.arc(cx,cy,rad-5+avg/10,0,7);x.strokeStyle='#4fffa8';x.stroke()}<\/script></body></html>`,

        boid_swarm: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><canvas id="c"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d');let w,h,b=[],m={x:-999,y:-999};function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();window.onmousemove=e=>{m.x=e.clientX;m.y=e.clientY};class B{constructor(){this.x=Math.random()*w;this.y=Math.random()*h;this.vx=Math.random()*4-2;this.vy=Math.random()*4-2;this.h=[]}u(){let cx=0,cy=0,n=0,ax=0,ay=0,sx=0,sy=0;b.forEach(o=>{let d=Math.hypot(this.x-o.x,this.y-o.y);if(o!==this&&d<70){cx+=o.x;cy+=o.y;ax+=o.vx;ay+=o.vy;n++;if(d<20){sx+=this.x-o.x;sy+=this.y-o.y}}});if(n){this.vx+=(cx/n-this.x)*.005+(ax/n-this.vx)*.05;this.vy+=(cy/n-this.y)*.005+(ay/n-this.vy)*.05}this.vx+=sx*.05;this.vy+=sy*.05;let md=Math.hypot(this.x-m.x,this.y-m.y);if(md<150){this.vx+=(this.x-m.x)/md*2;this.vy+=(this.y-m.y)/md*2}let sp=Math.hypot(this.vx,this.vy);if(sp>4){this.vx=this.vx/sp*4;this.vy=this.vy/sp*4}this.x+=this.vx;this.y+=this.vy;if(this.x<100)this.vx+=1;if(this.x>w-100)this.vx-=1;if(this.y<100)this.vy+=1;if(this.y>h-100)this.vy-=1;this.h.push({x:this.x,y:this.y});if(this.h.length>10)this.h.shift()}d(){let a=Math.atan2(this.vy,this.vx);x.beginPath();x.moveTo(this.h[0].x,this.h[0].y);this.h.forEach(p=>x.lineTo(p.x,p.y));x.strokeStyle='rgba(79,255,168,0.2)';x.stroke();x.save();x.translate(this.x,this.y);x.rotate(a);x.fillStyle='#4fffa8';x.beginPath();x.moveTo(10,0);x.lineTo(-5,-5);x.lineTo(-5,5);x.fill();x.restore()}}for(let i=0;i<250;i++)b.push(new B());function l(){x.fillStyle='rgba(5,10,5,0.3)';x.fillRect(0,0,w,h);b.forEach(o=>{o.u();o.d()});requestAnimationFrame(l)}l()<\/script></body></html>`,

        matrix_rain: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><canvas id="c"></canvas><script>const c=document.getElementById('c'),ctx=c.getContext('2d');let w,h,l=[];const ch='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;l=[new L(10,.25,'rgba(15,56,30,0.6)'),new L(16,.5,'rgba(38,133,76,0.8)'),new L(24,.9,'#4fffa8')]}window.onresize=r;class L{constructor(s,v,k){this.s=s;this.v=v;this.k=k;this.c=Math.ceil(window.innerWidth/s);this.d=new Array(this.c).fill(0).map(()=>Math.random()*-100)}draw(){ctx.font=this.s+'px monospace';for(let i=0;i<this.d.length;i++){let t=ch[Math.floor(Math.random()*ch.length)],x=i*this.s,y=this.d[i]*this.s;ctx.fillStyle=Math.random()>.98?'#fff':this.k;ctx.fillText(t,x,y);if(y>h&&Math.random()>.975)this.d[i]=0;this.d[i]+=this.v}}}r();function a(){ctx.fillStyle='rgba(5,10,5,0.2)';ctx.fillRect(0,0,w,h);l.forEach(o=>o.draw());requestAnimationFrame(a)}a()<\/script></body></html>`,

        fluid_neon: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><div style="position:absolute;top:20px;color:#4fffa8;width:100%;text-align:center">DRAG TO INJECT FLUID</div><canvas id="c"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d');let w,h,res=80,sz,den,vx,vy;function ix(i,j){return i+(res+2)*j}function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;sz=(res+2)**2;den=new Float32Array(sz);vx=new Float32Array(sz);vy=new Float32Array(sz)}window.onresize=r;r();let mx=0,my=0,md=0;window.onmousemove=e=>{let sc=Math.max(w,h)/res,cx=Math.floor(e.clientX/sc),cy=Math.floor(e.clientY/sc);if(cx>1&&cx<res&&cy>1&&cy<res){let ax=(e.clientX-mx)*.5,ay=(e.clientY-my)*.5;let i=ix(cx,cy);vx[i]+=ax;vy[i]+=ay;den[i]+=md?500:20}mx=e.clientX;my=e.clientY};window.onmousedown=()=>md=1;window.onmouseup=()=>md=0;function slv(b,x,x0,a,c){for(let k=0;k<4;k++){for(let j=1;j<=res;j++){for(let i=1;i<=res;i++){x[ix(i,j)]=(x0[ix(i,j)]+a*(x[ix(i+1,j)]+x[ix(i-1,j)]+x[ix(i,j+1)]+x[ix(i,j-1)]))/c}}}}function st(){let dt=0.2,ds=0,vs=0;slv(1,vx,vx,vs,1+4*vs);slv(2,vy,vy,vs,1+4*vs);slv(0,den,den,ds,1+4*ds)}function dr(){for(let i=0;i<sz;i++)den[i]*=.99;x.clearRect(0,0,w,h);let cw=w/res,ch=h/res;for(let j=1;j<=res;j++){for(let i=1;i<=res;i++){let d=den[ix(i,j)];if(d>0.1){x.fillStyle=\`rgba(\${79+(125)*(d/255)},255,\${168+(53)*(d/255)},\${d/100})\`;x.fillRect((i-1)*cw,(j-1)*ch,cw+1,ch+1)}}}}function a(){st();dr();requestAnimationFrame(a)}a()<\/script></body></html>`,

        retro_horizon: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#020502"><canvas id="c"></canvas><script>const c=document.getElementById('c'),ctx=c.getContext('2d');let w,h,oz=0;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();function g(x,z){return(Math.sin(x*.05)+Math.sin(z*.025)*.5)*Math.abs(x)*1.5}function a(){ctx.fillStyle='#020502';ctx.fillRect(0,0,w,h);oz+=15;let cy=h*.4;ctx.fillStyle='#0f381e';ctx.fillRect(0,0,w,cy);ctx.fillStyle='#ccffdd';ctx.beginPath();ctx.arc(w/2,cy-50,60,0,7);ctx.fill();for(let z=0;z<3000;z+=80){let cz=z-(oz%80);if(cz<10)continue;let sc=600/cz,fog=Math.min(cz/3000,1);ctx.globalAlpha=1-fog*fog;ctx.strokeStyle='#4fffa8';ctx.beginPath();for(let x=-2000;x<=2000;x+=80){let y=g(x,z+oz),px=w/2+x*sc,py=cy+(y+100)*sc;x===-2000?ctx.moveTo(px,py):ctx.lineTo(px,py)}ctx.stroke()}requestAnimationFrame(a)}a()<\/script></body></html>`,

        chaos_pendulum: `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#050a05"><div style="position:absolute;bottom:20px;width:100%;text-align:center;color:#26854c">CLICK TO RESET</div><canvas id="c"></canvas><script>const c=document.getElementById('c'),x=c.getContext('2d');let w,h,r1=150,r2=150,m1=20,m2=20,a1=1.5,a2=1.5,v1=0,v2=0,g=1,pth=[];function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.onresize=r;r();window.onmousedown=()=>{a1=Math.PI/2+Math.random()-.5;a2=Math.PI/2+Math.random()*2-1;v1=0;v2=0;pth=[];x.fillStyle='#050a05';x.fillRect(0,0,w,h)};function a(){x.fillStyle='rgba(5,10,5,0.05)';x.fillRect(0,0,w,h);let n1=-g*(2*m1+m2)*Math.sin(a1)-m2*g*Math.sin(a1-2*a2)-2*Math.sin(a1-a2)*m2*(v2*v2*r2+v1*v1*r1*Math.cos(a1-a2)),d1=r1*(2*m1+m2-m2*Math.cos(2*a1-2*a2)),ac1=n1/d1,n2=2*Math.sin(a1-a2)*(v1*v1*r1*(m1+m2)+g*(m1+m2)*Math.cos(a1)+v2*v2*r2*m2*Math.cos(a1-a2)),d2=r2*(2*m1+m2-m2*Math.cos(2*a1-2*a2)),ac2=n2/d2;v1+=ac1;v2+=ac2;a1+=v1;a2+=v2;v1*=.999;v2*=.999;let x1=r1*Math.sin(a1),y1=r1*Math.cos(a1),x2=x1+r2*Math.sin(a2),y2=y1+r2*Math.cos(a2),cx=w/2,cy=h/3;x.strokeStyle='#26854c';x.lineWidth=4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+x1,cy+y1);x.stroke();x.beginPath();x.moveTo(cx+x1,cy+y1);x.lineTo(cx+x2,cy+y2);x.stroke();if(pth.length){x.strokeStyle='#ccffdd';x.lineWidth=1;x.beginPath();x.moveTo(pth[pth.length-1].x,pth[pth.length-1].y);x.lineTo(cx+x2,cy+y2);x.stroke()}pth.push({x:cx+x2,y:cy+y2});if(pth.length>500)pth.shift();requestAnimationFrame(a)}a()<\/script></body></html>`
    };

    /* --- 3. SVG ASSETS --- */
    // Main Menu SVG (Cleaned and Minified)
    const MAIN_MENU_SVG = `
    <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 992.774 615.882" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
      <feOffset dx="10" dy="10"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl" type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.3)"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #3aff45b3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#3aff45b3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 0 0 4 0.5 #2fcc574d" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-2" type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#2fcc574d"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 0 0 10 1 #b2f56f4d" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-2" type="linear" slope="2"/>
      </feComponentTransfer>
      <feFlood flood-color="#b2f56f4d"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="drop-shadow-filter-4" bx:preset="drop-shadow 1 2 2 8 0.5 #446940" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="2" dy="2"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-4" type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#446940"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="inner-shadow-filter-1" bx:preset="inner-shadow 1 0 0 1 0.5 #9ae0a1b3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="1"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#9ae0a1b3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <style bx:fonts="Allan">@import url(https://fonts.googleapis.com/css2?family=Allan%3Aital%2Cwght%400%2C400%3B0%2C700&amp;display=swap);</style>
    <filter id="inner-shadow-filter-2" bx:preset="inner-shadow 1 0 0 1 0.5 #31de41b3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="1"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#31de41b3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-3" bx:preset="drop-shadow 1 2 2 8 0.5 #25ff0b" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="2" dy="2"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-2" type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#25ff0b"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <bx:export>
      <bx:file format="png" path="nice-menu.png"/>
    </bx:export>
  </defs>
  <g transform="matrix(1, 0, 0, 1, -171.533112, -17.744804)">
    <g>
      <rect x="389.538" y="175.566" width="203.392" height="274.236" rx="16" ry="16" style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="519.228" cy="312.685" rx="109.123" ry="77.7"/>
      <rect x="-947.16" y="183.564" width="203.392" height="274.236" rx="16" ry="16" style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="-823.17" cy="309.256" rx="109.123" ry="77.7" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <path d="M 513.195 -507.592 Q 582.364 -570.96 651.534 -507.592 L 651.534 -507.592 Q 720.703 -444.224 582.364 -444.224 L 582.364 -444.224 Q 444.025 -444.224 513.195 -507.592 Z" bx:shape="triangle 444.025 -570.96 276.678 126.736 0.5 0.5 1@3613984d" style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 684.556 -505.132 Q 753.726 -568.5 822.895 -505.132 L 822.895 -505.132 Q 892.065 -441.764 753.726 -441.764 L 753.726 -441.764 Q 615.387 -441.764 684.556 -505.132 Z" bx:shape="triangle 615.387 -568.5 276.678 126.736 0.5 0.5 1@91351a26" style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156); transform-origin: 660.905px 494.601px;" cx="660.905" cy="494.601" rx="109.123" ry="77.7" transform="matrix(-0.008488, 0.999964, 0.999964, 0.008488, 6.248012, -52.657651)"/>
      <path d="M 466.474 161.652 H 870.32 V 161.652 H 870.32 V 471.481 H 870.32 V 471.481 H 466.474 V 471.481 H 466.474 V 161.652 H 466.474 V 161.652 Z" bx:shape="rect 466.474 161.652 403.846 309.829 3 0 0 2@8fc35c37" style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <ellipse style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" cx="672.916" cy="140.773" rx="213.676" ry="95.983"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="476.38" cy="170.139" rx="42.278" ry="42.278"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="470.095" cy="460.944" rx="40.564" ry="38.279"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="858.597" cy="168.425" rx="45.135" ry="40.564"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="874.594" cy="462.087" rx="39.421" ry="39.421"/>
      <ellipse style="fill: rgb(223, 255, 214); filter: url(&quot;#drop-shadow-filter-2&quot;); stroke: rgba(0, 0, 0, 0.533);" cx="675.187" cy="132.253" rx="119.279" ry="29.185"/>
      <text style="fill: rgb(36, 148, 26); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(&quot;#drop-shadow-filter-3&quot;) url(&quot;#inner-shadow-filter-2&quot;);" transform="matrix(1.700075, 0, 0, 1.466093, 142.412292, -24.106621)" x="258.793" y="115.282">Circle Engine</text>
    </g>
    <g id="options" transform="matrix(1, 0, 0, 1, -493.635803, 65.783569)">
      <rect x="989.52" y="202.712" width="346.246" height="118.154" rx="16" ry="16" style="stroke-width: 3.02405; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); vector-effect: non-scaling-stroke; fill: rgb(91, 169, 91);"/>
      <text style="fill: rgb(155, 248, 147); font-family: Allan; font-size: 28px; stroke-width: 8.12016px; white-space: pre; filter: url(&quot;#drop-shadow-filter-4&quot;) url(&quot;#inner-shadow-filter-1&quot;); vector-effect: non-scaling-stroke;" transform="matrix(3.455854, 0, 0, 2.772238, 151.857712, -32.534061)" x="258.793" y="115.282">Options</text>
    </g>
    <animate attributeName="display" values="none;inline" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1" begin="-0.05s"/>
  </g>
  <g>
    <g transform="matrix(1, 0, 0, 1, 321.686768, 120.6744)">
      <ellipse style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" cx="176.978" cy="123.873" rx="93.697" ry="51.419"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="176.978" cy="123.873" rx="62.276" ry="22.85"/>
      <animateMotion path="M 0 0 L -0.554 -118.299" calcMode="linear" begin="0s" dur="2s" fill="freeze"/>
    </g>
    <g transform="matrix(1, 0, 0, 1, 328.69577, -136.9776)">
      <ellipse style="fill: rgb(30, 68, 30); stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" cx="169.969" cy="488.08" rx="103.41" ry="51.991"/>
      <ellipse style="stroke-width: 4px; stroke: rgb(156, 253, 155); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); fill: rgb(159, 252, 156);" cx="169.969" cy="488.08" rx="62.276" ry="22.85"/>
      <animateMotion path="M 0 0 L 1.418 92.667" calcMode="linear" begin="0s" dur="2s" fill="freeze"/>
    </g>
    <animate attributeName="opacity" values="1;0" begin="1.5s" dur="2s" fill="freeze" keyTimes="0; 1"/>
  </g>
</svg>`;

    // Options Menu SVG (Cyber-HUD)
    const OPTIONS_MENU_SVG = `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="background-color:rgba(5,10,5,0.9); font-family: 'Segoe UI', sans-serif;">
      <defs>
        <filter id="neon-glow"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="btn-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0f381e"/><stop offset="100%" style="stop-color:#001a0d"/></linearGradient>
      </defs>
      <style>.btn-group { cursor: pointer; transition: all 0.3s ease; } .btn-shape { fill: url(#btn-grad); stroke: #4fffa8; stroke-width: 2; rx: 10; } .btn-text { fill: #ccffdd; font-size: 14px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; letter-spacing: 1px; } .btn-group:hover .btn-shape { stroke: #fff; filter: url(#neon-glow); } .btn-group:hover .btn-text { fill: #fff; }</style>
      <text x="400" y="50" fill="#4fffa8" font-size="30" text-anchor="middle" font-weight="bold" filter="url(#neon-glow)">SIMULATIONS</text>
      <g transform="translate(220, 100)">
        <a href="gravity_well"><g class="btn-group"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">GRAVITY WELL</text></g></a>
        <a href="neural_grid"><g class="btn-group" transform="translate(0, 60)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">NEURAL GRID</text></g></a>
        <a href="audio_flux"><g class="btn-group" transform="translate(0, 120)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">AUDIO FLUX</text></g></a>
        <a href="boid_swarm"><g class="btn-group" transform="translate(0, 180)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">BOID SWARM</text></g></a>
      </g>
      <g transform="translate(580, 100)">
        <a href="matrix_rain"><g class="btn-group"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">MATRIX RAIN 2.0</text></g></a>
        <a href="fluid_neon"><g class="btn-group" transform="translate(0, 60)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">FLUID NEON</text></g></a>
        <a href="retro_horizon"><g class="btn-group" transform="translate(0, 120)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">RETRO HORIZON</text></g></a>
        <a href="chaos_pendulum"><g class="btn-group" transform="translate(0, 180)"><rect x="-140" y="0" width="280" height="40" class="btn-shape"/><text x="0" y="20" class="btn-text">CHAOS PENDULUM</text></g></a>
      </g>
    </svg>`;

    /* --- 4. ENGINE LOGIC --- */
    const audioStartup = new Audio('https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3');
    const audioClick = new Audio('https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3');

    function playClick() { if(!audioClick.paused){audioClick.pause();audioClick.currentTime=0} audioClick.play().catch(e=>{}); }

    function hideAll() {
        ['circle-engine-overlay', 'circle-engine-menu-container', 'options-menu-container', 'game-container', 'game-back-button', 'options-back-button'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = 'none';
        });
    }

    function showMenu(id) {
        hideAll();
        document.getElementById('circle-engine-overlay').style.display = 'block';
        document.getElementById(id).style.display = 'block';
        if(id === 'options-menu-container') document.getElementById('options-back-button').style.display = 'block';
    }

    function showGame(gameKey) {
        hideAll();
        document.getElementById('circle-engine-overlay').style.display = 'block';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('game-back-button').style.display = 'block';
        const iframe = document.getElementById('game-iframe');
        iframe.srcdoc = GAMES[gameKey] || '<h1 style="color:white">Game not found</h1>';
    }

    function initEngine() {
        const createDiv = (id, html) => {
            const d = document.createElement('div');
            d.id = id;
            if(html) d.innerHTML = html;
            document.body.appendChild(d);
            return d;
        };

        createDiv('circle-engine-overlay');

        const gif = document.createElement('img');
        gif.id = 'circle-engine-gif';
        gif.src = 'https://i.ibb.co/YTZLWcNt/circle2.gif';
        gif.className = 'float';
        document.body.appendChild(gif);

        createDiv('circle-engine-menu-container', MAIN_MENU_SVG);
        createDiv('options-menu-container', OPTIONS_MENU_SVG);
        createDiv('game-container', '<iframe id="game-iframe" allowfullscreen></iframe>');

        // SVG Buttons (Back)
        const backIconPath = '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>';

        const gameBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        gameBack.id = 'game-back-button';
        gameBack.classList.add('back-button-svg');
        gameBack.setAttribute('viewBox', '0 0 24 24');
        gameBack.innerHTML = backIconPath;
        gameBack.onclick = () => { playClick(); document.getElementById('game-iframe').srcdoc=''; showMenu('options-menu-container'); };
        document.body.appendChild(gameBack);

        const optBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        optBack.id = 'options-back-button';
        optBack.classList.add('back-button-svg');
        optBack.setAttribute('viewBox', '0 0 24 24');
        optBack.innerHTML = backIconPath;
        optBack.onclick = () => { playClick(); showMenu('circle-engine-menu-container'); };
        document.body.appendChild(optBack);

        // Interaction Logic
        gif.onclick = () => {
            gif.style.display = 'none';
            gif.classList.remove('float');
            audioStartup.play().catch(()=>{});
            showMenu('circle-engine-menu-container');
        };

        // Attach Events to SVG elements after render
        setTimeout(() => {
            // Main Menu "Options" Button
            const optBtn = document.getElementById('options');
            if(optBtn) optBtn.onclick = () => { playClick(); showMenu('options-menu-container'); };

            // Options Menu Game Buttons
            const optContainer = document.getElementById('options-menu-container');
            const links = optContainer.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                link.removeAttribute('href'); // Disable default link
                link.onclick = (e) => {
                    e.preventDefault();
                    playClick();
                    showGame(href);
                };
            });
        }, 500);
    }

    if (document.body) initEngine();
    else document.addEventListener('DOMContentLoaded', initEngine);

})();