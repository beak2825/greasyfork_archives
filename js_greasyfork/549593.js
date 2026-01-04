// ==UserScript==
// @name         成考第一阶段 报名详情弹窗完整截图（支持滚动内容 & 跨域头像）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  当报名详情证件号码稳定出现时，自动展开弹窗并完整截图（JPG），图片名为证件号码；支持跨域头像抓取；并保留手动按钮兜底。
// @match        #https://crgk.gxeea.cn:7979/cgbm/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      jc.gxeea.cn
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549593/%E6%88%90%E8%80%83%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%20%E6%8A%A5%E5%90%8D%E8%AF%A6%E6%83%85%E5%BC%B9%E7%AA%97%E5%AE%8C%E6%95%B4%E6%88%AA%E5%9B%BE%EF%BC%88%E6%94%AF%E6%8C%81%E6%BB%9A%E5%8A%A8%E5%86%85%E5%AE%B9%20%20%E8%B7%A8%E5%9F%9F%E5%A4%B4%E5%83%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549593/%E6%88%90%E8%80%83%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%20%E6%8A%A5%E5%90%8D%E8%AF%A6%E6%83%85%E5%BC%B9%E7%AA%97%E5%AE%8C%E6%95%B4%E6%88%AA%E5%9B%BE%EF%BC%88%E6%94%AF%E6%8C%81%E6%BB%9A%E5%8A%A8%E5%86%85%E5%AE%B9%20%20%E8%B7%A8%E5%9F%9F%E5%A4%B4%E5%83%8F%EF%BC%89.meta.js
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

  // ======= 把 clone 中的外部图片替换为 blob:// URL，返回所有创建的 blobUrls（用于清理） =======
  async function replaceImagesWithBlobs(clone) {
    const imgs = Array.from(clone.querySelectorAll('img'));
    const blobUrls = [];
    const jobs = imgs.map(img => new Promise(async (resolve) => {
      try {
        const src = img.getAttribute('src') || img.src || '';
        if (!src || src.startsWith('data:')) return resolve();
        // 如果已经是 blob URL 则跳过
        if (src.startsWith('blob:')) return resolve();

        // 尝试使用 GM_xmlhttpRequest 下载
        try {
          const blob = await gmFetchBlob(src);
          const url = URL.createObjectURL(blob);
          blobUrls.push(url);
          img.src = url;
          // 等待图片加载完毕（或出错）
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        } catch (e) {
          // 下载失败（可能需要认证/CORS），忽略并继续：html2canvas 可能仍能绘制（或不会）
          console.warn('图片抓取失败，保留原始 URL：', src, e);
          resolve();
        }
      } catch (err) {
        console.warn('replaceImagesWithBlobs error', err);
        resolve();
      }
    }));

    // 等待所有替换（或超时）
    await Promise.race([Promise.all(jobs), new Promise(r => setTimeout(r, 5000))]);
    // 再给浏览器一点时间渲染图片
    await new Promise(r => setTimeout(r, 200));
    return blobUrls;
  }

  // ======= 截图并下载（克隆并展开弹窗以截全内容） =======
  async function captureAndSave(modal, idValue) {
    try {
      showToast('⏳ 准备截图：展开弹窗并处理图片…');

      // 克隆弹窗
      const clone = modal.cloneNode(true);
      const computed = window.getComputedStyle(modal);
      const width = computed.width || (modal.offsetWidth + 'px');

      // 清除内联可能影响渲染的 transform（有时原弹窗有动画transform）
      clone.style.transform = 'none';

      // 设置克隆样式：置顶并展开（避免滚动裁剪）
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
        pointerEvents: 'none' // 防止干扰页面交互
      });

      // 确保视觉一致（可选）
      clone.querySelectorAll('.ivu-modal-close').forEach(node => node.remove()); // 隐藏关闭按钮防止遮挡

      document.body.appendChild(clone);

      // 把图片替换成 blob URL（若能抓取到）
      const blobUrls = await replaceImagesWithBlobs(clone);

      // 小等待，确保渲染稳定
      await new Promise(r => setTimeout(r, 200));

      // 使用 html2canvas 截取克隆（此时克隆已展开，html2canvas 能截取完整高度）
      const canvas = await html2canvas(clone, {
        backgroundColor: '#fff',
        useCORS: false,
        scale: 2,
        allowTaint: false
      });

      // 移除克隆
      clone.remove();

      // 输出 blob 并下载
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (!blob) throw new Error('生成图片失败');

      const dlUrl = URL.createObjectURL(blob);
      GM_download({
        url: dlUrl,
        name: `${idValue}.jpg`,
        saveAs: false
      });

      showToast(`✅ 已保存：${idValue}.jpg`, 3500);

      // 清理临时 blobUrls 与下载 URL（延后清理保证下载成功）
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

  // ======= 自动监听逻辑（证件号稳定出现后截图） =======
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

  // 只监听 modal 内部内容变化
  function hookContentObserver() {
    const modal = getActiveModal();
    if (!modal) return;
    const body = modal.querySelector('.ivu-modal-body') || modal;

    // 若已经挂过 observer（通过 dataset 标记），就跳过（避免重复挂）
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

    // 当 modal 隐藏时，解除标记，下次可重新挂载
    const wrap = modal.closest('.ivu-modal-wrap') || modal.parentElement || document.body;
    const wrapObs = new MutationObserver(() => {
      if (!isVisible(modal)) {
        pendingId = '';
        body._monitored = false;
        try { observer.disconnect(); wrapObs.disconnect(); } catch (e) {}
        // 稍后尝试重新挂载
        setTimeout(hookContentObserver, 200);
      }
    });
    wrapObs.observe(wrap, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  // 监控 document.body，发现 modal 出现时挂载内容 observer
  const rootObs = new MutationObserver(() => {
    const modal = getActiveModal();
    if (modal) hookContentObserver();
  });
  rootObs.observe(document.body, { childList: true, subtree: true });

  // 首次尝试挂载一次
  setTimeout(hookContentObserver, 400);

  // ======= 手动按钮（兜底） =======
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
