// ==UserScript==
// @name         自定义高亮助手
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  自定义多个高亮词和样式，自动高亮当前网页所有匹配内容
// @author       You
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561353/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%AB%98%E4%BA%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561353/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%AB%98%E4%BA%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "__custom_highlighter_rules__";
  const POSITION_STORAGE_KEY = "__custom_highlighter_position__";
  const VISIBILITY_STORAGE_KEY = "__custom_highlighter_visibility__";

  // 默认样式
  const defaultStyle = {
    backgroundColor: "#ffe58f",
    color: "#d4380d",
    fontWeight: "bold",
    textDecoration: "none",
  };

  // 全局变量：跟踪高亮元素和当前索引
  let highlightElements = [];
  let currentHighlightIndex = -1;

  // 读取配置
  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { rules: [], style: defaultStyle, enabled: true };
      const parsed = JSON.parse(raw);
      return {
        rules: Array.isArray(parsed.rules) ? parsed.rules : [],
        style: { ...defaultStyle, ...(parsed.style || {}) },
        enabled: parsed.enabled !== false,
      };
    } catch (e) {
      console.error("高亮助手：读取配置失败", e);
      return { rules: [], style: defaultStyle, enabled: true };
    }
  }

  // 保存配置
  function saveConfig(cfg) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rules: cfg.rules || [],
        style: cfg.style || defaultStyle,
        enabled: cfg.enabled !== false,
      })
    );
  }

  // 保存面板位置
  function savePanelPosition(left, top) {
    try {
      localStorage.setItem(
        POSITION_STORAGE_KEY,
        JSON.stringify({ left, top })
      );
    } catch (e) {
      console.error("高亮助手：保存位置失败", e);
    }
  }

  // 读取面板位置
  function loadPanelPosition() {
    try {
      const raw = localStorage.getItem(POSITION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.left !== undefined && parsed.top !== undefined) {
        return { left: parsed.left, top: parsed.top };
      }
      return null;
    } catch (e) {
      console.error("高亮助手：读取位置失败", e);
      return null;
    }
  }

  // 保存面板可见性
  function saveVisibilityState(isHidden) {
    try {
      localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify({ hidden: isHidden }));
    } catch (e) {
      console.error("高亮助手：保存可见性失败", e);
    }
  }

  // 读取面板可见性
  function loadVisibilityState() {
    try {
      const raw = localStorage.getItem(VISIBILITY_STORAGE_KEY);
      if (!raw) return false; // 默认不隐藏
      const parsed = JSON.parse(raw);
      return !!parsed.hidden;
    } catch (e) {
      console.error("高亮助手：读取可见性失败", e);
      return false;
    }
  }

  // 注入全局样式（包含暗黑模式支持）
  function addGlobalStyle() {
    if (document.getElementById("custom-highlighter-css")) return;
    const css = `
      #custom-highlighter-panel {
        --ch-bg: #ffffff;
        --ch-text: #262626;
        --ch-border: #d9d9d9;
        --ch-shadow: rgba(0,0,0,0.15);
        --ch-header-bg: #fafafa;
        --ch-header-btn-hover: rgba(0,0,0,0.05);
        --ch-divider: #f0f0f0;
        --ch-label: #8c8c8c;
        --ch-input-bg: #ffffff;
        --ch-input-text: #262626;
        --ch-input-border: #d9d9d9;
        --ch-btn-default-bg: #f5f5f5;
        --ch-btn-default-text: #595959;
        --ch-btn-primary-bg: #1677ff;
        --ch-btn-primary-text: #fff;
        --ch-desc: #bfbfbf;
      }
      @media (prefers-color-scheme: dark) {
        #custom-highlighter-panel {
          --ch-bg: #1f1f1f;
          --ch-text: #e0e0e0;
          --ch-border: #424242;
          --ch-shadow: rgba(0,0,0,0.4);
          --ch-header-bg: #2a2a2a;
          --ch-header-btn-hover: rgba(255,255,255,0.1);
          --ch-divider: #333333;
          --ch-label: #a0a0a0;
          --ch-input-bg: #2a2a2a;
          --ch-input-text: #e0e0e0;
          --ch-input-border: #424242;
          --ch-btn-default-bg: #333333;
          --ch-btn-default-text: #cccccc;
          --ch-btn-primary-bg: #177ddc;
          --ch-btn-primary-text: #fff;
          --ch-desc: #666666;
        }
        #custom-highlighter-panel input[type="checkbox"] {
          accent-color: var(--ch-btn-primary-bg);
        }
      }
    `;
    const style = document.createElement("style");
    style.id = "custom-highlighter-css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 创建控制面板
  function createPanel(cfg, applyHighlight) {
    addGlobalStyle();
    const panel = document.createElement("div");
    panel.id = "custom-highlighter-panel";
    panel.style.cssText = [
      "position:fixed",
      "top:10px",
      "right:10px",
      "z-index:999999",
      "background:var(--ch-bg)",
      "border:1px solid var(--ch-border)",
      "box-shadow:0 2px 8px var(--ch-shadow)",
      "border-radius:4px",
      "font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
      "font-size:12px",
      "color:var(--ch-text)",
      "max-width:320px",
      "max-height:80vh",
      "overflow:hidden",
      "transition: background 0.3s, color 0.3s, border-color 0.3s",
    ].join(";");

    panel.innerHTML = `
      <div id="ch-header" style="display:flex;align-items:center;justify-content:space-between;padding:3px 6px;background:var(--ch-header-bg);cursor:pointer;transition: background 0.3s;">
        <div style="display:flex;align-items:center;gap:4px;">
          <span id="ch-title" style="font-weight:600;font-size:11px;white-space:nowrap;">高亮</span>
          <label style="display:inline-flex;align-items:center;cursor:pointer;" onclick="event.stopPropagation();" title="启用/禁用">
            <input type="checkbox" id="ch-toggle-enabled" style="margin:0;width:12px;height:12px;cursor:pointer;" ${cfg.enabled ? "checked" : ""} />
          </label>
        </div>
        <div style="display:flex;align-items:center;gap:2px;">
          <button id="ch-hide-btn" style="border:none;background:transparent;color:var(--ch-text);cursor:pointer;font-size:12px;line-height:1;padding:0 2px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;opacity:0.6;" title="隐藏面板 (Ctrl+Shift+F)">👁</button>
          <button id="ch-toggle-btn" style="border:none;background:transparent;color:var(--ch-text);cursor:pointer;font-size:10px;line-height:1;padding:0 2px;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">▼</button>
        </div>
      </div>
      <div id="ch-body" style="display:none;padding:8px 10px;flex-direction:column;gap:8px;border-top:1px solid var(--ch-divider);">
        <div>
          <div style="margin-bottom:4px;font-size:11px;color:var(--ch-label);">高亮词（用逗号或空格分隔）：</div>
          <textarea id="ch-words" rows="2" style="width:100%;box-sizing:border-box;font-size:12px;padding:4px 6px;border-radius:4px;border:1px solid var(--ch-input-border);background:var(--ch-input-bg);color:var(--ch-input-text);resize:vertical;"></textarea>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
          <label style="font-size:11px;color:var(--ch-label);">背景色</label>
          <input type="color" id="ch-bg" style="width:32px;height:18px;padding:0;border:none;background:none;"/>
          <label style="font-size:11px;color:var(--ch-label);">文字色</label>
          <input type="color" id="ch-fg" style="width:32px;height:18px;padding:0;border:none;background:none;"/>
          <label style="font-size:11px;color:var(--ch-label);">加粗</label>
          <input type="checkbox" id="ch-bold"/>
          <label style="font-size:11px;color:var(--ch-label);">下划线</label>
          <input type="checkbox" id="ch-underline"/>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <button id="ch-apply-btn" style="flex:1;border:none;background:var(--ch-btn-primary-bg);color:var(--ch-btn-primary-text);border-radius:4px;padding:4px 0;font-size:12px;cursor:pointer;">应用高亮</button>
          <button id="ch-clear-btn" style="border:none;background:var(--ch-btn-default-bg);color:var(--ch-btn-default-text);border-radius:4px;padding:4px 8px;font-size:12px;cursor:pointer;">清空高亮</button>
        </div>
        <div id="ch-navigation" style="display:none;flex-direction:column;gap:6px;padding-top:6px;border-top:1px solid var(--ch-divider);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <button id="ch-prev-btn" style="flex:1;border:none;background:var(--ch-btn-default-bg);color:var(--ch-btn-default-text);border-radius:4px;padding:4px 0;font-size:12px;cursor:pointer;disabled:true;">上一个</button>
            <span id="ch-counter" style="font-size:11px;color:var(--ch-label);min-width:50px;text-align:center;">0/0</span>
            <button id="ch-next-btn" style="flex:1;border:none;background:var(--ch-btn-primary-bg);color:var(--ch-btn-primary-text);border-radius:4px;padding:4px 0;font-size:12px;cursor:pointer;disabled:true;">下一个</button>
          </div>
        </div>
        <div style="font-size:11px;color:var(--ch-desc);">说明：配置会保存在本地，对所有网站生效。</div>
      </div>
    `;

    // 初始化可见性
    if (loadVisibilityState()) {
      panel.style.display = "none";
    }

    document.body.appendChild(panel);

    // 恢复保存的位置，并进行边界检查
    const savedPosition = loadPanelPosition();
    if (savedPosition) {
      // 先设置位置
      panel.style.left = savedPosition.left + "px";
      panel.style.top = savedPosition.top + "px";
      panel.style.right = "auto";

      // 延迟进行边界检查，确保面板已完全渲染
      setTimeout(() => {
        const panelRect = panel.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 边界检查：确保面板在屏幕可见范围内
        let left = parseInt(panel.style.left) || savedPosition.left;
        let top = parseInt(panel.style.top) || savedPosition.top;
        let needUpdate = false;

        // 如果面板超出右边界，调整到右边界
        if (left + panelRect.width > windowWidth) {
          left = windowWidth - panelRect.width - 10;
          needUpdate = true;
        }
        // 如果面板超出左边界，调整到左边界
        if (left < 0) {
          left = 10;
          needUpdate = true;
        }
        // 如果面板超出下边界，调整到下边界
        if (top + panelRect.height > windowHeight) {
          top = windowHeight - panelRect.height - 10;
          needUpdate = true;
        }
        // 如果面板超出上边界，调整到上边界
        if (top < 0) {
          top = 10;
          needUpdate = true;
        }

        if (needUpdate) {
          panel.style.left = left + "px";
          panel.style.top = top + "px";
          savePanelPosition(left, top);
        }
      }, 50);
    }

    // 拖动
    (function makeDraggable() {
      const header = panel.querySelector("#ch-header");
      let isDown = false;
      let offsetX = 0;
      let offsetY = 0;

      header.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.tagName === "LABEL") return;
        isDown = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      function onMove(e) {
        if (!isDown) return;
        panel.style.left = e.clientX - offsetX + "px";
        panel.style.top = e.clientY - offsetY + "px";
        panel.style.right = "auto";
      }

      function onUp() {
        if (isDown) {
          // 保存位置
          const left = panel.offsetLeft;
          const top = panel.offsetTop;
          savePanelPosition(left, top);
        }
        isDown = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
    })();

    // 初始化表单
    const wordsInput = panel.querySelector("#ch-words");
    const bgInput = panel.querySelector("#ch-bg");
    const fgInput = panel.querySelector("#ch-fg");
    const boldInput = panel.querySelector("#ch-bold");
    const underlineInput = panel.querySelector("#ch-underline");
    const applyBtn = panel.querySelector("#ch-apply-btn");
    const clearBtn = panel.querySelector("#ch-clear-btn");
    const toggleBtn = panel.querySelector("#ch-toggle-btn");
    const bodyEl = panel.querySelector("#ch-body");
    const headerEl = panel.querySelector("#ch-header");
    const toggleInput = panel.querySelector("#ch-toggle-enabled");
    const nextBtn = panel.querySelector("#ch-next-btn");
    const prevBtn = panel.querySelector("#ch-prev-btn");
    const hideBtn = panel.querySelector("#ch-hide-btn");

    wordsInput.value = cfg.rules.join(", ");
    bgInput.value = rgbToHex(cfg.style.backgroundColor || defaultStyle.backgroundColor);
    fgInput.value = rgbToHex(cfg.style.color || defaultStyle.color);
    boldInput.checked = (cfg.style.fontWeight || defaultStyle.fontWeight) === "bold";
    underlineInput.checked = (cfg.style.textDecoration || defaultStyle.textDecoration) === "underline";

    // 收起/展开功能（默认收起）
    let isExpanded = false;
    const titleEl = panel.querySelector("#ch-title");
    function togglePanel() {
      isExpanded = !isExpanded;
      bodyEl.style.display = isExpanded ? "flex" : "none";
      toggleBtn.textContent = isExpanded ? "▲" : "▼";
      if (isExpanded) {
        headerEl.style.borderBottom = "1px solid var(--ch-divider)";
        headerEl.style.padding = "6px 10px";
        titleEl.textContent = "高亮助手";
        titleEl.style.fontSize = "12px";
        panel.style.minWidth = "260px";
      } else {
        headerEl.style.borderBottom = "none";
        headerEl.style.padding = "3px 6px";
        titleEl.textContent = "高亮";
        titleEl.style.fontSize = "11px";
        panel.style.minWidth = "auto";
      }
    }

    // 点击标题栏或切换按钮展开/收起
    headerEl.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON" && e.target.id !== "ch-toggle-btn") return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "LABEL") return;
      togglePanel();
    });

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePanel();
    });

    // 隐藏面板功能
    function hidePanel() {
      panel.style.display = "none";
      saveVisibilityState(true);
    }

    function showPanel() {
      panel.style.display = "block";
      saveVisibilityState(false);
    }

    function togglePanelVisibility() {
      if (panel.style.display === "none") {
        showPanel();
      } else {
        hidePanel();
      }
    }

    // 绑定隐藏按钮事件
    if (hideBtn) {
      hideBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hidePanel();
      });

      // 鼠标悬停效果
      hideBtn.addEventListener("mouseenter", () => {
        hideBtn.style.opacity = "1";
      });
      hideBtn.addEventListener("mouseleave", () => {
        hideBtn.style.opacity = "0.6";
      });
    }

    // 将显示/隐藏函数暴露给外部使用
    panel.showPanel = showPanel;
    panel.hidePanel = hidePanel;
    panel.togglePanelVisibility = togglePanelVisibility;

    applyBtn.addEventListener("click", () => {
      const words = parseWords(wordsInput.value);
      const newCfg = {
        rules: words,
        style: {
          backgroundColor: bgInput.value || defaultStyle.backgroundColor,
          color: fgInput.value || defaultStyle.color,
          fontWeight: boldInput.checked ? "bold" : "normal",
          textDecoration: underlineInput.checked ? "underline" : "none",
        },
        enabled: toggleInput.checked,
      };
      saveConfig(newCfg);
      removeExistingHighlights();
      if (newCfg.enabled) applyHighlight(newCfg);
    });

    clearBtn.addEventListener("click", () => {
      wordsInput.value = "";
      saveConfig({ rules: [], style: cfg.style, enabled: cfg.enabled });
      removeExistingHighlights();
      highlightElements = [];
      currentHighlightIndex = -1;
      updateNavigationUI();
    });

    // 绑定导航按钮事件
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) navigateToNext();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) navigateToPrev();
      });
    }

    toggleInput.addEventListener("change", () => {
      const current = loadConfig();
      current.enabled = toggleInput.checked;
      saveConfig(current);
      removeExistingHighlights();
      if (current.enabled) {
        applyHighlight(current);
      } else {
        highlightElements = [];
        currentHighlightIndex = -1;
        updateNavigationUI();
      }
    });

    return panel;
  }

  function parseWords(text) {
    return text
      .split(/[,;\s]+/)
      .map((w) => w.trim())
      .filter((w, idx, arr) => w && arr.indexOf(w) === idx);
  }

  // 移除已有高亮
  function removeExistingHighlights() {
    const marked = document.querySelectorAll("span.__custom_highlighted__");
    marked.forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(span.textContent || ""), span);
      parent.normalize();
    });
  }

  // 转换 rgb/rgba/hex 为 hex
  function rgbToHex(color) {
    if (!color) return "#000000";
    if (color.startsWith("#")) {
      if (color.length === 4) {
        return (
          "#" +
          color[1] +
          color[1] +
          color[2] +
          color[2] +
          color[3] +
          color[3]
        );
      }
      return color.slice(0, 7);
    }
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return "#000000";
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const h = x.toString(16);
          return h.length === 1 ? "0" + h : h;
        })
        .join("")
    );
  }

  // 核心：高亮函数
  function applyHighlightToDocument(cfg) {
    if (!cfg.rules.length) {
      highlightElements = [];
      currentHighlightIndex = -1;
      updateNavigationUI();
      return;
    }

    const patterns = cfg.rules.map((w) => escapeRegExp(w));
    const regex = new RegExp("(" + patterns.join("|") + ")", "gi");

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.nodeName.toLowerCase();
          if (["script", "style", "noscript", "textarea", "input"].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest && parent.closest("script,style,noscript,textarea,input")) {
            return NodeFilter.FILTER_REJECT;
          }
          return regex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );

    const toProcess = [];
    let current;
    while ((current = walker.nextNode())) {
      toProcess.push(current);
    }

    // 重置高亮元素数组
    highlightElements = [];
    let highlightIndex = 0;

    toProcess.forEach((textNode) => {
      const frag = document.createDocumentFragment();
      let remaining = textNode.nodeValue;
      let match;
      regex.lastIndex = 0;

      while ((match = regex.exec(remaining))) {
        const before = remaining.slice(0, match.index);
        if (before) frag.appendChild(document.createTextNode(before));

        const span = document.createElement("span");
        span.className = "__custom_highlighted__";
        span.setAttribute("data-highlight-index", highlightIndex);
        span.textContent = match[0];
        span.style.backgroundColor = cfg.style.backgroundColor || defaultStyle.backgroundColor;
        span.style.color = cfg.style.color || defaultStyle.color;
        span.style.fontWeight = cfg.style.fontWeight || defaultStyle.fontWeight;
        span.style.textDecoration = cfg.style.textDecoration || defaultStyle.textDecoration;
        span.style.borderRadius = "2px";
        span.style.padding = "0 1px";

        frag.appendChild(span);
        highlightElements.push(span);
        highlightIndex++;

        remaining = remaining.slice(match.index + match[0].length);
        regex.lastIndex = 0;
      }

      if (remaining) {
        frag.appendChild(document.createTextNode(remaining));
      }

      textNode.parentNode.replaceChild(frag, textNode);
    });

    // 重置当前索引并更新导航UI
    currentHighlightIndex = highlightElements.length > 0 ? 0 : -1;
    updateNavigationUI();

    // 如果有高亮元素，自动滚动到第一个并高亮显示
    if (highlightElements.length > 0) {
      setTimeout(() => {
        scrollToHighlight(0);
      }, 50);
    }
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // 更新导航UI
  function updateNavigationUI() {
    const navEl = document.querySelector("#ch-navigation");
    const counterEl = document.querySelector("#ch-counter");
    const prevBtn = document.querySelector("#ch-prev-btn");
    const nextBtn = document.querySelector("#ch-next-btn");

    if (!navEl || !counterEl || !prevBtn || !nextBtn) return;

    const total = highlightElements.length;
    const current = currentHighlightIndex + 1;

    if (total > 0) {
      navEl.style.display = "flex";
      counterEl.textContent = `${current}/${total}`;
      prevBtn.disabled = currentHighlightIndex <= 0;
      nextBtn.disabled = currentHighlightIndex >= total - 1;

      // 更新按钮样式
      prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
      prevBtn.style.cursor = prevBtn.disabled ? "not-allowed" : "pointer";
      nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
      nextBtn.style.cursor = nextBtn.disabled ? "not-allowed" : "pointer";
    } else {
      navEl.style.display = "none";
    }
  }

  // 滚动到指定高亮位置
  function scrollToHighlight(index) {
    if (index < 0 || index >= highlightElements.length) return;

    const element = highlightElements[index];
    if (!element) return;

    // 移除之前的当前高亮样式
    highlightElements.forEach((el, idx) => {
      if (idx === currentHighlightIndex) {
        el.style.outline = "";
        el.style.outlineOffset = "";
      }
    });

    // 更新当前索引
    currentHighlightIndex = index;

    // 添加当前高亮样式
    element.style.outline = "2px solid #1677ff";
    element.style.outlineOffset = "2px";

    // 滚动到元素位置
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });

    // 更新导航UI
    updateNavigationUI();
  }

  // 导航到下一个高亮
  function navigateToNext() {
    if (currentHighlightIndex < highlightElements.length - 1) {
      scrollToHighlight(currentHighlightIndex + 1);
    }
  }

  // 导航到上一个高亮
  function navigateToPrev() {
    if (currentHighlightIndex > 0) {
      scrollToHighlight(currentHighlightIndex - 1);
    }
  }

  // 添加键盘快捷键（Alt+H 和 Ctrl+Shift+F 打开/关闭面板）
  function setupHotkey(panel, cfg, applyHighlight) {
    document.addEventListener("keydown", (e) => {
      // Ctrl+Shift+F 快捷键
      if (e.ctrlKey && e.shiftKey && (e.key === "f" || e.key === "F")) {
        // 检查是否在输入框中，如果是则不触发
        const activeElement = document.activeElement;
        const isInput = activeElement && (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable
        );

        if (!isInput) {
          e.preventDefault();
          if (panel && panel.togglePanelVisibility) {
            panel.togglePanelVisibility();
            // 如果面板显示，自动展开
            if (panel.style.display !== "none") {
              const bodyEl = panel.querySelector("#ch-body");
              const toggleBtn = panel.querySelector("#ch-toggle-btn");
              const headerEl = panel.querySelector("#ch-header");
              if (bodyEl && bodyEl.style.display === "none") {
                bodyEl.style.display = "flex";
                toggleBtn.textContent = "▲";
                headerEl.style.borderBottom = "1px solid var(--ch-divider)";
              }
            }
          }
        }
      }

      // Alt+H 快捷键（保留原有功能）
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        // 检查是否在输入框中，如果是则不触发
        const activeElement = document.activeElement;
        const isInput = activeElement && (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable
        );

        if (!isInput) {
          e.preventDefault();
          if (panel && panel.togglePanelVisibility) {
            panel.togglePanelVisibility();
            // 如果面板显示，自动展开
            if (panel.style.display !== "none") {
              const bodyEl = panel.querySelector("#ch-body");
              const toggleBtn = panel.querySelector("#ch-toggle-btn");
              const headerEl = panel.querySelector("#ch-header");
              if (bodyEl && bodyEl.style.display === "none") {
                bodyEl.style.display = "flex";
                toggleBtn.textContent = "▲";
                headerEl.style.borderBottom = "1px solid #f0f0f0";
              }
            }
          }
        }
      }
    });
  }

  function init() {
    // 检测是否在iframe中，如果是则只应用高亮，不创建面板
    const isInIframe = window.self !== window.top;

    const cfg = loadConfig();

    // 只在主窗口中创建面板，避免多个iframe重复创建
    let panel = null;
    if (!isInIframe) {
      panel = createPanel(cfg, applyHighlightToDocument);
      setupHotkey(panel, cfg, applyHighlightToDocument);
    }

    // 页面加载完成后，如果已经配置了高亮词，则自动高亮一次
    // 无论是否在iframe中，都应用高亮效果
    // 延迟一下确保面板元素已创建
    setTimeout(() => {
      const latestCfg = loadConfig();
      if (latestCfg.rules && latestCfg.rules.length > 0 && latestCfg.enabled !== false) {
        applyHighlightToDocument(latestCfg);
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


