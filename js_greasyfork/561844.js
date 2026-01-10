// ==UserScript==
// @name         VNDB Steam 信息助手
// @namespace    https://vndb.org/
// @version      5.8.1
// @description  在 VNDB 页面实时显示 Steam 国区价格、折扣及库存状态
// @author       Your Name
// @match        *://vndb.org/*
// @icon         https://vndb.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      api.vndb.org
// @connect      store.steampowered.com
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561844/VNDB%20Steam%20%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561844/VNDB%20Steam%20%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        VNDB Steam 信息助手 - 代码结构说明                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║ 本脚本用于在 VNDB (Visual Novel Database) 页面上显示 Steam 国区价格信息。       ║
 * ║                                                                              ║
 * ║ 【主要功能】                                                                  ║
 * ║ 1. 检测页面上的 VN (视觉小说) 和 Release (发行版本) 链接                        ║
 * ║ 2. 通过 VNDB API 查询对应的 Steam AppID                                       ║
 * ║ 3. 通过 Steam API 获取国区价格、折扣信息                                       ║
 * ║ 4. 在页面上显示价格徽章，并标记已拥有的游戏                                     ║
 * ║                                                                              ║
 * ║ 【代码分段索引】(供 AI 修改时引用)                                             ║
 * ║ SECTION 1:  调试工具 (DEBUG 开关和日志函数)                                    ║
 * ║ SECTION 2:  常量定义 (存储前缀、缓存时间策略)                                   ║
 * ║ SECTION 3:  配置管理 (默认设置、用户设置读取)                                   ║
 * ║ SECTION 4:  全局状态变量                                                      ║
 * ║ SECTION 5:  GM 存储适配层 (封装 GM_* 函数)                                     ║
 * ║ SECTION 6:  网络请求封装 (gmFetch 函数)                                        ║
 * ║ SECTION 7:  VNDB API 交互 (批量查询 Steam ID)                                 ║
 * ║ SECTION 8:  Steam API 交互 (获取价格、已拥有游戏)                               ║
 * ║ SECTION 9:  UI 组件 - 全局变量声明                                            ║
 * ║ SECTION 10: UI 组件 - CSS 样式注入                                            ║
 * ║ SECTION 11: UI 组件 - 进度管理器 (ProgressManager)                            ║
 * ║ SECTION 12: 缓存辅助函数                                                      ║
 * ║ SECTION 13: UI 组件 - 设置面板                                                ║
 * ║ SECTION 14: UI 组件 - 底部状态栏                                              ║
 * ║ SECTION 15: 倒计时等待函数                                                    ║
 * ║ SECTION 16: 处理队列类 (ProcessingQueue)                                      ║
 * ║ SECTION 17: 徽章渲染函数 (renderBadges)                                       ║
 * ║ SECTION 17.5: 自动标记 Release 状态功能 (autoMarkObtained)                    ║
 * ║ SECTION 18: 页面解析辅助函数                                                  ║
 * ║ SECTION 19: Steam 价格获取与缓存 (核心逻辑)                                    ║
 * ║ SECTION 20: 主逻辑入口 - 初始化                                               ║
 * ║ SECTION 21: 主逻辑 - Release 页面处理 (/r 页面)                               ║
 * ║ SECTION 22: 主逻辑 - VN 页面和列表页处理 (/v 页面及列表)                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

