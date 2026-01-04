// ==UserScript==
// @name        WTR-Lab Chapter Downloader (EPUB) and Unlimited Replace Terms 
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/*
// @grant       none
// @version     2.1
// @author      -
// @description No longer need 2 scripts, same as the other script, so you only need to download 1
// @downloadURL https://update.greasyfork.org/scripts/552952/WTR-Lab%20Chapter%20Downloader%20%28EPUB%29%20and%20Unlimited%20Replace%20Terms.user.js
// @updateURL https://update.greasyfork.org/scripts/552952/WTR-Lab%20Chapter%20Downloader%20%28EPUB%29%20and%20Unlimited%20Replace%20Terms.meta.js
// ==/UserScript==

(async function WTRDownloader() {
    "use strict";

  // --- 0. Replacement logic ---
  const STORAGE_KEY = 'wordReplacerPairsV3';
  const data = (() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  })();

  function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\",]/g, '\\$&'); }

  function isStartOfSentenceV(index, fullText) {
    if (index === 0) return true;
    const before = fullText.slice(0, index).replace(/\s+$/, '');
    if (/[\n\r]$/.test(before)) return true;
    if (/[.!?…]["”’')\]]*$/.test(before)) return true;
    if (/["“”'‘(\[]\s*$/.test(before)) return true;
    if (/Chapter\s+\d+:\s*,?\s*$/.test(before)) return true;
    return false;
  }

  function isInsideDialogueAtIndexV(htmlText, index) {
    const quoteChars = `"'“”‘’`;
    const clean = htmlText.replace(/<[^>]*>/g, '');
    const leftText = clean.slice(0, index);
    const quoteCount = (leftText.match(new RegExp(`[${quoteChars}]`, 'g')) || []).length;
    return quoteCount % 2 === 1;
  }

  function applyPreserveCapitalV(orig, replacement) {
    if (!orig) return replacement;
    return (orig[0].toUpperCase() === orig[0]) ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
  }

  function applyReplacementsV(text, replacements) {
    let replacedText = text;
    const WILDCARD = '@';
    const punctuationRegex = /^[\W_'"“”‘’„,;:!?~()\[\]{}<>【】「」『』（）《》〈〉—–-]|[\W_'"“”‘’„,;:!?~()\[\]{}<>【】「」『』（）《》〈〉—–-]$/;

    for (const entry of replacements) {
      if (!entry.from || !entry.to || !entry.enabled) continue;
      const flags = entry.ignoreCapital ? 'gi' : 'g';
      let base = escapeRegex(entry.from).replace(new RegExp(`\\${WILDCARD}`, 'g'), '.');
      const firstChar = entry.from.charAt(0);
      const lastChar = entry.from.charAt(entry.from.length - 1);
      const skipBoundaries = punctuationRegex.test(firstChar) || punctuationRegex.test(lastChar);
      const patternStr = (entry.allInstances || skipBoundaries) ? base : `(?<=^|[^A-Za-z0-9])${base}(?=[^A-Za-z0-9]|$)`;
      const regex = new RegExp(patternStr, flags);

      let newText = '';
      let lastIndex = 0, match;
      while ((match = regex.exec(replacedText)) !== null) {
        const idx = match.index;
        const insideDialogue = isInsideDialogueAtIndexV(replacedText, idx);
        if ((entry.insideDialogueOnly && !insideDialogue) || (entry.outsideDialogueOnly && insideDialogue)) continue;

        newText += replacedText.slice(lastIndex, idx);
        const startSentence = entry.startOfSentence && isStartOfSentenceV(idx, replacedText);
        let finalReplacement = entry.preserveFirstCapital ? applyPreserveCapitalV(match[0], entry.to) : entry.to;
        if (startSentence) finalReplacement = finalReplacement.charAt(0).toUpperCase() + finalReplacement.slice(1);

        newText += finalReplacement;
        lastIndex = idx + match[0].length;
      }
      if (lastIndex < replacedText.length) newText += replacedText.slice(lastIndex);
      replacedText = newText;
    }
    return replacedText;
  }

  function applyReplacementsVToText(text, seriesIdParam = null) {
    const seriesId = seriesIdParam || (() => {
      const urlMatch = location.href.match(/\/novel\/(\d+)\//i);
      if (urlMatch) return urlMatch[1];
      const crumb = document.querySelector('.breadcrumb li.breadcrumb-item a[href*="/novel/"]');
      if (crumb) { const crumbMatch = crumb.href.match(/\/novel\/(\d+)\//i); if (crumbMatch) return crumbMatch[1]; }
      return null;
    })();

    let replacements = [];
    for (const key in data) {
      if (key === 'global' || (seriesId && key === `series-${seriesId}`) || (seriesIdParam && key === `series-${seriesIdParam}`)) {
        replacements = replacements.concat(data[key].filter(e => e.enabled));
      }
    }
    return replacements.length ? applyReplacementsV(text, replacements) : text;
  }

  // --- 1. Chapter info ---
  const dom = document;
  const leaves = dom.baseURI.split("/");
  const novelIndex = leaves.indexOf("novel");
  const language = leaves[novelIndex - 1];
  const id = leaves[novelIndex + 1];
  const novelLink = document.querySelector('a[href*="/novel/"]');
  const novelTitle = novelLink ? novelLink.textContent.trim().replace(/[\/\\?%*:|"<>]/g, '-') : leaves[leaves.length - 1].split("?")[0];

  const chaptersResp = await fetch(`https://wtr-lab.com/api/chapters/${id}`, { credentials: "include" });
  const chaptersJson = await chaptersResp.json();
  const chapters = chaptersJson.chapters;

// --- 2. Menu ---
const menu = document.createElement("div");
menu.style.cssText = `
  position: fixed; top: 60px; right: 20px; background: #fff; border-radius: 12px;
  padding: 0; max-height: 80vh; overflow-y: auto; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: none; width: 350px;
`;

// --- fixed top bar inside menu ---
menu.innerHTML = `
  <div id="menuHeader" style="
    position: sticky; top: 0; background: #fff; z-index: 10;
    padding: 10px; border-bottom: 1px solid #ddd;
  ">
    <h3 style="margin: 0 0 6px 0;">Select chapters</h3>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
      <label style="flex:1;"><input type="checkbox" id="selectAllChk" checked> All</label>
      <button id="selectFromCurrentBtn">From Current Chapter Onwards</button>
      <button id="jumpToCurrentBtn">Jump to Current Chapter</button>
      <button id="downloadEpubBtn" style="flex-shrink:0;">Download</button>
    </div>
  </div>
  <div id="chaptersList" style="padding:10px;">
    ${chapters.map(ch => `
      <label style="display:block; border-bottom:1px solid #eee; padding:4px 0;">
        <input type="checkbox" checked data-order="${ch.order}">
        ${ch.order}: ${ch.title}
      </label>
    `).join("")}
  </div>
`;
document.body.appendChild(menu);
// --- menu bar "Continue" button for most recent novel ---
const menuContinueBtn = document.createElement("button");
menuContinueBtn.textContent = "Continue From Latest";
menuContinueBtn.style.flexShrink = "0";
document.querySelector("#menuHeader > div").appendChild(menuContinueBtn);

menuContinueBtn.onclick = () => {
  const library = loadLibrary();
  if (!library.length) return alert("Library is empty. No novel to continue.");

  // pick the most recently downloaded novel
  const recent = library.reduce((a,b) => (a.lastDownloaded > b.lastDownloaded ? a : b));
  continueDownload(recent);
};


  // --- Info button ---
const infoBtn = document.createElement("button");
infoBtn.textContent = "ℹ Info";
infoBtn.style.flexShrink = "0";
document.querySelector("#menuHeader > div").appendChild(infoBtn);

// --- Modal ---
const infoModal = document.createElement("div");
infoModal.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

infoModal.innerHTML = `
  <div style="
    background: #fff;
    padding: 16px 20px;
    max-width: 420px;
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    font-size: 14px;
    line-height: 1.5;
  ">
    <h4 style="margin-top:0;">Download Requirement</h4>
    <p>
      Downloads must be started <b>from inside a chapter page</b>,
      not from the novel overview page.
    </p>
      <p>
    Instructions Read Carefully!!!! Go to chapter 1 of whatever novel you are downloading.
    Be sure to have selected all. Click Download. Refresh the page when the refresh message appears.
    Click Continue From Latest.
    Wait to refresh.
    Repeat until all chapters are downloaded.
    If it shows an error immediately after clicking Continue From Latest, click Download Saved for override.
    </p>
    <p>
      This is required to pass the site's security check and avoid
      automatic download blocking.
    </p>
    <div style="text-align:right; margin-top:12px;">
      <button id="closeInfoModal">Close</button>
    </div>
  </div>
`;

document.body.appendChild(infoModal);

// --- Modal behavior ---
infoBtn.onclick = () => {
  infoModal.style.display = "flex";
};

infoModal.onclick = (e) => {
  if (e.target === infoModal) {
    infoModal.style.display = "none";
  }
};

infoModal.querySelector("#closeInfoModal").onclick = () => {
  infoModal.style.display = "none";
};
// --- toggle button ---
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "📚 Chapters";
toggleBtn.style.cssText = `position: fixed; top: 10px; right: 10px; z-index: 999999;`;
toggleBtn.onclick = () => menu.style.display = menu.style.display === "none" ? "block" : "none";
document.body.appendChild(toggleBtn);

  const libraryBtn = document.createElement("button");
libraryBtn.textContent = "Library";
libraryBtn.style.flexShrink = "0";
document.querySelector("#menuHeader > div").appendChild(libraryBtn);

// --- select/deselect all ---
const selectAllChk = document.getElementById("selectAllChk");
selectAllChk.addEventListener("change", () => {
  menu.querySelectorAll("#chaptersList input[type=checkbox]").forEach(cb => cb.checked = selectAllChk.checked);
});

// --- current chapter logic ---
const currentChapterOrder = parseInt(location.pathname.match(/chapter-(\d+)/)?.[1] ?? "1");

// --- select from current onward ---
document.getElementById("selectFromCurrentBtn").onclick = () => {
  menu.querySelectorAll("#chaptersList input[type=checkbox]").forEach(cb => {
    cb.checked = parseInt(cb.dataset.order) >= currentChapterOrder;
  });
  selectAllChk.checked = false;
};

// --- jump to current + highlight ---
document.getElementById("jumpToCurrentBtn").onclick = () => {
  menu.querySelectorAll("#chaptersList label").forEach(lbl => lbl.style.background = "");
  const currentCheckbox = menu.querySelector(`#chaptersList input[data-order="${currentChapterOrder}"]`);
  if (currentCheckbox) {
    currentCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
    currentCheckbox.parentElement.style.background = "#fffae6";
  }
};




// --- stop download flag ---
let stopDownloadFlag = false;

// --- Stop Download Button ---
const stopDownloadBtn = document.createElement("button");
stopDownloadBtn.textContent = "Stop Download";
stopDownloadBtn.style.flexShrink = "0";
document.querySelector("#menuHeader > div").appendChild(stopDownloadBtn);

stopDownloadBtn.onclick = () => {
  stopDownloadFlag = true;
  securityAlert.textContent = "⏹️ Download manually stopped. You can continue later.";
  securityAlert.style.display = "block";
};

// --- Download Saved Button ---
const downloadSavedBtn = document.createElement("button");
downloadSavedBtn.textContent = "Download Saved";
downloadSavedBtn.style.flexShrink = "0";
document.querySelector("#menuHeader > div").appendChild(downloadSavedBtn);

downloadSavedBtn.onclick = async () => {
  const temp = loadTempProgress();
  if (!temp) {
    alert("No saved progress found in local storage.");
    return;
  }

  // Show indicator like downloading
  const header = document.getElementById("menuHeader");
  let indicator = header.querySelector(".download-indicator");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "download-indicator";
    indicator.style.cssText = `
      display:inline-block; margin-left:10px; padding:2px 6px;
      background:#ffd700; color:#000; border-radius:8px;
      font-size:12px; font-weight:bold;
      animation: blink 1s infinite;
    `;
    header.appendChild(indicator);
  }
  indicator.textContent = `Downloading saved... (${temp.orders.length}/${temp.totalChapters || "?"})`;
  indicator.style.display = "inline-block";

  try {
    await downloadAsEPUB(temp.title, temp.chapters, temp.orders);
    clearTempProgress();
    console.info("[DOWNLOAD SAVED] EPUB downloaded and temp cleared.");
  } catch (err) {
    console.error("[DOWNLOAD SAVED] Failed:", err);
  } finally {
    indicator.style.display = "none";
  }
};



const INTERRUPTED_KEY = "epubDownloadTemp";

function saveTempProgress(entry, chapters, orders) {
  localStorage.setItem(INTERRUPTED_KEY, JSON.stringify({
    id: entry.id,
    title: entry.title,
    coverUrl: entry.coverUrl,
    chapters,
    orders
  }));
}

function loadTempProgress() {
  const raw = localStorage.getItem(INTERRUPTED_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearTempProgress() {
  localStorage.removeItem(INTERRUPTED_KEY);
}
async function continueDownload(entry) {
  const novelId = entry.id;
  const novelTitle = entry.title;
  const startChapter = entry.latestChapter + 1;
  const totalChapters = entry.totalChapters;

  console.info(`[DOWNLOAD] Continuing ${novelTitle} from chapter ${startChapter}`);

  let coverUrl = entry.coverUrl || findCoverImageUrl(document);
  let successfulChapters = [];
  let successfulOrders = [];

  // If there is temp progress for this novel, load it
  const temp = loadTempProgress();
  if (temp && temp.id === novelId) {
    successfulChapters = temp.chapters;
    successfulOrders = temp.orders;
    console.info(`[DOWNLOAD] Resuming from temp progress: ${successfulOrders.slice(-1)[0]}`);
  }

  for (let ch = startChapter; ch <= totalChapters; ch++) {

    // <<<<<< ADD THIS BLOCK >>>>>>
if (stopDownloadFlag) {
  console.warn("[STOP] Manual stop triggered — treating as failed chapter.");

  // Show same message as fetch failure
  securityAlert.textContent =
    "⚠️ Download paused due to failure. Refresh page to continue.";
  securityAlert.style.display = "block";

  // Save current progress exactly like a failed fetch
  saveTempProgress(entry, successfulChapters, successfulOrders);

  // IMPORTANT: don't reset here; handle at UI level
  return;
}
    try {
      const html = await fetchChapterContent(ch);
      successfulChapters.push(html);
      successfulOrders.push(ch);

      // Save temp progress after each successful chapter
      saveTempProgress(entry, successfulChapters, successfulOrders);

      // Update library progress
      const library = loadLibrary();
      const existing = library.find(e => e.id === novelId);
      if (existing) {
        existing.totalChapters = totalChapters;
        existing.latestChapter = Math.max(...successfulOrders);
        existing.coverUrl = coverUrl;
        saveLibrary(library);
      }

      console.info(`[CONTINUE] Fetched chapter ${ch}`);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.warn(`[CONTINUE] Chapter ${ch} failed:`, err);

      // Show alert that download paused
      securityAlert.textContent = "⚠️ Download paused due to failure. Refresh page to continue.";
      securityAlert.style.display = "block";
      return; // stop downloading further chapters
    }
  }

  // All chapters succeeded, generate final EPUB
  if (successfulChapters.length > 0) {
    await downloadAsEPUB(novelTitle, successfulChapters, successfulOrders);

    // Update library progress
    const library = loadLibrary();
    const existing = library.find(e => e.id === novelId);
    if (existing) {
      existing.latestChapter = Math.max(...successfulOrders);
      existing.coverUrl = coverUrl;
      saveLibrary(library);
    }

    // Clear temp storage
    clearTempProgress();

    renderLibrary();
    console.info(`[DOWNLOAD] Completed ${novelTitle} up to chapter ${totalChapters}`);
  }
}

  // --- library data store key ---
const LIBRARY_KEY = "epubLibraryV1";
function loadLibrary() {
  const raw = localStorage.getItem(LIBRARY_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveLibrary(data) { localStorage.setItem(LIBRARY_KEY, JSON.stringify(data)); }

// --- tiny security alert popup ---
const securityAlert = document.createElement("div");
securityAlert.style.cssText = `
  position: fixed; top: 40px; right: 10px; background:#ffcccc; color:#900;
  padding:2px 6px; border-radius:6px; font-size:12px; display:none; z-index:999999;
`;
securityAlert.innerHTML = "⚠️ Security check encountered — download paused. Refresh page if stuck.";
document.body.appendChild(securityAlert);

// --- library UI panel ---
const libraryPanel = document.createElement("div");
libraryPanel.style.cssText = `
  position: fixed; top: 60px; right: 380px; width: 400px; max-height: 80vh;
  overflow-y: auto; background: #fff; border-radius: 12px; padding: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; display:none;
`;
libraryPanel.innerHTML = `
  <h3>EPUB Library</h3>
  <input type="text" id="librarySearch" placeholder="Search by title..." style="width:100%; margin-bottom:10px;"/>
  <select id="librarySort" style="width:100%; margin-bottom:10px;">
    <option value="recent">Most Recent</option>
    <option value="title">Title A-Z</option>
    <option value="latestChapter">Latest Chapter</option>
  </select>
  <div id="libraryList"></div>
`;
document.body.appendChild(libraryPanel);

// --- open library (close menu, show blank panel) ---
libraryBtn.onclick = () => {
  menu.style.display = "none"; // close chapters menu
  libraryPanel.style.display = "block";
};

// --- library panel style & blank contents ---
libraryPanel.style.width = "380px";
libraryPanel.style.height = "80vh";
libraryPanel.style.background = "#fff";
libraryPanel.style.border = "1px solid #ccc";
libraryPanel.style.borderRadius = "8px";
libraryPanel.style.padding = "10px";
libraryPanel.style.overflowY = "auto";
libraryPanel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
libraryPanel.style.position = "fixed";
libraryPanel.style.top = "60px";
libraryPanel.style.right = "10px";
libraryPanel.style.zIndex = "9999";
libraryPanel.style.display = "none";



// --- blank container for items ---
const libraryItemsContainer = document.createElement("div");
libraryItemsContainer.id = "libraryItems";
libraryPanel.appendChild(libraryItemsContainer);

// <-- ADD THIS LINE
renderLibrary();

let tempEPUB = null;

// --- get chapter info from EPUB ---
async function getEPUBChapterInfo(file) {
  await ensureJSZip();
  const zip = await JSZip.loadAsync(file);
  const allFiles = Object.keys(zip.files);

  // Find chapter files: ch<number>.xhtml
  const chapterFiles = allFiles
    .map(f => f.match(/^OEBPS\/ch(\d+)\.xhtml$/i))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10));

  const latestChapter = chapterFiles.length ? Math.max(...chapterFiles) : 0;
  const totalChapters = chapterFiles.length;

  return { latestChapter, totalChapters };
}




  // --- TEMP STORAGE BAR ---
const tempStorageBar = document.createElement("div");
tempStorageBar.id = "tempStorageBar";
tempStorageBar.style.cssText = `
  background:#f0f0f0; padding:6px 8px; margin-bottom:10px; border-radius:6px;
  font-size:12px; color:#333; display:flex; justify-content:space-between; align-items:center;
`;
tempStorageBar.innerHTML = `
  <span id="tempStorageInfo">No temp storage</span>
  <button id="clearTempStorageBtn" style="padding:2px 6px; font-size:11px;">Clear</button>
`;
libraryPanel.appendChild(tempStorageBar);

// --- Clear button functionality ---
document.getElementById("clearTempStorageBtn").onclick = () => {
  clearTempProgress();
  updateTempStorageBar();
};

function updateTempStorageBar() {
  const info = document.getElementById("tempStorageInfo");
  if (!info) return; // exit if the element doesn't exist yet

  const temp = loadTempProgress();
  if (temp) {
    const size = new Blob([JSON.stringify(temp)]).size;
    info.textContent = `Temp storage: ${size} bytes — ${temp.orders?.length || 0} chapters saved` +
      (temp.title ? ` — "${temp.title}"` : "");
  } else {
    info.textContent = "No temp storage";
  }
}

// --- Render Library ---
function renderLibrary() {
  // Update temp storage bar first
  updateTempStorageBar();

  const library = loadLibrary();
  const sortMode = libraryPanel.querySelector("#librarySort")?.value || "recent";
  const searchQuery = libraryPanel.querySelector("#librarySearch")?.value.trim().toLowerCase() || "";


  // Sort library
  let sorted = [...library];
  if (sortMode === "recent") sorted.sort((a,b) => (b.lastDownloaded||0) - (a.lastDownloaded||0));
  else if (sortMode === "title") sorted.sort((a,b) => (a.title||"").localeCompare(b.title||""));
  else if (sortMode === "latestChapter") sorted.sort((a,b) => (Number(b.latestChapter)||0) - (Number(a.latestChapter)||0));

  const filtered = sorted.filter(e => e.title.toLowerCase().includes(searchQuery));

  // --- Fixed top bar ---
  let fixedBar = libraryPanel.querySelector("#libraryFixedBar");
  if (!fixedBar) {
    fixedBar = document.createElement("div");
    fixedBar.id = "libraryFixedBar";
    fixedBar.style.cssText = `
      position: sticky; top: 0;
      display:flex; justify-content:flex-end; gap:0px;
      padding:0px; background:#f9f9f9; border-bottom:1px solid #ddd; z-index:10;
    `;

    // Import EPUB Button (fixed bar)
    const importEPUBBtn = document.createElement("button");
    importEPUBBtn.textContent = "Import EPUB";
    importEPUBBtn.style.cssText = "padding:4px 8px; cursor:pointer;";
    importEPUBBtn.onclick = () => {
      const inputFile = document.createElement("input");
      inputFile.type = "file";
      inputFile.accept = ".epub";

      inputFile.onchange = async (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];

        // Clean title
        let title = file.name.replace(/\.epub$/i, "")
                             .replace(/- WTR-LAB.*$/i, "")
                             .replace(/^Chapter\s+\d+\s*[-:]?\s*/i, "")
                             .trim();

        const library = loadLibrary();
        const existingIndex = library.findIndex(e => e.title === title);

        const { latestChapter: epubLatest, totalChapters: epubTotal } = await getEPUBChapterInfo(file);

        let entry;
        if (existingIndex >= 0) {
          entry = library[existingIndex];
          entry.file = file;
          entry.latestChapter = epubLatest;
          entry.totalChapters = Math.max(entry.totalChapters, epubTotal);
          entry.lastDownloaded = Date.now();
        } else {
          entry = {
            id: "epub-" + Date.now(),
            title,
            coverUrl: "",
            latestChapter: epubLatest,
            totalChapters: epubTotal,
            file,
            lastDownloaded: Date.now(),
            inLocalStorage: true
          };
          library.push(entry);
        }

        saveLibrary(library);
        saveTempProgress(entry, [], []); // allow Continue to append if interrupted
        renderLibrary();
      };

      inputFile.click();
    };
    fixedBar.appendChild(importEPUBBtn);

    // Close Button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.onclick = () => libraryPanel.style.display = "none";
    fixedBar.appendChild(closeBtn);

    libraryPanel.prepend(fixedBar);
  }

  // --- Scrollable list ---
  let listContainer = libraryPanel.querySelector("#libraryItems");
  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "libraryItems";
    listContainer.style.cssText = `
      overflow-y:auto; height: calc(100% - ${fixedBar.offsetHeight}px); padding:6px;
    `;
    libraryPanel.appendChild(listContainer);
  }

  // Render library entries
  listContainer.innerHTML = filtered.map(entry => `
    <div style="display:grid;grid-template-columns:60px 1fr 150px;gap:10px;align-items:center;padding:6px;border-bottom:1px solid #eee;">
      <img src="${entry.coverUrl||''}" style="width:60px;height:80px;object-fit:cover;border:1px solid #ccc;" />
      <div>
        <div style="font-weight:bold;">${entry.title}</div>
        <div style="font-size:12px;">Chapters: ${entry.latestChapter||0}/${entry.totalChapters||0}</div>
      </div>
      <div style="display:flex;gap:4px;">
        <button data-id="${entry.id}" class="continueBtn">Continue</button>
        <button data-id="${entry.id}" class="deleteBtn">Delete</button>
      </div>
    </div>
  `).join("");
  // --- Continue buttons ---
  listContainer.querySelectorAll(".continueBtn").forEach(btn => {
    btn.onclick = async () => {
      const entry = library.find(e => e.id === btn.dataset.id);
      if (!entry) return;

      console.info("[Library] Continuing download for", entry.title);
      const start = entry.latestChapter + 1;

      try {
        const newChapters = await continueDownload(entry, start);

        if (entry.file) {
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const oldBytes = new Uint8Array(ev.target.result);
            const mergedBytes = new Uint8Array([...oldBytes, ...newChapters]);
            const mergedFile = new File([mergedBytes], entry.title + ".epub", { type: "application/epub+zip" });

            entry.file = mergedFile;
            entry.latestChapter += newChapters.length;
            entry.totalChapters = Math.max(entry.totalChapters, entry.latestChapter);

            saveLibrary(library);
            renderLibrary();
            libraryPanel.style.display = "none";
          };
          reader.readAsArrayBuffer(entry.file);
        } else {
          entry.latestChapter += newChapters.length;
          entry.totalChapters = Math.max(entry.totalChapters, entry.latestChapter);
          saveLibrary(library);
          renderLibrary();
          libraryPanel.style.display = "none";
        }

      } catch (err) {
        console.warn("[Library] Download interrupted", err);
        entry.interrupted = true;
        saveLibrary(library);
      }
    };
  });

  // --- Delete buttons ---
  listContainer.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = () => {
      const index = library.findIndex(e => e.id === btn.dataset.id);
      if (index >= 0) {
        library.splice(index, 1);
        saveLibrary(library);
        renderLibrary();
      }
    };
  });
}
// --- Add / Update Library Entry ---
function addToLibrary(novelId, novelTitle, coverUrl, totalChapters, latestChapter, file = null) {
  const library = loadLibrary();
  const now = Date.now();
  const existing = library.find(e => e.id === novelId);

  // Normalize title: replace ":" with "-"
  const normalizedTitle = novelTitle.replace(/:/g, "-").trim();

  if (existing) {
    existing.totalChapters = totalChapters;
    existing.latestChapter = latestChapter;
    existing.lastDownloaded = now;
    if (coverUrl) existing.coverUrl = coverUrl;
    if (file) existing.file = file;
    existing.title = normalizedTitle; // ensure overwrite uses normalized title
  } else {
    library.push({
      id: novelId,
      title: normalizedTitle, // store normalized title
      coverUrl: coverUrl || '',
      totalChapters,
      latestChapter,
      lastDownloaded: now,
      file
    });
  }

  saveLibrary(library);
  renderLibrary();
}


