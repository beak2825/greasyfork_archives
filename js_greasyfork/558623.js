// ==UserScript==
// @name         自动填写助手
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  自动填写助手-个人使用
// @author       Edison
// @match        https://learnfront.cyjy.net/task/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cyjy.net
// @require      https://fastly.jsdelivr.net/npm/zh-address-parse@1.3.16/dist/zh-address-parse.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558623/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558623/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * 选择器配置
 */
const SELECTORS = {
  editor: '[id^="w-e-textarea-"]',
  scoreInput: 'input[role="spinbutton"]',

  // 完整路径
  yearSelect:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(5) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-select-selector",
  yearSelectedTag:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(5) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-select-selector > div",
  sceneContainer:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(6) > div > div.ant-col.ant-form-item-control > div > div",
  categorySelect:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(7) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-select-selector",
  sourceBtn:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(8) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-row.ant-form-item.Item > div > div > div > button",
  sourceInput:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(8) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-row.ant-form-item.Item > div > div > div > div > div > div > div > div.ant-popover-inner > div.ant-popover-inner-content > input",
  sourceConfirm:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(8) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-row.ant-form-item.Item > div > div > div > div > div > div > div > div.ant-popover-inner > div.ant-popover-inner-content > div > button.ant-btn.ant-btn-primary.ant-btn-sm.ml10",
  sourceDisplay:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(9) > div > div.ant-col.ant-form-item-control > div > div > span",
  addressTrigger:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(10) > div > div.ant-col.ant-form-item-control > div > div > div",
  questionTypeContainer:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(11) > div > div.ant-col.ant-form-item-control > div > div",
  groupSelect:
    "#app > div > div.resizable-layout > div.right-panel > div > form > div > div:nth-child(13) > div > div.ant-col.ant-form-item-control > div > div > div > div.ant-select-selector",
};

/**
 * UI 工具类
 */
