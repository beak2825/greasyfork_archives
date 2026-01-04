// ==UserScript==
// @name 红薯放大器
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Viewer: background click close, avoid closing after drag, pan/zoom, and keyboard left/right to switch images.
// @match *://*.xiaohongshu.com/*
// @run-at document-idle
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/555929/%E7%BA%A2%E8%96%AF%E6%94%BE%E5%A4%A7%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555929/%E7%BA%A2%E8%96%AF%E6%94%BE%E5%A4%A7%E5%99%A8.meta.js
// ==/UserScript==
(function(){
  'use strict';
  const LOG = (...a)=>console.log('%cXHS-V2.2','background:#0b5;color:#fff;padding:2px 6px;border-radius:3px;', ...a);
  const ERR = (...a)=>console.error('%cXHS-V2.2','background:#a00;color:#fff;padding:2px 6px;border-radius:3px;', ...a);
  // gallery state (when viewer open)
  let gallery = [];
  let currentIndex = 0;
  let overlayRef = null;
  let imgRef = null;
  let hintRef = null;
  function findClickedImage(target){
    if(!target) return null;
    const img = target.tagName === 'IMG' ? target : (target.closest && target.closest('img'));
    return img || null;
  }
  function makeAbsolute(u){
    try{
      if(!u) return null;
      if(u.startsWith('//')) return location.protocol + u;
      if(u.startsWith('http://') || u.startsWith('https://')) return u;
      return new URL(u, location.href).href;
    }catch(e){ return u; }
  }
  // 找到与当前 img 同一“帖子/容器”下的图片集合（向上找有多张 img 的最近祖先）
  function buildGalleryFromImg(img){
    try{
      if(!img) return [img.src];
      let anc = img.parentElement;
      let found = null;
      while(anc && anc !== document.body){
        const imgs = Array.from(anc.querySelectorAll('img'));
        // 过滤掉极小、像图标之类的图片（可选）
        const realImgs = imgs.filter(i=>{
          const rect = i.getBoundingClientRect();
          return rect.width>30 && rect.height>30;
        });
        if(realImgs.length > 1){
          found = realImgs;
          break;
        }
        anc = anc.parentElement;
      }
      // 如果没找到包含多张的祖先，尝试查找当前视口内的同帖子图片（更宽松）
      if(!found){
        const imgs = Array.from(document.querySelectorAll('img')).filter(i=>{
          const rect = i.getBoundingClientRect();
          return rect.width>30 && rect.height>30;
        });
        // 尝试把与当前 img 相近（在 DOM 距离上较近）的图片聚为一个组：取和当前 img 有同一祖先的前后 8 张
        const idx = imgs.indexOf(img);
        if(idx >= 0){
          const start = Math.max(0, idx-8), end = Math.min(imgs.length, idx+9);
          const slice = imgs.slice(start, end);
          if(slice.length>1) found = slice;
        }
      }
      // 最后兜底：只使用当前图片
      if(!found) found = [img];
      // map to srcs (preserve absolute)
      const srcs = found.map(i => i.currentSrc || i.src || i.getAttribute('data-src') || i.getAttribute('data-original') || '');
      return srcs.map(makeAbsolute);
    }catch(e){
      ERR('buildGalleryFromImg', e);
      return [(img && (img.currentSrc || img.src)) || ''];
    }
  }
  // show image by index (assumes overlay exists) —— 更新现有 img 元素而不重建 overlay
  function showImageAt(index){
    if(!overlayRef || !imgRef) return;
    if(!gallery || gallery.length === 0) return;
    index = (index % gallery.length + gallery.length) % gallery.length;
    currentIndex = index;
    const src = gallery[currentIndex];
    // 设置 src，并在加载后重置 transform（scale/translate）
    imgRef.style.transition = 'transform 0s';
    imgRef.src = src;
    // reset transform params stored on overlayRef
    overlayRef._scale = overlayRef._fitScale || 1;
    overlayRef._tx = 0; overlayRef._ty = 0;
    // apply after image load to compute fit
    imgRef.onload = ()=>{
      const vw = window.innerWidth*0.9, vh = window.innerHeight*0.9;
      const iw = imgRef.naturalWidth || imgRef.width, ih = imgRef.naturalHeight || imgRef.height;
      const fit = Math.min(1, vw/iw, vh/ih) || 1;
      overlayRef._scale = fit;
      overlayRef._tx = 0; overlayRef._ty = 0;
      imgRef.style.transform = `translate(0px, 0px) scale(${overlayRef._scale})`;
      // slight delay remove transition so subsequent drags are immediate
      setTimeout(()=>{ imgRef.style.transition = 'transform 0s'; }, 10);
    };
  }
  function updateHint(){
    if(!hintRef) return;
    hintRef.textContent = '';
  }
  function openViewerForSrcAndGallery(src, srcGallery, startIndex){
    try{
      // 如果已有 overlay，则直接切换（避免重复创建）
      if(overlayRef){
        gallery = srcGallery || gallery;
        currentIndex = typeof startIndex === 'number' ? startIndex : (gallery.indexOf(src) >= 0 ? gallery.indexOf(src) : 0);
        showImageAt(currentIndex);
        return;
      }
      // store old styles to restore on close
      const oldBodyPointer = document.body.style.pointerEvents;
      const oldHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.pointerEvents = 'none';
      document.documentElement.style.overflow = 'hidden';
      const overlay = document.createElement('div');
      overlay.id = 'xhs-viewer-v2-overlay';
      Object.assign(overlay.style, {
        position:'fixed', inset:'0', display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,0,0.95)', zIndex:2147483647, cursor:'grab',
        touchAction:'none', pointerEvents:'auto'
      });
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        maxWidth:'95vw', maxHeight:'95vh', display:'flex', alignItems:'center', justifyContent:'center',
        overflow:'visible'
      });
      const img = document.createElement('img');
      img.draggable = false;
      Object.assign(img.style, {
        maxWidth:'90vw', maxHeight:'90vh', width:'auto', height:'auto',
        display:'block', transformOrigin:'50% 50%', willChange:'transform', userSelect:'none',
        transition:'transform 0s'
      });
      wrapper.appendChild(img);
      overlay.appendChild(wrapper);
      document.body.appendChild(overlay);
      const hint = document.createElement('div');
      Object.assign(hint.style, {
        position:'fixed', left:'50%', transform:'translateX(-50%)', bottom:'18px',
        color:'#ddd', fontSize:'12px', zIndex:2147483648, userSelect:'none', pointerEvents:'none'
      });
      document.body.appendChild(hint);
      // set refs & gallery state
      overlayRef = overlay; imgRef = img; hintRef = hint;
      gallery = srcGallery || [src];
      currentIndex = typeof startIndex === 'number' ? startIndex : (gallery.indexOf(src) >= 0 ? gallery.indexOf(src) : 0);
      // interaction state
      overlayRef._scale = 1;
      overlayRef._tx = 0; overlayRef._ty = 0;
      overlayRef._fitScale = 1;
      let dragging = false, lastX = 0, lastY = 0;
      let pointers = new Map();
      let moved = false;
      const MOVE_THRESHOLD = 4; // px
      // wheel zoom
      overlay.addEventListener('wheel', e=>{
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.12 : 0.9;
        const prev = overlayRef._scale;
        overlayRef._scale = Math.max(0.2, Math.min(8, overlayRef._scale * factor));
        const rect = img.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width/2;
        const cy = e.clientY - rect.top - rect.height/2;
        overlayRef._tx = overlayRef._tx - cx * (overlayRef._scale/prev - 1);
        overlayRef._ty = overlayRef._ty - cy * (overlayRef._scale/prev - 1);
        img.style.transform = `translate(${overlayRef._tx}px, ${overlayRef._ty}px) scale(${overlayRef._scale})`;
      }, {passive:false});
      // pointer events for drag & pinch
      overlay.addEventListener('pointerdown', e=>{
        overlay.setPointerCapture && overlay.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, e);
        if(pointers.size === 1 && (e.target === img || img.contains(e.target))){
          dragging = true; moved = false; lastX = e.clientX; lastY = e.clientY; overlay.style.cursor='grabbing';
        } else if(pointers.size === 2){
          const arr = Array.from(pointers.values());
          overlay._pinchStartDist = Math.hypot(arr[0].clientX-arr[1].clientX, arr[0].clientY-arr[1].clientY);
          overlay._pinchStartScale = overlayRef._scale;
        }
      });
      overlay.addEventListener('pointermove', e=>{
        if(!pointers.has(e.pointerId)) return;
        const prevEvt = pointers.get(e.pointerId);
        pointers.set(e.pointerId, e);
        if(pointers.size === 1 && dragging){
          const dx = e.clientX - lastX, dy = e.clientY - lastY;
          if(Math.hypot(dx, dy) > MOVE_THRESHOLD) moved = true;
          overlayRef._tx += dx; overlayRef._ty += dy;
          lastX = e.clientX; lastY = e.clientY;
          img.style.transform = `translate(${overlayRef._tx}px, ${overlayRef._ty}px) scale(${overlayRef._scale})`;
        } else if(pointers.size === 2){
          const arr = Array.from(pointers.values());
          const cur = Math.hypot(arr[0].clientX-arr[1].clientX, arr[0].clientY-arr[1].clientY);
          if(overlay._pinchStartDist){
            const factor = cur / overlay._pinchStartDist;
            overlayRef._scale = Math.max(0.2, Math.min(8, overlay._pinchStartScale * factor));
            img.style.transform = `translate(${overlayRef._tx}px, ${overlayRef._ty}px) scale(${overlayRef._scale})`;
            moved = true;
          }
        }
      });
      overlay.addEventListener('pointerup', e=>{
        try{ overlay.releasePointerCapture && overlay.releasePointerCapture(e.pointerId); }catch(_){}
        pointers.delete(e.pointerId);
        if(pointers.size === 0){ dragging = false; overlay._pinchStartDist = undefined; overlay.style.cursor='grab'; }
      });
      overlay.addEventListener('pointercancel', e=>{ pointers.delete(e.pointerId); });
      overlay.addEventListener('dblclick', e=>{
        if(e.target === img || img.contains(e.target)){
          overlayRef._scale = overlayRef._fitScale || 1; overlayRef._tx = 0; overlayRef._ty = 0;
          img.style.transform = `translate(0px, 0px) scale(${overlayRef._scale})`;
        }
      });
      // click to close only when truly clicking overlay or wrapper and not after drag
      overlay.addEventListener('click', e=>{
        if(e.button !== 0) return;
        if(moved){ moved = false; return; }
        if(e.target === overlay || e.target === wrapper){
          e.preventDefault(); e.stopPropagation();
          closeViewer();
        }
      }, {capture:true});
      // keyboard handlers: left/right to navigate, Escape to close
      function onKeyNav(ev){
        // don't interfere when typing in input/textarea or contenteditable
        const active = document.activeElement;
        if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        if(ev.key === 'Escape'){ ev.preventDefault(); closeViewer(); }
        else if(ev.key === 'ArrowLeft' || ev.key === 'Left'){ ev.preventDefault(); // prev
          if(gallery && gallery.length>1) showImageAt(currentIndex-1);
        }
        else if(ev.key === 'ArrowRight' || ev.key === 'Right'){ ev.preventDefault(); // next
          if(gallery && gallery.length>1) showImageAt(currentIndex+1);
        }
      }
      window.addEventListener('keydown', onKeyNav);
      // observe overlay removal to cleanup
      const observer = new MutationObserver(()=>{ if(!document.getElementById('xhs-viewer-v2-overlay')){ document.body.style.pointerEvents = oldBodyPointer || ''; document.documentElement.style.overflow = oldHtmlOverflow || ''; observer.disconnect(); window.removeEventListener('keydown', onKeyNav); overlayRef = null; imgRef = null; hintRef = null; }});
      observer.observe(document.body, {childList:true});
      // load initial image via showImageAt (it sets transform etc)
      // first set img.src to something to start load cycle
      img.src = gallery[currentIndex];
      img.onload = ()=>{
        const vw = window.innerWidth*0.9, vh = window.innerHeight*0.9;
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const fit = Math.min(1, vw/iw, vh/ih) || 1;
        overlayRef._fitScale = fit;
        overlayRef._scale = fit;
        overlayRef._tx = 0; overlayRef._ty = 0;
        img.style.transform = `translate(0px, 0px) scale(${overlayRef._scale})`;
      };
      LOG('viewer opened', gallery[currentIndex]);
    }catch(e){ ERR('openViewerForSrcAndGallery', e); }
  }
  function closeViewer(){
    try{
      if(overlayRef) overlayRef.remove();
      if(hintRef) hintRef.remove();
      overlayRef = null; imgRef = null; hintRef = null;
      // restore styles (we store/reset inside open)
      document.body.style.pointerEvents = '';
      document.documentElement.style.overflow = '';
      LOG('viewer closed');
    }catch(e){ ERR('closeViewer', e); }
  }
  // 点击页面：只在可信的左键点击并且目标为 <img> 时打开
  function onDocClick(ev){
    try{
      if(!ev.isTrusted) return;
      if(ev.button !== 0) return;
      const img = findClickedImage(ev.target);
      if(!img) return;
      ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation && ev.stopImmediatePropagation();
      const src = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-original') || '';
      const srcGallery = buildGalleryFromImg(img);
      const startIndex = srcGallery.indexOf(makeAbsolute(src));
      openViewerForSrcAndGallery(makeAbsolute(src), srcGallery, startIndex>=0?startIndex:0);
    }catch(e){ ERR('onDocClick', e); }
  }
  document.removeEventListener('click', onDocClick, true);
  document.addEventListener('click', onDocClick, {capture:true, passive:false});
  LOG('XHS Viewer v2.2 (keyboard nav) loaded');
})();