// --- helper: get rendered text ---
function getRenderedText(container) {
  return Array.from(container.querySelectorAll("p[data-line], p"))
    .map(p => p.textContent)
    .join("\n")
    .trim();
}


  // --- 3. Fetch chapter content + replace glossary (patched) ---
async function fetchChapterContent(order) {
  const formData = { translate: "ai", language, raw_id: id, chapter_no: order };

  const res = await fetch("https://wtr-lab.com/api/reader/get", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(formData),
    credentials: "include"
  });

  let json;
  try {
    json = await res.json();
  } catch {
    console.warn(`Chapter ${order}: Failed to parse JSON`);
    throw new Error("Invalid JSON");
  }

  if (!json?.data?.data?.body) {
    console.warn(`Chapter ${order}: No body in response`, json);
    throw new Error("Missing body");
  }

  const tempDiv = document.createElement("div");
  let imgCounter = 0;

  json.data.data.body.forEach(el => {
    if (el === "[image]") {
      const src = json.data.data?.images?.[imgCounter++] ?? "";
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        tempDiv.appendChild(img);
      }
    } else {
      const pnode = document.createElement("p");
      const wrapper = document.createElement("div");
      wrapper.innerHTML = el;
      pnode.textContent = wrapper.textContent;

      for (let i = 0; i < json?.data?.data?.glossary_data?.terms?.length ?? 0; i++) {
        const term = json.data.data.glossary_data.terms[i][0] ?? `※${i}⛬`;
        pnode.textContent = pnode.textContent.replaceAll(`※${i}⛬`, term);
      }
      tempDiv.appendChild(pnode);
    }
  });

  const rawText = getRenderedText(tempDiv);
  const processedText = applyReplacementsVToText(rawText, id);
  return `<h1>${order}: ${json.chapter?.title ?? "Untitled"}</h1><p>${processedText.replace(/\n/g,"<br>")}</p>`;
}

