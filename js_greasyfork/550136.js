// ==UserScript==
// @name         115 艾薇预览+ 极简现代版 3.0.0
// @namespace    https://sleazyfork.org/users/xxxx
// @version      3.0.0
// @description  文件悬停实时预览，极简现代 UI，自定义源，预览窗跟随鼠标
// @author       115脚本优化专家
// @match        https://115.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550136/115%20%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88%2B%20%E6%9E%81%E7%AE%80%E7%8E%B0%E4%BB%A3%E7%89%88%20300.user.js
// @updateURL https://update.greasyfork.org/scripts/550136/115%20%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88%2B%20%E6%9E%81%E7%AE%80%E7%8E%B0%E4%BB%A3%E7%89%88%20300.meta.js
// ==/UserScript==

/* jshint esversion: 2022 */
'use strict';

(() => {
/* ======== 配置 ======== */

const DEFAULT_SOURCE = Object.freeze([
  { name: 'javxx', searchUrl: 'https://javxx.com/cn/v/{code}', imgSel: 'div.image img', titleSel: 'span.code', referer: 'https://javxx.com/' },
  { name: 'javdb', searchUrl: 'https://javdb.com/search?q={code}&f=all', imgSel: 'div.cover img', titleSel: 'div.video-title', referer: 'https://javdb.com/' },
  { name: 'javbus', searchUrl: 'https://www.javbus.com/{code}', imgSel: 'a.bigImage img', titleSel: 'h3', referer: 'https://www.javbus.com/' }
]);
const LS_SRC = 'u115_av_sources_v3';
const LS_IDX = 'u115_av_source_idx';
const CACHE_MIN = 5 * 60 * 1000;
const TEST_CODE = 'HMN-717';


/* ======== 工具 ======== */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const debounce = (fn, w = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), w); }; };
const getVideoCode = (t = '') => {
  const m = t.match(/([a-zA-Z]{2,6})-?(\d{2,5})|heyzo[_-]?(\d{4})|(\d{6})[_-](\d{3})/i);
  if (!m) return '';
  const [, a, b, c, d, e] = m;
  return (a ? `${a}-${b}` : c ? `HEYZO-${c}` : `${d}-${e}`).toUpperCase();
};

/* ======== 缓存 ======== */
const cache = new Map();
const clearOld = () => { const n = Date.now(); for (const [k, v] of cache) if (n - v.ts > CACHE_MIN) cache.delete(k); };
setInterval(clearOld, 60_000);

/* ======== 样式（现代极简） ======== */

const injectCss = () => {
  if ($('#u115-style')) return;
  const s = document.createElement('style');
  s.id = 'u115-style';
  s.textContent = `

  .u115-preview {
  will-change: transform, opacity;   /* GPU 加速 */
  transform: translateZ(0);
}

  .u115-preview.frozen { pointer-events: auto; }
  .frozen-bar .u115-btn { padding: 10px 100px; font-size: 13px; }
  .u115-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:10000;display:flex;align-items:center;justify-content:center}
  .u115-modal{width:90%;max-width:600px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:flex;flex-direction:column;max-height:80vh;overflow:hidden}
 /* 顶部条 */
 .u115-header{
  padding:16px 20px;
  background:linear-gradient(135deg, var(--u115-primary) 80%, #3a7bd5 100%);
  color:#181818;
  border-radius:var(--u115-radius) var(--u115-radius) 0 0;
  font-size:18px;
  display:flex;
  justify-content:space-between;
  align-items:center

  }

 .u115-body{flex:1;overflow:auto;padding:16px 20px;background:#f5f5f7}
  .u115-card{background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,.08);transition:border .2s}
  .u115-card.hl{border:2px solid #06c}
  .u115-card.fail{border:2px solid #e54848}
  .u115-card.ok{border:2px solid #34c759}
  .u115-row{display:flex;gap:10px;margin-bottom:10px;align-items:center}
  .u115-row input{flex:1;padding:8px 10px;border:1px solid #d1d1d6;border-radius:8px;font-size:14px}
  .u115-row label{width:60px;font-size:13px;color:#666}
  .u115-row .icon{font-size:18px;margin-right:4px}
  .u115-thumb{width:70px;height:100px;object-fit:cover;border-radius:6px}
 /* 底部条 */
 .u115-action{
  padding:14px 20px;
  background:linear-gradient(135deg, #3a7bd5 0%, var(--u115-primary) 100%);
  border-radius:0 0 16px 16px;
  text-align:right
  }
  .u115-btn{margin-left:8px;padding:8px 16px;border:none;border-radius:8px;font-size:14px;cursor:pointer;transition:background .2s}
  .u115-btn.primary{background:#06c;color:#fff}
  .u115-btn.danger{background:#e54848;color:#fff}
  .u115-btn.test{background:#34c759;color:#fff}
  .u115-float-btn{position:fixed;left:20px;top:80px;z-index:9999;width:40px;height:40px;background:#06c;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.3);user-select:none;touch-action:none}
  .u115-preview{position:fixed;z-index:10001;background:rgba(255,255,255,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:16px;padding:12px;width:300px;box-shadow:0 12px 40px rgba(0,0,0,.2);display:none;font-size:14px;pointer-events:none}
  .u115-preview img{width:100%;border-radius:10px;min-height:180px;background:#f0f0f0}
  .u115-preview .title{margin-top:8px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
  @media (prefers-color-scheme: dark){
    .u115-modal,.u115-preview{background:#1c1c1e;color:#fff}
    .u115-card{background:#2c2c2e}
    .u115-row input{background:#2c2c2e;border-color:#3a3a3c;color:#fff}
    .u115-dark .u115-preview { background: rgba(30,30,30,.9); color: #fff; }
    .frozen-bar .u115-btn { padding: 4px 12px; font-size: 13px; }

  }`;

  document.head.appendChild(s);

};

