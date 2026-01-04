// ==UserScript==
// @name         Torn Hosp Timers on Faction Page
// @namespace    swervelord.dev/
// @version      1.0
// @description  Show hospital timers on war page with custom font
// @author       swervelord
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/555175/Torn%20Hosp%20Timers%20on%20Faction%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/555175/Torn%20Hosp%20Timers%20on%20Faction%20Page.meta.js
// ==/UserScript==

(function() {
  "use strict";

  console.log("[TornHospTimers] Script starting...");

  if (document.querySelector("div#FFScouterV2DisableWarMonitor")) {
    console.log("[TornHospTimers] Already running, exiting...");
    return;
  }

  const ffScouterV2DisableWarMonitor = document.createElement("div");
  ffScouterV2DisableWarMonitor.id = "FFScouterV2DisableWarMonitor";
  ffScouterV2DisableWarMonitor.style.display = "none";
  document.documentElement.appendChild(ffScouterV2DisableWarMonitor);

  const STORAGE_KEY = "swervelord-torn-hosp-timers-apikey";
  const OLD_STORAGE_KEY = "xentac-torn_war_stuff_enhanced-apikey";

  // Check for old key and remove it
  const oldKey = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldKey) {
    console.log("[TornHospTimers] Found old API key, removing it...");
    localStorage.removeItem(OLD_STORAGE_KEY);
  }

  let apiKey = localStorage.getItem(STORAGE_KEY);
  const sort_enemies = true;
  let ever_sorted = false;
  const CONTENT = "data-twse-content";
  const HIGHLIGHT = "data-twse-highlight";
  const HOSPITAL = "data-twse-hospital";

  console.log("[TornHospTimers] API Key status:", apiKey ? "Found" : "Not found");

  // Prompt for API key if not set or invalid
  function promptForApiKey(message) {
    console.log("[TornHospTimers] Showing prompt dialog...");
    let userInput = prompt(message, apiKey || "");

    if (userInput === null) {
      console.log("[TornHospTimers] User cancelled the prompt");
      return null;
    }

    userInput = userInput.trim();
    console.log("[TornHospTimers] User entered key of length:", userInput.length);

    if (userInput.length === 16) {
      apiKey = userInput;
      localStorage.setItem(STORAGE_KEY, apiKey);
      console.log("[TornHospTimers] API Key saved!");
      alert("API Key saved successfully! The script will now fetch hospital timers.");
      return apiKey;
    } else {
      console.log("[TornHospTimers] Invalid key length");
      alert("Invalid API Key. Please enter exactly 16 characters.\n\nYou can try again by refreshing the page or using the Tampermonkey menu.");
      return null;
    }
  }

  // Check if we need to prompt for API key
  console.log("[TornHospTimers] Checking if API key is valid...");
  if (!apiKey || apiKey.length !== 16) {
    console.log("[TornHospTimers] API key is invalid or missing, will prompt user");
    const result = promptForApiKey(
      "Torn Hospital Timers - Setup\n\n" +
      "Please enter your Torn API Key (16 characters):\n\n" +
      "This will be saved locally and used to fetch hospital timers.\n\n" +
      "You can get an API key from:\n" +
      "Settings > API Keys > Create"
    );

    if (!result) {
      console.log("[TornHospTimers] No valid API key provided, exiting");
      return;
    }
  } else {
    console.log("[TornHospTimers] Valid API key found in storage");
  }

  // Register menu commands
  try {
    GM_registerMenuCommand("Change API Key", function() {
      console.log("[TornHospTimers] Menu: Change API Key clicked");
      promptForApiKey("Torn Hospital Timers\n\nEnter your Torn API Key (16 characters):");
      if (apiKey) {
        alert("Please refresh the page for changes to take effect.");
      }
    });

    GM_registerMenuCommand("Clear API Key", function() {
      console.log("[TornHospTimers] Menu: Clear API Key clicked");
      if (confirm("Are you sure you want to clear the saved API key?")) {
        localStorage.removeItem(STORAGE_KEY);
        apiKey = null;
        console.log("[TornHospTimers] API Key cleared");
        alert("API Key cleared. Refresh the page to enter a new one.");
      }
    });

    console.log("[TornHospTimers] Menu commands registered");
  } catch (error) {
    console.error("[TornHospTimers] Could not register menu commands:", error);
  }

  // Import Inter Black font from Google Fonts
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  GM_addStyle(`
.members-list li:has(div.status[data-twse-highlight="true"]) {
  background-color: #afa5 !important;
}
`);

  GM_addStyle(`
.members-list div.status {
  position: relative !important;
  color: transparent !important;
  overflow: hidden !important;
}
.members-list div.status::after {
  content: attr(data-twse-content);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: inherit;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5px;
  box-sizing: border-box;
}

/* Apply Inter font ONLY to hospital timers */
.members-list div.status[data-twse-hospital="true"]::after {
  font-family: 'Inter', sans-serif !important;
  font-weight: 900 !important;
  letter-spacing: -0.5px;
}

.members-list .ok.status::after {
    color: var(--user-status-green-color);
}

.members-list .not-ok.status::after {
    color: var(--user-status-red-color);
}
`);

  let running = true;
  let found_war = false;

  function get_faction_ids() {
    const nodes = get_member_lists();
    const faction_ids = [];
    nodes.forEach((elem) => {
      const link = elem.querySelector("A[href^='/factions.php']");
      if (link) {
        const id = link.href.split("ID=")[1];
        if (id) {
          faction_ids.push(id);
        }
      }
    });
    console.log("[TornHospTimers] Found faction IDs:", faction_ids);
    return faction_ids;
  }

  function get_member_lists() {
    return document.querySelectorAll("ul.members-list");
  }

  function get_sorted_column(member_list) {
    const member_div = member_list.parentNode.querySelector("div.member div");
    const level_div = member_list.parentNode.querySelector("div.level div");
    const points_div = member_list.parentNode.querySelector("div.points div");
    const status_div = member_list.parentNode.querySelector("div.status div");

    let column = null;
    let order = null;
    let classname = "";

    if (member_div && member_div.className.match(/activeIcon__/)) {
      column = "member";
      classname = member_div.className;
    } else if (level_div && level_div.className.match(/activeIcon__/)) {
      column = "level";
      classname = level_div.className;
    } else if (points_div && points_div.className.match(/activeIcon__/)) {
      column = "points";
      classname = points_div.className;
    } else if (status_div && status_div.className.match(/activeIcon__/)) {
      column = "status";
      classname = status_div.className;
    }

    if (classname.match(/asc__/)) {
      order = "asc";
    } else {
      order = "desc";
    }

    if (column != "score" && order != "desc") {
      ever_sorted = true;
    }

    return { column: column, order: order };
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.classList && node.classList.contains("faction-war")) {
          console.log("[TornHospTimers] Detected .faction-war node");
          found_war = true;
          extract_all_member_lis();
        }
      }
    }
  });

  setTimeout(() => {
    const warElement = document.querySelector(".faction-war");
    console.log("[TornHospTimers] Checking for .faction-war element:", warElement ? "FOUND" : "NOT FOUND");
    if (warElement) {
      found_war = true;
      extract_all_member_lis();
    }
  }, 500);

  function pad_with_zeros(n) {
    if (n < 10) {
      return "0" + n;
    }
    return n;
  }

  const wrapper = document.body;
  observer.observe(wrapper, { subtree: true, childList: true });

  const member_status = new Map();
  const member_lis = new Map();

  let last_request = null;
  const MIN_TIME_SINCE_LAST_REQUEST = 9000;

  async function update_statuses() {
    if (!running) {
      return;
    }
    if (last_request && new Date() - last_request < MIN_TIME_SINCE_LAST_REQUEST) {
      return;
    }
    last_request = new Date();
    const faction_ids = get_faction_ids();
    for (let i = 0; i < faction_ids.length; i++) {
      if (!update_status(faction_ids[i])) {
        return;
      }
    }
  }

  async function update_status(faction_id) {
    let error = false;
    console.log("[TornHospTimers] Fetching faction " + faction_id + "...");
    const status = await fetch(
      "https://api.torn.com/faction/" + faction_id + "?selections=basic&key=" + apiKey + "&comment=TornHospTimers"
    )
      .then((r) => r.json())
      .catch((m) => {
        console.error("[TornHospTimers] Fetch error:", m);
        error = true;
      });
    if (error) {
      return true;
    }
    if (status.error) {
      console.error("[TornHospTimers] API Error:", status.error);
      if ([0, 1, 2, 3, 4, 6, 7, 10, 12, 13, 14, 16, 18, 21].includes(status.error.code)) {
        console.log("[TornHospTimers] Non-recoverable error, stopping");
        alert("API Error: " + status.error.error + "\n\nPlease check your API key using the Tampermonkey menu.");
        running = false;
        return false;
      }
      if ([5, 8, 9].includes(status.error.code)) {
        console.log("[TornHospTimers] Rate limit hit, will retry");
        last_request = new Date() + 30000;
      }
      return false;
    }
    if (!status.members) {
      console.log("[TornHospTimers] No members data in response");
      return false;
    }
    console.log("[TornHospTimers] Loaded " + Object.keys(status.members).length + " members");
    for (const k in status.members) {
      member_status.set(k, status.members[k]);
    }
    return true;
  }

  function extract_all_member_lis() {
    member_lis.clear();
    get_member_lists().forEach((ul) => {
      extract_member_lis(ul);
    });
    console.log("[TornHospTimers] Extracted " + member_lis.size + " member elements");
  }

  function extract_member_lis(ul) {
    const lis = ul.querySelectorAll("LI.enemy, li.your");
    lis.forEach((li) => {
      const atag = li.querySelector("A[href^='/profiles.php']");
      if (!atag) {
        return;
      }
      const id = atag.href.split("ID=")[1];
      member_lis.set(id, li);
    });
  }

  let last_frame = new Date();
  const TIME_BETWEEN_FRAMES = 500;

  function watch() {
    if (!found_war) {
      requestAnimationFrame(watch);
      return;
    }
    if (new Date() - last_frame < TIME_BETWEEN_FRAMES) {
      requestAnimationFrame(watch);
      return;
    }
    last_frame = new Date();
    member_lis.forEach((li, id) => {
      const state = member_status.get(id);
      const status_DIV = li.querySelector("DIV.status");
      if (!status_DIV) {
        return;
      }
      if (!state || !running) {
        status_DIV.setAttribute(CONTENT, status_DIV.innerText);
        status_DIV.setAttribute(HOSPITAL, "false");
        return;
      }
      const status = state.status;

      li.setAttribute("data-until", status.until);

      if (status.state === "Hospital") {
        if (!status_DIV.classList.contains("hospital")) {
          status_DIV.setAttribute(CONTENT, status_DIV.innerText);
          status_DIV.setAttribute(HIGHLIGHT, "false");
          status_DIV.setAttribute(HOSPITAL, "false");
        } else {
          li.setAttribute("data-sortA", "1");

          let now = new Date().getTime() / 1000;
          if (window.getCurrentTimestamp) {
            now = window.getCurrentTimestamp() / 1000;
          }
          const hosp_time_remaining = Math.round(status.until - now);
          if (hosp_time_remaining <= 0) {
            status_DIV.setAttribute(HIGHLIGHT, "false");
            status_DIV.setAttribute(HOSPITAL, "false");
            status_DIV.setAttribute(CONTENT, status_DIV.innerText);
            return;
          }
          const s = Math.floor(hosp_time_remaining % 60);
          const m = Math.floor((hosp_time_remaining / 60) % 60);
          const h = Math.floor(hosp_time_remaining / 60 / 60);
          const time_string = pad_with_zeros(h) + ":" + pad_with_zeros(m) + ":" + pad_with_zeros(s);

          if (status_DIV.getAttribute(CONTENT) != time_string) {
            status_DIV.setAttribute(CONTENT, time_string);
          }

          // Mark this as a hospital timer so Inter font applies
          status_DIV.setAttribute(HOSPITAL, "true");

          if (hosp_time_remaining < 300) {
            status_DIV.setAttribute(HIGHLIGHT, "true");
          } else {
            status_DIV.setAttribute(HIGHLIGHT, "false");
          }
        }
      } else {
        status_DIV.setAttribute(CONTENT, status_DIV.innerText);
        li.setAttribute("data-sortA", "0");
        status_DIV.setAttribute(HIGHLIGHT, "false");
        status_DIV.setAttribute(HOSPITAL, "false");
      }
    });

    if (sort_enemies) {
      const nodes = get_member_lists();
      for (let i = 0; i < nodes.length; i++) {
        let sorted_column = get_sorted_column(nodes[i]);
        if (!ever_sorted) {
          sorted_column = { column: "status", order: "asc" };
        }
        if (sorted_column["column"] != "status") {
          continue;
        }
        let lis = nodes[i].querySelectorAll("LI.enemy, li.your");
        let sorted_lis = Array.from(lis).sort((a, b) => {
          let left = a;
          let right = b;
          if (sorted_column["order"] == "desc") {
            left = b;
            right = a;
          }
          const sorta = left.getAttribute("data-sortA") - right.getAttribute("data-sortA");
          if (sorta != 0) {
            return sorta;
          }
          return left.getAttribute("data-until") - right.getAttribute("data-until");
        });
        let sorted = true;
        for (let j = 0; j < sorted_lis.length; j++) {
          if (nodes[i].children[j] !== sorted_lis[j]) {
            sorted = false;
            break;
          }
        }
        if (!sorted) {
          sorted_lis.forEach((li) => {
            nodes[i].appendChild(li);
          });
        }
      }
    }
    requestAnimationFrame(watch);
  }

  function settimeout_update_statuses() {
    update_statuses();
    setTimeout(() => {
      settimeout_update_statuses();
    }, 1000);
  }
  settimeout_update_statuses();

  setTimeout(() => {
    requestAnimationFrame(watch);
  }, 1000);

  console.log("[TornHospTimers] Initialized successfully!");

  window.dispatchEvent(new Event("FFScouterV2DisableWarMonitor"));
})();