// --- build all content from selected (patched) ---
async function buildAllContentFromSelected() {
  const selectedOrders = [...menu.querySelectorAll("#chaptersList input:checked")].map(cb => cb.dataset.order);
  const allContent = [];

  for (const order of selectedOrders) {
    try {
      const html = await fetchChapterContent(order);
      allContent.push(html);
      await new Promise(r => setTimeout(r, 1000)); // throttle 1s per chapter
    } catch (err) {
      console.error(`Unexpected error fetching chapter ${order}:`, err);
      allContent.push(`<h1>${order}: (unexpected error)</h1>`);
    }
  }

  console.info("[INFO] Finished fetching all chapters. Check console for any failed chapters.");
  return { content: allContent, orders: selectedOrders };
}

  // --- 4. EPUB functions (unchanged from your previous) ---
  async function ensureJSZip() { if (window.JSZip) return window.JSZip; return new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; s.onload = () => res(window.JSZip); s.onerror = rej; document.head.appendChild(s); }); }
  async function downloadAsEPUB(novelTitle, allContent, chapterOrders) {
    await ensureJSZip();
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
    const metaInf = zip.folder("META-INF");
    const oebps = zip.folder("OEBPS");
    metaInf.file("container.xml", `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
    const manifestItems = chapterOrders.map(num => `<item id="ch${num}" href="ch${num}.xhtml" media-type="application/xhtml+xml"/>`).join("\n");
    const spineItems = chapterOrders.map(num => `<itemref idref="ch${num}"/>`).join("\n");
    oebps.file("content.opf", `<?xml version="1.0" encoding="utf-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${escapeXml(novelTitle)}</dc:title><dc:language>en</dc:language>  <dc:creator>${escapeXml(novelAuthor || "WTRLAB")}</dc:creator><dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier></metadata><manifest>${manifestItems}</manifest><spine>${spineItems}</spine></package>`);
    allContent.forEach((html, idx) => oebps.file(`ch${chapterOrders[idx]}.xhtml`, `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Chapter ${chapterOrders[idx]}</title></head><body>${html}</body></html>`));
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${sanitizeFilename(novelTitle)}.epub`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function escapeXml(str) { return (str+"").replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'})[c]); }
  function sanitizeFilename(name) { return (name||"book").replace(/[\/\\?%*:|"<>]/g,"-").slice(0,200); }

  // helper: find cover URL from page (tries several common selectors/meta tags)
function findCoverImageUrl(dom = document) {
  // 1. Try to find any <picture><source srcset> pointing to CDN
  const pictureSources = Array.from(dom.querySelectorAll("picture source[srcset]"))
    .map(s => s.srcset)
    .filter(u => u && u.includes("/cdn/series/"));
  if (pictureSources.length) return pictureSources[0];

  // 2. Fallback: any <img> in .image-wrap or .cover pointing to CDN
  const imgs = Array.from(dom.querySelectorAll(".image-wrap img, .cover img"))
    .map(i => i.src)
    .filter(u => u && u.includes("/cdn/series/") && !u.includes("/placeholder"));
  if (imgs.length) return imgs[0];

  // 3. Next.js JSON fallback
  try {
    const jsonText = dom.querySelector('script#__NEXT_DATA__')?.textContent;
    if (jsonText) {
      const j = JSON.parse(jsonText);
      return j?.props?.pageProps?.series?.cover ||
             j?.props?.pageProps?.novel?.cover ||
             j?.props?.initialState?.series?.cover ||
             null;
    }
  } catch (e) {}

  // 4. If nothing found, return null
  return null;
}

// patched downloadAsEPUB that includes cover image if available
async function downloadAsEPUB(novelTitle, allContent, chapterOrders) {
  await ensureJSZip();

  const zip = new JSZip();
  // must be first & uncompressed
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  const metaInf = zip.folder("META-INF");
  const oebps = zip.folder("OEBPS");
  const imagesFolder = oebps.folder("images");

  metaInf.file(
    "container.xml",
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  // **** Attempt to find & embed cover image ****
  let coverHref = null;
  let coverId = "cover-image";
  try {
    const coverUrl = findCoverImageUrl(document);
    if (coverUrl) {
      // normalize URL (absolute)
      const absolute = new URL(coverUrl, location.href).href;
      // fetch binary
      const resp = await fetch(absolute, { credentials: "include" });
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        // determine extension/content-type
        const ct = resp.headers.get("content-type") || "";
        let ext = "jpg";
        if (ct.includes("png")) ext = "png";
        else if (ct.includes("webp")) ext = "webp";
        else if (ct.includes("jpeg")) ext = "jpg";
        else {
          // try from URL
          const m = absolute.match(/\.(png|jpe?g|webp)(?:$|\?)/i);
          if (m) ext = m[1].toLowerCase().replace("jpeg", "jpg");
        }
        coverHref = `images/cover.${ext}`;
        // add to zip (Uint8Array)
        imagesFolder.file(`cover.${ext}`, new Uint8Array(buf));
      } else {
        console.warn("[EPUB] cover fetch failed:", resp.status);
      }
    } else {
      console.info("[EPUB] No cover URL found on page");
    }
  } catch (err) {
    console.warn("[EPUB] cover embed skipped (error):", err);
    coverHref = null;
  }

  // Derive minimal chapter titles array (try headings in content or fallback)
  const chapterTitles = chapterOrders.map((num, i) => {
    const html = allContent[i] || "";
    const m = html.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
    if (m && m[1]) return m[1].trim();
    try {
      if (typeof chapters !== "undefined" && Array.isArray(chapters)) {
        const found = chapters.find(c => String(c.order) === String(num));
        if (found && found.title) return found.title;
      }
    } catch (e) {}
    return `Chapter ${num}`;
  });

  // nav.xhtml (simple ToC)
  const tocEntries = chapterOrders
    .map((num, i) => `<li><a href="ch${num}.xhtml">${escapeXml(chapterTitles[i])}</a></li>`)
    .join("\n");

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
  <head><title>Table of Contents</title></head>
  <body>
    <nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${tocEntries}</ol></nav>
  </body>
</html>`;
  oebps.file("nav.xhtml", navXhtml);

  // manifest entries (include cover image if present)
  const manifestItems = [
    `<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>`,
    ...chapterOrders.map(num => `<item id="ch${num}" href="ch${num}.xhtml" media-type="application/xhtml+xml"/>`)
  ];
  if (coverHref) {
    // detect media-type
    const ext = coverHref.split(".").pop().toLowerCase();
    let mtype = "image/jpeg";
    if (ext === "png") mtype = "image/png";
    else if (ext === "webp") mtype = "image/webp";
    manifestItems.splice(1, 0, `<item id="${coverId}" href="${coverHref}" media-type="${mtype}"/>`);
  }

  const manifestXml = manifestItems.join("\n");
  const spineItems = chapterOrders.map(num => `<itemref idref="ch${num}"/>`).join("\n");

  // content.opf with cover meta if present
  const metaCoverTag = coverHref ? `<meta name="cover" content="${coverId}"/>` : "";
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(novelTitle || "Untitled")}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
    ${metaCoverTag}
  </metadata>
  <manifest>
    ${manifestXml}
  </manifest>
  <spine>
    ${spineItems}
  </spine>
</package>`;
  oebps.file("content.opf", opf);

  // Add chapters
  allContent.forEach((html, idx) => {
    const order = chapterOrders[idx];
    const title = escapeXml(chapterTitles[idx] || `Chapter ${order}`);
    const safeHtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>${title}</title></head>
  <body>${html}</body>
</html>`;
    oebps.file(`ch${order}.xhtml`, safeHtml);
  });

  // Add a simple cover.xhtml page that displays the cover (some readers use it)
  if (coverHref) {
    const coverPage = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Cover</title></head>
  <body>
    <div style="text-align:center;">
      <img src="${coverHref}" alt="Cover" style="max-width:100%;height:auto;"/>
    </div>
  </body>
</html>`;
    oebps.file("cover.xhtml", coverPage);
    // include cover.xhtml in manifest and place it first in spine if desired
    // (we already added cover image manifest); optionally insert cover.xhtml
    // oebps manifest/spine modifications could be added here if you want cover.xhtml first.
  }

  // generate
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${sanitizeFilename(novelTitle || "book")}.epub`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  console.info("[EPUB] Download triggered (with cover if available).");
}