/* ============== 预览框：固定右侧 + 瞬隐 ============== */
let previewBox = null, lastRow = null, mouseX = 0, mouseY = 0;


/* 记录鼠标（高频，无节流） */
addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
const createPreview = () => {
  if (previewBox) return previewBox;
  previewBox = document.createElement('div');
  previewBox.className = 'u115-preview';
  previewBox.innerHTML = `<img loading="lazy"/><div class="title"></div>`;


  /* 固定右侧：pointer-events:none 避免干扰 */
  previewBox.style.pointerEvents = 'none';
  previewBox.style.transition = 'opacity .15s ease-out';
  document.body.appendChild(previewBox);
  return previewBox;
};


/* 立即显示并跟随 */
const showPreview = (img, title) => {
  const box = createPreview();
  box.querySelector('img').src = img;
  box.querySelector('.title').textContent = title;
  box.style.opacity = '1';
  box.style.display = 'block';
  followMouse();
};

/* 紧贴鼠标右侧 */
const followMouse = () => {
  if (!previewBox || previewBox.style.display === 'none') return;
  const pad = 12;                       // 与鼠标间距
  const rw = previewBox.offsetWidth;
  let left = mouseX + pad;
  let top  = mouseY - previewBox.offsetHeight / 2;

  /* 边界回弹 */
  if (left + rw > window.innerWidth) left = mouseX - rw - pad;
  if (top < 0) top = 0;
  if (top + previewBox.offsetHeight > window.innerHeight) top = window.innerHeight - previewBox.offsetHeight;
  previewBox.style.left = `${left}px`;
  previewBox.style.top  = `${top}px`;
  requestAnimationFrame(followMouse);   // 60 FPS 跟随
};


/* 瞬隐：先淡出再清空 */
const clearPreview = () => {
  if (!previewBox) return;
  previewBox.style.opacity = '0';
  setTimeout(() => {
    if (previewBox) previewBox.style.display = 'none';
  }, 150);
};
/* ======== 记录鼠标 ======== */
addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

/* ======== 管理面板 ======== */
let sources = JSON.parse(localStorage.getItem(LS_SRC)) || DEFAULT_SOURCE;
let curIdx  = +(localStorage.getItem(LS_IDX) || 0);

