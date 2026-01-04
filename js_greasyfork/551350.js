// ==UserScript==
// @name         猫耳FM内嵌字幕录制提取lrc
// @namespace    https://github.com/fishhh666
// @version      1.0
// @description  自动捕获猫耳FM/missevan播放器内嵌字幕并导出为LRC文件，支持监测播放快结束时自动暂停并触发下载，支持手动下载，清除字幕缓存。网址变化会自动清除已收集的字幕。
// @author       fishhh666
// @match        https://www.missevan.com/sound/player?id=*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/551350/%E7%8C%AB%E8%80%B3FM%E5%86%85%E5%B5%8C%E5%AD%97%E5%B9%95%E5%BD%95%E5%88%B6%E6%8F%90%E5%8F%96lrc.user.js
// @updateURL https://update.greasyfork.org/scripts/551350/%E7%8C%AB%E8%80%B3FM%E5%86%85%E5%B5%8C%E5%AD%97%E5%B9%95%E5%BD%95%E5%88%B6%E6%8F%90%E5%8F%96lrc.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const debug = true; // 调试模式

  let hasAutoDownloaded = false;
  let hasTriggeredByTimeDiff = false;
  let collected = [];
  let menuDownloadId = null;
  let menuClearId = null;
  let lastMenuText = "";
  let alreadySetupInterval = false;
  let lastUrl = location.href;

  // ========== 工具函数 ==========
  function parseTimeToSec(t) {
    if (!t) return NaN;
    t = String(t).trim().replace(',', '.');
    if (t.includes(':')) {
      const parts = t.split(':').map(x => parseFloat(x) || 0);
      let sec = 0;
      for (let i = 0; i < parts.length; i++) sec = sec * 60 + parts[i];
      return sec;
    }
    return parseFloat(t) || NaN;
  }

  function secToLrc(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '[00:00.00]';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const centi = Math.floor((sec - Math.floor(sec)) * 100);
    return `[${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(centi).padStart(2,'0')}]`;
  }

  function getMptimeTimes() {
    const mptime = document.querySelector('.mptime');
    if (!mptime) return { spSec: NaN, saSec: NaN };
    const mpsp = mptime.querySelector('.mpsp');
    const mpsa = mptime.querySelector('.mpsa');
    const spText = mpsp ? (mpsp.textContent || '').trim() : null;
    const saText = mpsa ? (mpsa.textContent || '').trim() : null;
    return { spSec: parseTimeToSec(spText), saSec: parseTimeToSec(saText) };
  }

  function pushSubtitle(text, timeSec) {
    text = (text || '').trim();
    if (!text) return;
    const ts = secToLrc(timeSec);
    const line = `${ts}${text}`;
    if (collected.length === 0 || collected[collected.length - 1] !== line) {
      collected.push(line);
      if (debug) console.log('SUB:', line);
      updateMenu();
    }
  }

  function handleNewText(txt) {
    if (!txt) return;
    txt = txt.trim();
    if (!txt) return;
    const times = getMptimeTimes();
    const useSec = !isNaN(times.spSec) ? times.spSec : Date.now()/1000;
    pushSubtitle(txt, useSec);
  }

  // ====== 排序 + 去重下载 ======
  function downloadLrc(filename = 'subs.lrc') {
    if (!collected.length) {
      console.warn("[字幕脚本] 没有收集到字幕，跳过下载");
      return;
    }

    const items = collected.map((line, idx) => {
      const m = String(line || '').match(/^\[(\d{1,2}(?::\d{2})+(?:\.\d{1,2})?)\](.*)$/);

      const text = m ? (m[2] || '').trim() : String(line || '').trim();
      const tSec = m ? parseTimeToSec(m[1]) : NaN;
      return { line, text, tSec, idx };
    });

    // 排序
    items.sort((a, b) => {
      const aNaN = Number.isNaN(a.tSec);
      const bNaN = Number.isNaN(b.tSec);
      if (aNaN && bNaN) return a.idx - b.idx;
      if (aNaN) return 1;
      if (bNaN) return -1;
      if (a.tSec === b.tSec) return a.idx - b.idx;
      return a.tSec - b.tSec;
    });

    // 去重
    const finalLines = [];
    let lastText = null;
    for (const it of items) {
      if (it.text === lastText) continue;
      finalLines.push(it.line);
      lastText = it.text;
    }

    const content = finalLines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try { URL.revokeObjectURL(a.href); } catch (e) {}
      a.remove();
    }, 1000);
    console.log('[字幕脚本] 已下载字幕：', filename, '行数:', finalLines.length);
  }

  // ====== 清除收集的字幕 ======
  function clearSubtitles() {
    collected = [];
    hasAutoDownloaded = false;
    hasTriggeredByTimeDiff = false;
    updateMenu();
    console.log("[字幕脚本] 已清空收集的字幕缓存");
  }

  // ===== 菜单更新 =====
  function updateMenu() {
    const newText = "下载字幕 (已收集 " + collected.length + " 行)";
    if (newText !== lastMenuText) {
      lastMenuText = newText;
      if (menuDownloadId !== null) GM_unregisterMenuCommand(menuDownloadId);
      menuDownloadId = GM_registerMenuCommand(newText, () => downloadLrc("subs.lrc"));
    }
    if (menuClearId === null) {
      menuClearId = GM_registerMenuCommand("清除已收集字幕", clearSubtitles);
    }
  }

  // ===== 帮助函数：判断是否正在播放 =====
  function isPlaying(btn) {
    return btn.classList.contains("mpip");
  }

  // ===== URL 变化检测（SPA友好）=====
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      clearSubtitles();
    }
  }, 1000);

  // ===== 主逻辑 =====
  window.addEventListener('load', () => {
    console.log("[字幕脚本] 脚本已启动");

    const playBtn = document.querySelector("#mpi");
    if (playBtn && !isPlaying(playBtn)) {
      playBtn.click();
      console.log("[字幕脚本] 已点击播放按钮");
    }

    const root = document.querySelector('.subtitle-container');
    if (!root) {
      console.error('未找到 .subtitle-container');
      return;
    }

    const obs = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'characterData') {
          handleNewText(m.target.data);
        }
        for (const node of m.addedNodes) {
          if (!node) continue;
          if (node.nodeType === Node.TEXT_NODE) handleNewText(node.data);
          else if (node.nodeType === Node.ELEMENT_NODE) {
            const span = node.matches && node.matches('span') ? node :
                         node.querySelector && node.querySelector('span') ? node.querySelector('span') : node;
            handleNewText(span.textContent || '');
          }
        }
      }
    });
    obs.observe(root, { childList: true, subtree: true, characterData: true });

    // ====== 播放/暂停检测 ======
    playBtn.addEventListener("click", () => {
      setTimeout(() => {
        const isNowPlaying = isPlaying(playBtn);
        if (!isNowPlaying && collected.length > 0) {
          console.log("[字幕脚本] 检测到暂停 → 自动触发下载");
          if (!hasAutoDownloaded) {
            hasAutoDownloaded = true;
            downloadLrc("subs.lrc");
          }
        } else if (isNowPlaying) {
          if (debug) console.log("[字幕脚本] 切换到播放 → 重置触发标志");
          hasAutoDownloaded = false;
          hasTriggeredByTimeDiff = false;
        }
      }, 0);
    });

    // ====== 结尾检测 ======
    if (!alreadySetupInterval) {
      alreadySetupInterval = true;
      setInterval(() => {
        const { spSec, saSec } = getMptimeTimes();
        if (
          Math.abs(saSec - spSec) <= 2 &&
          collected.length > 0 &&
          !hasTriggeredByTimeDiff
        ) {
          hasTriggeredByTimeDiff = true;
          console.log("[字幕脚本] 检测到时间差 ≤ 2s → 自动暂停并下载");
          if (isPlaying(playBtn)) playBtn.click();
          if (!hasAutoDownloaded) {
            hasAutoDownloaded = true;
            downloadLrc("subs.lrc");
          }
        }
      }, 2000);
    }

    updateMenu();
    console.log('[字幕脚本] 正在监控字幕...');
  });

})();
