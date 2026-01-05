// ==UserScript==
// @name         Bilibili 自律跳转
// @namespace    https://github.com/B1UEN982
// @version      2.3
// @description  B 站访问自律拦截与限时放行
// @license      MIT
// @match        *://*.bilibili.com/*
// @match        *://bilibili.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559216/Bilibili%20%E8%87%AA%E5%BE%8B%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559216/Bilibili%20%E8%87%AA%E5%BE%8B%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const REMIND = "https://b1uen982.github.io/reminder-page/";
  const KEY = "bili_allow_until";
  const LAST = "bili_last_url"; // ← 新增

  const now = Date.now();
  let until = Number(GM_getValue(KEY, 0));

  /* ========== 1. 处理 allow 参数（放行入口） ========== */
  const params = new URLSearchParams(location.search);
  if (params.has("allow")) {
    const m = Number(params.get("allow"));
    if (m > 0 && m <= 1440) {
      until = Date.now() + m * 60_000;
      GM_setValue(KEY, until);
    }
    params.delete("allow");
    history.replaceState(
      null,
      "",
      location.pathname + (params.toString() ? "?" + params : "")
    );
  }

  /* ====== 新增：放行后优先回到被拦截前页面 ====== */
  const back = GM_getValue(LAST, "");
  if (back && Date.now() < GM_getValue(KEY, 0)) {
    GM_setValue(LAST, "");
    location.replace(back);
    return;
  }

  /* ========== 2. 放行期：悬浮倒计时球 ========== */
  if (now < until) {
    const mount = () => {
      if (!document.body || document.getElementById("bili-ball")) {
        return setTimeout(mount, 50);
      }

      const ball = document.createElement("div");
      ball.id = "bili-ball";
      ball.style.cssText = `
        position: fixed;
        right: 0;
        top: 40%;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg,#fb7299,#ff3867);
        color: #fff;
        border-radius: 30px 0 0 30px;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999;
        user-select: none;
        box-shadow: 0 2px 8px rgba(0,0,0,.2);
      `;

      const format = (ms) => {
        const t = Math.max(0, (ms / 1000) | 0);
        return `${(t / 60) | 0}:${String(t % 60).padStart(2, "0")}`;
      };

      const tick = () => {
        const left = GM_getValue(KEY, 0) - Date.now();
        if (left <= 0) {
          clearInterval(timer);
          ball.remove();
          location.replace(REMIND);
          return;
        }
        ball.innerHTML = `
          <div>${format(left)}</div>
          <div style="font-size:9px;opacity:.8">剩余</div>
        `;
      };

      ball.onclick = () => {
        if (confirm("提前结束放行？")) {
          GM_setValue(KEY, 0);
          location.replace(REMIND);
        }
      };

      document.body.appendChild(ball);
      tick();
      const timer = setInterval(tick, 1000);
    };

    mount();
    return;
  }

  /* ========== 3. 非放行期：全站拦截 ========== */
  if (!location.href.startsWith(REMIND)) {
    GM_setValue(LAST, location.href);
  }
  location.replace(REMIND);
})();
