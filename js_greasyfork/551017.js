// ==UserScript==
// @name         贴吧主题屏蔽工具：按data-tid屏蔽主题 + 可单独解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在贴吧帖子列表中，在每个帖子旁添加屏蔽按钮，点击即可按data-tid屏蔽该主题；右下角面板可逐个解除屏蔽
// @author       zyo
// @match        https://tieba.baidu.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551017/%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A2%98%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%9A%E6%8C%89data-tid%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%20%2B%20%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/551017/%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A2%98%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%9A%E6%8C%89data-tid%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%20%2B%20%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ---- 常量 & 存储 ---- ***/
  const STORE_BLOCKED = 'tb_blocked_threads_v1'; // [{ tid:'10071541982', title:'示例帖子' }, ...]

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$
 = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getBlocked = () => JSON.parse(localStorage.getItem(STORE_BLOCKED) || '[]');
  const setBlocked = (arr) => localStorage.setItem(STORE_BLOCKED, JSON.stringify(arr));

  const hasTid = (tid) => getBlocked().some(it => it.tid === tid);
  const addBlocked = (tid, title) => {
    if (!hasTid(tid)) {
      const list = getBlocked();
      list.push({ tid, title });
      setBlocked(list);
      refreshPanel();
    }
  };
  const removeBlocked = (tid) => {
    const list = getBlocked().filter(it => it.tid !== tid);
    setBlocked(list);
    refreshPanel();
  };

  /*** ---- 给帖子添加屏蔽按钮 ---- ***/
  function patchOneThread(thread) {
    if (!thread || thread.__tb_patched__) return;

    // 获取帖子标题
    const titleEl = thread.querySelector('.j_th_tit') || thread.querySelector('a');
    if (!titleEl) return;

    const title = titleEl.textContent.trim();
    const tid = thread.getAttribute('data-tid');

    if (!tid) return;

    // 已屏蔽则隐藏
    if (hasTid(tid)) {
      thread.style.display = 'none';
      thread.__tb_patched__ = true;
      return;
    }

    // 已经加过按钮就不重复
    if (thread.querySelector('.tb-block-thread-btn')) {
      thread.__tb_patched__ = true;
      return;
    }

    // 创建屏蔽按钮
    const btn = document.createElement('button');
    btn.className = 'tb-block-thread-btn';
    btn.textContent = '屏蔽';
    btn.style.cssText = 'margin-left:10px; padding:2px 6px; font-size:12px; color:#fff; background:#f44336; border:none; border-radius:3px; cursor:pointer;';
    btn.title = '屏蔽此主题';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      addBlocked(tid, title);
      thread.style.display = 'none';
    });

    // 将按钮插入到标题后面
    titleEl.parentNode.insertBefore(btn, titleEl.nextSibling);
    thread.__tb_patched__ = true;
  }

  /*** ---- 扫描帖子列表 ---- ***/
  function scanAndPatch() {
    // 选择器可能需要根据实际页面结构调整
    $$('.j_thread_list, .thread_item_box, li[data-tid]', document).forEach(thread => {
      patchOneThread(thread);
    });
  }

  /*** ---- 右下角：管理面板 ---- ***/
  function ensurePanel() {
    if ($('#tb-unblock-panel')) return;

    const box = document.createElement('div');
    box.id = 'tb-unblock-panel';
    box.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 99999;
      background: #fff;
      border: 1px solid #e5e5e5;
      padding: 8px 10px;
      box-shadow: 0 6px 16px rgba(0,0,0,.12);
      border-radius: 10px;
      font-size: 12px;
      max-width: 300px;
    `;

    box.innerHTML = `
      <div style="margin-bottom:6px; font-weight:600;">已屏蔽的主题</div>
      <select id="tb-unblock-select" style="width:100%; margin-bottom:8px;"></select>
      <div style="display:flex; justify-content:space-between;">
        <button id="tb-unblock-one" style="padding:4px 8px;">解除所选</button>
        <button id="tb-unblock-all" style="padding:4px 8px;">全部恢复</button>
      </div>
    `;

    document.body.appendChild(box);

    $('#tb-unblock-one').addEventListener('click', () => {
      const sel = $('#tb-unblock-select');
      const tid = sel.value;
      if (!tid) return;
      removeBlocked(tid);
      // 重新扫描页面，显示已解除的帖子
      $$
('.j_thread_list, .thread_item_box, li[data-tid]').forEach(thread => {
        thread.style.display = '';
        thread.__tb_patched__ = false;
      });
      scanAndPatch();
    });

    $('#tb-unblock-all').addEventListener('click', () => {
      if (!confirm('确定要解除所有屏蔽的主题吗？')) return;
      setBlocked([]);
      refreshPanel();
      $$('.j_thread_list, .thread_item_box, li[data-tid]').forEach(thread => {
        thread.style.display = '';
        thread.__tb_patched__ = false;
      });
      scanAndPatch();
    });

    refreshPanel();
  }

  function refreshPanel() {
    const sel = $('#tb-unblock-select');
    if (!sel) return;
    const list = getBlocked();
    sel.innerHTML = '';
    if (list.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '（当前无屏蔽）';
      sel.appendChild(opt);
      return;
    }
    list.forEach(it => {
      const opt = document.createElement('option');
      opt.value = it.tid;
      opt.textContent = `${it.title}  [${it.tid}]`;
      sel.appendChild(opt);
    });
  }

  /*** ---- 观察 DOM 变化，处理动态加载 ---- ***/
  const observer = new MutationObserver(() => {
    ensurePanel();
    scanAndPatch();
  });

  function start() {
    ensurePanel();
    scanAndPatch();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 等待页面上出现帖子列表再启动
  const wait = setInterval(() => {
    if ($('.j_thread_list') || $('.thread_item_box') || $('li[data-tid]')) {
      clearInterval(wait);
      start();
    }
  }, 300);

})();