(async function() {
  'use strict';

  // ============================================================================
  // SECTION 1: 调试工具
  // ============================================================================
  // 【作用】提供调试日志输出功能，可通过 DEBUG 开关控制是否输出
  // 【修改建议】如需关闭调试输出，将 DEBUG 改为 false
  // ============================================================================

  const DEBUG = true;

  function debugLog(...args) {
    if (DEBUG) console.log('[VNDB Steam Debug]', ...args);
  }

  function debugWarn(...args) {
    if (DEBUG) console.warn('[VNDB Steam Debug]', ...args);
  }

  function debugError(...args) {
    if (DEBUG) console.error('[VNDB Steam Debug]', ...args);
  }

  // ============================================================================
  // SECTION 2: 常量定义 - 存储前缀与缓存时间策略
  // ============================================================================
  // 【作用】定义缓存键前缀和不同状态的缓存过期时间
  // 【存储前缀说明】
  //   - STORAGE_PREFIX_V: 用于 /v (VN详情页) 的缓存
  //   - STORAGE_PREFIX_R: 用于 /r (Release详情页) 的缓存
  //   - STORAGE_PREFIX_STEAM: 用于单个 Steam AppID 的价格缓存
  // 【缓存策略】
  //   - 打折中的游戏: 缓存1天 (因为折扣可能随时结束)
  //   - 其他状态: 缓存1年 (视为永久)
  //   - 限流失败: 不缓存 (返回0)
  // ============================================================================

  const STORAGE_PREFIX_V = 'vndb_steam_v26_v_';
  const STORAGE_PREFIX_R = 'vndb_steam_v26_r_';
  const STORAGE_PREFIX_STEAM = 'vndb_steam_v26_s_';

  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const PERMANENT = 365 * ONE_DAY; // "永久" = 1年

  /**
   * 根据数据状态返回缓存持续时间
   * @param {Object} data - Steam 价格数据对象
   * @returns {number} 缓存时间(毫秒)，0表示不缓存
   */
  function getCacheDuration(data) {
    if (!data) return ONE_HOUR;

    // 限流导致的失败 - 不缓存
    if (data.status === 'rate_limited') return 0;

    // 打折中 - 1天
    if (data.status === 'released' && data.discount > 0) return ONE_DAY;

    // 其他状态（已拥有、原价、锁区、免费、即将推出、已下架）- 永久
    return PERMANENT;
  }

  // ============================================================================
  // SECTION 3: 配置管理
  // ============================================================================
  // 【作用】定义默认配置和读取用户保存的设置
  // 【配置项说明】
  //   - vndbDelay: VNDB API 请求间隔(毫秒)，过短会触发 429 限流
  //   - steamDelay: Steam API 请求间隔(毫秒)
  //   - steamConcurrency: Steam API 并发请求数
  // 【修改建议】如需调整默认值，修改 DEFAULTS 对象
  // ============================================================================

  const DEFAULTS = {
    vndbDelay: 5500,      // VNDB API 每批次(20个)查询后的冷却时间
    steamDelay: 1200,     // Steam 单个价格查询的间隔时间
    steamConcurrency: 2,  // Steam 同时进行的查询数量
    autoMarkObtained: false  // 自动将已拥有的 Steam 游戏标记为 "Obtained"
  };

  /**
   * 获取用户设置，如无则使用默认值
   * @returns {Object} 合并后的设置对象
   */
  function getSettings() {
    const saved = localStorage.getItem('vndb_steam_settings');
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  }

  // ============================================================================
  // SECTION 4: 全局状态变量
  // ============================================================================
  // 【作用】存储运行时状态
  // 【变量说明】
  //   - SETTINGS: 当前生效的配置
  //   - OWNED_SET: 用户已拥有的 Steam 游戏 AppID 集合
  //   - IS_STOPPED: 用户是否手动停止了任务
  //   - STATS: 统计信息 (成功/失败计数)
  // ============================================================================

  let SETTINGS = getSettings();
  let OWNED_SET = new Set();
  let IS_STOPPED = false;
  let STATS = { success: 0, fail: 0 };

  // ============================================================================
  // SECTION 5: GM 存储适配层
  // ============================================================================
  // 【作用】封装 GM_* 存储函数，提供类似 chrome.storage 的异步接口
  // 【方法说明】
  //   - get(keys): 获取指定键或所有键的值
  //   - set(obj): 批量设置键值对
  //   - clear(): 清除所有存储
  // 【注意】所有值都会经过 JSON 序列化/反序列化
  // ============================================================================

  const storage = {
    /**
     * 获取存储的值
     * @param {null|Array} keys - null获取全部，数组获取指定键
     * @returns {Promise<Object>} 键值对对象
     */
    async get(keys) {
      const result = {};
      if (keys === null) {
        // 获取所有
        const allKeys = GM_listValues();
        for (const key of allKeys) {
          try {
            result[key] = JSON.parse(GM_getValue(key, 'null'));
          } catch (e) {
            result[key] = GM_getValue(key, null);
          }
        }
      } else if (Array.isArray(keys)) {
        for (const key of keys) {
          try {
            result[key] = JSON.parse(GM_getValue(key, 'null'));
          } catch (e) {
            result[key] = GM_getValue(key, null);
          }
        }
      }
      return result;
    },

    /**
     * 批量设置值
     * @param {Object} obj - 要存储的键值对
     */
    async set(obj) {
      for (const [key, value] of Object.entries(obj)) {
        GM_setValue(key, JSON.stringify(value));
      }
    },

    /**
     * 清除所有存储
     */
    async clear() {
      const allKeys = GM_listValues();
      for (const key of allKeys) {
        GM_deleteValue(key);
      }
    }
  };

  // ============================================================================
  // SECTION 6: 网络请求封装
  // ============================================================================
  // 【作用】封装 GM_xmlhttpRequest 为类似 fetch 的 Promise 接口
  // 【特点】支持跨域请求 (需要在 @connect 中声明域名)
  // 【返回值】模拟 fetch 的 Response 对象，包含 ok, status, json() 方法
  // ============================================================================

  /**
   * 封装 GM_xmlhttpRequest 为 Promise
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项 {method, headers, body}
   * @returns {Promise<Object>} 类似 fetch Response 的对象
   */
  function gmFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url,
        headers: options.headers || {},
        data: options.body || null,
        responseType: 'json',
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve({
              ok: true,
              status: response.status,
              json: () => Promise.resolve(response.response)
            });
          } else {
            resolve({
              ok: false,
              status: response.status,
              json: () => Promise.resolve(response.response)
            });
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  // ============================================================================
  // SECTION 7: VNDB API 交互
  // ============================================================================
  // 【作用】批量查询 VNDB API，获取 VN 对应的 Steam AppID
  // 【API 端点】https://api.vndb.org/kana/release
  // 【查询逻辑】
  //   1. 对每个 VN ID 查询其所有 Release
  //   2. 从 Release 的 extlinks 中提取 Steam 链接
  //   3. 从 Steam 链接中解析出 AppID
  // 【限流处理】遇到 429 状态码时返回 Throttled 错误
  // ============================================================================

  /**
   * 批量查询 VNDB API 获取 Steam ID
   * @param {Array<string>} vnIds - VN ID 数组 (不带 'v' 前缀)
   * @returns {Promise<Object>} {success: boolean, data?: {vid: [appids]}, error?: string}
   */
  async function handleSafeBatchQuery(vnIds) {
    try {
      const resultMap = {};
      const targetIds = vnIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id)).map(id => "v" + id);
      let hitRateLimit = false;

      console.log(`[VNDB Steam] 收到查询请求: ${targetIds.length} 个`);

      await Promise.all(targetIds.map(async (vid) => {
        if (hitRateLimit) return;

        try {
          const response = await gmFetch('https://api.vndb.org/kana/release', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filters: ["vn", "=", ["id", "=", vid]],
              fields: "id, extlinks.url, released",
              results: 100,
              sort: "released",
              reverse: true
            })
          });

          // 检查限流
          if (response.status === 429) {
            hitRateLimit = true;
            console.error("❌ VNDB Rate Limit Hit (429)!");
            return;
          }

          if (!response.ok) return;

          const data = await response.json();
          const steamIds = new Set();

          // 从 extlinks 中提取 Steam 链接
          data.results.forEach(release => {
            if (release.extlinks && Array.isArray(release.extlinks)) {
              release.extlinks.forEach(link => {
                const url = link.url || (typeof link === 'string' ? link : '');
                if (url && url.includes('store.steampowered.com/app/')) {
                  const match = url.match(/app\/(\d+)/);
                  if (match) steamIds.add(match[1]);
                }
              });
            }
          });

          if (steamIds.size > 0) {
            const rawId = vid.replace('v', '');
            resultMap[rawId] = Array.from(steamIds);
          }

        } catch (err) {
          console.error(`Fetch error for ${vid}`, err);
        }
      }));

      if (hitRateLimit) return { success: false, error: 'Throttled' };
      return { success: true, data: resultMap };

    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // ============================================================================
  // SECTION 8: Steam API 交互
  // ============================================================================
  // 【作用】与 Steam Store API 交互，获取价格和已拥有游戏信息
  // 【包含函数】
  //   - handleGetPrice: 获取单个游戏的价格信息
  //   - handleGetOwnedGames: 获取当前登录用户已拥有的游戏列表
  // 【注意】需要用户在浏览器中登录 Steam 才能获取已拥有游戏
  // ============================================================================

  /**
   * 获取 Steam 游戏价格信息
   * @param {string} appid - Steam AppID
   * @returns {Promise<Object>} {success: boolean, data?: Object, error?: string}
   */
  async function handleGetPrice(appid) {
    try {
      const res = await gmFetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=CN&l=schinese&filters=price_overview,basic,type,release_date`
      );
      const data = await res.json();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取用户已拥有的 Steam 游戏列表
   * 【依赖】需要用户在浏览器中登录 Steam
   * @returns {Promise<Object>} {success: boolean, data?: Array<number>, error?: string}
   */
  async function handleGetOwnedGames() {
    try {
      const res = await gmFetch('https://store.steampowered.com/dynamicstore/userdata/');

      if (!res.ok) {
        return { success: false, error: 'Not logged in or network error' };
      }

      const data = await res.json();

      if (data && data.rgOwnedApps && Array.isArray(data.rgOwnedApps)) {
        return { success: true, data: data.rgOwnedApps };
      } else {
        return { success: false, error: 'No ownership data found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // SECTION 9: UI 组件 - 全局变量声明
  // ============================================================================
  // 【作用】声明 UI 相关的全局变量
  // 【变量说明】
  //   - statusTxT: 状态文本元素
  //   - statusContainer: 底部状态栏容器
  //   - progressBar1/2: 两个阶段的进度条元素
  //   - progressLabel1/2: 进度标签元素
  //   - settingsPanel: 设置面板元素
  //   - currentPageCacheKeys: 当前页面相关的缓存键集合
  // ============================================================================

  let statusTxT = null;
  let statusContainer = null;
  let progressBar1 = null;  // 阶段1进度条（VNDB API / Release处理）
  let progressBar2 = null;  // 阶段2进度条（Steam 价格获取）
  let progressLabel1 = null; // 阶段1标签
  let progressLabel2 = null; // 阶段2标签
  let settingsPanel = null;
  let currentPageCacheKeys = new Set();

  // ============================================================================
  // SECTION 10: UI 组件 - CSS 样式注入
  // ============================================================================
  // 【作用】注入自定义 CSS 样式到页面
  // 【包含样式】
  //   - 进度条动画 (shimmer, pulse, slide)
  //   - 状态栏样式
  //   - 按钮悬停效果
  //   - 徽章样式
  //   - 设置面板动画
  //   - 冷却指示器样式
  // 【修改建议】如需修改视觉样式，在此 section 修改
  // ============================================================================

  /**
   * 注入 CSS 样式到页面 <head>
   */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 进度条闪烁动画 */
      @keyframes vndb-steam-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      /* 脉冲动画 */
      @keyframes vndb-steam-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }

      /* 滑动动画 - 用于进度条活动状态 */
      @keyframes vndb-steam-slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      /* 进度条基础样式 */
      .vndb-steam-progress-bar {
        position: relative;
        overflow: hidden;
      }

      /* 进度条活动状态 - 显示滑动高光 */
      .vndb-steam-progress-bar.active::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.3) 50%,
          transparent 100%
        );
        animation: vndb-steam-slide 1.5s ease-in-out infinite;
      }

      /* 状态栏毛玻璃效果 */
      .vndb-steam-status-container {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      /* 按钮基础样式 */
      .vndb-steam-btn {
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .vndb-steam-btn:hover {
        transform: translateY(-1px);
      }

      .vndb-steam-btn:active {
        transform: translateY(0);
      }

      /* 徽章样式 */
      .vndb-steam-badge {
        transition: all 0.2s ease;
        position: relative;
      }

      .vndb-steam-badge:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }

      /* 设置面板淡入动画 */
      .vndb-steam-settings-panel {
        animation: vndb-steam-fadeIn 0.2s ease;
      }

      @keyframes vndb-steam-fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* 冷却指示器 */
      .vndb-steam-cooldown-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 8px;
        background: rgba(241, 196, 15, 0.15);
        border-radius: 4px;
        font-size: 11px;
        color: #f1c40f;
      }

      /* 冷却旋转动画 */
      .vndb-steam-cooldown-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid rgba(241, 196, 15, 0.3);
        border-top-color: #f1c40f;
        border-radius: 50%;
        animation: vndb-steam-spin 1s linear infinite;
      }

      @keyframes vndb-steam-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // SECTION 11: UI 组件 - 进度管理器
  // ============================================================================
  // 【作用】管理和更新双进度条的显示状态
  // 【进度说明】
  //   - stage1: 阶段1进度 (VNDB API 获取 Steam ID)
  //   - stage2: 阶段2进度 (Steam 价格获取)
  //   - cooldown: API 冷却等待状态
  // 【方法说明】
  //   - setStage1/2(current, total): 设置进度
  //   - setCooldown(remaining, total): 设置冷却状态
  //   - reset(): 重置所有进度
  //   - complete(): 标记完成状态
  //   - updateUI(): 更新进度条 DOM
  // ============================================================================

  const ProgressManager = {
    stage1: { current: 0, total: 0, active: false },
    stage2: { current: 0, total: 0, active: false },
    cooldown: { active: false, remaining: 0, total: 0 },
    animationFrame: null,
    lastUpdate: 0,

    /**
     * 设置阶段1进度（VNDB API 获取 Steam ID）
     */
    setStage1(current, total) {
      this.stage1 = { current, total, active: total > 0 };
      this.updateUI();
    },

    /**
     * 设置阶段2进度（Steam 价格获取）
     */
    setStage2(current, total) {
      this.stage2 = { current, total, active: total > 0 };
      this.updateUI();
    },

    /**
     * 设置冷却状态
     */
    setCooldown(remaining, total) {
      this.cooldown = { active: remaining > 0, remaining, total };
      this.updateUI();
    },

    /**
     * 重置所有进度
     */
    reset() {
      this.stage1 = { current: 0, total: 0, active: false };
      this.stage2 = { current: 0, total: 0, active: false };
      this.cooldown = { active: false, remaining: 0, total: 0 };
      this.updateUI();
    },

    /**
     * 更新进度条 UI
     */
    updateUI() {
      if (!progressBar1 || !progressBar2) return;

      // === 阶段1进度 ===
      if (this.stage1.active && this.stage1.total > 0) {
        let pct1 = (this.stage1.current / this.stage1.total) * 100;

        // 如果在冷却中，基于冷却进度计算额外的进度（平滑过渡效果）
        if (this.cooldown.active && this.cooldown.total > 0) {
          const cooldownProgress = 1 - (this.cooldown.remaining / this.cooldown.total);
          const nextChunkProgress = (1 / this.stage1.total) * 100 * cooldownProgress * 0.9;
          pct1 = Math.min(100, pct1 + nextChunkProgress);
        }

        progressBar1.style.width = `${pct1}%`;
        progressBar1.style.opacity = '1';
        progressBar1.classList.toggle('active', this.cooldown.active);

        // 冷却中显示黄色文字
        if (this.cooldown.active) {
          progressLabel1.innerHTML = `<span style="color:#f1c40f">ID: ${this.stage1.current}/${this.stage1.total}</span>`;
        } else {
          progressLabel1.textContent = `ID: ${this.stage1.current}/${this.stage1.total}`;
        }
        progressLabel1.style.opacity = '1';
      } else {
        progressBar1.style.width = '0%';
        progressBar1.style.opacity = '0.3';
        progressBar1.classList.remove('active');
        progressLabel1.style.opacity = '0.3';
      }

      // === 阶段2进度 ===
      if (this.stage2.active && this.stage2.total > 0) {
        const pct2 = Math.min(100, (this.stage2.current / this.stage2.total) * 100);
        progressBar2.style.width = `${pct2}%`;
        progressBar2.style.opacity = '1';
        progressBar2.classList.add('active');
        progressLabel2.textContent = `价格: ${this.stage2.current}/${this.stage2.total}`;
        progressLabel2.style.opacity = '1';
      } else {
        progressBar2.style.width = '0%';
        progressBar2.style.opacity = '0.3';
        progressBar2.classList.remove('active');
        progressLabel2.style.opacity = '0.3';
      }
    },

    /**
     * 完成所有任务，显示100%
     */
    complete() {
      if (progressBar1 && progressBar2) {
        progressBar1.style.width = '100%';
        progressBar2.style.width = '100%';
        progressBar1.classList.remove('active');
        progressBar2.classList.remove('active');
        progressLabel1.textContent = '完成';
        progressLabel2.textContent = '完成';
      }
    }
  };

  // ============================================================================
  // SECTION 12: 缓存辅助函数
  // ============================================================================
  // 【作用】提供缓存相关的辅助功能
  // 【包含函数】
  //   - cacheContainsOwnedGame: 检查缓存数据是否包含已拥有的游戏
  //   - getUnownedCacheKeys: 获取所有未拥有游戏的缓存键
  // ============================================================================

  /**
   * 检查缓存数据是否包含用户已拥有的游戏
   * @param {Object} cacheData - 缓存数据对象
   * @returns {boolean}
   */
  function cacheContainsOwnedGame(cacheData) {
    if (!cacheData || !cacheData.data) return false;
    if (Array.isArray(cacheData.data)) {
      return cacheData.data.some(item => OWNED_SET.has(parseInt(item.appid)));
    }
    return OWNED_SET.has(parseInt(cacheData.data.appid));
  }

  /**
   * 获取所有未拥有游戏的缓存键
   * @param {string} scope - 'page' 仅当前页面，'all' 所有缓存
   * @returns {Promise<Array<string>>} 缓存键数组
   */
  async function getUnownedCacheKeys(scope = 'page') {
    const unownedKeys = [];
    const keysToCheck = scope === 'page'
      ? currentPageCacheKeys
      : new Set(GM_listValues().filter(k => k.startsWith('vndb_steam_')));

    for (const key of keysToCheck) {
      try {
        const cached = JSON.parse(GM_getValue(key, 'null'));
        if (cached && !cacheContainsOwnedGame(cached)) {
          unownedKeys.push(key);
        }
      } catch (e) {}
    }

    return unownedKeys;
  }

  // ============================================================================
  // SECTION 13: UI 组件 - 设置面板
  // ============================================================================
  // 【作用】创建和管理设置面板 UI
  // 【设置项】
  //   - VNDB 请求间隔 (vndbDelay)
  //   - Steam 请求间隔 (steamDelay)
  //   - Steam 并发数 (steamConcurrency)
  // 【风险提示】设置值过激进时会显示红色警告
  // ============================================================================

  /**
   * 切换设置面板的显示/隐藏
   */
  function toggleSettingsPanel() {
    // 如果面板已存在，关闭它
    if (settingsPanel) {
      settingsPanel.remove();
      settingsPanel = null;
      return;
    }

    // 创建设置面板
    settingsPanel = document.createElement('div');
    settingsPanel.className = 'vndb-steam-settings-panel';
    settingsPanel.style.cssText = `
      position: fixed; bottom: 48px; right: 10px; width: 340px;
      background: linear-gradient(135deg, rgba(30, 30, 35, 0.98) 0%, rgba(25, 25, 30, 0.98) 100%);
      color: #ecf0f1;
      border: 1px solid rgba(100, 100, 120, 0.3); border-radius: 12px; padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 100000; box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
      backdrop-filter: blur(20px); font-size: 13px;
    `;

    // 标题
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 15px; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px;
      border-bottom: 1px solid rgba(100, 100, 120, 0.2);
      display: flex; align-items: center; gap: 8px;
    `;
    title.innerHTML = `<span style="font-size: 18px;">⚙️</span> 设置`;
    settingsPanel.appendChild(title);

    /**
     * 创建滑块设置项
     * @param {string} label - 显示标签
     * @param {string} key - 设置键名
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {number} step - 步进值
     * @param {string} unit - 单位文字
     * @param {string} desc - 描述文字
     * @returns {HTMLElement} 设置行元素
     */
    const createSlider = (label, key, min, max, step, unit, desc) => {
      const row = document.createElement('div');
      row.style.marginBottom = '18px';

      // 判断当前值是否有风险（过激进）
      const isRisky = (key === 'vndbDelay' && SETTINGS[key] < 4000) ||
                      (key === 'steamDelay' && SETTINGS[key] < 800) ||
                      (key === 'steamConcurrency' && SETTINGS[key] > 3);

      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:500;color:#ddd;font-size:12px;">${label}</span>
          <span id="val-${key}" style="color:${isRisky ? '#e74c3c' : '#3498db'};font-family:'SF Mono',Monaco,monospace;font-size:12px;font-weight:600;background:rgba(52,152,219,0.1);padding:2px 8px;border-radius:4px;">${SETTINGS[key]}${unit}</span>
        </div>
        <div style="position:relative;height:6px;background:rgba(100,100,120,0.2);border-radius:3px;overflow:hidden;">
          <div id="fill-${key}" style="position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,#3498db,#2980b9);border-radius:3px;width:${((SETTINGS[key] - min) / (max - min)) * 100}%;transition:width 0.15s ease;"></div>
        </div>
        <input id="input-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${SETTINGS[key]}" style="width:100%;cursor:pointer;opacity:0;position:relative;margin-top:-6px;height:20px;">
        <div style="font-size:11px;color:#888;margin-top:6px;line-height:1.5;">${desc}</div>
      `;

      const input = row.querySelector('input');
      const fill = row.querySelector(`#fill-${key}`);
      const valSpan = row.querySelector(`#val-${key}`);

      // 滑块值变化时更新设置和 UI
      input.oninput = (e) => {
        const val = Number(e.target.value);
        SETTINGS[key] = val;
        valSpan.innerText = val + unit;
        fill.style.width = `${((val - min) / (max - min)) * 100}%`;
        localStorage.setItem('vndb_steam_settings', JSON.stringify(SETTINGS));

        // 重新判断风险状态
        const isRiskyNow = (key === 'vndbDelay' && val < 4000) ||
                          (key === 'steamDelay' && val < 800) ||
                          (key === 'steamConcurrency' && val > 3);
        valSpan.style.color = isRiskyNow ? '#e74c3c' : '#3498db';
        valSpan.style.background = isRiskyNow ? 'rgba(231,76,60,0.1)' : 'rgba(52,152,219,0.1)';
        fill.style.background = isRiskyNow ?
          'linear-gradient(90deg,#e74c3c,#c0392b)' :
          'linear-gradient(90deg,#3498db,#2980b9)';
      };
      return row;
    };

    // 添加三个设置滑块
    settingsPanel.appendChild(createSlider('VNDB 请求间隔', 'vndbDelay', 2000, 10000, 500, 'ms', '每批次(20个)查询后的冷却时间。过短可能触发 429 限制。'));
    settingsPanel.appendChild(createSlider('Steam 请求间隔', 'steamDelay', 500, 3000, 100, 'ms', '单个价格查询的间隔时间。'));
    settingsPanel.appendChild(createSlider('Steam 并发数', 'steamConcurrency', 1, 6, 1, '线程', '同时进行的查询数量。建议保持在 2-3 以内。'));

    // 分隔线
    const divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:rgba(100,100,120,0.2);margin:20px 0;';
    settingsPanel.appendChild(divider);

    /**
     * 创建开关设置项
     * @param {string} label - 显示标签
     * @param {string} key - 设置键名
     * @param {string} desc - 描述文字
     * @returns {HTMLElement} 设置行元素
     */
    const createToggle = (label, key, desc) => {
      const row = document.createElement('div');
      row.style.marginBottom = '18px';

      const isOn = SETTINGS[key] === true;

      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-weight:500;color:#ddd;font-size:12px;">${label}</span>
          <label style="position:relative;display:inline-block;width:44px;height:22px;cursor:pointer;">
            <input id="toggle-${key}" type="checkbox" ${isOn ? 'checked' : ''} style="opacity:0;width:0;height:0;">
            <span id="slider-${key}" style="
              position:absolute;top:0;left:0;right:0;bottom:0;
              background:${isOn ? 'linear-gradient(135deg,#27ae60,#2ecc71)' : 'rgba(100,100,120,0.3)'};
              border-radius:22px;transition:all 0.3s ease;
            "></span>
            <span id="knob-${key}" style="
              position:absolute;top:2px;left:${isOn ? '24px' : '2px'};width:18px;height:18px;
              background:#fff;border-radius:50%;transition:all 0.3s ease;
              box-shadow:0 2px 4px rgba(0,0,0,0.2);
            "></span>
          </label>
        </div>
        <div style="font-size:11px;color:#888;margin-top:6px;line-height:1.5;">${desc}</div>
      `;

      const input = row.querySelector(`#toggle-${key}`);
      const slider = row.querySelector(`#slider-${key}`);
      const knob = row.querySelector(`#knob-${key}`);

      input.onchange = (e) => {
        const isChecked = e.target.checked;
        SETTINGS[key] = isChecked;
        localStorage.setItem('vndb_steam_settings', JSON.stringify(SETTINGS));

        // 更新视觉样式
        slider.style.background = isChecked ?
          'linear-gradient(135deg,#27ae60,#2ecc71)' :
          'rgba(100,100,120,0.3)';
        knob.style.left = isChecked ? '24px' : '2px';
      };

      return row;
    };

    // 添加自动标记开关
    settingsPanel.appendChild(createToggle(
      '自动标记已拥有',
      'autoMarkObtained',
      '当检测到 Steam 库中已拥有某个 Release 时，自动将其状态设置为 "Obtained"。需要登录 VNDB。'
    ));

    // 底部按钮行
    const btnRow = document.createElement('div');
    btnRow.style.cssText = `
      display: flex; justify-content: space-between; margin-top: 20px;
      border-top: 1px solid rgba(100, 100, 120, 0.2); padding-top: 16px;
    `;

    // 恢复默认按钮
    const defaultBtn = document.createElement('button');
    defaultBtn.innerText = '↺ 恢复默认';
    defaultBtn.style.cssText = `
      background: transparent; color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.3);
      padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;
      transition: all 0.2s ease;
    `;
    defaultBtn.onmouseover = () => {
      defaultBtn.style.background = 'rgba(243, 156, 18, 0.1)';
      defaultBtn.style.borderColor = '#f39c12';
    };
    defaultBtn.onmouseout = () => {
      defaultBtn.style.background = 'transparent';
      defaultBtn.style.borderColor = 'rgba(243, 156, 18, 0.3)';
    };
    defaultBtn.onclick = () => {
      SETTINGS = { ...DEFAULTS };
      localStorage.removeItem('vndb_steam_settings');
      // 更新滑块
      ['vndbDelay', 'steamDelay', 'steamConcurrency'].forEach(k => {
        const el = settingsPanel.querySelector(`#input-${k}`);
        if(el) { el.value = SETTINGS[k]; el.oninput({target: el}); }
      });
      // 更新开关
      ['autoMarkObtained'].forEach(k => {
        const toggle = settingsPanel.querySelector(`#toggle-${k}`);
        const slider = settingsPanel.querySelector(`#slider-${k}`);
        const knob = settingsPanel.querySelector(`#knob-${k}`);
        if (toggle) {
          toggle.checked = SETTINGS[k] === true;
          if (slider) slider.style.background = SETTINGS[k] ? 'linear-gradient(135deg,#27ae60,#2ecc71)' : 'rgba(100,100,120,0.3)';
          if (knob) knob.style.left = SETTINGS[k] ? '24px' : '2px';
        }
      });
      showStatus("已恢复默认设置", 'success');
    };

    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.cssText = `
      background: linear-gradient(135deg, #3498db, #2980b9); color: #fff;
      border: none; padding: 6px 20px; border-radius: 6px; cursor: pointer; font-size: 12px;
      font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.transform = 'translateY(-1px)';
      closeBtn.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.transform = 'translateY(0)';
      closeBtn.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
    };
    closeBtn.onclick = () => toggleSettingsPanel();

    btnRow.appendChild(defaultBtn);
    btnRow.appendChild(closeBtn);
    settingsPanel.appendChild(btnRow);

    document.body.appendChild(settingsPanel);
  }

  // ============================================================================
  // SECTION 14: UI 组件 - 底部状态栏
  // ============================================================================
  // 【作用】创建固定在页面底部的状态栏，显示进度和操作按钮
  // 【包含元素】
  //   - 双进度条 (阶段1蓝色/阶段2绿色)
  //   - 状态文本
  //   - 操作按钮: 设置、停止、刷新本页、刷新全部等
  // 【showStatus 函数】用于更新状态文本，支持不同颜色类型
  // ============================================================================

  /**
   * 初始化底部状态栏
   */
  function initStatusBar() {
    if(document.getElementById('vndb-steam-status')) return;

    injectStyles();

    // 创建状态栏容器
    statusContainer = document.createElement('div');
    statusContainer.id = 'vndb-steam-status';
    statusContainer.className = 'vndb-steam-status-container';
    statusContainer.style.cssText = `
      position: fixed; bottom: 0; left: 0; width: 100%; height: 42px;
      background: linear-gradient(180deg, rgba(22, 22, 28, 0.95) 0%, rgba(18, 18, 24, 0.98) 100%);
      color: #ecf0f1;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px; padding: 0 16px;
      z-index: 99999; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.3); border-top: 1px solid rgba(100, 100, 120, 0.2);
    `;

    // --- 进度条容器 (顶部两条细线) ---
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      display: flex; flex-direction: column; gap: 0;
    `;

    // 阶段1进度条（蓝色 - VNDB API）
    const bar1Container = document.createElement('div');
    bar1Container.style.cssText = `position: relative; height: 2px; background: rgba(52, 152, 219, 0.15);`;
    progressBar1 = document.createElement('div');
    progressBar1.className = 'vndb-steam-progress-bar';
    progressBar1.style.cssText = `
      position: absolute; top: 0; left: 0; height: 100%; width: 0%;
      background: linear-gradient(90deg, #3498db, #5dade2);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.3;
      box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
    `;
    bar1Container.appendChild(progressBar1);

    // 阶段2进度条（绿色 - Steam 价格）
    const bar2Container = document.createElement('div');
    bar2Container.style.cssText = `position: relative; height: 2px; background: rgba(46, 204, 113, 0.15);`;
    progressBar2 = document.createElement('div');
    progressBar2.className = 'vndb-steam-progress-bar';
    progressBar2.style.cssText = `
      position: absolute; top: 0; left: 0; height: 100%; width: 0%;
      background: linear-gradient(90deg, #2ecc71, #58d68d);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.3;
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
    `;
    bar2Container.appendChild(progressBar2);

    progressContainer.appendChild(bar1Container);
    progressContainer.appendChild(bar2Container);
    statusContainer.appendChild(progressContainer);

    // --- 左侧内容 (标题、状态、进度标签) ---
    const left = document.createElement('div');
    left.style.cssText = 'display: flex; align-items: center; gap: 14px; margin-top: 2px;';

    // 渐变标题
    const titleSpan = document.createElement('span');
    titleSpan.style.cssText = `
      background: linear-gradient(135deg, #3498db, #9b59b6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;
    `;
    titleSpan.textContent = 'VNDB Steam';

    // 状态文本
    statusTxT = document.createElement('span');
    statusTxT.id = 'vndb-status-text';
    statusTxT.style.cssText = 'color:#aaa; transition: color 0.2s ease;';
    statusTxT.textContent = '就绪';

    // 进度标签容器
    const progressLabels = document.createElement('div');
    progressLabels.style.cssText = 'display: flex; gap: 12px; font-size: 11px;';

    progressLabel1 = document.createElement('span');
    progressLabel1.style.cssText = `
      color: #3498db; opacity: 0.3; font-family: 'SF Mono', Monaco, monospace;
      background: rgba(52, 152, 219, 0.1); padding: 2px 8px; border-radius: 4px;
    `;
    progressLabel1.textContent = 'ID: 0/0';

    progressLabel2 = document.createElement('span');
    progressLabel2.style.cssText = `
      color: #2ecc71; opacity: 0.3; font-family: 'SF Mono', Monaco, monospace;
      background: rgba(46, 204, 113, 0.1); padding: 2px 8px; border-radius: 4px;
    `;
    progressLabel2.textContent = '价格: 0/0';

    progressLabels.appendChild(progressLabel1);
    progressLabels.appendChild(progressLabel2);

    left.appendChild(titleSpan);
    left.appendChild(statusTxT);
    left.appendChild(progressLabels);

    // --- 右侧按钮区域 ---
    const right = document.createElement('div');
    right.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-top: 2px;';

    /**
     * 创建状态栏按钮
     * @param {string} text - 按钮文字
     * @param {string} title - 悬停提示
     * @param {Function} clickFn - 点击回调
     * @param {string} colorScheme - 颜色方案
     * @returns {HTMLElement} 按钮元素
     */
    const createBtn = (text, title, clickFn, colorScheme = 'default') => {
      const btn = document.createElement('button');
      btn.innerText = text;
      btn.title = title;
      btn.className = 'vndb-steam-btn';

      // 预定义的颜色方案
      const colors = {
        default: { base: '#9aa0a6', hover: '#fff', bg: 'transparent', hoverBg: 'rgba(154, 160, 166, 0.1)' },
        danger: { base: '#ea4335', hover: '#fff', bg: 'rgba(234, 67, 53, 0.1)', hoverBg: 'rgba(234, 67, 53, 0.2)' },
        primary: { base: '#4285f4', hover: '#fff', bg: 'rgba(66, 133, 244, 0.1)', hoverBg: 'rgba(66, 133, 244, 0.2)' },
        success: { base: '#34a853', hover: '#fff', bg: 'rgba(52, 168, 83, 0.1)', hoverBg: 'rgba(52, 168, 83, 0.2)' },
        warning: { base: '#fbbc04', hover: '#fff', bg: 'rgba(251, 188, 4, 0.1)', hoverBg: 'rgba(251, 188, 4, 0.2)' },
        purple: { base: '#a855f7', hover: '#fff', bg: 'rgba(168, 85, 247, 0.1)', hoverBg: 'rgba(168, 85, 247, 0.2)' }
      };

      const c = colors[colorScheme] || colors.default;

      btn.style.cssText = `
        background: ${c.bg}; border: none; color: ${c.base};
        padding: 4px 10px; height: 26px; cursor: pointer; font-size: 11px;
        border-radius: 6px; transition: all 0.2s ease; outline: none; white-space: nowrap;
        font-weight: 500;
      `;
      btn.onmouseover = () => {
        btn.style.color = c.hover;
        btn.style.background = c.hoverBg;
      };
      btn.onmouseout = () => {
        btn.style.color = c.base;
        btn.style.background = c.bg;
      };
      btn.onclick = clickFn;
      return btn;
    };

    // 设置按钮
    const settingBtn = createBtn('⚙️ 设置', '打开设置面板', toggleSettingsPanel, 'default');

    // 停止按钮
    const stopBtn = createBtn('⏹ 停止', '停止当前任务', () => {
      IS_STOPPED = true;
      showStatus('任务已停止', 'error');
      ProgressManager.reset();
    }, 'danger');

    // 刷新本页按钮
    const resetPageBtn = createBtn('↻ 本页', '清除当前页面的所有缓存并重新获取', async () => {
      if(currentPageCacheKeys.size === 0) {
        showStatus('当前页面没有可刷新的数据', 'info');
        return;
      }
      if(confirm(`确定要刷新当前页面的 ${currentPageCacheKeys.size} 条数据吗？`)) {
        let deletedCount = 0;
        for (const cacheKey of currentPageCacheKeys) {
          const exists = GM_getValue(cacheKey, null);
          if (exists !== null) {
            GM_deleteValue(cacheKey);
            deletedCount++;
          }
        }
        showStatus(`已清除 ${deletedCount} 条本页缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'primary');

    // 刷新本页未拥有按钮
    const resetPageUnownedBtn = createBtn('↻ 本页未拥有', '只清除当前页面未拥有游戏的缓存', async () => {
      const unownedKeys = await getUnownedCacheKeys('page');
      if(unownedKeys.length === 0) {
        showStatus('当前页面没有未拥有的游戏缓存', 'info');
        return;
      }
      if(confirm(`确定要刷新当前页面 ${unownedKeys.length} 条未拥有游戏的数据吗？`)) {
        for (const key of unownedKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${unownedKeys.length} 条未拥有缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'purple');

    // 刷新全部按钮
    const resetAllBtn = createBtn('🗑 全部', '清除所有缓存并重新获取', async () => {
      const allKeys = GM_listValues();
      const cacheKeys = allKeys.filter(k => k.startsWith('vndb_steam_'));
      if(cacheKeys.length === 0) {
        showStatus('没有可清除的缓存数据', 'info');
        return;
      }
      if(confirm(`确定要清除全部 ${cacheKeys.length} 条缓存数据吗？`)) {
        for (const key of cacheKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${cacheKeys.length} 条缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'success');

    // 刷新全部未拥有按钮
    const resetAllUnownedBtn = createBtn('🗑 全部未拥有', '只清除所有未拥有游戏的缓存', async () => {
      const unownedKeys = await getUnownedCacheKeys('all');
      if(unownedKeys.length === 0) {
        showStatus('没有未拥有的游戏缓存', 'info');
        return;
      }
      if(confirm(`确定要刷新全部 ${unownedKeys.length} 条未拥有游戏的数据吗？\n（这可能需要较长时间重新获取）`)) {
        for (const key of unownedKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${unownedKeys.length} 条未拥有缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'warning');

    // 添加所有按钮到右侧
    right.appendChild(settingBtn);
    right.appendChild(stopBtn);
    right.appendChild(resetPageBtn);
    right.appendChild(resetPageUnownedBtn);
    right.appendChild(resetAllBtn);
    right.appendChild(resetAllUnownedBtn);

    statusContainer.appendChild(left);
    statusContainer.appendChild(right);
    document.body.appendChild(statusContainer);
  }

  /**
   * 更新状态栏文本
   * @param {string} msg - 状态消息
   * @param {string} type - 类型: 'info', 'wait', 'success', 'error'
   */
  function showStatus(msg, type='info') {
    if(!statusContainer) initStatusBar();
    let color = '#ecf0f1';

    if(type === 'wait') { color = '#f1c40f'; }     // 黄色 - 等待中
    if(type === 'success') { color = '#2ecc71'; }  // 绿色 - 成功
    if(type === 'error') { color = '#e74c3c'; }    // 红色 - 错误

    // 如果有失败计数，添加后缀
    let suffix = '';
    if (STATS.fail > 0) {
      suffix = ` <span style="color:#e74c3c;margin-left:8px;font-size:10px;background:rgba(231,76,60,0.1);padding:2px 6px;border-radius:4px;">(错误: ${STATS.fail})</span>`;
    }

    statusTxT.style.color = color;
    statusTxT.innerHTML = msg + suffix;
  }

  // ============================================================================
  // SECTION 15: 倒计时等待函数
  // ============================================================================
  // 【作用】在 API 冷却期间显示平滑的倒计时动画
  // 【特点】每 50ms 更新一次，确保进度条动画流畅
  // ============================================================================

  /**
   * 带倒计时显示的等待函数
   * @param {number} seconds - 等待秒数
   * @param {number} currentStage1Progress - 当前阶段1进度
   * @param {number} totalStage1 - 阶段1总数
   * @returns {Promise<void>}
   */
  async function waitWithCountdown(seconds, currentStage1Progress, totalStage1) {
    const totalMs = seconds * 1000;
    const startTime = Date.now();
    const updateInterval = 50; // 50ms 更新一次，确保流畅

    return new Promise(resolve => {
      const update = () => {
        if (IS_STOPPED) {
          ProgressManager.setCooldown(0, 0);
          resolve();
          return;
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalMs - elapsed);
        const remainingSec = Math.ceil(remaining / 1000);

        // 更新冷却状态
        ProgressManager.setCooldown(remaining, totalMs);

        // 更新状态文本
        showStatus(`API 冷却中 (${remainingSec}s)...`, 'wait');

        if (remaining <= 0) {
          ProgressManager.setCooldown(0, 0);
          resolve();
        } else {
          setTimeout(update, updateInterval);
        }
      };

      update();
    });
  }

  // ============================================================================
  // SECTION 16: 处理队列类
  // ============================================================================
  // 【作用】管理 Steam API 请求的并发队列
  // 【特点】
  //   - 限制同时进行的请求数 (由 steamConcurrency 配置)
  //   - 请求间自动添加延迟 (由 steamDelay 配置)
  // ============================================================================

  /**
   * 并发处理队列
   * 限制同时运行的任务数，自动处理延迟
   */
  class ProcessingQueue {
    constructor() {
      this.active = 0;    // 当前活动任务数
      this.queue = [];    // 等待队列
    }

    /**
     * 添加任务到队列
     * @param {Function} fn - 异步任务函数
     */
    add(fn) {
      this.queue.push(fn);
      this.next();
    }

    /**
     * 尝试执行下一个任务
     */
    async next() {
      // 检查是否可以执行更多任务
      if (IS_STOPPED || this.active >= SETTINGS.steamConcurrency || this.queue.length === 0) return;

      this.active++;
      const task = this.queue.shift();

      try {
        await task();
      } catch (err) {
        console.error(err);
      } finally {
        // 延迟后减少活动计数并尝试下一个
        setTimeout(() => {
          this.active--;
          this.next();
        }, SETTINGS.steamDelay);
      }
    }
  }

  // ============================================================================
  // SECTION 17: 徽章渲染函数
  // ============================================================================
  // 【作用】在页面元素旁边渲染 Steam 价格徽章
  // 【排序规则】
  //   - 第一优先级: 本体游戏 (game)
  //   - 第二优先级: DLC
  //   - 第三优先级: Demo
  //   - 第四优先级: 已下架内容
  //   - 同类型内按状态排序: 已拥有 > 已发售 > 免费 > 即将推出 > 锁区
  // 【徽章颜色】
  //   - 已拥有 (绿色): 用户 Steam 库中有此游戏
  //   - DLC (紫色): 所有 DLC 统一使用 Steam 风格紫色
  //   - 打折中 (蓝色): 当前有折扣 (本体)
  //   - 原价 (灰蓝): 无折扣的正常价格 (本体)
  //   - 免费 (灰蓝): 免费游戏 (本体)
  //   - 即将推出 (橙色): coming soon 状态 (本体)
  //   - 锁区 (灰色): 国区不可用，链接指向 SteamDB (本体)
  //   - 已下架 (紫灰): 游戏已下架，链接指向 SteamDB (本体)
  // ============================================================================

  /**
   * 渲染价格徽章到目标元素旁
   * @param {HTMLElement} el - 目标元素
   * @param {Array<Object>} items - 价格数据数组
   * @param {string} insertMode - 'after' 或 'append'
   */
  function renderBadges(el, items, insertMode = 'after') {
    // 避免重复渲染
    if ((el.parentNode || el).querySelector('.vndb-steam-wrapper')) return;

    // 创建徽章容器
    const wrapper = document.createElement('span');
    wrapper.className = 'vndb-steam-wrapper';
    wrapper.style.cssText = 'display: inline-flex; align-items: center; margin-left: 8px; gap: 5px; vertical-align: middle; flex-wrap: wrap;';

    items.forEach(data => {
      const span = document.createElement('span');
      span.className = 'vndb-steam-badge';

      // 判断各种状态
      const isOwned = OWNED_SET.has(parseInt(data.appid));
      const isFree = data.status === 'free' || data.is_free;
      const isLocked = data.status === 'locked';
      const isNoPrice = data.status === 'noprice';
      const isSoon = data.status === 'soon';
      const isDelisted = data.status === 'delisted';
      const isRateLimited = data.status === 'rate_limited';
      const isDLC = data.type === 'dlc';
      const isDemo = data.type === 'demo';

      // 构建显示文本 - 叠加多种状态
      let parts = [];
      let bgGradient = '';

      // Steam 风格 DLC 紫色 - 所有 DLC 统一使用此颜色
      const DLC_PURPLE = 'linear-gradient(135deg, #7b3fa0, #9b59b6)';

      // 1. DLC/Demo 前缀 - 始终显示
      if (isDLC) parts.push('[DLC]');
      if (isDemo) parts.push('[Demo]');

      // 2. 拥有状态（最优先）
      if (isOwned) {
        parts.push('✓已拥有');
        bgGradient = 'linear-gradient(135deg, #4c6b22, #5a7d2a)';
      }

      // 3. 锁区状态
      if (isLocked) {
        parts.push('🔒锁区');
        if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #636e72, #7f8c8d)';
      }

      // 4. 已下架状态
      if (isDelisted) {
        parts.push('📦已下架');
        if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #6c5b7b, #8e7b9e)';
      }

      // 5. 被限流状态（临时）
      if (isRateLimited) {
        parts.push('⏳请求失败');
        if (!isOwned) bgGradient = 'linear-gradient(135deg, #c0392b, #e74c3c)';
      }

      // 6. 价格/免费状态（只在非下架、非锁区时显示）
      if (!isDelisted && !isLocked) {
        if (isFree) {
          parts.push('免费');
          if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #475d6d, #5a7080)';
        } else if (isSoon) {
          parts.push('即将推出');
          if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #d35400, #e67e22)';
        } else if (isNoPrice) {
          parts.push('无价格');
          if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #7f8c8d, #95a5a6)';
        } else if (data.status === 'released' && data.final > 0) {
          // 有价格信息
          const pStr = `¥${(data.final / 100).toFixed(0)}`;
          if (data.discount > 0) {
            parts.push(`-${data.discount}% ${pStr}`);
            if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #2980b9, #3498db)';
          } else {
            parts.push(pStr);
            if (!isOwned) bgGradient = isDLC ? DLC_PURPLE : 'linear-gradient(135deg, #475d6d, #5a7080)';
          }
        }
      }

      // 如果没有任何状态，显示默认
      if (parts.length === 0) {
        parts.push('Steam');
        bgGradient = 'linear-gradient(135deg, #555, #666)';
      }

      const text = parts.join(' ');

      // 设置徽章样式
      span.style.cssText = `
        display: inline-block; padding: 2px 8px; font-size: 11px; color: #fff;
        background: ${bgGradient || 'linear-gradient(135deg, #475d6d, #5a7080)'}; border-radius: 4px; cursor: pointer;
        font-weight: 600; line-height: 1.3; text-decoration: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset;
        white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      `;
      span.innerText = text;

      // 根据状态决定链接目标：下架/锁区 → SteamDB，其他 → Steam 商店
      const usesSteamDB = isDelisted || isLocked;
      const linkUrl = usesSteamDB
        ? `https://steamdb.info/app/${data.appid}`
        : `https://store.steampowered.com/app/${data.appid}`;

      span.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(linkUrl, '_blank');
      };

      // 悬停提示
      span.title = usesSteamDB
        ? `在 SteamDB 查看 (AppID: ${data.appid})`
        : `在 Steam 商店查看 (AppID: ${data.appid})`;

      // 已拥有的添加特殊类（用于计数）
      if (isOwned) span.classList.add('vndb-steam-owned');

      wrapper.appendChild(span);
    });

    // 插入到 DOM
    if (insertMode === 'append' || el.tagName === 'H1') {
      el.appendChild(wrapper);
    } else {
      el.after(wrapper);
    }
  }

  // ============================================================================
  // SECTION 17.5: 自动标记 Release 状态功能
  // ============================================================================
  // 【作用】当检测到 Steam 游戏已拥有时，自动将对应 Release 标记为 "Obtained"
  // 【工作原理】
  //   1. 通过表格行 DOM 结构建立 rid -> widget 的映射
  //   2. 当 Steam 检测到已拥有时，找到对应的状态下拉菜单
  //   3. 模拟用户操作：点击下拉菜单 -> 选择 "Obtained" 选项
  // 【注意事项】
  //   - 需要用户登录 VNDB
  //   - 只有在 autoMarkObtained 设置开启时才生效
  //   - 只标记当前状态为空 (--) 的 Release，不覆盖已有状态
  // ============================================================================

  /**
   * 记录已尝试自动标记的 Release ID，避免重复操作
   */
  const autoMarkedReleases = new Set();

  /**
   * 构建 rid -> widget 元素的映射
   * @returns {Map<string, Element>} rid 到 widget 元素的映射
   */
  function buildRidToWidgetMap() {
    const ridToWidget = new Map();

    document.querySelectorAll('tr').forEach(tr => {
      const releaseLink = tr.querySelector('a[href^="/r"]');
      const widget = tr.querySelector('[id^="widget"]');

      if (releaseLink && widget) {
        const match = releaseLink.href.match(/\/r(\d+)/);
        if (match) {
          const rid = match[1];
          // 只保存第一个匹配的 widget（避免重复）
          if (!ridToWidget.has(rid)) {
            ridToWidget.set(rid, widget);
          }
        }
      }
    });

    debugLog(`[AutoMark] 建立了 ${ridToWidget.size} 个 rid->widget 映射`);
    return ridToWidget;
  }

  /**
   * 自动标记 Release 为 "Obtained" 状态
   * @param {string} rid - Release ID (不含 'r' 前缀)
   * @param {Map<string, Element>} ridToWidgetMap - rid 到 widget 的映射
   * @returns {Promise<boolean>} 是否成功标记
   */
  async function autoMarkReleaseAsObtained(rid, ridToWidgetMap) {
    // 检查设置是否开启
    if (!SETTINGS.autoMarkObtained) {
      return false;
    }

    // 避免重复标记
    if (autoMarkedReleases.has(rid)) {
      debugLog(`[AutoMark] Release r${rid} 已尝试过，跳过`);
      return false;
    }
    autoMarkedReleases.add(rid);

    try {
      // 查找对应的 widget 元素
      const widgetElement = ridToWidgetMap.get(rid);
      if (!widgetElement) {
        debugLog(`[AutoMark] 未找到 r${rid} 的 widget 元素`);
        return false;
      }

      // 检查当前状态是否为空 (--)
      const currentText = widgetElement.textContent.trim();
      if (currentText !== '--' && !currentText.startsWith('--')) {
        debugLog(`[AutoMark] r${rid} 已有状态 (${currentText})，跳过`);
        return false;
      }

      // 找到下拉菜单触发器 (widget 内的 div)
      const dropdownTrigger = widgetElement.querySelector('div');
      if (!dropdownTrigger) {
        debugLog(`[AutoMark] 未找到 r${rid} 的下拉菜单触发器`);
        return false;
      }

      debugLog(`[AutoMark] 正在标记 r${rid} 为 Obtained...`);

      // 模拟点击打开下拉菜单
      dropdownTrigger.click();

      // 等待下拉菜单出现
      await new Promise(resolve => setTimeout(resolve, 100));

      // 查找 "Obtained" 选项 - 在 ul 下拉菜单中查找
      let obtainedOption = null;

      // 方法1: 查找页面上新出现的 ul 菜单
      const dropdownMenus = document.querySelectorAll('ul');
      for (const menu of dropdownMenus) {
        const links = menu.querySelectorAll('a');
        for (const link of links) {
          if (link.textContent.trim() === 'Obtained') {
            obtainedOption = link;
            break;
          }
        }
        if (obtainedOption) break;
      }

      // 方法2: 备用 - 直接查找所有 a 标签
      if (!obtainedOption) {
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
          if (link.textContent.trim() === 'Obtained' &&
              link.offsetParent !== null) { // 确保元素可见
            obtainedOption = link;
            break;
          }
        }
      }

      if (obtainedOption) {
        obtainedOption.click();
        debugLog(`[AutoMark] ✅ 成功标记 r${rid} 为 Obtained`);

        // 短暂显示提示
        showStatus(`✅ 已自动标记 r${rid} 为 Obtained`, 'success');

        return true;
      } else {
        // 关闭下拉菜单（点击空白处或再次点击触发器）
        document.body.click();
        debugLog(`[AutoMark] 未找到 Obtained 选项`);
        return false;
      }
    } catch (error) {
      debugError(`[AutoMark] 标记 r${rid} 时出错:`, error);
      return false;
    }
  }

  /**
   * 批量检查并自动标记已拥有的 Release
   * @param {Array<{rid: string, steamIds: string[]}>} releaseTargets - Release 列表
   */
  async function batchAutoMarkOwnedReleases(releaseTargets) {
    if (!SETTINGS.autoMarkObtained) {
      return;
    }

    debugLog('[AutoMark] 开始批量检查已拥有的 Release...');

    // 构建 rid -> widget 映射
    const ridToWidgetMap = buildRidToWidgetMap();

    if (ridToWidgetMap.size === 0) {
      debugLog('[AutoMark] 未找到任何 widget，可能未登录 VNDB');
      return;
    }

    let markedCount = 0;

    for (const target of releaseTargets) {
      // 检查这个 Release 关联的任何 Steam 游戏是否已拥有
      const hasOwnedGame = target.steamIds.some(steamId => OWNED_SET.has(parseInt(steamId)));

      if (hasOwnedGame) {
        debugLog(`[AutoMark] r${target.rid} 检测到已拥有的 Steam 游戏`);
        const success = await autoMarkReleaseAsObtained(target.rid, ridToWidgetMap);
        if (success) {
          markedCount++;
          // 添加延迟避免操作过快
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    if (markedCount > 0) {
      debugLog(`[AutoMark] 共自动标记了 ${markedCount} 个 Release`);
      showStatus(`✅ 已自动标记 ${markedCount} 个 Release 为 Obtained`, 'success');
    } else {
      debugLog('[AutoMark] 没有需要标记的 Release');
    }
  }

  // ============================================================================
  // SECTION 18: 页面解析辅助函数
  // ============================================================================
  // 【作用】从当前页面提取 Steam 链接和 Release 信息
  // 【包含函数】
  //   - extractSteamIdsFromPage: 提取页面上所有 Steam AppID
  //   - isCacheValid: 检查缓存是否有效
  //   - processReleaseLinks: 处理 Release 表格，建立 Release-Steam 映射
  // ============================================================================

  /**
   * 从页面直接提取所有 Steam AppID
   * @returns {Array<string>} Steam AppID 数组
   */
  function extractSteamIdsFromPage() {
    const steamIds = new Set();
    document.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(a => {
      const match = a.href.match(/store\.steampowered\.com\/app\/(\d+)/);
      if (match) steamIds.add(match[1]);
    });
    return Array.from(steamIds);
  }

  /**
   * 检查缓存是否仍然有效
   * @param {Object} cached - 缓存对象 {data, timestamp}
   * @returns {boolean}
   */
  function isCacheValid(cached) {
    if (!cached || !cached.timestamp) return false;
    const duration = getCacheDuration(cached.data);
    if (duration === 0) return false;  // rate_limited 返回 0，视为无效
    return (Date.now() - cached.timestamp) < duration;
  }

  // ============================================================================
  // SECTION 19: Steam 价格获取与缓存 (核心逻辑)
  // ============================================================================
  // 【作用】获取单个 Steam 游戏的价格信息，包含缓存和限流处理
  // 【核心逻辑】
  //   1. 先检查缓存，有效则直接返回
  //   2. 请求 CN 区 Steam API
  //   3. 如果 CN 区返回 null (限流)，返回临时错误不缓存
  //   4. 如果 CN 区成功，缓存并返回
  //   5. 如果 CN 区失败 (success:false)，请求 US 区验证
  //   6. US 有数据 CN 没有 → 锁区
  //   7. US 也没数据 → 已下架
  // ============================================================================

  /**
   * 获取单个 Steam 价格并缓存
   * @param {string} appid - Steam AppID
   * @returns {Promise<Object>} {data: Object|null, fromCache: boolean, error: string|null}
   */
  async function getSteamPriceWithCache(appid) {
    const cacheKey = STORAGE_PREFIX_STEAM + appid;
    currentPageCacheKeys.add(cacheKey);

    // --- 步骤1: 检查缓存 ---
    try {
      const cached = JSON.parse(GM_getValue(cacheKey, 'null'));
      if (cached && isCacheValid(cached)) {
        debugLog(`[缓存命中] appid=${appid}`, cached.data);
        return { data: cached.data, fromCache: true, error: null };
      }
    } catch (e) {}

    debugLog(`[请求CN] appid=${appid} 开始请求...`);

    // --- 步骤2: 请求 Steam API (CN) ---
    const r = await handleGetPrice(appid);

    debugLog(`[请求CN] appid=${appid} 返回:`, {
      success: r.success,
      hasData: !!r.data,
      appidSuccess: r.data?.[appid]?.success,
      rawData: r.data
    });

    // 检查网络错误
    if (!r.success) {
      debugError(`[网络错误] appid=${appid}`, r.error);
      return { data: null, fromCache: false, error: 'network' };
    }

    // --- 步骤3: 区分限流和真正的无数据 ---
    // rawData === null → 被限流，Steam 没有返回任何 JSON
    // rawData 有数据但 success: false → 真正的下架/锁区
    if (r.data === null) {
      debugError(`[限流检测] appid=${appid} - rawData 为 null，Steam 可能在限流，不缓存`);
      const rateLimitedResult = {
        appid,
        type: 'game',
        status: 'rate_limited',
        final: -1,
        discount: 0,
        is_free: false
      };
      return { data: rateLimitedResult, fromCache: false, error: 'rate_limited' };
    }

    // --- 步骤4: CN 区成功返回数据 ---
    if (r.data && r.data[appid]?.success) {
      const d = r.data[appid].data;
      const price = d.price_overview;
      const isComingSoon = d.release_date?.coming_soon;
      let status = 'released';
      let finalPrice = 0;
      let discount = 0;

      // 判断价格状态
      if (d.is_free) {
        status = 'free';
      } else if (price) {
        status = 'released';
        finalPrice = price.final;
        discount = price.discount_percent;
      } else if (isComingSoon) {
        status = 'soon';
      } else {
        status = 'noprice';
      }

      const result = {
        appid,
        type: d.type,
        status,
        final: finalPrice,
        discount,
        is_free: d.is_free
      };

      debugLog(`[CN成功] appid=${appid}`, result);

      // 缓存结果
      GM_setValue(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      return { data: result, fromCache: false, error: null };
    }

    // --- 步骤5: CN 区返回 success: false，需要用 US 区验证 ---
    debugWarn(`[CN失败] appid=${appid} - CN区返回 success:false，尝试US区验证...`);

    let appType = 'game';
    let usSuccess = false;
    let usRateLimited = false;

    try {
      debugLog(`[请求US] appid=${appid} 开始请求...`);
      const usRes = await gmFetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=US&filters=basic`);
      const usData = await usRes.json();

      debugLog(`[请求US] appid=${appid} 返回:`, {
        success: usData?.[appid]?.success,
        type: usData?.[appid]?.data?.type,
        rawData: usData
      });

      // 检查 US 区是否也被限流
      if (usData === null) {
        debugError(`[限流检测] appid=${appid} - US区 rawData 也为 null，Steam 正在限流`);
        usRateLimited = true;
      } else if (usData && usData[appid]?.success && usData[appid]?.data?.type) {
        appType = usData[appid].data.type;
        usSuccess = true;
        debugWarn(`[确认锁区] appid=${appid} - US区有数据(type=${appType})，CN区无数据 -> 判定为锁区`);
      } else {
        debugWarn(`[确认下架] appid=${appid} - US区也返回 success:false 且有响应数据 -> 判定为已下架`);
      }
    } catch (e) {
      debugError(`[US请求失败] appid=${appid}`, e);
    }

    // --- 步骤6: 处理 US 区结果 ---

    // 如果 US 区也被限流，返回临时错误，不缓存
    if (usRateLimited) {
      const rateLimitedResult = {
        appid,
        type: 'game',
        status: 'rate_limited',
        final: -1,
        discount: 0,
        is_free: false
      };
      return { data: rateLimitedResult, fromCache: false, error: 'rate_limited' };
    }

    if (usSuccess) {
      // US 有数据，CN 没有 -> 确定是锁区（永久缓存）
      const lockedResult = {
        appid,
        type: appType,
        status: 'locked',
        final: -1,
        discount: 0,
        is_free: false
      };
      debugLog(`[缓存] appid=${appid} 锁区状态，永久缓存`);
      GM_setValue(cacheKey, JSON.stringify({ data: lockedResult, timestamp: Date.now() }));
      return { data: lockedResult, fromCache: false, error: null };
    } else {
      // US 也没数据（但有响应）-> 确定是已下架（永久缓存）
      const delistedResult = {
        appid,
        type: appType,
        status: 'delisted',
        final: -1,
        discount: 0,
        is_free: false
      };
      debugLog(`[缓存] appid=${appid} 已下架状态，永久缓存`);
      GM_setValue(cacheKey, JSON.stringify({ data: delistedResult, timestamp: Date.now() }));
      return { data: delistedResult, fromCache: false, error: null };
    }
  }

  // ============================================================================
  // SECTION 20: 主逻辑入口 - 初始化
  // ============================================================================
  // 【作用】脚本启动时的初始化逻辑
  // 【执行顺序】
  //   1. 初始化状态栏 UI
  //   2. 获取用户的 Steam 已拥有游戏列表
  //   3. 根据当前页面类型分发到对应处理逻辑
  // ============================================================================

  // 初始化状态栏
  initStatusBar();
  showStatus('正在同步 Steam 库...', 'info', 0);

  // 获取用户已拥有的 Steam 游戏
  try {
    const ownedRes = await handleGetOwnedGames();
    if (ownedRes && ownedRes.success && Array.isArray(ownedRes.data)) {
      OWNED_SET = new Set(ownedRes.data);
    }
    debugLog(`[Steam库] 已拥有 ${OWNED_SET.size} 款游戏`);
  } catch(e) {
    debugError('[Steam库] 获取失败', e);
  }

  // 获取当前页面路径
  const pathname = window.location.pathname;

  // ============================================================================
  // SECTION 20.5: 通用函数 - 处理 Release 链接
  // ============================================================================
  // 【作用】收集页面上所有 Release 链接及其对应的 Steam AppID
  // 【使用场景】在 /v 详情页中处理 releases 表格
  // 【返回值】[{rid, element, steamIds}, ...] 数组
  // ============================================================================

  /**
   * 处理页面上所有 Release 链接
   * 建立 Release ID -> Steam AppIDs 的映射
   * @returns {Promise<Array>} [{rid, element, steamIds}, ...]
   */
  async function processReleaseLinks() {
    // 第一步：扫描整个页面，建立 rid -> steamIds 的完整映射
    const ridToSteamIds = new Map();

    // 方法1: 扫描 releases 表格区域
    document.querySelectorAll('.releases tr, .vnreleases tr, article.vnreleases tr').forEach(tr => {
      // 查找 release 链接
      const releaseLink = tr.querySelector('td.tc4 a[href*="/r"], a[href*="/r"]');
      if (!releaseLink) return;
      const match = releaseLink.href.match(/\/r(\d+)/);
      if (!match) return;
      const rid = match[1];

      // 在整个 tr 中查找 Steam 链接
      const steamIds = [];
      tr.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(link => {
        const m = link.href.match(/store\.steampowered\.com\/app\/(\d+)/);
        if (m && !steamIds.includes(m[1])) steamIds.push(m[1]);
      });

      if (steamIds.length > 0) {
        if (ridToSteamIds.has(rid)) {
          const existing = ridToSteamIds.get(rid);
          steamIds.forEach(id => { if (!existing.includes(id)) existing.push(id); });
        } else {
          ridToSteamIds.set(rid, steamIds);
        }
      }
    });

    // 方法2: 备用 - 直接遍历所有 Steam 链接
    document.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(steamLink => {
      const m = steamLink.href.match(/store\.steampowered\.com\/app\/(\d+)/);
      if (!m) return;
      const steamId = m[1];

      // 向上查找最近的包含 release 链接的容器
      let container = steamLink.closest('tr');
      if (!container) container = steamLink.closest('li');
      if (!container) container = steamLink.closest('div');
      if (!container) return;

      // 在容器中查找 release 链接
      let releaseLink = container.querySelector('a[href*="/r"]');

      if (!releaseLink && container.closest('tr')) {
        releaseLink = container.closest('tr').querySelector('a[href*="/r"]');
      }

      if (!releaseLink) return;

      const rMatch = releaseLink.href.match(/\/r(\d+)/);
      if (!rMatch) return;
      const rid = rMatch[1];

      if (ridToSteamIds.has(rid)) {
        const existing = ridToSteamIds.get(rid);
        if (!existing.includes(steamId)) existing.push(steamId);
      } else {
        ridToSteamIds.set(rid, [steamId]);
      }
    });

    console.log('[VNDB Steam] 找到的 Release-Steam 映射:', ridToSteamIds.size, '个');

    // 第二步：查找所有 release 链接并添加到列表
    const releaseLinks = [];

    document.querySelectorAll('a[href*="/r"]').forEach(a => {
      const match = a.href.match(/\/r(\d+)$/);
      if (!match) return;
      const rid = match[1];

      // 跳过已处理的元素
      if (a.querySelector('.vndb-steam-wrapper') || a.parentNode?.querySelector('.vndb-steam-wrapper')) return;

      // 如果这个 rid 有 Steam 链接，添加到列表
      if (ridToSteamIds.has(rid)) {
        releaseLinks.push({
          rid,
          element: a,
          steamIds: ridToSteamIds.get(rid)
        });
      }
    });

    console.log('[VNDB Steam] 待处理的 Release 链接:', releaseLinks.length, '个');
    return releaseLinks;
  }

  // ============================================================================
  // SECTION 21: 主逻辑 - Release 详情页处理 (/r 页面)
  // ============================================================================
  // 【触发条件】URL 匹配 /r{数字}
  // 【处理流程】
  //   1. 从页面直接提取 Steam 链接
  //   2. 逐个获取价格信息
  //   3. 在页面标题 (h1) 后渲染徽章
  // ============================================================================

  const releaseMatch = pathname.match(/^\/r(\d+)/);
  if (releaseMatch) {
    const releaseId = releaseMatch[1];
    const cacheKey = STORAGE_PREFIX_R + releaseId;
    currentPageCacheKeys.add(cacheKey);

    showStatus('正在检测 Steam 链接...', 'info');

    // 从页面直接提取 Steam ID
    const steamIds = extractSteamIdsFromPage();

    if (steamIds.length > 0) {
      showStatus(`发现 ${steamIds.length} 个 Steam 链接，正在获取价格...`, 'info');
      ProgressManager.setStage2(0, steamIds.length);

      const results = [];
      for (let i = 0; i < steamIds.length; i++) {
        if (IS_STOPPED) break;

        const appid = steamIds[i];
        ProgressManager.setStage2(i + 1, steamIds.length);
        showStatus(`获取价格中...`, 'info');

        const result = await getSteamPriceWithCache(appid);

        // Steam 限流自动停止
        if (result.error === 'rate_limited') {
          STATS.fail++;
          showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
          IS_STOPPED = true;
          break;
        }

        if (result.data && ['game', 'dlc', 'demo'].includes(result.data.type)) {
          results.push(result.data);
        }
      }

      if (results.length > 0) {
        // 排序：已拥有 > 已发布 > 免费 > 即将推出 > 锁区
        const score = (item) => {
          if (OWNED_SET.has(parseInt(item.appid))) return 5;
          if (item.status === 'released') return 4;
          if (item.status === 'free') return 3;
          if (item.status === 'soon') return 2;
          if (item.status === 'locked') return 1;
          return 0;
        };
        results.sort((a, b) => score(b) - score(a));

        // 渲染到标题
        const h1 = document.querySelector('h1');
        if (h1) {
          renderBadges(h1, results, 'append');
        }

        const ownedCount = results.filter(r => OWNED_SET.has(parseInt(r.appid))).length;
        const extraText = ownedCount > 0 ? ` (已拥有 ${ownedCount} 款)` : '';

        if (!IS_STOPPED) {
          showStatus(`✅ 完成${extraText}`, 'success');
          ProgressManager.complete();
        }
      } else if (!IS_STOPPED) {
        showStatus('未找到有效的 Steam 游戏信息', 'info');
      }
    } else {
      showStatus('此 Release 没有 Steam 链接', 'info');
    }
  }

  // ============================================================================
  // SECTION 22: 主逻辑 - VN 页面和列表页处理
  // ============================================================================
  // 【触发条件】非 /r 页面（包括 /v 详情页、列表页等）
  // 【处理流程】
  //   阶段1 - Release 处理 (仅 /v 详情页):
  //     1. 收集页面上所有 Release 链接
  //     2. 获取每个 Release 的 Steam 价格
  //     3. 在 Release 链接旁渲染徽章
  //     4. 在 VN 标题旁渲染汇总徽章
  //
  //   阶段2 - VN 链接处理 (列表页):
  //     1. 收集页面上所有 VN 链接
  //     2. 检查缓存，过滤需要请求的 VN
  //     3. 调用 VNDB API 获取 Steam ID
  //     4. 调用 Steam API 获取价格
  //     5. 渲染徽章
  // ============================================================================

  else {
    // 存储目标元素: vid -> {element, type}
    const targets = new Map();
    const vnIdsToQuery = new Set();
    let releaseTargets = []; // Release 数据

    // --- 检测主页面的 VN ID (v 详情页) ---
    const mainIdMatch = pathname.match(/^\/v(\d+)/);
    if (mainIdMatch) {
      // 优先查找带 lang 属性的 h1，如果没有则查找主内容区的第一个 h1
      const h1 = document.querySelector('h1[lang]') || document.querySelector('main h1') || document.querySelector('article h1') || document.querySelector('h1');
      if (h1) {
        targets.set(mainIdMatch[1], { id: mainIdMatch[1], element: h1, type: 'title' });
        vnIdsToQuery.add(mainIdMatch[1]);
      }

      // 在 v 详情页，收集所有 release 的 Steam 信息
      releaseTargets = await processReleaseLinks();

      // 记录 Release 缓存 key
      const seenRids = new Set();
      for (const item of releaseTargets) {
        if (!seenRids.has(item.rid)) {
          seenRids.add(item.rid);
          currentPageCacheKeys.add(STORAGE_PREFIX_R + item.rid);
        }
      }
    }

    // --- 检测列表中的 VN 链接 ---
    document.querySelectorAll('a[href^="/v"]').forEach(a => {
      // 跳过图片链接和空文本链接
      if (a.querySelector('img') || a.innerText.trim().length < 1) return;
      const match = a.href.match(/\/v(\d+)$/);
      if (match) {
        targets.set(match[1], { id: match[1], element: a, type: 'list' });
        vnIdsToQuery.add(match[1]);
      }
    });

    // 记录当前页面的所有 VN 缓存 key
    for (const vid of vnIdsToQuery) {
      currentPageCacheKeys.add(STORAGE_PREFIX_V + vid);
    }

    // ===== 阶段1: 处理 Release 链接 (v 详情页内) =====
    if (releaseTargets.length > 0) {
      showStatus(`正在处理 ${releaseTargets.length} 个 Release...`, 'info');
      ProgressManager.setStage1(0, releaseTargets.length);

      let releaseProcessed = 0;
      const allReleaseResults = []; // 收集所有结果用于 v 标题汇总
      const ridResultsCache = new Map(); // 避免重复请求

      for (const data of releaseTargets) {
        if (IS_STOPPED) break;

        const rid = data.rid;
        const cacheKey = STORAGE_PREFIX_R + rid;
        let results = [];

        // 检查本次运行缓存
        if (ridResultsCache.has(rid)) {
          results = ridResultsCache.get(rid);
        } else {
          // 检查持久化缓存
          try {
            const cached = JSON.parse(GM_getValue(cacheKey, 'null'));
            if (cached && cached.data && isCacheValid(cached)) {
              results = cached.data;
            }
          } catch (e) {}

          // 无缓存则请求
          if (results.length === 0) {
            for (const appid of data.steamIds) {
              if (IS_STOPPED) break;

              const result = await getSteamPriceWithCache(appid);

              if (result.error === 'rate_limited') {
                STATS.fail++;
                showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
                IS_STOPPED = true;
                break;
              }

              if (result.data && ['game', 'dlc', 'demo'].includes(result.data.type)) {
                results.push(result.data);
              }
            }

            // 缓存结果（过滤掉 rate_limited）
            const cachableResults = results.filter(r => r.status !== 'rate_limited');
            if (cachableResults.length > 0) {
              GM_setValue(cacheKey, JSON.stringify({ data: cachableResults, timestamp: Date.now() }));
            }
          }

          ridResultsCache.set(rid, results);
        }

        // 渲染到 release 链接旁
        if (results.length > 0) {
          const score = (item) => {
            if (OWNED_SET.has(parseInt(item.appid))) return 5;
            if (item.status === 'released') return 4;
            if (item.status === 'free') return 3;
            if (item.status === 'soon') return 2;
            if (item.status === 'locked') return 1;
            return 0;
          };
          const sortedResults = [...results].sort((a, b) => score(b) - score(a));
          renderBadges(data.element, sortedResults);

          // 只对每个唯一的 rid 添加一次到汇总
          if (!ridResultsCache.get(rid + '_added')) {
            allReleaseResults.push(...results);
            ridResultsCache.set(rid + '_added', true);
          }
        }

        releaseProcessed++;
        ProgressManager.setStage1(releaseProcessed, releaseTargets.length);
        showStatus(`处理 Release...`, 'info');
      }

      // 在 v 标题后显示汇总（去重）
      if (allReleaseResults.length > 0 && mainIdMatch) {
        // 优先查找带 lang 属性的 h1，如果没有则查找主内容区的第一个 h1
        const h1 = document.querySelector('h1[lang]') || document.querySelector('main h1') || document.querySelector('article h1') || document.querySelector('h1');
        if (h1 && !h1.querySelector('.vndb-steam-wrapper')) {
          // 按 appid 去重
          const uniqueResults = [];
          const seenAppIds = new Set();
          /**
           * 排序评分函数
           * 优先级: 本体 > DLC > Demo > 已下架
           * 同类型内按状态排序: 已拥有 > 已发售 > 免费 > 即将推出 > 锁区
           */
          const score = (item) => {
            const isOwned = OWNED_SET.has(parseInt(item.appid));
            const isDelisted = item.status === 'delisted';
            const isDLC = item.type === 'dlc';
            const isDemo = item.type === 'demo';

            // 基础分: 本体=400, DLC=300, Demo=200, 已下架=100
            let base = 400;
            if (isDLC) base = 300;
            if (isDemo) base = 200;
            if (isDelisted) base = 100;

            // 状态加分 (0-50)
            let statusScore = 0;
            if (isOwned) statusScore = 50;
            else if (item.status === 'released') statusScore = 40;
            else if (item.status === 'free') statusScore = 30;
            else if (item.status === 'soon') statusScore = 20;
            else if (item.status === 'locked') statusScore = 10;

            return base + statusScore;
          };
          allReleaseResults.sort((a, b) => score(b) - score(a));

          for (const r of allReleaseResults) {
            if (!seenAppIds.has(r.appid)) {
              seenAppIds.add(r.appid);
              uniqueResults.push(r);
            }
          }
          renderBadges(h1, uniqueResults, 'append');

          // 缓存 v 页面汇总数据
          const cachableResults = uniqueResults.filter(r => r.status !== 'rate_limited');
          if (cachableResults.length > 0) {
            await storage.set({ [STORAGE_PREFIX_V + mainIdMatch[1]]: { data: cachableResults, timestamp: Date.now() } });
          }
        }
      }

      // ===== 自动标记已拥有的 Release =====
      if (SETTINGS.autoMarkObtained && releaseTargets.length > 0) {
        await batchAutoMarkOwnedReleases(releaseTargets);
      }
    }

    // ===== 阶段2: 处理列表页的 VN 链接 (需要调用 VNDB API) =====
    const storageData = await storage.get(null);
    const queueItems = [];
    const idsToFetchFromApi = [];

    for (const vid of vnIdsToQuery) {
      // 跳过已经通过 release 处理过的主页面 VN
      if (mainIdMatch && vid === mainIdMatch[1] && releaseTargets.length > 0) continue;

      const cacheKey = STORAGE_PREFIX_V + vid;
      const cached = storageData[cacheKey];
      if (cached && isCacheValid(cached)) {
        // 缓存有效，直接渲染
        if (cached.data) renderBadges(targets.get(vid).element, cached.data);
      } else {
        // 需要从 API 获取
        idsToFetchFromApi.push(vid);
      }
    }

    // --- VNDB API 阶段 ---
    if (idsToFetchFromApi.length > 0 && !IS_STOPPED) {
      const CHUNK_SIZE = 20; // 每批次查询数量
      let foundSteamIds = 0;

      ProgressManager.setStage1(0, idsToFetchFromApi.length);

      for (let i = 0; i < idsToFetchFromApi.length; i += CHUNK_SIZE) {
        if (IS_STOPPED) break;

        const chunk = idsToFetchFromApi.slice(i, i + CHUNK_SIZE);

        ProgressManager.setStage1(i, idsToFetchFromApi.length);
        showStatus(`获取 Steam ID... 已找到 ${foundSteamIds} 个`, 'info');

        try {
          const res = await handleSafeBatchQuery(chunk);

          if (!res.success) {
            if (res.error === 'Throttled') {
              showStatus("⚠️ VNDB API 限流，已自动停止", 'error');
              IS_STOPPED = true;
              STATS.fail++;
              break;
            }
          }

          if (res && res.success) {
            for (const vid of chunk) {
              const steamIds = res.data[vid] || res.data[parseInt(vid)];
              if (steamIds && steamIds.length > 0) {
                foundSteamIds += steamIds.length;
                queueItems.push({
                  target: targets.get(vid),
                  appids: steamIds,
                  cacheKey: STORAGE_PREFIX_V + vid
                });
              } else {
                // 没有 Steam ID，标记缓存
                await storage.set({ [STORAGE_PREFIX_V + vid]: { noSteamId: true, timestamp: Date.now() } });
              }
            }
          }

          ProgressManager.setStage1(i + chunk.length, idsToFetchFromApi.length);
          showStatus(`获取 Steam ID... 已找到 ${foundSteamIds} 个`, 'info');

        } catch (e) {
          console.error(e);
          STATS.fail++;
          showStatus(`⚠️ VNDB 网络错误`, 'error');
        }

        // 批次间冷却
        if (i + CHUNK_SIZE < idsToFetchFromApi.length) {
          const waitSec = Math.ceil(SETTINGS.vndbDelay / 1000);
          await waitWithCountdown(waitSec, i + CHUNK_SIZE, idsToFetchFromApi.length);
        }
      }
    }

    // --- Steam 价格阶段 ---
    if (!IS_STOPPED && queueItems.length > 0) {
      showStatus(`正在获取价格...`, 'info');
      ProgressManager.setStage2(0, queueItems.length);

      const queue = new ProcessingQueue();
      let processedCount = 0;
      let steamNetworkErrors = 0;

      queueItems.forEach(item => queue.add(async () => {
        if (IS_STOPPED) return;

        const uniqueIds = [...new Set(item.appids)];
        const validResults = [];

        for (const appid of uniqueIds) {
          if (IS_STOPPED) break;

          const result = await getSteamPriceWithCache(appid);

          if (result.error === 'network') {
            steamNetworkErrors++;
            if (steamNetworkErrors >= 3) {
              STATS.fail++;
              showStatus(`⚠️ Steam API 网络错误，已自动停止`, 'error');
              IS_STOPPED = true;
              return;
            }
          } else if (result.error === 'rate_limited') {
            STATS.fail++;
            showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
            IS_STOPPED = true;
            return;
          } else if (result.data) {
            if (['game', 'dlc', 'demo'].includes(result.data.type)) {
              validResults.push(result.data);
            }
          }
        }

        if (IS_STOPPED) return;

        STATS.success++;

        if (validResults.length) {
          /**
           * 排序评分函数
           * 优先级: 本体 > DLC > Demo > 已下架
           * 同类型内按状态排序: 已拥有 > 已发售 > 免费 > 即将推出 > 锁区
           */
          const score = (item) => {
            const isOwned = OWNED_SET.has(parseInt(item.appid));
            const isDelisted = item.status === 'delisted';
            const isDLC = item.type === 'dlc';
            const isDemo = item.type === 'demo';

            // 基础分: 本体=400, DLC=300, Demo=200, 已下架=100
            let base = 400;
            if (isDLC) base = 300;
            if (isDemo) base = 200;
            if (isDelisted) base = 100;

            // 状态加分 (0-50)
            let statusScore = 0;
            if (isOwned) statusScore = 50;
            else if (item.status === 'released') statusScore = 40;
            else if (item.status === 'free') statusScore = 30;
            else if (item.status === 'soon') statusScore = 20;
            else if (item.status === 'locked') statusScore = 10;

            return base + statusScore;
          };
          validResults.sort((a, b) => score(b) - score(a));
          renderBadges(item.target.element, validResults);

          // 缓存结果
          const cachableResults = validResults.filter(r => r.status !== 'rate_limited');
          if (cachableResults.length > 0) {
            await storage.set({ [item.cacheKey]: { data: cachableResults, timestamp: Date.now() } });
          }
        } else {
          // 无有效结果，显示无价格
          renderBadges(item.target.element, [{ appid: uniqueIds[0], status: 'noprice', type: 'game', final: -1 }]);
          await storage.set({ [item.cacheKey]: { data: [{ appid: uniqueIds[0], status: 'noprice', type: 'game', final: -1 }], timestamp: Date.now() } });
        }

        processedCount++;
        ProgressManager.setStage2(processedCount, queueItems.length);
        showStatus(`获取价格中...`, 'info');

        // 全部完成时显示最终状态
        if (processedCount === queueItems.length) {
          const ownedCount = document.querySelectorAll('.vndb-steam-owned').length;
          const extraText = ownedCount > 0 ? ` (库中包含 ${ownedCount} 款)` : '';

          if (STATS.fail > 0) {
            showStatus(`⚠️ 完成 (有 ${STATS.fail} 个错误)${extraText}`, 'error');
          } else {
            showStatus(`✅ 完成${extraText}`, 'success');
            ProgressManager.complete();
            // 5秒后变为就绪状态
            setTimeout(() => {
              if (statusTxT && statusTxT.innerText.includes('完成')) {
                statusTxT.style.color = '#7f8c8d';
                statusTxT.innerText = `✅ 就绪${extraText}`;
              }
            }, 5000);
          }
        }
      }));
    } else {
      // 无需处理的情况，显示最终状态
      if (IS_STOPPED) {
        // 保持停止状态
      } else if (releaseTargets.length > 0) {
        const ownedCount = document.querySelectorAll('.vndb-steam-owned').length;
        const extraText = ownedCount > 0 ? ` (库中包含 ${ownedCount} 款)` : '';
        showStatus(`✅ 完成${extraText}`, 'success');
        ProgressManager.complete();
      } else if (idsToFetchFromApi.length > 0) {
        showStatus("未发现新的 Steam 链接", 'success');
      } else if (vnIdsToQuery.size > 0) {
        showStatus("数据已是最新", 'success');
      } else {
        showStatus("就绪", 'info');
      }
    }
  }
})();