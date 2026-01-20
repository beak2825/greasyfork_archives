// ==UserScript==
// @name         导出测试环境机关保接口
// @namespace    导出测试环境机关保接口
// @version      1.0.0
// @description  导出测试环境机关保接口并保存为json文件
// @author       fbz
// @match        http://10.96.235.212/tyscAdmin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rs.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563300/%E5%AF%BC%E5%87%BA%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/563300/%E5%AF%BC%E5%87%BA%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 你可以在这里改默认查询参数 ======
  const API_URL = 'http://10.96.235.212/fjsi-ywzc-unifyoutput/openServiceInfo/list';
  const DEFAULT_QUERY = {
    sysCode: '002',
    serviceName: '',
    serviceCode: '',
    realServiceCode: '',
    status: '',
    pageNum: 1,
    pageSize: 10
  };

  // 如果 token 不是写死的，你可以在这里替换成动态读取：
  // 按你的系统实际情况改，比如：
  const TOKEN = sessionStorage.getItem('token') || '';

  function buildHeaders() {
    return {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json;charset=UTF-8',
      token: TOKEN
    };
  }

  async function postList(bodyObj) {
    const resp = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: buildHeaders(),
      body: JSON.stringify(bodyObj)
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status} ${resp.statusText}\n${text}`);
    }

    const data = await resp.json();
    if (!data || data.success !== true || data.appcode !== '0') {
      throw new Error(`接口返回异常：${JSON.stringify(data)}`);
    }
    if (!data.map || typeof data.map.total !== 'number' || !Array.isArray(data.map.list)) {
      throw new Error(`返回结构不符合预期：${JSON.stringify(data)}`);
    }
    return data;
  }

  function downloadJson(filename, jsonObj) {
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatTimestamp(d = new Date()) {
    return (
      d.getFullYear() +
      pad2(d.getMonth() + 1) +
      pad2(d.getDate()) +
      '_' +
      pad2(d.getHours()) +
      pad2(d.getMinutes()) +
      pad2(d.getSeconds())
    );
  }

  // ====== 简单 UI：右下角按钮 + 状态提示 ======
  function createUI() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","PingFang SC","Microsoft YaHei",sans-serif;
    `;

    const btn = document.createElement('button');
    btn.textContent = '导出机关保接口JSON';
    btn.style.cssText = `
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,.15);
      background: #fff;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,.12);
      font-size: 14px;
    `;

    const status = document.createElement('div');
    status.textContent = '';
    status.style.cssText = `
      max-width: 260px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.9);
      box-shadow: 0 6px 18px rgba(0,0,0,.10);
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      display: none;
    `;

    function setStatus(msg, show = true) {
      status.textContent = msg || '';
      status.style.display = show && msg ? 'block' : 'none';
    }

    let running = false;

    btn.addEventListener('click', async () => {
      if (running) return;
      running = true;
      btn.disabled = true;
      btn.style.opacity = '0.65';

      try {
        if (!TOKEN) throw new Error('token 为空：请在脚本里设置 TOKEN 或改成动态读取');

        setStatus('步骤1/3：获取 total ...');
        const firstBody = { ...DEFAULT_QUERY, pageNum: 1, pageSize: 10 };
        const firstRes = await postList(firstBody);
        const total = firstRes.map.total;

        setStatus(`步骤2/3：获取全量 list ...\n(total=${total})`);
        const secondBody = { ...DEFAULT_QUERY, pageNum: 1, pageSize: total };
        const secondRes = await postList(secondBody);
        const list = secondRes.map.list;

        setStatus(`步骤3/3：生成文件并下载 ...\n(list长度=${list.length})`);
        const filename = `openServiceInfo_USER_TEST_${DEFAULT_QUERY.sysCode}_total${total}_${formatTimestamp()}.json`;
        downloadJson(filename, list);

        setStatus(`完成 ✅\n已下载：${filename}\n(list长度=${list.length})`);
      } catch (e) {
        console.error(e);
        setStatus(`失败 ❌\n${e && e.message ? e.message : String(e)}`);
      } finally {
        running = false;
        btn.disabled = false;
        btn.style.opacity = '1';
        // 不自动隐藏状态，方便你看报错；想自动隐藏可取消下面注释：
        // setTimeout(() => setStatus('', false), 4000);
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(status);
    document.body.appendChild(wrap);
  }

  createUI();
})();
