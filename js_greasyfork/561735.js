// ==UserScript==
// @name         Linux.do 帖子导出 Pro（超级版：范围/主题/离线/AI/搜索/目录/暂停/兜底下载）
// @namespace    https://linux.do/
// @version      2.1.0
// @description  导出 Linux.do 帖子为离线 HTML（离线图片/头像、目录、搜索、过滤、主题切换、快捷键、暂停/继续）与发给 AI 的高质量纯文本，并带 GM_download + 兜底下载按钮
// @author       LD Export
// @match        https://linux.do/t/*
// @match        https://linux.do/t/topic/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561735/Linuxdo%20%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%20Pro%EF%BC%88%E8%B6%85%E7%BA%A7%E7%89%88%EF%BC%9A%E8%8C%83%E5%9B%B4%E4%B8%BB%E9%A2%98%E7%A6%BB%E7%BA%BFAI%E6%90%9C%E7%B4%A2%E7%9B%AE%E5%BD%95%E6%9A%82%E5%81%9C%E5%85%9C%E5%BA%95%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561735/Linuxdo%20%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%20Pro%EF%BC%88%E8%B6%85%E7%BA%A7%E7%89%88%EF%BC%9A%E8%8C%83%E5%9B%B4%E4%B8%BB%E9%A2%98%E7%A6%BB%E7%BA%BFAI%E6%90%9C%E7%B4%A2%E7%9B%AE%E5%BD%95%E6%9A%82%E5%81%9C%E5%85%9C%E5%BA%95%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -----------------------
  // 存储 key
  // -----------------------
  const K = {
    OFFLINE: "ld_export_offline",
    CONCURRENCY: "ld_export_concurrency",
    RANGE_MODE: "ld_export_range_mode", // "all" | "range"
    RANGE_START: "ld_export_range_start",
    RANGE_END: "ld_export_range_end",
    HTML_THEME: "ld_export_html_theme", // "auto" | "dark" | "light"
    FILTER_ONLY_OP: "ld_export_filter_only_op",
    FILTER_ONLY_IMG: "ld_export_filter_only_img",
    FILTER_USERS: "ld_export_filter_users",
    FILTER_INCLUDE: "ld_export_filter_include",
    FILTER_EXCLUDE: "ld_export_filter_exclude",
    FILTER_MINLEN: "ld_export_filter_minlen",
    AI_HEADER: "ld_export_ai_header",
    AI_IMAGES: "ld_export_ai_images",
    AI_QUOTES: "ld_export_ai_quotes",
    AI_MAXCHARS: "ld_export_ai_maxchars",
    AI_MAXPOSTS: "ld_export_ai_maxposts",
    PANEL_COLLAPSED: "ld_export_panel_collapsed",
    ADVANCED_OPEN: "ld_export_panel_advanced_open",
  };

  const DEFAULTS = {
    offline: true,
    concurrency: 3,
    rangeMode: "all",
    rangeStart: 1,
    rangeEnd: 999999,
    htmlTheme: "auto",
    onlyOp: false,
    onlyImg: false,
    users: "",
    include: "",
    exclude: "",
    minLen: 0,
    aiHeader: true,
    aiImages: true,
    aiQuotes: true,
    aiMaxChars: 0, // 0 表示不限制
    aiMaxPosts: 0, // 0 表示不限制
  };

  // -----------------------
  // 工具函数
  // -----------------------
  function getTopicId() {
    const m =
      window.location.pathname.match(/\/topic\/(\d+)/) ||
      window.location.pathname.match(/\/t\/[^/]+\/(\d+)/);
    return m ? m[1] : null;
  }

  function absoluteUrl(src) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("//")) return window.location.protocol + src;
    if (src.startsWith("/")) return window.location.origin + src;
    return window.location.origin + "/" + src.replace(/^\.?\//, "");
  }

  // 下载辅助：优先 GM_download，并把 blob URL 交给面板做“兜底下载”
  function downloadFile(content, filename, type) {
    // 统一的下载方法：
    // 1. 创建 Blob + blob URL；
    // 2. 把 URL 挂到面板兜底按钮上；
    // 3. 优先使用 GM_download；
    // 4. GM_download 失败则自动回退到 <a download>。
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    try {
      if (typeof ui !== "undefined" && ui && typeof ui.setDownloadFallback === "function") {
        ui.setDownloadFallback(url, filename);
      }
    } catch (e) {
      console.warn("设置兜底下载状态失败（不影响主流程）：", e);
    }

    let usedGm = false;
    try {
      if (typeof GM_download === "function") {
        usedGm = true;
        GM_download({
          url,
          name: filename,
          saveAs: false,
          onerror: function (err) {
            console.warn("GM_download 失败，回退到 <a download> 方式：", err);
            try {
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } catch (e2) {
              console.error("fallback <a download> 也失败了：", e2);
            }
          },
        });
      }
    } catch (e) {
      console.warn("调用 GM_download 异常，将使用 <a download>：", e);
      usedGm = false;
    }

    if (!usedGm) {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error("自动触发 <a download> 失败：", e);
      }
    }

    // 注意：不要在这里 revokeObjectURL
    // 兜底按钮还要继续用这个 URL，下一次导出时会自动回收旧 URL
  }

  function clampInt(n, min, max, fallback) {
    const x = parseInt(String(n), 10);
    if (Number.isNaN(x)) return fallback;
    return Math.max(min, Math.min(max, x));
  }

  function normalizeListInput(s) {
    return (s || "")
      .split(/[\s,，;；]+/g)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function decodeEntities(str) {
    const el = document.createElement("textarea");
    el.innerHTML = str || "";
    return el.value;
  }

  function safeText(s) {
    return (s ?? "").toString();
  }

  function escapeHtml(s) {
    return safeText(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeFilenamePart(s, maxLen = 80) {
    let t = safeText(s).trim();
    if (!t) return "untitled";
    // 去掉 Windows/macOS/Linux 都容易出问题的字符
    t = t.replace(/[\\\/:*?"<>|]/g, " ");
    t = t.replace(/[\u0000-\u001f]/g, " ");
    t = t.replace(/\s+/g, " ").trim();
    t = t.replace(/[. ]+$/g, ""); // 避免结尾是点/空格（Windows 不友好）
    t = t.replace(/ /g, "_"); // 空格改成下划线更稳
    if (t.length > maxLen) t = t.slice(0, maxLen).replace(/_+$/g, "");
    return t || "untitled";
  }


  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // -----------------------
  // DOM -> AI Text（更“喂模型友好”）
  // -----------------------
  function cookedToAiText(cookedHtml, opts) {
    const { includeImages, includeQuotes } = opts;

    const parser = new DOMParser();
    const doc = parser.parseFromString(cookedHtml || "", "text/html");
    const root = doc.body;

    function serialize(node, inPre = false) {
      if (!node) return "";
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";

      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const el = /** @type {HTMLElement} */ (node);
      const tag = el.tagName.toLowerCase();

      if (tag === "br") return "\n";

      if (tag === "img") {
        if (!includeImages) return "";
        const src = el.getAttribute("src") || el.getAttribute("data-src") || "";
        const full = absoluteUrl(src);
        if (!full) return "";
        return `\n[图片] ${full}\n`;
      }

      // Discourse 常见：a.lightbox 包 img
      if (tag === "a") {
        const hasImg = el.querySelector("img");
        const href = el.getAttribute("href") || "";
        if (hasImg) {
          // 图片交给 img 分支输出
          return Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
        }
        const text = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
        const link = absoluteUrl(href);
        if (!link) return text;
        if (!text) return link;
        // 避免重复
        if (text === link) return text;
        return `${text}（${link}）`;
      }

      if (tag === "pre") {
        const codeEl = el.querySelector("code");
        const langClass = codeEl?.getAttribute("class") || "";
        const lang = (langClass.match(/lang(?:uage)?-([a-z0-9_+-]+)/i) || [])[1] || "";
        const code = (codeEl ? codeEl.textContent : el.textContent) || "";
        return `\n\`\`\`${lang}\n${code.replace(/\n+$/g, "")}\n\`\`\`\n\n`;
      }

      if (tag === "code") {
        if (inPre) return el.textContent || "";
        const t = (el.textContent || "").replace(/\n/g, " ");
        return t ? `\`${t}\`` : "";
      }

      if (tag === "blockquote") {
        if (!includeQuotes) {
          // 不要引用：只保留一句“(引用已省略)”
          const inner = (el.textContent || "").trim();
          return inner ? "\n(引用已省略)\n" : "";
        }
        const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
        return `\n【引用开始】\n${inner.trim()}\n【引用结束】\n\n`;
      }

      if (/^h[1-6]$/.test(tag)) {
        const inner = (el.textContent || "").trim();
        return inner ? `\n${inner}\n\n` : "";
      }

      if (tag === "li") {
        const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
        return inner ? `- ${inner}\n` : "";
      }

      if (tag === "ul" || tag === "ol") {
        const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
        return `\n${inner}\n`;
      }

      if (tag === "p") {
        const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
        return inner ? `${inner}\n\n` : "\n";
      }

      // 默认：递归子节点
      const nextInPre = inPre || tag === "pre";
      return Array.from(el.childNodes).map((c) => serialize(c, nextInPre)).join("");
    }

    let text = Array.from(root.childNodes).map((n) => serialize(n, false)).join("");

    // 解实体 + 规整空行
    text = decodeEntities(text);
    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/[ \t]+\n/g, "\n");
    text = text.replace(/\n{3,}/g, "\n\n").trim();

    return text;
  }

  // -----------------------
  // Panel UI
  // -----------------------
  const ui = {
    container: null,
    progressBar: null,
    progressText: null,
    statusText: null,
    btnHtml: null,
    btnStop: null,
    btnPause: null,
    btnAi: null,

    chkOffline: null,
    inputConcurrency: null,
    labelConcurrencyValue: null,

    selRangeMode: null,
    inputRangeStart: null,
    inputRangeEnd: null,

    selTheme: null,

    // advanced
    advancedWrap: null,
    chkOnlyOp: null,
    chkOnlyImg: null,
    inputUsers: null,
    inputInclude: null,
    inputExclude: null,
    inputMinLen: null,

    chkAiHeader: null,
    chkAiImages: null,
    chkAiQuotes: null,
    inputAiMaxChars: null,
    inputAiMaxPosts: null,

    // 下载兜底
    fallbackWrap: null,
    fallbackBtn: null,
    fallbackUrl: "",
    fallbackName: "",

    init() {
      if (this.container) return;

      const wrap = document.createElement("div");
      wrap.id = "ld-export-pro-panel";
      wrap.style.cssText = `
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 999999;
        width: min(360px, calc(100vw - 28px));
        color: #e5e7eb;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
      `;

      wrap.innerHTML = `
        <div style="
          background: rgba(2,6,23,0.82);
          border: 1px solid rgba(148,163,184,0.22);
          border-radius: 16px;
          box-shadow: 0 16px 45px rgba(2,6,23,0.55);
          backdrop-filter: blur(14px);
          overflow: hidden;
        ">
          <div style="
            display:flex;align-items:center;justify-content:space-between;gap:10px;
            padding: 12px 14px;
            background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(16,24,39,0.0));
          ">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="
                width:28px;height:28px;border-radius:10px;
                background: linear-gradient(135deg,#6366f1,#22c55e);
                box-shadow: 0 10px 24px rgba(99,102,241,0.25);
                display:flex;align-items:center;justify-content:center;
                color:#030712;font-weight:800;
              ">⬇</div>
              <div>
                <div style="font-size:13px;font-weight:700;letter-spacing:.2px;">Linux.do 导出 Pro</div>
                <div style="font-size:11px;color:#9ca3af;margin-top:1px;">HTML 离线阅读 + AI 文本投喂</div>
              </div>
            </div>
            <button id="ld-export-toggle" style="
              border:none;background:transparent;color:#cbd5e1;cursor:pointer;
              font-size:16px;padding:6px 8px;border-radius:10px;
            " title="折叠/展开">▾</button>
          </div>

          <div id="ld-export-body" style="padding: 12px 14px;">
            <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                <input id="ld-export-offline" type="checkbox" />
                <span>离线图片/头像（base64）</span>
              </label>
              <select id="ld-export-theme" style="
                background:rgba(15,23,42,0.7); color:#e5e7eb;
                border:1px solid rgba(148,163,184,0.25);
                border-radius:10px; padding:6px 10px; font-size:12px;
                outline: none;
              ">
                <option value="auto">导出主题：自动</option>
                <option value="dark">导出主题：黑夜</option>
                <option value="light">导出主题：白天</option>
              </select>
            </div>

            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="color:#cbd5e1;">并发抓图</span>
                <span id="ld-export-concurrency-value" style="color:#a5b4fc;font-weight:700;">3</span>
              </div>
              <input id="ld-export-concurrency" type="range" min="1" max="20" value="3" style="width:100%;" />
            </div>

            <div style="
              border:1px dashed rgba(148,163,184,0.25);
              border-radius:12px;
              padding:10px;
              margin-bottom:10px;
              background: rgba(15,23,42,0.35);
            ">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-weight:700;color:#e5e7eb;">楼层范围</span>
                  <select id="ld-range-mode" style="
                    background:rgba(15,23,42,0.7); color:#e5e7eb;
                    border:1px solid rgba(148,163,184,0.25);
                    border-radius:10px; padding:6px 10px; font-size:12px;
                    outline: none;
                  ">
                    <option value="all">全部导出</option>
                    <option value="range">指定范围</option>
                  </select>
                </div>
              </div>

              <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
                <input id="ld-range-start" type="number" min="1" step="1" placeholder="起始楼层"
                  style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                <span style="color:#94a3b8;">—</span>
                <input id="ld-range-end" type="number" min="1" step="1" placeholder="结束楼层"
                  style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
              </div>
              <div style="margin-top:6px;color:#94a3b8;font-size:11px;">
                提示：范围会同时作用于 HTML 与 AI 文本导出
              </div>
            </div>

            <div style="margin-bottom:10px;">
              <div style="height:8px;background:rgba(30,41,59,0.75);border-radius:999px;overflow:hidden;border:1px solid rgba(148,163,184,0.15);">
                <div id="ld-export-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#6366f1,#22c55e);transition:width 0.12s;"></div>
              </div>
              <div id="ld-export-progress-text" style="margin-top:6px;color:#9ca3af;font-size:11px;">准备就绪</div>
              <div id="ld-export-status-text" style="margin-top:2px;color:#6ee7b7;font-size:11px;"></div>
              <div id="ld-export-download-fallback" style="margin-top:4px;color:#fdba74;font-size:11px;display:none;">
                下载如果没有自动弹出？
                <button id="ld-export-download-fallback-btn" style="border:none;background:transparent;padding:0;margin:0;color:#bfdbfe;cursor:pointer;text-decoration:underline;font-size:11px;">
                  下载兜底：点我下载
                </button>
              </div>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button id="ld-export-html" style="
                flex:1;border:none;border-radius:999px;padding:9px 12px;
                font-size:12px;font-weight:700;cursor:pointer;color:white;
                background:linear-gradient(135deg,#6366f1,#8b5cf6);
                box-shadow:0 12px 28px rgba(99,102,241,0.28);
              ">导出 HTML</button>

              <button id="ld-export-pause" style="
                flex:0 0 auto;border:none;border-radius:999px;padding:9px 12px;
                font-size:12px;font-weight:700;cursor:pointer;color:white;
                background:linear-gradient(135deg,#f97316,#facc15);
                box-shadow:0 12px 28px rgba(234,179,8,0.25);
              ">暂停</button>

              <button id="ld-export-stop" style="
                flex:0 0 auto;border:none;border-radius:999px;padding:9px 12px;
                font-size:12px;font-weight:700;cursor:pointer;color:white;
                background:rgba(248,113,113,0.95);
                box-shadow:0 12px 28px rgba(248,113,113,0.18);
              ">停止并导出</button>
            </div>

            <button id="ld-export-ai-text" style="
              margin-top:8px;width:100%;
              border:none;border-radius:999px;padding:9px 12px;
              font-size:12px;font-weight:800;cursor:pointer;color:white;
              background:linear-gradient(135deg,#0f766e,#22c55e);
              box-shadow:0 12px 28px rgba(34,197,94,0.18);
            ">导出发给 AI 的文本</button>

            <div style="margin-top:10px;">
              <button id="ld-advanced-toggle" style="
                width:100%;
                border:1px solid rgba(148,163,184,0.2);
                background:rgba(2,6,23,0.35);
                color:#cbd5e1;
                border-radius:12px;
                padding:8px 10px;
                cursor:pointer;
                font-size:12px;
                display:flex;align-items:center;justify-content:space-between;
              ">
                <span>高级筛选 / AI 选项</span>
                <span id="ld-advanced-arrow">▾</span>
              </button>

              <div id="ld-advanced-wrap" style="display:none;margin-top:8px;">
                <div style="
                  border:1px solid rgba(148,163,184,0.18);
                  border-radius:14px;
                  padding:10px;
                  background:rgba(2,6,23,0.30);
                ">
                  <div style="font-size:12px;font-weight:800;color:#e5e7eb;margin-bottom:8px;">导出筛选（作用于 HTML + AI）</div>

                  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                      <input id="ld-only-op" type="checkbox" />
                      <span>只导出楼主</span>
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                      <input id="ld-only-img" type="checkbox" />
                      <span>只导出含图</span>
                    </label>
                  </div>

                  <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input id="ld-users" type="text" placeholder="指定用户（逗号分隔）"
                      style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                    <input id="ld-minlen" type="number" min="0" step="1" placeholder="最短字数"
                      style="width:110px;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                  </div>

                  <div style="display:flex;gap:8px;margin-bottom:10px;">
                    <input id="ld-include" type="text" placeholder="包含关键词（空格/逗号分隔，任一命中）"
                      style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                  </div>

                  <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <input id="ld-exclude" type="text" placeholder="排除关键词（命中则剔除）"
                      style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                  </div>

                  <div style="height:1px;background:rgba(148,163,184,0.15);margin:8px 0;"></div>

                  <div style="font-size:12px;font-weight:800;color:#e5e7eb;margin-bottom:8px;">AI 文本选项</div>
                  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                      <input id="ld-ai-header" type="checkbox" />
                      <span>包含头部信息</span>
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                      <input id="ld-ai-images" type="checkbox" />
                      <span>输出图片链接行</span>
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#cbd5e1;">
                      <input id="ld-ai-quotes" type="checkbox" />
                      <span>保留引用块</span>
                    </label>
                  </div>

                  <div style="display:flex;gap:8px;">
                    <input id="ld-ai-maxchars" type="number" min="0" step="100" placeholder="最大字符数（0=无限）"
                      style="flex:1;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                    <input id="ld-ai-maxposts" type="number" min="0" step="1" placeholder="最大楼层数（0=无限）"
                      style="width:140px;background:rgba(2,6,23,0.6);color:#e5e7eb;border:1px solid rgba(148,163,184,0.25);border-radius:10px;padding:8px 10px;font-size:12px;outline:none;" />
                  </div>

                  <div style="margin-top:8px;color:#94a3b8;font-size:11px;">
                    小贴士：导出 HTML 内也自带搜索/目录/过滤/主题切换（离线可用）
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      document.body.appendChild(wrap);
      this.container = wrap;

      // cache els
      this.progressBar = wrap.querySelector("#ld-export-progress-bar");
      this.progressText = wrap.querySelector("#ld-export-progress-text");
      this.statusText = wrap.querySelector("#ld-export-status-text");
      this.fallbackWrap = wrap.querySelector("#ld-export-download-fallback");
      this.fallbackBtn = wrap.querySelector("#ld-export-download-fallback-btn");
      this.btnHtml = wrap.querySelector("#ld-export-html");
      this.btnStop = wrap.querySelector("#ld-export-stop");
      this.btnPause = wrap.querySelector("#ld-export-pause");
      this.btnAi = wrap.querySelector("#ld-export-ai-text");

      this.chkOffline = wrap.querySelector("#ld-export-offline");
      this.inputConcurrency = wrap.querySelector("#ld-export-concurrency");
      this.labelConcurrencyValue = wrap.querySelector("#ld-export-concurrency-value");

      this.selRangeMode = wrap.querySelector("#ld-range-mode");
      this.inputRangeStart = wrap.querySelector("#ld-range-start");
      this.inputRangeEnd = wrap.querySelector("#ld-range-end");

      this.selTheme = wrap.querySelector("#ld-export-theme");

      // advanced
      this.advancedWrap = wrap.querySelector("#ld-advanced-wrap");
      this.chkOnlyOp = wrap.querySelector("#ld-only-op");
      this.chkOnlyImg = wrap.querySelector("#ld-only-img");
      this.inputUsers = wrap.querySelector("#ld-users");
      this.inputInclude = wrap.querySelector("#ld-include");
      this.inputExclude = wrap.querySelector("#ld-exclude");
      this.inputMinLen = wrap.querySelector("#ld-minlen");

      this.chkAiHeader = wrap.querySelector("#ld-ai-header");
      this.chkAiImages = wrap.querySelector("#ld-ai-images");
      this.chkAiQuotes = wrap.querySelector("#ld-ai-quotes");
      this.inputAiMaxChars = wrap.querySelector("#ld-ai-maxchars");
      this.inputAiMaxPosts = wrap.querySelector("#ld-ai-maxposts");

      // fallback 按钮
      if (this.fallbackBtn) {
        this.fallbackBtn.addEventListener("click", () => {
          if (!this.fallbackUrl) {
            alert("当前没有可供兜底下载的导出文件，请先执行一次导出。");
            return;
          }
          try {
            const a = document.createElement("a");
            a.href = this.fallbackUrl;
            a.download = this.fallbackName || "linuxdo-export.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } catch (e) {
            console.error("兜底下载失败：", e);
            alert("兜底下载失败，请尝试重新导出一次。");
          }
        });
      }

      // restore state
      const offline = GM_getValue(K.OFFLINE, DEFAULTS.offline);
      const conc = GM_getValue(K.CONCURRENCY, DEFAULTS.concurrency);
      const rangeMode = GM_getValue(K.RANGE_MODE, DEFAULTS.rangeMode);
      const rangeStart = GM_getValue(K.RANGE_START, DEFAULTS.rangeStart);
      const rangeEnd = GM_getValue(K.RANGE_END, DEFAULTS.rangeEnd);
      const htmlTheme = GM_getValue(K.HTML_THEME, DEFAULTS.htmlTheme);

      const onlyOp = GM_getValue(K.FILTER_ONLY_OP, DEFAULTS.onlyOp);
      const onlyImg = GM_getValue(K.FILTER_ONLY_IMG, DEFAULTS.onlyImg);
      const users = GM_getValue(K.FILTER_USERS, DEFAULTS.users);
      const include = GM_getValue(K.FILTER_INCLUDE, DEFAULTS.include);
      const exclude = GM_getValue(K.FILTER_EXCLUDE, DEFAULTS.exclude);
      const minLen = GM_getValue(K.FILTER_MINLEN, DEFAULTS.minLen);

      const aiHeader = GM_getValue(K.AI_HEADER, DEFAULTS.aiHeader);
      const aiImages = GM_getValue(K.AI_IMAGES, DEFAULTS.aiImages);
      const aiQuotes = GM_getValue(K.AI_QUOTES, DEFAULTS.aiQuotes);
      const aiMaxChars = GM_getValue(K.AI_MAXCHARS, DEFAULTS.aiMaxChars);
      const aiMaxPosts = GM_getValue(K.AI_MAXPOSTS, DEFAULTS.aiMaxPosts);

      this.chkOffline.checked = !!offline;
      this.inputConcurrency.value = String(conc);
      this.labelConcurrencyValue.textContent = String(conc);

      this.selRangeMode.value = rangeMode;
      this.inputRangeStart.value = String(rangeStart);
      this.inputRangeEnd.value = String(rangeEnd);

      this.selTheme.value = htmlTheme;

      this.chkOnlyOp.checked = !!onlyOp;
      this.chkOnlyImg.checked = !!onlyImg;
      this.inputUsers.value = users || "";
      this.inputInclude.value = include || "";
      this.inputExclude.value = exclude || "";
      this.inputMinLen.value = String(minLen || 0);

      this.chkAiHeader.checked = !!aiHeader;
      this.chkAiImages.checked = !!aiImages;
      this.chkAiQuotes.checked = !!aiQuotes;
      this.inputAiMaxChars.value = String(aiMaxChars || 0);
      this.inputAiMaxPosts.value = String(aiMaxPosts || 0);

      // collapse & advanced open
      const toggleBtn = wrap.querySelector("#ld-export-toggle");
      const bodyDiv = wrap.querySelector("#ld-export-body");
      const collapsed = GM_getValue(K.PANEL_COLLAPSED, false);
      if (collapsed) {
        bodyDiv.style.display = "none";
        toggleBtn.textContent = "▴";
      }

      toggleBtn.addEventListener("click", () => {
        const isHidden = bodyDiv.style.display === "none";
        bodyDiv.style.display = isHidden ? "" : "none";
        toggleBtn.textContent = isHidden ? "▾" : "▴";
        GM_setValue(K.PANEL_COLLAPSED, !isHidden ? true : false);
      });

      const advBtn = wrap.querySelector("#ld-advanced-toggle");
      const advArrow = wrap.querySelector("#ld-advanced-arrow");
      const advOpen = GM_getValue(K.ADVANCED_OPEN, false);
      if (advOpen) {
        this.advancedWrap.style.display = "";
        advArrow.textContent = "▴";
      }
      advBtn.addEventListener("click", () => {
        const open = this.advancedWrap.style.display !== "none";
        this.advancedWrap.style.display = open ? "none" : "";
        advArrow.textContent = open ? "▾" : "▴";
        GM_setValue(K.ADVANCED_OPEN, !open);
      });

      // listeners -> save
      this.chkOffline.addEventListener("change", () => {
        GM_setValue(K.OFFLINE, !!this.chkOffline.checked);
      });

      const concHandler = () => {
        const v = clampInt(this.inputConcurrency.value, 1, 20, DEFAULTS.concurrency);
        this.labelConcurrencyValue.textContent = String(v);
      };
      this.inputConcurrency.addEventListener("input", concHandler);
      this.inputConcurrency.addEventListener("change", () => {
        const v = clampInt(this.inputConcurrency.value, 1, 20, DEFAULTS.concurrency);
        GM_setValue(K.CONCURRENCY, v);
      });

      const saveRange = () => {
        const mode = this.selRangeMode.value === "range" ? "range" : "all";
        const start = clampInt(this.inputRangeStart.value, 1, 999999, DEFAULTS.rangeStart);
        const end = clampInt(this.inputRangeEnd.value, 1, 999999, DEFAULTS.rangeEnd);
        GM_setValue(K.RANGE_MODE, mode);
        GM_setValue(K.RANGE_START, start);
        GM_setValue(K.RANGE_END, end);
        // UI: range inputs enable/disable
        const disabled = mode !== "range";
        this.inputRangeStart.disabled = disabled;
        this.inputRangeEnd.disabled = disabled;
        this.inputRangeStart.style.opacity = disabled ? "0.55" : "1";
        this.inputRangeEnd.style.opacity = disabled ? "0.55" : "1";
      };
      this.selRangeMode.addEventListener("change", saveRange);
      this.inputRangeStart.addEventListener("change", saveRange);
      this.inputRangeEnd.addEventListener("change", saveRange);
      saveRange(); // init

      this.selTheme.addEventListener("change", () => {
        const v = this.selTheme.value;
        GM_setValue(
          K.HTML_THEME,
          v === "dark" || v === "light" || v === "auto" ? v : DEFAULTS.htmlTheme
        );
      });

      // advanced save
      const advSave = () => {
        GM_setValue(K.FILTER_ONLY_OP, !!this.chkOnlyOp.checked);
        GM_setValue(K.FILTER_ONLY_IMG, !!this.chkOnlyImg.checked);
        GM_setValue(K.FILTER_USERS, this.inputUsers.value || "");
        GM_setValue(K.FILTER_INCLUDE, this.inputInclude.value || "");
        GM_setValue(K.FILTER_EXCLUDE, this.inputExclude.value || "");
        GM_setValue(K.FILTER_MINLEN, clampInt(this.inputMinLen.value, 0, 999999, 0));

        GM_setValue(K.AI_HEADER, !!this.chkAiHeader.checked);
        GM_setValue(K.AI_IMAGES, !!this.chkAiImages.checked);
        GM_setValue(K.AI_QUOTES, !!this.chkAiQuotes.checked);
        GM_setValue(K.AI_MAXCHARS, clampInt(this.inputAiMaxChars.value, 0, 999999999, 0));
        GM_setValue(K.AI_MAXPOSTS, clampInt(this.inputAiMaxPosts.value, 0, 999999, 0));
      };

      [this.chkOnlyOp, this.chkOnlyImg, this.chkAiHeader, this.chkAiImages, this.chkAiQuotes].forEach((el) => {
        el.addEventListener("change", advSave);
      });
      [
        this.inputUsers,
        this.inputInclude,
        this.inputExclude,
        this.inputMinLen,
        this.inputAiMaxChars,
        this.inputAiMaxPosts,
      ].forEach((el) => {
        el.addEventListener("change", advSave);
      });

      // initial progress
      this.setProgress(0, 1, "准备就绪");
      this.setStatus("", "#6ee7b7");
      this.setBusy(false);
      this.updatePauseLabel(false);
      this.clearDownloadFallback();
    },

    getSettings() {
      // 从 UI 读（这样导出时就是用户当前改的）
      const offline = !!this.chkOffline.checked;
      const concurrency = clampInt(this.inputConcurrency.value, 1, 20, DEFAULTS.concurrency);

      const rangeMode = this.selRangeMode.value === "range" ? "range" : "all";
      const rangeStart = clampInt(this.inputRangeStart.value, 1, 999999, DEFAULTS.rangeStart);
      const rangeEnd = clampInt(this.inputRangeEnd.value, 1, 999999, DEFAULTS.rangeEnd);

      const htmlTheme =
        this.selTheme.value === "dark" ||
        this.selTheme.value === "light" ||
        this.selTheme.value === "auto"
          ? this.selTheme.value
          : DEFAULTS.htmlTheme;

      const onlyOp = !!this.chkOnlyOp.checked;
      const onlyImg = !!this.chkOnlyImg.checked;
      const users = this.inputUsers.value || "";
      const include = this.inputInclude.value || "";
      const exclude = this.inputExclude.value || "";
      const minLen = clampInt(this.inputMinLen.value, 0, 999999, 0);

      const aiHeader = !!this.chkAiHeader.checked;
      const aiImages = !!this.chkAiImages.checked;
      const aiQuotes = !!this.chkAiQuotes.checked;
      const aiMaxChars = clampInt(this.inputAiMaxChars.value, 0, 999999999, 0);
      const aiMaxPosts = clampInt(this.inputAiMaxPosts.value, 0, 999999, 0);

      return {
        offline,
        concurrency,
        rangeMode,
        rangeStart,
        rangeEnd,
        htmlTheme,
        filters: { onlyOp, onlyImg, users, include, exclude, minLen },
        ai: { header: aiHeader, images: aiImages, quotes: aiQuotes, maxChars: aiMaxChars, maxPosts: aiMaxPosts },
      };
    },

    setProgress(completed, total, stageText) {
      if (!this.container) this.init();
      total = total || 1;
      const percent = Math.round((completed / total) * 100);
      this.progressBar.style.width = percent + "%";
      this.progressText.textContent = `${stageText} (${completed}/${total}，${percent}%)`;
    },

    setStatus(msg, color) {
      if (!this.container) this.init();
      this.statusText.textContent = msg || "";
      if (color) this.statusText.style.color = color;
    },

    setBusy(isBusy) {
      if (!this.container) this.init();
      if (this.btnHtml) this.btnHtml.disabled = isBusy;
      if (this.btnAi) this.btnAi.disabled = isBusy;
      if (this.btnStop) {
        this.btnStop.disabled = !isBusy;
        this.btnStop.style.opacity = isBusy ? "1" : "0.6";
      }
      if (this.btnPause) {
        this.btnPause.disabled = !isBusy;
        this.btnPause.style.opacity = isBusy ? "1" : "0.6";
        this.updatePauseLabel(false);
      }
    },

    setDownloadFallback(url, filename) {
      if (!this.container) this.init();
      try {
        if (this.fallbackUrl && this.fallbackUrl !== url) {
          URL.revokeObjectURL(this.fallbackUrl);
        }
      } catch (e) {
        console.warn("回收旧导出 URL 失败：", e);
      }
      this.fallbackUrl = url;
      this.fallbackName = filename || "linuxdo-export.txt";
      if (this.fallbackWrap) {
        this.fallbackWrap.style.display = "block";
      }
    },

    clearDownloadFallback() {
      if (!this.container) this.init();
      if (this.fallbackWrap) {
        this.fallbackWrap.style.display = "none";
      }
      if (this.fallbackUrl) {
        try {
          URL.revokeObjectURL(this.fallbackUrl);
        } catch (e) {
          console.warn("释放导出 URL 失败：", e);
        }
      }
      this.fallbackUrl = "";
      this.fallbackName = "";
    },

    updatePauseLabel(isPaused) {
      if (!this.btnPause) return;
      this.btnPause.textContent = isPaused ? "继续" : "暂停";
    },
  };

  // -----------------------
  // 网络请求（带重试）
  // -----------------------
  async function fetchJson(url, opts, retries = 2) {
    let lastErr = null;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        lastErr = e;
        if (i < retries) await sleep(250 * (i + 1));
      }
    }
    throw lastErr || new Error("fetchJson failed");
  }

  function getRequestOpts() {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
    const headers = { "x-requested-with": "XMLHttpRequest" };
    if (csrf) headers["x-csrf-token"] = csrf;
    return { headers };
  }

  // -----------------------
  // 拉取所有帖子（单一真源）
  // -----------------------
  async function fetchAllPostsDetailed(topicId) {
    const opts = getRequestOpts();

    // 1) post_ids
    const idData = await fetchJson(
      `${window.location.origin}/t/${topicId}/post_ids.json?post_number=0&limit=99999`,
      opts
    );
    let postIds = idData.post_ids || [];

    // 2) topic json（兜底 + 拿 OP）
    const mainData = await fetchJson(`${window.location.origin}/t/${topicId}.json`, opts);
    const mainFirstPost = mainData.post_stream?.posts?.[0];
    if (mainFirstPost && !postIds.includes(mainFirstPost.id)) postIds.unshift(mainFirstPost.id);

    const opUsername =
      mainData?.details?.created_by?.username ||
      mainData?.post_stream?.posts?.[0]?.username ||
      "";

    // meta：尽量从 API 拿 title/tags；category name 仍用页面 DOM（更准确）
    const domCategory = document.querySelector(".badge-category__name")?.textContent?.trim() || "";
    const domTags = Array.from(document.querySelectorAll(".discourse-tag"))
      .map((t) => t.textContent.trim())
      .filter(Boolean);

    const topic = {
      topicId: String(topicId || ""),
      title: mainData?.title ? String(mainData.title) : document.title,
      category: domCategory,
      tags: (Array.isArray(mainData?.tags) && mainData.tags.length ? mainData.tags : domTags) || [],
      url: window.location.href,
      opUsername: opUsername || "",
    };

    // 3) posts.json 分批
    let allPosts = [];
    for (let i = 0; i < postIds.length; i += 200) {
      const chunk = postIds.slice(i, i + 200);
      const q = chunk.map((id) => `post_ids[]=${encodeURIComponent(id)}`).join("&");
      const data = await fetchJson(
        `${window.location.origin}/t/${topicId}/posts.json?${q}&include_suggested=false`,
        opts
      );
      const posts = data.post_stream?.posts || [];
      allPosts = allPosts.concat(posts);
      ui.setProgress(Math.min(i + 200, postIds.length), postIds.length, "拉取帖子数据");
    }

    allPosts.sort((a, b) => a.post_number - b.post_number);
    return { topic, posts: allPosts };
  }

  // -----------------------
  // 筛选（范围/楼主/含图/用户/关键词/最短长度）
  // -----------------------
  function postHasImageFast(post) {
    const cooked = post?.cooked || "";
    return cooked.includes("<img");
  }

  function buildPlainCache(posts) {
    // 一次性给筛选用：避免重复 parse
    const cache = new Map();
    for (const p of posts) {
      const text = cookedToAiText(p.cooked || "", { includeImages: false, includeQuotes: true });
      cache.set(p.id, text || "");
    }
    return cache;
  }

  function applyFilters(topic, posts, settings) {
    const { rangeMode, rangeStart, rangeEnd, filters } = settings;
    const op = (topic.opUsername || "").toLowerCase();

    const wantUsers = new Set(normalizeListInput(filters.users).map((u) => u.toLowerCase()));
    const includeKws = normalizeListInput(filters.include);
    const excludeKws = normalizeListInput(filters.exclude);
    const minLen = clampInt(filters.minLen, 0, 999999, 0);

    const needTextCheck = includeKws.length > 0 || excludeKws.length > 0 || minLen > 0;
    const plainCache = needTextCheck ? buildPlainCache(posts) : null;

    const inRange = (n) => {
      if (rangeMode !== "range") return true;
      return n >= rangeStart && n <= rangeEnd;
    };

    const matchKeywords = (txt, kws) => {
      if (!kws.length) return true;
      const low = txt.toLowerCase();
      return kws.some((k) => low.includes(k.toLowerCase()));
    };

    const hitExclude = (txt, kws) => {
      if (!kws.length) return false;
      const low = txt.toLowerCase();
      return kws.some((k) => low.includes(k.toLowerCase()));
    };

    const selected = [];
    for (const p of posts) {
      const pn = p.post_number || 0;
      if (!inRange(pn)) continue;

      if (filters.onlyOp && op) {
        if ((p.username || "").toLowerCase() !== op) continue;
      }

      if (wantUsers.size) {
        if (!wantUsers.has((p.username || "").toLowerCase())) continue;
      }

      if (filters.onlyImg) {
        if (!postHasImageFast(p)) continue;
      }

      if (needTextCheck) {
        const txt = plainCache.get(p.id) || "";
        if (minLen > 0 && txt.replace(/\s+/g, "").length < minLen) continue;
        if (!matchKeywords(txt, includeKws)) continue;
        if (hitExclude(txt, excludeKws)) continue;
      }

      selected.push(p);
    }

    return { selected, opUsername: topic.opUsername || "" };
  }

  function buildFilterSummary(settings, topic) {
    const { rangeMode, rangeStart, rangeEnd, filters } = settings;
    const parts = [];
    parts.push(rangeMode === "range" ? `范围=${rangeStart}-${rangeEnd}` : "范围=全部");
    if (filters.onlyOp) parts.push(`只楼主=@${topic.opUsername || "OP"}`);
    if (filters.onlyImg) parts.push("只含图");
    if ((filters.users || "").trim()) parts.push(`用户=${filters.users.trim()}`);
    if ((filters.include || "").trim()) parts.push(`包含=${filters.include.trim()}`);
    if ((filters.exclude || "").trim()) parts.push(`排除=${filters.exclude.trim()}`);
    if ((filters.minLen || 0) > 0) parts.push(`最短=${filters.minLen}`);
    return parts.join("；");
  }

  // -----------------------
  // 图片离线化（并发/可暂停/可中止/兜底）
  // -----------------------
  const exportState = {
    running: false,
    stopNow: false,
    paused: false,
    hasExported: false,
    offlineImages: true,
    totalImages: 0,
    doneImages: 0,
    failedImages: 0,
    queue: [],
    imgMap: {}, // url -> dataURL|url
    topic: null,
    posts: [],
    concurrency: 3,
    htmlTheme: "auto",
    abortControllers: new Set(),
  };

  async function imageUrlToBase64(url) {
    const ctrl = new AbortController();
    exportState.abortControllers.add(ctrl);

    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const blob = await res.blob();

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return dataUrl;
    } catch (e) {
      console.error("图片转换失败:", url, e);
      exportState.failedImages++;
      return url; // 兜底：原 URL
    } finally {
      exportState.abortControllers.delete(ctrl);
    }
  }

  function collectImageUrlsFromPosts(posts) {
    const urlSet = new Set();

    // 正文图片：同时抓 img src 和 a.lightbox href（更“原图友好”）
    for (const p of posts) {
      const div = document.createElement("div");
      div.innerHTML = p.cooked || "";
      div.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        const full = absoluteUrl(src);
        if (full) urlSet.add(full);

        const a = img.closest("a");
        if (a) {
          const href = a.getAttribute("href") || "";
          const h = absoluteUrl(href);
          if (h && /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(h)) urlSet.add(h);
        }
      });
    }

    // 头像：avatar_template -> size 96
    for (const p of posts) {
      const tpl = p.avatar_template;
      if (!tpl) continue;
      const fullTpl = absoluteUrl(tpl.replace(/{size}/g, "96"));
      if (fullTpl) urlSet.add(fullTpl);
    }

    return Array.from(urlSet);
  }

  async function imageWorker() {
    while (exportState.queue.length > 0 && !exportState.stopNow) {
      if (exportState.paused) {
        // 暂停：不再领取新任务，只是轻微等待，直到恢复或停止
        await sleep(200);
        continue;
      }

      const url = exportState.queue.shift();
      if (!url) continue;

      if (exportState.imgMap[url]) {
        exportState.doneImages++;
        ui.setProgress(exportState.doneImages, exportState.totalImages, "下载图片");
        continue;
      }

      const dataUrl = await imageUrlToBase64(url);
      exportState.imgMap[url] = dataUrl;

      exportState.doneImages++;
      ui.setProgress(exportState.doneImages, exportState.totalImages, "下载图片");
    }
  }

  async function startImageDownloadQueue() {
    if (!exportState.offlineImages) {
      ui.setProgress(1, 1, "跳过图片下载");
      buildAndDownloadHtml();
      return;
    }

    exportState.doneImages = 0;
    exportState.failedImages = 0;
    ui.setProgress(0, exportState.totalImages || 1, "开始下载图片");

    const workers = [];
    for (let i = 0; i < exportState.concurrency; i++) workers.push(imageWorker());
    await Promise.all(workers);

    if (!exportState.stopNow) {
      ui.setStatus("图片处理完成，开始生成 HTML…", "#6ee7b7");
    } else {
      ui.setStatus("已停止：按当前进度生成 HTML…", "#facc15");
    }
    buildAndDownloadHtml();
  }

  function stopAndExportNow() {
    if (!exportState.running) {
      alert("当前没有进行中的 HTML 导出任务");
      return;
    }
    exportState.stopNow = true;
    exportState.paused = false;
    ui.updatePauseLabel(false);
    if (ui.btnPause) {
      ui.btnPause.disabled = true;
      ui.btnPause.style.opacity = "0.6";
    }
    ui.setStatus(
      "已请求停止：会等待当前正在下载的图片尽量收尾后，按当前进度生成 HTML…",
      "#facc15"
    );
    // 注意：不再主动 abort fetch，交给浏览器自然完成，保证“尽量收尾”
  }

  function togglePauseQueue() {
    if (!exportState.running) {
      alert("当前没有进行中的 HTML 导出任务可暂停");
      return;
    }
    if (!exportState.offlineImages || !exportState.totalImages) {
      alert("当前导出未启用离线图片或没有图片队列，无需暂停。");
      return;
    }

    exportState.paused = !exportState.paused;
    if (exportState.paused) {
      ui.setStatus("已暂停图片队列：正在执行中的下载会完成，新任务暂不启动。", "#facc15");
      ui.updatePauseLabel(true);
    } else {
      ui.setStatus("已继续：恢复处理剩余图片队列…", "#6ee7b7");
      ui.updatePauseLabel(false);
    }
  }

  // -----------------------
  // HTML 处理：替换图片为 base64，且点击不跳转（真正“离线点开放大”）
  // -----------------------
  function processPostHtmlWithImages(rawHtml) {
    const div = document.createElement("div");
    div.innerHTML = rawHtml || "";

    div.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
      const full = absoluteUrl(src);
      img.setAttribute("data-original", full || "");
      if (img.hasAttribute("srcset")) img.removeAttribute("srcset");

      // Discourse 常见：img 被 a 包裹
      const a = img.closest("a");
      if (a) {
        const href = a.getAttribute("href") || "";
        if (href) a.setAttribute("data-original-href", absoluteUrl(href));
        a.setAttribute("href", "javascript:void(0)"); // 离线不跳转
        a.classList.add("ld-export-img-link");
      }

      if (exportState.offlineImages && full && exportState.imgMap[full]) {
        img.setAttribute("src", exportState.imgMap[full]);
      } else if (full) {
        img.setAttribute("src", full);
      }

      img.classList.add("ld-export-image");
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.loading = "lazy";
    });

    return div.innerHTML;
  }

  // -----------------------
  // 生成 + 下载 HTML（内置：目录/搜索/过滤/主题/快捷键/Lightbox）
  // -----------------------
  function buildAndDownloadHtml(force = false) {
    if (!exportState.running && !force) return;
    if (exportState.hasExported) return;

    exportState.hasExported = true;

    const topic = exportState.topic;
    const posts = exportState.posts;

    const processed = posts.map((p) => {
      const createdAt = p.created_at;
      const dateObj = createdAt ? new Date(createdAt) : null;
      const dateFormatted = dateObj ? dateObj.toLocaleString("zh-CN") : "";

      // avatar
      let avatarUrl = "";
      if (p.avatar_template) avatarUrl = absoluteUrl(p.avatar_template.replace(/{size}/g, "96"));
      let avatarSrc = avatarUrl;
      if (exportState.offlineImages && avatarUrl && exportState.imgMap[avatarUrl]) avatarSrc = exportState.imgMap[avatarUrl];

      const contentHtml = processPostHtmlWithImages(p.cooked || "");
      const hasImg = postHasImageFast(p) ? "1" : "0";
      const isOp =
        topic?.opUsername &&
        (p.username || "").toLowerCase() === topic.opUsername.toLowerCase()
          ? "1"
          : "0";

      return {
        postNumber: p.post_number,
        username: p.username,
        name: p.name || "",
        dateFormatted,
        avatarUrl,
        avatarSrc,
        contentHtml,
        hasImg,
        isOp,
      };
    });

    const html = generateExportHtml(topic, processed, {
      theme: exportState.htmlTheme || "auto",
      offline: !!exportState.offlineImages,
      imgTotal: exportState.totalImages || 0,
      imgFailed: exportState.failedImages || 0,
    });

    const titlePart = safeFilenamePart(topic.title);
    const filename = `linux-do-${titlePart}-topic-${topic.topicId}-export-${Date.now()}.html`;
    downloadFile(html, filename, "text/html;charset=utf-8");

    ui.setStatus("HTML 导出完成 ✅（离线可用）", "#6ee7b7");
    ui.setBusy(false);

    exportState.running = false;
    exportState.stopNow = false;
    exportState.paused = false;
    exportState.abortControllers.clear();
  }

  function generateExportHtml(topic, posts, meta) {
    const escapedTitle = escapeHtml(topic.title || "");
    const tagsHtml = (topic.tags || [])
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");
    const now = new Date().toLocaleString("zh-CN");
    const op = escapeHtml(topic.opUsername || "");

    // 过滤摘要写进导出页
    const settingsSnap = ui.getSettings();
    const summary = escapeHtml(buildFilterSummary(settingsSnap, topic));

    return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${escapeHtml(meta.theme || "auto")}">
<head>
<meta charset="UTF-8">
<title>${escapedTitle} - Linux.do 导出</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root{
  --bg:#0b1220;
  --panel:rgba(2,6,23,.78);
  --card:rgba(2,6,23,.86);
  --border:rgba(148,163,184,.22);
  --text:#e5e7eb;
  --muted:#94a3b8;
  --muted2:#9ca3af;
  --accent:#6366f1;
  --accent2:#22c55e;
  --link:#60a5fa;
  --shadow:0 16px 45px rgba(2,6,23,0.55);
  --shadow2:0 12px 30px rgba(2,6,23,.45);
  --codebg:rgba(2,6,23,0.75);
  --quote:rgba(99,102,241,0.18);
  --glass:blur(14px);
}
html[data-theme="light"]{
  --bg:#f7f8fc;
  --panel:rgba(255,255,255,.86);
  --card:rgba(255,255,255,.92);
  --border:rgba(30,41,59,.14);
  --text:#0f172a;
  --muted:#475569;
  --muted2:#64748b;
  --link:#2563eb;
  --shadow:0 16px 45px rgba(15,23,42,0.10);
  --shadow2:0 12px 30px rgba(15,23,42,0.08);
  --codebg:rgba(15,23,42,0.06);
  --quote:rgba(99,102,241,0.10);
}
@media (prefers-color-scheme: light){
  html[data-theme="auto"]{
    --bg:#f7f8fc;
    --panel:rgba(255,255,255,.86);
    --card:rgba(255,255,255,.92);
    --border:rgba(30,41,59,.14);
    --text:#0f172a;
    --muted:#475569;
    --muted2:#64748b;
    --link:#2563eb;
    --shadow:0 16px 45px rgba(15,23,42,0.10);
    --shadow2:0 12px 30px rgba(15,23,42,0.08);
    --codebg:rgba(15,23,42,0.06);
    --quote:rgba(99,102,241,0.10);
  }
}
*{box-sizing:border-box}
body{
  margin:0;
  padding:20px;
  background:var(--bg);
  color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
a{color:var(--link);text-decoration:none}
a:hover{text-decoration:underline}
.wrapper{max-width:1100px;margin:0 auto}
.header{
  position:sticky; top:0; z-index:20;
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:18px;
  padding:16px 16px 12px;
  box-shadow:var(--shadow);
  backdrop-filter: var(--glass);
}
.title{
  display:flex;align-items:flex-start;justify-content:space-between;gap:10px;
}
.title h1{margin:0;font-size:20px;line-height:1.25}
.pills{margin-top:10px}
.category{
  display:inline-block;
  padding:2px 10px;border-radius:999px;
  background:rgba(99,102,241,0.16);
  border:1px solid rgba(99,102,241,0.22);
  color:var(--text);
  font-size:12px;margin-right:6px;
}
.tag{
  display:inline-block;
  padding:2px 10px;border-radius:999px;
  background:rgba(148,163,184,0.12);
  border:1px solid rgba(148,163,184,0.18);
  color:var(--muted);
  font-size:12px;margin-right:6px;
}
.meta{
  margin-top:10px;
  font-size:12px;color:var(--muted2);
  line-height:1.55;
}
.toolbar{
  margin-top:12px;
  display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;
}
.tools{
  display:flex;flex-wrap:wrap;gap:8px;align-items:center;
}
.input, .btn, .select{
  border:1px solid var(--border);
  background:rgba(2,6,23,0.12);
  color:var(--text);
  border-radius:12px;
  padding:8px 10px;
  font-size:12px;
  outline:none;
}
html[data-theme="light"] .input, html[data-theme="light"] .btn, html[data-theme="light"] .select{ background:rgba(255,255,255,0.7); }
.btn{
  cursor:pointer;
  user-select:none;
  display:inline-flex;align-items:center;gap:6px;
}
.btn.primary{
  background:linear-gradient(135deg, rgba(99,102,241,.85), rgba(34,197,94,.75));
  border:0;
  color:white;
  font-weight:800;
}
.btn.ghost{ background:transparent; }
.small{font-size:11px;color:var(--muted2)}
.content{margin-top:14px}

.post{
  background:var(--card);
  border-radius:18px;
  padding:14px 16px;
  margin-bottom:12px;
  box-shadow:var(--shadow2);
  border:1px solid var(--border);
}
.post-header{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.avatar{
  width:42px;height:42px;border-radius:50%;
  overflow:hidden;flex-shrink:0;
  border:1px solid rgba(148,163,184,0.22);
  background:rgba(148,163,184,0.10);
}
.avatar img{width:100%;height:100%;object-fit:cover}
.pmeta{flex:1;min-width:0}
.uname{font-weight:900;font-size:13px;display:flex;align-items:center;gap:8px}
.uname .op{font-size:10px;padding:2px 8px;border-radius:999px;background:rgba(34,197,94,0.14);border:1px solid rgba(34,197,94,0.22);color:var(--text)}
.udate{font-size:11px;color:var(--muted2);margin-top:2px}
.badge{
  font-weight:900;font-size:12px;
  padding:4px 10px;border-radius:999px;
  background:rgba(99,102,241,0.14);
  border:1px solid rgba(99,102,241,0.22);
  color:var(--text);
}
.post-content{
  font-size:14px;
  line-height:1.88;
  color:var(--text);
  word-break:break-word;
}
.post-content p { margin:0 0 10px; }
.post-content pre{
  background:var(--codebg);
  border:1px solid rgba(148,163,184,0.22);
  border-radius:12px;
  padding:12px;
  overflow:auto;
}
.post-content code{
  font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size:12px;
}
.post-content blockquote{
  margin:10px 0;
  padding:10px 12px;
  background:var(--quote);
  border-left:4px solid rgba(99,102,241,0.65);
  border-radius:12px;
  color:var(--muted);
}
.ld-export-image{
  margin:10px 0;
  cursor:pointer;
  border-radius:12px;
  box-shadow:0 12px 35px rgba(2,6,23,0.35);
  transition: transform .12s ease;
}
.ld-export-image:hover{ transform: translateY(-1px); }
.footer{
  margin:18px 0 6px;
  text-align:center;
  font-size:11px;
  color:var(--muted2);
  line-height:1.6;
  opacity:.95;
}

/* drawer */
.drawer{
  position:fixed; inset:0;
  background:rgba(2,6,23,0.72);
  display:none;
  z-index:99;
}
.drawer .panel{
  position:absolute;
  right:16px; top:16px; bottom:16px;
  width:min(420px, calc(100vw - 32px));
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:18px;
  box-shadow:var(--shadow);
  backdrop-filter:var(--glass);
  padding:14px;
  display:flex;
  flex-direction:column;
  gap:12px;
}
.drawer h2{margin:0;font-size:14px}
.drawer .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.drawer .list{overflow:auto;border:1px solid var(--border);border-radius:14px;padding:10px;background:rgba(2,6,23,0.10);}
.drawer a.item{
  display:flex;justify-content:space-between;gap:10px;
  padding:8px 10px;border-radius:12px;
  color:var(--text);
}
.drawer a.item:hover{background:rgba(99,102,241,0.12);text-decoration:none}
.drawer .muted{color:var(--muted2);font-size:11px}

/* lightbox */
#lightbox{
  position:fixed; inset:0;
  background:rgba(2,6,23,0.92);
  display:none;
  align-items:center;
  justify-content:center;
  z-index:999;
}
#lightbox img{
  max-width:92vw;
  max-height:92vh;
  border-radius:16px;
  box-shadow:0 24px 70px rgba(0,0,0,0.75);
}
#lightbox .top{
  position:absolute;
  top:14px; left:14px; right:14px;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  pointer-events:none;
}
#lightbox .top .hint{
  pointer-events:none;
  color:#e5e7eb;
  font-size:12px;
  opacity:.88;
}
#lightbox .top .actions{
  pointer-events:auto;
  display:flex;gap:8px;
}
#lightbox .top .actions button{
  border:1px solid rgba(148,163,184,0.25);
  background:rgba(15,23,42,0.55);
  color:#e5e7eb;
  border-radius:12px;
  padding:8px 10px;
  cursor:pointer;
  font-size:12px;
}
mark.ld-mark{
  padding:0 2px;
  border-radius:4px;
  background:rgba(34,197,94,0.35);
  color:inherit;
}
.post.ld-hit{
  outline:2px solid rgba(34,197,94,0.35);
}
@media (max-width:768px){
  body{padding:12px}
  .header{padding:12px}
}

/* --- Discourse inline SVG icon size fix (category badges, quote headers, etc.) --- */
svg.d-icon, svg.svg-icon, .d-icon svg, .svg-icon svg{
  width: 1em;
  height: 1em;
  max-width: 1em;
  max-height: 1em;
  vertical-align: -0.125em;
}
.badge-category__wrapper, .badge-category{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
}
.badge-category{
  padding: 2px 8px;
  border-radius: 999px;
  line-height: 1.2;
  font-size: 12px;
  background: var(--category-badge-color, rgba(148,163,184,0.12));
  color: var(--category-badge-text-color, var(--text));
  border: 1px solid rgba(148,163,184,0.18);
}
.badge-category svg, .badge-category svg svg{
  width: 1em;
  height: 1em;
  max-width: 1em;
  max-height: 1em;
  flex: 0 0 1em;
}
.badge-category svg path{ fill: currentColor; }
.quote-title__text-content{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  align-items:center;
}

</style>
</head>
<body>
<div class="wrapper">
  <div class="header" id="top">
    <div class="title">
      <h1>${escapedTitle}</h1>
      <div class="tools">
        <button class="btn ghost" id="btnDrawer" title="目录/过滤">☰ 目录</button>
        <button class="btn ghost" id="btnTheme" title="切换主题">🌓 主题</button>
      </div>
    </div>

    <div class="pills">
      ${topic.category ? `<span class="category">${escapeHtml(topic.category)}</span>` : ""}
      ${tagsHtml}
    </div>

    <div class="meta">
      主题 ID：${escapeHtml(topic.topicId)} ・ 导出楼层数：${posts.length} ・ 导出时间：${escapeHtml(now)}<br>
      原始链接：<a href="${escapeHtml(topic.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(topic.url)}</a><br>
      楼主：<b>@${op || "未知"}</b> ・ 过滤：<span class="small">${summary || "无"}</span><br>
      离线资源：${meta.offline ? "已尝试 base64（离线可看）" : "关闭（图片保持在线）"} ・ 图片总数：${meta.imgTotal} ・ 失败：${meta.imgFailed}
    </div>

    <div class="toolbar">
      <div class="tools">
        <input class="input" id="q" placeholder="搜索（/ 聚焦，Enter 下一处，Shift+Enter 上一处）" style="width:min(360px, 70vw)"/>
        <button class="btn" id="btnPrev">⬆ 上一处</button>
        <button class="btn" id="btnNext">⬇ 下一处</button>
        <span class="small" id="hitInfo">0 命中</span>
      </div>
      <div class="tools">
        <input class="input" id="jump" placeholder="跳转楼层 #例如 233" style="width:160px"/>
        <button class="btn primary" id="btnGo">Go</button>
      </div>
    </div>
  </div>

  <div class="content" id="posts">
    ${posts
      .map(
        (p) => `
      <div class="post" id="post-${p.postNumber}"
        data-postno="${p.postNumber}"
        data-user="${escapeHtml(p.username || "")}"
        data-is-op="${p.isOp}"
        data-has-img="${p.hasImg}">
        <div class="post-header">
          <div class="avatar">${p.avatarSrc ? `<img src="${p.avatarSrc}" data-original="${escapeHtml(p.avatarUrl || "")}" alt="${escapeHtml(p.username || "")}">` : ""}</div>
          <div class="pmeta">
            <div class="uname">
              <span>${escapeHtml(p.name || p.username || "")}${
          p.name && p.username ? ` <span class="small">(@${escapeHtml(p.username)})</span>` : ""
        }</span>
              ${p.isOp === "1" ? `<span class="op">OP</span>` : ""}
            </div>
            <div class="udate">${escapeHtml(p.dateFormatted || "")}</div>
          </div>
          <div class="badge">#${p.postNumber}</div>
        </div>
        <div class="post-content">
          ${p.contentHtml}
        </div>
      </div>
    `
      )
      .join("")}

    <div class="footer">
      由「Linux.do 导出 Pro」生成：离线可阅读、可搜索、可按用户/楼主/含图过滤、可一键切主题；支持图片 Lightbox 预览。<br>
      图片元素保留 <code>data-original</code>（原始链接），右键复制即可。
    </div>
  </div>
</div>

<!-- Drawer -->
<div class="drawer" id="drawer">
  <div class="panel">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <h2>目录 / 过滤</h2>
      <button class="btn" id="btnCloseDrawer">关闭 ✕</button>
    </div>

    <div class="row">
      <label class="btn" style="gap:6px;">
        <input type="checkbox" id="fOp" />
        只看楼主
      </label>
      <label class="btn" style="gap:6px;">
        <input type="checkbox" id="fImg" />
        只看含图
      </label>
      <input class="input" id="fUser" placeholder="只看某用户（username）" style="flex:1;min-width:160px;" />
    </div>

    <div class="row">
      <button class="btn" id="btnApply">应用过滤</button>
      <button class="btn" id="btnReset">还原显示</button>
      <span class="muted" id="fInfo">显示 ${posts.length} 楼</span>
    </div>

    <div class="list" id="toc"></div>

    <div class="muted">
      快捷键：<b>/</b> 搜索・<b>Enter</b> 下一处・<b>Shift+Enter</b> 上一处・<b>g</b> 跳转・<b>t</b> 主题・<b>Esc</b> 关闭弹窗
    </div>
  </div>
</div>

<!-- Lightbox -->
<div id="lightbox">
  <div class="top">
    <div class="hint">点击空白处或按 Esc 关闭</div>
    <div class="actions">
      <button id="lbOpen">打开原图</button>
      <button id="lbClose">关闭 ✕</button>
    </div>
  </div>
  <img id="lbImg" src="" alt="">
</div>

<script>
(function(){
  const $$ = (s, el=document) => el.querySelector(s);
  const $$$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // theme
  const themeBtn = $$("#btnTheme");
  const themeOrder = ["auto","dark","light"];
  function getTheme(){ return document.documentElement.getAttribute("data-theme") || "auto"; }
  function setTheme(v){ document.documentElement.setAttribute("data-theme", v); try{ localStorage.setItem("ld_export_theme", v);}catch(e){} }
  try{
    const saved = localStorage.getItem("ld_export_theme");
    if(saved && themeOrder.includes(saved)) setTheme(saved);
  }catch(e){}
  themeBtn.addEventListener("click", ()=>{
    const cur = getTheme();
    const idx = themeOrder.indexOf(cur);
    setTheme(themeOrder[(idx+1)%themeOrder.length]);
  });
  document.addEventListener("keydown",(e)=>{
    if(e.key.toLowerCase()==="t" && !e.ctrlKey && !e.metaKey && !e.altKey){
      setTheme(themeOrder[(themeOrder.indexOf(getTheme())+1)%themeOrder.length]);
    }
  });

  // drawer & toc
  const drawer = $$("#drawer");
  const btnDrawer = $$("#btnDrawer");
  const btnCloseDrawer = $$("#btnCloseDrawer");
  const toc = $$("#toc");
  const posts = $$$(".post");
  function openDrawer(){ drawer.style.display="block"; }
  function closeDrawer(){ drawer.style.display="none"; }
  btnDrawer.addEventListener("click", openDrawer);
  btnCloseDrawer.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e)=>{ if(e.target===drawer) closeDrawer(); });

  // build toc
  toc.innerHTML = posts.map(p=>{
    const no = p.getAttribute("data-postno");
    const user = p.getAttribute("data-user") || "";
    const op = p.getAttribute("data-is-op")==="1" ? " OP" : "";
    return \`<a class="item" href="#post-\${no}" data-jump="\${no}">
      <span>#\${no} <span class="muted">@\${user}\${op}</span></span>
      <span class="muted">→</span>
    </a>\`;
  }).join("");
  toc.addEventListener("click",(e)=>{
    const a = e.target.closest("a.item");
    if(!a) return;
    e.preventDefault();
    const n = a.getAttribute("data-jump");
    const target = document.getElementById("post-"+n);
    if(target) target.scrollIntoView({behavior:"smooth", block:"start"});
    closeDrawer();
  });

  // lightbox
  const lb = $$("#lightbox");
  const lbImg = $$("#lbImg");
  const lbClose = $$("#lbClose");
  const lbOpen = $$("#lbOpen");
  let lbOriginal = "";
  function openLb(src, original){
    lbImg.src = src || "";
    lbOriginal = original || "";
    lb.style.display="flex";
  }
  function closeLb(){
    lb.style.display="none";
    lbImg.src = "";
    lbOriginal = "";
  }
  document.addEventListener("click",(e)=>{
    const t = e.target;
    if(!t) return;
    if(t.classList && t.classList.contains("ld-export-image")){
      e.preventDefault();
      e.stopPropagation();
      const original = t.getAttribute("data-original") || (t.closest("a")?.getAttribute("data-original-href")||"");
      openLb(t.src, original);
    }
  });
  lb.addEventListener("click",(e)=>{ if(e.target===lb) closeLb(); });
  lbClose.addEventListener("click", closeLb);
  lbOpen.addEventListener("click", ()=>{
    if(lbOriginal) window.open(lbOriginal, "_blank");
  });

  // search highlight (skip code/pre)
  const q = $$("#q");
  const btnPrev = $$("#btnPrev");
  const btnNext = $$("#btnNext");
  const hitInfo = $$("#hitInfo");
  let hitMarks = [];
  let hitIndex = -1;

  function clearMarks(){
    $$$("mark.ld-mark").forEach(m=>{
      const parent = m.parentNode;
      if(!parent) return;
      parent.replaceChild(document.createTextNode(m.textContent || ""), m);
      parent.normalize();
    });
    posts.forEach(p=>p.classList.remove("ld-hit"));
    hitMarks = [];
    hitIndex = -1;
    hitInfo.textContent = "0 命中";
  }

  function shouldSkip(node){
    const p = node.parentElement;
    if(!p) return false;
    return !!p.closest("pre,code,script,style");
  }

  function markIn(el, query){
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(n){
        if(!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(shouldSkip(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    const qlow = query.toLowerCase();
    for(const textNode of nodes){
      const val = textNode.nodeValue;
      const low = val.toLowerCase();
      const idx = low.indexOf(qlow);
      if(idx === -1) continue;

      let curVal = val;
      let start = 0;
      const frag = document.createDocumentFragment();
      while(true){
        const i = curVal.toLowerCase().indexOf(qlow, start);
        if(i === -1){
          frag.appendChild(document.createTextNode(curVal.slice(start)));
          break;
        }
        if(i > start) frag.appendChild(document.createTextNode(curVal.slice(start, i)));
        const m = document.createElement("mark");
        m.className = "ld-mark";
        m.textContent = curVal.slice(i, i+query.length);
        frag.appendChild(m);
        start = i + query.length;
      }
      textNode.parentNode.replaceChild(frag, textNode);
    }
  }

  function collectHits(){
    hitMarks = $$$("mark.ld-mark");
    hitMarks.forEach(m=>{
      const post = m.closest(".post");
      if(post) post.classList.add("ld-hit");
    });
    hitInfo.textContent = hitMarks.length + " 命中";
    hitIndex = hitMarks.length ? 0 : -1;
    if(hitIndex >= 0) scrollToHit(hitIndex);
  }

  function scrollToHit(i){
    if(i < 0 || i >= hitMarks.length) return;
    const m = hitMarks[i];
    m.scrollIntoView({behavior:"smooth", block:"center"});
  }

  function doSearch(){
    clearMarks();
    const query = (q.value || "").trim();
    if(!query) return;
    posts.forEach(p=>{
      const content = p.querySelector(".post-content");
      if(content) markIn(content, query);
    });
    collectHits();
  }

  function nextHit(){
    if(!hitMarks.length) return;
    hitIndex = (hitIndex + 1) % hitMarks.length;
    scrollToHit(hitIndex);
  }
  function prevHit(){
    if(!hitMarks.length) return;
    hitIndex = (hitIndex - 1 + hitMarks.length) % hitMarks.length;
    scrollToHit(hitIndex);
  }

  q.addEventListener("change", doSearch);
  q.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      if(e.shiftKey) prevHit(); else nextHit();
    }
  });
  btnNext.addEventListener("click", nextHit);
  btnPrev.addEventListener("click", prevHit);

  // jump
  const jump = $$("#jump");
  const btnGo = $$("#btnGo");
  function go(){
    const v = (jump.value || "").trim().replace(/^#/, "");
    const n = parseInt(v, 10);
    if(!n) return;
    const el = document.getElementById("post-"+n);
    if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
    else alert("该楼层未在导出内容中（可能被过滤/范围排除）");
  }
  btnGo.addEventListener("click", go);
  jump.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ e.preventDefault(); go(); }});

  // drawer filters (display only)
  const fOp = $$("#fOp");
  const fImg = $$("#fImg");
  const fUser = $$("#fUser");
  const fInfo = $$("#fInfo");
  const btnApply = $$("#btnApply");
  const btnReset = $$("#btnReset");

  function applyDisplayFilter(){
    const onlyOp = !!fOp.checked;
    const onlyImg = !!fImg.checked;
    const user = (fUser.value||"").trim().toLowerCase();
    let shown = 0;
    posts.forEach(p=>{
      const isOp = p.getAttribute("data-is-op")==="1";
      const hasImg = p.getAttribute("data-has-img")==="1";
      const u = (p.getAttribute("data-user")||"").toLowerCase();
      let ok = true;
      if(onlyOp && !isOp) ok = false;
      if(onlyImg && !hasImg) ok = false;
      if(user && u !== user) ok = false;
      p.style.display = ok ? "" : "none";
      if(ok) shown++;
    });
    fInfo.textContent = "显示 " + shown + " 楼";
  }
  function resetDisplay(){
    fOp.checked = false; fImg.checked = false; fUser.value = "";
    posts.forEach(p=>p.style.display="");
    fInfo.textContent = "显示 " + posts.length + " 楼";
  }
  btnApply.addEventListener("click", applyDisplayFilter);
  btnReset.addEventListener("click", resetDisplay);

  // shortcuts
  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
      closeDrawer();
      closeLb();
      return;
    }
    if(e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey){
      const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
      if(tag === "input" || tag === "textarea") return;
      e.preventDefault();
      q.focus();
      q.select();
      return;
    }
    if(e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey && !e.altKey){
      const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
      if(tag === "input" || tag === "textarea") return;
      e.preventDefault();
      jump.focus();
      jump.select();
      return;
    }
  });

})();
</script>
</body>
</html>`;
  }

  // -----------------------
  // AI 文本导出（按筛选/范围，格式更“总结脚本同款”）
  // -----------------------
  async function exportAiPlainText() {
    const topicId = getTopicId();
    if (!topicId) return alert("未检测到帖子 ID");

    ui.init();
    ui.clearDownloadFallback();
    ui.setBusy(true);
    ui.setStatus("正在拉取帖子内容用于 AI 文本导出…", "#6ee7b7");
    ui.setProgress(0, 1, "准备中");

    try {
      const settings = ui.getSettings();
      const data = await fetchAllPostsDetailed(topicId);

      const { selected } = applyFilters(data.topic, data.posts, settings);
      const posts = selected;

      const summary = buildFilterSummary(settings, data.topic);
      const head = settings.ai.header
        ? [
            `【主题】${safeText(data.topic.title)}`,
            `【链接】${safeText(data.topic.url)}`,
            `【主题ID】${safeText(data.topic.topicId)}`,
            `【楼主】@${safeText(data.topic.opUsername || "")}`,
            `【导出时间】${new Date().toLocaleString("zh-CN")}`,
            `【过滤/范围】${summary || "无"}`,
            `【楼层数】${posts.length}`,
            `—— 正文开始 ——\n`,
          ].join("\n")
        : "";

      let blocks = [];
      let outCount = 0;

      const maxPosts = settings.ai.maxPosts || 0;
      for (const p of posts) {
        outCount++;
        if (maxPosts > 0 && outCount > maxPosts) break;

        const createdAt = p.created_at
          ? new Date(p.created_at).toLocaleString("zh-CN")
          : "";
        const replyInfo = p.reply_to_post_number ? `\n- 回复[${p.reply_to_post_number}楼]` : "";
        const body = cookedToAiText(p.cooked || "", {
          includeImages: !!settings.ai.images,
          includeQuotes: !!settings.ai.quotes,
        });

        const one = [
          `[${p.post_number}楼] ${
            p.name ? `${p.name}（${p.username}）` : p.username
          }${createdAt ? `  ${createdAt}` : ""}`,
          replyInfo ? replyInfo : "",
          body || "",
        ]
          .filter(Boolean)
          .join("\n");

        blocks.push(one.trim());
      }

      let finalText = head + blocks.join("\n\n");

      const maxChars = settings.ai.maxChars || 0;
      if (maxChars > 0 && finalText.length > maxChars) {
        finalText =
          finalText.slice(0, maxChars) + "\n\n【后续已截断：达到最大字符数限制】";
      }

      ui.setProgress(1, 1, "生成文本完毕");
      const titlePart = safeFilenamePart(data.topic.title);
      const filename = `linux-do-${titlePart}-topic-${data.topic.topicId}-ai-text-${Date.now()}.txt`;
      downloadFile(finalText, filename, "text/plain;charset=utf-8");
      ui.setStatus("AI 文本导出完成 ✅", "#6ee7b7");
    } catch (e) {
      console.error(e);
      ui.setStatus("导出失败：" + (e?.message || e), "#fecaca");
      alert("导出失败：" + (e?.message || e));
    } finally {
      ui.setBusy(false);
    }
  }

  // -----------------------
  // HTML 导出主流程（按筛选/范围，先筛选再抓图）
  // -----------------------
  async function exportHtmlFlow() {
    const topicId = getTopicId();
    if (!topicId) return alert("未检测到帖子 ID");

    if (exportState.running) return alert("当前已有导出任务正在执行");

    ui.init();
    ui.clearDownloadFallback();
    ui.setBusy(true);
    ui.setStatus("准备导出 HTML…", "#6ee7b7");
    ui.setProgress(0, 1, "准备中");

    exportState.running = true;
    exportState.stopNow = false;
    exportState.paused = false;
    exportState.hasExported = false;
    exportState.abortControllers = new Set();

    const settings = ui.getSettings();
    exportState.offlineImages = settings.offline;
    exportState.concurrency = settings.concurrency;
    exportState.htmlTheme = settings.htmlTheme;
    exportState.imgMap = {};
    exportState.queue = [];
    exportState.failedImages = 0;

    try {
      const data = await fetchAllPostsDetailed(topicId);

      // 先筛选，再收集图片（关键优化）
      const { selected } = applyFilters(data.topic, data.posts, settings);

      exportState.topic = data.topic;
      exportState.posts = selected;

      if (!selected.length) {
        exportState.running = false;
        ui.setBusy(false);
        ui.setStatus("筛选后无可导出的楼层（请检查范围/过滤条件）", "#facc15");
        alert("筛选后无可导出的楼层（请检查范围/过滤条件）");
        return;
      }

      const imgs = collectImageUrlsFromPosts(selected);
      exportState.queue = imgs.slice();
      exportState.totalImages = imgs.length;
      exportState.doneImages = 0;

      if (exportState.offlineImages && exportState.totalImages > 0) {
        ui.setStatus("开始下载图片（离线化）…", "#6ee7b7");
        await startImageDownloadQueue();
      } else {
        ui.setStatus("无需离线图片，直接生成 HTML…", "#6ee7b7");
        buildAndDownloadHtml();
      }
    } catch (e) {
      console.error(e);
      ui.setStatus("导出失败：" + (e?.message || e), "#fecaca");
      alert("导出失败：" + (e?.message || e));
      exportState.running = false;
      exportState.paused = false;
    } finally {
      ui.setBusy(false);
    }
  }

  // -----------------------
  // 入口：绑定事件
  // -----------------------
  function init() {
    const topicId = getTopicId();
    if (!topicId) return;

    ui.init();

    ui.btnHtml.addEventListener("click", exportHtmlFlow);
    ui.btnStop.addEventListener("click", stopAndExportNow);
    if (ui.btnPause) ui.btnPause.addEventListener("click", togglePauseQueue);
    ui.btnAi.addEventListener("click", exportAiPlainText);
  }

  window.addEventListener("load", init);
})();