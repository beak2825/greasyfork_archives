// ==UserScript==
// @name         ChatGPT-Team-Checkout
// @namespace    https://chatgpt.com/
// @version      1.1
// @description  在 ChatGPT 主页面一键生成并复制团队支付链接
// @author       Marx
// @match        https://chatgpt.com/
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @icon         https://chatgpt.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/556051/ChatGPT-Team-Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/556051/ChatGPT-Team-Checkout.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = 'tm-team-checkout-btn';

  async function getAccessToken() {
    const resp = await fetch('/api/auth/session', { credentials: 'include' });
    if (!resp.ok) throw new Error('获取登录状态失败: ' + resp.status);
    const data = await resp.json();
    const token = data && data.accessToken;
    if (!token) throw new Error('未获取到 accessToken');
    return token;
  }

  async function createCheckout(token) {
    const resp = await fetch('/backend-api/payments/checkout', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'oai-language': 'zh-CN',
      },
      body: JSON.stringify({
        plan_name: 'chatgptteamplan',
        team_plan_data: {
          workspace_name: 'OAI',
          price_interval: 'month',
          seat_quantity: 5,
        },
        billing_details: {
          country: 'JP',
          currency: 'USD',
        },
        cancel_url:
          'https://chatgpt.com/?numSeats=5&selectedPlan=month&referrer=https%3A%2F%2Fauth.openai.com%2F#team-pricing-seat-selection',
        promo_campaign: 'team-1-month-free',
        checkout_ui_mode: 'redirect',
      }),
      credentials: 'include',
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error('创建结算失败: ' + resp.status + ' ' + text);
    }

    const data = await resp.json();
    if (!data || !data.url) throw new Error('响应缺少 checkout 链接');
    return data.url;
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async function handleClick(btn) {
    if (btn.dataset.loading === '1') return;
    btn.dataset.loading = '1';
    const originalText = btn.textContent;
    btn.classList.remove('tm-success', 'tm-error');
    btn.textContent = '生成中...';
    try {
      const token = await getAccessToken();
      const url = await createCheckout(token);
      await copyToClipboard(url);
      btn.textContent = '已复制支付链接';
      btn.classList.add('tm-success');
    } catch (e) {
      console.error(e);
      btn.textContent = '生成失败';
      btn.classList.add('tm-error');
      alert(e && e.message ? e.message : String(e));
    } finally {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.dataset.loading = '0';
        btn.classList.remove('tm-success', 'tm-error');
      }, 2000);
    }
  }

  function injectStyle() {
    const css = `
#${BUTTON_ID} {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 2147483647;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #e5e7eb;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
}
#${BUTTON_ID}:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  opacity: 0.96;
}
#${BUTTON_ID}[data-loading="1"] {
  cursor: default;
  opacity: 0.7;
}
#${BUTTON_ID}.tm-success {
  background: #a7f3d0;
  color: #064e3b;
}
#${BUTTON_ID}.tm-error {
  background: #fee2e2;
  color: #991b1b;
}
    `;
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
    } else {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  function createButton() {
    if (window.location.pathname !== '/') return;
    if (document.getElementById(BUTTON_ID)) return;
    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.type = 'button';
    btn.textContent = '生成团队支付链接';
    btn.dataset.loading = '0';
    btn.addEventListener('click', () => handleClick(btn));
    document.body.appendChild(btn);
  }

  function ensureButton() {
    if (window.location.pathname !== '/') {
      const btn = document.getElementById(BUTTON_ID);
      if (btn) btn.remove();
      return;
    }
    if (!document.getElementById(BUTTON_ID)) createButton();
  }

  function setupObserver() {
    if (!document.body) return;
    const observer = new MutationObserver(() => {
      ensureButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (window.top !== window) return;
    injectStyle();
    ensureButton();
    setupObserver();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();