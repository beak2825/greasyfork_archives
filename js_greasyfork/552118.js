// ==UserScript==
// @name         下载链接信息查询助手
// @namespace    https://whatslink.info/
// @version      1.0
// @description  检测页面中的 DDL/Torrent/Ed2k 链接并查询其信息显示在弹窗中
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552118/%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552118/%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1. 添加样式
  GM_addStyle(`
    .wl-btn {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 6px;
      font-size: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    .wl-btn:hover {
      background: #0056b3;
    }
    .wl-dialog {
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 16px;
      width: 50vw;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .wl-dialog h3 {
      margin-top: 0;
      font-size: 16px;
    }
    .wl-dialog img {
      max-width: 100%;
      margin-top: 8px;
      border-radius: 4px;
    }
    .wl-close {
      float: right;
      cursor: pointer;
      color: #888;
    }
    .wl-close:hover {
      color: #000;
    }
  `);

  // 2. 匹配常见下载协议
  const downloadLinkRegex = /(magnet:\?|ed2k:\/\/|\.torrent($|\?)|ddl:\/\/)/i;

  // 3. 扫描所有链接
  const links = Array.from(document.querySelectorAll("a[href],input")).filter((a) =>
    downloadLinkRegex.test(a.href)
  );

  if (!links.length) return;

  links.forEach((link) => {
    const btn = document.createElement("button");
    btn.textContent = "🔍 查看信息";
    btn.className = "wl-btn";
    btn.addEventListener("click", () => showLinkInfo(link.href));
    link.insertAdjacentElement("afterend", btn);
  });

  // 4. 显示信息弹窗
  async function showLinkInfo(url) {
    const dialog = document.createElement("div");
    dialog.id = "mypopover";
    dialog.popover = "auto";
    dialog.className = "wl-dialog";
    dialog.innerHTML = `<span class="wl-close">✖</span><h3>链接信息加载中...</h3>`;
    const closeBtn = `<button popovertarget="mypopover" class="wl-close">✖</button>`
    document.body.appendChild(dialog);
    dialog.showPopover();
    try {
      const api = `https://whatslink.info/api/v1/link?url=${encodeURIComponent(url)}`;
      const res = await fetch(api);
      const data = await res.json();

      let html = `
        ${closeBtn}
        <h3>🔗 链接信息</h3>
        <p><b>类型:</b> ${data.type || "未知"}</p>
        <p><b>文件类型:</b> ${data.file_type || "未知"}</p>
        <p><b>名称:</b> ${data.name || "未提供"}</p>
        <p><b>大小:</b> ${data.size ? formatSize(data.size) : "未知"}</p>
        <p><b>文件数量:</b> ${data.count ?? "未知"}</p>
      `;

      if (Array.isArray(data.screenshots) && data.screenshots.length > 0) {
        html += `<h4>截图:</h4>`;
        data.screenshots.forEach((sc) => {
          html += `<div><img src="${sc.screenshot}" alt="screenshot: ${sc.screenshot}"></div>`;
        });
      }

      dialog.innerHTML = html;
    } catch (err) {
      dialog.innerHTML = `
        ${closeBtn}
        <h3>❌ 查询失败</h3>
        <p>${err.message}</p>
      `;
    }
  }

  // 5. 辅助函数：格式化文件大小
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    const units = ["KB", "MB", "GB", "TB"];
    let i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes >= 1024 && i < units.length - 1);
    return bytes.toFixed(1) + " " + units[i];
  }
})();