// ==UserScript==
// @name         Watermark Remover Suite
// @namespace    https://blog.wayneshao.com/
// @version      1.7
// @description  通用低风险去水印、站点专用处理（含 ZSXQ & 自动学习站点规则）；高风险按钮支持两级策略：第一次点击使用“智能识别水印图片+全屏遮罩”有限清理并自动学习规则，若仍未去除，第二次点击则启用全量暴力清理。支持配置持久化与高优先级 CSS 直杀水印。
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552024/Watermark%20Remover%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/552024/Watermark%20Remover%20Suite.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '[Watermark Remover]';

  /* ========== 全局配置 ========== */
  const BUTTON_ID = 'wm-remover-sweep-btn';
  const BASE_STYLE_ID = 'wm-remover-base-style';
  const ZSXQ_STYLE_ID = 'wm-remover-zsxq-style';
  const GLOBAL_AGGRESSIVE_STYLE_ID = 'wm-remover-aggressive-style';
  const HARD_KILL_STYLE_ID = 'wm-remover-hard-kill-style';
  const SITE_RULES_STYLE_ID = 'wm-remover-site-rules-style';
  const BUTTON_STORAGE_KEY = 'wm-remover-button-pos-v1';
  const SITE_RULES_KEY = 'wm-remover-site-rules-v1';

  // 图像水印识别参数
  const MAX_SAMPLE_SIZE = 512;       // 图像降采样最大边
  const WATERMARK_SCORE_THRESHOLD = 0.6; // >= 这个分数认为是水印图

  const isZsxqDomain = /(^|\.)zsxq\.com$/i.test(window.location.hostname);

  /* ========== 站点规则存储结构 ========== */
  // allConfigs: { [hostname]: { domain: string, rules: Array<{selector:string, props:string[], note?:string}> } }

  function loadAllSiteConfigs() {
    try {
      if (typeof GM_getValue === 'function') {
        return GM_getValue(SITE_RULES_KEY) || {};
      } else if (window.localStorage) {
        const raw = localStorage.getItem(SITE_RULES_KEY);
        return raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      console.debug(`${LOG_PREFIX} 读取站点规则失败:`, e);
    }
    return {};
  }

  function saveAllSiteConfigs(all) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(SITE_RULES_KEY, all);
      } else if (window.localStorage) {
        localStorage.setItem(SITE_RULES_KEY, JSON.stringify(all));
      }
    } catch (e) {
      console.debug(`${LOG_PREFIX} 保存站点规则失败:`, e);
    }
  }

  function loadSiteConfig(host) {
    const all = loadAllSiteConfigs();
    if (!all[host]) all[host] = { domain: host, rules: [] };
    return all[host];
  }

  function saveSiteConfig(host, cfg) {
    const all = loadAllSiteConfigs();
    all[host] = cfg;
    saveAllSiteConfigs(all);
  }

  function cssEscape(s) {
    return String(s).replace(/([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }

  function cssFromRule(rule) {
    const sel = rule.selector;
    const selWithStyle = `${sel}[style]`;
    const lines = (rule.props || []).map(
      (p) => `  ${p}: none !important;`
    ).join('\n');

    return `
${selWithStyle},
${sel} {
${lines}
}
${sel}::before,
${sel}::after {
  background: none !important;
  background-image: none !important;
  mask-image: none !important;
  -webkit-mask-image: none !important;
}
`;
  }

  function injectCssForSiteRules(host) {
    const cfg = loadSiteConfig(host);
    if (!cfg.rules || !cfg.rules.length) return;

    let style = document.getElementById(SITE_RULES_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = SITE_RULES_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    let cssText = '';
    cfg.rules.forEach((rule) => {
      cssText += cssFromRule(rule);
    });
    style.textContent = cssText;

    console.info(`${LOG_PREFIX} 已注入站点专用规则`, host, cfg.rules);
  }

  /* ========== 全局状态 ========== */
  let sweepButton = null;
  let suppressClick = false;

  let isHighRiskSweeping = false;
  let aggressiveTimer = null;

  const dragState = {
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
  };

  let buttonPos = loadButtonPosition();

  const lowRiskObserver = new MutationObserver(handleLowRiskMutations);

  const specialHandlers = [
    {
      name: 'zsxq',
      test: () => isZsxqDomain,
      init: setupZsxqHandler,
    },
  ];

  // 高风险遍历中使用的状态
  const processedCountMap = new WeakMap();
  const HARD_KILL_THRESHOLD = 5;
  let overlayCandidates = new Set();

  // 本次页面中，用户点击高风险按钮的次数（1 = 智能模式，>=2 = 纯暴力）
  let highRiskClickCount = 0;

  /* ========== document-start 初始化：先注入站点规则 CSS ========== */

  injectCssForSiteRules(location.hostname);

  /* ========== ready 后初始化 ========== */
  whenReady(() => {
    injectBaseCss();
    injectHardKillCss();
    injectGlobalAggressiveCss();
    setupRestoreDetection();
    ensureSweepButton();
    startLowRiskLogic();
    runSpecialHandlers();
  });

  /* ========== 通用低风险逻辑 ========== */
  function startLowRiskLogic() {
    lowRiskSweep(document);

    const startObserver = () => {
      if (!document.body) return false;
      lowRiskObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'watermark', 'data-watermark', 'data-testid'],
      });
      return true;
    };

    if (!startObserver()) {
      const watcher = new MutationObserver(() => {
        if (startObserver()) watcher.disconnect();
      });
      watcher.observe(document.documentElement, { childList: true });
    }
  }

  function handleLowRiskMutations(mutations) {
    if (isHighRiskSweeping) return;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => lowRiskSweep(node));
      } else if (mutation.type === 'attributes') {
        lowRiskProcessElement(mutation.target);
      }
    }
  }

  function lowRiskSweep(root) {
    if (!root) return;
    const startNode = root instanceof Document ? root.documentElement : root;
    walkDom(startNode, lowRiskProcessElement);
  }

  function isWatermarkLike(el) {
    if (!(el instanceof Element)) return false;
    if (
      el.hasAttribute('watermark') ||
      el.hasAttribute('data-watermark') ||
      (el.classList && [...el.classList].some((cls) => /watermark/i.test(cls)))
    ) {
      return true;
    }
    const testId = el.getAttribute('data-testid');
    if (testId && /watermark/i.test(testId)) return true;
    return false;
  }

  function lowRiskProcessElement(el) {
    if (!(el instanceof Element) || shouldSkipButton(el)) return;

    const inlineStyle = el.getAttribute('style');
    if (inlineStyle && /nullbackground/i.test(inlineStyle)) {
      el.setAttribute('style', inlineStyle.replace(/nullbackground/gi, 'background'));
    }

    const backgroundImage = el.style.getPropertyValue('background-image');
    if (backgroundImage && /url\(\s*data:image/i.test(backgroundImage)) {
      el.style.setProperty('background-image', 'none', 'important');
    }

    const background = el.style.getPropertyValue('background');
    if (background && /url\(\s*data:image/i.test(background)) {
      el.style.setProperty(
        'background',
        background.replace(/url\([^)]*\)/gi, 'none').trim(),
        'important'
      );
    }

    const maskImage =
      el.style.getPropertyValue('mask-image') ||
      el.style.getPropertyValue('-webkit-mask-image');
    if (maskImage && /url\(\s*data:image/i.test(maskImage)) {
      el.style.setProperty('mask-image', 'none', 'important');
      el.style.setProperty('-webkit-mask-image', 'none', 'important');
    }

    if (isWatermarkLike(el)) {
      el.style.setProperty('background', 'none', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('mask-image', 'none', 'important');
      el.style.setProperty('-webkit-mask-image', 'none', 'important');
    }
  }

  /* ========== 站点专用逻辑（目前仅 ZSXQ） ========== */
  function runSpecialHandlers() {
    for (const handler of specialHandlers) {
      try {
        if (handler.test()) {
          handler.init();
        }
      } catch (err) {
        console.warn(`${LOG_PREFIX} 站点专用逻辑 ${handler.name} 初始化失败`, err);
      }
    }
  }

  function setupZsxqHandler() {
    injectZsxqCss();

    const state = {
      observer: null,
      observedRoots: new WeakSet(),
      interactionTimer: null,
    };

    const ensureObserver = () => {
      if (state.observer) return;
      state.observer = new MutationObserver((mutations) => {
        if (isHighRiskSweeping) return;

        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => processNode(node));
          } else if (mutation.type === 'attributes') {
            const target = mutation.target;
            if (target instanceof Element && shouldClearZsxqElement(target)) {
              requestAnimationFrame(() => clearZsxqWatermark(target));
            }
          }
        }
      });
      state.observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'watermark', 'data-watermark', 'class', 'data-testid'],
      });
    };

    const attachBodyObserver = () => {
      if (!document.body || state.observedRoots.has(document.body)) return false;
      state.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });
      state.observedRoots.add(document.body);
      return true;
    };

    const processNode = (node) => {
      if (node instanceof Element) {
        if (node.shadowRoot) {
          observeShadowRoot(node.shadowRoot);
          scanZsxqElements(node.shadowRoot);
        }
        requestAnimationFrame(() => scanZsxqElements(node));
      } else if (node instanceof ShadowRoot || node instanceof DocumentFragment) {
        observeShadowRoot(node);
        requestAnimationFrame(() => scanZsxqElements(node));
      }
    };

    const observeShadowRoot = (root) => {
      if (!state.observer || state.observedRoots.has(root)) return;
      try {
        state.observer.observe(root, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class', 'watermark', 'data-watermark', 'data-testid'],
        });
        state.observedRoots.add(root);
      } catch (err) {
        console.debug(`${LOG_PREFIX} 无法监听 ShadowRoot:`, err);
      }
    };

    const scanZsxqElements = (root) => {
      const startNode = root instanceof Document ? root.documentElement : root;
      if (!startNode) return;
      walkDom(startNode, (el) => {
        if (shouldClearZsxqElement(el)) {
          clearZsxqWatermark(el);
        }
      });
    };

    const scheduleRescanAfterInteraction = () => {
      if (state.interactionTimer) clearTimeout(state.interactionTimer);
      state.interactionTimer = setTimeout(() => {
        state.interactionTimer = null;
        if (document.body) scanZsxqElements(document.body);
      }, 250);
    };

    const shouldClearZsxqElement = (el) => {
      if (!(el instanceof Element) || shouldSkipButton(el)) return false;

      if (
        el.hasAttribute('watermark') ||
        el.hasAttribute('data-watermark') ||
        (el.classList && [...el.classList].some((cls) => /watermark/i.test(cls)))
      ) {
        return true;
      }

      const testId = el.getAttribute('data-testid');
      if (testId && /watermark/i.test(testId)) return true;

      const inline = el.getAttribute('style');
      if (
        inline &&
        (/(?:background|background-image)\s*:\s*url\(\s*data:image/i.test(inline) ||
          /(?:mask|mask-image|webkit-mask-image)\s*:\s*url\(\s*data:image/i.test(inline))
      ) {
        return true;
      }

      const computed = safeComputedStyle(el);
      if (computed) {
        const bg = computed.backgroundImage;
        if (bg && bg.includes('data:image')) return true;

        const mask = computed.maskImage || computed.webkitMaskImage;
        if (mask && mask.includes('data:image')) return true;
      }

      return false;
    };

    const clearZsxqWatermark = (el) => {
      if (!(el instanceof Element) || shouldSkipButton(el)) return;

      const inlineStyle = el.getAttribute('style');
      if (inlineStyle && /nullbackground/i.test(inlineStyle)) {
        el.setAttribute('style', inlineStyle.replace(/nullbackground/gi, 'background'));
      }

      const inlineBgImage = el.style.getPropertyValue('background-image');
      if (inlineBgImage && inlineBgImage !== 'none' && inlineBgImage.includes('url(')) {
        el.style.setProperty('background-image', 'none', 'important');
      }

      const inlineBg = el.style.getPropertyValue('background');
      if (inlineBg && inlineBg.includes('url(')) {
        el.style.setProperty(
          'background',
          inlineBg.replace(/url\([^)]*\)/gi, 'none').trim(),
          'important'
        );
      }

      const inlineMask =
        el.style.getPropertyValue('mask-image') ||
        el.style.getPropertyValue('-webkit-mask-image');
      if (inlineMask && inlineMask.includes('url(')) {
        el.style.setProperty('mask-image', 'none', 'important');
        el.style.setProperty('-webkit-mask-image', 'none', 'important');
      }

      const computed = safeComputedStyle(el);
      if (computed) {
        const computedBg = computed.backgroundImage;
        if (computedBg && computedBg !== 'none' && computedBg.includes('url(')) {
          el.style.setProperty('background-image', 'none', 'important');
        }
        const computedMask = computed.maskImage || computed.webkitMaskImage;
        if (computedMask && computedMask !== 'none' && computedMask.includes('url(')) {
          el.style.setProperty('mask-image', 'none', 'important');
          el.style.setProperty('-webkit-mask-image', 'none', 'important');
        }
      }
    };

    ensureObserver();

    whenBody(() => {
      attachBodyObserver();
      scanZsxqElements(document.body);
    });

    document.addEventListener('click', scheduleRescanAfterInteraction, true);
    document.addEventListener('keydown', scheduleRescanAfterInteraction, true);
    setInterval(() => {
      if (document.body) scanZsxqElements(document.body);
    }, 3000);
  }

  function injectZsxqCss() {
    if (document.getElementById(ZSXQ_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = ZSXQ_STYLE_ID;
    style.textContent = `
      [watermark],
      [data-watermark],
      [class*="watermark" i],
      [data-testid*="watermark" i] {
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
      [watermark]::before,
      [watermark]::after,
      [data-watermark]::before,
      [data-watermark]::after,
      [class*="watermark" i]::before,
      [class*="watermark" i]::after {
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  /* ========== “全屏水印层 + 图像特征”识别 ========== */

  function isGlobalOverlayWatermark(el, computed) {
    if (!(el instanceof Element)) return false;
    if (!computed) computed = safeComputedStyle(el);
    if (!computed) return false;

    const pos = computed.position;
    if (pos !== 'fixed' && pos !== 'absolute') return false;

    const fullScreen =
      (computed.top === '0px' || computed.top === '0') &&
      (computed.left === '0px' || computed.left === '0') &&
      (
        computed.bottom === '0px' ||
        computed.bottom === '0' ||
        computed.height === '100vh' ||
        computed.height === '100%' ||
        computed.height === 'auto'
      ) &&
      (
        computed.right === '0px' ||
        computed.right === '0' ||
        computed.width === '100vw' ||
        computed.width === '100%' ||
        computed.width === 'auto'
      );

    if (!fullScreen) return false;

    const z = parseInt(computed.zIndex, 10);
    if (isNaN(z) || z < 1000) return false;

    const bgImg = computed.backgroundImage;
    const bg = computed.background;
    const hasImg =
      (bgImg && bgImg !== 'none') ||
      (bg && /url\(/i.test(bg));

    if (!hasImg) return false;

    const pe = computed.pointerEvents;
    if (pe && pe !== 'none') return false;

    const tag = el.tagName;
    if (tag === 'HTML' || tag === 'BODY') return false;

    return true;
  }

  // 图像分析：计算水印评分
  function computeWatermarkScore(img) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return { score: 0, stats: null };

    const scale = Math.min(1, MAX_SAMPLE_SIZE / Math.max(w, h));
    const sw = Math.max(1, Math.floor(w * scale));
    const sh = Math.max(1, Math.floor(h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, sw, sh);

    const data = ctx.getImageData(0, 0, sw, sh).data;
    const totalPixels = sw * sh;

    let transparentCount = 0;
    let brightCount = 0;
    let darkCount = 0;
    let sumGray = 0;
    let sumGraySq = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      sumGray += gray;
      sumGraySq += gray * gray;

      if (a < 80) {
        transparentCount++;
      }

      if (gray > 220) brightCount++;
      else if (gray < 40) darkCount++;
    }

    const transparentRatio = transparentCount / totalPixels;
    const brightRatio = brightCount / totalPixels;
    const darkRatio = darkCount / totalPixels;

    const meanGray = sumGray / totalPixels;
    const varGray = sumGraySq / totalPixels - meanGray * meanGray;
    const contrast = Math.sqrt(Math.max(varGray, 0));

    let score = 0;
    if (transparentRatio > 0.5) score += 0.4;
    if (brightRatio > 0.3) score += 0.2;
    if (darkRatio < 0.1) score += 0.1;
    if (contrast < 60) score += 0.2;
    if (meanGray > 160) score += 0.1;

    return {
      score,
      stats: {
        transparentRatio,
        brightRatio,
        darkRatio,
        meanGray,
        contrast,
        width: w,
        height: h,
        sampleWidth: sw,
        sampleHeight: sh,
      },
    };
  }

  function analyzeImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      // 尝试跨域，失败了也只是拿不到像素
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const res = computeWatermarkScore(img);
          resolve({ url, ...res });
        } catch (e) {
          resolve({ url, score: 0, stats: null, error: e });
        }
      };
      img.onerror = () => resolve({ url, score: 0, stats: null, error: 'load-fail' });
      img.src = url;
    });
  }

  /* ========== 自动学习站点规则 ========== */

  function markElementProcessed(el) {
    if (!(el instanceof Element)) return;
    const prev = processedCountMap.get(el) || 0;
    const next = prev + 1;
    processedCountMap.set(el, next);

    if (next === HARD_KILL_THRESHOLD) {
      console.warn(
        `${LOG_PREFIX} 发现疑似持续自愈的水印元素，执行强制隐藏/移除：`,
        describeNode(el)
      );
      hardKillElement(el);
    }
  }

  function hardKillElement(el) {
    if (!(el instanceof Element)) return;
    try {
      el.classList.add('wm-remover-hard-kill');
    } catch (_) {}

    try {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('background', 'none', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('mask-image', 'none', 'important');
      el.style.setProperty('-webkit-mask-image', 'none', 'important');
    } catch (_) {}

    try {
      if (el.parentNode) el.parentNode.removeChild(el);
      else if (typeof el.remove === 'function') el.remove();
    } catch (_) {}
  }

  function learnOverlayRulesFromCandidates(candidates) {
    const host = location.hostname;
    if (!candidates || !candidates.size) return;

    const cfg = loadSiteConfig(host);
    let added = 0;

    candidates.forEach((el) => {
      const rule = buildRuleFromElement(el);
      if (!rule) return;
      if (!cfg.rules.some((r) => r.selector === rule.selector)) {
        cfg.rules.push(rule);
        injectCssForRuleImmediate(rule);
        added++;
        console.info(`${LOG_PREFIX} 为站点 ${host} 新增自动识别规则:`, rule);
      }
    });

    if (added) {
      saveSiteConfig(host, cfg);
      console.info(`${LOG_PREFIX} 已保存 ${added} 条站点规则到存储`);
    }
  }

  function buildRuleFromElement(el) {
    if (!(el instanceof Element)) return null;

    let selector = null;
    if (el.classList && el.classList.length) {
      const cls = [...el.classList][0];
      selector = `html body .${cssEscape(cls)}`;
    } else if (el.id) {
      selector = `html body #${cssEscape(el.id)}`;
    } else {
      return null;
    }

    return {
      selector,
      props: [
        'background',
        'background-image',
        'mask-image',
        '-webkit-mask-image',
      ],
      note: 'auto-learned overlay watermark',
    };
  }

  function injectCssForRuleImmediate(rule) {
    let style = document.getElementById(SITE_RULES_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = SITE_RULES_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent += cssFromRule(rule);
  }

  /* ========== 高风险清理：两级策略 ========== */
  // 第一次点击：smartHighRiskSweep（有限清理 + 图像特征筛选 + 学习规则）
  // 第二次及以后：bruteHighRiskSweep（无差别暴力）

  async function smartHighRiskSweep(root) {
    if (isHighRiskSweeping) return 0;
    isHighRiskSweeping = true;
    overlayCandidates = new Set();

    let processed = 0;
    const overlayImageTasks = []; // {el, url, computed, taskPromise}

    try {
      walkDom(root, (el) => {
        if (!(el instanceof Element) || shouldSkipButton(el)) return;

        const computed = safeComputedStyle(el);
        if (!computed) return;

        const bgImg = computed.backgroundImage;
        const bg = computed.background;
        let url = null;

        if (bgImg && bgImg !== 'none') {
          const m = /url\(["']?(.+?)["']?\)/.exec(bgImg);
          if (m) url = m[1];
        } else if (bg && /url\(/i.test(bg)) {
          const m2 = /url\(["']?(.+?)["']?\)/.exec(bg);
          if (m2) url = m2[1];
        }

        const isOverlay = isGlobalOverlayWatermark(el, computed);

        if (url && isOverlay) {
          // 暂不立即清理，先做内容特征分析
          overlayImageTasks.push({ el, url, computed });
        } else {
          // 普通元素，使用原来的“去背景”逻辑（较宽松）
          let changed = false;

          if (bgImg && bgImg !== 'none') {
            el.style.setProperty('background-image', 'none', 'important');
            changed = true;
          }
          if (bg && bg.includes('url(')) {
            el.style.setProperty(
              'background',
              bg.replace(/url\([^)]*\)/gi, 'none').trim(),
              'important'
            );
            changed = true;
          }

          const inlineMask =
            el.style.getPropertyValue('mask-image') ||
            el.style.getPropertyValue('-webkit-mask-image');
          if (inlineMask && inlineMask !== 'none') {
            el.style.setProperty('mask-image', 'none', 'important');
            el.style.setProperty('-webkit-mask-image', 'none', 'important');
            changed = true;
          }

          if (changed) {
            processed++;
            markElementProcessed(el);
          }
        }
      });

      // 对 overlayImageTasks 做图像分析，仅对评分高的进行清理 + 学习
      for (const { el, url, computed } of overlayImageTasks) {
        try {
          const { score, stats } = await analyzeImage(url);
          console.log(
            `${LOG_PREFIX} 分析背景图`, url, 'score=', score.toFixed(2), stats
          );
          if (score >= WATERMARK_SCORE_THRESHOLD) {
            el.style.setProperty('background', 'none', 'important');
            el.style.setProperty('background-image', 'none', 'important');
            processed++;
            markElementProcessed(el);
            overlayCandidates.add(el);
          } else {
            // 认为不是水印，暂时保留
          }
        } catch (e) {
          console.debug(`${LOG_PREFIX} 分析图片失败`, url, e);
        }
      }

    } finally {
      isHighRiskSweeping = false;
    }

    if (overlayCandidates.size > 0) {
      learnOverlayRulesFromCandidates(overlayCandidates);
    }

    return processed;
  }

  function bruteHighRiskSweep(root) {
    if (isHighRiskSweeping) return 0;
    isHighRiskSweeping = true;

    let processed = 0;
    try {
      walkDom(root, (el) => {
        if (!(el instanceof Element) || shouldSkipButton(el)) return;

        const computed = safeComputedStyle(el);
        let changed = false;

        if (computed) {
          const bg = computed.backgroundImage;
          if (bg && bg !== 'none') {
            el.style.setProperty('background-image', 'none', 'important');
            changed = true;
          }
          const mask = computed.maskImage || computed.webkitMaskImage;
          if (mask && mask !== 'none') {
            el.style.setProperty('mask-image', 'none', 'important');
            el.style.setProperty('-webkit-mask-image', 'none', 'important');
            changed = true;
          }
        }

        const inlineBg = el.style.getPropertyValue('background');
        if (inlineBg && inlineBg.includes('url(')) {
          el.style.setProperty(
            'background',
            inlineBg.replace(/url\([^)]*\)/gi, 'none').trim(),
            'important'
          );
          changed = true;
        }

        const inlineBgImage = el.style.getPropertyValue('background-image');
        if (inlineBgImage && inlineBgImage !== 'none') {
          el.style.setProperty('background-image', 'none', 'important');
          changed = true;
        }

        const inlineMask =
          el.style.getPropertyValue('mask-image') ||
          el.style.getPropertyValue('-webkit-mask-image');
        if (inlineMask && inlineMask !== 'none') {
          el.style.setProperty('mask-image', 'none', 'important');
          el.style.setProperty('-webkit-mask-image', 'none', 'important');
          changed = true;
        }

        if (changed) {
          processed++;
          markElementProcessed(el);
        }
      });
    } finally {
      isHighRiskSweeping = false;
    }
    return processed;
  }

  function enableAggressiveLoop(interval = 2000) {
    if (aggressiveTimer) return;
    aggressiveTimer = setInterval(() => {
      const root = document.body || document.documentElement;
      if (!root) return;
      const count = bruteHighRiskSweep(root);
      if (count > 0) {
        console.debug(`${LOG_PREFIX} 周期高风险清理：本次处理 ${count} 个元素`);
      }
    }, interval);
  }

  /* ========== 悬浮按钮：两级策略触发 ========== */
  function ensureSweepButton() {
    if (sweepButton) return;

    sweepButton = document.createElement('button');
    sweepButton.id = BUTTON_ID;
    sweepButton.type = 'button';
    sweepButton.textContent = '暴力去水印';
    sweepButton.title = '第一次点击使用智能识别（水印图片+全屏遮罩）有限清理并自动学习站点规则；若仍有残留，再点击则启用全面暴力清理。';

    applyButtonPlacement(buttonPos);

    sweepButton.addEventListener('pointerdown', onPointerDown);
    sweepButton.addEventListener('pointermove', onPointerMove);
    sweepButton.addEventListener('pointerup', onPointerUp);
    sweepButton.addEventListener('pointercancel', onPointerCancel);

    sweepButton.addEventListener('click', async (event) => {
      if (suppressClick) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      highRiskClickCount += 1;
      const root = document.body || document.documentElement;
      const start = performance.now();

      if (highRiskClickCount === 1) {
        // 第一次：智能模式
        const count = await smartHighRiskSweep(root);
        const duration = (performance.now() - start).toFixed(1);
        console.info(
          `${LOG_PREFIX} 智能高风险清理：处理了 ${count} 个元素，用时 ${duration}ms（再次点击将触发全面暴力模式）`
        );
      } else {
        // 第二次及之后：纯暴力模式
        const count = bruteHighRiskSweep(root);
        const duration = (performance.now() - start).toFixed(1);
        console.info(
          `${LOG_PREFIX} 全量暴力清理：处理了 ${count} 个元素，用时 ${duration}ms`
        );
        enableAggressiveLoop(2000);
      }
    });

    whenBody(() => {
      document.body.appendChild(sweepButton);
    });
  }

  function onPointerDown(event) {
    if (!sweepButton) return;
    dragState.active = true;
    dragState.moved = false;
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    try {
      sweepButton.setPointerCapture(event.pointerId);
    } catch (_) {}
  }

  function onPointerMove(event) {
    if (!dragState.active || !sweepButton || event.pointerId !== dragState.pointerId) return;

    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;

    if (!dragState.moved) {
      if (Math.hypot(dx, dy) > 4) {
        dragState.moved = true;
        sweepButton.classList.add('dragging');
      } else {
        return;
      }
    }

    event.preventDefault();

    const side = event.clientX >= window.innerWidth / 2 ? 'right' : 'left';
    applyButtonSide(side);

    const topRatio = clamp(event.clientY / window.innerHeight, 0.05, 0.95);
    applyButtonTop(topRatio);

    buttonPos = { side, top: topRatio };
  }

  function onPointerUp(event) {
    if (!dragState.active || !sweepButton || event.pointerId !== dragState.pointerId) return;
    try {
      sweepButton.releasePointerCapture(event.pointerId);
    } catch (_) {}

    if (dragState.moved) {
      event.preventDefault();
      saveButtonPosition(buttonPos);
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 0);
    }

    sweepButton.classList.remove('dragging');
    dragState.active = false;
    dragState.moved = false;
    dragState.pointerId = null;
  }

  function onPointerCancel(event) {
    if (!dragState.active || !sweepButton || event.pointerId !== dragState.pointerId) return;
    try {
      sweepButton.releasePointerCapture(event.pointerId);
    } catch (_) {}
    sweepButton.classList.remove('dragging');
    dragState.active = false;
    dragState.moved = false;
    dragState.pointerId = null;
  }

  function applyButtonPlacement(pos) {
    applyButtonSide(pos.side);
    applyButtonTop(pos.top);
  }

  function applyButtonSide(side) {
    if (!sweepButton) return;
    if (side === 'right') {
      sweepButton.classList.add('side-right');
      sweepButton.classList.remove('side-left');
      sweepButton.style.left = 'auto';
      sweepButton.style.right = '0';
    } else {
      sweepButton.classList.add('side-left');
      sweepButton.classList.remove('side-right');
      sweepButton.style.left = '0';
      sweepButton.style.right = 'auto';
    }
    buttonPos.side = side === 'right' ? 'right' : 'left';
  }

  function applyButtonTop(topRatio) {
    if (!sweepButton) return;
    const clamped = clamp(topRatio, 0.05, 0.95);
    sweepButton.style.top = (clamped * 100).toFixed(2) + 'vh';
    buttonPos.top = clamped;
  }

  function injectBaseCss() {
    if (document.getElementById(BASE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BASE_STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        position: fixed;
        top: 50%;
        left: 0;
        transform: translate(-88%, -50%);
        padding: 11px 24px;
        border: none;
        border-radius: 0 18px 18px 0;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #ffffff;
        background: linear-gradient(135deg, #1d5fd7 0%, #0f3eb7 50%, #0d2a8e 100%);
        box-shadow: 0 16px 32px rgba(9, 40, 90, 0.45);
        text-shadow: 0 2px 3px rgba(0, 0, 0, 0.35);
        cursor: grab;
        z-index: 2147483646;
        opacity: 0.96;
        transition: transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        touch-action: none;
        user-select: none;
      }
      #${BUTTON_ID}.side-right {
        left: auto;
        right: 0;
        border-radius: 18px 0 0 18px;
        transform: translate(88%, -50%);
      }
      #${BUTTON_ID}.side-left:hover,
      #${BUTTON_ID}.side-left:focus-visible,
      #${BUTTON_ID}.side-left.dragging,
      #${BUTTON_ID}.side-right:hover,
      #${BUTTON_ID}.side-right:focus-visible,
      #${BUTTON_ID}.side-right.dragging {
        transform: translate(0, -50%);
        opacity: 1;
        box-shadow: 0 20px 36px rgba(9, 40, 90, 0.55);
      }
      #${BUTTON_ID}:active {
        background: linear-gradient(135deg, #184fc0 0%, #0c3296 100%);
        box-shadow: 0 12px 28px rgba(9, 40, 90, 0.5);
        cursor: grabbing;
      }
      #${BUTTON_ID}.dragging {
        transition: none;
      }
      #${BUTTON_ID}:focus,
      #${BUTTON_ID}:focus-visible {
        outline: none;
      }
      #${BUTTON_ID}::after {
        content: '⟲';
        margin-left: 10px;
        font-size: 14px;
        text-shadow: inherit;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function injectHardKillCss() {
    if (document.getElementById(HARD_KILL_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = HARD_KILL_STYLE_ID;
    style.textContent = `
      .wm-remover-hard-kill {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        background: none !important;
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function injectGlobalAggressiveCss() {
    if (document.getElementById(GLOBAL_AGGRESSIVE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = GLOBAL_AGGRESSIVE_STYLE_ID;
    style.textContent = `
      [watermark],
      [data-watermark],
      [class*="watermark" i],
      [data-testid*="watermark" i] {
        background: none !important;
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
      [watermark]::before,
      [watermark]::after,
      [data-watermark]::before,
      [data-watermark]::after,
      [class*="watermark" i]::before,
      [class*="watermark" i]::after {
        background: none !important;
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  /* ========== “还原行为”检测逻辑（原有 1.6 保留） ========== */
  function setupRestoreDetection() {
    try {
      patchMutationObserver();
      patchSetAttribute();
      setupWatermarkMutationLogger();
      setupInteractionCorrelator();
    } catch (e) {
      console.debug(`${LOG_PREFIX} 还原检测逻辑初始化失败:`, e);
    }
  }

  function patchMutationObserver() {
    if (!window.MutationObserver) return;
    const NativeMO = window.MutationObserver;

    window.MutationObserver = function WrappedMutationObserver(callback) {
      const wrappedCallback = function (mutations, observer) {
        if (mutations && mutations.length) {
          for (const m of mutations) {
            if (mutationHasWatermark(m)) {
              console.log(
                `${LOG_PREFIX} 检测到 MutationObserver 回调中涉及 "watermark" 相关节点:`,
                {
                  type: m.type,
                  target: describeNode(m.target),
                }
              );
              break;
            }
          }
        }
        return callback(mutations, observer);
      };

      console.log(
        `${LOG_PREFIX} 页面创建 MutationObserver 实例，可能用于自愈布局或水印。`
      );
      return new NativeMO(wrappedCallback);
    };
    window.MutationObserver.prototype = NativeMO.prototype;
  }

  function mutationHasWatermark(m) {
    try {
      if (!m) return false;
      const checkEl = (el) =>
        el &&
        el.nodeType === 1 &&
        (isWatermarkLike(el) ||
          /watermark/i.test(el.className || '') ||
          /watermark/i.test(el.id || ''));
      if (m.type === 'attributes') {
        return /watermark/i.test(m.attributeName || '') || checkEl(m.target);
      } else if (m.type === 'childList') {
        for (const n of m.addedNodes || []) {
          if (n.nodeType === 1 && checkEl(n)) return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function patchSetAttribute() {
    const nativeSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (
        typeof name === 'string' &&
        (/watermark/i.test(name) || /watermark/i.test(String(value)))
      ) {
        console.log(
          `${LOG_PREFIX} 检测到 setAttribute 可能还原水印:`,
          {
            name,
            value,
            node: describeNode(this),
          }
        );
      }
      return nativeSetAttribute.call(this, name, value);
    };
  }

  function setupWatermarkMutationLogger() {
    if (!window.MutationObserver) return;
    const logger = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (mutationHasWatermark(m)) {
          console.log(
            `${LOG_PREFIX} 监测到疑似水印相关 DOM 变更:`,
            {
              type: m.type,
              attributeName: m.attributeName,
              target: describeNode(m.target),
            }
          );
        }
      }
    });
    const start = () => {
      if (!document.body) return false;
      logger.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'watermark', 'data-watermark', 'data-testid'],
      });
      return true;
    };
    if (!start()) {
      const watcher = new MutationObserver(() => {
        if (start()) watcher.disconnect();
      });
      watcher.observe(document.documentElement, { childList: true });
    }
  }

  function setupInteractionCorrelator() {
    let lastInteraction = null;

    const markInteraction = (type, extra) => {
      lastInteraction = {
        type,
        extra,
        time: performance.now(),
      };
    };

    const interactionTypes = ['click', 'keydown', 'scroll', 'resize'];
    interactionTypes.forEach((evt) => {
      window.addEventListener(
        evt,
        (e) => {
          markInteraction(evt, describeEvent(e));
        },
        true
      );
    });

    if (!window.MutationObserver) return;
    const mo = new MutationObserver((mutations) => {
      if (!lastInteraction) return;
      const now = performance.now();
      if (now - lastInteraction.time > 500) return;

      for (const m of mutations) {
        if (mutationHasWatermark(m)) {
          console.log(
            `${LOG_PREFIX} 检测到交互后疑似“水印还原”行为:`,
            {
              interaction: lastInteraction,
              mutation: {
                type: m.type,
                attributeName: m.attributeName,
                target: describeNode(m.target),
              },
            }
          );
          break;
        }
      }
    });

    const start = () => {
      if (!document.body) return false;
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'watermark', 'data-watermark', 'data-testid'],
      });
      return true;
    };
    if (!start()) {
      const watcher = new MutationObserver(() => {
        if (start()) watcher.disconnect();
      });
      watcher.observe(document.documentElement, { childList: true });
    }
  }

  /* ========== 状态 & 工具函数 ========== */
  function loadButtonPosition() {
    const fallback = { side: 'left', top: 0.5 };
    try {
      if (typeof GM_getValue === 'function') {
        const stored = GM_getValue(BUTTON_STORAGE_KEY);
        if (stored && typeof stored === 'object') {
          return normalizeButtonPos(stored, fallback);
        }
      } else if (window.localStorage) {
        const raw = window.localStorage.getItem(BUTTON_STORAGE_KEY);
        if (raw) {
          return normalizeButtonPos(JSON.parse(raw), fallback);
        }
      }
    } catch (err) {
      console.debug(`${LOG_PREFIX} 读取按钮位置失败：`, err);
    }
    return { ...fallback };
  }

  function saveButtonPosition(pos) {
    const normalized = normalizeButtonPos(pos, { side: 'left', top: 0.5 });
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(BUTTON_STORAGE_KEY, normalized);
      } else if (window.localStorage) {
        window.localStorage.setItem(BUTTON_STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      console.debug(`${LOG_PREFIX} 保存按钮位置失败：`, err);
    }
  }

  function normalizeButtonPos(pos, fallback) {
    if (!pos || typeof pos !== 'object') return { ...fallback };
    const side = pos.side === 'right' ? 'right' : 'left';
    const top = clamp(typeof pos.top === 'number' ? pos.top : fallback.top, 0.05, 0.95);
    return { side, top };
  }

  function walkDom(root, cb) {
    if (!root) return;
    if (root instanceof Element) {
      cb(root);
      if (root.shadowRoot) walkDom(root.shadowRoot, cb);
      for (const child of root.children) {
        walkDom(child, cb);
      }
    } else if (
      root instanceof DocumentFragment ||
      root instanceof ShadowRoot ||
      root instanceof Document
    ) {
      const nodes = root.children || root.childNodes;
      for (const child of nodes) {
        if (child.nodeType === 1) walkDom(child, cb);
      }
    }
  }

  function shouldSkipButton(el) {
    return sweepButton && (el === sweepButton || sweepButton.contains(el));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function whenBody(fn) {
    if (document.body) {
      fn();
    } else {
      const watcher = new MutationObserver(() => {
        if (document.body) {
          watcher.disconnect();
          fn();
        }
      });
      watcher.observe(document.documentElement, { childList: true });
    }
  }

  function safeComputedStyle(el) {
    try {
      return window.getComputedStyle(el);
    } catch {
      return null;
    }
  }

  function describeNode(node) {
    try {
      if (!node || node.nodeType !== 1) return null;
      const el = node;
      return {
        tag: el.tagName,
        id: el.id || undefined,
        class: el.className || undefined,
        attrs: {
          watermark: el.getAttribute('watermark') || undefined,
          dataWatermark: el.getAttribute('data-watermark') || undefined,
          dataTestid: el.getAttribute('data-testid') || undefined,
        },
      };
    } catch {
      return null;
    }
  }

  function describeEvent(e) {
    if (!e) return null;
    const base = { type: e.type, timeStamp: e.timeStamp };
    if (e.type === 'click') {
      return {
        ...base,
        x: e.clientX,
        y: e.clientY,
        target: describeNode(e.target),
      };
    }
    if (e.type === 'keydown') {
      return {
        ...base,
        key: e.key,
        code: e.code,
      };
    }
    if (e.type === 'scroll') {
      return {
        ...base,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
    }
    if (e.type === 'resize') {
      return {
        ...base,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      };
    }
    return base;
  }
})();