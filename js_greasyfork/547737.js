// ==UserScript==
// @name         apass-tools
// @namespace    https://lers.site
// @version      0.1.6
// @author       lers梦貘
// @description  APass平台工具合集
// @license      MIT
// @icon         data:image/x-icon;base64,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
// @match        https://*.ctapaas.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547737/apass-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/547737/apass-tools.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const icons = {
    success: `<svg width="20" height="20" fill="#67C23A" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm226.4 338.4l-259 259c-6.2 6.2-14.4 9.3-22.6 9.3s-16.4-3.1-22.6-9.3l-129-129c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L456 590.7l236.4-236.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8-.1 45.3z"/></svg>`,
    error: `<svg width="20" height="20" fill="#F56C6C" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm150.6 602.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L512 557.3 406.7 662.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L466.7 512 361.4 406.7c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L512 466.7l105.3-105.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L557.3 512l105.3 105.3z"/></svg>`,
    warning: `<svg width="20" height="20" fill="#E6A23C" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 682c-23.6 0-42.6-19-42.6-42.6s19-42.6 42.6-42.6 42.6 19 42.6 42.6-19 42.6-42.6 42.6zm42.6-192h-85.2V298.7h85.2V554z"/></svg>`,
    info: `<svg width="20" height="20" fill="#409EFF" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm42.6 640h-85.2V469.3h85.2V704zm0-298.7h-85.2v-85.2h85.2v85.2z"/></svg>`
  };
  const colors = {
    success: "#67C23A",
    error: "#F56C6C",
    warning: "#E6A23C",
    info: "#409EFF"
  };
  class Tips {
    static messageContainer = null;
    /** 信息提示框（居中显示 + 可限制最大数量） */
    static message({ text, type = "info", duration = 3e3, max = 3 }) {
      if (!this.messageContainer) {
        this.messageContainer = document.createElement("div");
        Object.assign(this.messageContainer.style, {
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          zIndex: "999999"
        });
        document.body.appendChild(this.messageContainer);
      }
      if (this.messageContainer.children.length >= max) {
        this.messageContainer.firstElementChild?.remove();
      }
      const div = document.createElement("div");
      div.innerHTML = `${icons[type]} <span style="margin-left:8px">${text}</span>`;
      Object.assign(div.style, {
        background: "#fff",
        color: colors[type],
        padding: "10px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        fontSize: "14px",
        opacity: "0",
        transition: "opacity 0.4s, transform 0.4s",
        transform: "translateY(-20px)",
        display: "flex",
        alignItems: "center"
      });
      this.messageContainer.appendChild(div);
      requestAnimationFrame(() => {
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
      });
      setTimeout(() => {
        div.style.opacity = "0";
        div.style.transform = "translateY(-20px)";
        setTimeout(() => {
          div.remove();
        }, 400);
      }, duration);
    }
    /** 自定义 alert 对话框 */
    static alert({ title, content, type = "info", onOk }) {
      const mask = document.createElement("div");
      Object.assign(mask.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "1000000"
      });
      const box = document.createElement("div");
      Object.assign(box.style, {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "360px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        fontSize: "14px",
        color: "#333",
        display: "flex",
        flexDirection: "column"
      });
      const header = document.createElement("div");
      Object.assign(header.style, {
        display: "flex",
        alignItems: "center",
        marginBottom: "12px",
        fontSize: "16px",
        fontWeight: "bold",
        color: colors[type]
      });
      header.innerHTML = `${icons[type]} <span style="margin-left:8px">${title}</span>`;
      const body = document.createElement("div");
      Object.assign(body.style, {
        marginBottom: "16px",
        fontSize: "14px",
        color: "#555",
        lineHeight: "1.5"
      });
      body.innerText = content;
      const btn = document.createElement("button");
      btn.innerText = "确定";
      Object.assign(btn.style, {
        alignSelf: "center",
        padding: "6px 12px",
        background: colors[type],
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px"
      });
      btn.onclick = () => {
        mask.remove();
        if (onOk) onOk();
      };
      box.appendChild(header);
      box.appendChild(body);
      box.appendChild(btn);
      mask.appendChild(box);
      document.body.appendChild(mask);
    }
  }
  const DEFAULT_CONFIG = {
    delayBetweenSteps: 300,
    delayAfterSave: 200,
    moduleConfigs: {}
  };
  const registeredModules = [];
  function registerModuleConfig(moduleConfig) {
    const existingIndex = registeredModules.findIndex((m) => m.moduleName === moduleConfig.moduleName);
    if (existingIndex >= 0) {
      registeredModules[existingIndex] = moduleConfig;
    } else {
      registeredModules.push(moduleConfig);
    }
    const cfg = loadConfig();
    if (!cfg.moduleConfigs) {
      cfg.moduleConfigs = {};
    }
    if (!cfg.moduleConfigs[moduleConfig.moduleName]) {
      cfg.moduleConfigs[moduleConfig.moduleName] = {};
      moduleConfig.configItems.forEach((item) => {
        cfg.moduleConfigs[moduleConfig.moduleName][item.name] = item.default;
      });
      saveConfig(cfg);
    }
  }
  function getModuleConfig(moduleName) {
    const cfg = loadConfig();
    if (cfg.moduleConfigs && cfg.moduleConfigs[moduleName]) {
      return cfg.moduleConfigs[moduleName];
    }
    const moduleConfig = registeredModules.find((m) => m.moduleName === moduleName);
    if (moduleConfig) {
      const defaultConfig = {};
      moduleConfig.configItems.forEach((item) => {
        defaultConfig[item.name] = item.default;
      });
      return defaultConfig;
    }
    return {};
  }
  function getModuleConfigItem(moduleName, configName) {
    const moduleConfig = registeredModules.find((m) => m.moduleName === moduleName);
    if (moduleConfig) {
      return moduleConfig.configItems.filter((item) => item.name === configName)[0];
    }
    return;
  }
  function loadConfig() {
    return _GM_getValue("apass-config", DEFAULT_CONFIG);
  }
  function saveConfig(cfg) {
    _GM_setValue("apass-config", cfg);
  }
  function renderDefaultValuesEditor(moduleName, item, value) {
    const obj = value || {};
    const fields = getModuleConfig(moduleName)["columnMap"] || [];
    let html = `<div class="default-values" data-name="${moduleName}_${item.name}">`;
    Object.keys(obj).forEach((f) => {
      const val = Array.isArray(obj[f]) ? obj[f].join(",") : obj[f];
      html += `
      <div class="dv-row" data-field="${f}">
        <select class="dv-select">
          ${fields.map((ff) => `<option value="${ff}" ${ff === f ? "selected" : ""}>
            ${item.valueMap?.[ff] || ff} (${ff})
          </option>`).join("")}
        </select>
        <input type="text" class="dv-input" value="${val}">
        <button class="dv-del">删除</button>
      </div>`;
    });
    html += `<button class="dv-add">添加</button></div>`;
    return html;
  }
  function renderValueMapEditor(moduleName, item, value) {
    const obj = value || {};
    const fields = getModuleConfig(moduleName)["columnMap"] || [];
    let html = `<div class="valuemap-editor" data-name="${moduleName}_${item.name}">`;
    Object.keys(obj).forEach((f) => {
      const dict = obj[f] || {};
      html += `
      <div class="vm-row" data-field="${f}">
        <select class="vm-select">
          ${fields.map((ff) => `<option value="${ff}" ${ff === f ? "selected" : ""}>
            ${item.valueMap?.[ff] || ff} (${ff})
          </option>`).join("")}
        </select>
        <div class="kv-list">
          ${Object.entries(dict).map(([k, v]) => `
            <div class="kv-item">
              <input class="kv-key" value="${k}">
              <input class="kv-val" value="${v}">
              <button class="kv-del">X</button>
            </div>`).join("")}
        </div>
        <button class="kv-add">添加映射</button>
      </div>`;
    });
    html += `<button class="vm-del">删除字段</button><button class="vm-add">添加字段</button></div>`;
    return html;
  }
  function showConfigPanel() {
    const cfg = loadConfig();
    const modal = document.createElement("div");
    modal.style.cssText = `
    position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
    background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;
    z-index: 9999; min-width: 400px; max-width: 800px; max-height: 80vh; overflow-y: auto;
  `;
    let mainConfigHtml = `
    <h3>全局配置</h3>
    <label>步骤延时(ms): <input id="delaySteps" type="number" value="${cfg.delayBetweenSteps}"></label><br/>
    <label>保存后延时(ms): <input id="delaySave" type="number" value="${cfg.delayAfterSave}"></label><br/>
    <hr/>
    `;
    let moduleConfigHtml = "<h3>模块配置</h3>";
    if (registeredModules.length === 0) {
      moduleConfigHtml += "<p>暂无注册的模块配置</p>";
    } else {
      registeredModules.forEach((module) => {
        const moduleCfg = cfg.moduleConfigs?.[module.moduleName] || {};
        moduleConfigHtml += `<div class="module-config" style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                <h4>${module.moduleName}</h4>
            `;
        module.configItems.forEach((item) => {
          const value = moduleCfg[item.name] !== void 0 ? moduleCfg[item.name] : item.default;
          switch (item.type) {
            case "number":
              moduleConfigHtml += `<div data-name="${module.moduleName}_${item.name}">${item.name}${item.description ? ` (${item.description})` : ""}: 
                            <input type="number" name="${module.moduleName}_${item.name}" value="${value}">
                        </div><br/>`;
              break;
            case "string":
              moduleConfigHtml += `<div data-name="${module.moduleName}_${item.name}">${item.name}${item.description ? ` (${item.description})` : ""}: 
                            <input type="text" name="${module.moduleName}_${item.name}" value="${value}">
                        </div><br/>`;
              break;
            case "boolean":
              moduleConfigHtml += `<div data-name="${module.moduleName}_${item.name}">${item.name}${item.description ? ` (${item.description})` : ""}: 
                            <input type="checkbox" name="${module.moduleName}_${item.name}" ${value ? "checked" : ""}>
                        </div><br/>`;
              break;
            case "array":
              moduleConfigHtml += `<div data-name="${module.moduleName}_${item.name}">${item.name}${item.description ? ` (${item.description})` : ""}: 
                                <input type="text" name="${module.moduleName}_${item.name}" value="${Array.isArray(value) ? value.join(",") : ""}">
                            </div><br/>`;
              break;
            case "object":
              moduleConfigHtml += `<div data-name="${module.moduleName}_${item.name}">${item.name}${item.description ? ` (${item.description})` : ""}: 
                              <textarea name="${module.moduleName}_${item.name}" style="width: 100%; height: 100px;">${JSON.stringify(value, null, 2)}</textarea>
                            </div><br/>`;
              break;
            case "sequence": {
              const arr = Array.isArray(value) ? value : [];
              const sequenceMap = item.valueMap || {};
              moduleConfigHtml += `
                              <label>${item.description || item.name}:</label>
                              <div class="drag-container" data-name="${module.moduleName}_${item.name}">
                                ${arr.map((v) => `
                                  <div class="draggable" data-value="${v}">
                                    ${sequenceMap[v] || v}
                                  </div>`).join("")}
                              </div>
                              <br/>
                        `;
              break;
            }
            case "default":
              moduleConfigHtml += `
                            <label>${item.description || item.name}:</label>
                        `;
              moduleConfigHtml += renderDefaultValuesEditor(module.moduleName, item, value);
              moduleConfigHtml += `<br/>`;
              break;
            case "map":
              moduleConfigHtml += `
                            <label>${item.description || item.name}:</label>
                        `;
              moduleConfigHtml += renderValueMapEditor(module.moduleName, item, value);
              moduleConfigHtml += `<br/>`;
              break;
          }
        });
        moduleConfigHtml += `</div>`;
      });
    }
    modal.innerHTML = `
    <style>
      .drag-container {
        border: 1px solid #ccc;
        padding: 6px;
        margin: 6px 0 10px;
        min-height: 36px;
        border-radius: 6px;
        background: #fff;
      }
      .draggable {
        display: inline-block;
        padding: 6px 10px;
        margin: 4px;
        background: #f7f7f7;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: grab;           /* 抓手 */
        user-select: none;
        vertical-align: middle;
        transition: box-shadow .1s, border-color .1s, opacity .1s;
      }
    .drag-container { position: relative; } /* 关键：absolute 相对容器 */
    .draggable.dragging {
      opacity: .9;
      box-shadow: 0 4px 12px rgba(0,0,0,.2);
    }
    .drag-placeholder {
      display: inline-block;
      margin: 4px;
      vertical-align: middle;
      border: 2px dashed #4CAF50;
      border-radius: 6px;
    }
    </style>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2>配置面板</h2>
        <button id="closeCfg" style="padding: 5px 10px;">关闭</button>
    </div>
    ${mainConfigHtml}
    ${moduleConfigHtml}
    <div style="margin-top: 20px; text-align: right;">
        <button id="saveCfg" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存配置</button>
    </div>
  `;
    document.body.appendChild(modal);
    modal.querySelectorAll(".default-values").forEach((container) => {
      container.addEventListener("click", (e) => {
        const target = e.target;
        const moduleName = container.getAttribute("data-name")?.split("_")[0] || "";
        const itemName = container.getAttribute("data-name")?.split("_")[1] || "";
        const moduleConfig = registeredModules.find((m) => m.moduleName === moduleName);
        const configItem = moduleConfig?.configItems.find((i) => i.name === itemName);
        const fields = getModuleConfig(moduleName)["columnMap"] || [];
        if (target.classList.contains("dv-add")) {
          const newRow = document.createElement("div");
          newRow.className = "dv-row";
          newRow.dataset.field = fields[0] || "";
          newRow.innerHTML = `
                    <select class="dv-select">
                        ${fields.map((ff) => `<option value="${ff}">${configItem?.valueMap?.[ff] || ff} (${ff})</option>`).join("")}
                    </select>
                    <input type="text" class="dv-input" value="">
                    <button class="dv-del">删除</button>
                `;
          container.insertBefore(newRow, target);
        } else if (target.classList.contains("dv-del")) {
          const row = target.closest(".dv-row");
          if (row) row.remove();
        }
      });
    });
    modal.querySelectorAll(".valuemap-editor").forEach((container) => {
      container.addEventListener("click", (e) => {
        const target = e.target;
        const moduleName = container.getAttribute("data-name")?.split("_")[0] || "";
        const itemName = container.getAttribute("data-name")?.split("_")[1] || "";
        const moduleConfig = registeredModules.find((m) => m.moduleName === moduleName);
        const configItem = moduleConfig?.configItems.find((i) => i.name === itemName);
        const fields = getModuleConfig(moduleName)["columnMap"] || [];
        if (target.classList.contains("vm-add")) {
          const newRow = document.createElement("div");
          newRow.className = "vm-row";
          newRow.dataset.field = fields[0] || "";
          newRow.innerHTML = `
                    <select class="vm-select">
                        ${fields.map((ff) => `<option value="${ff}">${configItem?.valueMap?.[ff] || ff} (${ff})</option>`).join("")}
                    </select>
                    <div class="kv-list"></div>
                    <button class="kv-add">添加映射</button>
                `;
          const delButton = container.querySelector(".vm-del");
          if (delButton) {
            container.insertBefore(newRow, delButton);
          } else {
            container.appendChild(newRow);
          }
        } else if (target.classList.contains("vm-del")) {
          const rows = container.querySelectorAll(".vm-row");
          if (rows.length > 0) {
            rows[rows.length - 1].remove();
          }
        } else if (target.classList.contains("kv-add")) {
          const kvList = target.previousElementSibling;
          const newKv = document.createElement("div");
          newKv.className = "kv-item";
          newKv.innerHTML = `
                    <input class="kv-key" value="">
                    <input class="kv-val" value="">
                    <button class="kv-del">X</button>
                `;
          kvList.appendChild(newKv);
        } else if (target.classList.contains("kv-del")) {
          const kvItem = target.closest(".kv-item");
          if (kvItem) kvItem.remove();
        }
      });
    });
    const style = document.createElement("style");
    style.textContent = `
        /* 优化 default-values 样式 */
        .default-values {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .dv-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        }
        .dv-row:last-child {
            margin-bottom: 0;
        }
        .dv-select {
            flex: 1;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .dv-input {
            flex: 2;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .dv-del, .dv-add {
            padding: 6px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .dv-add {
            background-color: #4CAF50;
            margin-top: 8px;
        }
        .dv-del:hover {
            background-color: #d32f2f;
        }
        .dv-add:hover {
            background-color: #45a049;
        }

        /* 优化 valuemap-editor 样式 */
        .valuemap-editor {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .vm-row {
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #eee;
        }
        .vm-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .vm-select {
            width: 100%;
            padding: 6px;
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .kv-list {
            margin-bottom: 8px;
        }
        .kv-item {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            gap: 6px;
        }
        .kv-key, .kv-val {
            flex: 1;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .kv-del, .kv-add, .vm-del, .vm-add {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .kv-del {
            background-color: #f44336;
            color: white;
            padding: 4px 8px;
        }
        .kv-add {
            background-color: #2196F3;
            color: white;
        }
        .vm-del {
            background-color: #f44336;
            color: white;
            margin-right: 8px;
        }
        .vm-add {
            background-color: #4CAF50;
            color: white;
        }
        .kv-del:hover {
            background-color: #d32f2f;
        }
        .kv-add:hover {
            background-color: #0b7dda;
        }
        .vm-del:hover {
            background-color: #d32f2f;
        }
        .vm-add:hover {
            background-color: #45a049;
        }
    `;
    modal.appendChild(style);
    modal.querySelectorAll(".drag-container").forEach((containerNode) => {
      const container = containerNode;
      let draggingEl = null;
      let placeholder = null;
      let offsetX = 0, offsetY = 0;
      let containerRect;
      const onPointerMove = (e) => {
        if (!draggingEl || !placeholder) return;
        draggingEl.style.left = e.clientX - containerRect.left - offsetX + "px";
        draggingEl.style.top = e.clientY - containerRect.top - offsetY + "px";
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const target = el?.closest(".draggable");
        if (!target || target === draggingEl) return;
        const rect = target.getBoundingClientRect();
        const isHorizontal = rect.width >= rect.height;
        const before = isHorizontal ? e.clientX < rect.left + rect.width / 2 : e.clientY < rect.top + rect.height / 2;
        if (before) {
          container.insertBefore(placeholder, target);
        } else {
          container.insertBefore(placeholder, target.nextSibling);
        }
      };
      const onPointerUp = () => {
        if (!draggingEl || !placeholder) return;
        draggingEl.classList.remove("dragging");
        draggingEl.style.position = "";
        draggingEl.style.zIndex = "";
        draggingEl.style.pointerEvents = "";
        draggingEl.style.width = "";
        draggingEl.style.height = "";
        draggingEl.style.left = "";
        draggingEl.style.top = "";
        container.insertBefore(draggingEl, placeholder);
        placeholder.remove();
        draggingEl = null;
        placeholder = null;
        document.removeEventListener("pointermove", onPointerMove, true);
        document.removeEventListener("pointerup", onPointerUp, true);
      };
      container.querySelectorAll(".draggable").forEach((item) => {
        item.addEventListener("pointerdown", (e) => {
          if (e.button !== 0) return;
          draggingEl = item;
          const rect = item.getBoundingClientRect();
          containerRect = container.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          placeholder = document.createElement("div");
          placeholder.className = "drag-placeholder";
          placeholder.style.width = rect.width + "px";
          placeholder.style.height = rect.height + "px";
          container.insertBefore(placeholder, item.nextSibling);
          item.classList.add("dragging");
          item.style.position = "absolute";
          item.style.zIndex = "9999";
          item.style.pointerEvents = "none";
          item.style.width = rect.width + "px";
          item.style.height = rect.height + "px";
          item.style.left = rect.left - containerRect.left + "px";
          item.style.top = rect.top - containerRect.top + "px";
          container.appendChild(item);
          document.addEventListener("pointermove", onPointerMove, true);
          document.addEventListener("pointerup", onPointerUp, true);
          e.preventDefault();
        });
      });
    });
    modal.querySelector("#saveCfg").onclick = () => {
      const newCfg = {
        delayBetweenSteps: parseInt(modal.querySelector("#delaySteps").value),
        delayAfterSave: parseInt(modal.querySelector("#delaySave").value),
        moduleConfigs: { ...cfg.moduleConfigs }
      };
      registeredModules.forEach((module) => {
        if (!newCfg.moduleConfigs) {
          newCfg.moduleConfigs = {};
        }
        if (!newCfg.moduleConfigs[module.moduleName]) {
          newCfg.moduleConfigs[module.moduleName] = {};
        }
        module.configItems.forEach((item) => {
          const con = modal.querySelector(`div[data-name="${module.moduleName}_${item.name}"]`);
          if (con) {
            switch (item.type) {
              case "number": {
                const input = con.querySelector("input");
                newCfg.moduleConfigs[module.moduleName][item.name] = parseInt(input.value);
                break;
              }
              case "string": {
                const input = con.querySelector("input");
                newCfg.moduleConfigs[module.moduleName][item.name] = input.value;
                break;
              }
              case "boolean": {
                const input = con.querySelector("input");
                newCfg.moduleConfigs[module.moduleName][item.name] = input.checked;
                break;
              }
              case "array": {
                const input = con.querySelector("input");
                newCfg.moduleConfigs[module.moduleName][item.name] = input.value.split(",").map((s) => s.trim());
                break;
              }
              case "object":
                try {
                  const input = con.querySelector("input");
                  newCfg.moduleConfigs[module.moduleName][item.name] = JSON.parse(input.value);
                } catch (e) {
                  Tips.alert({
                    title: "配置解析失败",
                    content: `模块${module.moduleName}的${item.name}配置解析失败，请检查JSON格式`,
                    type: "error"
                  });
                  return;
                }
                break;
              case "sequence": {
                const container = modal.querySelector(`[data-name="${module.moduleName}_${item.name}"]`);
                if (container) {
                  newCfg.moduleConfigs[module.moduleName][item.name] = Array.from(container.querySelectorAll(".draggable")).map((el) => el.dataset.value);
                } else {
                  Tips.alert({
                    title: "配置解析失败",
                    content: `模块${module.moduleName}的${item.name}配置解析失败，请检查数据结构`,
                    type: "error"
                  });
                }
                break;
              }
              case "default": {
                const container = modal.querySelector(`[data-name="${module.moduleName}_${item.name}"]`);
                const obj = {};
                container.querySelectorAll(".dv-row").forEach((row) => {
                  const f = row.querySelector(".dv-select").value;
                  const v = row.querySelector(".dv-input").value;
                  obj[f] = v ? v.split(",").map((x) => x.trim()).filter(Boolean) : [];
                });
                newCfg.moduleConfigs[module.moduleName][item.name] = obj;
                break;
              }
              case "map": {
                const container = modal.querySelector(`[data-name="${module.moduleName}_${item.name}"]`);
                const obj = {};
                container.querySelectorAll(".vm-row").forEach((row) => {
                  const f = row.querySelector(".vm-select").value;
                  const dict = {};
                  row.querySelectorAll(".kv-item").forEach((kv) => {
                    const k = kv.querySelector(".kv-key").value.trim();
                    const v = kv.querySelector(".kv-val").value.trim();
                    if (k) dict[k] = v;
                  });
                  obj[f] = dict;
                });
                newCfg.moduleConfigs[module.moduleName][item.name] = obj;
                break;
              }
            }
          }
        });
      });
      saveConfig(newCfg);
      Tips.message({
        text: "配置保存成功",
        type: "success"
      });
    };
    modal.querySelector("#closeCfg").onclick = () => {
      document.body.removeChild(modal);
    };
  }
  var importType = /* @__PURE__ */ ((importType2) => {
    importType2[importType2["csv"] = 0] = "csv";
    importType2[importType2["paste"] = 1] = "paste";
    return importType2;
  })(importType || {});
  const MenuClass = "lers-floating-menu";
  class FloatingMenu {
    ball;
    menu;
    menuItems;
    isDragging = false;
    offsetX = 0;
    offsetY = 0;
    ballSize = 50;
    // 悬浮球尺寸
    threshold = 50;
    // 增大吸附阈值，更容易拉出
    constructor(menuItems) {
      this.menuItems = menuItems;
      this.ball = document.createElement("div");
      this.ball.style.cssText = `
      position: fixed; bottom: 40px; right: 40px;
      width: ${this.ballSize}px; height: ${this.ballSize}px;
      border-radius: 50%; background: #1890ff; color: white;
      display: flex; align-items: center; justify-content: center;
      cursor: move; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      user-select: none; transition: all 0.2s ease;font-size: 30px;
    `;
      this.ball.textContent = "⚙";
      this.ball.classList.add(MenuClass);
      document.body.appendChild(this.ball);
      this.menu = document.createElement("div");
      this.menu.style.cssText = `
      position: fixed; display: none;
      background: #fff; border: 1px solid #ccc;
      border-radius: 6px; padding: 4px 0;
      min-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px; z-index: 100000;
    `;
      this.menu.addEventListener("click", (e) => e.stopPropagation());
      document.body.appendChild(this.menu);
      this.ball.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showMenu();
      });
      document.addEventListener("click", () => this.hideMenu());
      this.ball.addEventListener("mousedown", this.handleMouseDown.bind(this));
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));
      document.addEventListener("mouseleave", this.handleMouseUp.bind(this));
    }
    handleMouseDown(e) {
      if (e.button !== 0) return;
      e.stopPropagation();
      this.isDragging = true;
      const rect = this.ball.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      this.ball.style.cursor = "grabbing";
      this.ball.style.zIndex = "100001";
    }
    handleMouseMove(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      let x = e.clientX - this.offsetX;
      let y = e.clientY - this.offsetY;
      const { x: snappedX, y: snappedY } = this.applyEdgeSnap(x, y);
      this.ball.style.left = `${snappedX}px`;
      this.ball.style.top = `${snappedY}px`;
      this.ball.style.bottom = "auto";
      this.ball.style.right = "auto";
    }
    handleMouseUp() {
      if (this.isDragging) {
        this.isDragging = false;
        this.ball.style.cursor = "move";
        this.ball.style.zIndex = "99999";
      }
    }
    // 专用边缘吸附方法
    applyEdgeSnap(x, y) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let newX = x;
      let newY = y;
      if (newX <= this.threshold && newX > -this.ballSize / 2) {
        newX = -this.ballSize / 2;
      } else if (newX + this.ballSize >= viewportWidth - this.threshold && newX < viewportWidth - this.ballSize / 2) {
        newX = viewportWidth - this.ballSize / 2;
      }
      if (newY <= this.threshold) {
        newY = 0;
      } else if (newY + this.ballSize >= viewportHeight - this.threshold) {
        newY = viewportHeight - this.ballSize;
      }
      return { x: newX, y: newY };
    }
    showMenu() {
      this.menu.innerHTML = "";
      this.renderMenu(this.menu, this.menuItems);
      requestAnimationFrame(() => {
        const ballRect = this.ball.getBoundingClientRect();
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const ballCenterY = ballRect.top + ballRect.height / 2;
        const menuWidth = this.menu.offsetWidth || 160;
        const menuHeight = this.menu.offsetHeight || 200;
        let x = ballCenterX - menuWidth / 2;
        let y = ballCenterY - menuHeight / 2;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (x < 0) {
          x = 0;
        } else if (x + menuWidth > viewportWidth) {
          x = viewportWidth - menuWidth;
        }
        if (y < 0) {
          y = 0;
        } else if (y + menuHeight > viewportHeight) {
          y = viewportHeight - menuHeight;
        }
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.style.display = "block";
      });
    }
    hideMenu() {
      this.menu.style.display = "none";
    }
    static removeMenu() {
      document.querySelectorAll(`div.${MenuClass}`).forEach((el) => el.remove());
    }
    static ifMenuExists() {
      return document.querySelectorAll(`div.${MenuClass}`).length > 0;
    }
    renderMenu(container, items, isRoot = true) {
      items.forEach((item) => {
        const el = document.createElement("div");
        el.style.cssText = `
            padding: 6px 12px; cursor: pointer;
            white-space: nowrap; position: relative;
        `;
        el.textContent = item.label;
        el.onmouseenter = () => {
          el.style.background = "#f5f5f5";
          if (item.children) {
            const submenu = el.querySelector(":scope > div");
            if (submenu) submenu.style.display = "block";
          }
        };
        el.onmouseleave = () => {
          el.style.background = "transparent";
          if (item.children) {
            const submenu = el.querySelector(":scope > div");
            if (submenu) submenu.style.display = "none";
          }
        };
        if (!isRoot && item.action) {
          el.onclick = (e) => {
            e.stopPropagation();
            item.action();
            this.hideMenu();
          };
        }
        container.appendChild(el);
        if (item.children) {
          const submenu = document.createElement("div");
          submenu.style.cssText = `
                display: none; position: absolute; left: 100%; top: 0;
                background: #fff; border: 1px solid #ccc;
                border-radius: 6px; padding: 4px 0; min-width: 160px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
          this.renderMenu(submenu, item.children, false);
          el.appendChild(submenu);
          el.onmouseenter = () => {
            el.style.background = "#f5f5f5";
            if (item.children) {
              const submenu2 = el.querySelector(":scope > div");
              if (submenu2) {
                const elRect = el.getBoundingClientRect();
                const submenuWidth = submenu2.offsetWidth || 160;
                const submenuHeight = submenu2.offsetHeight || 200;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                let submenuTop = el.offsetTop;
                if (elRect.top + submenuTop + submenuHeight > viewportHeight) {
                  submenuTop = viewportHeight - elRect.top - submenuHeight;
                  if (submenuTop < 0) submenuTop = 0;
                }
                if (elRect.right + submenuWidth > viewportWidth) {
                  submenu2.style.left = "auto";
                  submenu2.style.right = "100%";
                  submenu2.style.top = `${submenuTop}px`;
                  submenu2.style.marginRight = "-1px";
                } else {
                  submenu2.style.left = "100%";
                  submenu2.style.right = "auto";
                  submenu2.style.top = `${submenuTop}px`;
                  submenu2.style.marginLeft = "-1px";
                }
                submenu2.style.display = "block";
              }
            }
          };
        }
      });
    }
  }
  class ModuleManager {
    static instance;
    modules = [];
    matchedModules = [];
    constructor() {
    }
    /**
     * 获取单例实例
     */
    static getInstance() {
      if (!ModuleManager.instance) {
        ModuleManager.instance = new ModuleManager();
      }
      return ModuleManager.instance;
    }
    /**
     * 注册模块
     * @param moduleConfig 模块配置
     */
    registerModule(moduleConfig) {
      this.modules.push(moduleConfig);
    }
    /**
     * 根据当前URL匹配模块
     * @returns 匹配的模块列表
     */
    matchModules() {
      const currentUrl = window.location.href;
      this.matchedModules = this.modules.filter((module) => {
        if (typeof module.urlPattern === "string") {
          return currentUrl.includes(module.urlPattern);
        } else {
          return module.urlPattern.test(currentUrl);
        }
      });
      this.matchedModules.forEach((module) => {
        try {
          module.init();
        } catch (error) {
          console.error(`Failed to initialize module ${module.moduleName}:`, error);
        }
      });
      return this.matchedModules;
    }
    /**
     * 获取所有匹配模块的菜单项
     * @returns 菜单项列表
     */
    getMatchedMenuItems() {
      const menuItems = [];
      this.matchedModules.forEach((module) => {
        if (module.menuItems && module.menuItems.length > 0) {
          menuItems.push(...module.menuItems);
        }
      });
      return menuItems;
    }
    /**
     * 刷新模块匹配
     * 当URL变化时调用
     */
    refreshModules() {
      this.matchModules();
    }
  }
  const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));
  function dispatchClick(el) {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  function waitForElement(selector, timeout = 1e4) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }
      const observer = new MutationObserver(() => {
        const el2 = document.querySelector(selector);
        if (el2) {
          observer.disconnect();
          resolve(el2);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      if (timeout) {
        setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }, timeout);
      }
    });
  }
  function parseCSV(text) {
    return text.split("\n").map((line) => line.split(",").map((v) => v.trim())).filter((row) => row.some((cell) => cell !== ""));
  }
  async function setReactInput(input, value) {
    if (value === void 0 || value === null || value === "") {
      return;
    }
    const lastValue = input.value;
    input.value = value;
    const tracker = input._valueTracker;
    if (tracker) await tracker.setValue(lastValue);
    input.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      composed: true,
      inputType: "insertText",
      data: value
    }));
  }
  function showEditableTable(options, onConfirm) {
    const { headers, data = [[]], title = "表格编辑器" } = options;
    const tableData = data.length ? data.map((row) => [...row]) : [headers.map(() => "")];
    let currentRowIndex = 0;
    let currentColIndex = 0;
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.3)";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "15px";
    modal.style.borderRadius = "8px";
    modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    modal.style.zIndex = "10000";
    modal.style.maxHeight = "80%";
    modal.style.overflow = "auto";
    const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.justifyContent = "space-between";
    headerDiv.style.alignItems = "center";
    headerDiv.style.marginBottom = "10px";
    const titleEl = document.createElement("div");
    titleEl.innerText = title;
    titleEl.style.fontWeight = "bold";
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });
    headerDiv.appendChild(titleEl);
    headerDiv.appendChild(closeBtn);
    modal.appendChild(headerDiv);
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.innerText = h;
      th.style.border = "1px solid black";
      th.style.padding = "5px";
      th.style.backgroundColor = "#f0f0f0";
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    modal.appendChild(table);
    function createTd(rowIndex, colIndex, cellValue) {
      const td = document.createElement("td");
      td.contentEditable = "true";
      td.style.border = "1px solid black";
      td.style.padding = "5px";
      td.style.minHeight = "24px";
      td.innerText = cellValue || " ";
      td.addEventListener("focus", () => {
        currentRowIndex = rowIndex;
        currentColIndex = colIndex;
      });
      td.addEventListener("input", () => {
        tableData[rowIndex][colIndex] = td.innerText === " " ? "" : td.innerText;
      });
      return td;
    }
    function renderTable() {
      if (!tableData.some((row) => row.length > 0)) {
        tableData.push(headers.map(() => ""));
      }
      tbody.innerHTML = "";
      tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
          tr.appendChild(createTd(rowIndex, colIndex, cell));
        });
        tbody.appendChild(tr);
      });
    }
    renderTable();
    table.addEventListener("paste", (e) => {
      e.preventDefault();
      if (!e.clipboardData || !e.clipboardData.getData)
        return;
      const paste = e.clipboardData.getData("text");
      const rows = paste.split(/\r?\n/).filter((r) => r);
      rows.forEach((rowText, rIdx) => {
        const cells = rowText.split("	");
        const targetRowIndex = currentRowIndex + rIdx;
        while (tableData.length <= targetRowIndex) {
          tableData.push(headers.map(() => ""));
        }
        cells.forEach((cell, cIdx) => {
          const targetColIndex = currentColIndex + cIdx;
          if (targetColIndex >= headers.length) return;
          tableData[targetRowIndex][targetColIndex] = cell;
        });
      });
      renderTable();
    });
    const addRowBtn = document.createElement("button");
    addRowBtn.innerText = "新增一行";
    addRowBtn.style.marginTop = "10px";
    addRowBtn.addEventListener("click", () => {
      tableData.push(headers.map(() => ""));
      renderTable();
    });
    modal.appendChild(addRowBtn);
    const confirmBtn = document.createElement("button");
    confirmBtn.innerText = "确认";
    confirmBtn.style.marginTop = "10px";
    confirmBtn.style.marginLeft = "10px";
    confirmBtn.addEventListener("click", () => {
      const filteredData = tableData.filter((row) => row.some((cell) => cell.trim() !== ""));
      onConfirm(filteredData);
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });
    modal.appendChild(confirmBtn);
    document.body.appendChild(modal);
  }
  function debounce(fn, delay, immediate = false) {
    let timer = null;
    return function(...args) {
      const context = this;
      if (timer) {
        clearTimeout(timer);
      }
      if (immediate && !timer) {
        fn.apply(context, args);
      }
      timer = setTimeout(() => {
        if (!immediate) {
          fn.apply(context, args);
        }
        timer = null;
      }, delay);
    };
  }
  const module_name$3 = "积木资产";
  function init$3() {
    registerModuleConfig({
      moduleName: module_name$3,
      configItems: [
        {
          name: "columnMap",
          type: "sequence",
          default: [
            "fieldName",
            // 第0列: 字段名称
            "alias",
            // 第1列: 别名
            "fieldType",
            // 第2列: 字段类型（下拉）
            "primaryKey",
            // 第3列: 主键 (0/1)
            "category",
            // 第4列: 类别（下拉）
            "remark",
            // 第5列: 备注
            "notNull",
            // 第6列: 不为空 (0/1)
            "displayType"
            // 第7列: 显示类型（下拉）
          ],
          description: "列顺序映射",
          valueMap: {
            fieldName: "字段名称",
            alias: "别名",
            fieldType: "字段类型",
            primaryKey: "主键(0/1)",
            category: "类别",
            remark: "备注",
            notNull: "不为空(0/1)",
            displayType: "显示类型"
          }
        },
        {
          name: "defaultValues",
          type: "default",
          default: {
            "displayType": ["单行文本", "数字", "日期"]
          },
          description: "默认值",
          valueMap: {
            fieldName: "字段名称",
            alias: "别名",
            fieldType: "字段类型",
            primaryKey: "主键",
            category: "类别",
            remark: "备注",
            notNull: "不为空",
            displayType: "显示类型"
          }
        },
        {
          name: "valueMap",
          type: "map",
          default: {
            "fieldType": {
              "string": "文本",
              "int": "数值",
              "date": "日期",
              "boolean": "文本",
              "datetime": "日期时间"
            }
          },
          description: "值映射",
          valueMap: {
            fieldName: "字段名称",
            alias: "别名",
            fieldType: "字段类型",
            primaryKey: "主键",
            category: "类别",
            remark: "备注",
            notNull: "不为空",
            displayType: "显示类型"
          }
        }
      ]
    });
  }
  function run$3(type) {
    if (type === importType.csv) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const text = evt.target?.result;
          if (/�/.test(text)) {
            const fr = new FileReader();
            fr.onload = (ev2) => {
              const data2 = parseCSV(ev2.target?.result);
              batchInsert$1(data2);
            };
            fr.readAsText(file, "UTF-8");
          }
          const data = parseCSV(text);
          checkTypeAndBatchInsert(data);
        };
        reader.readAsText(file, "GBK");
      };
      input.click();
    } else if (type === importType.paste) {
      const configItem = getModuleConfigItem(module_name$3, "valueMap");
      const columnMap = getModuleConfig(module_name$3)[
        "columnMap"
        /* columnMap */
      ];
      showEditableTable(
        {
          headers: columnMap.map((n) => configItem?.valueMap[n] ?? n),
          data: [[]],
          title: "积木资产批量导入(可以从表格中粘贴数据)"
        },
        (data) => {
          checkTypeAndBatchInsert(data);
        }
      );
    }
  }
  function checkTypeAndBatchInsert(data) {
    try {
      if (document.querySelectorAll(".ant-steps").length === 0) {
        batchInsert2(data);
      } else {
        batchInsert$1(data);
      }
    } catch {
      Tips.alert({
        title: "积木资产批量导入失败",
        content: "未知原因，请保留控制台信息，并反馈给开发者",
        type: "error"
      });
    }
  }
  async function selectDropdown(el, candidates) {
    const config = loadConfig();
    if (!candidates || candidates.length === 0) return;
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await sleep(config.delayBetweenSteps);
    const dropdown = document.querySelector(".ant-select-dropdown:not(.ant-select-dropdown-hidden)");
    if (!dropdown) return;
    for (let value of candidates) {
      const option = [...Array.from(dropdown.querySelectorAll(".ant-select-item"))].find((o) => {
        const x = o;
        return x.innerText.includes(value);
      });
      if (option) {
        option.click();
        return;
      }
    }
    console.warn("没有找到可用的下拉值", candidates);
  }
  function isRowSaved(tr) {
    const editableInputs = tr.querySelectorAll("input:not([disabled])");
    return editableInputs.length === 0;
  }
  function getColumnIndex(fieldName) {
    const columnMap = getModuleConfig(module_name$3)[
      "columnMap"
      /* columnMap */
    ];
    return columnMap.indexOf(fieldName);
  }
  function mapValue(field, value) {
    const valueMap = getModuleConfig(module_name$3)[
      "valueMap"
      /* valueMap */
    ];
    const defaultValues = getModuleConfig(module_name$3)[
      "defaultValues"
      /* defaultValues */
    ];
    if (value && value !== "") {
      if (valueMap[field]) {
        const normalizedValue = value.toLowerCase().trim();
        for (const [key, mappedValue] of Object.entries(valueMap[field])) {
          if (key.toLowerCase() === normalizedValue) {
            return mappedValue;
          }
        }
      }
      return value;
    }
    if (defaultValues[field]) {
      const defs = Array.isArray(defaultValues[field]) ? defaultValues[field] : [defaultValues[field]];
      for (let def of defs) {
        if (def && def !== "") {
          return def;
        }
      }
    }
    return "";
  }
  function getCandidates(field, value) {
    const valueMap = getModuleConfig(module_name$3)[
      "valueMap"
      /* valueMap */
    ];
    const defaultValues = getModuleConfig(module_name$3)[
      "defaultValues"
      /* defaultValues */
    ];
    if (value && value !== "") {
      if (valueMap[field]) {
        const normalizedValue = value.toLowerCase().trim();
        for (const [key, mappedValue] of Object.entries(valueMap[field])) {
          if (key.toLowerCase() === normalizedValue) {
            return [mappedValue];
          }
        }
      }
      return [value];
    }
    if (defaultValues[field]) {
      return Array.isArray(defaultValues[field]) ? defaultValues[field] : [defaultValues[field]];
    }
    return [];
  }
  async function fillRow(row) {
    const config = loadConfig();
    const table = document.querySelector("#container > section > main.ant-layout-content.assetConfigContent > div.buildings-table > div > div > div > div > div > div > table > tbody");
    if (!table) return false;
    const rows = table.querySelectorAll("tr");
    const tr = rows[rows.length - 1];
    const getVal = (field) => mapValue(field, row[getColumnIndex(field)] || "");
    const getValDropdown = (field) => getCandidates(field, row[getColumnIndex(field)]);
    let fn = getVal("fieldName");
    if (fn) {
      fn = fn.trim();
      await setReactInput(tr.querySelector("td:nth-child(2) > input"), fn);
      await sleep(config.delayBetweenSteps);
    }
    const ft = getValDropdown("fieldType");
    if (ft) {
      const selector = tr.querySelector("td:nth-child(3) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, ft);
        await sleep(config.delayBetweenSteps);
      }
    }
    const cg = getValDropdown("category");
    if (cg) {
      const selector = tr.querySelector("td:nth-child(4) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, cg);
        await sleep(config.delayBetweenSteps);
      }
    }
    const dt = getValDropdown("displayType");
    if (dt) {
      const selector = tr.querySelector("td:nth-child(5) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, dt);
        await sleep(config.delayBetweenSteps);
      }
    }
    let alias = getVal("alias");
    if (alias) {
      alias = alias.trim();
      await setReactInput(tr.querySelector("td:nth-child(6) > input"), alias);
      await sleep(config.delayBetweenSteps);
    }
    let remark = getVal("remark");
    if (remark) {
      remark = remark.trim();
      await setReactInput(tr.querySelector("td:nth-child(7) > input"), remark);
      await sleep(config.delayBetweenSteps);
    }
    let nn = getVal("notNull");
    if (nn) {
      nn = nn.trim();
      if (nn == "1") {
        const box = tr.querySelector("td:nth-child(8) input");
        if (box && !box.classList.contains("disabled")) {
          box.click();
          await sleep(config.delayBetweenSteps);
        }
      }
    }
    let pk = getVal("primaryKey");
    if (pk) {
      pk = pk.trim();
      if (pk == "1") {
        const box = tr.querySelector("td:nth-child(9) input");
        if (box && !box.classList.contains("disabled")) {
          box.click();
          await sleep(config.delayBetweenSteps);
        }
      }
    }
    const saveBtn = tr.querySelector("td:nth-child(11) > span:nth-child(1)");
    if (saveBtn) {
      saveBtn.click();
      await sleep(config.delayBetweenSteps);
    }
    if (!isRowSaved(tr)) {
      return false;
    }
    await sleep(config.delayAfterSave);
    return true;
  }
  async function fillRow2(row) {
    const config = loadConfig();
    const table = document.querySelector("#container > div > div > div > div > div.ant-table-wrapper > div > div > div > div > div.ant-table-body > table > tbody");
    if (!table) return false;
    const rows = table.querySelectorAll("tr");
    const tr = rows[rows.length - 1];
    const getVal = (field) => mapValue(field, row[getColumnIndex(field)] || "");
    const getValDropdown = (field) => getCandidates(field, row[getColumnIndex(field)]);
    let fn = getVal("fieldName");
    if (fn) {
      fn = fn.trim();
      await setReactInput(tr.querySelector("td:nth-child(2) input"), fn);
      await sleep(config.delayBetweenSteps);
    }
    const ft = getValDropdown("fieldType");
    if (ft) {
      const selector = tr.querySelector("td:nth-child(3) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, ft);
        await sleep(config.delayBetweenSteps);
      }
    }
    const cg = getValDropdown("category");
    if (cg) {
      const selector = tr.querySelector("td:nth-child(5) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, cg);
        await sleep(config.delayBetweenSteps);
      }
    }
    const dt = getValDropdown("displayType");
    if (dt) {
      const selector = tr.querySelector("td:nth-child(6) .ant-select-selector");
      if (selector) {
        await selectDropdown(selector, dt);
        await sleep(config.delayBetweenSteps);
      }
    }
    let alias = getVal("alias");
    if (alias) {
      alias = alias.trim();
      await setReactInput(tr.querySelector("td:nth-child(7) input"), alias);
      await sleep(config.delayBetweenSteps);
    }
    let remark = getVal("remark");
    if (remark) {
      remark = remark.trim();
      await setReactInput(tr.querySelector("td:nth-child(8) input"), remark);
      await sleep(config.delayBetweenSteps);
    }
    let nn = getVal("notNull");
    if (nn) {
      nn = nn.trim();
      if (nn == "1") {
        const box = tr.querySelector("td:nth-child(9) input");
        if (box && !box.classList.contains("disabled")) {
          box.click();
          await sleep(config.delayBetweenSteps);
        }
      }
    }
    let pk = getVal("primaryKey");
    if (pk) {
      pk = pk.trim();
      if (pk == "1") {
        const box = tr.querySelector("td:nth-child(10) input");
        if (box && !box.classList.contains("disabled")) {
          box.click();
          await sleep(config.delayBetweenSteps);
        }
      }
    }
    await sleep(config.delayAfterSave);
    return true;
  }
  async function batchInsert$1(data) {
    const config = loadConfig();
    for (let row of data) {
      const add_button = document.querySelector("#container > section > main.ant-layout-content.assetConfigContent > div.buildings-table > button");
      if (add_button) {
        add_button.click();
      } else {
        Tips.alert({
          title: "积木资产批量导入出错！",
          content: "未找到'新增'按钮，有疑问联系脚本作者。",
          type: "error"
        });
        return;
      }
      await sleep(config.delayBetweenSteps);
      const result = await fillRow(row);
      if (!result) {
        Tips.alert({
          title: "积木资产批量导入出错！",
          content: "行填充出错，请确认提供的信息包含必填项\n并合理调整全局间隔时间，有疑问联系脚本作者。",
          type: "error"
        });
        return;
      }
    }
    Tips.message({
      text: "积木资产批量导入完成！",
      type: "success"
    });
  }
  async function batchInsert2(data) {
    const config = loadConfig();
    const edit_button = document.querySelector("#container > div > div > div > div > div.top-operation > div > span");
    if (edit_button && edit_button.innerHTML === "编辑") {
      edit_button.click();
    }
    await sleep(config.delayBetweenSteps);
    for (let row of data) {
      const add_button = document.querySelector("#container > div > div > div > div > div.add-btn-content > span");
      if (add_button && add_button.innerHTML === "添加") {
        add_button.click();
      } else {
        Tips.alert({
          title: "积木资产批量导入出错！",
          content: "未找到'添加'按钮，有疑问联系脚本作者。",
          type: "error"
        });
        return;
      }
      await sleep(config.delayBetweenSteps);
      const result = await fillRow2(row);
      if (!result) {
        Tips.alert({
          title: "积木资产批量导入出错！",
          content: "行填充出错，请确认提供的信息包含必填项\n并合理调整全局间隔时间，有疑问联系脚本作者。",
          type: "error"
        });
        return;
      }
    }
    Tips.message({
      text: "积木资产批量导入完成！",
      type: "success"
    });
  }
  const module_name$2 = "数据字典";
  function init$2() {
    registerModuleConfig({
      moduleName: module_name$2,
      configItems: [
        {
          name: "headerMap",
          type: "sequence",
          default: ["cnName", "dataValue", "enName", "order", "desc"],
          description: "表头顺序",
          valueMap: {
            cnName: "中文名称",
            dataValue: "数据值",
            enName: "英文名称",
            order: "排序",
            desc: "描述"
          }
        },
        {
          name: "autoOrder",
          type: "boolean",
          default: false,
          description: "自动生成排序"
        }
      ]
    });
  }
  function run$2() {
    const configItem = getModuleConfigItem(module_name$2, "headerMap");
    const columnMap = getModuleConfig(module_name$2)[
      "headerMap"
      /* headerMap */
    ];
    showEditableTable(
      {
        headers: columnMap.map((n) => configItem?.valueMap[n] ?? n),
        data: [[]],
        title: "批量录入数据字典"
      },
      (data) => {
        batchInsert(data);
      }
    );
  }
  function getModal() {
    return Array.from(document.querySelectorAll("div.ant-modal-content")).find((m) => {
      const title = m.querySelector("div.ant-modal-header > div.ant-modal-title");
      return title && title.textContent === "新增字典内容";
    });
  }
  function hasError() {
    const pop = getModal();
    if (!pop) return false;
    const outer = document.querySelector("div.ant-message-error");
    return !!pop.querySelector("div[role='alert']") || !!outer;
  }
  async function fillForm(row) {
    const pop = getModal();
    if (!pop) return false;
    const config = loadConfig();
    const inputs = pop.querySelectorAll("div.content input");
    await setReactInput(inputs[1], row.cnName || "");
    await sleep(config.delayBetweenSteps);
    await setReactInput(inputs[3], row.enName || "");
    await sleep(config.delayBetweenSteps);
    await setReactInput(inputs[4], row.dataValue || "");
    await sleep(config.delayBetweenSteps);
    await setReactInput(inputs[5], row.order || "");
    await sleep(config.delayBetweenSteps);
    await setReactInput(inputs[6], row.desc || "");
    await sleep(config.delayBetweenSteps);
    return true;
  }
  async function batchInsert(data) {
    const config = loadConfig();
    const model_config = getModuleConfig(module_name$2);
    for (let i = 0; i < data.length; i++) {
      if (model_config.autoOrder) {
        data[i].order = i;
      }
      if (!await fillForm(data[i])) {
        return;
      }
      const pop = getModal();
      if (!pop) return;
      const buttons = pop.querySelectorAll("button");
      if (i < data.length - 1) buttons[3].click();
      else buttons[2].click();
      await sleep(config.delayAfterSave);
      if (hasError()) {
        Tips.alert({
          title: "数据字典批量录入失败！",
          content: "请检查数据格式是否正确。",
          type: "error"
        });
        return;
      }
    }
    Tips.message({
      text: "数据字典批量录入成功！",
      type: "success"
    });
  }
  const module_name$1 = "页面资源";
  function init$1() {
    registerModuleConfig({
      moduleName: module_name$1,
      configItems: [
        {
          name: "autoFold",
          type: "boolean",
          default: true,
          description: "自动折叠页面组，保留当前选中的节点不折叠"
        }
      ]
    });
    const autoFold = getModuleConfig(module_name$1)["autoFold"];
    if (autoFold) {
      waitForElement(".ant-tree-treenode-leaf-last", 2e4).then(async () => {
        await sleep(500);
        await run$1();
      });
    }
  }
  async function run$1() {
    const protectedLis = getProtectedLis();
    for (let pass = 0; pass < 50; pass++) {
      const openLis = Array.from(document.querySelectorAll("div.ant-tree-treenode-switcher-open"));
      if (openLis.length === 0) break;
      let clicked = false;
      for (const li of openLis) {
        if (!protectedLis.has(li)) {
          const switcher = li.querySelector(".ant-tree-switcher_open");
          if (switcher) {
            dispatchClick(switcher);
            clicked = true;
          }
        }
      }
      if (!clicked) break;
      await sleep(50);
    }
  }
  function getLevel(li) {
    const indent = li.querySelector(".ant-tree-indent");
    return indent ? indent.querySelectorAll(".ant-tree-indent-unit").length : 0;
  }
  function getProtectedLis() {
    const protectedSet = /* @__PURE__ */ new Set();
    const nodes = Array.from(document.querySelectorAll("div.ant-tree-treenode"));
    const selected = nodes.find((n) => n.classList.contains("ant-tree-treenode-selected"));
    if (!selected) return protectedSet;
    protectedSet.add(selected);
    let selLevel = getLevel(selected);
    for (let i = nodes.indexOf(selected) - 1; i >= 0; i--) {
      const n = nodes[i];
      const level = getLevel(n);
      if (level < selLevel) {
        protectedSet.add(n);
        selLevel = level;
        if (level === 0) break;
      }
    }
    return protectedSet;
  }
  const module_name = "登录页面";
  const IMG_SELECTOR = "img.login-code-img";
  const LOGIN_BOX_SELECTOR = "div.loginBox";
  const DEBOUNCE_DELAY = 100;
  function init() {
    registerModuleConfig({
      moduleName: module_name,
      configItems: [
        {
          name: "autoFill",
          type: "boolean",
          default: true,
          description: "自动填写验证码"
        },
        {
          name: "OCR_API",
          type: "string",
          default: "http://server.lers.site:8001/ocr",
          description: "OCR API的地址"
        }
      ]
    });
    const autoFill = getModuleConfig(module_name)["autoFill"];
    if (autoFill) {
      waitForElement("div.loginBox", 2e4).then(async () => {
        await sleep(100);
        await observe();
      });
    }
  }
  async function run() {
    const img = document.querySelector(IMG_SELECTOR);
    if (!img) {
      Tips.message({
        text: "未找到验证码图片",
        type: "error"
      });
      return;
    }
    await solveAndFill(img);
  }
  async function observe() {
    const processImage = debounce((img) => {
      console.log("检测到验证码变化，防抖后开始识别...");
      solveAndFill(img);
    }, DEBOUNCE_DELAY);
    const observer = new MutationObserver((mutationsList) => {
      let imgToProcess = null;
      for (const mutation of mutationsList) {
        const img = mutation.target.matches(IMG_SELECTOR) ? mutation.target : document.querySelector(IMG_SELECTOR);
        if (mutation.type === "attributes" && mutation.attributeName === "src" && img?.src.startsWith("data:")) {
          imgToProcess = img;
          break;
        } else if (mutation.type === "childList" && img?.src.startsWith("data:")) {
          imgToProcess = img;
          break;
        }
      }
      if (imgToProcess) {
        processImage(imgToProcess);
      }
    });
    const loginBox = document.querySelector(LOGIN_BOX_SELECTOR);
    if (loginBox) {
      observer.observe(loginBox, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
      });
      console.log(`MutationObserver已附加到 ${LOGIN_BOX_SELECTOR}`);
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
      });
      console.warn(`${LOGIN_BOX_SELECTOR} 未找到，将监听整个 body。`);
    }
    const initialImg = document.querySelector(IMG_SELECTOR);
    if (initialImg?.src.startsWith("data:")) {
      console.log("页面加载完成，首次识别...");
      solveAndFill(initialImg);
    }
  }
  function convertToGrayscaleBase64(imgElement) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
          data[i] = data[i + 1] = data[i + 2] = grayscale;
        }
        ctx.putImageData(imageData, 0, 0);
        const grayscaleDataURI = canvas.toDataURL("image/png");
        resolve(extractBase64(grayscaleDataURI));
      };
      img.src = imgElement.src;
    });
  }
  function extractBase64(dataURI) {
    return dataURI.split(",")[1];
  }
  function requestOcrService(imgBase64) {
    const OCR_API = getModuleConfig(module_name)["OCR_API"];
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "POST",
        url: OCR_API,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({ image: imgBase64 }),
        onload: (response) => {
          try {
            const res = JSON.parse(response.responseText);
            if (res.success && res.data?.result) {
              console.log("OCR识别结果:", res.data.result);
              resolve(res.data.result);
            } else {
              reject("OCR服务返回结果不包含有效的识别文本或请求失败。");
            }
          } catch (e) {
            reject("解析OCR服务响应失败: " + e);
          }
        },
        onerror: (error) => {
          reject("请求OCR服务失败: " + error.status);
        }
      });
    });
  }
  async function solveAndFill(imgElement) {
    try {
      const grayscaleBase64 = await convertToGrayscaleBase64(imgElement);
      const expression = await requestOcrService(grayscaleBase64);
      const cleanedExpression = expression.replace(/[=？?]/g, "").replace(/[x×]/g, "*").replace(/ /g, "");
      let result;
      try {
        const calculate = new Function("return " + cleanedExpression);
        const calculatedResult = calculate();
        if (typeof calculatedResult !== "number" || isNaN(calculatedResult)) {
          throw new Error("计算结果不是合法数字");
        }
        result = calculatedResult;
        console.log(`计算结果: ${cleanedExpression} = ${result}`);
      } catch (evalError) {
        Tips.message({
          text: "识别结果可能不是算术表达式，直接填写原始结果: " + expression,
          type: "error"
        });
        result = expression;
      }
      const inputElement = document.querySelector("div.login-code")?.parentElement?.querySelector("input");
      if (inputElement) {
        inputElement.value = String(result);
        ["input", "change"].forEach((eventType) => {
          const event = new Event(eventType, { bubbles: true });
          inputElement.dispatchEvent(event);
        });
        Tips.message({
          text: "已自动填写验证码",
          type: "success",
          duration: 1e3
        });
      } else {
        Tips.message({
          text: "未找到验证码输入框",
          type: "error"
        });
      }
    } catch (error) {
      Tips.alert({
        title: "自动填写验证码失败",
        content: error,
        type: "error"
      });
    }
  }
  (function() {
    if (isInIframe()) {
      return;
    }
    const moduleManager = ModuleManager.getInstance();
    moduleManager.registerModule({
      moduleName: "积木资产",
      urlPattern: "/micro/data/asset",
      init: init$3,
      menuItems: [
        {
          label: "积木资产",
          children: [
            { label: "导入CSV", action: () => run$3(importType.csv) },
            { label: "粘贴数据导入", action: () => run$3(importType.paste) }
          ]
        }
      ]
    });
    moduleManager.registerModule({
      moduleName: "数据字典",
      urlPattern: "/app/edit",
      init: init$2,
      menuItems: [
        {
          label: "数据字典",
          children: [
            { label: "粘贴数据导入", action: () => run$2() }
          ]
        }
      ]
    });
    moduleManager.registerModule({
      moduleName: "页面资源",
      urlPattern: "/app/edit",
      init: init$1,
      menuItems: [
        {
          label: "页面资源",
          children: [
            { label: "折叠页面组", action: () => run$1() }
          ]
        }
      ]
    });
    moduleManager.registerModule({
      moduleName: "登录页面",
      urlPattern: "/login",
      init,
      menuItems: [
        {
          label: "登录页面",
          children: [
            { label: "填写验证码", action: () => run() }
          ]
        }
      ]
    });
    moduleManager.registerModule({
      moduleName: "配置",
      urlPattern: new RegExp(".*"),
      // 匹配所有URL
      init: () => {
      },
      // 空初始化函数
      menuItems: [
        {
          label: "配置",
          children: [
            { label: "打开配置面板", action: showConfigPanel }
          ]
        }
      ]
    });
    moduleManager.matchModules();
    new FloatingMenu(moduleManager.getMatchedMenuItems());
    window.addEventListener("popstate", () => {
      moduleManager.refreshModules();
      if (!isInIframe()) {
        new FloatingMenu(moduleManager.getMatchedMenuItems());
      }
    });
  })();

})();