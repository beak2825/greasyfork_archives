// ==UserScript==
// @name         图灵版本
// @namespace    http://tampermonkey.net/
// @version      5.3.0
// @license MIT
// @description  仅在点击“领取/验证”等按钮后触发：截图→上传→按返回坐标逐点点击/拖动；完成后再查找包含指定文本的 div 并点击。无任何面板；保留红/蓝点用于核对；移动端可用。
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/551643/%E5%9B%BE%E7%81%B5%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551643/%E5%9B%BE%E7%81%B5%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.__GDC_LOADED__) return; window.__GDC_LOADED__ = true;

  /*** 配置（按需改） ***/
  const CFG = {
    apiUrl: 'http://www.fdyscloud.com.cn/tuling/predict',
    version: '3.1.1',
    captchaType: 30492402,
    username: 'zyzy5678',
    password: 'asdfnqwOASFDJO__+125',
    reqEncoding: 'json',      // 'form' | 'json'
    timeoutMs: 20000,
    retries: 2,
    renderCORS: true,
    maxScale: 2,

    // 可视化/下载
    showDots: true,           // 显示蓝色原点/红点
    autoDownload: false,      // 是否自动下载截图 PNG
    copyToClipboard: false,   // 是否复制截图到剪贴板（部分端不支持）

    // ✅ 新增：坐标点点击完毕后，自动点击包含这些文本的 div（按顺序匹配）
    finalDivContains: ['确定'], // 需要查找的文本（任意一个命中即点击）
    finalClickDelayMs: 80,                 // 完成坐标点击后，等待再去找 div 的延迟
    finalSearchWithinBaseFirst: true        // 先在当前验证码容器内找，再全局找
  };

  /*** 运行状态 ***/
  const sleep = (ms)=>new Promise(r=>setTimeout(r, ms));
  const CLICK = {
    target: 'auto',
    times: 1,
    intervalMs: 600,
    offsetX: 0,
    offsetY: 0,
    enableDrag: true,
    dragDuration: 800,
    dragSteps: 20
  };

  /*** 打点层（fixed=client 坐标系） ***/
  const LAYER_ID='gdc_mark_layer';
  function ensureLayer(){
    if(!CFG.showDots) return null;
    let layer=document.getElementById(LAYER_ID);
    if(!layer){
      layer=document.createElement('div');
      layer.id=LAYER_ID;
      Object.assign(layer.style,{position:'fixed',left:'0',top:'0',width:'1px',height:'1px',zIndex:'2147483647',pointerEvents:'none'});
      document.documentElement.appendChild(layer);
    }
    return layer;
  }
  function dot(x,y,color='rgba(255,0,0,0.95)',size=6){
    if(!CFG.showDots) return;
    const layer=ensureLayer(); if(!layer) return;
    const d=document.createElement('div'), r=size/2;
    Object.assign(d.style,{position:'fixed',left:(x-r)+'px',top:(y-r)+'px',width:size+'px',height:size+'px',borderRadius:'50%',background:color,pointerEvents:'none',boxShadow:'0 0 0 2px rgba(0,0,0,0.15)'});
    layer.appendChild(d);
  }

  /*** 事件派发（Touch→Pointer(touch)→Mouse；不传 view） ***/
  function fireHybridChain(el, x, y){
    if(!el) return;
    try{
      if(typeof Touch!=='undefined' && typeof TouchEvent!=='undefined'){
        const id=Date.now()%10000;
        const t=new Touch({identifier:id,target:el,clientX:x,clientY:y,pageX:x+scrollX,pageY:y+scrollY,screenX:x,screenY:y});
        el.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[t],targetTouches:[t],changedTouches:[t]}));
        el.dispatchEvent(new TouchEvent('touchend',{bubbles:true,cancelable:true,touches:[],targetTouches:[],changedTouches:[t]}));
      }
    }catch{}
    try{
      if(typeof PointerEvent!=='undefined'){
        el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,buttons:1,pressure:0.5}));
        el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,buttons:0,pressure:0}));
      }
    }catch{}
    for(const type of ['mousedown','mouseup','click']){
      try{ el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,button:0})); }catch{}
    }
  }
  async function clickAt(clientX, clientY, times=1, intervalMs=200, baseEl=document.body){
    for(let i=0;i<times;i++){
      const hit=document.elementFromPoint(clientX,clientY)||baseEl;
      fireHybridChain(hit, clientX, clientY);
      if(i<times-1) await sleep(intervalMs);
    }
  }
  async function dragFromTo(sx,sy,ex,ey,durationMs=800,steps=20){
    const stepDelay=Math.max(0,durationMs/Math.max(1,steps));
    const startEl=document.elementFromPoint(sx,sy)||document.body;
    fireHybridChain(startEl, sx, sy);
    for(let i=1;i<=steps;i++){
      const t=i/steps, x=sx+(ex-sx)*t, y=sy+(ey-sy)*t;
      try{ (document.elementFromPoint(x,y)||startEl).dispatchEvent(new MouseEvent('mousemove',{bubbles:true,cancelable:true,clientX:x,clientY:y})); }catch{}
      await sleep(stepDelay);
    }
    const endEl=document.elementFromPoint(ex,ey)||document.body;
    for(const type of ['mouseup','click']){
      try{ endEl.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:ex,clientY:ey,button:0})); }catch{}
    }
  }

  /*** HTTP ***/
  function postViaGMXHR(url, payload, {encoding='form', timeout=20000, retries=2}={}, onQuickRecognize){
    return new Promise(async (resolve, reject)=>{
      const sendOnce=()=>new Promise((res, rej)=>{
        let data, headers={};
        if(encoding==='json'){ headers['Content-Type']='application/json'; data=JSON.stringify(payload); }
        else { headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';
          const usp=new URLSearchParams(); for(const [k,v] of Object.entries(payload)) usp.append(k, typeof v==='string'?v:JSON.stringify(v)); data=usp.toString(); }
        GM_xmlhttpRequest({
          method:'POST', url, headers, data, timeout,
          onload:(xhr)=>{
            const text=xhr.responseText||'';
            try{
              const j=JSON.parse(text);
              const recog=j?.data?.recognition;
              if(typeof recog==='string' && recog.trim() && typeof onQuickRecognize==='function'){
                onQuickRecognize(recog.trim()); // 不阻塞
              }
            }catch{}
            if(xhr.status<200 || xhr.status>=300) return rej(new Error(`HTTP ${xhr.status} - ${text.slice(0,600)}`));
            try{ res(JSON.parse(text)); }catch{ res(text); }
          },
          ontimeout:()=>rej(new Error('请求超时')),
          onerror:(e)=>rej(new Error('网络错误（GMXHR）：'+(e&&e.error||'unknown')))
        });
      });
      const total=1+(retries|0);
      for(let i=0;i<total;i++){
        try{ return resolve(await sendOnce()); }
        catch(e){ if(i===total-1) return reject(e); await sleep(Math.min(2500,300*Math.pow(2,i))); }
      }
    });
  }

  /*** 解析响应 ***/
  function normalizeApiResponse(resp){
    if(typeof resp==='string'){
      if(/502\s+Bad\s+Gateway/i.test(resp)) return { ok:false, msg:'服务器 502（网关错误/超时）' };
      try{ resp=JSON.parse(resp); }catch{ return { ok:false, msg:'响应不是 JSON：'+resp.slice(0,200) }; }
    }
    if(!resp || typeof resp!=='object') return { ok:false, msg:'响应为空或不是对象' };
    if(Number(resp.code)!==1) return { ok:false, msg:(typeof resp.message==='string'?resp.message:'识别失败'), raw:resp };
    return { ok:true, data: resp.data || {}, raw:resp };
  }
  function pickCoords(data, pref='auto'){
    const pick=(k)=>{ const o=data?.[k]; if(!o) return null;
      const x=Number(o['X坐标值']), y=Number(o['Y坐标值']);
      return (Number.isFinite(x)&&Number.isFinite(y))?{x,y,sourceKey:k}:null; };
    const gap=pick('缺口'), slider=pick('滑块');
    if(pref==='缺口') return gap||slider||{};
    if(pref==='滑块') return slider||gap||{};
    const chosen=gap||slider||{}; chosen.gap=gap?{x:gap.x,y:gap.y}:null; chosen.slider=slider?{x:slider.x,y:slider.y}:null; return chosen;
  }

  /*** 工具（下载/剪贴板/命名） ***/
  function genName(el){
    const t=(el.tagName||'node').toLowerCase();
    const id=el.id?('#'+el.id):'';
    const cls=(el.className&&typeof el.className==='string')?('.'+el.className.trim().split(/\s+/).slice(0,2).join('.')):'';
    const base=(t+id+cls).replace(/[^\w\.\#-]+/g,'').slice(0,40) || 'element';
    const ts=new Date(); const pad=n=>String(n).padStart(2,'0');
    const stamp=`${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`;
    return `capture_${base}_${stamp}.png`;
  }
  async function copyCanvasToClipboard(canvas){
    if(!CFG.copyToClipboard) return;
    try{
      const blob=await new Promise(res=>canvas.toBlob(res,'image/png',1));
      if(blob && navigator.clipboard?.write){
        const item=new ClipboardItem({'image/png':blob});
        await navigator.clipboard.write([item]);
      }
    }catch{}
  }
  function downloadCanvas(canvas, el){
    if(!CFG.autoDownload) return;
    try{ const a=document.createElement('a'); a.download=genName(el); a.href=canvas.toDataURL('image/png'); a.click(); }catch{}
  }

  /*** ✅ 新增：点击完所有坐标后，查找包含指定字符的 div 并点击 ***/
  function isVisible(el){
    if(!el) return false;
    const css=getComputedStyle(el);
    if(css.display==='none' || css.visibility==='hidden' || css.opacity==='0') return false;
    const r=el.getBoundingClientRect();
    return r.width>3 && r.height>3 && r.bottom>0 && r.right>0 && r.left<window.innerWidth && r.top<window.innerHeight;
  }
  function findDivByTexts(texts, scope){
    if(!Array.isArray(texts) || !texts.length) return null;
    const root = scope || document;
    const divs = root.querySelectorAll('div');
    const cleaned = t => (t||'').replace(/\s+/g,'').trim();
    const list = Array.from(divs).filter(isVisible);
    for(const wanted of texts){
      const w = cleaned(wanted);
      if(!w) continue;
      for(const d of list){
        const txt = cleaned(d.innerText || d.textContent || '');
        if(txt.includes(w)) return d;
      }
    }
    return null;
  }
  async function finalClickAfterAll(baseEl){
      console.log(9999999);
        console.log("点击完毕:", performance.now() - globalStart, "ms");
      //console.log(99999999999,document.querySelectorAll(".geetest_submit_tips"))
    if(!CFG.finalDivContains || !CFG.finalDivContains.length) return;
    await sleep(Math.max(0, CFG.finalClickDelayMs|0));
    let target = null;
    if (CFG.finalSearchWithinBaseFirst && baseEl) {
        target = document.querySelectorAll(".geetest_submit_tips")[0]
        //console.log(target,"target")
      //target = findDivByTexts(CFG.finalDivContains, baseEl);
    }
    //if (!target) target = findDivByTexts(CFG.finalDivContains, document);
      if (!target) target = findDivByTexts(CFG.finalDivContains, document);
    if (!target) return;

    const r = target.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top  + r.height/2;
    console.log(cx,cy)
    dot(cx, cy, 'rgba(160,0,255,0.95)', 6); // 紫点表示“最终按钮”
    const hit = document.elementFromPoint(cx,cy) || target;
    fireHybridChain(hit, cx, cy);
  }
async function shotFourLayersCompose() {
  // ★ 在这里写死四个选择器 ★
  const LAYER_SELECTORS = [
    '.geetest_box',
    '.geetest_text_tips',
    '.geetest_ques_tips',
    '.geetest_window'
  ];

  // 自动加载 html2canvas
  async function ensureHtml2Canvas() {
    if (window.html2canvas) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('html2canvas 加载失败'));
      document.head.appendChild(s);
    });
  }

  function raf(n = 1) {
    return new Promise(res => {
      const tick = () => (--n <= 0) ? res() : requestAnimationFrame(tick);
      requestAnimationFrame(tick);
    });
  }

  function canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob失败')), type);
    });
  }

  async function downloadCanvas(canvas, filename) {
    const blob = await canvasToBlob(canvas, 'image/png');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  // 深度内联：把子树内的图片转成 data:URL（简化版，只处理 <img> 和 background-image）
  async function deepInline(root) {
    const imgs = root.querySelectorAll('img');
    for (const img of imgs) {
      const src = img.src;
      if (!src || src.startsWith('data:')) continue;
      try {
        const dataUrl = await fetchAsDataUrl(src);
        img.setAttribute('src', dataUrl);
      } catch {}
    }
    const all = root.querySelectorAll('*');
    for (const el of all) {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg.startsWith('url(') && !bg.includes('data:')) {
        const url = bg.slice(5, -2);
        try {
          const dataUrl = await fetchAsDataUrl(url);
          el.style.backgroundImage = `url("${dataUrl}")`;
        } catch {}
      }
    }
    return () => {}; // 这里省略还原逻辑
  }

  async function fetchAsDataUrl(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // ===== 主逻辑 =====
  await ensureHtml2Canvas();
  const SCALE = 1;
  const H2C_OPTIONS = {
    backgroundColor: null, useCORS: true, allowTaint: false,
    foreignObjectRendering: false, scale: SCALE, removeContainer: true,
    logging: false, scrollX: window.scrollX, scrollY: window.scrollY
  };

  const captured = [];
  for (let i = 0; i < LAYER_SELECTORS.length; i++) {
    const sel = LAYER_SELECTORS[i];
    const el = document.querySelector(sel);
    if (!el) continue;
    el.scrollIntoView({ block: 'nearest' });
    await raf(2);

    const cleanup = await deepInline(el);
    try {
      const canvas = await html2canvas(el, H2C_OPTIONS);
      const blob = await canvasToBlob(canvas);
      const bmp = await createImageBitmap(blob);
      const r = el.getBoundingClientRect();
      captured.push({
        rect: { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height },
        bmp, w: canvas.width, h: canvas.height
      });
    } finally { cleanup(); }
  }

  if (!captured.length) {
    alert('没有截到任何层');
    return null;
  }

  // 合成
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const L of captured) {
    minX = Math.min(minX, L.rect.x);
    minY = Math.min(minY, L.rect.y);
    maxX = Math.max(maxX, L.rect.x + L.rect.w);
    maxY = Math.max(maxY, L.rect.y + L.rect.h);
  }
  const outW = Math.round((maxX - minX) * SCALE);
  const outH = Math.round((maxY - minY) * SCALE);
  const out = document.createElement('canvas');
  out.width = outW; out.height = outH;
  const ctx = out.getContext('2d');
  for (const L of captured) {
    const dx = Math.round((L.rect.x - minX) * SCALE);
    const dy = Math.round((L.rect.y - minY) * SCALE);
    ctx.drawImage(L.bmp, 0, 0, L.w, L.h, dx, dy, L.w, L.h);
  }

  // 下载
  //const fileName = `composite_${new Date().toISOString().replace(/[:.]/g,'-')}.png`;
  //await downloadCanvas(out, fileName);

  // 返回 Base64（不带前缀）
  const dataUrl = out.toDataURL('image/png');
  return dataUrl.split(',')[1] || '';
}

  /*** 主流程：截图→（下载）→上传→解析→映射→点击/拖动→最终 div 点击 ***/
 async function captureUploadAndAct(el){
  if(!CFG.apiUrl) return;
  if(!CFG.captchaType) return;
  if(!CFG.usertoken && (!CFG.username||!CFG.password)) return;

  try{ el.scrollIntoView({block:'nearest'}); }catch{}

  // 蓝点标记元素左上
  const r0 = el.getBoundingClientRect();
  dot(r0.left, r0.top, 'rgba(0,128,255,0.95)', 8);

  globalThis.globalStart = performance.now();

  // 截图（可按需把 scale 固定为 1，避免过大）
  const scale = 1;
  const allowCORS = !!CFG.renderCORS;
  let canvas;
  try{
    canvas = await html2canvas(el, {
      backgroundColor:null, scale,
      useCORS:allowCORS, allowTaint:allowCORS,
      logging:false, imageTimeout:8000,
      windowWidth:document.documentElement.scrollWidth,
      windowHeight:document.documentElement.scrollHeight
    });
  }catch{ return; }
  console.log("截图:", performance.now() - globalStart, "ms");
  // 组合层并转 b64 —— 一旦有 b64 就立刻上传
  //const dataUrl = await shotFourLayersCompose();
  //const i = dataUrl.indexOf('base64,');
  const b64_raw = await shotFourLayersCompose();
  //const b64_raw = dataUrl.split('base64,', 2)[1] || dataUrl;
  console.log("组合层并转 b64:", performance.now() - globalStart, "ms");
  // 组装 payload
  const payload = { ID: CFG.captchaType, version: CFG.version };
  if (CFG.usertoken) payload.usertoken = CFG.usertoken; else { payload.username = CFG.username; payload.password = CFG.password; }
  if (CFG.developer) payload.developer = CFG.developer;
  if (CFG.pictureID) payload.pictureID = CFG.pictureID;
  if (CFG.rotate && /^(90|180|270)$/.test(CFG.rotate)) payload.rotate = CFG.rotate;
  payload.b64 = b64_raw;
  console.log("payload:", performance.now() - globalStart, "ms");
  // 快捷点击（用于服务端直接返回坐标串时立刻点）
  let quickClicked = false;
  const doQuickRecognize = (recogStr) => {
    (async () => {
      quickClicked = true;
      const rect = el.getBoundingClientRect();
      const sx = rect.width  / (canvas.width  || 1);
      const sy = rect.height / (canvas.height || 1);
      const parts = String(recogStr).replace(/[，]/g,',').split(/[|；;\s]+/).filter(Boolean);
      for (const pair of parts){
        const [xs, ys] = pair.replace(/[×xX：:]/g,',').split(',');
        const x = Number(xs), y = Number(ys);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        const cx = rect.left + (x + (CLICK.offsetX||0)) * sx;
        const cy = rect.top  + (y + (CLICK.offsetY||0)) * sy;
        dot(cx, cy, 'rgba(255,0,0,0.95)', 6);
        const hit = document.elementFromPoint(cx,cy) || el;
        fireHybridChain(hit, cx, cy);
        await sleep(CLICK.intervalMs);
      }
      await finalClickAfterAll(el);
    })().catch(()=>{});
  };
  console.log("快捷点击:", performance.now() - globalStart, "ms");
  function convertCoords(coordStr) {
  // 边界
  const xBounds = [0,102, 200, 300];
  const yBounds = [0,102, 200, 300];

  // 工具函数：将数值映射到区间编号
  function mapToRange(value, bounds) {
    for (let i = 0; i < bounds.length - 1; i++) {
      if (value >= bounds[i] && value < bounds[i + 1]) {
        return i + 1; // 区间编号从 1 开始
      }
    }
    return null; // 不在区间内
  }

  // 主逻辑
  return coordStr.split('|').map(pair => {
    const [x, y] = pair.split(',').map(Number);
    const mappedX = mapToRange(x, xBounds);
    const mappedY = mapToRange(y, yBounds);
    if (mappedX == null || mappedY == null) return null;
    return mappedX + 3 * (mappedY - 1) -1;
  }).filter(v => v !== null);
}
  // ===== 立刻发送请求（紧跟 b64 之后）=====
     const reqP = postViaGMXHR(
         CFG.apiUrl,
         payload,
         { encoding: CFG.reqEncoding, timeout: CFG.timeoutMs, retries: CFG.retries },
         //(s) => doQuickRecognize && doQuickRecognize(s)   // 回调
     );
function clickGeetestGhosts(nums) {
  if (!Array.isArray(nums)) return;

  for (let i = 0; i < nums.length; i++) {

    const n = nums[i];
      console.log(n,"n")
    const className = `geetest_ghost_${n}`;
    const els = document.querySelectorAll(`.${className}`);

    if (els.length) {
      els.forEach(el => {
        el.click();
        console.log(`点击: .${className}`, el);
      });
    } else {
      console.warn(`未找到元素: .${className}`);
    }
  }
}



     function formatCoords(obj) {
  // 按 key 中的数字排序
  const keys = Object.keys(obj).sort((a, b) => {
    const na = parseInt(a.replace("顺序", ""), 10);
    const nb = parseInt(b.replace("顺序", ""), 10);
    return na - nb;
  });

  // 拼接结果
  return keys.map(k => {
    const point = obj[k];
    return `${point["X坐标值"]},${point["Y坐标值"]}`;
  }).join("|");
}




     reqP.then(resp => {
         console.log("已接受数据:", performance.now() - globalStart, "ms");
         console.log("坐标",formatCoords(resp.data))
         const zuobiaozu = convertCoords(formatCoords(resp.data));clickGeetestGhosts(zuobiaozu);console.log(resp.data);console.log(zuobiaozu)
     }).catch(err => {
         console.error("请求失败：", err);
     });


  if (quickClicked) return; // 已通过快捷点击完成就结束

  // ===== 常规解析（兜底）=====
  const parsed = normalizeApiResponse(resp);
  if (!parsed.ok) return;

  const data = parsed.data || {};

  if (typeof data.recognition === 'string' && data.recognition.trim()){
    doQuickRecognize(data.recognition.trim());
    return;
  }

  // 兼容 {缺口, 滑块}
  const rect = el.getBoundingClientRect();
  const sx = rect.width  / (canvas.width  || 1);
  const sy = rect.height / (canvas.height || 1);
  const coord = pickCoords(data, CLICK.target);

  if (CLICK.enableDrag && coord.slider && coord.gap){
    const startX = rect.left + (coord.slider.x + CLICK.offsetX) * sx;
    const startY = rect.top  + (coord.slider.y + CLICK.offsetY) * sy;
    const endX   = rect.left + (coord.gap.x    + CLICK.offsetX) * sx;
    const endY   = rect.top  + (coord.gap.y    + CLICK.offsetY) * sy;
    dot(startX,startY,'rgba(255,180,0,0.95)',6);
    dot(endX,endY,'rgba(160,0,255,0.95)',6);
    await dragFromTo(startX,startY,endX,endY,CLICK.dragDuration,CLICK.dragSteps);

    await finalClickAfterAll(el);
    return;
  }

  if (coord.x != null && coord.y != null){
    const cx = rect.left + (coord.x + CLICK.offsetX) * sx;
    const cy = rect.top  + (coord.y + CLICK.offsetY) * sy;
    dot(cx,cy,'rgba(255,0,0,0.95)',6);
    await clickAt(cx, cy, CLICK.times, CLICK.intervalMs, el);
    await finalClickAfterAll(el);
  }
}


  /*** 仅在“领取/验证”按钮点击后触发 ***/
  const TRIGGER_WORDS = ['领取','立即领取','去领取','点击按钮开始验证'];

  function isClaimButton(node) {
    if (!node) return false;
    //console.log(node.innerHTML, 66666666666666666666);
    if (node.innerHTML !== "立即领取") {return false}
    return true
      console.log(111111)
    // 只向上找 span 节点
    const btn = node.closest && node.closest('span');
    const el = btn || node;

    // 去掉空格、换行
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, '').trim();
    if (!text) return false;

    // 判断是否完全等于 TRIGGER_WORDS 的某个值
    return TRIGGER_WORDS.some(w => text === w);
  }


  // 扫描一次：找到验证码容器并处理；找到一个就返回 true
  async function scanOnce(){
    // 极验类
    //const tipsA = document.querySelectorAll('div[class*="geetest_text_tips"]');
    //for (const div of tipsA) {
    //  const txt=(div.innerText||div.textContent||'').trim();
    //  if (txt.includes('依次点击'))      CFG.captchaType = 2316;
    //  else if (txt.includes('符合右图'))  CFG.captchaType = 2302;
    //  const box = div.closest('div[class*="geetest_box_"]');
    //  if (box) { await captureUploadAndAct(box); return true; }
    //}
    // 图片网格/滑块类
    const tipsB = document.querySelectorAll('div[class*="geetest_text_tips"]');
    console.log(tipsB)
    for (const div of tipsB) {
      const txt=(div.innerText||div.textContent||'').trim();
      console.log(txt)
      if (txt.includes('依次点击'))        {CLICK.intervalMs=400;       CFG.ID = 2316;}
      else if (txt.includes('符合右图')) {CFG.ID = 30492402;CLICK.intervalMs=60;}
      const box = div.closest('div[class*="geetest_box"]')
      const boxs = div.querySelectorAll(".geetest_box")
      console.log("box",box)
      console.log("boxs",boxs)
      if (box) { await captureUploadAndAct(box); return true; }
    }
    return false;
  }

  // 等弹层渲染后多次扫描
