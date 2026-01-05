// ==UserScript==
// @name         ChatGPT Local Backup
// @namespace    https://ccbkkb.github.io/chatgpt-backup
// @version      0.8.2-latex-project
// @description  实时抓取 ChatGPT 聊天记录 + 本地持久化 + 极简历史管理 UI，支持导出 zip + 媒体，FAB 可拖动，带动画、DEBUG 模式、批量导出/删除、搜索与分页，导出 chatlog.md，附带百宝箱工具菜单（新增 Canvas 画布模式内容抓取，并优化超长会话的存储安全，避免历史被清空），并显示本地备份占用大小，优化百宝箱在移动端的展开与过渡动画体验。当前版本增强：抓取原始 HTML 并在导出时恢复 Markdown/LaTeX，兼容 KaTeX / data-latex，支持项目（/g/...）模式。
// @author       Mashiro Shiina (modified by ChatGPT)
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.3/dist/turndown.js
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558236/ChatGPT%20Local%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/558236/ChatGPT%20Local%20Backup.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------------------
  // 0. 样式
  // ---------------------------
  (function injectStyle() {
    try {
      const styleContent = `
        #chatgpt-backup-overlay {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.24s ease-out, visibility 0s linear 0.24s;
        }
        #chatgpt-backup-overlay.show {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.24s ease-out;
        }
        #chatgpt-backup-overlay .panel {
          transform: translateY(100%);
          transition: transform 0.3s ease-out;
        }
        #chatgpt-backup-overlay.show .panel {
          transform: translateY(0);
        }
        #chatgpt-backup-toast {
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        #chatgpt-backup-toast.show {
          opacity: 1;
        }
        #chatgpt-backup-fab:active {
          transform: scale(0.9);
          opacity: 0.8;
          transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }
        #chatgpt-backup-menu {
          transition: opacity 0.18s ease-out, transform 0.18s ease-out;
        }
        #chatgpt-backup-menu .treasure-links {
          max-height: 0;
          overflow-y: hidden;
          transition: max-height 0.22s ease-out;
        }
        #chatgpt-backup-menu .treasure-links.expanded {
          max-height: 420px;
        }
      `;
      const styleTag = document.createElement('style');
      styleTag.type = 'text/css';
      styleTag.appendChild(document.createTextNode(styleContent));
      (document.head || document.documentElement).appendChild(styleTag);
    } catch (e) {
      console.warn('[ChatGPT Backup] injectStyle error', e);
    }
  })();

  // ---------------------------
  // 0.1.1 百宝箱书签配置
  // 在这里添加 / 编辑你的常用工具链接
  // ---------------------------
  const TREASURE_LINKS = [
    {
      id: 'tempmail',
      label: '临时邮箱',
      url: 'https://chat-tempmail.com/zh'
    },
    {
      id: 'md_pdf_mdtool',
      label: 'Markdown 转 PDF（MD-TOOL）',
      url: 'https://md-tool.com/zh/markdown-to-pdf'
    },
    {
      id: 'md_pdf_janqi',
      label: 'Markdown 转 PDF（前端）',
      url: 'https://markdowntopdf.janqi.com/zh.html'
    },
    {
      id: 'md_img_cn',
      label: 'Markdown 转图片（MarkdownToImage）',
      url: 'https://markdowntoimage.cn/markdown-to-image'
    },
    {
      id: 'md_img_md2img',
      label: 'Markdown 转图片（MD2IMG）',
      url: 'https://md2img.online/zh-cn/'
    },
    {
      id: 'md_word_io',
      label: 'Markdown 转 Word DOCX',
      url: 'https://markdowntoword.io/'
    },
    {
      id: 'md_word_mdtoword',
      label: 'Markdown 转 Word（mdtoword.org）',
      url: 'https://mdtoword.org/markdown-to-docx'
    },
    {
      id: 'stackedit',
      label: '在线 Markdown 编辑器（StackEdit）',
      url: 'https://stackedit.io/app#'
    },
    {
      id: 'dillinger',
      label: '在线 Markdown 编辑器（Dillinger）',
      url: 'https://dillinger.io/'
    }
  ];

  // ---------------------------
  // 1. 存储封装
  // ---------------------------
  const hasGMValue =
    typeof GM_getValue === 'function' &&
    typeof GM_setValue === 'function';
  const hasGMRequest = typeof GM_xmlhttpRequest === 'function';

  const STORAGE_KEY_CONVERSATIONS = 'chatgpt_conversations';
  const STORAGE_KEY_LAST_CONV_ID = 'chatgpt_last_conversation_id';
  const STORAGE_KEY_DEBUG = 'chatgpt_backup_debug';
  const STORAGE_KEY_FAB_POS = 'chatgpt_backup_fab_pos';

  // 针对超长会话的安全限制，避免单个会话撑爆整个存储
  const MAX_MESSAGES_PER_CONVERSATION = 400;
  const MAX_CHARS_PER_MESSAGE = 32000;

  function storageGet(key, def) {
    if (hasGMValue) {
      try {
        return GM_getValue(key, def);
      } catch (e) {
        console.warn('[ChatGPT Backup] GM_getValue error, fallback to localStorage', e);
      }
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return def;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[ChatGPT Backup] localStorage get error', e);
      return def;
    }
  }

  /**
   * 安全写入：返回布尔值，表示写入是否成功。
   * 避免写入失败时误以为成功，从而导致后续逻辑用“空对象”覆盖历史。
   */
  function storageSet(key, value) {
    let ok = false;
    if (hasGMValue) {
      try {
        GM_setValue(key, value);
        ok = true;
      } catch (e) {
        console.warn('[ChatGPT Backup] GM_setValue error, fallback to localStorage', e);
      }
    }
    if (!ok) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        ok = true;
      } catch (e) {
        console.warn('[ChatGPT Backup] localStorage set error', e);
      }
    }
    return ok;
  }

  function loadAllConversations() {
    const data = storageGet(STORAGE_KEY_CONVERSATIONS, null);
    if (!data || typeof data !== 'object') return {};
    return data;
  }

  /**
   * 尝试在存储空间不足时自动删除最早的会话，避免“全仓清空”
   */
  function tryShrinkAndSave(map) {
    try {
      const copy = {};
      Object.keys(map || {}).forEach((id) => {
        copy[id] = map[id];
      });

      const convs = Object.values(copy)
        .filter((c) => c && typeof c === 'object' && c.id)
        .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0)); // 最早的在前

      if (!convs.length) return false;

      let removed = 0;
      for (let i = 0; i < convs.length; i++) {
        const c = convs[i];
        if (!c || !c.id) continue;
        if (Object.keys(copy).length <= 1) break; // 至少保留一个
        delete copy[c.id];
        removed++;
        if (storageSet(STORAGE_KEY_CONVERSATIONS, copy)) {
          if (removed > 0) {
            showToast(`本地备份空间不足，已自动删除最早的 ${removed} 个会话`);
          }
          return true;
        }
      }

      console.warn('[ChatGPT Backup] tryShrinkAndSave failed after removing oldest conversations');
      showToast('本地空间不足，新会话暂时无法保存，请导出或删除部分旧会话后重试');
    } catch (e) {
      console.warn('[ChatGPT Backup] tryShrinkAndSave error', e);
    }
    return false;
  }

  /**
   * 保存所有会话：写入失败时不会“写空”，而是尝试缩减再写；失败则保持原状。
   * options.force = true 时跳过 shrink 逻辑（用于删除操作）。
   */
  function saveAllConversations(map, options) {
    const force = options && options.force;
    const ok = storageSet(STORAGE_KEY_CONVERSATIONS, map);
    if (ok || force) return ok;
    // 写入失败时尝试缩减
    return tryShrinkAndSave(map);
  }

  function isDebug() {
    return !!storageGet(STORAGE_KEY_DEBUG, false);
  }

  function setDebug(enabled) {
    storageSet(STORAGE_KEY_DEBUG, !!enabled);
    showToast('DEBUG 模式已' + (enabled ? '开启' : '关闭'));
  }

  /**
   * 归一化会话，防止单个会话消息过多或单条消息过长
   */
  function normalizeConversationForStorage(conv) {
    if (!conv || typeof conv !== 'object') return conv;

    const out = Object.assign({}, conv);
    const msgs = Array.isArray(conv.messages) ? conv.messages.slice() : [];

    // 限制单条消息长度
    for (let i = 0; i < msgs.length; i++) {
      const m = Object.assign({}, msgs[i]);
      if (typeof m.content === 'string' && m.content.length > MAX_CHARS_PER_MESSAGE) {
        m.content =
          m.content.slice(0, MAX_CHARS_PER_MESSAGE) +
          '\n\n[内容过长，已截断，仅保留前 ' +
          MAX_CHARS_PER_MESSAGE +
          ' 字符]';
      }
      if (typeof m.html === 'string' && m.html.length > MAX_CHARS_PER_MESSAGE) {
        m.html =
          m.html.slice(0, MAX_CHARS_PER_MESSAGE) +
          '<!-- 内容过长，已截断，仅保留前 ' +
          MAX_CHARS_PER_MESSAGE +
          ' 字符 -->';
      }
      if (typeof m.markdown === 'string' && m.markdown.length > MAX_CHARS_PER_MESSAGE) {
        m.markdown =
          m.markdown.slice(0, MAX_CHARS_PER_MESSAGE) +
          '\n\n<!-- 内容过长，已截断，仅保留前 ' +
          MAX_CHARS_PER_MESSAGE +
          ' 字符 -->';
      }
      msgs[i] = m;
    }

    // 限制消息条数，只保留最近 N 条
    if (msgs.length > MAX_MESSAGES_PER_CONVERSATION) {
      const cut = msgs.length - MAX_MESSAGES_PER_CONVERSATION;
      out.messages = msgs.slice(cut);
    } else {
      out.messages = msgs;
    }

    return out;
  }

  function saveConversation(conv) {
    const normalized = normalizeConversationForStorage(conv);
    const prevMap = loadAllConversations();
    const map = Object.assign({}, prevMap);
    map[normalized.id] = normalized;
    const ok = saveAllConversations(map);
    if (!ok) {
      // 保存失败，保留旧数据，避免把历史清空
      if (isDebug()) {
        console.warn('[ChatGPT Backup] saveConversation failed, keep previous data only');
        showToast('本地空间不足，本次会话未保存，但已有历史依然安全');
      }
      return;
    }
    storageSet(STORAGE_KEY_LAST_CONV_ID, normalized.id);
    if (isDebug()) {
      showToast(`已保存 ${normalized.messages.length} 条消息`);
      console.log('[ChatGPT Backup] saveConversation', normalized.id, normalized);
    }
  }

  function getLastConversation() {
    const lastId = storageGet(STORAGE_KEY_LAST_CONV_ID, null);
    if (!lastId) return null;
    const map = loadAllConversations();
    return map[lastId] || null;
  }

  function deleteConversationById(id) {
    const map = loadAllConversations();
    if (map[id]) {
      delete map[id];
      const ok = saveAllConversations(map, { force: true });
      if (!ok) {
        console.warn('[ChatGPT Backup] deleteConversationById save failed');
        showToast('删除本地备份失败，请检查存储空间');
        return;
      }
      const lastId = storageGet(STORAGE_KEY_LAST_CONV_ID, null);
      if (lastId === id) {
        const ids = Object.keys(map)
          .map((cid) => map[cid])
          .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
          .map((c) => c.id);
        storageSet(STORAGE_KEY_LAST_CONV_ID, ids[0] || null);
      }
    }
  }

  // ---------------------------
  // 2. 会话 ID
  // ---------------------------
  let currentConversationId = null;

  function getConversationIdFromUrl() {
    const path = location.pathname || '';

    // 正常对话 /c/uuid
    const m = path.match(/\/c\/([0-9a-fA-F\-]+)/);
    if (m) {
      return 'chatgpt_' + m[1];
    }

    // 项目 /g/... 模式
    const g = path.match(/\/g\/([0-9a-zA-Z\-_]+)/);
    if (g) {
      return 'chatgpt_g_' + g[1];
    }

    // 其他路径，使用 path 兜底
    if (path && path !== '/') {
      return 'chatgpt_path_' + path.replace(/\//g, '_');
    }
    return null;
  }

  function ensureConversationId() {
    const idFromUrl = getConversationIdFromUrl();
    if (idFromUrl) {
      currentConversationId = idFromUrl;
    }
    return currentConversationId;
  }

  // ---------------------------
  // 3. Toast
  // ---------------------------
  let toastEl = null;
  let toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    if (!document.body) return null;
    const el = document.createElement('div');
    el.id = 'chatgpt-backup-toast';
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.bottom = '12px';
    el.style.transform = 'translateX(-50%)';
    el.style.zIndex = '999999';
    el.style.padding = '6px 12px';
    el.style.fontSize = '12px';
    el.style.borderRadius = '999px';
    el.style.background = 'rgba(0,0,0,0.76)';
    el.style.color = '#fff';
    el.style.maxWidth = '80vw';
    el.style.textAlign = 'center';
    el.style.pointerEvents = 'none';
    el.style.fontFamily =
      'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    document.body.appendChild(el);
    toastEl = el;
    return el;
  }

  function showToast(text) {
    const el = ensureToast();
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 1800);
  }

  // ---------------------------
  // 4. Markdown / HTML 辅助（导出时用 Turndown + LaTeX 预处理）
  // ---------------------------
  let turndownService = null;

  function getTurndownService() {
    if (turndownService) return turndownService;
    try {
      if (typeof TurndownService === 'function') {
        const svc = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          bulletListMarker: '-',
        });
        turndownService = svc;
        return svc;
      }
    } catch (e) {
      console.warn('[ChatGPT Backup] TurndownService init error', e);
    }
    return null;
  }

  /**
   * 在 Turndown 之前，把 KaTeX / data-latex 等结构转换回 TeX 源码并用 $ / $$ 包裹。
   * 这样导出的 Markdown 中公式就是真正可复制的 LaTeX。
   */
  function convertLatexInDom(root) {
    if (!root || !root.querySelectorAll) return;
    const doc = root.ownerDocument || document;

    try {
      // 1. KaTeX 结构：span.katex-display / span.katex
      const katexWrappers = Array.from(
        root.querySelectorAll('span.katex-display, span.katex')
      );

      katexWrappers.forEach((wrapper) => {
        if (!wrapper.parentNode) return;

        const annotation =
          wrapper.querySelector('annotation[encoding="application/x-tex"]') ||
          wrapper.querySelector('annotation[encoding="application/x-TeX"]');

        if (!annotation) return;

        let tex = annotation.textContent || '';
        if (!tex) return;

        // 把不间断空格换回普通空格，避免奇怪字符
        tex = tex.replace(/\u00A0/g, ' ');
        tex = tex.trim();

        const isDisplay = wrapper.classList.contains('katex-display');
        const delimiter = isDisplay ? '$$' : '$';

        let replacement = delimiter + tex + delimiter;
        if (isDisplay) {
          // 给块级公式前后加空行，方便 Markdown 渲染
          replacement = '\n\n' + replacement + '\n\n';
        }

        const textNode = doc.createTextNode(replacement);
        wrapper.parentNode.replaceChild(textNode, wrapper);
      });

      // 2. data-latex 属性（部分新 UI 可能采用）
      const latexNodes = Array.from(root.querySelectorAll('[data-latex]'));
      latexNodes.forEach((el) => {
        if (!el.parentNode) return;
        const tex = el.getAttribute('data-latex');
        if (!tex) return;

        const type = (el.getAttribute('data-latex-type') || '').toLowerCase();
        const displayAttr =
          (el.getAttribute('data-latex-display') || '').toLowerCase();

        const ds = el.dataset || {};
        const isBlock =
          type === 'block' ||
          type === 'display' ||
          displayAttr === 'block' ||
          displayAttr === 'display' ||
          ds.block === 'true' ||
          ds.display === 'block' ||
          /block|display/.test((el.className || '').toString()) ||
          el.tagName === 'DIV' ||
          el.tagName === 'P';

        const delimiter = isBlock ? '$$' : '$';
        let replacement = delimiter + tex.trim() + delimiter;

        if (isBlock) {
          replacement = '\n\n' + replacement + '\n\n';
        }

        const textNode = doc.createTextNode(replacement);
        el.parentNode.replaceChild(textNode, el);
      });
    } catch (e) {
      console.warn('[ChatGPT Backup] convertLatexInDom error', e);
    }
  }

  function htmlToMarkdown(html) {
    try {
      const svc = getTurndownService();
      if (!svc || !html) return '';
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      // 先把 KaTeX / data-latex 等转换为真正的 TeX 源码
      convertLatexInDom(wrapper);

      // 移除按钮等 UI 垃圾节点，避免污染导出内容
      ['button', 'svg', 'path', 'textarea'].forEach((sel) => {
        wrapper.querySelectorAll(sel).forEach((el) => el.remove());
      });

      const md = svc.turndown(wrapper);
      return (md || '').trim();
    } catch (e) {
      console.warn('[ChatGPT Backup] htmlToMarkdown error', e);
      return '';
    }
  }

  function getMessagePlainText(m) {
    if (m.content && m.content.trim()) return m.content;
    if (m.markdown && m.markdown.trim()) return m.markdown;
    if (m.html) {
      try {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = m.html;
        return (wrapper.innerText || '').trim();
      } catch (e) {
        return '';
      }
    }
    return '';
  }

  function getMessageMarkdown(m) {
    if (m.markdown && m.markdown.trim()) return m.markdown.trim();
    if (m.html) {
      const md = htmlToMarkdown(m.html);
      if (md) return md;
    }
    if (m.content && m.content.trim()) return m.content.trim();
    return '';
  }

  // ---------------------------
  // 5. 抓取 ChatGPT 消息 + 媒体
  // ---------------------------
  function detectRole(node) {
    if (!node || !node.getAttribute) return 'assistant';

    const roleAttr = node.getAttribute('data-message-author-role');
    if (roleAttr === 'user' || roleAttr === 'assistant') return roleAttr;

    const testId =
      node.getAttribute('data-testid') ||
      node.getAttribute('data-test-id') ||
      '';
    const cls = (node.className || '').toString();
    const hint = (testId + ' ' + cls).toLowerCase();

    if (/\buser\b/.test(hint)) return 'user';
    if (/\bassistant\b/.test(hint) || /\bbot\b/.test(hint) || /\bgpt\b/.test(hint)) {
      return 'assistant';
    }

    return 'assistant';
  }

  function extractTextFromNode(node) {
    return node.innerText || '';
  }

  function extractMediaFromNode(node) {
    const media = [];
    const imgEls = node.querySelectorAll('img');
    imgEls.forEach((img) => {
      const src = img.currentSrc || img.src;
      if (!src) return;
      media.push({ type: 'image', url: src, alt: img.alt || '' });
    });
    const avEls = node.querySelectorAll('audio, video');
    avEls.forEach((el) => {
      const src = el.currentSrc || el.src;
      if (!src) return;
      media.push({ type: el.tagName.toLowerCase(), url: src });
    });
    return media;
  }

  function extractHtmlFromNode(node) {
    try {
      return node.innerHTML || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Canvas 画布模式内容抓取：
   * 尝试在 main 中识别带有 "canvas" 特征的编辑区域，并将其作为额外的一条消息备份。
   */
  function queryCanvasBlocks(container) {
    const blocks = [];
    if (!container) return blocks;

    const now = Date.now();

    const selectors =
      '[data-testid*="canvas"],[data-test-id*="canvas"],[id*="canvas"],[class*="canvas"]';
    const candidateNodes = Array.from(container.querySelectorAll(selectors));

    if (!candidateNodes.length) return blocks;

    // 只保留顶层 canvas 容器（避免重复包含）
    const topLevelCandidates = candidateNodes.filter((el) => {
      if (el.closest('[data-message-author-role]')) return false;
      return !candidateNodes.some((other) => other !== el && other.contains(el));
    });

    topLevelCandidates.forEach((el) => {
      const text = (el.innerText || '').trim();
      if (!text) return;
      const rect = el.getBoundingClientRect && el.getBoundingClientRect();
      // 排除很小的按钮/标签，粗略认为真正的画布至少有一定尺寸或文本
      if (
        rect &&
        rect.width < 200 &&
        rect.height < 80 &&
        text.length < 200
      ) {
        return;
      }
      blocks.push({
        role: 'assistant',
        content: text,
        timestamp: now,
        isCanvas: true,
      });
    });

    return blocks;
  }

  function queryMessages() {
    const messages = [];

    const container =
      document.querySelector('[data-testid="conversation-pane"]') ||
      document.querySelector('main') ||
      document.querySelector('div[role="main"]') ||
      document.body;

    if (!container) return messages;

    let nodes = container.querySelectorAll('[data-message-author-role]');
    if (!nodes || !nodes.length) {
      // 项目模式 / 新 UI 兜底选择
      nodes = container.querySelectorAll(
        '[data-testid*="chat-message"],[data-testid*="conversation-turn"],[data-testid*="assistant-message"],[data-testid*="user-message"]'
      );
    }
    if (!nodes || !nodes.length) return messages;

    const now = Date.now();

    // 普通聊天消息：这次不仅保存文本 + 媒体，也保存 HTML，
    // 便于导出时通过 Turndown + LaTeX 预处理恢复 Markdown / TeX
    nodes.forEach((node) => {
      const role = detectRole(node);
      const content = extractTextFromNode(node).trim();
      const media = extractMediaFromNode(node);
      const html = extractHtmlFromNode(node);

      if (!content && !media.length && !html) return;

      const msg = {
        role,
        timestamp: now,
      };
      if (content) msg.content = content;
      if (html) msg.html = html;
      if (media.length) msg.media = media;
      messages.push(msg);
    });

    // Canvas 画布内容（如果存在）
    const canvasBlocks = queryCanvasBlocks(container);
    if (canvasBlocks.length) {
      canvasBlocks.forEach((block) => {
        messages.push(block);
      });
    }

    return messages;
  }

  // ---------------------------
  // 6. 自动保存（防抖）
  // ---------------------------
  let saveTimer = null;

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(doSaveConversation, 1500);
  }

  function doSaveConversation() {
    const msgs = queryMessages();
    if (!msgs.length) return;

    const path = location.pathname || '';
    const hasUuid = /\/c\/[0-9a-fA-F\-]+/.test(path);
    if (!hasUuid && path === '/') {
      if (isDebug()) {
        console.log('[ChatGPT Backup] skip save on root path /, wait for /c/uuid');
      }
      return;
    }

    const cid = ensureConversationId();
    if (!cid) {
      if (isDebug()) {
        console.log('[ChatGPT Backup] no conversation id yet, skip save');
      }
      return;
    }

    const rawConv = {
      id: cid,
      url: location.href,
      title: document.title,
      messages: msgs,
      updatedAt: Date.now(),
    };
    const conv = normalizeConversationForStorage(rawConv);
    saveConversation(conv);
  }

  // ---------------------------
  // 7. 观察 DOM 变化
  // ---------------------------
  function initObserver() {
    const target =
      document.querySelector('[data-testid="conversation-pane"]') ||
      document.querySelector('main') ||
      document.querySelector('div[role="main"]') ||
      document.body;

    if (!target) {
      setTimeout(initObserver, 2000);
      return;
    }

    const obs = new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {
          scheduleSave();
          break;
        }
      }
    });
    obs.observe(target, { childList: true, subtree: true });
    scheduleSave();
  }

  // ---------------------------
  // 8. FAB + 管理 UI 变量
  // ---------------------------
  let fabBtn = null;
  let overlayEl = null;
  let listViewEl = null;
  let detailViewEl = null;
  let detailContentEl = null;
  let debugBtnEl = null;

  let batchModeEnabled = false;
  let batchSelectedIds = new Set();

  let batchBarEl = null;
  let batchCountEl = null;
  let batchSelectAllBtnEl = null;
  let batchExportBtnEl = null;
  let batchDeleteBtnEl = null;
  let batchExitBtnEl = null;

  const PAGE_SIZE = 20;
  let currentPage = 1;
  let searchQuery = '';

  let searchInputEl = null;
  let searchWrapperEl = null;
  let listBodyEl = null;
  let storageInfoEl = null;

  function ensureManagerButton() {
    if (fabBtn || !document.body) return;
    const btn = document.createElement('button');
    btn.id = 'chatgpt-backup-fab';
    btn.type = 'button';
    btn.textContent = '≡';
    btn.style.position = 'fixed';
    btn.style.zIndex = '999998';
    btn.style.width = '48px';
    btn.style.height = '48px';
    btn.style.borderRadius = '999px';
    btn.style.border = 'none';
    btn.style.background = 'rgba(0,0,0,0.82)';
    btn.style.color = '#fff';
    btn.style.fontSize = '18px';
    btn.style.lineHeight = '48px';
    btn.style.textAlign = 'center';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
    btn.style.cursor = 'pointer';
    btn.style.padding = '0';
    btn.style.margin = '0';
    btn.style.fontFamily =
      'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    btn.style.userSelect = 'none';
    btn.style.touchAction = 'none';
    btn.style.opacity = '0.88';

    const saved = storageGet(STORAGE_KEY_FAB_POS, null);
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      btn.style.left = saved.x + 'px';
      btn.style.top = saved.y + 'px';
    } else {
      const vw = window.innerWidth || 360;
      const vh = window.innerHeight || 640;
      btn.style.left = Math.max(16, vw - 64) + 'px';
      btn.style.top = Math.max(16, vh - 88) + 'px';
    }

    let dragging = false;
    let dragMoved = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let startX = 0;
    let startY = 0;
    const TH2 = 25;

    function getP(e) {
      if (e.touches && e.touches.length) return e.touches[0];
      return e;
    }
    function onDragStart(e) {
      const p = getP(e);
      dragging = true;
      dragMoved = false;
      startX = p.clientX;
      startY = p.clientY;
      const rect = btn.getBoundingClientRect();
      dragOffsetX = p.clientX - rect.left;
      dragOffsetY = p.clientY - rect.top;
    }
    function onDragMove(e) {
      if (!dragging) return;
      const p = getP(e);
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      if (!dragMoved && dx * dx + dy * dy > TH2) {
        dragMoved = true;
      }
      if (!dragMoved) return;
      e.preventDefault();
      let x = p.clientX - dragOffsetX;
      let y = p.clientY - dragOffsetY;
      const margin = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      x = Math.min(vw - w - margin, Math.max(margin, x));
      y = Math.min(vh - h - margin, Math.max(margin, y));
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
    }
    function onDragEnd() {
      if (!dragging) return;
      dragging = false;
      if (dragMoved) {
        const r = btn.getBoundingClientRect();
        storageSet(STORAGE_KEY_FAB_POS, { x: r.left, y: r.top });
      }
    }

    btn.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    btn.addEventListener('touchstart', (e) => onDragStart(e), { passive: true });
    window.addEventListener('touchmove', (e) => onDragMove(e), { passive: false });
    window.addEventListener('touchend', onDragEnd);

    btn.addEventListener('click', () => {
      if (dragMoved) return;
      openManagerOverlay();
    });

    document.body.appendChild(btn);
    fabBtn = btn;
  }

  // ---------------------------
  // 9. 管理面板 + 百宝箱 + 批量条
  // ---------------------------
  function createOverlay() {
    if (overlayEl || !document.body) return;
    const overlay = document.createElement('div');
    overlay.id = 'chatgpt-backup-overlay';

    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '999997';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'flex-end';
    overlay.style.fontFamily =
      'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.style.position = 'relative';
    panel.style.width = '100%';
    panel.style.maxWidth = '720px';
    panel.style.maxHeight = '80vh';
    panel.style.margin = '0 auto 8px';
    panel.style.background = '#ffffff';
    panel.style.borderRadius = '18px 18px 14px 14px';
    panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.overflow = 'hidden';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '10px 14px 8px';
    header.style.borderBottom = '1px solid rgba(0,0,0,0.06)';

    const title = document.createElement('div');
    title.textContent = '聊天备份';
    title.style.fontSize = '14px';
    title.style.fontWeight = '600';

    const headerRight = document.createElement('div');
    headerRight.style.display = 'flex';
    headerRight.style.alignItems = 'center';
    headerRight.style.gap = '6px';

    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.textContent = '⋯';
    moreBtn.style.border = 'none';
    moreBtn.style.background = 'transparent';
    moreBtn.style.fontSize = '16px';
    moreBtn.style.color = '#666';
    moreBtn.style.padding = '2px 6px';
    moreBtn.style.cursor = 'pointer';
    moreBtn.style.lineHeight = '1';

    const debugBtn = document.createElement('button');
    debugBtn.type = 'button';
    debugBtn.textContent = isDebug() ? 'DEBUG 开' : 'DEBUG 关';
    debugBtn.style.border = 'none';
    debugBtn.style.background = 'transparent';
    debugBtn.style.fontSize = '11px';
    debugBtn.style.color = '#999';
    debugBtn.style.padding = '4px 6px';
    debugBtn.style.cursor = 'pointer';

    debugBtn.addEventListener('click', () => {
      const now = !isDebug();
      setDebug(now);
      debugBtn.textContent = now ? 'DEBUG 开' : 'DEBUG 关';
    });

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '关闭';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.fontSize = '13px';
    closeBtn.style.color = '#666';
    closeBtn.style.padding = '4px 8px';
    closeBtn.style.cursor = 'pointer';

    closeBtn.addEventListener('click', () => {
      hideMenu();
      closeManagerOverlay();
    });

    headerRight.appendChild(moreBtn);
    headerRight.appendChild(debugBtn);
    headerRight.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(headerRight);

    const listView = document.createElement('div');
    listView.style.flex = '1';
    listView.style.overflowY = 'auto';
    listView.style.padding = '8px 10px 10px';
    listView.style.fontSize = '13px';
    listView.style.background = '#fafafa';

    const detailView = document.createElement('div');
    detailView.style.flex = '1';
    detailView.style.overflowY = 'auto';
    detailView.style.padding = '10px 12px 12px';
    detailView.style.fontSize = '13px';
    detailView.style.display = 'none';
    detailView.style.background = '#fafafa';

    const detailTopBar = document.createElement('div');
    detailTopBar.style.display = 'flex';
    detailTopBar.style.justifyContent = 'space-between';
    detailTopBar.style.alignItems = 'center';
    detailTopBar.style.marginBottom = '8px';

    const detailTitle = document.createElement('div');
    detailTitle.textContent = '会话详情';
    detailTitle.style.fontSize = '13px';
    detailTitle.style.fontWeight = '500';

    const detailBackBtn = document.createElement('button');
    detailBackBtn.type = 'button';
    detailBackBtn.textContent = '返回';
    detailBackBtn.style.border = 'none';
    detailBackBtn.style.background = 'transparent';
    detailBackBtn.style.fontSize = '13px';
    detailBackBtn.style.color = '#666';
    detailBackBtn.style.padding = '4px 8px';
    detailBackBtn.style.cursor = 'pointer';

    detailBackBtn.addEventListener('click', () => {
      listView.style.display = 'block';
      detailView.style.display = 'none';
    });

    detailTopBar.appendChild(detailTitle);
    detailTopBar.appendChild(detailBackBtn);

    const detailContent = document.createElement('pre');
    detailContent.style.whiteSpace = 'pre-wrap';
    detailContent.style.wordBreak = 'break-word';
    detailContent.style.fontFamily =
      'system-ui, -apple-system, BlinkMacSystemFont, "SF Mono", monospace';
    detailContent.style.fontSize = '12px';
    detailContent.style.lineHeight = '1.5';
    detailContent.style.padding = '8px 10px';
    detailContent.style.borderRadius = '10px';
    detailContent.style.background = '#ffffff';
    detailContent.style.border = '1px solid rgba(0,0,0,0.05)';

    detailView.appendChild(detailTopBar);
    detailView.appendChild(detailContent);

    const batchBar = document.createElement('div');
    batchBar.style.display = 'none';
    batchBar.style.alignItems = 'center';
    batchBar.style.justifyContent = 'space-between';
    batchBar.style.padding = '6px 10px 8px';
    batchBar.style.borderTop = '1px solid rgba(0,0,0,0.06)';
    batchBar.style.background = '#fff';

    const batchLeft = document.createElement('div');
    batchLeft.style.fontSize = '12px';
    batchLeft.style.color = '#555';

    const batchCount = document.createElement('span');
    batchCount.textContent = '已选 0';

    batchLeft.appendChild(batchCount);

    const batchRight = document.createElement('div');
    batchRight.style.display = 'flex';
    batchRight.style.gap = '6px';

    function createBatchButton(label, color, handler) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.border = '1px solid rgba(0,0,0,0.08)';
      btn.style.borderRadius = '999px';
      btn.style.padding = '4px 10px';
      btn.style.fontSize = '12px';
      btn.style.background = '#fff';
      btn.style.color = color || '#333';
      btn.style.cursor = 'pointer';
      btn.style.minHeight = '32px';
      btn.style.touchAction = 'manipulation';
      btn.addEventListener('click', handler);
      return btn;
    }

    const btnSelectAll = createBatchButton('全选', '#007aff', () => {
      handleSelectAll();
    });
    const btnBatchExport = createBatchButton('导出', '#007aff', () => {
      exportSelectedConversationsAsZip().catch((err) => {
        console.error('[ChatGPT Backup] batch export error', err);
        showToast('批量导出失败');
      });
    });
    const btnBatchDelete = createBatchButton('删除', '#ff3b30', () => {
      handleBatchDelete();
    });
    const btnBatchExit = createBatchButton('退出', '#666', () => {
      exitBatchMode();
    });

    batchRight.appendChild(btnSelectAll);
    batchRight.appendChild(btnBatchExport);
    batchRight.appendChild(btnBatchDelete);
    batchRight.appendChild(btnBatchExit);

    batchBar.appendChild(batchLeft);
    batchBar.appendChild(batchRight);

    // 百宝箱菜单
    const menu = document.createElement('div');
    menu.id = 'chatgpt-backup-menu';
    menu.style.position = 'fixed';
    menu.style.right = '12px';
    menu.style.top = '44px';
    menu.style.minWidth = '210px';
    menu.style.maxWidth = '90vw';
    menu.style.background = '#fff';
    menu.style.borderRadius = '12px';
    menu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    menu.style.padding = '6px 0';
    menu.style.fontSize = '13px';
    menu.style.display = 'none';
    menu.style.zIndex = '1000';
    menu.style.maxHeight = '70vh';
    menu.style.overflowY = 'auto';
    menu.style.webkitOverflowScrolling = 'touch';

    const linksHeader = document.createElement('div');
    linksHeader.style.display = 'flex';
    linksHeader.style.alignItems = 'center';
    linksHeader.style.justifyContent = 'space-between';
    linksHeader.style.padding = '6px 12px';
    linksHeader.style.cursor = 'pointer';
    linksHeader.style.userSelect = 'none';

    const linksHeaderText = document.createElement('span');
    linksHeaderText.textContent = '百宝箱';

    const linksArrow = document.createElement('span');
    linksArrow.textContent = '▾';
    linksArrow.style.fontSize = '11px';
    linksArrow.style.opacity = '0.6';

    linksHeader.appendChild(linksHeaderText);
    linksHeader.appendChild(linksArrow);

    const linksContainer = document.createElement('div');
    linksContainer.style.paddingTop = '4px';
    linksContainer.style.borderTop = '1px solid rgba(0,0,0,0.06)';
    linksContainer.classList.add('treasure-links', 'expanded');

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.textContent = 'ChatGPT 强制登出（幽灵账号修复）';
    logoutBtn.style.display = 'block';
    logoutBtn.style.width = '100%';
    logoutBtn.style.textAlign = 'left';
    logoutBtn.style.border = 'none';
    logoutBtn.style.background = 'transparent';
    logoutBtn.style.padding = '6px 20px';
    logoutBtn.style.fontSize = '13px';
    logoutBtn.style.color = '#ff3b30';
    logoutBtn.style.cursor = 'pointer';

    logoutBtn.addEventListener('click', () => {
      const msg =
        '该操作会在新标签页打开 ChatGPT 登出页面：\n' +
        'https://chatgpt.com/auth/logout\n\n' +
        '使用场景：\n' +
        '• bugTeam / workspace 异常导致出现 “幽灵账号” 或登录状态异常\n' +
        '• 正常登出按钮失效、账号卡在无法退出的状态\n\n' +
        '注意：\n' +
        '• 若当前有正在进行的工作，请确认已保存\n' +
        '• 登出后可能需要重新登录，且可能触发风控校验\n\n' +
        '是否继续打开强制登出页面？';
      const first = window.confirm(msg);
      if (!first) return;
      const second = window.confirm('再次确认：现在立即打开强制登出页面？');
      if (!second) return;
      const url = 'https://chatgpt.com/auth/logout';
      try {
        window.open(url, '_blank', 'noopener');
      } catch (e) {
        window.location.href = url;
      }
    });

    linksContainer.appendChild(logoutBtn);

    // 由 TREASURE_LINKS JSON 生成的普通链接（不含强制退出）
    TREASURE_LINKS.forEach((item) => {
      if (!item || !item.url) return;
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = item.label || item.url;
      link.style.display = 'block';
      link.style.padding = '6px 20px';
      link.style.textDecoration = 'none';
      link.style.color = '#007aff';
      link.style.fontSize = '13px';

      link.addEventListener('click', () => {
        hideMenu();
      });

      linksContainer.appendChild(link);
    });

    let linksExpanded = true;
    linksHeader.addEventListener('click', () => {
      linksExpanded = !linksExpanded;
      if (linksExpanded) {
        linksContainer.classList.add('expanded');
        linksArrow.textContent = '▾';
      } else {
        linksContainer.classList.remove('expanded');
        linksArrow.textContent = '▸';
      }
    });

    menu.appendChild(linksHeader);
    menu.appendChild(linksContainer);

    function positionTreasureMenu() {
      const vh =
        window.innerHeight ||
        (document.documentElement && document.documentElement.clientHeight) ||
        0;
      const vw =
        window.innerWidth ||
        (document.documentElement && document.documentElement.clientWidth) ||
        0;
      const btnRect = moreBtn.getBoundingClientRect();

      const maxHeight = Math.round(vh * 0.7);
      menu.style.maxHeight = maxHeight + 'px';

      const rawHeight = menu.scrollHeight || 0;
      const menuHeight = Math.min(rawHeight, maxHeight);

      const spaceBelow = vh - btnRect.bottom - 8;
      const spaceAbove = btnRect.top - 8;

      if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
        const top = Math.min(btnRect.bottom + 8, vh - menuHeight - 8);
        menu.style.top = top + 'px';
        menu.style.bottom = 'auto';
      } else {
        const bottom = Math.min(vh - btnRect.top + 8, vh - menuHeight - 8);
        menu.style.top = 'auto';
        menu.style.bottom = bottom + 'px';
      }

      const right = Math.max(8, vw - btnRect.right - 4);
      menu.style.right = right + 'px';
      menu.style.left = 'auto';
    }

    function showMenu() {
      menu.style.display = 'block';
      menu.style.opacity = '0';
      menu.style.transform = 'scale(0.96)';
      positionTreasureMenu();
      requestAnimationFrame(() => {
        menu.style.opacity = '1';
        menu.style.transform = 'scale(1)';
      });
    }

    function hideMenu() {
      if (menu.style.display !== 'block') return;
      menu.style.opacity = '0';
      menu.style.transform = 'scale(0.96)';
      setTimeout(() => {
        menu.style.display = 'none';
      }, 160);
    }

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = menu.style.display === 'block';
      if (isShown) {
        hideMenu();
      } else {
        showMenu();
      }
    });

    panel.appendChild(header);
    panel.appendChild(listView);
    panel.appendChild(detailView);
    panel.appendChild(batchBar);
    panel.appendChild(menu);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (menu && menu.style.display === 'block') {
        if (!menu.contains(e.target) && e.target !== moreBtn && !moreBtn.contains(e.target)) {
          hideMenu();
        }
      }
      if (e.target === overlay) {
        closeManagerOverlay();
      }
    });

    window.addEventListener('resize', () => {
      if (menu && menu.style.display === 'block') {
        positionTreasureMenu();
      }
    });

    overlayEl = overlay;
    listViewEl = listView;
    detailViewEl = detailView;
    detailContentEl = detailContent;
    debugBtnEl = debugBtn;

    batchBarEl = batchBar;
    batchCountEl = batchCount;
    batchSelectAllBtnEl = btnSelectAll;
    batchExportBtnEl = btnBatchExport;
    batchDeleteBtnEl = btnBatchDelete;
    batchExitBtnEl = btnBatchExit;

    ensureSearchAndBody();
    updateBatchUI();
  }

  function openManagerOverlay() {
    createOverlay();
    renderConversationList();
    if (overlayEl) overlayEl.classList.add('show');
  }

  function closeManagerOverlay() {
    if (overlayEl) overlayEl.classList.remove('show');
  }

  // ---------------------------
  // 10. 搜索 + 列表容器
  // ---------------------------
  function ensureSearchAndBody() {
    if (!listViewEl) return;

    if (!storageInfoEl) {
      const info = document.createElement('div');
      info.style.fontSize = '11px';
      info.style.color = '#888';
      info.style.marginBottom = '4px';
      info.style.lineHeight = '1.4';
      storageInfoEl = info;
      if (listViewEl.firstChild) {
        listViewEl.insertBefore(info, listViewEl.firstChild);
      } else {
        listViewEl.appendChild(info);
      }
    }

    if (!searchWrapperEl) {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.marginBottom = '8px';

      const input = document.createElement('input');
      input.type = 'search';
      input.placeholder = '搜索标题 / URL';
      input.value = searchQuery;
      input.style.flex = '1';
      input.style.fontSize = '13px';
      input.style.padding = '6px 10px';
      input.style.borderRadius = '999px';
      input.style.border = '1px solid rgba(0,0,0,0.12)';
      input.style.outline = 'none';
      input.style.background = '#fff';

      input.addEventListener('input', (e) => {
        searchQuery = e.target.value || '';
        currentPage = 1;
        renderConversationItems();
      });

      wrapper.appendChild(input);
      listViewEl.appendChild(wrapper);

      searchWrapperEl = wrapper;
      searchInputEl = input;
    } else if (searchInputEl) {
      searchInputEl.value = searchQuery;
    }

    if (!listBodyEl) {
      const body = document.createElement('div');
      body.style.marginTop = '4px';
      listBodyEl = body;
      listViewEl.appendChild(body);
    }
  }

  // ---------------------------
  // 11. 批量模式 UI
  // ---------------------------
  function updateBatchUI() {
    if (
      !batchBarEl ||
      !batchCountEl ||
      !batchSelectAllBtnEl ||
      !batchExportBtnEl ||
      !batchDeleteBtnEl ||
      !batchExitBtnEl
    ) {
      return;
    }

    if (batchModeEnabled) {
      batchBarEl.style.display = 'flex';
      const count = batchSelectedIds.size;
      batchCountEl.textContent = `已选 ${count}`;
      const disabled = count === 0;
      [batchExportBtnEl, batchDeleteBtnEl].forEach((btn) => {
        btn.style.opacity = disabled ? '0.4' : '1';
        btn.style.pointerEvents = disabled ? 'none' : 'auto';
      });

      const allConvs = getFilteredSortedConversations();
      const allIds = allConvs.map((c) => c.id);
      const allSelected =
        allIds.length > 0 && allIds.every((id) => batchSelectedIds.has(id));
      batchSelectAllBtnEl.textContent = allSelected ? '全不选' : '全选';
    } else {
      batchBarEl.style.display = 'none';
    }
  }

  function enterBatchMode(initialId) {
    if (!batchModeEnabled) {
      batchModeEnabled = true;
      batchSelectedIds = new Set();
    }
    if (initialId) {
      batchSelectedIds.add(initialId);
    }
    renderConversationItems();
    updateBatchUI();
    showToast('已进入批量模式');
  }

  function exitBatchMode() {
    batchModeEnabled = false;
    batchSelectedIds.clear();
    renderConversationItems();
    updateBatchUI();
  }

  function toggleBatchSelection(id) {
    if (batchSelectedIds.has(id)) {
      batchSelectedIds.delete(id);
    } else {
      batchSelectedIds.add(id);
    }
    renderConversationItems();
    updateBatchUI();
  }

  function handleBatchDelete() {
    if (!batchModeEnabled || batchSelectedIds.size === 0) {
      showToast('请先选择要删除的会话');
      return;
    }
    const ok = window.confirm(
      `确认删除选中的 ${batchSelectedIds.size} 个会话的本地备份？此操作不可恢复。`
    );
    if (!ok) return;
    batchSelectedIds.forEach((id) => {
      deleteConversationById(id);
    });
    batchSelectedIds.clear();
    renderConversationItems();
    updateBatchUI();
    showToast('已删除所选会话');
  }

  function handleSelectAll() {
    if (!batchModeEnabled) return;
    const allConvs = getFilteredSortedConversations();
    const allIds = allConvs.map((c) => c.id);
    const allSelected =
      allIds.length > 0 && allIds.every((id) => batchSelectedIds.has(id));
    if (allSelected) {
      allIds.forEach((id) => batchSelectedIds.delete(id));
    } else {
      allIds.forEach((id) => batchSelectedIds.add(id));
    }
    renderConversationItems();
    updateBatchUI();
  }

  // ---------------------------
  // 12. 搜索 + 排序
  // ---------------------------
  function getFilteredSortedConversations() {
    const map = loadAllConversations();
    const ids = Object.keys(map);
    const sorted = ids
      .map((id) => map[id])
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    if (!searchQuery) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter((conv) => {
      const t = (conv.title || '').toLowerCase();
      const u = (conv.url || '').toLowerCase();
      return t.includes(q) || u.includes(q);
    });
  }

  // ---------------------------
  // 13. 列表渲染 + 文本/Markdown 格式
  // ---------------------------
  function formatTimestamp(ts) {
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}`;
    } catch (e) {
      return '';
    }
  }

  function getConversationCreatedAt(conv) {
    if (!conv.messages || !conv.messages.length) return null;
    let ts = conv.messages[0].timestamp || conv.updatedAt || Date.now();
    conv.messages.forEach((m) => {
      if (m.timestamp && m.timestamp < ts) ts = m.timestamp;
    });
    return ts;
  }

  function buildMediaMap(conv) {
    const map = new Map();
    let counter = 1;
    (conv.messages || []).forEach((m) => {
      const arr = m.media || [];
      arr.forEach((mediaInfo) => {
        const url = mediaInfo && mediaInfo.url;
        if (!url || map.has(url)) return;
        const cleanUrl = url.split(/[?#]/)[0] || '';
        const extMatch = cleanUrl.match(/\.([a-zA-Z0-9]{1,6})$/);
        const ext = extMatch
          ? extMatch[1].toLowerCase()
          : mediaInfo.type === 'image'
          ? 'jpg'
          : 'bin';
        const filename = `media_${counter}.${ext}`;
        map.set(url, {
          url,
          type: mediaInfo.type || 'media',
          filename,
          alt: mediaInfo.alt || '',
        });
        counter++;
      });
    });
    return map;
  }

  function calcConversationSize(conv) {
    if (!conv) return 0;
    try {
      const str = JSON.stringify(conv);
      if (typeof Blob === 'function') {
        return new Blob([str]).size;
      }
      return str.length;
    } catch (e) {
      console.warn('[ChatGPT Backup] calcConversationSize error', e);
      return 0;
    }
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value = value / 1024;
      idx++;
    }
    const fixed = value >= 100 || idx === 0 ? value.toFixed(0) : value.toFixed(1);
    return fixed + ' ' + units[idx];
  }

  function updateStorageUsageUI(totalBytes, convCount) {
    if (!storageInfoEl) return;
    const count = typeof convCount === 'number' ? convCount : 0;
    storageInfoEl.textContent =
      '本地备份：' +
      count +
      ' 个会话，约 ' +
      formatBytes(totalBytes || 0) +
      '。';
  }

  function formatConversationPlainText(conv, mediaMap) {
    const lines = [];
    lines.push(`标题：${(conv.title || '未命名对话').trim()}`);
    lines.push(`URL：${conv.url || ''}`);
    lines.push(`更新时间：${formatTimestamp(conv.updatedAt)}`);
    const createdAt = getConversationCreatedAt(conv);
    if (createdAt) {
      lines.push(`创建时间：${formatTimestamp(createdAt)}`);
    }
    lines.push('');

    (conv.messages || []).forEach((m, idx) => {
      const roleLabel = m.role === 'user' ? '用户' : '助手';
      lines.push(`【${roleLabel} #${idx + 1}】`);
      const body = getMessagePlainText(m);
      if (body) {
        lines.push(body);
      }
      const mediaArr = m.media || [];
      if (mediaArr.length && mediaMap) {
        mediaArr.forEach((mediaInfo) => {
          const entry = mediaMap.get(mediaInfo.url);
          if (entry) {
            lines.push(
              `(媒体: ${entry.type || 'media'} -> media/${entry.filename})`
            );
          } else if (mediaInfo.url) {
            lines.push(
              `(媒体: ${mediaInfo.type || 'media'} -> ${mediaInfo.url})`
            );
          }
        });
      }
      lines.push('');
    });

    return lines.join('\n');
  }

  function formatConversationMarkdown(conv, mediaMap) {
    const lines = [];
    const title = (conv.title || '未命名对话').trim();
    lines.push('# ' + title);

    if (conv.url) {
      lines.push('', `> URL：${conv.url}`);
    }
    lines.push('', `> 更新时间：${formatTimestamp(conv.updatedAt)}`);
    const createdAt = getConversationCreatedAt(conv);
    if (createdAt) {
      lines.push(`> 创建时间：${formatTimestamp(createdAt)}`);
    }
    lines.push('', '---', '');

    (conv.messages || []).forEach((m, idx) => {
      const roleLabel = m.role === 'user' ? '用户' : '助手';
      lines.push(`## ${roleLabel} #${idx + 1}`, '');
      const body = getMessageMarkdown(m);
      if (body) {
        lines.push(body, '');
      }
      const mediaArr = m.media || [];
      if (mediaArr.length && mediaMap) {
        mediaArr.forEach((mediaInfo) => {
          const entry = mediaMap.get(mediaInfo.url);
          if (entry) {
            if (entry.type === 'image') {
              lines.push(
                `![${entry.alt || 'image'}](media/${entry.filename})`
              );
            } else {
              lines.push(
                `[${entry.type || 'media'}](media/${entry.filename})`
              );
            }
          } else if (mediaInfo.url) {
            if (mediaInfo.type === 'image') {
              lines.push(`![image](${mediaInfo.url})`);
            } else {
              lines.push(
                `[${mediaInfo.type || 'media'}](${mediaInfo.url})`
              );
            }
          }
        });
      }
      lines.push('');
    });

    return lines.join('\n');
  }

  function createTextButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.border = '1px solid rgba(0,0,0,0.12)';
    btn.style.borderRadius = '999px';
    btn.style.padding = '4px 10px';
    btn.style.fontSize = '12px';
    btn.style.background = '#fff';
    btn.style.color = '#333';
    btn.style.cursor = 'pointer';
    btn.style.minWidth = '48px';
    btn.style.minHeight = '32px';
    btn.style.touchAction = 'manipulation';
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderConversationList() {
    ensureSearchAndBody();
    renderConversationItems();
  }

  function renderConversationItems() {
    if (!listBodyEl) return;

    listBodyEl.innerHTML = '';

    const map = loadAllConversations();
    const allIds = Object.keys(map);

    let totalBytes = 0;
    const sizeCache = {};
    allIds.forEach((id) => {
      const conv = map[id];
      const size = calcConversationSize(conv);
      sizeCache[id] = size;
      totalBytes += size;
    });
    updateStorageUsageUI(totalBytes, allIds.length);

    const allConvsFiltered = getFilteredSortedConversations();
    const total = allConvsFiltered.length;

    if (!allIds.length) {
      const empty = document.createElement('div');
      empty.textContent = '当前还没有本地备份的会话。';
      empty.style.padding = '6px 8px 10px';
      empty.style.color = '#777';
      empty.style.textAlign = 'center';
      empty.style.fontSize = '13px';
      listBodyEl.appendChild(empty);
      updateBatchUI();
      return;
    }

    if (!total) {
      const empty = document.createElement('div');
      empty.textContent = '没有匹配的会话。';
      empty.style.padding = '6px 8px 10px';
      empty.style.color = '#777';
      empty.style.textAlign = 'center';
      empty.style.fontSize = '13px';
      listBodyEl.appendChild(empty);
      updateBatchUI();
      return;
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageConvs = allConvsFiltered.slice(startIdx, endIdx);

    const LONG_PRESS_MS = 550;

    pageConvs.forEach((conv) => {
      const isSelected = batchSelectedIds.has(conv.id);

      const item = document.createElement('div');
      item.style.borderRadius = '12px';
      item.style.border = '1px solid rgba(0,0,0,0.05)';
      item.style.background = '#fff';
      item.style.padding = '8px 10px 6px';
      item.style.marginBottom = '8px';
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.gap = '4px';
      item.style.position = 'relative';

      const topRow = document.createElement('div');
      topRow.style.display = 'flex';
      topRow.style.alignItems = 'center';
      topRow.style.gap = '8px';

      const selectCircle = document.createElement('div');
      selectCircle.style.width = '18px';
      selectCircle.style.height = '18px';
      selectCircle.style.borderRadius = '999px';
      selectCircle.style.border = '1px solid rgba(0,0,0,0.18)';
      selectCircle.style.display = batchModeEnabled ? 'flex' : 'none';
      selectCircle.style.alignItems = 'center';
      selectCircle.style.justifyContent = 'center';
      selectCircle.style.fontSize = '11px';
      selectCircle.style.flexShrink = '0';

      if (isSelected) {
        selectCircle.style.background = '#111';
        selectCircle.style.color = '#fff';
        selectCircle.textContent = '✓';
      } else {
        selectCircle.style.background = '#fff';
        selectCircle.style.color = 'transparent';
        selectCircle.textContent = '✓';
      }

      const titleRow = document.createElement('div');
      titleRow.style.display = 'flex';
      titleRow.style.justifyContent = 'space-between';
      titleRow.style.alignItems = 'center';
      titleRow.style.gap = '8px';
      titleRow.style.flex = '1';

      const title = document.createElement('div');
      title.textContent =
        conv.title && conv.title.trim()
          ? conv.title.trim()
          : '未命名对话';
      title.style.fontSize = '13px';
      title.style.fontWeight = '500';
      title.style.color = '#222';
      title.style.flex = '1';
      title.style.minWidth = '0';

      const meta = document.createElement('div');
      meta.textContent = formatTimestamp(conv.updatedAt);
      meta.style.fontSize = '11px';
      meta.style.color = '#999';
      meta.style.whiteSpace = 'nowrap';
      meta.style.marginLeft = '6px';

      titleRow.appendChild(title);
      titleRow.appendChild(meta);

      topRow.appendChild(selectCircle);
      topRow.appendChild(titleRow);

      const subRow = document.createElement('div');
      subRow.style.fontSize = '11px';
      subRow.style.color = '#888';
      const mediaCount = buildMediaMap(conv).size;
      const convSizeBytes = sizeCache[conv.id] || calcConversationSize(conv);
      const sizeLabel = formatBytes(convSizeBytes);
      subRow.textContent = `${(conv.messages || []).length} 条消息${
        mediaCount ? ` · ${mediaCount} 个媒体` : ''
      } · 约 ${sizeLabel}`;

      const actions = document.createElement('div');
      actions.style.display = batchModeEnabled ? 'none' : 'flex';
      actions.style.gap = '6px';
      actions.style.marginTop = '4px';
      actions.style.flexWrap = 'wrap';

      if (!batchModeEnabled) {
        const btnView = createTextButton('查看', () => {
          const fullText = formatConversationPlainText(conv, null);
          if (detailContentEl) {
            detailContentEl.textContent = fullText;
          }
          if (listViewEl && detailViewEl) {
            listViewEl.style.display = 'none';
            detailViewEl.style.display = 'block';
          }
        });

        const btnCopy = createTextButton('复制', async () => {
          const fullText = formatConversationPlainText(conv, null);
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(fullText);
              showToast('已复制到剪贴板');
            } else {
              window.prompt('复制下面的内容：', fullText);
            }
          } catch (e) {
            window.prompt('复制失败，请手动复制：', fullText);
          }
        });

        const btnExport = createTextButton('导出', () => {
          exportConversationAsZip(conv).catch((err) => {
            console.error('[ChatGPT Backup] export error', err);
            showToast('导出失败，请查看控制台');
          });
        });

        const btnDelete = createTextButton('删除', () => {
          const ok = window.confirm('确认删除此会话的本地备份？此操作不可恢复。');
          if (!ok) return;
          deleteConversationById(conv.id);
          renderConversationItems();
          showToast('已删除本地备份');
        });

        actions.appendChild(btnView);
        actions.appendChild(btnCopy);
        actions.appendChild(btnExport);
        actions.appendChild(btnDelete);
      }

      item.appendChild(topRow);
      item.appendChild(subRow);
      item.appendChild(actions);

      item.addEventListener('click', (e) => {
        if (!batchModeEnabled) return;
        if (e.target.tagName === 'BUTTON') return;
        toggleBatchSelection(conv.id);
      });

      let pressTimer = null;
      function startPress() {
        if (batchModeEnabled) return;
        if (pressTimer) clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
          pressTimer = null;
          enterBatchMode(conv.id);
        }, LONG_PRESS_MS);
      }
      function cancelPress() {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }

      item.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        startPress();
      });
      item.addEventListener('mouseup', cancelPress);
      item.addEventListener('mouseleave', cancelPress);
      item.addEventListener(
        'touchstart',
        () => {
          startPress();
        },
        { passive: true }
      );
      item.addEventListener('touchend', cancelPress);
      item.addEventListener('touchmove', cancelPress);

      if (batchModeEnabled && isSelected) {
        item.style.borderColor = 'rgba(0,0,0,0.18)';
        item.style.background = '#f4f4f4';
      }

      listBodyEl.appendChild(item);
    });

    const totalPages2 = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const pager = document.createElement('div');
    pager.style.display = totalPages2 > 1 ? 'flex' : 'none';
    pager.style.alignItems = 'center';
    pager.style.justifyContent = 'center';
    pager.style.gap = '10px';
    pager.style.marginTop = '4px';
    pager.style.paddingTop = '4px';
    pager.style.borderTop = '1px solid rgba(0,0,0,0.04)';
    pager.style.fontSize = '12px';
    pager.style.color = '#666';

    function createPagerBtn(label, disabled, handler) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.border = '1px solid rgba(0,0,0,0.12)';
      btn.style.borderRadius = '999px';
      btn.style.padding = '3px 10px';
      btn.style.fontSize = '12px';
      btn.style.background = '#fff';
      btn.style.color = '#333';
      btn.style.minHeight = '28px';
      btn.style.cursor = disabled ? 'default' : 'pointer';
      btn.style.opacity = disabled ? '0.4' : '1';
      if (!disabled) {
        btn.addEventListener('click', handler);
      }
      return btn;
    }

    const prevBtn = createPagerBtn('上一页', currentPage <= 1, () => {
      if (currentPage > 1) {
        currentPage--;
        renderConversationItems();
      }
    });
    const nextBtn = createPagerBtn('下一页', currentPage >= totalPages2, () => {
      if (currentPage < totalPages2) {
        currentPage++;
        renderConversationItems();
      }
    });

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `第 ${currentPage} / ${totalPages2} 页`;

    pager.appendChild(prevBtn);
    pager.appendChild(pageInfo);
    pager.appendChild(nextBtn);

    listBodyEl.appendChild(pager);

    if (listViewEl && detailViewEl) {
      listViewEl.style.display = 'block';
      detailViewEl.style.display = 'none';
    }

    updateBatchUI();
  }

  // ---------------------------
  // 14. 媒体下载 + zip 打包
  // ---------------------------
  function fetchBinary(url) {
    if (hasGMRequest) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'arraybuffer',
          onload: (res) => {
            if (res.status >= 200 && res.status < 300) {
              resolve(res.response);
            } else {
              console.warn(
                '[ChatGPT Backup] GM request failed',
                url,
                res.status
              );
              resolve(null);
            }
          },
          onerror: (err) => {
            console.warn('[ChatGPT Backup] GM request error', url, err);
            resolve(null);
          },
        });
      });
    } else {
      return fetch(url)
        .then((resp) => {
          if (!resp.ok) {
            console.warn(
              '[ChatGPT Backup] fetch failed',
              url,
              resp.status
            );
            return null;
          }
          return resp.arrayBuffer();
        })
        .catch((err) => {
          console.warn('[ChatGPT Backup] fetch error', url, err);
          return null;
        });
    }
  }

  function downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 2000);
  }

  async function buildConversationZipBlob(conv) {
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip 未加载');
    }
    const zip = new JSZip();
    const mediaMap = buildMediaMap(conv);

    const chatText = formatConversationPlainText(conv, mediaMap);
    zip.file('chatlog.txt', chatText);

    const chatMarkdown = formatConversationMarkdown(conv, mediaMap);
    zip.file('chatlog.md', chatMarkdown);

    const info = {
      id: conv.id,
      url: conv.url,
      title: conv.title,
      updatedAt: conv.updatedAt,
      createdAt: getConversationCreatedAt(conv),
      messageCount: (conv.messages || []).length,
      media: Array.from(mediaMap.values()),
      hasMarkdown: !!(conv.messages || []).some((m) => !!(m.markdown || m.html)),
    };
    zip.file('info.json', JSON.stringify(info, null, 2));

    for (const entry of mediaMap.values()) {
      const bin = await fetchBinary(entry.url);
      if (!bin) continue;
      zip.file('media/' + entry.filename, bin);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  }

  async function exportConversationAsZip(conv) {
    try {
      const blob = await buildConversationZipBlob(conv);
      const safeTitle = (conv.title || 'chatgpt_conversation')
        .replace(/[\\\/:*?"<>|]+/g, '_')
        .slice(0, 50);
      const suffix = (conv.id || '').slice(-6);
      const fileName = `${safeTitle || 'conversation'}_${suffix || 'log'}.zip`;
      downloadBlob(blob, fileName);
      showToast('导出完成');
    } catch (e) {
      console.error('[ChatGPT Backup] exportConversationAsZip error', e);
      showToast('导出失败');
    }
  }

  async function exportSelectedConversationsAsZip() {
    if (!batchModeEnabled || batchSelectedIds.size === 0) {
      showToast('请先选择要导出的会话');
      return;
    }
    if (typeof JSZip === 'undefined') {
      showToast('JSZip 未加载，无法导出');
      return;
    }
    const map = loadAllConversations();
    const outerZip = new JSZip();
    let count = 0;

    showToast('正在打包选中的会话…');

    for (const id of batchSelectedIds) {
      const conv = map[id];
      if (!conv) continue;
      try {
        const innerBlob = await buildConversationZipBlob(conv);
        const safeTitle = (conv.title || 'chatgpt_conversation')
          .replace(/[\\\/:*?"<>|]+/g, '_')
          .slice(0, 50);
        const suffix = (conv.id || '').slice(-6);
        const innerName = `${safeTitle || 'conversation'}_${suffix || 'log'}.zip`;
        outerZip.file(innerName, innerBlob);
        count++;
      } catch (e) {
        console.error('[ChatGPT Backup] build inner zip error', e);
      }
    }

    if (count === 0) {
      showToast('没有可导出的会话');
      return;
    }

    const outerBlob = await outerZip.generateAsync({ type: 'blob' });
    const fileName = `chatgpt_conversations_${Date.now()}.zip`;
    downloadBlob(outerBlob, fileName);
    showToast('批量导出完成');
  }

  // ---------------------------
  // 15. 启动
  // ---------------------------
  function start() {
    try {
      initObserver();
    } catch (e) {
      console.warn('[ChatGPT Backup] initObserver error', e);
    }
    try {
      ensureManagerButton();
    } catch (e) {
      console.warn('[ChatGPT Backup] ensureManagerButton error', e);
    }
  }

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    start();
  } else {
    window.addEventListener('DOMContentLoaded', start);
  }
})();