const downloadBtn = document.getElementById("downloadEpubBtn");

// --- helper: get novel title from breadcrumb ---
function getNovelTitleFromBreadcrumb() {
  const a = document.querySelector(".breadcrumb-item.active a");
  if (a && a.textContent.trim()) {
    return a.textContent.trim();
  }
  return "Novel";
}

// --- download / add to library ---
downloadBtn.addEventListener("click", async () => {
  console.info("[DOWNLOAD] Starting chapter download...");

  const header = document.getElementById("menuHeader");
  let indicator = header.querySelector(".download-indicator");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "download-indicator";
    indicator.style.cssText = `
      display:inline-block; margin-left:10px; padding:2px 6px;
      background:#ffd700; color:#000; border-radius:8px;
      font-size:12px; font-weight:bold;
      animation: blink 1s infinite;
    `;
    indicator.textContent = "Downloading...";
    header.appendChild(indicator);
  }
  indicator.style.display = "inline-block";

  if (!document.getElementById("blinkAnimation")) {
    const style = document.createElement("style");
    style.id = "blinkAnimation";
    style.textContent = `
      @keyframes blink { 0%,50%,100% { opacity: 1; } 25%,75% { opacity: 0.3; } }
    `;
    document.head.appendChild(style);
  }

  const novelTitle = getNovelTitleFromBreadcrumb();
  const novelId = location.pathname.split("/").pop();
  const selectedChapters = Array.from(menu.querySelectorAll("#chaptersList input[type=checkbox]:checked"))
    .map(cb => ({
      order: parseInt(cb.dataset.order),
      title: cb.parentElement.textContent.trim()
    }));

  let coverUrl = "";
  try {
    const imageWrap = document.querySelector("div.image-wrap picture source[srcset]");
    if (imageWrap) coverUrl = imageWrap.srcset;
  } catch (err) { console.warn("[DOWNLOAD] Could not grab cover URL:", err); }

  const totalChapters = chapters.length;
  libraryPanel.style.display = "block";
  menu.style.display = "none";

  // --- Load temp progress if any ---
  const temp = loadTempProgress();
  let successfulChapters = temp && temp.id === novelId ? temp.chapters : [];
  let successfulOrders = temp && temp.id === novelId ? temp.orders : [];

for (let ch of selectedChapters) {
  // --- STOP CHECK: mimic fetch failure ---
  if (stopDownloadFlag) {
    console.warn("[STOP] Manual stop triggered — treating as failed chapter.");
    securityAlert.textContent =
      "⚠️ Download paused due to manual stop. Refresh page to continue.";
    securityAlert.style.display = "block";

    // Save temp progress like a failed fetch
    saveTempProgress({ id: novelId, title: novelTitle, coverUrl }, successfulChapters, successfulOrders);

    // Stop the loop immediately
    indicator.style.display = "none";
    return;
  }

  try {
    const chapterContent = await fetchChapterContent(ch.order);
    if (!chapterContent || chapterContent.trim() === "") throw new Error("Empty chapter content");

    successfulChapters.push(chapterContent);
    successfulOrders.push(ch.order);

    // Save temp progress after each successful chapter
    saveTempProgress({ id: novelId, title: novelTitle, coverUrl }, successfulChapters, successfulOrders);

    addToLibrary(novelId, novelTitle, coverUrl, totalChapters, Math.max(...successfulOrders));
    libraryPanel.scrollTop = libraryPanel.scrollHeight;
    console.info(`[Library] Downloaded chapter ${ch.order}: ${ch.title}`);
  } catch (err) {
    console.error(`[DOWNLOAD] Chapter ${ch.order} failed:`, err);
    securityAlert.textContent = "⚠️ Download paused due to security check. Refresh page to continue.";
    securityAlert.style.display = "block";
    indicator.style.display = "none";
    return; // stop loop, keep temp saved
  }
}

  // All selected chapters downloaded, finalize EPUB
  await downloadAsEPUB(novelTitle, successfulChapters, successfulOrders);

  // Clear temp storage
  clearTempProgress();

  indicator.style.display = "none";
  console.info("[DOWNLOAD] All chapters downloaded successfully.");
});

})();





