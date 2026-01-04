// ==UserScript==
// @name         真实像素裁剪指定DIV（标签页捕获）
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  先捕获当前标签页真实像素，再按目标DIV的矩形裁剪导出PNG。Alt+F整页，Alt+S按选择器，Alt+X裁剪鼠标下元素。
// @match        *://*/*
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549956/%E7%9C%9F%E5%AE%9E%E5%83%8F%E7%B4%A0%E8%A3%81%E5%89%AA%E6%8C%87%E5%AE%9ADIV%EF%BC%88%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%8D%95%E8%8E%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549956/%E7%9C%9F%E5%AE%9E%E5%83%8F%E7%B4%A0%E8%A3%81%E5%89%AA%E6%8C%87%E5%AE%9ADIV%EF%BC%88%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%8D%95%E8%8E%B7%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    selector: '.geetest_box_97e0f6e8',   // ← 按需改：Alt+S 时按此选择器裁剪
    downloadPrefix: 'crop_',   // 文件名前缀
    captureDelayMs: 120,       // 触发后延迟一点点，给悬浮/hover菜单时间
  };

  async function captureTabFrame() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser', preferCurrentTab: true, frameRate: 1 },
      audio: false
    });
    const track = stream.getVideoTracks()[0];
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    await new Promise(r => (video.readyState >= 2 ? r() : video.onloadedmetadata = r));

    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 等一点点时间，保证目标状态稳定（比如 hover 展开）
    if (CFG.captureDelayMs) await new Promise(r => setTimeout(r, CFG.captureDelayMs));

    ctx.drawImage(video, 0, 0, w, h);

    // 立刻停止捕获
    track.stop(); stream.getTracks().forEach(t => t.stop());
    return canvas;
  }

  function downloadCanvasRegion(bigCanvas, x, y, w, h, name = 'crop.png') {
    // 规范边界
    x = Math.max(0, Math.floor(x));
    y = Math.max(0, Math.floor(y));
    w = Math.max(1, Math.floor(Math.min(w, bigCanvas.width - x)));
    h = Math.max(1, Math.floor(Math.min(h, bigCanvas.height - y)));
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    out.getContext('2d').drawImage(bigCanvas, x, y, w, h, 0, 0, w, h);
    const a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function getViewportCropBoxForElement(el) {
    // 以“可见视口截图”为基准，因此使用 viewport 相对坐标
    const rect = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    // 将 CSS 像素转换为位图像素
    return {
      x: rect.left * dpr,
      y: rect.top * dpr,
      w: rect.width * dpr,
      h: rect.height * dpr
    };
  }

  async function captureFullViewport() {
    try {
      const full = await captureTabFrame();
      const name = `${CFG.downloadPrefix}viewport_${Date.now()}.png`;
      const a = document.createElement('a');
      a.href = full.toDataURL('image/png');
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.warn('[DIV裁剪] 整页截图失败：', e);
      alert('整页截图失败：可能取消了来源选择，或浏览器不支持。');
    }
  }

  async function captureBySelector() {
    const el = document.querySelector(CFG.selector);
    if (!el) { alert('未找到元素：' + CFG.selector); return; }
    // 确保元素在视口内（只做最小滚动，避免布局大跳动）
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    try {
      const full = await captureTabFrame();
      const { x, y, w, h } = getViewportCropBoxForElement(el);
      downloadCanvasRegion(full, x, y, w, h, `${CFG.downloadPrefix}sel_${Date.now()}.png`);
    } catch (e) {
      console.warn('[DIV裁剪] 选择器裁剪失败：', e);
      alert('裁剪失败：可能取消了来源选择，或浏览器不支持。');
    }
  }

  // “鼠标悬停即裁剪”模式（按 Alt+X 触发）
  async function captureByHover() {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    // 更可靠：直接拿当前鼠标位置的元素
    let target = null;
    document.addEventListener('mousemove', function once(ev) {
      target = document.elementFromPoint(ev.clientX, ev.clientY);
      document.removeEventListener('mousemove', once);
    }, { once: true });
    // 等一帧拿到鼠标下元素
    await new Promise(r => requestAnimationFrame(r));
    if (!target) {
      alert('没有拿到鼠标下的元素，请把鼠标停在目标上后再按 Alt+X');
      return;
    }
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    try {
      const full = await captureTabFrame();
      const { x, y, w, h } = getViewportCropBoxForElement(target);
      downloadCanvasRegion(full, x, y, w, h, `${CFG.downloadPrefix}hover_${Date.now()}.png`);
    } catch (e) {
      console.warn('[DIV裁剪] 悬停裁剪失败：', e);
      alert('裁剪失败：可能取消了来源选择，或浏览器不支持。');
    }
  }

  // 热键
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); captureFullViewport(); }
    if (e.altKey && (e.key === 's' || e.key === 'S')) { e.preventDefault(); captureBySelector(); }
    if (e.altKey && (e.key === 'x' || e.key === 'X')) { e.preventDefault(); captureByHover(); }
  });
})();
