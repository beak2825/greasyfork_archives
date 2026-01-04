// ==UserScript==
// @name         HDHive 自动签到脚本
// @namespace    https://hdhive.com/
// @version      1.0
// @description  每日自动签到（需手动填写token与csrf token）
// @author       You
// @match        https://hdhive.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      hdhive.com
// @downloadURL https://update.greasyfork.org/scripts/553217/HDHive%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553217/HDHive%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === 配置项 ===
  let token = GM_getValue("token", "");
  let csrfToken = GM_getValue("csrfToken", "");

  // 手动设置 Token
  GM_registerMenuCommand("📝 设置 Token", () => {
    const t = prompt("请输入 Bearer Token:", token || "");
    if (t) {
      GM_setValue("token", t.trim());
      alert("✅ Token 已保存");
    }
  });

  // 手动设置 CSRF Token
  GM_registerMenuCommand("🧩 设置 CSRF Token", () => {
    const c = prompt("请输入 x-csrf-token:", csrfToken || "");
    if (c) {
      GM_setValue("csrfToken", c.trim());
      alert("✅ CSRF Token 已保存");
    }
  });

  // 手动签到
  GM_registerMenuCommand("📅 立即签到", () => {
    checkIn();
  });

  // 每日自动签到
  const lastCheck = GM_getValue("lastCheck", 0);
  const today = new Date().toDateString();
  if (GM_getValue("lastCheckDate") !== today) {
    console.log("[HDHive] 自动执行签到...");
    checkIn();
  }

  function checkIn() {
    if (!token || !csrfToken) {
      alert("⚠️ 请先设置 Token 和 CSRF Token！");
      return;
    }

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://hdhive.com/api/customer/user/checkin",
      headers: {
        "accept": "application/json, text/plain, */*",
        "authorization": `Bearer ${token}`,
        "x-csrf-token": csrfToken,
        "origin": "https://hdhive.com",
        "referer": "https://hdhive.com/user/dashboard",
      },
      data: "",
      onload: (res) => {
        try {
          const result = JSON.parse(res.responseText);
          console.log("签到结果：", result);
          alert("✅ 签到成功！🎉");
          GM_setValue("lastCheckDate", today);
        } catch (e) {
          console.error("签到返回非 JSON：", res.responseText);
          alert("❌ 签到失败，请检查 Token 是否过期。");
        }
      },
      onerror: (err) => {
        console.error("请求错误：", err);
        alert("❌ 网络错误或未登录。");
      },
    });
  }
})();
