// ==UserScript==
// @name         FASIH SQLLab - Upload ke Jejama BPS1800
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Tambahkan tombol Upload CSV ke API Jejama agar tetap muncul setelah klik Run Query di SQLLab Superset
// @author       ipin
// @match        https://fasih-dashboard.bps.go.id/*
// @grant        GM_xmlhttpRequest
// @connect      sosial1800.statapps.dev
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556832/FASIH%20SQLLab%20-%20Upload%20ke%20Jejama%20BPS1800.user.js
// @updateURL https://update.greasyfork.org/scripts/556832/FASIH%20SQLLab%20-%20Upload%20ke%20Jejama%20BPS1800.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ENDPOINT = "https://sosial1800.statapps.dev/evaluasi_sakernas_november_2025/api/post.php";
//  const ENDPOINT = "http://172.16.0.28:8082/evaluasi_sakernas_november_2025/tes2.php";

  // Fungsi tombol upload
  function createUploadButton() {
    const uploadBtn = document.createElement("button");
//    uploadBtn.textContent = "</i><span> Upload ke Jejama BPS1800</span>";
    uploadBtn.innerHTML = '<i class="fa fa-upload"></i><span> Upload ke Jejama BPS1800</span>';
    uploadBtn.className = "ant-btn superset-button css-18echj3";
    uploadBtn.style.marginLeft = "10px";
//    uploadBtn.style.backgroundColor = "#1976d2";
//    uploadBtn.style.color = "white";
    uploadBtn.style.borderRadius = "6px";
    uploadBtn.onclick = async () => {
      try {
        const csvLink = document.querySelector('a[href*="/api/v1/sqllab/export/"]');
        if (!csvLink) {
          alert(" Tidak menemukan tombol Download CSV. Jalankan query dulu.");
          return;
        }

        const csvUrl = csvLink.href;
        const csvResp = await fetch(csvUrl);
        if (!csvResp.ok) throw new Error("Gagal mengambil CSV");
        const csvText = await csvResp.text();

        uploadBtn.disabled = true;
        uploadBtn.style.opacity = '0.6';
        uploadBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i><span> Mengunggah...</span>';

        GM_xmlhttpRequest({
          method: "POST",
          url: ENDPOINT,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({ csv: csvText }),
          timeout: 15000,
          onload: res => {
            alert(" Upload sukses:\n" + res.responseText);
            uploadBtn.disabled = false;
            uploadBtn.style.opacity = '1';
            uploadBtn.innerHTML = '<i class="fa fa-upload"></i><span> Upload ke Jejama BPS1800/span>';
          },
          onerror: err => {
            alert(" Gagal upload ke API:\n" + JSON.stringify(err, null, 2));
            uploadBtn.disabled = false;
            uploadBtn.style.opacity = '1';
            uploadBtn.innerHTML = '<i class="fa fa-upload"></i><span> Upload ke Jejama BPS1800/span>';
          },
          ontimeout: () => {
            alert(" Timeout: server tidak merespon.");
            uploadBtn.disabled = false;
            uploadBtn.style.opacity = '1';
            uploadBtn.innerHTML = '<i class="fa fa-upload"></i><span> Upload ke Jejama BPS1800/span>';
          }
        });
      } catch (e) {
        alert(" Error:\n" + e.message);
      } finally {
        //uploadBtn.disabled = false;
        //uploadBtn.style.opacity = '1';
        //uploadBtn.innerHTML = '<i class="fa fa-upload"></i><span> Upload ke Jejama BPS1800</span>';
      }
    };
    return uploadBtn;
  }

  // menyisipkan tombol
  function injectButton() {
    const toolbar = document.querySelector('a[href*="/api/v1/sqllab/export/"]')?.parentElement;
    if (!toolbar) return;
    if (toolbar.querySelector(".upload-jejama-btn")) return; // sudah ada

    const btn = createUploadButton();
    btn.classList.add("upload-jejama-btn");
    toolbar.appendChild(btn);
    console.log(" Tombol Upload Jejama ditambahkan.");
  }

  const observer = new MutationObserver(() => {
    injectButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", () => {
    setTimeout(injectButton, 2000);
  });
})();
