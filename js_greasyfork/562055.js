// ==UserScript==
// @name         UUTIX Helper (v13)
// @namespace    http://tampermonkey.net/
// @version      2026-01-10.13.1
// @description  分步复查：入口按钮监听“已订阅→购买”后点击；场次/票价/数量每步必须确认完成才进入下一步；场次=1跳过切换与loading；最后狂点購買，但点到后不立刻停——严格等待跳转到購物車页再停止。
// @author       You
// @match        https://www.uutix.com/detail?pId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uutix.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562055/UUTIX%20Helper%20%28v13%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562055/UUTIX%20Helper%20%28v13%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let submitIntervalId = null;
  let entryObserver = null;

  let isRunning = false;
  let runToken = 0;

  GM_addStyle(`
    #uutix-helper-panel * { transition:none !important; animation:none !important; }
    #uutix-helper-panel{
      all: initial; position: fixed; top: 20px; right: 20px; z-index: 99999;
      background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:18px;
      font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,.15);
      display:flex; flex-direction:column; gap:12px; width:360px;
    }
    #uutix-helper-panel button{ cursor:pointer; padding:8px; border-radius:6px; border:none; font-weight:bold; }
    #status-display{ font-size:13px; padding:8px; text-align:center; border-radius:8px; background:#f5f5f5; }
    #uutix-helper-panel input{ font-size:13px; padding:2px 6px; border-radius:4px; outline:none; }
  `);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function updateStatus(msg, color = '#333') {
    const s = document.getElementById('status-display');
    if (s) {
      s.textContent = `状态: ${msg}`;
      s.style.color = color;
    }
  }

  function isDisabled(el) {
    if (!el) return true;
    if (el.disabled) return true;
    const aria = el.getAttribute('aria-disabled');
    if (aria && aria.toLowerCase() === 'true') return true;
    if (el.classList && el.classList.contains('disabled')) return true;
    return false;
  }

  function clearSubmitInterval() {
    if (submitIntervalId) clearInterval(submitIntervalId);
    submitIntervalId = null;
  }

  function clearEntryObserver() {
    if (entryObserver) {
      try { entryObserver.disconnect(); } catch (_) {}
      entryObserver = null;
    }
  }

  async function ensureNotStopped(token) {
    if (!isRunning || token !== runToken) throw new Error('已停止');
  }

  async function waitFor(fn, token, timeoutMs = 12000, intervalMs = 20, errMsg = '等待超时') {
    const t0 = Date.now();
    while (true) {
      await ensureNotStopped(token);
      const v = fn();
      if (v) return v;
      if (Date.now() - t0 > timeoutMs) throw new Error(errMsg);
      await sleep(intervalMs);
    }
  }

  async function waitUntil(condFn, token, timeoutMs = 8000, intervalMs = 20, errMsg = '等待条件超时') {
    const t0 = Date.now();
    while (true) {
      await ensureNotStopped(token);
      if (condFn()) return true;
      if (Date.now() - t0 > timeoutMs) throw new Error(errMsg);
      await sleep(intervalMs);
    }
  }

  // --------------------------
  // Loading（仅切换非默认场次时严格等待）
  // --------------------------
  function getLoadingEl() { return document.getElementById('loading-modal'); }

  function isLoadingVisible() {
    const m = getLoadingEl();
    if (!m) return false;
    const cs = getComputedStyle(m);
    if (cs.display === 'none') return false;
    if (cs.visibility === 'hidden') return false;
    const op = parseFloat(cs.opacity || '1');
    if (!Number.isNaN(op) && op <= 0.01) return false;
    return true;
  }

  async function waitLoadingStableGone(token, {
    appearWindowMs = 1600,
    disappearTimeoutMs = 25000,
    stableGoneMs = 350
  } = {}) {
    if (!getLoadingEl()) return;

    const t0 = Date.now();
    let appeared = false;
    while (Date.now() - t0 < appearWindowMs) {
      await ensureNotStopped(token);
      if (isLoadingVisible()) { appeared = true; break; }
      await sleep(20);
    }

    if (appeared) {
      const t1 = Date.now();
      while (true) {
        await ensureNotStopped(token);
        if (!isLoadingVisible()) break;
        if (Date.now() - t1 > disappearTimeoutMs) throw new Error('等待 loading 消失超时');
        await sleep(30);
      }
    }

    let goneStart = null;
    const t2 = Date.now();
    while (true) {
      await ensureNotStopped(token);

      if (!isLoadingVisible()) {
        if (goneStart == null) goneStart = Date.now();
        if (Date.now() - goneStart >= stableGoneMs) return;
      } else {
        goneStart = null;
      }

      if (Date.now() - t2 > disappearTimeoutMs) throw new Error('等待 loading 稳定结束超时');
      await sleep(20);
    }
  }

  // --------------------------
  // 超快点击 & 稳定确认
  // --------------------------
  async function fastClick(element, times, token, gapMs = 12) {
    for (let i = 0; i < times; i++) {
      await ensureNotStopped(token);
      element.click();
      if (gapMs) await sleep(gapMs);
    }
  }

  async function waitCondStable(condFn, token, stableMs = 120, timeoutMs = 3500, pollMs = 16, errMsg = '状态稳定确认超时') {
    const t0 = Date.now();
    let okStart = null;

    while (true) {
      await ensureNotStopped(token);

      if (isLoadingVisible()) {
        okStart = null;
        await sleep(pollMs);
        continue;
      }

      if (condFn()) {
        if (okStart == null) okStart = Date.now();
        if (Date.now() - okStart >= stableMs) return true;
      } else {
        okStart = null;
      }

      if (Date.now() - t0 > timeoutMs) throw new Error(errMsg);
      await sleep(pollMs);
    }
  }

  async function retryStep(stepName, token, actionFn, stableCheckFn, { maxRetry = 60, betweenMs = 35 } = {}) {
    for (let i = 1; i <= maxRetry; i++) {
      await ensureNotStopped(token);
      updateStatus(`${stepName}：尝试 ${i}/${maxRetry}...`, '#ff9800');

      while (isLoadingVisible()) {
        await ensureNotStopped(token);
        await sleep(25);
      }

      await actionFn(i);

      const ok = await stableCheckFn();
      if (ok) {
        updateStatus(`${stepName}：完成 ✅`, '#28a745');
        return true;
      }

      await sleep(betweenMs);
    }
    throw new Error(`${stepName}：超过重试次数仍未完成（已阻止继续）`);
  }

  // --------------------------
  // DOM helpers
  // --------------------------
  function getSessionDropdown() {
    return document.querySelector('.show-area .show-dropdown-select') || document.querySelector('.show-dropdown-select');
  }
  function getSessionContainerVisible() {
    const dd = getSessionDropdown();
    if (!dd) return null;
    const c = dd.querySelector('.select-item-container');
    if (!c) return null;
    return (getComputedStyle(c).display !== 'none') ? c : null;
  }
  function getSelectedSessionWrap() {
    const dd = getSessionDropdown();
    if (!dd) return null;
    const selItem = dd.querySelector('.select-item-container .item.selected');
    return selItem ? selItem.closest('.item-wrap') : null;
  }
  function parseShowIdFromWrap(wrap) {
    const lxMv = wrap?.getAttribute('lx-mv') || '';
    const m = lxMv.match(/"show_id"\s*:\s*(\d+)/);
    return m ? m[1] : null;
  }

  function getPriceList() {
    return document.querySelector('.multiple-ticket-area .select-item-list-pc') || document.querySelector('.select-item-list-pc');
  }
  function getPriceWraps(priceList) {
    if (!priceList) return [];
    const wraps = Array.from(priceList.querySelectorAll(':scope > .item-wrap'));
    return wraps.length ? wraps : Array.from(priceList.querySelectorAll('.item-wrap'));
  }
  function getSelectedTicketWrap() {
    const priceList = getPriceList();
    if (!priceList) return null;
    const selItem = priceList.querySelector('.item.selected');
    return selItem ? selItem.closest('.item-wrap') : null;
  }
  function parseTicketIdFromWrap(wrap) {
    const lxMv = wrap?.getAttribute('lx-mv') || '';
    const m = lxMv.match(/"ticket_id"\s*:\s*(\d+)/);
    return m ? m[1] : null;
  }

  function getQuantityNumber() {
    const el = document.querySelector('.number-select .middle.number') || document.querySelector('.number-select .middle');
    const t = (el?.textContent || '').trim();
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : null;
  }
  function getIncreaseBtn() {
    return document.querySelector('.number-select .increase') || document.querySelector('.number-select .wrapper.right .increase');
  }

  function getFinalBuyButton() {
    return document.querySelector('.price-wrapper button') || document.querySelector('.price-wrapper .right');
  }

  // --------------------------
  // ✅ 购票点击后：等待跳到购物车页再停止
  // --------------------------
  function isInShoppingCartPage() {
    // 1) URL 判断（最稳，最快）
    if (/\/shopping-cart/i.test(location.pathname) || /shopping-cart/i.test(location.href)) return true;

    // 2) DOM 标志（来自你给的購物車.html结构）
    // title: 購物車 / page wrapper: .shopping-carts-wrapper / step section: .step-section
    const title = document.title || '';
    if (title.includes('購物車') || title.includes('购物车')) return true;
    if (document.querySelector('.shopping-carts-wrapper')) return true;
    if (document.querySelector('.step-section')) return true;

    return false;
  }

  async function waitEnterCartAfterClick(token, {
    waitMs = 12000,        // 最多等 12s
    stableMs = 250,        // 连续满足 250ms 才算真正进入
    pollMs = 25,
    keepClickIntervalMs = 120 // 等待期间每隔 120ms 补点一次（比狂点轻很多）
  } = {}) {
    const t0 = Date.now();
    let okStart = null;
    let lastKeepClick = 0;

    while (true) {
      await ensureNotStopped(token);

      // 如果已经跳到购物车，稳定确认
      if (isInShoppingCartPage()) {
        if (okStart == null) okStart = Date.now();
        if (Date.now() - okStart >= stableMs) return true;
      } else {
        okStart = null;
      }

      // 等待期间：如果还在 detail 页且按钮还能点，就间歇补点
      // （避免“点了但没触发路由/请求”这种偶发）
      if (!isInShoppingCartPage() && !isLoadingVisible()) {
        const now = Date.now();
        if (now - lastKeepClick >= keepClickIntervalMs) {
          const btn = getFinalBuyButton();
          if (btn && !isDisabled(btn)) btn.click();
          lastKeepClick = now;
        }
      }

      if (Date.now() - t0 > waitMs) return false;
      await sleep(pollMs);
    }
  }

  // --------------------------
  // ✅ 入口按钮：从“已订阅”变“购买”自动点击
  // --------------------------
  function getEntryButton() {
    return document.querySelector('.detail__info-btn .detail-normal-button') || document.querySelector('.detail-normal-button');
  }

  function isEntryBuyReady(btn) {
    if (!btn) return false;
    if (isDisabled(btn)) return false;
    if (btn.classList.contains('detail-subscribe-button')) return false;

    const txt = (btn.textContent || '').replace(/\s+/g, '');
    if (!txt) return false;
    if (txt.includes('已訂閱') || txt.includes('已订阅') || txt.includes('訂閱') || txt.includes('订阅')) return false;

    return /購買門票|購買|购买|立即購買|立即购买|Buy|BuyNow|下單|下单|結算|结算|搶購|抢购/.test(txt);
  }

  async function waitEntryBecomeBuyAndClick(token) {
  const btn = await waitFor(
    () => getEntryButton(),
    token,
    30000,
    50,
    '找不到入口按钮（detail-normal-button）'
  );

  updateStatus('等待入口按钮变为购买状态...', '#17a2b8');

  let clickTimer = null;

  function hasEnteredNextStep() {
    return (
      document.querySelector('.show-area') ||
      document.querySelector('.multiple-ticket-area') ||
      document.querySelector('.price-wrapper')
    );
  }

  function startClicking() {
    if (clickTimer) return;

    updateStatus('入口为购买状态：持续点击入口按钮...', '#007bff');

    clickTimer = setInterval(() => {
      try {
        if (!isRunning || token !== runToken) {
          clearInterval(clickTimer);
          clickTimer = null;
          return;
        }

        if (hasEnteredNextStep()) {
          clearInterval(clickTimer);
          clickTimer = null;
          updateStatus('已进入下一步界面 ✅', '#28a745');
          return;
        }

        const cur = getEntryButton();
        if (cur && isEntryBuyReady(cur)) {
          cur.click();
        }
      } catch (_) {}
    }, 50); // 👈 入口点击频率（20ms）
  }

  // 情况 1：一开始就是购买状态
  if (isEntryBuyReady(btn)) {
    startClicking();
  }

  // 情况 2：从“已订阅”变“购买”
  const parent =
    btn.parentElement ||
    document.querySelector('.detail__info-btn') ||
    document.body;

  entryObserver = new MutationObserver(() => {
    try {
      if (!isRunning || token !== runToken) return;

      const cur = getEntryButton();
      if (cur && isEntryBuyReady(cur)) {
        startClicking();
      }
    } catch (_) {}
  });

  try {
    entryObserver.observe(parent, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['class', 'style', 'disabled', 'aria-disabled']
    });
  } catch (_) {}

  // 阻塞等待：直到真正进入下一步
  await waitUntil(
    () => hasEnteredNextStep(),
    token,
    6 * 60 * 1000,
    50,
    '等待进入下一步界面超时'
  );

  clearEntryObserver();
  return true;
}


  // --------------------------
  // Step 1：场次（sessionPosition=1 跳过）
  // --------------------------
  async function stepSelectSession(sessionPosition, token) {
    if (sessionPosition === 1) {
      updateStatus('场次=1：跳过选择场次/Loading检查 ✅', '#28a745');
      return { targetShowId: null, skipped: true };
    }

    const dd = await waitFor(() => getSessionDropdown(), token, 12000, 20, '找不到场次下拉框');
    const checked = await waitFor(() => dd.querySelector('.checked-content'), token, 12000, 20, '找不到 checked-content');

    let targetShowId = null;

    await retryStep(
      `选择场次#${sessionPosition}`,
      token,
      async () => {
        checked.click();

        const container = await waitFor(() => getSessionContainerVisible(), token, 6000, 20, '场次下拉未展开');
        const items = Array.from(container.querySelectorAll('.item-wrap .item'));
        if (!items.length) throw new Error('场次列表为空');

        const target = items[sessionPosition - 1];
        if (!target) throw new Error(`无效场次位置：${sessionPosition}（当前只有 ${items.length} 个场次）`);

        const wrap = target.closest('.item-wrap');
        targetShowId = parseShowIdFromWrap(wrap) || targetShowId;

        target.scrollIntoView({ block: 'center' });
        target.click();

        await sleep(20);
        const c2 = dd.querySelector('.select-item-container');
        if (c2 && getComputedStyle(c2).display !== 'none') checked.click();

        updateStatus('切换场次：等待 loading 稳定结束...', '#ffc107');
        await waitLoadingStableGone(token, { stableGoneMs: 320 });
      },
      async () => {
        return await waitCondStable(() => {
          const selWrap = getSelectedSessionWrap();
          if (!selWrap) return false;
          const selId = parseShowIdFromWrap(selWrap);
          if (targetShowId) return selId === targetShowId;
          return !!selId;
        }, token, 120, 3500, 16, '场次稳定确认超时');
      },
      { maxRetry: 60, betweenMs: 35 }
    );

    return { targetShowId, skipped: false };
  }

  // --------------------------
  // Step 2：票价
  // --------------------------
  async function stepSelectPrice(pricePosition, token) {
    let targetTicketId = null;

    await retryStep(
      `选择票价#${pricePosition}`,
      token,
      async () => {
        const priceList = await waitFor(() => getPriceList(), token, 20000, 20, '等待票价列表超时');
        const wraps = getPriceWraps(priceList);
        if (!wraps.length) throw new Error('票价列表为空');

        const targetWrap = wraps[pricePosition - 1];
        if (!targetWrap) throw new Error(`无效票价位置：${pricePosition}（当前只有 ${wraps.length} 个票价）`);

        const item = targetWrap.querySelector('.item') || targetWrap;
        if (!item) throw new Error('票价项结构异常');

        if (item.classList?.contains('disabled') || isDisabled(item)) {
          throw new Error(`目标票价#${pricePosition} 为 disabled/售罄`);
        }

        targetTicketId = parseTicketIdFromWrap(targetWrap) || targetTicketId;

        item.scrollIntoView({ block: 'center' });
        item.click();
      },
      async () => {
        return await waitCondStable(() => {
          const selWrap = getSelectedTicketWrap();
          if (!selWrap) return false;
          const selId = parseTicketIdFromWrap(selWrap);
          if (targetTicketId) return selId === targetTicketId;
          return !!selId;
        }, token, 110, 3200, 16, '票价稳定确认超时');
      },
      { maxRetry: 80, betweenMs: 25 }
    );

    return { targetTicketId };
  }

  // --------------------------
  // Step 3：数量
  // --------------------------
  async function stepSetQuantity(quantity, token) {
    if (quantity <= 1) {
      await waitCondStable(() => {
        const n = getQuantityNumber();
        return n === 1 || n === null;
      }, token, 80, 2000, 20, '数量=1 确认超时');
      return { quantity };
    }

    await retryStep(
      `设置数量=${quantity}`,
      token,
      async () => {
        const inc = getIncreaseBtn();
        if (!inc) throw new Error('未找到加号按钮');

        const n = getQuantityNumber();
        if (Number.isFinite(n) && n < quantity) {
          await fastClick(inc, quantity - n, token, 12);
        } else if (n === null) {
          await fastClick(inc, Math.max(0, quantity - 1), token, 12);
        }
      },
      async () => {
        return await waitCondStable(() => {
          const n = getQuantityNumber();
          if (n === null) return true;
          return n === quantity;
        }, token, 100, 3200, 16, '数量稳定确认超时');
      },
      { maxRetry: 90, betweenMs: 20 }
    );

    return { quantity };
  }

  // --------------------------
  // 主流程
  // --------------------------
  function readTargetsFromPanel() {
    const sessionPosition = parseInt(document.getElementById('session-position')?.value, 10) || 1;
    const pricePosition = parseInt(document.getElementById('price-position')?.value, 10) || 1;
    const quantity = parseInt(document.getElementById('ticket-quantity')?.value, 10) || 1;
    return { sessionPosition, pricePosition, quantity };
  }

  async function executePurchaseSequence(token) {
    try {
      const target = readTargetsFromPanel();

      updateStatus('等待选择界面出现...', '#ffc107');
      await waitFor(
        () => document.querySelector('.show-area') || document.querySelector('.multiple-ticket-area') || document.querySelector('.price-wrapper'),
        token,
        20000,
        20,
        '等待选择界面超时'
      );

      if (target.sessionPosition !== 1 && isLoadingVisible()) {
        updateStatus('开始前：等待 loading 稳定结束...', '#ffc107');
        await waitLoadingStableGone(token, { stableGoneMs: 280 });
      }

      const s = await stepSelectSession(target.sessionPosition, token);

      if (!s.skipped) {
        updateStatus('等待票价列表刷新...', '#ffc107');
        await waitFor(() => getPriceList(), token, 25000, 20, '等待票价列表超时');
      }

      const p = await stepSelectPrice(target.pricePosition, token);

      await stepSetQuantity(target.quantity, token);

      updateStatus('最终核对 + 等待購買可用...', '#ffc107');
      await waitUntil(() => {
        if (isLoadingVisible()) return false;
        const btn = getFinalBuyButton();
        if (!btn || isDisabled(btn)) return false;

        const curShowId = parseShowIdFromWrap(getSelectedSessionWrap());
        const curTicketId = parseTicketIdFromWrap(getSelectedTicketWrap());
        const curQty = getQuantityNumber();

        const okShow = s.targetShowId ? (curShowId === s.targetShowId) : true;
        const okTicket = p.targetTicketId ? (curTicketId === p.targetTicketId) : true;
        const okQty = (curQty === null) ? true : (curQty === target.quantity);

        return okShow && okTicket && okQty;
      }, token, 20000, 20, '最终核对未通过/購買不可用（已阻止提交）');

      // --------------------------
      // 最终：狂点購買，但不立刻停止
      // --------------------------
      updateStatus('提交订单中（狂点購買）...', '#007bff');
      clearSubmitInterval();

      let clickedAtLeastOnce = false;
      let retry = 0;

      submitIntervalId = setInterval(async () => {
        try {
          if (!isRunning || token !== runToken) {
            clearSubmitInterval();
            return;
          }
          if (isLoadingVisible()) return;

          // 如果已经跳转到购物车页，结束
          if (isInShoppingCartPage()) {
            clearSubmitInterval();
            updateStatus('已进入購物車页 ✅（停止）', '#28a745');
            stopMonitoring(true);
            return;
          }

          const btn = getFinalBuyButton();
          if (btn && !isDisabled(btn)) {
            btn.click();
            clickedAtLeastOnce = true;
          }

          // 点击过至少一次后：改为“等待跳转阶段”而不是马上停
          if (clickedAtLeastOnce) {
            // 让 setInterval 别继续狂点太久：这里做一次异步等待跳转（短时间）
            clearSubmitInterval();
            updateStatus('已点击購買：等待跳转到購物車...', '#17a2b8');

            const ok = await waitEnterCartAfterClick(token, {
              waitMs: 12000,
              stableMs: 250,
              pollMs: 25,
              keepClickIntervalMs: 120
            });

            if (ok) {
              updateStatus('已进入購物車页 ✅（停止）', '#28a745');
              stopMonitoring(true);
            } else {
              // 没跳转成功：回到狂点（但给出提示）
              updateStatus('未进入購物車：继续狂点購買...', '#ff9800');
              // 重新启动狂点 interval
              retry = 0;
              clickedAtLeastOnce = false;
              submitIntervalId = setInterval(arguments.callee, 18);
            }
            return;
          }

          if (retry++ > 320) {
            clearSubmitInterval();
            updateStatus('超时：请手动点击', '#dc3545');
          }
        } catch (e) {
          clearSubmitInterval();
          if (String(e?.message || '') === '已停止') updateStatus('已停止', '#6c757d');
          else updateStatus(`出错: ${e.message || e}`, '#dc3545');
          stopMonitoring(true);
        }
      }, 18);

    } catch (e) {
      console.error('UUTIX 脚本错误:', e);
      if (String(e?.message || '') === '已停止') updateStatus('已停止', '#6c757d');
      else updateStatus(`出错: ${e.message || e}`, '#dc3545');
      stopMonitoring(true);
    }
  }

  // --------------------------
  // 开始/停止
  // --------------------------
  function startMonitoring() {
    if (isRunning) return;

    runToken++;
    const token = runToken;
    isRunning = true;

    updateStatus('等待入口按钮变为购买状态...', '#17a2b8');

    (async () => {
      try {
        await waitEntryBecomeBuyAndClick(token);
        executePurchaseSequence(token);
      } catch (e) {
        if (String(e?.message || '') === '已停止') updateStatus('已停止', '#6c757d');
        else updateStatus(`出错: ${e.message || e}`, '#dc3545');
        stopMonitoring(true);
      }
    })();
  }

  function stopMonitoring(keepStatus) {
    clearSubmitInterval();
    clearEntryObserver();

    runToken++; // 中断 await
    isRunning = false;

    const status = document.getElementById('status-display');
    if (!keepStatus && status && !status.textContent.includes('完成')) {
      updateStatus('已停止', '#6c757d');
    }
  }

  // --------------------------
  // 面板
  // --------------------------
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'uutix-helper-panel';
    panel.innerHTML = `
      <div style="font-weight:bold; font-size:16px; text-align:center;">UUTIX v13</div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px;">场次位置:</span>
        <input type="number" id="session-position" value="1" min="1" style="width:140px; border:1px solid #ccc;">
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px;">票价位置:</span>
        <input type="number" id="price-position" value="1" min="1" style="width:140px; border:1px solid #ccc;">
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px;">目标数量:</span>
        <input type="number" id="ticket-quantity" value="1" min="1" style="width:140px; border:1px solid #ccc;">
      </div>

      <div style="display:flex; gap:10px;">
        <button id="start-btn" style="flex:1; background:#28a745; color:#fff;">开始</button>
        <button id="stop-btn" style="flex:1; background:#dc3545; color:#fff;">停止</button>
      </div>

      <div id="status-display">状态: 准备就绪</div>
    `;
    document.body.appendChild(panel);

    document.getElementById('start-btn').onclick = startMonitoring;
    document.getElementById('stop-btn').onclick = () => stopMonitoring(false);
  }

  window.addEventListener('load', createControlPanel);
})();