const showPanel = () => {
  if ($('.u115-mask')) return;
  const mask = document.createElement('div');
  mask.className = 'u115-mask';
  mask.innerHTML = `
  <div class="u115-modal">
    <div class="u115-header">
      <span>图源管理</span>
      <span id="u115-close" style="cursor:pointer;font-size:20px">×</span>
    </div>
    <div class="u115-body" id="u115-list"></div>
    <div class="u115-action">
      <button class="u115-btn" id="u115-add">＋ 添加源</button>
      <button class="u115-btn primary" id="u115-save">保存并启用</button>
    </div>
  </div>`;
  document.body.appendChild(mask);
  renderPanel();
  $('#u115-close').onclick = () => mask.remove();
  $('#u115-add').onclick = addBlank;
  $('#u115-save').onclick = savePanel;
};
const renderPanel = () => {
  const box = $('#u115-list');
  box.innerHTML = '';
  sources.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'u115-card' + (i === curIdx ? ' hl' : '');
    card.innerHTML = `
    <div class="u115-row">
      <input type="radio" name="av-source" ${i === curIdx ? 'checked' : ''} data-idx="${i}">
      <span class="icon">📎</span><input class="name" placeholder="名称" value="${s.name}">
      <button class="u115-btn test" data-idx="${i}">测试</button>
      <button class="u115-btn danger del" data-idx="${i}">删除</button>
    </div>
    <div class="u115-row"><span class="icon">🔖</span><input class="url" value="${s.searchUrl}" placeholder="搜索地址（含 {code}）"></div>
    <div class="u115-row"><span class="icon">🖼️</span><input class="img" value="${s.imgSel}" placeholder="封面选择器"></div>
    <div class="u115-row"><span class="icon">📝</span><input class="title" value="${s.titleSel}" placeholder="标题选择器"></div>
    <div class="u115-row"><span class="icon">🔗</span><input class="ref" value="${s.referer}" placeholder="Referer（可空）"></div>
    <div class="test-pop" style="display:none;margin-top:8px"></div>`;
    box.appendChild(card);
    card.querySelector('.del').onclick = e => { sources.splice(i, 1); renderPanel(); };
    card.querySelector('.test').onclick = e => testSource(i, card);
    card.querySelector('[name=av-source]').onchange = e => (curIdx = i);
  });

};

const testSource = (idx, card) => {
  const s = sources[idx];
  const url = s.searchUrl.replace('{code}', TEST_CODE);
  const pop = card.querySelector('.test-pop');
  pop.style.display = 'flex';
  pop.innerHTML = `<span style="font-size:13px">测试中…</span>`;
  GM_xmlhttpRequest({
    method: 'GET',
    url,
    headers: { referer: s.referer },
    onload: xhr => {
      const doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      const img = doc.querySelector(s.imgSel);
      const tit = doc.querySelector(s.titleSel);
      if (img && tit) {
        pop.innerHTML = `<img class="u115-thumb" src="${img.src}"><span style="margin-left:8px;color:#34c759">✅ 通过</span>`;
        card.classList.add('ok'); card.classList.remove('fail');
      } else {
        pop.innerHTML = `<span style="color:#e54848">❌ 未匹配</span>`;
        card.classList.add('fail'); card.classList.remove('ok');
      }
    },
    onerror: () => {
      pop.innerHTML = `<span style="color:#e54848">❌ 网络/403</span>`;
      card.classList.add('fail'); card.classList.remove('ok');
    }

  });
};
const addBlank = () => { sources.push({ name: '', searchUrl: '', imgSel: '', titleSel: '', referer: '' }); renderPanel(); };
const savePanel = () => {
  const cards = $$('.u115-card');
  sources = [...cards].map(c => ({
    name: c.querySelector('.name').value.trim(),
    searchUrl: c.querySelector('.url').value.trim(),
    imgSel: c.querySelector('.img').value.trim(),
    titleSel: c.querySelector('.title').value.trim(),
    referer: c.querySelector('.ref').value.trim()
  }));
  localStorage.setItem(LS_SRC, JSON.stringify(sources));
  localStorage.setItem(LS_IDX, curIdx);
  alert('已保存'); $('.u115-mask').remove();
};


