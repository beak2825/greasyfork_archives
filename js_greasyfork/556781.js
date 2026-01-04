// ==UserScript==
// @name         NexusMods 中文化插件
// @namespace    https://github.com/SychO3/nexusmods-chinese
// @description  仅翻译 Nexus Mods 界面元素为简体中文，不修改 Mod 标题和描述。
// @version      0.2.1
// @author       SychO
// @match        https://*.nexusmods.com/*
// @match        https://nexusmods.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require https://update.greasyfork.org/scripts/556780/1710242/NexusMods%20%E4%B8%AD%E6%96%87%E5%8C%96-%E8%AF%8D%E5%BA%93.js
// @supportURL   https://github.com/SychO3/nexusmods-chinese/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556781/NexusMods%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556781/NexusMods%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (window, document, undefined) {
  'use strict';

  const CONFIG = {
    LANG: 'zh-CN',
    // 忽略翻译的区域：
    // - Mod 详情页的长描述容器
    // - 使用 Lexical 编辑器渲染的富文本内容（合集说明、变更日志等，属于用户写的内容）
  IGNORE_SELECTORS: (function () {
      try {
        const conf = window.NEXUS_I18N && window.NEXUS_I18N.conf;
        if (conf && Array.isArray(conf.ignoreSelectors) && conf.ignoreSelectors.length > 0) {
          return conf.ignoreSelectors.join(',');
        }
      } catch (e) {
        // ignore
      }
      // 本地兜底（如果词典未提供 ignoreSelectors）
      return [
        '.mod_description_container', // <div class="container mod_description_container condensed">
        '.prose-lexical.prose'        // Lexical 富文本区域（例如合集日志正文）
      ].join(',');
    })(),
    // 在 <div class="container tab-description"> 里，允许翻译的子区域
    // 其它子区域一律不翻译
  DESC_TAB_ALLOW_SELECTORS: (function () {
      try {
        const conf = window.NEXUS_I18N && window.NEXUS_I18N.conf;
        if (conf && Array.isArray(conf.descTabAllowSelectors) && conf.descTabAllowSelectors.length > 0) {
          return conf.descTabAllowSelectors.slice();
        }
      } catch (e) {
        // ignore
      }
      // 本地兜底列表
      return [
        '#description_tab_h2',
        '.modhistory.inline-flex',
        '.actions.clearfix',
        '.accordionitems'
      ];
    })(),
    // 超过该长度的文本节点不尝试翻译，以降低误伤长段文字的概率
    // 默认 200 对绝大部分 UI 足够，但会挡住某些稍长的提示文本（例如评论跟踪中心那一整段说明）
    // 这里适当放宽到 400，仍然远小于典型的长描述/文章长度
    MAX_TEXT_LENGTH: 400,
    // 是否屏蔽站内广告（仅隐藏常见广告容器，不影响功能）
    BLOCK_ADS: false,
    // 常见广告容器选择器（优先从词典配置中读取，方便远程更新）
    AD_SELECTORS: (function () {
      try {
        const conf = window.NEXUS_I18N && window.NEXUS_I18N.conf;
        if (conf && Array.isArray(conf.adSelectors) && conf.adSelectors.length > 0) {
          return conf.adSelectors.join(',');
        }
      } catch (e) {
        // ignore
      }
      // 本地兜底列表（如果词典未提供 adSelectors）
      return [
        '[data-testid^="ad-"]',
        '.ad-container',
        '.ad-slot',
        '.advertisement',
        '.premium-upsell-banner',
        '.new-new-premium-banner',
        '#freeTrialBanner'
      ].join(',');
    })()
  };

  // 页面原始 window（Tampermonkey 启用 @grant 后脚本运行在沙盒中，需要通过 unsafeWindow 访问站点的全局变量）
  const PAGE_WINDOW = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  let currentPageType = null;
  let currentDict = {};
  let lastUrl = window.location.href;

  // 规范化后的公共词典与各页面词典缓存，避免重复 normalize
  let normalizedPublicDict = null;
  const normalizedPageDictMap = new Map();

  // 文本翻译缓存：同一英文短语在当前页面类型下只翻译一次
  const translationCache = new Map();
  const NO_TRANSLATION = Symbol('NO_TRANSLATION');

  // 文本节点内容缓存：避免在 DOM mutation 高频时重复翻译未变更的 TextNode
  let textNodeCache = new WeakMap();

  // 预编译后的正则规则缓存
  let compiledRegexpRules = null;

  // 文本标准化：压缩所有空白为单个空格，并去掉首尾空白
  function normalizeText(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  // 将英文短月份（Jan/Feb/...）转换为两位数字月份
  function mapShortMonth(monStr) {
    if (!monStr) return '01';
    const key = monStr.slice(0, 3);
    const monthMapShort = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    return monthMapShort[key] || '01';
  }

  // 将英文完整月份（January/...）转换为两位数字月份
  function mapFullMonth(monStr) {
    if (!monStr) return '01';
    const monthMapFull = {
      January: '01',   February: '02', March: '03',    April: '04',
      May: '05',       June: '06',     July: '07',     August: '08',
      September: '09', October: '10',  November: '11', December: '12'
    };
    return monthMapFull[monStr] || mapShortMonth(monStr);
  }

  // 12 小时制转 24 小时制，返回两位数字字符串
  function convert12hTo24(hourStr, ampm) {
    let hour = parseInt(hourStr, 10);
    if (Number.isNaN(hour)) hour = 0;
    const up = (ampm || '').toUpperCase();
    if (up === 'PM' && hour < 12) hour += 12;
    if (up === 'AM' && hour === 12) hour = 0;
    return String(hour).padStart(2, '0');
  }

  // 将 {Y}/{M}/{D}/{h}/{m} 模板占位符替换为具体数值
  // 只替换存在于 replacement 字符串中的占位符，避免多余 replace
  function applyDateTemplate(replacement, parts) {
    let result = replacement;
    const { year, month, day, hour, minute } = parts || {};

    if (year != null && result.includes('{Y}')) {
      result = result.replace('{Y}', year);
    }
    if (month != null && result.includes('{M}')) {
      result = result.replace('{M}', month);
    }
    if (day != null && result.includes('{D}')) {
      result = result.replace('{D}', day);
    }
    if (hour != null && result.includes('{h}')) {
      result = result.replace('{h}', hour);
    }
    if (minute != null && result.includes('{m}')) {
      result = result.replace('{m}', minute);
    }

    return result;
  }

  // MutationObserver 统一配置
  const observerConfig = {
    childList: true,
    subtree: true,
    characterData: true,
    // 监听常见可翻译属性 + style（用于重新隐藏被脚本改样式显示出来的广告）
    attributeFilter: ['value', 'placeholder', 'aria-label', 'title', 'data-original-title', 'style']
  };

  // 已经挂过观察器的根节点（document.body 或各个 shadowRoot）
  const observedRoots = new WeakSet();

  const STORAGE_KEYS = {
    BLOCK_ADS: 'nexusmods_chinese_block_ads'
  };

  // 最近一次因为 URL 变化而触发整页翻译的时间戳，用于简单节流
  let lastUrlTranslateAt = 0;

  function loadConfigFromStorage() {
    try {
      if (typeof GM_getValue === 'function') {
        const storedBlockAds = GM_getValue(STORAGE_KEYS.BLOCK_ADS, null);
        if (typeof storedBlockAds === 'boolean') {
          CONFIG.BLOCK_ADS = storedBlockAds;
        }
      }
    } catch (e) {
      console.warn('NexusMods 中文化插件：读取配置失败', e);
    }
  }

  /**
   * 处理任意根节点（document.body 或 shadowRoot）上的 DOM 变化
   * - 对 URL 变化做简单节流，避免短时间内多次整页遍历
   * - 将同一批次 mutation 按类型聚合，减少重复遍历与广告查询
   * - 检测大规模 DOM 变化，触发完整页面翻译（修复表单提交后翻译失效问题）
   */
  function handleMutations(mutations) {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      const now = Date.now();
      const shouldFullTranslate = now - lastUrlTranslateAt > 500;
      if (shouldFullTranslate) {
        lastUrlTranslateAt = now;
        updatePageConfig('URL 变化');
        if (document.body) {
          traverseNode(document.body);
          hideAds(document.body);
        }
        translateTitle();
      }
    }

    if (!mutations || mutations.length === 0) return;

    const addedNodes = new Set();
    const textNodes = new Set();
    const attrTargets = new Set();
    const adRoots = new Set();
    let totalAddedNodeCount = 0;
    let totalRemovedNodeCount = 0;

    for (const mutation of mutations) {
      if (!mutation) continue;

      if (mutation.type === 'childList') {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          totalAddedNodeCount += mutation.addedNodes.length;
          mutation.addedNodes.forEach((node) => {
            if (!node) return;
            addedNodes.add(node);
            adRoots.add(node);
          });
        }
        if (mutation.removedNodes && mutation.removedNodes.length) {
          totalRemovedNodeCount += mutation.removedNodes.length;
        }
      } else if (mutation.type === 'characterData') {
        if (mutation.target) {
          textNodes.add(mutation.target);
        }
      } else if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target && target.nodeType === Node.ELEMENT_NODE) {
          attrTargets.add(target);
          // 仅当样式 / 类名 / id 改变时，才认为可能影响广告可见性
          if (
            mutation.attributeName === 'style' ||
            mutation.attributeName === 'class' ||
            mutation.attributeName === 'id'
          ) {
            adRoots.add(target);
          }
        }
      }
    }

    // 检测大规模 DOM 变化：如果添加/删除的节点数超过阈值，触发完整页面翻译
    // 这能解决表单提交后内容大量更新但 URL 不变的情况
    const LARGE_CHANGE_THRESHOLD = 20; // 节点变化超过20个认为是大规模更新
    const isLargeChange = (totalAddedNodeCount + totalRemovedNodeCount) >= LARGE_CHANGE_THRESHOLD;
    
    if (isLargeChange) {
      // 大规模变化，对整个页面重新翻译
      const now = Date.now();
      if (now - lastUrlTranslateAt > 200) { // 简单节流，避免短时间内多次全页翻译
        lastUrlTranslateAt = now;
        if (document.body) {
          traverseNode(document.body);
          hideAds(document.body);
        }
        translateTitle();
        return; // 已经完整翻译过了，不需要再处理增量变化
      }
    }

    // 正常的增量处理流程
    // 先处理新增整棵子树
    addedNodes.forEach((node) => {
      traverseNode(node);
    });

    // 再处理纯文本变更
    textNodes.forEach((node) => {
      traverseNode(node);
    });

    // 属性变更只翻译相关属性，不再重跑整棵子树
    attrTargets.forEach((el) => {
      translateElementAttributes(el);
    });

    // 最后针对可能包含广告的节点做局部广告隐藏
    if (CONFIG.BLOCK_ADS) {
      adRoots.forEach((root) => {
        hideAds(root);
      });
    }
  }

  /**
   * 对某个根节点（document.body 或 shadowRoot）挂载 MutationObserver
   */
  function observeRoot(root) {
    if (!root || observedRoots.has(root)) return;
    observedRoots.add(root);

    try {
      const observer = new MutationObserver(handleMutations);
      observer.observe(root, observerConfig);
    } catch (e) {
      console.warn('NexusMods 中文化插件：无法观察根节点', root, e);
    }
  }

  /**
   * 屏蔽广告容器：根据 CONFIG.AD_SELECTORS 隐藏常见广告区域
   */
  function hideAds(root) {
    if (!CONFIG.BLOCK_ADS) return;
    if (!root || (root.nodeType !== Node.ELEMENT_NODE && root !== document && root !== document.body)) return;

    try {
      const base = root === document ? document.documentElement : root;
      const adSelectors = CONFIG.AD_SELECTORS;
      if (!adSelectors) return;

      // 1) 如果当前根元素本身就是广告容器，直接隐藏
      if (base.nodeType === Node.ELEMENT_NODE && base.matches && base.matches(adSelectors)) {
        base.style.setProperty('display', 'none', 'important');
        base.style.setProperty('visibility', 'hidden', 'important');
      }

      // 2) 再隐藏其内部所有广告容器
      const nodes = base.querySelectorAll(adSelectors);
      nodes.forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
      });

      // 额外布局调整：当页脚「支持 Nexus Mods」块被隐藏时，
      // 将紧随其后的「数据统计」块往上贴一点，去掉多余的顶部间距。
      try {
        const footerStats = base.querySelector('.rj-supporter-wrapper + .rj-network-stats');
        if (footerStats) {
          footerStats.style.setProperty('margin-top', '0', 'important');
        }
      } catch (e) {
        // 忽略布局调整中的错误
      }

      // 3) Premium 试用卡片等：通过 premium 按钮推断广告卡片
      const premiumLinks = base.querySelectorAll('a.nxm-button-premium[href*="/premium"]');
      premiumLinks.forEach((link) => {
        const card =
          link.closest('div.relative') ||
          link.closest('div');
        if (card) {
          card.style.setProperty('display', 'none', 'important');
          card.style.setProperty('visibility', 'hidden', 'important');
        }
      });
    } catch (e) {
      console.warn('NexusMods 中文化插件：隐藏广告时出错', e);
    }
  }

  /**
   * 检查词典是否已加载
   */
  function ensureDictionary() {
    if (typeof window.NEXUS_I18N === 'undefined') {
      console.warn('NexusMods 中文化插件：词典 window.NEXUS_I18N 未加载。');
      return false;
    }
    if (!window.NEXUS_I18N[CONFIG.LANG]) {
      console.warn('NexusMods 中文化插件：未找到语言配置 ' + CONFIG.LANG);
      return false;
    }
    return true;
  }

  /**
   * 根据当前 URL 检测页面类型
   * 使用词典文件中配置的正则 routes 来匹配
   */
  function detectPageType() {
    const path = window.location.pathname || '/';
    const conf = window.NEXUS_I18N && window.NEXUS_I18N.conf;
    const routes = conf && conf.routes;

    if (!routes || !Array.isArray(routes)) {
      return null;
    }

    for (const route of routes) {
      const [pattern, type] = route;
      if (!pattern || !type) continue;
      try {
        const re = new RegExp(pattern);
        if (re.test(path)) {
          return type;
        }
      } catch (e) {
        console.warn('NexusMods 中文化插件：无效的 URL 正则', pattern, e);
      }
    }

    return null;
  }

  /**
   * 根据当前页面类型构建翻译词典
   */
  function buildPageDict(pageType) {
    if (!ensureDictionary()) {
      currentDict = {};
      return;
    }

    const langDict = window.NEXUS_I18N[CONFIG.LANG] || {};

    // 将词典的 key 也做一次空白标准化，避免因为换行/多空格导致匹配不上
    function normalizeDict(dictObj) {
      const result = {};
      if (!dictObj) return result;
      for (const key in dictObj) {
        if (!Object.prototype.hasOwnProperty.call(dictObj, key)) continue;
        const normKey = normalizeText(key);
        if (!normKey) continue;
        result[normKey] = dictObj[key];
      }
      return result;
    }

    // 公共词典只需规范化一次
    if (!normalizedPublicDict) {
      normalizedPublicDict = normalizeDict(langDict.public || {});
    }

    let pageDict = {};
    if (pageType) {
      const cacheKey = pageType;
      if (normalizedPageDictMap.has(cacheKey)) {
        pageDict = normalizedPageDictMap.get(cacheKey) || {};
      } else {
        pageDict = normalizeDict(langDict[pageType] || {});
        normalizedPageDictMap.set(cacheKey, pageDict);
      }
    }

    currentDict = Object.assign({}, normalizedPublicDict, pageDict);
  }

  /**
   * 重新识别页面并构建词典
   */
  function updatePageConfig(trigger) {
    const newType = detectPageType();
    const pageTypeChanged = newType !== currentPageType;

    // 无论页面类型是否为 null，都更新当前类型并重建词典（至少保证 public 生效）
    currentPageType = newType;
    buildPageDict(currentPageType);

    // 页面配置变化时清空翻译相关缓存，避免旧页面结果干扰新页面
    translationCache.clear();
    textNodeCache = new WeakMap();

    // 只有在页面类型发生变化时，才对整页重新翻译，避免过于频繁
    if (pageTypeChanged) {
      if (document.body) {
        traverseNode(document.body);
      }
      translateTitle();
      console.log(`NexusMods 中文化插件：${trigger} 触发，页面类型 = ${currentPageType || 'unknown'}`);
    }
  }

  /**
   * 文本翻译：先完整匹配词典，再用字典里配置的正则做动态替换
   * 支持简单日期格式转换（例如 15 Nov 2025 -> 2025-11-15）
   */
  function translateText(raw) {
    if (!raw) return raw;
    const text = normalizeText(raw);
    if (!text) return raw;

    // 特殊处理“前缀 + 名称”一类标签：
    // - "Category: Audio" / "分类：Audio"
    // - "Excluded: Camera" / "排除：Camera"
    // - "Badge: Top pick" / "徽章：Top pick"
    // 统一让前缀翻译成中文，并对后面的分类名称再走一次词典翻译。
    const prefixNameMatch =
      text.match(/^(Category|Excluded|Badge):\s+(.+)$/) ||
      text.match(/^(分类|排除|徽章)：\s*(.+)$/);

    if (prefixNameMatch) {
      const rawPrefix = prefixNameMatch[1];
      const rawName = prefixNameMatch[2];

      const normPrefix = normalizeText(rawPrefix);
      const normName = normalizeText(rawName);

      // 前缀映射：允许通过词典覆盖，否则用内置默认
      const prefixDict = {
        'Category': '分类',
        '分类': '分类',
        'Excluded': '排除',
        '排除': '排除',
        'Badge': '徽章',
        '徽章': '徽章'
      };

      let translatedPrefix =
        currentDict[normPrefix] ||
        prefixDict[normPrefix] ||
        rawPrefix;

      let translatedName = currentDict[normName] || rawName;
      // 如果词典中没有该分类名称，但它本身已经包含非 ASCII 字符（大概率是中文），则保持原样
      if (!currentDict[normName] && /[^\x00-\x7F]/.test(rawName)) {
        translatedName = rawName;
      }

      return `${translatedPrefix}：${translatedName}`;
    }

    // 特殊处理“标签 + 数量”形式的文本，例如：
    // - "Anime (14)"
    // - "Chinese (5)"
    // - "Version 1.6 Compatible (32)"
    // 这类文本在 UI 上是一个可点击的过滤标签，左边是可翻译的标签名，括号内是数量。
    // 这里将标签名部分再次交给 translateText 处理（从词典或正则规则中获取翻译），
    // 数量保持不变，只将圆括号替换为全角中文括号。
    const labelCountMatch = text.match(/^(.+?)\s*\(\s*([0-9,]+)\s*\)$/);
    if (labelCountMatch) {
      const rawLabel = labelCountMatch[1];
      const count = labelCountMatch[2];

      // 先尝试对标签名本身做一次翻译（会再次走词典与正则规则）
      const translatedLabel = translateText(rawLabel);

      // 如果翻译结果与原文不同，则认为成功翻译，直接返回“译文（数量）”
      if (translatedLabel && translatedLabel !== rawLabel) {
        return `${translatedLabel}（${count}）`;
      }

      // 如果标签名里本身已经包含非 ASCII 字符（大概率已经是中文或其他本地化文本），
      // 则不再强行翻译，只统一括号样式。
      if (/[^\x00-\x7F]/.test(rawLabel)) {
        return `${rawLabel}（${count}）`;
      }

      // 默认情况：保持英文标签名，只替换为中文括号，避免完全不翻译导致看起来“不工作”。
      return `${rawLabel}（${count}）`;
    }

    // 先尝试完整匹配词典（即使是长文本，只要你在字典里显式配置，就允许翻译）
    const translated = currentDict[text];
    if (translated) {
      return translated;
    }

    // 再对“非词典命中的文本”做长度限制，避免误伤长段用户内容
    if (text.length > CONFIG.MAX_TEXT_LENGTH) {
      return raw;
    }

    // 对较短的 UI 文本启用翻译结果缓存（按标准化后的 text 为 key）
    const useCache = text.length <= CONFIG.MAX_TEXT_LENGTH;
    if (useCache) {
      const cached = translationCache.get(text);
      if (cached !== undefined) {
        if (cached === NO_TRANSLATION) {
          return raw;
        }
        return cached;
      }
    }

    // 再尝试 I18N.conf.regexpRules 中配置的正则规则（使用预编译版本）
    const rules = getCompiledRegexpRules();

    if (rules && rules.length > 0) {
      for (const rule of rules) {
        const { re, replacement, type, patternDesc } = rule;
        if (!re || !replacement) continue;
        try {
          const match = text.match(re);
          if (!match) continue;

          // 特殊类型 1：英文日期（缩写月份）"15 Nov 2025" -> "2025-11-15"
          if (type === 'date_en_dMY') {
            const day = parseInt(match[1], 10);
            const monStr = match[2];
            const year = match[3];

            const mm = mapShortMonth(monStr);
            const dd = String(day).padStart(2, '0');
            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd
            });
          }

          // 特殊类型 1c："16 Nov 2025, 1:55PM | Action by:" -> "2025-11-16 13:55 | 操作："
          if (type === 'date_en_dMYhm_action') {
            const day = parseInt(match[1], 10);
            const monStr = match[2];
            const year = match[3];
            const hourRaw = match[4];
            const minute = match[5];
            const ampm = match[6];

            const mm = mapShortMonth(monStr);
            const dd = String(day).padStart(2, '0');
            const HH = convert12hTo24(hourRaw, ampm);

            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd,
              hour: HH,
              minute
            });
          }

          // 特殊类型 1b：英文日期（完整月份）"15 November 2025" -> "2025-11-15"
          if (type === 'date_en_dFY') {
            const day = parseInt(match[1], 10);
            const monStr = match[2];
            const year = match[3];

            const mm = mapFullMonth(monStr);
            const dd = String(day).padStart(2, '0');
            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd
            });
          }

          // 特殊类型 1b 扩展：英文日期（完整月份在前）"December 11, 2024" -> "2024-12-11"
          if (type === 'date_en_FdY') {
            const monStr = match[1];
            const day = parseInt(match[2], 10);
            const year = match[3];

            const mm = mapFullMonth(monStr);
            const dd = String(day).padStart(2, '0');
            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd
            });
          }

          // 特殊类型 1d：仅月份和年份 "November 2025" / "Nov 2025" -> "2025-11"
          if (type === 'date_en_FY') {
            const monStr = match[1];
            const year = match[2];

            // 只接受合法月份，避免把 "Game 2025" 之类误判为日期
            const key = monStr.slice(0, 3);
            const monthMapShortStrict = {
              Jan: '01', Feb: '02', Mar: '03', Apr: '04',
              May: '05', Jun: '06', Jul: '07', Aug: '08',
              Sep: '09', Oct: '10', Nov: '11', Dec: '12'
            };
            const mm = monthMapShortStrict[key];
            if (!mm) {
              return raw;
            }

            return applyDateTemplate(replacement, {
              year,
              month: mm
            });
          }

          // 特殊类型 2：完整月份 + 12 小时制时间
          // 示例："15 November 2025, 9:16AM" -> "2025-11-15 09:16"
          if (type === 'date_en_dFYGis') {
            const day = parseInt(match[1], 10);
            const monStr = match[2];
            const year = match[3];
            const hourRaw = match[4];
            const minute = match[5];
            const ampm = match[6];

            const mm = mapFullMonth(monStr);
            const dd = String(day).padStart(2, '0');
            const HH = convert12hTo24(hourRaw, ampm);

            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd,
              hour: HH,
              minute
            });
          }

          // 特殊类型 2b：仅时间 + AM/PM，例如 "10:02PM" -> "22:02"
          if (type === 'time_en_hmAP') {
            const hourRaw = match[1];
            const minute = match[2];
            const ampm = match[3];

            const HH = convert12hTo24(hourRaw, ampm);

            return applyDateTemplate(replacement, {
              hour: HH,
              minute
            });
          }

          // 特殊类型 2c：仅月份 + 日期 "November 10" / "Nov 10" -> "11-10"
          if (type === 'date_en_Fd') {
            const monStr = match[1];
            const day = parseInt(match[2], 10);

            const mm = mapFullMonth(monStr);
            const dd = String(day).padStart(2, '0');

            return applyDateTemplate(replacement, {
              month: mm,
              day: dd
            });
          }

          // 特殊类型 3："Uploaded at 21:21 03 Nov 2025" -> "上传于 2025-11-03 21:21"
          if (type === 'date_en_time_dMY') {
            const hourRaw = match[1];
            const minute = match[2];
            const day = parseInt(match[3], 10);
            const monStr = match[4];
            const year = match[5];

            const mm = mapShortMonth(monStr);
            const dd = String(day).padStart(2, '0');
            const HH = String(parseInt(hourRaw, 10)).padStart(2, '0');

            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd,
              hour: HH,
              minute
            });
          }

          // 特殊类型 4："06:31, 16 Nov 2025" -> "2025-11-16 06:31"
          if (type === 'date_en_GijMY') {
            const hourRaw = match[1];
            const minute = match[2];
            const day = parseInt(match[3], 10);
            const monStr = match[4];
            const year = match[5];

            const mm = mapShortMonth(monStr);
            const dd = String(day).padStart(2, '0');
            const HH = String(parseInt(hourRaw, 10)).padStart(2, '0');

            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd,
              hour: HH,
              minute
            });
          }

          // 特殊类型 4b："Uploaded 02 Apr 2016, 10:23" -> "上传于 2016-04-02 10:23"
          if (type === 'date_en_dMYhm') {
            const day = parseInt(match[1], 10);
            const monStr = match[2];
            const year = match[3];
            const hourRaw = match[4];
            const minute = match[5];

            const mm = mapShortMonth(monStr);
            const dd = String(day).padStart(2, '0');
            const HH = String(parseInt(hourRaw, 10)).padStart(2, '0');

            return applyDateTemplate(replacement, {
              year,
              month: mm,
              day: dd,
              hour: HH,
              minute
            });
          }

          // 特殊类型 5：相对时间："4 weeks ago" / "1 day ago" / "2 years ago"
          if (type === 'rel_time_en') {
            const n = parseInt(match[1], 10);
            const unitRaw = match[2]; // 原始英文单位
            const unit = unitRaw.toLowerCase();

            let suffix = '';
            if (unit.startsWith('second') || unit === 'sec' || unit === 'secs') {
              suffix = '秒前';
            } else if (unit.startsWith('minute') || unit === 'min' || unit === 'mins') {
              suffix = '分钟前';
            } else if (unit.startsWith('hour') || unit === 'hr' || unit === 'hrs') {
              suffix = '小时前';
            } else if (unit.startsWith('day')) {
              suffix = '天前';
            } else if (unit.startsWith('week') || unit === 'wk' || unit === 'wks') {
              suffix = '周前';
            } else if (unit.startsWith('month') || unit === 'mo' || unit === 'mos') {
              suffix = '个月前';
            } else if (unit.startsWith('year') || unit === 'yr' || unit === 'yrs') {
              suffix = '年前';
            } else {
              // 未知单位，直接返回原文
              return raw;
            }

            return `${n} ${suffix}`;
          }

          // 特殊类型 5b：相对时间拆分形式："2 years"（另一个节点是 "ago"）
          if (type === 'rel_time_en_partial') {
            const n = parseInt(match[1], 10);
            const unitRaw = match[2];
            const unit = unitRaw.toLowerCase();

            let suffix = '';
            if (unit.startsWith('second') || unit === 'sec' || unit === 'secs') {
              suffix = '秒';
            } else if (unit.startsWith('minute') || unit === 'min' || unit === 'mins') {
              suffix = '分钟';
            } else if (unit.startsWith('hour') || unit === 'hr' || unit === 'hrs') {
              suffix = '小时';
            } else if (unit.startsWith('day')) {
              suffix = '天';
            } else if (unit.startsWith('week') || unit === 'wk' || unit === 'wks') {
              suffix = '周';
            } else if (unit.startsWith('month') || unit === 'mo' || unit === 'mos') {
              suffix = '个月';
            } else if (unit.startsWith('year') || unit === 'yr' || unit === 'yrs') {
              suffix = '年';
            } else {
              return raw;
            }

            return `${n} ${suffix}`;
          }

          // 特殊类型 6：时间范围 "Time range: 7 Days" / "Time range: 24 Hours"
          if (type === 'time_range_en') {
            const n = match[1];
            const unitRaw = match[2].toLowerCase();

            let unitZh = '';
            if (unitRaw.startsWith('hour')) {
              unitZh = '小时';
            } else if (unitRaw.startsWith('day')) {
              unitZh = '天';
            } else if (unitRaw.startsWith('year')) {
              unitZh = '年';
            } else {
              return raw;
            }

            return `时间范围：${n} ${unitZh}`;
          }

          // 默认：直接使用字符串替换
          if (re.test(text)) {
            return text.replace(re, replacement);
          }
        } catch (e) {
          console.warn('NexusMods 中文化插件：无效的正则规则', patternDesc || re, e);
        }
      }
    }

    // 没有命中任何规则，缓存“无翻译”结果
    if (useCache) {
      translationCache.set(text, NO_TRANSLATION);
    }

    return raw;
  }

  /**
   * 预编译 I18N.conf.regexpRules，避免在每次翻译时重复构造 RegExp
   */
  function getCompiledRegexpRules() {
    if (compiledRegexpRules) {
      return compiledRegexpRules;
    }

    const conf = window.NEXUS_I18N && window.NEXUS_I18N.conf;
    const regexpRules = conf && conf.regexpRules;

    const compiled = [];
    if (regexpRules && Array.isArray(regexpRules)) {
      for (const rule of regexpRules) {
        if (!rule || rule.length < 2) continue;
        const [pattern, replacement, type] = rule;
        if (!pattern || !replacement) continue;
        try {
          const re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
          compiled.push({
            re,
            replacement,
            type,
            patternDesc: pattern
          });
        } catch (e) {
          console.warn('NexusMods 中文化插件：编译正则规则失败', rule, e);
        }
      }
    }

    compiledRegexpRules = compiled;
    return compiledRegexpRules;
  }

  /**
   * 判断某个元素是否应该被忽略翻译
   */
  function shouldIgnoreElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

    // 全局忽略选择器（如整块描述容器）
    if (CONFIG.IGNORE_SELECTORS && el.matches && el.matches(CONFIG.IGNORE_SELECTORS)) {
      return true;
    }

    // 描述 Tab 内的细粒度控制：
    // 在 .container.tab-description 里，只有特定子块允许翻译，其余一律忽略
    const descContainer = el.closest && el.closest('.container.tab-description');
    // 只对“容器内部的元素”启用白名单；容器本身仍然需要遍历
    if (descContainer && !el.matches('.container.tab-description')) {
      const allowSelectors = CONFIG.DESC_TAB_ALLOW_SELECTORS || [];
      for (const sel of allowSelectors) {
        if (!sel) continue;
        const allowedBlock = el.closest(sel);
        if (allowedBlock && descContainer.contains(allowedBlock)) {
          // 位于允许翻译的区域
          return false;
        }
      }
      // 在描述 Tab 里，但不在允许翻译的几个块中 → 忽略
      return true;
    }

    return false;
  }

  /**
   * 翻译元素的常见文本属性
   */
  function translateElementAttributes(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    const attrs = ['value', 'placeholder', 'aria-label', 'title', 'data-original-title'];

    for (const name of attrs) {
      const original = el.getAttribute(name);
      if (original) {
        const translated = translateText(original);
        if (translated !== original) {
          el.setAttribute(name, translated);
        }
      }
    }
  }

  /**
   * 判断元素是否是图标容器（如 Material Icons、Font Awesome 等）
   */
  function isIconElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    
    const classList = el.classList;
    if (!classList) return false;
    
    // 检查常见的图标类名
    const iconClasses = [
      'material-icons',
      'material-icons-outlined',
      'material-icons-round',
      'material-icons-sharp',
      'material-icons-two-tone',
      'fa',      // Font Awesome
      'fas',     // Font Awesome Solid
      'far',     // Font Awesome Regular
      'fal',     // Font Awesome Light
      'fab',     // Font Awesome Brands
      'icon',    // 通用图标类
      'glyphicon' // Bootstrap Glyphicons
    ];
    
    for (const iconClass of iconClasses) {
      if (classList.contains(iconClass)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 遍历并翻译节点
   */
  function traverseNode(rootNode) {
    if (!rootNode) return;

    // 根元素本身需要忽略时，整棵子树都不翻译
    if (rootNode.nodeType === Node.ELEMENT_NODE && shouldIgnoreElement(rootNode)) {
      return;
    }

    // 文本节点
    if (rootNode.nodeType === Node.TEXT_NODE) {
      // 如果文本节点位于忽略区域内（例如 .prose-lexical.prose），则不翻译
      const parentEl = rootNode.parentElement;
      if (
        parentEl &&
        CONFIG.IGNORE_SELECTORS &&
        parentEl.closest &&
        parentEl.closest(CONFIG.IGNORE_SELECTORS)
      ) {
        return;
      }

      // 如果父元素是图标容器，则不翻译（图标字体的文本标识符不应被翻译）
      if (parentEl && isIconElement(parentEl)) {
        return;
      }

      const originalText = rootNode.data;
      // 如果文本内容未变化，则跳过翻译，避免在高频 mutation 时重复处理
      const lastProcessed = textNodeCache.get(rootNode);
      if (lastProcessed === originalText) {
        return;
      }

      const translatedText = translateText(originalText);
      if (translatedText !== originalText) {
        rootNode.data = translatedText;
      }
      // 记录当前（可能已翻译后的）文本，后续变更时再处理
      textNodeCache.set(rootNode, rootNode.data);
      return;
    }

    // 元素节点：先翻译属性，再遍历子节点 & shadowRoot
    if (rootNode.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(rootNode);

      // 如果这是一个 Web Component，且有开放的 shadowRoot，则也需要翻译其中内容
      if (rootNode.shadowRoot) {
        // 确保对 shadowRoot 也挂上 MutationObserver，处理后续动态变化
        observeRoot(rootNode.shadowRoot);
        traverseNode(rootNode.shadowRoot);
      }

      const childNodes = rootNode.childNodes;
      if (!childNodes || childNodes.length === 0) return;

      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];

        // 对于子元素，再次检查忽略区域（包括描述 Tab 的细粒度规则）
        if (child.nodeType === Node.ELEMENT_NODE && shouldIgnoreElement(child)) {
          continue;
        }
        traverseNode(child);
      }
    }
  }

  /**
   * 翻译页面标题
   * 仅做完整匹配，避免破坏带游戏名/模组名的标题
   */
  function translateTitle() {
    if (!document || !document.title) return;
    const original = document.title;
    const translated = translateText(original);
    if (translated !== original) {
      document.title = translated;
    }
  }

  /**
   * 补丁：强制修正顶部导航里的 Shadow DOM Upload 按钮
   * 目标：<upload-modal-button> 组件内部的 <span>Upload</span> → "上传"
   * 说明：
   * - 有时该组件使用 Declarative Shadow DOM / 异步挂载，常规遍历可能错过；
   * - 这里直接遍历所有 upload-modal-button 的 shadowRoot，按字典翻译一次文本。
   */
  const patchedUploadHosts = new WeakSet();

  function patchUploadButtons() {
    try {
      const hosts = document.querySelectorAll('upload-modal-button');
      if (!hosts || hosts.length === 0) return;

      hosts.forEach((host) => {
        if (patchedUploadHosts.has(host)) return;
        const sr = host.shadowRoot;
        if (!sr) return;

        const spans = sr.querySelectorAll('span');
        spans.forEach((span) => {
          const original = span.textContent;
          const norm = normalizeText(original || '');
          if (!norm || norm.length > CONFIG.MAX_TEXT_LENGTH) return;

          // 只处理简单的按钮文案，避免误伤其它长文本
          if (norm === 'Upload') {
            const translated = translateText(norm);
            if (translated && translated !== norm) {
              span.textContent = translated;
              patchedUploadHosts.add(host);
            }
          }
        });
      });
    } catch (e) {
      console.warn('NexusMods 中文化插件：Upload 按钮补丁失败', e);
    }
  }

  /**
   * 补丁：修正顶部全站搜索组件 quick-search 内的 “Search” 文案
   * 该组件使用 Shadow DOM 渲染，某些浏览器 / 加载时机下通用遍历可能会错过初始文本，
   * 这里做一次定向兜底，确保按钮文字会被翻译。
   */
  const patchedQuickSearchHosts = new WeakSet();

  function patchQuickSearchComponents() {
    try {
      const hosts = document.querySelectorAll('quick-search');
      if (!hosts || hosts.length === 0) return;

      hosts.forEach((host) => {
        const sr = host.shadowRoot;
        if (!sr) return;

        // 为该 host 打上已处理标记，避免高频重复遍历
        if (patchedQuickSearchHosts.has(host)) {
          return;
        }

        // 1) 修正按钮上的 “Search” 文案
        const spans = sr.querySelectorAll('span');
        spans.forEach((span) => {
          const original = span.textContent;
          const norm = normalizeText(original || '');
          if (!norm || norm.length > CONFIG.MAX_TEXT_LENGTH) return;

          if (norm === 'Search') {
            const translated = translateText(norm);
            if (translated && translated !== norm) {
              span.textContent = translated;
            }
          }
        });

        // 2) 补一次属性翻译（占位符等），用于兜底 placeholder / aria-label
        const attrTargets = sr.querySelectorAll('input, button');
        attrTargets.forEach((el) => {
          translateElementAttributes(el);
        });

        patchedQuickSearchHosts.add(host);
      });
    } catch (e) {
      console.warn('NexusMods 中文化插件：quick-search 组件补丁失败', e);
    }
  }

  /**
   * 监听 DOM 变化 & URL 变化
   */
  function watchUpdate() {
    if (document.body) {
      observeRoot(document.body);
      hideAds(document.body);
      // 补丁：初次挂载时尝试修正 Upload 按钮
      patchUploadButtons();
      // 补丁：初次挂载时尝试修正 quick-search 搜索按钮
      patchQuickSearchComponents();
    } else {
      // 兜底：等待 body 出现后再开始监听
      const intervalId = setInterval(() => {
        if (document.body) {
          clearInterval(intervalId);
          observeRoot(document.body);
          // 初次翻译
          updatePageConfig('body 就绪');
          // 补丁：body 就绪后再修正一次 Upload 按钮
          patchUploadButtons();
          // 补丁：body 就绪后再修正一次 quick-search 搜索按钮
          patchQuickSearchComponents();
        }
      }, 50);
    }
  }

  /**
   * 兼容旧账号页面顶部标签栏（如 Security / Billing）
   * 这些标签使用 <ul class="nav nav-old"> 结构，点击后页面内容更新但有时翻译不及时。
   * 这里在捕获到点击这些标签时，稍作延迟后对整页再跑一遍翻译。
   */
  function watchOldNavTabs() {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target;
        if (!target || !(target instanceof Element)) return;

        const navLink = target.closest('.nav.nav-old .nav-link');
        if (!navLink) return;

        // 给页面一点时间完成内容切换，再进行翻译
        setTimeout(() => {
          if (document.body) {
            traverseNode(document.body);
          }
          translateTitle();
        }, 80);

        // 再在短时间内多次重跑翻译，防止站点脚本后续覆盖文本导致“闪一下又变回英文”
        let rerunCount = 0;
        const maxRerun = 5; // 最多额外执行 5 次
        const intervalId = setInterval(() => {
          if (document.body) {
            traverseNode(document.body);
          }
          translateTitle();
          rerunCount += 1;
          if (rerunCount >= maxRerun) {
            clearInterval(intervalId);
          }
        }, 250);
      },
      true // 捕获阶段，以免被站点自己的事件提前阻止
    );
  }

  /**
   * 监听表单提交，确保提交后的内容更新能被正确翻译
   * 修复验证码错误等表单提交后翻译失效的问题
   */
  function watchFormSubmissions() {
    document.addEventListener(
      'submit',
      (event) => {
        // 给页面时间处理表单提交和更新内容
        setTimeout(() => {
          if (document.body) {
            traverseNode(document.body);
            hideAds(document.body);
          }
          translateTitle();
        }, 100);

        // 多次重试翻译，确保动态加载的内容也能被翻译
        let rerunCount = 0;
        const maxRerun = 3;
        const intervalId = setInterval(() => {
          if (document.body) {
            traverseNode(document.body);
          }
          rerunCount += 1;
          if (rerunCount >= maxRerun) {
            clearInterval(intervalId);
          }
        }, 300);
      },
      true // 捕获阶段
    );
  }

  /**
   * 监听站内链接点击，确保页面跳转后能正确翻译
   * 适用于所有通过链接触发的页面跳转场景
   */
  function watchInternalLinks() {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target;
        if (!target) return;

        // 检查是否点击了链接
        const link = target.closest('a');
        if (!link || !link.href) return;

        // 只处理站内链接（nexusmods.com 或 users.nexusmods.com）
        try {
          const linkUrl = new URL(link.href);
          const currentHost = window.location.hostname;
          
          // 检查是否是 Nexus Mods 站内链接
          const isNexusModsLink = linkUrl.hostname.includes('nexusmods.com');
          const isSameHost = linkUrl.hostname === currentHost;
          
          if (!isNexusModsLink && !isSameHost) return;
          
          // 检查是否是页面内锚点跳转（不需要翻译）
          if (linkUrl.pathname === window.location.pathname && linkUrl.hash) return;

        } catch (e) {
          // URL 解析失败，可能是相对路径，继续处理
        }

        // 检测到站内链接点击，延迟后强制翻译
        // 使用多个不同的延迟时间，确保能捕获到页面内容
        const delays = [100, 300, 500, 800, 1200];
        
        delays.forEach((delay) => {
          setTimeout(() => {
            // 强制重置节流时间戳，确保翻译能够执行
            lastUrlTranslateAt = 0;
            updatePageConfig('站内链接跳转');
            if (document.body) {
              traverseNode(document.body);
              hideAds(document.body);
            }
            translateTitle();
          }, delay);
        });
      },
      true // 捕获阶段
    );
  }

  /**
   * Hook History API，监听 SPA 应用的路由变化
   * 确保使用 pushState/replaceState 的页面跳转也能正确翻译
   */
  function hookHistoryAPI() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    function afterHistoryChange() {
      // 使用多个延迟时间进行翻译重试
      const delays = [50, 150, 300, 600];
      
      delays.forEach((delay) => {
        setTimeout(() => {
          lastUrlTranslateAt = 0;
          updatePageConfig('History API 变化');
          if (document.body) {
            traverseNode(document.body);
            hideAds(document.body);
          }
          translateTitle();
        }, delay);
      });
    }

    history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      afterHistoryChange();
      return result;
    };

    history.replaceState = function(...args) {
      const result = originalReplaceState.apply(this, args);
      afterHistoryChange();
      return result;
    };

    // 监听 popstate 事件（浏览器前进/后退按钮）
    window.addEventListener('popstate', () => {
      afterHistoryChange();
    });
  }

  /**
   * 在 Tampermonkey 菜单中提供简单的配置入口（目前只暴露“广告屏蔽开关”）
   */
  function setupMenuCommands() {
    try {
      if (typeof GM_registerMenuCommand !== 'function') return;

      const label = CONFIG.BLOCK_ADS
        ? '广告屏蔽：已开启（点击关闭并刷新页面）'
        : '广告屏蔽：已关闭（点击开启并刷新页面）';

      GM_registerMenuCommand(label, () => {
        const next = !CONFIG.BLOCK_ADS;
        CONFIG.BLOCK_ADS = next;
        if (typeof GM_setValue === 'function') {
          GM_setValue(STORAGE_KEYS.BLOCK_ADS, next);
        }
        // 简单粗暴：切换配置后刷新页面，避免状态不一致
        window.location.reload();
      });
    } catch (e) {
      console.warn('NexusMods 中文化插件：注册菜单命令失败', e);
    }
  }

  /**
   * Hook attachShadow：对之后动态创建的 shadowRoot 也进行翻译和监听
   * （脚本 run-at=document-start，能在站点脚本之前生效）
   */
  if (Element.prototype.attachShadow) {
    const rawAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
      const shadowRoot = rawAttachShadow.call(this, init);
      // 仅观察新创建的 shadowRoot，等其内容挂载后再由 MutationObserver 统一处理
      observeRoot(shadowRoot);
      return shadowRoot;
    };
  }

  /**
   * Nexus Mods 直接下载功能（合并自 `Nexus Mods 直接下载.js`）
   * 跳过选择 "Slow Download" / "Fast Download" 的界面
   */
  async function download(e) {
    try {
      e.preventDefault();
      const params = new URL(this.href).searchParams;
      if (params.get('nmm') == '1') {
        const response = await fetch(this.href);
        const text = await response.text();
        const url = text.match(/nxm:\/\/[^'"]+/)[0];
        location.href = url;
      } else {
        const form = new FormData();
        form.append('fid', params.get('file_id'));
        form.append('game_id', PAGE_WINDOW.current_game_id);
        const response = await fetch('https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl', {
          method: 'POST',
          body: form
        });
        const data = await response.json();
        location.href = data.url;
      }
    } catch (e2) {
      console.exception(e2);
      location.href = this.href;
    }
  }

  function waitForClass(el, className) {
    // 如果元素不存在或没有 classList，直接视为已完成，避免报错
    if (!el || !el.classList) {
      return Promise.resolve();
    }
    if (el.classList.contains(className)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const observer = new MutationObserver((muts) => {
        for (const mut of muts) {
          if (mut.attributeName === 'class' && el.classList && el.classList.contains(className)) {
            observer.disconnect();
            return resolve();
          }
        }
      });
      observer.observe(el, { attributes: true });
    });
  }

  async function processDialog(el) {
    if (!(el instanceof Element)) {
      return;
    }
    if (!el.classList.contains('mfp-wrap')) {
      return;
    }
    const container = el.querySelector('.mfp-container');
    if (!container) {
      return;
    }
    await waitForClass(container, 'mfp-s-ready');
    const btn = container.querySelector('.widget-mod-requirements .btn');
    if (btn) {
      btn.addEventListener('click', download);
    }
  }

  function setupDirectDownload() {
    try {
      if (!PAGE_WINDOW.USER_ID) {
        return;
      }

      const icons = [
        ...document.querySelectorAll('.icon-manual'),
        ...document.querySelectorAll('.icon-nmm')
      ];
      for (const icon of icons) {
        const el = icon.parentElement;
        if (!el) continue;
        if (!el.classList.contains('popup-btn-ajax')) {
          el.addEventListener('click', download);
        }
      }

      const nmmBtn = document.querySelector('#action-nmm .btn');
      if (nmmBtn && !nmmBtn.classList.contains('popup-btn-ajax')) {
        nmmBtn.addEventListener('click', download);
      }

      const observer = new MutationObserver((muts) => {
        for (const mut of muts) {
          for (const node of mut.addedNodes) {
            processDialog(node);
          }
        }
      });
      if (document.body) {
        observer.observe(document.body, { childList: true });
      }
    } catch (e) {
      console.warn('NexusMods 中文化插件：初始化直接下载功能失败', e);
    }
  }

  /**
   * 初始化
   */
  function init() {
    // 从存储中加载用户配置（例如是否屏蔽广告）
    loadConfigFromStorage();

    // 设置文档语言为中文
    document.documentElement.lang = CONFIG.LANG;

    // 初次配置与翻译
    updatePageConfig('首次载入');
    // 对初次加载的页面做一次遍历翻译，保证即使 pageType 为 null 也能应用 public 词条
    if (document.body) {
      traverseNode(document.body);
      hideAds(document.body);
      // 补丁：强制修正一次 Upload 按钮（Shadow DOM）
      patchUploadButtons();
    }
    translateTitle();

    // Hook History API，监听 SPA 路由变化
    hookHistoryAPI();
    // 监视 DOM 更新
    watchUpdate();
    // 兼容旧账号页面标签栏（Security / Billing 等）
    watchOldNavTabs();
    // 监听表单提交事件
    watchFormSubmissions();
    // 监听站内链接点击
    watchInternalLinks();
    // 启用 Nexus Mods 直接下载功能
    setupDirectDownload();
    // 注册脚本菜单
    setupMenuCommands();
  }

  // DOMContentLoaded 之后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);


