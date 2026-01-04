// ==UserScript==
// @name         Perchance Memory Trimmer Tool 1.0
// @namespace    https://perchance.org/
// @version      1.00.01
// @description  Manual memory trimmer + copy tool for Perchance AI Chat - Reports how many were pruned by long-entry trim and by "keep newest".
// @match        https://perchance.org/ai-character-chat*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553173/Perchance%20Memory%20Trimmer%20Tool%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/553173/Perchance%20Memory%20Trimmer%20Tool%2010.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Create floating button ===
  const mainBtn = document.createElement("button");
  mainBtn.textContent = "Trim Memories";
  Object.assign(mainBtn.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    zIndex: 9999,
    background: "white",
    color: "black",
    border: "1px solid gray",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 0 6px rgba(0,0,0,0.3)"
  });
  document.body.appendChild(mainBtn);

  // === Utility: split into entries (blank-line separated) ===
  function cleanMemories(text) {
    return text
      .split(/\n{2,}/)
      .map(m => m.trim())
      .filter(m => m.length > 0);
  }

  // === Manual popup ===
  function openTrimPopup() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0", left: "0", width: "100%", height: "100%",
      background: "rgba(0,0,0,0.4)",
      zIndex: 10000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "white",
      color: "black",
      width: "80%",
      maxWidth: "700px",
      padding: "1rem",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "80%",
    });

    box.innerHTML = `
      <h3 style="margin-bottom:8px;">Perchance Memory Trimmer</h3>
      <textarea id="memtools-textarea" placeholder="Paste your memory text here..." style="flex-grow:1; width:100%; height:300px; resize:vertical; font-family:monospace; font-size:13px; padding:5px; border:1px solid gray; border-radius:4px;"></textarea>
      <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <label style="font-size:13px;">
            <input type="checkbox" id="trimLongEntries"> Trim entries &gt;200 chars
          </label>
          <label style="font-size:13px; margin-left:10px;">
            Keep newest:
            <select id="trimCount">
              <option value="">Select...</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <div>
          <button id="runTrim" style="background:white;color:black;border:1px solid gray;border-radius:4px;padding:4px 10px;cursor:pointer;">Trim</button>
          <button id="copyTrimmed" style="background:white;color:black;border:1px solid gray;border-radius:4px;padding:4px 10px;cursor:pointer;">Copy</button>
          <button id="closePopup" style="background:white;color:black;border:1px solid gray;border-radius:4px;padding:4px 10px;cursor:pointer;">Close</button>
        </div>
      </div>
      <div id="resultArea" style="margin-top:10px; overflow-y:auto; max-height:58vh; font-family:monospace; font-size:13px; white-space:pre-wrap; border-top:1px solid #ccc; padding-top:8px;"></div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const ta = box.querySelector("#memtools-textarea");
    const closeBtn = box.querySelector("#closePopup");
    const trimBtn = box.querySelector("#runTrim");
    const copyBtn = box.querySelector("#copyTrimmed");
    const resDiv = box.querySelector("#resultArea");
    const trimLongCheckbox = box.querySelector("#trimLongEntries");
    const trimCountSelect = box.querySelector("#trimCount");

    let trimmedEntries = []; // final result array after trimming

    // Close handler
    closeBtn.onclick = () => overlay.remove();

    // Trim handler
    trimBtn.onclick = () => {
      const raw = (ta.value || "").trim();
      if (!raw) {
        resDiv.textContent = "⚠️ No text provided.";
        trimmedEntries = [];
        return;
      }

      // Step 0: parse entries
      const originalEntries = cleanMemories(raw);
      const originalCount = originalEntries.length;

      // Step 1: trim long entries if requested
      let afterLongTrim = originalEntries;
      let removedByLong = 0;
      if (trimLongCheckbox.checked) {
        afterLongTrim = originalEntries.filter(e => e.length <= 200);
        removedByLong = originalCount - afterLongTrim.length;
      }

      // Step 2: trim by keep-newest N if requested
      let afterKeepTrim = afterLongTrim;
      let removedByKeepN = 0;
      const keepN = parseInt(trimCountSelect.value, 10);
      if (keepN && afterLongTrim.length > keepN) {
        const keepSlice = afterLongTrim.slice(-keepN);
        removedByKeepN = afterLongTrim.length - keepSlice.length;
        afterKeepTrim = keepSlice;
      }

      // Final counts
      const finalCount = afterKeepTrim.length;
      const totalRemoved = originalCount - finalCount;

      trimmedEntries = afterKeepTrim;

      // Build summary and show at top (so the user sees it immediately)
      const summaryLines = [];
      summaryLines.push(`Trimmed ${totalRemoved} entries (from ${originalCount} → ${finalCount}).`);
      summaryLines.push(`• Removed by long-entry filter (>200 chars): ${removedByLong}`);
      summaryLines.push(`• Removed by "Keep newest" limit: ${removedByKeepN}`);
      summaryLines.push('---\n');

      const preview = trimmedEntries.join("\n\n");
      resDiv.textContent = summaryLines.join('\n') + '\n' + preview;
      resDiv.scrollTop = 0; // ensure summary is visible
    };

    // Copy handler
    copyBtn.onclick = () => {
      if (!trimmedEntries || trimmedEntries.length === 0) {
        resDiv.textContent = "⚠️ Nothing to copy. Run Trim first.";
        return;
      }
      const textToCopy = trimmedEntries.join("\n\n");
      navigator.clipboard.writeText(textToCopy).then(() => {
        resDiv.textContent = "✅ Trimmed text copied to clipboard!";
        resDiv.scrollTop = 0;
      }).catch(() => {
        resDiv.textContent = "⚠️ Copy failed; please select the preview and copy manually.";
        resDiv.scrollTop = 0;
      });
    };
  }

  // Wire launcher
  mainBtn.addEventListener('click', openTrimPopup);
})();
