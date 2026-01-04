// ==UserScript==
// @name         科研通Ablesci 自动每日打卡 + 隐藏广告 + 自动夜间模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动在 ablesci.com 打卡；隐藏常见广告位；夜间自动深色主题（可手动切换并记忆）
// @author       GQLJ
// @match        https://www.ablesci.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://greasyfork.org/
// @supportURL   https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/559234/%E7%A7%91%E7%A0%94%E9%80%9AAblesci%20%E8%87%AA%E5%8A%A8%E6%AF%8F%E6%97%A5%E6%89%93%E5%8D%A1%20%2B%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%20%2B%20%E8%87%AA%E5%8A%A8%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/559234/%E7%A7%91%E7%A0%94%E9%80%9AAblesci%20%E8%87%AA%E5%8A%A8%E6%AF%8F%E6%97%A5%E6%89%93%E5%8D%A1%20%2B%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%20%2B%20%E8%87%AA%E5%8A%A8%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

  (function () {
    'use strict';

    /* ========== 配置 ========== */
    const CONFIG = {
      DEBUG: false,
      STORAGE_PREFIX: 'ablesci_helper_',
      AUTO_DARK_HOURS: { start: 20, end: 6 },
      MAX_WAIT_MS: 15000,
      RETRY_INTERVAL: 500,
      TOAST_DURATION: 3000,
      BUTTON_TEXT_KEYWORDS: ['打卡', '签到', '今日打卡', '今日签到'],
      SUCCESS_KEYWORDS: ['签到成功', '打卡成功', '已签到', '已打卡', '连续签到', '连续打卡'],
    };

    const KEYS = {
      SIGN: CONFIG.STORAGE_PREFIX + 'daily_sign_',
      THEME: CONFIG.STORAGE_PREFIX + 'theme',
      THEME_MANUAL: CONFIG.STORAGE_PREFIX + 'theme_manual',
    };

    /* ========== 工具函数 ========== */
    const log = (...args) => CONFIG.DEBUG && console.log('[Ablesci]', ...args);

    const getTodayKey = () => KEYS.SIGN + new Date().toISOString().slice(0, 10);

    const qsAll = (sel, root = document) => {
      try {
        return Array.from(root.querySelectorAll(sel));
      } catch {
        return [];
      }
    };

    const textMatches = (el) => {
      const txt = (el.innerText || el.textContent || '').trim();
      return txt && CONFIG.BUTTON_TEXT_KEYWORDS.some(kw => txt.includes(kw));
    };

    const isVisible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const inAutoNightRange = (date = new Date()) => {
      const h = date.getHours();
      const { start, end } = CONFIG.AUTO_DARK_HOURS;
      return start < end ? (h >= start && h < end) : (h >= start || h < end);
    };

    /* ========== Toast 提示 ========== */
    const showToast = (msg, type = 'info') => {
      if (!document.body) return;

      const colors = {
        success: { bg: '#4caf50', icon: '✓' },
        error: { bg: '#f44336', icon: '✗' },
        info: { bg: '#2196f3', icon: 'ℹ' },
      };
      const { bg, icon } = colors[type] || colors.info;

      const toast = document.createElement('div');
      toast.className = 'ablesci-toast';
      toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: ${bg}; color: #fff; padding: 12px 24px; border-radius: 8px;
        font-size: 14px; z-index: 999999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex; align-items: center; gap: 8px;
        opacity: 0; transition: opacity 0.3s ease;
      `;
      toast.innerHTML = `<span style="font-size:16px">${icon}</span><span>${msg}</span>`;
      document.body.appendChild(toast);

      requestAnimationFrame(() => { toast.style.opacity = '1'; });

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, CONFIG.TOAST_DURATION);
    };

    /* ========== 自动打卡 ========== */
    const autoSign = () => {
      const todayKey = getTodayKey();

      if (localStorage.getItem(todayKey)) {
        log('今日已打卡（记录在 localStorage）');
        return;
      }

      let signed = false;

      const findCandidateButtons = () => {
        const candidates = new Set();
        const tags = ['button', 'a', 'div', 'span', 'input'];

        tags.forEach(tag => {
          qsAll(tag).forEach(el => {
            if (!isVisible(el)) return;
            if (el.tagName.toLowerCase() === 'input') {
              const ty = (el.getAttribute('type') || '').toLowerCase();
              if (!['button', 'submit'].includes(ty)) return;
            }
            if (textMatches(el)) candidates.add(el);
          });
        });

        qsAll('[title],[aria-label],[alt]').forEach(el => {
          if (!isVisible(el)) return;
          const attr = (el.getAttribute('title') || el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim();
          if (CONFIG.BUTTON_TEXT_KEYWORDS.some(kw => attr.includes(kw))) candidates.add(el);
        });

        return Array.from(candidates);
      };

      const checkSignSuccess = () => {
        return new Promise((resolve) => {
          const startTime = Date.now();
          const maxWait = 5000;

          const checkText = () => {
            const bodyText = document.body.innerText || '';
            if (CONFIG.SUCCESS_KEYWORDS.some(kw => bodyText.includes(kw))) {
              resolve(true);
              return;
            }
            if (Date.now() - startTime > maxWait) {
              resolve(false);
              return;
            }
            setTimeout(checkText, 300);
          };

          const observer = new MutationObserver(() => {
            const bodyText = document.body.innerText || '';
            if (CONFIG.SUCCESS_KEYWORDS.some(kw => bodyText.includes(kw))) {
              observer.disconnect();
              resolve(true);
            }
          });
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });

          setTimeout(() => observer.disconnect(), maxWait);
          checkText();
        });
      };

      const clickAndRecord = async (btn) => {
        if (signed) return;
        signed = true;

        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(r => setTimeout(r, 300));

        log('自动点击打卡按钮：', btn);
        btn.click();

        const success = await checkSignSuccess();

        if (success) {
          localStorage.setItem(todayKey, Date.now().toString());
          log('打卡成功，已记录');
          showToast('自动打卡成功！', 'success');
        } else {
          localStorage.setItem(todayKey, Date.now().toString());
          log('已点击打卡按钮，未检测到明确成功提示');
          showToast('已尝试打卡，请确认是否成功', 'info');
        }
      };

      const waitForButton = () => {
        return new Promise((resolve) => {
          const startTime = Date.now();

          const cands = findCandidateButtons();
          if (cands.length) { resolve(cands[0]); return; }

          const timer = setInterval(() => {
            const cands = findCandidateButtons();
            if (cands.length) { clearInterval(timer); resolve(cands[0]); return; }
            if (Date.now() - startTime > CONFIG.MAX_WAIT_MS) { clearInterval(timer); resolve(null); }
          }, CONFIG.RETRY_INTERVAL);

          const observer = new MutationObserver(() => {
            if (signed) { observer.disconnect(); return; }
            const cands = findCandidateButtons();
            if (cands.length) { clearInterval(timer); observer.disconnect(); resolve(cands[0]); }
          });

          if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
          }

          setTimeout(() => { observer.disconnect(); clearInterval(timer); }, CONFIG.MAX_WAIT_MS + 500);
        });
      };

      waitForButton().then(btn => {
        if (btn && !signed) {
          clickAndRecord(btn);
        } else if (!btn) {
          log('未找到打卡按钮');
        }
      });
    };

    /* ========== 隐藏广告 ========== */
    const hideAds = (() => {
      const AD_SELECTORS = [
        'iframe[src*="googleads"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="googlesyndication"]',
        'ins.adsbygoogle',
        '[id^="google_ads"]',
        '[class*="google-auto-placed"]',
        '.adsbygoogle',
        '[data-ad-slot]',
        '[data-ad-client]',
      ];

      const WHITELIST_PATTERNS = [
        /badge/i, /upload/i, /load/i, /head/i, /bread/i,
        /pad/i, /shadow/i, /grad/i, /add/i, /read/i,
      ];

      const isWhitelisted = (el) => {
        const className = (el.className || '').toString();
        const id = el.id || '';
        return WHITELIST_PATTERNS.some(p => p.test(className) || p.test(id));
      };

      const hideOnce = (root = document) => {
        qsAll(AD_SELECTORS.join(','), root).forEach(el => {
          if (!isWhitelisted(el)) {
            el.style.display = 'none';
            log('隐藏广告元素:', el);
          }
        });

        const EXACT_AD_CLASSES = new Set(['ad', 'ads', 'advert', 'advertisement', 'sponsor', 'sponsored']);
        qsAll('div,section,aside,ins', root).forEach(el => {
          if (isWhitelisted(el)) return;
          const classes = (el.className || '').toString().split(/\s+/);
          if (classes.some(c => EXACT_AD_CLASSES.has(c.toLowerCase()))) {
            el.style.display = 'none';
            log('隐藏广告元素:', el);
          }
        });
      };

      const startObserver = () => {
        hideOnce(document);

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(m => {
            m.addedNodes.forEach(node => {
              if (node.nodeType === 1) hideOnce(node);
            });
          });
        });

        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      };

      return { hideOnce, startObserver };
    })();

    /* ========== 夜间模式 ========== */
    const themeManager = (() => {
      const DARK_CSS = `
        :root[data-ablesci-theme="dark"] {
          --ablesci-bg: #121212;
          --ablesci-bg-soft: #1e1e1e;
          --ablesci-card: #252525;
          --ablesci-text: #e0e0e0;
          --ablesci-text-muted: #a0a0a0;
          --ablesci-link: #64b5f6;
          --ablesci-border: #333;
        }

        :root[data-ablesci-theme="dark"] body {
          background-color: var(--ablesci-bg) !important;
          color: var(--ablesci-text) !important;
        }

        :root[data-ablesci-theme="dark"] header,
        :root[data-ablesci-theme="dark"] nav,
        :root[data-ablesci-theme="dark"] footer,
        :root[data-ablesci-theme="dark"] aside,
        :root[data-ablesci-theme="dark"] main,
        :root[data-ablesci-theme="dark"] article,
        :root[data-ablesci-theme="dark"] section,
        :root[data-ablesci-theme="dark"] .card,
        :root[data-ablesci-theme="dark"] .panel,
        :root[data-ablesci-theme="dark"] .box,
        :root[data-ablesci-theme="dark"] .modal,
        :root[data-ablesci-theme="dark"] .dialog,
        :root[data-ablesci-theme="dark"] .dropdown-menu,
        :root[data-ablesci-theme="dark"] .popover,
        :root[data-ablesci-theme="dark"] .tooltip {
          background-color: var(--ablesci-card) !important;
          color: var(--ablesci-text) !important;
        }

        :root[data-ablesci-theme="dark"] .container,
        :root[data-ablesci-theme="dark"] .content,
        :root[data-ablesci-theme="dark"] .wrapper {
          background-color: var(--ablesci-bg) !important;
        }

        :root[data-ablesci-theme="dark"] a:not([class*="btn"]) {
          color: var(--ablesci-link) !important;
        }

        :root[data-ablesci-theme="dark"] input,
        :root[data-ablesci-theme="dark"] textarea,
        :root[data-ablesci-theme="dark"] select {
          background-color: var(--ablesci-bg-soft) !important;
          color: var(--ablesci-text) !important;
          border-color: var(--ablesci-border) !important;
        }

        :root[data-ablesci-theme="dark"] table {
          color: var(--ablesci-text) !important;
        }

        :root[data-ablesci-theme="dark"] th,
        :root[data-ablesci-theme="dark"] thead {
          background-color: var(--ablesci-bg-soft) !important;
        }

        :root[data-ablesci-theme="dark"] td,
        :root[data-ablesci-theme="dark"] tr {
          border-color: var(--ablesci-border) !important;
        }

        :root[data-ablesci-theme="dark"] hr,
        :root[data-ablesci-theme="dark"] .divider {
          border-color: var(--ablesci-border) !important;
        }

        :root[data-ablesci-theme="dark"] .text-muted,
        :root[data-ablesci-theme="dark"] .muted,
        :root[data-ablesci-theme="dark"] small {
          color: var(--ablesci-text-muted) !important;
        }

        :root[data-ablesci-theme="dark"] pre,
        :root[data-ablesci-theme="dark"] code {
          background-color: var(--ablesci-bg-soft) !important;
          color: var(--ablesci-text) !important;
        }

        :root[data-ablesci-theme="dark"] blockquote {
          background-color: var(--ablesci-bg-soft) !important;
          border-left-color: var(--ablesci-link) !important;
        }

        :root[data-ablesci-theme="dark"] img,
        :root[data-ablesci-theme="dark"] video,
        :root[data-ablesci-theme="dark"] canvas,
        :root[data-ablesci-theme="dark"] svg,
        :root[data-ablesci-theme="dark"] iframe {
          filter: none !important;
        }

        #ablesci-theme-toggle {
          transition: all 0.3s ease;
        }
        #ablesci-theme-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
      `;

      let styleInjected = false;
      let toggleBtn = null;

      const injectStyle = () => {
        if (styleInjected) return;

        const tryInject = () => {
          const target = document.head || document.documentElement;
          if (!target) return false;

          const style = document.createElement('style');
          style.id = 'ablesci-helper-style';
          style.textContent = DARK_CSS;
          target.appendChild(style);
          styleInjected = true;
          log('样式注入成功');
          return true;
        };

        if (!tryInject()) {
          const observer = new MutationObserver(() => {
            if (tryInject()) observer.disconnect();
          });
          observer.observe(document.documentElement, { childList: true });
        }
      };

      const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-ablesci-theme') || 'light';
      };

      const setTheme = (mode, isManual = false) => {
        document.documentElement.setAttribute('data-ablesci-theme', mode);
        localStorage.setItem(KEYS.THEME, mode);
        if (isManual) {
          localStorage.setItem(KEYS.THEME_MANUAL, 'true');
        }
        log('主题切换为:', mode, isManual ? '(手动)' : '(自动)');
        updateToggleLabel();
      };

      const getPreferredTheme = () => {
        const saved = localStorage.getItem(KEYS.THEME);
        const isManual = localStorage.getItem(KEYS.THEME_MANUAL) === 'true';

        if (isManual && (saved === 'dark' || saved === 'light')) {
          return saved;
        }
        return inAutoNightRange() ? 'dark' : 'light';
      };

      const updateToggleLabel = () => {
        if (!toggleBtn) return;
        const isDark = getCurrentTheme() === 'dark';
        toggleBtn.innerHTML = isDark
          ? '<span>🌙</span><span>深色</span>'
          : '<span>☀️</span><span>亮色</span>';
      };

      const createToggleButton = () => {
        if (toggleBtn || document.getElementById('ablesci-theme-toggle')) return;

        const btn = document.createElement('div');
        btn.id = 'ablesci-theme-toggle';
        btn.style.cssText = `
          position: fixed; right: 16px; bottom: 16px; z-index: 999999;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff; padding: 10px 14px; border-radius: 24px;
          font-size: 13px; cursor: pointer; user-select: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex; align-items: center; gap: 6px;
        `;
        btn.title = '点击切换主题 | 快捷键: Alt+D';

        btn.addEventListener('click', () => {
          const current = getCurrentTheme();
          const newTheme = current === 'dark' ? 'light' : 'dark';
          setTheme(newTheme, true);
        });

        toggleBtn = btn;
        updateToggleLabel();
        document.body.appendChild(btn);
        log('切换按钮创建成功');

        // 快捷键 Alt+D
        window.addEventListener('keydown', (e) => {
          if (e.altKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            btn.click();
          }
        });
      };

      const init = () => {
        // 1. 立即注入样式
        injectStyle();

        // 2. 立即设置主题（防止闪烁）
        const theme = getPreferredTheme();
        document.documentElement.setAttribute('data-ablesci-theme', theme);
        localStorage.setItem(KEYS.THEME, theme);
        log('初始主题:', theme);

        // 3. 等待 body 后创建按钮
        const tryCreateButton = () => {
          if (document.body) {
            createToggleButton();
            return true;
          }
          return false;
        };

        if (!tryCreateButton()) {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryCreateButton);
          } else {
            const observer = new MutationObserver(() => {
              if (tryCreateButton()) observer.disconnect();
            });
            observer.observe(document.documentElement, { childList: true });
          }
        }

        // 4. 定时检查自动切换（仅当用户未手动设置时）
        setInterval(() => {
          const isManual = localStorage.getItem(KEYS.THEME_MANUAL) === 'true';
          if (!isManual) {
            const autoTheme = inAutoNightRange() ? 'dark' : 'light';
            if (getCurrentTheme() !== autoTheme) {
              setTheme(autoTheme, false);
            }
          }
        }, 60000);
      };

      return { init, setTheme, getCurrentTheme, getPreferredTheme };
    })();

    /* ========== SPA 路由监听 ========== */
    const watchRouteChange = () => {
      let lastUrl = location.href;

      const onRouteChange = () => {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          log('路由变化，重新检测打卡按钮');
          setTimeout(autoSign, 500);
        }
      };

      window.addEventListener('popstate', onRouteChange);

      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        onRouteChange();
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        onRouteChange();
      };
    };

    /* ========== 启动 ========== */
    const init = () => {
      try {
        log('脚本启动');

        // 1) 立即初始化主题（防止白屏闪烁）
        themeManager.init();

        // 2) DOM 准备好后执行其他功能
        const onReady = () => {
          hideAds.startObserver();
          autoSign();
          watchRouteChange();
          log('脚本初始化完成');
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', onReady);
        } else {
          onReady();
        }

      } catch (err) {
        console.error('[Ablesci] 脚本初始化失败:', err);
      }
    };

    init();
  })();