/* ======== 主逻辑 ======== */
const init = () => {
  if (!location.search.includes('mode=wangpan')) return;
  injectCss();
  createBtn();
  watchIframe();
};
const createBtn = () => {
  if ($('.u115-float-btn')) return;
  const btn = document.createElement('div');
  btn.className = 'u115-float-btn';
  btn.textContent = '⚙';
  btn.title = '图源管理';
  document.body.appendChild(btn);
  makeDrag(btn);
  btn.onclick = () => showPanel();
};
const watchIframe = () => {
  const ifr = $('iframe[style*="position: absolute; top: 0px"]');
  if (!ifr) return requestAnimationFrame(watchIframe);
  ifr.addEventListener('load', () => {
    const body = ifr.contentDocument.body;

    /* 高频跟随鼠标 */
    body.addEventListener('mousemove', e => {
      const li = e.target.closest('li');
      if (!li) { clearPreview(); return; }
      const title = li.getAttribute('title') || li.textContent || '';
      const code  = getVideoCode(title);
      if (!code) { clearPreview(); return; }
      mouseX = e.clientX; mouseY = e.clientY;
      getInfo(code);
    });
/* === 1. 给单行打指纹：优先读 115 内置属性，避免解析误差 === */
const refreshCode = (li) => {
  // 115 自带文件名在 attribute 里，最准确
  let raw = li.getAttribute('title') || li.querySelector('.file-name')?.textContent || li.textContent;
  const code = getVideoCode(raw);
  if (code) li.dataset.avCode = code;
  return code;
};

/* === 2. 监听整个列表：节点复用时立即刷新指纹 === */
let listObserver;
const watchList = () => {
  const ifr = $('iframe[style*="position: absolute; top: 0px"]');
  if (!ifr) return requestAnimationFrame(watchList);
  const root = ifr.contentDocument.body;

  listObserver = new MutationObserver(muts => {
    for (const m of muts) {
      for (const li of m.addedNodes) {
        if (li.nodeType !== 1) continue;
        if (li.matches && li.matches('li')) refreshCode(li);
        // 处理子行
        li.querySelectorAll && li.querySelectorAll('li').forEach(refreshCode);
      }
    }
  });
  listObserver.observe(root, { childList: true, subtree: true });

  /* 首次全表刷一遍 */
  root.querySelectorAll('li').forEach(refreshCode);
};

/* === 3. 鼠标移动时只读指纹，不再解析文本 === */
const onMouseMove = (e) => {
  const li = e.target.closest('li');
  if (!li) { clearPreview(); return; }
  const code = li.dataset.avCode;   // 只读指纹
  if (!code) { clearPreview(); return; }
  mouseX = e.clientX; mouseY = e.clientY;
  if (code === lastCode) return;    // 同一行
  lastCode = code;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => getInfo(code), 40);
};

/* === 4. 在 watchIframe 里启动 observer === */
const watchIframe = () => {
  const ifr = $('iframe[style*="position: absolute; top: 0px"]');
  if (!ifr) return requestAnimationFrame(watchIframe);
  ifr.addEventListener('load', () => {
    const body = ifr.contentDocument.body;
    body.addEventListener('mousemove', onMouseMove, { passive: true });
    body.addEventListener('mouseleave', clearPreview, true);
    watchList();                   // 关键：监听复用
  });
};
    /* 移出文件名区域瞬间隐藏 */
    body.addEventListener('mouseleave', clearPreview, true);
  });
};

/* === 1. 失败时不再 tryNext === */
const getInfo = code => {
  if (cache.has(code)) {
    const { img, title } = cache.get(code);
    return showPreview(img, title);
  }
 const s = sources[curIdx];   // 用户选定的源
  if (!s) return;
  const url = s.searchUrl.replace('{code}', code);
  GM_xmlhttpRequest({
    method: 'GET',
    url,
    headers: { referer: s.referer },
    timeout: 6000,
    onload: xhr => {
      const doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      const img = doc.querySelector(s.imgSel);
      const tit = doc.querySelector(s.titleSel);
      if (img && tit) {
        cache.set(code, { img: img.src, title: tit.textContent.trim(), ts: Date.now() });
        showPreview(img.src, tit.textContent.trim());
      } else {
        /* ❌ 不再 tryNext，直接静默 */
        clearPreview();
      }
    },
 onerror: () => clearPreview(),   // 网络错也静默
    ontimeout: () => clearPreview()
  });
};

const tryNext = code => {
  const old = curIdx;
  curIdx = (curIdx + 1) % sources.length;
  if (curIdx === old) return;
  localStorage.setItem(LS_IDX, curIdx);
  getInfo(code);
};

