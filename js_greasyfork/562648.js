// ==UserScript==
// @name         网页划词转卡片
// @namespace    https://openuserjs.org/users/barretlee
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @version      1.7
// @description  在 CSP 严格环境下生成划词卡片，可下载或复制，带磨砂背景、优化间距、精美交互、随机主题切换。
// @author       Barret Lee <barret.china@gmail.com>
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562648/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E8%BD%AC%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/562648/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E8%BD%AC%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const COLOR_PRESETS = [{
      bg: 'rgba(30,30,30,0.65)',
      text: '#fff'
    },
    {
      bg: 'rgba(255,255,255,0.75)',
      text: '#000'
    },
    {
      bg: 'rgba(0,24,88,0.55)',
      text: '#fef6e4'
    },
    {
      bg: 'rgba(224,222,244,0.7)',
      text: '#232136'
    },
    {
      bg: 'rgba(240,100,80,0.65)',
      text: '#fff'
    },
    {
      bg: 'rgba(44,120,180,0.6)',
      text: '#fff'
    },
    {
      bg: 'rgba(200,255,200,0.6)',
      text: '#232136'
    },
  ];

  let buffer = '';
  let timer = null;
  let selectedText = '';
  let panel = null,
    preview = null;
  let currentTheme = COLOR_PRESETS[0];

  function createPanel() {
    const wrapper = document.createElement('div');
    wrapper.id = 'share-card-panel';
    wrapper.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255,255,255,0.1);
      border-radius: 18px;
      box-shadow: 0 6px 32px rgba(0,0,0,0.25);
      width: 420px;
      max-width: 90vw;
      backdrop-filter: blur(10px);
      z-index: 999999;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      overflow: hidden;
      animation: fadeIn 0.25s ease;
    `;

    wrapper.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -45%);}
          to { opacity: 1; transform: translate(-50%, -50%);}
        }
        #share-card-preview {
          padding: 28px 24px 58px 24px;
          min-height: 200px;
          border-radius: 14px;
          transition: all 0.3s ease;
          position: relative;
          line-height: 1.8;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }
        #share-card-text,#share-card-domain {
          font-variation-settings: "wght" 200;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-family:
            "PingFang SC", /* 中文圆体 (macOS/iOS) */
            "SF Pro Rounded", /* macOS/iOS 系统圆体 */
            "Helvetica Rounded",
            "Inter Rounded", /* 英文可变圆体 */
            "Roboto Flex", "Roboto Rounded", /* Android 圆体 */
            "Noto Sans Rounded", /* 通用圆体 */
            "HarmonyOS Sans SC", /* 华为圆体 */
            "MiSans", /* 小米圆体 */
            "Microsoft YaHei UI", /* Windows 兼容字体 */
            sans-serif;
          font-weight: 200;
        }
        #share-card-domain {
          position: absolute;
          bottom: 30px;
          right: 20px;
          font-size: 13px;
          opacity: 0.75;
          font-weight: 400;
          letter-spacing: 0.5px;
        }
        #share-card-text {
          font-size: 17px;
          margin: 8px;
          white-space: normal;
          word-break: break-word;
          text-align: justify;
          text-justify: inter-word;
        }
        #share-card-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          line-height: 26px;
          text-align: center;
          font-size: 16px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          cursor: pointer;
          color: inherit;
          transition: all 0.2s;
        }
        #share-card-close:hover {
          background: rgba(255,255,255,0.3);
        }
        #share-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 18px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        #share-card-footer button {
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
          color: inherit;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        #share-card-footer button:hover {
          background: rgba(255,255,255,0.35);
        }
        #share-card-colors {
          display: flex;
          justify-content: space-around;
          padding: 10px 0 16px 0;
          border-top: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
        }
        #share-card-colors div {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 6px rgba(0,0,0,0.2);
        }
        #share-card-colors div:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        #share-card-colors div.active {
          outline: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.4);
        }
      </style>
      <div id="share-card-preview">
        <div id="share-card-close">×</div>
        <div id="share-card-text" contenteditable></div>
        <div id="share-card-domain" contenteditable>${location.hostname}</div>
      </div>
      <div id="share-card-footer">
        <button id="btn-random">🎨 随机</button>
        <button id="btn-copy">📋 复制</button>
        <button id="btn-save">💾 下载</button>
      </div>
      <div id="share-card-colors"></div>
    `;

    document.body.appendChild(wrapper);
    panel = wrapper;
    preview = wrapper.querySelector('#share-card-preview');
    wrapper.querySelector('#share-card-text').textContent = selectedText;
    wrapper.querySelector('#share-card-close').onclick = () => wrapper.remove();

    // ESC 快捷键关闭
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel) panel.remove();
    });

    // 颜色按钮
    const colors = wrapper.querySelector('#share-card-colors');
    COLOR_PRESETS.forEach(({
      bg,
      text
    }, idx) => {
      const div = document.createElement('div');
      div.style.background = bg;
      div.style.border = `2px solid ${text}`;
      div.title = `主题 ${idx + 1}`;
      div.onclick = () => updateColor(bg, text, idx);
      colors.appendChild(div);
    });

    // 初始化默认主题
    updateColor(COLOR_PRESETS[0].bg, COLOR_PRESETS[0].text);

    wrapper.querySelector('#btn-save').onclick = downloadCard;
    wrapper.querySelector('#btn-copy').onclick = copyCard;
    wrapper.querySelector('#btn-random').onclick = randomTheme;
  }

  function updateColor(bg, text, idx = 0) {
    currentTheme = COLOR_PRESETS[idx];
    preview.style.background = bg;
    preview.style.color = text;
    preview.style.backdropFilter = 'blur(12px)';
    document.querySelectorAll('#share-card-colors div').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  function randomTheme() {
    const idx = Math.floor(Math.random() * COLOR_PRESETS.length);
    const {
      bg,
      text
    } = COLOR_PRESETS[idx];
    updateColor(bg, text, idx);
  }

  function generateCanvas(callback) {
    const closeBtn = preview.querySelector('#share-card-close');
    const origDisplay = closeBtn.style.display;
    const origBg = preview.style.background;

    closeBtn.style.display = 'none';
    preview.style.background = currentTheme.bg;

    // 使用 html2canvas v1.x 的语法
    html2canvas(preview, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      backgroundColor: null,
      allowTaint: true,
      // width/height 通常会自动获取，除非需要强制裁剪，这里保留原样
      width: preview.offsetWidth,
      height: preview.offsetHeight,
    }).then(canvas => {
      // 下面的逻辑是为了提高清晰度，手动进行了二次处理
      // 这里的逻辑对于新版 html2canvas 来说可能稍显冗余，但保留以维持原作者的渲染效果意图
      
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      // ① 放大 2 倍
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = canvas.width * 2;
      scaledCanvas.height = canvas.height * 2;
      const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });

      scaledCtx.imageSmoothingEnabled = false;
      scaledCtx.mozImageSmoothingEnabled = false;
      scaledCtx.webkitImageSmoothingEnabled = false;

      scaledCtx.scale(2, 2);
      scaledCtx.drawImage(canvas, 0, 0);

      // ② 再压缩到一半尺寸，像素密度翻倍
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = scaledCanvas.width / 2;
      finalCanvas.height = scaledCanvas.height / 2;
      const finalCtx = finalCanvas.getContext('2d');
      finalCtx.imageSmoothingEnabled = false;
      finalCtx.drawImage(
        scaledCanvas,
        0, 0, scaledCanvas.width, scaledCanvas.height,
        0, 0, finalCanvas.width, finalCanvas.height
      );

      closeBtn.style.display = origDisplay;
      preview.style.background = origBg;

      callback(finalCanvas);
    }).catch(err => {
      closeBtn.style.display = origDisplay;
      preview.style.background = origBg;
      console.error('生成卡片失败:', err);
      alert('生成图片失败，可能是因为跨域图片限制。');
    });
  }

  function downloadCard() {
    generateCanvas(canvas => {
      const link = document.createElement('a');
      link.download = `share-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  function copyCard() {
    generateCanvas(canvas => {
      canvas.toBlob(async blob => {
        try {
          // 现代浏览器剪贴板 API
          await navigator.clipboard.write([new ClipboardItem({
            'image/png': blob
          })]);
          alert('✅ 图片已复制到剪贴板');
        }
        catch (e) {
            console.error(e);
          alert('⚠️ 无法自动复制，请使用“下载”功能');
        }
      });
    });
  }

  document.addEventListener('keydown', e => {
    // 避免在输入框打字时触发
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
    
    buffer += e.key.toLowerCase();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => (buffer = ''), 800);
    
    // 触发关键词: "card" 或 "cccc"
    if (buffer.endsWith('card') || buffer.endsWith('cccc')) {
      const sel = window.getSelection();
      if (sel && sel.toString().trim()) {
        selectedText = sel.toString().trim();
        showPanel();
      }
      buffer = '';
    }
  });

  function showPanel() {
    if (panel) panel.remove();
    createPanel();
  }
})();