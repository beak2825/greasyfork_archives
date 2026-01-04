// ==UserScript==
// @name         Model Selector for lmarena (Text-Based + Debug)
// @namespace    http://tampermonkey.net/
// @version      2026-01-04
// @description  Auto-select model and auto-submit prompt on lmarena (robust + debug)
// @author       Animesh Dhakal
// @match        https://lmarena.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555884/Model%20Selector%20for%20lmarena%20%28Text-Based%20%2B%20Debug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555884/Model%20Selector%20for%20lmarena%20%28Text-Based%20%2B%20Debug%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===================== DEBUG HELPERS ===================== */

  const LOG  = (...a) => console.log('%c[LM-Arena]', 'color:#4CAF50;font-weight:bold', ...a);
  const WARN = (...a) => console.warn('%c[LM-Arena]', 'color:#FFC107;font-weight:bold', ...a);
  const ERR  = (...a) => console.error('%c[LM-Arena]', 'color:#F44336;font-weight:bold', ...a);

  /* ===================== UTILITIES ===================== */

  function waitForElm(selector, timeout = 15000) {
    LOG(`Waiting for: ${selector}`);
    return new Promise((resolve, reject) => {
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

      setTimeout(() => {
        obs.disconnect();
        reject(new Error(`Timeout: ${selector}`));
      }, timeout);
    });
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function isDisabled(btn) {
    return (
      btn.disabled ||
      btn.getAttribute('aria-disabled') === 'true' ||
      btn.classList.contains('disabled')
    );
  }

  async function waitUntilEnabled(btn, timeout = 10000) {
    const start = Date.now();
    while (isDisabled(btn)) {
      if (Date.now() - start > timeout) {
        throw new Error('Submit button never enabled');
      }
      await sleep(100);
    }
    return btn;
  }

  function setReactInputValue(input, value) {
    const proto = Object.getPrototypeOf(input);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

    if (setter) setter.call(input, value);
    else input.value = value;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ===================== MAIN LOGIC ===================== */

  async function run() {
    LOG('Script started');

    const params = new URLSearchParams(window.location.search);
    let model = params.get('model');
    const query = params.get('query');
    const chatModality = params.get('chat-modality') || 'direct';

    if (!model) {
      model = chatModality === 'direct'
        ? 'gpt'
        : 'ppl-sonar-pro-high';
      LOG('No model param, defaulting to:', model);
    }

    const modelLower = model.toLowerCase();
    LOG('Target model text:', modelLower);

    /* wait for message box (SPA-safe entry point) */
    await waitForElm('[name="message"]');

    /* open model combobox */
    const comboboxes = [...document.querySelectorAll("button[role='combobox']")];
    LOG(`Comboboxes found: ${comboboxes.length}`);

    const modelCombobox = comboboxes[1];

    if (!modelCombobox) {
      ERR('Model combobox not found');
      return;
    }

    modelCombobox.click();
    LOG('Model dropdown opened');

    /* wait for options to appear */
    await waitForElm('div[role="option"]');

    /* select model by VISIBLE TEXT (FIX) */
    const options = [...document.querySelectorAll('div[role="option"]')];
    LOG(`Model options found: ${options.length}`);

    const modelOption = options.find(opt =>
      opt.textContent.toLowerCase().includes(modelLower)
    );

    if (!modelOption) {
      ERR(
        'Model not found by text. Available models:',
        options.map(o => o.textContent.trim())
      );
      return;
    }

    modelOption.scrollIntoView({ block: 'center' });
    modelOption.click();
    LOG('Model selected:', modelOption.textContent.trim());

    if (!query) {
      WARN('No query provided — stopping after model selection');
      return;
    }

    /* fill message */
    const messageInput = await waitForElm('[name="message"]');
    setReactInputValue(messageInput, query);
    LOG('Message filled');

    /* submit */
    const submitButton = await waitForElm('button[type="submit"]');
    await waitUntilEnabled(submitButton);
    submitButton.click();

    LOG('Prompt submitted successfully');
  }

  /* ===================== SPA RE-RUN SUPPORT ===================== */

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      LOG('URL changed, re-running');
      run().catch(e => ERR(e));
    }
  }, 1000);

  /* ===================== BOOT ===================== */

  run().catch(e => ERR('Fatal error:', e));

})();
