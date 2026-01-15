// ==UserScript==
// @name         Fast Translate (from Chrome Extension)
// @namespace    fast-translate
// @version      1.1.0
// @description  X.com 沉浸式翻译 Converted from Chrome Extension
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/562527/Fast%20Translate%20%28from%20Chrome%20Extension%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562527/Fast%20Translate%20%28from%20Chrome%20Extension%29.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ===== utils.js ===== */
// utils.js


// 简易语言检测（仅判断是否为英文）
function isEnglish(text) {
  if (!text || text.length < 5) return false;
  const enCharRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
  return enCharRatio > 0.7;
}

// 判断是否为"单个英文单词"
function isSingleEnglishWord(text) {
  const trimmed = text.trim();
  if (trimmed.split(/\s+/).length !== 1) return false;
  return /^[a-zA-Z]+$/.test(trimmed) && trimmed.length >= 2;
}

// 1. 查词典（仅英文单词）
async function fetchWordDefinition(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    if (res.ok) return (await res.json())[0];
  } catch {}
  return null;
}

// 2. Bing 翻译（句子/短语）
async function translateWithBing(text, to = 'zh-Hans') {
  const url = `https://cn.bing.com/ttranslatev3?fromLang=auto-detect&to=${to}&text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.translations?.[0]?.text || '[翻译失败]';
  } catch (e) {
    console.error('Bing 翻译失败:', e);
    return '[网络错误，请重试]';
  }
}

// 3. 智能路由主函数
async function smartTranslate(text) {
  if (isSingleEnglishWord(text)) {
    const dict = await fetchWordDefinition(text);
    if (dict) {
      return { type: 'word', data: dict };
    }
  }
  // 回退到句子翻译
  const translation = await translateWithBing(text);
  return { type: 'sentence', data: translation };
}

// 安全地在文本节点后插入翻译
function insertTranslationAfter(node, translatedText) {
  if (!node.parentNode) return;

  // 避免重复插入
  if (node.nextSibling?.classList?.contains('my-translated-text')) return;

  const transDiv = document.createElement('div');
  transDiv.className = 'my-translated-text';
  transDiv.textContent = translatedText;
  node.parentNode.insertBefore(transDiv, node.nextSibling);
}
/* ===== content.js ===== */

/* ===== style.css ===== */
GM_addStyle(`
/* style.css */
.my-translated-text {
  color: #2563eb;
  font-size: 0.95em;
  margin-top: 4px;
  line-height: 1.4;
  border-left: 2px solid #dbeafe;
  padding-left: 8px;
  font-family: sans-serif;
}
`);
// content.js - 优化稳定版：开关控制 + 整块插入式翻译 + 划词翻译 + 域名设置持久化 + 懒加载
//缓存对象, 避免反复调接口翻译
const translationCache = new Map();

let TARGET_LANG = 'zh-CN'; // 默认中文
let isTranslateEnabled = GM_getValue('kt_enabled', true);
 // 默认关闭翻译
let translationClass = 'kt-translation'; // 统一翻译类名
const STORAGE_KEY = `domain:${location.hostname}`; // 域名特定存储键
let isTranslating = false; // 全局锁，防止并发翻译

// ===== 翻译判断和工具函数 =====
function markNeverTranslate(el) {
  if (!el) return;
  el.dataset.ktNoTranslate = 'true';
  io.unobserve(el);
}

function shouldTranslate(text) {
  if (!text || text.length < 2) return false;
  if (TARGET_LANG.startsWith('zh')) {
    if (/[\u4e00-\u9fa5]/.test(text)) return false;
  }
  if (TARGET_LANG.startsWith('en')) {
    if (isEnglish(text)) return false;
  }
  return true;
}
function isInlineDangerous(el) {
  return el.tagName === 'A' || el.tagName === 'SPAN';
}
//禁止翻译标题菜单等布局元素
function isInForbiddenLayout(el) {
  return el.closest(
    'header, nav, footer, menu, [role="navigation"], [role="banner"]'
  );
}
function isComplexHeading(el) {
  if (!/^H[1-6]$/.test(el.tagName)) return false;

  // 含有 a / svg / button / span 等结构
  return el.querySelector('a, svg, button, .anchor-link');
}


function isRichParagraph(el) {
  if (!el || el.tagName !== 'P') return false;
  // p 里包含 a / span / strong 等行内元素
  return el.querySelector('a, span, em, strong, code');
}
function isXTargetDiv(el) {
  if (!el || el.tagName !== 'DIV') return false;

  const classList = el.className;
  if (!classList) return false;

  const targets = [
    'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1inkyih r-16dba41 r-bnwqim r-135wba7',
    'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim',
    'public-DraftStyleDefault-block public-DraftStyleDefault-ltr',
    'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-uho16t r-1vr29t4 r-1o37s4c r-1s2bzr4',
    'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1inkyih r-rjixqe r-1vr29t4 r-5oul0u',
    'css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-1udbk01 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41',
    'css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-1udbk01 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim r-14gqq1x'
  ];

  return targets.some(t =>
    t.split(' ').every(cls => classList.includes(cls))
  );
}


function isEnglish(text) {
  if (!text || text.length < 5) return false;
  const ratio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
  return ratio > 0.7;
}

function isSingleEnglishWord(text) {
  const trimmed = text.trim();
  if (trimmed.split(/\s+/).length !== 1) return false;
  return /^[a-zA-Z]+$/.test(trimmed) && trimmed.length >= 2;
}

async function fetchWordDefinition(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TranslationPlugin)' }
    });
    if (res.ok) return (await res.json())[0];
  } catch (error) {
    console.error('词典查询失败:', error);
  }
  return null;
}

async function translateWithGoogle(text) {
  const url = 'https://translate.googleapis.com/translate_a/single' +
    '?client=gtx&sl=auto&tl=' + TARGET_LANG + '&dt=t&q=' + encodeURIComponent(text);
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join('');
  } catch (e) {
    console.warn('翻译失败:', e);
    return '';
  }
}

async function smartTranslate(text) {
  if (isSingleEnglishWord(text)) {
    const dict = await fetchWordDefinition(text);
    if (dict) return { type: 'word', data: dict };
  }
  const translation = await translateWithGoogle(text);
  return { type: 'sentence', data: translation };
}

// ===== 悬浮窗功能（划词翻译） =====
let popupElement = null;
let debounceTimer = null;

function createPopup() {
  if (popupElement) popupElement.remove();
  popupElement = document.createElement('div');
  popupElement.id = 'my-translate-popup';
  popupElement.innerHTML = `
    <style>
  #my-translate-popup {
    position: fixed;
    z-index: 999999999 !important;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,.6);
    padding: 12px;
    max-width: 320px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    color: #e5e7eb;
    line-height: 1.6;
    display: none;
    min-width: 160px;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    color: #38bdf8;
  }

  .close-btn {
    cursor: pointer;
    color: #94a3b8;
  }

  .word {
    font-size: 16px;
    font-weight: bold;
    color: #f8fafc;
  }

  .phonetic {
    font-size: 13px;
    color: #94a3b8;
  }

  .pos {
    margin-top: 6px;
    color: #60a5fa;
    font-weight: bold;
  }

  .definition {
    margin-left: 10px;
    font-size: 13px;
    color: #cbd5f5;
  }

  .example {
    margin-left: 10px;
    font-size: 13px;
    color: #94a3b8;
    font-style: italic;
  }

  .translation {
    margin-top: 8px;
    color: #22d3ee;
  }

  .loading {
    color: #94a3b8;
    font-style: italic;
  }
