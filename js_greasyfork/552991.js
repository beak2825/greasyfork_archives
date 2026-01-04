// ==UserScript==
// @name         千川广告计划 ROI 倒计时（多账号独立+自修复）
// @namespace    https://greasyfork.org/zh-CN/users/your-name
// @version      3.1.0
// @description  每个账号独立保存倒计时，支持刷新恢复，自动检测并修复丢失的倒计时显示，带管理面板。
// @author       你
// @match        *://qianchuan.jinritemai.com/uni-prom*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/552991/%E5%8D%83%E5%B7%9D%E5%B9%BF%E5%91%8A%E8%AE%A1%E5%88%92%20ROI%20%E5%80%92%E8%AE%A1%E6%97%B6%EF%BC%88%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%8B%AC%E7%AB%8B%2B%E8%87%AA%E4%BF%AE%E5%A4%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552991/%E5%8D%83%E5%B7%9D%E5%B9%BF%E5%91%8A%E8%AE%A1%E5%88%92%20ROI%20%E5%80%92%E8%AE%A1%E6%97%B6%EF%BC%88%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%8B%AC%E7%AB%8B%2B%E8%87%AA%E4%BF%AE%E5%A4%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DURATION_MS = 61 * 60 * 1000; // 1小时1分钟
  const aavid = new URL(location.href).searchParams.get('aavid') || 'default';
  const STORAGE_KEY = `timers_${aavid}`;
  console.log(`👤 当前账号ID: ${aavid}`);

  let timers = GM_getValue(STORAGE_KEY, {}); // { planId: startTimestamp }
  let lastEdit = null;
  const countdownMap = new Map();

  // ✅ 页面加载后延迟恢复倒计时
  restoreCountdowns();
  createManagerButton();

  // 🩺 每秒检测倒计时显示是否存在（自修复）
  setInterval(() => {
    Object.keys(timers).forEach(planId => {
      const row = findRowByPlanId(planId);
      if (!row) return;
      const exist = row.querySelector('.tm-countdown');
      if (!exist) {
        console.warn(`⚙️ 倒计时缺失，自动修复计划 ${planId}`);
        createCountdown(planId, timers[planId], row);
      }
    });
  }, 1000);

  // 延迟恢复逻辑
  function restoreCountdowns() {
    const planIds = Object.keys(timers);
    if (planIds.length === 0) return;
    let retry = 0;
    const checkInterval = setInterval(() => {
      let allRestored = true;
      for (const planId of planIds) {
        const row = findRowByPlanId(planId);
        if (row) {
          if (!row.querySelector('.tm-countdown')) {
            createCountdown(planId, timers[planId], row);
            console.log(`♻️ 已恢复倒计时: 计划 ${planId}`);
          }
        } else {
          allRestored = false;
        }
      }
      retry++;
      if (allRestored || retry > 10) clearInterval(checkInterval);
    }, 3000);
  }

  // ROI编辑检测
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.roi-bid .edit-icon');
    if (!btn) return;
    const row = btn.closest('tr');
    const planId = row?.querySelector('.oc-typography-value-slot')?.innerText.match(/\d+/)?.[0];
    const roiValue = row?.querySelector('.roi-bid .bold')?.innerText?.trim();
    if (!planId || !roiValue) return;
    lastEdit = { planId, oldValue: roiValue, row };
    console.log(`🟦 [编辑检测] ROI编辑点击 | ID=${planId} | 当前ROI=${roiValue}`);
  });

  // 确定按钮检测ROI变化
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button.ovui-button');
    if (!btn) return;
    if (btn.textContent.trim() !== '确定') return;
    if (!lastEdit) return;

    const { planId, oldValue, row } = lastEdit;
    const roiNode = row.querySelector('.roi-bid .bold');
    if (!roiNode) return;

    console.log(`🟧 [确认检测] 点击确定 | 等待ROI更新… | ID=${planId} | 旧值=${oldValue}`);

    const observer = new MutationObserver(() => {
      const newValue = roiNode.innerText.trim();
      if (newValue !== oldValue) {
        observer.disconnect();
        console.log(`🟩 [ROI变化检测] ${planId}: ${oldValue} → ${newValue}`);
        startCountdown(planId, row);
      }
    });

    observer.observe(roiNode, { characterData: true, subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 5000);
    lastEdit = null;
  });

  // 启动倒计时
  function startCountdown(planId, row) {
    const start = Date.now();
    timers[planId] = start;
    GM_setValue(STORAGE_KEY, timers);
    createCountdown(planId, start, row);
    updateManagerPanel();
  }

  // 创建倒计时
  function createCountdown(planId, start, row) {
    if (!row) row = findRowByPlanId(planId);
    if (!row) return;

    const roiNode = row.querySelector('.roi-bid .bold');
    if (!roiNode) return;

    roiNode.parentNode.querySelector('.tm-countdown')?.remove();

    const div = document.createElement('span');
    div.className = 'tm-countdown';
    div.style.cssText = `
      color: #2a55e5;
      font-weight: 500;
      margin-left: 6px;
      font-size: 12px;
    `;
    roiNode.after(div);

    if (countdownMap.has(planId)) clearInterval(countdownMap.get(planId));

    const timer = setInterval(() => {
      const remain = DURATION_MS - (Date.now() - start);
      if (remain <= 0) {
        clearInterval(timer);
        div.remove();
        countdownMap.delete(planId);
        delete timers[planId];
        GM_setValue(STORAGE_KEY, timers);
        updateManagerPanel();
        return;
      }
      const m = Math.floor(remain / 60000);
      const s = Math.floor((remain % 60000) / 1000);
      div.textContent = `剩余 ${m}分${s.toString().padStart(2, '0')}秒`;
      updateManagerPanel();
    }, 1000);

    countdownMap.set(planId, timer);
  }

  // 查找计划行
  function findRowByPlanId(id) {
    return [...document.querySelectorAll('tr')].find((tr) => tr.innerText.includes(id));
  }

  // 创建右上角管理按钮
  function createManagerButton() {
    const btn = document.createElement('button');
    btn.textContent = '🕒 倒计时管理';
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: #2a55e5;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
    `;
    btn.onclick = togglePanel;
    document.body.appendChild(btn);
  }

  // 管理面板
  let panel = null;
  function togglePanel() {
    if (panel) {
      panel.remove();
      panel = null;
      return;
    }

    panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      width: 320px;
      z-index: 999999;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    panel.innerHTML = `<b>🕒 当前倒计时列表（账号：${aavid}）</b>
      <button id="clearAll" style="float:right;background:#e33;color:#fff;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;">清除全部</button>
      <hr style="margin:6px 0;">
      <div id="timerList">加载中...</div>`;
    document.body.appendChild(panel);
    updateManagerPanel();

    panel.querySelector('#clearAll').onclick = () => {
      if (confirm('确认清除所有倒计时吗？')) {
        for (const id of Object.keys(timers)) removeCountdown(id);
      }
    };
  }

  // 更新面板
  function updateManagerPanel() {
    if (!panel) return;
    const list = panel.querySelector('#timerList');
    if (!list) return;

    const ids = Object.keys(timers);
    if (ids.length === 0) {
      list.innerHTML = '<i>暂无正在运行的倒计时</i>';
      return;
    }

    let html = '';
    ids.forEach((id) => {
      const remain = DURATION_MS - (Date.now() - timers[id]);
      const m = Math.floor(remain / 60000);
      const s = Math.floor((remain % 60000) / 1000);
      html += `<div style="margin:4px 0;">
        计划ID：<b>${id}</b> |
        剩余 ${m}分${s.toString().padStart(2, '0')}秒
        <button data-id="${id}" style="margin-left:6px;background:#e33;color:#fff;border:none;border-radius:4px;padding:1px 4px;cursor:pointer;">❌清除</button>
      </div>`;
    });

    list.innerHTML = html;
    list.querySelectorAll('button[data-id]').forEach((btn) => {
      btn.onclick = () => removeCountdown(btn.dataset.id);
    });
  }

  // 删除倒计时
  function removeCountdown(planId) {
    const row = findRowByPlanId(planId);
    if (row) row.querySelector('.tm-countdown')?.remove();
    if (countdownMap.has(planId)) clearInterval(countdownMap.get(planId));

    delete timers[planId];
    countdownMap.delete(planId);
    GM_setValue(STORAGE_KEY, timers);
    console.log(`🧹 已清除倒计时 | 计划 ${planId}`);
    updateManagerPanel();
  }
})();