const UI = {
  // 等待元素，超时会打印具体的 selector
  wait: function (selectorOrElement, timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (selectorOrElement instanceof Element)
        return resolve(selectorOrElement);

      const selector = selectorOrElement;
      if (document.querySelector(selector))
        return resolve(document.querySelector(selector));

      const startTime = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        if (Date.now() - startTime > timeout) {
          clearInterval(timer);
          // === 关键修改：详细报错 ===
          console.error(
            `❌ [UI.wait] 超时！找不到元素，请检查 Selector 是否变化:\n${selector}`
          );
          reject(new Error(`Timeout: 找不到元素 ${selector}`));
        }
      }, 200);
    });
  },

  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

  click: async function (selectorOrElement) {
    try {
      const el = await this.wait(selectorOrElement);
      el.focus && el.focus();
      ["mousedown", "mouseup", "click"].forEach((evt) => {
        el.dispatchEvent(
          new MouseEvent(evt, { bubbles: true, cancelable: true, view: window })
        );
      });
      el.click && el.click();
      return el;
    } catch (e) {
      // 捕获 wait 抛出的错误，避免红屏，只在控制台显示
      console.warn(`⚠️ [UI.click] 跳过操作，原因: ${e.message}`);
    }
  },

  type: async function (selectorOrElement, value) {
    try {
      const el = await this.wait(selectorOrElement);
      el.value = "";
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      if (nativeSetter) {
        nativeSetter.call(el, value);
      } else {
        el.value = value;
      }
      ["input", "change"].forEach((evt) =>
        el.dispatchEvent(new Event(evt, { bubbles: true }))
      );
    } catch (e) {
      console.warn(`⚠️ [UI.type] 输入失败: ${e.message}`);
    }
  },

  // 精简了日志，去掉冗余的 Step 信息
  clickText: async function (selector, text) {
    try {
      await this.wait(selector);
      let retries = 10;
      while (retries > 0) {
        const elements = document.querySelectorAll(selector);
        for (let el of elements) {
          if (el.innerText.trim() === text) {
            el.click();
            return;
          }
        }
        await this.sleep(200);
        retries--;
      }
      console.warn(`⚠️ [UI.clickText] 在 ${selector} 中未找到文本 "${text}"`);
    } catch (e) {
      console.error(e.message);
    }
  },

  selectTreeBySearch: async function (triggerDiv, searchText) {
    const input =
      triggerDiv.querySelector("input") ||
      triggerDiv.querySelector(".ant-select-selection-search-input");
    if (input) {
      await UI.type(input, searchText);
      await UI.sleep(500);
      await UI.clickText(".ant-select-tree-node-content-wrapper", searchText);
    } else {
      console.error("❌ [TreeSearch] 树形选择器中找不到输入框 input");
    }
  },

  selectAntOption: async function (targetText) {
    await UI.sleep(300);
    let dropdown = null;
    let maxRetries = 10;
    while (maxRetries > 0) {
      const allDropdowns = document.querySelectorAll(
        ".ant-select-dropdown:not(.ant-select-dropdown-hidden):not([style*='display: none'])"
      );
      if (allDropdowns.length > 0) {
        dropdown = allDropdowns[allDropdowns.length - 1];
        if (dropdown.innerText.trim() !== "") break;
      }
      await UI.sleep(200);
      maxRetries--;
    }

    if (!dropdown) {
      console.error(
        "❌ [SelectOption] 未找到任何可见的下拉菜单 (ant-select-dropdown)"
      );
      return;
    }

    const listHolder = dropdown.querySelector(".rc-virtual-list-holder-inner");
    const options = listHolder
      ? listHolder.querySelectorAll(".ant-select-item-option")
      : dropdown.querySelectorAll(".ant-select-item-option");

    let found = false;
    for (let opt of options) {
      const content = opt.querySelector(".ant-select-item-option-content");
      const text = content ? content.innerText : opt.innerText;
      if (text.trim() === targetText) {
        opt.click();
        found = true;
        return;
      }
    }
    if (!found) {
      console.warn(`⚠️ [SelectOption] 下拉菜单中未找到选项: "${targetText}"`);
    }
  },

  // 通知容器数组，用于管理多个通知
  _notifications: [],

  notification: function (text) {
    const div = document.createElement("div");
    div.innerText = text;
    div.style.cssText =
      "position: fixed; left: 70%; transform: translateX(-50%); background: #bfff94ff; padding: 10px 20px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10000; font-size: 14px; transition: top 0.3s ease;";

    // 添加到通知数组
    this._notifications.push(div);

    // 计算位置（从上往下堆叠，起始位置 20px）
    this._updateNotificationPositions();

    document.body.appendChild(div);

    // 3秒后移除
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.3s ease, top 0.3s ease';
      setTimeout(() => {
        div.remove();
        // 从数组中移除
        const index = this._notifications.indexOf(div);
        if (index > -1) {
          this._notifications.splice(index, 1);
          // 更新剩余通知的位置
          this._updateNotificationPositions();
        }
      }, 300);
    }, 3000);
  },

  _updateNotificationPositions: function () {
    let topOffset = 20; // 起始位置
    this._notifications.forEach((notif) => {
      notif.style.top = topOffset + 'px';
      topOffset += notif.offsetHeight + 10; // 每个通知之间间隔10px
    });
  },

  loadScript: function (url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = () => {
        console.error(`❌ 加载外部库失败: ${url}`);
        reject(new Error(`加载失败: ${url}`));
      };
      document.head.appendChild(script);
    });
  },
};

/**
 * 配置管理器
 */
