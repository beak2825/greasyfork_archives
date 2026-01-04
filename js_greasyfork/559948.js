// ==UserScript==
// @name         CP-首充统计
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  首充脚本界面显示
// @author       Cisco
// @match        https://7777m.topcms.org/*
// @match        https://111bet22.topcms.org/*
// @match        https://888bet.topcms.org/*
// @match        https://hkgame.topcms.org/*
// @match        https://666bet.topcms.org/*
// @match        https://111bet.topcms.org/*
// @match        https://k9.topcms.org/*
// @match        https://34jogo.topcms.org/*
// @match        https://q6q6.topcms.org/*
// @icon         https://7777m.topcms.org/favicon.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559948/CP-%E9%A6%96%E5%85%85%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/559948/CP-%E9%A6%96%E5%85%85%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
  
    const NS = "chargeStats"; // 唯一前缀，多个脚本用不同的值即可
    const gmGet = (k, def) => GM_getValue(`${NS}_${k}`, def);
    const gmSet = (k, v) => GM_setValue(`${NS}_${k}`, v);

    // 配置参数
    const rawConfigCp = {
        currentPage: 1, // 当前页码
        totalPages: 1, // 总页数
        pageSize: 200, // 每页订单数量
        isLastPage: false, // 是否是最后一页
        minSameIPUsers: 2, // 最大相同IP用户数
        minTotalRecharge: 10, // 总充值金额 >=
        maxTotalRecharge: 100, // 总充值金额 <=
        rechargeToProfitRatio: 10, // 总充值金额 > 游戏盈亏指定倍数
        password: "", // 充值密码
        processedOrders: gmGet("processedOrders", {}), // 已处理订单记录
        payOutOrders: gmGet("payOutOrders", {}), // 已出款订单记录
        cancelledOrders: gmGet("cancelledOrders", {}), // 已取消出款订单记录
        currentOrderId: null, // 当前处理的订单ID
        isProcessing: false, // 是否正在处理中
        isReturning: false, // 是否正在返回订单页面
        panelCollapsed: false, // 面板是否收起
        completedOneRound: false, // 是否完成了一轮处理
        processingOrderId: null, // 正在处理的订单ID
        totalBetAmount: 0, // 当前订单的总投注额
        profitAmount: 0, // 当前订单的游戏盈亏
        startedProcessing: false,   // 新的一轮处理
    };
  
    // 使用 Proxy 监听 config 变化
    const config = new Proxy(rawConfigCp, {
      set(target, prop, value) {
        target[prop] = value;
        if (prop === "currentOrderId") {
          const el = document.getElementById(`${NS}_currentOrderId`);
          if (el) el.textContent = value || "";
        }
        return true;
      }
    });
  
    // 控制面板样式
    GM_addStyle(`
        .${NS}-monitor-panel {
            position: fixed;
            top: 20px;
            right: 200px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
            transition: all 0.3s ease;
        }
        .${NS}-monitor-panel.${NS}_collapsed {
            width: 40px;
            height: 40px;
            overflow: hidden;
            padding: 5px;
        }
        .${NS}-toggle-panel {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            border: none;
            background: #f0f0f0;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            z-index: 10000;
        }
        .${NS}-toggle-panel:hover {
            background: #e0e0e0;
        }
        .${NS}_collapsed .${NS}-panel-content {
            display: none;
        }
        .monitor-header {
            margin: 0 0 15px 0;
            color: #409EFF;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        /* 优化统计字段样式 */
        .${NS}-stat-container {
            background: #fafafa;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 12px;
            margin-bottom: 15px;
        }
        
        .${NS}-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 6px 8px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #409EFF;
            transition: all 0.2s ease;
        }
        
        .${NS}-stat-row:hover {
            background: #f5f7fa;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .${NS}-stat-row:nth-child(2) {
            border-left-color: #67C23A;
        }
        
        .${NS}-stat-row:nth-child(3) {
            border-left-color: #E6A23C;
        }
        
        .${NS}-stat-row:nth-child(4) {
            border-left-color: #909399;
        }
        
        .${NS}-stat-row:nth-child(5) {
            border-left-color: #F56C6C;
        }
        
        .${NS}-stat-row:nth-child(6) {
            border-left-color: #9b59b6;
        }
        
        .${NS}-stat-row span {
            font-size: 13px;
            color: #606266;
        }
        
        .${NS}-stat-row span.value {
            font-weight: bold;
            color: #303133;
            background: #f0f2f5;
            padding: 3px 8px;
            border-radius: 3px;
            min-width: 50px;
            text-align: center;
        }
        
        .button-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        .${NS}-monitor-button {
            width: 100%;
            padding: 10px;
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
            margin-bottom: 10px;
        }
        .${NS}-monitor-button:disabled {
            background: #C0C4CC;
            cursor: not-allowed;
        }
        .${NS}-monitor-button.stop {
            background: #F56C6C;
        }
        .monitor-stats {
            margin-top: 15px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .monitor-stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .monitor-progress-container {
            margin: 10px 0;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        .monitor-progress-bar {
            height: 100%;
            background: linear-gradient(to right, #67C23A, #409EFF);
            transition: width 0.3s;
        }
        #${NS}_statusText {
            font-weight: bold;
            color: #409EFF;
        }
        #${NS}_processedCount {
            font-weight: bold;
            color: #67C23A;
        }
        .${NS}-monitor-button.hidden {
            display: none;
        }
        
        /* 清理缓存按钮样式 */
        .${NS}-monitor-button.clear {
            background: #909399;
            margin-top: 5px;
        }
        
        .${NS}-monitor-button.clear:hover {
            background: #82848a;
        }
        `);
  
    // ==================== 工具函数 ====================
  
    /**
     * 延迟执行
     * @param {number} ms 毫秒数
     * @returns {Promise<void>}
     */
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    /**
     * 等待指定元素出现（可选检测其文本内容），超时返回 null 而不是抛异常
     * @param {string} selector - CSS 选择器
     * @param {number} [timeout=10000] - 等待的最长时间（毫秒）
     * @param {ParentNode} [parent=document] - 查找的父容器（默认 document）
     * @param {AbortSignal|null} [signal=null] - 可选的 AbortSignal，用于提前中断等待
     * @param {Object} [options={}] - 额外选项
     * @param {boolean} [options.requireText=false] - 是否要求元素有非空文本才算找到
     * @returns {Promise<Element|null>} - 找到则返回元素，没找到或超时返回 null
     */
    function waitForElement(
        selector,
        timeout = 10000,
        parent = document,
        signal = null,
        options = {}
    ) {
        // 如果 parent 为 null，则兜底使用 document
        if (!parent) parent = document;

        // 解析选项
        const { requireText = false } = options;

        return new Promise(resolve => {
            // 如果调用时就已经中断，直接返回 null
            if (signal?.aborted) return resolve(null);

            // 计算超时时间点
            const endTime = Date.now() + timeout;

            // 定时检测函数
            const check = () => {
                // 如果外部中断，直接返回 null
                if (signal?.aborted) return resolve(null);

                // 查找元素
                const element = parent.querySelector(selector);

                if (element) {
                    // 如果要求有文本内容，但当前元素文本为空，继续等待
                    if (requireText && !element.textContent.trim()) {
                        if (Date.now() < endTime) {
                            setTimeout(check, 200); // 每 200ms 再检测一次
                            return;
                        }
                        // 超时依然没内容
                        return resolve(null);
                    }

                    // 找到符合条件的元素
                    return resolve(element);
                }

                // 元素还没出现，检查是否超时
                if (Date.now() >= endTime) {
                    return resolve(null); // 超时返回 null
                }

                // 继续等待
                setTimeout(check, 200);
            };

            check(); // 启动首次检测
        });
    }

  
    /**
     * 等待页面跳转完成
     * @param {string} targetHash 目标页面hash
     * @param {number} timeout 超时时间(ms)
     * @returns {Promise<void>}
     */
    function waitForPageChange(targetHash, timeout = 10000) {
      return new Promise((resolve, reject) => {
        if (window.location.hash.includes(targetHash)) {
          return resolve();
        }
  
        const timer = setTimeout(() => {
          window.removeEventListener('hashchange', handler);
          reject(new Error(`Timeout waiting for page change to ${targetHash}`));
        }, timeout);
  
        const handler = () => {
          if (window.location.hash.includes(targetHash)) {
            clearTimeout(timer);
            window.removeEventListener('hashchange', handler);
            resolve();
          }
        };
  
        window.addEventListener('hashchange', handler);
      });
    }
  
    /**
     * 带重试的操作
     * @param {Function} operation 操作函数
     * @param {number} retries 重试次数
     * @param {number} delayMs 重试间隔(ms)
     * @param {AbortSignal} signal 取消信号
     * @returns {Promise<any>}
     */
    async function retryOperation(operation, retries = 3, delayMs = 1000, signal = null) {
      let lastError;
      for (let i = 0; i < retries; i++) {
        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        try {
          return await operation();
        } catch (err) {
          lastError = err;
          if (i < retries - 1) await delay(delayMs);
        }
      }
      throw lastError;
    }
  
    /**
     * 检查是否在平台概况页面
     * @returns {boolean}
     */
    function isDashboardPage() {
      return window.location.hash.includes("#/dashboard");
    }
    /**
     * 检查是否在订单页面
     * @returns {boolean}
     */
    function isOrderPage() {
      return window.location.hash.includes("#/order/unread-withdraw");
    }
  
    /**
     * 检查是否在代理页面
     * @returns {boolean}
     */
    function isAgentPage() {
      return window.location.hash.includes("#/agent/agent-list");
    }
  
    /**
     * 检查是否在提现记录页面
     * @returns {boolean}
     */
    function isWithdrawPage() {
      return window.location.hash.includes("#/order/order-withdraw");
    }
  
    /**
     * 检查是否在充值记录页面
     * @returns {boolean}
     */
    function isTopupPage() {
      return window.location.hash.includes("#/order/order-topup");
    }
  
    /**
     * 更新状态显示
     * @param {string} text 状态文本
     */
    function updateStatus(text) {
      const statusEl = document.getElementById(`${NS}_statusText`);
      if (statusEl) {
        statusEl.textContent = text;
      }
    }
  
    /**
     * 更新按钮显示状态
     */
    function updateButtonVisibility() {
      const startBtn = document.getElementById(`${NS}_startBtn`);
      const stopBtn = document.getElementById(`${NS}_stopBtn`);
  
      if (config.isProcessing) {
        startBtn?.classList.add("hidden");
        stopBtn?.classList.remove("hidden");
      } else {
        startBtn?.classList.remove("hidden");
        stopBtn?.classList.add("hidden");
      }
    }
  
    /**
     * 添加控制面板
     */
    function addControlPanel() {
        const panel = document.createElement("div");
        panel.className = `${NS}-monitor-panel`;
        panel.id = `${NS}_autoWithdrawPanel`;

        // 添加收起/展开按钮
        const toggleBtn = document.createElement("button");
        toggleBtn.className = `${NS}-toggle-panel`;
        toggleBtn.innerHTML = "×";
        toggleBtn.title = "收起/展开控制面板";
        toggleBtn.addEventListener("click", togglePanel);

        // 面板内容
        const panelContent = document.createElement("div");
        panelContent.className = `${NS}-panel-content`;
        panelContent.innerHTML = `
          <h3 class="monitor-header">📊 实时统计</h3>
          
          <div class="stats-container">
              <div style="margin: 10px 0; padding: 5px; background: #f5f7fa; border-left: 3px solid #409EFF; font-size: 16px; color: #606266;">
                  🎯 首充统计
              </div>
              <div class="${NS}-stat-row"><span>首充CP出款比例</span><span class="value" id="${NS}_cpRatioFirst">0%</span></div>
              <div class="${NS}-stat-row"><span>首充充提差</span><span class="value" id="${NS}_diffRatioFirst">0%</span></div>
              <div class="${NS}-stat-row"><span>今日首充总金额</span><span class="value" id="${NS}_rechargeAmount">0</span></div>
              <div class="${NS}-stat-row"><span>今日首充人数</span><span class="value" id="${NS}_rechargeUsers">0</span></div>
              <div class="${NS}-stat-row"><span>今日首提现总金额</span><span class="value" id="${NS}_withdrawAmount">0</span></div>
              <div class="${NS}-stat-row"><span>今日首提现人数</span><span class="value" id="${NS}_withdrawUsers">0</span></div>
              
              <div style="margin: 10px 0; padding: 5px; background: #f5f7fa; border-left: 3px solid #E6A23C; font-size: 16px; color: #606266;">
                  🔄 复充统计
              </div>
              <div class="${NS}-stat-row"><span>复充CP出款比例</span><span class="value" id="${NS}_cpRatioRepeat">0%</span></div>
              <div class="${NS}-stat-row"><span>复充充提差</span><span class="value" id="${NS}_diffRatioRepeat">0%</span></div>
              <div class="${NS}-stat-row"><span>今日复充总金额</span><span class="value" id="${NS}_rechargeAmountRepeat">0</span></div>
              <div class="${NS}-stat-row"><span>今日复充人数</span><span class="value" id="${NS}_rechargeUsersRepeat">0</span></div>
              <div class="${NS}-stat-row"><span>今日复提现总金额</span><span class="value" id="${NS}_withdrawAmountRepeat">0</span></div>
              <div class="${NS}-stat-row"><span>今日复提现人数</span><span class="value" id="${NS}_withdrawUsersRepeat">0</span></div>
          </div>
          
          <div class="button-container">
              <button id="${NS}_startBtn" class="${NS}-monitor-button ${config.isProcessing ? "hidden" : ""}">开始统计</button>
              <button id="${NS}_stopBtn" class="${NS}-monitor-button stop ${!config.isProcessing ? "hidden" : ""}">停止统计</button>
          </div>

          <div class="monitor-stats">
              <div class="monitor-stat-row">
                  <span>📶 状态:</span>
                  <span id="${NS}_statusText">待命</span>
              </div>
              <div class="progress-container">
                  <div class="progress-bar" style="width: 0%"></div>
              </div>
          </div>
      `;

        panel.appendChild(toggleBtn);
        panel.appendChild(panelContent);
        document.body.appendChild(panel);

        // 恢复面板状态
        config.panelCollapsed = gmGet("panelCollapsed", false);
        if (config.panelCollapsed) {
            panel.classList.add(`${NS}_collapsed`);
            toggleBtn.innerHTML = "≡";
        }

        // 事件监听
        document.getElementById(`${NS}_startBtn`).addEventListener("click", function () {
            processor.start();
        });

        document.getElementById(`${NS}_stopBtn`).addEventListener("click", function () {
            processor.stop();
        });

        }
  
    /**
     * 收起/展开面板
     */
    function togglePanel() {
      const panel = document.getElementById(`${NS}_autoWithdrawPanel`);
      config.panelCollapsed = !panel.classList.contains(`${NS}_collapsed`);
  
      if (config.panelCollapsed) {
        panel.classList.add(`${NS}_collapsed`);
        this.innerHTML = "≡";
      } else {
        panel.classList.remove(`${NS}_collapsed`);
        this.innerHTML = "×";
      }
  
      gmSet("panelCollapsed", config.panelCollapsed);
    }

    /**
     * 格式化数字，添加千分位分隔符
     */
    function formatNumber(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * 更新控制面板中的相关数据
     * @param {number} rechargeAmount 今日充值总额
     * @param {number} withdrawAmount 今日提现总额
     */
    function updateControlPanelStats(
        // 首充相关
        cpRatioFirst, diffRatioFirst,
        firstRechargeAmount, firstRechargeUsers,
        firstWithdrawAmount, firstWithdrawUsers,
        // 复充相关
        cpRatioRepeat, diffRatioRepeat,
        repeatRechargeAmount, repeatRechargeUsers,
        repeatWithdrawAmount, repeatWithdrawUsers
    ) {
        // 首充相关
        const cpRatioFirstEl = document.getElementById(`${NS}_cpRatioFirst`);
        const diffRatioFirstEl = document.getElementById(`${NS}_diffRatioFirst`);
        const rechargeEl = document.getElementById(`${NS}_rechargeAmount`);
        const rechargeUsersEl = document.getElementById(`${NS}_rechargeUsers`);
        const withdrawEl = document.getElementById(`${NS}_withdrawAmount`);
        const withdrawUsersEl = document.getElementById(`${NS}_withdrawUsers`);
        
        // 复充相关
        const cpRatioRepeatEl = document.getElementById(`${NS}_cpRatioRepeat`);
        const diffRatioRepeatEl = document.getElementById(`${NS}_diffRatioRepeat`);
        const rechargeRepeatEl = document.getElementById(`${NS}_rechargeAmountRepeat`);
        const rechargeUsersRepeatEl = document.getElementById(`${NS}_rechargeUsersRepeat`);
        const withdrawRepeatEl = document.getElementById(`${NS}_withdrawAmountRepeat`);
        const withdrawUsersRepeatEl = document.getElementById(`${NS}_withdrawUsersRepeat`);

        // 更新首充数据
        if (cpRatioFirstEl) cpRatioFirstEl.textContent = cpRatioFirst.toFixed(5) + "%";
        if (diffRatioFirstEl) diffRatioFirstEl.textContent = diffRatioFirst.toFixed(5) + "%";
        if (rechargeEl) rechargeEl.textContent = formatNumber(firstRechargeAmount);
        if (rechargeUsersEl) rechargeUsersEl.textContent = firstRechargeUsers;
        if (withdrawEl) withdrawEl.textContent = formatNumber(firstWithdrawAmount);
        if (withdrawUsersEl) withdrawUsersEl.textContent = firstWithdrawUsers;
        
        // 更新复充数据
        if (cpRatioRepeatEl) cpRatioRepeatEl.textContent = cpRatioRepeat.toFixed(5) + "%";
        if (diffRatioRepeatEl) diffRatioRepeatEl.textContent = diffRatioRepeat.toFixed(5) + "%";
        if (rechargeRepeatEl) rechargeRepeatEl.textContent = formatNumber(repeatRechargeAmount);
        if (rechargeUsersRepeatEl) rechargeUsersRepeatEl.textContent = repeatRechargeUsers;
        if (withdrawRepeatEl) withdrawRepeatEl.textContent = formatNumber(repeatWithdrawAmount);
        if (withdrawUsersRepeatEl) withdrawUsersRepeatEl.textContent = repeatWithdrawUsers;
    }

    // ==================== 主流程控制器 ====================
    class OrderProcessor {
      constructor(config) {
        this.config = config;
        this.abortController = new AbortController();
        this.currentTask = null;
      }
  
      /**
       * 开始处理流程
       */
      async start() {
        if (this.currentTask) return;
        this.config.startedProcessing = true; // 开始新的轮次
        this.config.isProcessing = true;
        updateButtonVisibility();
        updateStatus("开始统计...");
  
        this.currentTask = this.runProcessingLoop()
          .catch(err => {
            console.error('Processing error:', err);
            updateStatus(`处理出错: ${err.message}`);
          })
          .finally(() => {
            this.currentTask = null;
            updateButtonVisibility();
          });
      }
  
      /**
       * 停止处理流程
       */
      stop() {
        if (!this.config.isProcessing) return;
        this.abortController.abort(); // 中止当前任务
        this.config.isProcessing = false;
        this.closeAllDialogs(this.abortController.signal); // 先执行需要旧 signal 的方法
        this.abortController = new AbortController(); // 再重置
        updateStatus("正在停止...");
    }
  
    /**
     * 返回到提现订单页面
     * @param {AbortSignal} signal 取消信号
     */
    async goBackToWithdrawOrderPage(signal) {
        updateStatus("返回提现订单页面...");
        // 跳转到提现订单页面
        await this.navigateTo("#/order/order-withdraw", signal);
        // 等待查询结果
        await delay(1500);
    }

      /**
       * 主处理循环
       */
      async runProcessingLoop() {
        const { signal } = this.abortController;
  
        while (this.config.isProcessing && !signal.aborted) {
          try {
            if (isWithdrawPage()) {
                console.log('当前在提现订单页面');
                await this.processOrderPage(signal);
            } else {
                console.log('不在目标页面，跳转到提现订单页面');
                await this.goBackToWithdrawOrderPage();
            }
          } catch (err) {
            if (err.name === 'AbortError') break;
            console.error('Loop error:', err);
            await delay(3000);
          }
        }
      }
  
      /**
       * 处理提现订单页面
       * @param {AbortSignal} signal 取消信号
       */
      async processOrderPage(signal) {
        if (signal.aborted) return;
        if (!isWithdrawPage()) {
            // 如果当前不是提现订单页面就跳转过来
            await this.goBackToWithdrawOrderPage(signal);
        }
        this.closeAllDialogs(signal);
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
            console.log('暂无数据');
            // 无数据隔10秒重开
            await delay(10000);
            await this.startNewRound(signal);
            return;
        }
        // 1. 确保页面完全加载
        const el = await waitForElement('.el-table--scrollable-x .el-table__body .el-table__row .cell > span', 10000, null, signal, { requireText: true });
        if (!el) {
            console.warn('没找到元素或超时');
            await this.processOrderPage(signal);
            return;
        }
        
        // 2. 计算实际充提差比率（使用新的严格区分方法）
        updateStatus("开始统计充提差...");
        const {
            // 首充相关
            cpRatioFirst,
            diffRatioFirst,
            firstRechargeAmount,
            firstRechargeUsers,
            firstWithdrawAmount,
            firstWithdrawUsers,
            // 复充相关
            cpRatioRepeat,
            diffRatioRepeat,
            repeatRechargeAmount,
            repeatRechargeUsers,
            repeatWithdrawAmount,
            repeatWithdrawUsers
        } = await this.getActualDiffRatio(signal);
        
        // 3. 更新面板显示
        updateStatus("更新面板数据...");
        updateControlPanelStats(
            // 首充相关
            cpRatioFirst, 
            diffRatioFirst,
            firstRechargeAmount, 
            firstRechargeUsers,
            firstWithdrawAmount, 
            firstWithdrawUsers,
            // 复充相关
            cpRatioRepeat, 
            diffRatioRepeat,
            repeatRechargeAmount, 
            repeatRechargeUsers,
            repeatWithdrawAmount, 
            repeatWithdrawUsers
        );
        // 4. 隔10秒重开
        await delay(10000);
      }
        /**
         * 获取当日首提现金额 / 人数
         */
        async getTodayFirstCharge(signal) {
            this.closeAllDialogs(signal);
            if (signal.aborted) return;
            // 跳转到平台概况页面
            if (!isDashboardPage()) {
                // 如果当前不是平台概况页面就跳转过来
                await this.navigateTo("#/dashboard", signal);
            }

            try {
                // 1. 确保页面完全加载
                await waitForElement('.el-table__body', 10000, null, signal);
                
                // 2. 等待页面加载
                await delay(3000);
                
                // 7. 获取当日总充值记录和人数
                const firstRechargeAmount = await this.getTodayChargeAmount(signal);
                const firstRechargeUsers = await this.getTodayChargePeople(signal);
                const totalTopupOrderAmount = await this.getTodayChargeOrderAmount(signal);
                const totalTopupOrderPeople = await this.getTodayChargeOrderPeople(signal);
                const repeatRechargeAmount = totalTopupOrderAmount - firstRechargeAmount;
                const repeatRechargeUsers = totalTopupOrderPeople - firstRechargeUsers;
                return {firstRechargeAmount, firstRechargeUsers, repeatRechargeAmount, repeatRechargeUsers};
            } catch (err) {
                console.error('处理充值页面出错:', err);
                markOrderAsProcessed(this.config.currentOrderId, `充值记录检查失败: ${err.message}`);
                await this.navigateToOrderPage();
                throw err;
            }
        }

        /**
         * 获取今日充值总额
         * @param {AbortSignal} signal 取消信号
         */
        async getTodayRecharge(signal) {
            this.closeAllDialogs(signal);
            if (signal.aborted) return;
            // 跳转到充值记录页面
            if (!isTopupPage()) {
                // 如果当前不是充值订单页面就跳转过来
                await this.navigateTo("#/order/order-topup", signal);
            }
            
            try {
                // 1. 确保页面完全加载
                await waitForElement('.el-table__body', 10000, null, signal);
                
                // 4. 设置订单状态为"已支付"
                await this.selectDropdownOption("全部状态", "已支付", signal);
                
                // 5. 点击查询按钮
                const queryBtn = await this.findQueryButton(signal);
                queryBtn.click();
                
                // 6. 等待查询结果
                await delay(3000);
                
                // 7. 获取当日总充值记录和人数
                const totalTopupAmount = await this.getTodayRechargeTotalAmount(signal);
                const totalTopupPeople = await this.getTodayRechargeTotalPeople(signal);
                return {totalTopupAmount, totalTopupPeople};
            } catch (err) {
                console.error('处理充值页面出错:', err);
                markOrderAsProcessed(this.config.currentOrderId, `充值记录检查失败: ${err.message}`);
                await this.navigateToOrderPage();
                throw err;
            }
        }
        
        /**
         * 调整充值记录查询日期范围（最近7天）
         */
        async adjustTopupDateRange(signal) {
            const dateInputs = await waitForElement(
            ".el-range-input",
            5000,
            null,
            signal
            );
            
            if (!dateInputs || dateInputs.length < 2) {
            throw new Error("找不到日期范围输入框");
            }
        
            const now = new Date();
            const endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            endDate.setHours(endDate.getHours() - 8); // 转为GMT+0
            
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 6); // 7天范围
            startDate.setHours(0, 0, 0, 0);
        
            const formatDate = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            };
        
            const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
            ).set;
            
            setter.call(dateInputs[0], formatDate(startDate));
            dateInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
            
            setter.call(dateInputs[1], formatDate(endDate));
            dateInputs[1].dispatchEvent(new Event("input", { bubbles: true }));
        }
        
        /**
         * 获取当天首充值总人数
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值总人数
         */
        async getTodayChargePeople(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 5 列（索引4）为总充值金额
            const amountCell = cells[4]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);
        }
        /**
         * 获取当天充值人数
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值人数
         */
        async getTodayChargeOrderPeople(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 6 列（索引5）为总充值金额
            const amountCell = cells[5]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);
        }

        /**
         * 获取当天已支付的充值总人数
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值总人数
         */
        async getTodayRechargeTotalPeople(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 5 列（索引4）为总充值金额
            const amountCell = cells[2]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);

        }

        /**
         * 获取当天的首充总金额
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值总金额
         */
        async getTodayChargeAmount(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 7 列（索引6）为总充值金额
            const amountCell = cells[6]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);
        }
        /**
         * 获取当天的订单金额
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值总金额
         */
        async getTodayChargeOrderAmount(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 11 列（索引10）为总充值金额
            const amountCell = cells[10]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);
        }

        /**
         * 获取当天已支付的充值总金额
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<number>} 当天充值总金额
         */
        async getTodayRechargeTotalAmount(signal) {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length <= 1) return 0; // 没有数据

            const cells = rows[0].querySelectorAll("td");
            // 统计行固定位置第 5 列（索引4）为总充值金额
            const amountCell = cells[4]?.querySelector(".cell");
            if (!amountCell) return 0;
            const amountText = amountCell.textContent.trim();
            if (!amountText) return 0;
            
            // 数值解析函数
            const parseValue = (text) => {
                // 移除所有非数字字符（保留小数点和负号）
                const numStr = text.replace(/[^\d.-]/g, "");
                return parseFloat(numStr) || 0;
            };

            return parseValue(amountText);

        }

      /**
         * 查找查询按钮（带重试机制）
         */
        async findQueryButton(signal) {
            return await retryOperation(
            async () => {
                const buttons = document.querySelectorAll('.filter-container button.el-button');
                const btn = Array.from(buttons).find(b => 
                b.textContent.includes('查询') || 
                (b.querySelector('span')?.textContent.includes('查询'))
                );
                
                if (!btn) throw new Error('找不到查询按钮');
                if (btn.disabled) throw new Error('查询按钮不可用');
                return btn;
            },
            3, // 重试3次
            1000, // 间隔1秒
            signal
            );
        }
  
      /**
       * 获取实际充提差比率
       * @description   实际充提差比率 = (实际充提差 / 实际充值金额) * 100%
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async getActualDiffRatio(signal) {
        this.closeAllDialogs(signal);
        // 1. 获取当前页订单行
        updateStatus(`开始统计充提差`);
        // 2. 获取当天提现差
        const {
            firstTotalAmount, firstTotalPeople, firstCoinPayAmount, firstCoinPayPeople,
            repeatTotalAmount, repeatTotalPeople, repeatCoinPayAmount, repeatCoinPayPeople
        } = await this.getTotalWithdrawAmountRecords(signal);

        console.log(`首提数据: 金额=${firstTotalAmount}, 人数=${firstTotalPeople}, CoinPay金额=${firstCoinPayAmount}, CoinPay人数=${firstCoinPayPeople}`);
        console.log(`复提数据: 金额=${repeatTotalAmount}, 人数=${repeatTotalPeople}, CoinPay金额=${repeatCoinPayAmount}, CoinPay人数=${repeatCoinPayPeople}`);
      
        // 5. 获取当天首充值总额和人数
        const {
          firstRechargeAmount, firstRechargeUsers,
          repeatRechargeAmount, repeatRechargeUsers
        } = await this.getTodayFirstCharge(signal);
        console.log(`首充数据: 金额=${firstRechargeAmount}, 人数=${firstRechargeUsers}`);
        console.log(`复充数据: 金额=${repeatRechargeAmount}, 人数=${repeatRechargeUsers}`);
    
        // 3. 计算首充比例（无备注）
        let cpRatioFirst = 0;
        let diffRatioFirst = 0;
        
        // 首充CP出款比例 = 今日无备注的cionpay出款人数 ÷ 今日首充人数
        if (firstRechargeUsers > 0) {
            cpRatioFirst = Number(((firstCoinPayPeople / firstRechargeUsers) * 100).toFixed(5));
        }
        
        // 首充充提差 = (当日首提金额 - 当日首提cionpay金额(无备注)) ÷ 当日首充金额
        if (firstRechargeAmount > 0) {
            const diffAmount = firstTotalAmount - firstCoinPayAmount;
            diffRatioFirst = Number(((diffAmount / firstRechargeAmount) * 100).toFixed(5));
        }
        
        // 4. 计算复充比例（有备注）
        let cpRatioRepeat = 0;
        let diffRatioRepeat = 0;
        
        // 复充CP出款比例 = 今日有备注的cionpay出款人数 ÷ 今日复充人数
        if (repeatRechargeUsers > 0) {
            cpRatioRepeat = Number(((repeatCoinPayPeople / repeatRechargeUsers) * 100).toFixed(5));
        }
        
        // 复充充提差 = (当日复提金额(有备注) - 当日复提cionpay金额(有备注)) ÷ 当日复充金额
        if (repeatRechargeAmount > 0) {
            const diffAmount = repeatTotalAmount - repeatCoinPayAmount;
            diffRatioRepeat = Number(((diffAmount / repeatRechargeAmount) * 100).toFixed(5));
        }
        
        console.log(`首充比例: CP出款=${cpRatioFirst}%, 充提差=${diffRatioFirst}%`);
        console.log(`复充比例: CP出款=${cpRatioRepeat}%, 充提差=${diffRatioRepeat}%`);
        
        return {
            // 首充相关
            cpRatioFirst,
            diffRatioFirst,
            firstRechargeAmount,
            firstRechargeUsers,
            firstWithdrawAmount: firstTotalAmount,
            firstWithdrawUsers: firstTotalPeople,
            // 复充相关
            cpRatioRepeat,
            diffRatioRepeat,
            repeatRechargeAmount,
            repeatRechargeUsers,
            repeatWithdrawAmount: repeatTotalAmount,
            repeatWithdrawUsers: repeatTotalPeople
        };
      }

      /**
       * 获取当日提现金额差
       * @description   当日总提现金额-当日coinPay提现金额
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async getTotalWithdrawAmountRecords(signal) {
          if (!isWithdrawPage()) {
              await this.goBackToWithdrawOrderPage(signal);
          }
          
          // 设置查询条件
          await this.selectDropdownOption("全部状态", "已支付", signal);
          await this.selectDropdownOption("全部", "全部", signal);
          await this.selectDropdownOption("请选择", "200条/页", signal);

          // 点击查询按钮
          const queryBtn = await this.findQueryButton(signal);
          if (!queryBtn) {
              updateStatus("找不到查询按钮");
              return { 
                  firstTotalAmount: 0, firstTotalPeople: 0, firstCoinPayAmount: 0, firstCoinPayPeople: 0,
                  repeatTotalAmount: 0, repeatTotalPeople: 0, repeatCoinPayAmount: 0, repeatCoinPayPeople: 0
              };
          }
          queryBtn.click();

          // 等待查询结果
          await delay(10000);

          // 获取当日总提现金额和coinPay提现金额（含所有分页）
          const result = await this.getTodayWithdrawAmount(signal);
          
          return result;
      }
  
      /**
       * 处理当前页的所有行数据，同时统计CoinPay数据
       * @param {NodeList} rows 表格行
       * @param {Function} parseValue 解析函数
       * @returns {Promise<{totalAmount: number, totalPeople: number}>}
       */
      async processRows(rows, parseValue) {
          let firstTotalAmount = 0;
          let firstTotalPeople = 0;
          let firstCoinPayAmount = 0;
          let firstCoinPayPeople = 0;
          
          let repeatTotalAmount = 0;
          let repeatTotalPeople = 0;
          let repeatCoinPayAmount = 0;
          let repeatCoinPayPeople = 0;
          
          for (const row of rows) {
              const cells = row.querySelectorAll("td");
              
              // 检查cells长度是否足够
              if (cells.length < 20) {
                  continue;
              }
              
              // 统计行固定位置第 10 列（索引9）为提现金额
              const amountCell = cells[9]?.querySelector(".cell");
              if (!amountCell) {
                  continue;
              }
              
              const amountText = amountCell.textContent.trim();
              if (!amountText) {
                  continue;
              }
              
              const amount = parseValue(amountText);
              
              // 检查是否是CoinPay（第8列，索引7可能是第三方支付方式）
              const thirdPartyCell = cells[7]?.querySelector(".cell");
              const isCoinPay = thirdPartyCell ? (
                  thirdPartyCell.textContent.trim().includes("CoinPay") || 
                  thirdPartyCell.textContent.trim().includes("coinpay") || 
                  thirdPartyCell.textContent.trim().toLowerCase().includes("coin")
              ) : false;

              // 统计行固定位置第 20 列（索引19）为备注
              const remarkCell = cells[19]?.querySelector(".cell");
              const remarkText = remarkCell?.textContent.trim();
              // 有备注则是复提，不统计
              if (remarkText) {
                // 有备注是复提
                repeatTotalAmount += amount;
                repeatTotalPeople += 1;
                if (isCoinPay) {
                    repeatCoinPayAmount += amount;
                    repeatCoinPayPeople += 1;
                }
              } else {
                // 无备注是首提
                firstTotalAmount += amount;
                firstTotalPeople += 1;
                if (isCoinPay) {
                    firstCoinPayAmount += amount;
                    firstCoinPayPeople += 1;
                }
              }

          }
          
          return { 
              firstTotalAmount, 
              firstTotalPeople, 
              firstCoinPayAmount, 
              firstCoinPayPeople,
              repeatTotalAmount, 
              repeatTotalPeople, 
              repeatCoinPayAmount, 
              repeatCoinPayPeople
          };
      }

      /**
       * 获取当前分页信息
       * @returns {Promise<{totalRecords: number, pageSize: number, totalPages: number}>}
       */
      async getPaginationInfo() {
          // 检查是否有分页
          const pagination = document.querySelector('.el-pagination, .pagination-container');
          if (!pagination) {
              console.log("没有分页组件");
              return null;
          }
          
          // 获取总条数
          const totalText = pagination.querySelector('.el-pagination__total')?.textContent;
          if (!totalText) {
              console.log("无法获取总条数");
              return null;
          }
          
          // 解析总条数，例如："共 975 条"
          const totalMatch = totalText.match(/共\s*(\d+)\s*条/);
          if (!totalMatch) {
              console.log("无法解析总条数:", totalText);
              return null;
          }
          
          const totalRecords = parseInt(totalMatch[1]);
          
          // 获取每页数量
          const pageSizeSelect = pagination.querySelector('.el-select input');
          let pageSize = 50; // 默认值
          if (pageSizeSelect) {
              const pageSizeText = pageSizeSelect.value;
              if (pageSizeText && pageSizeText.includes('条')) {
                  const sizeMatch = pageSizeText.match(/(\d+)条/);
                  if (sizeMatch) {
                      pageSize = parseInt(sizeMatch[1]);
                  }
              }
          }
          
          // 计算总页数
          const totalPages = Math.ceil(totalRecords / pageSize);
          
          console.log(`分页信息: 总记录${totalRecords}条，每页${pageSize}条，共${totalPages}页`);
          
          return {
              totalRecords,
              pageSize,
              totalPages
          };
      }

      /**
       * 处理所有分页数据，同时统计CoinPay数据
       * @param {AbortSignal} signal 取消信号
       * @param {string} tableTitle 表格标题
       * @returns {Promise<{totalAmount: number, todayWithdrawPeople: number}>}
       */
      async processAllPages(signal, tableTitle) {
          let firstTotalAmount = 0;
          let firstTotalPeople = 0;
          let firstCoinPayAmount = 0;
          let firstCoinPayPeople = 0;
          
          let repeatTotalAmount = 0;
          let repeatTotalPeople = 0;
          let repeatCoinPayAmount = 0;
          let repeatCoinPayPeople = 0;
          
          // 1. 获取当前分页信息
          const paginationInfo = await this.getPaginationInfo();
          if (!paginationInfo) {
              console.log("没有分页，只统计当前页");
              return {
                  firstTotalAmount, firstTotalPeople, firstCoinPayAmount, firstCoinPayPeople,
                  repeatTotalAmount, repeatTotalPeople, repeatCoinPayAmount, repeatCoinPayPeople
              };
          }
          
          const { totalPages } = paginationInfo;
          
          if (totalPages <= 1) {
              console.log("只有1页，无需翻页");
              return {
                  firstTotalAmount, firstTotalPeople, firstCoinPayAmount, firstCoinPayPeople,
                  repeatTotalAmount, repeatTotalPeople, repeatCoinPayAmount, repeatCoinPayPeople
              };
          }
          
          // 数值解析函数
          const parseValue = (text) => {
              const numStr = text.replace(/[^\d.-]/g, "");
              return parseFloat(numStr) || 0;
          };
          
          // 从第2页开始统计（第1页已经统计过了）
          for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
              if (signal?.aborted) {
                  console.log("处理被中断");
                  break;
              }
              
              updateStatus(`正在统计第${currentPage}/${totalPages}页...`);
              console.log(`开始处理第${currentPage}页`);
              
              // 等待一下确保DOM更新
              await delay(500);
              
              // 重新获取分页元素（每次都需要重新获取）
              const pagination = document.querySelector('.el-pagination, .pagination-container');
              if (!pagination) {
                  console.log("分页组件消失，停止翻页");
                  break;
              }
              
              // 先尝试直接点击页码按钮
              let pageClicked = false;
              const pageNumbers = pagination.querySelectorAll('.el-pager .number');
              for (const pageNumber of pageNumbers) {
                  if (pageNumber.textContent.trim() === currentPage.toString()) {
                      console.log(`找到第${currentPage}页按钮，点击`);
                      pageNumber.click();
                      pageClicked = true;
                      break;
                  }
              }
              
              // 如果没找到对应的页码按钮，使用下一页按钮
              if (!pageClicked) {
                  console.log(`未找到第${currentPage}页按钮，使用下一页按钮`);
                  
                  // 先点击下一页按钮直到到达目标页
                  let attempts = 0;
                  while (attempts < 5) { // 最多尝试5次
                      attempts++;
                      
                      // 获取当前活动页码
                      const activePage = pagination.querySelector('.el-pager .number.active');
                      const currentActivePage = activePage ? parseInt(activePage.textContent.trim()) : 1;
                      
                      if (currentActivePage >= currentPage) {
                          console.log(`已到达第${currentActivePage}页，目标第${currentPage}页`);
                          break;
                      }
                      
                      const nextBtn = pagination.querySelector('.btn-next:not([disabled])');
                      if (!nextBtn) {
                          console.log("下一页按钮不可用");
                          break;
                      }
                      
                      console.log(`当前第${currentActivePage}页，点击下一页到第${currentPage}页`);
                      nextBtn.click();
                      await delay(3000); // 等待页面加载
                      
                      // 等待一下让页面更新
                      await delay(1000);
                  }
                  
                  if (attempts >= 5) {
                      console.log(`尝试5次仍未到达第${currentPage}页，跳过`);
                      continue;
                  }
              } else {
                  // 如果直接点击了页码，等待页面加载
                  await delay(3000);
              }
              
              // 等待表格数据刷新
              await delay(2000);
              
              // 检查数据是否加载完成
              const loadingMask = document.querySelector('.el-loading-mask:not([style*="display: none"])');
              if (loadingMask) {
                  console.log("等待数据加载完成...");
                  await delay(1000);
              }
              
              // 获取当前页数据
              const rows = await this.getOrderListRows(signal, tableTitle);
              if (!rows || rows.length == 0) {
                  console.log(`第${currentPage}页没有数据`);
                  
                  // 检查是否有"暂无数据"提示
                  const emptyText = document.querySelector(".el-table__empty-text");
                  if (emptyText?.textContent.includes("暂无数据")) {
                      console.log(`第${currentPage}页显示暂无数据，停止翻页`);
                      break;
                  }
                  
                  continue;
              }
              
              // 统计当前页
              const pageResult = await this.processRows(rows, parseValue);
              
              firstTotalAmount += pageResult.firstTotalAmount;
              firstTotalPeople += pageResult.firstTotalPeople;
              firstCoinPayAmount += pageResult.firstCoinPayAmount;
              firstCoinPayPeople += pageResult.firstCoinPayPeople;
              
              repeatTotalAmount += pageResult.repeatTotalAmount;
              repeatTotalPeople += pageResult.repeatTotalPeople;
              repeatCoinPayAmount += pageResult.repeatCoinPayAmount;
              repeatCoinPayPeople += pageResult.repeatCoinPayPeople;
              
              console.log(`第${currentPage}页统计完成:`);
              console.log(`  首提: 金额=${pageResult.firstTotalAmount}, 人数=${pageResult.firstTotalPeople}, CoinPay金额=${pageResult.firstCoinPayAmount}, CoinPay人数=${pageResult.firstCoinPayPeople}`);
              console.log(`  复提: 金额=${pageResult.repeatTotalAmount}, 人数=${pageResult.repeatTotalPeople}, CoinPay金额=${pageResult.repeatCoinPayAmount}, CoinPay人数=${pageResult.repeatCoinPayPeople}`);
              console.log(`  累计: 首提总额=${firstTotalAmount}, 首提人数=${firstTotalPeople}, 复提总额=${repeatTotalAmount}, 复提人数=${repeatTotalPeople}`);
              // 添加短暂延迟，避免请求过快
              await delay(500);
          }
          
          console.log(`所有分页统计完成:`);
          console.log(`  首提总计: 金额=${firstTotalAmount}, 人数=${firstTotalPeople}, CoinPay金额=${firstCoinPayAmount}, CoinPay人数=${firstCoinPayPeople}`);
          console.log(`  复提总计: 金额=${repeatTotalAmount}, 人数=${repeatTotalPeople}, CoinPay金额=${repeatCoinPayAmount}, CoinPay人数=${repeatCoinPayPeople}`);
          
          return {
              firstTotalAmount, 
              firstTotalPeople, 
              firstCoinPayAmount, 
              firstCoinPayPeople,
              repeatTotalAmount, 
              repeatTotalPeople, 
              repeatCoinPayAmount, 
              repeatCoinPayPeople
          };
      }

      /**
       * 查找分页按钮（简化的辅助方法）
       * @param {number} pageNum 页码
       * @returns {HTMLElement|null}
       */
      findPageButton(pageNum) {
          const pagination = document.querySelector('.el-pagination, .pagination-container');
          if (!pagination) return null;
          
          // 查找页码按钮
          const pageNumbers = pagination.querySelectorAll('.el-pager .number');
          for (const pageNumber of pageNumbers) {
              if (pageNumber.textContent.trim() === pageNum.toString()) {
                  return pageNumber;
              }
          }
          
          return null;
      }

      /**
       * 跳转到指定页面
       * @param {string} hash 页面hash
       * @param {AbortSignal} signal 取消信号
       */
      async navigateTo(hash, signal) {
        if (window.location.hash.includes(hash)) {
          await delay(1000);
          return;
        }
  
        window.location.hash = hash;
        await waitForPageChange(hash, 10000);
        await delay(1000); // 额外等待确保页面稳定
      }
  
      /**
       * 跳转到订单页面
       */
      async navigateToWithdrawPage() {
        await this.navigateTo("#/order/unread-withdraw");
      }
  
      /**
       * 开始新一轮处理
       */
      async startNewRound(signal) {
        updateStatus("所有订单已处理完成");
        config.completedOneRound = true;
        gmSet("completedOneRound", true);
  
        // 点击查询按钮重新开始
        await this.clickSearchButton(signal);
      }
  
      /**
       * 点击查询按钮
       */
      async clickSearchButton(signal) {
        // 获取所有filter-container元素
        const filterContainers = document.querySelectorAll(".filter-container");
  
        // 第三个filter-container包含查询按钮
        if (filterContainers.length >= 3) {
          const searchContainer = filterContainers[2];
  
          // 查找查询按钮
          const searchBtn = Array.from(
            searchContainer.querySelectorAll("button.el-button")
          ).find((btn) => !btn.disabled && btn.textContent.includes("查询"));
  
          if (searchBtn) {
            updateStatus("点击查询按钮重新开始处理...");
  
            // 点击查询按钮
            searchBtn.click();
  
            // 等待查询完成
            await delay(1500);
  
            config.completedOneRound = false;
            gmSet("completedOneRound", false);
  
            // 重新开始处理
            await delay(500);
            await this.processOrderPage(signal);
            return;
          }
        }
  
        // 如果没找到按钮，尝试其他方式
        updateStatus("未找到查询按钮，3秒后尝试重新开始");
        await delay(3000);
        await this.processOrderPage(signal);
      }
  
      /**
       * 获取提现订单表单（根据表头内容动态定位）
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<NodeListOf<HTMLElement>>}
       */
      async getOrderListRows(signal, title) {
        return await retryOperation(
            () => {
                if (signal.aborted) return;
                // 遍历所有 el-table
                const tables = document.querySelectorAll(".el-table");
                for (const table of tables) {
                    const headerCells = table.querySelectorAll(".el-table__header .cell");
                    let hasTotalWithdraw = false;

                    for (const cell of headerCells) {
                        // 使用 trim() 去除前后空格，并精确匹配
                        const cellText = cell.textContent.trim();
                        if (cellText === title) {
                            hasTotalWithdraw = true;
                            break;
                        }
                    }

                    if (!hasTotalWithdraw) continue;

                    const rows = table.querySelectorAll(".el-table__body tbody tr");
                    if (rows.length === 0) {
                        console.log("表格已找到，但还未渲染数据行");
                        return null;
                    }

                    return rows;  // 找到表格就返回行
                }

                console.log("未找到包含 '总提现金额' 的表格");
                return null;
            },
            3,      // 重试次数
            1000,   // 每次间隔 1 秒
            signal
        );
      }
      /**
       * 获取订单统计行（根据表头内容动态定位）
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<NodeListOf<HTMLElement>>}
       */
      async getOrderCountRows(signal, title) {
        return await retryOperation(
            () => {
                if (signal.aborted) return;
                // 遍历所有 el-table
                const tables = document.querySelectorAll(".el-table");
                for (const table of tables) {
                    const headerCells = table.querySelectorAll(".el-table__header .cell");
                    let hasTotalWithdraw = false;

                    for (const cell of headerCells) {
                        if (cell.textContent.includes("总提现金额")) {
                            hasTotalWithdraw = true;
                            break;
                        }
                    }

                    if (!hasTotalWithdraw) continue;

                    const rows = table.querySelectorAll(".el-table__body tbody tr");
                    if (rows.length === 0) {
                        console.log("表格已找到，但还未渲染数据行");
                        return null;
                    }

                    return rows;  // 找到表格就返回行
                }

                console.log("未找到包含 '总提现金额' 的表格");
                return null;
            },
            3,      // 重试次数
            1000,   // 每次间隔 1 秒
            signal
        );
      }

      /**
       * 统计当天已支付提现总人数
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<number>}
       */
      async getTodayWithdrawTotalPeople(signal) {
        // 检查是否有"暂无数据"提示
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
            console.log("暂无提现数据")
            return -1;
        }

        // 获取表格的所有行
        const rows = await this.getOrderCountRows(signal, "总人数");
        if (!rows || rows.length == 0) {
            console.log("暂无提现数据")
            return -1;
        }

        const cells = rows[0].querySelectorAll("td");
        // 统计行固定位置第 5 列（索引4）为提现金额
        const amountCell = cells[2]?.querySelector(".cell");
        if (!amountCell) return 0;
        const amountText = amountCell.textContent.trim();
        if (!amountText) return 0;
        
        // 数值解析函数
        const parseValue = (text) => {
          // 移除所有非数字字符（保留小数点和负号）
          const numStr = text.replace(/[^\d.-]/g, "");
          return parseFloat(numStr) || 0;
        };

        return parseValue(amountText);
      }

      /**
       * 统计当天已支付首提现总金额（无备注就算首提）- 处理所有分页
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<{totalAmount: number, todayWithdrawPeople: number}>}
       */
      async getTodayWithdrawAmount(signal) {
          // 检查是否有"暂无数据"提示
          const emptyText = document.querySelector(".el-table__empty-text");
          if (emptyText?.textContent.includes("暂无数据")) {
              console.log("暂无提现数据");
              return { 
                  firstTotalAmount: 0, firstTotalPeople: 0, firstCoinPayAmount: 0, firstCoinPayPeople: 0,
                  repeatTotalAmount: 0, repeatTotalPeople: 0, repeatCoinPayAmount: 0, repeatCoinPayPeople: 0
              };
          }

          // 获取表格的所有行
          const rows = await this.getOrderListRows(signal, "提现金额");
          if (!rows || rows.length == 0) {
              console.log("暂无提现数据");
              return { 
                  firstTotalAmount: 0, firstTotalPeople: 0, firstCoinPayAmount: 0, firstCoinPayPeople: 0,
                  repeatTotalAmount: 0, repeatTotalPeople: 0, repeatCoinPayAmount: 0, repeatCoinPayPeople: 0
              };
          }
          
          // 数值解析函数
          const parseValue = (text) => {
              // 移除所有非数字字符（保留小数点和负号）
              const numStr = text.replace(/[^\d.-]/g, "");
              return parseFloat(numStr) || 0;
          };
          
          // 统计第一页
          const firstPageResult = await this.processRows(rows, parseValue);
          let firstTotalAmount = firstPageResult.firstTotalAmount;
          let firstTotalPeople = firstPageResult.firstTotalPeople;
          let firstCoinPayAmount = firstPageResult.firstCoinPayAmount;
          let firstCoinPayPeople = firstPageResult.firstCoinPayPeople;
          
          let repeatTotalAmount = firstPageResult.repeatTotalAmount;
          let repeatTotalPeople = firstPageResult.repeatTotalPeople;
          let repeatCoinPayAmount = firstPageResult.repeatCoinPayAmount;
          let repeatCoinPayPeople = firstPageResult.repeatCoinPayPeople;
          
          // 检查是否有分页，并统计所有页面
          const paginationResult = await this.processAllPages(signal, "提现金额");
          if (paginationResult) {
              firstTotalAmount += paginationResult.firstTotalAmount;
              firstTotalPeople += paginationResult.firstTotalPeople;
              firstCoinPayAmount += paginationResult.firstCoinPayAmount;
              firstCoinPayPeople += paginationResult.firstCoinPayPeople;
              
              repeatTotalAmount += paginationResult.repeatTotalAmount;
              repeatTotalPeople += paginationResult.repeatTotalPeople;
              repeatCoinPayAmount += paginationResult.repeatCoinPayAmount;
              repeatCoinPayPeople += paginationResult.repeatCoinPayPeople;
          }
          
          return { 
              firstTotalAmount: parseFloat(firstTotalAmount.toFixed(2)), 
              firstTotalPeople,
              firstCoinPayAmount: parseFloat(firstCoinPayAmount.toFixed(2)),
              firstCoinPayPeople,
              repeatTotalAmount: parseFloat(repeatTotalAmount.toFixed(2)), 
              repeatTotalPeople,
              repeatCoinPayAmount: parseFloat(repeatCoinPayAmount.toFixed(2)),
              repeatCoinPayPeople
          };
      }
  
      /**
       * 统计当天已支付提现总金额
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<number>}
       */
      async getTodayWithdrawTotalAmount(signal) {
        // 检查是否有"暂无数据"提示
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
            console.log("暂无提现数据")
            return -1;
        }

        // 获取表格的所有行
        const rows = await this.getOrderCountRows(signal, "总提现金额");
        if (!rows || rows.length == 0) {
            console.log("暂无提现数据")
            return -1;
        }

        const cells = rows[0].querySelectorAll("td");
        // 统计行固定位置第 5 列（索引4）为提现金额
        const amountCell = cells[4]?.querySelector(".cell");
        if (!amountCell) return 0;
        const amountText = amountCell.textContent.trim();
        if (!amountText) return 0;
        
        // 数值解析函数
        const parseValue = (text) => {
          // 移除所有非数字字符（保留小数点和负号）
          const numStr = text.replace(/[^\d.-]/g, "");
          return parseFloat(numStr) || 0;
        };

        return parseValue(amountText);
      }

      /**
       * 统计当天 CoinPay 已支付首提现总金额和人数 - 处理所有分页
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<{coinPayCount: number, todayWithdrawCoinPayPeople: number}>}
       */
      async getTodayFirstCoinPayAmount(signal) {
          await this.selectDropdownOption("全部", "CoinPay", signal);

          // 等待一下让下拉选择生效
          await delay(500);
          // 点击查询按钮
          const queryBtn = await this.findQueryButton(signal);
          if (!queryBtn) {
              return { coinPayCount: 0, todayWithdrawCoinPayPeople: 0 };
          }
          queryBtn.click();

          // 等待查询结果 - 200条/页这里需要更长的时间
          await delay(5000);

          // 检查是否有数据
          const emptyText = document.querySelector(".el-table__empty-text");
          if (emptyText?.textContent.includes("暂无数据")) {
              console.log("暂无CoinPay提现数据");
              return { coinPayCount: 0, todayWithdrawCoinPayPeople: 0 };
          }

          // 获取表格行
          const rows = document.querySelectorAll(".el-table__body .el-table__row");
          if (!rows || rows.length == 0) {
              console.log("暂无CoinPay提现数据");
              return { coinPayCount: 0, todayWithdrawCoinPayPeople: 0 };
          }
          
          // 数值解析函数
          const parseValue = (text) => {
              // 移除所有非数字字符（保留小数点和负号）
              const numStr = text.replace(/[^\d.-]/g, "");
              return parseFloat(numStr) || 0;
          };
          
          // 统计第一页
          const firstPageResult = await this.processRows(rows, parseValue);
          let coinPayCount = firstPageResult.totalAmount;
          let todayWithdrawCoinPayPeople = firstPageResult.totalPeople;
          
          // 检查是否有分页，并统计所有页面
          const pagination = await this.processAllPages(signal, "提现金额");
          if (pagination) {
              coinPayCount += pagination.totalAmount;
              todayWithdrawCoinPayPeople += pagination.todayWithdrawPeople;
          }

          return { coinPayCount, todayWithdrawCoinPayPeople };
      }

      /**
       * 统计当天 CoinPay 已支付提现总金额
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async getTodayCoinPayWithdrawAmount(signal) {
        await this.selectDropdownOption("全部", "CoinPay", signal);
  
        // 点击查询按钮
        const queryBtn = await this.findQueryButton(signal);
        if (!queryBtn) {
            return -1;
        }
        queryBtn.click();
  
        // 等待查询结果
        await delay(3000);
  
        // 检查是否有数据
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
            console.log("暂无CoinPay提现数据")
            return -1;
        }
  
        // 获取表格行
        const rows = document.querySelectorAll(".el-table__body .el-table__row");
        if (!rows || rows.length == 0) {
            console.log("暂无CoinPay提现数据")
            return -1;
        }

        const cells = rows[0].querySelectorAll("td");
        // 统计行固定位置第 5 列（索引4）为提现金额
        const amountCell = cells[4]?.querySelector(".cell");
        if (!amountCell) return 0;
        const amountText = amountCell.textContent.trim();
        if (!amountText) return 0;
        
        // 数值解析函数
        const parseValue = (text) => {
          // 移除所有非数字字符（保留小数点和负号）
          const numStr = text.replace(/[^\d.-]/g, "");
          return parseFloat(numStr) || 0;
        };

        return parseValue(amountText);
      }
  
      /**
       * 选择下拉选项
       * @param {string} placeholder 下拉框placeholder
       * @param {string} optionText 选项文本
       * @param {AbortSignal} signal 取消信号
       */
      async selectDropdownOption(placeholder, optionText, signal) {
        const selectInput = await waitForElement(
          `.el-select input[placeholder="${placeholder}"]`,
          5000,
          null,
          signal
        );
        selectInput.click();
  
        const dropdown = await waitForElement(
          '.el-select-dropdown.el-popper:not([style*="display: none"])',
          5000,
          null,
          signal
        );
  
        const options = dropdown.querySelectorAll(".el-select-dropdown__item");
        const targetOption = Array.from(options).find(option => 
          option.textContent.trim().toLowerCase() === optionText.toLowerCase()
        );
  
        if (!targetOption) {
          throw new Error(`找不到选项: ${optionText}`);
        }
  
        targetOption.click();
        await delay(1000); // 等待选择生效
      }

      /**
       * 关闭所有弹窗
       */
      async closeAllDialogs(signal) {
        const dialogs = document.querySelectorAll('.el-dialog__wrapper:not([style*="display: none"])');
        if (!dialogs) {
          processor.processOrderPage(signal);
          return;
        }
        for (const dialog of dialogs) {
          const closeBtn = dialog.querySelector('.el-dialog__headerbtn');
          if (closeBtn) closeBtn.click();
          await delay(300);
        }
      }
    }
  
    // 创建处理器实例
    const processor = new OrderProcessor(config);
  
    // 初始化
    function init() {
        // 初始化控制面板
        addControlPanel();

        // 检查是否已完成一轮处理
        config.completedOneRound = gmGet("completedOneRound", false);
        if (config.completedOneRound) {
            updateStatus("检测到已完成一轮处理，开始新一轮处理");
            gmSet("completedOneRound", false);
            config.processedOrders = {};
            gmSet("processedOrders", {});
            document.getElementById(`${NS}_processedCount`).textContent = "0";
        }

        updateStatus("准备就绪");
  
        // 如果当前已经在订单页面且正在处理中，直接开始处理
        if (config.isProcessing) {
            updateStatus("开始处理中...");
            processor.processOrderPage(processor.abortController.signal);
        }
    }
  
    // 页面加载完成后执行
    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init);
    }
  })();