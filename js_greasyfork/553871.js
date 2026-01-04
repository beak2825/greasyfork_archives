// ==UserScript==
// @name         webui提示词同步到novelai
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将webui的提示词同步到NovelAI页面
// @match        http://127.0.0.1:7860/*
// @match        https://novelai.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/553871/webui%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%90%8C%E6%AD%A5%E5%88%B0novelai.user.js
// @updateURL https://update.greasyfork.org/scripts/553871/webui%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%90%8C%E6%AD%A5%E5%88%B0novelai.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const LOCAL_BOXES = [
    '#txt2img_prompt > label > textarea', // 本地第一个框
    '#txt2img_neg_prompt > label > textarea'  // 本地第二个框
  ];

  const NOVELAI_BOXES = [
    '#__next > div.sc-5d63727e-0.fPmsgo.image-gen-page > div.image-gen-body > div.image-gen-main > div > div.sc-9709987d-0.gTOquS.settings-panel > div:nth-child(3) > div:nth-child(2) > div > div.image-gen-prompt-main > div.prompt-input-box-prompt > div.relative > div > div > p:nth-child(1)', // NovelAI 第一个框（Prompt）
    '#__next > div.sc-5d63727e-0.fPmsgo.image-gen-page > div.image-gen-body > div.image-gen-main > div > div.sc-9709987d-0.gTOquS.settings-panel > div:nth-child(3) > div:nth-child(2) > div > div.image-gen-prompt-main > div.prompt-input-box-undesired-content > div.relative > div > div > p'                     // NovelAI 第二个框（Negative Prompt）
  ];

  const isLocal = location.hostname === '127.0.0.1';
  const isNovel = location.hostname.includes('novelai.net');

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const obs = new MutationObserver(() => {
      const node = document.querySelector(selector);
      if (node) {
        obs.disconnect();
        callback(node);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function safeSet(el, text) {
    if (!el) return;
    if ('value' in el) el.value = text;
    else el.textContent = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (isLocal) {
    LOCAL_BOXES.forEach((sel, i) => {
      waitForElement(sel, el => {
        console.log(`[Sync] Local box ${i} ready`);
        el.addEventListener('input', () => {
          const val = el.value || el.textContent || '';
          GM_setValue(`sync_box_${i}`, val);
        });
      });
    });
  }

  if (isNovel) {
    NOVELAI_BOXES.forEach((sel, i) => {
      waitForElement(sel, el => {
        console.log(`[Sync] NovelAI box ${i} ready`);
        GM_addValueChangeListener(`sync_box_${i}`, (_, __, val) => {
          safeSet(el, val);
          console.log(`[Sync] Updated NovelAI box ${i}:`, val.slice(0, 20));
        });
      });
    });
  }

})();
