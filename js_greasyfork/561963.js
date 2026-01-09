// ==UserScript==
// @name         猫站自动认领
// @namespace    https://greasyfork.org/zh-CN/users/1558131-shinku714
// @version      1.0.0
// @description  猫站用户页自动认领所有可认领种子，提供悬浮UI、自动翻页、进度显示、成功/失败结果列表、查看全部弹窗、暂停/继续、清空记录与本地状态保存。
// @author       Shinku714
// @license      MIT
// @match        https://pterclub.net/getusertorrentlist.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561963/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/561963/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const delayMsBase = 300;
  const delayMsJitter = 200;
  const uiUpdateEvery = 1;
  const fetchRetries = 2;
  const retryWaitMs = 800;

  const showMax = 18;
  const listMaxKeep = 3000;
  const keyMaxKeep = 20000;
  const LS_KEY = 'cat_auto_claim_state_v9';

  let sessionRunning = false;
  let navigating = false;

  let abortCtl = null;
  const newAbort = () => {
    abortCtl = new AbortController();
    return abortCtl;
  };
  const abortNow = () => {
    try { abortCtl && abortCtl.abort(); } catch {}
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const friendlyDelay = () => sleep(delayMsBase + randInt(0, delayMsJitter));

  function decodeUnicodeEscapes(s) {
    return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  function decodeHtmlEntities(s) {
    return s.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  }
  function normalizeText(rawText) {
    if (!rawText) return '';
    let t = String(rawText);
    t = decodeUnicodeEscapes(t);
    t = decodeHtmlEntities(t);
    return t;
  }
  function isClaimSuccess(rawText) {
    const t = normalizeText(rawText);
    if (!t) return false;
    return (
      t.includes('添加成功') ||
      t.includes('认领成功') ||
      t.includes('success') ||
      t.includes('Success') ||
      /\b(success|ok)\b/i.test(t)
    );
  }

  function buildUrl(dataUrl) {
    try {
      return new URL(dataUrl, location.origin).toString();
    } catch {
      const s = String(dataUrl || '');
      if (!s) return '';
      if (s.startsWith('http')) return s;
      const base = location.origin.replace(/\/$/, '');
      const path = s.startsWith('/') ? s : '/' + s;
      return base + path;
    }
  }

  async function fetchTextWithRetry(url, retries = fetchRetries) {
    let lastErr = null;
    for (let i = 0; i <= retries; i++) {
      try {
        const ctl = abortCtl || newAbort();
        const resp = await fetch(url, {
          method: 'GET',
          credentials: 'same-origin',
          signal: ctl.signal
        });
        const text = await resp.text();
        return { ok: resp.ok, status: resp.status, text };
      } catch (e) {
        lastErr = e;
        if (e && (e.name === 'AbortError')) throw e;
        if (i === retries) break;
        const wait = retryWaitMs * Math.pow(2, i) + randInt(0, 250);
        await sleep(wait);
      }
    }
    throw lastErr;
  }

  function extractTorrentName(el) {
    const tr = el.closest('tr');
    if (!tr) return '(未找到名称)';
    const candidates = [
      'a[href*="details.php"] b',
      'a[href*="details.php"][href*="id="]',
      'a[href*="details.php"]',
      '.torrentname a',
      'a'
    ];
    for (const sel of candidates) {
      const node = tr.querySelector(sel);
      const name = node && node.textContent ? node.textContent.trim() : '';
      if (name) return name.replace(/\s+/g, ' ').slice(0, 140);
    }
    const txt = (tr.innerText || tr.textContent || '').trim().replace(/\s+/g, ' ');
    return txt ? txt.slice(0, 140) : '(未知种子)';
  }

  function extractTorrentIdFromRow(el) {
    const tr = el.closest('tr');
    if (!tr) return '';
    const a = tr.querySelector('a[href*="details.php"][href*="id="]') || tr.querySelector('a[href*="details.php"]');
    if (!a) return '';
    try {
      const u = new URL(a.getAttribute('href'), location.origin);
      const id = u.searchParams.get('id');
      return id && /^\d+$/.test(id) ? id : '';
    } catch {
      return '';
    }
  }

  function makeKey(el) {
    const dataUrl = el.getAttribute('data-url') || '';
    const full = buildUrl(dataUrl);
    if (full) {
      try {
        const u = new URL(full);
        const id = u.searchParams.get('id') || u.searchParams.get('torrentid') || u.searchParams.get('tid');
        if (id && /^\d+$/.test(id)) return `id:${id}`;
      } catch {}
    }
    const rowId = extractTorrentIdFromRow(el);
    if (rowId) return `id:${rowId}`;
    const name = extractTorrentName(el);
    return `name:${name}`;
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
  }

  function trimKeep(arr, maxKeep) {
    if (!Array.isArray(arr)) return [];
    if (arr.length <= maxKeep) return arr;
    return arr.slice(arr.length - maxKeep);
  }

  function mergeUnique(oldArr, newArr) {
    const seen = new Set();
    const out = [];
    for (const x of (oldArr || [])) {
      if (!x) continue;
      if (seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
    for (const x of (newArr || [])) {
      if (!x) continue;
      if (seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
    return out;
  }

  function safeSaveState(st) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(st));
      return true;
    } catch (e) {
      try {
        st.okNamesAll = trimKeep(st.okNamesAll || [], Math.max(200, Math.floor((st.okNamesAll || []).length * 0.6)));
        st.failNamesAll = trimKeep(st.failNamesAll || [], Math.max(200, Math.floor((st.failNamesAll || []).length * 0.6)));
        st.okKeysAll = trimKeep(st.okKeysAll || [], Math.max(1000, Math.floor((st.okKeysAll || []).length * 0.6)));
        st.failKeysAll = trimKeep(st.failKeysAll || [], Math.max(1000, Math.floor((st.failKeysAll || []).length * 0.6)));
        localStorage.setItem(LS_KEY, JSON.stringify(st));
        return true;
      } catch {
        return false;
      }
    }
  }

  function clearState() { localStorage.removeItem(LS_KEY); }

  function getPageFromUrl() {
    const u = new URL(location.href);
    const p = u.searchParams.get('page');
    return p === null ? 0 : (parseInt(p, 10) || 0);
  }

  function gotoPage(page) {
    navigating = true;
    const u = new URL(location.href);
    u.searchParams.set('page', String(page));
    location.href = u.toString();
  }

  const style = document.createElement('style');
  style.textContent = `
    #cat-claim-wrap { opacity: .32; transition: opacity .18s ease, transform .18s ease; }
    #cat-claim-wrap:hover { opacity: 1; transform: translateY(-1px); }
    #cat-claim-wrap .cat-card { background: rgba(255,255,255,.92); border: 1px solid rgba(0,0,0,.12); border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,.12); backdrop-filter: blur(4px); }
    #cat-claim-wrap .cat-listbox { scroll-behavior: smooth; }
    #cat-claim-wrap .cat-btn { height: 32px; padding: 0 12px; font-size: 13px; border-radius: 12px; border: 1px solid rgba(0,0,0,.18);
      background: #fff; cursor: pointer; }
    #cat-claim-wrap .cat-btn.small { height: 26px; font-size: 12px; border-radius: 10px; }
    #cat-claim-wrap .cat-status.breath { animation: catBreath 1.2s ease-in-out infinite, catHue 2.2s linear infinite; }
    @keyframes catBreath { 0%,100%{ opacity: .65 } 50%{ opacity: 1 } }
    @keyframes catHue { 0%{ filter: hue-rotate(0deg) } 100%{ filter: hue-rotate(360deg) } }
    #cat-claim-wrap .cat-barbox { height: 8px; border-radius: 999px; overflow: hidden; background: rgba(0,0,0,.10); }
    #cat-claim-wrap .cat-bar { height: 100%; width: 0%; transition: width 120ms linear;
      background: linear-gradient(90deg, rgba(0,0,0,.20), rgba(0,0,0,.55), rgba(0,0,0,.20));
      background-size: 200% 100%;
      animation: catFlow 1.2s linear infinite; }
    @keyframes catFlow { 0%{ background-position: 0% 0% } 100%{ background-position: 200% 0% } }
    #cat-claim-wrap .cat-count.pop { animation: catPop 180ms ease-out; }
    @keyframes catPop { 0%{ transform: scale(1) } 50%{ transform: scale(1.2) } 100%{ transform: scale(1) } }
    #cat-claim-wrap .cat-ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
    #cat-claim-wrap .cat-ol.ok li { border-left: 3px solid rgba(46,160,67,.35); padding-left: 8px; }
    #cat-claim-wrap .cat-ol.fail li { border-left: 3px solid rgba(220,53,69,.28); padding-left: 8px; }
    #cat-claim-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 100000; display: none;
      align-items: center; justify-content: center; padding: 24px; }
    #cat-claim-modal { width: min(900px, 92vw); max-height: 85vh; background: rgba(255,255,255,.96);
      border: 1px solid rgba(0,0,0,.12); border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.25); backdrop-filter: blur(6px);
      display: flex; flex-direction: column; overflow: hidden; }
    #cat-claim-modalhead { display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,.10); }
    #cat-claim-modalbody { padding: 10px 12px; overflow: auto; }
    #cat-claim-text { width: 100%; height: 60vh; resize: none; font-size: 12px; line-height: 1.35;
      border: 1px solid rgba(0,0,0,.12); border-radius: 12px; padding: 10px; background: #fff; }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'cat-claim-wrap';
  wrap.style.position = 'fixed';
  wrap.style.right = '16px';
  wrap.style.bottom = '16px';
  wrap.style.zIndex = '99999';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '8px';
  wrap.style.minWidth = '360px';
  wrap.style.maxWidth = '60vw';
  wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

  const mkCard = (tag = 'div') => {
    const el = document.createElement(tag);
    el.className = 'cat-card';
    el.style.fontSize = '12px';
    el.style.padding = '8px 10px';
    el.style.wordBreak = 'break-word';
    return el;
  };
  const mkBtn = (text, small = false) => {
    const b = document.createElement('button');
    b.textContent = text;
    b.className = 'cat-btn' + (small ? ' small' : '');
    return b;
  };

  const status = mkCard('div');
  status.classList.add('cat-status');
  status.textContent = '猫站：就绪';

  const barBox = document.createElement('div');
  barBox.className = 'cat-barbox';
  const bar = document.createElement('div');
  bar.className = 'cat-bar';
  barBox.appendChild(bar);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '8px';

  const startBtn = mkBtn('开始');
  startBtn.style.flex = '1';
  const stopBtn = mkBtn('暂停');
  const resetBtn = mkBtn('清空记录');

  btnRow.appendChild(startBtn);
  btnRow.appendChild(stopBtn);
  btnRow.appendChild(resetBtn);

  function makeListPanel(titleText, kind) {
    const panel = mkCard('div');

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.alignItems = 'center';
    head.style.justifyContent = 'space-between';
    head.style.gap = '10px';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '8px';

    const title = document.createElement('div');
    title.textContent = titleText;
    title.style.fontWeight = '600';

    const count = document.createElement('div');
    count.textContent = '0';
    count.style.fontWeight = '700';
    count.style.opacity = '0.85';
    count.className = 'cat-count';

    left.appendChild(title);
    left.appendChild(count);

    const allBtn = mkBtn('查看全部', true);
    head.appendChild(left);
    head.appendChild(allBtn);

    const listBox = document.createElement('div');
    listBox.className = 'cat-listbox';
    listBox.style.marginTop = '6px';
    listBox.style.maxHeight = '150px';
    listBox.style.overflow = 'auto';
    listBox.style.paddingRight = '4px';

    const ol = document.createElement('ol');
    ol.className = 'cat-ol ' + kind;

    listBox.appendChild(ol);
    panel.appendChild(head);
    panel.appendChild(listBox);

    return { panel, count, ol, listBox, allBtn, kind };
  }

  const successPanel = makeListPanel('成功', 'ok');
  const failPanel = makeListPanel('失败（可能被认领完或其它错误）', 'fail');

  wrap.appendChild(status);
  wrap.appendChild(barBox);
  wrap.appendChild(btnRow);
  wrap.appendChild(successPanel.panel);
  wrap.appendChild(failPanel.panel);
  document.body.appendChild(wrap);

  const overlay = document.createElement('div');
  overlay.id = 'cat-claim-overlay';

  const modal = document.createElement('div');
  modal.id = 'cat-claim-modal';

  const modalHead = document.createElement('div');
  modalHead.id = 'cat-claim-modalhead';

  const modalTitle = document.createElement('div');
  modalTitle.style.fontWeight = '700';
  modalTitle.textContent = '查看全部';

  const modalBtns = document.createElement('div');
  modalBtns.style.display = 'flex';
  modalBtns.style.gap = '8px';

  const copyBtn = mkBtn('复制', true);
  const closeBtn = mkBtn('关闭', true);
  modalBtns.appendChild(copyBtn);
  modalBtns.appendChild(closeBtn);

  modalHead.appendChild(modalTitle);
  modalHead.appendChild(modalBtns);

  const modalBody = document.createElement('div');
  modalBody.id = 'cat-claim-modalbody';

  const modalText = document.createElement('textarea');
  modalText.id = 'cat-claim-text';
  modalText.readOnly = true;
  modalText.onclick = function () { this.select(); };

  modalBody.appendChild(modalText);
  modal.appendChild(modalHead);
  modal.appendChild(modalBody);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  closeBtn.onclick = () => { overlay.style.display = 'none'; };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(modalText.value || '');
      copyBtn.textContent = '已复制';
      setTimeout(() => (copyBtn.textContent = '复制'), 900);
    } catch {
      modalText.focus();
      modalText.select();
      document.execCommand('copy');
      copyBtn.textContent = '已复制';
      setTimeout(() => (copyBtn.textContent = '复制'), 900);
    }
  };

  function popCount(el) {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function setProgress(page, done, total, ok, fail) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    bar.style.width = `${pct}%`;
    status.textContent = `猫站：第 ${page + 1} 页（page=${page}）｜${done}/${total}（${pct}%）｜成功 ${ok}｜失败 ${fail}`;
  }

  function renderList(panelObj, names, totalCount) {
    const prev = parseInt(panelObj.count.textContent || '0', 10) || 0;
    panelObj.count.textContent = String(totalCount);
    if (totalCount !== prev) popCount(panelObj.count);

    panelObj.ol.innerHTML = '';
    const show = names.slice(Math.max(0, names.length - showMax));
    for (const name of show) {
      const li = document.createElement('li');
      li.textContent = name;
      panelObj.ol.appendChild(li);
    }
    panelObj.listBox.scrollTop = panelObj.listBox.scrollHeight;
  }

  function openAllModal(kind) {
    const st = loadState();
    const list = st ? (kind === 'ok' ? (st.okNamesAll || []) : (st.failNamesAll || [])) : [];
    const title =
      kind === 'ok'
        ? `成功（共 ${st ? st.ok : 0}）`
        : `失败（共 ${st ? st.fail : 0}，可能被认领完或其它错误）`;
    modalTitle.textContent = `猫站｜${title}`;
    modalText.value = list.map((name, i) => `${i + 1}. ${name}`).join('\n');
    overlay.style.display = 'flex';
    modalText.scrollTop = modalText.scrollHeight;
    modalText.focus();
    modalText.select();
  }

  successPanel.allBtn.onclick = () => openAllModal('ok');
  failPanel.allBtn.onclick = () => openAllModal('fail');

  function hydratePanelsFromState() {
    const st = loadState();
    if (!st) {
      renderList(successPanel, [], 0);
      renderList(failPanel, [], 0);
      failPanel.panel.style.display = 'none';
      return;
    }
    renderList(successPanel, st.okNamesAll || [], st.ok || 0);
    renderList(failPanel, st.failNamesAll || [], st.fail || 0);
    failPanel.panel.style.display = ((st.fail || 0) === 0) ? 'none' : '';
  }

  async function claimThisPage(st, seenKeys) {
    const elements = Array.from(document.querySelectorAll('.claim-confirm'));
    const total = elements.length;

    if (!total) {
      st.running = false;
      safeSaveState(st);
      return { empty: true, total: 0, okDelta: 0, failDelta: 0, okNames: [], failNames: [], okKeys: [], failKeys: [] };
    }

    let okDelta = 0;
    let failDelta = 0;
    const okNames = [];
    const failNames = [];
    const okKeys = [];
    const failKeys = [];

    for (let i = 0; i < total; i++) {
      if (navigating) break;
      const cur = loadState();
      if (!cur || !cur.running) break;

      const el = elements[i];
      const dataUrl = el.getAttribute('data-url');
      if (!dataUrl) continue;

      const key = makeKey(el);
      if (seenKeys.has(key)) {
        if ((i + 1) % uiUpdateEvery === 0 || i === total - 1) {
          setProgress(st.page, i + 1, total, st.ok + okDelta, st.fail + failDelta);
        }
        continue;
      }

      const url = buildUrl(dataUrl);
      const name = extractTorrentName(el);

      try {
        const { ok, text } = await fetchTextWithRetry(url, fetchRetries);
        if (navigating) break;
        if (ok && isClaimSuccess(text)) {
          okDelta++;
          okNames.push(name);
          okKeys.push(key);
          seenKeys.add(key);
        } else {
          failDelta++;
          failNames.push(name);
          failKeys.push(key);
          seenKeys.add(key);
        }
      } catch (e) {
        if (e && e.name === 'AbortError') break;
        failDelta++;
        failNames.push(name);
        failKeys.push(key);
        seenKeys.add(key);
      }

      if ((i + 1) % uiUpdateEvery === 0 || i === total - 1) {
        setProgress(st.page, i + 1, total, st.ok + okDelta, st.fail + failDelta);
      }

      await friendlyDelay();
    }

    return { empty: false, total, okDelta, failDelta, okNames, failNames, okKeys, failKeys };
  }

  function endRunUI(finalText) {
    sessionRunning = false;
    startBtn.disabled = false;
    startBtn.textContent = '开始';
    status.classList.remove('breath');
    if (finalText) status.textContent = finalText;
  }

  stopBtn.onclick = () => {
    abortNow();
    sessionRunning = false;

    const st = loadState();
    if (st) {
      st.running = false;
      safeSaveState(st);
    }

    endRunUI('猫站：已暂停（记录已保留，可继续开始）');
  };

  resetBtn.onclick = () => {
    if (sessionRunning) {
      const ok = confirm('脚本正在运行，是否强制停止并重置？（将清空所有状态并刷新页面）');
      if (!ok) return;
      abortNow();
      sessionRunning = false;
      clearState();
      location.reload();
      return;
    }

    const ok2 = confirm('确定要清空成功/失败记录吗？（不会自动开始）');
    if (!ok2) return;

    clearState();
    renderList(successPanel, [], 0);
    renderList(failPanel, [], 0);
    failPanel.panel.style.display = 'none';
    bar.style.width = '0%';
    endRunUI('猫站：已清空记录');
  };

  const stBoot = loadState();
  const curBootPage = getPageFromUrl();
  if (stBoot && stBoot.running && typeof stBoot.page === 'number') {
    if (curBootPage !== stBoot.page) {
      gotoPage(stBoot.page);
      return;
    }
    if (stBoot.lastUrl && stBoot.lastUrl === location.href) {
      stBoot.running = false;
      safeSaveState(stBoot);
    }
  }

  startBtn.onclick = async () => {
    if (sessionRunning) return;

    navigating = false;
    newAbort();

    sessionRunning = true;
    startBtn.disabled = true;
    startBtn.textContent = '运行中…';
    status.classList.add('breath');

    try {
      let st = loadState();
      const currentPage = getPageFromUrl();

      if (!st) {
        st = {
          running: true, page: currentPage,
          ok: 0, fail: 0,
          okNamesAll: [], failNamesAll: [],
          okKeysAll: [], failKeysAll: [],
          lastUrl: ''
        };
        safeSaveState(st);
      } else {
        st.running = true;
        st.page = currentPage;
        st.ok = st.ok || 0;
        st.fail = st.fail || 0;
        st.okNamesAll = st.okNamesAll || [];
        st.failNamesAll = st.failNamesAll || [];
        st.okKeysAll = st.okKeysAll || [];
        st.failKeysAll = st.failKeysAll || [];
        st.lastUrl = st.lastUrl || '';
        safeSaveState(st);
      }

      const seenKeys = new Set([...(st.okKeysAll || []), ...(st.failKeysAll || [])]);

      setProgress(st.page, 0, 0, st.ok, st.fail);
      hydratePanelsFromState();

      const r = await claimThisPage(st, seenKeys);

      if (navigating) return;

      st = loadState() || st;

      st.ok += r.okDelta;
      st.fail += r.failDelta;

      st.okNamesAll = trimKeep(mergeUnique(st.okNamesAll, r.okNames), listMaxKeep);
      st.failNamesAll = trimKeep(mergeUnique(st.failNamesAll, r.failNames), listMaxKeep);

      st.okKeysAll = trimKeep(mergeUnique(st.okKeysAll, r.okKeys), keyMaxKeep);
      st.failKeysAll = trimKeep(mergeUnique(st.failKeysAll, r.failKeys), keyMaxKeep);

      safeSaveState(st);

      renderList(successPanel, st.okNamesAll, st.ok);
      renderList(failPanel, st.failNamesAll, st.fail);
      failPanel.panel.style.display = ((st.fail || 0) === 0) ? 'none' : '';

      const cur = loadState();
      if (!cur || !cur.running) {
        endRunUI('猫站：已暂停（记录已保留）');
        return;
      }

      if (r.empty) {
        st.running = false;
        safeSaveState(st);
        bar.style.width = '100%';
        endRunUI(`猫站：全部完成｜成功 ${st.ok}｜失败 ${st.fail}（失败原因：可能被认领完或其它错误）`);
        return;
      }

      const nextPage = st.page + 1;
      st.page = nextPage;
      st.running = true;
      st.lastUrl = location.href;
      safeSaveState(st);

      abortNow();
      gotoPage(st.page);
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') {
        const st = loadState();
        if (st) {
          st.running = false;
          safeSaveState(st);
        }
        endRunUI('猫站：已暂停（记录已保留）');
        return;
      }

      const st = loadState();
      if (st) {
        st.running = false;
        safeSaveState(st);
      }
      endRunUI('猫站：发生错误（可重试）');
      return;
    } finally {
      if (!navigating && document.contains(wrap)) {
        sessionRunning = false;
        startBtn.disabled = false;
        if (startBtn.textContent === '运行中…') startBtn.textContent = '开始';
        status.classList.remove('breath');
      }
    }
  };

  hydratePanelsFromState();

  const st0 = loadState();
  if (st0 && st0.running) {
    const p = getPageFromUrl();
    if (p !== st0.page) gotoPage(st0.page);
    else startBtn.click();
  }
})();
