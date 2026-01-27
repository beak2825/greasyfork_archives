// ==UserScript==
// @name         New-API 令牌 USD 充值/撤回（按美元输入）
// @namespace    https://github.com/QuantumNous/new-api
// @version      0.1.1
// @description  在 New-API 控制台令牌页为每个令牌增加“追加额度/撤回”按钮：按美元输入，自动换算 quota，并调用 /api/token 更新 remain_quota。
// @match        https://xinbaoapi.dpdns.org/*
// @match        https://lightai.de5.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561482/New-API%20%E4%BB%A4%E7%89%8C%20USD%20%E5%85%85%E5%80%BC%E6%92%A4%E5%9B%9E%EF%BC%88%E6%8C%89%E7%BE%8E%E5%85%83%E8%BE%93%E5%85%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561482/New-API%20%E4%BB%A4%E7%89%8C%20USD%20%E5%85%85%E5%80%BC%E6%92%A4%E5%9B%9E%EF%BC%88%E6%8C%89%E7%BE%8E%E5%85%83%E8%BE%93%E5%85%A5%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 建议：把上面的 @match 收敛到你自己的域名，避免脚本在无关站点运行。
  // 例如：
  //   // @match https://example.com/*
  //   // @match http://example.com/*

  const POLL_INTERVAL_MS = 800;
  const PAGE_SIZE = 100; // 后端限制 page_size <= 100
  const INDEX_TTL_MS = 60_000;

  const STORAGE_PREFIX = 'tm_newapi_token_topup_last_';
  const ACTIONS_ATTR = 'data-tm-token-topup-actions';

  const uiText = {
    topup: '追加额度',
    revert: '撤回',
    processing: '处理中...',
  };

  const state = {
    indexLoadedAt: 0,
    byKey: new Map(), // key(without sk-) -> token summary
    byMaskedKey: new Map(), // masked display string -> token summary
    running: false,
    scanning: false,
  };

  function isTokenPage() {
    const path = window.location.pathname || '';
    return (
      path.includes('/console/token') ||
      path === '/token' ||
      path.startsWith('/token/')
    );
  }

  function safeJsonParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function getUserId() {
    // new-api 前端默认 localStorage.user = { id, role, ... }
    const raw = localStorage.getItem('user');
    if (!raw) return 1;
    const user = safeJsonParse(raw, null);
    const userId = Number(user?.id);
    return Number.isFinite(userId) ? userId : 1;
  }

  async function apiFetchJson(url, init = {}) {
    const userId = getUserId();
    const resp = await fetch(url, {
      credentials: 'include',
      ...init,
      headers: {
        'New-API-User': String(userId),
        'Cache-Control': 'no-store',
        ...(init.headers || {}),
      },
    });

    const text = await resp.text();
    const json = safeJsonParse(text, null);
    if (!json) {
      throw new Error(
        `接口返回非 JSON（HTTP ${resp.status}）：${text.slice(0, 200)}`,
      );
    }
    return { resp, json };
  }

  async function apiGet(url) {
    return apiFetchJson(url, { method: 'GET' });
  }

  async function apiPutJson(url, body) {
    return apiFetchJson(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  function getQuotaPerUnit() {
    const parsed = Number(localStorage.getItem('quota_per_unit'));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    // fallback: 与服务端默认保持一致
    return 500 * 1000;
  }

  function usdToQuota(usd) {
    const quotaPerUnit = getQuotaPerUnit();
    const q = Number(usd) * quotaPerUnit;
    // quota 是 int；默认四舍五入，避免长期累积误差
    return Math.round(q);
  }

  function quotaToUsd(quota) {
    return (Number(quota) || 0) / getQuotaPerUnit();
  }

  function formatNumber(n) {
    try {
      return new Intl.NumberFormat(undefined).format(n);
    } catch {
      return String(n);
    }
  }

  function formatUSD(usd, digits = 6) {
    if (usd === null || usd === undefined) return '';
    if (!Number.isFinite(usd)) return '∞';
    return `$${usd.toFixed(digits)}`;
  }

  function formatQuotaUsdPair(quota) {
    const q = Number(quota) || 0;
    const usd = quotaToUsd(q);
    return `${formatNumber(q)} (≈ ${formatUSD(usd)})`;
  }

  function formatUnixSecondsToLocalString(tsSeconds) {
    const n = Number(tsSeconds);
    if (!Number.isFinite(n)) return '';
    if (n === -1) return '永不过期';
    if (n <= 0) return '';
    try {
      return new Date(n * 1000).toLocaleString();
    } catch {
      return String(n);
    }
  }

  function maskTokenKeyRaw(keyRaw) {
    const k = String(keyRaw || '');
    if (!k) return '';
    if (k.length <= 8) return `sk-${k}`;
    return `sk-${k.slice(0, 4)}**********${k.slice(-4)}`;
  }

  function storageKey(tokenId) {
    return `${STORAGE_PREFIX}${tokenId}`;
  }

  function loadLastOp(tokenId) {
    const raw = localStorage.getItem(storageKey(tokenId));
    if (!raw) return null;
    const data = safeJsonParse(raw, null);
    if (!data || data.tokenId !== tokenId) return null;
    return data;
  }

  function saveLastOp(op) {
    localStorage.setItem(storageKey(op.tokenId), JSON.stringify(op));
  }

  function clearLastOp(tokenId) {
    localStorage.removeItem(storageKey(tokenId));
  }

  function extractTokens(data) {
    if (Array.isArray(data)) return { items: data, total: data.length };
    const items = Array.isArray(data?.items) ? data.items : [];
    const total = typeof data?.total === 'number' ? data.total : undefined;
    return { items, total };
  }

  async function fetchAllTokens() {
    const tokens = [];
    for (let page = 1; ; page += 1) {
      const { resp, json } = await apiGet(`/api/token/?p=${page}&size=${PAGE_SIZE}`);
      if (!resp.ok) throw new Error(`请求失败 HTTP ${resp.status}：${json?.message || ''}`);
      if (!json?.success) throw new Error(json?.message || '接口返回 success=false');

      const { items, total } = extractTokens(json.data);
      tokens.push(...items);

      if (typeof total === 'number' && tokens.length >= total) break;
      if (items.length < PAGE_SIZE) break;
    }
    return tokens;
  }

  function buildIndex(tokens) {
    state.byKey.clear();
    state.byMaskedKey.clear();

    for (const t of tokens) {
      const key = String(t?.key || '');
      if (!key) continue;
      state.byKey.set(key, t);
      state.byMaskedKey.set(maskTokenKeyRaw(key), t);
    }
    state.indexLoadedAt = Date.now();
  }

  async function ensureIndexFresh() {
    const now = Date.now();
    if (now - state.indexLoadedAt <= INDEX_TTL_MS && state.byKey.size > 0) return;
    const tokens = await fetchAllTokens();
    buildIndex(tokens);
  }

  function getTokenKeyFromRow(rowEl) {
    // Semi Table 通常会带 data-row-key（CardTable 的 rowKey='key'）
    const rowKey = rowEl?.dataset?.rowKey;
    if (rowKey && rowKey.length >= 8 && !rowKey.includes('*')) {
      return String(rowKey);
    }

    // 否则尝试从“密钥”列 Input 的 value 解析
    const inputs = rowEl?.querySelectorAll?.('input');
    if (!inputs || inputs.length === 0) return null;
    const tokenInput = Array.from(inputs).find((el) =>
      String(el?.value || '').startsWith('sk-'),
    );
    if (!tokenInput) return null;
    const value = String(tokenInput.value || '');
    if (!value.startsWith('sk-')) return null;

    // 如果是明文：sk-<key>
    if (!value.includes('*')) return value.slice(3);

    // 如果是掩码：sk-AAAA**********BBBB
    const matched = state.byMaskedKey.get(value);
    if (matched?.key) return String(matched.key);
    return null;
  }

  async function getTokenIdFromRow(rowEl) {
    await ensureIndexFresh();
    const tokenKey = getTokenKeyFromRow(rowEl);
    if (!tokenKey) return null;
    const token = state.byKey.get(tokenKey);
    return token?.id ?? null;
  }

  async function fetchTokenById(tokenId) {
    const { resp, json } = await apiGet(`/api/token/${tokenId}`);
    if (!resp.ok) throw new Error(`请求失败 HTTP ${resp.status}：${json?.message || ''}`);
    if (!json?.success) throw new Error(json?.message || '接口返回 success=false');
    return json.data;
  }

  async function updateTokenRemainQuota(token, newRemainQuota) {
    const payload = {
      id: token.id,
      name: token.name,
      expired_time: token.expired_time,
      remain_quota: newRemainQuota,
      unlimited_quota: token.unlimited_quota,
      model_limits_enabled: token.model_limits_enabled,
      model_limits: token.model_limits,
      allow_ips: token.allow_ips,
      group: token.group,
      cross_group_retry: token.cross_group_retry,
    };

    const { resp, json } = await apiPutJson('/api/token/', payload);
    if (!resp.ok) throw new Error(`请求失败 HTTP ${resp.status}：${json?.message || ''}`);
    if (!json?.success) throw new Error(json?.message || '接口返回 success=false');
  }

  function promptUsdAmount(defaultUsd = '100') {
    const raw = prompt('请输入要追加的美元额度（USD）：', defaultUsd);
    if (raw === null) return null;
    const usd = Number(String(raw).trim());
    if (!Number.isFinite(usd) || usd <= 0) {
      alert('金额格式错误：请输入大于 0 的数字（例如 100 或 12.5）');
      return null;
    }
    return usd;
  }

  function buildTopupConfirmMessage({
    token,
    beforeRemainQuota,
    beforeUsedQuota,
    addUsd,
    addQuota,
    afterRemainQuota,
  }) {
    const beforeTotalQuota = beforeRemainQuota + beforeUsedQuota;
    const afterTotalQuota = afterRemainQuota + beforeUsedQuota;

    const quotaPerUnit = getQuotaPerUnit();
    const tokenKeyMasked = maskTokenKeyRaw(token?.key);

    return [
      '⚠️ 二次确认：将修改令牌剩余额度（remain_quota）',
      '',
      `令牌：${token?.name || ''} (id=${token?.id})`,
      `Key：${tokenKeyMasked}`,
      '',
      `充值前：`,
      `- 剩余额度：${formatQuotaUsdPair(beforeRemainQuota)}`,
      `- 已用额度：${formatQuotaUsdPair(beforeUsedQuota)}`,
      `- 总额度：${formatQuotaUsdPair(beforeTotalQuota)}`,
      '',
      `本次追加：`,
      `- 金额：${formatUSD(addUsd, 6)}（按 USD 输入）`,
      `- 换算 quota：${formatNumber(addQuota)}（quota_per_unit=${formatNumber(quotaPerUnit)}）`,
      '',
      `充值后：`,
      `- 剩余额度：${formatQuotaUsdPair(afterRemainQuota)}`,
      `- 总额度：${formatQuotaUsdPair(afterTotalQuota)}`,
      '',
      `备注：创建时间 ${formatUnixSecondsToLocalString(token?.created_time)}`,
      '',
      '确认继续提现吗？',
    ].join('\n');
  }

  function buildRevertConfirmMessage({
    token,
    currentRemainQuota,
    currentUsedQuota,
    op,
    revertRemainQuota,
    revertMode,
  }) {
    const tokenKeyMasked = maskTokenKeyRaw(token?.key);
    const quotaPerUnit = getQuotaPerUnit();

    const currentTotalQuota = currentRemainQuota + currentUsedQuota;
    const revertTotalQuota = revertRemainQuota + currentUsedQuota;

    return [
      '⚠️ 二次确认：撤回上次“追加额度”操作',
      '',
      `令牌：${token?.name || ''} (id=${token?.id})`,
      `Key：${tokenKeyMasked}`,
      '',
      `当前：`,
      `- 剩余额度：${formatQuotaUsdPair(currentRemainQuota)}`,
      `- 总额度：${formatQuotaUsdPair(currentTotalQuota)}`,
      '',
      `上次追加记录：`,
      `- 追加金额(USD)：${formatUSD(op.addUsd, 6)}`,
      `- 追加 quota：${formatNumber(op.addQuota)}（quota_per_unit=${formatNumber(op.quotaPerUnit)}）`,
      `- 记录时间：${new Date(op.timestampMs).toLocaleString()}`,
      `- 记录前 remain_quota：${formatQuotaUsdPair(op.beforeRemainQuota)}`,
      `- 记录后 remain_quota：${formatQuotaUsdPair(op.afterRemainQuota)}`,
      '',
      `本次撤回方式：${revertMode}`,
      `撤回后：`,
      `- 剩余额度：${formatQuotaUsdPair(revertRemainQuota)}`,
      `- 总额度：${formatQuotaUsdPair(revertTotalQuota)}`,
      '',
      `备注：本页面 quota_per_unit=${formatNumber(quotaPerUnit)}（仅用于换算展示）`,
      '',
      '确认继续提现吗？',
    ].join('\n');
  }

  async function handleTopup(tokenId) {
    const usd = promptUsdAmount('100');
    if (usd === null) return;

    const token = await fetchTokenById(tokenId);
    if (token?.unlimited_quota) {
      alert('该令牌为“无限额度”，无需追加。');
      return;
    }

    const beforeRemainQuota = Number(token?.remain_quota) || 0;
    const beforeUsedQuota = Number(token?.used_quota) || 0;
    const addQuota = usdToQuota(usd);
    if (!Number.isFinite(addQuota) || addQuota <= 0) {
      alert('换算后的 quota 无效（可能是 quota_per_unit 未正确加载）。');
      return;
    }

    const afterRemainQuota = beforeRemainQuota + addQuota;

    const ok = confirm(
      buildTopupConfirmMessage({
        token,
        beforeRemainQuota,
        beforeUsedQuota,
        addUsd: usd,
        addQuota,
        afterRemainQuota,
      }),
    );
    if (!ok) return;

    await updateTokenRemainQuota(token, afterRemainQuota);

    saveLastOp({
      tokenId: token.id,
      tokenName: token.name || '',
      tokenKeyMasked: maskTokenKeyRaw(token.key),
      quotaPerUnit: getQuotaPerUnit(),
      addUsd: usd,
      addQuota,
      beforeRemainQuota,
      afterRemainQuota,
      beforeUsedQuota,
      timestampMs: Date.now(),
    });

    alert('已完成追加额度。建议刷新页面以看到最新数值。');
  }

  async function handleRevert(tokenId) {
    const op = loadLastOp(tokenId);
    if (!op) {
      alert('没有找到可撤回的记录（仅支持撤回“通过本脚本追加”的上一次操作）。');
      return;
    }

    const token = await fetchTokenById(tokenId);
    if (token?.unlimited_quota) {
      alert('该令牌为“无限额度”，无需撤回。');
      return;
    }

    const currentRemainQuota = Number(token?.remain_quota) || 0;
    const currentUsedQuota = Number(token?.used_quota) || 0;

    let revertRemainQuota = op.beforeRemainQuota;
    let revertMode = '恢复到“记录前 remain_quota”';

    // 如果令牌在追加后发生过消耗/修改，直接恢复到 before 可能覆盖当前剩余；
    // 这时默认用“按差值撤回”，更符合“撤回上次增加”的直觉。
    if (currentRemainQuota !== op.afterRemainQuota) {
      revertRemainQuota = currentRemainQuota - (Number(op.addQuota) || 0);
      revertMode = '按差值撤回（当前 remain_quota - 上次追加 quota）';
    }

    if (!Number.isFinite(revertRemainQuota)) {
      alert('撤回计算失败：remain_quota 非法。');
      return;
    }
    if (revertRemainQuota < 0) {
      const okClamp = confirm(
        `撤回后剩余额度将为负数（${revertRemainQuota}）。是否将其截断为 0 并继续？`,
      );
      if (!okClamp) return;
      revertRemainQuota = 0;
    }

    const ok = confirm(
      buildRevertConfirmMessage({
        token,
        currentRemainQuota,
        currentUsedQuota,
        op,
        revertRemainQuota,
        revertMode,
      }),
    );
    if (!ok) return;

    await updateTokenRemainQuota(token, revertRemainQuota);
    clearLastOp(tokenId);
    alert('已撤回上次追加。建议刷新页面以看到最新数值。');
  }

  function createActionButton(label, variant = 'default') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.padding = '4px 8px';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid rgba(0,0,0,0.15)';
    btn.style.background = variant === 'danger' ? '#ef4444' : '#f3f4f6';
    btn.style.color = variant === 'danger' ? '#ffffff' : '#111827';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.lineHeight = '1.2';
    return btn;
  }

  function injectButtonsIntoOperateCell(operateCell, tokenId) {
    if (!operateCell) return;
    if (operateCell.querySelector?.(`[${ACTIONS_ATTR}="${tokenId}"]`)) return;

    const container = document.createElement('span');
    container.setAttribute(ACTIONS_ATTR, String(tokenId));
    container.style.display = 'inline-flex';
    container.style.gap = '6px';
    container.style.alignItems = 'center';
    container.style.marginLeft = '6px';

    const btnTopup = createActionButton(uiText.topup, 'default');
    const btnRevert = createActionButton(uiText.revert, 'danger');

    const refreshRevertEnabled = () => {
      const op = loadLastOp(tokenId);
      btnRevert.disabled = !op;
      btnRevert.style.opacity = btnRevert.disabled ? '0.45' : '1';
      btnRevert.style.cursor = btnRevert.disabled ? 'not-allowed' : 'pointer';
    };
    refreshRevertEnabled();

    btnTopup.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (state.running) return;
      state.running = true;
      const oldText = btnTopup.textContent;
      btnTopup.textContent = uiText.processing;
      btnTopup.disabled = true;
      try {
        await handleTopup(tokenId);
      } catch (err) {
        console.error('[New-API Topup] error:', err);
        alert(`操作失败：${err?.message || String(err)}`);
      } finally {
        state.running = false;
        btnTopup.textContent = oldText;
        btnTopup.disabled = false;
        refreshRevertEnabled();
      }
    });

    btnRevert.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (btnRevert.disabled) return;
      if (state.running) return;
      state.running = true;
      const oldText = btnRevert.textContent;
      btnRevert.textContent = uiText.processing;
      btnRevert.disabled = true;
      try {
        await handleRevert(tokenId);
      } catch (err) {
        console.error('[New-API Topup] error:', err);
        alert(`操作失败：${err?.message || String(err)}`);
      } finally {
        state.running = false;
        btnRevert.textContent = oldText;
        refreshRevertEnabled();
      }
    });

    container.appendChild(btnTopup);
    container.appendChild(btnRevert);

    // 尽量塞进 Semi 的 Space 容器里，避免布局错位；否则直接追加到操作单元格
    const space = operateCell.querySelector?.('.semi-space');
    (space || operateCell).appendChild(container);
  }

  async function scanAndInject() {
    if (!isTokenPage()) return;
    if (state.scanning) return;
    state.scanning = true;
    try {

      // 桌面端 Semi Table：优先扫描 tr，再通过 token key input 过滤
      const rows = document.querySelectorAll('tr');
      if (!rows || rows.length === 0) return;

      for (const row of rows) {
        // 仅处理包含 token key 输入框的行
        const inputs = row.querySelectorAll?.('input');
        const hasTokenKeyInput =
          inputs &&
          Array.from(inputs).some((el) =>
            String(el?.value || '').startsWith('sk-'),
          );
        if (!hasTokenKeyInput) continue;

        // last cell is operate column
        const cells = row.querySelectorAll('td');
        if (!cells || cells.length === 0) continue;
        const operateCell = cells[cells.length - 1];

        let tokenId = null;
        try {
          tokenId = await getTokenIdFromRow(row);
        } catch (e) {
          // index 拉取失败等情况：跳过本轮
          console.warn('[New-API Topup] failed to resolve token id:', e);
          continue;
        }
        if (!tokenId) continue;
        injectButtonsIntoOperateCell(operateCell, tokenId);
      }
    } finally {
      state.scanning = false;
    }
  }

  // 简单轮询（在 React SPA 下比一次性 DOMReady 更稳）
  setInterval(() => {
    scanAndInject().catch((err) => {
      console.warn('[New-API Topup] scan failed:', err);
    });
  }, POLL_INTERVAL_MS);
})();