(function () {
      'use strict';

      const STORAGE_KEY = 'wordReplacerPairsV3';

      // Load data or initialize empty object
      let data = loadData();

      // Main UI button
    const mainButton = document.createElement('button');
    mainButton.textContent = 'Word Replacer';
    Object.assign(mainButton.style, {
      position: 'fixed',
      bottom: '20px',       // always 20px from bottom
      right: '20px',
      zIndex: '100001',     // above everything except popup panel
      padding: '8px 14px',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    });
    document.body.appendChild(mainButton);

      let popup = null;

      mainButton.addEventListener('click', () => {
        if (popup) {
          closePopup();
        } else {
          openPopup();
          replaceTextInChapter();
        }
      });

      function loadData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        try {
          return JSON.parse(raw);
        } catch {
          return {};
        }
      }

      function saveData(obj) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      }
    function closePopup() {
      if (popup) {
        popup.remove();
        popup = null;
      }
    }
      // Escape regex helper
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\",]/g, '\\$&');



    // Check if index is start of sentence
    function isStartOfSentence(index, fullText) {
      if (index === 0) return true; // start of paragraph/text

      const before = fullText.slice(0, index);

      // If the slice is only whitespace, treat as start
      if (/^\s*$/.test(before)) return true;

      // Trim trailing spaces for checks of punctuation/endings
      const trimmed = before.replace(/\s+$/, '');

      // 1) sentence-ending punctuation (., !, ?, …) possibly followed by closing quotes/brackets:
      if (/[.!?…]["”’')\]]*$/.test(trimmed)) return true;

      // 2) newline right before (dialogue line breaks etc.)
      if (/[\n\r]\s*$/.test(before)) return true;

      // 3) opening quote/paren immediately before the match OR opening quote then space
      if (/["“”'‘(\[]\s*$/.test(before)) return true;

      // 4) after any **double quotation mark** (straight or curly) **without space**
      if (/["“”]$/.test(before)) return true;

      // 5) after "Chapter XX:" optionally followed by a comma and space
      if (/Chapter\s+\d+:\s*,?\s*$/.test(before)) return true;

      return false;
    }

function isInsideDialogueAtIndex(text, index) {
  const quoteChars = `"“”‘’`;

  let count = 0;
  for (let i = 0; i < index; i++) {
    if (quoteChars.includes(text[i])) {
      count++;
    }
  }

  return (count % 2) === 1;
}


      // Preserve first capital helper
      function applyPreserveCapital(orig, replacement) {
        if (!orig) return replacement;
        if (orig[0] >= 'A' && orig[0] <= 'Z') {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }

    function buildIgnoreRegex(from, ignoreTerm, entry, wildcardSymbol) {
        const flags = entry.ignoreCapital ? 'gi' : 'g';
        let basePattern = escapeRegex(from).replace(new RegExp(`\\${wildcardSymbol}`, 'g'), '.');

        if (entry.noTrailingSpace) {
            basePattern = basePattern.trim();
        }

        if (ignoreTerm) {
            // Negative lookahead for the ignore phrase (allowing spaces or punctuation between)
            return new RegExp(
                basePattern + `(?![\\s"“”'’,.-]+${escapeRegex(ignoreTerm)})`,
                flags
            );
        } else {
            return new RegExp(basePattern, flags);
        }
    }
      // The core replacement function, applies all enabled replacements with flags
function applyReplacements(text, replacements) {
  let replacedText = text;
  const WILDCARD = '@';
  const punctuationRegex =
    /^[\W_'"“”‘’„,;:!?~()\[\]{}<>【】「」『』（）《》〈〉—–-]|[\W_'"“”‘’„,;:!?~()\[\]{}<>【】「」『』（）《》〈〉—–-]$/;

  for (const entry of replacements) {
    if (!entry.from || !entry.to) continue;

    const flags = entry.ignoreCapital ? 'gi' : 'g';
    let searchTerm = entry.noTrailingSpace ? entry.from.trimEnd() : entry.from;

    /* ---------- ignore term handling ---------- */
    let ignoreTerm = null;
    const prefixMatch = searchTerm.match(/^\|(.*?)\|\s*(.+)$/);
    const suffixMatch = searchTerm.match(/^(.*?)\s*\|(.*?)\|$/);

    if (prefixMatch) {
      ignoreTerm = { type: 'before', value: prefixMatch[1] };
      searchTerm = prefixMatch[2];
    } else if (suffixMatch) {
      ignoreTerm = { type: 'after', value: suffixMatch[2] };
      searchTerm = suffixMatch[1];
    }

    /* ---------- quote-aware start ---------- */
    const quoteChars = `"'“”‘’`;
    if (quoteChars.includes(searchTerm.charAt(0))) {
      searchTerm = `[${quoteChars}]` + escapeRegex(searchTerm.slice(1));
    } else {
      searchTerm = escapeRegex(searchTerm);
    }

    /* ---------- placeholder / wildcard ---------- */
    const caretFrom = (entry.from.match(/\^/g) || []).length;
    const caretTo = (entry.to.match(/\^/g) || []).length;
    const usePlaceholder = caretFrom === 1 && caretTo === 1;

    let base = usePlaceholder
      ? searchTerm.replace('\\^', '([^\\s])')
      : searchTerm.replace(new RegExp(`\\${WILDCARD}`, 'g'), '.');

    /* ---------- word boundaries ---------- */
    const firstChar = entry.from.charAt(0);
    const lastChar = entry.from.charAt(entry.from.length - 1);
    const skipBoundaries =
      punctuationRegex.test(firstChar) || punctuationRegex.test(lastChar);

    let patternStr = (entry.allInstances || skipBoundaries)
      ? base
      : `(?<=^|[^A-Za-z0-9])${base}(?=[^A-Za-z0-9]|$)`;

    /* ---------- ignore term logic ---------- */
    if (ignoreTerm?.value) {
      const escaped = escapeRegex(ignoreTerm.value);
      if (ignoreTerm.type === 'before') {
        patternStr = `(?<!${escaped})${patternStr}`;
      } else {
        patternStr = `${patternStr}(?!${escaped}\\s*)`;
      }
    }

    const regex = new RegExp(patternStr, flags);

    /* ---------- replacement loop ---------- */
    let newText = '';
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(replacedText)) !== null) {
      const idx = match.index;
      const insideDialogue = isInsideDialogueAtIndex(replacedText, idx);

      const blocked =
        (entry.insideDialogueOnly && !insideDialogue) ||
        (entry.outsideDialogueOnly && insideDialogue);

      if (blocked) {
        // Preserve original text and advance safely
        newText += replacedText.slice(lastIndex, idx + match[0].length);
        lastIndex = idx + match[0].length;
        continue;
      }

      newText += replacedText.slice(lastIndex, idx);

      let replacement = entry.noTrailingSpace
        ? entry.to.trimEnd()
        : entry.to;

      if (usePlaceholder && match[1]) {
        replacement = replacement.replace('^', match[1]);
      }

      const startSentence =
        entry.startOfSentence &&
        typeof isStartOfSentence === 'function' &&
        isStartOfSentence(idx, replacedText);

      if (startSentence) {
        replacement = entry.preserveFirstCapital
          ? applyPreserveCapital(match[0], replacement)
          : replacement.charAt(0).toUpperCase() + replacement.slice(1);
      } else if (entry.preserveFirstCapital) {
        replacement = applyPreserveCapital(match[0], replacement);
      }

      newText += replacement;
      lastIndex = idx + match[0].length;
    }

    newText += replacedText.slice(lastIndex);
    replacedText = newText;
  }

  return replacedText;
}
      // The main replaceTextInChapter, preserves old proportional slicing and paragraph-limited replacement
    function replaceTextInChapter() {
      const seriesId = (() => {
        const urlMatch = location.href.match(/\/novel\/(\d+)\//i);
        if (urlMatch) return urlMatch[1];
        const crumb = document.querySelector('.breadcrumb li.breadcrumb-item a[href*="/novel/"]');
        if (crumb) {
          const crumbMatch = crumb.href.match(/\/novel\/(\d+)\//i);
          if (crumbMatch) return crumbMatch[1];
        }
        return null;
      })();

      let replacements = [];
      for (const key in data) {
        if (key === 'global' || (seriesId && key === `series-${seriesId}`)) {
          replacements = replacements.concat(data[key].filter(e => e.enabled));
        }
      }

      if (replacements.length === 0) return false;

      const paragraphs = document.querySelectorAll(
        'div.chapter-body p[data-line], h3.chapter-title, div.post-content *'
      );

      let replacedAny = false;

      paragraphs.forEach(p => {
        const textNodes = [];
        const originalLengths = [];
        let originalText = '';

        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.nodeValue) continue;
          textNodes.push(node);
          originalLengths.push(node.nodeValue.length);
          originalText += node.nodeValue;
        }

        if (!originalText) return;

        // --- Step 1: Apply all replacements on flat text ---
        let replacedText = applyReplacements(originalText, replacements);

        // --- Step 2: Proportional slicing back into text nodes ---
        const totalOriginalLength = originalText.length;
        const totalReplacedLength = replacedText.length;
        let currentIndex = 0;

        textNodes.forEach((node, i) => {
          const proportion = originalLengths[i] / totalOriginalLength;
          let sliceLength = Math.round(proportion * totalReplacedLength);
          if (i === textNodes.length - 1) sliceLength = totalReplacedLength - currentIndex;
          node.nodeValue = replacedText.slice(currentIndex, currentIndex + sliceLength);
          currentIndex += sliceLength;
        });

        // --- Step 3: Wrap note entries in <span> ---
        textNodes.forEach(node => {
          let nodeVal = node.nodeValue;
          replacements.forEach(entry => {
            if (entry.note && entry.note.trim()) {
              let idx = 0;
              while ((idx = nodeVal.indexOf(entry.to, idx)) !== -1) {
                const parent = node.parentNode;
                if (!parent) break;

                const span = document.createElement('span');
                span.className = 'text-patch system_term';
                span.dataset.note = entry.note;
                span.textContent = entry.to;

                const before = nodeVal.slice(0, idx);
                const after = nodeVal.slice(idx + entry.to.length);

                if (before) parent.insertBefore(document.createTextNode(before), node);
                parent.insertBefore(span, node);
                nodeVal = after;
                idx = 0; // restart in remaining text
                node.nodeValue = nodeVal;
                if (!nodeVal) {
                  parent.removeChild(node);
                  break;
                }
              }
            }
          });
        });

        replacedAny = true;
      });

      if (replacedAny) console.log('Replacements done on chapter paragraphs.');
      return replacedAny;
    }


    function wrapNotesInParagraph(paragraph, replacements) {
      const html = paragraph.innerHTML;

      let newHTML = html;

      replacements.forEach(rep => {
        if (rep.note && rep.note.trim()) {
          // Regex escape
          const fromEscaped = rep.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Wrap the entire matching text in a span with data-note
          const regex = new RegExp(`(${fromEscaped})`, 'gi');
          newHTML = newHTML.replace(regex, `<span class="text-patch system_term" data-note="${rep.note}">$1</span>`);
        }
      });

      paragraph.innerHTML = newHTML;
    }

    function runReplacementMultiple(times = 1, delay = 100) {
      let count = 0;
    // ---------------------
    // Single global note modal
    // ---------------------

    function initInlinePopoverButtons() {
      const seriesId = window.seriesId || 'default-series';
      const shownotesRaw = localStorage.getItem('shownotes') || '';
      const shownotesSet = new Set(shownotesRaw.split(',').filter(Boolean));
      const notesVisible = shownotesSet.has(seriesId); // only visible if enabled for this series

      document.querySelectorAll('span.text-patch.system_term[data-note]').forEach(span => {
        // Skip if we already initialized a button for this span
        if (span.dataset.hasPencil === 'true') return;

        // Mark as having a pencil
        span.dataset.hasPencil = 'true';

        // Create tiny pencil button
        const btn = document.createElement('button');
        btn.textContent = '✎';
        btn.title = 'Show Note';
        Object.assign(btn.style, {
          fontSize: '10px',
          padding: '0 2px',
          marginLeft: '4px',
          cursor: 'pointer',
          lineHeight: '1',
          verticalAlign: 'middle',
          border: 'none',
          background: 'transparent',
          display: notesVisible ? 'inline' : 'none', // invisible by default
        });

        // Insert after the span
        span.insertAdjacentElement('afterend', btn);

        // Create popover
        const pop = document.createElement('div');
        pop.className = 'user-popover';
        Object.assign(pop.style, {
          position: 'absolute',
          zIndex: 9999,
          maxWidth: '280px',
          background: 'black',
          color: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          padding: '8px',
          display: 'none',
        });

        const desc = document.createElement('div');
        desc.className = 'patch-desc';
        desc.textContent = 'Note: ' + span.dataset.note;
        pop.appendChild(desc);
        document.body.appendChild(pop);

        // Store reference on span
        span._popover = pop;

        // Button click toggles popover
        btn.addEventListener('click', e => {
          e.stopPropagation();
          document.querySelectorAll('.user-popover').forEach(p => {
            if (p !== pop) p.style.display = 'none';
          });

          desc.textContent = 'Note: ' + span.dataset.note;

          const rect = span.getBoundingClientRect();
          // Position below the span
          pop.style.top = `${window.scrollY + rect.bottom + 5}px`; // 5px gap below
          pop.style.left = `${window.scrollX + rect.left}px`;

          // Toggle visibility
          pop.style.display = pop.style.display === 'block' ? 'none' : 'block';
        });
      });

      // Click outside -> hide all popovers
      document.addEventListener('click', () => {
        document.querySelectorAll('.user-popover').forEach(p => (p.style.display = 'none'));
      });
    }


    function removeExtraPencils() {
      document.querySelectorAll('span.text-patch.system_term[data-note]').forEach(span => {
        // find all button siblings immediately after this span
        const siblings = [];
        let next = span.nextElementSibling;

        while (next && next.tagName === 'BUTTON') {
          if (next.textContent.trim() === '✎') siblings.push(next);
          next = next.nextElementSibling;
        }

        // keep only the first ✎, remove the rest
        siblings.slice(1).forEach(btn => btn.remove());
      });
    }

    function nextPass() {
      const replaced = replaceTextInChapter();
      initInlinePopoverButtons();
      count++;
      if (count < times) {
        setTimeout(nextPass, delay);
      } else {
        // ✅ all passes finished, wait a bit then clean up
        setTimeout(removeExtraPencils, 150);
      }
    }

    nextPass(); // start first pass immediately
    }


    setTimeout(() => runReplacementMultiple(1, 100), 2000);



    // Reactive URL detection (History API hook)
    (function () {
      let lastUrl = location.href;

      function checkUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          runReplacementMultiple(1, 100); // multi-pass on SPA navigation
          removeExtraPencils();
          applyDataHashReplacements();
        }
      }

      // Wrap pushState
      const originalPushState = history.pushState;
      history.pushState = function () {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
      };

      // Wrap replaceState
      const originalReplaceState = history.replaceState;
      history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
      };

      // Listen to Back/Forward
      window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));


      // Unified listener
      window.addEventListener("locationchange", checkUrlChange);

      // ✅ Forcefully run once immediately on reload
      runReplacementMultiple(1, 100);
      applyDataHashReplacements(1,100);
    })();

      // ===============
      // UI popup code
      // ===============

    function openPopup() {
      if (popup) return; // Prevent multiple

    popup = document.createElement('div');
    Object.assign(popup.style, {
      position: 'fixed',
      bottom: '70px',       // push above the main button
      right: '10px',
        width: '100vw',       // scale to viewport
       maxWidth: '370px',   // cap at your original
      height: 'auto',
      maxHeight: 'none',
      backgroundColor: '#fff',
      border: '1px solid #aaa',
      padding: '15px',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
      overflow: 'visible',
      zIndex: '100000',     // below the button so button stays clickable
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    });
    document.body.appendChild(popup);

      // Toggle button for the list
      const toggleListBtn = document.createElement('button');
      toggleListBtn.textContent = 'List';
      toggleListBtn.style.marginBottom = '1px';
      toggleListBtn.style.display = 'block';
      toggleListBtn.style.color = 'black'
      styleButton(toggleListBtn);
      popup.appendChild(toggleListBtn);
    // Info button
    const infoBtn = document.createElement('button');
    infoBtn.textContent = 'Info';              // Label it properly
    infoBtn.style.marginLeft = '6px';          // space from the list button
    infoBtn.style.padding = '5px 10px';        // optional: smaller padding if needed
    infoBtn.style.alignSelf = 'flex-start';
    infoBtn.style.color = 'black';    // <-- shift up to top of flex container
    styleButton(infoBtn);

    // Container for buttons
    const topBtnContainer = document.createElement('div');
    topBtnContainer.style.display = 'flex';
    topBtnContainer.style.alignItems = 'center';
    topBtnContainer.appendChild(toggleListBtn);
    topBtnContainer.appendChild(infoBtn);
    popup.appendChild(topBtnContainer);


      const openRawsBtn = document.createElement('button');
openRawsBtn.textContent = 'Raws';
styleButton(openRawsBtn); // re-use your styleButton helper
openRawsBtn.style.marginLeft = '6px';
topBtnContainer.appendChild(openRawsBtn);


window.replacements = JSON.parse(localStorage.getItem('dataHashReplacements') || '[]');

// Apply all replacements on the page
window.applyDataHashReplacements = function () {
    if (!window.replacements.length) return;
    const spans = document.querySelectorAll('span[data-hash]');
    spans.forEach(span => {
        const dhEntry = window.replacements.find(r => r.dataHash === span.getAttribute('data-hash'));
        if (dhEntry) span.textContent = dhEntry.to;
    });
};

// Run replacements multiple times with delay
window.runReplacementMultiple = function (times = 2, delay = 50) {
    let count = 0;
    function nextPass() {
        window.applyDataHashReplacements();
        count++;
        if (count < times) setTimeout(nextPass, delay);
    }
    nextPass();
};

// ============================
// Reactive SPA navigation / page load
// ============================
(function () {
    let lastUrl = location.href;

    function checkUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            window.runReplacementMultiple(2, 50);
        }
    }

    // Wrap pushState
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
    };

    // Wrap replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
    };

    // Back/forward buttons
    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));
    window.addEventListener("locationchange", checkUrlChange);

    // Run once on page load after short delay
    setTimeout(() => window.runReplacementMultiple(2, 50), 500);
})();

