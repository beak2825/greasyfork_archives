// ==UserScript==
// @name         Apple Music 专辑链接一键复制
// @namespace    https://example.com/userscripts
// @version      1.0.1
// @description  一键复制 Apple Music 当前页面中的专辑链接到剪贴板；兼容 Shadow DOM。
// @author       onlys
// @license      MIT
// @match        https://music.apple.com/*
// @match        https://beta.music.apple.com/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550756/Apple%20Music%20%E4%B8%93%E8%BE%91%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/550756/Apple%20Music%20%E4%B8%93%E8%BE%91%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============ Utils ============
    function notify(message) {
      try {
        if (typeof GM_notification === 'function') {
          GM_notification({ text: message, title: 'Apple Music 链接助手', timeout: 3000 });
        } else {
          console.log('[Apple Music 链接助手]', message);
          alert(message);
        }
      } catch {
        console.log('[Apple Music 链接助手]', message);
      }
    }

    function getAllAnchorsDeep(root = document) {
      const result = new Set();
      const stack = [root];
      const seen = new WeakSet(); // 使用 WeakSet 避免内存泄漏

      while (stack.length) {
        const node = stack.pop();
        if (!node || seen.has(node)) continue;
        seen.add(node);

        try {
          if (node.querySelectorAll) {
            // 直接查找专辑链接，提高效率
            const albumLinks = node.querySelectorAll('a[href*="/album/"]');
            albumLinks.forEach(a => result.add(a));

            // 检查 Shadow DOM
            const shadowHosts = node.querySelectorAll('*');
            for (const el of shadowHosts) {
              if (el.shadowRoot && !seen.has(el.shadowRoot)) {
                stack.push(el.shadowRoot);
              }
            }
          }

          // 处理 Shadow Root
          if (node instanceof ShadowRoot) {
            const albumLinks = node.querySelectorAll('a[href*="/album/"]');
            albumLinks.forEach(a => result.add(a));

            const shadowHosts = node.querySelectorAll('*');
            for (const el of shadowHosts) {
              if (el.shadowRoot && !seen.has(el.shadowRoot)) {
                stack.push(el.shadowRoot);
              }
            }
          }
        } catch (e) {
          console.warn('[Apple Music 链接助手] 遍历节点时出错:', e);
          continue;
        }
      }
      return Array.from(result);
    }

    function extractAlbumIdFromUrl(urlString) {
      if (!urlString || typeof urlString !== 'string') return null;

      try {
        const u = new URL(urlString);
        const parts = u.pathname.split('/').filter(Boolean);
        const albumIdx = parts.indexOf('album');

        if (albumIdx >= 0 && parts.length > albumIdx + 1) {
          // 从后往前查找数字 ID
          for (let i = parts.length - 1; i > albumIdx; i--) {
            const seg = parts[i];
            if (/^\d+$/.test(seg)) return seg;
          }
        }
      } catch (e) {
        console.warn('[Apple Music 链接助手] 提取专辑 ID 失败:', urlString, e);
      }
      return null;
    }

    function isAlbumLink(urlString) {
      if (!urlString || typeof urlString !== 'string') return false;

      try {
        const u = new URL(urlString);
        // 更精确的域名检查
        if (!/^(.*\.)?apple\.com$/.test(u.hostname)) return false;

        const parts = u.pathname.split('/').filter(Boolean);
        const albumIdx = parts.indexOf('album');
        if (albumIdx < 0) return false;

        // 确保在 /album/ 之后有数字 ID
        return parts.slice(albumIdx + 1).some(seg => /^\d+$/.test(seg));
      } catch (e) {
        console.warn('[Apple Music 链接助手] URL 解析失败:', urlString, e);
        return false;
      }
    }

    function getAlbumLinksFromPage() {
      try {
        const anchors = getAllAnchorsDeep(document);
        const idToHref = new Map();

        for (const a of anchors) {
          if (!a || !a.href) continue;

          const href = a.href;
          if (!isAlbumLink(href)) continue;

          const id = extractAlbumIdFromUrl(href);
          if (!id) continue;

          // 按专辑 ID 去重，保留第一个遇到的（通常是最短的）
          if (!idToHref.has(id)) {
            // 清理 URL 参数
            try {
              const cleanUrl = new URL(href);
              cleanUrl.search = ''; // 移除查询参数
              idToHref.set(id, cleanUrl.toString());
            } catch {
              idToHref.set(id, href);
            }
          }
        }

        const result = Array.from(idToHref.values());
        console.log(`[Apple Music 链接助手] 检测到 ${result.length} 个专辑链接`);
        return result;
      } catch (e) {
        console.error('[Apple Music 链接助手] 获取链接失败:', e);
        return [];
      }
    }

    async function copyToClipboard(links) {
      const text = links.join(' ');
      if (!text) {
        notify('未找到任何专辑链接，请确认页面内容已加载。');
        return false;
      }

      // Try GM_setClipboard first
      try {
        if (typeof GM_setClipboard === 'function') {
          GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
          notify(`已复制 ${links.length} 条专辑链接到剪贴板`);
          return true;
        }
      } catch (e) {
        console.warn('GM_setClipboard failed:', e);
      }

      // Fallback: try native clipboard API
      try {
        await navigator.clipboard.writeText(text);
        notify(`已复制 ${links.length} 条专辑链接到剪贴板`);
        return true;
      } catch (e) {
        console.warn('navigator.clipboard failed:', e);
      }

      // Final fallback: show text in prompt for manual copy
      try {
        const shortText = text.length > 200 ? text.substring(0, 200) + '...' : text;
        prompt('复制失败，请手动复制以下内容：', text);
        notify('请手动复制弹窗中的内容');
        return true;
      } catch (e) {
        notify('复制失败，请检查浏览器权限设置');
        return false;
      }
    }

    function sleep(ms) {
      return new Promise(res => setTimeout(res, ms));
    }

    // 检测是否为专辑/音乐相关页面
    function isRelevantPage() {
      try {
        const path = window.location.pathname.toLowerCase();
        const relevantPaths = ['/room/', '/album/', '/playlist/', '/artist/', '/station/', '/browse/'];

        // 检查 URL 路径
        if (relevantPaths.some(p => path.includes(p))) return true;

        // 检查页面内容
        const indicators = [
          '[data-testid*="album"]',
          '[data-testid*="playlist"]',
          '.album',
          '.playlist',
          'a[href*="/album/"]'
        ];

        return indicators.some(selector => {
          try {
            return document.querySelector(selector) !== null;
          } catch {
            return false;
          }
        });
      } catch (e) {
        console.warn('[Apple Music 链接助手] 页面检测失败:', e);
        return true; // 错误时默认显示
      }
    }

    // 智能等待页面内容加载
    async function waitForContent(timeout = 5000) {
      const start = Date.now();
      let attempts = 0;
      const maxAttempts = Math.floor(timeout / 200);

      while (Date.now() - start < timeout && attempts < maxAttempts) {
        attempts++;

        try {
          const links = getAlbumLinksFromPage();
          if (links.length > 0) {
            console.log(`[Apple Music 链接助手] 内容加载完成，共 ${attempts} 次尝试`);
            return true;
          }

          // 检查加载指示器
          const loadingSelectors = [
            '[data-testid*="loading"]',
            '.loading',
            '.spinner',
            '[role="progressbar"]',
            '.progress'
          ];

          const hasLoading = loadingSelectors.some(selector => {
            try {
              return document.querySelector(selector) !== null;
            } catch {
              return false;
            }
          });

          if (!hasLoading && attempts > 5) {
            // 没有加载指示器且已经尝试多次，可能已经加载完成
            await sleep(500);
            break;
          }
        } catch (e) {
          console.warn('[Apple Music 链接助手] 等待内容时出错:', e);
        }

        await sleep(200);
      }

      console.log(`[Apple Music 链接助手] 等待结束，共尝试 ${attempts} 次`);
      return false;
    }


    // ============ Actions ============
    async function actionCopyCurrent() {
      // 先等待内容加载
      await waitForContent();
      const links = getAlbumLinksFromPage();
      const success = await copyToClipboard(links);
      if (success) {
        console.log('[Apple Music 链接助手] 采集到专辑链接：', links);
      }
    }


    // ============ UI ============
    function addMenuCommands() {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('复制专辑链接', actionCopyCurrent);
      }
    }

    function addFloatingButton() {
      const btnId = '__am_links_helper_btn__';
      if (document.getElementById(btnId)) return;

      GM_addStyle(`
        #${btnId} {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 999999;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Helvetica, Arial, sans-serif;
        }
        #${btnId} .am-btn {
          background: #111827;
          color: #fff;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
          transition: all 0.2s ease;
        }
        #${btnId} .am-btn:hover {
          background: #1f2937;
          transform: translateY(-1px);
        }
        #${btnId} .am-panel {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 8px;
          background: #111827;
          color: #e5e7eb;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 8px;
          display: none;
          min-width: 220px;
          box-shadow: 0 8px 25px rgba(0,0,0,.3);
        }
        #${btnId} .am-panel.show {
          display: block;
        }
        #${btnId} .am-panel button {
          width: 100%;
          margin: 4px 0;
          background: #1f2937;
          color: #e5e7eb;
          border: 1px solid #374151;
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s ease;
        }
        #${btnId} .am-panel button:hover {
          background: #374151;
        }
        #${btnId} .am-panel button:disabled {
          background: #0f172a;
          color: #6b7280;
          cursor: not-allowed;
        }
        #${btnId} .am-small {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 6px;
        }
        #${btnId} .am-count {
          display: inline-block;
          background: #dc2626;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          margin-left: 4px;
          min-width: 16px;
          text-align: center;
        }
      `);

      const container = document.createElement('div');
      container.id = btnId;
      container.innerHTML = `
        <button class="am-btn" type="button">专辑链接<span class="am-count" style="display:none;">0</span></button>
        <div class="am-panel">
          <button type="button" data-action="copy">复制专辑链接</button>
          <div class="am-small">链接以空格分隔，方便批量使用</div>
        </div>
      `;
      document.documentElement.appendChild(container);

      const toggleBtn = container.querySelector('.am-btn');
      const panel = container.querySelector('.am-panel');
      const countBadge = container.querySelector('.am-count');

      // 简化的面板切换逻辑
      toggleBtn.addEventListener('click', () => {
        const isVisible = panel.classList.contains('show');
        panel.classList.toggle('show', !isVisible);

        // 更新计数显示
        if (!isVisible) {
          updateLinkCount();
        }
      });

      // 点击外部关闭面板
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          panel.classList.remove('show');
        }
      });

      // 更新链接计数的函数
      function updateLinkCount() {
        try {
          const links = getAlbumLinksFromPage();
          const count = links.length;

          if (countBadge) {
            countBadge.textContent = count;
            countBadge.style.display = count > 0 ? 'inline-block' : 'none';
          }

          // 禁用按钮如果没有链接
          const buttons = panel.querySelectorAll('button[data-action]');
          buttons.forEach(btn => {
            if (btn) {
              btn.disabled = count === 0;
              btn.title = count === 0 ? '当前页面没有检测到专辑链接' : `共检测到 ${count} 个专辑链接`;
            }
          });

          return count;
        } catch (e) {
          console.error('[Apple Music 链接助手] 更新计数失败:', e);
          return 0;
        }
      }

      panel.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn || btn.disabled) return;

        // 关闭面板
        panel.classList.remove('show');

        const action = btn.getAttribute('data-action');
        if (action === 'copy') {
          await actionCopyCurrent();
        }
      });

      // 初始更新计数
      setTimeout(updateLinkCount, 1000);
    }

    // 防抖函数
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    function init() {
      try {
        if (!isRelevantPage()) {
          console.log('[Apple Music 链接助手] 当前页面非音乐相关页面，跳过初始化');
          return false;
        }

        addMenuCommands();
        addFloatingButton();

        console.log('[Apple Music 链接助手] 初始化完成');
        return true;
      } catch (e) {
        console.error('[Apple Music 链接助手] 初始化失败:', e);
        return false;
      }
    }

    // 页面为 SPA，路由切换后重新初始化，使用防抖优化性能
    const debouncedInit = debounce(() => {
      try {
        if (isRelevantPage()) {
          addFloatingButton();
        }
      } catch (e) {
        console.error('[Apple Music 链接助手] 防抖初始化失败:', e);
      }
    }, 500);

    // 监听路由变化（针对 SPA）
    let currentUrl = window.location.href;
    const checkUrlChange = () => {
      try {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
          console.log('[Apple Music 链接助手] 路由变化:', currentUrl, '->', newUrl);
          currentUrl = newUrl;
          debouncedInit();
        }
      } catch (e) {
        console.error('[Apple Music 链接助手] 检查 URL 变化失败:', e);
      }
    };

    // 使用更精确的观察器
    let mutationObserver = null;
    try {
      mutationObserver = new MutationObserver((mutations) => {
        try {
          // 只在有实际 DOM 变化时触发
          const hasSignificantChange = mutations.some(mutation =>
            mutation.type === 'childList' &&
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
          );

          if (hasSignificantChange) {
            checkUrlChange();
          }
        } catch (e) {
          console.error('[Apple Music 链接助手] MutationObserver 处理失败:', e);
        }
      });

      // 只监听主要内容区域的变化
      const observeTarget = document.querySelector('#app') ||
                           document.querySelector('main') ||
                           document.querySelector('[role="main"]') ||
                           document.body;

      if (observeTarget) {
        mutationObserver.observe(observeTarget, {
          childList: true,
          subtree: true,
          attributes: false, // 不监听属性变化
          characterData: false // 不监听文本变化
        });
        console.log('[Apple Music 链接助手] MutationObserver 初始化成功');
      } else {
        console.warn('[Apple Music 链接助手] 未找到合适的监听目标');
      }
    } catch (e) {
      console.error('[Apple Music 链接助手] MutationObserver 初始化失败:', e);
    }

    // 监听 pushState/popState 事件（SPA 路由变化）
    try {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function(...args) {
        try {
          originalPushState.apply(history, args);
          debouncedInit();
        } catch (e) {
          console.error('[Apple Music 链接助手] pushState 处理失败:', e);
          originalPushState.apply(history, args);
        }
      };

      history.replaceState = function(...args) {
        try {
          originalReplaceState.apply(history, args);
          debouncedInit();
        } catch (e) {
          console.error('[Apple Music 链接助手] replaceState 处理失败:', e);
          originalReplaceState.apply(history, args);
        }
      };

      window.addEventListener('popstate', debouncedInit);
      console.log('[Apple Music 链接助手] 路由监听初始化成功');
    } catch (e) {
      console.error('[Apple Music 链接助手] 路由监听初始化失败:', e);
    }

    // 初始化
    console.log('[Apple Music 链接助手] 开始初始化...');
    init();

    // 清理函数（在页面卸载时调用）
    window.addEventListener('beforeunload', () => {
      try {
        if (mutationObserver) {
          mutationObserver.disconnect();
        }
        console.log('[Apple Music 链接助手] 清理完成');
      } catch (e) {
        console.error('[Apple Music 链接助手] 清理失败:', e);
      }
    });
  })();