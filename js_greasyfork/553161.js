// ==UserScript==
// @name         周报生成器 For TTD
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  右下角热区唤出按钮；点击后自动先复制（等同 ⌘C），再整理剪贴板（同前缀合并后缀、编号、写回剪贴板），统一输出“已完成”。/ Meko
// @author       不愿透露姓名的Meko
// @match        https://*.feishu.cn/wiki/*
// @match        https://*.feishu.cn/base/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553161/%E5%91%A8%E6%8A%A5%E7%94%9F%E6%88%90%E5%99%A8%20For%20TTD.user.js
// @updateURL https://update.greasyfork.org/scripts/553161/%E5%91%A8%E6%8A%A5%E7%94%9F%E6%88%90%E5%99%A8%20For%20TTD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID  = 'tm-weekly-report-btn';
  const HOTSPOT_ID = 'tm-weekly-report-hotspot';
  const FADE_MS    = 250;
  const HIDE_DELAY = 150;

  let hideTimer = null;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #${HOTSPOT_ID} {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        z-index: 2147483646;
        background: transparent;
        pointer-events: auto;
      }
      #${BUTTON_ID} {
        position: fixed;
        right: 34px;
        bottom: 12px;
        z-index: 2147483647;
        padding: 10px 14px;
        background: #fff;
        border: 1px solid #d0d3d6;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        font-size: 14px;
        line-height: 1;
        color: #111;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transform: translateX(120%);
        opacity: 0.5;
        pointer-events: none;
        transition: transform ${FADE_MS}ms ease, opacity ${FADE_MS}ms ease, box-shadow ${FADE_MS}ms ease;
      }
      #${BUTTON_ID}.show { transform: translateX(0); opacity: 1; pointer-events: auto; }
      #${BUTTON_ID}:active { transform: translateX(0) translateY(0.5px); }

      .tm-toast {
        position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
        background: rgba(0,0,0,0.80); color: #fff; padding: 8px 12px; border-radius: 8px;
        font-size: 13px; z-index: 2147483647; opacity: 0; transition: opacity 200ms ease;
        pointer-events: none; max-width: 80vw; text-align: center;
      }
      .tm-toast.show { opacity: 1; }

      @media (prefers-color-scheme: dark) {
        #${BUTTON_ID} { background: #1d1f20; color: #f5f5f5; border-color: #2a2d2f; box-shadow: 0 4px 16px rgba(0,0,0,0.35); }
      }
    `;
    document.head.appendChild(style);
  }

  function getOrCreateHotspot() {
    let hs = document.getElementById(HOTSPOT_ID);
    if (hs) return hs;
    hs = document.createElement('div');
    hs.id = HOTSPOT_ID;
    document.body.appendChild(hs);
    return hs;
  }

  function getOrCreateButton() {
    let btn = document.getElementById(BUTTON_ID);
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.textContent = '生成周报';
    btn.title = '点击生成周报';
    btn.addEventListener('click', onGenerateClick);
    document.body.appendChild(btn);
    return btn;
  }

  function showButton() {
    const btn = getOrCreateButton();
    clearTimeout(hideTimer);
    btn.classList.add('show');
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      const btn = getOrCreateButton();
      btn.classList.remove('show');
    }, HIDE_DELAY);
  }

  function bindInteractions() {
    const hotspot = getOrCreateHotspot();
    const btn = getOrCreateButton();
    hotspot.addEventListener('mouseenter', showButton);
    hotspot.addEventListener('mouseleave', scheduleHide);
    btn.addEventListener('mouseenter', showButton);
    btn.addEventListener('mouseleave', (e) => {
      const to = e.relatedTarget;
      if (to && (to.id === HOTSPOT_ID || (to.closest && to.closest(`#${HOTSPOT_ID}`)))) return;
      scheduleHide();
    });
    hotspot.addEventListener('touchstart', () => {
      showButton();
      setTimeout(scheduleHide, 1000);
    });
  }

  function showToast(message, duration = 2200) {
    const div = document.createElement('div');
    div.className = 'tm-toast';
    div.textContent = message;
    document.body.appendChild(div);
    void div.offsetWidth;
    div.classList.add('show');
    setTimeout(() => {
      div.classList.remove('show');
      setTimeout(() => div.remove(), 220);
    }, duration);
  }

  // 同前缀合并后缀；前缀=标题“第一个 - 之前”，后缀可含 -
  function buildWeeklySummary(raw) {
    const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const groups = new Map(); // key = prefix, value = { suffixes:Set, order:Number }

    for (const line of lines) {
      const cells = line.split('\t');
      const titleCell = (cells[0] || '').trim();
      if (!titleCell) continue;

      let prefix, suffix;
      const m = titleCell.match(/^(.+?)\s*-\s*(.+)$/);
      if (m) { prefix = m[1].trim(); suffix = m[2].trim(); }
      else   { prefix = titleCell;    suffix = ''; }

      if (!groups.has(prefix)) groups.set(prefix, { suffixes: new Set(), order: groups.size });
      const g = groups.get(prefix);
      if (suffix) g.suffixes.add(suffix);
    }

    const sorted = [...groups.entries()].sort((a, b) => a[1].order - b[1].order);
    const out = [];
    let i = 1;
    for (const [prefix, info] of sorted) {
      const suffixPart = info.suffixes.size ? ` - ${Array.from(info.suffixes).join(' / ')}` : '';
      out.push(`${i}. ${prefix}${suffixPart} - 已完成`);
      i++;
    }
    return { ok: true, text: out.join('\n') };
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 点击：自动复制 → 读取剪贴板 → 整理 → 写回剪贴板
  async function onGenerateClick(e) {
    e.preventDefault();

    // 1) 先尝试让飞书把“当前勾选/选中行”复制进剪贴板
    try {
      // 如果页面内有可聚焦的网格/表格，确保焦点在页面内（有时候飞书会要求 focus）
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        // 保持当前焦点；部分站点 blur 反而会影响 copy，这里不主动 blur
      }
      if (document.execCommand) {
        document.execCommand('copy'); // 触发内建 copy 逻辑（等同用户按 ⌘C）
      }
    } catch (_) {
      // 忽略：有站点会阻止，但不影响后续 fallback
    }

    // 2) 给飞书一点点时间把文本写入剪贴板
    await sleep(120);

    // 3) 读剪贴板
    let raw = '';
    try {
      raw = await navigator.clipboard.readText();
    } catch (err) {
      // 读失败：降级为手动粘贴
      const manual = window.prompt('读取剪贴板失败，请把要整理的内容粘贴到这里：');
      if (!manual) { showToast('没有获取到文本呀～'); return; }
      raw = manual;
    }

    // 如果剪贴板是空的，大概率是没有勾选行或站点阻止复制
    if (!raw || !raw.trim()) {
      showToast('没有复制到内容：请先在表格里勾选/选中本周的行，再点按钮～', 2600);
      return;
    }

    // 4) 整理并写回
    const result = buildWeeklySummary(raw);
    if (!result.ok) {
      showToast('解析失败：格式可能不对');
      return;
    }

    try {
      await navigator.clipboard.writeText(result.text);
    } catch (err) {
      console.log('[TT周报生成器] 写入剪贴板失败，内容如下：\n' + result.text);
      showToast('写入剪贴板失败，已在控制台输出，手动复制吧～', 2800);
      window.prompt('复制失败，请手动全选复制：', result.text);
      return;
    }

    alert('搞定了✅ 可以去粘贴了');
  }

  function onReady(cb) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cb, { once: true });
    } else {
      cb();
    }
  }

  onReady(() => {
    injectStyles();
    getOrCreateHotspot();
    getOrCreateButton();
    bindInteractions();
    console.log('[TT周报生成器] 已启用：点击按钮会先自动复制，再整理输出到剪贴板。');
  });
})();