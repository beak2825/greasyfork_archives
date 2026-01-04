// ==UserScript==
// @name         RWFK: Send Related Keyword (Multicast)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Collect related searches, pick random, send to MULTIPLE APIs, show status
// @match        https://www.bing.com/search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548407/RWFK%3A%20Send%20Related%20Keyword%20%28Multicast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548407/RWFK%3A%20Send%20Related%20Keyword%20%28Multicast%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- DAFTAR URL TUJUAN ---
  // Tambahkan URL target kamu di sini.
  // Pastikan path-nya benar (misal /add_keywords)
  const apiEndpoints = [
    "https://bing-search.onrender.com/add_keywords",
    "https://search.xter.my.id/add_keywords",
    // "https://url-ketiga-kamu.com/add_keywords" // <-- Contoh jika mau nambah
  ];

  function createStatusBox() {
    let box = document.createElement("div");
    box.id = "relatedStatusBox";
    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.left = "20px"; // bottom-left
    box.style.padding = "10px 15px";
    box.style.background = "#f9f9f9";
    box.style.border = "1px solid #0078d7";
    box.style.borderRadius = "5px";
    box.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.fontSize = "14px";
    box.style.color = "#333";
    box.style.zIndex = "9999";
    box.innerHTML = "⏳ Waiting for related searches...";
    document.body.appendChild(box);
    return box;
  }

  function getAllRelated() {
    let selectors = [
      ".richrsrailsuggestion_text", // sidebar
      ".suggestion_text", // bottom block
      ".b_suggestionText", // inline block
    ];

    let results = [];
    selectors.forEach((sel) => {
      let nodes = document.querySelectorAll(sel);
      nodes.forEach((n) => {
        let text = n.innerText.trim();
        if (text && !results.includes(text)) {
          results.push(text);
        }
      });
    });

    return results;
  }

  async function sendRandomRelated() {
    let box = document.getElementById("relatedStatusBox") || createStatusBox();
    let related = getAllRelated();

    if (related.length === 0) {
      box.innerHTML = "⚠️ No related searches found.";
      return;
    }

    let randomKeyword = related[Math.floor(Math.random() * related.length)];
    box.innerHTML = `📤 Sending: <b>${randomKeyword}</b> ...`;

    let formData = new URLSearchParams();
    formData.append("keywords", randomKeyword);

    const postOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    };

    // Buat array berisi semua promise fetch
    const sendPromises = apiEndpoints.map(url => {
        return fetch(url, postOptions)
            .then(res => {
                if (!res.ok) {
                    // Jika server error (spt 404, 500), anggap sebagai error
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.json().catch(() => ({})); // Tangani jika respons bukan JSON
            });
    });

    // Kirim semua permintaan secara paralel dan tunggu hasilnya
    const results = await Promise.allSettled(sendPromises);

    let successful = 0;
    let failed = 0;
    const total = apiEndpoints.length;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful++;
        console.log(`✅ Sent successfully to ${apiEndpoints[index]}:`, result.value);
      } else {
        failed++;
        console.error(`❌ Error sending to ${apiEndpoints[index]}:`, result.reason.message);
      }
    });

    // Update status box dengan ringkasan
    if (failed > 0) {
      box.innerHTML = `⚠️ Sent to ${successful}/${total} servers: <b>${randomKeyword}</b>`;
    } else {
      box.innerHTML = `✅ Sent to ${successful}/${total} servers: <b>${randomKeyword}</b>`;
    }
  }

  window.addEventListener("load", () => {
    // wait a bit longer in case Bing loads results dynamically
    setTimeout(sendRandomRelated, 2500);
  });
})();