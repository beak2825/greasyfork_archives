// ==UserScript==
// @name         sgidi407课时记录222
// @match        *://192.168.2.188:6001/*
// @match        *://192.168.2.189:4001/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @description  '用于记录学时'
// @version 0.0.2.20251209040706
// @namespace https://greasyfork.org/users/1546108
// @downloadURL https://update.greasyfork.org/scripts/558383/sgidi407%E8%AF%BE%E6%97%B6%E8%AE%B0%E5%BD%95222.user.js
// @updateURL https://update.greasyfork.org/scripts/558383/sgidi407%E8%AF%BE%E6%97%B6%E8%AE%B0%E5%BD%95222.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const REC = 'http://192.168.2.188:6001/api/sgidicol/recordingperiod';
  let sent = false;
  let authHeader = null;   // 记录 Authorization 头
  console.log(66664443)
  const _fetch = unsafeWindow.fetch.bind(unsafeWindow);

// ===== 新增：更醒目的居中提示框函数 =====
function showSuccessTip() {
  const div = document.createElement('div');
  div.id = 'sgidi-record-tip';
  div.textContent = '课时记录成功！';

  Object.assign(div.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px 32px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 999999,
    boxShadow: '0 4px 12px rgba(0,0,0,.4)',
    opacity: '1',
    transition: 'opacity 0.6s ease'
  });

  document.body.appendChild(div);

  // 1.8 秒后开始淡出
  setTimeout(() => {
    div.style.opacity = '0';
  }, 1800);

  // 再过 0.6 秒移除节点
  setTimeout(() => {
    div.remove();
  }, 2400);
}
// ===== 提示框函数结束 =====


  unsafeWindow.fetch = async function (input, init) {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input && typeof input.url === 'string') {
      url = input.url;
    }

    if (url && url.includes('/check?')) {

      // 先从 init.headers 里拿
      try {
        if (init && init.headers) {
          const h = init.headers instanceof Headers
            ? init.headers
            : new Headers(init.headers);
          const a = h.get('Authorization');
          if (a) authHeader = a;
        }
      } catch (e) {
        console.warn('[Hook-check] 从 init.headers 解析失败', e);
      }

      // 如果还没拿到，再从 input.headers 里拿（Request 对象的情况）
      try {
        if (!authHeader && input && input.headers) {
          const h2 = input.headers instanceof Headers
            ? input.headers
            : new Headers(input.headers);
          const a2 = h2.get('Authorization');
          if (a2) authHeader = a2;
        }
      } catch (e) {
        console.warn('[Hook-check] 从 input.headers 解析失败', e);
      }

      const rsp = await _fetch(input, init);

      // 打日志看看现在有没有值
      try {
        const clone = rsp.clone();
        const json = await clone.json();
        const u = new URL(url, location.href);
        const oldT   = Number(u.searchParams.get('_t')) || 0;
        const oldCnt = u.searchParams.get('educateCount') || 0;
        console.log('[Hook-check]', { url, oldT, oldCnt, authHeader, json });
        setTimeout(() => sendSecond(oldT, oldCnt),500);
      } catch (e) {
        console.error('[Hook-check] 解析失败', e);
      }

      return rsp;
    }

    return _fetch(input, init);
  };


  // 3. 用 GM_xmlhttpRequest 发送 recordingperiod，请求带 cookie + Authorization
  function sendSecond(oldT, oldCnt) {
    try {
      const v = document.querySelector('video');
      const dur = Math.round((v?.duration ?? 0) || 0);
      const newT = oldT + dur * 1000;
      const start = new Date(newT).toJSON().replace('T', ' ').slice(0, 19);

      const url = `${REC}?educateCount=${oldCnt}`
                + `&StartTime=${encodeURIComponent(start)}`
                + `&_t=${newT}`;

      const headers = { Accept: 'application/json, text/plain, */*' };
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      console.log('[Step2] 即将发送 recordingperiod', { url, headers });

      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers,
        withCredentials: true,     // 关键：带上 cookie
        onload(res) {
          sent = true;
          console.log('[Step2] recordingperiod 成功 ✅', res.status, res.responseText);

          // ===== 新增：成功后弹出提示框 =====
          showSuccessTip();
        },
        onerror(err) {
          console.error('[Step2] 失败 (onerror)', err);
        },
        ontimeout(err) {
          console.error('[Step2] 失败 (timeout)', err);
        }
      });
    } catch (e) {
      console.error('[Step2] 失败 (exception)', e);
    }
  }
})();
