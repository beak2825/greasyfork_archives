// ==UserScript==
// @name         快樂工具人: 正式區防呆小幫手
// @name:en      Prod Guard (by Haoming)
// @namespace    http://tampermonkey.net/
// @version      2026-01-07.002
// @description  在畫面醒目的顯示目前的工作區，在正式區執行刪除操作時會多做一次確認，支援自訂網域與匯入匯出設定
// @description:en Prominently displays the current workspace and requires extra confirmation for delete operations in production. Supports custom domains and settings import/export.
// @author       Haoming (快樂工具人)
// @icon         https://raw.githubusercontent.com/luhaoming/userscripts/main/assets/logo.png
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/561703/%E5%BF%AB%E6%A8%82%E5%B7%A5%E5%85%B7%E4%BA%BA%3A%20%E6%AD%A3%E5%BC%8F%E5%8D%80%E9%98%B2%E5%91%86%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561703/%E5%BF%AB%E6%A8%82%E5%B7%A5%E5%85%B7%E4%BA%BA%3A%20%E6%AD%A3%E5%BC%8F%E5%8D%80%E9%98%B2%E5%91%86%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const keys = ["roots", "stg", "dev"];
  const config = {
    roots: GM_getValue("roots", "*.example.com"),
    stg: GM_getValue("stg", "stg.example.com"),
    dev: GM_getValue("dev", "localhost, 127.0.0.1"),
    btns: ["btn_delete", "deleteBtn", "btn-danger"]
  };

  const reg = (label, key) => {
    GM_registerMenuCommand(`🔧 設定 ${label}`, () => {
      const val = prompt(`輸入 ${label} (逗號分隔):`, GM_getValue(key, config[key]));
      if (val !== null) GM_setValue(key, val);
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
      alert("匯入成功！請重新整理頁面。");
    } catch (e) {
      alert("匯入失敗：格式不正確。");
    }
  });

  GM_registerMenuCommand("🔍 查看目前設定", () => {
    alert(`【設定快報】\n\n● 根網域: ${GM_getValue("roots", config.roots)}\n● STG: ${GM_getValue("stg", config.stg)}\n● DEV: ${GM_getValue("dev", config.dev)}`);
  });

  const host = location.hostname;
  const isMatch = (pattern, target) => {
    const regex = new RegExp('^' + pattern.trim().replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
    return regex.test(target);
  };

  const inScope = config.roots.split(',').some(root => isMatch(root, host));
  if (!inScope) return;

  let env = "prod"; 
  const check = (list, type) => {
    const hit = list.split(',').some(s => host.includes(s.trim()));
    if (hit) env = type;
  };
  check(config.stg, "stg");
  check(config.dev, "dev");

  const themes = {
    prod: { txt: "PROD 正式區", bg: "#d9534f" },
    stg:  { txt: "STG 測試區", bg: "#f0ad4e" },
    dev:  { txt: "DEV 開發區", bg: "#5bc0de" }
  };
  const theme = themes[env];

  const banner = document.createElement("div");
  banner.innerHTML = `<img src="https://raw.githubusercontent.com/luhaoming/userscripts/main/assets/logo.png" style="width:20px;vertical-align:middle;margin-right:5px;">${theme.txt}`;
  banner.style.cssText = `position:fixed;bottom:10px;left:10px;z-index:999999;padding:8px 12px;font-size:16px;font-weight:bold;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.5);color:#FFF;cursor:pointer;background:${theme.bg};display:flex;align-items:center;`;
  banner.onclick = () => banner.style.display = "none";
  document.body.appendChild(banner);

  if (env !== "prod") return;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(config.btns.map(c => "." + c).join(","));
    if (!btn) return;

    const name = btn.getAttribute("data-name") || btn.innerText.trim() || "未知項目";
    const id = btn.getAttribute("data-id") ? ` (ID: ${btn.getAttribute("data-id")})` : "";
    
    if (prompt(`【⚠️ 正式區操作確認】\n\n欲刪除：「${name}${id}」\n\n請輸入 DELETE 確認:`) === "DELETE") return;

    e.stopImmediatePropagation();
    e.preventDefault();
    alert("❌ 已攔截危險操作！");
  }, true);
})();
