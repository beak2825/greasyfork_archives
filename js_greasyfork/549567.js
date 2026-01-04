// ==UserScript==
// @name         通用拖拽上传替换 (相邻/覆盖/替换 可选 + 悬浮提示 + 日志)
// @namespace    https://muyyy.link/
// @version      0.8
// @description  为 input[type=file] 提供拖拽上传弹窗；支持相邻/覆盖/直接替换原有按钮；替换模式不改文字与布局，仅悬浮提示；Alt 可直通
// @author       Muyu
// @homepage     https://muyyy.link/
// @license      Apache-2.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549567/%E9%80%9A%E7%94%A8%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E6%9B%BF%E6%8D%A2%20%28%E7%9B%B8%E9%82%BB%E8%A6%86%E7%9B%96%E6%9B%BF%E6%8D%A2%20%E5%8F%AF%E9%80%89%20%2B%20%E6%82%AC%E6%B5%AE%E6%8F%90%E7%A4%BA%20%2B%20%E6%97%A5%E5%BF%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549567/%E9%80%9A%E7%94%A8%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E6%9B%BF%E6%8D%A2%20%28%E7%9B%B8%E9%82%BB%E8%A6%86%E7%9B%96%E6%9B%BF%E6%8D%A2%20%E5%8F%AF%E9%80%89%20%2B%20%E6%82%AC%E6%B5%AE%E6%8F%90%E7%A4%BA%20%2B%20%E6%97%A5%E5%BF%97%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    insertMode: 'replace', // 'adjacent' | 'cover' | 'replace'
    accentColor: '#4CAF50',
    log: true,
    altBypass: true,       // 按住 Alt 时让出原生行为（不拦截）
    tooltipText: '拖拽到弹窗，或点击选择（按住 Alt 走原生）',
  };

  const style = document.createElement('style');
  style.textContent = `
    /* 轻量强调，不覆盖站点按钮样式 */
    .uploader-btn { border: 2px solid ${CONFIG.accentColor} !important; }
    .uploader-btn:hover { background-color: #e8f5e9 !important; border-color: #2e7d32 !important; }

    /* 隐藏 input，但不 display:none，避免脚本找不到它 */
    .uploader-hidden {
      position: absolute !important; width: 1px !important; height: 1px !important;
      padding: 0 !important; margin: 0 !important; overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important;
      pointer-events: none !important; opacity: 0 !important;
    }

    .uploader-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center; z-index: 999999;
    }
    .uploader-box {
      background: #fff; border: 2px solid ${CONFIG.accentColor}; border-radius: 6px;
      padding: 20px 30px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      max-width: 90vw;
    }
    .uploader-box p { margin-bottom: 12px; font-weight: bold; color: #333; }
    .uploader-box button { padding: 6px 12px; margin: 5px; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0; cursor: pointer; }
    .uploader-box button:hover { background: #e0e0e0; }

    /* 悬浮提示（仅在替换模式给原按钮加 data-uploader-tip 时出现） */
    [data-uploader-tip] { position: relative; }
    [data-uploader-tip]:hover::after {
      content: attr(data-uploader-tip);
      position: absolute; top: -32px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.85); color: #fff; padding: 4px 8px; border-radius: 4px;
      font-size: 12px; white-space: nowrap; pointer-events: none; z-index: 1000000;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    [data-uploader-tip]:hover::before {
      content: ''; position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
      border: 6px solid transparent; border-top-color: rgba(0,0,0,0.85); z-index: 1000001;
    }
  `;
  document.head.appendChild(style);

  const log = (...a) => CONFIG.log && console.log('[Uploader]', ...a);

  const isVisible = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };

