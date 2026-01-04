// ==UserScript==
// @name         linuxdo保活优化版（高性能版）
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Linux.do 自动浏览 + 点赞 + 实时统计面板 + 面板控制启动/停止/暂停（性能优化版）
// @author       levi & ChatGPT
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/553171/linuxdo%E4%BF%9D%E6%B4%BB%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%88%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553171/linuxdo%E4%BF%9D%E6%B4%BB%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%88%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** ========== 配置 ========== **/
  const cfg = {
    scrollInterval: 1200,
    scrollStep: 800,
    viewThreshold: 500,
    scrollDuration: 30,
    maxTopics: 100,
    maxRunMins: 30,
    iframeStyle: {
      width: '320px', height: '480px', position: 'fixed', top: '70px', left: '8px',
      zIndex: 9999, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 8px rgba(0,0,0,0.2)'
    },
    log: { enabled: true, info: true, error: true }
  };

  /** ========== 工具 ========== **/
  const log = (t, ...a) => cfg.log.enabled && console[t](...a);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const randomWait = (min = 2000, max = 5000) => wait(Math.random() * (max - min) + min);
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  /** ========== 状态 ========== **/
  let isPaused = false;
  const stats = GM_getValue('linuxdoStats', { totalViews: 0, totalLikes: 0 });
  const session = { start: Date.now(), views: 0, likes: 0 };
  const getEnabled = () => GM_getValue('linuxdoEnabled', false);
  const setEnabled = v => GM_setValue('linuxdoEnabled', v);

  /** ========== UI 面板 ========== **/
  function initPanel() {
    if (document.getElementById('ld-panel')) return;
    const html = `
      <div class="ld-header" style="cursor:move;background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:8px 8px 0 0;font-size:13px;">
        🧩 Linuxdo 助手 <span id="ld-min" style="float:right;cursor:pointer;">—</span>
      </div>
      <div id="ld-body" style="background:#fff;color:#333;padding:8px;font-size:13px;">
        <div>🕒 时间：<span id="ld-time">0:00</span></div>
        <div>👀 浏览：<span id="ld-views">0</span></div>
        <div>💖 点赞：<span id="ld-likes">0</span></div>
        <div>⚙️ 状态：<span id="ld-state" style="color:red;">停止</span></div>
        <button id="ld-start" style="margin-top:6px;width:100%;padding:4px;border:none;border-radius:4px;background:#28a745;color:#fff;">▶️ 开始</button>
        <button id="ld-pause" style="margin-top:4px;width:100%;padding:4px;border:none;border-radius:4px;background:#007bff;color:#fff;">⏸ 暂停</button>
      </div>`;
    const panel = Object.assign(document.createElement('div'), {
      id: 'ld-panel',
      style: `position:fixed;right:20px;bottom:20px;width:180px;
              border:1px solid #888;border-radius:8px;
              box-shadow:0 0 6px rgba(0,0,0,0.2);font-family:sans-serif;z-index:99999;`
    });
    panel.innerHTML = html;
    document.body.appendChild(panel);

    const body = panel.querySelector('#ld-body');
    const els = {
      t: panel.querySelector('#ld-time'),
      v: panel.querySelector('#ld-views'),
      l: panel.querySelector('#ld-likes'),
      s: panel.querySelector('#ld-state'),
      start: panel.querySelector('#ld-start'),
      pause: panel.querySelector('#ld-pause')
    };

    // 拖动逻辑
    const header = panel.querySelector('.ld-header');
    let dx, dy, dragging = false;
    header.onmousedown = e => {
      dragging = true;
      dx = e.clientX - panel.offsetLeft;
      dy = e.clientY - panel.offsetTop;
      document.onmousemove = ev => {
        if (!dragging) return;
        Object.assign(panel.style, {
          left: ev.clientX - dx + 'px',
          top: ev.clientY - dy + 'px',
          right: 'auto',
          bottom: 'auto'
        });
      };
      document.onmouseup = () => (dragging = false, document.onmousemove = null);
    };

    // 最小化
    panel.querySelector('#ld-min').onclick = () => {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    };

    // 暂停/恢复
    els.pause.onclick = () => {
      if (!getEnabled()) return;
      isPaused = !isPaused;
      els.pause.textContent = isPaused ? '▶️ 恢复' : '⏸ 暂停';
      els.pause.style.background = isPaused ? '#28a745' : '#007bff';
      log('info', `助手已${isPaused ? '暂停' : '恢复'}`);
    };

    // 开始/停止
    els.start.onclick = async () => {
      const running = getEnabled();
      setEnabled(!running);
      if (running) {
        els.start.textContent = '▶️ 开始';
        els.start.style.background = '#28a745';
        log('info', '助手已停止');
      } else {
        els.start.textContent = '🛑 停止';
        els.start.style.background = '#dc3545';
        isPaused = false;
        els.pause.textContent = '⏸ 暂停';
        els.pause.style.background = '#007bff';
        session.start = Date.now();
        log('info', '助手已启动');
        runMain();
      }
    };

    // 状态更新（仅更新变化字段）
    let last = {};
    setInterval(() => {
      const mins = Math.floor((Date.now() - session.start) / 60000);
      const secs = Math.floor((Date.now() - session.start) / 1000) % 60;
      const st = getEnabled() ? (isPaused ? '暂停中' : '运行中') : '停止';
      const clr = getEnabled() ? (isPaused ? 'orange' : 'green') : 'red';
      const cur = { t: `${mins}:${secs.toString().padStart(2, '0')}`, v: session.views, l: session.likes, s: st };
      if (cur.t !== last.t) els.t.textContent = cur.t;
      if (cur.v !== last.v) els.v.textContent = cur.v;
      if (cur.l !== last.l) els.l.textContent = cur.l;
      if (cur.s !== last.s) { els.s.textContent = cur.s; els.s.style.color = clr; }
      last = cur;
    }, 1000);
  }

  /** ========== 功能 ========== **/
  const saveStats = () => GM_setValue('linuxdoStats', stats);

  async function likeIfNeeded(win, views) {
    if (views < cfg.viewThreshold) return;
    try {
      const btn = win.document.querySelector('button.btn-toggle-reaction-like');
      if (btn && !btn.title.includes('删除此 heart 回应')) {
        btn.click();
        session.likes++;
        stats.totalLikes++;
        saveStats();
      }
    } catch (e) { log('error', '点赞失败', e); }
  }

  async function browseTopic(topic) {
    while (isPaused) await wait(1000);
    const iframe = Object.assign(document.createElement('iframe'), {
      src: `${topic.url}?_=${Date.now()}`, style: Object.entries(cfg.iframeStyle).map(([k, v]) => `${k}:${v}`).join(';')
    });
    document.body.appendChild(iframe);

    // 限时加载
    await Promise.race([
      new Promise(r => (iframe.onload = r)),
      wait(8000)
    ]);

    session.views++; stats.totalViews++; saveStats();
    await likeIfNeeded(iframe.contentWindow, topic.views);

    const end = Date.now() + cfg.scrollDuration * 1000;
    while (Date.now() < end && getEnabled()) {
      if (isPaused) await wait(1000);
      iframe.contentWindow.scrollBy(0, cfg.scrollStep);
      await wait(cfg.scrollInterval);
    }

    iframe.remove();
    await randomWait();
  }

  async function getTopics() {
    return [...document.querySelectorAll('#list-area .title')]
      .filter(el => !el.closest('tr')?.querySelector('.pinned'))
      .map(el => ({
        title: el.textContent.trim(),
        url: el.href,
        views: parseInt(el.closest('tr')?.querySelector('.num.views .number')?.getAttribute('title')?.replace(/\D/g, '') || 0)
      }));
  }

  const shouldStop = () => {
    if (!getEnabled()) return true;
    if (session.views >= cfg.maxTopics) return true;
    return (Date.now() - session.start) / 60000 >= cfg.maxRunMins;
  };

  /** ========== 主循环 ========== **/
  async function runMain() {
    const topics = shuffle(await getTopics());
    for (const t of topics) {
      if (shouldStop()) break;
      await browseTopic(t);
    }
    setEnabled(false);
    log('info', '助手运行结束');
  }

  /** ========== 启动 ========== **/
  (document.readyState === 'complete'
    ? initPanel()
    : window.addEventListener('load', initPanel));
})();
