// ==UserScript==
// @name         第一阶段截图信息打码版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  第一阶打码版
// @match        https://crgk.gxeea.cn:7979/cgbm/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      jc.gxeea.cn
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549594/%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%E6%88%AA%E5%9B%BE%E4%BF%A1%E6%81%AF%E6%89%93%E7%A0%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549594/%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%E6%88%AA%E5%9B%BE%E4%BF%A1%E6%81%AF%E6%89%93%E7%A0%81%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ======= 配置 =======
  const ID_REGEX = /^\d{15}$|^\d{17}[\dXx]$/;
  const STABLE_MS = 500; // 内容稳定时间（ms）
  const IMAGE_FETCH_TIMEOUT = 15000; // 图片下载超时（ms）

  // ======= 小工具 =======
  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function showToast(msg, ms = 2200) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 2147483647,
      background: 'rgba(0,0,0,.72)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '13px',
      boxShadow: '0 2px 6px rgba(0,0,0,.2)'
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  function getActiveModal() {
    const all = Array.from(document.querySelectorAll('.ivu-modal-content'));
    for (const m of all) {
      if (!isVisible(m)) continue;
      const title = m.querySelector('.ivu-modal-header-inner');
      if (title && title.textContent.trim().includes('报名详情')) return m;
    }
    return all.find(isVisible) || null;
  }

  function extractId(modal) {
    if (!modal) return '';
    const tds = modal.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      const txt = tds[i].textContent.trim();
      if (txt === '证件号码' || txt.includes('证件号码')) {
        const val = tds[i + 1]?.textContent?.trim() || '';
        if (ID_REGEX.test(val)) return val;
      }
    }
    return '';
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ======= 打码工具 =======
  function maskString(str) {
    if (!str) return '';
    if (str.includes('@')) {
      // 邮箱，****@***
      let [name, domain] = str.split('@');
      if (name.length > 0) {
        return name.slice(0, 0) + '****@' + domain;
      } else {
        return '***@' + domain;
      }
    } else if (/^\d{11}$/.test(str)) {
      // 手机号 186****1972
      return str.slice(0, 3) + '****' + str.slice(-4);
    } else if (/^\d{17}[\dXx]$/.test(str)) {
      // 身份证 4521**********0926
      return str.slice(0, 4) + '**********' + str.slice(-4);
    } else if (str.length > 7) {
      // 地址类，保留前6位
      return str.slice(0, 7) + '******';
    }
    return '****';
  }

  function sanitizeClone(clone) {
    // 打码字段
    const sensitiveKeys = [
      "证件号码",
      "绑定手机号",
      "邮箱",
      "寄达地址",
      "常住地址",
      "法律文书邮寄地址"
    ];

    clone.querySelectorAll("td").forEach(td => {
      const label = td.previousElementSibling?.innerText?.trim() || "";
      const val = td.textContent.trim();
      if (!val) return;
      for (let key of sensitiveKeys) {
        if (label.includes(key)) {
          td.textContent = maskString(val);
          td.style.color = "#333333";
          break;
        }
      }
    });

    // 删除志愿2及以下
    const z2 = Array.from(clone.querySelectorAll("div.title-name"))
      .find(el => el.textContent.includes("志愿2"));
    if (z2) {
      let node = z2;
      while (node) {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
      }
    }
  }

  // ======= 使用 GM_xmlhttpRequest 获取图片 Blob（返回 Blob） =======
  function gmFetchBlob(url) {
    return new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => {
        if (!done) {
          done = true;
          reject(new Error('fetch timeout'));
        }
      }, IMAGE_FETCH_TIMEOUT);

      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          responseType: 'blob',
          onload(res) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            if (res.status >= 200 && res.status < 400) resolve(res.response);
            else reject(new Error('status ' + res.status));
          },
          onerror(err) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            reject(err || new Error('gm xhr error'));
          },
          ontimeout() {
            if (done) return;
            done = true;
            clearTimeout(timer);
            reject(new Error('timeout'));
          }
        });
      } catch (e) {
        clearTimeout(timer);
        reject(e);
      }
    });
  }

  // ======= 把 clone 中的外部图片替换为 blob:// URL =======
  async function replaceImagesWithBlobs(clone) {
    const imgs = Array.from(clone.querySelectorAll('img'));
    const blobUrls = [];
    const jobs = imgs.map(img => new Promise(async (resolve) => {
      try {
        const src = img.getAttribute('src') || img.src || '';
        if (!src || src.startsWith('data:')) return resolve();
        if (src.startsWith('blob:')) return resolve();

        try {
          const blob = await gmFetchBlob(src);
          const url = URL.createObjectURL(blob);
          blobUrls.push(url);
          img.src = url;
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        } catch (e) {
          console.warn('图片抓取失败，保留原始 URL：', src, e);
          resolve();
        }
      } catch (err) {
        console.warn('replaceImagesWithBlobs error', err);
        resolve();
      }
    }));

    await Promise.race([Promise.all(jobs), new Promise(r => setTimeout(r, 5000))]);
    await new Promise(r => setTimeout(r, 200));
    return blobUrls;
  }

  // ======= 截图并下载 =======
  async function captureAndSave(modal, idValue) {
    try {
      showToast('⏳ 准备截图：展开弹窗并处理图片…');

      // 克隆
      const clone = modal.cloneNode(true);

      // ✅ 敏感信息打码 + 删除志愿2+
      sanitizeClone(clone);

      const computed = window.getComputedStyle(modal);
      const width = computed.width || (modal.offsetWidth + 'px');
      clone.style.transform = 'none';
      Object.assign(clone.style, {
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '12px',
        zIndex: '2147483647',
        maxHeight: 'none',
        height: 'auto',
        overflow: 'visible',
        background: '#fff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        width: width,
        pointerEvents: 'none'
      });
      clone.querySelectorAll('.ivu-modal-close').forEach(node => node.remove());

      document.body.appendChild(clone);

      const blobUrls = await replaceImagesWithBlobs(clone);
      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(clone, {
        backgroundColor: '#fff',
        useCORS: false,
        scale: 2,
        allowTaint: false
      });

      clone.remove();

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (!blob) throw new Error('生成图片失败');

      const dlUrl = URL.createObjectURL(blob);
      GM_download({
        url: dlUrl,
        name: `${idValue}.jpg`,
        saveAs: false
      });

      showToast(`✅ 已保存：${idValue}.jpg`, 3500);

      setTimeout(() => {
        try { URL.revokeObjectURL(dlUrl); } catch (e) {}
        blobUrls.forEach(u => {
          try { URL.revokeObjectURL(u); } catch (e) {}
        });
      }, 30000);

    } catch (err) {
      console.error('captureAndSave error', err);
      showToast('⚠️ 截图失败（详情见控制台）', 4000);
    }
  }

  // ======= 自动监听逻辑 =======
  let lastCapturedId = '';
  let pendingId = '';
  let stableTimer = null;

  const scheduleCapture = debounce(() => {
    const modal = getActiveModal();
    if (!modal) return;
    const idValue = extractId(modal);
    if (!ID_REGEX.test(idValue)) return;
    if (idValue === lastCapturedId) return;

    clearTimeout(stableTimer);
    stableTimer = setTimeout(() => {
      const reModal = getActiveModal();
      const reId = reModal ? extractId(reModal) : '';
      if (reModal && reId === idValue) {
        lastCapturedId = idValue;
        captureAndSave(reModal, idValue);
      }
    }, 200);
  }, STABLE_MS);

  function hookContentObserver() {
    const modal = getActiveModal();
    if (!modal) return;
    const body = modal.querySelector('.ivu-modal-body') || modal;
    if (body._monitored) return;
    body._monitored = true;

    const observer = new MutationObserver(() => {
      const idVal = extractId(modal);
      if (ID_REGEX.test(idVal) && idVal !== pendingId) {
        pendingId = idVal;
      }
      scheduleCapture();
    });

    observer.observe(body, { childList: true, subtree: true, characterData: true });

    const wrap = modal.closest('.ivu-modal-wrap') || modal.parentElement || document.body;
    const wrapObs = new MutationObserver(() => {
      if (!isVisible(modal)) {
        pendingId = '';
        body._monitored = false;
        try { observer.disconnect(); wrapObs.disconnect(); } catch (e) {}
        setTimeout(hookContentObserver, 200);
      }
    });
    wrapObs.observe(wrap, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  const rootObs = new MutationObserver(() => {
    const modal = getActiveModal();
    if (modal) hookContentObserver();
  });
  rootObs.observe(document.body, { childList: true, subtree: true });

  setTimeout(hookContentObserver, 400);

  // ======= 手动按钮 =======
  (function addManualBtn() {
    const btn = document.createElement('button');
    btn.textContent = '📸 截图保存';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 2147483647,
      padding: '8px 14px',
      background: '#409EFF',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      boxShadow: '0 2px 6px rgba(0,0,0,.2)'
    });
    btn.addEventListener('click', async () => {
      const modal = getActiveModal();
      if (!modal) return showToast('⚠️ 未检测到【报名详情】弹窗可见');
      const idVal = extractId(modal);
      if (!ID_REGEX.test(idVal)) return showToast('⚠️ 证件号码未就绪，请稍等片刻再试');
      await captureAndSave(modal, idVal);
    });
    document.body.appendChild(btn);
  })();

})();
