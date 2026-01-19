// ==UserScript==
// @name         小红书全能AI助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  采用API拦截技术，支持自动滚动获取全部笔记，生成带xsec_token的永久有效链接，支持导出Excel/CSV/JSON。新增AI创作模块，内置多种写作模版，支持自定义模版和AI生成人设。提升创作效率，助力内容变现！新增excel带图片导出模式，方便直观查看封面图。
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
        // /api/sns/web/v1/homefeed -> 首页推荐/搜索
        // /api/sns/web/v1/search/notes -> 搜索结果
        if (
          this._url &&
          (this._url.includes("/api/sns/web/v1/user_posted") ||
            this._url.includes("/api/sns/web/v2/note/collect/page") ||
            this._url.includes("/api/sns/web/v1/note/like/page") ||
            this._url.includes("/api/sns/web/v1/user/like") ||
            this._url.includes("/api/sns/web/v1/homefeed") ||
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
    // 兼容搜索结果页结构（如 /api/sns/web/v1/search/notes）及 首页推荐（/api/sns/web/v1/homefeed）
    // notes 可能是 [{note: {...}}, ...] 或直接 [{...}]
    notes.forEach((raw) => {
      let note = raw;
      // 搜索结果页结构：{note: {...}, ...}
      if (raw && raw.note && typeof raw.note === "object") {
        note = raw.note;
      }
      // 兼容 note_card 层
      if (note && note.note_card) {
        note = note.note_card;
      }
      // 兼容 note_info 层
      if (note && note.note_info) {
        note = note.note_info;
      }
      // 兼容 item 层（部分搜索结果）
      if (note && note.item) {
        note = note.item;
      }
      // 兼容 feed_note 层（部分推荐/搜索结果）
      if (note && note.feed_note) {
        note = note.feed_note;
      }

      // 统一提取字段
      // 优先从深层对象取，取不到尝试从原始对象取（防止层级下钻导致外层属性丢失）
      const id =
        note.id || note.note_id || note.noteId || raw.id || raw.note_id;
      if (!id) return;

      const token = note.xsec_token || raw.xsec_token || "";
      let link = `https://www.xiaohongshu.com/explore/${id}`;
      if (token) {
        link += `?xsec_token=${token}&xsec_source=pc_user`;
      }

      const title =
        note.title ||
        note.display_title ||
        note.desc ||
        raw.title ||
        raw.display_title ||
        "无标题";

      const type = note.type || raw.type || "normal";

      const user = note.user || raw.user || {};
      const authorName =
        user.nickname ||
        user.name ||
        note.author ||
        raw.author ||
        (raw.user && raw.user.nickname) ||
        "未知作者";

      const likes =
        note.likes ||
        note.liked_count ||
        note.like_count ||
        (note.interact_info && note.interact_info.liked_count) ||
        raw.likes ||
        raw.liked_count ||
        (raw.interact_info && raw.interact_info.liked_count) ||
        0;

      const coverUrl =
        (note.cover && note.cover.url_default) ||
        (note.images_list && note.images_list[0] && note.images_list[0].url) ||
        note.cover_url ||
        (raw.cover && raw.cover.url_default) ||
        raw.cover_url ||
        "";

      if (!GLOBAL_DATA.has(id)) {
        GLOBAL_DATA.set(id, {
          笔记ID: id,
          标题: title,
          链接: link,
          作者: authorName,
          点赞数: likes,
          封面图: coverUrl,
          类型: type,
          xsec_token: token,
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

        /* AI分析面板样式优化 */
        .file-upload-label {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            background: #fff; border: 1px dashed #ccc; border-radius: 8px;
            padding: 15px; cursor: pointer; color: #666; font-size: 13px;
            transition: all 0.2s; margin-bottom: 5px;
        }
        .file-upload-label:hover { border-color: #ff2442; color: #ff2442; background: #fff5f6; }
        .analysis-result-box {
            margin-top: 10px; font-size: 13px; line-height: 1.6;
            background: #fff; padding: 12px; border-radius: 8px;
            border: 1px solid #eee; max-height: 250px; overflow-y: auto;
            color: #444; box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
            white-space: pre-wrap; display: none;
        }
        .ai-compact-box { background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #ebd4b5; }

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
                    <div class="ai-tab-item" data-tab="analysis">AI分析</div>
                    <div class="ai-tab-item" data-tab="settings">⚙️ 设置</div>
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
                                <option value="csv">CSV / Excel (纯文本)</option>
                                <option value="xls">Excel (含图片预览)</option>
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
                            
                            <button id="ai-gen-btn" class="ai-btn" style="margin-top:10px;">✨ 生成文案</button>
                            <div id="ai-status" style="text-align:center;font-size:12px;margin-top:5px;color:#999;"></div>
                        </div>
                    </div>
                    
                    <div id="panel-analysis" class="tab-panel">
                        <!-- Section 1: 智能分析 -->
                        <div class="data-card" style="border-left: 4px solid #4a90e2; background: #f0f7ff;">
                           <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px; color:#2c3e50;">📊 智能总结与分析</div>
                           <div style="font-size: 11px; color:#666; margin-bottom:10px;">上传导出的 CSV/JSON，让 AI 分析趋势。</div>
                           
                           <input type="file" id="analysis-file-input" accept=".csv,.json" style="display:none;" />
                           <label for="analysis-file-input" class="file-upload-label" id="analysis-file-label">
                               📂 点击选择或拖拽文件 (CSV/JSON)
                           </label>
                           <div id="analysis-file-name" style="font-size:11px; color:#333; margin:5px 0; padding-left: 5px; display:none;"></div>

                           <button id="analysis-summary-btn" class="ai-btn" style="background:#4a90e2; margin-top:8px;">🧠 开始智能分析</button>
                           <div id="analysis-result" class="analysis-result-box"></div>
                        </div>

                        <!-- Section 2: 智能分类 -->
                        <div class="data-card" style="margin-top:15px; border-left: 4px solid #ff9800; background: #fffaf0;">
                           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                              <div style="font-size: 14px; font-weight: bold; color:#2c3e50;">🏷️ 智能分类重构</div>
                              <button id="analysis-config-btn" class="ai-btn secondary" style="width:auto; padding:4px 8px; font-size:12px; margin:0;" title="API 设置">⚙️ 配置 API</button>
                           </div>
                           <div style="font-size: 11px; color:#666; margin: 0 0 10px;">AI 自动分类数据并生成新文件。</div>
                           
                           <div class="ai-compact-box">
                               <label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">自定义分类 (可选, 逗号分隔)</label>
                               <textarea id="analysis-categories" class="ai-textarea" style="height:40px; margin-bottom:8px; border:1px solid #eee; background:#f9f9f9; padding:5px; font-size: 12px;" placeholder="美妆, 穿搭, 美食..."></textarea>
                               
                               <div style="display:flex; justify-content:space-between; align-items:center;">
                                   <div style="font-size:12px;color:#666; display:flex; align-items:center; gap:5px;">
                                      导出格式: 
                                      <select id="analysis-export-format" class="ai-select" style="width:auto; padding:3px 6px; margin:0; height:auto; background:#fff; border-color:#ddd;">
                                          <option value="xls">Excel</option> // 默认Excel
                                          <option value="csv">CSV</option>
                                          <option value="json">JSON</option>
                                      </select>
                                   </div>
                                   <button id="analysis-classify-btn" class="ai-btn" style="width:auto; padding:6px 15px; margin:0; background:#ff9800;">🚀 开始分类</button>
                               </div>
                           </div>
                           
                           <div id="classify-status" style="margin-top:8px; font-size:12px; color:#666;"></div>
                           <div id="api-limit-tip" style="display:none; margin-top:8px; font-size:11px; color:#d35400; background:rgba(255,152,0,0.1); padding:8px; border-radius:4px; line-height: 1.4;">
                              ⚠️ 检测到未分类数据。这通常是因为 API 速率限制或额度不足。<br>建议：<br>1. 检查 API Key 额度。<br>2. 更换更稳定的模型 (如 gpt-3.5/4)。<br>3. 每次处理需要一定时间，请耐心等待。
                           </div>
                        </div>
                    </div>
                
                    <div id="panel-settings" class="tab-panel">
                        <div class="data-card">
                             <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">⚙️ 全局 API 设置</div>
                             <div style="font-size: 11px; color:#666; margin-bottom:8px;">此处的配置将应用于 AI 创作、分析和分类功能。</div>

                             <div id="config-area" style="margin-bottom:10px;background:#f9f9f9;padding:10px;border-radius:8px;border:1px solid #eee;">
                                <div style="display:flex;gap:5px;margin-bottom:8px;">
                                    <select id="api-config-select" class="ai-select" style="margin:0;flex:1;"></select>
                                    <button id="api-config-add" class="ai-btn secondary" style="width:32px;margin:0;padding:0;" title="新增配置">➕</button>
                                    <button id="api-config-del" class="ai-btn secondary" style="width:32px;margin:0;padding:0;" title="删除配置">🗑️</button>
                                </div>
                                
                                <input id="api-base-url" class="ai-input" placeholder="Base URL" style="margin-bottom:5px;">
                                <input id="api-key" type="password" class="ai-input" placeholder="API Key" style="margin-bottom:5px;">
                                
                                <div style="display:flex;gap:5px;">
                                    <input id="api-model" class="ai-input" placeholder="Model (e.g. gpt-3.5-turbo)" style="margin-bottom:0;flex:1;">
                                    <button id="api-model-fetch-btn" class="ai-btn secondary" style="width:40px;margin:0;padding:0;" title="尝试获取模型列表">🔄</button>
                                </div>
                                <select id="api-model-select" class="ai-select" style="display:none;margin-top:5px;"></select>
                             </div>
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
        }),
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
    // div.querySelector("#config-toggle").onclick = ... // Removed

    // ============================
    // Config Manager Logic
    // ============================
    const DEFAULT_CONFIGS = [
      {
        id: "moonshot",
        name: "🌙 Moonshot (Kimi)",
        baseUrl: "https://api.moonshot.cn/v1/chat/completions",
        key: "",
        model: "moonshot-v1-8k",
        builtIn: true,
      },
      {
        id: "deepseek",
        name: "🐋 DeepSeek",
        baseUrl: "https://api.deepseek.com/chat/completions",
        key: "",
        model: "deepseek-chat",
        builtIn: true,
      },
      {
        id: "openai",
        name: "🤖 OpenAI (GPT)",
        baseUrl: "https://api.openai.com/v1/chat/completions",
        key: "",
        model: "gpt-3.5-turbo",
        builtIn: true,
      },
      {
        id: "custom",
        name: "🛠️ 自定义配置",
        baseUrl: "",
        key: "",
        model: "",
        builtIn: false,
      },
    ];

    let apiConfigs = [];
    try {
      apiConfigs = JSON.parse(GM_getValue("api_configs", "[]"));
      if (!Array.isArray(apiConfigs) || apiConfigs.length === 0)
        apiConfigs = JSON.parse(JSON.stringify(DEFAULT_CONFIGS));
    } catch (e) {
      apiConfigs = JSON.parse(JSON.stringify(DEFAULT_CONFIGS));
    }

    let currentConfigId = GM_getValue("current_api_config_id", "moonshot");

    function renderConfigSelect() {
      const sel = document.getElementById("api-config-select");
      sel.innerHTML = "";
      apiConfigs.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.innerText = c.name;
        sel.appendChild(opt);
      });

      // Ensure current ID exists
      if (!apiConfigs.some((c) => c.id === currentConfigId)) {
        currentConfigId = apiConfigs[0].id;
      }

      sel.value = currentConfigId;
      loadConfigToUI(currentConfigId);
    }

    function loadConfigToUI(id) {
      const config = apiConfigs.find((c) => c.id === id) || apiConfigs[0];
      currentConfigId = config.id;
      GM_setValue("current_api_config_id", currentConfigId);

      const baseUrlInput = document.getElementById("api-base-url");
      const keyInput = document.getElementById("api-key");
      const modelInput = document.getElementById("api-model");
      const delBtn = document.getElementById("api-config-del");
      const modelSelect = document.getElementById("api-model-select");

      baseUrlInput.value = config.baseUrl;
      keyInput.value = config.key;
      modelInput.value = config.model;

      // Hide model select on config switch
      modelSelect.style.display = "none";

      if (config.builtIn) {
        delBtn.style.display = "none";
      } else {
        delBtn.style.display = "block";
      }
    }

    function saveCurrentConfigFromUI() {
      const configIndex = apiConfigs.findIndex((c) => c.id === currentConfigId);
      if (configIndex !== -1) {
        apiConfigs[configIndex].baseUrl =
          document.getElementById("api-base-url").value;
        apiConfigs[configIndex].key = document.getElementById("api-key").value;
        apiConfigs[configIndex].model =
          document.getElementById("api-model").value;
        GM_setValue("api_configs", JSON.stringify(apiConfigs));

        // Sync legacy values for compatibility if needed elsewhere
        GM_setValue("api_base_url", apiConfigs[configIndex].baseUrl);
        GM_setValue("api_key", apiConfigs[configIndex].key);
        GM_setValue("api_model", apiConfigs[configIndex].model);
      }
    }

    // Bind Config Events
    document.getElementById("api-config-select").onchange = (e) =>
      loadConfigToUI(e.target.value);

    ["api-base-url", "api-key", "api-model"].forEach((id) => {
      const el = document.getElementById(id);
      el.onchange = saveCurrentConfigFromUI;
      el.oninput = saveCurrentConfigFromUI;
    });

    document.getElementById("api-config-add").onclick = () => {
      const name = prompt(
        "请输入新配置名称",
        "我的配置 " + (apiConfigs.length + 1),
      );
      if (name) {
        const newId = "custom_" + Date.now();
        apiConfigs.push({
          id: newId,
          name: name,
          baseUrl: "https://",
          key: "",
          model: "",
          builtIn: false,
        });
        GM_setValue("api_configs", JSON.stringify(apiConfigs));
        renderConfigSelect();
        // Select new
        document.getElementById("api-config-select").value = newId;
        loadConfigToUI(newId);
      }
    };

    document.getElementById("api-config-del").onclick = () => {
      if (confirm("确定删除当前配置吗？")) {
        apiConfigs = apiConfigs.filter((c) => c.id !== currentConfigId);
        if (apiConfigs.length === 0)
          apiConfigs = JSON.parse(JSON.stringify(DEFAULT_CONFIGS));
        GM_setValue("api_configs", JSON.stringify(apiConfigs));
        currentConfigId = apiConfigs[0].id;
        renderConfigSelect();
      }
    };

    document.getElementById("api-model-fetch-btn").onclick = async () => {
      const btn = document.getElementById("api-model-fetch-btn");
      const modelSel = document.getElementById("api-model-select");
      const originalText = btn.innerText;
      btn.innerText = "...";
      btn.disabled = true;

      const baseUrl = document.getElementById("api-base-url").value;
      const key = document.getElementById("api-key").value;

      if (!baseUrl) {
        alert("请先填写 Base URL");
        btn.innerText = originalText;
        btn.disabled = false;
        return;
      }
      if (!key) {
        alert("请先填写 API Key");
        btn.innerText = originalText;
        btn.disabled = false;
        return;
      }

      // Try to deduce models endpoint
      // Standard: .../v1/chat/completions -> .../v1/models
      let modelsUrl = baseUrl;
      if (modelsUrl.endsWith("/chat/completions")) {
        modelsUrl = modelsUrl.replace("/chat/completions", "/models");
      } else if (modelsUrl.endsWith("/")) {
        modelsUrl = modelsUrl + "models";
      } else {
        // If base url is just host, add /v1/models? Not sure, user usually puts chat/completions
        // Let's try replacing last segment if it is not models
        // Fallback: assume user put full chat url
        modelsUrl = modelsUrl.replace(/\/chat\/completions\/?$/, "/models");
      }

      console.log("[AI] Fetching models from:", modelsUrl);

      try {
        const res = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: modelsUrl,
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            onload: (r) => {
              if (r.status === 200) resolve(JSON.parse(r.responseText));
              else
                reject(
                  "Status " +
                    r.status +
                    "\n" +
                    r.responseText.substring(0, 100),
                );
            },
            onerror: (e) => reject("Network Error"),
          });
        });

        let models = [];
        if (res && Array.isArray(res.data)) {
          models = res.data.map((m) => m.id);
        } else if (Array.isArray(res)) {
          models = res.map((m) => m.id || m); // Some APIs return array directly
        }

        if (models.length > 0) {
          modelSel.innerHTML =
            '<option value="" disabled selected>请选择模型 (API获取成功)</option>';

          // 简单规则：包含特定关键词的模型被认为支持 AI 分析/分类 (即支持长文本或通用能力强)
          const capableKeywords = [
            "moonshot",
            "gpt-4",
            "claude-3",
            "deepseek",
            "128k",
            "32k",
            "200k",
            "pro",
          ];

          models.forEach((m) => {
            const opt = document.createElement("option");
            opt.value = m;
            let label = m;
            if (capableKeywords.some((k) => m.toLowerCase().includes(k))) {
              label += " (支持AI分析)";
            }
            opt.innerText = label;
            modelSel.appendChild(opt);
          });
          modelSel.style.display = "block";
          modelSel.onchange = () => {
            document.getElementById("api-model").value = modelSel.value;
            saveCurrentConfigFromUI();
          };
          // Auto expand?
          modelSel.click();
        } else {
          alert(
            "API请求成功，但未能解析出模型列表。请手动输入。\n" +
              JSON.stringify(res).slice(0, 100),
          );
        }
      } catch (e) {
        alert("获取模型失败: " + e + "\n尝试URL: " + modelsUrl);
      } finally {
        btn.innerText = originalText;
        btn.disabled = false;
      }
    };

    // Initialize
    renderConfigSelect();

    div.querySelector("#ai-gen-btn").onclick = handleAI;

    // 模版管理
    const managePanel = document.getElementById("template-manage-panel");
    document.getElementById("template-manage-toggle").onclick = () => {
      managePanel.style.display =
        managePanel.style.display === "none" ? "block" : "none";
    };
    document.getElementById("template-manage-select").onchange = () => {
      const t = templates.find(
        (x) => x.id === document.getElementById("template-manage-select").value,
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

    // AI分析功能绑定
    div.querySelector("#analysis-file-input").onchange = function () {
      const file = this.files[0];
      const label = div.querySelector("#analysis-file-label");
      const nameDisplay = div.querySelector("#analysis-file-name");
      if (file) {
        nameDisplay.textContent = "📄 已选择: " + file.name;
        nameDisplay.style.display = "block";
        label.style.borderColor = "#4a90e2";
        label.style.background = "#eff6ff";
        label.textContent = "📂 更换文件";
      }
    };

    div.querySelector("#analysis-summary-btn").onclick = handleAnalysisSummary;
    div.querySelector("#analysis-classify-btn").onclick =
      handleAnalysisClassify;
    div.querySelector("#analysis-config-btn").onclick = () => {
      // Switch to Settings tab
      const settingsTab = div.querySelector(
        '.ai-tab-item[data-tab="settings"]',
      );
      if (settingsTab) settingsTab.click();
    };

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
      // 尝试获取ID和链接
      // fix: 优先找 a.cover，因为它通常包含带 xsec_token 的完整链接，且覆盖在卡片上
      // 其次才是普通的 explore 链接
      let linkEl =
        card.querySelector("a.cover") ||
        card.querySelector('a[href*="/explore/"]') ||
        card.querySelector('a[href*="/user/profile/"]');

      let href = "";
      if (linkEl) href = linkEl.href; // .href 获取的是绝对路径

      if (href) {
        // 提取 ID
        // 匹配逻辑：获取 URL path 的最后一段作为 ID
        // 例如: /explore/66... 或 /user/profile/xxx/66...
        let id = "";
        try {
          const urlObj = new URL(href);
          const pathParts = urlObj.pathname.split("/").filter((p) => p);
          // 假设最后一部分是ID (通常是24位ObjectId)
          const lastPart = pathParts[pathParts.length - 1];
          // 简单的校验：ID通常由字母数字组成，长度24位左右
          if (lastPart && /^[a-fA-F0-9]{24}$/.test(lastPart)) {
            id = lastPart;
          } else if (href.includes("/explore/")) {
            // 兼容旧的 explore 提取方式
            const m = href.match(/\/explore\/(\w+)/);
            if (m) id = m[1];
          }
        } catch (e) {}

        if (id && !GLOBAL_DATA.has(id)) {
          const title =
            (
              card.querySelector(".title span") ||
              card.querySelector(".title") ||
              {}
            ).innerText || "未获取";
          const author =
            (card.querySelector(".author") || {}).innerText || "未获取";

          // 尝试获取封面
          let coverUrl = "";
          const coverDiv = card.querySelector(".cover");
          if (coverDiv) {
            const style = coverDiv.getAttribute("style");
            const bgMatch = style && style.match(/url\("?(.+?)"?\)/);
            if (bgMatch) coverUrl = bgMatch[1];
          }
          if (!coverUrl) {
            const img = card.querySelector("img");
            if (img) coverUrl = img.src;
          }

          GLOBAL_DATA.set(id, {
            笔记ID: id,
            标题: title,
            链接: href, // 使用从 DOM 获取的完整 href（包含 token）
            作者: author,
            点赞数: (card.querySelector(".count") || {}).innerText || "0",
            封面图: coverUrl,
            类型: "dom_scan",
          });
          count++;
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
              `滚动结束！共捕获 ${GLOBAL_DATA.size} 条数据。\n请点击导出。`,
            );
          }
        } else {
          sameHeightCount = 0;
          lastHeight = currentHeight;
        }
      }, 1200); // 间隔1.2秒滚动一次，给接口加载留时间
    }
  }

  function exportList(dataList, format, baseName) {
    if (!dataList || dataList.length === 0) return;

    if (format === "json") {
      download(
        JSON.stringify(dataList, null, 2),
        `${baseName}.json`,
        "application/json",
      );
    } else if (format === "xls") {
      // Excel (HTML Table 伪装)
      const headers = Object.keys(dataList[0]);
      let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                  xmlns:x="urn:schemas-microsoft-com:office:excel" 
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
               <meta charset="utf-8">
               <!--[if gte mso 9]>
               <xml>
                <x:ExcelWorkbook>
                 <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                   <x:Name>Sheet1</x:Name>
                   <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                   </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                 </x:ExcelWorksheets>
                </x:ExcelWorkbook>
               </xml>
               <![endif]-->
               <style>
                 td { vertical-align: middle; text-align: center; font-size: 11pt; }
                 .text { mso-number-format:"\@"; }
               </style>
            </head>
            <body>
            <table border="1" style="border-collapse: collapse; width: 100%;">`;

      // 表头
      html += "<thead><tr style='background-color:#f2f2f2; height:40px;'>";
      headers.forEach(
        (h) =>
          (html += `<th style="padding:10px; border:1px solid #ccc;">${h}</th>`),
      );
      html += "</tr></thead><tbody>";

      // 内容
      dataList.forEach((row) => {
        // 关键：给 tr 设置高度，确保能容纳图片
        html += "<tr style='height:110px;'>";
        headers.forEach((h) => {
          const val = row[h] || "";
          if (h === "封面图" && val) {
            html += `<td style="width:120px; text-align:center;"><img src="${val}" width="100" height="100" /></td>`;
          } else if (h === "链接" && val) {
            html += `<td><a href="${val}" target="_blank">点击跳转</a></td>`;
          } else {
            html += `<td class="text" style="max-width:300px; overflow:hidden;">${val}</td>`; // 强制文本格式
          }
        });
        html += "</tr>";
      });
      html += "</tbody></table></body></html>";

      download(html, `${baseName}.xls`, "application/vnd.ms-excel");
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
            .join(","),
        )
        .join("\n");
      download(
        "\ufeff" + headers.join(",") + "\n" + csvBody,
        `${baseName}.csv`,
        "text/csv;charset=utf-8",
      );
    }
  }

  function exportData() {
    if (GLOBAL_DATA.size === 0) {
      alert("数据为空！请先点击「自动滚动」或手动浏览页面。");
      return;
    }
    const format = document.getElementById("export-format").value;
    const dataList = Array.from(GLOBAL_DATA.values());
    exportList(dataList, format, "xhs_data_full");
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
      // 允许在最小化状态下拖拽（可选，或者是用户可能只想点开）
      // 这里保持原逻辑如果用户想保持最小化不拖拽
      if (div.classList.contains("minimized")) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = div.getBoundingClientRect();
      initL = rect.left;
      initT = rect.top;

      // 优化：拖拽开始时禁用过渡动画，防止延迟感
      div.style.transition = "none";
      // 防止由拖拽引起的文本选中
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        let newLeft = initL + e.clientX - startX;
        let newTop = initT + e.clientY - startY;
        // 边界保护：确保不会拖出屏幕
        const maxLeft = window.innerWidth - 60;
        const maxTop = window.innerHeight - 60;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        requestAnimationFrame(() => {
          div.style.left = newLeft + "px";
          div.style.top = newTop + "px";
          div.style.right = "auto";
        });
      }
    });
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        // 拖拽结束，恢复过渡动画和选择
        div.style.transition = "";
        document.body.style.userSelect = "";

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

  // ==========================================
  // 8. AI 分析与分类逻辑
  // ==========================================

  function readFileData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function parseUploadedData(text, type) {
    if (type.includes("json")) {
      return JSON.parse(text);
    } else {
      // Simple CSV Parser
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) return [];
      const headers = lines[0].split(","); // 简单分割，未处理复杂CSV
      // 这里的CSV解析较为简陋，建议使用JSON上传
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(","); // 同样简单分割
        if (row.length === headers.length) {
          let obj = {};
          headers.forEach((h, idx) => {
            obj[h.replace(/"/g, "").trim()] = row[idx]
              ? row[idx].replace(/"/g, "").trim()
              : "";
          });
          result.push(obj);
        }
      }
      return result;
    }
  }

  async function callAI(messages) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: document.getElementById("api-base-url").value,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.getElementById("api-key").value}`,
        },
        data: JSON.stringify({
          model: document.getElementById("api-model").value,
          messages: messages,
        }),
        onload: (r) => {
          try {
            resolve(JSON.parse(r.responseText));
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  async function handleAnalysisSummary() {
    const fileInput = document.getElementById("analysis-file-input");
    const resultDiv = document.getElementById("analysis-result");
    const btn = document.getElementById("analysis-summary-btn");

    if (!fileInput.files.length) return alert("请先上传文件");
    const file = fileInput.files[0];

    btn.disabled = true;
    btn.innerText = "分析中...";
    resultDiv.style.display = "block";
    resultDiv.innerText = "正在读取文件并进行 AI 分析，请稍候...";

    try {
      const text = await readFileData(file);
      let data = parseUploadedData(text, file.name);

      if (!data || data.length === 0) throw new Error("解析数据失败或数据为空");

      // 截取前 50 条数据，防止 Token 溢出
      const sample = data.slice(0, 50).map((item) => ({
        标题: item.标题 || item.display_title,
        点赞: item.点赞数 || item.likes,
        作者: item.作者 || item.user?.nickname,
      }));

      const prompt = `请分析以下小红书笔记数据（仅展示前${sample.length}条）：\n${JSON.stringify(
        sample,
      )}\n\n请给出：\n1. 热门话题/关键词总结\n2. 高赞笔记的共同特点\n3. 内容创作建议`;

      const res = await callAI([
        {
          role: "system",
          content: "你是一个资深的小红书数据分析师，擅长洞察趋势。",
        },
        { role: "user", content: prompt },
      ]);

      const content = res.choices?.[0]?.message?.content || "AI 未返回内容";
      resultDiv.innerText = content;
    } catch (e) {
      console.error(e);
      resultDiv.innerText = "❌ 分析失败: " + e.message;
    } finally {
      btn.disabled = false;
      btn.innerText = "🧠 生成总结分析";
    }
  }

  async function handleAnalysisClassify() {
    const fileInput = document.getElementById("analysis-file-input");
    const statusDiv = document.getElementById("classify-status");
    const btn = document.getElementById("analysis-classify-btn");
    const tipDiv = document.getElementById("api-limit-tip");
    const format = document.getElementById("analysis-export-format").value;
    const categories = document
      .getElementById("analysis-categories")
      .value.trim();

    if (!fileInput.files.length) return alert("请先上传文件");
    const file = fileInput.files[0];

    btn.disabled = true;
    btn.innerText = "分类中...";
    statusDiv.innerText = "正在读取文件...";
    if (tipDiv) tipDiv.style.display = "none";

    try {
      const text = await readFileData(file);
      let data = parseUploadedData(text, file.name);

      if (!data || data.length === 0) throw new Error("解析数据失败或数据为空");

      // 分批处理逻辑
      const BATCH_SIZE = 20;
      const totalItems = data.length;
      const batches = Math.ceil(totalItems / BATCH_SIZE);
      const classifiedMap = new Map();

      // 自动生成的默认分类
      const defaultCats = "教程,好物分享,情感,新闻,搞笑,其他";
      const targetCats = categories || defaultCats;

      for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min((i + 1) * BATCH_SIZE, totalItems);
        const batchData = data.slice(start, end);

        statusDiv.innerText = `正在分类第 ${i + 1}/${batches} 批数据 (${start + 1}-${end})...`;

        // 构建请求数据，仅包含必要字段以节省 Token
        const sample = batchData.map((item) => ({
          id: item.笔记ID || item.note_id || item.id,
          title: item.标题 || item.display_title,
          desc: (item.desc || "").substring(0, 50),
        }));

        const prompt = `请将以下笔记归类到这些类别中：[${targetCats}]。\n输入数据：\n${JSON.stringify(
          sample,
        )}\n\n要求：返回 JSON 格式，数组包含对象 { "id": "...", "category": "..." }。`;

        try {
          const res = await callAI([
            {
              role: "system",
              content:
                "你是一个数据分类助手。只返回纯 JSON，不要 Markdown 格式。",
            },
            { role: "user", content: prompt },
          ]);

          let content = res.choices?.[0]?.message?.content || "[]";
          content = content.replace(/```json|```/g, "").trim();
          let batchResult = [];
          try {
            batchResult = JSON.parse(content);
          } catch (e) {
            console.warn(`Batch ${i + 1} JSON parse failed`, content);
          }

          if (Array.isArray(batchResult)) {
            batchResult.forEach((item) => {
              if (item && item.id) {
                classifiedMap.set(String(item.id), item.category);
              }
            });
          }
        } catch (apiError) {
          console.error(`Batch ${i + 1} API failed`, apiError);
          if (tipDiv) tipDiv.style.display = "block";
        }

        // 简单延时，避免 QPS 限制
        if (i < batches - 1) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      data.forEach((item) => {
        const id = item.笔记ID || item.note_id || item.id;
        if (id && classifiedMap.has(String(id))) {
          item["智能分类"] = classifiedMap.get(String(id));
        } else {
          item["智能分类"] = "未分类/API限制";
        }
      });

      const unclassifiedCount = data.filter(
        (x) => x["智能分类"] === "未分类/API限制",
      ).length;
      if (unclassifiedCount > 0 && tipDiv) {
        tipDiv.innerHTML = `⚠️ 完成，但有 ${unclassifiedCount} 条数据未成功分类。<br>可能是API超时或额度限制，建议检查API设置。`;
        tipDiv.style.display = "block";
      }

      // 导出新文件
      exportList(data, format, "classified_xhs_data");

      statusDiv.innerText = "✅ 分类完成！已自动下载新文件。";
    } catch (e) {
      console.error(e);
      statusDiv.innerText = "❌ 分类失败: " + e.message;
    } finally {
      btn.disabled = false;
      btn.innerText = "📂 智能分类并导出";
    }
  }

  setTimeout(createUI, 1500);
})();
