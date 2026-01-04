// ==UserScript==
// @name         ColaManga 双页并排
// @namespace    https://www.colamanga.com/
// @version      8.0
// @description  双页排列 + 方向键翻章 + 底部自动翻章 + 图片加载失败自动点击重试（仅适用浏览传统日漫），双页并排以外的其他功能让ai参照了“ColaManga 浏览增强”，但我是纯纯小白，ai是到底是参照还是照搬我分不清哈哈，是因为它俩冲突我才选择复制功能。如果您觉得有被侵害到权益，可以联系我删除，我就不公开自己留着用啦。
// @match        https://www.colamanga.com/manga-*/*/*.html
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554057/ColaManga%20%E5%8F%8C%E9%A1%B5%E5%B9%B6%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/554057/ColaManga%20%E5%8F%8C%E9%A1%B5%E5%B9%B6%E6%8E%92.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONTAINER_SEL = '#mangalist';
  const ITEM_SEL = '.mh_comicpic';
  const WRAPPER_ID = 'cola-double-wrapper';
  const MAX_RETRY = 3;

  let nextPageUrl = null;
  let prevPageUrl = null;
  let isFinalPage = false;
  let jumpState = false;

  const isWide = () => window.innerWidth >= 900;

  // ========== 图片重试逻辑（复用原重试按钮） ==========
  function attachRetryToImage(img) {
    if (img.dataset.retryAttached) return;
    img.dataset.retryAttached = '1';

    img.addEventListener('error', function () {
      const picContainer = this.closest(ITEM_SEL);
      if (!picContainer) return;

      const retryBtn = picContainer.querySelector('.mh_retry');
      if (!retryBtn || retryBtn.style.display === 'none') return;

      const count = parseInt(this.dataset.retryCount || '0', 10);
      if (count < MAX_RETRY) {
        this.dataset.retryCount = count + 1;
        console.log(`[ColaManga 重试] 第 ${count + 1} 次重试`, this.src);
        retryBtn.click(); // ✅ 完全复用原脚本的重试机制
      }
    }, { once: false });
  }

  function observeNewImages(container) {
    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        if (mut.type === 'childList') {
          // 查找新增的 img
          mut.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches('img')) {
                attachRetryToImage(node);
              }
              const imgs = node.querySelectorAll?.('img') || [];
              imgs.forEach(attachRetryToImage);
            }
          });
        }
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // 初始绑定已有图片
    container.querySelectorAll('img').forEach(attachRetryToImage);
  }

  // ========== 布局 & 翻章逻辑（略作整合） ==========
  function styleComicBlock(block) {
    block.style.cssText += `
      flex: 1;
      min-width: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    const img = block.querySelector('img');
    if (img) {
      img.style.cssText += `
        max-width: 100% !important;
        height: auto !important;
        display: block;
      `;
    }
  }

  function extractPageLinks() {
    const readend = document.querySelector('.mh_readend ul');
    if (readend) {
      const links = readend.querySelectorAll('a');
      if (links.length >= 3) {
        prevPageUrl = links[0]?.href || null;
        nextPageUrl = links[2]?.href || null;
        isFinalPage = !nextPageUrl || nextPageUrl.startsWith('javascript:');
        return true;
      }
    }

    const headpager = document.querySelector('.mh_headpager');
    if (headpager) {
      const links = headpager.querySelectorAll('a.mh_btn:not(.mh_bgcolor)');
      if (links.length >= 2) {
        prevPageUrl = links[0]?.href || null;
        nextPageUrl = links[1]?.href || null;
        isFinalPage = !nextPageUrl || nextPageUrl.startsWith('javascript:');
        return true;
      }
    }
    return false;
  }

  function layout() {
    if (!isWide()) return;
    const container = document.querySelector(CONTAINER_SEL);
    if (!container || container.dataset.doublepage === '1') return;

    const items = Array.from(container.querySelectorAll(ITEM_SEL)).filter(el => el.isConnected);
    if (items.length === 0) return;

    let wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = WRAPPER_ID;
      wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
        padding: 10px 0 30px;
        background: inherit;
        width: 100%;
      `;
      container.parentNode.insertBefore(wrapper, container.nextSibling);
    } else {
      wrapper.innerHTML = '';
    }

    for (let i = 0; i < items.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'cola-row';
      row.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        max-width: 1200px;
        box-sizing: border-box;
      `;

      const left = items[i];
      styleComicBlock(left);
      row.appendChild(left);

      const right = items[i + 1];
      if (right) {
        styleComicBlock(right);
        row.appendChild(right);
      } else {
        const spacer = document.createElement('div');
        spacer.style.width = '49%';
        row.appendChild(spacer);
      }

      wrapper.appendChild(row);
    }

    container.style.display = 'none';
    container.dataset.doublepage = '1';
  }

  function setupHotkeys() {
    if (window.self !== window.parent) return;
    window.addEventListener('keydown', (e) => {
      if (jumpState) return;
      if (e.key === 'ArrowLeft' && prevPageUrl && !prevPageUrl.startsWith('javascript:')) {
        e.preventDefault();
        jumpState = true;
        window.location.href = prevPageUrl;
      } else if (e.key === 'ArrowRight' && nextPageUrl && !isFinalPage) {
        e.preventDefault();
        jumpState = true;
        window.location.href = nextPageUrl;
      }
    }, { capture: true });
  }

  function setupAutoTurn() {
    if (window.self !== window.parent || isFinalPage) return;
    let ticking = false;
    const checkBottom = () => {
      if (jumpState) return;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
        jumpState = true;
        window.location.href = nextPageUrl;
      }
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkBottom();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========== 初始化 ==========
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const tryInit = () => {
      if (!extractPageLinks()) {
        setTimeout(tryInit, 500);
        return;
      }

      layout();
      setupHotkeys();
      setupAutoTurn();

      const container = document.querySelector(CONTAINER_SEL);
      if (container) {
        observeNewImages(container); // 👈 关键：绑定重试 + 监听新图

        // 监听容器变化以更新布局
        const layoutObserver = new MutationObserver(() => setTimeout(layout, 300));
        layoutObserver.observe(container, { childList: true, subtree: true });
      }

      // 响应窗口大小
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const container = document.querySelector(CONTAINER_SEL);
          const wrapper = document.getElementById(WRAPPER_ID);
          if (isWide()) {
            layout();
          } else if (wrapper) {
            wrapper.remove();
            if (container) {
              container.style.display = '';
              delete container.dataset.doublepage;
            }
          }
        }, 250);
      });
    };

    setTimeout(tryInit, 800);
  }

  init();
})();