// ==UserScript==
// @name         Linux.do Agent
// @namespace    https://example.com/linuxdo-agent
// @version      0.3.8
// @description  OpenAI Chat格式可配置baseUrl/model/key；多会话跨刷新；Discourse工具：搜索/抓话题全帖/查用户近期帖子/分类/最新话题/Top话题/Tag话题/用户Summary(含热门帖子)/单帖/按(topicId+postNumber)完整抓取指定楼(<=10000)/站点最新帖子列表；模型JSON输出自动find/rfind修复并回写history；final.refs 显示到UI；AG悬浮球支持拖动并记忆位置。
// @author       Bytebender
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559450/Linuxdo%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/559450/Linuxdo%20Agent.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /******************************************************************
   * 0) 常量 / 存储 Key
   ******************************************************************/
  const APP_PREFIX = "ldagent-";
  const STORE_KEYS = {
    CONF: "ld_agent_conf_v2",
    SESS: "ld_agent_sessions_v2",
    ACTIVE: "ld_agent_active_session_v2",
    FABPOS: "ld_agent_fab_pos_v1",

    // === UI ENHANCE ===
    UI: "ld_agent_ui_state_v1", // {tab, sidebarCollapsed, theme}
    THEME: "ld_agent_theme_v1", // 主题模式：'light' | 'dark' | 'auto'
  };

  const FSM = {
    IDLE: "IDLE",
    RUNNING: "RUNNING",
    WAITING_MODEL: "WAITING_MODEL",
    WAITING_TOOL: "WAITING_TOOL",
    DONE: "DONE",
    ERROR: "ERROR",
    CANCELLED: "CANCELLED", // UI-only
  };

  const now = () => Date.now();
  const uid = () =>
    "S" + now().toString(36) + Math.random().toString(36).slice(2, 8);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function clamp(str, max = 20000) {
    str = String(str ?? "");
    return str.length > max ? str.slice(0, max) + "\n...(截断)" : str;
  }
  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || "").trim();
  }
  function safeTitle(t, fb) {
    const s = String(t ?? "").trim();
    return s ? s : fb || "无题";
  }
  function mdEscapeText(s) {
    s = String(s ?? "");
    return s.replace(/[\[\]\(\)]/g, (m) => "\\" + m);
  }
  function safeJsonParse(s, fb = null) {
    try {
      return JSON.parse(s);
    } catch {
      return fb;
    }
  }

  /******************************************************************
   * 0.5) 可取消 Token（Stop / abort）
   ******************************************************************/
  const CANCEL = new Map(); // sessionId -> { cancelled:boolean, aborts:Function[] }
  function ensureCancelToken(sessionId) {
    let t = CANCEL.get(sessionId);
    if (!t) {
      t = { cancelled: false, aborts: [] };
      CANCEL.set(sessionId, t);
    }
    return t;
  }
  function cancelSession(sessionId) {
    const t = CANCEL.get(sessionId);
    if (!t) return;
    t.cancelled = true;
    for (const fn of t.aborts || []) {
      try {
        fn();
      } catch {}
    }
    CANCEL.delete(sessionId);
  }
  function isCancelled(sessionId) {
    const t = CANCEL.get(sessionId);
    return !!t?.cancelled;
  }

  /******************************************************************
   * 1) 配置：OpenAI Chat Completions 兼容
   ******************************************************************/
  const DEFAULT_CONF = {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    apiKey: "",
    temperature: 0.2,
    maxTurns: 10,
    maxContextChars: 60000,
    includeToolContext: true,
    systemPrompt: `# 角色（Role）
你不是聊天助手。你是运行在 linux.do Discourse 前端脚本中的 **JSON 协议路由引擎**。
你的唯一任务：根据用户意图，决定是否调用工具，并且**严格**按协议输出 JSON（仅 JSON，无其它字符）。

# 核心目标（Goal）
- 当信息不足：发起工具调用（type="tool"）
- 当信息充足：产出最终回答（type="final"）

# 可用工具（Tools）
仅可使用以下工具名称（name 必须完全匹配）：
- discourse.search
- discourse.getTopicAllPosts
- discourse.getUserRecent
- discourse.getCategories
- discourse.listLatestTopics
- discourse.listTopTopics
- discourse.getTagTopics
- discourse.getUserSummary
- discourse.getPost
- discourse.getTopicPostFull
- discourse.listLatestPosts

# 输出协议（Protocol）——最高优先级
你的每次响应必须且只能是以下两种 JSON 之一：

## A) 工具调用（需要获取数据时）
{
  "type": "tool",
  "name": "<tool_name>",
  "args": { ... }
}

## B) 最终回复（已有足够信息时）
{
  "type": "final",
  "answer": "<string，允许 Markdown；换行使用 \n；请确保格式符合被json转义的markdown>",
  "refs": [ {"title":"...","url":"..."} ]
}

# 绝对禁止（Hard Rules）
1) 严禁输出任何非 JSON 内容（包括“好的/正在搜索/以下是结果/解释原因”等）。
2) 严禁使用 Markdown 代码块包裹 JSON（不要 \`\`\`json）。
3) 每次只输出一个 JSON 对象，不要输出数组，不要输出多个对象。
4) 工具调用 JSON **必须包含 type 字段**，且必须是 "tool"。
5) 最终回复 JSON **必须包含 type 字段**，且必须是 "final"。
6) refs 只能来自工具结果中真实存在的 url，严禁编造链接。
7) 如果工具多轮：每轮只做一个工具调用；拿到工具结果后再决定下一轮工具或 final。

# 工具选择策略（Tool Selection）
- 不知道 topicId：优先 discourse.search（用关键词/语义/Discourse 语法）。
- 需要总结整帖：discourse.getTopicAllPosts({topicId,...})。
- 需要指定楼全文：discourse.getTopicPostFull({topicId, postNumber, maxChars})。
- 需要用户画像/热门帖子：discourse.getUserSummary({username})。
- 需要最新动态：discourse.listLatestTopics 或 discourse.listLatestPosts。

# 多轮工具调用策略（Multi-step）
当一次工具结果不足以回答：
- 继续输出 type="tool" 的下一次工具调用。
- 工具调用的 args 要尽量小、尽量精确（例如只抓 maxPosts=50，或只抓某楼）。

# 自检（Self-check，必须执行但不要输出）
在输出前，你必须在心里检查：
- 我输出的是不是 **纯 JSON**？
- 有没有且只有一个顶层对象？
- 顶层对象是否包含 "type"？
- 若 type="tool"：name 是否为允许列表之一？args 是否为 object？
- 若 type="final"：answer 是否为 string？refs 是否仅来自工具结果？

如果任何一项不满足，立刻修正后再输出。

# 示例（Examples，严格模仿格式）
用户：帮我找一下 Docker 教程
你输出：
{"type":"tool","name":"discourse.search","args":{"q":"Docker 教程","page":1,"limit":8}}

（工具结果返回后）
你输出：
{"type":"final","answer":"我在 linux.do 上找到几条 Docker 教程相关帖子……\n\n推荐优先看：……","refs":[{"title":"...","url":"https://linux.do/t/..."}]}

# 重要提示（Important）
- 即使历史上下文里出现了错误格式（例如缺少 type），也必须忽略，始终遵守本协议输出。

`
  };

  class ConfigStore {
    constructor() {
      const saved = GM_getValue(STORE_KEYS.CONF, null);
      this.conf = { ...DEFAULT_CONF, ...(saved || {}) };
    }
    get() {
      return this.conf;
    }
    save(c) {
      this.conf = { ...this.conf, ...(c || {}) };
      GM_setValue(STORE_KEYS.CONF, this.conf);
    }
  }

  /******************************************************************
   * 2) 多会话存储（跨刷新）
   ******************************************************************/
  class SessionStore {
    constructor() {
      this.sessions = GM_getValue(STORE_KEYS.SESS, []);
      this.activeId = GM_getValue(STORE_KEYS.ACTIVE, null);

      if (!Array.isArray(this.sessions) || !this.sessions.length) {
        const id = uid();
        this.sessions = [this._newSessionObj(id, "新会话")];
        this.activeId = id;
        this._persist();
      }
      if (!this.sessions.some((s) => s.id === this.activeId)) {
        this.activeId = this.sessions[0].id;
        this._persist();
      }
    }

    _newSessionObj(id, title) {
      return {
        id,
        title: title || "新会话",
        createdAt: now(),
        updatedAt: now(),
        fsm: { state: FSM.IDLE, step: 0, lastError: null, isRunning: false },
        chat: [], // {role:'user'|'assistant', content, ts}
        agent: [], // {role:'agent'|'tool', kind, content, ts}
        draft: "", // === UI ENHANCE === 输入草稿持久化
      };
    }

    all() {
      return this.sessions;
    }
    active() {
      return (
        this.sessions.find((s) => s.id === this.activeId) || this.sessions[0]
      );
    }
    setActive(id) {
      this.activeId = id;
      GM_setValue(STORE_KEYS.ACTIVE, id);
    }

    create(title = "新会话") {
      const s = this._newSessionObj(uid(), title);
      this.sessions.unshift(s);
      this.activeId = s.id;
      this._persist();
      return s;
    }

    rename(id, title) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.title =
        String(title || "")
          .trim()
          .slice(0, 24) || "新会话";
      s.updatedAt = now();
      this._persist();
    }

    remove(id) {
      const idx = this.sessions.findIndex((x) => x.id === id);
      if (idx < 0) return;
      this.sessions.splice(idx, 1);
      if (!this.sessions.length) {
        const s = this._newSessionObj(uid(), "新会话");
        this.sessions = [s];
        this.activeId = s.id;
      } else if (this.activeId === id) {
        this.activeId = this.sessions[0].id;
      }
      this._persist();
    }

    pushChat(id, msg) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.chat.push(msg);
      s.updatedAt = now();
      this._persist();
    }
    pushAgent(id, msg) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.agent.push(msg);
      s.updatedAt = now();
      this._persist();
    }
    setFSM(id, patch) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.fsm = { ...(s.fsm || {}), ...(patch || {}) };
      s.updatedAt = now();
      this._persist();
    }

    updateLastAgent(id, predicateFn, updaterFn) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s || !Array.isArray(s.agent)) return;
      for (let i = s.agent.length - 1; i >= 0; i--) {
        if (predicateFn(s.agent[i])) {
          s.agent[i] = updaterFn(s.agent[i]) || s.agent[i];
          s.updatedAt = now();
          this._persist();
          return;
        }
      }
    }

    clearSession(id) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.chat = [];
      s.agent = [];
      s.draft = "";
      s.fsm = { state: FSM.IDLE, step: 0, lastError: null, isRunning: false };
      s.updatedAt = now();
      this._persist();
    }

    setDraft(id, text) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      s.draft = String(text ?? "");
      s.updatedAt = now();
      this._persist();
    }

    _persist() {
      GM_setValue(STORE_KEYS.SESS, this.sessions);
      GM_setValue(STORE_KEYS.ACTIVE, this.activeId);
    }
  }

  /******************************************************************
   * 3) Discourse 工具（linux.do 标准 JSON 接口）
   ******************************************************************/
  class DiscourseAPI {
    static headers() {
      return {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      };
    }

    static csrfToken() {
      return (
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || ""
      );
    }

    static async fetchJson(path, opt = {}) {
      const { method = "GET", body = null, headers = {}, signal } = opt;

      const init = {
        method,
        credentials: "same-origin",
        headers: { ...this.headers(), ...(headers || {}) },
        signal,
      };

      if (body != null) {
        init.headers["Content-Type"] = "application/json";
        init.headers["X-CSRF-Token"] = this.csrfToken();
        init.body = JSON.stringify(body);
      }

      const res = await fetch(path, init);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
      return res.json();
    }

    static topicUrl(topicId, postNo = 1) {
      return `${location.origin}/t/${encodeURIComponent(topicId)}/${postNo}`;
    }

    static userUrl(username) {
      return `${location.origin}/u/${encodeURIComponent(username)}`;
    }

    static async search({ q, page = 1, limit = 8 }, signal) {
      const params = new URLSearchParams();
      params.set("q", q);
      params.set("page", String(page));
      params.set("include_blurbs", "true");
      params.set("skip_context", "true");

      const data = await this.fetchJson(`/search.json?${params.toString()}`, {
        signal,
      });
      const topicsMap = new Map(
        (data.topics || []).map((t) => [
          t.id,
          safeTitle(t.fancy_title || t.title, `话题 ${t.id}`),
        ])
      );

      const posts = (data.posts || []).slice(0, limit).map((p) => ({
        topic_id: p.topic_id,
        post_number: p.post_number,
        title: topicsMap.get(p.topic_id) || `话题 ${p.topic_id}`,
        username: p.username,
        created_at: p.created_at,
        blurb: p.blurb || "",
        url: this.topicUrl(p.topic_id, p.post_number),
      }));

      return { q, page, posts };
    }

    static async getTopicAllPosts(
      { topicId, batchSize = 18, maxPosts = 240 },
      signal,
      cancelToken
    ) {
      const first = await this.fetchJson(
        `/t/${encodeURIComponent(topicId)}.json`,
        { signal }
      );
      const title = safeTitle(first.title, `话题 ${topicId}`);
      const stream = (first.post_stream?.stream || []).slice(0, maxPosts);
      const got = new Map();

      for (const p of first.post_stream?.posts || []) got.set(p.id, p);

      for (let i = 0; i < stream.length; i += batchSize) {
        if (cancelToken?.cancelled) throw new Error("Cancelled");
        const chunk = stream.slice(i, i + batchSize);
        const params = new URLSearchParams();
        chunk.forEach((id) => params.append("post_ids[]", String(id)));
        const data = await this.fetchJson(
          `/t/${encodeURIComponent(topicId)}/posts.json?${params.toString()}`,
          { signal }
        );
        for (const p of data.post_stream?.posts || []) got.set(p.id, p);
        await sleep(160);
      }

      const posts = stream
        .map((id) => got.get(id))
        .filter(Boolean)
        .map((p) => ({
          id: p.id,
          post_number: p.post_number,
          username: p.username,
          created_at: p.created_at,
          cooked: p.cooked || "",
          url: this.topicUrl(topicId, p.post_number),
          like_count: p.like_count,
          reply_count: p.reply_count,
        }));

      return { topicId, title, count: posts.length, posts };
    }

    static async getUserRecent({ username, limit = 10 }, signal) {
      const params = new URLSearchParams();
      params.set("offset", "0");
      params.set("limit", String(limit));
      params.set("username", username);
      params.set("filter", "4,5");

      const data = await this.fetchJson(
        `/user_actions.json?${params.toString()}`,
        { signal }
      );
      const items = (data.user_actions || []).map((a) => ({
        action_type: a.action_type,
        title: safeTitle(a.title, `话题 ${a.topic_id}`),
        topic_id: a.topic_id,
        post_number: a.post_number,
        created_at: a.created_at,
        excerpt: a.excerpt || "",
        url: this.topicUrl(a.topic_id, a.post_number),
      }));

      return { username, items };
    }

    static async getCategories(signal) {
      return this.fetchJson("/categories.json", { signal });
    }

    static async listLatestTopics({ page = 0 } = {}, signal) {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("no_definitions", "true");
      return this.fetchJson(`/latest.json?${params.toString()}`, { signal });
    }

    static async listTopTopics({ period = "weekly", page = 0 } = {}, signal) {
      const params = new URLSearchParams();
      params.set("period", String(period));
      params.set("page", String(page));
      params.set("no_definitions", "true");
      return this.fetchJson(`/top.json?${params.toString()}`, { signal });
    }

    static async getTagTopics({ tag, page = 0 } = {}, signal) {
      if (!tag) throw new Error("tag 不能为空");
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("no_definitions", "true");
      return this.fetchJson(
        `/tag/${encodeURIComponent(tag)}.json?${params.toString()}`,
        { signal }
      );
    }

    static async listLatestPosts({ before = null, limit = 20 } = {}, signal) {
      const params = new URLSearchParams();
      if (before !== null && before !== undefined && before !== "")
        params.set("before", String(before));
      params.set(
        "limit",
        String(Math.max(1, Math.min(50, parseInt(limit, 10) || 20)))
      );
      params.set("no_definitions", "true");

      let data;
      try {
        data = await this.fetchJson(`/posts.json?${params.toString()}`, {
          signal,
        });
      } catch (e1) {
        throw new Error(
          `获取失败：/posts.json 不可用或被限制。${String(e1?.message || e1)}`
        );
      }

      const arr = Array.isArray(data?.latest_posts)
        ? data.latest_posts
        : Array.isArray(data)
        ? data
        : [];
      const posts = arr
        .slice(0, Math.max(1, Math.min(50, parseInt(limit, 10) || 20)))
        .map((p) => {
          const topic_id = p.topic_id;
          const post_number = p.post_number || p.post_number;
          return {
            id: p.id,
            topic_id,
            post_number,
            username: p.username,
            created_at: p.created_at,
            cooked: p.cooked || "",
            raw: p.raw || "",
            like_count: p.like_count,
            url:
              topic_id && post_number
                ? this.topicUrl(topic_id, post_number)
                : "",
          };
        });

      return { before: before ?? null, returned: posts.length, posts };
    }

    static async getUserSummary({ username } = {}, signal) {
      if (!username) throw new Error("username 不能为空");

      const out = {
        username,
        urls: {
          profile: this.userUrl(username),
          summary: `${this.userUrl(username)}/summary`,
        },
        profile: null,
        summary: null,
        badges: null,
        hot_topics: [],
        hot_posts: [],
        recent_topics: [],
        recent_posts: [],
        _raw: {
          summary_json: null,
          profile_json: null,
          activity_topics_json: null,
          activity_posts_json: null,
        },
      };

      let summaryJson = null;
      try {
        summaryJson = await this.fetchJson(
          `/u/${encodeURIComponent(username)}/summary.json`,
          { signal }
        );
        out._raw.summary_json = summaryJson;
      } catch (e) {
        throw new Error(`获取 summary.json 失败：${String(e?.message || e)}`);
      }

      try {
        const profileJson = await this.fetchJson(
          `/u/${encodeURIComponent(username)}.json`,
          { signal }
        );
        out._raw.profile_json = profileJson;
      } catch {}

      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("no_definitions", "true");
        const topicsJson = await this.fetchJson(
          `/u/${encodeURIComponent(
            username
          )}/activity/topics.json?${params.toString()}`,
          { signal }
        );
        out._raw.activity_topics_json = topicsJson;
      } catch {}

      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("no_definitions", "true");
        const postsJson = await this.fetchJson(
          `/u/${encodeURIComponent(
            username
          )}/activity/posts.json?${params.toString()}`,
          { signal }
        );
        out._raw.activity_posts_json = postsJson;
      } catch {}

      const profileUser =
        out._raw.profile_json?.user || summaryJson?.user || null;
      if (profileUser) {
        out.profile = {
          id: profileUser.id,
          username: profileUser.username,
          name: profileUser.name ?? "",
          title: profileUser.title ?? "",
          trust_level: profileUser.trust_level,
          avatar_template: profileUser.avatar_template,
          created_at: profileUser.created_at,
          last_seen_at: profileUser.last_seen_at,
          last_posted_at: profileUser.last_posted_at,
          badge_count: profileUser.badge_count,
          website: profileUser.website,
          website_name: profileUser.website_name,
          profile_view_count: profileUser.profile_view_count,
          time_read: profileUser.time_read,
          recent_time_read: profileUser.recent_time_read,
          user_fields: profileUser.user_fields || {},
        };
      }

      const us = summaryJson?.user_summary || summaryJson?.userSummary || null;
      if (us) {
        out.summary = {
          topic_count: us.topic_count,
          reply_count: us.reply_count,
          likes_given: us.likes_given,
          likes_received: us.likes_received,
          days_visited: us.days_visited,
          posts_read_count: us.posts_read_count,
          time_read: us.time_read,
        };
      }

      out.badges = {
        user_badges:
          summaryJson?.user_badges || summaryJson?.userBadges || null,
        badges: summaryJson?.badges || null,
        badge_types: summaryJson?.badge_types || null,
        users: summaryJson?.users || null,
      };

      const topTopics = Array.isArray(summaryJson?.top_topics)
        ? summaryJson.top_topics
        : Array.isArray(summaryJson?.topTopics)
        ? summaryJson.topTopics
        : [];
      const topReplies = Array.isArray(summaryJson?.top_replies)
        ? summaryJson.top_replies
        : Array.isArray(summaryJson?.topReplies)
        ? summaryJson.topReplies
        : [];

      out.hot_topics = topTopics
        .map((t) => ({
          topic_id: t.id || t.topic_id || t.topicId,
          title: safeTitle(
            t.fancy_title || t.title,
            `话题 ${t.id || t.topic_id || ""}`
          ),
          like_count: t.like_count,
          views: t.views,
          reply_count: t.reply_count ?? t.posts_count,
          last_posted_at: t.last_posted_at ?? t.bumped_at,
          category_id: t.category_id,
          tags: t.tags || [],
          url: this.topicUrl(t.id || t.topic_id || t.topicId, 1),
        }))
        .filter((x) => x.topic_id);

      out.hot_posts = topReplies
        .map((p) => ({
          topic_id: p.topic_id,
          post_number: p.post_number,
          post_id: p.id,
          title: safeTitle(p.topic_title || p.title, `话题 ${p.topic_id}`),
          like_count: p.like_count,
          created_at: p.created_at,
          excerpt: p.excerpt || "",
          username: p.username,
          url: this.topicUrl(p.topic_id, p.post_number || 1),
        }))
        .filter((x) => x.topic_id);

      const actTopics =
        out._raw.activity_topics_json?.topic_list?.topics ||
        out._raw.activity_topics_json?.topics ||
        [];
      if (Array.isArray(actTopics) && actTopics.length) {
        const extra = actTopics.map((t) => ({
          topic_id: t.id,
          title: safeTitle(t.fancy_title || t.title, `话题 ${t.id}`),
          like_count: t.like_count,
          views: t.views,
          reply_count:
            t.reply_count ??
            (t.posts_count ? Math.max(0, t.posts_count - 1) : undefined),
          last_posted_at: t.last_posted_at ?? t.bumped_at,
          category_id: t.category_id,
          tags: t.tags || [],
          url: this.topicUrl(t.id, 1),
          _score:
            (t.like_count || 0) * 4 +
            (t.views || 0) * 0.01 +
            (t.reply_count || 0) * 2,
        }));

        out.recent_topics = extra
          .slice(0, 12)
          .map(({ _score, ...rest }) => rest);

        const exist = new Set(out.hot_topics.map((x) => x.topic_id));
        extra.sort((a, b) => b._score - a._score);
        for (const t of extra) {
          if (out.hot_topics.length >= 10) break;
          if (!exist.has(t.topic_id)) {
            exist.add(t.topic_id);
            const { _score, ...rest } = t;
            out.hot_topics.push(rest);
          }
        }
      }

      const actPosts =
        out._raw.activity_posts_json?.user_actions ||
        out._raw.activity_posts_json?.posts ||
        out._raw.activity_posts_json?.activity_stream ||
        [];
      if (Array.isArray(actPosts) && actPosts.length) {
        const normPosts = actPosts
          .map((a) => {
            const topic_id = a.topic_id || a?.post?.topic_id;
            const post_number = a.post_number || a?.post?.post_number;
            const like_count = a.like_count ?? a?.post?.like_count;
            const excerpt = a.excerpt || a?.post?.excerpt || "";
            const created_at = a.created_at || a?.post?.created_at;
            const username2 = a.username || a?.post?.username || username;
            const title = safeTitle(
              a.title || a.topic_title || a?.post?.topic_title,
              topic_id ? `话题 ${topic_id}` : "帖子"
            );
            return {
              topic_id,
              post_number,
              post_id: a.post_id || a.id || a?.post?.id,
              title,
              like_count,
              created_at,
              excerpt,
              username: username2,
              url:
                topic_id && post_number
                  ? this.topicUrl(topic_id, post_number)
                  : "",
            };
          })
          .filter((x) => x.topic_id && x.post_number);

        out.recent_posts = normPosts.slice(0, 12);

        const existPostKey = new Set(
          out.hot_posts.map((x) => `${x.topic_id}#${x.post_number}`)
        );
        const scored = normPosts.map((p) => ({
          ...p,
          _score:
            (p.like_count || 0) * 5 +
            (p.excerpt ? Math.min(1, p.excerpt.length / 120) : 0),
        }));
        scored.sort((a, b) => b._score - a._score);
        for (const p of scored) {
          if (out.hot_posts.length >= 10) break;
          const k = `${p.topic_id}#${p.post_number}`;
          if (!existPostKey.has(k)) {
            existPostKey.add(k);
            const { _score, ...rest } = p;
            out.hot_posts.push(rest);
          }
        }
      }

      out.hot_topics = out.hot_topics.slice(0, 10);
      out.hot_posts = out.hot_posts.slice(0, 10);
      out.recent_topics = out.recent_topics.slice(0, 12);
      out.recent_posts = out.recent_posts.slice(0, 12);

      return out;
    }

    static async getPost({ postId } = {}, signal) {
      if (!postId) throw new Error("postId 不能为空");
      return this.fetchJson(`/posts/${encodeURIComponent(postId)}.json`, {
        signal,
      });
    }

    static async getTopicPostFull(
      { topicId, postNumber = 1, maxChars = 10000 } = {},
      signal
    ) {
      if (topicId === undefined || topicId === null || topicId === "")
        throw new Error("topicId 不能为空");
      const pn = Math.max(1, parseInt(postNumber, 10) || 1);
      const max = Math.max(
        1000,
        Math.min(10000, parseInt(maxChars, 10) || 10000)
      );

      const trunc = (s) => {
        s = String(s || "");
        return s.length > max ? s.slice(0, max) + "\n...(截断)" : s;
      };

      let post = null;
      let title = "";
      let used = "";

      try {
        const data = await this.fetchJson(
          `/posts/by_number/${encodeURIComponent(topicId)}/${encodeURIComponent(
            pn
          )}.json`,
          { signal }
        );
        post = data?.post || data;
        title = safeTitle(post?.topic_title, "");
        used = "posts/by_number";
      } catch (e1) {
        try {
          const data2 = await this.fetchJson(
            `/t/${encodeURIComponent(topicId)}/${encodeURIComponent(pn)}.json`,
            { signal }
          );
          title = safeTitle(data2?.title, `话题 ${topicId}`);
          const ps = data2?.post_stream?.posts || [];
          post = ps.find((x) => x?.post_number === pn) || ps[0] || null;
          used = "t/{topicId}/{postNumber}.json";
        } catch (e2) {
          throw new Error(
            `获取失败：by_number与topic视图都不可用。\n- by_number: ${String(
              e1?.message || e1
            )}\n- topic_view: ${String(e2?.message || e2)}`
          );
        }
      }

      if (!post) throw new Error("未找到该楼层帖子");

      const cooked = trunc(post.cooked || "");
      const raw = trunc(post.raw || "");

      const topic_id = post.topic_id || topicId;
      const post_number = post.post_number || pn;

      return {
        topicId: topic_id,
        title: title || safeTitle(post?.topic_title, `话题 ${topic_id}`),
        postId: post.id,
        post_number,
        username: post.username,
        created_at: post.created_at,
        url: this.topicUrl(topic_id, post_number),
        cooked,
        raw,
        maxChars: max,
        endpointUsed: used,
      };
    }
  }

  /******************************************************************
   * 4) 工具注册表
   ******************************************************************/
