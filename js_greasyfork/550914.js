// ==UserScript==
// @name         导航栏在看顺序调整
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  恢复在看为原来的第三位，和收藏一致，而非现在的第一位
// @author       默沨
// @match        https://bangumi.tv/*
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550914/%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%9C%A8%E7%9C%8B%E9%A1%BA%E5%BA%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/550914/%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%9C%A8%E7%9C%8B%E9%A1%BA%E5%BA%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function reorganizeNavigationLinks() {
    const linkConfigs = [
      {
        type: 'anime',
        rootText: '我看',
        targetLink: '/list/.*/do',
        afterLink: '/list/.*/collect'
      },
      {
        type: 'book',
        rootText: '我读',
        targetLink: '/list/.*/do',
        afterLink: '/list/.*/collect'
      },
      {
        type: 'music',
        rootText: '我听',
        targetLink: '/list/.*/do',
        afterLink: '/list/.*/collect'
      },
      {
        type: 'game',
        rootText: '我玩',
        targetLink: '/list/.*/do',
        afterLink: '/list/.*/collect'
      },
      {
        type: 'real',
        rootText: '我看',
        targetLink: '/list/.*/do',
        afterLink: '/list/.*/collect'
      }
    ];

    const exploreUls = document.querySelectorAll('ul.explore.clearit');

    exploreUls.forEach(exploreUl => {
      linkConfigs.forEach(config => {
        const groupLi = Array.from(exploreUl.querySelectorAll('li.group')).find(li => {
          const rootSpan = li.querySelector('span.root');
          return rootSpan && rootSpan.textContent.trim() === config.rootText;
        });

        if (groupLi) {
          const allLinks = groupLi.querySelectorAll('a.nav');
          let targetLink, afterLink;

          allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.match(new RegExp(config.targetLink.replace('.*', '[^/]+')))) {
              targetLink = link;
            }
            if (href && href.match(new RegExp(config.afterLink.replace('.*', '[^/]+')))) {
              afterLink = link;
            }
          });

          if (targetLink && afterLink) {
            targetLink.remove();
            afterLink.after(targetLink);
          }
        }
      });
    });
  }

  reorganizeNavigationLinks();
})();