async function scanAfterClick() {
  while (true) {
    await sleep(100)
    const box = document.querySelector('.geetest_box');
    if (box) {
      const style = window.getComputedStyle(box);
      if (style.display === 'block') {
        const ok = await scanOnce();
        if (ok) return; // 成功就退出函数
      }
    }
    await sleep(10); // 每 10ms 检查一次
  }
}


  document.addEventListener('click', (e)=>{
    console.log("click")
    setTimeout(()=>{ scanAfterClick().catch(()=>{}); }, 100);
  }, { capture: true, once: true });

  //document.addEventListener('click', (e) => {
  //if (!isClaimButton(e.target)) return;
  //  setTimeout(() => {
  //  scanAfterClick().catch(() => {});
  //  }, 50);
  //}, { capture: true, once: true });


    //const timer = setInterval(() => {
    //const btns = document.querySelectorAll(".mantine-Button-label");
    //console.log(btns)
    //if (btns.length > 0) {
    //  btns[0].click();
    //      console.log(btns)
    //  clearInterval(timer); // 停止定时器，保证只点击一次
    //}
    //}, 500);

  const timer = setInterval(() => {
      let spans = document.querySelectorAll("span");
      //document.querySelectorAll(".mantine-Button-label")[0].click()
      for (let span of spans) {
          if (span.innerText == "立即领取") {
                console.log("发现 '立即领取' 按钮，点击一次后停止...");
               console.log(span)
                span.click(); // 点击
                console.log("点击了一次")
                //setTimeout(() => { scanAfterClick().catch(()=>{}); }, 50);
                //document.querySelector(".geetest_btn_click").click()
               clearInterval(timer); // 停止定时器，保证只点击一次
                return;
            }
        }
      }, 500);
})();