const TOOLS_SPEC = `
# Tool Calling Contract (MUST FOLLOW)
你只能通过输出 JSON 指令来调用工具。每次响应必须且只能输出以下两种之一：

(1) 工具调用：
{
  "type": "tool",
  "name": "<tool_name>",
  "args": { ... }
}

(2) 最终回复：
{
  "type": "final",
  "answer": "<回答内容，允许简单 Markdown，但必须是字符串；换行用 \\n>",
  "refs": [
    {"title":"<引用标题>","url":"<引用链接>"},
    ...
  ]
}

重要约束：
- 禁止输出任何额外自然语言（包括“好的/正在搜索/以下是结果”等）。
- 禁止使用 Markdown 代码块包裹 JSON（不要 \`\`\`json）。
- refs 只能来自工具返回的真实 url，严禁编造。
- 当信息不足时，优先继续调用工具（可多轮），直到能 final。
- 如果工具连续失败/无结果，必须 final 并在 answer 中说明未找到。

----------------------------------------
# Available Tools (ONLY THESE 11)
命名规则：name 必须严格匹配以下之一：
- discourse.search
- discourse.getTopicAllPosts
- discourse.getUserRecent
- discourse.getCategories
- discourse.listLatestTopics
- discourse.listTopTopics
- discourse.getTagTopics
- discourse.getUserSummary
- discourse.getPost
- discourse.getTopicPostFull
- discourse.listLatestPosts

----------------------------------------
# 1) discourse.search
用途：全站搜索（关键词 / 语义），返回匹配的“帖子命中”（带 topic_id + post_number）。
适用场景：
- 用户只给关键词：如“找 Docker 教程”“搜某人提到的 XX”
- 不知道 topicId 时先 search 再定位 topicId/楼层

Args：
{
  "q": string,            // 必填：搜索词。支持 Discourse 搜索语法（如 in:title, status:open, tags:xxx, @user 等）
  "page": number?,        // 可选：默认 1。>=1
  "limit": number?        // 可选：默认 8。返回 posts 取前 limit 条；建议 5~12
}

Return：
{
  "q": string,
  "page": number,
  "posts": [
    {
      "topic_id": number,
      "post_number": number,
      "title": string,        // 话题标题（fancy_title/ title）
      "username": string,     // 作者用户名
      "created_at": string,   // ISO 时间
      "blurb": string,        // 摘要（可能含 HTML）
      "url": string           // 绝对链接：/t/<topicId>/<postNo>
    }
  ]
}

常见后续：
- 需要整帖：用 discourse.getTopicAllPosts({topicId})
- 需要指定楼全文：用 discourse.getTopicPostFull({topicId, postNumber})

----------------------------------------
# 2) discourse.getTopicAllPosts
用途：抓取某个话题的“全帖帖子流”（按 stream 批量拉 posts.json），用于总结/抽取结论/追踪争论上下文。
适用场景：
- “总结这个话题”“整理楼主观点+最新进展”
- 需要跨楼层对比观点（但注意上下文长度限制；如要某楼全文用 getTopicPostFull）

Args：
{
  "topicId": number|string,  // 必填：话题 id
  "batchSize": number?,      // 可选：默认 18。每批 post_ids[] 数量；建议 12~30
  "maxPosts": number?        // 可选：默认 240。最多抓取多少楼（从 stream 前 maxPosts）
}

Return：
{
  "topicId": number|string,
  "title": string,
  "count": number,
  "posts": [
    {
      "id": number,             // post id
      "post_number": number,    // 楼层号
      "username": string,
      "created_at": string,     // ISO
      "cooked": string,         // HTML（可能很长）
      "url": string,            // 绝对链接
      "like_count": number?,
      "reply_count": number?
    }
  ]
}

注意：
- cooked 是 HTML；需要纯文本时自行 strip/抽取要点。
- 若某楼内容很长/很关键，建议改用 getTopicPostFull 精准抓全文（<=10000 chars）。

----------------------------------------
# 3) discourse.getUserRecent
用途：查询某用户近期“发帖/回帖”等动作流（user_actions）。
适用场景：
- “看看 @xxx 最近在讨论什么”
- “找这个用户最近发的关于 XXX 的帖子”

Args：
{
  "username": string,     // 必填：用户名（不带@也可）
  "limit": number?        // 可选：默认 10。建议 8~20
}

Return：
{
  "username": string,
  "items": [
    {
      "action_type": number,    // 4=发帖, 5=回帖（脚本里用 filter:4,5）
      "title": string,
      "topic_id": number,
      "post_number": number,
      "created_at": string,
      "excerpt": string,        // 摘要（可能含 HTML）
      "url": string
    }
  ]
}

常见后续：
- 想看该楼全文：getTopicPostFull({topicId, postNumber})
- 想看用户整体画像+热门内容：getUserSummary({username})

----------------------------------------
# 4) discourse.getCategories
用途：获取站点分类列表 categories.json。
适用场景：
- “有哪些分类/哪个分类适合发帖”
- “列出分类ID/slug/帖子数”

Args：{}
Return：Discourse 原始 categories.json（结构较大），重点字段：
- category_list.categories[]: {id, name, slug, description_text, topic_count, post_count, ...}

----------------------------------------
# 5) discourse.listLatestTopics
用途：获取 /latest.json 的话题列表（最新 bump 的主题）。
适用场景：
- “列出最新话题”
- “最近大家在聊啥”

Args：
{
  "page": number?   // 可选：默认 0。>=0
}
Return：Discourse 原始 latest.json（重点在 topic_list.topics[]）

常见后续：
- 对某 topic 做总结：getTopicAllPosts({topicId})
- 看最新帖子流：listLatestPosts

----------------------------------------
# 6) discourse.listTopTopics
用途：获取 /top.json（按 period 的 Top 话题）。
适用场景：
- “本周 Top 话题”“本月最热视频”

Args：
{
  "period": string?,   // 可选：默认 "weekly"
                        // 常用：daily | weekly | monthly | quarterly | yearly | all
  "page": number?      // 可选：默认 0
}
Return：Discourse 原始 top.json（重点在 topic_list.topics[]）

----------------------------------------
# 7) discourse.getTagTopics
用途：获取某个 tag 下的话题列表 /tag/<tag>.json
适用场景：
- “看 linux tag 下有什么”
- “某标签精选/总结”

Args：
{
  "tag": string,       // 必填
  "page": number?      // 可选：默认 0
}
Return：Discourse 原始 tag/<tag>.json（重点在 topic_list.topics[]）

----------------------------------------
# 8) discourse.getUserSummary
用途：用户概览（脚本做了“聚合+补充抓取”）：summary.json + profile.json + activity/topics + activity/posts
适用场景：
- “@xxx 是什么风格/主要关注什么/热门帖子有哪些”
- “给我这个用户的热门话题、热门回复、近期话题、近期发言”

Args：
{
  "username": string  // 必填
}

Return（脚本自定义结构，稳定字段如下）：
{
  "username": string,
  "urls": { "profile": string, "summary": string },

  "profile": {
    "id": number,
    "username": string,
    "name": string,
    "title": string,
    "trust_level": number,
    "avatar_template": string,
    "created_at": string,
    "last_seen_at": string,
    "last_posted_at": string,
    "badge_count": number,
    "website": string,
    "website_name": string,
    "profile_view_count": number,
    "time_read": number,
    "recent_time_read": number,
    "user_fields": object
  } | null,

  "summary": {
    "topic_count": number,
    "reply_count": number,
    "likes_given": number,
    "likes_received": number,
    "days_visited": number,
    "posts_read_count": number,
    "time_read": number
  } | null,

  "badges": { ... } | null,

  "hot_topics": [ {topic_id, title, like_count, views, reply_count, last_posted_at, category_id, tags, url} ],
  "hot_posts":  [ {topic_id, post_number, post_id, title, like_count, created_at, excerpt, username, url} ],
  "recent_topics": [ ... ],
  "recent_posts":  [ ... ],

  "_raw": {
    "summary_json": object|null,
    "profile_json": object|null,
    "activity_topics_json": object|null,
    "activity_posts_json": object|null
  }
}

注意：
- hot_* / recent_* 数组已在工具内部做过裁剪（最多 10 或 12）。
- 引用链接必须使用返回内的 url。

----------------------------------------
# 9) discourse.getPost
用途：按 postId 获取单帖详情 /posts/<id>.json
适用场景：
- 已知 postId，想拿到完整 cooked/raw、编辑信息、附件等原始字段

Args：
{
  "postId": number|string  // 必填
}
Return：Discourse 原始 post JSON（通常形如 { post: {...} } 或 {...}）

常见后续：
- 若需要 topicId/post_number 组合链接，优先用返回内字段拼接或直接用现成 url。

----------------------------------------
# 10) discourse.getTopicPostFull
用途：按 (topicId + postNumber) 精确抓取指定楼层“全文”（raw/cooked 截断<=maxChars）。
适用场景：
- “抓这个话题第 N 楼全文”
- “给我 OP 全文/某楼关键代码块”
- getTopicAllPosts 上下文被省略中间楼层时，补抓指定楼

Args：
{
  "topicId": number|string,    // 必填
  "postNumber": number,        // 必填：>=1
  "maxChars": number?          // 可选：默认 10000；范围 [1000, 10000]
}

Return：
{
  "topicId": number|string,
  "title": string,
  "postId": number,
  "post_number": number,
  "username": string,
  "created_at": string,
  "url": string,
  "cooked": string,            // HTML，已按 maxChars 截断
  "raw": string,               // 纯文本/markdown，已按 maxChars 截断
  "maxChars": number,
  "endpointUsed": string       // "posts/by_number" 或 "t/{topicId}/{postNumber}.json"
}

注意：
- raw 是最适合做“引用/复述”的来源（仍需遵守不要原样大段复制的原则）。
- cooked 可能含 HTML 标签。

----------------------------------------
# 11) discourse.listLatestPosts
用途：站点“最新帖子流” /posts.json（如果站点允许）。
适用场景：
- “站点最新帖子列表”
- “最近刚发了哪些回复/新帖子”

Args：
{
  "before": number|string|null?, // 可选：默认 null。用于翻页（取更早的）
  "limit": number?               // 可选：默认 20；范围 [1, 50]
}

Return（脚本自定义结构）：
{
  "before": number|string|null,
  "returned": number,
  "posts": [
    {
      "id": number,
      "topic_id": number,
      "post_number": number,
      "username": string,
      "created_at": string,
      "cooked": string,
      "raw": string,
      "like_count": number?,
      "url": string
    }
  ]
}

----------------------------------------
# Recommended Multi-step Workflows (GUIDE)
- 关键词找资料：discourse.search ->（挑 topic_id/post_number）-> getTopicAllPosts 或 getTopicPostFull -> final
- 总结某话题：getTopicAllPosts(topicId) -> 如需补楼：getTopicPostFull -> final
- 看用户画像：getUserSummary(username) -> 如需看某楼：getTopicPostFull -> final
- 看最新动态：listLatestTopics 或 listLatestPosts -> 选 topic -> getTopicAllPosts -> final
`;


  async function runTool(name, args, cancelToken) {
    // 每次工具调用都支持 AbortController（Stop）
    const ac = new AbortController();
    if (cancelToken) {
      cancelToken.aborts.push(() => ac.abort());
      if (cancelToken.cancelled) ac.abort();
    }

    if (name === "discourse.search")
      return DiscourseAPI.search(args, ac.signal);
    if (name === "discourse.getTopicAllPosts")
      return DiscourseAPI.getTopicAllPosts(args, ac.signal, cancelToken);
    if (name === "discourse.getUserRecent")
      return DiscourseAPI.getUserRecent(args, ac.signal);
    if (name === "discourse.getCategories")
      return DiscourseAPI.getCategories(ac.signal);
    if (name === "discourse.listLatestTopics")
      return DiscourseAPI.listLatestTopics(args, ac.signal);
    if (name === "discourse.listTopTopics")
      return DiscourseAPI.listTopTopics(args, ac.signal);
    if (name === "discourse.getTagTopics")
      return DiscourseAPI.getTagTopics(args, ac.signal);
    if (name === "discourse.getUserSummary")
      return DiscourseAPI.getUserSummary(args, ac.signal);
    if (name === "discourse.getPost")
      return DiscourseAPI.getPost(args, ac.signal);
    if (name === "discourse.getTopicPostFull")
      return DiscourseAPI.getTopicPostFull(args, ac.signal);
    if (name === "discourse.listLatestPosts")
      return DiscourseAPI.listLatestPosts(args, ac.signal);
    throw new Error(`未知工具: ${name}`);
  }

  /******************************************************************
   * 4.5) toolResultToContext（增强）
   ******************************************************************/
  function toolResultToContext(name, result) {
    const LIMITS = {
      search_items: 12,
      search_excerpt: 420,
      user_recent_items: 16,
      user_recent_excerpt: 420,
      topic_head_posts: 18,
      topic_tail_posts: 8,
      topic_excerpt: 900,
      topic_op_extra: 2200,
      list_topics_items: 30,
      categories_items: 40,
      post_excerpt: 1600,
      topic_post_full_cooked_hint: 2200,

      user_hot_topics: 10,
      user_hot_posts: 10,
      user_recent_topics: 12,
      user_recent_posts: 12,
      user_excerpt: 260,

      latest_posts_items: 24,
      latest_posts_excerpt: 420,
    };

    const MAX_CONTEXT_CHARS = 22000;

    const norm = (s) =>
      stripHtml(String(s || ""))
        .replace(/\s+/g, " ")
        .trim();
    const cut = (s, n) => {
      s = String(s || "");
      return s.length > n ? s.slice(0, n) + "…" : s;
    };

    const kv = (k, v) =>
      v === undefined || v === null || v === "" ? "" : `${k}: ${v}`;
    const joinNonEmpty = (arr, sep = "\n") => arr.filter(Boolean).join(sep);
    const clampCtx = (text) => clamp(text, MAX_CONTEXT_CHARS);

    if (name === "discourse.search") {
      const posts = (result?.posts || []).slice(0, LIMITS.search_items);
      const lines = posts.map((p, i) => {
        const ex = cut(norm(p.blurb), LIMITS.search_excerpt);
        return joinNonEmpty([
          `${i + 1}. ${safeTitle(p.title, `话题 ${p.topic_id}`)}`,
          `- topic_id: ${p.topic_id} | post_number: ${p.post_number}`,
          `- author: @${p.username} | created_at: ${p.created_at}`,
          `- 摘要: ${ex}`,
          `- 链接: ${p.url}`,
        ]);
      });
      const header = `【TOOL_RESULT discourse.search | q=${
        result?.q ?? ""
      } | page=${result?.page ?? ""} | returned=${posts.length}】`;
      return clampCtx(header + "\n" + lines.join("\n\n"));
    }

    if (name === "discourse.getUserRecent") {
      const items = (result?.items || []).slice(0, LIMITS.user_recent_items);
      const lines = items.map((x, i) => {
        const ex = cut(norm(x.excerpt), LIMITS.user_recent_excerpt);
        const typ =
          x.action_type === 4
            ? "发帖"
            : x.action_type === 5
            ? "回帖"
            : `动作${x.action_type}`;
        return joinNonEmpty([
          `${i + 1}. ${typ} | ${safeTitle(x.title, `话题 ${x.topic_id}`)}`,
          `- topic_id: ${x.topic_id} | post_number: ${x.post_number}`,
          `- created_at: ${x.created_at}`,
          `- 摘要: ${ex}`,
          `- 链接: ${x.url}`,
        ]);
      });
      const header = `【TOOL_RESULT discourse.getUserRecent | @${
        result?.username ?? ""
      } | returned=${items.length}】`;
      return clampCtx(header + "\n" + lines.join("\n\n"));
    }

    if (name === "discourse.getTopicAllPosts") {
      const postsAll = result?.posts || [];
      const count = postsAll.length;

      const head = postsAll.slice(0, LIMITS.topic_head_posts);
      const tail =
        count > LIMITS.topic_head_posts
          ? postsAll.slice(
              Math.max(LIMITS.topic_head_posts, count - LIMITS.topic_tail_posts)
            )
          : [];

      const formatPost = (p) => {
        const isOP = p.post_number === 1;
        const n = isOP
          ? Math.max(LIMITS.topic_excerpt, LIMITS.topic_op_extra)
          : LIMITS.topic_excerpt;
        const ex = cut(norm(p.cooked), n);
        const likes =
          p.like_count !== undefined ? ` | likes=${p.like_count}` : "";
        return joinNonEmpty([
          `#${p.post_number} @${p.username} ${p.created_at}${likes}`,
          `- 摘要: ${ex}`,
          `- 链接: ${p.url}`,
        ]);
      };

      const headLines = head.map(formatPost);
      const tailLines = tail.map(formatPost);

      const header = joinNonEmpty([
        `【TOOL_RESULT discourse.getTopicAllPosts | ${safeTitle(
          result?.title,
          `话题 ${result?.topicId}`
        )}】`,
        `topicId: ${result?.topicId} | total_posts: ${count}`,
        `hint: 已提供“前${head.length}楼 + 后${tailLines.length}楼”，用于同时覆盖 OP 与最新进展`,
      ]);

      const midGap =
        tailLines.length && count > head.length + tailLines.length
          ? `\n\n…（中间省略 ${
              count - head.length - tailLines.length
            } 楼，为节省上下文；如需可用 discourse.getTopicPostFull 抓取指定楼层全文）…\n\n`
          : "\n\n";

      return clampCtx(
        header +
          "\n\n" +
          headLines.join("\n\n") +
          midGap +
          tailLines.join("\n\n")
      );
    }

    if (name === "discourse.getCategories") {
      const cats = (result?.category_list?.categories || []).slice(
        0,
        LIMITS.categories_items
      );
      const lines = cats.map((c, i) => {
        const slug = c.slug || c.name || "";
        const url = `${location.origin}/c/${encodeURIComponent(slug)}/${c.id}`;
        const desc = cut(norm(c.description || c.description_text || ""), 260);
        return joinNonEmpty([
          `${i + 1}. ${safeTitle(c.name, `分类 ${c.id}`)} (id=${c.id}, slug=${
            c.slug || ""
          })`,
          joinNonEmpty(
            [
              kv("- topics", c.topic_count),
              kv("posts", c.post_count),
              kv("users", c.user_count),
              kv("position", c.position),
            ],
            " | "
          ).replace(/^\s*\|\s*/, "- "),
          desc ? `- 描述: ${desc}` : "",
          `- 链接: ${url}`,
        ]);
      });
      const header = `【TOOL_RESULT discourse.getCategories | returned=${cats.length}】`;
      return clampCtx(header + "\n" + lines.join("\n\n"));
    }

    if (
      name === "discourse.listLatestTopics" ||
      name === "discourse.listTopTopics" ||
      name === "discourse.getTagTopics"
    ) {
      const topics = (result?.topic_list?.topics || []).slice(
        0,
        LIMITS.list_topics_items
      );

      const metaBits = [];
      if (name === "discourse.getTagTopics")
        metaBits.push(kv("tag", result?.tag || result?.tag_name || ""));
      if (name === "discourse.listTopTopics")
        metaBits.push(kv("period", result?.period || ""));
      metaBits.push(kv("page", result?.topic_list?.page || result?.page || ""));

      const moreUrl = result?.topic_list?.more_topics_url;
      const topTags = Array.isArray(result?.topic_list?.top_tags)
        ? result.topic_list.top_tags.slice(0, 15)
        : [];

      const lines = topics.map((t, i) => {
        const url = DiscourseAPI.topicUrl(t.id, 1);
        const title = safeTitle(t.fancy_title || t.title, `话题 ${t.id}`);
        const tags = Array.isArray(t.tags) ? t.tags.join(",") : "";
        const last = t.last_posted_at || t.bumped_at || "";
        const postsCount =
          t.posts_count !== undefined ? t.posts_count : undefined;
        const replies =
          t.reply_count !== undefined
            ? t.reply_count
            : postsCount !== undefined
            ? Math.max(0, postsCount - 1)
            : undefined;

        return joinNonEmpty([
          `${i + 1}. ${title}`,
          joinNonEmpty(
            [
              kv("- topic_id", t.id),
              kv("category_id", t.category_id),
              kv("tags", tags),
            ],
            " | "
          ).replace(/^\s*\|\s*/, "- "),
          joinNonEmpty(
            [
              kv("- posts_count", postsCount),
              kv("replies", replies),
              kv("views", t.views),
              kv("like_count", t.like_count),
              kv("last", last),
            ],
            " | "
          ).replace(/^\s*\|\s*/, "- "),
          `- 链接: ${url}`,
        ]);
      });

      const header = `【TOOL_RESULT ${name} | ${metaBits
        .filter(Boolean)
        .join(" | ")} | returned=${topics.length}】`;
      const extra = joinNonEmpty([
        moreUrl ? `more_topics_url: ${location.origin}${moreUrl}` : "",
        topTags.length ? `top_tags: ${topTags.join(", ")}` : "",
      ]);

      return clampCtx(
        header + "\n" + (extra ? extra + "\n\n" : "") + lines.join("\n\n")
      );
    }

    if (name === "discourse.getUserSummary") {
      const r = result || {};
      const u = r.profile || {};
      const s = r.summary || {};
      const hotTopics = (r.hot_topics || []).slice(0, LIMITS.user_hot_topics);
      const hotPosts = (r.hot_posts || []).slice(0, LIMITS.user_hot_posts);
      const recTopics = (r.recent_topics || []).slice(
        0,
        LIMITS.user_recent_topics
      );
      const recPosts = (r.recent_posts || []).slice(
        0,
        LIMITS.user_recent_posts
      );

      const base = [
        `【TOOL_RESULT discourse.getUserSummary | @${
          r.username || ""
        } | Rich】`,
        r.urls?.profile ? `profile: ${r.urls.profile}` : "",
        r.urls?.summary ? `summary: ${r.urls.summary}` : "",
        "",
        "--- 用户信息 ---",
        [
          kv("id", u.id),
          kv("username", u.username ? "@" + u.username : ""),
          kv("name", u.name),
          kv("title", u.title),
          kv("trust_level", u.trust_level),
          kv("badge_count", u.badge_count),
        ]
          .filter(Boolean)
          .join(" | "),
        [
          kv("created_at", u.created_at),
          kv("last_seen_at", u.last_seen_at),
          kv("last_posted_at", u.last_posted_at),
        ]
          .filter(Boolean)
          .join(" | "),
        u.website ? `website: ${u.website}` : "",
        u.profile_view_count !== undefined
          ? `profile_view_count: ${u.profile_view_count}`
          : "",
        "",
        "--- 统计摘要 ---",
        [
          kv("topic_count", s.topic_count),
          kv("reply_count", s.reply_count),
          kv("likes_given", s.likes_given),
          kv("likes_received", s.likes_received),
        ]
          .filter(Boolean)
          .join(" | "),
        [
          kv("days_visited", s.days_visited),
          kv("posts_read_count", s.posts_read_count),
          kv("time_read", s.time_read),
        ]
          .filter(Boolean)
          .join(" | "),
      ].filter(Boolean);

      const norm = (s2) =>
        stripHtml(String(s2 || ""))
          .replace(/\s+/g, " ")
          .trim();
      const cut = (s2, n) =>
        String(s2 || "").length > n
          ? String(s2 || "").slice(0, n) + "…"
          : String(s2 || "");

      const fmtTopic = (t, i) => {
        const tags = Array.isArray(t.tags) ? t.tags.join(",") : "";
        const ex = t.excerpt ? cut(norm(t.excerpt), LIMITS.user_excerpt) : "";
        return [
          `${i + 1}. ${safeTitle(t.title, `话题 ${t.topic_id}`)}`,
          [
            kv("- topic_id", t.topic_id),
            kv("category_id", t.category_id),
            kv("tags", tags),
          ]
            .filter(Boolean)
            .join(" | ")
            .replace(/^\s*\|\s*/, "- "),
          [
            kv("- likes", t.like_count),
            kv("views", t.views),
            kv("replies", t.reply_count),
            kv("last", t.last_posted_at),
          ]
            .filter(Boolean)
            .join(" | ")
            .replace(/^\s*\|\s*/, "- "),
          ex ? `- 摘要: ${ex}` : "",
          t.url ? `- 链接: ${t.url}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      };

      const fmtPost = (p, i) => {
        const ex = cut(norm(p.excerpt || p.cooked || ""), LIMITS.user_excerpt);
        return [
          `${i + 1}. ${safeTitle(p.title, `话题 ${p.topic_id}`)} #${
            p.post_number
          }`,
          [
            kv("- topic_id", p.topic_id),
            kv("post_number", p.post_number),
            kv("likes", p.like_count),
            kv("author", p.username ? "@" + p.username : ""),
            kv("created_at", p.created_at),
          ]
            .filter(Boolean)
            .join(" | ")
            .replace(/^\s*\|\s*/, "- "),
          ex ? `- 摘要: ${ex}` : "",
          p.url ? `- 链接: ${p.url}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      };

      const sections = [];
      if (hotTopics.length)
        sections.push(
          [
            "",
            "--- 热门话题（Top Topics / Hot Topics）---",
            ...hotTopics.map(fmtTopic),
          ].join("\n")
        );
      if (hotPosts.length)
        sections.push(
          [
            "",
            "--- 热门帖子（Top Replies / Hot Posts）---",
            ...hotPosts.map(fmtPost),
          ].join("\n")
        );
      if (recTopics.length)
        sections.push(
          [
            "",
            "--- 近期话题（Recent Topics）---",
            ...recTopics.map(fmtTopic),
          ].join("\n")
        );
      if (recPosts.length)
        sections.push(
          [
            "",
            "--- 近期发言（Recent Posts）---",
            ...recPosts.map(fmtPost),
          ].join("\n")
        );

      const badgeHint =
        r.badges?.user_badges && r.badges?.badges
          ? `\n--- 徽章（Badges）---\nuser_badges: ${
              Array.isArray(r.badges.user_badges)
                ? r.badges.user_badges.length
                : "n/a"
            } | badges: ${
              Array.isArray(r.badges.badges) ? r.badges.badges.length : "n/a"
            }`
          : "";

      return clamp(
        base.join("\n") + "\n" + sections.join("\n") + badgeHint,
        MAX_CONTEXT_CHARS
      );
    }

    if (name === "discourse.getPost") {
      const p = result?.post || result || {};
      const cooked = cut(norm(p.cooked || ""), LIMITS.post_excerpt);
      const raw = cut(String(p.raw || ""), Math.min(1200, LIMITS.post_excerpt));
      const url =
        p.topic_id && p.post_number
          ? DiscourseAPI.topicUrl(p.topic_id, p.post_number)
          : "";

      const lines = [
        `【TOOL_RESULT discourse.getPost】`,
        `id: ${p.id || ""}`,
        [
          kv("topic_id", p.topic_id),
          kv("post_number", p.post_number),
          kv("author", p.username ? "@" + p.username : ""),
          kv("created_at", p.created_at),
        ]
          .filter(Boolean)
          .join(" | "),
        url ? `- 链接: ${url}` : "",
        cooked ? `- cooked 摘要: ${cooked}` : "",
        raw ? `- raw 摘要: ${raw}` : "",
      ].filter(Boolean);

      return clampCtx(lines.join("\n"));
    }

    if (name === "discourse.getTopicPostFull") {
      const r = result || {};
      const cookedHint = cut(
        norm(r.cooked || ""),
        LIMITS.topic_post_full_cooked_hint
      );

      const lines = [
        `【TOOL_RESULT discourse.getTopicPostFull | ${safeTitle(
          r.title,
          `话题 ${r.topicId}`
        )}】`,
        `topicId: ${r.topicId} | post_number: ${r.post_number} | postId: ${
          r.postId || ""
        }`,
        `author: @${r.username || ""} | created_at: ${r.created_at || ""}`,
        `endpointUsed: ${r.endpointUsed || ""} | maxChars: ${r.maxChars || ""}`,
        r.url ? `- 链接: ${r.url}` : "",
        cookedHint ? `- cooked(提示): ${cookedHint}` : "",
        "",
        "--- raw（全文，已限制 <=10000 字符） ---",
        String(r.raw || ""),
      ].filter(Boolean);

      return clampCtx(lines.join("\n"));
    }

    if (name === "discourse.listLatestPosts") {
      const posts = (result?.posts || []).slice(0, LIMITS.latest_posts_items);
      const lines = posts.map((p, i) => {
        const ex = cut(
          norm(p.cooked || p.raw || ""),
          LIMITS.latest_posts_excerpt
        );
        return joinNonEmpty([
          `${i + 1}. @${p.username || ""} | topic=${p.topic_id} #${
            p.post_number
          }`,
          [
            kv("- post_id", p.id),
            kv("likes", p.like_count),
            kv("created_at", p.created_at),
          ]
            .filter(Boolean)
            .join(" | ")
            .replace(/^\s*\|\s*/, "- "),
          ex ? `- 摘要: ${ex}` : "",
          p.url ? `- 链接: ${p.url}` : "",
        ]);
      });

      const header = `【TOOL_RESULT discourse.listLatestPosts | before=${
        result?.before ?? "null"
      } | returned=${posts.length}】`;
      return clampCtx(header + "\n" + lines.join("\n\n"));
    }

    try {
      const text = JSON.stringify(result, null, 2);
      return clampCtx(`【TOOL_RESULT ${name} | fallback_json】\n` + text);
    } catch {
      return clampCtx(
        `【TOOL_RESULT ${name} | fallback_text】\n` + String(result)
      );
    }
  }

  /******************************************************************
   * 5) OpenAI Chat Completions 客户端（支持 Stop abort）
   ******************************************************************/
  function parseRetryAfterMs(responseHeaders) {
    try {
      const m = String(responseHeaders || "").match(
        /^\s*retry-after\s*:\s*([^\r\n]+)\s*$/im
      );
      if (!m) return null;
      const v = m[1].trim();
      if (/^\d+$/.test(v)) return parseInt(v, 10) * 1000;
      const t = Date.parse(v);
      if (!Number.isNaN(t)) {
        const ms = t - Date.now();
        return ms > 0 ? ms : 0;
      }
    } catch {}
    return null;
  }

  function gmRequestOnce({
    url,
    headers,
    bodyObj,
    timeoutMs = 30000,
    cancelToken,
  }) {
    return new Promise((resolve, reject) => {
      const req = GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: { "Content-Type": "application/json", ...(headers || {}) },
        data: JSON.stringify(bodyObj),
        timeout: timeoutMs,

        onload: (res) => resolve(res),
        onerror: (e) => reject(new Error(`网络错误: ${e?.error || e}`)),
        ontimeout: () => reject(new Error(`请求超时: ${timeoutMs}ms`)),
      });

      if (cancelToken) {
        cancelToken.aborts.push(() => {
          try {
            req.abort();
          } catch {}
        });
        if (cancelToken.cancelled) {
          try {
            req.abort();
          } catch {}
        }
      }
    });
  }

  async function gmPostJson(url, headers, bodyObj, opt = {}) {
    const {
      retries = 3,
      baseDelayMs = 400,
      maxDelayMs = 8000,
      timeoutMs = 30000,
      onlyStatus200 = true,
      cancelToken = null,
    } = opt;

    let lastErr;

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (cancelToken?.cancelled) throw new Error("Cancelled");

      try {
        const res = await gmRequestOnce({
          url,
          headers,
          bodyObj,
          timeoutMs,
          cancelToken,
        });

        const ok = onlyStatus200
          ? res.status === 200
          : res.status >= 200 && res.status < 300;
        if (!ok) {
          const headRetryMs = parseRetryAfterMs(res.responseHeaders);
          const bodyPreview = String(res.responseText || "").slice(0, 800);
          const err = new Error(`HTTP ${res.status}: ${bodyPreview}`);
          err._httpStatus = res.status;
          err._retryAfterMs = headRetryMs;
          throw err;
        }

        try {
          return JSON.parse(res.responseText);
        } catch {
          throw new Error("响应 JSON 解析失败");
        }
      } catch (e) {
        lastErr = e;
        if (attempt === retries) break;

        const ra = e?._retryAfterMs;
        const backoff = Math.min(
          maxDelayMs,
          baseDelayMs * Math.pow(2, attempt)
        );
        const jitter = Math.floor(Math.random() * 200);
        const waitMs = typeof ra === "number" ? ra : backoff + jitter;

        await sleep(waitMs);
        continue;
      }
    }

    throw lastErr || new Error("请求失败");
  }

  async function callOpenAIChat(messages, conf, cancelToken) {
    const base = String(conf.baseUrl || "").replace(/\/+$/, "");
    const url = base.endsWith("/chat/completions")
      ? base
      : base + "/chat/completions";

    const payload = {
      model: conf.model,
      temperature: conf.temperature ?? 0.2,
      messages,
    };

    const json = await gmPostJson(
      url,
      { Authorization: `Bearer ${conf.apiKey}` },
      payload,
      { retries: 3, onlyStatus200: true, cancelToken }
    );

    const text = json?.choices?.[0]?.message?.content ?? "";
    return String(text);
  }

  /******************************************************************
   * 6) JSON 修复逻辑（find / rfind + 回写 history）
   ******************************************************************/
  function parseModelJsonWithRepair(raw, sessionId, store) {
    const original = String(raw ?? "");

    try {
      const obj = JSON.parse(original);
      return { ok: true, obj, repaired: false, jsonText: original };
    } catch {}

    const first = original.indexOf("{");
    const last = original.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const sliced = original.slice(first, last + 1);

      store.updateLastAgent(
        sessionId,
        (m) => m && m.kind === "model_raw",
        (m) => ({
          ...m,
          kind: "model_json_repaired",
          content: sliced,
          repairedFrom: original,
        })
      );

      try {
        const obj = JSON.parse(sliced);
        return { ok: true, obj, repaired: true, jsonText: sliced };
      } catch (e) {
        return {
          ok: false,
          err: "切片后仍无法解析 JSON",
          detail: String(e?.message || e),
          sliced,
        };
      }
    }

    return {
      ok: false,
      err: "未找到可用的 JSON 对象边界 { ... }",
      detail: original.slice(0, 400),
    };
  }

  /******************************************************************
   * 7) Agent 引擎（FSM + 多轮工具调用）+ Stop 支持
   ******************************************************************/
