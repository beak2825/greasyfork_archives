// ==UserScript==
// @name         发票查验 二维码扫描自动填充
// @namespace    https://example.com/
// @version      1.5
// @description  在发票查验页面扫描发票二维码并自动填充表单
// @match        https://inv-veri.chinatax.gov.cn/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js
// @connect      cdn.jsdelivr.net
// @connect      unpkg.com
// @license Copyright (c) 2025 Guoyao. All rights reserved. No modification or redistribution without explicit permission.
// @downloadURL https://update.greasyfork.org/scripts/560908/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%20%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E6%8F%8F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/560908/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%20%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E6%8F%8F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== UI: floating panel, drop zone, status ==========

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
#invoice-qr-panel {
  position: fixed;
  right: 20px;
  bottom: 300px;
  width: 260px;
  background: #fff;
  border: 1px solid #1976D2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 2147483647;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
#invoice-qr-header {
  background: #2196F3;
  color: #fff;
  padding: 6px 8px;
  font-size: 12px;
}
#invoice-qr-drop {
  padding: 10px;
  border: 1px dashed #2196F3;
  margin: 8px;
  text-align: center;
  cursor: pointer;
  color: #333;
}
#invoice-qr-drop.dragover {
  background: rgba(33,150,243,0.08);
}
#invoice-qr-status {
  padding: 4px 8px 8px;
  color: #555;
}
#invoice-qr-status.error {
  color: #d32f2f;
}
`;
    document.head.appendChild(style);
  }

  function createPanel() {
    if (document.getElementById('invoice-qr-panel')) return;
    injectStyles();
    const panel = document.createElement('div');
    panel.id = 'invoice-qr-panel';
    panel.innerHTML = `
<div id="invoice-qr-header">发票二维码扫描</div>
<div id="invoice-qr-drop">
  拖拽二维码图片到此处，<br>或点击选择图片
</div>
<div id="invoice-qr-status"></div>
<input type="file" id="invoice-qr-file" accept="image/*" style="display:none;">
`;
    document.body.appendChild(panel);
    return panel;
  }

  function setStatus(text, isError) {
    const el = document.getElementById('invoice-qr-status');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('error', !!isError);
  }

  // ========== jsQR loader ==========
  // jsQR is loaded via @require directive, so it should be available as window.jsQR

  function getJsQR() {
    return new Promise((resolve, reject) => {
      // Check if jsQR is already loaded
      if (typeof window.jsQR === 'function') {
        resolve(window.jsQR);
        return;
      }

      // If not loaded yet, wait a bit and retry
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window.jsQR === 'function') {
          clearInterval(checkInterval);
          resolve(window.jsQR);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('jsQR 库加载超时，请刷新页面重试'));
        }
      }, 100);
    });
  }

  // ========== File helpers ==========

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('读取图片失败'));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('加载图片失败'));
      img.src = src;
    });
  }

  // ========== QR Code scanning ==========

  async function scanQRCode(file) {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);

    const jsQR = await getJsQR();
    setStatus('正在扫描二维码...', false);

    // Create canvas and get image data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code || !code.data) {
      throw new Error('未能识别到二维码，请确保图片清晰且包含二维码');
    }

    return code.data;
  }

  // ========== Invoice QR code parsing ==========
  // 中国增值税发票二维码格式：
  // 格式示例: 01,04,发票代码,发票号码,金额,日期,校验码,加密区
  // 或者其他格式，需要根据实际情况调整

  function parseInvoiceQRCode(qrData) {
    const parts = qrData.split(',');

    let invoiceNumber = '';
    let invoiceDate = '';
    let amount = '';

    // 常见的增值税发票二维码格式
    // 格式1: 01,04,发票代码,发票号码,金额,日期,校验码...
    if (parts.length >= 6) {
      // 发票号码通常是第4个字段（索引3）
      invoiceNumber = parts[3] ? parts[3].trim() : '';
      // 金额通常是第5个字段（索引4）
      amount = parts[4] ? parts[4].trim() : '';
      // 日期通常是第6个字段（索引5），格式为YYYYMMDD
      const dateStr = parts[5] ? parts[5].trim() : '';
      if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
        // 保持 YYYYMMDD 格式（发票查验系统使用这个格式）
        invoiceDate = dateStr;
      } else {
        invoiceDate = dateStr;
      }
    }

    // 如果解析失败，记录详细信息
    if (!invoiceNumber && !amount && !invoiceDate) {
      console.log('[QR解析] 二维码内容:', qrData);
      console.log('[QR解析] 分割后的字段:', parts);
      throw new Error(`未能自动解析发票信息。\n二维码包含 ${parts.length} 个字段，请检查格式。`);
    }

    return {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      amount: amount,
    };
  }

  // ========== Autofill helpers ==========

  function fillField(id, value) {
    if (!value) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));

    // 触发 ESC 键关闭日期选择器
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    });
    el.dispatchEvent(escEvent);
    document.dispatchEvent(escEvent);

    el.blur(); // 移除焦点
    return true;
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件。', true);
      return;
    }
    try {
      const qrData = await scanQRCode(file);
      console.log('[QR扫描] 二维码原始内容:', qrData);

      const { invoiceNumber, invoiceDate, amount } = parseInvoiceQRCode(qrData);

      console.log('[QR解析] 发票号码:', invoiceNumber);
      console.log('[QR解析] 开票日期:', invoiceDate);
      console.log('[QR解析] 金额:', amount);

      if (!invoiceNumber && !invoiceDate && !amount) {
        throw new Error('二维码中未找到发票信息');
      }

      const okFphm = fillField('fphm', invoiceNumber);
      const okKprq = fillField('kprq', invoiceDate);
      const okKjje = fillField('kjje', amount);

      // 模拟点击页面其他地方，关闭日期选择器等弹出组件
      setTimeout(() => {
        document.body.click();
      }, 10);

      let statusMsg = '扫描成功：';
      if (invoiceNumber) statusMsg += `发票号码${okFphm ? '✅' : '❌'} `;
      if (invoiceDate) statusMsg += `开票日期${okKprq ? '✅' : '❌'} `;
      if (amount) statusMsg += `金额${okKjje ? '✅' : '❌'}`;

      setStatus(statusMsg, false);

      // 如果有字段未填充成功，显示警告
      if ((invoiceNumber && !okFphm) || (invoiceDate && !okKprq) || (amount && !okKjje)) {
        console.warn('[表单填充] 部分字段填充失败，请检查页面表单元素ID');
      }
    } catch (e) {
      setStatus(e.message || String(e), true);
      console.error('[QR扫描错误]', e);
    }
  }

  // ========== Drag & drop + click to select ==========

  function initDragAndDrop(panel) {
    const dropArea = panel.querySelector('#invoice-qr-drop');
    const fileInput = panel.querySelector('#invoice-qr-file');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((name) => {
      dropArea.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (name === 'dragenter' || name === 'dragover') {
          dropArea.classList.add('dragover');
        } else if (name === 'dragleave' || name === 'drop') {
          dropArea.classList.remove('dragover');
        }
      });
    });

    dropArea.addEventListener('drop', (e) => {
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });

    dropArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
  }

  // ========== Init ==========

  function init() {
    const panel = createPanel();
    if (!panel) return;
    setStatus('就绪：拖拽或点击选择二维码图片。', false);
    initDragAndDrop(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

