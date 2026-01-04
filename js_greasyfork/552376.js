// ==UserScript==
// @name        Fix flac.music.hi.cn Links
// @name:zh-CN  修复 flac.music.hi.cn 链接问题
// @namespace   https://github.com/UsadaYu/Tampermonkey
// @version     0.1.0
// @description Fixes the issue where `download`/`copy` links on flac.music.hi.cn fail for songs with single quotes in their names.
// @description:zh-CN 修复 flac.music.hi.cn 网站上，因歌曲名包含单引号而导致的 `下载链接` 和 `复制名称` 功能失效的问题。
// @author      UsadaYu
// @match       *://flac.music.hi.cn/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=music.hi.cn
// @grant       none
// @run-at      document-start
// @license     MIT
// @homepage    https://github.com/UsadaYu/Tampermonkey
// @supportURL  https://github.com/UsadaYu/Tampermonkey/issues
// @downloadURL https://update.greasyfork.org/scripts/552376/Fix%20flacmusichicn%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552376/Fix%20flacmusichicn%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // console.log('Fix-flac-links: Script running');

  const fixLinks = () => {
    const linksToFix = document.querySelectorAll(
      'a[href*="download_music"], a[href*="download_lyric"], a[href*="copy"]'
    );

    linksToFix.forEach(link => {
      // 使用 dataset 属性防止重复修复同一个链接
      if (link.dataset.fixed === 'true') {
        return;
      }

      const originalHref = link.getAttribute('href');
      if (!originalHref) return;

      let regex, functionPart, content;

      if (originalHref.startsWith('javascript:download_')) {
        regex = /^(javascript:download_(?:music|lyric)\(.*\s*,\s*')(.+)'\s*\)$/;
      } else if (originalHref.startsWith('javascript:copy')) {
        regex = /^(javascript:copy\(')(.+?)'\s*\)$/;
      }

      if (!regex) return;

      const match = originalHref.match(regex);
      if (match) {
        functionPart = match[1];
        content = match[2];

        if (content && content.includes("'")) {
          const fixedContent = content.replace(/'/g, "\\'");
          const newHref = `${functionPart}${fixedContent}')`;

          link.setAttribute('href', newHref);
          link.dataset.fixed = 'true';

          console.log('Fixed link for:', content);
        }
      }
    });
  };

  /**
   * @description 使用 MutationObserver 监视 DOM 变化，以处理动态加载的内容。
   */
  const observer = new MutationObserver(() => {
    fixLinks();
  });

  const observerConfig = {
    childList: true,
    subtree: true
  };

  /**
   * @description 确保在 document.body 存在后再启动监听。
   */
  const startObserver = () => {
    if (document.body) {
      observer.observe(document.body, observerConfig);
      fixLinks();
    } else {
      setTimeout(startObserver, 100);
    }
  };

  startObserver();
})();
