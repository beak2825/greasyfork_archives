// ==UserScript==
// @name         Crowd ID Extractor (人群ID获取插件)
// @namespace    https://greasyfork.org/zh-CN/users/1549793-swzift
// @version      2025-12-18.1
// @description  批量 / 单行获取数据引擎、达摩盘、策略平台、京东人群 ID
// @author       swzift
// @match        https://databank.tmall.com/*
// @match        https://strategy.tmall.com/*
// @match        https://dmp.taobao.com/*
// @match        https://4a.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559434/Crowd%20ID%20Extractor%20%28%E4%BA%BA%E7%BE%A4ID%E8%8E%B7%E5%8F%96%E6%8F%92%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559434/Crowd%20ID%20Extractor%20%28%E4%BA%BA%E7%BE%A4ID%E8%8E%B7%E5%8F%96%E6%8F%92%E4%BB%B6%29.meta.js
// ==/UserScript==
let observerStarted = false;

function startTableObserver(injectFn) {
  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(() => {
    injectFn();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function injectHeaderSafely(injectFn, retry = 10) {
  const tryInject = () => {
    injectFn();
    if (document.querySelector(".tm-batch-btn, .tm-batch-copy")) return;
    if (retry <= 0) return;
    retry--;
    setTimeout(tryInject, 300);
  };
  tryInject();
}

(function () {
  "use strict";

  function observeDMPHeaderActions() {
    if (window.__tm_dmp_header_observing__) return;
    window.__tm_dmp_header_observing__ = true;

    const observer = new MutationObserver(() => {
      injectDMPBatchButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("[TM] DMP header observer started");
  }

  // Your code here...
  /***********************
   * 1️⃣ 缓存当前页人群数据
   ***********************/
  let crowdListCache = [];
  let strategyListCache = [];
  const originFetch = window.fetch;

  if (location.host === "dmp.taobao.com") {
    observeDMPHeaderActions();
  }

  /***********************
   * 2️⃣ 拦截 fetch
   ***********************/
  window.fetch = async (...args) => {
    const res = await originFetch(...args);
    try {
      const url = args[0]?.url || args[0];
      console.log("url", url);

      const u = new URL(url, location.origin);
      if (
        u.search.includes("/api/v1/custom/list") &&
        !u.search.endsWith("listSource") &&
        !u.search.endsWith("listPerspective")
      ) {
        const clone = res.clone();
        const json = await clone.json();

        // ⚠️ 根据真实接口结构调整
        crowdListCache = json?.data?.list || [];

        console.log("[油猴] 捕获人群列表：", crowdListCache);
        const host = location.hostname;
        if (host === "strategy.tmall.com") {
          startTableObserver(injectStrategyRowButtons);
          injectHeaderSafely(injectBatchButtonIntoHeader);
        } else {
          startTableObserver(injectRowButtons);
          injectHeaderSafely(injectBatchButton);
        }
      }
    } catch (e) {}

    return res;
  };

  /***********************
   * 3️⃣ 给每一行加「获取ID」按钮
   ***********************/
  function injectRowButtons() {
    const rows = document.querySelectorAll("table tbody tr");
    if (!rows.length || !crowdListCache.length) return;

    let dataIndex = 0; // ⭐ 核心修复点

    rows.forEach((row) => {
      // 1️⃣ 过滤 clone / hover 行
      if (row.getAttribute("aria-hidden") === "true") return;

      // 2️⃣ 防重复
      if (row.dataset.tmInjected === "1") return;

      const crowd = crowdListCache[dataIndex];
      if (!crowd) return;

      dataIndex++; // ⭐ 只有真实行才推进索引

      // ⭐ 找画像透视按钮
      const perspectiveBtn = row.querySelector("button.crowd-perspective-btn");
      if (!perspectiveBtn) return;

      // 防重复插
      if (row.querySelector(".tm-get-id")) return;

      const copyBtn = perspectiveBtn.cloneNode(true);
      copyBtn.classList.add("tm-get-id");

      const span = copyBtn.querySelector("span");
      if (span) span.innerText = "复制 ID";

      copyBtn.removeAttribute("data-glog-id");
      copyBtn.removeAttribute("data-next-component");

      copyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(String(crowd.id));
        alert(`人群名称：${crowd.name}\n人群 ID ：${crowd.id}`);
      };

      perspectiveBtn.parentNode.insertBefore(copyBtn, perspectiveBtn);

      row.dataset.tmInjected = "1";
    });
  }

  function injectStrategyRowButtons() {
    const rows = document.querySelectorAll("table tbody tr");
    if (!rows.length || !crowdListCache.length) return;

    let dataIndex = 0; // ⭐ 专门给真实行用的 index

    rows.forEach((row) => {
      // 1️⃣ 过滤 clone 行
      if (row.getAttribute("aria-hidden") === "true") return;

      // 2️⃣ 防重复
      if (row.dataset.tmInjected === "1") {
        dataIndex++; // ⚠️ 仍然要推进
        return;
      }

      const crowd = crowdListCache[dataIndex];
      dataIndex++; // ⭐ 核心：只对真实行递增

      if (!crowd) return;

      const actionsBar = row.querySelector("td.operate-cell .actions-bar");
      if (!actionsBar) return;

      if (actionsBar.querySelector(".tm-copy-id")) return;

      const refBtn = actionsBar.querySelector("a,button");
      if (!refBtn) return;

      const copyBtn = refBtn.cloneNode(true);
      copyBtn.classList.add("tm-copy-id");

      copyBtn.removeAttribute("href");
      copyBtn.removeAttribute("target");

      copyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(String(crowd.id));
        alert(`人群名称：${crowd.name}\n人群 ID ：${crowd.id}`);
      };

      const span = copyBtn.querySelector('span[role="img"]');
      if (span) {
        span.innerHTML = "ID";
        span.style.fontSize = "12px";
        span.style.fontWeight = "600";
      }

      actionsBar.appendChild(copyBtn);
      row.dataset.tmInjected = "1";
    });
  }

  /***********************
   * 4️⃣ 批量获取按钮
   ***********************/
  function injectBatchButton() {
    // 防重复
    if (document.querySelector(".tm-batch-btn")) return;
    if (!crowdListCache.length) return;

    // ⭐ 找到「人群创建」按钮
    const createBtn = document.querySelector(
      'button[data-glog-id="customCrowdList-createCrowd"]'
    );
    if (!createBtn) return;

    // ⭐ clone 官方按钮
    const batchBtn = createBtn.cloneNode(true);
    batchBtn.classList.add("tm-batch-btn");

    batchBtn.style.marginRight = "12px";

    // ⭐ 改文案
    const helper = batchBtn.querySelector(".next-btn-helper");
    if (helper) helper.innerText = "批量获取人群 ID";

    // ⭐ 清理可能干扰的属性
    batchBtn.removeAttribute("data-glog-id");

    // ⭐ 绑定批量复制逻辑
    batchBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const data = crowdListCache.map((i) => ({
        id: i.id,
        name: i.name || i.crowdName || "",
      }));

      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert(`已复制 ${data.length} 个人群 ID`);
      console.table(data);
    };

    // ⭐ 插入到「人群创建」左侧
    createBtn.parentNode.insertBefore(batchBtn, createBtn);
  }

  function injectBatchButtonIntoHeader() {
    // 防止重复插入
    if (document.querySelector(".tm-batch-copy")) return;
    if (!crowdListCache.length) return;

    // 找到“新建人群”按钮
    const refBtn = document.querySelector("button.addCrowd");
    if (!refBtn) return;

    const container = refBtn.parentElement;
    if (!container) return;

    // clone 一个按钮，保证样式一致
    const batchBtn = refBtn.cloneNode(true);
    batchBtn.classList.add("tm-batch-copy");

    // 移除加号 icon
    const plusIcon = batchBtn.querySelector(".icon-plus");
    if (plusIcon) plusIcon.remove();

    // 修改文字
    const textSpan = batchBtn.querySelector("span");
    if (textSpan) {
      textSpan.innerText = "批量获取人群 ID";
    }

    // 清理无关属性
    batchBtn.removeAttribute("data-glog-id");

    // 绑定批量复制逻辑
    batchBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const data = crowdListCache.map((i) => ({
        id: i.id,
        name: i.name || i.crowdName || "",
      }));

      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert(`已复制 ${data.length} 个人群 ID`);
    };

    // 插入到同一行（放在后面）
    container.appendChild(batchBtn);
  }

  function injectDMPBatchButton() {
    // 防重复
    if (document.querySelector(".tm-dmp-batch-copy")) return;

    // 找「批量管理人群」按钮
    const batchManageBtn = Array.from(
      document.querySelectorAll("button.btn")
    ).find((btn) => btn.textContent.includes("批量管理人群"));

    if (!batchManageBtn) return;

    // clone 原按钮
    const copyBtn = batchManageBtn.cloneNode(true);
    copyBtn.classList.add("tm-dmp-batch-copy");

    // 改文案
    copyBtn.textContent = "批量获取人群 ID";

    // 清理原事件
    copyBtn.removeAttribute("mx-click");
    copyBtn.removeAttribute("data-spm-click");

    copyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const result = [];

      document.querySelectorAll("tr .color-9").forEach((idDiv) => {
        const idMatch = idDiv.textContent.match(/ID：(\d+)/);
        if (!idMatch) return;

        // ⭐ 关键：回到 ID 所在的 td
        const td = idDiv.closest("td");
        if (!td) return;

        // ⭐ 人群名称 = 这个 td 里的第一个 span
        const nameSpan = td.querySelector("span");
        const name = nameSpan?.innerText?.trim() || "未知人群";

        result.push({
          id: idMatch[1],
          name,
        });
      });

      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert(`已复制 ${result.length} 个人群`);
      console.table(result);
    };

    // 插到右侧
    batchManageBtn.parentNode.insertBefore(copyBtn, batchManageBtn.nextSibling);

    console.log("[TM] DMP 批量获取人群 ID + 名称 按钮已插入");
  }
})();

