// ==UserScript==
// @name         发票查验 PaddleJS OCR 自动填充
// @namespace    https://example.com/
// @version      0.6
// @description  在发票查验页面使用 PaddleJS OCR 自动识别发票并自动填充表单
// @match        https://inv-veri.chinatax.gov.cn/*
// @grant        GM_xmlhttpRequest
// @connect      unpkg.com
// @license Copyright (c) 2025 Guoyao. All rights reserved. No modification or redistribution without explicit permission.
// @downloadURL https://update.greasyfork.org/scripts/558595/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%20PaddleJS%20OCR%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/558595/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%20PaddleJS%20OCR%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== UI: floating panel, drop zone, status ==========

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
#invoice-ocr-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 260px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 2147483647;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
#invoice-ocr-header {
  background: #4CAF50;
  color: #fff;
  padding: 6px 8px;
  font-size: 12px;
}
#invoice-ocr-drop {
  padding: 10px;
  border: 1px dashed #4CAF50;
  margin: 8px;
  text-align: center;
  cursor: pointer;
  color: #333;
}
#invoice-ocr-drop.dragover {
  background: rgba(76,175,80,0.08);
}
#invoice-ocr-status {
  padding: 4px 8px 8px;
  color: #555;
}
#invoice-ocr-status.error {
  color: #d32f2f;
}
`;
    document.head.appendChild(style);
  }

  function createPanel() {
    if (document.getElementById('invoice-ocr-panel')) return;
    injectStyles();
    const panel = document.createElement('div');
    panel.id = 'invoice-ocr-panel';
    panel.innerHTML = `
<div id="invoice-ocr-header">发票 OCR 自动填充</div>
<div id="invoice-ocr-drop">
  拖拽发票图片到此处，<br>或点击选择图片
