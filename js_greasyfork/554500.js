// ==UserScript==
// @name         Bilibili 哔哩哔哩用户资料卡快捷拉黑
// @namespace    https://github.com/Tsuk1ko
// @version      1.0.0
// @description  在用户资料卡上增加拉黑按钮
// @author       神代綺凛
// @license      GPL-3.0
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/554500/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E8%B5%84%E6%96%99%E5%8D%A1%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/554500/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E8%B5%84%E6%96%99%E5%8D%A1%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const ProfileType = {
    COMPONENT: 0,
  };

  const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

  const waitValue = async (getter, maxTimes = 1000, interval = 10) => {
    for (let i = 0; i < maxTimes; i++) {
      const value = getter();
      if (value) return value;
      await sleep(interval);
    }
    throw new Error('查找元素超时');
  };

  const getCsrf = () => {
    const match = document.cookie.match(/bili_jct=([^;]+);/);
    const value = match?.[1];
    if (value) return value;
    throw new Error('获取 csrf 失败，请检查是否已登录');
  };

  const blockUser = async (uid, block = true) => {
    const res = await fetch('https://api.bilibili.com/x/relation/modify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        fid: uid,
        act: block ? 5 : 6,
        re_src: 11,
        gaia_source: 'web_main',
        csrf: getCsrf(),
      }),
    });
    const data = await res.json();
    if (data.code === 0) return;
    throw new Error(data.message);
  };

  const onElementDisplay = (el, callback) => {
    new IntersectionObserver(([{ boundingClientRect: rect }]) => {
      if (rect.width && rect.height) callback();
    }).observe(el);
  };

  const setBtnText = (btn, isBlocked) => {
    btn.textContent = isBlocked ? '取消拉黑' : '拉黑';
  };

  const setBtnDisplay = (btn, display) => {
    btn.style.display = display ? 'block' : 'none';
  };

  /**
   * @returns {Promise<{ node: HTMLElement, type: number }>}
   */
  const waitProfile = () =>
    new Promise(resolve => {
      new MutationObserver((mutations, self) => {
        mutations.forEach(({ addedNodes }) => {
          for (const node of addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.matches('bili-user-profile')) {
              self.disconnect();
              resolve({ node, type: ProfileType.COMPONENT });
              return;
            }
          }
        });
      }).observe(document.body, { childList: true });
    });

  const { node, type } = await waitProfile();

  /** @type {Record<string, boolean>} */
  const state = {};

  if (type === ProfileType.COMPONENT) {
    const getUid = () => node.__uid;

    const initBtn = async () => {
      /** @type {HTMLElement} */
      const $action = await waitValue(() => node.shadowRoot.querySelector('#action'));

      const $oldBtn = $action.querySelector('#bpb-block');
      if ($oldBtn) return $oldBtn;

      const $btn = document.createElement('button');
      $btn.id = 'bpb-block';
      $btn.style =
        'background-color: transparent; border-color: var(--text3); color: var(--text2); margin-left: 8px;';
      $btn.addEventListener('click', async () => {
        try {
          const uid = getUid();
          if (!uid) throw new Error('获取 uid 失败');
          const block = !state[uid];
          await blockUser(uid, block);
          state[uid] = block;
          setBtnText($btn, block);
        } catch (error) {
          alert(String(error));
        }
      });

      $action.appendChild($btn);
      return $btn;
    };

    onElementDisplay(node, async () => {
      const $btn = await initBtn();
      if (!$btn) return;
      const uid = getUid();
      setBtnDisplay($btn, String(node.userData?.mid) !== uid);
      setBtnText($btn, state[uid]);
    });
  }
})();
