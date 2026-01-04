// ==UserScript==
// @name         Copy Tweets
// @namespace    kai.scripts
// @description  一键复制 Twitter/X 推文（Thread）信息
// @version      1.0
// @match        https://x.com/*/status/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555638/Copy%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/555638/Copy%20Tweets.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const EX_ATTR = 'data-xcopy-exclude'; // 为 Discover more 区域的 tweetText 打上的标记

  // 标记“Discover more”区域内的 tweetText
  const markDiscoverMore = () => {
      let foundMoreHeader = false;
      const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]');

      cells.forEach(cell => {
          // 检查当前 cell 是否包含 "discover more" 标题
          if (!foundMoreHeader) {
              const headers = cell.querySelectorAll('h2, [role="heading"]');
              const hasDiscoverMore = [...headers].some(h => /discover(?:y)?\s*more/i.test(h.textContent.trim()));
              if (hasDiscoverMore) foundMoreHeader = true;
          }
          // 如果已经找到标题，标记当前及后续 cell 中的 tweets
          if (foundMoreHeader) {
              cell.querySelectorAll('article[data-testid="tweet"]')
                  .forEach(tweet => tweet.setAttribute(EX_ATTR, '1'));
          }
      });
  };
  const clickShowMoreLinks = () => {
      const buttons = document.querySelectorAll('button[data-testid="tweet-text-show-more-link"]');
      buttons.forEach(button => button.click());
  };
  const scrollToBottomAndBack = async () => {
      // 平滑滚动到底部
      window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
      });

      // 等待 300ms
      await new Promise(resolve => setTimeout(resolve, 300));

      // 平滑滚动到顶部
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  };

  const getRootAuthorHandle = () => {
      try {
          const match = window.location.pathname.match(/^\/([^/]+)\/status\//i);
          if (!match) return '';
          const raw = decodeURIComponent(match[1] || '').trim();
          if (!raw) return '';
          return raw.startsWith('@') ? raw : `@${raw}`;
      } catch (err) {
          console.warn('[Copy Tweets] Failed to detect root author handle', err);
          return '';
      }
  };

  const filterThreadTweets = (tweets, authorHandle) => {
      if (!authorHandle) return [];
      const targetHandle = authorHandle.toLowerCase();
      const threadTweets = [];
      for (const tweet of tweets) {
          if ((tweet.handle || '').toLowerCase() !== targetHandle) break;
          threadTweets.push(tweet);
      }
      return threadTweets;
  };

  const getTweets = () => {
      scrollToBottomAndBack();
      markDiscoverMore(); // 先标记，再收集
      clickShowMoreLinks();
      return [...document.querySelectorAll('article[data-testid="tweet"]')]
          .map(t => {
          if (t.getAttribute(EX_ATTR) === '1') return null; // 用标记排除
          const u = t.querySelector('[data-testid="User-Name"]');
          const parts = u ? [...u.querySelectorAll('span')].map(s => s.textContent.trim()).filter(Boolean) : [];
          const handle = parts.find(x => x.startsWith('@')) || '';
          const name   = parts.find(x => x !== handle && !x.includes('·')) || '';
          const timeEl = t.querySelector('a[href*="/status/"] time');
          const a      = timeEl?.closest('a');
          const ts     = timeEl?.getAttribute('datetime') || '';
          const link   = a ? `x.com${a.getAttribute('href') || a.pathname || ''}` : '';
          const content = [...t.querySelectorAll('[data-testid="tweetText"]')]
          .map(n => n.textContent).join('\n').replace(/\s+\n/g, '\n').trim();
          return { author: `${handle} (${name})`, handle, link, timestamp: ts, content };
      })
          .filter(Boolean);
  };

  const format = arr => arr.map(o =>
    `author: ${o.author}\nlink: ${o.link}\ntimestamp: ${o.timestamp}\ncontent: ${o.content}\n---`
  ).join('\n');

  const applyButtonFeedback = (btn, label) => {
      btn.textContent = label;
      setTimeout(() => { btn.textContent = btn.dataset.label || ''; }, 1200);
  };

  const copyTweetsToClipboard = async (btn, tweets, emptyLabel) => {
      if (!tweets.length) {
          applyButtonFeedback(btn, emptyLabel);
          return;
      }
      const txt = format(tweets);
      if (!txt) {
          applyButtonFeedback(btn, emptyLabel);
          return;
      }
      await navigator.clipboard.writeText(txt);
      applyButtonFeedback(btn, 'Copied ✓');
  };

  const BUTTON_STYLE = 'font-weight:700;margin-left:8px;padding:4px 10px;border:1px solid #ccd;'
      + 'border-radius:14px;background:transparent;cursor:pointer;';

  const createCopyButton = (id, label, handler) => {
      const btn = document.createElement('button');
      btn.id = id;
      btn.type = 'button';
      btn.dataset.label = label;
      btn.textContent = label;
      btn.style.cssText = BUTTON_STYLE;
      btn.onclick = () => handler(btn);
      return btn;
  };

  const install = () => {
      const reply = document.querySelector('[aria-label="Reply"]');
      if (!reply) return;
      let btnAll = document.getElementById('copy-tweets-btn-all');
      if (!btnAll) {
          btnAll = createCopyButton('copy-tweets-btn-all', 'Copy All', async button => {
              const tweets = getTweets();
              await copyTweetsToClipboard(button, tweets, 'No Tweets');
          });
      }

      let btnThread = document.getElementById('copy-tweets-btn-thread');
      if (!btnThread) {
          btnThread = createCopyButton('copy-tweets-btn-thread', 'Copy Thread', async button => {
              const tweets = getTweets();
              const authorHandle = getRootAuthorHandle();
              const threadTweets = filterThreadTweets(tweets, authorHandle);
              await copyTweetsToClipboard(button, threadTweets, 'No Thread');
          });
      }

      if (!btnAll.isConnected) reply.insertAdjacentElement('afterend', btnAll);
      if (!btnThread.isConnected) btnAll.insertAdjacentElement('afterend', btnThread);
  };

  install();
  new MutationObserver(() => { markDiscoverMore(); install(); })
      .observe(document.body, { childList: true, subtree: true });
})();
