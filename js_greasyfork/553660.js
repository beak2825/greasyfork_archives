// ==UserScript==
// @name         B站视频下载Ai助手（可选分辨率，仅限无版权内容）
// @namespace    https://bg0axe.com
// @version      2.91
// @description  检测 bilibili 页面可下载的视频资源，提供分辨率选择与下载按钮。仅用于无版权或可下载内容。
// @author       yhxxx (由 Gemini 修正)
// @match        *://*.bilibili.com/*
// @license      GPL-3.0-or-later
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553660/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BDAi%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E9%80%89%E5%88%86%E8%BE%A8%E7%8E%87%EF%BC%8C%E4%BB%85%E9%99%90%E6%97%A0%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553660/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BDAi%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E9%80%89%E5%88%86%E8%BE%A8%E7%8E%87%EF%BC%8C%E4%BB%85%E9%99%90%E6%97%A0%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const NOTICE = '仅限无版权或授权内容下载，禁止侵权用途。';
  // v2.90: 更新提示
  const NOTICE_CMD = '提示：下载完毕后，复制此命令到 CMD 运行 (会自动删除源文件)。';

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
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    .bili-dl-btn:hover { background: #008cbb; }

    #dlAll { background: #f5476e; }

    .bili-dl-btn[disabled] { background: #f39c12; cursor: wait; }
    .bili-dl-btn.dl-error { background: #e74c3c; cursor: not-allowed; }


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
    .cmd-notice { font-size: 11px; color: #00a1d6; font-weight: 600; margin: 4px 0 0; }
  `);

  let btn = null, panel = null;

  // ================== v2.50 核心下载函数 ==================
  function advancedDownload(url, filename, btn) {
    const originalText = btn.textContent;
    btn.textContent = '0%';
    btn.disabled = true;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: {
            "Referer": location.href,
            "User-Agent": navigator.userAgent
        },
        onprogress: (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                btn.textContent = `${percent}%`;
            }
        },
        onload: (response) => {
            const blob = response.response;
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);

            btn.textContent = originalText;
            btn.disabled = false;
        },
        onerror: (e) => {
            btn.textContent = '❌ 失败';
            btn.classList.add('dl-error');
            btn.disabled = true;
        },
        ontimeout: (e) => {
            btn.textContent = '❌ 超时';
            btn.classList.add('dl-error');
            btn.disabled = true;
        }
    });
  }

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

  // ================== 获取视频信息 (v2.80) ==================
  function getMeta() {
    const url = location.href;
    const bvMatch = url.match(/BV([A-Za-z0-9]{10})/);
    const bvid = bvMatch ? 'BV' + bvMatch[1] : 'BVUNKNOWN';
    const titleEl = document.querySelector('h1.video-title, h1.title, .tit');
    const title = titleEl ? titleEl.textContent.trim() : document.title.replace(/_哔哩哔哩.*/, '').trim();

    // 1. 用于输入 (-i) 的文件名：纯 ASCII，仅 BV 号
    const inputName = bvid;

    // 2. 用于输出 (-c copy) 的文件名：保留中文，但移除 cmd 的特殊字符 ()（）和文件系统非法字符
    const outputName = `${bvid}_${title}`
        .replace(/[\\/:*?"<>| \r\n()（）]/g, '_') // 移除v2.60的非法字符
        .replace(/__+/g, '_') // 合并连续的下划线
        .replace(/^_|_$/g, '') // 去除开头和结尾的下划线
        .substring(0, 200); // 适当放长文件名限制

    return { bvid, title, inputName, outputName };
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
    const meta = getMeta(); // v2.80: meta 包含 inputName 和 outputName

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

  // ================== 渲染面板 (v2.91) ==================
  function renderPanel(vList, aList, meta) {
    if (!panel) return;

    // v2.80: 使用两个不同的文件名
    const videoFilename = `${meta.inputName}_video.mp4`; // 纯英文
    const audioFilename = `${meta.inputName}_audio.m4a`; // 纯英文

    // v2.90: 输出文件名不带 "_merged"
    const outputFilename = `${meta.outputName}.mp4`; // 带中文，无 _merged

    // v2.91 核心修改: 移除 () 分组，使用更健壮的 && 链
    // \r\n 确保在 Windows 记事本和 CMD 中都能正确换行
    const cmdMultiLine = `ffmpeg ^\r\n -i "${videoFilename}" ^\r\n -i "${audioFilename}" ^\r\n -c copy "${outputFilename}" ^\r\n && del "${videoFilename}" ^\r\n && del "${audioFilename}"`;


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
        <button id="dlVideo" class="bili-dl-btn">视频</button>
        ${aList.length ? `<button id="dlAudio" class="bili-dl-btn">音频</button>` : ''}
        ${aList.length ? `<button id="dlAll" class="bili-dl-btn" title="同时下载纯英文的视频和音频文件">⬇️ 合并下载</button>` : ''}
      </div>
      ${aList.length ? `
        <div class="bili-label" style="margin-top:8px;">FFmpeg 合并并删除 (CMD) <button id="copyCmd">复制</button></div>
        <div class="cmd-notice">${NOTICE_CMD}</div>
        <div id="cmdBox">${cmdMultiLine}</div>` : ''}
      <div class="notice">${NOTICE}</div>
    `;

    panel.innerHTML = html;
    const vSel = panel.querySelector('#videoSel');
    const aSel = panel.querySelector('#audioSel');
    const vBtn = panel.querySelector('#dlVideo');
    const aBtn = panel.querySelector('#dlAudio');
    const allBtn = panel.querySelector('#dlAll');
    const cmdBox = panel.querySelector('#cmdBox');
    const copyBtn = panel.querySelector('#copyCmd');


    vBtn && (vBtn.onclick = (e) => {
        e.preventDefault();
        const vUrl = vSel.selectedOptions[0].dataset.bk || vSel.value;
        // v2.80: advancedDownload 会使用纯英文的 "videoFilename"
        advancedDownload(vUrl, videoFilename, vBtn);
    });

    aBtn && (aBtn.onclick = (e) => {
        e.preventDefault();
        const aUrl = aSel.selectedOptions[0].dataset.bk || aSel.value;
        // v2.80: advancedDownload 会使用纯英文的 "audioFilename"
        advancedDownload(aUrl, audioFilename, aBtn);
    });

    allBtn && (allBtn.onclick = (e) => {
        e.preventDefault();
        vBtn && vBtn.click();
        aBtn && aBtn.click();
    });

    // "复制" 按钮会复制 cmdBox 中 v2.91 的新命令
    copyBtn && (copyBtn.onclick = () => {
      const cmdToCopy = cmdBox.textContent;
      if (typeof GM_setClipboard === 'function') {
          GM_setClipboard(cmdToCopy);
      } else {
          navigator.clipboard.writeText(cmdToCopy);
      }
      copyBtn.textContent = '✅';
      setTimeout(() => copyBtn.textContent = '复制', 1500);
    });

    panel.querySelector('#close-panel').onclick = () => { panel.remove(); panel = null; };
  }

  // ================== 初始化 & 监听 ==================
  function init() {
    ensureButton();
  }

  const observer = new MutationObserver(() => ensureButton());
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();