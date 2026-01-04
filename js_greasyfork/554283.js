// ==UserScript==
// @name         GitHub 过期仓库筛选器
// @namespace    https://greasyfork.org/zh-CN/users/1532235-stanley-ewing
// @version      1.0
// @description  自动标记或隐藏 GitHub 搜索结果中的过期仓库，支持自定义过期时间来筛选。
// @author       cscny
// @match        https://github.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554283/GitHub%20%E8%BF%87%E6%9C%9F%E4%BB%93%E5%BA%93%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554283/GitHub%20%E8%BF%87%E6%9C%9F%E4%BB%93%E5%BA%93%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Part 1: 配置与样式 ---
  const CONFIG = {
    TARGET_SEARCH_TYPES: ["repositories"],
    DEFAULT_STALE_THRESHOLD_YEARS: 1,
    STALE_OPACITY: 0.55,
  };

  // [THEMED] 主题自适应
  GM_addStyle(`
        /* 核心标记样式 */
        .is-stale-repo {
            opacity: ${CONFIG.STALE_OPACITY} !important;
            transition: all 0.2s ease-in-out;
            padding-left: 16px !important;
            padding-right: 16px !important;
            position: relative;
        }
        .is-stale-repo:hover { opacity: 1 !important; }
        .is-stale-repo::before {
            content: ''; position: absolute; left: 0; top: 50%;
            transform: translateY(-50%); width: 4px; height: calc(100% - 16px);
            border-radius: 4px; background: linear-gradient(160deg, #a966ff, #3c91ff, #ff8966);
        }
        .is-stale-repo::after {
            content: ''; position: absolute; right: 0; top: 50%;
            transform: translateY(-50%); width: 4px; height: calc(100% - 16px);
            border-radius: 4px; background: linear-gradient(160deg, #a966ff, #3c91ff, #ff8966);
        }
        .stale-repo-badge {
            display: inline-flex; align-items: center; margin-left: 8px;
            padding: 1px 7px; font-size: 11px;
            font-weight: 700; color: #cb2431;
            background-color: #fcf0f1; border: 1px solid #cb2431;
            border-radius: 2em; vertical-align: middle; cursor: help;
        }
        .is-stale-repo.hide-mode { display: none !important; }


        

        /* 模态对话框 UI (已适配主题) */
        #marker-settings-dialog-backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--color-backdrop-bg, rgba(132, 117, 117, 0.4));
            z-index: 99998; display: flex; align-items: center; justify-content: center;
        }
        #marker-settings-dialog {
            background-color: var(--color-canvas-overlay, #5787cbff);
            color: var(--color-fg-default);
            border: 1px solid var(--color-border-default);
            border-radius: 12px;
            box-shadow: var(--color-shadow-large);
            width: 320px;
            padding: 20px;
            animation: fadeInDialog 0.2s ease-out;
        }
        #marker-settings-dialog h3 {
            margin: 0 0 16px; font-size: 16px; font-weight: 600;
            border-bottom: 1px solid var(--color-border-muted);
            padding-bottom: 8px;
        }
        #marker-settings-dialog .setting-group {
            margin-bottom: 15px;
            border-bottom: 1px solid var(--color-border-muted);
            padding-bottom: 15px;
        }
        #marker-settings-dialog .setting-group:last-of-type {
            border-bottom: none; margin-bottom: 0; padding-bottom: 0;
        }
        #marker-settings-dialog label {
            font-weight: 600; display: block; margin-bottom: 8px; font-size: 14px;
        }
        #marker-settings-dialog .radio-label {
            font-weight: normal; display: flex; align-items: center;
        }
        #marker-settings-dialog input[type="radio"] {
            margin-right: 8px;
        }
        #marker-settings-dialog input[type="number"] {
            width: 100%;
            box-sizing: border-box;
            padding: 5px 12px;
            border-radius: 6px;
            border: 1px solid var(--color-border-default, #ba202fff);
            background-color: var(--color-canvas-inset);
            color: var(--color-fg-default);
        }
        #marker-settings-dialog button {
            width: 100%;
            padding: 8px;
            margin-top: 20px;
            border-radius: 6px;
            border: 1px solid var(--color-btn-primary-border);
            background-color: var(--color-btn-primary-bg);
            color: var(--color-btn-primary-fg);
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #marker-settings-dialog button:hover {
            background-color: var(--color-btn-primary-hover-bg);
        }
        @keyframes fadeInDialog {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `);

  // --- Part 2: 核心功能 ---
  const markerModule = {
    staleDate: null,
    currentThreshold: CONFIG.DEFAULT_STALE_THRESHOLD_YEARS,
    currentMode: "mark",

    loadSettings() {
      this.currentMode = GM_getValue("markerMode", "mark");
      this.currentThreshold = GM_getValue(
        "staleThreshold",
        CONFIG.DEFAULT_STALE_THRESHOLD_YEARS
      );
      this.staleDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - this.currentThreshold)
      );
    },
    saveSettings(mode) {
      this.currentMode = mode;
      GM_setValue("markerMode", mode);
      this.applyModeChange();
    },
    applyModeChange() {
      document.querySelectorAll(".is-stale-repo").forEach((repo) => {
        repo.classList.toggle("hide-mode", this.currentMode === "hide");
      });
    },
    updateThreshold(years) {
      this.currentThreshold =
        parseFloat(years) || CONFIG.DEFAULT_STALE_THRESHOLD_YEARS;
      this.staleDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - this.currentThreshold)
      );
      GM_setValue("staleThreshold", this.currentThreshold);
      document
        .querySelectorAll(".is-stale-repo, .processed-v1")
        .forEach((repo) => {
          repo.classList.remove("is-stale-repo", "hide-mode", "processed-v1");
          const badge = repo.querySelector(".stale-repo-badge");
          if (badge) badge.remove();
        });
      intelligentObserver.scanAll();
    },
    parseDate(dateString) {
      if (!dateString) return null;
      try {
        const cleanedString = dateString
          .replace(/^(更新于 on|Updated on|on)\s+/, "")
          .trim();
        let match = cleanedString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (match) {
          const [_, y, m, d] = match;
          return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
        }
        const date = new Date(cleanedString);
        if (!isNaN(date.getTime())) {
          return date;
        }
        return null;
      } catch (e) {
        console.error("日期解析失败:", dateString, e);
        return null;
      }
    },
    processRepo(repoItem) {
      if (
        !repoItem ||
        repoItem.nodeType !== 1 ||
        repoItem.classList.contains("processed-v1")
      )
        return;
      repoItem.classList.add("processed-v1");
      const lastListItem = repoItem.querySelector("ul > li:last-of-type");
      const titleContainer = repoItem.querySelector(
        '.search-title, [class*="search-title"]'
      );
      if (!lastListItem || !titleContainer) return;
      const dateElement = lastListItem.querySelector("[title]");
      const titleLink = titleContainer.querySelector("a");
      if (!dateElement || !titleLink) return;
      const updateDate = this.parseDate(dateElement.getAttribute("title"));
      if (updateDate && updateDate < this.staleDate) {
        repoItem.classList.add("is-stale-repo");
        if (
          !titleLink.nextElementSibling ||
          !titleLink.nextElementSibling.classList.contains("stale-repo-badge")
        ) {
          const badge = document.createElement("span");
          badge.className = "stale-repo-badge";
          badge.textContent = " 陈旧 ";
          badge.title = `最后更新于: ${updateDate.toLocaleDateString()}`;
          titleLink.insertAdjacentElement("afterend", badge);
        }
        if (this.currentMode === "hide") {
          repoItem.classList.add("hide-mode");
        }
      }
    },
  };

  // --- Part 3: UI 交互模块 ---
  function openSettingsDialog() {
    if (document.getElementById("marker-settings-dialog-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.id = "marker-settings-dialog-backdrop";
    const dialog = document.createElement("div");
    dialog.id = "marker-settings-dialog";
    dialog.innerHTML = `
            <h3>筛选器设置</h3>
            <div class="setting-group">
                <label>显示模式</label>
                <label class="radio-label"><input type="radio" name="marker-mode" value="mark"> 标记陈旧项目</label>
                <label class="radio-label"><input type="radio" name="marker-mode" value="hide"> 隐藏陈旧项目(配合自动翻页脚本最佳)</label>
            </div>
            <div class="setting-group">
                <label for="stale-threshold-input">“陈旧”定义 (年)</label>
                <input type="number" id="stale-threshold-input" step="0.5" min="0.5">
            </div>
            <button id="marker-dialog-close-btn">完成</button>
        `;
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    dialog.querySelector(
      `input[value="${markerModule.currentMode}"]`
    ).checked = true;
    const thresholdInput = dialog.querySelector("#stale-threshold-input");
    thresholdInput.value = markerModule.currentThreshold;
    backdrop.addEventListener("click", () =>
      document.body.removeChild(backdrop)
    );
    dialog.addEventListener("click", (e) => e.stopPropagation());
    dialog
      .querySelector("#marker-dialog-close-btn")
      .addEventListener("click", () => document.body.removeChild(backdrop));
    dialog.addEventListener("change", (e) => {
      if (e.target.name === "marker-mode") {
        markerModule.saveSettings(e.target.value);
      }
    });
    let debounceTimer;
    thresholdInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const newThreshold = parseFloat(thresholdInput.value);
        if (newThreshold && newThreshold >= 0.1) {
          markerModule.updateThreshold(newThreshold);
        }
      }, 500);
    });
  }
  GM_registerMenuCommand("⚙️ 筛选器设置", openSettingsDialog);

  // --- Part 4: 页面监控模块 ---
  const intelligentObserver = {
    observer: null,

    handleMutations(mutations) {
      if (!this.isRepoSearchPage()) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (
            node.parentElement &&
            node.parentElement.getAttribute("data-testid") === "results-list"
          ) {
            markerModule.processRepo(node);
          }
          const repos = node.querySelectorAll(
            'div[data-testid="results-list"] > div'
          );
          if (repos.length > 0) {
            repos.forEach((repo) => markerModule.processRepo(repo));
          }
        }
      }
    },
    isRepoSearchPage() {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      return (
        window.location.pathname === "/search" &&
        (CONFIG.TARGET_SEARCH_TYPES.includes(type) || type === null)
      );
    },
    scanAll() {
      if (!this.isRepoSearchPage()) return;
      document
        .querySelectorAll(
          'div[data-testid="results-list"] > div:not(.processed-v1)'
        )
        .forEach((repo) => markerModule.processRepo(repo));
    },
    start() {
      markerModule.loadSettings();

      const targetNode = document.querySelector("main") || document.body;

      this.observer = new MutationObserver((mutations) =>
        this.handleMutations(mutations)
      );
      this.observer.observe(targetNode, { childList: true, subtree: true });

      setTimeout(() => this.scanAll(), 500);
      document.addEventListener("turbo:load", () => {
        setTimeout(() => this.scanAll(), 500);
      });
    },
  };

  // --- 启动脚本 ---
  intelligentObserver.start();
})();
