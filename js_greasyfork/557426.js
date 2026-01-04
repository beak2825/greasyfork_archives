// ==UserScript==
// @name         Kmoe 批量下载
// @namespace    http://tampermonkey.net/
// @version      2025-11-29
// @description  帮你在 Kmoe 站点上快速批量下载漫画章节，省去手动点击的麻烦。
// @author       Keaton
// @match        https://kzz.moe/*
// @match        https://kxx.moe/*
// @match        https://koz.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kzz.moe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557426/Kmoe%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557426/Kmoe%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const createBatchDownloadBtn = function (checkbox) {
    console.log("createBatchDownloadBtn：", checkbox);
    const batchBtn = document.createElement("button");
    batchBtn.id = "batchDownloadBtn";
    batchBtn.textContent = "批量下载";
    // 添加点击事件
    batchBtn.addEventListener("click", async function () {
      const checkboxes = Array.from(
        document.querySelectorAll('input[type="checkbox"][name="checkbox_vol"]')
      ).filter((e) => e.checked);
      console.log("批量下载按钮被点击,", checkboxes);
      const selectInfos = checkboxes
        .map((e) => {
          return {
            info: e.parentElement.previousElementSibling.textContent,
            url: e.parentElement.querySelector("a"),
          };
        })
        .filter((e) => !!e.url);
      if (selectInfos.length == 0) {
        return;
      }

      const confirm = await showListConfirm(
        "确认下载？",
        selectInfos.map((e) => e.info)
      );
      console.log("确认结果", confirm);
      if (!confirm) {
        return;
      }
      doBatchDown(
        selectInfos.map((e) => e.url),
        2000
      );
    });
    // 将按钮添加到复选框旁边
    checkbox.parentNode.insertBefore(batchBtn, checkbox.nextSibling);
  };

  const observer = new MutationObserver(() => {
    const batchBtn = document.getElementById("batchDownloadBtn");
    if (batchBtn) {
      return;
    }
    const checkbox = document.getElementById("checkbox_all_1001");
    if (checkbox) {
      createBatchDownloadBtn(checkbox);
    }
  });

  // 从 document 开始监听后代节点变动
  observer.observe(document, { childList: true, subtree: true });

  /**
   * 显示只读列表确认框
   * @param {string} title - 标题
   * @param {string[]} items - 要显示的列表项
   * @returns {Promise<boolean>} - true: 确认, false: 取消
   */
  function showListConfirm(title, items) {
    return new Promise((resolve) => {
      if (document.getElementById("simple-list-confirm")) return;

      const overlay = document.createElement("div");
      overlay.id = "simple-list-confirm";
      Object.assign(overlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "2147483647",
      });

      const modal = document.createElement("div");
      Object.assign(modal.style, {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        fontFamily: "system-ui, sans-serif",
        fontSize: "14px",
      });

      // 标题
      const h3 = document.createElement("h3");
      h3.textContent = title;
      h3.style.marginTop = "0";

      // 列表（用 <ul> 或 <div> 都行）
      const ul = document.createElement("ul");
      ul.style.paddingLeft = "20px";
      ul.style.maxHeight = "50vh";
      ul.style.overflowY = "auto";
      ul.style.margin = "10px 0";
      //   ul.style.paddingLeft = "0";
      ul.style.textAlign = "left";

      items.forEach((item) => {
        const li = document.createElement("li");
        li.innerText = item;
        li.style.marginBottom = "4px";
        ul.appendChild(li);
      });

      // 按钮区
      const btns = document.createElement("div");
      btns.style.textAlign = "right";
      btns.style.marginTop = "16px";

      const cancel = createBtn(
        "取消",
        () => {
          cleanup();
          resolve(false);
        },
        { marginRight: "8px" }
      );

      const ok = createBtn(
        "确认",
        () => {
          cleanup();
          resolve(true);
        },
        { backgroundColor: "#007bff", color: "white", border: "none" }
      );

      btns.append(cancel, ok);

      modal.append(h3, ul, btns);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // 点击遮罩关闭（视为取消）
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          cleanup();
          resolve(false);
        }
      });

      function cleanup() {
        overlay.remove();
      }

      function createBtn(text, onClick, style = {}) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = onClick;
        Object.assign(btn.style, {
          padding: "5px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          border: "1px solid #ccc",
          ...style,
        });
        return btn;
      }
    });
  }

  function doBatchDown(items, interval = 2000) {
    if (!Array.isArray(items) || items.length === 0) return;

    let index = 0;

    const triggerNext = () => {
      if (index < items.length) {
        const link = items[index];
        if (link && typeof link.click === "function") {
          // 可选：打印正在点击的链接（调试用）
          console.log("点击:", new Date().toLocaleString(), link.textContent);
          link.click(); // 触发点击
        }
        index++;
        setTimeout(triggerNext, interval);
      }
    };

    triggerNext();
  }
})();