const ConfigManager = {
  KEY: "auto_fill_config",
  data: { titleRules: [], sourceRules: [] },
  init: function () {
    const saved = localStorage.getItem(this.KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        this.updateStatus();
      } catch (e) { }
    }
  },
  save: function () {
    localStorage.setItem(this.KEY, JSON.stringify(this.data));
    UI.notification("配置已保存");
  },
  importFromExcel: function (file) {
    if (!window.XLSX) {
      UI.notification("XLSX 库尚未加载完成，请稍后...");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const parseSheet = (sheetName) => {
          if (!workbook.Sheets[sheetName]) return [];
          return XLSX.utils
            .sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
            .slice(1)
            .filter((row) => row[0] && row[1])
            .map((row) => ({
              key: String(row[0]).trim(),
              value: String(row[1]).trim(),
            }));
        };
        if (workbook.SheetNames.length >= 1)
          this.data.titleRules = parseSheet(workbook.SheetNames[0]);
        if (workbook.SheetNames.length >= 2)
          this.data.sourceRules = parseSheet(workbook.SheetNames[1]);
        this.save();
        this.updateStatus();
      } catch (err) {
        console.error("❌ Excel 解析失败", err);
        UI.notification("Excel 解析失败");
      }
    };
    reader.readAsArrayBuffer(file);
  },
  updateStatus: function () {
    const statusEl = document.getElementById("config-status-display");
    if (statusEl) {
      statusEl.innerText = `(题干:${this.data.titleRules.length}, 来源:${this.data.sourceRules.length})`;
      statusEl.style.color = "#265c0cff";
    }
  },
  matchRule: function (text, ruleKey) {
    if (!text || !ruleKey) return false;
    const conditions = ruleKey.trim().split(/\s+/);
    for (let condition of conditions) {
      if (!condition) continue;
      if (condition.startsWith("&")) {
        if (!text.includes(condition.substring(1))) return false;
      } else if (condition.startsWith("!")) {
        if (text.includes(condition.substring(1))) return false;
      } else {
        if (!text.includes(condition)) return false;
      }
    }
    return true;
  },
  getMatchedScenes: function (title, source) {
    const scenes = new Set();
    const check = (text, rules) => {
      if (text)
        rules.forEach(
          (rule) => this.matchRule(text, rule.key) && scenes.add(rule.value)
        );
    };
    if (title) {
      check(title, this.data.titleRules);
    }
    if (source) {
      check(source, this.data.sourceRules);
    }
    return Array.from(scenes);
  },
};

/**
 * 业务逻辑集合
 */
