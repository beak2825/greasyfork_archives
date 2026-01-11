// ==UserScript==
// @license MIT
// @name         X 用户队列助手（自动化增强版 v2.2）
// @namespace    local
// @version      2.2
// @description  粘贴导入 -> 自动跳转 -> 自动点击关注 -> 随机延迟。已关注用户急速跳转，未关注用户安全延迟。
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562195/X%20%E7%94%A8%E6%88%B7%E9%98%9F%E5%88%97%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%20v22%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562195/X%20%E7%94%A8%E6%88%B7%E9%98%9F%E5%88%97%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%20v22%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const ROOT_ID = "x_queue_helper_root_v4_auto";
  if (document.getElementById(ROOT_ID)) return;

  const STORAGE_KEY = "x_queue_helper_state_v2"; 

  const RESERVED = new Set([
    "", "home", "explore", "notifications", "messages", "i", "settings",
    "compose", "search", "login", "logout", "signup", "intent", "hashtag",
    "tos", "privacy"
  ]);

  const FOLLOW_TEXTS = ["\u5173\u6CE8", "Follow"];
  const FOLLOWING_TEXTS = ["\u5DF2\u5173\u6CE8", "Following"];

  const NOTFOUND_TEXTS = [
    "\u6B64\u8D26\u53F7\u4E0D\u5B58\u5728",
    "\u8FD9\u4E2A\u8D26\u53F7\u4E0D\u5B58\u5728",
    "This account doesn't exist",
    "This account doesn\u2019t exist",
  ];

  const SUSPENDED_TEXTS = ["\u8D26\u53F7\u5DF2\u88AB\u51BB\u7ED3", "Account suspended"];

  const STATUS_LABEL = {
    pending: "\u5F85\u5904\u7406",
    follow_clicked: "\u2705 \u5DF2\u81EA\u52A8\u5173\u6CE8",
    following_detected: "\u2714 \u539F\u672C\u5DF2\u5173",
    not_found: "\u274C \u4E0D\u5B58\u5728",
    suspended: "\u26D4 \u51BB\u7ED3",
    skipped: "\u23ED \u8DF3\u8FC7",
  };

  // === 23 人名单 ===
  const PRESET_USERNAMES = [
    "VitalikButerin",
    "hwwonx",
    "tkstanczak",
    "brucexu_eth",
    "nixorokish",
    "JBSchweitzer",
    "TimBeiko",
    "austingriffith",
    "DavideCrapis",
    "KhanAbbas201",
    "lanhubiji",
    "tmel0211",
    "nake13",
    "sassal0x",
    "haydenzadams",
    "superphiz",
    "owocki",
    "dankrad",
    "protolambda",
    "terencechain",
    "jessepollak",
    "chaowxyz",
    "jasoncrawford"
  ];

  const now = () => Date.now();
  // 随机延迟工具：min 到 max 毫秒
  const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
        queue: [],
        idx: 0,
        status: {},
        open: false,
        autoMode: false 
      };
    } catch {
      return { queue: [], idx: 0, status: {}, open: false, autoMode: false };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function normalizeText(text) {
    return (text || "").replace(/\uFF20/g, "@").replace(/\u3000/g, " ").replace(/\r/g, "\n");
  }

  function parseUsernames(rawText) {
    const text = normalizeText(rawText);
    const out = new Set();
    const urlRe = /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})/gi;
    for (let m; (m = urlRe.exec(text));) out.add(m[1]);
    const atRe = /@([A-Za-z0-9_]{1,15})/g;
    for (let m; (m = atRe.exec(text));) out.add(m[1]);
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line0 of lines) {
      if (line0.includes("http") || line0.includes("@")) continue;
      if (/^[A-Za-z0-9_]{1,15}$/.test(line0)) out.add(line0);
    }
    return [...out];
  }

  function includesAny(haystack, words) {
    if (!haystack) return false;
    return words.some((w) => haystack === w || haystack.includes(w));
  }

  function getUsernameFromUrl() {
    const seg = (location.pathname || "/").split("/").filter(Boolean)[0] || "";
    if (RESERVED.has(seg)) return null;
    return seg;
  }

  function gotoUser(username) {
    if (!username) return;
    location.href = `https://x.com/${encodeURIComponent(username)}`;
  }

  function setStatus(state, username, status, meta) {
    if (!username) return;
    state.status[username] = { status, updatedAt: now(), ...(meta || {}) };
    saveState(state);
    render(); 
  }

  function pageTextIncludesAny(list) {
    const t = (document.body && document.body.innerText ? document.body.innerText : "").slice(0, 25000);
    return list.some((s) => t.includes(s));
  }

  // 获取按钮状态
  function getFollowButtonState() {
    const buttons = Array.from(document.querySelectorAll("button"));
    const norm = (s) => (s || "").trim();
    for (const b of buttons) {
      const txt = norm(b.innerText);
      const aria = norm(b.getAttribute("aria-label"));
      const combined = `${txt} ${aria}`.trim();
      if (includesAny(combined, FOLLOWING_TEXTS)) return { button: b, state: "following", combined };
      if (includesAny(combined, FOLLOW_TEXTS)) return { button: b, state: "follow", combined };
    }
    return null;
  }

  function detectAndMarkFromProfile(state) {
    const u = getUsernameFromUrl();
    if (!u) return null;

    if (pageTextIncludesAny(NOTFOUND_TEXTS)) {
      setStatus(state, u, "not_found");
      return "not_found";
    }
    if (pageTextIncludesAny(SUSPENDED_TEXTS)) {
      setStatus(state, u, "suspended");
      return "suspended";
    }

    const info = getFollowButtonState();
    if (!info) return "unknown";

    if (info.state === "following") {
      setStatus(state, u, "following_detected");
      return "following";
    }
    if (info.state === "follow") {
      return "can_follow";
    }
    return "unknown";
  }

  function nextPendingIndex(state, fromIdx) {
    if (!state.queue.length) return 0;
    for (let i = fromIdx; i < state.queue.length; i++) {
      const u = state.queue[i];
      const s = state.status[u] && state.status[u].status;
      if (!s || s === "pending") return i;
    }
    return -1; 
  }

  // ================= 自动化核心逻辑 =================
  async function runAutoLoop() {
    const st = loadState();
    if (!st.autoMode) return;
    
    const currentQueueUser = st.queue[st.idx];
    const urlUser = getUsernameFromUrl();

    if (!currentQueueUser) {
        alert("队列已结束或为空，自动停止");
        st.autoMode = false;
        saveState(st);
        render();
        return;
    }

    if (urlUser && urlUser.toLowerCase() !== currentQueueUser.toLowerCase()) {
       console.log(`[Auto] URL用户(${urlUser})与队列用户(${currentQueueUser})不一致，准备跳转...`);
       await sleep(1000);
       gotoUser(currentQueueUser);
       return;
    }

    logToUI(`[Auto] 正在分析: ${currentQueueUser}...`);
    
    // 页面加载等待 (X需要时间渲染DOM，不能太短)
    const waitLoadTime = randomDelay(2000, 4000);
    await sleep(waitLoadTime);

    const freshState = loadState();
    if (!freshState.autoMode) return;

    const pageStatus = detectAndMarkFromProfile(freshState);
    logToUI(`[Auto] 状态: ${pageStatus}`);

    // === 优化分支：已关注急速跳转 ===
    if (pageStatus === "following") {
        const quickDelay = randomDelay(500, 800); // 极短延迟
        logToUI(`[Auto] 已关注，${quickDelay}ms 后急速跳转...`);
        await sleep(quickDelay);
        goToNextUserAndSave();
        return;
    }

    // === 异常分支：不存在或冻结 ===
    if (pageStatus === "not_found" || pageStatus === "suspended") {
        logToUI(`[Auto] 账号异常，稍后跳转...`);
        await sleep(randomDelay(1000, 2000));
        goToNextUserAndSave();
        return;
    }

    // === 操作分支：执行关注 ===
    if (pageStatus === "can_follow") {
        const info = getFollowButtonState();
        if (info && info.button) {
            logToUI(`[Auto] 点击关注...`);
            info.button.click();
            
            setStatus(freshState, currentQueueUser, "follow_clicked");
            
            // 点击后必须长冷却，模拟真人浏览
            const cooldown = randomDelay(3000, 6000);
            logToUI(`[Auto] 已点击，冷却 ${cooldown}ms ...`);
            await sleep(cooldown);
            
            goToNextUserAndSave();
        } else {
            logToUI(`[Auto] 异常：找不到按钮DOM`);
            await sleep(2000);
            goToNextUserAndSave();
        }
        return;
    }

    logToUI(`[Auto] 状态未知，可能加载慢，跳过...`);
    await sleep(2000);
    goToNextUserAndSave();
  }

  function goToNextUserAndSave() {
      const st = loadState();
      if (!st.autoMode) return;
      
      const nextIdx = nextPendingIndex(st, st.idx + 1);
      if (nextIdx === -1) {
          st.autoMode = false;
          saveState(st);
          render();
          alert("自动化队列已全部完成！");
          return;
      }
      
      st.idx = nextIdx;
      saveState(st);
      render();
      
      const nextUser = st.queue[nextIdx];
      logToUI(`[Auto] -> ${nextUser}`);
      gotoUser(nextUser);
  }

  // ================= UI 部分 =================
  const state = loadState();

  function mount() {
    if (document.getElementById(ROOT_ID)) return;
    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.style.cssText = "all:initial; position:fixed; right:12px; bottom:20vh; z-index:2147483647;";

    const fab = document.createElement("button");
    fab.textContent = state.autoMode ? "Auto运行中..." : "助手控制台";
    fab.style.cssText = `all:initial; display:inline-block; background:${state.autoMode ? '#00ba7c' : '#1d9bf0'}; color:#fff; border-radius:999px; padding:10px 12px; font:13px system-ui; box-shadow:0 5px 15px rgba(0,0,0,.3); cursor:pointer;`;

    const panel = document.createElement("div");
    panel.style.cssText = `display:${state.open ? "block" : "none"}; margin-top:10px; width:360px; background:#000; color:#eee; border:1px solid #333; border-radius:12px; padding:12px; font:12px system-ui;`;

    const ta = document.createElement("textarea");
    ta.placeholder = "在此粘贴用户名列表...";
    ta.style.cssText = "display:block; width:100%; height:60px; background:#111; color:#fff; border:1px solid #333; margin-bottom:8px;";

    const logBox = document.createElement("div");
    logBox.style.cssText = "color:#0f0; margin-bottom:8px; height:20px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;";

    const btnContainer = document.createElement("div");
    btnContainer.style.cssText = "display:flex; gap:5px; flex-wrap:wrap;";

    const mkBtn = (txt, color, cb) => {
      const b = document.createElement("button");
      b.textContent = txt;
      b.style.cssText = `background:${color}; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;`;
      b.onclick = cb;
      return b;
    };

    btnContainer.appendChild(mkBtn("导入", "#555", () => {
       const list = parseUsernames(ta.value);
       if(!list.length) return alert("未识别到用户名");
       state.queue = list;
       state.idx = 0;
       saveState(state);
       render();
       alert(`已导入 ${list.length} 人`);
    }));

    const btnAutoStart = mkBtn("▶ 启动自动关注", "#00ba7c", () => {
        if(!state.queue.length) return alert("请先导入");
        if(confirm("警告：自动化操作有封号风险。\n\n已优化：遇到已关注用户会快速跳过。\n遇到未关注用户会执行安全延迟。\n\n确定开始吗？")) {
            state.autoMode = true;
            saveState(state);
            render();
            runAutoLoop();
        }
    });

    const btnAutoStop = mkBtn("⏹ 停止", "#f4212e", () => {
        state.autoMode = false;
        saveState(state);
        render();
        logToUI("已手动停止自动化");
    });

    const btnReset = mkBtn("清空队列", "#333", () => {
        state.queue = [];
        state.idx = 0;
        state.status = {};
        state.autoMode = false;
        saveState(state);
        render();
    });
    
    // 载入预设
    const btnPreset = mkBtn("载入预设(Alt+D)", "#1d9bf0", () => {
        ta.value = PRESET_USERNAMES.join("\n");
        const list = parseUsernames(ta.value);
        state.queue = list;
        state.idx = 0;
        saveState(state);
        render();
    });

    btnContainer.appendChild(btnAutoStart);
    btnContainer.appendChild(btnAutoStop);
    btnContainer.appendChild(btnPreset);
    btnContainer.appendChild(btnReset);

    const statusDiv = document.createElement("div");
    statusDiv.style.cssText = "margin-top:10px; border-top:1px solid #333; padding-top:5px; max-height:150px; overflow:auto;";

    panel.appendChild(ta);
    panel.appendChild(logBox);
    panel.appendChild(btnContainer);
    panel.appendChild(statusDiv);
    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);

    fab.onclick = () => {
      state.open = !state.open;
      saveState(state);
      panel.style.display = state.open ? "block" : "none";
    };

    mount.refs = { statusDiv, logBox, fab, btnAutoStart, btnAutoStop };
  }

  function logToUI(msg) {
      if(mount.refs && mount.refs.logBox) mount.refs.logBox.textContent = msg;
      console.log(msg);
  }

  function render() {
    if (!mount.refs) return;
    const { statusDiv, fab, btnAutoStart, btnAutoStop } = mount.refs;
    
    fab.textContent = state.autoMode ? "Auto运行中..." : "助手控制台";
    fab.style.background = state.autoMode ? '#00ba7c' : '#1d9bf0';
    btnAutoStart.style.display = state.autoMode ? 'none' : 'inline-block';
    btnAutoStop.style.display = state.autoMode ? 'inline-block' : 'none';

    statusDiv.innerHTML = "";
    if (!state.queue.length) {
        statusDiv.textContent = "队列为空";
        return;
    }

    state.queue.forEach((u, i) => {
        const s = (state.status[u] && state.status[u].status) || "pending";
        const row = document.createElement("div");
        row.style.cssText = `padding:2px; font-size:11px; ${i === state.idx ? "background:#222; color:#fff;" : "color:#888;"}`;
        let label = STATUS_LABEL[s] || "待处理";
        if(i === state.idx && state.autoMode) label += " <ING>";
        row.textContent = `${i+1}. ${u} - ${label}`;
        statusDiv.appendChild(row);
    });
  }

  function init() {
      mount();
      render();
      if (state.autoMode) {
          logToUI("检测到自动模式开启，3秒后继续...");
          setTimeout(runAutoLoop, 3000);
      }
  }
  
  window.addEventListener("keydown", (e) => {
      if (e.altKey && e.key.toLowerCase() === "d") {
          mount.refs && mount.refs.ta ? (mount.refs.ta.value = PRESET_USERNAMES.join("\n")) : null;
      }
  });

  init();
})();