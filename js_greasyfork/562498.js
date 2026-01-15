// ==UserScript==
// @name         小红书全能AI助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  采用API拦截技术，支持自动滚动获取全部笔记，生成带xsec_token的永久有效链接，支持导出Excel/CSV/JSON,支持创作者平台一键生成推文，支持自定义设置推文模版。
// @author       Coriander
// @match        https://creator.xiaohongshu.com/publish/*
// @match        https://www.xiaohongshu.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562498/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%A8%E8%83%BDAI%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562498/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%A8%E8%83%BDAI%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==========================================
  // 0. 全局数据存储 (核心)
  // ==========================================
  const GLOBAL_DATA = new Map();
  let isAutoScrolling = false;
  let currentPageUrl = location.href; // 记录当前页面URL

  // ==========================================
  // 0.1 页面切换监听 - 保持数据清洁性
  // ==========================================
  function getPageKey(url) {
    try {
      const u = new URL(url);
      // 用户主页: /user/profile/xxx
      // 收藏夹: /user/profile/xxx/collect 或 /board/xxx
      // 搜索: /search_result
      // 首页: /
      return u.pathname;
    } catch {
      return url;
    }
  }

  function checkPageChange() {
    const newUrl = location.href;
    const oldKey = getPageKey(currentPageUrl);
    const newKey = getPageKey(newUrl);

    if (oldKey !== newKey) {
      console.log(`[XHS助手] 页面切换: ${oldKey} -> ${newKey}，清空数据`);
      GLOBAL_DATA.clear();
      updateCountUI();
      // 停止自动滚动（如果正在进行）
      if (isAutoScrolling) {
        const btn = document.getElementById("auto-scroll-btn");
        if (btn) btn.click(); // 触发停止
      }
      currentPageUrl = newUrl;
    }
  }

  // 监听 URL 变化（小红书是 SPA，用 History API）
  function setupPageChangeListener() {
    // 监听 popstate（浏览器前进/后退）
    window.addEventListener("popstate", checkPageChange);

    // 拦截 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(checkPageChange, 100);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(checkPageChange, 100);
    };

    // 兜底：定时检查（防止某些情况遗漏）
    setInterval(checkPageChange, 2000);
  }

  // 启动页面切换监听
  setupPageChangeListener();

  // ==========================================
  // 1. API 拦截器 (Hook XHR)
  // ==========================================
  function hookXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener("load", function () {
        // 监听特定 API 接口
        // /api/sns/web/v1/user_posted -> 用户主页（笔记）
        // /api/sns/web/v2/note/collect/page -> 收藏夹
        // /api/sns/web/v1/note/like/page -> 点赞列表
        // /api/sns/web/v1/user/like -> 点赞列表（备选）
        // /api/sns/web/v1/feed -> 首页推荐/搜索
        if (
          this._url &&
          (this._url.includes("/api/sns/web/v1/user_posted") ||
            this._url.includes("/api/sns/web/v2/note/collect/page") ||
            this._url.includes("/api/sns/web/v1/note/like/page") ||
            this._url.includes("/api/sns/web/v1/user/like") ||
            this._url.includes("/api/sns/web/v1/feed") ||
            this._url.includes("/api/sns/web/v1/search/notes"))
        ) {
          try {
            const res = JSON.parse(this.responseText);
            if (res.data && (res.data.notes || res.data.items)) {
              const list = res.data.notes || res.data.items || [];
              processNotes(list);
            }
          } catch (e) {
            console.error("小红书助手: 解析API数据失败", e);
          }
        }
      });
      return originalSend.apply(this, arguments);
    };
  }

  // 处理并存储笔记数据
  function processNotes(notes) {
    let newCount = 0;
    notes.forEach((note) => {
      // 不同的接口返回结构可能略有不同，这里做兼容
      // 核心目标：ID, 标题, xsec_token
      const id = note.id || note.note_id || note.noteId;
      if (!id) return;

      // 构造完整链接 (带 token)
      // 优先使用 xsec_token，如果没有则尝试从 note_card 里找
      const token =
        note.xsec_token || (note.note_card && note.note_card.xsec_token) || "";
      let link = `https://www.xiaohongshu.com/explore/${id}`;
      if (token) {
        link += `?xsec_token=${token}&xsec_source=pc_user`;
      }

      const title = note.title || note.display_title || "无标题";
      const type = note.type || "normal";
      const user = note.user || {};
      const authorName = user.nickname || user.name || "未知作者";
      const likes =
        note.likes ||
        note.liked_count ||
        (note.interact_info ? note.interact_info.liked_count : 0);

      // 存入 Map
      if (!GLOBAL_DATA.has(id)) {
        GLOBAL_DATA.set(id, {
          笔记ID: id,
          标题: title,
          链接: link,
          作者: authorName,
          点赞数: likes,
          类型: type,
          xsec_token: token, // 仅作为参考，导出时不一定需要
        });
        newCount++;
      }
    });

    // 更新 UI 计数
    updateCountUI();
  }

  // 启动 Hook
  hookXHR();

  // ==========================================
  // 2. 默认模板 (AI部分 - 保持不变)
  // ==========================================
  const DEFAULT_TEMPLATES = [
    {
      id: "novel_default",
      name: "📖 小说推文 (情绪爆款)",
      desc1: "小说名称",
      desc2: "精彩片段/剧情",
      placeholder1: "例如：重生之将门毒后",
      placeholder2: "粘贴这一章的剧情...",
      system:
        "你是一个小红书推文博主，风格非常情绪化、激动，喜欢用'啊啊啊'、'高开暴走'、'Top1'等词汇。",
      prompt: `请模仿以下风格推荐小说《{{title}}》。\n【参考风格】："啊啊啊高开暴走！！..."\n【小说内容】：{{content}}\n要求：标题带悬念含Emoji，正文情绪化分段，JSON格式输出 {"title": "...", "content": "..."}`,
    },
    {
      id: "product_default",
      name: "💄 好物种草 (痛点直击)",
      desc1: "产品名称",
      desc2: "核心卖点/痛点",
      placeholder1: "例如：戴森吹风机",
      placeholder2: "痛点：头发干枯... 体验：柔顺...",
      system:
        "你是一个小红书金牌种草官，擅长挖掘痛点和场景，说话就像闺蜜聊天。",
      prompt: `请为产品【{{title}}】写一篇种草笔记。\n信息：{{content}}\n要求：痛点+场景+Emoji，JSON格式输出 {"title": "...", "content": "..."}`,
    },
  ];

  // ==========================================
  // 3. 核心样式
  // ==========================================
  const UI_CSS = `
        @keyframes slideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 36, 66, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 36, 66, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 36, 66, 0); } }
        #xhs-ai-helper {
            position: fixed; top: 100px; right: 20px; width: 380px;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
            border-radius: 16px; z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transition: all 0.3s; display: flex; flex-direction: column; color: #333;
        }
        .drag-handle { padding: 15px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; user-select: none; }
        .ai-brand { font-weight: 800; font-size: 15px; display: flex; align-items: center; gap: 5px; }
        #xhs-ai-helper.minimized { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; cursor: pointer; background: #ff2442; }
        #xhs-ai-helper.minimized .minimized-icon { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 24px; }
        #xhs-ai-helper.minimized .ai-main-wrapper { display: none; }

        .ai-tabs { display: flex; padding: 0 15px; border-bottom: 1px solid #eee; background: #fcfcfc; border-radius: 16px 16px 0 0; }
        .ai-tab-item { padding: 12px 15px; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; border-bottom: 2px solid transparent; }
        .ai-tab-item.active { color: #ff2442; border-bottom-color: #ff2442; }

        .ai-content-body { padding: 15px; max-height: 70vh; overflow-y: auto; background: #fff; border-radius: 0 0 16px 16px; }
        .tab-panel { display: none; }
        .tab-panel.active { display: block; animation: slideIn 0.2s; }

        .ai-input, .ai-textarea, .ai-select { width: 100%; padding: 8px 10px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box; background:#f9f9f9; }
        .ai-textarea { height: 80px; resize: vertical; }
        .ai-btn { width: 100%; padding: 10px; background: #ff2442; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 5px; }
        .ai-btn:hover { opacity: 0.9; }
        .ai-btn.secondary { background: #f0f0f0; color: #333; }
        .ai-btn.scrolling { background: #ff9800; animation: pulse 2s infinite; }

        .data-card { background: #f4f8ff; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e1eaff; }
        .export-tip { font-size: 12px; color: #666; margin-top: 10px; line-height: 1.5; background: #fffbe6; padding: 8px; border-radius: 6px; }

        /* 小屏幕/副屏适配 */
        @media screen and (max-width: 500px), screen and (max-height: 600px) {
            #xhs-ai-helper {
                width: calc(100vw - 20px) !important;
                max-width: 360px;
                right: 10px !important;
                left: auto !important;
                top: 10px !important;
                max-height: calc(100vh - 20px);
            }
            #xhs-ai-helper .ai-content-body {
                max-height: calc(100vh - 150px);
            }
        }
        @media screen and (max-width: 400px) {
            #xhs-ai-helper {
                width: calc(100vw - 10px) !important;
                right: 5px !important;
                font-size: 13px;
            }
            #xhs-ai-helper .ai-tabs { padding: 0 8px; }
            #xhs-ai-helper .ai-tab-item { padding: 10px 8px; font-size: 12px; }
            #xhs-ai-helper .ai-content-body { padding: 10px; }
        }
    `;
  GM_addStyle(UI_CSS);

  // ==========================================
  // 4. UI 构建
  // ==========================================
  let templates = [];
  function loadTemplates() {
    const stored = GM_getValue("user_templates", null);
    templates = stored
      ? JSON.parse(stored)
      : JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
  }

  function saveTemplates() {
    GM_setValue("user_templates", JSON.stringify(templates));
  }

  function createUI() {
    if (document.getElementById("xhs-ai-helper")) return;
    loadTemplates();

    const div = document.createElement("div");
    div.id = "xhs-ai-helper";
    div.innerHTML = `
            <div class="minimized-icon">🔧</div>
            <div class="ai-main-wrapper">
                <div class="drag-handle">
                    <div class="ai-brand"><span>🔴</span> 小红书助手</div>
                    <button id="minimize-btn" style="border:none;background:none;cursor:pointer;font-size:16px;">_</button>
                </div>
                <div class="ai-tabs">
                    <div class="ai-tab-item active" data-tab="data">数据导出</div>
                    <div class="ai-tab-item" data-tab="write">AI创作</div>
                </div>
                <div class="ai-content-body">
                    <div id="panel-data" class="tab-panel active">
                        <div class="data-card">
                            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
                                <span>当前已捕获：<b id="page-obj-count" style="color:#ff2442;font-size:14px;">0</b> 条</span>
                                <span id="scroll-status" style="color:#999;">静止中</span>
                            </div>
                            <div style="font-size:11px;color:#666;margin-bottom:8px;">💡 提示：向下滑动页面，数据会自动增加。</div>

                            <button id="auto-scroll-btn" class="ai-btn secondary" style="padding:8px;">⏬ 自动滚动加载全部</button>
                        </div>

                        <div style="display:flex;gap:5px;">
                            <select id="export-format" class="ai-select" style="margin-bottom:0;">
                                <option value="csv">Excel / CSV (推荐)</option>
                                <option value="json">JSON (开发用)</option>
                            </select>
                            <button id="clean-data-btn" class="ai-btn secondary" style="width:auto;margin-top:0;">清空</button>
                        </div>

                        <button id="export-btn" class="ai-btn" style="background:#00b85c;margin-top:10px;">📥 导出所有捕获数据</button>

                        <div class="export-tip">
                            ✅ <b>已启用 API 拦截模式</b><br>
                            导出的链接将包含 <code>xsec_token</code>，确保能在浏览器中直接访问，不会出现"笔记不存在"。<br>
                            支持收藏夹、个人主页、搜索结果页。
                        </div>
                    </div>

                    <div id="panel-write" class="tab-panel">
                        <div class="ai-input-group">
                             <select id="template-select" class="ai-select"></select>
                             <input id="input-1" class="ai-input" placeholder="主题">
                             <textarea id="input-2" class="ai-textarea" placeholder="内容详情"></textarea>

                            <div style="display:flex;gap:6px;margin-bottom:10px;">
                              <button id="template-manage-toggle" class="ai-btn secondary" style="margin:0;">🛠️ 管理模版</button>
                              <button id="persona-gen-btn" class="ai-btn secondary" style="margin:0;">🧠 AI生成人设</button>
                            </div>

                            <div id="template-manage-panel" style="display:none;padding:10px;border:1px solid #eee;border-radius:10px;background:#fafafa;">
                              <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                               <select id="template-manage-select" class="ai-select" style="margin:0;"></select>
                               <button id="template-new-btn" class="ai-btn secondary" style="margin:0;width:120px;">➕ 新增模版</button>
                              </div>
                              <input id="tpl-name" class="ai-input" placeholder="模版名称 (例：好物种草)" />
                              <input id="tpl-desc1" class="ai-input" placeholder="第一个输入提示 (例：产品名称)" />
                              <input id="tpl-desc2" class="ai-input" placeholder="第二个输入提示 (例：核心卖点)" />
                              <textarea id="tpl-system" class="ai-textarea" placeholder="System 提示 (AI角色)" style="height:70px;"></textarea>
                              <textarea id="tpl-prompt" class="ai-textarea" placeholder="Prompt 模版，使用 {{title}} / {{content}} 占位符" style="height:90px;"></textarea>
                              <textarea id="tpl-persona" class="ai-textarea" placeholder="输入模版人设/要求，让AI自动生成 system 与 prompt" style="height:60px;"></textarea>
                              <div style="display:flex;gap:8px;">
                                <button id="template-save-btn" class="ai-btn" style="margin:0;">💾 保存修改</button>
                                <button id="template-save-new-btn" class="ai-btn secondary" style="margin:0;">📑 另存为新模版</button>
                                <button id="template-delete-btn" class="ai-btn secondary" style="margin:0;background:#ffecec;color:#d03030;">🗑️ 删除</button>
                              </div>
                              <div id="template-manage-status" style="margin-top:6px;font-size:12px;color:#666;"></div>
                            </div>

                             <div style="font-size:12px;color:#999;margin-bottom:5px;cursor:pointer;" id="config-toggle">⚙️ API 配置 (点击展开)</div>
                             <div id="config-area" style="display:none;margin-bottom:10px;">
                                <input id="api-base-url" class="ai-input" placeholder="Base URL" value="${GM_getValue(
                                  "api_base_url",
                                  "https://api.moonshot.cn/v1/chat/completions"
                                )}">
                                <input id="api-key" type="password" class="ai-input" placeholder="API Key" value="${GM_getValue(
                                  "api_key",
                                  ""
                                )}">
                                <input id="api-model" class="ai-input" placeholder="Model" value="${GM_getValue(
                                  "api_model",
                                  "moonshot-v1-8k"
                                )}">
                             </div>

                             <button id="ai-gen-btn" class="ai-btn">✨ 生成文案</button>
                             <div id="ai-status" style="text-align:center;font-size:12px;margin-top:5px;color:#999;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(div);

    // 绑定事件
    bindDrag(div);

    div.querySelector("#minimize-btn").onclick = () =>
      div.classList.toggle("minimized");
    div.querySelector(".minimized-icon").onclick = () =>
      div.classList.toggle("minimized");

    const tabs = div.querySelectorAll(".ai-tab-item");
    tabs.forEach(
      (t) =>
        (t.onclick = () => {
          tabs.forEach((x) => x.classList.remove("active"));
          t.classList.add("active");
          div
            .querySelectorAll(".tab-panel")
            .forEach((p) => p.classList.remove("active"));
          div.querySelector("#panel-" + t.dataset.tab).classList.add("active");
        })
    );

    // ==========================
    // 数据功能绑定
    // ==========================
    div.querySelector("#auto-scroll-btn").onclick = toggleAutoScroll;
    div.querySelector("#clean-data-btn").onclick = () => {
      if (confirm("确定清空已捕获的数据吗？")) {
        GLOBAL_DATA.clear();
        updateCountUI();
      }
    };
    div.querySelector("#export-btn").onclick = exportData;

    // AI功能绑定
    div.querySelector("#config-toggle").onclick = () => {
      const el = document.getElementById("config-area");
      el.style.display = el.style.display === "none" ? "block" : "none";
    };
    ["api-base-url", "api-key", "api-model"].forEach((id) => {
      document.getElementById(id).onchange = (e) =>
        GM_setValue(id.replace(/-/g, "_"), e.target.value);
    });
    div.querySelector("#ai-gen-btn").onclick = handleAI;

    // 模版管理
    const managePanel = document.getElementById("template-manage-panel");
    document.getElementById("template-manage-toggle").onclick = () => {
      managePanel.style.display =
        managePanel.style.display === "none" ? "block" : "none";
    };
    document.getElementById("template-manage-select").onchange = () => {
      const t = templates.find(
        (x) => x.id === document.getElementById("template-manage-select").value
      );
      if (t) fillTemplateForm(t);
    };
    document.getElementById("template-new-btn").onclick = () => {
      const empty = {
        id: "tmp_" + Date.now(),
        name: "新模版",
        desc1: "输入1",
        desc2: "输入2",
        placeholder1: "",
        placeholder2: "",
        system: "你是一个专业的创作者助手。",
        prompt: "请基于{{title}}和{{content}}生成创作内容。",
      };
      templates.push(empty);
      saveTemplates();
      refreshTemplates();
      refreshManageSelect(empty.id);
      fillTemplateForm(empty);
      toastManage("已创建空白模版，可编辑后保存");
    };
    document.getElementById("template-save-btn").onclick = () => {
      const id = document.getElementById("template-manage-select").value;
      const idx = templates.findIndex((x) => x.id === id);
      if (idx === -1) return alert("请选择要保存的模版");
      templates[idx] = collectTemplateForm(id);
      saveTemplates();
      refreshTemplates();
      refreshManageSelect(id);
      fillTemplateForm(templates[idx]);
      toastManage("已保存模版");
    };
    document.getElementById("template-save-new-btn").onclick = () => {
      const id = "tpl_" + Date.now();
      const t = collectTemplateForm(id);
      templates.push(t);
      saveTemplates();
      refreshTemplates();
      refreshManageSelect(id);
      fillTemplateForm(t);
      toastManage("已另存为新模版");
    };
    document.getElementById("template-delete-btn").onclick = () => {
      const id = document.getElementById("template-manage-select").value;
      if (!confirm("确认删除该模版吗？")) return;
      templates = templates.filter((x) => x.id !== id);
      if (!templates.length)
        templates = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
      saveTemplates();
      refreshTemplates();
      const first = templates[0];
      refreshManageSelect(first.id);
      fillTemplateForm(first);
      toastManage("模版已删除");
    };
    document.getElementById("persona-gen-btn").onclick = handlePersonaGenerate;

    refreshManageSelect();
    if (templates[0]) fillTemplateForm(templates[0]);

    refreshTemplates();

    // 初始化时，如果页面已经有数据（SSR），尝试简单抓取一下当前DOM补充（作为兜底）
    setTimeout(scanInitialDOM, 2000);
  }

  // ==========================================
  // 5. 自动滚动与数据逻辑
  // ==========================================

  function updateCountUI() {
    const el = document.getElementById("page-obj-count");
    if (el) el.innerText = GLOBAL_DATA.size;
  }

  // 兜底策略：扫描当前DOM (针对页面刚打开时已经存在的数据)
  function scanInitialDOM() {
    const cards = document.querySelectorAll("section.note-item, .feed-card");
    let count = 0;
    cards.forEach((card) => {
      // 尝试获取ID
      let href = "";
      const linkEl = card.querySelector('a[href*="/explore/"]');
      if (linkEl) href = linkEl.href;

      if (href) {
        const match = href.match(/\/explore\/(\w+)/);
        if (match && match[1]) {
          const id = match[1];
          if (!GLOBAL_DATA.has(id)) {
            // DOM获取的数据可能缺 token，这是妥协
            // 但如果有 API 拦截，API 数据会覆盖这个
            const title =
              (
                card.querySelector(".title span") ||
                card.querySelector(".title") ||
                {}
              ).innerText || "未获取";
            const author =
              (card.querySelector(".author") || {}).innerText || "未获取";
            GLOBAL_DATA.set(id, {
              笔记ID: id,
              标题: title,
              链接: href, // 此时href可能带xsec_token也可能不带
              作者: author,
              点赞数: (card.querySelector(".count") || {}).innerText || "0",
              类型: "dom_scan",
            });
            count++;
          }
        }
      }
    });
    if (count > 0) updateCountUI();
    console.log(`[XHS助手] 初始DOM扫描发现 ${count} 条数据`);
  }

  // 自动滚动逻辑
  let scrollInterval;
  function toggleAutoScroll() {
    const btn = document.getElementById("auto-scroll-btn");
    const status = document.getElementById("scroll-status");

    if (isAutoScrolling) {
      // 停止
      isAutoScrolling = false;
      clearInterval(scrollInterval);
      btn.innerText = "⏬ 自动滚动加载全部";
      btn.classList.remove("scrolling");
      status.innerText = "已停止";
    } else {
      // 开始
      isAutoScrolling = true;
      btn.innerText = "⏹️ 停止滚动 (抓取中...)";
      btn.classList.add("scrolling");
      status.innerText = "滚动中...";

      let lastHeight = 0;
      let sameHeightCount = 0;

      scrollInterval = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);

        const currentHeight = document.body.scrollHeight;
        if (currentHeight === lastHeight) {
          sameHeightCount++;
          if (sameHeightCount > 10) {
            // 连续10次高度不变（约10-15秒），认为到底了
            toggleAutoScroll(); // 自动停止
            alert(
              `滚动结束！共捕获 ${GLOBAL_DATA.size} 条数据。\n请点击导出。`
            );
          }
        } else {
          sameHeightCount = 0;
          lastHeight = currentHeight;
        }
      }, 1200); // 间隔1.2秒滚动一次，给接口加载留时间
    }
  }

  function exportData() {
    if (GLOBAL_DATA.size === 0) {
      alert("数据为空！请先点击「自动滚动」或手动浏览页面。");
      return;
    }
    const format = document.getElementById("export-format").value;
    const dataList = Array.from(GLOBAL_DATA.values());

    if (format === "json") {
      download(
        JSON.stringify(dataList, null, 2),
        "xhs_data_full.json",
        "application/json"
      );
    } else {
      // CSV
      const headers = Object.keys(dataList[0]);
      const csvBody = dataList
        .map((row) =>
          headers
            .map((h) => {
              let v = row[h] || "";
              v = String(v).replace(/"/g, '""');
              return `"${v}"`;
            })
            .join(",")
        )
        .join("\n");
      download(
        "\ufeff" + headers.join(",") + "\n" + csvBody,
        "xhs_data_full.csv",
        "text/csv;charset=utf-8"
      );
    }
  }

  function download(content, name, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ==========================================
  // 6. 辅助功能 (拖拽等)
  // ==========================================
  function bindDrag(div) {
    const handle = div.querySelector(".drag-handle");
    let isDragging = false,
      startX,
      startY,
      initL,
      initT;
    handle.addEventListener("mousedown", (e) => {
      if (div.classList.contains("minimized")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = div.getBoundingClientRect();
      initL = rect.left;
      initT = rect.top;
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        let newLeft = initL + e.clientX - startX;
        let newTop = initT + e.clientY - startY;
        // 边界保护：确保不会拖出屏幕
        const maxLeft = window.innerWidth - 60;
        const maxTop = window.innerHeight - 60;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        div.style.left = newLeft + "px";
        div.style.top = newTop + "px";
        div.style.right = "auto";
      }
    });
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        GM_setValue("pos", { l: div.style.left, t: div.style.top });
      }
    });

    // 恢复位置时也检查边界
    const pos = GM_getValue("pos");
    if (pos) {
      let savedLeft = parseInt(pos.l) || 0;
      let savedTop = parseInt(pos.t) || 0;
      // 确保不超出当前屏幕
      savedLeft = Math.max(0, Math.min(savedLeft, window.innerWidth - 100));
      savedTop = Math.max(0, Math.min(savedTop, window.innerHeight - 100));
      div.style.left = savedLeft + "px";
      div.style.top = savedTop + "px";
      div.style.right = "auto";
    }
  }

  // ==========================================
  // 7. AI 逻辑 (保持原样)
  // ==========================================
  function refreshTemplates() {
    const sel = document.getElementById("template-select");
    sel.innerHTML = "";
    templates.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.innerText = t.name;
      sel.appendChild(opt);
    });
    sel.onchange = () => {
      const t = templates.find((x) => x.id === sel.value);
      document.getElementById("input-1").placeholder =
        t.placeholder1 || t.desc1;
      document.getElementById("input-2").placeholder =
        t.placeholder2 || t.desc2;
    };
    sel.onchange();
  }

  function refreshManageSelect(selectId) {
    const sel = document.getElementById("template-manage-select");
    if (!sel) return;
    sel.innerHTML = "";
    templates.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.innerText = t.name;
      sel.appendChild(opt);
    });
    if (selectId && templates.some((t) => t.id === selectId))
      sel.value = selectId;
    else if (templates[0]) sel.value = templates[0].id;
  }

  function fillTemplateForm(t) {
    document.getElementById("template-manage-select").value = t.id;
    document.getElementById("tpl-name").value = t.name || "";
    document.getElementById("tpl-desc1").value = t.desc1 || "";
    document.getElementById("tpl-desc2").value = t.desc2 || "";
    document.getElementById("tpl-system").value = t.system || "";
    document.getElementById("tpl-prompt").value = t.prompt || "";
    document.getElementById("tpl-persona").value = t.persona || "";
  }

  function collectTemplateForm(id) {
    return {
      id,
      name: document.getElementById("tpl-name").value || "未命名模版",
      desc1: document.getElementById("tpl-desc1").value || "输入1",
      desc2: document.getElementById("tpl-desc2").value || "输入2",
      placeholder1: document.getElementById("tpl-desc1").value || "",
      placeholder2: document.getElementById("tpl-desc2").value || "",
      system: document.getElementById("tpl-system").value || "",
      prompt:
        document.getElementById("tpl-prompt").value ||
        "请基于{{title}}和{{content}}生成创作内容。",
    };
  }

  function toastManage(msg) {
    const el = document.getElementById("template-manage-status");
    if (el) {
      el.innerText = msg;
      setTimeout(() => {
        if (el.innerText === msg) el.innerText = "";
      }, 2000);
    }
  }

  async function handlePersonaGenerate() {
    const persona = document.getElementById("tpl-persona").value.trim();
    const status = document.getElementById("template-manage-status");
    if (!persona) return alert("请先填写模版人设/要求");

    status.innerText = "AI 生成人设中...";
    try {
      const res = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: document.getElementById("api-base-url").value,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.getElementById("api-key").value}`,
          },
          data: JSON.stringify({
            model: document.getElementById("api-model").value,
            messages: [
              {
                role: "system",
                content:
                  '你是提示词工程师，请根据用户的人设描述，返回JSON {"system":"...","prompt":"..."}，prompt内使用 {{title}} 和 {{content}} 作为占位符。',
              },
              {
                role: "user",
                content: persona,
              },
            ],
          }),
          onload: (r) => resolve(JSON.parse(r.responseText)),
          onerror: reject,
        });
      });

      const content = res.choices?.[0]?.message?.content || "";
      let json = {};
      try {
        json = JSON.parse(content.replace(/```json|```/g, "").trim());
      } catch (e) {
        json = {};
      }

      if (json.system)
        document.getElementById("tpl-system").value = json.system;
      if (json.prompt)
        document.getElementById("tpl-prompt").value = json.prompt;
      toastManage("AI 已生成模版提示");
    } catch (e) {
      console.error(e);
      status.innerText = "AI 生成失败";
      alert("AI生成失败: " + e);
    }
  }

  async function handleAI() {
    const btn = document.getElementById("ai-gen-btn");
    const status = document.getElementById("ai-status");
    const tId = document.getElementById("template-select").value;
    const v1 = document.getElementById("input-1").value;
    const v2 = document.getElementById("input-2").value;

    if (!v1 && !v2) return alert("请输入内容");

    btn.disabled = true;
    btn.innerText = "生成中...";
    try {
      const t = templates.find((x) => x.id === tId);
      const prompt = t.prompt
        .replace("{{title}}", v1)
        .replace("{{content}}", v2);

      const res = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: document.getElementById("api-base-url").value,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.getElementById("api-key").value}`,
          },
          data: JSON.stringify({
            model: document.getElementById("api-model").value,
            messages: [
              { role: "system", content: t.system },
              { role: "user", content: prompt },
            ],
          }),
          onload: (r) => resolve(JSON.parse(r.responseText)),
          onerror: reject,
        });
      });

      const content = res.choices[0].message.content;
      let json = {};
      try {
        json = JSON.parse(content.replace(/```json|```/g, "").trim());
      } catch (e) {
        json = { title: "Error", content: content };
      }

      const titleInput = document.querySelector('input[placeholder*="标题"]');
      if (titleInput) {
        titleInput.value = json.title;
        titleInput.dispatchEvent(new Event("input", { bubbles: true }));
      }

      const editor = document.getElementById("post-textarea");
      if (editor) {
        editor.innerText = json.content;
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        navigator.clipboard.writeText(json.content);
        alert("已复制到剪贴板");
      }

      status.innerText = "✅ 完成";
    } catch (e) {
      console.error(e);
      status.innerText = "❌ 失败";
      alert("API错误: " + e);
    } finally {
      btn.disabled = false;
      btn.innerText = "✨ 生成文案";
    }
  }

  setTimeout(createUI, 1500);
})();
