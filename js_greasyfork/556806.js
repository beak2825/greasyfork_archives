// ==UserScript==
// @name         Torn War Timers
// @namespace    tibit.torn.war.timers
// @version      1.0
// @description  Replaces "Hospital" text with countdown timers using the Torn API.
// @author       Tibit [2023328]
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556806/Torn%20War%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/556806/Torn%20War%20Timers.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  const UPDATE_INTERVAL_API = 30 * 1000; // Fetch API every 30 seconds
  const UPDATE_INTERVAL_UI = 1000; // Update Timer Text every 1 second
  const STORAGE_KEY_API = "tibit_war_api_key";
  const STORAGE_KEY_MINIMIZED = "tibit_war_minimized";

  // --- STATE ---
  let hospitalTimers = {}; // Map<UserID, Timestamp>
  let myFactionId = null;
  let enemyFactionId = null;
  let apiKey = GM_getValue(STORAGE_KEY_API, "");
  let isMinimized = GM_getValue(STORAGE_KEY_MINIMIZED, false);
  let apiKeyValid = false; // Track if API key has been validated

  // --- UI ELEMENTS ---
  let modalContainer, stickyBtn;

  // --- CSS STYLES ---
  GM_addStyle(`
        :root {
            --tibit-bg: rgba(15, 15, 20, 0.85);
            --tibit-border: rgba(255, 255, 255, 0.1);
            --tibit-accent: #00ffcc;
            --tibit-accent-glow: rgba(0, 255, 204, 0.4);
            --tibit-text: #f0f0f0;
            --tibit-text-dim: #888;
        }

        /* --- POLISHED STICKY BUTTON --- */
        #tibit-sticky-btn {
            position: fixed;
            bottom: 50dvh;
            right: 25px;
            width: 54px;
            height: 54px;
            background: linear-gradient(145deg, rgba(20,20,25,0.9), rgba(10,10,15,0.95));
            backdrop-filter: blur(5px);
            border: 1px solid var(--tibit-border);
            border-radius: 14px; /* Squircle shape */
            color: var(--tibit-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99998;
            box-shadow:
                0 4px 10px rgba(0,0,0,0.5),
                0 0 0 1px rgba(0, 255, 204, 0.1),
                inset 0 1px 0 rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-size: 22px;
            overflow: hidden;
        }

        /* Hover State */
        #tibit-sticky-btn:hover {
            transform: translateY(-3px) scale(1.02);
            border-color: var(--tibit-accent);
            box-shadow:
                0 8px 20px rgba(0,0,0,0.6),
                0 0 15px var(--tibit-accent-glow);
            color: #fff;
        }

        /* Active/Click State */
        #tibit-sticky-btn:active {
            transform: translateY(0) scale(0.95);
        }

        /* Radar Ping Animation Element */
        #tibit-sticky-btn::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 14px;
            box-shadow: 0 0 0 2px var(--tibit-accent);
            opacity: 0;
            z-index: -1;
            animation: tibitPulse 2s infinite;
        }

        /* Icon Adjustment */
        .tibit-btn-icon {
            filter: drop-shadow(0 0 5px var(--tibit-accent-glow));
        }

        /* Hide state */
        #tibit-sticky-btn.hidden {
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
        }

        /* Animation Keyframes */
        @keyframes tibitPulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        /* MODAL CONTAINER */
        #tibit-modal {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 350px;
            background: var(--tibit-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--tibit-border);
            border-top: 3px solid var(--tibit-accent);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            z-index: 99999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: var(--tibit-text);
            overflow: hidden;
            transition: opacity 0.3s, transform 0.3s;
        }
        #tibit-modal.minimized {
            display: none;
        }

        /* HEADER */
        .tibit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(255,255,255,0.03);
            border-bottom: 1px solid var(--tibit-border);
        }
        .tibit-title {
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            letter-spacing: 0.5px;
        }
        .tibit-minimize-btn {
            background: none;
            border: none;
            color: var(--tibit-text-dim);
            cursor: pointer;
            font-size: 18px;
            transition: color 0.2s;
            top: -15px;
            right: -8px;
            position: relative;
        }
        .tibit-minimize-btn:hover { color: #fff; }

        /* CONTENT */
        .tibit-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .tibit-label {
            font-size: 12px;
            color: var(--tibit-text-dim);
            margin-bottom: 5px;
        }
        .tibit-input {
            width: 100%;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--tibit-border);
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            font-family: monospace;
            box-sizing: border-box;
            outline: none;
        }
        .tibit-input:focus { border-color: var(--tibit-accent); }

        .tibit-link {
            font-size: 12px;
            color: var(--tibit-accent);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .tibit-link:hover { text-decoration: underline; }

        .tibit-save-btn {
            background: linear-gradient(135deg, #00b09b, #96c93d); /* Modern Gradient */
            border: none;
            padding: 10px;
            border-radius: 6px;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            transition: filter 0.2s;
        }
        .tibit-save-btn:hover { filter: brightness(1.1); }

        /* FOOTER / CREDIT */
        .tibit-footer {
            padding: 10px 20px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid var(--tibit-border);
            text-align: center;
            font-size: 11px;
            color: var(--tibit-text-dim);
        }
        .tibit-credit-link {
            color: var(--tibit-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .tibit-credit-link:hover { text-decoration: underline; }

        /* NATIVE PAGE OVERRIDES */
        .tibit-timer-active {
            font-family: monospace;
            font-weight: bold;
            color: #ff6b6b; /* Hospital Red */
            background: rgba(0,0,0,0.2);
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* --- EASTER EGG STYLES --- */
        .tibit-duck {
            position: fixed;
            width: 100px;
            height: 100px;
            border-radius: 50%; /* Makes the image rounded */
            pointer-events: none; /* Allows clicking through them */
            z-index: 200000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            animation: duckPop 0.5s ease-out forwards, duckFloat 3s ease-in forwards;
        }

        @keyframes duckPop {
            0% { transform: scale(0) rotate(-15deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(15deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes duckFloat {
            0% { transform: translateY(0px); opacity: 1; }
            100% { transform: translateY(-100vh); opacity: 0; }
        }
    `);

  // --- DOM EXTRACTION ---

  let domObserver = null;
  let statusObserver = null;
  let factionIdsFound = false;
  let refetchDebounceTimer = null;

  function extractFactionIdsFromPage() {
    // Find current faction (our side)
    const currentFactionLink = document.querySelector(
      'a[class*="currentFactionName"]'
    );
    if (currentFactionLink) {
      const match = currentFactionLink.href.match(/ID=(\d+)/);
      if (match) {
        myFactionId = parseInt(match[1]);
      }
    }

    // Find opponent faction
    const opponentFactionLink = document.querySelector(
      'a[class*="opponentFactionName"]'
    );
    if (opponentFactionLink) {
      const match = opponentFactionLink.href.match(/ID=(\d+)/);
      if (match) {
        enemyFactionId = parseInt(match[1]);
      }
    }

    return myFactionId && enemyFactionId;
  }

  function startWatchingForFactionLinks() {
    // Try immediately first
    if (extractFactionIdsFromPage()) {
      factionIdsFound = true;
      fetchFactionData();

      // Start watching for status changes
      startWatchingStatusChanges();
      return;
    }

    // Set up MutationObserver to watch for DOM changes
    domObserver = new MutationObserver(() => {
      if (!factionIdsFound && extractFactionIdsFromPage()) {
        factionIdsFound = true;
        domObserver.disconnect();
        fetchFactionData();

        // Start watching for status changes
        startWatchingStatusChanges();
      }
    });

    // Start observing
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function startWatchingStatusChanges() {
    // Find both member list containers
    const memberLists = document.querySelectorAll('ul[class*="members-list"]');

    if (memberLists.length === 0) {
      // Retry after a delay
      setTimeout(startWatchingStatusChanges, 2000);
      return;
    }

    // Regex to detect timer format (HH:MM:SS)
    const timerPattern = /^\d{2}:\d{2}:\d{2}$/;

    // Create observer for status changes
    statusObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if a status div's text content changed
        if (
          mutation.type === "characterData" ||
          mutation.type === "childList"
        ) {
          const target = mutation.target;
          const statusDiv =
            target.nodeType === Node.TEXT_NODE ? target.parentElement : target;

          // Check if this is a status div
          if (
            statusDiv &&
            statusDiv.classList &&
            Array.from(statusDiv.classList).some((cls) =>
              cls.includes("status")
            )
          ) {
            const newText = statusDiv.textContent.trim();
            const oldText = mutation.oldValue ? mutation.oldValue.trim() : "";

            // IGNORE timer countdown updates (e.g., "05:23:45" -> "05:23:44")
            if (timerPattern.test(newText) && timerPattern.test(oldText)) {
              return; // Both are timers, this is just a countdown tick
            }

            // IGNORE if both old and new are timers or same value
            if (oldText === newText) {
              return;
            }

            // Detect meaningful status changes: "Okay" <-> something else (but not timer)
            const isOkayToOther =
              oldText === "Okay" &&
              newText !== "Okay" &&
              !timerPattern.test(newText);
            const isOtherToOkay =
              oldText !== "Okay" &&
              !timerPattern.test(oldText) &&
              newText === "Okay";

            if (isOkayToOther || isOtherToOkay) {
              // Debounce refetch to avoid spam
              if (refetchDebounceTimer) {
                clearTimeout(refetchDebounceTimer);
              }
              refetchDebounceTimer = setTimeout(() => {
                fetchFactionData();
              }, 1000); // Wait 1 second before refetching
            }
          }
        }
      });
    });

    // Observe each member list
    memberLists.forEach((list, index) => {
      statusObserver.observe(list, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
      });
    });
  }

  // --- API FUNCTIONS ---

  function fetchFactionData() {
    if (!apiKey || apiKey.length < 10) {
      updateStatus("⚠️ Key Required");
      return;
    }

    if (!myFactionId || !enemyFactionId) {
      updateStatus("⏳ Waiting for War Page...");
      return;
    }

    updateStatus("⏳ Fetching...");

    // Fetch both factions' members
    fetchFactionDetails(myFactionId, true);
    fetchFactionDetails(enemyFactionId, false);
  }

  function fetchTornData() {
    // This is called by the interval - check if we have faction IDs
    if (factionIdsFound) {
      fetchFactionData();
    }
  }

  function fetchFactionDetails(facId, isMine) {
    const factionUrl = `https://api.torn.com/faction/${facId}?selections=basic&key=${apiKey}`;

    GM_xmlhttpRequest({
      method: "GET",
      url: factionUrl,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);

          if (data.error) {
            updateStatus("❌ API Error");
            showUIForAPIError();
            return;
          }

          processMembers(data.members, isMine);
          updateStatus("✅ Active");

          // Hide UI on successful API call
          if (!apiKeyValid) {
            hideUI();
          }
        } catch (e) {
          updateStatus("❌ Parse Error");
          showUIForAPIError();
        }
      },
      onerror: function (response) {
        updateStatus("❌ Network Error");
        showUIForAPIError();
      },
    });
  }

  function processMembers(membersList, isMine) {
    if (!membersList) {
      return;
    }

    // Use Object.entries to get both the member ID (key) and member data (value)
    Object.entries(membersList).forEach(([memberId, member]) => {
      if (member.status.state === "Hospital") {
        hospitalTimers[memberId] = member.status.until;
      } else {
        // If they are okay, remove them from timers map
        delete hospitalTimers[memberId];
      }
    });
  }

  function updateStatus(msg) {
    const title = document.getElementById("tibit-modal-title");
    if (title) title.textContent = `War Timers - ${msg}`;
  }

  // --- EASTER EGG LOGIC ---
  const DUCK_SOUND_URL = "https://www.myinstants.com/media/sounds/quack.mp3";

  function triggerEasterEgg() {
    const duckSound = new Audio(DUCK_SOUND_URL);
    duckSound.volume = 0.5;
    duckSound.play().catch(() => {}); // Play sound, ignore autoplay errors

    // Spawn 15 ducks randomly
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const img = document.createElement("img");
        img.src = "https://i.imgur.com/EP1fvRv.png";
        img.className = "tibit-duck";

        // Random positioning
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        // Random size variation
        const size = 80 + Math.random() * 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;

        document.body.appendChild(img);

        // Cleanup after animation ends
        setTimeout(() => img.remove(), 3500);
      }, i * 150); // Stagger the spawns
    }
  }

  // --- DOM UPDATE LOOPS ---

  function updatePageTimers() {
    // Find all rows (Friendly and Enemy)
    const rows = document.querySelectorAll("li.enemy, li.your, .table-row");
    const now = Date.now() / 1000;

    if (rows.length === 0) {
      return;
    }

    rows.forEach((row, index) => {
      // Find ID
      const link = row.querySelector('a[href*="XID="]');
      if (!link) {
        return;
      }
      const match = link.href.match(/XID=(\d+)/);
      if (!match) {
        return;
      }
      const userId = parseInt(match[1]);

      // Find Status Node
      const statusNode = row.querySelector(".status");
      if (!statusNode) {
        return;
      }

      // Check if we have data
      if (hospitalTimers[userId]) {
        const until = hospitalTimers[userId];
        const remaining = until - now;

        if (remaining > 0) {
          const h = Math.floor(remaining / 3600);
          const m = Math.floor((remaining % 3600) / 60);
          const s = Math.floor(remaining % 60);

          const timeStr = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

          if (statusNode.textContent !== timeStr) {
            statusNode.textContent = timeStr;
          }
        } else {
          // Timer expired but API hasn't refreshed yet
          if (statusNode.textContent !== "Hospital") {
            statusNode.textContent = "Hospital";
          }
        }
      }
    });
  }

  // --- UI CONSTRUCTION ---

  function showUIForAPIError() {
    // Respect user's minimize choice - don't force modal back open
    apiKeyValid = false;

    if (isMinimized) {
      // User has minimized, just show the sticky button
      if (stickyBtn) {
        stickyBtn.classList.remove("hidden");
      }
    } else {
      // Modal not minimized, show it (keep button hidden)
      if (modalContainer) {
        modalContainer.classList.remove("minimized");
      }
      if (stickyBtn) {
        stickyBtn.classList.add("hidden");
      }
    }
  }

  function hideUI() {
    // Hide both button and modal when API key is valid
    if (stickyBtn) {
      stickyBtn.classList.add("hidden");
    }
    if (modalContainer) {
      modalContainer.classList.add("minimized");
    }
    isMinimized = true;
    apiKeyValid = true;
  }

  function createUI() {
    // 1. Sticky Button (Redesigned)
    stickyBtn = document.createElement("div");
    stickyBtn.id = "tibit-sticky-btn";
    // We use a span for the icon to apply specific drop-shadow filters
    stickyBtn.innerHTML = '<span class="tibit-btn-icon">⚔️</span>';
    stickyBtn.title = "War Timers Configuration";
    stickyBtn.onclick = () => toggleModal(false); // Open
    stickyBtn.classList.add("hidden"); // Hidden by default
    document.body.appendChild(stickyBtn);

    // 2. Modal
    modalContainer = document.createElement("div");
    modalContainer.id = "tibit-modal";
    modalContainer.classList.add("minimized"); // Hidden by default

    modalContainer.innerHTML = `
            <div class="tibit-header">
                <span class="tibit-title" id="tibit-modal-title">War Timers - Setup</span>
                <button class="tibit-minimize-btn" title="Minimize">_</button>
            </div>
            <div class="tibit-content">
                <div>
                    <div class="tibit-label">PUBLIC API KEY</div>
                    <input type="text" id="tibit-api-input" class="tibit-input" placeholder="Enter Key..." value="${apiKey}">
                </div>
                <div>
                    <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" class="tibit-link">
                        <span>🔗 Get API Key (Settings)</span>
                    </a>
                </div>
                <button id="tibit-save-btn" class="tibit-save-btn">SAVE & START</button>
            </div>
            <div class="tibit-footer">
                Made by <a href="https://www.torn.com/profiles.php?XID=2023328" target="_blank" class="tibit-credit-link">Tibit [2023328]</a>
            </div>
        `;

    document.body.appendChild(modalContainer);

    // Events
    modalContainer.querySelector(".tibit-minimize-btn").onclick = () =>
      toggleModal(true);

    // Easter Egg: Duck input trigger
    const apiInput = document.getElementById("tibit-api-input");
    apiInput.addEventListener("input", (e) => {
      if (e.target.value.toLowerCase() === "duck") {
        triggerEasterEgg();
      }
    });

    document.getElementById("tibit-save-btn").onclick = () => {
      const input = document.getElementById("tibit-api-input");
      const newKey = input.value.trim();
      if (newKey) {
        apiKey = newKey;
        GM_setValue(STORAGE_KEY_API, apiKey);

        // Don't hide UI yet - let API validation determine that
        // Start watching for faction links
        if (!factionIdsFound) {
          startWatchingForFactionLinks();
        } else {
          fetchFactionData();
        }

        updateStatus("Validating...");
      }
    };

    // If no key exists, show UI for setup
    if (!apiKey || apiKey.length < 10) {
      showUIForAPIError();
    } else {
      // Key exists, start watching for faction links
      startWatchingForFactionLinks();
    }
  }

  function toggleModal(minimize) {
    isMinimized = minimize;
    GM_setValue(STORAGE_KEY_MINIMIZED, isMinimized);

    if (isMinimized) {
      modalContainer.classList.add("minimized");
      stickyBtn.classList.remove("hidden");
    } else {
      modalContainer.classList.remove("minimized");
      stickyBtn.classList.add("hidden");
    }
  }

  // --- INITIALIZATION ---

  function init() {
    createUI();

    // Loop 1: API Fetch (Every 30s) - only if faction IDs found
    setInterval(fetchTornData, UPDATE_INTERVAL_API);

    // Loop 2: UI Update (Every 1s)
    setInterval(updatePageTimers, UPDATE_INTERVAL_UI);
  }

  init();
})();