</style>

    <div class="popup-header"><span>翻译</span><span class="close-btn">✕</span></div>
    <div class="loading">查询中...</div>
  `;
  document.body.appendChild(popupElement);
  popupElement.querySelector('.close-btn')?.addEventListener('click', hidePopup);
}

function getSelectionRect() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  return sel.getRangeAt(0).getBoundingClientRect();
}

function showPopup(x, y, content) {
  if (!popupElement) createPopup();
  popupElement.style.display = 'block';
  popupElement.style.left = `${x + 10}px`;
  popupElement.style.top = `${y + 10}px`;
  const rect = popupElement.getBoundingClientRect();
  if (rect.right > window.innerWidth) popupElement.style.left = `${window.innerWidth - rect.width - 10}px`;
  if (rect.bottom > window.innerHeight) popupElement.style.top = `${window.innerHeight - rect.height - 20}px`;
  popupElement.innerHTML = popupElement.innerHTML.split('</style>')[0] + '</style>' + content;
}

function hidePopup() {
  if (popupElement) popupElement.style.display = 'none';
}

async function buildPopupContent(text) {
  const result = await smartTranslate(text);
  let html = `<div class="word">${text}</div>`;
  if (result.type === 'word') {
    const def = result.data;
    const zh = await translateWithGoogle(text);
    html += `<div class="translation">中文：${zh}</div>`;
    const phonetic = def.phonetics.find(p => p.text)?.text;
    if (phonetic) html += `<div class="phonetic">${phonetic}</div>`;
    for (const meaning of def.meanings.slice(0, 2)) {
      html += `<div class="pos">${meaning.partOfSpeech}</div>`;
      for (const d of meaning.definitions.slice(0, 2)) {
        html += `<div class="definition">• ${d.definition}</div>`;
        if (d.example) html += `<div class="example">"${d.example}"</div>`;
      }
    }
  } else {
    html += `<div class="translation">${result.data}</div>`;
  }
  return html;
}

document.addEventListener('mouseup', (e) => {
  const sel = window.getSelection().toString().trim();
  if (!sel || sel.length < 2 || !shouldTranslate(sel)) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const rect = getSelectionRect();
    if (!rect) return;
    try {
      if (!popupElement) createPopup();
      showPopup(rect.left, rect.bottom, `<div class="word">${sel}</div><div class="loading">翻译中...</div>`);
      const content = await buildPopupContent(sel);
      showPopup(rect.left, rect.bottom, content);
    } catch (error) {
      console.error('划词翻译错误:', error);
      showPopup(rect.left, rect.bottom, `<div class="word">${sel}</div><div class="loading">翻译服务暂时不可用</div>`);
    }
  }, 300);
});

document.addEventListener('mousedown', (e) => {
  if (popupElement && !popupElement.contains(e.target)) hidePopup();
});

// ===== 页面翻译功能 =====
function injectTranslationStyle() {
  if (document.getElementById('kt-translation-style')) return;
  const style = document.createElement('style');
  style.id = 'kt-translation-style';
  style.textContent = `
    .${translationClass} {
      display: block;
      margin: 8px 0 12px 0;
      padding-left: 12px;
      border-left: 4px solid #4f46e5;
      opacity: 0.95;
      white-space: pre-wrap;
      color: #333;
    }
  `;
  style.textContent += `
  .${translationClass}.loading {
    color: #888;
    font-style: italic;
    position: relative;
  animation: kt-pulse 1.4s infinite;
  }

  @keyframes kt-pulse {
    0% { opacity: .4; }
    50% { opacity: 1; }
    100% { opacity: .4; }
  }

  .${translationClass}.error {
    color: #ef4444;
    font-style: italic;
  }
