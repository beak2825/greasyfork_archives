// ==UserScript==
// @name         NodeGuaBot（NodeSeek AI吃瓜助手）
// @namespace    https://github.com/Ryson-32/NodeGuaBot
// @version      0.4.0
// @description  NodeSeek论坛一键吃瓜：自动抓取楼层并生成时间线/争议点/立场对照，总结后可继续追问对话
// @match        https://www.nodeseek.com/post-*
// @require      https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.3.1/dist/purify.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-end
// @author       RyanVan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560310/NodeGuaBot%EF%BC%88NodeSeek%20AI%E5%90%83%E7%93%9C%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560310/NodeGuaBot%EF%BC%88NodeSeek%20AI%E5%90%83%E7%93%9C%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const APP = {
    id: 'nodegua-bot',
    storageKey: 'ngb_config_v1',
    uiKey: 'ngb_ui_v1',
    threadKeyPrefix: 'ngb_thread_v1_',
    pageSize: 10,
    maxInputChars: 60_000,
    maxImages: 24,
    maxChatImages: 4,
    maxImageBytes: 2_500_000,
    fetchDelayMs: 1_200,
    fetchDelayJitterMs: 800,
    fetchMaxRetries: 6,
    fetchRetryBaseMs: 1_500,
    fetchRetryMaxMs: 20_000,
    fetchRetryJitterMs: 800,
  };

  const DEFAULT_CONFIG = Object.freeze({
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
    model: 'gpt-4o-mini',
    includeOriginal: true,
    sendImages: true,
    promptSum: [
      '你是一名“吃瓜总结员”。请基于用户提供的论坛帖子内容，生成一份便于快速吃瓜的总结。',
      '',
      '要求：',
      '- 只依据提供的楼层内容，不要编造；不确定就明确标注“不确定/待核实”。',
      '- 输出 Markdown。',
      '- 重点是“时间线 + 争议点 + 立场对照”，避免长篇说教和站队。',
      '- 需要引用证据：在关键结论/争议点后标注楼层（例如 #17）与作者（例如 @foo）。',
      '',
      '输出结构（按顺序）：',
      '1) 一句话摘要（不超过 3 句）',
      '2) 时间线（按楼层从小到大，使用项目符号）',
      '3) 争议点（列出核心分歧点）',
      '4) 立场对照（表格：立场/代表观点/代表楼层）',
      '5) 关键引用（挑 3-6 条原句，注明楼层与作者）',
      '6) 不确定/待核实（如有）',
      '7) AI锐评（不超过 5 句；保持克制，不要人身攻击）',
      '8) 不友善用户（仅列出明显攻击/引战/不友善言论的楼层与作者，可节选原句；不要扩散隐私）',
    ].join('\n'),
    promptChat: [
      '你是一个帖子阅读助手。请基于上文中的帖子内容与总结，回答用户的问题。',
      '',
      '要求：',
      '- 回答要准确、简洁；不确定就说明不确定。',
      '- 必要时引用楼层与作者作为证据（例如 #17 @foo）。',
      '- 不要编造未出现的事实。',
    ].join('\n'),
  });

  const state = {
    maxPage: null,
    summary: null,
    chat: null,
    isGenerating: false,
    rangeTouched: false,
  };

  function safeJsonParse(text, fallback) {
    try {
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  }

  function loadConfig() {
    const raw = GM_getValue(APP.storageKey, '');
    const parsed = raw ? safeJsonParse(raw, {}) : {};
    const migrated = { ...parsed };
    if (typeof migrated.prompt === 'string' && !migrated.promptSum) migrated.promptSum = migrated.prompt;
    return { ...DEFAULT_CONFIG, ...migrated };
  }

  function saveConfig(cfg) {
    GM_setValue(APP.storageKey, JSON.stringify(cfg));
  }

  function loadUiState() {
    const raw = GM_getValue(APP.uiKey, '');
    const parsed = raw ? safeJsonParse(raw, {}) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  function saveUiState(next) {
    GM_setValue(APP.uiKey, JSON.stringify(next || {}));
  }

  function updateUiState(patch) {
    const cur = loadUiState();
    const next = { ...cur, ...(patch && typeof patch === 'object' ? patch : {}) };
    saveUiState(next);
    return next;
  }

  function threadStoreKey(postId) {
    return `${APP.threadKeyPrefix}${String(postId || '').trim()}`;
  }

  function loadThreadState(postId) {
    const key = threadStoreKey(postId);
    if (!key || key === APP.threadKeyPrefix) return null;
    const raw = GM_getValue(key, '');
    const parsed = raw ? safeJsonParse(raw, null) : null;
    return parsed && typeof parsed === 'object' ? parsed : null;
  }

  function saveThreadState(postId, data) {
    const key = threadStoreKey(postId);
    if (!key || key === APP.threadKeyPrefix) return;
    GM_setValue(key, JSON.stringify(data || {}));
  }

  function persistThreadState(postId) {
    if (!postId) return;
    const summary =
      state.summary && String(state.summary.postId) === String(postId)
        ? {
            postId: state.summary.postId,
            title: state.summary.title,
            startPage: state.summary.startPage,
            endPage: state.summary.endPage,
            includeOriginal: state.summary.includeOriginal,
            markdown: state.summary.markdown,
            contextText: state.summary.contextText,
          }
        : null;
    const chatTurns =
      state.chat && Array.isArray(state.chat.baseHistory) && Array.isArray(state.chat.history)
        ? state.chat.history.slice(state.chat.baseHistory.length)
        : [];
    const chat = chatTurns.length ? { turns: chatTurns } : null;
    saveThreadState(postId, { v: 1, savedAt: Date.now(), summary, chat });
  }

  function clampInt(value, min, max) {
    const num = Number.parseInt(String(value), 10);
    if (!Number.isFinite(num)) return min;
    return Math.min(max, Math.max(min, num));
  }

  function normalizeText(text) {
    return String(text || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function toAbsUrl(url, baseUrl) {
    if (!url) return '';
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      return String(url);
    }
  }

  function normalizeApiUrl(apiUrl) {
    const raw = String(apiUrl || '').trim();
    if (!raw) return raw;
    try {
      const u = new URL(raw);
      const p = u.pathname || '/';
      if (p === '/' || p === '') {
        u.pathname = '/v1/chat/completions';
        return u.toString();
      }
      if (p === '/v1' || p === '/v1/') {
        u.pathname = '/v1/chat/completions';
        return u.toString();
      }
      return raw;
    } catch {
      return raw;
    }
  }

  function parseThreadLocation(loc) {
    const m = (loc?.pathname || '').match(/^\/post-(\d+)-(\d+)\/?$/);
    if (!m) return null;
    return { postId: m[1], page: Number.parseInt(m[2], 10) };
  }

  function sleep(ms) {
    const t = Number(ms);
    return new Promise((resolve) => setTimeout(resolve, Number.isFinite(t) && t > 0 ? t : 0));
  }

  function parseRetryAfterMs(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    const seconds = Number.parseInt(raw, 10);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
    const dt = Date.parse(raw);
    if (Number.isFinite(dt)) {
      const delta = dt - Date.now();
      if (delta > 0) return delta;
    }
    return null;
  }

  function calcRetryWaitMs(attempt, retryAfterMs) {
    const fromHeader = Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? retryAfterMs : 0;
    const base = APP.fetchRetryBaseMs * 2 ** Math.max(0, attempt - 1);
    const exp = Math.min(APP.fetchRetryMaxMs, Math.max(APP.fetchRetryBaseMs, base));
    const jitter = Math.floor(Math.random() * APP.fetchRetryJitterMs);
    const chosen = Math.max(fromHeader, exp + jitter);
    return Math.min(APP.fetchRetryMaxMs, chosen);
  }

  function calcThrottleMs() {
    const base = Number.isFinite(APP.fetchDelayMs) ? APP.fetchDelayMs : 0;
    const jitter = Number.isFinite(APP.fetchDelayJitterMs) ? Math.max(0, APP.fetchDelayJitterMs) : 0;
    return Math.max(0, Math.floor(base + Math.random() * jitter));
  }

  async function fetchHtml(url, opts = {}) {
    const maxRetries = Number.isFinite(opts?.maxRetries) ? opts.maxRetries : APP.fetchMaxRetries;
    const throttleMs = Number.isFinite(opts?.throttleMs) ? opts.throttleMs : 0;
    const onRetry = typeof opts?.onRetry === 'function' ? opts.onRetry : null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const resp = await fetch(url, { credentials: 'include' });
      if (resp.ok) {
        const html = await resp.text();
        if (throttleMs > 0) await sleep(throttleMs);
        return html;
      }

      const status = resp.status || 0;
      const retryable = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
      if (!retryable || attempt >= maxRetries) {
        if (status === 429) {
          throw new Error(`抓取失败：HTTP 429（站点限流${attempt ? `；已重试 ${attempt} 次` : ''}）。建议缩小页码范围或稍后重试。`);
        }
        throw new Error(`抓取失败：HTTP ${status || '??'}${attempt ? `（已重试 ${attempt} 次）` : ''}`);
      }

      const retryAfterMs = parseRetryAfterMs(resp.headers?.get?.('Retry-After'));
      const waitMs = calcRetryWaitMs(attempt + 1, retryAfterMs);
      if (onRetry) {
        try {
          onRetry({ status, attempt: attempt + 1, maxRetries, waitMs });
        } catch {
          // ignore
        }
      }
      await sleep(waitMs);
    }

    throw new Error('抓取失败：未知错误');
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function extractMaxPageFromDoc(doc, postId) {
    const root = doc.querySelector('[aria-label="pagination"]');
    if (!root) return null;

    const nums = new Set();
    const elements = Array.from(root.querySelectorAll('a[href], span'));

    for (const el of elements) {
      const href = el.getAttribute?.('href') || '';
      if (href) {
        const m = href.match(new RegExp(`/post-${postId}-(\\d+)(?:$|\\?)`));
        if (m?.[1]) nums.add(Number.parseInt(m[1], 10));
      }
      const text = (el.textContent || '').trim();
      if (/^\d+$/.test(text)) nums.add(Number.parseInt(text, 10));
    }

    const max = Math.max(0, ...nums);
    return max > 0 ? max : null;
  }

  async function detectMaxPage(postId) {
    const fromDom = extractMaxPageFromDoc(document, postId);
    if (Number.isFinite(fromDom)) return fromDom;
    try {
      const html = await fetchHtml(`${location.origin}/post-${postId}-1`);
      const doc = parseHtml(html);
      const fromFetch = extractMaxPageFromDoc(doc, postId);
      if (Number.isFinite(fromFetch)) return fromFetch;
      return null;
    } catch {
      return null;
    }
  }

  function pickAuthor(metaInfoEl) {
    if (!metaInfoEl) return '';
    const links = Array.from(metaInfoEl.querySelectorAll('a[href^="/space/"]'));
    for (const a of links) {
      const t = a.textContent.replace(/\s+/g, ' ').trim();
      if (t) return t;
    }
    const img = links[0]?.querySelector('img');
    return img?.getAttribute('alt')?.trim() || '';
  }

  function extractPost(contentItemEl, baseUrl) {
    const idStr = contentItemEl?.getAttribute('id') || '';
    const floor = Number.parseInt(idStr, 10);
    if (!Number.isFinite(floor)) return null;

    const meta = contentItemEl.querySelector('.nsk-content-meta-info');
    const author = pickAuthor(meta);
    const time = meta?.querySelector('time')?.textContent?.trim() || '';
    const article = contentItemEl.querySelector('article');

    const stickers = [];
    const images = [];
    if (article) {
      const imgs = Array.from(article.querySelectorAll('img'));
      for (const img of imgs) {
        const rawSrc = img.getAttribute('src') || img.getAttribute('data-src') || '';
        const abs = toAbsUrl(rawSrc, baseUrl);
        if (!abs) continue;

        const isSticker = abs.includes('/static/image/sticker/');
        if (isSticker) {
          const alt = img.getAttribute('alt') || '';
          stickers.push(alt ? alt.trim() : 'sticker');
          continue;
        }
        images.push(abs);
      }
    }

    const links = [];
    if (article) {
      const as = Array.from(article.querySelectorAll('a[href]'));
      for (const a of as) {
        const href = a.getAttribute('href') || '';
        const abs = toAbsUrl(href, baseUrl);
        if (!/^https?:\/\//i.test(abs)) continue;
        if (abs.startsWith(location.origin)) continue;
        const text = a.textContent.replace(/\s+/g, ' ').trim();
        links.push({ text, url: abs });
      }
    }

    const text = article ? normalizeText(article.innerText) : '';

    return {
      floor,
      author,
      time,
      text,
      stickers,
      images,
      links,
    };
  }

  function extractPagePosts(doc, pageNumber, baseUrl, cfg) {
    const posts = [];

    if (pageNumber === 1 && cfg.includeOriginal) {
      const op = doc.querySelector('#nsk-body-left .nsk-post-wrapper .content-item[id="0"]');
      const opPost = op ? extractPost(op, baseUrl) : null;
      if (opPost) posts.push(opPost);
    }

    const expectedMin = (pageNumber - 1) * APP.pageSize + 1;
    const expectedMax = pageNumber * APP.pageSize;
    const items = Array.from(doc.querySelectorAll('#nsk-body-left .comment-container .content-item'));
    for (const el of items) {
      const p = extractPost(el, baseUrl);
      if (!p) continue;
      if (p.floor < expectedMin || p.floor > expectedMax) continue; // 过滤第1页的“热门回复”等跨页插入
      posts.push(p);
    }
    return posts;
  }

  function formatPostText(post, { includeImages, includeLinks } = {}) {
    const useImages = includeImages !== false;
    const useLinks = includeLinks !== false;

    let text = normalizeText(post.text || '');
    const stickers = Array.isArray(post.stickers) ? post.stickers : [];
    const images = Array.isArray(post.images) ? post.images : [];
    const links = Array.isArray(post.links) ? post.links : [];

    if (!text && stickers.length) text = stickers.map((s) => `[表情:${s}]`).join(' ');
    if (text && stickers.length) text += `\n[表情] ${stickers.join(', ')}`;

    if (useImages && images.length) text += `\n[图片]\n- ${images.join('\n- ')}`;
    if (useLinks && links.length) {
      text += `\n[链接]\n- ${links.map((l) => (l?.text ? `${l.text}: ${l.url}` : l?.url || '')).filter(Boolean).join('\n- ')}`;
    }

    return normalizeText(text);
  }

  function formatPostsForModel(posts) {
    const lines = [];
    for (const p of posts) {
      const who = [p.author ? `@${p.author}` : '', p.time ? `(${p.time})` : ''].filter(Boolean).join(' ');
      lines.push(`[#${p.floor}] ${who}`.trim());
      lines.push(formatPostText(p));
      lines.push('');
    }
    return lines.join('\n').trim();
  }

  function estimateMessageContentChars(content) {
    if (typeof content === 'string') return content.length;
    if (!Array.isArray(content)) return 0;
    let n = 0;
    for (const part of content) {
      const t = part?.type;
      if (t === 'text' && typeof part.text === 'string') n += part.text.length;
      if (t === 'image_url' && typeof part?.image_url?.url === 'string') n += part.image_url.url.length;
    }
    return n;
  }

  function buildSummaryUserMessage({ title, postId, startPage, endPage, includeOriginal, posts, sendImages }) {
    const postUrl = `${location.origin}/post-${postId}-1`;
    const header = [
      `帖子标题：${title || ''}`.trim(),
      `帖子链接：${postUrl}`,
      `抓取页码：${startPage} - ${endPage}（每页 ${APP.pageSize} 楼；包含 0 楼：${includeOriginal ? '是' : '否'}）`,
      '',
      '以下为楼层内容（已按楼层排序，已去重）：',
    ].join('\n');

    if (!sendImages) {
      const text = [header, formatPostsForModel(posts)].join('\n');
      return { content: text, imageCount: 0, skippedImages: 0 };
    }

    const parts = [{ type: 'text', text: `${header}\n\n` }];
    let imageCount = 0;
    let skippedImages = 0;

    for (const p of posts) {
      const who = [p.author ? `@${p.author}` : '', p.time ? `(${p.time})` : ''].filter(Boolean).join(' ');
      const floorHead = `[#${p.floor}] ${who}`.trim();
      const text = formatPostText(p, { includeImages: true, includeLinks: true });
      parts.push({ type: 'text', text: `${floorHead}\n${text}\n` });

      const imgs = Array.isArray(p.images) ? p.images : [];
      if (imgs.length) {
        const remaining = APP.maxImages - imageCount;
        const take = remaining > 0 ? imgs.slice(0, remaining) : [];
        const skip = imgs.length - take.length;
        skippedImages += Math.max(0, skip);
        for (const url of take) {
          parts.push({ type: 'image_url', image_url: { url } });
          imageCount += 1;
        }
        if (skip > 0) parts.push({ type: 'text', text: `\n[图片] 已达到上限，额外省略 ${skip} 张。\n` });
      }
      parts.push({ type: 'text', text: '\n' });
    }

    return { content: parts, imageCount, skippedImages };
  }

  function extractTextFromChatCompletionsJson(json) {
    if (!json || typeof json !== 'object') return '';
    const errorMessage = json?.error?.message;
    if (typeof errorMessage === 'string' && errorMessage.trim()) return `__ERROR__:${errorMessage.trim()}`;

    const choice0 = json?.choices?.[0];
    const messageContent = choice0?.message?.content;
    if (typeof messageContent === 'string' && messageContent) return messageContent;

    const textContent = choice0?.text;
    if (typeof textContent === 'string' && textContent) return textContent;

    // Some providers may return Gemini-like format even when "OpenAI-compatible".
    const parts = json?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      const t = parts
        .map((p) => (p && typeof p.text === 'string' ? p.text : ''))
        .filter(Boolean)
        .join('');
      if (t) return t;
    }

    const outputText = json?.output_text;
    if (typeof outputText === 'string' && outputText) return outputText;

    return '';
  }

  function createSseDecoder(onText) {
    let buffer = '';
    let done = false;
    let sawAnyDataLine = false;
    let sawAnyText = false;

    function handleData(data) {
      if (!data) return;
      if (data === '[DONE]') {
        done = true;
        return;
      }
      let json;
      try {
        json = JSON.parse(data);
      } catch {
        return;
      }
      const delta = json?.choices?.[0]?.delta;
      const content =
        typeof delta?.content === 'string' && delta.content.length > 0
          ? delta.content
          : typeof delta?.text === 'string'
            ? delta.text
            : undefined;
      if (typeof content === 'string' && content) {
        sawAnyText = true;
        onText(content);
      }
    }

    function feed(chunk) {
      if (done) return;
      buffer += chunk;

      // Parse by lines to be tolerant of SSE variations (some gateways don't send blank-line separators).
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        sawAnyDataLine = true;
        const data = trimmed.slice(5).trim();
        handleData(data);
        if (done) return;
      }
    }

    function flush() {
      if (!buffer) return;
      const trimmed = buffer.trim();
      buffer = '';
      if (trimmed.startsWith('data:')) {
        sawAnyDataLine = true;
        handleData(trimmed.slice(5).trim());
      }
    }

    return {
      feed,
      flush,
      getStats: () => ({ sawAnyDataLine, sawAnyText, done }),
    };
  }

  function streamChatCompletionGM({ apiUrl, apiKey, model, messages, onDelta, onError, onDone }) {
    const decoder = createSseDecoder(onDelta);
    let lastLen = 0;

    const req = GM_xmlhttpRequest({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${apiKey}`,
      },
      data: JSON.stringify({ model, messages, stream: true, temperature: 0.2 }),
      responseType: 'text',
      onprogress: (evt) => {
        const text = evt?.responseText || '';
        const delta = text.slice(lastLen);
        lastLen = text.length;
        if (delta) decoder.feed(delta);
      },
      onload: (evt) => {
        const text = evt?.responseText || '';
        const delta = text.slice(lastLen);
        if (delta) decoder.feed(delta);
        decoder.flush();
        const ok = evt?.status >= 200 && evt?.status < 300;
        if (!ok) {
          const snippet = String(text || '')
            .slice(0, 600)
            .replace(/\s+/g, ' ')
            .trim();
          const parsed = safeJsonParse(text, null);
          const extracted = extractTextFromChatCompletionsJson(parsed);
          const msg = extracted && extracted.startsWith('__ERROR__:') ? extracted.slice('__ERROR__:'.length) : '';
          onError(msg || `HTTP ${evt?.status || 0}${snippet ? `：${snippet}` : ''}`);
          return;
        }

        const { sawAnyDataLine, sawAnyText } = decoder.getStats();
        if (!sawAnyText) {
          // Fallback for gateways that ignore stream=true and return a JSON body.
          const parsed = safeJsonParse(text, null);
          const extracted = extractTextFromChatCompletionsJson(parsed);
          if (extracted && extracted.startsWith('__ERROR__:')) {
            onError(extracted.slice('__ERROR__:'.length));
            return;
          }
          if (typeof extracted === 'string' && extracted.trim()) {
            onDelta(extracted);
            onDone();
            return;
          }

          const hint = !sawAnyDataLine
            ? '网关未返回 SSE 数据（没有 data: 行）'
            : '网关返回了 SSE，但未解析到 delta.content';
          const snippet = text.slice(0, 180).replace(/\s+/g, ' ').trim();
          onError(`未解析到模型输出（${hint}）。请检查 API URL 是否为 /v1/chat/completions。响应片段：${snippet || '(空)'}`);
          return;
        }
        onDone();
      },
      onerror: () => onError('网络错误（可能是 @connect 未放行或网关不可达）'),
      ontimeout: () => onError('请求超时'),
    });

    return () => {
      try {
        req.abort();
      } catch {
        // ignore
      }
    };
  }

  const PURIFY_CONFIG = Object.freeze({
    // 防止模型输出带 <img> 等外链资源，避免额外的网络请求/跟踪与潜在攻击面。
    FORBID_TAGS: ['img', 'svg', 'math', 'iframe', 'object', 'embed', 'video', 'audio', 'source'],
    FORBID_ATTR: ['srcset'],
  });

  function renderMarkdown(container, markdown) {
    const html = DOMPurify.sanitize(marked.parse(markdown || ''), PURIFY_CONFIG);
    container.innerHTML = html;
    for (const a of Array.from(container.querySelectorAll('a[href]'))) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
  }

  function messageContentToDisplayText(content) {
    if (typeof content === 'string') return content;
    if (!Array.isArray(content)) return '';
    const texts = content
      .filter((p) => p && p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text)
      .join('')
      .trim();
    const imgCount = content.filter((p) => p && p.type === 'image_url').length;
    if (!imgCount) return texts;
    const suffix = `\n\n[附带图片 ${imgCount}]`;
    return (texts ? `${texts}${suffix}` : suffix).trim();
  }

  function setDetails(detailsEl, preEl, message) {
    if (!detailsEl || !preEl) return;
    if (!message) {
      detailsEl.hidden = true;
      detailsEl.open = false;
      preEl.textContent = '';
      return;
    }
    detailsEl.hidden = false;
    detailsEl.open = true;
    preEl.textContent = String(message);
  }

  function parseFloorsFromText(text) {
    const s = String(text || '');
    const floors = new Set();
    let m;
    const reHash = /#\s*(\d{1,6})/g;
    const reLou = /(\d{1,6})\s*楼/g;
    while ((m = reHash.exec(s))) floors.add(Number.parseInt(m[1], 10));
    while ((m = reLou.exec(s))) floors.add(Number.parseInt(m[1], 10));
    return Array.from(floors).filter((n) => Number.isFinite(n) && n >= 0 && n <= 999999);
  }

  function extractImagesByFloorFromContextText(contextText) {
    const map = new Map();
    const lines = String(contextText || '').split('\n');
    let curFloor = null;
    let inImages = false;

    for (const rawLine of lines) {
      const line = String(rawLine || '');
      const m = line.match(/^\[#(\d+)\]/);
      if (m?.[1]) {
        curFloor = Number.parseInt(m[1], 10);
        inImages = false;
        continue;
      }
      const t = line.trim();
      if (!t) continue;
      if (t === '[图片]') {
        inImages = true;
        continue;
      }
      if (t.startsWith('[') && t.endsWith(']')) {
        inImages = false;
        continue;
      }
      if (!inImages || !Number.isFinite(curFloor)) continue;

      const mUrl = t.match(/-\s*(https?:\/\/\S+)/i);
      if (!mUrl?.[1]) continue;
      const url = mUrl[1].trim();
      if (!url) continue;
      const prev = map.get(curFloor) || [];
      prev.push(url);
      map.set(curFloor, prev);
    }

    return map;
  }

  function parseHeaders(rawHeaders) {
    const out = {};
    const text = String(rawHeaders || '');
    for (const line of text.split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx <= 0) continue;
      const k = line.slice(0, idx).trim().toLowerCase();
      const v = line.slice(idx + 1).trim();
      if (k) out[k] = v;
    }
    return out;
  }

  function arrayBufferToBase64(buf) {
    const bytes = new Uint8Array(buf || new ArrayBuffer(0));
    const chunk = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  function gmFetchArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        headers: { Accept: 'image/*,*/*;q=0.8' },
        onload: (evt) => resolve(evt),
        onerror: () => reject(new Error('图片下载失败（网络错误）')),
        ontimeout: () => reject(new Error('图片下载失败（超时）')),
      });
    });
  }

  async function fetchImageAsDataUrl(url, depth = 0) {
    const raw = String(url || '').trim();
    if (!raw) throw new Error('图片 URL 为空');
    if (/^data:image\//i.test(raw)) return raw;
    if (depth > 2) throw new Error('图片重定向/解析过深');

    const resp = await gmFetchArrayBuffer(raw);
    const status = resp?.status || 0;
    if (status < 200 || status >= 300) throw new Error(`图片下载失败：HTTP ${status}`);

    const headers = parseHeaders(resp?.responseHeaders || '');
    const contentType = String(headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    const buffer = resp?.response;
    const byteLen = buffer?.byteLength || 0;

    if (!byteLen) throw new Error('图片下载失败：空响应');
    if (byteLen > APP.maxImageBytes) throw new Error(`图片过大（${byteLen} bytes），已跳过`);

    if (contentType.startsWith('image/')) {
      const base64 = arrayBufferToBase64(buffer);
      return `data:${contentType};base64,${base64}`;
    }

    // Some hosts (e.g. imgur.com/<id>) return HTML page; parse meta og:image then refetch.
    if (contentType.includes('text/html')) {
      const html = new TextDecoder('utf-8').decode(new Uint8Array(buffer));
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const meta =
        doc.querySelector('meta[property="og:image"][content]') ||
        doc.querySelector('meta[property="og:image:secure_url"][content]') ||
        doc.querySelector('meta[name="twitter:image"][content]');
      const nextUrl = meta?.getAttribute('content')?.trim();
      if (nextUrl) return fetchImageAsDataUrl(toAbsUrl(nextUrl, raw), depth + 1);
    }

    throw new Error(`不支持的图片响应类型：${contentType || '(unknown)'}`);
  }

  function createUi(cfg) {
    const uiState = loadUiState();
    const host = document.createElement('div');
    host.id = APP.id;
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = `
      :host{ all: initial; }
      [hidden]{ display:none !important; }
      .ngb-btn{ position:fixed; right:18px; bottom:18px; z-index:999999; width:44px; height:44px; border-radius:999px;
        border:1px solid rgba(0,0,0,.15); background:#111827; color:#fff; font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif; cursor:pointer; touch-action:none; }
      .ngb-panel{ position:fixed; right:18px; bottom:70px; z-index:999999; width:460px; max-width:calc(100vw - 36px); height:72vh;
        background:#fff; color:#111827; border:1px solid rgba(0,0,0,.12); border-radius:12px; box-shadow:0 12px 48px rgba(0,0,0,.18);
        display:none; overflow:hidden; font:14px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;
        resize: both; min-width:340px; min-height:320px; max-width:calc(100vw - 24px); max-height:calc(100vh - 24px); }
      .ngb-panel.open{ display:flex; flex-direction:column; }
      .ngb-header{ padding:10px 12px; background:#f9fafb; border-bottom:1px solid rgba(0,0,0,.08); display:flex; align-items:center; justify-content:space-between; gap:8px; flex:0 0 auto; }
      .ngb-title{ font-weight:800; letter-spacing:.2px; }
      .ngb-small{ color:#6b7280; font-size:12px; }
      .ngb-body{ display:flex; flex-direction:column; flex:1; min-height:0; }
      .ngb-tabs{ display:flex; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(0,0,0,.08); background:#fff; flex:0 0 auto; }
      .ngb-tab{ flex:1; border:1px solid rgba(0,0,0,.12); background:#fff; padding:8px 10px; border-radius:10px; cursor:pointer; }
      .ngb-tab.active{ background:#111827; color:#fff; border-color:#111827; }
      .ngb-pages{ padding:12px; overflow:hidden; flex:1; min-height:0; display:flex; flex-direction:column; }
      .ngb-page{ display:none; }
      .ngb-page.active{ display:flex; flex-direction:column; gap:10px; flex:1; min-height:0; overflow:hidden; }
      .ngb-page[data-page="settings"].active{ overflow:auto; }
      .ngb-row{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      .ngb-field{ display:flex; flex-direction:column; gap:6px; }
      .ngb-inline-check{ display:flex; gap:6px; align-items:center; color:#374151; font-size:12px; white-space:nowrap; }
      .ngb-summary-bar{ display:flex; gap:6px; align-items:center; flex-wrap:nowrap; }
      .ngb-summary-bar .ngb-note{ white-space:nowrap; }
      .ngb-summary-bar button{ border:1px solid rgba(0,0,0,.12); background:#fff; padding:8px 10px; border-radius:10px; cursor:pointer; }
      .ngb-summary-bar button.primary{ background:#111827; color:#fff; border-color:#111827; }
      .ngb-summary-bar button:disabled{ opacity:.6; cursor:not-allowed; }
      label{ color:#374151; font-size:12px; }
      input[type="text"], input[type="password"], textarea, input[type="number"]{
        width:100%; box-sizing:border-box; padding:8px 10px; border-radius:10px; border:1px solid rgba(0,0,0,.15); background:#fff; color:#111827; outline:none;
      }
      input[type="number"]{ width:64px; }
      textarea{ min-height:90px; resize:vertical; }
      textarea.ngb-prompt{ min-height:160px; }
      .ngb-actions{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; flex:0 0 auto; }
      .ngb-actions.ngb-actions-nowrap{
        flex:0 0 auto;
        flex-wrap:nowrap;
        gap:6px;
        overflow-x:auto;
        overflow-y:hidden;
        padding-bottom:0;
        scrollbar-width:none;
        -ms-overflow-style:none;
        font-size:12px;
      }
      .ngb-actions.ngb-actions-nowrap::-webkit-scrollbar{ height:0; }
      .ngb-actions.ngb-actions-nowrap > *{ flex:0 0 auto; }
      .ngb-actions.ngb-actions-nowrap > label.ngb-inline-check{ flex:1 1 auto; min-width:0; }
      .ngb-actions.ngb-actions-nowrap > label.ngb-inline-check span{ flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; }
      .ngb-actions.ngb-actions-nowrap button{ padding:6px 8px; border-radius:9px; }
      .ngb-btn-group{ display:flex; gap:6px; flex-wrap:nowrap; align-items:center; }
      .ngb-actions button{ border:1px solid rgba(0,0,0,.12); background:#fff; padding:8px 10px; border-radius:10px; cursor:pointer; }
      .ngb-actions button.primary{ background:#111827; color:#fff; border-color:#111827; }
      .ngb-actions button:disabled{ opacity:.6; cursor:not-allowed; }
      .ngb-btn-sm{ border:1px solid rgba(0,0,0,.12); background:#fff; padding:6px 10px; border-radius:10px; cursor:pointer; }
      .ngb-btn-sm:disabled{ opacity:.6; cursor:not-allowed; }
      .ngb-note{ color:#6b7280; font-size:12px; }
      .ngb-status{ color:#6b7280; font-size:12px; }
      details{ border:1px solid rgba(0,0,0,.12); border-radius:10px; padding:8px 10px; background:#fff; }
      summary{ cursor:pointer; font-weight:600; color:#111827; }
      pre{ margin:6px 0 0; white-space:pre-wrap; word-break:break-word; }
      .ngb-result{ border:1px solid rgba(0,0,0,.12); border-radius:10px; padding:10px; background:#fff; flex:1; min-height:0; overflow:auto; }
      .ngb-result :is(h1,h2,h3){ margin:10px 0 6px; }
      .ngb-result :is(p,ul,ol,blockquote,table,pre){ margin:6px 0; }
      .ngb-result table{ border-collapse:collapse; width:100%; }
      .ngb-result th,.ngb-result td{ border:1px solid rgba(0,0,0,.12); padding:6px 8px; vertical-align:top; }
      .ngb-result blockquote{ border-left:3px solid rgba(0,0,0,.15); padding-left:10px; color:#374151; }
      .ngb-result code{ background:#f3f4f6; padding:1px 4px; border-radius:6px; }
      .ngb-result pre code{ display:block; padding:10px; overflow:auto; }
      .ngb-chat-list{ display:flex; flex-direction:column; gap:10px; padding:6px 0; flex:1; min-height:0; overflow:auto; }
      .ngb-bubble{ border:1px solid rgba(0,0,0,.12); border-radius:12px; padding:10px; }
      .ngb-bubble-user{ background:#111827; color:#fff; border-color:#111827; }
      .ngb-chat-input-row{ display:flex; gap:8px; align-items:flex-end; flex:0 0 auto; }
      .ngb-chat-input-row textarea{ min-height:60px; flex:1; min-width:0; width:auto; }
      .ngb-chat-input-row button{ flex:0 0 auto; border:1px solid rgba(0,0,0,.12); background:#fff; padding:8px 10px; border-radius:10px; cursor:pointer; white-space:nowrap; }
      .ngb-chat-input-row button.primary{ background:#111827; color:#fff; border-color:#111827; }
      .ngb-chat-input-row button:disabled{ opacity:.6; cursor:not-allowed; }
    `;
    shadow.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'ngb-btn';
    btn.textContent = '瓜';
    btn.title = 'NodeGuaBot';

    const panel = document.createElement('div');
    panel.className = 'ngb-panel';

    const header = document.createElement('div');
    header.className = 'ngb-header';
    header.innerHTML = `
      <div>
        <div class="ngb-title">NodeGuaBot（NodeSeek AI吃瓜助手）</div>
        <div class="ngb-small">时间线 · 争议点 · 立场对照</div>
      </div>
      <button id="ngb-close" class="ngb-btn-sm">关闭</button>
    `;

    const body = document.createElement('div');
    body.className = 'ngb-body';
    body.innerHTML = `
      <div class="ngb-tabs">
        <button class="ngb-tab active" data-tab="summary">总结</button>
        <button class="ngb-tab" data-tab="chat">对话</button>
        <button class="ngb-tab" data-tab="settings">设置</button>
      </div>
      <div class="ngb-pages">
        <div class="ngb-page active" data-page="summary">
          <div class="ngb-summary-bar">
            <input id="ngb-start" type="number" min="1" step="1">
            <span class="ngb-note">到</span>
            <input id="ngb-end" type="number" min="1" step="1">
            <span class="ngb-note" id="ngb-maxpage">共-页</span>
            <button id="ngb-run" class="primary">开始总结</button>
            <button id="ngb-copy" disabled>复制结果</button>
          </div>
          <div class="ngb-row">
            <label style="display:flex; gap:6px; align-items:center;">
              <input id="ngb-op" type="checkbox">
              <span>包含 0 楼</span>
            </label>
          </div>
          <div class="ngb-status" id="ngb-status"></div>
          <details id="ngb-error-box" hidden>
            <summary>错误详情</summary>
            <pre id="ngb-error"></pre>
          </details>
          <div class="ngb-result" id="ngb-result"></div>
        </div>

        <div class="ngb-page" data-page="chat">
          <div class="ngb-note" id="ngb-chat-empty">请先在「总结」页生成总结，然后在这里继续追问。</div>
          <div class="ngb-chat-list" id="ngb-chat-list" hidden></div>
          <div class="ngb-chat-input-row">
            <textarea id="ngb-chat-input" placeholder="输入你的问题…（Enter 发送，Shift+Enter 换行）" disabled></textarea>
            <button id="ngb-chat-send" class="primary" disabled>发送</button>
          </div>
          <div class="ngb-status" id="ngb-chat-status"></div>
          <details id="ngb-chat-error-box" hidden>
            <summary>错误详情</summary>
            <pre id="ngb-chat-error"></pre>
          </details>
        </div>

        <div class="ngb-page" data-page="settings">
          <div class="ngb-field">
            <label>API URL</label>
            <input id="ngb-apiurl" type="text" placeholder="https://.../v1/chat/completions">
          </div>
          <div class="ngb-field">
            <label>API Key（Bearer）</label>
            <input id="ngb-apikey" type="password" placeholder="sk-...">
          </div>
          <div class="ngb-field">
            <label>Model</label>
            <input id="ngb-model" type="text" placeholder="gpt-4o-mini / gemini-2.5-flash / ...">
          </div>
          <div class="ngb-actions ngb-actions-nowrap">
            <label class="ngb-inline-check">
              <input id="ngb-send-images" type="checkbox">
              <span>多模态发送图片（image_url）</span>
            </label>
            <button id="ngb-test">测试 API</button>
            <div class="ngb-btn-group">
              <button id="ngb-save" class="primary">保存设置</button>
              <button id="ngb-clear-cache">清空缓存</button>
            </div>
          </div>
          <div class="ngb-status" id="ngb-set-status"></div>
          <details id="ngb-test-box" hidden>
            <summary>测试输出</summary>
            <pre id="ngb-test-out"></pre>
          </details>
          <details open>
            <summary>提示词</summary>
            <div class="ngb-field" style="margin-top:10px;">
              <label>总结提示词（System Prompt）</label>
              <textarea id="ngb-prompt-sum" class="ngb-prompt"></textarea>
            </div>
            <div class="ngb-field">
              <label>对话提示词（System Prompt）</label>
              <textarea id="ngb-prompt-chat" class="ngb-prompt"></textarea>
            </div>
          </details>
        </div>
      </div>
    `;

    panel.appendChild(header);
    panel.appendChild(body);
    shadow.appendChild(btn);
    shadow.appendChild(panel);

    const pages = {
      summary: shadow.querySelector('[data-page="summary"]'),
      chat: shadow.querySelector('[data-page="chat"]'),
      settings: shadow.querySelector('[data-page="settings"]'),
    };
    const tabs = Array.from(shadow.querySelectorAll('.ngb-tab'));
    const setTab = (name) => {
      for (const t of tabs) t.classList.toggle('active', t.dataset.tab === name);
      for (const [k, p] of Object.entries(pages)) p.classList.toggle('active', k === name);
      if (name) updateUiState({ activeTab: name });
    };
    for (const t of tabs) t.addEventListener('click', () => setTab(t.dataset.tab));

    const el = {
      btn,
      panel,
      close: shadow.getElementById('ngb-close'),
      setTab,

      start: shadow.getElementById('ngb-start'),
      end: shadow.getElementById('ngb-end'),
      maxPage: shadow.getElementById('ngb-maxpage'),
      includeOp: shadow.getElementById('ngb-op'),
      btnRun: shadow.getElementById('ngb-run'),
      btnCopy: shadow.getElementById('ngb-copy'),

      status: shadow.getElementById('ngb-status'),
      errorBox: shadow.getElementById('ngb-error-box'),
      error: shadow.getElementById('ngb-error'),
      result: shadow.getElementById('ngb-result'),

      chatEmpty: shadow.getElementById('ngb-chat-empty'),
      chatList: shadow.getElementById('ngb-chat-list'),
      chatInput: shadow.getElementById('ngb-chat-input'),
      chatSend: shadow.getElementById('ngb-chat-send'),
      chatStatus: shadow.getElementById('ngb-chat-status'),
      chatErrorBox: shadow.getElementById('ngb-chat-error-box'),
      chatError: shadow.getElementById('ngb-chat-error'),

      apiUrl: shadow.getElementById('ngb-apiurl'),
      apiKey: shadow.getElementById('ngb-apikey'),
      model: shadow.getElementById('ngb-model'),
      sendImages: shadow.getElementById('ngb-send-images'),
      setStatus: shadow.getElementById('ngb-set-status'),
      test: shadow.getElementById('ngb-test'),
      testBox: shadow.getElementById('ngb-test-box'),
      testOut: shadow.getElementById('ngb-test-out'),
      clearCache: shadow.getElementById('ngb-clear-cache'),
      promptSum: shadow.getElementById('ngb-prompt-sum'),
      promptChat: shadow.getElementById('ngb-prompt-chat'),
      // compatibility alias
      prompt: shadow.getElementById('ngb-prompt-sum'),
      save: shadow.getElementById('ngb-save'),
    };

    const thread = parseThreadLocation(location);
    const curPage = thread?.page || 1;
    el.start.value = '1';
    el.end.value = '1';

    el.includeOp.checked = !!cfg.includeOriginal;
    el.apiUrl.value = cfg.apiUrl || '';
    el.apiKey.value = cfg.apiKey || '';
    el.model.value = cfg.model || '';
    el.sendImages.checked = !!cfg.sendImages;
    el.promptSum.value = cfg.promptSum || '';
    el.promptChat.value = cfg.promptChat || '';

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const positionPanelNearButton = () => {
      if (!panel.classList.contains('open')) return;
      const btnRect = btn.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const pad = 8;
      const desiredLeft = btnRect.right - panelRect.width;
      const aboveTop = btnRect.top - panelRect.height - 12;
      const belowTop = btnRect.bottom + 12;
      const desiredTop = aboveTop >= pad ? aboveTop : belowTop;

      const left = clamp(desiredLeft, pad, vw - panelRect.width - pad);
      const top = clamp(desiredTop, pad, vh - panelRect.height - pad);

      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    };

    const setPanelOpen = (open) => {
      panel.classList.toggle('open', !!open);
      updateUiState({ panelOpen: !!open });
      if (open) positionPanelNearButton();
    };

    el.close.addEventListener('click', () => setPanelOpen(false));

    // 可拖动入口按钮（点击=开关面板，拖动=移动位置）
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let suppressClick = false;

    btn.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      suppressClick = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = btn.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      try {
        btn.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      e.preventDefault();
    });

    btn.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) >= 4) moved = true;
      if (!moved) return;

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const rect = btn.getBoundingClientRect();
      const left = clamp(startLeft + dx, 0, vw - rect.width);
      const top = clamp(startTop + dy, 0, vh - rect.height);

      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';

      positionPanelNearButton();
      e.preventDefault();
    });

    btn.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      if (!moved) {
        setPanelOpen(!panel.classList.contains('open'));
      } else {
        suppressClick = true;
        const rect = btn.getBoundingClientRect();
        updateUiState({ btnPos: { left: Math.round(rect.left), top: Math.round(rect.top) } });
      }
      try {
        btn.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      e.preventDefault();
    });

    btn.addEventListener('click', (e) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    });

    // Restore UI state (position / size / tab / open)
    if (uiState?.btnPos && Number.isFinite(uiState.btnPos.left) && Number.isFinite(uiState.btnPos.top)) {
      btn.style.left = `${uiState.btnPos.left}px`;
      btn.style.top = `${uiState.btnPos.top}px`;
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    }
    if (uiState?.panelSize && Number.isFinite(uiState.panelSize.width) && Number.isFinite(uiState.panelSize.height)) {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const w = clamp(uiState.panelSize.width, 340, Math.max(340, vw - 24));
      const h = clamp(uiState.panelSize.height, 320, Math.max(320, vh - 24));
      panel.style.width = `${Math.round(w)}px`;
      panel.style.height = `${Math.round(h)}px`;
    }
    if (uiState?.activeTab && Object.prototype.hasOwnProperty.call(pages, uiState.activeTab)) {
      setTab(uiState.activeTab);
    } else {
      setTab('summary');
    }
    if (uiState?.panelOpen) setPanelOpen(true);

    // Persist panel size when resized by user
    if (typeof ResizeObserver === 'function') {
      let resizeTimer = null;
      const ro = new ResizeObserver(() => {
        if (!panel.classList.contains('open')) return;
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const rect = panel.getBoundingClientRect();
          updateUiState({ panelSize: { width: Math.round(rect.width), height: Math.round(rect.height) } });
        }, 200);
      });
      ro.observe(panel);
    }

    return el;
  }

  function setBusy(ui, busy) {
    state.isGenerating = busy;
    ui.btnRun.disabled = busy;
    ui.btnCopy.disabled = busy || !ui.btnCopy.dataset?.ready;

    ui.save.disabled = busy;
    ui.test.disabled = busy;
    ui.clearCache.disabled = busy;

    const chatEnabled = !!state.chat?.history?.length;
    ui.chatInput.disabled = busy || !chatEnabled;
    ui.chatSend.disabled = busy || !chatEnabled;
  }

  function looksLikeImageNotSupported(err) {
    const s = String(err || '').toLowerCase();
    return (
      s.includes('image_url') ||
      s.includes('multimodal') ||
      s.includes('expected string') ||
      s.includes('content must be a string') ||
      (s.includes('messages') && s.includes('content') && s.includes('array')) ||
      (s.includes('unsupported') && s.includes('image'))
    );
  }

  function looksLikeImageFetchFailed(err) {
    const s = String(err || '').toLowerCase();
    if (!s) return false;
    return (
      (s.includes('base64') && s.includes('from url')) ||
      (s.includes('base64') && s.includes('failed to download')) ||
      (s.includes('failed to download') && s.includes('status code') && s.includes('429'))
    );
  }

  function looksLikeDidNotSeeImageAnswer(text) {
    const s = String(text || '').toLowerCase();
    if (!s) return false;
    return (
      s.includes('外部图片') ||
      s.includes('图片链接') ||
      s.includes('无法查看图片') ||
      s.includes('无法直接查看') ||
      s.includes('作为文本') ||
      (s.includes('无法') && s.includes('查看') && s.includes('图片'))
    );
  }

  function enableChat(ui, enabled) {
    ui.chatEmpty.hidden = enabled;
    ui.chatList.hidden = !enabled;
    ui.chatInput.disabled = !enabled || state.isGenerating;
    ui.chatSend.disabled = !enabled || state.isGenerating;
  }

  function appendChatBubble(ui, role, content) {
    const bubble = document.createElement('div');
    bubble.className = `ngb-bubble ${role === 'user' ? 'ngb-bubble-user' : ''}`.trim();
    if (role === 'user') bubble.innerHTML = escapeHtml(content);
    else renderMarkdown(bubble, content);
    ui.chatList.appendChild(bubble);
    ui.chatList.scrollTop = ui.chatList.scrollHeight;
    return bubble;
  }

  function buildChatContextText({ title, postId, startPage, endPage, includeOriginal, posts }) {
    return [
      `帖子标题：${title || ''}`.trim(),
      `帖子链接：${location.origin}/post-${postId}-1`,
      `抓取页码：${startPage} - ${endPage}（每页 ${APP.pageSize} 楼；包含 0 楼：${includeOriginal ? '是' : '否'}）`,
      '',
      '楼层内容（已按楼层排序，已去重）：',
      formatPostsForModel(posts || []),
    ].join('\n');
  }

  function renderChatHistory(ui) {
    const history = Array.isArray(state.chat?.history) ? state.chat.history : [];
    ui.chatList.innerHTML = '';
    let skippedContextUser = false;
    for (const m of history) {
      const role = m?.role;
      const content = messageContentToDisplayText(m?.content);
      if (role === 'system') continue;
      if (!skippedContextUser && role === 'user') {
        skippedContextUser = true;
        continue; // 不把长“楼层上下文”展示在对话气泡里
      }
      if (role === 'user') appendChatBubble(ui, 'user', content);
      if (role === 'assistant') appendChatBubble(ui, 'ai', content);
    }
    ui.chatList.scrollTop = ui.chatList.scrollHeight;
  }

  function initChat(ui, cfg) {
    const summary = state.summary;
    if (!summary?.markdown) return;

    setDetails(ui.chatErrorBox, ui.chatError, '');
    ui.chatStatus.textContent = '';
    ui.chatList.innerHTML = '';

    const contextText =
      summary.contextText ||
      buildChatContextText({
        title: summary.title,
        postId: summary.postId,
        startPage: summary.startPage,
        endPage: summary.endPage,
        includeOriginal: summary.includeOriginal,
        posts: summary.posts,
      });

    state.chat = {
      baseHistory: [
        { role: 'system', content: cfg.promptChat },
        { role: 'user', content: contextText },
        { role: 'assistant', content: summary.markdown },
      ],
      history: [],
    };
    state.chat.history = state.chat.baseHistory.slice();

    enableChat(ui, true);
    appendChatBubble(ui, 'ai', summary.markdown);
    ui.chatStatus.textContent = '已加载总结，可以继续提问。';
    persistThreadState(summary.postId);
  }

  async function runSummary(ui) {
    const thread = parseThreadLocation(location);
    if (!thread) {
      ui.status.textContent = '未识别到帖子页面（需要形如 /post-123-1 的链接）。';
      return;
    }

    setDetails(ui.errorBox, ui.error, '');
    ui.status.textContent = '';
    ui.result.innerHTML = '';
    ui.btnCopy.dataset.ready = '';
    ui.btnCopy.disabled = true;

    const cfg = loadConfig();
    cfg.apiUrl = normalizeApiUrl(ui.apiUrl.value.trim());
    cfg.apiKey = ui.apiKey.value.trim();
    cfg.model = ui.model.value.trim();
    cfg.promptSum = ui.promptSum.value;
    cfg.promptChat = ui.promptChat.value;
    cfg.sendImages = !!ui.sendImages.checked;
    cfg.includeOriginal = !!ui.includeOp.checked;

    if (!cfg.apiUrl || !cfg.apiKey || !cfg.model) {
      ui.status.textContent = '请先在「设置」中填写 API URL / API Key / Model。';
      ui.setTab('settings');
      return;
    }
    if (!/\/chat\/completions/i.test(cfg.apiUrl)) {
      ui.status.textContent = 'API URL 需要是 /v1/chat/completions。';
      ui.setTab('settings');
      return;
    }

    ui.status.textContent = '正在探测总页数…';
    const detectedMaxPage = Number.isFinite(state.maxPage) ? state.maxPage : await detectMaxPage(thread.postId);
    state.maxPage = detectedMaxPage;
    ui.maxPage.textContent = Number.isFinite(detectedMaxPage) ? `共${detectedMaxPage}页` : '共?页';

    const maxForClamp = Number.isFinite(detectedMaxPage) ? detectedMaxPage : 99999;
    let startPage = clampInt(ui.start.value, 1, maxForClamp);
    let endPage = clampInt(ui.end.value, 1, maxForClamp);
    if (startPage > endPage) {
      ui.status.textContent = '页码范围无效：起始页不能大于结束页。';
      return;
    }
    ui.start.value = String(startPage);
    ui.end.value = String(endPage);

    ui.apiUrl.value = cfg.apiUrl;
    saveConfig({
      apiUrl: cfg.apiUrl,
      apiKey: cfg.apiKey,
      model: cfg.model,
      includeOriginal: cfg.includeOriginal,
      sendImages: cfg.sendImages,
      promptSum: cfg.promptSum,
      promptChat: cfg.promptChat,
    });

    setBusy(ui, true);

    let abort = null;
    let finished = false;
    let rendered = '';
    let pending = '';
    let scheduled = false;
    let sawOutput = false;

    const scheduleRender = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (!pending) return;
        rendered += pending;
        pending = '';
        renderMarkdown(ui.result, rendered);
      });
    };

    try {
      const all = new Map();
      let title = document.querySelector('h1')?.textContent?.trim() || document.title || '';

      for (let p = startPage; p <= endPage; p++) {
        ui.status.textContent = `正在抓取第 ${p}/${endPage} 页…`;
        const url = `${location.origin}/post-${thread.postId}-${p}`;
        const html = await fetchHtml(url, {
          throttleMs: calcThrottleMs(),
          onRetry: ({ status, attempt, maxRetries, waitMs }) => {
            const hint = status === 429 ? '站点限流' : `HTTP ${status || '??'}`;
            ui.status.textContent = `抓取遇到${hint}，等待 ${Math.max(1, Math.ceil(waitMs / 1000))}s 后重试（${attempt}/${maxRetries}）…第 ${p}/${endPage} 页`;
          },
        });
        const doc = parseHtml(html);
        title = title || doc.querySelector('h1')?.textContent?.trim() || '';

        const pagePosts = extractPagePosts(doc, p, url, cfg);
        for (const post of pagePosts) {
          const prev = all.get(post.floor);
          const prevLen = prev ? formatPostText(prev).length : -1;
          const nextLen = formatPostText(post).length;
          if (!prev || nextLen > prevLen) all.set(post.floor, post);
        }
      }

      const posts = Array.from(all.values()).sort((a, b) => a.floor - b.floor);
      if (posts.length === 0) throw new Error('未抓取到任何楼层内容，请检查页码范围或稍后重试。');

      const startRequest = (sendImages) => {
        const built = buildSummaryUserMessage({
          title,
          postId: thread.postId,
          startPage,
          endPage,
          includeOriginal: cfg.includeOriginal,
          posts,
          sendImages,
        });

        const contentSize = estimateMessageContentChars(built.content);
        if (contentSize > APP.maxInputChars) {
          throw new Error(`内容过长（约 ${contentSize} 字符），请缩小页码范围后重试。`);
        }

        const imgInfo = sendImages ? `（附带图片 ${built.imageCount}${built.skippedImages ? `，省略 ${built.skippedImages}` : ''}）` : '';
        ui.status.textContent = `已抓取 ${posts.length} 楼，AI 总结生成中（流式）…${imgInfo}`;

        const messages = [
          { role: 'system', content: cfg.promptSum },
          { role: 'user', content: built.content },
        ];

        abort = streamChatCompletionGM({
          apiUrl: cfg.apiUrl,
          apiKey: cfg.apiKey,
          model: cfg.model,
          messages,
          onDelta: (t) => {
            sawOutput = true;
            pending += t;
            scheduleRender();
          },
          onError: (err) => fail(err, sendImages),
          onDone: () => done(),
        });
      };

      const done = () => {
        if (finished) return;
        finished = true;
        if (pending) {
          rendered += pending;
          pending = '';
          renderMarkdown(ui.result, rendered);
        }

        ui.status.textContent = '完成。可切换到「对话」继续追问。';
        ui.btnCopy.dataset.ready = '1';
        ui.btnCopy.disabled = false;
        setBusy(ui, false);

        state.summary = {
          postId: thread.postId,
          title,
          startPage,
          endPage,
          includeOriginal: cfg.includeOriginal,
          posts,
          markdown: rendered,
          contextText: buildChatContextText({
            title,
            postId: thread.postId,
            startPage,
            endPage,
            includeOriginal: cfg.includeOriginal,
            posts,
          }),
        };
        initChat(ui, cfg);
        persistThreadState(thread.postId);
      };

      const fail = (msg, usedImages) => {
        if (finished) return;
        const errText = String(msg || '未知错误');
        if (usedImages && cfg.sendImages && !sawOutput && (looksLikeImageNotSupported(errText) || looksLikeImageFetchFailed(errText))) {
          ui.status.textContent = '检测到图片多模态失败（可能网关不支持或图床被限流/拒绝访问），已降级为仅发送图片链接文本，重试中…';
          if (abort) abort();
          startRequest(false);
          return;
        }
        finished = true;
        ui.status.textContent = '失败。';
        setDetails(ui.errorBox, ui.error, errText);
        setBusy(ui, false);
        if (abort) abort();
      };

      ui.btnCopy.onclick = () => {
        GM_setClipboard(rendered);
        ui.status.textContent = '已复制到剪贴板。';
      };

      startRequest(cfg.sendImages);
    } catch (e) {
      finished = true;
      ui.status.textContent = '失败。';
      setDetails(ui.errorBox, ui.error, e?.message || String(e));
      setBusy(ui, false);
      if (abort) abort();
    }
  }

  async function sendChat(ui) {
    if (!state.chat?.history?.length) {
      ui.chatStatus.textContent = '请先在「总结」页生成总结。';
      return;
    }

    setDetails(ui.chatErrorBox, ui.chatError, '');
    ui.chatStatus.textContent = '';

    const question = ui.chatInput.value.trim();
    if (!question) return;

    const cfg = loadConfig();
    cfg.apiUrl = normalizeApiUrl(ui.apiUrl.value.trim());
    cfg.apiKey = ui.apiKey.value.trim();
    cfg.model = ui.model.value.trim();
    cfg.promptChat = ui.promptChat.value;
    cfg.sendImages = !!ui.sendImages.checked;

    if (!cfg.apiUrl || !cfg.apiKey || !cfg.model) {
      ui.chatStatus.textContent = '请先在「设置」中填写 API URL / API Key / Model。';
      ui.setTab('settings');
      return;
    }
    if (!/\/chat\/completions/i.test(cfg.apiUrl)) {
      ui.chatStatus.textContent = 'API URL 需要是 /v1/chat/completions。';
      ui.setTab('settings');
      return;
    }

    appendChatBubble(ui, 'user', question);
    ui.chatInput.value = '';
    const aiBubble = appendChatBubble(ui, 'ai', '');

    setBusy(ui, true);

    const floors = parseFloorsFromText(question);
    let ctxMap = extractImagesByFloorFromContextText(state.summary?.contextText || '');
    let floorImages = [];
    let targetImages = 0;
    let skippedImages = 0;

    const rebuildFloorImages = () => {
      floorImages = [];
      targetImages = 0;
      skippedImages = 0;
      if (!cfg.sendImages || !floors.length) return;
      for (const f of floors) {
        const urls = (ctxMap.get(f) || []).filter(Boolean);
        if (!urls.length) continue;
        const remaining = APP.maxChatImages - targetImages;
        if (remaining <= 0) {
          skippedImages += urls.length;
          continue;
        }
        const take = urls.slice(0, remaining);
        const skip = urls.length - take.length;
        if (take.length) floorImages.push({ floor: f, urls: take });
        targetImages += take.length;
        skippedImages += Math.max(0, skip);
        if (targetImages >= APP.maxChatImages) break;
      }
    };

    rebuildFloorImages();

    // 若缓存上下文里没提取到图片，尝试按楼层回源抓取一次（只抓用户提到的楼层页）
    if (cfg.sendImages && floors.length && targetImages === 0) {
      const postId = state.summary?.postId || parseThreadLocation(location)?.postId;
      if (postId) {
        ui.chatStatus.textContent = '正在抓取相关楼层图片…';
        const uniquePages = new Set();
        for (const f of floors) {
          const page = f <= 0 ? 1 : Math.floor((f - 1) / APP.pageSize) + 1;
          uniquePages.add(page);
        }
        try {
          const pagesToFetch = Array.from(uniquePages)
            .sort((a, b) => a - b)
            .slice(0, 5);
          for (let i = 0; i < pagesToFetch.length; i++) {
            const p = pagesToFetch[i];
            const url = `${location.origin}/post-${postId}-${p}`;
            const html = await fetchHtml(url, {
              throttleMs: calcThrottleMs(),
              onRetry: ({ status, attempt, maxRetries, waitMs }) => {
                const hint = status === 429 ? '站点限流' : `HTTP ${status || '??'}`;
                ui.chatStatus.textContent = `抓取图片页遇到${hint}，等待 ${Math.max(1, Math.ceil(waitMs / 1000))}s 后重试（${attempt}/${maxRetries}）…（第 ${i + 1}/${pagesToFetch.length} 页）`;
              },
            });
            const doc = parseHtml(html);
            for (const f of floors) {
              const el = doc.querySelector(`#nsk-body-left .content-item[id="${String(f)}"]`);
              const post = el ? extractPost(el, url) : null;
              if (!post?.images?.length) continue;
              const prev = ctxMap.get(f) || [];
              ctxMap.set(f, prev.concat(post.images));
            }
          }
        } catch {
          // ignore
        }
        rebuildFloorImages();
      }
    }

    const userMsg = { role: 'user', content: question };
    state.chat.history.push(userMsg);
    const assistantIndex = state.chat.history.length;
    state.chat.history.push({ role: 'assistant', content: '' });

    let abort = null;
    let finished = false;
    let rendered = '';
    let pending = '';
    let scheduled = false;
    let mode = targetImages > 0 ? 'url' : 'text'; // url | data | text
    let retriedData = false;
    let activeImageCount = 0;
    let activeMode = 'text';

    const scheduleRender = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (!pending) return;
        rendered += pending;
        pending = '';
        renderMarkdown(aiBubble, rendered);
        ui.chatList.scrollTop = ui.chatList.scrollHeight;
      });
    };

    const setAssistantText = (text) => {
      rendered = String(text || '');
      pending = '';
      renderMarkdown(aiBubble, rendered);
      ui.chatList.scrollTop = ui.chatList.scrollHeight;
    };

    const buildUserContent = async (nextMode) => {
      const storedContent = question; // 不把图片 data URL 写入历史/缓存，避免占用存储
      if (nextMode === 'text' || !targetImages) {
        return { storedContent, requestContent: question, imageCount: 0, skipped: 0 };
      }

      const parts = [{ type: 'text', text: `${question}\n\n请结合以下图片输入回答（如有）。\n` }];
      let ok = 0;
      let skipped = 0;

      for (const entry of floorImages) {
        for (const url of entry.urls) {
          let finalUrl = url;
          if (nextMode === 'data') {
            ui.chatStatus.textContent = `正在准备图片…（${ok + skipped + 1}/${targetImages}）`;
            try {
              finalUrl = await fetchImageAsDataUrl(url);
            } catch {
              skipped += 1;
              continue;
            }
          }
          parts.push({ type: 'text', text: `\n[#${entry.floor}] 图片：\n` });
          parts.push({ type: 'image_url', image_url: { url: finalUrl } });
          ok += 1;
        }
      }

      if (ok === 0) return { storedContent, requestContent: question, imageCount: 0, skipped };
      if (skipped || skippedImages) {
        parts.push({
          type: 'text',
          text: `\n\n[图片] 已附带 ${ok} 张，省略 ${skipped + skippedImages} 张（可能过大/下载失败/超出上限）。\n`,
        });
      }
      return { storedContent, requestContent: parts, imageCount: ok, skipped };
    };

    const start = async (nextMode) => {
      if (finished) return;
      mode = nextMode;
      setDetails(ui.chatErrorBox, ui.chatError, '');
      setAssistantText('');

      let built;
      try {
        built = await buildUserContent(nextMode);
      } catch (e) {
        finished = true;
        ui.chatStatus.textContent = '失败。';
        setDetails(ui.chatErrorBox, ui.chatError, e?.message || String(e));
        setBusy(ui, false);
        ui.chatInput.value = question;
        state.chat.history.splice(Math.max(0, assistantIndex - 1)); // rollback user + assistant placeholder
        return;
      }

      userMsg.content = built.storedContent;
      state.chat.history[assistantIndex] = { role: 'assistant', content: '' };

      const imgInfo = built.imageCount ? `（附带图片 ${built.imageCount}${skippedImages ? `，额外省略 ${skippedImages}` : ''}）` : '';
      ui.chatStatus.textContent = `生成中（流式）…${imgInfo}`;
      activeImageCount = built.imageCount || 0;
      activeMode = mode;

      const messages = state.chat.history.slice(0, assistantIndex);
      if (messages.length) {
        messages[messages.length - 1] = { ...messages[messages.length - 1], content: built.requestContent };
      }

      abort = streamChatCompletionGM({
        apiUrl: cfg.apiUrl,
        apiKey: cfg.apiKey,
        model: cfg.model,
        messages,
        onDelta: (t) => {
          pending += t;
          scheduleRender();
        },
        onError: (err) => {
          if (finished) return;
          const errText = String(err || '未知错误');
          if (mode === 'url' && targetImages && (looksLikeImageFetchFailed(errText) || looksLikeImageNotSupported(errText))) {
            if (looksLikeImageFetchFailed(errText) && !retriedData) {
              retriedData = true;
              ui.chatStatus.textContent = '网关拉取图片失败，尝试本地转 base64 再发…';
              if (abort) abort();
              void start('data');
              return;
            }
            ui.chatStatus.textContent = '图片多模态不可用，已改为仅文本重试…';
            if (abort) abort();
            void start('text');
            return;
          }
          finished = true;
          ui.chatStatus.textContent = '失败。';
          setDetails(ui.chatErrorBox, ui.chatError, errText);
          setBusy(ui, false);
          ui.chatInput.value = question;
          if (abort) abort();
          state.chat.history.splice(Math.max(0, assistantIndex - 1)); // rollback user + assistant placeholder
        },
        onDone: () => {
          if (finished) return;
          if (pending) {
            rendered += pending;
            pending = '';
            renderMarkdown(aiBubble, rendered);
          }

          if (mode === 'url' && targetImages && !retriedData && looksLikeDidNotSeeImageAnswer(rendered)) {
            retriedData = true;
            ui.chatStatus.textContent = '模型似乎未看到图片，尝试本地转 base64 再问一遍…';
            if (abort) abort();
            void start('data');
            return;
          }

          finished = true;
          if (activeImageCount) {
            ui.chatStatus.textContent = `完成（已附带图片 ${activeImageCount}；${activeMode === 'data' ? 'Base64' : 'URL'}）。`;
          } else {
            ui.chatStatus.textContent = '完成。';
          }
          state.chat.history[assistantIndex] = { role: 'assistant', content: rendered };
          setBusy(ui, false);
          persistThreadState(state.summary?.postId);
        },
      });
    };

    void start(mode);
  }

  function clearChat(ui) {
    if (!state.chat?.baseHistory?.length) return;
    state.chat.history = state.chat.baseHistory.slice();
    ui.chatList.innerHTML = '';
    if (state.summary?.markdown) appendChatBubble(ui, 'ai', state.summary.markdown);
    ui.chatStatus.textContent = '对话已清空（保留总结上下文）。';
    setDetails(ui.chatErrorBox, ui.chatError, '');
    persistThreadState(state.summary?.postId);
  }

  function testApi(ui) {
    ui.setStatus.textContent = '';
    ui.testOut.textContent = '';
    ui.testBox.hidden = true;

    const cfg = loadConfig();
    cfg.apiUrl = normalizeApiUrl(ui.apiUrl.value.trim());
    cfg.apiKey = ui.apiKey.value.trim();
    cfg.model = ui.model.value.trim();
    if (!cfg.apiUrl || !cfg.apiKey || !cfg.model) {
      ui.setStatus.textContent = '请先填写 API URL / API Key / Model。';
      return;
    }
    if (!/\/chat\/completions/i.test(cfg.apiUrl)) {
      ui.setStatus.textContent = 'API URL 需要是 /v1/chat/completions。';
      return;
    }

    ui.setStatus.textContent = '测试中（流式）…';
    ui.testBox.hidden = false;
    ui.testBox.open = true;

    setBusy(ui, true);

    const startedAt = Date.now();
    let out = '';
    let finished = false;
    let abort = null;

    const fail = (msg) => {
      if (finished) return;
      finished = true;
      ui.setStatus.textContent = `失败：${msg}`;
      ui.testOut.textContent = String(msg || '');
      setBusy(ui, false);
      if (abort) abort();
    };

    abort = streamChatCompletionGM({
      apiUrl: cfg.apiUrl,
      apiKey: cfg.apiKey,
      model: cfg.model,
      messages: [
        { role: 'system', content: '你是一个连通性测试助手。' },
        { role: 'user', content: '请只回复：OK' },
      ],
      onDelta: (t) => {
        out += t;
        ui.testOut.textContent = out;
      },
      onError: (err) => fail(err),
      onDone: () => {
        if (finished) return;
        finished = true;
        const ms = Date.now() - startedAt;
        ui.setStatus.textContent = `成功（${ms}ms）。`;
        setBusy(ui, false);
      },
    });
  }

  function clearAllThreadCaches() {
    if (typeof GM_listValues !== 'function' || typeof GM_deleteValue !== 'function') {
      const thread = parseThreadLocation(location);
      if (thread?.postId) GM_setValue(threadStoreKey(thread.postId), '');
      return { cleared: 0, partial: true };
    }

    const keys = GM_listValues();
    if (!Array.isArray(keys)) return { cleared: 0, partial: true };

    let cleared = 0;
    for (const key of keys) {
      if (typeof key !== 'string') continue;
      if (!key.startsWith(APP.threadKeyPrefix)) continue;
      try {
        GM_deleteValue(key);
        cleared += 1;
      } catch {
        // ignore
      }
    }
    return { cleared, partial: false };
  }

  function resetInMemoryAndUi(ui) {
    state.summary = null;
    state.chat = null;

    ui.status.textContent = '';
    ui.result.innerHTML = '';
    ui.btnCopy.dataset.ready = '';
    ui.btnCopy.disabled = true;

    ui.chatList.innerHTML = '';
    ui.chatStatus.textContent = '';
    ui.chatInput.value = '';
    setDetails(ui.chatErrorBox, ui.chatError, '');
    enableChat(ui, false);
  }

  function main() {
    const thread = parseThreadLocation(location);
    if (!thread) return;

    const cfg = loadConfig();
    const ui = createUi(cfg);
    enableChat(ui, false);

    const refreshMaxPage = async () => {
      ui.maxPage.textContent = '共…页';
      const max = await detectMaxPage(thread.postId);
      state.maxPage = max;
      ui.maxPage.textContent = Number.isFinite(max) ? `共${max}页` : '共?页';
      if (!state.rangeTouched && Number.isFinite(max)) {
        ui.start.value = '1';
        ui.end.value = String(max);
      }
      return max;
    };

    ui.start.addEventListener('input', () => {
      state.rangeTouched = true;
    });
    ui.end.addEventListener('input', () => {
      state.rangeTouched = true;
    });

    const cached = loadThreadState(thread.postId);
    if (cached?.summary?.markdown) {
      state.summary = { ...cached.summary, posts: [] };
      state.rangeTouched = true;
      if (Number.isFinite(state.summary.startPage)) ui.start.value = String(state.summary.startPage);
      if (Number.isFinite(state.summary.endPage)) ui.end.value = String(state.summary.endPage);
      ui.includeOp.checked = !!state.summary.includeOriginal;
      renderMarkdown(ui.result, state.summary.markdown);
      ui.btnCopy.dataset.ready = '1';
      ui.btnCopy.disabled = false;
      ui.btnCopy.onclick = () => {
        GM_setClipboard(state.summary.markdown || '');
        ui.status.textContent = '已复制到剪贴板。';
      };
      ui.status.textContent = '已恢复上次总结（缓存）。';

      initChat(ui, cfg);
      if (cached?.chat?.turns?.length && state.chat?.baseHistory?.length) {
        const turns = Array.isArray(cached.chat.turns) ? cached.chat.turns : [];
        state.chat.history = state.chat.baseHistory.concat(turns);
        enableChat(ui, true);
        renderChatHistory(ui);
        ui.chatStatus.textContent = '已恢复对话（缓存）。';
      }
    }

    ui.save.addEventListener('click', () => {
      const next = {
        apiUrl: normalizeApiUrl(ui.apiUrl.value.trim()),
        apiKey: ui.apiKey.value.trim(),
        model: ui.model.value.trim(),
        includeOriginal: !!ui.includeOp.checked,
        sendImages: !!ui.sendImages.checked,
        promptSum: ui.promptSum.value,
        promptChat: ui.promptChat.value,
      };
      saveConfig(next);
      ui.apiUrl.value = next.apiUrl;
      ui.setStatus.textContent = '设置已保存。';
    });

    ui.test.addEventListener('click', () => testApi(ui));

    ui.clearCache.addEventListener('click', () => {
      const ok = confirm('确认清空缓存（已保存的总结/对话）？不会清除 API 设置。');
      if (!ok) return;

      const res = clearAllThreadCaches();
      resetInMemoryAndUi(ui);
      ui.setStatus.textContent = res.partial
        ? '已清空当前帖子缓存（缺少 GM_listValues/GM_deleteValue 权限，未能全量清空）。'
        : `缓存已清空（已删除 ${res.cleared} 条）。`;
    });

    ui.btnRun.addEventListener('click', () => runSummary(ui));

    ui.chatSend.addEventListener('click', () => sendChat(ui));
    ui.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChat(ui);
      }
    });

    void refreshMaxPage();
  }

  main();
})();
