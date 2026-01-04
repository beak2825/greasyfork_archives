// ==UserScript==
// @name         运单自动抢单助手
// @namespace    https://github.com/wavever/carrier-auto
// @version      1.2.1
// @description  为运单系统添加抢单倒计时和自动抢单功能
// @author       wavever
// @match        https://carrier.okguanli.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553496/%E8%BF%90%E5%8D%95%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553496/%E8%BF%90%E5%8D%95%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // 日志开关
  const ENABLE_DEBUG_LOG = false;
  const VERSION = '1.2.1';

  // 全局变量
  let countdownIntervals = new Map(); // 存储倒计时任务
  let autoGrabTasks = new Map(); // 存储自动抢单任务
  let orderDataMap = new Map(); // 存储运单数据，key为运单ID，value为运单信息
  let statusIndicator = null; // 状态指示器元素
  let refreshBtn = null; // 刷新按钮元素

  // 设置相关变量
  const SETTINGS_KEY = 'carrierAutoSettings';
  const DESTINATION_LIST_KEY = 'carrierDestinationList';
  const DESTINATION_CONFIG_KEY = 'carrierDestinationConfig';
  const NOTE_CONFIG_KEY = 'carrierNoteConfig';
  const GRAB_RULES_KEY = 'carrierGrabRules'; // 新的抢单规则存储key

  let settings = {
    enableAutoGrab: false, // 是否启用自动抢单
    showCountdown: false, // 是否显示倒计时
    enableAutoRefresh: false, // 是否启用自动刷新
    refreshInterval: 5, // 自动刷新间隔（秒）
    skipGrabConfirm: false, // 是否跳await new Promise((resolve) => setTimeout(resolve, 100))过抢单确认弹框
    enableDestinationMatch: false, // 是否启用目的地匹配自动抢单
    refreshMode: 'api', // 刷新模式：'click' | 'api'
    pauseAfterSuccess: true, // 是否在抢单成功后暂停
    pauseDuration: 60, // 抢单成功后暂停的时长（秒）
    grabMode: 'click', // 抢单模式：'click'(点击按钮) | 'api'(直接API)
  };

  // 目的地匹配配置
  let destinationConfig = {
    whitelist: [], // 白名单目的地数组
    blacklist: [], // 黑名单目的地数组
  };

  // 兼容性：旧的目的地列表变量
  let destinationList = [];

  // 备注配置
  let noteConfig = {
    mode: 'whitelist', // 'whitelist' | 'blacklist'
    whitelist: [], // 白名单关键字数组
    blacklist: [], // 黑名单关键字数组
  };

  /**
   * 新的抢单规则配置
   * 规则数据结构说明：
   * - 每条规则是一个独立的对象
   * - 规则内的条件之间可以配置逻辑关系
   * - 只要运单满足任一规则即可抢单
   */
  let grabRules = {
    enabled: false, // 是否启用规则匹配
    rules: [], // 规则数组
  };

  /**
   * 单条规则的数据结构（简化版）：
   * {
   *   id: string,           // 规则唯一ID
   *   name: string,         // 规则名称（可选，用于展示）
   *   action: 'grab',       // 规则满足时的动作：'grab'(抢单) | 'skip'(跳过)
   *   conditions: [         // 条件数组
   *     {
   *       field: 'destination',  // 字段名：'destination'|'note'|'weight'|'dispatcher'|'customerPhone'
   *       matchType: 'contains', // 匹配类型：'contains'|'equals'|'notContains'|'gt'|'lt'|'gte'|'lte'|'range'
   *       value: string|number,  // 匹配值
   *       rangeMin: number,      // 范围最小值（仅range类型）
   *       rangeMax: number,      // 范围最大值（仅range类型）
   *       logic: 'AND'           // 与下一个条件的逻辑关系：'AND' | 'OR'（最后一个条件此字段无意义）
   *     }
   *   ]
   * }
   *
   * 举例：规则 "A AND B OR C" 的结构：
   * {
   *   conditions: [
   *     { ...A, logic: 'AND' },   // A与B是AND关系
   *     { ...B, logic: 'OR' },    // B与C是OR关系
   *     { ...C, logic: 'AND' }    // 最后一个条件的logic无意义
   *   ]
   * }
   */

  // 目的地匹配相关变量
  let matchedOrders = new Map(); // 存储匹配到的订单
  let matchInfoPanel = null; // 浮动信息面板

  // 自动刷新相关变量
  let autoRefreshTimer = null;
  let lastRefreshTime = null;
  let isRefreshPaused = false; // 是否暂停自动刷新

  // 抢单面板相关变量
  let grabPanelData = {
    todayOrders: new Map(), // 今日抢单数据
    historyOrders: new Map(), // 历史抢单数据
  };
  let panelFloatButton = null; // 浮动按钮
  let panelSidebar = null; // 侧边栏面板
  let isPanelOpen = false; // 面板是否打开
  const PANEL_DATA_KEY = 'carrierGrabPanelData'; // 面板数据存储key

  // 全局暂停相关变量
  let isGlobalPaused = false; // 全局暂停状态（不持久化）
  let globalPauseButton = null; // 全局暂停按钮引用

  // 黑名单提醒去重相关变量
  let blacklistAlertHistory = new Map(); // 存储已提醒的运单ID和时间戳
  const BLACKLIST_ALERT_COOLDOWN = 2 * 60 * 1000; // 2分钟冷却时间（毫秒）

  // 抢单失败黑名单（运行时状态，不持久化）
  let failedOrderBlacklist = new Set(); // 存储抢单失败的订单ID，避免重复尝试

  // 抢单重试相关变量
  const MAX_RETRY_COUNT = 5; // 最大重试次数
  let grabbingOrders = new Map(); // 存储正在抢单的订单 {orderId: {retryCount: number, isGrabbing: boolean}}

  // API接口调用功能
  async function fetchOrderDataFromAPI() {
    try {
      if (ENABLE_DEBUG_LOG) {
        console.log('开始通过API获取运单数据...');
      }

      const requestBody = {
        ignorePermission: false,
        includeBizActivity: false,
        filterByStatus: true,
        filterByCorp: true,
        finderCode: '',
        appCode: 'WAY_BILL',
        javaType: '',
        splitQuery: false,
        startIndex: 0,
        maxResults: 40,
        orderFields: [
          { field: 'allocateTime', order: 'DESC' },
          { field: 'planAllocateTime', order: 'DESC' },
        ],
        queryFields: [
          'id',
          'name',
          'code',
          'customer',
          'destinationPoint',
          'expirationDate',
          'planEndTime',
          'carrier.corporationOwned',
          'tool',
          'driver',
          'allocateTime',
          'planAllocateTime',
          'destinationPoint',
          'site.contractCode',
          'InvoicingCompany',
          'pinche',
          'freight',
          'ext_suppleQtyTotal',
          'tranQtyTotal',
          'sjzlbt',
          'xqbz',
          'xxdzlj',
          'xxdzlj2',
          'createInfo.userName',
          'tool.emissionType',
          'customerNodePhone',
        ],
        includeActProgress: false,
        extendFields: [],
        filter: {
          logic: 'AND',
          children: [
            {
              logic: 'AND',
              value: false,
              children: [],
              filterField: 'scrapped',
              expression: '=',
            },
            {
              logic: 'AND',
              value: '',
              children: [],
              filterField: 'type',
              expression: 'IS NOT NULL',
            },
            {
              logic: 'AND',
              value: '',
              children: [],
              filterField: 'carrier',
              expression: 'IS NULL',
            },
          ],
          expression: '=',
        },
        expressParams: [],
      };

      const response = await fetch('https://carrier.okguanli.com/api/way_bill/dispatch/data/query', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json;charset=UTF-8',
          'sec-ch-ua': '"Not=A?Brand";v="24", "Chromium";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          Referer: 'https://carrier.okguanli.com/',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (ENABLE_DEBUG_LOG) {
        console.log('API响应成功，数据:', data);
      }

      // 这里不更新表格，只是触发拦截URL逻辑
      // 可以触发一个自定义事件或者直接返回成功状态
      return {
        success: true,
        data: data,
        message: 'API调用成功',
      };
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        success: false,
        error: error.message,
        message: 'API调用失败',
      };
    }
  }

  // 检查是否在抢单页面
  function isInGrabOrderTab() {
    const activeTab = document.querySelector(
      '.ant-radio-button-wrapper-checked input[value="CAN_GRAB_ORD"]'
    );
    return activeTab !== null;
  }

  // 执行刷新（根据模式选择不同方式）
  async function performRefresh() {
    if (ENABLE_DEBUG_LOG) {
      console.log(
        `执行刷新，当前模式:${settings.refreshMode}, 间隔时间:${settings.refreshInterval}秒`
      );
    }

    if (settings.refreshMode === 'api') {
      // API模式刷新
      const result = await fetchOrderDataFromAPI();
      if (result.success) {
        if (ENABLE_DEBUG_LOG) {
          console.log('API刷新成功');
        }
        return { success: true, mode: 'api' };
      } else {
        console.warn('API刷新失败，准备fallback到点击模式:', result.error);

        // 检查是否在抢单tab
        if (!isInGrabOrderTab()) {
          console.error('当前不在抢单tab，无法执行fallback');
          return {
            success: false,
            mode: 'api',
            error: '当前不在抢单页面，无法执行点击刷新fallback',
          };
        }

        // fallback到点击模式
        if (ENABLE_DEBUG_LOG) {
          console.log('执行fallback点击刷新');
        }
        return performClickRefresh();
      }
    } else {
      // 点击模式刷新
      return performClickRefresh();
    }
  }

  // 执行点击刷新
  function performClickRefresh() {
    try {
      if (refreshBtn) {
        refreshBtn.click();
        if (ENABLE_DEBUG_LOG) {
          console.log('点击刷新执行成功');
        }
        return { success: true, mode: 'click' };
      } else {
        console.error('未找到刷新按钮');
        return {
          success: false,
          mode: 'click',
          error: '未找到刷新按钮',
        };
      }
    } catch (error) {
      console.error('点击刷新失败:', error);
      return {
        success: false,
        mode: 'click',
        error: error.message,
      };
    }
  }

  // 加载设置
  function loadSettings() {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (ENABLE_DEBUG_LOG) {
      console.log('从localStorage读取的原始数据:', savedSettings);
    }

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);

        // 逐个字段更新，确保每个字段都被正确设置
        Object.keys(parsed).forEach((key) => {
          if (parsed[key] !== undefined && parsed[key] !== null) {
            settings[key] = parsed[key];
            if (ENABLE_DEBUG_LOG) {
              console.log(`已更新设置字段 ${key}:`, parsed[key]);
            }
          }
        });

        // 待删除的开关先隐藏
        settings.enableAutoGrab = false;
        settings.showCountdown = false;

        if (ENABLE_DEBUG_LOG) {
          console.log('最终加载的设置:', settings);
        }
      } catch (e) {
        console.error('加载设置失败:', e);
      }
    } else {
      if (ENABLE_DEBUG_LOG) {
        console.log('没有找到已保存的设置，使用默认设置:', settings);
      }
    }

    // 加载目的地配置
    const savedDestinationConfig = localStorage.getItem(DESTINATION_CONFIG_KEY);
    if (ENABLE_DEBUG_LOG) {
      console.log('从localStorage读取的目的地配置数据:', savedDestinationConfig);
    }

    if (savedDestinationConfig) {
      try {
        destinationConfig = { ...destinationConfig, ...JSON.parse(savedDestinationConfig) };
        if (ENABLE_DEBUG_LOG) {
          console.log('已加载目的地配置:', destinationConfig);
        }
      } catch (e) {
        console.error('加载目的地配置失败:', e);
        destinationConfig = {
          whitelist: [],
          blacklist: [],
        };
      }
    } else {
      if (ENABLE_DEBUG_LOG) {
        console.log('没有找到已保存的目的地配置，检查旧版本数据');
      }
      // 兼容性处理：检查旧版本的目的地列表
      const savedDestinations = localStorage.getItem(DESTINATION_LIST_KEY);
      if (savedDestinations) {
        try {
          const oldList = JSON.parse(savedDestinations);
          if (Array.isArray(oldList) && oldList.length > 0) {
            destinationConfig.whitelist = [...oldList];
            if (ENABLE_DEBUG_LOG) {
              console.log('从旧版本迁移目的地数据到白名单:', destinationConfig.whitelist);
            }
            // 保存新格式的配置
            saveDestinationConfig();
          }
        } catch (e) {
          console.error('迁移旧版本目的地数据失败:', e);
        }
      }
    }

    // 兼容性：设置旧的destinationList变量为白名单
    destinationList = destinationConfig.whitelist;

    // 加载备注配置
    const savedNoteConfig = localStorage.getItem(NOTE_CONFIG_KEY);
    if (ENABLE_DEBUG_LOG) {
      console.log('从localStorage读取的备注配置数据:', savedNoteConfig);
    }

    if (savedNoteConfig) {
      try {
        noteConfig = { ...noteConfig, ...JSON.parse(savedNoteConfig) };
        if (ENABLE_DEBUG_LOG) {
          console.log('已加载备注配置:', noteConfig);
        }
      } catch (e) {
        console.error('加载备注配置失败:', e);
        noteConfig = {
          mode: 'whitelist',
          whitelist: [],
          blacklist: [],
        };
      }
    } else {
      if (ENABLE_DEBUG_LOG) {
        console.log('没有找到已保存的备注配置，使用默认配置');
      }
    }

    // 加载面板数据
    loadPanelData();

    // 加载新的抢单规则
    loadGrabRules();
  }

  // 保存设置
  function saveSettings() {
    try {
      if (ENABLE_DEBUG_LOG) {
        console.log('准备保存设置到localStorage:', settings);
      }
      const settingsStr = JSON.stringify(settings);
      if (ENABLE_DEBUG_LOG) {
        console.log('序列化后的设置字符串:', settingsStr);
      }
      localStorage.setItem(SETTINGS_KEY, settingsStr);
      if (ENABLE_DEBUG_LOG) {
        console.log('设置已成功保存到localStorage');
      }

      // 验证保存是否成功
      const verification = localStorage.getItem(SETTINGS_KEY);
      if (ENABLE_DEBUG_LOG) {
        console.log('验证保存结果:', verification);
      }
      if (ENABLE_DEBUG_LOG) {
        console.log('保存验证是否成功:', verification === settingsStr);
      }
    } catch (e) {
      console.error('保存设置到localStorage失败:', e);
    }
  }

  // 保存目的地配置
  function saveDestinationConfig() {
    try {
      localStorage.setItem(DESTINATION_CONFIG_KEY, JSON.stringify(destinationConfig));
      if (ENABLE_DEBUG_LOG) {
        console.log('目的地配置已保存到localStorage:', destinationConfig);
      }
      // 兼容性：同时更新旧的destinationList变量
      destinationList = destinationConfig.whitelist;
    } catch (e) {
      console.error('保存目的地配置失败:', e);
    }
  }

  // 保存目的地列表（兼容性函数）
  function saveDestinationList() {
    // 重定向到新的保存函数
    saveDestinationConfig();
  }

  // 保存备注配置
  function saveNoteConfig() {
    try {
      localStorage.setItem(NOTE_CONFIG_KEY, JSON.stringify(noteConfig));
      if (ENABLE_DEBUG_LOG) {
        console.log('备注配置已保存到localStorage:', noteConfig);
      }
    } catch (e) {
      console.error('保存备注配置失败:', e);
    }
  }

  // 加载抢单规则
  function loadGrabRules() {
    const savedRules = localStorage.getItem(GRAB_RULES_KEY);
    if (ENABLE_DEBUG_LOG) {
      console.log('从localStorage读取的抢单规则数据:', savedRules);
    }

    if (savedRules) {
      try {
        const parsed = JSON.parse(savedRules);
        grabRules = {
          enabled: parsed.enabled !== undefined ? parsed.enabled : false,
          rules: Array.isArray(parsed.rules) ? parsed.rules.map(rule => ({
            ...rule,
            action: rule.action || 'grab' // 确保旧规则有默认动作
          })) : [],
        };
        if (ENABLE_DEBUG_LOG) {
          console.log('已加载抢单规则:', grabRules);
        }
      } catch (e) {
        console.error('加载抢单规则失败:', e);
        grabRules = {
          enabled: false,
          rules: [],
        };
      }
    } else {
      if (ENABLE_DEBUG_LOG) {
        console.log('没有找到已保存的抢单规则，使用默认配置');
      }
    }
  }

  // 保存抢单规则
  function saveGrabRules() {
    try {
      localStorage.setItem(GRAB_RULES_KEY, JSON.stringify(grabRules));
      if (ENABLE_DEBUG_LOG) {
        console.log('抢单规则已保存到localStorage:', grabRules);
      }
    } catch (e) {
      console.error('保存抢单规则失败:', e);
    }
  }

  // 生成规则ID
  function generateRuleId() {
    return 'rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 加载面板数据
  function loadPanelData() {
    try {
      const savedData = localStorage.getItem(PANEL_DATA_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.todayOrders && Array.isArray(parsed.todayOrders)) {
          grabPanelData.todayOrders = new Map(parsed.todayOrders);
        }
        if (parsed.historyOrders && Array.isArray(parsed.historyOrders)) {
          grabPanelData.historyOrders = new Map(parsed.historyOrders);
        }
        if (ENABLE_DEBUG_LOG) {
          console.log('面板数据已加载:', grabPanelData);
        }
      }
    } catch (e) {
      console.error('加载面板数据失败:', e);
      grabPanelData = {
        todayOrders: new Map(),
        historyOrders: new Map(),
      };
    }
  }

  // 保存面板数据
  function savePanelData() {
    try {
      const dataToSave = {
        todayOrders: Array.from(grabPanelData.todayOrders.entries()),
        historyOrders: Array.from(grabPanelData.historyOrders.entries()),
      };
      localStorage.setItem(PANEL_DATA_KEY, JSON.stringify(dataToSave));
      if (ENABLE_DEBUG_LOG) {
        console.log('面板数据已保存');
      }
    } catch (e) {
      console.error('保存面板数据失败:', e);
    }
  }

  // 创建设置按钮
  function createSettingsButton() {
    const settingsIcon = document.getElementsByClassName('ant-dropdown-trigger')[0];
    if (!settingsIcon) {
      console.warn('未找到设置图标');
      return;
    }

    const ourSettingsBtn = document.createElement('label');
    ourSettingsBtn.className = 'ant-dropdown-trigger auto-grab-settings';

    // 添加悬停样式
    const style = document.createElement('style');
    style.textContent = `
            .auto-grab-settings {
                position: relative;
                overflow: hidden;
            }
            .auto-grab-settings::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            .auto-grab-settings:hover::before {
                left: 100%;
            }
            .auto-grab-settings:hover {
                background: linear-gradient(135deg, #ff8c42, #ffa726) !important;
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 4px 15px rgba(255, 140, 66, 0.4) !important;
            }
            .auto-grab-settings:active {
                transform: translateY(-1px) scale(1.02);
                box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3) !important;
            }
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 3px 12px rgba(255, 107, 53, 0.3); }
                50% { box-shadow: 0 3px 20px rgba(255, 107, 53, 0.5); }
            }
            .auto-grab-settings {
                animation: pulse-glow 2s infinite;
            }
        `;
    document.head.appendChild(style);
    ourSettingsBtn.style.cssText = `
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            color: rgb(255, 255, 255);
            cursor: pointer;
            margin-left: 16px;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            padding: 8px 16px;
            border-radius: 25px;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(255, 107, 53, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;
    ourSettingsBtn.innerHTML = `
            <span role="img" aria-label="thunderbolt" class="anticon anticon-thunderbolt" style="font-size: 18px; color: #ffd700;">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="thunderbolt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M848 359.3H627.7L825.8 109c4.1-5.3.4-13-6.3-13H436c-2.8 0-5.5 1.5-6.9 4L170 547.5c-3.1 5.3.7 12 6.9 12h174.4l-89.4 357.6c-1.9 7.8 7.5 13.3 13.3 7.7L853.5 373c5.2-4.9 1.7-13.7-5.5-13.7zM378.2 732.5l60.3-241H281.1l189.6-327.4h224.6L487 427.4h211L378.2 732.5z"/>
                </svg>
            </span>
            <span style="margin-left: 6px; font-size: 14px; font-weight: 500;">运单助手 v${VERSION}</span>
        `;

    // 插入我们的设置按钮
    settingsIcon.parentNode.insertBefore(ourSettingsBtn, settingsIcon.nextSibling);

    // 点击事件处理
    ourSettingsBtn.addEventListener('click', showSettingsModal);
  }

  // 显示设置弹窗
  function showSettingsModal() {
    if (ENABLE_DEBUG_LOG) {
      console.log('=== 打开设置弹框 ===');
    }
    if (ENABLE_DEBUG_LOG) {
      console.log('当前settings:', JSON.stringify(settings, null, 2));
    }

    // 创建模态框容器
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            min-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

    // 标题
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; font-weight: 500;';
    title.textContent = '运单助手设置';

    // 设置项
    const settingsContent = document.createElement('div');
    settingsContent.style.cssText = 'margin-bottom: 24px;';

    let tempSettings = { ...settings }; // 临时设置副本

    // 跳过确认弹框开关
    const skipConfirmSwitch = createSettingSwitch(
      '点击抢单按钮后，不再展示确认弹框 ⚠️',
      settings.skipGrabConfirm,
      (checked) => {
        tempSettings.skipGrabConfirm = checked;
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 跳过确认弹框:', checked);
        }
      }
    );

    // 自动抢单开关容器
    const autoGrabContainer = document.createElement('div');
    autoGrabContainer.style.cssText = 'margin-bottom: 16px;';

    // 自动抢单开关
    const autoGrabSwitch = createSettingSwitch(
      '自动抢单 🎯',
      tempSettings.enableDestinationMatch,
      (checked) => {
        tempSettings.enableDestinationMatch = checked;
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 自动抢单:', checked);
        }
        // 更新子设置项的显示状态
        grabModeSelector.style.display = checked ? 'block' : 'none';
        configRulesBtn.style.display = checked ? 'inline-block' : 'none';
      }
    );

    // 抢单模式选择器
    const grabModeSelector = document.createElement('div');
    grabModeSelector.style.cssText = `
            margin-top: 12px;
            margin-left: 24px;
            padding: 12px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            background: #fafafa;
            display: ${tempSettings.enableDestinationMatch ? 'block' : 'none'};
        `;

    // 模式选择标题
    const grabModeTitle = document.createElement('div');
    grabModeTitle.style.cssText =
      'font-size: 13px; font-weight: 500; color: #262626; margin-bottom: 8px;';
    grabModeTitle.textContent = '抢单模式：';

    // 模式选择容器
    const grabModeOptionsContainer = document.createElement('div');
    grabModeOptionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    // 点击按钮模式选项
    const grabClickModeOption = document.createElement('label');
    grabClickModeOption.style.cssText =
      'display: flex; align-items: flex-start; cursor: pointer; font-size: 12px;';
    grabClickModeOption.innerHTML = `
            <input type="radio" name="grabMode" value="click" ${tempSettings.grabMode === 'click' || !tempSettings.grabMode ? 'checked' : ''}
                   style="margin-right: 8px; margin-top: 2px;">
            <div>
                <div style="font-weight: 500; color: #262626; margin-bottom: 2px;">
                    点击抢单按钮
                </div>
                <div style="color: #666; font-size: 11px;">
                    通过模拟点击抢单按钮进行抢单（推荐，需要确保一直停留在抢单页面）
                </div>
            </div>
        `;

    // API模式选项
    const grabApiModeOption = document.createElement('label');
    grabApiModeOption.style.cssText =
      'display: flex; align-items: flex-start; cursor: pointer; font-size: 12px;';
    grabApiModeOption.innerHTML = `
            <input type="radio" name="grabMode" value="api" ${tempSettings.grabMode === 'api' ? 'checked' : ''}
                   style="margin-right: 8px; margin-top: 2px;">
            <div>
                <div style="font-weight: 500; color: #262626; margin-bottom: 2px;">
                    直接访问服务器抢单
                </div>
                <div style="color: #666; font-size: 11px;">
                    直接调用API接口抢单（速度快，但可能有风险）
                </div>
            </div>
        `;

    // 绑定模式切换事件
    const grabClickRadio = grabClickModeOption.querySelector('input[type="radio"]');
    const grabApiRadio = grabApiModeOption.querySelector('input[type="radio"]');

    grabClickRadio.addEventListener('change', () => {
      if (grabClickRadio.checked) {
        tempSettings.grabMode = 'click';
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 抢单模式:', 'click');
        }
      }
    });

    grabApiRadio.addEventListener('change', () => {
      if (grabApiRadio.checked) {
        tempSettings.grabMode = 'api';
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 抢单模式:', 'api');
        }
      }
    });

    grabModeOptionsContainer.appendChild(grabClickModeOption);
    grabModeOptionsContainer.appendChild(grabApiModeOption);
    grabModeSelector.appendChild(grabModeTitle);
    grabModeSelector.appendChild(grabModeOptionsContainer);

    // 配置规则按钮
    const configRulesBtn = document.createElement('button');
    configRulesBtn.type = 'button';
    configRulesBtn.className = 'ant-btn ant-btn-link';
    configRulesBtn.style.cssText = `
            margin-left: 8px;
            padding: 0 8px;
            font-size: 12px;
            color: #1890ff;
            display: ${tempSettings.enableDestinationMatch ? 'inline-block' : 'none'};
        `;
    configRulesBtn.innerHTML = '📝 配置自动抢单规则';
    configRulesBtn.onclick = () => {
      showGrabRulesModal(tempSettings);
    };

    autoGrabContainer.appendChild(autoGrabSwitch);
    autoGrabContainer.appendChild(configRulesBtn);
    autoGrabContainer.appendChild(grabModeSelector);

    // 抢单成功后暂停设置区域
    const pauseAfterSuccessContainer = document.createElement('div');
    pauseAfterSuccessContainer.style.cssText = 'margin-bottom: 16px;';

    // 抢单成功后暂停开关
    const pauseAfterSuccessSwitch = createSettingSwitch(
      '抢单成功后暂停 ⏸️',
      tempSettings.pauseAfterSuccess,
      (checked) => {
        tempSettings.pauseAfterSuccess = checked;
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 抢单成功后暂停:', checked);
        }
        // 更新暂停时长输入框的显示状态
        pauseDurationInput.style.display = checked ? 'block' : 'none';
      }
    );

    // 暂停时长输入框
    const pauseDurationInput = document.createElement('div');
    pauseDurationInput.style.cssText = `
            margin-top: 8px;
            margin-left: 24px;
            display: ${tempSettings.pauseAfterSuccess ? 'block' : 'none'};
        `;
    pauseDurationInput.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">暂停时长:</span>
                <input type="number"
                    class="ant-input pause-duration-input"
                    style="width: 80px;"
                    min="1"
                    max="3600"
                    value="${tempSettings.pauseDuration}"
                >
                <span style="margin-left: 8px;">秒</span>
                <span style="margin-left: 12px; color: #999; font-size: 12px;">抢单成功后等待指定时间再继续</span>
            </div>
        `;

    // 监听暂停时长变更
    const durationInput = pauseDurationInput.querySelector('.pause-duration-input');
    durationInput.addEventListener('change', (e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value) || value < 1) value = 1;
      if (value > 3600) value = 3600;
      tempSettings.pauseDuration = value;
      e.target.value = value;
      if (ENABLE_DEBUG_LOG) {
        console.log('临时设置更新 - 暂停时长:', value);
      }
    });

    pauseAfterSuccessContainer.appendChild(pauseAfterSuccessSwitch);
    pauseAfterSuccessContainer.appendChild(pauseDurationInput);

    // 自动刷新设置区域
    const autoRefreshContainer = document.createElement('div');
    autoRefreshContainer.style.cssText = 'margin-bottom: 16px;';

    // 自动刷新开关
    const autoRefreshSwitch = createSettingSwitch(
      '自动刷新运单',
      tempSettings.enableAutoRefresh,
      (checked) => {
        tempSettings.enableAutoRefresh = checked;
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 自动刷新运单:', checked);
        }

        // 只更新UI显示，不实际应用设置
        if (checked) {
          autoRefreshIntervalInput.style.display = 'block';
          refreshModeSelector.style.display = 'block';
        } else {
          autoRefreshIntervalInput.style.display = 'none';
          refreshModeSelector.style.display = 'none';
        }
      }
    );

    // 刷新间隔输入框
    const autoRefreshIntervalInput = document.createElement('div');
    autoRefreshIntervalInput.style.cssText = `
            margin-top: 8px;
            margin-left: 24px;
            display: ${tempSettings.enableAutoRefresh ? 'block' : 'none'};
        `;
    autoRefreshIntervalInput.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">刷新间隔:</span>
                <input type="number"
                    class="ant-input"
                    style="width: 80px;"
                    min="1"
                    max="3600"
                    value="${tempSettings.refreshInterval}"
                >
                <span style="margin-left: 8px;">秒</span>
            </div>
        `;

    // 监听间隔时间变更
    const intervalInput = autoRefreshIntervalInput.querySelector('input');
    intervalInput.addEventListener('change', (e) => {
      let value = parseFloat(e.target.value);
      if (isNaN(value)) value = 1;
      if (value > 3600) value = 3600;
      tempSettings.refreshInterval = value;
      e.target.value = value;
      if (ENABLE_DEBUG_LOG) {
        console.log('临时设置更新 - 刷新间隔:', value);
      }
    });

    // 刷新模式选择器
    const refreshModeSelector = document.createElement('div');
    refreshModeSelector.style.cssText = `
            margin-top: 12px;
            margin-left: 24px;
            padding: 12px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            background: #fafafa;
            display: ${tempSettings.enableAutoRefresh ? 'block' : 'none'};
        `;

    // 模式选择标题
    const modeTitle = document.createElement('div');
    modeTitle.style.cssText =
      'font-size: 13px; font-weight: 500; color: #262626; margin-bottom: 8px;';
    modeTitle.textContent = '刷新方式：';

    // 模式选择容器
    const modeOptions = document.createElement('div');
    modeOptions.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    // 点击模式选项
    const clickModeOption = document.createElement('label');
    clickModeOption.style.cssText =
      'display: flex; align-items: flex-start; cursor: pointer; font-size: 12px;';
    clickModeOption.innerHTML = `
            <input type="radio" name="refreshMode" value="click" ${tempSettings.refreshMode === 'click' ? 'checked' : ''}
                   style="margin-right: 8px; margin-top: 2px;">
            <div>
                <div style="font-weight: 500; color: #262626; margin-bottom: 2px;">
                    通过自动点击【运单助手设置】按钮进行刷新
                </div>
                <div style="color: #666; font-size: 11px;">
                    需要一直停留在【抢单】界面
                </div>
            </div>
        `;

    // API模式选项
    const apiModeOption = document.createElement('label');
    apiModeOption.style.cssText =
      'display: flex; align-items: flex-start; cursor: pointer; font-size: 12px;';
    apiModeOption.innerHTML = `
            <input type="radio" name="refreshMode" value="api" ${tempSettings.refreshMode === 'api' ? 'checked' : ''}
                   style="margin-right: 8px; margin-top: 2px;">
            <div>
                <div style="font-weight: 500; color: #262626; margin-bottom: 2px;">
                    直接通过访问服务器获取运单信息（⚠️存在封号风险，请谨慎选择）
                </div>
                <div style="color: #666; font-size: 11px;">
                    抢单界面将不会自动刷新，不影响手动刷新
                </div>
            </div>
        `;

    // 绑定模式切换事件
    const clickRadio = clickModeOption.querySelector('input[type="radio"]');
    const apiRadio = apiModeOption.querySelector('input[type="radio"]');

    clickRadio.addEventListener('change', () => {
      if (clickRadio.checked) {
        tempSettings.refreshMode = 'click';
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 刷新模式:', 'click');
        }
      }
    });

    apiRadio.addEventListener('change', () => {
      if (apiRadio.checked) {
        tempSettings.refreshMode = 'api';
        if (ENABLE_DEBUG_LOG) {
          console.log('临时设置更新 - 刷新模式:', 'api');
        }
      }
    });

    modeOptions.appendChild(clickModeOption);
    modeOptions.appendChild(apiModeOption);
    refreshModeSelector.appendChild(modeTitle);
    refreshModeSelector.appendChild(modeOptions);

    autoRefreshContainer.appendChild(autoRefreshSwitch);
    autoRefreshContainer.appendChild(autoRefreshIntervalInput);
    autoRefreshContainer.appendChild(refreshModeSelector);

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; gap: 8px;';

    // 左侧导入导出按钮组
    const importExportGroup = document.createElement('div');
    importExportGroup.style.cssText = 'display: flex; gap: 8px;';

    // 导出配置按钮
    const exportBtn = document.createElement('button');
    exportBtn.className = 'ant-btn';
    exportBtn.style.cssText = 'color: #1890ff; border-color: #1890ff;';
    exportBtn.innerHTML = '📤 导出配置';
    exportBtn.onclick = () => {
      exportConfiguration();
    };

    // 导入配置按钮
    const importBtn = document.createElement('button');
    importBtn.className = 'ant-btn';
    importBtn.style.cssText = 'color: #52c41a; border-color: #52c41a;';
    importBtn.innerHTML = '📥 导入配置';
    importBtn.onclick = () => {
      importConfiguration(tempSettings);
    };

    importExportGroup.appendChild(exportBtn);
    importExportGroup.appendChild(importBtn);

    // 右侧操作按钮组
    const actionGroup = document.createElement('div');
    actionGroup.style.cssText = 'display: flex; gap: 8px;';

    // 取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ant-btn';
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      if (ENABLE_DEBUG_LOG) {
        console.log('用户取消设置修改，临时设置被丢弃');
      }
      document.body.removeChild(modalContainer);
    };

    // 保存按钮
    const saveBtn = document.createElement('button');
    saveBtn.className = 'ant-btn ant-btn-primary';
    saveBtn.textContent = '保存';
    saveBtn.onclick = () => {
      if (ENABLE_DEBUG_LOG) {
        console.log('=== 开始保存设置 ===');
      }
      if (ENABLE_DEBUG_LOG) {
        console.log('保存前 - 当前settings:', JSON.stringify(settings, null, 2));
      }
      if (ENABLE_DEBUG_LOG) {
        console.log('保存后 - 应用后的settings:', JSON.stringify(tempSettings, null, 2));
      }

      // 应用临时设置到实际设置
      const oldSettings = { ...settings };
      settings = { ...tempSettings };

      // 立即保存设置
      saveSettings();

      // 验证保存是否成功
      setTimeout(() => {
        if (ENABLE_DEBUG_LOG) {
          console.log('验证保存结果:');
        }
        const currentStorageSettings = localStorage.getItem(SETTINGS_KEY);
        if (ENABLE_DEBUG_LOG) {
          console.log('localStorage中的当前设置:', currentStorageSettings);
        }
        if (ENABLE_DEBUG_LOG) {
          console.log('=== 保存设置完成 ===');
        }
      }, 100);

      // 检查需要特殊处理的设置变更
      if (oldSettings.skipGrabConfirm !== settings.skipGrabConfirm && isOnGrabOrderTab()) {
        setupGrabButtons();
      }

      if (oldSettings.enableAutoRefresh !== settings.enableAutoRefresh) {
        const pauseBtn = document.querySelector('.refresh-pause-btn');
        if (pauseBtn) {
          pauseBtn.style.display = settings.enableAutoRefresh ? 'inline-flex' : 'none';
        }

        if (settings.enableAutoRefresh) {
          if (window.autoRefreshControl) {
            window.autoRefreshControl.start();
          }
        } else {
          if (window.autoRefreshControl) {
            window.autoRefreshControl.stop();
          }
          isRefreshPaused = false;
        }
      }

      if (
        oldSettings.refreshInterval !== settings.refreshInterval &&
        settings.enableAutoRefresh &&
        window.autoRefreshControl
      ) {
        window.autoRefreshControl.start();
      }

      // 处理刷新模式变化
      if (oldSettings.refreshMode !== settings.refreshMode) {
        if (ENABLE_DEBUG_LOG) {
          console.log('刷新模式已更新:', oldSettings.refreshMode, '->', settings.refreshMode);
        }
        // 如果自动刷新正在运行，重启以应用新模式
        if (settings.enableAutoRefresh && window.autoRefreshControl) {
          window.autoRefreshControl.start();
        }
      }

      // 处理刷新模式变化
      if (oldSettings.refreshMode !== settings.refreshMode) {
        if (ENABLE_DEBUG_LOG) {
          console.log('刷新模式已更新:', oldSettings.refreshMode, '->', settings.refreshMode);
        }
        // 如果自动刷新正在运行，重启以应用新模式
        if (settings.enableAutoRefresh && window.autoRefreshControl) {
          window.autoRefreshControl.start();
        }
      }

      // 处理目的地匹配功能的状态变化
      if (oldSettings.enableDestinationMatch !== settings.enableDestinationMatch) {
        if (
          settings.enableDestinationMatch &&
          (destinationConfig.whitelist.length > 0 || destinationConfig.blacklist.length > 0)
        ) {
          createMatchInfoPanel();
        } else {
          // 关闭目的地匹配功能，清理相关状态
          matchedOrders.clear();
          if (matchInfoPanel) {
            matchInfoPanel.style.display = 'none';
          }
        }
      }

      document.body.removeChild(modalContainer);
      if (ENABLE_DEBUG_LOG) {
        console.log('设置已保存并应用，无需刷新页面');
      }

      // 显示保存成功提示
      const toast = document.createElement('div');
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #52c41a;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            `;
      toast.textContent = '✅ 设置已保存';
      document.body.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
    };

    // 组装按钮容器
    actionGroup.appendChild(cancelBtn);
    actionGroup.appendChild(saveBtn);
    buttonContainer.appendChild(importExportGroup);
    buttonContainer.appendChild(actionGroup);

    // 组装模态框
    //settingsContent.appendChild(autoGrabSwitch);
    //settingsContent.appendChild(countdownSwitch);
    settingsContent.appendChild(skipConfirmSwitch);
    settingsContent.appendChild(autoGrabContainer);
    settingsContent.appendChild(pauseAfterSuccessContainer);
    settingsContent.appendChild(autoRefreshContainer);
    modalContent.appendChild(title);
    modalContent.appendChild(settingsContent);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);

    // 显示模态框
    document.body.appendChild(modalContainer);

    if (ENABLE_DEBUG_LOG) {
      console.log('设置弹窗已打开，当前设置:', settings);
    }
  }

  // 显示抢单规则配置弹窗
  function showGrabRulesModal(parentSettings) {
    // 创建模态框容器
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            min-width: 600px;
            max-width: 800px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-height: 80vh;
            overflow-y: auto;
        `;

    // 标题
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; font-weight: 500;';
    title.textContent = '配置自动抢单规则';
    // 提示
    const tip = document.createElement('div');
    tip.style.cssText = 'margin-bottom: 16px; font-size: 12px; color: #999;';
    tip.innerHTML = `
            规则说明：<br>
            1. 首先依次按照顺序查看【跳过规则】内的所有规则是否满足，满足则直接跳过。<br>
            2. 接着依次按照顺序查看【抢单规则】内的所有规则是否满足，满足则进行抢单。<br>
            3.【跳过规则】和【抢单规则】内的规则顺序在前面的优先级要高于后面的，因此可以将希望有限匹配的规则放在前面。<br>
            4. 可以直接通过拖拽规则项来调整规则顺序。<br>
        `;
    // 创建临时规则副本
    let tempRules = {
      enabled: grabRules.enabled,
      rules: JSON.parse(JSON.stringify(grabRules.rules || [])),
    };

    // 规则列表容器
    const rulesListContainer = document.createElement('div');
    rulesListContainer.style.cssText = 'margin-bottom: 20px;';

    const rulesListLabel = document.createElement('div');
    rulesListLabel.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626;';
    rulesListLabel.textContent = '规则列表：';

    const rulesList = document.createElement('div');
    rulesList.style.cssText = `
            min-height: 200px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            padding: 12px;
            background: #fafafa;
        `;

    // 渲染规则列表
    function renderRulesList() {
      rulesList.innerHTML = '';

      if (tempRules.rules.length === 0) {
        const emptyTip = document.createElement('div');
        emptyTip.style.cssText =
          'color: #999; font-size: 14px; width: 100%; text-align: center; padding: 60px 20px;';
        emptyTip.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                    <div style="margin-bottom: 8px;">暂无抢单规则</div>
                    <div style="font-size: 12px;">点击下方"添加规则"按钮创建新规则</div>
                `;
        rulesList.appendChild(emptyTip);
        return;
      }

      // 按 action 分组
      const grabRules = tempRules.rules.filter(rule => rule.action === 'grab' || !rule.action);
      const skipRules = tempRules.rules.filter(rule => rule.action === 'skip');

      // 渲染跳过规则组（优先匹配）
      if (skipRules.length > 0) {
        const skipGroup = createRuleGroup('skip', skipRules, '🚫 跳过规则（优先匹配）', '#ff4d4f');
        rulesList.appendChild(skipGroup);
      }

      // 渲染抢单规则组
      if (grabRules.length > 0) {
        const grabGroup = createRuleGroup('grab', grabRules, '✅ 抢单规则', '#52c41a');
        rulesList.appendChild(grabGroup);
      }
    }

    // 创建规则组
    function createRuleGroup(groupType, rules, title, color) {
      const groupContainer = document.createElement('div');
      groupContainer.style.cssText = `
        margin-bottom: 20px;
        padding: 12px;
        border: 2px solid ${color}33;
        border-radius: 8px;
        background: ${color}0a;
      `;

      // 组标题
      const groupHeader = document.createElement('div');
      groupHeader.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: ${color};
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px dashed ${color}66;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      groupHeader.innerHTML = `
        <span>${title} (共有 ${rules.length} 条)</span>
        <span style="font-size: 11px; font-weight: normal; color: #999;">可拖拽排序</span>
      `;

      groupContainer.appendChild(groupHeader);

      // 规则列表
      rules.forEach((rule, index) => {
        const actualIndex = tempRules.rules.indexOf(rule);
        const ruleItem = createDraggableRuleItem(rule, actualIndex, groupType);
        groupContainer.appendChild(ruleItem);
      });

      return groupContainer;
    }

    // 创建可拖拽的规则项
    function createDraggableRuleItem(rule, actualIndex, groupType) {
      const ruleItem = document.createElement('div');
      ruleItem.draggable = true;
      ruleItem.dataset.ruleIndex = actualIndex;
      ruleItem.dataset.groupType = groupType;
      ruleItem.style.cssText = `
        margin-bottom: 12px;
        padding: 16px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: white;
        transition: all 0.2s;
        cursor: move;
      `;

      // 拖拽事件
      ruleItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', actualIndex);
        ruleItem.style.opacity = '0.5';
      });

      ruleItem.addEventListener('dragend', (e) => {
        ruleItem.style.opacity = '1';
      });

      ruleItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetGroupType = e.currentTarget.dataset.groupType;
        const draggingElement = document.querySelector('[style*="opacity: 0.5"]');
        if (draggingElement && draggingElement.dataset.groupType === targetGroupType) {
          ruleItem.style.borderColor = '#1890ff';
          ruleItem.style.transform = 'translateY(-2px)';
        }
      });

      ruleItem.addEventListener('dragleave', (e) => {
        ruleItem.style.borderColor = '#d9d9d9';
        ruleItem.style.transform = 'none';
      });

      ruleItem.addEventListener('drop', (e) => {
        e.preventDefault();
        ruleItem.style.borderColor = '#d9d9d9';
        ruleItem.style.transform = 'none';

        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(e.currentTarget.dataset.ruleIndex);

        // 只允许同组内拖拽
        const fromRule = tempRules.rules[fromIndex];
        const toRule = tempRules.rules[toIndex];
        if ((fromRule.action || 'grab') !== (toRule.action || 'grab')) {
          return;
        }

        if (fromIndex !== toIndex) {
          // 移动规则
          const movedRule = tempRules.rules.splice(fromIndex, 1)[0];
          const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
          tempRules.rules.splice(adjustedToIndex, 0, movedRule);
          renderRulesList();
        }
      });

      ruleItem.addEventListener('mouseenter', () => {
        if (!ruleItem.style.opacity || ruleItem.style.opacity === '1') {
          ruleItem.style.borderColor = '#1890ff';
          ruleItem.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.15)';
        }
      });

      ruleItem.addEventListener('mouseleave', () => {
        if (!ruleItem.style.opacity || ruleItem.style.opacity === '1') {
          ruleItem.style.borderColor = '#d9d9d9';
          ruleItem.style.boxShadow = 'none';
        }
      });

      // 规则头部
      const ruleHeader = document.createElement('div');
      ruleHeader.style.cssText =
        'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';

      const ruleName = document.createElement('div');
      ruleName.style.cssText = 'font-size: 14px; font-weight: 500; color: #262626;';
      const actionIcon = rule.action === 'skip' ? '🚫' : '✅';
      const displayIndex = tempRules.rules.filter(r => (r.action || 'grab') === (rule.action || 'grab')).indexOf(rule) + 1;
      ruleName.innerHTML = `<span style="margin-right: 6px;">${actionIcon}</span>规则 ${displayIndex}${rule.name ? ': ' + rule.name : ''}`;

      const ruleActions = document.createElement('div');
      ruleActions.style.cssText = 'display: flex; gap: 8px;';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'ant-btn ant-btn-sm';
      editBtn.style.cssText = 'font-size: 12px; padding: 2px 8px;';
      editBtn.textContent = '编辑';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showRuleEditModal(rule, actualIndex, tempRules, renderRulesList);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'ant-btn ant-btn-sm';
      deleteBtn.style.cssText = 'font-size: 12px; padding: 2px 8px; color: #ff4d4f;';
      deleteBtn.textContent = '删除';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('确定要删除这条规则吗？')) {
          tempRules.rules.splice(actualIndex, 1);
          renderRulesList();
        }
      };

      ruleActions.appendChild(editBtn);
      ruleActions.appendChild(deleteBtn);
      ruleHeader.appendChild(ruleName);
      ruleHeader.appendChild(ruleActions);

      // 规则内容预览
      const rulePreview = document.createElement('div');
      rulePreview.style.cssText = 'font-size: 12px; color: #666; line-height: 1.6;';
      rulePreview.innerHTML = generateRulePreviewText(rule);

      ruleItem.appendChild(ruleHeader);
      ruleItem.appendChild(rulePreview);

      return ruleItem;
    }

    rulesListContainer.appendChild(rulesListLabel);
    rulesListContainer.appendChild(rulesList);

    // 添加规则按钮
    const addRuleBtn = document.createElement('button');
    addRuleBtn.type = 'button';
    addRuleBtn.className = 'ant-btn ant-btn-dashed';
    addRuleBtn.style.cssText = `
            width: 100%;
            margin-bottom: 20px;
            padding: 8px;
            border: 1px dashed #d9d9d9;
            background: white;
            color: #1890ff;
            cursor: pointer;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;
        `;
    addRuleBtn.innerHTML = '➕ 添加新规则';
    addRuleBtn.addEventListener('mouseenter', () => {
      addRuleBtn.style.borderColor = '#1890ff';
      addRuleBtn.style.background = '#f0f5ff';
    });
    addRuleBtn.addEventListener('mouseleave', () => {
      addRuleBtn.style.borderColor = '#d9d9d9';
      addRuleBtn.style.background = 'white';
    });
    addRuleBtn.onclick = () => {
      const newRule = {
        id: generateRuleId(),
        name: '',
        action: 'grab', // 默认为抢单
        conditions: [],
      };
      showRuleEditModal(newRule, -1, tempRules, renderRulesList);
    };

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px;';

    // 返回按钮
    const backBtn = document.createElement('button');
    backBtn.className = 'ant-btn';
    backBtn.textContent = '返回';
    backBtn.onclick = () => {
      document.body.removeChild(modalContainer);
    };

    // 保存按钮
    const saveBtn = document.createElement('button');
    saveBtn.className = 'ant-btn ant-btn-primary';
    saveBtn.textContent = '保存';
    saveBtn.onclick = () => {
      if (ENABLE_DEBUG_LOG) {
        console.log('保存抢单规则:', tempRules);
      }

      // 应用临时规则到全局规则
      grabRules = { ...tempRules };
      saveGrabRules();

      // 显示保存成功提示
      const toast = document.createElement('div');
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #52c41a;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            `;
      toast.textContent = `✅ 规则已保存（共 ${tempRules.rules.length} 条）`;
      document.body.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);

      // 关闭弹窗
      backBtn.click();
    };

    buttonContainer.appendChild(backBtn);
    buttonContainer.appendChild(saveBtn);

    // 组装模态框
    modalContent.appendChild(title);
    modalContent.appendChild(tip);
    modalContent.appendChild(rulesListContainer);
    modalContent.appendChild(addRuleBtn);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);

    // 初始渲染
    renderRulesList();

    // 点击遮罩层关闭弹窗
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        backBtn.click();
      }
    });

    // 显示模态框
    document.body.appendChild(modalContainer);
  }

  // 生成规则预览文本
  function generateRulePreviewText(rule) {
    if (!rule.conditions || rule.conditions.length === 0) {
      return '<div style="color: #999;">暂无条件</div>';
    }

    const parts = [];

    // 添加动作说明
    const actionText = rule.action === 'skip'
      ? '<span style="color: #ff4d4f; font-weight: 600; margin-right: 8px;">跳过条件：</span>'
      : '<span style="color: #52c41a; font-weight: 600; margin-right: 8px;">抢单条件：</span>';
    parts.push(actionText);

    rule.conditions.forEach((condition, index) => {
      parts.push(generateConditionText(condition));

      // 不是最后一个条件时，添加逻辑关系
      if (index < rule.conditions.length - 1) {
        const logic = condition.logic === 'OR'
          ? ' <span style="color: #ff4d4f; font-weight: 500;">或者</span> '
          : ' <span style="color: #52c41a; font-weight: 500;">并且</span> ';
        parts.push(logic);
      }
    });

    return parts.join('');
  }

  // 生成单个条件的文本描述
  function generateConditionText(condition) {
    const fieldNames = {
      destination: '目的地',
      note: '备注',
      weight: '重量',
      dispatcher: '调度员',
      customerPhone: '客户电话',
    };

    const matchTypeNames = {
      contains: '包含',
      equals: '等于',
      notContains: '不包含',
      gt: '大于',
      lt: '小于',
      gte: '大于等于',
      lte: '小于等于',
      range: '在范围内',
    };

    const fieldName = fieldNames[condition.field] || condition.field;
    const matchTypeName = matchTypeNames[condition.matchType] || condition.matchType;

    if (condition.matchType === 'range') {
      return `${fieldName}${matchTypeName}[${condition.rangeMin}-${condition.rangeMax}]`;
    }

    // 对于包含和不包含类型，检查是否有多个关键字
    if (condition.matchType === 'contains' || condition.matchType === 'notContains') {
      const keywords = String(condition.value || '').split('，').map(k => k.trim()).filter(k => k);
      if (keywords.length > 1) {
        // 多个关键字，显示为：目的地包含"太阳"或"月亮"或"地球"
        const keywordsText = keywords.map(k => `"${k}"`).join('或者');
        return `${fieldName}${matchTypeName}${keywordsText}`;
      }
    }

    return `${fieldName}${matchTypeName}"${condition.value}"`;
  }

  // 显示规则编辑弹窗
  function showRuleEditModal(rule, ruleIndex, tempRules, refreshCallback) {
    // 创建模态框容器
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;

    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            min-width: 700px;
            max-width: 900px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        `;

    // 标题
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 16px; font-weight: 500;';
    title.textContent = ruleIndex === -1 ? '添加新规则' : '编辑规则';

    // 创建临时规则副本
    let tempRule = JSON.parse(JSON.stringify(rule));

    // 确保 conditions 数组存在
    if (!tempRule.conditions) {
      tempRule.conditions = [];
    }

    // 规则名称输入
    const nameContainer = document.createElement('div');
    nameContainer.style.cssText = 'margin-bottom: 20px;';

    const nameLabel = document.createElement('div');
    nameLabel.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626;';
    nameLabel.textContent = '规则名称（可选）：';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'ant-input';
    nameInput.placeholder = '例如：北京地区重货订单';
    nameInput.value = tempRule.name || '';
    nameInput.style.cssText = 'width: 100%; padding: 8px 12px;';
    nameInput.addEventListener('input', (e) => {
      tempRule.name = e.target.value;
    });

    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInput);

    // 规则动作选择
    const actionContainer = document.createElement('div');
    actionContainer.style.cssText = 'margin-bottom: 20px;';

    const actionLabel = document.createElement('div');
    actionLabel.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626;';
    actionLabel.innerHTML = '规则满足时需要：<span style="color: #999; font-size: 12px; font-weight: normal; margin-left: 4px;">选择匹配此规则的订单应该被抢单还是跳过</span>';

    const actionSelector = document.createElement('div');
    actionSelector.style.cssText = `
            display: flex;
            gap: 12px;
            padding: 12px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            background: #fafafa;
        `;

    // 抢单选项
    const grabOption = document.createElement('label');
    grabOption.style.cssText = `
            flex: 1;
            display: flex;
            align-items: center;
            padding: 12px;
            border: 2px solid ${tempRule.action === 'grab' || !tempRule.action ? '#52c41a' : '#d9d9d9'};
            border-radius: 6px;
            background: ${tempRule.action === 'grab' || !tempRule.action ? '#f6ffed' : 'white'};
            cursor: pointer;
            transition: all 0.2s;
        `;
    grabOption.innerHTML = `
            <input type="radio" name="ruleAction" value="grab" ${tempRule.action === 'grab' || !tempRule.action ? 'checked' : ''}
                   style="margin-right: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 500; color: #262626; margin-bottom: 4px; display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 6px;">✅</span>
                    <span>抢单</span>
                </div>
                <div style="color: #666; font-size: 12px;">
                    满足条件时自动抢单
                </div>
            </div>
        `;

    // 跳过选项
    const skipOption = document.createElement('label');
    skipOption.style.cssText = `
            flex: 1;
            display: flex;
            align-items: center;
            padding: 12px;
            border: 2px solid ${tempRule.action === 'skip' ? '#ff4d4f' : '#d9d9d9'};
            border-radius: 6px;
            background: ${tempRule.action === 'skip' ? '#fff2f0' : 'white'};
            cursor: pointer;
            transition: all 0.2s;
        `;
    skipOption.innerHTML = `
            <input type="radio" name="ruleAction" value="skip" ${tempRule.action === 'skip' ? 'checked' : ''}
                   style="margin-right: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 500; color: #262626; margin-bottom: 4px; display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 6px;">🚫</span>
                    <span>跳过</span>
                </div>
                <div style="color: #666; font-size: 12px;">
                    满足条件时直接跳过不抢单
                </div>
            </div>
        `;

    // 绑定动作切换事件
    const grabRadio = grabOption.querySelector('input[type="radio"]');
    const skipRadio = skipOption.querySelector('input[type="radio"]');

    grabRadio.addEventListener('change', () => {
      if (grabRadio.checked) {
        tempRule.action = 'grab';
        grabOption.style.borderColor = '#52c41a';
        grabOption.style.background = '#f6ffed';
        skipOption.style.borderColor = '#d9d9d9';
        skipOption.style.background = 'white';
      }
    });

    skipRadio.addEventListener('change', () => {
      if (skipRadio.checked) {
        tempRule.action = 'skip';
        skipOption.style.borderColor = '#ff4d4f';
        skipOption.style.background = '#fff2f0';
        grabOption.style.borderColor = '#d9d9d9';
        grabOption.style.background = 'white';
      }
    });

    actionSelector.appendChild(grabOption);
    actionSelector.appendChild(skipOption);
    actionContainer.appendChild(actionLabel);
    actionContainer.appendChild(actionSelector);

    // 条件列表容器
    const conditionsContainer = document.createElement('div');
    conditionsContainer.style.cssText = 'margin-bottom: 20px;';

    const conditionsLabel = document.createElement('div');
    conditionsLabel.style.cssText = 'margin-bottom: 12px; font-weight: 500; color: #262626;';
    conditionsLabel.textContent = '条件列表：';

    const conditionsList = document.createElement('div');
    conditionsList.style.cssText = `
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            padding: 16px;
            background: #fafafa;
            min-height: 150px;
        `;

    // 渲染条件列表
    function renderConditions() {
      conditionsList.innerHTML = '';

      if (!tempRule.conditions || tempRule.conditions.length === 0) {
        const emptyTip = document.createElement('div');
        emptyTip.style.cssText = 'color: #999; font-size: 14px; text-align: center; padding: 40px 20px;';
        emptyTip.innerHTML = `
                    <div style="font-size: 32px; margin-bottom: 12px;">📝</div>
                    <div>暂无条件</div>
                    <div style="font-size: 12px; margin-top: 8px;">点击下方"添加条件"按钮创建</div>
                `;
        conditionsList.appendChild(emptyTip);
        return;
      }

      tempRule.conditions.forEach((condition, condIndex) => {
        // 条件项容器
        const conditionItem = document.createElement('div');
        conditionItem.style.cssText = 'margin-bottom: 12px;';

        // 条件内容
        const conditionContent = document.createElement('div');
        conditionContent.style.cssText = `
                    background: white;
                    border: 1px solid #d9d9d9;
                    border-radius: 6px;
                    padding: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

        const conditionText = document.createElement('div');
        conditionText.style.cssText = 'font-size: 13px; color: #262626; flex: 1;';
        conditionText.textContent = generateConditionText(condition);

        const conditionActions = document.createElement('div');
        conditionActions.style.cssText = 'display: flex; gap: 8px;';

        // 编辑按钮
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'ant-btn ant-btn-sm';
        editBtn.style.cssText = 'font-size: 12px; padding: 2px 8px;';
        editBtn.textContent = '编辑';
        editBtn.onclick = () => {
          showConditionEditModal(condition, condIndex, tempRule, renderConditions);
        };

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'ant-btn ant-btn-sm';
        deleteBtn.style.cssText = 'font-size: 12px; padding: 2px 8px; color: #ff4d4f;';
        deleteBtn.textContent = '删除';
        deleteBtn.onclick = () => {
          tempRule.conditions.splice(condIndex, 1);
          renderConditions();
        };

        conditionActions.appendChild(editBtn);
        conditionActions.appendChild(deleteBtn);
        conditionContent.appendChild(conditionText);
        conditionContent.appendChild(conditionActions);
        conditionItem.appendChild(conditionContent);

        // 如果不是最后一个条件，添加逻辑选择器
        if (condIndex < tempRule.conditions.length - 1) {
          const logicSelector = document.createElement('div');
          logicSelector.style.cssText = `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 8px 0;
                        gap: 12px;
                    `;

          const andRadio = document.createElement('label');
          andRadio.style.cssText = 'display: flex; align-items: center; cursor: pointer; font-size: 13px;';
          andRadio.innerHTML = `
                        <input type="radio" name="logic_${condIndex}" value="AND"
                               ${condition.logic !== 'OR' ? 'checked' : ''}
                               style="margin-right: 4px;">
                        <span style="color: #52c41a; font-weight: 500;">并且</span>
                    `;
          andRadio.querySelector('input').addEventListener('change', () => {
            condition.logic = 'AND';
          });

          const orRadio = document.createElement('label');
          orRadio.style.cssText = 'display: flex; align-items: center; cursor: pointer; font-size: 13px;';
          orRadio.innerHTML = `
                        <input type="radio" name="logic_${condIndex}" value="OR"
                               ${condition.logic === 'OR' ? 'checked' : ''}
                               style="margin-right: 4px;">
                        <span style="color: #ff4d4f; font-weight: 500;">或者</span>
                    `;
          orRadio.querySelector('input').addEventListener('change', () => {
            condition.logic = 'OR';
          });

          logicSelector.appendChild(andRadio);
          logicSelector.appendChild(orRadio);
          conditionItem.appendChild(logicSelector);
        }

        conditionsList.appendChild(conditionItem);
      });
    }

    conditionsContainer.appendChild(conditionsLabel);
    conditionsContainer.appendChild(conditionsList);

    // 添加条件按钮
    const addConditionBtn = document.createElement('button');
    addConditionBtn.type = 'button';
    addConditionBtn.className = 'ant-btn ant-btn-dashed';
    addConditionBtn.style.cssText = `
            width: 100%;
            margin-top: 12px;
            margin-bottom: 20px;
            padding: 8px;
            border: 1px dashed #d9d9d9;
            background: white;
            color: #1890ff;
            cursor: pointer;
            border-radius: 6px;
            font-size: 14px;
        `;
    addConditionBtn.innerHTML = '➕ 添加条件';
    addConditionBtn.onclick = () => {
      showConditionEditModal(null, -1, tempRule, renderConditions);
    };

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;';

    // 取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ant-btn';
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      document.body.removeChild(modalContainer);
    };

    // 确定按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'ant-btn ant-btn-primary';
    confirmBtn.textContent = '确定';
    confirmBtn.onclick = () => {
      // 验证：至少要有一个条件
      if (!tempRule.conditions || tempRule.conditions.length === 0) {
        alert('请至少添加一个条件！');
        return;
      }

      // 验证：目的地条件必须存在
      const hasDestination = tempRule.conditions.some(c => c.field === 'destination');
      if (!hasDestination) {
        alert('每条规则必须包含至少一个目的地条件！');
        return;
      }

      // 确保action字段存在
      if (!tempRule.action) {
        tempRule.action = 'grab';
      }

      // 保存规则
      if (ruleIndex === -1) {
        // 新增规则
        tempRules.rules.push(tempRule);
      } else {
        // 更新规则
        tempRules.rules[ruleIndex] = tempRule;
      }

      refreshCallback();
      document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(confirmBtn);

    // 组装模态框
    modalContent.appendChild(title);
    modalContent.appendChild(nameContainer);
    modalContent.appendChild(actionContainer);
    modalContent.appendChild(conditionsContainer);
    modalContent.appendChild(addConditionBtn);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);

    // 初始渲染
    renderConditions();

    // 点击遮罩层关闭弹窗
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        if (confirm('确定要放弃编辑吗？')) {
          document.body.removeChild(modalContainer);
        }
      }
    });

    // 显示模态框
    document.body.appendChild(modalContainer);
  }

  // 显示条件编辑弹窗
  function showConditionEditModal(condition, condIndex, rule, refreshCallback) {
    // 创建模态框容器
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;

    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            min-width: 500px;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

    // 标题
    const title = document.createElement('h4');
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 15px; font-weight: 500;';
    title.textContent = condIndex === -1 ? '添加条件' : '编辑条件';

    // 创建临时条件副本
    let tempCondition = condition ? JSON.parse(JSON.stringify(condition)) : {
      field: 'destination',
      matchType: 'contains',
      value: '',
      logic: 'AND',  // 默认逻辑关系
    };

    const formContainer = document.createElement('div');

    // 字段选择
    const fieldGroup = createFormGroup('条件字段', createFieldSelect(tempCondition, formContainer));

    formContainer.appendChild(fieldGroup);

    // 动态渲染匹配类型和值输入
    function renderMatchTypeAndValue() {
      // 移除旧的匹配类型和值输入
      const oldMatchType = formContainer.querySelector('.match-type-group');
      const oldValue = formContainer.querySelector('.value-group');
      if (oldMatchType) oldMatchType.remove();
      if (oldValue) oldValue.remove();

      // 根据字段类型添加新的输入
      if (tempCondition.field === 'weight') {
        formContainer.appendChild(createWeightMatchTypeSelect(tempCondition));
        formContainer.appendChild(createWeightValueInput(tempCondition));
      } else {
        formContainer.appendChild(createStringMatchTypeSelect(tempCondition));
        formContainer.appendChild(createStringValueInput(tempCondition));
      }
    }

    renderMatchTypeAndValue();

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ant-btn';
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      document.body.removeChild(modalContainer);
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'ant-btn ant-btn-primary';
    confirmBtn.textContent = '确定';
    confirmBtn.onclick = () => {
      // 验证
      if (tempCondition.matchType === 'range') {
        if (!tempCondition.rangeMin && tempCondition.rangeMin !== 0) {
          alert('请输入范围最小值！');
          return;
        }
        if (!tempCondition.rangeMax && tempCondition.rangeMax !== 0) {
          alert('请输入范围最大值！');
          return;
        }
        if (parseFloat(tempCondition.rangeMin) >= parseFloat(tempCondition.rangeMax)) {
          alert('最小值必须小于最大值！');
          return;
        }
      } else {
        if (!tempCondition.value && tempCondition.value !== 0) {
          alert('请输入匹配值！');
          return;
        }
      }

      // 确保条件数组存在
      if (!rule.conditions) {
        rule.conditions = [];
      }

      // 保存条件
      if (condIndex === -1) {
        // 新增条件，默认逻辑关系为 AND
        if (!tempCondition.logic) {
          tempCondition.logic = 'AND';
        }
        rule.conditions.push(tempCondition);
      } else {
        // 更新条件，保留原有的逻辑关系
        rule.conditions[condIndex] = tempCondition;
      }

      refreshCallback();
      document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(confirmBtn);

    modalContent.appendChild(title);
    modalContent.appendChild(formContainer);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);
  }

  // 创建表单组
  function createFormGroup(label, inputElement) {
    const group = document.createElement('div');
    group.style.cssText = 'margin-bottom: 16px;';

    const labelEl = document.createElement('div');
    labelEl.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
    labelEl.textContent = label + '：';

    group.appendChild(labelEl);
    group.appendChild(inputElement);

    return group;
  }

  // 创建字段选择下拉框
  function createFieldSelect(tempCondition, formContainer) {
    const select = document.createElement('select');
    select.className = 'ant-input';
    select.style.cssText = 'width: 100%; padding: 8px 12px;';

    const fields = [
      { value: 'destination', label: '目的地' },
      { value: 'note', label: '备注' },
      { value: 'weight', label: '预估重量' },
      { value: 'dispatcher', label: '调度员' },
      { value: 'customerPhone', label: '客户电话' },
    ];

    fields.forEach(field => {
      const option = document.createElement('option');
      option.value = field.value;
      option.textContent = field.label;
      option.selected = tempCondition.field === field.value;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      tempCondition.field = e.target.value;
      // 重置匹配类型和值
      if (tempCondition.field === 'weight') {
        tempCondition.matchType = 'gt';
        tempCondition.value = '';
      } else if (tempCondition.field === 'dispatcher' || tempCondition.field === 'customerPhone') {
        tempCondition.matchType = 'equals';
        tempCondition.value = '';
      } else {
        tempCondition.matchType = 'contains';
        tempCondition.value = '';
      }
      // 重新渲染匹配类型和值输入
      const oldMatchType = formContainer.querySelector('.match-type-group');
      const oldValue = formContainer.querySelector('.value-group');
      if (oldMatchType) oldMatchType.remove();
      if (oldValue) oldValue.remove();

      if (tempCondition.field === 'weight') {
        formContainer.appendChild(createWeightMatchTypeSelect(tempCondition));
        formContainer.appendChild(createWeightValueInput(tempCondition));
      } else {
        formContainer.appendChild(createStringMatchTypeSelect(tempCondition));
        formContainer.appendChild(createStringValueInput(tempCondition));
      }
    });

    return select;
  }

  // 创建字符串匹配类型选择
  function createStringMatchTypeSelect(tempCondition) {
    const group = document.createElement('div');
    group.className = 'match-type-group';
    group.style.cssText = 'margin-bottom: 16px;';

    const label = document.createElement('div');
    label.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
    label.textContent = '匹配方式：';

    const select = document.createElement('select');
    select.className = 'ant-input';
    select.style.cssText = 'width: 100%; padding: 8px 12px;';

    const matchTypes = tempCondition.field === 'dispatcher' || tempCondition.field === 'customerPhone'
      ? [{ value: 'equals', label: '等于' }]
      : [
          { value: 'contains', label: '包含关键字' },
          { value: 'equals', label: '等于' },
          { value: 'notContains', label: '不包含关键字' },
        ];

    matchTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.textContent = type.label;
      option.selected = tempCondition.matchType === type.value;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      tempCondition.matchType = e.target.value;

      // 更新值输入框的placeholder
      const valueInput = group.parentElement.querySelector('.value-group input[type="text"]');
      if (valueInput) {
        if (e.target.value === 'contains' || e.target.value === 'notContains') {
          valueInput.placeholder = '请输入匹配值（多个关键字用中文逗号"，"分隔）';
        } else {
          valueInput.placeholder = '请输入匹配值';
        }
      }
    });

    group.appendChild(label);
    group.appendChild(select);

    return group;
  }

  // 创建重量匹配类型选择
  function createWeightMatchTypeSelect(tempCondition) {
    const group = document.createElement('div');
    group.className = 'match-type-group';
    group.style.cssText = 'margin-bottom: 16px;';

    const label = document.createElement('div');
    label.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
    label.textContent = '匹配方式：';

    const select = document.createElement('select');
    select.className = 'ant-input';
    select.style.cssText = 'width: 100%; padding: 8px 12px;';

    const matchTypes = [
      { value: 'equals', label: '等于' },
      { value: 'gt', label: '大于' },
      { value: 'lt', label: '小于' },
      { value: 'gte', label: '大于等于' },
      { value: 'lte', label: '小于等于' },
      { value: 'range', label: '在范围内' },
    ];

    matchTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.textContent = type.label;
      option.selected = tempCondition.matchType === type.value;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      tempCondition.matchType = e.target.value;
      // 重新渲染值输入
      const oldValue = document.querySelector('.value-group');
      if (oldValue) {
        const newValue = createWeightValueInput(tempCondition);
        oldValue.parentNode.replaceChild(newValue, oldValue);
      }
    });

    group.appendChild(label);
    group.appendChild(select);

    return group;
  }

  // 创建字符串值输入
  function createStringValueInput(tempCondition) {
    const group = document.createElement('div');
    group.className = 'value-group';
    group.style.cssText = 'margin-bottom: 16px;';

    const label = document.createElement('div');
    label.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
    label.textContent = '匹配值：';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ant-input';
    input.placeholder = tempCondition.matchType == 'contains' 
      || tempCondition.matchType == 'notContains' ? '请输入匹配值（多个关键字用中文逗号”，“分隔）' : '请输入匹配值';
    input.value = tempCondition.value || '';
    input.style.cssText = 'width: 100%; padding: 8px 12px;';
    input.addEventListener('input', (e) => {
      tempCondition.value = e.target.value;
    });

    group.appendChild(label);
    group.appendChild(input);

    return group;
  }

  // 创建重量值输入
  function createWeightValueInput(tempCondition) {
    const group = document.createElement('div');
    group.className = 'value-group';
    group.style.cssText = 'margin-bottom: 16px;';

    if (tempCondition.matchType === 'range') {
      const label = document.createElement('div');
      label.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
      label.textContent = '重量范围：';

      const rangeContainer = document.createElement('div');
      rangeContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

      const minInput = document.createElement('input');
      minInput.type = 'number';
      minInput.className = 'ant-input';
      minInput.placeholder = '最小值';
      minInput.value = tempCondition.rangeMin || '';
      minInput.style.cssText = 'flex: 1; padding: 8px 12px;';
      minInput.addEventListener('input', (e) => {
        tempCondition.rangeMin = parseFloat(e.target.value);
      });

      const separator = document.createElement('span');
      separator.textContent = '-';
      separator.style.cssText = 'color: #666;';

      const maxInput = document.createElement('input');
      maxInput.type = 'number';
      maxInput.className = 'ant-input';
      maxInput.placeholder = '最大值';
      maxInput.value = tempCondition.rangeMax || '';
      maxInput.style.cssText = 'flex: 1; padding: 8px 12px;';
      maxInput.addEventListener('input', (e) => {
        tempCondition.rangeMax = parseFloat(e.target.value);
      });

      rangeContainer.appendChild(minInput);
      rangeContainer.appendChild(separator);
      rangeContainer.appendChild(maxInput);

      group.appendChild(label);
      group.appendChild(rangeContainer);
    } else {
      const label = document.createElement('div');
      label.style.cssText = 'margin-bottom: 8px; font-weight: 500; color: #262626; font-size: 13px;';
      label.textContent = '重量值：';

      const inputContainer = document.createElement('div');
      inputContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'ant-input';
      input.placeholder = '请输入重量';
      input.value = tempCondition.value || '';
      input.style.cssText = 'flex: 1; padding: 8px 12px;';
      input.addEventListener('input', (e) => {
        tempCondition.value = parseFloat(e.target.value);
      });

      const unit = document.createElement('span');
      unit.textContent = 'kg';
      unit.style.cssText = 'color: #666;';

      inputContainer.appendChild(input);
      inputContainer.appendChild(unit);

      group.appendChild(label);
      group.appendChild(inputContainer);
    }

    return group;
  }

  // 创建浮动信息展示面板
  function createMatchInfoPanel() {
    // 如果已存在面板则先移除
    if (matchInfoPanel && matchInfoPanel.parentNode) {
      matchInfoPanel.parentNode.removeChild(matchInfoPanel);
    }

    // 创建浮动面板
    matchInfoPanel = document.createElement('div');
    matchInfoPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 320px;
            max-height: 500px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(217, 217, 217, 0.6);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9000;
            overflow: hidden;
            display: none;
            transition: all 0.3s ease;
        `;

    // 面板标题
    const header = document.createElement('div');
    header.style.cssText = `
            padding: 12px 16px;
            background: rgba(24, 144, 255, 0.1);
            border-bottom: 1px solid rgba(217, 217, 217, 0.3);
            font-size: 14px;
            font-weight: 500;
            color: #1890ff;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
    header.innerHTML = `
            <span>🎯 目的地匹配抢单</span>
            <span class="match-count">0</span>
        `;

    // 面板内容
    const content = document.createElement('div');
    content.className = 'match-panel-content';
    content.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
        `;

    matchInfoPanel.appendChild(header);
    matchInfoPanel.appendChild(content);
    document.body.appendChild(matchInfoPanel);

    if (ENABLE_DEBUG_LOG) {
      console.log('浮动信息面板已创建');
    }
    return matchInfoPanel;
  }

  // 更新浮动面板内容
  function updateMatchInfoPanel() {
    if (!settings.enableDestinationMatch || destinationConfig.whitelist.length === 0) {
      if (matchInfoPanel) {
        matchInfoPanel.style.display = 'none';
      }
      return;
    }

    if (!matchInfoPanel) {
      createMatchInfoPanel();
    }

    const content = matchInfoPanel.querySelector('.match-panel-content');
    const countElement = matchInfoPanel.querySelector('.match-count');

    if (matchedOrders.size === 0) {
      matchInfoPanel.style.display = 'none';
      return;
    }

    // 显示面板
    matchInfoPanel.style.display = 'block';
    countElement.textContent = matchedOrders.size;

    // 清空内容
    content.innerHTML = '';

    // 渲染匹配的订单
    matchedOrders.forEach((orderInfo, orderId) => {
      const item = document.createElement('div');
      item.style.cssText = `
                padding: 12px 16px;
                border-bottom: 1px solid rgba(240, 240, 240, 0.5);
                transition: background-color 0.2s;
            `;
      item.addEventListener(
        'mouseenter',
        () => (item.style.backgroundColor = 'rgba(245, 245, 245, 0.3)')
      );
      item.addEventListener('mouseleave', () => (item.style.backgroundColor = 'transparent'));

      // 订单信息
      const orderDiv = document.createElement('div');
      orderDiv.style.cssText = 'margin-bottom: 8px;';
      orderDiv.innerHTML = `
                <div style="font-size: 14px; font-weight: 500; color: #262626; margin-bottom: 4px;">
                    ${orderInfo.code || orderId}
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 2px;">
                    📍 目的地: ${orderInfo.destinationName || '未知'}
                </div>
                ${orderInfo.note ? `<div style="font-size: 12px; color: #999;">💬 ${orderInfo.note}</div>` : ''}
            `;

      // 状态显示
      const statusDiv = document.createElement('div');
      statusDiv.className = `match-status-${orderId}`;
      statusDiv.style.cssText = `
                font-size: 12px;
                font-weight: 500;
                padding: 2px 8px;
                border-radius: 4px;
                text-align: center;
            `;

      // 失败原因
      const reasonDiv = document.createElement('div');
      reasonDiv.className = `failed-reason-${orderId}`;
      reasonDiv.style.cssText = `
                font-size: 10px;
                font-weight: 500;
                padding: 2px 8px;
                border-radius: 4px;
                text-align: center;
            `;

      // 根据订单状态显示不同内容
      if (orderInfo.grabStatus === 'pending') {
        statusDiv.textContent = '⏳ 等待抢单时间';
        statusDiv.style.background = 'rgba(250, 173, 20, 0.1)';
        statusDiv.style.color = '#faad14';
      } else if (orderInfo.grabStatus === 'grabbing') {
        statusDiv.textContent = '🚀 抢单中...';
        statusDiv.style.background = 'rgba(24, 144, 255, 0.1)';
        statusDiv.style.color = '#1890ff';
      } else if (orderInfo.grabStatus === 'success') {
        statusDiv.textContent = '✅ 抢单成功';
        statusDiv.style.background = 'rgba(82, 196, 26, 0.1)';
        statusDiv.style.color = '#52c41a';
        if (grabPanelData.todayOrders.has(orderId)) {
          const errorInfo = grabPanelData.todayOrders.get(orderId);
          reasonDiv.textContent = errorInfo.errorMessage;
          reasonDiv.style.background = 'rgba(245, 34, 45, 0.1)';
          reasonDiv.style.color = '#7effa9ff';
        }
      } else if (orderInfo.grabStatus === 'failed') {
        statusDiv.textContent = '❌ 抢单失败';
        statusDiv.style.background = 'rgba(245, 34, 45, 0.1)';
        statusDiv.style.color = '#f5222d';
        if (grabPanelData.todayOrders.has(orderId)) {
          const errorInfo = grabPanelData.todayOrders.get(orderId);
          reasonDiv.textContent = errorInfo.errorMessage;
          reasonDiv.style.background = 'rgba(245, 34, 45, 0.1)';
          reasonDiv.style.color = '#ff7e84ff';
        }
      }

      item.appendChild(orderDiv);
      item.appendChild(statusDiv);
      if (reasonDiv.textContent) {
        item.appendChild(reasonDiv);
      }
      content.appendChild(item);
    });
  }

  // 更新匹配订单状态
  function updateMatchOrderStatus(orderId, status) {
    if (matchedOrders.has(orderId)) {
      const orderInfo = matchedOrders.get(orderId);
      orderInfo.grabStatus = status;
      matchedOrders.set(orderId, orderInfo);
      updateMatchInfoPanel();
    }
  }

  // 更新暂停按钮状态
  function updatePauseButton(button) {
    button.innerHTML = `
            <span role="img" aria-label="${isRefreshPaused ? 'play-circle' : 'pause-circle'}" 
                  class="anticon anticon-${isRefreshPaused ? 'play-circle' : 'pause-circle'}"
                  style="margin-right: 4px;">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="${isRefreshPaused ? 'play-circle' : 'pause-circle'}" 
                     width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    ${
                      isRefreshPaused
                        ? '<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z"></path>'
                        : '<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-80-544c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h208c4.4 0 8-3.6 8-8V348c0-4.4-3.6-8-8-8H432z"></path>'
                    }
                </svg>
            </span>
            <span>${isRefreshPaused ? '继续' : '暂停'}</span>
        `;
    button.title = isRefreshPaused ? '继续自动刷新' : '暂停自动刷新';
    button.style.color = isRefreshPaused ? '#1890ff' : '#ff4d4f';
  }

  // 自动刷新功能
  function setupAutoRefresh() {
    // 查找刷新按钮
    refreshBtn = document.getElementsByClassName('anticon anticon-reload')[0]?.parentElement;
    if (!refreshBtn) {
      refreshBtn = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes('刷新运单'))?.parentElement;
    }
    if (!refreshBtn) {
      console.warn('未找到刷新按钮');
      return;
    }

    // 创建显示和控制区域
    const statusContainer = document.createElement('div');
    statusContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-right: 12px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
        `;

    // 状态显示
    const statusDisplay = document.createElement('div');
    statusDisplay.style.cssText = 'display: inline-flex; align-items: center; margin-right: 8px;';
    statusDisplay.innerHTML = `
            <span class="last-refresh" style="margin-right: 12px;"></span>
            <span class="next-refresh"></span>
        `;

    // 暂停/继续按钮
    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'ant-btn ant-btn-link refresh-pause-btn';
    pauseBtn.style.cssText = `
            padding: 0 8px;
            height: 24px;
            font-size: 14px;
            display: ${settings.enableAutoRefresh ? 'inline-flex' : 'none'};
            align-items: center;
            color: #1890ff;
        `;
    updatePauseButton(pauseBtn);

    pauseBtn.onclick = () => {
      isRefreshPaused = !isRefreshPaused;
      updatePauseButton(pauseBtn);

      if (isRefreshPaused) {
        if (autoRefreshTimer) {
          clearInterval(autoRefreshTimer);
          autoRefreshTimer = null;
        }
      } else {
        startAutoRefresh();
      }
    };

    statusContainer.appendChild(statusDisplay);
    statusContainer.appendChild(pauseBtn);

    // 插入状态显示
    refreshBtn.parentNode.insertBefore(statusContainer, refreshBtn);

    // 更新显示函数
    function updateRefreshStatus() {
      const lastRefreshEl = statusContainer.querySelector('.last-refresh');
      const nextRefreshEl = statusContainer.querySelector('.next-refresh');

      if (lastRefreshTime) {
        lastRefreshEl.textContent = `上次刷新: ${lastRefreshTime.toLocaleTimeString()}.${lastRefreshTime.getMilliseconds()}`;
      }

      if (settings.enableAutoRefresh) {
        const now = Date.now();
        const nextRefreshTime = lastRefreshTime
          ? lastRefreshTime.getTime() + settings.refreshInterval * 1000
          : now + settings.refreshInterval * 1000;
        const timeLeft = Math.max(0, ((nextRefreshTime - now) / 1000).toFixed(1));

        if (isRefreshPaused) {
          nextRefreshEl.textContent = '自动刷新已暂停';
          nextRefreshEl.style.color = '#ff4d4f';
        } else {
          nextRefreshEl.textContent = `下次刷新: ${timeLeft}秒`;
          nextRefreshEl.style.color = 'inherit';
        }
      } else {
        nextRefreshEl.textContent = '';
        nextRefreshEl.style.color = 'inherit';
      }
    }

    // 执行刷新
    async function doRefresh() {
      lastRefreshTime = new Date();

      // 使用新的刷新逻辑
      const result = await performRefresh();

      if (!result.success) {
        console.error('自动刷新失败:', result.error);
        // 可以在这里显示错误提示
      } else {
        if (ENABLE_DEBUG_LOG) {
          console.log(
            `自动刷新成功，使用模式: ${result.mode}, 间隔时间: ${settings.refreshInterval}秒`
          );
        }
      }
    }

    // 设置自动刷新定时器
    function startAutoRefresh() {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
      }

      if (settings.enableAutoRefresh) {
        autoRefreshTimer = setInterval(() => {
          doRefresh();
        }, settings.refreshInterval * 1000);

        // 更新显示的定时器
        setInterval(updateRefreshStatus, 500);
      }
    }

    // 停止自动刷新
    function stopAutoRefresh() {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
      }
      lastRefreshTime = null;
      updateRefreshStatus();
    }

    // 根据设置状态初始化
    if (settings.enableAutoRefresh) {
      startAutoRefresh();
    }

    // 导出函数供设置变更时使用
    window.autoRefreshControl = {
      start: startAutoRefresh,
      stop: stopAutoRefresh,
    };
  }

  // 创建设置开关
  function createSettingSwitch(label, checked, onChange) {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; margin-bottom: 16px;';

    const switchLabel = document.createElement('span');
    switchLabel.style.cssText = 'margin-right: 8px;';
    switchLabel.textContent = label;

    const switchContainer = document.createElement('button');
    switchContainer.className = `ant-switch${checked ? ' ant-switch-checked' : ''}`;
    switchContainer.style.cssText =
      'position: relative; display: inline-block; width: 44px; height: 22px;';

    const switchHandle = document.createElement('span');
    switchHandle.className = 'ant-switch-handle';

    switchContainer.appendChild(switchHandle);

    // 维护内部状态以确保准确性
    let currentState = checked;

    switchContainer.onclick = () => {
      // 切换状态
      currentState = !currentState;

      // 更新UI
      if (currentState) {
        switchContainer.classList.add('ant-switch-checked');
      } else {
        switchContainer.classList.remove('ant-switch-checked');
      }

      // 调用回调函数
      onChange(currentState);

      if (ENABLE_DEBUG_LOG) {
        console.log(`开关 "${label}" 状态变更为: ${currentState}`);
      }
    };

    container.appendChild(switchLabel);
    container.appendChild(switchContainer);

    return container;
  }

  // 检查是否在抢单页面
  function isOnGrabOrderTab() {
    const activeTab = document.querySelector(
      '.ant-radio-button-wrapper-checked input[value="CAN_GRAB_ORD"]'
    );
    return activeTab !== null;
  }

  // 确保操作列有足够宽度容纳自动抢单按钮
  function ensureOperationColumnWidth() {
    const headers = document.querySelectorAll('.ant-table-header thead th');
    const headerColgroup = document.querySelector('.ant-table-header colgroup');
    const bodyColgroup = document.querySelector('.ant-table-body colgroup');

    if (!headerColgroup || !bodyColgroup) return;

    const cols = headerColgroup.children;
    let operationHeaderIndex = -1;

    headers.forEach((header, index) => {
      if (header.textContent && header.textContent.includes('操作')) {
        operationHeaderIndex = index;
      }
    });

    if (operationHeaderIndex >= 0 && cols[operationHeaderIndex]) {
      const operationCol = cols[operationHeaderIndex];
      const currentWidth = parseInt(operationCol.style.width) || 120;
      // 为操作列增加额外宽度以容纳自动抢单按钮
      const newWidth = Math.max(currentWidth, 200);
      operationCol.style.cssText = `width: ${newWidth}px; min-width: ${newWidth}px;`;

      // 同步更新body colgroup中对应的列
      const bodyOperationCol = bodyColgroup.children[operationHeaderIndex];
      if (bodyOperationCol) {
        bodyOperationCol.style.cssText = `width: ${newWidth}px; min-width: ${newWidth}px;`;
      }

      // 更新对应的表头宽度
      const operationHeader = headers[operationHeaderIndex];
      if (operationHeader) {
        operationHeader.style.width = `${newWidth}px`;
        operationHeader.style.minWidth = `${newWidth}px`;
      }

      if (ENABLE_DEBUG_LOG) {
        console.log(`操作列宽度已更新为: ${newWidth}px`);
      }
    }
  }

  // 处理所有行的调试点击功能
  function processDebugClickHandlers() {
    const tableBody = document.querySelector('.ant-table-body tbody');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr[data-row-key]');
    rows.forEach((row) => {
      const rowKey = row.getAttribute('data-row-key');
      if (rowKey) {
        addDebugClickHandler(row, rowKey);
      }
    });
  }

  // 添加调试点击功能
  function addDebugClickHandler(row, rowKey) {
    // 找到序号列（第2列，索引1）
    const sequenceCell = row.querySelector(
      'td.ant-table-cell-fix-left:not(.ant-table-selection-column)'
    );

    if (sequenceCell && !sequenceCell.hasAttribute('data-debug-added')) {
      // 标记已添加，避免重复绑定
      sequenceCell.setAttribute('data-debug-added', 'true');

      // 添加点击样式提示
      sequenceCell.style.cursor = 'pointer';
      sequenceCell.style.transition = 'background-color 0.2s';
      sequenceCell.title = '点击查看运单详细信息';

      // 添加鼠标悬停效果
      sequenceCell.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#f0f0f0';
      });

      sequenceCell.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '';
      });

      // 添加点击事件
      sequenceCell.addEventListener('click', function (e) {
        e.stopPropagation(); // 防止事件冒泡

        const orderId = parseInt(rowKey);
        const orderInfo = orderDataMap.get(orderId);

        if (ENABLE_DEBUG_LOG) {
          console.log('='.repeat(60));
        }
        if (ENABLE_DEBUG_LOG) {
          console.log(`🔍 运单调试信息 - 序号: ${this.textContent.trim()}`);
        }
        if (ENABLE_DEBUG_LOG) {
          console.log('='.repeat(60));
        }

        if (orderInfo) {
          if (ENABLE_DEBUG_LOG) {
            console.log('📋 运单基本信息:');
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   ID: ${orderInfo.id}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   名称: ${orderInfo.name}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   编号: ${orderInfo.code}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   目的地: ${orderInfo.destinationName}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   备注: ${orderInfo.note}`);
          }
          if (orderInfo.planAllocateTime) {
            const allocateTime = new Date(orderInfo.planAllocateTime * 1000);
            const now = new Date();
            const timeDiff = allocateTime.getTime() - now.getTime();
            const secondsLeft = Math.floor(timeDiff / 1000);

            if (ENABLE_DEBUG_LOG) {
              console.log(`   可抢单时间: ${allocateTime.toLocaleString()}`);
            }
            if (ENABLE_DEBUG_LOG) {
              console.log(`   距离抢单时间: ${secondsLeft > 0 ? secondsLeft + '秒' : '已到时间'}`);
            }
          }

          if (ENABLE_DEBUG_LOG) {
            console.log('🚚 Carrier信息:');
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   ID: ${orderInfo.carrier.id}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   名称: ${orderInfo.carrier.name}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   编号: ${orderInfo.carrier.code}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   公司拥有: ${orderInfo.carrier.corporationOwned}`);
          }

          if (ENABLE_DEBUG_LOG) {
            console.log('🎯 抢单状态:');
          }
          const hasAutoTask = autoGrabTasks.has(rowKey);
          const hasCountdown = countdownIntervals.has(rowKey);
          if (ENABLE_DEBUG_LOG) {
            console.log(`   自动抢单任务: ${hasAutoTask ? '已设置' : '未设置'}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   倒计时任务: ${hasCountdown ? '运行中' : '未运行'}`);
          }

          // 打印完整的orderInfo对象
          if (ENABLE_DEBUG_LOG) {
            console.log('📄 完整运单数据:');
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(JSON.stringify(orderInfo, null, 2));
          }
        } else {
          if (ENABLE_DEBUG_LOG) {
            console.log('❌ 未找到运单数据');
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   运单ID: ${orderId}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log(`   数据映射表大小: ${orderDataMap.size}`);
          }
          if (ENABLE_DEBUG_LOG) {
            console.log('   可用运单ID列表:', Array.from(orderDataMap.keys()));
          }
        }

        if (ENABLE_DEBUG_LOG) {
          console.log('='.repeat(60));
        }

        // 在页面上也显示一个简单的提示
        const toast = document.createElement('div');
        toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1890ff;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 6px;
                    z-index: 10000;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                `;
        toast.textContent = `运单 ${orderInfo ? orderInfo.code : orderId} 信息已输出到控制台`;
        document.body.appendChild(toast);

        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 3000);
      });
    }
  }

  // 更新状态指示器显示
  function updateStatusIndicator() {
    if (!statusIndicator) return;

    const count = autoGrabTasks.size;

    if (count === 0) {
      statusIndicator.innerHTML = `
                <span style="margin-right: 4px;">⚪</span>
                <span>无自动抢单</span>
            `;
      statusIndicator.style.backgroundColor = '#f0f0f0';
      statusIndicator.style.borderColor = '#d9d9d9';
      statusIndicator.style.color = '#666';
      statusIndicator.title = '当前没有运单在自动抢单';
    } else {
      statusIndicator.innerHTML = `
                <span style="margin-right: 4px;">🔄</span>
                <span>自动抢单: ${count}</span>
            `;
      statusIndicator.style.backgroundColor = '#fff2f0';
      statusIndicator.style.borderColor = '#ffccc7';
      statusIndicator.style.color = '#f5222d';
      statusIndicator.title = `当前有 ${count} 个运单正在自动抢单，点击查看详情`;
    }
  }

  // 处理抢单按钮
  function setupGrabButtons() {
    const buttons = document.querySelectorAll('.ant-btn-dangerous');
    buttons.forEach((button) => {
      if (!button.hasAttribute('data-grab-handler')) {
        button.setAttribute('data-grab-handler', 'true');

        // 根据设置修改按钮文本
        button.innerHTML = `<span>${settings.skipGrabConfirm ? '直接抢单' : '抢单'}</span>`;

        // 添加点击事件处理
        button.addEventListener('click', function (event) {
          if (!settings.skipGrabConfirm) return; // 如果未开启跳过确认，不做任何处理

          event.stopPropagation(); // 阻止事件冒泡
          event.preventDefault(); // 阻止默认行为

          // 获取运单行
          const row = button.closest('tr[data-row-key]');
          if (!row) return;

          const rowKey = row.getAttribute('data-row-key');
          if (!rowKey) return;

          // 调用点击抢单方法
          if (ENABLE_DEBUG_LOG) {
            console.log(`直接抢单（点击方式）：运单 ${rowKey}`);
          }
          grabOrderByClickBtn(parseInt(rowKey)).then((success) => {
            if (success) {
              if (ENABLE_DEBUG_LOG) {
                console.log(`运单 ${rowKey} 点击抢单成功`);
              }
              // 可以在这里添加成功提示
            } else {
              console.warn(`运单 ${rowKey} 点击抢单失败`);
              // 可以在这里添加失败提示
            }
          });
        });
      }
    });
  }

  // 观察DOM变化
  function setupObserver() {
    const observer = new MutationObserver(function (mutations) {
      let shouldUpdate = false;
      let shouldUpdateGrabButtons = false;

      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // 检查是否有表格相关的变化
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.matches &&
                (node.matches('tr[data-row-key]') ||
                  (node.querySelector && node.querySelector('tr[data-row-key]')))
              ) {
                shouldUpdate = true;
              }

              // 检查是否有抢单按钮相关的变化
              if (
                node.matches &&
                (node.matches('.ant-btn-dangerous') ||
                  (node.querySelector && node.querySelector('.ant-btn-dangerous')))
              ) {
                shouldUpdateGrabButtons = true;
              }
            }
          });
        }
      });

      if (shouldUpdate && isOnGrabOrderTab()) {
        setTimeout(() => {
          // 确保操作列宽度足够
          ensureOperationColumnWidth();
          // 处理调试点击功能
          processDebugClickHandlers();
        }, 100);
      }

      if (shouldUpdateGrabButtons && isOnGrabOrderTab()) {
        setTimeout(() => {
          setupGrabButtons();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 监听页面标签切换
  function setupTabListener() {
    document.addEventListener('click', function (e) {
      const target = e.target;
      if (
        target.matches('.ant-radio-button-input') ||
        target.closest('.ant-radio-button-wrapper')
      ) {
        setTimeout(() => {
          if (ENABLE_DEBUG_LOG) {
            console.log('检测到标签切换，当前标签:', isOnGrabOrderTab() ? '抢单' : '其他');
          }
          if (isOnGrabOrderTab()) {
            ensureOperationColumnWidth();
            setupGrabButtons(); // 处理抢单按钮
            processDebugClickHandlers(); // 处理调试点击功能
          } else {
            // 切换到其他标签时清理所有任务
            if (ENABLE_DEBUG_LOG) {
              console.log('切换离开抢单标签，清理所有任务');
            }

            // 清理倒计时任务（支持双重倒计时）
            countdownIntervals.forEach((intervals, rowKey) => {
              if (typeof intervals === 'number') {
                // 旧格式：单个interval ID
                clearInterval(intervals);
              } else if (intervals && typeof intervals === 'object') {
                // 新格式：双重interval对象
                if (intervals.local) clearInterval(intervals.local);
                if (intervals.ntp) clearInterval(intervals.ntp);
              }
              if (ENABLE_DEBUG_LOG) {
                console.log(`清理运单 ${rowKey} 的倒计时任务`);
              }
            });
            countdownIntervals.clear();

            // 清理自动抢单任务（支持双重任务）
            autoGrabTasks.forEach((tasks, rowKey) => {
              if (typeof tasks === 'number') {
                // 旧格式：单个timeout ID
                clearTimeout(tasks);
              } else if (tasks && typeof tasks === 'object') {
                // 新格式：双重timeout对象
                if (tasks.local) clearTimeout(tasks.local);
                if (tasks.ntp) clearTimeout(tasks.ntp);
              }
              if (ENABLE_DEBUG_LOG) {
                console.log(`清理运单 ${rowKey} 的自动抢单任务`);
              }
            });
            autoGrabTasks.clear();
            updateStatusIndicator();
          }
        }, 500);
      }
    });
  }

  // 初始化脚本
  function init() {
    if (ENABLE_DEBUG_LOG) {
      console.log('运单自动抢单助手已加载');
    }

    // 加载设置
    loadSettings();

    // 等待页面完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(() => justDoIt(), 1000);
      });
    } else {
      setTimeout(() => justDoIt(), 1000);
    }
  }

  function justDoIt() {
    createSettingsButton();
    // 创建抢单面板
    createGrabPanelFloatButton();
    // 清理过期数据
    cleanupExpiredData();
    // 启动定期清理过期提醒记录
    setInterval(cleanupExpiredAlerts, 5 * 60 * 1000); // 每5分钟清理一次
    // 直接启动脚本功能
    start();
    // 初始化自动刷新功能
    setupAutoRefresh();
  }

  function start() {
    setupApiInterceptor(); // 设置API拦截器
    setupObserver();
    setupTabListener();

    // 初始化目的地匹配面板
    createMatchInfoPanel();

    // 如果当前就在抢单页面，立即处理
    if (isOnGrabOrderTab()) {
      if (settings.skipGrabConfirm) {
        ensureOperationColumnWidth();
        setupGrabButtons(); // 处理抢单按钮
      }
      processDebugClickHandlers(); // 处理调试点击功能
    }

    if (ENABLE_DEBUG_LOG) {
      console.log('运单自动抢单助手启动完成');
    }
  }

  // 页面卸载时清理资源
  window.addEventListener('beforeunload', function () {
    // 清理倒计时任务
    countdownIntervals.forEach((intervals) => {
      if (typeof intervals === 'number') {
        clearInterval(intervals);
      } else if (intervals && typeof intervals === 'object') {
        if (intervals.local) clearInterval(intervals.local);
        if (intervals.ntp) clearInterval(intervals.ntp);
      }
    });

    // 清理自动抢单任务
    autoGrabTasks.forEach((tasks) => {
      if (typeof tasks === 'number') {
        clearTimeout(tasks);
      } else if (tasks && typeof tasks === 'object') {
        if (tasks.local) clearTimeout(tasks.local);
        if (tasks.ntp) clearTimeout(tasks.ntp);
      }
    });
  });

  // 监听API请求，拦截查询接口获取运单数据
  function setupApiInterceptor() {
    const originalFetch = window.fetch;
    const originalXHR = XMLHttpRequest.prototype.open;

    // 拦截fetch请求
    window.fetch = function (url, requestInit) {
      const promise = originalFetch.apply(this, arguments);
      if (ENABLE_DEBUG_LOG) {
        console.log('拦截到fetch请求:', url, requestInit);
      }

      // 检查是否是抢单接口
      if (url && url.includes('/api/way_bill/dispatch/carrier/grab/order')) {
        if (ENABLE_DEBUG_LOG) {
          console.log('拦截到抢单接口请求:', url);
        }
        promise
          .then((response) => {
            if (response.ok) {
              // 克隆响应以避免消费原始流
              return response
                .clone()
                .json()
                .then((data) => {
                  handleGrabOrderResponse(data, requestInit);
                })
                .catch((err) => {
                  console.error('解析抢单接口响应失败:', err);
                });
            }
          })
          .catch((err) => {
            console.error('抢单接口请求失败:', err);
          });
      }

      // 检查是否是查询接口
      if (url && url.includes('/api/way_bill/dispatch/data/query')) {
        // 获取request body
        let requestBody = null;
        let needInject = false;
        if (requestInit && requestInit.body && typeof requestInit.body === 'string') {
          try {
            requestBody = JSON.parse(requestInit.body);
            requestBody.filter.children.forEach((child) => {
              if (child.filterField === 'carrier' && child.expression === 'IS NULL') {
                needInject = true;
                return;
              }
            });
            if (ENABLE_DEBUG_LOG) {
              console.log('拦截到fetch请求体:', requestBody);
            }
          } catch (e) {
            console.warn('解析fetch请求体失败:', e);
            requestBody = requestInit.body;
          }
        }
        if (!needInject) {
          if (ENABLE_DEBUG_LOG) {
            console.log('不处理该查询');
          }
          return promise;
        }
        if (ENABLE_DEBUG_LOG) {
          console.log('拦截到查询接口请求:', url, needInject, '请求体:', requestBody);
        }
        promise
          .then((response) => {
            if (response.ok) {
              // 克隆响应以避免消费原始流
              return response
                .clone()
                .json()
                .then((data) => {
                  handleQueryResponse(data, requestBody);
                })
                .catch((err) => {
                  console.error('解析查询接口响应失败:', err);
                });
            }
          })
          .catch((err) => {
            console.error('查询接口请求失败:', err);
          });
      }

      return promise;
    };

    // 拦截XMLHttpRequest请求
    XMLHttpRequest.prototype.open = function (_, url) {
      if (ENABLE_DEBUG_LOG) {
        console.log('拦截到XHR请求:', url);
      }
      if (url && url.includes('/api/way_bill/dispatch/data/query')) {
        const xhr = this;

        xhr.addEventListener('load', function () {
          try {
            if (xhr.status === 200 && xhr.responseText) {
              const data = JSON.parse(xhr.responseText);
              handleQueryResponse(data);
            }
          } catch (err) {
            console.error('解析XHR查询接口响应失败:', err);
          }
        });
      }

      return originalXHR.apply(this, arguments);
    };

    if (ENABLE_DEBUG_LOG) {
      console.log('API拦截器已设置');
    }
  }

  // 处理抢单接口响应数据
  function handleGrabOrderResponse(data, requestInit) {
    if (ENABLE_DEBUG_LOG) {
      console.log('抢单接口响应:', data);
    }

    // 解析请求体获取orderId
    let orderId = null;
    try {
      if (requestInit && requestInit.body) {
        const requestBody = JSON.parse(requestInit.body);
        orderId = requestBody.id;
      }
    } catch (e) {
      console.error('解析抢单请求体失败:', e);
    }

    if (!orderId) {
      console.warn('无法从请求体中获取orderId');
      return;
    }

    // 判断抢单结果
    const isSuccess =
      (data.status === 'SUCCESS' || data.status === '200') && Object.keys(data).length === 1;

    // 触发自定义事件，通知抢单结果
    const event = new CustomEvent('grabOrderResult', {
      detail: {
        orderId: orderId,
        success: isSuccess,
        result: data,
      },
    });
    window.dispatchEvent(event);

    if (ENABLE_DEBUG_LOG) {
      console.log(`抢单结果事件已触发，orderId: ${orderId}, success: ${isSuccess}`);
    }
  }

  // 处理查询接口响应数据
  function handleQueryResponse(data) {
    if (!data || !data.data || !Array.isArray(data.data.results)) {
      console.warn('查询接口响应数据格式不正确:', data);
      return;
    }

    if (ENABLE_DEBUG_LOG) {
      console.log(`收到查询接口响应，运单数量: ${data.data.results.length}`);
    }
    orderDataMap.clear();

    // 从页面获取当前用户的carrier信息
    let defaultCarrier = {
      corporationOwned: false,
      code: '000207',
      name: '鑫利物流30',
      id: 76,
    };

    // 尝试从页面元素中获取carrier信息
    try {
      const userInfoElement = document.querySelector('[data-carrier-info]');
      if (userInfoElement) {
        const carrierInfo = JSON.parse(userInfoElement.getAttribute('data-carrier-info'));
        if (carrierInfo) {
          defaultCarrier = carrierInfo;
        }
      }
    } catch (e) {
      console.warn('无法从页面获取carrier信息，使用默认值');
    }

    // 更新运单数据映射
    data.data.results.forEach((order) => {
      if (order.id && order.code) {
        // 解析备注信息
        let note =
          order.customer?.site?.extJSON?.match(/\"xqbz\":\"([^\"]*)\"/)?.[1] ||
          order.extJSON?.match(/\"xqbz\":\"([^\"]*)\"/)?.[1] ||
          '';
        // 解析重量信息
        let weight = order.customer?.site?.extJSON?.match(/"sjzlbt"\s*:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)?.[1] ||
          order.extJSON?.match(/"sjzlbt"\s*:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)?.[1] || '';
        const orderInfo = {
          id: order.id,
          name: order.name || '', // 运单名称
          code: order.code, // 运单编号
          planAllocateTime: order.planAllocateTime, // 可抢单时间
          destinationName: order.destinationPoint.formatName || '', // 目的地名称
          version: order.version, // 版本
          note: note, // 备注信息，从extJSON中的xqbz字段解析
          weight: weight, // 预估重量
          userName: order.createInfo?.userName || '', // 调度员
          customerPhone: order.customer?.phone || '', // 客户电话
          carrier: defaultCarrier, // 使用默认carrier信息或从order中获取
        };

        orderDataMap.set(order.id, orderInfo);
        if (ENABLE_DEBUG_LOG) {
          console.log(`更新运单数据: ID=${orderInfo.id}, Code=${orderInfo.code}, 目的地=${orderInfo.destinationName},
                     版本=${orderInfo.version}, 可抢单时间=${orderInfo.planAllocateTime}, 备注=${orderInfo.note}
                     userName=${orderInfo.userName}, customerPhone=${orderInfo.customerPhone}`);
        }
      }
    });

    if (ENABLE_DEBUG_LOG) {
      console.log(`运单数据映射已更新，当前存储 ${orderDataMap.size} 个运单`);
    }

    // 将所有订单添加到今日抢单面板
    addAllOrdersToPanelData();

    // 处理目的地匹配逻辑
    processDestinationMatching();

    // 数据更新后立即处理调试点击功能
    if (isOnGrabOrderTab()) {
      processDebugClickHandlers();
    }
  }

  // 将所有订单添加到面板数据
  function addAllOrdersToPanelData() {
    if (ENABLE_DEBUG_LOG) {
      console.log('开始将所有订单添加到今日抢单面板');
    }

    orderDataMap.forEach((orderInfo, orderId) => {
      // 判断订单状态
      let grabResult = 'not_matched'; // 默认为未匹配
      let errorMessage = null;

      // 检查是否在失败黑名单中
      if (failedOrderBlacklist.has(orderId)) {
        grabResult = 'failed';
        errorMessage = '已在失败黑名单中，不再尝试抢单';
      }

      // 添加到面板数据
      addOrderToPanelData(orderInfo, grabResult, errorMessage);
      if (ENABLE_DEBUG_LOG) {
        console.log(
          `订单 ${orderInfo.code} 已添加到面板，状态: ${grabResult}${errorMessage ? `, 原因: ${errorMessage}` : ''}`
        );
      }
    });

    if (ENABLE_DEBUG_LOG) {
      console.log(`所有订单已添加到面板，共 ${grabPanelData.todayOrders.size} 个订单`);
    }
  }

  // ==================== 新的规则匹配引擎 ====================

  /**
   * 根据新的规则系统检查订单是否应该抢单
   * @param {Object} orderInfo 订单信息对象
   * @returns {Object} { shouldGrab: boolean, matchedRule: Object|null, reason: string }
   */
  function checkOrderByRules(orderInfo) {
    // 如果没有启用自动抢单或没有规则，返回不抢单
    if (!settings.enableDestinationMatch || !grabRules.rules || grabRules.rules.length === 0) {
      return {
        shouldGrab: false,
        matchedRule: null,
        reason: '未启用规则或无规则配置'
      };
    }

    // 按规则类型分组
    const skipRules = grabRules.rules.filter(rule => rule.action === 'skip');
    const grabRulesList = grabRules.rules.filter(rule => rule.action === 'grab' || !rule.action);

    // 第一步：先按顺序匹配所有跳过规则
    for (const rule of skipRules) {
      const matchResult = checkRuleMatch(rule, orderInfo);
      if (matchResult.matched) {
        return {
          shouldGrab: false,
          matchedRule: rule,
          reason: matchResult.reason + '，规则设置为跳过'
        };
      }
    }

    // 第二步：如果没有匹配到跳过规则，再按顺序匹配抢单规则
    for (const rule of grabRulesList) {
      const matchResult = checkRuleMatch(rule, orderInfo);
      if (matchResult.matched) {
        return {
          shouldGrab: true,
          matchedRule: rule,
          reason: matchResult.reason
        };
      }
    }

    return {
      shouldGrab: false,
      matchedRule: null,
      reason: '未匹配任何规则'
    };
  }

  /**
   * 检查单条规则是否匹配订单（简化版）
   * @param {Object} rule 规则对象
   * @param {Object} orderInfo 订单信息
   * @returns {Object} { matched: boolean, reason: string }
   */
  function checkRuleMatch(rule, orderInfo) {
    if (!rule.conditions || rule.conditions.length === 0) {
      return { matched: false, reason: '规则无条件' };
    }

    // 按照逻辑关系依次计算
    // 例如：A AND B OR C AND D
    // 计算逻辑：((A AND B) OR C) AND D

    let currentResult = checkCondition(rule.conditions[0], orderInfo).matched;

    for (let i = 0; i < rule.conditions.length - 1; i++) {
      const currentCondition = rule.conditions[i];
      const nextCondition = rule.conditions[i + 1];
      const nextResult = checkCondition(nextCondition, orderInfo).matched;

      if (currentCondition.logic === 'OR') {
        currentResult = currentResult || nextResult;
      } else {
        // AND
        currentResult = currentResult && nextResult;
      }
    }

    if (currentResult) {
      return {
        matched: true,
        reason: `匹配规则"${rule.name || '未命名规则'}"`
      };
    }

    return { matched: false, reason: '条件不匹配' };
  }

  /**
   * 检查单个条件是否匹配订单
   * @param {Object} condition 条件对象
   * @param {Object} orderInfo 订单信息
   * @returns {Object} { matched: boolean, fieldValue: any, conditionDesc: string }
   */
  function checkCondition(condition, orderInfo) {
    const fieldValue = getOrderFieldValue(condition.field, orderInfo);

    let matched = false;
    let conditionDesc = '';

    // 根据字段类型和匹配类型进行匹配
    if (condition.field === 'weight') {
      // 数值类型匹配
      const weight = parseFloat(fieldValue) || 0;
      conditionDesc = generateConditionText(condition);

      switch (condition.matchType) {
        case 'equals':
          matched = weight === parseFloat(condition.value);
          break;
        case 'gt':
          matched = weight > parseFloat(condition.value);
          break;
        case 'lt':
          matched = weight < parseFloat(condition.value);
          break;
        case 'gte':
          matched = weight >= parseFloat(condition.value);
          break;
        case 'lte':
          matched = weight <= parseFloat(condition.value);
          break;
        case 'range':
          matched = weight >= parseFloat(condition.rangeMin) && weight <= parseFloat(condition.rangeMax);
          break;
      }
    } else {
      // 字符串类型匹配
      const strValue = String(fieldValue || '');
      const matchValue = String(condition.value || '');
      conditionDesc = generateConditionText(condition);

      switch (condition.matchType) {
        case 'contains':
          // 支持用中文逗号分隔多个关键字，满足任意一个即可
          const containsKeywords = matchValue.split('，').map(k => k.trim()).filter(k => k);
          if (containsKeywords.length > 0) {
            matched = containsKeywords.some(keyword => strValue.indexOf(keyword) !== -1);
          } else {
            matched = strValue.indexOf(matchValue) !== -1;
          }
          break;
        case 'equals':
          matched = strValue === matchValue;
          break;
        case 'notContains':
          // 支持用中文逗号分隔多个关键字，所有关键字都不包含才满足
          const notContainsKeywords = matchValue.split('，').map(k => k.trim()).filter(k => k);
          if (notContainsKeywords.length > 0) {
            matched = notContainsKeywords.every(keyword => strValue.indexOf(keyword) === -1);
          } else {
            matched = strValue.indexOf(matchValue) === -1;
          }
          break;
      }
    }

    return {
      matched,
      fieldValue,
      conditionDesc
    };
  }

  /**
   * 从订单信息中获取字段值
   * @param {string} fieldName 字段名
   * @param {Object} orderInfo 订单信息
   * @returns {any} 字段值
   */
  function getOrderFieldValue(fieldName, orderInfo) {
    switch (fieldName) {
      case 'destination':
        return orderInfo.destinationName || '';
      case 'note':
        return orderInfo.note || '';
      case 'weight':
        return orderInfo.weight || 0;
      case 'dispatcher':
        return orderInfo.userName || '';
      case 'customerPhone':
        return orderInfo.customerPhone || '';
      default:
        return '';
    }
  }

  // ==================== 旧的目的地匹配逻辑（兼容保留） ====================

  // 处理目的地匹配逻辑
  async function processDestinationMatching() {
    // 如果未启用自动抢单，直接返回
    if (!settings.enableDestinationMatch) {
      matchedOrders.clear();
      updateMatchInfoPanel();
      return;
    }

    // 收集所有需要抢单的订单
    const ordersToGrab = [];

    // 优先使用新的规则系统
    if (grabRules.rules && grabRules.rules.length > 0) {
      // 使用新规则系统
      if (ENABLE_DEBUG_LOG) {
        console.log('使用新规则系统进行订单匹配，规则数量:', grabRules.rules.length);
      }

      // 遍历所有订单进行匹配
      orderDataMap.forEach((order) => {
        if (!order.id) {
          return;
        }

        // 使用新的规则匹配引擎
        const matchResult = checkOrderByRules(order);

        if (matchResult.shouldGrab && !failedOrderBlacklist.has(order.id)) {
             // 创建匹配订单信息
          const matchedOrderInfo = { ...order };
          matchedOrders.set(order.id, matchedOrderInfo);

          // 将订单添加到待抢单队列
          ordersToGrab.push({ orderId: order.id, orderInfo: matchedOrderInfo });
        }
      });

      if (ENABLE_DEBUG_LOG) {
        console.log(`规则匹配完成，匹配到 ${matchedOrders.size} 个订单`);
      }

      // 更新面板显示
      updateMatchInfoPanel();
    }

    // 更新浮动面板显示
    updateMatchInfoPanel();

    // 串行执行抢单：一个订单完成后再抢下一个
    if (ordersToGrab.length > 0) {
      console.log(`开始串行抢单，共 ${ordersToGrab.length} 个订单`);
      for (let i = 0; i < ordersToGrab.length; i++) {
        const { orderId, orderInfo } = ordersToGrab[i];

        // 检查是否被全局暂停
        if (isGlobalPaused) {
          console.log('检测到全局暂停，停止后续抢单');
          break;
        }

        console.log(`[${i + 1}/${ordersToGrab.length}] 开始抢单: ${orderInfo.code}`);

        // 等待当前订单抢单完成
        const success = await executeDestinationMatchGrab(orderId, orderInfo);

        // 如果抢单成功且开启了抢单成功后暂停功能
        if (success && settings.pauseAfterSuccess && settings.pauseDuration > 0) {
          console.log(`抢单成功！按照设置暂停 ${settings.pauseDuration} 秒后继续...`);

          // 显示暂停提示
          const pauseToast = document.createElement('div');
          pauseToast.className = 'pause-after-success-toast';
          pauseToast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 24px 32px;
            border-radius: 12px;
            z-index: 10002;
            font-size: 16px;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
            min-width: 300px;
          `;

          const countdownSpan = document.createElement('span');
          countdownSpan.style.cssText = 'font-size: 24px; color: #52c41a; font-weight: 700;';
          let remainingTime = settings.pauseDuration;

          pauseToast.innerHTML = `
            <div style="margin-bottom: 12px; font-size: 18px;">✅ 抢单成功</div>
            <div style="margin-bottom: 8px;">等待 <span class="countdown-time">${remainingTime}</span> 秒后继续</div>
            <div style="font-size: 12px; color: #ccc; margin-top: 8px;">可在设置中调整等待时长</div>
          `;

          document.body.appendChild(pauseToast);
          const countdownElement = pauseToast.querySelector('.countdown-time');
          countdownElement.style.cssText = 'font-size: 24px; color: #52c41a; font-weight: 700;';

          // 倒计时更新
          const countdownInterval = setInterval(() => {
            remainingTime--;
            if (countdownElement) {
              countdownElement.textContent = remainingTime;
            }

            // 检查是否被全局暂停
            if (isGlobalPaused) {
              clearInterval(countdownInterval);
              if (pauseToast.parentNode) {
                pauseToast.parentNode.removeChild(pauseToast);
              }
            }

            if (remainingTime <= 0) {
              clearInterval(countdownInterval);
            }
          }, 1000);

          // 等待指定的暂停时长
          await new Promise(resolve => setTimeout(resolve, settings.pauseDuration * 1000));

          // 移除提示
          clearInterval(countdownInterval);
          if (pauseToast.parentNode) {
            pauseToast.parentNode.removeChild(pauseToast);
          }

          console.log('暂停结束，继续抢单流程');
        } else {
          // 添加短暂延迟，避免操作过快
          if (i < ordersToGrab.length - 1) {
            await new Promise(resolve);
          }
        }
      }
      console.log('所有订单抢单流程完成');
    }
  }

  // 执行目的地匹配抢单
  async function executeDestinationMatchGrab(orderId, orderInfo) {
    // 检查全局暂停状态
    if (isGlobalPaused) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`订单 ${orderInfo.code} 因全局暂停而跳过自动抢单`);
      }
      return false;
    }

    // 检查是否在失败黑名单中
    if (failedOrderBlacklist.has(orderId)) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`订单 ${orderInfo.code} 在失败黑名单中，跳过自动抢单`);
      }
      return false;
    }

    // 检查是否已经在抢单中
    if (grabbingOrders.has(orderId)) {
      const grabInfo = grabbingOrders.get(orderId);
      if (grabInfo.isGrabbing) {
        if (ENABLE_DEBUG_LOG) {
          console.log(`订单 ${orderInfo.code} 正在抢单中，跳过重复请求`);
        }
        return false;
      }
    }

    // 检查订单是否还在匹配列表中（可能已被手动取消）
    if (!matchedOrders.has(orderId)) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`订单 ${orderId} 不在匹配列表中，跳过抢单`);
      }
      return false;
    }

    if (ENABLE_DEBUG_LOG) {
      const mode = settings.grabMode === 'api' ? 'API方式' : '点击按钮方式';
      console.log(`开始执行自动抢单（${mode}）: ${orderInfo.code}`);
    }

    // 更新状态为抢单中
    updateMatchOrderStatus(orderId, 'grabbing');

    try {
      let success = false;

      // 根据设置的抢单模式选择不同的抢单方法
      if (settings.grabMode === 'api') {
        // 使用API方式抢单
        success = await grabOrderByApi(orderId);
      } else {
        // 使用点击按钮方式抢单（默认）
        success = await grabOrderByClickBtn(orderId);
      }

      if (success) {
        if (ENABLE_DEBUG_LOG) {
          console.log(`自动抢单成功: ${orderInfo.code}`);
        }
        updateMatchOrderStatus(orderId, 'success');

        // 成功后延迟移除（让用户看到成功状态）
        setTimeout(() => {
          matchedOrders.delete(orderId);
          updateMatchInfoPanel();
        }, 3000);

        return true; // 返回成功状态
      } else {
        if (ENABLE_DEBUG_LOG) {
          console.log(`目的地匹配抢单失败: ${orderInfo.code}`);
        }
        updateMatchOrderStatus(orderId, 'failed');

        // 失败后也延迟移除
        setTimeout(() => {
          matchedOrders.delete(orderId);
          updateMatchInfoPanel();
        }, 5000);

        return false; // 返回失败状态
      }
    } catch (error) {
      console.error(`目的地匹配抢单异常: ${orderInfo.code}`, error);
      updateMatchOrderStatus(orderId, 'failed');

      setTimeout(() => {
        matchedOrders.delete(orderId);
        updateMatchInfoPanel();
      }, 5000);

      return false; // 返回失败状态
    }
  }

  // 显示黑名单命中提醒
  function showBlacklistAlert(order, matchedDestination, hitKeywords) {
    const orderId = order.id;
    const currentTime = Date.now();

    // 检查是否在冷却时间内已经提醒过
    if (blacklistAlertHistory.has(orderId)) {
      const lastAlertTime = blacklistAlertHistory.get(orderId);
      const timeDiff = currentTime - lastAlertTime;

      if (timeDiff < BLACKLIST_ALERT_COOLDOWN) {
        const remainingTime = Math.ceil((BLACKLIST_ALERT_COOLDOWN - timeDiff) / 1000 / 60);
        if (ENABLE_DEBUG_LOG) {
          console.log(
            `运单 ${order.code || orderId} 黑名单提醒已在 ${remainingTime} 分钟内显示过，跳过重复提醒`
          );
        }
        return;
      }
    }

    // 记录本次提醒时间
    blacklistAlertHistory.set(orderId, currentTime);

    // 清理过期的提醒记录（可选优化，避免Map无限增长）
    cleanupExpiredAlerts();

    const alert = document.createElement('div');
    alert.className = 'blacklist-alert';
    alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 350px;
            max-width: 450px;
            padding: 16px 20px;
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 1px solid #ffc107;
            border-left: 4px solid #ff6b35;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
            z-index: 10001;
            font-size: 14px;
            animation: slideInFromRight 0.3s ease;
        `;

    alert.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 24px; flex-shrink: 0;">⚠️</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #856404; margin-bottom: 8px; font-size: 15px;">
                        🚫 黑名单命中 - 已跳过抢单
                    </div>
                    <div style="margin-bottom: 6px;">
                        <span style="font-weight: 500; color: #495057;">运单编号:</span>
                        <span style="color: #212529;">${order.code || order.id}</span>
                    </div>
                    <div style="margin-bottom: 6px;">
                        <span style="font-weight: 500; color: #495057;">目的地:</span>
                        <span style="color: #212529; background: #e8f5e8; padding: 1px 4px; border-radius: 3px;">${order.destinationName}</span>
                        <span style="color: #6c757d; font-size: 12px;">(匹配: ${matchedDestination})</span>
                    </div>
                    <div style="margin-bottom: 6px;">
                        <span style="font-weight: 500; color: #495057;">备注内容:</span>
                        <span style="color: #212529;">${order.note || '无'}</span>
                    </div>
                    <div>
                        <span style="font-weight: 500; color: #495057;">命中关键字:</span>
                        ${hitKeywords
                          .map(
                            (keyword) =>
                              `<span style="background: #f8d7da; color: #721c24; padding: 2px 6px; border-radius: 3px; margin-left: 4px; font-size: 12px; font-weight: 500;">${keyword}</span>`
                          )
                          .join('')}
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="background: none; border: none; color: #6c757d; cursor: pointer; font-size: 18px; line-height: 1; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;"
                        onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.color='#495057';"
                        onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6c757d';">
                    ✕
                </button>
            </div>
        `;

    // 添加滑入动画样式（如果还没有添加）
    if (!document.head.querySelector('style[data-blacklist-alert]')) {
      const style = document.createElement('style');
      style.setAttribute('data-blacklist-alert', 'true');
      style.textContent = `
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .blacklist-alert {
                    animation: slideInFromRight 0.3s ease;
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(alert);

    // 5秒后自动移除提醒
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.animation = 'slideInFromRight 0.3s ease reverse';
        setTimeout(() => {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        }, 300);
      }
    }, 5000);

    if (ENABLE_DEBUG_LOG) {
      console.log(
        `黑名单命中提醒已显示: 运单${order.code}, 目的地${order.destinationName}, 命中关键字: ${hitKeywords.join(', ')}`
      );
    }
  }

  // 清理过期的黑名单提醒记录
  function cleanupExpiredAlerts() {
    const currentTime = Date.now();
    let cleanedCount = 0;

    for (const [orderId, alertTime] of blacklistAlertHistory.entries()) {
      if (currentTime - alertTime > BLACKLIST_ALERT_COOLDOWN) {
        blacklistAlertHistory.delete(orderId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`已清理 ${cleanedCount} 个过期的黑名单提醒记录`);
      }
    }
  }

  // 直接调用抢单API（带重试机制）
  // 注意：此函数已被 grabOrderByClickBtn 替代，保留作为备用方案
  async function grabOrderByApi(orderId) {
    // 检查是否在失败黑名单中
    if (failedOrderBlacklist.has(orderId)) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`运单 ${orderId} 在失败黑名单中，跳过抢单`);
      }
      return false;
    }

    // 检查是否已经有该订单正在抢单
    if (grabbingOrders.has(orderId)) {
      const grabInfo = grabbingOrders.get(orderId);
      if (grabInfo.isGrabbing) {
        if (ENABLE_DEBUG_LOG) {
          console.log(
            `运单 ${orderId} 正在抢单中（重试次数: ${grabInfo.retryCount}），跳过重复请求`
          );
        }
        return false;
      }
    }

    const orderInfo = orderDataMap.get(orderId);
    if (!orderInfo) {
      console.error(`运单 ${orderId} 信息不存在，无法抢单`);
      return false;
    }

    // 初始化抢单信息
    if (!grabbingOrders.has(orderId)) {
      grabbingOrders.set(orderId, { retryCount: 0, isGrabbing: false });
    }

    const grabInfo = grabbingOrders.get(orderId);
    grabInfo.isGrabbing = true;
    grabbingOrders.set(orderId, grabInfo);

    const requestBody = {
      id: orderInfo.id,
      name: orderInfo.name,
      code: orderInfo.code,
      version: orderInfo.version,
      carrier: orderInfo.carrier,
    };

    // 重试循环
    let lastError = null;
    while (grabInfo.retryCount < MAX_RETRY_COUNT) {
      grabInfo.retryCount++;
      console.log(`开始API抢单，运单 ${orderId} (第${grabInfo.retryCount}次尝试):`, requestBody);

      try {
        const response = await fetch('/api/way_bill/dispatch/carrier/grab/order', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            Origin: window.location.origin,
            Referer: window.location.origin + '/',
            DNT: '1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
          },
          body: JSON.stringify(requestBody),
          credentials: 'same-origin',
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`运单 ${orderId} 抢单API响应 (第${grabInfo.retryCount}次):`, result);

          // 判断是否抢单成功
          const isSuccess =
            (result.status === 'SUCCESS' || result.status === '200') &&
            Object.keys(result).length === 1;

          if (isSuccess) {
            // 真正的成功：status为200且没有data字段
            console.log(`运单 ${orderId} 抢单成功! (第${grabInfo.retryCount}次尝试)`);

            // 清理抢单状态
            grabInfo.isGrabbing = false;
            grabbingOrders.delete(orderId);

            // 更新面板数据为成功状态
            if (grabPanelData.todayOrders.has(orderId)) {
              const orderInfo = grabPanelData.todayOrders.get(orderId);
              orderInfo.grabResult = 'success';
              orderInfo.errorMessage = JSON.stringify(result || {});
              grabPanelData.todayOrders.set(orderId, orderInfo);
              savePanelData();

              if (
                isPanelOpen &&
                panelSidebar &&
                panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
              ) {
                renderTodayOrdersTab();
              }
            }
            return true;
          } else {
            // 失败情况：包括明确的失败状态或返回了data字段
            const parameters = JSON.stringify(result.parameters || {});
            let errorReason = `失败信息：${JSON.stringify(result)}`;

            // 判断是否应该添加到黑名单（明确的失败原因，不需要重试）
            const shouldBlacklist =
              parameters.includes('已被其他人操作') ||
              parameters.includes('已被其他承运商抢单') ||
              parameters.includes('数据不存在');

            if (shouldBlacklist) {
              console.error(`运单 ${orderId} 抢单失败，添加到黑名单:`, errorReason);
              failedOrderBlacklist.add(orderId);
              grabInfo.isGrabbing = false;
              grabbingOrders.delete(orderId);

              // 更新面板数据为失败状态
              if (grabPanelData.todayOrders.has(orderId)) {
                const orderInfo = grabPanelData.todayOrders.get(orderId);
                orderInfo.grabResult = 'failed';
                orderInfo.errorMessage = errorReason + ` (重试${grabInfo.retryCount}次后放弃)`;
                grabPanelData.todayOrders.set(orderId, orderInfo);
                savePanelData();

                if (
                  isPanelOpen &&
                  panelSidebar &&
                  panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
                ) {
                  renderTodayOrdersTab();
                }
              }
              return false;
            }

            // 其他失败情况，继续重试
            lastError = errorReason;
            console.warn(`运单 ${orderId} 抢单失败 (第${grabInfo.retryCount}次):`, errorReason);

            // 如果还没达到最大重试次数，等待一小段时间后继续
            if (grabInfo.retryCount < MAX_RETRY_COUNT) {
              await new Promise((resolve) => setTimeout(resolve, 10)); // 等待10ms后重试
            }
          }
        } else {
          // HTTP请求失败
          lastError = `请求失败，状态码: ${response.status}`;
          console.error(
            `运单 ${orderId} 抢单请求失败 (第${grabInfo.retryCount}次)，状态码:`,
            response.status
          );
        }
      } catch (error) {
        lastError = error.message || '网络异常';
        console.error(`运单 ${orderId} 抢单API调用异常 (第${grabInfo.retryCount}次):`, error);
      }
    }

    // 达到最大重试次数，仍然失败
    console.error(`运单 ${orderId} 抢单失败，已重试${MAX_RETRY_COUNT}次，添加到黑名单`);
    failedOrderBlacklist.add(orderId);
    grabInfo.isGrabbing = false;
    grabbingOrders.delete(orderId);

    // 更新面板数据为失败状态
    if (grabPanelData.todayOrders.has(orderId)) {
      const orderInfo = grabPanelData.todayOrders.get(orderId);
      orderInfo.grabResult = 'failed';
      orderInfo.errorMessage = `抢单失败，已重试${MAX_RETRY_COUNT}次。最后错误: ${lastError}`;
      grabPanelData.todayOrders.set(orderId, orderInfo);
      savePanelData();

      if (
        isPanelOpen &&
        panelSidebar &&
        panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
      ) {
        renderTodayOrdersTab();
      }
    }

    return false;
  }

  async function grabOrderByClickBtn(orderId) {
    // 检查是否在失败黑名单中
    if (failedOrderBlacklist.has(orderId)) {
      if (ENABLE_DEBUG_LOG) {
        console.log(`运单 ${orderId} 在失败黑名单中，跳过抢单`);
      }
      return false;
    }

    // 检查是否已经有该订单正在抢单
    if (grabbingOrders.has(orderId)) {
      const grabInfo = grabbingOrders.get(orderId);
      if (grabInfo.isGrabbing) {
        if (ENABLE_DEBUG_LOG) {
          console.log(
            `运单 ${orderId} 正在抢单中（重试次数: ${grabInfo.retryCount}），跳过重复请求`
          );
        }
        return false;
      }
    }

    const orderInfo = orderDataMap.get(orderId);
    if (!orderInfo) {
      console.error(`运单 ${orderId} 信息不存在，无法抢单`);
      return false;
    }

    // 初始化抢单信息
    if (!grabbingOrders.has(orderId)) {
      grabbingOrders.set(orderId, { retryCount: 0, isGrabbing: false });
    }

    const grabInfo = grabbingOrders.get(orderId);
    grabInfo.isGrabbing = true;
    grabbingOrders.set(orderId, grabInfo);

    // 查找所有抢单按钮
    const grabButtons = document.querySelectorAll('.ant-btn.ant-btn-primary.ant-btn-dangerous');
    if (!grabButtons || grabButtons.length === 0) {
      console.error('未找到抢单按钮');
      grabInfo.isGrabbing = false;
      grabbingOrders.delete(orderId);
      return false;
    }

    // 查找订单在列表中的索引
    const tableRows = document.querySelectorAll('.ant-table-body tbody tr[data-row-key]');
    let orderIndex = -1;
    tableRows.forEach((row, index) => {
      const rowKey = row.getAttribute('data-row-key');
      if (rowKey && parseInt(rowKey) === orderId) {
        orderIndex = index;
      }
    });

    if (orderIndex === -1) {
      console.error(`未找到运单 ${orderId} 在表格中的位置`);
      grabInfo.isGrabbing = false;
      grabbingOrders.delete(orderId);
      return false;
    }

    if (orderIndex >= grabButtons.length) {
      console.error(`运单索引 ${orderIndex} 超出按钮数量 ${grabButtons.length}`);
      grabInfo.isGrabbing = false;
      grabbingOrders.delete(orderId);
      return false;
    }

    const targetButton = grabButtons[orderIndex];
    console.log(`准备点击运单 ${orderInfo.code} 的抢单按钮，索引: ${orderIndex}`);

    // 创建Promise来等待抢单结果
    return new Promise((resolve) => {
      // 设置结果监听器
      const resultHandler = (event) => {
        const { orderId: resultOrderId, success, result } = event.detail;
        if (resultOrderId === orderId) {
          window.removeEventListener('grabOrderResult', resultHandler);

          grabInfo.isGrabbing = false;
          grabbingOrders.delete(orderId);

          if (success) {
            console.log(`运单 ${orderId} 抢单成功!`);

            // 更新面板数据为成功状态
            if (grabPanelData.todayOrders.has(orderId)) {
              const orderInfo = grabPanelData.todayOrders.get(orderId);
              orderInfo.grabResult = 'success';
              orderInfo.errorMessage = JSON.stringify(result || {});
              grabPanelData.todayOrders.set(orderId, orderInfo);
              savePanelData();

              if (
                isPanelOpen &&
                panelSidebar &&
                panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
              ) {
                renderTodayOrdersTab();
              }
            }
            resolve(true);
          } else {
            const errorReason = `失败信息：${JSON.stringify(result)}`;
            console.error(`运单 ${orderId} 抢单失败:`, errorReason);

            // 判断是否应该添加到黑名单
            const parameters = JSON.stringify(result.parameters || {});
            const shouldBlacklist =
              parameters.includes('已被其他人操作') ||
              parameters.includes('已被其他承运商抢单') ||
              parameters.includes('数据不存在');

            if (shouldBlacklist) {
              failedOrderBlacklist.add(orderId);
            }

            // 更新面板数据为失败状态
            if (grabPanelData.todayOrders.has(orderId)) {
              const orderInfo = grabPanelData.todayOrders.get(orderId);
              orderInfo.grabResult = 'failed';
              orderInfo.errorMessage = errorReason;
              grabPanelData.todayOrders.set(orderId, orderInfo);
              savePanelData();

              if (
                isPanelOpen &&
                panelSidebar &&
                panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
              ) {
                renderTodayOrdersTab();
              }
            }
            resolve(false);
          }
        }
      };

      // 注册结果监听器
      window.addEventListener('grabOrderResult', resultHandler);

      // 设置超时
      const timeout = setTimeout(() => {
        window.removeEventListener('grabOrderResult', resultHandler);
        console.error(`运单 ${orderId} 抢单超时`);
        grabInfo.isGrabbing = false;
        grabbingOrders.delete(orderId);
        failedOrderBlacklist.add(orderId);
        resolve(false);
      }, 5000); // 5秒超时

      // 点击抢单按钮
      try {
        targetButton.click();
        console.log(`已点击运单 ${orderInfo.code} 的抢单按钮`);

        // 等待确认弹框出现并点击确定按钮
        setTimeout(async () => {
          try {
            // 查找确认弹框中的确定按钮
            const confirmButton = Array.from(document.querySelectorAll('span')).find(
              (el) => el.textContent.trim() == '确定' || el.textContent.trim() == '确 定'
            );
            if (confirmButton) {
              confirmButton.click();
              console.log(`已点击运单 ${orderInfo.code} 的确认按钮`);
            } else {
              console.warn(`未找到运单 ${orderInfo.code} 的确认弹框按钮`);
              clearTimeout(timeout);
              window.removeEventListener('grabOrderResult', resultHandler);
              grabInfo.isGrabbing = false;
              grabbingOrders.delete(orderId);
              resolve(false);
            }
          } catch (error) {
            console.error(`点击确认按钮失败:`, error);
            clearTimeout(timeout);
            window.removeEventListener('grabOrderResult', resultHandler);
            grabInfo.isGrabbing = false;
            grabbingOrders.delete(orderId);
            resolve(false);
          }
        }, 100); // 等待100ms让弹框出现
      } catch (error) {
        console.error(`点击抢单按钮失败:`, error);
        clearTimeout(timeout);
        window.removeEventListener('grabOrderResult', resultHandler);
        grabInfo.isGrabbing = false;
        grabbingOrders.delete(orderId);
        resolve(false);
      }
    });
  }

  // 创建拖拽浮动按钮
  function createGrabPanelFloatButton() {
    if (panelFloatButton && panelFloatButton.parentNode) {
      return; // 已存在，不重复创建
    }

    // 添加浮动按钮的CSS动画样式
    const floatButtonStyle = document.createElement('style');
    floatButtonStyle.textContent = `
            @keyframes float-pulse {
                0%, 100% {
                    transform: translateY(-50%) scale(1);
                    box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
                }
                50% {
                    transform: translateY(-50%) scale(1.05);
                    box-shadow: 0 8px 25px rgba(255, 68, 68, 0.6);
                }
            }
            .grab-panel-float-button {
                animation: float-pulse 3s infinite ease-in-out;
            }
            .grab-panel-float-button:hover {
                animation: none !important;
                transform: translateY(-50%) scale(1.1) !important;
                box-shadow: 0 8px 25px rgba(255, 68, 68, 0.8) !important;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(floatButtonStyle);

    panelFloatButton = document.createElement('div');
    panelFloatButton.className = 'grab-panel-float-button';
    panelFloatButton.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #ff4444, #ff6b35);
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
            transition: all 0.3s ease;
            user-select: none;
            font-size: 12px;
            color: white;
            font-weight: 600;
            border: 3px solid rgba(255, 255, 255, 0.3);
        `;

    // 添加图标和数量显示
    panelFloatButton.innerHTML = `
            <div style="font-size: 22px; margin-bottom: 2px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">📋</div>
            <div class="panel-count" style="font-size: 13px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.5); line-height: 1;">0</div>
        `;

    // 拖拽功能
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    panelFloatButton.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panelFloatButton.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      panelFloatButton.style.cursor = 'grabbing';
      panelFloatButton.style.transition = 'none';

      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      // 边界限制
      const maxLeft = window.innerWidth - panelFloatButton.offsetWidth;
      const maxTop = window.innerHeight - panelFloatButton.offsetHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      panelFloatButton.style.left = newLeft + 'px';
      panelFloatButton.style.top = newTop + 'px';
      panelFloatButton.style.right = 'auto';
      panelFloatButton.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;

      isDragging = false;
      panelFloatButton.style.cursor = 'pointer';
      panelFloatButton.style.transition = 'all 0.3s ease';

      // 自动贴边
      const rect = panelFloatButton.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const windowCenterX = window.innerWidth / 2;

      if (centerX < windowCenterX) {
        // 贴左边
        panelFloatButton.style.left = '20px';
        panelFloatButton.style.right = 'auto';
      } else {
        // 贴右边
        panelFloatButton.style.right = '20px';
        panelFloatButton.style.left = 'auto';
      }
    });

    // 点击事件
    panelFloatButton.addEventListener('click', (e) => {
      if (isDragging) return;
      toggleGrabPanelSidebar();
    });

    // 悬停效果 - 移除原有的悬停效果，使用CSS处理

    document.body.appendChild(panelFloatButton);
    if (ENABLE_DEBUG_LOG) {
      console.log('抢单面板浮动按钮已创建');
    }
  }

  // 更新浮动按钮计数
  function updateFloatButtonCount() {
    if (!panelFloatButton) return;

    const countElement = panelFloatButton.querySelector('.panel-count');
    if (countElement) {
      const todayCount = grabPanelData.todayOrders.size;
      countElement.textContent = todayCount;
    }
  }

  // 创建侧边栏面板
  function createGrabPanelSidebar() {
    if (panelSidebar && panelSidebar.parentNode) {
      return; // 已存在，不重复创建
    }

    panelSidebar = document.createElement('div');
    panelSidebar.className = 'grab-panel-sidebar';
    panelSidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transition: right 0.3s ease;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

    // 面板头部
    const header = document.createElement('div');
    header.style.cssText = `
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
            background: #fafafa;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

    const title = document.createElement('h3');
    title.style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #262626;
        `;
    title.textContent = '自动抢单面板';

    // 右侧按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

    // 全局暂停/继续按钮
    globalPauseButton = document.createElement('button');
    globalPauseButton.className = 'global-pause-btn';
    globalPauseButton.style.cssText = `
            background: ${isGlobalPaused ? '#52c41a' : '#ff4d4f'};
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
    updateGlobalPauseButtonText();

    globalPauseButton.addEventListener('click', toggleGlobalPause);
    globalPauseButton.addEventListener('mouseenter', () => {
      globalPauseButton.style.transform = 'scale(1.05)';
      globalPauseButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    });
    globalPauseButton.addEventListener('mouseleave', () => {
      globalPauseButton.style.transform = 'scale(1)';
      globalPauseButton.style.boxShadow = 'none';
    });

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            color: #999;
            border-radius: 4px;
            transition: all 0.2s;
        `;
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => toggleGrabPanelSidebar());
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#f5f5f5';
      closeBtn.style.color = '#f5222d';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = 'transparent';
      closeBtn.style.color = '#999';
    });

    buttonGroup.appendChild(globalPauseButton);
    buttonGroup.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(buttonGroup);

    // Tab导航
    const tabNav = document.createElement('div');
    tabNav.style.cssText = `
            display: flex;
            border-bottom: 1px solid #f0f0f0;
            background: white;
        `;

    const todayTab = document.createElement('div');
    todayTab.className = 'panel-tab panel-tab-active';
    todayTab.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
            border-bottom: 2px solid #1890ff;
            color: #1890ff;
            font-weight: 500;
            transition: all 0.2s;
        `;
    todayTab.textContent = '今日抢单';

    const historyTab = document.createElement('div');
    historyTab.className = 'panel-tab';
    historyTab.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
            border-bottom: 2px solid transparent;
            color: #666;
            transition: all 0.2s;
        `;
    historyTab.textContent = '历史抢单';

    // Tab切换事件
    todayTab.addEventListener('click', () => switchPanelTab('today'));
    historyTab.addEventListener('click', () => switchPanelTab('history'));

    tabNav.appendChild(todayTab);
    tabNav.appendChild(historyTab);

    // 内容区域
    const content = document.createElement('div');
    content.className = 'panel-content';
    content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: white;
        `;

    // 组装面板
    panelSidebar.appendChild(header);
    panelSidebar.appendChild(tabNav);
    panelSidebar.appendChild(content);

    document.body.appendChild(panelSidebar);
    if (ENABLE_DEBUG_LOG) {
      console.log('抢单面板侧边栏已创建');
    }
  }

  // 切换面板Tab
  function switchPanelTab(tabType) {
    const tabs = panelSidebar.querySelectorAll('.panel-tab');
    tabs.forEach((tab) => {
      tab.classList.remove('panel-tab-active');
      tab.style.borderBottomColor = 'transparent';
      tab.style.color = '#666';
      tab.style.fontWeight = 'normal';
    });

    const activeTab = tabType === 'today' ? tabs[0] : tabs[1];
    activeTab.classList.add('panel-tab-active');
    activeTab.style.borderBottomColor = '#1890ff';
    activeTab.style.color = '#1890ff';
    activeTab.style.fontWeight = '500';

    // 渲染对应内容
    if (tabType === 'today') {
      renderTodayOrdersTab();
    } else {
      renderHistoryOrdersTab();
    }
  }

  // 渲染今日抢单Tab
  function renderTodayOrdersTab() {
    const content = panelSidebar.querySelector('.panel-content');
    content.innerHTML = '';

    if (grabPanelData.todayOrders.size === 0) {
      content.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                    <div style="font-size: 16px;">暂无今日抢单数据</div>
                    <div style="font-size: 12px; margin-top: 8px;">数据将在检测到抢单操作时自动记录</div>
                </div>
            `;
      return;
    }

    // 按时间排序（最新的在上面）
    const sortedOrders = Array.from(grabPanelData.todayOrders.values()).sort(
      (a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0)
    );

    sortedOrders.forEach((orderData, index) => {
      const orderItem = createOrderListItem(index, orderData);
      content.appendChild(orderItem);
    });
  }

  // 渲染历史抢单Tab
  function renderHistoryOrdersTab() {
    const content = panelSidebar.querySelector('.panel-content');
    content.innerHTML = '';

    if (grabPanelData.historyOrders.size === 0) {
      content.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
                    <div style="font-size: 16px;">暂无历史抢单数据</div>
                    <div style="font-size: 12px; margin-top: 8px;">历史数据将在今日数据过期后转移到此处</div>
                </div>
            `;
      return;
    }

    // 按时间排序（最新的在上面）
    const sortedOrders = Array.from(grabPanelData.historyOrders.values()).sort(
      (a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0)
    );

    sortedOrders.forEach((orderData, index) => {
      const orderItem = createOrderListItem(index, orderData);
      content.appendChild(orderItem);
    });
  }

  // 创建订单列表项
  function createOrderListItem(index, orderData) {
    const item = document.createElement('div');
    item.style.cssText = `
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s;
        `;
    item.addEventListener('mouseenter', () => (item.style.backgroundColor = '#f5f5f5'));
    item.addEventListener('mouseleave', () => (item.style.backgroundColor = 'transparent'));

    // 订单基本信息
    const orderInfo = document.createElement('div');
    orderInfo.style.cssText = 'margin-bottom: 8px;';

    // 高亮处理
    const highlightedDestination = highlightKeywords(
      orderData.destinationName || '未知',
      destinationList
    );
    const highlightedNote = highlightKeywords(orderData.note || '', [
      ...(noteConfig.whitelist || []),
      ...(noteConfig.blacklist || []),
    ]);

    orderInfo.innerHTML = `
            <div style="font-size: 14px; font-weight: 500; color: #262626; margin-bottom: 4px;">
                ${index + 1}.${orderData.code || orderData.id}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 2px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">📍 目的地: ${highlightedDestination}</span>
            </div>
            ${
              orderData.planAllocateTime
                ? `
                <div style="font-size: 12px; color: #666; margin-bottom: 2px;">
                    ⏰ 可抢单时间: ${
                      typeof orderData.planAllocateTime === 'number'
                        ? new Date(orderData.planAllocateTime * 1000).toLocaleString()
                        : new Date(orderData.planAllocateTime).toLocaleString()
                    }
                </div>
            `
                : ''
            }
            ${
              orderData.note
                ? `
                <div style="font-size: 12px; color: #666; margin-bottom: 2px;">
                    💬 备注: ${highlightedNote}
                </div>
            `
                : ''
            }
        `;

    // 抢单结果
    const resultInfo = document.createElement('div');
    resultInfo.style.cssText = `
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 8px;
            font-weight: 500;
        `;

    if (orderData.grabResult === 'success') {
      resultInfo.style.backgroundColor = '#f6ffed';
      resultInfo.style.color = '#389e0d';
      resultInfo.style.border = '1px solid #b7eb8f';
      resultInfo.innerHTML = `
                <div>✅ 抢单成功</div>
                ${orderData.errorMessage ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">${orderData.errorMessage}</div>` : ''}
            `;
    } else if (orderData.grabResult === 'failed') {
      resultInfo.style.backgroundColor = '#fff2f0';
      resultInfo.style.color = '#cf1322';
      resultInfo.style.border = '1px solid #ffccc7';
      resultInfo.innerHTML = `
                <div>❌ 抢单失败</div>
                ${orderData.errorMessage ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">${orderData.errorMessage}</div>` : ''}
            `;
    } else if (orderData.grabResult === 'not_matched') {
      resultInfo.style.backgroundColor = '#fff7e6';
      resultInfo.style.color = '#d48806';
      resultInfo.style.border = '1px solid #ffd591';
      resultInfo.innerHTML = `
                <div>⚠️ 未匹配</div>
                ${orderData.errorMessage ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">${orderData.errorMessage}</div>` : ''}
            `;
    } else if (orderData.grabResult === 'not_enabled') {
      resultInfo.style.backgroundColor = '#f0f5ff';
      resultInfo.style.color = '#1890ff';
      resultInfo.style.border = '1px solid #adc6ff';
      resultInfo.innerHTML = `
                <div>ℹ️ 未启用自动抢单</div>
                ${orderData.errorMessage ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">${orderData.errorMessage}</div>` : ''}
            `;
    } else if (orderData.grabResult === 'pending') {
      resultInfo.style.backgroundColor = '#e6fffb';
      resultInfo.style.color = '#13c2c2';
      resultInfo.style.border = '1px solid #87e8de';
      resultInfo.textContent = '⏳ 等待抢单';
    } else {
      resultInfo.style.backgroundColor = '#f0f0f0';
      resultInfo.style.color = '#666';
      resultInfo.style.border = '1px solid #d9d9d9';
      resultInfo.textContent = '⏳ 未知状态';
    }

    item.appendChild(orderInfo);
    item.appendChild(resultInfo);

    return item;
  }

  // 关键字高亮处理
  function highlightKeywords(text, keywords) {
    if (!text || !keywords || keywords.length === 0) {
      return text;
    }

    let highlightedText = text;
    keywords.forEach((keyword) => {
      if (keyword && text.includes(keyword)) {
        const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
        highlightedText = highlightedText.replace(
          regex,
          '<span style="background: #fff2f0; color: #cf1322; padding: 1px 2px; border-radius: 2px; font-weight: 500;">$1</span>'
        );
      }
    });

    return highlightedText;
  }

  // 转义正则表达式特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 切换面板显示/隐藏
  function toggleGrabPanelSidebar() {
    if (!panelSidebar) {
      createGrabPanelSidebar();
    }

    isPanelOpen = !isPanelOpen;

    if (isPanelOpen) {
      panelSidebar.style.right = '0px';
      // 默认显示今日抢单Tab
      switchPanelTab('today');
    } else {
      panelSidebar.style.right = '-400px';
    }
  }

  // 更新全局暂停按钮文本
  function updateGlobalPauseButtonText() {
    if (!globalPauseButton) return;

    if (isGlobalPaused) {
      globalPauseButton.innerHTML = `
                <span>▶️</span>
                <span>继续抢单</span>
            `;
      globalPauseButton.style.background = '#52c41a';
      globalPauseButton.title = '点击继续所有自动抢单任务';
    } else {
      globalPauseButton.innerHTML = `
                <span>⏸️</span>
                <span>暂停抢单</span>
            `;
      globalPauseButton.style.background = '#ff4d4f';
      globalPauseButton.title = '点击暂停所有自动抢单任务';
    }
  }

  // 切换全局暂停状态
  function toggleGlobalPause() {
    isGlobalPaused = !isGlobalPaused;

    if (ENABLE_DEBUG_LOG) {
      console.log(`全局自动抢单${isGlobalPaused ? '已暂停' : '已继续'}`);
    }

    // 更新按钮UI
    updateGlobalPauseButtonText();

    // 显示状态提示
    showGlobalPauseToast();

    // 如果恢复抢单，重新检查所有待处理的任务
    if (!isGlobalPaused) {
      resumeAllPausedTasks();
    }
  }

  // 显示全局暂停状态提示
  function showGlobalPauseToast() {
    const toast = document.createElement('div');
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isGlobalPaused ? '#fff2f0' : '#f6ffed'};
            border: 1px solid ${isGlobalPaused ? '#ffccc7' : '#b7eb8f'};
            color: ${isGlobalPaused ? '#cf1322' : '#389e0d'};
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInRight 0.3s ease-out;
        `;

    toast.innerHTML = `
            <span style="font-size: 18px;">${isGlobalPaused ? '⏸️' : '▶️'}</span>
            <span>${isGlobalPaused ? '自动抢单已暂停' : '自动抢单已继续'}</span>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 3000);
  }

  // 恢复所有被暂停的任务
  function resumeAllPausedTasks() {
    // 重新检查目的地匹配逻辑
    if (settings.enableDestinationMatch) {
      processDestinationMatching();
    }

    if (ENABLE_DEBUG_LOG) {
      console.log('已恢复所有自动抢单任务');
    }
  }

  // 添加订单到面板数据
  function addOrderToPanelData(orderData, grabResult, errorMessage = null) {
    const today = new Date().toDateString();
    const orderId = orderData.id;

    // 检查订单是否已存在
    if (grabPanelData.todayOrders.has(orderId)) {
      const existingOrder = grabPanelData.todayOrders.get(orderId);

      // 如果已存在的订单有终态状态(success/failed)，保留原状态，不覆盖
      if (existingOrder.grabResult === 'success' || existingOrder.grabResult === 'failed') {
        if (ENABLE_DEBUG_LOG) {
          console.log(
            `订单 ${orderData.code} (ID: ${orderId}) 已有终态状态 ${existingOrder.grabResult}，不覆盖`
          );
        }
        return;
      }

      // 如果新状态也是非终态(pending/not_matched/not_enabled)，更新状态
      if (ENABLE_DEBUG_LOG) {
        console.log(
          `订单 ${orderData.code} (ID: ${orderId}) 状态更新: ${existingOrder.grabResult} -> ${grabResult}`
        );
      }
    }

    const orderInfo = {
      id: orderData.id,
      code: orderData.code,
      destinationName: orderData.destinationName || '未知',
      note: orderData.note || '',
      planAllocateTime: orderData.planAllocateTime,
      grabResult: grabResult, // 'success', 'failed', 'pending', 'not_matched', 'not_enabled'
      errorMessage: errorMessage,
      createTime: grabPanelData.todayOrders.has(orderId)
        ? grabPanelData.todayOrders.get(orderId).createTime
        : new Date().toISOString(),
      date: today,
    };

    grabPanelData.todayOrders.set(orderData.id, orderInfo);
    savePanelData();
    updateFloatButtonCount();

    // 如果面板当前打开且显示今日Tab，更新显示
    if (
      isPanelOpen &&
      panelSidebar &&
      panelSidebar.querySelector('.panel-tab-active').textContent === '今日抢单'
    ) {
      renderTodayOrdersTab();
    }

    if (ENABLE_DEBUG_LOG) {
      console.log('订单已添加/更新到面板数据:', orderInfo);
    }
  }

  // 清理过期数据（将今日之前的数据移动到历史数据）
  function cleanupExpiredData() {
    const today = new Date().toDateString();
    let hasExpiredData = false;

    grabPanelData.todayOrders.forEach((orderData, orderId) => {
      if (orderData.date !== today) {
        grabPanelData.historyOrders.set(orderId, orderData);
        grabPanelData.todayOrders.delete(orderId);
        hasExpiredData = true;
      }
    });

    if (hasExpiredData) {
      savePanelData();
      updateFloatButtonCount();
      if (ENABLE_DEBUG_LOG) {
        console.log('过期数据已清理并移动到历史记录');
      }
    }
  }

  if (ENABLE_DEBUG_LOG) {
    console.log('已添加测试函数 window.testSettings()，可在控制台运行测试');
  }

  // 导出配置功能
  function exportConfiguration() {
    try {
      // 收集所有配置数据
      const configData = {
        settings: settings,
        destinationConfig: destinationConfig,
        noteConfig: noteConfig,
        grabRules: grabRules, // 新增：导出抢单规则
        exportTime: new Date().toISOString(),
        version: '2.0.0', // 版本号升级
      };

      // 创建下载文件
      const dataStr = JSON.stringify(configData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      // 创建下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `运单助手配置_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 清理URL对象
      URL.revokeObjectURL(url);

      // 显示成功提示
      showConfigMessage('✅ 配置导出成功', 'success');
      if (ENABLE_DEBUG_LOG) {
        console.log('配置导出成功:', configData);
      }
    } catch (error) {
      console.error('配置导出失败:', error);
      showConfigMessage('❌ 配置导出失败: ' + error.message, 'error');
    }
  }

  // 导入配置功能
  function importConfiguration(tempSettings) {
    try {
      // 创建文件输入元素
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.style.display = 'none';

      fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const importedConfig = JSON.parse(e.target.result);

            // 验证配置文件格式
            if (!validateConfigFormat(importedConfig)) {
              showConfigMessage('❌ 配置文件格式不正确', 'error');
              return;
            }

            // 检查是否有现有配置
            const hasExistingConfig = checkExistingConfig();

            if (hasExistingConfig) {
              showOverwriteConfirmDialog(importedConfig, tempSettings);
            } else {
              applyImportedConfig(importedConfig, tempSettings);
            }
          } catch (parseError) {
            console.error('解析配置文件失败:', parseError);
            showConfigMessage('❌ 配置文件解析失败: ' + parseError.message, 'error');
          }
        };

        reader.readAsText(file);
      };

      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    } catch (error) {
      console.error('配置导入失败:', error);
      showConfigMessage('❌ 配置导入失败: ' + error.message, 'error');
    }
  }

  // 验证配置文件格式
  function validateConfigFormat(config) {
    return (
      config && typeof config === 'object' && config.settings && typeof config.settings === 'object'
    );
  }

  // 检查是否有现有配置
  function checkExistingConfig() {
    return (
      // 检查设置是否有非默认值
      settings.enableAutoGrab ||
      settings.showCountdown ||
      settings.enableAutoRefresh ||
      settings.skipGrabConfirm ||
      settings.enableDestinationMatch ||
      // 检查目的地配置
      (destinationConfig.whitelist && destinationConfig.whitelist.length > 0) ||
      (destinationConfig.blacklist && destinationConfig.blacklist.length > 0) ||
      // 检查备注配置
      (noteConfig.whitelist && noteConfig.whitelist.length > 0) ||
      (noteConfig.blacklist && noteConfig.blacklist.length > 0) ||
      // 检查抢单规则（新增）
      (grabRules.rules && grabRules.rules.length > 0)
    );
  }

  // 显示覆盖确认对话框
  function showOverwriteConfirmDialog(importedConfig, tempSettings) {
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

    const confirmContent = document.createElement('div');
    confirmContent.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 8px;
            min-width: 400px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

    confirmContent.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 24px; color: #faad14; margin-right: 12px;">⚠️</span>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">确认覆盖配置</h3>
            </div>
            <div style="margin-bottom: 20px; color: #666; line-height: 1.5;">
                <p style="margin: 0 0 12px 0;">检测到您已有现有配置，导入新配置将会覆盖以下内容：</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                    <li>所有设置选项</li>
                    <li>目的地白名单和黑名单</li>
                    <li>备注过滤配置</li>
                </ul>
                <p style="margin: 12px 0 0 0; color: #ff4d4f; font-size: 14px;">此操作不可撤销，请确认是否继续？</p>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button class="cancel-import-btn" style="padding: 8px 16px; border: 1px solid #d9d9d9; background: white; border-radius: 6px; cursor: pointer;">取消</button>
                <button class="confirm-import-btn" style="padding: 8px 16px; background: #ff4d4f; color: white; border: none; border-radius: 6px; cursor: pointer;">确认覆盖</button>
            </div>
        `;

    confirmModal.appendChild(confirmContent);
    document.body.appendChild(confirmModal);

    // 取消按钮事件
    confirmContent.querySelector('.cancel-import-btn').onclick = () => {
      document.body.removeChild(confirmModal);
      showConfigMessage('ℹ️ 导入已取消', 'info');
    };

    // 确认按钮事件
    confirmContent.querySelector('.confirm-import-btn').onclick = () => {
      document.body.removeChild(confirmModal);
      applyImportedConfig(importedConfig, tempSettings);
    };

    // 点击遮罩层关闭
    confirmModal.onclick = (e) => {
      if (e.target === confirmModal) {
        document.body.removeChild(confirmModal);
        showConfigMessage('ℹ️ 导入已取消', 'info');
      }
    };
  }

  // 应用导入的配置
  function applyImportedConfig(importedConfig, tempSettings) {
    try {
      // 应用设置
      if (importedConfig.settings) {
        Object.assign(tempSettings, importedConfig.settings);
        if (ENABLE_DEBUG_LOG) {
          console.log('已应用导入的设置:', importedConfig.settings);
        }
      }

      // 应用目的地配置
      if (importedConfig.destinationConfig) {
        destinationConfig = { ...destinationConfig, ...importedConfig.destinationConfig };
        saveDestinationConfig();
        if (ENABLE_DEBUG_LOG) {
          console.log('已应用导入的目的地配置:', importedConfig.destinationConfig);
        }
      }

      // 应用备注配置
      if (importedConfig.noteConfig) {
        noteConfig = { ...noteConfig, ...importedConfig.noteConfig };
        saveNoteConfig();
        if (ENABLE_DEBUG_LOG) {
          console.log('已应用导入的备注配置:', importedConfig.noteConfig);
        }
      }

      // 应用抢单规则（新增）
      if (importedConfig.grabRules) {
        grabRules = {
          enabled: importedConfig.grabRules.enabled !== undefined ? importedConfig.grabRules.enabled : false,
          rules: Array.isArray(importedConfig.grabRules.rules) ? importedConfig.grabRules.rules.map(rule => ({
            ...rule,
            action: rule.action || 'grab' // 确保旧导入配置有默认动作
          })) : []
        };
        saveGrabRules();
        if (ENABLE_DEBUG_LOG) {
          console.log('已应用导入的抢单规则:', importedConfig.grabRules);
        }
      }

      // 显示成功提示
      const importTime = importedConfig.exportTime
        ? new Date(importedConfig.exportTime).toLocaleString()
        : '未知';
      const version = importedConfig.version || '旧版本';
      showConfigMessage(`✅ 配置导入成功 (版本: ${version}, 导出时间: ${importTime})`, 'success');

      // 提示用户需要保存
      setTimeout(() => {
        showConfigMessage('💡 请点击"保存"按钮以应用导入的配置', 'info');
      }, 2000);
    } catch (error) {
      console.error('应用导入配置失败:', error);
      showConfigMessage('❌ 应用导入配置失败: ' + error.message, 'error');
    }
  }

  // 显示配置相关消息
  function showConfigMessage(message, type = 'info') {
    const toast = document.createElement('div');

    let bgColor, borderColor, textColor;
    switch (type) {
      case 'success':
        bgColor = '#f6ffed';
        borderColor = '#b7eb8f';
        textColor = '#389e0d';
        break;
      case 'error':
        bgColor = '#fff2f0';
        borderColor = '#ffccc7';
        textColor = '#cf1322';
        break;
      case 'info':
        bgColor = '#e6f7ff';
        borderColor = '#91d5ff';
        textColor = '#0958d9';
        break;
      default:
        bgColor = '#f0f0f0';
        borderColor = '#d9d9d9';
        textColor = '#666';
    }

    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            color: ${textColor};
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10002;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 350px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 4000);
  }

  // 启动脚本
  init();
})();
