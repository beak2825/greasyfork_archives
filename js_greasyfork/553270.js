// ==UserScript==
// @name         B站视频下载Ai助手（可选分辨率，仅限无版权内容）
// @namespace    https://bg0axe.com
// @version      2.01
// @description  检测 bilibili 页面可下载的视频资源，提供分辨率选择与下载按钮。仅用于无版权或可下载内容。
// @author       药尘子
// @match        *://*.bilibili.com/*
// @license      GPL-3.0-or-later
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553270/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BDAi%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E9%80%89%E5%88%86%E8%BE%A8%E7%8E%87%EF%BC%8C%E4%BB%85%E9%99%90%E6%97%A0%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553270/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BDAi%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E9%80%89%E5%88%86%E8%BE%A8%E7%8E%87%EF%BC%8C%E4%BB%85%E9%99%90%E6%97%A0%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const NOTICE = '仅限无版权或授权内容下载，禁止侵权用途。';

  // ================== 样式 ==================
  GM_addStyle(`
    #bili-float-btn {
      position: absolute;
      top: 10px; right: 10px;
      z-index: 99999;
      background: rgba(251,114,153,0.95);
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid rgba(255,255,255,0.25);
      backdrop-filter: blur(4px);
    }
    #bili-float-btn:hover { background: #f85f87; transform: scale(1.05); }

    #bili-float-panel {
      position: absolute;
      top: 45px; right: 10px;
      width: 340px;
      z-index: 99999;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      padding: 12px;
      font-size: 13px;
      border: 1px solid #eee;
    }

    #panel-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px;
    }
    #panel-header h4 { margin: 0; font-size: 14px; color: #fb7299; font-weight: 600; }
    #close-panel { background: none; border: none; font-size: 18px; cursor: pointer; color: #aaa; }

    .bili-label { font-weight: 600; color: #333; margin: 6px 0 4px; display: block; }
    select.bili-quality {
      width: 100%; padding: 6px; border: 1px solid #fb7299; border-radius: 5px; background: white;
    }
    .bili-dl-btn {
      display: inline-block; background: #00a1d6; color: white;
      padding: 5px 10px; border-radius: 5px; text-decoration: none;
      font-size: 12px; margin: 6px 4px 0 0;
    }
    .bili-dl-btn:hover { background: #008cbb; }

    #cmdBox {
      background: #f8f9fa; padding: 6px; border-radius: 5px;
      font-family: Consolas, monospace; font-size: 11px;
      word-break: break-all; white-space: pre-wrap; margin-top: 4px; position: relative;
    }
    #copyCmd {
      position: absolute; top: 4px; right: 4px; background: #fb7299; color: white;
      border: none; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;
    }
    .notice { font-size: 11px; color: #888; margin-top: 6px; line-height: 1.4; }
  `);

  let btn = null, panel = null;

  // ================== 等待播放器容器 ==================
  function findPlayer() {
    return document.querySelector('.bpx-player-container, #bilibili-player, .player-container, #playerWrap');
  }

  function ensureButton() {
    const player = findPlayer();
    if (!player || document.querySelector('#bili-float-btn')) return;

    const wrapper = player.querySelector('.bpx-player-video-wrap, .bpx-player-container') || player;
    wrapper.style.position = 'relative';

    btn = document.createElement('div');
    btn.id = 'bili-float-btn';
    btn.textContent = '下载';
    btn.title = NOTICE;
    btn.onclick = togglePanel;
    wrapper.appendChild(btn);
  }

  // ================== 面板 ==================
  function togglePanel() {
    if (panel) { panel.remove(); panel = null; return; }

    panel = document.createElement('div');
    panel.id = 'bili-float-panel';
    panel.innerHTML = `<div id="panel-header"><h4>解析中...</h4><button id="close-panel">×</button></div><div>正在检测视频流...</div>`;
    btn.parentElement.appendChild(panel);

    document.getElementById('close-panel').onclick = () => { panel.remove(); panel = null; };
    setTimeout(detectMedia, 800);
  }

  // ================== 获取视频信息 ==================
  function getMeta() {
    const url = location.href;
    const bvMatch = url.match(/BV([A-Za-z0-9]{10})/);
    const bvid = bvMatch ? 'BV' + bvMatch[1] : 'BVUNKNOWN';
    const titleEl = document.querySelector('h1.video-title, h1.title, .tit');
    const title = titleEl ? titleEl.textContent.trim() : document.title.replace(/_哔哩哔哩.*/, '').trim();
    const safeName = `${bvid}_${title}`.replace(/[\\/:*?"<>|]/g, '_').substring(0, 100);
    return { bvid, title, safeName };
  }

  // ================== 解析视频流 ==================
  function detectMedia() {
    const w = unsafeWindow || window;
    const playinfo = w.__playinfo__;
    if (!playinfo?.data?.dash) {
      panel.innerHTML = `<div style="color:#e74c3c;">❌ 未检测到视频流，请刷新页面后重试。</div>`;
      return;
    }

    const { video, audio } = playinfo.data.dash;
    const meta = getMeta();

    const vList = video.map(v => ({
      url: v.baseUrl,
      desc: `${v.height}p ${v.codecid === 12 ? 'HEVC' : 'AVC'}`,
      backup: v.backupUrl?.[0]
    })).sort((a, b) => b.desc.localeCompare(a.desc));

    const aList = audio.map(a => ({
      url: a.baseUrl,
      desc: `音频 ${Math.round(a.bandwidth / 1000)}kbps`,
      backup: a.backupUrl?.[0]
    }));

    renderPanel(vList, aList, meta);
  }

  // ================== 渲染面板 ==================
  function renderPanel(vList, aList, meta) {
    if (!panel) return;
    let html = `
      <div id="panel-header">
        <h4>${meta.title.slice(0, 20)} (${meta.bvid})</h4>
        <button id="close-panel">×</button>
      </div>
      <div class="bili-label">分辨率</div>
      <select id="videoSel" class="bili-quality">
        ${vList.map(v => `<option value="${v.url}" data-bk="${v.backup || ''}">${v.desc}</option>`).join('')}
      </select>
      ${aList.length ? `
        <div class="bili-label">音频</div>
        <select id="audioSel" class="bili-quality">
          ${aList.map(a => `<option value="${a.url}" data-bk="${a.backup || ''}">${a.desc}</option>`).join('')}
        </select>` : ''}
      <div style="margin-top:10px;">
        <a id="dlVideo" class="bili-dl-btn" download="${meta.safeName}_video.mp4">视频</a>
        ${aList.length ? `<a id="dlAudio" class="bili-dl-btn" download="${meta.safeName}_audio.m4a">音频</a>` : ''}
      </div>
      ${aList.length ? `
        <div class="bili-label" style="margin-top:8px;">FFmpeg 合并 <button id="copyCmd">复制</button></div>
        <div id="cmdBox">ffmpeg -i "VIDEO" -i "AUDIO" -c copy "${meta.safeName}.mp4"</div>` : ''}
      <div class="notice">${NOTICE}</div>
    `;

    panel.innerHTML = html;
    const vSel = panel.querySelector('#videoSel');
    const aSel = panel.querySelector('#audioSel');
    const vBtn = panel.querySelector('#dlVideo');
    const aBtn = panel.querySelector('#dlAudio');
    const cmdBox = panel.querySelector('#cmdBox');
    const copyBtn = panel.querySelector('#copyCmd');

    const update = () => {
      const vUrl = vSel.selectedOptions[0].dataset.bk || vSel.value;
      const aUrl = aSel ? (aSel.selectedOptions[0].dataset.bk || aSel.value) : '';
      if (vBtn) vBtn.href = vUrl;
      if (aBtn) aBtn.href = aUrl;
      if (cmdBox) cmdBox.textContent = `ffmpeg -i "${vUrl}" -i "${aUrl}" -c copy "${meta.safeName}.mp4"`;
    };

    [vSel, aSel].forEach(s => s && s.addEventListener('change', update));
    copyBtn && (copyBtn.onclick = () => {
      GM_setClipboard(cmdBox.textContent);
      copyBtn.textContent = '✅';
      setTimeout(() => copyBtn.textContent = '复制', 1500);
    });

    panel.querySelector('#close-panel').onclick = () => { panel.remove(); panel = null; };
    update();
  }

  // ================== 初始化 & 监听 ==================
  function init() {
    ensureButton();
  }

  const observer = new MutationObserver(() => ensureButton());
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

})();
