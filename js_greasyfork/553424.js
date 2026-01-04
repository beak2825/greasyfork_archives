// ==UserScript==
// @name         淘宝型号价格导出 (CSV高兼容版v9.8)
// @namespace    https://chat.openai.com/
// @version      9.8
// @description  点击保存当前型号+价格+网址，一键导出CSV（零依赖、无网络要求）
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553424/%E6%B7%98%E5%AE%9D%E5%9E%8B%E5%8F%B7%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%87%BA%20%28CSV%E9%AB%98%E5%85%BC%E5%AE%B9%E7%89%88v98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553424/%E6%B7%98%E5%AE%9D%E5%9E%8B%E5%8F%B7%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%87%BA%20%28CSV%E9%AB%98%E5%85%BC%E5%AE%B9%E7%89%88v98%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const STORE_KEY = "tb_sku_export_v98";
  const getList = () => GM_getValue(STORE_KEY, []);
  const setList = (l) => GM_setValue(STORE_KEY, l);

  /** 获取淘宝上下文 */
  const getCtx = () => window.__ICE_APP_CONTEXT__?.pageData || window.__ICE_APP_CONTEXT__ || {};

  /** 获取型号 */
  function getSkuText() {
    const actives = document.querySelectorAll('.sku-item.active, .tb-selected, .selected');
    return [...actives].map(x => x.innerText.trim()).join(' ') || '未知型号';
  }

  /** 获取 SKU ID */
  function getSkuId(ctx) {
    const props = [...document.querySelectorAll('[data-value].selected, [data-value].active')]
      .map(x => x.getAttribute('data-value'))
      .filter(Boolean)
      .sort()
      .join(';');
    const list = ctx?.skuBase?.skus || [];
    for (const s of list) {
      const p = (s.propPath || s.prop_path || '').split(';').sort().join(';');
      if (p === props) return s.skuId;
    }
    return null;
  }

  /** 获取价格 */
  function getPrice(ctx, skuId) {
    try {
      const sku2info = ctx?.skuCore?.sku2info || {};
      if (skuId && sku2info[skuId]) {
        const node = sku2info[skuId];
        const p = node?.subPrice?.priceText || node?.price?.priceText;
        if (p) return p.replace(/[^\d.]/g, '');
      }
      const dom1 = document.querySelector('span[class*="highlightPrice--"] span[class*="text--"]');
      if (dom1 && /\d/.test(dom1.textContent)) return dom1.textContent.replace(/[^\d.]/g, '');
      const allSpans = [...document.querySelectorAll('span[class*="text--"]')];
      for (const s of allSpans) {
        const val = s.textContent.trim();
        if (/^\d+(\.\d+)?$/.test(val)) return val;
      }
      const scripts = [...document.querySelectorAll('script')];
      for (const sc of scripts) {
        const txt = sc.textContent;
        const match = txt.match(/"priceText":"(\d+(\.\d+)?)"/);
        if (match) return match[1];
      }
    } catch (err) {
      console.warn("⚠️ 价格解析失败：", err);
    }
    return '';
  }

  /** 保存当前SKU */
  function saveCurrent() {
    const ctx = getCtx();
    const title = document.title.replace(/\s+/g, ' ').trim();
    const skuText = getSkuText();
    const skuId = getSkuId(ctx);
    const price = getPrice(ctx, skuId);
    const url = window.location.href.split('#')[0];
    const list = getList();
    list.push({ title, skuText, price, url, time: new Date().toLocaleString() });
    setList(list);

    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'fixed', bottom: '80px', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.85)', color: '#fff',
      padding: '10px 16px', borderRadius: '10px',
      zIndex: 999999, fontSize: '14px'
    });
    div.innerHTML = `✅ 已保存型号：${skuText}<br>💰 价格：¥${price || '未识别'}<br>🔗 链接：${url}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3500);
  }

  /** 导出 CSV */
  function exportCSV() {
    const list = getList();
    if (!list.length) return alert('⚠️ 暂无保存的数据！');
    const header = ['商品名称', '型号', '价格(元)', '链接', '时间'];
    const rows = [header];
    list.forEach(i => rows.push([i.title, i.skuText, i.price, i.url, i.time]));

    // 转义CSV
    const csvContent = rows.map(r =>
      r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')
    ).join('\r\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `淘宝型号价格_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 3000);
    alert(`📄 已导出 ${list.length} 条记录 (CSV格式)`);
  }

  /** 清空记录 */
  function clearAll() {
    if (confirm('⚠️ 确定要清空所有已保存记录吗？')) {
      GM_setValue(STORE_KEY, []);
      alert('✅ 已清空所有记录');
    }
  }

  /** 添加按钮样式 */
  GM_addStyle(`
    #saveBtn {
      position: fixed; right: 20px; bottom: 20px;
      background: #ff5000; color: #fff;
      border: none; padding: 8px 14px;
      border-radius: 8px; font-size: 14px;
      z-index: 999999; cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
  `);

  /** 注入按钮 */
  function addSaveButton() {
    if (!document.getElementById('saveBtn')) {
      const btn = document.createElement('button');
      btn.id = 'saveBtn';
      btn.textContent = '💾 保存型号';
      btn.onclick = saveCurrent;
      document.body.appendChild(btn);
    }
  }

  // 多次注入
  let injectCount = 0;
  const injectTimer = setInterval(() => {
    addSaveButton();
    injectCount++;
    if (injectCount > 30) clearInterval(injectTimer);
  }, 1500);

  // 监听页面变化
  const obs = new MutationObserver(() => addSaveButton());
  obs.observe(document.body, { childList: true, subtree: true });

  // 注册菜单
  GM_registerMenuCommand("📄 导出CSV", exportCSV);
  GM_registerMenuCommand("🗑️ 清空所有记录", clearAll);
})();
