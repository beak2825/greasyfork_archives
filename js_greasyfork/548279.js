// ==UserScript==
// @name         Chicken Executor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Its just a executor.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getClipboard
// @grant        GM_xmlhttpRequest
// @license None
// @downloadURL https://update.greasyfork.org/scripts/548279/Chicken%20Executor.user.js
// @updateURL https://update.greasyfork.org/scripts/548279/Chicken%20Executor.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Global variables
  let isMinimized = false;
  let currentTab = "home";
  let scriptTabs = [{ id: "tab1", name: "Script 1", content: "" }];
  let activeScriptTab = "tab1";
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // Initialize storage
  if (!GM_getValue("scripts", null)) {
    GM_setValue("scripts", JSON.stringify([]));
  }
  if (!GM_getValue("settings", null)) {
    GM_setValue(
      "settings",
      JSON.stringify({
        theme: "dark",
        editProtection: false,
        antiScam: true,
        openaiKey: "YOUR_OPENAI_API_KEY_HERE",
        defaultSaveLocation: "local",
        autoUpdate: true,
      }),
    );
  }

  // CSS Styles
  const styles = `
        .chicken-executor {
            position: fixed;
            top: 50px;
            right: 50px;
            width: 600px;
            height: 500px;
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffffff;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .chicken-header {
            background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            border-radius: 12px 12px 0 0;
        }

        .chicken-title {
            font-weight: 600;
            font-size: 14px;
            color: white;
        }

        .chicken-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .chicken-btn {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            display: flex;            /* makes button a flex container */
           justify-content: center;  /* centers horizontally */
           align-items: center;      /* centers vertically */
           padding: 0;               /* remove default padding */
           transition: all 0.2s ease;
           line-height: normal;      /* reset line-height */
       }


        .minimize-btn { background: #fbbf24; color: #92400e; }
        .maximize-btn { background: #10b981; color: #065f46; }
        .close-btn { background: #ef4444; color: #991b1b; }

        .chicken-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .chicken-body {
            display: flex;
            height: calc(100% - 40px);
        }

        .chicken-sidebar {
            width: 150px;
            background: rgba(0, 0, 0, 0.2);
            padding: 15px 0;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-item {
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
            border-left: 3px solid transparent;
        }

        .sidebar-item:hover {
            background: rgba(255, 255, 255, 0.1);
            border-left-color: #4f46e5;
        }

        .sidebar-item.active {
            background: rgba(79, 70, 229, 0.3);
            border-left-color: #4f46e5;
        }

        .chicken-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .content-section {
            display: none;
        }

        .content-section.active {
            display: block;
        }

        .script-input {
            width: 100%;
            height: 200px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            resize: vertical;
            outline: none;
        }

        .script-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .script-tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        .script-tab {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .script-tab.active {
            background: rgba(79, 70, 229, 0.5);
            border-color: #4f46e5;
        }

        .script-tab:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .add-tab-btn {
            background: rgba(16, 185, 129, 0.3);
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 11px;
            color: #10b981;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .add-tab-btn:hover {
            background: rgba(16, 185, 129, 0.5);
        }

        .executor-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .exec-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .exec-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .exec-btn.secondary {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }

        .exec-btn.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .search-input {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            color: black;
            font-size: 13px;
            margin-bottom: 15px;
            outline: none;
        }

        .script-cards {
            display: grid;
            gap: 15px;
            max-height: 300px;
            overflow-y: auto;
        }

        .script-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .script-card:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .card-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #4f46e5;
        }

        .card-description {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }

        .cloud-results {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            max-height: 350px;
            overflow-y: auto;
        }

        .cloud-item {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cloud-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .settings-group {
            margin-bottom: 20px;
        }

        .settings-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 13px;
        }

        .settings-input, .settings-select {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 10px;
            color: white;
            font-size: 12px;
            outline: none;
        }

        .settings-checkbox {
            margin-right: 8px;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000000;
            font-size: 13px;
            font-weight: 600;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }

        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }

        .minimized-icon {
            position: fixed;
            width: 50px;
            height: 50px;
            background: url('https://i.imgur.com/WL8OlOU.png') center/cover;
            border: 3px solid #4f46e5;
            border-radius: 12px;
            cursor: pointer;
            z-index: 999999;
            transition: all 0.2s ease;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .minimized-icon:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 35px rgba(79, 70, 229, 0.4);
        }

        .donation-content {
            text-align: center;
            padding: 40px 20px;
        }

        .donation-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .donation-text {
            margin-bottom: 25px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }

        .paypal-btn {
            background: linear-gradient(135deg, #0070ba 0%, #003087 100%);
            border: none;
            border-radius: 8px;
            padding: 15px 30px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-block;
        }

        .paypal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 112, 186, 0.4);
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(79, 70, 229, 0.6);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(79, 70, 229, 0.8);
        }
    `;

  // Create and inject styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Notification system
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    if (type === "error") {
      notification.style.background =
        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Create main executor panel
  function createExecutorPanel() {
    const panel = document.createElement("div");
    panel.className = "chicken-executor";
    panel.innerHTML = `
            <div class="chicken-header">
                <div class="chicken-title">Chicken Executor</div>
                <div class="chicken-controls">
                    <button class="chicken-btn minimize-btn" title="Minimize">−</button>
                    <button class="chicken-btn maximize-btn" title="Maximize">□</button>
                    <button class="chicken-btn close-btn" title="Close">×</button>
                </div>
            </div>
            <div class="chicken-body">
                <div class="chicken-sidebar">
                    <div class="sidebar-item active" data-tab="home">🏠 Home</div>
                    <div class="sidebar-item" data-tab="main">⚡ Main</div>
                    <div class="sidebar-item" data-tab="cloud">☁ Cloud</div>
                    <div class="sidebar-item" data-tab="settings">⚙ Settings</div>
                    <div class="sidebar-item" data-tab="files">📁 Files</div>
                    <div class="sidebar-item" data-tab="donation">💝 Donation</div>
                </div>
                <div class="chicken-content">
                    ${createHomeContent()}
                    ${createMainContent()}
                    ${createCloudContent()}
                    ${createSettingsContent()}
                    ${createFilesContent()}
                    ${createDonationContent()}
                </div>
            </div>
        `;

    document.body.appendChild(panel);
    return panel;
  }

  // Create content sections
  function createHomeContent() {
    return `
            <div class="content-section active" id="home-content">
                <h2>Script Store</h2>
                <input type="text" class="search-input" placeholder="Search saved scripts..." id="script-search">
                <div class="script-cards" id="saved-scripts"></div>
            </div>
        `;
  }

  function createMainContent() {
    return `
            <div class="content-section" id="main-content">
                <h2>Live JS Executor</h2>
                <div class="script-tabs" id="script-tabs"></div>
                <textarea class="script-input" placeholder="Enter Script Here..." id="script-editor"></textarea>
                <div class="executor-buttons">
                    <button class="exec-btn" id="execute-btn">Execute</button>
                    <button class="exec-btn secondary" id="execute-clipboard-btn">Execute Clipboard</button>
                    <button class="exec-btn success" id="save-script-btn">Save Script</button>
                </div>
            </div>
        `;
  }

  function createCloudContent() {
    return `
            <div class="content-section" id="cloud-content">
                <h2>GreasyFork Scripts</h2>
                <input type="text" class="search-input" placeholder="Search GreasyFork..." id="greasyfork-search">
                <div class="cloud-results" id="cloud-results"></div>
            </div>
        `;
  }

  function createSettingsContent() {
    const settings = JSON.parse(GM_getValue("settings"));
    return `
            <div class="content-section" id="settings-content">
                <h2>Settings</h2>
                <div class="settings-group">
                    <label class="settings-label">Theme</label>
                    <select class="settings-select" id="theme-select">
                        <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Dark</option>
                        <option value="light" ${settings.theme === "light" ? "selected" : ""}>Light</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label class="settings-label">
                        <input type="checkbox" class="settings-checkbox" id="edit-protection" ${settings.editProtection ? "checked" : ""}>
                        Protection
                    </label>
                </div>
                <div class="settings-group">
                    <label class="settings-label">
                        <input type="checkbox" class="settings-checkbox" id="anti-scam" ${settings.antiScam ? "checked" : ""}>
                        Anti-Scam Protection
                    </label>
                </div>
                <div class="settings-group">
                    <label class="settings-label">OpenAI API Key</label>
                    <input type="password" class="settings-input" id="openai-key" value="${settings.openaiKey}" placeholder="YOUR_OPENAI_API_KEY_HERE">
                </div>
                <div class="settings-group">
                    <label class="settings-label">Default Save Location</label>
                    <select class="settings-select" id="save-location">
                        <option value="local" ${settings.defaultSaveLocation === "local" ? "selected" : ""}>Local Storage</option>
                        <option value="cloud" ${settings.defaultSaveLocation === "cloud" ? "selected" : ""}>Cloud Sync</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label class="settings-label">
                        <input type="checkbox" class="settings-checkbox" id="auto-update" ${settings.autoUpdate ? "checked" : ""}>
                        Auto Update Scripts
                    </label>
                </div>
            </div>
        `;
  }

  function createFilesContent() {
    return `
            <div class="content-section" id="files-content">
                <h2>File Explorer</h2>
                <div class="script-cards" id="file-explorer"></div>
            </div>
        `;
  }

  function createDonationContent() {
    return `
            <div class="content-section" id="donation-content">
                <div class="donation-content">
                    <h2 class="donation-title">Support Development</h2>
                    <p class="donation-text">
                        If you enjoy using Chicken Executor and would like to support its development,
                        consider making a donation. Your support helps keep this project alive and enables
                        new features and improvements.
                    </p>
                    <a href="https://www.paypal.com/ncp/payment/W2GMQQULX79U2" target="_blank" class="paypal-btn">
                        💳 Donate via PayPal
                    </a>
                </div>
            </div>
        `;
  }

  // Create minimized icon
  function createMinimizedIcon() {
    const icon = document.createElement("div");
    icon.className = "minimized-icon";
    icon.title = "Chicken Executor";
    icon.style.top = "50px";
    icon.style.right = "50px";

    // Make icon draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    icon.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Left click only
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        // Prevent text selection during drag
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // Keep icon within viewport bounds
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 150;

        icon.style.left = Math.max(0, Math.min(x, maxX)) + "px";
        icon.style.top = Math.max(0, Math.min(y, maxY)) + "px";
        icon.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (isDragging) {
        isDragging = false;

        // Check if this was a click (minimal movement)
        const rect = icon.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (
          Math.abs(clickX - dragOffset.x) < 5 &&
          Math.abs(clickY - dragOffset.y) < 5
        ) {
          // This was a click, restore the panel
          restorePanel();
        }
      }
    });

    document.body.appendChild(icon);
    return icon;
  }

  // Panel management functions
  function minimizePanel() {
    const panel = document.querySelector(".chicken-executor");
    if (panel) {
      panel.style.display = "none";
      isMinimized = true;
      createMinimizedIcon();
    }
  }

  function restorePanel() {
    const panel = document.querySelector(".chicken-executor");
    const icon = document.querySelector(".minimized-icon");

    if (panel && icon) {
      panel.style.display = "block";
      icon.remove();
      isMinimized = false;
    }
  }

  function closePanel() {
    const panel = document.querySelector(".chicken-executor");
    const icon = document.querySelector(".minimized-icon");

    if (panel) panel.remove();
    if (icon) icon.remove();
  }

  // Tab management
  function switchTab(tabName) {
    // Update sidebar
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update content
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(`${tabName}-content`).classList.add("active");

    currentTab = tabName;

    // Load content based on tab
    if (tabName === "home") {
      loadSavedScripts();
    } else if (tabName === "main") {
      updateScriptTabs();
    } else if (tabName === "files") {
      loadFileExplorer();
    }
  }

  // Script tab management
  function updateScriptTabs() {
    const tabsContainer = document.getElementById("script-tabs");
    tabsContainer.innerHTML = "";

    scriptTabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.className = `script-tab ${tab.id === activeScriptTab ? "active" : ""}`;
      tabElement.textContent = tab.name;
      tabElement.onclick = () => switchScriptTab(tab.id);
      tabElement.ondblclick = () => renameScriptTab(tab.id);
      tabsContainer.appendChild(tabElement);
    });

    const addButton = document.createElement("div");
    addButton.className = "add-tab-btn";
    addButton.textContent = "+";
    addButton.onclick = addScriptTab;
    tabsContainer.appendChild(addButton);

    // Update editor content
    const activeTab = scriptTabs.find((tab) => tab.id === activeScriptTab);
    if (activeTab) {
      document.getElementById("script-editor").value = activeTab.content;
    }
  }

  function switchScriptTab(tabId) {
    // Save current content
    const currentTab = scriptTabs.find((tab) => tab.id === activeScriptTab);
    if (currentTab) {
      currentTab.content = document.getElementById("script-editor").value;
    }

    activeScriptTab = tabId;
    updateScriptTabs();
  }

  function addScriptTab() {
    const newId = "tab" + (scriptTabs.length + 1);
    const newTab = {
      id: newId,
      name: `Script ${scriptTabs.length + 1}`,
      content: "",
    };
    scriptTabs.push(newTab);
    activeScriptTab = newId;
    updateScriptTabs();
    showNotification("New tab created");
  }

  function renameScriptTab(tabId) {
    const tab = scriptTabs.find((t) => t.id === tabId);
    if (tab) {
      const newName = prompt("Enter new tab name:", tab.name);
      if (newName && newName.trim()) {
        tab.name = newName.trim();
        updateScriptTabs();
        showNotification("Tab renamed");
      }
    }
  }

  // Script execution
  function executeScript(code) {
    try {
      // Basic anti-scam check
      const settings = JSON.parse(GM_getValue("settings"));
      if (settings.antiScam) {
        const suspiciousPatterns = [
          /document\.cookie/i,
          /localStorage\./i,
          /sessionStorage\./i,
          /\.send\(/i,
          /fetch\(/i,
          /XMLHttpRequest/i,
        ];

        if (suspiciousPatterns.some((pattern) => pattern.test(code))) {
          if (
            !confirm(
              "This script contains potentially suspicious code. Are you sure you want to execute it?",
            )
          ) {
            return;
          }
        }
      }

      // Execute the code
      eval(code);
      showNotification("Script executed successfully");
    } catch (error) {
      showNotification(`Execution error: ${error.message}`, "error");
      console.error("Script execution error:", error);
    }
  }

  // Save script
  function saveScript() {
    const code = document.getElementById("script-editor").value;
    if (!code.trim()) {
      showNotification("No script to save", "error");
      return;
    }

    const name = prompt("Enter script name:");
    if (!name || !name.trim()) return;

    const scripts = JSON.parse(GM_getValue("scripts"));
    const newScript = {
      id: Date.now().toString(),
      name: name.trim(),
      code: code,
      created: new Date().toISOString(),
    };

    scripts.push(newScript);
    GM_setValue("scripts", JSON.stringify(scripts));
    showNotification("Script saved successfully");

    if (currentTab === "home") {
      loadSavedScripts();
    }
  }

  // Load saved scripts
  function loadSavedScripts() {
    const scripts = JSON.parse(GM_getValue("scripts"));
    const container = document.getElementById("saved-scripts");
    container.innerHTML = "";

    scripts.forEach((script) => {
      const card = document.createElement("div");
      card.className = "script-card";

      // Card inner HTML with delete button
      card.innerHTML = `
            <div class="card-title">${script.name}</div>
            <div class="card-description">Created: ${new Date(script.created).toLocaleDateString()}</div>
            <button class="exec-btn secondary delete-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 11px;">Delete</button>
        `;

      // Load script on card click (except delete button)
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) return; // ignore clicks on delete button
        switchTab("main");
        const activeTab = scriptTabs.find((tab) => tab.id === activeScriptTab);
        if (activeTab) {
          activeTab.content = script.code;
          document.getElementById("script-editor").value = script.code;
        }
        showNotification("Script loaded");
      });

      // Delete button functionality
      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering card click
        if (confirm(`Are you sure you want to delete "${script.name}"?`)) {
          const updatedScripts = scripts.filter((s) => s.id !== script.id);
          GM_setValue("scripts", JSON.stringify(updatedScripts));
          showNotification("Script deleted");
          loadSavedScripts(); // refresh list
        }
      });

      container.appendChild(card);
    });

    if (scripts.length === 0) {
      container.innerHTML =
        '<div style="text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">No saved scripts</div>';
    }
  }

  // --- GreasyFork search ---
  async function searchGreasyFork(query) {
    if (!query.trim()) return;
    const resultsContainer = document.getElementById("cloud-results");
    resultsContainer.innerHTML =
      '<div style="text-align:center; padding:20px;">Searching...</div>';

    const searchUrl = `https://greasyfork.org/en/scripts?q=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(searchUrl);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const scriptElements = doc.querySelectorAll("li[data-script-id]");

      resultsContainer.innerHTML = "";
      if (!scriptElements.length) {
        resultsContainer.innerHTML =
          '<div style="text-align:center; padding:20px; color: rgba(255,255,255,0.5);">No scripts found</div>';
        return;
      }

      scriptElements.forEach((el) => {
        const id = el.dataset.scriptId;
        const name = el.dataset.scriptName || "Unnamed Script";
        const desc =
          el.querySelector(".script-description")?.innerText ||
          "No description";
        const author =
          el.querySelector(".script-list-author a")?.innerText || "Unknown";
        const installs =
          el
            .querySelector("dd.script-list-total-installs span")
            ?.innerText.trim() || "0";

        const href = `https://greasyfork.org/en/scripts/${id}-${name.toLowerCase().replace(/\s+/g, "-")}/code`;

        const item = document.createElement("div");
        item.className = "cloud-item";
        item.style.cssText = `
                padding: 12px;
                margin: 5px 0;
                border-radius: 8px;
                background: rgba(255,255,255,0.05);
            `;

        item.innerHTML = `
                <div style="font-weight:bold; margin-bottom:5px;">${name}</div>
                <div style="font-size:12px; color: rgba(255,255,255,0.8); margin-bottom:5px;">${desc}</div>
                <div style="font-size:11px; color: rgba(255,255,255,0.6); margin-bottom:8px;">By ${author} • ${installs} installs</div>
                <div style="display:flex; gap:10px;">
                    <button class="exec-btn" data-href="${href}">Install</button>
                    <button class="exec-btn secondary" data-id="${id}" data-name="${name}">View Code</button>
                </div>
            `;

        // Install: inject code, create tab, save, switch sidebar to main
        item.querySelector("button.exec-btn").onclick = async (e) => {
          const href = e.target.dataset.href;
          const code = await fetchGreasyForkCode(href);
          const editor = document.getElementById("script-editor");
          editor.value = code;

          addScriptTab(name);

          const saveBtn = document.getElementById("save-script-btn");
          if (saveBtn) saveBtn.click();

          // Switch sidebar to main tab
          document
            .querySelectorAll(".sidebar-item")
            .forEach((s) => s.classList.remove("active"));
          const mainSidebar = document.querySelector(
            '.sidebar-item[data-tab="main"]',
          );
          if (mainSidebar) mainSidebar.classList.add("active");
          showTab("main-content");

          editor.scrollIntoView({ behavior: "smooth" });
        };

        // View Code: inject into main editor, switch sidebar to main
        item.querySelector("button.secondary").onclick = async (e) => {
          const id = e.target.dataset.id;
          const name = e.target.dataset.name;
          const code = await fetchGreasyForkCode(
            `https://greasyfork.org/en/scripts/${id}-${name.toLowerCase().replace(/\s+/g, "-")}/code`,
          );
          const editor = document.getElementById("script-editor");
          editor.value = code;

          // Switch sidebar to main tab
          document
            .querySelectorAll(".sidebar-item")
            .forEach((s) => s.classList.remove("active"));
          const mainSidebar = document.querySelector(
            '.sidebar-item[data-tab="main"]',
          );
          if (mainSidebar) mainSidebar.classList.add("active");
          showTab("main-content");

          editor.scrollIntoView({ behavior: "smooth" });
        };

        resultsContainer.appendChild(item);
      });
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML =
        '<div style="text-align:center; padding:20px; color:red;"> results</div>';
    }
  }

  // --- Utility: fetch code ---
  async function fetchGreasyForkCode(href) {
    try {
      const res = await fetch(href);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return (
        doc.querySelector(".code-container pre")?.innerText ||
        "// Code not available"
      );
    } catch (err) {
      console.error(err);
      return "// Error fetching code";
    }
  }

  // --- Utility: add script tab ---
  function addScriptTab(scriptName) {
    const tabsContainer = document.getElementById("script-tabs");
    if (!tabsContainer) return;

    tabsContainer
      .querySelectorAll(".script-tab")
      .forEach((t) => t.classList.remove("active"));

    const tab = document.createElement("div");
    tab.className = "script-tab active";
    tab.textContent = scriptName;
    tab.onclick = () =>
      document
        .getElementById("script-editor")
        .scrollIntoView({ behavior: "smooth" });
    tabsContainer.insertBefore(
      tab,
      tabsContainer.querySelector(".add-tab-btn"),
    );
  }

  // --- Utility: switch content ---
  function showTab(tabId) {
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === tabId);
    });
  }

  // --- Attach search input ---
  document
    .getElementById("greasyfork-search")
    ?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchGreasyFork(e.target.value);
    });

  // Load file explorer
  function loadFileExplorer() {
    const container = document.getElementById("file-explorer");
    const scripts = JSON.parse(GM_getValue("scripts"));

    container.innerHTML = "";

    // Show GM storage files
    const gmFiles = [
      {
        name: "scripts.json",
        type: "GM Storage",
        size: JSON.stringify(scripts).length + " bytes",
      },
      {
        name: "settings.json",
        type: "GM Storage",
        size: JSON.stringify(GM_getValue("settings")).length + " bytes",
      },
    ];

    [
      ...gmFiles,
      ...scripts.map((s) => ({
        name: s.name,
        type: "Saved Script",
        size: s.code.length + " chars",
      })),
    ].forEach((file) => {
      const card = document.createElement("div");
      card.className = "script-card";
      card.innerHTML = `
                <div class="card-title">📄 ${file.name}</div>
                <div class="card-description">${file.type} • ${file.size}</div>
            `;
      container.appendChild(card);
    });
  }

  // Save settings
  function saveSettings() {
    const settings = {
      theme: document.getElementById("theme-select").value,
      editProtection: document.getElementById("edit-protection").checked,
      antiScam: document.getElementById("anti-scam").checked,
      openaiKey: document.getElementById("openai-key").value,
      defaultSaveLocation: document.getElementById("save-location").value,
      autoUpdate: document.getElementById("auto-update").checked,
    };

    GM_setValue("settings", JSON.stringify(settings));
    showNotification("Settings saved");
  }

  // Initialize the executor
  function init() {
    const panel = createExecutorPanel();

    // Header button events
    panel.querySelector(".minimize-btn").onclick = minimizePanel;
    panel.querySelector(".maximize-btn").onclick = () => {
      // Toggle maximize/restore
      if (panel.style.width === "100vw") {
        panel.style.width = "600px";
        panel.style.height = "500px";
        panel.style.top = "50px";
        panel.style.left = "auto";
        panel.style.right = "50px";
        showNotification("Panel restored");
      } else {
        panel.style.width = "100vw";
        panel.style.height = "100vh";
        panel.style.top = "0";
        panel.style.left = "0";
        panel.style.right = "auto";
        showNotification("Panel maximized");
      }
    };
    panel.querySelector(".close-btn").onclick = closePanel;

    // Sidebar navigation
    panel.querySelectorAll(".sidebar-item").forEach((item) => {
      item.onclick = () => switchTab(item.dataset.tab);
    });

    // Main tab functionality
    panel.querySelector("#execute-btn").onclick = () => {
      const code = document.getElementById("script-editor").value;
      if (code.trim()) {
        executeScript(code);
      } else {
        showNotification("No script to execute", "error");
      }
    };

    panel.querySelector("#execute-clipboard-btn").onclick = async () => {
      try {
        const clipboardText = await GM_getClipboard();
        if (clipboardText && clipboardText.trim()) {
          executeScript(clipboardText);
        } else {
          showNotification("Clipboard is empty", "error");
        }
      } catch (error) {
        showNotification("Failed to read clipboard", "error");
      }
    };

    panel.querySelector("#save-script-btn").onclick = saveScript;

    // Script editor auto-save
    panel.querySelector("#script-editor").oninput = (e) => {
      const activeTab = scriptTabs.find((tab) => tab.id === activeScriptTab);
      if (activeTab) {
        activeTab.content = e.target.value;
      }
    };

    // Home tab search
    panel.querySelector("#script-search").oninput = (e) => {
      const query = e.target.value.toLowerCase();
      const cards = panel.querySelectorAll("#saved-scripts .script-card");
      cards.forEach((card) => {
        const title = card
          .querySelector(".card-title")
          .textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
      });
    };

    // Cloud search
    panel.querySelector("#greasyfork-search").onkeypress = (e) => {
      if (e.key === "Enter") {
        searchGreasyFork(e.target.value);
      }
    };

    // Settings auto-save
    const settingsInputs = panel.querySelectorAll(
      "#settings-content input, #settings-content select",
    );
    settingsInputs.forEach((input) => {
      input.onchange = saveSettings;
    });

    // Initialize content
    loadSavedScripts();
    updateScriptTabs();

    // Make panel draggable by header
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    panel.querySelector(".chicken-header").onmousedown = (e) => {
      if (e.target.classList.contains("chicken-btn")) return;

      isDragging = true;
      const rect = panel.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      e.preventDefault();
    };

    document.onmousemove = (e) => {
      if (isDragging && !isMinimized) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        panel.style.left =
          Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth)) +
          "px";
        panel.style.top =
          Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight)) +
          "px";
        panel.style.right = "auto";
      }
    };

    document.onmouseup = () => {
      isDragging = false;
    };

    // Keyboard shortcuts
    document.onkeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        if (isMinimized) {
          restorePanel();
        } else {
          minimizePanel();
        }
      }
    };

    showNotification("Chicken Executor loaded! Press Ctrl+Shift+E to toggle.");
  }

  // Wait for page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
