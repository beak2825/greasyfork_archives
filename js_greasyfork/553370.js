// ==UserScript==
// @name         小叶的视频“跳到结尾”助手
// @namespace    https://github.com/YiPort
// @version      1.2.0.1
// @description  默认自动把页面所有视频跳到结尾前 N 秒；支持自动播放（含静音降级），UI 可快捷键呼出；仅顶层页面显示 UI，防重复。
// @author       小叶
// @match        *://*/*
// @license      MIT
// @icon         https://img20.360buyimg.com/openfeedback/jfs/t1/343217/38/22253/32013/690a29b2F838c0b8d/a3269ed44242b2ff.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/553370/%E5%B0%8F%E5%8F%B6%E7%9A%84%E8%A7%86%E9%A2%91%E2%80%9C%E8%B7%B3%E5%88%B0%E7%BB%93%E5%B0%BE%E2%80%9D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553370/%E5%B0%8F%E5%8F%B6%E7%9A%84%E8%A7%86%E9%A2%91%E2%80%9C%E8%B7%B3%E5%88%B0%E7%BB%93%E5%B0%BE%E2%80%9D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // —— 全局单例防重 ——（同一窗口只初始化一次）
  if (window.__XIAOYE_SEEKEND_INIT__) return;
  window.__XIAOYE_SEEKEND_INIT__ = true;

  // —— 只在顶层窗口显示 UI；iframe 中不创建 UI ——
  const IS_TOP = window.top === window.self;

  const CONFIG = {
    STYLE: {
      COLORS: { PRIMARY: '#00A1D6', ACCENT: '#FF8C00' },
      RADIUS: { S: '4px', M: '8px' },
      TRANS: 'all 0.3s ease'
    },
    LAYOUT: { TRIGGER_W: { DEFAULT: '40px', EXPANDED: '80px' } },
    BEHAVIOR: {
      DEFAULT_OFFSET_SEC: 3,
      AUTO_SEEK_ON_LOAD: true,   // 默认自动跳尾
      AUTO_PLAY_ON_SEEK: true,   // ★ 新增：默认自动播放
      SHOW_UI_DEFAULT: false     // 默认不显示 UI（Alt+U 呼出）
    }
  };

  // 存取封装
  const store = {
    get(k, d) {
      try { return typeof GM_getValue === 'function' ? GM_getValue(k, d) : JSON.parse(localStorage.getItem(k)) ?? d; }
      catch { return d; }
    },
    set(k, v) {
      try {
        if (typeof GM_setValue === 'function') GM_setValue(k, v);
        else localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    }
  };

  // 运行时状态
  const STATE = {
    offsetSec: store.get('seek_offset_sec', CONFIG.BEHAVIOR.DEFAULT_OFFSET_SEC),
    autoSeek: store.get('seek_auto', CONFIG.BEHAVIOR.AUTO_SEEK_ON_LOAD),
    autoPlay: store.get('seek_autoplay', CONFIG.BEHAVIOR.AUTO_PLAY_ON_SEEK), // ★ 新增
    uiOpen: false,
  };

  const ids = { trigger: 'seek-end-trigger', panel: 'seek-end-panel' };

  function log(...a){ console.log('[跳尾]', ...a); }

  function flashOnVideo(video, text) {
    const host = video.parentElement || video;
    const tag = document.createElement('div');
    tag.textContent = text;
    Object.assign(tag.style, {
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      borderRadius: CONFIG.STYLE.RADIUS.S,
      zIndex: 999999
    });
    const oldPos = host.style.position;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(tag);
    setTimeout(() => {
      tag.remove();
      if (!oldPos) host.style.position = '';
    }, 2000);
  }

  // ★ 新增：自动播放（含静音降级）
  async function ensurePlayback(video) {
    if (!video) return;
    try {
      if (video.paused) {
        // 优先不静音播放
        await video.play();
      }
    } catch (e1) {
      try {
        // 部分站点策略需要静音才允许自动播放
        video.muted = true;
        video.setAttribute('muted', '');
        await video.play();
        log('自动播放：已静音降级');
      } catch (e2) {
        log('自动播放失败（可能被策略拦截）');
      }
    }
  }

  function seekVideoToEnd(video, offsetSec) {
    if (!video) return;
    const doSeek = async () => {
      const d = Number(video.duration);
      if (Number.isFinite(d) && d > 0) {
        const t = Math.max(0, d - Math.max(0, offsetSec));
        if (!Number.isFinite(video.currentTime) || d - video.currentTime > 0.6) {
          video.currentTime = t;
          video.dispatchEvent(new Event('timeupdate'));
          flashOnVideo(video, offsetSec ? `已跳至结尾 (-${offsetSec}s)` : '已跳至结尾');
          log('seek =>', t.toFixed(2), '/', d.toFixed(2));
        }
        // ★ 跳尾后自动播放
        if (STATE.autoPlay) ensurePlayback(video);
      }
    };
    if (Number.isFinite(video.duration) && video.duration > 0) doSeek();
    else video.addEventListener('loadedmetadata', doSeek, { once: true });
  }

  function seekAllVideos(offset = STATE.offsetSec) {
    const vs = document.querySelectorAll('video');
    if (!vs.length) return;
    vs.forEach(v => seekVideoToEnd(v, offset));
  }

  // ========== UI（仅顶层窗口创建） ==========
  function ensureTrigger() {
    if (!IS_TOP) return;
    if (document.getElementById(ids.trigger)) return;
    const el = document.createElement('div');
    el.id = ids.trigger;
    el.textContent = '跳尾';
    el.style.cssText = `
      position: fixed; right: 0; top: 25%; transform: translateY(-50%);
      z-index: 999999; border: 1px solid ${CONFIG.STYLE.COLORS.ACCENT};
      border-radius: ${CONFIG.STYLE.RADIUS.M};
      background: rgba(255,255,255,0.95);
      width: ${CONFIG.LAYOUT.TRIGGER_W.DEFAULT};
      padding: 8px 6px; text-align: center;
      color: ${CONFIG.STYLE.COLORS.ACCENT};
      font-size: 14px; cursor: pointer; user-select: none;
      transition: ${CONFIG.STYLE.TRANS};
    `;
    el.addEventListener('click', togglePanel);
    el.onmouseenter = () => { el.style.width = CONFIG.LAYOUT.TRIGGER_W.EXPANDED; };
    el.onmouseleave = () => { if (!STATE.uiOpen) el.style.width = CONFIG.LAYOUT.TRIGGER_W.DEFAULT; };
    document.body.appendChild(el);
  }

  function togglePanel() {
    STATE.uiOpen = !STATE.uiOpen;
    if (STATE.uiOpen) {
      createPanel();
      const t = document.getElementById(ids.trigger);
      if (t) t.style.width = CONFIG.LAYOUT.TRIGGER_W.EXPANDED;
    } else {
      const t = document.getElementById(ids.trigger);
      if (t) t.style.width = CONFIG.LAYOUT.TRIGGER_W.DEFAULT;
      const p = document.getElementById(ids.panel);
      p && p.remove();
    }
  }

  function createPanel() {
    if (!IS_TOP) return;
    if (document.getElementById(ids.panel)) return;
    const box = document.createElement('div');
    box.id = ids.panel;
    box.style.cssText = `
      position: fixed; right: 80px; top: 25%; transform: translateY(-50%);
      z-index: 999999; width: 260px; background: rgba(255,255,255,0.98);
      border: 1px solid ${CONFIG.STYLE.COLORS.ACCENT};
      border-radius: ${CONFIG.STYLE.RADIUS.M};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 10px 12px 12px; color: #444; font-size: 14px;
    `;
    const title = document.createElement('div');
    title.textContent = '视频跳到结尾';
    title.style.cssText = `font-weight: bold; color: ${CONFIG.STYLE.COLORS.ACCENT}; margin-bottom: 8px;`;

    // 偏移行
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:6px; margin-bottom:8px;';
    const label = document.createElement('label'); label.textContent = '结尾偏移(秒)：';
    const input = document.createElement('input');
    Object.assign(input, { type: 'number', min: '0', step: '1', value: String(STATE.offsetSec) });
    input.style.cssText = 'width:90px; text-align:center; border:1px solid #ccc; border-radius:4px; padding:2px 4px;';

    // 自动跳尾
    const autoSeekWrap = document.createElement('label');
    autoSeekWrap.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px;';
    const autoSeekChk = document.createElement('input'); autoSeekChk.type = 'checkbox'; autoSeekChk.checked = !!STATE.autoSeek;
    const autoSeekTxt = document.createElement('span'); autoSeekTxt.textContent = '新视频自动跳尾';

    // ★ 自动播放
    const autoPlayWrap = document.createElement('label');
    autoPlayWrap.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px;';
    const autoPlayChk = document.createElement('input'); autoPlayChk.type = 'checkbox'; autoPlayChk.checked = !!STATE.autoPlay;
    const autoPlayTxt = document.createElement('span'); autoPlayTxt.textContent = '跳尾后自动播放（失败将静音重试）';

    // 按钮区
    const btnRow = document.createElement('div'); btnRow.style.cssText = 'display:flex; gap:8px; justify-content:flex-end;';
    const applyBtn = document.createElement('button');
    applyBtn.textContent = '本页全部跳尾';
    applyBtn.style.cssText = `background:${CONFIG.STYLE.COLORS.PRIMARY}; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;`;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `background:#bbb; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;`;

    applyBtn.onclick = () => {
      STATE.offsetSec = Math.max(0, parseInt(input.value || '0', 10));
      store.set('seek_offset_sec', STATE.offsetSec);
      seekAllVideos();
    };
    autoSeekChk.onchange = () => { STATE.autoSeek = !!autoSeekChk.checked; store.set('seek_auto', STATE.autoSeek); };
    autoPlayChk.onchange = () => { STATE.autoPlay = !!autoPlayChk.checked; store.set('seek_autoplay', STATE.autoPlay); }; // ★
    closeBtn.onclick = togglePanel;

    const tip = document.createElement('div');
    tip.style.cssText = 'margin-top:8px; color:#888; font-size:12px; white-space:pre-line;';
    tip.textContent = '快捷键：\nAlt+L  立即跳尾\nAlt+S  切换自动跳尾\nAlt+P  切换自动播放\nAlt+= / Alt+-  偏移±1s\nAlt+0  偏移=0\nAlt+U  显示/隐藏面板';

    row.appendChild(label); row.appendChild(input);
    autoSeekWrap.appendChild(autoSeekChk); autoSeekWrap.appendChild(autoSeekTxt);
    autoPlayWrap.appendChild(autoPlayChk); autoPlayWrap.appendChild(autoPlayTxt);
    btnRow.appendChild(applyBtn); btnRow.appendChild(closeBtn);

    box.appendChild(title);
    box.appendChild(row);
    box.appendChild(autoSeekWrap);
    box.appendChild(autoPlayWrap); // ★
    box.appendChild(btnRow);
    box.appendChild(tip);
    document.body.appendChild(box);
  }

  // ========== 键盘快捷键 ==========
  window.addEventListener('keydown', (e) => {
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) return;
    if (!(e.altKey && !e.ctrlKey && !e.metaKey)) return;

    if (e.key === 'l' || e.key === 'L') { e.preventDefault(); seekAllVideos(); }
    else if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      STATE.autoSeek = !STATE.autoSeek;
      store.set('seek_auto', STATE.autoSeek);
      log('自动跳尾：', STATE.autoSeek ? '开启' : '关闭');
      if (STATE.autoSeek) seekAllVideos();
    }
    else if (e.key === 'p' || e.key === 'P') { // ★ 切换自动播放
      e.preventDefault();
      STATE.autoPlay = !STATE.autoPlay;
      store.set('seek_autoplay', STATE.autoPlay);
      log('自动播放：', STATE.autoPlay ? '开启' : '关闭');
    }
    else if (e.key === '=' || e.key === '+') { e.preventDefault(); STATE.offsetSec = Math.max(0, (STATE.offsetSec|0) + 1); store.set('seek_offset_sec', STATE.offsetSec); log('偏移秒数：', STATE.offsetSec); }
    else if (e.key === '-') { e.preventDefault(); STATE.offsetSec = Math.max(0, (STATE.offsetSec|0) - 1); store.set('seek_offset_sec', STATE.offsetSec); log('偏移秒数：', STATE.offsetSec); }
    else if (e.key === '0') { e.preventDefault(); STATE.offsetSec = 0; store.set('seek_offset_sec', STATE.offsetSec); log('偏移秒数：0'); }
    else if (e.key === 'u' || e.key === 'U') {
      e.preventDefault();
      if (!IS_TOP) return; // iframe 不显示 UI
      const t = document.getElementById(ids.trigger);
      if (t) { t.remove(); const p = document.getElementById(ids.panel); p && p.remove(); STATE.uiOpen = false; }
      else { ensureTrigger(); }
    }
  });

  // ========== 观察新视频 ==========
  const mo = new MutationObserver((muts) => {
    if (!STATE.autoSeek) return;
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((node) => {
          if (node && node.nodeType === 1) {
            if (node.tagName === 'VIDEO') {
              seekVideoToEnd(node, STATE.offsetSec);
            } else {
              const vs = node.querySelectorAll?.('video');
              vs && vs.forEach(v => seekVideoToEnd(v, STATE.offsetSec));
            }
          }
        });
      }
    }
  });

  function init() {
    if (STATE.autoSeek) seekAllVideos();                  // 默认自动跳尾（进页即生效）
    if (IS_TOP && CONFIG.BEHAVIOR.SHOW_UI_DEFAULT) ensureTrigger(); // UI 默认不显示
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });

    // 兜底轮询（单例）
    let pollId = window.__XIAOYE_SEEKEND_POLL__;
    if (!pollId) {
      pollId = setInterval(() => { if (STATE.autoSeek) seekAllVideos(); }, 5000);
      window.__XIAOYE_SEEKEND_POLL__ = pollId;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
