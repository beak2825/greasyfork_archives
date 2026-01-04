// ==UserScript==
// @name        公众号文章阅读优化
// @match       https://mp.weixin.qq.com/s*
// @icon        https://mp.weixin.qq.com/favicon.ico
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.1
// @description 微信公众号文章宽度条件、隐藏二维码图片、隐藏底部栏
// @author      上官永石
// @license     MIT
// @namespace https://greasyfork.org/users/1474083
// @downloadURL https://update.greasyfork.org/scripts/555107/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555107/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


const DEFAULT_WIDTH = 1020;
const MIN_WIDTH = 600;
const MAX_WIDTH = 2560;
const BOTTOM_BAR_KEY = 'hideBottomBar';

function getSavedWidth() {
  return GM_getValue('contentWidth', DEFAULT_WIDTH);
}

function saveWidth(width) {
  GM_setValue('contentWidth', width);
}

function applyWidth(width) {
  const target = document.querySelector('.rich_media_area_primary_inner');
  if (target) {
    target.style.setProperty('max-width', `${width}px`, 'important');
  }
}

function getHideBottomBar() {
  return GM_getValue(BOTTOM_BAR_KEY, true);
}

function saveHideBottomBar(shouldHide) {
  GM_setValue(BOTTOM_BAR_KEY, shouldHide);
}

function applyBottomBarVisibility(shouldHide) {
  const bottomBar = document.querySelector('#js_article_bottom_bar');
  if (!bottomBar) return;

  if (shouldHide) {
    bottomBar.style.setProperty('display', 'none', 'important');
  } else {
    bottomBar.style.removeProperty('display');
    if (!bottomBar.getAttribute('style')) {
      bottomBar.removeAttribute('style');
    }
  }
}

function ensureStyle() {
  if (document.getElementById('wechat-width-style')) return;
  const style = document.createElement('style');
  style.id = 'wechat-width-style';
  style.textContent = `
    #wechat-width-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    #wechat-width-overlay.show {
      display: flex;
    }
    #wechat-width-modal {
      background: #fff;
      border-radius: 8px;
      padding: 20px 24px;
      width: 320px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #333;
    }
    #wechat-width-modal h3 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
    #wechat-width-modal label {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 12px;
    }
    #wechat-width-slider {
      width: 100%;
    }
    .wechat-modal-btn {
      width: 100%;
      padding: 8px 0;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }
    #wechat-bottom-toggle {
      margin-top: 18px;
      border: 1px solid #07c160;
      background: #f3fbf6;
      color: #07c160;
    }
    #wechat-bottom-toggle:hover {
      background: #e6f7ed;
    }
    #wechat-width-close {
      margin-top: 10px;
      border: none;
      background: #07c160;
      color: #fff;
    }
    #wechat-width-close:hover {
      background: #06ad56;
    }
  `;
  document.head.appendChild(style);
}

function createModal() {
  ensureStyle();

  let overlay = document.getElementById('wechat-width-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wechat-width-overlay';
    overlay.innerHTML = `
      <div id="wechat-width-modal">
        <h3>内容宽度</h3>
        <label>
          <span>宽度</span>
          <span id="wechat-width-value">${getSavedWidth()}px</span>
        </label>
        <input type="range" id="wechat-width-slider" min="${MIN_WIDTH}" max="${MAX_WIDTH}" step="5" value="${getSavedWidth()}">
        <button id="wechat-bottom-toggle" class="wechat-modal-btn"></button>
        <button id="wechat-width-close" class="wechat-modal-btn">关闭</button>
      </div>
    `;
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideModal();
      }
    });
    document.body.appendChild(overlay);

    const slider = overlay.querySelector('#wechat-width-slider');
    const value = overlay.querySelector('#wechat-width-value');
    const toggleBtn = overlay.querySelector('#wechat-bottom-toggle');
    const closeBtn = overlay.querySelector('#wechat-width-close');

    updateBottomToggleText(toggleBtn, getHideBottomBar());

    slider.addEventListener('input', () => {
      const width = Number(slider.value);
      value.textContent = `${width}px`;
      applyWidth(width);
      saveWidth(width);
    });

    toggleBtn.addEventListener('click', () => {
      const next = !getHideBottomBar();
      saveHideBottomBar(next);
      applyBottomBarVisibility(next);
      updateBottomToggleText(toggleBtn, next);
    });

    closeBtn.addEventListener('click', hideModal);
  } else {
    const slider = overlay.querySelector('#wechat-width-slider');
    const value = overlay.querySelector('#wechat-width-value');
    const toggleBtn = overlay.querySelector('#wechat-bottom-toggle');
    const width = getSavedWidth();
    slider.value = width;
    value.textContent = `${width}px`;
    updateBottomToggleText(toggleBtn, getHideBottomBar());
  }

  return overlay;
}

function updateBottomToggleText(button, isHidden) {
  if (button) {
    button.textContent = isHidden ? '显示底部栏' : '隐藏底部栏';
  }
}

function showModal() {
  const overlay = createModal();
  const toggleBtn = overlay.querySelector('#wechat-bottom-toggle');
  updateBottomToggleText(toggleBtn, getHideBottomBar());
  overlay.classList.add('show');
}

function hideModal() {
  const overlay = document.getElementById('wechat-width-overlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

function initialize() {
  applyWidth(getSavedWidth());
  applyBottomBarVisibility(getHideBottomBar());

  setTimeout(() => {
    const qr = document.querySelector('#js_pc_qr_code');
    if (qr) {
      qr.style.setProperty('display', 'none', 'important');
    }
  }, 1000);
}

window.addEventListener('load', () => {
  initialize();
  GM_registerMenuCommand('设置内容宽度', showModal);
});

