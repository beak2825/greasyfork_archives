// ==UserScript==
// @name         nodeseek和deepflood快速插入B站链接插件
// @namespace    Violentmonkey Scripts
// @match        https://www.deepflood.com/post-*
// @match        https://www.deepflood.com/new-discussion
// @match        https://www.nodeseek.com/post-*
// @match        https://www.nodeseek.com/new-discussion
// @grant        GM_xmlhttpRequest
// @author       renshengyoumeng
// @author2      shuai, ChatGPT5
// @license MIT
// @version      1.3
// @description  支持自动识别BV号或b23短链，一键插入带标题的B站视频Markdown
// @downloadURL https://update.greasyfork.org/scripts/553924/nodeseek%E5%92%8Cdeepflood%E5%BF%AB%E9%80%9F%E6%8F%92%E5%85%A5B%E7%AB%99%E9%93%BE%E6%8E%A5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/553924/nodeseek%E5%92%8Cdeepflood%E5%BF%AB%E9%80%9F%E6%8F%92%E5%85%A5B%E7%AB%99%E9%93%BE%E6%8E%A5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ======== 常量 ========
  const SELECTORS = {
    editor: '.CodeMirror',
    toolbar: '.mde-toolbar',
    imgBtn: '.toolbar-item.i-icon.i-icon-pic[title="图片"]',
    container: '#bzhan-toolbar-container',
  };

  const ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
      <path fill="currentColor" d="M202.667 261.333v32a26.666 26.666 0 0 1-45.523 18.856a26.67 26.67 0 0 1-7.811-18.856v-32a26.667 26.667 0 0 1 53.334 0m266.666-58.666v170.666A74.667 74.667 0 0 1 394.667 448H117.333a74.67 74.67 0 0 1-74.666-74.667V202.667A74.67 74.67 0 0 1 117.333 128h32l-24.106-23.893A26.551 26.551 0 0 1 144 58.784a26.55 26.55 0 0 1 18.773 7.776L224.427 128h64l61.653-61.44a26.55 26.55 0 1 1 37.547 37.547L362.667 128h32a74.67 74.67 0 0 1 74.666 74.667m-53.333 0a21.335 21.335 0 0 0-21.333-21.334H117.333A21.333 21.333 0 0 0 96 202.667v170.666a21.335 21.335 0 0 0 21.333 21.334h277.334A21.333 21.333 0 0 0 416 373.333zm-80 32a26.666 26.666 0 0 0-26.667 26.666v32a26.666 26.666 0 0 0 45.523 18.856a26.67 26.67 0 0 0 7.811-18.856v-32A26.667 26.667 0 0 0 336 234.667"/>
    </svg>`;

  // ======== 工具函数 ========
  const Utils = {
    waitForElement: (selector) =>
      new Promise((resolve) => {
        const found = document.querySelector(selector);
        if (found) return resolve(found);
        const obs = new MutationObserver(() => {
          const el = document.querySelector(selector);
          if (el) {
            obs.disconnect();
            resolve(el);
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }),

    delay: (ms) => new Promise((r) => setTimeout(r, ms)),

    getLongLink: (shortLink) =>
      new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: shortLink,
          followRedirect: false,
          onload: (res) => {
            const longLink = res.finalUrl || '';
            if (longLink.includes('bilibili.com/video/')) resolve(longLink);
            else reject('未找到有效跳转链接');
          },
          onerror: reject,
        });
      }),

    generateLink: (bvId) => `https://www.bilibili.com/video/${bvId}`,

    async parseLink(text) {
      const clean = text.trim();
      const reg = {
        short: /https?:\/\/b23\.tv\/[a-zA-Z0-9]+/,
        bv: /BV[a-zA-Z0-9]{10}/,
      };
      try {
        if (reg.bv.test(clean)) {
          const bv = clean.match(reg.bv)?.[0];
          return this.generateLink(bv);
        }
        if (reg.short.test(clean)) {
          const short = clean.match(reg.short)?.[0];
          const longLink = await this.getLongLink(short);
          const bv = longLink.match(reg.bv)?.[0];
          return bv ? this.generateLink(bv) : null;
        }
        return null;
      } catch (e) {
        console.warn('链接解析失败:', e);
        return null;
      }
    },

    async fetchTitle(bvLink) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: bvLink,
          onload: (res) => {
            const html = res.responseText;
            const match = html.match(/<title.*?>(.*?)<\/title>/i);
            if (match && match[1]) {
              const title = match[1]
                .replace(/_哔哩哔哩_bilibili.*$/, '') // 去除多余后缀
                .replace(/[\r\n]/g, '')
                .trim();
              resolve(title);
            } else resolve('B站视频');
          },
          onerror: () => resolve('B站视频'),
        });
      });
    },

    insertMarkdown(markdown, editor) {
      const cm = editor?.CodeMirror;
      if (!cm) return;
      const cursor = cm.getCursor();
      cm.replaceRange(`\n${markdown}\n`, cursor);
      cm.focus();
    },
  };

  // ======== UI逻辑 ========
  const UI = {
    createButton() {
      const btn = document.createElement('button');
      btn.className = 'bzhan-button toolbar-item i-icon';
      btn.style.cssText = 'appearance:none;border:none;background:inherit;cursor:pointer;';
      btn.innerHTML = ICON_SVG;
      return btn;
    },

    async setupToolbar(toolbar, editor) {
      if (!toolbar || toolbar.querySelector(SELECTORS.container)) return;

      const container = document.createElement('div');
      container.id = 'bzhan-toolbar-container';
      toolbar.appendChild(container);

      const btn = this.createButton();
      const imgBtn = toolbar.querySelector(SELECTORS.imgBtn);
      if (imgBtn) toolbar.insertBefore(btn, imgBtn);
      else toolbar.appendChild(btn);

      btn.addEventListener('click', async () => {
        const input = prompt('请输入B站BV号或分享链接：');
        if (!input) return;

        const link = await Utils.parseLink(input);
        if (!link) return alert('未能生成有效链接，请检查输入是否正确。');

        const title = await Utils.fetchTitle(link);
        Utils.insertMarkdown(`[${title}](${link})`, editor);
      });
    },
  };

  // ======== 初始化逻辑 ========
  const init = async () => {
    try {
      const editor = await Utils.waitForElement(SELECTORS.editor);
      const toolbar = await Utils.waitForElement(SELECTORS.toolbar);
      await UI.setupToolbar(toolbar, editor);

      // 监控 toolbar 丢失
      const observer = new MutationObserver(async (mutations) => {
        for (const m of mutations) {
          if ([...m.addedNodes].some((n) => n.matches?.(SELECTORS.toolbar))) {
            const tb = document.querySelector(SELECTORS.toolbar);
            if (tb && !tb.querySelector(SELECTORS.container))
              await UI.setupToolbar(tb, editor);
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // 兼容 tab 切换
      document.addEventListener('click', async (e) => {
        if (e.target.closest('.tab-option')) {
          await Utils.delay(150);
          const tb = document.querySelector(SELECTORS.toolbar);
          if (tb && !tb.querySelector(SELECTORS.container))
            await UI.setupToolbar(tb, editor);
        }
      });
    } catch (e) {
      console.warn('脚本初始化失败:', e);
    }
  };

  window.addEventListener('load', init);
})();
