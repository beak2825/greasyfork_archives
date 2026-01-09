// ==UserScript==
// @name         Stage1极简爬楼
// @namespace    https://stage1st.com/
// @version      1.0.0
// @author       sodakoo
// @description  为 Stage1st 帖子页提供样式定制：极简模式，改色，缩略图。
// @match        https://stage1st.com/2b/thread-*.html
// @match        https://stage1st.com/2b/forum.php?mod=viewthread*
// @license      GPL-3.0-only
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561928/Stage1%E6%9E%81%E7%AE%80%E7%88%AC%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561928/Stage1%E6%9E%81%E7%AE%80%E7%88%AC%E6%A5%BC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STORE_KEY = "tm_s1style_settings_v1";

    const defaultSettings = {
        hideUser: false,
        cardMode: false,
        smallText: false,
        twoColumn: false,
        thumbImages: true,
        minimalMode: false,
        fluidWidth: true,
        showPanel: true,
        panelCollapsed: false,
        panelPos: { right: 16, top: 120 },
        backgroundColor: "#F6F7EB",
        textColor: "#333333"
    };

    const hasGM =
        typeof GM_getValue === "function" &&
        typeof GM_setValue === "function";

    function loadSettings() {
        try {
            if (hasGM) {
                const raw = GM_getValue(STORE_KEY, null);
                if (!raw) return structuredClone(defaultSettings);
                return { ...structuredClone(defaultSettings), ...JSON.parse(raw) };
            }
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) return structuredClone(defaultSettings);
            return { ...structuredClone(defaultSettings), ...JSON.parse(raw) };
        } catch {
            return structuredClone(defaultSettings);
        }
    }

    function saveSettings(settings) {
        const raw = JSON.stringify(settings);
        if (hasGM) GM_setValue(STORE_KEY, raw);
        else localStorage.setItem(STORE_KEY, raw);
    }

    function addStyle(css) {
        if (typeof GM_addStyle === "function") {
            GM_addStyle(css);
            return;
        }
        const style = document.createElement("style");
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    function setModeClasses(settings) {
        const root = document.documentElement;

        root.classList.toggle("tm-s1-hide-user", !!settings.hideUser);
        root.classList.toggle("tm-s1-card", !!settings.cardMode);
        root.classList.toggle("tm-s1-smalltext", !!settings.smallText);
        root.classList.toggle("tm-s1-two-col", !!settings.twoColumn);
        root.classList.toggle("tm-s1-thumb-img", !!settings.thumbImages);
        root.classList.toggle("tm-s1-minimal", !!settings.minimalMode);
        root.classList.toggle("tm-s1-fluid", !!settings.fluidWidth);

        // 设置背景色和文本色CSS变量
        root.style.setProperty("--tm-s1-bg-color", settings.backgroundColor || defaultSettings.backgroundColor);
        root.style.setProperty("--tm-s1-text-color", settings.textColor || defaultSettings.textColor);
    }

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function createPanel(settings, onChange) {
        const existing = document.getElementById("tm-s1style-panel");
        if (existing) existing.remove();

        const panel = document.createElement("div");
        panel.id = "tm-s1style-panel";
        panel.style.right = `${settings.panelPos.right}px`;
        panel.style.top = `${settings.panelPos.top}px`;

        panel.innerHTML = `
      <div class="tm-s1style-header">
        <div class="tm-s1style-title">S1 样式</div>
        <div class="tm-s1style-actions">
          <button class="tm-btn" data-act="collapse" title="折叠/展开">_</button>
        </div>
      </div>

      <div class="tm-s1style-body">
        <label class="tm-row">
          <input type="checkbox" data-key="hideUser" />
          <span>隐藏用户信息区（左侧）</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="cardMode" />
          <span>卡片模式</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="smallText" />
          <span>小文本模式</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="twoColumn" />
          <span>双排（两列）模式</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="thumbImages" />
          <span>图片缩略（200x200，点击放大）</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="minimalMode" />
          <span>极简模式（仅作者+正文）</span>
        </label>

        <label class="tm-row">
          <input type="checkbox" data-key="fluidWidth" />
          <span>页面宽度自适应窗口</span>
        </label>

        <label class="tm-row">
          <span>页面背景色</span>
          <input type="color" data-key="backgroundColor" style="width: 40px; height: 20px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;" />
        </label>

        <label class="tm-row">
          <span>文本颜色</span>
          <input type="color" data-key="textColor" style="width: 40px; height: 20px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;" />
        </label>

        <div class="tm-s1style-footer">
          <button class="tm-btn" data-act="reset">重置</button>
        </div>
      </div>

      <div class="tm-s1style-handle" title="拖动移动面板"></div>
    `;

        const body = panel.querySelector(".tm-s1style-body");
        if (settings.panelCollapsed) panel.classList.add("is-collapsed");

        // init checkbox and color input
        panel.querySelectorAll("input[type='checkbox'][data-key]").forEach((el) => {
            const key = el.getAttribute("data-key");
            el.checked = !!settings[key];
            el.addEventListener("change", () => {
                settings[key] = el.checked;
                onChange();
            });
        });

        panel.querySelectorAll("input[type='color'][data-key]").forEach((el) => {
            const key = el.getAttribute("data-key");
            el.value = settings[key] || defaultSettings[key];
            el.addEventListener("input", () => {
                settings[key] = el.value;
                onChange();
            });
        });

        // collapse
        panel.querySelector("[data-act='collapse']").addEventListener("click", () => {
            settings.showPanel = false;
            onChange();
            removePanel();
        });

        // reset
        panel.querySelector("[data-act='reset']").addEventListener("click", () => {
            const next = structuredClone(defaultSettings);
            next.panelPos = settings.panelPos; // 保留当前位置
            Object.assign(settings, next);

            panel.querySelectorAll("input[type='checkbox'][data-key]").forEach((el) => {
                const key = el.getAttribute("data-key");
                el.checked = !!settings[key];
            });

            panel.querySelectorAll("input[type='color'][data-key]").forEach((el) => {
                const key = el.getAttribute("data-key");
                el.value = settings[key] || defaultSettings[key];
            });

            panel.classList.toggle("is-collapsed", !!settings.panelCollapsed);
            onChange();
        });

        // drag
        const handle = panel.querySelector(".tm-s1style-handle");
        let dragging = false;
        let startX = 0, startY = 0;
        let startRight = 0, startTop = 0;

        function onPointerDown(e) {
            dragging = true;
            panel.setPointerCapture?.(e.pointerId);

            startX = e.clientX;
            startY = e.clientY;
            startRight = settings.panelPos.right;
            startTop = settings.panelPos.top;

            panel.classList.add("is-dragging");
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!dragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // right/top 方式定位：向右拖 = right 变小；向左拖 = right 变大
            const nextRight = clamp(startRight - dx, 0, window.innerWidth - 40);
            const nextTop = clamp(startTop + dy, 0, window.innerHeight - 40);

            settings.panelPos.right = nextRight;
            settings.panelPos.top = nextTop;

            panel.style.right = `${nextRight}px`;
            panel.style.top = `${nextTop}px`;
        }

        function onPointerUp() {
            if (!dragging) return;
            dragging = false;
            panel.classList.remove("is-dragging");
            onChange(); // 保存位置
        }

        handle.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        // 点击面板外部隐藏面板
        function onWindowClick(e) {
            if (!panel.contains(e.target)) {
                settings.showPanel = false;
                onChange();
                removePanel();
            }
        }

        panel.onWindowClick = onWindowClick;
        window.addEventListener("click", onWindowClick, true);

        document.body.appendChild(panel);
    }

    function removePanel() {
        const existing = document.getElementById("tm-s1style-panel");
        if (existing) {
            // 移除点击外部隐藏的事件监听器
            window.removeEventListener("click", existing.onWindowClick, true);
            existing.remove();
        }
    }

    const settings = loadSettings();

    addStyle(`
    /* ===== 面板自身样式 ===== */
    #tm-s1style-panel {
      position: fixed;
      z-index: 2147483646;
      width: 260px;
      color: #111;
      font: 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.18);
      backdrop-filter: blur(10px);
      overflow: hidden;
      user-select: none;
    }
    #tm-s1style-panel.is-dragging { cursor: grabbing; }
    #tm-s1style-panel .tm-s1style-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px 8px 12px;
      background: linear-gradient(180deg, rgba(250,250,250,0.9), rgba(240,240,240,0.9));
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    #tm-s1style-panel .tm-s1style-title {
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    #tm-s1style-panel .tm-s1style-actions { display: flex; gap: 6px; }
    #tm-s1style-panel .tm-btn {
      appearance: none;
      border: 1px solid rgba(0,0,0,0.15);
      background: rgba(255,255,255,0.9);
      border-radius: 8px;
      padding: 4px 8px;
      cursor: pointer;
    }
    #tm-s1style-panel .tm-btn:hover { background: rgba(255,255,255,1); }
    #tm-s1style-panel .tm-s1style-body { padding: 10px 12px 12px; }
    #tm-s1style-panel.is-collapsed .tm-s1style-body { display: none; }
    #tm-s1style-panel .tm-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      cursor: pointer;
    }
    #tm-s1style-panel .tm-row input { cursor: pointer; }
    #tm-s1style-panel .tm-s1style-footer {
      margin-top: 8px;
      display: flex;
      justify-content: flex-end;
    }
    #tm-s1style-panel .tm-s1style-handle {
      height: 10px;
      background: rgba(0,0,0,0.06);
      cursor: grab;
    }

    /* ===== 功能样式：页面宽度自适应窗口 ===== */
    html.tm-s1-fluid body {
      min-width: 0 !important;
    }
    html.tm-s1-fluid #hd .wp,
    html.tm-s1-fluid #wp {
      min-width: 0 !important;
    }
    html.tm-s1-fluid .wp {
      width: auto !important;
      max-width: none !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
      box-sizing: border-box !important;
    }
    html.tm-s1-fluid #wp,
    html.tm-s1-fluid #ct {
      width: auto !important;
      max-width: none !important;
    }

    /* ===== 功能样式：隐藏用户信息区 ===== */
    html.tm-s1-hide-user #postlist td.pls {
      display: none !important;
    }
    html.tm-s1-hide-user #postlist td.plc {
      width: auto !important;
    }

    /* ===== 功能样式：卡片模式 ===== */
    html.tm-s1-card #postlist > div[id^="post_"] {
      margin: 12px 0 !important;
    }
    html.tm-s1-card #postlist .tm-s1-card-author {
      display: block !important;
      padding: 8px 10px !important;
      font-weight: 700 !important;
      border-bottom: 1px solid rgba(0,0,0,0.08) !important;
      background: rgba(250,250,250,0.7) !important;
    }
    html.tm-s1-card #postlist .tm-s1-card-author .tm-s1-card-time {
      font-weight: 500 !important;
      opacity: 0.75 !important;
      margin-left: 6px !important;
      white-space: nowrap !important;
    }
    html.tm-s1-card #postlist > div[id^="post_"] > table.plhin {
      border: 1px solid rgba(0,0,0,0.10) !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 22px rgba(0,0,0,0.10) !important;
      overflow: hidden !important;
      background: rgba(255,255,255,0.85) !important;
    }
    html.tm-s1-card #postlist > div[id^="post_"] > table.plhin td.pls,
    html.tm-s1-card #postlist > div[id^="post_"] > table.plhin td.plc {
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }
    html.tm-s1-card #postlist > div[id^="post_"] > table.plhin td.plc .pct {
      padding-right: 8px !important;
    }

    /* ===== 功能样式：小文本模式 ===== */
    html.tm-s1-smalltext body { font-size: 13px !important; }
    html.tm-s1-smalltext #postlist .t_f {
      font-size: 12px !important;
      line-height: 1.45 !important;
    }
    html.tm-s1-smalltext #postlist .pi {
      font-size: 12px !important;
    }

    html #postlist .t_fsz {
      min-height: unset !important;
      height: auto !important;
    }

    html.tm-s1-thumb-img #postlist .t_f img:not([smilieid]) {
      max-width: 200px !important;
      max-height: 200px !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
      cursor: zoom-in !important;
    }
    html.tm-s1-thumb-img #postlist .t_f img.tm-s1-img-expanded {
      max-width: 100% !important;
      max-height: none !important;
      cursor: zoom-out !important;
    }

    html.tm-s1-minimal #postlist td.plc > .pi {
      display: none !important;
    }
    html.tm-s1-minimal #postlist .cm,
    html.tm-s1-minimal #postlist div[id^="comment_"],
    html.tm-s1-minimal #postlist div[id^="post_rate_div_"],
    html.tm-s1-minimal #postlist h3.psth,
    html.tm-s1-minimal #postlist dl.rate,
    html.tm-s1-minimal #postlist table.ratl,
    html.tm-s1-minimal #postlist p.ratc {
      display: none !important;
    }
    html.tm-s1-minimal #postlist td.plc.plm {
      display: none !important;
    }
    html.tm-s1-minimal #postlist .po,
    html.tm-s1-minimal #postlist .pob,
    html.tm-s1-minimal #postlist a.fastre {
      display: none !important;
    }
    html.tm-s1-minimal #postlist td.pls {
      width: 120px !important;
    }
    html.tm-s1-minimal #postlist td.pls .avatar,
    html.tm-s1-minimal #postlist td.pls .tns,
    html.tm-s1-minimal #postlist td.pls .p_pop,
    html.tm-s1-minimal #postlist td.pls .pbg2,
    html.tm-s1-minimal #postlist td.pls .pil,
    html.tm-s1-minimal #postlist td.pls ul,
    html.tm-s1-minimal #postlist td.pls p {
      display: none !important;
    }
    html.tm-s1-minimal #postlist td.pls .pi {
      padding: 6px 8px !important;
    }
    html.tm-s1-minimal #postlist td.pls .authi {
      margin: 0 !important;
      padding: 0 !important;
    }
    html.tm-s1-minimal #postlist td.pls .authi a.xw1 {
      font-weight: 700 !important;
    }
    html.tm-s1-minimal #postlist td.plc .pct {
      padding-top: 6px !important;
    }

    html.tm-s1-minimal #postlist .tm-s1-card-author {
      color: var(--tm-s1-text-color, #333333) !important;
      opacity: 0.8;
      margin-bottom: 4px;
    }
    html.tm-s1-minimal #postlist .t_f {
      color: var(--tm-s1-text-color, #333333) !important;
    }
    html.tm-s1-minimal #toptb {
      display: none !important;
    }
    
    html #f_pst {
        display: none !important;
    }
    html #ft {
        display: none !important;
    }
    html #hd {
        display: none !important;
    }

    /* ===== 功能样式：页面背景色 ===== */
    body {
        background: var(--tm-s1-bg-color, #F6F7EB) !important;
    }
    
    .bm, .vwthd, .pl .quote {
        background: var(--tm-s1-bg-color, #F6F7EB) !important;
    }
    .pl .quote {
        opacity: 0.8;
        color: var(--tm-s1-text-color, #333333) !important;
    }
    .i.pstatus {
        opacity: 0.8;
        color: var(--tm-s1-text-color, #333333) !important;
    }

    @media (min-width: 1100px) {
      html.tm-s1-two-col #postlist {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
      }
      html.tm-s1-two-col #postlist > table {
        flex: 0 0 100% !important;
        width: 100% !important;
      }
      html.tm-s1-two-col #postlist > div[id^="post_"] {
        flex: 0 0 calc(50% - 6px) !important;
        width: calc(50% - 6px) !important;
        margin: 0 !important;
      }
      html.tm-s1-two-col #postlist > div[id^="post_"] > table.plhin {
        width: 100% !important;
      }
    }
  `);

    function applyAndPersist() {
        setModeClasses(settings);
        saveSettings(settings);
    }

    function setupMenuCommands() {
        if (typeof GM_registerMenuCommand !== "function") return;

        GM_registerMenuCommand("S1 样式：显示/隐藏悬浮面板", () => {
            settings.showPanel = !settings.showPanel;
            saveSettings(settings);

            if (settings.showPanel) {
                createPanel(settings, applyAndPersist);
            } else {
                removePanel();
            }
        });

        GM_registerMenuCommand("S1 样式：重置所有设置", () => {
            const ok = window.confirm("重置 S1 样式脚本的所有设置？");
            if (!ok) return;

            const next = structuredClone(defaultSettings);
            Object.assign(settings, next);
            saveSettings(settings);
            setModeClasses(settings);

            if (settings.showPanel) {
                createPanel(settings, applyAndPersist);
            } else {
                removePanel();
            }
        });
    }

    function setupImageToggle() {
        const postlist = document.getElementById("postlist");
        if (!postlist) return;

        if (postlist.dataset.tmS1ImgToggleBound === "1") return;
        postlist.dataset.tmS1ImgToggleBound = "1";

        postlist.addEventListener(
            "click",
            (e) => {
                if (!settings.thumbImages) return;
                const target = e.target;
                if (!target || target.tagName !== "IMG") return;
                if (!target.closest("#postlist .t_f")) return;
                if (target.hasAttribute("smilieid")) return;

                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

                target.classList.toggle("tm-s1-img-expanded");
                e.preventDefault();
                e.stopPropagation();
            },
            true
        );
    }

    function setupCardAuthorLabels() {
        function pad2(n) {
            return String(n).padStart(2, "0");
        }

        function formatPostTime(raw) {
            const s = (raw || "").replace(/^发表于\s*/u, "").trim();
            const m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/);
            if (!m) return s;
            const mm = pad2(m[2]);
            const dd = pad2(m[3]);
            const hh = pad2(m[4]);
            const mi = m[5];
            return `${mm}-${dd} ${hh}:${mi}`;
        }

        const postlist = document.getElementById("postlist");
        if (!postlist) return;

        const posts = postlist.querySelectorAll('div[id^="post_"]');
        posts.forEach((post) => {
            if (post.querySelector(".tm-s1-card-author")) return;

            const authorEl = post.querySelector("td.pls .authi a.xw1");
            const timeEl = post.querySelector('td.plc .pi em[id^="authorposton"]');
            const pctEl = post.querySelector("td.plc .pct");
            if (!authorEl || !pctEl) return;

            const author = (authorEl.textContent || "").trim();
            if (!author) return;

            const timeText = timeEl ? formatPostTime(timeEl.textContent || "") : "";

            const bar = document.createElement("div");
            bar.className = "tm-s1-card-author";

            const authorSpan = document.createElement("span");
            authorSpan.className = "tm-s1-card-name";
            authorSpan.textContent = author;
            bar.appendChild(authorSpan);

            if (timeText) {
                const timeSpan = document.createElement("span");
                timeSpan.className = "tm-s1-card-time";
                timeSpan.textContent = `· ${timeText}`;
                bar.appendChild(timeSpan);
            }

            pctEl.insertBefore(bar, pctEl.firstChild);
        });
    }

    // 等 body
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            applyAndPersist();
            setupMenuCommands();
            if (settings.showPanel) createPanel(settings, applyAndPersist);
            setupImageToggle();
            setupCardAuthorLabels();
        });
    } else {
        applyAndPersist();
        setupMenuCommands();
        if (settings.showPanel) createPanel(settings, applyAndPersist);
        setupImageToggle();
        setupCardAuthorLabels();
    }

})();