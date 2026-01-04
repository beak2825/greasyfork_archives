// ==UserScript==
// @name         Hover Preview Pro — macOS Style
// @namespace    hover-preview-macos
// @version      2.0.0
// @description  鼠标悬停 + Ctrl 打开悬浮预览；macOS风格UI，流畅动画
// @match        *://*/*
// @run-at       document-idle
// @allFrames    true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550148/Hover%20Preview%20Pro%20%E2%80%94%20macOS%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/550148/Hover%20Preview%20Pro%20%E2%80%94%20macOS%20Style.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const MODIFIER = 'Control';     // Control / Shift / Alt
    const OPEN_DELAY = 60;          // 触发延时
    const PANEL_W = 75, PANEL_H = 75;

    const css = `
      /* 遮罩层 */
      .hp-mask {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        z-index: 2147483646;
        display: none;
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .hp-mask.visible {
        background: rgba(0, 0, 0, .4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      /* 主面板 - macOS风格 */
      .hp-panel {
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${PANEL_W}vw;
        height: ${PANEL_H}vh;
        min-width: 600px;
        min-height: 400px;
        transform: translate(-50%, -50%) scale(0.85);
        background: linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(251,251,253,0.94) 100%);
        border-radius: 12px;
        box-shadow:
          0 22px 70px rgba(0, 0, 0, 0.25),
          0 10px 30px rgba(0, 0, 0, 0.12),
          0 0 0 0.5px rgba(0, 0, 0, 0.08),
          inset 0 0 0 0.5px rgba(255, 255, 255, 0.8);
        display: grid;
        grid-template-rows: 38px 1fr;
        overflow: hidden;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .hp-panel.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }

      /* 标题栏 - 仿 macOS */
      .hp-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.45) 100%);
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
        cursor: move;
        user-select: none;
        -webkit-app-region: drag;
      }

      /* 窗口控制按钮组 */
      .hp-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      /* macOS 风格圆形按钮 */
      .hp-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 0.5px solid rgba(0, 0, 0, 0.12);
        cursor: pointer;
        transition: all 0.2s ease;
        -webkit-app-region: no-drag;
      }

      .hp-dot-close {
        background: linear-gradient(180deg, #FF5F57 0%, #FF3B30 100%);
      }

      .hp-dot-minimize {
        background: linear-gradient(180deg, #FFBD2E 0%, #FFA500 100%);
      }

      .hp-dot-maximize {
        background: linear-gradient(180deg, #28CA42 0%, #00C800 100%);
      }

      .hp-controls:hover .hp-dot-close::after {
        content: "×";
        color: rgba(0, 0, 0, 0.5);
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -1px;
      }

      .hp-controls:hover .hp-dot-minimize::after {
        content: "−";
        color: rgba(0, 0, 0, 0.5);
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -2px;
      }

      .hp-dot:hover {
        filter: brightness(0.9);
      }

      .hp-dot:active {
        filter: brightness(0.8);
      }

      /* 标题文字 */
      .hp-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font: 500 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        color: #3C3C43;
        text-align: center;
        margin-right: 60px;
      }

      /* 新标签打开按钮 */
      .hp-btn {
        appearance: none;
        border: 0;
        background: linear-gradient(180deg, rgba(0,122,255,0.9) 0%, rgba(0,100,220,0.9) 100%);
        color: #fff;
        padding: 5px 12px;
        border-radius: 6px;
        cursor: pointer;
        font: 500 12px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 122, 255, 0.3);
        -webkit-app-region: no-drag;
      }

      .hp-btn:hover {
        background: linear-gradient(180deg, rgba(0,122,255,1) 0%, rgba(0,100,220,1) 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 122, 255, 0.4);
      }

      .hp-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 122, 255, 0.3);
      }

      /* 内容区域 */
      .hp-body {
        position: relative;
        background: #FFFFFF;
        overflow: hidden;
      }

      /* iframe 和图片 */
      .hp-iframe, .hp-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        object-fit: contain;
        background: #FFFFFF;
      }

      /* 加载和错误提示 */
      .hp-tip {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 16px 24px;
        border-radius: 12px;
        background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(245,245,247,0.95) 100%);
        color: #1C1C1E;
        font: 400 14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
        box-shadow:
          0 10px 40px rgba(0, 0, 0, 0.12),
          0 2px 10px rgba(0, 0, 0, 0.06);
        animation: tipFadeIn 0.3s ease-out;
      }

      @keyframes tipFadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }

      /* 加载动画 */
      .hp-loading {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin: 0 auto 12px;
        border: 3px solid rgba(0, 122, 255, 0.2);
        border-top-color: #007AFF;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* 深色模式支持 */
      @media (prefers-color-scheme: dark) {
        .hp-panel {
          background: linear-gradient(145deg, rgba(40,40,42,0.96) 0%, rgba(35,35,37,0.94) 100%);
          box-shadow:
            0 22px 70px rgba(0, 0, 0, 0.5),
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 0 0 0.5px rgba(255, 255, 255, 0.1);
        }

        .hp-header {
          background: linear-gradient(180deg, rgba(60,60,62,0.65) 0%, rgba(50,50,52,0.45) 100%);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .hp-title {
          color: #F2F2F7;
        }

        .hp-body {
          background: #1C1C1E;
        }

        .hp-iframe, .hp-img {
          background: #1C1C1E;
        }

        .hp-tip {
          background: linear-gradient(145deg, rgba(45,45,47,0.98) 0%, rgba(35,35,37,0.95) 100%);
          color: #F2F2F7;
        }
      }

      /* 过渡动画优化 */
      .hp-panel.closing {
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
    `;

    (typeof GM_addStyle === 'function')
      ? GM_addStyle(css)
      : document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

    // UI
    const mask = div('hp-mask');
    const panel = div('hp-panel');
    const header = div('hp-header');

    // macOS 风格控制按钮
    const controls = div('hp-controls');
    const closeBtn = div('hp-dot hp-dot-close');
    const minimizeBtn = div('hp-dot hp-dot-minimize');
    const maximizeBtn = div('hp-dot hp-dot-maximize');
    controls.append(closeBtn, minimizeBtn, maximizeBtn);

    const title = div('hp-title');
    const openBtn = btn('新标签打开');
    const body = div('hp-body');

    header.append(controls, title, openBtn);
    panel.append(header, body);
    mask.append(panel);
    document.documentElement.appendChild(mask);

    // 事件绑定
    closeBtn.addEventListener('click', hide);
    minimizeBtn.addEventListener('click', hide); // 暂时也是关闭
    maximizeBtn.addEventListener('click', () => {
      // 切换全屏
      if (panel.style.width === '95vw') {
        panel.style.width = `${PANEL_W}vw`;
        panel.style.height = `${PANEL_H}vh`;
      } else {
        panel.style.width = '95vw';
        panel.style.height = '95vh';
      }
    });

    mask.addEventListener('click', e => { if (e.target === mask) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); }, true);
    makeDraggable(panel, header);

    // 状态
    let lastX = 0, lastY = 0;
    let timer = null;

    // 捕获阶段
    document.addEventListener('mousemove', e => {
      lastX = e.clientX; lastY = e.clientY;
    }, { passive:true, capture:true });

    document.addEventListener('keydown', e => {
      if (!matchMod(e, MODIFIER)) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const el = document.elementFromPoint(lastX, lastY);
        const url = resolveUrl(el);
        if (url) open(url);
      }, OPEN_DELAY);
    }, true);

    document.addEventListener('keyup', e => {
      if (e.key === MODIFIER || (MODIFIER === 'Control' && e.key === 'Control')) {
        clearTimeout(timer);
      }
    }, true);

    // ====== 核心逻辑：URL 解析 ======
    function resolveUrl(start) {
      if (!start) return null;

      // 1) 当前元素自己或其后代里是否有 <a>
      const selfA = (start.matches?.('a[href]') ? start : start.querySelector?.('a[href]'));
      if (isGoodA(selfA)) return abs(selfA.getAttribute('href'));

      // 2) 向上查找包含当前元素的 <a> 标签
      let cur = start;
      while (cur && cur !== document.documentElement) {
        if (cur.matches?.('a[href]') && isGoodA(cur)) {
          return abs(cur.getAttribute('href'));
        }
        cur = cur.parentElement;
      }

      // 3) 在同一个父节点里（兄弟）找 <a>
      const p = start.parentElement;
      if (p) {
        const sibA = p.querySelector('a[href]');
        if (isGoodA(sibA)) return abs(sibA.getAttribute('href'));
        const altA = p.querySelector('a[href*=".htm"], a[href*="/profile/"], a[class*="images"][href]');
        if (isGoodA(altA)) return abs(altA.getAttribute('href'));
      }

      // 4) 再往上 2~3 层
      cur = start;
      for (let i=0; i<3 && cur && cur !== document.documentElement; i++) {
        cur = cur.parentElement;
        if (!cur) break;
        const a1 = cur.querySelector('a[class*="images"][href]') || cur.querySelector('a[href*="/profile/"]') || cur.querySelector('a[href]');
        if (isGoodA(a1)) return abs(a1.getAttribute('href'));

        const img = cur.querySelector('img[srcset], img[src]');
        if (img) {
          const u = bestSrcFromSrcset(img) || img.getAttribute('src');
          if (isHttp(u)) return abs(u);
        }
      }

      // 5) 背景图兜底
      const bg = getComputedStyle(start).backgroundImage;
      const m = /url\(["']?([^"')]+)["']?\)/.exec(bg || '');
      if (m && isHttp(m[1])) return abs(m[1]);

      return null;
    }

    // ====== 打开预览 ======
    function open(url) {
      body.innerHTML = '';
      title.textContent = decodeURI(url.split('/').pop() || url);
      openBtn.onclick = () => window.open(url, '_blank', 'noopener,noreferrer');

      // 显示动画
      mask.style.display = 'block';
      requestAnimationFrame(() => {
        mask.classList.add('visible');
        panel.classList.add('visible');
      });

      if (isImage(url)) {
        const img = new Image();
        img.className = 'hp-img';
        img.referrerPolicy = 'no-referrer';
        img.onerror = () => showBlocked('图片加载失败');
        img.src = url;
        body.appendChild(img);
        return;
      }

      const ifr = document.createElement('iframe');
      ifr.className = 'hp-iframe';
      ifr.setAttribute('sandbox','allow-same-origin allow-scripts allow-forms allow-popups allow-pointer-lock');

      const loading = div('hp-tip');
      loading.innerHTML = '<div class="hp-loading"></div>正在加载预览…';
      body.appendChild(loading);

      let loaded = false;
      ifr.addEventListener('load', () => {
        loaded = true;
        loading.remove();
      });

      setTimeout(() => {
        if (!loaded) showBlocked('此站点禁止在 iframe 中预览');
      }, 2000);

      ifr.src = url;
      body.appendChild(ifr);
    }

    // ====== 工具函数 ======
    function isGoodA(a){
      return a && a.getAttribute && a.getAttribute('href') && !a.getAttribute('href').startsWith('javascript:');
    }

    function bestSrcFromSrcset(img){
      const ss = img.getAttribute('srcset');
      if (!ss) return null;
      const items = ss.split(',').map(s=>s.trim()).map(s=>{
        const m=s.match(/(\S+)\s+(\d+\.?\d*)(w|x)/i);
        return m ? {url:m[1], val:parseFloat(m[2])} : {url:s.split(/\s+/)[0], val:1};
      });
      items.sort((a,b)=>b.val-a.val);
      return items[0]?.url || null;
    }

    function isHttp(u){ return /^https?:\/\//i.test(u); }
    function isImage(u){ return /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|#|$)/i.test(u); }
    function abs(u){ return new URL(u, location.href).href; }
    function matchMod(e, name){
      return (name==='Control'&&e.ctrlKey)||(name==='Shift'&&e.shiftKey)||(name==='Alt'&&e.altKey);
    }

    function showBlocked(msg){
      body.querySelectorAll('.hp-tip').forEach(n=>n.remove());
      const d=div('hp-tip');
      d.innerHTML = `<strong>${msg}</strong><br><br>点击 "新标签打开" 在新窗口查看`;
      body.appendChild(d);
    }

    function show(){
      mask.style.display = 'block';
      requestAnimationFrame(() => {
        mask.classList.add('visible');
        panel.classList.add('visible');
      });
    }

    function hide(){
      panel.classList.add('closing');
      panel.classList.remove('visible');
      mask.classList.remove('visible');
      setTimeout(() => {
        mask.style.display = 'none';
        panel.classList.remove('closing');
        body.innerHTML = '';
      }, 200);
    }

    function div(cls){
      const d=document.createElement('div');
      if (cls) d.className = cls;
      return d;
    }

    function btn(t,cls='hp-btn'){
      const b=document.createElement('button');
      b.className = cls;
      b.textContent = t;
      return b;
    }

    function makeDraggable(container, handle){
      let sx=0, sy=0, ox=0, oy=0, dragging=false;
      handle.addEventListener('mousedown', (e)=>{
        // 排除控制按钮
        if (e.target.classList.contains('hp-dot') || e.target.classList.contains('hp-btn')) return;
        if (e.button!==0) return;
        dragging=true;
        const r=container.getBoundingClientRect();
        ox=r.left; oy=r.top; sx=e.clientX; sy=e.clientY;
        document.addEventListener('mousemove', move, true);
        document.addEventListener('mouseup', up, true);
        e.preventDefault();
      }, true);

      function move(e){
        if(!dragging) return;
        const dx=e.clientX-sx, dy=e.clientY-sy;
        container.style.left = `${ox + dx + container.offsetWidth/2}px`;
        container.style.top  = `${oy + dy + container.offsetHeight/2}px`;
        container.style.transform = 'translate(-50%, -50%)';
      }

      function up(){
        dragging=false;
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
      }
    }
  })();