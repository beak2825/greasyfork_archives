// ==UserScript==
// @name         导入测试环境机关保接口
// @namespace    导入测试环境机关保接口
// @version      1.0.0
// @description  上传测试环境导出的list.json，在生产环境按serviceCode检查不存在则新增；结束自动下载日志；token从sessionStorage读取
// @author       fbz
// @match        http://10.96.235.94/tyscAdmin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rs.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563302/%E5%AF%BC%E5%85%A5%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/563302/%E5%AF%BC%E5%85%A5%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%9C%BA%E5%85%B3%E4%BF%9D%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 测试环境 API 配置 ======
  const BASE = 'http://10.96.235.94/fjsi-ywzc-unifyoutput';
  const API_LIST = `${BASE}/openServiceInfo/list`;
  const API_ADD = `${BASE}/openServiceInfo/approvalsaveService`;

  // sysCode 固定
  const SYS_CODE = '002';

  // token：按你给的写死；如需动态获取在这里改
  const TOKEN = sessionStorage.getItem('token') || '';

  // serviceUrl 替换规则（导入时用）
  const URL_FROM_1 = 'http://10.96.21.227:80';
  const URL_FROM_2 = 'http://10.96.21.227';
  const URL_TO = 'http://10.96.235.33:32409';

  // 请求并发：建议 1（更稳），想快点可调到 2/3，但别太高
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
      throw new Error(`HTTP ${resp.status} ${resp.statusText}\n${text}`);
    }
    return await resp.json();
  }

  // ====== 导出逻辑（测试环境） ======
  async function exportAllFromTestEnv(setStatus, stopFlagRef) {
    // 1) 先取 total
    setStatus('导出 1/3：获取 total ...');
    const firstBody = {
      sysCode: SYS_CODE,
      serviceName: '',
      serviceCode: '',
      realServiceCode: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    };
    const firstRes = await postJson(API_LIST, firstBody);
    const total = firstRes?.map?.total;

    if (typeof total !== 'number') {
      throw new Error(`导出失败：返回结构异常（缺少map.total）\n${JSON.stringify(firstRes)}`);
    }
    if (stopFlagRef.stop) return { total, list: [] };

    // 2) 再取全量 list
    setStatus(`导出 2/3：获取全量 list ...\n(total=${total})`);
    const secondBody = { ...firstBody, pageSize: total };
    const secondRes = await postJson(API_LIST, secondBody);
    const list = secondRes?.map?.list;

    if (!Array.isArray(list)) {
      throw new Error(`导出失败：返回结构异常（缺少map.list数组）\n${JSON.stringify(secondRes)}`);
    }
    if (stopFlagRef.stop) return { total, list };

    // 3) 下载
    setStatus(`导出 3/3：生成文件并下载 ...\n(list长度=${list.length})`);
    const filename = `openServiceInfo_PROD_${SYS_CODE}_total${total}_${formatTimestamp()}.json`;
    downloadJson(filename, list);

    setStatus(`导出完成 ✅\n已下载：${filename}\n(list长度=${list.length})`);
    return { total, list };
  }

  // ====== 导入逻辑（你确认可用那套） ======
  async function checkExistsByServiceCode(serviceCode) {
    const body = {
      sysCode: SYS_CODE,
      serviceName: '',
      serviceCode: serviceCode || '',
      realServiceCode: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    };
    const data = await postJson(API_LIST, body);

    const total = data?.map?.total;
    if (typeof total !== 'number') {
      throw new Error(`list 返回结构异常：${JSON.stringify(data)}`);
    }
    return { exists: total > 0, total, raw: data };
  }

  function transformServiceUrl(serviceUrl) {
    if (typeof serviceUrl !== 'string') return '';
    if (serviceUrl.includes(URL_FROM_1)) return serviceUrl.replace(URL_FROM_1, URL_TO);
    if (serviceUrl.includes(URL_FROM_2)) return serviceUrl.replace(URL_FROM_2, URL_TO);
    return serviceUrl;
  }

  async function addService(item) {
    const params = {
      sysCode: SYS_CODE,
      serviceName: item.serviceName || '',
      serviceCode: item.serviceCode || '',
      realServiceCode: item.realServiceCode || item.serviceCode || '',
      serviceUrl: transformServiceUrl(item.serviceUrl || '')
    };

    const data = await postJson(API_ADD, params);

    const appcode = data?.appcode;
    const success = data?.success;
    const msg = data?.msg;

    const ok = appcode === '0' && success === true;

    return { ok, msg: msg || '', params, raw: data };
  }

  // ====== 通用：下载JSON、时间戳 ======
  function downloadJson(filename, obj) {
    const jsonStr = JSON.stringify(obj, null, 2);
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

  // ====== UI ======
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

    const btnExport = mkBtn('导出生产环境机关保接口JSON');
    const btnUploadRun = mkBtn('上传测试环境接口JSON并执行导入');
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

    // ====== 状态与日志 ======
    let lastLog = {
      added: { success: {}, failed: {} },
      skipped: []
    };

    let running = false;
    const stopFlagRef = { stop: false };

    function resetLog() {
      lastLog = {
        added: { success: {}, failed: {} },
        skipped: []
      };
    }

    async function readFileAsJson(file) {
      const text = await file.text();
      return JSON.parse(text);
    }

    function buildLogFilename(meta) {
      const ts = formatTimestamp();
      const hint = meta?.hint ? String(meta.hint).replace(/[^\w.-]+/g, '_') : 'import';
      return `openServiceInfo_${hint}_log_${ts}.json`;
    }

    async function runImport(list) {
      if (!Array.isArray(list)) throw new Error('上传的JSON不是数组，请确认文件内容为 list 数组');

      // 去重：同一个 serviceCode 只处理一次（按第一次出现为准）
      const seen = new Set();
      const tasks = [];
      for (const item of list) {
        const sc = item?.serviceCode;
        if (!sc) continue;
        if (seen.has(sc)) continue;
        seen.add(sc);
        tasks.push(item);
      }

      const total = tasks.length;
      let idx = 0;
      let addedOk = 0;
      let addedFail = 0;
      let skipped = 0;

      stopFlagRef.stop = false;

      setStatus(`准备导入：${total} 条（已按 serviceCode 去重）\n并发：${CONCURRENCY}\n`);

      async function worker() {
        while (true) {
          if (stopFlagRef.stop) return;

          const curIndex = idx++;
          if (curIndex >= total) return;

          const item = tasks[curIndex];
          const serviceCode = item.serviceCode;

          setStatus(
            `导入中 ${curIndex + 1}/${total}\n` +
              `serviceCode: ${serviceCode}\n` +
              `addedOk=${addedOk}, addedFail=${addedFail}, skipped=${skipped}\n` +
              (stopFlagRef.stop ? '\n已请求停止...' : '')
          );

          try {
            const existRes = await checkExistsByServiceCode(serviceCode);
            if (existRes.exists) {
              lastLog.skipped.push(serviceCode);
              skipped++;
              continue;
            }

            const addRes = await addService(item);
            if (addRes.ok) {
              lastLog.added.success[serviceCode] = {
                serviceUrl: addRes.params.serviceUrl
              };
              addedOk++;
            } else {
              lastLog.added.failed[serviceCode] = {
                params: addRes.params,
                msg: addRes.msg || '未知错误'
              };
              addedFail++;
            }
          } catch (e) {
            const params = {
              sysCode: SYS_CODE,
              serviceName: item?.serviceName || '',
              serviceCode: item?.serviceCode || '',
              realServiceCode: item?.realServiceCode || item?.serviceCode || '',
              serviceUrl: transformServiceUrl(item?.serviceUrl || '')
            };
            lastLog.added.failed[serviceCode] = {
              params,
              msg: e && e.message ? e.message : String(e)
            };
            addedFail++;
          }
        }
      }

      const workers = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(workers);

      const summary =
        `导入结束 ✅\n` +
        `总数（去重后）：${total}\n` +
        `新增成功：${addedOk}\n` +
        `新增失败：${addedFail}\n` +
        `跳过（已存在）：${skipped}\n` +
        (stopFlagRef.stop ? `\n（已中途停止）` : '');

      setStatus(summary);
      return { total, addedOk, addedFail, skipped, stopped: stopFlagRef.stop };
    }

    function setButtonsDisabled(disabled) {
      btnExport.disabled = disabled;
      btnUploadRun.disabled = disabled;
      btnStop.disabled = false; // stop 始终可点
      const op = disabled ? '0.65' : '1';
      btnExport.style.opacity = op;
      btnUploadRun.style.opacity = op;
    }

    // ====== 导出按钮 ======
    btnExport.addEventListener('click', async () => {
      if (running) return;
      running = true;
      setButtonsDisabled(true);
      stopFlagRef.stop = false;

      try {
        if (!TOKEN) throw new Error('token 为空：请在脚本里设置 TOKEN 或改成动态读取');
        await exportAllFromTestEnv(setStatus, stopFlagRef);
      } catch (e) {
        console.error(e);
        setStatus(`导出失败 ❌\n${e && e.message ? e.message : String(e)}`);
      } finally {
        running = false;
        setButtonsDisabled(false);
      }
    });

    // ====== 导入按钮 ======
    btnUploadRun.addEventListener('click', () => {
      if (running) return;
      fileInput.value = '';
      fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      running = true;
      setButtonsDisabled(true);
      stopFlagRef.stop = false;

      try {
        if (!TOKEN) throw new Error('token 为空：请在脚本里设置 TOKEN 或改成动态读取');

        resetLog();
        setStatus('读取文件中...');

        const json = await readFileAsJson(file);

        // 允许上传两种格式：
        // 1) 直接是数组 list
        // 2) { list: [...] }
        const list = Array.isArray(json) ? json : (Array.isArray(json?.list) ? json.list : null);
        if (!list) throw new Error('JSON格式不符合：需要是数组，或对象里包含 list 数组');

        const result = await runImport(list);

        // ✅ 导入结束自动下载日志
        const filename = buildLogFilename({ hint: `${SYS_CODE}_${result.total}_done` });
        downloadJson(filename, lastLog);
        setStatus(`${status.textContent}\n\n已自动下载日志：${filename}`);
      } catch (e) {
        console.error(e);
        // ❌ 失败也自动下载日志（方便排查）
        try {
          const filename = buildLogFilename({ hint: `${SYS_CODE}_error` });
          downloadJson(filename, lastLog);
          setStatus(`导入失败 ❌\n${e && e.message ? e.message : String(e)}\n\n已自动下载日志：${filename}`);
        } catch (_) {
          setStatus(`导入失败 ❌\n${e && e.message ? e.message : String(e)}`);
        }
      } finally {
        running = false;
        setButtonsDisabled(false);
      }
    });

    // ====== 停止按钮（导出/导入都会尊重 stopFlag） ======
    btnStop.addEventListener('click', () => {
      stopFlagRef.stop = true;
      setStatus((status.textContent || '') + '\n已请求停止：等待当前请求完成后停止...');
    });

    // 组装 UI
    group.appendChild(btnExport);
    group.appendChild(btnUploadRun);
    group.appendChild(btnStop);

    wrap.appendChild(group);
    wrap.appendChild(status);
    wrap.appendChild(fileInput);
    document.body.appendChild(wrap);
  }

  createUI();
})();

