// ==UserScript==
// @name        Auto-Save Draft for altcoinstalks.com
// @description Auto-Saves your post drafts on altcoinstalks.com
// @match       https://www.altcoinstalks.com/index.php?action=post*
// @grant       none
// @version     1.1
// @author      TryNinja
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/554141/Auto-Save%20Draft%20for%20altcoinstalkscom.user.js
// @updateURL https://update.greasyfork.org/scripts/554141/Auto-Save%20Draft%20for%20altcoinstalkscom.meta.js
// ==/UserScript==
 
// TIP: To disable the auto draft saving every X seconds (only preview manual enabled), set INTERVAL_SECONDS = Infinity;

const INTERVAL_SECONDS = 60;
const MAX_DRAFT_HISTORY = 10;
 
let initialMessage = getCurrentMessage();
let lastModifiedMessage;
let draftIndicatorElement;
 
function currentTimeUTC() {
  const date = new Date();
 
  const hourUTC = date.getUTCHours();
  const minuteUTC = date.getUTCMinutes();
  const secondUTC = date.getUTCSeconds();
  return `${hourUTC.toString().padStart(2, '0')}:${minuteUTC.toString().padStart(2, '0')}:${secondUTC.toString().padStart(2, '0')} UTC`;
}
 
function textToEntities(text) {
  let entities = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 127) entities += "&#" + text.charCodeAt(i) + ";";
    else entities += text.charAt(i);
  }
  return entities;
}
 
function insertDraftStatusIndicator() {
  const messageArea = document.querySelector("textarea[name=message]");
  const indicatorElement = document.createElement("p");
  indicatorElement.id = "draftIndicator";
  indicatorElement.textContent = "Auto-Save draft is activated!";
  messageArea.after(indicatorElement);
  draftIndicatorElement = document.querySelector('p[id=draftIndicator]');
  
  const historyButton = document.createElement("button");
  historyButton.id = "draftHistoryButton";
  historyButton.textContent = "📋 Drafts";
  historyButton.type = "button";
  historyButton.style.cssText = `
    margin-left: 10px;
    padding: 2px;
    font: 95%/115% verdana, Helvetica, sans-serif;
    color: #000;
    background: #cde7ff;
    border: 1px solid #aaa;
    cursor: pointer;
    font-weight: normal;
  `;
  historyButton.addEventListener('click', toggleDraftHistory);
  draftIndicatorElement.after(historyButton);
}
 
function addEventListenerToPreviewButton() {
  const previewButton = document.querySelector('input[name=preview]');
  if (!previewButton) return;
  previewButton.addEventListener('click', function() {
    const currentMessage = getCurrentMessage();
    lastModifiedMessage = currentMessage;
    draftIndicatorElement.style = "color: green;";
    draftIndicatorElement.textContent = `Draft saved manually @ ${currentTimeUTC()}`;
    saveDraftToHistory(currentMessage);
  });
}
 
