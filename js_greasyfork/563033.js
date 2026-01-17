// ==UserScript==
// @name         MineFun Cheat Detector
// @match        *://minefun.io/
// @grant        none
// @description  Discord helper :)
// @version       1.2
// @license       MIT
// @namespace https://greasyfork.org/users/1541228
// @downloadURL https://update.greasyfork.org/scripts/563033/MineFun%20Cheat%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/563033/MineFun%20Cheat%20Detector.meta.js
// ==/UserScript==

(() => {
  const SPEED = 2.3;
  const P = new Map(), C = new Set();

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:999999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  addEventListener('resize', resize); resize();
  const center = () => ({ x: innerWidth/2, y: innerHeight/2 });

  const WS = WebSocket;
  window.WebSocket = function(...a){
    const ws = new WS(...a);
    ws.addEventListener('message', e=>{
      if(typeof e.data!=='string') return;
      let d; try{ d=JSON.parse(e.data) }catch{return;}
      if(!Array.isArray(d.players)) return;

      const now = performance.now();
      ctx.clearRect(0,0,canvas.width,canvas.height);

      for(const p of d.players){
        if(p.id==null||p.x==null||p.y==null) continue;
        if(!P.has(p.id)){ P.set(p.id,{x:p.x,y:p.y,t:now}); continue; }
        const s = P.get(p.id), dt = (now-s.t)/1000;
        if(dt>0&&dt<1){
          if(Math.hypot(p.x-s.x,p.y-s.y)/dt > SPEED) C.add(p.id);
        }
        let color = '#00ffff';
        if(C.has(p.id)) color='#ff0000';
        if(p.visible===false) color='#8000ff';
        const m = center();
        ctx.strokeStyle=color;
        ctx.beginPath();
        ctx.moveTo(m.x,m.y);
        ctx.lineTo(p.x,p.y);
        ctx.stroke();
        s.x=p.x; s.y=p.y; s.t=now;
      }
    });
    return ws;
  };
})();