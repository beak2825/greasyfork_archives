// ==UserScript==
// @name        净巢
// @namespace   http://tampermonkey.net/
// @version     3.0
// @description 根据 UID 屏蔽指定用户：帖子 / 回帖 / 提醒 / 私信 / 搜索结果 / 排行榜 等，并在个人资料页一键“屏蔽此人”；支持“完全隐藏 / 占位提示”两种显示方式（占位时可点击查看原内容，并可再点按钮重新屏蔽）。PC + 手机版共用同一份屏蔽列表，手机版入口在“发现”页。
// @author      期待s
// @match       https://monster-nest.com/*
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/558240/%E5%87%80%E5%B7%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558240/%E5%87%80%E5%B7%A2.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const STORAGE_KEY = 'mn_block_uid_map_v2';
  const SETTINGS_KEY = 'mn_block_settings_v1';
  // 简单判断是否为 Discuz 手机版（URL 带 mobile=2）
  const IS_MOBILE = /\bmobile=2\b/.test(location.search + location.href);
 
  // ============================
  // 数据读写
  // ============================
  function loadBlocked() {
    try {
      const raw = GM_getValue(STORAGE_KEY, '{}');
      let obj = JSON.parse(raw || '{}');
      if (!obj || typeof obj !== 'object') {
        obj = {};
      }
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (val && typeof val === 'object') {
          if (!val.name && !/^\d+$/.test(key)) {
            val.name = key;
          }
          if (typeof val.time !== 'number') {
            val.time = 0;
          }
          obj[key] = val;
        } else {
          const isNumericKey = /^\d+$/.test(key);
          obj[key] = {
            name: isNumericKey ? '' : key,
            time: 0
          };
        }
      });
      return obj;
    } catch (e) {
      console.error('加载屏蔽列表失败', e);
      return {};
    }
  }
 
  function saveBlocked(map) {
    try {
      GM_setValue(STORAGE_KEY, JSON.stringify(map || {}));
    } catch (e) {
      console.error('保存屏蔽列表失败', e);
    }
  }
 
  function loadSettings() {
    try {
      const raw = GM_getValue(SETTINGS_KEY, '{"mode":"hide"}');
      const obj = JSON.parse(raw || '{}');
      if (!obj || typeof obj !== 'object') return { mode: 'hide' };
      if (obj.mode !== 'placeholder' && obj.mode !== 'hide') {
        obj.mode = 'hide';
      }
      return obj;
    } catch (e) {
      console.error('加载屏蔽设置失败', e);
      return { mode: 'hide' };
    }
  }
 
  function saveSettings() {
    try {
      GM_setValue(SETTINGS_KEY, JSON.stringify(settings || { mode: 'hide' }));
    } catch (e) {
      console.error('保存屏蔽设置失败', e);
    }
  }
 
  function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
  }
 
  // ============================
  // UID 解析
  // ============================
  function parseUidFromHref(href) {
    if (!href) return null;
    let m = href.match(/[?&]uid=(\d+)/);
    if (m) return m[1];
    m = href.match(/[/?](\d+)(?:[#?]|$)/);
    if (m) return m[1];
    return null;
  }
 
  function parseUidFromAvatarUrl(url) {
    if (!url) return null;
    const m = url.match(/[?&]uid=(\d+)/);
    return m ? m[1] : null;
  }
 
  function detectProfileUid() {
    const uidSpan = document.querySelector('#ct h2 .xw0');
    if (uidSpan && uidSpan.textContent) {
      const m = uidSpan.textContent.match(/UID:\s*(\d+)/i);
      if (m) return m[1];
    }
    const crumbLink = document.querySelector('#pt .z a[href*="home.php?mod=space&uid="]');
    if (crumbLink) {
      const uid = parseUidFromHref(crumbLink.href);
      if (uid) return uid;
    }
    const refLink = document.querySelector('#uhd .mn a[id^="a_friend_li_"], #uhd .mn a[id^="a_sendpm_"]');
    if (refLink) {
      const uid = parseUidFromHref(refLink.href);
      if (uid) return uid;
    }
    // 手机版兜底：URL 里直接带 uid=xxx
    return parseUidFromHref(location.href);
  }
 
  // 兼容 PC + 手机版的个人资料用户名提取
  function detectProfileName() {
    // PC：个人资料页标题
    const h2 = document.querySelector('#ct h2.mbn, #ct h2.mt');
    if (h2) {
      const full = h2.textContent || '';
      const m = full.match(/^(.+?)(?:\(|（|$)/);
      if (m) return m[1].trim();
    }
 
    // PC：面包屑里的用户名
    const crumbLink = document.querySelector('#pt .z a[href*="home.php?mod=space&uid="]');
    if (crumbLink && crumbLink.textContent) return crumbLink.textContent.trim();
 
    // 手机版：个人资料页头像下面的大名
    const mobileName = document.querySelector('.userinfo h2.name');
    if (mobileName && mobileName.textContent) {
      return mobileName.textContent.trim();
    }
 
    // 手机版兜底：title 里通常是 “xxx的个人资料 - 怪物之巢 - 手机版 - Powered by Discuz!”
    const title = document.title || '';
    const m2 = title.match(/^(.+?)的个人资料/);
    if (m2) return m2[1].trim();
 
    return null;
  }
 
  const blockedMap = loadBlocked();
  const settings = loadSettings();
 
  function isBlocked(uidOrKey) {
    return !!(uidOrKey && blockedMap[uidOrKey]);
  }
 
  function getBlockedUidByName(name) {
    if (!name) return null;
    const target = String(name).trim();
    if (!target) return null;
    for (const uid of Object.keys(blockedMap)) {
      const info = blockedMap[uid];
      const nm = info && info.name ? String(info.name).trim() : '';
      if (nm && nm === target) return uid;
    }
    return null;
  }
 
  function isBlockedByName(name) {
    return !!getBlockedUidByName(name);
  }
 
  function resolveUidFromLink(a) {
    if (!a) return null;
    const href = a.getAttribute('href') || '';
    let uid = parseUidFromHref(href);
    if (uid) return uid;
 
    let img = a.querySelector('img');
    if (!img) {
      const container = a.closest('.psta, .avatar, .authi, td, li, div, dd.m.avt');
      if (container) {
        img = container.querySelector('img');
      }
    }
    if (img) {
      const src =
        img.getAttribute('data-savepage-src') ||
        img.getAttribute('src') ||
        '';
      const avatarUid = parseUidFromAvatarUrl(src);
      if (avatarUid) return avatarUid;
    }
 
    const name = (a.textContent || '').trim();
    if (!name) return null;
    const keyFromName = getBlockedUidByName(name);
    return keyFromName || null;
  }
 
  function guessNameFromDom(uid) {
    if (!uid) return null;
    const links = document.querySelectorAll('a[href*="home.php?mod=space"]');
    for (const a of links) {
      const u = parseUidFromHref(a.getAttribute('href') || '');
      if (u === uid) {
        const t = (a.textContent || '').trim();
        if (t) return t;
      }
    }
    return null;
  }
 
  async function fetchNameFromProfile(uid) {
    if (!uid) return null;
    try {
      const resp = await fetch(`/home.php?mod=space&uid=${uid}`);
      if (!resp.ok) return null;
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const h2 = doc.querySelector('#ct h2.mbn, #ct h2.mt');
      if (h2 && h2.textContent) {
        const full = h2.textContent;
        const m = full.match(/^(.+?)(?:\(|（|$)/);
        if (m) return m[1].trim();
      }
      const crumb = doc.querySelector('#pt .z a[href*="home.php?mod=space&uid="]');
      if (crumb && crumb.textContent) return crumb.textContent.trim();
      return null;
    } catch (e) {
      console.warn('抓取用户名失败', e);
      return null;
    }
  }
 
  async function autoAddBlock(uid, manualName) {
    let name = (manualName || '').trim();
    if (!name) {
      name = guessNameFromDom(uid) || '';
    }
    if (!name) {
      name = (await fetchNameFromProfile(uid)) || '';
    }
    if (!name) {
      name = `UID:${uid}`;
    }
    addBlock(uid, name);
  }
 
  function addBlock(uid, name) {
    if (!uid) return;
    blockedMap[uid] = blockedMap[uid] || {};
    blockedMap[uid].name = name || blockedMap[uid].name || '';
    blockedMap[uid].time = Date.now();
    saveBlocked(blockedMap);
    updateHeaderCount();
    applyBlocking();
  }
 
  function removeBlock(uid) {
    if (!uid) return;
    delete blockedMap[uid];
    saveBlocked(blockedMap);
 
    // 清掉该 UID 的“重新屏蔽”相关 DOM 和强制显示标记
    document.querySelectorAll('.mnblock-reblock-row').forEach(row => {
      if (row.dataset.mnblockUid === uid && row.parentNode) {
        row.parentNode.removeChild(row);
      }
    });
    document.querySelectorAll('.mnblock-floor-placeholder').forEach(div => {
      if (div.dataset.mnblockUid === uid && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    });
    document.querySelectorAll('[data-mnblock-uid="' + uid + '"]').forEach(el => {
      const id = el.dataset.mnblockId;
      if (id && forceShown[id]) {
        delete forceShown[id];
      }
    });
 
    updateHeaderCount();
    applyBlocking();
  }
 
  function getDisplayName(uid) {
    const info = blockedMap[uid];
    if (info && info.name) return info.name;
    if (/^\d+$/.test(uid)) return 'UID:' + uid;
    return uid;
  }
 
  // ============================
  // 顶部“屏蔽列表”菜单 & 通用状态
  // ============================
  let listPanel;
  let hoverTimer = null;
  let blockSeq = 0;
  const forceShown = {};
 
  function ensureBlockId(elem) {
    if (!elem.dataset.mnblockId) {
      elem.dataset.mnblockId = 'blk_' + (++blockSeq);
    }
    return elem.dataset.mnblockId;
  }
 
  function isForceShown(elem) {
    const id = elem.dataset.mnblockId;
    return !!(id && forceShown[id]);
  }
 
  function setForceShown(elem, val) {
    const id = ensureBlockId(elem);
    if (val) {
      forceShown[id] = true;
    } else {
      delete forceShown[id];
    }
  }
 
  // 给评分表那种 <tr> 行添加“重新屏蔽此内容”控制行
  function addReblockRowForTableRow(row, uid) {
    if (!row || !row.parentNode) return;
    const table = row.closest('table');
    if (!table) return;
 
    let colCount = 0;
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (headerRow && headerRow.children && headerRow.children.length) {
      colCount = headerRow.children.length;
    } else if (row.children && row.children.length) {
      colCount = row.children.length;
    } else {
      colCount = 1;
    }
 
    const reRow = document.createElement('tr');
    reRow.className = 'mnblock-reblock-row';
    reRow.dataset.mnblockUid = uid;
    reRow.dataset.mnblockId = row.dataset.mnblockId || '';
 
    const td = document.createElement('td');
    td.colSpan = colCount;
    td.style.cssText = 'text-align:right;font-size:12px;color:#999;padding:2px 6px;';
 
    const link = document.createElement('a');
    link.href = 'javascript:;';
    link.textContent = '重新屏蔽此内容';
    link.style.cssText = 'color:#999;text-decoration:underline;';
 
    link.addEventListener('click', function (e) {
      e.stopPropagation();
      setForceShown(row, false);
      if (reRow.parentNode) {
        reRow.parentNode.removeChild(reRow);
      }
      hideContainerForUid(uid, row);
    });
 
    td.appendChild(link);
    reRow.appendChild(td);
    row.parentNode.insertBefore(reRow, row.nextSibling);
  }
 
    function addFloorReblockBar(floorElem) {
    if (!floorElem) return;

    // 已经有就不重复加（兼容旧版的 bar 和新版行内链接）
    if (floorElem.querySelector('.mnblock-floor-bar, .mnblock-reblock-inline')) return;

    const uid = floorElem.dataset.mnblockUid;
    if (!uid) return;

    const authi = floorElem.querySelector('.authi');
    if (authi) {
        const pipe = document.createElement('span');
        pipe.className = 'pipe';
        pipe.textContent = '|';

        const link = document.createElement('a');
        link.href = 'javascript:;';
        link.className = 'mnblock-reblock-inline';
        link.textContent = '重新屏蔽此内容';
        link.style.cssText = 'color:#999; text-decoration:none; white-space:nowrap;';

        link.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        setForceShown(floorElem, false);

        // 找到对应占位并显示
        const id = floorElem.dataset.mnblockId;
        let placeholder = document.querySelector(
            '.mnblock-floor-placeholder[data-mnblock-id="' + id + '"]'
        );
        if (!placeholder && floorElem.previousElementSibling &&
            floorElem.previousElementSibling.classList.contains('mnblock-floor-placeholder')) {
            placeholder = floorElem.previousElementSibling;
        }
        if (placeholder) placeholder.style.display = '';

        if (!floorElem.dataset.mnblockOldDisplay) {
            floorElem.dataset.mnblockOldDisplay = floorElem.style.display || '';
        }
        floorElem.classList.add('mnblock-hidden');
        floorElem.style.display = 'none';
        });

        authi.appendChild(pipe);
        authi.appendChild(link);
        return;
    }

    const bar = document.createElement('div');
    bar.className = 'mnblock-floor-bar';
    bar.style.cssText =
        'display:block; text-align:right; font-size:12px; color:#999;' +
        'margin:0 0 6px; line-height:18px; clear:both;';

    const link = document.createElement('a');
    link.href = 'javascript:;';
    link.textContent = '重新屏蔽此内容';
    link.style.cssText = 'color:#999; text-decoration:none; white-space:nowrap;';

    link.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        setForceShown(floorElem, false);

        const id = floorElem.dataset.mnblockId;
        let placeholder = document.querySelector(
        '.mnblock-floor-placeholder[data-mnblock-id="' + id + '"]'
        );
        if (!placeholder && floorElem.previousElementSibling &&
            floorElem.previousElementSibling.classList.contains('mnblock-floor-placeholder')) {
        placeholder = floorElem.previousElementSibling;
        }
        if (placeholder) placeholder.style.display = '';

        if (!floorElem.dataset.mnblockOldDisplay) {
        floorElem.dataset.mnblockOldDisplay = floorElem.style.display || '';
        }
        floorElem.classList.add('mnblock-hidden');
        floorElem.style.display = 'none';
    });

    bar.appendChild(link);

    const plc =
        floorElem.querySelector('td.plc .pi') ||
        floorElem.querySelector('td.plc') ||
        floorElem;

    plc.insertBefore(bar, plc.firstChild);
    }

 
  function hideFloorPostWithPlaceholder(uid, elem) {
    if (!elem || !uid) return;
    if (!elem.parentNode) return;
 
    ensureBlockId(elem);
    elem.dataset.mnblockUid = uid;
    if (!elem.dataset.mnblockOldDisplay) {
      elem.dataset.mnblockOldDisplay = elem.style.display || '';
    }
    elem.classList.add('mnblock-hidden');
 
    let placeholder = elem.previousElementSibling;
    if (
      !placeholder ||
      !placeholder.classList.contains('mnblock-floor-placeholder') ||
      placeholder.dataset.mnblockId !== elem.dataset.mnblockId
    ) {
      placeholder = document.createElement('div');
      placeholder.className = 'mnblock-placeholder mnblock-floor-placeholder';
      placeholder.dataset.mnblockUid = uid;
      placeholder.dataset.mnblockId = elem.dataset.mnblockId || '';
      placeholder.style.cssText =
        'color:#999;font-size:12px;font-style:italic;padding:4px 6px;' +
        'border:1px dashed #ddd;background:#f7f7f7;margin-bottom:4px;cursor:pointer;';
      placeholder.textContent =
        '来自「' + getDisplayName(uid) + '」的内容已被你屏蔽（点击查看原内容）';
 
      placeholder.addEventListener('click', function (e) {
        e.stopPropagation();
        setForceShown(elem, true);
        elem.style.display = elem.dataset.mnblockOldDisplay || '';
        elem.classList.remove('mnblock-hidden');
        if (placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
        addFloorReblockBar(elem);
      });
 
      elem.parentNode.insertBefore(placeholder, elem);
    } else {
      placeholder.style.display = '';
      placeholder.textContent =
        '来自「' + getDisplayName(uid) + '」的内容已被你屏蔽（点击查看原内容）';
    }
 
    elem.style.display = 'none';
  }
 
  // ============================
  // 顶部 / 入口 UI（PC + 手机版）
  // ============================
  function createHeaderUI() {
    // 防止重复创建
    if (document.getElementById('mnBlockListToggle')) return;
 
    const umPara = document.querySelector('#um p');
 
    if (umPara) {
      // ===== PC 顶部导航里的入口 =====
      const logoutLink = umPara.querySelector(
        'a[href*="member.php?mod=logging"][href*="action=logout"]'
      );
 
      const link = document.createElement('a');
      link.href = 'javascript:;';
      link.id = 'mnBlockListToggle';
      link.title = '管理屏蔽 UID';
      link.innerHTML = '屏蔽列表(<span id="mnBlockCount">0</span>)';
      link.className = 'showmenu';
 
      if (logoutLink && logoutLink.parentNode === umPara) {
        const oldPipe = logoutLink.previousElementSibling;
        if (oldPipe && oldPipe.classList && oldPipe.classList.contains('pipe')) {
          umPara.insertBefore(link, oldPipe);
        } else {
          const pipe = document.createElement('span');
          pipe.className = 'pipe';
          pipe.textContent = '|';
          umPara.insertBefore(link, logoutLink);
          umPara.insertBefore(pipe, logoutLink);
        }
      } else {
        const pipe = document.createElement('span');
        pipe.className = 'pipe';
        pipe.textContent = '|';
        umPara.appendChild(pipe);
        umPara.appendChild(link);
      }
 
      createListPanel();
      updateHeaderCount();
 
      // PC：悬停 + 点击 都可以展开
      link.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        showListPanel();
      });
      link.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(hideListPanel, 200);
      });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        clearTimeout(hoverTimer);
        if (listPanel && listPanel.style.display === 'block') {
          hideListPanel();
        } else {
          showListPanel();
        }
      });
 
      if (listPanel) {
        listPanel.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimer);
        });
        listPanel.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(hideListPanel, 200);
        });
      }
    } else {
      // ===== 手机版：不再创建悬浮按钮，只创建面板本体 =====
      createListPanel();
      updateHeaderCount();
      // 具体入口在“发现”页里注入（下面有 injectMobileFindEntry）
    }
  }
 
  function updateHeaderCount() {
    const span = document.querySelector('#mnBlockCount');
    if (span) {
      span.textContent = String(Object.keys(blockedMap).length);
    }
  }
 
  function createListPanel() {
    if (listPanel) return;
    listPanel = document.createElement('div');
    listPanel.id = 'mnBlockListPanel';
    listPanel.style.cssText = [
      'position: absolute',
      'top: 0px',
      'left: 0px',
      'z-index: 99999',
      'min-width: 260px',
      'max-width: 360px',
      'max-height: 300px',
      'overflow-y: auto',
      'padding: 10px 12px',
      'background: #ffffff',
      'border: 1px solid #ccc',
      'box-shadow: 0 2px 8px rgba(0,0,0,.25)',
      'font-size: 12px',
      'line-height: 1.6',
      'border-radius: 6px',
      'display: none',
      'box-sizing: border-box'
    ].join(';');
 
    listPanel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <strong>屏蔽列表</strong>
        <a href="javascript:;" id="mnBlockClose" style="font-size:14px;text-decoration:none;">✕</a>
      </div>
      <div style="margin-bottom:6px;font-size:12px;white-space:nowrap;">
        显示方式：
        <label style="margin-right:8px;">
          <input type="radio" name="mnBlockMode" value="hide"> 完全隐藏
        </label>
        <label>
          <input type="radio" name="mnBlockMode" value="placeholder"> 显示“已被你屏蔽”的提示
        </label>
      </div>
      <div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
        <input id="mnBlockInputUid" type="text" placeholder="输入 UID" style="flex:0 0 90px;padding:2px 4px;">
        <input id="mnBlockInputName" type="text" placeholder="备注/名称(留空则自动获取)" style="flex:1 1 120px;padding:2px 4px;">
        <button id="mnBlockAddBtn" type="button" style="padding:2px 6px;flex:0 0 auto;">添加</button>
      </div>
      <div id="mnBlockListContent"></div>
    `;
 
    document.body.appendChild(listPanel);
 
    listPanel.querySelector('#mnBlockClose').onclick = () => {
      hideListPanel();
    };
 
    const modeInputs = listPanel.querySelectorAll('input[name="mnBlockMode"]');
    modeInputs.forEach(input => {
      input.checked = input.value === settings.mode;
      input.addEventListener('change', () => {
        if (!input.checked) return;
        settings.mode = input.value === 'placeholder' ? 'placeholder' : 'hide';
        saveSettings();
        applyBlocking();
      });
    });
 
    listPanel.querySelector('#mnBlockAddBtn').onclick = async () => {
      const uidInput = listPanel.querySelector('#mnBlockInputUid');
      const nameInput = listPanel.querySelector('#mnBlockInputName');
      const uid = uidInput.value.trim();
      const name = nameInput.value.trim();
 
      if (!uid || !/^\d+$/.test(uid)) {
        alert('请输入正确的 UID（纯数字）');
        return;
      }
 
      await autoAddBlock(uid, name);
      uidInput.value = '';
      nameInput.value = '';
      renderList();
    };
 
    renderList();
  }
 
  function positionListPanel() {
    if (!listPanel) return;
    const trigger = document.getElementById('mnBlockListToggle');
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panelWidth = listPanel.offsetWidth || 300;
    const top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;
    const maxLeft = window.scrollX + window.innerWidth - panelWidth - 8;
    if (left > maxLeft) left = Math.max(window.scrollX + 4, maxLeft);
    listPanel.style.top = top + 'px';
    listPanel.style.left = left + 'px';
  }
 
  function showListPanel() {
    if (!listPanel) return;
    positionListPanel();
    renderList();
    listPanel.style.display = 'block';
  }
 
  function hideListPanel() {
    if (!listPanel) return;
    listPanel.style.display = 'none';
  }
 
  function renderList() {
    if (!listPanel) return;
    const container = listPanel.querySelector('#mnBlockListContent');
    container.innerHTML = '';
 
    if (isEmpty(blockedMap)) {
      container.textContent = '当前没有屏蔽任何 UID。';
      return;
    }
 
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.margin = '0';
    ul.style.padding = '0';
 
    const uids = Object.keys(blockedMap).sort(
      (a, b) => (blockedMap[b].time || 0) - (blockedMap[a].time || 0)
    );
 
    uids.forEach(uid => {
      const item = blockedMap[uid];
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.justifyContent = 'space-between';
      li.style.padding = '2px 0';
 
      const left = document.createElement('span');
      const displayName = item && item.name ? item.name : '未知用户';
      const isNumeric = /^\d+$/.test(uid);
      left.textContent = isNumeric
        ? `${displayName} (UID: ${uid})`
        : `${displayName} (旧数据: ${uid})`;
 
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = '删除';
      del.style.padding = '0 6px';
      del.style.marginLeft = '6px';
      del.style.fontSize = '12px';
 
      del.addEventListener('click', () => {
        if (confirm(`取消屏蔽：${displayName} (${isNumeric ? 'UID' : 'Key'}: ${uid}) ?`)) {
          removeBlock(uid);
          renderList();
        }
      });
 
      li.appendChild(left);
      li.appendChild(del);
      ul.appendChild(li);
    });
 
    container.appendChild(ul);
  }
 
  // ============================
  // 手机版“发现”页里注入入口
  // ============================
  function injectMobileFindEntry() {
    if (!IS_MOBILE) return;
    const hrefAll = location.href + location.search;
    // 只在 mod=find 的页面注入
    if (!/mod=find/.test(hrefAll)) return;
    if (document.querySelector('.mnblock-find-entry')) return;
 
    let container = document.getElementById('ct');
    if (!container) {
      container = document.querySelector('.threadlist_box') || document.body;
    }
 
    const box = document.createElement('div');
    box.className = 'mnblock-find-entry';
    box.style.cssText =
      'margin:8px;padding:8px 10px;background:#fff7e6;' +
      'border:1px solid #f5c46b;border-radius:4px;font-size:13px;';
 
    const link = document.createElement('a');
    link.href = 'javascript:;';
    link.id = 'mnBlockListToggle';
    link.textContent = '🚫 管理屏蔽列表';
    link.style.cssText = 'color:#c67f00;text-decoration:none;';
 
    box.appendChild(link);
    container.insertBefore(box, container.firstChild);
 
    // 手机版：点击打开/关闭面板
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!listPanel) {
        createListPanel();
      }
      clearTimeout(hoverTimer);
      if (listPanel.style.display === 'block') {
        hideListPanel();
      } else {
        showListPanel();
      }
    });
  }
 
  // ============================
  // 个人主页按钮（PC + 手机版）
  // ============================
  function addProfileBlockButton() {
    const uid = detectProfileUid();
    if (!uid) return;
 
    // PC：#uhd 里的按钮区域
    let btnContainer = document.querySelector('#uhd .mn ul');
 
    // 手机版：个人资料页积分那一排
    if (!btnContainer) {
      btnContainer = document.querySelector('.userinfo .user_box ul');
    }
 
    if (!btnContainer) return;
    if (btnContainer.querySelector('.mnblock-profile-btn')) return;
 
    const li = document.createElement('li');
    li.className = 'mnblock-profile-btn';
 
    const a = document.createElement('a');
    a.href = 'javascript:;';
    a.className = 'xi2';
 
    function refreshText() {
      a.textContent = isBlocked(uid) ? '🚫 取消屏蔽此人' : '🚫 屏蔽此人';
    }
    refreshText();
 
    a.addEventListener('click', function (ev) {
      // 防止点击后触发父级 <a> 导致跳转“积分”等页面
      ev.preventDefault();
      ev.stopPropagation();
 
      const name = detectProfileName() || `UID:${uid}`;
      if (isBlocked(uid)) {
        if (confirm(`取消屏蔽 ${name} (UID: ${uid})?`)) {
          removeBlock(uid);
          refreshText();
        }
      } else {
        if (confirm(`确定要屏蔽 ${name} (UID: ${uid})？\n她/他的帖子、回帖、提醒等都会被隐藏或替换为占位提示。`)) {
          addBlock(uid, name);
          refreshText();
        }
      }
    });
 
    li.appendChild(a);
    btnContainer.appendChild(li);
  }
 
  // ============================
  // 核心隐藏逻辑
  // ============================
  function hideContainerForUid(uid, elem) {
    if (!elem || !uid) return;
    if (elem.classList.contains('mnblock-hidden')) return;
    if (isForceShown(elem)) return;
 
    ensureBlockId(elem);
    elem.dataset.mnblockUid = uid;
    if (!elem.dataset.mnblockOldDisplay) {
      elem.dataset.mnblockOldDisplay = elem.style.display || '';
    }
 
    elem.classList.add('mnblock-hidden');
 
    const isFloorPost =
      elem.id && (/^post_\d+$/i.test(elem.id) || /^pid\d+$/i.test(elem.id));
 
    if (settings.mode === 'placeholder') {
      const tag = elem.tagName;
 
      // 整层楼：只做占位，不改 innerHTML
      if (isFloorPost) {
        hideFloorPostWithPlaceholder(uid, elem);
        return;
      }
 
      const displayName = getDisplayName(uid);
 
      // 评分等表格行（PC）
      if (tag === 'TBODY' || tag === 'TR') {
        const oldDisplay = elem.style.display;
        if (oldDisplay !== undefined) {
          elem.dataset.mnblockOldDisplay = oldDisplay;
        }
        elem.style.display = 'none';
        const table = elem.closest('table');
        if (table && elem.parentNode) {
          let colCount = 0;
          const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
          if (headerRow && headerRow.children && headerRow.children.length) {
            colCount = headerRow.children.length;
          } else {
            const firstRow = elem.querySelector('tr');
            if (firstRow && firstRow.children && firstRow.children.length) {
              colCount = firstRow.children.length;
            } else {
              colCount = 1;
            }
          }
          const placeholderRow = document.createElement('tr');
          placeholderRow.className = 'mnblock-placeholder-row';
          placeholderRow.dataset.mnblockUid = uid;
          placeholderRow.dataset.mnblockId = elem.dataset.mnblockId || '';
          const td = document.createElement('td');
          td.colSpan = colCount;
          td.style.cssText =
            'color:#999;font-size:12px;font-style:italic;padding:4px 6px;' +
            'border:1px dashed #ddd;background:#f7f7f7;cursor:pointer;';
          td.textContent =
            '来自「' + displayName + '」的内容已被你屏蔽（点击查看原内容）';
          td.addEventListener('click', function (e) {
            e.stopPropagation();
            setForceShown(elem, true);
            elem.style.display = elem.dataset.mnblockOldDisplay || '';
            elem.classList.remove('mnblock-hidden');
            if (placeholderRow.parentNode) {
              placeholderRow.parentNode.removeChild(placeholderRow);
            }
            addReblockRowForTableRow(elem, uid);
          });
          placeholderRow.appendChild(td);
          elem.parentNode.insertBefore(placeholderRow, elem.nextSibling);
        }
        return;
      }
 
      // 普通块级内容：用占位 div + 顶部“重新屏蔽此内容”
      if (elem.dataset.mnblockOldHtml === undefined) {
        elem.dataset.mnblockOldHtml = elem.innerHTML;
      }
 
      elem.innerHTML = '';
 
      const placeholder = document.createElement('div');
      placeholder.className = 'mnblock-placeholder';
      placeholder.style.cssText =
        'color:#999;font-size:12px;font-style:italic;padding:4px 6px;' +
        'border:1px dashed #ddd;background:#f7f7f7;cursor:pointer;';
      placeholder.textContent =
        '来自「' + displayName + '」的内容已被你屏蔽（点击查看原内容）';
 
      placeholder.addEventListener('click', function (e) {
        e.stopPropagation();
        setForceShown(elem, true);
        const oldHtml = elem.dataset.mnblockOldHtml;
        if (oldHtml !== undefined) {
          elem.innerHTML = oldHtml;
        }
        elem.style.display = elem.dataset.mnblockOldDisplay || '';
        elem.classList.remove('mnblock-hidden');
 
        const bar = document.createElement('div');
        bar.style.cssText =
          'text-align:right;font-size:12px;color:#999;margin-bottom:4px;';
        const btn = document.createElement('a');
        btn.href = 'javascript:;';
        btn.textContent = '重新屏蔽此内容';
        btn.style.cssText = 'color:#999;';
        btn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          setForceShown(elem, false);
          hideContainerForUid(elem.dataset.mnblockUid, elem);
        });
        bar.appendChild(btn);
        elem.insertBefore(bar, elem.firstChild);
      });
 
      elem.appendChild(placeholder);
      elem.style.display = '';
    } else {
      // 完全隐藏模式
      elem.style.display = 'none';
    }
  }
 
  function restoreUnblockedElements() {
    // 评分里的占位行
    document.querySelectorAll('.mnblock-placeholder-row').forEach(row => {
      if (row.parentNode) row.parentNode.removeChild(row);
    });
    // 楼层前面的占位提示（只清理未强制显示的）
    document.querySelectorAll('.mnblock-floor-placeholder').forEach(div => {
      const id = div.dataset.mnblockId;
      if (id && forceShown[id]) return;
      if (div.parentNode) div.parentNode.removeChild(div);
    });
    // 楼层里的“重新屏蔽此内容”小条：强制显示的楼层保留
    document.querySelectorAll('.mnblock-floor-bar').forEach(bar => {
      const floor = bar.closest('[data-mnblock-uid]');
      if (floor && isForceShown(floor)) return;
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    });
 
    // 还原所有被隐藏的容器
    document.querySelectorAll('.mnblock-hidden').forEach(el => {
      const oldDisplay = el.dataset.mnblockOldDisplay;
      if (oldDisplay !== undefined) {
        el.style.display = oldDisplay;
      } else {
        el.style.display = '';
      }
      if (el.dataset.mnblockOldHtml !== undefined) {
        el.innerHTML = el.dataset.mnblockOldHtml;
      }
      el.classList.remove('mnblock-hidden');
      delete el.dataset.mnblockUid;
      delete el.dataset.mnblockOldDisplay;
      delete el.dataset.mnblockOldHtml;
    });
  }
 
  // ============================
  // 各页面过滤
  // ============================
  // PC 主题页：#postlist
  function filterThreadPosts() {
    const postlist = document.querySelector('#postlist');
    if (!postlist) return;
 
    // 每层楼只处理一个容器：优先 div#post_xxx
    let floorContainers = postlist.querySelectorAll('div[id^="post_"]');
    if (!floorContainers.length) {
      floorContainers = postlist.querySelectorAll('table[id^="pid"]');
    }
 
    floorContainers.forEach(container => {
      const authorLink =
        container.querySelector('.authi a[href*="home.php?mod=space"]') ||
        container.querySelector('a[href*="home.php?mod=space"][href*="uid="]');
      if (!authorLink) return;
 
      const uid = resolveUidFromLink(authorLink);
      if (!uid || !isBlocked(uid) || isForceShown(container)) return;
 
      hideContainerForUid(uid, container);
    });
 
    postlist.querySelectorAll('.rwdbst').forEach(block => {
      const link = block.querySelector('a[href*="home.php?mod=space"]');
      const uid = resolveUidFromLink(link);
      if (!uid || !isBlocked(uid) || isForceShown(block)) return;
      hideContainerForUid(uid, block);
    });
 
    postlist.querySelectorAll('.cm').forEach(cm => {
      const rows = cm.querySelectorAll('div.pstl');
      if (rows.length) {
        rows.forEach(row => {
          const a = row.querySelector('a[href*="home.php?mod=space"]');
          if (!a) return;
          const uid = resolveUidFromLink(a);
          if (!uid || !isBlocked(uid) || isForceShown(row)) return;
          hideContainerForUid(uid, row);
        });
        return;
      }
      const link = cm.querySelector('a[href*="home.php?mod=space"]');
      if (!link) return;
      const uid = resolveUidFromLink(link);
      if (!uid || !isBlocked(uid) || isForceShown(cm)) return;
      hideContainerForUid(uid, cm);
    });
 
    // 评分：只隐藏被屏蔽用户的行（PC）
    postlist.querySelectorAll('dl.rate').forEach(rateDl => {
      const tbody = rateDl.querySelector('tbody.ratl_l');
      if (!tbody) return;
      tbody.querySelectorAll('tr').forEach(tr => {
        const link = tr.querySelector('a[href*="home.php?mod=space"]');
        if (!link) return;
        const uid = resolveUidFromLink(link);
        if (!uid || !isBlocked(uid) || isForceShown(tr)) return;
        hideContainerForUid(uid, tr);
      });
    });
 
    // 引用
    postlist.querySelectorAll('div.quote').forEach(quoteDiv => {
      const bq = quoteDiv.querySelector('blockquote');
      if (!bq) return;
 
      let headerText = '';
      const a = bq.querySelector('a');
      if (a && a.textContent) {
        headerText = a.textContent.trim();
      } else {
        headerText = (bq.textContent || '').trim();
      }
      if (!headerText) return;
 
      const m = headerText.match(/^(.+?)(?:\s+发表于|\s+发表自|$)/);
      if (!m) return;
      const name = m[1].trim();
      if (!name) return;
 
      const key = getBlockedUidByName(name);
      if (!key || isForceShown(quoteDiv)) return;
 
      hideContainerForUid(key, quoteDiv);
    });
  }
 
  // Discuz 手机版主题页：.viewthread 里
  function filterMobileThreadPosts() {
    const vt = document.querySelector('div.viewthread');
    if (!vt) return;
 
    // 1）按发帖人屏蔽整层楼（主楼 + 回帖）
    vt.querySelectorAll('div.plc[id^="pid"]').forEach(container => {
      const authorLink =
        container.querySelector('.authi a[href*="home.php?mod=space"]') ||
        container.querySelector('a[href*="home.php?mod=space"][href*="uid="]');
      if (!authorLink) return;
 
      const uid = resolveUidFromLink(authorLink);
      if (!uid || !isBlocked(uid) || isForceShown(container)) return;
 
      hideContainerForUid(uid, container);
    });
 
    // 2）楼内引用，结构与 PC 一致
    vt.querySelectorAll('div.quote').forEach(quoteDiv => {
      const bq = quoteDiv.querySelector('blockquote');
      if (!bq) return;
 
      let headerText = '';
      const a = bq.querySelector('a');
      if (a && a.textContent) {
        headerText = a.textContent.trim();
      } else {
        headerText = (bq.textContent || '').trim();
      }
      if (!headerText) return;
 
      const m = headerText.match(/^(.+?)(?:\s+发表于|\s+发表自|$)/);
      if (!m) return;
      const name = m[1].trim();
      if (!name) return;
 
      const key = getBlockedUidByName(name);
      if (!key || isForceShown(quoteDiv)) return;
 
      hideContainerForUid(key, quoteDiv);
    });
 
    // 3）点评区域：<div id="comment_xxx"> 里的 div.plc
    vt.querySelectorAll('div[id^="comment_"]').forEach(commentWrap => {
      commentWrap.querySelectorAll('div.plc').forEach(plc => {
        const a = plc.querySelector('a[href*="home.php?mod=space"]');
        if (!a) return;
        const uid = resolveUidFromLink(a);
        if (!uid || !isBlocked(uid) || isForceShown(plc)) return;
        hideContainerForUid(uid, plc);
      });
    });
 
    // 4）评分区域：<div id="ratelog_xxx"> 里的 li.flex-box.mli
    vt.querySelectorAll('div[id^="ratelog_"]').forEach(rateDiv => {
      rateDiv.querySelectorAll('li.flex-box.mli, li.mli').forEach(li => {
        const a = li.querySelector('a[href*="home.php?mod=space"]');
        if (!a) return;
        const uid = resolveUidFromLink(a);
        if (!uid || !isBlocked(uid) || isForceShown(li)) return;
        hideContainerForUid(uid, li);
      });
    });
  }
 
  function filterForumDisplayPage() {
    if (!/mod=forumdisplay/.test(location.search + location.href)) return;
 
    // PC：版块主题列表
    const bodies = document.querySelectorAll(
      'tbody[id^="normalthread_"], tbody[id^="stickthread_"]'
    );
 
    bodies.forEach(tb => {
      const a = tb.querySelector('td.by cite a[href*="home.php?mod=space"]') ||
        tb.querySelector('a[href*="home.php?mod=space"]');
      if (!a) return;
 
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(tb)) return;
 
      hideContainerForUid(uid, tb);
    });
 
    // 手机版：版块主题列表里的 <li class="list">
    const mobileThreadItems = document.querySelectorAll('.threadlist_box li.list');
    mobileThreadItems.forEach(li => {
      const a =
        li.querySelector('.threadlist_top a[href*="home.php?mod=space"]') ||
        li.querySelector('a[href*="home.php?mod=space&uid="]');
      if (!a) return;
 
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(li)) return;
 
      hideContainerForUid(uid, li);
    });
  }
 
  function filterRanklistPage() {
    const hrefAll = location.href + location.search;
    if (!/misc\.php/.test(hrefAll) || !/mod=ranklist/.test(hrefAll)) return;
 
    const ct = document.querySelector('#ct');
    if (!ct) return;
 
    ct.querySelectorAll('dl.bbda, dl.bbda.cl').forEach(dl => {
      let a =
        dl.querySelector('a[href*="home.php?mod=space&uid="]:not([href*="ac="])') ||
        dl.querySelector('a[href*="home.php?mod=space&uid="]');
      if (!a) return;
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(dl)) return;
      hideContainerForUid(uid, dl);
    });
  }
 
  function filterIndexLastPoster() {
    const cells = document.querySelectorAll('td.fl_by');
    if (!cells.length) return;
 
    cells.forEach(cell => {
      const userLink =
        cell.querySelector('cite a[href*="home.php?mod=space"]') ||
        cell.querySelector('a[href*="home.php?mod=space"]');
      if (!userLink) return;
 
      const name = (userLink.textContent || '').trim();
      if (!name) return;
      if (!isBlockedByName(name)) return;
 
      userLink.textContent = '';
    });
  }
 
  function filterSearchPage() {
    const hrefAll = location.href + location.search;
    if (!/search\.php/.test(hrefAll) || !/mod=forum/.test(hrefAll)) return;
 
    const ct = document.querySelector('#ct');
    if (!ct) return;
 
    const selectors = [
      '.tl table tbody tr',
      '.tl tbody tr',
      '#threadlist tbody tr',
      '.slst li',
      '.slst table tbody tr'
    ];
 
    selectors.forEach(sel => {
      ct.querySelectorAll(sel).forEach(row => {
        const authorLink = row.querySelector('a[href*="home.php?mod=space"]');
        if (!authorLink) return;
 
        const uid = resolveUidFromLink(authorLink);
        if (!uid || !isBlocked(uid) || isForceShown(row)) return;
 
        hideContainerForUid(uid, row);
      });
    });
  }
 
  function filterNoticePage() {
    if (!/mod=space&do=notice/.test(location.search + location.href)) return;
 
    const dls = document.querySelectorAll('dl[notice], dl.cl');
    dls.forEach(dl => {
      const a = dl.querySelector('a[href*="home.php?mod=space"]');
      if (!a) return;
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(dl)) return;
      hideContainerForUid(uid, dl);
    });
  }
 
  function filterPmPage() {
    if (!/mod=space&do=pm/.test(location.search + location.href)) return;
 
    const dialogs = document.querySelectorAll('dl[id^="pmlist_"]');
    dialogs.forEach(dlg => {
      const a =
        dlg.querySelector('dd.m.avt a[href*="home.php?mod=space&uid="]') ||
        dlg.querySelector('a[href*="home.php?mod=space&uid="]');
      if (!a) return;
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(dlg)) return;
      hideContainerForUid(uid, dlg);
    });
 
    const items = document.querySelectorAll('.pml li, .pml tr, .pm_list li');
    items.forEach(item => {
      const a = item.querySelector('a[href*="home.php?mod=space&uid="]');
      if (!a) return;
      const uid = resolveUidFromLink(a);
      if (!uid || !isBlocked(uid) || isForceShown(item)) return;
      hideContainerForUid(uid, item);
    });
  }
 
  function filterGenericLists() {
    const ct = document.querySelector('#ct');
    if (!ct) return;
 
    const selectors = [
      'table.dt tbody tr',
      '.threadlist tbody tr',
      '.xl.xl2 li',
      '.xl li'
    ];
    selectors.forEach(sel => {
      ct.querySelectorAll(sel).forEach(row => {
        const a = row.querySelector('a[href*="home.php?mod=space"]');
        if (!a) return;
        const uid = resolveUidFromLink(a);
        if (!uid || !isBlocked(uid) || isForceShown(row)) return;
        hideContainerForUid(uid, row);
      });
    });
  }
 
  // ============================
  // 调度
  // ============================
  function applyBlocking() {
    restoreUnblockedElements();
    if (isEmpty(blockedMap)) return;
 
    filterThreadPosts();        // PC 主题页
    filterMobileThreadPosts();  // 手机版主题页（楼层 + 引用 + 点评 + 评分）
 
    filterForumDisplayPage();
    filterRanklistPage();
    filterIndexLastPoster();
    filterSearchPage();
    filterNoticePage();
    filterPmPage();
    filterGenericLists();
  }
 
  let applyTimer = null;
  let mutationObserver = null;
 
  function scheduleReapply() {
    if (applyTimer) {
      clearTimeout(applyTimer);
    }
    applyTimer = setTimeout(() => {
      applyBlocking();
      applyTimer = null;
    }, 200);
  }
 
  function initMutationObserver() {
    if (mutationObserver || typeof MutationObserver === 'undefined') return;
    mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          scheduleReapply();
          break;
        }
      }
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
 
  function init() {
    createHeaderUI();         // PC 顶部入口 / 手机版只创建面板
    addProfileBlockButton();  // 个人资料页“屏蔽此人”
    injectMobileFindEntry();  // 手机版“发现”页入口
    applyBlocking();          // 首次过滤
    initMutationObserver();   // 监听后续 DOM 变化
  }
 
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();