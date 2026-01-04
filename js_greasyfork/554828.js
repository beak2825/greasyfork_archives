// ==UserScript==
// @name         NGS-AF列自动排序
// @namespace    http://tampermonkey.net/
// @version      2025-11-08
// @description  对 NGS 网页的 success-row 中含 '%' 的 AF 值进行降序排序；不含 '%' 的 success-row 将被保留且保持原有顺序（不会阻止排序）。
// @author       QXY
// @match        http://ngs-report.mtttt.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554828/NGS-AF%E5%88%97%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554828/NGS-AF%E5%88%97%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const LOG_PREFIX = '[AF-SORTER]';
  const SORT_DELAY = 400;
  const API_KEYWORD = 'input_push'; // 请求关键字

  let observer;
  let isSorting = false;

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function getAFColId() {
    const afHeader = [...document.querySelectorAll('thead .vxe-cell--title')]
      .find(el => el.textContent.trim() === 'AF');
    const afTh = afHeader?.closest('th');
    return afTh?.getAttribute('colid') || null;
  }

  function sortSuccessRows() {
    if (isSorting) return;
    const tbody = document.querySelector('tbody');
    if (!tbody) {
      log('❌ 未找到 <tbody>');
      return;
    }

    const afColId = getAFColId();
    if (!afColId) {
      log('❌ 未找到 AF 列');
      return;
    }

    const rows = Array.from(tbody.querySelectorAll('tr.vxe-body--row'));
    if (!rows.length) {
      log('⚠️ 无表格行');
      return;
    }

    // 区分 success-row 和 非 success-row（右侧固定栏的行也对应相同的 rowid）
    const successRows = rows.filter(tr => tr.classList.contains('success-row'));
    const otherRows = rows.filter(tr => !tr.classList.contains('success-row'));

    if (!successRows.length) {
      log('ℹ️ 无 success-row，无需排序');
      return;
    }

    // 将 successRows 分成含 '%' 的（需要参与排序）和不含 '%' 的（保留原序，不参与排序）
    const percentSuccessRows = [];
    const nonPercentSuccessRows = [];

    successRows.forEach(tr => {
      const cell = tr.querySelector(`td[colid="${afColId}"] span`);
      const txt = cell ? cell.textContent.trim() : '';
      if (txt.includes('%')) percentSuccessRows.push(tr);
      else nonPercentSuccessRows.push(tr);
    });

    if (!percentSuccessRows.length) {
      log('ℹ️ success-row 中无含 % 的行，无需排序');
      return;
    }

    // 暂停 observer，避免循环触发
    if (observer) observer.disconnect();
    isSorting = true;

    log(`开始排序：仅对 ${percentSuccessRows.length} 行（含 % 的 success-row）进行降序`);

    // 获取 AF 值（数值）并排序
    const rowsWithAF = percentSuccessRows.map(tr => {
      const raw = tr.querySelector(`td[colid="${afColId}"] span`)?.textContent || '';
      const val = parseFloat(raw.replace('%', '').replace(/[^0-9.\-]/g, '')) || 0;
      return { tr, val, rowid: tr.getAttribute('rowid') };
    });

    rowsWithAF.sort((a, b) => b.val - a.val);

    // 重新构建 tbody：先按 AF 排序的含 % 的 success-row，接着是原序的非 % 的 success-row，最后是其他行
    tbody.innerHTML = '';
    rowsWithAF.forEach(({ tr }) => tbody.appendChild(tr));
    nonPercentSuccessRows.forEach(tr => tbody.appendChild(tr));
    otherRows.forEach(tr => tbody.appendChild(tr));

    // 同步右侧固定栏（如果存在），注意也要把非 % 的 success-row 一并保留
    const rightWrapper = document.querySelector('.vxe-table--body-wrapper.fixed-right--wrapper');
    if (rightWrapper) {
      const rightTbody = rightWrapper.querySelector('tbody');
      if (rightTbody) {
        const rightRows = Array.from(rightTbody.querySelectorAll('tr.vxe-body--row'));
        const rightMap = Object.fromEntries(rightRows.map(r => [r.getAttribute('rowid'), r]));

        // 清空右侧 tbody 并按同样顺序重新填充：排序后的含% success-row -> non% success-row -> 其他
        rightTbody.innerHTML = '';

        rowsWithAF.forEach(({ rowid }) => {
          const rr = rightMap[rowid];
          if (rr) rightTbody.appendChild(rr);
        });
        nonPercentSuccessRows.forEach(tr => {
          const rowid = tr.getAttribute('rowid');
          const rr = rightMap[rowid];
          if (rr) rightTbody.appendChild(rr);
        });

        // 其余非 success-row 行
        rightRows
          .filter(r => !r.classList.contains('success-row'))
          .forEach(r => rightTbody.appendChild(r));

        log('✅ 同步右侧固定栏排序完成');
      }
    }

    log('✅ 排序完成（AF 含 % 的 success-row 降序，其余保留原序）');

    // 延迟恢复 observer
    setTimeout(() => {
      if (observer && tbody) observer.observe(tbody, { childList: true, subtree: true });
      isSorting = false;
    }, 1000);
  }

  function observeTableChanges() {
    const tbody = document.querySelector('tbody');
    if (!tbody) {
      log('找不到 tbody，等待中...');
      return;
    }

    observer = new MutationObserver((mutations) => {
      if (isSorting) return;
      const hasRowChange = mutations.some(m =>
        Array.from(m.addedNodes).some(n => n.nodeName === 'TR' || n.nodeName === 'TBODY')
      );
      if (hasRowChange) {
        clearTimeout(tbody._sortTimer);
        tbody._sortTimer = setTimeout(sortSuccessRows, SORT_DELAY);
      }
    });

    observer.observe(tbody, { childList: true, subtree: true });
    log('👀 MutationObserver 启动完成');
  }

  function hookFetch() {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const url = args[0];
      const isTarget = typeof url === 'string' && url.includes(API_KEYWORD);

      if (isTarget) {
        log(`🌐 拦截到 fetch 请求: ${url}`);
      }

      const response = await originalFetch.apply(this, args);

      if (isTarget) {
        setTimeout(() => {
          log('🕓 fetch 请求完成后尝试排序...');
          sortSuccessRows();
        }, 1000);
      }

      return response;
    };

    log('✅ fetch 已被劫持监听');
  }

  function hookXHR() {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._url = url;
      return open.call(this, method, url, ...rest);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('load', function () {
        if (this._url && this._url.includes(API_KEYWORD)) {
          log(`🌐 XHR 请求完成: ${this._url}`);
          setTimeout(sortSuccessRows, 1000);
        }
      });
      return send.call(this, ...args);
    };

    log('✅ XHR 已被劫持监听');
  }

  function init() {
    log('初始化中...');
    const interval = setInterval(() => {
      const hasTable = document.querySelector('thead .vxe-cell--title');
      if (hasTable) {
        clearInterval(interval);
        log('✅ 表格检测到，启动排序系统');
        sortSuccessRows();
        observeTableChanges();
      }
    }, 1000);

    hookFetch();
    hookXHR();
  }

  init();
})();
