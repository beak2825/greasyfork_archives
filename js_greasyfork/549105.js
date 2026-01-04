// ==UserScript==
// @name         学堂在线 | 心跳式重启：硬等10秒 + 全日志 + 连续页面生效
// @namespace    https://www.xuetangx.com/
// @version      5.1.1
// @description  当作普通网页处理：每次URL变化都重启流程；每页先等10秒；/video/ 等完再下一页；/exercise/、/article/、/discussion/ 直接下一页；全步骤控制台日志（更稳健的“下一页”定位）
// @match        https://www.xuetangx.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549105/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%20%7C%20%E5%BF%83%E8%B7%B3%E5%BC%8F%E9%87%8D%E5%90%AF%EF%BC%9A%E7%A1%AC%E7%AD%8910%E7%A7%92%20%2B%20%E5%85%A8%E6%97%A5%E5%BF%97%20%2B%20%E8%BF%9E%E7%BB%AD%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549105/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%20%7C%20%E5%BF%83%E8%B7%B3%E5%BC%8F%E9%87%8D%E5%90%AF%EF%BC%9A%E7%A1%AC%E7%AD%8910%E7%A7%92%20%2B%20%E5%85%A8%E6%97%A5%E5%BF%97%20%2B%20%E8%BF%9E%E7%BB%AD%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%95%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TAG = '[XT-Auto]';
  const START_DELAY_MS = 10_000;          // 每页硬等 10 秒
  const URL_HEARTBEAT_MS = 1000;          // URL 心跳检测间隔
  const TIME_SELECTOR = '#qa-video-wrap > div > xt-wrap > xt-controls > xt-inner > xt-time';

  // —— 新：多选择器覆盖不同页面结构（含讨论页更深层级）——
  const NEXT_SELECTORS = [
    // 讨论页提供的路径（更深一层）
    '#app > div > div.app-main_.appMain > div.courseActionLesson > div.lesson_rightcon > div > div > div > div.control > p.next',
    // 旧结构（练习/视频常见）
    '#app > div > div.app-main_.appMain > div.courseActionLesson > div.lesson_rightcon > div > div.control > p.next',
    // 兜底范围更广的选择器
    'div.control p.next',
    'p.next',
    'a.next',
    'button.next',
    'a[rel="next"]'
  ];

  // 视频检测
  const TIME_FIND_TIMEOUT_MS = 60_000;
  const TIME_FIND_POLL_MS = 500;
  const INTERVAL_MS = 600;
  const TOLERANCE_S = 1;
  const CONFIRM_TIMES = 2;

  // “下一页”点击策略
  const NEXT_MAX_TRIES = 5;
  const NEXT_RETRY_GAP_MS = 1000;

  // 需直接跳过的路径
  const SKIP_PATH_RE = /(\/exercise\/|\/article\/|\/discussion\/)/i;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function parseTimeSec(txt) {
    if (!txt) return NaN;
    const a = txt.trim().split(':').map(Number);
    if (a.some(isNaN)) return NaN;
    if (a.length === 3) return a[0]*3600 + a[1]*60 + a[2];
    if (a.length === 2) return a[0]*60 + a[1];
    return Number(a[0]) || NaN;
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0;
  }
  function isDisabled(el) {
    return el?.hasAttribute?.('disabled')
      || el?.getAttribute?.('aria-disabled') === 'true'
      || /\b(disable|disabled)\b/i.test(el?.className || '');
  }

  // —— 新：更稳健地查找“下一页”按钮/链接 —— 
  function findNextElement() {
    // 1) 逐个候选选择器查找
    for (const sel of NEXT_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) {
        // 若 p.next 里面包了 <a>，优先返回可点击的 <a>
        const a = el.querySelector?.('a[href]') || el;
        if (isVisible(a) && !isDisabled(a)) return a;
      }
    }
    // 2) 兜底：全局搜含 next 的 class 或带“下一页”文案的可点元素
    const candidates = Array.from(document.querySelectorAll('a,button,p,div,span'))
      .filter(n => isVisible(n) && !isDisabled(n));
    const byClass = candidates.find(n => /\bnext\b/i.test(n.className || ''));
    if (byClass) return byClass.querySelector?.('a[href]') || byClass;

    const byText = candidates.find(n => (n.textContent || '').trim().includes('下一页'));
    if (byText) return byText.querySelector?.('a[href]') || byText;

    // 3) 再兜底：寻找拥有 rel="next" 的链接
    const relNext = document.querySelector('a[rel="next"]');
    if (relNext && isVisible(relNext) && !isDisabled(relNext)) return relNext;

    return null;
  }

  async function tryClickNextMulti() {
    for (let i = 1; i <= NEXT_MAX_TRIES; i++) {
      const el = findNextElement();
      console.log(TAG, `定位“下一页”（${i}/${NEXT_MAX_TRIES}）：`, el);

      if (!el) { await sleep(NEXT_RETRY_GAP_MS); continue; }

      // 可点击链接优先
      const link = el.tagName === 'A' ? el : el.querySelector?.('a[href]');
      if (link && isVisible(link) && !isDisabled(link)) {
        console.log(TAG, '点击 <a>：', link.href);
        link.scrollIntoView({ block: 'center', inline: 'center' });
        link.click();
        return true;
      }

      // 否则对元素本体点击 + MouseEvent
      if (isVisible(el) && !isDisabled(el)) {
        console.log(TAG, '对元素执行 .click() + MouseEvent');
        el.scrollIntoView({ block: 'center', inline: 'center' });
        try { el.click(); } catch (e) { console.log(TAG, 'click() 异常：', e); }
        const ok = el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        console.log(TAG, 'MouseEvent dispatch 结果 =', ok);
        // 若元素带 href（如 <p href> 的极端情况），也尝试跳转
        const href = el.getAttribute?.('href');
        if (href) { console.log(TAG, '元素带 href，location.assign：', href); location.assign(href); }
        return true;
      }

      console.log(TAG, '暂不可点，等待后重试…');
      await sleep(NEXT_RETRY_GAP_MS);
    }
    console.log(TAG, '多次尝试后仍未能点击“下一页”，放弃。');
    return false;
  }

  async function findTimeWrapLimited() {
    const start = Date.now();
    while (Date.now() - start < TIME_FIND_TIMEOUT_MS) {
      const el = document.querySelector(TIME_SELECTOR);
      if (el) { console.log(TAG, '找到时间条元素：', el); return el; }
      console.log(TAG, '未找到时间条，', TIME_FIND_POLL_MS, 'ms 后重试…');
      await sleep(TIME_FIND_POLL_MS);
    }
    return null;
  }

  // —— 单次页面流程 —— 
  let videoPollTimer = null;
  async function runOnceForCurrentPage() {
    const href = location.href;
    const onVideo = /\/video\//i.test(location.pathname);
    const onSkip = SKIP_PATH_RE.test(location.pathname); // exercise/article/discussion

    console.log(TAG, '开始处理页面：', href);
    console.log(TAG, '硬性等待', START_DELAY_MS, 'ms…');
    await sleep(START_DELAY_MS);

    if (onSkip) {
      console.log(TAG, '识别为可跳过页面（/exercise/ | /article/ | /discussion/）→ 点击“下一页”。');
      await tryClickNextMulti();
      return;
    }

    if (onVideo) {
      console.log(TAG, '识别为视频页：/video/ → 查找时间条并等待播放完。');
      const timeWrap = await findTimeWrapLimited();
      if (!timeWrap) { console.log(TAG, '超时仍未找到时间条。谨慎起见不跳转。'); return; }

      let hits = 0;
      clearInterval(videoPollTimer);
      videoPollTimer = setInterval(async () => {
        const spans = timeWrap.querySelectorAll('span');
        if (spans.length < 2) { console.log(TAG, '时间条结构异常（span < 2），跳过本次。'); return; }
        const curTxt = (spans[0].textContent || '').trim();
        const totTxt = (spans[1].textContent || '').trim();
        const cur = parseTimeSec(curTxt);
        const tot = parseTimeSec(totTxt);
        console.log(TAG, `轮询：当前=${curTxt}(${cur}s) / 总=${totTxt}(${tot}s)`);

        if (!isFinite(cur) || !isFinite(tot) || tot <= 0) { console.log(TAG, '时间解析异常，跳过。'); return; }

        const reached = cur >= Math.max(0, tot - TOLERANCE_S);
        console.log(TAG, '是否达成结束条件（含容差）=', reached, ' 连续命中=', reached ? (hits + 1) : 0, '/', CONFIRM_TIMES);

        if (reached) {
          hits++;
          if (hits >= CONFIRM_TIMES) {
            console.log(TAG, '播放结束，点击“下一页”。');
            clearInterval(videoPollTimer);
            await tryClickNextMulti();
          }
        } else {
          hits = 0;
        }
      }, INTERVAL_MS);

      return;
    }

    console.log(TAG, '既非 /video/ 也非 /exercise/ /article/ /discussion/，本页不操作。');
  }

  // —— 心跳监控 —— 
  let lastUrl = location.href;
  let running = false;

  function resetState() {
    console.log(TAG, '重置状态：清理轮询定时器。');
    clearInterval(videoPollTimer);
    videoPollTimer = null;
    running = false;
  }

  async function ensureRunner() {
    if (running) return;
    running = true;
    try {
      await runOnceForCurrentPage();
    } catch (e) {
      console.log(TAG, '运行异常：', e);
    } finally {
      console.log(TAG, '本轮处理结束，等待 URL 变化触发下一轮。');
    }
  }

  console.log(TAG, '脚本启动。初始 URL =', lastUrl);
  ensureRunner();

  setInterval(() => {
    const now = location.href;
    if (now !== lastUrl) {
      console.log(TAG, '检测到 URL 变化：', lastUrl, '→', now);
      lastUrl = now;
      resetState();
      ensureRunner();
    }
  }, URL_HEARTBEAT_MS);

  window.addEventListener('beforeunload', resetState);
})();