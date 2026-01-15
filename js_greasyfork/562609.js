// ==UserScript==
// @name         Linux.do 吃瓜雷达 (Melon Radar)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  核心特性：Leader选举、同帖去重、健壮JSON解析、状态可视化
// @author       nulluser (optimized)
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562609/Linuxdo%20%E5%90%83%E7%93%9C%E9%9B%B7%E8%BE%BE%20%28Melon%20Radar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562609/Linuxdo%20%E5%90%83%E7%93%9C%E9%9B%B7%E8%BE%BE%20%28Melon%20Radar%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========================================
  // 系统常量
  // ========================================
  const APP_PREFIX = "gua_radar_v5_";
  const CHANNEL_NAME = "gua_radar_channel_v5";
  const TAB_ID = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const CHANNEL = new BroadcastChannel(CHANNEL_NAME);

  // ========================================
  // 存储键名
  // ========================================
  const STORAGE = {
    CONFIG: "config",
    ACTIVE_BUBBLES: APP_PREFIX + "active_list",
    LEADER_LOCK: APP_PREFIX + "leader_lock",
    LATEST_WINDOW_IDS: APP_PREFIX + "window_ids",
    HISTORY_TIDS: APP_PREFIX + "history_tids",
  };

  // ========================================
  // 默认配置
  // ========================================
  const DEFAULT_CONFIG = {
    apiUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: "",
    model: "gpt-4o-mini",
    pollInterval: 60,
    pollingEnabled: true,
    scoreThreshold: 60,
    highScoreThreshold: 90,
    prompt: `你是一名"暗黑社区舆情侦探"。唯一目标是挖掘【冲突、黑幕、事故、重大变动】。

输入：topic_title (标题) 和 content (回复)。

### 🚫 0-40分 (绝对忽略 - 这些不是瓜！)
1. **正常交流**：技术问答、教程分享、软件推荐、日常闲聊。
2. **拼车交易**：家宽拼车、流量合租、会员共享、资源互换、求车/开车等非冲突性交易帖。
3. **和谐讨论**：感谢分享、互吹、无火药味的时评。
4. **水贴灌水**：围观、支持、表情包、纯灌水、签到打卡。
5. **求助问答**：正常的技术求助、使用疑问，无情绪冲突。

### ⚠️ 50-79分 (值得警惕)
1. **阴阳怪气**：明显的讽刺、嘲笑、暗讽。
2. **暗示爆料**：话里有话，暗示某人/某事有问题。
3. **轻度对线**：观点冲突，语气激烈但未骂人。
4. **唱反调**：对主流/高赞观点进行激烈反驳。
5. **质疑声讨**：对某人/某服务提出公开质疑。

### 🍉 80-100分 (惊天大瓜)
1. **挂人撕逼**：点名道姓指控诈骗/人品差/互喷对骂。
2. **实锤证据**：贴出聊天记录/交易截图证明对方撒谎/违约。
3. **重大事故**：商家跑路、大规模封号、数据泄露、服务暴雷。
4. **管理铁手**：官方发布的封禁/警告/处罚公告。
5. **维权曝光**：用户集体投诉、退款纠纷、被骗经历。

请基于 content 内容评分。注意：普通的拼车/合租帖即使有交易也是0分！
必须返回纯 JSON 数组：[{"id": 帖子ID, "score": 分数, "summary": "简述瓜点"}]`,
    ballX: "calc(100vw - 80px)",
    ballY: "calc(100vh - 120px)",
    isMinimized: false,
  };

  // ========================================
  // 运行时状态
  // ========================================
  let config = { ...DEFAULT_CONFIG, ...GM_getValue(STORAGE.CONFIG, {}) };
  let isLeader = false;
  let pollingTimer = null;
  let electionTimer = null;

  const MAX_BUBBLES = 30;
  const MAX_HISTORY_SIZE = 500;

  // ========================================
  // 日志工具
  // ========================================
  const Log = {
    info: (msg) => console.log(`%c[雷达] %c${msg}`, "color:#0f0", "color:#fff"),
    error: (msg, e) => console.error(`%c[雷达] %c${msg}`, "color:#f00", "color:#fff", e),
    warn: (msg) => console.warn(`%c[雷达] %c${msg}`, "color:#fc0", "color:#000"),
    ui: (msg, type = "info") => {
      const consoleEl = document.getElementById("radar-log-console");
      if (!consoleEl) return;
      const entry = document.createElement("div");
      entry.style.marginBottom = "2px";
      entry.style.color = type === "error" ? "#ff4d4d" : type === "success" ? "#00ff41" : "#aaa";
      entry.innerHTML = `<span style="color:#555;">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
      consoleEl.appendChild(entry);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      while (consoleEl.children.length > 30) consoleEl.removeChild(consoleEl.firstChild);
    },
  };

  // ========================================
  // 存储工具
  // ========================================
  const getStorage = (key, def = []) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || def;
    } catch {
      return def;
    }
  };

  const setStorage = (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      cleanOldData();
      // 重试一次
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {}
    }
  };

  const cleanOldData = () => {
    let count = 0;
    Object.keys(localStorage).forEach((k) => {
      if ((k.startsWith("gua_radar_") || k.startsWith("gua_")) && !k.startsWith(APP_PREFIX)) {
        localStorage.removeItem(k);
        count++;
      }
    });
    if (count > 0) Log.info(`清理了 ${count} 条旧版缓存`);
  };

  // ========================================
  // 跨域请求包装器
  // ========================================
  const gmFetch = (url, options = {}) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || "GET",
        url: url,
        headers: options.headers || {},
        data: options.body || null,
        responseType: "json",
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve({
              ok: true,
              json: () => Promise.resolve(res.response || JSON.parse(res.responseText)),
            });
          } else {
            reject(new Error(`HTTP ${res.status}`));
          }
        },
        onerror: (err) => reject(err),
      });
    });
  };

  // ========================================
  // 辅助函数
  // ========================================
  const getMelons = (score) => {
    if (score >= 98) return "🍉🍉🍉🍉🍉";
    if (score >= 90) return "🍉🍉🍉";
    return "🍉";
  };

  // ========================================
  // 样式定义
  // ========================================
  GM_addStyle(`
        :root {
            --r-green: #00ff41;
            --r-cyan: #00e5ff;
            --r-red: #ff003c;
            --r-gray: #666;
            --r-bg: rgba(0, 15, 0, 0.95);
            --r-font: Menlo, Consolas, monospace;
        }

        /* 雷达球 - 基础样式 */
        #radar-ball {
            position: fixed;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #000;
            cursor: grab;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            user-select: none;
            font-size: 24px;
            box-sizing: border-box;
        }

        #radar-ball::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }

        /* Leader 状态 - 主动扫描 */
        #radar-ball.leader {
            border: 2px solid var(--r-green);
            box-shadow: 0 0 15px var(--r-green);
        }
        #radar-ball.leader::before {
            opacity: 1;
            background: conic-gradient(transparent 20%, var(--r-green) 100%);
            animation: r-spin 2s linear infinite;
        }
        #radar-ball.leader::after { content: '📡'; }

        /* Follower 状态 - 被动同步 */
        #radar-ball.follower {
            border: 2px dashed var(--r-cyan);
            box-shadow: none;
            opacity: 0.8;
            background: #001111;
        }
        #radar-ball.follower::after { content: '🔗'; }

        /* Paused 状态 - 暂停扫描 */
        #radar-ball.paused {
            border: 2px solid var(--r-gray) !important;
            box-shadow: none !important;
            opacity: 0.6;
            background: #222;
        }
        #radar-ball.paused::before { display: none; }
        #radar-ball.paused::after { content: '💤'; filter: grayscale(1); }

        /* Error 状态 */
        #radar-ball.error {
            border-color: var(--r-red) !important;
            box-shadow: 0 0 20px var(--r-red) !important;
            animation: r-pulse 0.8s infinite;
        }

        @keyframes r-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes r-pulse { 50% { box-shadow: 0 0 5px var(--r-red); } }

        /* 气泡列表容器 */
        #radar-list {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 280px;
            max-height: 80vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 2147483646;
            padding-right: 5px;
            pointer-events: none;
        }
        #radar-list::-webkit-scrollbar { width: 4px; }
        #radar-list::-webkit-scrollbar-thumb { background: var(--r-green); border-radius: 2px; }

        /* 清除全部按钮 */
        .r-clear-all {
            pointer-events: auto;
            width: 100%;
            padding: 6px 12px;
            background: rgba(50, 20, 20, 0.9);
            border: 1px solid #633;
            border-radius: 6px;
            color: #f66;
            font-size: 12px;
            cursor: pointer;
            font-family: var(--r-font);
            transition: all 0.2s;
        }
        .r-clear-all:hover { background: rgba(80, 30, 30, 0.95); border-color: #f66; }

        /* 单个气泡 */
        .r-item {
            pointer-events: auto;
            display: block;
            text-decoration: none;
            background: linear-gradient(135deg, rgba(0, 20, 0, 0.95) 0%, rgba(0, 40, 20, 0.95) 100%);
            border: 1px solid var(--r-green);
            border-radius: 8px;
            padding: 12px;
            color: #eee;
            cursor: pointer;
            font-family: var(--r-font);
            backdrop-filter: blur(6px);
            transition: transform 0.2s, box-shadow 0.2s;
            opacity: 0;
            transform: translateX(30px);
            animation: bubble-in 0.3s forwards;
            position: relative;
            box-shadow: 0 2px 8px rgba(0, 255, 65, 0.1);
        }
        .r-item:hover {
            transform: translateX(-4px);
            background: linear-gradient(135deg, rgba(0, 40, 0, 0.98) 0%, rgba(0, 60, 30, 0.98) 100%);
            border-color: #fff;
            box-shadow: 0 4px 16px rgba(0, 255, 65, 0.2);
        }
        .r-item.alert {
            background: linear-gradient(135deg, rgba(30, 0, 0, 0.95) 0%, rgba(50, 10, 20, 0.95) 100%);
            border-color: var(--r-red);
            box-shadow: 0 2px 12px rgba(255, 0, 60, 0.3);
        }
        .r-item.alert:hover {
            background: linear-gradient(135deg, rgba(50, 0, 0, 0.98) 0%, rgba(70, 15, 30, 0.98) 100%);
            box-shadow: 0 4px 20px rgba(255, 0, 60, 0.4);
        }
        .r-item.alert .r-score { color: var(--r-red); }

        /* 关闭按钮 */
        .r-close {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(100, 100, 100, 0.3);
            border: none;
            color: #888;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s, background 0.2s, color 0.2s;
        }
        .r-item:hover .r-close {
            opacity: 1;
        }
        .r-close:hover {
            background: rgba(255, 60, 60, 0.6);
            color: #fff;
        }

        .r-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #fff;
            padding-right: 20px;
        }
        .r-score {
            color: var(--r-green);
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 0 8px currentColor;
        }
        .r-desc {
            font-size: 13px;
            color: #bbb;
            line-height: 1.4;
            border-top: 1px dashed #444;
            padding-top: 6px;
            margin-top: 2px;
        }

        @keyframes bubble-in { to { opacity: 1; transform: translateX(0); } }

        /* 设置面板 */
        #radar-cfg {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
            background: #0a0a0a;
            border: 1px solid #333;
            padding: 25px;
            z-index: 2147483648;
            display: none;
            color: #eee;
            font-family: sans-serif;
            box-shadow: 0 0 60px #000;
            border-radius: 8px;
            max-height: 90vh;
            overflow-y: auto;
        }
        #radar-cfg.show { display: block; }

        #radar-mask {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.7);
            z-index: 2147483640;
            display: none;
            backdrop-filter: blur(2px);
        }
        #radar-mask.show { display: block; }

        .cfg-row { margin-bottom: 12px; }
        .cfg-row label {
            display: block;
            font-size: 12px;
            color: #888;
            margin-bottom: 4px;
        }
        .cfg-input {
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #333;
            color: white;
            padding: 8px;
            box-sizing: border-box;
            font-family: monospace;
            border-radius: 4px;
        }
        .cfg-textarea {
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #ccc;
            padding: 8px;
            box-sizing: border-box;
            font-family: monospace;
            font-size: 11px;
            resize: vertical;
            border-radius: 4px;
        }
        .cfg-btn {
            padding: 8px 18px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        .cfg-save {
            background: var(--r-green);
            color: black;
            font-weight: bold;
        }

        #radar-log-console {
            background: #000;
            border: 1px solid #222;
            height: 100px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 11px;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
        }
    `);

  // ========================================
  // 初始化
  // ========================================
  function init() {
    cleanOldData();
    createUI();
    refreshList(false);
    startElection();
    Log.info("雷达 v5.0 (重构版) 已启动");
    Log.ui("系统就绪，等待选举...", "success");
  }

  // ========================================
  // 创建UI
  // ========================================
  function createUI() {
    // 雷达球
    const ball = document.createElement("div");
    ball.id = "radar-ball";
    ball.style.left = config.ballX;
    ball.style.top = config.ballY;

    // 气泡列表
    const list = document.createElement("div");
    list.id = "radar-list";
    if (config.isMinimized) list.style.display = "none";

    // 遮罩层
    const mask = document.createElement("div");
    mask.id = "radar-mask";

    // 配置面板
    const cfg = document.createElement("div");
    cfg.id = "radar-cfg";
    cfg.innerHTML = `
            <h3 style="color:var(--r-green);text-align:center;margin:0 0 20px 0">📡 雷达控制中心 v5.0</h3>
            <div class="cfg-row">
                <label>接口地址 (API URL)</label>
                <input id="c-url" class="cfg-input" autocomplete="off">
            </div>
            <div class="cfg-row">
                <label>密钥 (API Key)</label>
                <input type="password" id="c-key" class="cfg-input" autocomplete="new-password">
            </div>
            <div class="cfg-row">
                <label>模型名称 (Model)</label>
                <input id="c-model" class="cfg-input" autocomplete="off">
            </div>
            <div class="cfg-row" style="display:flex;gap:10px">
                <div style="flex:1">
                    <label>轮询间隔(秒)</label>
                    <input type="number" id="c-int" class="cfg-input">
                </div>
                <div style="flex:1">
                    <label>最低显示分(0-100)</label>
                    <input type="number" id="c-min" class="cfg-input">
                </div>
                <div style="flex:1">
                    <label style="color:var(--r-red)">高亮分</label>
                    <input type="number" id="c-high" class="cfg-input">
                </div>
            </div>
            <div class="cfg-row">
                <label style="display:flex;justify-content:space-between;align-items:center">
                    <span>舆情规则 (AI Prompt)</span>
                    <button id="c-prompt-reset" class="cfg-btn" style="padding:2px 8px;font-size:11px;background:#333;color:#888;border:1px solid #444">重置默认</button>
                </label>
                <textarea id="c-prompt" class="cfg-textarea" rows="8"></textarea>
            </div>
            <div class="cfg-row" style="display:flex;align-items:center;gap:8px;color:#ccc;font-size:13px">
                <input type="checkbox" id="c-on" style="width:16px;height:16px">
                <label for="c-on" style="display:inline;margin:0;cursor:pointer">启用后台自动搜索</label>
            </div>
            <div id="radar-log-console"></div>
            <div style="display:flex;justify-content:space-between;margin-top:15px">
                <button id="c-rst" class="cfg-btn" style="background:#300;color:#f33;border:1px solid #522">重置历史</button>
                <div>
                    <button id="c-cls" class="cfg-btn" style="background:#333;color:#fff;margin-right:10px">关闭</button>
                    <button id="c-sav" class="cfg-btn cfg-save">保存</button>
                </div>
            </div>
        `;

    document.body.append(ball, list, mask, cfg);

    // 拖拽逻辑
    let isDrag = false;
    ball.onmousedown = (e) => {
      if (e.button !== 0) return;
      isDrag = false;
      ball.style.transition = "none";
      const rect = ball.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;

      const move = (ev) => {
        isDrag = true;
        ball.style.left = ev.clientX - offX + "px";
        ball.style.top = ev.clientY - offY + "px";
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        ball.style.transition = "all 0.3s";
        config.ballX = ball.style.left;
        config.ballY = ball.style.top;
        GM_setValue(STORAGE.CONFIG, config);
        CHANNEL.postMessage({
          type: "SYNC_POS",
          x: ball.style.left,
          y: ball.style.top,
        });
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    };

    // 点击切换最小化
    ball.onmouseup = (e) => {
      if (isDrag || e.button !== 0) return;
      config.isMinimized = !config.isMinimized;
      list.style.display = config.isMinimized ? "none" : "flex";
      GM_setValue(STORAGE.CONFIG, config);
      CHANNEL.postMessage({ type: "SYNC_MIN", val: config.isMinimized });
    };

    // 右键打开设置
    ball.oncontextmenu = (e) => {
      e.preventDefault();
      if (isDrag) return;
      document.getElementById("c-url").value = config.apiUrl;
      document.getElementById("c-key").value = config.apiKey;
      document.getElementById("c-model").value = config.model;
      document.getElementById("c-int").value = config.pollInterval;
      document.getElementById("c-min").value = config.scoreThreshold;
      document.getElementById("c-high").value = config.highScoreThreshold;
      document.getElementById("c-prompt").value = config.prompt;
      document.getElementById("c-on").checked = config.pollingEnabled;
      mask.classList.add("show");
      cfg.classList.add("show");
      Log.ui("已打开控制面板");
    };

    // 保存配置
    document.getElementById("c-sav").onclick = () => {
      config.apiUrl = document.getElementById("c-url").value.trim();
      config.apiKey = document.getElementById("c-key").value.trim();
      config.model = document.getElementById("c-model").value.trim();
      config.pollInterval = parseInt(document.getElementById("c-int").value) || 60;
      config.scoreThreshold = parseInt(document.getElementById("c-min").value) || 60;
      config.highScoreThreshold = parseInt(document.getElementById("c-high").value) || 90;
      config.prompt = document.getElementById("c-prompt").value;
      config.pollingEnabled = document.getElementById("c-on").checked;
      GM_setValue(STORAGE.CONFIG, config);
      CHANNEL.postMessage({ type: "SYNC_CFG", data: config });
      managePolling();
      Log.ui("配置已保存", "success");
      mask.classList.remove("show");
      cfg.classList.remove("show");
    };

    // 关闭面板
    document.getElementById("c-cls").onclick = () => {
      mask.classList.remove("show");
      cfg.classList.remove("show");
    };

    // 重置历史
    document.getElementById("c-rst").onclick = () => {
      if (confirm("清空历史黑名单和当前列表？")) {
        CHANNEL.postMessage({ type: "RESET" });
        localStorage.removeItem(STORAGE.HISTORY_TIDS);
        localStorage.removeItem(STORAGE.ACTIVE_BUBBLES);
        localStorage.removeItem(STORAGE.LATEST_WINDOW_IDS);
        refreshList(false);
        Log.ui("历史已重置", "success");
      }
    };

    // 重置提示词为默认值
    document.getElementById("c-prompt-reset").onclick = () => {
      if (confirm("将提示词重置为默认值？")) {
        document.getElementById("c-prompt").value = DEFAULT_CONFIG.prompt;
        Log.ui("提示词已重置", "success");
      }
    };

    updateBallStatus();
  }

  // ========================================
  // Leader 选举机制
  // ========================================
  function startElection() {
    if (electionTimer) clearInterval(electionTimer);
    electionTimer = setInterval(checkLeadership, 4000);
    checkLeadership();
  }

  function checkLeadership() {
    const now = Date.now();
    const lock = getStorage(STORAGE.LEADER_LOCK, { id: null, ts: 0 });
    const isTimeout = now - lock.ts > 15000;

    if (isTimeout || lock.id === TAB_ID) {
      if (!isLeader) {
        isLeader = true;
        Log.ui("🎖️ 已成为 Leader，开始扫描", "success");
        managePolling();
      }
      setStorage(STORAGE.LEADER_LOCK, { id: TAB_ID, ts: now });
    } else {
      if (isLeader) {
        isLeader = false;
        Log.ui("📡 转为 Follower，等待同步");
        managePolling();
      }
    }
    updateBallStatus();
  }

  // ========================================
  // 轮询管理
  // ========================================
  function managePolling() {
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      pollingTimer = null;
    }
    updateBallStatus();

    if (isLeader && config.pollingEnabled && config.apiKey) {
      runTask();
    }
  }

  async function runTask() {
    if (!isLeader || !config.pollingEnabled) return;

    try {
      await fetchAndAnalyze();
      updateBallStatus("ok");
    } catch (e) {
      Log.error("任务执行失败", e);
      Log.ui(`扫描异常: ${e.message}`, "error");
      updateBallStatus("error");
    }

    pollingTimer = setTimeout(runTask, Math.max(config.pollInterval, 10) * 1000);
  }

  // ========================================
  // 更新雷达球状态
  // ========================================
  function updateBallStatus(status = "normal") {
    const ball = document.getElementById("radar-ball");
    if (!ball) return;

    ball.classList.remove("paused", "error", "leader", "follower");

    if (!config.pollingEnabled) {
      ball.classList.add("paused");
      return;
    }
    if (status === "error") {
      ball.classList.add("error");
      return;
    }
    if (isLeader) {
      ball.classList.add("leader");
    } else {
      ball.classList.add("follower");
    }
  }

  // ========================================
  // 核心：抓取并分析
  // ========================================
  async function fetchAndAnalyze() {
    Log.ui("📡 正在扫描论坛动向...");

    // 使用时间戳防缓存
    const res = await fetch(`https://linux.do/posts.json?_t=${Date.now()}`);
    if (!res.ok) throw new Error("API Error");
    const json = await res.json();

    const lastWindowIds = new Set(getStorage(STORAGE.LATEST_WINDOW_IDS));
    const historyTids = new Set(getStorage(STORAGE.HISTORY_TIDS));
    const activeList = getStorage(STORAGE.ACTIVE_BUBBLES);
    const activeTids = new Set(activeList.map((i) => i.tid));

    // 过滤：新帖子 + 未在历史中 + 未在当前列表中
    const newPosts = json.latest_posts.filter((p) => {
      return !lastWindowIds.has(p.id) && !historyTids.has(p.topic_id) && !activeTids.has(p.topic_id);
    });

    if (newPosts.length > 0) {
      Log.ui(`捕获 ${newPosts.length} 条新内容，正在呼叫 AI...`, "success");

      const items = newPosts.map((p) => ({
        id: p.id,
        topic_title: p.topic_title || "N/A",
        content: (p.raw || (p.cooked ? p.cooked.replace(/<[^>]+>/g, "") : "")).substring(0, 500),
      }));

      const analysis = await callAI(items);
      const validMelons = [];

      analysis.forEach((r) => {
        if (r.score >= config.scoreThreshold) {
          const origin = newPosts.find((x) => x.id === r.id);
          if (origin) {
            validMelons.push({
              id: r.id,
              score: r.score,
              title: origin.topic_title,
              summary: r.summary,
              slug: origin.topic_slug,
              tid: origin.topic_id,
              pid: origin.post_number,
            });
            historyTids.add(origin.topic_id);
          }
        }
      });

      if (validMelons.length > 0) {
        // 保存历史TID黑名单
        const historyArray = Array.from(historyTids).slice(-MAX_HISTORY_SIZE);
        setStorage(STORAGE.HISTORY_TIDS, historyArray);

        // 广播并处理新数据
        CHANNEL.postMessage({ type: "ADD_BATCH", data: validMelons });
        processNewData(validMelons);

        validMelons.forEach((m) => {
          Log.ui(`🍉 锁定目标！[${m.score}分] ${m.title.substring(0, 20)}`, "success");
        });
      } else {
        Log.ui(`分析完毕，0个符合吃瓜标准 (阈值: ${config.scoreThreshold})`);
      }
    } else {
      Log.ui("暂无新内容");
    }

    // 更新窗口ID列表
    setStorage(
      STORAGE.LATEST_WINDOW_IDS,
      json.latest_posts.map((p) => p.id)
    );
  }

  // ========================================
  // 调用AI接口
  // ========================================
  async function callAI(items) {
    if (!config.apiKey) return [];

    let body,
      url = config.apiUrl;
    const headers = { "Content-Type": "application/json" };

    // 判断是否为 Gemini
    if (url.includes("google")) {
      if (!url.includes("key=")) url += `?key=${config.apiKey}`;
      body = {
        contents: [
          {
            parts: [{ text: config.prompt + "\nData:" + JSON.stringify(items) }],
          },
        ],
      };
    } else {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
      body = {
        model: config.model,
        messages: [
          { role: "system", content: config.prompt },
          { role: "user", content: JSON.stringify(items) },
        ],
        response_format: { type: "json_object" },
      };
    }

    const req = await gmFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const res = await req.json();

    let txt = res.choices?.[0]?.message?.content || res.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 健壮的JSON提取逻辑
    const firstBracket = txt.indexOf("[");
    const lastBracket = txt.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      txt = txt.substring(firstBracket, lastBracket + 1);
    } else {
      txt = txt.replace(/```json|```/g, "").trim();
    }

    try {
      const parsed = JSON.parse(txt);
      return Array.isArray(parsed) ? parsed : parsed.items || parsed.data || [];
    } catch (e) {
      Log.error("JSON解析失败", e);
      Log.warn("原始AI返回: " + txt.substring(0, 200));
      return [];
    }
  }

  // ========================================
  // 处理新数据
  // ========================================
  function processNewData(newItems) {
    if (!newItems || !newItems.length) return;

    const list = getStorage(STORAGE.ACTIVE_BUBBLES);
    const map = new Map();

    // 使用tid去重，保留最新的
    list.forEach((i) => map.set(i.tid, i));
    newItems.forEach((i) => map.set(i.tid, i));

    // 按分数排序，限制数量
    const sorted = Array.from(map.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_BUBBLES);

    setStorage(STORAGE.ACTIVE_BUBBLES, sorted);
    refreshList(true);
  }

  // ========================================
  // 移除条目（广播 + 更新存储）
  // ========================================
  function removeItem(id) {
    CHANNEL.postMessage({ type: "DEL", id });
    const list = getStorage(STORAGE.ACTIVE_BUBBLES).filter((i) => i.id !== id);
    setStorage(STORAGE.ACTIVE_BUBBLES, list);
  }

  // ========================================
  // 平滑移除 DOM 元素
  // ========================================
  function animateRemove(element) {
    element.style.transition = "opacity 0.2s, transform 0.2s";
    element.style.opacity = "0";
    element.style.transform = "translateX(30px)";
    element.addEventListener("transitionend", () => element.remove(), {
      once: true,
    });
  }

  // ========================================
  // 刷新列表UI
  // ========================================
  function refreshList(scrollToTop) {
    const container = document.getElementById("radar-list");
    if (!container) return;

    const data = getStorage(STORAGE.ACTIVE_BUBBLES);
    data.sort((a, b) => b.score - a.score);

    container.innerHTML = "";

    // 清除全部按钮
    if (data.length > 0) {
      const clearBtn = document.createElement("button");
      clearBtn.className = "r-clear-all";
      clearBtn.textContent = "🗑️ 清除全部";
      clearBtn.onclick = () => {
        setStorage(STORAGE.ACTIVE_BUBBLES, []);
        refreshList(false);
        CHANNEL.postMessage({ type: "SYNC_LIST" });
      };
      container.appendChild(clearBtn);
    }

    data.forEach((d) => {
      const url = `https://linux.do/t/${d.slug}/${d.tid}/${d.pid}`;
      const link = document.createElement("a");
      const isAlert = d.score >= config.highScoreThreshold;
      link.className = `r-item ${isAlert ? "alert" : ""}`;
      link.dataset.id = d.id;
      link.href = url;
      link.rel = "noopener";
      link.innerHTML = `
                <button class="r-close" title="关闭">×</button>
                <div class="r-head">
                    <span>${getMelons(d.score)} ${d.title.substring(0, 20)}</span>
                    <span class="r-score">${d.score}</span>
                </div>
                <div class="r-desc">${d.summary}</div>
            `;
      // 关闭按钮事件 - 仅关闭不跳转
      link.querySelector(".r-close").onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeItem(d.id);
        animateRemove(link);
      };
      // 左键点击当前页面跳转并自动移除
      link.onclick = (e) => {
        // Ctrl/Cmd+点击使用浏览器默认行为（新标签页打开）
        if (e.ctrlKey || e.metaKey) {
          removeItem(d.id);
          animateRemove(link);
          return; // 不阻止默认行为
        }
        // 普通左键点击：当前页面跳转
        e.preventDefault();
        removeItem(d.id);
        window.location.href = url;
      };
      // 中键点击在新标签页打开
      link.onauxclick = (e) => {
        if (e.button === 1) {
          removeItem(d.id);
          animateRemove(link);
          // 不阻止默认行为，让浏览器在新标签页打开
        }
      };
      container.appendChild(link);
    });

    if (scrollToTop) container.scrollTop = 0;
  }

  // ========================================
  // 删除条目（用于跨标签同步）
  // ========================================
  function processDelete(id) {
    const list = getStorage(STORAGE.ACTIVE_BUBBLES).filter((i) => i.id !== id);
    setStorage(STORAGE.ACTIVE_BUBBLES, list);
    // 平滑移除对应 DOM 元素
    const container = document.getElementById("radar-list");
    if (container) {
      const item = container.querySelector(`.r-item[data-id="${id}"]`);
      if (item) {
        animateRemove(item);
      }
    }
  }

  // ========================================
  // 跨标签页通信
  // ========================================
  CHANNEL.onmessage = (e) => {
    const { type, data, x, y, val, id } = e.data;
    const ball = document.getElementById("radar-ball");
    const listContainer = document.getElementById("radar-list");

    switch (type) {
      case "SYNC_POS":
        if (ball) {
          ball.style.left = x;
          ball.style.top = y;
        }
        config.ballX = x;
        config.ballY = y;
        break;

      case "SYNC_MIN":
        config.isMinimized = val;
        if (listContainer) {
          listContainer.style.display = val ? "none" : "flex";
        }
        break;

      case "SYNC_CFG":
        config = data;
        managePolling();
        break;

      case "ADD_BATCH":
        processNewData(data);
        break;

      case "DEL":
        processDelete(id);
        break;

      case "RESET":
        localStorage.removeItem(STORAGE.HISTORY_TIDS);
        localStorage.removeItem(STORAGE.ACTIVE_BUBBLES);
        localStorage.removeItem(STORAGE.LATEST_WINDOW_IDS);
        refreshList(false);
        break;
    }
  };

  // ========================================
  // 页面卸载时释放Leader锁
  // ========================================
  window.addEventListener("beforeunload", () => {
    if (isLeader) {
      localStorage.removeItem(STORAGE.LEADER_LOCK);
    }
  });

  // 启动
  init();
})();
