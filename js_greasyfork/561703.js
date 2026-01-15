// ==UserScript==
// @name         快樂工具人: 正式區防呆小幫手
// @name:en      Prod Guard (by Haoming)
// @namespace    happy-toolman-guard
// @version      2026-01-14.001
// @description  在畫面醒目的顯示目前的工作區，在正式區執行刪除操作時會多做一次確認，支援自訂網域與匯入匯出設定
// @description:en Prominently displays the current workspace and requires extra confirmation for delete operations in production. Supports custom domains and settings import/export.
// @author       快樂工具人 (Haoming Lu)
// @icon         https://raw.githubusercontent.com/luhaoming/userscripts/main/assets/logo.png
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @homepage     https://github.com/luhaoming/userscripts/tree/main/prod-guard
// @supportURL   https://github.com/luhaoming/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/561703/%E5%BF%AB%E6%A8%82%E5%B7%A5%E5%85%B7%E4%BA%BA%3A%20%E6%AD%A3%E5%BC%8F%E5%8D%80%E9%98%B2%E5%91%86%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561703/%E5%BF%AB%E6%A8%82%E5%B7%A5%E5%85%B7%E4%BA%BA%3A%20%E6%AD%A3%E5%BC%8F%E5%8D%80%E9%98%B2%E5%91%86%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- 1. Trusted Types Policy (解決新版瀏覽器安全報錯) ---
  let trustedPolicy = null;
  if (typeof trustedTypes !== 'undefined' && trustedTypes.createPolicy) {
    try {
      trustedPolicy = trustedTypes.createPolicy('prodGuard', {
        createHTML: s => s,
        createScriptURL: s => s,
        createScript: s => s
      });
    } catch (e) {
      // Policy 可能已存在，忽略
    }
  }

  // --- 2. 設定與變數 ---
  const keys = ["roots", "stg", "dev"];
  const config = {
    roots: GM_getValue("roots", "*.example.com"),
    stg: GM_getValue("stg", "stg.example.com"),
    dev: GM_getValue("dev", "localhost, 127.0.0.1"),
    btns: ["btn_delete", "deleteBtn", "btn-danger"]
  };

  // --- 3. 選單功能 (保持原本邏輯) ---
  const reg = (label, key) => {
    GM_registerMenuCommand(`🔧 設定 ${label}`, () => {
      const val = prompt(`輸入 ${label} (逗號分隔):`, GM_getValue(key, config[key]));
      if (val !== null) GM_setValue(key, val);
      // 提示使用者重新整理以套用
      if(confirm("設定已儲存！是否立即重新整理頁面以套用？")) {
        location.reload();
      }
    });
  };

  reg("根網域 (*.aa.bb)", "roots");
  reg("STG 網域", "stg");
  reg("DEV 網域", "dev");

  GM_registerMenuCommand("📤 匯出設定 (複製)", () => {
    const data = {};
    keys.forEach(k => data[k] = GM_getValue(k, config[k]));
    GM_setClipboard(JSON.stringify(data));
    alert("設定已複製到剪貼簿！");
  });

  GM_registerMenuCommand("📥 匯入設定", () => {
    const json = prompt("請貼上設定 JSON:");
    if (!json) return;
    try {
      const data = JSON.parse(json);
      keys.forEach(k => { if (data[k]) GM_setValue(k, data[k]); });
      alert("匯入成功！正在重新整理頁面...");
      location.reload();
    } catch (e) {
      alert("匯入失敗：格式不正確。");
    }
  });

  GM_registerMenuCommand("🔍 查看目前設定", () => {
    alert(`【設定快報】\n\n● 根網域: ${GM_getValue("roots", config.roots)}\n● STG: ${GM_getValue("stg", config.stg)}\n● DEV: ${GM_getValue("dev", config.dev)}`);
  });

  // --- 4. 環境偵測邏輯 ---
  const host = location.hostname;
  const isMatch = (pattern, target) => {
    // 優化 Regex 處理，避免特殊字元錯誤
    try {
        const regex = new RegExp('^' + pattern.trim().replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
        return regex.test(target);
    } catch (e) { return false; }
  };

  const inScope = config.roots.split(',').some(root => isMatch(root, host));
  if (!inScope) return; // 不在根網域範圍內，直接退出

  let env = "prod"; 
  const check = (list, type) => {
    const hit = list.split(',').some(s => host.includes(s.trim()));
    if (hit) env = type;
  };
  check(config.stg, "stg");
  check(config.dev, "dev");

  // --- 5. 顯示 Banner ---
  const themes = {
    prod: { txt: "PROD 正式區", bg: "#d9534f" },
    stg:  { txt: "STG 測試區", bg: "#f0ad4e" },
    dev:  { txt: "DEV 開發區", bg: "#5bc0de" }
  };
  const theme = themes[env];

  const banner = document.createElement("div");
  // 使用 trustedPolicy (如果有的話)
  const htmlContent = `<img src="https://raw.githubusercontent.com/luhaoming/userscripts/main/assets/logo.png" style="width:20px;vertical-align:middle;margin-right:5px;">${theme.txt}`;
  banner.innerHTML = trustedPolicy ? trustedPolicy.createHTML(htmlContent) : htmlContent;
  
  banner.style.cssText = `position:fixed;bottom:10px;left:10px;z-index:999999;padding:8px 12px;font-size:16px;font-weight:bold;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.5);color:#FFF;cursor:pointer;background:${theme.bg};display:flex;align-items:center;font-family:sans-serif;`;
  
  // 點擊 Banner 可以隱藏，或者你想要改成打開設定選單？目前先維持隱藏
  banner.onclick = () => banner.style.display = "none";
  banner.title = "點擊隱藏標籤";
  document.body.appendChild(banner);

  // 如果不是 Prod，任務結束 (只顯示 Banner，不攔截)
  if (env !== "prod") return;

  // --- 6. 攔截危險操作 (Prod Only) ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(config.btns.map(c => "." + c).join(","));
    if (!btn) return;

    const name = btn.getAttribute("data-name") || btn.innerText.trim() || "未知項目";
    const id = btn.getAttribute("data-id") ? ` (ID: ${btn.getAttribute("data-id")})` : "";
    
    // 使用 setTimeout 讓 prompt 不會卡住原本的事件流 (雖然這裡是阻擋，但有時候瀏覽器會有順序問題)
    // 這裡維持原本邏輯，確保阻擋
    const input = prompt(`【⚠️ 正式區操作確認】\n\n欲刪除：「${name}${id}」\n\n請輸入 DELETE 確認:`);
    
    if (input === "DELETE") return; // 放行

    // 攔截
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
    alert("❌ 已攔截危險操作！");
  }, true); // Use capture phase
})();