const cssEscape = (id) => (
  window.CSS && CSS.escape
    ? CSS.escape(id)
    : id.replace(/([ #;?%&,.+*~\\':"!^$[\]()=>|/@])/g, '\\$1')
);


  function findAnchor(input) {
    try {
      if (input.id) {
        const byFor = document.querySelector(`label[for="${cssEscape(input.id)}"]`);
        if (byFor && isVisible(byFor)) return { anchor: byFor, type: 'label[for]' };
      }
      const labelWrap = input.closest && input.closest('label');
      if (labelWrap && isVisible(labelWrap)) return { anchor: labelWrap, type: 'label-ancestor' };

      const btnLike = input.closest && input.closest('button, .btn, [role="button"], .button, .ant-btn, .MuiButton-root, .el-button');
      if (btnLike && isVisible(btnLike)) return { anchor: btnLike, type: 'button-like' };

      if (isVisible(input)) return { anchor: input, type: 'input-self-visible' };
      return { anchor: input.parentElement || input, type: 'fallback-parent' };
    } catch {
      return { anchor: input, type: 'error-fallback' };
    }
  }

  function makeOverlay(input) {
    const overlay = document.createElement('div');
    overlay.className = 'uploader-overlay';
    overlay.innerHTML = `
      <div class="uploader-box" role="dialog" aria-label="上传文件">
        <p>拖拽文件到此，或点击按钮选择</p>
        <button id="manualSelect" type="button">手动选择</button>
        <button id="closeUpload" type="button">取消</button>
      </div>`;
    document.body.appendChild(overlay);

    const box = overlay.querySelector('.uploader-box');

    overlay.addEventListener('dragover', (e) => { e.preventDefault(); box.style.borderColor = '#2e7d32'; });
    overlay.addEventListener('dragleave', () => { box.style.borderColor = CONFIG.accentColor; });
    overlay.addEventListener('drop', (e) => {
      e.preventDefault();
      box.style.borderColor = CONFIG.accentColor;
      const files = e.dataTransfer.files;
      log('检测到拖入文件:', files);
      if (files.length > 0) {
        const dt = new DataTransfer();
        for (const f of files) dt.items.add(f);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        log('文件已注入 input 并触发 change 事件');
      }
      overlay.remove();
    });

    overlay.querySelector('#manualSelect').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      log('手动选择文件：触发 input.click()');
      input.click();
      overlay.remove();
    });

    overlay.querySelector('#closeUpload').addEventListener('click', () => {
      log('用户取消上传');
      overlay.remove();
    });
  }

  function hookAnchorToOverlay(anchor, input) {
    if (anchor.dataset.uploaderHooked === '1') return;
    anchor.dataset.uploaderHooked = '1';

    // 悬浮提示：不改文本与样式，仅加 data- 属性
    if (!anchor.hasAttribute('data-uploader-tip')) {
      anchor.setAttribute('data-uploader-tip', CONFIG.tooltipText);
    }

    const clickHandler = (e) => {
      if (CONFIG.altBypass && (e.altKey || e.getModifierState?.('Alt'))) {
        log('Alt 按下：放行原生行为与站点事件'); return; // 不拦截
      }
      // 拦截并优先于站点脚本（捕获阶段+阻止默认+阻止冒泡）
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      log('原按钮被替换触发：打开自定义 overlay', { anchor, input });
      makeOverlay(input);
    };

    // 捕获阶段监听，优先拿到 click
    anchor.addEventListener('click', clickHandler, true);

    // 无障碍支持：回车/空格
    anchor.addEventListener('keydown', (e) => {
      const key = e.key || e.code;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        if (CONFIG.altBypass && (e.altKey || e.getModifierState?.('Alt'))) return;
        e.preventDefault(); e.stopPropagation();
        log('键盘触发（Enter/Space）打开 overlay');
        makeOverlay(input);
      }
    }, true);
  }

  function enhanceInput(input) {
    if (!(input instanceof Element)) return;
    if (input.dataset.uploaderEnhanced === '1') return;
    input.dataset.uploaderEnhanced = '1';

    const { anchor, type } = findAnchor(input);
    log('定位锚点', { input, anchor, type, mode: CONFIG.insertMode });

    if (CONFIG.insertMode === 'replace') {
      // 直接替换：用原“按钮/label/可见input”本体作为触发器；不改文字与样式
      hookAnchorToOverlay(anchor, input);
      // 如果锚点不是 input 本体，则可以安全隐藏 input 本体，避免抢焦点/挡点击；若锚点就是 input，则保持可见以不变布局
      if (anchor !== input) {
        input.classList.add('uploader-hidden');
      }
      return;
    }

    // 下方保留相邻/覆盖两种旧策略（如需切换）
    // 复制原 class 到按钮
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '上传文件';
    btn.className = (anchor.className || input.className || '') + ' uploader-btn';

    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      log('自定义上传按钮被点击');
      makeOverlay(input);
    });

    if (CONFIG.insertMode === 'cover' && isVisible(anchor)) {
      const wrap = document.createElement('span');
      const cs = getComputedStyle(anchor);
      wrap.style.position = cs.position === 'static' ? 'relative' : cs.position;
      wrap.style.display = 'inline-block';
      anchor.parentNode.insertBefore(wrap, anchor);
      wrap.appendChild(anchor);

      const bStyle = btn.style;
      bStyle.position = 'absolute';
      bStyle.inset = '0';
      bStyle.width = '100%';
      bStyle.height = '100%';
      bStyle.display = 'inline-flex';
      bStyle.alignItems = 'center';
      bStyle.justifyContent = 'center';
      bStyle.background = 'transparent';

      wrap.appendChild(btn);
      input.classList.add('uploader-hidden');
      log('已覆盖锚点放置按钮');
    } else {
      anchor.insertAdjacentElement('afterend', btn);
      input.classList.add('uploader-hidden');
      log('已相邻插入按钮');
    }
  }

  function processAllInputs(root = document) {
    root.querySelectorAll('input[type="file"]').forEach(enhanceInput);
  }

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches && n.matches('input[type="file"]')) enhanceInput(n);
        const inputs = n.querySelectorAll ? n.querySelectorAll('input[type="file"]') : [];
        inputs.forEach(enhanceInput);
      }
    }
  });

  // 启动
  processAllInputs();
  if (document.body) {
    mo.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      processAllInputs();
      mo.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