</div>
<div id="invoice-ocr-status"></div>
<input type="file" id="invoice-ocr-file" accept="image/*" style="display:none;">
`;
    document.body.appendChild(panel);
    return panel;
  }

  function setStatus(text, isError) {
    const el = document.getElementById('invoice-ocr-status');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('error', !!isError);
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

  // ========== PaddleJS OCR loader: fetch + manual CommonJS eval ==========

  const OCR_CDN_URL = 'https://unpkg.com/@paddlejs-models/ocr@1.2.4';

  let ocrModulePromise = null;
  let ocrInitPromise = null;

  function loadPaddleOcrModule() {
    if (ocrModulePromise) return ocrModulePromise;

    ocrModulePromise = new Promise((resolve, reject) => {
      setStatus('正在下载 PaddleJS OCR 脚本...', false);
      GM_xmlhttpRequest({
        method: 'GET',
        url: OCR_CDN_URL,
        responseType: 'text',
        onload: function (resp) {
          try {
            if (resp.status && resp.status !== 200) {
              reject(new Error('加载 PaddleJS OCR 脚本失败，HTTP 状态码：' + resp.status));
              return;
            }
            const code = resp.responseText;
            const module = { exports: {} };
            const exports = module.exports;
            // Execute the UMD in a local CommonJS environment
            const factory = new Function('module', 'exports', code + '\n;return module.exports;');
            const ocr = factory(module, exports);
            if (!ocr || typeof ocr.init !== 'function' || typeof ocr.recognize !== 'function') {
              reject(new Error('PaddleJS OCR 脚本解析失败（缺少 init/recognize）。'));
              return;
            }
            resolve(ocr);
          } catch (e) {
            reject(e);
          }
        },
        onerror: function () {
          reject(new Error('网络错误：无法加载 PaddleJS OCR 脚本。'));
        },
        ontimeout: function () {
          reject(new Error('请求超时：加载 PaddleJS OCR 脚本失败。'));
        },
      });
    });

    return ocrModulePromise;
  }

  async function ensurePaddleOcr() {
    if (ocrInitPromise) return ocrInitPromise;

    ocrInitPromise = (async () => {
      const ocr = await loadPaddleOcrModule();
      setStatus('正在初始化 PaddleJS OCR 模型...', false);
      await ocr.init(); // 默认从百度模型 CDN 加载 det/rec 模型
      return ocr;
    })();

    return ocrInitPromise;
  }

  async function runPaddleOcr(file) {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);

    const ocr = await ensurePaddleOcr();
    setStatus('正在识别发票图片...', false);

    const res = await ocr.recognize(img);
    const texts = [];

    if (Array.isArray(res.text)) {
      res.text.forEach((line) => {
        const t = String(line || '').trim();
        if (t) texts.push(t);
      });
    } else if (typeof res.text === 'string') {
      res.text.split(/\r?\n/).forEach((line) => {
        const t = line.trim();
        if (t) texts.push(t);
      });
    }

    if (!texts.length) throw new Error('OCR 未识别出任何文本');
    return texts;
  }

  // ========== Invoice parsing helpers (from your popup.js) ==========

  function extractValueAfterKeyword(texts, keyword, transform) {
    const fn = transform || ((v) => v);
    for (let i = 0; i < texts.length; i++) {
      const raw = String(texts[i] || '').replace(/\s/g, '');
      const idx = raw.indexOf(keyword);
      if (idx !== -1) {
        let v = raw.slice(idx + keyword.length).replace(/^[:：\-]/, '');
        v = fn(v);
        if (v) return v;
        if (i + 1 < texts.length) {
          const next = fn(String(texts[i + 1] || ''));
          if (next) return next;
        }
      }
    }
    return '';
  }

  function parseChineseYear(str) {
    let s = String(str || '').replace(/[^0-9零〇一二三四五六七八九]/g, '');
    if (!s) return null;
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    const map = { '零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    let digits = '';
    for (const ch of s) {
      if (!(ch in map)) return null;
      digits += String(map[ch]);
    }
    return digits.length === 4 ? parseInt(digits, 10) : null;
  }

  function parseChineseInt(str) {
    let s = String(str || '').replace(/[^0-9零〇一二三四五六七八九十]/g, '');
    if (!s) return null;
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    const map = { '零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    if (s === '十') return 10;
    const idx = s.indexOf('十');
    if (idx === 0) {
      const u = map[s[1]] || 0;
      return 10 + u;
    }
    if (idx === s.length - 1) {
      const t = map[s[0]] || 0;
      return t * 10;
    }
    if (idx > 0) {
      const t = map[s[0]] || 0;
      const u = map[s[s.length - 1]] || 0;
      return t * 10 + u;
    }
    return null;
  }

  function formatYmd(y, m, d) {
    if (!y || !m || !d) return '';
    if (m < 1 || m > 12 || d < 1 || d > 31) return '';
    const mm = m < 10 ? '0' + m : String(m);
    const dd = d < 10 ? '0' + d : String(d);
    return String(y) + mm + dd;
  }

  function normalizeChineseDate(str) {
    let s = String(str || '').trim().replace(/\s/g, '');
    if (!s) return '';
    if (s.includes('年') && s.includes('月')) {
      const yPart = s.split('年')[0];
      const rest = s.split('年')[1] || '';
      const mPart = rest.split('月')[0];
      const afterM = rest.split('月')[1] || '';
      const dPart = afterM.replace(/[日号].*/, '');
      const y = parseChineseYear(yPart);
      const m = parseChineseInt(mPart);
      const d = parseChineseInt(dPart);
      const r = formatYmd(y, m, d);
      if (r) return r;
    }
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (m) return formatYmd(+m[1], +m[2], +m[3]);
    m = s.match(/^(\d{4})(\d{2})(\d{2})/);
    if (m) return formatYmd(+m[1], +m[2], +m[3]);
    return '';
  }

	  function extractInvoiceFields(texts) {
	    // 1）发票号码：优先使用“发票号码”关键字后的数字
	    let invoiceNumber = extractValueAfterKeyword(
	      texts,
	      '发票号码',
	      (v) => v.replace(/[^0-9]/g, ''),
	    );

	    // 2）回退：如果关键字提取不到有效的 20 位号码，则在所有行中查找独立的 20 位数字
	    if (!invoiceNumber || invoiceNumber.length !== 20) {
	      outer: for (const line of texts) {
	        const raw = String(line || '');
	        // 匹配前后都不是数字的连续 20 位数字
	        const m = raw.match(/(^|[^0-9])(\d{20})(?!\d)/);
	        if (m && m[2]) {
	          invoiceNumber = m[2];
	          break outer;
	        }
	      }
	    }

	    // 日期与金额逻辑保持不变
	    const rawDate = extractValueAfterKeyword(texts, '开票日期', (v) => v);
	    const invoiceDate = rawDate ? normalizeChineseDate(rawDate) : '';
	    const amount = extractValueAfterKeyword(texts, '小写', (v) => {
	      const m = String(v || '').match(/[0-9]+(?:\.[0-9]+)?/);
	      return m ? m[0] : '';
	    });
	    return { invoiceNumber, invoiceDate, amount };
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
    return true;
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件。', true);
      return;
    }
    try {
      const texts = await runPaddleOcr(file);
      console.log('[OCR] 识别出的文本行:', texts);
      const { invoiceNumber, invoiceDate, amount } = extractInvoiceFields(texts);
      if (!invoiceNumber && !invoiceDate && !amount) {
        throw new Error('未在图片中识别到发票号码、开票日期或金额，请检查图片清晰度。');
      }
      const okFphm = fillField('fphm', invoiceNumber);
      const okKprq = fillField('kprq', invoiceDate);
      const okKjje = fillField('kjje', amount);
      setStatus(
        `识别成功：发票号码${okFphm ? '✅' : '❌'}，开票日期${okKprq ? '✅' : '❌'}，金额${okKjje ? '✅' : '❌'}`,
        false,
      );
    } catch (e) {
      setStatus(e.message || String(e), true);
      console.error(e);
    }
  }

  // ========== Drag & drop + click to select ==========

  function initDragAndDrop(panel) {
    const dropArea = panel.querySelector('#invoice-ocr-drop');
    const fileInput = panel.querySelector('#invoice-ocr-file');

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
	    setStatus('就绪：拖拽或点击选择发票图片。', false);
	    initDragAndDrop(panel);
	    // // 页面载入后立即在后台预热 PaddleJS OCR 模型
	    // ensurePaddleOcr()
	    //   .then(() => {
	    //     // 预加载完成后更新提示
	    //     setStatus('PaddleJS OCR 模型已就绪：拖拽或点击选择发票图片。', false);
	    //   })
	    //   .catch((e) => {
	    //     console.error('[PaddleOCR] 预加载失败', e);
	    //     // 预加载失败不影响后续在上传图片时再次尝试初始化
	    //   });
	  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();