function getCurrentMessage() {
  const message = document.querySelector("textarea[name=message]").value;
  return textToEntities(message.replace(/&#/g, "&#38;#")).replace(/\+/g, "%2B");
}

function toggleDraftHistory() {
  let historyContainer = document.getElementById("draftHistoryContainer");
  
  if (historyContainer) {
    historyContainer.remove();
    return;
  }
  
  historyContainer = document.createElement("div");
  historyContainer.id = "draftHistoryContainer";
  historyContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 20px;
    width: 80%;
    min-height: 40vh;
    max-width: 80%;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  `;
  
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  `;
  
  const title = document.createElement("h3");
  title.textContent = "📋 Draft History";
  title.style.margin = "0";
  
  const closeButton = document.createElement("button");
  closeButton.textContent = "✖ Close";
  closeButton.type = "button";
  closeButton.style.cssText = `
    padding: 2px;
    font: 95%/115% verdana, Helvetica, sans-serif;
    color: #000;
    background: #cde7ff;
    border: 1px solid #aaa;
    cursor: pointer;
    font-weight: normal;
  `;
  closeButton.addEventListener('click', () => historyContainer.remove());
  
  header.appendChild(title);
  header.appendChild(closeButton);
  historyContainer.appendChild(header);
  
  let draftHistory = [];
  try {
    const storedHistory = localStorage.getItem("draftHistory");
    if (storedHistory) {
      draftHistory = JSON.parse(storedHistory);
    }
  } catch (e) {
    console.error("Error loading history:", e);
  }
  
  if (draftHistory.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No drafts saved yet.";
    emptyMessage.style.cssText = "color: #666; font-style: italic;";
    historyContainer.appendChild(emptyMessage);
  } else {
    draftHistory.forEach((draft, index) => {
      const draftItem = document.createElement("div");
      draftItem.style.cssText = `
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
        background: #f9f9f9;
      `;
      
      const draftHeader = document.createElement("div");
      draftHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      `;
      
      const draftInfo = document.createElement("div");
      draftInfo.innerHTML = `
        <strong>Draft #${index + 1}</strong><br>
        <small style="color: #666;">Saved at: ${draft.savedAt} (${new Date(draft.timestamp).toLocaleDateString('pt-BR')})</small>
      `;
      
      const loadButton = document.createElement("button");
      loadButton.textContent = "📥 Load";
      loadButton.type = "button";
      loadButton.style.cssText = `
        padding: 2px;
        font: 95%/115% verdana, Helvetica, sans-serif;
        color: #000;
        background: #cde7ff;
        border: 1px solid #aaa;
        cursor: pointer;
        font-weight: normal;
      `;
      loadButton.addEventListener('click', () => {
        loadDraft(draft.message);
        historyContainer.remove();
      });
      
      draftHeader.appendChild(draftInfo);
      draftHeader.appendChild(loadButton);
      
      const previewTextarea = document.createElement("textarea");
      previewTextarea.readOnly = true;
      previewTextarea.style.cssText = `
        width: 100%;
        min-height: 100px;
        max-height: 200px;
        background: white;
        padding: 8px;
        border: 1px solid #2196F3;
        border-left: 3px solid #2196F3;
        font-size: 12px;
        color: #333;
        font-family: monospace;
        resize: vertical;
        overflow-y: auto;
        box-sizing: border-box;
      `;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = draft.message.replace(/%2B/g, '+').replace(/&#38;#/g, '&#');
      previewTextarea.value = tempDiv.textContent;
      
      draftItem.appendChild(draftHeader);
      draftItem.appendChild(previewTextarea);
      historyContainer.appendChild(draftItem);
    });
    
    const clearButton = document.createElement("button");
    clearButton.textContent = "🗑️ Clear All History";
    clearButton.type = "button";
    clearButton.style.cssText = `
      padding: 2px;
      font: 95%/115% verdana, Helvetica, sans-serif;
      color: #000;
      background: #cde7ff;
      border: 1px solid #aaa;
      cursor: pointer;
      font-weight: normal;
      margin-top: 15px;
      width: 100%;
    `;
    clearButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all draft history?')) {
        localStorage.removeItem("draftHistory");
        historyContainer.remove();
        alert('History cleared successfully!');
      }
    });
    historyContainer.appendChild(clearButton);
  }
  
  document.body.appendChild(historyContainer);
  
  setTimeout(() => {
    document.addEventListener('click', function closeOnClickOutside(e) {
      if (!historyContainer.contains(e.target) && e.target.id !== 'draftHistoryButton') {
        historyContainer.remove();
        document.removeEventListener('click', closeOnClickOutside);
      }
    });
  }, 100);
}

function loadDraft(encodedMessage) {
  const messageArea = document.querySelector("textarea[name=message]");
  if (!messageArea) {
    alert("Error: textarea not found!");
    return;
  }
  
  const decodedMessage = encodedMessage.replace(/%2B/g, '+').replace(/&#38;#/g, '&#');
  
  const action = confirm(
    "Click OK to REPLACE current content."
  );
  
  if (action) {
    messageArea.value = decodedMessage;
    initialMessage = getCurrentMessage();
    lastModifiedMessage = initialMessage;
  }
  
  draftIndicatorElement.style = "color: blue;";
  draftIndicatorElement.textContent = `Draft loaded @ ${currentTimeUTC()}`;
  
  messageArea.focus();
}

function saveDraftToHistory(message) {
  let draftHistory = [];
  try {
    const storedHistory = localStorage.getItem("draftHistory");
    if (storedHistory) {
      draftHistory = JSON.parse(storedHistory);
    }
  } catch (e) {
    console.error(e);
    draftHistory = [];
  }

  const newDraft = {
    message: message,
    timestamp: new Date().toISOString(),
    savedAt: currentTimeUTC()
  };

  draftHistory.unshift(newDraft);

  if (draftHistory.length > MAX_DRAFT_HISTORY) {
    draftHistory = draftHistory.slice(0, MAX_DRAFT_HISTORY);
  }

  try {
    localStorage.setItem("draftHistory", JSON.stringify(draftHistory));
  } catch (e) {
    console.error(e);
  }

  return draftHistory.length;
}
 
async function draft(message) {
  const formData = new FormData();
  formData.append("message", message);
  
  lastModifiedMessage = message;
  draftIndicatorElement.style = "color: green;";
  draftIndicatorElement.textContent = `Draft saved @ ${currentTimeUTC()}`;
  saveDraftToHistory(message);
}
 
(() => {
  insertDraftStatusIndicator();
  addEventListenerToPreviewButton();
 
  setInterval(() => {
    const currentMessage = getCurrentMessage();
    if (initialMessage !== currentMessage && lastModifiedMessage !== currentMessage) {
      draft(currentMessage);
    }
  }, INTERVAL_SECONDS * 1000)
 
})()