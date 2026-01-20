// ==UserScript==
// @name         导入生产环境机关保接口到政务外网
// @namespace    导入生产环境机关保接口到政务外网
// @version      1.0.0
// @description  上传生产环境导出的list.json，在生产环境按serviceCode检查不存在则新增；结束自动下载日志；token从sessionStorage读取
// @author       fbz
// @match        http://zwfw.rst.fujian.gov.cn:8005/tyscAdmin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rs.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563303/%E5%AF%BC%E5%85%A5%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3%E5%88%B0%E6%94%BF%E5%8A%A1%E5%A4%96%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/563303/%E5%AF%BC%E5%85%A5%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3%E5%88%B0%E6%94%BF%E5%8A%A1%E5%A4%96%E7%BD%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 生产环境 API ======
  const BASE = 'http://zwfw.rst.fujian.gov.cn:8005/fjsi-ywzc-unifyoutput';
  const API_LIST = `${BASE}/openServiceInfo/list`;
  const API_ADD = `${BASE}/openServiceInfo/approvalsaveService`;

  // ====== 固定参数 ======
  const SYS_CODE = '012';
  const FIXED_SERVICE_URL = 'http://172.27.55.122:1801/saasProxy/business/proxy';

  // token：你指定的方式
  const TOKEN = sessionStorage.getItem('token') || '';

  // 并发（生产环境建议 1）
  const CONCURRENCY = 1;

  function buildHeaders() {
    return {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json;charset=UTF-8',
      token: TOKEN
    };
  }

  async function postJson(url, bodyObj) {
    const resp = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: buildHeaders(),
      body: JSON.stringify(bodyObj)
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status}\n${text}`);
    }
    return await resp.json();
  }

  async function checkExists(serviceCode) {
    const body = {
      sysCode: SYS_CODE,
      serviceName: '',
      serviceCode: serviceCode || '',
      realServiceCode: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    };
    const res = await postJson(API_LIST, body);
    const total = res?.map?.total;
    if (typeof total !== 'number') {
      throw new Error(`查询接口返回异常：${JSON.stringify(res)}`);
    }
    return total > 0;
  }

  async function addService(item) {
    const params = {
      sysCode: SYS_CODE,
      serviceName: item?.serviceName || '',
      serviceCode: item?.serviceCode || '',
      realServiceCode: item?.realServiceCode || item?.serviceCode || '',
      serviceUrl: FIXED_SERVICE_URL
    };

    const res = await postJson(API_ADD, params);
    const ok = res?.appcode === '0' && res?.success === true;

    return {
      ok,
      msg: res?.msg || '',
      params
    };
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
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

  function ts() {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}_${pad2(d.getHours())}${pad2(
      d.getMinutes()
    )}${pad2(d.getSeconds())}`;
  }

  // ====== UI：与测试环境保持一致 ======
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

    const group = document.createElement('div');
    group.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      max-width: 560px;
    `;

    function mkBtn(text) {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.style.cssText = `
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(0,0,0,.15);
        background: #fff;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0,0,0,.12);
        font-size: 14px;
      `;
      return btn;
    }

    const btnRun = mkBtn('上传生产环境接口JSON并执行导入');
    const btnStop = mkBtn('停止');
    btnStop.style.opacity = '0.85';

    const status = document.createElement('div');
    status.style.cssText = `
      max-width: 560px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.92);
      box-shadow: 0 6px 18px rgba(0,0,0,.10);
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-wrap;
      display: none;
    `;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.style.display = 'none';

    function setStatus(msg, show = true) {
      status.textContent = msg || '';
      status.style.display = show && msg ? 'block' : 'none';
    }

    // ====== 导入逻辑（保持不变） ======
    let stopFlag = false;
    let running = false;

    btnRun.addEventListener('click', () => {
      if (running) return;
      if (!TOKEN) {
        setStatus('sessionStorage 中未找到 token（key=token）', true);
        return;
      }
      fileInput.value = '';
      fileInput.click();
    });

    btnStop.addEventListener('click', () => {
      stopFlag = true;
      setStatus((status.textContent || '') + '\n已请求停止：等待当前请求完成后停止...');
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      running = true;
      stopFlag = false;
      btnRun.disabled = true;
      btnRun.style.opacity = '0.65';

      const log = {
        added: { success: {}, failed: {} },
        skipped: []
      };

      try {
        setStatus('读取文件中...');
        const json = JSON.parse(await file.text());
        const arr = Array.isArray(json) ? json : json?.list;

        if (!Array.isArray(arr)) {
          throw new Error('JSON格式不正确：需要是数组，或对象里包含 list 数组');
        }

        // 去重（serviceCode）
        const seen = new Set();
        const tasks = [];
        for (const it of arr) {
          const sc = it?.serviceCode;
          if (!sc) continue;
          if (seen.has(sc)) continue;
          seen.add(sc);
          tasks.push(it);
        }

        setStatus(
          `准备导入到生产环境：${tasks.length} 条（已按 serviceCode 去重）\n` +
            `sysCode=${SYS_CODE}\n` +
            `新增 serviceUrl 固定：${FIXED_SERVICE_URL}\n` +
            `并发：${CONCURRENCY}\n`
        );

        // 并发池（默认1）
        let idx = 0;
        async function worker() {
          while (true) {
            if (stopFlag) return;
            const cur = idx++;
            if (cur >= tasks.length) return;

            const item = tasks[cur];
            const sc = item.serviceCode;

            setStatus(
              `导入中 ${cur + 1}/${tasks.length}\n` +
                `serviceCode: ${sc}\n` +
                (stopFlag ? '\n已请求停止...' : '')
            );

            try {
              const exists = await checkExists(sc);
              if (exists) {
                log.skipped.push(sc);
                continue;
              }

              const res = await addService(item);
              if (res.ok) {
                log.added.success[sc] = { serviceUrl: FIXED_SERVICE_URL };
              } else {
                log.added.failed[sc] = { params: res.params, msg: res.msg };
              }
            } catch (e) {
              log.added.failed[sc] = {
                params: {
                  sysCode: SYS_CODE,
                  serviceName: item?.serviceName || '',
                  serviceCode: item?.serviceCode || '',
                  realServiceCode: item?.realServiceCode || item?.serviceCode || '',
                  serviceUrl: FIXED_SERVICE_URL
                },
                msg: e && e.message ? e.message : String(e)
              };
            }
          }
        }

        const workers = Array.from({ length: CONCURRENCY }, () => worker());
        await Promise.all(workers);

        const filename = `openServiceInfo_PROD_${SYS_CODE}_log_${ts()}.json`;
        downloadJson(filename, log);

        setStatus(`${status.textContent}\n\n完成 ✅\n日志已自动下载：${filename}`);
      } catch (e) {
        console.error(e);

        // 失败也下载日志（方便排查）
        const filename = `openServiceInfo_PROD_${SYS_CODE}_log_${ts()}_error.json`;
        try {
          downloadJson(filename, log);
          setStatus(`失败 ❌\n${e && e.message ? e.message : String(e)}\n\n日志已自动下载：${filename}`);
        } catch (_) {
          setStatus(`失败 ❌\n${e && e.message ? e.message : String(e)}`);
        }
      } finally {
        running = false;
        btnRun.disabled = false;
        btnRun.style.opacity = '1';
      }
    });

    group.appendChild(btnRun);
    group.appendChild(btnStop);

    wrap.appendChild(group);
    wrap.appendChild(status);
    wrap.appendChild(fileInput);

    document.body.appendChild(wrap);
  }

  createUI();
})();