/* ======== 拖拽按钮 ======== */
const makeDrag = btn => {
  let drag = false, sx, sy, ix, iy;
  const mem = JSON.parse(localStorage.getItem('u115_btn_pos') || '{}');
  if (mem.x != null) { btn.style.left = mem.x + 'px'; btn.style.top = mem.y + 'px'; }
  const onStart = e => {
    const t = e.touches ? e.touches[0] : e;
    drag = false; sx = t.clientX; sy = t.clientY; ix = btn.offsetLeft; iy = btn.offsetTop;
    btn.style.transition = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };
  const onMove = e => {
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag = true;
    let x = ix + dx, y = iy + dy;
    x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, y));
    btn.style.left = x + 'px'; btn.style.top = y + 'px';
  };
  const onEnd = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    btn.style.transition = '';
    localStorage.setItem('u115_btn_pos', JSON.stringify({ x: btn.offsetLeft, y: btn.offsetTop }));
    setTimeout(() => drag = false, 0);
  };
  btn.addEventListener('mousedown', onStart);
  btn.addEventListener('touchstart', onStart, { passive: false });
  btn.addEventListener('click', e => { if (drag) e.stopImmediatePropagation(); });
};

/* ======== 启动 ======== */
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

/* 换肤快捷键 Alt + T */
let skinIdx = +(localStorage.getItem('u115_skin') || 0);
const skins = ['default','dark','neumorphism','glass'];
addEventListener('keydown', e => {
  if (e.altKey && e.key === 't') {
    e.preventDefault();
    skinIdx = (skinIdx + 1) % skins.length;
    document.documentElement.className = 'u115-skin-' + skins[skinIdx];
    localStorage.setItem('u115_skin', skinIdx);
  }
});
// 首次加载应用皮肤
document.documentElement.classList.add('u115-skin-' + skins[skinIdx]);

/* ========== 冻结-交互模块（精简版） ========== */
(() => {
  let frozen = false, frozenX = 0, frozenY = 0, lastCode = '';

  /* 按键 */
  addEventListener('keydown', e => {
    if (e.key !== 'Shift' || frozen || !previewBox || previewBox.style.display === 'none') return;
    frozen = true;
    frozenX = mouseX; frozenY = mouseY;
    showFrozenBox();
  });
  addEventListener('keyup', e => {
    if (e.key === 'Shift' && frozen) { frozen = false; clearFrozenBox(); }
  });

  let frozenBox = null;
const showFrozenBox = () => {
  if (frozenBox) return;
  /* 1. 克隆 */
  frozenBox = previewBox.cloneNode(true);
  frozenBox.classList.add('frozen');
  /* 2. 强制重置所有子元素 pointer-events */
  frozenBox.style.pointerEvents = 'auto';
  frozenBox.querySelectorAll('*').forEach(el => el.style.pointerEvents = 'auto');
  /* 3. 插按钮 */
  frozenBox.insertAdjacentHTML('beforeend', `
    <div class="frozen-bar" style="display:flex;gap:8px;margin-top:8px">
      <button id="u115Link" class="u115-btn link" title="😘右键保存">😘右键保存</button>
    </div>`);
  document.body.appendChild(frozenBox);
  alignFrozenBox();
  /* 4. 绑事件 */
  $('#u115Link').addEventListener('click', () => confirmJump(lastCode));
};

  const alignFrozenBox = () => {
    if (!frozenBox) return;
    const pad = 12, rw = frozenBox.offsetWidth;
    let left = frozenX + pad, top = frozenY - frozenBox.offsetHeight / 2;
    if (left + rw > window.innerWidth) left = frozenX - rw - pad;
    if (top < 0) top = 0;
    if (top + frozenBox.offsetHeight > window.innerHeight) top = window.innerHeight - frozenBox.offsetHeight;
    frozenBox.style.left = `${left}px`; frozenBox.style.top = `${top}px`;
  };

 const clearFrozenBox = () => {
  if (!frozenBox) return;
  frozenBox.style.opacity = '0';
  setTimeout(() => {
    frozenBox?.remove();
    frozenBox = null;
    previewBox.style.pointerEvents = 'none'; // ← 加这一行
  }, 150);
};
})();
})();