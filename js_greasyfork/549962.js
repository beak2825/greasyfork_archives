// ==UserScript==
// @name         移动端真实像素截图（可见页/元素裁剪）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  仅用 getDisplayMedia 做真实像素截图：点按钮=截可见区域；长按=选元素后裁剪导出 PNG。无 DOM 渲染备援。
// @match        *://*/*
// @license MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549962/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%9C%9F%E5%AE%9E%E5%83%8F%E7%B4%A0%E6%88%AA%E5%9B%BE%EF%BC%88%E5%8F%AF%E8%A7%81%E9%A1%B5%E5%85%83%E7%B4%A0%E8%A3%81%E5%89%AA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549962/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%9C%9F%E5%AE%9E%E5%83%8F%E7%B4%A0%E6%88%AA%E5%9B%BE%EF%BC%88%E5%8F%AF%E8%A7%81%E9%A1%B5%E5%85%83%E7%B4%A0%E8%A3%81%E5%89%AA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    btnText: '截屏',
    holdMs: 500,                 // 长按进入“元素选择模式”的判定时间
    captureDelayMs: 120,         // 捕获前轻微延迟，给动画/菜单稳定
    filePrefix: 'shot_',         // 导出文件名前缀
  };

  let busy = false;
  let holdTimer = null;

  // ====== UI：右下角小按钮 ======
  const btn = document.createElement('button');
  btn.textContent = CFG.btnText;
  Object.assign(btn.style, {
    position: 'fixed', right: '12px', bottom: '14px',
    zIndex: 2147483647, padding: '10px 14px',
    fontSize: '14px', borderRadius: '12px',
    border: '1px solid #ccc', background: 'rgba(255,255,255,.95)',
    boxShadow: '0 2px 10px rgba(0,0,0,.15)', userSelect: 'none',
    touchAction: 'manipulation'
  });
  document.documentElement.appendChild(btn);

  // ====== 元素选择遮罩（长按后出现） ======
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: 2147483646,
    background: 'rgba(0,0,0,0.08)', display: 'none'
  });
  const tip = document.createElement('div');
  tip.textContent = '点一下要裁剪的元素';
  Object.assign(tip.style, {
    position: 'fixed', left: '50%', top: '10px', transform: 'translateX(-50%)',
    padding: '6px 10px', fontSize: '13px', color: '#fff',
    background: 'rgba(0,0,0,0.6)', borderRadius: '8px'
  });
  overlay.appendChild(tip);
  document.documentElement.appendChild(overlay);

  // ====== 捕获整页可见区域 ======
  async function captureViewportAndSave() {
    if (busy) return; busy = true;
    try {
      const canvas = await _captureTabFrame();
      _downloadCanvas(canvas, `${CFG.filePrefix}viewport_${Date.now()}.png`);
    } catch (e) {
      _failNotice(e);
    } finally {
      busy = false;
    }
  }

  // ====== 捕获并按元素矩形裁剪 ======
  async function captureElementAndSave(el) {
    if (!el) return;
    if (busy) return; busy = true;
    try {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      const full = await _captureTabFrame();
      const crop = _rectToBitmapBox(el.getBoundingClientRect(), full.width, full.height);
      const piece = _cropCanvas(full, crop.x, crop.y, crop.w, crop.h);
      _downloadCanvas(piece, `${CFG.filePrefix}element_${Date.now()}.png`);
    } catch (e) {
      _failNotice(e);
    } finally {
      busy = false;
    }
  }

  // ====== 基础：标签页真实像素捕获到 Canvas ======
  async function _captureTabFrame() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error('此浏览器不支持 getDisplayMedia（无法进行真实像素截图）');
    }
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
    if (CFG.captureDelayMs) await new Promise(r => setTimeout(r, CFG.captureDelayMs));

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    // 关闭捕获
    track.stop();
    stream.getTracks().forEach(t => t.stop());

    // 简单的一致性提示（用于用户错误选择“整屏”导致尺寸异常）
    const expectedW = Math.round((window.visualViewport?.width ?? window.innerWidth) * (window.devicePixelRatio || 1));
    const expectedH = Math.round((window.visualViewport?.height ?? window.innerHeight) * (window.devicePixelRatio || 1));
    if (Math.abs(w - expectedW) > 4 || Math.abs(h - expectedH) > 4) {
      console.warn('[提示] 捕获尺寸与标签页可视区不一致：video', w, h, 'expected', expectedW, expectedH,
        '这通常是你选择了“整屏”而非“此标签页”。裁剪可能有偏移。');
    }
    return canvas;
  }

  // ====== 工具：将 CSS 像素矩形换算为位图像素矩形 ======
  function _rectToBitmapBox(rect /* DOMRect */, capW, capH) {
    const dpr = window.devicePixelRatio || 1;
    // 以当前可视区域左上角为原点（标签页捕获通常是这样）
    let x = Math.round(rect.left * dpr);
    let y = Math.round(rect.top * dpr);
    let w = Math.max(1, Math.round(rect.width * dpr));
    let h = Math.max(1, Math.round(rect.height * dpr));
    // 边界规整
    x = Math.max(0, Math.min(x, capW - 1));
    y = Math.max(0, Math.min(y, capH - 1));
    if (x + w > capW) w = capW - x;
    if (y + h > capH) h = capH - y;
    return { x, y, w, h };
  }

  // ====== 工具：从大画布裁切小画布 ======
  function _cropCanvas(big, x, y, w, h) {
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    out.getContext('2d').drawImage(big, x, y, w, h, 0, 0, w, h);
    return out;
  }

  // ====== 工具：下载 Canvas ======
  function _downloadCanvas(canvas, name) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function _failNotice(e) {
    console.warn('[截图失败]', e);
    alert('截图失败：可能是取消了授权、或浏览器不支持“标签页捕获”。\n建议使用桌面 Chrome/Edge，或 Android 的 Kiwi/Firefox（需支持脚本）。');
  }

  // ====== 交互：点击=截可见页；长按=元素选择后裁剪 ======
  // 触控长按判定
  btn.addEventListener('touchstart', (ev) => {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      _enterPickElementMode();
      holdTimer = null;
    }, CFG.holdMs);
  }, { passive: true });

  btn.addEventListener('touchend', (ev) => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
      // 视为“短按” → 截可见区域
      captureViewportAndSave();
    }
  }, { passive: true });

  // 鼠标也可用（桌面复用同逻辑）
  btn.addEventListener('mousedown', () => {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      _enterPickElementMode();
      holdTimer = null;
    }, CFG.holdMs);
  });

  btn.addEventListener('mouseup', () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
      captureViewportAndSave();
    }
  });

  function _enterPickElementMode() {
    overlay.style.display = 'block';
    const onPick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      overlay.style.display = 'none';
      document.removeEventListener('click', onPick, true);
      // 获取点击处的实际元素（忽略遮罩本身）
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      if (!el || el === overlay || el === btn) {
        alert('没有获取到目标元素，请重新长按按钮进入选择模式再点目标区域。');
        return;
      }
      captureElementAndSave(el);
    };
    // 捕获阶段监听，确保先于页面其它点击
    document.addEventListener('click', onPick, true);
  }
})();
