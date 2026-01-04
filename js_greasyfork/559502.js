// ==UserScript==
// @name         Linux.do Agent
// @namespace    https://example.com/linuxdo-agent
// @version      0.3.2
// @description  OpenAI Chat格式可配置baseUrl/model/key；多会话跨刷新；消息操作（重试/编辑/复制/删除）；现代化弹窗UI；点击外部关闭窗口；Discourse工具：搜索/抓话题全帖/查用户近期帖子/分类/最新话题/Top话题/Tag话题/用户Summary(含热门帖子)/单帖/按(topicId+postNumber)完整抓取指定楼(<=10000)/站点最新帖子列表；模型JSON输出自动find/rfind修复并回写history；final.refs 显示到UI；AG悬浮球支持拖动并记忆位置。
// @author       IronMan (原作者: Bytebender, 出处: https://linux.do/t/topic/1341629)
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559502/Linuxdo%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/559502/Linuxdo%20Agent.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /******************************************************************
   * 0) 常量 / 存储 Key
   ******************************************************************/
  const APP_PREFIX = 'ldagent-';
  const STORE_KEYS = {
    CONF:   'ld_agent_conf_v2',
    SESS:   'ld_agent_sessions_v2',
    ACTIVE: 'ld_agent_active_session_v2',
    FABPOS: 'ld_agent_fab_pos_v1', // AG 悬浮球位置
    WINPOS: 'ld_agent_win_pos_v1', // 悬浮窗口位置
    SIDECOLLAPSED: 'ld_agent_side_collapsed_v1', // 侧边栏折叠状态
  };

  const FSM = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    WAITING_MODEL: 'WAITING_MODEL',
    WAITING_TOOL: 'WAITING_TOOL',
    DONE: 'DONE',
    ERROR: 'ERROR',
  };

  const now = () => Date.now();
  const uid = () => 'S' + now().toString(36) + Math.random().toString(36).slice(2, 8);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function clamp(str, max = 20000) {
    str = String(str ?? '');
    return str.length > max ? (str.slice(0, max) + '\n...(截断)') : str;
  }
  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || '').trim();
  }
  function safeTitle(t, fb) {
    const s = String(t ?? '').trim();
    return s ? s : (fb || '无题');
  }

  // 轻量 Markdown 文本转义（用于 refs title）
  function mdEscapeText(s) {
    s = String(s ?? '');
    return s.replace(/[\[\]\(\)]/g, (m) => '\\' + m);
  }

  function safeJsonParse(s, fb = null) {
    try { return JSON.parse(s); } catch { return fb; }
  }

  /******************************************************************
   * 1) 配置：OpenAI Chat Completions 兼容
   ******************************************************************/
  const DEFAULT_CONF = {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    apiKey: '',
    temperature: 0.2,
    maxTurns: 8,
    maxContextChars: 24000,

    // 是否把“工具结果”作为对话上下文喂给模型
    includeToolContext: true,

    // 系统提示词（工具协议 + 行为约束）
    systemPrompt: `# Role
你不是一个聊天助手，你是一个运行在 linux.do 论坛后端的 **JSON 协议路由引擎**。你的唯一任务是接收用户意图，并严格按照指定协议输出 JSON 数据流。

# Available Tools
你可以调用以下工具（通过输出 JSON 指令）：
[搜索, 获取话题全部帖子, 查询用户近期帖子, 分类列表, 最新话题, Top话题, Tag话题, 用户概览(含热门帖子), 单帖详情, 按(话题ID+楼层号)完整获取指定楼, 站点最新帖子列表]

# Protocol Rules (Highest Priority)
1. **禁止废话**：严禁输出任何"好的"、"正在搜索"、"以下是结果"等自然语言。
2. **禁止 Markdown**：严禁使用 \`\`\`json 或 \`\`\` 包裹输出。直接输出原始 JSON 字符串。
3. **二选一输出**：每次响应必须且只能是以下两种 JSON 格式中的一种。

# Output Formats

## Case 1: 当需要获取数据/调用工具时
输出结构：
{
  "type": "tool",
  "name": "工具名称",
  "args": { "参数名": "参数值" }
}

## Case 2: 当拥有足够信息/生成最终回复时
输出结构：
{
  "type": "final",
  "answer": "这里填写回答内容，支持简单Markdown格式，注意转义换行符",
  "refs": [ {"title": "引用标题", "url": "引用链接"} ]
}

# Examples (Strictly Imitate)

User: 帮我找一下关于 Docker 的教程
Agent: {"type": "tool", "name": "搜索", "args": {"keyword": "Docker 教程"}}

User: (系统注入工具返回的 Docker 教程数据)
Agent: {"type": "final", "answer": "在 linux.do 上关于 Docker 的教程主要集中在... \\n\\n你可以参考以下内容...", "refs": [{"title": "Docker入门", "url": "https://..."}]}

# Critical Constraints
- \`refs\` 必须基于工具返回的真实数据，严禁编造 URL。
- 如果工具返回结果为空，\`type\` 必须为 \`final\`，并在 \`answer\` 中告知用户未找到信息。
- 输出必须是合法的单行或多行 JSON 字符串，能够直接被 \`JSON.parse()\` 解析。

开始处理用户输入：`,
  };

  class ConfigStore {
    constructor() {
      const saved = GM_getValue(STORE_KEYS.CONF, null);
      this.conf = { ...DEFAULT_CONF, ...(saved || {}) };
    }
    get() { return this.conf; }
    save(c) { this.conf = { ...this.conf, ...(c || {}) }; GM_setValue(STORE_KEYS.CONF, this.conf); }
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
        this.sessions = [this._newSessionObj(id, '新会话')];
        this.activeId = id;
        this._persist();
      }
      if (!this.sessions.some(s => s.id === this.activeId)) {
        this.activeId = this.sessions[0].id;
        this._persist();
      }
    }

    _newSessionObj(id, title) {
      return {
        id,
        title: title || '新会话',
        createdAt: now(),
        fsm: { state: FSM.IDLE, step: 0, lastError: null, isRunning: false },
        chat: [],  // {role:'user'|'assistant', content, ts}
        agent: [], // {role:'agent'|'tool', kind, content, ts}
      };
    }

    all() { return this.sessions; }
    active() { return this.sessions.find(s => s.id === this.activeId) || this.sessions[0]; }
    setActive(id) { this.activeId = id; GM_setValue(STORE_KEYS.ACTIVE, id); }

    create(title='新会话') {
      const s = this._newSessionObj(uid(), title);
      this.sessions.unshift(s);
      this.activeId = s.id;
      this._persist();
      return s;
    }

    rename(id, title) {
      const s = this.sessions.find(x => x.id === id);
      if (!s) return;
      s.title = String(title || '').trim() || '新会话';
      this._persist();
    }

    remove(id) {
      const idx = this.sessions.findIndex(x => x.id === id);
      if (idx < 0) return;
      this.sessions.splice(idx, 1);
      if (!this.sessions.length) {
        const s = this._newSessionObj(uid(), '新会话');
        this.sessions = [s];
        this.activeId = s.id;
      } else if (this.activeId === id) {
        this.activeId = this.sessions[0].id;
      }
      this._persist();
    }

    pushChat(id, msg) {
      const s = this.sessions.find(x => x.id === id);
      if (!s) return;
      s.chat.push(msg);
      this._persist();
    }
    pushAgent(id, msg) {
      const s = this.sessions.find(x => x.id === id);
      if (!s) return;
      s.agent.push(msg);
      this._persist();
    }
    setFSM(id, patch) {
      const s = this.sessions.find(x => x.id === id);
      if (!s) return;
      s.fsm = { ...(s.fsm || {}), ...(patch || {}) };
      this._persist();
    }

    updateLastAgent(id, predicateFn, updaterFn) {
      const s = this.sessions.find(x => x.id === id);
      if (!s || !Array.isArray(s.agent)) return;
      for (let i = s.agent.length - 1; i >= 0; i--) {
        if (predicateFn(s.agent[i])) {
          s.agent[i] = updaterFn(s.agent[i]) || s.agent[i];
          this._persist();
          return;
        }
      }
    }

    clearSession(id) {
      const s = this.sessions.find(x => x.id === id);
      if (!s) return;
      s.chat = [];
      s.agent = [];
      s.fsm = { state: FSM.IDLE, step: 0, lastError: null, isRunning: false };
      this._persist();
    }

    // 删除指定索引的聊天消息
    deleteChatAt(id, index) {
      const s = this.sessions.find(x => x.id === id);
      if (!s || index < 0 || index >= s.chat.length) return;
      s.chat.splice(index, 1);
      this._persist();
    }

    // 编辑指定索引的聊天消息
    editChatAt(id, index, newContent) {
      const s = this.sessions.find(x => x.id === id);
      if (!s || index < 0 || index >= s.chat.length) return;
      s.chat[index].content = newContent;
      this._persist();
    }

    // 从指定索引截断聊天记录（用于重试功能）
    truncateChatFrom(id, index) {
      const s = this.sessions.find(x => x.id === id);
      if (!s || index < 0 || index >= s.chat.length) return;
      s.chat = s.chat.slice(0, index + 1);
      s.agent = []; // 清空 agent 记录
      s.fsm = { state: FSM.IDLE, step: 0, lastError: null, isRunning: false };
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
    static headers() { return { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }; }

    static csrfToken() {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    static async fetchJson(path, opt = {}) {
      const { method = 'GET', body = null, headers = {} } = opt;

      const init = {
        method,
        credentials: 'same-origin',
        headers: { ...this.headers(), ...(headers || {}) },
      };

      if (body != null) {
        init.headers['Content-Type'] = 'application/json';
        init.headers['X-CSRF-Token'] = this.csrfToken();
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

    // ===== search =====
    static async search({ q, page = 1, limit = 8 }) {
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('page', String(page));
      params.set('include_blurbs', 'true');
      params.set('skip_context', 'true');

      const data = await this.fetchJson(`/search.json?${params.toString()}`);
      const topicsMap = new Map((data.topics || []).map(t => [t.id, safeTitle(t.fancy_title || t.title, `话题 ${t.id}`)]));

      const posts = (data.posts || []).slice(0, limit).map(p => ({
        topic_id: p.topic_id,
        post_number: p.post_number,
        title: topicsMap.get(p.topic_id) || `话题 ${p.topic_id}`,
        username: p.username,
        created_at: p.created_at,
        blurb: p.blurb || '',
        url: this.topicUrl(p.topic_id, p.post_number),
      }));

      return { q, page, posts };
    }

    // ===== getTopicAllPosts =====
    static async getTopicAllPosts({ topicId, batchSize = 18, maxPosts = 240 }) {
      const first = await this.fetchJson(`/t/${encodeURIComponent(topicId)}.json`);
      const title = safeTitle(first.title, `话题 ${topicId}`);
      const stream = (first.post_stream?.stream || []).slice(0, maxPosts);
      const got = new Map();

      for (const p of (first.post_stream?.posts || [])) got.set(p.id, p);

      for (let i = 0; i < stream.length; i += batchSize) {
        const chunk = stream.slice(i, i + batchSize);
        const params = new URLSearchParams();
        chunk.forEach(id => params.append('post_ids[]', String(id)));
        const data = await this.fetchJson(`/t/${encodeURIComponent(topicId)}/posts.json?${params.toString()}`);
        for (const p of (data.post_stream?.posts || [])) got.set(p.id, p);
        await sleep(160);
      }

      const posts = stream.map(id => got.get(id)).filter(Boolean).map(p => ({
        id: p.id,
        post_number: p.post_number,
        username: p.username,
        created_at: p.created_at,
        cooked: p.cooked || '',
        url: this.topicUrl(topicId, p.post_number),
        like_count: p.like_count,
        reply_count: p.reply_count,
      }));

      return { topicId, title, count: posts.length, posts };
    }

    // ===== getUserRecent =====
    static async getUserRecent({ username, limit = 10 }) {
      const params = new URLSearchParams();
      params.set('offset', '0');
      params.set('limit', String(limit));
      params.set('username', username);
      params.set('filter', '4,5');

      const data = await this.fetchJson(`/user_actions.json?${params.toString()}`);
      const items = (data.user_actions || []).map(a => ({
        action_type: a.action_type,
        title: safeTitle(a.title, `话题 ${a.topic_id}`),
        topic_id: a.topic_id,
        post_number: a.post_number,
        created_at: a.created_at,
        excerpt: a.excerpt || '',
        url: this.topicUrl(a.topic_id, a.post_number),
      }));

      return { username, items };
    }

    // ===== 分类列表 =====
    static async getCategories() {
      return this.fetchJson('/categories.json');
    }

    // ===== 最新话题列表（✅ 增加 no_definitions=true，兼容 more_topics_url）=====
    static async listLatestTopics({ page = 0 } = {}) {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('no_definitions', 'true');
      return this.fetchJson(`/latest.json?${params.toString()}`);
    }

    // ===== Top 话题 =====
    static async listTopTopics({ period = 'weekly', page = 0 } = {}) {
      const params = new URLSearchParams();
      params.set('period', String(period));
      params.set('page', String(page));
      params.set('no_definitions', 'true');
      return this.fetchJson(`/top.json?${params.toString()}`);
    }

    // ===== Tag 下的话题 =====
    static async getTagTopics({ tag, page = 0 } = {}) {
      if (!tag) throw new Error('tag 不能为空');
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('no_definitions', 'true');
      return this.fetchJson(`/tag/${encodeURIComponent(tag)}.json?${params.toString()}`);
    }

    // ===== 站点最新帖子列表（✅ 新增：用于“最新帖子”而非“最新话题”）=====
    // Discourse 常见：/posts.json?before=<post_id>
    static async listLatestPosts({ before = null, limit = 20 } = {}) {
      const params = new URLSearchParams();
      if (before !== null && before !== undefined && before !== '') params.set('before', String(before));
      // 有的站支持 per_page / limit，不保证；这里尽量兼容
      params.set('limit', String(Math.max(1, Math.min(50, parseInt(limit, 10) || 20))));
      params.set('no_definitions', 'true');

      let data;
      try {
        data = await this.fetchJson(`/posts.json?${params.toString()}`);
      } catch (e1) {
        // fallback：某些站可能限制 /posts.json，这里给出更明确的错误
        throw new Error(`获取失败：/posts.json 不可用或被限制。${String(e1?.message || e1)}`);
      }

      const arr = Array.isArray(data?.latest_posts) ? data.latest_posts : (Array.isArray(data) ? data : []);
      const posts = arr.slice(0, Math.max(1, Math.min(50, parseInt(limit, 10) || 20))).map(p => {
        const topic_id = p.topic_id;
        const post_number = p.post_number || p.post_number;
        return {
          id: p.id,
          topic_id,
          post_number,
          username: p.username,
          created_at: p.created_at,
          cooked: p.cooked || '',
          raw: p.raw || '',
          like_count: p.like_count,
          url: (topic_id && post_number) ? this.topicUrl(topic_id, post_number) : '',
        };
      });

      return {
        before: before ?? null,
        returned: posts.length,
        posts,
      };
    }

    // ===== 用户 summary（✅ 升级：不仅用户数据，还包含热门帖子/热门话题/近期内容，一次返回尽量多“有价值信息”）=====
    static async getUserSummary({ username } = {}) {
      if (!username) throw new Error('username 不能为空');

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
        }
      };

      // 1) summary.json（通常含 user_summary/top_topics/top_replies/badges 等）
      let summaryJson = null;
      try {
        summaryJson = await this.fetchJson(`/u/${encodeURIComponent(username)}/summary.json`);
        out._raw.summary_json = summaryJson;
      } catch (e) {
        throw new Error(`获取 summary.json 失败：${String(e?.message || e)}`);
      }

      // 2) profile：/u/username.json（含 user 字段、user_fields、title、website 等）
      try {
        const profileJson = await this.fetchJson(`/u/${encodeURIComponent(username)}.json`);
        out._raw.profile_json = profileJson;
      } catch {
        // profile 可失败，不强制
      }

      // 3) activity/topics（近期创建的话题列表）
      try {
        const params = new URLSearchParams();
        params.set('page', '0');
        params.set('no_definitions', 'true');
        const topicsJson = await this.fetchJson(`/u/${encodeURIComponent(username)}/activity/topics.json?${params.toString()}`);
        out._raw.activity_topics_json = topicsJson;
      } catch {
        // 可失败，不强制
      }

      // 4) activity/posts（近期发言列表：回帖/发帖）
      try {
        const params = new URLSearchParams();
        params.set('page', '0');
        params.set('no_definitions', 'true');
        const postsJson = await this.fetchJson(`/u/${encodeURIComponent(username)}/activity/posts.json?${params.toString()}`);
        out._raw.activity_posts_json = postsJson;
      } catch {
        // 可失败，不强制
      }

      // ===== 归一化提取 =====
      // profile
      const profileUser = out._raw.profile_json?.user || summaryJson?.user || null;
      if (profileUser) {
        out.profile = {
          id: profileUser.id,
          username: profileUser.username,
          name: profileUser.name ?? '',
          title: profileUser.title ?? '',
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

      // summary 核心统计
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

      // badges（尽量原样保留，便于模型/前端用）
      out.badges = {
        user_badges: summaryJson?.user_badges || summaryJson?.userBadges || null,
        badges: summaryJson?.badges || null,
        badge_types: summaryJson?.badge_types || null,
        users: summaryJson?.users || null,
      };

      // hot_topics / hot_posts：
      // A) summary.json 常见字段：top_topics / top_replies
      const topTopics = Array.isArray(summaryJson?.top_topics) ? summaryJson.top_topics : (Array.isArray(summaryJson?.topTopics) ? summaryJson.topTopics : []);
      const topReplies = Array.isArray(summaryJson?.top_replies) ? summaryJson.top_replies : (Array.isArray(summaryJson?.topReplies) ? summaryJson.topReplies : []);

      out.hot_topics = topTopics.map(t => ({
        topic_id: t.id || t.topic_id || t.topicId,
        title: safeTitle(t.fancy_title || t.title, `话题 ${t.id || t.topic_id || ''}`),
        like_count: t.like_count,
        views: t.views,
        reply_count: t.reply_count ?? t.posts_count,
        last_posted_at: t.last_posted_at ?? t.bumped_at,
        category_id: t.category_id,
        tags: t.tags || [],
        url: this.topicUrl(t.id || t.topic_id || t.topicId, 1),
      })).filter(x => x.topic_id);

      out.hot_posts = topReplies.map(p => ({
        topic_id: p.topic_id,
        post_number: p.post_number,
        post_id: p.id,
        title: safeTitle(p.topic_title || p.title, `话题 ${p.topic_id}`),
        like_count: p.like_count,
        created_at: p.created_at,
        excerpt: p.excerpt || '',
        username: p.username,
        url: this.topicUrl(p.topic_id, p.post_number || 1),
      })).filter(x => x.topic_id);

      // B) activity/topics 作为补充热门候选（按 like_count/views/reply_count/last_posted_at 粗略排序）
      const actTopics = out._raw.activity_topics_json?.topic_list?.topics || out._raw.activity_topics_json?.topics || [];
      if (Array.isArray(actTopics) && actTopics.length) {
        const extra = actTopics.map(t => ({
          topic_id: t.id,
          title: safeTitle(t.fancy_title || t.title, `话题 ${t.id}`),
          like_count: t.like_count,
          views: t.views,
          reply_count: t.reply_count ?? (t.posts_count ? Math.max(0, t.posts_count - 1) : undefined),
          last_posted_at: t.last_posted_at ?? t.bumped_at,
          category_id: t.category_id,
          tags: t.tags || [],
          url: this.topicUrl(t.id, 1),
          _score: (t.like_count || 0) * 4 + (t.views || 0) * 0.01 + (t.reply_count || 0) * 2,
        }));

        // recent_topics：activity 原样取前 12
        out.recent_topics = extra.slice(0, 12).map(({ _score, ...rest }) => rest);

        // hot_topics：如果 summary.top_topics 不足，则用 activity 补齐（去重 topic_id）
        const exist = new Set(out.hot_topics.map(x => x.topic_id));
        extra.sort((a, b) => (b._score - a._score));
        for (const t of extra) {
          if (out.hot_topics.length >= 10) break;
          if (!exist.has(t.topic_id)) {
            exist.add(t.topic_id);
            const { _score, ...rest } = t;
            out.hot_topics.push(rest);
          }
        }
      }

      // C) activity/posts 补充 recent_posts / hot_posts（按 like_count）
      const actPosts = out._raw.activity_posts_json?.user_actions || out._raw.activity_posts_json?.posts || out._raw.activity_posts_json?.activity_stream || [];
      if (Array.isArray(actPosts) && actPosts.length) {
        // user_actions.json 风格兼容（字段可能不同）
        const normPosts = actPosts.map(a => {
          const topic_id = a.topic_id || a?.post?.topic_id;
          const post_number = a.post_number || a?.post?.post_number;
          const like_count = a.like_count ?? a?.post?.like_count;
          const excerpt = a.excerpt || a?.post?.excerpt || '';
          const created_at = a.created_at || a?.post?.created_at;
          const username2 = a.username || a?.post?.username || username;
          const title = safeTitle(a.title || a.topic_title || a?.post?.topic_title, topic_id ? `话题 ${topic_id}` : '帖子');
          return {
            topic_id,
            post_number,
            post_id: a.post_id || a.id || a?.post?.id,
            title,
            like_count,
            created_at,
            excerpt,
            username: username2,
            url: (topic_id && post_number) ? this.topicUrl(topic_id, post_number) : '',
          };
        }).filter(x => x.topic_id && x.post_number);

        out.recent_posts = normPosts.slice(0, 12);

        const existPostKey = new Set(out.hot_posts.map(x => `${x.topic_id}#${x.post_number}`));
        const scored = normPosts.map(p => ({ ...p, _score: (p.like_count || 0) * 5 + (p.excerpt ? Math.min(1, p.excerpt.length / 120) : 0) }));
        scored.sort((a, b) => (b._score - a._score));
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

      // 限制数量（避免爆上下文）
      out.hot_topics = out.hot_topics.slice(0, 10);
      out.hot_posts = out.hot_posts.slice(0, 10);
      out.recent_topics = out.recent_topics.slice(0, 12);
      out.recent_posts = out.recent_posts.slice(0, 12);

      return out;
    }

    // ===== 单个帖子详情（按 postId）=====
    static async getPost({ postId } = {}) {
      if (!postId) throw new Error('postId 不能为空');
      return this.fetchJson(`/posts/${encodeURIComponent(postId)}.json`);
    }

    // ===== 精细获取某话题的某楼（<=10000）=====
    static async getTopicPostFull({ topicId, postNumber = 1, maxChars = 10000 } = {}) {
      if (topicId === undefined || topicId === null || topicId === '') throw new Error('topicId 不能为空');
      const pn = Math.max(1, parseInt(postNumber, 10) || 1);
      const max = Math.max(1000, Math.min(10000, parseInt(maxChars, 10) || 10000));

      const trunc = (s) => {
        s = String(s || '');
        return s.length > max ? (s.slice(0, max) + '\n...(截断)') : s;
      };

      let post = null;
      let title = '';
      let used = '';

      try {
        const data = await this.fetchJson(`/posts/by_number/${encodeURIComponent(topicId)}/${encodeURIComponent(pn)}.json`);
        post = data?.post || data;
        title = safeTitle(post?.topic_title, '');
        used = 'posts/by_number';
      } catch (e1) {
        try {
          const data2 = await this.fetchJson(`/t/${encodeURIComponent(topicId)}/${encodeURIComponent(pn)}.json`);
          title = safeTitle(data2?.title, `话题 ${topicId}`);
          const ps = data2?.post_stream?.posts || [];
          post = ps.find(x => x?.post_number === pn) || ps[0] || null;
          used = 't/{topicId}/{postNumber}.json';
        } catch (e2) {
          throw new Error(`获取失败：by_number与topic视图都不可用。\n- by_number: ${String(e1?.message || e1)}\n- topic_view: ${String(e2?.message || e2)}`);
        }
      }

      if (!post) throw new Error('未找到该楼层帖子');

      const cooked = trunc(post.cooked || '');
      const raw = trunc(post.raw || '');

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
  const TOOLS_SPEC = [
    '可用工具：',
    '1) discourse.search: {q:string, page?:number, limit?:number}',
    '2) discourse.getTopicAllPosts: {topicId:number|string, batchSize?:number, maxPosts?:number}',
    '3) discourse.getUserRecent: {username:string, limit?:number}',
    '4) discourse.getCategories: {}',
    '5) discourse.listLatestTopics: {page?:number}', // ✅ no_definitions=true
    '6) discourse.listTopTopics: {period?:string, page?:number}', // ✅ no_definitions=true
    '7) discourse.getTagTopics: {tag:string, page?:number}', // ✅ no_definitions=true
    '8) discourse.getUserSummary: {username:string}  // ✅ Rich: 用户信息 + 徽章 + 热门话题/热门帖子 + 近期内容',
    '9) discourse.getPost: {postId:number|string}',
    '10) discourse.getTopicPostFull: {topicId:number|string, postNumber:number, maxChars?:number}', // <=10000
    '11) discourse.listLatestPosts: {before?:number|string|null, limit?:number}  // ✅ 站点最新帖子列表',
  ].join('\n');

  async function runTool(name, args) {
    if (name === 'discourse.search') return DiscourseAPI.search(args);
    if (name === 'discourse.getTopicAllPosts') return DiscourseAPI.getTopicAllPosts(args);
    if (name === 'discourse.getUserRecent') return DiscourseAPI.getUserRecent(args);
    if (name === 'discourse.getCategories') return DiscourseAPI.getCategories();
    if (name === 'discourse.listLatestTopics') return DiscourseAPI.listLatestTopics(args);
    if (name === 'discourse.listTopTopics') return DiscourseAPI.listTopTopics(args);
    if (name === 'discourse.getTagTopics') return DiscourseAPI.getTagTopics(args);
    if (name === 'discourse.getUserSummary') return DiscourseAPI.getUserSummary(args);
    if (name === 'discourse.getPost') return DiscourseAPI.getPost(args);
    if (name === 'discourse.getTopicPostFull') return DiscourseAPI.getTopicPostFull(args);
    if (name === 'discourse.listLatestPosts') return DiscourseAPI.listLatestPosts(args);
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

    const norm = (s) => stripHtml(String(s || '')).replace(/\s+/g, ' ').trim();
    const cut = (s, n) => {
      s = String(s || '');
      return s.length > n ? (s.slice(0, n) + '…') : s;
    };

    const kv = (k, v) => (v === undefined || v === null || v === '') ? '' : `${k}: ${v}`;
    const joinNonEmpty = (arr, sep = '\n') => arr.filter(Boolean).join(sep);
    const clampCtx = (text) => clamp(text, MAX_CONTEXT_CHARS);

    if (name === 'discourse.search') {
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
      const header = `【TOOL_RESULT discourse.search | q=${result?.q ?? ''} | page=${result?.page ?? ''} | returned=${posts.length}】`;
      return clampCtx(header + '\n' + lines.join('\n\n'));
    }

    if (name === 'discourse.getUserRecent') {
      const items = (result?.items || []).slice(0, LIMITS.user_recent_items);
      const lines = items.map((x, i) => {
        const ex = cut(norm(x.excerpt), LIMITS.user_recent_excerpt);
        const typ = x.action_type === 4 ? '发帖' : (x.action_type === 5 ? '回帖' : `动作${x.action_type}`);
        return joinNonEmpty([
          `${i + 1}. ${typ} | ${safeTitle(x.title, `话题 ${x.topic_id}`)}`,
          `- topic_id: ${x.topic_id} | post_number: ${x.post_number}`,
          `- created_at: ${x.created_at}`,
          `- 摘要: ${ex}`,
          `- 链接: ${x.url}`,
        ]);
      });
      const header = `【TOOL_RESULT discourse.getUserRecent | @${result?.username ?? ''} | returned=${items.length}】`;
      return clampCtx(header + '\n' + lines.join('\n\n'));
    }

    if (name === 'discourse.getTopicAllPosts') {
      const postsAll = (result?.posts || []);
      const count = postsAll.length;

      const head = postsAll.slice(0, LIMITS.topic_head_posts);
      const tail = (count > LIMITS.topic_head_posts)
        ? postsAll.slice(Math.max(LIMITS.topic_head_posts, count - LIMITS.topic_tail_posts))
        : [];

      const formatPost = (p) => {
        const isOP = (p.post_number === 1);
        const n = isOP ? Math.max(LIMITS.topic_excerpt, LIMITS.topic_op_extra) : LIMITS.topic_excerpt;
        const ex = cut(norm(p.cooked), n);
        const likes = (p.like_count !== undefined) ? ` | likes=${p.like_count}` : '';
        return joinNonEmpty([
          `#${p.post_number} @${p.username} ${p.created_at}${likes}`,
          `- 摘要: ${ex}`,
          `- 链接: ${p.url}`,
        ]);
      };

      const headLines = head.map(formatPost);
      const tailLines = tail.map(formatPost);

      const header = joinNonEmpty([
        `【TOOL_RESULT discourse.getTopicAllPosts | ${safeTitle(result?.title, `话题 ${result?.topicId}`)}】`,
        `topicId: ${result?.topicId} | total_posts: ${count}`,
        `hint: 已提供“前${head.length}楼 + 后${tailLines.length}楼”，用于同时覆盖 OP 与最新进展`,
      ]);

      const midGap = (tailLines.length && count > head.length + tailLines.length)
        ? `\n\n…（中间省略 ${count - head.length - tailLines.length} 楼，为节省上下文；如需可用 discourse.getTopicPostFull 抓取指定楼层全文）…\n\n`
        : '\n\n';

      return clampCtx(header + '\n\n' + headLines.join('\n\n') + midGap + tailLines.join('\n\n'));
    }

    if (name === 'discourse.getCategories') {
      const cats = (result?.category_list?.categories || []).slice(0, LIMITS.categories_items);
      const lines = cats.map((c, i) => {
        const slug = c.slug || c.name || '';
        const url = `${location.origin}/c/${encodeURIComponent(slug)}/${c.id}`;
        const desc = cut(norm(c.description || c.description_text || ''), 260);
        return joinNonEmpty([
          `${i + 1}. ${safeTitle(c.name, `分类 ${c.id}`)} (id=${c.id}, slug=${c.slug || ''})`,
          joinNonEmpty([
            kv('- topics', c.topic_count),
            kv('posts', c.post_count),
            kv('users', c.user_count),
            kv('position', c.position),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          desc ? `- 描述: ${desc}` : '',
          `- 链接: ${url}`,
        ]);
      });
      const header = `【TOOL_RESULT discourse.getCategories | returned=${cats.length}】`;
      return clampCtx(header + '\n' + lines.join('\n\n'));
    }

    if (name === 'discourse.listLatestTopics' || name === 'discourse.listTopTopics' || name === 'discourse.getTagTopics') {
      const topics = (result?.topic_list?.topics || []).slice(0, LIMITS.list_topics_items);

      const metaBits = [];
      if (name === 'discourse.getTagTopics') metaBits.push(kv('tag', result?.tag || result?.tag_name || ''));
      if (name === 'discourse.listTopTopics') metaBits.push(kv('period', result?.period || ''));
      metaBits.push(kv('page', result?.topic_list?.page || result?.page || ''));

      const moreUrl = result?.topic_list?.more_topics_url || result?.topic_list?.more_topics_url;
      const topTags = Array.isArray(result?.topic_list?.top_tags) ? result.topic_list.top_tags.slice(0, 15) : [];

      const lines = topics.map((t, i) => {
        const url = DiscourseAPI.topicUrl(t.id, 1);
        const title = safeTitle(t.fancy_title || t.title, `话题 ${t.id}`);
        const tags = Array.isArray(t.tags) ? t.tags.join(',') : '';
        const last = t.last_posted_at || t.bumped_at || '';
        const postsCount = (t.posts_count !== undefined) ? t.posts_count : undefined;
        const replies = (t.reply_count !== undefined) ? t.reply_count : (postsCount !== undefined ? Math.max(0, postsCount - 1) : undefined);

        return joinNonEmpty([
          `${i + 1}. ${title}`,
          joinNonEmpty([
            kv('- topic_id', t.id),
            kv('category_id', t.category_id),
            kv('tags', tags),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          joinNonEmpty([
            kv('- posts_count', postsCount),
            kv('replies', replies),
            kv('views', t.views),
            kv('like_count', t.like_count),
            kv('last', last),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          `- 链接: ${url}`,
        ]);
      });

      const header = `【TOOL_RESULT ${name} | ${metaBits.filter(Boolean).join(' | ')} | returned=${topics.length}】`;
      const extra = joinNonEmpty([
        moreUrl ? `more_topics_url: ${location.origin}${moreUrl}` : '',
        topTags.length ? `top_tags: ${topTags.join(', ')}` : '',
      ]);

      return clampCtx(header + '\n' + (extra ? (extra + '\n\n') : '') + lines.join('\n\n'));
    }

    // ✅ Rich UserSummary：展示用户信息 + 热门话题/热门帖子 + 近期内容 + 关键链接
    if (name === 'discourse.getUserSummary') {
      const r = result || {};
      const u = r.profile || {};
      const s = r.summary || {};
      const hotTopics = (r.hot_topics || []).slice(0, LIMITS.user_hot_topics);
      const hotPosts = (r.hot_posts || []).slice(0, LIMITS.user_hot_posts);
      const recTopics = (r.recent_topics || []).slice(0, LIMITS.user_recent_topics);
      const recPosts = (r.recent_posts || []).slice(0, LIMITS.user_recent_posts);

      const base = [
        `【TOOL_RESULT discourse.getUserSummary | @${r.username || ''} | Rich】`,
        r.urls?.profile ? `profile: ${r.urls.profile}` : '',
        r.urls?.summary ? `summary: ${r.urls.summary}` : '',
        '',
        '--- 用户信息 ---',
        joinNonEmpty([
          kv('id', u.id),
          kv('username', u.username ? '@' + u.username : ''),
          kv('name', u.name),
          kv('title', u.title),
          kv('trust_level', u.trust_level),
          kv('badge_count', u.badge_count),
        ], ' | '),
        joinNonEmpty([
          kv('created_at', u.created_at),
          kv('last_seen_at', u.last_seen_at),
          kv('last_posted_at', u.last_posted_at),
        ], ' | '),
        u.website ? `website: ${u.website}` : '',
        u.profile_view_count !== undefined ? `profile_view_count: ${u.profile_view_count}` : '',
        '',
        '--- 统计摘要 ---',
        joinNonEmpty([
          kv('topic_count', s.topic_count),
          kv('reply_count', s.reply_count),
          kv('likes_given', s.likes_given),
          kv('likes_received', s.likes_received),
        ], ' | '),
        joinNonEmpty([
          kv('days_visited', s.days_visited),
          kv('posts_read_count', s.posts_read_count),
          kv('time_read', s.time_read),
        ], ' | '),
      ].filter(Boolean);

      const fmtTopic = (t, i) => {
        const tags = Array.isArray(t.tags) ? t.tags.join(',') : '';
        const ex = t.excerpt ? cut(norm(t.excerpt), LIMITS.user_excerpt) : '';
        return joinNonEmpty([
          `${i + 1}. ${safeTitle(t.title, `话题 ${t.topic_id}`)}`,
          joinNonEmpty([
            kv('- topic_id', t.topic_id),
            kv('category_id', t.category_id),
            kv('tags', tags),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          joinNonEmpty([
            kv('- likes', t.like_count),
            kv('views', t.views),
            kv('replies', t.reply_count),
            kv('last', t.last_posted_at),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          ex ? `- 摘要: ${ex}` : '',
          t.url ? `- 链接: ${t.url}` : '',
        ]);
      };

      const fmtPost = (p, i) => {
        const ex = cut(norm(p.excerpt || p.cooked || ''), LIMITS.user_excerpt);
        return joinNonEmpty([
          `${i + 1}. ${safeTitle(p.title, `话题 ${p.topic_id}`)} #${p.post_number}`,
          joinNonEmpty([
            kv('- topic_id', p.topic_id),
            kv('post_number', p.post_number),
            kv('likes', p.like_count),
            kv('author', p.username ? '@' + p.username : ''),
            kv('created_at', p.created_at),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          ex ? `- 摘要: ${ex}` : '',
          p.url ? `- 链接: ${p.url}` : '',
        ]);
      };

      const sections = [];

      if (hotTopics.length) {
        sections.push(['', '--- 热门话题（Top Topics / Hot Topics）---', ...hotTopics.map(fmtTopic)].join('\n'));
      }
      if (hotPosts.length) {
        sections.push(['', '--- 热门帖子（Top Replies / Hot Posts）---', ...hotPosts.map(fmtPost)].join('\n'));
      }
      if (recTopics.length) {
        sections.push(['', '--- 近期话题（Recent Topics）---', ...recTopics.map(fmtTopic)].join('\n'));
      }
      if (recPosts.length) {
        sections.push(['', '--- 近期发言（Recent Posts）---', ...recPosts.map(fmtPost)].join('\n'));
      }

      const badgeHint = (r.badges?.user_badges && r.badges?.badges)
        ? `\n--- 徽章（Badges）---\nuser_badges: ${Array.isArray(r.badges.user_badges) ? r.badges.user_badges.length : 'n/a'} | badges: ${Array.isArray(r.badges.badges) ? r.badges.badges.length : 'n/a'}`
        : '';

      return clampCtx(base.join('\n') + '\n' + sections.join('\n') + badgeHint);
    }

    if (name === 'discourse.getPost') {
      const p = result?.post || result || {};
      const cooked = cut(norm(p.cooked || ''), LIMITS.post_excerpt);
      const raw = cut(String(p.raw || ''), Math.min(1200, LIMITS.post_excerpt));
      const url = (p.topic_id && p.post_number) ? DiscourseAPI.topicUrl(p.topic_id, p.post_number) : '';

      const lines = [
        `【TOOL_RESULT discourse.getPost】`,
        `id: ${p.id || ''}`,
        joinNonEmpty([
          kv('topic_id', p.topic_id),
          kv('post_number', p.post_number),
          kv('author', p.username ? '@' + p.username : ''),
          kv('created_at', p.created_at),
        ], ' | '),
        url ? `- 链接: ${url}` : '',
        cooked ? `- cooked 摘要: ${cooked}` : '',
        raw ? `- raw 摘要: ${raw}` : '',
      ].filter(Boolean);

      return clampCtx(lines.join('\n'));
    }

    if (name === 'discourse.getTopicPostFull') {
      const r = result || {};
      const cookedHint = cut(norm(r.cooked || ''), LIMITS.topic_post_full_cooked_hint);

      const lines = [
        `【TOOL_RESULT discourse.getTopicPostFull | ${safeTitle(r.title, `话题 ${r.topicId}`)}】`,
        `topicId: ${r.topicId} | post_number: ${r.post_number} | postId: ${r.postId || ''}`,
        `author: @${r.username || ''} | created_at: ${r.created_at || ''}`,
        `endpointUsed: ${r.endpointUsed || ''} | maxChars: ${r.maxChars || ''}`,
        r.url ? `- 链接: ${r.url}` : '',
        cookedHint ? `- cooked(提示): ${cookedHint}` : '',
        '',
        '--- raw（全文，已限制 <=10000 字符） ---',
        String(r.raw || ''),
      ].filter(Boolean);

      return clampCtx(lines.join('\n'));
    }

    // ✅ 最新帖子列表（站点级）
    if (name === 'discourse.listLatestPosts') {
      const posts = (result?.posts || []).slice(0, LIMITS.latest_posts_items);
      const lines = posts.map((p, i) => {
        const ex = cut(norm(p.cooked || p.raw || ''), LIMITS.latest_posts_excerpt);
        return joinNonEmpty([
          `${i + 1}. @${p.username || ''} | topic=${p.topic_id} #${p.post_number}`,
          joinNonEmpty([
            kv('- post_id', p.id),
            kv('likes', p.like_count),
            kv('created_at', p.created_at),
          ], ' | ').replace(/^\s*\|\s*/,'- '),
          ex ? `- 摘要: ${ex}` : '',
          p.url ? `- 链接: ${p.url}` : '',
        ]);
      });

      const header = `【TOOL_RESULT discourse.listLatestPosts | before=${result?.before ?? 'null'} | returned=${posts.length}】`;
      return clampCtx(header + '\n' + lines.join('\n\n'));
    }

    try {
      const text = JSON.stringify(result, null, 2);
      return clampCtx(`【TOOL_RESULT ${name} | fallback_json】\n` + text);
    } catch {
      return clampCtx(`【TOOL_RESULT ${name} | fallback_text】\n` + String(result));
    }
  }

  /******************************************************************
   * 5) OpenAI Chat Completions 客户端
   ******************************************************************/
  function parseRetryAfterMs(responseHeaders) {
    try {
      const m = String(responseHeaders || '').match(/^\s*retry-after\s*:\s*([^\r\n]+)\s*$/im);
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

  function gmRequestOnce({ url, headers, bodyObj, timeoutMs = 30000 }) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json', ...(headers || {}) },
        data: JSON.stringify(bodyObj),
        timeout: timeoutMs,

        onload: (res) => resolve(res),
        onerror: (e) => reject(new Error(`网络错误: ${e?.error || e}`)),
        ontimeout: () => reject(new Error(`请求超时: ${timeoutMs}ms`)),
      });
    });
  }

  async function gmPostJson(url, headers, bodyObj, opt = {}) {
    const {
      retries = 3,
      baseDelayMs = 400,
      maxDelayMs = 8000,
      timeoutMs = 30000,
      onlyStatus200 = true,
    } = opt;

    let lastErr;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await gmRequestOnce({ url, headers, bodyObj, timeoutMs });

        const ok = onlyStatus200 ? (res.status === 200) : (res.status >= 200 && res.status < 300);
        if (!ok) {
          const headRetryMs = parseRetryAfterMs(res.responseHeaders);
          const bodyPreview = String(res.responseText || '').slice(0, 800);
          const err = new Error(`HTTP ${res.status}: ${bodyPreview}`);
          err._httpStatus = res.status;
          err._retryAfterMs = headRetryMs;
          throw err;
        }

        try {
          return JSON.parse(res.responseText);
        } catch {
          throw new Error('响应 JSON 解析失败');
        }
      } catch (e) {
        lastErr = e;
        if (attempt === retries) break;

        const ra = e?._retryAfterMs;
        const backoff = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
        const jitter = Math.floor(Math.random() * 200);
        const waitMs = (typeof ra === 'number') ? ra : (backoff + jitter);

        await sleep(waitMs);
        continue;
      }
    }

    throw lastErr || new Error('请求失败');
  }

  async function callOpenAIChat(messages, conf) {
    const base = String(conf.baseUrl || '').replace(/\/+$/, '');
    const url = base.endsWith('/chat/completions') ? base : (base + '/chat/completions');

    const payload = {
      model: conf.model,
      temperature: conf.temperature ?? 0.2,
      messages,
    };

    const json = await gmPostJson(
      url,
      { Authorization: `Bearer ${conf.apiKey}` },
      payload,
      { retries: 3, onlyStatus200: true }
    );

    const text = json?.choices?.[0]?.message?.content ?? '';
    return String(text);
  }

  /******************************************************************
   * 6) JSON 修复逻辑（find / rfind + 回写 history）
   ******************************************************************/
  function parseModelJsonWithRepair(raw, sessionId, store) {
    const original = String(raw ?? '');

    try {
      const obj = JSON.parse(original);
      return { ok: true, obj, repaired: false, jsonText: original };
    } catch {}

    // 兼容：有些模型会把 JSON 包在前后文本里
    const first = original.indexOf('{');
    const last = original.lastIndexOf('}');
    if (first >= 0 && last > first) {
      const sliced = original.slice(first, last + 1);

      store.updateLastAgent(sessionId,
        (m) => m && m.kind === 'model_raw',
        (m) => ({ ...m, kind: 'model_json_repaired', content: sliced, repairedFrom: original })
      );

      try {
        const obj = JSON.parse(sliced);
        return { ok: true, obj, repaired: true, jsonText: sliced };
      } catch (e) {
        return { ok: false, err: '切片后仍无法解析 JSON', detail: String(e?.message || e), sliced };
      }
    }

    return { ok: false, err: '未找到可用的 JSON 对象边界 { ... }', detail: original.slice(0, 400) };
  }

  /******************************************************************
   * 7) Agent 引擎（FSM + 多轮工具调用）
   ******************************************************************/
  function buildLLMMessagesFromSession(session, conf) {
    const msgs = [];
    msgs.push({ role: 'system', content: conf.systemPrompt + '\n\n' + TOOLS_SPEC });

    const chunks = [];

    for (const m of (session.chat || [])) {
      if (!m?.role || !m?.content) continue;
      chunks.push({ role: m.role, content: String(m.content) });
    }

    for (const a of (session.agent || [])) {
      if (!a?.content) continue;
      if (a.kind === 'tool_context') {
        chunks.push({ role: 'assistant', content: a.content });
      }
    }

    // maxContextChars=0 表示不限制
    const max = conf.maxContextChars || 0;
    if (max > 0) {
      let total = 0;
      const kept = [];
      for (let i = chunks.length - 1; i >= 0; i--) {
        const c = chunks[i];
        const len = (c.content || '').length;
        if (total + len > max) break;
        kept.push(c);
        total += len;
      }
      kept.reverse();
      msgs.push(...kept);
    } else {
      // 不限制，全部保留
      msgs.push(...chunks);
    }

    return msgs;
  }

  async function runAgentTurn(sessionId, store, conf, ui) {
    const session = store.all().find(s => s.id === sessionId);
    if (!session) throw new Error('session not found');

    store.setFSM(sessionId, { state: FSM.WAITING_MODEL, isRunning: true, step: (session.fsm?.step || 0) + 1, lastError: null });
    ui?.renderAll?.();

    const llmMessages = buildLLMMessagesFromSession(session, conf);
    const raw = await callOpenAIChat(llmMessages, conf);

    store.pushAgent(sessionId, { role: 'agent', kind: 'model_raw', content: raw, ts: now() });

    const parsed = parseModelJsonWithRepair(raw, sessionId, store);
    if (!parsed.ok) {
      store.pushAgent(sessionId, { role: 'agent', kind: 'model_parse_error', content: JSON.stringify(parsed, null, 2), ts: now() });
      store.setFSM(sessionId, { state: FSM.ERROR, isRunning: false, lastError: parsed.err || 'parse error' });
      ui?.renderAll?.();
      throw new Error(parsed.err || '模型 JSON 解析失败');
    }

    const obj = parsed.obj;

    if (obj.type === 'final') {
      const answer = String(obj.answer ?? '').trim() || '(空回答)';

      let refsMd = '';
      if (Array.isArray(obj.refs) && obj.refs.length) {
        const seen = new Set();
        const cleaned = obj.refs
          .map(x => ({
            title: mdEscapeText(String(x?.title ?? '').trim() || '链接'),
            url: String(x?.url ?? '').trim(),
          }))
          .filter(x => x.url && !seen.has(x.url) && (seen.add(x.url), true));

        if (cleaned.length) {
          refsMd = '\n\n---\n**参考链接（refs）**\n' + cleaned.map((r, i) => `${i + 1}. [${r.title}](${r.url})`).join('\n');
        }
      }

      const finalContent = answer + refsMd;
      store.pushChat(sessionId, { role: 'assistant', content: finalContent, ts: now() });

      if (Array.isArray(obj.refs) && obj.refs.length) {
        store.pushAgent(sessionId, { role: 'agent', kind: 'final_refs', content: JSON.stringify(obj.refs, null, 2), ts: now() });
      }

      store.setFSM(sessionId, { state: FSM.DONE, isRunning: false });
      ui?.renderAll?.();
      return { done: true, obj };
    }

    if (obj.type === 'tool') {
      const name = String(obj.name || '').trim();
      const args = obj.args || {};
      if (!name) throw new Error('工具调用缺少 name');

      store.setFSM(sessionId, { state: FSM.WAITING_TOOL, isRunning: true });
      store.pushAgent(sessionId, { role: 'agent', kind: 'tool_call', content: JSON.stringify({ name, args }, null, 2), ts: now() });
      ui?.renderAll?.();

      let result;
      try {
        result = await runTool(name, args);
      } catch (e) {
        const errMsg = `【TOOL_RESULT ERROR ${name}】\nargs=${JSON.stringify(args)}\nerror=${String(e?.message || e)}`;
        store.pushAgent(sessionId, { role: 'tool', kind: 'tool_context', content: errMsg, ts: now(), toolName: name });

        store.setFSM(sessionId, { state: FSM.RUNNING, isRunning: true });
        ui?.renderAll?.();
        return { done: false, obj: { type: 'tool_error' } };
      }

      const toolCtx = toolResultToContext(name, result);
      store.pushAgent(sessionId, { role: 'tool', kind: 'tool_context', content: toolCtx, ts: now(), toolName: name });

      store.setFSM(sessionId, { state: FSM.RUNNING, isRunning: true });
      ui?.renderAll?.();
      return { done: false, obj: { type: 'tool_ok' } };
    }

    store.pushAgent(sessionId, { role: 'agent', kind: 'model_unknown_type', content: JSON.stringify(obj, null, 2), ts: now() });
    store.setFSM(sessionId, { state: FSM.ERROR, isRunning: false, lastError: 'unknown type' });
    ui?.renderAll?.();
    throw new Error(`未知 type: ${obj.type}`);
  }

  async function runAgent(sessionId, store, conf, ui) {
    const session = store.all().find(s => s.id === sessionId);
    if (!session) throw new Error('session not found');
    if (!conf.apiKey) throw new Error('请先在设置中填写 API Key');

    if (session.fsm?.isRunning) return;

    store.setFSM(sessionId, { state: FSM.RUNNING, isRunning: true, lastError: null });
    ui?.renderAll?.();

    // maxTurns=0 表示不限制，使用一个很大的数
    const maxTurns = (conf.maxTurns === 0) ? 999 : Math.max(1, Math.min(100, parseInt(conf.maxTurns || 8, 10)));

    try {
      for (let i = 0; i < maxTurns; i++) {
        const r = await runAgentTurn(sessionId, store, conf, ui);
        if (r.done) return r.obj;
        await sleep(80);
      }
      store.setFSM(sessionId, { state: FSM.ERROR, isRunning: false, lastError: '超过 maxTurns 仍未 final' });
      ui?.renderAll?.();
      throw new Error('超过 maxTurns 仍未得到 final');
    } catch (e) {
      store.setFSM(sessionId, { state: FSM.ERROR, isRunning: false, lastError: String(e?.message || e) });
      ui?.renderAll?.();
      throw e;
    }
  }

  /******************************************************************
   * 8) 前端 UI（抽屉式 + 多会话管理 + 设置面板 + ✅AG拖动）
   ******************************************************************/
  const STYLES = `
    :root{
      --a-bg: rgba(250,250,252,.97);
      --a-card: rgba(255,255,255,.95);
      --a-text: #0e1116;
      --a-sub: #405060;
      --a-border: rgba(0,0,0,.16);
      --a-shadow: 0 18px 44px rgba(0,0,0,.18);
      --a-primary:#1f6dff;
      --a-user:#e8f0ff;
      --a-ass:#ffffff;
      --a-tool:#fff8db;
      --a-code:#f6f8fa;
      --a-codeText:#24292f;
      --a-debug:#f0f4f8;
    }
    @media (prefers-color-scheme: dark){
      :root{
        --a-bg: rgba(16,18,24,.94);
        --a-card: rgba(25,27,36,.92);
        --a-text: #f2f5f8;
        --a-sub: #c7ced9;
        --a-border: rgba(255,255,255,.18);
        --a-shadow: 0 22px 60px rgba(0,0,0,.6);
        --a-primary:#6aa2ff;
        --a-user:#1f2736;
        --a-ass:#171b23;
        --a-tool:#262c39;
        --a-code:#161b22;
        --a-codeText:#d9e1ee;
        --a-debug:#1c2128;
      }
    }

    /* AG 悬浮球 */
    #${APP_PREFIX}fab{
      position:fixed;
      left: calc(100vw - 70px);
      top: 16px;
      width:52px; height:52px; border-radius:14px;
      background: var(--a-card);
      border:1px solid var(--a-border);
      box-shadow: var(--a-shadow);
      z-index:100003;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; user-select:none;
      color: var(--a-primary);
      font-weight:900;
      touch-action: none;
    }
    #${APP_PREFIX}fab.dragging{
      cursor: grabbing;
      opacity: .92;
      transform: scale(1.02);
    }

    /* 悬浮窗口（类似DevTools） */
    #${APP_PREFIX}drawer{
      position:fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      width: 900px;
      height: 600px;
      min-width: 600px;
      min-height: 400px;
      max-width: 95vw;
      max-height: 90vh;
      z-index:100002;
      background: var(--a-bg);
      border:1px solid var(--a-border);
      box-shadow: var(--a-shadow);
      border-radius:12px;
      backdrop-filter: blur(18px);
      display:none;
      flex-direction:column;
      color: var(--a-text);
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
      opacity: 0;
      transition: opacity .2s ease, transform .2s ease;
      overflow: hidden;
      resize: both;
    }
    #${APP_PREFIX}drawer.open{
      display:flex;
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    /* 窗口被拖动后使用绝对定位 */
    #${APP_PREFIX}drawer.positioned{
      transform: none;
      left: auto;
      top: auto;
    }

    /* 窗口标题栏（可拖动） */
    .${APP_PREFIX}header{
      padding:10px 14px;
      border-bottom:1px solid var(--a-border);
      display:flex; align-items:center; justify-content:space-between;
      background: var(--a-card);
      flex-shrink:0;
      cursor: move;
      user-select: none;
    }
    .${APP_PREFIX}title{
      font-weight:900; letter-spacing:.2px;
      display:flex; align-items:center; gap:10px;
      color: var(--a-primary);
      font-size: 14px;
    }
    .${APP_PREFIX}badge{
      font-size:11px; padding:2px 6px; border-radius:999px;
      border:1px solid var(--a-border);
      color: var(--a-sub);
      font-weight:700;
    }
    .${APP_PREFIX}actions{ display:flex; align-items:center; gap:8px; color:var(--a-sub); }
    .${APP_PREFIX}icon{
      cursor:pointer; padding:6px 10px; border-radius:8px;
      border:1px solid var(--a-border);
      background: rgba(127,127,127,.06);
      color: var(--a-text);
      font-weight:800;
      font-size: 12px;
    }
    .${APP_PREFIX}icon:hover{ border-color: var(--a-primary); }

    .${APP_PREFIX}body{ flex:1; display:flex; min-height:0; overflow:hidden; }

    /* 侧边栏 */
    .${APP_PREFIX}sidebar{
      width: 240px;
      border-right:1px solid var(--a-border);
      padding:10px;
      overflow:auto;
      background: linear-gradient(180deg, rgba(127,127,127,.04), transparent);
      flex-shrink: 0;
      transition: width .2s ease, padding .2s ease;
    }
    .${APP_PREFIX}sidebar.collapsed{
      width: 0;
      padding: 0;
      overflow: hidden;
    }
    .${APP_PREFIX}sideTop{ display:flex; gap:6px; margin-bottom:10px; }
    .${APP_PREFIX}btn{
      border:none; cursor:pointer; border-radius:10px;
      padding:7px 10px; font-weight:800;
      background: var(--a-primary); color:#fff;
      font-size: 12px;
    }
    .${APP_PREFIX}btn:hover{ filter:brightness(1.05); }
    .${APP_PREFIX}btn:disabled{ opacity: .5; cursor: not-allowed; }
    .${APP_PREFIX}btnGhost{
      background: transparent; color: var(--a-text);
      border:1px solid var(--a-border);
      font-weight:800;
    }
    .${APP_PREFIX}sessions{ display:flex; flex-direction:column; gap:6px; }
    .${APP_PREFIX}session{
      border:1px solid var(--a-border);
      border-radius:10px;
      padding:8px 10px;
      background: var(--a-card);
      display:flex; justify-content:space-between; align-items:center; gap:6px;
      cursor:pointer;
      position: relative;
    }
    .${APP_PREFIX}session.active{ border-color: var(--a-primary); box-shadow: 0 0 0 2px rgba(0,214,255,.18) inset; }
    .${APP_PREFIX}session .info{
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    /* 标题行：默认占满宽度，hover时收缩让出操作按钮空间 */
    .${APP_PREFIX}session .t{
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      font-weight:800; color: var(--a-text);
      font-size: 13px;
      transition: max-width .15s ease;
    }
    .${APP_PREFIX}session:hover .t{
      max-width: 100px;
    }
    .${APP_PREFIX}session .s{
      font-size:11px; color: var(--a-sub); font-weight:700;
    }
    /* 操作按钮：默认隐藏，hover时显示 */
    .${APP_PREFIX}ops{
      display: none;
      gap: 4px;
      flex-shrink: 0;
    }
    .${APP_PREFIX}session:hover .${APP_PREFIX}ops{
      display: flex;
    }
    .${APP_PREFIX}op{
      padding:4px 6px; border-radius:6px; border:1px solid var(--a-border);
      background: rgba(127,127,127,.06);
      cursor:pointer; user-select:none;
      font-size: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .${APP_PREFIX}op:hover{ border-color: var(--a-primary); background: var(--a-primary); color: #fff; }
    .${APP_PREFIX}op svg{ width: 12px; height: 12px; }

    .${APP_PREFIX}main{ flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }

    /* 聊天区域 */
    .${APP_PREFIX}chat{
      flex:1; overflow:auto; padding: 16px 18px;
      line-height:1.7; font-size:14px;
    }

    /* 消息气泡样式 - 对话布局 */
    .${APP_PREFIX}msgWrap{
      display: flex;
      margin: 8px 0;
    }
    .${APP_PREFIX}msgWrap.user{
      justify-content: flex-end;
    }
    .${APP_PREFIX}msgWrap.assistant,
    .${APP_PREFIX}msgWrap.tool,
    .${APP_PREFIX}msgWrap.error{
      justify-content: flex-start;
    }
    .${APP_PREFIX}msg{
      max-width: 75%;
      padding: 10px 14px;
      border-radius:16px;
      color: var(--a-text);
      font-size: 14px;
      position: relative;
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}msg{
      background: var(--a-primary);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}msg a{ color: #fff; }
    .${APP_PREFIX}msgWrap.assistant .${APP_PREFIX}msg{
      background: var(--a-card);
      border:1px solid var(--a-border);
      border-bottom-left-radius: 4px;
    }
    .${APP_PREFIX}msgWrap.tool .${APP_PREFIX}msg{
      background: var(--a-tool);
      border:1px dashed var(--a-border);
      border-bottom-left-radius: 4px;
      font-size: 13px;
    }
    .${APP_PREFIX}msgWrap.error .${APP_PREFIX}msg{
      background: #ffebee;
      border:1px solid #f44336;
      border-bottom-left-radius: 4px;
      color: #c62828;
    }
    @media (prefers-color-scheme: dark){
      .${APP_PREFIX}msgWrap.error .${APP_PREFIX}msg{
        background: #2d1f1f;
        border-color: #b71c1c;
        color: #ef9a9a;
      }
    }
    .${APP_PREFIX}meta{
      font-size:11px; color: var(--a-sub);
      margin-bottom:4px;
      font-weight:700;
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}meta{
      color: rgba(255,255,255,.7);
    }
    .${APP_PREFIX}md a{ color: var(--a-primary); text-decoration: underline; text-underline-offset:2px; }
    .${APP_PREFIX}md code{ background: rgba(127,127,127,.16); padding: 2px 6px; border-radius: 6px; font-size: 13px; }
    .${APP_PREFIX}md pre{
      background: var(--a-code); color: var(--a-codeText);
      padding: 10px; border-radius:10px; overflow:auto;
      border:1px solid var(--a-border);
      font-size: 13px;
    }

    /* 调试信息样式 - 符合主题 */
    .${APP_PREFIX}debugBlock{
      background: var(--a-debug);
      border: 1px solid var(--a-border);
      border-radius: 10px;
      padding: 10px 12px;
      margin: 8px 0;
      font-size: 12px;
      color: var(--a-sub);
    }
    .${APP_PREFIX}debugBlock pre{
      background: var(--a-code);
      color: var(--a-codeText);
      padding: 8px;
      border-radius: 6px;
      overflow: auto;
      margin: 6px 0 0 0;
      font-size: 11px;
      border: 1px solid var(--a-border);
    }

    /* 输入区域 */
    .${APP_PREFIX}composer{
      border-top:1px solid var(--a-border);
      padding:10px 14px;
      display:flex; gap:10px; align-items:flex-end;
      background: var(--a-card);
    }
    .${APP_PREFIX}ta{
      flex:1;
      min-height:40px; max-height:150px;
      resize:none;
      border-radius:12px;
      border:1px solid var(--a-border);
      padding:10px 12px;
      background: var(--a-bg);
      color: var(--a-text);
      outline:none;
      font-size: 14px;
    }
    .${APP_PREFIX}ta:focus{ border-color: var(--a-primary); }
    .${APP_PREFIX}smallToggle{ display:flex; align-items:center; gap:5px; font-size:12px; color: var(--a-sub); font-weight:800; }
    .${APP_PREFIX}smallToggle input{ margin:0; }

    /* 发送中的气泡提示 */
    .${APP_PREFIX}thinking{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: var(--a-card);
      border: 1px solid var(--a-border);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      font-size: 13px;
      color: var(--a-sub);
    }
    .${APP_PREFIX}thinking .dots{
      display: flex;
      gap: 4px;
    }
    .${APP_PREFIX}thinking .dots span{
      width: 6px; height: 6px;
      background: var(--a-primary);
      border-radius: 50%;
      animation: ${APP_PREFIX}bounce .6s infinite alternate;
    }
    .${APP_PREFIX}thinking .dots span:nth-child(2){ animation-delay: .2s; }
    .${APP_PREFIX}thinking .dots span:nth-child(3){ animation-delay: .4s; }
    @keyframes ${APP_PREFIX}bounce{
      from{ opacity: .3; transform: translateY(0); }
      to{ opacity: 1; transform: translateY(-4px); }
    }

    /* 设置弹窗 */
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
      width: 580px; max-width: 92vw;
      max-height: 85vh;
      overflow: auto;
      border-radius: 14px;
      border:1px solid var(--a-border);
      background: var(--a-card);
      box-shadow: var(--a-shadow);
      padding: 16px;
      color: var(--a-text);
    }
    .${APP_PREFIX}formRow{ margin: 8px 0; }
    .${APP_PREFIX}formRow label{ display:block; font-size:12px; font-weight:900; color:var(--a-sub); margin-bottom:4px; }
    .${APP_PREFIX}formRow input, .${APP_PREFIX}formRow textarea{
      width:100%; box-sizing:border-box;
      border-radius: 10px;
      border:1px solid var(--a-border);
      padding: 8px 10px;
      background: var(--a-bg);
      color: var(--a-text);
      outline:none;
      font-size: 13px;
    }
    .${APP_PREFIX}formRow input:focus, .${APP_PREFIX}formRow textarea:focus{ border-color: var(--a-primary); }
    .${APP_PREFIX}formHint{ font-size: 11px; color: var(--a-sub); margin-top: 2px; }
    .${APP_PREFIX}formActions{ display:flex; justify-content:flex-end; gap:8px; margin-top: 14px; }

    #${APP_PREFIX}toast{
      position:fixed; right: 90px; top: 72px;
      z-index:100005;
      background: rgba(0,0,0,.82);
      color:#fff;
      padding: 8px 14px;
      border-radius: 999px;
      opacity:0;
      pointer-events:none;
      transition: .25s;
      font-weight:800;
      font-size: 13px;
      max-width: 60vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${APP_PREFIX}toast.show{ opacity:1; }

    /* 消息操作按钮 */
    .${APP_PREFIX}msgActions{
      display: flex;
      gap: 4px;
      margin-top: 6px;
      opacity: 0;
      transition: opacity .15s ease;
    }
    .${APP_PREFIX}msgWrap:hover .${APP_PREFIX}msgActions{
      opacity: 1;
    }
    .${APP_PREFIX}msgAction{
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--a-border);
      background: rgba(127,127,127,.08);
      cursor: pointer;
      font-size: 11px;
      color: var(--a-sub);
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all .15s ease;
    }
    .${APP_PREFIX}msgAction:hover{
      border-color: var(--a-primary);
      color: var(--a-primary);
      background: rgba(31,109,255,.08);
    }
    .${APP_PREFIX}msgAction svg{
      width: 12px;
      height: 12px;
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}msgActions{
      justify-content: flex-end;
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}msgAction{
      background: rgba(255,255,255,.15);
      border-color: rgba(255,255,255,.3);
      color: rgba(255,255,255,.8);
    }
    .${APP_PREFIX}msgWrap.user .${APP_PREFIX}msgAction:hover{
      background: rgba(255,255,255,.25);
      border-color: rgba(255,255,255,.5);
      color: #fff;
    }

    /* 现代化确认弹窗 */
    .${APP_PREFIX}confirmOverlay{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      z-index: 100010;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s ease, visibility .2s ease;
    }
    .${APP_PREFIX}confirmOverlay.open{
      opacity: 1;
      visibility: visible;
    }
    .${APP_PREFIX}confirmBox{
      background: var(--a-card);
      border: 1px solid var(--a-border);
      border-radius: 14px;
      box-shadow: var(--a-shadow);
      padding: 20px 24px;
      min-width: 300px;
      max-width: 90vw;
      transform: scale(0.9);
      transition: transform .2s ease;
    }
    .${APP_PREFIX}confirmOverlay.open .${APP_PREFIX}confirmBox{
      transform: scale(1);
    }
    .${APP_PREFIX}confirmTitle{
      font-size: 15px;
      font-weight: 800;
      color: var(--a-text);
      margin-bottom: 8px;
    }
    .${APP_PREFIX}confirmMsg{
      font-size: 13px;
      color: var(--a-sub);
      margin-bottom: 18px;
      line-height: 1.5;
    }
    .${APP_PREFIX}confirmActions{
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .${APP_PREFIX}confirmBtn{
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--a-border);
      background: var(--a-bg);
      color: var(--a-text);
      transition: all .15s ease;
    }
    .${APP_PREFIX}confirmBtn:hover{
      border-color: var(--a-primary);
    }
    .${APP_PREFIX}confirmBtn.primary{
      background: var(--a-primary);
      border-color: var(--a-primary);
      color: #fff;
    }
    .${APP_PREFIX}confirmBtn.primary:hover{
      filter: brightness(1.1);
    }
    .${APP_PREFIX}confirmBtn.danger{
      background: #dc3545;
      border-color: #dc3545;
      color: #fff;
    }
    .${APP_PREFIX}confirmBtn.danger:hover{
      filter: brightness(1.1);
    }

    /* 编辑消息弹窗 */
    .${APP_PREFIX}editOverlay{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      z-index: 100010;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s ease, visibility .2s ease;
    }
    .${APP_PREFIX}editOverlay.open{
      opacity: 1;
      visibility: visible;
    }
    .${APP_PREFIX}editBox{
      background: var(--a-card);
      border: 1px solid var(--a-border);
      border-radius: 14px;
      box-shadow: var(--a-shadow);
      padding: 20px 24px;
      width: 500px;
      max-width: 90vw;
      transform: scale(0.9);
      transition: transform .2s ease;
    }
    .${APP_PREFIX}editOverlay.open .${APP_PREFIX}editBox{
      transform: scale(1);
    }
    .${APP_PREFIX}editTitle{
      font-size: 15px;
      font-weight: 800;
      color: var(--a-text);
      margin-bottom: 12px;
    }
    .${APP_PREFIX}editTextarea{
      width: 100%;
      min-height: 120px;
      max-height: 300px;
      resize: vertical;
      border-radius: 10px;
      border: 1px solid var(--a-border);
      padding: 10px 12px;
      background: var(--a-bg);
      color: var(--a-text);
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;
    }
    .${APP_PREFIX}editTextarea:focus{
      border-color: var(--a-primary);
    }
    .${APP_PREFIX}editActions{
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 14px;
    }

    /* 输入框弹窗 */
    .${APP_PREFIX}promptOverlay{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      z-index: 100010;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s ease, visibility .2s ease;
    }
    .${APP_PREFIX}promptOverlay.open{
      opacity: 1;
      visibility: visible;
    }
    .${APP_PREFIX}promptBox{
      background: var(--a-card);
      border: 1px solid var(--a-border);
      border-radius: 14px;
      box-shadow: var(--a-shadow);
      padding: 20px 24px;
      width: 400px;
      max-width: 90vw;
      transform: scale(0.9);
      transition: transform .2s ease;
    }
    .${APP_PREFIX}promptOverlay.open .${APP_PREFIX}promptBox{
      transform: scale(1);
    }
    .${APP_PREFIX}promptTitle{
      font-size: 15px;
      font-weight: 800;
      color: var(--a-text);
      margin-bottom: 12px;
    }
    .${APP_PREFIX}promptInput{
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--a-border);
      padding: 10px 12px;
      background: var(--a-bg);
      color: var(--a-text);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    }
    .${APP_PREFIX}promptInput:focus{
      border-color: var(--a-primary);
    }
    .${APP_PREFIX}promptActions{
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 14px;
    }

    /* 折叠切换按钮 */
    .${APP_PREFIX}sideToggle{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 50px;
      background: var(--a-card);
      border: 1px solid var(--a-border);
      border-left: none;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--a-sub);
      font-size: 12px;
      z-index: 10;
    }
    .${APP_PREFIX}sideToggle:hover{ color: var(--a-primary); }
    .${APP_PREFIX}mainWrap{
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      position: relative;
    }
  `;

  class UI {
    constructor(store, confStore) {
      this.store = store;
      this.confStore = confStore;
      this.debugVisible = false;
      this.isSending = false;
      this.sideCollapsed = GM_getValue(STORE_KEYS.SIDECOLLAPSED, false);

      this._injectStyle();
      this._renderShell();
      this._applyFabPosFromStore();
      this._applyWinPosFromStore();
      this._bind();
      this._bindFabDrag();
      this._bindWinDrag();
      this.renderAll();

      GM_registerMenuCommand('打开 Linux.do Agent', () => this.toggleDrawer(true));
      GM_registerMenuCommand('清空当前会话', async () => {
        const s = this.store.active();
        try {
          await this.showConfirm('清空会话', `确定清空会话「${s.title}」吗？`, true);
          this.store.clearSession(s.id);
          this.renderAll();
          this.toast('已清空');
        } catch {
          // 取消
        }
      });
    }

    _injectStyle() {
      const el = document.createElement('style');
      el.textContent = STYLES;
      document.head.appendChild(el);
    }

    _renderShell() {
      const fab = document.createElement('div');
      fab.id = `${APP_PREFIX}fab`;
      fab.textContent = 'AG';
      fab.title = 'Linux.do Agent（可拖动）';
      document.body.appendChild(fab);

      const drawer = document.createElement('div');
      drawer.id = `${APP_PREFIX}drawer`;
      drawer.innerHTML = `
        <div class="${APP_PREFIX}header" id="${APP_PREFIX}header">
          <div class="${APP_PREFIX}title">
            Linux.do Agent <span class="${APP_PREFIX}badge">v0.3.2</span>
          </div>
          <div class="${APP_PREFIX}actions">
            <label class="${APP_PREFIX}smallToggle">
              <input type="checkbox" id="${APP_PREFIX}debugToggle" />
              调试
            </label>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnSetting">设置</button>
            <button class="${APP_PREFIX}icon" id="${APP_PREFIX}btnClose">✕</button>
          </div>
        </div>

        <div class="${APP_PREFIX}body">
          <div class="${APP_PREFIX}sidebar" id="${APP_PREFIX}sidebar">
            <div class="${APP_PREFIX}sideTop">
              <button class="${APP_PREFIX}btn" id="${APP_PREFIX}btnNew">+ 新建</button>
              <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}btnExport">导出</button>
            </div>
            <div class="${APP_PREFIX}sessions" id="${APP_PREFIX}sessions"></div>
          </div>

          <div class="${APP_PREFIX}mainWrap">
            <div class="${APP_PREFIX}sideToggle" id="${APP_PREFIX}sideToggle" title="折叠/展开侧边栏">◀</div>
            <div class="${APP_PREFIX}main">
              <div class="${APP_PREFIX}chat" id="${APP_PREFIX}chat"></div>
              <div class="${APP_PREFIX}composer">
                <textarea class="${APP_PREFIX}ta" id="${APP_PREFIX}ta" placeholder="输入问题，例如"搜索xxx""总结话题xxx""查看@用户概览"等"></textarea>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <button class="${APP_PREFIX}btn" id="${APP_PREFIX}btnSend">发送</button>
                  <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}btnResume">恢复</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      const overlay = document.createElement('div');
      overlay.className = `${APP_PREFIX}overlay`;
      overlay.innerHTML = `
        <div class="${APP_PREFIX}modal">
          <h3 style="margin:0 0 12px 0;font-size:15px;">⚙️ 设置（OpenAI Chat 格式）</h3>

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

          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:120px;">
              <label>Temperature</label>
              <input id="${APP_PREFIX}cfgTemp" type="number" step="0.05" min="0" max="1" />
            </div>
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:120px;">
              <label>maxTurns</label>
              <input id="${APP_PREFIX}cfgMaxTurns" type="number" step="1" min="0" max="100" />
              <div class="${APP_PREFIX}formHint">0 = 不限制</div>
            </div>
            <div class="${APP_PREFIX}formRow" style="flex:1;min-width:140px;">
              <label>maxContextChars</label>
              <input id="${APP_PREFIX}cfgMaxCtx" type="number" step="500" min="0" max="8000000" />
              <div class="${APP_PREFIX}formHint">0 = 不限制</div>
            </div>
          </div>

          <div class="${APP_PREFIX}formRow">
            <label>System Prompt</label>
            <textarea id="${APP_PREFIX}cfgSys" rows="5"></textarea>
          </div>

          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
            <label class="${APP_PREFIX}smallToggle" style="color:var(--a-text);">
              <input type="checkbox" id="${APP_PREFIX}cfgToolCtx" />
              将工具结果作为上下文喂给模型
            </label>
          </div>

          <div class="${APP_PREFIX}formActions">
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}cfgTest">连通性测试</button>
            <button class="${APP_PREFIX}btn ${APP_PREFIX}btnGhost" id="${APP_PREFIX}cfgCancel">取消</button>
            <button class="${APP_PREFIX}btn" id="${APP_PREFIX}cfgSave">保存</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const toast = document.createElement('div');
      toast.id = `${APP_PREFIX}toast`;
      document.body.appendChild(toast);

      // 现代化确认弹窗
      const confirmOverlay = document.createElement('div');
      confirmOverlay.className = `${APP_PREFIX}confirmOverlay`;
      confirmOverlay.innerHTML = `
        <div class="${APP_PREFIX}confirmBox">
          <div class="${APP_PREFIX}confirmTitle" id="${APP_PREFIX}confirmTitle">确认</div>
          <div class="${APP_PREFIX}confirmMsg" id="${APP_PREFIX}confirmMsg">确定要执行此操作吗？</div>
          <div class="${APP_PREFIX}confirmActions">
            <button class="${APP_PREFIX}confirmBtn" id="${APP_PREFIX}confirmCancel">取消</button>
            <button class="${APP_PREFIX}confirmBtn primary" id="${APP_PREFIX}confirmOk">确定</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmOverlay);

      // 编辑消息弹窗
      const editOverlay = document.createElement('div');
      editOverlay.className = `${APP_PREFIX}editOverlay`;
      editOverlay.innerHTML = `
        <div class="${APP_PREFIX}editBox">
          <div class="${APP_PREFIX}editTitle">编辑消息</div>
          <textarea class="${APP_PREFIX}editTextarea" id="${APP_PREFIX}editTextarea"></textarea>
          <div class="${APP_PREFIX}editActions">
            <button class="${APP_PREFIX}confirmBtn" id="${APP_PREFIX}editCancel">取消</button>
            <button class="${APP_PREFIX}confirmBtn primary" id="${APP_PREFIX}editSave">保存</button>
          </div>
        </div>
      `;
      document.body.appendChild(editOverlay);

      // 输入框弹窗（用于重命名）
      const promptOverlay = document.createElement('div');
      promptOverlay.className = `${APP_PREFIX}promptOverlay`;
      promptOverlay.innerHTML = `
        <div class="${APP_PREFIX}promptBox">
          <div class="${APP_PREFIX}promptTitle" id="${APP_PREFIX}promptTitle">输入</div>
          <input class="${APP_PREFIX}promptInput" id="${APP_PREFIX}promptInput" type="text" />
          <div class="${APP_PREFIX}promptActions">
            <button class="${APP_PREFIX}confirmBtn" id="${APP_PREFIX}promptCancel">取消</button>
            <button class="${APP_PREFIX}confirmBtn primary" id="${APP_PREFIX}promptOk">确定</button>
          </div>
        </div>
      `;
      document.body.appendChild(promptOverlay);

      this.dom = {
        fab, drawer, overlay, toast,
        confirmOverlay, editOverlay, promptOverlay,
        header: drawer.querySelector(`#${APP_PREFIX}header`),
        btnClose: drawer.querySelector(`#${APP_PREFIX}btnClose`),
        btnSetting: drawer.querySelector(`#${APP_PREFIX}btnSetting`),
        debugToggle: drawer.querySelector(`#${APP_PREFIX}debugToggle`),
        sidebar: drawer.querySelector(`#${APP_PREFIX}sidebar`),
        sideToggle: drawer.querySelector(`#${APP_PREFIX}sideToggle`),
        sessions: drawer.querySelector(`#${APP_PREFIX}sessions`),
        chat: drawer.querySelector(`#${APP_PREFIX}chat`),
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
        cfgTest: overlay.querySelector(`#${APP_PREFIX}cfgTest`),
        cfgCancel: overlay.querySelector(`#${APP_PREFIX}cfgCancel`),
        cfgSave: overlay.querySelector(`#${APP_PREFIX}cfgSave`),

        // 确认弹窗
        confirmTitle: confirmOverlay.querySelector(`#${APP_PREFIX}confirmTitle`),
        confirmMsg: confirmOverlay.querySelector(`#${APP_PREFIX}confirmMsg`),
        confirmCancel: confirmOverlay.querySelector(`#${APP_PREFIX}confirmCancel`),
        confirmOk: confirmOverlay.querySelector(`#${APP_PREFIX}confirmOk`),

        // 编辑弹窗
        editTextarea: editOverlay.querySelector(`#${APP_PREFIX}editTextarea`),
        editCancel: editOverlay.querySelector(`#${APP_PREFIX}editCancel`),
        editSave: editOverlay.querySelector(`#${APP_PREFIX}editSave`),

        // 输入弹窗
        promptTitle: promptOverlay.querySelector(`#${APP_PREFIX}promptTitle`),
        promptInput: promptOverlay.querySelector(`#${APP_PREFIX}promptInput`),
        promptCancel: promptOverlay.querySelector(`#${APP_PREFIX}promptCancel`),
        promptOk: promptOverlay.querySelector(`#${APP_PREFIX}promptOk`),
      };
    }

    // ✅ 恢复悬浮球位置
    _applyFabPosFromStore() {
      const p = GM_getValue(STORE_KEYS.FABPOS, null);
      const pos = (typeof p === 'string') ? safeJsonParse(p, null) : p;

      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        const { x, y } = this._clampFabPos(pos.x, pos.y);
        this.dom.fab.style.left = `${x}px`;
        this.dom.fab.style.top = `${y}px`;
      } else {
        // 默认：右上（用 left/top 计算）
        const w = 52, margin = 18;
        const x = Math.max(margin, window.innerWidth - w - margin);
        const y = 16;
        this.dom.fab.style.left = `${x}px`;
        this.dom.fab.style.top = `${y}px`;
      }
    }

    _saveFabPos(x, y) {
      GM_setValue(STORE_KEYS.FABPOS, { x, y });
    }

    _clampFabPos(x, y) {
      const w = this.dom.fab.offsetWidth || 52;
      const h = this.dom.fab.offsetHeight || 52;
      const margin = 8;
      const maxX = Math.max(margin, window.innerWidth - w - margin);
      const maxY = Math.max(margin, window.innerHeight - h - margin);
      return {
        x: Math.max(margin, Math.min(maxX, x)),
        y: Math.max(margin, Math.min(maxY, y)),
      };
    }

    // ✅ AG 拖动（pointer events；短距离视为点击）
    _bindFabDrag() {
      const fab = this.dom.fab;

      let dragging = false;
      let moved = false;
      let startX = 0, startY = 0;
      let origLeft = 0, origTop = 0;

      const getLeftTop = () => {
        const r = fab.getBoundingClientRect();
        return { left: r.left, top: r.top };
      };

      const onPointerDown = (e) => {
        // 仅主按键
        if (e.button !== undefined && e.button !== 0) return;

        dragging = true;
        moved = false;
        fab.classList.add('dragging');

        const lt = getLeftTop();
        origLeft = lt.left;
        origTop = lt.top;

        startX = e.clientX;
        startY = e.clientY;

        try { fab.setPointerCapture(e.pointerId); } catch {}
        e.preventDefault();
        e.stopPropagation();
      };

      const onPointerMove = (e) => {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!moved && (Math.abs(dx) + Math.abs(dy) > 6)) moved = true;

        const nx = origLeft + dx;
        const ny = origTop + dy;
        const clamped = this._clampFabPos(nx, ny);

        fab.style.left = `${clamped.x}px`;
        fab.style.top = `${clamped.y}px`;

        e.preventDefault();
        e.stopPropagation();
      };

      const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = false;
        fab.classList.remove('dragging');

        const lt = getLeftTop();
        const clamped = this._clampFabPos(lt.left, lt.top);

        fab.style.left = `${clamped.x}px`;
        fab.style.top = `${clamped.y}px`;
        this._saveFabPos(clamped.x, clamped.y);

        // 短距离不算拖动：当点击处理
        if (!moved) this.toggleDrawer();

        try { fab.releasePointerCapture(e.pointerId); } catch {}
        e.preventDefault();
        e.stopPropagation();
      };

      const onResize = () => {
        // 视口变化时把位置夹回去
        const lt = getLeftTop();
        const clamped = this._clampFabPos(lt.left, lt.top);
        fab.style.left = `${clamped.x}px`;
        fab.style.top = `${clamped.y}px`;
        this._saveFabPos(clamped.x, clamped.y);
      };

      fab.addEventListener('pointerdown', onPointerDown, { passive: false });
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: false });
      window.addEventListener('resize', onResize);
    }

    // 恢复窗口位置
    _applyWinPosFromStore() {
      const p = GM_getValue(STORE_KEYS.WINPOS, null);
      const pos = (typeof p === 'string') ? safeJsonParse(p, null) : p;

      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        this.dom.drawer.classList.add('positioned');
        this.dom.drawer.style.left = `${pos.x}px`;
        this.dom.drawer.style.top = `${pos.y}px`;
        if (pos.w) this.dom.drawer.style.width = `${pos.w}px`;
        if (pos.h) this.dom.drawer.style.height = `${pos.h}px`;
      }
    }

    _saveWinPos() {
      const rect = this.dom.drawer.getBoundingClientRect();
      GM_setValue(STORE_KEYS.WINPOS, {
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height
      });
    }

    // 窗口标题栏拖动
    _bindWinDrag() {
      const header = this.dom.header;
      const drawer = this.dom.drawer;

      let dragging = false;
      let startX = 0, startY = 0;
      let origLeft = 0, origTop = 0;

      const onMouseDown = (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('label')) return;
        if (e.button !== 0) return;

        dragging = true;
        const rect = drawer.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        startX = e.clientX;
        startY = e.clientY;

        // 切换到绝对定位模式
        if (!drawer.classList.contains('positioned')) {
          drawer.classList.add('positioned');
          drawer.style.left = `${rect.left}px`;
          drawer.style.top = `${rect.top}px`;
        }

        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let nx = origLeft + dx;
        let ny = origTop + dy;

        // 边界限制
        const w = drawer.offsetWidth;
        const h = drawer.offsetHeight;
        nx = Math.max(0, Math.min(window.innerWidth - w, nx));
        ny = Math.max(0, Math.min(window.innerHeight - h, ny));

        drawer.style.left = `${nx}px`;
        drawer.style.top = `${ny}px`;
      };

      const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        this._saveWinPos();
      };

      header.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    _bind() {
      const d = this.dom;

      d.btnClose.addEventListener('click', () => this.toggleDrawer(false));

      d.debugToggle.addEventListener('change', () => {
        this.debugVisible = !!d.debugToggle.checked;
        this.renderAll();
      });

      // 侧边栏折叠切换
      d.sideToggle.addEventListener('click', () => {
        this.sideCollapsed = !this.sideCollapsed;
        GM_setValue(STORE_KEYS.SIDECOLLAPSED, this.sideCollapsed);
        this._updateSidebarState();
      });

      d.btnSetting.addEventListener('click', () => {
        this.loadConfToUI();
        this.dom.overlay.classList.add('open');
      });
      d.cfgCancel.addEventListener('click', () => this.dom.overlay.classList.remove('open'));
      d.cfgSave.addEventListener('click', () => this.saveConfFromUI());
      d.cfgTest.addEventListener('click', () => this.testConnection());

      d.btnNew.addEventListener('click', () => {
        this.store.create('新会话');
        this.renderAll();
      });

      d.btnExport.addEventListener('click', () => {
        const s = this.store.active();
        const payload = { title: s.title, createdAt: s.createdAt, chat: s.chat, agent: s.agent, fsm: s.fsm };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `linuxdo-agent-${(s.title || 'session').slice(0, 24)}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 120);
      });

      d.sessions.addEventListener('click', async (e) => {
        const card = e.target.closest(`.${APP_PREFIX}session`);
        if (!card) return;
        const id = card.dataset.id;

        const op = e.target.closest('[data-op]');
        if (op) {
          const act = op.dataset.op;
          if (act === 'del') {
            try {
              await this.showConfirm('删除会话', '确定要删除该会话吗？', true);
              this.store.remove(id);
              this.renderAll();
            } catch {
              // 取消
            }
            return;
          }
          if (act === 'ren') {
            const s = this.store.all().find(x => x.id === id);
            try {
              const t = await this.showPrompt('重命名会话', s?.title || '新会话');
              if (t != null && t.trim()) {
                this.store.rename(id, t);
                this.renderAll();
              }
            } catch {
              // 取消
            }
            return;
          }
          if (act === 'clr') {
            try {
              await this.showConfirm('清空会话', '确定要清空该会话吗？', true);
              this.store.clearSession(id);
              this.renderAll();
            } catch {
              // 取消
            }
            return;
          }
        }

        this.store.setActive(id);
        this.renderAll();
      });

      d.ta.addEventListener('input', () => this.autoGrow(d.ta));
      d.ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });

      d.btnSend.addEventListener('click', () => this.send());
      d.btnResume.addEventListener('click', () => this.resume());

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.dom.overlay.classList.remove('open');
          this.dom.confirmOverlay.classList.remove('open');
          this.dom.editOverlay.classList.remove('open');
          this.dom.promptOverlay.classList.remove('open');
        }
      });

      // 点击页面非脚本界面部分关闭窗口
      // 使用 mousedown 事件在捕获阶段处理，避免与其他 click 事件冲突
      document.addEventListener('mousedown', (e) => {
        if (!this.dom.drawer.classList.contains('open')) return;
        // 检查点击是否在 drawer 或 fab 之外
        const target = e.target;
        if (!this.dom.drawer.contains(target) &&
            !this.dom.fab.contains(target) &&
            !this.dom.overlay.contains(target) &&
            !this.dom.confirmOverlay.contains(target) &&
            !this.dom.editOverlay.contains(target) &&
            !this.dom.promptOverlay.contains(target)) {
          this.toggleDrawer(false);
        }
      });

      // 现代化确认弹窗事件
      d.confirmCancel.addEventListener('click', () => {
        this.dom.confirmOverlay.classList.remove('open');
        if (this._confirmReject) this._confirmReject();
      });
      d.confirmOk.addEventListener('click', () => {
        this.dom.confirmOverlay.classList.remove('open');
        if (this._confirmResolve) this._confirmResolve();
      });
      // 点击背景关闭确认弹窗
      this.dom.confirmOverlay.addEventListener('click', (e) => {
        if (e.target === this.dom.confirmOverlay) {
          this.dom.confirmOverlay.classList.remove('open');
          if (this._confirmReject) this._confirmReject();
        }
      });

      // 编辑弹窗事件
      d.editCancel.addEventListener('click', () => {
        this.dom.editOverlay.classList.remove('open');
        if (this._editReject) this._editReject();
      });
      d.editSave.addEventListener('click', () => {
        this.dom.editOverlay.classList.remove('open');
        if (this._editResolve) this._editResolve(this.dom.editTextarea.value);
      });
      // 点击背景关闭编辑弹窗
      this.dom.editOverlay.addEventListener('click', (e) => {
        if (e.target === this.dom.editOverlay) {
          this.dom.editOverlay.classList.remove('open');
          if (this._editReject) this._editReject();
        }
      });

      // 输入弹窗事件
      d.promptCancel.addEventListener('click', () => {
        this.dom.promptOverlay.classList.remove('open');
        if (this._promptReject) this._promptReject();
      });
      d.promptOk.addEventListener('click', () => {
        this.dom.promptOverlay.classList.remove('open');
        if (this._promptResolve) this._promptResolve(this.dom.promptInput.value);
      });
      d.promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.dom.promptOverlay.classList.remove('open');
          if (this._promptResolve) this._promptResolve(this.dom.promptInput.value);
        }
      });
      // 点击背景关闭输入弹窗
      this.dom.promptOverlay.addEventListener('click', (e) => {
        if (e.target === this.dom.promptOverlay) {
          this.dom.promptOverlay.classList.remove('open');
          if (this._promptReject) this._promptReject();
        }
      });

      // 消息操作事件委托
      d.chat.addEventListener('click', (e) => this._handleMsgAction(e));
    }

    // 现代化确认弹窗方法
    showConfirm(title, message, isDanger = false) {
      return new Promise((resolve, reject) => {
        this._confirmResolve = resolve;
        this._confirmReject = reject;
        this.dom.confirmTitle.textContent = title;
        this.dom.confirmMsg.textContent = message;
        const okBtn = this.dom.confirmOk;
        okBtn.className = `${APP_PREFIX}confirmBtn ${isDanger ? 'danger' : 'primary'}`;
        okBtn.textContent = isDanger ? '删除' : '确定';
        this.dom.confirmOverlay.classList.add('open');
      });
    }

    // 现代化编辑弹窗方法
    showEdit(initialValue = '') {
      return new Promise((resolve, reject) => {
        this._editResolve = resolve;
        this._editReject = reject;
        this.dom.editTextarea.value = initialValue;
        this.dom.editOverlay.classList.add('open');
        setTimeout(() => this.dom.editTextarea.focus(), 100);
      });
    }

    // 现代化输入弹窗方法
    showPrompt(title, initialValue = '') {
      return new Promise((resolve, reject) => {
        this._promptResolve = resolve;
        this._promptReject = reject;
        this.dom.promptTitle.textContent = title;
        this.dom.promptInput.value = initialValue;
        this.dom.promptOverlay.classList.add('open');
        setTimeout(() => this.dom.promptInput.focus(), 100);
      });
    }

    // 处理消息操作按钮点击
    async _handleMsgAction(e) {
      const actionBtn = e.target.closest(`.${APP_PREFIX}msgAction`);
      if (!actionBtn) return;

      const action = actionBtn.dataset.action;
      const index = parseInt(actionBtn.dataset.index, 10);
      const s = this.store.active();

      if (action === 'copy') {
        const msg = s.chat[index];
        if (msg) {
          try {
            await navigator.clipboard.writeText(msg.content);
            this.toast('已复制到剪贴板');
          } catch {
            this.toast('复制失败');
          }
        }
      } else if (action === 'delete') {
        try {
          await this.showConfirm('删除消息', '确定要删除这条消息吗？', true);
          this.store.deleteChatAt(s.id, index);
          this.renderAll();
          this.toast('已删除');
        } catch {
          // 取消
        }
      } else if (action === 'edit') {
        const msg = s.chat[index];
        if (msg) {
          try {
            const newContent = await this.showEdit(msg.content);
            if (newContent !== null && newContent !== msg.content) {
              this.store.editChatAt(s.id, index, newContent);
              this.renderAll();
              this.toast('已保存');
            }
          } catch {
            // 取消
          }
        }
      } else if (action === 'retry') {
        // 重试：截断到当前用户消息，然后重新发送
        const msg = s.chat[index];
        if (msg && msg.role === 'user') {
          try {
            await this.showConfirm('重试', '将从此消息重新生成回复，后续的对话记录将被清除。确定继续吗？');
            this.store.truncateChatFrom(s.id, index);
            this.renderAll();
            // 重新发送
            const conf = this.confStore.get();
            try {
              await runAgent(s.id, this.store, conf, this);
              this.toast('完成');
            } catch (err) {
              this.toast(`失败：${err.message || err}`);
            }
            this.renderAll();
          } catch {
            // 取消
          }
        }
      }
    }

    _updateSidebarState() {
      if (this.sideCollapsed) {
        this.dom.sidebar.classList.add('collapsed');
        this.dom.sideToggle.textContent = '▶';
        this.dom.sideToggle.title = '展开侧边栏';
      } else {
        this.dom.sidebar.classList.remove('collapsed');
        this.dom.sideToggle.textContent = '◀';
        this.dom.sideToggle.title = '折叠侧边栏';
      }
    }

    async testConnection() {
      const baseUrl = this.dom.cfgBaseUrl.value.trim() || DEFAULT_CONF.baseUrl;
      const model = this.dom.cfgModel.value.trim() || DEFAULT_CONF.model;
      const apiKey = this.dom.cfgKey.value.trim();

      if (!apiKey) {
        this.toast('请先填写 API Key');
        return;
      }

      this.dom.cfgTest.disabled = true;
      this.dom.cfgTest.textContent = '测试中...';

      try {
        const url = baseUrl.replace(/\/+$/, '').endsWith('/chat/completions')
          ? baseUrl.replace(/\/+$/, '')
          : baseUrl.replace(/\/+$/, '') + '/chat/completions';

        const payload = {
          model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 5
        };

        const result = await gmPostJson(
          url,
          { Authorization: `Bearer ${apiKey}` },
          payload,
          { retries: 0, timeoutMs: 15000, onlyStatus200: true }
        );

        if (result?.choices?.[0]) {
          this.toast('连通性测试成功！');
        } else {
          this.toast('连接成功，但响应格式异常');
        }
      } catch (e) {
        this.toast(`连接失败: ${e.message || e}`);
      } finally {
        this.dom.cfgTest.disabled = false;
        this.dom.cfgTest.textContent = '连通性测试';
      }
    }

    toggleDrawer(force) {
      if (typeof force === 'boolean') {
        this.dom.drawer.classList.toggle('open', force);
      } else {
        this.dom.drawer.classList.toggle('open');
      }
    }

    autoGrow(ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(180, Math.max(46, ta.scrollHeight)) + 'px';
    }

    toast(msg) {
      const t = this.dom.toast;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    loadConfToUI() {
      const c = this.confStore.get();
      this.dom.cfgBaseUrl.value = c.baseUrl || DEFAULT_CONF.baseUrl;
      this.dom.cfgModel.value = c.model || DEFAULT_CONF.model;
      this.dom.cfgKey.value = c.apiKey || '';
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
      const temperature = Math.max(0, Math.min(1, parseFloat(this.dom.cfgTemp.value) || DEFAULT_CONF.temperature));
      // 0 表示不限制
      const maxTurnsVal = parseInt(this.dom.cfgMaxTurns.value, 10);
      const maxTurns = (maxTurnsVal === 0) ? 0 : Math.max(1, Math.min(100, maxTurnsVal || DEFAULT_CONF.maxTurns));
      const maxCtxVal = parseInt(this.dom.cfgMaxCtx.value, 10);
      const maxContextChars = (maxCtxVal === 0) ? 0 : Math.max(4000, Math.min(8000000, maxCtxVal || DEFAULT_CONF.maxContextChars));
      const systemPrompt = this.dom.cfgSys.value.trim() || DEFAULT_CONF.systemPrompt;
      const includeToolContext = !!this.dom.cfgToolCtx.checked;

      this.confStore.save({ baseUrl, model, apiKey, temperature, maxTurns, maxContextChars, systemPrompt, includeToolContext });
      this.dom.overlay.classList.remove('open');
      this.toast('设置已保存');
    }

    renderSessions() {
      const wrap = this.dom.sessions;
      const all = this.store.all();
      const activeId = this.store.active().id;

      // SVG 图标
      const iconRename = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
      const iconClear = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;
      const iconDelete = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      wrap.innerHTML = all.map(s => {
        const state = s.fsm?.state || FSM.IDLE;
        const running = s.fsm?.isRunning ? ' · 运行中' : '';
        const err = (s.fsm?.state === FSM.ERROR && s.fsm?.lastError) ? ' · 错误' : '';
        const sub = `${state}${running}${err}`;
        const title = s.title || '新会话';
        return `
          <div class="${APP_PREFIX}session ${s.id === activeId ? 'active' : ''}" data-id="${s.id}">
            <div class="info">
              <div class="t" title="${title.replace(/"/g,'&quot;')}">${title}</div>
              <div class="s">${sub}</div>
            </div>
            <div class="${APP_PREFIX}ops">
              <span class="${APP_PREFIX}op" data-op="ren" title="重命名">${iconRename}</span>
              <span class="${APP_PREFIX}op" data-op="clr" title="清空">${iconClear}</span>
              <span class="${APP_PREFIX}op" data-op="del" title="删除">${iconDelete}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    renderChat() {
      const s = this.store.active();
      const wrap = this.dom.chat;
      const blocks = [];

      if (!s.chat.length && !s.fsm?.isRunning) {
        blocks.push(`<div style="opacity:.8;text-align:center;margin-top:50px;color:var(--a-sub);font-size:13px;">输入问题发送，Agent 会调用工具检索后汇总作答</div>`);
      } else {
        for (let i = 0; i < s.chat.length; i++) {
          const m = s.chat[i];
          blocks.push(this.renderMessage(m.role, m.content, m.ts, i));
        }
      }

      // 显示错误信息在对话中
      if (s.fsm?.state === FSM.ERROR && s.fsm?.lastError) {
        blocks.push(this.renderMessage('error', `错误: ${s.fsm.lastError}`, now()));
      }

      // 发送中显示气泡
      if (s.fsm?.isRunning) {
        blocks.push(`
          <div class="${APP_PREFIX}msgWrap assistant">
            <div class="${APP_PREFIX}thinking">
              <div class="dots"><span></span><span></span><span></span></div>
              <span>思考中...</span>
            </div>
          </div>
        `);
      }

      // 调试信息
      if (this.debugVisible && (s.agent || []).length > 0) {
        blocks.push(`<div class="${APP_PREFIX}debugBlock"><strong>调试轨迹</strong></div>`);
        for (const a of (s.agent || [])) {
          const label = `${a.role}:${a.kind || ''}`;
          const content = String(a.content || '').slice(0, 2000);
          blocks.push(`
            <div class="${APP_PREFIX}debugBlock">
              <div style="font-weight:700;margin-bottom:4px;">${label}</div>
              <pre>${content.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre>
            </div>
          `);
        }
      }

      wrap.innerHTML = blocks.join('\n');
      wrap.scrollTop = wrap.scrollHeight;
    }

    renderMessage(role, content, ts, index = -1) {
      const r = role === 'user' ? 'user' : (role === 'tool' ? 'tool' : (role === 'error' ? 'error' : 'assistant'));
      const time = (() => { try { return new Date(ts || now()).toLocaleString('zh-CN', { hour12: false }); } catch { return ''; } })();

      let html = '';
      try {
        html = (window.marked ? marked.parse(content || '') : String(content || '')).replace(/<a /g, '<a target="_blank" rel="noreferrer" ');
      } catch {
        html = `<pre>${String(content || '').replace(/[<>&]/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]))}</pre>`;
      }

      // SVG 图标
      const iconRetry = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`;
      const iconEdit = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
      const iconCopy = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      const iconDelete = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;

      // 根据角色生成不同的操作按钮
      let actionsHtml = '';
      if (index >= 0 && role !== 'error') {
        if (role === 'user') {
          // 用户消息：重试、编辑、复制、删除
          actionsHtml = `
            <div class="${APP_PREFIX}msgActions">
              <span class="${APP_PREFIX}msgAction" data-action="retry" data-index="${index}" title="重试">${iconRetry}</span>
              <span class="${APP_PREFIX}msgAction" data-action="edit" data-index="${index}" title="编辑">${iconEdit}</span>
              <span class="${APP_PREFIX}msgAction" data-action="copy" data-index="${index}" title="复制">${iconCopy}</span>
              <span class="${APP_PREFIX}msgAction" data-action="delete" data-index="${index}" title="删除">${iconDelete}</span>
            </div>
          `;
        } else if (role === 'assistant') {
          // 模型回复：复制、删除
          actionsHtml = `
            <div class="${APP_PREFIX}msgActions">
              <span class="${APP_PREFIX}msgAction" data-action="copy" data-index="${index}" title="复制">${iconCopy}</span>
              <span class="${APP_PREFIX}msgAction" data-action="delete" data-index="${index}" title="删除">${iconDelete}</span>
            </div>
          `;
        }
      }

      return `
        <div class="${APP_PREFIX}msgWrap ${r}">
          <div class="${APP_PREFIX}msg">
            <div class="${APP_PREFIX}meta">${time}</div>
            <div class="${APP_PREFIX}md">${html}</div>
            ${actionsHtml}
          </div>
        </div>
      `;
    }

    renderAll() {
      this._updateSidebarState();
      this.renderSessions();
      this.renderChat();

      const s = this.store.active();
      const running = !!s.fsm?.isRunning;
      this.dom.btnSend.disabled = running;
      this.dom.btnResume.disabled = running;
      this.dom.ta.disabled = running;
      // 不再显示"运行中"文字，保持"发送"
      this.dom.btnSend.textContent = '发送';
    }

    async send() {
      if (this.isSending) return;
      const text = this.dom.ta.value.trim();
      if (!text) return;

      const conf = this.confStore.get();
      if (!conf.apiKey) {
        this.toast('请先设置 API Key');
        this.dom.overlay.classList.add('open');
        return;
      }

      const s = this.store.active();
      if (s.fsm?.isRunning) return;

      this.isSending = true;
      this.dom.ta.value = '';
      this.autoGrow(this.dom.ta);

      this.store.pushChat(s.id, { role: 'user', content: text, ts: now() });

      if ((s.title || '') === '新会话') {
        const t = text.replace(/\s+/g, ' ').trim().slice(0, 14) || '新会话';
        this.store.rename(s.id, t);
      }

      this.renderAll();
      try {
        await runAgent(s.id, this.store, conf, this);
        this.toast('完成');
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

      this.toast('尝试恢复…');
      try {
        await runAgent(s.id, this.store, conf, this);
        this.toast('恢复完成');
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

  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else window.addEventListener('load', init);

})();
