// ==UserScript==
// @name         N1 Crosshair better! 2.0 (Memory)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Static crosshair with save (readable version)
// @author       Beaverite
// @match        https://narrow.one/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548144/N1%20Crosshair%20better%21%2020%20%28Memory%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548144/N1%20Crosshair%20better%21%2020%20%28Memory%29.meta.js
// ==/UserScript==

(() => {
  const KEY = "n1-cross";
  const L = () => JSON.parse(localStorage.getItem(KEY) || "{}");
  const S = v => localStorage.setItem(KEY, JSON.stringify(v));
  GM_addStyle(`
    #ch {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .l {
      position: absolute;
      transform: translate(-50%, -50%);
    }
    #chp {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #111b;
      backdrop-filter: blur(5px);
      border: 1px solid #59f6;
      z-index: 9999;
      padding: 10px;
      border-radius: 8px;
      display: none;
      color: #def;
      font: 14px sans-serif;
    }
    #chp input { flex: 1 }
  `);
  const init = () => {
    if (document.getElementById("ch")) return;
    const st = L();
    const c = document.createElement("div");
    c.id = "ch";
    document.body.appendChild(c);
    const p = document.createElement("div");
    p.id = "chp";
    p.innerHTML = `
      <div>
        <label>Tail 
          <input type="range" id="t" min="0" max="100" value="${st.t || 10}">
        </label>
        <span id="tv">${st.t || 10}</span>
      </div>
      <div>
        <label>Head 
          <input type="range" id="h" min="0" max="100" value="${st.h || 20}">
        </label>
        <span id="hv">${st.h || 20}</span>
      </div>
      <div>
        <label>Thk 
          <input type="range" id="k" min="1" max="10" value="${st.k || 2}">
        </label>
        <span id="kv">${st.k || 2}</span>
      </div>
      <div>
        <label>Col 
          <input type="color" id="clr" value="${st.c || "#fff"}">
        </label>
      </div>
    `;
    document.body.appendChild(p);
    const t   = p.querySelector("#t"),
          h   = p.querySelector("#h"),
          k   = p.querySelector("#k"),
          clr = p.querySelector("#clr"),
          tv  = p.querySelector("#tv"),
          hv  = p.querySelector("#hv"),
          kv  = p.querySelector("#kv");
    const draw = () => {
      let v = { t:+t.value, h:+h.value, k:+k.value, c:clr.value };
      S(v);
      c.innerHTML = "";
      const mk = (w,h,x,y) => {
        let d = document.createElement("div");
        d.className = "l";
        d.style.cssText = `
          width:${w}px;
          height:${h}px;
          left:${x}px;
          top:${y}px;
          background:${v.c};
        `;
        return d;
      };
      c.appendChild(mk(v.h-v.t, v.k, -(v.t+(v.h-v.t)/2), 0));
      c.appendChild(mk(v.h-v.t, v.k,  (v.t+(v.h-v.t)/2), 0));
      c.appendChild(mk(v.k, v.h-v.t, 0, -(v.t+(v.h-v.t)/2)));
      c.appendChild(mk(v.k, v.h-v.t, 0,  (v.t+(v.h-v.t)/2)));
      tv.textContent = t.value;
      hv.textContent = h.value;
      kv.textContent = k.value;
    };
    [t,h,k,clr].forEach(i => i.addEventListener("input", draw));
    draw();
    let show = 0;
    document.addEventListener("keydown", e => {
      if (e.key == "F8") {
        show ^= 1;
        p.style.display = show ? "block" : "none";
      }
    });
  };
  document.readyState == "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

// ..+---+
// ./ R /|
// +---+ |
// | I | +
// | P |/.
// +---+..
//R.I.P
//Concise panel