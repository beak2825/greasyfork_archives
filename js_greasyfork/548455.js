// ==UserScript==
// @name         查关键词排名Dev
// @namespace    http://tampermonkey.net/
// @version      3.9.2
// @description  dev_Test环境 1.startPage 2.并发 3.503等捕获处理 待优化：错误处理(指数退避（Exponential Backoff）策略)、并发策略优化(并发关键词)、结果处理优化(保留排名高的 totalRank 最小的)、网络请求优化、日志 & 可视化优化、代码结构 &可维护性优化。已做:(搜索核心中先统计自然位置再解析)
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548455/%E6%9F%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8E%92%E5%90%8DDev.user.js
// @updateURL https://update.greasyfork.org/scripts/548455/%E6%9F%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8E%92%E5%90%8DDev.meta.js
// ==/UserScript==

// npm run obfuscate

// 自然位置、广告位置的购物车按钮
// 小并行请求 加快速度
// 建议超时+分型重试+指数退避
// 1.startPage 2.并发 3.503等捕获处理 待优化：错误处理(指数退避（Exponential Backoff）策略)
// 并发策略优化(并发关键词)、结果处理优化(保留排名高的 totalRank 最小的)
// 网络请求优化、日志 & 可视化优化、代码结构 &可维护性

(async function () {
  "use strict";

  // —— 配置区 ——
  const DEFAULT_MAX_PAGES = 5; // 默认最多搜索页数
  const ITEMS_PER_PAGE = 48; // 默认每一页的自然位置
  const STYLE = `
    /* 容器 */
    #tm-asin-container {
        position: fixed;
        top: 60px;
        left: 0; right: 0;
        padding: 6px 12px;
        background: #fff;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        font-family: "Helvetica Neue", Arial, sans-serif;
        z-index: 9999;
        display: flex;
        align-items: center;
    }

    /* tag-wrapper-css */
    #tm-asin-container #tag-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-right: 6px;
    }

    .tag-item {
        display: inline-flex;
        align-items: center;
        height: 28px;
        padding: 0 8px;
        font-size: 14px;
        background: #ecf5ff;
        color: #409eff;
        border: 1px solid #b3d8ff;
        border-radius: 4px;
    }

    .tag-item .tag-close {
        display: inline-block;
        margin-left: 4px;
        font-style: normal;
        cursor: pointer;
        color: #409eff;
        font-weight: bold;
    }

    .tag-item .tag-close:hover {
        color: #66b1ff;
    }

    .tag-add-btn {
        display: inline-flex;
        align-items: center;
        height: 32px;
        padding: 0 12px;
        font-size: 14px;
        color: #409eff;
        background: #fff;
        border: 1px solid #409eff;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color .2s;
    }

    .tag-add-btn:hover {
        background-color: #ecf5ff;
    }

    /* 临时输入框 */
    .tag-input {
        flex: 1;
        min-width: 100px;
        height: 28px;
        padding: 0 6px;
        font-size: 14px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        outline: none;
    }
    /* input错误提示 */
    .input-error {
        border-color: red;
        outline: none;
        box-shadow: 0 0 5px red;
    }

    /* ASIN 和页数输入框 */
    #tm-asin-container input[type="number"] {
        margin-right: 14px;
        font-size: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        color: #606266;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
        width: 200px;
        box-sizing: border-box;
    }
    #tm-asin-container input:focus {
        border-color: #409eff;
        box-shadow: 0 0 2px rgba(64,158,255,0.2);
    }

    /* 文件上传按钮 追加 ElementUI Button 样式 */
    .el-button {
        display: inline-block;
        line-height: 1.5;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 500;
        padding: 6px 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        background-color: #fff;
        color: #606266;
        transition: background-color .2s, border-color .2s, color .2s;
        margin-right: 12px;
        }
    .el-button--primary {
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;
        }
    .el-button--primary:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
        }
    /* 按钮 */
    #tm-asin-container button {
        margin-right: 12px;
        padding: 5px 10px;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        background-color: #409eff;
        border: 1px solid #409eff;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color .2s, border-color .2s;
    }
    #tm-asin-container button:hover:not([disabled]) {
        background-color: #66b1ff;
        border-color: #66b1ff;
    }

    #tm-asin-container span {
        font-size: 16px;
    }
    /* 状态文字：紧跟按钮后面 */
    #tm-asin-container span#tm-status {
        margin-left: 12px;
        margin-right: 12px;
        font-size: 16px;
        color:rgb(110, 111, 111);
    }
    /* 面板button样式 */
    #batch-results-panel .rp-jump-btn {
        margin-top: 2px;
        margin-left: 6px;
        margin-bottom: 3.5px;
        line-height: 12px;
        color: #5ba7f4;
        background-color: #ecf5ff;
        border: 1px solid;
        border-radius: 5px;
        padding-top: 2px;
        cursor: pointer;
        transition: background-color .2s, color .2s, border-color .2s;
    }

    #batch-results-panel .rp-jump-btn:hover {
        background-color: #5ba7f4;
        color: #ffffff;
        border-color: #5ba7f4;
    }

    #batch-results-panel .rp-jump-btn.hovered {
      background-color: #5ba7f4 !important;
      border-color: #5ba7f4 !important;
      color: #ffffff !important;
      font-weight: bold !important;
    }

    #batch-results-panel .dw-jump-btn {
        width: 0px;
        background-color: #ffffff;
        border: 0px;
        line-height: 12px;
        margin-top: -3px;
        font-size: 18px;
        padding: 0px;
        cursor: pointer;'
        transition: font-size .2s;
    }

    #batch-results-panel .dw-jump-btn:hover {
        font-size: 20px;
    }
  `;

  // —— 状态 ——
  let maxPages = 0;
  let startPage = 1;
  let keywords = [];
  // tag-wrapper-2 初始化数据
  let tagAsins = [];
  const maxTags = 5;

  // —— 注入样式 & UI ——
  const styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // container框
  const container = document.createElement("div");
  container.id = "tm-asin-container";
  // tag-wrapper-1
  const tagWrapper = document.createElement("div");
  tagWrapper.id = "tag-wrapper";
  container.insertBefore(tagWrapper, container.firstChild);
  // Max🔎Pages
  const maxPageText = document.createElement("span");
  maxPageText.textContent = "Max🔎Pages：";
  // maxpage input
  const inputPages = document.createElement("input");
  inputPages.type = "number";
  inputPages.min = "1";
  inputPages.max = DEFAULT_MAX_PAGES;
  inputPages.value = 3;
  inputPages.style.width = "60px";
  // page查找顺序
  const pageSequenceText = document.createElement("span");
  pageSequenceText.textContent = "Page查找顺序：";
  // maxpage input
  const pageSequenceNum = document.createElement("input");
  pageSequenceNum.type = "number";
  pageSequenceNum.min = "1";
  pageSequenceNum.max = DEFAULT_MAX_PAGES;
  pageSequenceNum.value = sessionStorage.getItem("tm_startPage") || "1";
  pageSequenceNum.style.width = "60px";
  pageSequenceNum.addEventListener("change", () => {
    let val = Math.max(1, parseInt(pageSequenceNum.value) || 1);
    pageSequenceNum.value = val;
    sessionStorage.setItem("tm_startPage", val);
  });
  // clear storage
  const btnClearCache = document.createElement("button");
  btnClearCache.textContent = "清除缓存";
  // upload button
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".xlsx,.xls";
  fileInput.style.display = "none";
  // status的div的元素
  const status = document.createElement("span");
  status.setAttribute("id", "tm-status");
  status.textContent = '上传 ASIN Excel 文件, 点击"搜索排名"';
  // 创建一个 ElementUI 风格的标签按钮
  const uploadLabel = document.createElement("label");
  uploadLabel.className = "el-button el-button--primary";
  uploadLabel.textContent = "⬆上传关键词";
  uploadLabel.appendChild(fileInput); // 把 fileInput 内嵌到 label
  // 批量搜索按钮
  const batchSearchBtn = document.createElement("button");
  batchSearchBtn.className = "el-button el-button--primary";
  batchSearchBtn.textContent = "批量搜索🔍";
  // 下载按钮
  const downloadBtn = document.createElement("button");
  downloadBtn.className = "el-button el-button--primary";
  downloadBtn.textContent = "下载结果表";
  /* 动画过渡——container栏的伸缩 */
  container.style.transition = "top 0.4s ease";
  let ticking = false;
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          container.style.top = window.scrollY > lastScrollY ? "0" : "55px";
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // —— 初始化时尝试读取缓存 ——
  const storedTags = sessionStorage.getItem("tm_tagAsins");
  if (storedTags) {
    try {
      tagAsins = JSON.parse(storedTags);
    } catch { }
  }
  batchSearchBtn.disabled = true;
  const keywordResult = sessionStorage.getItem("tm_keywords");
  if (keywordResult) {
    batchSearchBtn.disabled = false;
    console.log(`已有缓存keywords 可以直接批量搜索`);
    try {
      keywords = JSON.parse(keywordResult);
    } catch { }
  }
  const storedBatch = sessionStorage.getItem("tm_batch_table");
  if (storedBatch) {
    try {
      const table = JSON.parse(storedBatch);
      renderResultsPanelFromTable(table);
    } catch { }
  }
  // tag-wrapper-3 渲染
  function renderTags() {
    tagWrapper.innerHTML = "";
    // 渲染每个 tag
    tagAsins.forEach((tag, idx) => {
      const span = document.createElement("span");
      span.className = "tag-item";
      span.textContent = tag;
      // close按钮
      const close = document.createElement("i");
      close.className = "tag-close";
      close.textContent = "×";
      close.addEventListener("click", () => {
        tagAsins.splice(idx, 1);
        renderTags();
      });
      span.appendChild(close);
      tagWrapper.appendChild(span);
    });
    // 渲染"+ New Asin"按钮
    const btnAdd = document.createElement("button");
    btnAdd.className = "tag-add-btn";
    btnAdd.textContent = "+ New Asin";
    btnAdd.addEventListener("click", showInput);
    tagWrapper.appendChild(btnAdd);
  }

  // 放在 showInput 定义外，整个文件可复用
  const asinRegex = /^B0[A-Z0-9]{8}$/;

  function addAsinsFromRaw(raw, tagAsins, maxTags) {
    if (!raw) return { added: [], invalid: [], dup: [], overflow: [] };

    // 支持空格 / 换行 / 逗号分隔
    const tokens = raw
      .split(/[\s,]+/)
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const uniq = [];
    const seenTmp = new Set();
    for (const t of tokens) {
      if (!seenTmp.has(t)) { seenTmp.add(t); uniq.push(t); }
    }

    const invalid = uniq.filter(t => !asinRegex.test(t));
    const candidates = uniq.filter(t => asinRegex.test(t));

    // 过滤已存在
    const dup = candidates.filter(t => tagAsins.includes(t));
    const fresh = candidates.filter(t => !tagAsins.includes(t));

    // 处理上限
    const remain = Math.max(0, maxTags - tagAsins.length);
    const added = fresh.slice(0, remain);
    const overflow = fresh.slice(remain);

    // 实际落库
    tagAsins.push(...added);

    return { added, invalid, dup, overflow };
  }
  // tag-wrapper-4 显示输入框新增
  function showInput() {
    const existingInput = tagWrapper.querySelector("input.tag-input");
    if (existingInput) { existingInput.focus(); return; }

    const input = document.createElement("input");
    input.className = "tag-input";
    input.placeholder = "输入 ASIN（空格/换行/逗号分隔，最多3个）";
    tagWrapper.insertBefore(input, tagWrapper.querySelector(".tag-add-btn"));
    input.focus();

    const handleConfirm = (e) => {
      const isEnter = e.type === "keydown" && e.key === "Enter";
      const isBlur = e.type === "blur";
      if (!isEnter && !isBlur) return;

      const raw = input.value.trim();
      // 空值：直接移除输入框
      if (!raw) {
        input.remove();
        renderTags();
        return;
      }

      const { added, invalid, dup, overflow } = addAsinsFromRaw(raw, tagAsins, maxTags);

      // 反馈（可按需精简）
      const msgs = [];
      if (added.length) msgs.push(`已添加：${added.join(", ")}`);
      if (dup.length) msgs.push(`已存在：${dup.join(", ")}`);
      if (invalid.length) msgs.push(`格式不合法：${invalid.join(", ")}`);
      if (overflow.length) msgs.push(`超过上限(仅保留前${maxTags}个)：${overflow.join(", ")}`);

      // 收尾
      input.remove();
      renderTags();
    };

    input.addEventListener("keydown", handleConfirm);
    input.addEventListener("blur", handleConfirm);
  }
  // tag-wrapper-5 初次渲染
  renderTags();

  [
    maxPageText,
    inputPages,
    pageSequenceText,
    pageSequenceNum,
    btnClearCache,
    status,
    uploadLabel,
    batchSearchBtn,
    downloadBtn,
  ].forEach((el) => container.appendChild(el));
  document.body.appendChild(container);

  // —— 状态更新 ——
  const updateStatus = (txt) => {
    status.textContent = txt;
  };


  // —— 缓存清除 ——
  btnClearCache.addEventListener("click", () => {
    sessionStorage.removeItem("tm_tagAsins");
    sessionStorage.removeItem("tm_keywords");
    sessionStorage.removeItem("tm_batch_table");
    sessionStorage.removeItem("tm_startPage");

    // 请填写 ASIN, 点击"搜索排名
    updateStatus('上传 ASIN Excel 文件, 点击"搜索排名');

    tagAsins = [];
    keywords = [];

    renderTags();
    renderResultsPanelFromTable();

    const batchPanel = document.getElementById("batch-results-panel");
    if (batchPanel) batchPanel.remove();

    // 清空文件输入，否则再次选择相同文件不会触发 change
    fileInput.value = "";
  });

  // 动态加载 SheetJS（xlsx.full.min.js），确保全局有 XLSX
  async function loadSheetJSLib() {
    // 已经加载过，直接返回
    if (window.XLSX) return Promise.resolve();

    // 避免重复加载：检查是否已有加载中的 Promise
    if (loadSheetJSLib._loading) return loadSheetJSLib._loading;

    const CDN_URLS = [
      "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
      "https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js"
    ];

    loadSheetJSLib._loading = new Promise(async (resolve, reject) => {
      let loaded = false;

      // 超时控制（4s）
      const timer = setTimeout(() => {
        if (!loaded) reject(new Error("加载 XLSX 超时"));
      }, 4000);

      for (let i = 0; i < CDN_URLS.length; i++) {
        const url = CDN_URLS[i];
        try {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = url;
            s.async = true;
            s.onload = () => {
              if (window.XLSX) {
                loaded = true;
                clearTimeout(timer);
                res();
              } else {
                rej(new Error("XLSX 全局变量未找到"));
              }
            };
            s.onerror = () => rej(new Error(`加载失败: ${url}`));
            document.head.appendChild(s);
          });
          // 成功加载某个 CDN
          return resolve();
        } catch (err) {
          console.warn(err.message);
          // 继续尝试下一个 CDN
        }
      }

      clearTimeout(timer);
      reject(new Error("所有 CDN 都加载失败"));
    });

    return loadSheetJSLib._loading;
  }

  // 然后在设置 fileInput 监听之前，先调用它
  await loadSheetJSLib();

  // —— excel文件解析 ——
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) alert("未选择文件");

    // 校验文件大小：不超过 1MB
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert("Excel 文件不能大于 1MB，请选择更小的文件。");
      fileInput.value = ""; // 清空选中文件
      return;
    }

    // 读取并解析
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // 只取每行第一列，过滤空值并 trim
    keywords = rows
      .map((row) => row[0])
      .filter((cell) => typeof cell === "string" && cell.trim().length > 0)
      .map((cell) => cell.trim());

    sessionStorage.setItem("tm_keywords", JSON.stringify(keywords));
    batchSearchBtn.disabled = false;
    alert(`已导入并缓存 ${keywords.length} 条关键词`);
    console.log("keywords keywords keywords", keywords);
  });

  // 工具-睡眠和随机数
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 封装一个生成 header 的函数
  function createHeader(panel, title = "查询结果") {
    const header = document.createElement("div");
    header.id = "results-header";
    header.textContent = title;
    Object.assign(header.style, {
      cursor: "move",
      background: "#f5f5f5",
      padding: "6px 8px",
      borderBottom: "1px solid #ddd",
      fontWeight: "600",
      fontSize: "16px",
    });
    panel.appendChild(header);

    // 拖拽逻辑
    header.addEventListener("mousedown", (e) => {
      const rect = panel.getBoundingClientRect();
      const dx = e.clientX - rect.left;
      const dy = e.clientY - rect.top;

      function mm(ev) {
        panel.style.left = ev.clientX - dx + "px";
        panel.style.top = ev.clientY - dy + "px";
      }

      document.addEventListener("mousemove", mm);
      document.addEventListener(
        "mouseup",
        () => document.removeEventListener("mousemove", mm),
        { once: true }
      );
      e.preventDefault();
    });
  }
  // 结果面板显示
  function renderResultsPanelFromTable(table) {
    if (!Array.isArray(table) || table.length === 0) {
      console.log('return; //空数据不渲染');
      return; //空数据不渲染
    }
    // 创建/复用面板
    let panel = document.getElementById("batch-results-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "batch-results-panel";
      Object.assign(panel.style, {
        position: "fixed",
        top: "100px",
        left: "10px",
        background: "rgba(255,255,255,0.95)",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: "9999",
        width: "380px",
        fontSize: "14px",
        lineHeight: "1.4",
        display: "flex",
        flexDirection: "column",
        maxHeight: "500px",
      });
      document.body.appendChild(panel);
      createHeader(panel, "查询结果");
    } else {
      panel.innerHTML = "";
      const header = document.createElement("div");
      header.textContent = "查询结果";
      Object.assign(header.style, {
        cursor: "move",
        background: "#f5f5f5",
        padding: "6px 8px",
        borderBottom: "1px solid #ddd",
        fontWeight: "600",
        fontSize: "16px",
      });
      panel.appendChild(header);
    }
    // 内容区带滚动条
    const content = document.createElement("div");
    Object.assign(content.style, {
      overflowY: "auto",
      flex: "1",
      padding: "10px 16px",
    });

    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";

    // 获取上一次点击信息
    let lastClickedRaw = sessionStorage.getItem("tm_lastClickedRpButton");
    let lastClicked = lastClickedRaw ? JSON.parse(lastClickedRaw) : { keyword: null, page: null };

    table.forEach(({ keyword, asin, page, position, totalRank }) => {
      const li = document.createElement("li");
      li.style.marginBottom = "6px";
      li.style.marginLeft = "6px"

      const text = document.createElement("span");
      text.innerHTML =
        `<strong>${keyword}</strong> | ASIN: ${asin} | ` +
        (page
          ? `第${page}页 第${position}位 总排名${totalRank}`
          : `<span style="color:#f56c6c;">未找到</span>`);
      li.appendChild(text);

      const btnJump = document.createElement("button");
      btnJump.className = "rp-jump-btn";
      btnJump.dataset.page = page;
      btnJump.dataset.keyword = keyword;
      btnJump.textContent = "➡";
      btnJump.style.marginLeft = "8px";

      // 新页面加载时自动高亮上一次点击按钮
      if (keyword === lastClicked.keyword && page === lastClicked.page) {
        btnJump.classList.add("hovered");
      }

      li.appendChild(btnJump);

      if (page) {
        const btnLoc = document.createElement("button");
        btnLoc.className = "dw-jump-btn";
        btnLoc.dataset.asin = asin;
        btnLoc.textContent = "📍";
        btnLoc.style.marginLeft = "4px";
        li.appendChild(btnLoc);
      }

      ul.appendChild(li);
    });
    content.appendChild(ul);
    panel.appendChild(content);

    // 点击事件委托
    panel.onclick = (e) => {
      const jump = e.target.closest(".rp-jump-btn");
      if (jump) {
        const page = +jump.dataset.page;
        const keyword = jump.dataset.keyword;

        // 先移除上一次 hover
        const oldBtn = panel.querySelector(".rp-jump-btn.hovered");
        if (oldBtn) oldBtn.classList.remove("hovered");
        // 当前按钮加 hover
        jump.classList.add("hovered");
        // 存储到 sessionStorage
        sessionStorage.setItem("tm_lastClickedRpButton", JSON.stringify({ keyword, page }));

        const url = new URL(window.location.origin + "/s");
        url.searchParams.set("k", keyword);
        if (page > 1) url.searchParams.set("page", page);
        location.href = url.href;
        return;
      }
      const loc = e.target.closest(".dw-jump-btn");
      if (loc) {
        const a = loc.dataset.asin;
        const nodes = Array.from(
          document.querySelectorAll(`.s-main-slot > [data-asin="${a}"]`)
        );
        const el = nodes.find(
          (n) => !n.querySelector(".puis-sponsored-label-text")
        );
        if (el) {
          el.style.border = "2px solid red";
          el.style.padding = "5px";
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          alert(`当前页未找到 ASIN：${a}`);
        }
      }
    };
  }

  // —— 批量搜索 ——
  batchSearchBtn.addEventListener("click", async () => {
    if (!keywords.length) {
      return alert("请先导入关键词文件");
    }
    if (!tagAsins.length) {
      return alert("请先添加至少一个 ASIN");
    }

    let table = [];
    updateStatus(`🔎 开始批量查询：${keywords.length} 个关键词`);

    // 优化点9/6 并发关键词
    for (const keyword of keywords) {
      updateStatus(`🔎 查询关键词 "${keyword}" 下所有 ASIN`);
      maxPages = inputPages.value
      startPage = Number(sessionStorage.getItem("tm_startPage")) || 1;
      const results = await fetchAsinsWithDelay(keyword, tagAsins, maxPages, startPage);
      table.push(...results);
    }
    table = deduplicateByBestRank(table)
    console.log('table = deduplicateByBestRank(table)', table);
    sessionStorage.setItem("tm_tagAsins", JSON.stringify(tagAsins));
    sessionStorage.setItem("tm_batch_table", JSON.stringify(table));
    alert("搜索完成，共 " + table.length + " 条记录, 面板仅展示最优排名");
    renderResultsPanelFromTable(table);
  });

  // 批量搜索-并发关键词
  // batchSearchBtn.addEventListener("click", async () => {
  //   if (!keywords.length) {
  //     return alert("请先导入关键词文件");
  //   }
  //   if (!tagAsins.length) {
  //     return alert("请先添加至少一个 ASIN");
  //   }

  //   updateStatus(`🔎 开始批量查询：${keywords.length} 个关键词`);

  //   let table = [];
  //   const concurrency = 3; // 每次并发跑多少个关键词
  //   const executing = new Set();

  //   async function runKeyword(keyword) {
  //     updateStatus(`🔎 查询关键词 "${keyword}" 下所有 ASIN`);
  //     const maxPages = inputPages.value;
  //     const startPage = Number(sessionStorage.getItem("tm_startPage")) || 1;
  //     const results = await fetchAsinsWithDelay(keyword, tagAsins, maxPages, startPage);
  //     table.push(...results);
  //   }

  //   for (const keyword of keywords) {
  //     const p = runKeyword(keyword).finally(() => executing.delete(p));
  //     executing.add(p);

  //     if (executing.size >= concurrency) {
  //       await Promise.race(executing);
  //     }
  //   }

  //   await Promise.all(executing);

  //   // 去重保留最优排名
  //   table = deduplicateByBestRank(table);
  //   console.log("table = deduplicateByBestRank(table)", table);

  //   sessionStorage.setItem("tm_tagAsins", JSON.stringify(tagAsins));
  //   sessionStorage.setItem("tm_batch_table", JSON.stringify(table));
  //   alert("搜索完成，共 " + table.length + " 条记录, 面板仅展示最优排名");
  //   renderResultsPanelFromTable(table);
  // });

  // —— 包装后的 fetch 函数，包含随机延迟 & 错误退避
  async function fetchAsinsWithDelay(keyword, asins, maxPages, startPage) {
    // 随机间隔0.5-1s
    await sleep(randomBetween(500, 1000));
    try {
      return await fetchAsinsPosition(keyword, asins, maxPages, startPage);
    } catch (err) {
      console.warn(`Request failed for ${keyword}:`, err);
      await sleep(randomBetween(30000, 60000));
      return fetchAsinsPosition(keyword, asins, maxPages, startPage);
    }
  }

  // 去重保留排名最高的
  function deduplicateByBestRank(table) {
    const bestMap = new Map(); // key: keyword, value: 最佳记录

    for (const item of table) {
      const existing = bestMap.get(item.keyword);

      if (!existing) {
        // 当前 keyword 第一次出现
        bestMap.set(item.keyword, item);
      } else {
        const existingRank = existing.totalRank ?? Infinity;
        const currentRank = item.totalRank ?? Infinity;

        if (currentRank < existingRank) {
          // 当前记录排名更高（totalRank更小），替换
          bestMap.set(item.keyword, item);
        }
        // 如果两条都是 null 或 currentRank >= existingRank，则保留原来的
      }
    }

    return Array.from(bestMap.values());
  }

  // —— 判断广告
  function isAd(node) {
    // 方式 1: 精确判断广告徽标的 a 标签
    if (node.querySelector("a.puis-sponsored-label-text")) {
      return true;
    }

    // 方式 2: 兜底判断 aria-label（跨语言）
    const aria = node.querySelector("[aria-label]")?.getAttribute("aria-label") || "";
    const keywords = ["sponsored", "gesponser", "sponsorisé", "sponsorizzato", "patrocinado", "スポンサー", "赞助"];
    if (keywords.some(k => aria.toLowerCase().includes(k))) {
      return true;
    }

    return false;
  }
  // —— 搜索函数：处理多个 ASIN + 503 延时重试 + 跨关键词继续
  async function fetchAsinsPosition(keyword, asins, maxPages, startPage = 1, concurrency = 3, maxRetries = 3) {
    const base = new URL("/s", location.origin);
    base.searchParams.set("k", keyword);
    base.searchParams.delete("page");
    const asinsSet = new Set(asins);

    const foundResults = [];
    const failedPages = []; // 记录失败页

    // 构建页码顺序
    const pageSequence = [];
    for (let p = startPage; p <= maxPages; p++) pageSequence.push(p);
    for (let p = startPage - 1; p >= 1; p--) pageSequence.push(p);

    // 取maxPages、concurrency大的一个
    const batchSize = maxPages <= concurrency ? maxPages : concurrency;

    for (let i = 0; i < pageSequence.length; i += batchSize) {
      const batchPages = pageSequence.slice(i, i + batchSize);

      // 并发请求当前批次(并发优化页数)
      const batchResults = await Promise.all(
        batchPages.map(async (page) => {
          try {
            base.searchParams.set("page", page);
            const html = await fetch(base.href, { credentials: "include" }).then(r => {
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              return r.text();
            });

            const doc = new DOMParser().parseFromString(html, "text/html");
            const mainSlot = doc.querySelector("div.s-main-slot.s-result-list.s-search-results.sg-row");
            if (!mainSlot) return [];

            let nat = 0;
            const allNodes = mainSlot.querySelectorAll(":scope > div[data-asin][data-component-type='s-search-result']");
            // 仅自然结果
            const naturalNodes = allNodes.filter(node => !isAd(node));
            const results = [];

            for (const node of naturalNodes) {
              nat++;
              const asin = node.getAttribute("data-asin");
              if (asinsSet.has(asin)) {
                results.push({
                  keyword,
                  asin,
                  page,
                  position: nat,
                  totalRank: (page - 1) * ITEMS_PER_PAGE + nat,
                  found: true,
                });
              }
            }
            return results;
          } catch (err) {
            console.warn(`请求失败 page=${page}:`, err.message);
            failedPages.push(page); // 记录失败页，稍后重试
            return [];
          }
        })
      );

      for (const res of batchResults) {
        if (res.length > 0) foundResults.push(...res);
      }

      // 检查是否所有 ASIN 都已找到
      const foundAsins = foundResults.map(r => r.asin);
      if (asins.every(a => foundAsins.includes(a))) return foundResults;
    }

    // —— 重试失败页 ——
    for (const page of failedPages) {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          base.searchParams.set("page", page);
          const html = await fetch(base.href, { credentials: "include" }).then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text();
          });

          const doc = new DOMParser().parseFromString(html, "text/html");
          const mainSlot = doc.querySelector("div.s-main-slot.s-result-list.s-search-results.sg-row");
          if (!mainSlot) break;

          let nat = 0;
          const nodes = mainSlot.querySelectorAll(":scope > div[data-asin][data-component-type='s-search-result']");
          for (const node of nodes) {
            if (isAd(node)) continue;
            nat++;
            const asin = node.getAttribute("data-asin");
            if (asins.includes(asin)) {
              // 避免重复记录
              if (!foundResults.some(r => r.asin === asin && r.keyword === keyword)) {
                foundResults.push({
                  keyword,
                  asin,
                  page,
                  position: nat,
                  totalRank: (page - 1) * nodes.length + nat,
                  found: true,
                });
              }
            }
          }
          break; // 成功则跳出重试循环
        } catch (err) {
          attempt++;
          console.warn(`重试失败 page=${page} attempt=${attempt}:`, err.message);
          await new Promise(res => setTimeout(res, 1000 * attempt)); // 延时重试
        }
      }
    }

    // 没找到的 ASIN 补全
    for (const asin of asins) {
      if (!foundResults.some(r => r.asin === asin)) {
        foundResults.push({
          keyword,
          asin,
          page: 0,
          position: 0,
          totalRank: null,
          found: false,
        });
      }
    }

    return foundResults;
  }

  // 优化 以上
  // async function fetchPage(keyword, asins, page) {
  //   const url = new URL("/s", location.origin);
  //   url.searchParams.set("k", keyword);
  //   url.searchParams.set("page", page);

  //   const html = await fetch(url.href, { credentials: "include" }).then(r => {
  //     if (!r.ok) throw new Error(`HTTP ${r.status}`);
  //     return r.text();
  //   });

  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   const mainSlot = doc.querySelector("div.s-main-slot.s-result-list.s-search-results.sg-row");
  //   if (!mainSlot) return [];

  //   let nat = 0;
  //   const nodes = mainSlot.querySelectorAll(":scope > div[data-asin][data-component-type='s-search-result']");
  //   const results = [];

  //   for (const node of nodes) {
  //     if (isAd(node)) continue;
  //     nat++;
  //     const asin = node.getAttribute("data-asin");
  //     if (asins.includes(asin)) {
  //       results.push({
  //         keyword,
  //         asin,
  //         page,
  //         position: nat,
  //         totalRank: (page - 1) * nodes.length + nat,
  //         found: true,
  //       });
  //     }
  //   }
  //   return results;
  // }
  // async function fetchAsinsPosition(keyword, asins, maxPages, startPage = 1, concurrency = 3, maxRetries = 3) {
  //   const foundResults = [];
  //   const failedPages = [];

  //   // 构建页码顺序
  //   const pageSequence = [];
  //   for (let p = startPage; p <= maxPages; p++) pageSequence.push(p);
  //   for (let p = startPage - 1; p >= 1; p--) pageSequence.push(p);

  //   const batchSize = Math.min(maxPages, concurrency);

  //   for (let i = 0; i < pageSequence.length; i += batchSize) {
  //     const batchPages = pageSequence.slice(i, i + batchSize);

  //     const batchResults = await Promise.all(batchPages.map(async page => {
  //       try {
  //         return await fetchPage(keyword, asins, page);
  //       } catch (err) {
  //         console.warn(`请求失败 page=${page}:`, err.message);
  //         failedPages.push(page);
  //         return [];
  //       }
  //     }));

  //     batchResults.forEach(res => { if (res.length) foundResults.push(...res); });

  //     // 如果所有 ASIN 已找到，提前返回
  //     const foundAsins = foundResults.map(r => r.asin);
  //     if (asins.every(a => foundAsins.includes(a))) return foundResults;
  //   }

  //   // —— 503 重试逻辑 ——
  //   for (const page of failedPages) {
  //     for (let attempt = 1; attempt <= maxRetries; attempt++) {
  //       try {
  //         const res = await fetchPage(keyword, asins, page);
  //         res.forEach(r => {
  //           if (!foundResults.some(f => f.asin === r.asin && f.keyword === r.keyword)) {
  //             foundResults.push(r);
  //           }
  //         });
  //         break; // 成功跳出重试循环
  //       } catch (err) {
  //         console.warn(`重试失败 page=${page} attempt=${attempt}:`, err.message);
  //         await new Promise(res => setTimeout(res, 1000 * attempt)); // 指数延时
  //       }
  //     }
  //   }

  //   // 补全没找到的 ASIN
  //   asins.forEach(asin => {
  //     if (!foundResults.some(r => r.asin === asin)) {
  //       foundResults.push({
  //         keyword,
  //         asin,
  //         page: 0,
  //         position: 0,
  //         totalRank: null,
  //         found: false,
  //       });
  //     }
  //   });

  //   return foundResults;
  // }

  // excel导出函数
  async function exportToExcel(data) {
    // 1️按关键词聚合，挑选最佳排名
    const merged = {};
    data.forEach(({ keyword, asin, page, position }) => {
      const totalRank = page != null ? (page - 1) * 48 + position : null;
      if (!merged[keyword]) {
        merged[keyword] = { keyword, asin, page, position, totalRank };
      } else {
        const exist = merged[keyword];
        if (totalRank != null && (exist.totalRank == null || totalRank < exist.totalRank)) {
          merged[keyword] = { keyword, asin, page, position, totalRank };
        }
      }
    });

    const processed = Object.values(merged).map(
      ({ asin, keyword, page, position, totalRank }) => ({
        关键词: keyword,
        ASIN: asin,
        页数: page == null ? "-" : page,
        位置: position == null ? "-" : position,
        总排名: totalRank == null ? "-" : totalRank,
      })
    );

    // 2️生成工作表
    const ws = XLSX.utils.json_to_sheet(processed);

    // 表头加粗居中
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      const cell = ws[cellAddress];
      if (!cell) continue;
      cell.s = { font: { bold: true }, alignment: { horizontal: "center" } };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "排名结果");

    const host = window.location.host;
    const siteMap = {
      "www.amazon.com": "US",
      "www.amazon.co.uk": "UK",
      "www.amazon.ca": "CA",
      "www.amazon.de": "DE",
      "www.amazon.fr": "FR",
      "www.amazon.es": "ES",
      "www.amazon.it": "IT",
      "www.amazon.co.jp": "JP",
    };
    const siteCode = siteMap[host] || host;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const fileName = `${dateStr}-${siteCode}-AsinKwRank.xlsx`;

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 点击时，从 sessionStorage 取出缓存的 table，并调用 exportToExcel
  downloadBtn.addEventListener("click", async () => {
    if (!raw) {
      return alert("当前没有可下载的查询结果，请先执行批量搜索。");
    }
    let table;
    try {
      table = JSON.parse(raw);
    } catch {
      return alert("结果数据解析失败。");
    }
    // 调用之前定义的导出函数
    await exportToExcel(table);
  });
})();