// ============================
// Modal
// ============================
function openRawsModal() {
    if (document.querySelector('#rawsModal')) return;

    const modal = document.createElement('div');
    modal.id = 'rawsModal';
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '20px',
        zIndex: '100001',
        width: '320px',
        maxHeight: '70%',
        overflowY: 'auto',
        boxShadow: '0 0 12px rgba(0,0,0,0.3)',
        borderRadius: '6px',
    });
    document.body.appendChild(modal);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.float = 'right';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => modal.remove();
    modal.appendChild(closeBtn);

    const title = document.createElement('h3');
    title.textContent = 'Data-Hash Replacements';
    modal.appendChild(title);

    const listContainer = document.createElement('div');
    modal.appendChild(listContainer);

    const addContainer = document.createElement('div');
    addContainer.style.marginTop = '10px';
    modal.appendChild(addContainer);

    const dataHashInput = document.createElement('input');
    dataHashInput.placeholder = 'Data Hash';
    dataHashInput.style.width = 'calc(50% - 6px)';
    dataHashInput.style.marginRight = '6px';
    addContainer.appendChild(dataHashInput);

    const replacementInput = document.createElement('input');
    replacementInput.placeholder = 'Replacement';
    replacementInput.style.width = 'calc(50% - 6px)';
    addContainer.appendChild(replacementInput);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.style.marginTop = '6px';
    addContainer.appendChild(addBtn);

    // Render saved replacements in modal
    function renderList() {
        listContainer.innerHTML = '';
        window.replacements.forEach((r, idx) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.marginBottom = '4px';

            const span = document.createElement('span');
            span.textContent = `${r.dataHash} → ${r.to}`;
            div.appendChild(span);

            const del = document.createElement('button');
            del.textContent = 'Delete';
            del.onclick = () => {
                window.replacements.splice(idx, 1);
                saveAndRender();
            };
            div.appendChild(del);

            listContainer.appendChild(div);
        });
    }

    function saveAndRender() {
        localStorage.setItem('dataHashReplacements', JSON.stringify(window.replacements));
        renderList();
        window.runReplacementMultiple(2, 50);
    }

    addBtn.onclick = () => {
        const dh = dataHashInput.value.trim();
        const rp = replacementInput.value.trim();
        if (!dh || !rp) return;
        window.replacements.push({ dataHash: dh, to: rp });
        saveAndRender();
        dataHashInput.value = '';
        replacementInput.value = '';
    };

    renderList();
    window.runReplacementMultiple(2, 50);
}