function buildLLMMessagesFromSession(session, conf) {
  const msgs = [];
  msgs.push({
    role: "system",
    content: conf.systemPrompt + "\n\n" + TOOLS_SPEC,
  });

  const events = [];

  // 1) 用户/最终回复（你现在的 chat）
  for (const m of session.chat || []) {
    if (!m?.role || !m?.content) continue;
    events.push({
      ts: Number(m.ts || 0),
      role: m.role,
      content:  (m.role == "assistant") ? `${String(m.content)}。请使用正确json返回响应，此处仅为压缩上下文省略json` : String(m.content),
    });
  }

  // 2) 工具链路（你现在的 agent）
  if (conf.includeToolContext) {
    for (const a of session.agent || []) {
      if (!a?.content) continue;

      // ✅ 把模型“调用工具时输出的 JSON”也喂回去
      if (a.kind === "tool_call") {
        events.push({
          ts: Number(a.ts || 0),
          role: "assistant",
          // 给模型一个稳定、醒目的标记，避免跟普通对话混
          content: `【TOOL_CALL】\n${String(a.content)}`,
        });
      }

      // ✅ 工具结果：你之前只喂这个，而且还放错位置
      if (a.kind === "tool_context") {
        events.push({
          ts: Number(a.ts || 0),
          role: "user",
          content: `【TOOL_RESULT】\n${String(a.content)}`,
        });
      }

      // （可选）把解析修复后的 JSON 也喂回去，方便模型“知道自己最后被修复成啥”
      // if (a.kind === "model_json_repaired") {
      //   events.push({ ts: Number(a.ts || 0), role: "assistant", content: `【MODEL_JSON_REPAIRED】\n${String(a.content)}` });
      // }
    }
  }

  // ✅ 核心：按 ts 排序，保证时间线正确
  events.sort((x, y) => (x.ts || 0) - (y.ts || 0));

  // 3) 截断：从尾部开始保留到 maxContextChars（但保持顺序）
  const max = conf.maxContextChars || 24000;
  let total = 0;
  const kept = [];

  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    const len = (e.content || "").length;
    if (total + len > max) break;
    kept.push({ role: e.role, content: e.content });
    total += len;
  }
  kept.reverse();

  msgs.push(...kept);
  return msgs;
}

  async function runAgentTurn(sessionId, store, conf, ui, cancelToken) {
    const session = store.all().find((s) => s.id === sessionId);
    if (!session) throw new Error("session not found");
    if (cancelToken?.cancelled) throw new Error("Cancelled");

    store.setFSM(sessionId, {
      state: FSM.WAITING_MODEL,
      isRunning: true,
      step: (session.fsm?.step || 0) + 1,
      lastError: null,
    });
    ui?.renderAll?.();

    const llmMessages = buildLLMMessagesFromSession(session, conf);
    const raw = await callOpenAIChat(llmMessages, conf, cancelToken);

    if (cancelToken?.cancelled) throw new Error("Cancelled");

    store.pushAgent(sessionId, {
      role: "agent",
      kind: "model_raw",
      content: raw,
      ts: now(),
    });

    const parsed = parseModelJsonWithRepair(raw, sessionId, store);
    if (!parsed.ok) {
      store.pushAgent(sessionId, {
        role: "agent",
        kind: "model_parse_error",
        content: JSON.stringify(parsed, null, 2),
        ts: now(),
      });
      store.setFSM(sessionId, {
        state: FSM.ERROR,
        isRunning: false,
        lastError: parsed.err || "parse error",
      });
      ui?.renderAll?.();
      throw new Error(parsed.err || "模型 JSON 解析失败");
    }

    const obj = parsed.obj;

    if (obj.type === "final") {
      const answer = String(obj.answer ?? "").trim() || "(空回答)";

      let refsMd = "";
      if (Array.isArray(obj.refs) && obj.refs.length) {
        const seen = new Set();
        const cleaned = obj.refs
          .map((x) => ({
            title: mdEscapeText(String(x?.title ?? "").trim() || "链接"),
            url: String(x?.url ?? "").trim(),
          }))
          .filter((x) => x.url && !seen.has(x.url) && (seen.add(x.url), true));

        if (cleaned.length) {
          refsMd =
            "\n\n---\n**参考链接（refs）**\n" +
            cleaned
              .map((r, i) => `${i + 1}. [${r.title}](${r.url})`)
              .join("\n");
        }
      }

      const finalContent = answer + refsMd;
      store.pushChat(sessionId, {
        role: "assistant",
        content: finalContent,
        ts: now(),
      });

      if (Array.isArray(obj.refs) && obj.refs.length) {
        store.pushAgent(sessionId, {
          role: "agent",
          kind: "final_refs",
          content: JSON.stringify(obj.refs, null, 2),
          ts: now(),
        });
      }

      store.setFSM(sessionId, { state: FSM.DONE, isRunning: false });
      ui?.renderAll?.();
      return { done: true, obj };
    }

    if (obj.type === "tool") {
      const name = String(obj.name || "").trim();
      const args = obj.args || {};
      if (!name) throw new Error("工具调用缺少 name");

      store.setFSM(sessionId, { state: FSM.WAITING_TOOL, isRunning: true });
      store.pushAgent(sessionId, {
        role: "agent",
        kind: "tool_call",
content: JSON.stringify({ type: "tool", name, args }, null, 2),
        ts: now(),
      });
      ui?.renderAll?.();

      let result;
      try {
        result = await runTool(name, args, cancelToken);
      } catch (e) {
        const errMsg = `【TOOL_RESULT ERROR ${name}】\nargs=${JSON.stringify(
          args
        )}\nerror=${String(e?.message || e)}`;
        store.pushAgent(sessionId, {
          role: "tool",
          kind: "tool_context",
          content: errMsg,
          ts: now(),
          toolName: name,
        });

        store.setFSM(sessionId, { state: FSM.RUNNING, isRunning: true });
        ui?.renderAll?.();
        return { done: false, obj: { type: "tool_error" } };
      }

      const toolCtx = toolResultToContext(name, result);
      store.pushAgent(sessionId, {
        role: "tool",
        kind: "tool_context",
        content: toolCtx,
        ts: now(),
        toolName: name,
      });

      store.setFSM(sessionId, { state: FSM.RUNNING, isRunning: true });
      ui?.renderAll?.();
      return { done: false, obj: { type: "tool_ok" } };
    }

    store.pushAgent(sessionId, {
      role: "agent",
      kind: "model_unknown_type",
      content: JSON.stringify(obj, null, 2),
      ts: now(),
    });
    store.setFSM(sessionId, {
      state: FSM.ERROR,
      isRunning: false,
      lastError: "unknown type",
    });
    ui?.renderAll?.();
    throw new Error(`未知 type: ${obj.type}`);
  }

  async function runAgent(sessionId, store, conf, ui) {
    const session = store.all().find((s) => s.id === sessionId);
    if (!session) throw new Error("session not found");
    if (!conf.apiKey) throw new Error("请先在设置中填写 API Key");
    if (session.fsm?.isRunning) return;

    const cancelToken = ensureCancelToken(sessionId);
    cancelToken.cancelled = false;
    cancelToken.aborts = cancelToken.aborts || [];

    store.setFSM(sessionId, {
      state: FSM.RUNNING,
      isRunning: true,
      lastError: null,
    });
    ui?.renderAll?.();

    const maxTurns = Math.max(
      1,
      Math.min(10000, parseInt(conf.maxTurns || 8, 10))
    );

    try {
      for (let i = 0; i < maxTurns; i++) {
        if (cancelToken.cancelled) throw new Error("Cancelled");
        const r = await runAgentTurn(sessionId, store, conf, ui, cancelToken);
        if (r.done) {
          CANCEL.delete(sessionId);
          return r.obj;
        }
        await sleep(80);
      }
      store.setFSM(sessionId, {
        state: FSM.ERROR,
        isRunning: false,
        lastError: "超过 maxTurns 仍未 final",
      });
      ui?.renderAll?.();
      throw new Error("超过 maxTurns 仍未得到 final");
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg === "Cancelled") {
        store.pushAgent(sessionId, {
          role: "agent",
          kind: "cancelled",
          content: "用户点击 Stop 取消运行",
          ts: now(),
        });
        store.setFSM(sessionId, {
          state: FSM.IDLE,
          isRunning: false,
          lastError: null,
        });
        ui?.renderAll?.();
        CANCEL.delete(sessionId);
        return;
      }
      store.setFSM(sessionId, {
        state: FSM.ERROR,
        isRunning: false,
        lastError: msg,
      });
      ui?.renderAll?.();
      CANCEL.delete(sessionId);
      throw e;
    }
  }

  /******************************************************************
   * 8) Workbench UI（Chat/Tools/Debug Tabs + Stop + 过滤 + 折叠/复制/引用）
   ******************************************************************/
  const STYLES = `
    :root{
      --a-bg: linear-gradient(135deg, rgba(250,250,252,.98), rgba(245,247,252,.98));
      --a-card: rgba(255,255,255,.98);
      --a-text: #0e1116;
      --a-sub: #546376;
      --a-border: rgba(31,109,255,.12);
      --a-shadow: 0 20px 50px rgba(31,109,255,.12), 0 8px 16px rgba(0,0,0,.08);
      --a-primary: linear-gradient(135deg, #1f6dff, #4a8fff);
      --a-primary-hover: linear-gradient(135deg, #1557d6, #3d7ee6);
      --a-user: linear-gradient(135deg, #e8f0ff, #f0f6ff);
      --a-ass: linear-gradient(135deg, #ffffff, #fafbff);
      --a-tool: linear-gradient(135deg, #fff8db, #fffaed);
      --a-code:#0d1117;
      --a-codeText:#e6edf3;
      --a-danger: linear-gradient(135deg, #ff4757, #ff6b7a);
      --a-warn: linear-gradient(135deg, #ffa502, #ffb830);
      --a-success: linear-gradient(135deg, #26de81, #20e3b2);
      --a-glow: rgba(31,109,255,.25);
    }

    /* 深色主题变量（用于手动切换和系统深色模式） */
    @media (prefers-color-scheme: dark){
      :root:not([data-theme="light"]){
        --a-bg: linear-gradient(135deg, rgba(16,18,24,.96), rgba(20,22,28,.96));
        --a-card: linear-gradient(135deg, rgba(28,30,38,.95), rgba(25,27,36,.95));
        --a-text: #e8ecf1;
        --a-sub: #adb5c7;
        --a-border: rgba(106,162,255,.15);
        --a-shadow: 0 24px 60px rgba(0,0,0,.7), 0 10px 20px rgba(106,162,255,.08);
        --a-primary: linear-gradient(135deg, #6aa2ff, #5a8fee);
        --a-primary-hover: linear-gradient(135deg, #7db0ff, #6a98ff);
        --a-user: linear-gradient(135deg, #1f2736, #252d3e);
        --a-ass: linear-gradient(135deg, #1a1e28, #1d212b);
        --a-tool: linear-gradient(135deg, #2d3340, #32394a);
        --a-code:#0d1117;
        --a-codeText:#c9d1d9;
        --a-danger: linear-gradient(135deg, #ff6b7a, #ff8593);
        --a-warn: linear-gradient(135deg, #ffb830, #ffc648);
        --a-success: linear-gradient(135deg, #20e3b2, #29ffc6);
        --a-glow: rgba(106,162,255,.3);
      }
    }

    /* 强制深色主题 */
    :root[data-theme="dark"]{
      --a-bg: linear-gradient(135deg, rgba(16,18,24,.96), rgba(20,22,28,.96));
      --a-card: linear-gradient(135deg, rgba(28,30,38,.95), rgba(25,27,36,.95));
      --a-text: #e8ecf1;
      --a-sub: #adb5c7;
      --a-border: rgba(106,162,255,.15);
      --a-shadow: 0 24px 60px rgba(0,0,0,.7), 0 10px 20px rgba(106,162,255,.08);
      --a-primary: linear-gradient(135deg, #6aa2ff, #5a8fee);
      --a-primary-hover: linear-gradient(135deg, #7db0ff, #6a98ff);
      --a-user: linear-gradient(135deg, #1f2736, #252d3e);
      --a-ass: linear-gradient(135deg, #1a1e28, #1d212b);
      --a-tool: linear-gradient(135deg, #2d3340, #32394a);
      --a-code:#0d1117;
      --a-codeText:#c9d1d9;
      --a-danger: linear-gradient(135deg, #ff6b7a, #ff8593);
      --a-warn: linear-gradient(135deg, #ffb830, #ffc648);
      --a-success: linear-gradient(135deg, #20e3b2, #29ffc6);
      --a-glow: rgba(106,162,255,.3);
    }

    /* ✅ FAB */
    #${APP_PREFIX}fab{
      position:fixed;
      left: calc(100vw - 70px);
      top: 16px;
      width:48px; height:48px; border-radius:18px;
      background: var(--a-card);
      border:2px solid var(--a-border);
      box-shadow: var(--a-shadow);
      z-index:100003;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; user-select:none;
      background: var(--a-primary);
      color: #fff;
      font-weight:900;
      font-size:18px;
      touch-action: none;
      transition: all .3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #${APP_PREFIX}fab:hover{
      transform: translateY(-4px) scale(1.08);
      box-shadow: 0 28px 65px rgba(31,109,255,.25), 0 12px 20px rgba(0,0,0,.15);
      filter: brightness(1.1);
    }
    #${APP_PREFIX}fab.dragging{
      cursor: grabbing;
      transform: scale(1.12) rotate(8deg);
      filter: brightness(1.15);
    }
    #${APP_PREFIX}fab .dot{
      position:absolute;    right: 3px;
    top: 0px;
      width:12px; height:12px; border-radius:999px;
      background: transparent; border:2px solid transparent;
      transition: all .3s ease;
    }
    #${APP_PREFIX}fab.running .dot{
      background: var(--a-warn);
      border-color: #fff;
      box-shadow: 0 0 12px var(--a-warn), 0 0 24px var(--a-warn);
      animation: pulse-dot 1.5s ease-in-out infinite;
    }
    #${APP_PREFIX}fab.error .dot{
      background: var(--a-danger);
      border-color: #fff;
      box-shadow: 0 0 12px var(--a-danger);
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.8; }
    }

    /* Drawer：响应式，不再 min-width:1000px */
    #${APP_PREFIX}drawer{
      position:fixed; left:0; right:0; top:-85vh; height:82vh;
      z-index:100002;
      background: var(--a-bg);
      border-bottom:2px solid var(--a-border);
      box-shadow: var(--a-shadow);
      border-bottom-left-radius:24px;
      border-bottom-right-radius:24px;
      transition: top .45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .3s ease;
      backdrop-filter: blur(20px) saturate(180%);
      display:flex; flex-direction:column;
      color: var(--a-text);
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
      overflow:hidden;
    }
    #${APP_PREFIX}drawer.open{
      top:0;
      box-shadow: 0 28px 80px rgba(0,0,0,.3), 0 0 0 1px var(--a-border);
    }

    .${APP_PREFIX}header{
      padding:16px 20px;
      border-bottom:2px solid var(--a-border);
      display:flex; align-items:center; justify-content:space-between;
      background: radial-gradient(1400px 180px at 20% 0%, var(--a-glow), transparent 65%);
      flex-shrink:0;
      gap:12px;
      position: relative;
    }
    .${APP_PREFIX}header::after{
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--a-primary);
      opacity: .15;
    }
    .${APP_PREFIX}title{
      font-weight:900; letter-spacing:.2px;
      display:flex; align-items:center; gap:10px;
      color: var(--a-primary);
      min-width: 240px;
      flex-wrap: wrap;
    }
    .${APP_PREFIX}badge{
      font-size:12px; padding:3px 8px; border-radius:999px;
      border:1px solid var(--a-border);
      color: var(--a-sub);
      font-weight:800;
    }
    .${APP_PREFIX}actions{ display:flex; align-items:center; gap:8px; color:var(--a-sub); flex-wrap: wrap; justify-content:flex-end; }
    .${APP_PREFIX}icon{
      cursor:pointer; padding:9px 12px; border-radius:12px;
      border:1.5px solid var(--a-border);
      background: rgba(127,127,127,.04);
      color: var(--a-text);
      font-weight:900;
      white-space: nowrap;
      transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .${APP_PREFIX}icon::before{
      content: '';
      position: absolute;
      inset: 0;
      background: var(--a-primary);
      opacity: 0;
      transition: opacity .25s ease;
    }
    .${APP_PREFIX}icon:hover{
      border-color: transparent;
      background: var(--a-primary);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px var(--a-glow);
    }

    .${APP_PREFIX}pill{
      font-size:12px; font-weight:900;
      padding:6px 10px; border-radius:999px;
      border:1px solid var(--a-border);
      background: rgba(127,127,127,.06);
      color: var(--a-text);
      display:flex; gap:8px; align-items:center;
      max-width: 48vw;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .${APP_PREFIX}pill .st{ color: var(--a-primary); }
    .${APP_PREFIX}pill .err{ color: var(--a-danger); }

    .${APP_PREFIX}tabs{
      display:flex; align-items:center; gap:6px;
      border:1.5px solid var(--a-border);
      background: rgba(127,127,127,.05);
      padding:5px;
      border-radius: 999px;
    }
    .${APP_PREFIX}tab{
      padding:8px 14px; border-radius:999px;
      cursor:pointer; user-select:none;
      font-weight:900; font-size:13px;
      color: var(--a-sub);
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .${APP_PREFIX}tab:hover{
      color: var(--a-text);
      transform: translateY(-1px);
    }
    .${APP_PREFIX}tab.active{
      background: var(--a-primary);
      border:none;
      color: #fff;
      box-shadow: 0 4px 12px var(--a-glow), inset 0 1px 2px rgba(255,255,255,.2);
      transform: scale(1.05);
    }

    .${APP_PREFIX}body{ flex:1; display:flex; min-height:0; }
    .${APP_PREFIX}sidebar{
      width: 300px;
      border-right:1px solid var(--a-border);
      padding:10px;
      overflow:auto;
      background: linear-gradient(180deg, rgba(127,127,127,.07), transparent);
      flex-shrink:0;
      transition: width .2s ease;
    }
    .${APP_PREFIX}sidebar.collapsed{ width: 0; padding: 0; border-right:0; overflow:hidden; }
    .${APP_PREFIX}sideTop{ display:flex; gap:8px; margin-bottom:10px; align-items:center; }
    .${APP_PREFIX}btn{
      border:none; cursor:pointer; border-radius:12px;
      padding:10px 18px; font-weight:900;
      background: var(--a-primary); color:#fff;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(31,109,255,.2);
      position: relative;
      overflow: hidden;
    }
    .${APP_PREFIX}btn::before{
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,.2);
      transform: translate(-50%, -50%);
      transition: width .5s, height .5s;
    }
    .${APP_PREFIX}btn:hover{
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(31,109,255,.35);
      background: var(--a-primary-hover);
    }
    .${APP_PREFIX}btn:hover::before{
      width: 300px;
      height: 300px;
    }
    .${APP_PREFIX}btn:active{
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(31,109,255,.2);
    }
    .${APP_PREFIX}btnGhost{
      background: transparent; color: var(--a-text);
      border:1px solid var(--a-border);
      font-weight:900;
    }
    .${APP_PREFIX}btnDanger{
      background: transparent; color: var(--a-danger);
      border:1px solid rgba(226,59,59,.55);
      font-weight:900;
    }

    .${APP_PREFIX}filter{
      width:100%; box-sizing:border-box;
      border-radius:12px;
      border:1px solid var(--a-border);
      padding:9px 10px;
      background: rgba(127,127,127,.08);
      color: var(--a-text);
      outline:none;
      font-weight:800;
      margin-bottom:10px;
    }

    .${APP_PREFIX}sessions{ display:flex; flex-direction:column; gap:10px; }
    .${APP_PREFIX}session{
      border:1.5px solid var(--a-border);
      border-radius:16px;
      padding:12px 14px;
      background: var(--a-card);
      display:flex; justify-content:space-between; align-items:center; gap:8px;
      cursor:pointer;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .${APP_PREFIX}session::before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--a-primary);
      opacity: 0;
      transition: opacity .3s ease;
    }
    .${APP_PREFIX}session:hover{
      border-color: var(--a-primary);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,.08);
    }
    .${APP_PREFIX}session.active{
      border-color: transparent;
      background: var(--a-primary);
      background: linear-gradient(135deg, rgba(31,109,255,.12), rgba(74,143,255,.08));
      box-shadow: 0 4px 16px var(--a-glow), inset 0 0 0 2px var(--a-border);
    }
    .${APP_PREFIX}session.active::before{
      opacity: 1;
    }
    .${APP_PREFIX}session .t{
      max-width: 170px;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      font-weight:900; color: var(--a-text);
    }
    .${APP_PREFIX}session .s{
      font-size:12px; color: var(--a-sub); font-weight:800;
    }
    .${APP_PREFIX}ops{ display:flex; gap:6px; }
    .${APP_PREFIX}op{
      padding:6px 8px; border-radius:10px; border:1px solid var(--a-border);
      background: rgba(127,127,127,.06);
      cursor:pointer; user-select:none; font-weight:900;
    }
    .${APP_PREFIX}op:hover{ border-color: var(--a-primary); }

    .${APP_PREFIX}main{ flex:1; display:flex; flex-direction:column; min-width:0; }
    .${APP_PREFIX}panel{
      flex:1; overflow:auto; padding: 18px 22px;
      line-height:1.75; font-size:15px;
      display:none;
      width: 100%;
      box-sizing: border-box;
    }
    .${APP_PREFIX}panel.active{ display:flex; flex-direction:column; align-items:center; }

    .${APP_PREFIX}msg{
      width: 100%;
      max-width: 1200px;
      margin: 12px auto;
      padding: 16px 20px;
      border:1.5px solid var(--a-border);
      border-radius:16px;
      background: rgba(127,127,127,.06);
      color: var(--a-text);
      position: relative;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
    }
    .${APP_PREFIX}msg:hover{
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,.08);
    }
    .${APP_PREFIX}msg.user{
      background: var(--a-user);
      border-color: rgba(31,109,255,.35);
      box-shadow: 0 2px 8px rgba(31,109,255,.1);
    }
    .${APP_PREFIX}msg.assistant{
      background: var(--a-ass);
      box-shadow: 0 2px 8px rgba(0,0,0,.06);
    }
    .${APP_PREFIX}msg.tool{
      background: var(--a-tool);
      border-style:dashed;
      border-width: 2px;
    }

    .${APP_PREFIX}meta{
      font-size:12px; color: var(--a-sub);
      display:flex; align-items:center; gap:10px; margin-bottom:6px;
      font-weight:800;
      justify-content: space-between;
    }
    .${APP_PREFIX}mleft{ display:flex; align-items:center; gap:10px; min-width:0; }
    .${APP_PREFIX}mright{ display:flex; align-items:center; gap:6px; flex-shrink:0; }
    .${APP_PREFIX}mini{
      padding:6px 10px; border-radius:10px;
      border:1px solid var(--a-border);
      background: rgba(127,127,127,.06);
      cursor:pointer; user-select:none;
      font-weight:900; font-size:12px;
      color: var(--a-text);
      transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .${APP_PREFIX}mini:hover{
      border-color: var(--a-primary);
      background: var(--a-primary);
      color: #fff;
      transform: scale(1.08);
      box-shadow: 0 4px 8px var(--a-glow);
    }

    .${APP_PREFIX}md a{ color: var(--a-primary); text-decoration: underline; text-underline-offset:2px; }
    .${APP_PREFIX}md code{ background: rgba(127,127,127,.16); padding: 2px 6px; border-radius: 6px; }
    .${APP_PREFIX}md pre{
      background: var(--a-code); color: var(--a-codeText);
      padding: 12px; border-radius:12px; overflow:auto;
      border:1px solid rgba(255,255,255,.10);
    }

    .${APP_PREFIX}collapsed .${APP_PREFIX}md{
      max-height: 210px;
      overflow: hidden;
      mask-image: linear-gradient(180deg, rgba(0,0,0,1) 60%, rgba(0,0,0,0));
    }
    .${APP_PREFIX}moreHint{
      font-size:12px; color: var(--a-sub);
      margin-top:8px; font-weight:900;
    }

    .${APP_PREFIX}composer{
      border-top:1px solid var(--a-border);
      padding:10px;
      display:flex; gap:10px; align-items:flex-end;
      background: rgba(127,127,127,.06);
      flex-shrink:0;
    }
    .${APP_PREFIX}ta{
      flex:1;
      min-height:80px; max-height:200px;
      resize:none;
      border-radius:16px;
      border:2px solid var(--a-border);
      padding:14px 18px;
      background: rgba(255,255,255,.92);
      color: var(--a-text);
      outline:none;
      font-weight:800;
      font-size:15px;
      line-height:1.6;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: inset 0 2px 6px rgba(0,0,0,.04);
    }
    .${APP_PREFIX}ta:focus{
      border-color: var(--a-primary);
      box-shadow: 0 0 0 4px var(--a-glow), inset 0 2px 6px rgba(0,0,0,.04);
      transform: translateY(-1px);
    }

    /* 强制浅色主题的输入框样式 */
    :root[data-theme="light"] .${APP_PREFIX}ta{
      background: rgba(255,255,255,.92);
      box-shadow: inset 0 2px 6px rgba(0,0,0,.04);
    }
    :root[data-theme="light"] .${APP_PREFIX}ta:focus{
      box-shadow: 0 0 0 4px var(--a-glow), inset 0 2px 6px rgba(0,0,0,.04);
    }

    /* 深色主题的输入框样式 */
    @media (prefers-color-scheme: dark){
      :root:not([data-theme="light"]) .${APP_PREFIX}ta{
        background: rgba(18,20,27,.92);
        box-shadow: inset 0 2px 6px rgba(0,0,0,.2);
      }
      :root:not([data-theme="light"]) .${APP_PREFIX}ta:focus{
        box-shadow: 0 0 0 4px var(--a-glow), inset 0 2px 6px rgba(0,0,0,.2);
      }
    }

    /* 强制深色主题的输入框样式 */
    :root[data-theme="dark"] .${APP_PREFIX}ta{
      background: rgba(18,20,27,.92);
      box-shadow: inset 0 2px 6px rgba(0,0,0,.2);
    }
    :root[data-theme="dark"] .${APP_PREFIX}ta:focus{
      box-shadow: 0 0 0 4px var(--a-glow), inset 0 2px 6px rgba(0,0,0,.2);
    }

    .${APP_PREFIX}overlay{
      position:fixed; inset:0;
      background: rgba(0,0,0,.6);
      backdrop-filter: blur(4px);
      z-index:100004;
      display:none;
      align-items:center;
      justify-content:center;
    }
    .${APP_PREFIX}overlay.open{ display:flex; }
    .${APP_PREFIX}modal{
      width: 620px; max-width: 92vw;
      border-radius: 16px;
      border:1px solid var(--a-border);
      background: var(--a-card);
      box-shadow: var(--a-shadow);
      padding: 18px;
      color: var(--a-text);
    }
    .${APP_PREFIX}formRow{ margin: 10px 0; }
    .${APP_PREFIX}formRow label{ display:block; font-size:13px; font-weight:900; color:var(--a-sub); margin-bottom:6px; }
    .${APP_PREFIX}formRow input, .${APP_PREFIX}formRow textarea, .${APP_PREFIX}formRow select{
      width:100%; box-sizing:border-box;
      border-radius: 12px;
      border:1px solid var(--a-border);
      padding: 10px 12px;
      background: rgba(127,127,127,.08);
      color: var(--a-text);
      outline:none;
      font-weight:800;
    }
    .${APP_PREFIX}formActions{ display:flex; justify-content:flex-end; gap:10px; margin-top: 12px; flex-wrap:wrap; }

    #${APP_PREFIX}toast{
      position:fixed; right: 90px; top: 72px;
      z-index:100005;
      background: linear-gradient(135deg, rgba(0,0,0,.88), rgba(20,20,20,.85));
      color:#fff;
      padding: 10px 16px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.1);
      opacity:0;
      pointer-events:none;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight:900;
      font-size: 13px;
      max-width: 60vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 24px rgba(0,0,0,.3);
    }
    #${APP_PREFIX}toast.show{
      opacity:1;
      transform: translateY(-4px);
    }

    /* Scroll-to-bottom button */
    #${APP_PREFIX}toBottom{
      position: absolute;
    right: 24px;
    bottom: 120px;
      z-index: 10;
      display:none;
    }
    #${APP_PREFIX}toBottom.show{ display:block; }

    /* Tools/Debug panels */
    .${APP_PREFIX}toolGrid{
      max-width: 980px;
      display:flex; flex-direction:column; gap:12px;
    }
    .${APP_PREFIX}toolCard{
      border:1px solid var(--a-border);
      border-radius:14px;
      background: var(--a-card);
      padding:12px;
    }
    .${APP_PREFIX}toolRow{ display:flex; gap:10px; flex-wrap:wrap; }
    .${APP_PREFIX}toolRow > *{ flex: 1; min-width: 180px; }
    .${APP_PREFIX}toolOut{
      margin-top:10px;
      border:1px dashed var(--a-border);
      border-radius: 12px;
      padding:10px;
      background: rgba(127,127,127,.06);
      white-space: pre-wrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size:12px;
      line-height:1.6;
      max-height: 380px;
      overflow:auto;
    }
    .${APP_PREFIX}logList{ max-width:980px; }
    .${APP_PREFIX}logItem{
      border:1px solid var(--a-border);
      border-radius:14px;
      background: var(--a-card);
      margin:10px 0;
      overflow:hidden;
    }
    .${APP_PREFIX}logHead{
      padding:10px 12px;
      display:flex; gap:10px; align-items:center; justify-content:space-between;
      cursor:pointer;
      user-select:none;
      font-weight:900;
      color: var(--a-text);
      background: rgba(127,127,127,.06);
    }
    .${APP_PREFIX}logBody{
      padding:10px 12px;
      display:none;
    }
    .${APP_PREFIX}logItem.open .${APP_PREFIX}logBody{ display:block; }
    .${APP_PREFIX}logBody pre{
      margin:0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size:12px;
      line-height:1.6;
      background: rgba(127,127,127,.06);
      border:1px dashed var(--a-border);
      padding:10px;
      border-radius:12px;
      overflow:auto;
      max-height: 420px;
    }

    /* Small screens: auto collapse sidebar */
    @media (max-width: 860px){
      .${APP_PREFIX}sidebar{ width: 0; padding: 0; border-right:0; overflow:hidden; }
    }
  `;

  const DEFAULT_UI = {
    tab: "chat",
    sidebarCollapsed: false,
    debugFilter: { tool: true, agent: true, errors: true },
  };

  class UI {
    constructor(store, confStore) {
      this.store = store;
      this.confStore = confStore;
      this.isSending = false;
      this.debugVisible = false; // legacy toggle (kept), but debug is now in tab
      this.toolsState = {
        lastName: "discourse.search",
        lastArgs: { q: "linux", page: 1, limit: 8 },
        lastResult: "",
      };
      this._uiState = {
        ...DEFAULT_UI,
        ...(GM_getValue(STORE_KEYS.UI, null) || {}),
      };

      // 初始化主题
      this.theme = GM_getValue(STORE_KEYS.THEME, "auto");
      this._applyTheme();

      this._injectStyle();
      this._renderShell();
      this._applyFabPosFromStore();
      this._bind();
      this._bindFabDrag();
      this.renderAll();

      GM_registerMenuCommand("打开 Linux.do Agent", () =>
        this.toggleDrawer(true)
      );
      GM_registerMenuCommand("清空当前会话", () => {
        const s = this.store.active();
        if (confirm(`确定清空会话「${s.title}」吗？`)) {
          this.store.clearSession(s.id);
          this.renderAll();
          this.toast("已清空");
        }
      });
    }

    _saveUIState(patch) {
      this._uiState = { ...this._uiState, ...(patch || {}) };
      GM_setValue(STORE_KEYS.UI, this._uiState);
    }

    _injectStyle() {
      const el = document.createElement("style");
      el.textContent = STYLES;
      document.head.appendChild(el);
    }

    _renderShell() {
      const fab = document.createElement("div");
      fab.id = `${APP_PREFIX}fab`;
      fab.innerHTML = `AG<div class="dot"></div>`;
      fab.title = "Linux.do Agent（可拖动）";
      document.body.appendChild(fab);

      const drawer = document.createElement("div");
      drawer.id = `${APP_PREFIX}drawer`;
      drawer.innerHTML = `
        <div class="${APP_PREFIX}header">
          <div class="${APP_PREFIX}title">
            Linux.do Agent <span class="${APP_PREFIX}badge">Workbench UI</span>
            <span class="${APP_PREFIX}pill" id="${APP_PREFIX}statusPill" title="">
              <span class="st">IDLE</span>
              <span id="${APP_PREFIX}statusStep"></span>
              <span class="err" id="${APP_PREFIX}statusErr"></span>
            </span>
          </div>
          <div class="${APP_PREFIX}actions">
            <div class="${APP_PREFIX}tabs" id="${APP_PREFIX}tabs">
              <div class="${APP_PREFIX}tab" data-tab="chat">Chat</div>
              <div class="${APP_PREFIX}tab" data-tab="tools">Tools</div>
              <div class="${APP_PREFIX}tab" data-tab="debug">Debug</div>
            </div>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnStop" title="停止当前运行">Stop</button>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnTheme" title="切换主题">🌓</button>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnSetting">设置</button>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnToggleSide" title="折叠侧栏">侧栏</button>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnClose">收起</button>
          </div>
        </div>

        <div class="${APP_PREFIX}body">
          <div class="${APP_PREFIX}sidebar" id="${APP_PREFIX}sidebar">
            <div class="${APP_PREFIX}sideTop">
              <button class="${APP_PREFIX}btn" id="${APP_PREFIX}btnNew">新建</button>
              <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}btnExport">导出</button>
            </div>
            <input class="${APP_PREFIX}filter" id="${APP_PREFIX}sessionFilter" placeholder="过滤会话（标题）" />
            <div class="${APP_PREFIX}sessions" id="${APP_PREFIX}sessions"></div>
          </div>

          <div class="${APP_PREFIX}main">
            <div class="${APP_PREFIX}panel active" id="${APP_PREFIX}panelChat">
              <div id="${APP_PREFIX}chat"></div>
              <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}toBottom">⬇ 跳到最新</button>
            </div>

            <div class="${APP_PREFIX}panel" id="${APP_PREFIX}panelTools">
              <div class="${APP_PREFIX}toolGrid" id="${APP_PREFIX}toolsWrap"></div>
            </div>

            <div class="${APP_PREFIX}panel" id="${APP_PREFIX}panelDebug">
              <div style="max-width:980px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                <label style="font-weight:900;color:var(--a-sub);"><input type="checkbox" id="${APP_PREFIX}dbgTool" checked> tool</label>
                <label style="font-weight:900;color:var(--a-sub);"><input type="checkbox" id="${APP_PREFIX}dbgAgent" checked> agent</label>
                <label style="font-weight:900;color:var(--a-sub);"><input type="checkbox" id="${APP_PREFIX}dbgErr" checked> errors</label>
                <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}dbgExpandAll">全部展开</button>
                <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}dbgCollapseAll">全部折叠</button>
              </div>
              <div class="${APP_PREFIX}logList" id="${APP_PREFIX}debugWrap"></div>
            </div>

            <div class="${APP_PREFIX}composer" id="${APP_PREFIX}composer">
              <textarea class="${APP_PREFIX}ta" id="${APP_PREFIX}ta" placeholder="输入问题：例如"总结某话题""搜索某关键词""查看@某用户概览/热门帖子""列出最新话题/最新帖子/Top话题/某tag话题""抓取某话题第N楼全文"等"></textarea>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <button class="${APP_PREFIX}btn" id="${APP_PREFIX}btnSend">发送</button>
                <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}btnResume">恢复</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      const overlay = document.createElement("div");
      overlay.className = `${APP_PREFIX}overlay`;
      overlay.innerHTML = `
        <div class="${APP_PREFIX}modal">
          <h3 style="margin:0 0 10px 0;">⚙️ 设置（OpenAI Chat 格式）</h3>

          <div class="${APP_PREFIX}formRow">
            <label>Base URL</label>
            <input id="${APP_PREFIX}cfgBaseUrl" placeholder="https://api.openai.com/v1" />
          </div>
          <div class="${APP_PREFIX}formRow">
            <label>Model</label>
            <input id="${APP_PREFIX}cfgModel" placeholder="gpt-4o-mini" />
          </div>
          <div class="${APP_PREFIX}formRow">
            <label>API Key</label>
            <input id="${APP_PREFIX}cfgKey" type="password" placeholder="sk-..." />
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:160px;">
              <label>Temperature (0-1)</label>
              <input id="${APP_PREFIX}cfgTemp" type="number" step="0.05" min="0" max="1" />
            </div>
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:160px;">
              <label>maxTurns</label>
              <input id="${APP_PREFIX}cfgMaxTurns" type="number" step="1" min="1" max="30" />
            </div>
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:200px;">
              <label>maxContextChars</label>
              <input id="${APP_PREFIX}cfgMaxCtx" type="number" step="500" min="4000" max="80000" />
            </div>
          </div>

          <div class="${APP_PREFIX}formRow">
            <label>System Prompt</label>
            <textarea id="${APP_PREFIX}cfgSys" rows="6"></textarea>
          </div>

          <div style="display:flex;align-items:center;gap:8px;">
            <label style="font-weight:900;color:var(--a-text);">
              <input type="checkbox" id="${APP_PREFIX}cfgToolCtx" />
              将工具结果作为上下文喂给模型
            </label>
          </div>

          <div class="${APP_PREFIX}formActions">
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}cfgCancel">取消</button>
            <button class="${APP_PREFIX}btn" id="${APP_PREFIX}cfgSave">保存</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const toast = document.createElement("div");
      toast.id = `${APP_PREFIX}toast`;
      document.body.appendChild(toast);

      this.dom = {
        fab,
        drawer,
        overlay,
        toast,

        btnClose: drawer.querySelector(`#${APP_PREFIX}btnClose`),
        btnSetting: drawer.querySelector(`#${APP_PREFIX}btnSetting`),
        btnToggleSide: drawer.querySelector(`#${APP_PREFIX}btnToggleSide`),
        btnStop: drawer.querySelector(`#${APP_PREFIX}btnStop`),
        btnTheme: drawer.querySelector(`#${APP_PREFIX}btnTheme`),

        tabs: drawer.querySelector(`#${APP_PREFIX}tabs`),
        statusPill: drawer.querySelector(`#${APP_PREFIX}statusPill`),
        statusStep: drawer.querySelector(`#${APP_PREFIX}statusStep`),
        statusErr: drawer.querySelector(`#${APP_PREFIX}statusErr`),

        sidebar: drawer.querySelector(`#${APP_PREFIX}sidebar`),
        sessionFilter: drawer.querySelector(`#${APP_PREFIX}sessionFilter`),
        sessions: drawer.querySelector(`#${APP_PREFIX}sessions`),

        panelChat: drawer.querySelector(`#${APP_PREFIX}panelChat`),
        panelTools: drawer.querySelector(`#${APP_PREFIX}panelTools`),
        panelDebug: drawer.querySelector(`#${APP_PREFIX}panelDebug`),

        chat: drawer.querySelector(`#${APP_PREFIX}chat`),
        toBottom: drawer.querySelector(`#${APP_PREFIX}toBottom`),

        toolsWrap: drawer.querySelector(`#${APP_PREFIX}toolsWrap`),

        dbgTool: drawer.querySelector(`#${APP_PREFIX}dbgTool`),
        dbgAgent: drawer.querySelector(`#${APP_PREFIX}dbgAgent`),
        dbgErr: drawer.querySelector(`#${APP_PREFIX}dbgErr`),
        dbgExpandAll: drawer.querySelector(`#${APP_PREFIX}dbgExpandAll`),
        dbgCollapseAll: drawer.querySelector(`#${APP_PREFIX}dbgCollapseAll`),
        debugWrap: drawer.querySelector(`#${APP_PREFIX}debugWrap`),

        composer: drawer.querySelector(`#${APP_PREFIX}composer`),
        ta: drawer.querySelector(`#${APP_PREFIX}ta`),
        btnSend: drawer.querySelector(`#${APP_PREFIX}btnSend`),
        btnResume: drawer.querySelector(`#${APP_PREFIX}btnResume`),
        btnNew: drawer.querySelector(`#${APP_PREFIX}btnNew`),
        btnExport: drawer.querySelector(`#${APP_PREFIX}btnExport`),

        cfgBaseUrl: overlay.querySelector(`#${APP_PREFIX}cfgBaseUrl`),
        cfgModel: overlay.querySelector(`#${APP_PREFIX}cfgModel`),
        cfgKey: overlay.querySelector(`#${APP_PREFIX}cfgKey`),
        cfgTemp: overlay.querySelector(`#${APP_PREFIX}cfgTemp`),
        cfgMaxTurns: overlay.querySelector(`#${APP_PREFIX}cfgMaxTurns`),
        cfgMaxCtx: overlay.querySelector(`#${APP_PREFIX}cfgMaxCtx`),
        cfgSys: overlay.querySelector(`#${APP_PREFIX}cfgSys`),
        cfgToolCtx: overlay.querySelector(`#${APP_PREFIX}cfgToolCtx`),
        cfgCancel: overlay.querySelector(`#${APP_PREFIX}cfgCancel`),
        cfgSave: overlay.querySelector(`#${APP_PREFIX}cfgSave`),
      };
    }

    _applyFabPosFromStore() {
      const p = GM_getValue(STORE_KEYS.FABPOS, null);
      const pos = typeof p === "string" ? safeJsonParse(p, null) : p;

      if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
        const { x, y } = this._clampFabPos(pos.x, pos.y);
        this.dom.fab.style.left = `${x}px`;
        this.dom.fab.style.top = `${y}px`;
      } else {
        // 使用实际元素尺寸而不是硬编码
        const w = this.dom.fab.offsetWidth || 58;
        const margin = 18;
        const x = Math.max(margin, window.innerWidth - w - margin);
        const y = 16;
        this.dom.fab.style.left = `${x}px`;
        this.dom.fab.style.top = `${y}px`;
        // 保存初始位置
        this._saveFabPos(x, y);
      }
    }

    _saveFabPos(x, y) {
      GM_setValue(STORE_KEYS.FABPOS, { x, y });
    }

    _clampFabPos(x, y) {
      const w = this.dom.fab.offsetWidth || 58;
      const h = this.dom.fab.offsetHeight || 58;
      const margin = 8;
      const maxX = Math.max(margin, window.innerWidth - w - margin);
      const maxY = Math.max(margin, window.innerHeight - h - margin);
      return {
        x: Math.max(margin, Math.min(maxX, x)),
        y: Math.max(margin, Math.min(maxY, y)),
      };
    }

    _bindFabDrag() {
      const fab = this.dom.fab;
      let dragging = false;
      let moved = false;
      let startX = 0,
        startY = 0;
      let origLeft = 0,
        origTop = 0;
      let pointerId = null;

      const getLeftTop = () => {
        const r = fab.getBoundingClientRect();
        return { left: r.left, top: r.top };
      };

      const onPointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (dragging) return; // 防止重复触发

        dragging = true;
        moved = false;
        pointerId = e.pointerId;
        fab.classList.add("dragging");

        const lt = getLeftTop();
        origLeft = lt.left;
        origTop = lt.top;

        startX = e.clientX;
        startY = e.clientY;

        try {
          fab.setPointerCapture(e.pointerId);
        } catch {}
        e.preventDefault();
        e.stopPropagation();
      };

      const onPointerMove = (e) => {
        if (!dragging || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // 检测是否真的移动了（增加阈值）
        if (!moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          moved = true;
        }

        if (moved) {
          const nx = origLeft + dx;
          const ny = origTop + dy;
          const clamped = this._clampFabPos(nx, ny);

          fab.style.left = `${clamped.x}px`;
          fab.style.top = `${clamped.y}px`;
        }

        e.preventDefault();
        e.stopPropagation();
      };

      const onPointerUp = (e) => {
        if (!dragging || e.pointerId !== pointerId) return;

        dragging = false;
        fab.classList.remove("dragging");

        if (moved) {
          // 只有在拖动后才保存位置
          const lt = getLeftTop();
          const clamped = this._clampFabPos(lt.left, lt.top);
          fab.style.left = `${clamped.x}px`;
          fab.style.top = `${clamped.y}px`;
          this._saveFabPos(clamped.x, clamped.y);
        } else {
          // 只有在没有移动时才触发点击
          this.toggleDrawer();
        }

        try {
          fab.releasePointerCapture(e.pointerId);
        } catch {}

        pointerId = null;
        e.preventDefault();
        e.stopPropagation();
      };

      const onResize = () => {
        if (dragging) return; // 拖动时不触发resize调整
        const lt = getLeftTop();
        const clamped = this._clampFabPos(lt.left, lt.top);
        fab.style.left = `${clamped.x}px`;
        fab.style.top = `${clamped.y}px`;
        this._saveFabPos(clamped.x, clamped.y);
      };

      fab.addEventListener("pointerdown", onPointerDown, { passive: false });
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp, { passive: false });
      window.addEventListener("resize", onResize);
    }

    _bind() {
      const d = this.dom;

      d.btnClose.addEventListener("click", () => this.toggleDrawer(false));

      // 主题切换
      d.btnTheme.addEventListener("click", () => this._toggleTheme());

      d.btnSetting.addEventListener("click", () => {
        this.loadConfToUI();
        this.dom.overlay.classList.add("open");
      });
      d.cfgCancel.addEventListener("click", () =>
        this.dom.overlay.classList.remove("open")
      );
      d.cfgSave.addEventListener("click", () => this.saveConfFromUI());

      d.btnToggleSide.addEventListener("click", () => {
        const next = !this._uiState.sidebarCollapsed;
        this._saveUIState({ sidebarCollapsed: next });
        this.renderAll();
      });

      d.tabs.addEventListener("click", (e) => {
        const t = e.target.closest(`.${APP_PREFIX}tab`);
        if (!t) return;
        const tab = t.dataset.tab;
        this._saveUIState({ tab });
        this.renderAll();
      });

      d.btnStop.addEventListener("click", () => {
        const s = this.store.active();
        if (!s?.id) return;
        cancelSession(s.id);
        this.toast("已停止");
        this.renderAll();
      });

      d.btnNew.addEventListener("click", () => {
        this.store.create("新会话");
        this.renderAll();
      });

      d.btnExport.addEventListener("click", () => {
        const s = this.store.active();
        const payload = {
          title: s.title,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          chat: s.chat,
          agent: s.agent,
          fsm: s.fsm,
          draft: s.draft,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `linuxdo-agent-${(s.title || "session").slice(
          0,
          24
        )}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 120);
      });

      d.sessionFilter.addEventListener("input", () => this.renderSessions());

      d.sessions.addEventListener("click", (e) => {
        const card = e.target.closest(`.${APP_PREFIX}session`);
        if (!card) return;
        const id = card.dataset.id;

        const op = e.target.closest("[data-op]");
        if (op) {
          const act = op.dataset.op;
          if (act === "del") {
            if (confirm("确定删除该会话吗？")) {
              this.store.remove(id);
              this.renderAll();
            }
            return;
          }
          if (act === "ren") {
            const s = this.store.all().find((x) => x.id === id);
            const t = prompt("重命名会话：", s?.title || "新会话");
            if (t != null) {
              this.store.rename(id, t);
              this.renderAll();
            }
            return;
          }
          if (act === "clr") {
            if (confirm("确定清空该会话吗？")) {
              this.store.clearSession(id);
              this.renderAll();
            }
            return;
          }
        }

        this.store.setActive(id);
        this.renderAll();
      });

      // composer
      d.ta.addEventListener("input", () => {
        this.autoGrow(d.ta);
        const s = this.store.active();
        this.store.setDraft(s.id, d.ta.value);
      });
      d.ta.addEventListener("keydown", (e) => {
        if (
          (e.key === "Enter" && !e.shiftKey) ||
          (e.key === "Enter" && (e.ctrlKey || e.metaKey))
        ) {
          e.preventDefault();
          this.send();
        }
      });

      d.btnSend.addEventListener("click", () => this.send());
      d.btnResume.addEventListener("click", () => this.resume());

      // close overlay on ESC
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.dom.overlay.classList.remove("open");
      });

      // message actions (copy/quote/toggle)
      d.chat.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;
        const msgEl = e.target.closest(`.${APP_PREFIX}msg`);
        if (!msgEl) return;
        const content = msgEl.dataset.raw || "";

        if (action === "copy") {
          try {
            await navigator.clipboard.writeText(content);
            this.toast("已复制");
          } catch {
            this.toast("复制失败");
          }
          return;
        }
        if (action === "quote") {
          const ta = this.dom.ta;
          const quote = content
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n");
          ta.value = (ta.value ? ta.value + "\n\n" : "") + quote + "\n";
          this.autoGrow(ta);
          ta.focus();
          const s = this.store.active();
          this.store.setDraft(s.id, ta.value);
          this.toast("已引用到输入框");
          return;
        }
        if (action === "toggle") {
          msgEl.classList.toggle("collapsed");
          btn.textContent = msgEl.classList.contains("collapsed")
            ? "展开"
            : "收起";
          return;
        }
      });

      // scroll-to-bottom
      const wrap = this.dom.panelChat;
      wrap.addEventListener("scroll", () => this._updateToBottom());
      this.dom.toBottom.addEventListener("click", () => {
        wrap.scrollTop = wrap.scrollHeight;
        this._updateToBottom();
      });

      // debug controls
      d.dbgTool.addEventListener("change", () => {
        this._saveUIState({
          debugFilter: {
            ...this._uiState.debugFilter,
            tool: !!d.dbgTool.checked,
          },
        });
        this.renderDebug();
      });
      d.dbgAgent.addEventListener("change", () => {
        this._saveUIState({
          debugFilter: {
            ...this._uiState.debugFilter,
            agent: !!d.dbgAgent.checked,
          },
        });
        this.renderDebug();
      });
      d.dbgErr.addEventListener("change", () => {
        this._saveUIState({
          debugFilter: {
            ...this._uiState.debugFilter,
            errors: !!d.dbgErr.checked,
          },
        });
        this.renderDebug();
      });
      d.dbgExpandAll.addEventListener("click", () => {
        d.debugWrap
          .querySelectorAll(`.${APP_PREFIX}logItem`)
          .forEach((x) => x.classList.add("open"));
      });
      d.dbgCollapseAll.addEventListener("click", () => {
        d.debugWrap
          .querySelectorAll(`.${APP_PREFIX}logItem`)
          .forEach((x) => x.classList.remove("open"));
      });

      // debug item toggle
      d.debugWrap.addEventListener("click", (e) => {
        const head = e.target.closest(`.${APP_PREFIX}logHead`);
        if (!head) return;
        const item = head.closest(`.${APP_PREFIX}logItem`);
        if (!item) return;
        item.classList.toggle("open");
      });
      d.debugWrap.addEventListener("click", async (e) => {
        const c = e.target.closest("[data-copylog]");
        if (!c) return;
        e.stopPropagation();
        const text = c.dataset.copylog || "";
        try {
          await navigator.clipboard.writeText(text);
          this.toast("已复制");
        } catch {
          this.toast("复制失败");
        }
      });
    }

    _applyTheme() {
      const root = document.documentElement;
      if (this.theme === "light") {
        root.setAttribute("data-theme", "light");
      } else if (this.theme === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        // auto: 移除 data-theme，让 CSS media query 生效
        root.removeAttribute("data-theme");
      }
    }

    _toggleTheme() {
      // 循环切换: auto -> light -> dark -> auto
      if (this.theme === "auto") {
        this.theme = "light";
      } else if (this.theme === "light") {
        this.theme = "dark";
      } else {
        this.theme = "auto";
      }
      GM_setValue(STORE_KEYS.THEME, this.theme);
      this._applyTheme();

      const themeNames = {
        auto: "自动",
        light: "浅色",
        dark: "深色"
      };
      this.toast(`主题: ${themeNames[this.theme]}`);
    }

    toggleDrawer(force) {
      if (typeof force === "boolean")
        this.dom.drawer.classList.toggle("open", force);
      else this.dom.drawer.classList.toggle("open");
    }

    autoGrow(ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(180, Math.max(46, ta.scrollHeight)) + "px";
    }

    toast(msg) {
      const t = this.dom.toast;
      t.textContent = msg;
      t.classList.add("show");
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove("show"), 2200);
    }

    loadConfToUI() {
      const c = this.confStore.get();
      this.dom.cfgBaseUrl.value = c.baseUrl || DEFAULT_CONF.baseUrl;
      this.dom.cfgModel.value = c.model || DEFAULT_CONF.model;
      this.dom.cfgKey.value = c.apiKey || "";
      this.dom.cfgTemp.value = String(c.temperature ?? 0.2);
      this.dom.cfgMaxTurns.value = String(c.maxTurns ?? 8);
      this.dom.cfgMaxCtx.value = String(c.maxContextChars ?? 24000);
      this.dom.cfgSys.value = c.systemPrompt || DEFAULT_CONF.systemPrompt;
      this.dom.cfgToolCtx.checked = !!c.includeToolContext;
    }

    saveConfFromUI() {
      const baseUrl = this.dom.cfgBaseUrl.value.trim() || DEFAULT_CONF.baseUrl;
      const model = this.dom.cfgModel.value.trim() || DEFAULT_CONF.model;
      const apiKey = this.dom.cfgKey.value.trim();
      const temperature = Math.max(
        0,
        Math.min(
          1,
          parseFloat(this.dom.cfgTemp.value) || DEFAULT_CONF.temperature
        )
      );
      const maxTurns = Math.max(
        1,
        Math.min(
          100,
          parseInt(this.dom.cfgMaxTurns.value, 10) || DEFAULT_CONF.maxTurns
        )
      );
      const maxContextChars = Math.max(
        4000,
        Math.min(
          8000000,
          parseInt(this.dom.cfgMaxCtx.value, 10) || DEFAULT_CONF.maxContextChars
        )
      );
      const systemPrompt =
        this.dom.cfgSys.value.trim() || DEFAULT_CONF.systemPrompt;
      const includeToolContext = !!this.dom.cfgToolCtx.checked;

      this.confStore.save({
        baseUrl,
        model,
        apiKey,
        temperature,
        maxTurns,
        maxContextChars,
        systemPrompt,
        includeToolContext,
      });
      this.dom.overlay.classList.remove("open");
      this.toast("设置已保存");
    }

    _formatTime(ts) {
      try {
        return new Date(ts || now()).toLocaleString("zh-CN", { hour12: false });
      } catch {
        return "";
      }
    }

    _renderMd(content) {
      try {
        return (
          window.marked ? marked.parse(content || "") : String(content || "")
        ).replace(/<a /g, '<a target="_blank" rel="noreferrer" ');
      } catch {
        return `<pre>${String(content || "").replace(
          /[<>&]/g,
          (s) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[s])
        )}</pre>`;
      }
    }

    _updateToBottom() {
      const wrap = this.dom.panelChat;
      const nearBottom =
        wrap.scrollHeight - (wrap.scrollTop + wrap.clientHeight) < 180;
      this.dom.toBottom.classList.toggle("show", !nearBottom);
    }

    setActiveTab(tab) {
      const tabs = this.dom.tabs.querySelectorAll(`.${APP_PREFIX}tab`);
      tabs.forEach((x) => x.classList.toggle("active", x.dataset.tab === tab));
      this.dom.panelChat.classList.toggle("active", tab === "chat");
      this.dom.panelTools.classList.toggle("active", tab === "tools");
      this.dom.panelDebug.classList.toggle("active", tab === "debug");
      this.dom.composer.style.display = tab === "chat" ? "flex" : "none";
    }

    renderStatus() {
      const s = this.store.active();
      const f = s.fsm || {};
      const st = f.state || FSM.IDLE;
      const step = f.step ? `step=${f.step}` : "";
      const err =
        st === FSM.ERROR && f.lastError
          ? String(f.lastError).slice(0, 180)
          : "";
      this.dom.statusPill.title = err ? String(f.lastError) : st;
      this.dom.statusPill.querySelector(".st").textContent = st;
      this.dom.statusStep.textContent = step ? `· ${step}` : "";
      this.dom.statusErr.textContent = err ? `· ${err}` : "";

      // FAB state dot
      this.dom.fab.classList.toggle("running", !!f.isRunning);
      this.dom.fab.classList.toggle("error", st === FSM.ERROR);
    }

    renderSessions() {
      const wrap = this.dom.sessions;
      const all = this.store.all();
      const activeId = this.store.active().id;
      const q = String(this.dom.sessionFilter.value || "")
        .trim()
        .toLowerCase();

      const filtered = q
        ? all.filter((s) =>
            String(s.title || "")
              .toLowerCase()
              .includes(q)
          )
        : all;

      wrap.innerHTML = filtered
        .map((s) => {
          const state = s.fsm?.state || FSM.IDLE;
          const running = s.fsm?.isRunning ? " · 运行中" : "";
          const err =
            s.fsm?.state === FSM.ERROR && s.fsm?.lastError ? " · 错误" : "";
          const sub = `${state}${running}${err}`;
          return `
          <div class="${APP_PREFIX}session ${
            s.id === activeId ? "active" : ""
          }" data-id="${s.id}">
            <div style="min-width:0;">
              <div class="t" title="${(s.title || "").replace(
                /"/g,
                "&quot;"
              )}">${s.title || "新会话"}</div>
              <div class="s">${sub}</div>
            </div>
            <div class="${APP_PREFIX}ops">
              <span class="${APP_PREFIX}op" data-op="ren" title="重命名">改</span>
              <span class="${APP_PREFIX}op" data-op="clr" title="清空">空</span>
              <span class="${APP_PREFIX}op" data-op="del" title="删除">删</span>
            </div>
          </div>
        `;
        })
        .join("");
    }

    renderChat() {
      const s = this.store.active();
      const wrap = this.dom.chat;

      const blocks = [];

      if (!s.chat.length) {
        blocks.push(
          `<div style="opacity:.9;text-align:center;margin-top:42px;color:var(--a-sub);font-weight:900;">Chat：只显示 user/final。工具与调试请切换到 Tools / Debug。</div>`
        );
      } else {
        for (const m of s.chat)
          blocks.push(this.renderMessage(m.role, m.content, m.ts));
      }

      wrap.innerHTML = blocks.join("\n");
      // 如果用户在底部附近才自动跟随
      const panel = this.dom.panelChat;
      const nearBottom =
        panel.scrollHeight - (panel.scrollTop + panel.clientHeight) < 180;
      if (nearBottom) panel.scrollTop = panel.scrollHeight;
      this._updateToBottom();
    }

    renderMessage(role, content, ts) {
      const r =
        role === "user" ? "user" : role === "tool" ? "tool" : "assistant";
      const time = this._formatTime(ts);

      const raw = String(content || "");
      const html = this._renderMd(raw);

      const lineCount = raw.split("\n").length;
      const tooLong = raw.length > 2200 || lineCount > 26;
      const collapsedClass = tooLong ? "collapsed" : "";

      return `
        <div class="${APP_PREFIX}msg ${r} ${collapsedClass}" data-raw="${raw
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")}">
          <div class="${APP_PREFIX}meta">
            <div class="${APP_PREFIX}mleft">
              <span>${r.toUpperCase()}</span>
              <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">· ${time}</span>
            </div>
            <div class="${APP_PREFIX}mright">
              <span class="${APP_PREFIX}mini" data-action="copy">复制</span>
              <span class="${APP_PREFIX}mini" data-action="quote">引用</span>
              ${
                tooLong
                  ? `<span class="${APP_PREFIX}mini" data-action="toggle">展开</span>`
                  : ""
              }
            </div>
          </div>
          <div class="${APP_PREFIX}md">${html}</div>
          ${
            tooLong
              ? `<div class="${APP_PREFIX}moreHint">（内容较长，已折叠）</div>`
              : ""
          }
        </div>
      `;
    }

    renderTools() {
      const wrap = this.dom.toolsWrap;
      const s = this.store.active();

      const toolOptions = [
        "discourse.search",
        "discourse.getTopicAllPosts",
        "discourse.getUserRecent",
        "discourse.getCategories",
        "discourse.listLatestTopics",
        "discourse.listTopTopics",
        "discourse.getTagTopics",
        "discourse.getUserSummary",
        "discourse.getPost",
        "discourse.getTopicPostFull",
        "discourse.listLatestPosts",
      ];

      const defaultArgs = (name) => {
        if (name === "discourse.search")
          return { q: "linux", page: 1, limit: 8 };
        if (name === "discourse.getTopicAllPosts")
          return { topicId: 1, batchSize: 18, maxPosts: 120 };
        if (name === "discourse.getUserRecent")
          return { username: "someone", limit: 10 };
        if (name === "discourse.getCategories") return {};
        if (name === "discourse.listLatestTopics") return { page: 0 };
        if (name === "discourse.listTopTopics")
          return { period: "weekly", page: 0 };
        if (name === "discourse.getTagTopics") return { tag: "linux", page: 0 };
        if (name === "discourse.getUserSummary") return { username: "someone" };
        if (name === "discourse.getPost") return { postId: 1 };
        if (name === "discourse.getTopicPostFull")
          return { topicId: 1, postNumber: 1, maxChars: 10000 };
        if (name === "discourse.listLatestPosts")
          return { before: null, limit: 20 };
        return {};
      };

      const name = this.toolsState.lastName;
      const argsText = JSON.stringify(
        this.toolsState.lastArgs ?? defaultArgs(name),
        null,
        2
      );

      wrap.innerHTML = `
        <div class="${APP_PREFIX}toolCard">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div style="font-weight:900;">Tools（手动运行 Discourse 工具，不走模型）</div>
            <div style="color:var(--a-sub);font-weight:900;">结果可“一键加入上下文/发到聊天”</div>
          </div>

          <div class="${APP_PREFIX}toolRow" style="margin-top:10px;">
            <div>
              <label style="display:block;font-weight:900;color:var(--a-sub);margin-bottom:6px;">工具</label>
              <select id="${APP_PREFIX}toolName">
                ${toolOptions
                  .map(
                    (n) =>
                      `<option value="${n}" ${
                        n === name ? "selected" : ""
                      }>${n}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div style="flex:2;min-width:260px;">
              <label style="display:block;font-weight:900;color:var(--a-sub);margin-bottom:6px;">参数（JSON）</label>
              <textarea id="${APP_PREFIX}toolArgs" rows="8" style="width:100%;box-sizing:border-box;border-radius:12px;border:1px solid var(--a-border);padding:10px 12px;background:rgba(127,127,127,.08);color:var(--a-text);outline:none;font-weight:800;">${argsText.replace(
        /</g,
        "&lt;"
      )}</textarea>
            </div>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
            <button class="${APP_PREFIX}btn" id="${APP_PREFIX}toolRun">运行工具</button>
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}toolToCtx">加入上下文</button>
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}toolToChat">发到聊天</button>
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}toolCopy">复制结果</button>
          </div>

          <div class="${APP_PREFIX}toolOut" id="${APP_PREFIX}toolOut">${(
        this.toolsState.lastResult || "(暂无结果)"
      ).replace(/</g, "&lt;")}</div>

          <div style="margin-top:10px;color:var(--a-sub);font-weight:900;">
            Tip：加入上下文后，你可以回到 Chat 再问“请基于工具结果总结/对比/提炼结论…”
          </div>
        </div>
      `;

      const toolNameEl = wrap.querySelector(`#${APP_PREFIX}toolName`);
      const toolArgsEl = wrap.querySelector(`#${APP_PREFIX}toolArgs`);
      const toolOutEl = wrap.querySelector(`#${APP_PREFIX}toolOut`);

      toolNameEl.addEventListener("change", () => {
        const n = toolNameEl.value;
        this.toolsState.lastName = n;
        this.toolsState.lastArgs = defaultArgs(n);
        this.toolsState.lastResult = "";
        this.renderTools();
      });

      wrap
        .querySelector(`#${APP_PREFIX}toolRun`)
        .addEventListener("click", async () => {
          const n = toolNameEl.value;
          let args;
          try {
            args = JSON.parse(toolArgsEl.value);
          } catch {
            this.toast("参数 JSON 解析失败");
            return;
          }

          this.toolsState.lastName = n;
          this.toolsState.lastArgs = args;

          const cancelToken = ensureCancelToken(s.id);
          cancelToken.cancelled = false;
          cancelToken.aborts = cancelToken.aborts || [];

          this.toast("运行工具中…");
          try {
            const res = await runTool(n, args, cancelToken);
            const ctx = toolResultToContext(n, res);
            this.toolsState.lastResult = ctx;
            toolOutEl.textContent = ctx;
            this.toast("工具完成");
          } catch (e) {
            const msg = String(e?.message || e);
            this.toolsState.lastResult = `工具失败：${msg}`;
            toolOutEl.textContent = this.toolsState.lastResult;
            this.toast("工具失败");
          } finally {
            CANCEL.delete(s.id);
          }
        });

      wrap
        .querySelector(`#${APP_PREFIX}toolToCtx`)
        .addEventListener("click", () => {
          const txt = String(this.toolsState.lastResult || "").trim();
          if (!txt) return this.toast("无结果可加入");
          this.store.pushAgent(s.id, {
            role: "tool",
            kind: "tool_context",
            content: txt,
            ts: now(),
            toolName: this.toolsState.lastName,
          });
          this.toast("已加入上下文");
        });

      wrap
        .querySelector(`#${APP_PREFIX}toolToChat`)
        .addEventListener("click", () => {
          const txt = String(this.toolsState.lastResult || "").trim();
          if (!txt) return this.toast("无结果可发送");
          this.store.pushChat(s.id, {
            role: "assistant",
            content: `**[Tools] ${this.toolsState.lastName} 结果**\n\n\`\`\`\n${txt}\n\`\`\``,
            ts: now(),
          });
          this.toast("已发送到 Chat");
          this.renderChat();
        });

      wrap
        .querySelector(`#${APP_PREFIX}toolCopy`)
        .addEventListener("click", async () => {
          const txt = String(this.toolsState.lastResult || "").trim();
          if (!txt) return this.toast("无结果可复制");
          try {
            await navigator.clipboard.writeText(txt);
            this.toast("已复制");
          } catch {
            this.toast("复制失败");
          }
        });
    }

    renderDebug() {
      const s = this.store.active();
      const wrap = this.dom.debugWrap;

      const filt = this._uiState.debugFilter || {
        tool: true,
        agent: true,
        errors: true,
      };
      this.dom.dbgTool.checked = !!filt.tool;
      this.dom.dbgAgent.checked = !!filt.agent;
      this.dom.dbgErr.checked = !!filt.errors;

      const items = (s.agent || [])
        .map((a, idx) => {
          const isTool = a.role === "tool";
          const isAgent = a.role === "agent";
          const isErr =
            String(a.kind || "").includes("error") ||
            String(a.kind || "").includes("ERROR") ||
            a.kind === "model_parse_error";

          if (isTool && !filt.tool) return null;
          if (isAgent && !filt.agent) return null;
          if (isErr && !filt.errors) return null;

          const title = `${idx + 1}. ${a.role}:${a.kind || ""}`;
          const time = this._formatTime(a.ts);
          const txt = String(a.content || "");
          const short = txt.length > 160 ? txt.slice(0, 160) + "…" : txt;

          return `
          <div class="${APP_PREFIX}logItem">
            <div class="${APP_PREFIX}logHead">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${title} · <span style="color:var(--a-sub);">${time}</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
                <span class="${APP_PREFIX}mini" data-copylog="${txt
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")}">复制</span>
              </div>
            </div>
            <div class="${APP_PREFIX}logBody">
              <div style="color:var(--a-sub);font-weight:900;margin-bottom:8px;">预览：${short.replace(
                /</g,
                "&lt;"
              )}</div>
              <pre>${txt.replace(/</g, "&lt;")}</pre>
            </div>
          </div>
        `;
        })
        .filter(Boolean);

      wrap.innerHTML = items.length
        ? items.join("")
        : `<div style="opacity:.85;color:var(--a-sub);font-weight:900;margin-top:16px;">（暂无调试日志）</div>`;
    }

    renderAll() {
      const s = this.store.active();

      // apply sidebar collapsed
      this.dom.sidebar.classList.toggle(
        "collapsed",
        !!this._uiState.sidebarCollapsed
      );

      // apply tab
      const tab = this._uiState.tab || "chat";
      this.setActiveTab(tab);

      // status pill + fab dot
      this.renderStatus();

      // sessions
      this.renderSessions();

      // draft restore
      if (typeof s.draft === "string" && this.dom.ta.value !== s.draft) {
        this.dom.ta.value = s.draft;
        this.autoGrow(this.dom.ta);
      }

      // panels
      this.renderChat();
      this.renderTools();
      this.renderDebug();

      // buttons state
      const running = !!s.fsm?.isRunning;
      this.dom.btnSend.disabled = running;
      this.dom.btnResume.disabled = running;
      this.dom.ta.disabled = running;
      this.dom.btnSend.textContent = running ? "运行中…" : "发送";
    }

    async send() {
      if (this.isSending) return;
      const text = this.dom.ta.value.trim();
      if (!text) return;

      const conf = this.confStore.get();
      if (!conf.apiKey) {
        this.toast("请先设置 API Key");
        this.dom.overlay.classList.add("open");
        return;
      }

      const s = this.store.active();
      if (s.fsm?.isRunning) return;

      this.isSending = true;

      this.dom.ta.value = "";
      this.autoGrow(this.dom.ta);
      this.store.setDraft(s.id, "");

      this.store.pushChat(s.id, { role: "user", content: text, ts: now() });

      if ((s.title || "") === "新会话") {
        const t = text.replace(/\s+/g, " ").trim().slice(0, 14) || "新会话";
        this.store.rename(s.id, t);
      }

      this._saveUIState({ tab: "chat" });
      this.setActiveTab("chat");
      this.renderAll();

      try {
        await runAgent(s.id, this.store, conf, this);
        this.toast("完成");
      } catch (e) {
        this.toast(`失败：${e.message || e}`);
      } finally {
        this.isSending = false;
        this.renderAll();
      }
    }

    async resume() {
      const conf = this.confStore.get();
      const s = this.store.active();
      if (s.fsm?.isRunning) return;

      this.toast("尝试恢复…");
      try {
        await runAgent(s.id, this.store, conf, this);
        this.toast("恢复完成");
      } catch (e) {
        this.toast(`恢复失败：${e.message || e}`);
      } finally {
        this.renderAll();
      }
    }
  }

  /******************************************************************
   * 9) 启动
   ******************************************************************/
  function init() {
    if (window.top !== window) return;
    if (document.getElementById(`${APP_PREFIX}fab`)) return;

    const confStore = new ConfigStore();
    const store = new SessionStore();
    new UI(store, confStore);
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  )
    init();
  else window.addEventListener("load", init);
})();
