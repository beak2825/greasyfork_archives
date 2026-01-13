// ==UserScript==
// @name         禅道Bug剩余天数提醒 + 标签管理增强版
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  在禅道Bug列表中添加剩余天数列，支持标签管理、分组查看、筛选等功能
// @author       You
// @match        https://www.j-do.cn:9012/zentao/bug-browse-*
// @match        https://www.j-do.cn:9012/zentao/bug-*
// @match        https://www.j-do.cn:9012/zentao/user-login*
// @icon         https://www.zentao.net/favicon.ico
// @grant        none
// @run-at       document-end
// @license All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/561909/%E7%A6%85%E9%81%93Bug%E5%89%A9%E4%BD%99%E5%A4%A9%E6%95%B0%E6%8F%90%E9%86%92%20%2B%20%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561909/%E7%A6%85%E9%81%93Bug%E5%89%A9%E4%BD%99%E5%A4%A9%E6%95%B0%E6%8F%90%E9%86%92%20%2B%20%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置：根据级别设置截止天数
  const DEADLINE_CONFIG = {
    1: 7, // 严重：7天
    2: 14, // 中等：14天
    3: 30, // 轻微：30天
    4: -1, // 建议：不限
  };

  // 配置：剩余天数预警阈值
  const WARNING_DAYS = {
    1: 2, // 严重：剩余2天内标红
    2: 3, // 中等：剩余3天内标红
    3: 7, // 轻微：剩余7天内标红
    4: -1, // 建议：不标红
  };

  // ==================== 本地存储管理器 ====================
  const BugDataManager = {
    STORAGE_KEY: "zentao_bug_data",

    // 获取所有数据
    getData() {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data
        ? JSON.parse(data)
        : {
            bugTags: {}, // bugId: ['标签1', '标签2']
            bugNotes: {}, // bugId: '备注内容'
            tagColors: {}, // '标签名': '#颜色'
            allTags: [], // ['标签1', '标签2'] 所有可用标签
            filterPreference: {
              groupBy: "none", // none, person, version, tag
              selectedTags: [],
              selectedPersons: [],
              selectedVersions: [],
            },
            statisticsRules: this.getDefaultStatisticsRules(),
            testPersons: [], // 测试人员列表
          };
    },

    // 获取默认统计规则
    getDefaultStatisticsRules() {
      return [];
    },

    // 保存数据
    saveData(data) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // 获取Bug的标签
    getBugTags(bugId) {
      const data = this.getData();
      return data.bugTags[bugId] || [];
    },

    // 给Bug添加标签
    addBugTag(bugId, tag) {
      const data = this.getData();
      if (!data.bugTags[bugId]) {
        data.bugTags[bugId] = [];
      }
      if (!data.bugTags[bugId].includes(tag)) {
        data.bugTags[bugId].push(tag);
      }
      // 添加到全局标签列表
      if (!data.allTags.includes(tag)) {
        data.allTags.push(tag);
        // 随机生成颜色
        if (!data.tagColors[tag]) {
          data.tagColors[tag] = this.generateRandomColor();
        }
      }
      this.saveData(data);
    },

    // 删除Bug的标签
    removeBugTag(bugId, tag) {
      const data = this.getData();
      if (data.bugTags[bugId]) {
        data.bugTags[bugId] = data.bugTags[bugId].filter((t) => t !== tag);
        if (data.bugTags[bugId].length === 0) {
          delete data.bugTags[bugId];
        }
      }
      this.saveData(data);
    },

    // 获取Bug的备注
    getBugNote(bugId) {
      const data = this.getData();
      return data.bugNotes[bugId] || "";
    },

    // 设置Bug的备注
    setBugNote(bugId, note) {
      const data = this.getData();
      if (note) {
        data.bugNotes[bugId] = note;
      } else {
        delete data.bugNotes[bugId];
      }
      this.saveData(data);
    },

    // 获取Bug的状态
    getBugStatus(bugId) {
      const data = this.getData();
      if (!data.bugStatuses) {
        data.bugStatuses = {};
      }
      return data.bugStatuses[bugId] || "待分析";
    },

    // 设置Bug的状态
    setBugStatus(bugId, status) {
      const data = this.getData();
      if (!data.bugStatuses) {
        data.bugStatuses = {};
      }
      data.bugStatuses[bugId] = status;
      this.saveData(data);
    },

    // 获取所有标签
    getAllTags() {
      const data = this.getData();
      return data.allTags || [];
    },

    // 获取标签颜色
    getTagColor(tag) {
      const data = this.getData();
      return data.tagColors[tag] || this.generateRandomColor();
    },

    // 设置标签颜色
    setTagColor(tag, color) {
      const data = this.getData();
      data.tagColors[tag] = color;
      this.saveData(data);
    },

    // 删除标签(从所有Bug中移除)
    deleteTag(tag) {
      const data = this.getData();
      // 从所有Bug中移除该标签
      Object.keys(data.bugTags).forEach((bugId) => {
        data.bugTags[bugId] = data.bugTags[bugId].filter((t) => t !== tag);
        if (data.bugTags[bugId].length === 0) {
          delete data.bugTags[bugId];
        }
      });
      // 从全局标签列表中移除
      data.allTags = data.allTags.filter((t) => t !== tag);
      delete data.tagColors[tag];
      this.saveData(data);
    },

    // 获取筛选偏好
    getFilterPreference() {
      const data = this.getData();
      return data.filterPreference;
    },

    // 保存筛选偏好
    saveFilterPreference(preference) {
      const data = this.getData();
      data.filterPreference = { ...data.filterPreference, ...preference };
      this.saveData(data);
    },

    // 生成随机颜色
    generateRandomColor() {
      const colors = [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#84cc16",
        "#f97316",
        "#6366f1",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },

    // ==================== 统计规则管理 ====================
    getStatisticsRules() {
      const data = this.getData();
      return data.statisticsRules || this.getDefaultStatisticsRules();
    },

    saveStatisticsRules(rules) {
      const data = this.getData();
      data.statisticsRules = rules;
      this.saveData(data);
    },

    addStatisticsRule(rule) {
      const rules = this.getStatisticsRules();
      rule.id = rule.id || 'rule_' + Date.now();
      rules.push(rule);
      this.saveStatisticsRules(rules);
      return rule.id;
    },

    updateStatisticsRule(ruleId, updates) {
      const rules = this.getStatisticsRules();
      const index = rules.findIndex(r => r.id === ruleId);
      if (index !== -1) {
        rules[index] = { ...rules[index], ...updates };
        this.saveStatisticsRules(rules);
        return true;
      }
      return false;
    },

    deleteStatisticsRule(ruleId) {
      const rules = this.getStatisticsRules();
      const filtered = rules.filter(r => r.id !== ruleId);
      this.saveStatisticsRules(filtered);
    },

    exportConfig() {
      return JSON.stringify(this.getData(), null, 2);
    },

    importConfig(jsonString) {
      try {
        const config = JSON.parse(jsonString);
        this.saveData(config);
        return true;
      } catch (e) {
        console.error('[配置导入失败]', e);
        return false;
      }
    },

    // ==================== 测试人员管理 ====================
    getTestPersons() {
      const data = this.getData();
      return data.testPersons || [];
    },

    addTestPerson(name) {
      const data = this.getData();
      if (!data.testPersons) {
        data.testPersons = [];
      }
      const trimmedName = name.trim();
      if (trimmedName && !data.testPersons.includes(trimmedName)) {
        data.testPersons.push(trimmedName);
        this.saveData(data);
        return true;
      }
      return false;
    },

    removeTestPerson(name) {
      const data = this.getData();
      if (data.testPersons) {
        data.testPersons = data.testPersons.filter(p => p !== name);
        this.saveData(data);
      }
    },

    isTestPerson(name) {
      const testPersons = this.getTestPersons();
      return testPersons.some(person => name.includes(person));
    },
  };

  // ==================== 全局弹框管理器（单例模式） ====================
  const DialogManager = {
    activeDialogs: {},

    show(dialogId, createDialogFn) {
      if (this.activeDialogs[dialogId]) {
        this.close(dialogId);
      }

      const dialog = createDialogFn();
      this.activeDialogs[dialogId] = dialog;
      document.body.appendChild(dialog);

      const overlay = dialog.querySelector('.dialog-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.close(dialogId));
      }

      const escHandler = (e) => {
        if (e.key === 'Escape') {
          this.close(dialogId);
        }
      };
      dialog._escHandler = escHandler;
      document.addEventListener('keydown', escHandler);

      return dialog;
    },

    close(dialogId) {
      const dialog = this.activeDialogs[dialogId];
      if (dialog) {
        if (dialog._escHandler) {
          document.removeEventListener('keydown', dialog._escHandler);
        }
        if (dialog.parentNode) {
          dialog.parentNode.removeChild(dialog);
        }
        delete this.activeDialogs[dialogId];
      }
    },

    closeAll() {
      Object.keys(this.activeDialogs).forEach(id => this.close(id));
    }
  };

  // ==================== 统计计算引擎 ====================
  const StatisticsEngine = {
    calculate(rows) {
      const rules = BugDataManager.getStatisticsRules() || [];
      const results = [];

      rules.forEach(rule => {
        if (!rule.enabled) return;

        let count = 0;
        rows.forEach(row => {
          if (this.matchRule(row, rule)) {
            count++;
          }
        });

        results.push({
          id: rule.id,
          name: rule.name,
          icon: rule.icon || '📊',
          count: count,
          rule: rule
        });
      });

      return results;
    },

    matchRule(row, rule) {
      const conditions = rule.conditions;
      
      if (conditions.include && conditions.include.length > 0) {
        const includeMatch = conditions.include.some(cond => {
          const fieldValue = this.getFieldValue(row, cond.field);
          return cond.values.some(value => 
            fieldValue.includes(value)
          );
        });
        if (!includeMatch) return false;
      }

      if (conditions.exclude && conditions.exclude.length > 0) {
        const excludeMatch = conditions.exclude.some(cond => {
          const fieldValue = this.getFieldValue(row, cond.field);
          return cond.values.some(value => 
            fieldValue.includes(value)
          );
        });
        if (excludeMatch) return false;
      }

      return true;
    },

    getFieldValue(row, field) {
      switch (field) {
        case 'assignedTo':
          return getAssignedPerson(row) || '';
        case 'status':
          const statusCell = row.querySelector('.c-status');
          return statusCell ? statusCell.textContent.trim() : '';
        case 'severity':
          return getSeverity(row) || '';
        case 'title':
          const titleCell = row.querySelector('.c-title');
          return titleCell ? titleCell.textContent.trim() : '';
        case 'tag':
          const bugId = row.getAttribute('data-id');
          return BugDataManager.getBugTags(bugId).join(',');
        default:
          return '';
      }
    },

    applyFilter(ruleId) {
      const rows = document.querySelectorAll('tr[data-id]');
      const rule = BugDataManager.getStatisticsRules().find(r => r.id === ruleId);
      
      if (!rule) {
        rows.forEach(row => row.style.display = '');
        return;
      }

      rows.forEach(row => {
        if (this.matchRule(row, rule)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  };

  /**
   * 解析日期字符串（如 "10-16 11:40" 或 "10-16"）
   */
  function parseZentaoDate(dateStr) {
    if (!dateStr) return null;

    const now = new Date();
    const currentYear = now.getFullYear();

    // 解析 "月-日" 或 "月-日 时:分"
    const parts = dateStr.trim().split(" ");
    const datePart = parts[0]; // "10-16"
    const timePart = parts[1] || "00:00"; // "11:40" 或默认 "00:00"

    const [month, day] = datePart.split("-").map((num) => parseInt(num, 10));
    const [hour, minute] = timePart.split(":").map((num) => parseInt(num, 10));

    const date = new Date(currentYear, month - 1, day, hour || 0, minute || 0);

    // 如果解析的日期在未来（跨年情况），使用去年
    if (date > now) {
      date.setFullYear(currentYear - 1);
    }

    return date;
  }

  /**
   * 计算两个日期之间的天数差
   */
  function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
  }

  /**
   * 获取Bug的严重程度 (统一的获取方法)
   */
  function getSeverity(row) {
    // 尝试多个选择器，优先使用最精确的
    const selectors = [
      ".c-severity .label-severity", // 最精确
      ".c-severity span.label-severity", // 完整路径
      ".label-severity", // 简短版
      ".c-severity span", // 通用span
    ];

    let severityCell = null;
    for (const selector of selectors) {
      severityCell = row.querySelector(selector);
      if (severityCell) break;
    }

    if (!severityCell) {
      console.log(
        "[严重程度] 未找到严重程度单元格，Bug行:",
        row.getAttribute("data-id")
      );
      return "4";
    }

    // 尝试多种方式获取严重程度
    let severity =
      severityCell.getAttribute("data-severity") ||
      severityCell.getAttribute("title") ||
      severityCell.textContent?.trim();

    // 如果获取到的是中文,转换为数字
    const severityMap = {
      严重: "1",
      中等: "2",
      轻微: "3",
      建议: "4",
    };

    if (severity && severityMap[severity]) {
      severity = severityMap[severity];
    }

    // 确保返回的是有效的严重程度值
    if (!severity || !["1", "2", "3", "4"].includes(severity)) {
      const bugId = row.getAttribute("data-id");
      console.log(
        `[严重程度] Bug #${bugId} 无法识别的严重程度: "${severity}", HTML:`,
        severityCell.outerHTML
      );
      return "4";
    }

    return severity;
  }

  /**
   * 获取Bug的指派人员 (统一的获取方法)
   */
  function getAssignedPerson(row, debug = false) {
    // 尝试多个选择器
    const selectors = [
      ".c-assignedTo a", // 链接形式
      ".c-assignedTo span", // span形式
      ".c-assignedTo", // 直接从单元格获取
      "td.c-assignedTo a", // 完整路径
      "td.c-assignedTo", // 完整路径
    ];

    let person = "";
    let foundSelector = "";
    for (const selector of selectors) {
      const cell = row.querySelector(selector);
      if (cell) {
        person = cell.textContent?.trim() || "";
        if (person && person !== "") {
          foundSelector = selector;
          break;
        }
      }
    }

    // 清理可能的空白字符和特殊字符
    person = person.replace(/\s+/g, " ").trim();

    // 如果还是空的，尝试获取 data-* 属性
    if (!person) {
      const assignedCell = row.querySelector(".c-assignedTo, td.c-assignedTo");
      if (assignedCell) {
        person =
          assignedCell.getAttribute("data-assigned") ||
          assignedCell.getAttribute("title") ||
          "";
      }
    }

    // 记录调试信息（仅在debug模式或未找到时）
    const bugId = row.getAttribute("data-id");
    if (debug || !person || person === "") {
      if (!person || person === "") {
        console.log(
          `[人员分组] Bug #${bugId} 未找到指派人员，HTML:`,
          row.querySelector(".c-assignedTo")?.outerHTML
        );
      } else if (debug) {
        console.log(
          `[人员分组] Bug #${bugId} 指派给: ${person} (使用选择器: ${foundSelector})`
        );
      }
    }

    return person || "未指派";
  }

  /**
   * 处理Bug表格
   */
  function processBugTable() {
    const table = document.querySelector("#bugList, table.table.has-sort-head");
    if (!table) {
      console.log("[禅道Bug提醒] 未找到Bug表格");
      return;
    }

    // 移除表格的固定宽度限制
    table.removeAttribute('data-fixed-left-width');
    table.removeAttribute('data-fixed-right-width');
    table.style.tableLayout = 'fixed';  // 使用固定布局以支持百分比
    table.style.width = '100%';

    const thead = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");

    if (!thead || !tbody) {
      console.log("[禅道Bug提醒] 表格结构异常");
      return;
    }

    // 检查是否已经添加过
    if (thead.querySelector(".th-deadline")) {
      console.log("[禅道Bug提醒] 已经添加过剩余天数列");
      return;
    }

    // 获取容器可用宽度（减去边距和滚动条）
    const container = table.parentElement;
    const availableWidth = container ? container.clientWidth - 20 : 1400; // 默认1400px
    
    console.log(`[禅道Bug提醒] 可用宽度: ${availableWidth}px`);

    // 按比例分配宽度（总计100%）
    const columnRatios = {
      ".c-id": 6,           // 6%  - ID
      ".c-severity": 4,     // 4%  - 级别
      ".c-title": 36,       // 36% - 标题（最大）
      ".c-openedBy": 7,     // 7%  - 创建者
      ".c-openedDate": 8,   // 8%  - 创建日期
      "deadline": 8,        // 8%  - 剩余天数
      "tag": 18,            // 18% - 标签/备注
      "status": 10          // 10% - Bug状态
    };

    // 隐藏不需要的列
    const columnsToHide = [".c-pri", ".c-confirmed", ".c-status", ".c-assignedTo", ".c-resolution", ".c-resolvedDate", ".c-actions"];
    columnsToHide.forEach(selector => {
      const header = thead.querySelector(selector);
      if (header) {
        header.style.display = "none";
      }
    });

    // 设置可见列的宽度（使用百分比）
    Object.entries(columnRatios).forEach(([selector, ratio]) => {
      if (selector === 'deadline' || selector === 'tag' || selector === 'status') return; // 跳过新增列
      
      const header = thead.querySelector(selector);
      if (header) {
        header.removeAttribute('data-width');
        header.removeAttribute('data-flex');
        header.style.cssText += `width: ${ratio}% !important;`;
      }
    });

    // 1. 添加"Bug状态"列 - 插入到标题后
    const statusHeader = document.createElement("th");
    statusHeader.className = "c-bug-status-header";
    statusHeader.style.cssText = `width: ${columnRatios.status}% !important;`;
    statusHeader.setAttribute("title", "Bug状态");
    statusHeader.innerHTML = '<div class="header">Bug状态</div>';
    const titleHeader = thead.querySelector(".c-title");
    if (titleHeader) {
      titleHeader.after(statusHeader);
    } else {
      thead.appendChild(statusHeader);
    }

    // 2. 添加"剩余天数"列 - 插入到状态后
    const deadlineHeader = document.createElement("th");
    deadlineHeader.className = "c-deadline-header";
    deadlineHeader.style.cssText = `width: ${columnRatios.deadline}% !important;`;
    deadlineHeader.setAttribute("title", "剩余天数");
    deadlineHeader.innerHTML =
      '<a href="javascript:;" class="header deadline-sort">剩余天数</a>';
    statusHeader.after(deadlineHeader);

    // 3. 添加"标签/备注"列 - 插入到创建日期后（最后一列）
    const tagHeader = document.createElement("th");
    tagHeader.className = "c-tag-header";
    tagHeader.style.cssText = `width: ${columnRatios.tag}% !important;`;
    tagHeader.setAttribute("title", "标签和备注");
    tagHeader.innerHTML = '<div class="header">标签/备注</div>';
    const dateHeader = thead.querySelector(".c-openedDate");
    if (dateHeader) {
      dateHeader.after(tagHeader);
    } else {
      thead.appendChild(tagHeader);
    }

    // 2. 为每一行处理列的显示和添加状态单元格
    const rows = tbody.querySelectorAll("tr[data-id]");
    const now = new Date();

    rows.forEach((row) => {
      // 隐藏不需要的列
      columnsToHide.forEach(selector => {
        const cell = row.querySelector(selector);
        if (cell) {
          cell.style.display = "none";
        }
      });
      
      // 设置可见列单元格的宽度（使用百分比）
      Object.entries(columnRatios).forEach(([selector, ratio]) => {
        if (selector === 'deadline' || selector === 'tag' || selector === 'status') return;
        
        const cell = row.querySelector(selector);
        if (cell) {
          cell.removeAttribute('data-width');
          cell.removeAttribute('data-flex');
          cell.style.cssText += `width: ${ratio}% !important;`;
        }
      });
      // 获取指派人
      const assignedText = getAssignedPerson(row);

      // 检查是否指派给测试人员（已解决，进入测试阶段）
      const isInTesting = BugDataManager.isTestPerson(assignedText);
      if (isInTesting) {
        row.classList.add("bug-in-testing");
        row.setAttribute("title", "已指派给测试，等待验证");
      }

      // 获取严重程度
      const severity = getSeverity(row);

      // 获取创建日期
      const dateCell = row.querySelector(".c-openedDate");
      const dateText = dateCell ? dateCell.textContent.trim() : "";

      // 获取bugId
      const bugId = row.getAttribute("data-id");

      // 1. 添加状态单元格 - 插入到标题后
      const statusCell = document.createElement("td");
      statusCell.className = "c-bug-status";
      statusCell.style.cssText = `width: ${columnRatios.status}% !important;`;
      statusCell.innerHTML = renderBugStatusDropdown(bugId);
      const titleCell = row.querySelector(".c-title");
      if (titleCell) {
        titleCell.after(statusCell);
      } else {
        row.appendChild(statusCell);
      }

      // 2. 创建剩余天数单元格 - 插入到状态后
      const deadlineCell = document.createElement("td");
      deadlineCell.className = "c-deadline";
      deadlineCell.style.cssText = `width: ${columnRatios.deadline}% !important;`;

      if (!dateText || severity === "4") {
        // 级别4或无日期，显示"不限"
        deadlineCell.innerHTML = '<span class="text-muted">不限</span>';
        deadlineCell.setAttribute("data-days", "99999");
      } else {
        // 解析创建日期
        const createdDate = parseZentaoDate(dateText);
        if (!createdDate) {
          deadlineCell.innerHTML = '<span class="text-muted">-</span>';
          deadlineCell.setAttribute("data-days", "99999");
        } else {
          // 计算截止日期
          const deadlineDays = DEADLINE_CONFIG[severity] || 30;
          const deadlineDate = new Date(createdDate);
          deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);

          // 计算剩余天数
          const remainingDays = daysBetween(now, deadlineDate);
          deadlineCell.setAttribute("data-days", remainingDays);

          // 确定显示样式
          const warningThreshold = WARNING_DAYS[severity] || 3;
          let displayClass = "";
          let displayText = "";

          if (remainingDays < 0) {
            // 已超期
            displayClass = "text-danger";
            displayText = `<strong>超期${Math.abs(remainingDays)}天</strong>`;
          } else if (remainingDays <= warningThreshold) {
            // 临近超期（标红）
            displayClass = "text-danger";
            displayText = `<strong>剩余${remainingDays}天</strong>`;
          } else if (remainingDays <= warningThreshold * 2) {
            // 预警
            displayClass = "text-warning";
            displayText = `剩余${remainingDays}天`;
          } else {
            // 正常
            displayClass = "text-muted";
            displayText = `剩余${remainingDays}天`;
          }

          deadlineCell.innerHTML = `<span class="${displayClass}" title="创建于${dateText}，${deadlineDays}天内需解决">${displayText}</span>`;
        }
      }
      statusCell.after(deadlineCell);

      // 3. 创建标签单元格（包含操作按钮）- 插入到创建日期后（最后一列）
      const tagCell = document.createElement("td");
      tagCell.className = "c-tag";
      tagCell.style.cssText = `width: ${columnRatios.tag}% !important;`;
      tagCell.innerHTML = renderBugTagsWithActions(bugId);
      const dateCell2 = row.querySelector(".c-openedDate");
      if (dateCell2) {
        dateCell2.after(tagCell);
      } else {
        row.appendChild(tagCell);
      }

      // 事件绑定已移至全局委托，此处无需绑定
    });

    console.log(`[禅道Bug提醒] 成功处理${rows.length}个Bug`);

    // 3. 添加排序功能
    deadlineHeader
      .querySelector(".deadline-sort")
      .addEventListener("click", function (e) {
        e.preventDefault();
        sortTableByDeadline();
      });
  }

  /**
   * 按剩余天数排序
   */
  function sortTableByDeadline() {
    const tbody = document.querySelector(
      "#bugList tbody, table.table.has-sort-head tbody"
    );
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr[data-id]"));

    // 按剩余天数排序（升序）
    rows.sort((a, b) => {
      const daysA = parseInt(
        a.querySelector(".c-deadline").getAttribute("data-days") || "99999",
        10
      );
      const daysB = parseInt(
        b.querySelector(".c-deadline").getAttribute("data-days") || "99999",
        10
      );
      return daysA - daysB;
    });

    // 重新插入排序后的行
    rows.forEach((row) => tbody.appendChild(row));

    console.log("[禅道Bug提醒] 已按剩余天数排序");
  }

  /**
   * ==================== 标签系统功能 ====================
   */

  /**
   * 渲染Bug的标签
   */
  function renderBugTags(bugId) {
    const tags = BugDataManager.getBugTags(bugId);
    if (tags.length === 0) {
      return '<span class="no-tags">无标签</span>';
    }

    return tags
      .map((tag) => {
        const color = BugDataManager.getTagColor(tag);
        return `
                <span class="bug-tag" style="background-color: ${color};" data-tag="${tag}" data-bug-id="${bugId}">
                    ${tag}
                    <span class="tag-remove" title="移除标签">×</span>
                </span>
            `;
      })
      .join("");
  }

  /**
   * 渲染Bug状态下拉框
   */
  function renderBugStatusDropdown(bugId) {
    const statusList = [
      "待分析",
      "分析中",
      "发布SIT",
      "SIT测试通过",
      "待发布UAT",
      "已发布UAT",
      "UAT测试通过",
      "无需测试"
    ];
    const currentStatus = BugDataManager.getBugStatus(bugId);
    
    const options = statusList.map(status => 
      `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>`
    ).join('');
    
    return `
      <select class="bug-status-select" data-bug-id="${bugId}" data-status="${currentStatus}">
        ${options}
      </select>
    `;
  }

  /**
   * 渲染Bug的标签和操作按钮（整合版）
   */
  function renderBugTagsWithActions(bugId) {
    const tags = BugDataManager.getBugTags(bugId);
    const note = BugDataManager.getBugNote(bugId);

    let tagsHtml = "";
    if (tags.length === 0) {
      tagsHtml = '<span class="no-tags">无标签</span>';
    } else {
      tagsHtml = tags
        .map((tag) => {
          const color = BugDataManager.getTagColor(tag);
          return `
                    <span class="bug-tag" style="background-color: ${color};" data-tag="${tag}" data-bug-id="${bugId}">
                        ${tag}
                        <span class="tag-remove" title="移除标签">×</span>
                    </span>
                `;
        })
        .join("");
    }

    // 操作按钮
    const noteClass = note ? "has-note" : "";
    const noteTitle = note
      ? `备注: ${note.substring(0, 30)}${note.length > 30 ? "..." : ""}`
      : "添加备注";

    return `
            <div class="tag-cell-content">
                <div class="tag-list-inline">${tagsHtml}</div>
                <div class="tag-actions">
                    <button class="btn-add-tag-inline" data-bug-id="${bugId}" title="添加标签">+</button>
                    <button class="btn-add-note-inline ${noteClass}" data-bug-id="${bugId}" title="${noteTitle}">📝</button>
                </div>
            </div>
        `;
  }

  /**
   * 刷新Bug行的标签显示
   */
  function refreshBugTags(bugId) {
    const row = document.querySelector(`tr[data-id="${bugId}"]`);
    if (!row) return;

    const tagCell = row.querySelector(".c-tag");
    if (tagCell) {
      // 只更新HTML，事件通过全局委托处理
      tagCell.innerHTML = renderBugTagsWithActions(bugId);
    }
  }

  /**
   * 绑定标签移除事件（已废弃，由事件委托代替）
   */
  function bindTagRemoveEvents(container) {
    // 不再使用，由initEventDelegation统一处理
  }

  /**
   * 显示添加标签对话框（使用单例模式）
   */
  function showAddTagDialog(bugId) {
    const allTags = BugDataManager.getAllTags();
    const currentTags = BugDataManager.getBugTags(bugId);

    DialogManager.show('addTag', () => {
      const dialog = document.createElement("div");
    dialog.className = "tag-dialog";
    dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>添加标签 - Bug #${bugId}</h3>
                    <button class="dialog-close">&times;</button>
                </div>
                <div class="dialog-body">
                    <div class="form-group">
                        <label>选择已有标签</label>
                        <div class="tag-list" id="existingTags">
                            ${
                              allTags.length > 0
                                ? allTags
                                    .map((tag) => {
                                      const color =
                                        BugDataManager.getTagColor(tag);
                                      const isActive =
                                        currentTags.includes(tag);
                                      return `
                                        <span class="tag-option ${
                                          isActive ? "active" : ""
                                        }"
                                              style="background-color: ${color};"
                                              data-tag="${tag}">
                                            ${tag}
                                        </span>
                                    `;
                                    })
                                    .join("")
                                : '<span class="no-tags">暂无标签</span>'
                            }
                        </div>
                    </div>
                    <div class="form-group">
                        <label>或创建新标签</label>
                        <input type="text" id="newTagName" placeholder="输入新标签名称" />
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn-cancel">取消</button>
                    <button class="btn-save">保存</button>
                </div>
            </div>
        `;

    // 关闭按钮
    dialog.querySelector(".dialog-close").addEventListener("click", (e) => {
      e.preventDefault();
      DialogManager.close('addTag');
    });
    dialog.querySelector(".btn-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      DialogManager.close('addTag');
    });

    // 标签选择
    const tagOptions = dialog.querySelectorAll(".tag-option");
    tagOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        option.classList.toggle("active");
      });
    });

    // 新标签输入 - 回车确认
    const newTagInput = dialog.querySelector("#newTagName");
    newTagInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        dialog.querySelector(".btn-save").click();
      }
    });

    // 保存按钮
    dialog.querySelector(".btn-save").addEventListener("click", (e) => {
      e.preventDefault();

      const saveBtn = e.currentTarget;
      if (saveBtn.disabled) return;
      saveBtn.disabled = true;
      saveBtn.textContent = "保存中...";

      try {
        const newTagName = newTagInput.value.trim();
        const selectedTags = Array.from(
          dialog.querySelectorAll(".tag-option.active")
        ).map((el) => el.getAttribute("data-tag"));

        if (newTagName) {
          selectedTags.push(newTagName);
        }

        selectedTags.forEach((tag) => {
          BugDataManager.addBugTag(bugId, tag);
        });

        refreshBugTags(bugId);
        DialogManager.close('addTag');
      } catch (error) {
        console.error('[标签保存失败]', error);
        alert('标签保存失败，请重试');
        saveBtn.disabled = false;
        saveBtn.textContent = "保存";
      }
    });

    return dialog;
    });
  }

  /**
   * 显示配置测试人员对话框
   */
  function showTestPersonsConfigDialog() {
    const testPersons = BugDataManager.getTestPersons();

    DialogManager.show('testPersonsConfig', () => {
      const dialog = document.createElement("div");
      dialog.className = "test-persons-dialog";
      
      const personsListHtml = testPersons.length > 0 
        ? testPersons.map(person => `
          <div class="test-person-item">
            <span class="person-name">${person}</span>
            <button class="btn-remove-person" data-person="${person}" title="移除">×</button>
          </div>
        `).join('')
        : '<div class="no-persons">暂无测试人员</div>';

      dialog.innerHTML = `
        <div class="dialog-overlay"></div>
        <div class="dialog-content">
          <div class="dialog-header">
            <h3>⚙️ 配置测试人员</h3>
            <button class="dialog-close">&times;</button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label>当前测试人员列表</label>
              <div class="test-persons-list" id="testPersonsList">
                ${personsListHtml}
              </div>
            </div>
            <div class="form-group">
              <label>添加新的测试人员</label>
              <div class="add-person-form">
                <input type="text" id="newPersonName" placeholder="输入人员姓名" />
                <button class="btn-add-person">添加</button>
              </div>
            </div>
            <div class="form-hint">
              <small>💡 提示：测试人员的Bug行将显示为绿色背景，表示已进入测试阶段</small>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-close">关闭</button>
          </div>
        </div>
      `;

      // 关闭按钮
      dialog.querySelector(".dialog-close").addEventListener("click", () => {
        DialogManager.close('testPersonsConfig');
      });
      dialog.querySelector(".btn-close").addEventListener("click", () => {
        DialogManager.close('testPersonsConfig');
      });

      // 添加人员
      const addPersonBtn = dialog.querySelector(".btn-add-person");
      const personInput = dialog.querySelector("#newPersonName");
      
      const addPerson = () => {
        const name = personInput.value.trim();
        if (name) {
          if (BugDataManager.addTestPerson(name)) {
            personInput.value = '';
            // 刷新列表
            refreshTestPersonsList(dialog);
            // 刷新表格显示
            refreshBugTable();
          } else {
            alert('人员已存在或名称为空');
          }
        }
      };

      addPersonBtn.addEventListener("click", addPerson);
      personInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addPerson();
        }
      });

      // 移除人员（事件委托）
      dialog.querySelector("#testPersonsList").addEventListener("click", (e) => {
        if (e.target.classList.contains('btn-remove-person')) {
          const person = e.target.getAttribute('data-person');
          if (confirm(`确定要移除测试人员“${person}”吗？`)) {
            BugDataManager.removeTestPerson(person);
            refreshTestPersonsList(dialog);
            refreshBugTable();
          }
        }
      });

      return dialog;
    });
  }

  /**
   * 刷新测试人员列表显示
   */
  function refreshTestPersonsList(dialog) {
    const testPersons = BugDataManager.getTestPersons();
    const listContainer = dialog.querySelector('#testPersonsList');
    
    if (testPersons.length > 0) {
      listContainer.innerHTML = testPersons.map(person => `
        <div class="test-person-item">
          <span class="person-name">${person}</span>
          <button class="btn-remove-person" data-person="${person}" title="移除">×</button>
        </div>
      `).join('');
    } else {
      listContainer.innerHTML = '<div class="no-persons">暂无测试人员</div>';
    }
  }

  /**
   * 刷新Bug表格显示（重新应用测试人员样式）
   */
  function refreshBugTable() {
    const rows = document.querySelectorAll('tr[data-id]');
    rows.forEach(row => {
      const assignedText = getAssignedPerson(row);
      const isInTesting = BugDataManager.isTestPerson(assignedText);
      
      if (isInTesting) {
        row.classList.add('bug-in-testing');
        row.setAttribute('title', '已指派给测试，等待验证');
      } else {
        row.classList.remove('bug-in-testing');
        row.removeAttribute('title');
      }
    });
  }

  /**
   * 获取所有负责人列表（去重排序）
   */
  function getAllAssignedPersons() {
    const rows = document.querySelectorAll('tr[data-id]');
    const persons = new Set();
    rows.forEach(row => {
      const person = getAssignedPerson(row);
      if (person && person !== '未指派') {
        persons.add(person);
      }
    });
    return Array.from(persons).sort();
  }

  /**
   * 从表格行提取导出数据
   */
  function extractExportData(row) {
    const bugId = row.getAttribute('data-id');
    
    // 任务号
    const idCell = row.querySelector('.c-id');
    const taskNo = idCell ? idCell.textContent.trim() : bugId;
    
    // 描述（标题）
    const titleCell = row.querySelector('.c-title');
    const description = titleCell ? titleCell.textContent.trim() : '';
    
    // 提出人（创建者）
    const openedByCell = row.querySelector('.c-openedBy');
    const creator = openedByCell ? openedByCell.textContent.trim() : '';
    
    // 负责人（指派给）
    const assignedPerson = getAssignedPerson(row);
    
    // bug类型（级别）
    const severityCell = row.querySelector('.c-severity');
    const bugType = severityCell ? severityCell.textContent.trim() : '';
    
    // 状态（Bug状态）
    const statusSelect = row.querySelector('.bug-status-select');
    const status = statusSelect ? statusSelect.value : '待分析';
    
    // 备注 = 【标签】 + 备注内容
    const tags = BugDataManager.getBugTags(bugId);
    const note = BugDataManager.getBugNote(bugId);
    let remark = '';
    if (tags.length > 0) {
      remark = tags.map(t => `【${t}】`).join('');
    }
    if (note) {
      remark += (remark ? ' ' : '') + note;
    }
    
    return {
      taskNo,
      description,
      creator,
      assignedPerson,
      bugType,
      status,
      remark
    };
  }

  /**
   * 导出Excel（CSV格式）
   */
  function exportToExcel(selectedPerson) {
    const rows = document.querySelectorAll('tr[data-id]');
    const exportData = [];
    
    // 收集数据
    rows.forEach(row => {
      // 检查行是否可见（被筛选隐藏的行不导出）
      if (row.style.display === 'none') return;
      
      const data = extractExportData(row);
      
      // 如果选择了特定负责人，进行筛选
      if (selectedPerson && selectedPerson !== '全部' && data.assignedPerson !== selectedPerson) {
        return;
      }
      
      exportData.push(data);
    });
    
    if (exportData.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    
    // 显示导出中提示
    const loadingToast = showToast('正在导出数据...', 'info');
    
    // 使用 setTimeout 让提示先显示
    setTimeout(() => {
      // 生成CSV内容
      const headers = ['任务号', '描述', '提出人', '负责人', 'bug类型', '状态', '备注'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => [
          escapeCsv(row.taskNo),
          escapeCsv(row.description),
          escapeCsv(row.creator),
          escapeCsv(row.assignedPerson),
          escapeCsv(row.bugType),
          escapeCsv(row.status),
          escapeCsv(row.remark)
        ].join(','))
      ].join('\n');
      
      // 添加BOM头，确保Excel正确识别UTF-8编码
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // 下载文件
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const personLabel = selectedPerson && selectedPerson !== '全部' ? `_${selectedPerson}` : '';
      const filename = `禅道Bug导出_${timestamp}${personLabel}.csv`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      
      // 关闭加载提示，显示成功提示
      hideToast(loadingToast);
      showToast(`✅ 导出成功！已导出 ${exportData.length} 条数据`, 'success', 3000);
      
      console.log(`[Excel导出] 成功导出 ${exportData.length} 条数据`);
    }, 100);
  }

  /**
   * CSV值转义（处理逗号、引号、换行）
   */
  function escapeCsv(value) {
    if (!value) return '';
    const str = String(value);
    // 如果包含逗号、引号或换行，需要用引号包裹，并转义内部引号
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * 显示Toast提示
   */
  function showToast(message, type = 'info', duration = 0) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 触发动画
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        hideToast(toast);
      }, duration);
    }
    
    return toast;
  }

  /**
   * 隐藏Toast提示
   */
  function hideToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * 显示Excel导出对话框
   */
  function showExportDialog() {
    const persons = getAllAssignedPersons();
    
    DialogManager.show('exportExcel', () => {
      const dialog = document.createElement('div');
      dialog.className = 'export-dialog';
      
      const personOptions = [
        '<option value="全部">全部人员</option>',
        ...persons.map(p => `<option value="${p}">${p}</option>`)
      ].join('');
      
      dialog.innerHTML = `
        <div class="dialog-overlay"></div>
        <div class="dialog-content">
          <div class="dialog-header">
            <h3>📊 导出Excel</h3>
            <button class="dialog-close">&times;</button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label>选择负责人</label>
              <select id="exportPersonSelect" class="form-control">
                ${personOptions}
              </select>
            </div>
            <div class="form-hint">
              <small>💡 提示：导出格式为CSV文件，可用Excel打开。包含字段：任务号、描述、提出人、负责人、bug类型、状态、备注</small>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-cancel">取消</button>
            <button class="btn-export">导出</button>
          </div>
        </div>
      `;
      
      // 关闭按钮
      dialog.querySelector('.dialog-close').addEventListener('click', () => {
        DialogManager.close('exportExcel');
      });
      dialog.querySelector('.btn-cancel').addEventListener('click', () => {
        DialogManager.close('exportExcel');
      });
      
      // 导出按钮
      dialog.querySelector('.btn-export').addEventListener('click', () => {
        const selectedPerson = dialog.querySelector('#exportPersonSelect').value;
        exportToExcel(selectedPerson === '全部' ? null : selectedPerson);
        DialogManager.close('exportExcel');
      });
      
      return dialog;
    });
  }

  /**
   * 显示添加备注对话框（使用单例模式）
   */
  function showAddNoteDialog(bugId) {
    const currentNote = BugDataManager.getBugNote(bugId);

    DialogManager.show('addNote', () => {
      const dialog = document.createElement("div");
    dialog.className = "note-dialog";
    dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>备注 - Bug #${bugId}</h3>
                    <button class="dialog-close">&times;</button>
                </div>
                <div class="dialog-body">
                    <div class="form-group">
                        <label>备注内容</label>
                        <textarea id="noteContent" rows="5" placeholder="输入备注内容...">${currentNote}</textarea>
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn-cancel">取消</button>
                    <button class="btn-save">保存</button>
                </div>
            </div>
        `;

    // 关闭按钮
    dialog.querySelector(".dialog-close").addEventListener("click", (e) => {
      e.preventDefault();
      DialogManager.close('addNote');
    });
    dialog.querySelector(".btn-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      DialogManager.close('addNote');
    });

    // Ctrl+Enter 快捷保存
    const noteTextarea = dialog.querySelector("#noteContent");
    noteTextarea.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        dialog.querySelector(".btn-save").click();
      }
    });

    // 保存按钮
    dialog.querySelector(".btn-save").addEventListener("click", (e) => {
      e.preventDefault();

      const saveBtn = e.currentTarget;
      if (saveBtn.disabled) return;
      saveBtn.disabled = true;
      saveBtn.textContent = "保存中...";

      try {
        const note = noteTextarea.value.trim();
        BugDataManager.setBugNote(bugId, note);
        refreshBugTags(bugId);
        DialogManager.close('addNote');
      } catch (error) {
        console.error('[备注保存失败]', error);
        alert('备注保存失败，请重试');
        saveBtn.disabled = false;
        saveBtn.textContent = "保存";
      }
    });

    return dialog;
    });
  }

  /**
   * 添加自定义样式
   */
  function addCustomStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .c-deadline-header,
            .th-deadline,
            .c-deadline {
                width: 8% !important;
                text-align: center !important;
                vertical-align: middle !important;
                font-size: 12px;
                padding: 3px 2px !important;
            }
            .c-deadline .text-danger {
                color: #dc3545 !important;
                font-weight: 600;
            }
            .c-deadline .text-warning {
                color: #ffc107 !important;
                font-weight: 500;
            }
            .c-deadline .text-muted {
                color: #6c757d;
            }
            .deadline-sort {
                cursor: pointer;
                user-select: none;
            }
            .deadline-sort:hover {
                text-decoration: underline;
            }

            /* 表格整体布局 */
            #bugList,
            table.table.has-sort-head {
                width: 100% !important;
                table-layout: fixed !important;  /* 固定布局支持百分比 */
            }

            /* 表格整体优化 - 更紧凑 */
            #bugList tbody tr,
            table.table.has-sort-head tbody tr {
                height: auto !important;
            }

            #bugList tbody tr td,
            table.table.has-sort-head tbody tr td {
                padding: 3px 8px !important;
                line-height: 1.3 !important;
                vertical-align: middle !important;
                font-size: 12px !important;
            }

            /* 列宽设置 - 使用百分比 */
            .c-id {
                width: 6% !important;
                font-size: 12px !important;
                padding: 3px 4px !important;
            }

            .c-severity {
                width: 4% !important;
                text-align: center !important;
                font-size: 12px !important;
                padding: 3px 4px !important;
            }

            /* Bug标题列样式 - 突出显示，占用最大空间 */
            .c-title {
                width: 36% !important;
                padding: 3px 8px !important;
            }

            .c-title a {
                font-weight: 600 !important;
                color: #1a1a1a !important;
                font-size: 13px !important;
                line-height: 1.4 !important;
                display: inline-block;
                word-break: break-word;
            }

            .c-title a:hover {
                color: #3b82f6 !important;
                text-decoration: underline !important;
            }

            /* 其他列宽度 */
            .c-openedBy {
                width: 7% !important;
                font-size: 12px !important;
                padding: 3px 4px !important;
            }

            .c-openedDate {
                width: 8% !important;
                font-size: 12px !important;
                padding: 3px 4px !important;
            }

            /* 标签列样式 */
            .c-tag {
                width: 240px !important;
                min-width: 200px !important;
                padding: 4px 6px !important;
                vertical-align: middle !important;
            }

            .tag-cell-content {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: nowrap;
            }

            .tag-list-inline {
                display: flex;
                flex-wrap: wrap;
                gap: 3px;
                flex: 1;
                min-width: 0;
            }

            .tag-actions {
                display: flex;
                gap: 3px;
                flex-shrink: 0;
            }

            .c-tag .no-tags {
                color: #999;
                font-size: 11px;
            }

            .bug-tag {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                color: white;
                cursor: default;
                white-space: nowrap;
                line-height: 1.3;
            }

            .bug-tag .tag-remove {
                margin-left: 4px;
                cursor: pointer;
                font-weight: bold;
                opacity: 0.7;
                font-size: 12px;
            }

            .bug-tag .tag-remove:hover {
                opacity: 1;
            }

            /* 操作按钮样式 - 内联版本 */
            .btn-add-tag-inline,
            .btn-add-note-inline {
                background: white;
                border: 1px solid #ddd;
                border-radius: 3px;
                padding: 2px 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                line-height: 1.2;
                min-width: 24px;
                height: 22px;
            }

            .btn-add-tag-inline {
                font-weight: bold;
                color: #666;
            }

            .btn-add-tag-inline:hover {
                background: #f0f0f0;
                border-color: #3b82f6;
                color: #3b82f6;
            }

            .btn-add-note-inline:hover {
                background: #f0f0f0;
                border-color: #10b981;
            }

            .btn-add-note-inline.has-note {
                background: #d1fae5;
                border-color: #10b981;
            }

            /* Bug状态下拉框样式 */
            .c-bug-status-header,
            .c-bug-status {
                text-align: center !important;
                vertical-align: middle !important;
                width: 150px !important;
                min-width: 150px !important;
                max-width: 150px !important;
                padding: 4px 6px !important;
            }

            .bug-status-select {
                width: 100%;
                padding: 3px 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }

            /* 待分析 - 灰色 */
            .bug-status-select[data-status="待分析"] {
                background-color: #f3f4f6;
                color: #6b7280;
                border-color: #d1d5db;
            }

            /* 分析中 - 蓝色 */
            .bug-status-select[data-status="分析中"] {
                background-color: #dbeafe;
                color: #1e40af;
                border-color: #93c5fd;
            }

            /* 发布SIT - 橙色 */
            .bug-status-select[data-status="发布SIT"] {
                background-color: #fed7aa;
                color: #c2410c;
                border-color: #fdba74;
            }

            /* SIT测试通过 - 浅绿 */
            .bug-status-select[data-status="SIT测试通过"] {
                background-color: #d1fae5;
                color: #065f46;
                border-color: #6ee7b7;
            }

            /* 待发布UAT - 黄色 */
            .bug-status-select[data-status="待发布UAT"] {
                background-color: #fef3c7;
                color: #92400e;
                border-color: #fcd34d;
            }

            /* 已发布UAT - 深橙 */
            .bug-status-select[data-status="已发布UAT"] {
                background-color: #ffedd5;
                color: #9a3412;
                border-color: #fed7aa;
            }

            /* UAT测试通过 - 绿色 */
            .bug-status-select[data-status="UAT测试通过"] {
                background-color: #bbf7d0;
                color: #14532d;
                border-color: #86efac;
            }

            /* 无需测试 - 紫色 */
            .bug-status-select[data-status="无需测试"] {
                background-color: #e9d5ff;
                color: #6b21a8;
                border-color: #c4b5fd;
            }

            .bug-status-select:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .bug-status-select:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            }

            .bug-status-select option {
                padding: 6px 8px;
                background: white;
                color: #333;
            }

            /* 测试阶段Bug样式（整行绿色背景） */
            tr.bug-in-testing {
                background: linear-gradient(to right, #e8f5e9 0%, #f1f8f4 50%, transparent 100%) !important;
                box-shadow: inset 4px 0 0 #4caf50 !important;
            }

            tr.bug-in-testing:hover {
                background: linear-gradient(to right, #c8e6c9 0%, #dcedc8 50%, #f5f5f5 100%) !important;
            }

            /* 汇总条样式 - 简洁风格 */
            .zentao-summary-bar {
                background: #f7f8fa;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                padding: 6px 12px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 0;
                font-size: 12px;
            }

            .summary-item {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 0 10px;
                transition: all 0.2s;
            }

            .summary-item.clickable {
                cursor: pointer;
                border-radius: 4px;
            }

            .summary-item.clickable:hover {
                background: #e8eaed;
                transform: translateY(-1px);
            }

            .summary-item.active {
                background: #e3f2fd;
                box-shadow: inset 0 0 0 1px #2196f3;
            }

            .summary-icon {
                font-size: 13px;
            }

            .summary-label {
                color: #666;
                font-size: 11px;
            }

            .summary-value {
                font-weight: 600;
                color: #333;
                font-size: 14px;
                min-width: 18px;
                text-align: center;
            }

            .summary-value.has-value {
                color: #3280fc;
            }

            .summary-value.danger-value {
                color: #dc3545;
            }

            .summary-value.warning-value {
                color: #ff9800;
            }

            .summary-value.success-value {
                color: #28a745;
            }

            .summary-detail {
                font-size: 10px;
                color: #999;
                margin-left: 3px;
            }

            .summary-divider {
                width: 1px;
                height: 16px;
                background: #ddd;
                margin: 0 3px;
            }

            /* 工具栏样式 */
            .bug-toolbar {
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                padding: 8px 12px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            }

            .toolbar-section {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .toolbar-section label {
                font-size: 13px;
                color: #666;
                font-weight: 500;
            }

            /* 分组按钮组 */
            .group-buttons {
                display: flex;
                gap: 0;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
            }

            .group-btn {
                padding: 6px 12px;
                background: white;
                border: none;
                border-right: 1px solid #ddd;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                color: #666;
            }

            .group-btn:last-child {
                border-right: none;
            }

            .group-btn:hover {
                background: #f5f5f5;
                color: #333;
            }

            .group-btn.active {
                background: #3b82f6;
                color: white;
                font-weight: 500;
            }

            .toolbar-btn {
                padding: 6px 12px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .toolbar-btn:hover {
                background: #f5f5f5;
                border-color: #3b82f6;
                color: #3b82f6;
            }

            .toolbar-btn.btn-icon {
                padding: 6px 10px;
                font-size: 14px;
                font-weight: bold;
            }

            /* 标签筛选容器 */
            .tag-filters-container {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 4px 8px;
                background: white;
                min-height: 32px;
            }

            .tag-filters {
                display: flex;
                gap: 5px;
                align-items: center;
                flex-wrap: wrap;
                flex: 1;
            }

            .tag-filters .no-filters {
                color: #999;
                font-size: 12px;
            }

            .tag-filter-actions {
                display: flex;
                gap: 4px;
                flex-shrink: 0;
            }

            .filter-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 12px;
                color: white;
                transition: all 0.2s;
            }

            .filter-tag:hover {
                filter: brightness(1.1);
            }

            .filter-tag-remove {
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                opacity: 0.7;
                margin-left: 2px;
            }

            .filter-tag-remove:hover {
                opacity: 1;
            }

            .filter-status {
                padding: 4px 10px;
                background: #e3f2fd;
                border: 1px solid #2196f3;
                border-radius: 4px;
                font-size: 11px;
                color: #1976d2;
                font-weight: 500;
            }

            /* 快速标签筛选菜单 */
            .quick-tag-menu {
                position: fixed;
                z-index: 100000;
            }

            .quick-tag-menu-content {
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                min-width: 200px;
                max-width: 300px;
                max-height: 400px;
                overflow: auto;
            }

            .quick-tag-menu-header {
                padding: 10px 12px;
                border-bottom: 1px solid #eee;
                font-size: 13px;
                font-weight: 600;
                color: #333;
            }

            .quick-tag-list {
                padding: 6px 0;
            }

            .quick-tag-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-tag-item:hover {
                background: #f5f5f5;
            }

            .quick-tag-item.selected {
                background: #e3f2fd;
            }

            .tag-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                flex-shrink: 0;
            }

            .tag-name {
                flex: 1;
                font-size: 12px;
                color: #333;
            }

            .tag-check {
                color: #2196f3;
                font-weight: bold;
                font-size: 14px;
            }

            /* 分组样式 */
            .group-header-row {
                background: linear-gradient(to right, #f8f9fa 0%, #e9ecef 100%) !important;
                border-top: 2px solid #dee2e6 !important;
            }

            .group-header-row:hover {
                background: linear-gradient(to right, #e9ecef 0%, #dee2e6 100%) !important;
            }

            .group-header {
                padding: 8px 15px !important;
                font-size: 13px;
                color: #333;
                font-weight: 500;
                cursor: pointer;
                user-select: none;
            }

            .group-toggle {
                cursor: pointer;
                user-select: none;
                display: inline-block;
                width: 18px;
                font-weight: bold;
                color: #666;
                transition: all 0.2s;
            }

            .group-header:hover .group-toggle {
                color: #3b82f6;
                transform: scale(1.1);
            }

            .group-count {
                color: #999;
                font-size: 11px;
                margin-left: 8px;
                font-weight: normal;
                background: white;
                padding: 2px 8px;
                border-radius: 10px;
                display: inline-block;
            }

            /* 对话框样式 */
            .tag-dialog,
            .note-dialog,
            .tag-filter-dialog,
            .manage-tags-dialog,
            .test-persons-dialog,
            .export-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 99999;
            }

            .dialog-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
            }

            .dialog-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                width: 500px;
                max-width: 90%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
            }

            .dialog-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .dialog-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }

            .dialog-close {
                width: 30px;
                height: 30px;
                border: none;
                background: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                line-height: 1;
            }

            .dialog-close:hover {
                color: #333;
            }

            .dialog-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .dialog-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                flex-shrink: 0;
            }

            .dialog-footer button {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-cancel,
            .btn-close {
                background: #f5f5f5;
                color: #666;
            }

            .btn-cancel:hover,
            .btn-close:hover {
                background: #e5e5e5;
            }

            .btn-save {
                background: #3b82f6;
                color: white;
            }

            .btn-save:hover {
                background: #2563eb;
            }

            .btn-reset {
                background: #ef4444;
                color: white;
            }

            .btn-reset:hover {
                background: #dc2626;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-size: 13px;
                color: #555;
                font-weight: 500;
            }

            .form-group input[type="text"],
            .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                font-family: inherit;
                box-sizing: border-box;
            }

            .form-group input[type="text"]:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #3b82f6;
            }

            .form-group textarea {
                resize: vertical;
            }

            .tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 10px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                min-height: 50px;
            }

            .tag-option {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 13px;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
                opacity: 0.6;
            }

            .tag-option:hover {
                opacity: 0.8;
                transform: translateY(-1px);
            }

            .tag-option.active {
                opacity: 1;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
            }

            .tag-management-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .tag-management-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                background: #f9fafb;
                border-radius: 4px;
            }

            .tag-preview {
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 13px;
                color: white;
                flex: 1;
            }

            .tag-color-picker {
                width: 50px;
                height: 35px;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
            }

            .btn-delete-tag {
                padding: 6px 12px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-delete-tag:hover {
                background: #dc2626;
            }

            /* 统计配置按钮 */
            .export-excel-btn,
            .test-persons-config-btn,
            .stats-config-btn {
                padding: 6px 12px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                margin-left: 8px;
            }

            .export-excel-btn:hover,
            .test-persons-config-btn:hover,
            .stats-config-btn:hover {
                background: #f0f0f0;
                border-color: #3b82f6;
                transform: scale(1.05);
            }

            .export-excel-btn:hover {
                border-color: #10b981;
            }

            /* 统计配置对话框 */
            .stats-config-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 99999;
            }

            .stats-config-content {
                width: 800px;
                max-width: 95%;
                max-height: 90vh;
            }

            .stats-rules-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                max-height: 50vh;
                overflow-y: auto;
                margin-bottom: 15px;
            }

            .stats-rule-item {
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 15px;
                background: #fafafa;
            }

            .rule-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
            }

            .rule-enabled {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .rule-icon {
                width: 50px;
                text-align: center;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
            }

            .rule-name {
                flex: 1;
                padding: 6px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .btn-delete-rule {
                padding: 6px 12px;
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }

            .btn-delete-rule:hover {
                background: #fcc;
            }

            .rule-conditions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .condition-group {
                background: white;
                padding: 10px;
                border-radius: 4px;
                border: 1px solid #e5e5e5;
            }

            .condition-group label {
                display: block;
                margin-bottom: 8px;
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }

            .conditions-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 8px;
            }

            .condition-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .cond-field {
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 12px;
                width: 120px;
            }

            .cond-values {
                flex: 1;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 12px;
            }

            .btn-remove-cond {
                width: 28px;
                height: 28px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 16px;
                color: #999;
            }

            .btn-remove-cond:hover {
                background: #fee;
                border-color: #fcc;
                color: #c00;
            }

            .btn-add-cond {
                padding: 6px 12px;
                background: #f0f8ff;
                border: 1px dashed #3b82f6;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: #3b82f6;
                width: 100%;
            }

            .btn-add-cond:hover {
                background: #e0f0ff;
            }

            .btn-add-rule {
                padding: 10px;
                background: #f0f8ff;
                border: 2px dashed #3b82f6;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                color: #3b82f6;
                width: 100%;
                font-weight: 600;
                margin-bottom: 15px;
            }

            .btn-add-rule:hover {
                background: #e0f0ff;
            }

            .config-actions {
                display: flex;
                gap: 10px;
                padding: 12px 0;
                border-top: 1px solid #eee;
            }

            .config-actions button {
                flex: 1;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }

            .config-actions button:hover {
                background: #f5f5f5;
                border-color: #3b82f6;
                color: #3b82f6;
            }

            .btn-reset-config {
                color: #dc3545 !important;
            }

            .btn-reset-config:hover {
                border-color: #dc3545 !important;
                background: #fee !important;
            }

            /* 测试人员配置样式 */
            .test-persons-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 10px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                min-height: 100px;
                max-height: 300px;
                overflow-y: auto;
            }

            .test-person-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .test-person-item:hover {
                border-color: #3b82f6;
                box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
            }

            .person-name {
                font-size: 13px;
                color: #333;
                font-weight: 500;
            }

            .btn-remove-person {
                width: 24px;
                height: 24px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 16px;
                color: #999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .btn-remove-person:hover {
                background: #fee;
                border-color: #fcc;
                color: #dc3545;
            }

            .no-persons {
                color: #999;
                font-size: 12px;
                text-align: center;
                padding: 20px;
            }

            .add-person-form {
                display: flex;
                gap: 8px;
            }

            .add-person-form input {
                flex: 1;
            }

            .btn-add-person {
                padding: 8px 20px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .btn-add-person:hover {
                background: #2563eb;
            }

            .form-hint {
                margin-top: 10px;
                padding: 10px;
                background: #f0f9ff;
                border: 1px solid #bfdbfe;
                border-radius: 4px;
            }

            .form-hint small {
                color: #1e40af;
                font-size: 12px;
            }

            /* 导出对话框样式 */
            .export-dialog .form-control {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                transition: border-color 0.2s;
            }

            .export-dialog .form-control:focus {
                outline: none;
                border-color: #3b82f6;
            }

            .btn-export {
                background: #10b981;
                color: white;
            }

            .btn-export:hover {
                background: #059669;
            }

            .btn-cancel {
                background: #6b7280;
                color: white;
            }

            .btn-cancel:hover {
                background: #4b5563;
            }

            /* Toast提示样式 */
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                background: white;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-size: 14px;
                z-index: 999999;
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.3s ease;
            }

            .toast.show {
                opacity: 1;
                transform: translateX(0);
            }

            .toast-info {
                border-left: 4px solid #3b82f6;
                color: #1e40af;
            }

            .toast-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }

            .toast-error {
                border-left: 4px solid #ef4444;
                color: #991b1b;
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * 按条件筛选Bug
   */
  function filterBugsByCondition(condition) {
    const tbody = document.querySelector(
      "#bugList tbody, table.table.has-sort-head tbody"
    );
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr[data-id]");
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    let visibleCount = 0;

    rows.forEach((row) => {
      let shouldShow = false;

      switch (condition) {
        case "today":
          // 今日新增
          const dateCell = row.querySelector(".c-openedDate");
          const dateText = dateCell ? dateCell.textContent.trim() : "";
          shouldShow = dateText.startsWith(todayStr);
          break;

        case "overdue":
          // 已超期
          const deadlineCell = row.querySelector(".c-deadline");
          if (deadlineCell) {
            const days = parseInt(
              deadlineCell.getAttribute("data-days") || "99999",
              10
            );
            shouldShow = days < 0;
          }
          break;

        case "urgent":
          // 临近超期
          const deadlineCell2 = row.querySelector(".c-deadline");
          if (deadlineCell2) {
            const days = parseInt(
              deadlineCell2.getAttribute("data-days") || "99999",
              10
            );
            const span = deadlineCell2.querySelector("span");
            shouldShow =
              days >= 0 && span && span.classList.contains("text-danger");
          }
          break;

        case "testing":
          // 测试中
          shouldShow = row.classList.contains("bug-in-testing");
          break;

        case "all":
        default:
          // 显示全部
          shouldShow = true;
          break;
      }

      if (shouldShow) {
        row.removeAttribute("data-filtered");
        row.style.display = "";
        visibleCount++;
      } else {
        row.setAttribute("data-filtered", "hidden");
        row.style.display = "none";
      }
    });

    // 更新筛选状态显示
    updateFilterStatus(condition);

    console.log(
      `[禅道Bug提醒] 筛选条件: ${condition}, 显示 ${visibleCount} 个Bug`
    );
  }

  /**
   * 更新筛选状态显示
   */
  function updateFilterStatus(condition) {
    const conditionNames = {
      today: "今日新增",
      overdue: "已超期",
      urgent: "临近超期",
      testing: "测试中",
      all: "全部",
    };

    const statusElem = document.getElementById("currentFilterStatus");
    if (statusElem) {
      if (condition === "all") {
        statusElem.style.display = "none";
      } else {
        statusElem.textContent = `当前筛选: ${
          conditionNames[condition] || condition
        }`;
        statusElem.style.display = "inline-block";
      }
    }
  }

  /**
   * 创建今日新增汇总面板（支持可配置统计规则）
   */
  function createTodaySummary() {
    const tbody = document.querySelector(
      "#bugList tbody, table.table.has-sort-head tbody"
    );
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr[data-id]"));
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    // 基础统计数据
    let todayTotal = 0;
    let todayLevel1 = 0;
    let todayLevel2 = 0;
    let todayLevel3 = 0;
    let urgentBugs = 0;
    let overdueBugs = 0;

    rows.forEach((row) => {
      const dateCell = row.querySelector(".c-openedDate");
      const dateText = dateCell ? dateCell.textContent.trim() : "";

      if (dateText.startsWith(todayStr)) {
        todayTotal++;
        const severity = getSeverity(row);
        if (severity === "1") todayLevel1++;
        else if (severity === "2") todayLevel2++;
        else if (severity === "3") todayLevel3++;
      }

      const deadlineCell = row.querySelector(".c-deadline");
      if (deadlineCell) {
        const days = parseInt(
          deadlineCell.getAttribute("data-days") || "99999",
          10
        );
        const span = deadlineCell.querySelector("span");
        if (span && span.classList.contains("text-danger")) {
          if (days < 0) {
            overdueBugs++;
          } else {
            urgentBugs++;
          }
        }
      }
    });

    // 使用统计引擎计算自定义规则
    const customStats = StatisticsEngine.calculate(rows);

    // 创建汇总条HTML
    let statsHtml = `
      <div class="summary-item today-item clickable" data-filter="today">
        <span class="summary-icon">📅</span>
        <span class="summary-label">今日新增</span>
        <span class="summary-value ${todayTotal > 0 ? "has-value" : ""}">${todayTotal}</span>
        ${todayTotal > 0 ? `<span class="summary-detail">(严重${todayLevel1} 中${todayLevel2} 轻${todayLevel3})</span>` : ""}
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item urgent-item clickable" data-filter="overdue">
        <span class="summary-icon">⚠️</span>
        <span class="summary-label">已超期</span>
        <span class="summary-value ${overdueBugs > 0 ? "danger-value" : ""}">${overdueBugs}</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item warning-item clickable" data-filter="urgent">
        <span class="summary-icon">⏰</span>
        <span class="summary-label">临近超期</span>
        <span class="summary-value ${urgentBugs > 0 ? "warning-value" : ""}">${urgentBugs}</span>
      </div>
    `;

    // 添加自定义统计项
    customStats.forEach(stat => {
      statsHtml += `
        <div class="summary-divider"></div>
        <div class="summary-item custom-stat clickable" data-rule-id="${stat.id}">
          <span class="summary-icon">${stat.icon}</span>
          <span class="summary-label">${stat.name}</span>
          <span class="summary-value ${stat.count > 0 ? "success-value" : ""}">${stat.count}</span>
        </div>
      `;
    });

    statsHtml += `
      <div class="summary-divider"></div>
      <div class="summary-item total-item clickable" data-filter="all">
        <span class="summary-icon">📊</span>
        <span class="summary-label">总计</span>
        <span class="summary-value">${rows.length}</span>
      </div>
      <div class="summary-divider"></div>
      <button class="export-excel-btn" title="导出Excel">📊 导出</button>
      <button class="test-persons-config-btn" title="配置测试人员">👥 测试人员</button>
      <button class="stats-config-btn" title="配置统计规则">⚙️</button>
    `;

    const panel = document.createElement("div");
    panel.className = "zentao-summary-bar";
    panel.innerHTML = statsHtml;

    // 绑定点击事件
    panel.querySelectorAll(".summary-item.clickable").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        panel
          .querySelectorAll(".summary-item")
          .forEach((i) => i.classList.remove("active"));

        item.classList.add("active");

        // 检查是否是自定义统计项
        const ruleId = item.getAttribute("data-rule-id");
        if (ruleId) {
          StatisticsEngine.applyFilter(ruleId);
        } else {
          const filterType = item.getAttribute("data-filter");
          filterBugsByCondition(filterType);
        }
      });
    });

    // 绑定配置按钮
    const configBtn = panel.querySelector(".stats-config-btn");
    if (configBtn) {
      configBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showStatisticsConfigDialog();
      });
    }

    // 绑定测试人员配置按钮
    const testPersonsBtn = panel.querySelector(".test-persons-config-btn");
    if (testPersonsBtn) {
      testPersonsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showTestPersonsConfigDialog();
      });
    }

    // 绑定Excel导出按钮
    const exportBtn = panel.querySelector(".export-excel-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showExportDialog();
      });
    }

    // 插入到Bug列表上方
    const bugForm = document.querySelector(".main-table.table-bug, #bugForm");
    if (bugForm) {
      bugForm.parentNode.insertBefore(panel, bugForm);
    }

    console.log(`[禅道Bug提醒] 今日新增${todayTotal}个Bug，自定义统计项${customStats.length}个`);
  }

  /**
   * ==================== 工具栏和筛选功能 ====================
   */

  /**
   * 创建工具栏
   */
  function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "bug-toolbar";
    toolbar.innerHTML = `
            <div class="toolbar-section">
                <label>分组:</label>
                <div class="group-buttons">
                    <button class="group-btn" data-group="none">不分组</button>
                    <button class="group-btn" data-group="person">按人员</button>
                    <button class="group-btn" data-group="severity">按严重程度</button>
                </div>
            </div>
            <div class="toolbar-section" style="flex: 1;">
                <label>标签筛选:</label>
                <div id="tagFiltersContainer" class="tag-filters-container">
                    <div id="tagFilters" class="tag-filters">
                        <span class="no-filters">无筛选</span>
                    </div>
                    <div class="tag-filter-actions">
                        <button id="addTagFilterBtn" class="toolbar-btn btn-icon" title="添加标签筛选">+</button>
                        <button id="clearFiltersBtn" class="toolbar-btn btn-icon" title="清除所有筛选" style="display: none;">✕</button>
                    </div>
                </div>
                <span id="currentFilterStatus" class="filter-status" style="display: none;"></span>
            </div>
            <div class="toolbar-section">
                <button id="manageTagsBtn" class="toolbar-btn">管理标签</button>
                <button id="exportDataBtn" class="toolbar-btn">导出数据</button>
            </div>
        `;

    // 插入到汇总面板之后
    const summaryBar = document.querySelector(".zentao-summary-bar");
    if (summaryBar) {
      summaryBar.after(toolbar);
    }

    // 绑定事件
    bindToolbarEvents();
  }

  /**
   * 绑定工具栏事件
   */
  function bindToolbarEvents() {
    // 分组按钮
    const groupButtons = document.querySelectorAll(".group-btn");
    const preference = BugDataManager.getFilterPreference();
    const currentGroup = preference.groupBy || "none";

    groupButtons.forEach((btn) => {
      const groupType = btn.getAttribute("data-group");

      // 设置初始激活状态
      if (groupType === currentGroup) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 更新按钮状态
        groupButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // 应用分组
        const groupBy = btn.getAttribute("data-group");
        BugDataManager.saveFilterPreference({ groupBy });
        applyGrouping(groupBy);
      });
    });

    // 添加标签筛选按钮（快捷菜单）
    const addTagFilterBtn = document.getElementById("addTagFilterBtn");
    if (addTagFilterBtn) {
      addTagFilterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showQuickTagFilterMenu(e.target);
      });
    }

    // 清除所有筛选按钮
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearAllFilters();
      });
    }

    // 管理标签按钮
    const manageTagsBtn = document.getElementById("manageTagsBtn");
    if (manageTagsBtn) {
      manageTagsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showManageTagsDialog();
      });
    }

    // 导出数据按钮
    const exportDataBtn = document.getElementById("exportDataBtn");
    if (exportDataBtn) {
      exportDataBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        exportBugData();
      });
    }
  }

  /**
   * 显示快速标签筛选菜单
   */
  function showQuickTagFilterMenu(button) {
    const allTags = BugDataManager.getAllTags();
    if (allTags.length === 0) {
      alert("暂无标签，请先给Bug添加标签");
      return;
    }

    const preference = BugDataManager.getFilterPreference();
    const selectedTags = preference.selectedTags || [];

    // 创建下拉菜单
    const menu = document.createElement("div");
    menu.className = "quick-tag-menu";
    menu.innerHTML = `
      <div class="quick-tag-menu-content">
        <div class="quick-tag-menu-header">选择标签筛选</div>
        <div class="quick-tag-list">
          ${allTags
            .map((tag) => {
              const color = BugDataManager.getTagColor(tag);
              const isSelected = selectedTags.includes(tag);
              return `
              <div class="quick-tag-item ${
                isSelected ? "selected" : ""
              }" data-tag="${tag}">
                <span class="tag-color" style="background-color: ${color};"></span>
                <span class="tag-name">${tag}</span>
                ${isSelected ? '<span class="tag-check">✓</span>' : ""}
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    // 定位菜单
    const rect = button.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.top = rect.bottom + 5 + "px";
    menu.style.left = rect.left + "px";

    // 绑定标签点击事件
    menu.querySelectorAll(".quick-tag-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const tag = item.getAttribute("data-tag");
        const isSelected = item.classList.contains("selected");

        if (isSelected) {
          // 移除标签
          removeTagFilter(tag);
        } else {
          // 添加标签
          addTagFilter(tag);
        }

        // 关闭菜单
        menu.remove();
      });
    });

    // 点击外部关闭菜单
    const closeMenu = (e) => {
      if (!menu.contains(e.target) && e.target !== button) {
        menu.remove();
        document.removeEventListener("click", closeMenu);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", closeMenu);
    }, 0);

    document.body.appendChild(menu);
  }

  /**
   * 添加标签筛选
   */
  function addTagFilter(tag) {
    const preference = BugDataManager.getFilterPreference();
    const selectedTags = preference.selectedTags || [];

    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
      BugDataManager.saveFilterPreference({ selectedTags });
      applyTagFilter(selectedTags);
      updateTagFilterDisplay(selectedTags);
    }
  }

  /**
   * 移除标签筛选
   */
  function removeTagFilter(tag) {
    const preference = BugDataManager.getFilterPreference();
    const selectedTags = (preference.selectedTags || []).filter(
      (t) => t !== tag
    );

    BugDataManager.saveFilterPreference({ selectedTags });
    applyTagFilter(selectedTags);
    updateTagFilterDisplay(selectedTags);

    // 如果当前有分组，需要重新应用分组以正确处理被筛选的行
    if (preference.groupBy && preference.groupBy !== "none") {
      // 移除旧的分组标题
      document
        .querySelectorAll(".group-header-row")
        .forEach((el) => el.remove());
      // 清除行的分组标记和折叠状态
      document.querySelectorAll("tr[data-id]").forEach((row) => {
        row.removeAttribute("data-group");
        row.removeAttribute("data-collapsed");
      });
      // 重新应用分组
      applyGrouping(preference.groupBy);
    }
  }

  /**
   * 清除所有筛选
   */
  function clearAllFilters() {
    const preference = BugDataManager.getFilterPreference();
    BugDataManager.saveFilterPreference({ selectedTags: [] });
    applyTagFilter([]);
    updateTagFilterDisplay([]);

    // 移除统计面板的激活状态
    document.querySelectorAll(".summary-item.active").forEach((item) => {
      item.classList.remove("active");
    });

    // 如果当前有分组，需要重新应用分组以正确处理被筛选的行
    if (preference.groupBy && preference.groupBy !== "none") {
      // 移除旧的分组标题
      document
        .querySelectorAll(".group-header-row")
        .forEach((el) => el.remove());
      // 清除行的分组标记和折叠状态
      document.querySelectorAll("tr[data-id]").forEach((row) => {
        row.removeAttribute("data-group");
        row.removeAttribute("data-collapsed");
      });
      // 重新应用分组
      applyGrouping(preference.groupBy);
    }
  }

  /**
   * 应用分组
   */
  function applyGrouping(groupBy) {
    const tbody = document.querySelector(
      "#bugList tbody, table.table.has-sort-head tbody"
    );
    if (!tbody) return;

    // 移除现有分组标题
    document.querySelectorAll(".group-header-row").forEach((el) => el.remove());

    if (groupBy === "none") {
      console.log("[禅道Bug提醒] 取消分组");
      // 重新应用筛选（如果有的话）
      const preference = BugDataManager.getFilterPreference();
      if (preference.selectedTags && preference.selectedTags.length > 0) {
        applyTagFilter(preference.selectedTags);
      }
      return;
    }

    const rows = Array.from(tbody.querySelectorAll("tr[data-id]"));
    console.log(
      `[禅道Bug提醒] 开始分组，分组方式: ${groupBy}，总Bug数: ${rows.length}`
    );

    // 按不同维度分组
    const groups = {};

    rows.forEach((row) => {
      // 跳过通过筛选隐藏的行
      if (row.getAttribute("data-filtered") === "hidden") {
        return;
      }

      let groupKey = "未分类";

      if (groupBy === "person") {
        groupKey = getAssignedPerson(row, false); // 关闭调试模式
      } else if (groupBy === "severity") {
        const severity = getSeverity(row);
        const severityNames = {
          1: "🔴 严重",
          2: "🟠 中等",
          3: "🟡 轻微",
          4: "🔵 建议",
        };
        groupKey = severityNames[severity] || "未知";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
      // 给行标记所属分组，方便后续查找
      row.setAttribute("data-group", groupKey);
    });

    // 为每组创建分组标题，并重新排列Bug行
    // 对于严重程度分组，使用自定义排序
    let groupKeys = Object.keys(groups);
    if (groupBy === "severity") {
      // 按严重程度优先级排序
      const severityOrder = {
        "🔴 严重": 1,
        "🟠 中等": 2,
        "🟡 轻微": 3,
        "🔵 建议": 4,
        未知: 5,
      };
      groupKeys.sort(
        (a, b) => (severityOrder[a] || 99) - (severityOrder[b] || 99)
      );
    } else {
      groupKeys.sort();
    }

    // 创建一个文档片段来存储重新排序的内容
    const fragment = document.createDocumentFragment();

    groupKeys.forEach((groupKey) => {
      const groupRows = groups[groupKey];
      if (groupRows.length === 0) return;

      // 创建分组标题行
      const groupHeader = document.createElement("tr");
      groupHeader.className = "group-header-row";
      groupHeader.setAttribute("data-group-name", groupKey);

      // 获取列数（从第一行获取）
      const firstRow = groupRows[0];
      const colCount = firstRow.querySelectorAll("td").length;

      // 计算可见的行数
      const visibleCount = groupRows.filter(
        (row) => row.getAttribute("data-filtered") !== "hidden"
      ).length;

      groupHeader.innerHTML = `
                    <td colspan="${colCount}" class="group-header">
                        <span class="group-toggle">▼</span>
                        <strong>${groupKey}</strong>
                        <span class="group-count">(${visibleCount}个)</span>
                    </td>
                `;

      // 分组折叠/展开
      const toggleBtn = groupHeader.querySelector(".group-toggle");
      const toggleGroup = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = toggleBtn.textContent === "▶";
        toggleBtn.textContent = isCollapsed ? "▼" : "▶";

        // 只控制属于该分组且未被筛选隐藏的行
        groupRows.forEach((row) => {
          if (row.getAttribute("data-filtered") !== "hidden") {
            if (isCollapsed) {
              row.style.display = "";
              row.setAttribute("data-collapsed", "false");
            } else {
              row.style.display = "none";
              row.setAttribute("data-collapsed", "true");
            }
          }
        });
      };

      // 整行都可以点击
      groupHeader.addEventListener("click", toggleGroup);

      // 先添加分组标题到文档片段
      fragment.appendChild(groupHeader);

      // 然后把这个组的所有Bug行添加到文档片段（移动而不是复制）
      groupRows.forEach((row) => {
        // appendChild会自动从原位置移除并添加到新位置
        fragment.appendChild(row);
      });
    });

    // 移除所有现有的行（但保留DOM引用）
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // 添加重新排序的内容
    tbody.appendChild(fragment);

    // 输出分组统计
    console.log(
      `[禅道Bug提醒] 已按${groupBy}分组，共${Object.keys(groups).length}个分组:`
    );
    Object.keys(groups).forEach((groupKey) => {
      console.log(`  - ${groupKey}: ${groups[groupKey].length}个Bug`);
    });
  }

  /**
   * 显示标签筛选对话框
   */
  function showTagFilterDialog() {
    const allTags = BugDataManager.getAllTags();
    const preference = BugDataManager.getFilterPreference();
    const selectedTags = preference.selectedTags || [];

    const dialog = document.createElement("div");
    dialog.className = "tag-filter-dialog";
    dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>筛选标签</h3>
                    <button class="dialog-close">&times;</button>
                </div>
                <div class="dialog-body">
                    <div class="form-group">
                        <label>选择要筛选的标签(可多选)</label>
                        <div class="tag-list">
                            ${
                              allTags.length > 0
                                ? allTags
                                    .map((tag) => {
                                      const color =
                                        BugDataManager.getTagColor(tag);
                                      const isActive =
                                        selectedTags.includes(tag);
                                      return `
                                        <span class="tag-option ${
                                          isActive ? "active" : ""
                                        }"
                                              style="background-color: ${color};"
                                              data-tag="${tag}">
                                            ${tag}
                                        </span>
                                    `;
                                    })
                                    .join("")
                                : '<span class="no-tags">暂无标签</span>'
                            }
                        </div>
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn-reset">重置筛选</button>
                    <button class="btn-cancel">取消</button>
                    <button class="btn-save">应用筛选</button>
                </div>
            </div>
        `;

    // 关闭按钮
    dialog.querySelector(".dialog-close").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });
    dialog.querySelector(".btn-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });

    // 标签选择
    const tagOptions = dialog.querySelectorAll(".tag-option");
    tagOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        option.classList.toggle("active");
      });
    });

    // 重置按钮
    dialog.querySelector(".btn-reset").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      BugDataManager.saveFilterPreference({ selectedTags: [] });
      applyTagFilter([]);
      updateTagFilterDisplay([]);

      // 如果有分组，重新应用分组以更新数量
      const preference = BugDataManager.getFilterPreference();
      if (preference.groupBy && preference.groupBy !== "none") {
        // 移除旧的分组标题
        document
          .querySelectorAll(".group-header-row")
          .forEach((el) => el.remove());
        // 清除行的分组标记
        document.querySelectorAll("tr[data-id]").forEach((row) => {
          row.removeAttribute("data-group");
          row.removeAttribute("data-collapsed");
        });
        // 重新应用分组
        applyGrouping(preference.groupBy);
      }

      dialog.remove();
    });

    // 应用筛选按钮
    dialog.querySelector(".btn-save").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const selectedTags = Array.from(
        dialog.querySelectorAll(".tag-option.active")
      ).map((el) => el.getAttribute("data-tag"));

      BugDataManager.saveFilterPreference({ selectedTags });
      applyTagFilter(selectedTags);
      updateTagFilterDisplay(selectedTags);

      // 如果当前有分组，需要重新应用分组以正确处理被筛选的行
      const preference = BugDataManager.getFilterPreference();
      if (preference.groupBy && preference.groupBy !== "none") {
        // 移除旧的分组标题
        document
          .querySelectorAll(".group-header-row")
          .forEach((el) => el.remove());
        // 清除行的分组标记和折叠状态
        document.querySelectorAll("tr[data-id]").forEach((row) => {
          row.removeAttribute("data-group");
          row.removeAttribute("data-collapsed");
        });
        // 重新应用分组
        applyGrouping(preference.groupBy);
      }

      dialog.remove();
    });

    document.body.appendChild(dialog);
  }

  /**
   * 应用标签筛选
   */
  function applyTagFilter(selectedTags) {
    const rows = document.querySelectorAll("tr[data-id]");

    console.log(`[禅道Bug提醒] 开始筛选，选中的标签:`, selectedTags);
    console.log(`[禅道Bug提醒] 找到Bug行数量: ${rows.length}`);

    let visibleCount = 0;
    let hiddenCount = 0;

    if (selectedTags.length === 0) {
      // 清除所有筛选标记
      rows.forEach((row) => {
        row.removeAttribute("data-filtered");
        // 只有不是被分组折叠的行才显示
        if (row.getAttribute("data-collapsed") !== "true") {
          row.style.display = "";
        }
        visibleCount++;
      });
      console.log(`[禅道Bug提醒] 无筛选条件，显示全部 ${visibleCount} 个Bug`);
    } else {
      // 只显示包含选中标签的行
      rows.forEach((row) => {
        const bugId = row.getAttribute("data-id");
        const bugTags = BugDataManager.getBugTags(bugId);
        const hasTag = selectedTags.some((tag) => bugTags.includes(tag));

        if (hasTag) {
          row.removeAttribute("data-filtered");
          // 只有不是被分组折叠的行才显示
          if (row.getAttribute("data-collapsed") !== "true") {
            row.style.display = "";
          }
          visibleCount++;
          console.log(`[筛选] Bug #${bugId} - 标签匹配 ✓`, bugTags);
        } else {
          row.setAttribute("data-filtered", "hidden");
          row.style.display = "none";
          hiddenCount++;
        }
      });

      console.log(
        `[禅道Bug提醒] 筛选完成: 显示 ${visibleCount} 个，隐藏 ${hiddenCount} 个`
      );
    }

    // 更新分组标题（如果有分组的话）
    const preference = BugDataManager.getFilterPreference();
    if (preference.groupBy && preference.groupBy !== "none") {
      updateGroupHeadersCount();
    }

    console.log(`[禅道Bug提醒] 已筛选标签: ${selectedTags.join(", ")}`);
  }

  /**
   * 更新分组标题的显示状态和数量（用于筛选后）
   */
  function updateGroupHeadersCount() {
    const groupHeaders = document.querySelectorAll(".group-header-row");
    groupHeaders.forEach((header) => {
      const groupName = header.getAttribute("data-group-name");
      const groupRows = document.querySelectorAll(
        `tr[data-id][data-group="${groupName}"]`
      );

      let visibleCount = 0;

      // 计算该分组中可见的行数
      groupRows.forEach((row) => {
        if (row.getAttribute("data-filtered") !== "hidden") {
          visibleCount++;
        }
      });

      // 更新分组标题中的数量
      const countSpan = header.querySelector(".group-count");
      if (countSpan) {
        countSpan.textContent = `(${visibleCount}个)`;
      }

      // 如果该分组没有可见的行，隐藏分组标题
      header.style.display = visibleCount > 0 ? "" : "none";
    });
  }

  /**
   * 更新标签筛选显示
   */
  function updateTagFilterDisplay(selectedTags) {
    const tagFilters = document.getElementById("tagFilters");
    const clearBtn = document.getElementById("clearFiltersBtn");

    if (!tagFilters) return;

    if (selectedTags.length === 0) {
      tagFilters.innerHTML = '<span class="no-filters">无筛选</span>';
      if (clearBtn) clearBtn.style.display = "none";
    } else {
      tagFilters.innerHTML = selectedTags
        .map((tag) => {
          const color = BugDataManager.getTagColor(tag);
          return `
            <span class="filter-tag" style="background-color: ${color};" data-tag="${tag}">
              ${tag}
              <span class="filter-tag-remove" title="移除筛选">×</span>
            </span>
          `;
        })
        .join("");

      // 绑定删除事件
      tagFilters.querySelectorAll(".filter-tag-remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const tag = btn.parentElement.getAttribute("data-tag");
          removeTagFilter(tag);
        });
      });

      // 显示清除按钮
      if (clearBtn) clearBtn.style.display = "inline-block";
    }
  }

  /**
   * 显示管理标签对话框
   */
  function showManageTagsDialog() {
    const allTags = BugDataManager.getAllTags();

    const dialog = document.createElement("div");
    dialog.className = "manage-tags-dialog";
    dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>管理标签</h3>
                    <button class="dialog-close">&times;</button>
                </div>
                <div class="dialog-body">
                    <div class="tag-management-list">
                        ${
                          allTags.length > 0
                            ? allTags
                                .map((tag) => {
                                  const color = BugDataManager.getTagColor(tag);
                                  return `
                                <div class="tag-management-item">
                                    <span class="tag-preview" style="background-color: ${color};">${tag}</span>
                                    <input type="color" class="tag-color-picker" value="${color}" data-tag="${tag}" />
                                    <button class="btn-delete-tag" data-tag="${tag}">删除</button>
                                </div>
                            `;
                                })
                                .join("")
                            : '<div class="no-tags">暂无标签</div>'
                        }
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn-close">关闭</button>
                </div>
            </div>
        `;

    // 关闭按钮
    dialog.querySelector(".dialog-close").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });
    dialog.querySelector(".btn-close").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });

    // 颜色选择器
    const colorPickers = dialog.querySelectorAll(".tag-color-picker");
    colorPickers.forEach((picker) => {
      picker.addEventListener("change", (e) => {
        e.stopPropagation();
        const tag = picker.getAttribute("data-tag");
        const color = e.target.value;
        BugDataManager.setTagColor(tag, color);

        // 更新预览
        const preview = picker.previousElementSibling;
        if (preview) {
          preview.style.backgroundColor = color;
        }

        // 刷新页面上的所有标签显示
        document.querySelectorAll("tr[data-id]").forEach((row) => {
          const bugId = row.getAttribute("data-id");
          refreshBugTags(bugId);
        });
      });
    });

    // 删除标签按钮
    const deleteButtons = dialog.querySelectorAll(".btn-delete-tag");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tag = btn.getAttribute("data-tag");
        if (
          confirm(`确定要删除标签 "${tag}" 吗？此操作将从所有Bug中移除该标签。`)
        ) {
          BugDataManager.deleteTag(tag);
          dialog.remove();
          showManageTagsDialog(); // 重新打开对话框

          // 刷新页面上的所有标签显示
          document.querySelectorAll("tr[data-id]").forEach((row) => {
            const bugId = row.getAttribute("data-id");
            refreshBugTags(bugId);
          });
        }
      });
    });

    document.body.appendChild(dialog);
  }

  /**
   * 导出Bug数据
   */
  function exportBugData() {
    const data = BugDataManager.getData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `zentao_bug_data_${new Date().getTime()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log("[禅道Bug提醒] 数据已导出");
  }

  /**
   * ==================== 统计规则配置面板 ====================
   */
  
  /**
   * 显示统计规则配置对话框
   */
  function showStatisticsConfigDialog() {
    const rules = BugDataManager.getStatisticsRules();

    DialogManager.show('statsConfig', () => {
      const dialog = document.createElement("div");
      dialog.className = "stats-config-dialog";
      
      const rulesHtml = rules.map((rule) => `
        <div class="stats-rule-item" data-rule-id="${rule.id}">
          <div class="rule-header">
            <input type="checkbox" class="rule-enabled" ${rule.enabled ? 'checked' : ''} />
            <input type="text" class="rule-icon" value="${rule.icon || '📊'}" maxlength="2" placeholder="图标" />
            <input type="text" class="rule-name" value="${rule.name}" placeholder="统计项名称" />
            <button class="btn-delete-rule" title="删除">🗑️</button>
          </div>
          <div class="rule-conditions">
            <div class="condition-group">
              <label>包含条件（满足任一即可）</label>
              <div class="conditions-list include-conditions">
                ${(rule.conditions.include || []).map((cond) => `
                  <div class="condition-item">
                    <select class="cond-field">
                      <option value="assignedTo" ${cond.field === 'assignedTo' ? 'selected' : ''}>指派给</option>
                      <option value="status" ${cond.field === 'status' ? 'selected' : ''}>状态</option>
                      <option value="severity" ${cond.field === 'severity' ? 'selected' : ''}>严重程度</option>
                      <option value="tag" ${cond.field === 'tag' ? 'selected' : ''}>标签</option>
                      <option value="title" ${cond.field === 'title' ? 'selected' : ''}>标题包含</option>
                    </select>
                    <input type="text" class="cond-values" value="${cond.values.join(',')}" placeholder="多个值用逗号分隔" />
                    <button class="btn-remove-cond">×</button>
                  </div>
                `).join('')}
              </div>
              <button class="btn-add-cond" data-type="include">+ 添加包含条件</button>
            </div>
            <div class="condition-group">
              <label>排除条件（满足任一则排除）</label>
              <div class="conditions-list exclude-conditions">
                ${(rule.conditions.exclude || []).map((cond) => `
                  <div class="condition-item">
                    <select class="cond-field">
                      <option value="assignedTo" ${cond.field === 'assignedTo' ? 'selected' : ''}>指派给</option>
                      <option value="status" ${cond.field === 'status' ? 'selected' : ''}>状态</option>
                      <option value="severity" ${cond.field === 'severity' ? 'selected' : ''}>严重程度</option>
                      <option value="tag" ${cond.field === 'tag' ? 'selected' : ''}>标签</option>
                      <option value="title" ${cond.field === 'title' ? 'selected' : ''}>标题包含</option>
                    </select>
                    <input type="text" class="cond-values" value="${cond.values.join(',')}" placeholder="多个值用逗号分隔" />
                    <button class="btn-remove-cond">×</button>
                  </div>
                `).join('')}
              </div>
              <button class="btn-add-cond" data-type="exclude">+ 添加排除条件</button>
            </div>
          </div>
        </div>
      `).join('');

      dialog.innerHTML = `
        <div class="dialog-overlay"></div>
        <div class="dialog-content stats-config-content">
          <div class="dialog-header">
            <h3>配置统计规则</h3>
            <button class="dialog-close">&times;</button>
          </div>
          <div class="dialog-body">
            <div class="stats-rules-list">
              ${rulesHtml}
            </div>
            <button class="btn-add-rule">+ 新增统计项</button>
            <div class="config-actions">
              <button class="btn-import-config">导入配置</button>
              <button class="btn-export-config">导出配置</button>
              <button class="btn-reset-config">恢复默认</button>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-cancel">取消</button>
            <button class="btn-save">保存并刷新</button>
          </div>
        </div>
      `;

      dialog.querySelector(".dialog-close").addEventListener("click", () => DialogManager.close('statsConfig'));
      dialog.querySelector(".btn-cancel").addEventListener("click", () => DialogManager.close('statsConfig'));

      dialog.querySelector(".btn-save").addEventListener("click", () => {
        saveStatisticsRules(dialog);
        DialogManager.close('statsConfig');
        location.reload();
      });

      dialog.querySelector(".btn-add-rule").addEventListener("click", () => {
        BugDataManager.addStatisticsRule({
          id: 'rule_' + Date.now(),
          name: '新统计项',
          icon: '📊',
          enabled: true,
          conditions: { include: [], exclude: [] }
        });
        showStatisticsConfigDialog();
      });

      dialog.querySelectorAll(".btn-delete-rule").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const ruleItem = e.target.closest('.stats-rule-item');
          const ruleId = ruleItem.getAttribute('data-rule-id');
          if (confirm('确定删除此统计项吗？')) {
            BugDataManager.deleteStatisticsRule(ruleId);
            ruleItem.remove();
          }
        });
      });

      dialog.querySelectorAll(".btn-add-cond").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const conditionsList = e.target.previousElementSibling;
          const newCond = document.createElement('div');
          newCond.className = 'condition-item';
          newCond.innerHTML = `
            <select class="cond-field">
              <option value="assignedTo">指派给</option>
              <option value="status">状态</option>
              <option value="severity">严重程度</option>
              <option value="tag">标签</option>
              <option value="title">标题包含</option>
            </select>
            <input type="text" class="cond-values" placeholder="多个值用逗号分隔" />
            <button class="btn-remove-cond">×</button>
          `;
          conditionsList.appendChild(newCond);
          
          newCond.querySelector('.btn-remove-cond').addEventListener('click', () => newCond.remove());
        });
      });

      dialog.querySelectorAll(".btn-remove-cond").forEach(btn => {
        btn.addEventListener("click", (e) => e.target.closest('.condition-item').remove());
      });

      dialog.querySelector(".btn-import-config").addEventListener("click", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const config = JSON.parse(event.target.result);
              BugDataManager.saveData(config);
              alert('配置导入成功！页面将刷新。');
              location.reload();
            } catch (error) {
              alert('配置文件格式错误！');
            }
          };
          reader.readAsText(file);
        };
        input.click();
      });

      dialog.querySelector(".btn-export-config").addEventListener("click", () => exportBugData());

      dialog.querySelector(".btn-reset-config").addEventListener("click", () => {
        if (confirm('确定恢复默认配置吗？这将清空所有自定义统计项！')) {
          const data = BugDataManager.getData();
          data.statisticsRules = BugDataManager.getDefaultStatisticsRules();
          BugDataManager.saveData(data);
          alert('已恢复默认配置！页面将刷新。');
          location.reload();
        }
      });

      return dialog;
    });
  }

  function saveStatisticsRules(dialog) {
    const ruleItems = dialog.querySelectorAll('.stats-rule-item');
    const rules = [];

    ruleItems.forEach(item => {
      const ruleId = item.getAttribute('data-rule-id');
      const enabled = item.querySelector('.rule-enabled').checked;
      const icon = item.querySelector('.rule-icon').value.trim() || '📊';
      const name = item.querySelector('.rule-name').value.trim() || '未命名';

      const includeConditions = [];
      item.querySelectorAll('.include-conditions .condition-item').forEach(condItem => {
        const field = condItem.querySelector('.cond-field').value;
        const values = condItem.querySelector('.cond-values').value
          .split(',')
          .map(v => v.trim())
          .filter(v => v);
        if (values.length > 0) {
          includeConditions.push({ field, values });
        }
      });

      const excludeConditions = [];
      item.querySelectorAll('.exclude-conditions .condition-item').forEach(condItem => {
        const field = condItem.querySelector('.cond-field').value;
        const values = condItem.querySelector('.cond-values').value
          .split(',')
          .map(v => v.trim())
          .filter(v => v);
        if (values.length > 0) {
          excludeConditions.push({ field, values });
        }
      });

      rules.push({
        id: ruleId,
        name,
        icon,
        enabled,
        conditions: {
          include: includeConditions,
          exclude: excludeConditions
        }
      });
    });

    BugDataManager.saveStatisticsRules(rules);
  }

  /**
   * ==================== 全局事件委托（避免重复绑定） ====================
   */
  
  function initEventDelegation() {
    if (window._zentaoEventDelegationInitialized) {
      return;
    }
    window._zentaoEventDelegationInitialized = true;

    // 状态下拉框change事件
    document.body.addEventListener('change', (e) => {
      if (e.target.classList.contains('bug-status-select')) {
        const bugId = e.target.getAttribute('data-bug-id');
        const newStatus = e.target.value;
        BugDataManager.setBugStatus(bugId, newStatus);
        // 更新data-status属性以应用新的颜色样式
        e.target.setAttribute('data-status', newStatus);
        console.log(`[禅道Bug提醒] Bug ${bugId} 状态已更新为: ${newStatus}`);
      }
    });

    document.body.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('btn-add-tag-inline') || target.closest('.btn-add-tag-inline')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = target.classList.contains('btn-add-tag-inline') ? target : target.closest('.btn-add-tag-inline');
        const bugId = btn.getAttribute('data-bug-id');
        if (bugId) showAddTagDialog(bugId);
        return;
      }

      if (target.classList.contains('btn-add-note-inline') || target.closest('.btn-add-note-inline')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = target.classList.contains('btn-add-note-inline') ? target : target.closest('.btn-add-note-inline');
        const bugId = btn.getAttribute('data-bug-id');
        if (bugId) showAddNoteDialog(bugId);
        return;
      }

      if (target.classList.contains('tag-remove')) {
        e.preventDefault();
        e.stopPropagation();
        const tagSpan = target.closest('.bug-tag');
        if (tagSpan) {
          const tag = tagSpan.getAttribute('data-tag');
          const bugId = tagSpan.getAttribute('data-bug-id');
          if (tag && bugId && confirm(`确定移除标签 "${tag}" 吗？`)) {
            BugDataManager.removeBugTag(bugId, tag);
            refreshBugTags(bugId);
          }
        }
        return;
      }
    });

    console.log('[禅道Bug提醒] 全局事件委托已初始化');
  }

  /**
   * ==================== 登录页面快捷登录功能 ====================
   */

  /**
   * 创建快捷登录卡片
   */
  function createQuickLoginCards() {
    // 预设的账号列表（可以添加更多）
    const accounts = [
      // 添加更多账号...
    ];

    // 检查localStorage中是否有保存的账号
    const savedAccounts = localStorage.getItem("zentao_quick_accounts");
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          accounts.length = 0;
          accounts.push(...parsed);
        }
      } catch (e) {
        console.log("[快捷登录] 读取保存账号失败");
      }
    }

    // 创建卡片容器
    const container = document.createElement("div");
    container.className = "quick-login-container";
    container.innerHTML = `
            <div class="quick-login-header">
                <h3>⚡ 快捷登录</h3>
                <button class="add-account-btn" title="添加账号">+</button>
            </div>
            <div class="quick-login-cards" id="quickLoginCards"></div>
            <div class="quick-login-footer">
                <small>密码加密存储在本地浏览器</small>
            </div>
        `;

    // 渲染账号卡片
    const cardsContainer = container.querySelector("#quickLoginCards");
    accounts.forEach((account, index) => {
      const card = document.createElement("div");
      card.className = "account-card";
      card.style.borderColor = account.color;
      card.innerHTML = `
                <div class="card-avatar" style="background: ${account.color}">
                    ${account.name.charAt(0)}
                </div>
                <div class="card-info">
                    <div class="card-name">${account.name}</div>
                    <div class="card-role">${account.role}</div>
                    <div class="card-username">${account.username}</div>
                </div>
                <button class="card-login-btn" data-index="${index}">登录</button>
            `;

      // 点击卡片登录
      card.querySelector(".card-login-btn").addEventListener("click", () => {
        quickLogin(account);
      });

      cardsContainer.appendChild(card);
    });

    // 添加账号按钮
    container
      .querySelector(".add-account-btn")
      .addEventListener("click", () => {
        showAddAccountDialog();
      });

    // 插入到登录面板右侧
    const loginPanel = document.querySelector("#loginPanel, #login");
    if (loginPanel) {
      const parent = loginPanel.parentElement;
      if (parent) {
        parent.style.display = "flex";
        parent.style.gap = "20px";
        parent.style.alignItems = "flex-start";
        loginPanel.after(container);
      }
    }
  }

  /**
   * 快捷登录
   */
  function quickLogin(account) {
    const usernameInput = document.querySelector(
      '#account, input[name="account"]'
    );
    const passwordInput = document.querySelector(
      'input[type="password"], input[name="password"]'
    );

    if (!usernameInput || !passwordInput) {
      alert("未找到登录表单");
      return;
    }

    // 填充账号
    usernameInput.value = account.username;

    // 如果有保存密码，填充密码
    if (account.password) {
      passwordInput.value = account.password;
    } else {
      // 没有密码，提示用户输入
      passwordInput.focus();
      passwordInput.placeholder = "请输入密码";
      passwordInput.style.borderColor = "#667eea";
      return;
    }

    // 自动提交登录
    setTimeout(() => {
      const submitBtn = document.querySelector(
        '#submit, button[type="submit"]'
      );
      if (submitBtn) {
        submitBtn.click();
      }
    }, 100);
  }

  /**
   * 显示添加账号对话框
   */
  function showAddAccountDialog() {
    const dialog = document.createElement("div");
    dialog.className = "add-account-dialog";
    dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>添加快捷登录账号</h3>
                    <button class="dialog-close">&times;</button>
                </div>
                <div class="dialog-body">
                    <div class="form-group">
                        <label>姓名</label>
                        <input type="text" id="newAccountName" placeholder="如：张三" />
                    </div>
                    <div class="form-group">
                        <label>角色</label>
                        <input type="text" id="newAccountRole" placeholder="如：研发" />
                    </div>
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="text" id="newAccountUsername" placeholder="如：zhangsan" />
                    </div>
                    <div class="form-group">
                        <label>密码（可选）</label>
                        <input type="password" id="newAccountPassword" placeholder="留空则每次需手动输入" />
                        <small style="color: #999;">密码会加密保存在本地浏览器</small>
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn-cancel">取消</button>
                    <button class="btn-save">保存</button>
                </div>
            </div>
        `;

    // 关闭按钮
    dialog.querySelector(".dialog-close").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });
    dialog.querySelector(".btn-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
    });

    // 保存按钮
    dialog.querySelector(".btn-save").addEventListener("click", () => {
      const name = document.getElementById("newAccountName").value.trim();
      const role = document.getElementById("newAccountRole").value.trim();
      const username = document
        .getElementById("newAccountUsername")
        .value.trim();
      const password = document.getElementById("newAccountPassword").value;

      if (!name || !username) {
        alert("请填写姓名和用户名");
        return;
      }

      // 保存到localStorage
      const savedAccounts = localStorage.getItem("zentao_quick_accounts");
      let accounts = [];
      if (savedAccounts) {
        try {
          accounts = JSON.parse(savedAccounts);
        } catch (e) {}
      }

      accounts.push({
        username,
        password,
        name,
        role: role || "用户",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });

      localStorage.setItem("zentao_quick_accounts", JSON.stringify(accounts));

      alert("账号已添加！刷新页面生效");
      dialog.remove();
    });

    document.body.appendChild(dialog);
  }

  /**
   * 添加登录页面样式
   */
  function addLoginPageStyles() {
    const style = document.createElement("style");
    style.textContent = `
            /* 快捷登录容器 */
            .quick-login-container {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                padding: 20px;
                min-width: 280px;
                max-width: 300px;
            }

            .quick-login-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #f0f0f0;
            }

            .quick-login-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }

            .add-account-btn {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid #667eea;
                background: white;
                color: #667eea;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .add-account-btn:hover {
                background: #667eea;
                color: white;
            }

            .quick-login-cards {
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 400px;
                overflow-y: auto;
            }

            .account-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border: 2px solid #e5e5e5;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .account-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .card-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 18px;
            }

            .card-info {
                flex: 1;
            }

            .card-name {
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }

            .card-role {
                font-size: 11px;
                color: #999;
            }

            .card-username {
                font-size: 11px;
                color: #666;
                font-family: monospace;
            }

            .card-login-btn {
                padding: 6px 16px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .card-login-btn:hover {
                background: #5568d3;
            }

            .quick-login-footer {
                margin-top: 15px;
                text-align: center;
                font-size: 11px;
                color: #999;
            }

            /* 添加账号对话框 */
            .add-account-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 99999;
            }

            .dialog-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
            }

            .dialog-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                width: 400px;
                max-width: 90%;
            }

            .dialog-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dialog-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }

            .dialog-close {
                width: 30px;
                height: 30px;
                border: none;
                background: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
            }

            .dialog-close:hover {
                color: #333;
            }

            .dialog-body {
                padding: 20px;
            }

            .form-group {
                margin-bottom: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-size: 13px;
                color: #555;
                font-weight: 500;
            }

            .form-group input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }

            .form-group small {
                display: block;
                margin-top: 4px;
            }

            .dialog-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            .dialog-footer button {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
            }

            .btn-cancel {
                background: #f5f5f5;
                color: #666;
            }

            .btn-cancel:hover {
                background: #e5e5e5;
            }

            .btn-save {
                background: #667eea;
                color: white;
            }

            .btn-save:hover {
                background: #5568d3;
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * 初始化登录页面
   */
  function initLoginPage() {
    addLoginPageStyles();
    setTimeout(() => {
      createQuickLoginCards();
    }, 300);
    console.log("[禅道Bug提醒] 登录页面快捷登录已加载");
  }

  /**
   * 初始化Bug列表页面
   */
  function initBugListPage() {
    // 添加样式
    addCustomStyles();

    // 初始化全局事件委托（仅一次）
    initEventDelegation();

    // 处理表格
    setTimeout(() => {
      processBugTable();
      createTodaySummary();
      createToolbar();

      // 应用保存的筛选和分组偏好
      const preference = BugDataManager.getFilterPreference();

      // 先应用筛选，再应用分组（这样分组能正确识别被筛选的行）
      if (preference.selectedTags && preference.selectedTags.length > 0) {
        console.log("[初始化] 应用保存的筛选:", preference.selectedTags);
        applyTagFilter(preference.selectedTags);
        updateTagFilterDisplay(preference.selectedTags);
      }

      if (preference.groupBy && preference.groupBy !== "none") {
        console.log("[初始化] 应用保存的分组:", preference.groupBy);
        applyGrouping(preference.groupBy);
      }

      // 事件绑定已通过全局委托处理，无需单独绑定
    }, 500);

    console.log("[禅道Bug提醒] Bug列表增强已加载");
  }

  /**
   * 主初始化
   */
  function init() {
    // 等待页面加载完成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // 根据页面类型初始化不同功能
    const isLoginPage = window.location.href.includes("user-login");

    if (isLoginPage) {
      initLoginPage();
    } else {
      initBugListPage();
    }
  }

  // 启动
  init();
})();
