// ==UserScript==
// @name         POS订单同步 (Español MX) - Dark UI v3.2.2
// @namespace    playbox-electronics
// @version      3.2.3-mx
// @description  F11: Sync POS a Pedido. Fix: Filtro estricto de notas vacías "[]". Estilo Dark Glass.
// @match        *://*.odoo.com/pos/*
// @match        *://*.odoo.sh/pos/*
// @match        *://*/pos/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557583/POS%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5%20%28Espa%C3%B1ol%20MX%29%20-%20Dark%20UI%20v322.user.js
// @updateURL https://update.greasyfork.org/scripts/557583/POS%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5%20%28Espa%C3%B1ol%20MX%29%20-%20Dark%20UI%20v322.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =========================
  // Estado Global
  // =========================
  let isSyncing = false;
  let lastPricelistName = null;

  // =========================
  // UI & CSS (Dark Glass Style)
  // =========================
  let pbModalRoot = null;
  let pbModalResolve = null;
  let pbLoadingRoot = null;
  let pbLoadingCount = 0;

  function ensureModalDom() {
    if (pbModalRoot) return pbModalRoot;

    // Limpieza de estilos viejos
    const oldStyle = document.getElementById("pb-pos-style-mx");
    if (oldStyle) oldStyle.remove();

    if (!document.getElementById("pb-pos-style-dark")) {
      const style = document.createElement("style");
      style.id = "pb-pos-style-dark";
      style.textContent = `
      :root {
        --pb-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --pb-glass-bg: rgba(255, 255, 255, 0.08);
        --pb-glass-border: rgba(255, 255, 255, 0.15);
        --pb-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        --pb-text-main: #ffffff;
        --pb-text-header: rgba(255, 255, 255, 0.8);
        --pb-primary-grad: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
      }
      .control-buttons { display: flex; flex-wrap: wrap; }
      .control-buttons > .more-btn { order: 99 !important; }
      #pb-pricelist-label { order: 2 !important; }

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

      .pb-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 999999; font-family: var(--pb-font);
          opacity: 0; visibility: hidden; transition: all 0.3s ease;
      }
      .pb-modal-overlay.pb-visible { opacity: 1; visibility: visible; }
      .pb-modal-box {
          background: var(--pb-glass-bg);
          backdrop-filter: blur(30px) saturate(120%);
          -webkit-backdrop-filter: blur(30px) saturate(120%);
          border: 1px solid var(--pb-glass-border);
          box-shadow: var(--pb-shadow);
          border-radius: 24px;
          width: 520px;
          max-width: 95vw;
          display: flex; flex-direction: column;
          transform: scale(0.9);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          max-height: 85vh;
          color: white;
      }
      .pb-modal-overlay.pb-visible .pb-modal-box { transform: scale(1); }
      .pb-modal-header {
          padding: 24px 32px 10px;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: none;
      }
      .pb-modal-title { font-size: 20px; font-weight: 600; color: white; letter-spacing: 0.5px; }
      .pb-modal-close {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; line-height: 1; color: rgba(255,255,255,0.5);
          cursor: pointer; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s;
      }
      .pb-modal-close:hover { color: white; transform: rotate(90deg); }
      .pb-modal-body {
          padding: 0 0 24px 0; font-size: 16px; font-weight: 500; line-height: 1.6;
          color: rgba(255, 255, 255, 0.95); overflow-y: auto;
      }
      .pb-message-content { padding: 24px 32px; color: white; font-size: 16px; font-weight: 500; white-space: pre-wrap; }
      .pb-modal-footer { padding: 0 32px 24px; display: flex; justify-content: flex-end; gap: 12px; }
      .pb-modal-btn {
          padding: 9px 24px; font-size: 14px; font-weight: 600; border-radius: 12px;
          cursor: pointer; border: none; transition: all 0.2s ease; backdrop-filter: blur(4px); letter-spacing: 0.5px;
      }
      .pb-modal-btn:active { transform: scale(0.96); }
      .pb-modal-btn-primary {
          background: rgba(255, 255, 255, 0.35); color: white; border: 1px solid rgba(255, 255, 255, 0.5);
          font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .pb-modal-btn-primary:hover {
          background: rgba(255, 255, 255, 0.5); border-color: rgba(255, 255, 255, 0.7);
          transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }
      .pb-modal-btn-secondary {
          background: transparent; color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.25); font-weight: 600;
      }
      .pb-modal-btn-secondary:hover { background: rgba(255,255,255,0.2); color: white; }
      .pb-modal-btn-danger { background: rgba(220, 38, 38, 0.25); color: #fecaca; border: 1px solid rgba(220, 38, 38, 0.4); }
      .pb-modal-btn-danger:hover { background: rgba(220, 38, 38, 0.4); color: white; }

      .pb-loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000000; opacity: 0; transition: opacity 0.2s; visibility: hidden; }
      .pb-loading-overlay.pb-visible { opacity: 1; visibility: visible; }
      .pb-loading-box { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 24px 40px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: white; font-weight: 500; backdrop-filter: blur(20px); }
      .pb-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); border-top-color: white; animation: pb-spin 0.8s infinite linear; }
      @keyframes pb-spin { to{transform: rotate(1turn)} }
      `;
      document.head.appendChild(style);
    }

    pbModalRoot = document.createElement("div");
    pbModalRoot.className = "pb-modal-overlay";
    pbModalRoot.innerHTML = `
      <div class="pb-modal-box">
        <div class="pb-modal-header">
          <div class="pb-modal-title"></div>
          <div class="pb-modal-close" title="Cerrar">&times;</div>
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
    pbLoadingRoot.innerHTML = `<div class="pb-loading-box"><div class="pb-spinner"></div><div>PROCESANDO</div></div>`;
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
    root.querySelector(".pb-modal-title").textContent = options.title || "Aviso";
    const bodyEl = root.querySelector(".pb-modal-body");
    bodyEl.innerHTML = '';
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'pb-message-content';
    if (options.html) msgDiv.innerHTML = options.html;
    else msgDiv.innerText = options.message || "";
    bodyEl.appendChild(msgDiv);

    const footerEl = root.querySelector(".pb-modal-footer");
    footerEl.innerHTML = "";
    const buttons = options.buttons || [{ label: "Aceptar", value: true, primary: true }];

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

  function showAlert(message, title) { return showModal({ title: title || "Sistema", message, buttons: [{ label: "Entendido", value: true, primary: true }] }); }
  function showConfirm(message, { title, confirmText, cancelText } = {}) { return showModal({ title: title || "Confirmación", message, buttons: [ { label: cancelText || "Cancelar", value: false }, { label: confirmText || "Confirmar", value: true, primary: true }, ], }); }
  function showChoice(message, choices, title) { return showModal({ title: title || "Seleccione Acción", message, buttons: choices }); }

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

  // =========================
  // Helpers
  // =========================
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
          container.appendChild(tag);
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

  // [MEJORA] Limpieza profunda de notas vacías y "[]"
  function cleanNoteText(rawNote) {
      let clean = rawNote;
      try {
          if (clean && typeof clean === 'string' && (clean.startsWith('[') || clean.startsWith('{'))) {
               const parsed = JSON.parse(clean);
               // Array: [{"text":...}] o []
               if (Array.isArray(parsed)) {
                   if (parsed.length > 0 && parsed[0].text) {
                       clean = parsed[0].text;
                   } else {
                       clean = ""; // Array vacío o sin texto
                   }
               }
               // Objeto: {"text":...}
               else if (typeof parsed === 'object') {
                   if (parsed.text) {
                       clean = parsed.text;
                   } else {
                       clean = ""; // Objeto sin texto
                   }
               }
          }
      } catch (e) {}

      // Limpieza final: String -> Trim -> Check "[]"
      if (typeof clean !== 'string') return "";
      clean = clean.trim();
      if (clean === "[]") return ""; // Filtro estricto para residuos

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

  function isPosUiProductPage() {
      if (document.querySelector('.product-screen')) return true;
      return /^\/pos\/ui/.test(window.location.pathname);
  }

  // =========================
  // Lógica Principal de Sincronización
  // =========================
  async function syncLogic() {
    if (typeof window.posmodel === 'undefined') return showAlert("Objeto 'posmodel' no detectado.", "Error");
    if (!posmodel.selectedOrder) return showAlert("No se encontró el pedido POS.", "No Listo");

    const o = posmodel.selectedOrder;
    const originValue = o.uuid ? `POS-UUID:${o.uuid}` : (o.name || "POS");

    // 1. Recolección de Notas
    const globalNote = getOrderGlobalNote(o);
    let internalNoteRaw = "";
    if (o.internal_note) internalNoteRaw = o.internal_note;
    const cleanInternalNote = cleanNoteText(internalNoteRaw);

    let notesToPost = [];
    if (globalNote) notesToPost.push(globalNote);
    if (cleanInternalNote) notesToPost.push(`[Nota Interna]: ${cleanInternalNote}`);

    // 2. Recolección de Líneas
    const orderLines = o.lines.map(l => {
        if (!l.product_id?.id) return null;
        const lineVals = { product_id: l.product_id.id, product_uom_qty: l.qty, price_unit: l.price_unit };

        let rawLineNote = l.note || "";
        if (!rawLineNote && typeof l.export_as_JSON === "function") {
            const lJson = l.export_as_JSON();
            if (lJson && lJson.note) rawLineNote = lJson.note;
        }
        const cleanLineNote = cleanNoteText(rawLineNote);

        if (cleanLineNote) {
             let prodName = l.product_id.display_name || l.product_id.name;
             if (typeof l.export_as_JSON === "function") {
                 const json = l.export_as_JSON();
                 if (json && json.full_product_name) prodName = json.full_product_name;
             }
             
             // Chatter: Mantiene el nombre del producto
             const formattedForChatter = `${prodName}: ${cleanLineNote}`;
             notesToPost.push(formattedForChatter);

             // Linea de Orden: SOLO la nota
             lineVals.name = cleanLineNote;
        }
        return [0, 0, lineVals];
    }).filter(Boolean);

    if (!orderLines.length) return showAlert("El pedido está vacío.", "Aviso");

    const baseVals = { partner_id: o.partner_id?.id || 53, origin: originValue };
    if (o.pricelist_id?.id) baseVals.pricelist_id = o.pricelist_id.id;

    // 3. Buscar Pedido Existente
    const existed = await withLoading(() => callOdoo("sale.order", "search_read", [[["origin", "=", originValue]], ["name", "id", "state"]], { limit: 1 }));

    let finalSoId;
    if (existed && existed.length > 0) {
      const so = existed[0];
      const state = so.state || "draft";
      if (state === "cancel") {
        const createNew = await showConfirm(`El pedido ${so.name} fue CANCELADO.\n¿Crear uno nuevo?`, { title: "Cancelado", confirmText: "Crear Nuevo", cancelText: "Ver Cancelado" });
        if (createNew === null) return;
        if (createNew === false) { window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank"); return; }
        finalSoId = await withLoading(() => callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]));
      } else if (!["draft", "sent"].includes(state)) {
        const openIt = await showConfirm(`El pedido ${so.name} ya está confirmado.\n¿Desea abrirlo?`, { title: "No Modificable", confirmText: "Abrir", cancelText: "Cerrar" });
        if (openIt) window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank");
        return;
      } else {
        const action = await showChoice(`Se encontró pedido: ${so.name} (Borrador)\nAcción:`, [ { label: "Solo Ver", value: "3", secondary: true }, { label: "Crear Nuevo", value: "2", secondary: true }, { label: "Sobrescribir", value: "1", danger: true }, ], "Duplicado");
        if (!action) return;
        if (action === "3") { window.open(`/web#id=${so.id}&model=sale.order&view_type=form`, "_blank"); return; }
        finalSoId = await withLoading(async () => {
            if (action === "2") return await callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]);
            else if (action === "1") { await callOdoo("sale.order", "write", [[so.id], { ...baseVals, order_line: [[5, 0, 0], ...orderLines] }]); return so.id; }
        });
      }
    } else {
      const ok = await showConfirm("No hay pedido relacionado.\n¿Crear ahora?", { title: "Nuevo Pedido", confirmText: "Crear", cancelText: "Cancelar" });
      if (!ok) return;
      finalSoId = await withLoading(() => callOdoo("sale.order", "create", [{ ...baseVals, order_line: orderLines }]));
    }

    if (!finalSoId) return;

    // 4. Enviar Notas (Chatter)
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

    // 5. Finalizar y Binding Inverso
    await withLoading(async () => {
        const soInfo = await callOdoo("sale.order", "read", [[finalSoId], ["name"]]);
        const soName = soInfo[0].name;

        try {
            if (posmodel && posmodel.selectedOrder) {
                if (typeof posmodel.selectedOrder.set_client_order_ref === "function") {
                    posmodel.selectedOrder.set_client_order_ref(soName);
                }
                posmodel.selectedOrder.name = soName;
                console.log(`[POS Sync] Pedido vinculado: ${soName}`);
            }
        } catch(e) { console.error("Error en binding inverso", e); }

        const shouldOpen = await showModal({ title: "¡Éxito!", message: `Sincronización Completada.\nPedido: ${soName}\n(Vinculado en POS)`, buttons: [{ label: "Ver Pedido", value: true, primary: true }] });
        if (shouldOpen) window.open(`/web#id=${finalSoId}&model=sale.order&view_type=form`, "_blank");
    });
  }

  // =========================
  // Eventos y Loop
  // =========================
  document.addEventListener("keydown", (e) => {
    if (e.key === "F11") {
       e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
       if (!isPosUiProductPage()) return;
       if (isSyncing) return;
       isSyncing = true;
       syncLogic().catch(err => { hideLoading(); showAlert(err.message, "Error Sistema"); }).finally(() => { isSyncing = false; hideLoading(); });
    }
    if (e.key === "Escape") {
       if (pbModalRoot && pbModalRoot.classList.contains("pb-visible")) { e.preventDefault(); closeModal(null); }
    }
  });

  setInterval(() => {
    if (!document.getElementById("pb-pos-style-dark")) ensureModalDom();
    updatePricelistLabel();

    const modals = document.querySelectorAll(".modal-content:not([data-pb-spec-done='1'])");
    modals.forEach(modal => {
        const hasTitle = modal.querySelector("header.modal-header h3.section-title") || modal.querySelector("header.modal-header .modal-title");
        if (hasTitle) injectSpec(modal);
    });
  }, 500);

  // =========================
  // Sistema de Specs (UOM)
  // =========================
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

    const labelText = "UOM";
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
  } catch (e) {}

})();