const App = {
  clearContent: function (text) {
    // 删除传入的字符串
    const editor = document.querySelector(SELECTORS.editor);
    if (!editor) {
      console.error(
        `❌ [getAndCleanTitle] 找不到题干编辑器，Selector: ${SELECTORS.editor}`
      );
      return null;
    }
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node = walker.nextNode();
    while (node) {
      if (node.textContent.trim().length > 0) {
        const regex = new RegExp(text);
        const match = node.textContent.match(regex);
        if (match) {
          node.textContent = node.textContent.replace(regex, "");
          editor.dispatchEvent(new Event("input", { bubbles: true }));
          return true;
        }
      }
      node = walker.nextNode();
    }
    return false;
  },

  getAndCleanTitle: async function (remove = false) {
    const editor = document.querySelector(SELECTORS.editor);
    if (!editor) {
      console.error(
        `❌ [getAndCleanTitle] 找不到题干编辑器，Selector: ${SELECTORS.editor}`
      );
      return null;
    }
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node = walker.nextNode();
    while (node) {
      if (node.textContent.trim().length > 0) {
        const regex = /^\s*(?:（[^）]*）|\([^)]*\))/;
        const match = node.textContent.match(regex);
        if (match) {
          if (remove) {
            node.textContent = node.textContent.replace(regex, "");
            editor.dispatchEvent(new Event("input", { bubbles: true }));
          }
          return match[0].trim().replace(/^[（(]|[)）]$/g, "");
        }
        if (remove) UI.notification("未找到类似 (1) 的题号前缀");
        return null;
      }
      node = walker.nextNode();
    }
    return null;
  },

  getScore: async function () {
    const el = document.querySelector(SELECTORS.scoreInput);
    if (!el) {
      console.error(
        `❌ [getScore] 找不到星级输入框，Selector: ${SELECTORS.scoreInput}`
      );
      return 0;
    }
    const val = parseFloat(el.value);
    if (!val) {
      UI.notification("⚠️ 请先填写题目难度星级");
      throw new Error("无难度星级"); // 中断流程
    }
    return val;
  },

  selectCategory: async function (score) {
    let category = "思维拓展题";
    if (score <= 0.4) category = "基础题";
    else if (score <= 0.6) category = "综合运用题";

    await UI.click(SELECTORS.categorySelect);
    await UI.selectAntOption(category);
  },

  selectYear: async function (title) {
    const yearRegex = /\b(19|20)\d{2}\b/g;
    let availableYears = title.match(yearRegex) || [];

    // 检查已选
    const selectedTag = document.querySelector(SELECTORS.yearSelectedTag);
    if (selectedTag) {
      const existing = selectedTag.textContent.match(yearRegex);
      if (existing)
        availableYears = availableYears.filter((y) => y !== existing[0]);
    }
    availableYears = [...new Set(availableYears)];

    if (availableYears.length > 0) {
      await UI.click(SELECTORS.yearSelect);
      for (const year of availableYears) {
        await UI.sleep(500);
        await UI.selectAntOption(year + "年");
      }
    }
  },

  paraseAddr: function (title) {
    if (typeof ZhAddressParse === "undefined") {
      console.error("❌ ZhAddressParse 库未定义，无法解析地址");
      return;
    }
    // 清洗字符串 去掉数字和特殊字符
    title = title.replace(/[^\p{L}\s]/gu, "");

    const addr = ZhAddressParse(title);
    return addr;
  },

  selectAddress: async function (title) {
    const addr = App.paraseAddr(title);
    if (addr.province) {
      const trigger = await UI.click(SELECTORS.addressTrigger);
      await UI.selectTreeBySearch(trigger, addr.province);
      if (addr.city) {
        await UI.selectTreeBySearch(trigger, addr.city);
        if (addr.area) await UI.selectTreeBySearch(trigger, addr.area);
      }
    }
  },

  addSource: async function (title) {
    if (!title) return;
    await UI.click(SELECTORS.sourceBtn);
    await UI.type(SELECTORS.sourceInput, title);
    await UI.sleep(100);
    await UI.click(SELECTORS.sourceConfirm);
  },

  selectQuestionType: async function (title) {
    const types = [
      "基础题",
      "压轴题",
      "典型题",
      "易错易混题",
      "同步题",
      "教材改编题",
      "原创题",
      "教材原题",
      "跨学科",
      "传统文化题",
      "竞赛题",
      "新考法",
      "新情境",
      "方法模型",
    ];
    for (let i = 0; i < types.length; i++) {
      if (title.indexOf(types[i]) > -1) {
        // 使用模板字符串拼接，如果找不到会通过 UI.click 的 catch 打印警告
        await UI.click(
          `${SELECTORS.questionTypeContainer} > span:nth-child(${i + 1})`
        );
        await UI.sleep(100);
      }
    }
  },

  selectGroup: async function (score) {
    let group = "提升";
    if (score <= 0.4) group = "基础";
    else if (score <= 0.6) group = "巩固";
    await UI.click(SELECTORS.groupSelect);
    await UI.selectAntOption(group);
  },

  selectScene: async function (title, sourceFrom) {
    try {
      const matchedScenes = ConfigManager.getMatchedScenes(title, sourceFrom);
      const sceneOptions = [
        "课前预习",
        "同步练习",
        "课后作业",
        "单元测试",
        "阶段练习",
        "月考",
        "期中",
        "期末",
        "专题练习",
        "开学考试",
        "假期作业",
        "统考、联考题",
        "高考真题",
        "高考模拟",
      ];

      for (let scene of matchedScenes) {
        const idx = sceneOptions.indexOf(scene);
        if (idx > -1) {
          const el = await UI.wait(
            `${SELECTORS.sceneContainer} > span:nth-child(${idx + 1})`
          );
          el.click();
        }
        await UI.sleep(200);
      }
      return sourceFrom;
    } catch (e) {
      console.warn(
        "⚠️ 无法获取当前【来源】字段，可能该元素不存在或 Selector 错误"
      );
      return "";
    }
  },

  validateTitle: function (title) {
    const addr = this.paraseAddr(title);
    const hasLocation = addr.province || addr.city || addr.area;
    const hasYear = /\d{4}/.test(title);

    if (!hasLocation || !hasYear) {
      const missing = [];
      if (!hasLocation) missing.push("地区信息");
      if (!hasYear) missing.push("年份信息");

      UI.notification(`⚠️ 题目缺少${missing.join("和")}，无法自动填写`);
      throw new Error(`⚠️ 题目缺少${missing.join("和")}，无法自动填写`); // 中断流程
    }
    return true;
  },

  startTask: async function () {
    const btn = document.getElementById("my-smart-auto-btn");
    const originalText = btn ? btn.innerText : "";
    if (btn) {
      btn.innerText = "执行中...";
      btn.disabled = true;
      btn.style.cursor = "not-allowed";
      btn.style.opacity = "0.6";
    }

    try {
      console.log("=== 开始执行自动填写 ===");
      UI.notification(`自动填写开始`);
      let stepCount = 0;
      // 清除内容
      App.clearContent("（多选）");
      App.clearContent("母题");

      // 如果这里报错（例如没有星级），会自动跳到 catch
      const score = await App.getScore();
      let title = '';
      title = await App.getAndCleanTitle();
      // 判断内容中是否有年份或者地区，如果没有的话提示

      if (title) {
        const addr = App.paraseAddr(title);
        const hasLocation = addr.province || addr.city || addr.area;
        if (hasLocation) {
          // 地区
          await App.selectAddress(title);
          stepCount++;
        } else {
          console.error("⚠️ 题目缺少地区信息，跳过[地区]");
          UI.notification("⚠️ 题目缺少地区信息，跳过[地区]");
        }
        // 来源
        await App.addSource(title);
        stepCount++;
        // 题类
        await App.selectQuestionType(title);
        stepCount++;
      }

      // 录入源
      const sourceEl = await UI.wait(SELECTORS.sourceDisplay, 3000);
      const sourceFrom = sourceEl.textContent;
      // 场景
      await App.selectScene(title, sourceFrom);
      stepCount++;
      // 题目分类
      await App.selectCategory(score);
      stepCount++;
      // 试题年份
      await App.selectYear(title + sourceFrom);
      stepCount++;

      // 分组
      if (sourceFrom && sourceFrom.indexOf("实验班") !== -1) {
        await App.selectGroup(score);
        stepCount++;
      }

      console.log(`✅ 自动填写完成，共 ${stepCount} 步`);
      UI.notification(`自动填写完成，执行 ${stepCount} 步`);
    } catch (e) {
      if (e.message !== "无难度星级") {
        console.error("❌ 任务中断:", e);
        UI.notification(`自动填写失败，${e.message}`);
      }
    } finally {
      if (btn) {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
      }
    }
  },
};

