// ==UserScript==
// @name         B站批量拉黑开屏广告
// @version      3.0.4
// @description  批量拉黑
// @note         更新于 2025年11月3日
// @author       qcgzxw
// @match        https://*.bilibili.com/*
// @license      GNU GPLv3
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @namespace    https://greasyfork.org/zh-CN/users/1192640-huaisha2049
// @downloadURL https://update.greasyfork.org/scripts/554597/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/554597/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*************** 配置区 ***************/
  // ✅ 内置黑名单UID
  const BUILTIN_BLACKLIST = [
    1356882480, 1082814196, 1919627194, 1957313739,
    1817661914, 1627242161, 1859459400, 1826766269,
    1926952280, 2103756604, 1987938455,
  ];

  // ✅ 收藏夹列表（链接 + 名称）
  const FAVORITE_LIST = [
    {
      name: "拉格朗日广告",
      url: "https://space.bilibili.com/95863234/favlist?fid=1520149734&ftype=create"
    },
    {
      name: "无限期途广告",
      url: "https://space.bilibili.com/95863234/favlist?fid=1852507834&ftype=create"
    },
    {
      name: "广告发布号",
      url: "https://space.bilibili.com/95863234/favlist?fid=2008751934&ftype=create"
    },
  ];

  // ✅ 拉黑请求间隔（毫秒）
  const BLOCK_INTERVAL = 250;

  /*************** 初始化 ***************/
  const match = document.cookie.match(/bili_jct=([^;]+)/);
  if (!match) {
    alert("⚠️ 未找到bili_jct，请先登录B站！");
    return;
  }
  const csrf_token = match[1];

  /*************** 工具函数 ***************/
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const fetchJson = async url => (await fetch(url, { credentials: 'include' })).json();
  const parseFavUrl = url => ({
    uid: url.match(/space\.bilibili\.com\/(\d+)/)?.[1],
    favid: url.match(/[?&]fid=(\d+)/)?.[1]
  });

  /*************** 获取收藏夹作者UID ***************/
  async function getFavAuthors(fav) {
    const { uid, favid } = parseFavUrl(fav.url);
    if (!uid || !favid) throw new Error(`无法解析收藏夹链接: ${fav.url}`);

    let page = 1;
    const uids = new Set();

    console.log(`📥 抓取收藏夹【${fav.name}】(${uid}/${favid})...`);

    while (true) {
      const apiUrl = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${favid}&pn=${page}&ps=20&platform=web`;
      const data = await fetchJson(apiUrl);

      if (data.code !== 0 || !data.data?.medias?.length) break;
      data.data.medias.forEach(m => m.upper?.mid && uids.add(m.upper.mid));

      console.log(`✅ 收藏夹 ${fav.name} 第 ${page} 页已处理，共 ${uids.size} 个唯一UP`);
      if (!data.data.has_more) break;
      page++;
    }

    console.log(`🎯 收藏夹【${fav.name}】共获取 ${uids.size} 个唯一作者UID`);
    return Array.from(uids);
  }

  /*************** 拉黑函数 ***************/
  async function blockUser(uid) {
    const body = new URLSearchParams({
      fid: uid,
      act: 5,
      re_src: 11,
      jsonp: 'jsonp',
      csrf: csrf_token
    });

    const res = await fetch('https://api.bilibili.com/x/relation/modify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const data = await res.json();
    if (data.code === 0) {
      console.log(`🚫 已拉黑: https://space.bilibili.com/${uid}`);
    } else {
      console.warn(`⚠️ 拉黑失败(${uid}): ${data.message}`);
    }
  }

  /*************** 弹出选择框 ***************/
  async function selectFavorites() {
    return new Promise(resolve => {
      // 创建半透明遮罩层
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });

      // 创建对话框
      const box = document.createElement('div');
      Object.assign(box.style, {
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '360px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      });

      const title = document.createElement('h3');
      title.textContent = '选择要拉黑的收藏夹';
      Object.assign(title.style, { margin: '0 0 10px', textAlign: 'center' });
      box.appendChild(title);

      const list = document.createElement('div');
      FAVORITE_LIST.forEach((fav, idx) => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '6px';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = idx;
        label.appendChild(input);
        label.append(` ${fav.name}`);
        list.appendChild(label);
      });

      // 是否包含内置黑名单
      const builtin = document.createElement('label');
      builtin.style.display = 'block';
      builtin.style.margin = '10px 0';
      const builtinInput = document.createElement('input');
      builtinInput.type = 'checkbox';
      builtinInput.checked = true;
      builtin.appendChild(builtinInput);
      builtin.append(' 同时拉黑内置黑名单');
      list.appendChild(builtin);

      box.appendChild(list);

      const btn = document.createElement('button');
      btn.textContent = '开始拉黑';
      Object.assign(btn.style, {
        width: '100%',
        marginTop: '10px',
        padding: '8px',
        background: '#d9001b',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      });

      btn.onclick = () => {
        const selectedFavs = Array.from(list.querySelectorAll('input[type=checkbox]'))
          .filter((c, i) => i < FAVORITE_LIST.length && c.checked)
          .map(c => FAVORITE_LIST[c.value]);
        const includeBuiltin = builtinInput.checked;
        overlay.remove();
        resolve({ selectedFavs, includeBuiltin });
      };

      box.appendChild(btn);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    });
  }

  /*************** 主流程 ***************/
  async function startBatchBlock() {
    try {
      const { selectedFavs, includeBuiltin } = await selectFavorites();
      if (selectedFavs.length === 0 && !includeBuiltin) {
        alert('请至少选择一个收藏夹或内置黑名单');
        return;
      }

      const all_uids = new Set(includeBuiltin ? BUILTIN_BLACKLIST : []);

      for (const fav of selectedFavs) {
        const fav_uids = await getFavAuthors(fav);
        fav_uids.forEach(u => all_uids.add(u));
      }

      const uidArray = Array.from(all_uids);
      if (!confirm(`确定要拉黑 ${uidArray.length} 位UP主？`)) return;

      for (let i = 0; i < uidArray.length; i++) {
        await blockUser(uidArray[i]);
        await sleep(BLOCK_INTERVAL);
      }

      alert(`✅ 已完成批量拉黑，共 ${uidArray.length} 位UP主。`);
    } catch (err) {
      console.error('❌ 出错：', err);
      alert('批量拉黑出错，请查看控制台日志。');
    }
  }

  /*************** 页面按钮 ***************/
  function createStartButton() {
    const btn = document.createElement('button');
    btn.textContent = '批量拉黑收藏夹作者';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '500px',
      right: '10px',
      padding: '10px 20px',
      backgroundColor: '#d9001b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      zIndex: 99999,
      fontSize: '14px'
    });
    btn.addEventListener('click', startBatchBlock);
    document.body.appendChild(btn);
  }

  window.addEventListener('load', createStartButton);
})();
