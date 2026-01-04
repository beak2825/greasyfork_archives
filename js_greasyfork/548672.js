// ==UserScript==
// @name         uKick — Block & Stream Tweaks for Kick
// @namespace    https://github.com/berkaygediz/uKick
// @version      1.1.4.2
// @description  All-in-one extension to block, boost, and tweak everything on Kick for a better streaming experience.
// @author       berkaygediz
// @match        https://kick.com/*
// @match        https://www.kick.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0
// @homepageURL  https://github.com/berkaygediz/uKick
// @supportURL   https://github.com/berkaygediz/uKick/issues
// @downloadURL https://update.greasyfork.org/scripts/548672/uKick%20%E2%80%94%20Block%20%20Stream%20Tweaks%20for%20Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/548672/uKick%20%E2%80%94%20Block%20%20Stream%20Tweaks%20for%20Kick.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function normalizeData(str) {
    return str?.toLowerCase().trim() || "";
  }

  // ===== Tampermonkey UserScript (GM) =====

  async function getBlockedChannels() {
    try {
      const val = await GM_getValue("blockedChannels", "[]");
      const list = JSON.parse(val);
      return list.map((x) => x.trim().toLowerCase());
    } catch {
      return [];
    }
  }

  async function saveBlockedChannels(list) {
    await GM_setValue("blockedChannels", JSON.stringify(list));
  }


  async function blockChannel(username) {
    username = normalizeData(username);
    const blocked = await getBlockedChannels();
    if (!blocked.includes(username)) {
      blocked.push(username);
      await saveBlockedChannels(blocked);
    }
  }

  async function unblockChannel(username) {
    username = normalizeData(username);
    let blocked = await getBlockedChannels();
    blocked = blocked.filter((u) => u !== username);
    await saveBlockedChannels(blocked);
  }

  // ==== Tampermonkey ==== getBlockedCategories & saveBlockedCategories

  async function getBlockedCategories() {
    try {
      const val = await GM_getValue("blockedCategories", "[]");
      const list = JSON.parse(val);
      return list.map(normalizeData);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function saveBlockedCategories(list) {
    try {
      const data = JSON.stringify(list);
      await GM_setValue("blockedCategories", data);
    } catch (err) {
      console.error(err);
    }
  }

  // ==== Tampermonkey/Violentmonkey UserScript ====

  async function blockCategory(categoryName) {
    const blocked = await getBlockedCategories();
    const normalizedCategory = normalizeData(categoryName);
    if (!blocked.includes(normalizedCategory)) {
      blocked.push(normalizedCategory);
      await GM_setValue("blockedCategories", JSON.stringify(blocked));
    }
  }

  async function processCategoryCards() {
    const blockedCategories = await getBlockedCategories();

    const blockedNormalized = blockedCategories.map((cat) =>
      normalizeData(cat).toLowerCase().trim()
    );

    document.querySelectorAll('[class*="group/card"]').forEach((card) => {
      const nameEl = card.querySelector('[data-testid^="category-"]');
      if (!nameEl) return;

      const categoryName = normalizeData(nameEl.textContent)
        .toLowerCase()
        .trim();

      if (blockedNormalized.includes(categoryName)) {
        card.style.display = "none";
        return;
      }

      if (card.querySelector(".category-block-btn")) return;

      const imageWrapper = card.querySelector(
        'a[href^="/category/"] > div.relative'
      );
      if (!imageWrapper) return;

      const btn = document.createElement("button");
      btn.textContent = "✖";
      btn.title = `Hide category: ${nameEl.textContent}`;
      btn.className = "category-block-btn";
      btn.style.cssText = `
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 14px;
      cursor: pointer;
      z-index: 9999;
    `;

      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await blockCategory(categoryName);
        card.style.display = "none";
      });

      imageWrapper.style.position = "relative";
      imageWrapper.appendChild(btn);
    });
  }

  async function removeBlockedCategoryCards() {
    const blockedCategories = await getBlockedCategories();

    document.querySelectorAll('[class*="group/card"]').forEach((card) => {
      const nameEl = card.querySelector('[data-testid^="category-"]');
      if (!nameEl) return;

      const categoryName = normalizeData(nameEl.textContent)
        .toLowerCase()
        .trim();

      const blockedNormalized = blockedCategories.map((cat) =>
        normalizeData(cat).toLowerCase().trim()
      );

      if (blockedNormalized.includes(categoryName)) {
        card.style.display = "none";
      } else {
        card.style.display = "";
      }
    });
  }

  async function removeBlockedCards() {
    const blockedChannels = (await getBlockedChannels()).map(normalizeData);
    const blockedCategories = (await getBlockedCategories?.()).map(normalizeData) || [];

    document.querySelectorAll('.group\\/card').forEach((card) => {
      let hide = false;

      const channelAnchor = card.querySelector('a[href^="/"] img.rounded-full')?.closest('a');
      if (channelAnchor) {
        const username = normalizeData(channelAnchor.getAttribute("href").slice(1));
        if (blockedChannels.includes(username)) hide = true;
      }

      // Category
      const categoryAnchor = card.querySelector('a[href^="/category/"]');
      if (categoryAnchor) {
        const rawCategoryText = categoryAnchor.querySelector("span")?.textContent || categoryAnchor.textContent;
        const categoryName = normalizeData(rawCategoryText);
        if (blockedCategories.includes(categoryName)) hide = true;
      }

      card.style.display = hide ? "none" : "";
    });

    document.querySelectorAll('div.flex.flex-row.items-center').forEach((card) => {
      const anchor = card.querySelector('a[href^="/"]:not([href^="/category/"])');
      if (!anchor) return;

      const username = normalizeData(anchor.getAttribute("href").slice(1));
      if (blockedChannels.includes(username)) {
        const outerContainer = card.closest('div.flex.w-full.shrink-0.grow-0.flex-col');
        if (outerContainer) {
          outerContainer.style.display = "none";
        } else {
          card.style.display = "none";
        }
      }
    });

    // Video player
    const usernameEl = document.getElementById("channel-username");
    if (usernameEl) {
      const currentUsername = normalizeData(usernameEl.textContent);
      const videoPlayer = document.getElementById("video-player");
      if (videoPlayer) {
        if (blockedChannels.includes(currentUsername)) {
          videoPlayer.style.display = "none";
          if (typeof videoPlayer.pause === "function") videoPlayer.pause();
        } else {
          videoPlayer.style.display = "";
        }
      }
    }
  }

  // Sidebar, recommended channels
  async function removeSidebarBlockedChannels() {
    const blockedChannels = (await getBlockedChannels()).map(normalizeData);
    const blockedCategories = (await getBlockedCategories()).map(normalizeData);

    document
      .querySelectorAll('[data-testid^="sidebar-recommended-channel-"]')
      .forEach((item) => {
        let hide = false;

        // === Channel  ===
        const anchor =
          item.querySelector('a[href^="/"]') || item.closest('a[href^="/"]');
        if (anchor) {
          const username = normalizeData(anchor.getAttribute("href").split("/")[1]);
          if (blockedChannels.includes(username)) hide = true;
        }

        // === Category ===
        const categoryEl = item.querySelector("span.text-xs.font-bold");
        if (categoryEl) {
          const categoryName = normalizeData(categoryEl.textContent);
          if (blockedCategories.includes(categoryName)) hide = true;
        }

        item.style.display = hide ? "none" : "";
      });
  }

  async function addBlockButtonOnChannelPage() {
    const usernameEl = document.getElementById("channel-username");
    if (!usernameEl) return;
    if (document.getElementById("channelPageBlockBtn")) return;

    const username = usernameEl.textContent.trim();
    const btn = document.createElement("button");
    btn.id = "channelPageBlockBtn";
    btn.textContent = "X";
    btn.title = "Block this channel";
    Object.assign(btn.style, {
      marginLeft: "8px",
      color: "white",
      backgroundColor: "red",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      padding: "2px 8px",
      userSelect: "none",
      verticalAlign: "middle",
      lineHeight: "1",
    });

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await blockChannel(username);
      alert(`${username} blocked!`);
      location.reload();
    });

    const parent = usernameEl.parentElement;
    parent.style.display = "inline-flex";
    parent.style.alignItems = "center";
    parent.appendChild(btn);

    const blocked = await getBlockedChannels();
    const videoPlayer = document.getElementById("video-player");
    if (videoPlayer) {
      if (blocked.includes(normalizeData(username))) {
        videoPlayer.style.display = "none";
        if (typeof videoPlayer.pause === "function") videoPlayer.pause();
      } else {
        videoPlayer.style.display = "";
      }
    }
  }

  async function processCards() {
    document.querySelectorAll('[class*="group/card"]').forEach((card) => {
      if (card.querySelector(".block-btn")) return;

      const anchor = card.querySelector('a[href^="/"]');
      if (!anchor) return;

      const username = anchor.getAttribute("href").split("/")[1];
      const titleEl = card.querySelector("a[title]");
      if (!titleEl) return;

      const btn = createBlockButtonAbsolute(username);
      btn.classList.add("block-btn");
      titleEl.parentElement.appendChild(btn);
    });

    document
      .querySelectorAll("div.flex.w-full.shrink-0.grow-0.flex-col")
      .forEach((card) => {
        if (card.querySelector(".block-btn")) return;

        const anchor = card.querySelector('a[href^="/"]');
        if (!anchor) return;

        const username = anchor.getAttribute("href").split("/")[1];
        const followBtn = card.querySelector('button[aria-label="Takip Et"]');

        if (!followBtn) {
          return;
        }
        const btn = createBlockButton(username);
        btn.classList.add("block-btn");
        btn.style.marginLeft = "8px";
        followBtn.insertAdjacentElement("afterend", btn);
      });
  }

  async function processSidebarChannels() {
    const blocked = await getBlockedChannels();
    document
      .querySelectorAll('[data-testid^="sidebar-recommended-channel-"]')
      .forEach((anchor) => {
        const username = anchor.getAttribute("href")?.split("/")[1];
        if (!username) return;

        if (blocked.includes(normalizeData(username))) {
          anchor.style.display = "none";
          return;
        }

        if (anchor.querySelector(".sidebar-block-btn")) return;

        const btn = document.createElement("button");
        btn.textContent = "✕";
        btn.className = "sidebar-block-btn";
        btn.title = "Block this channel";
        btn.style.cssText = `
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(255, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 25%;
          width: 25px;
          height: 25px;
          font-size: 14px;
          display: none;
          cursor: pointer;
          z-index: 9999;
        `;

        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await blockChannel(username);
          await removeSidebarBlockedChannels();
          await processSidebarChannels();
        });

        anchor.style.position = "relative";
        anchor.addEventListener("mouseenter", () => {
          btn.style.display = "block";
        });
        anchor.addEventListener("mouseleave", () => {
          btn.style.display = "none";
        });

        anchor.appendChild(btn);
      });
  }

  async function observeBlockedChatMessages() {
    let blockedUsers = await getBlockedChannels();

    function normalize(name) {
      return name.trim().toLowerCase();
    }

    const waitForChatContainer = () =>
      new Promise((resolve) => {
        const check = () => {
          const container = document.querySelector("#chatroom-messages");
          if (container) return resolve(container);
          requestAnimationFrame(check);
        };
        check();
      });

    // Helper function to escape HTML meta-characters to prevent XSS
    function escapeHTML(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function hideChatMessage(node, username) {
      const content = node.querySelector('div[class*="betterhover"]');
      if (content) {
        content.innerHTML = `<span style="color: gray; font-style: italic;">[${username}]</span>`;
        content.style.opacity = "0.3";
      }
    }

    function processChatNode(node) {
      const userButton = node.querySelector("button[title]");
      if (!userButton) return;

      const usernameChatter = userButton.getAttribute("title");
      const normalizedChatter = normalize(usernameChatter);

      const isBlocked = blockedUsers.some(
        (blockedName) => normalize(blockedName) === normalizedChatter
      );

      if (isBlocked) {
        hideChatMessage(node, usernameChatter);
      }
    }

    const chatContainer = await waitForChatContainer();

    function debounce(fn, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    }

    const processAddedNodes = debounce((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const addedNode of mutation.addedNodes) {
          if (!(addedNode instanceof HTMLElement)) continue;
          if (addedNode.hasAttribute("data-index")) {
            processChatNode(addedNode);
          } else {
            addedNode.querySelectorAll("[data-index]").forEach(processChatNode);
          }
        }
      }
    }, 0);

    const chatObserver = new MutationObserver(processAddedNodes);

    chatObserver.observe(chatContainer, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      chatContainer.querySelectorAll("[data-index]").forEach(processChatNode);
    }, 1000);

    async function refreshBlockedUsers() {
      blockedUsers = await getBlockedChannels();
      chatContainer.querySelectorAll("[data-index]").forEach(processChatNode);
    }
    window.refreshBlockedUsers = refreshBlockedUsers;
  }

  async function observeChatUsernames() {
    const chatContainer = document.getElementById("chatroom-messages");
    if (!chatContainer) return;

    function debounce(fn, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    }

    async function addBlockButtonsToNodes(nodes) {
      nodes.forEach((msg) => {
        if (msg.querySelector(".username-block-btn")) return;

        const userButton = msg.querySelector("button[title]");
        if (!userButton) return;

        const btn = document.createElement("button");
        btn.textContent = "X";
        btn.title = "Block this channel";
        btn.className = "username-block-btn";
        Object.assign(btn.style, {
          marginLeft: "6px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "10px",
          padding: "0 4px",
          userSelect: "none",
          verticalAlign: "middle",
        });

        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const username = userButton.getAttribute("title").trim();
          await blockChannel(username);
          await removeBlockedCards();
          if (window.refreshBlockedUsers) {
            await window.refreshBlockedUsers();
          }
        });

        userButton.parentElement.appendChild(btn);
      });
    }

    await addBlockButtonsToNodes(
      Array.from(chatContainer.querySelectorAll("[data-index]"))
    );

    const observer = new MutationObserver(
      debounce((mutationsList) => {
        let addedNodes = [];
        for (const mutation of mutationsList) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.hasAttribute("data-index")) {
                addedNodes.push(node);
              } else {
                addedNodes.push(...node.querySelectorAll("[data-index]"));
              }
            }
          });
        }
        if (addedNodes.length) addBlockButtonsToNodes(addedNodes);
      }, 100)
    );

    observer.observe(chatContainer, { childList: true, subtree: true });
  }

  // search page
  function createBlockButton(username) {
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.title = "Block this channel";
    Object.assign(btn.style, {
      marginLeft: "8px",
      color: "white",
      backgroundColor: "red",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      padding: "2px 6px",
      userSelect: "none",
    });

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await blockChannel(username);
      await removeBlockedCards();
      await processCards();
      await processSidebarChannels();
    });

    return btn;
  }

  function createBlockButtonAbsolute(username) {
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.title = "Block this channel";
    btn.style.cssText = `
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(255, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 25%;
      width: 25px;
      height: 25px;
      font-size: 14px;
      cursor: pointer;
      z-index: 9999;
    `;
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await blockChannel(username);
      await removeBlockedCards();
      await processCards();
      await processSidebarChannels();
    });

    return btn;
  }

  // Menu for Tampermonkey/Violentmonkey/Userscript
  async function createToggleButtonAndPanel() {
    const toggleBtn = document.createElement("div");
    toggleBtn.id = "kickToggleBtn";
    toggleBtn.textContent = "K";
    Object.assign(toggleBtn.style, {
      position: "fixed",
      top: "15px",
      right: "5px",
      width: "26px",
      height: "26px",
      lineHeight: "26px",
      textAlign: "center",
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "#00B660",
      color: "white",
      borderRadius: "50%",
      cursor: "pointer",
      zIndex: "10000",
      boxShadow: "0 0 5px rgba(0,0,0,0.3)",
      userSelect: "none",
    });
    document.body.appendChild(toggleBtn);

    // Panel
    const panel = document.createElement("div");
    panel.id = "kickControlPanel";
    Object.assign(panel.style, {
      position: "fixed",
      top: "50px",
      right: "5px",
      backgroundColor: "#1e1e1e",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      zIndex: "9999",
      fontSize: "14px",
      fontFamily: "sans-serif",
      boxShadow: "0 0 15px rgba(0,0,0,0.7)",
      display: "none",
      width: "320px",
      maxHeight: "80vh",
      overflowY: "auto",
      boxSizing: "border-box",
    });

    panel.innerHTML = `
    <h1 style="color:#00b660; font-size:20px; margin-bottom:5px;">🛡️ uKick</h1>
    <div style="color:#888; font-size:12px; margin-bottom:15px; font-style: italic;">
      For Violentmonkey/Tampermonkey users
    </div>

    <section style="margin-bottom:25px;">
      <h2 style="color:#b2ff59; font-size:16px; margin-bottom:8px;">Channels</h2>
      <div style="display:flex; gap:8px; margin-bottom:8px; flex-wrap: wrap;">
        <button id="exportChannelsBtn" style="flex:1;">📤 Export</button>
        <button id="importChannelsBtn" style="flex:1;">📥 Import</button>
        <button id="clearChannelsBtn" style="flex:1;">🧹 Clear All</button>
        <button id="refreshChannelsBtn" style="flex:1;">🔄 Refresh</button>
      </div>
      <input type="text" id="channelInput" placeholder="Add channel..." style="width:100%; padding:8px; border-radius:4px; border:none; background:#333; color:#fff; font-size:14px;" />
      <button id="addChannelBtn" style="width:100%; margin-top:8px; background:#00b660; border:none; border-radius:4px; color:#fff; cursor:pointer; padding:8px;">➕ Add Channel</button>
      <ul id="channelList" style="list-style:none; padding:0; margin-top:12px; max-height:150px; overflow-y:auto;"></ul>
    </section>

    <section>
      <h2 style="color:#b2ff59; font-size:16px; margin-bottom:8px;">Categories</h2>
      <div style="display:flex; gap:8px; margin-bottom:8px; flex-wrap: wrap;">
        <button id="exportCategoriesBtn" style="flex:1;">📤 Export</button>
        <button id="importCategoriesBtn" style="flex:1;">📥 Import</button>
        <button id="clearCategoriesBtn" style="flex:1;">🧹 Clear All</button>
        <button id="refreshCategoriesBtn" style="flex:1;">🔄 Refresh</button>
      </div>
      <input type="text" id="categoryInput" placeholder="Add category..." style="width:100%; padding:8px; border-radius:4px; border:none; background:#333; color:#fff; font-size:14px;" />
      <button id="addCategoryBtn" style="width:100%; margin-top:8px; background:#00b660; border:none; border-radius:4px; color:#fff; cursor:pointer; padding:8px;">➕ Add Category</button>
      <ul id="categoryList" style="list-style:none; padding:0; margin-top:12px; max-height:150px; overflow-y:auto;"></ul>
    </section>
  `;

    document.body.appendChild(panel);

    toggleBtn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    function addListItem(listEl, name) {
      const li = document.createElement("li");
      li.style =
        "background:#2a2a2a; padding:6px 10px; margin-bottom:6px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; font-size:14px;";
      li.textContent = name;

      const btn = document.createElement("button");
      btn.textContent = "X";
      btn.style =
        "background:#d9534f; border:none; border-radius:4px; color:white; cursor:pointer; padding:3px 8px; font-size:13px;";
      btn.addEventListener("click", async () => {
        if (listEl.id === "channelList") {
          let channels = await getBlockedChannels();
          channels = channels.filter((c) => c !== name);
          await saveBlockedChannels(channels);
          renderChannels();
        } else {
          let categories = await getBlockedCategories();
          categories = categories.filter((c) => c !== name);
          await saveBlockedCategories(categories);
          renderCategories();
        }
      });

      li.appendChild(btn);
      listEl.appendChild(li);
    }

    async function renderChannels() {
      const list = panel.querySelector("#channelList");
      list.innerHTML = "";
      const channels = await getBlockedChannels();
      channels.forEach((name) => addListItem(list, name));
    }

    async function renderCategories() {
      const list = panel.querySelector("#categoryList");
      list.innerHTML = "";
      const categories = await getBlockedCategories();
      categories.forEach((name) => addListItem(list, name));
    }

    // Add
    panel
      .querySelector("#addChannelBtn")
      .addEventListener("click", async () => {
        const input = panel.querySelector("#channelInput");
        const val = input.value.trim();
        if (!val) return alert("Please enter a channel name");
        let channels = await getBlockedChannels();
        const normalized = normalizeData(val);
        if (channels.includes(normalized)) return alert("Already blocked");
        channels.push(normalized);
        await saveBlockedChannels(channels);
        input.value = "";
        renderChannels();
      });

    panel
      .querySelector("#addCategoryBtn")
      .addEventListener("click", async () => {
        const input = panel.querySelector("#categoryInput");
        const val = input.value.trim();
        if (!val) return alert("Please enter a category name");
        let categories = await getBlockedCategories();
        const normalized = normalizeData(val);
        if (categories.includes(normalized)) return alert("Already blocked");
        categories.push(normalized);
        await saveBlockedCategories(categories);
        input.value = "";
        renderCategories();
      });

    // Clear
    panel
      .querySelector("#clearChannelsBtn")
      .addEventListener("click", async () => {
        if (confirm("Clear all blocked channels?")) {
          await saveBlockedChannels([]);
          renderChannels();
        }
      });

    panel
      .querySelector("#clearCategoriesBtn")
      .addEventListener("click", async () => {
        if (confirm("Clear all blocked categories?")) {
          await saveBlockedCategories([]);
          renderCategories();
        }
      });

    // Export
    panel
      .querySelector("#exportChannelsBtn")
      .addEventListener("click", async () => {
        const data = await getBlockedChannels();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "blocked_channels.json";
        a.click();
        URL.revokeObjectURL(url);
      });

    panel
      .querySelector("#exportCategoriesBtn")
      .addEventListener("click", async () => {
        const data = await getBlockedCategories();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "blocked_categories.json";
        a.click();
        URL.revokeObjectURL(url);
      });

    // Import
    panel.querySelector("#importChannelsBtn").addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            await saveBlockedChannels(parsed.map(normalizeData));
            renderChannels();
            alert("Imported successfully.");
          } else alert("Invalid format.");
        } catch {
          alert("Invalid JSON.");
        }
      };
      input.click();
    });

    panel
      .querySelector("#importCategoriesBtn")
      .addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const text = await file.text();
          try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              await saveBlockedCategories(parsed.map(normalizeData));
              renderCategories();
              alert("Imported successfully.");
            } else alert("Invalid format.");
          } catch {
            alert("Invalid JSON.");
          }
        };
        input.click();
      });

    // Refresh
    panel
      .querySelector("#refreshChannelsBtn")
      .addEventListener("click", renderChannels);
    panel
      .querySelector("#refreshCategoriesBtn")
      .addEventListener("click", renderCategories);

    renderChannels();
    renderCategories();
  }

  function debounce(fn, delay = 25) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(), delay);
    };
  }

  // ==== Tampermonkey/Violentmonkey UserScript ====

  (async () => {
    let observer = null;

    async function startProcessing() {
      await processCards();
      await processSidebarChannels();
      await processCategoryCards();
      await removeBlockedCards();
      await removeSidebarBlockedChannels();
      await removeBlockedCategoryCards();
      await addBlockButtonOnChannelPage();
      await observeBlockedChatMessages();
      await observeChatUsernames();
    }

    function startObserver() {
      if (observer) return;

      observer = new MutationObserver(
        debounce(async () => {
          await startProcessing();
        }, 50)
      );

      observer.observe(document.body, { childList: true, subtree: true });
    }

    startObserver();
    await createToggleButtonAndPanel();
    await startProcessing();
  })();

})();
