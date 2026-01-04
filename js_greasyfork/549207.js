// ==UserScript==
// @name         mjjbox起飞
// @namespace    mjjbox-auto
// @version      1.0
// @description  快速增加阅读统计
// @author       Yizong
// @match        https://mjjbox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549207/mjjbox%E8%B5%B7%E9%A3%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/549207/mjjbox%E8%B5%B7%E9%A3%9E.meta.js
// ==/UserScript==

;(function () {
  'use strict';

  /** CONFIG **/
  const TOPIC_POOL_REFRESH_MS = 10 * 60 * 1000; // 10 分钟刷新一次可用主题列表
  const CSRF_REFRESH_MS = 60 * 1000; // 1 分钟刷新一次 CSRF
  const LOOP_INTERVAL_MS = 1000; // 目标循环间隔 1 秒

  let csrfToken = null;
  let topicPool = [];

  /* Utility */
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* Fetch helpers */
  const getCSRF = async () => {
    try {
      const res = await fetch('/session/csrf', {
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      });
      const { csrf } = await res.json();
      return csrf;
    } catch {
      return null;
    }
  };

  /** 获取最新主题 ID，避免 404 */
  const refreshTopicPool = async () => {
    try {
      const res = await fetch('/latest.json');
      if (!res.ok) throw new Error('latest.json 请求失败');
      const data = await res.json();
      topicPool = data.topic_list.topics.map(t => t.id);
    } catch (e) {
      console.warn('[mjjbox] refreshTopicPool 失败', e);
    }
  };

  const pickTopicId = () => {
    if (topicPool.length) {
      return topicPool[rand(0, topicPool.length - 1)];
    }
    // 若无法获取列表则退回随机范围，可能仍触发 404
    return rand(10000, 45000);
  };

  /** 生成假帖子 ID 列表 */
  const generateFakePosts = () => {
    const start = rand(1, 300);
    const len = 6;
    return Array.from({ length: len }, (_, i) => start + i);
  };

  const makeFakeTimings = (pids, time) =>
    pids
      .map((id, idx) => `timings%5B${id}%5D=${idx === pids.length - 1 ? 1000 : time}`)
      .join('&');

  /** 主循环 */
  const loop = async () => {
    const t0 = performance.now();
    try {
      if (!csrfToken) csrfToken = await getCSRF();
      if (!csrfToken) throw new Error('无法获取 CSRF token');

      /* --- 模拟阅读主题（增加阅读主题数） --- */
      {
        const tid = pickTopicId();
        const url = `/t/${tid}/1.json?track_visit=true&forceLoad=true`;
        const res = await fetch(url, {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'discourse-logged-in': 'true',
            'discourse-present': 'true',
            'discourse-track-view': 'true',
            'discourse-track-view-topic-id': tid,
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest'
          }
        });

        // 处理限流
        if (res.status === 429) {
          alert(`已触发频率限制，暂停 10 秒。\n${await res.text()}`);
          await sleep(10000);
        } else if (!res.ok && res.status !== 404) {
          throw new Error(`阅读主题失败: ${res.status}`);
        }
      }

      /* --- 模拟阅读帖子（阅读时长 / 帖子数） --- */
      {
        const totalTime = rand(51000, 61000); // 51‑61 s
        const tid = pickTopicId();
        const posts = generateFakePosts();
        const timings = makeFakeTimings(posts, totalTime);

        const res = await fetch('/topics/timings', {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
            'x-csrf-token': csrfToken,
            'x-silence-logger': 'true'
          },
          body: `${timings}&topic_time=${totalTime}&topic_id=${tid}`
        });

        if (res.status === 429) {
          alert(`已触发频率限制，暂停 10 秒。\n${await res.text()}`);
          await sleep(10000);
        } else if (!res.ok) {
          throw new Error(`提交阅读时长失败: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('[mjjbox] loop error', err);
    } finally {
      const elapsed = performance.now() - t0;
      setTimeout(loop, Math.max(0, LOOP_INTERVAL_MS - elapsed));
    }
  };

  /** 初始化 */
  (async () => {
    await refreshTopicPool();
    loop();
    setInterval(async () => (csrfToken = await getCSRF()), CSRF_REFRESH_MS);
    setInterval(refreshTopicPool, TOPIC_POOL_REFRESH_MS);
  })();
})();
