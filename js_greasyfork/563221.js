// ==UserScript==
// @name         bilibili,B站去广告
// @version      1.0
// @description  bilibili,B站,去广告,屏蔽视频投票打分三连弹窗,屏蔽小火箭推广视频,屏蔽直播主页顶部自动播放的直播,修改自ES ighl
// @author       yier
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1561058
// @original https://greasyfork.org/users/929164
// @downloadURL https://update.greasyfork.org/scripts/563221/bilibili%2CB%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/563221/bilibili%2CB%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const currentHost = window.location.hostname;
  const currentPath = window.location.pathname;
  const injectStyle = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };
  if (currentHost === 'live.bilibili.com' && (currentPath === '/' || currentPath === '')) {
    injectStyle(`
          .player-area-ctnr.border-box.p-relative.t-center { display: none !important; }
      `);
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const stack = new Error().stack || '';
      if (stack.includes('home-player.prod.min.js')) {
        this.pause();
        this.currentTime = 0;
        this.removeAttribute('autoplay');
        return Promise.reject(new DOMException('play() failed'));
      }
      return originalPlay.apply(this, arguments);
    };
  }
  if (currentHost === 'www.bilibili.com' && (currentPath === '/' || currentPath === '')) {
    injectStyle(`
          .bili-video-card__skeleton.loading_animation,
          .bili-live-card.is-rcmd.enable-no-interest,
          .ad-report.ad-floor-exp.left-banner,
          .floor-single-card,
          .fixed-card { display: none !important;margin-top: 0 !important; }
          .feed-card { margin-top: 0 !important; }
          .bili-feed-card { margin-top: 0 !important; }
      `);
    const selectors = {
      pseudo: '.bili-video-card.is-rcmd',
      icons: '.vui_icon.bili-video-card__stats--icon',
      adFeed: '.bili-video-card__mask .bili-video-card__stats--text'
    };
    const isBlocked = (element) => {
      if (element.dataset.checked) return element.dataset.blocked === 'true';
      const content = getComputedStyle(element, '::before').content;
      const blocked = content.includes('AdGuard') || content.includes('AdBlock');
      element.dataset.checked = 'true';
      element.dataset.blocked = blocked;
      return blocked;
    };
    const checkElements = (selector, condition, parentSelector) => {
      document.querySelectorAll(selector).forEach(el => {
        const target = parentSelector ? el.closest(parentSelector) : el;
        if (target && (!condition || condition(el))) {
          const feedCard = target.closest('.feed-card');
          if (feedCard) {
            feedCard.style.display = 'none';
            feedCard.dataset.processed = 'true';
          }
          const biliFeedCard = target.closest('.bili-feed-card');
          if (biliFeedCard) {
            biliFeedCard.style.display = 'none';
            biliFeedCard.dataset.processed = 'true';
          }
        }
      });
    };
    const debounce = (fn, delay = 100) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };
    const observer = new MutationObserver(debounce(() => {
      checkElements(selectors.pseudo, el =>
        isBlocked(el) || [...el.children].some(isBlocked)
      );
      checkElements(selectors.icons, null, '.bili-video-card');
      checkElements(selectors.adFeed, el =>
        el.textContent.includes('广告'), '.bili-video-card__wrap'
      );
    }));

    observer.observe(document.body, { subtree: true, childList: true });
  }
  if (currentHost === 'www.bilibili.com' && currentPath.startsWith('/video/')) {
    injectStyle(`
          .bpx-player-qoeFeedback,
          .bili-danmaku-x-guide.bili-danmaku-x-show,
          .bili-danmaku-x-cmd-shrink,
          .bili-danmaku-x-link.bili-danmaku-x-show,
          .bili-danmaku-x-scoreSum.bili-danmaku-x-show,
          .bili-danmaku-x-vote.bili-danmaku-x-show,
          .bili-danmaku-x-score.bili-danmaku-x-show,
          .bili-danmaku-x-guide-all.bili-danmaku-x-guide.bili-danmaku-x-show,
          .bili-danmaku-x-follow-to-electric.bili-danmaku-x-guide-all.bili-danmaku-x-guide.bili-danmaku-x-show,
          .ad-report.strip-ad.left-banner,
          .ad-report.ad-floor-exp.left-banner,
          .ad-report.ad-floor-exp.right-bottom-banner,
          .activity-m-v1.act-end,
          .activity-m-v1.act-now,
          .video-card-ad-small,
          .video-page-game-card-small,
          .slide-ad-exp { display: none !important; }
      `);
  }
  if (currentHost === 'search.bilibili.com') {
    injectStyle(`
          .col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40:has(.bili-video-card__info--ad),
          .col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40:has(.bili-video-card__info--ad-creative) { display: none !important; }
      `);
  }
  if (currentHost === 't.bilibili.com') {
    injectStyle(`
          .bili-dyn-ads { display: none !important; }
      `);
  }
})();