(function () {
  "use strict";

  const ID_REGEX = /\b\d{10,20}\b/;

  /***********************
   * 工具：从一行中提取 ID
   ***********************/
  function extractCrowdIdFromRow(tr) {
    if (!tr) return null;
    const text = tr.innerText || "";
    const match = text.match(ID_REGEX);
    return match ? match[0] : null;
  }

  function getJDCrowdNameFromRow(tr) {
    if (!tr) return "";

    const tds = Array.from(tr.querySelectorAll("td")).filter(
      (td) =>
        !td.className.includes("fix-right") &&
        td.innerText &&
        td.innerText.trim().length > 2 // ⭐ 关键：有实际文本
    );

    if (!tds.length) return "";
    return tds[0].innerText.trim();
  }

  /***********************
   * 单行注入「复制 ID」
   ***********************/
  function injectJDRowCopyButtons() {
    const btnGroups = document.querySelectorAll(
      "td.jd-table-cell-fix-right-first .btnGroupWrapper___j8lvm"
    );

    btnGroups.forEach((btnGroup) => {
      // 防重复
      if (btnGroup.querySelector(".tm-jd-copy-id")) return;

      // 找“详情”按钮
      const detailBtn = Array.from(
        btnGroup.querySelectorAll(".optBtn___MWXVT")
      ).find((el) => el.innerText.trim() === "详情");

      if (!detailBtn) return;

      // 向上找 tr
      const tr = btnGroup.closest("tr");
      if (!tr) return;

      // ✅ ID（JD 稳定来源）
      const crowdId =
        tr.getAttribute("data-row-key") ||
        tr.dataset.rowKey ||
        tr.getAttribute("data-id");

      if (!crowdId) return;

      // ✅ 名称（从 DOM 拿）
      const crowdName = getJDCrowdNameFromRow(tr);

      // clone 官方按钮
      const copyBtn = detailBtn.cloneNode(true);
      copyBtn.innerText = "复制ID";
      copyBtn.classList.add("tm-jd-copy-id");

      copyBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        navigator.clipboard.writeText(String(crowdId));
        alert(`人群名称：${crowdName || "未知"}\n人群 ID ：${crowdId}`);
      };

      // 插入到“详情”左边
      btnGroup.insertBefore(copyBtn, detailBtn);
    });
  }

  function collectJDCrowdData() {
    const rows = document.querySelectorAll("table tbody tr");
    const result = [];

    rows.forEach((tr) => {
      // ✅ 1️⃣ 用 JD 表格的 row-key / data-row-key
      const id =
        tr.getAttribute("data-row-key") ||
        tr.dataset.rowKey ||
        tr.getAttribute("data-id");

      if (!id) return; // ⚠️ 没 ID 直接跳过

      // ✅ 2️⃣ 名称一般在第 2 列（JD 的标准）
      const nameCell = tr.querySelector("td:nth-child(2)");
      const name = nameCell?.innerText?.trim() || "";

      result.push({
        id,
        name,
      });
    });

    return result;
  }

  /***********************
   * 批量复制按钮（顶部）
   ***********************/
  function injectBatchButton() {
    if (document.querySelector(".tm-jd-batch-copy")) return;

    const wrapper = document.querySelector(".wrapper___itLM9 .jd-space");
    if (!wrapper) return;

    // ⭐ 用「人群圈选」作为样式源
    const primaryBtn = wrapper.querySelector("button.jd-btn-primary");
    if (!primaryBtn) return;

    // clone primary
    const batchBtn = primaryBtn.cloneNode(true);
    batchBtn.classList.add("tm-jd-batch-copy");

    const span = batchBtn.querySelector("span");
    if (span) span.innerText = "批量复制 ID";

    batchBtn.onclick = () => {
      const data = collectJDCrowdData();

      if (!data.length) {
        alert("未找到人群 ID");
        return;
      }

      navigator.clipboard.writeText(JSON.stringify(data, null, 2));

      alert(`已复制 ${data.length} 个人群 ID`);
      console.table(data);
    };

    // ⭐ 用 jd-space-item 包裹，保证间距
    const spaceItem = document.createElement("div");
    spaceItem.className = "jd-space-item";
    spaceItem.appendChild(batchBtn);

    // 插到最左 or 批量推送左侧
    wrapper.insertBefore(spaceItem, wrapper.children[2]); // 批量推送前
  }

  /***********************
   * MutationObserver（核心）
   ***********************/
  function startObserver() {
    const observer = new MutationObserver(() => {
      injectJDRowCopyButtons();
      injectBatchButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /***********************
   * 启动
   ***********************/
  startObserver();
})();
