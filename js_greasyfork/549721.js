// ==UserScript==
// @name         无面板手机测试
// @namespace    http://tampermonkey.net/
// @version      5.3.0
// @license MIT
// @description  仅在点击“领取/验证”等按钮后触发：截图→上传→按返回坐标逐点点击/拖动；完成后再查找包含指定文本的 div 并点击。无任何面板；保留红/蓝点用于核对；移动端可用。
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/549721/%E6%97%A0%E9%9D%A2%E6%9D%BF%E6%89%8B%E6%9C%BA%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/549721/%E6%97%A0%E9%9D%A2%E6%9D%BF%E6%89%8B%E6%9C%BA%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.__GDC_LOADED__) return; window.__GDC_LOADED__ = true;

  /*** 配置（按需改） ***/
  const CFG = {
    apiUrl: 'http://www.bingtop.com/ocr/upload/',
    version: '3.1.1',
    captchaType: 2302,
    username: 'zyzy5',
    password: 'NySfHLaZT6dXyg2',
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
    finalDivContains: ['验证'], // 需要查找的文本（任意一个命中即点击）
    finalClickDelayMs: 200,                 // 完成坐标点击后，等待再去找 div 的延迟
    finalSearchWithinBaseFirst: true        // 先在当前验证码容器内找，再全局找
  };

  /*** 运行状态 ***/
  const sleep = (ms)=>new Promise(r=>setTimeout(r, ms));
  const CLICK = {
    target: 'auto',
    times: 1,
    intervalMs: 300,
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
    const divs = root.querySelectorAll('button');
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
    if(!CFG.finalDivContains || !CFG.finalDivContains.length) return;
    await sleep(Math.max(0, CFG.finalClickDelayMs|0));
    let target = null;
    if (CFG.finalSearchWithinBaseFirst && baseEl) {
      target = findDivByTexts(CFG.finalDivContains, baseEl);
    }
    if (!target) target = findDivByTexts(CFG.finalDivContains, document);
    if (!target) return;

    const r = target.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top  + r.height/2;
    dot(cx, cy, 'rgba(160,0,255,0.95)', 6); // 紫点表示“最终按钮”
    const hit = document.elementFromPoint(cx,cy) || target;
    fireHybridChain(hit, cx, cy);
  }

  /*** 主流程：截图→（下载）→上传→解析→映射→点击/拖动→最终 div 点击 ***/
  async function captureUploadAndAct(el){
    if(!CFG.apiUrl) return;
    if(!CFG.captchaType) return;
    if(!CFG.usertoken && (!CFG.username||!CFG.password)) return;

    try{ el.scrollIntoView({block:'nearest'}); }catch{}

    // 蓝色原点（元素左上）
    const rect0=el.getBoundingClientRect();
    dot(rect0.left, rect0.top, 'rgba(0,128,255,0.95)', 8);

    // 截图
    const scale=Math.max(1, Math.min(CFG.maxScale, window.devicePixelRatio||1));
    const allowCORS=!!CFG.renderCORS;
    let canvas;
    try{
      canvas=await html2canvas(el,{backgroundColor:null,scale,useCORS:allowCORS,allowTaint:allowCORS,logging:false,imageTimeout:8000,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight});
    }catch{ return; }

    downloadCanvas(canvas, el);
    copyCanvasToClipboard(canvas);

    // 发送 b64
    const dataUrl=canvas.toDataURL('image/png'); const idx=dataUrl.indexOf('base64,'); const b64_raw=idx>=0?dataUrl.slice(idx+7):dataUrl;
    const payload={ captchaType:CFG.captchaType, version:CFG.version };
    if(CFG.usertoken) payload.usertoken=CFG.usertoken; else { payload.username=CFG.username; payload.password=CFG.password; }
    if(CFG.developer) payload.developer=CFG.developer;
    if(CFG.pictureID) payload.pictureID=CFG.pictureID;
    if(CFG.rotate && /^(90|180|270)$/.test(CFG.rotate)) payload.rotate=CFG.rotate;
    payload.captchaData=b64_raw;

    // onload 快捷点击（逐点间隔 + 结束后 finalClick）
    let quickClicked=false;
    const doQuickRecognize=(recogStr)=>{
      (async()=>{
        quickClicked=true;
        const rect=el.getBoundingClientRect();
        const sx=rect.width/(canvas.width||1);
        const sy=rect.height/(canvas.height||1);
        const parts=String(recogStr).replace(/[，]/g,',').split(/[|；;\s]+/).filter(Boolean);
        for(const pair of parts){
          const [xs,ys]=pair.replace(/[×xX：:]/g,',').split(',');
          const x=Number(xs), y=Number(ys);
          if(!Number.isFinite(x)||!Number.isFinite(y)) continue;
          const cx=rect.left + (x + (CLICK.offsetX||0))*sx;
          const cy=rect.top  + (y + (CLICK.offsetY||0))*sy;
          dot(cx,cy,'rgba(255,0,0,0.95)',6);
          const hit=document.elementFromPoint(cx,cy)||el;
          fireHybridChain(hit, cx, cy);
          await sleep(CLICK.intervalMs);
        }
        // ✅ 所有坐标点点击完毕 → 尝试点击包含指定文本的 div
        await finalClickAfterAll(el);
      })().catch(()=>{});
    };

    // 发请求
    let resp;
    try{
      resp=await postViaGMXHR(CFG.apiUrl, payload, {encoding:CFG.reqEncoding, timeout:CFG.timeoutMs, retries:CFG.retries}, doQuickRecognize);
    }catch{ return; }

    if(quickClicked) return;

    // 常规解析
    const parsed=normalizeApiResponse(resp);
    if(!parsed.ok) return;

    const data=parsed.data||{};
    if(typeof data.recognition==='string' && data.recognition.trim()){
      doQuickRecognize(data.recognition.trim());
      return;
    }

    // 兼容 {缺口, 滑块}
    const rect=el.getBoundingClientRect();
    const sx=rect.width/(canvas.width||1);
    const sy=rect.height/(canvas.height||1);
    const coord=pickCoords(data, CLICK.target);

    if(CLICK.enableDrag && coord.slider && coord.gap){
      const startX=rect.left+(coord.slider.x+CLICK.offsetX)*sx;
      const startY=rect.top +(coord.slider.y+CLICK.offsetY)*sy;
      const endX  =rect.left+(coord.gap.x   +CLICK.offsetX)*sx;
      const endY  =rect.top +(coord.gap.y   +CLICK.offsetY)*sy;
      dot(startX,startY,'rgba(255,180,0,0.95)',6);
      dot(endX,endY,'rgba(160,0,255,0.95)',6);
      await dragFromTo(startX,startY,endX,endY,CLICK.dragDuration,CLICK.dragSteps);
      await finalClickAfterAll(el); // 拖动后也尝试点击指定文本的 div
      return;
    }

    if(coord.x!=null && coord.y!=null){
      const cx=rect.left+(coord.x+CLICK.offsetX)*sx;
      const cy=rect.top +(coord.y+CLICK.offsetY)*sy;
      dot(cx,cy,'rgba(255,0,0,0.95)',6);
      await clickAt(cx, cy, CLICK.times, CLICK.intervalMs, el);
      await finalClickAfterAll(el); // 单点后也尝试
    }
  }

  /*** 仅在“领取/验证”按钮点击后触发 ***/
  const TRIGGER_WORDS = ['领取','立即领取','去领取','验证'];
  function isClaimButton(node){
    if(!node) return false;
    const btn = node.closest && node.closest('button, a, [role="button"], .btn, .button');
    const el = btn || node;
    const text = (el.innerText || el.textContent || '').replace(/\s+/g,'').trim();
    if(!text) return false;
    return TRIGGER_WORDS.some(w => text.includes(w));
  }

  // 扫描一次：找到验证码容器并处理；找到一个就返回 true
  async function scanOnce(){
    // 极验类
    const tipsA = document.querySelectorAll('div[class*="geetest_text_tips"]');
    for (const div of tipsA) {
      const txt=(div.innerText||div.textContent||'').trim();
      if (txt.includes('依次点击'))      CFG.captchaType = 2316;
      else if (txt.includes('符合右图'))  CFG.captchaType = 2302;
      const box = div.closest('div[class*="geetest_box_"]');
      if (box) { await captureUploadAndAct(box); return true; }
    }
    // 图片网格/滑块类
    const tipsB = document.querySelectorAll('div[class*="image-grid-instruction"]');
    for (const div of tipsB) {
      const txt=(div.innerText||div.textContent||'').trim();
      if (txt.includes('依次点击'))               CFG.captchaType = 2316;
      else if (txt.includes('包含以下物体的图片')) CFG.captchaType = 2303;
      const box = div.closest('div[class*="slider"]') || div.closest('div[class*="captcha"]');
      if (box) { await captureUploadAndAct(box); return true; }
    }
    // 兜底：常见类名
    const fb = document.querySelector('.geetest_box, .geetest_box_holder, .slider, .captcha, [class*="captcha"]');
    if (fb) { await captureUploadAndAct(fb); return true; }
    return false;
  }

  // 等弹层渲染后多次扫描
  async function scanAfterClick(){
    for (let i=0;i<10;i++){
      const ok = await scanOnce();
      if (ok) return;
      await sleep(150);
    }
  }

  document.addEventListener('click', (e)=>{
    if (!isClaimButton(e.target)) return;
    setTimeout(()=>{ scanAfterClick().catch(()=>{}); }, 600);
  }, true);

})();
