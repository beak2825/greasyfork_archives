// ==UserScript==
// @name         POS 销售单同步助手 + 现金账本 (V6.6.2 修复空括号版)
// @namespace    playbox-electronics
// @version      6.6.2
// @description  F11：POS 转销售单。修复：彻底过滤 "[]" 空备注，确保订单行描述和消息墙整洁。
// @match        *://*.odoo.com/pos/*
// @match        *://*.odoo.sh/pos/*
// @match        *://*/pos/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557572/POS%20%E9%94%80%E5%94%AE%E5%8D%95%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B%20%2B%20%E7%8E%B0%E9%87%91%E8%B4%A6%E6%9C%AC%20%28V662%20%E4%BF%AE%E5%A4%8D%E7%A9%BA%E6%8B%AC%E5%8F%B7%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557572/POS%20%E9%94%80%E5%94%AE%E5%8D%95%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B%20%2B%20%E7%8E%B0%E9%87%91%E8%B4%A6%E6%9C%AC%20%28V662%20%E4%BF%AE%E5%A4%8D%E7%A9%BA%E6%8B%AC%E5%8F%B7%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =========================
  // 全局状态控制
  // =========================
  let isSyncing = false;
  let lastPricelistName = null;

  // =========================
  // UI 核心代码
  // =========================
  let pbModalRoot = null;
  let pbModalResolve = null;
  let pbLoadingRoot = null;
  let pbLoadingCount = 0;

  function ensureModalDom() {
    if (pbModalRoot) return pbModalRoot;

    if (!document.getElementById("pb-pos-style")) {
      const style = document.createElement("style");
      style.id = "pb-pos-style";
      style.textContent = `
      :root {
        --pb-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --pb-glass-bg: rgba(255, 255, 255, 0.08);
        --pb-glass-border: rgba(255, 255, 255, 0.15);
        --pb-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        --pb-text-main: #ffffff;
        --pb-text-header: rgba(255, 255, 255, 0.8);
        --pb-primary-grad: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
        --pb-success-text: #4ade80;
        --pb-danger-text: #f87171;
      }
      .control-buttons { display: flex; flex-wrap: wrap; }
      .control-buttons > .more-btn { order: 99 !important; }
      #pb-cash-btn, #pb-pricelist-label { order: 2 !important; }

      #pb-pricelist-label {
          flex-shrink: 0 !important;
          min-width: fit-content !important;
          margin-left: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.05);
          color: #4b5563;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: fit-content;
          align-self: center;
          white-space: nowrap;
          cursor: default;
      }
      #pb-pricelist-label:empty { display: none !important; }
      #pb-pricelist-icon { font-size: 13px; color: #6b7280; }

      .pb-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: var(--pb-font); opacity: 0; visibility: hidden; transition: all 0.3s ease; }
      .pb-modal-overlay.pb-visible { opacity: 1; visibility: visible; }
      .pb-modal-box { background: var(--pb-glass-bg); backdrop-filter: blur(30px) saturate(120%); -webkit-backdrop-filter: blur(30px) saturate(120%); border: 1px solid var(--pb-glass-border); box-shadow: var(--pb-shadow); border-radius: 24px; width: 520px; max-width: 95vw; display: flex; flex-direction: column; transform: scale(0.9); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; max-height: 85vh; color: white; }
      .pb-modal-overlay.pb-visible .pb-modal-box { transform: scale(1); }
      .pb-modal-header { padding: 24px 32px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: none; }
      .pb-modal-title { font-size: 20px; font-weight: 600; color: white; letter-spacing: 0.5px; }
      .pb-modal-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; font-size: 26px; line-height: 1; color: rgba(255,255,255,0.5); cursor: pointer; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s; }
      .pb-modal-close:hover { color: white; transform: rotate(90deg); }
      .pb-modal-body { padding: 0 0 24px 0; font-size: 16px; font-weight: 500; line-height: 1.6; color: rgba(255, 255, 255, 0.95); overflow-y: auto; }
      .pb-message-content { padding: 24px 32px; color: white; font-size: 16px; font-weight: 500; white-space: pre-wrap; }
      .pb-modal-footer { padding: 0 32px 24px; display: flex; justify-content: flex-end; gap: 12px; }
      .pb-modal-btn { padding: 9px 24px; font-size: 14px; font-weight: 600; border-radius: 12px; cursor: pointer; border: none; transition: all 0.2s ease; backdrop-filter: blur(4px); letter-spacing: 0.5px; }
      .pb-modal-btn:active { transform: scale(0.96); }
      .pb-modal-btn-primary { background: rgba(255, 255, 255, 0.35); color: white; border: 1px solid rgba(255, 255, 255, 0.5); font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      .pb-modal-btn-primary:hover { background: rgba(255, 255, 255, 0.5); border-color: rgba(255, 255, 255, 0.7); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
      .pb-modal-btn-secondary { background: transparent; color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.25); font-weight: 600; }
      .pb-modal-btn-secondary:hover { background: rgba(255,255,255,0.2); color: white; }
      .pb-loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000000; opacity: 0; transition: opacity 0.2s; visibility: hidden; }
      .pb-loading-overlay.pb-visible { opacity: 1; visibility: visible; }
      .pb-loading-box { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 24px 40px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: white; font-weight: 500; backdrop-filter: blur(20px); }
      .pb-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); border-top-color: white; animation: pb-spin 0.8s infinite linear; }
      @keyframes pb-spin { to{transform: rotate(1turn)} }

      .pb-table-container { margin: 0; }
      .pb-table { width: 100%; border-collapse: collapse; font-size: 13px; font-weight: 400; text-align: left; }
      .pb-table th { padding: 12px 32px; color: var(--pb-text-header); font-weight: 600; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); position: sticky; top: 0; z-index: 10; background: transparent; }
      .pb-table td { padding: 10px 32px; border-bottom: none; color: white; vertical-align: middle; }
      .pb-table tr:hover td { background: rgba(255, 255, 255, 0.05); }
      .pb-col-date { white-space: nowrap; color: rgba(255, 255, 255, 0.8); font-family: "SF Mono", monospace; }
      .pb-amount-in { color: var(--pb-success-text) !important; font-weight: 600; font-family: "SF Mono", monospace; text-align: right; text-shadow: 0 0 15px rgba(74, 222, 128, 0.2); }
      .pb-amount-out { color: var(--pb-danger-text) !important; font-weight: 600; font-family: "SF Mono", monospace; text-align: right; text-shadow: 0 0 15px rgba(248, 113, 113, 0.2); }
      .pb-empty-state { text-align: center; padding: 40px; color: rgba(255,255,255,0.5); font-style: italic; }

      #pb-cash-btn i { margin-right: 4px; }
      #pb-cash-btn.pb-floating { position: fixed; top: 8px; right: 300px; z-index: 9999; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.6); color: #334155; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; opacity: 0.8; }
      #pb-cash-btn.pb-integrated i { margin-right: 4px; }
      `;
      document.head.appendChild(style);
    }

    pbModalRoot = document.createElement("div");
    pbModalRoot.className = "pb-modal-overlay";
    pbModalRoot.innerHTML = `
      <div class="pb-modal-box">
        <div class="pb-modal-header">
          <div class="pb-modal-title"></div>
          <div class="pb-modal-close" title="关闭">&times;</div>
        </div>
        <div class="pb-modal-body"></div>
        <div class="pb-modal-footer"></div>
      </div>
    `;
    document.body.appendChild(pbModalRoot);

    const closeBtn = pbModalRoot.querySelector(".pb-modal-close");
    const overlay = pbModalRoot;
    closeBtn.onclick = () => closeModal(null);
    overlay.onclick = (e) => { if(e.target === overlay) closeModal(null); };

    return pbModalRoot;
  }

  function ensureLoadingDom() {
    if (pbLoadingRoot) return pbLoadingRoot;
    pbLoadingRoot = document.createElement("div");
    pbLoadingRoot.className = "pb-loading-overlay";
    pbLoadingRoot.innerHTML = `<div class="pb-loading-box"><div class="pb-spinner"></div><div>PROCESSING</div></div>`;
    document.body.appendChild(pbLoadingRoot);
    return pbLoadingRoot;
  }

  function showLoading() {
    const root = ensureLoadingDom();
    pbLoadingCount++;
    root.classList.add("pb-visible");
  }

  function hideLoading() {
    if (!pbLoadingRoot) return;
    pbLoadingCount = Math.max(0, pbLoadingCount - 1);
    if (pbLoadingCount === 0) {
      pbLoadingRoot.classList.remove("pb-visible");
    }
  }

  function closeModal(result) {
    if (!pbModalRoot) return;
    pbModalRoot.classList.remove("pb-visible");
    setTimeout(() => {
        if (pbModalResolve) {
          const r = pbModalResolve;
          pbModalResolve = null;
          r(result);
        }
    }, 300);
  }

  function showModal(options) {
    if (pbLoadingRoot) {
        pbLoadingCount = 0;
        pbLoadingRoot.classList.remove("pb-visible");
    }
    const root = ensureModalDom();
    root.querySelector(".pb-modal-title").textContent = options.title || "提示";
    const bodyEl = root.querySelector(".pb-modal-body");
    bodyEl.innerHTML = '';

    if (options.html) {
        const container = document.createElement('div');
        container.className = 'pb-table-container';
        container.innerHTML = options.html;
        bodyEl.appendChild(container);
    } else {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'pb-message-content';
        msgDiv.innerText = options.message || "";
        bodyEl.appendChild(msgDiv);
    }

    const box = root.querySelector('.pb-modal-box');
    if (options.width) box.style.width = options.width;
    else box.style.width = '520px';

    const footerEl = root.querySelector(".pb-modal-footer");
    footerEl.innerHTML = "";
    const buttons = options.buttons || [{ label: "确定", value: true, primary: true }];

    if (buttons.length === 1 && buttons[0].primary === undefined && buttons[0].danger === undefined) {
        buttons[0].primary = true;
    }

    buttons.forEach((btn) => {
      const b = document.createElement("button");
      b.type = "button";
      let btnClass = "pb-modal-btn";
      if (btn.danger) btnClass += " pb-modal-btn-danger";
      else if (btn.primary) btnClass += " pb-modal-btn-primary";
      else btnClass += " pb-modal-btn-secondary";
      b.className = btnClass;
      b.textContent = btn.label;
      b.onclick = () => closeModal(btn.value);
      footerEl.appendChild(b);
    });
    requestAnimationFrame(() => root.classList.add("pb-visible"));
    return new Promise((resolve) => { pbModalResolve = resolve; });
  }

  function showAlert(message, title) { return showModal({ title: title || "系统提示", message, buttons: [{ label: "知道了", value: true, primary: true }] }); }
  function showConfirm(message, { title, confirmText, cancelText } = {}) { return showModal({ title: title || "请确认", message, buttons: [ { label: cancelText || "取消", value: false }, { label: confirmText || "确定", value: true, primary: true }, ], }); }
  function showChoice(message, choices, title) { return showModal({ title: title || "请选择操作", message, buttons: choices }); }

  async function callOdoo(model, method, args = [], kwargs = {}) {
    let csrf = typeof odoo !== 'undefined' && odoo.csrf_token ? odoo.csrf_token : "";
    if (!csrf) {
        const meta = document.querySelector('meta[name="csrf_token"]');
        if (meta) csrf = meta.getAttribute("content");
    }
    const payload = { jsonrpc: "2.0", method: "call", params: { model, method, args, kwargs }, id: Date.now() };
    const resp = await fetch(`/web/dataset/call_kw/${model}/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
      body: JSON.stringify(payload), credentials: "same-origin",
    });
    const json = await resp.json();
    if (json.error) throw new Error(json.error.data?.message || JSON.stringify(json.error));
    return json.result;
  }

  async function withLoading(fn) {
    showLoading();
    try { return await fn(); } finally { hideLoading(); }
  }

  function isPosUiProductPage() {
      return /^\/pos\/ui/.test(window.location.pathname);
  }

  function isPaymentPage() {
      if (window.location.href.includes('/payment')) return true;
      if (document.querySelector('.payment-screen') && !document.querySelector('.payment-screen.oe_hidden')) return true;
      return false;
  }

  function getCurrentPricelistName() {
      try {
          const pos = window.posmodel;
          if (!pos) return "";
          let order = null;
          if (typeof pos.get_order === "function") order = pos.get_order();
          if (!order && pos.selectedOrder) order = pos.selectedOrder;
          if (!order) return "";
          const pl = order.pricelist_id;
          if (!pl) return "";
          return (pl.name || pl.display_name || "").toString().trim();
      } catch (e) { return ""; }
  }

  function updatePricelistLabel() {
      const container = document.querySelector(".control-buttons");
      if (!container) return;
      let tag = document.getElementById("pb-pricelist-label");
      let forceUpdate = false;
      if (!tag) {
          tag = document.createElement("span");
          tag.id = "pb-pricelist-label";
          const cashBtn = document.getElementById("pb-cash-btn");
          if (cashBtn) cashBtn.insertAdjacentElement("afterend", tag);
          else container.appendChild(tag);
          forceUpdate = true;
      } else if (tag.parentNode !== container) {
          container.appendChild(tag);
          forceUpdate = true;
      }
      const name = getCurrentPricelistName();
      if (!forceUpdate && name === lastPricelistName) {
          if (!name && tag.style.display !== "none") tag.style.display = "none";
          if (name && tag.style.display === "none") tag.style.display = "inline-flex";
          return;
      }
      lastPricelistName = name;
      if (name) {
          tag.innerHTML = `<i class="fa fa-tag" id="pb-pricelist-icon"></i> <span>${name}</span>`;
          tag.style.display = "inline-flex";
      } else {
          tag.innerHTML = "";
          tag.style.display = "none";
      }
  }

  // [核心修改] 增强清洗函数，专门处理空数组 []
  function cleanNoteText(rawNote) {
      let clean = rawNote;
      try {
          if (clean && typeof clean === 'string' && (clean.startsWith('[') || clean.startsWith('{'))) {
               const parsed = JSON.parse(clean);
               // 处理数组: [{"text":...}] 或 []
               if (Array.isArray(parsed)) {
                   if (parsed.length > 0 && parsed[0].text) {
                       clean = parsed[0].text;
                   } else {
                       clean = ""; // 空数组或无 text 属性 -> 视为空
                   }
               }
               // 处理对象: {"text":...}
               else if (typeof parsed === 'object') {
                   if (parsed.text) {
                       clean = parsed.text;
                   } else {
                       clean = ""; // 无 text 属性 -> 视为空
                   }
               }
          }
      } catch (e) {
          // 解析失败，保持原样（可能是普通字符串）
      }

      // 最终清洗：转字符串 -> 去除两端空格 -> 再次检查是否为残留的 "[]"
      if (typeof clean !== 'string') return "";
      clean = clean.trim();
      if (clean === "[]") return ""; // 强制过滤残留的空数组字符串

      return clean;
  }

  function getOrderGlobalNote(order) {
      let rawNote = "";
      try {
          if (typeof order.get_note === "function") rawNote = order.get_note();
          if (!rawNote && order.note) rawNote = order.note;
          if (!rawNote && typeof order.export_as_JSON === "function") {
              const json = order.export_as_JSON();
              if (json && json.note) rawNote = json.note;
          }
      } catch (e) {}
      return cleanNoteText(rawNote);
  }

  async function syncLogic() {
    if (typeof window.posmodel === 'undefined') return showAlert("未检测到 posmodel 对象。\n页面可能未加载完成。", "错误");
    if (!posmodel.selectedOrder) return showAlert("未找到 POS 订单。", "未就绪");

    const o = posmodel.selectedOrder;
    const originValue = o.uuid ? `POS-UUID:${o.uuid}` : (o.name || "POS");

    const globalNote = getOrderGlobalNote(o);
    let internalNoteRaw = "";
    if (o.internal_note) internalNoteRaw = o.internal_note;
    const cleanInternalNote = cleanNoteText(internalNoteRaw);

    let notesToPost = [];
    if (globalNote) notesToPost.push(globalNote);
    if (cleanInternalNote) notesToPost.push(`[内部备注]: ${cleanInternalNote}`);

    const orderLines = o.lines.map(l => {
        if (!l.product_id?.id) return null;
        const lineVals = { product_id: l.product_id.id, product_uom_qty: l.qty, price_unit: l.price_unit };

        let rawLineNote = l.note || "";
        if (!rawLineNote && typeof l.export_as_JSON === "function") {
            const lJson = l.export_as_JSON();
            if (lJson && lJson.note) rawLineNote = lJson.note;
        }

        // [调用增强后的清洗函数]
        const cleanLineNote = cleanNoteText(rawLineNote);

        // [严格判断] 只有当 cleanLineNote 有真实内容时，才进行处理
        if (cleanLineNote) {
             let prodName = l.product_id.display_name || l.product_id.name;
             if (typeof l.export_as_JSON === "function") {
                 const json = l.export_as_JSON();
                 if (json && json.full_product_name) prodName = json.full_product_name;
             }

             // 1. 消息墙：保留产品名 + 备注
             const formattedForChatter = `${prodName}: ${cleanLineNote}`;
             notesToPost.push(formattedForChatter);

             // 2. 订单行：纯备注 (无产品名)
             lineVals.name = cleanLineNote;
        }
        // 如果 else (备注为空)，则 lineVals.name 不被赋值，Odoo 会自动使用默认产品描述

        return [0, 0, lineVals];
    }).filter(Boolean);

    if (!orderLines.length) return showAlert("当前订单为空。", "提示");

    const baseVals = { partner_id: o.partner_id?.id || 53, origin: originValue };
    if (o.pricelist_id?.id) baseVals.pricelist_id = o.pricelist_id.id;

    const existed = await withLoading(() => callOdoo("sale.order", "search_read", [[["origin", "=", originValue]], ["name", "id", "state"]], { limit: 1 }));

    let finalSoId;
    if (existed && existed.length > 0) {
      const so = existed[0];
      const state = so.state || "draft";
      if (state === "cancel") {
        const createNew = await showConfirm(`销售单 ${so.name} 已被取消。\n是否创建新单？`, { title: "订单已取消", confirmText: "创建新单", cancelText: "查看旧单" });
        if (createNew === null) return;
        if (createNew === false) { window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank"); return; }
        finalSoId = await withLoading(() => callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]));
      } else if (!["draft", "sent"].includes(state)) {
        const openIt = await showConfirm(`销售单 ${so.name} 状态为已确认。\n是否打开？`, { title: "无法修改", confirmText: "打开订单", cancelText: "关闭" });
        if (openIt) window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank");
        return;
      } else {
        const action = await showChoice(`发现关联销售单：${so.name} (草稿)\n请选择操作：`, [ { label: "仅查看", value: "3", secondary: true }, { label: "新建销售单", value: "2", secondary: true }, { label: "覆盖当前单", value: "1", danger: true }, ], "重复订单");
        if (!action) return;
        if (action === "3") { window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank"); return; }
        finalSoId = await withLoading(async () => {
            if (action === "2") return await callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]);
            else if (action === "1") { await callOdoo("sale.order", "write", [[so.id], { ...baseVals, order_line: [[5, 0, 0], ...orderLines] }]); return so.id; }
        });
      }
    } else {
      const ok = await showConfirm("未找到关联销售单。\n是否立即创建？", { title: "新建销售单", confirmText: "立即创建", cancelText: "取消" });
      if (!ok) return;
      finalSoId = await withLoading(() => callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]));
    }

    if (!finalSoId) return;

    if (notesToPost.length > 0) {
        await withLoading(async () => {
            for (const msg of notesToPost) {
                 try {
                     try {
                         await callOdoo("sale.order", "message_post", [finalSoId], { body: msg, message_type: "comment", subtype_xmlid: "mail.mt_note" });
                     } catch (e1) {
                         await callOdoo("sale.order", "message_post", [finalSoId], { body: msg, message_type: "comment" });
                     }
                 } catch (e) {}
            }
        });
    }

    await withLoading(async () => {
        const soInfo = await callOdoo("sale.order", "read", [[finalSoId], ["name"]]);
        const soName = soInfo[0].name;

        try {
            if (posmodel && posmodel.selectedOrder) {
                if (typeof posmodel.selectedOrder.set_client_order_ref === "function") {
                    posmodel.selectedOrder.set_client_order_ref(soName);
                } else if (typeof posmodel.selectedOrder.set_name === "function") {
                    // 可选
                }
                posmodel.selectedOrder.name = soName;
                console.log(`[POS Sync] 已将当前 POS 单绑定至: ${soName}`);
            }
        } catch(e) { console.error("反向绑定失败", e); }

        const msg = `同步成功！\n单号：${soName}\n(当前 POS 单已标记引用此单号)`;
        const shouldOpen = await showModal({ title: "完成", message: msg, buttons: [{ label: "查看订单", value: true, primary: true }] });
        if (shouldOpen) window.open(`/web#id=${finalSoId}&model=sale.order&view_type=form`, "_blank");
    });
  }

  async function getActiveSessionId() {
    if (typeof window.posmodel !== 'undefined') {
        if (window.posmodel.session && window.posmodel.session.id) return window.posmodel.session.id;
        if (window.posmodel.pos_session && window.posmodel.pos_session.id) return window.posmodel.pos_session.id;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const configId = parseInt(urlParams.get('config_id'));
    if (configId) {
        const s = await callOdoo('pos.session', 'search_read', [[['config_id', '=', configId], ['state', 'in', ['opened', 'opening_control', 'closing_control']]]], {fields: ['id'], order: 'id desc', limit: 1});
        if (s.length) return s[0].id;
    }
    let uid = null;
    if (typeof odoo !== 'undefined' && odoo.session_info) uid = odoo.session_info.uid;
    if (uid) {
        const s = await callOdoo('pos.session', 'search_read', [[['user_id', '=', uid], ['state', 'in', ['opened', 'opening_control', 'closing_control']]]], {fields: ['id'], order: 'id desc', limit: 1});
        if (s.length) return s[0].id;
    }
    const any = await callOdoo('pos.session', 'search_read', [[['state', 'in', ['opened', 'opening_control']]]], {fields: ['id'], order: 'id desc', limit: 1});
    if (any.length) return any[0].id;
    throw new Error("无法定位开启的 POS 会话。");
  }

  async function openCashLog() {
    try {
        await withLoading(async () => {
            const sessionId = await getActiveSessionId();
            const lines = await callOdoo('account.bank.statement.line', 'search_read', [[['pos_session_id', '=', sessionId]]], { fields: ['date', 'payment_ref', 'amount'], order: 'id desc' });

            let html = '';
            if (!lines.length) {
                html = '<div class="pb-empty-state">当前会话暂无现金记录</div>';
            } else {
                html = `<table class="pb-table">
                  <thead><tr><th style="width:110px">日期</th><th>原因 / 备注</th><th style="width:120px;text-align:right">金额</th></tr></thead>
                  <tbody>`;
                lines.forEach(l => {
                    const amount = parseFloat(l.amount);
                    const isPositive = amount >= 0;
                    const amountClass = isPositive ? 'pb-amount-in' : 'pb-amount-out';
                    const sign = isPositive ? '+' : '';
                    let labelText = l.payment_ref || '无备注';
                    labelText = labelText.replace(/PLAYBOX ELECTRONICS\s+[\w]+\/\d+-/gi, '');
                    labelText = labelText.replace(/在-/g, '收入: ').replace(/out-/g, '支出: ');
                    const dateStr = l.date.split(" ")[0];
                    html += `<tr>
                        <td class="pb-col-date">${dateStr}</td>
                        <td><div style="font-weight:500; word-break: break-word;">${labelText}</div></td>
                        <td class="${amountClass}" style="text-align:right">${sign}${amount.toFixed(2)}</td>
                    </tr>`;
                });
                html += '</tbody></table>';
            }
            await showModal({ title: "现金进出明细", html: html, width: '520px', buttons: [{ label: "关闭", value: true, primary: true }] });
        });
    } catch (e) {
        let msg = e.message;
        if (/Access Error|Access Denied/i.test(msg)) msg = "权限不足 (Access Error)\n\n账号无法读取 account.bank.statement.line。\n请联系管理员给 'POS/User' 组添加读取权限。";
        showAlert(msg, "查询失败");
    }
  }

  function addIntegratedButton() {
    if (document.getElementById("pb-cash-btn")) return;
    const container = document.querySelector('.control-buttons');
    if (!container) return;
    const btn = document.createElement("button");
    btn.id = "pb-cash-btn";
    btn.className = "btn btn-secondary btn-lg lh-lg flex-shrink-0";
    btn.style.fontWeight = "600";
    btn.innerHTML = `<span>现金进出</span>`;
    btn.onclick = openCashLog;
    const moreBtn = container.querySelector('.more-btn');
    if (moreBtn) container.insertBefore(btn, moreBtn);
    else container.appendChild(btn);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "F11") {
       e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
       if (isPaymentPage()) return;
       if (!isPosUiProductPage()) return;
       if (isSyncing) return;
       isSyncing = true;
       syncLogic().catch(err => { hideLoading(); showAlert(err.message, "系统错误"); }).finally(() => { isSyncing = false; hideLoading(); });
    }
    if (e.key === "Escape") {
       if (pbModalRoot && pbModalRoot.classList.contains("pb-visible")) { e.preventDefault(); closeModal(null); }
    }
  });

  setInterval(() => {
    if (!document.getElementById("pb-pos-style")) ensureModalDom();
    addIntegratedButton();
    updatePricelistLabel();

    const modals = document.querySelectorAll(".modal-content:not([data-pb-spec-done='1'])");
    modals.forEach(modal => {
        const hasTitle = modal.querySelector("header.modal-header h3.section-title") || modal.querySelector("header.modal-header .modal-title");
        if (hasTitle) injectSpec(modal);
    });

  }, 500);

  function getProductKeyFromModal(modal) {
    const titleEl = modal.querySelector("header.modal-header h3.section-title") || modal.querySelector("header.modal-header .modal-title");
    if (!titleEl) return null;
    const full = titleEl.textContent.replace(/\s+/g, " ").trim();
    if (!full) return null;
    const m = full.match(/\[([^\]]+)]/);
    if (m && m[1]) return { type: "code", value: m[1].trim() };
    const firstPart = full.split("|")[0];
    const name = firstPart ? firstPart.trim() : null;
    if (name) return { type: "name", value: name };
    return null;
  }

  const uomCache = {};

  async function getUomNamesByKey(keyInfo) {
    if (!keyInfo) return [];
    const cacheKey = keyInfo.type + ":" + keyInfo.value;
    if (uomCache[cacheKey]) return uomCache[cacheKey];
    let domain;
    if (keyInfo.type === "code") domain = [["default_code", "=", keyInfo.value]];
    else domain = ["|", "|", ["default_code", "=", keyInfo.value], ["name", "=", keyInfo.value], ["display_name", "=", keyInfo.value]];

    const products = await callOdoo("product.product", "search_read", [domain, ["id", "uom_ids"]], { limit: 1 });
    if (!products || !products.length) { uomCache[cacheKey] = []; return []; }
    const uids = products[0].uom_ids || [];
    if (!uids.length) { uomCache[cacheKey] = []; return []; }
    const uoms = await callOdoo("uom.uom", "read", [uids, ["name"]]);
    const names = (uoms || []).map((u) => u.name).filter(Boolean);
    uomCache[cacheKey] = names;
    return names;
  }

  async function injectSpec(modal) {
    if (!modal) return;
    if (modal.dataset.pbSpecDone === "1") return;
    modal.dataset.pbSpecDone = "1";
    const keyInfo = getProductKeyFromModal(modal);
    if (!keyInfo) return;
    let names;
    try { names = await getUomNamesByKey(keyInfo); } catch (e) { return; }
    if (!names || !names.length) return;
    const labelText = "规格";
    const joined = names.join(" / ");
    const titleEl = modal.querySelector("header.modal-header h3.section-title") || modal.querySelector("header.modal-header .modal-title");
    if (titleEl) {
      const originalText = titleEl.getAttribute("data-pb-original-title") || titleEl.textContent.replace(/\s+/g, " ").trim();
      if (!titleEl.getAttribute("data-pb-original-title")) titleEl.setAttribute("data-pb-original-title", originalText);
      titleEl.textContent = `${originalText} | ${labelText}: ${joined}`;
    }
  }

  const specObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(".modal-content")) {
          const hasTitle = node.querySelector("header.modal-header h3.section-title") || node.querySelector("header.modal-header .modal-title");
          if (hasTitle) injectSpec(node);
        }
        if (node.querySelector) {
          const modals = node.querySelectorAll(".modal-content");
          modals.forEach((modal) => {
            const hasTitle = modal.querySelector("header.modal-header h3.section-title") || modal.querySelector("header.modal-header .modal-title");
            if (hasTitle) injectSpec(modal);
          });
        }
      }
    }
  });

  try {
      if(document.body) specObserver.observe(document.body, { childList: true, subtree: true });
      else window.addEventListener("DOMContentLoaded", () => { specObserver.observe(document.body, { childList: true, subtree: true }); });
      console.log("📦 商品规格标题栏展示已启用（双重保障模式）");
  } catch (e) { console.warn("规格监听启动失败:", e); }

})();