/**
 * 主程序入口
 */
(function () {
  const BTN_ID = "my-smart-auto-btn";

  function createButton(header, text, color, onClick, isPrimary = true) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.className = isPrimary ? "ant-btn ant-btn-primary" : "ant-btn";
    btn.onclick = onClick;
    Object.assign(btn.style, {
      marginLeft: "15px",
      fontWeight: "bold",
      ...(isPrimary ? { backgroundColor: color, borderColor: color } : {}),
    });
    if (isPrimary) btn.id = BTN_ID;
    header.appendChild(btn);
  }

  function createImportControl(header) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx, .xls, .csv";
    fileInput.style.display = "none";
    fileInput.onchange = (e) => {
      if (e.target.files.length)
        ConfigManager.importFromExcel(e.target.files[0]);
      fileInput.value = "";
    };
    header.appendChild(fileInput);
    createButton(header, "导入配置", "#52c41a", () => fileInput.click(), false);
    const status = document.createElement("span");
    status.id = "config-status-display";
    Object.assign(status.style, {
      marginLeft: "10px",
      fontSize: "12px",
      color: "#999",
    });
    status.innerText = "(配置未加载)";
    header.appendChild(status);
  }

  function checkAndInject() {
    // 这里的 scoreInput 只是用来判断当前页面是否是目标页面
    const target = document.querySelector(SELECTORS.scoreInput);
    const header = document.querySelector("header");
    const existingBtn = document.getElementById(BTN_ID);

    if (target && header) {
      if (!existingBtn) {
        console.log("✅ 检测到目标输入框，注入控制面板...");
        createButton(header, "自动完成", "#52c41a", App.startTask, true);
        createButton(
          header,
          "删除题干",
          "#ff5353ff",
          () => App.getAndCleanTitle(true),
          true
        );
        createImportControl(header);
        ConfigManager.init();
      }
    } else if (existingBtn) {
      console.log("⚠️ 目标输入框消失，移除面板...");
      existingBtn.remove();
    }
  }

  const observer = new MutationObserver(checkAndInject);
  observer.observe(document.body, { childList: true, subtree: true });
  checkAndInject();
})();
