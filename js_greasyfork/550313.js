// ==UserScript==
// @name         贴吧个性动态：按吧名加“X”并按 fid 屏蔽 + 可单独解除
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在贴吧首页“个性动态”中，在每条“XXX吧”后加一个X；点击即可按fid屏蔽该吧；右下角面板可逐个解除屏蔽
// @author       zyo
// @match        https://tieba.baidu.com/
// @match        https://tieba.baidu.com/?*
// @match        https://tieba.baidu.com/index.html
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550313/%E8%B4%B4%E5%90%A7%E4%B8%AA%E6%80%A7%E5%8A%A8%E6%80%81%EF%BC%9A%E6%8C%89%E5%90%A7%E5%90%8D%E5%8A%A0%E2%80%9CX%E2%80%9D%E5%B9%B6%E6%8C%89%20fid%20%E5%B1%8F%E8%94%BD%20%2B%20%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550313/%E8%B4%B4%E5%90%A7%E4%B8%AA%E6%80%A7%E5%8A%A8%E6%80%81%EF%BC%9A%E6%8C%89%E5%90%A7%E5%90%8D%E5%8A%A0%E2%80%9CX%E2%80%9D%E5%B9%B6%E6%8C%89%20fid%20%E5%B1%8F%E8%94%BD%20%2B%20%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ---- 常量 & 存储 ---- ***/
  const STORE_BLOCKED = 'tb_blocked_v2';       // [{ key:'fid:123', name:'上海大学吧' }, ...]
  const STORE_FIDCACHE = 'tb_kw_fid_cache_v1'; // { '上海大学': '123', ... }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getBlocked = () => JSON.parse(localStorage.getItem(STORE_BLOCKED) || '[]');
  const setBlocked = (arr) => localStorage.setItem(STORE_BLOCKED, JSON.stringify(arr));

  const getFidCache = () => JSON.parse(localStorage.getItem(STORE_FIDCACHE) || '{}');
  const setFidCache = (obj) => localStorage.setItem(STORE_FIDCACHE, JSON.stringify(obj));

  const hasKey = (key) => getBlocked().some(it => it.key === key);
  const addBlocked = (key, name) => {
    if (!hasKey(key)) {
      const list = getBlocked();
      list.push({ key, name });
      setBlocked(list);
      refreshPanel();
    }
  };
  const removeBlocked = (key) => {
    const list = getBlocked().filter(it => it.key !== key);
    setBlocked(list);
    refreshPanel();
  };

  /*** ---- 工具：从“XXX吧”链接提取 kw/fid ---- ***/
  function extractKwFidFromAnchor(a) {
    if (!a) return { kw: null, fid: null };
    let url;
    try { url = new URL(a.getAttribute('href'), location.origin); }
    catch { return { kw: null, fid: null }; }

    const sp = url.searchParams;
    let fid = sp.get('fid');
    let kw = sp.get('kw');

    // 有些链接是 /f?ie=utf-8&kw=xxx
    if (!kw) {
      const m = url.search.match(/[?&]kw=([^&]+)/i);
      if (m) kw = decodeURIComponent(m[1].replace(/\+/g, ' '));
    }
    return { kw, fid };
  }

  /*** ---- 通过 kw 获取 fid（先本地缓存，后请求接口） ---- ***/
  async function kw2fid(kw) {
    if (!kw) return null;
    const cache = getFidCache();
    if (cache[kw]) return cache[kw];

    try {
      // 贴吧公开接口：返回 { no:0, data:{ fid: "xxxx", ... } }
      const res = await fetch(`/f/commit/share/fnameShareApi?fname=${encodeURIComponent(kw)}`, { credentials: 'same-origin' });
      const json = await res.json();
      const fid = json?.data?.fid ? String(json.data.fid) : null;
      if (fid) {
        cache[kw] = fid;
        setFidCache(cache);
        return fid;
      }
    } catch (e) {
      // 忽略错误，后续用 kw 兜底
    }
    return null;
  }

  /*** ---- 判断某条 li 是否被屏蔽 ---- ***/
  function isBlocked({ fid, kw }) {
    const keys = getBlocked().map(it => it.key);
    if (fid && keys.includes(`fid:${fid}`)) return true;
    if (kw && keys.includes(`kw:${kw}`)) return true; // 极端兜底
    return false;
  }

  /*** ---- 给“XXX吧”后面加 X，并根据屏蔽状态隐藏 li ---- ***/
  async function patchOneLi(li) {
    if (!li || li.__tb_patched__) return;
    // 找到“XXX吧”的链接：优先 /f?kw= 或含 fid= 的链接，且文本带“吧”
    const forumLink = li.querySelector(
      "a[href*='/f?kw='], a[href*='tieba.baidu.com/f?kw='], a[href*='fid=']"
    );

    if (!forumLink || !/吧/.test(forumLink.textContent.trim())) {
      return; // 不是目标块
    }

    const name = forumLink.textContent.trim(); // 例如 “上海大学吧”
    let { kw, fid } = extractKwFidFromAnchor(forumLink);
    if (!fid) fid = await kw2fid(kw); // 优先拿到 fid

    // 已屏蔽则隐藏
    if (isBlocked({ fid, kw })) {
      li.style.display = 'none';
      li.__tb_patched__ = true;
      return;
    }

    // 已经加过 X 就不重复
    if (forumLink.nextElementSibling && forumLink.nextElementSibling.classList?.contains('tb-block-x')) {
      li.__tb_patched__ = true;
      return;
    }

    // 插入“X”按钮（紧跟在吧名链接后）
    const btn = document.createElement('span');
    btn.className = 'tb-block-x';
    btn.textContent = ' ×';
    btn.title = '屏蔽此吧';
    btn.style.cssText = 'margin-left:6px; cursor:pointer; color:#c00; font-weight:bold;';

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      // 确保有 fid，尽量再查一次
      let finalFid = fid || await kw2fid(kw);
      const key = finalFid ? `fid:${finalFid}` : `kw:${kw}`;
      addBlocked(key, name);
      li.style.display = 'none';
    });

    forumLink.insertAdjacentElement('afterend', btn);
    li.__tb_patched__ = true;
  }

  /*** ---- 扫描个性动态 .new_list 下的 li ---- ***/
  function scanAndPatch() {
    const listRoot = $('.new_list');
    if (!listRoot) return;
    $$('.new_list li', document).forEach(li => { patchOneLi(li); });
  }

  /*** ---- 右下角：下拉面板（可单独解除） ---- ***/
  function ensurePanel() {
    if ($('#tb-unblock-panel')) return;

    const box = document.createElement('div');
    box.id = 'tb-unblock-panel';
    box.innerHTML = `
      <div style="
        position:fixed; right:16px; bottom:16px; z-index:99999;
        background:#fff; border:1px solid #e5e5e5; padding:8px 10px;
        box-shadow:0 6px 16px rgba(0,0,0,.12); border-radius:10px; font-size:12px;">
        <div style="margin-bottom:6px; font-weight:600;">屏蔽的吧</div>
        <select id="tb-unblock-select" style="max-width:260px; min-width:220px;"></select>
        <button id="tb-unblock-one" style="margin-left:6px;">解除所选</button>
        <button id="tb-unblock-all" style="margin-left:6px;">全部恢复</button>
      </div>
    `;
    document.body.appendChild(box);

    $('#tb-unblock-one').addEventListener('click', () => {
      const sel = $('#tb-unblock-select');
      const key = sel.value;
      if (!key) return;
      removeBlocked(key);
      // 立即把已隐藏的对应 li 显示回来（下一次扫描也会显示）
      $$(`.new_list li`).forEach(li => {
        li.style.display = '';
        li.__tb_patched__ = false; // 允许重新打补丁
      });
      scanAndPatch();
    });

    $('#tb-unblock-all').addEventListener('click', () => {
      if (!confirm('确定要解除所有屏蔽的吧吗？')) return;
      setBlocked([]);
      refreshPanel();
      $$(`.new_list li`).forEach(li => {
        li.style.display = '';
        li.__tb_patched__ = false;
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
      opt.value = it.key;
      opt.textContent = `${it.name}  [${it.key}]`;
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

  // 等待页面上出现 .new_list 再启动
  const wait = setInterval(() => {
    if ($('.new_list')) {
      clearInterval(wait);
      start();
    }
  }, 300);

})();
