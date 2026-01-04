// ==UserScript==
// @name         Wplace Auto Fill Helper (Preview + Auto Draw + Calibrate)
// @namespace    http://tampermonkey.net/
// @version      0.44
// @description  上传图片 -> 预览(调色板映射) -> TL/Px起点定位 -> 自动逐像素填充（带冷却/暂停/日志；修复 MouseEvent；缩放稳定位）
// @author       You
// @match        https://wplace.live/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548758/Wplace%20Auto%20Fill%20Helper%20%28Preview%20%2B%20Auto%20Draw%20%2B%20Calibrate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548758/Wplace%20Auto%20Fill%20Helper%20%28Preview%20%2B%20Auto%20Draw%20%2B%20Calibrate%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /****************** 默认参数 ******************/
  const DEFAULTS = {
    width: 32,
    height: 32,
    cooldownSec: 5,
    pixelSize: 12, // 仅作回退用；使用TL/Px映射后不再依赖它
    canvasSelector: '',
    paletteBtnSelector: '',
    alphaThreshold: 128
  };

  // 🎨 调色板（可按需补全/替换）
  const paletteHex = [
    "#000000","#3c3c3c","#787878","#d2d2d2","#ffffff",
    "#600018","#ed1c24","#ff7f27","#f6aa09","#f9dd3b",
    "#fffabc","#0eb968","#13e67b","#87ff5e","#0c816e",
    "#10aea6","#13e1be","#28509e","#4093e4","#60f7f2",
    "#6b50f6","#99b1fb","#780c99","#aa38b9","#e09ff9",
    "#cb007a","#ec1f80","#f38da9","#684634","#95682a","#f8b277",
    "#ffaec9","#c3916e","#00bcd4","#dc143c","#ff1493","#ff4500","#9932cc",
    "#228b22","#4169e1","#d2691e","#9370db","#2e8b57","#4682b4","#ff6347",
    "#dda0dd","#daa520","#66cdaa","#6a5acd","#cd853f","#da70d6","#f08080",
    "#0000cd","#e9967a","#3cb371","#00ced1","#bc8f8f","#5f9ea0","#bdb76b",
    "#ba55d3","#f4a460","#778899","#98fb98"
  ];

  /****************** 工具方法 ******************/
  const SKEY = 'wplace_helper_settings_v044';
  const hexToRgb = hex => {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0,2),16),
      parseInt(h.slice(2,4),16),
      parseInt(h.slice(4,6),16),
    ];
  };
  const palette = paletteHex.map(hexToRgb);

  const dist2 = (r1,g1,b1,r2,g2,b2) => {
    const dr=r1-r2, dg=g1-g2, db=b1-b2;
    return dr*dr+dg*dg+db*db;
  };

  function findClosestColor(r,g,b){
    let best = palette[0], bestD = Infinity;
    for(const [pr,pg,pb] of palette){
      const d = dist2(r,g,b,pr,pg,pb);
      if(d < bestD){ bestD = d; best = [pr,pg,pb]; }
    }
    return best;
  }

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));
  const withJitter = (ms) => {
    const f = 0.15 + Math.random()*0.05; // 15%~20%
    const sign = Math.random()<0.5 ? -1 : 1;
    return Math.max(0, ms + sign * ms * f);
  };

  function saveSettings(st){
    localStorage.setItem(SKEY, JSON.stringify(st));
  }
  function loadSettings(){
    try{
      return JSON.parse(localStorage.getItem(SKEY) || '{}');
    }catch(e){ return {}; }
  }

  function getBiggestCanvas(){
    const list = Array.from(document.querySelectorAll('canvas'));
    if(!list.length) return null;
    return list.sort((a,b)=> (b.width*b.height)-(a.width*a.height))[0];
  }

  function makeLog(){
    const logs=[];
    return {
      push(s){ logs.push(`[${new Date().toLocaleTimeString()}] ${s}`); if(logs.length>300) logs.shift(); ui.renderLog(logs); },
      all(){ return logs.slice(); }
    };
  }

  /****************** UI 面板 ******************/
  const ui = {
    el:null, overlay:null, logs:[],
    state:{
      imgData:null,
      queue:[],
      running:false,
      paused:false,
      startGrid:{x:0,y:0},

      // 坐标映射（TL/Px）
      coord:{
        ready:false,
        tl:{x:0,y:0},  // TL X/Y（画面左上的全局网格坐标）
        px:{x:0,y:0},  // 起点（点击处）的全局网格坐标
        sX: null,      // 每个网格在页面坐标的步长（px）
        sY: null,
        lastClickPage:null // 最近一次“设置起点”时的页面点击坐标
      },

      pixelSize:DEFAULTS.pixelSize,             // 旧的像素大小，仅作回退
      cooldownMs:DEFAULTS.cooldownSec*1000,
      canvasEl:null,
      paletteBtns:[],
      captureStartClick:false,                  // 捕捉一次点击作为起点
      calibrateMode:0, // 0=off, 1=first point, 2=second point
      calPoints:[]
    },
    build(){
      const saved = loadSettings();
      const root = document.createElement('div');
      root.id = 'wplace-helper';
      root.style.cssText = `
        position:fixed; top:10px; right:10px; z-index:999999;
        background:#1f2937; color:#fff; font:13px/1.4 system-ui,Segoe UI,Arial;
        padding:10px 12px; border-radius:10px; width:300px; box-shadow:0 8px 24px rgba(0,0,0,.3);
      `;
      root.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <strong>Wplace Helper</strong>
          <span id="statusDot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6b7280"></span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <label>宽(px)<input id="inW" type="number" value="${saved.width||DEFAULTS.width}" style="width:100%"></label>
          <label>高(px)<input id="inH" type="number" value="${saved.height||DEFAULTS.height}" style="width:100%"></label>
          <label>冷却(s)<input id="inCd" type="number" value="${saved.cooldownSec||DEFAULTS.cooldownSec}" style="width:100%"></label>
          <label>像素大小<input id="inPS" type="number" value="${saved.pixelSize||DEFAULTS.pixelSize}" style="width:100%"></label>
          <label style="grid-column:1/3">Alpha阈值
            <input id="inAlpha" type="number" value="${saved.alphaThreshold??DEFAULTS.alphaThreshold}" style="width:100%">
          </label>
          <label style="grid-column:1/3">Canvas选择器
            <input id="inCanvasSel" placeholder="留空=自动最大canvas" value="${saved.canvasSelector||''}" style="width:100%">
          </label>
          <label style="grid-column:1/3">调色板按钮选择器
            <input id="inPalSel" placeholder="留空=自动尝试" value="${saved.paletteBtnSelector||''}" style="width:100%">
          </label>
        </div>

        <div style="margin:8px 0;">
          <input id="inFile" type="file" accept="image/*" />
        </div>

        <div style="border-top:1px solid #374151;margin:8px 0;padding-top:8px;">
          <div style="font-weight:600;margin-bottom:6px;">TL/Px 起点定位</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:6px;">
            <label style="grid-column:span 2;">Tl X<input id="inTlX" type="number" value="${saved.tlX??''}" style="width:100%"></label>
            <label style="grid-column:span 2;">Tl Y<input id="inTlY" type="number" value="${saved.tlY??''}" style="width:100%"></label>
            <label style="grid-column:span 2;">Px X<input id="inPxX" type="number" value="${saved.pxX??''}" style="width:100%"></label>
            <label style="grid-column:span 2;">Px Y<input id="inPxY" type="number" value="${saved.pxY??''}" style="width:100%"></label>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
            <button id="btnPick">设置起点（点画布一次）</button>
            <button id="btnApplyStart">应用起点</button>
            <button id="btnCalib">校准像素大小（备用）</button>
          </div>
          <div style="font-size:12px;opacity:.85;">提示：在画布点击一次后，页面会显示 <b>Tl X / Tl Y / Px X / Px Y</b>；把它们填到上面的输入框，再点「应用起点」。开始填充后不要缩放/平移；若变动，请重新应用起点。</div>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;">
          <button id="btnPreview">预览</button>
          <button id="btnStart">开始填充</button>
          <button id="btnPause">暂停</button>
          <button id="btnResume">恢复</button>
          <button id="btnStop">停止</button>
        </div>

        <div style="font-size:12px;opacity:.9;margin-bottom:6px;">
          起点(网格)：<span id="labStart">(0,0)</span>　
          队列：<span id="labRemain">0</span>
        </div>

        <div id="logBox" style="height:160px;background:#111827;border-radius:8px;padding:6px;overflow:auto;font-family:ui-monospace,Consolas; font-size:12px; white-space:pre-wrap;"></div>

        <style>
          #wplace-helper button{
            background:#374151;color:#fff;border:0;border-radius:8px;padding:6px 8px;cursor:pointer;
          }
          #wplace-helper button:hover{ background:#4b5563; }
          #wplace-helper input{ background:#111827;color:#e5e7eb;border:1px solid #374151;border-radius:6px;padding:4px 6px; }
        </style>
      `;
      document.body.appendChild(root);
      this.el = root;
      this.overlay = makeOverlay();
      this.bind(saved);
      this.renderIndicators();
    },
    bind(saved){
      const $ = sel => this.el.querySelector(sel);
      const S = this.state;

      const setAndSave = () => {
        const st = {
          width: +$('#inW').value,
          height: +$('#inH').value,
          cooldownSec: +$('#inCd').value,
          pixelSize: +$('#inPS').value,
          alphaThreshold: +$('#inAlpha').value,
          canvasSelector: $('#inCanvasSel').value.trim(),
          paletteBtnSelector: $('#inPalSel').value.trim(),
          tlX: +$('#inTlX').value || '',
          tlY: +$('#inTlY').value || '',
          pxX: +$('#inPxX').value || '',
          pxY: +$('#inPxY').value || '',
        };
        saveSettings(st);
        S.pixelSize = st.pixelSize;
        S.cooldownMs = st.cooldownSec*1000;
        this.renderIndicators();
      };

      ['inW','inH','inCd','inPS','inAlpha','inCanvasSel','inPalSel','inTlX','inTlY','inPxX','inPxY'].forEach(id=>{
        this.el.querySelector('#'+id).addEventListener('change', setAndSave);
      });

      $('#btnPreview').addEventListener('click', async () => {
        const file = this.el.querySelector('#inFile').files[0];
        if(!file) return log.push('⚠️ 请选择图片文件');
        const w = +$('#inW').value, h= +$('#inH').value;
        const alpha = +$('#inAlpha').value || DEFAULTS.alphaThreshold;
        await ensureCanvasSelected();
        const img = await readAndResize(file, w, h);
        S.imgData = img;

        const stepX = Math.abs(S.coord?.sX ?? S.pixelSize);
        const stepY = Math.abs(S.coord?.sY ?? S.pixelSize);

        // 构建预览与队列
        const q = [];
        ui.clearOverlay();
        const ctx = ui.overlay.getContext('2d');
        for(let y=0; y<img.h; y++){
          for(let x=0; x<img.w; x++){
            const i = (y*img.w + x)*4;
            const r=img.data[i], g=img.data[i+1], b=img.data[i+2], a=img.data[i+3];
            if(a < alpha) continue;
            const [pr,pg,pb] = findClosestColor(r,g,b);

            const gpX = ui.state.startGrid.x + x;
            const gpY = ui.state.startGrid.y + y;
            const {pageX,pageY} = gridToPageTL(gpX, gpY);
            ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
            ctx.fillRect(pageX, pageY, stepX, stepY);

            q.push({ gx: gpX, gy: gpY, rgb:[pr,pg,pb] });
          }
        }
        S.queue = q;
        this.renderIndicators();
        log.push(`✅ 预览完成，生成队列 ${q.length} 像素`);
      });

      $('#btnPick').addEventListener('click', async ()=>{
        await ensureCanvasSelected();
        S.captureStartClick = true;
        S.calibrateMode = 0;
        S.calPoints = [];
        log.push('🧭 已进入起点捕捉：请在画布上点一次（随后把页面显示的 Tl/Px 数字填到面板里，再点“应用起点”）');
      });

      $('#btnApplyStart').addEventListener('click', async ()=>{
        await ensureCanvasSelected();
        const tlX = +$('#inTlX').value, tlY = +$('#inTlY').value;
        const pxX = +$('#inPxX').value, pxY = +$('#inPxY').value;
        if(!(Number.isFinite(tlX)&&Number.isFinite(tlY)&&Number.isFinite(pxX)&&Number.isFinite(pxY))){
          log.push('⚠️ 请填写完整的 Tl X / Tl Y / Px X / Px Y');
          return;
        }
        if(!ui.state.coord.lastClickPage){
          log.push('⚠️ 请先点击一次画布以捕捉页面坐标（点“设置起点”后点击画布）');
          return;
        }
        const rect = ui.state.canvasEl.getBoundingClientRect();
        const p0 = ui.state.coord.lastClickPage;

        const dx = (pxX - tlX);
        const dy = (pxY - tlY);
        const sX = dx !== 0 ? (p0.x - rect.left) / dx : (ui.state.sX ?? ui.state.pixelSize);
        const sY = dy !== 0 ? (p0.y - rect.top ) / dy : (ui.state.sY ?? ui.state.pixelSize);

        ui.state.coord = {
          ready: true,
          tl:{x:tlX, y:tlY},
          px:{x:pxX, y:pxY},
          sX, sY,
          lastClickPage: p0
        };
        ui.state.startGrid = {x:pxX, y:pxY};

        // 保存
        const saved = loadSettings();
        saved.tlX = tlX; saved.tlY = tlY; saved.pxX = pxX; saved.pxY = pxY;
        saveSettings(saved);

        ui.renderIndicators();
        log.push(`📌 起点已应用：TL(${tlX},${tlY}) → Page(${Math.round(rect.left)},${Math.round(rect.top)}), ` +
                 `PX(${pxX},${pxY}) → Page(${Math.round(p0.x)},${Math.round(p0.y)}), ` +
                 `sX=${sX.toFixed(3)}, sY=${sY.toFixed(3)}`);
      });

      $('#btnCalib').addEventListener('click', async ()=>{
        await ensureCanvasSelected();
        S.calibrateMode = 1;
        S.captureStartClick = false;
        S.calPoints = [];
        log.push('📏 校准（备用）：请点击第一个像素交界点，再点相邻像素交界点');
      });

      $('#btnStart').addEventListener('click', ()=>{
        if(S.running){ log.push('已在运行'); return; }
        if(!S.queue?.length){ log.push('⚠️ 队列为空，请先预览'); return; }
        S.running = true; S.paused = false;
        ui.renderIndicators();
        runLoop();
      });
      $('#btnPause').addEventListener('click', ()=>{ S.paused = true; ui.renderIndicators(); log.push('⏸️ 已暂停'); });
      $('#btnResume').addEventListener('click', ()=>{ if(!S.running){ S.running = true; runLoop(); } S.paused = false; ui.renderIndicators(); log.push('▶️ 继续'); });
      $('#btnStop').addEventListener('click', ()=>{ S.running=false; S.paused=false; S.queue=[]; ui.renderIndicators(); log.push('⏹️ 已停止，队列清空'); });

      // 全局点击捕获：用于 起点捕捉 / 像素大小校准
      document.addEventListener('click', (ev)=>{
        const S = ui.state;
        if(!S.canvasEl) return;
        if(!ev.isTrusted) return;
        const inCanvas = ev.target === S.canvasEl || S.canvasEl.contains(ev.target);
        if(!inCanvas) return;

        const rect = S.canvasEl.getBoundingClientRect();
        const cx = ev.clientX - rect.left;
        const cy = ev.clientY - rect.top;

        if(S.captureStartClick){
          S.coord.lastClickPage = {x: ev.clientX, y: ev.clientY};
          S.captureStartClick = false;
          ui.renderIndicators();
          log.push(`🧭 已捕捉页面坐标 (${Math.round(ev.clientX)}, ${Math.round(ev.clientY)})，请在面板填入 TL/Px 数字并点击「应用起点」`);
          ev.preventDefault(); ev.stopPropagation();
        } else if(S.calibrateMode>0){
          S.calPoints.push({x:ev.clientX, y:ev.clientY});
          if(S.calibrateMode===1){
            S.calibrateMode = 2;
            log.push('📏 校准：请点击相邻像素的下一个交界点');
          }else{
            const p0=S.calPoints[0], p1=S.calPoints[1];
            const ps = Math.round(Math.hypot(p1.x-p0.x, p1.y-p0.y));
            S.pixelSize = ps;
            ui.el.querySelector('#inPS').value = ps;
            const saved = loadSettings(); saved.pixelSize = ps; saveSettings(saved);
            S.calibrateMode = 0; S.calPoints=[];
            ui.renderIndicators();
            log.push(`✅ 校准完成：pixelSize=${ps}（仅作回退映射时使用）`);
          }
          ev.preventDefault(); ev.stopPropagation();
        }
      }, true);

      // 可视化当前 canvas 范围
      setInterval(()=>{
        if(S.canvasEl){
          const r = S.canvasEl.getBoundingClientRect();
          ui.overlay.style.left = '0px';
          ui.overlay.style.top = '0px';
          ui.overlay.width = window.innerWidth;
          ui.overlay.height = window.innerHeight;
          const ctx = ui.overlay.getContext('2d');
          ctx.clearRect(0,0,ui.overlay.width,ui.overlay.height);
          ctx.strokeStyle = 'rgba(0,255,180,.35)';
          ctx.lineWidth = 2;
          ctx.strokeRect(r.left, r.top, r.width, r.height);
        }
      }, 1000);
    },
    clearOverlay(){
      const ctx = this.overlay.getContext('2d');
      ctx.clearRect(0,0,this.overlay.width,this.overlay.height);
      this.overlay.width = window.innerWidth;
      this.overlay.height = window.innerHeight;
    },
    renderIndicators(){
      const $ = sel => this.el.querySelector(sel);
      const S = this.state;
      $('#labStart').textContent = `(${S.startGrid.x},${S.startGrid.y})`;
      $('#labRemain').textContent = `${S.queue?.length||0}`;
      const dot = this.el.querySelector('#statusDot');
      dot.style.background = S.running
        ? (S.paused ? '#f59e0b' : '#10b981')
        : '#6b7280';
    },
    renderLog(lines){
      const box = this.el.querySelector('#logBox');
      box.textContent = lines.slice(-300).join('\n');
      box.scrollTop = box.scrollHeight;
    }
  };

  /****************** Overlay 画布 ******************/
  function makeOverlay(){
    const c = document.createElement('canvas');
    c.style.cssText = `
      position:fixed; left:0; top:0; width:100vw; height:100vh; 
      pointer-events:none; z-index:999998;
    `;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);
    return c;
  }

  async function ensureCanvasSelected(){
    const S = ui.state;
    if(S.canvasEl && document.contains(S.canvasEl)) return S.canvasEl;
    const saved = loadSettings();
    let el = null;
    if(saved.canvasSelector){
      el = document.querySelector(saved.canvasSelector);
    }
    if(!el){
      el = getBiggestCanvas();
    }
    if(!el) throw new Error('未找到目标 canvas，请在面板填写 Canvas 选择器');
    ui.state.canvasEl = el;
    log.push('🎯 已选中 canvas (自动/手动)');
    return el;
  }

  /****************** 坐标映射：网格 → 页面 ******************/
  // 以 TL（画布显示的左上网格坐标）与其在页面中的位置（canvas rect 左上）
  // 再结合用户点击点（Px）与其页面坐标，解出缩放 sX/sY
  function gridToPageTL(gx, gy){
    const S = ui.state;
    const r = S.canvasEl.getBoundingClientRect();
    if(S.coord?.ready && Number.isFinite(S.coord.sX) && Number.isFinite(S.coord.sY)){
      const x = r.left + (gx - S.coord.tl.x) * S.coord.sX;
      const y = r.top  + (gy - S.coord.tl.y) * S.coord.sY;
      return { pageX: Math.round(x), pageY: Math.round(y) };
    }
    // 回退：使用旧的 pixelSize 映射（不含缩放修正）
    const x = Math.round(r.left + gx * S.pixelSize);
    const y = Math.round(r.top  + gy * S.pixelSize);
    return { pageX: x, pageY: y };
  }
  function gridToPageCenter(gx, gy){
    const S = ui.state;
    const stepX = Math.abs(S.coord?.sX ?? S.pixelSize);
    const stepY = Math.abs(S.coord?.sY ?? S.pixelSize);
    const tl = gridToPageTL(gx, gy);
    return { pageX: Math.round(tl.pageX + stepX/2), pageY: Math.round(tl.pageY + stepY/2) };
  }

  /****************** 图片读取/缩放 ******************/
  async function readAndResize(file, w, h){
    const url = await new Promise(res=>{
      const fr = new FileReader();
      fr.onload = e=>res(e.target.result);
      fr.readAsDataURL(file);
    });
    const img = await new Promise(res=>{
      const im = new Image();
      im.onload = ()=>res(im);
      im.src = url;
    });
    const c = document.createElement('canvas');
    c.width=w; c.height=h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img,0,0,w,h);
    const {data} = ctx.getImageData(0,0,w,h);
    return {data, w, h};
  }

  function parseRgb(s){
    const m = /rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)/i.exec(s||'');
    if(!m) return null;
    return [ +m[1], +m[2], +m[3] ];
  }

  function getCandidatePaletteButtons(customSelector){
    if(customSelector){
      return Array.from(document.querySelectorAll(customSelector));
    }
    const guesses = [
      'button', '[role="button"]', '.palette *', '[data-color]', '[class*=color]',
    ];
    const set = new Set();
    guesses.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>set.add(el));
    });
    return Array.from(set);
  }

  function findBestPaletteButton(targetRgb){
    const list = getCandidatePaletteButtons(loadSettings().paletteBtnSelector);
    if(!list.length) return null;
    let bestBtn = null, bestD = Infinity, bestRGB = null;
    for(const el of list){
      const cs = getComputedStyle(el);
      const rgb = parseRgb(cs.backgroundColor) || parseRgb(cs.color);
      if(!rgb) continue;
      const d = dist2(targetRgb[0],targetRgb[1],targetRgb[2], rgb[0],rgb[1],rgb[2]);
      if(d < bestD){
        bestD = d; bestBtn = el; bestRGB = rgb;
      }
    }
    if(bestBtn){
      log.push(`🎨 选择颜色按钮 ≈ rgb(${bestRGB.join(',')})`);
    }
    return bestBtn;
  }

  /****************** 点击（修复版） ******************/
  async function clickAt(el, pageX, pageY) {
    const view = el.ownerDocument.defaultView || window;
    function ev(type) {
      return new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: pageX,
        clientY: pageY,
        view: view
      });
    }
    el.dispatchEvent(ev('mousemove'));
    el.dispatchEvent(ev('mousedown'));
    el.dispatchEvent(ev('mouseup'));
    el.dispatchEvent(ev('click'));
  }

  /****************** 绘制逻辑 ******************/
  async function placeOne(task){
    const btn = findBestPaletteButton(task.rgb);
    if(btn){
      btn.click();
      await sleep(30 + Math.random()*50);
    }else{
      log.push('⚠️ 未找到调色板按钮（可在面板填写“调色板按钮选择器”以提升准确度）');
    }

    const center = gridToPageCenter(task.gx, task.gy);
    const S = ui.state;
    const jx = Math.round((Math.random()-0.5) * (Math.abs(S.coord?.sX ?? S.pixelSize) * 0.2));
    const jy = Math.round((Math.random()-0.5) * (Math.abs(S.coord?.sY ?? S.pixelSize) * 0.2));

    await clickAt(S.canvasEl, center.pageX + jx, center.pageY + jy);
    log.push(`🧩 已点击像素 (${task.gx}, ${task.gy})`);
  }

  async function runLoop(){
    const S = ui.state;
    while(S.running){
      if(S.paused){ await sleep(200); continue; }
      if(!S.queue.length){
        S.running=false;
        ui.renderIndicators();
        log.push('✅ 填充完成');
        break;
      }
      const task = S.queue.shift();
      ui.renderIndicators();
      try{
        await placeOne(task);
      }catch(e){
        log.push('❌ 绘制失败：' + (e?.message||e));
      }
      await sleep(withJitter(S.cooldownMs));
    }
  }

  /****************** 启动 ******************/
  const log = makeLog();
  ui.build();
  log.push('✨ 插件已加载。顺序：设置起点(点画布) → 填入TL/Px并“应用起点” → 预览 → 开始填充');

})();
