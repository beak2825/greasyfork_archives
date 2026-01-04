// ==UserScript==
// @name         チャットAI用ダイナミック目次 (LINE風UI)
// @name:en      Dynamic TOC for Chat AI (LINE-style UI)
// @namespace    https://github.com/kamijyojapan/llm-dynamic-toc
// @version      3.1.1
// @description  ChatGPT, Claude, Geminiの会話に、LINEのようなUIの目次を追加します。ユーザーは右寄せ（緑）、AIは左寄せ（白）で表示。ドラッグ移動、最小化、閉じる機能、現在地のハイライト機能を搭載。
// @description:en Adds a dynamic, LINE-style table of contents to your ChatGPT, Claude, and Gemini conversations. User prompts are right-aligned (green), and AI responses are left-aligned (white). Features include dragging, minimizing, closing, and current-position highlighting.
// @author       kamijyojapan
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bS0xLjA5LTEzLjA4TDE0LjUgMTEuNSAxbC0zLjA0IDQuMDQtMS41MS0yLjYgNC4xNC0yLjE4eiIvPjwvc3ZnPg==
// @grant        none
// @run-at       document-idle
// @homepageURL  https://github.com/yourname/llm-dynamic-toc  // TODO: 'yourname' をご自身のGitHubユーザー名などに変更してください
// @supportURL   https://github.com/yourname/llm-dynamic-toc/issues // TODO: 'yourname' をご自身のGitHubユーザー名などに変更してください
// @downloadURL https://update.greasyfork.org/scripts/550521/%E3%83%81%E3%83%A3%E3%83%83%E3%83%88AI%E7%94%A8%E3%83%80%E3%82%A4%E3%83%8A%E3%83%9F%E3%83%83%E3%82%AF%E7%9B%AE%E6%AC%A1%20%28LINE%E9%A2%A8UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550521/%E3%83%81%E3%83%A3%E3%83%83%E3%83%88AI%E7%94%A8%E3%83%80%E3%82%A4%E3%83%8A%E3%83%9F%E3%83%83%E3%82%AF%E7%9B%AE%E6%AC%A1%20%28LINE%E9%A2%A8UI%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // --- 初期化ガード ---
  // スクリプトの二重実行を防止
  if (window.__LLM_TOC_INIT__) return;
  window.__LLM_TOC_INIT__ = true;

  // --- 定数・設定 ---
  const TITLE_MAX = 32; // 目次項目の最大文字数
  const MIN_CHARS_FOR_TITLE = 6; // 目次項目として認識される最小文字数
  const REBUILD_DEBOUNCE_MS = 800; // DOM変更後の目次再構築までの待機時間 (ms)
  const DEFAULT_POS = { top: '80px', right: '16px', left: 'auto', bottom: 'auto' }; // 初回表示時の位置
  const DEBUG = false; // デバッグログを有効にする場合はtrue

  // --- ロギング関数 ---
  const log = (...args) => DEBUG && console.log('[LLM TOC]', ...args);
  const warn = (...args) => console.warn('[LLM TOC]', ...args);
  const error = (...args) => console.error('[LLM TOC]', ...args);

  // --- サイトごとの定義 ---
  // 各LLMサイトの仕様に合わせて、メッセージ要素のセレクタや情報取得方法を定義
  const SITES = [
    {
      name: 'chatgpt',
      test: () => /chat\.openai\.com|chatgpt\.com/.test(location.hostname),
      messageSelector: [
        'main [data-message-id]',
        'main .group.w-full[data-testid*="conversation-turn"]',
        'main .group.w-full:not([data-message-id])',
        '[data-testid="conversation-turn"]'
      ],
      getText: (el) => {
        const candidates = [
          el.querySelector('.markdown'),
          el.querySelector('.prose'),
          el.querySelector('[data-message-author-role]'),
          el.querySelector('.whitespace-pre-wrap'),
          el
        ];
        for (const candidate of candidates) {
          if (candidate?.innerText?.trim()) {
            return candidate.innerText.trim();
          }
        }
        return '';
      },
      getRole: (el) => {
        const role = el.getAttribute?.('data-message-author-role') ||
                     el.querySelector('[data-message-author-role]')?.getAttribute('data-message-author-role');
        return role || 'assistant';
      },
    },
    {
      name: 'claude',
      test: () => /claude\.ai/.test(location.hostname),
      messageSelector: [
        '[data-testid="user-message"]',
        '.font-claude-response:has(.standard-markdown p.whitespace-normal)',
        '[class*="claude-response"]:has(.standard-markdown p.whitespace-normal)'
      ],
      getText: (el) => {
        if (el.matches('[data-testid="user-message"]')) {
          const p = el.querySelector('p.whitespace-pre-wrap');
          return p?.innerText?.trim() || '';
        }
        const assistantText = el.querySelector('.standard-markdown p.whitespace-normal');
        return assistantText?.innerText?.trim() || '';
      },
      getRole: (el) => {
        if (el.getAttribute('data-testid') === 'user-message') return 'user';
        return 'assistant';
      },
    },
    {
      name: 'gemini',
      test: () => /gemini\.google\.com/.test(location.hostname),
      messageSelector: [
        'user-query, model-response'
      ],
      getText: (el) => {
        const tag = el.tagName?.toLowerCase();
        if (tag === 'user-query') {
          const queryText = el.querySelector('.query-text');
          if (queryText) return queryText.innerText.trim();
        }
        if (tag === 'model-response') {
          const markdown = el.querySelector('.markdown');
          if (markdown) return markdown.innerText.trim();
        }
        return (el.innerText || '').trim();
      },
      getRole: (el) => {
        const tag = el.tagName?.toLowerCase();
        if (tag === 'user-query') return 'user';
        if (tag === 'model-response') return 'assistant';
        return el.classList.contains('user-query') ? 'user' : 'assistant';
      },
    },
  ];

  const site = SITES.find((s) => s.test());
  if (!site) return; // 対応サイトでなければ以降の処理を中断

  // --- ユーティリティ関数 ---

  /**
   * 指定時間内に連続で呼び出された場合、最後の呼び出しのみ実行する（デバウンス）
   * @param {Function} fn 実行する関数
   * @param {number} ms 遅延時間 (ミリ秒)
   * @returns {Function} デバウンス化された関数
   */
  const debounce = (fn, ms = 250) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  };

  /**
   * 2つのDOM要素の表示順（古→新）を比較する
   * @param {Node} a 比較対象の要素1
   * @param {Node} b 比較対象の要素2
   * @returns {number} aがbより前なら-1, 後なら1, 同じなら0
   */
  const compareByDomOrder = (a, b) => {
    if (a === b) return 0;
    const pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    try {
      const ra = document.createRange(); ra.selectNode(a);
      const rb = document.createRange(); rb.selectNode(b);
      return ra.compareBoundaryPoints(Range.START_TO_START, rb);
    } catch {
      return 0;
    }
  };

  /**
   * 複数のCSSセレクタで要素を安全に検索し、DOM順にソートして返す
   * @param {string|string[]} selectors CSSセレクタ（単一または配列）
   * @returns {Element[]} 見つかった要素の配列
   */
  const safeQuerySelectorAll = (selectors) => {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    let allFoundElements = [];

    for (const selector of selectorArray) {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          allFoundElements.push(...elements);
        }
      } catch (e) {
        warn('Invalid selector:', selector, e.message);
      }
    }

    // 重複を排除し、DOMの表示順（古→新）にソート
    const uniqueElements = [...new Set(allFoundElements)];
    const sortedElements = uniqueElements.sort(compareByDomOrder);

    // 不要な要素（ボタン、メニューなど）やテキストが短すぎる要素を除外
    const validElements = sortedElements.filter(el => {
      const text = el.innerText?.trim() || '';
      const hasValidText = text.length >= MIN_CHARS_FOR_TITLE;
      const isNotButton = !el.matches('button, [role="button"]');
      const testid = el.getAttribute('data-testid') || '';
      const isNotMenu = !testid.includes('menu') && !testid.includes('trigger');
      return hasValidText && isNotButton && isNotMenu;
    });

    log(`Found ${validElements.length} valid elements from all selectors.`);
    return validElements;
  };

  // --- UIの構築 ---
  /**
   * 目次UIのDOM要素を生成し、ページに追加する
   * @returns {object} UI要素のコレクション
   */
  const createTOC = () => {
    const host = document.createElement('div');
    host.style.cssText = `
      position: fixed;
      inset: 0 auto auto 0;
      z-index: 2147483646;
      pointer-events: none;
    `;
    const shadow = host.attachShadow({ mode: 'open' });
    document.documentElement.appendChild(host);

    const style = document.createElement('style');
    style.textContent = `
      :host {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        pointer-events: none;
      }
      .wrap {
        position: fixed;
        width: 320px;
        max-height: 70vh;
        backdrop-filter: saturate(1.5) blur(6px);
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        overflow: hidden;
        background: color-mix(in oklab, white 92%, transparent);
        display: flex;
        flex-direction: column;
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: auto;
      }
      .hdr {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        font-weight: 700;
        border-bottom: 1px solid rgba(0,0,0,0.06);
        background: rgba(255,255,255,0.8);
        cursor: move;
        user-select: none;
      }
      .hdr-title { flex-grow: 1; font-size: 14px; }
      .controls { display: flex; gap: 4px; }
      .btn {
        all: unset;
        width: 20px; height: 20px;
        text-align: center; line-height: 20px;
        background: rgba(0,0,0,0.08);
        border-radius: 5px; cursor: pointer;
        font-weight: bold; font-size: 12px;
        transition: background 0.2s;
      }
      .btn:hover { background: rgba(0,0,0,0.2); }
      .body {
        max-height: calc(70vh - 44px);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
      ul {
        list-style: none; margin: 0; padding: 10px;
        display: flex;
        flex-direction: column; /* 最新が下（古→新） */
        gap: 12px;
      }
      li { display: flex; flex-direction: column; max-width: 100%; }
      .align-left { align-items: flex-start; }
      .align-right { align-items: flex-end; }
      .label {
        font-size: 11px; margin-bottom: 4px;
        opacity: .68; font-weight: 500;
      }
      .item {
        display: inline-block; max-width: 88%;
        font-size: 13px; padding: 8px 12px;
        border-radius: 18px; word-break: break-word;
        text-align: left; color: #111;
        box-shadow: 0 1px 0 rgba(0,0,0,0.04);
        text-decoration: none; cursor: pointer;
        transition: filter 0.2s;
      }
      .role-user { background: #e9f7e9; border: 1px solid #d5edd5; }
      .role-assistant { background: #ffffff; border: 1px solid #e6e6e6; }
      .role-system { background: #f3f4f6; border: 1px solid #e5e7eb; font-style: italic; }
      .item.active { outline: 2px solid rgba(52, 152, 219, 0.4); outline-offset: 2px; }
      .item:hover { filter: brightness(0.96); }
      .restore-btn {
        all: unset; display: none;
        position: fixed; right: 16px; bottom: 16px;
        width: 48px; height: 48px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(8px);
        border-radius: 50%;
        text-align: center; font-size: 24px; line-height: 48px;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        user-select: none; transition: all 0.2s;
        pointer-events: auto; z-index: 2147483647;
      }
      .restore-btn:hover { transform: scale(1.1); background: rgba(255,255,255,1); }
      :host(.is-minimized) .wrap { display: none; }
      :host(.is-minimized) .restore-btn { display: block; }
      .empty-state {
        padding: 20px; text-align: center; color: #666;
        font-style: italic; font-size: 14px; line-height: 1.4;
      }
      .success-indicator {
        position: absolute; top: -4px; right: -4px;
        width: 12px; height: 12px;
        background: #22c55e; border-radius: 50%;
        border: 2px solid white;
      }
    `;
    const wrap = document.createElement('div');
    const hdr = document.createElement('div');
    const title = document.createElement('div');
    const controls = document.createElement('div');
    const minBtn = document.createElement('button');
    const closeBtn = document.createElement('button');
    const body = document.createElement('div');
    const ul = document.createElement('ul');
    const restoreBtn = document.createElement('div');

    wrap.className = 'wrap';
    hdr.className = 'hdr';
    title.className = 'hdr-title';
    title.textContent = '🧭 目次';
    controls.className = 'controls';
    minBtn.className = 'btn';
    minBtn.textContent = '–';
    minBtn.title = '最小化';
    closeBtn.className = 'btn';
    closeBtn.textContent = '×';
    closeBtn.title = '閉じる';
    body.className = 'body';
    restoreBtn.className = 'restore-btn';
    restoreBtn.textContent = '🧭';
    restoreBtn.title = '目次を再表示';

    controls.append(minBtn, closeBtn);
    hdr.append(title, controls);
    body.append(ul);
    wrap.append(hdr, body);
    shadow.append(style, wrap, restoreBtn);

    return { host, shadow, wrap, hdr, body, ul, minBtn, closeBtn, restoreBtn, title };
  };

  const ui = createTOC();

  // --- 状態管理 (位置・最小化状態の保存/復元) ---
  const loadState = () => {
    try {
      const savedPos = JSON.parse(localStorage.getItem('llmTocPosition'));
      Object.assign(ui.wrap.style, savedPos || DEFAULT_POS);
      if (localStorage.getItem('llmTocMinimized') === 'true') {
        ui.host.classList.add('is-minimized');
      }
    } catch (e) {
      warn('Failed to load state:', e.message);
      Object.assign(ui.wrap.style, DEFAULT_POS);
    }
  };

  const savePosition = () => {
    try {
      const { top, left } = ui.wrap.style;
      localStorage.setItem('llmTocPosition', JSON.stringify({ top, left }));
    } catch (e) {
      warn('Failed to save position:', e.message);
    }
  };

  // --- ドラッグ移動機能 ---
  const setupDragging = () => {
    let dragging = false;
    let offset = { x: 0, y: 0 };
    ui.hdr.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('btn')) return;
      dragging = true;
      const rect = ui.wrap.getBoundingClientRect();
      offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      ui.hdr.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const newLeft = e.clientX - offset.x;
      const newTop = e.clientY - offset.y;
      const maxLeft = window.innerWidth - ui.wrap.offsetWidth;
      const maxTop = window.innerHeight - ui.wrap.offsetHeight;
      ui.wrap.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
      ui.wrap.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
      ui.wrap.style.right = 'auto';
      ui.wrap.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      ui.hdr.style.cursor = 'move';
      savePosition();
    });
  };

  // --- UIコントロール (最小化・閉じるボタン) ---
  const setupControls = () => {
    ui.minBtn.addEventListener('click', () => {
      ui.host.classList.add('is-minimized');
      localStorage.setItem('llmTocMinimized', 'true');
    });
    ui.restoreBtn.addEventListener('click', () => {
      ui.host.classList.remove('is-minimized');
      localStorage.setItem('llmTocMinimized', 'false');
    });
    ui.closeBtn.addEventListener('click', () => {
      ui.host.style.display = 'none';
    });
  };

  // --- 目次生成ロジック ---

  /**
   * ページからメッセージ要素を収集し、目次データを作成する
   * @returns {object[]} 目次項目の配列
   */
  const buildItems = () => {
    const rawElements = safeQuerySelectorAll(site.messageSelector);
    log(`Building items for ${site.name}, found ${rawElements.length} raw elements`);
    if (rawElements.length === 0) {
      warn('No valid message elements found');
      return [];
    }
    const items = [];
    let serial = 0;
    for (const el of rawElements) {
      try {
        if (!el.id) {
          el.id = `toc-anchor-${++serial}-${Date.now().toString(36)}`;
        }
        const text = site.getText(el) || '';
        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (cleanText.length < MIN_CHARS_FOR_TITLE) continue;

        const head = cleanText.slice(0, TITLE_MAX).trim();
        const display = head || `応答 #${items.length + 1}`;
        const role = site.getRole(el) || 'assistant';
        items.push({ id: el.id, display, role, el });
        log(`Added item ${items.length}:`, { display, role });
      } catch (e) {
        error('Error processing element:', e.message);
      }
    }
    // 念のため、最終的な配列もDOM順にソートする
    items.sort((a, b) => compareByDomOrder(a.el, b.el));

    log(`Built ${items.length} items successfully`);
    return items;
  };

  /**
   * 目次データに基づいてリストのHTMLを描画する
   * @param {object[]} items 目次項目の配列
   */
  const drawList = (items) => {
    if (items.length === 0) {
      ui.ul.innerHTML = `
        <div class="empty-state">
          チャットメッセージを探しています...<br>
          <small>メッセージを送信すると表示されます</small>
        </div>
      `;
      return;
    }

    // Claude対応が成功したことを示すインジケータ
    if (items.length > 0 && site.name === 'claude') {
        if (!ui.title.querySelector('.success-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'success-indicator';
            indicator.title = 'Claude.ai 対応完了';
            ui.title.style.position = 'relative';
            ui.title.appendChild(indicator);
        }
    }

    const fragment = document.createDocumentFragment();
    items.forEach(({ id, display, role }) => {
      const li = document.createElement('li');
      li.className = role === 'user' ? 'align-right' : 'align-left';
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = role === 'user' ? 'User' : role === 'system' ? 'System' : 'Assistant';
      const item = document.createElement('div');
      item.className = `item role-${role}`;
      item.textContent = display;
      item.addEventListener('click', () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          warn('Target element not found:', id);
        }
      });
      li.append(label, item);
      fragment.appendChild(li);
    });
    ui.ul.replaceChildren(fragment);

    // 最新の項目（リストの末尾）が見えるようにスクロール
    requestAnimationFrame(() => {
      ui.body.scrollTop = ui.body.scrollHeight;
    });
  };

  let intersectionObserver;
  /**
   * IntersectionObserverを使い、現在画面に表示されているメッセージに対応する目次項目をハイライトする
   * @param {object[]} items 目次項目の配列
   */
  const observeHighlight = (items) => {
    intersectionObserver?.disconnect();
    if (items.length === 0) return;

    intersectionObserver = new IntersectionObserver((entries) => {
      const visibleIds = new Set(
        entries.filter(e => e.isIntersecting).map(e => e.target.id)
      );
      ui.ul.querySelectorAll('.item').forEach((item, index) => {
        const isActive = visibleIds.has(items[index]?.id);
        item.classList.toggle('active', isActive);
      });
    }, {
      rootMargin: '0px 0px -80% 0px', // 画面上部20%の位置で判定
      threshold: 0.01
    });

    items.forEach(({ el }) => {
      if (el && el.isConnected) {
        intersectionObserver.observe(el);
      }
    });
  };

  /** 目次を再構築するメイン関数（デバウンス適用） */
  const rebuild = debounce(() => {
    try {
      log(`Rebuilding TOC for ${site.name}...`);
      const items = buildItems();
      drawList(items);
      observeHighlight(items);
      log(`TOC rebuilt with ${items.length} items`);
    } catch (e) {
      error('Error rebuilding TOC:', e.message);
    }
  }, REBUILD_DEBOUNCE_MS);

  // --- 初期化処理 ---
  const init = () => {
    try {
      log(`Initializing LLM TOC for site: ${site.name}`);
      loadState();
      setupDragging();
      setupControls();

      // DOMの変更を監視して目次を自動更新
      const observer = new MutationObserver(rebuild);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // ウィンドウリサイズ時にも再構築
      window.addEventListener('resize', rebuild);

      // 初回実行
      const delay = site.name === 'claude' ? 2000 : 1000; // サイトの描画タイミングを考慮
      setTimeout(rebuild, delay);

      log('LLM TOC initialized successfully');
    } catch (e) {
      error('Failed to initialize LLM TOC:', e.message);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();