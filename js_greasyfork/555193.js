// ==UserScript==
// @name         Binance交易数据图表同步插件
// @namespace    http://tampermonkey.net/
// @version      10.0.0
// @description  精确同步币安交易数据tab中的所有图表时间周期
// @author       YangRui
// @match        https://www.binance.com/*
// @match        https://www.binancezh.com/*
// @match        https://www.binance.us/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555193/Binance%E4%BA%A4%E6%98%93%E6%95%B0%E6%8D%AE%E5%9B%BE%E8%A1%A8%E5%90%8C%E6%AD%A5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555193/Binance%E4%BA%A4%E6%98%93%E6%95%B0%E6%8D%AE%E5%9B%BE%E8%A1%A8%E5%90%8C%E6%AD%A5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置项
  const config = {
    debug: true,
    clickDelay: 200, // 点击延迟
    chartSwitchDelay: GM_getValue("chartSwitchDelay", 500), // 图表切换延迟 - 加快速度
    panelPosition: GM_getValue("panelPosition", { x: 20, y: 100 }),
  };

  // 同步状态
  const syncState = {
    isRunning: false,
    currentChart: 0,
    totalCharts: 0,
    targetInterval: null,
    chartsData: [], // 存储所有图表信息
    processedCharts: new Set(),
  };

  // 支持的时间周期
  const supportedIntervals = [
    { label: "5分", value: "5m" },
    { label: "15分", value: "15m" },
    { label: "30分", value: "30m" },
    { label: "1时", value: "1h" },
    { label: "2时", value: "2h" },
    { label: "4时", value: "4h" },
    { label: "6时", value: "6h" },
    { label: "12时", value: "12h" },
    { label: "1天", value: "1d" },
  ];

  // 日志输出
  function log(message, ...args) {
    if (config.debug) {
      console.log(`[交易数据同步] ${message}`, ...args);
    }
  }

  // 检查是否在交易数据tab
  function isInTradingDataTab() {
    const tabElement = document.querySelector("#bn-tab-2");
    return tabElement && tabElement.getAttribute("aria-selected") === "true";
  }

  // 获取所有图表数据
  function getAllChartsData() {
    if (!isInTradingDataTab()) {
      log("不在交易数据tab中");
      return [];
    }

    const container = document.querySelector(
      "#client-side > div > div.react-grid-layout.layout > div.react-grid-item.react-draggable.react-resizable > div > div > div > div > div.w-full.h-full.overflow-scroll > div > div"
    );

    if (!container) {
      log("未找到图表容器");
      return [];
    }

    const validData = Array.from(container.childNodes)
      .map((r, index) => {
        const subtitle = r.querySelector?.(".t-subtitle2.text-PrimaryText");
        const firstSelectField = r.querySelector?.(".bn-select-field-input");
        const parentDiv = firstSelectField?.closest(".bn-select-field");

        return {
          index: index + 1,
          element: r,
          title: subtitle?.textContent?.trim(),
          timeRange: firstSelectField?.textContent?.trim(),
          ariaControls: parentDiv?.getAttribute("aria-controls"),
          selectField: firstSelectField,
          parentDiv: parentDiv,
        };
      })
      .filter((item) => item.title && item.timeRange && item.ariaControls);

    log(`找到 ${validData.length} 个有效图表:`, validData);
    return validData;
  }

  // 智能同步 - 根据用户选择同步其他图表
  async function startSmartSync(targetInterval) {
    if (syncState.isRunning) {
      showNotification("同步正在进行中...", "warning");
      return;
    }

    if (!isInTradingDataTab()) {
      showNotification("请先切换到【交易数据】标签页", "error");
      return;
    }

    syncState.isRunning = true;
    syncState.targetInterval = targetInterval;
    syncState.processedCharts.clear();

    // 获取所有图表数据
    syncState.chartsData = getAllChartsData();
    syncState.totalCharts = syncState.chartsData.length;

    if (syncState.totalCharts === 0) {
      showNotification("未找到可同步的图表", "error");
      syncState.isRunning = false;
      return;
    }

    showNotification(
      `开始同步 ${syncState.totalCharts} 个图表到 ${targetInterval}`,
      "info"
    );
    updateProgress(0, syncState.totalCharts);

    // 逐个同步图表
    for (let i = 0; i < syncState.chartsData.length; i++) {
      if (!syncState.isRunning) break;

      const chartData = syncState.chartsData[i];

      // 跳过已经是目标周期的图表
      if (chartData.timeRange === targetInterval) {
        log(`图表 "${chartData.title}" 已经是 ${targetInterval}，跳过`);
        syncState.processedCharts.add(chartData.ariaControls);
        updateProgress(syncState.processedCharts.size, syncState.totalCharts);
        continue;
      }

      log(`同步图表 ${i + 1}/${syncState.totalCharts}: ${chartData.title}`);

      try {
        await syncSingleChart(chartData, targetInterval);
        syncState.processedCharts.add(chartData.ariaControls);
        updateProgress(syncState.processedCharts.size, syncState.totalCharts);
      } catch (error) {
        log(`同步图表 "${chartData.title}" 失败:`, error);
      }

      // 延迟处理下一个
      if (i < syncState.chartsData.length - 1) {
        await delay(config.chartSwitchDelay);
      }
    }

    // 完成
    syncState.isRunning = false;
    const successCount = syncState.processedCharts.size;
    showNotification(
      `✅ 同步完成！成功同步 ${successCount}/${syncState.totalCharts} 个图表`,
      "success"
    );
    hideProgress();

    // 滚动回到第一个图表位置
    if (syncState.chartsData.length > 0) {
      syncState.chartsData[0].element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Auto-minimize after sync completion
    setTimeout(() => {
      minimizePanel();
    }, 2000); // Wait 2 seconds after notification before minimizing
  } // 同步单个图表
  async function syncSingleChart(chartData, targetInterval) {
    // 1. 滚动到视图并确保元素可见
    chartData.element.scrollIntoView({ behavior: "smooth", block: "center" });
    await delay(200); // 减少延迟

    // 2. 模拟鼠标移动到元素上方
    if (!chartData.parentDiv) {
      throw new Error("找不到选择器元素");
    }

    // 获取元素位置
    const rect = chartData.parentDiv.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 先触发 hover 效果 - 移除 view 参数
    const hoverEvent = new MouseEvent("mouseenter", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
    });
    chartData.parentDiv.dispatchEvent(hoverEvent);
    await delay(100); // 减少延迟

    // 触发 mouseover
    const moveEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
    });
    chartData.parentDiv.dispatchEvent(moveEvent);
    await delay(100); // 减少延迟

    // 3. 模拟鼠标按下和抬起
    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
    });
    chartData.parentDiv.dispatchEvent(mouseDownEvent);
    await delay(50); // 减少延迟

    const mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
    });
    chartData.parentDiv.dispatchEvent(mouseUpEvent);
    await delay(50); // 减少延迟

    // 4. 先尝试直接点击 selectField
    log(`尝试点击 "${chartData.title}" 的选择器`);
    chartData.selectField?.click();
    await delay(200); // 减少延迟

    // 如果直接点击不行，再尝试 parentDiv
    if (!(await checkDropdownAppeared(chartData.ariaControls, 500))) {
      log(`selectField 点击无效，尝试点击 parentDiv`);

      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY,
        button: 0,
      });
      chartData.parentDiv.dispatchEvent(clickEvent);
      await delay(300);
    }

    log(`等待 "${chartData.title}" 的下拉菜单 (${chartData.ariaControls})`);

    // 5. 查找对应的下拉菜单
    const dropdown = await waitForDropdown(chartData.ariaControls, 5000);
    if (!dropdown) {
      // 尝试通过其他方式查找下拉菜单
      const allDropdowns = document.querySelectorAll(
        ".bn-select-overlay-options"
      );
      log(`尝试查找所有下拉菜单，找到 ${allDropdowns.length} 个`);

      if (allDropdowns.length > 0) {
        // 使用最后一个（最新打开的）
        const lastDropdown = allDropdowns[allDropdowns.length - 1];
        log(`使用最后打开的下拉菜单`);

        const success = await selectInterval(lastDropdown, targetInterval);
        if (success) {
          log(`成功同步 "${chartData.title}" 到 ${targetInterval}`);
          return;
        }
      }

      throw new Error("下拉菜单未出现");
    }

    // 6. 选择目标时间周期
    const success = await selectInterval(dropdown, targetInterval);
    if (!success) {
      throw new Error("未找到目标时间周期选项");
    }

    log(`成功同步 "${chartData.title}" 到 ${targetInterval}`);
  }

  // 检查下拉菜单是否已出现（快速检查）
  async function checkDropdownAppeared(ariaControls, timeout = 500) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const dropdown = document.querySelector(`#${ariaControls}`);
      if (dropdown && dropdown.children.length > 0) {
        return true;
      }
      await delay(50);
    }

    return false;
  }
  // 等待特定的下拉菜单出现
  async function waitForDropdown(ariaControls, maxWait = 3000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const dropdown = document.querySelector(`#${ariaControls}`);
      if (dropdown && dropdown.children.length > 0) {
        log(`下拉菜单 ${ariaControls} 已出现`);
        return dropdown;
      }
      await delay(100);
    }

    log(`等待下拉菜单 ${ariaControls} 超时`);
    return null;
  }

  // 在下拉菜单中选择指定周期
  async function selectInterval(dropdown, targetInterval) {
    const options = dropdown.querySelectorAll('[role="option"]');

    for (const option of options) {
      const text = option.textContent.trim();
      if (text === targetInterval) {
        // 标记为程序点击，避免触发用户监听
        syncState.isRunning = true;
        option.click();
        log(`点击选项: ${text}`);
        await delay(200);
        return true;
      }
    }

    // 如果没找到，关闭下拉菜单
    document.body.click();
    return false;
  }

  // 延迟函数
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "trading-sync-panel";
    panel.style.left = config.panelPosition.x + "px";
    panel.style.top = config.panelPosition.y + "px";

    // 创建周期按钮
    const intervalButtons = supportedIntervals
      .map(
        (interval) => `
            <button class="interval-btn" data-interval="${interval.label}" title="同步到${interval.label}">
                ${interval.label}
            </button>
        `
      )
      .join("");

    panel.innerHTML = `
            <div class="panel-header">
                <span class="panel-title">📈 交易数据同步</span>
                <div class="panel-controls">
                    <button id="panel-minimize">_</button>
                    <button id="panel-close">✕</button>
                </div>
            </div>
            <div class="panel-body">
                <div class="tab-indicator ${
                  isInTradingDataTab() ? "active" : ""
                }">
                    ${
                      isInTradingDataTab()
                        ? "✅ 在【交易数据】标签页"
                        : "⚠️ 请切换到【交易数据】标签页"
                    }
                </div>
                <div class="panel-section">
                    <div class="section-title">快速同步到指定周期</div>
                    <div class="interval-grid">
                        ${intervalButtons}
                    </div>
                </div>
                <div id="chart-list" class="chart-list" style="display: none;">
                    <div class="section-title">检测到的图表</div>
                    <div class="chart-items"></div>
                </div>
                <div id="sync-progress" style="display: none;">
                    <div class="progress-text">同步中...</div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="panel-footer">
                    <button id="scan-charts">🔍 扫描图表</button>
                    <button id="stop-sync" style="display: none;">⏹ 停止</button>
                </div>
            </div>
        `;

    document.body.appendChild(panel);

    // 迷你按钮
    const miniBtn = document.createElement("div");
    miniBtn.id = "sync-mini-btn";
    miniBtn.innerHTML = "📈";
    miniBtn.title = "打开同步面板 (可拖动)";
    miniBtn.style.display = "none";
    document.body.appendChild(miniBtn);

    // 添加样式
    addStyles();

    // 绑定事件
    bindEvents(panel, miniBtn);

    // 使面板可拖动
    makeDraggable(panel, panel.querySelector(".panel-header"));

    // 使迷你按钮也可拖动
    makeDraggable(miniBtn, miniBtn);

    // 监听tab切换
    observeTabChanges();
  }

  // 添加样式
  function addStyles() {
    GM_addStyle(`
            #trading-sync-panel {
                position: fixed;
                z-index: 10000;
                background: linear-gradient(145deg, #1e2329 0%, #181a1e 100%);
                border: 1px solid rgba(14, 203, 129, 0.2);
                border-radius: 12px;
                width: 340px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7),
                           0 0 40px rgba(14, 203, 129, 0.1),
                           inset 0 0 20px rgba(14, 203, 129, 0.05);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                color: #e4e4e7;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            #trading-sync-panel:hover {
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8),
                           0 0 60px rgba(14, 203, 129, 0.15);
            }

            .panel-header {
                background: linear-gradient(135deg, rgba(14, 203, 129, 0.15) 0%, rgba(13, 181, 111, 0.15) 100%);
                padding: 14px 16px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid rgba(14, 203, 129, 0.1);
            }

            .panel-title {
                font-weight: 600;
                font-size: 15px;
                color: #0ecb81;
                text-shadow: 0 0 20px rgba(14, 203, 129, 0.5);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .panel-controls {
                display: flex;
                gap: 5px;
            }

            .panel-controls button {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #94a3b8;
                width: 26px;
                height: 26px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .panel-controls button:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                transform: scale(1.1);
            }

            #panel-close:hover {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border-color: #ef4444;
            }

            .panel-body {
                padding: 16px;
            }

            .tab-indicator {
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 16px;
                font-size: 13px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .tab-indicator.active {
                background: rgba(14, 203, 129, 0.1);
                border-color: rgba(14, 203, 129, 0.3);
                color: #0ecb81;
            }

            .panel-section {
                margin-bottom: 20px;
            }

            .section-title {
                font-size: 11px;
                color: #64748b;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 600;
            }

            .interval-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }

            .interval-btn {
                padding: 12px 8px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #94a3b8;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }

            .interval-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(14, 203, 129, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            .interval-btn:hover::before {
                width: 100px;
                height: 100px;
            }

            .interval-btn:hover {
                background: rgba(14, 203, 129, 0.1);
                border-color: #0ecb81;
                color: #0ecb81;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(14, 203, 129, 0.3);
            }

            .interval-btn:active {
                transform: translateY(0);
            }

            .auto-sync-status {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #474d57;
                border-radius: 24px;
                transition: 0.3s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: 0.3s;
            }

            input:checked + .slider {
                background: linear-gradient(135deg, #0ecb81, #0db56f);
            }

            input:checked + .slider:before {
                transform: translateX(24px);
            }

            .status-text {
                color: #94a3b8;
                font-size: 13px;
            }

            .chart-list {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 16px;
            }

            .chart-items {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .chart-item {
                padding: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                font-size: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .chart-item.synced {
                background: rgba(14, 203, 129, 0.1);
                border-color: rgba(14, 203, 129, 0.3);
            }

            .chart-name {
                color: #e4e4e7;
                flex: 1;
            }

            .chart-interval {
                color: #0ecb81;
                font-weight: 600;
                padding: 2px 8px;
                background: rgba(14, 203, 129, 0.1);
                border-radius: 4px;
            }

            #sync-progress {
                padding: 12px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .progress-text {
                font-size: 12px;
                color: #0ecb81;
                margin-bottom: 8px;
                text-align: center;
                font-weight: 500;
            }

            .progress-bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #0ecb81, #0db56f);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
                box-shadow: 0 0 20px rgba(14, 203, 129, 0.6);
                position: relative;
            }

            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 30px;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
                animation: shimmer 1s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-30px); }
                100% { transform: translateX(30px); }
            }

            .panel-footer {
                display: flex;
                gap: 10px;
            }

            .panel-footer button {
                flex: 1;
                padding: 11px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #94a3b8;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s;
            }

            .panel-footer button:hover {
                background: rgba(255, 255, 255, 0.06);
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            #stop-sync {
                background: rgba(239, 68, 68, 0.1) !important;
                border-color: rgba(239, 68, 68, 0.3) !important;
                color: #ef4444 !important;
            }

            #stop-sync:hover {
                background: rgba(239, 68, 68, 0.2) !important;
                box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
            }

            #sync-mini-btn {
                position: fixed;
                top: 100px;
                left: 20px;
                width: 52px;
                height: 52px;
                background: linear-gradient(135deg, #0ecb81, #0db56f);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                cursor: move;
                z-index: 9999;
                box-shadow: 0 6px 20px rgba(14, 203, 129, 0.4),
                           0 0 40px rgba(14, 203, 129, 0.2);
                transition: all 0.3s;
                user-select: none;
            }

            #sync-mini-btn:hover {
                transform: scale(1.15) rotate(10deg);
                box-shadow: 0 8px 30px rgba(14, 203, 129, 0.6),
                           0 0 60px rgba(14, 203, 129, 0.3);
            }

            .sync-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 14px 28px;
                border-radius: 10px;
                z-index: 10001;
                font-size: 14px;
                font-weight: 500;
                animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .sync-notification.success {
                background: linear-gradient(135deg, #0ecb81, #0db56f);
                color: white;
            }

            .sync-notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }

            .sync-notification.warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }

            .sync-notification.info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }

            @keyframes slideDown {
                from {
                    transform: translate(-50%, -120%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
        `);
  }

  // 绑定事件
  function bindEvents(panel, miniBtn) {
    // 周期按钮点击
    panel.querySelectorAll(".interval-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const interval = btn.dataset.interval;
        startSmartSync(interval);
      });
    });

    // 扫描图表
    document.getElementById("scan-charts").addEventListener("click", () => {
      const charts = getAllChartsData();
      const chartList = document.getElementById("chart-list");
      const chartItems = chartList.querySelector(".chart-items");

      if (charts.length > 0) {
        chartItems.innerHTML = charts
          .map(
            (chart) => `
                  <div class="chart-item">
                      <span class="chart-name">${chart.title}</span>
                      <span class="chart-interval">${chart.timeRange}</span>
                  </div>
              `
          )
          .join("");
        chartList.style.display = "block";
        showNotification(`找到 ${charts.length} 个图表`, "info");
      } else {
        showNotification("未找到图表,请确认在【交易数据】标签页", "warning");
      }
    });

    // 停止同步
    document.getElementById("stop-sync").addEventListener("click", () => {
      syncState.isRunning = false;
      showNotification("同步已停止", "warning");
      hideProgress();
    });

    // 最小化按钮
    document.getElementById("panel-minimize").addEventListener("click", () => {
      minimizePanel();
    });

    // 关闭按钮 - 完全关闭
    document.getElementById("panel-close").addEventListener("click", () => {
      closePanel();
    });

    // 迷你按钮的点击事件已在 makeDraggable 中处理
  }

  // 监听tab切换
  function observeTabChanges() {
    const observer = new MutationObserver(() => {
      updateTabIndicator();
      // 根据tab状态自动切换面板显示
      autoTogglePanelDisplay();
    });

    const tabElement = document.querySelector("#bn-tab-2");
    if (tabElement) {
      observer.observe(tabElement, {
        attributes: true,
        attributeFilter: ["aria-selected"],
      });
    }
  }

  // 自动切换面板显示状态
  function autoTogglePanelDisplay() {
    const panel = document.getElementById("trading-sync-panel");
    const miniBtn = document.getElementById("sync-mini-btn");

    if (!panel || !miniBtn) return;

    const isInTab = isInTradingDataTab();

    if (isInTab) {
      // 在交易数据标签页,显示迷你按钮(让用户可以点击展开)
      // 检查面板当前是否显示,如果隐藏则显示迷你按钮
      if (panel.style.display === "none") {
        miniBtn.style.display = "flex";
      }
    } else {
      // 不在交易数据标签页,完全隐藏面板和迷你按钮
      panel.style.display = "none";
      miniBtn.style.display = "none";
    }
  }

  // 更新tab指示器
  function updateTabIndicator() {
    const indicator = document.querySelector(".tab-indicator");
    if (indicator) {
      const isActive = isInTradingDataTab();
      indicator.className = `tab-indicator ${isActive ? "active" : ""}`;
      indicator.textContent = isActive
        ? "✅ 在【交易数据】标签页"
        : "⚠️ 请切换到【交易数据】标签页";
    }
  }

  // 显示通知
  function showNotification(message, type = "info") {
    // 移除旧通知
    document.querySelectorAll(".sync-notification").forEach((n) => n.remove());

    const notification = document.createElement("div");
    notification.className = `sync-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideUp 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // 更新进度
  function updateProgress(current, total) {
    const progress = document.getElementById("sync-progress");
    const progressText = progress.querySelector(".progress-text");
    const progressFill = progress.querySelector(".progress-fill");
    const stopBtn = document.getElementById("stop-sync");

    progress.style.display = "block";
    stopBtn.style.display = "block";

    const percentage = total > 0 ? (current / total) * 100 : 0;
    progressText.textContent = `同步中... ${current}/${total}`;
    progressFill.style.width = percentage + "%";
  }

  // 隐藏进度
  function hideProgress() {
    const progress = document.getElementById("sync-progress");
    const stopBtn = document.getElementById("stop-sync");

    if (progress) {
      setTimeout(() => {
        progress.style.display = "none";
        progress.querySelector(".progress-fill").style.width = "0%";
      }, 1000);
    }

    if (stopBtn) {
      stopBtn.style.display = "none";
    }
  }

  // 使元素可拖动
  function makeDraggable(element, handle) {
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener("mousedown", (e) => {
      // 如果是面板,排除控制按钮区域
      if (
        element.id === "trading-sync-panel" &&
        e.target.closest(".panel-controls")
      ) {
        return;
      }

      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;

      // 阻止默认行为,避免选中文本
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // 如果移动超过5像素,认为是拖动而不是点击
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
      }

      element.style.left =
        Math.max(
          0,
          Math.min(window.innerWidth - element.offsetWidth, startLeft + deltaX)
        ) + "px";
      element.style.top =
        Math.max(
          0,
          Math.min(window.innerHeight - element.offsetHeight, startTop + deltaY)
        ) + "px";
    });

    document.addEventListener("mouseup", (e) => {
      if (isDragging) {
        isDragging = false;

        // 只有在拖动后才保存位置
        if (hasMoved) {
          config.panelPosition = {
            x: element.offsetLeft,
            y: element.offsetTop,
          };
          GM_setValue("panelPosition", config.panelPosition);
        } else {
          // 如果没有移动,触发点击事件(仅对迷你按钮)
          if (element.id === "sync-mini-btn") {
            if (isInTradingDataTab()) {
              const panel = document.getElementById("trading-sync-panel");
              panel.style.display = "block";
              element.style.display = "none";
              updateTabIndicator();
            } else {
              showNotification("请先切换到【交易数据】标签页", "warning");
            }
          }
        }
      }
    });
  }

  // 初始化
  function init() {
    log("交易数据同步器初始化...");

    setTimeout(() => {
      createControlPanel();

      // 初始状态根据当前tab决定
      autoTogglePanelDisplay();

      // 快捷键 - 支持 Mac 和 Windows/Linux
      document.addEventListener("keydown", (e) => {
        // Mac: Option+S, Windows/Linux: Alt+S
        if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          const panel = document.getElementById("trading-sync-panel");
          const miniBtn = document.getElementById("sync-mini-btn");

          // 只有在交易数据标签页才响应快捷键
          if (!isInTradingDataTab()) {
            showNotification("请先切换到【交易数据】标签页", "warning");
            return;
          }

          // 如果面板和迷你按钮都隐藏了(已关闭),则重新打开面板
          if (
            panel.style.display === "none" &&
            miniBtn.style.display === "none"
          ) {
            panel.style.display = "block";
            miniBtn.style.display = "none";
            updateTabIndicator();
            showNotification("面板已打开", "info");
          }
          // 如果面板显示,则最小化
          else if (panel.style.display !== "none") {
            panel.style.display = "none";
            miniBtn.style.display = "flex";
          }
          // 如果迷你按钮显示,则展开面板
          else {
            panel.style.display = "block";
            miniBtn.style.display = "none";
            updateTabIndicator();
          }
        }
      });

      log("初始化完成");
      console.log(
        "%c[交易数据同步] 已加载，快捷键: Option+S (Mac) / Alt+S (Win/Linux) 切换面板",
        "background: linear-gradient(135deg, #0ecb81, #0db56f); color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;"
      );
    }, 2000);
  }

  // 启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 在 minimizePanel 函数之后添加 closePanel 函数
  function minimizePanel() {
    const panel = document.getElementById("trading-sync-panel");
    const miniBtn = document.getElementById("sync-mini-btn");

    if (panel && miniBtn) {
      panel.style.display = "none";
      miniBtn.style.display = "flex";
      log("面板已最小化");
    }
  }

  // 新增关闭面板函数
  function closePanel() {
    const panel = document.getElementById("trading-sync-panel");
    const miniBtn = document.getElementById("sync-mini-btn");

    if (panel && miniBtn) {
      panel.style.display = "none";
      miniBtn.style.display = "none";
      log("面板已关闭");
      showNotification(
        "面板已关闭，按 Option+S (Mac) 或 Alt+S 重新打开",
        "info"
      );
    }
  }
})();
