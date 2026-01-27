// ==UserScript==
// @name         Huawei Video Duration Counter (FINAL PAGINATION BY PAGE)
// @description  单页采集
// @namespace    huawei-video-duration-final-page-check
// @match        *://hm-drcn.cloud.huawei.com/*
// @version 1.0
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564067/Huawei%20Video%20Duration%20Counter%20%28FINAL%20PAGINATION%20BY%20PAGE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564067/Huawei%20Video%20Duration%20Counter%20%28FINAL%20PAGINATION%20BY%20PAGE%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************
   * 工具
   ********************/
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function waitVideoDuration(timeoutMs = 180000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const video = document.querySelector('video');
      if (video && !isNaN(video.duration) && video.duration > 0) {
        return Math.round(video.duration);
      }
      await sleep(500);
    }
    return 0;
  }

  function closeModal() {
    document.querySelector(
      '.ant-modal-close, .ant-drawer-close, button[aria-label="关闭"]'
    )?.click();
  }

  /********************
   * ✅ 页码相关（关键）
   ********************/
  function getCurrentPage() {
    const active = document.querySelector(
      'li.ant-pagination-item-active a'
    );
    return active ? parseInt(active.innerText, 10) : null;
  }

  async function goNextPage(log) {
    const current = getCurrentPage();
    if (!current) return false;

    const nextLi = document.querySelector(
      'li.ant-pagination-next:not(.ant-pagination-disabled)'
    );
    if (!nextLi) return false;

    (nextLi.querySelector('a,button') || nextLi).click();

    // 等待页码变化
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      const now = getCurrentPage();
      if (now && now !== current) {
        log(`➡ 已翻到第 ${now} 页`);
        return true;
      }
    }
    return false;
  }

  /********************
   * 状态
   ********************/
  let templateNode = null;
  let pageIndex = 1;
  let totalSeconds = 0;
  let totalCount = 0;
  const results = [];

  /********************
   * UI
   ********************/
  const panel = document.createElement('div');
  panel.style = `
    position: fixed;
    right: 16px;
    bottom: 16px;
    width: 360px;
    background: rgba(0,0,0,.9);
    color: #eee;
    font-size: 12px;
    z-index: 999999;
    border-radius: 8px;
    padding: 10px;
  `;
  panel.innerHTML = `
    <b>🎬 Video Counter</b>
    <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
      <button id="vc-record">🎯 记录【标注结果】</button>
      <button id="vc-run" disabled>▶ 批量统计（含翻页）</button>
      <button id="vc-export">📤 导出 Excel</button>
      <button id="vc-reset">♻ 重置</button>
    </div>
    <div id="vc-log" style="margin-top:8px;max-height:220px;overflow:auto;"></div>
  `;
  document.body.appendChild(panel);

  const logBox = panel.querySelector('#vc-log');
  const log = msg => {
    const d = document.createElement('div');
    d.textContent = msg;
    logBox.appendChild(d);
    logBox.scrollTop = logBox.scrollHeight;
  };

  log('✔ 脚本已启动（页码判断翻页）');

  /********************
   * 记录模板
   ********************/
  panel.querySelector('#vc-record').onclick = () => {
    log('👉 请手动点击一次【标注结果】');
    const handler = e => {
      templateNode = e.target;
      templateNode.style.outline = '2px solid red';
      panel.querySelector('#vc-run').disabled = false;
      log('✔ 已记录点击模板');
      document.removeEventListener('click', handler, true);
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener('click', handler, true);
  };

  /********************
   * 单页处理
   ********************/
  async function processCurrentPage() {
    log(`📄 正在处理第 ${pageIndex} 页`);

    const nodes = [...document.querySelectorAll('span.ellipsis.clickable-text')]
      .filter(n => n.innerText && n.innerText.trim().length > 0);

    for (const node of nodes) {
      node.scrollIntoView({ block: 'center' });
      node.click();
      await sleep(800);

      const duration = await waitVideoDuration();
      if (duration > 0) {
        totalCount++;
        totalSeconds += duration;
        results.push({
          index: totalCount,
          page: pageIndex,
          duration
        });
        log(`✔ 第 ${totalCount} 条：${duration} 秒`);
      } else {
        log(`❌ 第 ${totalCount + 1} 条：读取失败`);
      }

      closeModal();
      await sleep(600);
    }
  }

  /********************
   * 批量统计 + 翻页（最终）
   ********************/
  panel.querySelector('#vc-run').onclick = async () => {
    if (!templateNode) return;

    totalSeconds = 0;
    totalCount = 0;
    pageIndex = getCurrentPage() || 1;
    results.length = 0;

    while (true) {
      await processCurrentPage();

      const ok = await goNextPage(log);
      if (!ok) {
        log('⛔ 页码未变化，已到最后一页');
        break;
      }

      pageIndex = getCurrentPage();
      await sleep(2000);
    }

    log('----------------------');
    log(`📦 总样本数：${totalCount}`);
    log(`⏱ 总时长：${totalSeconds} 秒`);
    log(`⏱ ${(totalSeconds / 60).toFixed(2)} 分钟`);
  };

  /********************
   * 导出 CSV
   ********************/
  panel.querySelector('#vc-export').onclick = () => {
    if (!results.length) {
      alert('没有可导出的数据');
      return;
    }

    const header = ['index', 'page', 'duration'];
    const rows = results.map(r =>
      [r.index, r.page, r.duration].join(',')
    );

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'video_duration_stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  /********************
   * 重置
   ********************/
  panel.querySelector('#vc-reset').onclick = () => {
    templateNode = null;
    totalSeconds = 0;
    totalCount = 0;
    results.length = 0;
    panel.querySelector('#vc-run').disabled = true;
    logBox.innerHTML = '';
    log('已重置');
  };

})();