`;

  document.head.appendChild(style);
}
function applyTranslationStyle(transDiv, el) {
  const originalStyle = window.getComputedStyle(el);

  Object.assign(transDiv.style, {
    fontFamily: originalStyle.fontFamily,
    fontSize: originalStyle.fontSize,
    fontWeight: originalStyle.fontWeight,
    fontStyle: originalStyle.fontStyle,
    color: originalStyle.color, // ⭐ 关键：恢复正确颜色
    textAlign: originalStyle.textAlign,
    lineHeight: originalStyle.lineHeight,
    letterSpacing: originalStyle.letterSpacing,
    wordSpacing: originalStyle.wordSpacing,
    backgroundColor: 'transparent' // ⭐ 防止 X.com 深色背景污染
  });
}


async function translateElement(el) {
  // ===== 全局开关 =====
  if (!isTranslateEnabled) return;

  // ===== 已翻译 / 正在翻译直接退出 =====
  if (el.dataset.ktTranslated === 'true' || el.dataset.ktTranslating === 'true') {
    return;
  }
  // ⭐⭐⭐【1】X.com 正文 div —— 放行（最高优先级）
  const isX = location.hostname === 'x.com' || location.hostname === 'twitter.com';
  const isXText = isX && isXTargetDiv(el);

  // ⭐⭐⭐ X 的正文 div：直接放行，且【不再】进入 forbidden 判断
  if (!isXText) {

    // 🚫 布局禁区（header / nav 等）
    if (isInForbiddenLayout(el)) {
      markNeverTranslate(el);
      return;
    }

    // 🚫 复杂标题
    if (isComplexHeading(el)) {
      markNeverTranslate(el);
      return;
    }
  }

  // 👇 只取“直接文本节点”
  let text;

  if (isXText) {
    // X：用 innerText，连起来翻译
    text = el.innerText.trim();
  } else {
    // 普通站点：只取直接文本
    text = Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent.trim())
      .join(' ');
  }


  if (!text || text.length < 2 || !shouldTranslate(text)) {
    return;
  }

  const rawText = el.textContent; // 固定文本快照
  const cacheKey = `${TARGET_LANG}|${rawText}`;

  if (!isTranslateEnabled || el.dataset.ktTranslating === 'true') return;

  //const text = el.innerText.trim();
  if (text.length < 2 || !shouldTranslate(text)) return;


  injectTranslationStyle();

  let transDiv = el.querySelector(`.${translationClass}`);
  if (!transDiv) {
    transDiv = document.createElement('div');
    transDiv.className = translationClass;
    if (isInlineDangerous(el)) {
      markNeverTranslate(el);   // ⭐ 关键
      return;
    }
    else {
      el.appendChild(transDiv);
    }

  }

  // ===== 命中缓存：纯静态恢复（无动画）=====
  if (translationCache.has(cacheKey)) {
    transDiv.textContent = translationCache.get(cacheKey);
    transDiv.classList.remove('loading', 'error');
    applyTranslationStyle(transDiv, el);
    el.dataset.ktTranslated = 'true';
    return;
  }

  // ===== 首次翻译 =====
  el.dataset.ktTranslating = 'true'; // 🔒 防止重复进入

  transDiv.textContent = '⏳ 正在翻译…';
  transDiv.classList.add('loading');
  transDiv.classList.remove('error');

  try {
    const translated = await translateWithGoogle(text);
    if (!translated || translated === text) {
      transDiv.remove();
      return;
    }

    translationCache.set(cacheKey, translated);

    transDiv.textContent = translated;
    transDiv.classList.remove('loading');

    applyTranslationStyle(transDiv, el);

    el.dataset.ktTranslated = 'true';
  } catch (e) {
    transDiv.textContent = '⚠ 翻译失败';
    transDiv.classList.remove('loading');
    transDiv.classList.add('error');
  } finally {
    delete el.dataset.ktTranslating;
  }
}





function removeAllTranslations() {
  document.querySelectorAll(`.${translationClass}, .kt-translation-box, .kt-translate-block`).forEach(el => el.remove());

  document
    .querySelectorAll(`.${translationClass}`)
    .forEach(el => el.remove());
}

// ===== 懒加载观察器（滚动可见时翻译） =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && isTranslateEnabled) {
      translateElement(entry.target);
      io.unobserve(entry.target); // 翻译后停止观察
    }
  });
}, {
  rootMargin: '300px 0px', // ⭐ 提前 300px
  threshold: 0.1
}); // 10% 可见时触发

// ===== 动态内容观察（MutationObserver） =====
let mutationDebounceTimer = null;
const mutationObserver = new MutationObserver(() => {
  if (!isTranslateEnabled) return;
  if (mutationDebounceTimer) clearTimeout(mutationDebounceTimer);
  mutationDebounceTimer = setTimeout(scanAndObserveElements, 50); //滚动到位置,马上翻译 等50ms
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// ===== 扫描并观察元素 =====
function scanAndObserveElements() {
  injectTranslationStyle();
  let selectors;
  if (location.hostname === 'x.com' || location.hostname === 'twitter.com') {

    // X 专用：只处理指定 class 的 div
    document.querySelectorAll('div').forEach(el => {
      if (
        isXTargetDiv(el) &&
        el.dataset.ktTranslated !== 'true' &&
        !el.querySelector(`.${translationClass}`)
      ) {
        io.observe(el);
      }
    });

    return; // ❗❗❗ 非常重要：阻断通用扫描逻辑
  }
  else {
    // 一般网站：正常选择器，优先块级元素
    selectors = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, article > section, span, a[href]'; // 调整顺序：块级优先
  }

  document.querySelectorAll(selectors).forEach(el => {
    if (el.dataset.ktNoTranslate === 'true') return; // ⭐⭐⭐

    if (isInForbiddenLayout(el)) return;
    // ===== 核心过滤逻辑 =====
    // 如果当前元素是 <a>，且它位于一个 <p> 中，并且该 <p> 是富文本段落
    // 那么跳过 <a>，由 <p> 统一翻译
    if (
      el.tagName === 'A' &&
      el.closest('p') &&
      isRichParagraph(el.closest('p'))
    ) {
      return;
    }

    if (el.dataset.ktTranslated !== 'true' && !el.querySelector(`.${translationClass}`) && !el.closest(`.${translationClass}`)) {
      const text = el.innerText.trim();
      const minLength = (el.tagName === 'A' || el.tagName === 'SPAN') ? 2 : 10; // 内联元素降低阈值
      if (text.length >= minLength && shouldTranslate(text) && el.children.length <= 5) { // 放宽子元素阈值以覆盖嵌套
        io.observe(el);
      }
    }
  });
}

// // ===== 消息监听（统一处理） =====
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'SET_TRANSLATE_STATE') {
//     isTranslateEnabled = !!message.enabled;
//     chrome.storage.local.set({ [STORAGE_KEY]: { enabled: isTranslateEnabled, lang: TARGET_LANG } });
//     if (isTranslateEnabled) {
//       scanAndObserveElements();
//     } else {
//       removeAllTranslations();
//     }
//     sendResponse({ success: true });
//   } else if (message.action === 'SET_LANGUAGE') {
//     TARGET_LANG = message.lang || 'zh-CN';
//     chrome.storage.local.set({ [STORAGE_KEY]: { enabled: isTranslateEnabled, lang: TARGET_LANG } });
//     if (isTranslateEnabled) {
//       removeAllTranslations();
//       setTimeout(scanAndObserveElements, 400);
//     }
//     sendResponse({ success: true });
//   } else if (message.action === 'AUTO_TRANSLATE') {
//     isTranslateEnabled = true;
//     scanAndObserveElements();
//   } else if (message.action === 'SET_LANG') {
//     TARGET_LANG = message.value || 'zh-CN';
//   }
//   return true;
// });

// // ===== 加载时读取存储设置并应用 =====
// chrome.storage.local.get(STORAGE_KEY, (data) => {
//   const cfg = data[STORAGE_KEY];
//   if (cfg) {
//     TARGET_LANG = cfg.lang || 'zh-CN';
//     isTranslateEnabled = !!cfg.enabled;
//     if (isTranslateEnabled) {
//       setTimeout(scanAndObserveElements, 800);
//     }
//   }
// });

GM_registerMenuCommand(
  isTranslateEnabled ? '❌ 关闭翻译' : '✅ 开启翻译',
  () => {
    const next = !isTranslateEnabled;
    GM_setValue('kt_enabled', next);
    location.reload(); // 立即生效，最稳定
  }
);


})();
