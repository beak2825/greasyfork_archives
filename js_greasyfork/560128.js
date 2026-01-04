// ==UserScript==
// @name         Voyage History Extractor + Profit Snapshot
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Extract voyage history, calculate profit/NM, and snapshot key metrics for spreadsheet use
// @author       Stu
// @match        https://shippingmanager.cc/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560128/Voyage%20History%20Extractor%20%2B%20Profit%20Snapshot.user.js
// @updateURL https://update.greasyfork.org/scripts/560128/Voyage%20History%20Extractor%20%2B%20Profit%20Snapshot.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 📋 Extract voyage history and copy to clipboard
  function extractVoyageHistory() {
    const entries = document.querySelectorAll(".voyageHistory .voyageEntry");
    if (entries.length === 0) {
      alert("No voyage entries found. Select a ship and open Details and scroll down and show all history ( see more)");
      return;
    }

    const shipName = document.querySelector(".header-title")?.innerText?.trim() || "Unknown Ship";

    const parsed = [...entries].map(entry => {
      const time = entry.querySelector(".timeStamp")?.innerText?.trim() || "";
      const ports = [...entry.querySelectorAll(".routeData .capitalize")].map(el => el.innerText.trim());
      const route = ports.join(" - ");
      const profitMatch = entry.innerText.match(/\$[\d,]+/);
      const profit = profitMatch ? profitMatch[0] : "";

      return [time, route, profit];
    });

    const header = ["Time", "Route", "Profit"];
    const output = [`Ship: ${shipName}`, "", header.join("\t"), ...parsed.map(row => row.join("\t"))].join("\n");

    GM_setClipboard(output);
    alert(`Voyage history for "${shipName}" copied to clipboard!`);
  }

  // 💰 Calculate and copy profit per nautical mile
  function calculateAndCopyProfitPerNm() {
    const profitText = document.querySelector('.profit.text-dark-green p')?.textContent;
    const profit = parseFloat(profitText?.replace(/[^0-9.-]+/g, ''));

    const distanceText = [...document.querySelectorAll('.dataEntry')]
      .find(el => el.querySelector('p')?.innerText.trim() === 'Total distance')
      ?.querySelector('.content')?.innerText;
    const distance = parseFloat(distanceText?.replace(/[^0-9.-]+/g, ''));

    if (!isNaN(profit) && !isNaN(distance) && distance > 0) {
      const profitPerNm = profit / distance;
      const formatted = `Profit/NM: $${profitPerNm.toFixed(2)}`;
      navigator.clipboard.writeText(formatted);
      alert(`Copied: ${formatted}`);
    } else {
      alert('Could not parse profit or distance.');
    }
  }

  // 📸 Snapshot key metrics for spreadsheet row
  function snapshotToSpreadsheet() {
  if (!document.querySelector(".header-title")) return alert("No ship selected! Select a ship and open Details. This will copy Name, route, profit, distance and calc the profit per nm of the last trip");


      const ship = document.querySelector(".header-title")?.innerText?.trim() || "Unknown Ship";

  const route = [...document.querySelectorAll(".routeData .capitalize")]
    .map(el => el.innerText.trim())
    .join(" - ");

  const profitText = document.querySelector('.profit.text-dark-green p')?.textContent;
  const profit = parseFloat(profitText?.replace(/[^0-9.-]+/g, ''));

  const distanceText = [...document.querySelectorAll('span.text-left')]
    .map(el => el.innerText.trim())
    .find(text => text.endsWith('nm'));
  const distance = parseFloat(distanceText?.replace(/[^0-9.-]+/g, ''));

  const profitPerNm = !isNaN(profit) && !isNaN(distance) && distance > 0
    ? (profit / distance).toFixed(2)
    : "N/A";

  const cleanProfit = isNaN(profit) ? "N/A" : profit;
  const cleanDistance = isNaN(distance) ? "N/A" : distance;

  const row = [ship, route, cleanProfit, cleanDistance, profitPerNm].join("\t");
  GM_setClipboard(row);
  alert("Snapshot copied to clipboard!");
}


  // 🧩 Inject floating buttons
  function addButton() {
    if (document.getElementById("extractVoyageBtn")) return;

    // 📋 Voyage History Button
    const voyageBtn = document.createElement("button");
    voyageBtn.id = "extractVoyageBtn";
    voyageBtn.textContent = "📋 Copy Voyage History";
    Object.assign(voyageBtn.style, {
      position: "fixed",
      top: "1px",
      right: "80px",
      zIndex: "9999",
      padding: "8px 12px",
      background: "#0077cc",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    });
    voyageBtn.onclick = extractVoyageHistory;
    document.body.appendChild(voyageBtn);

    

    // 📸 Snapshot Row Button
    const snapshotBtn = document.createElement("button");
    snapshotBtn.textContent = "📸 Snapshot Row";
    snapshotBtn.id = "snapshot-btn";
    Object.assign(snapshotBtn.style, {
      position: "fixed",
      top: "30px",
      right: "80px",
      zIndex: "9999",
      padding: "8px 12px",
      backgroundColor: "#0077cc",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    });
    snapshotBtn.onclick = snapshotToSpreadsheet;
    document.body.appendChild(snapshotBtn);
  }

  // 🚀 Initialize on page load
  window.addEventListener("load", addButton);
})();
