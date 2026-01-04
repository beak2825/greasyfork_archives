// ==UserScript==
// @name         元素截图→GMXHR上传→按返回坐标点击（v4.7.0：修复MouseEvent view错误/多点依次点击/Hybrid事件链/映射修正/可视化）
// @namespace    http://tampermonkey.net/
// @version      4.7.0
// @license MIT
// @description  收到识别结果后：按“截图像素→真实DOM”比例映射，逐点（带间隔）点击；使用 Touch→Pointer(touch)→Mouse 的混合事件链；移除 MouseEvent 的 view 字段以避免 WebView 构造错误；GMXHR onload 即时点击；可视化红点/蓝点与调试日志。
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/549713/%E5%85%83%E7%B4%A0%E6%88%AA%E5%9B%BE%E2%86%92GMXHR%E4%B8%8A%E4%BC%A0%E2%86%92%E6%8C%89%E8%BF%94%E5%9B%9E%E5%9D%90%E6%A0%87%E7%82%B9%E5%87%BB%EF%BC%88v470%EF%BC%9A%E4%BF%AE%E5%A4%8DMouseEvent%20view%E9%94%99%E8%AF%AF%E5%A4%9A%E7%82%B9%E4%BE%9D%E6%AC%A1%E7%82%B9%E5%87%BBHybrid%E4%BA%8B%E4%BB%B6%E9%93%BE%E6%98%A0%E5%B0%84%E4%BF%AE%E6%AD%A3%E5%8F%AF%E8%A7%86%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549713/%E5%85%83%E7%B4%A0%E6%88%AA%E5%9B%BE%E2%86%92GMXHR%E4%B8%8A%E4%BC%A0%E2%86%92%E6%8C%89%E8%BF%94%E5%9B%9E%E5%9D%90%E6%A0%87%E7%82%B9%E5%87%BB%EF%BC%88v470%EF%BC%9A%E4%BF%AE%E5%A4%8DMouseEvent%20view%E9%94%99%E8%AF%AF%E5%A4%9A%E7%82%B9%E4%BE%9D%E6%AC%A1%E7%82%B9%E5%87%BBHybrid%E4%BA%8B%E4%BB%B6%E9%93%BE%E6%98%A0%E5%B0%84%E4%BF%AE%E6%AD%A3%E5%8F%AF%E8%A7%86%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 防重复加载
  if (window.__GDC_LOADED__) return; window.__GDC_LOADED__ = true;

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
    debug: true,
    showDots: true
  };

  const seen = new WeakSet();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ===== debug / toast =====
  let __dbgBox;
  function debug(obj){
    try{
      if(!CFG.debug) return;
      if(!__dbgBox){
        __dbgBox=document.createElement('div');
        Object.assign(__dbgBox.style,{
          position:'fixed', left:'12px', bottom:'12px', zIndex:2147483600,
          width:'520px', maxHeight:'40vh', overflow:'auto',
          background:'rgba(0,0,0,0.9)', color:'#0f0', fontSize:'12px',
          padding:'8px 10px', borderRadius:'8px', whiteSpace:'pre-wrap',
          lineHeight:'1.35', fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace'
        });
        document.body.appendChild(__dbgBox);
      }
      const ts = new Date().toLocaleTimeString();
      __dbgBox.textContent += `\n[${ts}] ${JSON.stringify(obj, null, 2)}\n`;
      __dbgBox.scrollTop = __dbgBox.scrollHeight;
    }catch{}
  }
  let toastTimer=null;
  function toast(text, ms=2000){
    const tip=document.createElement('div');
    Object.assign(tip.style,{
      position:'fixed', left:'50%', top:'20px', transform:'translateX(-50%)',
      background:'rgba(0,0,0,0.85)', color:'#fff', padding:'8px 12px',
      borderRadius:'10px', zIndex:2147483000, fontSize:'13px'
    });
    tip.textContent=text; document.documentElement.appendChild(tip);
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>tip.remove(), ms);
  }

  // ===== 可视化打点层（fixed=client坐标系）=====
  const LAYER_ID='gdc_mark_layer';
  function ensureLayer(){
    let layer=document.getElementById(LAYER_ID);
    if(!layer){
      layer=document.createElement('div');
      layer.id=LAYER_ID;
      Object.assign(layer.style,{ position:'fixed', left:'0', top:'0', width:'1px', height:'1px', zIndex:'2147483647', pointerEvents:'none' });
      document.documentElement.appendChild(layer);
    }
    return layer;
  }
  function dot(x,y,color='rgba(255,0,0,0.95)',size=6){
    if(!CFG.showDots) return;
    const layer=ensureLayer(); const d=document.createElement('div'), r=size/2;
    Object.assign(d.style,{
      position:'fixed', left:(x-r)+'px', top:(y-r)+'px',
      width:size+'px', height:size+'px', borderRadius:'50%',
      background:color, pointerEvents:'none',
      boxShadow:'0 0 0 2px rgba(0,0,0,0.15)'
    });
    layer.appendChild(d);
  }

  // ===== 点击/拖动参数 =====
  const CLICK = {
    target: 'auto',
    times: 1,
    intervalMs: 300, // 逐点间隔
    offsetX: 0,
    offsetY: 0,
    enableDrag: true,
    dragDuration: 800,
    dragSteps: 20
  };

  // ===== Hybrid 事件链（Touch → Pointer(touch) → Mouse），去掉 MouseEvent.view 并包 try/catch =====
  function fireHybridChain(el, x, y){
    if(!el) return;

    // Touch
    try{
      if(typeof Touch!=='undefined' && typeof TouchEvent!=='undefined'){
        const id=Date.now()%10000;
        const t=new Touch({ identifier:id, target:el, clientX:x, clientY:y, pageX:x+scrollX, pageY:y+scrollY, screenX:x, screenY:y });
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches:[t], targetTouches:[t], changedTouches:[t] }));
        el.dispatchEvent(new TouchEvent('touchend',   { bubbles:true, cancelable:true, touches:[],  targetTouches:[],  changedTouches:[t] }));
      }
    }catch(e){ debug({phase:'touch-fail', err:String(e?.message||e)}); }

    // Pointer (touch)
    try{
      if(typeof PointerEvent!=='undefined'){
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, cancelable:true, clientX:x, clientY:y, pointerType:'touch', isPrimary:true, buttons:1, pressure:0.5 }));
        el.dispatchEvent(new PointerEvent('pointerup',   { bubbles:true, cancelable:true, clientX:x, clientY:y, pointerType:'touch', isPrimary:true, buttons:0, pressure:0 }));
      }
    }catch(e){ debug({phase:'pointer-fail', err:String(e?.message||e)}); }

    // Mouse（无 view）
    for(const type of ['mousedown','mouseup','click']){
      try{
        const evt=new MouseEvent(type, { bubbles:true, cancelable:true, clientX:x, clientY:y, button:0 });
        el.dispatchEvent(evt);
      }catch(e){ debug({phase:'mouse-fail', type, err:String(e?.message||e)}); }
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
    const stepDelay=Math.max(0, durationMs/Math.max(1,steps));
    const startEl=document.elementFromPoint(sx,sy)||document.body;

    // 起手（用 Hybrid 起点）
    fireHybridChain(startEl, sx, sy);

    // move（仅 mousemove 足够制造轨迹）
    for(let i=1;i<=steps;i++){
      const t=i/steps, x=sx+(ex-sx)*t, y=sy+(ey-sy)*t;
      try{
        (document.elementFromPoint(x,y)||startEl)
          .dispatchEvent(new MouseEvent('mousemove', { bubbles:true, cancelable:true, clientX:x, clientY:y }));
      }catch(e){ debug({phase:'mousemove-fail', err:String(e?.message||e)}); }
      await sleep(stepDelay);
    }

    const endEl=document.elementFromPoint(ex,ey)||document.body;
    for(const type of ['mouseup','click']){
      try{
        endEl.dispatchEvent(new MouseEvent(type, { bubbles:true, cancelable:true, clientX:ex, clientY:ey, button:0 }));
      }catch(e){ debug({phase:'mouse-end-fail', type, err:String(e?.message||e)}); }
    }
  }

  // ===== 解析响应 =====
  function normalizeApiResponse(resp){
    if(typeof resp==='string'){
      if(/502\s+Bad\s+Gateway/i.test(resp)) return { ok:false, msg:'服务器 502（网关错误/超时）' };
      try{ resp=JSON.parse(resp); }catch{ return { ok:false, msg:'响应不是 JSON：'+resp.slice(0,200) }; }
    }
    if(!resp || typeof resp!=='object') return { ok:false, msg:'响应为空或不是对象' };
    if(Number(resp.code)!==1) return { ok:false, msg:(typeof resp.message==='string'?resp.message:'识别失败'), raw:resp };
    debug({ phase:'parse', jsonKeys:Object.keys(resp||{}) });
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

  // ===== GMXHR（onload 即时点击，逐点串行 + 间隔）=====
  function postViaGMXHR(url, payload, {encoding='form', timeout=20000, retries=2}={}, onQuickRecognize){
    return new Promise(async (resolve, reject)=>{
      const sendOnce=()=>new Promise((res, rej)=>{
        let data, headers={};
        if(encoding==='json'){ headers['Content-Type']='application/json'; data=JSON.stringify(payload); }
        else{
          headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';
          const usp=new URLSearchParams();
          for(const [k,v] of Object.entries(payload)) usp.append(k, typeof v==='string'?v:JSON.stringify(v));
          data=usp.toString();
        }
        GM_xmlhttpRequest({
          method:'POST', url, headers, data, timeout,
          onload:(xhr)=>{
            const text=xhr.responseText||'';
            // 快捷点击：收到就点（不阻塞 resolve）
            try{
              const j=JSON.parse(text);
              const recog=j?.data?.recognition;
              if(typeof recog==='string' && recog.trim() && typeof onQuickRecognize==='function'){
                onQuickRecognize(recog.trim());
              }
            }catch{}
            debug({ phase:'http', status:xhr.status, url, enc:encoding, raw:text.slice(0,600) });
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
        catch(e){
          if(i===total-1) return reject(e);
          const backoff=Math.min(2500, 300*Math.pow(2,i));
          debug({ phase:'retry', attempt:i+1, wait:backoff, error:e.message });
          await sleep(backoff);
        }
      }
    });
  }

  // ===== 主流程：截图→上传→解析→映射→点击/拖动 =====
  async function captureUploadAndAct(el){
    try{ (typeof CLICK_SYNC==='function') && CLICK_SYNC(); }catch{}
    if(!CFG.apiUrl) return toast('请先填写 API 地址');
    if(!CFG.captchaType) return toast('请先填写 模型ID');
    if(!CFG.usertoken && (!CFG.username||!CFG.password)) return toast('请填写 usertoken，或用户名+密码');
    try{ el.scrollIntoView({ block:'nearest' }); }catch{}

    const rect0=el.getBoundingClientRect();
    dot(rect0.left, rect0.top, 'rgba(0,128,255,0.95)', 8);
    debug({ phase:'pre-capture', rect:{ left:rect0.left, top:rect0.top, w:rect0.width, h:rect0.height } });

    // 截图
    const scale=Math.max(1, Math.min(CFG.maxScale, window.devicePixelRatio||1));
    const allowCORS=!!CFG.renderCORS;
    let canvas;
    try{
      canvas=await html2canvas(el, {
        backgroundColor:null, scale,
        useCORS:allowCORS, allowTaint:allowCORS,
        logging:false, imageTimeout:8000,
        windowWidth:document.documentElement.scrollWidth,
        windowHeight:document.documentElement.scrollHeight
      });
    }catch(err){
      console.error('截图失败：', err);
      return alert('截图失败：'+(err?.message||err));
    }

    // 仅发送 b64
    const dataUrl=canvas.toDataURL('image/png');
    const idx=dataUrl.indexOf('base64,');
    const b64_raw=idx>=0?dataUrl.slice(idx+7):dataUrl;

    const payload={ captchaType:CFG.captchaType, version:CFG.version };
    if(CFG.usertoken) payload.usertoken=CFG.usertoken; else { payload.username=CFG.username; payload.password=CFG.password; }
    if(CFG.developer) payload.developer=CFG.developer;
    if(CFG.pictureID) payload.pictureID=CFG.pictureID;
    if(CFG.rotate && /^(90|180|270)$/.test(CFG.rotate)) payload.rotate=CFG.rotate;
    payload.captchaData=b64_raw;

    // onload 快捷点击（逐点 await + 间隔）
    let quickClicked=false;
    const doQuickRecognize=(recogStr)=>{
      (async()=>{
        quickClicked=true;
        const rect=el.getBoundingClientRect();
        const sx=rect.width/(canvas.width||1);
        const sy=rect.height/(canvas.height||1);
        const parts=String(recogStr).replace(/[，]/g,',').split(/[|；;\s]+/).filter(Boolean);
        let count=0;
        for(const pair of parts){
          const [xs,ys]=pair.replace(/[×xX：:]/g,',').split(',');
          const x=Number(xs), y=Number(ys);
          if(!Number.isFinite(x) || !Number.isFinite(y)) continue;
          const cx=rect.left + (x + (CLICK.offsetX||0))*sx;
          const cy=rect.top  + (y + (CLICK.offsetY||0))*sy;
          dot(cx,cy,'rgba(255,0,0,0.95)',6);
          const hit=document.elementFromPoint(cx,cy)||el;
          fireHybridChain(hit, cx, cy);
          count++;
          await sleep(CLICK.intervalMs); // 逐点间隔
        }
        toast(`已按 recognition 点击 ${count} 点`);
        debug({ phase:'quick-click', count });
      })().catch(err=>debug({ phase:'quick-click-error', err:String(err?.message||err) }));
    };

    // 发请求（带 onQuickRecognize）
    let resp;
    try{
      resp=await postViaGMXHR(
        CFG.apiUrl,
        payload,
        { encoding:CFG.reqEncoding, timeout:CFG.timeoutMs, retries:CFG.retries },
        doQuickRecognize
      );
    }catch(e){
      console.error('上传失败：', e);
      return alert('上传失败：'+(e&&e.message||e));
    }

    if(quickClicked) return; // onload已完成逐点点击

    // 常规解析与回退点击
    const parsed=normalizeApiResponse(resp);
    if(!parsed.ok) return toast(parsed.msg||'识别失败');

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
      dot(rect.left, rect.top, 'rgba(0,128,255,0.95)', 8);
      dot(startX, startY, 'rgba(255,180,0,0.95)', 6);
      dot(endX, endY, 'rgba(160,0,255,0.95)', 6);
      await dragFromTo(startX,startY,endX,endY,CLICK.dragDuration,CLICK.dragSteps);
      toast('已拖动 滑块→缺口');
      return;
    }

    if(coord.x!=null && coord.y!=null){
      const cx=rect.left+(coord.x+CLICK.offsetX)*sx;
      const cy=rect.top +(coord.y+CLICK.offsetY)*sy;
      dot(rect.left, rect.top, 'rgba(0,128,255,0.95)', 8);
      dot(cx, cy, 'rgba(255,0,0,0.95)', 6);
      await clickAt(cx, cy, CLICK.times, CLICK.intervalMs, el);
      toast('已点击坐标');
      return;
    }

    debug({ phase:'no-coords', dataKeys:Object.keys(data||{}) });
    toast('返回中没有可用坐标');
  }

  // ===== UI 面板 =====
  const zBase=2147483000;
  const PANEL_ID='gm-main-panel';
  let panel=document.getElementById(PANEL_ID);
  if(!panel){
    panel=document.createElement('div'); panel.id=PANEL_ID;
    Object.assign(panel.style,{
      position:'fixed', top:'12px', right:'12px', zIndex:zBase,
      background:'rgba(0,0,0,0.85)', color:'#fff', padding:'12px',
      borderRadius:'12px', fontSize:'13px', lineHeight:'1.35',
      boxShadow:'0 8px 24px rgba(0,0,0,0.25)', maxWidth:'420px', backdropFilter:'blur(4px)'
    });
    panel.innerHTML=`
      <div style="font-weight:700;margin-bottom:8px;">元素截图 · GMXHR上传 · 坐标点击</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
        <button id="gm-btn-pick" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;">选取元素</button>
        <button id="gm-btn-cancel" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;">取消</button>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px;">
        <input id="gm-input-selector" placeholder="CSS 选择器，如 #app .card" style="flex:1;padding:6px 8px;border-radius:8px;border:none;outline:none;color:#222;">
        <button id="gm-btn-shot-selector" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;">截取</button>
      </div>
      <details open style="margin-bottom:8px;">
        <summary style="cursor:pointer;">点击/拖动设置（相对选定元素）</summary>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;">
          <label>目标：
            <select id="gm-click-target" style="margin-left:6px;padding:4px 6px;border-radius:8px;border:none;color:#222;">
              <option value="auto">自动（优先缺口）</option>
              <option value="缺口">缺口</option>
              <option value="滑块">滑块</option>
            </select>
          </label>
          <label>次数：
            <input id="gm-click-times" type="number" min="1" value="1" style="width:70px;margin-left:6px;padding:4px 6px;border-radius:8px;border:none;color:#222;">
          </label>
          <label>间隔(ms)：
            <input id="gm-click-interval" type="number" min="50" value="300" style="width:90px;margin-left:6px;padding:4px 6px;border-radius:8px;border:none;outline:none;color:#222;">
          </label>
          <label>偏移X：
            <input id="gm-click-offx" type="number" value="0" style="width:80px;margin-left:6px;padding:4px 6px;border-radius:8px;border:none;color:#222;">
          </label>
          <label>偏移Y：
            <input id="gm-click-offy" type="number" value="0" style="width:80px;margin-left:6px;padding:4px 6px;border-radius:8px;border:none;color:#222;">
          </label>
          <label>拖动：
            <input id="gm-click-drag" type="checkbox" checked style="margin-left:6px;">
            <span>有滑块&缺口时，从滑块拖到缺口</span>
          </label>
        </div>
      </details>
      <div id="gm-tip" style="opacity:0.9;">提示：点“选取元素”后，单击即截图并上传（GMXHR）；成功后在元素内按坐标点击/拖动。</div>
    `;
    document.documentElement.appendChild(panel);
  }

  // 绑定控件
  const $=id=>document.getElementById(id);
  const btnPick=$('gm-btn-pick'), btnCancel=$('gm-btn-cancel'), inputSel=$('gm-input-selector'), btnShotSel=$('gm-btn-shot-selector'), tip=$('gm-tip');
  const elTarget=$('gm-click-target'), elTimes=$('gm-click-times'), elInterval=$('gm-click-interval'), elOffX=$('gm-click-offx'), elOffY=$('gm-click-offy'), elDrag=$('gm-click-drag');

  const CLICK_SYNC=()=>{
    CLICK.target=(elTarget?.value||'auto');
    CLICK.times=Math.max(1, parseInt(elTimes?.value||'1',10));
    CLICK.intervalMs=Math.max(50, parseInt(elInterval?.value||'300',10));
    CLICK.offsetX=parseInt(elOffX?.value||'0',10)||0;
    CLICK.offsetY=parseInt(elOffY?.value||'0',10)||0;
    CLICK.enableDrag=!!elDrag?.checked;
  };
  [elTarget, elTimes, elInterval, elOffX, elOffY, elDrag].forEach(el=>el&&el.addEventListener('change', CLICK_SYNC));
  if(elDrag) elDrag.checked=CLICK.enableDrag;

  // 选取高亮
  const highlight=document.createElement('div');
  Object.assign(highlight.style,{
    position:'fixed', border:'2px dashed #00E5FF', borderRadius:'6px',
    boxShadow:'0 0 0 9999px rgba(0,0,0,0.15) inset', pointerEvents:'none',
    zIndex: zBase - 1, display:'none'
  });
  document.documentElement.appendChild(highlight);

  let picking=false;
  const isInsidePanel=t=>panel.contains(t)||t===panel;
  const rectOnScreen=el=>{
    const r=el.getBoundingClientRect();
    Object.assign(highlight.style,{ display:'block', left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px' });
  };
  const onMove=e=>{
    if(!picking) return;
    const t=e.target;
    if(!t || isInsidePanel(t)){ highlight.style.display='none'; return; }
    rectOnScreen(t);
  };
  const onClickPick=async e=>{
    if(!picking) return;
    const t=e.target;
    if(!t || isInsidePanel(t)) return;
    e.preventDefault(); e.stopPropagation();
    disablePicking();
    await captureUploadAndAct(t);
  };
  const onKey=e=>{ if(e.key==='Escape') disablePicking(); };

  function enablePicking(){
    if(picking) return;
    picking=true;
    tip.textContent='选取模式：单击元素后会截图并上传（GMXHR）；ESC 退出。';
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClickPick, true);
    document.addEventListener('keydown', onKey, true);
  }
  function disablePicking(){
    picking=false;
    tip.textContent='提示：点“选取元素”后，单击即截图并上传；成功则在元素内点击/拖动。';
    highlight.style.display='none';
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClickPick, true);
    document.removeEventListener('keydown', onKey, true);
  }

  btnPick?.addEventListener('click', enablePicking);
  btnCancel?.addEventListener('click', disablePicking);
  btnShotSel?.addEventListener('click', async ()=>{
    const sel=(inputSel.value||'').trim();
    if(!sel) return alert('请输入 CSS 选择器');
    const el=document.querySelector(sel);
    if(!el) return alert('未找到元素：'+sel);
    await captureUploadAndAct(el);
  });

  // 自动触发（保持你的原逻辑）
  async function tick(){
    // 极验文案
    const tipsA=document.querySelectorAll('div[class*="geetest_text_tips"]');
    for(const div of tipsA){
      if(seen.has(div)) continue; seen.add(div);
      const text=(div.innerText||div.textContent||'').trim();
      if(text.includes('依次点击')) CFG.captchaType=2316;
      else if(text.includes('符合右图')) CFG.captchaType=2302;
      const box=div.closest('div[class*="geetest_box_"]');
      if(box){ window.targetclass=box.className; await captureUploadAndAct(box); }
    }
    // 图片网格
    const tipsB=document.querySelectorAll('div[class*="image-grid-instruction"]');
    for(const div of tipsB){
      if(seen.has(div)) continue; seen.add(div);
      const text=(div.innerText||div.textContent||'').trim();
      if(text.includes('依次点击')) CFG.captchaType=2316;
      else if(text.includes('包含以下物体的图片')) CFG.captchaType=2303;
      const box=div.closest('div[class*="slider"]');
      if(box){ window.targetclass=box.className; await captureUploadAndAct(box); }
    }
  }
  let __tickTimer=null;
  document.addEventListener('click', (e)=>{
    const btn=e.target && e.target.closest && e.target.closest('button');
    if(!btn) return;
    if(__tickTimer) clearTimeout(__tickTimer);
    __tickTimer=setTimeout(()=>{ try{ tick(); }catch{} }, 1000);
  }, true);

})();
