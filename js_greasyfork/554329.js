// ==UserScript==
// @name         Google Maps – One-Click Embed Extractor
// @namespace    gmaps-embed
// @version      1.0
// @description  Click a floating button → get the clean <iframe> embed code or just the src in the clipboard.
// @author       Bekkibau
// @match        https://www.google.com/maps/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554329/Google%20Maps%20%E2%80%93%20One-Click%20Embed%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/554329/Google%20Maps%20%E2%80%93%20One-Click%20Embed%20Extractor.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---- CSS for the popup -------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    #grok-embed-popup {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 90vw;
      max-height: 90vh;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,.3);
      z-index: 2000;
      font-family: Roboto, Arial, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    #grok-embed-popup header {
      padding: 12px 16px;
      background: #1a73e8;
      color: #fff;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #grok-embed-popup pre {
      margin: 0;
      padding: 16px;
      background: #f8f9fa;
      overflow: auto;
      flex: 1;
      font-size: 13px;
      line-height: 1.4;
    }
    #grok-embed-popup .actions {
      padding: 12px 16px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      background: #fff;
      border-top: 1px solid #dadce0;
    }
    #grok-embed-popup button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font: inherit;
      cursor: pointer;
    }
    #grok-embed-popup button.copy {
      background: #1a73e8;
      color: #fff;
    }
    #grok-embed-popup button.close {
      background: #dadce0;
      color: #3c4043;
    }
    #grok-embed-popup .actions button.copy.src {
      background: #34a853;
    }
    #grok-embed-popup .actions button.copy:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;

  document.head.appendChild(style);

  let popup = null;

  // ---- Show popup with embed code ----------------------------------------
  const showEmbedPopup = (iframeHTML) => {
    popup?.remove();
    popup = null;

    // Extract src attribute
    const srcMatch = iframeHTML.match(/src="([^"]+)"/i);
    const srcURL = srcMatch ? srcMatch[1] : '(not found)';

    const container = document.createElement('div');
    container.id = 'grok-embed-popup';
    container.innerHTML = `
      <header>
        <span>Embed code</span>
        <button class="close" title="Close">✕</button>
      </header>
      <pre>${iframeHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      <div class="actions">
        <button class="copy full">Copy Full &lt;iframe&gt;</button>
        <button class="copy src">Copy src URL</button>
        <button class="close">Close</button>
      </div>
    `;

    // Copy handlers
    const copyBtn = (text, btn) => async () => {
      await navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 1500);
    };

    container.querySelector('.copy.full')
      .addEventListener('click', copyBtn(iframeHTML, container.querySelector('.copy.full')));
    container.querySelector('.copy.src')
      .addEventListener('click', copyBtn(srcURL, container.querySelector('.copy.src')));

    // Close handlers
    const close = () => {
      container.remove();
      popup = null;
    };
    container.querySelectorAll('.close').forEach(b => b.addEventListener('click', close));
    container.addEventListener('click', e => e.target === container && close());

    document.body.appendChild(container);
    popup = container;
  };

  // ---- Create floating button --------------------------------------------
  const btn = document.createElement('button');
  btn.textContent = '📋 Embed';
  Object.assign(btn.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 9999,
    padding: '10px 14px',
    font: 'bold 14px/1 sans-serif',
    color: '#fff',
    background: '#1a73e8',
    border: 'none',
    borderRadius: '50px',
    boxShadow: '0 2px 6px rgba(0,0,0,.3)',
    cursor: 'pointer',
    userSelect: 'none'
  });
  btn.title = 'Extract Google Maps embed iframe (one click)';
  document.body.appendChild(btn);

  // ---- Find UI elements by meaning ---------------------------------------
  const findShareButton = () => {
    return (
      document.querySelector('button[aria-label="Share"]') ||
      [...document.querySelectorAll('button')]
        .find(b => /share/i.test(b.textContent)) ||
      document.querySelector('button[jsaction*="share"]')
    );
  };

  const findEmbedTab = () => {
    return [...document.querySelectorAll('[role="tab"], button')]
      .find(el => /embed\s*a?\s*map/i.test(el.textContent));
  };

  const waitFor = (condition, timeout = 8000) => new Promise((res, rej) => {
    const start = Date.now();
    const check = () => {
      const el = condition();
      if (el) return res(el);
      if (Date.now() - start > timeout) return rej(new Error('Timeout'));
      requestAnimationFrame(check);
    };
    check();
  });

  // ---- Main extraction routine -------------------------------------------
  const extractEmbed = async () => {
    const ourBtn = document.getElementById('grok-embed-btn');
    if (ourBtn) ourBtn.style.display = 'none';

    try {
      const shareBtn = findShareButton();
      if (!shareBtn) throw new Error('Share button not found');
      shareBtn.click();

      const embedTab = await waitFor(findEmbedTab);
      embedTab.click();

      const input = await waitFor(() =>
        document.querySelector('input[readonly][value*="iframe"][value*="maps/embed"]')
      );

      const div = document.createElement('div');
      div.innerHTML = input.value;
      const iframeHTML = div.innerHTML;

      // Close modal
      const closeModal = () => {
        const closeBtn = document.querySelector('button[aria-label="Close"], button[aria-label="close"]');
        if (closeBtn) return closeBtn.click();

        const backdrop = document.querySelector('[role="dialog"]')?.parentElement;
        if (backdrop) return backdrop.click();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      };
      closeModal();

      // Wait for modal to disappear
      await waitFor(() => !document.querySelector('[role="dialog"]'), 1000).catch(() => {});

      // Show popup with embed code
      showEmbedPopup(iframeHTML);

    } catch (e) {
      console.error('Embed extraction error:', e);
    } finally {
      if (ourBtn) ourBtn.style.display = '';
    }
  };

  // ---- Bind click event --------------------------------------------------
  btn.addEventListener('click', extractEmbed);
})();
