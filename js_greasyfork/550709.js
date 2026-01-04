// ==UserScript==
// @name         OCR Box (WeChat-like, corrected fixed) → FastAPI
// @namespace    ocr-demo
// @version      3.2.0
// @description  Alt+0：像微信截图，四周暗化，中间透明；自动探测祖先 transform/缩放并矫正遮罩，消除可见错位
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550709/OCR%20Box%20%28WeChat-like%2C%20corrected%20fixed%29%20%E2%86%92%20FastAPI.user.js
// @updateURL https://update.greasyfork.org/scripts/550709/OCR%20Box%20%28WeChat-like%2C%20corrected%20fixed%29%20%E2%86%92%20FastAPI.meta.js
// ==/UserScript==

(() => {
  const API_BASE = "http://10.63.99.14:8000";
  const API_PATH = "/v1/ocr";
  const LANG = "ch_en";
  const RETURN_BOXES = true;
  const IMAGE_TYPE = "image/jpeg";
  const JPEG_QUALITY = 0.92;
  const HOTKEY = { alt: true, key: "0" };

  const H2C_URLS = [
    "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
    "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    "https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  ];
  async function ensureHtml2Canvas(){
    if (window.html2canvas) return true;
    for (const url of H2C_URLS) {
      try {
        await new Promise((res, rej)=>{
          const s=document.createElement("script");
          s.src=url; s.async=true; s.onload=res; s.onerror=rej;
          (document.head||document.documentElement).appendChild(s);
        });
        if (window.html2canvas) return true;
      } catch {}
    }
    return false;
  }
  const toast=(m,ok=true)=>{const d=document.createElement("div");d.textContent=m;Object.assign(d.style,{position:"fixed",right:"16px",top:"16px",zIndex:2147483647,background:ok?"rgba(16,185,129,.95)":"rgba(239,68,68,.95)",color:"#fff",padding:"8px 12px",borderRadius:"8px",fontSize:"12px",boxShadow:"0 6px 18px rgba(0,0,0,.25)"});document.body.appendChild(d);setTimeout(()=>d.remove(),2200);};
  const showResult=(text)=>{const w=document.createElement("div");Object.assign(w.style,{position:"fixed",right:"16px",bottom:"16px",zIndex:2147483647,width:"min(520px,60vw)",height:"min(280px,40vh)",background:"#111",color:"#fff",borderRadius:"10px",boxShadow:"0 10px 30px rgba(0,0,0,.35)",overflow:"hidden",display:"grid",gridTemplateRows:"36px 1fr"});const b=document.createElement("div");b.textContent="OCR 结果（点击此栏关闭 / ESC）";Object.assign(b.style,{padding:"8px 12px",background:"#222",fontSize:"12px"});const ta=document.createElement("textarea");ta.readOnly=true;ta.value=text;Object.assign(ta.style,{width:"100%",height:"100%",padding:"10px",border:"0",background:"transparent",color:"#fff",fontFamily:"ui-monospace,Menlo,Consolas,monospace",fontSize:"12px"});w.append(b,ta);document.body.appendChild(w);const close=()=>w.remove();b.onclick=close;window.addEventListener("keydown",function onEsc(e){if(e.key==="Escape"){close();window.removeEventListener("keydown",onEsc);}});};

  // --- 关键：探针校正 fixed 错位（祖先 transform/zoom）---
  function applyViewportCorrection(overlay){
    // 初始样式
    overlay.style.position = "fixed";
    overlay.style.left = "0"; overlay.style.top = "0";
    overlay.style.width = "100vw"; overlay.style.height = "100vh";
    overlay.style.transform = "none";
    overlay.style.transformOrigin = "0 0";
    overlay.style.visibility = "hidden";
    document.documentElement.appendChild(overlay);

    // 用一个 1×1 的 fixed 探针测量期望与实际的偏差/缩放
    const probe = document.createElement("div");
    Object.assign(probe.style,{position:"fixed",left:"0",top:"0",width:"1px",height:"1px",pointerEvents:"none"});
    overlay.appendChild(probe);

    // 期望：left/top 应为 0,0，宽高应等于 innerWidth/innerHeight
    const r = overlay.getBoundingClientRect();
    const dx = r.left;                   // 应为 0
    const dy = r.top;                    // 应为 0
    const sx = window.innerWidth  / r.width;   // 期望 = 1
    const sy = window.innerHeight / r.height;  // 期望 = 1

    // 反向矫正：把 overlay 平移(-dx,-dy)，再缩放到匹配视口
    overlay.style.transform = `translate(${-dx}px, ${-dy}px) scale(${sx}, ${sy})`;
    overlay.style.visibility = "visible";
    return { sx, sy, dx, dy }; // 若你后续需要做数值修正，可使用
  }

  // 热键
  window.addEventListener("keydown", async (e)=>{
    const hitAlt = HOTKEY.alt ? e.altKey : true;
    const isZero = e.key==="0" || e.code==="Digit0" || e.code==="Numpad0";
    if (hitAlt && isZero){
      e.preventDefault();
      if (!(await ensureHtml2Canvas())) { toast("无法加载 html2canvas（网络/拦截）", false); return; }
      startBox();
    }
  });

  async function startBox(){
    try { await fetch(`${API_BASE}/healthz`, { cache:"no-store" }); }
    catch { toast("后端不可达，请先启动 FastAPI 或检查端口/CORS", false); return; }

    // 遮罩（先插到 <html>，再做校正）
    const overlay = document.createElement("div");
    overlay.setAttribute("ocr-overlay","1");
    Object.assign(overlay.style, { zIndex: 2147483646, cursor:"crosshair" });

    // 十字线
    const hline = document.createElement("div"), vline = document.createElement("div");
    Object.assign(hline.style,{position:"fixed",left:0,width:"100vw",height:"1px",background:"rgba(255,255,255,.6)",pointerEvents:"none",display:"none",zIndex:2147483647});
    Object.assign(vline.style,{position:"fixed",top:0,height:"100vh",width:"1px",background:"rgba(255,255,255,.6)",pointerEvents:"none",display:"none",zIndex:2147483647});
    overlay.append(hline, vline);

    // 四遮罩（暗化，形成透明洞）
    const dimTop = mkDim(), dimLeft = mkDim(), dimRight = mkDim(), dimBottom = mkDim();
    overlay.append(dimTop, dimLeft, dimRight, dimBottom);
    function mkDim(){ const d=document.createElement("div"); Object.assign(d.style,{position:"fixed",background:"rgba(0,0,0,.38)",pointerEvents:"none",zIndex:2147483646}); return d; }
    function placeDims(r){
      dimTop.style.left = "0px"; dimTop.style.top = "0px";
      dimTop.style.width = "100vw"; dimTop.style.height = r ? `${r.y}px` : "100vh";
      dimLeft.style.left = "0px"; dimLeft.style.top = r ? `${r.y}px` : "0px";
      dimLeft.style.width = r ? `${r.x}px` : "0px"; dimLeft.style.height = r ? `${r.h}px` : "0px";
      dimRight.style.left = r ? `${r.x + r.w}px` : "100vw";
      dimRight.style.top = r ? `${r.y}px` : "0px";
      dimRight.style.width = r ? `calc(100vw - ${r.x + r.w}px)` : "0px";
      dimRight.style.height = r ? `${r.h}px` : "0px";
      dimBottom.style.left = "0px"; dimBottom.style.top = r ? `${r.y + r.h}px` : "0px";
      dimBottom.style.width = "100vw"; dimBottom.style.height = r ? `calc(100vh - ${r.y + r.h}px)` : "0px";
    }

    // 选框（outline 不占尺寸）
    const box = document.createElement("div");
    Object.assign(box.style,{position:"fixed",outline:"2px solid #4ade80",boxSizing:"border-box",pointerEvents:"none",display:"none",zIndex:2147483647});
    overlay.appendChild(box);

    // 尺寸标签
    const tag = document.createElement("div");
    Object.assign(tag.style,{position:"fixed",padding:"2px 6px",fontSize:"12px",background:"rgba(17,24,39,.95)",color:"#fff",borderRadius:"4px",pointerEvents:"none",display:"none",zIndex:2147483647});
    overlay.appendChild(tag);

    // ——在这里做“固定定位校正”——
    const corr = applyViewportCorrection(overlay); // {sx, sy, dx, dy} 仅用于视觉对齐；坐标仍用原始 clientXY

    // 禁止选择
    const prevSel = document.body.style.userSelect; document.body.style.userSelect="none";
    toast("按下设置左上角 → 拖到右下角；ESC 取消。");

    let start=null, rect=null, dragging=false;

    function cleanup(){
      overlay.remove();
      document.body.style.userSelect = prevSel;
      window.removeEventListener("keydown", onKey);
    }
    function onKey(e){ if (e.key==="Escape") cleanup(); }

    overlay.addEventListener("mousemove",(e)=>{
      // 十字线跟随鼠标（用 clientXY，视觉已被 overlay 的 transform 矫正）
      hline.style.top = e.clientY + "px";
      vline.style.left= e.clientX + "px";
      hline.style.display = vline.style.display = "block";

      if (!dragging || !start) return;
      const cx = Math.max(e.clientX, start.absX);
      const cy = Math.max(e.clientY, start.absY);
      rect = { x: start.x, y: start.y, w: cx - start.absX, h: cy - start.absY };
      Object.assign(box.style,{left:start.absX+"px",top:start.absY+"px",width:rect.w+"px",height:rect.h+"px",display:"block"});
      placeDims({x:start.absX, y:start.absY, w:rect.w, h:rect.h});
      Object.assign(tag.style,{left:(start.absX+rect.w+8)+"px",top:(start.absY+rect.h+8)+"px",display:"block"});
      tag.textContent = `${rect.w} × ${rect.h}`;
    });
    overlay.addEventListener("mousedown",(e)=>{
      const r = overlay.getBoundingClientRect(); // 仅为一致性，未直接使用
      start = { x: e.clientX - r.left, y: e.clientY - r.top, absX: e.clientX, absY: e.clientY };
      dragging = true;
      rect = { x:start.x, y:start.y, w:0, h:0 };
      Object.assign(box.style,{left:start.absX+"px",top:start.absY+"px",width:"0px",height:"0px",display:"block"});
      placeDims({x:start.absX, y:start.absY, w:0, h:0});
      Object.assign(tag.style,{left:(start.absX+8)+"px",top:(start.absY+8)+"px",display:"block"});
    });
    overlay.addEventListener("mouseup", async ()=>{
      if (!dragging) return; dragging=false;
      if (!rect || rect.w < 2 || rect.h < 2) { cleanup(); return; }
      try{
        // 移除遮罩，确保页面回到原样
        overlay.remove();
        // 1:1 快照（CSS 像素 = 画布像素）
        const snap = await window.html2canvas(document.body, {
          backgroundColor:"#fff", useCORS:true, allowTaint:true, scale:1,
          x: window.scrollX, y: window.scrollY,
          width: window.innerWidth, height: window.innerHeight,
          windowWidth: document.documentElement.clientWidth,
          windowHeight: document.documentElement.clientHeight,
          logging:false
        });
        // 直接按 rect（client 坐标）裁剪
        const cut = document.createElement("canvas");
        cut.width = rect.w; cut.height = rect.h;
        cut.getContext("2d").drawImage(snap, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
        await uploadAndOcr(cut);
      }catch(err){
        console.error("[OCR] html2canvas/crop failed:", err);
        toast("截图失败（可能被跨域图片/CSS 阻止）", false);
      }finally{ cleanup(); }
    });

    window.addEventListener("keydown", onKey, { passive:false });
  }

    async function uploadAndOcr(canvas){
        toast("正在上传识别…");
        const blob = await new Promise(r => canvas.toBlob(r, IMAGE_TYPE, JPEG_QUALITY));
        const fd = new FormData();
        fd.append(
            "file",
            new File([blob], IMAGE_TYPE === "image/png" ? "sel.png" : "sel.jpg", { type: IMAGE_TYPE })
        );

        // 新增：把后端可调参数一起带上（可按需调整数值）
        const OCR_PARAMS = {
            lang: LANG,                // "auto" | "ch" | "en" | "ch_en"
            return_boxes: RETURN_BOXES,
            char_type: "en_sensitive", // 更友好符号识别
            box_thresh: 0.45,          // 0.3~0.6
            unclip_ratio: 1.9,         // 1.6~2.2
            drop_score: 0.30,          // 放宽过滤
            max_text_length: 128,
            preprocess: 1              // 开启后端预处理（0/1）
        };
        const qs = new URLSearchParams(
            Object.entries(OCR_PARAMS).map(([k, v]) => [k, String(v)])
        ).toString();

        const url = `${API_BASE}${API_PATH}?${qs}`;

        try {
            const t0 = performance.now();
            const res = await fetch(url, { method: "POST", body: fd, cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const dt = performance.now() - t0;
            showResult(json.text || JSON.stringify(json, null, 2));
            toast(`识别完成（${dt.toFixed(0)} ms）`, true);
        } catch (e) {
            console.error("[OCR] upload failed:", e);
            toast("OCR 调用失败（看控制台/Network）", false);
        }
    }
})();