// Attach modal button
openRawsBtn.onclick = openRawsModal;

    // Info box (hidden by default)
    const infoBox = document.createElement('div');
    Object.assign(infoBox.style, {
      maxHeight: '0',
      overflow: 'hidden',
      backgroundColor: '#fff',
      color: 'black',
      border: '1px solid #000',
      padding: '0 10px',
      marginTop: '10px',
      fontSize: '13px',
      maxHeightWhenOpen: '200px',
      lineHeight: '1.4',
        overflowY: 'auto',
      transition: 'max-height 0.3s ease, padding 0.3s ease',
    });
    infoBox.innerHTML = `
      <div style="padding:10px 0;">
        <strong>Replacement System Info:</strong>
        <ul style="margin:5px 0; padding-left:18px;">
          <li><strong>Ignore Capital:</strong> Match case-insensitively.</li>
          <li><strong>Start of Sentence:</strong> Only capitalize if the word starts a sentence.</li>
          <li><strong>Fuzzy Match:</strong> Ignore boundaries, match anywhere.</li>
          <li><strong>Preserve Capital:</strong> Keep first letter capitalized if original was capitalized.</li>
          <li><strong>No Trailing Space:</strong> Trim trailing space in replacement.</li>
          <li><strong>Inside Dialogue Only:</strong> Replace only inside quotation marks.</li>
          <li><strong>Outside Dialogue Only:</strong> Replace only outside quotation marks.</li>
          <li><strong>Global:</strong> Makes the entry apply to all novels.</li>
          <li><strong>|ignore this|:</strong> Use before or after a word to ignore specific matches. Example: <code>|ignore |term</code> or <code>term| ignore|</code>. Spaces must be inside the <code>||</code>.</li>
          <li><strong>@ wildcard:</strong> Any character substitution. Example: <code>fr@t</code> replaces fret, frat, frit, etc.</li>
          <li><strong>^ special placeholder:</strong> Use <code>^</code> in Find like <code>Th^t</code> and in Replace like <code>Br^</code>. The character at <code>^</code> in Find will be preserved in the replacement.</li>
          <li><strong>Edit Entries:</strong> Use 'Show List', tap an entry to make edits and change the series ID. By default, it will be applied only to whatever novel you're on currently. If you entered a term while in Library, it will default to an empty series ID, which is global.</li>
    	  <li>The Show Note requires you have go to the term editor in the Show List, but this is a fragile feature, I don't recommend it.<li>
            <li><strong>Raws:</strong> Match the raw text. You can copy the raw from popover, only works on the clickable terms.</li>
        </ul>
      </div>
    `;

    popup.appendChild(infoBox);

    // Info button click
    infoBtn.addEventListener('click', (e) => {
      if (infoBox.style.maxHeight && infoBox.style.maxHeight !== '0px') {
        infoBox.style.maxHeight = '0';
        infoBox.style.padding = '0 10px';
      } else {
        infoBox.style.maxHeight = '200px';  // fixed max height
        infoBox.style.padding = '10px';
      }
      e.stopPropagation();
    });

    // Close info box if clicking outside
    document.addEventListener('click', (e) => {
      if (!infoBox.contains(e.target) && e.target !== infoBtn) {
        infoBox.style.maxHeight = '0';
        infoBox.style.padding = '0 10px';
      }
    });

    // Create invert colors button
    const invertBtn = document.createElement('button');
    invertBtn.textContent = 'Invert';
    invertBtn.style.marginLeft = '6px';       // spacing from previous button
    invertBtn.style.padding = '5px 10px';
    invertBtn.style.alignSelf = 'flex-start';
    invertBtn.style.color = 'black';
    styleButton(invertBtn);
    topBtnContainer.appendChild(invertBtn);

    // Track state, restore from localStorage
    let isInverted = localStorage.getItem('replacementUIInverted') === 'true';

    // Function to apply inversion to popup and infoBox
    function applyInversion(state) {
      isInverted = state;
      localStorage.setItem('replacementUIInverted', state); // persist across reloads

      if (isInverted) {
        popup.style.backgroundColor = '#000';
        popup.style.color = '#fff';

        infoBox.style.backgroundColor = '#000';
        infoBox.style.color = '#fff';

        Array.from(popup.querySelectorAll('*')).forEach(el => {
          if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
            el.style.backgroundColor = '#222';
            el.style.color = '#fff';
          }
          if (el.tagName === 'BUTTON') {
            el.style.backgroundColor = '#333';
            el.style.color = '#fff';
          }
        });
      } else {
        popup.style.backgroundColor = '#fff';
        popup.style.color = '#000';

        infoBox.style.backgroundColor = '#fff';
        infoBox.style.color = '#000';

        Array.from(popup.querySelectorAll('*')).forEach(el => {
          if (!['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)) {
            el.style.backgroundColor = '';
            el.style.color = '';
          } else {
            // revert form elements and buttons to default
            if (el.tagName === 'BUTTON') {
              el.style.backgroundColor = '#eee';
              el.style.color = 'black';
            }
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
              el.style.backgroundColor = '#fff';
              el.style.color = '#000';
            }
          }
        });
      }
    }

    // Apply last saved state when popup opens
    applyInversion(isInverted);

    // Toggle inversion on click
    invertBtn.addEventListener('click', () => {
      applyInversion(!isInverted);
    });
    // Toggle inversion on click
    invertBtn.addEventListener('click', () => {
      applyInversion(!isInverted);
    });
    // === Show/Hide Notes Button ===
    const notesToggleBtn = document.createElement('button');
    notesToggleBtn.textContent = 'Show Note'; // initial text
    notesToggleBtn.style.marginLeft = '4px';  // spacing from previous button
      notesToggleBtn.style.padding = '2px 4px';

    // Apply consistent button style
    styleButton(notesToggleBtn);

    // Append next to Invert Colors
    topBtnContainer.appendChild(notesToggleBtn);

    const seriesId = window.seriesId || 'default-series';
    const shownotesRaw = localStorage.getItem('shownotes') || '';
    const shownotesSet = new Set(shownotesRaw.split(',').filter(Boolean));
    let notesInitiallyVisible = shownotesSet.has(seriesId);

    // Helper: show/hide ✎ only for this series
    function updatePencils(show) {
      document.querySelectorAll('span.text-patch.system_term[data-note]').forEach(span => {
        const btn = span.nextElementSibling;
        if (!btn || btn.textContent.trim() !== '✎') return;

        const noteSeries = span.dataset.series || 'default-series';
        if (noteSeries !== seriesId) return;

        btn.style.display = show ? 'inline-block' : 'none';
      });
    }

    // Initialize visibility
    updatePencils(notesInitiallyVisible);
    notesToggleBtn.textContent = notesInitiallyVisible ? 'Hide Note' : 'Show Note';

    // Click handler
    notesToggleBtn.addEventListener('click', () => {
      const showing = notesToggleBtn.textContent === 'Hide Note';
      const newShow = !showing;

      updatePencils(newShow);
      notesToggleBtn.textContent = newShow ? 'Hide Note' : 'Show Note';

      if (newShow) shownotesSet.add(seriesId);
      else shownotesSet.delete(seriesId);

      localStorage.setItem('shownotes', Array.from(shownotesSet).join(','));
    });

    // Participate in inversion
    function applyInversion(state) {
      isInverted = state;
      localStorage.setItem('replacementUIInverted', state);

      const color = isInverted ? '#fff' : '#000';
      const bg = isInverted ? '#333' : '#eee';

      Array.from(topBtnContainer.querySelectorAll('button')).forEach(btn => {
        btn.style.color = color;
        btn.style.backgroundColor = bg;
      });

      popup.style.backgroundColor = isInverted ? '#000' : '#fff';
      popup.style.color = color;
      infoBox.style.backgroundColor = isInverted ? '#000' : '#fff';
      infoBox.style.color = color;
    }

    // Apply last saved state
    applyInversion(isInverted);

    // Append button next to Invert Colors
    topBtnContainer.appendChild(notesToggleBtn);



    const rulesContainer = document.createElement('div');
    rulesContainer.style.display = 'flex';
    rulesContainer.style.flexWrap = 'wrap';
    rulesContainer.style.gap = '10px';
    rulesContainer.style.alignItems = 'center';
    rulesContainer.style.marginBottom = '10px';

    // Current flags state for the checkboxes
    const currentFlags = {
      ignoreCapital: false,
      startOfSentence: false,
      allInstances: false,
      preserveFirstCapital: false,
      global: false,
      noTrailingSpace: false,
      // New dialogue flags
      insideDialogueOnly: false,
      outsideDialogueOnly: false,
    };

    // Helper to create checkbox + label
    function createCheckbox(flagKey, labelText) {
      const label = document.createElement('label');
      label.style.userSelect = 'none';
      label.style.fontSize = '13px';
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '4px';
      label.style.whiteSpace = 'nowrap';
      label.style.flex = '0 1 auto'; // shrink if needed, don't force 100%

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = currentFlags[flagKey];
      input.style.cursor = 'pointer';

      input.addEventListener('change', () => {
        currentFlags[flagKey] = input.checked;
        // If global toggled, optionally do something like disable series input if you have one
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(labelText));
      return label;
    }

    rulesContainer.appendChild(createCheckbox('ignoreCapital', 'Ignore Capital'));
    rulesContainer.appendChild(createCheckbox('startOfSentence', 'Start of Sentence'));
    rulesContainer.appendChild(createCheckbox('allInstances', 'Fuzzy Match'));
    rulesContainer.appendChild(createCheckbox('preserveFirstCapital', 'Preserve Capital'));
    rulesContainer.appendChild(createCheckbox('global', 'Global'));
    rulesContainer.appendChild(createCheckbox('noTrailingSpace', 'No Trailing Space'));
    rulesContainer.appendChild(createCheckbox('insideDialogueOnly', 'Edit Inside Dialogue'));
    rulesContainer.appendChild(createCheckbox('outsideDialogueOnly', 'Edit Outside Dialogue'));


    popup.appendChild(rulesContainer);

      // Container that will hold search, filter, and list
      const listUIContainer = document.createElement('div');
      listUIContainer.style.display = 'none'; // hidden by default
      popup.appendChild(listUIContainer);

      // Search input
      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'Search terms...';
      searchInput.style.width = '100%';
      searchInput.style.marginBottom = '10px';
      listUIContainer.appendChild(searchInput);

      // Filter select
      const toggleFilter = document.createElement('select');
      ['Current Series', 'Global + Others', 'All'].forEach(optText => {
        const option = document.createElement('option');
        option.textContent = optText;
        toggleFilter.appendChild(option);
      });
      toggleFilter.style.width = '100%';
      toggleFilter.style.marginBottom = '10px';
      listUIContainer.appendChild(toggleFilter);

      // Buttons container
      const btnContainer = document.createElement('div');
      btnContainer.style.marginBottom = '10px';
      btnContainer.style.textAlign = 'right';

      const exportBtn = document.createElement('button');
      exportBtn.textContent = 'Export';
      styleButton(exportBtn);
      btnContainer.appendChild(exportBtn);
      exportBtn.style.marginRight = '4px';
      exportBtn.style.padding = '2px 4px';


      const importBtn = document.createElement('button');
      importBtn.textContent = 'Import';
      styleButton(importBtn);
      importBtn.style.marginLeft = '4px';
      btnContainer.appendChild(importBtn);
      importBtn.style.padding = '2px 4px';

    // --- Create current-series-only buttons ---
    const exportCurrentBtn = document.createElement('button');
    exportCurrentBtn.textContent = 'Export Current';
    styleButton(exportCurrentBtn);
    exportCurrentBtn.style.marginRight = '4px'; // spacing to the right
    exportCurrentBtn.style.padding = '2px 4px';


    const importCurrentBtn = document.createElement('button');
    importCurrentBtn.textContent = 'Import Current';
    styleButton(importCurrentBtn);
    importCurrentBtn.style.marginRight = '4px'; // spacing to the right
    importCurrentBtn.style.padding = '2px 4px';


    // --- Append current-series buttons to the existing container ---
    // Ensure they appear to the left of the original buttons
    btnContainer.insertBefore(exportCurrentBtn, exportBtn);
    btnContainer.insertBefore(importCurrentBtn, exportBtn);

    // --- Event listeners for current-series buttons ---
    exportCurrentBtn.addEventListener('click', function() {
      const seriesId = getCurrentSeriesId();
      if (!seriesId) {
        alert('No current series selected!');
        return;
      }

      // Only export entries whose series matches current series ID
      const exportData = [];
      for (const key in data) {
        (data[key] || []).forEach(entry => {
          if (entry.series === seriesId) {
            exportData.push(entry);
          }
        });
      }

      if (exportData.length === 0) {
        alert('No entries found for the current series.');
        return;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `word-replacer-series-${seriesId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    importCurrentBtn.addEventListener('click', function() {
      const seriesId = getCurrentSeriesId();
      if (!seriesId) {
        alert('No current series selected!');
        return;
      }

      const seriesKey = `series-${seriesId}`;
      if (!data[seriesKey]) data[seriesKey] = [];

      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      inputFile.accept = '.json,.txt';

      inputFile.addEventListener('change', (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (!Array.isArray(parsed)) {
              alert('Invalid format: must be an array of replacement entries.');
              return;
            }

            // Assign all imported entries to current series
            parsed.forEach(entry => {
              if (!entry.from || !entry.to) return;
              data[seriesKey].push({
                ...entry,
                series: seriesId,   // force current series
                enabled: true,
              });
            });

            saveData(data);
            renderList();
            replaceTextInChapter();
          } catch (err) {
            alert('Import failed: ' + err.message);
          }
        };

        reader.readAsText(file);
      });

      inputFile.click();
    });


      listUIContainer.appendChild(btnContainer);

      // List container
      const listContainer = document.createElement('div');
      listContainer.style.maxHeight = '260px';
      listContainer.style.overflowY = 'auto';
      listContainer.style.borderTop = '1px solid #ddd';
      listContainer.style.paddingTop = '8px';
      listUIContainer.appendChild(listContainer);

      // Style buttons helper
      function styleButton(btn) {
        btn.style.padding = '5px 12px';
        btn.style.fontSize = '13px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #888';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#eee';
        btn.style.userSelect = 'none';
      }
    toggleListBtn.addEventListener('click', () => {
      const isShowing = listUIContainer.style.display !== 'none';

      if (!isShowing) {
        // Show the list, hide the rules
        listUIContainer.style.display = 'block';
        rulesContainer.style.display = 'none';
        toggleListBtn.textContent = 'Hide List';

        renderList(); // refresh list when showing
      } else {
        // Hide the list, show the rules
        listUIContainer.style.display = 'none';
        rulesContainer.style.display = 'flex';
        toggleListBtn.textContent = 'Show List';
      }
    });


      // Get current series id helper
    function getCurrentSeriesId() {
      // Match new URL structure: /novel/{id}/
      const urlMatch = location.href.match(/\/novel\/(\d+)\//i);
      if (urlMatch) return urlMatch[1];

      // Fallback: check breadcrumb links
      const crumb = document.querySelector('.breadcrumb li.breadcrumb-item a[href*="/novel/"]');
      if (crumb) {
        const crumbMatch = crumb.href.match(/\/novel\/(\d+)\//i);
        if (crumbMatch) return crumbMatch[1];
      }

      return null;
    }


      // Render list of replacements
      function renderList() {
        listContainer.innerHTML = '';

        const seriesId = getCurrentSeriesId();

        let keysToShow = [];

        if (toggleFilter.value === 'Current Series') {
          if (seriesId) keysToShow = [`series-${seriesId}`];
          else keysToShow = [];
        } else if (toggleFilter.value === 'Global + Others') {
          keysToShow = Object.keys(data).filter(k => k !== `series-${seriesId}`);
        } else { // All
          keysToShow = Object.keys(data);
        }

        let allEntries = [];
        keysToShow.forEach(key => {
          if (data[key]) allEntries = allEntries.concat(data[key]);
        });

        const searchLower = searchInput.value.trim().toLowerCase();
    if (searchLower) {
      allEntries = allEntries.filter(e =>
        (e.from && e.from.toLowerCase().includes(searchLower)) ||
        (e.to && e.to.toLowerCase().includes(searchLower))
      );
    }

        if (allEntries.length === 0) {
          const emptyMsg = document.createElement('div');
          emptyMsg.textContent = 'No terms found.';
          emptyMsg.style.fontStyle = 'italic';
          listContainer.appendChild(emptyMsg);
          return;
        }

    allEntries.forEach((entry) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'flex-start'; // align top when text wraps
      row.style.justifyContent = 'space-between'; // space between left text and right controls
      row.style.marginBottom = '6px';
      row.style.width = '100%';

      // ---- Left side (text) ----
      const textContainer = document.createElement('div');
      textContainer.style.display = 'flex';
      textContainer.style.flexDirection = 'row';
      textContainer.style.flexWrap = 'wrap';
      textContainer.style.flexGrow = '1';
      textContainer.style.minWidth = '0'; // needed for wrapping

      const fromSpan = document.createElement('span');
      fromSpan.textContent = entry.from;
      fromSpan.style.cursor = 'pointer';
      fromSpan.style.userSelect = 'none';
      fromSpan.style.color = '#007bff';
      fromSpan.style.wordBreak = 'break-word';
      fromSpan.style.overflowWrap = 'anywhere';
      fromSpan.addEventListener('click', () => {
        openEditDialog(entry);
      });

      const toSpan = document.createElement('span');
      toSpan.textContent = ' → ' + entry.to;
      toSpan.style.marginLeft = '8px';
      toSpan.style.wordBreak = 'break-word';
      toSpan.style.overflowWrap = 'anywhere';

      textContainer.appendChild(fromSpan);
      textContainer.appendChild(toSpan);

      // ---- Right side (controls) ----
      const controls = document.createElement('div');
      controls.style.display = 'flex';
      controls.style.alignItems = 'center';
      controls.style.flexShrink = '0'; // don’t shrink controls
      controls.style.marginLeft = '12px';

      const enabledCheckbox = document.createElement('input');
      enabledCheckbox.type = 'checkbox';
      enabledCheckbox.checked = entry.enabled ?? true;
      enabledCheckbox.title = 'Enable / Disable this replacement';
      enabledCheckbox.style.marginRight = '8px';
      enabledCheckbox.addEventListener('change', () => {
        entry.enabled = enabledCheckbox.checked;
        saveData(data);
        replaceTextInChapter();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';
      styleButton(deleteBtn);
      deleteBtn.title = 'Delete this replacement';
      deleteBtn.addEventListener('click', () => {
        deleteEntry(entry);
      });

      controls.appendChild(enabledCheckbox);
      controls.appendChild(deleteBtn);

      // ---- Combine ----
      row.appendChild(textContainer);
      row.appendChild(controls);

      listContainer.appendChild(row);
    });
      }

        // Delete entry
        function deleteEntry(entry) {
          for (const key in data) {
            const arr = data[key];
            const idx = arr.findIndex(e => e.from === entry.from);
            if (idx >= 0) {
              arr.splice(idx, 1);
              if (arr.length === 0 && key !== 'global') {
                delete data[key];
              }
              saveData(data);
              renderList();
              replaceTextInChapter();
              break;
            }
          }
        }

        // Edit dialog popup
        function openEditDialog(entry) {
          const modalBg = document.createElement('div');
          Object.assign(modalBg.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100001,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
      backgroundColor: isInverted ? '#000' : 'white',
      color: isInverted ? '#fff' : '#000',
      padding: '20px',
      borderRadius: '8px',
      width: '320px',
      boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      fontSize: '14px',
    });

          modalBg.appendChild(modal);

          // Title
          const title = document.createElement('h3');
          title.textContent = 'Edit Replacement';
          title.style.marginTop = '0';
          modal.appendChild(title);

          // From input
          const fromLabel = document.createElement('label');
          fromLabel.textContent = 'Find: ';
          const fromInput = document.createElement('input');
          fromInput.type = 'text';
          fromInput.value = entry.from;
          fromInput.style.width = '100%';
          fromInput.required = true;
          fromLabel.appendChild(fromInput);
          modal.appendChild(fromLabel);

          modal.appendChild(document.createElement('br'));

          // To input
          const toLabel = document.createElement('label');
          toLabel.textContent = 'Replace with: ';
          const toInput = document.createElement('input');
          toInput.type = 'text';
          toInput.value = entry.to;
          toInput.style.width = '100%';
          toLabel.appendChild(toInput);
          modal.appendChild(toLabel);

          modal.appendChild(document.createElement('br'));

    	  const noteBtn = document.createElement('button');
          noteBtn.textContent = entry.note ? 'Edit Note' : 'Add Note';
          noteBtn.style.marginTop = '8px';
          noteBtn.style.display = 'block';

          modal.appendChild(noteBtn);
    noteBtn.addEventListener('click', () => openNoteModal(entry, noteBtn));


    function openNoteModal(entry, buttonRef) {
      const noteModalBg = document.createElement('div');
      Object.assign(noteModalBg.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
      });

      const noteModal = document.createElement('div');
      Object.assign(noteModal.style, {
        backgroundColor: 'black',
        color: 'black',
        padding: '20px',
        borderRadius: '8px',
        width: '280px',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
        fontSize: '14px',
      });

      noteModalBg.appendChild(noteModal);

      const noteTitle = document.createElement('h3');
      noteTitle.textContent = 'Add Note';
      noteTitle.style.marginTop = '0';
      noteModal.appendChild(noteTitle);
      noteTitle.style.color = 'white';

      const noteInput = document.createElement('textarea');
      noteInput.rows = 3;
      noteInput.maxLength = 30;
      noteInput.value = entry.note || '';
      noteInput.style.width = '100%';
      noteInput.placeholder = 'Enter a short note';
      noteModal.appendChild(noteInput);

      const noteSave = document.createElement('button');
      noteSave.textContent = 'Save';
      noteSave.style.marginRight = '10px';

      const noteCancel = document.createElement('button');
      noteCancel.textContent = 'Cancel';

      noteModal.appendChild(noteSave);
      noteModal.appendChild(noteCancel);

      document.body.appendChild(noteModalBg);

      noteSave.addEventListener('click', () => {
        entry.note = noteInput.value.trim().slice(0, 30);
        if (buttonRef) buttonRef.textContent = entry.note ? 'Edit Note' : 'Add Note';
        document.body.removeChild(noteModalBg);
      });

      noteCancel.addEventListener('click', () => {
        document.body.removeChild(noteModalBg);
      });
    }




          // Enabled checkbox
          const enabledLabel = document.createElement('label');
          const enabledInput = document.createElement('input');
          enabledInput.type = 'checkbox';
          enabledInput.checked = entry.enabled ?? true;
          enabledLabel.appendChild(enabledInput);
          enabledLabel.append(' Enabled');
          enabledLabel.style.userSelect = 'none';
          modal.appendChild(enabledLabel);

          modal.appendChild(document.createElement('br'));

          // Flags container
          const flags = [
            { key: 'ignoreCapital', label: 'Ignore Capitalization' },
            { key: 'startOfSentence', label: 'Match Whether Start of Sentence' },
            { key: 'allInstances', label: 'Fuzzy Match' },
            { key: 'preserveFirstCapital', label: 'Preserve First Capital Letter' },
            { key: 'noTrailingSpace', label: 'No Trailing Space' },
            { key: 'insideDialogueOnly', label: 'Edit Only Inside Dialogue' },
            { key: 'outsideDialogueOnly', label: 'Edit Only Outside Dialogue' },
          ];

          flags.forEach(f => {
            const flagLabel = document.createElement('label');
            const flagInput = document.createElement('input');
            flagInput.type = 'checkbox';
            flagInput.checked = entry[f.key] ?? false;
            flagLabel.appendChild(flagInput);
            flagLabel.append(' ' + f.label);
            flagLabel.style.display = 'block';
            flagLabel.style.userSelect = 'none';
            modal.appendChild(flagLabel);

            flagInput.addEventListener('change', () => {
              entry[f.key] = flagInput.checked;
            });
          });

          modal.appendChild(document.createElement('br'));

          // Series input (optional)
          const seriesLabel = document.createElement('label');
          seriesLabel.textContent = 'Series ID (empty = global): ';
          const seriesInput = document.createElement('input');
          seriesInput.type = 'text';
          seriesInput.value = entry.series || '';
          seriesInput.style.width = '100%';
          seriesLabel.appendChild(seriesInput);
          modal.appendChild(seriesLabel);

          modal.appendChild(document.createElement('br'));

          // Buttons
          const btnSave = document.createElement('button');
          btnSave.textContent = 'Save';
          btnSave.style.marginRight = '10px';

          const btnCancel = document.createElement('button');
          btnCancel.textContent = 'Cancel';

          modal.appendChild(btnSave);
          modal.appendChild(btnCancel);

          // Save handler
    btnSave.addEventListener('click', () => {
      let f = fromInput.value;
      const t = toInput.value;



      // Only trim the search word if this entry has noTrailingSpace enabled
      if (entry.noTrailingSpace) {
        f = f.trim();
      }
            // Update entry properties
            // If series changed, move to correct group
            const oldSeriesKey = entry.series ? `series-${entry.series}` : 'global';
            const newSeriesKey = seriesInput.value ? `series-${seriesInput.value}` : 'global';

            if (oldSeriesKey !== newSeriesKey) {
              // Remove from old array
              if (data[oldSeriesKey]) {
                const idx = data[oldSeriesKey].indexOf(entry);
                if (idx >= 0) data[oldSeriesKey].splice(idx, 1);
                if (data[oldSeriesKey].length === 0 && oldSeriesKey !== 'global') {
                  delete data[oldSeriesKey];
                }
              }
              // Add to new array
              if (!data[newSeriesKey]) data[newSeriesKey] = [];
              data[newSeriesKey].push(entry);
              entry.series = seriesInput.value.trim();
            }

            entry.from = f;
            entry.to = t;
            entry.enabled = enabledInput.checked;

            saveData(data);
            renderList();
            replaceTextInChapter();
            closeEditModal();
          });

          btnCancel.addEventListener('click', () => {
            closeEditModal();
          });

          function closeEditModal() {
            modalBg.remove();
          }

          document.body.appendChild(modalBg);
        }

        // Add new entry controls at bottom
        const addNewLabel = document.createElement('div');
        addNewLabel.textContent = 'Add New Replacement:';
        addNewLabel.style.marginTop = '15px';
        addNewLabel.style.fontWeight = 'bold';
        popup.appendChild(addNewLabel);

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '6px';
    inputContainer.style.marginTop = '6px';
    inputContainer.style.flexWrap = 'nowrap';  // keep inputs + button on one line
    inputContainer.style.alignItems = 'center'; // vertical alignment

    const fromInputNew = document.createElement('input');
    fromInputNew.placeholder = 'Find';
    fromInputNew.style.flex = '1';   // take available width
    fromInputNew.style.minWidth = '60px'; // prevent shrinking too much
    inputContainer.appendChild(fromInputNew);
    const toInputNew = document.createElement('input');
    toInputNew.placeholder = 'Replace with';
    toInputNew.style.flex = '1';
    toInputNew.style.minWidth = '60px';
    inputContainer.appendChild(toInputNew);
        // Autocomplete suggestion box for "Replace with"
    const replaceSuggestionBox = document.createElement('ul');
    Object.assign(replaceSuggestionBox.style, {
      position: 'absolute',
      zIndex: 9999,
      border: '1px solid #ccc',
      background: '#000',     // solid black background
      color: '#fff',          // white text
      listStyle: 'none',
      margin: 0,
      padding: 0,
      maxHeight: '120px',
      overflowY: 'auto',
      display: 'none',
      opacity: '1',           // fully opaque
    });
    inputContainer.appendChild(replaceSuggestionBox);

    // Helper to position suggestion box above the input
    function positionReplaceBox() {
      // Make it visible temporarily to measure its height
      replaceSuggestionBox.style.display = 'block';

      const rect = toInputNew.getBoundingClientRect();
      const containerRect = inputContainer.getBoundingClientRect();

      // Place the bottom of the box at the top of the input
      replaceSuggestionBox.style.left = (toInputNew.offsetLeft) + 'px';
      replaceSuggestionBox.style.top = (toInputNew.offsetTop - replaceSuggestionBox.offsetHeight) + 'px';
    }


    // Input listener
    toInputNew.addEventListener('input', () => {
      const val = toInputNew.value.trim().toLowerCase();
      replaceSuggestionBox.innerHTML = '';

      if (val.length < 2) {
        replaceSuggestionBox.style.display = 'none';
        return;
      }

      // Pull all "to" values from data across all series + global
      const allTerms = Object.values(data)
        .flat()
        .map(entry => entry.to)
        .filter((v, i, self) => v && self.indexOf(v) === i); // unique & non-empty

      const matches = allTerms.filter(term => term.toLowerCase().includes(val));

      if (!matches.length) {
        replaceSuggestionBox.style.display = 'none';
        return;
      }

    matches.forEach(term => {
      const li = document.createElement('li');
      li.textContent = term;
      li.style.padding = '4px 6px';
      li.style.cursor = 'pointer';
      li.style.background = '#000';  // default black background
      li.style.color = '#fff';       // default white text

      li.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent blur
        toInputNew.value = term;
        replaceSuggestionBox.style.display = 'none';
      });

      // Remove the previous hover effects
      li.addEventListener('mouseover', () => {
        li.style.background = '#111'; // slightly lighter black on hover
      });
      li.addEventListener('mouseout', () => {
        li.style.background = '#000'; // back to solid black
      });

      replaceSuggestionBox.appendChild(li);
    });


      positionReplaceBox();
      replaceSuggestionBox.style.display = 'block';
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!inputContainer.contains(e.target)) {
        replaceSuggestionBox.style.display = 'none';
      }
    });


        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        styleButton(addBtn);

    addBtn.addEventListener('click', () => {
    let f = fromInputNew.value;
    const t = toInputNew.value;

    // Check the actual checkbox state at creation time
    const noTrailingSpaceChecked = document.querySelector('#noTrailingSpaceCheckboxId')?.checked;
    if (noTrailingSpaceChecked) {
      f = f.trim();
    }

      if (!f) {
        alert('Find term cannot be empty');
        return;
      }

      // Use global checkbox to decide seriesId: empty means global
      const seriesId = currentFlags.global ? '' : getCurrentSeriesId();
      const seriesKey = seriesId ? `series-${seriesId}` : 'global';

      if (!data[seriesKey]) data[seriesKey] = [];

      // Avoid duplicates in that series/global bucket
      if (data[seriesKey].some(e => e.from.toLowerCase() === f.toLowerCase())) {
        alert('This find term already exists in this series/global.');
        return;
      }

    data[seriesKey].push({
      from: f,
      to: t,
      note: '', // <-- new
      enabled: true,
      ignoreCapital: currentFlags.ignoreCapital,
      startOfSentence: currentFlags.startOfSentence,
      allInstances: currentFlags.allInstances,
      preserveFirstCapital: currentFlags.preserveFirstCapital,
      series: seriesId || '',
      noTrailingSpace: currentFlags.noTrailingSpace,
      insideDialogueOnly: currentFlags.insideDialogueOnly,
      outsideDialogueOnly: currentFlags.outsideDialogueOnly,
    });

      saveData(data);
      fromInputNew.value = '';
      toInputNew.value = '';
      renderList();
      replaceTextInChapter();
    });


        inputContainer.appendChild(fromInputNew);
        inputContainer.appendChild(toInputNew);
        inputContainer.appendChild(addBtn);
        popup.appendChild(inputContainer);

        // Export button
        exportBtn.addEventListener('click', () => {
          const dataStr = JSON.stringify(data, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'word-replacer-data.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          URL.revokeObjectURL(url);
        });

        // Import button
        importBtn.addEventListener('click', () => {
          const inputFile = document.createElement('input');
          inputFile.type = 'file';
          inputFile.accept = '.json,.txt';

          inputFile.addEventListener('change', (e) => {
            if (!e.target.files.length) return;
            const file = e.target.files[0];
            const reader = new FileReader();

    function importData(parsed) {
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Assume full structured data (keys like 'global', 'series-...')
        // Merge imported data with existing data (append pairs)
        for (const key in parsed) {
          if (!data[key]) data[key] = [];
          // Append new entries (avoid duplicates if needed)
          parsed[key].forEach(newEntry => data[key].push(newEntry));
        }
      } else if (Array.isArray(parsed)) {
        // Array of pairs (old simple format)
        if (!data.global) data.global = [];
        const newPairs = parsed.map(pair => {
          if (!Array.isArray(pair) || pair.length < 2) return null;
          return {
            from: pair[0],
            to: pair[1],
            enabled: true,
            startOfSentence: false,
            ignoreCapital: false,
            allInstances: false,
            preserveFirstCapital: false,
            global: true,
            seriesId: ''
          };
        }).filter(Boolean);
        data.global.push(...newPairs);
      } else {
        alert('Import failed: unsupported format.');
        return;
      }
      saveData(data);
      renderList();
      replaceTextInChapter();
    }

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        importData(parsed);
        alert('Import successful!');
      } catch (err) {
        alert('Invalid JSON: ' + err.message);
      }
    };
            reader.readAsText(file);
          });

          inputFile.click();
        });

        // Search and filter event handlers
        searchInput.addEventListener('input', renderList);
        toggleFilter.addEventListener('change', renderList);

        renderList();

        document.body.appendChild(popup);
      }

    })();






