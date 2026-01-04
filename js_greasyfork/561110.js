// ==UserScript==
// @name         TangThuVien Auto Crawl TXT (Reload-Safe, 10-Chapter Checkpoint)
// @namespace    https://greasyfork.org/
// @version      3.4
// @description  Non-SPA auto crawl, reload không ngắt, mỗi 10 chương tải FULL file
// @match        *://truyen.tangthuvien.vn/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561110/TangThuVien%20Auto%20Crawl%20TXT%20%28Reload-Safe%2C%2010-Chapter%20Checkpoint%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561110/TangThuVien%20Auto%20Crawl%20TXT%20%28Reload-Safe%2C%2010-Chapter%20Checkpoint%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**************** CONFIG ****************/
  const DELAY = 1500;
  const SAVE_EVERY = 10;

  /**************** STATE (GM) ****************/
  const KEY_RUNNING = "ttv_running";
  const KEY_TEXT    = "ttv_text";
  const KEY_COUNT   = "ttv_count";

  /**************** UTILS ****************/
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const log = (...a) =>
    console.log("%c[TTVCrawl]", "color:#d9534f;font-weight:bold", ...a);

  /**************** DOM ****************/
  const getTitle = () => document.querySelector(".chapter h2");
  const getContent = () =>
    document.querySelector(".chapter-c-content .box-chap");
  const getNextBtn = () =>
    document.querySelector("a.bot-next_chap") ||
    [...document.querySelectorAll("a")].find(a =>
      a.getAttribute("onclick")?.includes("NextChap")
    );

  /**************** DOWNLOAD ****************/
  function downloadCheckpoint(count, text) {
    const name = `1-${count}.txt`;
    log(`⬇️ Tải ${name}`);

    GM_download({
      url: URL.createObjectURL(
        new Blob([text], { type: "text/plain;charset=utf-8" })
      ),
      name,
    });
  }

  /**************** CORE ****************/
  async function crawl() {
    if (GM_getValue(KEY_RUNNING) !== true) return;

    const title = getTitle();
    const content = getContent();

    if (!title || !content || !content.innerText.trim()) {
      setTimeout(crawl, 800);
      return;
    }

    let count = GM_getValue(KEY_COUNT, 0) + 1;
    let text  = GM_getValue(KEY_TEXT, "");

    log(`📖 Chương ${count}: ${title.innerText.trim()}`);

    text +=
      title.innerText.trim() +
      "\n\n" +
      content.innerText.trim() +
      "\n\n\n";

    GM_setValue(KEY_COUNT, count);
    GM_setValue(KEY_TEXT, text);

    if (count % SAVE_EVERY === 0) {
      downloadCheckpoint(count, text);
    }

    const next = getNextBtn();
    if (!next) {
      log("🏁 Hết chương");

      if (count % SAVE_EVERY !== 0) {
        downloadCheckpoint(count, text);
      }

      GM_deleteValue(KEY_RUNNING);
      return;
    }

    await sleep(DELAY);
    next.click(); // reload → script tự chạy lại
  }

  /**************** BUTTON ****************/
  function injectButton() {
    if (document.getElementById("ttv-crawl-btn")) return;

    const box = document.querySelector(".chapter");
    if (!box) return;

    const btn = document.createElement("button");
    btn.id = "ttv-crawl-btn";
    btn.textContent = "▶ AUTO CRAWL TXT";
    btn.style.cssText = `
      margin:10px auto;
      display:block;
      padding:6px 14px;
      border-radius:6px;
      border:none;
      background:#d9534f;
      color:#fff;
      cursor:pointer;
    `;

    btn.onclick = () => {
      if (GM_getValue(KEY_RUNNING) === true) return;

      const ok = confirm(
        "Bắt đầu crawl từ chương hiện tại?\n\n" +
        "- Reload KHÔNG ngắt\n" +
        "- Mỗi 10 chương tải FULL file\n" +
        "- Không cần xoá state khi lỗi"
      );
      if (!ok) return;

      GM_setValue(KEY_RUNNING, true);
      GM_setValue(KEY_TEXT, "");
      GM_setValue(KEY_COUNT, 0);

      crawl();
    };

    box.prepend(btn);
  }

  /**************** AUTO CONTINUE ****************/
  if (GM_getValue(KEY_RUNNING) === true) {
    crawl();
  }

  injectButton();
})();
